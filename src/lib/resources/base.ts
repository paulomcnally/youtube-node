import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as queryString from 'querystring';
import {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} from '../errors';
import {
  Callback,
  RetryOptions,
  YouTubeOptions,
  YtResult,
} from '../../types';

/**
 * Estructura de error de la API de YouTube
 */
interface YouTubeApiError {
  error?: {
    message?: string;
    code?: string;
    errors?: Array<{
      message?: string;
      domain?: string;
      reason?: string;
    }>;
  };
}

/**
 * Parsea un error de axios/YouTube API y retorna la clase de error apropiada
 * @param error - Error de axios
 * @returns Clase de error específica
 */
function parseError(error: AxiosError): YouTubeError {
  // Error de red (no response)
  if (error.request && !error.response) {
    return new NetworkError('No response received from server', error);
  }

  // Error con respuesta del servidor
  if (error.response) {
    const { status } = error.response;
    const data = (error.response.data as YouTubeApiError) || {};
    const errorData = data.error || {};
    const message = errorData.message || 'Unknown error';
    const code = errorData.code || errorData.errors?.[0]?.reason || undefined;
    const errors = errorData.errors || [];

    // Determinar tipo de error según status y código
    if (status === 403 && (code === 'quotaExceeded' || message.toLowerCase().includes('quota'))) {
      return new QuotaExceededError(message, code, status, errors, error.response);
    }

    if (status === 400 && (code === 'keyInvalid' || message.toLowerCase().includes('api key'))) {
      return new InvalidKeyError(message, code, status, errors, error.response);
    }

    if (status === 404 || code === 'notFound') {
      return new ResourceNotFoundError(message, code, status, errors, error.response);
    }

    if (status === 429 || code === 'rateLimitExceeded') {
      return new RateLimitError(message, code, status, errors, error.response);
    }

    // Error genérico de YouTube
    return new YouTubeError(message, code || null, status, errors, error.response);
  }

  // Error de configuración o setup
  return new YouTubeError(error.message, 'setupError', null, [], null);
}

/**
 * Calcula el delay para retry con backoff exponencial
 * @param attempt - Número de intento (0-based)
 * @param baseDelay - Delay base en ms
 * @param maxDelay - Delay máximo en ms
 * @returns Delay en ms
 */
function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * 2 ** attempt;
  const jitter = Math.random() * 100; // Agregar jitter para evitar thundering herd
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Opciones por defecto para retry
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> & Pick<RetryOptions, 'onRetry'> = {
  retries: 3,
  retryDelay: 1000,
  maxRetryDelay: 30000,
  retryCondition: (error: Error): boolean => {
    // Solo reintentar errores recuperables
    if (error instanceof YouTubeError) {
      return error.isRetriable();
    }
    return false;
  },
  onRetry: undefined,
};

/**
 * Clase base para recursos de YouTube API
 * Contiene la lógica compartida de HTTP, retry y manejo de errores
 */
export abstract class YouTubeResource {
  protected url: string;
  protected params: Record<string, string | number | boolean>;
  protected parts: string[];
  protected retryOptions: Required<Omit<RetryOptions, 'onRetry'>> & Pick<RetryOptions, 'onRetry'>;

  /**
   * Crea una instancia del recurso
   * @param options - Opciones de configuración
   */
  constructor(options: YouTubeOptions = {}) {
    // Configuración de retry
    this.retryOptions = {
      ...DEFAULT_RETRY_OPTIONS,
      ...options.retryOptions,
    };

    /**
     * API v3 Url
     */
    this.url = 'https://www.googleapis.com/youtube/v3/';

    /**
     * params
     * https://developers.google.com/youtube/v3/docs/search/list
     */
    this.params = {};

    this.parts = [];
  }

  /**
   * Set private key to class
   * @param key - API key
   */
  setKey(key: string): void {
    this.addParam('key', key);
  }

  /**
   * Add part to request
   * @param name - Part name
   */
  addPart(name: string): void {
    this.parts.push(name);
  }

  /**
   * Optional parameters
   * https://developers.google.com/youtube/v3/docs/search/list
   * @param key - Parameter key
   * @param value - Parameter value
   */
  addParam(key: string, value: string | number | boolean): void {
    this.params[key] = value;
  }

  /**
   * Clear every parameter but the key
   */
  clearParams(): void {
    const keyValue = this.params.key;
    this.params = {};
    if (keyValue !== undefined) {
      this.params.key = keyValue;
    }
  }

  /**
   * Get URL with query string
   * @param path - API path
   * @returns Full URL
   */
  getUrl(path: string): string {
    return `${this.url + path}?${queryString.stringify(this.params)}`;
  }

  /**
   * Get parts as comma-separated string
   * @returns Parts string
   */
  getParts(): string {
    return this.parts.join(',');
  }

  /**
   * Initialize parts
   */
  clearParts(): void {
    this.parts = [];
  }

  /**
   * Validate params
   * @returns ValidationError or null
   */
  validate(): ValidationError | null {
    if (!this.params.key) {
      return new ValidationError(
        'Please set a key using setKey method. Get a key at https://console.developers.google.com',
      );
    }

    return null;
  }

  /**
   * Realiza una petición HTTP con soporte de retry
   * @param url - URL a solicitar
   * @param callback - Callback (error, data)
   * @param attempt - Número de intento actual (uso interno)
   */
  request(url: string, callback: Callback, attempt = 0): void {
    axios.get<YtResult>(url)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError: AxiosError) => {
        const error = parseError(axiosError);

        // Verificar si debemos reintentar
        const shouldRetry = attempt < this.retryOptions.retries
                           && this.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            this.retryOptions.retryDelay,
            this.retryOptions.maxRetryDelay,
          );

          // Llamar callback de retry si existe
          if (typeof this.retryOptions.onRetry === 'function') {
            this.retryOptions.onRetry(error, attempt + 1);
          }

          // Reintentar después del delay
          setTimeout(() => {
            this.request(url, callback, attempt + 1);
          }, delay);
        } else {
          // No hay más reintentos o no es recuperable
          callback(error);
        }
      });
  }

  /**
   * Realiza una petición HTTP y retorna una Promise
   * @param url - URL a solicitar
   * @param attempt - Número de intento actual (uso interno)
   * @returns Promise with result
   */
  requestPromise(url: string, attempt = 0): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      axios.get<YtResult>(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError: AxiosError) => {
          const error = parseError(axiosError);

          // Verificar si debemos reintentar
          const shouldRetry = attempt < this.retryOptions.retries
                             && this.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              this.retryOptions.retryDelay,
              this.retryOptions.maxRetryDelay,
            );

            // Llamar callback de retry si existe
            if (typeof this.retryOptions.onRetry === 'function') {
              this.retryOptions.onRetry(error, attempt + 1);
            }

            // Reintentar después del delay
            setTimeout(() => {
              this.requestPromise(url, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            // No hay más reintentos o no es recuperable
            reject(error);
          }
        });
    });
  }

  /**
   * Actualiza las opciones de retry
   * @param newOptions - Nuevas opciones de retry
   */
  setRetryOptions(newOptions: RetryOptions): void {
    this.retryOptions = {
      ...this.retryOptions,
      ...newOptions,
    };
  }

  /**
   * Helper para convertir callbacks en promises
   * @param method - Método que usa callback
   * @param args - Argumentos para el método
   * @returns Promise
   */
  protected promisify<T extends unknown[]>(
    method: (...args: [...T, Callback]) => void,
    ...args: T
  ): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      const callback: Callback = (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      };

      method(...args, callback);
    });
  }

  /**
   * Realiza una petición POST HTTP con soporte de retry
   * @param url - URL a solicitar
   * @param data - Datos a enviar
   * @param callback - Callback (error, data)
   * @param attempt - Número de intento actual (uso interno)
   */
  requestPost(
    url: string,
    data: unknown,
    callback: Callback,
    attempt = 0,
  ): void {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .post<YtResult>(url, data, config)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError: AxiosError) => {
        const error = parseError(axiosError);

        const shouldRetry = attempt < this.retryOptions.retries
                           && this.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            this.retryOptions.retryDelay,
            this.retryOptions.maxRetryDelay,
          );

          if (typeof this.retryOptions.onRetry === 'function') {
            this.retryOptions.onRetry(error, attempt + 1);
          }

          setTimeout(() => {
            this.requestPost(url, data, callback, attempt + 1);
          }, delay);
        } else {
          callback(error);
        }
      });
  }

  /**
   * Realiza una petición POST HTTP y retorna una Promise
   * @param url - URL a solicitar
   * @param data - Datos a enviar
   * @param attempt - Número de intento actual (uso interno)
   * @returns Promise with result
   */
  requestPostPromise(url: string, data: unknown, attempt = 0): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      axios
        .post<YtResult>(url, data, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError: AxiosError) => {
          const error = parseError(axiosError);

          const shouldRetry = attempt < this.retryOptions.retries
                             && this.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              this.retryOptions.retryDelay,
              this.retryOptions.maxRetryDelay,
            );

            if (typeof this.retryOptions.onRetry === 'function') {
              this.retryOptions.onRetry(error, attempt + 1);
            }

            setTimeout(() => {
              this.requestPostPromise(url, data, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            reject(error);
          }
        });
    });
  }

  /**
   * Realiza una petición PUT HTTP con soporte de retry
   * @param url - URL a solicitar
   * @param data - Datos a enviar
   * @param callback - Callback (error, data)
   * @param attempt - Número de intento actual (uso interno)
   */
  requestPut(
    url: string,
    data: unknown,
    callback: Callback,
    attempt = 0,
  ): void {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .put<YtResult>(url, data, config)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError: AxiosError) => {
        const error = parseError(axiosError);

        const shouldRetry = attempt < this.retryOptions.retries
                           && this.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            this.retryOptions.retryDelay,
            this.retryOptions.maxRetryDelay,
          );

          if (typeof this.retryOptions.onRetry === 'function') {
            this.retryOptions.onRetry(error, attempt + 1);
          }

          setTimeout(() => {
            this.requestPut(url, data, callback, attempt + 1);
          }, delay);
        } else {
          callback(error);
        }
      });
  }

  /**
   * Realiza una petición PUT HTTP y retorna una Promise
   * @param url - URL a solicitar
   * @param data - Datos a enviar
   * @param attempt - Número de intento actual (uso interno)
   * @returns Promise with result
   */
  requestPutPromise(url: string, data: unknown, attempt = 0): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      axios
        .put<YtResult>(url, data, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError: AxiosError) => {
          const error = parseError(axiosError);

          const shouldRetry = attempt < this.retryOptions.retries
                             && this.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              this.retryOptions.retryDelay,
              this.retryOptions.maxRetryDelay,
            );

            if (typeof this.retryOptions.onRetry === 'function') {
              this.retryOptions.onRetry(error, attempt + 1);
            }

            setTimeout(() => {
              this.requestPutPromise(url, data, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            reject(error);
          }
        });
    });
  }

  /**
   * Realiza una petición DELETE HTTP con soporte de retry
   * @param url - URL a solicitar
   * @param callback - Callback (error, data)
   * @param attempt - Número de intento actual (uso interno)
   */
  requestDelete(url: string, callback: Callback, attempt = 0): void {
    axios
      .delete<YtResult>(url)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError: AxiosError) => {
        const error = parseError(axiosError);

        const shouldRetry = attempt < this.retryOptions.retries
                           && this.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            this.retryOptions.retryDelay,
            this.retryOptions.maxRetryDelay,
          );

          if (typeof this.retryOptions.onRetry === 'function') {
            this.retryOptions.onRetry(error, attempt + 1);
          }

          setTimeout(() => {
            this.requestDelete(url, callback, attempt + 1);
          }, delay);
        } else {
          callback(error);
        }
      });
  }

  /**
   * Realiza una petición DELETE HTTP y retorna una Promise
   * @param url - URL a solicitar
   * @param attempt - Número de intento actual (uso interno)
   * @returns Promise with result
   */
  requestDeletePromise(url: string, attempt = 0): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      axios
        .delete<YtResult>(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError: AxiosError) => {
          const error = parseError(axiosError);

          const shouldRetry = attempt < this.retryOptions.retries
                             && this.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              this.retryOptions.retryDelay,
              this.retryOptions.maxRetryDelay,
            );

            if (typeof this.retryOptions.onRetry === 'function') {
              this.retryOptions.onRetry(error, attempt + 1);
            }

            setTimeout(() => {
              this.requestDeletePromise(url, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            reject(error);
          }
        });
    });
  }
}

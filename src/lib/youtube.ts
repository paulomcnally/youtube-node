import axios, { AxiosError } from 'axios';
import * as queryString from 'querystring';
import {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} from './errors';
import {
  Callback,
  RetryOptions,
  YouTubeOptions,
  SearchParams,
  YtResult,
} from '../types';

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
 * Clase principal de YouTube API
 */
class YouTube {
  private url: string;
  private params: Record<string, string | number | boolean>;
  private parts: string[];
  private retryOptions: Required<Omit<RetryOptions, 'onRetry'>> & Pick<RetryOptions, 'onRetry'>;

  /**
   * Crea una instancia de YouTube
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
   * Return error object (legacy, mantiene compatibilidad)
   * @param message - Error message
   * @deprecated Usar las clases de error directamente
   */
  newError(message: string): { error: { message: string } } {
    return {
      error: {
        message,
      },
    };
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
   * Initialize parts
   */
  clearParts(): void {
    this.parts = [];
  }

  /**
   * Video data from ID
   * @param id - Video ID
   * @param callback - Callback function
   */
  getById(id: string, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('statistics');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('videos'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Video data from ID (Promise)
   * @param id - Video ID
   * @returns Promise with result
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.getById(id, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Get channel data based on ID
   * @param id - Channel ID
   * @param callback - Callback function
   */
  getChannelById(id: string, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.clearParams();
      this.clearParts();

      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('statistics');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('channels'), callback);
    }
  }

  /**
   * Get channel data based on ID (Promise)
   * @param id - Channel ID
   * @returns Promise with result
   */
  getChannelByIdAsync(id: string): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.getChannelById(id, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Playlists data from Playlist Id
   * @param id - Playlist ID
   * @param callback - Callback function
   * https://developers.google.com/youtube/v3/docs/playlists/list
   */
  getPlayListsById(id: string, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');
      this.addPart('contentDetails');
      this.addPart('status');
      this.addPart('player');
      this.addPart('id');

      this.addParam('part', this.getParts());
      this.addParam('id', id);

      this.request(this.getUrl('playlists'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Playlists data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @returns Promise with result
   */
  getPlayListsByIdAsync(id: string): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.getPlayListsById(id, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Playlists data from Playlist Id
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * https://developers.google.com/youtube/v3/docs/playlistItems/list
   */
  getPlayListsItemsById(id: string, maxResults: number | Callback, callback?: Callback): void {
    const validate = this.validate();

    let cb: Callback;
    let maxRes: number | null;

    if (typeof maxResults === 'function') {
      cb = maxResults;
      maxRes = null;
    } else {
      cb = callback!;
      maxRes = maxResults;
    }

    if (validate !== null) {
      cb(validate);
    } else {
      this.addPart('contentDetails');
      this.addPart('id');
      this.addPart('snippet');
      this.addPart('status');

      this.addParam('part', this.getParts());
      this.addParam('playlistId', id);

      if (maxRes) {
        this.addParam('maxResults', maxRes);
      }

      this.request(this.getUrl('playlistItems'), cb);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Playlists items data from Playlist Id (Promise)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  getPlayListsItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult> {
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

      if (maxResults !== undefined) {
        this.getPlayListsItemsById(id, maxResults, callback);
      } else {
        this.getPlayListsItemsById(id, callback);
      }
    });
  }

  /**
   * Videos data from query
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters or callback
   * @param callback - Callback function
   */
  search(query: string, maxResults: number, params: SearchParams | Callback, callback?: Callback): void {
    let cb: Callback;
    let parameters: SearchParams;

    if (typeof params !== 'object') {
      if (typeof params === 'function') {
        cb = params;
      } else {
        cb = () => {};
      }
      parameters = {};
    } else {
      cb = callback!;
      parameters = params;
    }

    const validate = this.validate();

    if (validate !== null) {
      cb(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('q', query);
      this.addParam('maxResults', maxResults);

      Object.keys(parameters).forEach((paramKey) => {
        if (parameters[paramKey] !== undefined) {
          this.addParam(paramKey, parameters[paramKey]!);
        }
      });

      this.request(this.getUrl('search'), cb);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Videos data from query (Promise)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param params - Additional parameters
   * @returns Promise with result
   */
  searchAsync(query: string, maxResults: number, params: SearchParams = {}): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.search(query, maxResults, params, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Videos data from query
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
   */
  related(id: string, maxResults: number, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('relatedToVideoId', id);
      this.addParam('maxResults', maxResults);
      this.addParam('type', 'video');
      this.addParam('order', 'relevance');

      this.request(this.getUrl('search'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Related videos (Promise)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  relatedAsync(id: string, maxResults: number): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.related(id, maxResults, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Videos data from most popular list
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
   */
  getMostPopular(maxResults: number, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('maxResults', maxResults);
      this.addParam('chart', 'mostPopular');

      this.request(this.getUrl('videos'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Most popular videos (Promise)
   * @param maxResults - Maximum results
   * @returns Promise with result
   */
  getMostPopularAsync(maxResults: number): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.getMostPopular(maxResults, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }

  /**
   * Videos data from most popular list by videoCategoryId
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @param callback - Callback function
   * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
   */
  getMostPopularByCategory(maxResults: number, videoCategoryId: string | number, callback: Callback): void {
    const validate = this.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      this.addPart('snippet');

      this.addParam('part', this.getParts());
      this.addParam('maxResults', maxResults);
      this.addParam('chart', 'mostPopular');
      this.addParam('videoCategoryId', videoCategoryId);

      this.request(this.getUrl('videos'), callback);

      this.clearParams();
      this.clearParts();
    }
  }

  /**
   * Most popular videos by category (Promise)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @returns Promise with result
   */
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      this.getMostPopularByCategory(maxResults, videoCategoryId, (error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error('No data received'));
        }
      });
    });
  }
}

// Exportar clases de error también como propiedades estáticas
(YouTube as unknown as Record<string, unknown>).YouTubeError = YouTubeError;
(YouTube as unknown as Record<string, unknown>).QuotaExceededError = QuotaExceededError;
(YouTube as unknown as Record<string, unknown>).InvalidKeyError = InvalidKeyError;
(YouTube as unknown as Record<string, unknown>).ResourceNotFoundError = ResourceNotFoundError;
(YouTube as unknown as Record<string, unknown>).RateLimitError = RateLimitError;
(YouTube as unknown as Record<string, unknown>).ValidationError = ValidationError;
(YouTube as unknown as Record<string, unknown>).NetworkError = NetworkError;

export default YouTube;
export { YouTube };

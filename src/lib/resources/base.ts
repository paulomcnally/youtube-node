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
 * YouTube API error structure
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
 * Parses an axios/YouTube API error and returns the appropriate error class
 * @param error - Axios error
 * @returns Specific error class
 */
function parseError(error: AxiosError): YouTubeError {
  // Network error (no response)
  if (error.request && !error.response) {
    return new NetworkError('No response received from server', error);
  }

  // Error with server response
  if (error.response) {
    const { status } = error.response;
    const data = (error.response.data as YouTubeApiError) || {};
    const errorData = data.error || {};
    const message = errorData.message || 'Unknown error';
    const code = errorData.code || errorData.errors?.[0]?.reason || undefined;
    const errors = errorData.errors || [];

    // Determine error type based on status and code
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

    // Generic YouTube error
    return new YouTubeError(message, code || null, status, errors, error.response);
  }

  // Configuration or setup error
  return new YouTubeError(error.message, 'setupError', null, [], null);
}

/**
 * Calculates delay for retry with exponential backoff
 * @param attempt - Attempt number (0-based)
 * @param baseDelay - Base delay in ms
 * @param maxDelay - Maximum delay in ms
 * @returns Delay in ms
 */
function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * 2 ** attempt;
  const jitter = Math.random() * 100; // Add jitter to avoid thundering herd
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> & Pick<RetryOptions, 'onRetry'> = {
  retries: 3,
  retryDelay: 1000,
  maxRetryDelay: 30000,
  retryCondition: (error: Error): boolean => {
    // Only retry retriable errors
    if (error instanceof YouTubeError) {
      return error.isRetriable();
    }
    return false;
  },
  onRetry: undefined,
};

/**
 * Base class for YouTube API resources
 * Contains shared HTTP logic, retry, and error handling
 */
export abstract class YouTubeResource {
  protected url: string;

  protected params: Record<string, string | number | boolean>;

  protected parts: string[];

  protected retryOptions: Required<Omit<RetryOptions, 'onRetry'>> & Pick<RetryOptions, 'onRetry'>;

  protected headers: Record<string, string>;

  /**
   * Creates a resource instance
   * @param options - Configuration options
   */
  constructor(options: YouTubeOptions = {}) {
    // Retry configuration
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

    /**
     * Custom headers
     */
    this.headers = options.headers || {};
  }

  /**
   * Set a custom header for requests
   * @param key - Header name
   * @param value - Header value
   */
  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  /**
   * Set the referer header for requests
   * Useful when API key has referer restrictions
   * @param referer - Referer URL (e.g., 'https://example.com')
   */
  setReferer(referer: string): void {
    this.headers.Referer = referer;
  }

  /**
   * Get all custom headers
   * @returns Headers object
   */
  getHeaders(): Record<string, string> {
    return { ...this.headers };
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
   * Makes an HTTP request with retry support
   * @param url - URL to request
   * @param callback - Callback (error, data)
   * @param attempt - Current attempt number (internal use)
   */
  request(url: string, callback: Callback, attempt = 0): void {
    const config: AxiosRequestConfig = {
      headers: Object.keys(this.headers).length > 0 ? this.headers : undefined,
    };

    axios.get<YtResult>(url, config)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError: AxiosError) => {
        const error = parseError(axiosError);

        // Check if we should retry
        const shouldRetry = attempt < this.retryOptions.retries
                           && this.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            this.retryOptions.retryDelay,
            this.retryOptions.maxRetryDelay,
          );

          // Call retry callback if it exists
          if (typeof this.retryOptions.onRetry === 'function') {
            this.retryOptions.onRetry(error, attempt + 1);
          }

          // Retry after the delay
          setTimeout(() => {
            this.request(url, callback, attempt + 1);
          }, delay);
        } else {
          // No more retries or not retriable
          callback(error);
        }
      });
  }

  /**
   * Makes an HTTP request and returns a Promise
   * @param url - URL to request
   * @param attempt - Current attempt number (internal use)
   * @returns Promise with result
   */
  requestPromise(url: string, attempt = 0): Promise<YtResult> {
    return new Promise((resolve, reject) => {
      const config: AxiosRequestConfig = {
        headers: Object.keys(this.headers).length > 0 ? this.headers : undefined,
      };

      axios.get<YtResult>(url, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError: AxiosError) => {
          const error = parseError(axiosError);

          // Check if we should retry
          const shouldRetry = attempt < this.retryOptions.retries
                             && this.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              this.retryOptions.retryDelay,
              this.retryOptions.maxRetryDelay,
            );

            // Call retry callback if it exists
            if (typeof this.retryOptions.onRetry === 'function') {
              this.retryOptions.onRetry(error, attempt + 1);
            }

            // Retry after the delay
            setTimeout(() => {
              this.requestPromise(url, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            // No more retries or not retriable
            reject(error);
          }
        });
    });
  }

  /**
   * Updates retry options
   * @param newOptions - New retry options
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
   * Makes an HTTP POST request with retry support
   * @param url - URL to request
   * @param data - Data to send
   * @param callback - Callback (error, data)
   * @param attempt - Current attempt number (internal use)
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
   * Makes an HTTP POST request and returns a Promise
   * @param url - URL to request
   * @param data - Data to send
   * @param attempt - Current attempt number (internal use)
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
   * Makes an HTTP PUT request with retry support
   * @param url - URL to request
   * @param data - Data to send
   * @param callback - Callback (error, data)
   * @param attempt - Current attempt number (internal use)
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
   * Makes an HTTP PUT request and returns a Promise
   * @param url - URL to request
   * @param data - Data to send
   * @param attempt - Current attempt number (internal use)
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
   * Makes an HTTP DELETE request with retry support
   * @param url - URL to request
   * @param callback - Callback (error, data)
   * @param attempt - Current attempt number (internal use)
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
   * Makes an HTTP DELETE request and returns a Promise
   * @param url - URL to request
   * @param attempt - Current attempt number (internal use)
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

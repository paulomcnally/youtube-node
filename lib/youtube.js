const axios = require('axios');
const queryString = require('querystring');
const {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} = require('./errors');

/**
 * Parsea un error de axios/YouTube API y retorna la clase de error apropiada
 * @param {Error} error - Error de axios
 * @returns {YouTubeError} - Clase de error específica
 */
function parseError(error) {
  // Error de red (no response)
  if (error.request && !error.response) {
    return new NetworkError('No response received from server', error);
  }

  // Error con respuesta del servidor
  if (error.response) {
    const { status } = error.response;
    const data = error.response.data || {};
    const errorData = data.error || {};
    const message = errorData.message || 'Unknown error';
    const code = errorData.code || errorData.errors?.[0]?.reason || null;
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
    return new YouTubeError(message, code, status, errors, error.response);
  }

  // Error de configuración o setup
  return new YouTubeError(error.message, 'setupError', null, [], null);
}

/**
 * Calcula el delay para retry con backoff exponencial
 * @param {number} attempt - Número de intento (0-based)
 * @param {number} baseDelay - Delay base en ms
 * @param {number} maxDelay - Delay máximo en ms
 * @returns {number} - Delay en ms
 */
function calculateBackoff(attempt, baseDelay, maxDelay) {
  const exponentialDelay = baseDelay * 2 ** attempt;
  const jitter = Math.random() * 100; // Agregar jitter para evitar thundering herd
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Opciones por defecto para retry
 * @type {Object}
 */
const DEFAULT_RETRY_OPTIONS = {
  retries: 3,
  retryDelay: 1000,
  maxRetryDelay: 30000,
  retryCondition: (error) => {
    // Solo reintentar errores recuperables
    if (error instanceof YouTubeError) {
      return error.isRetriable();
    }
    return false;
  },
  onRetry: null, // Callback opcional: (error, attempt) => {}
};

/**
 * Clase principal de YouTube API
 * @param {Object} options - Opciones de configuración
 * @param {Object} options.retryOptions - Opciones de retry
 */
const YouTube = function (options = {}) {
  const self = this;

  // Configuración de retry
  self.retryOptions = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options.retryOptions,
  };

  /**
  * API v3 Url
  * @type {string}
  */
  self.url = 'https://www.googleapis.com/youtube/v3/';

  /**
  * params
  * https://developers.google.com/youtube/v3/docs/search/list
  * @type {Object}
  */
  self.params = {};

  self.parts = [];

  /**
  * Set private key to class
  * @param {string} key
  */
  self.setKey = function (key) {
    self.addParam('key', key);
  };

  /**
  *
  * @param {string} name
  */
  self.addPart = function (name) {
    self.parts.push(name);
  };

  /**
  *
  * Optional parameters
  * https://developers.google.com/youtube/v3/docs/search/list
  *
  * @param {string} key
  * @param {string} value
  */
  self.addParam = function (key, value) {
    self.params[key] = value;
  };

  /**
  * Clear every parameter but the key
  */
  self.clearParams = function () {
    const { key } = self.params;
    self.params = {};
    if (key) {
      self.params.key = key;
    }
  };

  /**
  *
  * @param {string} path
  * @returns {string}
  */
  self.getUrl = function (path) {
    return `${self.url + path}?${queryString.stringify(self.params)}`;
  };

  /**
  *
  * @returns {string}
  */
  self.getParts = function () {
    return self.parts.join(',');
  };

  /**
   * Realiza una petición HTTP con soporte de retry
   * @param {string} url - URL a solicitar
   * @param {function} callback - Callback (error, data)
   * @param {number} attempt - Número de intento actual (uso interno)
   */
  self.request = function (url, callback, attempt = 0) {
    axios.get(url)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((axiosError) => {
        const error = parseError(axiosError);

        // Verificar si debemos reintentar
        const shouldRetry = attempt < self.retryOptions.retries
                           && self.retryOptions.retryCondition(error);

        if (shouldRetry) {
          const delay = calculateBackoff(
            attempt,
            self.retryOptions.retryDelay,
            self.retryOptions.maxRetryDelay,
          );

          // Llamar callback de retry si existe
          if (typeof self.retryOptions.onRetry === 'function') {
            self.retryOptions.onRetry(error, attempt + 1);
          }

          // Reintentar después del delay
          setTimeout(() => {
            self.request(url, callback, attempt + 1);
          }, delay);
        } else {
          // No hay más reintentos o no es recuperable
          callback(error);
        }
      });
  };

  /**
   * Realiza una petición HTTP y retorna una Promise
   * @param {string} url - URL a solicitar
   * @param {number} attempt - Número de intento actual (uso interno)
   * @returns {Promise}
   */
  self.requestPromise = function (url, attempt = 0) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch((axiosError) => {
          const error = parseError(axiosError);

          // Verificar si debemos reintentar
          const shouldRetry = attempt < self.retryOptions.retries
                             && self.retryOptions.retryCondition(error);

          if (shouldRetry) {
            const delay = calculateBackoff(
              attempt,
              self.retryOptions.retryDelay,
              self.retryOptions.maxRetryDelay,
            );

            // Llamar callback de retry si existe
            if (typeof self.retryOptions.onRetry === 'function') {
              self.retryOptions.onRetry(error, attempt + 1);
            }

            // Reintentar después del delay
            setTimeout(() => {
              self.requestPromise(url, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, delay);
          } else {
            // No hay más reintentos o no es recuperable
            reject(error);
          }
        });
    });
  };

  /**
   * Actualiza las opciones de retry
   * @param {Object} options - Nuevas opciones de retry
   */
  self.setRetryOptions = function (newOptions) {
    self.retryOptions = {
      ...self.retryOptions,
      ...newOptions,
    };
  };

  /**
   * Return error object (legacy, mantiene compatibilidad)
   * @param {string} message
   * @deprecated Usar las clases de error directamente
   */
  self.newError = function (message) {
    return {
      error: {
        message,
      },
    };
  };

  /**
   * Validate params
   * @returns {ValidationError|null}
   */
  self.validate = function () {
    if (!self.params.key) {
      return new ValidationError(
        'Please set a key using setKey method. Get a key at https://console.developers.google.com',
      );
    }

    return null;
  };

  /**
   * Initialize parts
   */
  self.clearParts = function () {
    self.parts = [];
  };

  /**
   * Video data from ID
   * @param {string} id
   * @param {function} callback
   */
  self.getById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('statistics');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Video data from ID (Promise)
   * @param {string} id
   * @returns {Promise}
   */
  self.getByIdAsync = function (id) {
    return new Promise((resolve, reject) => {
      self.getById(id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
    * Get channel data based on ID
    * @param {string} id
    * @param {function} callback
    */
  self.getChannelById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.clearParams();
      self.clearParts();

      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('statistics');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('channels'), callback);
    }
  };

  /**
    * Get channel data based on ID (Promise)
    * @param {string} id
    * @returns {Promise}
    */
  self.getChannelByIdAsync = function (id) {
    return new Promise((resolve, reject) => {
      self.getChannelById(id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
   * Playlists data from Playlist Id
   * @param {string} id
   * @param {function} callback
   * https://developers.google.com/youtube/v3/docs/playlists/list
   */
  self.getPlayListsById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('status');
      self.addPart('player');
      self.addPart('id');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('playlists'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Playlists data from Playlist Id (Promise)
   * @param {string} id
   * @returns {Promise}
   */
  self.getPlayListsByIdAsync = function (id) {
    return new Promise((resolve, reject) => {
      self.getPlayListsById(id, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
   * Playlists data from Playlist Id
   * @param {string} id
   * @param {int} maxResults
   * @param {function} callback
   * https://developers.google.com/youtube/v3/docs/playlistItems/list
   */
  self.getPlayListsItemsById = function (id, maxResults, callback) {
    const validate = self.validate();

    let cb = callback;
    let maxRes = maxResults;

    if (typeof (maxResults) === 'function') {
      cb = maxResults;
      maxRes = null;
    }

    if (validate !== null) {
      cb(validate);
    } else {
      self.addPart('contentDetails');
      self.addPart('id');
      self.addPart('snippet');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('playlistId', id);

      if (maxRes) {
        self.addParam('maxResults', maxRes);
      }

      self.request(self.getUrl('playlistItems'), cb);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Playlists items data from Playlist Id (Promise)
   * @param {string} id
   * @param {int} maxResults
   * @returns {Promise}
   */
  self.getPlayListsItemsByIdAsync = function (id, maxResults) {
    return new Promise((resolve, reject) => {
      self.getPlayListsItemsById(id, maxResults, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
    * Videos data from query
    * @param {string} query
    * @param {int} maxResults
    * @param {object} params
    * @param {function} callback
    */
  self.search = function (query, maxResults, params, callback) {
    let cb = callback;
    let parameters = params;

    if (typeof parameters !== 'object') {
      if (typeof parameters === 'function') {
        cb = parameters;
      }
      parameters = {};
    }

    const validate = self.validate();

    if (validate !== null) {
      cb(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('q', query);
      self.addParam('maxResults', maxResults);

      Object.keys(parameters).forEach((paramKey) => {
        if (parameters[paramKey] !== undefined) {
          self.addParam(paramKey, parameters[paramKey]);
        }
      });

      self.request(self.getUrl('search'), cb);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Videos data from query (Promise)
   * @param {string} query
   * @param {int} maxResults
   * @param {object} params
   * @returns {Promise}
   */
  self.searchAsync = function (query, maxResults, params = {}) {
    return new Promise((resolve, reject) => {
      self.search(query, maxResults, params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
   * Videos data from query
   * @param {string} id
   * @param {int} maxResults
   * @param {function} callback
   * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
   */
  self.related = function (id, maxResults, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('relatedToVideoId', id);
      self.addParam('maxResults', maxResults);
      self.addParam('type', 'video');
      self.addParam('order', 'relevance');

      self.request(self.getUrl('search'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Related videos (Promise)
   * @param {string} id
   * @param {int} maxResults
   * @returns {Promise}
   */
  self.relatedAsync = function (id, maxResults) {
    return new Promise((resolve, reject) => {
      self.related(id, maxResults, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
      * Videos data from most popular list
      * @param {int} maxResults
      * @param {function} callback
      * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
      */
  self.getMostPopular = function (maxResults, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('maxResults', maxResults);
      self.addParam('chart', 'mostPopular');

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Most popular videos (Promise)
   * @param {int} maxResults
   * @returns {Promise}
   */
  self.getMostPopularAsync = function (maxResults) {
    return new Promise((resolve, reject) => {
      self.getMostPopular(maxResults, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  /**
      * Videos data from most popular list by videoCategoryId
      * @param {int} maxResults
      * @param {function} callback
      * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
      */
  self.getMostPopularByCategory = function (maxResults, videoCategoryId, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('maxResults', maxResults);
      self.addParam('chart', 'mostPopular');
      self.addParam('videoCategoryId', videoCategoryId);

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Most popular videos by category (Promise)
   * @param {int} maxResults
   * @param {string} videoCategoryId
   * @returns {Promise}
   */
  self.getMostPopularByCategoryAsync = function (maxResults, videoCategoryId) {
    return new Promise((resolve, reject) => {
      self.getMostPopularByCategory(maxResults, videoCategoryId, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };
};

// Exportar clases de error también
YouTube.YouTubeError = YouTubeError;
YouTube.QuotaExceededError = QuotaExceededError;
YouTube.InvalidKeyError = InvalidKeyError;
YouTube.ResourceNotFoundError = ResourceNotFoundError;
YouTube.RateLimitError = RateLimitError;
YouTube.ValidationError = ValidationError;
YouTube.NetworkError = NetworkError;

module.exports = YouTube;

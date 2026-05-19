/**
 * Clases de Error personalizadas para YouTube API
 * @module lib/errors
 */

/**
 * Error base para todas las excepciones de YouTube API
 * @class YouTubeError
 * @extends Error
 */
class YouTubeError extends Error {
  /**
   * Crea una instancia de YouTubeError
   * @param {string} message - Mensaje de error
   * @param {string} code - Código de error de YouTube
   * @param {number} status - Código HTTP de estado
   * @param {Array} errors - Array de errores detallados
   * @param {Object} response - Respuesta completa del servidor
   */
  constructor(message, code = null, status = null, errors = [], response = null) {
    super(message);
    this.name = 'YouTubeError';
    this.code = code;
    this.status = status;
    this.errors = errors;
    this.response = response;
    this.isYouTubeError = true;

    // Capturar stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YouTubeError);
    }
  }

  /**
   * Retorna el error en formato JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      errors: this.errors,
    };
  }

  /**
   * Verifica si es un error de cuota excedida
   * @returns {boolean}
   */
  isQuotaError() {
    return this.status === 403 && (
      this.code === 'quotaExceeded'
      || this.message.includes('quota')
      || this.message.includes('Quota')
    );
  }

  /**
   * Verifica si es un error de rate limit
   * @returns {boolean}
   */
  isRateLimitError() {
    return this.status === 429 || (
      this.status === 403 && this.code === 'rateLimitExceeded'
    );
  }

  /**
   * Verifica si es un error de recurso no encontrado
   * @returns {boolean}
   */
  isNotFoundError() {
    return this.status === 404 || this.code === 'notFound';
  }

  /**
   * Verifica si es un error de clave inválida
   * @returns {boolean}
   */
  isInvalidKeyError() {
    return this.status === 400 && (
      this.code === 'keyInvalid'
      || this.message.includes('API key')
      || this.message.includes('key not valid')
    );
  }

  /**
   * Verifica si el error es recuperable (para retry)
   * @returns {boolean}
   */
  isRetriable() {
    // Errores 5xx son recuperables
    if (this.status >= 500 && this.status < 600) {
      return true;
    }
    // Rate limits son recuperables con backoff
    if (this.isRateLimitError()) {
      return true;
    }
    // Quota excedida no es recuperable con retry
    if (this.isQuotaError()) {
      return false;
    }
    // Errores de red son recuperables
    if (!this.status) {
      return true;
    }
    return false;
  }
}

/**
 * Error cuando se excede la cuota de la API
 * @class QuotaExceededError
 * @extends YouTubeError
 */
class QuotaExceededError extends YouTubeError {
  constructor(message = 'YouTube API quota exceeded', code = 'quotaExceeded', status = 403, errors = [], response = null) {
    super(message, code, status, errors, response);
    this.name = 'QuotaExceededError';
  }
}

/**
 * Error cuando la clave API es inválida
 * @class InvalidKeyError
 * @extends YouTubeError
 */
class InvalidKeyError extends YouTubeError {
  constructor(message = 'Invalid YouTube API key', code = 'keyInvalid', status = 400, errors = [], response = null) {
    super(message, code, status, errors, response);
    this.name = 'InvalidKeyError';
  }
}

/**
 * Error cuando no se encuentra un recurso
 * @class ResourceNotFoundError
 * @extends YouTubeError
 */
class ResourceNotFoundError extends YouTubeError {
  constructor(message = 'Resource not found', code = 'notFound', status = 404, errors = [], response = null) {
    super(message, code, status, errors, response);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Error cuando se excede el rate limit
 * @class RateLimitError
 * @extends YouTubeError
 */
class RateLimitError extends YouTubeError {
  constructor(message = 'Rate limit exceeded', code = 'rateLimitExceeded', status = 429, errors = [], response = null) {
    super(message, code, status, errors, response);
    this.name = 'RateLimitError';
  }
}

/**
 * Error de validación de parámetros
 * @class ValidationError
 * @extends YouTubeError
 */
class ValidationError extends YouTubeError {
  constructor(message = 'Validation error', errors = []) {
    super(message, 'validationError', 400, errors);
    this.name = 'ValidationError';
  }
}

/**
 * Error de red o conexión
 * @class NetworkError
 * @extends YouTubeError
 */
class NetworkError extends YouTubeError {
  constructor(message = 'Network error', originalError = null) {
    super(message, 'networkError', null, [], null);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

module.exports = {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
};

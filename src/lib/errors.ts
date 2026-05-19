/**
 * Clases de Error personalizadas para YouTube API
 * @module lib/errors
 */

/**
 * Error base para todas las excepciones de YouTube API
 */
export class YouTubeError extends Error {
  public readonly code: string | null;

  public readonly status: number | null;

  public readonly errors: Array<Record<string, unknown>>;

  public readonly response: unknown;

  public readonly isYouTubeError: boolean;

  /**
   * Crea una instancia de YouTubeError
   * @param message - Mensaje de error
   * @param code - Código de error de YouTube
   * @param status - Código HTTP de estado
   * @param errors - Array de errores detallados
   * @param response - Respuesta completa del servidor
   */
  constructor(
    message: string,
    code: string | null | undefined = null,
    status: number | null = null,
    errors: Array<Record<string, unknown>> = [],
    response: unknown = null,
  ) {
    super(message);
    this.name = 'YouTubeError';
    this.code = code ?? null;
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
   */
  toJSON(): {
    name: string;
    message: string;
    code: string | null;
    status: number | null;
    errors: Array<Record<string, unknown>>;
  } {
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
   */
  isQuotaError(): boolean {
    return this.status === 403 && (
      this.code === 'quotaExceeded'
      || this.message.includes('quota')
      || this.message.includes('Quota')
    );
  }

  /**
   * Verifica si es un error de rate limit
   */
  isRateLimitError(): boolean {
    return this.status === 429 || (
      this.status === 403 && this.code === 'rateLimitExceeded'
    );
  }

  /**
   * Verifica si es un error de recurso no encontrado
   */
  isNotFoundError(): boolean {
    return this.status === 404 || this.code === 'notFound';
  }

  /**
   * Verifica si es un error de clave inválida
   */
  isInvalidKeyError(): boolean {
    return this.status === 400 && (
      this.code === 'keyInvalid'
      || this.message.includes('API key')
      || this.message.includes('key not valid')
    );
  }

  /**
   * Verifica si el error es recuperable (para retry)
   */
  isRetriable(): boolean {
    // Errores 5xx son recuperables
    if (this.status && this.status >= 500 && this.status < 600) {
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
 */
export class QuotaExceededError extends YouTubeError {
  constructor(
    message: string = 'YouTube API quota exceeded',
    code: string | null | undefined = 'quotaExceeded',
    status: number | null = 403,
    errors: Array<Record<string, unknown>> = [],
    response: unknown = null,
  ) {
    super(message, code, status, errors, response);
    this.name = 'QuotaExceededError';
  }
}

/**
 * Error cuando la clave API es inválida
 */
export class InvalidKeyError extends YouTubeError {
  constructor(
    message: string = 'Invalid YouTube API key',
    code: string | null | undefined = 'keyInvalid',
    status: number | null = 400,
    errors: Array<Record<string, unknown>> = [],
    response: unknown = null,
  ) {
    super(message, code, status, errors, response);
    this.name = 'InvalidKeyError';
  }
}

/**
 * Error cuando no se encuentra un recurso
 */
export class ResourceNotFoundError extends YouTubeError {
  constructor(
    message: string = 'Resource not found',
    code: string | null | undefined = 'notFound',
    status: number | null = 404,
    errors: Array<Record<string, unknown>> = [],
    response: unknown = null,
  ) {
    super(message, code, status, errors, response);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Error cuando se excede el rate limit
 */
export class RateLimitError extends YouTubeError {
  constructor(
    message: string = 'Rate limit exceeded',
    code: string | null | undefined = 'rateLimitExceeded',
    status: number | null = 429,
    errors: Array<Record<string, unknown>> = [],
    response: unknown = null,
  ) {
    super(message, code, status, errors, response);
    this.name = 'RateLimitError';
  }
}

/**
 * Error de validación de parámetros
 */
export class ValidationError extends YouTubeError {
  constructor(
    message: string = 'Validation error',
    errors: Array<Record<string, unknown>> = [],
  ) {
    super(message, 'validationError', 400, errors);
    this.name = 'ValidationError';
  }
}

/**
 * Error de red o conexión
 */
export class NetworkError extends YouTubeError {
  public readonly originalError: Error | null;

  constructor(
    message: string = 'Network error',
    originalError: Error | null = null,
  ) {
    super(message, 'networkError', null, [], null);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

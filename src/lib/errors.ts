/**
 * Custom Error classes for YouTube API
 * @module lib/errors
 */

/**
 * Base error for all YouTube API exceptions
 */
export class YouTubeError extends Error {
  public readonly code: string | null;

  public readonly status: number | null;

  public readonly errors: Array<Record<string, unknown>>;

  public readonly response: unknown;

  public readonly isYouTubeError: boolean;

  /**
   * Creates a YouTubeError instance
   * @param message - Error message
   * @param code - YouTube error code
   * @param status - HTTP status code
   * @param errors - Array of detailed errors
   * @param response - Full server response
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

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YouTubeError);
    }
  }

  /**
   * Returns the error in JSON format
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
   * Checks if it is a quota exceeded error
   */
  isQuotaError(): boolean {
    return this.status === 403 && (
      this.code === 'quotaExceeded'
      || this.message.includes('quota')
      || this.message.includes('Quota')
    );
  }

  /**
   * Checks if it is a rate limit error
   */
  isRateLimitError(): boolean {
    return this.status === 429 || (
      this.status === 403 && this.code === 'rateLimitExceeded'
    );
  }

  /**
   * Checks if it is a resource not found error
   */
  isNotFoundError(): boolean {
    return this.status === 404 || this.code === 'notFound';
  }

  /**
   * Checks if it is an invalid key error
   */
  isInvalidKeyError(): boolean {
    return this.status === 400 && (
      this.code === 'keyInvalid'
      || this.message.includes('API key')
      || this.message.includes('key not valid')
    );
  }

  /**
   * Checks if the error is retriable
   */
  isRetriable(): boolean {
    // 5xx errors are retriable
    if (this.status && this.status >= 500 && this.status < 600) {
      return true;
    }
    // Rate limits are retriable with backoff
    if (this.isRateLimitError()) {
      return true;
    }
    // Quota exceeded is not retriable
    if (this.isQuotaError()) {
      return false;
    }
    // Network errors are retriable
    if (!this.status) {
      return true;
    }
    return false;
  }
}

/**
 * Error when API quota is exceeded
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
 * Error when API key is invalid
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
 * Error when a resource is not found
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
 * Error when rate limit is exceeded
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
 * Parameter validation error
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
 * Network or connection error
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

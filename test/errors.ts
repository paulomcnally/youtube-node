/* eslint-env mocha */
import * as should from 'should';
import {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} from '../src/lib/errors';

// Type declarations for mocha
declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: (done?: (err?: Error) => void) => void): void;

// Extend timeout for API tests
const TEST_TIMEOUT = 30000;

describe('Error Classes', () => {
  describe('YouTubeError', () => {
    it('should create a basic YouTubeError', () => {
      const error = new YouTubeError('Test error', 'testCode', 400, [{ message: 'Detail' }]);

      error.should.be.an.instanceOf(Error);
      error.should.be.an.instanceOf(YouTubeError);
      error.message.should.equal('Test error');
      error.code!.should.equal('testCode');
      error.status!.should.equal(400);
      error.errors.should.be.an.Array();
      error.errors.length.should.equal(1);
      error.name.should.equal('YouTubeError');
      error.isYouTubeError.should.be.true();
    });

    it('should convert to JSON', () => {
      const error = new YouTubeError('Test error', 'testCode', 400);
      const json = error.toJSON();

      json.should.have.property('name', 'YouTubeError');
      json.should.have.property('message', 'Test error');
      json.should.have.property('code', 'testCode');
      json.should.have.property('status', 400);
      json.should.have.property('errors');
    });

    it('should detect quota errors', () => {
      const quotaError = new YouTubeError('Quota exceeded', 'quotaExceeded', 403);
      quotaError.isQuotaError().should.be.true();

      const normalError = new YouTubeError('Other error', 'other', 403);
      normalError.isQuotaError().should.be.false();
    });

    it('should detect rate limit errors', () => {
      const rateLimitError = new YouTubeError('Rate limit', 'rateLimitExceeded', 429);
      rateLimitError.isRateLimitError().should.be.true();

      const normalError = new YouTubeError('Other error', 'other', 400);
      normalError.isRateLimitError().should.be.false();
    });

    it('should detect not found errors', () => {
      const notFoundError = new YouTubeError('Not found', 'notFound', 404);
      notFoundError.isNotFoundError().should.be.true();

      const normalError = new YouTubeError('Other error', 'other', 400);
      normalError.isNotFoundError().should.be.false();
    });

    it('should detect invalid key errors', () => {
      const keyError = new YouTubeError('API key not valid', 'keyInvalid', 400);
      keyError.isInvalidKeyError().should.be.true();

      const normalError = new YouTubeError('Other error', 'other', 400);
      normalError.isInvalidKeyError().should.be.false();
    });

    it('should determine if error is retriable', () => {
      // 5xx errors should be retriable
      const serverError = new YouTubeError('Server error', 'backendError', 500);
      serverError.isRetriable().should.be.true();

      // Rate limit should be retriable
      const rateLimit = new YouTubeError('Rate limit', 'rateLimitExceeded', 429);
      rateLimit.isRetriable().should.be.true();

      // Quota exceeded should NOT be retriable
      const quotaError = new YouTubeError('Quota exceeded', 'quotaExceeded', 403);
      quotaError.isRetriable().should.be.false();

      // 4xx errors should NOT be retriable
      const clientError = new YouTubeError('Bad request', 'badRequest', 400);
      clientError.isRetriable().should.be.false();
    });
  });

  describe('QuotaExceededError', () => {
    it('should create with default values', () => {
      const error = new QuotaExceededError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('QuotaExceededError');
      error.message.should.equal('YouTube API quota exceeded');
      error.code!.should.equal('quotaExceeded');
      error.status!.should.equal(403);
    });

    it('should create with custom values', () => {
      const error = new QuotaExceededError('Custom quota message', 'customCode', 400);

      error.message.should.equal('Custom quota message');
      error.code!.should.equal('customCode');
      error.status!.should.equal(400);
    });
  });

  describe('InvalidKeyError', () => {
    it('should create with default values', () => {
      const error = new InvalidKeyError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('InvalidKeyError');
      error.message.should.equal('Invalid YouTube API key');
      error.code!.should.equal('keyInvalid');
      error.status!.should.equal(400);
    });
  });

  describe('ResourceNotFoundError', () => {
    it('should create with default values', () => {
      const error = new ResourceNotFoundError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('ResourceNotFoundError');
      error.message.should.equal('Resource not found');
      error.code!.should.equal('notFound');
      error.status!.should.equal(404);
    });
  });

  describe('RateLimitError', () => {
    it('should create with default values', () => {
      const error = new RateLimitError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('RateLimitError');
      error.message.should.equal('Rate limit exceeded');
      error.code!.should.equal('rateLimitExceeded');
      error.status!.should.equal(429);
    });
  });

  describe('ValidationError', () => {
    it('should create with default values', () => {
      const error = new ValidationError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('ValidationError');
      error.message.should.equal('Validation error');
      error.code!.should.equal('validationError');
      error.status!.should.equal(400);
    });

    it('should create with custom message and errors', () => {
      const errors = [{ field: 'key', message: 'Required' }];
      const error = new ValidationError('Validation failed', errors);

      error.message.should.equal('Validation failed');
      error.errors.should.eql(errors);
    });
  });

  describe('NetworkError', () => {
    it('should create with default values', () => {
      const error = new NetworkError();

      error.should.be.an.instanceOf(YouTubeError);
      error.name.should.equal('NetworkError');
      error.message.should.equal('Network error');
      error.code!.should.equal('networkError');
      should.not.exist(error.status);
    });

    it('should store original error', () => {
      const originalError = new Error('Connection refused');
      const error = new NetworkError('Request failed', originalError);

      error.message.should.equal('Request failed');
      error.originalError!.should.equal(originalError);
    });
  });
});

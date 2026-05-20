import axios, { AxiosError } from 'axios';
import * as queryString from 'querystring';
import {
  YouTubeError,
  NetworkError,
} from './errors';

/**
 * OAuth 2.0 authentication tokens
 */
export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
}

/**
 * Options for generating authorization URL
 */
export interface AuthUrlOptions {
  scope: string | string[];
  state?: string;
  access_type?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  include_granted_scopes?: boolean;
  login_hint?: string;
}

/**
 * Available scopes for YouTube API
 */
export const YouTubeScopes = {
  READONLY: 'https://www.googleapis.com/auth/youtube.readonly',
  UPLOAD: 'https://www.googleapis.com/auth/youtube.upload',
  FULL: 'https://www.googleapis.com/auth/youtube',
  FORCE_SSL: 'https://www.googleapis.com/auth/youtube.force-ssl',
  PARTNER: 'https://www.googleapis.com/auth/youtubepartner',
  PARTNER_CHANNEL_AUDIT: 'https://www.googleapis.com/auth/youtubepartner-channel-audit',
} as const;

/**
 * Class to handle OAuth 2.0 authentication with YouTube API
 */
export class YouTubeAuth {
  private clientId: string;

  private clientSecret: string;

  private redirectUri: string;

  private static readonly AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

  private static readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';

  private static readonly REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

  /**
   * Creates a YouTubeAuth instance
   * @param options - OAuth configuration options
   */
  constructor(options: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
  }

  /**
   * Generates the authorization URL for OAuth flow
   * @param options - Options for the authorization URL
   * @returns Authorization URL
   */
  generateAuthUrl(options: AuthUrlOptions): string {
    const scopes = Array.isArray(options.scope)
      ? options.scope
      : [options.scope];

    const params: Record<string, string> = {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: options.access_type || 'offline',
    };

    if (options.state) {
      params.state = options.state;
    }

    if (options.prompt) {
      params.prompt = options.prompt;
    }

    if (options.include_granted_scopes !== undefined) {
      params.include_granted_scopes = String(options.include_granted_scopes);
    }

    if (options.login_hint) {
      params.login_hint = options.login_hint;
    }

    return `${YouTubeAuth.AUTH_URL}?${queryString.stringify(params)}`;
  }

  /**
   * Exchanges the authorization code for access tokens
   * @param code - Authorization code received from the callback
   * @param callback - Optional callback (error, tokens)
   * @returns Promise<OAuthTokens> if no callback, void if callback
   */
  getToken(code: string, callback?: (error: Error | null, tokens?: OAuthTokens) => void): Promise<OAuthTokens> | void {
    const params = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    if (callback) {
      this.exchangeToken(params, callback);
      return undefined;
    }

    return new Promise((resolve, reject) => {
      this.exchangeToken(params, (error, tokens) => {
        if (error) {
          reject(error);
        } else {
          resolve(tokens!);
        }
      });
    });
  }

  /**
   * Refreshes the access token using the refresh token
   * @param refreshToken - Refresh token
   * @param callback - Optional callback (error, tokens)
   * @returns Promise<OAuthTokens> if no callback, void if callback
   */
  refreshAccessToken(
    refreshToken: string,
    callback?: (error: Error | null, tokens?: OAuthTokens) => void,
  ): Promise<OAuthTokens> | void {
    const params = {
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
    };

    if (callback) {
      this.exchangeToken(params, callback);
      return undefined;
    }

    return new Promise((resolve, reject) => {
      this.exchangeToken(params, (error, tokens) => {
        if (error) {
          reject(error);
        } else {
          resolve(tokens!);
        }
      });
    });
  }

  /**
   * Revokes an access token or refresh token
   * @param token - Token to revoke (access_token or refresh_token)
   * @param callback - Optional callback (error)
   * @returns Promise<void> if no callback, void if callback
   */
  revokeToken(token: string, callback?: (error: Error | null) => void): Promise<void> | void {
    if (callback) {
      axios
        .post(YouTubeAuth.REVOKE_URL, queryString.stringify({ token }))
        .then(() => callback(null))
        .catch((error: AxiosError) => {
          callback(this.parseAuthError(error));
        });
      return undefined;
    }

    return new Promise((resolve, reject) => {
      axios
        .post(YouTubeAuth.REVOKE_URL, queryString.stringify({ token }))
        .then(() => resolve())
        .catch((error: AxiosError) => {
          reject(this.parseAuthError(error));
        });
    });
  }

  /**
   * Checks if a token has expired
   * @param tokens - OAuth tokens
   * @returns true if the token has expired
   */
  isTokenExpired(tokens: OAuthTokens): boolean {
    if (!tokens.expiry_date) {
      return false; // No expiry date, assume not expired
    }
    return Date.now() >= tokens.expiry_date;
  }

  /**
   * Gets a valid token, refreshing if necessary
   * @param tokens - Current tokens
   * @param callback - Optional callback (error, tokens)
   * @returns Promise<OAuthTokens> if no callback, void if callback
   */
  getValidToken(
    tokens: OAuthTokens,
    callback?: (error: Error | null, tokens?: OAuthTokens) => void,
  ): Promise<OAuthTokens> | void {
    if (!this.isTokenExpired(tokens)) {
      if (callback) {
        callback(null, tokens);
        return undefined;
      }
      return Promise.resolve(tokens);
    }

    if (!tokens.refresh_token) {
      const error = new YouTubeError('Token expired and no refresh token available');
      if (callback) {
        callback(error);
        return undefined;
      }
      return Promise.reject(error);
    }

    return this.refreshAccessToken(tokens.refresh_token, callback);
  }

  /**
   * Private method to exchange tokens
   */
  private exchangeToken(
    params: Record<string, string>,
    callback: (error: Error | null, tokens?: OAuthTokens) => void,
  ): void {
    axios
      .post<OAuthTokens>(
      YouTubeAuth.TOKEN_URL,
      queryString.stringify(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )
      .then((response) => {
        const tokens = response.data;

        // Calculate expiration date if expires_in is present
        if ('expires_in' in response.data && typeof response.data.expires_in === 'number') {
          tokens.expiry_date = Date.now() + (response.data.expires_in as number) * 1000;
        }

        callback(null, tokens);
      })
      .catch((error: AxiosError) => {
        callback(this.parseAuthError(error));
      });
  }

  /**
   * Parses authentication errors
   */
  private parseAuthError(error: AxiosError): Error {
    if (error.response) {
      const data = error.response.data as { error?: string; error_description?: string };
      return new YouTubeError(
        data.error_description || data.error || 'OAuth authentication error',
        String(error.response.status),
      );
    }

    if (error.request) {
      return new NetworkError('No response received from OAuth server', error);
    }

    return new YouTubeError(error.message);
  }
}

// Export class and utilities
export default YouTubeAuth;

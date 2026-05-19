import axios, { AxiosError } from 'axios';
import * as queryString from 'querystring';
import {
  YouTubeError,
  NetworkError,
} from './errors';

/**
 * Tokens de autenticación OAuth 2.0
 */
export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
}

/**
 * Opciones para generar URL de autorización
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
 * Scopes disponibles para YouTube API
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
 * Clase para manejar autenticación OAuth 2.0 con YouTube API
 */
export class YouTubeAuth {
  private clientId: string;

  private clientSecret: string;

  private redirectUri: string;

  private static readonly AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

  private static readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';

  private static readonly REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

  /**
   * Crea una instancia de YouTubeAuth
   * @param options - Opciones de configuración OAuth
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
   * Genera la URL de autorización para el flujo OAuth
   * @param options - Opciones para la URL de autorización
   * @returns URL de autorización
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
   * Intercambia el código de autorización por tokens de acceso
   * @param code - Código de autorización recibido del callback
   * @param callback - Callback opcional (error, tokens)
   * @returns Promise<OAuthTokens> si no hay callback, void si hay callback
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
   * Refresca el token de acceso usando el refresh token
   * @param refreshToken - Token de refresco
   * @param callback - Callback opcional (error, tokens)
   * @returns Promise<OAuthTokens> si no hay callback, void si hay callback
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
   * Revoca un token de acceso o refresh
   * @param token - Token a revocar (access_token o refresh_token)
   * @param callback - Callback opcional (error)
   * @returns Promise<void> si no hay callback, void si hay callback
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
   * Verifica si un token ha expirado
   * @param tokens - Tokens OAuth
   * @returns true si el token ha expirado
   */
  isTokenExpired(tokens: OAuthTokens): boolean {
    if (!tokens.expiry_date) {
      return false; // No expiry date, assume not expired
    }
    return Date.now() >= tokens.expiry_date;
  }

  /**
   * Obtiene un token válido, refrescando si es necesario
   * @param tokens - Tokens actuales
   * @param callback - Callback opcional (error, tokens)
   * @returns Promise<OAuthTokens> si no hay callback, void si hay callback
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
   * Método privado para intercambiar tokens
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

        // Calcular fecha de expiración si hay expires_in
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
   * Parsea errores de autenticación
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

// Exportar clase y utilidades
export default YouTubeAuth;

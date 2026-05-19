import {
  YouTubeResource,
  VideosResource,
  ChannelsResource,
  PlaylistsResource,
  SearchResource,
} from './resources';
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
 * Clase principal de YouTube API
 *
 * Proporciona acceso a todos los recursos de la API de YouTube
 * organizados de forma modular.
 *
 * @example
 * ```typescript
 * const youtube = new YouTube();
 * youtube.setKey('YOUR_API_KEY');
 *
 * // Usar recursos con async/await
 * const video = await youtube.videos.getById('VIDEO_ID');
 * const channel = await youtube.channels.getById('CHANNEL_ID');
 * const results = await youtube.search.query('query', 10);
 * ```
 */
class YouTube extends YouTubeResource {
  private readonly _videos: VideosResource;
  private readonly _channels: ChannelsResource;
  private readonly _playlists: PlaylistsResource;
  private readonly _search: SearchResource;

  /**
   * Recurso de Videos
   */
  public get videos(): VideosResource {
    return this._videos;
  }

  /**
   * Recurso de Channels
   */
  public get channels(): ChannelsResource {
    return this._channels;
  }

  /**
   * Recurso de Playlists
   */
  public get playlists(): PlaylistsResource {
    return this._playlists;
  }

  /**
   * Recurso de Search
   */
  public get search(): SearchResource {
    return this._search;
  }

  /**
   * Crea una instancia de YouTube
   * @param options - Opciones de configuración
   */
  constructor(options: YouTubeOptions = {}) {
    super(options);

    // Inicializar recursos con las mismas opciones
    this._videos = new VideosResource(options);
    this._channels = new ChannelsResource(options);
    this._playlists = new PlaylistsResource(options);
    this._search = new SearchResource(options);
  }

  /**
   * Set private key to class and all resources
   * @param key - API key
   */
  setKey(key: string): void {
    super.setKey(key);
    this._videos.setKey(key);
    this._channels.setKey(key);
    this._playlists.setKey(key);
    this._search.setKey(key);
  }

  /**
   * Actualiza las opciones de retry en todos los recursos
   * @param newOptions - Nuevas opciones de retry
   */
  setRetryOptions(newOptions: RetryOptions): void {
    super.setRetryOptions(newOptions);
    this._videos.setRetryOptions(newOptions);
    this._channels.setRetryOptions(newOptions);
    this._playlists.setRetryOptions(newOptions);
    this._search.setRetryOptions(newOptions);
  }

  // ============================================================
  // Métodos Legacy para backward compatibility
  // Todos soportan callbacks (legacy) y Promises (nuevo)
  // ============================================================

  /**
   * Video data from ID (legacy)
   * @param id - Video ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.getById() instead
   */
  getById(id: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.videos.getById(id, callback);
      return undefined;
    }
    return this.videos.getById(id) as Promise<YtResult>;
  }

  /**
   * Video data from ID (Promise, legacy)
   * @param id - Video ID
   * @returns Promise with result
   * @deprecated Use youtube.videos.getById() without callback instead
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.getById(id) as Promise<YtResult>;
  }

  /**
   * Get channel data based on ID (legacy)
   * @param id - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channels.getById() instead
   */
  getChannelById(id: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channels.getById(id, callback);
      return undefined;
    }
    return this.channels.getById(id) as Promise<YtResult>;
  }

  /**
   * Get channel data based on ID (Promise, legacy)
   * @param id - Channel ID
   * @returns Promise with result
   * @deprecated Use youtube.channels.getById() without callback instead
   */
  getChannelByIdAsync(id: string): Promise<YtResult> {
    return this.getChannelById(id) as Promise<YtResult>;
  }

  /**
   * Playlists data from Playlist Id (legacy)
   * @param id - Playlist ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.playlists.getById() instead
   */
  getPlayListsById(id: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.playlists.getById(id, callback);
      return undefined;
    }
    return this.playlists.getById(id) as Promise<YtResult>;
  }

  /**
   * Playlists data from Playlist Id (Promise, legacy)
   * @param id - Playlist ID
   * @returns Promise with result
   * @deprecated Use youtube.playlists.getById() without callback instead
   */
  getPlayListsByIdAsync(id: string): Promise<YtResult> {
    return this.getPlayListsById(id) as Promise<YtResult>;
  }

  /**
   * Playlists items data from Playlist Id (legacy)
   * @param id - Playlist ID
   * @param maxResults - Maximum results or callback
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.playlists.getItemsById() instead
   */
  getPlayListsItemsById(
    id: string,
    maxResults?: number | Callback,
    callback?: Callback,
  ): Promise<YtResult> | void {
    // Verificar si maxResults es un callback
    if (typeof maxResults === 'function') {
      this.playlists.getItemsById(id, maxResults);
      return undefined;
    }

    if (callback) {
      this.playlists.getItemsById(id, maxResults, callback);
      return undefined;
    }

    return this.playlists.getItemsById(id, maxResults) as Promise<YtResult>;
  }

  /**
   * Playlists items data from Playlist Id (Promise, legacy)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.playlists.getItemsById() without callback instead
   */
  getPlayListsItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult> {
    return this.getPlayListsItemsById(id, maxResults) as Promise<YtResult>;
  }

  /**
   * Related videos (legacy)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.search.related() instead
   */
  related(id: string, maxResults: number, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this._search.related(id, maxResults, callback);
      return undefined;
    }
    return this._search.related(id, maxResults) as Promise<YtResult>;
  }

  /**
   * Related videos (Promise, legacy)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.search.related() without callback instead
   */
  relatedAsync(id: string, maxResults: number): Promise<YtResult> {
    return this.related(id, maxResults) as Promise<YtResult>;
  }

  /**
   * Videos data from most popular list (legacy)
   * @param maxResults - Maximum results
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.getMostPopular() instead
   */
  getMostPopular(maxResults: number, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.videos.getMostPopular(maxResults, callback);
      return undefined;
    }
    return this.videos.getMostPopular(maxResults) as Promise<YtResult>;
  }

  /**
   * Most popular videos (Promise, legacy)
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.videos.getMostPopular() without callback instead
   */
  getMostPopularAsync(maxResults: number): Promise<YtResult> {
    return this.getMostPopular(maxResults) as Promise<YtResult>;
  }

  /**
   * Videos data from most popular list by videoCategoryId (legacy)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.getMostPopularByCategory() instead
   */
  getMostPopularByCategory(
    maxResults: number,
    videoCategoryId: string | number,
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videos.getMostPopularByCategory(maxResults, videoCategoryId, callback);
      return undefined;
    }
    return this.videos.getMostPopularByCategory(maxResults, videoCategoryId) as Promise<YtResult>;
  }

  /**
   * Most popular videos by category (Promise, legacy)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @returns Promise with result
   * @deprecated Use youtube.videos.getMostPopularByCategory() without callback instead
   */
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult> {
    return this.getMostPopularByCategory(maxResults, videoCategoryId) as Promise<YtResult>;
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
export {
  VideosResource,
  ChannelsResource,
  PlaylistsResource,
  SearchResource,
} from './resources';

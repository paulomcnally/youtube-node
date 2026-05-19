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
 * // Usar recursos
 * const video = await youtube.videos.getByIdAsync('VIDEO_ID');
 * const channel = await youtube.channels.getByIdAsync('CHANNEL_ID');
 * const results = await youtube.search.queryAsync('query', 10);
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
  // ============================================================

  /**
   * Video data from ID (legacy)
   * @param id - Video ID
   * @param callback - Callback function
   * @deprecated Use youtube.videos.getById() instead
   */
  getById(id: string, callback: Callback): void {
    this.videos.getById(id, callback);
  }

  /**
   * Video data from ID (Promise, legacy)
   * @param id - Video ID
   * @returns Promise with result
   * @deprecated Use youtube.videos.getByIdAsync() instead
   */
  getByIdAsync(id: string): Promise<YtResult> {
    return this.videos.getByIdAsync(id);
  }

  /**
   * Get channel data based on ID (legacy)
   * @param id - Channel ID
   * @param callback - Callback function
   * @deprecated Use youtube.channels.getById() instead
   */
  getChannelById(id: string, callback: Callback): void {
    this.channels.getById(id, callback);
  }

  /**
   * Get channel data based on ID (Promise, legacy)
   * @param id - Channel ID
   * @returns Promise with result
   * @deprecated Use youtube.channels.getByIdAsync() instead
   */
  getChannelByIdAsync(id: string): Promise<YtResult> {
    return this.channels.getByIdAsync(id);
  }

  /**
   * Playlists data from Playlist Id (legacy)
   * @param id - Playlist ID
   * @param callback - Callback function
   * @deprecated Use youtube.playlists.getById() instead
   */
  getPlayListsById(id: string, callback: Callback): void {
    this.playlists.getById(id, callback);
  }

  /**
   * Playlists data from Playlist Id (Promise, legacy)
   * @param id - Playlist ID
   * @returns Promise with result
   * @deprecated Use youtube.playlists.getByIdAsync() instead
   */
  getPlayListsByIdAsync(id: string): Promise<YtResult> {
    return this.playlists.getByIdAsync(id);
  }

  /**
   * Playlists items data from Playlist Id (legacy)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * @deprecated Use youtube.playlists.getItemsById() instead
   */
  getPlayListsItemsById(id: string, maxResults: number | Callback, callback?: Callback): void {
    this.playlists.getItemsById(id, maxResults, callback);
  }

  /**
   * Playlists items data from Playlist Id (Promise, legacy)
   * @param id - Playlist ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.playlists.getItemsByIdAsync() instead
   */
  getPlayListsItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult> {
    return this.playlists.getItemsByIdAsync(id, maxResults);
  }

  /**
   * Related videos (legacy)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * @deprecated Use youtube.search.related() instead
   */
  related(id: string, maxResults: number, callback: Callback): void {
    this._search.related(id, maxResults, callback);
  }

  /**
   * Related videos (Promise, legacy)
   * @param id - Video ID
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.search.relatedAsync() instead
   */
  relatedAsync(id: string, maxResults: number): Promise<YtResult> {
    return this._search.relatedAsync(id, maxResults);
  }

  /**
   * Videos data from most popular list (legacy)
   * @param maxResults - Maximum results
   * @param callback - Callback function
   * @deprecated Use youtube.videos.getMostPopular() instead
   */
  getMostPopular(maxResults: number, callback: Callback): void {
    this.videos.getMostPopular(maxResults, callback);
  }

  /**
   * Most popular videos (Promise, legacy)
   * @param maxResults - Maximum results
   * @returns Promise with result
   * @deprecated Use youtube.videos.getMostPopularAsync() instead
   */
  getMostPopularAsync(maxResults: number): Promise<YtResult> {
    return this.videos.getMostPopularAsync(maxResults);
  }

  /**
   * Videos data from most popular list by videoCategoryId (legacy)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @param callback - Callback function
   * @deprecated Use youtube.videos.getMostPopularByCategory() instead
   */
  getMostPopularByCategory(maxResults: number, videoCategoryId: string | number, callback: Callback): void {
    this.videos.getMostPopularByCategory(maxResults, videoCategoryId, callback);
  }

  /**
   * Most popular videos by category (Promise, legacy)
   * @param maxResults - Maximum results
   * @param videoCategoryId - Video category ID
   * @returns Promise with result
   * @deprecated Use youtube.videos.getMostPopularByCategoryAsync() instead
   */
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult> {
    return this.videos.getMostPopularByCategoryAsync(maxResults, videoCategoryId);
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

import {
  YouTubeResource,
  VideosResource,
  ChannelsResource,
  PlaylistsResource,
  SearchResource,
  ChannelSectionsResource,
  WatermarksResource,
  VideoAbuseReportReasonsResource,
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
  VideoResource,
  VideoStatus,
  PaginatedResult,
  PaginationOptions,
  ChannelSectionResource,
  WatermarkTiming,
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
  private readonly _channelSections: ChannelSectionsResource;
  private readonly _watermarks: WatermarksResource;
  private readonly _videoAbuseReportReasons: VideoAbuseReportReasonsResource;

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
   * Recurso de ChannelSections
   */
  public get channelSections(): ChannelSectionsResource {
    return this._channelSections;
  }

  /**
   * Recurso de Watermarks
   */
  public get watermarks(): WatermarksResource {
    return this._watermarks;
  }

  /**
   * Recurso de VideoAbuseReportReasons
   */
  public get videoAbuseReportReasons(): VideoAbuseReportReasonsResource {
    return this._videoAbuseReportReasons;
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
    this._channelSections = new ChannelSectionsResource(options);
    this._watermarks = new WatermarksResource(options);
    this._videoAbuseReportReasons = new VideoAbuseReportReasonsResource(options);
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
    this._channelSections.setKey(key);
    this._watermarks.setKey(key);
    this._videoAbuseReportReasons.setKey(key);
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
    this._channelSections.setRetryOptions(newOptions);
    this._watermarks.setRetryOptions(newOptions);
    this._videoAbuseReportReasons.setRetryOptions(newOptions);
  }

  // ============================================================
  // Métodos de Paginación (Issue #92)
  // ============================================================

  /**
   * Get all results from paginated endpoint
   * @param endpoint - Endpoint to query ('search', 'videos', etc.)
   * @param options - Query options
   * @param callback - Optional callback function
   * @returns Promise<YtResult[]> if no callback, void otherwise
   */
  getAllResults(
    endpoint: 'search' | 'videos' | 'channels' | 'playlists' | 'playlistItems',
    options: PaginationOptions = {},
    callback?: Callback,
  ): Promise<YtResult[]> | void {
    const allItems: YtResult[] = [];

    const fetchAll = async (): Promise<YtResult[]> => {
      let pageToken: string | undefined;

      do {
        const params: PaginationOptions = { ...options, pageToken };
        let result: YtResult;

        switch (endpoint) {
          case 'search':
            result = await this.search.query(params.q || '', params.maxResults || 50, params) as YtResult;
            break;
          case 'videos':
            result = await this.videos.getById(params.id || '') as YtResult;
            break;
          case 'channels':
            result = await this.channels.getById(params.id || '') as YtResult;
            break;
          case 'playlists':
            result = await this.playlists.getById(params.id || '') as YtResult;
            break;
          case 'playlistItems':
            result = await this.playlists.getItemsById(params.playlistId || '', params.maxResults || 50) as YtResult;
            break;
          default:
            throw new Error(`Unknown endpoint: ${endpoint}`);
        }

        allItems.push(result);
        pageToken = result.nextPageToken;
      } while (pageToken);

      return allItems;
    };

    if (callback) {
      fetchAll()
        .then((results) => callback(null, { items: results.flatMap(r => r.items || []) } as YtResult))
        .catch((err) => callback(err as Error));
      return undefined;
    }

    return fetchAll();
  }

  /**
   * Async generator for pagination
   * @param endpoint - Endpoint to query
   * @param options - Query options
   */
  async *paginate(
    endpoint: 'search' | 'videos' | 'channels' | 'playlists' | 'playlistItems',
    options: PaginationOptions = {},
  ): AsyncGenerator<YtResult, void, unknown> {
    let pageToken: string | undefined;

    do {
      const params: PaginationOptions = { ...options, pageToken };
      let result: YtResult;

      switch (endpoint) {
        case 'search':
          result = await this.search.query(params.q || '', params.maxResults || 50, params) as YtResult;
          break;
        case 'videos':
          result = await this.videos.getById(params.id || '') as YtResult;
          break;
        case 'channels':
          result = await this.channels.getById(params.id || '') as YtResult;
          break;
        case 'playlists':
          result = await this.playlists.getById(params.id || '') as YtResult;
          break;
        case 'playlistItems':
          result = await this.playlists.getItemsById(params.playlistId || '', params.maxResults || 50) as YtResult;
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      yield result;
      pageToken = result.nextPageToken;
    } while (pageToken);
  }

  /**
   * Enhanced search with advanced filters (Issue #92)
   * @param query - Search query
   * @param maxResults - Maximum results
   * @param filters - Advanced search filters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   */
  searchWithFilters(
    query: string,
    maxResults: number,
    filters: {
      type?: 'video' | 'channel' | 'playlist';
      videoDuration?: 'short' | 'medium' | 'long' | 'any';
      videoDefinition?: 'high' | 'standard' | 'any';
      videoLicense?: 'creativeCommon' | 'youtube';
      videoSyndicated?: boolean;
      videoEmbeddable?: boolean;
      safeSearch?: 'none' | 'moderate' | 'strict';
      order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
      publishedAfter?: string;
      publishedBefore?: string;
      regionCode?: string;
      relevanceLanguage?: string;
      channelId?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    const searchParams: SearchParams = {
      type: filters.type,
      videoDuration: filters.videoDuration,
      videoDefinition: filters.videoDefinition,
      videoLicense: filters.videoLicense,
      videoSyndicated: filters.videoSyndicated,
      videoEmbeddable: filters.videoEmbeddable,
      safeSearch: filters.safeSearch,
      order: filters.order,
      publishedAfter: filters.publishedAfter,
      publishedBefore: filters.publishedBefore,
      regionCode: filters.regionCode,
      relevanceLanguage: filters.relevanceLanguage,
      channelId: filters.channelId,
    };

    // Remove undefined values
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === undefined) {
        delete searchParams[key];
      }
    });

    return this.search.query(query, maxResults, searchParams, callback);
  }

  // ============================================================
  // Métodos de Videos (OAuth) - Issue #88
  // ============================================================

  /**
   * Update video metadata (OAuth required)
   * @param videoResource - Video resource
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.update() instead
   */
  updateVideo(videoResource: VideoResource, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.videos.update(videoResource, callback);
      return undefined;
    }
    return this.videos.update(videoResource) as Promise<YtResult>;
  }

  /**
   * Update video privacy status (OAuth required)
   * @param videoId - Video ID
   * @param status - Privacy status
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.updateStatus() instead
   */
  updateVideoStatus(
    videoId: string,
    status: VideoStatus | 'public' | 'private' | 'unlisted',
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videos.updateStatus(videoId, status, callback);
      return undefined;
    }
    return this.videos.updateStatus(videoId, status) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de ChannelSections (OAuth) - Issue #89
  // ============================================================

  /**
   * Get channel sections
   * @param channelId - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channelSections.list() instead
   */
  getChannelSections(channelId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channelSections.list(channelId, callback);
      return undefined;
    }
    return this.channelSections.list(channelId) as Promise<YtResult>;
  }

  /**
   * Create channel section (OAuth required)
   * @param sectionResource - Channel section resource
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channelSections.create() instead
   */
  createChannelSection(sectionResource: ChannelSectionResource, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channelSections.create(sectionResource, callback);
      return undefined;
    }
    return this.channelSections.create(sectionResource) as Promise<YtResult>;
  }

  /**
   * Update channel section (OAuth required)
   * @param sectionId - Section ID
   * @param sectionResource - Channel section resource
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channelSections.update() instead
   */
  updateChannelSection(
    sectionId: string,
    sectionResource: ChannelSectionResource,
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.channelSections.update(sectionId, sectionResource, callback);
      return undefined;
    }
    return this.channelSections.update(sectionId, sectionResource) as Promise<YtResult>;
  }

  /**
   * Delete channel section (OAuth required)
   * @param sectionId - Section ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channelSections.delete() instead
   */
  deleteChannelSection(sectionId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channelSections.delete(sectionId, callback);
      return undefined;
    }
    return this.channelSections.delete(sectionId) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Watermarks (OAuth) - Issue #90
  // ============================================================

  /**
   * Set watermark for channel (OAuth required)
   * @param channelId - Channel ID
   * @param imageData - Image data (Buffer or file path)
   * @param timing - Watermark timing configuration
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.watermarks.set() instead
   */
  setWatermark(
    channelId: string,
    imageData: Buffer | string,
    timing: WatermarkTiming,
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.watermarks.set(channelId, imageData, timing, callback);
      return undefined;
    }
    return this.watermarks.set(channelId, imageData, timing) as Promise<YtResult>;
  }

  /**
   * Unset watermark from channel (OAuth required)
   * @param channelId - Channel ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.watermarks.unset() instead
   */
  unsetWatermark(channelId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.watermarks.unset(channelId, callback);
      return undefined;
    }
    return this.watermarks.unset(channelId) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de VideoAbuseReportReasons - Issue #91
  // ============================================================

  /**
   * Get video abuse report reasons
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videoAbuseReportReasons.list() instead
   */
  getVideoAbuseReportReasons(callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.videoAbuseReportReasons.list(callback);
      return undefined;
    }
    return this.videoAbuseReportReasons.list() as Promise<YtResult>;
  }

  /**
   * Report abusive video (OAuth required)
   * @param videoId - Video ID
   * @param reasonId - Reason ID
   * @param options - Optional report details
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videoAbuseReportReasons.report() instead
   */
  reportAbusiveVideo(
    videoId: string,
    reasonId: string,
    options?: {
      secondaryReasonId?: string;
      comments?: string;
      language?: string;
    },
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videoAbuseReportReasons.report(videoId, reasonId, options, callback);
      return undefined;
    }
    return this.videoAbuseReportReasons.report(videoId, reasonId, options) as Promise<YtResult>;
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
  ChannelSectionsResource,
  WatermarksResource,
  VideoAbuseReportReasonsResource,
} from './resources';

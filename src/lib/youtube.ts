import {
  YouTubeResource,
  VideosResource,
  ChannelsResource,
  PlaylistsResource,
  SearchResource,
  ChannelSectionsResource,
  WatermarksResource,
  VideoAbuseReportReasonsResource,
  SubscriptionsResource,
  CaptionsResource,
  CommentsResource,
  ThumbnailsResource,
  ActivitiesResource,
  CommentThreadsResource,
  I18nLanguagesResource,
  I18nRegionsResource,
  PlaylistItemsResource,
  VideoCategoriesResource,
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
  PaginationOptions,
  ChannelSectionResource,
  WatermarkTiming,
  VideoUploadResource,
  VideoUploadOptions,
  ChannelResource,
  ChannelBannerResult,
  CaptionUploadOptions,
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

  private readonly _subscriptions: SubscriptionsResource;

  private readonly _captions: CaptionsResource;

  private readonly _comments: CommentsResource;

  private readonly _thumbnails: ThumbnailsResource;

  private readonly _activities: ActivitiesResource;

  private readonly _commentThreads: CommentThreadsResource;

  private readonly _i18nLanguages: I18nLanguagesResource;

  private readonly _i18nRegions: I18nRegionsResource;

  private readonly _playlistItems: PlaylistItemsResource;

  private readonly _videoCategories: VideoCategoriesResource;

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
   * Recurso de Subscriptions
   */
  public get subscriptions(): SubscriptionsResource {
    return this._subscriptions;
  }

  /**
   * Recurso de Captions
   */
  public get captions(): CaptionsResource {
    return this._captions;
  }

  /**
   * Recurso de Comments
   */
  public get comments(): CommentsResource {
    return this._comments;
  }

  /**
   * Recurso de Thumbnails
   */
  public get thumbnails(): ThumbnailsResource {
    return this._thumbnails;
  }

  /**
   * Recurso de Activities
   */
  public get activities(): ActivitiesResource {
    return this._activities;
  }

  /**
   * Recurso de CommentThreads
   */
  public get commentThreads(): CommentThreadsResource {
    return this._commentThreads;
  }

  /**
   * Recurso de I18nLanguages
   */
  public get i18nLanguages(): I18nLanguagesResource {
    return this._i18nLanguages;
  }

  /**
   * Recurso de I18nRegions
   */
  public get i18nRegions(): I18nRegionsResource {
    return this._i18nRegions;
  }

  /**
   * Recurso de PlaylistItems
   */
  public get playlistItems(): PlaylistItemsResource {
    return this._playlistItems;
  }

  /**
   * Recurso de VideoCategories
   */
  public get videoCategories(): VideoCategoriesResource {
    return this._videoCategories;
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
    this._subscriptions = new SubscriptionsResource(options);
    this._captions = new CaptionsResource(options);
    this._comments = new CommentsResource(options);
    this._thumbnails = new ThumbnailsResource(options);
    this._activities = new ActivitiesResource(options);
    this._commentThreads = new CommentThreadsResource(options);
    this._i18nLanguages = new I18nLanguagesResource(options);
    this._i18nRegions = new I18nRegionsResource(options);
    this._playlistItems = new PlaylistItemsResource(options);
    this._videoCategories = new VideoCategoriesResource(options);
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
    this._subscriptions.setKey(key);
    this._captions.setKey(key);
    this._comments.setKey(key);
    this._thumbnails.setKey(key);
    this._activities.setKey(key);
    this._commentThreads.setKey(key);
    this._i18nLanguages.setKey(key);
    this._i18nRegions.setKey(key);
    this._playlistItems.setKey(key);
    this._videoCategories.setKey(key);
  }

  /**
   * Set a custom header for all requests (Issue #52)
   * Useful for adding referer or other headers
   * @param key - Header name
   * @param value - Header value
   */
  setHeader(key: string, value: string): void {
    super.setHeader(key, value);
    this._videos.setHeader(key, value);
    this._channels.setHeader(key, value);
    this._playlists.setHeader(key, value);
    this._search.setHeader(key, value);
    this._channelSections.setHeader(key, value);
    this._watermarks.setHeader(key, value);
    this._videoAbuseReportReasons.setHeader(key, value);
    this._subscriptions.setHeader(key, value);
    this._captions.setHeader(key, value);
    this._comments.setHeader(key, value);
    this._thumbnails.setHeader(key, value);
    this._activities.setHeader(key, value);
    this._commentThreads.setHeader(key, value);
    this._i18nLanguages.setHeader(key, value);
    this._i18nRegions.setHeader(key, value);
    this._playlistItems.setHeader(key, value);
    this._videoCategories.setHeader(key, value);
  }

  /**
   * Set the referer header for all requests (Issue #52)
   * Useful when API key has referer restrictions
   * @param referer - Referer URL (e.g., 'https://example.com')
   * @example
   * ```typescript
   * const youtube = new YouTube();
   * youtube.setKey('YOUR_API_KEY');
   * youtube.setReferer('https://example.com'); // Fix "referer" error
   * ```
   */
  setReferer(referer: string): void {
    this.setHeader('Referer', referer);
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
    this._subscriptions.setRetryOptions(newOptions);
    this._captions.setRetryOptions(newOptions);
    this._comments.setRetryOptions(newOptions);
    this._thumbnails.setRetryOptions(newOptions);
    this._activities.setRetryOptions(newOptions);
    this._commentThreads.setRetryOptions(newOptions);
    this._i18nLanguages.setRetryOptions(newOptions);
    this._i18nRegions.setRetryOptions(newOptions);
    this._playlistItems.setRetryOptions(newOptions);
    this._videoCategories.setRetryOptions(newOptions);
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
        .then((results) => callback(null, { items: results.flatMap((r) => r.items || []) } as YtResult))
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
  async* paginate(
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
  // Métodos de Subscriptions (OAuth) - Issue #83
  // ============================================================

  /**
   * Subscribe to a channel (OAuth required)
   * @param channelId - Channel ID to subscribe to
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.subscriptions.subscribeToChannel() instead
   */
  subscribeToChannel(channelId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.subscriptions.subscribeToChannel(channelId, callback);
      return undefined;
    }
    return this.subscriptions.subscribeToChannel(channelId) as Promise<YtResult>;
  }

  /**
   * Unsubscribe from a channel (OAuth required)
   * @param subscriptionId - Subscription ID to cancel
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.subscriptions.unsubscribe() instead
   */
  unsubscribe(subscriptionId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.subscriptions.unsubscribe(subscriptionId, callback);
      return undefined;
    }
    return this.subscriptions.unsubscribe(subscriptionId) as Promise<YtResult>;
  }

  /**
   * Find and unsubscribe from a channel (OAuth required)
   * @param channelId - Channel ID to unsubscribe from
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.subscriptions.findAndUnsubscribe() instead
   */
  findAndUnsubscribe(channelId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.subscriptions.findAndUnsubscribe(channelId, callback);
      return undefined;
    }
    return this.subscriptions.findAndUnsubscribe(channelId) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Channels Update (OAuth) - Issue #84
  // ============================================================

  /**
   * Update channel metadata (OAuth required)
   * @param channelResource - Channel resource with updated data
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channels.update() instead
   */
  updateChannel(channelResource: ChannelResource, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channels.update(channelResource, callback);
      return undefined;
    }
    return this.channels.update(channelResource) as Promise<YtResult>;
  }

  /**
   * Upload channel banner image (OAuth required)
   * @param imageData - Image data (Buffer or file path)
   * @param callback - Optional callback function
   * @returns Promise<ChannelBannerResult> if no callback, void otherwise
   * @deprecated Use youtube.channels.uploadBanner() instead
   */
  uploadChannelBanner(imageData: Buffer | string, callback?: Callback): Promise<ChannelBannerResult> | void {
    if (callback) {
      this.channels.uploadBanner(imageData, (err, data) => {
        callback(err, data as unknown as YtResult);
      });
      return undefined;
    }
    return this.channels.uploadBanner(imageData) as Promise<ChannelBannerResult>;
  }

  /**
   * Update channel banner using banner URL (OAuth required)
   * @param channelId - Channel ID
   * @param bannerUrl - Banner URL from uploadBanner result
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.channels.updateBanner() instead
   */
  updateChannelBanner(channelId: string, bannerUrl: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.channels.updateBanner(channelId, bannerUrl, callback);
      return undefined;
    }
    return this.channels.updateBanner(channelId, bannerUrl) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Videos Upload/Delete (OAuth) - Issue #85 & #87
  // ============================================================

  /**
   * Upload a video (OAuth required)
   * @param videoResource - Video metadata
   * @param mediaBody - Path to video file, Buffer, or Stream
   * @param options - Upload options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.upload() instead
   */
  uploadVideo(
    videoResource: VideoUploadResource,
    mediaBody: string | Buffer | NodeJS.ReadableStream,
    options: VideoUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videos.upload(videoResource, mediaBody, options, callback);
      return undefined;
    }
    return this.videos.upload(videoResource, mediaBody, options) as Promise<YtResult>;
  }

  /**
   * Delete a video (OAuth required)
   * @param videoId - Video ID to delete
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.delete() instead
   */
  deleteVideo(videoId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.videos.delete(videoId, callback);
      return undefined;
    }
    return this.videos.delete(videoId) as Promise<YtResult>;
  }

  /**
   * Delete multiple videos (OAuth required)
   * @param videoIds - Array of video IDs to delete
   * @param callback - Optional callback function
   * @returns Promise<YtResult[]> if no callback, void otherwise
   * @deprecated Use youtube.videos.deleteMany() instead
   */
  deleteVideos(videoIds: string[], callback?: Callback): Promise<YtResult[]> | void {
    if (callback) {
      this.videos.deleteMany(videoIds, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback(null, data as unknown as YtResult);
        }
      });
      return undefined;
    }
    return this.videos.deleteMany(videoIds) as Promise<YtResult[]>;
  }

  // ============================================================
  // Métodos de Captions (OAuth) - Issue #86
  // ============================================================

  /**
   * Upload caption to a video (OAuth required)
   * @param videoId - Video ID
   * @param language - Language code (e.g., 'es', 'en')
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Upload options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.captions.upload() instead
   */
  uploadCaption(
    videoId: string,
    language: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.captions.upload(videoId, language, captionFile, options, callback);
      return undefined;
    }
    return this.captions.upload(videoId, language, captionFile, options) as Promise<YtResult>;
  }

  /**
   * Update caption (OAuth required)
   * @param captionId - Caption ID
   * @param captionFile - Path, Buffer, or content of caption file
   * @param options - Update options
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.captions.update() instead
   */
  updateCaption(
    captionId: string,
    captionFile: string | Buffer,
    options: CaptionUploadOptions = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.captions.update(captionId, captionFile, options, callback);
      return undefined;
    }
    return this.captions.update(captionId, captionFile, options) as Promise<YtResult>;
  }

  /**
   * Delete caption (OAuth required)
   * @param captionId - Caption ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.captions.delete() instead
   */
  deleteCaption(captionId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.captions.delete(captionId, callback);
      return undefined;
    }
    return this.captions.delete(captionId) as Promise<YtResult>;
  }

  /**
   * Set caption draft status (OAuth required)
   * @param captionId - Caption ID
   * @param isDraft - Draft status
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.captions.setDraftStatus() instead
   */
  setCaptionDraftStatus(captionId: string, isDraft: boolean, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.captions.setDraftStatus(captionId, isDraft, callback);
      return undefined;
    }
    return this.captions.setDraftStatus(captionId, isDraft) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Video Rating (Issue #80)
  // ============================================================

  /**
   * Rate a video (OAuth required)
   * @param videoId - Video ID
   * @param rating - Rating: 'like', 'dislike', or 'none'
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.rate() instead
   */
  rateVideo(
    videoId: string,
    rating: 'like' | 'dislike' | 'none',
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videos.rate(videoId, rating, callback);
      return undefined;
    }
    return this.videos.rate(videoId, rating) as Promise<YtResult>;
  }

  /**
   * Get video rating given by user (OAuth required)
   * @param videoIds - Video ID(s)
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.videos.getRating() instead
   */
  getVideoRating(
    videoIds: string | string[],
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.videos.getRating(videoIds, callback);
      return undefined;
    }
    return this.videos.getRating(videoIds) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Thumbnails (Issue #79)
  // ============================================================

  /**
   * Set custom thumbnail for video (OAuth required)
   * @param videoId - Video ID
   * @param imageData - Image Buffer or file path
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.thumbnails.set() instead
   */
  setThumbnail(
    videoId: string,
    imageData: Buffer | string,
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.thumbnails.set(videoId, imageData, callback);
      return undefined;
    }
    return this.thumbnails.set(videoId, imageData) as Promise<YtResult>;
  }

  // ============================================================
  // Métodos de Captions (Issue #78)
  // ============================================================

  /**
   * Get captions for a video
   * @param videoId - Video ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.captions.list() instead
   */
  getCaptions(videoId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.captions.list(videoId, callback);
      return undefined;
    }
    return this.captions.list(videoId) as Promise<YtResult>;
  }

  /**
   * Download caption content
   * @param captionId - Caption ID
   * @param format - Format (srt, sbv, scc, ttml, vtt)
   * @param options - Optional parameters (tfmt, tlang)
   * @param callback - Optional callback function
   * @returns Promise<string> if no callback, void otherwise
   * @deprecated Use youtube.captions.download() instead
   */
  downloadCaption(
    captionId: string,
    format: 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt' | null = null,
    options: {
      tlang?: string;
    } = {},
    callback?: Callback,
  ): Promise<string> | void {
    if (callback) {
      this.captions.download(captionId, format, options, callback);
      return undefined;
    }
    return this.captions.download(captionId, format, options) as Promise<string>;
  }

  // ============================================================
  // Métodos de Comments (Issue #82)
  // ============================================================

  /**
   * Add comment to video (OAuth required)
   * @param videoId - Video ID
   * @param text - Comment text
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.comments.add() instead
   */
  addComment(
    videoId: string,
    text: string,
    options: {
      channelId?: string;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.comments.add(videoId, text, options, callback);
      return undefined;
    }
    return this.comments.add(videoId, text, options) as Promise<YtResult>;
  }

  /**
   * Reply to comment (OAuth required)
   * @param parentCommentId - Parent comment ID
   * @param text - Reply text
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.comments.reply() instead
   */
  addReply(parentCommentId: string, text: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.comments.reply(parentCommentId, text, callback);
      return undefined;
    }
    return this.comments.reply(parentCommentId, text) as Promise<YtResult>;
  }

  /**
   * Update comment (OAuth required)
   * @param commentId - Comment ID
   * @param text - New comment text
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.comments.update() instead
   */
  updateComment(commentId: string, text: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.comments.update(commentId, text, callback);
      return undefined;
    }
    return this.comments.update(commentId, text) as Promise<YtResult>;
  }

  /**
   * Delete comment (OAuth required)
   * @param commentId - Comment ID
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.comments.delete() instead
   */
  deleteComment(commentId: string, callback?: Callback): Promise<YtResult> | void {
    if (callback) {
      this.comments.delete(commentId, callback);
      return undefined;
    }
    return this.comments.delete(commentId) as Promise<YtResult>;
  }

  /**
   * Set comment moderation status (OAuth required, channel owner only)
   * @param commentIds - Comment ID(s)
   * @param status - Moderation status
   * @param options - Optional parameters
   * @param callback - Optional callback function
   * @returns Promise<YtResult> if no callback, void otherwise
   * @deprecated Use youtube.comments.setModerationStatus() instead
   */
  setCommentModerationStatus(
    commentIds: string | string[],
    status: 'published' | 'heldForReview' | 'rejected',
    options: {
      banAuthor?: boolean;
    } = {},
    callback?: Callback,
  ): Promise<YtResult> | void {
    if (callback) {
      this.comments.setModerationStatus(commentIds, status, options, callback);
      return undefined;
    }
    return this.comments.setModerationStatus(commentIds, status, options) as Promise<YtResult>;
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
  SubscriptionsResource,
  CaptionsResource,
  CommentsResource,
  ThumbnailsResource,
  ActivitiesResource,
  CommentThreadsResource,
  I18nLanguagesResource,
  I18nRegionsResource,
  PlaylistItemsResource,
  VideoCategoriesResource,
} from './resources';

// Exportar autenticación OAuth
export {
  YouTubeAuth,
  OAuthTokens,
  AuthUrlOptions,
  YouTubeScopes,
} from './auth';

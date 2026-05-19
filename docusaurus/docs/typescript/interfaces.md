---
sidebar_position: 2
---

# Interfaces

Documentación de las interfaces principales de la librería.

## YouTube Interface

```typescript
interface YouTube {
  // Propiedades de recursos
  videos: VideosResource;
  channels: ChannelsResource;
  playlists: PlaylistsResource;
  search: SearchResource;
  comments: CommentsResource;
  commentThreads: CommentThreadsResource;
  subscriptions: SubscriptionsResource;
  captions: CaptionsResource;
  thumbnails: ThumbnailsResource;
  activities: ActivitiesResource;
  channelSections: ChannelSectionsResource;
  watermarks: WatermarksResource;
  i18nLanguages: I18nLanguagesResource;
  i18nRegions: I18nRegionsResource;
  playlistItems: PlaylistItemsResource;
  videoCategories: VideoCategoriesResource;
  videoAbuseReportReasons: VideoAbuseReportReasonsResource;
  
  // Métodos de configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setReferer(referer: string): void;
  setRetryOptions(options: RetryOptions): void;
  
  // Métodos de paginación
  getAllResults(
    endpoint: 'search' | 'videos' | 'channels' | 'playlists' | 'playlistItems',
    options: PaginationOptions,
    callback?: Callback
  ): Promise<YtResult[]> | void;
  
  paginate(
    endpoint: 'search' | 'videos' | 'channels' | 'playlists' | 'playlistItems',
    options: PaginationOptions
  ): AsyncGenerator<YtResult, void, unknown>;
  
  // Métodos de búsqueda avanzada
  searchWithFilters(
    query: string,
    maxResults: number,
    filters: SearchFilters,
    callback?: Callback
  ): Promise<YtResult> | void;
}

interface SearchFilters {
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
}
```

## Resources Interface

### VideosResource

```typescript
interface VideosResource {
  // Obtener videos
  getById(id: string, callback?: Callback): Promise<YtResult> | void;
  getByIdAsync(id: string): Promise<YtResult>;
  getByIds(ids: string | string[], options?: { parts?: string[]; regionCode?: string }, callback?: Callback): Promise<YtResult> | void;
  getByIdsAsync(ids: string | string[], options?: { parts?: string[]; regionCode?: string }): Promise<YtResult>;
  
  // Videos populares
  getMostPopular(maxResults: number, callback?: Callback): Promise<YtResult> | void;
  getMostPopularAsync(maxResults: number): Promise<YtResult>;
  getMostPopularByCategory(maxResults: number, categoryId: string | number, callback?: Callback): Promise<YtResult> | void;
  getMostPopularByCategoryAsync(maxResults: number, categoryId: string | number): Promise<YtResult>;
  getMostPopularByRegion(maxResults: number, regionCode: string, callback?: Callback): Promise<YtResult> | void;
  getMostPopularByRegionAsync(maxResults: number, regionCode: string): Promise<YtResult>;
  
  // CRUD (requiere OAuth)
  update(videoResource: VideoResource, callback?: Callback): Promise<YtResult> | void;
  updateAsync(videoResource: VideoResource): Promise<YtResult>;
  updateStatus(videoId: string, status: VideoStatus | 'public' | 'private' | 'unlisted', callback?: Callback): Promise<YtResult> | void;
  updateStatusAsync(videoId: string, status: VideoStatus | 'public' | 'private' | 'unlisted'): Promise<YtResult>;
  delete(videoId: string, callback?: Callback): Promise<YtResult> | void;
  deleteAsync(videoId: string): Promise<YtResult>;
  deleteMany(videoIds: string[], callback?: Callback): Promise<YtResult[]> | void;
  deleteManyAsync(videoIds: string[]): Promise<YtResult[]>;
  
  // Subida (requiere OAuth)
  upload(videoResource: VideoUploadResource, mediaBody: string | Buffer | NodeJS.ReadableStream, options?: VideoUploadOptions, callback?: Callback): Promise<YtResult> | void;
  uploadAsync(videoResource: VideoUploadResource, mediaBody: string | Buffer | NodeJS.ReadableStream, options?: VideoUploadOptions): Promise<YtResult>;
  checkUploadStatus(videoId: string, callback?: Callback): Promise<YtResult> | void;
  checkUploadStatusAsync(videoId: string): Promise<YtResult>;
  
  // Rating (requiere OAuth)
  rate(videoId: string, rating: 'like' | 'dislike' | 'none', callback?: Callback): Promise<YtResult> | void;
  rateAsync(videoId: string, rating: 'like' | 'dislike' | 'none'): Promise<YtResult>;
  getRating(videoIds: string | string[], callback?: Callback): Promise<YtResult> | void;
  getRatingAsync(videoIds: string | string[]): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

### ChannelsResource

```typescript
interface ChannelsResource {
  // Obtener canales
  getById(id: string, callback?: Callback): Promise<YtResult> | void;
  getByIdAsync(id: string): Promise<YtResult>;
  getByUsername(username: string, callback?: Callback): Promise<YtResult> | void;
  getByUsernameAsync(username: string): Promise<YtResult>;
  getMyChannel(callback?: Callback): Promise<YtResult> | void;
  getMyChannelAsync(): Promise<YtResult>;
  
  // Actualizar (requiere OAuth)
  update(channelResource: ChannelResource, callback?: Callback): Promise<YtResult> | void;
  updateAsync(channelResource: ChannelResource): Promise<YtResult>;
  
  // Banner (requiere OAuth)
  uploadBanner(imageData: Buffer | string, callback?: Callback): Promise<ChannelBannerResult> | void;
  uploadBannerAsync(imageData: Buffer | string): Promise<ChannelBannerResult>;
  updateBanner(channelId: string, bannerUrl: string, callback?: Callback): Promise<YtResult> | void;
  updateBannerAsync(channelId: string, bannerUrl: string): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

### SearchResource

```typescript
interface SearchResource {
  // Búsqueda
  query(query: string, maxResults: number, params?: SearchParams | Callback, callback?: Callback): Promise<YtResult> | void;
  queryAsync(query: string, maxResults: number, params?: SearchParams): Promise<YtResult>;
  
  // Legacy alias
  search(query: string, maxResults: number, params: SearchParams | Callback, callback?: Callback): void;
  searchAsync(query: string, maxResults: number, params?: SearchParams): Promise<YtResult>;
  
  // Videos relacionados
  related(id: string, maxResults: number, callback?: Callback): Promise<YtResult> | void;
  relatedAsync(id: string, maxResults: number): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

### PlaylistsResource

```typescript
interface PlaylistsResource {
  // Obtener playlists
  getById(id: string, callback?: Callback): Promise<YtResult> | void;
  getByIdAsync(id: string): Promise<YtResult>;
  getItemsById(id: string, maxResults?: number | Callback, callback?: Callback): Promise<YtResult> | void;
  getItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult>;
  getByChannel(channelId: string, options?: { maxResults?: number; pageToken?: string }, callback?: Callback): Promise<YtResult> | void;
  getByChannelAsync(channelId: string, options?: { maxResults?: number; pageToken?: string }): Promise<YtResult>;
  
  // CRUD (requiere OAuth)
  insert(title: string, options?: { description?: string; privacyStatus?: 'public' | 'private' | 'unlisted'; tags?: string[]; defaultLanguage?: string }, callback?: Callback): Promise<YtResult> | void;
  insertAsync(title: string, options?: { description?: string; privacyStatus?: 'public' | 'private' | 'unlisted'; tags?: string[]; defaultLanguage?: string }): Promise<YtResult>;
  update(playlistId: string, options?: { title?: string; description?: string; privacyStatus?: 'public' | 'private' | 'unlisted'; tags?: string[]; defaultLanguage?: string }, callback?: Callback): Promise<YtResult> | void;
  updateAsync(playlistId: string, options?: { title?: string; description?: string; privacyStatus?: 'public' | 'private' | 'unlisted'; tags?: string[]; defaultLanguage?: string }): Promise<YtResult>;
  delete(playlistId: string, callback?: Callback): Promise<YtResult> | void;
  deleteAsync(playlistId: string): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

### CommentsResource

```typescript
interface CommentsResource {
  // Listar
  list(videoId?: string, channelId?: string, callback?: Callback): Promise<YtResult> | void;
  listAsync(videoId?: string, channelId?: string): Promise<YtResult>;
  getComments(options?: { id?: string | string[]; parentId?: string; maxResults?: number; pageToken?: string }, callback?: Callback): Promise<YtResult> | void;
  getCommentsAsync(options?: { id?: string | string[]; parentId?: string; maxResults?: number; pageToken?: string }): Promise<YtResult>;
  
  // CRUD (requiere OAuth)
  add(videoId: string, text: string, options?: { channelId?: string }, callback?: Callback): Promise<YtResult> | void;
  addAsync(videoId: string, text: string, options?: { channelId?: string }): Promise<YtResult>;
  reply(parentCommentId: string, text: string, callback?: Callback): Promise<YtResult> | void;
  replyAsync(parentCommentId: string, text: string): Promise<YtResult>;
  update(commentId: string, text: string, callback?: Callback): Promise<YtResult> | void;
  updateAsync(commentId: string, text: string): Promise<YtResult>;
  delete(commentId: string, callback?: Callback): Promise<YtResult> | void;
  deleteAsync(commentId: string): Promise<YtResult>;
  
  // Moderación (requiere OAuth - solo propietario del canal)
  setModerationStatus(commentIds: string | string[], status: 'published' | 'heldForReview' | 'rejected', options?: { banAuthor?: boolean }, callback?: Callback): Promise<YtResult> | void;
  setModerationStatusAsync(commentIds: string | string[], status: 'published' | 'heldForReview' | 'rejected', options?: { banAuthor?: boolean }): Promise<YtResult>;
  markAsSpam(commentId: string, callback?: Callback): Promise<YtResult> | void;
  markAsSpamAsync(commentId: string): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

### CaptionsResource

```typescript
interface CaptionsResource {
  // Listar
  list(videoId: string, callback?: Callback): Promise<YtResult> | void;
  listAsync(videoId: string): Promise<YtResult>;
  
  // Descargar
  download(captionId: string, format?: 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt' | null, options?: { tlang?: string }, callback?: Callback): Promise<string> | void;
  downloadAsync(captionId: string, format?: 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt' | null, options?: { tlang?: string }): Promise<string>;
  
  // CRUD (requiere OAuth)
  upload(videoId: string, language: string, captionFile: string | Buffer, options?: CaptionUploadOptions, callback?: Callback): Promise<YtResult> | void;
  uploadAsync(videoId: string, language: string, captionFile: string | Buffer, options?: CaptionUploadOptions): Promise<YtResult>;
  update(captionId: string, captionFile: string | Buffer, options?: CaptionUploadOptions, callback?: Callback): Promise<YtResult> | void;
  updateAsync(captionId: string, captionFile: string | Buffer, options?: CaptionUploadOptions): Promise<YtResult>;
  setDraftStatus(captionId: string, isDraft: boolean, callback?: Callback): Promise<YtResult> | void;
  setDraftStatusAsync(captionId: string, isDraft: boolean): Promise<YtResult>;
  delete(captionId: string, callback?: Callback): Promise<YtResult> | void;
  deleteAsync(captionId: string): Promise<YtResult>;
  
  // Configuración
  setKey(key: string): void;
  setHeader(key: string, value: string): void;
  setRetryOptions(options: RetryOptions): void;
}
```

## YouTubeAuth Interface

```typescript
interface YouTubeAuth {
  constructor(config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  });
  
  generateAuthUrl(options: AuthUrlOptions): string;
  getTokens(code: string): Promise<OAuthTokens>;
  refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;
}
```

## Métodos Legacy

La librería también mantiene métodos legacy para compatibilidad:

```typescript
interface YouTubeLegacy {
  // Videos
  getById(id: string, callback?: Callback): Promise<YtResult> | void;
  getByIdAsync(id: string): Promise<YtResult>;
  
  // Canales
  getChannelById(id: string, callback?: Callback): Promise<YtResult> | void;
  getChannelByIdAsync(id: string): Promise<YtResult>;
  
  // Playlists
  getPlayListsById(id: string, callback?: Callback): Promise<YtResult> | void;
  getPlayListsByIdAsync(id: string): Promise<YtResult>;
  getPlayListsItemsById(id: string, maxResults?: number | Callback, callback?: Callback): Promise<YtResult> | void;
  getPlayListsItemsByIdAsync(id: string, maxResults?: number): Promise<YtResult>;
  
  // Search
  related(id: string, maxResults: number, callback?: Callback): Promise<YtResult> | void;
  relatedAsync(id: string, maxResults: number): Promise<YtResult>;
  
  // Popular
  getMostPopular(maxResults: number, callback?: Callback): Promise<YtResult> | void;
  getMostPopularAsync(maxResults: number): Promise<YtResult>;
  getMostPopularByCategory(maxResults: number, videoCategoryId: string | number, callback?: Callback): Promise<YtResult> | void;
  getMostPopularByCategoryAsync(maxResults: number, videoCategoryId: string | number): Promise<YtResult>;
}
```

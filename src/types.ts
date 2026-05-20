/**
 * Types for the YouTube API
 */

// Basic types for the YouTube API
export interface YtThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

export interface YtThumbnails {
  default?: YtThumbnail;
  medium?: YtThumbnail;
  high?: YtThumbnail;
  standard?: YtThumbnail;
  maxres?: YtThumbnail;
}

export interface YtLocalized {
  title?: string;
  description?: string;
}

export interface YtSnippet {
  publishedAt?: string;
  channelId?: string;
  title?: string;
  description?: string;
  thumbnails?: YtThumbnails;
  channelTitle?: string;
  tags?: string[];
  categoryId?: string;
  liveBroadcastContent?: string;
  localized?: YtLocalized;
  resourceId?: {
    kind?: string;
    channelId?: string;
  };
}

export interface YtContentDetails {
  duration?: string;
  dimension?: string;
  definition?: string;
  caption?: string;
  licensedContent?: boolean;
  projection?: string;
}

export interface YtStatus {
  uploadStatus?: string;
  privacyStatus?: string;
  license?: string;
  embeddable?: boolean;
  publicStatsViewable?: boolean;
}

export interface YtStatistics {
  viewCount?: string;
  likeCount?: string;
  dislikeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
  subscriberCount?: string;
  videoCount?: string;
  hiddenSubscriberCount?: boolean;
}

export interface YtVideoId {
  kind?: string;
  videoId?: string;
}

export interface YtPageInfo {
  totalResults?: number;
  resultsPerPage?: number;
}

export interface YtItem {
  kind?: string;
  etag?: string;
  id?: string | YtVideoId;
  snippet?: YtSnippet;
  contentDetails?: YtContentDetails;
  status?: YtStatus;
  statistics?: YtStatistics;
}

export interface YtResult {
  kind?: string;
  etag?: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo?: YtPageInfo;
  items?: YtItem[];
}

// Types for callbacks
export type Callback = (error?: Error | null | undefined, data?: YtResult | undefined) => void;

// Types for retry options
export interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

// Types for YouTube options
export interface YouTubeOptions {
  retryOptions?: RetryOptions;
  headers?: Record<string, string>;
}

// Types for search parameters
export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

// Types for Video Resource (update)
export interface VideoSnippet {
  title?: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  defaultLanguage?: string;
}

export interface VideoStatus {
  privacyStatus?: 'public' | 'private' | 'unlisted';
  license?: 'youtube' | 'creativeCommon';
  embeddable?: boolean;
  publicStatsViewable?: boolean;
}

export interface RecordingDetails {
  recordingDate?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
  };
  locationDescription?: string;
}

export interface Localization {
  title?: string;
  description?: string;
}

export interface VideoResource {
  id?: string;
  snippet?: VideoSnippet;
  status?: VideoStatus;
  recordingDetails?: RecordingDetails;
  localizations?: Record<string, Localization>;
}

// Types for ChannelSections
export type ChannelSectionType =
  | 'allPlaylists'
  | 'completedEvents'
  | 'likedPlaylists'
  | 'likes'
  | 'liveEvents'
  | 'multipleChannels'
  | 'multiplePlaylists'
  | 'popularUploads'
  | 'postedPlaylists'
  | 'postedVideos'
  | 'recentActivity'
  | 'recentPosts'
  | 'recentUploads'
  | 'singlePlaylist'
  | 'subscriptions'
  | 'upcomingEvents';

export interface ChannelSectionSnippet {
  type: ChannelSectionType;
  title?: string;
  position?: number;
}

export interface ChannelSectionContentDetails {
  playlists?: string[];
  channels?: string[];
}

export interface ChannelSectionResource {
  id?: string;
  snippet?: ChannelSectionSnippet;
  contentDetails?: ChannelSectionContentDetails;
}

// Types for Watermarks
export interface WatermarkTiming {
  type?: 'fromStart' | 'fromEnd' | 'custom';
  offsetMs?: number;
  durationMs?: number;
}

export interface WatermarkResource {
  timing?: WatermarkTiming;
  position?: {
    type?: 'corner' | 'center';
    cornerPosition?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  };
}

// Types for VideoAbuseReportReasons
export interface VideoAbuseReportReason {
  id?: string;
  snippet?: {
    label?: string;
    secondaryReasons?: Array<{
      id?: string;
      label?: string;
    }>;
  };
}

export interface VideoReport {
  videoId?: string;
  reasonId?: string;
  secondaryReasonId?: string;
  comments?: string;
  language?: string;
}

// Types for pagination
export interface PaginatedResult extends YtResult {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: (callback?: Callback) => Promise<YtResult> | void;
  prevPage: (callback?: Callback) => Promise<YtResult> | void;
}

export interface PaginationOptions {
  maxResults?: number;
  pageToken?: string;
  q?: string;
  id?: string;
  playlistId?: string;
  [key: string]: string | number | boolean | undefined;
}

// Types for Subscriptions (Issue #83)
export interface SubscriptionSnippet {
  publishedAt?: string;
  channelTitle?: string;
  channelId?: string;
  title?: string;
  description?: string;
  resourceId?: {
    kind?: string;
    channelId?: string;
  };
}

export interface SubscriptionResource {
  id?: string;
  snippet?: SubscriptionSnippet;
  subscriberSnippet?: {
    title?: string;
    description?: string;
    thumbnails?: YtThumbnails;
  };
}

// Types for Channels Update (Issue #84)
export interface ChannelBrandingSettings {
  channel?: {
    title?: string;
    description?: string;
    keywords?: string;
    defaultLanguage?: string;
    country?: string;
  };
  image?: {
    bannerExternalUrl?: string;
  };
}

export interface ChannelResource {
  id?: string;
  brandingSettings?: ChannelBrandingSettings;
  localizations?: Record<string, Localization>;
}

export interface ChannelBannerResult {
  url?: string;
  etag?: string;
}

// Types for Videos Insert (Issue #85)
export interface VideoUploadOptions {
  part?: string[];
  notifySubscribers?: boolean;
  onProgress?: (progress: { bytesUploaded: number; bytesTotal: number; percent: number }) => void;
}

export interface VideoUploadResource {
  snippet?: {
    title: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    defaultLanguage?: string;
  };
  status?: {
    privacyStatus?: 'public' | 'private' | 'unlisted';
    embeddable?: boolean;
    license?: 'youtube' | 'creativeCommon';
    publicStatsViewable?: boolean;
  };
  recordingDetails?: RecordingDetails;
  localizations?: Record<string, Localization>;
}

// Types for Captions (Issue #86)
export type CaptionFormat = 'srt' | 'sbv' | 'scc' | 'ttml' | 'vtt';

export interface CaptionSnippet {
  videoId?: string;
  language?: string;
  name?: string;
  isDraft?: boolean;
  isAutoSynced?: boolean;
}

export interface CaptionResource {
  id?: string;
  snippet?: CaptionSnippet;
}

export interface CaptionUploadOptions {
  name?: string;
  isDraft?: boolean;
  isAutoSynced?: boolean;
}

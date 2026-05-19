/**
 * Tipos para la API de YouTube
 */

// Tipos básicos de la API de YouTube
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

// Tipos para callbacks
export type Callback = (error?: Error | null | undefined, data?: YtResult | undefined) => void;

// Tipos para opciones de retry
export interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

// Tipos para opciones de YouTube
export interface YouTubeOptions {
  retryOptions?: RetryOptions;
}

// Tipos para parámetros de búsqueda
export interface SearchParams {
  [key: string]: string | number | boolean | undefined;
}

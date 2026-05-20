import YouTube from './lib/youtube';
import {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} from './lib/errors';

// Export main class
export default YouTube;
export { YouTube };

// Export error classes
export {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
};

// Export resources
export {
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
} from './lib/resources';

// Export OAuth authentication
export {
  YouTubeAuth,
  OAuthTokens,
  AuthUrlOptions,
  YouTubeScopes,
} from './lib/auth';

// Export types
export * from './types';

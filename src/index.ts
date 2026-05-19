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

// Exportar clase principal
export default YouTube;
export { YouTube };

// Exportar clases de error
export {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
};

// Exportar recursos
export {
  YouTubeResource,
  VideosResource,
  ChannelsResource,
  PlaylistsResource,
  SearchResource,
} from './lib/resources';

// Exportar tipos
export * from './types';

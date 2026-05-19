---
sidebar_position: 1
---

# Tipos

Referencia completa de tipos TypeScript disponibles en `youtube-node`.

## Tipos Básicos

### Callback

```typescript
type Callback = (error: Error | null, result?: YtResult) => void;
```

### SearchParams

```typescript
interface SearchParams {
  // Paginación
  pageToken?: string;
  
  // Filtros de tipo
  type?: 'video' | 'channel' | 'playlist';
  
  // Filtros de video
  videoDuration?: 'short' | 'medium' | 'long' | 'any';
  videoDefinition?: 'high' | 'standard' | 'any';
  videoDimension?: '2d' | '3d' | 'any';
  videoLicense?: 'creativeCommon' | 'youtube' | 'any';
  videoEmbeddable?: boolean;
  videoSyndicated?: boolean;
  videoType?: 'episode' | 'movie' | 'any';
  videoCategoryId?: string;
  
  // Filtros de canal
  channelId?: string;
  channelType?: 'show' | 'any';
  
  // Filtros de eventos
  eventType?: 'live' | 'completed' | 'upcoming';
  
  // Filtros de ubicación
  location?: string;
  locationRadius?: string;
  regionCode?: string;
  
  // Filtros de idioma
  relevanceLanguage?: string;
  
  // Filtros de fecha
  publishedAfter?: string;
  publishedBefore?: string;
  
  // Ordenamiento
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  
  // Búsqueda segura
  safeSearch?: 'none' | 'moderate' | 'strict';
  
  // Para contenido de partner
  forContentOwner?: boolean;
  forDeveloper?: boolean;
  forMine?: boolean;
}
```

### PaginationOptions

```typescript
interface PaginationOptions {
  pageToken?: string;
  maxResults?: number;
  q?: string;
  id?: string;
  playlistId?: string;
}
```

### YouTubeOptions

```typescript
interface YouTubeOptions {
  retryOptions?: RetryOptions;
}
```

### RetryOptions

```typescript
interface RetryOptions {
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  retryCondition?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}
```

## Tipos de Respuesta

### YtResult

```typescript
interface YtResult {
  kind?: string;
  etag?: string;
  pageInfo?: {
    totalResults: number;
    resultsPerPage: number;
  };
  items?: any[];
  nextPageToken?: string;
  prevPageToken?: string;
}
```

### VideoStatus

```typescript
interface VideoStatus {
  privacyStatus?: 'public' | 'private' | 'unlisted';
  publishAt?: string;
  license?: 'youtube' | 'creativeCommon';
  embeddable?: boolean;
  publicStatsViewable?: boolean;
  uploadStatus?: string;
  failureReason?: string;
  rejectionReason?: string;
}
```

### VideoResource

```typescript
interface VideoResource {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    defaultLanguage?: string;
    defaultAudioLanguage?: string;
  };
  status?: VideoStatus;
  contentDetails?: {
    duration?: string;
    dimension?: '2d' | '3d';
    definition?: 'hd' | 'sd';
    caption?: string;
    licensedContent?: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
    projection?: 'rectangular' | '360';
  };
  recordingDetails?: {
    recordingDate?: string;
    location?: {
      latitude?: number;
      longitude?: number;
      altitude?: number;
    };
    locationDescription?: string;
  };
  localizations?: Record<string, {
    title?: string;
    description?: string;
  }>;
}
```

### VideoUploadResource

```typescript
interface VideoUploadResource {
  snippet: {
    title: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    defaultLanguage?: string;
    defaultAudioLanguage?: string;
  };
  status: {
    privacyStatus: 'public' | 'private' | 'unlisted';
    publishAt?: string;
    license?: 'youtube' | 'creativeCommon';
    embeddable?: boolean;
    publicStatsViewable?: boolean;
  };
}
```

### VideoUploadOptions

```typescript
interface VideoUploadOptions {
  part?: string[];
  notifySubscribers?: boolean;
}
```

### ChannelResource

```typescript
interface ChannelResource {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    defaultLanguage?: string;
  };
  status?: {
    privacyStatus?: string;
    isLinked?: boolean;
    longUploadsStatus?: string;
    madeForKids?: boolean;
    selfDeclaredMadeForKids?: boolean;
  };
  brandingSettings?: {
    channel?: {
      title?: string;
      description?: string;
      keywords?: string;
      defaultTab?: string;
      trackingAnalyticsAccountId?: string;
      moderateComments?: boolean;
      showRelatedChannels?: boolean;
      showBrowseView?: boolean;
      featuredChannelsTitle?: string;
      featuredChannelsUrls?: string[];
      unsubscribedTrailer?: string;
      profileColor?: string;
      defaultLanguage?: string;
    };
    watch?: {
      textColor?: string;
      backgroundColor?: string;
      featuredPlaylistId?: string;
    };
    image?: {
      bannerExternalUrl?: string;
    };
  };
  contentDetails?: {
    relatedPlaylists?: {
      likes?: string;
      favorites?: string;
      uploads: string;
      watchHistory?: string;
      watchLater?: string;
    };
  };
  localizations?: Record<string, {
    title?: string;
    description?: string;
  }>;
}
```

### ChannelBannerResult

```typescript
interface ChannelBannerResult {
  url: string;
  etag: string;
}
```

### ChannelSectionResource

```typescript
interface ChannelSectionResource {
  id?: string;
  snippet?: {
    type?: string;
    style?: string;
    channelId?: string;
    title?: string;
    position?: number;
    defaultLanguage?: string;
  };
  contentDetails?: {
    playlists?: string[];
    channels?: string[];
  };
  targeting?: {
    languages?: string[];
    regions?: string[];
  };
}
```

### CaptionUploadOptions

```typescript
interface CaptionUploadOptions {
  name?: string;
  isDraft?: boolean;
  autoSync?: boolean;
}
```

### WatermarkTiming

```typescript
interface WatermarkTiming {
  type?: 'fromStart' | 'fromEnd' | 'custom';
  offsetMs?: number;
  durationMs?: number;
}
```

## Tipos de OAuth

### OAuthTokens

```typescript
interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  scope: string;
  token_type: string;
}
```

### AuthUrlOptions

```typescript
interface AuthUrlOptions {
  scope: string | string[];
  state?: string;
  accessType?: 'online' | 'offline';
  prompt?: 'none' | 'consent' | 'select_account';
  loginHint?: string;
  includeGrantedScopes?: boolean;
}
```

### YouTubeScopes

```typescript
enum YouTubeScopes {
  READ_ONLY = 'https://www.googleapis.com/auth/youtube.readonly',
  UPLOAD = 'https://www.googleapis.com/auth/youtube.upload',
  MANAGE = 'https://www.googleapis.com/auth/youtube',
  FORCE_SSL = 'https://www.googleapis.com/auth/youtube.force-ssl',
  PARTNER = 'https://www.googleapis.com/auth/youtubepartner',
  PARTNER_CONTENT = 'https://www.googleapis.com/auth/youtubepartner-content-owner-readonly',
}
```

## Uso de Tipos

### Extender Tipos

```typescript
import { VideoResource } from 'youtube-node';

// Extender el tipo existente
interface MyVideoResource extends VideoResource {
  customField?: string;
  internalId?: number;
}

const myVideo: MyVideoResource = {
  snippet: {
    title: 'Mi Video',
    customField: 'valor personalizado',
  },
  status: {
    privacyStatus: 'public',
  },
};
```

### Type Guards

```typescript
import { YouTubeError, QuotaExceededError } from 'youtube-node';

function isQuotaError(error: any): error is QuotaExceededError {
  return error instanceof QuotaExceededError;
}

async function safeOperation() {
  try {
    return await youTube.videos.getById('VIDEO_ID');
  } catch (error) {
    if (isQuotaError(error)) {
      // TypeScript sabe que error es QuotaExceededError
      console.log('Cuota excedida');
    }
  }
}
```

### Tipos de Retorno

```typescript
import { YtResult } from 'youtube-node';

// Función con tipo de retorno explícito
async function searchVideos(query: string): Promise<YtResult> {
  return youTube.search.query(query, 10);
}

// Función que retorna null en error
async function safeGetVideo(videoId: string): Promise<YtResult | null> {
  try {
    return await youTube.videos.getById(videoId);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return null;
    }
    throw error;
  }
}
```

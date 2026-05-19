# youtube-node [![Dependency Status](https://david-dm.org/paulomcnally/youtube-node.png)](https://david-dm.org/paulomcnally/youtube-node) [![NPM version](https://badge.fury.io/js/youtube-node.png)](http://badge.fury.io/js/youtube-node)

[![NPM](https://nodei.co/npm/youtube-node.png?downloads=true)](https://nodei.co/npm/youtube-node/)

* YouTube API v3 - Require key ([video](https://www.youtube.com/watch?v=Im69kzhpR3I))
* CLI
* **Written in TypeScript with full type support**
* **Native Promise/async-await support** (NEW!)

## Installation

```bash
npm install youtube-node
```

## Usage with Promises (Recommended)

All methods now support native Promises! Simply omit the callback parameter:

### TypeScript with async/await

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Using async/await (recommended)
async function searchVideos() {
  try {
    const result = await youTube.search.query('nodejs tutorial', 10);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get video details
async function getVideoDetails() {
  try {
    const video = await youTube.videos.getById('VIDEO_ID');
    console.log('Title:', video.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### JavaScript with async/await

```javascript
const YouTube = require('youtube-node');

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

async function main() {
  try {
    // Search videos
    const results = await youTube.search.query('nodejs tutorial', 10);
    console.log(`Found ${results.pageInfo?.totalResults} videos`);

    // Get video details
    const video = await youTube.videos.getById('VIDEO_ID');
    console.log('Video:', video.items?.[0]?.snippet?.title);

    // Get related videos
    const related = await youTube.search.related('VIDEO_ID', 5);
    console.log('Related videos:', related.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Using .then()/.catch()

```javascript
const YouTube = require('youtube-node');

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Using traditional Promise syntax
youTube.search.query('nodejs tutorial', 10)
  .then(results => {
    console.log('Results:', results.items?.length);
    return youTube.videos.getById('VIDEO_ID');
  })
  .then(video => {
    console.log('Video:', video.items?.[0]?.snippet?.title);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Legacy Callback Usage (Still Supported)

For backward compatibility, callbacks are still supported:

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Using callbacks (backward compatible)
youTube.search.query('World War z Trailer', 2, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
});
```

## Error Handling

The library provides specific error classes for different types of errors:

```typescript
import { YouTube, YouTubeError, QuotaExceededError, RateLimitError } from 'youtube-node';

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

try {
  // Works with both callback and Promise styles
  const result = await youTube.videos.getById('VIDEO_ID');
} catch (error) {
  if (error instanceof QuotaExceededError) {
    console.log('API quota exceeded');
  } else if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded - will retry automatically');
  } else if (error instanceof YouTubeError) {
    console.log('YouTube API error:', error.message);
  }
}
```

### Available Error Classes

- `YouTubeError` - Base error class
- `QuotaExceededError` - API quota exceeded (403)
- `InvalidKeyError` - Invalid API key (400)
- `ResourceNotFoundError` - Resource not found (404)
- `RateLimitError` - Rate limit exceeded (429)
- `ValidationError` - Parameter validation error
- `NetworkError` - Network/connection error

## Retry Configuration

You can configure automatic retry with exponential backoff:

```typescript
const youTube = new YouTube({
  retryOptions: {
    retries: 3,              // Number of retry attempts
    retryDelay: 1000,        // Base delay in ms
    maxRetryDelay: 30000,    // Maximum delay in ms
    retryCondition: (error) => {
      // Custom retry logic
      return error instanceof RateLimitError;
    },
    onRetry: (error, attempt) => {
      console.log(`Retry attempt ${attempt} due to: ${error.message}`);
    }
  }
});
```

## Modular API Resources

The library provides organized resources for different API endpoints:

```typescript
const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Videos resource
const video = await youtube.videos.getById('VIDEO_ID');
const popular = await youtube.videos.getMostPopular(10);
const byCategory = await youtube.videos.getMostPopularByCategory(10, 10); // Music category

// Channels resource
const channel = await youtube.channels.getById('CHANNEL_ID');

// Playlists resource
const playlist = await youtube.playlists.getById('PLAYLIST_ID');
const items = await youtube.playlists.getItemsById('PLAYLIST_ID', 50);

// Search resource
const results = await youtube.search.query('nodejs tutorial', 10);
const related = await youtube.search.related('VIDEO_ID', 5);
```

## Pagination (Issue #50, #31)

You can paginate through results using `pageToken`:

```typescript
const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Get first page
const firstPage = await youTube.search.query('nodejs tutorial', 50);
console.log(`Found ${firstPage.items?.length} items`);
console.log(`Next page token: ${firstPage.nextPageToken}`);

// Get second page using pageToken
if (firstPage.nextPageToken) {
  const secondPage = await youTube.search.query('nodejs tutorial', 50, { 
    pageToken: firstPage.nextPageToken 
  });
  console.log(`Found ${secondPage.items?.length} more items`);
}

// Playlist items pagination (Issue #31)
const playlistItems = await youtube.playlistItems.list('PLAYLIST_ID', { 
  maxResults: 50 
});

if (playlistItems.nextPageToken) {
  const moreItems = await youtube.playlistItems.list('PLAYLIST_ID', {
    maxResults: 50,
    pageToken: playlistItems.nextPageToken
  });
}
```

## Filtering Search Results (Issue #41)

You can filter search results by type and other parameters:

```typescript
// Search only videos (filter out channels and playlists)
const videoResults = await youTube.search.query('nodejs tutorial', 50, { 
  type: 'video'  // 'video', 'channel', or 'playlist'
});

// Filter by video duration
const shortVideos = await youTube.search.query('funny cats', 50, {
  type: 'video',
  videoDuration: 'short'  // 'short' (< 4 min), 'medium' (4-20 min), 'long' (> 20 min)
});

// Filter by HD quality
const hdVideos = await youTube.search.query('4k nature', 50, {
  type: 'video',
  videoDefinition: 'high'  // 'high' or 'standard'
});

// Combined filters
const filteredResults = await youTube.search.query('tutorial', 50, {
  type: 'video',
  videoDuration: 'medium',
  videoDefinition: 'high',
  order: 'viewCount'  // Sort by view count
});
```

## Referer Header (Issue #52)

If you get a "referer" error when using an API key with referer restrictions:

```typescript
const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Set referer to fix "The request did not specify any referer" error
youTube.setReferer('https://example.com');

// Or set custom headers
youTube.setHeader('Referer', 'https://example.com');

// Now you can make requests
const results = await youTube.search.query('nodejs tutorial', 10);
```

## Working with Multiple Video IDs (Issue #67)

You can fetch multiple videos at once:

```typescript
// Get multiple videos by IDs
const videos = await youtube.videos.getByIds(['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3']);

// With custom parts
const videosWithStats = await youtube.videos.getByIds(
  ['VIDEO_ID_1', 'VIDEO_ID_2'],
  { parts: ['snippet', 'statistics'] }
);

// Get most popular videos by region
const popularInUS = await youtube.videos.getMostPopularByRegion(10, 'US');
const popularInSpain = await youtube.videos.getMostPopularByRegion(10, 'ES');
```

## Advanced Usage: Custom Parameters (Issue #33)

If you need to add custom parameters to requests, use the `params` option in method calls:

```typescript
// Add custom parameters using the options parameter
const results = await youTube.search.query('nodejs tutorial', 50, {
  type: 'video',
  videoDefinition: 'high',
  publishedAfter: '2024-01-01T00:00:00Z'
});
```

Note: Each method internally clears params and parts before making the request, so custom parameters should be passed through the method's options parameter rather than using `addParam()` directly.

## CLI

For use CLI need install youtube-node using -g param.

```bash
npm install youtube-node -g
```

### CLI Example getById ( require key and video ID )

```bash
youtube id
```

### CLI Example search (require key, query and maxResults)

```bash
youtube search
```

## API Methods

All methods support both **callbacks** (legacy) and **Promises** (new). 
If you pass a callback, the method returns `void`. If you omit the callback, it returns a `Promise<YtResult>`.

### Search Methods

#### `youtube.search.query(query, maxResults, [params], [callback])`
Search for videos on YouTube.

```typescript
// With Promise (new way)
const result = await youTube.search.query('nodejs tutorial', 10);

// With callback (legacy)
youTube.search.query('nodejs tutorial', 10, (error, result) => {
  // handle result
});

// With optional parameters (pagination)
const result = await youTube.search.query('nodejs tutorial', 10, { pageToken: 'NEXT_PAGE_TOKEN' });
```

#### `youtube.search.related(id, maxResults, [callback])`
Get related videos.

```typescript
// With Promise
const result = await youTube.search.related('VIDEO_ID', 5);

// With callback
youTube.search.related('VIDEO_ID', 5, (error, result) => {
  // handle result
});
```

### Video Methods

#### `youtube.videos.getById(id, [callback])`
Get video details by ID.

```typescript
const result = await youTube.videos.getById('VIDEO_ID');
```

#### `youtube.videos.getMostPopular(maxResults, [callback])`
Get most popular videos.

```typescript
const result = await youTube.videos.getMostPopular(10);
```

#### `youtube.videos.getMostPopularByCategory(maxResults, videoCategoryId, [callback])`
Get most popular videos by category.

```typescript
const result = await youTube.videos.getMostPopularByCategory(10, 10); // 10 = Music
```

### Channel Methods (Issue #44)

#### `youtube.channels.getById(id, [callback])`
Get channel details by ID.

```typescript
// Get channel by ID
const result = await youTube.channels.getById('CHANNEL_ID');
console.log('Channel:', result.items?.[0]?.snippet?.title);

// Get channel by username (legacy) or handle
const byUsername = await youTube.channels.getByUsername('GoogleDevelopers');
const byHandle = await youTube.channels.getByUsername('@YouTube');

// Get your own channel (requires OAuth)
const myChannel = await youTube.channels.getMyChannel();
```

### Playlist Methods

#### `youtube.playlists.getById(id, [callback])`
Get playlist details by ID.

```typescript
const result = await youTube.playlists.getById('PLAYLIST_ID');
```

#### `youtube.playlists.getItemsById(id, [maxResults], [callback])`
Get playlist items by playlist ID.

```typescript
const result = await youTube.playlists.getItemsById('PLAYLIST_ID', 50);
```

## Legacy Methods (Deprecated)

The following methods are kept for backward compatibility but are deprecated:

| Legacy Method | New Method |
|--------------|------------|
| `getById(id, callback)` | `videos.getById(id)` |
| `getByIdAsync(id)` | `videos.getById(id)` |
| `getChannelById(id, callback)` | `channels.getById(id)` |
| `getChannelByIdAsync(id)` | `channels.getById(id)` |
| `getPlayListsById(id, callback)` | `playlists.getById(id)` |
| `getPlayListsByIdAsync(id)` | `playlists.getById(id)` |
| `getPlayListsItemsById(id, callback)` | `playlists.getItemsById(id)` |
| `getPlayListsItemsByIdAsync(id)` | `playlists.getItemsById(id)` |
| `related(id, maxResults, callback)` | `search.related(id, maxResults)` |
| `relatedAsync(id, maxResults)` | `search.related(id, maxResults)` |
| `getMostPopular(maxResults, callback)` | `videos.getMostPopular(maxResults)` |
| `getMostPopularAsync(maxResults)` | `videos.getMostPopular(maxResults)` |
| `getMostPopularByCategory(maxResults, categoryId, callback)` | `videos.getMostPopularByCategory(maxResults, categoryId)` |
| `getMostPopularByCategoryAsync(maxResults, categoryId)` | `videos.getMostPopularByCategory(maxResults, categoryId)` |

## Examples

Check out the `/example/promises/` directory for more examples:

- `basic-async-await.js` - Basic usage with async/await
- `search.js` - Search with filters
- `channel.js` - Get channel information
- `playlist.js` - Work with playlists
- `related.js` - Get related videos
- `most-popular.js` - Get most popular videos
- `error-handling.js` - Error handling examples
- `comparison.js` - Compare callbacks vs Promises

## Building from Source

```bash
# Clone the repository
git clone https://github.com/paulomcnally/youtube-node.git
cd youtube-node

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test
```

## Development

```bash
# Watch mode compilation
npm run typecheck -- --watch

# Lint code
npm run eslint
```

## Those who use it?
* [http://sync.club/](http://sync.club/#dev-session)

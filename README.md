# youtube-node [![Dependency Status](https://david-dm.org/paulomcnally/youtube-node.png)](https://david-dm.org/paulomcnally/youtube-node) [![NPM version](https://badge.fury.io/js/youtube-node.png)](http://badge.fury.io/js/youtube-node)

[![NPM](https://nodei.co/npm/youtube-node.png?downloads=true)](https://nodei.co/npm/youtube-node/)

* YouTube API v3 - Require key ([video](https://www.youtube.com/watch?v=Im69kzhpR3I))
* CLI
* **Written in TypeScript with full type support**

## Installation

```bash
npm install youtube-node
```

## TypeScript Usage

```typescript
import YouTube from 'youtube-node';
// or import { YouTube } from 'youtube-node';

const youTube = new YouTube();

youTube.setKey('YOUR_API_KEY');

// Using callbacks
youTube.search('World War z Trailer', 2, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
});

// Using Promises (async/await)
async function searchVideos() {
  try {
    const result = await youTube.searchAsync('World War z Trailer', 2);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(error);
  }
}
```

## JavaScript Usage

```javascript
const YouTube = require('youtube-node');

const youTube = new YouTube();

youTube.setKey('YOUR_API_KEY');

youTube.search('World War z Trailer', 2, function(error, result) {
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
  const result = await youTube.getByIdAsync('VIDEO_ID');
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

### search(query, maxResults, [params], callback)
Search for videos on YouTube.

```typescript
youTube.search('nodejs tutorial', 10, (error, result) => {
  // handle result
});

// With optional parameters (pagination)
youTube.search('nodejs tutorial', 10, { pageToken: 'NEXT_PAGE_TOKEN' }, (error, result) => {
  // handle result
});
```

### searchAsync(query, maxResults, [params])
Promise-based version of search.

```typescript
const result = await youTube.searchAsync('nodejs tutorial', 10);
```

### getById(id, callback)
Get video details by ID.

```typescript
youTube.getById('VIDEO_ID', (error, result) => {
  // handle result
});
```

### getByIdAsync(id)
Promise-based version of getById.

```typescript
const result = await youTube.getByIdAsync('VIDEO_ID');
```

### getChannelById(id, callback)
Get channel details by ID.

```typescript
youTube.getChannelById('CHANNEL_ID', (error, result) => {
  // handle result
});
```

### getChannelByIdAsync(id)
Promise-based version of getChannelById.

```typescript
const result = await youTube.getChannelByIdAsync('CHANNEL_ID');
```

### getPlayListsById(id, callback)
Get playlist details by ID.

```typescript
youTube.getPlayListsById('PLAYLIST_ID', (error, result) => {
  // handle result
});
```

### getPlayListsByIdAsync(id)
Promise-based version of getPlayListsById.

```typescript
const result = await youTube.getPlayListsByIdAsync('PLAYLIST_ID');
```

### getPlayListsItemsById(id, [maxResults], callback)
Get playlist items by playlist ID.

```typescript
youTube.getPlayListsItemsById('PLAYLIST_ID', 50, (error, result) => {
  // handle result
});
```

### getPlayListsItemsByIdAsync(id, [maxResults])
Promise-based version of getPlayListsItemsById.

```typescript
const result = await youTube.getPlayListsItemsByIdAsync('PLAYLIST_ID', 50);
```

### related(id, maxResults, callback)
Get related videos.

```typescript
youTube.related('VIDEO_ID', 5, (error, result) => {
  // handle result
});
```

### relatedAsync(id, maxResults)
Promise-based version of related.

```typescript
const result = await youTube.relatedAsync('VIDEO_ID', 5);
```

### getMostPopular(maxResults, callback)
Get most popular videos.

```typescript
youTube.getMostPopular(10, (error, result) => {
  // handle result
});
```

### getMostPopularAsync(maxResults)
Promise-based version of getMostPopular.

```typescript
const result = await youTube.getMostPopularAsync(10);
```

### getMostPopularByCategory(maxResults, videoCategoryId, callback)
Get most popular videos by category.

```typescript
youTube.getMostPopularByCategory(10, 'CATEGORY_ID', (error, result) => {
  // handle result
});
```

### getMostPopularByCategoryAsync(maxResults, videoCategoryId)
Promise-based version of getMostPopularByCategory.

```typescript
const result = await youTube.getMostPopularByCategoryAsync(10, 'CATEGORY_ID');
```

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

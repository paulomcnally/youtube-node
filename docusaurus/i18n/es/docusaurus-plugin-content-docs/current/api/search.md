---
sidebar_position: 3
---

# Search

Learn to search videos, channels and playlists on YouTube.

## Basic Search

### `search.query(query, maxResults, params?)`

Performs a search on YouTube.

```typescript
async function searchVideos() {
  try {
    // Simple search
    const results = await youTube.search.query('nodejs tutorial', 10);
    
    console.log(`Found ${results.pageInfo?.totalResults} results`);
    console.log(`Showing ${results.items?.length} on this page`);
    
    results.items?.forEach((item) => {
      console.log('\n---');
      console.log('Type:', item.id?.kind); // youtube#video, youtube#channel, youtube#playlist
      
      if (item.id?.videoId) {
        console.log('🎬 Video:', item.snippet?.title);
        console.log('   ID:', item.id.videoId);
      } else if (item.id?.channelId) {
        console.log('📺 Channel:', item.snippet?.title);
        console.log('   ID:', item.id.channelId);
      } else if (item.id?.playlistId) {
        console.log('📋 Playlist:', item.snippet?.title);
        console.log('   ID:', item.id.playlistId);
      }
      
      console.log('Channel:', item.snippet?.channelTitle);
      console.log('Description:', item.snippet?.description);
      console.log('Published:', item.snippet?.publishedAt);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Search Filters

### Filter by Type

```typescript
async function searchWithFilters() {
  try {
    // Only videos
    const videos = await youTube.search.query('javascript', 10, {
      type: 'video',
    });
    
    // Only channels
    const channels = await youTube.search.query('google', 10, {
      type: 'channel',
    });
    
    // Only playlists
    const playlists = await youTube.search.query('music', 10, {
      type: 'playlist',
    });
    
    console.log(`Videos: ${videos.items?.length}`);
    console.log(`Channels: ${channels.items?.length}`);
    console.log(`Playlists: ${playlists.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filter by Video Duration

```typescript
async function searchByDuration() {
  try {
    // Short videos (less than 4 minutes)
    const shorts = await youTube.search.query('funny cats', 10, {
      type: 'video',
      videoDuration: 'short',
    });
    
    // Medium videos (4-20 minutes)
    const medium = await youTube.search.query('tutorial', 10, {
      type: 'video',
      videoDuration: 'medium',
    });
    
    // Long videos (more than 20 minutes)
    const long = await youTube.search.query('documentary', 10, {
      type: 'video',
      videoDuration: 'long',
    });
    
    console.log('Short:', shorts.items?.length);
    console.log('Medium:', medium.items?.length);
    console.log('Long:', long.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filter by Quality

```typescript
async function searchByQuality() {
  try {
    // HD videos
    const hd = await youTube.search.query('4k nature', 10, {
      type: 'video',
      videoDefinition: 'high', // 'high' or 'standard'
    });
    
    // 3D videos
    const threeD = await youTube.search.query('3d', 10, {
      type: 'video',
      videoDimension: '3d', // '2d' or '3d'
    });
    
    // Live videos
    const live = await youTube.search.query('news', 10, {
      type: 'video',
      eventType: 'live', // 'live', 'completed', 'upcoming'
    });
    
    console.log('HD:', hd.items?.length);
    console.log('3D:', threeD.items?.length);
    console.log('Live:', live.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filter by Date

```typescript
async function searchByDate() {
  try {
    // Videos published after a date
    const recent = await youTube.search.query('technology', 10, {
      type: 'video',
      publishedAfter: '2024-01-01T00:00:00Z',
    });
    
    // Videos published before a date
    const old = await youTube.search.query('music', 10, {
      type: 'video',
      publishedBefore: '2020-01-01T00:00:00Z',
    });
    
    // Date range
    const range = await youTube.search.query('gaming', 10, {
      type: 'video',
      publishedAfter: '2024-01-01T00:00:00Z',
      publishedBefore: '2024-12-31T23:59:59Z',
    });
    
    console.log('Recent:', recent.items?.length);
    console.log('Old:', old.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Sort Results

```typescript
async function searchWithOrder() {
  try {
    // Sort by date (newest first)
    const byDate = await youTube.search.query('news', 10, {
      type: 'video',
      order: 'date',
    });
    
    // Sort by view count
    const byViews = await youTube.search.query('viral', 10, {
      type: 'video',
      order: 'viewCount',
    });
    
    // Sort by rating
    const byRating = await youTube.search.query('best', 10, {
      type: 'video',
      order: 'rating',
    });
    
    // Sort by title
    const byTitle = await youTube.search.query('music', 10, {
      type: 'video',
      order: 'title',
    });
    
    console.log('By date:', byDate.items?.[0]?.snippet?.title);
    console.log('By views:', byViews.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Combined Filters

```typescript
async function advancedSearch() {
  try {
    const results = await youTube.search.query('tutorial', 50, {
      type: 'video',
      videoDuration: 'medium',
      videoDefinition: 'high',
      order: 'viewCount',
      publishedAfter: '2024-01-01T00:00:00Z',
      regionCode: 'US',
      relevanceLanguage: 'en',
    });
    
    console.log(`Found ${results.items?.length} videos`);
    results.items?.forEach((item) => {
      console.log(`- ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Search in a Specific Channel

```typescript
async function searchInChannel() {
  try {
    const results = await youTube.search.query('javascript', 20, {
      type: 'video',
      channelId: 'CHANNEL_ID', // Search only in this channel
    });
    
    console.log(`Channel videos: ${results.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Related Videos

### `search.related(id, maxResults)`

Gets videos related to a specific video.

```typescript
async function getRelatedVideos() {
  try {
    const related = await youTube.search.related('VIDEO_ID', 10);
    
    console.log('Related videos:');
    related.items?.forEach((video, index) => {
      console.log(`${index + 1}. ${video.snippet?.title}`);
      console.log(`   Channel: ${video.snippet?.channelTitle}`);
      console.log(`   ID: ${video.id?.videoId}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Safe Search

```typescript
async function safeSearch() {
  try {
    // Strict search (filters inappropriate content)
    const strict = await youTube.search.query('query', 10, {
      safeSearch: 'strict', // 'none', 'moderate', 'strict'
    });
    
    // Moderate search
    const moderate = await youTube.search.query('query', 10, {
      safeSearch: 'moderate',
    });
    
    console.log('Strict:', strict.items?.length);
    console.log('Moderate:', moderate.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Video License

```typescript
async function searchByLicense() {
  try {
    // Creative Commons (reusable)
    const creativeCommons = await youTube.search.query('music', 10, {
      type: 'video',
      videoLicense: 'creativeCommon',
    });
    
    // Standard YouTube license
    const youtubeLicense = await youTube.search.query('music', 10, {
      type: 'video',
      videoLicense: 'youtube',
    });
    
    console.log('Creative Commons:', creativeCommons.items?.length);
    console.log('YouTube:', youtubeLicense.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Complete Examples

### Simple Search Engine

```typescript
async function searchEngine(query: string, options: {
  type?: 'video' | 'channel' | 'playlist';
  duration?: 'short' | 'medium' | 'long';
  hd?: boolean;
  sort?: 'date' | 'views' | 'rating';
} = {}) {
  try {
    const params: any = {
      type: options.type || 'video',
    };
    
    if (options.duration) {
      params.videoDuration = options.duration;
    }
    
    if (options.hd) {
      params.videoDefinition = 'high';
    }
    
    if (options.sort) {
      const orderMap: Record<string, string> = {
        date: 'date',
        views: 'viewCount',
        rating: 'rating',
      };
      params.order = orderMap[options.sort];
    }
    
    const results = await youTube.search.query(query, 20, params);
    
    return {
      total: results.pageInfo?.totalResults,
      items: results.items?.map(item => ({
        id: item.id?.videoId || item.id?.channelId || item.id?.playlistId,
        type: item.id?.kind?.replace('youtube#', ''),
        title: item.snippet?.title,
        description: item.snippet?.description,
        channel: item.snippet?.channelTitle,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        publishedAt: item.snippet?.publishedAt,
      })),
      nextPageToken: results.nextPageToken,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Usage
const results = await searchEngine('nodejs tutorial', {
  type: 'video',
  duration: 'medium',
  hd: true,
  sort: 'views',
});
```

### Find Trending Videos

```typescript
async function findTrending(topic: string, days: number = 7) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const publishedAfter = date.toISOString();
    
    const results = await youTube.search.query(topic, 50, {
      type: 'video',
      publishedAfter,
      order: 'viewCount',
      videoDefinition: 'high',
    });
    
    return results.items?.map(item => ({
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      videoId: item.id?.videoId,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      url: `https://youtube.com/watch?v=${item.id?.videoId}`,
    }));
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
```

### Find Creative Commons Content

```typescript
async function findCreativeCommons(query: string, maxResults: number = 20) {
  try {
    const results = await youTube.search.query(query, maxResults, {
      type: 'video',
      videoLicense: 'creativeCommon',
      videoDefinition: 'high',
    });
    
    return {
      query,
      totalFound: results.pageInfo?.totalResults,
      videos: results.items?.map(item => ({
        title: item.snippet?.title,
        description: item.snippet?.description,
        videoId: item.id?.videoId,
        channel: item.snippet?.channelTitle,
        thumbnail: item.snippet?.thumbnails?.high?.url,
        embedUrl: `https://youtube.com/embed/${item.id?.videoId}`,
        license: 'Creative Commons',
        canReuse: true,
      })),
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

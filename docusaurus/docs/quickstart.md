---
sidebar_position: 3
---

# Quick Start

Learn the basics of `youtube-node` in minutes.

## Basic Configuration

```typescript
import YouTube from 'youtube-node';

// Create instance
const youTube = new YouTube();

// Configure your API Key
youTube.setKey('YOUR_YOUTUBE_API_KEY');
```

## Search Videos

```typescript
// Search videos with async/await
async function searchVideos() {
  try {
    const result = await youTube.search.query('nodejs tutorial', 10);
    
    console.log(`Total results: ${result.pageInfo?.totalResults}`);
    
    result.items?.forEach((item) => {
      console.log(`🎬 ${item.snippet?.title}`);
      console.log(`   ID: ${item.id?.videoId}`);
      console.log(`   Channel: ${item.snippet?.channelTitle}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchVideos();
```

## Get Video Information

```typescript
async function getVideoInfo() {
  try {
    const video = await youTube.videos.getById('VIDEO_ID_HERE');
    
    if (video.items && video.items.length > 0) {
      const item = video.items[0];
      console.log('Title:', item.snippet?.title);
      console.log('Description:', item.snippet?.description);
      console.log('Views:', item.statistics?.viewCount);
      console.log('Likes:', item.statistics?.likeCount);
      console.log('Duration:', item.contentDetails?.duration);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Get Channel Information

```typescript
async function getChannelInfo() {
  try {
    // By channel ID
    const channel = await youTube.channels.getById('CHANNEL_ID');
    
    // By username
    const byUsername = await youTube.channels.getByUsername('GoogleDevelopers');
    
    // By handle (@name)
    const byHandle = await youTube.channels.getByUsername('@YouTube');
    
    console.log('Channel:', channel.items?.[0]?.snippet?.title);
    console.log('Subscribers:', channel.items?.[0]?.statistics?.subscriberCount);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Get Related Videos

```typescript
async function getRelatedVideos() {
  try {
    const related = await youTube.search.related('VIDEO_ID', 5);
    
    console.log('Related videos:');
    related.items?.forEach((item) => {
      console.log(`- ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Work with Playlists

```typescript
async function workWithPlaylists() {
  try {
    // Get playlist information
    const playlist = await youTube.playlists.getById('PLAYLIST_ID');
    console.log('Playlist:', playlist.items?.[0]?.snippet?.title);
    
    // Get playlist items
    const items = await youTube.playlists.getItemsById('PLAYLIST_ID', 50);
    console.log(`It has ${items.items?.length} videos`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Popular Videos

```typescript
async function getPopularVideos() {
  try {
    // Most popular videos globally
    const popular = await youTube.videos.getMostPopular(10);
    
    // Popular videos by category (10 = Music)
    const music = await youTube.videos.getMostPopularByCategory(10, 10);
    
    // Popular videos by region (ES = Spain)
    const spain = await youTube.videos.getMostPopularByRegion(10, 'ES');
    
    console.log('Popular:', popular.items?.map(v => v.snippet?.title));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Alternative: Using Promises with .then()

```typescript
youTube.search.query('nodejs', 10)
  .then(result => {
    console.log('Results:', result.items?.length);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Next Steps

- [Authentication and API Keys](./authentication.md) - Configure your API Key
- [Videos](./api/videos.md) - Everything about videos
- [Channels](./api/channels.md) - Everything about channels
- [Search](./api/search.md) - Advanced searches

---
sidebar_position: 1
---

# Videos

Everything about working with videos using `youtube-node`.

## Get Video Information

### `videos.getById(id)`

Gets detailed information about a video by its ID.

```typescript
async function getVideoInfo() {
  try {
    const video = await youTube.videos.getById('VIDEO_ID_HERE');
    
    if (video.items && video.items.length > 0) {
      const item = video.items[0];
      
      console.log('=== VIDEO INFORMATION ===');
      console.log('Title:', item.snippet?.title);
      console.log('Description:', item.snippet?.description);
      console.log('Channel:', item.snippet?.channelTitle);
      console.log('Published:', item.snippet?.publishedAt);
      
      console.log('\n=== STATISTICS ===');
      console.log('Views:', item.statistics?.viewCount);
      console.log('Likes:', item.statistics?.likeCount);
      console.log('Comments:', item.statistics?.commentCount);
      
      console.log('\n=== DETAILS ===');
      console.log('Duration:', item.contentDetails?.duration); // PT5M30S
      console.log('HD Quality:', item.contentDetails?.definition); // hd/sd
      console.log('Dimensions:', item.contentDetails?.dimension); // 2d/3d
      console.log('Captions:', item.contentDetails?.caption); // true/false
      
      console.log('\n=== PRIVACY ===');
      console.log('Status:', item.status?.privacyStatus); // public/private/unlisted
      console.log('Uploaded:', item.status?.uploadStatus); // processed/uploading/failed
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getByIds(ids, options)`

Gets information for multiple videos at once.

```typescript
async function getMultipleVideos() {
  try {
    // Array of IDs
    const videos = await youTube.videos.getByIds([
      'VIDEO_ID_1',
      'VIDEO_ID_2',
      'VIDEO_ID_3'
    ]);
    
    // With custom parts
    const videosWithStats = await youTube.videos.getByIds(
      ['VIDEO_ID_1', 'VIDEO_ID_2'],
      { parts: ['snippet', 'statistics', 'contentDetails'] }
    );
    
    console.log(`Obtained ${videos.items?.length} videos`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Popular Videos

### `videos.getMostPopular(maxResults)`

Gets the most popular videos globally.

```typescript
async function getPopularVideos() {
  try {
    const popular = await youTube.videos.getMostPopular(10);
    
    popular.items?.forEach((video, index) => {
      console.log(`${index + 1}. ${video.snippet?.title}`);
      console.log(`   Channel: ${video.snippet?.channelTitle}`);
      console.log(`   Views: ${video.statistics?.viewCount}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getMostPopularByCategory(maxResults, categoryId)`

Gets popular videos from a specific category.

```typescript
async function getPopularByCategory() {
  try {
    // Some common categories:
    // 1 = Film & Animation
    // 2 = Autos & Vehicles
    // 10 = Music
    // 15 = Pets & Animals
    // 17 = Sports
    // 20 = Gaming
    // 22 = People & Blogs
    // 23 = Comedy
    // 24 = Entertainment
    // 25 = News & Politics
    // 26 = Howto & Style
    // 27 = Education
    // 28 = Science & Technology
    
    const music = await youTube.videos.getMostPopularByCategory(10, 10); // Music
    const gaming = await youTube.videos.getMostPopularByCategory(10, 20); // Gaming
    
    console.log('🎵 Popular in Music:');
    music.items?.forEach(v => console.log(`- ${v.snippet?.title}`));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getMostPopularByRegion(maxResults, regionCode)`

Gets popular videos by region.

```typescript
async function getPopularByRegion() {
  try {
    // ISO 3166-1 alpha-2 region codes
    const us = await youTube.videos.getMostPopularByRegion(10, 'US'); // United States
    const es = await youTube.videos.getMostPopularByRegion(10, 'ES'); // Spain
    const mx = await youTube.videos.getMostPopularByRegion(10, 'MX'); // Mexico
    const ar = await youTube.videos.getMostPopularByRegion(10, 'AR'); // Argentina
    
    console.log('🇺🇸 Popular in USA:', us.items?.map(v => v.snippet?.title));
    console.log('🇪🇸 Popular in Spain:', es.items?.map(v => v.snippet?.title));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Upload Videos (Requires OAuth)

### `videos.upload(videoResource, mediaBody, options)`

Uploads a video to your YouTube channel.

```typescript
async function uploadVideo() {
  try {
    const videoResource = {
      snippet: {
        title: 'My Test Video',
        description: 'This is a video uploaded using youtube-node',
        tags: ['nodejs', 'youtube', 'api'],
        categoryId: '27', // Education
        defaultLanguage: 'en',
      },
      status: {
        privacyStatus: 'private', // public, private, unlisted
        publishAt: '2024-12-25T00:00:00Z', // Schedule publication (optional)
      },
    };
    
    // Upload from file
    const result = await youTube.videos.upload(
      videoResource,
      '/path/to/video.mp4', // File path
      {
        part: ['snippet', 'status'],
        notifySubscribers: true, // Notify subscribers
      }
    );
    
    console.log('Video uploaded successfully!');
    console.log('ID:', result.items?.[0]?.id);
    console.log('URL:', `https://youtube.com/watch?v=${result.items?.[0]?.id}`);
  } catch (error) {
    console.error('Error uploading:', error.message);
  }
}
```

### Upload from Buffer

```typescript
import * as fs from 'fs';

async function uploadFromBuffer() {
  const videoBuffer = fs.readFileSync('/path/to/video.mp4');
  
  const result = await youTube.videos.upload(
    {
      snippet: {
        title: 'Video from Buffer',
        description: 'Uploaded from memory',
      },
      status: {
        privacyStatus: 'public',
      },
    },
    videoBuffer
  );
  
  console.log('Video uploaded:', result.items?.[0]?.id);
}
```

### Check Upload Status

```typescript
async function checkUploadStatus(videoId: string) {
  try {
    const status = await youTube.videos.checkUploadStatus(videoId);
    
    const processingStatus = status.items?.[0]?.processingDetails?.processingStatus;
    console.log('Processing status:', processingStatus);
    // "succeeded", "failed", "processing", "terminated"
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Update Videos (Requires OAuth)

### `videos.update(videoResource)`

Updates video metadata.

```typescript
async function updateVideo() {
  try {
    const videoResource = {
      id: 'VIDEO_ID',
      snippet: {
        title: 'New Title',
        description: 'New updated description',
        tags: ['new', 'tag', 'updated'],
        categoryId: '27',
      },
      status: {
        privacyStatus: 'public',
        license: 'creativeCommon', // creativeCommon or youtube
        embeddable: true,
      },
    };
    
    const result = await youTube.videos.update(videoResource);
    console.log('Video updated:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.updateStatus(videoId, status)`

Updates only the status/privacy of a video.

```typescript
async function updateVideoStatus() {
  try {
    // Change to public
    await youTube.videos.updateStatus('VIDEO_ID', 'public');
    
    // Change to private
    await youTube.videos.updateStatus('VIDEO_ID', 'private');
    
    // Change to unlisted
    await youTube.videos.updateStatus('VIDEO_ID', 'unlisted');
    
    console.log('Status updated');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Delete Videos (Requires OAuth)

### `videos.delete(videoId)`

Deletes a video from your channel.

```typescript
async function deleteVideo() {
  try {
    await youTube.videos.delete('VIDEO_ID');
    console.log('Video deleted successfully');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.deleteMany(videoIds)`

Deletes multiple videos at once.

```typescript
async function deleteMultipleVideos() {
  try {
    const videoIds = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3'];
    
    const results = await youTube.videos.deleteMany(videoIds);
    console.log(`${results.length} videos deleted`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Rate Videos (Requires OAuth)

### `videos.rate(videoId, rating)`

Gives like, dislike or removes the rating from a video.

```typescript
async function rateVideo() {
  try {
    // Give like
    await youTube.videos.rate('VIDEO_ID', 'like');
    
    // Give dislike
    await youTube.videos.rate('VIDEO_ID', 'dislike');
    
    // Remove rating
    await youTube.videos.rate('VIDEO_ID', 'none');
    
    console.log('Rating updated');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getRating(videoIds)`

Gets the rating you have given to videos.

```typescript
async function getMyRatings() {
  try {
    // Single video
    const rating = await youTube.videos.getRating('VIDEO_ID');
    
    // Multiple videos
    const ratings = await youTube.videos.getRating(['VIDEO_ID_1', 'VIDEO_ID_2']);
    
    ratings.items?.forEach((item) => {
      console.log(`Video ${item.videoId}: ${item.rating}`);
      // rating can be: "like", "dislike", "none"
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Response Information

### Video Structure

```typescript
interface VideoItem {
  kind: 'youtube#video';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    tags?: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage?: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 format
    dimension: string; // "2d" or "3d"
    definition: string; // "hd" or "sd"
    caption: string; // "true" or "false"
    licensedContent: boolean;
    regionRestriction?: {
      allowed?: string[];
      blocked?: string[];
    };
  };
  status: {
    uploadStatus: string;
    failureReason?: string;
    rejectionReason?: string;
    privacyStatus: string;
    publishAt?: string;
    license: string;
    embeddable: boolean;
    publicStatsViewable: boolean;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}
```

## Complete Examples

### Download Complete Video Information

```typescript
async function getFullVideoInfo(videoId: string) {
  try {
    const video = await youTube.videos.getById(videoId);
    
    if (!video.items || video.items.length === 0) {
      console.log('Video not found');
      return;
    }
    
    const item = video.items[0];
    
    return {
      id: item.id,
      title: item.snippet?.title,
      description: item.snippet?.description,
      publishedAt: item.snippet?.publishedAt,
      channel: {
        id: item.snippet?.channelId,
        title: item.snippet?.channelTitle,
      },
      thumbnails: item.snippet?.thumbnails,
      duration: item.contentDetails?.duration,
      quality: item.contentDetails?.definition,
      views: parseInt(item.statistics?.viewCount || '0'),
      likes: parseInt(item.statistics?.likeCount || '0'),
      comments: parseInt(item.statistics?.commentCount || '0'),
      tags: item.snippet?.tags || [],
      privacy: item.status?.privacyStatus,
      embeddable: item.status?.embeddable,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

### Search and Analyze Popular Videos

```typescript
async function analyzePopularVideos(categoryId: number, limit: number = 10) {
  try {
    const popular = await youTube.videos.getMostPopularByCategory(limit, categoryId);
    
    const analysis = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      videos: [] as any[],
    };
    
    popular.items?.forEach((video) => {
      const views = parseInt(video.statistics?.viewCount || '0');
      const likes = parseInt(video.statistics?.likeCount || '0');
      const comments = parseInt(video.statistics?.commentCount || '0');
      
      analysis.totalViews += views;
      analysis.totalLikes += likes;
      analysis.totalComments += comments;
      
      analysis.videos.push({
        title: video.snippet?.title,
        channel: video.snippet?.channelTitle,
        views,
        likes,
        comments,
        engagementRate: ((likes + comments) / views * 100).toFixed(2) + '%',
      });
    });
    
    return analysis;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

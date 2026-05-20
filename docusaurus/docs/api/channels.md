---
sidebar_position: 2
---

# Channels

Everything about working with YouTube channels using `youtube-node`.

## Get Channel Information

### `channels.getById(id)`

Gets channel information by channel ID.

```typescript
async function getChannelInfo() {
  try {
    const channel = await youTube.channels.getById('CHANNEL_ID');
    
    if (channel.items && channel.items.length > 0) {
      const item = channel.items[0];
      
      console.log('=== CHANNEL INFORMATION ===');
      console.log('Title:', item.snippet?.title);
      console.log('Description:', item.snippet?.description);
      console.log('Country:', item.snippet?.country);
      console.log('Created:', item.snippet?.publishedAt);
      
      console.log('\n=== STATISTICS ===');
      console.log('Subscribers:', item.statistics?.subscriberCount);
      console.log('Videos:', item.statistics?.videoCount);
      console.log('Views:', item.statistics?.viewCount);
      
      console.log('\n=== BRANDING ===');
      console.log('Profile Color:', item.brandingSettings?.channel?.profileColor);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `channels.getByUsername(username)`

Gets channel by username or handle.

```typescript
async function getChannelByUsername() {
  try {
    // By legacy username
    const byUsername = await youTube.channels.getByUsername('GoogleDevelopers');
    
    // By handle (@name)
    const byHandle = await youTube.channels.getByUsername('@YouTube');
    
    console.log('Channel:', byUsername.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Channel Sections

### `channels.getSections(channelId)`

Gets channel sections (tabs like Videos, Playlists, etc.).

```typescript
async function getChannelSections() {
  try {
    const sections = await youTube.channels.getSections('CHANNEL_ID');
    
    sections.items?.forEach((section) => {
      console.log('Type:', section.snippet?.type);
      console.log('Title:', section.snippet?.title);
      console.log('Position:', section.snippet?.position);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Channel Subscriptions

### `subscriptions.getByChannel(channelId, maxResults)`

Gets subscriptions of a channel.

```typescript
async function getChannelSubscriptions() {
  try {
    const subscriptions = await youTube.subscriptions.getByChannel(
      'CHANNEL_ID',
      50
    );
    
    console.log(`Found ${subscriptions.pageInfo?.totalResults} subscriptions`);
    
    subscriptions.items?.forEach((sub) => {
      console.log('Channel:', sub.snippet?.title);
      console.log('Since:', sub.snippet?.publishedAt);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Complete Examples

### Get Channel Analytics

```typescript
async function getChannelAnalytics(channelId: string) {
  try {
    const channel = await youTube.channels.getById(channelId);
    
    if (!channel.items || channel.items.length === 0) {
      return null;
    }
    
    const item = channel.items[0];
    const stats = item.statistics;
    
    return {
      title: item.snippet?.title,
      description: item.snippet?.description,
      created: item.snippet?.publishedAt,
      country: item.snippet?.country,
      statistics: {
        subscribers: parseInt(stats?.subscriberCount || '0'),
        videos: parseInt(stats?.videoCount || '0'),
        views: parseInt(stats?.viewCount || '0'),
        hiddenSubscribers: stats?.hiddenSubscriberCount,
      },
      thumbnails: item.snippet?.thumbnails,
      branding: item.brandingSettings?.channel,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

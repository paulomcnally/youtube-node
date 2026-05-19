---
sidebar_position: 8
---

# Actividades

Obtén las actividades recientes de un canal.

## Listar Actividades

### `activities.list(options)`

Obtiene las actividades recientes de un canal o suscripción.

```typescript
async function listActivities() {
  try {
    // Actividades de un canal específico
    const channelActivities = await youTube.activities.list({
      channelId: 'CHANNEL_ID',
      maxResults: 50,
    });
    
    // Actividades de mi feed de suscripciones (requiere OAuth)
    const homeActivities = await youTube.activities.list({
      home: true,
      maxResults: 50,
    });
    
    // Mis actividades (requiere OAuth)
    const myActivities = await youTube.activities.list({
      mine: true,
      maxResults: 50,
    });
    
    console.log(`Encontradas ${channelActivities.items?.length} actividades`);
    
    channelActivities.items?.forEach((activity, index) => {
      console.log(`\n=== ACTIVIDAD ${index + 1} ===`);
      console.log('Tipo:', activity.snippet?.type);
      // Tipos: channelItem, comment, favorite, like, playlistItem, 
      // recommendation, social, subscription, upload
      
      console.log('Título:', activity.snippet?.title);
      console.log('Descripción:', activity.snippet?.description);
      console.log('Canal:', activity.snippet?.channelTitle);
      console.log('Fecha:', activity.snippet?.publishedAt);
      
      // Detalles según el tipo
      switch (activity.contentDetails?.upload) {
        case 'upload':
          if (activity.contentDetails?.upload?.videoId) {
            console.log('Video subido:', activity.contentDetails.upload.videoId);
          }
          break;
        case 'like':
          if (activity.contentDetails?.like?.resourceId?.videoId) {
            console.log('Video likeado:', activity.contentDetails.like.resourceId.videoId);
          }
          break;
        case 'playlistItem':
          if (activity.contentDetails?.playlistItem) {
            console.log('Añadido a playlist:', activity.contentDetails.playlistItem.playlistId);
          }
          break;
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filtrar por Región

```typescript
async function getActivitiesByRegion() {
  try {
    const activities = await youTube.activities.list({
      channelId: 'CHANNEL_ID',
      regionCode: 'ES', // España
      maxResults: 25,
    });
    
    console.log(`Actividades en España: ${activities.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de una Actividad

```typescript
interface Activity {
  kind: 'youtube#activity';
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
    type: 'channelItem' | 'comment' | 'favorite' | 'like' | 'playlistItem' | 'recommendation' | 'social' | 'subscription' | 'upload';
    groupId?: string;
  };
  contentDetails: {
    upload?: {
      videoId: string;
    };
    like?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    favorite?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    comment?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
      playlistId: string;
      playlistItemId: string;
    };
    subscription?: {
      resourceId: {
        kind: string;
        channelId: string;
      };
    };
    playlistItem?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
      playlistId: string;
      playlistItemId: string;
    };
    recommendation?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
      reason: string;
      seedResourceId?: {
        kind: string;
        videoId?: string;
        playlistId?: string;
        channelId?: string;
      };
    };
    social?: {
      type: string;
      resourceId: {
        kind: string;
        videoId?: string;
        channelId?: string;
        playlistId?: string;
      };
      author: string;
      referenceUrl: string;
      imageUrl: string;
    };
    channelItem?: {
      resourceId: {
        kind: string;
        videoId?: string;
      };
    };
  };
}
```

## Ejemplos Completos

### Feed de Actividades de Canal

```typescript
async function getChannelFeed(channelId: string) {
  try {
    const activities = await youTube.activities.list({
      channelId,
      maxResults: 50,
    });
    
    const feed = {
      uploads: [] as any[],
      likes: [] as any[],
      playlistAdditions: [] as any[],
      subscriptions: [] as any[],
    };
    
    activities.items?.forEach((activity) => {
      const baseInfo = {
        id: activity.id,
        publishedAt: activity.snippet?.publishedAt,
        title: activity.snippet?.title,
        description: activity.snippet?.description,
        thumbnail: activity.snippet?.thumbnails?.high?.url,
      };
      
      switch (activity.snippet?.type) {
        case 'upload':
          feed.uploads.push({
            ...baseInfo,
            videoId: activity.contentDetails?.upload?.videoId,
            url: `https://youtube.com/watch?v=${activity.contentDetails?.upload?.videoId}`,
          });
          break;
          
        case 'like':
          feed.likes.push({
            ...baseInfo,
            videoId: activity.contentDetails?.like?.resourceId?.videoId,
            url: `https://youtube.com/watch?v=${activity.contentDetails?.like?.resourceId?.videoId}`,
          });
          break;
          
        case 'playlistItem':
          feed.playlistAdditions.push({
            ...baseInfo,
            videoId: activity.contentDetails?.playlistItem?.resourceId?.videoId,
            playlistId: activity.contentDetails?.playlistItem?.playlistId,
            url: `https://youtube.com/watch?v=${activity.contentDetails?.playlistItem?.resourceId?.videoId}`,
          });
          break;
          
        case 'subscription':
          feed.subscriptions.push({
            ...baseInfo,
            channelId: activity.contentDetails?.subscription?.resourceId?.channelId,
            url: `https://youtube.com/channel/${activity.contentDetails?.subscription?.resourceId?.channelId}`,
          });
          break;
      }
    });
    
    return feed;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Uso
const feed = await getChannelFeed('CHANNEL_ID');
console.log('Últimos uploads:', feed?.uploads.slice(0, 5));
```

### Timeline de Actividad

```typescript
async function getActivityTimeline(channelId: string, days: number = 30) {
  try {
    const activities = await youTube.activities.list({
      channelId,
      maxResults: 50,
    });
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const timeline = activities.items
      ?.filter(item => new Date(item.snippet?.publishedAt || '') >= cutoffDate)
      .map(item => ({
        date: item.snippet?.publishedAt,
        type: item.snippet?.type,
        title: item.snippet?.title,
        channel: item.snippet?.channelTitle,
      }))
      .reduce((acc, item) => {
        const date = item.date?.split('T')[0];
        if (!acc[date!]) acc[date!] = [];
        acc[date!].push(item);
        return acc;
      }, {} as Record<string, any[]>);
    
    return timeline;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

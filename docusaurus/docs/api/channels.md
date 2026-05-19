---
sidebar_position: 2
---

# Canales

Todo sobre cómo trabajar con canales de YouTube.

## Obtener Información de un Canal

### `channels.getById(id)`

Obtiene información detallada de un canal por su ID.

```typescript
async function getChannelInfo() {
  try {
    const channel = await youTube.channels.getById('CHANNEL_ID_AQUI');
    
    if (channel.items && channel.items.length > 0) {
      const item = channel.items[0];
      
      console.log('=== INFORMACIÓN DEL CANAL ===');
      console.log('Nombre:', item.snippet?.title);
      console.log('Descripción:', item.snippet?.description);
      console.log('País:', item.snippet?.country);
      console.log('Creado:', item.snippet?.publishedAt);
      
      console.log('\n=== ESTADÍSTICAS ===');
      console.log('Suscriptores:', item.statistics?.subscriberCount);
      console.log('Videos:', item.statistics?.videoCount);
      console.log('Vistas totales:', item.statistics?.viewCount);
      
      console.log('\n=== IMAGENES ===');
      console.log('Avatar:', item.snippet?.thumbnails?.default?.url);
      console.log('Banner:', item.brandingSettings?.image?.bannerExternalUrl);
      
      console.log('\n=== CONFIGURACIÓN ===');
      console.log('Keywords:', item.brandingSettings?.channel?.keywords);
      console.log('Mostrar suscriptores:', item.brandingSettings?.channel?.showRelatedChannels);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `channels.getByUsername(username)`

Obtiene un canal por nombre de usuario o handle (incluyendo el @).

```typescript
async function getChannelByUsername() {
  try {
    // Por nombre de usuario antiguo
    const channel = await youTube.channels.getByUsername('GoogleDevelopers');
    
    // Por handle moderno (con @)
    const byHandle = await youTube.channels.getByUsername('@YouTube');
    const byHandle2 = await youTube.channels.getByUsername('@MrBeast');
    
    console.log('Canal encontrado:', channel.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `channels.getMyChannel()`

Obtiene información del canal autenticado (requiere OAuth).

```typescript
async function getMyChannel() {
  try {
    const myChannel = await youTube.channels.getMyChannel();
    
    if (myChannel.items && myChannel.items.length > 0) {
      const channel = myChannel.items[0];
      
      console.log('Tu canal:', channel.snippet?.title);
      console.log('Suscriptores:', channel.statistics?.subscriberCount);
      console.log('Videos subidos:', channel.statistics?.videoCount);
      console.log('ID:', channel.id);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Actualizar Canal (Requiere OAuth)

### `channels.update(channelResource)`

Actualiza la información del canal.

```typescript
async function updateChannel() {
  try {
    const channelResource = {
      id: 'CHANNEL_ID',
      snippet: {
        title: 'Nuevo Nombre del Canal',
        description: 'Nueva descripción del canal',
        defaultLanguage: 'es',
      },
      brandingSettings: {
        channel: {
          keywords: 'tecnología, programación, nodejs',
          showRelatedChannels: true,
          showBrowseView: true,
          featuredChannelsTitle: 'Canales Destacados',
          featuredChannelsUrls: [
            'CHANNEL_ID_1',
            'CHANNEL_ID_2',
          ],
        },
      },
    };
    
    const result = await youTube.channels.update(channelResource);
    console.log('Canal actualizado:', result.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Banner del Canal (Requiere OAuth)

### `channels.uploadBanner(imageData)`

Sube una imagen de banner para el canal.

```typescript
import * as fs from 'fs';

async function uploadBanner() {
  try {
    // Desde archivo
    const result = await youTube.channels.uploadBanner('/ruta/al/banner.jpg');
    console.log('Banner subido:', result.url);
    
    // Desde Buffer
    const imageBuffer = fs.readFileSync('/ruta/al/banner.jpg');
    const result2 = await youTube.channels.uploadBanner(imageBuffer);
    
    return result.url; // URL para usar en updateBanner
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `channels.updateBanner(channelId, bannerUrl)`

Actualiza el banner del canal usando la URL obtenida.

```typescript
async function setChannelBanner(channelId: string, bannerPath: string) {
  try {
    // Primero subimos la imagen
    const uploadResult = await youTube.channels.uploadBanner(bannerPath);
    
    // Luego actualizamos el canal con la URL del banner
    const result = await youTube.channels.updateBanner(
      channelId,
      uploadResult.url
    );
    
    console.log('Banner actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Secciones del Canal

### `channelSections.list(channelId)`

Obtiene las secciones (shelves) de un canal.

```typescript
async function getChannelSections() {
  try {
    const sections = await youTube.channelSections.list('CHANNEL_ID');
    
    sections.items?.forEach((section, index) => {
      console.log(`\n=== SECCIÓN ${index + 1} ===`);
      console.log('Tipo:', section.snippet?.type);
      // Tipos: allPlaylists, completedEvents, featuredChannels, 
      // likedPlaylists, likes, liveEvents, multipleChannels, 
      // multiplePlaylists, popularUploads, recentActivity, 
      // recentPosts, recentUploads, singlePlaylist, subscriptions
      
      console.log('Posición:', section.snippet?.position);
      console.log('Título:', section.snippet?.title);
      
      if (section.contentDetails?.playlists) {
        console.log('Playlists:', section.contentDetails.playlists);
      }
      
      if (section.contentDetails?.channels) {
        console.log('Canales:', section.contentDetails.channels);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Crear Sección (Requiere OAuth)

```typescript
async function createChannelSection() {
  try {
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist', // o 'multiplePlaylists', 'featuredChannels', etc.
        style: 'horizontalRow', // o 'verticalList'
        title: 'Mis Playlists Favoritas',
        position: 0,
      },
      contentDetails: {
        playlists: ['PLAYLIST_ID_1', 'PLAYLIST_ID_2'],
      },
    };
    
    const result = await youTube.channelSections.create(sectionResource);
    console.log('Sección creada:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Actualizar Sección (Requiere OAuth)

```typescript
async function updateChannelSection() {
  try {
    const sectionResource = {
      id: 'SECTION_ID',
      snippet: {
        type: 'singlePlaylist',
        title: 'Título Actualizado',
        position: 1,
      },
      contentDetails: {
        playlists: ['NEW_PLAYLIST_ID'],
      },
    };
    
    const result = await youTube.channelSections.update('SECTION_ID', sectionResource);
    console.log('Sección actualizada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Eliminar Sección (Requiere OAuth)

```typescript
async function deleteChannelSection() {
  try {
    await youTube.channelSections.delete('SECTION_ID');
    console.log('Sección eliminada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de un Canal

```typescript
interface ChannelItem {
  kind: 'youtube#channel';
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string; // URL personalizada
    publishedAt: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
    country?: string;
  };
  contentDetails: {
    relatedPlaylists: {
      likes?: string;
      favorites?: string;
      uploads: string;
      watchHistory?: string;
      watchLater?: string;
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
  brandingSettings: {
    channel: {
      title: string;
      description: string;
      keywords: string;
      defaultTab: string;
      trackingAnalyticsAccountId: string;
      moderateComments: boolean;
      showRelatedChannels: boolean;
      showBrowseView: boolean;
      featuredChannelsTitle: string;
      featuredChannelsUrls: string[];
      unsubscribedTrailer: string;
      profileColor: string;
    };
    watch: {
      textColor: string;
      backgroundColor: string;
      featuredPlaylistId: string;
    };
    image?: {
      bannerExternalUrl: string;
    };
  };
}
```

## Ejemplos Completos

### Analizar un Canal

```typescript
async function analyzeChannel(channelId: string) {
  try {
    const channel = await youTube.channels.getById(channelId);
    
    if (!channel.items || channel.items.length === 0) {
      return null;
    }
    
    const item = channel.items[0];
    const stats = item.statistics;
    
    const analysis = {
      id: item.id,
      name: item.snippet?.title,
      description: item.snippet?.description,
      createdAt: item.snippet?.publishedAt,
      thumbnails: item.snippet?.thumbnails,
      statistics: {
        subscribers: parseInt(stats?.subscriberCount || '0'),
        videos: parseInt(stats?.videoCount || '0'),
        views: parseInt(stats?.viewCount || '0'),
        hiddenSubscribers: stats?.hiddenSubscriberCount,
      },
      averageViewsPerVideo: parseInt(stats?.videoCount || '0') > 0
        ? Math.round(parseInt(stats?.viewCount || '0') / parseInt(stats?.videoCount || '0'))
        : 0,
      branding: {
        keywords: item.brandingSettings?.channel?.keywords?.split(', ') || [],
        hasBanner: !!item.brandingSettings?.image?.bannerExternalUrl,
        country: item.snippet?.country,
        language: item.snippet?.defaultLanguage,
      },
      urls: {
        custom: item.snippet?.customUrl 
          ? `https://youtube.com/${item.snippet.customUrl}`
          : null,
        standard: `https://youtube.com/channel/${item.id}`,
        uploads: `https://youtube.com/playlist?list=${item.contentDetails?.relatedPlaylists?.uploads}`,
      },
    };
    
    return analysis;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

### Comparar Múltiples Canales

```typescript
async function compareChannels(channelIds: string[]) {
  try {
    const channels = await Promise.all(
      channelIds.map(id => youTube.channels.getById(id))
    );
    
    const comparison = channels
      .filter(c => c.items && c.items.length > 0)
      .map(c => {
        const item = c.items![0];
        return {
          name: item.snippet?.title,
          subscribers: parseInt(item.statistics?.subscriberCount || '0'),
          videos: parseInt(item.statistics?.videoCount || '0'),
          views: parseInt(item.statistics?.viewCount || '0'),
        };
      })
      .sort((a, b) => b.subscribers - a.subscribers);
    
    console.log('=== COMPARACIÓN DE CANALES ===');
    comparison.forEach((channel, index) => {
      console.log(`${index + 1}. ${channel.name}`);
      console.log(`   👥 ${channel.subscribers.toLocaleString()} suscriptores`);
      console.log(`   🎬 ${channel.videos.toLocaleString()} videos`);
      console.log(`   👀 ${channel.views.toLocaleString()} vistas`);
      console.log('---');
    });
    
    return comparison;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
```

### Obtener Videos de un Canal

```typescript
async function getChannelVideos(channelId: string, maxResults: number = 50) {
  try {
    // Primero obtenemos el canal para saber el ID de uploads
    const channel = await youTube.channels.getById(channelId);
    
    if (!channel.items || channel.items.length === 0) {
      return [];
    }
    
    const uploadsPlaylistId = channel.items[0].contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) {
      console.log('No se encontró playlist de uploads');
      return [];
    }
    
    // Obtenemos los videos de la playlist de uploads
    const videos = await youTube.playlists.getItemsById(uploadsPlaylistId, maxResults);
    
    return videos.items?.map(item => ({
      id: item.contentDetails?.videoId,
      title: item.snippet?.title,
      publishedAt: item.contentDetails?.videoPublishedAt,
      thumbnail: item.snippet?.thumbnails?.default?.url,
    })) || [];
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
```

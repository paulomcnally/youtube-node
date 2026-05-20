---
sidebar_position: 4
---

# Playlists

Todo sobre cómo trabajar con playlists de YouTube.

## Obtener Información de una Playlist

### `playlists.getById(id)`

Obtiene información detallada de una playlist.

```typescript
async function getPlaylistInfo() {
  try {
    const playlist = await youTube.playlists.getById('PLAYLIST_ID');
    
    if (playlist.items && playlist.items.length > 0) {
      const item = playlist.items[0];
      
      console.log('=== INFORMACIÓN DE LA PLAYLIST ===');
      console.log('Título:', item.snippet?.title);
      console.log('Descripción:', item.snippet?.description);
      console.log('Canal:', item.snippet?.channelTitle);
      console.log('Creada:', item.snippet?.publishedAt);
      
      console.log('\n=== ESTADÍSTICAS ===');
      console.log('Número de videos:', item.contentDetails?.itemCount);
      
      console.log('\n=== PRIVACIDAD ===');
      console.log('Estado:', item.status?.privacyStatus); // public, private, unlisted
      
      console.log('\n=== EMBED ===');
      console.log('Player:', item.player?.embedHtml);
      
      console.log('\n=== IDIOMAS ===');
      console.log('Idioma:', item.snippet?.defaultLanguage);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `playlists.getItemsById(id, maxResults?)`

Obtiene los videos de una playlist.

```typescript
async function getPlaylistItems() {
  try {
    // Obtener items (por defecto 5, máximo 50)
    const items = await youTube.playlists.getItemsById('PLAYLIST_ID', 50);
    
    console.log(`La playlist tiene ${items.items?.length} videos:`);
    
    items.items?.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.snippet?.title}`);
      console.log(`   ID del video: ${item.contentDetails?.videoId}`);
      console.log(`   Añadido: ${item.snippet?.publishedAt}`);
      console.log(`   Posición: ${item.snippet?.position}`);
      console.log(`   Publicado: ${item.contentDetails?.videoPublishedAt}`);
      console.log(`   URL: https://youtube.com/watch?v=${item.contentDetails?.videoId}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Playlists por Canal

### `playlists.getByChannel(channelId, options?)`

Obtiene todas las playlists de un canal.

```typescript
async function getChannelPlaylists() {
  try {
    const playlists = await youTube.playlists.getByChannel('CHANNEL_ID', {
      maxResults: 50,
    });
    
    console.log(`El canal tiene ${playlists.items?.length} playlists:`);
    
    playlists.items?.forEach((playlist, index) => {
      console.log(`\n${index + 1}. ${playlist.snippet?.title}`);
      console.log(`   ID: ${playlist.id}`);
      console.log(`   Videos: ${playlist.contentDetails?.itemCount}`);
      console.log(`   Privacidad: ${playlist.status?.privacyStatus}`);
    });
    
    // Paginación
    if (playlists.nextPageToken) {
      const morePlaylists = await youTube.playlists.getByChannel('CHANNEL_ID', {
        maxResults: 50,
        pageToken: playlists.nextPageToken,
      });
      console.log(`\n+ ${morePlaylists.items?.length} playlists más`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Crear Playlist (Requiere OAuth)

### `playlists.insert(title, options?)`

Crea una nueva playlist.

```typescript
async function createPlaylist() {
  try {
    const result = await youTube.playlists.insert('Mi Nueva Playlist', {
      description: 'Una descripción para mi playlist',
      privacyStatus: 'private', // 'public', 'private', 'unlisted'
      tags: ['nodejs', 'javascript', 'programming'],
      defaultLanguage: 'es',
    });
    
    console.log('Playlist creada exitosamente!');
    console.log('ID:', result.items?.[0]?.id);
    console.log('URL:', `https://youtube.com/playlist?list=${result.items?.[0]?.id}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Actualizar Playlist (Requiere OAuth)

### `playlists.update(playlistId, options)`

Actualiza los metadatos de una playlist.

```typescript
async function updatePlaylist() {
  try {
    const result = await youTube.playlists.update('PLAYLIST_ID', {
      title: 'Título Actualizado',
      description: 'Nueva descripción de la playlist',
      privacyStatus: 'public',
      tags: ['updated', 'new', 'tags'],
    });
    
    console.log('Playlist actualizada:', result.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Eliminar Playlist (Requiere OAuth)

### `playlists.delete(playlistId)`

Elimina una playlist.

```typescript
async function deletePlaylist() {
  try {
    await youTube.playlists.delete('PLAYLIST_ID');
    console.log('Playlist eliminada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Gestionar Items de Playlist (Requiere OAuth)

### `playlistItems.insert(playlistId, videoId, options?)`

Añade un video a una playlist.

```typescript
async function addVideoToPlaylist() {
  try {
    const result = await youTube.playlistItems.insert(
      'PLAYLIST_ID',
      'VIDEO_ID',
      {
        position: 0, // Posición en la playlist (0 = primero)
        note: 'Una nota personalizada para este video',
      }
    );
    
    console.log('Video añadido a la playlist');
    console.log('ID del item:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `playlistItems.update(itemId, playlistId, videoId, position?)`

Actualiza la posición de un video en la playlist.

```typescript
async function updatePlaylistItem() {
  try {
    const result = await youTube.playlistItems.update(
      'ITEM_ID',
      'PLAYLIST_ID',
      'VIDEO_ID',
      5 // Nueva posición
    );
    
    console.log('Posición actualizada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `playlistItems.delete(itemId)`

Elimina un video de una playlist.

```typescript
async function removeVideoFromPlaylist() {
  try {
    await youTube.playlistItems.delete('ITEM_ID');
    console.log('Video eliminado de la playlist');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de una Playlist

```typescript
interface PlaylistItem {
  kind: 'youtube#playlist';
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
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
  };
  status: {
    privacyStatus: string; // public, private, unlisted
  };
  contentDetails: {
    itemCount: number;
  };
  player: {
    embedHtml: string;
  };
}
```

### Estructura de un Item de Playlist

```typescript
interface PlaylistVideoItem {
  kind: 'youtube#playlistItem';
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
    };
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: 'youtube#video';
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
    note?: string;
  };
  status: {
    privacyStatus: string;
  };
}
```

## Ejemplos Completos

### Crear Playlist con Videos

```typescript
async function createPlaylistWithVideos(
  title: string,
  videoIds: string[],
  options: {
    description?: string;
    privacyStatus?: 'public' | 'private' | 'unlisted';
  } = {}
) {
  try {
    // Crear la playlist
    const playlist = await youTube.playlists.insert(title, {
      description: options.description,
      privacyStatus: options.privacyStatus || 'private',
    });
    
    const playlistId = playlist.items?.[0]?.id;
    
    if (!playlistId) {
      throw new Error('No se pudo crear la playlist');
    }
    
    // Añadir videos
    const addedVideos: string[] = [];
    for (const videoId of videoIds) {
      try {
        await youTube.playlistItems.insert(playlistId, videoId);
        addedVideos.push(videoId);
      } catch (err) {
        console.error(`Error al añadir video ${videoId}:`, err.message);
      }
    }
    
    return {
      playlistId,
      title,
      url: `https://youtube.com/playlist?list=${playlistId}`,
      totalVideos: videoIds.length,
      addedVideos: addedVideos.length,
      failedVideos: videoIds.length - addedVideos.length,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Uso
const result = await createPlaylistWithVideos(
  'Mis Videos Favoritos',
  ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3'],
  {
    description: 'Una colección de mis videos favoritos',
    privacyStatus: 'public',
  }
);
```

### Clonar una Playlist

```typescript
async function clonePlaylist(
  sourcePlaylistId: string,
  newTitle: string,
  options: {
    description?: string;
    privacyStatus?: 'public' | 'private' | 'unlisted';
  } = {}
) {
  try {
    // Obtener información de la playlist original
    const source = await youTube.playlists.getById(sourcePlaylistId);
    const sourceInfo = source.items?.[0];
    
    if (!sourceInfo) {
      throw new Error('Playlist no encontrada');
    }
    
    // Crear nueva playlist
    const newPlaylist = await youTube.playlists.insert(newTitle, {
      description: options.description || `Clon de: ${sourceInfo.snippet?.title}`,
      privacyStatus: options.privacyStatus || 'private',
    });
    
    const newPlaylistId = newPlaylist.items?.[0]?.id;
    
    if (!newPlaylistId) {
      throw new Error('No se pudo crear la playlist');
    }
    
    // Obtener videos de la playlist original
    const items = await youTube.playlists.getItemsById(sourcePlaylistId, 50);
    
    // Añadir videos a la nueva playlist
    let addedCount = 0;
    for (const item of items.items || []) {
      const videoId = item.contentDetails?.videoId;
      if (videoId) {
        try {
          await youTube.playlistItems.insert(newPlaylistId, videoId);
          addedCount++;
        } catch (err) {
          console.error(`Error al copiar video ${videoId}:`, err.message);
        }
      }
    }
    
    return {
      success: true,
      newPlaylistId,
      title: newTitle,
      url: `https://youtube.com/playlist?list=${newPlaylistId}`,
      originalVideos: items.items?.length,
      clonedVideos: addedCount,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, error: error.message };
  }
}
```

### Analizar Playlist

```typescript
async function analyzePlaylist(playlistId: string) {
  try {
    // Obtener información de la playlist
    const playlist = await youTube.playlists.getById(playlistId);
    const playlistInfo = playlist.items?.[0];
    
    // Obtener items
    const items = await youTube.playlists.getItemsById(playlistId, 50);
    
    // Obtener detalles de cada video
    const videoIds = items.items
      ?.map(item => item.contentDetails?.videoId)
      .filter((id): id is string => !!id);
    
    let totalDuration = 0;
    let totalViews = 0;
    const videos: any[] = [];
    
    if (videoIds && videoIds.length > 0) {
      const videoDetails = await youTube.videos.getByIds(videoIds);
      
      videoDetails.items?.forEach((video) => {
        // Parsear duración ISO 8601 (ej: PT5M30S)
        const duration = video.contentDetails?.duration || 'PT0S';
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(match?.[1] || '0');
        const minutes = parseInt(match?.[2] || '0');
        const seconds = parseInt(match?.[3] || '0');
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        totalDuration += totalSeconds;
        totalViews += parseInt(video.statistics?.viewCount || '0');
        
        videos.push({
          id: video.id,
          title: video.snippet?.title,
          duration: { hours, minutes, seconds },
          views: parseInt(video.statistics?.viewCount || '0'),
          thumbnail: video.snippet?.thumbnails?.high?.url,
        });
      });
    }
    
    // Calcular estadísticas
    const avgDuration = Math.round(totalDuration / (videos.length || 1));
    const avgViews = Math.round(totalViews / (videos.length || 1));
    
    return {
      id: playlistId,
      title: playlistInfo?.snippet?.title,
      description: playlistInfo?.snippet?.description,
      totalVideos: videos.length,
      totalDuration: {
        hours: Math.floor(totalDuration / 3600),
        minutes: Math.floor((totalDuration % 3600) / 60),
        seconds: totalDuration % 60,
      },
      averageDuration: {
        hours: Math.floor(avgDuration / 3600),
        minutes: Math.floor((avgDuration % 3600) / 60),
        seconds: avgDuration % 60,
      },
      totalViews,
      averageViews: avgViews,
      privacy: playlistInfo?.status?.privacyStatus,
      url: `https://youtube.com/playlist?list=${playlistId}`,
      videos: videos.sort((a, b) => b.views - a.views), // Ordenado por vistas
    };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
```

---
sidebar_position: 1
---

# Videos

Todo sobre cómo trabajar con videos usando `youtube-node`.

## Obtener Información de un Video

### `videos.getById(id)`

Obtiene información detallada de un video por su ID.

```typescript
async function getVideoInfo() {
  try {
    const video = await youTube.videos.getById('VIDEO_ID_AQUI');
    
    if (video.items && video.items.length > 0) {
      const item = video.items[0];
      
      console.log('=== INFORMACIÓN DEL VIDEO ===');
      console.log('Título:', item.snippet?.title);
      console.log('Descripción:', item.snippet?.description);
      console.log('Canal:', item.snippet?.channelTitle);
      console.log('Publicado:', item.snippet?.publishedAt);
      
      console.log('\n=== ESTADÍSTICAS ===');
      console.log('Vistas:', item.statistics?.viewCount);
      console.log('Likes:', item.statistics?.likeCount);
      console.log('Comentarios:', item.statistics?.commentCount);
      
      console.log('\n=== DETALLES ===');
      console.log('Duración:', item.contentDetails?.duration); // PT5M30S
      console.log('Calidad HD:', item.contentDetails?.definition); // hd/sd
      console.log('Dimensiones:', item.contentDetails?.dimension); // 2d/3d
      console.log('Subtítulos:', item.contentDetails?.caption); // true/false
      
      console.log('\n=== PRIVACIDAD ===');
      console.log('Estado:', item.status?.privacyStatus); // public/private/unlisted
      console.log('Subido:', item.status?.uploadStatus); // processed/uploading/failed
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getByIds(ids, options)`

Obtiene información de múltiples videos a la vez.

```typescript
async function getMultipleVideos() {
  try {
    // Array de IDs
    const videos = await youTube.videos.getByIds([
      'VIDEO_ID_1',
      'VIDEO_ID_2',
      'VIDEO_ID_3'
    ]);
    
    // Con partes personalizadas
    const videosWithStats = await youTube.videos.getByIds(
      ['VIDEO_ID_1', 'VIDEO_ID_2'],
      { parts: ['snippet', 'statistics', 'contentDetails'] }
    );
    
    console.log(`Obtenidos ${videos.items?.length} videos`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Videos Populares

### `videos.getMostPopular(maxResults)`

Obtiene los videos más populares globalmente.

```typescript
async function getPopularVideos() {
  try {
    const popular = await youTube.videos.getMostPopular(10);
    
    popular.items?.forEach((video, index) => {
      console.log(`${index + 1}. ${video.snippet?.title}`);
      console.log(`   Canal: ${video.snippet?.channelTitle}`);
      console.log(`   Vistas: ${video.statistics?.viewCount}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getMostPopularByCategory(maxResults, categoryId)`

Obtiene videos populares de una categoría específica.

```typescript
async function getPopularByCategory() {
  try {
    // Algunas categorías comunes:
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
    
    const music = await youTube.videos.getMostPopularByCategory(10, 10); // Música
    const gaming = await youTube.videos.getMostPopularByCategory(10, 20); // Gaming
    
    console.log('🎵 Populares en Música:');
    music.items?.forEach(v => console.log(`- ${v.snippet?.title}`));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getMostPopularByRegion(maxResults, regionCode)`

Obtiene videos populares por región.

```typescript
async function getPopularByRegion() {
  try {
    // Códigos de región ISO 3166-1 alpha-2
    const us = await youTube.videos.getMostPopularByRegion(10, 'US'); // Estados Unidos
    const es = await youTube.videos.getMostPopularByRegion(10, 'ES'); // España
    const mx = await youTube.videos.getMostPopularByRegion(10, 'MX'); // México
    const ar = await youTube.videos.getMostPopularByRegion(10, 'AR'); // Argentina
    
    console.log('🇺🇸 Populares en USA:', us.items?.map(v => v.snippet?.title));
    console.log('🇪🇸 Populares en España:', es.items?.map(v => v.snippet?.title));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Subir Videos (Requiere OAuth)

### `videos.upload(videoResource, mediaBody, options)`

Sube un video a tu canal de YouTube.

```typescript
async function uploadVideo() {
  try {
    const videoResource = {
      snippet: {
        title: 'Mi Video de Prueba',
        description: 'Este es un video subido usando youtube-node',
        tags: ['nodejs', 'youtube', 'api'],
        categoryId: '27', // Educación
        defaultLanguage: 'es',
      },
      status: {
        privacyStatus: 'private', // public, private, unlisted
        publishAt: '2024-12-25T00:00:00Z', // Programar publicación (opcional)
      },
    };
    
    // Subir desde archivo
    const result = await youTube.videos.upload(
      videoResource,
      '/ruta/al/video.mp4', // Ruta del archivo
      {
        part: ['snippet', 'status'],
        notifySubscribers: true, // Notificar a suscriptores
      }
    );
    
    console.log('Video subido exitosamente!');
    console.log('ID:', result.items?.[0]?.id);
    console.log('URL:', `https://youtube.com/watch?v=${result.items?.[0]?.id}`);
  } catch (error) {
    console.error('Error al subir:', error.message);
  }
}
```

### Subir desde Buffer

```typescript
import * as fs from 'fs';

async function uploadFromBuffer() {
  const videoBuffer = fs.readFileSync('/ruta/al/video.mp4');
  
  const result = await youTube.videos.upload(
    {
      snippet: {
        title: 'Video desde Buffer',
        description: 'Subido desde memoria',
      },
      status: {
        privacyStatus: 'public',
      },
    },
    videoBuffer
  );
  
  console.log('Video subido:', result.items?.[0]?.id);
}
```

### Verificar Estado de Subida

```typescript
async function checkUploadStatus(videoId: string) {
  try {
    const status = await youTube.videos.checkUploadStatus(videoId);
    
    const processingStatus = status.items?.[0]?.processingDetails?.processingStatus;
    console.log('Estado de procesamiento:', processingStatus);
    // "succeeded", "failed", "processing", "terminated"
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Actualizar Videos (Requiere OAuth)

### `videos.update(videoResource)`

Actualiza los metadatos de un video.

```typescript
async function updateVideo() {
  try {
    const videoResource = {
      id: 'VIDEO_ID',
      snippet: {
        title: 'Nuevo Título',
        description: 'Nueva descripción actualizada',
        tags: ['nuevo', 'tag', 'actualizado'],
        categoryId: '27',
      },
      status: {
        privacyStatus: 'public',
        license: 'creativeCommon', // creativeCommon o youtube
        embeddable: true,
      },
    };
    
    const result = await youTube.videos.update(videoResource);
    console.log('Video actualizado:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.updateStatus(videoId, status)`

Actualiza solo el estado/privacidad de un video.

```typescript
async function updateVideoStatus() {
  try {
    // Cambiar a público
    await youTube.videos.updateStatus('VIDEO_ID', 'public');
    
    // Cambiar a privado
    await youTube.videos.updateStatus('VIDEO_ID', 'private');
    
    // Cambiar a no listado
    await youTube.videos.updateStatus('VIDEO_ID', 'unlisted');
    
    console.log('Estado actualizado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Eliminar Videos (Requiere OAuth)

### `videos.delete(videoId)`

Elimina un video de tu canal.

```typescript
async function deleteVideo() {
  try {
    await youTube.videos.delete('VIDEO_ID');
    console.log('Video eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.deleteMany(videoIds)`

Elimina múltiples videos a la vez.

```typescript
async function deleteMultipleVideos() {
  try {
    const videoIds = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3'];
    
    const results = await youTube.videos.deleteMany(videoIds);
    console.log(`${results.length} videos eliminados`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Calificar Videos (Requiere OAuth)

### `videos.rate(videoId, rating)`

Da like, dislike o quita la calificación de un video.

```typescript
async function rateVideo() {
  try {
    // Dar like
    await youTube.videos.rate('VIDEO_ID', 'like');
    
    // Dar dislike
    await youTube.videos.rate('VIDEO_ID', 'dislike');
    
    // Quitar calificación
    await youTube.videos.rate('VIDEO_ID', 'none');
    
    console.log('Calificación actualizada');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### `videos.getRating(videoIds)`

Obtiene la calificación que has dado a videos.

```typescript
async function getMyRatings() {
  try {
    // Un solo video
    const rating = await youTube.videos.getRating('VIDEO_ID');
    
    // Múltiples videos
    const ratings = await youTube.videos.getRating(['VIDEO_ID_1', 'VIDEO_ID_2']);
    
    ratings.items?.forEach((item) => {
      console.log(`Video ${item.videoId}: ${item.rating}`);
      // rating puede ser: "like", "dislike", "none"
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de un Video

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

## Ejemplos Completos

### Descargar Información Completa de un Video

```typescript
async function getFullVideoInfo(videoId: string) {
  try {
    const video = await youTube.videos.getById(videoId);
    
    if (!video.items || video.items.length === 0) {
      console.log('Video no encontrado');
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

### Buscar y Analizar Videos Populares

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

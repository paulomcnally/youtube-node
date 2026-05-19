---
sidebar_position: 3
---

# Búsqueda

Aprende a buscar videos, canales y playlists en YouTube.

## Búsqueda Básica

### `search.query(query, maxResults, params?)`

Realiza una búsqueda en YouTube.

```typescript
async function searchVideos() {
  try {
    // Búsqueda simple
    const results = await youTube.search.query('nodejs tutorial', 10);
    
    console.log(`Encontrados ${results.pageInfo?.totalResults} resultados`);
    console.log(`Mostrando ${results.items?.length} en esta página`);
    
    results.items?.forEach((item) => {
      console.log('\n---');
      console.log('Tipo:', item.id?.kind); // youtube#video, youtube#channel, youtube#playlist
      
      if (item.id?.videoId) {
        console.log('🎬 Video:', item.snippet?.title);
        console.log('   ID:', item.id.videoId);
      } else if (item.id?.channelId) {
        console.log('📺 Canal:', item.snippet?.title);
        console.log('   ID:', item.id.channelId);
      } else if (item.id?.playlistId) {
        console.log('📋 Playlist:', item.snippet?.title);
        console.log('   ID:', item.id.playlistId);
      }
      
      console.log('Canal:', item.snippet?.channelTitle);
      console.log('Descripción:', item.snippet?.description);
      console.log('Publicado:', item.snippet?.publishedAt);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Filtros de Búsqueda

### Filtrar por Tipo

```typescript
async function searchWithFilters() {
  try {
    // Solo videos
    const videos = await youTube.search.query('javascript', 10, {
      type: 'video',
    });
    
    // Solo canales
    const channels = await youTube.search.query('google', 10, {
      type: 'channel',
    });
    
    // Solo playlists
    const playlists = await youTube.search.query('music', 10, {
      type: 'playlist',
    });
    
    console.log(`Videos: ${videos.items?.length}`);
    console.log(`Canales: ${channels.items?.length}`);
    console.log(`Playlists: ${playlists.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filtrar por Duración del Video

```typescript
async function searchByDuration() {
  try {
    // Videos cortos (menos de 4 minutos)
    const shorts = await youTube.search.query('funny cats', 10, {
      type: 'video',
      videoDuration: 'short',
    });
    
    // Videos medianos (4-20 minutos)
    const medium = await youTube.search.query('tutorial', 10, {
      type: 'video',
      videoDuration: 'medium',
    });
    
    // Videos largos (más de 20 minutos)
    const long = await youTube.search.query('documentary', 10, {
      type: 'video',
      videoDuration: 'long',
    });
    
    console.log('Cortos:', shorts.items?.length);
    console.log('Medianos:', medium.items?.length);
    console.log('Largos:', long.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filtrar por Calidad

```typescript
async function searchByQuality() {
  try {
    // Videos en HD
    const hd = await youTube.search.query('4k nature', 10, {
      type: 'video',
      videoDefinition: 'high', // 'high' o 'standard'
    });
    
    // Videos en 3D
    const threeD = await youTube.search.query('3d', 10, {
      type: 'video',
      videoDimension: '3d', // '2d' o '3d'
    });
    
    // Videos en vivo
    const live = await youTube.search.query('news', 10, {
      type: 'video',
      eventType: 'live', // 'live', 'completed', 'upcoming'
    });
    
    console.log('HD:', hd.items?.length);
    console.log('3D:', threeD.items?.length);
    console.log('En vivo:', live.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filtrar por Fecha

```typescript
async function searchByDate() {
  try {
    // Videos publicados después de una fecha
    const recent = await youTube.search.query('technology', 10, {
      type: 'video',
      publishedAfter: '2024-01-01T00:00:00Z',
    });
    
    // Videos publicados antes de una fecha
    const old = await youTube.search.query('music', 10, {
      type: 'video',
      publishedBefore: '2020-01-01T00:00:00Z',
    });
    
    // Rango de fechas
    const range = await youTube.search.query('gaming', 10, {
      type: 'video',
      publishedAfter: '2024-01-01T00:00:00Z',
      publishedBefore: '2024-12-31T23:59:59Z',
    });
    
    console.log('Recientes:', recent.items?.length);
    console.log('Antiguos:', old.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Ordenar Resultados

```typescript
async function searchWithOrder() {
  try {
    // Ordenar por fecha (más reciente primero)
    const byDate = await youTube.search.query('news', 10, {
      type: 'video',
      order: 'date',
    });
    
    // Ordenar por número de vistas
    const byViews = await youTube.search.query('viral', 10, {
      type: 'video',
      order: 'viewCount',
    });
    
    // Ordenar por calificación
    const byRating = await youTube.search.query('best', 10, {
      type: 'video',
      order: 'rating',
    });
    
    // Ordenar por título
    const byTitle = await youTube.search.query('music', 10, {
      type: 'video',
      order: 'title',
    });
    
    console.log('Por fecha:', byDate.items?.[0]?.snippet?.title);
    console.log('Por vistas:', byViews.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Filtros Combinados

```typescript
async function advancedSearch() {
  try {
    const results = await youTube.search.query('tutorial', 50, {
      type: 'video',
      videoDuration: 'medium',
      videoDefinition: 'high',
      order: 'viewCount',
      publishedAfter: '2024-01-01T00:00:00Z',
      regionCode: 'ES',
      relevanceLanguage: 'es',
    });
    
    console.log(`Encontrados ${results.items?.length} videos`);
    results.items?.forEach((item) => {
      console.log(`- ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Búsqueda en un Canal Específico

```typescript
async function searchInChannel() {
  try {
    const results = await youTube.search.query('javascript', 20, {
      type: 'video',
      channelId: 'CHANNEL_ID', // Busca solo en este canal
    });
    
    console.log(`Videos del canal: ${results.items?.length}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Videos Relacionados

### `search.related(id, maxResults)`

Obtiene videos relacionados a un video específico.

```typescript
async function getRelatedVideos() {
  try {
    const related = await youTube.search.related('VIDEO_ID', 10);
    
    console.log('Videos relacionados:');
    related.items?.forEach((video, index) => {
      console.log(`${index + 1}. ${video.snippet?.title}`);
      console.log(`   Canal: ${video.snippet?.channelTitle}`);
      console.log(`   ID: ${video.id?.videoId}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Búsqueda Segura

```typescript
async function safeSearch() {
  try {
    // Búsqueda estricta (filtra contenido inapropiado)
    const strict = await youTube.search.query('query', 10, {
      safeSearch: 'strict', // 'none', 'moderate', 'strict'
    });
    
    // Búsqueda moderada
    const moderate = await youTube.search.query('query', 10, {
      safeSearch: 'moderate',
    });
    
    console.log('Estricta:', strict.items?.length);
    console.log('Moderada:', moderate.items?.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Licencia de Video

```typescript
async function searchByLicense() {
  try {
    // Creative Commons (reutilizable)
    const creativeCommons = await youTube.search.query('music', 10, {
      type: 'video',
      videoLicense: 'creativeCommon',
    });
    
    // Licencia estándar de YouTube
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

## Todos los Parámetros de Búsqueda

```typescript
interface SearchParams {
  // Paginación
  pageToken?: string;
  
  // Filtros de tipo
  type?: 'video' | 'channel' | 'playlist';
  
  // Filtros de video
  videoDuration?: 'short' | 'medium' | 'long' | 'any';
  videoDefinition?: 'high' | 'standard' | 'any';
  videoDimension?: '2d' | '3d' | 'any';
  videoLicense?: 'creativeCommon' | 'youtube' | 'any';
  videoEmbeddable?: boolean;
  videoSyndicated?: boolean;
  videoType?: 'episode' | 'movie' | 'any';
  videoCategoryId?: string;
  
  // Filtros de canal
  channelId?: string;
  channelType?: 'show' | 'any';
  
  // Filtros de eventos
  eventType?: 'live' | 'completed' | 'upcoming';
  
  // Filtros de ubicación
  location?: string; // lat,lng (ej: "37.42307,-122.08427")
  locationRadius?: string; // ej: "1500m", "5km", "10000ft", "0.75mi"
  regionCode?: string; // ISO 3166-1 alpha-2
  
  // Filtros de idioma
  relevanceLanguage?: string; // ISO 639-1
  
  // Filtros de fecha
  publishedAfter?: string; // ISO 8601
  publishedBefore?: string; // ISO 8601
  
  // Ordenamiento
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
  
  // Búsqueda segura
  safeSearch?: 'none' | 'moderate' | 'strict';
  
  // Tema (para búsqueda de canales)
  topicId?: string;
  
  // Para contenido de pago
  forContentOwner?: boolean;
  forDeveloper?: boolean;
  forMine?: boolean;
}
```

## Ejemplos Completos

### Motor de Búsqueda Simple

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

// Uso
const results = await searchEngine('nodejs tutorial', {
  type: 'video',
  duration: 'medium',
  hd: true,
  sort: 'views',
});
```

### Encontrar Videos Tendencia

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

### Buscar Contenido Creative Commons

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

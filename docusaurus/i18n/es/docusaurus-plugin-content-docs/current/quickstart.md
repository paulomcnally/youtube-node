---
sidebar_position: 3
---

# Guía Rápida

Aprende los conceptos básicos de `youtube-node` en minutos.

## Configuración Básica

```typescript
import YouTube from 'youtube-node';

// Crear instancia
const youTube = new YouTube();

// Configurar tu API Key
youTube.setKey('TU_API_KEY_DE_YOUTUBE');
```

## Buscar Videos

```typescript
// Buscar videos con async/await
async function searchVideos() {
  try {
    const result = await youTube.search.query('nodejs tutorial', 10);
    
    console.log(`Total de resultados: ${result.pageInfo?.totalResults}`);
    
    result.items?.forEach((item) => {
      console.log(`🎬 ${item.snippet?.title}`);
      console.log(`   ID: ${item.id?.videoId}`);
      console.log(`   Canal: ${item.snippet?.channelTitle}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchVideos();
```

## Obtener Información de un Video

```typescript
async function getVideoInfo() {
  try {
    const video = await youTube.videos.getById('VIDEO_ID_AQUÍ');
    
    if (video.items && video.items.length > 0) {
      const item = video.items[0];
      console.log('Título:', item.snippet?.title);
      console.log('Descripción:', item.snippet?.description);
      console.log('Vistas:', item.statistics?.viewCount);
      console.log('Likes:', item.statistics?.likeCount);
      console.log('Duración:', item.contentDetails?.duration);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Obtener Información de un Canal

```typescript
async function getChannelInfo() {
  try {
    // Por ID de canal
    const channel = await youTube.channels.getById('CHANNEL_ID');
    
    // Por nombre de usuario
    const byUsername = await youTube.channels.getByUsername('GoogleDevelopers');
    
    // Por handle (@nombre)
    const byHandle = await youTube.channels.getByUsername('@YouTube');
    
    console.log('Canal:', channel.items?.[0]?.snippet?.title);
    console.log('Suscriptores:', channel.items?.[0]?.statistics?.subscriberCount);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Obtener Videos Relacionados

```typescript
async function getRelatedVideos() {
  try {
    const related = await youTube.search.related('VIDEO_ID', 5);
    
    console.log('Videos relacionados:');
    related.items?.forEach((item) => {
      console.log(`- ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Trabajar con Playlists

```typescript
async function workWithPlaylists() {
  try {
    // Obtener información de una playlist
    const playlist = await youTube.playlists.getById('PLAYLIST_ID');
    console.log('Playlist:', playlist.items?.[0]?.snippet?.title);
    
    // Obtener items de la playlist
    const items = await youTube.playlists.getItemsById('PLAYLIST_ID', 50);
    console.log(`Tiene ${items.items?.length} videos`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Videos Populares

```typescript
async function getPopularVideos() {
  try {
    // Videos más populares globalmente
    const popular = await youTube.videos.getMostPopular(10);
    
    // Videos populares por categoría (10 = Música)
    const music = await youTube.videos.getMostPopularByCategory(10, 10);
    
    // Videos populares por región (ES = España)
    const spain = await youTube.videos.getMostPopularByRegion(10, 'ES');
    
    console.log('Populares:', popular.items?.map(v => v.snippet?.title));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Forma Alternativa: Usando Promises con .then()

```typescript
youTube.search.query('nodejs', 10)
  .then(result => {
    console.log('Resultados:', result.items?.length);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Próximos Pasos

- [Autenticación y API Keys](./authentication.md) - Configura tu API Key
- [Videos](./api/videos.md) - Todo sobre videos
- [Canales](./api/channels.md) - Todo sobre canales
- [Búsqueda](./api/search.md) - Búsquedas avanzadas

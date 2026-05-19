---
sidebar_position: 9
---

# Secciones de Canal

Gestiona las secciones personalizadas de tu canal.

## Listar Secciones

### `channelSections.list(channelId?)`

Obtiene las secciones de un canal.

```typescript
async function listChannelSections() {
  try {
    // Secciones de un canal específico
    const sections = await youTube.channelSections.list('CHANNEL_ID');
    
    // Mis secciones (requiere OAuth)
    const mySections = await youTube.channelSections.list();
    
    console.log(`El canal tiene ${sections.items?.length} secciones`);
    
    sections.items?.forEach((section, index) => {
      console.log(`\n=== SECCIÓN ${index + 1} ===`);
      console.log('Tipo:', section.snippet?.type);
      // Tipos: allPlaylists, completedEvents, featuredChannels, 
      // likedPlaylists, likes, liveEvents, multipleChannels, 
      // multiplePlaylists, popularUploads, recentActivity, 
      // recentPosts, recentUploads, singlePlaylist, subscriptions
      
      console.log('Título:', section.snippet?.title);
      console.log('Posición:', section.snippet?.position);
      console.log('Estilo:', section.snippet?.style); // horizontalRow o verticalList
      
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

## Crear Sección (Requiere OAuth)

### `channelSections.create(sectionResource)`

Crea una nueva sección en el canal.

```typescript
async function createChannelSection() {
  try {
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist', // o 'multiplePlaylists', 'featuredChannels', etc.
        style: 'horizontalRow', // o 'verticalList'
        title: 'Mi Playlist Destacada',
        position: 0,
      },
      contentDetails: {
        playlists: ['PLAYLIST_ID'],
      },
    };
    
    const result = await youTube.channelSections.create(sectionResource);
    
    console.log('Sección creada exitosamente');
    console.log('ID:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Tipos de Secciones

| Tipo | Descripción |
|------|-------------|
| `allPlaylists` | Todas las playlists del canal |
| `completedEvents` | Eventos completados |
| `featuredChannels` | Canales destacados |
| `likedPlaylists` | Playlists con like |
| `likes` | Videos con like |
| `liveEvents` | Eventos en vivo |
| `multipleChannels` | Múltiples canales |
| `multiplePlaylists` | Múltiples playlists |
| `popularUploads` | Uploads populares |
| `recentActivity` | Actividad reciente |
| `recentPosts` | Posts recientes |
| `recentUploads` | Uploads recientes |
| `singlePlaylist` | Una sola playlist |
| `subscriptions` | Suscripciones |

## Actualizar Sección (Requiere OAuth)

### `channelSections.update(sectionId, sectionResource)`

Actualiza una sección existente.

```typescript
async function updateChannelSection() {
  try {
    const sectionResource = {
      id: 'SECTION_ID',
      snippet: {
        type: 'multiplePlaylists',
        style: 'horizontalRow',
        title: 'Mis Playlists Favoritas',
        position: 1,
      },
      contentDetails: {
        playlists: ['PLAYLIST_ID_1', 'PLAYLIST_ID_2', 'PLAYLIST_ID_3'],
      },
    };
    
    const result = await youTube.channelSections.update('SECTION_ID', sectionResource);
    
    console.log('Sección actualizada:', result.items?.[0]?.snippet?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Eliminar Sección (Requiere OAuth)

### `channelSections.delete(sectionId)`

Elimina una sección del canal.

```typescript
async function deleteChannelSection() {
  try {
    await youTube.channelSections.delete('SECTION_ID');
    console.log('Sección eliminada exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de una Sección

```typescript
interface ChannelSection {
  kind: 'youtube#channelSection';
  etag: string;
  id: string;
  snippet: {
    type: string;
    style?: string;
    channelId: string;
    title?: string;
    position?: number;
    defaultLanguage?: string;
    localized?: {
      title: string;
    };
  };
  contentDetails?: {
    playlists?: string[];
    channels?: string[];
  };
  targeting?: {
    languages?: string[];
    regions?: string[];
  };
}
```

## Ejemplos Completos

### Organizar Canal con Secciones

```typescript
async function setupChannelSections() {
  try {
    const sections = [
      {
        type: 'singlePlaylist',
        title: '🎬 Inicio - Videos Destacados',
        playlists: ['PLAYLIST_FEATURED_ID'],
        position: 0,
      },
      {
        type: 'recentUploads',
        title: '🆕 Videos Recientes',
        position: 1,
      },
      {
        type: 'popularUploads',
        title: '🔥 Más Populares',
        position: 2,
      },
      {
        type: 'multiplePlaylists',
        title: '📚 Playlists por Tema',
        playlists: ['PLAYLIST_1', 'PLAYLIST_2', 'PLAYLIST_3'],
        position: 3,
      },
      {
        type: 'featuredChannels',
        title: '👥 Canales Recomendados',
        channels: ['CHANNEL_ID_1', 'CHANNEL_ID_2'],
        position: 4,
      },
    ];
    
    const created: any[] = [];
    
    for (const section of sections) {
      try {
        const sectionResource: any = {
          snippet: {
            type: section.type,
            title: section.title,
            position: section.position,
            style: 'horizontalRow',
          },
          contentDetails: {},
        };
        
        if (section.playlists) {
          sectionResource.contentDetails.playlists = section.playlists;
        }
        
        if (section.channels) {
          sectionResource.contentDetails.channels = section.channels;
        }
        
        const result = await youTube.channelSections.create(sectionResource);
        
        created.push({
          title: section.title,
          id: result.items?.[0]?.id,
          position: section.position,
        });
        
        console.log(`✅ Creada: ${section.title}`);
      } catch (err: any) {
        console.error(`❌ Error con ${section.title}:`, err.message);
      }
    }
    
    return created;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

### Limpiar y Reorganizar Secciones

```typescript
async function reorganizeChannelSections() {
  try {
    // Obtener secciones actuales
    const currentSections = await youTube.channelSections.list();
    
    console.log(`Encontradas ${currentSections.items?.length} secciones`);
    
    // Eliminar todas las secciones personalizadas
    for (const section of currentSections.items || []) {
      // No eliminar secciones del sistema como recentUploads
      const systemTypes = ['recentUploads', 'popularUploads', 'likes'];
      
      if (!systemTypes.includes(section.snippet?.type || '')) {
        try {
          await youTube.channelSections.delete(section.id!);
          console.log(`Eliminada: ${section.snippet?.type}`);
        } catch (err: any) {
          console.error(`Error eliminando ${section.id}:`, err.message);
        }
      }
    }
    
    // Crear nuevo layout
    await setupChannelSections();
    
    console.log('Canal reorganizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

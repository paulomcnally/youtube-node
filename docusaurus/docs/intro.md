---
sidebar_position: 1
slug: /
---

# Introducción

`youtube-node` es un cliente de **YouTube API v3** para **Node.js** escrito en TypeScript con soporte completo de tipos.

## Características Principales

✨ **Soporte Nativo de Promesas** - Usa async/await o .then()/.catch()  
📝 **TypeScript Completo** - Tipado completo incluido  
🔧 **CLI Incluido** - Interfaz de línea de comandos incluida  
🔄 **Retrocompatible** - Soporte de callbacks todavía disponible  
⚡ **Recursos Modulares** - API organizada por recursos (videos, canales, etc.)  
🛡️ **Manejo de Errores** - Clases de error específicas  
📄 **Paginación** - Soporte completo para paginación  
🔍 **Filtros Avanzados** - Búsqueda con múltiples filtros  

## ¿Qué puedes hacer?

Con esta librería puedes:

- 🔍 **Buscar videos, canales y playlists** en YouTube
- 📹 **Obtener información detallada** de videos, canales y playlists
- 💬 **Gestionar comentarios** (listar, añadir, responder, eliminar)
- 📋 **Trabajar con playlists** (crear, actualizar, eliminar)
- ⭐ **Gestionar suscripciones** (suscribirse, cancelar suscripción)
- 📝 **Subir videos** a tu canal
- 🎬 **Gestionar subtítulos/captions**
- 🖼️ **Establecer miniaturas personalizadas**
- ⬆️ **Dar like/dislike** a videos
- 🌍 **Obtener videos populares** por categoría o región

## Instalación Rápida

```bash
npm install youtube-node
```

## Ejemplo Rápido

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();
youTube.setKey('TU_API_KEY');

// Buscar videos
async function searchVideos() {
  const result = await youTube.search.query('nodejs tutorial', 10);
  console.log(`Encontrados ${result.pageInfo?.totalResults} videos`);
}

searchVideos();
```

## Requisitos

- **Node.js** 18 o superior
- Una **API Key** de YouTube Data API v3 ([Obtener API Key](https://developers.google.com/youtube/v3/getting-started))

## Licencia

MIT License - ver [LICENSE](https://github.com/paulomcnally/youtube-node/blob/main/LICENSE) para más detalles.

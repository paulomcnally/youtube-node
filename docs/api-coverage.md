# Cobertura de la API de YouTube v3

Este documento compara las funcionalidades actualmente implementadas en `youtube-node` vs todas las capacidades disponibles en la API oficial de YouTube Data API v3.

## Resumen

| Estado | Conteo |
|--------|--------|
| Implementado | 8 métodos |
| Parcialmente implementado | 2 recursos |
| No implementado | 60+ métodos |

---

## Recursos y Métodos

### 1. Activities (Actividades) ⚠️ PARCIAL

Acciones realizadas por un canal o usuario (rating, compartir, favoritos, subir videos).

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/activities` | ✅ Disponible | `getMostPopular()` (indirecto) |

**Falta implementar:**
- `activities.list` con filtros por canal completo

---

### 2. Captions (Subtítulos) ❌ NO IMPLEMENTADO

Tracks de subtítulos/captions asociados a videos.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/captions` | ❌ No implementado | - |
| POST | `/captions` | ❌ No implementado | - |
| PUT | `/captions` | ❌ No implementado | - |
| DELETE | `/captions` | ❌ No implementado | - |
| GET | `/captions/{id}` | ❌ No implementado | - (download) |

**Métodos a implementar:**
- `captions.list(videoId)` - Listar subtítulos de un video
- `captions.insert(videoId, captionResource)` - Subir subtítulo
- `captions.update(captionId, captionResource)` - Actualizar subtítulo
- `captions.download(captionId)` - Descargar subtítulo
- `captions.delete(captionId)` - Eliminar subtítulo

---

### 3. ChannelBanners (Banners de Canal) ❌ NO IMPLEMENTADO

Gestión de imágenes de banner para canales.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| POST | `/channelBanners/insert` | ❌ No implementado | - |

**Métodos a implementar:**
- `channelBanners.insert(imageData)` - Subir imagen de banner

---

### 4. Channels (Canales) ⚠️ PARCIAL

Información sobre canales de YouTube.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/channels` | ⚠️ Parcial | `getChannelById()` |
| PUT | `/channels` | ❌ No implementado | - |

**Implementado:**
- ✅ `getChannelById(id)` - Obtener canal por ID

**Falta implementar:**
- `channels.list(byUsername)` - Buscar canal por nombre de usuario
- `channels.list(mine=true)` - Obtener canal autenticado
- `channels.list(categoryId)` - Listar canales por categoría
- `channels.update(channelResource)` - Actualizar metadatos del canal

---

### 5. ChannelSections (Secciones de Canal) ❌ NO IMPLEMENTADO

Secciones destacadas de videos en un canal.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/channelSections` | ❌ No implementado | - |
| POST | `/channelSections` | ❌ No implementado | - |
| PUT | `/channelSections` | ❌ No implementado | - |
| DELETE | `/channelSections` | ❌ No implementado | - |

**Métodos a implementar:**
- `channelSections.list(channelId)` - Listar secciones
- `channelSections.insert(sectionResource)` - Crear sección
- `channelSections.update(sectionResource)` - Actualizar sección
- `channelSections.delete(sectionId)` - Eliminar sección

---

### 6. Comments (Comentarios) ❌ NO IMPLEMENTADO

Comentarios individuales en videos/canales.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/comments` | ❌ No implementado | - |
| POST | `/comments` | ❌ No implementado | - |
| PUT | `/comments` | ❌ No implementado | - |
| DELETE | `/comments` | ❌ No implementado | - |
| POST | `/comments/setModerationStatus` | ❌ No implementado | - |

**Métodos a implementar:**
- `comments.list(parentId)` - Listar respuestas a un comentario
- `comments.list(id)` - Obtener comentarios específicos
- `comments.insert(parentId, text)` - Responder a un comentario
- `comments.update(commentId, text)` - Editar comentario
- `comments.delete(commentId)` - Eliminar comentario
- `comments.setModerationStatus(id, status)` - Moderar comentario

---

### 7. CommentThreads (Hilos de Comentarios) ❌ NO IMPLEMENTADO

Hilos de comentarios (comentario principal + respuestas).

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/commentThreads` | ❌ No implementado | - |
| POST | `/commentThreads` | ❌ No implementado | - |

**Métodos a implementar:**
- `commentThreads.list(videoId)` - Listar hilos de un video
- `commentThreads.list(channelId)` - Listar hilos de un canal
- `commentThreads.insert(videoId, text)` - Crear comentario principal

---

### 8. i18nLanguages (Idiomas) ❌ NO IMPLEMENTADO

Idiomas soportados por YouTube.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/i18nLanguages` | ❌ No implementado | - |

**Métodos a implementar:**
- `i18nLanguages.list()` - Listar idiomas soportados

---

### 9. i18nRegions (Regiones) ❌ NO IMPLEMENTADO

Regiones geográficas soportadas.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/i18nRegions` | ❌ No implementado | - |

**Métodos a implementar:**
- `i18nRegions.list()` - Listar regiones soportadas

---

### 10. Members (Miembros) ❌ NO IMPLEMENTADO

Miembros de canales (suscriptores de pago).

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/members` | ❌ No implementado | - |

**Métodos a implementar:**
- `members.list()` - Listar miembros del canal (requiere OAuth)

---

### 11. MembershipsLevels (Niveles de Membresía) ❌ NO IMPLEMENTADO

Niveles de precios para membresías.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/membershipsLevels` | ❌ No implementado | - |

**Métodos a implementar:**
- `membershipsLevels.list()` - Listar niveles de membresía

---

### 12. PlaylistImages (Imágenes de Playlist) ❌ NO IMPLEMENTADO

Gestión de imágenes personalizadas para playlists.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/playlistImages` | ❌ No implementado | - |
| POST | `/playlistImages` | ❌ No implementado | - |
| PUT | `/playlistImages` | ❌ No implementado | - |
| DELETE | `/playlistImages` | ❌ No implementado | - |

**Métodos a implementar:**
- `playlistImages.list(playlistId)` - Listar imágenes
- `playlistImages.insert(playlistId, imageData)` - Subir imagen
- `playlistImages.update(imageId, imageData)` - Actualizar imagen
- `playlistImages.delete(imageId)` - Eliminar imagen

---

### 13. PlaylistItems (Items de Playlist) ⚠️ PARCIAL

Videos dentro de una playlist.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/playlistItems` | ✅ Disponible | `getPlayListsItemsById()` |
| POST | `/playlistItems` | ❌ No implementado | - |
| PUT | `/playlistItems` | ❌ No implementado | - |
| DELETE | `/playlistItems` | ❌ No implementado | - |

**Implementado:**
- ✅ `getPlayListsItemsById(id, maxResults)` - Obtener items de playlist

**Falta implementar:**
- `playlistItems.insert(playlistId, videoId)` - Agregar video a playlist
- `playlistItems.update(playlistItemResource)` - Actualizar posición/video
- `playlistItems.delete(playlistItemId)` - Eliminar video de playlist

---

### 14. Playlists (Playlists) ⚠️ PARCIAL

Playlists de YouTube.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/playlists` | ✅ Disponible | `getPlayListsById()` |
| POST | `/playlists` | ❌ No implementado | - |
| PUT | `/playlists` | ❌ No implementado | - |
| DELETE | `/playlists` | ❌ No implementado | - |

**Implementado:**
- ✅ `getPlayListsById(id)` - Obtener playlist por ID

**Falta implementar:**
- `playlists.list(channelId)` - Listar playlists de un canal
- `playlists.list(mine=true)` - Listar playlists del usuario
- `playlists.insert(title, description, privacy)` - Crear playlist
- `playlists.update(playlistResource)` - Actualizar playlist
- `playlists.delete(playlistId)` - Eliminar playlist

---

### 15. Search (Búsqueda) ✅ IMPLEMENTADO

Búsqueda de videos, canales y playlists.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/search` | ✅ Disponible | `search()` |

**Implementado:**
- ✅ `search(query, maxResults, params)` - Búsqueda general
- ✅ `related(id, maxResults)` - Videos relacionados (usa search)

**Falta implementar:**
- Mejoras en filtros de búsqueda por tipo (solo videos, solo canales, solo playlists)

---

### 16. Subscriptions (Suscripciones) ❌ NO IMPLEMENTADO

Suscripciones de usuarios a canales.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/subscriptions` | ❌ No implementado | - |
| POST | `/subscriptions` | ❌ No implementado | - |
| DELETE | `/subscriptions` | ❌ No implementado | - |

**Métodos a implementar:**
- `subscriptions.list(channelId)` - Listar suscriptores de un canal
- `subscriptions.list(mine=true)` - Listar suscripciones del usuario
- `subscriptions.insert(channelId)` - Suscribirse a un canal
- `subscriptions.delete(subscriptionId)` - Cancelar suscripción

---

### 17. Thumbnails (Miniaturas) ❌ NO IMPLEMENTADO

Subida de miniaturas personalizadas para videos.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| POST | `/thumbnails/set` | ❌ No implementado | - |

**Métodos a implementar:**
- `thumbnails.set(videoId, imageData)` - Subir miniatura personalizada

---

### 18. VideoAbuseReportReasons (Razones de Reporte) ❌ NO IMPLEMENTADO

Razones para reportar videos inapropiados.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/videoAbuseReportReasons` | ❌ No implementado | - |

**Métodos a implementar:**
- `videoAbuseReportReasons.list()` - Listar razones de reporte

---

### 19. VideoCategories (Categorías de Videos) ❌ NO IMPLEMENTADO

Categorías disponibles para videos.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/videoCategories` | ❌ No implementado | - |

**Métodos a implementar:**
- `videoCategories.list(regionCode)` - Listar categorías por región
- `videoCategories.list(id)` - Obtener categoría específica

---

### 20. Videos (Videos) ⚠️ PARCIAL

Videos de YouTube.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| GET | `/videos` | ✅ Disponible | `getById()`, `getMostPopular()`, `getMostPopularByCategory()` |
| POST | `/videos` | ❌ No implementado | - |
| PUT | `/videos` | ❌ No implementado | - |
| DELETE | `/videos` | ❌ No implementado | - |
| POST | `/videos/rate` | ❌ No implementado | - |
| GET | `/videos/getRating` | ❌ No implementado | - |
| POST | `/videos/reportAbuse` | ❌ No implementado | - |

**Implementado:**
- ✅ `getById(id)` - Obtener video por ID
- ✅ `getMostPopular(maxResults)` - Videos más populares
- ✅ `getMostPopularByCategory(maxResults, categoryId)` - Populares por categoría

**Falta implementar:**
- `videos.list(chart='mostPopular', regionCode)` - Populares por región
- `videos.list(id)` - Múltiples videos por ID
- `videos.insert(videoResource, mediaBody)` - Subir video
- `videos.update(videoResource)` - Actualizar metadatos
- `videos.delete(videoId)` - Eliminar video
- `videos.rate(videoId, rating)` - Dar like/dislike a video
- `videos.getRating(videoId)` - Obtener rating del usuario
- `videos.reportAbuse(videoId, reasonId)` - Reportar video

---

### 21. Watermarks (Marcas de Agua) ❌ NO IMPLEMENTADO

Marcas de agua para videos de un canal.

| Método HTTP | Endpoint | Estado | Método en librería |
|-------------|----------|--------|-------------------|
| POST | `/watermarks/set` | ❌ No implementado | - |
| POST | `/watermarks/unset` | ❌ No implementado | - |

**Métodos a implementar:**
- `watermarks.set(channelId, imageData, timing)` - Establecer watermark
- `watermarks.unset(channelId)` - Eliminar watermark

---

## Funcionalidades Adicionales

### Autenticación OAuth 2.0 ❌ NO IMPLEMENTADO

Actualmente la librería solo soporta autenticación por API Key. Muchos endpoints requieren OAuth 2.0.

**Requerimientos para implementar:**
- Flujo de autorización OAuth 2.0
- Manejo de tokens de acceso
- Refresco de tokens
- Scopes de autorización

### Manejo de Subidas (Uploads) ❌ NO IMPLEMENTADO

- Subida de videos
- Subida de subtítulos
- Subida de miniaturas
- Subida de banners de canal
- Subida de marcas de agua

### Paginación Avanzada ⚠️ PARCIAL

- ✅ Soporte básico de `pageToken` en `search()`
- ❌ Falta: helpers para navegación de páginas
- ❌ Falta: manejo automático de paginación

---

## Referencias

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3/docs)
- [YouTube Data API Reference](https://developers.google.com/youtube/v3/docs/reference)

---

*Última actualización: Mayo 2026*

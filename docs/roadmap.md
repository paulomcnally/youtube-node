# Roadmap de Desarrollo - youtube-node

Documento con las tareas necesarias para alcanzar cobertura completa de la API de YouTube v3.

## Fase 1: Mejoras en Recursos Existentes (Alta Prioridad)

### 1.1 Videos - Completar funcionalidad
- [ ] Implementar `videos.list` para múltiples IDs
- [ ] Agregar soporte para filtros por región en videos populares
- [ ] Implementar paginación con helpers (nextPage, prevPage)

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

### 1.2 Canales - Ampliar búsqueda
- [ ] Agregar búsqueda de canales por nombre de usuario (`forUsername`)
- [ ] Agregar búsqueda de canal autenticado (`mine=true`)
- [ ] Agregar listado de canales por categoría

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2 horas

### 1.3 Playlists - CRUD completo
- [ ] Implementar `playlists.list` por canal
- [ ] Implementar `playlists.insert` (crear playlist)
- [ ] Implementar `playlists.update` (actualizar playlist)
- [ ] Implementar `playlists.delete` (eliminar playlist)

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

### 1.4 PlaylistItems - CRUD completo
- [ ] Implementar `playlistItems.insert` (agregar video a playlist)
- [ ] Implementar `playlistItems.update` (actualizar posición)
- [ ] Implementar `playlistItems.delete` (eliminar de playlist)

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

---

## Fase 2: Recursos de Solo Lectura (Media Prioridad)

### 2.1 Categorías de Videos
- [ ] Implementar `videoCategories.list()`
- [ ] Agregar soporte para filtrar por región
- [ ] Crear ejemplo de uso

**Archivos a modificar:** `lib/youtube.js`, `example/`
**Tiempo estimado:** 1-2 horas

### 2.2 Idiomas y Regiones (i18n)
- [ ] Implementar `i18nLanguages.list()`
- [ ] Implementar `i18nRegions.list()`
- [ ] Crear ejemplos de uso

**Archivos a modificar:** `lib/youtube.js`, `example/`
**Tiempo estimado:** 1-2 horas

### 2.3 Comentarios (Solo Lectura)
- [ ] Implementar `commentThreads.list(videoId)`
- [ ] Implementar `commentThreads.list(channelId)`
- [ ] Implementar `comments.list(parentId)`
- [ ] Implementar `comments.list(id)`

**Archivos a modificar:** `lib/youtube.js`, `example/`
**Tiempo estimado:** 3-4 horas

### 2.4 Suscripciones (Solo Lectura)
- [ ] Implementar `subscriptions.list(channelId)`
- [ ] Implementar `subscriptions.list(mine=true)`

**Archivos a modificar:** `lib/youtube.js`, `example/`
**Tiempo estimado:** 2 horas

### 2.5 Actividades
- [ ] Implementar `activities.list(channelId)`
- [ ] Implementar `activities.list(mine=true)`
- [ ] Implementar `activities.list(home=true)`

**Archivos a modificar:** `lib/youtube.js`, `example/`
**Tiempo estimado:** 2 horas

---

## Fase 3: Funcionalidades con OAuth (Alta Prioridad - Requiere Auth)

### 3.1 Sistema de Autenticación OAuth 2.0
- [ ] Implementar clase de autenticación OAuth
- [ ] Crear método para generar URL de autorización
- [ ] Implementar intercambio de código por token
- [ ] Implementar refresco de tokens
- [ ] Agregar manejo de scopes

**Archivos a crear:** `lib/auth.js` o similar
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 4-6 horas

### 3.2 Operaciones de Escritura - Videos
- [ ] Implementar `videos.rate(videoId, rating)` (like/dislike)
- [ ] Implementar `videos.getRating(videoId)`
- [ ] Implementar `videos.reportAbuse(videoId, reasonId)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

### 3.3 Operaciones de Escritura - Comentarios
- [ ] Implementar `commentThreads.insert(videoId, text)`
- [ ] Implementar `comments.insert(parentId, text)` (respuestas)
- [ ] Implementar `comments.update(commentId, text)`
- [ ] Implementar `comments.delete(commentId)`
- [ ] Implementar `comments.setModerationStatus(id, status)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

### 3.4 Operaciones de Escritura - Suscripciones
- [ ] Implementar `subscriptions.insert(channelId)`
- [ ] Implementar `subscriptions.delete(subscriptionId)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 1-2 horas

### 3.5 Actualización de Canales
- [ ] Implementar `channels.update(channelResource)`
- [ ] Implementar `channelBanners.insert(imageData)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

---

## Fase 4: Subida de Archivos (Media Prioridad - Complejidad Alta)

### 4.1 Subida de Videos
- [ ] Implementar `videos.insert()` con soporte para:
  - Metadatos del video (título, descripción, tags, etc.)
  - Archivo de video (multipart upload)
  - Monitoreo de progreso
  - Resume de subida interrumpida
- [ ] Crear ejemplo completo

**Dependencias:** OAuth 2.0
**Archivos a crear/modificar:** `lib/youtube.js`, posiblemente `lib/upload.js`
**Tiempo estimado:** 6-8 horas

### 4.2 Subida de Subtítulos
- [ ] Implementar `captions.insert(videoId, captionFile)`
- [ ] Implementar `captions.update(captionId, captionFile)`
- [ ] Implementar `captions.download(captionId)`
- [ ] Implementar `captions.delete(captionId)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

### 4.3 Subida de Miniaturas
- [ ] Implementar `thumbnails.set(videoId, imageData)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 1-2 horas

### 4.4 Subida de Imágenes de Playlist
- [ ] Implementar `playlistImages.insert()`
- [ ] Implementar `playlistImages.update()`
- [ ] Implementar `playlistImages.delete()`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

### 4.5 Watermarks
- [ ] Implementar `watermarks.set(channelId, imageData, timing)`
- [ ] Implementar `watermarks.unset(channelId)`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2 horas

---

## Fase 5: Funcionalidades Avanzadas (Baja Prioridad)

### 5.1 Secciones de Canal
- [ ] Implementar `channelSections.list()`
- [ ] Implementar `channelSections.insert()`
- [ ] Implementar `channelSections.update()`
- [ ] Implementar `channelSections.delete()`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

### 5.2 Membresías
- [ ] Implementar `members.list()`
- [ ] Implementar `membershipsLevels.list()`

**Dependencias:** OAuth 2.0
**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 2-3 horas

### 5.3 Reportes de Abuso
- [ ] Implementar `videoAbuseReportReasons.list()`

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 1 hora

---

## Fase 6: Mejoras de Infraestructura

### 6.1 Testing
- [ ] Crear tests unitarios para métodos existentes
- [ ] Crear tests de integración (mock de API)
- [ ] Configurar CI/CD con GitHub Actions

**Archivos a crear:** `test/` (expandir)
**Tiempo estimado:** 6-8 horas

### 6.2 Documentación
- [ ] Crear documentación en formato JSDoc para todos los métodos
- [ ] Actualizar README con todas las funcionalidades
- [ ] Crear guía de migración para versiones mayores

**Archivos a modificar:** `README.md`, `lib/youtube.js`
**Tiempo estimado:** 4-6 horas

### 6.3 TypeScript
- [ ] Mejorar definiciones en `typings/index.d.ts`
- [ ] Agregar tipos para todas las respuestas de la API
- [ ] Agregar tipos para parámetros de cada método

**Archivos a modificar:** `typings/index.d.ts`
**Tiempo estimado:** 3-4 horas

### 6.4 CLI
- [ ] Expandir CLI con más comandos
- [ ] Agregar autenticación OAuth desde CLI
- [ ] Agregar comandos para operaciones CRUD

**Archivos a modificar:** `lib/cli.js`
**Tiempo estimado:** 4-6 horas

### 6.5 Manejo de Errores
- [ ] Mejorar mensajes de error
- [ ] Crear clases de error específicas
- [ ] Implementar retry automático con backoff exponencial
- [ ] Manejar rate limits de la API

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

### 6.6 Paginación Automática
- [ ] Implementar helper `getAllPages()`
- [ ] Crear generadores/async iterators para paginación
- [ ] Agregar opciones de paginación a todos los métodos de lista

**Archivos a modificar:** `lib/youtube.js`
**Tiempo estimado:** 3-4 horas

---

## Estimación Total de Tiempo

| Fase | Tiempo Estimado |
|------|-----------------|
| Fase 1: Recursos Existentes | 9-12 horas |
| Fase 2: Recursos Solo Lectura | 9-14 horas |
| Fase 3: OAuth y Escritura | 12-18 horas |
| Fase 4: Subida de Archivos | 14-21 horas |
| Fase 5: Funcionalidades Avanzadas | 6-8 horas |
| Fase 6: Infraestructura | 20-28 horas |
| **Total** | **70-101 horas** |

---

## Orden de Implementación Recomendado

### Para Liberación v1.x (Próxima Minor)
1. Fase 1: Completar recursos existentes
2. Fase 2: Recursos de solo lectura (excepto comentarios)
3. Fase 6.2: Mejorar documentación
4. Fase 6.3: Mejorar tipos TypeScript

### Para Liberación v2.0 (Major - Breaking Changes)
1. Fase 3: Sistema OAuth completo
2. Fase 4: Subida de archivos
3. Fase 5: Funcionalidades avanzadas
4. Fase 6.1: Testing completo
5. Fase 6.4: CLI mejorado

### Continuo
1. Fase 6.5: Mejoras en manejo de errores
2. Fase 6.6: Paginación automática

---

## Notas Técnicas

### Consideraciones de Diseño

1. **Backward Compatibility**: Mantener compatibilidad con código existente
2. **Async/Await**: Considerar soporte nativo para async/await además de callbacks
3. **Promises**: Agregar soporte para Promises en todos los métodos
4. **Streaming**: Para subidas grandes, implementar streaming

### Dependencias Potenciales

Para subida de archivos y OAuth:
- `google-auth-library` - Para autenticación OAuth
- `form-data` - Para multipart uploads
- `pump` o similar - Para streaming

### Estructura de Archivos Propuesta

```
lib/
├── youtube.js          # Clase principal (mantener compatibilidad)
├── auth.js             # Nuevo: Autenticación OAuth
├── upload.js           # Nuevo: Manejo de uploads
├── resources/
│   ├── videos.js       # Nuevo: Métodos de videos
│   ├── channels.js     # Nuevo: Métodos de canales
│   ├── playlists.js    # Nuevo: Métodos de playlists
│   ├── comments.js     # Nuevo: Métodos de comentarios
│   └── ...
└── utils/
    ├── errors.js       # Nuevo: Clases de error
    ├── pagination.js   # Nuevo: Helpers de paginación
    └── validators.js   # Nuevo: Validaciones
```

---

## Seguimiento de Progreso

Actualiza este documento marcando las tareas completadas:
- [ ] Pendiente
- [x] Completado
- [-] En progreso
- [~] Postergado

*Última actualización: Mayo 2026*

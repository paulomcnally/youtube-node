---
sidebar_position: 1
---

# Manejo de Errores

Aprende a manejar errores de forma efectiva en `youtube-node`.

## Tipos de Errores

La librería proporciona clases de error específicas para diferentes situaciones:

### Clases de Error Disponibles

```typescript
import {
  YouTubeError,
  QuotaExceededError,
  InvalidKeyError,
  ResourceNotFoundError,
  RateLimitError,
  ValidationError,
  NetworkError,
} from 'youtube-node';
```

| Clase | HTTP Status | Descripción |
|-------|-------------|-------------|
| `YouTubeError` | - | Error base de YouTube |
| `QuotaExceededError` | 403 | Cuota de API excedida |
| `InvalidKeyError` | 400 | API Key inválida |
| `ResourceNotFoundError` | 404 | Recurso no encontrado |
| `RateLimitError` | 429 | Límite de requests excedido |
| `ValidationError` | 400 | Error de validación |
| `NetworkError` | - | Error de red/conexión |

## Manejo Básico de Errores

### Try/Catch con Tipos Específicos

```typescript
import YouTube, { 
  YouTubeError, 
  QuotaExceededError, 
  ResourceNotFoundError 
} from 'youtube-node';

async function getVideoWithErrorHandling() {
  const youTube = new YouTube();
  youTube.setKey('TU_API_KEY');
  
  try {
    const video = await youTube.videos.getById('VIDEO_ID');
    return video;
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      console.error('❌ Cuota excedida. Intenta mañana.');
      // Guardar request para reintentar después
      await queueRequestForLater('videos.getById', 'VIDEO_ID');
    } else if (error instanceof ResourceNotFoundError) {
      console.error('❌ Video no encontrado');
      // Marcar como eliminado en tu base de datos
      await markVideoAsDeleted('VIDEO_ID');
    } else if (error instanceof InvalidKeyError) {
      console.error('❌ API Key inválida');
      // Notificar al administrador
      await notifyAdmin('API Key inválida');
    } else if (error instanceof RateLimitError) {
      console.error('❌ Rate limit excedido. Esperando...');
      // Esperar y reintentar
      await sleep(60000); // Esperar 1 minuto
      return getVideoWithErrorHandling(); // Reintentar
    } else if (error instanceof YouTubeError) {
      console.error('❌ Error de YouTube:', error.message);
    } else {
      console.error('❌ Error desconocido:', error);
    }
  }
}
```

### Usando Funciones de Utilidad

```typescript
// Helper para manejar errores
function handleYouTubeError(error: any): { success: false; error: string; code?: string } {
  if (error instanceof QuotaExceededError) {
    return { 
      success: false, 
      error: 'Cuota diaria excedida. Intenta mañana.',
      code: 'QUOTA_EXCEEDED'
    };
  }
  
  if (error instanceof ResourceNotFoundError) {
    return { 
      success: false, 
      error: 'El recurso solicitado no existe.',
      code: 'NOT_FOUND'
    };
  }
  
  if (error instanceof InvalidKeyError) {
    return { 
      success: false, 
      error: 'API Key inválida o expirada.',
      code: 'INVALID_KEY'
    };
  }
  
  if (error instanceof RateLimitError) {
    return { 
      success: false, 
      error: 'Demasiadas solicitudes. Espera un momento.',
      code: 'RATE_LIMIT'
    };
  }
  
  if (error instanceof NetworkError) {
    return { 
      success: false, 
      error: 'Error de conexión. Verifica tu internet.',
      code: 'NETWORK_ERROR'
    };
  }
  
  if (error instanceof YouTubeError) {
    return { 
      success: false, 
      error: error.message,
      code: 'YOUTUBE_API_ERROR'
    };
  }
  
  return { 
    success: false, 
    error: error?.message || 'Error desconocido',
    code: 'UNKNOWN'
  };
}

// Uso
async function fetchVideo(videoId: string) {
  try {
    const video = await youTube.videos.getById(videoId);
    return { success: true, data: video };
  } catch (error) {
    return handleYouTubeError(error);
  }
}
```

## Reintentos Automáticos

### Configuración de Reintentos

```typescript
const youTube = new YouTube({
  retryOptions: {
    retries: 3,              // Número de intentos
    retryDelay: 1000,        // Delay base en ms
    maxRetryDelay: 30000,    // Delay máximo en ms
    retryCondition: (error) => {
      // Solo reintentar en ciertos errores
      return error instanceof RateLimitError || 
             error instanceof NetworkError;
    },
    onRetry: (error, attempt) => {
      console.log(`🔄 Reintento ${attempt}/3: ${error.message}`);
    }
  }
});
```

### Reintentos Manuales

```typescript
async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // No reintentar en ciertos errores
      if (error instanceof ResourceNotFoundError ||
          error instanceof InvalidKeyError) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Esperando ${waitTime}ms antes de reintentar...`);
        await sleep(waitTime);
      }
    }
  }
  
  throw lastError;
}

// Uso
const video = await fetchWithRetry(
  () => youTube.videos.getById('VIDEO_ID'),
  3,
  1000
);
```

## Validación de Parámetros

### Antes de la Llamada

```typescript
async function searchWithValidation(query: string, maxResults: number) {
  // Validar query
  if (!query || query.trim().length === 0) {
    throw new ValidationError('La búsqueda no puede estar vacía');
  }
  
  if (query.length > 500) {
    throw new ValidationError('La búsqueda es demasiado larga (máx 500 caracteres)');
  }
  
  // Validar maxResults
  if (maxResults < 1 || maxResults > 50) {
    throw new ValidationError('maxResults debe estar entre 1 y 50');
  }
  
  try {
    return await youTube.search.query(query, maxResults);
  } catch (error) {
    if (error instanceof ValidationError) {
      // Error de validación de YouTube
      console.error('Error de validación:', error.message);
    }
    throw error;
  }
}
```

### Validación de IDs

```typescript
function isValidYouTubeId(id: string): boolean {
  // IDs de YouTube son de 11 caracteres alfanuméricos
  const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  return videoIdRegex.test(id);
}

function isValidChannelId(id: string): boolean {
  // IDs de canal empiezan con UC y tienen 22 caracteres
  return id.startsWith('UC') && id.length === 24;
}

async function getVideoSafe(videoId: string) {
  if (!isValidYouTubeId(videoId)) {
    throw new ValidationError(`ID de video inválido: ${videoId}`);
  }
  
  return youTube.videos.getById(videoId);
}
```

## Errores Comunes y Soluciones

### "API Key not valid"

```typescript
// Verificar que la API key esté configurada
if (!process.env.YOUTUBE_API_KEY) {
  console.error('❌ YOUTUBE_API_KEY no está configurada');
  process.exit(1);
}

const youTube = new YouTube();
youTube.setKey(process.env.YOUTUBE_API_KEY);
```

### "The request did not specify any referer"

```typescript
// Tu API key tiene restricciones de referer
youTube.setReferer('https://tu-dominio.com');
```

### "Daily Limit Exceeded"

```typescript
// Implementar cache o limitador de requests
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora

async function getCachedVideo(videoId: string) {
  const cacheKey = `video_${videoId}`;
  
  // Intentar obtener del cache
  let video = cache.get(cacheKey);
  if (video) {
    console.log('📦 Video obtenido del cache');
    return video;
  }
  
  // Si no está en cache, hacer request
  try {
    video = await youTube.videos.getById(videoId);
    cache.set(cacheKey, video);
    return video;
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      // Intentar obtener del cache incluso si está expirado
      video = cache.get(cacheKey);
      if (video) {
        console.log('⚠️ Cuota excedida, usando cache expirado');
        return video;
      }
    }
    throw error;
  }
}
```

### "Video not found"

```typescript
async function getVideoOrNull(videoId: string) {
  try {
    return await youTube.videos.getById(videoId);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return null;
    }
    throw error;
  }
}

// Uso
const video = await getVideoOrNull('VIDEO_ID');
if (!video) {
  console.log('Video no encontrado o eliminado');
}
```

## Logging de Errores

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'youtube-errors.log' }),
  ],
});

async function operationWithLogging() {
  try {
    return await youTube.videos.getById('VIDEO_ID');
  } catch (error) {
    logger.error('YouTube API Error', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown',
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
```

## Mejores Prácticas

1. **Siempre usa try/catch** con operaciones de API
2. **Maneja errores específicos** para dar mensajes útiles
3. **Implementa reintentos** solo para errores transitorios
4. **Usa cache** para reducir requests y evitar cuota excedida
5. **Valida parámetros** antes de hacer requests
6. **Loguea errores** para debugging
7. **No expongas errores internos** al usuario final

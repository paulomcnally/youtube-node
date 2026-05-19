---
sidebar_position: 4
---

# Subir Videos

Guía completa para subir videos a YouTube.

## Requisitos

Para subir videos necesitas:
1. **OAuth 2.0** configurado (ver [guía de OAuth](./oauth.md))
2. **Scope** `youtube.upload` o `youtube`
3. **Video** en formato soportado

## Formatos Soportados

- `.mov`, `.mpeg4`, `.mp4`, `.avi`, `.wmv`, `.mpegps`, `.flv`, `3gpp`, `.webm`
- DNxHR, ProRes, CineForm, HEVC (h265)

## Subida Básica

### Subir desde Archivo

```typescript
import YouTube from 'youtube-node';

async function uploadVideo() {
  const youTube = new YouTube();
  youTube.setAccessToken('TU_ACCESS_TOKEN');
  
  try {
    const result = await youTube.videos.upload(
      {
        snippet: {
          title: 'Mi Video de Prueba',
          description: 'Este es un video subido usando youtube-node',
          tags: ['nodejs', 'youtube', 'api'],
          categoryId: '27', // Educación
          defaultLanguage: 'es',
        },
        status: {
          privacyStatus: 'private', // public, private, unlisted
          publishAt: '2024-12-25T00:00:00Z', // Programar (opcional)
          license: 'youtube', // youtube o creativeCommon
          embeddable: true,
          publicStatsViewable: true,
        },
      },
      '/ruta/al/video.mp4' // Ruta del archivo
    );
    
    console.log('✅ Video subido exitosamente');
    console.log('ID:', result.items?.[0]?.id);
    console.log('URL:', `https://youtube.com/watch?v=${result.items?.[0]?.id}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error al subir:', error.message);
    throw error;
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
        privacyStatus: 'unlisted',
      },
    },
    videoBuffer
  );
  
  console.log('Video subido:', result.items?.[0]?.id);
}
```

### Subir con Opciones Avanzadas

```typescript
async function uploadWithOptions() {
  const result = await youTube.videos.upload(
    {
      snippet: {
        title: 'Video con Opciones',
        description: 'Descripción detallada del video',
        tags: ['tag1', 'tag2', 'tag3'],
        categoryId: '24', // Entertainment
        defaultLanguage: 'es',
        defaultAudioLanguage: 'es',
      },
      status: {
        privacyStatus: 'private',
        publishAt: new Date(Date.now() + 86400000).toISOString(), // Mañana
        license: 'youtube',
        embeddable: true,
        publicStatsViewable: true,
        selfDeclaredMadeForKids: false,
      },
      contentDetails: {
        duration: 'PT15M30S',
        dimension: '2d',
        definition: 'hd',
        caption: 'true',
        licensedContent: true,
        contentRating: {},
        projection: 'rectangular', // o '360'
      },
      recordingDetails: {
        recordingDate: new Date().toISOString(),
        location: {
          latitude: 40.4168,
          longitude: -3.7038,
          altitude: 0,
        },
        locationDescription: 'Madrid, España',
      },
    },
    '/ruta/al/video.mp4',
    {
      part: ['snippet', 'status', 'contentDetails', 'recordingDetails'],
      notifySubscribers: true, // Notificar a suscriptores
    }
  );
  
  return result;
}
```

## Categorías de Video

| ID | Categoría |
|----|-----------|
| 1 | Film & Animation |
| 2 | Autos & Vehicles |
| 10 | Music |
| 15 | Pets & Animals |
| 17 | Sports |
| 19 | Travel & Events |
| 20 | Gaming |
| 22 | People & Blogs |
| 23 | Comedy |
| 24 | Entertainment |
| 25 | News & Politics |
| 26 | Howto & Style |
| 27 | Education |
| 28 | Science & Technology |
| 29 | Nonprofits & Activism |

## Verificar Estado de Procesamiento

```typescript
async function waitForProcessing(videoId: string, maxAttempts: number = 30) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await youTube.videos.checkUploadStatus(videoId);
    
    const processingStatus = status.items?.[0]?.processingDetails?.processingStatus;
    
    console.log(`Intento ${attempt + 1}: ${processingStatus}`);
    
    switch (processingStatus) {
      case 'succeeded':
        console.log('✅ Video procesado exitosamente');
        return status;
        
      case 'failed':
        const reason = status.items?.[0]?.processingDetails?.processingFailureReason;
        throw new Error(`Procesamiento fallido: ${reason}`);
        
      case 'terminated':
        throw new Error('Procesamiento terminado por YouTube');
        
      case 'processing':
      default:
        // Esperar 5 segundos antes de verificar de nuevo
        await sleep(5000);
        break;
    }
  }
  
  throw new Error('Tiempo de espera agotado');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Uso
const upload = await uploadVideo();
const videoId = upload.items?.[0]?.id!;
await waitForProcessing(videoId);
```

## Subida con Progreso

### Usando Streams (Implementación Avanzada)

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';

async function uploadWithProgress(
  filePath: string,
  onProgress: (progress: number) => void
) {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  let uploadedSize = 0;
  
  const readStream = createReadStream(filePath);
  
  readStream.on('data', (chunk) => {
    uploadedSize += chunk.length;
    const progress = (uploadedSize / fileSize) * 100;
    onProgress(progress);
  });
  
  // La librería actual no soporta streams directamente
  // pero puedes implementarlo usando axios directamente
  // para casos de uso avanzados
}

// Uso básico
await uploadWithProgress('/ruta/al/video.mp4', (progress) => {
  console.log(`Progreso: ${progress.toFixed(2)}%`);
});
```

## Actualizar Video Después de Subir

```typescript
async function updateUploadedVideo(videoId: string) {
  // Actualizar metadatos
  const result = await youTube.videos.update({
    id: videoId,
    snippet: {
      title: 'Título Actualizado',
      description: 'Nueva descripción',
      tags: ['nuevo', 'tag'],
    },
    status: {
      privacyStatus: 'public', // Cambiar a público
    },
  });
  
  return result;
}

// Programar publicación
async function scheduleVideo(videoId: string, publishAt: string) {
  await youTube.videos.update({
    id: videoId,
    status: {
      privacyStatus: 'private',
      publishAt,
    },
  });
}
```

## Establecer Miniatura

```typescript
async function setVideoThumbnail(videoId: string, thumbnailPath: string) {
  const result = await youTube.thumbnails.set(videoId, thumbnailPath);
  
  console.log('Miniatura actualizada');
  console.log('URLs:', result.items?.[0]?.thumbnails);
}

// Subir miniatura desde URL
async function setThumbnailFromUrl(videoId: string, imageUrl: string) {
  // Descargar imagen primero
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  // Guardar temporalmente
  const tempPath = '/tmp/thumbnail.jpg';
  fs.writeFileSync(tempPath, buffer);
  
  // Subir
  await youTube.thumbnails.set(videoId, tempPath);
  
  // Limpiar
  fs.unlinkSync(tempPath);
}
```

## Gestor de Subidas

```typescript
class VideoUploader {
  constructor(private youtube: YouTube) {}
  
  async uploadWithRetry(
    videoResource: any,
    filePath: string,
    options: { retries?: number } = {}
  ) {
    const maxRetries = options.retries || 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📤 Intento ${attempt}/${maxRetries}...`);
        
        const result = await this.youtube.videos.upload(
          videoResource,
          filePath
        );
        
        console.log('✅ Subida exitosa');
        return {
          success: true,
          videoId: result.items?.[0]?.id,
          data: result,
        };
      } catch (error: any) {
        console.error(`❌ Error en intento ${attempt}:`, error.message);
        
        if (attempt === maxRetries) {
          return {
            success: false,
            error: error.message,
          };
        }
        
        // Esperar antes de reintentar
        await this.sleep(5000 * attempt);
      }
    }
  }
  
  async batchUpload(
    videos: Array<{
      resource: any;
      filePath: string;
    }>,
    options: { delayMs?: number } = {}
  ) {
    const results: any[] = [];
    const delay = options.delayMs || 10000; // 10 segundos entre videos
    
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      
      console.log(`\n📹 Subiendo video ${i + 1}/${videos.length}...`);
      
      const result = await this.uploadWithRetry(
        video.resource,
        video.filePath,
        { retries: 3 }
      );
      
      results.push(result);
      
      // Esperar entre subidas para no exceder cuota
      if (i < videos.length - 1) {
        console.log(`⏳ Esperando ${delay/1000}s...`);
        await this.sleep(delay);
      }
    }
    
    return {
      total: videos.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }
  
  async validateVideo(filePath: string) {
    const stats = fs.statSync(filePath);
    
    // Verificar que existe
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'Archivo no encontrado' };
    }
    
    // Verificar tamaño (límite de YouTube: 256GB o 12 horas)
    const maxSize = 256 * 1024 * 1024 * 1024; // 256GB
    if (stats.size > maxSize) {
      return { valid: false, error: 'Archivo demasiado grande (máx 256GB)' };
    }
    
    // Verificar extensión
    const ext = path.extname(filePath).toLowerCase();
    const validExts = ['.mov', '.mpeg4', '.mp4', '.avi', '.wmv', '.mpegps', '.flv', '.3gp', '.webm'];
    
    if (!validExts.includes(ext)) {
      return { valid: false, error: `Formato no soportado: ${ext}` };
    }
    
    return { valid: true, size: stats.size };
  }
  
  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Uso
const uploader = new VideoUploader(youTube);

// Subida simple
const result = await uploader.uploadWithRetry(
  {
    snippet: { title: 'Video', description: 'Desc' },
    status: { privacyStatus: 'private' },
  },
  '/ruta/video.mp4'
);

// Subida en lote
const batchResult = await uploader.batchUpload([
  { resource: { ... }, filePath: '/video1.mp4' },
  { resource: { ... }, filePath: '/video2.mp4' },
]);
```

## Errores Comunes

### "Invalid Credentials"

Verifica que tu access token sea válido y no haya expirado.

### "Upload limit exceeded"

Has excedido el límite diario de subidas. Espera 24 horas.

### "Video too large"

El archivo excede 256GB o 12 horas de duración.

### "Unsupported format"

Convierte el video a un formato soportado (MP4 recomendado).

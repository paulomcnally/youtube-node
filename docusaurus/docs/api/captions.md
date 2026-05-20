---
sidebar_position: 7
---

# Subtítulos (Captions)

Gestiona subtítulos y closed captions de videos.

## Listar Subtítulos

### `captions.list(videoId)`

Obtiene todos los subtítulos disponibles de un video.

```typescript
async function listCaptions() {
  try {
    const captions = await youTube.captions.list('VIDEO_ID');
    
    console.log(`El video tiene ${captions.items?.length} subtítulos:`);
    
    captions.items?.forEach((caption, index) => {
      console.log(`\n${index + 1}. ${caption.snippet?.name}`);
      console.log(`   ID: ${caption.id}`);
      console.log(`   Idioma: ${caption.snippet?.language}`);
      console.log(`   Track Kind: ${caption.snippet?.trackKind}`);
      // standard: subtítulos normales
      // ASR: generados automáticamente por ASR
      // forced: forzados (para idiomas extranjeros)
      console.log(`   Última actualización: ${caption.snippet?.lastUpdated}`);
      console.log(`   Es borrador: ${caption.snippet?.isDraft}`);
      console.log(`   Es CC: ${caption.snippet?.isCC}`); // Closed Captions
      console.log(`   Es fácil lectura: ${caption.snippet?.isEasyReader}`);
      console.log(`   Es para lectores grandes: ${caption.snippet?.isLarge}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Descargar Subtítulos

### `captions.download(captionId, format?, options?)`

Descarga el contenido de un subtítulo.

```typescript
async function downloadCaption() {
  try {
    // Descargar en formato SRT (por defecto)
    const srtContent = await youTube.captions.download('CAPTION_ID');
    console.log('Contenido SRT:');
    console.log(srtContent);
    
    // Descargar en otros formatos
    const sbv = await youTube.captions.download('CAPTION_ID', 'sbv');
    const vtt = await youTube.captions.download('CAPTION_ID', 'vtt');
    
    // Descargar con traducción automática
    const translated = await youTube.captions.download('CAPTION_ID', 'srt', {
      tlang: 'es', // Traducir al español
    });
    
    // Guardar en archivo
    const fs = require('fs');
    fs.writeFileSync('subtitles.srt', srtContent);
    fs.writeFileSync('subtitles_es.srt', translated);
    
    console.log('Subtítulos descargados');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Formatos Soportados

- `srt` - SubRip Subtitle
- `sbv` - SubViewer
- `scc` - Scenarist Closed Caption
- `ttml` - Timed Text Markup Language
- `vtt` - WebVTT

## Subir Subtítulos (Requiere OAuth)

### `captions.upload(videoId, language, captionFile, options?)`

Sube subtítulos a un video.

```typescript
import * as fs from 'fs';

async function uploadCaption() {
  try {
    // Desde archivo
    const result = await youTube.captions.upload(
      'VIDEO_ID',
      'es', // Código de idioma ISO 639-1
      '/ruta/al/subtitulos.srt',
      {
        name: 'Español (Latinoamérica)',
        isDraft: false, // false = publicar inmediatamente
        autoSync: false, // true = sincronizar automáticamente con el audio
      }
    );
    
    console.log('Subtítulos subidos exitosamente');
    console.log('ID:', result.items?.[0]?.id);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Subir desde Buffer

```typescript
async function uploadCaptionFromBuffer() {
  try {
    const captionContent = fs.readFileSync('/ruta/al/subtitulos.srt');
    
    const result = await youTube.captions.upload(
      'VIDEO_ID',
      'en',
      captionContent,
      {
        name: 'English CC',
        isDraft: true, // Guardar como borrador
      }
    );
    
    console.log('Subtítulos guardados como borrador');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Actualizar Subtítulos (Requiere OAuth)

### `captions.update(captionId, captionFile, options?)`

Actualiza el contenido de un subtítulo existente.

```typescript
async function updateCaption() {
  try {
    const result = await youTube.captions.update(
      'CAPTION_ID',
      '/ruta/al/subtitulos_actualizados.srt',
      {
        name: 'Nuevo nombre',
        isDraft: false,
      }
    );
    
    console.log('Subtítulos actualizados');
    console.log('Última actualización:', result.items?.[0]?.snippet?.lastUpdated);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Cambiar Estado de Borrador (Requiere OAuth)

### `captions.setDraftStatus(captionId, isDraft)`

Cambia el estado de borrador de un subtítulo.

```typescript
async function publishCaption() {
  try {
    // Publicar (quitar estado borrador)
    await youTube.captions.setDraftStatus('CAPTION_ID', false);
    console.log('Subtítulos publicados');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function unpublishCaption() {
  try {
    // Volver a borrador
    await youTube.captions.setDraftStatus('CAPTION_ID', true);
    console.log('Subtítulos movidos a borrador');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Eliminar Subtítulos (Requiere OAuth)

### `captions.delete(captionId)`

Elimina un subtítulo.

```typescript
async function deleteCaption() {
  try {
    await youTube.captions.delete('CAPTION_ID');
    console.log('Subtítulos eliminados exitosamente');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Información de Respuesta

### Estructura de un Caption

```typescript
interface Caption {
  kind: 'youtube#caption';
  etag: string;
  id: string;
  snippet: {
    videoId: string;
    lastUpdated: string;
    trackKind: 'standard' | 'ASR' | 'forced';
    language: string;
    name: string;
    audioTrackType: 'unknown' | 'primary' | 'commentary' | 'descriptive';
    isCC: boolean;
    isLarge: boolean;
    isEasyReader: boolean;
    isDraft: boolean;
    isAutoSynced: boolean;
    status: 'serving' | 'syncing' | 'failed';
    failureReason?: 'processingFailed' | 'unknownFormat' | 'unsupportedFormat';
  };
}
```

## Ejemplos Completos

### Gestor de Subtítulos

```typescript
class CaptionManager {
  constructor(private youtube: YouTube) {}
  
  // Obtener todos los subtítulos de un video con detalles
  async getVideoCaptions(videoId: string) {
    const captions = await this.youtube.captions.list(videoId);
    
    return captions.items?.map(caption => ({
      id: caption.id,
      videoId: caption.snippet?.videoId,
      name: caption.snippet?.name,
      language: caption.snippet?.language,
      kind: caption.snippet?.trackKind,
      isDraft: caption.snippet?.isDraft,
      isAutoGenerated: caption.snippet?.trackKind === 'ASR',
      isCC: caption.snippet?.isCC,
      lastUpdated: caption.snippet?.lastUpdated,
      status: caption.snippet?.status,
    })) || [];
  }
  
  // Buscar subtítulos por idioma
  async findCaptionsByLanguage(videoId: string, language: string) {
    const captions = await this.getVideoCaptions(videoId);
    return captions.filter(c => c.language === language);
  }
  
  // Verificar si tiene subtítulos en un idioma
  async hasCaptions(videoId: string, language: string) {
    const captions = await this.findCaptionsByLanguage(videoId, language);
    return captions.length > 0;
  }
  
  // Descargar todos los subtítulos de un video
  async downloadAllCaptions(videoId: string, outputDir: string) {
    const captions = await this.youtube.captions.list(videoId);
    const downloaded: string[] = [];
    
    for (const caption of captions.items || []) {
      try {
        const content = await this.youtube.captions.download(
          caption.id!,
          'srt'
        );
        
        const filename = `${videoId}_${caption.snippet?.language}.srt`;
        const filepath = require('path').join(outputDir, filename);
        
        require('fs').writeFileSync(filepath, content);
        downloaded.push(filename);
      } catch (err) {
        console.error(`Error descargando ${caption.id}:`, err);
      }
    }
    
    return downloaded;
  }
  
  // Clonar subtítulos a otro video
  async cloneCaptions(sourceVideoId: string, targetVideoId: string) {
    const sourceCaptions = await this.youtube.captions.list(sourceVideoId);
    const cloned: any[] = [];
    
    for (const caption of sourceCaptions.items || []) {
      try {
        // Descargar del video fuente
        const content = await this.youtube.captions.download(caption.id!, 'srt');
        
        // Subir al video destino
        const result = await this.youtube.captions.upload(
          targetVideoId,
          caption.snippet?.language!,
          Buffer.from(content),
          {
            name: caption.snippet?.name,
            isDraft: caption.snippet?.isDraft,
          }
        );
        
        cloned.push({
          originalId: caption.id,
          newId: result.items?.[0]?.id,
          language: caption.snippet?.language,
        });
      } catch (err: any) {
        cloned.push({
          originalId: caption.id,
          language: caption.snippet?.language,
          error: err.message,
        });
      }
    }
    
    return cloned;
  }
}

// Uso
const manager = new CaptionManager(youTube);
const captions = await manager.getVideoCaptions('VIDEO_ID');
const hasSpanish = await manager.hasCaptions('VIDEO_ID', 'es');
```

### Descargar Subtítulos con Traducción

```typescript
async function downloadWithTranslations(
  videoId: string,
  targetLanguages: string[]
) {
  try {
    // Obtener subtítulos disponibles
    const captions = await youTube.captions.list(videoId);
    
    const results: Record<string, any> = {};
    
    // Encontrar subtítulo base (preferiblemente en inglés o español)
    const baseCaption = captions.items?.find(
      c => c.snippet?.language === 'en' || c.snippet?.language === 'es'
    );
    
    if (!baseCaption) {
      throw new Error('No se encontraron subtítulos base');
    }
    
    // Descargar en cada idioma objetivo
    for (const lang of targetLanguages) {
      try {
        const content = await youTube.captions.download(
          baseCaption.id!,
          'srt',
          { tlang: lang }
        );
        
        results[lang] = {
          success: true,
          content,
          filename: `${videoId}_${lang}.srt`,
        };
      } catch (err: any) {
        results[lang] = {
          success: false,
          error: err.message,
        };
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Uso
const translations = await downloadWithTranslations('VIDEO_ID', [
  'es', 'fr', 'de', 'pt', 'it'
]);
```

### Convertir Subtítulos

```typescript
async function convertCaptions(
  captionId: string,
  targetFormat: 'srt' | 'vtt' | 'json'
) {
  try {
    // Descargar en formato SRT
    const srtContent = await youTube.captions.download(captionId, 'srt');
    
    switch (targetFormat) {
      case 'srt':
        return { format: 'srt', content: srtContent };
        
      case 'vtt':
        // Convertir SRT a VTT
        const vttContent = 'WEBVTT\n\n' + srtContent
          .replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4')
          .replace(/\{\{[^}]+\}\}/g, ''); // Remover estilos SRT
        return { format: 'vtt', content: vttContent };
        
      case 'json':
        // Parsear SRT a JSON
        const jsonContent = parseSRTToJSON(srtContent);
        return { format: 'json', content: JSON.stringify(jsonContent, null, 2) };
        
      default:
        throw new Error(`Formato no soportado: ${targetFormat}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function parseSRTToJSON(srtContent: string) {
  const entries: any[] = [];
  const blocks = srtContent.trim().split('\n\n');
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0]);
      const timeMatch = lines[1].match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/
      );
      
      if (timeMatch) {
        const text = lines.slice(2).join(' ');
        entries.push({
          index,
          start: {
            hours: parseInt(timeMatch[1]),
            minutes: parseInt(timeMatch[2]),
            seconds: parseInt(timeMatch[3]),
            milliseconds: parseInt(timeMatch[4]),
          },
          end: {
            hours: parseInt(timeMatch[5]),
            minutes: parseInt(timeMatch[6]),
            seconds: parseInt(timeMatch[7]),
            milliseconds: parseInt(timeMatch[8]),
          },
          text: text.replace(/<[^>]+>/g, ''), // Remover tags HTML
        });
      }
    }
  }
  
  return entries;
}
```

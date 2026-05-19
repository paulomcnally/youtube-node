/**
 * Ejemplo de Captions CRUD (Subtítulos)
 * Requiere OAuth
 * 
 * Issue #86
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');

const youtube = new YouTube();

// NOTA: Para operaciones OAuth, necesitas configurar el token de acceso
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const VIDEO_ID = 'YOUR_VIDEO_ID';

// Listar subtítulos de un video
async function listCaptionsExample() {
  try {
    const result = await youtube.captions.list(VIDEO_ID);
    console.log('Subtítulos disponibles:', result.items);
    
    if (result.items) {
      result.items.forEach(caption => {
        console.log(`- ${caption.id}: ${caption.snippet?.name} (${caption.snippet?.language})`);
      });
    }
  } catch (error) {
    console.error('Error al listar subtítulos:', error);
  }
}

// Subir subtítulo desde archivo
async function uploadCaptionExample() {
  try {
    const captionPath = './subtitulos.srt';
    
    const result = await youtube.captions.upload(
      VIDEO_ID,
      'es', // Código de idioma español
      captionPath,
      {
        name: 'Español',
        isDraft: false,
        isAutoSynced: false,
      }
    );
    
    console.log('Subtítulo subido exitosamente!');
    console.log('Caption ID:', result.id);
  } catch (error) {
    console.error('Error al subir subtítulo:', error);
  }
}

// Subir subtítulo desde Buffer
async function uploadFromBufferExample() {
  try {
    const captionBuffer = fs.readFileSync('./subtitulos.srt');
    
    const result = await youtube.captions.upload(
      VIDEO_ID,
      'en', // Código de idioma inglés
      captionBuffer,
      {
        name: 'English',
        isDraft: false,
      }
    );
    
    console.log('Subtítulo subido:', result.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Actualizar subtítulo existente
async function updateCaptionExample() {
  const captionId = 'CAPTION_ID_FROM_UPLOAD';
  
  try {
    const result = await youtube.captions.update(
      captionId,
      './nuevos-subtitulos.srt',
      {
        isDraft: false,
      }
    );
    
    console.log('Subtítulo actualizado:', result);
  } catch (error) {
    console.error('Error al actualizar subtítulo:', error);
  }
}

// Eliminar subtítulo
async function deleteCaptionExample() {
  const captionId = 'CAPTION_ID_TO_DELETE';
  
  try {
    await youtube.captions.delete(captionId);
    console.log('Subtítulo eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar subtítulo:', error);
  }
}

// Cambiar estado de borrador
async function setDraftStatusExample() {
  const captionId = 'CAPTION_ID';
  
  try {
    await youtube.captions.setDraftStatus(captionId, true); // true = borrador, false = publicado
    console.log('Estado actualizado');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Descargar subtítulo
async function downloadCaptionExample() {
  const captionId = 'CAPTION_ID';
  
  try {
    const content = await youtube.captions.download(captionId, 'srt');
    fs.writeFileSync('./descargado.srt', content);
    console.log('Subtítulo descargado');
  } catch (error) {
    console.error('Error al descargar:', error);
  }
}

// Ejemplo con callbacks (legacy)
function uploadCaptionCallbackExample() {
  youtube.captions.upload(
    VIDEO_ID,
    'es',
    './subtitulos.srt',
    {
      name: 'Español',
      isDraft: false,
    },
    (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      console.log('Subtítulo subido:', result);
    }
  );
}

// Ejecutar ejemplos
// listCaptionsExample();
// uploadCaptionExample();
// uploadFromBufferExample();
// updateCaptionExample();
// deleteCaptionExample();
// setDraftStatusExample();
// downloadCaptionExample();

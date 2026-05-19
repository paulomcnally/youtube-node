/**
 * Ejemplo de Videos Upload (Subir videos)
 * Requiere OAuth + Upload scope
 * 
 * Issue #85
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');

const youtube = new YouTube();

// NOTA: Para operaciones OAuth, necesitas configurar el token de acceso
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

// Subir video desde archivo
async function uploadVideoExample() {
  try {
    const videoPath = './mi-video.mp4';
    
    const result = await youtube.videos.upload(
      {
        snippet: {
          title: 'Mi Video de Prueba',
          description: 'Este es un video subido usando youtube-node',
          tags: ['prueba', 'demo', 'youtube'],
          categoryId: '22', // People & Blogs
          defaultLanguage: 'es',
        },
        status: {
          privacyStatus: 'private', // public | private | unlisted
          embeddable: true,
          license: 'youtube', // youtube | creativeCommon
          publicStatsViewable: true,
        },
      },
      videoPath,
      {
        notifySubscribers: false,
      }
    );
    
    console.log('Video subido exitosamente!');
    console.log('Video ID:', result.id);
    console.log('URL:', `https://youtube.com/watch?v=${result.id}`);
  } catch (error) {
    console.error('Error al subir video:', error);
  }
}

// Subir video desde Buffer
async function uploadFromBufferExample() {
  try {
    const videoBuffer = fs.readFileSync('./mi-video.mp4');
    
    const result = await youtube.videos.upload(
      {
        snippet: {
          title: 'Video desde Buffer',
          description: 'Video subido desde un buffer de memoria',
          categoryId: '22',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      videoBuffer
    );
    
    console.log('Video subido:', result.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Verificar estado de procesamiento del video
async function checkUploadStatusExample() {
  const videoId = 'VIDEO_ID_FROM_UPLOAD';
  
  try {
    const result = await youtube.videos.checkUploadStatus(videoId);
    console.log('Estado del video:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejemplo con callbacks (legacy)
function uploadVideoCallbackExample() {
  youtube.videos.upload(
    {
      snippet: {
        title: 'Video con Callback',
        description: 'Descripción del video',
      },
      status: {
        privacyStatus: 'private',
      },
    },
    './mi-video.mp4',
    {},
    (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      console.log('Video subido:', result);
    }
  );
}

// Ejecutar ejemplos
// uploadVideoExample();
// uploadFromBufferExample();
// checkUploadStatusExample();

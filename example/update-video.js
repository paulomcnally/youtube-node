/**
 * Ejemplo: Actualizar videos (requiere OAuth)
 *
 * Este ejemplo muestra cómo actualizar metadatos de videos usando OAuth.
 *
 * Nota: Para usar estos métodos necesitas un token de OAuth con permisos
 * de escritura en YouTube.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// Nota: Para operaciones de escritura se requiere OAuth, no solo API key
// youtube.setKey('YOUR_API_KEY');

console.log('=== Ejemplo: Actualizar Videos ===\n');

// Ejemplo 1: Actualizar video completo
const videoResource = {
  id: 'VIDEO_ID_HERE',
  snippet: {
    title: 'Nuevo Título del Video',
    description: 'Nueva descripción del video\n\nCon múltiples líneas.',
    tags: ['nodejs', 'youtube', 'api', 'tutorial'],
    categoryId: '27', // Education
  },
  status: {
    privacyStatus: 'public',
    embeddable: true,
    publicStatsViewable: true,
  },
};

console.log('Ejemplo de videoResource para actualizar:');
console.log(JSON.stringify(videoResource, null, 2));

// Uso con async/await
async function updateVideoExample() {
  try {
    // const result = await youtube.videos.update(videoResource);
    // console.log('Video actualizado:', result);

    // Usando el helper para solo cambiar el estado
    // const statusResult = await youtube.videos.updateStatus('VIDEO_ID', 'public');
    // console.log('Estado actualizado:', statusResult);

    console.log('\nPara usar estos métodos:');
    console.log('1. Obtén un token OAuth con permisos de escritura');
    console.log('2. Usa youtube.videos.update(videoResource)');
    console.log('3. O usa youtube.videos.updateStatus(videoId, status)');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uso con callbacks
function updateVideoCallbackExample() {
  // youtube.videos.update(videoResource, (err, result) => {
  //   if (err) {
  //     console.error('Error:', err.message);
  //     return;
  //   }
  //   console.log('Video actualizado:', result);
  // });

  // Usando el helper para solo cambiar el estado
  // youtube.videos.updateStatus('VIDEO_ID', 'private', (err, result) => {
  //   if (err) {
  //     console.error('Error:', err.message);
  //     return;
  //   }
  //   console.log('Estado actualizado:', result);
  // });
}

updateVideoExample();

console.log('\n=== Estados de privacidad posibles ===');
console.log('- public: Video público, visible para todos');
console.log('- private: Video privado, solo visible para ti');
console.log('- unlisted: Video no listado, visible solo con el enlace');

console.log('\n=== Referencia ===');
console.log('Documentación: https://developers.google.com/youtube/v3/docs/videos/update');

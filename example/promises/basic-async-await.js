/**
 * Ejemplo: Uso básico con async/await
 *
 * Este ejemplo muestra cómo usar la API con async/await
 * sin necesidad de callbacks.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Video ID para el ejemplo
const VIDEO_ID = 'IkmHStAWXis';

async function main() {
  try {
    console.log('Obteniendo información del video...');

    // Sin callback = retorna Promise
    const video = await youtube.videos.getById(VIDEO_ID);

    console.log('Título:', video.items?.[0]?.snippet?.title);
    console.log('Descripción:', video.items?.[0]?.snippet?.description);
    console.log('Vistas:', video.items?.[0]?.statistics?.viewCount);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

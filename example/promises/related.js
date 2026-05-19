/**
 * Ejemplo: Videos relacionados con async/await
 *
 * Este ejemplo muestra cómo obtener videos relacionados
 * usando Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Video ID de ejemplo (un video popular de programación)
const VIDEO_ID = 'IkmHStAWXis';

async function getRelatedVideos() {
  try {
    console.log('Obteniendo videos relacionados...\n');

    const related = await youtube.search.related(VIDEO_ID, 5);

    console.log(`Videos relacionados:\n`);

    related.items?.forEach((item, index) => {
      const videoId = (item.id as { videoId?: string })?.videoId;
      const title = item.snippet?.title;
      console.log(`${index + 1}. ${title}`);
      console.log(`   ID: ${videoId}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getRelatedVideos();

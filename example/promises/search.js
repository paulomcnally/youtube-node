/**
 * Ejemplo: Búsqueda con async/await
 *
 * Este ejemplo muestra cómo realizar búsquedas
 * usando Promises y async/await.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

async function searchVideos() {
  try {
    console.log('Buscando videos...\n');

    // Búsqueda simple
    const results = await youtube.search.query('nodejs tutorial', 5);

    console.log(`Encontrados ${results.pageInfo?.totalResults} resultados:\n`);

    results.items?.forEach((item, index) => {
      const title = item.snippet?.title;
      const channel = item.snippet?.channelTitle;
      console.log(`${index + 1}. ${title}`);
      console.log(`   Canal: ${channel}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function searchWithFilters() {
  try {
    console.log('\nBuscando videos HD...\n');

    // Búsqueda con parámetros adicionales
    const results = await youtube.search.query('javascript', 3, {
      type: 'video',
      videoDefinition: 'high',
    });

    results.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  await searchVideos();
  await searchWithFilters();
}

main();

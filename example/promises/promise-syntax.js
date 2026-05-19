/**
 * Ejemplo: Uso con .then()/.catch()
 *
 * Este ejemplo muestra cómo usar la API con la sintaxis
 * de Promises tradicional (.then()/.catch()).
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

const VIDEO_ID = 'IkmHStAWXis';

console.log('Ejemplo con .then()/.catch()\n');
console.log('============================\n');

// Obtener información de un video usando .then()
youtube.videos.getById(VIDEO_ID)
  .then((video) => {
    console.log('Video encontrado:');
    console.log('Título:', video.items?.[0]?.snippet?.title);
    console.log('Descripción:', video.items?.[0]?.snippet?.description?.substring(0, 100) + '...');
    console.log('');

    // Encadenar otra búsqueda
    return youtube.search.related(VIDEO_ID, 3);
  })
  .then((related) => {
    console.log('Videos relacionados:');
    related.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
    console.log('');

    // Buscar videos
    return youtube.search.query('javascript tutorial', 3);
  })
  .then((searchResults) => {
    console.log('Resultados de búsqueda:');
    searchResults.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

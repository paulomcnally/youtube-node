/**
 * Ejemplo: Paginación y Búsqueda Avanzada
 *
 * Este ejemplo muestra las mejoras de paginación y búsqueda implementadas
 * en la versión 2.0 del cliente de YouTube API.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Ejemplo: Paginación y Búsqueda Avanzada ===\n');

// Ejemplo 1: getAllResults - Obtener todos los resultados automáticamente
async function getAllResultsExample() {
  try {
    console.log('=== 1. getAllResults - Obtener todas las páginas ===\n');
    console.log('Este método obtiene todas las páginas de resultados automáticamente.');
    console.log('');

    // Descomenta para probar (puede hacer muchas llamadas a la API)
    // const allResults = await youtube.getAllResults('search', {
    //   q: 'nodejs tutorial',
    //   maxResults: 50,
    // });
    // console.log(`Total de items: ${allResults.length}`);

    console.log('Ejemplo de uso:');
    console.log(`
const allResults = await youtube.getAllResults('search', {
  q: 'nodejs tutorial',
  maxResults: 50,
});
console.log('Total de items:', allResults.length);
    `);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejemplo 2: paginate - Async iterator
async function paginateExample() {
  try {
    console.log('\n=== 2. paginate - Async Iterator ===\n');
    console.log('Itera sobre las páginas de resultados de forma eficiente.');
    console.log('');

    // Descomenta para probar
    // let pageCount = 0;
    // for await (const page of youtube.paginate('search', {
    //   q: 'javascript',
    //   maxResults: 10,
    // })) {
    //   pageCount++;
    //   console.log(`Página ${pageCount}: ${page.items?.length} items`);
    //   if (pageCount >= 3) break; // Limitar a 3 páginas
    // }

    console.log('Ejemplo de uso:');
    console.log(`
for await (const page of youtube.paginate('search', {
  q: 'javascript',
  maxResults: 10,
})) {
  console.log('Items en página:', page.items?.length);
  // Procesar items...
}
    `);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejemplo 3: Búsqueda avanzada con filtros
async function advancedSearchExample() {
  try {
    console.log('\n=== 3. Búsqueda avanzada con filtros ===\n');

    const query = 'programming tutorial';

    console.log(`Buscando: "${query}"`);
    console.log('');

    // Búsqueda con filtros avanzados
    const result = await youtube.searchWithFilters(query, 10, {
      type: 'video',                    // Solo videos
      videoDuration: 'medium',          // 4-20 minutos
      videoDefinition: 'high',          // HD
      videoLicense: 'creativeCommon',   // Licencia Creative Commons
      order: 'date',                    // Más recientes primero
      publishedAfter: '2023-01-01T00:00:00Z',
      regionCode: 'US',
      relevanceLanguage: 'en',
    });

    console.log(`Resultados: ${result.items?.length || 0}`);

    if (result.items) {
      result.items.forEach((item, index) => {
        const videoId = item.id?.videoId || item.id;
        console.log(`\n[${index + 1}] ${item.snippet?.title}`);
        console.log(`    ID: ${videoId}`);
        console.log(`    Canal: ${item.snippet?.channelTitle}`);
        console.log(`    Publicado: ${item.snippet?.publishedAt}`);
      });
    }

  } catch (error) {
    console.error('Error en búsqueda:', error.message);
  }
}

// Mostrar filtros disponibles
console.log('=== Filtros de búsqueda disponibles ===\n');

console.log('type:');
console.log('  - video: Solo videos');
console.log('  - channel: Solo canales');
console.log('  - playlist: Solo playlists');
console.log('');

console.log('videoDuration:');
console.log('  - short: Menos de 4 minutos');
console.log('  - medium: 4-20 minutos');
console.log('  - long: Más de 20 minutos');
console.log('');

console.log('videoDefinition:');
console.log('  - high: HD');
console.log('  - standard: SD');
console.log('');

console.log('videoLicense:');
console.log('  - creativeCommon: Creative Commons');
console.log('  - youtube: Licencia estándar de YouTube');
console.log('');

console.log('order:');
console.log('  - date: Por fecha (más reciente)');
console.log('  - rating: Por calificación');
console.log('  - relevance: Por relevancia');
console.log('  - title: Por título');
console.log('  - videoCount: Por número de videos (canales)');
console.log('  - viewCount: Por número de vistas');
console.log('');

console.log('safeSearch:');
console.log('  - none: Sin filtro');
console.log('  - moderate: Moderado');
console.log('  - strict: Estricto');
console.log('');

// Ejecutar ejemplos
getAllResultsExample();
setTimeout(() => paginateExample(), 1000);
setTimeout(() => advancedSearchExample(), 2000);

console.log('=== Endpoints soportados para paginación ===');
console.log('- search: Búsqueda de videos/canales/playlists');
console.log('- videos: Lista de videos');
console.log('- channels: Lista de canales');
console.log('- playlists: Lista de playlists');
console.log('- playlistItems: Items de una playlist');
console.log('');

console.log('=== Referencia ===');
console.log('Documentación: https://developers.google.com/youtube/v3/docs/search');

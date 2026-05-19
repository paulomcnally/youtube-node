/**
 * Ejemplo: Comparación Callbacks vs Promises
 *
 * Este ejemplo muestra la diferencia entre usar callbacks
 * y Promises/async-await.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

const QUERY = 'nodejs tutorial';

console.log('Comparación: Callbacks vs Promises\n');
console.log('===================================\n');

// ============================================
// FORMA ANTIGUA: Callbacks
// ============================================
console.log('1. CON CALLBACKS (forma antigua):');
console.log('-----------------------------------');

youtube.search.query(QUERY, 2, (err, results) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }

  console.log('Resultados:', results.items?.length);

  // Callback hell si queremos hacer más operaciones
  const videoId = (results.items?.[0]?.id as { videoId?: string })?.videoId;
  if (videoId) {
    youtube.videos.getById(videoId, (err2, video) => {
      if (err2) {
        console.error('Error:', err2.message);
        return;
      }

      console.log('Título del primer video:', video.items?.[0]?.snippet?.title);
      console.log('');

      // Continuar con más callbacks...
      showPromiseExample();
    });
  }
});

// ============================================
// FORMA NUEVA: Promises con async/await
// ============================================
function showPromiseExample() {
  console.log('2. CON PROMISES (forma nueva):');
  console.log('-------------------------------');

  async function searchAndGetDetails() {
    try {
      // Código más limpio y legible
      const results = await youtube.search.query(QUERY, 2);
      console.log('Resultados:', results.items?.length);

      const videoId = (results.items?.[0]?.id as { videoId?: string })?.videoId;
      if (videoId) {
        const video = await youtube.videos.getById(videoId);
        console.log('Título del primer video:', video.items?.[0]?.snippet?.title);
      }

      // Fácil encadenar más operaciones
      const related = await youtube.search.related(videoId!, 2);
      console.log('Videos relacionados:', related.items?.length);

      console.log('');
      console.log('¡Las Promises hacen el código más limpio!');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }

  searchAndGetDetails();
}

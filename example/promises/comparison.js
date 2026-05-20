/**
 * Example: Callbacks vs Promises Comparison
 *
 * This example shows the difference between using callbacks
 * and Promises/async-await.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

const QUERY = 'nodejs tutorial';

console.log('Comparison: Callbacks vs Promises\n');
console.log('===================================\n');

// ============================================
// OLD WAY: Callbacks
// ============================================
console.log('1. WITH CALLBACKS (old way):');
console.log('-----------------------------------');

youtube.search.query(QUERY, 2, (err, results) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }

  console.log('Resultados:', results.items?.length);

  // Callback hell if we want to do more operations
  const videoId = (results.items?.[0]?.id as { videoId?: string })?.videoId;
  if (videoId) {
    youtube.videos.getById(videoId, (err2, video) => {
      if (err2) {
        console.error('Error:', err2.message);
        return;
      }

      console.log('Title of first video:', video.items?.[0]?.snippet?.title);
      console.log('');

      // Continue with more callbacks...
      showPromiseExample();
    });
  }
});

// ============================================
// NEW WAY: Promises with async/await
// ============================================
function showPromiseExample() {
  console.log('2. WITH PROMISES (new way):');
  console.log('-------------------------------');

  async function searchAndGetDetails() {
    try {
      // Cleaner and more readable code
      const results = await youtube.search.query(QUERY, 2);
      console.log('Resultados:', results.items?.length);

      const videoId = (results.items?.[0]?.id as { videoId?: string })?.videoId;
      if (videoId) {
        const video = await youtube.videos.getById(videoId);
        console.log('Title of first video:', video.items?.[0]?.snippet?.title);
      }

      // Easy to chain more operations
      const related = await youtube.search.related(videoId!, 2);
      console.log('Related videos:', related.items?.length);

      console.log('');
      console.log('Promises make the code cleaner!');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }

  searchAndGetDetails();
}

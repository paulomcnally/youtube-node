/**
 * Example: Usage with .then()/.catch()
 *
 * This example shows how to use the API with traditional
 * Promise syntax (.then()/.catch()).
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

const VIDEO_ID = 'IkmHStAWXis';

console.log('Example with .then()/.catch()\n');
console.log('============================\n');

// Get video information using .then()
youtube.videos.getById(VIDEO_ID)
  .then((video) => {
    console.log('Video found:');
    console.log('Title:', video.items?.[0]?.snippet?.title);
    console.log('Description:', video.items?.[0]?.snippet?.description?.substring(0, 100) + '...');
    console.log('');

    // Chain another search
    return youtube.search.related(VIDEO_ID, 3);
  })
  .then((related) => {
    console.log('Related videos:');
    related.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
    console.log('');

    // Search videos
    return youtube.search.query('javascript tutorial', 3);
  })
  .then((searchResults) => {
    console.log('Search results:');
    searchResults.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

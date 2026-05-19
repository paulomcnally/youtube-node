/**
 * Example: Basic usage with async/await
 *
 * This example shows how to use the API with async/await
 * without callbacks.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Video ID for the example
const VIDEO_ID = 'IkmHStAWXis';

async function main() {
  try {
    console.log('Getting video information...');

    // No callback = returns Promise
    const video = await youtube.videos.getById(VIDEO_ID);

    console.log('Title:', video.items?.[0]?.snippet?.title);
    console.log('Description:', video.items?.[0]?.snippet?.description);
    console.log('Views:', video.items?.[0]?.statistics?.viewCount);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

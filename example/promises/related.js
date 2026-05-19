/**
 * Example: Related videos with async/await
 *
 * This example shows how to get related videos
 * using Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Example video ID (a popular programming video)
const VIDEO_ID = 'IkmHStAWXis';

async function getRelatedVideos() {
  try {
    console.log('Getting related videos...\n');

    const related = await youtube.search.related(VIDEO_ID, 5);

    console.log(`Related videos:\n`);

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

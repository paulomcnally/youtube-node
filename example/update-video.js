/**
 * Example: Update videos (requires OAuth)
 *
 * This example shows how to update video metadata using OAuth.
 *
 * Note: To use these methods you need an OAuth token with write
 * permissions on YouTube.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// Note: For write operations OAuth is required, not just API key
// youtube.setKey('YOUR_API_KEY');

console.log('=== Example: Update Videos ===\n');

// Example 1: Update full video
const videoResource = {
  id: 'VIDEO_ID_HERE',
  snippet: {
    title: 'New Video Title',
    description: 'New video description\n\nWith multiple lines.',
    tags: ['nodejs', 'youtube', 'api', 'tutorial'],
    categoryId: '27', // Education
  },
  status: {
    privacyStatus: 'public',
    embeddable: true,
    publicStatsViewable: true,
  },
};

console.log('Example videoResource to update:');
console.log(JSON.stringify(videoResource, null, 2));

// Usage with async/await
async function updateVideoExample() {
  try {
    // const result = await youtube.videos.update(videoResource);
    // console.log('Video updated:', result);

    // Using the helper to only change the status
    // const statusResult = await youtube.videos.updateStatus('VIDEO_ID', 'public');
    // console.log('Status updated:', statusResult);

    console.log('\nTo use these methods:');
    console.log('1. Get an OAuth token with write permissions');
    console.log('2. Use youtube.videos.update(videoResource)');
    console.log('3. Or use youtube.videos.updateStatus(videoId, status)');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Usage with callbacks
function updateVideoCallbackExample() {
  // youtube.videos.update(videoResource, (err, result) => {
  //   if (err) {
  //     console.error('Error:', err.message);
  //     return;
  //   }
  //   console.log('Video updated:', result);
  // });

  // Using the helper to only change the status
  // youtube.videos.updateStatus('VIDEO_ID', 'private', (err, result) => {
  //   if (err) {
  //     console.error('Error:', err.message);
  //     return;
  //   }
  //   console.log('Status updated:', result);
  // });
}

updateVideoExample();

console.log('\n=== Possible privacy states ===');
console.log('- public: Public video, visible to everyone');
console.log('- private: Private video, only visible to you');
console.log('- unlisted: Unlisted video, visible only with link');

console.log('\n=== Reference ===');
console.log('Documentation: https://developers.google.com/youtube/v3/docs/videos/update');

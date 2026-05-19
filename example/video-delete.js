/**
 * Example: Videos Delete
 * Requires OAuth
 *
 * Issue #87
 *
 * ⚠️ WARNING: Delete operations are PERMANENT
 * ⚠️ Only the video owner can delete it
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTE: For OAuth operations, you need to configure the access token
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const VIDEO_ID_TO_DELETE = 'VIDEO_ID_HERE';

// Delete a single video
async function deleteVideoExample() {
  try {
    // ⚠️ WARNING: This operation is PERMANENT
    console.log('Deleting video...');

    await youtube.videos.delete(VIDEO_ID_TO_DELETE);

    console.log('Video deleted successfully');
  } catch (error) {
    console.error('Error deleting video:', error);
  }
}

// Delete multiple videos
async function deleteMultipleVideosExample() {
  const videoIds = ['VIDEO_ID_1', 'VIDEO_ID_2', 'VIDEO_ID_3'];

  try {
    // ⚠️ WARNING: This operation is PERMANENT
    console.log('Deleting videos:', videoIds);

    const results = await youtube.videos.deleteMany(videoIds);

    console.log('Videos deleted:', results.length);
  } catch (error) {
    console.error('Error deleting videos:', error);
  }
}

// Example with callbacks (legacy)
function deleteVideoCallbackExample() {
  // ⚠️ WARNING: This operation is PERMANENT
  youtube.videos.delete(VIDEO_ID_TO_DELETE, (err) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Video deleted successfully');
  });
}

// Example with confirmation before deleting
async function deleteWithConfirmationExample() {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    const answer = await question(
      `Are you sure you want to delete video ${VIDEO_ID_TO_DELETE}? (yes/no): `
    );

    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      await youtube.videos.delete(VIDEO_ID_TO_DELETE);
      console.log('Video deleted successfully');
    } else {
      console.log('Operation cancelled');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

// Run examples
// deleteVideoExample();
// deleteMultipleVideosExample();
// deleteWithConfirmationExample();

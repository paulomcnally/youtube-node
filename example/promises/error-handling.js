/**
 * Example: Error handling with Promises
 *
 * This example shows how to handle errors when using Promises.
 */

const YouTube = require('../../dist/index').default;

async function errorHandlingExample() {
  const youtube = new YouTube();

  // We don't set the API key to trigger an error

  try {
    await youtube.videos.getById('some-video-id');
  } catch (error: any) {
    console.log('Error caught correctly:');
    console.log('Type:', error.name);
    console.log('Message:', error.message);
    console.log('Is YouTube error:', error.isYouTubeError);
    console.log('');
  }
}

async function apiErrorExample() {
  const youtube = new YouTube();
  youtube.setKey('INVALID_API_KEY');

  try {
    await youtube.videos.getById('some-video-id');
  } catch (error: any) {
    console.log('API Error:');
    console.log('Type:', error.name);
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Status:', error.status);
    console.log('');
  }
}

async function validationErrorExample() {
  const youtube = new YouTube();
  youtube.setKey('YOUR_API_KEY');

  try {
    // Try to get a video with invalid or empty ID
    await youtube.videos.getById('');
  } catch (error: any) {
    console.log('Validation or response error:');
    console.log('Type:', error.name);
    console.log('Message:', error.message);
  }
}

async function main() {
  console.log('Error handling examples\n');
  console.log('=============================\n');

  await errorHandlingExample();
  await apiErrorExample();
  await validationErrorExample();
}

main();

/**
 * Example: Playlist information with async/await
 *
 * This example shows how to get playlist information
 * and its items using Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Example playlist ID
const PLAYLIST_ID = 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F';

async function getPlaylistInfo() {
  try {
    console.log('Getting playlist information...\n');

    // Get playlist information
    const playlist = await youtube.playlists.getById(PLAYLIST_ID);

    if (playlist.items && playlist.items.length > 0) {
      const info = playlist.items[0];

      console.log('Playlist information:');
      console.log('==========================');
      console.log('Title:', info.snippet?.title);
      console.log('Description:', info.snippet?.description?.substring(0, 100) + '...');
      console.log('Videos:', info.contentDetails?.itemCount);
      console.log('Privacy:', info.status?.privacyStatus);
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getPlaylistItems() {
  try {
    console.log('Getting playlist videos...\n');

    // Get playlist items
    const items = await youtube.playlists.getItemsById(PLAYLIST_ID, 5);

    console.log('Videos in playlist:');
    console.log('======================');

    items.items?.forEach((item, index) => {
      const title = item.snippet?.title;
      const videoId = item.contentDetails?.videoId;
      console.log(`${index + 1}. ${title}`);
      console.log(`   Video ID: ${videoId}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  await getPlaylistInfo();
  await getPlaylistItems();
}

main();

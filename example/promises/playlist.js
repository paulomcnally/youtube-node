/**
 * Ejemplo: Información de playlists con async/await
 *
 * Este ejemplo muestra cómo obtener información de playlists
 * y sus items usando Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Playlist ID de ejemplo
const PLAYLIST_ID = 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F';

async function getPlaylistInfo() {
  try {
    console.log('Obteniendo información de la playlist...\n');

    // Obtener información de la playlist
    const playlist = await youtube.playlists.getById(PLAYLIST_ID);

    if (playlist.items && playlist.items.length > 0) {
      const info = playlist.items[0];

      console.log('Información de la playlist:');
      console.log('==========================');
      console.log('Título:', info.snippet?.title);
      console.log('Descripción:', info.snippet?.description?.substring(0, 100) + '...');
      console.log('Videos:', info.contentDetails?.itemCount);
      console.log('Privacidad:', info.status?.privacyStatus);
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getPlaylistItems() {
  try {
    console.log('Obteniendo videos de la playlist...\n');

    // Obtener items de la playlist
    const items = await youtube.playlists.getItemsById(PLAYLIST_ID, 5);

    console.log('Videos en la playlist:');
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

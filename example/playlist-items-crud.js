const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: PlaylistItems CRUD operations (Issue #70)

const playlistId = 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F';

// 1. List items in a playlist
console.log('Getting playlist items...');
youTube.playlistItems.list(playlistId, { maxResults: 5 }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Playlist items found:', response.items?.length);
    response.items?.forEach((item) => {
      console.log(`- ${item.snippet?.title} (position: ${item.snippet?.position})`);
    });
  }
});

// 2. Add video to playlist (requires OAuth)
// youTube.playlistItems.insert('PLAYLIST_ID', 'VIDEO_ID', {
//   position: 0,
//   note: 'A custom note for this video'
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Video added to playlist:', response.id);
//   }
// });

// 3. Update playlist item (requires OAuth)
// youTube.playlistItems.update('PLAYLIST_ITEM_ID', {
//   position: 5,
//   note: 'Updated note'
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Playlist item updated:', response);
//   }
// });

// 4. Remove video from playlist (requires OAuth)
// youTube.playlistItems.delete('PLAYLIST_ITEM_ID', (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Video removed from playlist');
//   }
// });

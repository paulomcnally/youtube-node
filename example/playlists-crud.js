const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Playlists CRUD operations (Issue #69)

const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers channel

// 1. Get playlists by channel
console.log('Getting playlists by channel...');
youTube.playlists.getByChannel(channelId, { maxResults: 5 }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Playlists found:', response.items?.length);
    response.items?.forEach((playlist) => {
      console.log(`- ${playlist.snippet?.title} (${playlist.id})`);
    });
  }
});

// 2. Get playlist by ID
const playlistId = 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F';
youTube.playlists.getById(playlistId, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Playlist details:');
    console.log(JSON.stringify(response, null, 2));
  }
});

// 3. Create a new playlist (requires OAuth)
// youTube.playlists.insert('My New Playlist', {
//   description: 'A description for my playlist',
//   privacyStatus: 'private',
//   tags: ['tag1', 'tag2']
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Playlist created:', response.id);
//   }
// });

// 4. Update a playlist (requires OAuth)
// youTube.playlists.update('PLAYLIST_ID', {
//   title: 'Updated Title',
//   description: 'Updated description',
//   privacyStatus: 'unlisted'
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Playlist updated:', response);
//   }
// });

// 5. Delete a playlist (requires OAuth)
// youTube.playlists.delete('PLAYLIST_ID', (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Playlist deleted successfully');
//   }
// });

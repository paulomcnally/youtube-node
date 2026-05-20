const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Get channel by username (Issue #68)
console.log('Getting channel by username...');

// Using handle format
youTube.channels.getByUsername('@YouTube', (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Channel by handle:');
    console.log(JSON.stringify(response, null, 2));
  }
});

// Using legacy username format
youTube.channels.getByUsername('GoogleDevelopers', (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Channel by username:');
    console.log(JSON.stringify(response, null, 2));
  }
});

// Example using Promise
youTube.channels.getByUsernameAsync('@YouTube')
  .then((response) => {
    console.log('Channel (Promise):', response.items?.[0]?.snippet?.title);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

// Get authenticated user's channel (requires OAuth)
// youTube.channels.getMyChannel((err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('My channel:', response);
//   }
// });

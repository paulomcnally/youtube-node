const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Activities (Issue #77)

const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers channel

// 1. Get activities for a channel
console.log('Getting channel activities...');
youTube.activities.list({
  channelId: channelId,
  maxResults: 10
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Activities found:', response.items?.length);
    response.items?.forEach((activity) => {
      const snippet = activity.snippet;
      const contentDetails = activity.contentDetails;
      const activityType = Object.keys(contentDetails || {})[0] || 'unknown';

      console.log(`\n- Type: ${activityType}`);
      console.log(`  Title: ${snippet?.title}`);
      console.log(`  Published: ${snippet?.publishedAt}`);

      // Show details based on activity type
      if (contentDetails?.upload) {
        console.log(`  Video ID: ${contentDetails.upload.videoId}`);
      }
      if (contentDetails?.like) {
        console.log(`  Liked Resource: ${contentDetails.like.resourceId?.videoId}`);
      }
      if (contentDetails?.subscription) {
        console.log(`  Subscribed to: ${contentDetails.subscription.resourceId?.channelId}`);
      }
    });
  }
});

// 2. Get activities with date filter
console.log('\nGetting activities (with date filter)...');
youTube.activities.list({
  channelId: channelId,
  maxResults: 5,
  publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Recent activities:', response.items?.length);
  }
});

// 3. Get activities by region
console.log('\nGetting activities by region...');
youTube.activities.list({
  channelId: channelId,
  maxResults: 5,
  regionCode: 'US'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Activities (US):', response.items?.length);
  }
});

// 4. Get authenticated user's activities (requires OAuth)
// youTube.activities.list({
//   mine: true,
//   maxResults: 10
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('My activities:', response.items?.length);
//   }
// });

// 5. Get authenticated user's home feed (requires OAuth)
// youTube.activities.list({
//   home: true,
//   maxResults: 10
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('Home feed activities:', response.items?.length);
//   }
// });

// Example using Promise
youTube.activities.listAsync({
  channelId: channelId,
  maxResults: 3
})
  .then((response) => {
    console.log('\nActivities (Promise):', response.items?.length);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

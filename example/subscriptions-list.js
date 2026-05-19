const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Subscriptions (Issue #76)

const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers channel

// 1. Get subscriptions of a channel
console.log('Getting channel subscriptions...');
youTube.subscriptions.getSubscriptions({
  channelId: channelId,
  maxResults: 5,
  order: 'alphabetical'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Subscriptions found:', response.items?.length);
    response.items?.forEach((sub) => {
      console.log(`- ${sub.snippet?.title} (${sub.snippet?.resourceId?.channelId})`);
    });
  }
});

// 2. Get subscriptions ordered by relevance
console.log('\nGetting subscriptions (by relevance)...');
youTube.subscriptions.getSubscriptions({
  channelId: channelId,
  maxResults: 5,
  order: 'relevance'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Subscriptions (relevance):', response.items?.length);
  }
});

// 3. Get subscriptions for a specific channel
console.log('\nGetting subscriptions for specific channel...');
youTube.subscriptions.getSubscriptions({
  channelId: channelId,
  forChannelId: 'UCxxxxxxxxxxxxxxxxxxxx', // Replace with actual channel ID
  maxResults: 5
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Filtered subscriptions:', response.items?.length);
  }
});

// 4. Get authenticated user's subscriptions (requires OAuth)
// youTube.subscriptions.getSubscriptions({
//   mine: true,
//   maxResults: 10,
//   order: 'alphabetical'
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('My subscriptions:', response.items?.length);
//     response.items?.forEach((sub) => {
//       console.log(`- ${sub.snippet?.title}`);
//     });
//   }
// });

// 5. Get subscribers of authenticated user's channel (requires OAuth)
// youTube.subscriptions.getSubscriptions({
//   mySubscribers: true,
//   maxResults: 10
// }, (err, response) => {
//   if (err) {
//     console.error('Error:', err.message);
//   } else {
//     console.log('My subscribers:', response.items?.length);
//   }
// });

// Example using Promise
youTube.subscriptions.getSubscriptionsAsync({
  channelId: channelId,
  maxResults: 3
})
  .then((response) => {
    console.log('\nSubscriptions (Promise):', response.items?.length);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

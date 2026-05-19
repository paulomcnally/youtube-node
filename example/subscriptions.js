/**
 * Example: Subscriptions (Subscribe/Unsubscribe)
 * Requires OAuth
 *
 * Issue #83
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTE: For OAuth operations, you need to configure the access token
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers channel

// Subscribe to a channel
async function subscribeExample() {
  try {
    const result = await youtube.subscriptions.subscribeToChannel(CHANNEL_ID);
    console.log('Subscribed successfully:', result);

    // Save the subscriptionId to be able to unsubscribe later
    if (result.items && result.items[0]) {
      console.log('Subscription ID:', result.items[0].id);
    }
  } catch (error) {
    console.error('Error subscribing:', error);
  }
}

// Unsubscribe using subscriptionId
async function unsubscribeExample() {
  const subscriptionId = 'SUBSCRIPTION_ID'; // Get from subscribe result

  try {
    await youtube.subscriptions.unsubscribe(subscriptionId);
    console.log('Unsubscribed successfully');
  } catch (error) {
    console.error('Error unsubscribing:', error);
  }
}

// Find and unsubscribe using channelId (helper)
async function findAndUnsubscribeExample() {
  try {
    await youtube.subscriptions.findAndUnsubscribe(CHANNEL_ID);
    console.log('Unsubscribed successfully');
  } catch (error) {
    console.error('Error unsubscribing:', error);
  }
}

// List my subscriptions
async function listSubscriptionsExample() {
  try {
    const result = await youtube.subscriptions.list({
      mine: true,
      maxResults: 10,
    });
    console.log('My subscriptions:', result.items);
  } catch (error) {
    console.error('Error listing subscriptions:', error);
  }
}

// Example with callbacks (legacy)
function subscribeCallbackExample() {
  youtube.subscriptions.subscribeToChannel(CHANNEL_ID, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Subscribed:', result);
  });
}

// Run examples
// subscribeExample();
// unsubscribeExample();
// findAndUnsubscribeExample();
// listSubscriptionsExample();

/**
 * Example: Channel information with async/await
 *
 * This example shows how to get channel information
 * using Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Example channel ID (Google Developers)
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';

async function getChannelInfo() {
  try {
    console.log('Getting channel information...\n');

    const channel = await youtube.channels.getById(CHANNEL_ID);

    if (channel.items && channel.items.length > 0) {
      const info = channel.items[0];

      console.log('Channel information:');
      console.log('======================');
      console.log('Title:', info.snippet?.title);
      console.log('Description:', info.snippet?.description?.substring(0, 100) + '...');
      console.log('Subscribers:', info.statistics?.subscriberCount);
      console.log('Videos:', info.statistics?.videoCount);
      console.log('Total views:', info.statistics?.viewCount);
      console.log('Country:', info.snippet?.country);
    } else {
      console.log('Channel not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getChannelInfo();

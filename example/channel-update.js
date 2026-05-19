/**
 * Example: Channels Update (Update channel and banner)
 * Requires OAuth
 *
 * Issue #84
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();

// NOTE: For OAuth operations, you need to configure the access token
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const CHANNEL_ID = 'YOUR_CHANNEL_ID';

// Update channel metadata
async function updateChannelExample() {
  try {
    const result = await youtube.channels.update({
      id: CHANNEL_ID,
      brandingSettings: {
        channel: {
          title: 'New Channel Title',
          description: 'New channel description',
          keywords: 'technology, programming, javascript',
          defaultLanguage: 'en',
          country: 'US',
        },
      },
    });
    console.log('Channel updated:', result);
  } catch (error) {
    console.error('Error updating channel:', error);
  }
}

// Upload channel banner
async function uploadBannerExample() {
  try {
    // Upload the banner image
    const bannerResult = await youtube.channels.uploadBanner('./banner.jpg');
    console.log('Banner uploaded:', bannerResult);

    if (bannerResult.url) {
      // Update channel with banner URL
      await youtube.channels.updateBanner(CHANNEL_ID, bannerResult.url);
      console.log('Banner updated in channel');
    }
  } catch (error) {
    console.error('Error uploading banner:', error);
  }
}

// Update banner in one step
async function updateBannerCompleteExample() {
  try {
    const result = await youtube.channels.uploadBanner('./banner.jpg');

    if (result.url) {
      await youtube.channels.update({
        id: CHANNEL_ID,
        brandingSettings: {
          image: {
            bannerExternalUrl: result.url,
          },
        },
      });
      console.log('Banner updated successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example with callbacks (legacy)
function updateChannelCallbackExample() {
  youtube.channels.update({
    id: CHANNEL_ID,
    brandingSettings: {
      channel: {
        title: 'New Title',
        description: 'New description',
      },
    },
  }, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Channel updated:', result);
  });
}

// Run examples
// updateChannelExample();
// uploadBannerExample();
// updateBannerCompleteExample();

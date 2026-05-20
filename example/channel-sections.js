/**
 * Example: Channel Sections (requires OAuth)
 *
 * This example shows how to manage sections of a YouTube channel.
 *
 * Note: To use these methods you need an OAuth token with write
 * permissions on YouTube.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Example: Channel Sections ===\n');

// Available section types
const sectionTypes = [
  'allPlaylists',      // All playlists
  'completedEvents',   // Completed events
  'likedPlaylists',    // Liked playlists
  'likes',             // Liked videos
  'liveEvents',        // Live events
  'multipleChannels',  // Multiple channels
  'multiplePlaylists', // Multiple playlists
  'popularUploads',    // Popular uploads
  'postedPlaylists',   // Posted playlists
  'postedVideos',      // Posted videos
  'recentActivity',    // Recent activity
  'recentPosts',       // Recent posts
  'recentUploads',     // Recent uploads
  'singlePlaylist',    // Single playlist
  'subscriptions',     // Subscriptions
  'upcomingEvents',    // Upcoming events
];

console.log('Available section types:');
sectionTypes.forEach(type => console.log(`  - ${type}`));

// Example: List sections of a channel
async function listChannelSections() {
  try {
    const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers

    console.log(`\nGetting sections of channel: ${channelId}`);

    const result = await youtube.channelSections.list(channelId);

    console.log(`Total sections: ${result.items?.length || 0}`);

    if (result.items) {
      result.items.forEach((section, index) => {
        console.log(`\n[${index + 1}] Section:`);
        console.log(`  ID: ${section.id}`);
        console.log(`  Type: ${section.snippet?.type}`);
        console.log(`  Title: ${section.snippet?.title || 'No title'}`);
        console.log(`  Position: ${section.snippet?.position}`);

        if (section.contentDetails?.playlists) {
          console.log(`  Playlists: ${section.contentDetails.playlists.join(', ')}`);
        }
        if (section.contentDetails?.channels) {
          console.log(`  Channels: ${section.contentDetails.channels.join(', ')}`);
        }
      });
    }
  } catch (error) {
    console.error('Error getting sections:', error.message);
  }
}

// Example: Create a new section (requires OAuth)
async function createChannelSectionExample() {
  try {
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist',
        title: 'My Featured Playlist',
        position: 0,
      },
      contentDetails: {
        playlists: ['PLAYLIST_ID_HERE'],
      },
    };

    console.log('\n=== Create section ===');
    console.log('Requires OAuth with write permissions');
    console.log('Example sectionResource:');
    console.log(JSON.stringify(sectionResource, null, 2));

    // const result = await youtube.channelSections.create(sectionResource);
    // console.log('Section created:', result);
  } catch (error) {
    console.error('Error creating section:', error.message);
  }
}

// Example: Update a section (requires OAuth)
async function updateChannelSectionExample() {
  try {
    const sectionId = 'SECTION_ID_HERE';
    const sectionResource = {
      snippet: {
        type: 'singlePlaylist',
        title: 'Updated Title',
        position: 1,
      },
    };

    console.log('\n=== Update section ===');
    console.log('Requires OAuth with write permissions');
    console.log('Example:');
    console.log(`ID: ${sectionId}`);
    console.log(JSON.stringify(sectionResource, null, 2));

    // const result = await youtube.channelSections.update(sectionId, sectionResource);
    // console.log('Section updated:', result);
  } catch (error) {
    console.error('Error updating section:', error.message);
  }
}

// Example: Delete a section (requires OAuth)
async function deleteChannelSectionExample() {
  try {
    const sectionId = 'SECTION_ID_HERE';

    console.log('\n=== Delete section ===');
    console.log('Requires OAuth with write permissions');
    console.log(`ID to delete: ${sectionId}`);

    // const result = await youtube.channelSections.delete(sectionId);
    // console.log('Section deleted:', result);
  } catch (error) {
    console.error('Error deleting section:', error.message);
  }
}

// Run examples
listChannelSections();
setTimeout(() => createChannelSectionExample(), 2000);
setTimeout(() => updateChannelSectionExample(), 4000);
setTimeout(() => deleteChannelSectionExample(), 6000);

console.log('\n=== Limits ===');
console.log('- Maximum 10 sections per channel');
console.log('- OAuth required to create, update or delete');

console.log('\n=== Reference ===');
console.log('Documentation: https://developers.google.com/youtube/v3/docs/channelSections');

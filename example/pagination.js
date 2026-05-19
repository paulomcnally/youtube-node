/**
 * Example: Pagination and Advanced Search
 *
 * This example shows the pagination and search improvements implemented
 * in version 2.0 of the YouTube API client.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Example: Pagination and Advanced Search ===\n');

// Example 1: getAllResults - Get all results automatically
async function getAllResultsExample() {
  try {
    console.log('=== 1. getAllResults - Get all pages ===\n');
    console.log('This method gets all result pages automatically.');
    console.log('');

    // Uncomment to test (may make many API calls)
    // const allResults = await youtube.getAllResults('search', {
    //   q: 'nodejs tutorial',
    //   maxResults: 50,
    // });
    // console.log(`Total items: ${allResults.length}`);

    console.log('Usage example:');
    console.log(`
const allResults = await youtube.getAllResults('search', {
  q: 'nodejs tutorial',
  maxResults: 50,
});
console.log('Total items:', allResults.length);
    `);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: paginate - Async iterator
async function paginateExample() {
  try {
    console.log('\n=== 2. paginate - Async Iterator ===\n');
    console.log('Iterate over result pages efficiently.');
    console.log('');

    // Uncomment to test
    // let pageCount = 0;
    // for await (const page of youtube.paginate('search', {
    //   q: 'javascript',
    //   maxResults: 10,
    // })) {
    //   pageCount++;
    //   console.log(`Page ${pageCount}: ${page.items?.length} items`);
    //   if (pageCount >= 3) break; // Limit to 3 pages
    // }

    console.log('Usage example:');
    console.log(`
for await (const page of youtube.paginate('search', {
  q: 'javascript',
  maxResults: 10,
})) {
  console.log('Items in page:', page.items?.length);
  // Process items...
}
    `);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Advanced search with filters
async function advancedSearchExample() {
  try {
    console.log('\n=== 3. Advanced search with filters ===\n');

    const query = 'programming tutorial';

    console.log(`Searching: "${query}"`);
    console.log('');

    // Search with advanced filters
    const result = await youtube.searchWithFilters(query, 10, {
      type: 'video',                    // Only videos
      videoDuration: 'medium',          // 4-20 minutes
      videoDefinition: 'high',          // HD
      videoLicense: 'creativeCommon',   // Creative Commons license
      order: 'date',                    // Most recent first
      publishedAfter: '2023-01-01T00:00:00Z',
      regionCode: 'US',
      relevanceLanguage: 'en',
    });

    console.log(`Results: ${result.items?.length || 0}`);

    if (result.items) {
      result.items.forEach((item, index) => {
        const videoId = item.id?.videoId || item.id;
        console.log(`\n[${index + 1}] ${item.snippet?.title}`);
        console.log(`    ID: ${videoId}`);
        console.log(`    Channel: ${item.snippet?.channelTitle}`);
        console.log(`    Published: ${item.snippet?.publishedAt}`);
      });
    }

  } catch (error) {
    console.error('Error in search:', error.message);
  }
}

// Show available filters
console.log('=== Available search filters ===\n');

console.log('type:');
console.log('  - video: Only videos');
console.log('  - channel: Only channels');
console.log('  - playlist: Only playlists');
console.log('');

console.log('videoDuration:');
console.log('  - short: Less than 4 minutes');
console.log('  - medium: 4-20 minutes');
console.log('  - long: More than 20 minutes');
console.log('');

console.log('videoDefinition:');
console.log('  - high: HD');
console.log('  - standard: SD');
console.log('');

console.log('videoLicense:');
console.log('  - creativeCommon: Creative Commons');
console.log('  - youtube: YouTube standard license');
console.log('');

console.log('order:');
console.log('  - date: By date (most recent)');
console.log('  - rating: By rating');
console.log('  - relevance: By relevance');
console.log('  - title: By title');
console.log('  - videoCount: By video count (channels)');
console.log('  - viewCount: By view count');
console.log('');

console.log('safeSearch:');
console.log('  - none: No filter');
console.log('  - moderate: Moderate');
console.log('  - strict: Strict');
console.log('');

// Run examples
getAllResultsExample();
setTimeout(() => paginateExample(), 1000);
setTimeout(() => advancedSearchExample(), 2000);

console.log('=== Supported pagination endpoints ===');
console.log('- search: Search videos/channels/playlists');
console.log('- videos: Video list');
console.log('- channels: Channel list');
console.log('- playlists: Playlist list');
console.log('- playlistItems: Playlist items');
console.log('');

console.log('=== Reference ===');
console.log('Documentation: https://developers.google.com/youtube/v3/docs/search');

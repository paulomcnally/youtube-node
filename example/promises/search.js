/**
 * Example: Search with async/await
 *
 * This example shows how to perform searches
 * using Promises and async/await.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

async function searchVideos() {
  try {
    console.log('Searching videos...\n');

    // Simple search
    const results = await youtube.search.query('nodejs tutorial', 5);

    console.log(`Found ${results.pageInfo?.totalResults} results:\n`);

    results.items?.forEach((item, index) => {
      const title = item.snippet?.title;
      const channel = item.snippet?.channelTitle;
      console.log(`${index + 1}. ${title}`);
      console.log(`   Channel: ${channel}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function searchWithFilters() {
  try {
    console.log('\nSearching HD videos...\n');

    // Search with additional parameters
    const results = await youtube.search.query('javascript', 3, {
      type: 'video',
      videoDefinition: 'high',
    });

    results.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  await searchVideos();
  await searchWithFilters();
}

main();

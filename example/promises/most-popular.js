/**
 * Example: Most popular videos with async/await
 *
 * This example shows how to get the most popular videos
 * using Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

async function getMostPopular() {
  try {
    console.log('Getting most popular videos...\n');

    const popular = await youtube.videos.getMostPopular(5);

    console.log('Most popular videos:');
    console.log('=====================');

    popular.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
      console.log(`   Channel: ${item.snippet?.channelTitle}`);
      console.log(`   Views: ${item.statistics?.viewCount}`);
      console.log(`   Likes: ${item.statistics?.likeCount}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getMostPopularByCategory() {
  try {
    console.log('\nGetting most popular music videos (category 10)...\n');

    // Category 10 is music
    const popular = await youtube.videos.getMostPopularByCategory(5, 10);

    console.log('Most popular music videos:');
    console.log('===============================');

    popular.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
      console.log(`   Channel: ${item.snippet?.channelTitle}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function main() {
  await getMostPopular();
  await getMostPopularByCategory();
}

main();

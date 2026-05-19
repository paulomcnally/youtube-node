/**
 * Ejemplo: Videos más populares con async/await
 *
 * Este ejemplo muestra cómo obtener los videos más populares
 * usando Promises.
 */

const YouTube = require('../../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

async function getMostPopular() {
  try {
    console.log('Obteniendo videos más populares...\n');

    const popular = await youtube.videos.getMostPopular(5);

    console.log('Videos más populares:');
    console.log('=====================');

    popular.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
      console.log(`   Canal: ${item.snippet?.channelTitle}`);
      console.log(`   Vistas: ${item.statistics?.viewCount}`);
      console.log(`   Likes: ${item.statistics?.likeCount}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getMostPopularByCategory() {
  try {
    console.log('\nObteniendo videos más populares de música (categoría 10)...\n');

    // Categoría 10 es música
    const popular = await youtube.videos.getMostPopularByCategory(5, 10);

    console.log('Videos más populares de música:');
    console.log('===============================');

    popular.items?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.snippet?.title}`);
      console.log(`   Canal: ${item.snippet?.channelTitle}\n`);
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

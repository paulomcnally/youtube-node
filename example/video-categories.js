const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Video Categories (Issue #71)

// 1. Get all video categories for a region
console.log('Getting video categories for US...');
youTube.videoCategories.list({ regionCode: 'US' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Categories found:', response.items?.length);
    response.items?.forEach((category) => {
      console.log(`- ${category.id}: ${category.snippet?.title}`);
    });
  }
});

// 2. Get specific category by ID
console.log('\nGetting category by ID (10 = Music)...');
youTube.videoCategories.list({ id: '10' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Category:');
    console.log(JSON.stringify(response.items?.[0], null, 2));
  }
});

// 3. Get categories in Spanish
console.log('\nGetting categories in Spanish...');
youTube.videoCategories.list({ regionCode: 'ES', hl: 'es' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Categories (ES):');
    response.items?.slice(0, 5).forEach((category) => {
      console.log(`- ${category.id}: ${category.snippet?.title}`);
    });
  }
});

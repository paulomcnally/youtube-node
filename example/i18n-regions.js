const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: I18n Regions (Issue #73)

// 1. Get all supported regions
console.log('Getting supported regions...');
youTube.i18nRegions.list({}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Regions found:', response.items?.length);
    response.items?.slice(0, 10).forEach((region) => {
      console.log(`- ${region.id}: ${region.snippet?.name}`);
    });
  }
});

// 2. Get regions in Spanish
console.log('\nGetting regions in Spanish...');
youTube.i18nRegions.list({ hl: 'es' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Regions (ES):');
    response.items?.slice(0, 10).forEach((region) => {
      console.log(`- ${region.id}: ${region.snippet?.name}`);
    });
  }
});

// Example using Promise
youTube.i18nRegions.listAsync({ hl: 'fr' })
  .then((response) => {
    console.log('\nRegions (FR):');
    response.items?.slice(0, 5).forEach((region) => {
      console.log(`- ${region.id}: ${region.snippet?.name}`);
    });
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

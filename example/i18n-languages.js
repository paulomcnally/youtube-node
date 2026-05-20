const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: I18n Languages (Issue #72)

// 1. Get all supported languages
console.log('Getting supported languages...');
youTube.i18nLanguages.list({}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Languages found:', response.items?.length);
    response.items?.slice(0, 10).forEach((lang) => {
      console.log(`- ${lang.id}: ${lang.snippet?.name}`);
    });
  }
});

// 2. Get languages in Spanish
console.log('\nGetting languages in Spanish...');
youTube.i18nLanguages.list({ hl: 'es' }, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Languages (ES):');
    response.items?.slice(0, 10).forEach((lang) => {
      console.log(`- ${lang.id}: ${lang.snippet?.name}`);
    });
  }
});

// Example using Promise
youTube.i18nLanguages.listAsync({ hl: 'fr' })
  .then((response) => {
    console.log('\nLanguages (FR):');
    response.items?.slice(0, 5).forEach((lang) => {
      console.log(`- ${lang.id}: ${lang.snippet?.name}`);
    });
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

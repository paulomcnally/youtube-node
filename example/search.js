const YouTube = require('../lib/youtube');
const config = require('./config');

const youTube = new YouTube();

youTube.setKey(config.key);
youTube.search('World War z Trailer', 2, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
});

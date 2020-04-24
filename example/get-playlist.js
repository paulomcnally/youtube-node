const YouTube = require('../lib/youtube');
const config = require('./config');

const youTube = new YouTube();

youTube.setKey(config.key);
youTube.getPlayListsById('PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F', (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
});

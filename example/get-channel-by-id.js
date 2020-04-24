const YouTube = require('../lib/youtube');
const config = require('./config');

const youTube = new YouTube();

youTube.setKey(config.key);

// Get "Marvel Entertainment" channel
youTube.getChannelById('UCvC4D8onUfXzvjTOM-dBfEA', (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
});

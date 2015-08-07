var YouTube = require('../lib/youtube');
var config = require('./config');

var youTube = new YouTube();

youTube.setKey(config.key);
youTube.getPlayListsById('PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F', function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
});

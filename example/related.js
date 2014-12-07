var YouTube = require('../lib/youtube');
var config = require('./config');

var youTube = new YouTube();

youTube.setKey(config.key);
youTube.related(config.id, config.max, function(response) {
  console.log(JSON.stringify(response, null, 2));
});

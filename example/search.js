var YouTube = require('../lib/youtube');

var youTube = new YouTube();

youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

youTube.search('World War z Trailer', 2, function(resultData) {
  console.log(JSON.stringify(resultData, null, 2));
});

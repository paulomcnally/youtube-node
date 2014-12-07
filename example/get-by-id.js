var YouTube = require('../lib/youtube');

var youTube = new YouTube();

youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');


youTube.getById('HcwTxRuq-uk,vIu85WQTPRc', function(resultData) {
  console.log(JSON.stringify(resultData, null, 2));
});

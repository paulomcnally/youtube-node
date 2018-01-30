var YouTube = require('../lib/youtube');
var config = require('./config');

var youTube = new YouTube();

youTube.setKey(config.key);
youTube.getMostPopular(2, function (error, result) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(JSON.stringify(result, null, 2));
    }
});
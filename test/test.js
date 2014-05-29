var youtube = require('../lib/youtube');


youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

youtube.getById('HcwTxRuq-uk,vIu85WQTPRc', function (resultData) {
    console.log(JSON.stringify(resultData, null, 2));
});

youtube.search('World War z Trailer', 2, function (resultData) {
    console.log(JSON.stringify(resultData, null, 2));
});
// example for get only the channel results
var _params = {
    type: 'channel',
    maxResults: 2
}
youtube.searchWithParams('World War z Trailer', _params, function (resultData) {
    console.log(JSON.stringify(resultData, null, 2));
});
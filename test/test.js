var youtube = require('../lib/youtube');


youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

youtube.search({q: 'World War z Trailer', maxResults: 2}, function(resultData) {
    console.log( JSON.stringify( resultData, null, 2 ) );
});

youtube.getById('HcwTxRuq-uk,vIu85WQTPRc', function(resultData) {
    console.log( JSON.stringify( resultData, null, 2 ) );
});
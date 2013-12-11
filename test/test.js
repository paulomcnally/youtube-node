var youtube = require('../lib/youtube');

/*
youtube.search('World War z Trailer', 2, function(resultData) {
    console.log(resultData);
});
*/


youtube.getById('HcwTxRuq-uk', function(resultData) {
    console.log(resultData);
});
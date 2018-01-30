var YouTube = require('../lib/youtube');
var config = require('./config');

var youTube = new YouTube();

youTube.setKey(config.key);
var id = 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F';
var iterativeGetPlayListsItemsById = function(nextPageToken, cb){
  youTube.getPlayListsItemsById(id, config.max, nextPageToken, function(error, result) {
    if (error) {
      cb(error);
    }
    else {
      var items = result.items;
      if(result.nextPageToken){
        iterativeGetPlayListsItemsById(result.nextPageToken, function(err, its){
          if(err){
            return cb(err);
          }
          items = items.concat(its);
          cb(null, items);
        });
      } else {
        cb(null, items)
      }
    }
  });
};

iterativeGetPlayListsItemsById(id, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(result, null, 2));
  }
})
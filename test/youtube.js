var config = require('./config.conf');
var YouTube = require('../lib/youtube');
var should = require('should');

describe('Youtube', function() {
  this.timeout(10000);
  it('Require key', function(done) {
    var youTube = new YouTube();
    youTube.search(config.query, 1, function(err, response) {
      err.should.have.property('error', {message: 'Please set a key using setKey method. Get an key in https://console.developers.google.com'});
      done();
    });
  });

  it('getById', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getById(config.id, function(err, response) {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });

  it('search', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.search(config.query, 1, function(err, response) {
      response.should.have.property('kind', 'youtube#searchListResponse');
      done();
    });
  });

  it('related', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.related(config.id, 1, function(err, response) {
      response.should.have.property('kind', 'youtube#searchListResponse');
      done();
    });
  });

  it('getPlayListsById', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsById(config.playlistId, function(err, response) {
      response.should.have.property('kind', 'youtube#playlistListResponse');
      done();
    });
  });

  it('getPlayListsItemsById', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsItemsById(config.playlistId, function(err, response) {
      response.should.have.property('kind', 'youtube#playlistItemListResponse');
      done();
    });
  });

  it('getMostPopular', function(done) {
    var youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getMostPopular(2, function(err, response) {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });

    it('getMostPopularByCategory', function(done) {
        var youTube = new YouTube();
        youTube.setKey(config.key);
        youTube.getMostPopularByCategory(2, 1, function(err, response) {
            response.should.have.property('kind', 'youtube#videoListResponse');
            done();
        });
    });

});

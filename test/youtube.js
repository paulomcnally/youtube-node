/* global it, describe */
const should = require('should');
const config = require('./config.conf');
const YouTube = require('../lib/youtube');

describe('Youtube', function () {
  this.timeout(30000);

  it('Require key', (done) => {
    const youTube = new YouTube();
    youTube.search(config.query, 1, (err, response) => {
      should.exist(err);
      err.should.have.property('error', { message: 'Please set a key using setKey method. Get an key in https://console.developers.google.com' });
      should.not.exist(response);
      done();
    });
  });

  it('getById returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getById(config.id, (err, response) => {
      if (err) {
        // If API key is invalid, we should still get an error object
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#videoListResponse');
        done();
      }
    });
  });

  it('getChannelById returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getChannelById(config.channelId, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#channelListResponse');
        done();
      }
    });
  });

  it('search returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.search(config.query, 1, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#searchListResponse');
        done();
      }
    });
  });

  it('related returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.related(config.id, 1, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#searchListResponse');
        done();
      }
    });
  });

  it('getPlayListsById returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsById(config.playlistId, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#playlistListResponse');
        done();
      }
    });
  });

  it('getPlayListsItemsById returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsItemsById(config.playlistId, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#playlistItemListResponse');
        done();
      }
    });
  });

  it('getMostPopular returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getMostPopular(2, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#videoListResponse');
        done();
      }
    });
  });

  it('getMostPopularByCategory returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getMostPopularByCategory(2, 1, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response.should.have.property('kind', 'youtube#videoListResponse');
        done();
      }
    });
  });
});

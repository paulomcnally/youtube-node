/* global it, describe */
const should = require('should');
const config = require('./config.conf');
const YouTube = require('../lib/youtube');

describe('Youtube', function () {
  this.timeout(10000);
  it('Require key', (done) => {
    const youTube = new YouTube();
    youTube.search(config.query, 1, (err, response) => {
      err.should.have.property('error', { message: 'Please set a key using setKey method. Get an key in https://console.developers.google.com' });
      done();
    });
  });

  it('getById', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getById(config.id, (err, response) => {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });

  it('getChannelById', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getById(config.channelId, (err, response) => {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });

  it('search', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.search(config.query, 1, (err, response) => {
      response.should.have.property('kind', 'youtube#searchListResponse');
      done();
    });
  });

  it('related', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.related(config.id, 1, (err, response) => {
      response.should.have.property('kind', 'youtube#searchListResponse');
      done();
    });
  });

  it('getPlayListsById', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsById(config.playlistId, (err, response) => {
      response.should.have.property('kind', 'youtube#playlistListResponse');
      done();
    });
  });

  it('getPlayListsItemsById', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getPlayListsItemsById(config.playlistId, (err, response) => {
      response.should.have.property('kind', 'youtube#playlistItemListResponse');
      done();
    });
  });

  it('getMostPopular', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getMostPopular(2, (err, response) => {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });

  it('getMostPopularByCategory', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.getMostPopularByCategory(2, 1, (err, response) => {
      response.should.have.property('kind', 'youtube#videoListResponse');
      done();
    });
  });
});

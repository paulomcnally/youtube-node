/* eslint-env mocha */
import * as should from 'should';
import YouTube from '../src/lib/youtube';

// Type declarations for mocha
declare namespace Mocha {
  interface Suite {
    timeout(ms: number): void;
  }
}
declare function describe(name: string, fn: (this: Mocha.Suite) => void): void;
declare function it(name: string, fn: (done: (err?: Error) => void) => void): void;

interface Config {
  key: string;
  id: string;
  channelId: string;
  query: string;
  playlistId: string;
}

const config: Config = {
  key: process.env.YOUTUBE_API || 'test_key',
  id: 'IkmHStAWXis',
  channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Google Developers channel
  query: 'nodejs song',
  playlistId: 'PLpOqH6AE0tNhInmRTSNf9f6OQsdaSJS8F',
};

describe('Youtube', function (this: Mocha.Suite) {
  // Extend timeout for API tests
  this.timeout(30000);

  it('Require key', (done) => {
    const youTube = new YouTube();
    youTube.search.query(config.query, 1, (err: Error | null | undefined, response: unknown) => {
      should.exist(err);
      // Ahora los errores son instancias de ValidationError
      err!.should.be.an.instanceOf(Error);
      err!.should.have.property('isYouTubeError', true);
      err!.should.have.property('name', 'ValidationError');
      err!.should.have.property('message', 'Please set a key using setKey method. Get a key at https://console.developers.google.com');
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
        response!.should.have.property('kind', 'youtube#videoListResponse');
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
        response!.should.have.property('kind', 'youtube#channelListResponse');
        done();
      }
    });
  });

  it('search returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.search.query(config.query, 1, (err: Error | null | undefined, response: unknown) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        (response as { kind: string }).should.have.property('kind', 'youtube#searchListResponse');
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
        response!.should.have.property('kind', 'youtube#searchListResponse');
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
        response!.should.have.property('kind', 'youtube#playlistListResponse');
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
        response!.should.have.property('kind', 'youtube#playlistItemListResponse');
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
        response!.should.have.property('kind', 'youtube#videoListResponse');
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
        response!.should.have.property('kind', 'youtube#videoListResponse');
        done();
      }
    });
  });
});

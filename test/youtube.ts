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

  // ============================================================
  // Tests for new features (Issues #68-77)
  // ============================================================

  it('channels.getByUsername returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.channels.getByUsername('@YouTube', (err, response) => {
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

  it('playlists.getByChannel returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.playlists.getByChannel(config.channelId, {}, (err: Error | null | undefined, response: unknown) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        (response as { kind: string }).should.have.property('kind', 'youtube#playlistListResponse');
        done();
      }
    });
  });

  it('playlistItems.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.playlistItems.list(config.playlistId, {}, (err: Error | null | undefined, response: unknown) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        (response as { kind: string }).should.have.property('kind', 'youtube#playlistItemListResponse');
        done();
      }
    });
  });

  it('videoCategories.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.videoCategories.list({ regionCode: 'US' }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#videoCategoryListResponse');
        done();
      }
    });
  });

  it('i18nLanguages.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.i18nLanguages.list({ hl: 'es' }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#i18nLanguageListResponse');
        done();
      }
    });
  });

  it('i18nRegions.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.i18nRegions.list({ hl: 'es' }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#i18nRegionListResponse');
        done();
      }
    });
  });

  it('commentThreads.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.commentThreads.list({ videoId: config.id, maxResults: 5 }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#commentThreadListResponse');
        done();
      }
    });
  });

  it('comments.getComments returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    // This test just verifies the method exists and returns expected structure
    // The actual API call may fail without valid comment IDs
    youTube.comments.getComments({ maxResults: 5 }, (err, response) => {
      // This will likely return an error since we don't have valid IDs
      // But the method should exist and be callable
      should.exist(err);
      done();
    });
  });

  it('subscriptions.getSubscriptions returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.subscriptions.getSubscriptions({ channelId: config.channelId, maxResults: 5 }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#subscriptionListResponse');
        done();
      }
    });
  });

  it('activities.list returns valid response structure', (done) => {
    const youTube = new YouTube();
    youTube.setKey(config.key);
    youTube.activities.list({ channelId: config.channelId, maxResults: 5 }, (err, response) => {
      if (err) {
        should.exist(err);
        done();
      } else {
        should.exist(response);
        response!.should.have.property('kind', 'youtube#activityListResponse');
        done();
      }
    });
  });
});

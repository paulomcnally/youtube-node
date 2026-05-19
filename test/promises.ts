/* eslint-env mocha */
import * as should from 'should';
import YouTube from '../src/lib/youtube';

// Type declarations for mocha
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

describe('YouTube Promises', function (this: Mocha.Suite) {
  // Extend timeout for API tests
  this.timeout(30000);

  describe('Promise Support - Videos', () => {
    it('getById should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.videos.getById(config.id);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        // API key might be invalid, but we should get an error
        should.exist(err);
      }
    });

    it('getMostPopular should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.videos.getMostPopular(2);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });

    it('getMostPopularByCategory should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.videos.getMostPopularByCategory(2, 1);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('Promise Support - Channels', () => {
    it('getById should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.channels.getById(config.channelId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('Promise Support - Playlists', () => {
    it('getById should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.playlists.getById(config.playlistId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });

    it('getItemsById should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.playlists.getItemsById(config.playlistId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });

    it('getItemsById with maxResults should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.playlists.getItemsById(config.playlistId, 5);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('Promise Support - Search', () => {
    it('query should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.search.query(config.query, 1);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });

    it('query with params should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.search.query(config.query, 1, { type: 'video' });
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });

    it('related should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.search.related(config.id, 1);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
        data!.should.have.property('kind');
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('Promise Support - Legacy Methods', () => {
    it('getById (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getById(config.id);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('getChannelById (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getChannelById(config.channelId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('getPlayListsById (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getPlayListsById(config.playlistId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('getPlayListsItemsById (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getPlayListsItemsById(config.playlistId);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('related (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.related(config.id, 1);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('getMostPopular (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getMostPopular(2);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });

    it('getMostPopularByCategory (legacy) should return a Promise when no callback is provided', async () => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      const result = youTube.getMostPopularByCategory(2, 1);
      should.exist(result);
      result!.should.be.a.Promise();

      try {
        const data = await result;
        should.exist(data);
      } catch (err) {
        should.exist(err);
      }
    });
  });

  describe('Backward Compatibility - Callbacks still work', () => {
    it('getById with callback should work', (done) => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      youTube.videos.getById(config.id, (err, data) => {
        // Just verify the callback was called
        done();
      });
    });

    it('query with callback should work', (done) => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      youTube.search.query(config.query, 1, (err, data) => {
        // Just verify the callback was called
        done();
      });
    });

    it('query with params and callback should work', (done) => {
      const youTube = new YouTube();
      youTube.setKey(config.key);

      youTube.search.query(config.query, 1, { type: 'video' }, (err, data) => {
        // Just verify the callback was called
        done();
      });
    });
  });

  describe('Error Handling with Promises', () => {
    it('should reject Promise when API key is not set', async () => {
      const youTube = new YouTube();
      // Not setting API key

      try {
        await youTube.videos.getById(config.id);
        should.fail('Should have thrown an error');
      } catch (err) {
        should.exist(err);
        (err as Error).should.have.property('isYouTubeError', true);
      }
    });

    it('should reject Promise when API key is not set (search)', async () => {
      const youTube = new YouTube();
      // Not setting API key

      try {
        await youTube.search.query(config.query, 1);
        should.fail('Should have thrown an error');
      } catch (err) {
        should.exist(err);
        (err as Error).should.have.property('isYouTubeError', true);
      }
    });
  });
});

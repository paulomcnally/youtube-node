const axios = require('axios');
const queryString = require('querystring');

const YouTube = function () {
  const self = this;

  /**
  * API v3 Url
  * @type {string}
  */
  self.url = 'https://www.googleapis.com/youtube/v3/';

  /**
  * params
  * https://developers.google.com/youtube/v3/docs/search/list
  * @type {Object}
  */
  self.params = {};

  self.parts = [];

  /**
  * Set private key to class
  * @param {string} key
  */
  self.setKey = function (key) {
    self.addParam('key', key);
  };

  /**
  *
  * @param {string} name
  */
  self.addPart = function (name) {
    self.parts.push(name);
  };

  /**
  *
  * Optional parameters
  * https://developers.google.com/youtube/v3/docs/search/list
  *
  * @param {string} key
  * @param {string} value
  */
  self.addParam = function (key, value) {
    self.params[key] = value;
  };

  /**
  * Clear every parameter but the key
  */
  self.clearParams = function () {
    self.params = {
      key: self.params.key,
    };
  };

  /**
  *
  * @param {string} path
  * @returns {string}
  */
  self.getUrl = function (path) {
    return `${self.url + path}?${queryString.stringify(self.params)}`;
  };

  /**
  *
  * @returns {string}
  */
  self.getParts = function () {
    return self.parts.join(',');
  };

  /**
   * Simple http request
   * @param {string} url
   * @param {function} callback
   */
  self.request = function (url, callback) {
    axios.get(url)
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          callback(error.response.data.error || error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          callback({ message: 'No response received from server' });
        } else {
          // Something happened in setting up the request that triggered an Error
          callback({ message: error.message });
        }
      });
  };

  /**
  * Return error object
  * @param {string} message
  */
  self.newError = function (message) {
    return {
      error: {
        message,
      },
    };
  };

  /**
  * Validate params
  */
  self.validate = function () {
    if (!self.params.key) {
      return self.newError('Please set a key using setKey method. Get an key in https://console.developers.google.com');
    }

    return null;
  };

  /**
  * Initialize parts
  */
  self.clearParts = function () {
    self.parts = [];
  };

  /**
  * Video data from ID
  * @param {string} id
  * @param {function} callback
  */
  self.getById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('statistics');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Get channel data based on ID
   * @param {string} id
   * @param {function} callback
   */
  self.getChannelById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.clearParams();
      self.clearParts();

      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('statistics');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('channels'), callback);
    }
  };

  /**
  * Playlists data from Playlist Id
  * @param {string} id
  * @param {function} callback
  * https://developers.google.com/youtube/v3/docs/playlists/list
  */
  self.getPlayListsById = function (id, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');
      self.addPart('contentDetails');
      self.addPart('status');
      self.addPart('player');
      self.addPart('id');

      self.addParam('part', self.getParts());
      self.addParam('id', id);

      self.request(self.getUrl('playlists'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
  * Playlists data from Playlist Id
  * @param {string} id
  * @param {int} maxResults
  * @param {function} callback
  * https://developers.google.com/youtube/v3/docs/playlistItems/list
  */
  self.getPlayListsItemsById = function (id, maxResults, callback) {
    const validate = self.validate();

    let cb = callback;
    let maxRes = maxResults;

    if (typeof (maxResults) === 'function') {
      cb = maxResults;
      maxRes = null;
    }

    if (validate !== null) {
      cb(validate);
    } else {
      self.addPart('contentDetails');
      self.addPart('id');
      self.addPart('snippet');
      self.addPart('status');

      self.addParam('part', self.getParts());
      self.addParam('playlistId', id);

      if (maxRes) {
        self.addParam('maxResults', maxRes);
      }

      self.request(self.getUrl('playlistItems'), cb);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
   * Videos data from query
   * @param {string} query
   * @param {int} maxResults
   * @param {object} params
   * @param {function} callback
   */
  self.search = function (query, maxResults, params, callback) {
    let cb = callback;
    let parameters = params;

    if (typeof parameters !== 'object') {
      if (typeof parameters === 'function') {
        cb = parameters;
      }
      parameters = {};
    }

    const validate = self.validate();

    if (validate !== null) {
      cb(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('q', query);
      self.addParam('maxResults', maxResults);

      Object.keys(parameters).forEach((paramKey) => {
        if (parameters[paramKey] !== undefined) {
          self.addParam(paramKey, parameters[paramKey]);
        }
      });

      self.request(self.getUrl('search'), cb);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
  * Videos data from query
  * @param {string} id
  * @param {int} maxResults
  * @param {function} callback
  * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
  */
  self.related = function (id, maxResults, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('relatedToVideoId', id);
      self.addParam('maxResults', maxResults);
      self.addParam('type', 'video');
      self.addParam('order', 'relevance');

      self.request(self.getUrl('search'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
     * Videos data from most popular list
     * @param {int} maxResults
     * @param {function} callback
     * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
     */
  self.getMostPopular = function (maxResults, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('maxResults', maxResults);
      self.addParam('chart', 'mostPopular');

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };

  /**
     * Videos data from most popular list by videoCategoryId
     * @param {int} maxResults
     * @param {function} callback
     * Source: https://github.com/paulomcnally/youtube-node/pull/3/files
     */
  self.getMostPopularByCategory = function (maxResults, videoCategoryId, callback) {
    const validate = self.validate();

    if (validate !== null) {
      callback(validate);
    } else {
      self.addPart('snippet');

      self.addParam('part', self.getParts());
      self.addParam('maxResults', maxResults);
      self.addParam('chart', 'mostPopular');
      self.addParam('videoCategoryId', videoCategoryId);

      self.request(self.getUrl('videos'), callback);

      self.clearParams();
      self.clearParts();
    }
  };
};

module.exports = YouTube;

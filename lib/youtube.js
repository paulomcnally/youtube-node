var request = require('request');
var queryString = require('querystring');

var youtube = function() {

  var self = this;

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
  self.setKey = function(key) {
    self.addParam('key', key);
  }

  /**
  *
  * @param {string} name
  */
  self.addPart = function(name) {
    self.parts.push(name);
  }

    /**
     *
     * Optional parameters
     * https://developers.google.com/youtube/v3/docs/search/list
     *
     * @param {string} key
     * @param {string} value
     */
  self.addParam = function(key, value) {
    self.params[key] = value;
  }

  /**
  *
  * @param {string} path
  * @returns {string}
  */
  self.getUrl = function(path) {
    return self.url + path + '?' + queryString.stringify(self.params);
  }

  /**
  *
  * @returns {string}
  */
  self.getParts = function() {
    return self.parts.join(',');
  }

  /**
  * Simple http request
  * @param {string} url
  * @param {string} callback
  */
  self.request = function(url, callback) {
    request(url, function(error, response, body) {
      if (error) {
        console.log(error);
      }
      else {
        if (response.statusCode == 200) {
          var data = JSON.parse(body);
          callback(data);
        }
        else {
          var errorResponse = {
            error : {
              message: 'Bad request.'
            }
          }
          callback(errorResponse);
        }
      }
    });
  }

  /**
  * Video data from ID
  * @param {string} id
  * @param {function} callback
  */
  self.getById = function(id, callback) {
    self.parts = [];

    self.addPart('snippet');
    self.addPart('contentDetails');
    self.addPart('statistics');
    self.addPart('status');

    self.addParam('part', self.getParts());
    self.addParam('id', id);

    self.request(self.getUrl('videos'), function(response) {
      callback(response);
    });
  }

  /**
  * Videos data from query
  * @param {string} query
  * @param {int} maxResults
  * @param {function} callback
  */
  self.search = function(query, maxResults, callback) {
    self.parts = [];

    self.addPart('snippet');

    self.addParam('part', self.getParts());
    self.addParam('q', query);
    self.addParam('maxResults', maxResults);

    self.request(self.getUrl('search'), function(response) {
      if (response.error) {
        callback(response);
      }
      else {
        callback(response);
      }
    });
  }
}

module.exports = new youtube();

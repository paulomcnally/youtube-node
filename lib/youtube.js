var request = require('request');
var qs = require('qs');

var youtube = function(){

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
     * @param key
     */
    self.setKey = function( key ){
        self.addParam( 'key', key );
    }

    /**
     *
     * @param name
     */
    self.addPart = function( name ){
        self.parts.push( name );
    }

    /**
     *
     * Optional parameters
     * https://developers.google.com/youtube/v3/docs/search/list
     *
     * @param key
     * @param value
     */
    self.addParam = function( key, value ){
        self.params[key] = value;
    }

    /**
     *
     * @param path
     * @returns {string}
     */
    self.getUrl = function( path ){
        return self.url + path + '?' + qs.stringify( self.params );
    }

    /**
     *
     * @returns {string}
     */
    self.getParts = function(){
        return self.parts.join(',');
    }

    /**
     * Simple http request
     * @param url
     * @param callback
     */
    self.request = function( url, callback ){
        request( url, function (error, response, body) {
            if( error ){
                console.log( error );
            }
            else{
                if( response.statusCode == 200 ){
                    var data = JSON.parse(body);
                    callback( data );
                }
                else{
                    var errorResponse = {
                        error : {
                            message: 'Bad request.'
                        }
                    }
                    callback( errorResponse );
                }
            }
        });
    }

    /**
     * Video data from ID
     * @param id
     * @param callback
     */
    self.getById = function( id, callback ){

        self.addPart('snippet');
        self.addPart('contentDetails');
        self.addPart('statistics');
        self.addPart('status');

        self.addParam( 'part', self.getParts() );
        self.addParam( 'id', id );

        self.request( self.getUrl('videos'), function( response ){
            callback( response );
        });
    }

    /**
     * Videos data from query
     * @param query
     * @param maxResults
     * @param callback
     */
    self.search = function( query, maxResults, callback ){
        self.addPart( 'snippet' );

        self.addParam( 'part', self.getParts() );
        self.addParam( 'q', query );
        self.addParam( 'maxResults', maxResults );

        self.request( self.getUrl('search'), function( response ){
            if( response.error ){
                callback( response );
            }
            else{
                callback( response );
            }
        });
    }

}

module.exports = new youtube();
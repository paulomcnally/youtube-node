var youtube = require('./youtube');
var prompt = require('prompt');
var colors = require('colors');

var cli = {

    id: function( ){
        prompt.start();
        prompt.get(['key', 'id'], function (err, result) {
            youtube.setKey( result.key );
            youtube.getById( result.id, function( response ){
                console.log( JSON.stringify( response, null, 2 ) );
            });
        });
    },

    search: function(){
        prompt.start();
        prompt.get(['key', 'query', 'maxResults'], function (err, result) {
            youtube.setKey( result.key );
            youtube.search( result.query, result.maxResults, function( response ){
                console.log( JSON.stringify( response, null, 2 ) );
            });
        });
    },

    error: function( param ){
        var message = '';
        switch (param){
            case 0:
                message = 'Required to enter a command.';
                break;
            case 1:
                message = 'The command you entered does not exist.';
                break;
        }
        console.log( colors.red( message ) ) ;
    }
}

module.exports = cli;
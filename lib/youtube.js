var request = require('request');

var params = [];
params['q']="";
params['start-index'] = 1;
params['max-results'] = 1;
params['v'] = 2;
params['alt'] = 'json';
var api = 'http://gdata.youtube.com/feeds/api/';

function serialize_data(item){
    var obj = {};
    obj.id = getId(item.id.$t);
    obj.published = item.published.$t;
    obj.updated = item.updated.$t;
    obj.title = item.title.$t;
    obj.content = item.content;
    obj.link = getLink(obj.id);
    obj.author = {};
    obj.author.name = item.author[0].name.$t;
    obj.author.url = getAuthorUrl(item.author[0].name.$t);
    obj.categories = getCategories( item.media$group.media$category );
    obj.duration = item.media$group.yt$duration.seconds;
    obj.description = item.media$group.media$description.$t;
    obj.thumbnails = getThumbnails( item.media$group.media$thumbnail );
    obj.statistics = item.yt$statistics;
    obj.rating = item.yt$rating;
    return obj;
}

function getId( string ){
    var id = string.match(/[a-zA-Z0-9_-]{11}/g);
    return id[0];
}

function getAuthorUrl(name){
    return 'http://www.youtube.com/user/' + name;
}

function getLink(id){
    return 'http://www.youtube.com/watch?v=' + id;
}

function getCategories(categories){
    var result = [];
    categories.forEach(function(item){
        result.push( item.label );
    });
    return result;
}

function getThumbnails(tumbnails){
    var result = [];
    tumbnails.forEach(function(item){
        var obj_item = {};
        obj_item.url = item.url;
        obj_item.width = item.width;
        obj_item.height = item.height;
        obj_item.name = item.yt$name;
        result.push( obj_item );
    });
    return result;
}

function getSearchUrl(){
    return api + 'videos?q=' + params['q'] + '&start-index=' + params['start-index'] + '&max-results=' + params['max-results'] + '&v=' + params['v'] + '&alt=' + params['alt'];
}

module.exports.getById = function( id, cb ){
    function parse(id, callback) {
        params['q'] = id;
        params['max-results'] = 1;
        request(getSearchUrl(), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                var result = data.feed.entry[0] || [];
                callback(serialize_data(result));
            }
        });
    };

    parse(id, cb);
}

module.exports.search = function (query, max, cb) {
    function parse(query, max, callback) {
        params['q'] = query;
        params['max-results'] = max;
        request(getSearchUrl(), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data;
                try {
                    data = JSON.parse(body);
                } catch (ex) {
                    data = null;
                }
                data.feed.entry = data.feed.entry || [];
                var result = [];
                data.feed.entry.forEach(function(item){
                    result.push(serialize_data(item));
                });
                callback(result);
            }
        });
    };

    parse(query,max, cb);
}

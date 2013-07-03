## youtube-node ##

#### Install
    npm install youtube-node

#### Example search (search term, num results) return array
    var youtube = require('youtube-node');

    youtube.search('World War z Trailer', 2, function(resultData) {
        console.log(resultData);
    });

#### Example search resultData
    [
        {
            "id":"HcwTxRuq-uk",
            "published":"2012-11-09T00:01:39.000Z",
            "updated":"2013-07-03T12:46:11.000Z",
            "title": 'World War Z - Official Trailer (HD)',
            "content":{
                "type":"application/x-shockwave-flash",
                "src":"http://www.youtube.com/v/HcwTxRuq-uk?version=3&f=videos&app=youtube_gdata"
            },
            "link":"http://www.youtube.com/watch?v=HcwTxRuq-uk",
            "author":{
                "name":"joblomovienetwork",
                "url":"http://www.youtube.com/user/joblomovienetwork"
            },
            "categories":[
                "Entertainment"
            ],
            "duration":"147",
            "description":"http://www.joblo.com - \"World War Z\" - Official Trailer Source: http://trailers.apple.com/trailers/paramount/worldwarz/ World War Z Twitter: https://twitter....",
            "thumbnails":[
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/default.jpg",
                    "width":120,
                    "height":90,
                    "name":"default"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/mqdefault.jpg",
                    "width":320,
                    "height":180,
                    "name":"mqdefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/hqdefault.jpg",
                    "width":480,
                    "height":360,
                    "name":"hqdefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/sddefault.jpg",
                    "width":640,
                    "height":480,
                    "name":"sddefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/1.jpg",
                    "width":120,
                    "height":90,
                    "name":"start"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/2.jpg",
                    "width":120,
                    "height":90,
                    "name":"middle"
                },
                {
                    "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/3.jpg",
                    "width":120,
                    "height":90,
                    "name":"end"
                }
            ],
            "statistics":{
                "favoriteCount":"0",
                "viewCount":"24953551"
            },
            "rating":{
                "numDislikes":"11099",
                "numLikes":"80541"
            }
        },
        {
            "id":"4EC7P5WdUko",
            "published":"2013-03-25T07:02:54.000Z",
            "updated":"2013-07-03T12:25:17.000Z",
            "title": 'World War Z TRAILER 2 (2013) - Brad Pitt Movie HD',
            "content":{
                "type":"application/x-shockwave-flash",
                "src":"http://www.youtube.com/v/4EC7P5WdUko?version=3&f=videos&app=youtube_gdata"
            },
            "link":"http://www.youtube.com/watch?v=4EC7P5WdUko",
            "author":{
                "name":"MovieclipsCOMINGSOON",
                "url":"http://www.youtube.com/user/MovieclipsCOMINGSOON"
            },
            "categories":[
                "Film & Animation"
            ],
            "duration":"152",
            "description":"Subscribe to TRAILERS: http://bit.ly/sxaw6h Subscribe to COMING SOON: http://bit.ly/H2vZUn Like us on FACEBOOK:http://goo.gl/dHs73. World War Z TRAILER #2 (2...",
            "thumbnails":[
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/default.jpg",
                    "width":120,
                    "height":90,
                    "name":"default"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/mqdefault.jpg",
                    "width":320,
                    "height":180,
                    "name":"mqdefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/hqdefault.jpg",
                    "width":480,
                    "height":360,
                    "name":"hqdefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/sddefault.jpg",
                    "width":640,
                    "height":480,
                    "name":"sddefault"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/1.jpg",
                    "width":120,
                    "height":90,
                    "name":"start"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/2.jpg",
                    "width":120,
                    "height":90,
                    "name":"middle"
                },
                {
                    "url":"http://i.ytimg.com/vi/4EC7P5WdUko/3.jpg",
                    "width":120,
                    "height":90,
                    "name":"end"
                }
            ],
            "statistics":{
                "favoriteCount":"0",
                "viewCount":"6989548"
            },
            "rating":{
                "numDislikes":"1219",
                "numLikes":"17238"
            }
        }
    ]

#### Example getById (youtube id, results) return object
    var youtube = require('youtube-node');

    youtube.getById('HcwTxRuq-uk', function(resultData) {
        console.log(resultData);
    });

#### Example getById resultData
    {
        "id":"HcwTxRuq-uk",
        "published":"2012-11-09T00:01:39.000Z",
        "updated":"2013-07-03T12:46:11.000Z",
        "title": 'World War Z - Official Trailer (HD)',
        "content":{
            "type":"application/x-shockwave-flash",
            "src":"http://www.youtube.com/v/HcwTxRuq-uk?version=3&f=videos&app=youtube_gdata"
        },
        "link":"http://www.youtube.com/watch?v=HcwTxRuq-uk",
        "author":{
            "name":"joblomovienetwork",
            "url":"http://www.youtube.com/user/joblomovienetwork"
        },
        "categories":[
            "Entertainment"
        ],
        "duration":"147",
        "description":"http://www.joblo.com - \"World War Z\" - Official Trailer Source: http://trailers.apple.com/trailers/paramount/worldwarz/ World War Z Twitter: https://twitter....",
        "thumbnails":[
            {
                   "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/default.jpg",
                "width":120,
                "height":90,
                "name":"default"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/mqdefault.jpg",
                "width":320,
                "height":180,
                "name":"mqdefault"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/hqdefault.jpg",
                "width":480,
                "height":360,
                "name":"hqdefault"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/sddefault.jpg",
                "width":640,
                "height":480,
                "name":"sddefault"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/1.jpg",
                "width":120,
                "height":90,
                "name":"start"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/2.jpg",
                "width":120,
                "height":90,
                "name":"middle"
            },
            {
                "url":"http://i.ytimg.com/vi/HcwTxRuq-uk/3.jpg",
                "width":120,
                "height":90,
                "name":"end"
            }
        ],
        "statistics":{
            "favoriteCount":"0",
            "viewCount":"24953551"
        },
        "rating":{
            "numDislikes":"11099",
            "numLikes":"80541"
        }
    }

#### version 0.0.1
- getById function
- search function

Last update: 2013-07-03

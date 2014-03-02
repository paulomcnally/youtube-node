# youtube-node [![Dependency Status](https://david-dm.org/paulomcnally/youtube-node.png)](https://david-dm.org/paulomcnally/youtube-node) [![NPM version](https://badge.fury.io/js/youtube-node.png)](http://badge.fury.io/js/youtube-node)

[![NPM](https://nodei.co/npm/youtube-node.png?downloads=true)](https://nodei.co/npm/youtube-node/)

### What's new in version 1.0.0?
* Youtube API v3
* Require key ([video](https://www.youtube.com/watch?v=Im69kzhpR3I))
* CLI

## CLI

For use CLI need install youtube-node using -g param.
    
    npm install youtube-node -g

#### CLI Example getById ( require key and video ID )

    $ youtube id


#### CLI Example search (require key, query and maxResults)
    
    $ youtube search

## Usage

#### Installation
    npm install youtube-node

#### Example search (search term, num results, results) return object
    var youtube = require('youtube-node');

    youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    youtube.search('World War z Trailer', 2, function(resultData) {
        console.log(resultData);
    });

#### Example search resultData

    {
      "kind": "youtube#searchListResponse",
      "etag": "\"BDC7VThyM9nfoSQm1_kOyhtJTEw/0MX1aovXL6JrPZ_tgqxLQ_YhGWI\"",
      "nextPageToken": "CAIQAA",
      "pageInfo": {
        "totalResults": 680321,
        "resultsPerPage": 2
      },
      "items": [
        {
          "kind": "youtube#searchResult",
          "etag": "\"BDC7VThyM9nfoSQm1_kOyhtJTEw/a-ZTQv003uYyrrI2GTNl4LqjzoA\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "HcwTxRuq-uk"
          },
          "snippet": {
            "publishedAt": "2012-11-09T00:01:39.000Z",
            "channelId": "UCRX7UEyE8kp35mPrgC2sosA",
            "title": "World War Z - Official Trailer (HD)",
            "description": "http://www.joblo.com - \"World War Z\" - Official Trailer Source: http://trailers.apple.com/trailers/paramount/worldwarz/ World War Z Twitter: https://twitter....",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/HcwTxRuq-uk/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/HcwTxRuq-uk/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/HcwTxRuq-uk/hqdefault.jpg"
              }
            },
            "channelTitle": "joblomovienetwork",
            "liveBroadcastContent": "none"
          }
        },
        {
          "kind": "youtube#searchResult",
          "etag": "\"BDC7VThyM9nfoSQm1_kOyhtJTEw/zGTXymwvzqbUAYTanZwl0i0aw6g\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "4EC7P5WdUko"
          },
          "snippet": {
            "publishedAt": "2013-03-25T07:02:54.000Z",
            "channelId": "UCkR0GY0ue02aMyM-oxwgg9g",
            "title": "World War Z TRAILER 2 (2013) - Brad Pitt Movie HD",
            "description": "Subscribe to TRAILERS: http://bit.ly/sxaw6h Subscribe to COMING SOON: http://bit.ly/H2vZUn Like us on FACEBOOK:http://goo.gl/dHs73. World War Z TRAILER ...",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/4EC7P5WdUko/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/4EC7P5WdUko/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/4EC7P5WdUko/hqdefault.jpg"
              }
            },
            "channelTitle": "MovieclipsCOMINGSOON",
            "liveBroadcastContent": "none"
          }
        }
      ]
    }

#### Example getById (youtube id, result) return object
    var youtube = require('youtube-node');

    youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    youtube.getById('HcwTxRuq-uk', function(resultData) {
        console.log(resultData);
    });

#### Example getById resultData

    {
      "kind": "youtube#video",
      "etag": "\"BDC7VThyM9nfoSQm1_kOyhtJTEw/301XkUzcSqfJxZpqiffqf_pbSuM\"",
      "id": "HcwTxRuq-uk",
      "snippet": {
        "publishedAt": "2012-11-09T00:01:39.000Z",
        "channelId": "UCRX7UEyE8kp35mPrgC2sosA",
        "title": "World War Z - Official Trailer (HD)",
        "description": "http://www.joblo.com - \"World War Z\" - Official Trailer\n\nSource: http://trailers.apple.com/trailers/paramount/worldwarz/\n\nWorld War Z Twitter: https://twitter.com/WorldWarZMovie\n\nA U.N. employee is racing against time and fate, as he travels the world trying to stop the outbreak of a deadly Zombie pandemic.\n\nOfficial Site: http://www.WorldWarZMovie.com\n\nDirector: Marc Forster\n\nCast: Brad Pitt, Mireille Enos , Daniella Kertesz , James Badge Dale, Matthew Fox\n\nWriters: Matthew Michael Carnahan",
        "thumbnails": {
          "default": {
            "url": "https://i1.ytimg.com/vi/HcwTxRuq-uk/default.jpg"
          },
          "medium": {
            "url": "https://i1.ytimg.com/vi/HcwTxRuq-uk/mqdefault.jpg"
          },
          "high": {
            "url": "https://i1.ytimg.com/vi/HcwTxRuq-uk/hqdefault.jpg"
          },
          "standard": {
            "url": "https://i1.ytimg.com/vi/HcwTxRuq-uk/sddefault.jpg"
          }
        },
        "channelTitle": "JoBlo Movie Trailers",
        "categoryId": "24",
        "liveBroadcastContent": "none"
      },
      "contentDetails": {
        "duration": "PT2M27S",
        "dimension": "2d",
        "definition": "hd",
        "caption": "false",
        "licensedContent": true
      },
      "status": {
        "uploadStatus": "processed",
        "privacyStatus": "public",
        "license": "youtube",
        "embeddable": true,
        "publicStatsViewable": true
      },
      "statistics": {
        "viewCount": "29491223",
        "likeCount": "87750",
        "dislikeCount": "11873",
        "favoriteCount": "0",
        "commentCount": "60487"
      }
    }

### For older version use:

    npm install youtube-node@0.0.4

**Older version use API v2 and is not recommended**
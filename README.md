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

#### Example search (query, results, results) return object
    var youtube = require('youtube-node');

    youtube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

    var query = {
        q: 'World War z Trailer',
        maxResults: 2
    };

    // More optional query params
    // `pageToken` where get it from search result for next and previouse page
    //results
    // `type` where get only specified type results. Acceptable values are:
    //`channel`, `playlist`, `video`
    // For more params find optional params from below link
    // https://developers.google.com/youtube/v3/docs/search/list#optional-parameters

    youtube.search(query function(resultData) {
        console.log(resultData);
    });

#### Example search resultData

    {
      "kind": "youtube#searchListResponse",
      "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/KhbRqsWUkwixPIUeycbUY5k60fI\"",
      "nextPageToken": "CAIQAA",
      "pageInfo": {
        "totalResults": 697,
        "resultsPerPage": 2
      },
      "items": [
        {
          "kind": "youtube#searchResult",
          "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/NWQjLmsZ3K_HY-N2cqBp8qllHec\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "RRTDXRZil5I"
          },
          "snippet": {
            "publishedAt": "2014-11-05T05:50:46.000Z",
            "channelId": "UC1lhH7Pgf-MXf8slhfahXbA",
            "title": "Selfi pulla full hd video song",
            "description": "Katthi video song.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/RRTDXRZil5I/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/RRTDXRZil5I/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/RRTDXRZil5I/hqdefault.jpg"
              }
            },
            "channelTitle": "gkummi88",
            "liveBroadcastContent": "none"
          }
        },
        {
          "kind": "youtube#searchResult",
          "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/nNWLu7fMw_C6vHgoNBn3l2kl2eo\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "XG7yz4vdrug"
          },
          "snippet": {
            "publishedAt": "2014-10-28T02:55:12.000Z",
            "channelId": "UCBbYkWqV5sNhqyXUZSEEm8Q",
            "title": "Selfi pulla full video song hd",
            "description": "Selfi pulla full video song hd.",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/XG7yz4vdrug/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/XG7yz4vdrug/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/XG7yz4vdrug/hqdefault.jpg"
              }
            },
            "channelTitle": "arunkumararun2786",
            "liveBroadcastContent": "none"
          }
        }
      ]
    }

#### Example search with pageToken

    var query = {
        q: 'World War z Trailer',
        maxResults: 2,
        pageToken: 'CAIQAA'
    };

    // More optional query params
    // `pageToken` where get it from search result for next and previouse page
    //results
    // `type` where get only specified type results. Acceptable values are:
    //`channel`, `playlist`, `video`
    // For more params find optional params from below link
    // https://developers.google.com/youtube/v3/docs/search/list#optional-parameters

    youtube.search(query function(resultData) {
        console.log(resultData);
    });

#### Example search resultData

    {
      "kind": "youtube#searchListResponse",
      "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/Ru6tLkM1HM0FyVslY7Ca2WBwANg\"",
      "nextPageToken": "CAQQAA",
      "prevPageToken": "CAIQAQ",
      "pageInfo": {
        "totalResults": 1000000,
        "resultsPerPage": 2
      },
      "items": [
        {
          "kind": "youtube#searchResult",
          "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/2hLQ_eyfOtvG1G26EaQ88nN--qI\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "cXuC_v0KWaU"
          },
          "snippet": {
            "publishedAt": "2012-11-09T04:37:33.000Z",
            "channelId": "UCA1tk_Wa3Lm4hMZ4ssPEuLw",
            "title": "World War Z - Trailer 1 - Official [HD]",
            "description": "World War Z Trailer Our first look at the new movie World War Z, based off the Max Brooks Novel \"World War Z\". The movie is to take on a different approach f...",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/cXuC_v0KWaU/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/cXuC_v0KWaU/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/cXuC_v0KWaU/hqdefault.jpg"
              }
            },
            "channelTitle": "TheMediaCows",
            "liveBroadcastContent": "none"
          }
        },
        {
          "kind": "youtube#searchResult",
          "etag": "\"yHwg34KvgIlW9-uBcSEkgasDbzI/pfxjahIdKXm8iGG4Vq1dXxfFhZQ\"",
          "id": {
            "kind": "youtube#video",
            "videoId": "OIao7wurFbQ"
          },
          "snippet": {
            "publishedAt": "2012-11-09T09:24:42.000Z",
            "channelId": "UCwKG44S4aQjptecj40-ItRQ",
            "title": "Exklusiv: World War Z - Trailer (Deutsch | German) | HD",
            "description": "Exklusiver, Offizieller Deutscher HD-Trailer zu World War Z mit Brad Pitt Abonniere uns! : http://www.youtube.com/subscription_center?add_user=moviepilottrai...",
            "thumbnails": {
              "default": {
                "url": "https://i.ytimg.com/vi/OIao7wurFbQ/default.jpg"
              },
              "medium": {
                "url": "https://i.ytimg.com/vi/OIao7wurFbQ/mqdefault.jpg"
              },
              "high": {
                "url": "https://i.ytimg.com/vi/OIao7wurFbQ/hqdefault.jpg"
              }
            },
            "channelTitle": "MoviepilotTrailer",
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

## Those who use it?
* [http://sync.club/](http://sync.club/#dev-session)

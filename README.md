# youtube-node [![Dependency Status](https://david-dm.org/paulomcnally/youtube-node.png)](https://david-dm.org/paulomcnally/youtube-node) [![NPM version](https://badge.fury.io/js/youtube-node.png)](http://badge.fury.io/js/youtube-node)

[![NPM](https://nodei.co/npm/youtube-node.png?downloads=true)](https://nodei.co/npm/youtube-node/)

### What's new in version 1.0.0?
* Youtube API v3
* Require key ([video](https://www.youtube.com/watch?v=Im69kzhpR3I))
* CLI

### What's new in version 1.0.1?
* You can use all [Optional parameters](https://developers.google.com/youtube/v3/docs/search/list)



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
    
    

#### Example searchWithParams (Optional parameters, result) return object

```

// example for get only the channel results
var _params = {
    type: 'channel',
    maxResults: 2
}
youtube.searchWithParams('World War z Trailer', _params, function (resultData) {
    console.log(JSON.stringify(resultData, null, 2));
});

``` 

#### Example searchWithParams resultData

```
{
  "kind": "youtube#searchListResponse",
  "etag": "\"bvxF-DWHx1toJotsdJBeCm43SLs/JblunK_nqB4vAhdAOU2VZQC6FsU\"",
  "nextPageToken": "CAIQAA",
  "pageInfo": {
    "totalResults": 5951,
    "resultsPerPage": 2
  },
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "\"bvxF-DWHx1toJotsdJBeCm43SLs/QUebYBs9o3WskzMh1tgCbgTgZNE\"",
      "id": {
        "kind": "youtube#channel",
        "channelId": "UCLNcDDCNr34B8JKarQElnbA"
      },
      "snippet": {
        "publishedAt": "2013-12-18T04:38:38.000Z",
        "channelId": "UCLNcDDCNr34B8JKarQElnbA",
        "title": "World War Z Full Movie Watch",
        "description": "World War Z full movie part 1 online stream and download World War Z Part 1 World War Z (2013) Full 1/12 2013 01 watch World War Z free part 1 World War Z ...",
        "thumbnails": {
          "default": {
            "url": "https://lh3.googleusercontent.com/-2Uctb2UAu8U/AAAAAAAAAAI/AAAAAAAAAAA/68hcLjXdDnU/photo.jpg"
          },
          "medium": {
            "url": "https://lh3.googleusercontent.com/-2Uctb2UAu8U/AAAAAAAAAAI/AAAAAAAAAAA/68hcLjXdDnU/photo.jpg"
          },
          "high": {
            "url": "https://lh3.googleusercontent.com/-2Uctb2UAu8U/AAAAAAAAAAI/AAAAAAAAAAA/68hcLjXdDnU/photo.jpg"
          }
        },
        "channelTitle": "",
        "liveBroadcastContent": "none"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "\"bvxF-DWHx1toJotsdJBeCm43SLs/FhtUC4IFgLOTh21jHjHYJyiLFmo\"",
      "id": {
        "kind": "youtube#channel",
        "channelId": "UCUA-Swslsl9MjbEvfPOs3xg"
      },
      "snippet": {
        "publishedAt": "2013-12-20T08:29:50.000Z",
        "channelId": "UCUA-Swslsl9MjbEvfPOs3xg",
        "title": "World War Z - Topic",
        "description": "World War Z is a 2013 British-American apocalyptic horror film directed by Marc Forster. The screenplay by Matthew Michael Carnahan, Drew Goddard and ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/i/UA-Swslsl9MjbEvfPOs3xg/1.jpg"
          },
          "medium": {
            "url": "https://i.ytimg.com/i/UA-Swslsl9MjbEvfPOs3xg/mq1.jpg"
          },
          "high": {
            "url": "https://i.ytimg.com/i/UA-Swslsl9MjbEvfPOs3xg/hq1.jpg"
          }
        },
        "channelTitle": "",
        "liveBroadcastContent": "none"
      }
    }
  ]
}
```
    
### For older version use:

    npm install youtube-node@0.0.4

**Older version use API v2 and is not recommended**

## Those who use it?
* [http://sync.club/](http://sync.club/#dev-session)

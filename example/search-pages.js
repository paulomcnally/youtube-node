var YouTube = require('../lib/youtube');
var config = require('./config');
var youTube = new YouTube();

youTube.setKey(config.key);

var query = 'World War z Trailer';

youTube.search(query, 5, function(error, result) {
	if (error) {
		console.log(error);
	}

	else {
		var perPage = 50;

		var videos = [];

		//todo: there's a better way of doing this - with async lib
		youTube.search(query, perPage, {pageToken: result.nextPageToken} , function(error, result) {
			console.log('Next Page Token = '+result.nextPageToken);
			
			result.items.forEach(function(video){
				videos.push(video);
			});

			youTube.search(query, perPage, {pageToken: result.nextPageToken} , function(error, result) {
				console.log('Next Page Token = '+result.nextPageToken);

				result.items.forEach(function(video){
					videos.push(video);
				});

				youTube.search(query, perPage, {pageToken: result.nextPageToken} , function(error, result) {
					console.log('Next Page Token = '+result.nextPageToken);

					result.items.forEach(function(video){
						videos.push(video);
					});

					youTube.search(query, perPage, {pageToken: result.nextPageToken} , function(error, result) {
						console.log('Next Page Token = '+result.nextPageToken);

						result.items.forEach(function(video){
							videos.push(video);
						});

						youTube.search(query, perPage, {pageToken: result.nextPageToken} , function(error, result) {
							console.log('Next Page Token = '+result.nextPageToken);

							result.items.forEach(function(video){
								videos.push(video);
							});

							console.log('Total # of videos = '+ videos.length)
						});
					});
				});
			});
		});
	}
});

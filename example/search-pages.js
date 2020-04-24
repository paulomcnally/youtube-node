const YouTube = require('../lib/youtube');
const config = require('./config');

const youTube = new YouTube();

youTube.setKey(config.key);

const query = 'World War z Trailer';

youTube.search(query, 5, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    const perPage = 50;

    const videos = [];

    // todo: there's a better way of doing this - with async lib
    youTube.search(query, perPage, { pageToken: result.nextPageToken }, (error, result) => {
      console.log(`Next Page Token = ${result.nextPageToken}`);

      result.items.forEach((video) => {
        videos.push(video);
      });

      youTube.search(query, perPage, { pageToken: result.nextPageToken }, (error, result) => {
        console.log(`Next Page Token = ${result.nextPageToken}`);

        result.items.forEach((video) => {
          videos.push(video);
        });

        youTube.search(query, perPage, { pageToken: result.nextPageToken }, (error, result) => {
          console.log(`Next Page Token = ${result.nextPageToken}`);

          result.items.forEach((video) => {
            videos.push(video);
          });

          youTube.search(query, perPage, { pageToken: result.nextPageToken }, (error, result) => {
            console.log(`Next Page Token = ${result.nextPageToken}`);

            result.items.forEach((video) => {
              videos.push(video);
            });

            youTube.search(query, perPage, { pageToken: result.nextPageToken }, (error, result) => {
              console.log(`Next Page Token = ${result.nextPageToken}`);

              result.items.forEach((video) => {
                videos.push(video);
              });

              console.log(`Total # of videos = ${videos.length}`);
            });
          });
        });
      });
    });
  }
});

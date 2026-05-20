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
    youTube.search(query, perPage, { pageToken: result.nextPageToken }, (err1, res1) => {
      console.log(`Next Page Token = ${res1.nextPageToken}`);

      res1.items.forEach((video) => {
        videos.push(video);
      });

      youTube.search(query, perPage, { pageToken: res1.nextPageToken }, (err2, res2) => {
        console.log(`Next Page Token = ${res2.nextPageToken}`);

        res2.items.forEach((video) => {
          videos.push(video);
        });

        youTube.search(query, perPage, { pageToken: res2.nextPageToken }, (err3, res3) => {
          console.log(`Next Page Token = ${res3.nextPageToken}`);

          res3.items.forEach((video) => {
            videos.push(video);
          });

          youTube.search(query, perPage, { pageToken: res3.nextPageToken }, (err4, res4) => {
            console.log(`Next Page Token = ${res4.nextPageToken}`);

            res4.items.forEach((video) => {
              videos.push(video);
            });

            youTube.search(query, perPage, { pageToken: res4.nextPageToken }, (err5, res5) => {
              console.log(`Next Page Token = ${res5.nextPageToken}`);

              res5.items.forEach((video) => {
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

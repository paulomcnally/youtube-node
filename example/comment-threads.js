const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Comment Threads (Issue #74)

const videoId = 'dQw4w9WgXcQ'; // Example video

// 1. Get comment threads for a video (ordered by relevance)
console.log('Getting comment threads for video...');
youTube.commentThreads.list({
  videoId: videoId,
  maxResults: 5,
  order: 'relevance'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Comment threads found:', response.items?.length);
    response.items?.forEach((thread) => {
      const topComment = thread.snippet?.topLevelComment?.snippet;
      console.log(`\n- Author: ${topComment?.authorDisplayName}`);
      console.log(`  Text: ${topComment?.textDisplay?.substring(0, 100)}...`);
      console.log(`  Replies: ${thread.snippet?.totalReplyCount}`);
    });
  }
});

// 2. Get comment threads ordered by time
console.log('\nGetting comment threads (by time)...');
youTube.commentThreads.list({
  videoId: videoId,
  maxResults: 5,
  order: 'time'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Recent comments:', response.items?.length);
  }
});

// 3. Get comment threads with search terms
console.log('\nSearching comment threads...');
youTube.commentThreads.list({
  videoId: videoId,
  maxResults: 5,
  searchTerms: 'great'
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Matching threads:', response.items?.length);
  }
});

// Example using Promise
youTube.commentThreads.listAsync({ videoId: videoId, maxResults: 3 })
  .then((response) => {
    console.log('\nComment threads (Promise):', response.items?.length);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

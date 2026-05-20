const YouTube = require('../dist/index.js').default;

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Example: Comments (Issue #75)

// 1. Get specific comments by IDs
console.log('Getting specific comments...');
// Note: Replace with actual comment IDs
const commentIds = ['Ugzxxxxxxxxxxxxxxxxxxx']; // Example comment IDs

youTube.comments.getComments({
  id: commentIds
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Comments found:', response.items?.length);
    response.items?.forEach((comment) => {
      console.log(`- ${comment.snippet?.authorDisplayName}: ${comment.snippet?.textDisplay?.substring(0, 50)}...`);
    });
  }
});

// 2. Get replies to a specific comment
// Note: Replace with an actual parent comment ID
const parentCommentId = 'Ugzxxxxxxxxxxxxxxxxxxx';
console.log('\nGetting replies to a comment...');
youTube.comments.getComments({
  parentId: parentCommentId,
  maxResults: 10
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Replies found:', response.items?.length);
    response.items?.forEach((reply) => {
      console.log(`- ${reply.snippet?.authorDisplayName}: ${reply.snippet?.textDisplay?.substring(0, 50)}...`);
    });
  }
});

// 3. Get multiple comments (using single ID)
console.log('\nGetting single comment...');
youTube.comments.getComments({
  id: 'Ugzxxxxxxxxxxxxxxxxxxx',
  maxResults: 1
}, (err, response) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Comment:');
    console.log(JSON.stringify(response.items?.[0], null, 2));
  }
});

// Example using Promise
youTube.comments.getCommentsAsync({ maxResults: 5 })
  .then((response) => {
    console.log('\nComments (Promise):', response.items?.length);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });

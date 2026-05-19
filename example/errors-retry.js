/**
 * Example of retry system and error handling
 */
const YouTube = require('../lib/youtube');

// Configure with retry options
const youTube = new YouTube({
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
    retryCondition: (error) => error.isRetriable(),
    onRetry: (error, attempt) => {
      console.log(`Retrying (attempt ${attempt}): ${error.message}`);
    },
  },
});

youTube.setKey(process.env.YOUTUBE_API_KEY || 'YOUR_API_KEY');

// Example 1: Usage with callback
console.log('Example 1: Search with callback and automatic retry');
youTube.search('Node.js tutorial', 5, (err, result) => {
  if (err) {
    // The error will be an instance of YouTubeError or its subclasses
    if (err instanceof YouTube.QuotaExceededError) {
      console.error('❌ Quota exceeded. Try again later.');
    } else if (err instanceof YouTube.InvalidKeyError) {
      console.error('❌ The API key is invalid.');
    } else if (err instanceof YouTube.RateLimitError) {
      console.error('❌ Rate limit reached. Wait a moment.');
    } else if (err instanceof YouTube.NetworkError) {
      console.error('❌ Network error:', err.message);
    } else {
      console.error('❌ Error:', err.message, err.code ? `(code: ${err.code})` : '');
    }
    return;
  }

  console.log(`✅ Found ${result.pageInfo.totalResults} results`);
  result.items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.snippet.title}`);
  });
});

// Example 2: Usage with Promises
console.log('\nExample 2: Usage with Promises and async/await');

async function getVideoInfo(videoId) {
  try {
    const result = await youTube.getByIdAsync(videoId);

    if (result.items && result.items.length > 0) {
      const video = result.items[0];
      console.log('✅ Video found:', video.snippet.title);
      console.log('   Views:', video.statistics.viewCount);
      console.log('   Likes:', video.statistics.likeCount);
    } else {
      console.log('⚠️ Video not found');
    }
  } catch (error) {
    // Specific error handling
    if (error.isNotFoundError && error.isNotFoundError()) {
      console.error('❌ Video does not exist:', videoId);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Example 3: Update retry options at runtime
console.log('\nExample 3: Change retry options dynamically');
youTube.setRetryOptions({
  retries: 5, // Increase to 5 retries
  retryDelay: 2000, // Wait 2 seconds between attempts
});

// Example 4: Error handling without retry
setTimeout(() => {
  console.log('\nExample 4: Creating instance without retry (only for 5xx errors)');
  const youTubeNoRetry = new YouTube({
    retryOptions: {
      retries: 0, // Disable retry
    },
  });

  youTubeNoRetry.setKey('INVALID_KEY');
  youTubeNoRetry.getById('dQw4w9WgXcQ', (err) => {
    if (err) {
      console.log('Error caught:', err.name);
      console.log('Message:', err.message);
      console.log('Is YouTube error:', err.isYouTubeError);
    }
  });
}, 2000);

// Run example 2 if API key exists
if (process.env.YOUTUBE_API_KEY) {
  getVideoInfo('dQw4w9WgXcQ');
} else {
  console.log('\n⚠️ To test, set the YOUTUBE_API_KEY environment variable');
}

/**
 * Example: Videos Upload
 * Requires OAuth + Upload scope
 *
 * Issue #85
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');

const youtube = new YouTube();

// NOTE: For OAuth operations, you need to configure the access token
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

// Upload video from file
async function uploadVideoExample() {
  try {
    const videoPath = './my-video.mp4';

    const result = await youtube.videos.upload(
      {
        snippet: {
          title: 'My Test Video',
          description: 'This is a video uploaded using youtube-node',
          tags: ['test', 'demo', 'youtube'],
          categoryId: '22', // People & Blogs
          defaultLanguage: 'en',
        },
        status: {
          privacyStatus: 'private', // public | private | unlisted
          embeddable: true,
          license: 'youtube', // youtube | creativeCommon
          publicStatsViewable: true,
        },
      },
      videoPath,
      {
        notifySubscribers: false,
      }
    );

    console.log('Video uploaded successfully!');
    console.log('Video ID:', result.id);
    console.log('URL:', `https://youtube.com/watch?v=${result.id}`);
  } catch (error) {
    console.error('Error uploading video:', error);
  }
}

// Upload video from Buffer
async function uploadFromBufferExample() {
  try {
    const videoBuffer = fs.readFileSync('./my-video.mp4');

    const result = await youtube.videos.upload(
      {
        snippet: {
          title: 'Video from Buffer',
          description: 'Video uploaded from a memory buffer',
          categoryId: '22',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      videoBuffer
    );

    console.log('Video uploaded:', result.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check video processing status
async function checkUploadStatusExample() {
  const videoId = 'VIDEO_ID_FROM_UPLOAD';

  try {
    const result = await youtube.videos.checkUploadStatus(videoId);
    console.log('Video status:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example with callbacks (legacy)
function uploadVideoCallbackExample() {
  youtube.videos.upload(
    {
      snippet: {
        title: 'Video with Callback',
        description: 'Video description',
      },
      status: {
        privacyStatus: 'private',
      },
    },
    './my-video.mp4',
    {},
    (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      console.log('Video uploaded:', result);
    }
  );
}

// Run examples
// uploadVideoExample();
// uploadFromBufferExample();
// checkUploadStatusExample();

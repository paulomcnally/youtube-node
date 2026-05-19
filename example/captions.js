/**
 * Example: Captions CRUD
 * Requires OAuth
 *
 * Issue #86
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');

const youtube = new YouTube();

// NOTE: For OAuth operations, you need to configure the access token
// youtube.setAccessToken('YOUR_OAUTH_ACCESS_TOKEN');

const VIDEO_ID = 'YOUR_VIDEO_ID';

// List captions for a video
async function listCaptionsExample() {
  try {
    const result = await youtube.captions.list(VIDEO_ID);
    console.log('Available captions:', result.items);

    if (result.items) {
      result.items.forEach(caption => {
        console.log(`- ${caption.id}: ${caption.snippet?.name} (${caption.snippet?.language})`);
      });
    }
  } catch (error) {
    console.error('Error listing captions:', error);
  }
}

// Upload caption from file
async function uploadCaptionExample() {
  try {
    const captionPath = './subtitles.srt';

    const result = await youtube.captions.upload(
      VIDEO_ID,
      'es', // Spanish language code
      captionPath,
      {
        name: 'Spanish',
        isDraft: false,
        isAutoSynced: false,
      }
    );

    console.log('Caption uploaded successfully!');
    console.log('Caption ID:', result.id);
  } catch (error) {
    console.error('Error uploading caption:', error);
  }
}

// Upload caption from Buffer
async function uploadFromBufferExample() {
  try {
    const captionBuffer = fs.readFileSync('./subtitles.srt');

    const result = await youtube.captions.upload(
      VIDEO_ID,
      'en', // English language code
      captionBuffer,
      {
        name: 'English',
        isDraft: false,
      }
    );

    console.log('Caption uploaded:', result.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Update existing caption
async function updateCaptionExample() {
  const captionId = 'CAPTION_ID_FROM_UPLOAD';

  try {
    const result = await youtube.captions.update(
      captionId,
      './new-subtitles.srt',
      {
        isDraft: false,
      }
    );

    console.log('Caption updated:', result);
  } catch (error) {
    console.error('Error updating caption:', error);
  }
}

// Delete caption
async function deleteCaptionExample() {
  const captionId = 'CAPTION_ID_TO_DELETE';

  try {
    await youtube.captions.delete(captionId);
    console.log('Caption deleted successfully');
  } catch (error) {
    console.error('Error deleting caption:', error);
  }
}

// Change draft status
async function setDraftStatusExample() {
  const captionId = 'CAPTION_ID';

  try {
    await youtube.captions.setDraftStatus(captionId, true); // true = draft, false = published
    console.log('Status updated');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Download caption
async function downloadCaptionExample() {
  const captionId = 'CAPTION_ID';

  try {
    const content = await youtube.captions.download(captionId, 'srt');
    fs.writeFileSync('./downloaded.srt', content);
    console.log('Caption downloaded');
  } catch (error) {
    console.error('Error downloading:', error);
  }
}

// Example with callbacks (legacy)
function uploadCaptionCallbackExample() {
  youtube.captions.upload(
    VIDEO_ID,
    'es',
    './subtitles.srt',
    {
      name: 'Spanish',
      isDraft: false,
    },
    (err, result) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      console.log('Caption uploaded:', result);
    }
  );
}

// Run examples
// listCaptionsExample();
// uploadCaptionExample();
// uploadFromBufferExample();
// updateCaptionExample();
// deleteCaptionExample();
// setDraftStatusExample();
// downloadCaptionExample();

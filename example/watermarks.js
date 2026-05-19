/**
 * Example: Watermarks (requires OAuth)
 *
 * This example shows how to manage watermarks for videos.
 *
 * Note: To use these methods you need an OAuth token with write
 * permissions on YouTube.
 */

const YouTube = require('../dist/index').default;
const fs = require('fs');
const path = require('path');

const youtube = new YouTube();

console.log('=== Example: Watermarks ===\n');

// Watermark restrictions
console.log('Restrictions:');
console.log('- Format: PNG or JPEG');
console.log('- Maximum size: 1MB');
console.log('- Recommended dimensions: 150x150 px');
console.log('');

// Timing types
console.log('Timing types:');
console.log('- fromStart: From the beginning of the video');
console.log('- fromEnd: From the end of the video');
console.log('- custom: Custom position');
console.log('');

// Example: Set watermark
async function setWatermarkExample() {
  try {
    const channelId = 'YOUR_CHANNEL_ID';
    const imagePath = './watermark.png'; // Path to your image

    // Timing configuration
    const timing = {
      type: 'fromStart',    // 'fromStart' | 'fromEnd' | 'custom'
      offsetMs: 5000,       // Appears at 5 seconds
      durationMs: 10000,    // Lasts 10 seconds
    };

    console.log('=== Set Watermark ===');
    console.log('Requires OAuth with write permissions');
    console.log('');
    console.log('Parameters:');
    console.log(`  Channel ID: ${channelId}`);
    console.log(`  Image: ${imagePath}`);
    console.log(`  Timing: ${JSON.stringify(timing, null, 2)}`);
    console.log('');

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log('Note: Create a watermark.png file to test this example');
      console.log('');
    }

    // const result = await youtube.watermarks.set(channelId, imagePath, timing);
    // console.log('Watermark set:', result);

    // You can also use a Buffer directly
    // const imageBuffer = fs.readFileSync(imagePath);
    // const result = await youtube.watermarks.set(channelId, imageBuffer, timing);
  } catch (error) {
    console.error('Error setting watermark:', error.message);
  }
}

// Example: Remove watermark
async function unsetWatermarkExample() {
  try {
    const channelId = 'YOUR_CHANNEL_ID';

    console.log('=== Remove Watermark ===');
    console.log('Requires OAuth with write permissions');
    console.log(`  Channel ID: ${channelId}`);
    console.log('');

    // const result = await youtube.watermarks.unset(channelId);
    // console.log('Watermark removed:', result);
  } catch (error) {
    console.error('Error removing watermark:', error.message);
  }
}

// Examples of different timing configurations
console.log('=== Timing Configurations ===\n');

console.log('1. Appear at the beginning for 10 seconds:');
console.log(JSON.stringify({
  type: 'fromStart',
  offsetMs: 0,
  durationMs: 10000,
}, null, 2));
console.log('');

console.log('2. Appear 5 seconds before the end:');
console.log(JSON.stringify({
  type: 'fromEnd',
  offsetMs: 5000,
  durationMs: 5000,
}, null, 2));
console.log('');

console.log('3. Appear at minute 2 for 15 seconds:');
console.log(JSON.stringify({
  type: 'custom',
  offsetMs: 120000,
  durationMs: 15000,
}, null, 2));
console.log('');

// Ejecutar ejemplos
setWatermarkExample();
setTimeout(() => unsetWatermarkExample(), 2000);

console.log('=== Referencia ===');
console.log('Documentación: https://developers.google.com/youtube/v3/docs/watermarks');

/**
 * Example: Report Abusive Videos (requires OAuth)
 *
 * This example shows how to report videos for inappropriate content.
 *
 * Note: To use these methods you need an OAuth token.
 */

const YouTube = require('../dist/index').default;

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

console.log('=== Example: Report Abusive Videos ===\n');

// Example: List report reasons
async function listAbuseReportReasons() {
  try {
    console.log('=== List report reasons ===\n');

    const result = await youtube.videoAbuseReportReasons.list();

    console.log(`Total reasons: ${result.items?.length || 0}`);
    console.log('');

    if (result.items) {
      result.items.forEach((reason, index) => {
        console.log(`[${index + 1}] ${reason.snippet?.label || 'No label'}`);
        console.log(`  ID: ${reason.id}`);

        if (reason.snippet?.secondaryReasons && reason.snippet.secondaryReasons.length > 0) {
          console.log('  Sub-reasons:');
          reason.snippet.secondaryReasons.forEach(subReason => {
            console.log(`    - ${subReason.label} (${subReason.id})`);
          });
        }
        console.log('');
      });
    }

    return result;
  } catch (error) {
    console.error('Error listing reasons:', error.message);
    return null;
  }
}

// Example: Report a video (requires OAuth)
async function reportVideoExample() {
  try {
    const videoId = 'VIDEO_ID_TO_REPORT';
    const reasonId = 'REASON_ID'; // Get from listAbuseReportReasons

    const options = {
      secondaryReasonId: 'SECONDARY_REASON_ID', // Optional
      comments: 'This video contains inappropriate content because...',
      language: 'en',
    };

    console.log('=== Report video ===');
    console.log('Requires OAuth');
    console.log('');
    console.log('Parameters:');
    console.log(`  Video ID: ${videoId}`);
    console.log(`  Reason ID: ${reasonId}`);
    console.log(`  Options: ${JSON.stringify(options, null, 2)}`);
    console.log('');

    // const result = await youtube.videoAbuseReportReasons.report(videoId, reasonId, options);
    // console.log('Video reported successfully:', result);
  } catch (error) {
    console.error('Error reporting video:', error.message);
  }
}

// Example: Full report flow
async function fullReportFlowExample() {
  console.log('=== Full report flow ===\n');
  console.log('1. Get the list of reasons:');
  console.log('   const reasons = await youtube.videoAbuseReportReasons.list();');
  console.log('');
  console.log('2. Select the appropriate reason:');
  console.log('   const reasonId = reasons.items[0].id;');
  console.log('');
  console.log('3. Report the video:');
  console.log('   await youtube.videoAbuseReportReasons.report(videoId, reasonId, {');
  console.log('     comments: "Description of the problem"');
  console.log('   });');
  console.log('');
}

// Common report reasons
console.log('=== Common report reasons ===\n');
console.log('The exact reasons you get from the API, but typically include:');
console.log('  - Sexual or nudity content');
console.log('  - Violent or repulsive content');
console.log('  - Harassment or bullying');
console.log('  - Dangerous or harmful activities');
console.log('  - Child abuse');
console.log('  - Terrorism promotion');
console.log('  - Spam or misleading content');
console.log('  - Copyright infringement');
console.log('');

// Run examples
listAbuseReportReasons();
setTimeout(() => reportVideoExample(), 2000);
setTimeout(() => fullReportFlowExample(), 4000);

console.log('=== Important notes ===');
console.log('- Use this power responsibly');
console.log('- Only report content that actually violates policies');
console.log('- False reports may have consequences');
console.log('- OAuth is required to report videos');
console.log('');

console.log('=== Reference ===');
console.log('Documentation:');
console.log('  - https://developers.google.com/youtube/v3/docs/videoAbuseReportReasons');
console.log('  - https://developers.google.com/youtube/v3/docs/videos/reportAbuse');

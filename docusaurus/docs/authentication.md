---
sidebar_position: 4
---

# Authentication

Learn how to authenticate your requests to the YouTube API.

## Authentication Types

YouTube Data API supports two types of authentication:

1. **API Key** - For reading public data (searches, videos, channels)
2. **OAuth 2.0** - For actions that require permissions (uploading videos, commenting, etc.)

## Get an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **YouTube Data API v3**
4. Go to "Credentials" and create an **API Key**
5. Copy the generated key

### Video Tutorial

For a visual guide, you can watch [this video](https://www.youtube.com/watch?v=Im69kzhpR3I) on how to get your API Key.

## Use the API Key

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();

// Configure your API Key
youTube.setKey('YOUR_API_KEY_HERE');

// Ready to use!
const videos = await youTube.search.query('nodejs', 10);
```

## OAuth 2.0 Authentication

For actions that modify data (uploading videos, commenting, subscribing), you need OAuth 2.0.

### Configure OAuth in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "Credentials" → "Create credentials" → "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URLs
5. Copy the **Client ID** and **Client Secret**

### Use OAuth in Your Code

```typescript
import { YouTubeAuth, YouTubeScopes } from 'youtube-node';

const auth = new YouTubeAuth({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/callback',
});

// Generate authorization URL
const authUrl = auth.generateAuthUrl({
  scope: [
    YouTubeScopes.READ_ONLY,
    YouTubeScopes.UPLOAD,
    YouTubeScopes.MANAGE,
  ],
});

console.log('Visit this URL:', authUrl);

// After obtaining the authorization code
const tokens = await auth.getTokens('AUTHORIZATION_CODE');

// Use the tokens
const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');
// Configure access token for OAuth requests
```

## OAuth Scopes

Scopes define what permissions you request:

| Scope | Description |
|-------|-------------|
| `YouTubeScopes.READ_ONLY` | Read-only data access |
| `YouTubeScopes.UPLOAD` | Upload videos |
| `YouTubeScopes.MANAGE` | Manage videos/channel |
| `YouTubeScopes.FORCE_SSL` | Requires secure connection |

## Configure Custom Headers

If your API Key has referer restrictions:

```typescript
const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Configure referer
youTube.setReferer('https://example.com');

// Or configure any header
youTube.setHeader('Referer', 'https://example.com');
youTube.setHeader('X-Custom-Header', 'value');
```

## Authentication Error Handling

```typescript
import { InvalidKeyError, QuotaExceededError } from 'youtube-node';

async function makeRequest() {
  try {
    const result = await youTube.videos.getById('VIDEO_ID');
    return result;
  } catch (error) {
    if (error instanceof InvalidKeyError) {
      console.error('Invalid API Key');
    } else if (error instanceof QuotaExceededError) {
      console.error('Quota exceeded. Try again later.');
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

## Best Practices

### 🔐 Security

- **Never** expose your API Key in client-side code
- Use environment variables to store keys
- Restrict your API Key by IP or referer in Google Cloud Console

### ⚡ Quota Optimization

- The YouTube API has quota limits
- Cache results when possible
- Use pagination for large datasets

```typescript
// Use environment variables
const API_KEY = process.env.YOUTUBE_API_KEY;
const youTube = new YouTube();
youTube.setKey(API_KEY);
```

## Common Errors

### "The request did not specify any referer"

Your API Key has referer restrictions but no header was sent:

```typescript
youTube.setReferer('https://yourdomain.com');
```

### "API key not valid"

- Verify the key is correct
- Make sure YouTube Data API v3 is enabled
- Check key restrictions

### "Daily Limit Exceeded"

You have exceeded your daily quota. Options:
- Wait until tomorrow
- Request more quota in Google Cloud Console
- Optimize your requests

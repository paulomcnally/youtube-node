# YouTube Node.js Client

<p align="center">
  <img src="https://img.shields.io/npm/v/youtube-node?style=for-the-badge&color=blue" alt="NPM Version">
  <img src="https://img.shields.io/npm/dm/youtube-node?style=for-the-badge&color=green" alt="NPM Downloads">
  <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

<p align="center">
  <strong>🚀 The most comprehensive YouTube Data API v3 client for Node.js</strong>
</p>

<p align="center">
  <a href="https://paulomcnally.github.io/youtube-node/">📖 Documentation</a> •
  <a href="https://paulomcnally.github.io/youtube-node/docs/quickstart">🚀 Quick Start</a> •
  <a href="https://github.com/paulomcnally/youtube-node/issues">💬 Issues</a> •
  <a href="#contributing">🤝 Contribute</a>
</p>

---

## ✨ Why youtube-node?

**youtube-node** is a modern, feature-rich client for the YouTube Data API v3, designed to make YouTube integration effortless:

- 📝 **Full TypeScript Support** — Complete type definitions included
- ⚡ **Promise-Based** — Native async/await support (no callbacks required!)
- 🔧 **CLI Included** — Command-line interface for quick operations
- 🛡️ **Smart Error Handling** — Specific error classes with retry logic
- 📦 **Lightweight** — Only 77KB, zero bloat
- 🔄 **Modular Design** — Clean API organized by resources
- 📄 **Pagination Built-in** — Handle large result sets easily
- 🔍 **Advanced Filtering** — Powerful search with multiple filters

---

## 📦 Installation

```bash
npm install youtube-node
```

Or with yarn/pnpm:

```bash
yarn add youtube-node
# or
pnpm add youtube-node
```

### CLI Installation (Optional)

```bash
npm install -g youtube-node
```

---

## 🚀 Quick Start

### 1. Get Your API Key

You'll need a YouTube Data API v3 key from Google Cloud:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create credentials → **API Key**

📹 [Video Tutorial](https://www.youtube.com/watch?v=Im69kzhpR3I)

### 2. Make Your First Request

```typescript
import YouTube from 'youtube-node';

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

// Search for videos
async function searchVideos() {
  const result = await youtube.search.query('nodejs tutorial', 10);
  
  console.log(`Found ${result.pageInfo?.totalResults} videos:`);
  result.items?.forEach((item, i) => {
    console.log(`${i + 1}. ${item.snippet?.title}`);
  });
}

searchVideos();
```

### 3. Get Video Details

```typescript
const video = await youtube.videos.getById('VIDEO_ID');

console.log('📺 Video Info:');
console.log(`Title: ${video.items?.[0]?.snippet?.title}`);
console.log(`Views: ${video.items?.[0]?.statistics?.viewCount}`);
console.log(`Likes: ${video.items?.[0]?.statistics?.likeCount}`);
```

---

## 📚 Complete Documentation

**🌐 [Full Documentation with Examples](https://paulomcnally.github.io/youtube-node/)**

Available in:
- 🇺🇸 English (default)
- 🇪🇸 Español

---

## 🎯 Features & Examples

### 🔍 Search

```typescript
// Basic search
const results = await youtube.search.query('javascript tutorials', 25);

// Advanced filtering
const hdVideos = await youtube.search.query('4k nature', 50, {
  type: 'video',              // 'video', 'channel', or 'playlist'
  videoDuration: 'medium',    // 'short', 'medium', 'long'
  videoDefinition: 'high',    // 'high' or 'standard'
  order: 'viewCount'          // 'date', 'rating', 'relevance', 'title', 'viewCount'
});

// Related videos
const related = await youtube.search.related('VIDEO_ID', 10);
```

### 📺 Videos

```typescript
// Get single video
const video = await youtube.videos.getById('VIDEO_ID');

// Get multiple videos at once
const videos = await youtube.videos.getByIds(['ID1', 'ID2', 'ID3']);

// Most popular videos
const popular = await youtube.videos.getMostPopular(10);

// Popular by category (10 = Music)
const music = await youtube.videos.getMostPopularByCategory(10, 10);

// Popular by region
const spain = await youtube.videos.getMostPopularByRegion(10, 'ES');
const usa = await youtube.videos.getMostPopularByRegion(10, 'US');
```

### 📺 Channels

```typescript
// Get channel by ID
const channel = await youtube.channels.getById('CHANNEL_ID');

// Get channel by username or handle
const byUsername = await youtube.channels.getByUsername('GoogleDevelopers');
const byHandle = await youtube.channels.getByUsername('@YouTube');

// Get your own channel (requires OAuth)
const myChannel = await youtube.channels.getMyChannel();
```

### 📋 Playlists

```typescript
// Get playlist info
const playlist = await youtube.playlists.getById('PLAYLIST_ID');

// Get playlist items
const items = await youtube.playlists.getItemsById('PLAYLIST_ID', 50);

// Get all playlists from a channel
const playlists = await youtube.playlists.getByChannel('CHANNEL_ID', {
  maxResults: 50
});
```

### 📄 Pagination

```typescript
// Get all results across multiple pages
async function getAllVideos(query: string) {
  const allVideos: any[] = [];
  let pageToken: string | undefined;
  
  do {
    const result = await youtube.search.query(query, 50, { pageToken });
    allVideos.push(...(result.items || []));
    pageToken = result.nextPageToken;
  } while (pageToken);
  
  return allVideos;
}
```

---

## 🛡️ Error Handling

The library provides specific error classes for better error handling:

```typescript
import { 
  YouTube, 
  QuotaExceededError, 
  InvalidKeyError, 
  RateLimitError 
} from 'youtube-node';

const youtube = new YouTube();
youtube.setKey('YOUR_API_KEY');

try {
  const video = await youtube.videos.getById('VIDEO_ID');
} catch (error) {
  if (error instanceof QuotaExceededError) {
    console.log('⚠️ API quota exceeded. Try again tomorrow.');
  } else if (error instanceof InvalidKeyError) {
    console.log('❌ Invalid API key. Check your credentials.');
  } else if (error instanceof RateLimitError) {
    console.log('⏳ Rate limit exceeded. Retrying automatically...');
  } else {
    console.log('Error:', error.message);
  }
}
```

### Automatic Retry

Configure automatic retry with exponential backoff:

```typescript
const youtube = new YouTube({
  retryOptions: {
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 30000,
    onRetry: (error, attempt) => {
      console.log(`🔄 Retry attempt ${attempt}: ${error.message}`);
    }
  }
});
```

---

## 💻 CLI Usage

Install globally to use the CLI:

```bash
npm install -g youtube-node
```

### Available Commands

```bash
# Search videos interactively
youtube search

# Get video details
youtube id
```

**CLI will prompt for:**
- API Key
- Search query / Video ID
- Max results

**Pro tip:** Set your API key as an environment variable:

```bash
export YOUTUBE_API_KEY="your-api-key"
youtube search
```

---

## 🔧 Advanced Configuration

### Custom Headers

If you get referer errors with restricted API keys:

```typescript
youtube.setReferer('https://yourdomain.com');
// or
youtube.setHeader('Referer', 'https://yourdomain.com');
```

### OAuth 2.0 (for write operations)

For uploading videos, commenting, or managing your channel:

```typescript
import { YouTubeAuth, YouTubeScopes } from 'youtube-node';

const auth = new YouTubeAuth({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000/callback',
});

const authUrl = auth.generateAuthUrl({
  scope: [YouTubeScopes.READ_ONLY, YouTubeScopes.UPLOAD],
});
```

📖 [Full OAuth Guide](https://paulomcnally.github.io/youtube-node/docs/authentication)

---

## 📊 API Coverage

| Resource | Read | Write | OAuth Required |
|----------|------|-------|----------------|
| Videos | ✅ | ✅ Upload/Update/Delete | Write: Yes |
| Channels | ✅ | ✅ Update | Yes |
| Playlists | ✅ | ✅ CRUD | Write: Yes |
| Comments | ✅ | ✅ CRUD | Yes |
| Subscriptions | ✅ | ✅ Subscribe/Unsubscribe | Yes |
| Captions | ✅ | ✅ CRUD | Yes |
| Search | ✅ | ❌ | No |
| Activities | ✅ | ❌ | Read own: Yes |
| Channel Sections | ✅ | ✅ CRUD | Yes |
| Video Categories | ✅ | ❌ | No |

---

## 🏗️ TypeScript Support

Full TypeScript definitions included. No need for `@types/youtube-node`:

```typescript
import YouTube, { YtResult, VideoItem } from 'youtube-node';

const youtube = new YouTube();

// Full autocomplete and type checking
async function getVideo(videoId: string): Promise<VideoItem | undefined> {
  const result: YtResult = await youtube.videos.getById(videoId);
  return result.items?.[0];
}
```

---

## 🧪 Testing

```bash
# Clone repository
git clone https://github.com/paulomcnally/youtube-node.git
cd youtube-node

# Install dependencies
pnpm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run eslint
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 🐛 Issues & Support

- 🐛 [Report bugs](https://github.com/paulomcnally/youtube-node/issues)
- 💡 [Request features](https://github.com/paulomcnally/youtube-node/issues)
- 📧 Email: paulomcnally@gmail.com

---

## 🏢 Who's Using youtube-node?

* [Sync Club](http://sync.club/) — Music synchronization platform

*[Add your project here!](https://github.com/paulomcnally/youtube-node/edit/master/README.md)*

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/paulomcnally">Paulo McNally</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/youtube-node">
    <img src="https://nodei.co/npm/youtube-node.png?downloads=true&stars=true" alt="NPM">
  </a>
</p>

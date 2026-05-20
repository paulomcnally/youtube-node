---
sidebar_position: 1
slug: /
---

# Introduction

`youtube-node` is a **YouTube API v3** client for **Node.js** written in TypeScript with full type support.

## Key Features

✨ **Native Promise Support** - Use async/await or .then()/.catch()  
📝 **Full TypeScript** - Complete typing included  
🔧 **CLI Included** - Command line interface included  
🔄 **Backward Compatible** - Callback support still available  
⚡ **Modular Resources** - API organized by resources (videos, channels, etc.)  
🛡️ **Error Handling** - Specific error classes  
📄 **Pagination** - Full support for pagination  
🔍 **Advanced Filters** - Search with multiple filters  

## What Can You Do?

With this library you can:

- 🔍 **Search videos, channels and playlists** on YouTube
- 📹 **Get detailed information** about videos, channels and playlists
- 💬 **Manage comments** (list, add, reply, delete)
- 📋 **Work with playlists** (create, update, delete)
- ⭐ **Manage subscriptions** (subscribe, unsubscribe)
- 📝 **Upload videos** to your channel
- 🎬 **Manage captions/subtitles**
- 🖼️ **Set custom thumbnails**
- ⬆️ **Like/dislike** videos
- 🌍 **Get popular videos** by category or region

## Quick Install

```bash
npm install youtube-node
```

## Quick Example

```typescript
import YouTube from 'youtube-node';

const youTube = new YouTube();
youTube.setKey('YOUR_API_KEY');

// Search videos
async function searchVideos() {
  const result = await youTube.search.query('nodejs tutorial', 10);
  console.log(`Found ${result.pageInfo?.totalResults} videos`);
}

searchVideos();
```

## Requirements

- **Node.js** 18 or higher
- A **YouTube Data API v3 API Key** ([Get API Key](https://developers.google.com/youtube/v3/getting-started))

## License

MIT License - see [LICENSE](https://github.com/paulomcnally/youtube-node/blob/main/LICENSE) for more details.

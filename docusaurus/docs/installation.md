---
sidebar_position: 2
---

# Installation

This guide will help you install and configure `youtube-node` in your project.

## Install with npm

```bash
npm install youtube-node
```

## Install with yarn

```bash
yarn add youtube-node
```

## Install with pnpm

```bash
pnpm add youtube-node
```

## Global Installation (for CLI)

If you want to use the command line interface (CLI):

```bash
npm install -g youtube-node
```

## Verify Installation

```typescript
import YouTube from 'youtube-node';

const youtube = new YouTube();
console.log('youtube-node installed correctly ✅');
```

## Dependencies

The library automatically includes these dependencies:

- `axios` - HTTP client
- `@colors/colors` - Colors for CLI
- `prompt` - CLI interaction

## TypeScript

If you use TypeScript, types are automatically included. You don't need to install `@types/youtube-node`.

```typescript
import YouTube from 'youtube-node';  // Complete typing included ✅
```

## Next Steps

- [Configure your API Key](./authentication.md)
- [Quick Start Guide](./quickstart.md)

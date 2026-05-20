/**
 * Sidebars en Español para youtube-node
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introducción',
      items: [
        'intro',
        'installation',
        'quickstart',
        'authentication',
      ],
    },
    {
      type: 'category',
      label: 'Recursos API',
      items: [
        'api/videos',
        'api/channels',
        'api/search',
        'api/playlists',
        'api/comments',
        'api/subscriptions',
        'api/captions',
        'api/activities',
        'api/channel-sections',
        'api/video-categories',
      ],
    },
    {
      type: 'category',
      label: 'Guías Avanzadas',
      items: [
        'guides/error-handling',
        'guides/pagination',
        'guides/oauth',
        'guides/upload-video',
        'guides/cli',
      ],
    },
    {
      type: 'category',
      label: 'Tipado TypeScript',
      items: [
        'typescript/types',
        'typescript/interfaces',
      ],
    },
  ],
};

module.exports = sidebars;

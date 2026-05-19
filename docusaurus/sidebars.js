/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
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

export default sidebars;

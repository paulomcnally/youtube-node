// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'youtube-node',
  tagline: 'YouTube API v3 client for Node.js with full TypeScript support',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://paulomcnally.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/youtube-node/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'paulomcnally', // Usually your GitHub org/user name.
  projectName: 'youtube-node', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Internationalization settings
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      es: {
        label: 'Español',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/paulomcnally/youtube-node/tree/main/docusaurus/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/paulomcnally/youtube-node/tree/main/docusaurus/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'youtube-node',
        logo: {
          alt: 'YouTube Node Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/paulomcnally/youtube-node',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
              },
              {
                label: 'Quick Start',
                to: '/docs/quickstart',
              },
            ],
          },
          {
            title: 'API Resources',
            items: [
              {
                label: 'Videos',
                to: '/docs/api/videos',
              },
              {
                label: 'Channels',
                to: '/docs/api/channels',
              },
              {
                label: 'Search',
                to: '/docs/api/search',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/paulomcnally/youtube-node',
              },
              {
                label: 'Issues',
                href: 'https://github.com/paulomcnally/youtube-node/issues',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/youtube-node',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} youtube-node. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['typescript', 'javascript', 'bash'],
      },
    }),
};

export default config;

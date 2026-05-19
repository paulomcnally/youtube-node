// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'youtube-node',
  tagline: 'Cliente de YouTube API v3 para Node.js con soporte completo de TypeScript',
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

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
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
            label: 'Documentación',
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
            title: 'Documentación',
            items: [
              {
                label: 'Introducción',
                to: '/docs/intro',
              },
              {
                label: 'Instalación',
                to: '/docs/installation',
              },
              {
                label: 'Guía Rápida',
                to: '/docs/quickstart',
              },
            ],
          },
          {
            title: 'Recursos API',
            items: [
              {
                label: 'Videos',
                to: '/docs/api/videos',
              },
              {
                label: 'Canales',
                to: '/docs/api/channels',
              },
              {
                label: 'Búsqueda',
                to: '/docs/api/search',
              },
            ],
          },
          {
            title: 'Comunidad',
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
        copyright: `Copyright © ${new Date().getFullYear()} youtube-node. Hecho con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['typescript', 'javascript', 'bash'],
      },
    }),
};

export default config;

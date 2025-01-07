import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Xinyu Ma',
  tagline: 'Personal website',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.xinyu-ma.us',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'zjkmxy', // Usually your GitHub org/user name.
  projectName: 'zjkmxy.github.io', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    format: "detect"
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          blogSidebarCount: 10,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Xinyu Ma',
      logo: {
        alt: 'Xinyu Ma Logo',
        src: 'img/profile.jpg',
      },
      items: [
        {
          // sidebarId: 'myWorkSidebar',
          position: 'left',
          label: 'Resume',
          to: '/docs/my-work/CV',
        },
        {
          // sidebarId: 'myWorkSidebar',
          position: 'left',
          label: 'Publications',
          to: '/docs/my-work/publications',
        },
        {
          // sidebarId: 'myWorkSidebar',
          position: 'left',
          label: 'Talks',
          to: '/docs/my-work/talks',
        },
        {
          // sidebarId: 'myWorkSidebar',
          position: 'left',
          label: 'Projects',
          to: '/docs/category/projects',
        },
        {
          // sidebarId: 'knowledgeSidebar',
          position: 'left',
          label: 'Knowledge Base',
          to: '/docs/knowledge',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/zjkmxy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Experience',
        //   items: [
        //     {
        //       label: 'Publications',
        //       to: '/docs/intro',
        //     },
        //   ],
        // },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: 'GitHub',
        //       href: 'https://github.com/zjkmxy',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Xinyu Ma. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['protobuf', 'go', 'yaml', 'json', 'cpp', 'graphql', 'http'],
    },
    tableOfContents: {
      minHeadingLevel: 2,
    }
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
      crossorigin: 'anonymous',
    }
  ],

  future: {
    experimental_faster: true,
  }
};

export default config;

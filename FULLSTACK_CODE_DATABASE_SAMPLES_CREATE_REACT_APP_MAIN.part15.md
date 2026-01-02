---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 15
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 15 of 37)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - create-react-app-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/create-react-app-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: using-https-in-development.md]---
Location: create-react-app-main/docusaurus/docs/using-https-in-development.md

```text
---
id: using-https-in-development
title: Using HTTPS in Development
sidebar_label: HTTPS in Development
---

> Note: this feature is available with `react-scripts@0.4.0` and higher.

You may require the dev server to serve pages over HTTPS. One particular case where this could be useful is when using [the "proxy" feature](proxying-api-requests-in-development.md) to proxy requests to an API server when that API server is itself serving HTTPS.

To do this, set the `HTTPS` environment variable to `true`, then start the dev server as usual with `npm start`:

### Windows (cmd.exe)

```cmd
set HTTPS=true&&npm start
```

(Note: the lack of whitespace is intentional.)

### Windows (Powershell)

```Powershell
($env:HTTPS = "true") -and (npm start)
```

### Linux, macOS (Bash)

```sh
HTTPS=true npm start
```

Note that the server will use a self-signed certificate, so your web browser will almost definitely display a warning upon accessing the page.

## Custom SSL certificate

To set a custom certificate, set the `SSL_CRT_FILE` and `SSL_KEY_FILE` environment variables to the path of the certificate and key files in the same way you do for `HTTPS` above. Note that you will also need to set `HTTPS=true`.

### Linux, macOS (Bash)

```bash
HTTPS=true SSL_CRT_FILE=cert.crt SSL_KEY_FILE=cert.key npm start
```

To avoid having to set the environment variable each time, you can either include in the `npm start` script like so:

```json
{
  "start": "HTTPS=true react-scripts start"
}
```

Or you can create a `.env` file with `HTTPS=true` set.
[Learn more about environment variables in CRA](https://create-react-app.dev/docs/adding-custom-environment-variables).
```

--------------------------------------------------------------------------------

---[FILE: using-the-public-folder.md]---
Location: create-react-app-main/docusaurus/docs/using-the-public-folder.md

```text
---
id: using-the-public-folder
title: Using the Public Folder
---

> Note: this feature is available with `react-scripts@0.5.0` and higher.

## Changing the HTML

The `public` folder contains the HTML file so you can tweak it, for example, to [set the page title](title-and-meta-tags.md).
The `<script>` tag with the compiled code will be added to it automatically during the build process.

## Adding Assets Outside of the Module System

You can also add other assets to the `public` folder.

Note that we normally encourage you to `import` assets in JavaScript files instead.
For example, see the sections on [adding a stylesheet](adding-a-stylesheet.md) and [adding images and fonts](adding-images-fonts-and-files.md).
This mechanism provides a number of benefits:

- Scripts and stylesheets get minified and bundled together to avoid extra network requests.
- Missing files cause compilation errors instead of 404 errors for your users.
- Result filenames include content hashes so you don’t need to worry about browsers caching their old versions.

However there is an **escape hatch** that you can use to add an asset outside of the module system.

If you put a file into the `public` folder, it will **not** be processed by webpack. Instead it will be copied into the build folder untouched. To reference assets in the `public` folder, you need to use an environment variable called `PUBLIC_URL`.

Inside `index.html`, you can use it like this:

```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

Only files inside the `public` folder will be accessible by `%PUBLIC_URL%` prefix. If you need to use a file from `src` or `node_modules`, you’ll have to copy it there to explicitly specify your intention to make this file a part of the build.

When you run `npm run build`, Create React App will substitute `%PUBLIC_URL%` with a correct absolute path so your project works even if you use client-side routing or host it at a non-root URL.

In JavaScript code, you can use `process.env.PUBLIC_URL` for similar purposes:

```js
render() {
  // Note: this is an escape hatch and should be used sparingly!
  // Normally we recommend using `import` for getting asset URLs
  // as described in “Adding Images and Fonts” above this section.
  return <img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
}
```

Keep in mind the downsides of this approach:

- None of the files in `public` folder get post-processed or minified.
- Missing files will not be called at compilation time, and will cause 404 errors for your users.
- Result filenames won’t include content hashes so you’ll need to add query arguments or rename them every time they change.

## When to Use the `public` Folder

Normally we recommend importing [stylesheets](adding-a-stylesheet.md), [images, and fonts](adding-images-fonts-and-files.md) from JavaScript.
The `public` folder is useful as a workaround for a number of less common cases:

- You need a file with a specific name in the build output, such as [`manifest.webmanifest`](https://developer.mozilla.org/en-US/docs/Web/Manifest).
- You have thousands of images and need to dynamically reference their paths.
- You want to include a small script like [`pace.js`](https://codebyzach.github.io/pace/docs/) outside of the bundled code.
- Some libraries may be incompatible with webpack and you have no other option but to include it as a `<script>` tag.

Note that if you add a `<script>` that declares global variables, you should read the topic [Using Global Variables](using-global-variables.md) in the next section which explains how to reference them.
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: create-react-app-main/docusaurus/website/.gitignore

```text
# dependencies
/node_modules

# production
/build

# generated files
.docusaurus
.cache-loader

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

--------------------------------------------------------------------------------

---[FILE: docusaurus.config.js]---
Location: create-react-app-main/docusaurus/website/docusaurus.config.js

```javascript
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const siteConfig = {
  title: 'Create React App',
  tagline:
    'Create React App has been deprecated. Please visit react.dev for modern options.',
  url: 'https://create-react-app.dev',
  baseUrl: '/',
  projectName: 'create-react-app',
  organizationName: 'facebook',
  favicon: 'img/favicon/favicon.ico',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.json'),
          editUrl:
            'https://github.com/facebook/create-react-app/edit/main/docusaurus/website',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/logo-og.png',
    announcementBar: {
      id: 'deprecated',
      content:
        'Create React App is deprecated. <a target="_blank" rel="noopener noreferrer" href="https://react.dev/link/cra">Read more here</a>.',
      backgroundColor: '#20232a',
      textColor: '#fff',
      isCloseable: false,
    },
    algolia: {
      appId: 'AUJYIQ70HN',
      apiKey: '25243dbf9049cf036e87f64b361bd2b9',
      indexName: 'create-react-app',
    },
    navbar: {
      title: 'Create React App',
      logo: {
        alt: 'Create React App Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/getting-started', label: 'Docs', position: 'right' },
        {
          href: 'https://reactjs.org/community/support.html',
          label: 'Help',
          position: 'right',
        },
        {
          href: 'https://www.github.com/facebook/create-react-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Learn React',
              href: 'https://reactjs.org/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/create-react-app',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/facebook/create-react-app/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/reactjs',
            },
            {
              label: 'Contributor Covenant',
              href: 'https://www.contributor-covenant.org/version/1/4/code-of-conduct',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://www.github.com/facebook/create-react-app',
            },
          ],
        },
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
    },
  },
};

module.exports = siteConfig;
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/docusaurus/website/package.json
Signals: React

```json
{
  "name": "cra-docs",
  "private": true,
  "scripts": {
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy"
  },
  "dependencies": {
    "@docusaurus/core": "^2.0.0-alpha.64",
    "@docusaurus/preset-classic": "^2.0.0-alpha.64",
    "clsx": "^1.1.1",
    "react": "^16.12.0",
    "react-dom": "^16.12.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: create-react-app-main/docusaurus/website/README.md

```text
# Website

This website is built using Docusaurus 2, a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=1 npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
```

--------------------------------------------------------------------------------

---[FILE: sidebars.json]---
Location: create-react-app-main/docusaurus/website/sidebars.json

```json
{
  "docs": {
    "Welcome": ["documentation-intro"],
    "Getting Started": [
      "getting-started",
      "folder-structure",
      "available-scripts",
      "supported-browsers-features",
      "updating-to-new-releases"
    ],
    "Development": [
      "setting-up-your-editor",
      "developing-components-in-isolation",
      "analyzing-the-bundle-size",
      "using-https-in-development"
    ],
    "Styles and Assets": [
      "adding-a-stylesheet",
      "adding-a-css-modules-stylesheet",
      "adding-a-sass-stylesheet",
      "adding-css-reset",
      "post-processing-css",
      "adding-images-fonts-and-files",
      "loading-graphql-files",
      "using-the-public-folder",
      "code-splitting"
    ],
    "Building your App": [
      "installing-a-dependency",
      "importing-a-component",
      "using-global-variables",
      "adding-bootstrap",
      "adding-flow",
      "adding-typescript",
      "adding-relay",
      "adding-a-router",
      "adding-custom-environment-variables",
      "making-a-progressive-web-app",
      "measuring-performance",
      "production-build"
    ],
    "Testing": ["running-tests", "debugging-tests"],
    "Back-End Integration": [
      "proxying-api-requests-in-development",
      "fetching-data-with-ajax-requests",
      "integrating-with-an-api-backend",
      "title-and-meta-tags"
    ],
    "Deployment": ["deployment"],
    "Advanced Usage": [
      "custom-templates",
      "can-i-use-decorators",
      "pre-rendering-into-static-html-files",
      "advanced-configuration",
      "alternatives-to-ejecting"
    ],
    "Support": ["troubleshooting"]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: custom.css]---
Location: create-react-app-main/docusaurus/website/src/css/custom.css

```text
:root {
  --ifm-color-primary: #09d3ac;
  --ifm-color-primary-dark: rgb(8, 190, 155);
  --ifm-color-primary-darker: rgb(8, 179, 146);
  --ifm-color-primary-darkest: rgb(6, 148, 120);
  --ifm-color-primary-light: rgb(46, 218, 184);
  --ifm-color-primary-lighter: rgb(83, 224, 197);
  --ifm-color-primary-lightest: rgb(132, 233, 214);
}

@media screen and (max-width: 996px) {
  :root {
    --ifm-font-size-base: 15px;
  }
}

@media screen and (min-width: 997px) {
  :root {
    --ifm-font-size-base: 17px;
  }
}

.docusaurus-highlight-code-line {
  background-color: rgb(72, 77, 91);
  display: block;
  margin: 0 calc(-1 * var(--ifm-pre-padding));
  padding: 0 var(--ifm-pre-padding);
}

.navbar .navbar__brand > strong {
  flex-shrink: 0;
  max-width: 100%;
}

/* Announcement banner */

:root {
  --docusaurus-announcement-bar-height: auto !important;
}

div[class^='announcementBar'][role='banner'] {
  border-bottom-color: var(--deepdark);
}

div[class^='announcementBarContent'] {
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
  padding: 8px 30px;
}

div[class^='announcementBarContent'] a {
  text-decoration: underline;
  display: inline-block;
  color: var(--ifm-color-primary) !important;
}

div[class^='announcementBarContent'] a:hover {
  color: var(--brand) !important;
}

@media only screen and (max-width: 768px) {
  .announcement {
    font-size: 18px;
  }
}

@media only screen and (max-width: 500px) {
  .announcement {
    font-size: 15px;
    line-height: 22px;
    padding: 6px 30px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: create-react-app-main/docusaurus/website/src/pages/index.js
Signals: React

```javascript
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import clsx from 'clsx';

import styles from './styles.module.css';

const features = [
  {
    title: 'Less to Learn',
    content:
      "You don't need to learn and configure many build tools. Instant reloads help you focus on development. When it's time to deploy, your bundles are optimized automatically.",
  },
  {
    title: 'Only One Dependency',
    content:
      'Your app only needs one build dependency. We test Create React App to make sure that all of its underlying pieces work together seamlessly – no complicated version mismatches.',
  },
  {
    title: 'No Lock-In',
    content:
      'Under the hood, we use webpack, Babel, ESLint, and other amazing projects to power your app. If you ever want an advanced configuration, you can ”eject” from Create React App and edit their config files directly.',
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      permalink={'/'}
      description={'Set up a modern web app by running one command.'}
    >
      <Head>
        <meta name="robots" content="noindex" />
        <title>Create React App is deprecated.</title>
        <meta
          name="description"
          content="Create React App is deprecated. Please see react.dev for modern options."
        />
        <meta property="og:title" content="Create React App is deprecated." />
        <meta
          property="og:description"
          content="Create React App is deprecated. Please see react.dev for modern options."
        />
      </Head>
      <div className={clsx('hero hero--dark', styles.heroBanner)}>
        <div className="container">
          <img
            className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
            alt="Create React App logo"
            src={useBaseUrl('img/logo.svg')}
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.getStarted}>
            <Link
              className="button button--outline button--primary button--lg"
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {features && features.length && (
        <div className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map(({ title, content }, idx) => (
                <div key={idx} className={clsx('col col--4', styles.feature)}>
                  <h2>{title}</h2>
                  <p>{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.gettingStartedSection}>
        <div className="container padding-vert--xl text--left">
          <div className="row">
            <div className="col col--4 col--offset-1">
              <h2>Get started in seconds</h2>
              <p>
                Whether you’re using React or another library, Create React App
                lets you <strong>focus on code, not build tools</strong>.
                <br />
                <br />
                To create a project called <i>my-app</i>, run this command:
              </p>
              <CodeBlock className="language-sh">
                npx create-react-app my-app
              </CodeBlock>
              <br />
            </div>
            <div className="col col--5 col--offset-1">
              <img
                className={styles.featureImage}
                alt="Easy to get started in seconds"
                src={
                  'https://camo.githubusercontent.com/29765c4a32f03bd01d44edef1cd674225e3c906b/68747470733a2f2f63646e2e7261776769742e636f6d2f66616365626f6f6b2f6372656174652d72656163742d6170702f323762343261632f73637265656e636173742e737667'
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container padding-vert--xl text--left">
          <div className="row">
            <div className="col col--4 col--offset-1">
              <img
                className={styles.featureImage}
                alt="Easy to update"
                src={useBaseUrl('img/update.png')}
              />
            </div>
            <div className="col col--5 col--offset-1">
              <h2>Easy to Maintain</h2>
              <p>
                Updating your build tooling is typically a daunting and
                time-consuming task. When new versions of Create React App are
                released, you can upgrade using a single command:
              </p>
              <CodeBlock className="language-sh">
                npm install react-scripts@latest
              </CodeBlock>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
```

--------------------------------------------------------------------------------

---[FILE: styles.module.css]---
Location: create-react-app-main/docusaurus/website/src/pages/styles.module.css

```text
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

.heroBanner {
  padding: 2.5rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.heroBannerLogo {
  max-width: 170px;
  max-height: 170px;
}

@media screen and (max-width: 966px) {
  .heroBanner {
    padding: 2rem;
  }
}

.getStarted {
  display: flex;
  align-items: center;
  justify-content: center;
}

.features {
  display: flex;
  align-items: center;
  padding: 4rem 0;
  width: 100%;
}

.featureImage {
  margin: 0 auto;
}

.gettingStartedSection {
  background-color: #f7f7f7;
}

html[data-theme='dark'] .gettingStartedSection {
  background-color: #33363b;
}
```

--------------------------------------------------------------------------------

---[FILE: CNAME]---
Location: create-react-app-main/docusaurus/website/static/CNAME

```text
create-react-app.dev
```

--------------------------------------------------------------------------------

````

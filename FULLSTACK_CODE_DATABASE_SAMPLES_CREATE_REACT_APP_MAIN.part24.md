---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 24
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 24 of 37)

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

---[FILE: webpackHotDevClient.js]---
Location: create-react-app-main/packages/react-dev-utils/webpackHotDevClient.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// This alternative WebpackDevServer combines the functionality of:
// https://github.com/webpack/webpack-dev-server/blob/webpack-1/client/index.js
// https://github.com/webpack/webpack/blob/webpack-1/hot/dev-server.js

// It only supports their simplest configuration (hot updates on same server).
// It makes some opinionated choices on top, like adding a syntax error overlay
// that looks similar to our console output. The error overlay is inspired by:
// https://github.com/glenjamin/webpack-hot-middleware

var stripAnsi = require('strip-ansi');
var url = require('url');
var launchEditorEndpoint = require('./launchEditorEndpoint');
var formatWebpackMessages = require('./formatWebpackMessages');
var ErrorOverlay = require('react-error-overlay');

ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
  // Keep this sync with errorOverlayMiddleware.js
  fetch(
    launchEditorEndpoint +
      '?fileName=' +
      window.encodeURIComponent(errorLocation.fileName) +
      '&lineNumber=' +
      window.encodeURIComponent(errorLocation.lineNumber || 1) +
      '&colNumber=' +
      window.encodeURIComponent(errorLocation.colNumber || 1)
  );
});

// We need to keep track of if there has been a runtime error.
// Essentially, we cannot guarantee application state was not corrupted by the
// runtime error. To prevent confusing behavior, we forcibly reload the entire
// application. This is handled below when we are notified of a compile (code
// change).
// See https://github.com/facebook/create-react-app/issues/3096
var hadRuntimeError = false;
ErrorOverlay.startReportingRuntimeErrors({
  onError: function () {
    hadRuntimeError = true;
  },
  filename: '/static/js/bundle.js',
});

if (module.hot && typeof module.hot.dispose === 'function') {
  module.hot.dispose(function () {
    // TODO: why do we need this?
    ErrorOverlay.stopReportingRuntimeErrors();
  });
}

// Connect to WebpackDevServer via a socket.
var connection = new WebSocket(
  url.format({
    protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
    hostname: process.env.WDS_SOCKET_HOST || window.location.hostname,
    port: process.env.WDS_SOCKET_PORT || window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: process.env.WDS_SOCKET_PATH || '/ws',
    slashes: true,
  })
);

// Unlike WebpackDevServer client, we won't try to reconnect
// to avoid spamming the console. Disconnect usually happens
// when developer stops the server.
connection.onclose = function () {
  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info(
      'The development server has disconnected.\nRefresh the page if necessary.'
    );
  }
};

// Remember some state related to hot module replacement.
var isFirstCompilation = true;
var mostRecentCompilationHash = null;
var hasCompileErrors = false;

function clearOutdatedErrors() {
  // Clean up outdated compile errors, if any.
  if (typeof console !== 'undefined' && typeof console.clear === 'function') {
    if (hasCompileErrors) {
      console.clear();
    }
  }
}

// Successful compilation.
function handleSuccess() {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onHotUpdateSuccess() {
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      tryDismissErrorOverlay();
    });
  }
}

// Compilation with warnings (e.g. ESLint).
function handleWarnings(warnings) {
  clearOutdatedErrors();

  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  function printWarnings() {
    // Print warnings to the console.
    var formatted = formatWebpackMessages({
      warnings: warnings,
      errors: [],
    });

    if (typeof console !== 'undefined' && typeof console.warn === 'function') {
      for (var i = 0; i < formatted.warnings.length; i++) {
        if (i === 5) {
          console.warn(
            'There were more warnings in other files.\n' +
              'You can find a complete log in the terminal.'
          );
          break;
        }
        console.warn(stripAnsi(formatted.warnings[i]));
      }
    }
  }

  printWarnings();

  // Attempt to apply hot updates or reload.
  if (isHotUpdate) {
    tryApplyUpdates(function onSuccessfulHotUpdate() {
      // Only dismiss it when we're sure it's a hot update.
      // Otherwise it would flicker right before the reload.
      tryDismissErrorOverlay();
    });
  }
}

// Compilation with errors (e.g. syntax error or missing modules).
function handleErrors(errors) {
  clearOutdatedErrors();

  isFirstCompilation = false;
  hasCompileErrors = true;

  // "Massage" webpack messages.
  var formatted = formatWebpackMessages({
    errors: errors,
    warnings: [],
  });

  // Only show the first error.
  ErrorOverlay.reportBuildError(formatted.errors[0]);

  // Also log them to the console.
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    for (var i = 0; i < formatted.errors.length; i++) {
      console.error(stripAnsi(formatted.errors[i]));
    }
  }

  // Do not attempt to reload now.
  // We will reload on next success instead.
}

function tryDismissErrorOverlay() {
  if (!hasCompileErrors) {
    ErrorOverlay.dismissBuildError();
  }
}

// There is a newer version of the code available.
function handleAvailableHash(hash) {
  // Update last known compilation hash.
  mostRecentCompilationHash = hash;
}

// Handle messages from the server.
connection.onmessage = function (e) {
  var message = JSON.parse(e.data);
  switch (message.type) {
    case 'hash':
      handleAvailableHash(message.data);
      break;
    case 'still-ok':
    case 'ok':
      handleSuccess();
      break;
    case 'content-changed':
      // Triggered when a file from `contentBase` changed.
      window.location.reload();
      break;
    case 'warnings':
      handleWarnings(message.data);
      break;
    case 'errors':
      handleErrors(message.data);
      break;
    default:
    // Do nothing.
  }
};

// Is there a newer version of this code available?
function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by webpack.
  return mostRecentCompilationHash !== __webpack_hash__;
}

// webpack disallows updates in other states.
function canApplyUpdates() {
  return module.hot.status() === 'idle';
}

function canAcceptErrors() {
  // NOTE: This var is injected by Webpack's DefinePlugin, and is a boolean instead of string.
  const hasReactRefresh = process.env.FAST_REFRESH;

  const status = module.hot.status();
  // React refresh can handle hot-reloading over errors.
  // However, when hot-reload status is abort or fail,
  // it indicates the current update cannot be applied safely,
  // and thus we should bail out to a forced reload for consistency.
  return hasReactRefresh && ['abort', 'fail'].indexOf(status) === -1;
}

// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates(onHotUpdateSuccess) {
  if (!module.hot) {
    // HotModuleReplacementPlugin is not in webpack configuration.
    window.location.reload();
    return;
  }

  if (!isUpdateAvailable() || !canApplyUpdates()) {
    return;
  }

  function handleApplyUpdates(err, updatedModules) {
    const haveErrors = err || hadRuntimeError;
    // When there is no error but updatedModules is unavailable,
    // it indicates a critical failure in hot-reloading,
    // e.g. server is not ready to serve new bundle,
    // and hence we need to do a forced reload.
    const needsForcedReload = !err && !updatedModules;
    if ((haveErrors && !canAcceptErrors()) || needsForcedReload) {
      window.location.reload();
      return;
    }

    if (typeof onHotUpdateSuccess === 'function') {
      // Maybe we want to do something.
      onHotUpdateSuccess();
    }

    if (isUpdateAvailable()) {
      // While we were updating, there was a new update! Do it again.
      tryApplyUpdates();
    }
  }

  // https://webpack.github.io/docs/hot-module-replacement.html#check
  var result = module.hot.check(/* autoApply */ true, handleApplyUpdates);

  // // webpack 2 returns a Promise instead of invoking a callback
  if (result && result.then) {
    result.then(
      function (updatedModules) {
        handleApplyUpdates(null, updatedModules);
      },
      function (err) {
        handleApplyUpdates(err, null);
      }
    );
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc]---
Location: create-react-app-main/packages/react-dev-utils/__tests__/.eslintrc

```text
{
  "env": {
    "jest": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getCSSModuleLocalIdent.test.js]---
Location: create-react-app-main/packages/react-dev-utils/__tests__/getCSSModuleLocalIdent.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const getCSSModuleLocalIdent = require('../getCSSModuleLocalIdent');

const rootContext = '/path';
const defaultClassName = 'class';
const options = { context: undefined, hashPrefix: '', regExp: null };

const tests = [
  {
    resourcePath: '/path/to/file.module.css',
    expected: 'file_class__jqNYY',
  },
  {
    resourcePath: '/path/to/file.module.scss',
    expected: 'file_class__BjEjJ',
  },
  {
    resourcePath: '/path/to/file.module.sass',
    expected: 'file_class__dINZX',
  },
  {
    resourcePath: '/path/to/file.name.module.css',
    expected: 'file_name_class__XpUJW',
  },
];

describe('getCSSModuleLocalIdent', () => {
  tests.forEach(test => {
    const { className = defaultClassName, expected, resourcePath } = test;
    it(JSON.stringify({ resourcePath, className }), () => {
      const ident = getCSSModuleLocalIdent(
        {
          resourcePath,
          rootContext,
        },
        '[hash:base64]',
        className,
        options
      );
      expect(ident).toBe(expected);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: getPublicUrlOrPath.test.js]---
Location: create-react-app-main/packages/react-dev-utils/__tests__/getPublicUrlOrPath.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const getPublicUrlOrPath = require('../getPublicUrlOrPath');

const tests = [
  // DEVELOPMENT with homepage
  { dev: true, homepage: '/', expect: '/' },
  { dev: true, homepage: '/test', expect: '/test/' },
  { dev: true, homepage: '/test/', expect: '/test/' },
  { dev: true, homepage: './', expect: '/' },
  { dev: true, homepage: '../', expect: '/' },
  { dev: true, homepage: '../test', expect: '/' },
  { dev: true, homepage: './test/path', expect: '/' },
  { dev: true, homepage: 'https://create-react-app.dev/', expect: '/' },
  {
    dev: true,
    homepage: 'https://create-react-app.dev/test',
    expect: '/test/',
  },
  // DEVELOPMENT with publicURL
  { dev: true, publicUrl: '/', expect: '/' },
  { dev: true, publicUrl: '/test', expect: '/test/' },
  { dev: true, publicUrl: '/test/', expect: '/test/' },
  { dev: true, publicUrl: './', expect: '/' },
  { dev: true, publicUrl: '../', expect: '/' },
  { dev: true, publicUrl: '../test', expect: '/' },
  { dev: true, publicUrl: './test/path', expect: '/' },
  { dev: true, publicUrl: 'https://create-react-app.dev/', expect: '/' },
  {
    dev: true,
    publicUrl: 'https://create-react-app.dev/test',
    expect: '/test/',
  },
  // DEVELOPMENT with publicURL and homepage
  { dev: true, publicUrl: '/', homepage: '/test', expect: '/' },
  { dev: true, publicUrl: '/test', homepage: '/path', expect: '/test/' },
  { dev: true, publicUrl: '/test/', homepage: '/test/path', expect: '/test/' },
  { dev: true, publicUrl: './', homepage: '/test', expect: '/' },
  { dev: true, publicUrl: '../', homepage: '/test', expect: '/' },
  { dev: true, publicUrl: '../test', homepage: '/test', expect: '/' },
  { dev: true, publicUrl: './test/path', homepage: '/test', expect: '/' },
  {
    dev: true,
    publicUrl: 'https://create-react-app.dev/',
    homepage: '/test',
    expect: '/',
  },
  {
    dev: true,
    publicUrl: 'https://create-react-app.dev/test',
    homepage: '/path',
    expect: '/test/',
  },

  // PRODUCTION with homepage
  { dev: false, homepage: '/', expect: '/' },
  { dev: false, homepage: '/test', expect: '/test/' },
  { dev: false, homepage: '/test/', expect: '/test/' },
  { dev: false, homepage: './', expect: './' },
  { dev: false, homepage: '../', expect: '../' },
  { dev: false, homepage: '../test', expect: '../test/' },
  { dev: false, homepage: './test/path', expect: './test/path/' },
  { dev: false, homepage: 'https://create-react-app.dev/', expect: '/' },
  {
    dev: false,
    homepage: 'https://create-react-app.dev/test',
    expect: '/test/',
  },
  // PRODUCTION with publicUrl
  { dev: false, publicUrl: '/', expect: '/' },
  { dev: false, publicUrl: '/test', expect: '/test/' },
  { dev: false, publicUrl: '/test/', expect: '/test/' },
  { dev: false, publicUrl: './', expect: './' },
  { dev: false, publicUrl: '../', expect: '../' },
  { dev: false, publicUrl: '../test', expect: '../test/' },
  { dev: false, publicUrl: './test/path', expect: './test/path/' },
  {
    dev: false,
    publicUrl: 'https://create-react-app.dev/',
    expect: 'https://create-react-app.dev/',
  },
  {
    dev: false,
    publicUrl: 'https://create-react-app.dev/test',
    expect: 'https://create-react-app.dev/test/',
  },
  // PRODUCTION with publicUrl and homepage
  { dev: false, publicUrl: '/', homepage: '/test', expect: '/' },
  { dev: false, publicUrl: '/test', homepage: '/path', expect: '/test/' },
  { dev: false, publicUrl: '/test/', homepage: '/test/path', expect: '/test/' },
  { dev: false, publicUrl: './', homepage: '/test', expect: './' },
  { dev: false, publicUrl: '../', homepage: '/test', expect: '../' },
  { dev: false, publicUrl: '../test', homepage: '/test', expect: '../test/' },
  {
    dev: false,
    publicUrl: './test/path',
    homepage: '/test',
    expect: './test/path/',
  },
  {
    dev: false,
    publicUrl: 'https://create-react-app.dev/',
    homepage: '/test',
    expect: 'https://create-react-app.dev/',
  },
  {
    dev: false,
    publicUrl: 'https://create-react-app.dev/test',
    homepage: '/path',
    expect: 'https://create-react-app.dev/test/',
  },
];

describe('getPublicUrlOrPath', () => {
  tests.forEach(t =>
    it(JSON.stringify(t), () => {
      const actual = getPublicUrlOrPath(t.dev, t.homepage, t.publicUrl);
      expect(actual).toBe(t.expect);
    })
  );
});
```

--------------------------------------------------------------------------------

---[FILE: ignoredFiles.test.js]---
Location: create-react-app-main/packages/react-dev-utils/__tests__/ignoredFiles.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const ignoredFiles = require('../ignoredFiles');

describe('ignore watch files regex', () => {
  it('normal file', () => {
    const appSrc = '/root/src/';
    const isIgnored = ignoredFiles(appSrc).test('/foo');
    const isIgnoredInSrc = ignoredFiles(appSrc).test('/root/src/foo');

    expect(isIgnored).toBe(false);
    expect(isIgnoredInSrc).toBe(false);
  });

  it('node modules', () => {
    const appSrc = '/root/src/';
    const isIgnored = ignoredFiles(appSrc).test('/root/node_modules/foo');

    expect(isIgnored).toBe(true);
  });

  it('node modules inside source directory', () => {
    const appSrc = '/root/src/';
    const isIgnored = ignoredFiles(appSrc).test('/root/src/node_modules/foo');
    const isIgnoredMoreThanOneLevel = ignoredFiles(appSrc).test(
      '/root/src/bar/node_modules/foo'
    );

    expect(isIgnored).toBe(false);
    expect(isIgnoredMoreThanOneLevel).toBe(false);
  });

  it('path contains source directory', () => {
    const appSrc = '/root/src/';
    const isIgnored = ignoredFiles(appSrc).test(
      '/bar/root/src/node_modules/foo'
    );

    expect(isIgnored).toBe(true);
  });

  it('path starts with source directory', () => {
    const appSrc = '/root/src/';
    const isIgnored = ignoredFiles(appSrc).test('/root/src2/node_modules/foo');

    expect(isIgnored).toBe(true);
  });
});
```

--------------------------------------------------------------------------------

---[FILE: .babelrc]---
Location: create-react-app-main/packages/react-error-overlay/.babelrc

```text
{
  "presets": ["react-app"]
}
```

--------------------------------------------------------------------------------

---[FILE: .flowconfig]---
Location: create-react-app-main/packages/react-error-overlay/.flowconfig

```text
[include]
<PROJECT_ROOT>/src/**/*.js

[ignore]
.*/node_modules/.*
.*/.git/.*
.*/__test__/.*
.*/fixtures/.*

[libs]
flow/

[options]
module.file_ext=.js
sharedmemory.hash_table_pow=19
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: create-react-app-main/packages/react-error-overlay/.gitattributes

```text
*.js text eol=lf
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: create-react-app-main/packages/react-error-overlay/.gitignore

```text
lib/
coverage/
```

--------------------------------------------------------------------------------

---[FILE: .npmignore]---
Location: create-react-app-main/packages/react-error-overlay/.npmignore

```text
__tests__
*.test.js
*.spec.js
```

--------------------------------------------------------------------------------

---[FILE: build.js]---
Location: create-react-app-main/packages/react-error-overlay/build.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const webpack = require('webpack');
const chalk = require('chalk');
const webpackConfig = require('./webpack.config.js');
const iframeWebpackConfig = require('./webpack.config.iframe.js');
const rimraf = require('rimraf');
const chokidar = require('chokidar');

const args = process.argv.slice(2);
const watchMode = args[0] === '--watch' || args[0] === '-w';

const isCI =
  process.env.CI &&
  (typeof process.env.CI !== 'string' ||
    process.env.CI.toLowerCase() !== 'false');

function build(config, name, callback) {
  console.log(chalk.cyan('Compiling ' + name));
  webpack(config).run((error, stats) => {
    if (error) {
      console.log(chalk.red('Failed to compile.'));
      console.log(error.message || error);
      console.log();
    }

    if (stats.compilation.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log(stats.toString({ all: false, errors: true }));
    }

    if (stats.compilation.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log(stats.toString({ all: false, warnings: true }));
    }

    // Fail the build if running in a CI server
    if (
      error ||
      stats.compilation.errors.length ||
      stats.compilation.warnings.length
    ) {
      isCI && process.exit(1);
      return;
    }

    console.log(
      stats.toString({ colors: true, modules: false, version: false })
    );
    console.log();

    callback(stats);
  });
}

function runBuildSteps() {
  build(iframeWebpackConfig, 'iframeScript.js', () => {
    build(webpackConfig, 'index.js', () => {
      console.log(chalk.bold.green('Compiled successfully!\n\n'));
    });
  });
}

function setupWatch() {
  const watcher = chokidar.watch('./src', {
    ignoreInitial: true,
  });

  watcher.on('change', runBuildSteps);
  watcher.on('add', runBuildSteps);

  watcher.on('ready', () => {
    runBuildSteps();
  });

  process.on('SIGINT', function () {
    watcher.close();
    process.exit(0);
  });

  watcher.on('error', error => {
    console.error('Watcher failure', error);
    process.exit(1);
  });
}

// Clean up lib folder
rimraf('lib/', () => {
  console.log('Cleaned up the lib folder.\n');
  watchMode ? setupWatch() : runBuildSteps();
});
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: create-react-app-main/packages/react-error-overlay/LICENSE

```text
MIT License

Copyright (c) 2013-present, Facebook, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/packages/react-error-overlay/package.json
Signals: React

```json
{
  "name": "react-error-overlay",
  "version": "6.1.0",
  "description": "An overlay for displaying stack frames.",
  "main": "lib/index.js",
  "sideEffects": false,
  "scripts": {
    "start": "cross-env NODE_ENV=development node build.js --watch",
    "test": "cross-env NODE_ENV=test jest",
    "build": "cross-env NODE_ENV=development node build.js",
    "build:prod": "cross-env NODE_ENV=production node build.js",
    "flow": "flow"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/create-react-app.git",
    "directory": "packages/react-error-overlay"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/facebook/create-react-app/issues"
  },
  "keywords": [
    "overlay",
    "syntax",
    "error",
    "red",
    "box",
    "redbox",
    "crash",
    "warning"
  ],
  "author": "Joe Haddad <timer150@gmail.com>",
  "files": [
    "lib/index.js"
  ],
  "devDependencies": {
    "@babel/code-frame": "^7.16.0",
    "@babel/core": "^7.16.0",
    "anser": "^2.1.0",
    "babel-jest": "^27.4.2",
    "babel-loader": "^8.2.3",
    "babel-preset-react-app": "^10.1.0",
    "chalk": "^4.1.2",
    "chokidar": "^3.5.2",
    "cross-env": "^7.0.3",
    "flow-bin": "^0.116.0",
    "html-entities": "^2.3.2",
    "jest": "^27.4.3",
    "jest-fetch-mock": "^3.0.3",
    "object-assign": "^4.1.1",
    "promise": "^8.1.0",
    "raw-loader": "^4.0.2",
    "react": "^17.0.2",
    "react-app-polyfill": "^3.0.0",
    "react-dom": "^17.0.2",
    "rimraf": "^3.0.2",
    "settle-promise": "^1.0.0",
    "source-map": "^0.5.7",
    "webpack": "^5.64.4"
  },
  "jest": {
    "setupFiles": [
      "./src/__tests__/setupJest.js"
    ],
    "collectCoverage": true,
    "coverageReporters": [
      "json"
    ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.js?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).js?(x)"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/fixtures/",
      "setupJest.js"
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: create-react-app-main/packages/react-error-overlay/README.md

```text
# `react-error-overlay`

`react-error-overlay` is an overlay which displays when there is a runtime error.

## Development

When developing within this package, make sure you run `npm start` (or `yarn start`) so that the files are compiled as you work.
This is run in watch mode by default.

If you would like to build this for production, run `npm run build:prod` (or `yarn build:prod`).<br>
If you would like to build this one-off for development, you can run `NODE_ENV=development npm run build` (or `NODE_ENV=development yarn build`).
```

--------------------------------------------------------------------------------

---[FILE: webpack.config.iframe.js]---
Location: create-react-app-main/packages/react-error-overlay/webpack.config.iframe.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/iframeScript.js',
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'iframe-bundle.js',
  },
  module: {
    rules: [
      {
        oneOf: [
          // Source
          {
            test: /\.js$/,
            include: [path.resolve(__dirname, './src')],
            use: {
              loader: 'babel-loader',
            },
          },
          // Dependencies
          {
            test: /\.js$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  ['babel-preset-react-app/dependencies', { helpers: true }],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      // This code is embedded as a string, so it would never be optimized
      // elsewhere.
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            comparisons: false,
          },
          output: {
            comments: false,
            ascii_only: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // We set process.env.NODE_ENV to 'production' so that React is built
      // in production mode.
      'process.env': { NODE_ENV: '"production"' },
      // This prevents our bundled React from accidentally hijacking devtools.
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({})',
    }),
  ],
  performance: false,
};
```

--------------------------------------------------------------------------------

---[FILE: webpack.config.js]---
Location: create-react-app-main/packages/react-error-overlay/webpack.config.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'index.js',
    library: 'ReactErrorOverlay',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /iframe-bundle\.js$/,
        use: 'raw-loader',
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      iframeScript$: path.resolve(__dirname, './lib/iframe-bundle.js'),
    },
    fallback: {
      fs: false,
      path: false,
    },
  },
  optimization: {
    nodeEnv: false,
  },
  performance: {
    hints: false,
  },
};
```

--------------------------------------------------------------------------------

---[FILE: bundle-default.json]---
Location: create-react-app-main/packages/react-error-overlay/fixtures/bundle-default.json
Signals: React

```json
[
  {
    "functionName": "App.componentDidMount",
    "fileName": "http://localhost:3000/static/js/bundle.js",
    "lineNumber": 26122,
    "columnNumber": 21,
    "_originalFunctionName": "App.componentDidMount",
    "_originalFileName": "webpack:///packages/react-scripts/template/src/App.js",
    "_originalLineNumber": 7,
    "_originalColumnNumber": 0,
    "_scriptCode": [
      {
        "lineNumber": 26119,
        "content": "  _createClass(App, [{",
        "highlight": false
      },
      {
        "lineNumber": 26120,
        "content": "    key: 'componentDidMount',",
        "highlight": false
      },
      {
        "lineNumber": 26121,
        "content": "    value: function componentDidMount() {",
        "highlight": false
      },
      {
        "lineNumber": 26122,
        "content": "      document.body.missing();",
        "highlight": true
      },
      {
        "lineNumber": 26123,
        "content": "    }",
        "highlight": false
      },
      {
        "lineNumber": 26124,
        "content": "  }, {",
        "highlight": false
      },
      {
        "lineNumber": 26125,
        "content": "    key: 'render',",
        "highlight": false
      }
    ],
    "_originalScriptCode": [
      {
        "lineNumber": 4,
        "content": "",
        "highlight": false
      },
      {
        "lineNumber": 5,
        "content": "class App extends Component {",
        "highlight": false
      },
      {
        "lineNumber": 6,
        "content": "  componentDidMount() {",
        "highlight": false
      },
      {
        "lineNumber": 7,
        "content": "    document.body.missing()",
        "highlight": true
      },
      {
        "lineNumber": 8,
        "content": "  }",
        "highlight": false
      },
      {
        "lineNumber": 9,
        "content": "",
        "highlight": false
      },
      {
        "lineNumber": 10,
        "content": "  render() {",
        "highlight": false
      }
    ]
  }
]
```

--------------------------------------------------------------------------------

````

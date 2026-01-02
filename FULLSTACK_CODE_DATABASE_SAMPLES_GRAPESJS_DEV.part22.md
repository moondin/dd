---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 22
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 22 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: utils.spec.ts]---
Location: grapesjs-dev/packages/cli/test/utils.spec.ts

```typescript
import {
  isFunction,
  isObject,
  isString,
  isUndefined,
  printRow,
  printError,
  log,
  ensureDir,
  normalizeJsonOpt,
  buildWebpackArgs,
  copyRecursiveSync,
  babelConfig,
  originalRequire,
  resolve,
  rootResolve,
} from '../src/utils';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import * as process from 'process';

const typeTestValues = {
  undefinedValue: undefined,
  nullValue: null,
  stringValue: 'hello',
  emptyObject: {},
  nonEmptyObject: { key: 'value' },
  emptyArray: [],
  functionValue: () => {},
  numberValue: 42,
  booleanValue: true,
  dateValue: new Date(),
};

function runTypeCheck(typeCheckFunction: (value: any) => boolean) {
  const keysWithPassingTypeChecks = Object.keys(typeTestValues).filter((key) => {
    const value = typeTestValues[key];
    return typeCheckFunction(value);
  });

  return keysWithPassingTypeChecks;
}

jest.mock('fs');
jest.mock('fs/promises');

describe('utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isString', () => {
    it('should correctly identify strings', () => {
      const result = runTypeCheck(isString);
      expect(result).toEqual(['stringValue']);
    });
  });

  describe('isUndefined', () => {
    it('should correctly identify undefined values', () => {
      const result = runTypeCheck(isUndefined);
      expect(result).toEqual(['undefinedValue']);
    });
  });

  describe('isFunction', () => {
    it('should correctly identify functions', () => {
      const result = runTypeCheck(isFunction);
      expect(result).toEqual(['functionValue']);
    });
  });

  describe('isObject', () => {
    it('should correctly identify objects', () => {
      const result = runTypeCheck(isObject);
      expect(result).toEqual(['emptyObject', 'nonEmptyObject', 'dateValue']);
    });
  });

  describe('printRow', () => {
    // TODO: We should refactor the function to make lineDown a boolean not a number
    it('should console.log the given string with the specified color and line breaks', () => {
      const str = 'Test string';
      const color = 'blue';
      const lineDown = 1;

      console.log = jest.fn() as jest.Mock;

      printRow(str, { color, lineDown });

      expect(console.log).toHaveBeenCalledTimes(3); // 1 for empty line, 1 for colored string, 1 for line break
      expect((console.log as jest.Mock).mock.calls[1][0]).toEqual(chalk[color].bold(str));
    });

    it('should not add a line break if lineDown is false', () => {
      const str = 'Test string';
      const color = 'green';
      const lineDown = 0;

      console.log = jest.fn();

      printRow(str, { color, lineDown });

      expect(console.log).toHaveBeenCalledTimes(2); // 1 for empty line, 1 for colored string
    });
  });

  describe('printError', () => {
    it('should print the given string in red', () => {
      const str = 'Error message';

      (console.log as jest.Mock).mockImplementation(() => {});

      printError(str);

      expect(console.log).toHaveBeenCalledTimes(3); // 1 for empty line, 1 for red string, 1 for line break
      expect((console.log as jest.Mock).mock.calls[1][0]).toEqual(chalk.red.bold(str));
    });
  });

  describe('log', () => {
    it('should call console.log with the given arguments', () => {
      const arg1 = 'Argument 1';
      const arg2 = 'Argument 2';

      console.log = jest.fn();

      log(arg1, arg2);

      expect(console.log).toHaveBeenCalledWith(arg1, arg2);
    });
  });

  describe('ensureDir', () => {
    it('should return true when the directory already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = ensureDir('/path/to/file.txt');
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to');
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should create the directory when it does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

      const result = ensureDir('/path/to/file.txt');
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to');
    });

    it('should create parent directories recursively when they do not exist', () => {
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(false) // Check /path/to (does not exist)
        .mockReturnValueOnce(false) // Check /path (does not exist)
        .mockReturnValueOnce(true); // Check / (root, exists)

      const result = ensureDir('/path/to/file.txt');
      expect(result).toBe(true);
      expect(fs.existsSync).toHaveBeenCalledTimes(3); // /path/to, /path, /
      expect(fs.mkdirSync).toHaveBeenCalledTimes(2); // /path, /path/to
    });
  });

  describe('normalizeJsonOpt', () => {
    it('should return the object if the option is already an object', () => {
      const opts = { babel: { presets: ['@babel/preset-env'] } };
      const result = normalizeJsonOpt(opts, 'babel');
      expect(result).toEqual(opts.babel);
    });

    it('should parse and return the object if the option is a valid JSON string', () => {
      const opts = { babel: '{"presets":["@babel/preset-env"]}' };
      const result = normalizeJsonOpt(opts, 'babel');
      expect(result).toEqual({ presets: ['@babel/preset-env'] });
    });

    it('should return an empty object if the option is an invalid JSON string', () => {
      const opts = { babel: '{"presets":["@babel/preset-env"]' }; // Invalid JSON
      const result = normalizeJsonOpt(opts, 'babel');
      expect(result).toEqual({});
    });

    it('should return an empty object if the option is not provided', () => {
      const opts = {};
      const result = normalizeJsonOpt(opts, 'babel');
      expect(result).toEqual({});
    });
  });

  describe('buildWebpackArgs', () => {
    it('should return the options with normalized JSON options for babel and htmlWebpack', () => {
      const opts = {
        babel: '{"presets":["@babel/preset-env"]}',
        htmlWebpack: '{"template":"./src/index.html"}',
        otherOption: 'someValue',
      };

      const result = buildWebpackArgs(opts);
      expect(result).toEqual({
        babel: { presets: ['@babel/preset-env'] },
        htmlWebpack: { template: './src/index.html' },
        otherOption: 'someValue',
      });
    });

    it('should return empty objects for babel and htmlWebpack if they are invalid JSON strings', () => {
      const opts = {
        babel: '{"presets":["@babel/preset-env"]', // Invalid JSON
        htmlWebpack: '{"template":"./src/index.html', // Invalid JSON
      };

      const result = buildWebpackArgs(opts);
      expect(result).toEqual({
        babel: {},
        htmlWebpack: {},
      });
    });

    it('should return the original objects if babel and htmlWebpack are already objects', () => {
      const opts = {
        babel: { presets: ['@babel/preset-env'] },
        htmlWebpack: { template: './src/index.html' },
      };

      const result = buildWebpackArgs(opts);
      expect(result).toEqual({
        babel: opts.babel,
        htmlWebpack: opts.htmlWebpack,
      });
    });

    it('should handle missing babel and htmlWebpack keys gracefully', () => {
      const opts = { otherOption: 'someValue' };

      const result = buildWebpackArgs(opts);
      expect(result).toEqual({
        babel: {},
        htmlWebpack: {},
        otherOption: 'someValue',
      });
    });
  });

  describe('copyRecursiveSync', () => {
    // TODO: Maybe this test case is a bit complex and we should think of an easier solution
    it('should copy a directory and its contents recursively', () => {
      /**
       * First call: Mock as a directory with two files
       * Subsequent calls: Mock as a file
       */
      const existsSyncMock = (fs.existsSync as jest.Mock).mockReturnValue(true);
      const statSyncMock = (fs.statSync as jest.Mock)
        .mockReturnValueOnce({ isDirectory: () => true })
        .mockReturnValue({ isDirectory: () => false });
      const readdirSyncMock = (fs.readdirSync as jest.Mock)
        .mockReturnValueOnce(['file1.txt', 'file2.txt'])
        .mockReturnValue([]);
      const copyFileSyncMock = (fs.copyFileSync as jest.Mock).mockImplementation(() => {});

      copyRecursiveSync('/src', '/dest');

      expect(existsSyncMock).toHaveBeenCalledWith('/src');
      expect(statSyncMock).toHaveBeenCalledWith('/src');
      expect(fs.mkdirSync).toHaveBeenCalledWith('/dest');
      expect(readdirSyncMock).toHaveBeenCalledWith('/src');
      expect(copyFileSyncMock).toHaveBeenCalledWith(
        path.normalize('/src/file1.txt'),
        path.normalize('/dest/file1.txt'),
      );
      expect(copyFileSyncMock).toHaveBeenCalledWith(
        path.normalize('/src/file2.txt'),
        path.normalize('/dest/file2.txt'),
      );
    });

    it('should copy a file when source is a file', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

      copyRecursiveSync('/src/file.txt', '/dest/file.txt');

      expect(fs.existsSync).toHaveBeenCalledWith('/src/file.txt');
      expect(fs.statSync).toHaveBeenCalledWith('/src/file.txt');
      expect(fs.copyFileSync).toHaveBeenCalledWith('/src/file.txt', '/dest/file.txt');
    });

    // Maybe we can change the behavior to throw an error if the `src` doesn't exist
    it('should do nothing when source does not exist', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      copyRecursiveSync('/src/file.txt', '/dest/file.txt');

      expect(fs.existsSync).toHaveBeenCalledWith('/src/file.txt');
      expect(fs.statSync).not.toHaveBeenCalled();
      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(fs.copyFileSync).not.toHaveBeenCalled();
    });
  });

  describe('rootResolve', () => {
    it('should resolve a relative path to an absolute path', () => {
      const result = rootResolve('src/index.js');

      expect(result).toBe(path.join(process.cwd(), 'src/index.js'));
    });
  });

  describe('originalRequire', () => {
    it('should return the original require.resolve function', () => {
      const originalRequireMock = jest.fn();
      global.__non_webpack_require__ = originalRequireMock;

      const result = originalRequire();

      expect(result).toBe(originalRequireMock);
    });
  });

  describe('resolve', () => {
    it('should resolve a module path using the original require.resolve', () => {
      const originalRequireMock = {
        resolve: jest.fn().mockReturnValue('resolved/path'),
      };
      global.__non_webpack_require__ = originalRequireMock;

      const result = resolve('my-module');

      expect(result).toBe('resolved/path');
      expect(originalRequireMock.resolve).toHaveBeenCalledWith('my-module');
    });
  });

  describe('babelConfig', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return a Babel configuration object with specified presets and plugins', () => {
      const result = babelConfig();

      expect(result).toEqual({
        presets: [[resolve('@babel/preset-env'), { targets: undefined }]],
        plugins: [resolve('@babel/plugin-transform-runtime')],
      });
    });

    it('should include the specified targets in the Babel configuration', () => {
      const result = babelConfig({ targets: 'node 14' });

      expect(result).toEqual({
        presets: [[resolve('@babel/preset-env'), { targets: 'node 14' }]],
        plugins: [resolve('@babel/plugin-transform-runtime')],
      });
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: .npmignore]---
Location: grapesjs-dev/packages/core/.npmignore

```text
.DS_Store
.settings/
.sass-cache/
.project
.idea
npm-debug.log*
yarn-error.log
yarn.lock
style/.sass-cache/
stats.json

img/
images/
private/
vendor/
coverage/
node_modules/
bower_components/
grapesjs-*.tgz
_index.html
index.html
docs
.github
test
.editorconfig
.eslintrc
.travis.yml
*.md
webpack.config.js
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .yarnrc]---
Location: grapesjs-dev/packages/core/.yarnrc

```text
registry "https://registry.npmjs.org"
```

--------------------------------------------------------------------------------

---[FILE: babel.config.js]---
Location: grapesjs-dev/packages/core/babel.config.js

```javascript
/** @type {import('@babel/core')} */
module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: grapesjs-dev/packages/core/index.html

```text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>GrapesJS</title>
    <link rel="stylesheet" href="dist/css/grapes.min.css" />
    <script src="grapes.min.js"></script>
    <style>
      body,
      html {
        height: 100%;
        margin: 0;
      }
    </style>
  </head>

  <body>
    <div id="gjs" style="height: 0px; overflow: hidden">
      <div class="panel">
        <h1 class="welcome">Welcome to</h1>
        <div class="big-title">
          <svg class="logo" viewBox="0 0 100 100">
            <path
              d="M40 5l-12.9 7.4 -12.9 7.4c-1.4 0.8-2.7 2.3-3.7 3.9 -0.9 1.6-1.5 3.5-1.5 5.1v14.9 14.9c0 1.7 0.6 3.5 1.5 5.1 0.9 1.6 2.2 3.1 3.7 3.9l12.9 7.4 12.9 7.4c1.4 0.8 3.3 1.2 5.2 1.2 1.9 0 3.8-0.4 5.2-1.2l12.9-7.4 12.9-7.4c1.4-0.8 2.7-2.2 3.7-3.9 0.9-1.6 1.5-3.5 1.5-5.1v-14.9 -12.7c0-4.6-3.8-6-6.8-4.2l-28 16.2"
            />
          </svg>
          <span>GrapesJS</span>
        </div>
        <div class="description">
          This is a demo content from index.html. For the development, you shouldn't edit this file, instead you can
          copy and rename it to _index.html, on next server start the new file will be served, and it will be ignored by
          git.
        </div>
      </div>
      <style>
        .panel {
          width: 90%;
          max-width: 700px;
          border-radius: 3px;
          padding: 30px 20px;
          margin: 150px auto 0px;
          background-color: #d983a6;
          box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.25);
          color: rgba(255, 255, 255, 0.75);
          font: caption;
          font-weight: 100;
        }

        .welcome {
          text-align: center;
          font-weight: 100;
          margin: 0px;
        }

        .logo {
          width: 70px;
          height: 70px;
          vertical-align: middle;
        }

        .logo path {
          pointer-events: none;
          fill: none;
          stroke-linecap: round;
          stroke-width: 7;
          stroke: #fff;
        }

        .big-title {
          text-align: center;
          font-size: 3.5rem;
          margin: 15px 0;
        }

        .description {
          text-align: justify;
          font-size: 1rem;
          line-height: 1.5rem;
        }
      </style>
    </div>

    <script type="text/javascript">
      var editor = grapesjs.init({
        showOffsets: 1,
        noticeOnUnload: 0,
        container: '#gjs',
        height: '100%',
        fromElement: true,
        storageManager: { autoload: 0 },
        styleManager: {
          sectors: [
            {
              name: 'General',
              open: false,
              buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
            },
            {
              name: 'Flex',
              open: false,
              buildProps: [
                'flex-direction',
                'flex-wrap',
                'justify-content',
                'align-items',
                'align-content',
                'order',
                'flex-basis',
                'flex-grow',
                'flex-shrink',
                'align-self',
              ],
            },
            {
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            },
            {
              name: 'Typography',
              open: false,
              buildProps: [
                'font-family',
                'font-size',
                'font-weight',
                'letter-spacing',
                'color',
                'line-height',
                'text-shadow',
              ],
            },
            {
              name: 'Decorations',
              open: false,
              buildProps: [
                'border-radius-c',
                'background-color',
                'border-radius',
                'border',
                'box-shadow',
                'background',
              ],
            },
            {
              name: 'Extra',
              open: false,
              buildProps: ['transition', 'perspective', 'transform'],
            },
          ],
        },
      });

      editor.BlockManager.add('testBlock', {
        label: 'Block',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<div style="padding-top:50px; padding-bottom:50px; text-align:center">Test block</div>`,
      });
    </script>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: grapesjs-dev/packages/core/jest.config.js

```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  modulePaths: ['<rootDir>/src'],
  testMatch: ['<rootDir>/test/specs/**/*.(t|j)s'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
};
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: grapesjs-dev/packages/core/LICENSE

```text
Copyright (c) 2017-current, Artur Arseniev
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.
- Neither the name "GrapesJS" nor the names of its contributors may be
  used to endorse or promote products derived from this software without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: grapesjs-dev/packages/core/package.json

```json
{
  "name": "grapesjs",
  "description": "Free and Open Source Web Builder Framework",
  "version": "0.22.14",
  "author": "Artur Arseniev",
  "license": "BSD-3-Clause",
  "homepage": "http://grapesjs.com",
  "main": "dist/grapes.min.js",
  "types": "dist/index.d.ts",
  "module": "dist/grapes.mjs",
  "exports": {
    ".": {
      "import": "./dist/grapes.mjs",
      "require": "./dist/grapes.min.js",
      "types": "./dist/index.d.ts"
    },
    "./*": "./*"
  },
  "files": [
    "dist",
    "locale",
    "src/styles"
  ],
  "sideEffects": [
    "*.css",
    "*.scss"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/GrapesJS/grapesjs.git"
  },
  "dependencies": {
    "@types/backbone": "1.4.15",
    "backbone": "1.4.1",
    "backbone-undo": "0.2.6",
    "codemirror": "5.63.0",
    "codemirror-formatting": "1.0.0",
    "html-entities": "~1.4.0",
    "promise-polyfill": "8.3.0",
    "underscore": "1.13.1"
  },
  "devDependencies": {
    "@types/markdown-it": "14.1.2",
    "@types/pretty": "^2.0.3",
    "grapesjs-cli": "workspace:^",
    "jest-environment-jsdom": "29.7.0",
    "jsdom": "24.1.1",
    "npm-run-all": "4.1.5",
    "postcss": "8",
    "pretty": "2.0.0",
    "sass": "1.80.3",
    "whatwg-fetch": "3.6.20"
  },
  "resolutions": {
    "backbone-undo/backbone": "1.3.3",
    "backbone-undo/underscore": "1.13.1"
  },
  "keywords": [
    "grapes",
    "grapesjs",
    "wysiwyg",
    "web",
    "template",
    "editor",
    "newsletter",
    "site",
    "builder"
  ],
  "scripts": {
    "build": "npm run build-all",
    "build-all": "run-s build:*",
    "build:js": "node node_modules/grapesjs-cli/dist/cli.js build --patch=false --targets=\"> 1%, ie 11, safari 8, not dead\" --statsOutput=\"stats.json\" --localePath=\"src/i18n/locale\"",
    "build:mjs": "cross-env BUILD_MODULE=true node node_modules/grapesjs-cli/dist/cli.js build --dts='skip' --patch=false --targets=\"> 1%, ie 11, safari 8, not dead\"",
    "build:css": "sass src/styles/scss/main.scss dist/css/grapes.min.css --no-source-map --style=compressed --load-path=node_modules",
    "ts:build": "node node_modules/grapesjs-cli/dist/cli.js build --dts='only' --patch=false",
    "ts:check": "tsc --noEmit --esModuleInterop dist/index.d.ts",
    "start": "cross-env NODE_ENV=development run-p start:*",
    "start:js": "node node_modules/grapesjs-cli/dist/cli.js serve",
    "start:css": "npm run build:css -- --watch",
    "test": "jest --forceExit",
    "test:dev": "jest --watch"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: grapesjs-dev/packages/core/README.md

```text
# [GrapesJS](http://grapesjs.com)

[![Build Status](https://github.com/GrapesJS/grapesjs/actions/workflows/quality.yml/badge.svg)](https://github.com/GrapesJS/grapesjs/actions)
[![Chat](https://img.shields.io/badge/chat-discord-7289da.svg)](https://discord.gg/QAbgGXq)
[![CDNJS](https://img.shields.io/cdnjs/v/grapesjs.svg)](https://cdnjs.com/libraries/grapesjs)
[![npm](https://img.shields.io/npm/v/grapesjs.svg)](https://www.npmjs.com/package/grapesjs)

> If you looking to embed the [Studio](https://app.grapesjs.com/studio) editor in your application, we now offer the [Studio SDK](https://app.grapesjs.com/dashboard/sdk/licenses?ref=repo-readme), a ready-to-use visual builder that's easy to embed in external applications, with GrapesJS team support included.

<p align="center"><img src="http://grapesjs.com/assets/images/grapesjs-front-page-m.jpg" alt="GrapesJS" width="500" align="center"/></p>

GrapesJS is a free and open source Web Builder Framework which helps building HTML templates, faster and easily, to be delivered in sites, newsletters or mobile apps. Mainly, GrapesJS was designed to be used inside a [CMS] to speed up the creation of dynamic templates. To better understand this concept check the image below

<br/>
<p align="center"><img src="http://grapesjs.com/assets/images/gjs-concept.png" alt="GrapesJS - Style Manager" height="400" align="center"/></p>
<br/>

Generally any 'template system', that you'd find in various applications like CMS, is composed by the **structure** (HTML), **style** (CSS) and **variables**, which are then replaced with other templates and contents on server-side and rendered on client.

This demos show examples of what is possible to achieve:<br/>
Webpage Demo - http://grapesjs.com/demo.html<br/>
Newsletter Demo - http://grapesjs.com/demo-newsletter-editor.html<br/>

## Table of contents

- [Features](#features)
- [Download](#download)
- [Usage](#usage)
- [Development](#development)
- [Documentation](#documentation)
- [API](#api)
- [Testing](#testing)
- [Plugins](#plugins)
- [Support](#support)
- [Changelog](https://github.com/GrapesJS/grapesjs/releases)
- [Contributing](https://github.com/GrapesJS/grapesjs/blob/dev/CONTRIBUTING.md)
- [License](#license)

## Features

| Blocks                                                                                                                                   | Style Manager                                                                                                                         | Layer Manager                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| <img  src="http://grapesjs.com/assets/images/sc-grapesjs-blocks-prp.jpg"  alt="GrapesJS - Block Manager"  height="400"  align="center"/> | <img  src="http://grapesjs.com/assets/images/sc-grapesjs-style-2.jpg"  alt="GrapesJS - Style Manager"  height="400"  align="center"/> | <img  src="http://grapesjs.com/assets/images/sc-grapesjs-layers-2.jpg"  alt="GrapesJS - Layer Manager"  height="400"  align="center"/> |

| Code Viewer                                                                                                                      | Asset Manager                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| <img  src="http://grapesjs.com/assets/images/sc-grapesjs-code.jpg"  alt="GrapesJS - Code Viewer"  height="300"  align="center"/> | <img  src="http://grapesjs.com/assets/images/sc-grapesjs-assets-1.jpg"  alt="GrapesJS - Asset Manager"  height="250"  align="center"/> |

- Local and remote storage

- Default built-in commands (basically for creating and managing different components)

## Download

- CDNs
  - UNPKG (resolves to the latest version)
    - `https://unpkg.com/grapesjs`
    - `https://unpkg.com/grapesjs/dist/css/grapes.min.css`
  - CDNJS (replace `X.X.X` with the current version)
    - `https://cdnjs.cloudflare.com/ajax/libs/grapesjs/X.X.X/grapes.min.js`
    - `https://cdnjs.cloudflare.com/ajax/libs/grapesjs/X.X.X/css/grapes.min.css`
- NPM
  - `npm i grapesjs`
- GIT
  - `git clone https://github.com/GrapesJS/grapesjs.git`

For the development purpose you should follow instructions below.

## Usage

```html
<link rel="stylesheet" href="path/to/grapes.min.css" />
<script src="path/to/grapes.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
    container: '#gjs',
    components: '<div class="txt-red">Hello world!</div>',
    style: '.txt-red{color: red}',
  });
</script>
```

For a more practical example I'd suggest looking up the code inside this demo: http://grapesjs.com/demo.html

## Development

Follow the [Contributing Guide](https://github.com/GrapesJS/grapesjs/blob/dev/CONTRIBUTING.md).

## Documentation

Check the getting started guide here: [Documentation]

## API

API References could be found here: [API-Reference]

## Testing

```sh
$ pnpm test
```

## Plugins

[Official Plugins](https://github.com/orgs/GrapesJS/repositories?q=-repo%3Agrapesjs%2Fgrapesjs&type=source) | [Community Plugins](https://github.com/topics/grapesjs-plugin)

### Wrappers

- [@grapesjs/react](https://github.com/GrapesJS/react) - GrapesJS wrapper for React that allows you to build custom and declarative UI for your editor.

### Extensions

- [grapesjs-plugin-export](https://github.com/GrapesJS/export) - Export GrapesJS templates in a zip archive
- [grapesjs-plugin-filestack](https://github.com/GrapesJS/filestack) - Add Filestack uploader in Asset Manager
- [grapesjs-plugin-ckeditor](https://github.com/GrapesJS/ckeditor) - Replaces the built-in RTE with CKEditor
- [grapesjs-tui-image-editor](https://github.com/GrapesJS/tui-image-editor) - GrapesJS TOAST UI Image Editor
- [grapesjs-blocks-basic](https://github.com/GrapesJS/blocks-basic) - Basic set of blocks
- [grapesjs-plugin-forms](https://github.com/GrapesJS/components-forms) - Set of form components and blocks
- [grapesjs-navbar](https://github.com/GrapesJS/components-navbar) - Simple navbar component
- [grapesjs-component-countdown](https://github.com/GrapesJS/components-countdown) - Simple countdown component
- [grapesjs-style-gradient](https://github.com/GrapesJS/style-gradient) - Add `gradient` type input to the Style Manager
- [grapesjs-style-filter](https://github.com/GrapesJS/style-filter) - Add `filter` type input to the Style Manager
- [grapesjs-style-bg](https://github.com/GrapesJS/style-bg) - Full-stack background style property type, with the possibility to add images, colors, and gradients
- [grapesjs-blocks-flexbox](https://github.com/GrapesJS/blocks-flexbox) - Add the flexbox block
- [grapesjs-lory-slider](https://github.com/GrapesJS/components-lory) - Slider component by using [lory](https://github.com/meandmax/lory)
- [grapesjs-tabs](https://github.com/GrapesJS/components-tabs) - Simple tabs component
- [grapesjs-tooltip](https://github.com/GrapesJS/components-tooltip) - Simple, CSS only, tooltip component for GrapesJS
- [grapesjs-custom-code](https://github.com/GrapesJS/components-custom-code) - Embed custom code
- [grapesjs-touch](https://github.com/GrapesJS/touch) - Enable touch support
- [grapesjs-indexeddb](https://github.com/GrapesJS/storage-indexeddb) - Storage wrapper for IndexedDB
- [grapesjs-firestore](https://github.com/GrapesJS/storage-firestore) - Storage wrapper for [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [grapesjs-parser-postcss](https://github.com/GrapesJS/parser-postcss) - Custom CSS parser for GrapesJS by using [PostCSS](https://github.com/postcss/postcss)
- [grapesjs-typed](https://github.com/GrapesJS/components-typed) - Typed component made by wrapping Typed.js library
- [grapesjs-ui-suggest-classes](https://github.com/silexlabs/grapesjs-ui-suggest-classes) - Enable auto-complete of classes in the SelectorManager UI
- [grapesjs-fonts](https://github.com/silexlabs/grapesjs-fonts) - Custom Fonts plugin, adds a UI to manage fonts in websites
- [grapesjs-symbols](https://github.com/silexlabs/grapesjs-symbols) - Symbols plugin to reuse elements in a website and accross pages
- [grapesjs-click](https://github.com/bgrand-ch/grapesjs-click) - Grab and drop blocks and components with click (no more drag-and-drop)
- [grapesjs-float](https://github.com/bgrand-ch/grapesjs-float) - Anchor a floating element next to another element (selected component, ...)

### Presets

- [grapesjs-preset-webpage](https://github.com/GrapesJS/preset-webpage) - Webpage Builder
- [grapesjs-preset-newsletter](https://github.com/GrapesJS/preset-newsletter) - Newsletter Builder
- [grapesjs-mjml](https://github.com/GrapesJS/mjml) - Newsletter Builder with MJML components

Find out more about plugins here: [Creating plugins](https://grapesjs.com/docs/modules/Plugins.html)

## Support

If you like the project and you wish to see it grow, please consider supporting us with a donation of your choice or become a backer/sponsor via [Open Collective](https://opencollective.com/grapesjs)

[![PayPalMe](http://grapesjs.com/assets/images/ppme.png)](https://paypal.me/grapesjs)
[![Bitcoin](https://user-images.githubusercontent.com/11614725/52977952-87235f80-33cf-11e9-9607-7a9a354e1155.png)](https://commerce.coinbase.com/checkout/fc90b940-558d-408b-a166-28a823c98173)

<a href="https://opencollective.com/grapesjs"><img src="https://opencollective.com/grapesjs/tiers/sponsors.svg?avatarHeight=64"></a>
<a href="https://opencollective.com/grapesjs"><img src="https://opencollective.com/grapesjs/tiers/backers.svg?avatarHeight=64"></a>

<br>

[![BrowserStack](https://user-images.githubusercontent.com/11614725/39406324-4ef89c40-4bb5-11e8-809a-113d9432e5a5.png)](https://www.browserstack.com)<br/>
Thanks to [BrowserStack](https://www.browserstack.com) for providing us browser testing services

## License

BSD 3-clause

[Documentation]: https://grapesjs.com/docs/
[API-Reference]: https://grapesjs.com/docs/api/
[CMS]: https://en.wikipedia.org/wiki/Content_management_system
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: grapesjs-dev/packages/core/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "outDir": "./dist"
  },
  "include": ["src", "test"]
}
```

--------------------------------------------------------------------------------

---[FILE: webpack.config.js]---
Location: grapesjs-dev/packages/core/webpack.config.js

```javascript
const path = require('path');
const rootDir = path.resolve(__dirname);

module.exports = ({ config, pkg, webpack }) => {
  const { BUILD_MODULE } = process.env;

  return {
    ...config,
    output: {
      ...config.output,
      filename: BUILD_MODULE ? 'grapes.mjs' : 'grapes.min.js',
      ...(BUILD_MODULE
        ? {
            libraryTarget: 'module',
            library: { type: 'module' },
          }
        : {
            libraryExport: 'default',
          }),
    },
    optimization: {
      ...config.optimization,
      minimize: !BUILD_MODULE,
    },
    devServer: {
      ...config.devServer,
      static: [rootDir],
      headers: { 'Access-Control-Allow-Origin': '*' },
      allowedHosts: 'all',
    },
    experiments: {
      outputModule: !!BUILD_MODULE,
    },
    resolve: {
      ...config.resolve,
      modules: [...(config.resolve && config.resolve.modules), 'src'],
      alias: {
        ...(config.resolve && config.resolve.alias),
        jquery: `${rootDir}/src/utils/cash-dom`,
        backbone: `${rootDir}/node_modules/backbone`,
        underscore: `${rootDir}/node_modules/underscore`,
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __GJS_VERSION__: `'${pkg.version}'`,
      }),
      ...config.plugins,
    ],
  };
};
```

--------------------------------------------------------------------------------

````

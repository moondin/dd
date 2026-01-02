---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 30
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 30 of 37)

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

---[FILE: webpackDevServer.config.js]---
Location: create-react-app-main/packages/react-scripts/config/webpackDevServer.config.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const paths = require('./paths');
const getHttpsConfig = require('./getHttpsConfig');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';
  return {
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    // Note: ["localhost", ".localhost"] will support subdomains - but we might
    // want to allow setting the allowedHosts manually for more complex setups
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    // Enable gzip compression of generated files.
    compress: true,
    static: {
      // By default WebpackDevServer serves physical files from current directory
      // in addition to all the virtual build products that it serves from memory.
      // This is confusing because those files won’t automatically be available in
      // production build folder unless we copy them. However, copying the whole
      // project directory is dangerous because we may expose sensitive files.
      // Instead, we establish a convention that only files in `public` directory
      // get served. Our build script will copy `public` into the `build` folder.
      // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
      // Note that we only recommend to use `public` folder as an escape hatch
      // for files like `favicon.ico`, `manifest.json`, and libraries that are
      // for some reason broken when imported through webpack. If you just want to
      // use an image, put it in `src` and `import` it from JavaScript instead.
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      // By default files from `contentBase` will not trigger a page reload.
      watch: {
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebook/create-react-app/issues/293
        // src/node_modules is not ignored to support absolute imports
        // https://github.com/facebook/create-react-app/issues/1065
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    client: {
      webSocketURL: {
        // Enable custom sockjs pathname for websocket connection to hot reloading server.
        // Enable custom sockjs hostname, pathname and port for websocket connection
        // to hot reloading server.
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      // It is important to tell WebpackDevServer to use the same "publicPath" path as
      // we specified in the webpack config. When homepage is '.', default to serving
      // from the root.
      // remove last slash so user can land on `/test` instead of `/test/`
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    https: getHttpsConfig(),
    host,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
    proxy,
    onBeforeSetupMiddleware(devServer) {
      // Keep `evalSourceMapMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(devServer.app);
      }
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
```

--------------------------------------------------------------------------------

---[FILE: babelTransform.js]---
Location: create-react-app-main/packages/react-scripts/config/jest/babelTransform.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const babelJest = require('babel-jest').default;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

module.exports = babelJest.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: hasJsxRuntime ? 'automatic' : 'classic',
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
```

--------------------------------------------------------------------------------

---[FILE: cssTransform.js]---
Location: create-react-app-main/packages/react-scripts/config/jest/cssTransform.js

```javascript
// @remove-on-eject-begin
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
```

--------------------------------------------------------------------------------

---[FILE: fileTransform.js]---
Location: create-react-app-main/packages/react-scripts/config/jest/fileTransform.js
Signals: React

```javascript
'use strict';

const path = require('path');
const camelcase = require('camelcase');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      const componentName = `Svg${pascalCaseFilename}`;
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};
```

--------------------------------------------------------------------------------

---[FILE: createEnvironmentHash.js]---
Location: create-react-app-main/packages/react-scripts/config/webpack/persistentCache/createEnvironmentHash.js

```javascript
'use strict';
const { createHash } = require('crypto');

module.exports = env => {
  const hash = createHash('md5');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/package.json

```json
{
  "name": "kitchensink",
  "main": "template.json",
  "version": "1.0.0"
}
```

--------------------------------------------------------------------------------

---[FILE: template.json]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template.json

```json
{
  "package": {
    "dependencies": {
      "bootstrap": "4.3.1",
      "jest": "27.1.0",
      "node-sass": "6.x",
      "normalize.css": "7.0.0",
      "prop-types": "15.7.2",
      "test-integrity": "2.0.1"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .env]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/.env

```bash
REACT_APP_X = x-from-original-env	
REACT_APP_ORIGINAL_1 = from-original-env-1	
REACT_APP_ORIGINAL_2 = from-original-env-2	
REACT_APP_BASIC = basic	
REACT_APP_BASIC_EXPAND = ${REACT_APP_BASIC}	
REACT_APP_BASIC_EXPAND_SIMPLE = $REACT_APP_BASIC	
REACT_APP_EXPAND_EXISTING = $REACT_APP_SHELL_ENV_MESSAGE
```

--------------------------------------------------------------------------------

---[FILE: .env.development]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/.env.development

```text
REACT_APP_X = x-from-development-env
REACT_APP_DEVELOPMENT = development
```

--------------------------------------------------------------------------------

---[FILE: .env.local]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/.env.local

```text
REACT_APP_X = x-from-original-local-env
REACT_APP_ORIGINAL_2 = override-from-original-local-env-2
```

--------------------------------------------------------------------------------

---[FILE: .env.production]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/.env.production

```text
REACT_APP_X = x-from-production-env
REACT_APP_PRODUCTION = production
```

--------------------------------------------------------------------------------

---[FILE: .flowconfig]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/.flowconfig

```text
[ignore]
<PROJECT_ROOT>/node_modules/fbjs/.*

[include]

[libs]

[options]
```

--------------------------------------------------------------------------------

---[FILE: gitignore]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/gitignore

```text
# See http://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules

# testing
coverage

# production
build

# misc
.DS_Store
.env
npm-debug.log
```

--------------------------------------------------------------------------------

---[FILE: jest.integration.config.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/jest.integration.config.js

```javascript
'use strict';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/integration/*.test.js'],
  transform: { '^.+\\.js$': './jest.transform.js' },
};
```

--------------------------------------------------------------------------------

---[FILE: jest.transform.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/jest.transform.js

```javascript
'use strict';

const babelOptions = { presets: ['react-app'] };

const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer(babelOptions);
```

--------------------------------------------------------------------------------

---[FILE: jsconfig.json]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/README.md

```text
# Contributing to Create React App's E2E tests

This is an end to end kitchensink test suite, but has multiple usages in it.

## Running the test suite

Tests are automatically run by the CI tools.
In order to run them locally, without having to manually install and configure everything, the `npm run e2e:docker` CLI command can be used.

This is a script that runs a **Docker** container, where the node version, git branch to clone, test suite, and whether to run it with `yarn` or `npm` can be chosen.
Run `npm run e2e:docker --help` to get additional info.

If you need guidance installing **Docker**, you should follow their [official docs](https://docs.docker.com/engine/installation/).

## Writing tests

Each time a new feature is added, it is advised to add at least one test covering it.

Features are categorized by their scope:

- _env_, all those which deal with environment variables (e.g. `NODE_PATH`)

- _syntax_, all those which showcase a single EcmaScript syntax feature that is expected to be transpiled by **Babel**

- _webpack_, all those which make use of webpack settings, loaders or plugins

### Using it as Unit Tests

In it's most basic for this serve as a collection of unit tests on a single functionality.

Unit tests are written in a `src/features/**/*.test.js` file located in the same folder as the feature they test, and usually consist of a `ReactDOM.render` call.

These tests are run by **jest** and the environment is `test`, so that it resembles how a **Create React App** application is tested.

### Using it as Integration Tests

This suite tests how the single features as before behave while development and in production.
A local HTTP server is started, then every single feature is loaded, one by one, to be tested.

Test are written in `integration/{env|syntax|webpack}.test.js`, depending on their scope.

For every test case added there is only a little chore to do:

- a `case` statement must be added in `src/App.js`, which performs a dynamic `import()` of the feature

- add a test case in the appropriate integration test file, which calls and awaits `initDOM` with the previous `SwitchCase` string

A usual flow for the test itself is something similar to:

- add an `id` attribute in a target HTML tag in the feature itself

- since `initDOM` returns a `Document` element, the previous `id` attribute is used to target the feature's DOM and `expect` accordingly
```

--------------------------------------------------------------------------------

---[FILE: config.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/integration/config.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import initDOM from './initDOM';

describe('Integration', () => {
  describe('jsconfig.json/tsconfig.json', () => {
    let doc;

    afterEach(() => {
      doc && doc.defaultView.close();
      doc = undefined;
    });

    it('Supports setting baseUrl to src', async () => {
      doc = await initDOM('base-url');

      expect(doc.getElementById('feature-base-url').childElementCount).toBe(4);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: env.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/integration/env.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import initDOM from './initDOM';

describe('Integration', () => {
  describe('Environment variables', () => {
    let doc;

    afterEach(() => {
      doc && doc.defaultView.close();
      doc = undefined;
    });

    it('file env variables', async () => {
      doc = await initDOM('file-env-variables');

      expect(
        doc.getElementById('feature-file-env-original-1').textContent
      ).toBe('from-original-env-1');
      expect(
        doc.getElementById('feature-file-env-original-2').textContent
      ).toBe('override-from-original-local-env-2');

      expect(doc.getElementById('feature-file-env').textContent).toBe(
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
      );
      expect(doc.getElementById('feature-file-env-x').textContent).toBe(
        'x-from-original-local-env'
      );
    });

    it('PUBLIC_URL', async () => {
      doc = await initDOM('public-url');

      const prefix =
        process.env.NODE_ENV === 'development'
          ? ''
          : 'http://www.example.org/spa';
      expect(doc.getElementById('feature-public-url').textContent).toBe(
        `${prefix}.`
      );
      expect(
        doc.querySelector('head link[rel="icon"]').getAttribute('href')
      ).toBe(`${prefix}/favicon.ico`);
    });

    it('shell env variables', async () => {
      doc = await initDOM('shell-env-variables');

      expect(
        doc.getElementById('feature-shell-env-variables').textContent
      ).toBe('fromtheshell.');
    });

    it('expand .env variables', async () => {
      doc = await initDOM('expand-env-variables');

      expect(doc.getElementById('feature-expand-env-1').textContent).toBe(
        'basic'
      );
      expect(doc.getElementById('feature-expand-env-2').textContent).toBe(
        'basic'
      );
      expect(doc.getElementById('feature-expand-env-3').textContent).toBe(
        'basic'
      );
      expect(
        doc.getElementById('feature-expand-env-existing').textContent
      ).toBe('fromtheshell');
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: initDOM.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/integration/initDOM.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const { JSDOM, ResourceLoader } = require('jsdom');
const path = require('path');
const url = require('url');

const file =
  process.env.E2E_FILE &&
  (path.isAbsolute(process.env.E2E_FILE)
    ? process.env.E2E_FILE
    : path.join(process.cwd(), process.env.E2E_FILE));

export const fetchFile = url => {
  const pathPrefix = process.env.PUBLIC_URL.replace(/^https?:\/\/[^/]+\/?/, '');
  return fs.readFileSync(
    path.join(path.dirname(file), url.pathname.replace(pathPrefix, '')),
    'utf8'
  );
};

const fileResourceLoader =
  new (class FileResourceLoader extends ResourceLoader {
    fetch(href, options) {
      return Promise.resolve(fetchFile(url.parse(href)));
    }
  })();

if (!process.env.E2E_FILE && !process.env.E2E_URL) {
  it.only('can run jsdom (at least one of "E2E_FILE" or "E2E_URL" environment variables must be provided)', () => {
    expect(
      new Error("This isn't the error you are looking for.")
    ).toBeUndefined();
  });
}

const initDOM = async feature =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const host = process.env.E2E_URL || 'http://www.example.org/spa:3000';
      const url = `${host}#${feature}`;

      let window;

      if (process.env.E2E_FILE) {
        window = (
          await JSDOM.fromFile(file, {
            pretendToBeVisual: true,
            resources: fileResourceLoader,
            runScripts: 'dangerously',
            url,
          })
        ).window;
      } else {
        window = (
          await JSDOM.fromURL(url, {
            pretendToBeVisual: true,
            resources: 'usable',
            runScripts: 'dangerously',
          })
        ).window;
      }

      const cleanup = () => {
        if (window) {
          window.close();
          window = null;
        }
      };

      const { document } = window;

      const cancelToken = setTimeout(() => {
        // Cleanup jsdom instance since we don't need it anymore
        cleanup();

        reject(`Timed out loading feature: ${feature}`);
      }, 10000);

      document.addEventListener(
        'ReactFeatureDidMount',
        () => resolve(document),
        { capture: true, once: true }
      );
      document.addEventListener(
        'ReactFeatureError',
        () => {
          clearTimeout(cancelToken);

          // Cleanup jsdom instance since we don't need it anymore
          cleanup();

          reject(`Error loading feature: ${feature}`);
        },
        { capture: true, once: true }
      );
    } catch (e) {
      reject(e);
    }
  });

export default initDOM;
```

--------------------------------------------------------------------------------

---[FILE: syntax.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/integration/syntax.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import initDOM from './initDOM';

describe('Integration', () => {
  describe('Language syntax', () => {
    let doc;

    afterEach(() => {
      doc && doc.defaultView.close();
      doc = undefined;
    });

    it('array destructuring', async () => {
      doc = await initDOM('array-destructuring');

      expect(
        doc.getElementById('feature-array-destructuring').childElementCount
      ).toBe(4);
    });

    it('array spread', async () => {
      doc = await initDOM('array-spread');

      expect(doc.getElementById('feature-array-spread').childElementCount).toBe(
        4
      );
    });

    it('async/await', async () => {
      doc = await initDOM('async-await');

      expect(doc.getElementById('feature-async-await').childElementCount).toBe(
        4
      );
    });

    it('class properties', async () => {
      doc = await initDOM('class-properties');

      expect(
        doc.getElementById('feature-class-properties').childElementCount
      ).toBe(4);
    });

    it('computed properties', async () => {
      doc = await initDOM('computed-properties');

      expect(
        doc.getElementById('feature-computed-properties').childElementCount
      ).toBe(4);
    });

    it('custom interpolation', async () => {
      doc = await initDOM('custom-interpolation');

      expect(
        doc.getElementById('feature-custom-interpolation').childElementCount
      ).toBe(4);
    });

    it('default parameters', async () => {
      doc = await initDOM('default-parameters');

      expect(
        doc.getElementById('feature-default-parameters').childElementCount
      ).toBe(4);
    });

    it('destructuring and await', async () => {
      doc = await initDOM('destructuring-and-await');

      expect(
        doc.getElementById('feature-destructuring-and-await').childElementCount
      ).toBe(4);
    });

    it('generators', async () => {
      doc = await initDOM('generators');

      expect(doc.getElementById('feature-generators').childElementCount).toBe(
        4
      );
    });

    it('object destructuring', async () => {
      doc = await initDOM('object-destructuring');

      expect(
        doc.getElementById('feature-object-destructuring').childElementCount
      ).toBe(4);
    });

    it('object spread', async () => {
      doc = await initDOM('object-spread');

      expect(
        doc.getElementById('feature-object-spread').childElementCount
      ).toBe(4);
    });

    it('promises', async () => {
      doc = await initDOM('promises');

      expect(doc.getElementById('feature-promises').childElementCount).toBe(4);
    });

    it('rest + default', async () => {
      doc = await initDOM('rest-and-default');

      expect(
        doc.getElementById('feature-rest-and-default').childElementCount
      ).toBe(4);
    });

    it('rest parameters', async () => {
      doc = await initDOM('rest-parameters');

      expect(
        doc.getElementById('feature-rest-parameters').childElementCount
      ).toBe(4);
    });

    it('template interpolation', async () => {
      doc = await initDOM('template-interpolation');

      expect(
        doc.getElementById('feature-template-interpolation').childElementCount
      ).toBe(4);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: webpack.test.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/integration/webpack.test.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import initDOM, { fetchFile } from './initDOM';
import url from 'url';

const matchCSS = (doc, regexes) => {
  if (process.env.E2E_FILE) {
    const elements = doc.getElementsByTagName('link');
    let href = '';
    for (const elem of elements) {
      if (elem.rel === 'stylesheet') {
        href = elem.href;
      }
    }

    const textContent = fetchFile(url.parse(href));
    for (const regex of regexes) {
      expect(textContent).toMatch(regex);
    }
  } else {
    for (let i = 0; i < regexes.length; ++i) {
      expect(
        doc.getElementsByTagName('style')[i].textContent.replace(/\s/g, '')
      ).toMatch(regexes[i]);
    }
  }
};

describe('Integration', () => {
  describe('webpack plugins', () => {
    let doc;

    afterEach(() => {
      doc && doc.defaultView.close();
      doc = undefined;
    });

    it('css inclusion', async () => {
      doc = await initDOM('css-inclusion');
      matchCSS(doc, [
        /html\{/,
        /#feature-css-inclusion\{background:.+;color:.+}/,
      ]);
    });

    it('css modules inclusion', async () => {
      doc = await initDOM('css-modules-inclusion');
      matchCSS(doc, [
        /.+style_cssModulesInclusion__.+\{background:.+;color:.+}/,
        /.+assets_cssModulesIndexInclusion__.+\{background:.+;color:.+}/,
      ]);
    });

    it('scss inclusion', async () => {
      doc = await initDOM('scss-inclusion');
      matchCSS(doc, [/#feature-scss-inclusion\{background:.+;color:.+}/]);
    });

    it('scss modules inclusion', async () => {
      doc = await initDOM('scss-modules-inclusion');
      matchCSS(doc, [
        /.+scss-styles_scssModulesInclusion.+\{background:.+;color:.+}/,
        /.+assets_scssModulesIndexInclusion.+\{background:.+;color:.+}/,
      ]);
    });

    it('sass inclusion', async () => {
      doc = await initDOM('sass-inclusion');
      matchCSS(doc, [/#feature-sass-inclusion\{background:.+;color:.+}/]);
    });

    it('sass modules inclusion', async () => {
      doc = await initDOM('sass-modules-inclusion');
      matchCSS(doc, [
        /.+sass-styles_sassModulesInclusion.+\{background:.+;color:.+}/,
        /.+assets_sassModulesIndexInclusion.+\{background:.+;color:.+}/,
      ]);
    });

    it('image inclusion', async () => {
      doc = await initDOM('image-inclusion');

      expect(doc.getElementById('feature-image-inclusion').src).toMatch(
        /^data:image\/jpeg;base64.+=$/
      );
    });

    it('no ext inclusion', async () => {
      doc = await initDOM('no-ext-inclusion');

      // Webpack 4 added a default extension ".bin" seems like webpack 5 asset modules do not
      expect(
        doc.getElementById('feature-no-ext-inclusion').getAttribute('href')
      ).toMatch(/\/static\/media\/aFileWithoutExt\.[a-f0-9]+$/);
    });

    it('json inclusion', async () => {
      doc = await initDOM('json-inclusion');

      expect(doc.getElementById('feature-json-inclusion').textContent).toBe(
        'This is an abstract.'
      );
    });

    it('linked modules', async () => {
      doc = await initDOM('linked-modules');

      expect(doc.getElementById('feature-linked-modules').textContent).toBe(
        '2.0.0'
      );
    });

    it('svg inclusion', async () => {
      doc = await initDOM('svg-inclusion');
      expect(doc.getElementById('feature-svg-inclusion').src).toMatch(
        /\/static\/media\/logo\..+\.svg$/
      );
    });

    it('svg component', async () => {
      doc = await initDOM('svg-component');

      expect(doc.getElementById('feature-svg-component').textContent).toBe('');
    });

    it('svg in css', async () => {
      doc = await initDOM('svg-in-css');
      matchCSS(doc, [/\/static\/media\/logo\..+\.svg/]);
    });

    it('unknown ext inclusion', async () => {
      doc = await initDOM('unknown-ext-inclusion');

      expect(
        doc.getElementById('feature-unknown-ext-inclusion').getAttribute('href')
      ).toMatch(/\/static\/media\/aFileWithExt\.[a-f0-9]+\.unknown$/);
    });
  });
});
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/public/index.html

```text
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: absoluteLoad.js]---
Location: create-react-app-main/packages/react-scripts/fixtures/kitchensink/template/src/absoluteLoad.js

```javascript
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const absoluteLoad = () => [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
];

export default absoluteLoad;
```

--------------------------------------------------------------------------------

````

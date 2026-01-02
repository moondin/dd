---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 417
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 417 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: craco.config.js]---
Location: mlflow-master/mlflow/server/js/craco.config.js

```javascript
const url = require('url');
const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const proxyTarget = process.env.MLFLOW_PROXY;
const useProxyServer = !!proxyTarget && !process.env.MLFLOW_DEV_PROXY_MODE;

const isDevserverWebsocketRequest = (request) =>
  request.url === '/ws' && (request.headers.upgrade === 'websocket' || request.headers['sec-websocket-version']);

function mayProxy(pathname) {
  const publicPrefixPrefix = '/static-files/';
  if (pathname.startsWith(publicPrefixPrefix)) {
    const maybePublicPath = path.resolve('public', pathname.substring(publicPrefixPrefix.length));
    return !fs.existsSync(maybePublicPath);
  } else {
    const maybePublicPath = path.resolve('public', pathname.slice(1));
    return !fs.existsSync(maybePublicPath);
  }
}

/**
 * For 303's we need to rewrite the location to have host of `localhost`.
 */
function rewriteRedirect(proxyRes, req) {
  if (proxyRes.headers['location'] && proxyRes.statusCode === 303) {
    var u = url.parse(proxyRes.headers['location']);
    u.host = req.headers['host'];
    proxyRes.headers['location'] = u.format();
  }
}

/**
 * In Databricks, we send a cookie with a CSRF token and set the path of the cookie as "/mlflow".
 * We need to rewrite the path to "/" for the dev index.html/bundle.js to use the CSRF token.
 */
function rewriteCookies(proxyRes) {
  if (proxyRes.headers['set-cookie'] !== undefined) {
    const newCookies = [];
    proxyRes.headers['set-cookie'].forEach((c) => {
      newCookies.push(c.replace('Path=/mlflow', 'Path=/'));
    });
    proxyRes.headers['set-cookie'] = newCookies;
  }
}

/**
 * Since the base publicPath is configured to a relative path ("static-files/"),
 * the files referenced inside CSS files (e.g. fonts) can be incorrectly resolved
 * (e.g. /path/to/css/file/static-files/static/path/to/font.woff). We need to override
 * the CSS loader to make sure it will resolve to a proper relative path. This is
 * required for the production (bundled) builds only.
 */
function configureIframeCSSPublicPaths(config, env) {
  // eslint-disable-next-line prefer-const
  let shouldFixCSSPaths = env === 'production';

  if (!shouldFixCSSPaths) {
    return config;
  }

  let cssRuleFixed = false;
  config.module.rules
    .filter((rule) => rule.oneOf instanceof Array)
    .forEach((rule) => {
      rule.oneOf
        .filter((oneOf) => oneOf.test?.toString() === /\.css$/.toString())
        .forEach((cssRule) => {
          cssRule.use
            ?.filter((loaderConfig) => loaderConfig?.loader.match(/[\/\\]mini-css-extract-plugin[\/\\]/))
            .forEach((loaderConfig) => {
              loaderConfig.options = { publicPath: '../../' };
              cssRuleFixed = true;
            });
        });
    });

  if (!cssRuleFixed) {
    throw new Error('Failed to fix CSS paths!');
  }

  return config;
}

function enableOptionalTypescript(config) {
  /**
   * Essential TS config is already inside CRA's config - the only
   * missing thing is resolved extensions.
   */
  config.resolve.extensions.push('.ts', '.tsx');

  /**
   * We're going to exclude typechecking test files from webpack's pipeline
   */

  const ForkTsCheckerPlugin = config.plugins.find((plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin');

  if (ForkTsCheckerPlugin) {
    ForkTsCheckerPlugin.options.typescript.configOverwrite.exclude = [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.stories.tsx',
    ].map((pattern) => path.join(__dirname, 'src', pattern));
  } else {
    throw new Error('Failed to setup Typescript');
  }

  return config;
}

function i18nOverrides(config) {
  // https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      return {
        ...rule,
        oneOf: [
          {
            test: [new RegExp(path.join('src/i18n/', '.*json'))],
            use: [
              {
                loader: require.resolve('./I18nCompileLoader'),
              },
            ],
          },
          ...rule.oneOf,
        ],
      };
    }

    return rule;
  });

  return config;
}

module.exports = function () {
  const config = {
    babel: {
      env: {
        test: {
          plugins: [
            [
              require.resolve('babel-plugin-formatjs'),
              {
                idInterpolationPattern: '[sha512:contenthash:base64:6]',
                removeDefaultMessage: false,
              },
            ],
          ],
        },
      },
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
            importSource: '@emotion/react',
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-formatjs'),
          {
            idInterpolationPattern: '[sha512:contenthash:base64:6]',
          },
        ],
        [
          require.resolve('@emotion/babel-plugin'),
          {
            sourceMap: false,
          },
        ],
      ],
    },
    devServer: {
      ...(useProxyServer && {
        hot: true,
        https: true,
        proxy: [
          // Heads up src/setupProxy.js is indirectly referenced by CRA
          // and also defines proxies.
          {
            context: function (pathname, request) {
              // Dev server's WS calls should not be proxied
              if (isDevserverWebsocketRequest(request)) {
                return false;
              }
              return mayProxy(pathname);
            },
            target: proxyTarget,
            secure: false,
            changeOrigin: true,
            ws: true,
            xfwd: true,
            onProxyRes: (proxyRes, req) => {
              rewriteRedirect(proxyRes, req);
              rewriteCookies(proxyRes);
            },
          },
        ],
        host: 'localhost',
        port: 3000,
        open: false,
      }),
      client: {
        overlay: {
          errors: false,
          warnings: false,
          runtimeErrors: (error) => {
            // It is safe to ignore based on https://stackoverflow.com/a/50387233/12110203.
            if (error?.message.match(/ResizeObserver/i)) {
              return false;
            }
            return true;
          },
        },
      },
    },
    jest: {
      configure: (jestConfig) => {
        /*
         * Jest running on the currently used node version is not yet capable of ESM processing:
         * https://jestjs.io/docs/ecmascript-modules
         * https://nodejs.org/api/vm.html#vm_class_vm_module
         *
         * Since there are certain ESM-built dependencies used in MLFLow, we need
         * to add a few exceptions to the standard ignore pattern for babel.
         */
        const createIgnorePatternForESM = () => {
          // List all the modules that we *want* to be transpiled by babel
          const transpileModules = [
            '@databricks/design-system',
            '@babel/runtime/.+?/esm',
            '@ant-design/icons',
            '@ant-design/icons-svg',
          ];

          // We'll ignore only dependencies in 'node_modules' directly within certain
          // directories in order to avoid false positive matches in nested modules.
          const validNodeModulesRoots = ['mlflow/web/js'];

          // prettier-ignore
          // eslint-disable-next-line max-len
          return `(${validNodeModulesRoots.join('|')})\\/node_modules\\/((?!(${transpileModules.join('|')})).)+(js|jsx|mjs|cjs|ts|tsx|json)$`;
        };

        jestConfig.resetMocks = false; // ML-20462 Restore resetMocks
        jestConfig.collectCoverageFrom = ['src/**/*.{js,jsx}', '!**/*.test.{js,jsx}', '!**/__tests__/*.{js,jsx}'];
        jestConfig.coverageReporters = ['lcov'];
        jestConfig.setupFiles = ['jest-canvas-mock'];
        jestConfig.setupFilesAfterEnv.push('<rootDir>/scripts/env-mocks.js');
        jestConfig.setupFilesAfterEnv.push('<rootDir>/scripts/setup-jest-dom-matchers.js');
        jestConfig.setupFilesAfterEnv.push('<rootDir>/scripts/setup-testing-library.js');
        jestConfig.setupFilesAfterEnv.push('<rootDir>/src/setupTests.js');
        // Adjust config to work with dependencies using ".mjs" file extensions
        jestConfig.moduleFileExtensions.push('mjs');
        // Remove when this issue is resolved: https://github.com/gsoft-inc/craco/issues/393
        jestConfig.transform = {
          '\\.[jt]sx?$': ['babel-jest', { configFile: './jest.babel.config.js' }],
          ...jestConfig.transform,
        };
        jestConfig.transformIgnorePatterns = ['\\.pnp\\.[^\\/]+$', createIgnorePatternForESM()];
        jestConfig.globalSetup = '<rootDir>/scripts/global-setup.js';

        const moduleNameMapper = {
          ...jestConfig.moduleNameMapper,
          // bugfix for ESM issue in remark, see: https://github.com/orgs/remarkjs/discussions/1247
          'unist-util-visit-parents/do-not-use-color': '<rootDir>/node_modules/unist-util-visit-parents/lib/color.js',
          'vfile/do-not-use-conditional-minpath': '<rootDir>/node_modules/vfile/lib/minpath.browser.js',
          'vfile/do-not-use-conditional-minproc': '<rootDir>/node_modules/vfile/lib/minproc.browser.js',
          'vfile/do-not-use-conditional-minurl': '<rootDir>/node_modules/vfile/lib/minurl.browser.js',
          // other aliases
          '@databricks/i18n': '<rootDir>/src/i18n/i18n',
          '@databricks/web-shared/query-client': '<rootDir>/src/common/utils/reactQueryHooks',
          '@databricks/design-system/(.+)': '<rootDir>/node_modules/@databricks/design-system/dist/$1',
          '@databricks/web-shared/(.*)': '<rootDir>/src/shared/web-shared/$1',
          '@mlflow/mlflow/(.*)': '<rootDir>/$1',
        };

        jestConfig.moduleNameMapper = moduleNameMapper;

        return jestConfig;
      },
    },
    webpack: {
      configure: (webpackConfig, { env }) => {
        webpackConfig.output.publicPath = 'static-files/';
        webpackConfig = i18nOverrides(webpackConfig);
        webpackConfig = configureIframeCSSPublicPaths(webpackConfig, env);
        webpackConfig = enableOptionalTypescript(webpackConfig);
        webpackConfig.resolve = {
          ...webpackConfig.resolve,
          plugins: [new TsconfigPathsPlugin(), ...webpackConfig.resolve.plugins],
          fallback: {
            // Required by 'plotly.js' download image feature
            stream: require.resolve('stream-browserify'),
          },
          alias: {
            ...webpackConfig.resolve.alias,
            // Fix integration with react 18 and react-dnd@15
            // https://github.com/react-dnd/react-dnd/issues/3433#issuecomment-1102144912
            'react/jsx-runtime.js': require.resolve('react/jsx-runtime'),
            'react/jsx-dev-runtime.js': require.resolve('react/jsx-dev-runtime'),
          },
        };

        // Add separate entry for notebook renderer
        webpackConfig.entry = {
          main: webpackConfig.entry,
          'ml-model-trace-renderer': path.resolve(
            __dirname,
            'src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.ts',
          ),
          'telemetry-worker': path.resolve(__dirname, 'src/telemetry/worker/TelemetryLogger.worker.ts'),
        };

        // Configure output for multiple entries
        webpackConfig.output = {
          ...webpackConfig.output,
          filename: (pathData) => {
            if (pathData.chunk.name === 'telemetry-worker') {
              // serve SharedWorker file at top-level, it seems to be more
              // stable than if it's contained in `static/js/...`. previously
              // i was running into issues with webpack path resolution
              return 'TelemetryLogger.[name].[contenthash].worker.js';
            }
            return pathData.chunk.name === 'ml-model-trace-renderer'
              ? 'lib/notebook-trace-renderer/js/[name].[contenthash].js'
              : 'static/js/[name].[contenthash:8].js';
          },
          chunkFilename: (pathData) => {
            if (pathData.chunk.name === 'telemetry-worker') {
              return 'TelemetryLogger.[name].[contenthash].worker.chunk.js';
            }
            return pathData.chunk.name?.includes('ml-model-trace-renderer')
              ? 'lib/notebook-trace-renderer/js/[name].[contenthash].chunk.js'
              : 'static/js/[name].[contenthash:8].chunk.js';
          },
        };

        // Configure CSS extraction for notebook renderer
        if (env === 'production') {
          const MiniCssExtractPlugin = webpackConfig.plugins.find(
            (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin',
          );

          if (MiniCssExtractPlugin) {
            MiniCssExtractPlugin.options = {
              ...MiniCssExtractPlugin.options,
              filename: (pathData) => {
                return pathData.chunk.name === 'ml-model-trace-renderer'
                  ? 'lib/notebook-trace-renderer/css/[name].[contenthash].css'
                  : 'static/css/[name].[contenthash:8].css';
              },
              chunkFilename: (pathData) => {
                return pathData.chunk.name?.includes('ml-model-trace-renderer')
                  ? 'lib/notebook-trace-renderer/css/[name].[contenthash].chunk.css'
                  : 'static/css/[name].[contenthash:8].chunk.css';
              },
            };
          }
        }

        // Configure main HtmlWebpackPlugin to exclude notebook renderer chunks
        const mainHtmlPlugin = webpackConfig.plugins.find((plugin) => plugin.constructor.name === 'HtmlWebpackPlugin');
        if (mainHtmlPlugin) {
          mainHtmlPlugin.options.excludeChunks = ['ml-model-trace-renderer', 'telemetry-worker'];
        }

        // Add HTML template for notebook renderer
        webpackConfig.plugins.push(
          new HtmlWebpackPlugin({
            template: path.resolve(
              __dirname,
              'src/shared/web-shared/model-trace-explorer/oss-notebook-renderer/index.html',
            ),
            filename: 'lib/notebook-trace-renderer/index.html',
            chunks: ['ml-model-trace-renderer'],
            inject: true,
            publicPath: '/static-files/',
            minify:
              env === 'production'
                ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  }
                : false,
            base: '/',
          }),
        );

        console.log('Webpack config:', webpackConfig);
        return webpackConfig;
      },
      plugins: [
        new webpack.EnvironmentPlugin({
          MLFLOW_SHOW_GDPR_PURGING_MESSAGES: process.env.MLFLOW_SHOW_GDPR_PURGING_MESSAGES ? 'true' : 'false',
          MLFLOW_USE_ABSOLUTE_AJAX_URLS: process.env.MLFLOW_USE_ABSOLUTE_AJAX_URLS ? 'true' : 'false',
        }),
      ],
    },
  };
  return config;
};
```

--------------------------------------------------------------------------------

---[FILE: jest.babel.config.js]---
Location: mlflow-master/mlflow/server/js/jest.babel.config.js

```javascript
/**
 * Babel config for running Jest tests
 */

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    [
      require.resolve('babel-plugin-formatjs'),
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        removeDefaultMessage: false,
      },
    ],
  ],
};
```

--------------------------------------------------------------------------------

---[FILE: knip-preprocessor.ts]---
Location: mlflow-master/mlflow/server/js/knip-preprocessor.ts

```typescript
import type { Preprocessor } from 'knip';

const preprocess: Preprocessor = (options) => {
  Object.keys(options.issues.exports).forEach((file) => {
    // Ignore unused exports from files starting with "oss_" because they are used in
    // the OSS version. This may overmatch some files that are actually unused in the
    // OSS version but it's hard to check the OSS version in our current setup so it's
    // fine to be conservative.
    if (file.includes('oss_')) {
      // Reduce `exports` counter since the exit code is based on it.
      options.counters.exports -= Object.keys(options.issues.exports[file]).length;
      delete options.issues.exports[file];
      return;
    }
    Object.keys(options.issues.exports[file]).forEach((exportIdentifier) => {
      // Ignore unused exports starting with "oss_" because they are used in the OSS
      // version. See above comment for explanation on why we are being conservative.
      if (exportIdentifier.startsWith('oss_')) {
        // Reduce `exports` counter since the exit code is based on it.
        options.counters.exports -= 1;
        delete options.issues.exports[file][exportIdentifier];
      }
    });
  });
  return options;
};

export default preprocess;
```

--------------------------------------------------------------------------------

---[FILE: knip.jsonc]---
Location: mlflow-master/mlflow/server/js/knip.jsonc

```text
{
  "$schema": "https://unpkg.com/knip@5/schema-jsonc.json",
  "entry": [
    // Main entry point
    "src/index.tsx",

    // Setup files
    "src/setupProxy.js",
    "src/setupTests.js",

    // GraphQL codegen files
    "src/graphql/graphql-codegen.ts",
    "src/graphql/generated_graphql.ts",

    // Feature store MFE entry points
    "src/feature-store/index.tsx",
    "src/feature-store/mfe/prefetch.ts",
    "src/feature-store/mfe/register.tsx",
    "src/feature-store/mfe/set-public-path.ts",

    // MFE entry points
    "src/mfe/prefetch.ts",
    "src/mfe/public-path-utils.ts",
    "src/mfe/register.tsx",
    "src/mfe/set-public-path.ts",

    // Test and storybook files
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.stories.{js,jsx,ts,tsx}"
  ],
  // Only warn on unused files and exports
  "include": ["files", "exports"],
  "ignore": ["**/*.d.ts", "src/shared/{databricks_edge,web-shared}/**/*.{js,jsx,ts,tsx}", "**/*.{js,jsx,ts,tsx}"],
  "project": ["src/**/*.{js,jsx,ts,tsx}"]
}
```

--------------------------------------------------------------------------------

---[FILE: lint.sh]---
Location: mlflow-master/mlflow/server/js/lint.sh

```bash
#!/usr/bin/env bash
yarn lint:fix
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/mlflow/server/js/package.json
Signals: React

```json
{
  "name": "@mlflow/mlflow",
  "version": "0.1.0",
  "scripts": {
    "start": "craco start",
    "storybook": "start-storybook -p 6006 -s public",
    "build-storybook": "build-storybook -s public",
    "test": "craco --max_old_space_size=8192 test --env=jsdom --colors --watchAll=false",
    "test:watch": "yarn test --watch",
    "test:ci": "CI=true craco test --env=jsdom --colors --forceExit --ci --coverage",
    "lint": "eslint --ext js,jsx,ts,tsx src",
    "lint:fix": "eslint --ext js,jsx,ts,tsx src --fix",
    "type-check": "tsc --noEmit",
    "prettier:fix": "prettier . --write",
    "prettier:check": "prettier . --check",
    "i18n:check": "yarn i18n --lint",
    "i18n": "node scripts/extract-i18n.js",
    "knip": "knip --reporter markdown --preprocessor ./knip-preprocessor.ts",
    "build": "GENERATE_SOURCEMAP=false craco --max_old_space_size=8192 build",
    "prettier": "prettier",
    "graphql-codegen": "python ../../../dev/proto_to_graphql/code_generator.py && yarn graphql-codegen:clean && yarn graphql-codegen:base",
    "graphql-codegen:base": "graphql-codegen --config ./src/graphql/graphql-codegen.ts",
    "graphql-codegen:clean": "find . -path '**/__generated__/*.ts' | xargs rm"
  },
  "dependencies": {
    "@ag-grid-community/client-side-row-model": "^27.2.1",
    "@ag-grid-community/core": "^27.2.1",
    "@ag-grid-community/react": "^27.2.1",
    "@apollo/client": "^3.6.9",
    "@craco/craco": "7.0.0-alpha.0",
    "@databricks/design-system": "^1.12.21",
    "@emotion/cache": "^11.11.0",
    "@emotion/react": "^11.11.3",
    "@tanstack/react-query": "^4.29.17",
    "@tanstack/react-table": "^8.8.2",
    "@tanstack/react-virtual": "^3.8.1",
    "@types/react-virtualized": "^9.21.9",
    "babel-jest": "^30.2.0",
    "buffer": "^6.0.3",
    "bytes": "3.0.0",
    "classnames": "^2.2.6",
    "cookie": "0.3.1",
    "cronstrue": "^1.94.0",
    "d3-array": "^3.2.4",
    "d3-scale": "^2.1.0",
    "dateformat": "3.0.3",
    "diff": "5.1.0",
    "file-saver": "^2.0.5",
    "font-awesome": "4.7.0",
    "graphql": "^15.5.0",
    "http-proxy-middleware": "^1.0.3",
    "immutable": "3.8.1",
    "invariant": "^2.2.4",
    "js-yaml": "^3.14.0",
    "json-bigint": "databricks/json-bigint#a1defaf9cd8dd749f0fd4d5f83a22cd846789658",
    "leaflet": "^1.5.1",
    "lodash": "^4.17.21",
    "moment": "^2.29.4",
    "pako": "0.2.7",
    "papaparse": "^5.3.2",
    "parcoord-es": "^2.2.10",
    "pdfjs-dist": "^5.3.31",
    "plotly.js": "2.5.1",
    "prop-types": "^15.8.1",
    "qs": "6.10.5",
    "rc-image": "~5.2.4",
    "react": "^18.2.0",
    "react-dnd": "^15.1.1",
    "react-dnd-html5-backend": "^15.1.2",
    "react-dom": "^18.2.0",
    "react-draggable": "^4.4.6",
    "react-error-boundary": "^4.0.2",
    "react-hook-form": "^7.36.0",
    "react-iframe": "1.8.0",
    "react-intl": "^6.0.4",
    "react-markdown-10": "npm:react-markdown@10",
    "react-mde": "^11.0.0",
    "react-pdf": "^10.0.1",
    "react-plotly.js": "^2.5.1",
    "react-redux": "^7.2.5",
    "react-resizable": "^3.0.4",
    "react-router": "^6.4.0",
    "react-router-dom": "^6.4.3",
    "react-syntax-highlighter": "^15.4.5",
    "react-treebeard": "2.1.0",
    "react-vega": "^7.6.0",
    "react-virtual": "^2.10.4",
    "react-virtualized": "^9.21.2",
    "redux": "^4.1.1",
    "redux-promise-middleware": "^5.1.1",
    "redux-thunk": "^2.3.0",
    "remark-gfm-4": "npm:remark-gfm@4",
    "sanitize-html": "^1.18.5",
    "showdown": "^1.8.6",
    "stream-browserify": "^3.0.0",
    "url": "^0.11.0",
    "use-clipboard-copy": "^0.2.0",
    "use-debounce": "^10.0.4",
    "use-sync-external-store": "^1.2.0",
    "wavesurfer.js": "^7.8.8",
    "zustand": "^4.5.6"
  },
  "devDependencies": {
    "@babel/core": "^7.27.3",
    "@babel/eslint-parser": "^7.22.15",
    "@babel/preset-env": "^7.27.2",
    "@babel/preset-react": "^7.27.1",
    "@babel/preset-typescript": "^7.27.1",
    "@emotion/babel-plugin": "^11.11.0",
    "@emotion/babel-preset-css-prop": "^11.11.0",
    "@emotion/eslint-plugin": "^11.7.0",
    "@formatjs/cli": "^4.2.15",
    "@graphql-codegen/cli": "^5.0.0",
    "@graphql-codegen/typescript": "^4.0.1",
    "@graphql-codegen/typescript-operations": "^4.0.1",
    "@jest/globals": "^30.0.2",
    "@storybook/addon-actions": "^6.5.5",
    "@storybook/addon-docs": "^6.5.5",
    "@storybook/addon-essentials": "^6.5.5",
    "@storybook/addon-links": "^6.5.5",
    "@storybook/builder-webpack5": "6.5.5",
    "@storybook/manager-webpack5": "6.5.5",
    "@storybook/node-logger": "^6.5.5",
    "@storybook/preset-create-react-app": "^4.1.0",
    "@storybook/react": "^6.5.5",
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/d3-array": "^3.2.1",
    "@types/d3-scale": "^2.1.0",
    "@types/diff": "^5.1.0",
    "@types/file-saver": "^2.0.3",
    "@types/invariant": "^2.2.35",
    "@types/jest": "^29.5.14",
    "@types/pako": "^2.0.0",
    "@types/plotly.js": "^1.54.21",
    "@types/react": "^17.0.50",
    "@types/react-dom": "^17.0.17",
    "@types/react-plotly.js": "^2.5.0",
    "@types/react-resizable": "^3.0.3",
    "@types/react-router": "^5.1.20",
    "@types/react-router-dom": "^5.3.3",
    "@types/use-sync-external-store": "^0.0.3",
    "@typescript-eslint/eslint-plugin": "^8.39.0",
    "@typescript-eslint/parser": "^8.39.0",
    "@wojtekmaj/enzyme-adapter-react-17": "^0.6.3",
    "argparse": "^2.0.1",
    "babel-plugin-formatjs": "^10.2.14",
    "babel-plugin-react-require": "^3.1.3",
    "confusing-browser-globals": "^1.0.11",
    "enzyme": "^3.11.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-config-standard": "10.2.1",
    "eslint-import-resolver-webpack": "0.8.4",
    "eslint-loader": "2.1.1",
    "eslint-plugin-chai-expect": "1.1.1",
    "eslint-plugin-chai-friendly": "^0.7.2",
    "eslint-plugin-cypress": "^2.12.1",
    "eslint-plugin-flowtype": "^8.0.3",
    "eslint-plugin-formatjs": "^3.1.5",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-jest": "^26.5.3",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-mlflow": "link:./custom-eslint-rules/",
    "eslint-plugin-no-lookahead-lookbehind-regexp": "^0.1.0",
    "eslint-plugin-no-only-tests": "^2.6.0",
    "eslint-plugin-node": "5.2.1",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-promise": "3.6.0",
    "eslint-plugin-react": "^7.30.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-standard": "3.0.1",
    "eslint-plugin-testing-library": "^6.1.0",
    "fast-glob": "^3.2.11",
    "graphql-codegen-typescript-operation-types": "^2.0.1",
    "jest-canvas-mock": "^2.2.0",
    "jest-localstorage-mock": "^2.3.0",
    "knip": "^5.30.2",
    "msw": "^1.2.3",
    "postcss-normalize": "^10.0.1",
    "prettier": "2.8.0",
    "react-17": "npm:react@^17.0.2",
    "react-dom-17": "npm:react-dom@^17.0.2",
    "react-scripts": "5.0.0",
    "react-test-renderer-17": "npm:react-test-renderer@^17.0.2",
    "redux-mock-store": "^1.5.3",
    "stream-browserify": "^3.0.0",
    "tsconfig-paths-webpack-plugin": "^4.0.1",
    "typescript": "^5.9.3",
    "webpack": "^5.69.0",
    "whatwg-fetch": "^3.6.17"
  },
  "private": true,
  "engines": {
    "node": "^22.19.0"
  },
  "resolutions": {
    "@floating-ui/dom@^0.5.3": "patch:@floating-ui/dom@npm%3A0.5.4#yarn/patches/@floating-ui-dom-0.5.4.diff",
    "@types/react": "^17.0.50",
    "@emotion/react": "11.11.0",
    "@types/react-plotly.js/@types/plotly.js": "^1.54.6",
    "babel-jest": "^30.2.0",
    "cheerio": ">=1.0.0-rc.3 <1.0.0",
    "d3-transition": "3.0.1",
    "react-dev-utils/fork-ts-checker-webpack-plugin": "6.5.3",
    "postcss-preset-env/autoprefixer": "10.4.5",
    "rc-virtual-list@^3.2.0": "patch:rc-virtual-list@npm%3A3.2.0#yarn/patches/rc-virtual-list-npm-3.2.0-5efaefc12e.patch",
    "rc-virtual-list@^3.0.3": "patch:rc-virtual-list@npm%3A3.2.0#yarn/patches/rc-virtual-list-npm-3.2.0-5efaefc12e.patch",
    "rc-virtual-list@^3.0.1": "patch:rc-virtual-list@npm%3A3.2.0#yarn/patches/rc-virtual-list-npm-3.2.0-5efaefc12e.patch"
  },
  "//": "homepage is hard to configure without resorting to env variables and doesn't play nicely with other webpack settings. This field should be removed.",
  "homepage": "static-files",
  "browserslist": [
    "defaults"
  ],
  "babel": {
    "env": {
      "test": {
        "plugins": [
          [
            "babel-plugin-formatjs",
            {
              "idInterpolationPattern": "[sha512:contenthash:base64:6]",
              "removeDefaultMessage": false
            }
          ]
        ]
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: prettier.config.js]---
Location: mlflow-master/mlflow/server/js/prettier.config.js

```javascript
module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
};
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: mlflow-master/mlflow/server/js/tsconfig.json
Signals: React

```json
{
  "extends": [],
  "compilerOptions": {
    "types": [
      "node",
      "@testing-library/jest-dom/jest-globals"
    ],
    "noPropertyAccessFromIndexSignature": true,
    "jsxImportSource": "@emotion/react",
    "paths": {
      "@mlflow/mlflow/*": [
        "./*"
      ],
      "@databricks/i18n": [
        "./src/i18n/i18n"
      ],
      "@databricks/web-shared/query-client": [
        "./src/common/utils/reactQueryHooks"
      ],
      "@databricks/web-shared/*": [
        "./src/shared/web-shared/*"
      ]
    },
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable",
      "WebWorker"
    ],
    "strict": true,
    "rootDir": ".",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "incremental": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "declaration": false,
    "sourceMap": false,
    "declarationMap": false,
    "jsx": "preserve",
    "isolatedModules": true
  },
  "references": [],
  "include": [
    "./src/**/*"
  ],
  "ts-node": {
    "swc": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: main.js]---
Location: mlflow-master/mlflow/server/js/.storybook/main.js

```javascript
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    /**
     * Setting proper tsconfig file for the ForkTsChecker plugin
     */
    const ForkTsCheckerPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'ForkTsCheckerWebpackPlugin',
    );
    if (ForkTsCheckerPlugin) {
      ForkTsCheckerPlugin.options.typescript.configOverwrite.include = [
        path.resolve(__dirname, '../src/**/*.d.ts'),
        path.resolve(__dirname, '../src/**/*.stories.tsx'),
      ];
    }

    // Browserifying "stream" package, as in craco.config.js file
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
    };

    /**
     * Adding @emotion/react and formatjs support here.
     *
     * We're pushing additional babel-loader rule to the end of
     * the processing chain instead of messing up with existing
     * entry due to importance of the loader precedence.
     * See https://github.com/storybookjs/storybook/issues/7540
     */
    config.module.rules.push({
      test: /\.[tj]sx?$/,
      include: path.resolve(__dirname, '../src'),
      loader: require.resolve('babel-loader'),
      options: {
        presets: [require.resolve('@emotion/babel-preset-css-prop')],
        plugins: [
          ['react-require'],
          [
            require.resolve('babel-plugin-formatjs'),
            {
              idInterpolationPattern: '[sha512:contenthash:base64:6]',
            },
          ],
        ],
        overrides: [
          {
            test: /\.tsx?$/,
            presets: [[require.resolve('@babel/preset-typescript')]],
          },
        ],
      },
    });
    return config;
  },
};
```

--------------------------------------------------------------------------------

---[FILE: preview.js]---
Location: mlflow-master/mlflow/server/js/.storybook/preview.js
Signals: Redux/RTK

```javascript
import '@databricks/design-system/dist/index.css';
import { designSystemDecorator } from './decorators/design-system';
import '../src/index.css';
import { withIntlDecorator } from './decorators/with-intl';
import { withRouterDecorator } from './decorators/with-router';
import { withReduxDecorator } from './decorators/with-redux';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  designSystemDecorator,
  withIntlDecorator,
  withRouterDecorator,
  withReduxDecorator,
];
```

--------------------------------------------------------------------------------

---[FILE: design-system.js]---
Location: mlflow-master/mlflow/server/js/.storybook/decorators/design-system.js
Signals: React

```javascript
import React from 'react';
import { Global } from '@emotion/react';
import { useRef } from 'react';
import { DesignSystemContainer } from '../../src/common/components/DesignSystemContainer';

export const designSystemDecorator = (Story) => {
  const modalContainerRef = useRef(null);

  return (
    <DesignSystemContainer isCompact getPopupContainer={() => modalContainerRef.current}>
      <>
        <Global
          styles={{
            'html, body': {
              fontSize: 13,
              fontFamily:
                '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
              height: '100%',
            },
            '#root': { height: '100%' },
            '*': {
              boxSizing: 'border-box',
            },
          }}
        />
        <Story />
        <div ref={modalContainerRef} />
      </>
    </DesignSystemContainer>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: with-intl.js]---
Location: mlflow-master/mlflow/server/js/.storybook/decorators/with-intl.js

```javascript
import { IntlProvider } from 'react-intl';

const defaultIntlProps = {
  messages: {},
  locale: 'en',
  onError: (e) => {
    // Omit missing translation errors in storybook
    if (e.code === 'MISSING_TRANSLATION') {
      return null;
    }
    throw e;
  },
};

/**
 * Enabling react-intl capabilities to stories by wrapping the story
 * with the custom Intl Provider.
 *
 * Basic usage:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withIntl: true
 *   }
 * };
 *
 * Usage with changed IntlProvider settings:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withIntl: {
 *       locale: 'jp',
 *       messages: {
 *         foo: 'bar'
 *       },
 *     },
 *   },
 * };
 */
export const withIntlDecorator = (Story, { parameters }) => {
  if (parameters.withIntl) {
    const intlProps = {
      ...defaultIntlProps,
      ...(typeof parameters.withIntl === 'object' ? parameters.withIntl : {}),
    };

    return (
      <IntlProvider {...intlProps}>
        <Story />
      </IntlProvider>
    );
  }

  return <Story />;
};
```

--------------------------------------------------------------------------------

---[FILE: with-redux.js]---
Location: mlflow-master/mlflow/server/js/.storybook/decorators/with-redux.js
Signals: Redux/RTK

```javascript
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

const identityReducer = (store) => store;

/**
 * Adds redux capabilities to stories by wrapping the story
 * with redux provider
 *
 * Basic usage that provides identity reducer and empty state:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withRedux: true
 *   }
 * };
 *
 * Usage with setting custom reducer and/or initial state:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withRedux: {
 *       reducer: (store) => store,
 *       initialState: { foo: 'bar' }
 *     },
 *   },
 * };
 */
export const withReduxDecorator = (Story, { parameters }) => {
  if (parameters.withRedux) {
    const createStoreProps = typeof parameters.withRedux === 'object' ? parameters.withRedux : {};
    return (
      <Provider
        store={createStore(
          createStoreProps.reducer || identityReducer,
          { ...(createStoreProps.initialState || {}) },
          applyMiddleware(thunk, promiseMiddleware()),
        )}
      >
        <Story />
      </Provider>
    );
  }

  return <Story />;
};
```

--------------------------------------------------------------------------------

---[FILE: with-router.js]---
Location: mlflow-master/mlflow/server/js/.storybook/decorators/with-router.js

```javascript
import { MemoryRouter } from 'react-router-dom';

/**
 * Adds router capabilities to stories by wrapping the story
 * with Static Router.
 *
 * Basic usage:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withRouter: true
 *   }
 * };
 *
 * Usage with changing location:
 *
 * export default {
 *   title: 'Story/Path',
 *   component: Component,
 *   parameters: {
 *     withRouter: {
 *       location: '/some/location',
 *     },
 *   },
 * };
 */
export const withRouterDecorator = (Story, { parameters }) => {
  if (parameters.withRouter) {
    const routerProps = typeof parameters.withRouter === 'object' ? parameters.withRouter : {};
    return (
      <MemoryRouter initialEntries={['/']} {...routerProps}>
        <Story />
      </MemoryRouter>
    );
  }

  return <Story />;
};
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/index.js

```javascript
const noAbsoluteAjaxUrls = require('./no-absolute-ajax-urls');

module.exports = {
  rules: {
    'no-absolute-ajax-urls': noAbsoluteAjaxUrls,
  },
  configs: {
    recommended: {
      plugins: ['mlflow'],
      rules: {
        'mlflow/no-absolute-ajax-urls': 'error',
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: no-absolute-ajax-urls.js]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/no-absolute-ajax-urls.js

```javascript
/**
 * Custom ESLint rule to prevent absolute AJAX URLs in the UI, as some deployments
 * configurations will break if the AJAX URL is absolute.
 *
 * All AJAX routes should be relative and wrapped in `getAjaxUrl`, which automatically
 * appends a leading slash based on whether a build-time env var (`MLFLOW_USE_ABSOLUTE_AJAX_URLS`)
 * is set.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow absolute AJAX URLs containing /ajax-api/',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      absoluteAjaxUrl:
        'Absolute AJAX URL detected. Use relative URLs wrapped in getAjaxUrl() instead. Example: getAjaxUrl("ajax-api/...")',
    },
  },
  create(context) {
    return {
      Literal(node) {
        // Check if the node is a string literal
        if (typeof node.value !== 'string') {
          return;
        }

        const stringValue = node.value;

        // Check if the string contains '/ajax-api/'
        if (stringValue.includes('/ajax-api/')) {
          context.report({
            node,
            messageId: 'absoluteAjaxUrl',
          });
        }
      },
      TemplateLiteral(node) {
        // Check template literals (e.g., `something ${var}`)
        // We check the quasis (static parts of the template)
        for (const quasi of node.quasis) {
          if (quasi.value.raw.includes('/ajax-api/')) {
            context.report({
              node,
              messageId: 'absoluteAjaxUrl',
            });
          }
        }
      },
    };
  },
};
```

--------------------------------------------------------------------------------

````

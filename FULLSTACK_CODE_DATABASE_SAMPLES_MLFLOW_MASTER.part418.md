---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 418
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 418 of 991)

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

---[FILE: no-absolute-ajax-urls.test.js]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/no-absolute-ajax-urls.test.js

```javascript
/**
 * Tests for no-absolute-ajax-urls custom ESLint rule
 */

const { RuleTester } = require('eslint');
const rule = require('./no-absolute-ajax-urls');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-absolute-ajax-urls', rule, {
  valid: [
    {
      code: `const url = getAjaxUrl('ajax-api/2.0/mlflow/experiments');`,
    },
    // URLs that don't contain '/ajax-api/'
    {
      code: `const url = '/api/v1/users';`,
    },
    {
      code: `const url = 'https://example.com/api';`,
    },
    {
      code: `const url = \`/some/other/\${path}\`;`,
    },
    // comments mentioning '/ajax-api/' should be allowed
    {
      code: `// This uses /ajax-api/ endpoint\nconst url = 'ajax-api/2.0/mlflow';`,
    },
  ],

  invalid: [
    // string literal with leading slash
    {
      code: `const url = '/ajax-api/2.0/mlflow/experiments';`,
      errors: [
        {
          messageId: 'absoluteAjaxUrl',
        },
      ],
    },
    // fetch call with absolute URL
    {
      code: `fetch('/ajax-api/2.0/mlflow/runs');`,
      errors: [
        {
          messageId: 'absoluteAjaxUrl',
        },
      ],
    },
    // fetch call with absolute URL
    {
      code: `fetch('/ajax-api/2.0/mlflow/experiments/list');`,
      errors: [
        {
          messageId: 'absoluteAjaxUrl',
        },
      ],
    },
    // template literal with leading slash
    {
      code: `const url = \`/ajax-api/2.0/mlflow/experiments/\${id}\`;`,
      errors: [
        {
          messageId: 'absoluteAjaxUrl',
        },
      ],
    },
    // within object
    {
      code: `const config = { url: '/ajax-api/2.0/mlflow/experiments' };`,
      errors: [
        {
          messageId: 'absoluteAjaxUrl',
        },
      ],
    },
  ],
});
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/package.json

```json
{
  "name": "eslint-plugin-mlflow",
  "version": "1.0.0",
  "description": "ESLint plugin for MLflow custom rules.",
  "main": "index.js",
  "files": [
    "index.js"
  ],
  "scripts": {
    "test": "node --test **/*.test.js"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/README.md

```text
# Custom ESLint Rules

This directory contains custom ESLint rules specific to the MLflow UI codebase.

## How It Works

This package is locally referenced by `mlflow/server/js/package.json` as `eslint-plugin-mlflow`.
In `mlflow/server/js/.eslintrc.json`, we automatically load the recommended rules in `index.js`.

## Adding New Custom Rules

1. Create a new `.js` file in this directory (e.g., `my-custom-rule.js`)
2. Export an ESLint rule module with `meta` and `create` functions:

```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Description of your rule',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      myMessage: 'Your error message here',
    },
  },
  create(context) {
    return {
      // Your rule implementation
    };
  },
};
```

3. Import the rule in `index.js`, and add it to the `rules` sections of the export (add to the
   top-level `rules` config as well as the one in `recommended`):

```javascript
const myCustomRule = require('./my-custom-rule');

module.exports = {
  rules: {
    // ...
    'my-custom-rule': myCustomRule,
  },
  configs: {
    recommended: {
      plugins: ['mlflow'],
      rules: {
        'mlflow/my-custom-rule': 'error',
      },
    },
  },
};
```

4. Run `yarn install` from `mlflow/server/js` to make sure the new rules are loaded

5. Run `yarn lint` from `mlflow/server/js` to make sure the new rule works as intended

## Testing Custom Rules

Run `yarn test` to run all tests in the directory. We currently use ESlint's `RuleTester` util to
write unit tests for our rules. Alternatively you can spot-check by running `yarn lint` in
`mlflow/server/js` on files you expect to fail your rule.
```

--------------------------------------------------------------------------------

---[FILE: yarn.lock]---
Location: mlflow-master/mlflow/server/js/custom-eslint-rules/yarn.lock

```text
# This file is generated by running "yarn install" inside your project.
# Manual changes might be lost - proceed with caution!

__metadata:
  version: 8
  cacheKey: 10c0

"eslint-plugin-mlflow@workspace:.":
  version: 0.0.0-use.local
  resolution: "eslint-plugin-mlflow@workspace:."
  languageName: unknown
  linkType: soft
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/mlflow/server/js/I18nCompileLoader/index.js

```javascript
const loaderUtils = require('loader-utils');
const { resolveBuiltinFormatter } = require('@formatjs/cli/src/formatters');

/**
 * This is an async loader we use to compile localization resources and write back.
 *   Compare to FormatJS native compile function, it only support `format` option.
 * @param content resource file content
 */
module.exports = async function i18nLoader(content) {
  this.cacheable();
  const callback = this.async();
  const { format } = loaderUtils.getOptions(this) || {};
  const formatter = await resolveBuiltinFormatter(format);
  const resourceFileContent = JSON.parse(content);
  const compiledContent = await formatter.compile(resourceFileContent);
  return callback(null, JSON.stringify(compiledContent));
};
```

--------------------------------------------------------------------------------

---[FILE: index.html]---
Location: mlflow-master/mlflow/server/js/public/index.html

```text
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="shortcut icon" href="./static-files/favicon.ico" />
    <meta name="theme-color" content="#000000" />
    <!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
    <link rel="manifest" href="./static-files/manifest.json" crossorigin="use-credentials" />
    <title>MLflow</title>
  </head>

  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root" class="mlflow-ui-container"></div>
    <div id="modal" class="mlflow-ui-container"></div>
  </body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: manifest.json]---
Location: mlflow-master/mlflow/server/js/public/manifest.json
Signals: React

```json
{
  "short_name": "React App",
  "name": "Create React App Sample",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

--------------------------------------------------------------------------------

---[FILE: env-mocks.js]---
Location: mlflow-master/mlflow/server/js/scripts/env-mocks.js

```javascript
// Globally used polyfills
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
};
```

--------------------------------------------------------------------------------

---[FILE: extract-i18n.js]---
Location: mlflow-master/mlflow/server/js/scripts/extract-i18n.js

```javascript
const { extract } = require('@formatjs/cli');
const fs = require('fs');
const { sync: globSync } = require('fast-glob');
const { ArgumentParser } = require('argparse');

const OUT_FILE = './src/lang/default/en.json';
const FILE_PATTERN = 'src/**/*.(j|t)s?(x)';
const FILE_IGNORE_PATTERNS = ['**/*.d.ts', '**/*.(j|t)est.(j|t)s?(x)'];
const EXTRACT_OPTS = {
  idInterpolationPattern: '[sha512:contenthash:base64:6]',
  removeDefaultMessage: false,
  extractFromFormatMessageCall: true,
  ast: true,
};

const parser = new ArgumentParser({
  description: 'Databricks i18n Key Extractor',
  add_help: true,
});
parser.add_argument('-l', '--lint', {
  action: 'store_true',
  help: 'Only report if the extracted keys need to be updated without actually updating.',
});

async function main(args) {
  const files = globSync(FILE_PATTERN, { ignore: FILE_IGNORE_PATTERNS });

  const extractedMessages = JSON.parse(await extract(files, EXTRACT_OPTS));
  console.log(`Extracted ${Object.keys(extractedMessages).length} keys from ${files.length} files`);

  if (args.lint) {
    let existingMessages = {};
    if (fs.existsSync(OUT_FILE)) {
      existingMessages = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
      console.log(`There are ${Object.keys(existingMessages).length} existing keys in ${OUT_FILE}`);
    } else {
      console.log(`${OUT_FILE} does not exist`);
    }

    const extractedKeys = Object.keys(extractedMessages);
    const existingKeys = new Set(Object.keys(existingMessages));

    if (extractedKeys.length === existingKeys.size && extractedKeys.every((key) => existingKeys.has(key))) {
      console.log('Extracted keys are up-to-date.');
      process.exit(0);
    } else {
      console.log('Mismatch detected between extracted keys. Run without --lint to update.');
      process.exit(1);
    }
  } else {
    fs.writeFileSync(OUT_FILE, JSON.stringify(extractedMessages, null, 2));
  }
}

if (require.main === module) {
  main(parser.parse_args());
}
```

--------------------------------------------------------------------------------

---[FILE: global-setup.js]---
Location: mlflow-master/mlflow/server/js/scripts/global-setup.js

```javascript
const { execSync } = require('child_process');
const os = require('os');

module.exports = () => {
  // On windows, the timezone is not set with `TZ=GMT`. As a workaround, use `tzutil`.
  // This approach is taken from https://www.npmjs.com/package/set-tz.
  if (os.platform() === 'win32') {
    const TZ = 'UTC';
    const previousTZ = execSync('tzutil /g').toString();
    const cleanup = () => {
      execSync(`tzutil /s "${previousTZ}"`);
      console.log(`Restored timezone to ${previousTZ}`);
    };
    execSync(`tzutil /s "${TZ}"`);
    console.warn(
      `Changed timezone to ${TZ}. If process is killed, manually run: tzutil /s "${previousTZ}"`,
    );
    process.on('exit', cleanup);
    process.on('SIGINT', () => {
      process.exit(2);
    });
  } else {
    process.env.TZ = 'GMT';
  }
};
```

--------------------------------------------------------------------------------

---[FILE: setup-jest-dom-matchers.js]---
Location: mlflow-master/mlflow/server/js/scripts/setup-jest-dom-matchers.js

```javascript
require('@testing-library/jest-dom');
```

--------------------------------------------------------------------------------

---[FILE: setup-testing-library.js]---
Location: mlflow-master/mlflow/server/js/scripts/setup-testing-library.js

```javascript
require('@testing-library/jest-dom/jest-globals');
const { configure } = require('@testing-library/react');

configure({
  asyncUtilTimeout: 10000,
});
```

--------------------------------------------------------------------------------

---[FILE: app.tsx]---
Location: mlflow-master/mlflow/server/js/src/app.tsx
Signals: React, Redux/RTK

```typescript
import React, { useCallback, useEffect, useMemo } from 'react';
import { ApolloProvider } from '@mlflow/mlflow/src/common/utils/graphQLHooks';
import { RawIntlProvider } from 'react-intl';

import 'font-awesome/css/font-awesome.css';
import './index.css';

import { ApplyGlobalStyles, DesignSystemEventProvider } from '@databricks/design-system';
import '@databricks/design-system/dist/index.css';
import '@databricks/design-system/dist/index-dark.css';
import { Provider } from 'react-redux';
import store from './store';
import { useI18nInit } from './i18n/I18nUtils';
import { DesignSystemContainer } from './common/components/DesignSystemContainer';
import { QueryClient, QueryClientProvider } from '@mlflow/mlflow/src/common/utils/reactQueryHooks';
import { createApolloClient } from './graphql/client';
import { LegacySkeleton } from '@databricks/design-system';
// eslint-disable-next-line no-useless-rename
import { MlflowRouter as MlflowRouter } from './MlflowRouter';
import { useMLflowDarkTheme } from './common/hooks/useMLflowDarkTheme';
import { DarkThemeProvider } from './common/contexts/DarkThemeContext';
import { telemetryClient } from './telemetry';

export function MLFlowRoot() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useI18nInit();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const apolloClient = useMemo(() => createApolloClient(), []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useMemo(() => new QueryClient(), []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isDarkTheme, setIsDarkTheme, MlflowThemeGlobalStyles] = useMLflowDarkTheme();

  const logObservabilityEvent = useCallback((event: any) => {
    telemetryClient.logEvent(event);
  }, []);

  if (!intl) {
    return (
      <DesignSystemContainer>
        <LegacySkeleton />
      </DesignSystemContainer>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <RawIntlProvider value={intl} key={intl.locale}>
        <Provider store={store}>
          <DesignSystemEventProvider callback={logObservabilityEvent}>
            <DesignSystemContainer isDarkTheme={isDarkTheme}>
              <ApplyGlobalStyles />
              <MlflowThemeGlobalStyles />
              <DarkThemeProvider setIsDarkTheme={setIsDarkTheme}>
                <QueryClientProvider client={queryClient}>
                  <MlflowRouter />
                </QueryClientProvider>
              </DarkThemeProvider>
            </DesignSystemContainer>
          </DesignSystemEventProvider>
        </Provider>
      </RawIntlProvider>
    </ApolloProvider>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: assets.d.ts]---
Location: mlflow-master/mlflow/server/js/src/assets.d.ts
Signals: React

```typescript
declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

  const src: string;
  export default src;
}

declare module '*.gql' {
  import type { DocumentNode } from '@mlflow/mlflow/src/graphql';
  const value: DocumentNode;
  export default value;
}

declare module '*?raw' {
  const value: string;
  export default value;
}
```

--------------------------------------------------------------------------------

---[FILE: broken.d.ts]---
Location: mlflow-master/mlflow/server/js/src/broken.d.ts
Signals: Redux/RTK

```typescript
/**
 * Listing of modules without type definitions
 */

declare module 'cookie';
declare module 'json-bigint';
declare module 'js-yaml';
declare module 'sanitize-html';
declare module 'enzyme';
declare module 'redux-promise-middleware';
declare module 'redux-mock-store';
declare module 'leaflet';
```

--------------------------------------------------------------------------------

---[FILE: emotion.d.ts]---
Location: mlflow-master/mlflow/server/js/src/emotion.d.ts

```typescript
import '@emotion/react';
import type { DesignSystemThemeInterface } from '@databricks/design-system';

type ThemeType = DesignSystemThemeInterface['theme'];

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ThemeType {}
}
```

--------------------------------------------------------------------------------

---[FILE: globals.d.ts]---
Location: mlflow-master/mlflow/server/js/src/globals.d.ts

```typescript
export type Timeout = ReturnType<typeof window.setTimeout>;

declare global {
  //
  interface Window {
    /** Used by a few unit tests  */
    isTestingIframe?: boolean;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.css]---
Location: mlflow-master/mlflow/server/js/src/index.css

```text
@import 'reset.css';
@import 'common/components/EditableNote.css';
@import 'model-registry/index.css';

a {
  color: #2374bb;
}
a:hover,
a:focus {
  color: #005580;
}

body {
  margin: 0;
  padding: 0;
}

#root {
  height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: mlflow-master/mlflow/server/js/src/index.tsx
Signals: React

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { MLFlowRoot } from './app';

ReactDOM.render(<MLFlowRoot />, document.getElementById('root'));

const windowOnError = (message: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
  // eslint-disable-next-line no-console -- TODO(FEINF-3587)
  console.error(error, message);
  // returning false allows the default handler to fire as well
  return false;
};

window.onerror = windowOnError;
```

--------------------------------------------------------------------------------

---[FILE: MlflowRouter.tsx]---
Location: mlflow-master/mlflow/server/js/src/MlflowRouter.tsx
Signals: React

```typescript
import React, { useEffect, useMemo, useState } from 'react';
import { LegacySkeleton, useDesignSystemTheme } from '@databricks/design-system';

import ErrorModal from './experiment-tracking/components/modals/ErrorModal';
import AppErrorBoundary from './common/components/error-boundaries/AppErrorBoundary';
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  createLazyRouteElement,
  useParams,
} from './common/utils/RoutingUtils';
import { MlflowHeader } from './common/components/MlflowHeader';
import { useDarkThemeContext } from './common/contexts/DarkThemeContext';

// Route definition imports:
import { getRouteDefs as getExperimentTrackingRouteDefs } from './experiment-tracking/route-defs';
import { getRouteDefs as getModelRegistryRouteDefs } from './model-registry/route-defs';
import { getRouteDefs as getCommonRouteDefs } from './common/route-defs';
import { getGatewayRouteDefs } from './gateway/route-defs';
import { useInitializeExperimentRunColors } from './experiment-tracking/components/experiment-page/hooks/useExperimentRunColor';
import { MlflowSidebar } from './common/components/MlflowSidebar';

/**
 * This is the MLflow default entry/landing route.
 */
const landingRoute = {
  path: '/',
  element: createLazyRouteElement(() => import('./experiment-tracking/components/HomePage')),
  pageId: 'mlflow.experiments.list',
};

/**
 * This is root element for MLflow routes, containing app header.
 */
const MlflowRootRoute = () => {
  useInitializeExperimentRunColors();

  const [showSidebar, setShowSidebar] = useState(true);
  const { theme } = useDesignSystemTheme();
  const { experimentId } = useParams();
  const { setIsDarkTheme } = useDarkThemeContext();
  const isDarkTheme = theme.isDarkMode;

  // Hide sidebar if we are in a single experiment page
  const isSingleExperimentPage = Boolean(experimentId);
  useEffect(() => {
    setShowSidebar(!isSingleExperimentPage);
  }, [isSingleExperimentPage]);

  return (
    <div css={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ErrorModal />
      <AppErrorBoundary>
        <MlflowHeader
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          sidebarOpen={showSidebar}
          toggleSidebar={() => setShowSidebar((isOpen) => !isOpen)}
        />
        <div
          css={{
            backgroundColor: theme.colors.backgroundSecondary,
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {showSidebar && <MlflowSidebar />}
          <main
            css={{
              width: '100%',
              backgroundColor: theme.colors.backgroundPrimary,
              margin: theme.spacing.sm,
              borderRadius: theme.borders.borderRadiusMd,
              boxShadow: theme.shadows.md,
              overflowX: 'auto',
            }}
          >
            <React.Suspense fallback={<LegacySkeleton />}>
              <Outlet />
            </React.Suspense>
          </main>
        </div>
      </AppErrorBoundary>
    </div>
  );
};
export const MlflowRouter = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routes = useMemo(
    () => [
      ...getExperimentTrackingRouteDefs(),
      ...getModelRegistryRouteDefs(),
      ...getGatewayRouteDefs(),
      landingRoute,
      ...getCommonRouteDefs(),
    ],
    [],
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hashRouter = useMemo(
    () =>
      createHashRouter([
        {
          path: '/',
          element: <MlflowRootRoute />,
          children: routes,
        },
      ]),
    [routes],
  );

  return (
    <React.Suspense fallback={<LegacySkeleton />}>
      <RouterProvider router={hashRouter} />
    </React.Suspense>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: redux-types.ts]---
Location: mlflow-master/mlflow/server/js/src/redux-types.ts
Signals: Redux/RTK

```typescript
import type { ExperimentStoreEntities } from './experiment-tracking/types';
import type { ModelGatewayReduxState } from './experiment-tracking/reducers/ModelGatewayReducer';
import type { EvaluationDataReduxState } from './experiment-tracking/reducers/EvaluationDataReducer';
import type {
  ApisReducerReduxState,
  ComparedExperimentsReducerReduxState,
  ViewsReducerReduxState,
} from './experiment-tracking/reducers/Reducers';

/**
 * Shape of redux state defined by the combined root reducer
 */
export type ReduxState = {
  entities: ExperimentStoreEntities;
  apis: ApisReducerReduxState;
  views: ViewsReducerReduxState;
  modelGateway: ModelGatewayReduxState;
  evaluationData: EvaluationDataReduxState;
  comparedExperiments: ComparedExperimentsReducerReduxState;
};

// Redux type definitions combining redux-thunk & redux-promise-middleware types
// https://gist.github.com/apieceofbart/8b5ab61f1bed29ef25f3b135818e5448

export type Fulfilled<T extends string> = `${T}_FULFILLED`;
export type Pending<T extends string> = `${T}_PENDING`;
export type Rejected<T extends string> = `${T}_REJECTED`;

type AsyncFunction<R = any> = () => Promise<R>;
type AsyncPayload<R = any> =
  | Promise<R>
  | AsyncFunction<R>
  | {
      promise: Promise<R> | AsyncFunction<R>;
      data?: any;
    };

export interface AsyncAction<R = any, M = any> {
  type: string;
  payload: AsyncPayload<R>;
  meta?: M;
  error?: boolean;
}

type AsyncActionResult<A> = A extends AsyncAction<infer R> ? R : never;

/**
 * Type denoting an action after transforming into result fulfilled shape
 */
export type AsyncFulfilledAction<A extends AsyncAction, Type extends string = Fulfilled<A['type']>> = Omit<
  A,
  'type' | 'payload'
> & {
  type: Type;
  payload: AsyncActionResult<A>;
};

export type AsyncPendingAction<A extends AsyncAction, Type extends string = Pending<A['type']>> = Omit<
  A,
  'type' | 'payload'
> & {
  type: Type;
};

export type AsyncRejectedAction<A extends AsyncAction, Type extends string = Rejected<A['type']>> = Omit<
  A,
  'type' | 'payload'
> & {
  type: Type;
  payload: Error;
};

type FulfilledDispatchResult<A extends AsyncAction> = {
  action: AsyncFulfilledAction<A>;
  value: AsyncActionResult<A>;
};

/**
 * Result type of the async, thunked dispatch
 */
export type AsyncDispatchReturns<T> = T extends AsyncAction ? Promise<FulfilledDispatchResult<T>> : T;

export type ThunkDispatchReturns<S, E, A> = A extends ThunkAction<infer R, S, E> ? R : A;

/**
 * Type of dispatch() compatible with the promise-middleware and redux-thunk
 */
export interface ThunkDispatch<S = ReduxState, E = any> {
  <A>(action: A): AsyncDispatchReturns<ThunkDispatchReturns<S, E, A>>;
}

/**
 * Type of thunked action compatible with the promise-middleware and redux-thunk
 */
export type ThunkAction<R, S, E = null> = (dispatch: ThunkDispatch<S, E>, getState: () => S, extraArgument: E) => R;
```

--------------------------------------------------------------------------------

---[FILE: reset.css]---
Location: mlflow-master/mlflow/server/js/src/reset.css

```text
[class^=ant-]::-ms-clear,
[class*= ant-]::-ms-clear,
[class^=ant-] input::-ms-clear,
[class*= ant-] input::-ms-clear,
[class^=ant-] input::-ms-reveal,
[class*= ant-] input::-ms-reveal {
  display: none;
}
html,
body {
  width: 100%;
  height: 100%;
}
input::-ms-clear,
input::-ms-reveal {
  display: none;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  -ms-overflow-style: scrollbar;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
@-ms-viewport {
  width: device-width;
}
body {
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-variant: tabular-nums;
  line-height: 18px;
  font-weight: 400;
  box-shadow: none;
  background-color: #fff;
  font-feature-settings: 'tnum';
}
[tabindex='-1']:focus {
  outline: none !important;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.5em;
  font-weight: 500;
}
p {
  margin-top: 0;
  margin-bottom: 1em;
}
abbr[title],
abbr[data-original-title] {
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
  border-bottom: 0;
  cursor: help;
}
address {
  margin-bottom: 1em;
  font-style: normal;
  line-height: inherit;
}
input[type='text'],
input[type='password'],
input[type='number'],
textarea {
  -webkit-appearance: none;
}
ol,
ul,
dl {
  margin-top: 0;
  margin-bottom: 1em;
}
ol ol,
ul ul,
ol ul,
ul ol {
  margin-bottom: 0;
}
dt {
  font-weight: 500;
}
dd {
  margin-bottom: 0.5em;
  margin-left: 0;
}
blockquote {
  margin: 0 0 1em;
}
dfn {
  font-style: italic;
}
b,
strong {
  font-weight: bolder;
}
small {
  font-size: 80%;
}
sub,
sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
a {
  color: #1890ff;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  -webkit-text-decoration-skip: objects;
}
a:hover {
  color: #40a9ff;
}
a:active {
  color: #096dd9;
}
a:active,
a:hover {
  text-decoration: none;
  outline: 0;
}
a:focus {
  text-decoration: none;
  outline: 0;
}
a[disabled] {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
pre,
code,
kbd,
samp {
  font-size: 1em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}
pre {
  margin-top: 0;
  margin-bottom: 1em;
  overflow: auto;
}
figure {
  margin: 0 0 1em;
}
img {
  vertical-align: middle;
  border-style: none;
}
svg:not(:root) {
  overflow: hidden;
}
a,
area,
button,
[role='button'],
input:not([type='range']),
label,
select,
summary,
textarea {
  touch-action: manipulation;
}
table {
  border-collapse: collapse;
}
caption {
  padding-top: 0.75em;
  padding-bottom: 0.3em;
  color: rgba(0, 0, 0, 0.45);
  text-align: left;
  caption-side: bottom;
}
input,
button,
select,
optgroup,
textarea {
  margin: 0;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}
button,
html [type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}
button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  padding: 0;
  border-style: none;
}
input[type='radio'],
input[type='checkbox'] {
  box-sizing: border-box;
  padding: 0;
}
input[type='date'],
input[type='time'],
input[type='datetime-local'],
input[type='month'] {
  -webkit-appearance: listbox;
}
textarea {
  overflow: auto;
  resize: vertical;
}
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
legend {
  display: block;
  width: 100%;
  max-width: 100%;
  margin-bottom: 0.5em;
  padding: 0;
  color: inherit;
  font-size: 1.5em;
  line-height: inherit;
  white-space: normal;
}
progress {
  vertical-align: baseline;
}
[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}
[type='search'] {
  outline-offset: -2px;
  -webkit-appearance: none;
}
[type='search']::-webkit-search-cancel-button,
[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}
output {
  display: inline-block;
}
summary {
  display: list-item;
}
template {
  display: none;
}
[hidden] {
  display: none !important;
}
mark {
  padding: 0.2em;
  background-color: #feffe6;
}
::-moz-selection {
  color: #fff;
  background: #1890ff;
}
::selection {
  color: #fff;
  background: #1890ff;
}
.clearfix::before {
  display: table;
  content: '';
}
.clearfix::after {
  display: table;
  clear: both;
  content: '';
}
```

--------------------------------------------------------------------------------

---[FILE: setupProxy.js]---
Location: mlflow-master/mlflow/server/js/src/setupProxy.js

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line
module.exports = function (app) {
  // The MLflow Gunicorn server is running on port 5000, so we should redirect server requests
  // (eg /ajax-api) to that port.
  // Exception: If the caller has specified an MLFLOW_PROXY, we instead forward server requests
  // there.
  // eslint-disable-next-line no-undef
  const proxyTarget = process.env.MLFLOW_PROXY || 'http://localhost:5000/';
  // eslint-disable-next-line no-undef
  const proxyStaticTarget = process.env.MLFLOW_STATIC_PROXY || proxyTarget;
  app.use(
    createProxyMiddleware('/ajax-api', {
      target: proxyTarget,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/graphql', {
      target: proxyTarget,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/get-artifact', {
      target: proxyStaticTarget,
      ws: true,
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/model-versions/get-artifact', {
      target: proxyStaticTarget,
      ws: true,
      changeOrigin: true,
    }),
  );
};
```

--------------------------------------------------------------------------------

---[FILE: setupTests.js]---
Location: mlflow-master/mlflow/server/js/src/setupTests.js

```javascript
/* eslint-disable no-undef -- FEINF-2715 - convert to TS */
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const setupMockFetch = () => {
  // eslint-disable-next-line import/no-extraneous-dependencies, no-unreachable, global-require
  require('whatwg-fetch');
};

setupMockFetch();

configure({ adapter: new Adapter() });
// Included to mock local storage in JS tests, see docs at
// https://www.npmjs.com/package/jest-localstorage-mock#in-create-react-app
require('jest-localstorage-mock');

global.setImmediate = (cb) => {
  return setTimeout(cb, 0);
};
global.clearImmediate = (id) => {
  return clearTimeout(id);
};

// for plotly.js to work
//
window.URL.createObjectURL = function createObjectURL() {};

const testPath = expect.getState().testPath;
if (!testPath?.includes('.enzyme.')) {
  jest.mock('enzyme', () => {
    throw new Error('Enzyme is deprecated. Please use React Testing Library. go/deprecateenzyme');
  });
}

// Mock loadMessages which uses require.context from webpack which is unavailable in node.
jest.mock('./i18n/loadMessages', () => ({
  __esModule: true,
  DEFAULT_LOCALE: 'en',
  loadMessages: async (locale) => {
    if (locale.endsWith('unknown')) {
      return {};
    }
    return {
      // top-locale helps us see which merged message file has top precedence
      'top-locale': locale,
      [locale]: 'value',
    };
  },
}));

// Mock TelemetryClient which uses import.meta.url (not supported in Jest)
jest.mock('./telemetry/TelemetryClient', () => ({
  telemetryClient: {
    logEvent: jest.fn(),
    shutdown: jest.fn(),
    start: jest.fn(),
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock crypto API for tests
global.crypto = {
  randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 15),
};

beforeEach(() => {
  // Prevent unit tests making actual fetch calls,
  // every test should explicitly mock all the API calls for the tested component.
  // Note: this needs to be mocked as a spy instead of a stub; otherwise we can't restore.
  // We need to restore fetch when testing graphql, otherwise Apollo throws an error before msw is
  // able to intercept the request.
  // Also note: jsdom does not have a global fetch, so we need to manually add a stub first.
  if (global.fetch === undefined) {
    global.fetch = () => {};
  }

  jest.spyOn(global, 'fetch').mockImplementation(() => {
    throw new Error('No API calls should be made from unit tests. Please explicitly mock all API calls.');
  });

  global.PerformanceObserver = class PerformanceObserver {
    callback;

    observe() {
      return null;
    }

    disconnect() {
      return null;
    }

    constructor(callback) {
      this.callback = callback;
    }
  };
});
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: mlflow-master/mlflow/server/js/src/store.ts
Signals: Redux/RTK

```typescript
/**
 * NOTE: this code file was automatically migrated to TypeScript using ts-migrate and
 * may contain multiple `any` type annotations and `@ts-expect-error` directives.
 * If possible, please improve types while making changes to this file. If the type
 * annotations are already looking good, please remove this comment.
 */

import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import { rootReducer } from './experiment-tracking/reducers/Reducers';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(thunk, promiseMiddleware())));

export default store;
```

--------------------------------------------------------------------------------

---[FILE: timezone.test.ts]---
Location: mlflow-master/mlflow/server/js/src/timezone.test.ts

```typescript
import { test, expect } from '@jest/globals';

test('timezone is GMT', () => {
  const d = new Date();
  expect(d.getTimezoneOffset()).toBe(0);
});
```

--------------------------------------------------------------------------------

---[FILE: color-palette.ts]---
Location: mlflow-master/mlflow/server/js/src/common/color-palette.ts

```typescript
// Excerpt from the color palette used in MLflow UI, intended to be used in the MLflow experiment runs.
// The color values are copied instead of used from theme directly.
export const RUNS_COLOR_PALETTE = [
  // Secondary colors:
  '#a6630c', // Brown
  '#c83243', // Coral
  '#b45091', // Pink
  '#8a63bf', // Purple
  '#434a93', // Indigo
  '#137dae', // Turquoise
  '#04867d', // Teal
  '#308613', // Lime
  '#facb66', // Lemon

  // Colors list, intensities 700-400:
  '#1f272d', // Grey 700
  '#445461', // Grey 600
  '#5f7281', // Grey 500
  '#8396a5', // Grey 400

  '#93320b', // Yellow 700
  '#be501e', // Yellow 600
  '#de7921', // Yellow 500
  '#f2be88', // Yellow 400

  '#115026', // Green 700
  '#277c43', // Green 600
  '#3ba65e', // Green 500
  '#8ddda8', // Green 400

  '#9e102c', // Red 700
  '#c82d4c', // Red 600
  '#e65b77', // Red 500
  '#f792a6', // Red 400

  '#0e538b', // Blue 700
  '#2272b4', // Blue 600
  '#4299e0', // Blue 500
  '#8acaff', // Blue 400
];
```

--------------------------------------------------------------------------------

---[FILE: constants.tsx]---
Location: mlflow-master/mlflow/server/js/src/common/constants.tsx
Signals: React

```typescript
import { FormattedMessage } from 'react-intl';
import React from 'react';

export const ErrorCodes = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_PARAMETER_VALUE: 'INVALID_PARAMETER_VALUE',
  RESOURCE_DOES_NOT_EXIST: 'RESOURCE_DOES_NOT_EXIST',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
};

export const Version = '3.8.1.dev0';

const DOCS_VERSION = 'latest';

const DOCS_ROOT = `https://www.mlflow.org/docs/${DOCS_VERSION}`;

export const HomePageDocsUrl = `${DOCS_ROOT}/index.html`;

export const ModelRegistryDocUrl = `${DOCS_ROOT}/model-registry.html`;

export const ModelRegistryOnboardingString = (
  <FormattedMessage
    defaultMessage="Share and manage machine learning models."
    description="Default text for model registry onboarding on the model list page"
  />
);

export const RegisteringModelDocUrl = DOCS_ROOT + '/model-registry.html#adding-an-mlflow-model-to-the-model-registry';

export const ExperimentRunSearchSyntaxDocUrl = `${DOCS_ROOT}/search-runs.html`;

export const PyfuncDocUrl = `${DOCS_ROOT}/python_api/mlflow.pyfunc.html`;
export const CustomPyfuncModelsDocUrl = DOCS_ROOT + '/python_api/mlflow.pyfunc.html#creating-custom-pyfunc-models';

export const LoggingRunsDocUrl = `${DOCS_ROOT}/tracking.html#logging-data-to-runs`;

export const onboarding = 'onboarding';

export const SupportPageUrl = 'https://github.com/mlflow/mlflow/issues/new?template=ui_bug_report_template.yaml';

export const ModelSignatureUrl = `${DOCS_ROOT}/models.html#model-signature`;

export const LogModelWithSignatureUrl = DOCS_ROOT + '/models.html#how-to-log-models-with-signatures';

export const modelStagesMigrationGuideLink = `${DOCS_ROOT}/model-registry.html#migrating-from-stages`;
```

--------------------------------------------------------------------------------

---[FILE: mlflow-published-version.ts]---
Location: mlflow-master/mlflow/server/js/src/common/mlflow-published-version.ts

```typescript
/**
 * This is currently published MLflow version that should be available in PyPi
 * TODO(ML-33049): Implement a mechanism to bump this version automatically when MLflow is released.
 */
export const MLFLOW_PUBLISHED_VERSION = /* BEGIN-MLFLOW-VERSION */ '2.7.1'; /* END-MLFLOW-VERSION */
```

--------------------------------------------------------------------------------

````

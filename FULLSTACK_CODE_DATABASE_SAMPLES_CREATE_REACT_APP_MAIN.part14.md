---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 14
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 14 of 37)

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

---[FILE: running-tests.md]---
Location: create-react-app-main/docusaurus/docs/running-tests.md

```text
---
id: running-tests
title: Running Tests
---

> Note: this feature is available with `react-scripts@0.3.0` and higher.

> [Read the migration guide to learn how to enable it in older projects!](https://github.com/facebook/create-react-app/blob/main/CHANGELOG-0.x.md#migrating-from-023-to-030)

Create React App uses [Jest](https://jestjs.io/) as its test runner. To prepare for this integration, we did a [major revamp](https://jestjs.io/blog/2016/09/01/jest-15.html) of Jest so if you heard bad things about it years ago, give it another try.

Jest is a Node-based runner. This means that the tests always run in a Node environment and not in a real browser. This lets us enable fast iteration speed and prevent flakiness.

While Jest provides browser globals such as `window` thanks to [jsdom](https://github.com/tmpvar/jsdom), they are only approximations of the real browser behavior. Jest is intended to be used for unit tests of your logic and your components rather than the DOM quirks.

We recommend that you use a separate tool for browser end-to-end tests if you need them. They are beyond the scope of Create React App.

## Filename Conventions

Jest will look for test files with any of the following popular naming conventions:

- Files with `.js` suffix in `__tests__` folders.
- Files with `.test.js` suffix.
- Files with `.spec.js` suffix.

The `.test.js` / `.spec.js` files (or the `__tests__` folders) can be located at any depth under the `src` top level folder.

We recommend to put the test files (or `__tests__` folders) next to the code they are testing so that relative imports appear shorter. For example, if `App.test.js` and `App.js` are in the same folder, the test only needs to `import App from './App'` instead of a long relative path. Collocation also helps find tests more quickly in larger projects.

## Command Line Interface

When you run `npm test`, Jest will launch in watch mode<sup>\*</sup>. Every time you save a file, it will re-run the tests, like how `npm start` recompiles the code.

The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs. You can learn the commands from the “Watch Usage” note that the watcher prints after every run:

![Jest watch mode](https://jestjs.io/img/blog/15-watch.gif)

> \*Although we recommend running your tests in watch mode during development, you can disable this behavior by passing in the `--watchAll=false` flag. In most CI environments, this is handled for you (see [On CI servers](#on-ci-servers)).

## Version Control Integration

By default, when you run `npm test`, Jest will only run the tests related to files changed since the last commit. This is an optimization designed to make your tests run fast regardless of how many tests you have. However it assumes that you don’t often commit the code that doesn’t pass the tests.

Jest will always explicitly mention that it only ran tests related to the files changed since the last commit. You can also press `a` in the watch mode to force Jest to run all tests.

Jest will always run all tests on a [continuous integration](#continuous-integration) server or if the project is not inside a Git or Mercurial repository.

## Writing Tests

To create tests, add `it()` (or `test()`) blocks with the name of the test and its code. You may optionally wrap them in `describe()` blocks for logical grouping but this is neither required nor recommended.

Jest provides a built-in `expect()` global function for making assertions. A basic test could look like this:

```js
import sum from './sum';

it('sums numbers', () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});
```

All `expect()` matchers supported by Jest are [extensively documented here](https://jestjs.io/docs/expect).

You can also use [`jest.fn()` and `expect(fn).toBeCalled()`](https://jestjs.io/docs/expect#tohavebeencalled) to create “spies” or mock functions.

## Testing Components

There is a broad spectrum of component testing techniques. They range from a “smoke test” verifying that a component renders without throwing, to shallow rendering and testing some of the output, to full rendering and testing component lifecycle and state changes.

Different projects choose different testing tradeoffs based on how often components change, and how much logic they contain. If you haven’t decided on a testing strategy yet, we recommend that you start with creating basic smoke tests for your components:

```js
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOMClient.createRoot(div).render(<App />);
});
```

This test mounts a component and makes sure that it didn’t throw during rendering. Tests like this provide a lot of value with very little effort so they are great as a starting point, and this is the test you will find in `src/App.test.js`.

When you encounter bugs caused by changing components, you will gain a deeper insight into which parts of them are worth testing in your application. This might be a good time to introduce more specific tests asserting specific expected output or behavior.

### React Testing Library

If you’d like to test components in isolation from the child components they render, we recommend using `react-testing-library`. [`react-testing-library`](https://github.com/testing-library/react-testing-library) is a library for testing React components in a way that resembles the way the components are used by end users. It is well suited for unit, integration, and end-to-end testing of React components and applications. It works more directly with DOM nodes, and therefore it's recommended to use with [`jest-dom`](https://github.com/testing-library/jest-dom) for improved assertions.

To install `react-testing-library` and `jest-dom`, you can run:

```sh
npm install --save @testing-library/react @testing-library/dom @testing-library/jest-dom
```

Alternatively you may use `yarn`:

```sh
yarn add @testing-library/react @testing-library/dom @testing-library/jest-dom
```

If you want to avoid boilerplate in your test files, you can create a [`src/setupTests.js`](#initializing-test-environment) file:

```js
// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
```

Here's an example of using `react-testing-library` and `jest-dom` for testing that the `<App />` component renders "Learn React".

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

it('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText('Learn React')).toBeInTheDocument();
});
```

Learn more about the utilities provided by `react-testing-library` to facilitate testing asynchronous interactions as well as selecting form elements from the [`react-testing-library` documentation](https://testing-library.com/react) and [examples](https://codesandbox.io/s/github/kentcdodds/react-testing-library-examples).

## Using Third Party Assertion Libraries

We recommend that you use `expect()` for assertions and `jest.fn()` for spies. If you are having issues with them please [file those against Jest](https://github.com/facebook/jest/issues/new), and we’ll fix them. We intend to keep making them better for React, supporting, for example, [pretty-printing React elements as JSX](https://github.com/facebook/jest/pull/1566).

However, if you are used to other libraries, such as [Chai](https://www.chaijs.com/) and [Sinon](https://sinonjs.org/), or if you have existing code using them that you’d like to port over, you can import them normally like this:

```js
import sinon from 'sinon';
import { expect } from 'chai';
```

and then use them in your tests like you normally do.

## Initializing Test Environment

> Note: this feature is available with `react-scripts@0.4.0` and higher.

If your app uses a browser API that you need to mock in your tests or if you need a global setup before running your tests, add a `src/setupTests.js` to your project. It will be automatically executed before running your tests.

For example:

### `src/setupTests.js`

```js
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

> Note: Keep in mind that if you decide to "eject" before creating `src/setupTests.js`, the resulting `package.json` file won't contain any reference to it, so you should manually create the property `setupFilesAfterEnv` in the configuration for Jest, something like the following:

> ```js
> "jest": {
>   // ...
>   "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
>  }
> ```

## Focusing and Excluding Tests

You can replace `it()` with `xit()` to temporarily exclude a test from being executed.

Similarly, `fit()` lets you focus on a specific test without running any other tests.

## Coverage Reporting

Jest has an integrated coverage reporter that works well with ES6 and requires no configuration.

Run `npm test -- --coverage` (note extra `--` in the middle) to include a coverage report like this:

![coverage report](https://i.imgur.com/5bFhnTS.png)

Note that tests run much slower with coverage so it is recommended to run it separately from your normal workflow.

### Configuration

The [default configuration](https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/utils/createJestConfig.js) that Create React App uses for Jest can be overridden by adding any of the following supported keys to a Jest config in your package.json.

Supported overrides:

- [`clearMocks`](https://jestjs.io/docs/configuration#clearmocks-boolean)
- [`collectCoverageFrom`](https://jestjs.io/docs/configuration#collectcoveragefrom-array)
- [`coveragePathIgnorePatterns`](https://jestjs.io/docs/configuration#coveragepathignorepatterns-arraystring)
- [`coverageReporters`](https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options)
- [`coverageThreshold`](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [`displayName`](https://jestjs.io/docs/configuration#displayname-string-object)
- [`extraGlobals`](https://jestjs.io/docs/configuration#extraglobals-arraystring)
- [`globalSetup`](https://jestjs.io/docs/configuration#globalsetup-string)
- [`globalTeardown`](https://jestjs.io/docs/configuration#globalteardown-string)
- [`moduleNameMapper`](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring)
- [`resetMocks`](https://jestjs.io/docs/configuration#resetmocks-boolean)
- [`resetModules`](https://jestjs.io/docs/configuration#resetmodules-boolean)
- [`restoreMocks`](https://jestjs.io/docs/configuration#restoremocks-boolean)
- [`snapshotSerializers`](https://jestjs.io/docs/configuration#snapshotserializers-arraystring)
- [`testMatch`](https://jestjs.io/docs/configuration#testmatch-arraystring)
- [`transform`](https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object)
- [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)
- [`watchPathIgnorePatterns`](https://jestjs.io/docs/configuration#watchpathignorepatterns-arraystring)

Example package.json:

```json
{
  "name": "your-package",
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!<rootDir>/node_modules/",
      "!<rootDir>/path/to/dir/"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    },
    "coverageReporters": ["text"],
    "snapshotSerializers": ["my-serializer-module"]
  }
}
```

## Continuous Integration

By default `npm test` runs the watcher with interactive CLI. However, you can force it to run tests once and finish the process by setting an environment variable called `CI`.

When creating a build of your application with `npm run build` linter warnings are not checked by default. Like `npm test`, you can force the build to perform a linter warning check by setting the environment variable `CI`. If any warnings are encountered then the build fails.

Popular CI servers already set the environment variable `CI` by default but you can do this yourself too:

## On CI servers

### Travis CI

1. Following the [Travis Getting started](https://docs.travis-ci.com/user/getting-started/) guide for syncing your GitHub repository with Travis. You may need to initialize some settings manually in your [profile](https://travis-ci.org/profile) page.
2. Add a `.travis.yml` file to your git repository.

```yaml
language: node_js
node_js:
  - 8
cache:
  directories:
    - node_modules
script:
  - npm run build
  - npm test
```

3. Trigger your first build with a git push.
4. [Customize your Travis CI Build](https://docs.travis-ci.com/user/customizing-the-build/) if needed.

### CircleCI

Follow [this article](https://medium.com/@knowbody/circleci-and-zeits-now-sh-c9b7eebcd3c1) to set up CircleCI with a Create React App project.

## On your own environment

#### Windows (cmd.exe)

```cmd
set CI=true&&npm test
```

```cmd
set CI=true&&npm run build
```

(Note: the lack of whitespace is intentional.)

#### Windows (Powershell)

```Powershell
($env:CI = "true") -and (npm test)
```

```Powershell
($env:CI = "true") -and (npm run build)
```

#### Linux, macOS (Bash)

```sh
CI=true npm test
```

```sh
CI=true npm run build
```

The test command will force Jest to run in CI-mode, and tests will only run once instead of launching the watcher.

For non-CI environments, you can pass the `--watchAll=false` flag to disable test-watching.

The build command will check for linter warnings and fail if any are found.

## Disabling jsdom

If you know that none of your tests depend on [jsdom](https://github.com/tmpvar/jsdom), you can safely set `--env=node`, and your tests will run faster:

```diff
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
-   "test": "react-scripts test"
+   "test": "react-scripts test --env=node"
```

To help you make up your mind, here is a list of APIs that **need jsdom**:

- Any browser globals like `window` and `document`
- [`ReactDOM.render()`](https://facebook.github.io/react/docs/top-level-api.html#reactdom.render)
- [`TestUtils.renderIntoDocument()`](https://facebook.github.io/react/docs/test-utils.html#renderintodocument) ([a shortcut](https://github.com/facebook/react/blob/34761cf9a252964abfaab6faf74d473ad95d1f21/src/test/ReactTestUtils.js#L83-L91) for the above)
- [`mount()`](https://airbnb.io/enzyme/docs/api/mount.html) in [Enzyme](https://airbnb.io/enzyme/index.html)
- [`render()`](https://testing-library.com/docs/react-testing-library/api/#render) in [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

In contrast, **jsdom is not needed** for the following APIs:

- [`TestUtils.createRenderer()`](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering) (shallow rendering)
- [`shallow()`](https://airbnb.io/enzyme/docs/api/shallow.html) in [Enzyme](https://airbnb.io/enzyme/index.html)

Finally, jsdom is also not needed for [snapshot testing](https://jestjs.io/blog/2016/07/27/jest-14.html).

## Snapshot Testing

Snapshot testing is a feature of Jest that automatically generates text snapshots of your components and saves them on the disk so if the UI output changes, you get notified without manually writing any assertions on the component output. [Read more about snapshot testing.](https://jestjs.io/blog/2016/07/27/jest-14.html)

## Editor Integration

If you use [Visual Studio Code](https://code.visualstudio.com), there is a [Jest extension](https://github.com/orta/vscode-jest) which works with Create React App out of the box. This provides a lot of IDE-like features while using a text editor: showing the status of a test run with potential fail messages inline, starting and stopping the watcher automatically, and offering one-click snapshot updates.

![VS Code Jest Preview](https://cloud.githubusercontent.com/assets/49038/20795349/a032308a-b7c8-11e6-9b34-7eeac781003f.png)
```

--------------------------------------------------------------------------------

---[FILE: setting-up-your-editor.md]---
Location: create-react-app-main/docusaurus/docs/setting-up-your-editor.md

```text
---
id: setting-up-your-editor
title: Setting Up Your Editor
sidebar_label: Editor Setup
---

Create React App comes with a bunch of tools that improve the editing experience - if configured correctly. Here's a few tips to maximize your productivity:

## Syntax highlighting

To configure the syntax highlighting in your favorite text editor, head to the [relevant Babel documentation page](https://babeljs.io/docs/editors) and follow the instructions. Some of the most popular editors are covered.

## Displaying Lint Output in the Editor

> Note: this feature is available with `react-scripts@0.2.0` and higher.

> It works out of the box for newly created projects with `react-scripts@2.0.3` and higher.

> It also only works with npm 3 or higher.

Some editors, including Sublime Text, Atom, and Visual Studio Code, provide plugins for ESLint.

They are not required for linting. You should see the linter output right in your terminal as well as the browser console. If you prefer the lint results to appear right in your editor, please make sure you install an ESLint plugin/extension.

Note that even if you customise your ESLint config, these changes will **only affect the editor integration**. They won’t affect the terminal and in-browser lint output. This is because Create React App intentionally provides a minimal set of rules that find common mistakes.

If you want to enforce a coding style for your project, consider using [Prettier](https://github.com/jlongster/prettier) instead of ESLint style rules.

### Extending or replacing the default ESLint config

You can extend our base ESLint config, or replace it completely if you need.

There are a few things to remember:

1. We highly recommend extending the base config, as removing it could introduce hard-to-find issues.
1. When working with TypeScript, you'll need to provide an `overrides` object for rules that should _only_ target TypeScript files.
1. It's important to note that any rules that are set to `"error"` will stop the project from building.

In the below example:

- the base config has been extended by a shared ESLint config,
- a new rule has been set that applies to all JavaScript and TypeScript files, and
- a new rule has been set that only targets TypeScript files.

```json
{
  "eslintConfig": {
    "extends": ["react-app", "shared-config"],
    "rules": {
      "additional-rule": "warn"
    },
    "overrides": [
      {
        "files": ["**/*.ts?(x)"],
        "rules": {
          "additional-typescript-only-rule": "warn"
        }
      }
    ]
  }
}
```

## Debugging in the Editor

**This feature is currently only supported by [Visual Studio Code](https://code.visualstudio.com) and [WebStorm](https://www.jetbrains.com/webstorm/).**

Visual Studio Code and WebStorm support debugging out of the box with Create React App. This enables you as a developer to write and debug your React code without leaving the editor, and most importantly it enables you to have a continuous development workflow, where context switching is minimal, as you don’t have to switch between tools.

### Visual Studio Code

You need to have the latest version of [VS Code](https://code.visualstudio.com) installed.

Then add the block below to your `launch.json` file and put it inside the `.vscode` folder in your app’s root directory.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}
```

> Note: the URL may be different if you've made adjustments via the [HOST or PORT environment variables](advanced-configuration.md).

Start your app by running `npm start`, and start debugging in VS Code by pressing `F5` or by clicking the green debug icon. You can now write code, set breakpoints, make changes to the code, and debug your newly modified code—all from your editor.

Having problems with VS Code Debugging? Please see their [troubleshooting guide](https://github.com/Microsoft/vscode-chrome-debug/blob/master/README.md#troubleshooting).

### WebStorm

You need to have [WebStorm](https://www.jetbrains.com/webstorm/) and [JetBrains IDE Support](https://chrome.google.com/webstore/detail/jetbrains-ide-support/hmhgeddbohgjknpmjagkdomcpobmllji) Chrome extension installed.

In the WebStorm menu `Run` select `Edit Configurations...`. Then click `+` and select `JavaScript Debug`. Paste `http://localhost:3000` into the URL field and save the configuration.

> Note: the URL may be different if you've made adjustments via the [HOST or PORT environment variables](advanced-configuration.md).

Start your app by running `npm start`, then press `^D` on macOS or `F9` on Windows and Linux or click the green debug icon to start debugging in WebStorm.

The same way you can debug your application in IntelliJ IDEA Ultimate, PhpStorm, PyCharm Pro, and RubyMine.

## Formatting Code Automatically

Prettier is an opinionated code formatter with support for JavaScript, CSS and JSON. With Prettier you can format the code you write automatically to ensure a code style within your project. See [Prettier's GitHub page](https://github.com/prettier/prettier) for more information, and look at this [page to see it in action](https://prettier.io/playground/).

To format our code whenever we make a commit in git, we need to install the following dependencies:

```sh
npm install --save husky lint-staged prettier
```

Alternatively you may use `yarn`:

```sh
yarn add husky lint-staged prettier
```

- `husky` makes it possible to use githooks as if they are npm scripts.
- `lint-staged` allows us to run scripts on staged files in git. See this [blog post about lint-staged to learn more about it](https://medium.com/@okonetchnikov/make-linting-great-again-f3890e1ad6b8).
- `prettier` is the JavaScript formatter we will run before commits.

Now we can make sure every file is formatted correctly by adding a few lines to the `package.json` in the project root.

Add the following field to the `package.json` section:

```diff
+  "husky": {
+    "hooks": {
+      "pre-commit": "lint-staged"
+    }
+  }
```

Next we add a 'lint-staged' field to the `package.json`, for example:

```diff
  "dependencies": {
    // ...
  },
+ "lint-staged": {
+   "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
+     "prettier --write"
+   ]
+ },
  "scripts": {
```

Now, whenever you make a commit, Prettier will format the changed files automatically. You can also run `./node_modules/.bin/prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"` to format your entire project for the first time.

Next you might want to integrate Prettier in your favorite editor. Read the section on [Editor Integration](https://prettier.io/docs/en/editors.html) on the Prettier GitHub page.
```

--------------------------------------------------------------------------------

---[FILE: supported-browsers-features.md]---
Location: create-react-app-main/docusaurus/docs/supported-browsers-features.md

```text
---
id: supported-browsers-features
title: Supported Browsers and Features
sidebar_label: Supported Browsers and Features
---

## Supported Browsers

By default, the generated project supports all modern browsers. Support for Internet Explorer 9, 10, and 11 requires polyfills. For a set of polyfills to support older browsers, use [react-app-polyfill](https://github.com/facebook/create-react-app/blob/main/packages/react-app-polyfill/README.md).

## Supported Language Features

This project supports a superset of the latest JavaScript standard. In addition to [ES6](https://github.com/lukehoban/es6features) syntax features, it also supports:

- [Exponentiation Operator](https://github.com/rwaldron/exponentiation-operator) (ES2016).
- [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017).
- [Object Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread) (ES2018).
- [Dynamic import()](https://github.com/tc39/proposal-dynamic-import) (stage 4 proposal)
- [Class Fields and Static Properties](https://github.com/tc39/proposal-class-public-fields) (part of stage 3 proposal).
- [JSX](https://facebook.github.io/react/docs/introducing-jsx.html), [Flow](./adding-flow) and [TypeScript](./adding-typescript).

Learn more about [different proposal stages](https://tc39.github.io/process-document/).

While we recommend using experimental proposals with some caution, Facebook heavily uses these features in the product code, so we intend to provide [codemods](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) if any of these proposals change in the future.

Note that **this project includes no [polyfills](https://github.com/facebook/create-react-app/blob/main/packages/react-app-polyfill/README.md)** by default.

If you use any other ES6+ features that need **runtime support** (such as `Array.from()` or `Symbol`), make sure you are [including the appropriate polyfills manually](https://github.com/facebook/create-react-app/blob/main/packages/react-app-polyfill/README.md), or that the browsers you are targeting already support them.

## Configuring Supported Browsers

By default, the generated project includes a [`browserslist`](https://github.com/browserslist/browserslist) configuration in your `package.json` file to target a broad range of browsers based on global usage (`> 0.2%`) for production builds, and modern browsers for development. This gives a good development experience, especially when using language features such as async/await, but still provides high compatibility with many browsers in production.

The `browserslist` configuration controls the outputted JavaScript so that the emitted code will be compatible with the browsers specified. The `production` list will be used when creating a production build by running the `build` script, and the `development` list will be used when running the `start` script. You can use [https://browserl.ist](https://browserl.ist/?q=%3E+0.2%25%2C+not+dead%2C+not+op_mini+all) to see the browsers supported by your configured `browserslist`.

Here is an example `browserslist` that is specified in `package.json`:

```json
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
```

> Note that this does not include polyfills automatically for you. You will still need to polyfill language features (see above) as needed based on the browsers you are supporting.

> When editing the `browserslist` config, you may notice that your changes don't get picked up right away. This is due to an [issue in babel-loader](https://github.com/babel/babel-loader/issues/690) not detecting the change in your `package.json`. A quick solution is to delete the `node_modules/.cache` folder and try again.
```

--------------------------------------------------------------------------------

---[FILE: title-and-meta-tags.md]---
Location: create-react-app-main/docusaurus/docs/title-and-meta-tags.md

```text
---
id: title-and-meta-tags
title: Title and Meta Tags
sidebar_label: Title & Meta Tags
---

## Changing the title tag

You can find the source HTML file in the `public` folder of the generated project. You may edit the `<title>` tag in it to change the title from “React App” to anything else.

Note that normally you wouldn’t edit files in the `public` folder very often. For example, [adding a stylesheet](adding-a-stylesheet.md) is done without touching the HTML.

If you need to dynamically update the page title based on the content, you can use the browser [`document.title`](https://developer.mozilla.org/en-US/docs/Web/API/Document/title) API. For more complex scenarios when you want to change the title from React components, you can use [React Helmet](https://github.com/nfl/react-helmet), a third party library.

If you use a custom server for your app in production and want to modify the title before it gets sent to the browser, you can follow advice in [this section](#generating-dynamic-meta-tags-on-the-server). Alternatively, you can pre-build each page as a static HTML file which then loads the JavaScript bundle, which is covered [here](pre-rendering-into-static-html-files.md).

## Generating Dynamic `<meta>` Tags on the Server

Since Create React App doesn’t support server rendering, you might be wondering how to make `<meta>` tags dynamic and reflect the current URL. To solve this, we recommend to add placeholders into the HTML, like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta property="og:title" content="__OG_TITLE__" />
    <meta property="og:description" content="__OG_DESCRIPTION__" />
  </head>
</html>
```

Then, on the server, regardless of the backend you use, you can read `index.html` into memory and replace `__OG_TITLE__`, `__OG_DESCRIPTION__`, and any other placeholders with values depending on the current URL. Make sure to sanitize and escape the interpolated values so that they are safe to embed into HTML!

If you use a Node server, you can even share the route matching logic between the client and the server. However duplicating it also works fine in basic cases.

## Injecting Data from the Server into the Page

Similarly to the previous section, you can leave some placeholders in the HTML that inject global variables, for example:

```js
<!doctype html>
<html lang="en">
  <head>
    <script>
      window.SERVER_DATA = __SERVER_DATA__;
    </script>
```

Then, on the server, you can replace `__SERVER_DATA__` with a JSON of real data right before sending the response. The client code can then read `window.SERVER_DATA` to use it. **Make sure to [sanitize the JSON before sending it to the client](https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0) as it makes your app vulnerable to XSS attacks.**
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.md]---
Location: create-react-app-main/docusaurus/docs/troubleshooting.md

```text
---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

## `npm start` doesn’t detect changes

When you save a file while `npm start` is running, the browser should refresh with the updated code.

If this doesn’t happen, try one of the following workarounds:

- Check that your file is imported by your entrypoint. TypeScript will show errors on any of your source files, but webpack only reloads your files if they are directly or indirectly imported by one of your entrypoints.
- If your project is in a Dropbox folder, try moving it out.
- If the watcher doesn’t see a file called `index.js` and you’re referencing it by the folder name, you [need to restart the watcher](https://github.com/facebook/create-react-app/issues/1164) due to a webpack bug.
- Some editors like Vim and IntelliJ have a “safe write” feature that currently breaks the watcher. You will need to disable it. Follow the instructions in [“Adjusting Your Text Editor”](https://webpack.js.org/guides/development/#adjusting-your-text-editor).
- If your project path contains parentheses, try moving the project to a path without them. This is caused by a [webpack watcher bug](https://github.com/webpack/watchpack/issues/42).
- On Linux and macOS, you might need to [tweak system settings](https://github.com/webpack/docs/wiki/troubleshooting#not-enough-watchers) to allow more watchers.
- If the project runs inside a virtual machine such as (a Vagrant provisioned) VirtualBox, create an `.env` file in your project directory if it doesn’t exist, and add `CHOKIDAR_USEPOLLING=true` to it. This ensures that the next time you run `npm start`, the watcher uses the polling mode, as necessary inside a VM.

If none of these solutions help please leave a comment [in this thread](https://github.com/facebook/create-react-app/issues/659).

## `npm start` fail due to watch error

If you are using a Linux operating system and see an error similar to: `ENOSPC: System limit for number of file watchers reached`, you can fix the issue by increasing the `fs.inotify.max_user_watches` setting of your operating system.

If you are running Debian, RedHat, or another similar Linux distribution, run the following in a terminal:

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

If you are running ArchLinux, run the following command instead:

```sh
echo fs.inotify.max_user_watches=524288 | sudo tee /etc/sysctl.d/40-max-user-watches.conf && sudo sysctl --system
```

Then paste it in your terminal and press on enter to run it. You could find more information [here](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers#the-technical-details).

## `npm test` hangs or crashes on macOS Sierra

If you run `npm test` and the console gets stuck after printing `react-scripts test` to the console there might be a problem with your [Watchman](https://facebook.github.io/watchman/) installation as described in [facebook/create-react-app#713](https://github.com/facebook/create-react-app/issues/713).

We recommend deleting `node_modules` in your project and running `npm install` (or `yarn` if you use it) first. If it doesn't help, you can try one of the numerous workarounds mentioned in these issues:

- [facebook/jest#1767](https://github.com/facebook/jest/issues/1767)
- [facebook/watchman#358](https://github.com/facebook/watchman/issues/358)
- [ember-cli/ember-cli#6259](https://github.com/ember-cli/ember-cli/issues/6259)

It is reported that installing Watchman 4.7.0 or newer fixes the issue. If you use [Homebrew](https://brew.sh/), you can run these commands to update it:

```
watchman shutdown-server
brew update
brew reinstall watchman
```

You can find [other installation methods](https://facebook.github.io/watchman/docs/install.html#build-install) on the Watchman documentation page.

If this still doesn’t help, try running `launchctl unload -F ~/Library/LaunchAgents/com.github.facebook.watchman.plist`.

There are also reports that _uninstalling_ Watchman fixes the issue. So if nothing else helps, remove it from your system and try again.

## `npm run build` exits too early

It is reported that `npm run build` can fail on machines with limited memory and no swap space, which is common in cloud environments. Even with small projects this command can increase RAM usage in your system by hundreds of megabytes, so if you have less than 1 GB of available memory your build is likely to fail with the following message:

> The build failed because the process exited too early. This probably means the system ran out of memory or someone called `kill -9` on the process.

If you are completely sure that you didn't terminate the process, consider [adding some swap space](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04) to the machine you’re building on, or build the project locally.

## `npm run build` fails on Heroku

This may be a problem with case sensitive filenames.
Please refer to [this section](deployment.md#resolving-heroku-deployment-errors).

## Moment.js locales are missing

If you use a [Moment.js](https://momentjs.com/), you might notice that only the English locale is available by default. This is because the locale files are large, and you probably only need a subset of [all the locales provided by Moment.js](https://momentjs.com/#multiple-locale-support).

To add a specific Moment.js locale to your bundle, you need to import it explicitly.

For example:

```js
import moment from 'moment';
import 'moment/locale/fr';
```

If you are importing multiple locales this way, you can later switch between them by calling `moment.locale()` with the locale name:

```js
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/es';

// ...

moment.locale('fr');
```

This will only work for locales that have been explicitly imported before.

## `npm run build` fails to minify

Before `react-scripts@2.0.0`, this problem was caused by third party `node_modules` using modern JavaScript features because the minifier couldn't handle them during the build. This has been solved by compiling standard modern JavaScript features inside `node_modules` in `react-scripts@2.0.0` and higher.

If you're seeing this error, you're likely using an old version of `react-scripts`. You can either fix it by avoiding a dependency that uses modern syntax, or by upgrading to `react-scripts@>=2.0.0` and following the migration instructions in the changelog.
```

--------------------------------------------------------------------------------

---[FILE: updating-to-new-releases.md]---
Location: create-react-app-main/docusaurus/docs/updating-to-new-releases.md

```text
---
id: updating-to-new-releases
title: Updating to New Releases
---

Create React App is divided into two packages:

- `create-react-app` is a global command-line utility that you use to create new projects.
- `react-scripts` is a development dependency in the generated projects (including this one).

When you run `npx create-react-app my-app` it automatically installs the latest version of Create React App.

> If you've previously installed `create-react-app` globally via `npm install -g create-react-app`, please visit [Getting Started](getting-started.md) to learn about current installation steps.

Create React App creates the project with the latest version of `react-scripts` so you’ll get all the new features and improvements in newly created apps automatically.

To update an existing project to a new version of `react-scripts`, [open the changelog](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md), find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `react-scripts` version in `package.json` and running `npm install` (or `yarn install`) in this folder should be enough, but it’s good to consult the [changelog](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md) for potential breaking changes.

We commit to keeping the breaking changes minimal so you can upgrade `react-scripts` painlessly.
```

--------------------------------------------------------------------------------

---[FILE: using-global-variables.md]---
Location: create-react-app-main/docusaurus/docs/using-global-variables.md

```text
---
id: using-global-variables
title: Using Global Variables
---

When you include a script in the HTML file that defines global variables and try to use one of these variables in the code, the linter will complain because it cannot see the definition of the variable.

You can avoid this by reading the global variable explicitly from the `window` object, for example:

```js
const $ = window.$;
```

This makes it clear you are using a global variable intentionally rather than because of a typo.

Alternatively, you can force the linter to ignore any line by adding `// eslint-disable-line` after it.
```

--------------------------------------------------------------------------------

````

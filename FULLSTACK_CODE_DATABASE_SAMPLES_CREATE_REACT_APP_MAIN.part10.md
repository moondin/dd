---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 10
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 10 of 37)

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

---[FILE: SECURITY.md]---
Location: create-react-app-main/SECURITY.md

```text
# Reporting Security Issues

If you believe you have found a security vulnerability in Create React App, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.

Please refer to the following page for our responsible disclosure policy, reward guidelines, and those things that should not be reported:

https://www.facebook.com/whitehat
```

--------------------------------------------------------------------------------

---[FILE: CODEOWNERS]---
Location: create-react-app-main/.github/CODEOWNERS

```text
packages/ @iansu @mrmckeb
docusaurus/ @iansu @mrmckeb
```

--------------------------------------------------------------------------------

---[FILE: FUNDING.yml]---
Location: create-react-app-main/.github/FUNDING.yml
Signals: React

```yaml
open_collective: create-react-app
```

--------------------------------------------------------------------------------

---[FILE: lock.yml]---
Location: create-react-app-main/.github/lock.yml

```yaml
# Configuration for lock-threads - https://github.com/dessant/lock-threads

# Number of days of inactivity before a closed issue or pull request is locked
daysUntilLock: 5

# Issues and pull requests with these labels will not be locked. Set to `[]` to disable
exemptLabels: []

# Do not comment when locking
setLockReason: false
lockComment: false
```

--------------------------------------------------------------------------------

---[FILE: PULL_REQUEST_TEMPLATE.md]---
Location: create-react-app-main/.github/PULL_REQUEST_TEMPLATE.md

```text
<!--
Thank you for sending the PR!

If you changed any code, please provide us with clear instructions on how you verified your changes work. Bonus points for screenshots!

Happy contributing!
-->
```

--------------------------------------------------------------------------------

---[FILE: stale.yml]---
Location: create-react-app-main/.github/stale.yml

```yaml
# Configuration for probot-stale - https://github.com/probot/stale

# Number of days of inactivity before an Issue or Pull Request becomes stale
daysUntilStale: 30

# Number of days of inactivity before a stale Issue or Pull Request is closed.
# Set to false to disable. If disabled, issues still need to be closed manually, but will remain marked as stale.
daysUntilClose: 5

# Issues or Pull Requests with these labels will never be considered stale. Set to `[]` to disable
exemptLabels:
  - 'contributions: claimed'
  - 'contributions: up for grabs!'
  - 'good first issue'
  - 'issue: announcement'
  - 'issue: bug'
  - 'issue: needs investigation'
  - 'issue: proposal'
  - 'tag: breaking change'
  - 'tag: bug fix'
  - 'tag: documentation'
  - 'tag: enhancement'
  - 'tag: internal'
  - 'tag: new feature'
  - 'tag: underlying tools'

# Set to true to ignore issues in a project (defaults to false)
exemptProjects: true

# Set to true to ignore issues in a milestone (defaults to false)
exemptMilestones: true

# Label to use when marking as stale
staleLabel: stale

# Limit the number of actions per hour, from 1-30. Default is 30
limitPerRun: 30

issues:
  # Comment to post when marking Issues as stale.
  markComment: >
    This issue has been automatically marked as stale because it has not had any
    recent activity. It will be closed in 5 days if no further activity occurs.

  # Comment to post when closing a stale Issue.
  closeComment: >
    This issue has been automatically closed because it has not had any recent
    activity. If you have a question or comment, please open a new issue.

pulls:
  # Comment to post when marking Pull Request as stale.
  markComment: >
    This pull request has been automatically marked as stale because it has not
    had any recent activity. It will be closed in 5 days if no further activity
    occurs.

  # Comment to post when closing a stale Pull Request.
  closeComment: >
    This pull request has been automatically closed because it has not had any
    recent activity. If you have a question or comment, please open a new
    issue. Thank you for your contribution!
```

--------------------------------------------------------------------------------

---[FILE: bug_report.md]---
Location: create-react-app-main/.github/ISSUE_TEMPLATE/bug_report.md

```text
---
name: Bug report
about: Create a report to help us improve
labels: 'issue: bug report, needs triage'
---

<!--
    Please note that your issue will be fixed much faster if you spend about
    half an hour preparing it, including the exact reproduction steps and a demo.

    If you're in a hurry or don't feel confident, it's fine to report bugs with
    less details, but this makes it less likely they'll get fixed soon.

    In either case, please use this template and fill in as many fields below as you can.

    Note that we don't provide help for webpack questions after ejecting.
    You can find webpack docs at https://webpack.js.org/.
-->

### Describe the bug

(Write your answer here.)

### Did you try recovering your dependencies?

<!--
  Your module tree might be corrupted, and that might be causing the issues.
  Let's try to recover it. First, delete these files and folders in your project:

    * node_modules
    * package-lock.json
    * yarn.lock

  Then you need to decide which package manager you prefer to use.
  We support both npm (https://npmjs.com) and yarn (https://yarnpkg.com/).
  However, **they can't be used together in one project** so you need to pick one.

  If you decided to use npm, run this in your project directory:

    npm install -g npm@latest
    npm install

  This should fix your project.

  If you decided to use yarn, update it first (https://yarnpkg.com/en/docs/install).
  Then run in your project directory:

    yarn

  This should fix your project.

  Importantly, **if you decided to use yarn, you should never run `npm install` in the project**.
  For example, yarn users should run `yarn add <library>` instead of `npm install <library>`.
  Otherwise your project will break again.

  Have you done all these steps and still see the issue?
  Please paste the output of `npm --version` and/or `yarn --version` to confirm.
-->

(Write your answer here.)

### Which terms did you search for in User Guide?

<!--
  There are a few common documented problems, such as watcher not detecting changes, or build failing.
  They are described in the Troubleshooting section of the User Guide:

  https://facebook.github.io/create-react-app/docs/troubleshooting

  Please scan these few sections for common problems.
  Additionally, you can search the User Guide itself for something you're having issues with:

  https://facebook.github.io/create-react-app/

  If you didn't find the solution, please share which words you searched for.
  This helps us improve documentation for future readers who might encounter the same problem.
-->

(Write your answer here if relevant.)

### Environment

<!--
  To help identify if a problem is specific to a platform, browser, or module version, information about your environment is required.
  This enables the maintainers quickly reproduce the issue and give feedback.

  Run the following command in your React app's folder in terminal.
  Note: The result is copied to your clipboard directly.

  `npx create-react-app --info`

  Paste the output of the command in the section below.
-->

(paste the output of the command here.)

### Steps to reproduce

<!--
  How would you describe your issue to someone who doesn’t know you or your project?
  Try to write a sequence of steps that anybody can repeat to see the issue.
-->

(Write your steps here:)

1.
2.
3.

### Expected behavior

<!--
  How did you expect the tool to behave?
  It’s fine if you’re not sure your understanding is correct.
  Just write down what you thought would happen.
-->

(Write what you thought would happen.)

### Actual behavior

<!--
  Did something go wrong?
  Is something broken, or not behaving as you expected?
  Please attach screenshots if possible! They are extremely helpful for diagnosing issues.
-->

(Write what happened. Please add screenshots!)

### Reproducible demo

<!--
  If you can, please share a project that reproduces the issue.
  This is the single most effective way to get an issue fixed soon.

  There are two ways to do it:

    * Create a new app and try to reproduce the issue in it.
      This is useful if you roughly know where the problem is, or can’t share the real code.

    * Or, copy your app and remove things until you’re left with the minimal reproducible demo.
      This is useful for finding the root cause. You may then optionally create a new project.

  This is a good guide to creating bug demos: https://stackoverflow.com/help/mcve
  Once you’re done, push the project to GitHub and paste the link to it below:
-->

(Paste the link to an example project and exact instructions to reproduce the issue.)

<!--
  What happens if you skip this step?

  We will try to help you, but in many cases it is impossible because crucial
  information is missing. In that case we'll tag an issue as having a low priority,
  and eventually close it if there is no clear direction.

  We still appreciate the report though, as eventually somebody else might
  create a reproducible example for it.

  Thanks for helping us help you!
-->
```

--------------------------------------------------------------------------------

---[FILE: proposal.md]---
Location: create-react-app-main/.github/ISSUE_TEMPLATE/proposal.md

```text
---
name: Proposal
about: Suggest an idea for improving Create React App
labels: 'issue: proposal, needs triage'
---

### Is your proposal related to a problem?

<!--
  Provide a clear and concise description of what the problem is.
  For example, "I'm always frustrated when..."
-->

(Write your answer here.)

### Describe the solution you'd like

<!--
  Provide a clear and concise description of what you want to happen.
-->

(Describe your proposed solution here.)

### Describe alternatives you've considered

<!--
  Let us know about other solutions you've tried or researched.
-->

(Write your answer here.)

### Additional context

<!--
  Is there anything else you can add about the proposal?
  You might want to link to related issues here, if you haven't already.
-->

(Write your answer here.)
```

--------------------------------------------------------------------------------

---[FILE: question.md]---
Location: create-react-app-main/.github/ISSUE_TEMPLATE/question.md

```text
---
name: Question
about: Get help with Create React App
labels: 'needs triage'
---

If you have a general question about Create React App or about building an app with Create React App we encourage you to post in GitHub Discussions instead of this issue tracker. The maintainers and other community members can provide help and answer your questions there: https://github.com/facebook/create-react-app/discussions

If you're looking for general information on using React, the React docs have a list of resources: https://reactjs.org/community/support.html

If you've discovered a bug or would like to propose a change please use one of the other issue templates.

Thanks!
```

--------------------------------------------------------------------------------

---[FILE: build-and-test.yml]---
Location: create-react-app-main/.github/workflows/build-and-test.yml

```yaml
name: 'Build & Test'

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    name: 'Build (${{ matrix.os }}, Node ${{ matrix.node }})'
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os:
          - 'ubuntu-latest'
        node:
          - '16'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - name: Install dependencies
        run: npm ci --prefer-offline
      - name: Build
        run: npm run build

  integration:
    name: 'Integration Tests (${{ matrix.os }}, Node ${{ matrix.node }})'
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os:
          - 'ubuntu-latest'
          - 'macos-latest'
          - 'windows-latest'
        node:
          - '16'
    steps:
      - uses: actions/checkout@v3
      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - name: Install dependencies
        run: npm ci --prefer-offline
      # The integration tests are run with yarn, so we need to install it.
      - name: Install yarn
        run: npm i -g yarn
      - name: Run integration tests
        run: npm run test:integration

  e2e-simple:
    name: E2E Simple
    uses: ./.github/workflows/e2e-base.yml
    with:
      testScript: 'tasks/e2e-simple.sh'

  e2e-installs:
    name: E2E Installs
    uses: ./.github/workflows/e2e-base.yml
    with:
      testScript: 'tasks/e2e-installs.sh'

  e2e-kitchensink:
    name: E2E Kitchensink
    uses: ./.github/workflows/e2e-base.yml
    with:
      testScript: 'tasks/e2e-kitchensink.sh'
```

--------------------------------------------------------------------------------

---[FILE: e2e-base.yml]---
Location: create-react-app-main/.github/workflows/e2e-base.yml
Signals: React

```yaml
on:
  workflow_call:
    inputs:
      testScript:
        required: true
        type: string

name: E2E

jobs:
  test:
    name: 'Test (${{ matrix.os }}, Node ${{ matrix.node }})'
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os:
          - 'ubuntu-latest'
        node:
          - '16'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - name: Install
        run: npm ci --prefer-offline
      - name: Initialize Global Git config
        run: |
          git config --global core.autocrlf false
          git config --global user.name "Create React App"
          git config --global user.email "cra@email.com"
      - name: Run tests
        run: ${{ inputs.testScript }}
```

--------------------------------------------------------------------------------

---[FILE: lint.yml]---
Location: create-react-app-main/.github/workflows/lint.yml

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - name: Install
        run: npm ci --prefer-offline
      - name: Alex
        run: npm run alex
      - name: Prettier
        run: npm run prettier -- --list-different
      - name: Eslint
        run: npm run eslint -- --max-warnings 0
```

--------------------------------------------------------------------------------

---[FILE: adding-a-css-modules-stylesheet.md]---
Location: create-react-app-main/docusaurus/docs/adding-a-css-modules-stylesheet.md

```text
---
id: adding-a-css-modules-stylesheet
title: Adding a CSS Modules Stylesheet
sidebar_label: Adding CSS Modules
---

> Note: this feature is available with `react-scripts@2.0.0` and higher.

This project supports [CSS Modules](https://github.com/css-modules/css-modules) alongside regular stylesheets using the `[name].module.css` file naming convention. CSS Modules allows the scoping of CSS by automatically creating a unique classname of the format `[filename]\_[classname]\_\_[hash]`.

> **Tip:** Should you want to preprocess a stylesheet with Sass then make sure to [follow the installation instructions](adding-a-sass-stylesheet.md) and then change the stylesheet file extension as follows: `[name].module.scss` or `[name].module.sass`.

CSS Modules let you use the same CSS class name in different files without worrying about naming clashes. Learn more about CSS Modules [here](https://css-tricks.com/css-modules-part-1-need/).

## `Button.module.css`

```css
.error {
  background-color: red;
}
```

## `another-stylesheet.css`

```css
.error {
  color: red;
}
```

## `Button.js`

```js
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles
import './another-stylesheet.css'; // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```

## Result

No clashes from other `.error` class names

```html
<!-- This button has red background but not red text -->
<button class="Button_error_ax7yz">Error Button</button>
```

**This is an optional feature.** Regular `<link>` stylesheets and CSS files are fully supported. CSS Modules are turned on for files ending with the `.module.css` extension.
```

--------------------------------------------------------------------------------

---[FILE: adding-a-router.md]---
Location: create-react-app-main/docusaurus/docs/adding-a-router.md

```text
---
id: adding-a-router
title: Adding a Router
---

Create React App doesn't prescribe a specific routing solution, but [React Router](https://reactrouter.com/) is the most popular one.

To add it, run:

```sh
npm install react-router-dom
```

Alternatively you may use `yarn`:

```sh
yarn add react-router-dom
```

To try it, delete all the code in `src/App.js` and replace it with any of the examples on its website. The [Basic Example](https://reactrouter.com/docs/examples/basic) is a good place to get started. For more info on adding routes, check out [the React Router docs on adding routes](https://reactrouter.com/docs/getting-started/tutorial#add-some-routes).

Note that [you may need to configure your production server to support client-side routing](deployment.md#serving-apps-with-client-side-routing) before deploying your app.
```

--------------------------------------------------------------------------------

---[FILE: adding-a-sass-stylesheet.md]---
Location: create-react-app-main/docusaurus/docs/adding-a-sass-stylesheet.md

```text
---
id: adding-a-sass-stylesheet
title: Adding a Sass Stylesheet
sidebar_label: Adding Sass Stylesheets
---

> Note: this feature is available with `react-scripts@2.0.0` and higher.

Generally, we recommend that you don’t reuse the same CSS classes across different components. For example, instead of using a `.Button` CSS class in `<AcceptButton>` and `<RejectButton>` components, we recommend creating a `<Button>` component with its own `.Button` styles, that both `<AcceptButton>` and `<RejectButton>` can render (but [not inherit](https://facebook.github.io/react/docs/composition-vs-inheritance.html)).

Following this rule often makes CSS preprocessors less useful, as features like mixins and nesting are replaced by component composition. You can, however, integrate a CSS preprocessor if you find it valuable.

To use Sass, first install `sass`:

```sh
$ npm install sass
# or
$ yarn add sass
```

Now you can rename `src/App.css` to `src/App.scss` and update `src/App.js` to import `src/App.scss`.
This file and any other file will be automatically compiled if imported with the extension `.scss` or `.sass`.

To share variables between Sass files, you can use Sass's [`@use` rule](https://sass-lang.com/documentation/at-rules/use). For example, `src/App.scss` and other component style files could include `@use "./shared.scss";` with variable definitions.

This will allow you to do imports like

```scss
@use 'styles/_colors.scss'; // assuming a styles directory under src/
@use '~nprogress/nprogress'; // loading a css file from the nprogress node module
```

> **Note:** You can prefix paths with `~`, as displayed above, to resolve modules from `node_modules`.

`sass` also supports the `SASS_PATH` variable.

To use imports relative to a path you specify, you can add a [`.env` file](https://github.com/facebook/create-react-app/blob/main/docusaurus/docs/adding-custom-environment-variables.md#adding-development-environment-variables-in-env) at the project root with the path specified in the `SASS_PATH` environment variable. To specify more directories you can add them to `SASS_PATH` separated by a `:` like `path1:path2:path3`.

> **Note:** For the Windows operating system, separate your paths by semicolons.
>
> ```
> SASS_PATH=path1;path2;path3
> ```

> **Tip:** You can opt into using this feature with [CSS modules](adding-a-css-modules-stylesheet.md) too!

> **Note:** If you're using Flow, override the [module.file_ext](https://flow.org/en/docs/config/options/#toc-module-file-ext-string) setting in your `.flowconfig` so it'll recognize `.sass` or `.scss` files. You will also need to include the `module.file_ext` default settings for `.js`, `.jsx`, `.mjs` and `.json` files.
>
> ```
> [options]
> module.file_ext=.js
> module.file_ext=.jsx
> module.file_ext=.mjs
> module.file_ext=.json
> module.file_ext=.sass
> module.file_ext=.scss
> ```

> **Note:** LibSass and the packages built on top of it, including Node Sass, are [deprecated](https://sass-lang.com/blog/libsass-is-deprecated).
> If you're a user of Node Sass, you can migrate to Dart Sass by replacing `node-sass` in your `package.json` file with `sass` or by running the following commands:
>
> ```sh
> $ npm uninstall node-sass
> $ npm install sass
> # or
> $ yarn remove node-sass
> $ yarn add sass
> ```
```

--------------------------------------------------------------------------------

---[FILE: adding-a-stylesheet.md]---
Location: create-react-app-main/docusaurus/docs/adding-a-stylesheet.md

```text
---
id: adding-a-stylesheet
title: Adding a Stylesheet
sidebar_label: Adding Stylesheets
---

This project setup uses [webpack](https://webpack.js.org/) for handling all assets. webpack offers a custom way of “extending” the concept of `import` beyond JavaScript. To express that a JavaScript file depends on a CSS file, you need to **import the CSS from the JavaScript file**:

## `Button.css`

```css
.Button {
  padding: 20px;
}
```

## `Button.js`

```js
import React, { Component } from 'react';
import './Button.css'; // Tell webpack that Button.js uses these styles

class Button extends Component {
  render() {
    // You can use them as regular CSS styles
    return <div className="Button" />;
  }
}
```

**This is not required for React** but many people find this feature convenient. You can read about the benefits of this approach [here](https://medium.com/seek-blog/block-element-modifying-your-javascript-components-d7f99fcab52b). However you should be aware that this makes your code less portable to other build tools and environments than webpack.

In development, expressing dependencies this way allows your styles to be reloaded on the fly as you edit them. In production, all CSS files will be concatenated into a single minified `.css` file in the build output.

If you are concerned about using webpack-specific semantics, you can put all your CSS right into `src/index.css`. It would still be imported from `src/index.js`, but you could always remove that import if you later migrate to a different build tool.
```

--------------------------------------------------------------------------------

---[FILE: adding-bootstrap.md]---
Location: create-react-app-main/docusaurus/docs/adding-bootstrap.md

```text
---
id: adding-bootstrap
title: Adding Bootstrap
---

While you don’t have to use any specific library to integrate Bootstrap with React apps, it's often easier than trying to wrap the Bootstrap jQuery plugins. [React Bootstrap](https://react-bootstrap.netlify.com/) is the most popular option that strives for complete parity with Bootstrap. [reactstrap](https://reactstrap.github.io/) is also a good choice for projects looking for smaller builds at the expense of some features.

Each project's respective documentation site has detailed instructions for installing and using them. Both depend on the Bootstrap css file so install that as well:

```sh
npm install bootstrap
```

Alternatively you may use `yarn`:

```sh
yarn add bootstrap
```

Import Bootstrap CSS and optionally Bootstrap theme CSS in the beginning of your `src/index.js` file:

```js
import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
```

## Using a Custom Theme

> Note: this feature is available with `react-scripts@2.0.0` and higher.

Sometimes you might need to tweak the visual styles of Bootstrap (or equivalent package).

As of `react-scripts@2.0.0` you can import `.scss` files. This makes it possible to use a package's built-in Sass variables for global style preferences.

To enable `scss` in Create React App you will need to install `sass`.

```sh
npm install sass
```

Alternatively you may use `yarn`:

```sh
yarn add sass
```

To customize Bootstrap, create a file called `src/custom.scss` (or similar) and import the Bootstrap source stylesheet. Add any overrides _before_ the imported file(s). You can reference [Bootstrap's documentation](https://getbootstrap.com/docs/4.6/getting-started/theming/#variable-defaults) for the names of the available variables.

```scss
// Override default variables before the import
$body-bg: #000;

// Import Bootstrap and its default variables
@import '~bootstrap/scss/bootstrap.scss';
```

> **Note:** You can prefix paths with `~`, as displayed above, to resolve modules from `node_modules`.

Finally, import the newly created `.scss` file instead of the default Bootstrap `.css` in the beginning of your `src/index.js` file, for example:

```javascript
import './custom.scss';
```
```

--------------------------------------------------------------------------------

---[FILE: adding-css-reset.md]---
Location: create-react-app-main/docusaurus/docs/adding-css-reset.md

```text
---
id: adding-css-reset
title: Adding a CSS Reset
sidebar_label: Adding CSS Reset
---

This project setup uses [PostCSS Normalize] for adding a [CSS Reset].

To start using it, add `@import-normalize;` anywhere in your CSS file(s). You only need to include it once and duplicate imports are automatically removed. Since you only need to include it once, a good place to add it is `index.css` or `App.css`.

## `index.css`

```css
@import-normalize; /* bring in normalize.css styles */

/* rest of app styles */
```

> **Tip**: If you see an "_Unknown at rule @import-normalize css(unknownAtRules)_" warning in VSCode, change the `css.lint.unknownAtRules` setting to `ignore`.

You can control which parts of [normalize.css] to use via your project's [browserslist].

Results when [browserslist] is `last 3 versions`:

```css
/**
 * Add the correct display in IE 9-.
 */

audio,
video {
  display: inline-block;
}

/**
 * Remove the border on images inside links in IE 10-.
 */

img {
  border-style: none;
}
```

Results when [browserslist] is `last 2 versions`:

```css
/**
 * Remove the border on images inside links in IE 10-.
 */

img {
  border-style: none;
}
```

## Browser support

Browser support is dictated by what normalize.css [supports]. As of this writing, it includes:

- Chrome (last 3)
- Edge (last 3)
- Firefox (last 3)
- Firefox ESR
- Opera (last 3)
- Safari (last 3)
- iOS Safari (last 2)
- Internet Explorer 9+

[browserslist]: https://browserl.ist/
[css reset]: https://cssreset.com/what-is-a-css-reset/
[normalize.css]: https://github.com/csstools/normalize.css
[supports]: https://github.com/csstools/normalize.css#browser-support
[postcss normalize]: https://github.com/csstools/postcss-normalize
```

--------------------------------------------------------------------------------

---[FILE: adding-custom-environment-variables.md]---
Location: create-react-app-main/docusaurus/docs/adding-custom-environment-variables.md

```text
---
id: adding-custom-environment-variables
title: Adding Custom Environment Variables
sidebar_label: Environment Variables
---

> Note: this feature is available with `react-scripts@0.2.3` and higher.

Your project can consume variables declared in your environment as if they were declared locally in your JS files. By default you will have `NODE_ENV` defined for you, and any other environment variables starting with `REACT_APP_`.

> WARNING: Do not store any secrets (such as private API keys) in your React app!
>
> Environment variables are embedded into the build, meaning anyone can view them by inspecting your app's files.

**The environment variables are embedded during the build time**. Since Create React App produces a static HTML/CSS/JS bundle, it can’t possibly read them at runtime. To read them at runtime, you would need to load HTML into memory on the server and replace placeholders in runtime, as [described here](title-and-meta-tags.md#injecting-data-from-the-server-into-the-page). Alternatively you can rebuild the app on the server anytime you change them.

> Note: You must create custom environment variables beginning with `REACT_APP_`. Any other variables except `NODE_ENV` will be ignored to avoid accidentally [exposing a private key on the machine that could have the same name](https://github.com/facebook/create-react-app/issues/865#issuecomment-252199527). Changing any environment variables will require you to restart the development server if it is running.

These environment variables will be defined for you on `process.env`. For example, having an environment variable named `REACT_APP_NOT_SECRET_CODE` will be exposed in your JS as `process.env.REACT_APP_NOT_SECRET_CODE`.

There is also a built-in environment variable called `NODE_ENV`. You can read it from `process.env.NODE_ENV`. When you run `npm start`, it is always equal to `'development'`, when you run `npm test` it is always equal to `'test'`, and when you run `npm run build` to make a production bundle, it is always equal to `'production'`. **You cannot override `NODE_ENV` manually.** This prevents developers from accidentally deploying a slow development build to production.

These environment variables can be useful for displaying information conditionally based on where the project is deployed or consuming sensitive data that lives outside of version control.

First, you need to have environment variables defined. For example, let’s say you wanted to consume an environment variable inside a `<form>`:

```jsx
render() {
  return (
    <div>
      <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
      <form>
        <input type="hidden" defaultValue={process.env.REACT_APP_NOT_SECRET_CODE} />
      </form>
    </div>
  );
}
```

During the build, `process.env.REACT_APP_NOT_SECRET_CODE` will be replaced with the current value of the `REACT_APP_NOT_SECRET_CODE` environment variable. Remember that the `NODE_ENV` variable will be set for you automatically.

When you load the app in the browser and inspect the `<input>`, you will see its value set to `abcdef`, and the bold text will show the environment provided when using `npm start`:

<!-- prettier-ignore-start -->

```html
<div>
  <small>You are running this application in <b>development</b> mode.</small>
  <form>
    <input type="hidden" value="abcdef" />
  </form>
</div>
```

<!-- prettier-ignore-end -->

The above form is looking for a variable called `REACT_APP_NOT_SECRET_CODE` from the environment. In order to consume this value, we need to have it defined in the environment. This can be done using two ways: either in your shell or in a `.env` file. Both of these ways are described in the next few sections.

Having access to the `NODE_ENV` is also useful for performing actions conditionally:

```js
if (process.env.NODE_ENV !== 'production') {
  analytics.disable();
}
```

When you compile the app with `npm run build`, the minification step will strip out this condition, and the resulting bundle will be smaller.

## Referencing Environment Variables in the HTML

> Note: this feature is available with `react-scripts@0.9.0` and higher.

You can also access the environment variables starting with `REACT_APP_` in the `public/index.html`. For example:

```html
<title>%REACT_APP_WEBSITE_NAME%</title>
```

Note that the caveats from the above section apply:

- Apart from a few built-in variables (`NODE_ENV` and `PUBLIC_URL`), variable names must start with `REACT_APP_` to work.
- The environment variables are injected at build time. If you need to inject them at runtime, [follow this approach instead](title-and-meta-tags.md#generating-dynamic-meta-tags-on-the-server).

## Adding Temporary Environment Variables In Your Shell

Defining environment variables can vary between OSes. It’s also important to know that this manner is temporary for the life of the shell session.

### Windows (cmd.exe)

```cmd
set "REACT_APP_NOT_SECRET_CODE=abcdef" && npm start
```

(Note: Quotes around the variable assignment are required to avoid a trailing whitespace.)

### Windows (Powershell)

```Powershell
($env:REACT_APP_NOT_SECRET_CODE = "abcdef") -and (npm start)
```

### Linux, macOS (Bash)

```sh
REACT_APP_NOT_SECRET_CODE=abcdef npm start
```

## Adding Development Environment Variables In `.env`

> Note: this feature is available with `react-scripts@0.5.0` and higher.

To define permanent environment variables, create a file called `.env` in the root of your project:

```
REACT_APP_NOT_SECRET_CODE=abcdef
```

> Note: You must create custom environment variables beginning with `REACT_APP_`. Any other variables except `NODE_ENV` will be ignored to avoid [accidentally exposing a private key on the machine that could have the same name](https://github.com/facebook/create-react-app/issues/865#issuecomment-252199527). Changing any environment variables will require you to restart the development server if it is running.

> Note: You need to restart the development server after changing `.env` files.

`.env` files **should be** checked into source control (with the exclusion of `.env*.local`).

### What other `.env` files can be used?

> Note: this feature is **available with `react-scripts@1.0.0` and higher**.

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

- `npm start`: `.env.development.local`, `.env.local`, `.env.development`, `.env`
- `npm run build`: `.env.production.local`, `.env.local`, `.env.production`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.

Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

> Note: If you are defining environment variables for development, your CI and/or hosting platform will most likely need
> these defined as well. Consult their documentation how to do this. For example, see the documentation for [Travis CI](https://docs.travis-ci.com/user/environment-variables/) or [Heroku](https://devcenter.heroku.com/articles/config-vars).

### Expanding Environment Variables In `.env`

> Note: this feature is available with `react-scripts@1.1.0` and higher.

Expand variables already on your machine for use in your `.env` file (using [dotenv-expand](https://github.com/motdotla/dotenv-expand)).

For example, to get the environment variable `npm_package_version`:

```
REACT_APP_VERSION=$npm_package_version
# also works:
# REACT_APP_VERSION=${npm_package_version}
```

Or expand variables local to the current `.env` file:

```
DOMAIN=www.example.com
REACT_APP_FOO=$DOMAIN/foo
REACT_APP_BAR=$DOMAIN/bar
```
```

--------------------------------------------------------------------------------

---[FILE: adding-flow.md]---
Location: create-react-app-main/docusaurus/docs/adding-flow.md

```text
---
id: adding-flow
title: Adding Flow
---

Flow is a static type checker that helps you write code with fewer bugs. Check out this [introduction to using static types in JavaScript](https://medium.com/@preethikasireddy/why-use-static-types-in-javascript-part-1-8382da1e0adb) if you are new to this concept.

Recent versions of [Flow](https://flow.org/) work with Create React App projects out of the box.

To add Flow to a Create React App project, follow these steps:

1. Run `npm install --save flow-bin` (or `yarn add flow-bin`).
2. Add `"flow": "flow"` to the `scripts` section of your `package.json`.
3. Run `npm run flow init` (or `yarn flow init`) to create a [`.flowconfig` file](https://flow.org/en/docs/config/) in the root directory.
4. Add `// @flow` to any files you want to type check (for example, to `src/App.js`).

Now you can run `npm run flow` (or `yarn flow`) to check the files for type errors.  
You can optionally enable an extension for your IDE, such as [Flow Language Support](https://github.com/flowtype/flow-for-vscode) for Visual Studio Code, or leverage the Language Server Protocol standard (e.g. [vim LSP](https://github.com/prabirshrestha/vim-lsp/wiki/Servers-Flow)) to get hints while you type.

If you'd like to use [absolute imports](/docs/importing-a-component#absolute-imports) with Flow,
make sure to add the following line to your `.flowconfig` to make Flow aware of it:

```diff
  [options]
+ module.name_mapper='^\([^\.].*\)$' -> '<PROJECT_ROOT>/src/\1'
```

To learn more about Flow, check out [its documentation](https://flow.org/).
```

--------------------------------------------------------------------------------

````

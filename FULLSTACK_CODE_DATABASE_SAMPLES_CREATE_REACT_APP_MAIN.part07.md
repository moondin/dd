---
source_txt: fullstack_samples/create-react-app-main
converted_utc: 2025-12-18T13:04:37Z
part: 7
parts_total: 37
---

# FULLSTACK CODE DATABASE SAMPLES create-react-app-main

## Verbatim Content (Part 7 of 37)

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

---[FILE: CHANGELOG.md]---
Location: create-react-app-main/CHANGELOG.md

```text
## 5.0.1 (2022-04-12)

Create React App 5.0.1 is a maintenance release that improves compatibility with React 18. We've also updated our templates to use `createRoot` and relaxed our check for older versions of Create React App.

# Migrating from 5.0.0 to 5.0.1

Inside any created project that has not been ejected, run:

```
npm install --save --save-exact react-scripts@5.0.1
```

or

```
yarn add --exact react-scripts@5.0.1
```

#### :bug: Bug Fix

- `react-scripts`
  - [#12245](https://github.com/facebook/create-react-app/pull/12245) fix: webpack noise printed only if error or warning ([@Andrew47](https://github.com/Andrew47))
- `create-react-app`
  - [#11915](https://github.com/facebook/create-react-app/pull/11915) Warn when not using the latest version of create-react-app but do not exit ([@iansu](https://github.com/iansu))
- `react-dev-utils`
  - [#11640](https://github.com/facebook/create-react-app/pull/11640) Ensure posix compliant joins for urls in middleware ([@psiservices-justin-sullard](https://github.com/psiservices-justin-sullard))

#### :nail_care: Enhancement

- `cra-template-typescript`, `cra-template`, `react-scripts`
  - [#12220](https://github.com/facebook/create-react-app/pull/12220) Update templates to use React 18 `createRoot` ([@kyletsang](https://github.com/kyletsang))
- `cra-template-typescript`, `cra-template`
  - [#12223](https://github.com/facebook/create-react-app/pull/12223) chore: upgrade rtl version to support react 18 ([@MatanBobi](https://github.com/MatanBobi))
- `eslint-config-react-app`
  - [#11622](https://github.com/facebook/create-react-app/pull/11622) updated deprecated rules ([@wisammechano](https://github.com/wisammechano))

#### :memo: Documentation

- [#11594](https://github.com/facebook/create-react-app/pull/11594) Fix a typo in deployment.md ([@fishmandev](https://github.com/fishmandev))
- [#11805](https://github.com/facebook/create-react-app/pull/11805) docs: Changelog 5.0.0 ([@jafin](https://github.com/jafin))
- [#11757](https://github.com/facebook/create-react-app/pull/11757) prevent both npm and yarn commands from being copied ([@mubarakn](https://github.com/mubarakn))

#### :house: Internal

- [#11985](https://github.com/facebook/create-react-app/pull/11985) Ignore docs when publishing ([@iansu](https://github.com/iansu))

#### Committers: 11

- Andrew Burnie ([@Andrew47](https://github.com/Andrew47))
- Clément Vannicatte ([@shortcuts](https://github.com/shortcuts))
- Dmitriy Fishman ([@fishmandev](https://github.com/fishmandev))
- Dmitry Vinnik ([@dmitryvinn](https://github.com/dmitryvinn))
- Ian Sutherland ([@iansu](https://github.com/iansu))
- Jason Finch ([@jafin](https://github.com/jafin))
- Kyle Tsang ([@kyletsang](https://github.com/kyletsang))
- Matan Borenkraout ([@MatanBobi](https://github.com/MatanBobi))
- Wisam Naji ([@wisammechano](https://github.com/wisammechano))
- [@mubarakn](https://github.com/mubarakn)
- [@psiservices-justin-sullard](https://github.com/psiservices-justin-sullard)

## 5.0.0 (2021-12-14)

Create React App 5.0 is a major release with several new features and the latest version of all major dependencies.

Thanks to all the maintainers and contributors who worked so hard on this release! 🙌

# Highlights

- webpack 5 ([#11201](https://github.com/facebook/create-react-app/pull/11201))
- Jest 27 ([#11338](<(https://github.com/facebook/create-react-app/pull/11338)>))
- ESLint 8 ([#11375](<(https://github.com/facebook/create-react-app/pull/11375)>))
- PostCSS 8 ([#11121](<(https://github.com/facebook/create-react-app/pull/11121)>))
- Fast Refresh improvements and bug fixes ([#11105](https://github.com/facebook/create-react-app/pull/11105))
- Support for Tailwind ([#11717](https://github.com/facebook/create-react-app/pull/11717))
- Improved package manager detection ([#11322](https://github.com/facebook/create-react-app/pull/11322))
- Unpinned all dependencies for better compatibility with other tools ([#11474](https://github.com/facebook/create-react-app/pull/11474))
- Dropped support for Node 10 and 12

# Migrating from 4.0.x to 5.0.0

Inside any created project that has not been ejected, run:

```
npm install --save --save-exact react-scripts@5.0.0
```

or

```
yarn add --exact react-scripts@5.0.0
```

**NOTE: You may need to delete your node_modules folder and reinstall your dependencies by running npm install (or yarn) if you encounter errors after upgrading.**

If you previously ejected but now want to upgrade, one common solution is to find the commits where you ejected (and any subsequent commits changing the configuration), revert them, upgrade, and later optionally eject again. It’s also possible that the feature you ejected for is now supported out of the box.

# Breaking Changes

Like any major release, `react-scripts@5.0.0` contains a number of breaking changes. We expect that they won't affect every user, but we recommend you look over this section to see if something is relevant to you. If we missed something, please file a new issue.

Dropped support for Node 10 and 12
Node 10 reached End-of-Life in April 2021 and Node 12 will be End-of-Life in April 2022. Going forward we will only support the latest LTS release of Node.js.

# Full Changelog

#### :boom: Breaking Change

- `create-react-app`
  - [#11322](https://github.com/facebook/create-react-app/pull/11322) Use env var to detect yarn or npm as the package manager ([@lukekarrys](https://github.com/lukekarrys))
- `babel-preset-react-app`, `cra-template-typescript`, `cra-template`, `create-react-app`, `eslint-config-react-app`, `react-app-polyfill`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#11201](https://github.com/facebook/create-react-app/pull/11201) Webpack 5 ([@raix](https://github.com/raix))
- `eslint-config-react-app`, `react-error-overlay`, `react-scripts`
  - [#10761](https://github.com/facebook/create-react-app/pull/10761) chore: migrate to @babel/eslint-parser ([@JLHwung](https://github.com/JLHwung))
- `react-scripts`
  - [#11188](https://github.com/facebook/create-react-app/pull/11188) Deprecate root level template.json keys ([@mrmckeb](https://github.com/mrmckeb))

#### :bug: Bug Fix

- `react-scripts`
  - [#11413](https://github.com/facebook/create-react-app/pull/11413) fix(webpackDevServer): disable overlay for warnings ([@jawadsh123](https://github.com/jawadsh123))
  - [#10511](https://github.com/facebook/create-react-app/pull/10511) Fix ICSS syntax in stylesheets ([@thabemmz](https://github.com/thabemmz))

#### :nail_care: Enhancement

- `react-scripts`
  - [#11717](https://github.com/facebook/create-react-app/pull/11717) Add support for Tailwind ([@iansu](https://github.com/iansu))
  - [#8227](https://github.com/facebook/create-react-app/pull/8227) Add source-map-loader for debugging into original source of node_modules libraries that contain sourcemaps ([@justingrant](https://github.com/justingrant))
  - [#10499](https://github.com/facebook/create-react-app/pull/10499) Remove ESLint verification when opting-out ([@mrmckeb](https://github.com/mrmckeb))
- `eslint-config-react-app`, `react-error-overlay`, `react-scripts`
  - [#11375](https://github.com/facebook/create-react-app/pull/11375) feat(eslint-config-react-app): support ESLint 8.x ([@MichaelDeBoey](https://github.com/MichaelDeBoey))
- `create-react-app`
  - [#11322](https://github.com/facebook/create-react-app/pull/11322) Use env var to detect yarn or npm as the package manager ([@lukekarrys](https://github.com/lukekarrys))
  - [#11057](https://github.com/facebook/create-react-app/pull/11057) Coerce Node versions with metadata ([@mrmckeb](https://github.com/mrmckeb))
- `react-dev-utils`
  - [#11105](https://github.com/facebook/create-react-app/pull/11105) fix: fast refresh stops on needed bail outs ([@pmmmwh](https://github.com/pmmmwh))
  - [#10205](https://github.com/facebook/create-react-app/pull/10205) Update ModuleNotFoundPlugin to support Webpack 5 ([@raix](https://github.com/raix))
- `create-react-app`, `react-scripts`
  - [#11176](https://github.com/facebook/create-react-app/pull/11176) Run npm with --no-audit ([@gaearon](https://github.com/gaearon))

#### :memo: Documentation

- Other
  - [#11619](https://github.com/facebook/create-react-app/pull/11619) The default port used by `serve` has changed ([@leo](https://github.com/leo))
  - [#10907](https://github.com/facebook/create-react-app/pull/10907) Fix link address ([@e-w-h](https://github.com/e-w-h))
  - [#10805](https://github.com/facebook/create-react-app/pull/10805) Update PWA docs to point at the cra-template-pwa package ([@slieschke](https://github.com/slieschke))
  - [#10631](https://github.com/facebook/create-react-app/pull/10631) Update IMAGE_INLINE_SIZE_LIMIT docs ([@ianschmitz](https://github.com/ianschmitz))
- `eslint-config-react-app`
  - [#10317](https://github.com/facebook/create-react-app/pull/10317) eslint-config-react-app typo fix ([@Spacerat](https://github.com/Spacerat))
- `react-dev-utils`
  - [#10779](https://github.com/facebook/create-react-app/pull/10779) Suggest sass instead of node-sass package ([@andrewywong](https://github.com/andrewywong))
- `babel-preset-react-app`, `eslint-config-react-app`
  - [#10288](https://github.com/facebook/create-react-app/pull/10288) Upgrade docs http links to https ([@xom9ikk](https://github.com/xom9ikk))
- `cra-template`
  - [#10763](https://github.com/facebook/create-react-app/pull/10763) Trivial English fixes ([@ujihisa](https://github.com/ujihisa))

#### :house: Internal

- Other
  - [#11723](https://github.com/facebook/create-react-app/pull/11723) chore(test): make all tests install with `npm ci` ([@lukekarrys](https://github.com/lukekarrys))
  - [#11686](https://github.com/facebook/create-react-app/pull/11686) [WIP] Fix integration test teardown / cleanup and missing yarn installation ([@raix](https://github.com/raix))
  - [#11252](https://github.com/facebook/create-react-app/pull/11252) Remove package-lock.json ([@Methuselah96](https://github.com/Methuselah96))
- `create-react-app`
  - [#11706](https://github.com/facebook/create-react-app/pull/11706) Remove cached lockfile ([@lukekarrys](https://github.com/lukekarrys))
- `babel-plugin-named-asset-import`, `babel-preset-react-app`, `confusing-browser-globals`, `create-react-app`, `react-app-polyfill`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#11624](https://github.com/facebook/create-react-app/pull/11624) Update all dependencies ([@jd1048576](https://github.com/jd1048576))
- `react-scripts`
  - [#11597](https://github.com/facebook/create-react-app/pull/11597) Update package.json ([@HADMARINE](https://github.com/HADMARINE))
  - [#11292](https://github.com/facebook/create-react-app/pull/11292) fix: dependency issue after workbox-webpack-plugin 6.2 release ([@fguitton](https://github.com/fguitton))
  - [#11188](https://github.com/facebook/create-react-app/pull/11188) Deprecate root level template.json keys ([@mrmckeb](https://github.com/mrmckeb))
  - [#10784](https://github.com/facebook/create-react-app/pull/10784) Remove outdated comments on react-refresh ([@luk3kang](https://github.com/luk3kang))
- `babel-plugin-named-asset-import`, `confusing-browser-globals`, `create-react-app`, `eslint-config-react-app`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#11474](https://github.com/facebook/create-react-app/pull/11474) Remove dependency pinning ([@mrmckeb](https://github.com/mrmckeb))
- `confusing-browser-globals`, `cra-template-typescript`, `cra-template`, `create-react-app`
  - [#11415](https://github.com/facebook/create-react-app/pull/11415) Bump template dependency version ([@shfshanyue](https://github.com/shfshanyue))
- `react-error-overlay`, `react-scripts`
  - [#11304](https://github.com/facebook/create-react-app/pull/11304) Use npm v7 with workspaces for local development and testing ([@lukekarrys](https://github.com/lukekarrys))
- `babel-preset-react-app`, `cra-template-typescript`, `cra-template`, `create-react-app`, `eslint-config-react-app`, `react-app-polyfill`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#11201](https://github.com/facebook/create-react-app/pull/11201) Webpack 5 ([@raix](https://github.com/raix))

#### :hammer: Underlying Tools

- `react-dev-utils`, `react-scripts`
  - [#11476](https://github.com/facebook/create-react-app/pull/11476) Bump browserslist from 4.14.2 to 4.16.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
- `react-scripts`
  - [#11325](https://github.com/facebook/create-react-app/pull/11325) allow CORS on webpack-dev-server ([@hasanayan](https://github.com/hasanayan))
  - [#11121](https://github.com/facebook/create-react-app/pull/11121) Update PostCSS version ([@mrmckeb](https://github.com/mrmckeb))
  - [#10204](https://github.com/facebook/create-react-app/pull/10204) Update WebpackManifestPlugin ([@raix](https://github.com/raix))
  - [#10456](https://github.com/facebook/create-react-app/pull/10456) Update PostCSS packages ([@raix](https://github.com/raix))
- `babel-plugin-named-asset-import`, `confusing-browser-globals`, `create-react-app`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#11338](https://github.com/facebook/create-react-app/pull/11338) Upgrade jest and related packages from 26.6.0 to 27.1.0 ([@krreet](https://github.com/krreet))
- `eslint-config-react-app`, `react-error-overlay`, `react-scripts`
  - [#10761](https://github.com/facebook/create-react-app/pull/10761) chore: migrate to @babel/eslint-parser ([@JLHwung](https://github.com/JLHwung))
- `babel-preset-react-app`, `react-dev-utils`, `react-error-overlay`, `react-scripts`
  - [#10797](https://github.com/facebook/create-react-app/pull/10797) Unpin babel dependencies ([@mohd-akram](https://github.com/mohd-akram))
- `react-dev-utils`
  - [#10791](https://github.com/facebook/create-react-app/pull/10791) Bump immer version for fixing security issue ([@shamprasadrh](https://github.com/shamprasadrh))

#### Committers: 34

- Andrew Wong ([@andrewywong](https://github.com/andrewywong))
- Brody McKee ([@mrmckeb](https://github.com/mrmckeb))
- Christiaan van Bemmel ([@thabemmz](https://github.com/thabemmz))
- Dan Abramov ([@gaearon](https://github.com/gaearon))
- Florian Guitton ([@fguitton](https://github.com/fguitton))
- Hasan Ayan ([@hasanayan](https://github.com/hasanayan))
- Huáng Jùnliàng ([@JLHwung](https://github.com/JLHwung))
- Ian Schmitz ([@ianschmitz](https://github.com/ianschmitz))
- Ian Sutherland ([@iansu](https://github.com/iansu))
- James George ([@jamesgeorge007](https://github.com/jamesgeorge007))
- Jason Williams ([@jasonwilliams](https://github.com/jasonwilliams))
- Jawad ([@jawadsh123](https://github.com/jawadsh123))
- Joseph Atkins-Turkish ([@Spacerat](https://github.com/Spacerat))
- Justin Grant ([@justingrant](https://github.com/justingrant))
- Konrad Stępniak ([@th7nder](https://github.com/th7nder))
- Kristoffer K. ([@merceyz](https://github.com/merceyz))
- Leo Lamprecht ([@leo](https://github.com/leo))
- Luke Karrys ([@lukekarrys](https://github.com/lukekarrys))
- Max Romanyuta ([@xom9ikk](https://github.com/xom9ikk))
- Michael Mok ([@pmmmwh](https://github.com/pmmmwh))
- Michaël De Boey ([@MichaelDeBoey](https://github.com/MichaelDeBoey))
- Mohamed Akram ([@mohd-akram](https://github.com/mohd-akram))
- Morten N.O. Nørgaard Henriksen ([@raix](https://github.com/raix))
- Nathan Bierema ([@Methuselah96](https://github.com/Methuselah96))
- Reetesh Kumar ([@krreet](https://github.com/krreet))
- Shamprasad RH ([@shamprasadrh](https://github.com/shamprasadrh))
- Simon Lieschke ([@slieschke](https://github.com/slieschke))
- [@e-w-h](https://github.com/e-w-h)
- [@jd1048576](https://github.com/jd1048576)
- [@luk3kang](https://github.com/luk3kang)
- [@ujihisa](https://github.com/ujihisa)
- hadmarine ([@HADMARINE](https://github.com/HADMARINE))
- huntr.dev | the place to protect open source ([@huntr-helper](https://github.com/huntr-helper))
- shanyue ([@shfshanyue](https://github.com/shfshanyue))

## Releases Before 5.x

Please refer to [CHANGELOG-4.x.md](./CHANGELOG-4.x.md) for earlier versions.
```

--------------------------------------------------------------------------------

---[FILE: CODE_OF_CONDUCT.md]---
Location: create-react-app-main/CODE_OF_CONDUCT.md

```text
# Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to make participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, sex characteristics, gender identity and expression,
level of experience, education, socio-economic status, nationality, personal
appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

## Scope

This Code of Conduct applies within all project spaces, and it also applies when
an individual is representing the project or its community in public spaces.
Examples of representing a project or community include using an official
project e-mail address, posting via an official social media account, or acting
as an appointed representative at an online or offline event. Representation of
a project may be further defined and clarified by project maintainers.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at <opensource-conduct@fb.com>. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see
https://www.contributor-covenant.org/faq
```

--------------------------------------------------------------------------------

---[FILE: CONTRIBUTING.md]---
Location: create-react-app-main/CONTRIBUTING.md

```text
# Contributing to Create React App

Loving Create React App and want to get involved? Thanks! There are plenty of ways you can help.

Please take a moment to review this document in order to make the contribution process straightforward and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Core Ideas

As much as possible, we try to avoid adding configuration and flags. The purpose of this tool is to provide the best experience for people getting started with React, and this will always be our first priority. This means that sometimes we [sacrifice additional functionality](https://gettingreal.37signals.com/ch05_Half_Not_Half_Assed.php) (such as server rendering) because it is too hard to solve it in a way that wouldn’t require any configuration.

We prefer **convention, heuristics, or interactivity** over configuration.<br>
Here are a few examples of them in action.

### Convention

<!--alex disable easy-->

Instead of letting the user specify the entry filename, we always assume it to be `src/index.js`. Rather than letting the user specify the output bundle name, we generate it, but make sure to include the content hash in it. Whenever possible, we want to leverage convention to make good choices for the user, especially in cases where it’s easy to misconfigure something.

### Heuristics

Normally, `npm start` runs on port `3000`, and this is not explicitly configurable. However, some environments like cloud IDEs want the programs to run on a specific port to serve their output. We want to play well with different environments, so Create React App reads `PORT` environment variable and prefers it when it is specified. The trick is that we know cloud IDEs already specify it automatically, so there is no need for the user to do anything. Create React App relies on heuristics to do the right thing depending on environment.

<!--alex disable just-->

Another example of this is how `npm test` normally launches the watcher, but if the `CI` environment variable is set, it will run tests once. We know that popular CI environments set this variable, so the user doesn’t need to do anything. It just works.

### Interactivity

We prefer to add interactivity to the command line interface rather than add configuration flags. For example, `npm start` will attempt to run with port `3000` by default, but it may be busy. Many other tools fail in this case and ask that you pass a different port, but Create React App will display a prompt asking if you’d like to run the app on the next available port.

Another example of interactivity is `npm test` watcher interface. Instead of asking people to pass command line flags for switching between test runner modes or search patterns, we print a hint with keys that you can press during the test session to instruct watcher what to do. Jest supports both flags and interactive CLI but Create React App prefers long-running sessions to keep user immersed in the flow over short-running sessions with different flags.

### Breaking the Rules

No rules are perfect. Sometimes we may introduce flags or configuration if we believe the value is high enough to justify the complexity. For example, we know that apps may be hosted paths different from the root, and we need to support this use case. However, we still try to fall back to heuristics when possible. In this example, we ask that you specify `homepage` in `package.json`, and infer the correct path based on it. We also nudge the user to fill out the `homepage` after the build, so the user becomes aware that the feature exists.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Create React App. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

## Folder Structure of Create React App

`create-react-app` is a monorepo, meaning it is divided into independent sub-packages.<br>
These packages can be found in the [`packages/`](https://github.com/facebook/create-react-app/tree/main/packages) directory.

### Overview of directory structure

```
packages/
  babel-plugin-named-asset-import/
  babel-preset-react-app/
  confusing-browser-globals/
  cra-template/
  cra-template-typescript/
  create-react-app/
  eslint-config-react-app/
  react-app-polyfill/
  react-dev-utils/
  react-error-overlay/
  react-scripts/
```

### Package Descriptions

#### [babel-preset-react-app](https://github.com/facebook/create-react-app/tree/main/packages/babel-preset-react-app)

This package is a babel preset intended to be used with `react-scripts`.<br>
It targets platforms that React is designed to support (IE 11+) and enables experimental features used heavily at Facebook.<br>
This package is enabled by default for all `create-react-app` scaffolded applications.

#### [create-react-app](https://github.com/facebook/create-react-app/tree/main/packages/create-react-app)

The global CLI command code can be found in this directory, and shouldn't often be changed. It should run on Node 0.10+.

#### [eslint-config-react-app](https://github.com/facebook/create-react-app/tree/main/packages/eslint-config-react-app)

This package contains a conservative set of rules focused on making errors apparent and enforces no style rules.<br>
This package is enabled by default for all `create-react-app` scaffolded applications.

#### [react-dev-utils](https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils)

This package contains utilities used for `react-scripts` and sibling packages.<br>
Its main purpose is to conceal code which the user shouldn't be burdened with upon ejecting.

#### [react-scripts](https://github.com/facebook/create-react-app/tree/main/packages/react-scripts)

This package is the heart of the project, which contains the scripts for setting up the development server, building production builds, configuring all software used, etc.<br>
All functionality must be retained (and configuration given to the user) if they choose to eject.

## Setting Up a Local Copy

You will need `npm@7` and `yarn@1` in order to bootstrap and test a local copy of this repo.

1. Clone the repo with `git clone https://github.com/facebook/create-react-app`

2. Run `npm install` in the root `create-react-app` folder.

Once it is done, you can modify any file locally and run `npm start`, `npm test` or `npm run build` like you can in a generated project. It will serve the application from the files located in `packages/cra-template/template`.

If you want to try out the end-to-end flow with the global CLI, you can do this too:

```sh
npx create-react-app my-app
cd my-app
```

and then run `npm start` or `npm run build`.

## Contributing to E2E (end to end) tests

**TL;DR** use the command `npm run e2e:docker` to run unit and e2e tests.

More detailed information are in the dedicated [README](/test/README.md).

### CI testing with private packages

**create-react-app** relies on main registry to fetch all dependencies, but, if you are in the need to usage of custom private packages that need to be fetch while running E2E test you might need a different configuration.

#### Customizing E2E registry configuration

We use [verdaccio](https://github.com/verdaccio/verdaccio) to emulate packages publishing in a registry using a default configuration. You might modify the current behaviour by editing the file `task/verdaccio.yaml`.

For more information about the configuration check out the [Verdaccio documentation](https://verdaccio.org/docs/en/configuration).

## Tips for contributors using Windows

The scripts in tasks folder and other scripts in `package.json` will not work in Windows out of the box. However, using [Bash on windows](https://msdn.microsoft.com/en-us/commandline/wsl/about) makes it easier to use those scripts without any workarounds. The steps to do so are detailed below:

### Install Bash on Ubuntu on Windows

A good step by step guide can be found [here](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/)

### Install Node.js and yarn

Even if you have node and yarn installed on your windows, it would not be accessible from the bash shell. You would have to install it again. Installing via [`nvm`](https://github.com/creationix/nvm#install-script) is recommended.

### Line endings

By default git would use `CRLF` line endings which would cause the scripts to fail. You can change it for this repo only by setting `autocrlf` to false by running `git config core.autocrlf false`. You can also enable it for all your repos by using the `--global` flag if you wish to do so.

## Cutting a Release

1. Tag all merged pull requests that go into the release with the relevant milestone. Each merged PR should also be labeled with one of the [labels](https://github.com/facebook/create-react-app/labels) named `tag: ...` to indicate what kind of change it is. **Make sure all breaking changes are correctly labelled with `tag: breaking change`.**
2. Close the milestone and create a new one for the next release.
3. In most releases, only `react-scripts` needs to be released. If you don’t have any changes to the `packages/create-react-app` folder, you don’t need to bump its version or publish it (the publish script will publish only changed packages).
4. Note that files in `packages/create-react-app` should be modified with extreme caution. Since it’s a global CLI, any version of `create-react-app` (global CLI) including very old ones should work with the latest version of `react-scripts`.
5. Pull the latest changes from GitHub, run `npm ci`.
6. Create a change log entry for the release:

- You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/). Save it to this environment variable: `export GITHUB_AUTH="..."`
- Run `npm run changelog`. The command will find all the labeled pull requests merged since the last release and group them by the label and affected packages, and create a change log entry with all the changes and links to PRs and their authors. Copy and paste it to `CHANGELOG.md`.
- Add a four-space indented paragraph after each non-trivial list item, explaining what changed and why. For each breaking change also write who it affects and instructions for migrating existing code.
- Maybe add some newlines here and there. Preview the result on GitHub to get a feel for it. Changelog generator output is a bit too terse for my taste, so try to make it visually pleasing and well grouped.

7. Make sure to include “Migrating from ...” instructions for the previous release. Often you can copy and paste them.
8. Run `npm run publish`. (It has to be `npm run publish` exactly, not `npm publish` or `yarn publish`.)
9. Wait for a long time, and it will get published. Don’t worry that it’s stuck. In the end the publish script will prompt for versions before publishing the packages.
10. After publishing, create a GitHub Release with the same text as the changelog entry. See previous Releases for inspiration.

Make sure to test the released version! If you want to be extra careful, you can publish a prerelease by running `npm run publish -- --canary --exact --preid next --dist-tag=next --force-publish=* minor` instead of `npm run publish`.

## Releasing the Docs

1. Go to the `docusaurus/website` directory
2. Run `npm ci`
3. Run `npm run build`
4. You'll need an [access token for the GitHub API](https://help.github.com/articles/creating-an-access-token-for-command-line-use/). Save it to this environment variable: `export GITHUB_AUTH="..."`
5. Run `GIT_USER=<GITHUB_USERNAME> CURRENT_BRANCH=main USE_SSH=true npm run deploy`

---

_Many thanks to [h5bp](https://github.com/h5bp/html5-boilerplate/blob/master/.github/CONTRIBUTING.md) for the inspiration with this contributing guide_
```

--------------------------------------------------------------------------------

---[FILE: lerna.json]---
Location: create-react-app-main/lerna.json
Signals: React

```json
{
  "lerna": "2.6.0",
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "independent",
  "changelog": {
    "repo": "facebook/create-react-app",
    "labels": {
      "tag: new feature": ":rocket: New Feature",
      "tag: breaking change": ":boom: Breaking Change",
      "tag: bug fix": ":bug: Bug Fix",
      "tag: enhancement": ":nail_care: Enhancement",
      "tag: documentation": ":memo: Documentation",
      "tag: internal": ":house: Internal",
      "tag: underlying tools": ":hammer: Underlying Tools"
    },
    "cacheDir": ".changelog"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: create-react-app-main/LICENSE

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

---[FILE: netlify.toml]---
Location: create-react-app-main/netlify.toml

```toml
[build]
  base    = "docusaurus/website"
  publish = "docusaurus/website/build"
  command = "npm run build"
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: create-react-app-main/package.json
Signals: React, Docker

```json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "docusaurus/website"
  ],
  "scripts": {
    "build": "cd packages/react-scripts && node bin/react-scripts.js build",
    "changelog": "lerna-changelog",
    "create-react-app": "node tasks/cra.js",
    "e2e": "tasks/e2e-simple.sh",
    "e2e:docker": "tasks/local-test.sh",
    "postinstall": "npm run build:prod -w react-error-overlay",
    "publish": "tasks/publish.sh",
    "start": "cd packages/react-scripts && node bin/react-scripts.js start",
    "screencast": "node ./tasks/screencast.js",
    "screencast:error": "svg-term --cast jyu19xGl88FQ3poMY8Hbmfw8y --out screencast-error.svg --window --at 12000 --no-cursor",
    "alex": "alex .",
    "test:integration": "jest test/integration",
    "test": "cd packages/react-scripts && node bin/react-scripts.js test",
    "eslint": "eslint .",
    "prettier": "prettier .",
    "format": "npm run prettier -- --write"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.15.1",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "alex": "^8.2.0",
    "eslint": "^8.3.0",
    "execa": "^5.1.1",
    "fs-extra": "^10.0.0",
    "get-port": "^5.1.1",
    "globby": "^11.0.4",
    "husky": "^4.3.8",
    "jest": "^27.4.3",
    "lerna": "^4.0.0",
    "lerna-changelog": "^2.2.0",
    "lint-staged": "^12.1.2",
    "meow": "^9.0.0",
    "multimatch": "^5.0.0",
    "prettier": "^2.5.0",
    "puppeteer": "^12.0.1",
    "strip-ansi": "^6.0.1",
    "svg-term-cli": "^2.1.1",
    "tempy": "^1.0.1",
    "wait-for-localhost": "^3.3.0",
    "web-vitals": "^2.1.2"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,json,yml,yaml,css,scss,ts,tsx,md}": [
      "prettier --write"
    ]
  }
}
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 3
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 3 of 97)

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

---[FILE: pnpm-workspace.yaml]---
Location: grapesjs-dev/pnpm-workspace.yaml

```yaml
packages:
  - 'packages/cli'
  - 'packages/core'
  - 'docs/'
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: grapesjs-dev/README.md

```text
./packages/core/README.md
```

--------------------------------------------------------------------------------

---[FILE: dependabot.yml]---
Location: grapesjs-dev/.github/dependabot.yml

```yaml
version: 2

updates:
  - package-ecosystem: 'npm'
    directory: '/'
    open-pull-requests-limit: 0
    schedule:
      interval: 'weekly'
```

--------------------------------------------------------------------------------

---[FILE: FUNDING.yml]---
Location: grapesjs-dev/.github/FUNDING.yml

```yaml
# Shows a funding button via Open Collective

open_collective: grapesjs
```

--------------------------------------------------------------------------------

---[FILE: lock.yml]---
Location: grapesjs-dev/.github/lock.yml

```yaml
# Configuration for Lock Threads - https://github.com/dessant/lock-threads

# Number of days of inactivity before a closed issue or pull request is locked
daysUntilLock: 365

# Skip issues and pull requests created before a given timestamp. Timestamp must
# follow ISO 8601 (`YYYY-MM-DD`). Set to `false` to disable
skipCreatedBefore: false

# Issues and pull requests with these labels will be ignored. Set to `[]` to disable
exemptLabels:
  - no-locking
  - help-wanted

# Label to add before locking, such as `outdated`. Set to `false` to disable
lockLabel: outdated

# Comment to post before locking. Set to `false` to disable
lockComment: >
  This thread has been automatically locked since there has not been
  any recent activity after it was closed. Please open a new issue for
  related bugs.

# Assign `resolved` as the reason for locking. Set to `false` to disable
setLockReason: true
# Limit to only `issues` or `pulls`
# only: issues

# Optionally, specify configuration settings just for `issues` or `pulls`
# issues:
#   exemptLabels:
#     - help-wanted
#   lockLabel: outdated

# pulls:
#   daysUntilLock: 30

# Repository to extend settings from
# _extends: repo
```

--------------------------------------------------------------------------------

---[FILE: no-response.yml]---
Location: grapesjs-dev/.github/no-response.yml

```yaml
# Configuration for probot-no-response - https://github.com/probot/no-response

# Number of days of inactivity before an Issue is closed for lack of response
daysUntilClose: 10
# Label requiring a response
responseRequiredLabel: more-information-needed
# Comment to post when closing an Issue for lack of response. Set to `false` to disable
closeComment: >
  This issue has been automatically closed because there has been no response
  to our request for more information from the original author. With only the
  information that is currently in the issue, we don't have enough information
  to take action. Please reach out if you have or find the answers we need so
  that we can investigate further.
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: grapesjs-dev/.github/actions/setup-project/action.yml

```yaml
name: Setup Project
description: 'Sets up the project by installing dependencies and building the project.'

inputs:
  pnpm-version:
    description: 'The version of pnpm to use for installing dependencies.'
    required: false
    default: 9.10.0
  node-version:
    description: 'The version of Node.js to use for building the project.'
    required: false
    default: '20.16.0'

runs:
  using: composite
  steps:
    - uses: pnpm/action-setup@v4
      with:
        version: ${{ inputs.pnpm-version }}
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'pnpm'
    - name: Install dependencies
      run: pnpm install
      shell: bash
    - name: Build project
      run: pnpm build
      shell: bash
```

--------------------------------------------------------------------------------

---[FILE: 1.bug_report.yml]---
Location: grapesjs-dev/.github/ISSUE_TEMPLATE/1.bug_report.yml

```yaml
name: 🐞 Bug report
description: Create a bug report for GrapesJS.
title: 'BUG: '
labels: []
body:
  - type: markdown
    attributes:
      value: |
        In order to understand and fix the issue, we ask you to fill correctly all the statements/questions.
        **If you don't indicate a reproducible demo with relative steps to reproduce the bug, the issue might be CLOSED.**
        Note: before creating a bug issue, search in GitHub Issues to check if a similar bug was already reported.
        Optional: You can incentivize the resolution of the issue by funding it on [IssueHunt](https://issuehunt.io/r/artf/grapesjs).
  - type: checkboxes
    attributes:
      label: GrapesJS version
      description: |
        As the bug you're facing might be already fixed, we ask you to ensure to use the latest version available [![npm](https://img.shields.io/npm/v/grapesjs.svg)](https://www.npmjs.com/package/grapesjs).
      options:
        - label: I confirm to use the latest version of GrapesJS
          required: true
  - type: input
    attributes:
      label: What browser are you using?
      placeholder: ex. Chrome v91
    validations:
      required: true
  - type: input
    attributes:
      label: Reproducible demo link
      description: |
        Use one of these starter templates to create your demo: [JSFiddle](https://jsfiddle.net/szLp8h4n) - [CodeSandbox](https://codesandbox.io/s/1r0w2pk1vl).
        You can also indicate one of our offical demos if the bug is reproducible there.
    validations:
      required: true
  - type: textarea
    attributes:
      label: Describe the bug
      description: |
        Indicate, step by step, how to reproduce the bug, what is the expected behavior and which is the current one.
        If you're also able to create a video of the issue, that would be extremely helpful.
      value: |
        **How to reproduce the bug?**
        1. ...
        2. ...

        **What is the expected behavior?**
        ...

        **What is the current behavior?**
        ...

        If is necessary to execute some code in order to reproduce the bug, paste it here below:
        ```js
        // your code here
        ```
    validations:
      required: true
  - type: checkboxes
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](https://github.com/artf/grapesjs/blob/dev/CODE_OF_CONDUCT.md)
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: grapesjs-dev/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
contact_links:
  - name: 🚀 Feature Request
    url: https://github.com/artf/grapesjs/discussions/new?category=ideas
    about: 'Suggest any ideas you have using our discussion forums.'
  - name: 🙏 Help
    url: https://github.com/artf/grapesjs/discussions/new?category=q-a
    about: 'If you have a question or need help, ask a question on the discussion forums.'
  - name: 📢 Show and tell
    url: https://github.com/artf/grapesjs/discussions/new?category=show-and-tell
    about: "Have something nice to say or share about GrapesJS? We'd love to hear it!"
```

--------------------------------------------------------------------------------

---[FILE: publish-cli.yml]---
Location: grapesjs-dev/.github/workflows/publish-cli.yml

```yaml
name: Publish GrapesJS CLI
on:
  push:
    branches: [dev]
    paths:
      - 'packages/cli/**'

jobs:
  publish:
    if: "contains(github.event.head_commit.message, 'Release GrapesJS cli:')"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: Publish Core
        run: pnpm publish --access public
        working-directory: ./packages/cli
```

--------------------------------------------------------------------------------

---[FILE: publish-core-latest.yml]---
Location: grapesjs-dev/.github/workflows/publish-core-latest.yml

```yaml
name: Publish GrapesJS core latest
on:
  push:
    branches: [dev]
    paths:
      - 'packages/core/**'

jobs:
  publish:
    if: "contains(github.event.head_commit.message, 'Release GrapesJS core latest:')"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: Build cli
        run: pnpm run build:cli
      - name: Build core
        run: pnpm run build:core
      - name: Check core TS
        run: pnpm run ts:check
      - name: Publish to npm
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ./packages/core/.npmrc
          pnpm publish:core:latest
```

--------------------------------------------------------------------------------

---[FILE: publish-core-rc.yml]---
Location: grapesjs-dev/.github/workflows/publish-core-rc.yml

```yaml
name: Publish GrapesJS core rc
on:
  push:
    branches: [dev]
    paths:
      - 'packages/core/**'

jobs:
  publish:
    if: "contains(github.event.head_commit.message, 'Release GrapesJS core rc:')"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: Build cli
        run: pnpm run build:cli
      - name: Build core
        run: pnpm run build:core
      - name: Check core TS
        run: pnpm run ts:check
      - name: Publish to npm
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          echo "//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}" >> ./packages/core/.npmrc
          pnpm publish:core:rc
```

--------------------------------------------------------------------------------

---[FILE: publish-docs.yml]---
Location: grapesjs-dev/.github/workflows/publish-docs.yml

```yaml
name: Publish GrapesJS Docs

on:
  push:
    branches: [dev]
    paths:
      - 'docs/**'

jobs:
  publish-docs:
    runs-on: ubuntu-latest
    if: "startsWith(github.event.head_commit.message, 'Release GrapesJS docs:')"
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: Setup Git
        run: |
          git config --global user.name 'GrapesJSBot'
          git config --global user.email 'services@grapesjs.com'
      - name: Build and Deploy Docs
        env:
          GRAPESJS_BOT_TOKEN: ${{ secrets.GRAPESJS_BOT_TOKEN }}
        working-directory: ./docs
        run: |
          # abort on errors
          set -e
          # navigate into the build output directory
          cd .vuepress/dist

          # Need to deploy all the documentation inside docs folder
          mkdir docs-new

          # move all the files from the current directory in docs
          mv `ls -1 ./ | grep -v docs-new` ./docs-new

          # fetch the current site, remove the old docs dir and make current the new one
          git clone -b main https://github.com/GrapesJS/website.git tmp
          mv tmp/[^.]* . # Move all non-hidden files
          mv tmp/.[^.]* . 2>/dev/null || true # Move hidden files, ignore errors if none exist
          rm -rf tmp
          rm -fR public/docs
          mv ./docs-new ./public/docs

          # stage all and commit
          git add -A
          git commit -m 'deploy docs'

          # Push using PAT
          git push https://$GRAPESJS_BOT_TOKEN@github.com/GrapesJS/website.git main

          cd -
```

--------------------------------------------------------------------------------

---[FILE: publish.yml]---
Location: grapesjs-dev/.github/workflows/publish.yml

```yaml
name: Publish package

on:
  release:
    types: [created]

jobs:
  publish:
    if: ${{ false }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
          cache: 'yarn'
      - run: yarn --frozen-lockfile
      - run: yarn build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

--------------------------------------------------------------------------------

---[FILE: quality.yml]---
Location: grapesjs-dev/.github/workflows/quality.yml

```yaml
name: GrapesJS Qualty Checks
on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: TS Check
        run: pnpm ts:check
      - name: Lint
        run: pnpm lint
      - name: Format Check
        run: pnpm format:check
      - name: Docs
        run: pnpm docs:api
```

--------------------------------------------------------------------------------

---[FILE: test.yml]---
Location: grapesjs-dev/.github/workflows/test.yml

```yaml
name: GrapesJS Tests
on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]

jobs:
  test-core:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: Core Tests
        run: pnpm test
        working-directory: ./packages/core
  test-cli:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
      - name: CLI Tests
        run: pnpm test
        working-directory: ./packages/cli
```

--------------------------------------------------------------------------------

---[FILE: api.mjs]---
Location: grapesjs-dev/docs/api.mjs

```text
// This script uses documentation to generate API Reference files
import { join, basename, dirname } from 'path';
import { build, formats } from 'documentation';
import { fileURLToPath } from 'url';
import { existsSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docRoot = __dirname;
const srcRoot = join(docRoot, '../packages/core/src');
const START_EVENTS = '{START\\_EVENTS}';
const END_EVENTS = '{END\\_EVENTS}';
const REPLACE_EVENTS = '{REPLACE\\_EVENTS}';

const log = (...args) => console.log(...args);

const getEventsMdFromTypes = async (filePath) => {
  const dirname = filePath.replace(basename(filePath), '');
  const typesFilePath = `${dirname}types.ts`;

  if (existsSync(typesFilePath)) {
    const resTypes = await build([typesFilePath], { shallow: true }).then((cm) =>
      formats.md(cm /*{ markdownToc: true }*/),
    );
    const indexFrom = resTypes.indexOf(START_EVENTS) + START_EVENTS.length;
    const indexTo = resTypes.indexOf(END_EVENTS);
    // console.log(`${resTypes}`)
    const result = resTypes
      .substring(indexFrom, indexTo)
      .replace(/\n### Examples\n/gi, '')
      .replace(/\n## types\n/gi, '')
      .replace(/## /gi, '* ')
      .replace(/\\`/gi, '`')
      .replace(/##/gi, '')
      .replace(/\\\[/gi, '[')
      .replace(/\]\\\(/gi, '](')
      .trim();

    return result;
  }

  return '';
};

async function generateDocs() {
  log('Start API Reference generation...');

  await Promise.all(
    [
      ['editor/index.ts', 'editor.md'],
      ['asset_manager/index.ts', 'assets.md'],
      ['asset_manager/model/Asset.ts', 'asset.md'],
      ['block_manager/index.ts', 'block_manager.md'],
      ['block_manager/model/Block.ts', 'block.md'],
      ['commands/index.ts', 'commands.md'],
      ['dom_components/index.ts', 'components.md'],
      ['dom_components/model/Component.ts', 'component.md'],
      ['panels/index.ts', 'panels.md'],
      ['style_manager/index.ts', 'style_manager.md'],
      ['style_manager/model/Sector.ts', 'sector.md'],
      ['style_manager/model/Property.ts', 'property.md'],
      ['style_manager/model/PropertyNumber.ts', 'property_number.md'],
      ['style_manager/model/PropertySelect.ts', 'property_select.md'],
      ['style_manager/model/PropertyComposite.ts', 'property_composite.md'],
      ['style_manager/model/PropertyStack.ts', 'property_stack.md'],
      ['style_manager/model/Layer.ts', 'layer.md'],
      ['storage_manager/index.ts', 'storage_manager.md'],
      ['trait_manager/index.ts', 'trait_manager.md'],
      ['trait_manager/model/Trait.ts', 'trait.md'],
      ['device_manager/index.ts', 'device_manager.md'],
      ['device_manager/model/Device.ts', 'device.md'],
      ['selector_manager/index.ts', 'selector_manager.md'],
      ['selector_manager/model/Selector.ts', 'selector.md'],
      ['selector_manager/model/State.ts', 'state.md'],
      ['css_composer/index.ts', 'css_composer.md'],
      ['css_composer/model/CssRule.ts', 'css_rule.md'],
      ['modal_dialog/index.ts', 'modal_dialog.md'],
      ['rich_text_editor/index.ts', 'rich_text_editor.md'],
      ['keymaps/index.ts', 'keymaps.md'],
      ['undo_manager/index.ts', 'undo_manager.md'],
      ['canvas/index.ts', 'canvas.md'],
      ['canvas/model/Frame.ts', 'frame.md'],
      ['canvas/model/CanvasSpot.ts', 'canvas_spot.md'],
      ['i18n/index.ts', 'i18n.md'],
      ['navigator/index.ts', 'layer_manager.md'],
      ['pages/index.ts', 'pages.md'],
      ['pages/model/Page.ts', 'page.md'],
      ['parser/index.ts', 'parser.md'],
      ['data_sources/index.ts', 'datasources.md'],
      ['data_sources/model/DataSource.ts', 'datasource.md'],
      ['data_sources/model/DataRecord.ts', 'datarecord.md'],
    ].map(async (file) => {
      const filePath = `${srcRoot}/${file[0]}`;

      if (!existsSync(filePath)) {
        throw `File not found '${filePath}'`;
      }

      try {
        return build([filePath], { shallow: true })
          .then((cm) => formats.md(cm /*{ markdownToc: true }*/))
          .then(async (output) => {
            let addLogs = [];
            let result = output
              .replace(/\*\*\\\[/g, '**[')
              .replace(/\*\*\(\\\[/g, '**([')
              .replace(/<\\\[/g, '<[')
              .replace(/<\(\\\[/g, '<([')
              .replace(/\| \\\[/g, '| [')
              .replace(/\\n```js/g, '```js')
              .replace(/docsjs\./g, '')
              .replace('**Extends ModuleModel**', '')
              .replace('**Extends Model**', '');

            // Search for module event documentation
            if (result.indexOf(REPLACE_EVENTS) >= 0) {
              try {
                const eventsMd = await getEventsMdFromTypes(filePath);
                if (eventsMd && result.indexOf(REPLACE_EVENTS) >= 0) {
                  addLogs.push('replaced events');
                }
                result = eventsMd ? result.replace(REPLACE_EVENTS, `## Available Events\n${eventsMd}`) : result;
              } catch (err) {
                console.error(`Failed getting events: ${file[0]}`);
                throw err;
              }
            }

            writeFileSync(`${docRoot}/api/${file[1]}`, result);
            log('Created', file[1], addLogs.length ? `(${addLogs.join(', ')})` : '');
          });
      } catch (err) {
        console.error(`Build failed: ${file[0]}`);
        throw err;
      }
    }),
  );

  log('API Reference generation done!');
}

generateDocs().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

--------------------------------------------------------------------------------

---[FILE: faq.md]---
Location: grapesjs-dev/docs/faq.md

```text
---
title: Faq
---

# FAQ

Coming soon
```

--------------------------------------------------------------------------------

````

---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 11
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 11 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: action.yml]---
Location: payload-main/.github/actions/setup/action.yml

```yaml
name: Setup node and pnpm
description: |
  Configures Node, pnpm, cache, performs pnpm install

inputs:
  node-version:
    description: Node.js version override
  pnpm-version:
    description: Pnpm version override
  pnpm-run-install:
    description: Whether to run pnpm install
    default: true
  pnpm-restore-cache:
    description: Whether to restore cache
    default: true
  pnpm-install-cache-key:
    description: The cache key override for the pnpm install cache

outputs:
  pnpm-store-path:
    description: The resolved pnpm store path
  pnpm-install-cache-key:
    description: The cache key used for pnpm install cache

runs:
  using: composite
  steps:
    # https://github.com/actions/virtual-environments/issues/1187
    - name: tune linux network
      shell: bash
      run: sudo ethtool -K eth0 tx off rx off

    - name: Get versions from .tool-versions or use overrides
      shell: bash
      run: |
        # if node-version input is provided, use it; otherwise, read from .tool-versions
        if [ "${{ inputs.node-version }}" ]; then
          echo "Node version override provided: ${{ inputs.node-version }}"
          echo "NODE_VERSION=${{ inputs.node-version }}" >> $GITHUB_ENV
        elif [ -f .tool-versions ]; then
          NODE_VERSION=$(grep '^nodejs ' .tool-versions | awk '{print $2}')
          echo "NODE_VERSION=$NODE_VERSION" >> $GITHUB_ENV
          echo "Node version resolved to: $NODE_VERSION"
        else
          echo "No .tool-versions file found and no node-version input provided. Invalid configuration."
          exit 1
        fi

        # if pnpm-version input is provided, use it; otherwise, read from .tool-versions
        if [ "${{ inputs.pnpm-version }}" ]; then
          echo "Pnpm version override provided: ${{ inputs.pnpm-version }}"
          echo "PNPM_VERSION=${{ inputs.pnpm-version }}" >> $GITHUB_ENV
        elif [ -f .tool-versions ]; then
          PNPM_VERSION=$(grep '^pnpm ' .tool-versions | awk '{print $2}')
          echo "PNPM_VERSION=$PNPM_VERSION" >> $GITHUB_ENV
          echo "Pnpm version resolved to: $PNPM_VERSION"
        else
          echo "No .tool-versions file found and no pnpm-version input provided. Invalid configuration."
          exit 1
        fi

    - name: Setup Node@${{ inputs.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}

    - name: Install pnpm
      uses: pnpm/action-setup@v4
      with:
        version: ${{ env.PNPM_VERSION }}
        run_install: false

    - name: Get pnpm store path
      shell: bash
      run: |
        STORE_PATH=$(pnpm store path --silent)
        echo "STORE_PATH=$STORE_PATH" >> $GITHUB_ENV
        echo "Pnpm store path resolved to: $STORE_PATH"

    - name: Compute Cache Key
      shell: bash
      run: |
        if [ -n "${{ inputs.pnpm-install-cache-key }}" ]; then
          PNPM_INSTALL_CACHE_KEY="${{ inputs.pnpm-install-cache-key }}"
        else
          PNPM_INSTALL_CACHE_KEY="pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}"
        fi
        echo "Computed PNPM_INSTALL_CACHE_KEY: $PNPM_INSTALL_CACHE_KEY"
        echo "PNPM_INSTALL_CACHE_KEY=$PNPM_INSTALL_CACHE_KEY" >> $GITHUB_ENV

    - name: Restore pnpm install cache
      if: ${{ inputs.pnpm-restore-cache == 'true' }}
      uses: actions/cache@v4
      with:
        path: ${{ env.STORE_PATH }}
        key: ${{ env.PNPM_INSTALL_CACHE_KEY }}
        restore-keys: |
          pnpm-store-${{ env.PNPM_VERSION }}-
          pnpm-store-

    - name: Run pnpm install
      if: ${{ inputs.pnpm-run-install == 'true' }}
      shell: bash
      run: pnpm install

      # Set the cache key output
    - run: |
        echo "pnpm-install-cache-key=${{ env.PNPM_INSTALL_CACHE_KEY }}" >> $GITHUB_OUTPUT
      shell: bash
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: payload-main/.github/actions/triage/action.yml

```yaml
name: Triage
description: Initial triage for issues

inputs:
  reproduction-comment:
    description: 'Either a string or a path to a .md file inside the repository. Example: ".github/invalid-reproduction.md"'
    default: '.github/invalid-reproduction.md'
  reproduction-hosts:
    description: 'Comma-separated list of hostnames that are allowed for reproductions. Example: "github.com,codesandbox.io"'
    default: github.com
  reproduction-invalid-label:
    description: 'Label to apply to issues without a valid reproduction. Example: "invalid-reproduction"'
    default: 'invalid-reproduction'
  reproduction-issue-labels:
    description: 'Comma-separated list of issue labels. If configured, only verify reproduction URLs of issues with one of these labels present. Adding a comma at the end will handle non-labeled issues as invalid. Example: "bug,", will consider issues with the label "bug" or no label.'
    default: ''
  reproduction-link-section:
    description: 'A regular expression string with "(.*)" matching a valid URL in the issue body. The result is trimmed. Example: "### Link to reproduction(.*)### To reproduce"'
    default: '### Link to reproduction(.*)### To reproduce'
  actions-to-perform:
    description: 'Comma-separated list of actions to perform on the issue. Example: "tag,comment,close"'
    default: 'tag,comment,close'
  area-label-section:
    description: 'Regex to extract area labels from issue body. First capture group should contain comma-separated values.'
    default: ''
  area-label-skip:
    description: 'Comma-separated values to skip (not apply as labels). Example: "Not sure"'
    default: ''

runs:
  using: 'composite'
  steps:
    - name: Checkout code
      if: ${{ github.event_name != 'pull_request' }}
      uses: actions/checkout@v5
    - name: Run action
      run: node ${{ github.action_path }}/dist/index.js
      shell: sh
      # https://github.com/actions/runner/issues/665#issuecomment-676581170
      env:
        'INPUT_REPRODUCTION_COMMENT': ${{inputs.reproduction-comment}}
        'INPUT_REPRODUCTION_HOSTS': ${{inputs.reproduction-hosts}}
        'INPUT_REPRODUCTION_INVALID_LABEL': ${{inputs.reproduction-invalid-label}}
        'INPUT_REPRODUCTION_ISSUE_LABELS': ${{inputs.reproduction-issue-labels}}
        'INPUT_REPRODUCTION_LINK_SECTION': ${{inputs.reproduction-link-section}}
        'INPUT_ACTIONS_TO_PERFORM': ${{inputs.actions-to-perform}}
        'INPUT_AREA_LABEL_SECTION': ${{inputs.area-label-section}}
        'INPUT_AREA_LABEL_SKIP': ${{inputs.area-label-skip}}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/.github/actions/triage/jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/.github/actions/triage/LICENSE

```text
MIT License

Copyright (c) 2024 Payload <info@payloadcms.com>. All modification and additions are copyright of Payload.

---

Original license:
ISC License

Copyright (c) 2023, Balázs Orbán

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/.github/actions/triage/package.json

```json
{
  "name": "triage",
  "version": "0.0.0",
  "private": true,
  "description": "GitHub Action to triage new issues",
  "license": "MIT",
  "main": "dist/index.js",
  "scripts": {
    "build": "pnpm build:typecheck && pnpm build:ncc",
    "build:ncc": "ncc build src/index.ts -t -o dist",
    "build:typecheck": "tsc",
    "clean": "rimraf dist",
    "test": "jest"
  },
  "dependencies": {
    "@actions/core": "^1.3.0",
    "@actions/github": "^5.0.0"
  },
  "devDependencies": {
    "@octokit/webhooks-types": "^7.5.1",
    "@swc/jest": "^0.2.37",
    "@types/jest": "^27.5.2",
    "@types/node": "^20.16.5",
    "@typescript-eslint/eslint-plugin": "^4.33.0",
    "@typescript-eslint/parser": "^4.33.0",
    "@vercel/ncc": "0.38.1",
    "concurrently": "^8.2.2",
    "eslint": "^7.32.0",
    "jest": "^29.7.0",
    "prettier": "^3.3.3",
    "typescript": "^4.9.5"
  }
}
```

--------------------------------------------------------------------------------

````

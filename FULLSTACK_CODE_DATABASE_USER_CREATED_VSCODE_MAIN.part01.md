---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 1
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 1 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .editorconfig]---
Location: vscode-main/.editorconfig

```text
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Tab indentation
[*]
indent_style = tab
trim_trailing_whitespace = true

# The indent size used in the `package.json` file cannot be changed
# https://github.com/npm/npm/pull/3180#issuecomment-16336516
[{*.yml,*.yaml,package.json}]
indent_style = space
indent_size = 2
```

--------------------------------------------------------------------------------

---[FILE: .eslint-ignore]---
Location: vscode-main/.eslint-ignore

```text
**/build/*/**/*.js
**/dist/**/*.js
**/extensions/**/*.d.ts
**/extensions/**/build/**
**/extensions/**/colorize-fixtures/**
**/extensions/css-language-features/server/test/pathCompletionFixtures/**
**/extensions/html-language-features/server/lib/jquery.d.ts
**/extensions/html-language-features/server/src/test/pathCompletionFixtures/**
**/extensions/ipynb/notebook-out/**
**/extensions/markdown-language-features/media/**
**/extensions/markdown-language-features/notebook-out/**
**/extensions/markdown-math/notebook-out/**
**/extensions/mermaid-chat-features/chat-webview-out/**
**/extensions/notebook-renderers/renderer-out/index.js
**/extensions/simple-browser/media/index.js
**/extensions/terminal-suggest/src/completions/upstream/**
**/extensions/terminal-suggest/src/shell/zshBuiltinsCache.ts
**/extensions/terminal-suggest/src/shell/fishBuiltinsCache.ts
**/extensions/terminal-suggest/third_party/**
**/extensions/typescript-language-features/test-workspace/**
**/extensions/typescript-language-features/extension.webpack.config.js
**/extensions/typescript-language-features/extension-browser.webpack.config.js
**/extensions/typescript-language-features/package-manager/node-maintainer/**
**/extensions/vscode-api-tests/testWorkspace/**
**/extensions/vscode-api-tests/testWorkspace2/**
**/fixtures/**
**/node_modules/**
**/out/**
**/out-*/**
**/src/**/dompurify.js
**/src/**/marked.js
**/src/**/semver.js
**/src/typings/**/*.d.ts
**/src/vs/*/**/*.d.ts
**/src/vs/base/test/common/filters.perf.data.js
**/src/vs/loader.js
**/test/unit/assert.js
**/test/automation/out/**
**/typings/**
**/.build/**
!.vscode
```

--------------------------------------------------------------------------------

---[FILE: .git-blame-ignore-revs]---
Location: vscode-main/.git-blame-ignore-revs

```text
# https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revs-fileltfilegt
# https://docs.github.com/en/repositories/working-with-files/using-files/viewing-a-file#ignore-commits-in-the-blame-view

# mjbvz: Fix spacing
13f4f052582bcec3d6c6c6a70d995c9dee2cac13

# mjbvz: Add script to run build with noImplicitOverride
ae1452eea678f5266ef513f22dacebb90955d6c9

# alexdima: Revert "bump version"
537ba0ef1791c090bb18bc68d727816c0451c117

# alexdima: bump version
387a0dcb82df729e316ca2518a9ed81a75482b18

# joaomoreno: add ghooks dev dependency
0dfc06e0f9de5925de792cdf9f0e6597bb25908f

# joaomoreno: line endings
12ab70d329a13dd5b18d892cd40edd7138259bc3

# mjbvz: organize imports
494cbbd02d67e87727ec885f98d19551aa33aad1
a3cb14be7f2cceadb17adf843675b1a59537dbbd
ee1655a82ebdfd38bf8792088a6602c69f7bbd94

# jrieken: new eslint-rule
4a130c40ed876644ed8af2943809d08221375408

# bpasero: ESM migration
6b924c51528e663dda5091a1493229a361676aca
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: vscode-main/.gitattributes

```text
* text=auto

LICENSE.txt eol=crlf
ThirdPartyNotices.txt eol=crlf

*.bat eol=crlf
*.cmd eol=crlf
*.ps1 eol=lf
*.sh eol=lf
*.rtf -text
**/*.json linguist-language=jsonc
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: vscode-main/.gitignore

```text
.DS_Store
.cache
npm-debug.log
Thumbs.db
node_modules/
.build/
.vscode/extensions/**/out/
extensions/**/dist/
/out*/
/extensions/**/out/
build/node_modules
coverage/
test_data/
test-results/
test-results.xml
vscode.lsif
vscode.db
/.profile-oss
/cli/target
/cli/openssl
product.overrides.json
*.snap.actual
*.tsbuildinfo
.vscode-test
vscode-telemetry-docs/
```

--------------------------------------------------------------------------------

---[FILE: .lsifrc.json]---
Location: vscode-main/.lsifrc.json

```json
{
	"project": "src/tsconfig.json",
	"source": "./package.json",
	"package": "package.json",
	"out": "vscode.lsif"
}
```

--------------------------------------------------------------------------------

---[FILE: .mailmap]---
Location: vscode-main/.mailmap

```text
Daniel Imms <daimms@microsoft.com> Daniel Imms <tyriar@tyriar.com>
Raymond Zhao <raymondzhao@microsoft.com>
Tyler Leonhardt <tyleonha@microsoft.com> Tyler Leonhardt <me@tylerleonhardt.com>
João Moreno <joao.moreno@microsoft.com> João Moreno <mail@joaomoreno.com>
```

--------------------------------------------------------------------------------

---[FILE: .mention-bot]---
Location: vscode-main/.mention-bot

```text
{
  "maxReviewers": 2,
  "requiredOrgs": ["Microsoft"],
  "skipAlreadyAssignedPR": true,
  "skipAlreadyMentionedPR": true,
  "skipCollaboratorPR": true
}
```

--------------------------------------------------------------------------------

---[FILE: .npmrc]---
Location: vscode-main/.npmrc

```text
disturl="https://electronjs.org/headers"
target="39.2.7"
ms_build_id="12953945"
runtime="electron"
build_from_source="true"
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: .nvmrc]---
Location: vscode-main/.nvmrc

```text
22.21.1
```

--------------------------------------------------------------------------------

---[FILE: .vscode-test.js]---
Location: vscode-main/.vscode-test.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

import { createRequire } from 'node:module';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as os from 'os';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { defineConfig } = require('@vscode/test-cli');

/**
 * A list of extension folders who have opted into tests, or configuration objects.
 * Edit me to add more!
 *
 * @type {Array<Partial<import("@vscode/test-cli").TestConfiguration> & { label: string }>}
 */
const extensions = [
	{
		label: 'markdown-language-features',
		workspaceFolder: `extensions/markdown-language-features/test-workspace`,
		mocha: { timeout: 60_000 }
	},
	{
		label: 'ipynb',
		workspaceFolder: path.join(os.tmpdir(), `ipynb-${Math.floor(Math.random() * 100000)}`),
		mocha: { timeout: 60_000 }
	},
	{
		label: 'notebook-renderers',
		workspaceFolder: path.join(os.tmpdir(), `nbout-${Math.floor(Math.random() * 100000)}`),
		mocha: { timeout: 60_000 }
	},
	{
		label: 'vscode-colorize-tests',
		workspaceFolder: `extensions/vscode-colorize-tests/test`,
		mocha: { timeout: 60_000 }
	},
	{
		label: 'terminal-suggest',
		workspaceFolder: path.join(os.tmpdir(), `terminal-suggest-${Math.floor(Math.random() * 100000)}`),
		mocha: { timeout: 60_000 }
	},
	{
		label: 'vscode-colorize-perf-tests',
		workspaceFolder: `extensions/vscode-colorize-perf-tests/test`,
		mocha: { timeout: 6000_000 }
	},
	{
		label: 'configuration-editing',
		workspaceFolder: path.join(os.tmpdir(), `confeditout-${Math.floor(Math.random() * 100000)}`),
		mocha: { timeout: 60_000 }
	},
	{
		label: 'github-authentication',
		workspaceFolder: path.join(os.tmpdir(), `msft-auth-${Math.floor(Math.random() * 100000)}`),
		mocha: { timeout: 60_000 }
	},
	{
		label: 'microsoft-authentication',
		mocha: { timeout: 60_000 }
	},
	{
		label: 'vscode-api-tests-folder',
		extensionDevelopmentPath: `extensions/vscode-api-tests`,
		workspaceFolder: `extensions/vscode-api-tests/testWorkspace`,
		mocha: { timeout: 60_000 },
		files: 'extensions/vscode-api-tests/out/singlefolder-tests/**/*.test.js',
	},
	{
		label: 'vscode-api-tests-workspace',
		extensionDevelopmentPath: `extensions/vscode-api-tests`,
		workspaceFolder: `extensions/vscode-api-tests/testworkspace.code-workspace`,
		mocha: { timeout: 60_000 },
		files: 'extensions/vscode-api-tests/out/workspace-tests/**/*.test.js',
	},
	{
		label: 'git-base',
		mocha: { timeout: 60_000 }
	}
];


const defaultLaunchArgs = process.env.API_TESTS_EXTRA_ARGS?.split(' ') || [
	'--disable-telemetry', '--disable-experiments', '--skip-welcome', '--skip-release-notes', `--crash-reporter-directory=${__dirname}/.build/crashes`, `--logsPath=${__dirname}/.build/logs/integration-tests`, '--no-cached-data', '--disable-updates', '--use-inmemory-secretstorage', '--disable-extensions', '--disable-workspace-trust'
];

const config = defineConfig(extensions.map(extension => {
	/** @type {import('@vscode/test-cli').TestConfiguration} */
	const config = {
		platform: 'desktop',
		files: `extensions/${extension.label}/out/**/*.test.js`,
		extensionDevelopmentPath: `extensions/${extension.label}`,
		...extension,
	};

	config.mocha ??= {};
	if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
		let suite = '';
		if (process.env.VSCODE_BROWSER) {
			suite = `${process.env.VSCODE_BROWSER} Browser Integration ${config.label} tests`;
		} else if (process.env.REMOTE_VSCODE) {
			suite = `Remote Integration ${config.label} tests`;
		} else {
			suite = `Integration ${config.label} tests`;
		}

		config.mocha.reporter = 'mocha-multi-reporters';
		config.mocha.reporterOptions = {
			reporterEnabled: 'spec, mocha-junit-reporter',
			mochaJunitReporterReporterOptions: {
				testsuitesTitle: `${suite} ${process.platform}`,
				mochaFile: path.join(
					process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
					`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`
				)
			}
		};
	}

	if (!config.platform || config.platform === 'desktop') {
		config.launchArgs = defaultLaunchArgs;
		config.useInstallation = {
			fromPath: process.env.INTEGRATION_TEST_ELECTRON_PATH || `${__dirname}/scripts/code.${process.platform === 'win32' ? 'bat' : 'sh'}`,
		};
		config.env = {
			...config.env,
			VSCODE_SKIP_PRELAUNCH: '1',
		};
	} else {
		// web configs not supported, yet
	}

	return config;
}));

export default config;
```

--------------------------------------------------------------------------------

---[FILE: AGENTS.md]---
Location: vscode-main/AGENTS.md

```markdown
# VS Code Agents Instructions

This file provides instructions for AI coding agents working with the VS Code codebase.

For detailed project overview, architecture, coding guidelines, and validation steps, see the [Copilot Instructions](.github/copilot-instructions.md).
```

--------------------------------------------------------------------------------

---[FILE: cglicenses.json]---
Location: vscode-main/cglicenses.json

```json
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
// This file overrides licenses only for OSS components which do not appear in `cgmanifest.json`.
// i.e. for OSS components that are detected from `package-lock.json` or `Cargo.lock` files.
//
// DO NOT EDIT THIS FILE UNLESS THE OSS TOOL INDICATES THAT YOU SHOULD.
//
[
	{
		// Reason: The license at https://github.com/aadsm/jschardet/blob/master/LICENSE
		// does not include a clear Copyright statement and does not credit authors.
		"name": "jschardet",
		"prependLicenseText": [
			"Chardet was originally ported from C++ by Mark Pilgrim. It is now maintained",
			" by Dan Blanchard and Ian Cordasco, and was formerly maintained by Erik Rose.",
			" JSChardet was ported from python to JavaScript by António Afonso ",
			" (https://github.com/aadsm/jschardet) and transformed into an npm package by ",
			"Markus Ast (https://github.com/brainafk)"
		]
	},
	{
		// Reason: The license at https://github.com/microsoft/TypeScript/blob/master/LICENSE.txt
		// does not include a clear Copyright statement.
		"name": "typescript",
		"prependLicenseText": [
			"Copyright (c) Microsoft Corporation. All rights reserved."
		]
	},
	{
		"name": "tunnel-agent",
		"prependLicenseText": [
			"Copyright (c) tunnel-agent authors"
		]
	},
	{
		// Reason: The license at https://github.com/rbuckton/reflect-metadata/blob/master/LICENSE
		// does not include a clear Copyright statement (it's in https://github.com/rbuckton/reflect-metadata/blob/master/CopyrightNotice.txt).
		"name": "reflect-metadata",
		"prependLicenseText": [
			"Copyright (c) Microsoft Corporation. All rights reserved."
		]
	},
	{
		// Reason: The license cannot be found by the tool due to access controls on the repository
		"name": "vscode-tas-client",
		"fullLicenseText": [
			"MIT License",
			"Copyright (c) 2020 - present Microsoft Corporation",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: The license cannot be found by the tool due to access controls on the repository
		"name": "tas-client",
		"fullLicenseText": [
			"MIT License",
			"Copyright (c) 2020 - present Microsoft Corporation",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: The license cannot be found by the tool due to access controls on the repository
		"name": "tas-client",
		"fullLicenseText": [
			"MIT License",
			"Copyright (c) 2020 - present Microsoft Corporation",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: Repository lacks license text.
		// https://github.com/tjwebb/fnv-plus/blob/master/package.json declares MIT.
		// https://github.com/tjwebb/fnv-plus/issues/14
		"name": "@enonic/fnv-plus",
		"fullLicenseText": [
			"MIT License",
			"Copyright (c) 2014 - present, Travis Webb <me@traviswebb.com>",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "@vscode/win32-app-container-tokens",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright (c) Microsoft Corporation.",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy",
			"of this software and associated documentation files (the \"Software\"), to deal",
			"in the Software without restriction, including without limitation the rights",
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
			"copies of the Software, and to permit persons to whom the Software is",
			"furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE"
		]
	},
	{
		// Reason: NPM package does not include repository URL https://github.com/microsoft/vscode-deviceid/issues/12
		"name": "@vscode/deviceid",
		"fullLicenseText": [
			"Copyright (c) Microsoft Corporation.",
			"",
			"MIT License",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: Missing license file
		"name": "@tokenizer/token",
		"fullLicenseText": [
			"(The MIT License)",
			"",
			"Copyright (c) 2020 Borewit",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: Missing license file
		"name": "readable-web-to-node-stream",
		"fullLicenseText": [
			"(The MIT License)",
			"",
			"Copyright (c) 2019 Borewit",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: The substack org has been deleted on GH
		"name": "concat-map",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: The substack org has been deleted on GH
		"name": "github-from-package",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: The substack org has been deleted on GH
		"name": "minimist",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		// Reason: repo URI is wrong on crate, pending https://github.com/warp-tech/russh/pull/53
		"name": "russh-cryptovec",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/warp-tech/russh/1da80d0d599b6ee2d257c544c0d6af4f649c9029/LICENSE-2.0.txt"
	},
	{
		// Reason: repo URI is wrong on crate, pending https://github.com/warp-tech/russh/pull/53
		"name": "russh-keys",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/warp-tech/russh/1da80d0d599b6ee2d257c544c0d6af4f649c9029/LICENSE-2.0.txt"
	},
	{
		// Reason: license is in a subdirectory in repo
		"name": "dirs-next",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/xdg-rs/dirs/af4aa39daba0ac68e222962a5aca17360158b7cc/dirs/LICENSE-MIT"
	},
	{
		// Reason: license is in a subdirectory in repo
		"name": "openssl",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/sfackler/rust-openssl/e43eb58540b27a17f8029c397e3edc12bbc9011f/openssl/LICENSE"
	},
	{
		// Reason: license is in a subdirectory in repo
		"name": "openssl-sys",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/sfackler/rust-openssl/e43eb58540b27a17f8029c397e3edc12bbc9011f/openssl-sys/LICENSE-MIT"
	},
	{
		// Reason: Missing license file
		"name": "openssl-macros",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{ // Reason: Missing license file
		"name": "const_format_proc_macros",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/rodrimati1992/const_format_crates/b2207af46bfbd9f1a6bd12dbffd10feeea3d9fd7/LICENSE-ZLIB.md"
	},
	{ // Reason: Missing license file
		"name": "const_format",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/rodrimati1992/const_format_crates/b2207af46bfbd9f1a6bd12dbffd10feeea3d9fd7/LICENSE-ZLIB.md"
	},
	{ // License is MIT/Apache and tool doesn't look in subfolders
		"name": "toml_edit",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/toml-rs/toml/main/crates/toml_edit/LICENSE-MIT"
	},
	{ // License is MIT/Apache and tool doesn't look in subfolders
		"name": "toml_datetime",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/toml-rs/toml/main/crates/toml_datetime/LICENSE-MIT"
	},
	{ // License is MIT/Apache and tool doesn't look in subfolders
		"name": "dirs-sys-next",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/xdg-rs/dirs/master/dirs-sys/LICENSE-MIT"
	},
	{ // License is MIT/Apache and gitlab API doesn't find the project
		"name": "libredox",
		"fullLicenseTextUri": "https://gitlab.redox-os.org/redox-os/libredox/-/raw/master/LICENSE"
	},
	{
		"name": "https-proxy-agent",
		"fullLicenseText": [
			"(The MIT License)",
			"Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "data-uri-to-buffer",
		"fullLicenseText": [
			"(The MIT License)",
			"Copyright (c) 2014 Nathan Rajlich <nathan@tootallnate.net>",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "socks-proxy-agent",
		"fullLicenseText": [
			"(The MIT License)",
			"Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "http-proxy-agent",
		"fullLicenseText": [
			"(The MIT License)",
			"Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "agent-base",
		"fullLicenseText": [
			"(The MIT License)",
			"Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
			"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
			"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "anstyle",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "anstyle-query",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "anstyle-parse",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "anstyle-wincon",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "anstream",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "colorchoice",
		"fullLicenseText": [
			"This software is released under the MIT license:",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of",
			"the Software, and to permit persons to whom the Software is furnished to do so,",
			"subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS",
			"FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR",
			"COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER",
			"IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN",
			"CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
		]
	},
	{
		"name": "cacheable-request",
		"prependLicenseText": [
			"Copyright (c) cacheable-request authors"
		]
	},
	{
		"name": "@vscode/ts-package-manager",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright (c) Microsoft Corporation.",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy",
			"of this software and associated documentation files (the \"Software\"), to deal",
			"in the Software without restriction, including without limitation the rights",
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
			"copies of the Software, and to permit persons to whom the Software is",
			"furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE"
		]
	},
	{
		"name": "vscode-markdown-languageserver",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright (c) Microsoft Corporation.",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy",
			"of this software and associated documentation files (the \"Software\"), to deal",
			"in the Software without restriction, including without limitation the rights",
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
			"copies of the Software, and to permit persons to whom the Software is",
			"furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE"
		]
	},
	{
		// Reason: mono-repo where the individual packages are also dual-licensed under MIT and Apache-2.0
		"name": "system-configuration",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/mullvad/system-configuration-rs/v0.6.0/system-configuration/LICENSE-MIT"
	},
	{
		// Reason: mono-repo where the individual packages are also dual-licensed under MIT and Apache-2.0
		"name": "system-configuration-sys",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/mullvad/system-configuration-rs/v0.6.0/system-configuration-sys/LICENSE-MIT"
	},
	{
		// Reason: License missing from the repository https://github.com/isaacs/chownr/issues/35
		"name": "chownr",
		"fullLicenseText": [
			"The ISC License",
			"Copyright (c) Isaac Z. Schlueter and Contributors",
			"Permission to use, copy, modify, and/or distribute this software for any",
			"purpose with or without fee is hereby granted, provided that the above",
			"copyright notice and this permission notice appear in all copies.",
			"THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES",
			"WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF",
			"MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR",
			"ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES",
			"WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN",
			"ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR",
			"IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE."
		]
	},
	{
		"name": "@azure/msal-node-runtime",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright (c) Microsoft Corporation. All rights reserved.",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy",
			"of this software and associated documentation files (the \"Software\"), to deal",
			"in the Software without restriction, including without limitation the rights",
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
			"copies of the Software, and to permit persons to whom the Software is",
			"furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE"
		]
	},
	{
		"name": "gethostname",
		"fullLicenseTextUri": "https://codeberg.org/swsnr/gethostname.rs/raw/commit/d1a7e1162c20106a1df2cdbba9eb2d5174037b3c/LICENSE"
	},
	{
		// Reason: Unlicense. Does not include a clear Copyright statement
		"name": "robust-predicates",
		"fullLicenseText": [
			"Unlicense",
			"",
			"Copyright (c) mourner. All rights reserved.",
			"",
			"This is free and unencumbered software released into the public domain.",
			"",
			"Anyone is free to copy, modify, publish, use, compile, sell, or",
			"distribute this software, either in source code form or as a compiled",
			"binary, for any purpose, commercial or non-commercial, and by any",
			"means.",
			"",
			"In jurisdictions that recognize copyright laws, the author or authors",
			"of this software dedicate any and all copyright interest in the",
			"software to the public domain. We make this dedication for the benefit",
			"of the public at large and to the detriment of our heirs and",
			"successors. We intend this dedication to be an overt act of",
			"relinquishment in perpetuity of all present and future rights to this",
			"software under copyright law.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,",
			"EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF",
			"MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
			"IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR",
			"OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,",
			"ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR",
			"OTHER DEALINGS IN THE SOFTWARE.",
			"",
			"For more information, please refer to <http://unlicense.org>"
		]
	},
	{
		"name": "@isaacs/balanced-match",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright Isaac Z. Schlueter <i@izs.me>",
			"",
			"Original code Copyright Julian Gruber <julian@juliangruber.com>",
			"",
			"Port to TypeScript Copyright Isaac Z. Schlueter <i@izs.me>",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy of",
			"this software and associated documentation files (the \"Software\"), to deal in",
			"the Software without restriction, including without limitation the rights to",
			"use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies",
			"of the Software, and to permit persons to whom the Software is furnished to do",
			"so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE.",
			""
		]
	},
	{
		"name": "@isaacs/brace-expansion",
		"fullLicenseText": [
			"MIT License",
			"",
			"Copyright (c) 2013 Julian Gruber <julian@juliangruber.com>",
			"",
			"Permission is hereby granted, free of charge, to any person obtaining a copy",
			"of this software and associated documentation files (the \"Software\"), to deal",
			"in the Software without restriction, including without limitation the rights",
			"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
			"copies of the Software, and to permit persons to whom the Software is",
			"furnished to do so, subject to the following conditions:",
			"",
			"The above copyright notice and this permission notice shall be included in all",
			"copies or substantial portions of the Software.",
			"",
			"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
			"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
			"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
			"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
			"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
			"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
			"SOFTWARE.",
			""
		]
	},
	{
		// Reason: mono-repo
		"name": "@jridgewell/gen-mapping",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/jridgewell/sourcemaps/refs/heads/main/packages/gen-mapping/LICENSE"
	},
	{
		// Reason: mono-repo
		"name": "@jridgewell/sourcemap-codec",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/jridgewell/sourcemaps/refs/heads/main/packages/sourcemap-codec/LICENSE"
	},
	{
		// Reason: mono-repo
		"name": "@jridgewell/trace-mapping",
		"fullLicenseTextUri": "https://raw.githubusercontent.com/jridgewell/sourcemaps/refs/heads/main/packages/trace-mapping/LICENSE"
	}
]
```

--------------------------------------------------------------------------------

---[FILE: cgmanifest.json]---
Location: vscode-main/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "chromium",
					"repositoryUrl": "https://chromium.googlesource.com/chromium/src",
					"commitHash": "4d74005947d2522c31942de3d609355124455643"
				}
			},
			"licenseDetail": [
				"BSD License",
				"",
				"Copyright 2015 The Chromium Authors. All rights reserved.",
				"",
				"Redistribution and use in source and binary forms, with or without modification,",
				"are permitted provided that the following conditions are met:",
				"",
				" * Redistributions of source code must retain the above copyright notice, this",
				"   list of conditions and the following disclaimer.",
				"",
				" * Redistributions in binary form must reproduce the above copyright notice,",
				"   this list of conditions and the following disclaimer in the documentation",
				"   and/or other materials provided with the distribution.",
				"",
				" * Neither the name Google Inc. nor the names of its contributors may be used to",
				"   endorse or promote products derived from this software without specific",
				"   prior written permission.",
				"",
				"THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND",
				"ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED",
				"WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE",
				"DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR",
				"ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES",
				"(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;",
				"LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON",
				"ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT",
				"(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS",
				"SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
			],
			"isOnlyProductionDependency": true,
			"version": "142.0.7444.235"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "ffmpeg",
					"repositoryUrl": "https://chromium.googlesource.com/chromium/third_party/ffmpeg",
					"commitHash": "092f84b6141055bfab609b6b2666b724eee2e130"
				}
			},
			"isOnlyProductionDependency": true,
			"license": "LGPL-2.1+",
			"version": "5.1.git",
			"licenseDetail": [
				"      GNU LESSER GENERAL PUBLIC LICENSE",
				"                       Version 2.1, February 1999",
				" Copyright (C) 1991, 1999 Free Software Foundation, Inc.",
				" 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA",
				" Everyone is permitted to copy and distribute verbatim copies",
				" of this license document, but changing it is not allowed.",
				"[This is the first released version of the Lesser GPL.  It also counts",
				" as the successor of the GNU Library Public License, version 2, hence",
				" the version number 2.1.]",
				"                            Preamble",
				"  The licenses for most software are designed to take away your",
				"freedom to share and change it.  By contrast, the GNU General Public",
				"Licenses are intended to guarantee your freedom to share and change",
				"free software--to make sure the software is free for all its users.",
				"  This license, the Lesser General Public License, applies to some",
				"specially designated software packages--typically libraries--of the",
				"Free Software Foundation and other authors who decide to use it.  You",
				"can use it too, but we suggest you first think carefully about whether",
				"this license or the ordinary General Public License is the better",
				"strategy to use in any particular case, based on the explanations below.",
				"  When we speak of free software, we are referring to freedom of use,",
				"not price.  Our General Public Licenses are designed to make sure that",
				"you have the freedom to distribute copies of free software (and charge",
				"for this service if you wish); that you receive source code or can get",
				"it if you want it; that you can change the software and use pieces of",
				"it in new free programs; and that you are informed that you can do",
				"these things.",
				"  To protect your rights, we need to make restrictions that forbid",
				"distributors to deny you these rights or to ask you to surrender these",
				"rights.  These restrictions translate to certain responsibilities for",
				"you if you distribute copies of the library or if you modify it.",
				"  For example, if you distribute copies of the library, whether gratis",
				"or for a fee, you must give the recipients all the rights that we gave",
				"you.  You must make sure that they, too, receive or can get the source",
				"code.  If you link other code with the library, you must provide",
				"complete object files to the recipients, so that they can relink them",
				"with the library after making changes to the library and recompiling",
				"it.  And you must show them these terms so they know their rights.",
				"  We protect your rights with a two-step method: (1) we copyright the",
				"library, and (2) we offer you this license, which gives you legal",
				"permission to copy, distribute and/or modify the library.",
				"  To protect each distributor, we want to make it very clear that",
				"there is no warranty for the free library.  Also, if the library is",
				"modified by someone else and passed on, the recipients should know",
				"that what they have is not the original version, so that the original",
				"author's reputation will not be affected by problems that might be",
				"introduced by others.",
				"",
				"  Finally, software patents pose a constant threat to the existence of",
				"any free program.  We wish to make sure that a company cannot",
				"effectively restrict the users of a free program by obtaining a",
				"restrictive license from a patent holder.  Therefore, we insist that",
				"any patent license obtained for a version of the library must be",
				"consistent with the full freedom of use specified in this license.",
				"  Most GNU software, including some libraries, is covered by the",
				"ordinary GNU General Public License.  This license, the GNU Lesser",
				"General Public License, applies to certain designated libraries, and",
				"is quite different from the ordinary General Public License.  We use",
				"this license for certain libraries in order to permit linking those",
				"libraries into non-free programs.",
				"  When a program is linked with a library, whether statically or using",
				"a shared library, the combination of the two is legally speaking a",
				"combined work, a derivative of the original library.  The ordinary",
				"General Public License therefore permits such linking only if the",
				"entire combination fits its criteria of freedom.  The Lesser General",
				"Public License permits more lax criteria for linking other code with",
				"the library.",
				"  We call this license the \"Lesser\" General Public License because it",
				"does Less to protect the user's freedom than the ordinary General",
				"Public License.  It also provides other free software developers Less",
				"of an advantage over competing non-free programs.  These disadvantages",
				"are the reason we use the ordinary General Public License for many",
				"libraries.  However, the Lesser license provides advantages in certain",
				"special circumstances.",
				"  For example, on rare occasions, there may be a special need to",
				"encourage the widest possible use of a certain library, so that it becomes",
				"a de-facto standard.  To achieve this, non-free programs must be",
				"allowed to use the library.  A more frequent case is that a free",
				"library does the same job as widely used non-free libraries.  In this",
				"case, there is little to gain by limiting the free library to free",
				"software only, so we use the Lesser General Public License.",
				"  In other cases, permission to use a particular library in non-free",
				"programs enables a greater number of people to use a large body of",
				"free software.  For example, permission to use the GNU C Library in",
				"non-free programs enables many more people to use the whole GNU",
				"operating system, as well as its variant, the GNU/Linux operating",
				"system.",
				"  Although the Lesser General Public License is Less protective of the",
				"users' freedom, it does ensure that the user of a program that is",
				"linked with the Library has the freedom and the wherewithal to run",
				"that program using a modified version of the Library.",
				"  The precise terms and conditions for copying, distribution and",
				"modification follow.  Pay close attention to the difference between a",
				"\"work based on the library\" and a \"work that uses the library\".  The",
				"former contains code derived from the library, whereas the latter must",
				"be combined with the library in order to run.",
				"",
				"                  GNU LESSER GENERAL PUBLIC LICENSE",
				"   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION",
				"  0. This License Agreement applies to any software library or other",
				"program which contains a notice placed by the copyright holder or",
				"other authorized party saying it may be distributed under the terms of",
				"this Lesser General Public License (also called \"this License\").",
				"Each licensee is addressed as \"you\".",
				"  A \"library\" means a collection of software functions and/or data",
				"prepared so as to be conveniently linked with application programs",
				"(which use some of those functions and data) to form executables.",
				"  The \"Library\", below, refers to any such software library or work",
				"which has been distributed under these terms.  A \"work based on the",
				"Library\" means either the Library or any derivative work under",
				"copyright law: that is to say, a work containing the Library or a",
				"portion of it, either verbatim or with modifications and/or translated",
				"straightforwardly into another language.  (Hereinafter, translation is",
				"included without limitation in the term \"modification\".)",
				"  \"Source code\" for a work means the preferred form of the work for",
				"making modifications to it.  For a library, complete source code means",
				"all the source code for all modules it contains, plus any associated",
				"interface definition files, plus the scripts used to control compilation",
				"and installation of the library.",
				"  Activities other than copying, distribution and modification are not",
				"covered by this License; they are outside its scope.  The act of",
				"running a program using the Library is not restricted, and output from",
				"such a program is covered only if its contents constitute a work based",
				"on the Library (independent of the use of the Library in a tool for",
				"writing it).  Whether that is true depends on what the Library does",
				"and what the program that uses the Library does.",
				"  1. You may copy and distribute verbatim copies of the Library's",
				"complete source code as you receive it, in any medium, provided that",
				"you conspicuously and appropriately publish on each copy an",
				"appropriate copyright notice and disclaimer of warranty; keep intact",
				"all the notices that refer to this License and to the absence of any",
				"warranty; and distribute a copy of this License along with the",
				"Library.",
				"  You may charge a fee for the physical act of transferring a copy,",
				"and you may at your option offer warranty protection in exchange for a",
				"fee.",
				"",
				"  2. You may modify your copy or copies of the Library or any portion",
				"of it, thus forming a work based on the Library, and copy and",
				"distribute such modifications or work under the terms of Section 1",
				"above, provided that you also meet all of these conditions:",
				"    a) The modified work must itself be a software library.",
				"    b) You must cause the files modified to carry prominent notices",
				"    stating that you changed the files and the date of any change.",
				"    c) You must cause the whole of the work to be licensed at no",
				"    charge to all third parties under the terms of this License.",
				"    d) If a facility in the modified Library refers to a function or a",
				"    table of data to be supplied by an application program that uses",
				"    the facility, other than as an argument passed when the facility",
				"    is invoked, then you must make a good faith effort to ensure that,",
				"    in the event an application does not supply such function or",
				"    table, the facility still operates, and performs whatever part of",
				"    its purpose remains meaningful.",
				"    (For example, a function in a library to compute square roots has",
				"    a purpose that is entirely well-defined independent of the",
				"    application.  Therefore, Subsection 2d requires that any",
				"    application-supplied function or table used by this function must",
				"    be optional: if the application does not supply it, the square",
				"    root function must still compute square roots.)",
				"These requirements apply to the modified work as a whole.  If",
				"identifiable sections of that work are not derived from the Library,",
				"and can be reasonably considered independent and separate works in",
				"themselves, then this License, and its terms, do not apply to those",
				"sections when you distribute them as separate works.  But when you",
				"distribute the same sections as part of a whole which is a work based",
				"on the Library, the distribution of the whole must be on the terms of",
				"this License, whose permissions for other licensees extend to the",
				"entire whole, and thus to each and every part regardless of who wrote",
				"it.",
				"Thus, it is not the intent of this section to claim rights or contest",
				"your rights to work written entirely by you; rather, the intent is to",
				"exercise the right to control the distribution of derivative or",
				"collective works based on the Library.",
				"In addition, mere aggregation of another work not based on the Library",
				"with the Library (or with a work based on the Library) on a volume of",
				"a storage or distribution medium does not bring the other work under",
				"the scope of this License.",
				"  3. You may opt to apply the terms of the ordinary GNU General Public",
				"License instead of this License to a given copy of the Library.  To do",
				"this, you must alter all the notices that refer to this License, so",
				"that they refer to the ordinary GNU General Public License, version 2,",
				"instead of to this License.  (If a newer version than version 2 of the",
				"ordinary GNU General Public License has appeared, then you can specify",
				"that version instead if you wish.)  Do not make any other change in",
				"these notices.",
				"",
				"  Once this change is made in a given copy, it is irreversible for",
				"that copy, so the ordinary GNU General Public License applies to all",
				"subsequent copies and derivative works made from that copy.",
				"  This option is useful when you wish to copy part of the code of",
				"the Library into a program that is not a library.",
				"  4. You may copy and distribute the Library (or a portion or",
				"derivative of it, under Section 2) in object code or executable form",
				"under the terms of Sections 1 and 2 above provided that you accompany",
				"it with the complete corresponding machine-readable source code, which",
				"must be distributed under the terms of Sections 1 and 2 above on a",
				"medium customarily used for software interchange.",
				"  If distribution of object code is made by offering access to copy",
				"from a designated place, then offering equivalent access to copy the",
				"source code from the same place satisfies the requirement to",
				"distribute the source code, even though third parties are not",
				"compelled to copy the source along with the object code.",
				"  5. A program that contains no derivative of any portion of the",
				"Library, but is designed to work with the Library by being compiled or",
				"linked with it, is called a \"work that uses the Library\".  Such a",
				"work, in isolation, is not a derivative work of the Library, and",
				"therefore falls outside the scope of this License.",
				"  However, linking a \"work that uses the Library\" with the Library",
				"creates an executable that is a derivative of the Library (because it",
				"contains portions of the Library), rather than a \"work that uses the",
				"library\".  The executable is therefore covered by this License.",
				"Section 6 states terms for distribution of such executables.",
				"  When a \"work that uses the Library\" uses material from a header file",
				"that is part of the Library, the object code for the work may be a",
				"derivative work of the Library even though the source code is not.",
				"Whether this is true is especially significant if the work can be",
				"linked without the Library, or if the work is itself a library.  The",
				"threshold for this to be true is not precisely defined by law.",
				"  If such an object file uses only numerical parameters, data",
				"structure layouts and accessors, and small macros and small inline",
				"functions (ten lines or less in length), then the use of the object",
				"file is unrestricted, regardless of whether it is legally a derivative",
				"work.  (Executables containing this object code plus portions of the",
				"Library will still fall under Section 6.)",
				"  Otherwise, if the work is a derivative of the Library, you may",
				"distribute the object code for the work under the terms of Section 6.",
				"Any executables containing that work also fall under Section 6,",
				"whether or not they are linked directly with the Library itself.",
				"",
				"  6. As an exception to the Sections above, you may also combine or",
				"link a \"work that uses the Library\" with the Library to produce a",
				"work containing portions of the Library, and distribute that work",
				"under terms of your choice, provided that the terms permit",
				"modification of the work for the customer's own use and reverse",
				"engineering for debugging such modifications.",
				"  You must give prominent notice with each copy of the work that the",
				"Library is used in it and that the Library and its use are covered by",
				"this License.  You must supply a copy of this License.  If the work",
				"during execution displays copyright notices, you must include the",
				"copyright notice for the Library among them, as well as a reference",
				"directing the user to the copy of this License.  Also, you must do one",
				"of these things:",
				"    a) Accompany the work with the complete corresponding",
				"    machine-readable source code for the Library including whatever",
				"    changes were used in the work (which must be distributed under",
				"    Sections 1 and 2 above); and, if the work is an executable linked",
				"    with the Library, with the complete machine-readable \"work that",
				"    uses the Library\", as object code and/or source code, so that the",
				"    user can modify the Library and then relink to produce a modified",
				"    executable containing the modified Library.  (It is understood",
				"    that the user who changes the contents of definitions files in the",
				"    Library will not necessarily be able to recompile the application",
				"    to use the modified definitions.)",
				"    b) Use a suitable shared library mechanism for linking with the",
				"    Library.  A suitable mechanism is one that (1) uses at run time a",
				"    copy of the library already present on the user's computer system,",
				"    rather than copying library functions into the executable, and (2)",
				"    will operate properly with a modified version of the library, if",
				"    the user installs one, as long as the modified version is",
				"    interface-compatible with the version that the work was made with.",
				"    c) Accompany the work with a written offer, valid for at",
				"    least three years, to give the same user the materials",
				"    specified in Subsection 6a, above, for a charge no more",
				"    than the cost of performing this distribution.",
				"    d) If distribution of the work is made by offering access to copy",
				"    from a designated place, offer equivalent access to copy the above",
				"    specified materials from the same place.",
				"    e) Verify that the user has already received a copy of these",
				"    materials or that you have already sent this user a copy.",
				"  For an executable, the required form of the \"work that uses the",
				"Library\" must include any data and utility programs needed for",
				"reproducing the executable from it.  However, as a special exception,",
				"the materials to be distributed need not include anything that is",
				"normally distributed (in either source or binary form) with the major",
				"components (compiler, kernel, and so on) of the operating system on",
				"which the executable runs, unless that component itself accompanies",
				"the executable.",
				"  It may happen that this requirement contradicts the license",
				"restrictions of other proprietary libraries that do not normally",
				"accompany the operating system.  Such a contradiction means you cannot",
				"use both them and the Library together in an executable that you",
				"distribute.",
				"",
				"  7. You may place library facilities that are a work based on the",
				"Library side-by-side in a single library together with other library",
				"facilities not covered by this License, and distribute such a combined",
				"library, provided that the separate distribution of the work based on",
				"the Library and of the other library facilities is otherwise",
				"permitted, and provided that you do these two things:",
				"    a) Accompany the combined library with a copy of the same work",
				"    based on the Library, uncombined with any other library",
				"    facilities.  This must be distributed under the terms of the",
				"    Sections above.",
				"    b) Give prominent notice with the combined library of the fact",
				"    that part of it is a work based on the Library, and explaining",
				"    where to find the accompanying uncombined form of the same work.",
				"  8. You may not copy, modify, sublicense, link with, or distribute",
				"the Library except as expressly provided under this License.  Any",
				"attempt otherwise to copy, modify, sublicense, link with, or",
				"distribute the Library is void, and will automatically terminate your",
				"rights under this License.  However, parties who have received copies,",
				"or rights, from you under this License will not have their licenses",
				"terminated so long as such parties remain in full compliance.",
				"  9. You are not required to accept this License, since you have not",
				"signed it.  However, nothing else grants you permission to modify or",
				"distribute the Library or its derivative works.  These actions are",
				"prohibited by law if you do not accept this License.  Therefore, by",
				"modifying or distributing the Library (or any work based on the",
				"Library), you indicate your acceptance of this License to do so, and",
				"all its terms and conditions for copying, distributing or modifying",
				"the Library or works based on it.",
				"  10. Each time you redistribute the Library (or any work based on the",
				"Library), the recipient automatically receives a license from the",
				"original licensor to copy, distribute, link with or modify the Library",
				"subject to these terms and conditions.  You may not impose any further",
				"restrictions on the recipients' exercise of the rights granted herein.",
				"You are not responsible for enforcing compliance by third parties with",
				"this License.",
				"",
				"  11. If, as a consequence of a court judgment or allegation of patent",
				"infringement or for any other reason (not limited to patent issues),",
				"conditions are imposed on you (whether by court order, agreement or",
				"otherwise) that contradict the conditions of this License, they do not",
				"excuse you from the conditions of this License.  If you cannot",
				"distribute so as to satisfy simultaneously your obligations under this",
				"License and any other pertinent obligations, then as a consequence you",
				"may not distribute the Library at all.  For example, if a patent",
				"license would not permit royalty-free redistribution of the Library by",
				"all those who receive copies directly or indirectly through you, then",
				"the only way you could satisfy both it and this License would be to",
				"refrain entirely from distribution of the Library.",
				"If any portion of this section is held invalid or unenforceable under any",
				"particular circumstance, the balance of the section is intended to apply,",
				"and the section as a whole is intended to apply in other circumstances.",
				"It is not the purpose of this section to induce you to infringe any",
				"patents or other property right claims or to contest validity of any",
				"such claims; this section has the sole purpose of protecting the",
				"integrity of the free software distribution system which is",
				"implemented by public license practices.  Many people have made",
				"generous contributions to the wide range of software distributed",
				"through that system in reliance on consistent application of that",
				"system; it is up to the author/donor to decide if he or she is willing",
				"to distribute software through any other system and a licensee cannot",
				"impose that choice.",
				"This section is intended to make thoroughly clear what is believed to",
				"be a consequence of the rest of this License.",
				"  12. If the distribution and/or use of the Library is restricted in",
				"certain countries either by patents or by copyrighted interfaces, the",
				"original copyright holder who places the Library under this License may add",
				"an explicit geographical distribution limitation excluding those countries,",
				"so that distribution is permitted only in or among countries not thus",
				"excluded.  In such case, this License incorporates the limitation as if",
				"written in the body of this License.",
				"  13. The Free Software Foundation may publish revised and/or new",
				"versions of the Lesser General Public License from time to time.",
				"Such new versions will be similar in spirit to the present version,",
				"but may differ in detail to address new problems or concerns.",
				"Each version is given a distinguishing version number.  If the Library",
				"specifies a version number of this License which applies to it and",
				"\"any later version\", you have the option of following the terms and",
				"conditions either of that version or of any later version published by",
				"the Free Software Foundation.  If the Library does not specify a",
				"license version number, you may choose any version ever published by",
				"the Free Software Foundation.",
				"",
				"  14. If you wish to incorporate parts of the Library into other free",
				"programs whose distribution conditions are incompatible with these,",
				"write to the author to ask for permission.  For software which is",
				"copyrighted by the Free Software Foundation, write to the Free",
				"Software Foundation; we sometimes make exceptions for this.  Our",
				"decision will be guided by the two goals of preserving the free status",
				"of all derivatives of our free software and of promoting the sharing",
				"and reuse of software generally.",
				"                            NO WARRANTY",
				"  15. BECAUSE THE LIBRARY IS LICENSED FREE OF CHARGE, THERE IS NO",
				"WARRANTY FOR THE LIBRARY, TO THE EXTENT PERMITTED BY APPLICABLE LAW.",
				"EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR",
				"OTHER PARTIES PROVIDE THE LIBRARY \"AS IS\" WITHOUT WARRANTY OF ANY",
				"KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE",
				"IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR",
				"PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE",
				"LIBRARY IS WITH YOU.  SHOULD THE LIBRARY PROVE DEFECTIVE, YOU ASSUME",
				"THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.",
				"  16. IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN",
				"WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY",
				"AND/OR REDISTRIBUTE THE LIBRARY AS PERMITTED ABOVE, BE LIABLE TO YOU",
				"FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL OR",
				"CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE",
				"LIBRARY (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING",
				"RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A",
				"FAILURE OF THE LIBRARY TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF",
				"SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH",
				"DAMAGES.",
				"                     END OF TERMS AND CONDITIONS",
				"",
				"           How to Apply These Terms to Your New Libraries",
				"  If you develop a new library, and you want it to be of the greatest",
				"possible use to the public, we recommend making it free software that",
				"everyone can redistribute and change.  You can do so by permitting",
				"redistribution under these terms (or, alternatively, under the terms of the",
				"ordinary General Public License).",
				"  To apply these terms, attach the following notices to the library.  It is",
				"safest to attach them to the start of each source file to most effectively",
				"convey the exclusion of warranty; and each file should have at least the",
				"\"copyright\" line and a pointer to where the full notice is found.",
				"    <one line to give the library's name and a brief idea of what it does.>",
				"    Copyright (C) <year>  <name of author>",
				"    This library is free software; you can redistribute it and/or",
				"    modify it under the terms of the GNU Lesser General Public",
				"    License as published by the Free Software Foundation; either",
				"    version 2.1 of the License, or (at your option) any later version.",
				"    This library is distributed in the hope that it will be useful,",
				"    but WITHOUT ANY WARRANTY; without even the implied warranty of",
				"    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU",
				"    Lesser General Public License for more details.",
				"    You should have received a copy of the GNU Lesser General Public",
				"    License along with this library; if not, write to the Free Software",
				"    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA",
				"Also add information on how to contact you by electronic and paper mail.",
				"You should also get your employer (if you work as a programmer) or your",
				"school, if any, to sign a \"copyright disclaimer\" for the library, if",
				"necessary.  Here is a sample; alter the names:",
				"  Yoyodyne, Inc., hereby disclaims all copyright interest in the",
				"  library `Frob' (a library for tweaking knobs) written by James Random Hacker.",
				"  <signature of Ty Coon>, 1 April 1990",
				"  Ty Coon, President of Vice",
				"That's all there is to it!"
			]
		},
		{
			"component": {
				"type": "other",
				"other": {
					"name": "H.264/AVC Video Standard",
					"downloadUrl": "https://chromium.googlesource.com/chromium/third_party/ffmpeg",
					"version": "5.1.git"
				}
			},
			"licenseDetail": [
				"This product is licensed under the AVC patent portfolio license for the personal",
				"and non-commercial use of a consumer to (i) encode video in compliance with the AVC standard (\"AVC VIDEO\")",
				"and/or (ii) decode AVC video that was encoded by a consumer",
				"engaged in a personal and non-commercial activity and/or was obtained from a video provider",
				"licensed to provide AVC video. No license is granted or shall be implied for any other use.",
				"Additional information may be obtained from MPEG LA LLC. See http://www.MPEGLA.COM.",
				"",
				"For clarification purposes, this notice does not limit or inhibit the use of the product",
				"for normal business uses that are personal to that business which do not include",
				"(i) redistribution of the product to third parties, or",
				"(ii) creation of content with AVC Standard compliant technologies for distribution to third parties."
			],
			"version": "H.264 (08/21)",
			"isOnlyProductionDependency": true,
			"license": "OTHER"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "nodejs",
					"repositoryUrl": "https://github.com/nodejs/node",
					"commitHash": "6ac4ab19ad02803f03b54501193397563e99988e",
					"tag": "22.21.1"
				}
			},
			"isOnlyProductionDependency": true,
			"version": "22.21.1"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "electron",
					"repositoryUrl": "https://github.com/electron/electron",
					"commitHash": "4d18062d0f0ca34c455bc7ec032dd7959a0365b6",
					"tag": "39.2.7"
				}
			},
			"isOnlyProductionDependency": true,
			"license": "MIT",
			"version": "39.2.7"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "inno setup",
					"repositoryUrl": "https://github.com/jrsoftware/issrc",
					"commitHash": "03fe8f4edb3e96c7835c9483052625bbedb160f2"
				}
			},
			"isOnlyProductionDependency": true,
			"licenseDetail": [
				"Inno Setup License",
				"==================",
				"",
				"Except where otherwise noted, all of the documentation and software included in the Inno Setup",
				"package is copyrighted by Jordan Russell.",
				"",
				"Copyright (C) 1997-2020 Jordan Russell. All rights reserved.",
				"Portions Copyright (C) 2000-2020 Martijn Laan. All rights reserved.",
				"",
				"This software is provided \"as-is,\" without any express or implied warranty. In no event shall the",
				"author be held liable for any damages arising from the use of this software.",
				"",
				"Permission is granted to anyone to use this software for any purpose, including commercial",
				"applications, and to alter and redistribute it, provided that the following conditions are met:",
				"",
				"1. All redistributions of source code files must retain all copyright notices that are currently in",
				"   place, and this list of conditions without modification.",
				"",
				"2. All redistributions in binary form must retain all occurrences of the above copyright notice and",
				"   web site addresses that are currently in place (for example, in the About boxes).",
				"",
				"3. The origin of this software must not be misrepresented; you must not claim that you wrote the",
				"   original software. If you use this software to distribute a product, an acknowledgment in the",
				"   product documentation would be appreciated but is not required.",
				"",
				"4. Modified versions in source or binary form must be plainly marked as such, and must not be",
				"   misrepresented as being the original software.",
				"",
				"",
				"Jordan Russell",
				"jr-2010 AT jrsoftware.org",
				"https://jrsoftware.org/"
			],
			"version": "5.5.6"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "spdlog original",
					"repositoryUrl": "https://github.com/gabime/spdlog",
					"commitHash": "7e635fca68d014934b4af8a1cf874f63989352b7"
				}
			},
			"isOnlyProductionDependency": true,
			"license": "MIT",
			"version": "1.12.0"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "vscode-codicons",
					"repositoryUrl": "https://github.com/microsoft/vscode-codicons",
					"commitHash": "906a02039fe8d29721f3eec1e46406be8c4bee39"
				}
			},
			"license": "MIT and Creative Commons Attribution 4.0",
			"version": "0.0.41"
		},
		{
			"component": {
				"type": "npm",
				"npm": {
					"name": "mdn-data",
					"version": "2.0.31"
				}
			},
			"isOnlyProductionDependency": true,
			"repositoryUrl": "https://github.com/mdn/data"
		},
		{
			"component": {
				"type": "npm",
				"npm": {
					"name": "@mdn/browser-compat-data",
					"version": "5.2.45"
				}
			},
			"isOnlyProductionDependency": true,
			"repositoryUrl": "https://github.com/mdn/browser-compat-data"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "ripgrep",
					"repositoryUrl": "https://github.com/BurntSushi/ripgrep",
					"commitHash": "af6b6c543b224d348a8876f0c06245d9ea7929c5",
					"tag": "13.0.0"
				}
			},
			"isOnlyProductionDependency": true,
			"license": "MIT",
			"version": "13.0.0"
		},
		{
			"name": "@vscode/win32-app-container-tokens",
			"component": {
				"type": "git",
				"git": {
					"name": "vscode-win32-app-container-tokens",
					"repositoryUrl": "https://github.com/microsoft/vscode-win32-app-container-tokens",
					"commitHash": "5b871f95fd9cb8efa8ee9a80600510d5e5339137"
				}
			},
			"licenseDetail": [
				"MIT License",
				"",
				"Copyright (c) Microsoft Corporation.",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
				"SOFTWARE"
			]
		},
		{
			"component": {
				"type": "npm",
				"npm": {
					"name": "@iktakahiro/markdown-it-katex",
					"version": "4.0.2"
				}
			},
			"repositoryUrl": "https://github.com/mjbvz/markdown-it-katex",
			"licenseDetail": [
				"The MIT License (MIT)",
				"",
				"Copyright (c) 2016 Waylon Flinn",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
				"SOFTWARE.",
				"",
				"---",
				"",
				"The MIT License (MIT)",
				"",
				"Copyright (c) 2018 Takahiro Ethan Ikeuchi @iktakahiro",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
				"SOFTWARE."
			],
			"license": "MIT"
		},
		{
			"component": {
				"type": "npm",
				"npm": {
					"name": "cacheable-request",
					"version": "7.0.4"
				}
			},
			"licenseDetail": [
				"Copyright (c) cacheable-request authors",
				"",
				"MIT License",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to",
				"deal in the Software without restriction, including without limitation the",
				"rights to use, copy, modify, merge, publish, distribute, sublicense, and/or",
				"sell copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in",
				"all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING",
				"FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER",
				"DEALINGS IN THE SOFTWARE."
			],
			"license": "MIT"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: CodeQL.yml]---
Location: vscode-main/CodeQL.yml

```yaml
path_classifiers:
  test:
    # Classify all files in the top-level directories test/ and testsuites/ as test code.
    - test
    # Classify all files with suffix `.test` as test code.
    # Note: use only forward slash / as a path separator.
    # *  Matches any sequence of characters except a forward slash.
    # ** Matches any sequence of characters, including a forward slash.
    # This wildcard must either be surrounded by forward slash symbols, or used as the first segment of a path.
    # It matches zero or more whole directory segments. There is no need to use a wildcard at the end of a directory path because all sub-directories are automatically matched.
    # That is, /anything/ matches the anything directory and all its subdirectories.
    # Always enclose the expression in double quotes if it includes *.
    - "**/*.test.ts"

  # The default behavior is to tag all files created during the
  # build as `generated`. Results are hidden for generated code. You can tag
  # further files as being generated by adding them to the `generated` section.
  generated:
    # generated code.
    - out
    - "out-build"
    - "out-vscode"
    - "**/out/**"
    - ".build/distro/cli-patches/index.js"

  # The default behavior is to tag library code as `library`. Results are hidden
  # for library code. You can tag further files as being library code by adding them
  # to the `library` section.
  library:
    - "**/node_modules/**"
```

--------------------------------------------------------------------------------

---[FILE: CONTRIBUTING.md]---
Location: vscode-main/CONTRIBUTING.md

```markdown
# Contributing to VS Code

Welcome, and thank you for your interest in contributing to VS Code!

There are several ways in which you can contribute, beyond writing code. The goal of this document is to provide a high-level overview of how you can get involved.

## Asking Questions


Have a question? Instead of opening an issue, please ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/visual-studio-code) using the tag `visual-studio-code`.

The active community will be eager to assist you. Your well-worded question will serve as a resource to others searching for help.

## Providing Feedback

Your comments and feedback are welcome, and the development team is available via a handful of different channels.

See the [Feedback Channels](https://github.com/microsoft/vscode/wiki/Feedback-Channels) wiki page for details on how to share your thoughts.

## Reporting Issues

Have you identified a reproducible problem in VS Code? Do you have a feature request? We want to hear about it! Here's how you can report your issue as effectively as possible.

### Identify Where to Report

The VS Code project is distributed across multiple repositories. Try to file the issue against the correct repository. Check the list of [Related Projects](https://github.com/microsoft/vscode/wiki/Related-Projects) if you aren't sure which repo is correct.

Can you recreate the issue even after [disabling all extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_disable-an-extension)? If you find the issue is caused by an extension you have installed, please file an issue on the extension's repo directly.

### Look For an Existing Issue

Before you create a new issue, please do a search in [open issues](https://github.com/microsoft/vscode/issues) to see if the issue or feature request has already been filed.

Be sure to scan through the [most popular](https://github.com/microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc) feature requests.

If you find your issue already exists, make relevant comments and add your [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments). Use a reaction in place of a "+1" comment:

* 👍 - upvote
* 👎 - downvote

If you cannot find an existing issue that describes your bug or feature, create a new issue using the guidelines below.

### Writing Good Bug Reports and Feature Requests

File a single issue per problem and feature request. Do not enumerate multiple bugs or feature requests in the same issue.

Do not add your issue as a comment to an existing issue unless it's for the identical input. Many issues look similar but have different causes.

The more information you can provide, the more likely someone will be successful at reproducing the issue and finding a fix.

The built-in tool for reporting an issue, which you can access by using `Report Issue` in VS Code's Help menu, can help streamline this process by automatically providing the version of VS Code, all your installed extensions, and your system info. Additionally, the tool will search among existing issues to see if a similar issue already exists.

Please include the following with each issue:

* Version of VS Code
* Your operating system
* List of extensions that you have installed
* Reproducible steps (1... 2... 3...) that cause the issue
* What you expected to see, versus what you actually saw
* Images, animations, or a link to a video showing the issue occurring
* A code snippet that demonstrates the issue or a link to a code repository the developers can easily pull down to recreate the issue locally
  * **Note:** Because the developers need to copy and paste the code snippet, including a code snippet as a media file (i.e. .gif) is not sufficient.
* Errors from the Dev Tools Console (open from the menu: Help > Toggle Developer Tools)

### Creating Pull Requests

* Please refer to the article on [creating pull requests](https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests) and contributing to this project.

### Final Checklist

Please remember to do the following:

* [ ] Search the issue repository to ensure your report is a new issue
* [ ] Recreate the issue after disabling all extensions
* [ ] Simplify your code around the issue to better isolate the problem

Don't feel bad if the developers can't reproduce the issue right away. They will simply ask for more information!

### Follow Your Issue

Once submitted, your report will go into the [issue tracking](https://github.com/microsoft/vscode/wiki/Issue-Tracking) workflow. Be sure to understand what will happen next, so you know what to expect and how to continue to assist throughout the process.

## Automated Issue Management

We use GitHub Actions to help us manage issues. These Actions and their descriptions can be [viewed here](https://github.com/microsoft/vscode-github-triage-actions). Some examples of what these Actions do are:

* Automatically close any issue marked `info-needed` if there has been no response in the past 7 days.
* Automatically lock issues 45 days after they are closed.
* Automatically implement the VS Code [feature request pipeline](https://github.com/microsoft/vscode/wiki/Issues-Triaging#managing-feature-requests).

If you believe the bot got something wrong, please open a new issue and let us know.

## Contributing Fixes

If you are interested in writing code to fix issues, please see [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) in the wiki.

## Thank You

Your contributions to open source, large or small, make great projects like this possible. Thank you for taking the time to contribute.
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: vscode-main/eslint.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import fs from 'fs';
import path from 'path';
import tseslint from 'typescript-eslint';

import stylisticTs from '@stylistic/eslint-plugin-ts';
import * as pluginLocal from './.eslint-plugin-local/index.ts';
import pluginJsdoc from 'eslint-plugin-jsdoc';

import pluginHeader from 'eslint-plugin-header';
pluginHeader.rules.header.meta.schema = false;

const ignores = fs.readFileSync(path.join(import.meta.dirname, '.eslint-ignore'), 'utf8')
	.toString()
	.split(/\r\n|\n/)
	.filter(line => line && !line.startsWith('#'));

export default tseslint.config(
	// Global ignores
	{
		ignores: [
			...ignores,
			'!**/.eslint-plugin-local/**/*'
		],
	},
	// All files (JS and TS)
	{
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
			'header': pluginHeader,
		},
		rules: {
			'constructor-super': 'warn',
			'curly': 'warn',
			'eqeqeq': 'warn',
			'prefer-const': [
				'warn',
				{
					'destructuring': 'all'
				}
			],
			'no-buffer-constructor': 'warn',
			'no-caller': 'warn',
			'no-case-declarations': 'warn',
			'no-debugger': 'warn',
			'no-duplicate-case': 'warn',
			'no-duplicate-imports': 'warn',
			'no-eval': 'warn',
			'no-async-promise-executor': 'warn',
			'no-extra-semi': 'warn',
			'no-new-wrappers': 'warn',
			'no-redeclare': 'off',
			'no-sparse-arrays': 'warn',
			'no-throw-literal': 'warn',
			'no-unsafe-finally': 'warn',
			'no-unused-labels': 'warn',
			'no-misleading-character-class': 'warn',
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context'
			], // non-complete list of globals that are easy to access unintentionally
			'no-var': 'warn',
			'semi': 'warn',
			'local/code-translation-remind': 'warn',
			'local/code-no-native-private': 'warn',
			'local/code-parameter-properties-must-have-explicit-accessibility': 'warn',
			'local/code-no-nls-in-standalone-editor': 'warn',
			'local/code-no-potentially-unsafe-disposables': 'warn',
			'local/code-no-dangerous-type-assertions': 'warn',
			'local/code-no-any-casts': 'warn',
			'local/code-no-standalone-editor': 'warn',
			'local/code-no-unexternalized-strings': 'warn',
			'local/code-must-use-super-dispose': 'warn',
			'local/code-declare-service-brand': 'warn',
			'local/code-no-reader-after-await': 'warn',
			'local/code-no-observable-get-in-reactive-context': 'warn',
			'local/code-no-localized-model-description': 'warn',
			'local/code-policy-localization-key-match': 'warn',
			'local/code-no-localization-template-literals': 'error',
			'local/code-no-deep-import-of-internal': ['error', { '.*Internal': true, 'searchExtTypesInternal': false }],
			'local/code-layering': [
				'warn',
				{
					'common': [],
					'node': [
						'common'
					],
					'browser': [
						'common'
					],
					'electron-browser': [
						'common',
						'browser'
					],
					'electron-utility': [
						'common',
						'node'
					],
					'electron-main': [
						'common',
						'node',
						'electron-utility'
					]
				}
			],
			'header/header': [
				2,
				'block',
				[
					'---------------------------------------------------------------------------------------------',
					' *  Copyright (c) Microsoft Corporation. All rights reserved.',
					' *  Licensed under the MIT License. See License.txt in the project root for license information.',
					' *--------------------------------------------------------------------------------------------'
				]
			]
		},
	},
	// TS
	{
		files: [
			'**/*.{ts,tsx,mts,cts}',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@stylistic/ts': stylisticTs,
			'@typescript-eslint': tseslint.plugin,
			'local': pluginLocal,
			'jsdoc': pluginJsdoc,
		},
		rules: {
			// Disable built-in semi rules in favor of stylistic
			'semi': 'off',
			'@stylistic/ts/semi': 'warn',
			'@stylistic/ts/member-delimiter-style': 'warn',
			'local/code-no-unused-expressions': [
				'warn',
				{
					'allowTernary': true
				}
			],
			'jsdoc/no-types': 'warn',
			'local/code-no-static-self-ref': 'warn'
		}
	},
	// vscode TS
	{
		files: [
			'src/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					'selector': 'class',
					'format': [
						'PascalCase'
					]
				}
			]
		}
	},
	// Disallow 'in' operator except in type predicates
	{
		files: [
			'**/*.ts',
			'.eslint-plugin-local/**/*.ts', // Explicitly include files under dot directories
		],
		ignores: [
			'src/bootstrap-node.ts',
			'build/lib/extensions.ts',
			'build/lib/test/render.test.ts',
			'extensions/debug-auto-launch/src/extension.ts',
			'extensions/emmet/src/updateImageSize.ts',
			'extensions/emmet/src/util.ts',
			'extensions/github-authentication/src/node/fetch.ts',
			'extensions/terminal-suggest/src/fig/figInterface.ts',
			'extensions/terminal-suggest/src/fig/fig-autocomplete-shared/mixins.ts',
			'extensions/terminal-suggest/src/fig/fig-autocomplete-shared/specMetadata.ts',
			'extensions/terminal-suggest/src/terminalSuggestMain.ts',
			'extensions/terminal-suggest/src/test/env/pathExecutableCache.test.ts',
			'extensions/tunnel-forwarding/src/extension.ts',
			'extensions/typescript-language-features/src/utils/platform.ts',
			'extensions/typescript-language-features/web/src/webServer.ts',
			'src/vs/base/browser/broadcast.ts',
			'src/vs/base/browser/canIUse.ts',
			'src/vs/base/browser/dom.ts',
			'src/vs/base/browser/markdownRenderer.ts',
			'src/vs/base/browser/touch.ts',
			'src/vs/base/common/async.ts',
			'src/vs/base/common/desktopEnvironmentInfo.ts',
			'src/vs/base/common/objects.ts',
			'src/vs/base/common/observableInternal/logging/consoleObservableLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugger/devToolsLogger.ts',
			'src/vs/base/test/common/snapshot.ts',
			'src/vs/base/test/common/timeTravelScheduler.ts',
			'src/vs/editor/browser/controller/editContext/native/debugEditContext.ts',
			'src/vs/editor/browser/gpu/gpuUtils.ts',
			'src/vs/editor/browser/gpu/taskQueue.ts',
			'src/vs/editor/browser/view.ts',
			'src/vs/editor/browser/widget/diffEditor/diffEditorWidget.ts',
			'src/vs/editor/browser/widget/diffEditor/utils.ts',
			'src/vs/editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.ts',
			'src/vs/editor/common/config/editorOptions.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteContribution.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/copyPasteController.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/edit.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/provideInlineCompletions.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts',
			'src/vs/platform/accessibilitySignal/browser/accessibilitySignalService.ts',
			'src/vs/platform/configuration/common/configuration.ts',
			'src/vs/platform/configuration/common/configurationModels.ts',
			'src/vs/platform/contextkey/browser/contextKeyService.ts',
			'src/vs/platform/contextkey/test/common/scanner.test.ts',
			'src/vs/platform/dataChannel/browser/forwardingTelemetryService.ts',
			'src/vs/platform/hover/browser/hoverService.ts',
			'src/vs/platform/hover/browser/hoverWidget.ts',
			'src/vs/platform/instantiation/common/instantiationService.ts',
			'src/vs/platform/mcp/common/mcpManagementCli.ts',
			'src/vs/workbench/api/browser/mainThreadChatSessions.ts',
			'src/vs/workbench/api/browser/mainThreadDebugService.ts',
			'src/vs/workbench/api/browser/mainThreadTesting.ts',
			'src/vs/workbench/api/common/extHost.api.impl.ts',
			'src/vs/workbench/api/common/extHostChatAgents2.ts',
			'src/vs/workbench/api/common/extHostChatSessions.ts',
			'src/vs/workbench/api/common/extHostDebugService.ts',
			'src/vs/workbench/api/common/extHostNotebookKernels.ts',
			'src/vs/workbench/api/common/extHostQuickOpen.ts',
			'src/vs/workbench/api/common/extHostRequireInterceptor.ts',
			'src/vs/workbench/api/common/extHostTypeConverters.ts',
			'src/vs/workbench/api/common/extHostTypes.ts',
			'src/vs/workbench/api/node/loopbackServer.ts',
			'src/vs/workbench/api/node/proxyResolver.ts',
			'src/vs/workbench/api/test/common/extHostTypeConverters.test.ts',
			'src/vs/workbench/api/test/common/testRPCProtocol.ts',
			'src/vs/workbench/api/worker/extHostExtensionService.ts',
			'src/vs/workbench/browser/parts/paneCompositeBar.ts',
			'src/vs/workbench/browser/parts/titlebar/titlebarPart.ts',
			'src/vs/workbench/browser/workbench.ts',
			'src/vs/workbench/common/notifications.ts',
			'src/vs/workbench/contrib/accessibility/browser/accessibleView.ts',
			'src/vs/workbench/contrib/chat/browser/chatAttachmentResolveService.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/chatAttachmentsContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/chatConfirmationWidget.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/chatElicitationContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/chatReferencesContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/chatTreeContentPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatContentParts/toolInvocationParts/abstractToolConfirmationSubPart.ts',
			'src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSession.ts',
			'src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSessionStorage.ts',
			'src/vs/workbench/contrib/chat/browser/chatInlineAnchorWidget.ts',
			'src/vs/workbench/contrib/chat/browser/chatResponseAccessibleView.ts',
			'src/vs/workbench/contrib/chat/browser/contrib/chatInputCompletions.ts',
			'src/vs/workbench/contrib/chat/common/annotations.ts',
			'src/vs/workbench/contrib/chat/common/chat.ts',
			'src/vs/workbench/contrib/chat/common/chatAgents.ts',
			'src/vs/workbench/contrib/chat/common/chatModel.ts',
			'src/vs/workbench/contrib/chat/common/chatService.ts',
			'src/vs/workbench/contrib/chat/common/chatServiceImpl.ts',
			'src/vs/workbench/contrib/chat/common/codeBlockModelCollection.ts',
			'src/vs/workbench/contrib/chat/test/common/chatModel.test.ts',
			'src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.test.ts',
			'src/vs/workbench/contrib/chat/test/common/promptSyntax/testUtils/mockFilesystem.ts',
			'src/vs/workbench/contrib/chat/test/common/tools/manageTodoListTool.test.ts',
			'src/vs/workbench/contrib/debug/browser/breakpointsView.ts',
			'src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts',
			'src/vs/workbench/contrib/debug/browser/variablesView.ts',
			'src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts',
			'src/vs/workbench/contrib/debug/common/debugModel.ts',
			'src/vs/workbench/contrib/debug/common/debugger.ts',
			'src/vs/workbench/contrib/debug/common/replAccessibilityAnnouncer.ts',
			'src/vs/workbench/contrib/editSessions/browser/editSessionsStorageService.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts',
			'src/vs/workbench/contrib/extensions/common/extensionQuery.ts',
			'src/vs/workbench/contrib/interactive/browser/interactiveEditorInput.ts',
			'src/vs/workbench/contrib/issue/browser/issueFormService.ts',
			'src/vs/workbench/contrib/issue/browser/issueQuickAccess.ts',
			'src/vs/workbench/contrib/markers/browser/markersView.ts',
			'src/vs/workbench/contrib/mcp/browser/mcpElicitationService.ts',
			'src/vs/workbench/contrib/mcp/common/mcpLanguageModelToolContribution.ts',
			'src/vs/workbench/contrib/mcp/common/mcpResourceFilesystem.ts',
			'src/vs/workbench/contrib/mcp/common/mcpSamplingLog.ts',
			'src/vs/workbench/contrib/mcp/common/mcpServer.ts',
			'src/vs/workbench/contrib/mcp/common/mcpServerRequestHandler.ts',
			'src/vs/workbench/contrib/mcp/test/common/mcpRegistryTypes.ts',
			'src/vs/workbench/contrib/mcp/test/common/mcpServerRequestHandler.test.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/cellOutputActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/chat/notebook.chat.contribution.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelView.ts',
			'src/vs/workbench/contrib/output/browser/outputView.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTree.ts',
			'src/vs/workbench/contrib/remoteTunnel/electron-browser/remoteTunnel.contribution.ts',
			'src/vs/workbench/contrib/tasks/browser/abstractTaskService.ts',
			'src/vs/workbench/contrib/tasks/browser/taskTerminalStatus.ts',
			'src/vs/workbench/contrib/tasks/browser/terminalTaskSystem.ts',
			'src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/taskHelpers.ts',
			'src/vs/workbench/contrib/terminalContrib/chatAgentTools/browser/tools/monitoring/outputMonitor.ts',
			'src/vs/workbench/contrib/testing/browser/explorerProjections/listProjection.ts',
			'src/vs/workbench/contrib/testing/browser/explorerProjections/treeProjection.ts',
			'src/vs/workbench/contrib/testing/browser/testCoverageBars.ts',
			'src/vs/workbench/contrib/testing/browser/testExplorerActions.ts',
			'src/vs/workbench/contrib/testing/browser/testingOutputPeek.ts',
			'src/vs/workbench/contrib/testing/browser/testingProgressUiService.ts',
			'src/vs/workbench/contrib/testing/browser/testResultsView/testResultsTree.ts',
			'src/vs/workbench/contrib/testing/common/testCoverageService.ts',
			'src/vs/workbench/contrib/testing/common/testResultService.ts',
			'src/vs/workbench/contrib/testing/common/testingChatAgentTool.ts',
			'src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts',
			'src/vs/workbench/contrib/themes/browser/themes.contribution.ts',
			'src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.contribution.ts',
			'src/vs/workbench/services/environment/electron-browser/environmentService.ts',
			'src/vs/workbench/services/keybinding/common/keybindingIO.ts',
			'src/vs/workbench/services/preferences/common/preferencesValidation.ts',
			'src/vs/workbench/services/remote/common/tunnelModel.ts',
			'src/vs/workbench/services/search/common/textSearchManager.ts',
			'src/vs/workbench/test/browser/workbenchTestServices.ts',
			'test/automation/src/playwrightDriver.ts',
			'.eslint-plugin-local/**/*',
		],
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-in-operator': 'warn',
		}
	},
	// Strict no explicit `any`
	{
		files: [
			// Extensions
			'extensions/git/src/**/*.ts',
			'extensions/git-base/src/**/*.ts',
			'extensions/github/src/**/*.ts',
			// vscode
			'src/**/*.ts',
		],
		ignores: [
			// Extensions
			'extensions/git/src/commands.ts',
			'extensions/git/src/decorators.ts',
			'extensions/git/src/git.ts',
			'extensions/git/src/util.ts',
			'extensions/git-base/src/decorators.ts',
			'extensions/github/src/util.ts',
			// vscode d.ts
			'src/vs/amdX.ts',
			'src/vs/monaco.d.ts',
			'src/vscode-dts/**',
			// Base
			'src/vs/base/browser/dom.ts',
			'src/vs/base/browser/mouseEvent.ts',
			'src/vs/base/node/processes.ts',
			'src/vs/base/common/arrays.ts',
			'src/vs/base/common/async.ts',
			'src/vs/base/common/console.ts',
			'src/vs/base/common/decorators.ts',
			'src/vs/base/common/errorMessage.ts',
			'src/vs/base/common/errors.ts',
			'src/vs/base/common/event.ts',
			'src/vs/base/common/hotReload.ts',
			'src/vs/base/common/hotReloadHelpers.ts',
			'src/vs/base/common/json.ts',
			'src/vs/base/common/jsonSchema.ts',
			'src/vs/base/common/lifecycle.ts',
			'src/vs/base/common/map.ts',
			'src/vs/base/common/marshalling.ts',
			'src/vs/base/common/objects.ts',
			'src/vs/base/common/performance.ts',
			'src/vs/base/common/platform.ts',
			'src/vs/base/common/processes.ts',
			'src/vs/base/common/types.ts',
			'src/vs/base/common/uriIpc.ts',
			'src/vs/base/common/verifier.ts',
			'src/vs/base/common/observableInternal/base.ts',
			'src/vs/base/common/observableInternal/changeTracker.ts',
			'src/vs/base/common/observableInternal/set.ts',
			'src/vs/base/common/observableInternal/transaction.ts',
			'src/vs/base/common/worker/webWorkerBootstrap.ts',
			'src/vs/base/test/common/mock.ts',
			'src/vs/base/test/common/snapshot.ts',
			'src/vs/base/test/common/timeTravelScheduler.ts',
			'src/vs/base/test/common/troubleshooting.ts',
			'src/vs/base/test/common/utils.ts',
			'src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.ts',
			'src/vs/base/browser/ui/grid/grid.ts',
			'src/vs/base/browser/ui/grid/gridview.ts',
			'src/vs/base/browser/ui/list/listPaging.ts',
			'src/vs/base/browser/ui/list/listView.ts',
			'src/vs/base/browser/ui/list/listWidget.ts',
			'src/vs/base/browser/ui/list/rowCache.ts',
			'src/vs/base/browser/ui/sash/sash.ts',
			'src/vs/base/browser/ui/table/tableWidget.ts',
			'src/vs/base/parts/ipc/common/ipc.net.ts',
			'src/vs/base/parts/ipc/common/ipc.ts',
			'src/vs/base/parts/ipc/electron-main/ipcMain.ts',
			'src/vs/base/parts/ipc/node/ipc.cp.ts',
			'src/vs/base/common/observableInternal/experimental/reducer.ts',
			'src/vs/base/common/observableInternal/experimental/utils.ts',
			'src/vs/base/common/observableInternal/logging/consoleObservableLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugGetDependencyGraph.ts',
			'src/vs/base/common/observableInternal/logging/logging.ts',
			'src/vs/base/common/observableInternal/observables/baseObservable.ts',
			'src/vs/base/common/observableInternal/observables/derived.ts',
			'src/vs/base/common/observableInternal/observables/derivedImpl.ts',
			'src/vs/base/common/observableInternal/observables/observableFromEvent.ts',
			'src/vs/base/common/observableInternal/observables/observableSignalFromEvent.ts',
			'src/vs/base/common/observableInternal/reactions/autorunImpl.ts',
			'src/vs/base/common/observableInternal/utils/utils.ts',
			'src/vs/base/common/observableInternal/utils/utilsCancellation.ts',
			'src/vs/base/parts/ipc/test/node/testService.ts',
			'src/vs/base/common/observableInternal/logging/debugger/debuggerRpc.ts',
			'src/vs/base/common/observableInternal/logging/debugger/devToolsLogger.ts',
			'src/vs/base/common/observableInternal/logging/debugger/rpc.ts',
			'src/vs/base/test/browser/ui/grid/util.ts',
			// Platform
			'src/vs/platform/commands/common/commands.ts',
			'src/vs/platform/contextkey/browser/contextKeyService.ts',
			'src/vs/platform/contextkey/common/contextkey.ts',
			'src/vs/platform/contextview/browser/contextView.ts',
			'src/vs/platform/debug/common/extensionHostDebugIpc.ts',
			'src/vs/platform/debug/electron-main/extensionHostDebugIpc.ts',
			'src/vs/platform/diagnostics/common/diagnostics.ts',
			'src/vs/platform/download/common/downloadIpc.ts',
			'src/vs/platform/extensions/common/extensions.ts',
			'src/vs/platform/instantiation/common/descriptors.ts',
			'src/vs/platform/instantiation/common/extensions.ts',
			'src/vs/platform/instantiation/common/instantiation.ts',
			'src/vs/platform/instantiation/common/instantiationService.ts',
			'src/vs/platform/instantiation/common/serviceCollection.ts',
			'src/vs/platform/keybinding/common/keybinding.ts',
			'src/vs/platform/keybinding/common/keybindingResolver.ts',
			'src/vs/platform/keybinding/common/keybindingsRegistry.ts',
			'src/vs/platform/keybinding/common/resolvedKeybindingItem.ts',
			'src/vs/platform/languagePacks/node/languagePacks.ts',
			'src/vs/platform/list/browser/listService.ts',
			'src/vs/platform/log/browser/log.ts',
			'src/vs/platform/log/common/log.ts',
			'src/vs/platform/log/common/logIpc.ts',
			'src/vs/platform/log/electron-main/logIpc.ts',
			'src/vs/platform/observable/common/wrapInHotClass.ts',
			'src/vs/platform/observable/common/wrapInReloadableClass.ts',
			'src/vs/platform/policy/common/policyIpc.ts',
			'src/vs/platform/profiling/common/profilingTelemetrySpec.ts',
			'src/vs/platform/quickinput/browser/quickInputActions.ts',
			'src/vs/platform/quickinput/common/quickInput.ts',
			'src/vs/platform/registry/common/platform.ts',
			'src/vs/platform/remote/browser/browserSocketFactory.ts',
			'src/vs/platform/remote/browser/remoteAuthorityResolverService.ts',
			'src/vs/platform/remote/common/remoteAgentConnection.ts',
			'src/vs/platform/remote/common/remoteAuthorityResolver.ts',
			'src/vs/platform/remote/electron-browser/electronRemoteResourceLoader.ts',
			'src/vs/platform/remote/electron-browser/remoteAuthorityResolverService.ts',
			'src/vs/platform/remoteTunnel/node/remoteTunnelService.ts',
			'src/vs/platform/request/common/request.ts',
			'src/vs/platform/request/common/requestIpc.ts',
			'src/vs/platform/request/electron-utility/requestService.ts',
			'src/vs/platform/request/node/proxy.ts',
			'src/vs/platform/telemetry/browser/errorTelemetry.ts',
			'src/vs/platform/telemetry/common/errorTelemetry.ts',
			'src/vs/platform/telemetry/common/remoteTelemetryChannel.ts',
			'src/vs/platform/telemetry/node/errorTelemetry.ts',
			'src/vs/platform/theme/common/iconRegistry.ts',
			'src/vs/platform/theme/common/tokenClassificationRegistry.ts',
			'src/vs/platform/update/common/updateIpc.ts',
			'src/vs/platform/update/electron-main/updateService.snap.ts',
			'src/vs/platform/url/common/urlIpc.ts',
			'src/vs/platform/userDataProfile/common/userDataProfileIpc.ts',
			'src/vs/platform/userDataProfile/electron-main/userDataProfileStorageIpc.ts',
			'src/vs/platform/userDataSync/common/abstractSynchronizer.ts',
			'src/vs/platform/userDataSync/common/extensionsMerge.ts',
			'src/vs/platform/userDataSync/common/extensionsSync.ts',
			'src/vs/platform/userDataSync/common/globalStateMerge.ts',
			'src/vs/platform/userDataSync/common/globalStateSync.ts',
			'src/vs/platform/userDataSync/common/settingsMerge.ts',
			'src/vs/platform/userDataSync/common/settingsSync.ts',
			'src/vs/platform/userDataSync/common/userDataSync.ts',
			'src/vs/platform/userDataSync/common/userDataSyncIpc.ts',
			'src/vs/platform/userDataSync/common/userDataSyncServiceIpc.ts',
			'src/vs/platform/webview/common/webviewManagerService.ts',
			'src/vs/platform/instantiation/test/common/instantiationServiceMock.ts',
			'src/vs/platform/keybinding/test/common/mockKeybindingService.ts',
			// Editor
			'src/vs/editor/standalone/browser/standaloneEditor.ts',
			'src/vs/editor/standalone/browser/standaloneLanguages.ts',
			'src/vs/editor/standalone/browser/standaloneServices.ts',
			'src/vs/editor/test/browser/testCodeEditor.ts',
			'src/vs/editor/test/common/testTextModel.ts',
			'src/vs/editor/contrib/bracketMatching/browser/bracketMatching.ts',
			'src/vs/editor/contrib/codeAction/browser/codeAction.ts',
			'src/vs/editor/contrib/codeAction/browser/codeActionCommands.ts',
			'src/vs/editor/contrib/codeAction/common/types.ts',
			'src/vs/editor/contrib/colorPicker/browser/colorDetector.ts',
			'src/vs/editor/contrib/diffEditorBreadcrumbs/browser/contribution.ts',
			'src/vs/editor/contrib/dropOrPasteInto/browser/dropIntoEditorContribution.ts',
			'src/vs/editor/contrib/find/browser/findController.ts',
			'src/vs/editor/contrib/find/browser/findModel.ts',
			'src/vs/editor/contrib/gotoSymbol/browser/goToCommands.ts',
			'src/vs/editor/contrib/gotoSymbol/browser/symbolNavigation.ts',
			'src/vs/editor/contrib/hover/browser/hoverActions.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/structuredLogger.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/utils.ts',
			'src/vs/editor/contrib/smartSelect/browser/smartSelect.ts',
			'src/vs/editor/contrib/stickyScroll/browser/stickyScrollModelProvider.ts',
			'src/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter.ts',
			'src/vs/editor/contrib/wordHighlighter/browser/wordHighlighter.ts',
			'src/vs/editor/standalone/common/monarch/monarchCommon.ts',
			'src/vs/editor/standalone/common/monarch/monarchCompile.ts',
			'src/vs/editor/standalone/common/monarch/monarchLexer.ts',
			'src/vs/editor/standalone/common/monarch/monarchTypes.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/controller/commands.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsModel.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/model/typingSpeed.ts',
			'src/vs/editor/contrib/inlineCompletions/test/browser/utils.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/ghostText/ghostTextView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/components/gutterIndicatorView.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/inlineEditsViews/debugVisualization.ts',
			'src/vs/editor/contrib/inlineCompletions/browser/view/inlineEdits/utils/utils.ts',
			// Workbench
			'src/vs/workbench/api/browser/mainThreadChatSessions.ts',
			'src/vs/workbench/api/common/extHost.api.impl.ts',
			'src/vs/workbench/api/common/extHost.protocol.ts',
			'src/vs/workbench/api/common/extHostChatSessions.ts',
			'src/vs/workbench/api/common/extHostCodeInsets.ts',
			'src/vs/workbench/api/common/extHostCommands.ts',
			'src/vs/workbench/api/common/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/common/extHostDataChannels.ts',
			'src/vs/workbench/api/common/extHostDebugService.ts',
			'src/vs/workbench/api/common/extHostExtensionActivator.ts',
			'src/vs/workbench/api/common/extHostExtensionService.ts',
			'src/vs/workbench/api/common/extHostFileSystemConsumer.ts',
			'src/vs/workbench/api/common/extHostFileSystemEventService.ts',
			'src/vs/workbench/api/common/extHostLanguageFeatures.ts',
			'src/vs/workbench/api/common/extHostLanguageModelTools.ts',
			'src/vs/workbench/api/common/extHostMcp.ts',
			'src/vs/workbench/api/common/extHostMemento.ts',
			'src/vs/workbench/api/common/extHostMessageService.ts',
			'src/vs/workbench/api/common/extHostNotebookDocument.ts',
			'src/vs/workbench/api/common/extHostNotebookDocumentSaveParticipant.ts',
			'src/vs/workbench/api/common/extHostRequireInterceptor.ts',
			'src/vs/workbench/api/common/extHostRpcService.ts',
			'src/vs/workbench/api/common/extHostSCM.ts',
			'src/vs/workbench/api/common/extHostSearch.ts',
			'src/vs/workbench/api/common/extHostStatusBar.ts',
			'src/vs/workbench/api/common/extHostStoragePaths.ts',
			'src/vs/workbench/api/common/extHostTelemetry.ts',
			'src/vs/workbench/api/common/extHostTesting.ts',
			'src/vs/workbench/api/common/extHostTextEditor.ts',
			'src/vs/workbench/api/common/extHostTimeline.ts',
			'src/vs/workbench/api/common/extHostTreeViews.ts',
			'src/vs/workbench/api/common/extHostTypeConverters.ts',
			'src/vs/workbench/api/common/extHostTypes.ts',
			'src/vs/workbench/api/common/extHostTypes/es5ClassCompat.ts',
			'src/vs/workbench/api/common/extHostTypes/location.ts',
			'src/vs/workbench/api/common/extHostWebview.ts',
			'src/vs/workbench/api/common/extHostWebviewMessaging.ts',
			'src/vs/workbench/api/common/extHostWebviewPanels.ts',
			'src/vs/workbench/api/common/extHostWebviewView.ts',
			'src/vs/workbench/api/common/extHostWorkspace.ts',
			'src/vs/workbench/api/common/extensionHostMain.ts',
			'src/vs/workbench/api/common/shared/tasks.ts',
			'src/vs/workbench/api/node/extHostAuthentication.ts',
			'src/vs/workbench/api/node/extHostCLIServer.ts',
			'src/vs/workbench/api/node/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/node/extHostDownloadService.ts',
			'src/vs/workbench/api/node/extHostExtensionService.ts',
			'src/vs/workbench/api/node/extHostMcpNode.ts',
			'src/vs/workbench/api/node/extensionHostProcess.ts',
			'src/vs/workbench/api/node/proxyResolver.ts',
			'src/vs/workbench/api/test/common/testRPCProtocol.ts',
			'src/vs/workbench/api/worker/extHostConsoleForwarder.ts',
			'src/vs/workbench/api/worker/extHostExtensionService.ts',
			'src/vs/workbench/api/worker/extensionHostWorker.ts',
			'src/vs/workbench/contrib/accessibility/browser/accessibilityConfiguration.ts',
			'src/vs/workbench/contrib/accessibilitySignals/browser/commands.ts',
			'src/vs/workbench/contrib/authentication/browser/actions/manageTrustedMcpServersForAccountAction.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/bulkTextEdits.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPane.ts',
			'src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPreview.ts',
			'src/vs/workbench/contrib/codeEditor/browser/inspectEditorTokens/inspectEditorTokens.ts',
			'src/vs/workbench/contrib/codeEditor/browser/outline/documentSymbolsOutline.ts',
			'src/vs/workbench/contrib/codeEditor/electron-browser/selectionClipboard.ts',
			'src/vs/workbench/contrib/commands/common/commands.contribution.ts',
			'src/vs/workbench/contrib/comments/browser/commentsTreeViewer.ts',
			'src/vs/workbench/contrib/comments/browser/commentsView.ts',
			'src/vs/workbench/contrib/comments/browser/reactionsAction.ts',
			'src/vs/workbench/contrib/customEditor/browser/customEditorInputFactory.ts',
			'src/vs/workbench/contrib/customEditor/browser/customEditors.ts',
			'src/vs/workbench/contrib/customEditor/common/customEditor.ts',
			'src/vs/workbench/contrib/debug/browser/debugActionViewItems.ts',
			'src/vs/workbench/contrib/debug/browser/debugAdapterManager.ts',
			'src/vs/workbench/contrib/debug/browser/debugCommands.ts',
			'src/vs/workbench/contrib/debug/browser/debugConfigurationManager.ts',
			'src/vs/workbench/contrib/debug/browser/debugEditorActions.ts',
			'src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts',
			'src/vs/workbench/contrib/debug/browser/debugHover.ts',
			'src/vs/workbench/contrib/debug/browser/debugService.ts',
			'src/vs/workbench/contrib/debug/browser/debugSession.ts',
			'src/vs/workbench/contrib/debug/browser/rawDebugSession.ts',
			'src/vs/workbench/contrib/debug/browser/repl.ts',
			'src/vs/workbench/contrib/debug/browser/replViewer.ts',
			'src/vs/workbench/contrib/debug/browser/variablesView.ts',
			'src/vs/workbench/contrib/debug/browser/watchExpressionsView.ts',
			'src/vs/workbench/contrib/debug/common/abstractDebugAdapter.ts',
			'src/vs/workbench/contrib/debug/common/debugger.ts',
			'src/vs/workbench/contrib/debug/common/replModel.ts',
			'src/vs/workbench/contrib/debug/test/common/mockDebug.ts',
			'src/vs/workbench/contrib/editSessions/common/workspaceStateSync.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/helpers/utils.ts',
			'src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetrySender.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionEditor.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionRecommendationNotificationService.ts',
			'src/vs/workbench/contrib/extensions/browser/extensions.contribution.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsActions.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsActivationProgress.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsViewer.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsViews.ts',
			'src/vs/workbench/contrib/extensions/browser/extensionsWorkbenchService.ts',
			'src/vs/workbench/contrib/extensions/common/extensions.ts',
			'src/vs/workbench/contrib/extensions/electron-browser/runtimeExtensionsEditor.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatActions.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatController.ts',
			'src/vs/workbench/contrib/inlineChat/browser/inlineChatStrategies.ts',
			'src/vs/workbench/contrib/markdown/browser/markdownDocumentRenderer.ts',
			'src/vs/workbench/contrib/markers/browser/markers.contribution.ts',
			'src/vs/workbench/contrib/markers/browser/markersView.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/commands/commands.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/utils.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/view/editorGutter.ts',
			'src/vs/workbench/contrib/mergeEditor/browser/view/mergeEditor.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/clipboard/notebookClipboard.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFind.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/layout/layoutActions.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/profile/notebookProfile.ts',
			'src/vs/workbench/contrib/notebook/browser/contrib/troubleshoot/layout.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/chat/cellChatActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/coreActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/editActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/notebookIndentationActions.ts',
			'src/vs/workbench/contrib/notebook/browser/controller/sectionActions.ts',
			'src/vs/workbench/contrib/notebook/browser/diff/diffComponents.ts',
			'src/vs/workbench/contrib/notebook/browser/diff/inlineDiff/notebookDeletedCellDecorator.ts',
			'src/vs/workbench/contrib/notebook/browser/notebookBrowser.ts',
			'src/vs/workbench/contrib/notebook/browser/outputEditor/notebookOutputEditor.ts',
			'src/vs/workbench/contrib/notebook/browser/services/notebookEditorServiceImpl.ts',
			'src/vs/workbench/contrib/notebook/browser/view/notebookCellList.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/backLayerWebView.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewMessages.ts',
			'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts',
			'src/vs/workbench/contrib/notebook/browser/viewModel/markupCellViewModel.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookEditorStickyScroll.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookHorizontalTracker.ts',
			'src/vs/workbench/contrib/notebook/browser/viewParts/notebookKernelQuickPickStrategy.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookCellTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookMetadataTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/model/notebookTextModel.ts',
			'src/vs/workbench/contrib/notebook/common/notebookCommon.ts',
			'src/vs/workbench/contrib/notebook/common/notebookEditorModelResolverServiceImpl.ts',
			'src/vs/workbench/contrib/notebook/test/browser/testNotebookEditor.ts',
			'src/vs/workbench/contrib/performance/electron-browser/startupProfiler.ts',
			'src/vs/workbench/contrib/preferences/browser/preferences.contribution.ts',
			'src/vs/workbench/contrib/preferences/browser/preferencesRenderers.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsEditor2.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTree.ts',
			'src/vs/workbench/contrib/preferences/browser/settingsTreeModels.ts',
			'src/vs/workbench/contrib/remote/browser/tunnelView.ts',
			'src/vs/workbench/contrib/search/browser/AISearch/aiSearchModel.ts',
			'src/vs/workbench/contrib/search/browser/AISearch/aiSearchModelBase.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModel.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/notebookSearchModelBase.ts',
			'src/vs/workbench/contrib/search/browser/notebookSearch/searchNotebookHelpers.ts',
			'src/vs/workbench/contrib/search/browser/replace.ts',
			'src/vs/workbench/contrib/search/browser/replaceService.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsCopy.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsFind.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsNav.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsRemoveReplace.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsTextQuickAccess.ts',
			'src/vs/workbench/contrib/search/browser/searchActionsTopBar.ts',
			'src/vs/workbench/contrib/search/browser/searchMessage.ts',
			'src/vs/workbench/contrib/search/browser/searchResultsView.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/fileMatch.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/folderMatch.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchModel.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchResult.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/searchTreeCommon.ts',
			'src/vs/workbench/contrib/search/browser/searchTreeModel/textSearchHeading.ts',
			'src/vs/workbench/contrib/search/browser/searchView.ts',
			'src/vs/workbench/contrib/search/test/browser/mockSearchTree.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditor.contribution.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditorActions.ts',
			'src/vs/workbench/contrib/searchEditor/browser/searchEditorInput.ts',
			'src/vs/workbench/contrib/snippets/browser/commands/configureSnippets.ts',
			'src/vs/workbench/contrib/snippets/browser/commands/insertSnippet.ts',
			'src/vs/workbench/contrib/snippets/browser/snippetsService.ts',
			'src/vs/workbench/contrib/tasks/browser/abstractTaskService.ts',
			'src/vs/workbench/contrib/tasks/browser/runAutomaticTasks.ts',
			'src/vs/workbench/contrib/tasks/browser/task.contribution.ts',
			'src/vs/workbench/contrib/tasks/browser/terminalTaskSystem.ts',
			'src/vs/workbench/contrib/tasks/common/jsonSchema_v1.ts',
			'src/vs/workbench/contrib/tasks/common/jsonSchema_v2.ts',
			'src/vs/workbench/contrib/tasks/common/problemMatcher.ts',
			'src/vs/workbench/contrib/tasks/common/taskConfiguration.ts',
			'src/vs/workbench/contrib/tasks/common/taskSystem.ts',
			'src/vs/workbench/contrib/tasks/common/tasks.ts',
			'src/vs/workbench/contrib/testing/common/storedValue.ts',
			'src/vs/workbench/contrib/testing/test/browser/testObjectTree.ts',
			'src/vs/workbench/contrib/typeHierarchy/browser/typeHierarchy.contribution.ts',
			'src/vs/workbench/contrib/typeHierarchy/common/typeHierarchy.ts',
			'src/vs/workbench/contrib/webview/browser/overlayWebview.ts',
			'src/vs/workbench/contrib/webview/browser/webview.ts',
			'src/vs/workbench/contrib/webview/browser/webviewElement.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewEditor.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewEditorInputSerializer.ts',
			'src/vs/workbench/contrib/webviewPanel/browser/webviewWorkbenchService.ts',
			'src/vs/workbench/contrib/welcomeGettingStarted/browser/gettingStartedService.ts',
			'src/vs/workbench/contrib/welcomeWalkthrough/browser/walkThroughPart.ts',
			'src/vs/workbench/services/authentication/common/authentication.ts',
			'src/vs/workbench/services/authentication/test/browser/authenticationQueryServiceMocks.ts',
			'src/vs/workbench/services/commands/common/commandService.ts',
			'src/vs/workbench/services/configurationResolver/common/configurationResolver.ts',
			'src/vs/workbench/services/configurationResolver/common/configurationResolverExpression.ts',
			'src/vs/workbench/services/extensions/common/extensionHostManager.ts',
			'src/vs/workbench/services/extensions/common/extensionsRegistry.ts',
			'src/vs/workbench/services/extensions/common/lazyPromise.ts',
			'src/vs/workbench/services/extensions/common/polyfillNestedWorker.protocol.ts',
			'src/vs/workbench/services/extensions/common/rpcProtocol.ts',
			'src/vs/workbench/services/extensions/worker/polyfillNestedWorker.ts',
			'src/vs/workbench/services/keybinding/browser/keybindingService.ts',
			'src/vs/workbench/services/keybinding/browser/keyboardLayoutService.ts',
			'src/vs/workbench/services/keybinding/common/keybindingEditing.ts',
			'src/vs/workbench/services/keybinding/common/keymapInfo.ts',
			'src/vs/workbench/services/language/common/languageService.ts',
			'src/vs/workbench/services/outline/browser/outline.ts',
			'src/vs/workbench/services/outline/browser/outlineService.ts',
			'src/vs/workbench/services/preferences/common/preferences.ts',
			'src/vs/workbench/services/preferences/common/preferencesModels.ts',
			'src/vs/workbench/services/preferences/common/preferencesValidation.ts',
			'src/vs/workbench/services/remote/common/tunnelModel.ts',
			'src/vs/workbench/services/search/common/replace.ts',
			'src/vs/workbench/services/search/common/search.ts',
			'src/vs/workbench/services/search/common/searchExtConversionTypes.ts',
			'src/vs/workbench/services/search/common/searchExtTypes.ts',
			'src/vs/workbench/services/search/node/fileSearch.ts',
			'src/vs/workbench/services/search/node/rawSearchService.ts',
			'src/vs/workbench/services/search/node/ripgrepTextSearchEngine.ts',
			'src/vs/workbench/services/textMate/common/TMGrammarFactory.ts',
			'src/vs/workbench/services/themes/browser/fileIconThemeData.ts',
			'src/vs/workbench/services/themes/browser/productIconThemeData.ts',
			'src/vs/workbench/services/themes/common/colorThemeData.ts',
			'src/vs/workbench/services/themes/common/plistParser.ts',
			'src/vs/workbench/services/themes/common/themeExtensionPoints.ts',
			'src/vs/workbench/services/themes/common/workbenchThemeService.ts',
			'src/vs/workbench/test/browser/workbenchTestServices.ts',
			'src/vs/workbench/test/common/workbenchTestServices.ts',
			'src/vs/workbench/test/electron-browser/workbenchTestServices.ts',
			'src/vs/workbench/workbench.web.main.internal.ts',
			'src/vs/workbench/workbench.web.main.ts',
			// Server
			'src/vs/server/node/remoteAgentEnvironmentImpl.ts',
			'src/vs/server/node/remoteExtensionHostAgentServer.ts',
			'src/vs/server/node/remoteExtensionsScanner.ts',
			// Tests
			'**/*.test.ts',
			'**/*.integrationTest.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': [
				'warn',
				{
					'fixToUnknown': false
				}
			]
		}
	},
	// Tests
	{
		files: [
			'**/*.test.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-dangerous-type-assertions': 'off',
			'local/code-must-use-super-dispose': 'off',
			'local/code-no-test-only': 'error',
			'local/code-no-test-async-suite': 'warn',
			'local/code-must-use-result': [
				'warn',
				[
					{
						'message': 'Expression must be awaited',
						'functions': [
							'assertSnapshot',
							'assertHeap'
						]
					}
				]
			]
		}
	},
	// vscode tests specific rules
	{
		files: [
			'src/vs/**/*.test.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-ensure-no-disposables-leak-in-test': [
				'warn',
				{
					// Files should (only) be removed from the list they adopt the leak detector
					'exclude': [
						'src/vs/workbench/services/userActivity/test/browser/domActivityTracker.test.ts',
					]
				}
			]
		}
	},
	// vscode API
	{
		files: [
			'**/vscode.d.ts',
			'**/vscode.proposed.*.d.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-syntax': [
				'warn',
				{
					'selector': `TSArrayType > TSUnionType`,
					'message': 'Use Array<...> for arrays of union types.'
				},
			],
			'local/vscode-dts-create-func': 'warn',
			'local/vscode-dts-literal-or-types': 'warn',
			'local/vscode-dts-string-type-literals': 'warn',
			'local/vscode-dts-interface-naming': 'warn',
			'local/vscode-dts-cancellation': 'warn',
			'local/vscode-dts-use-export': 'warn',
			'local/vscode-dts-use-thenable': 'warn',
			'local/vscode-dts-vscode-in-comments': 'warn',
			'local/vscode-dts-provider-naming': [
				'warn',
				{
					'allowed': [
						'FileSystemProvider',
						'TreeDataProvider',
						'TestProvider',
						'CustomEditorProvider',
						'CustomReadonlyEditorProvider',
						'TerminalLinkProvider',
						'AuthenticationProvider',
						'NotebookContentProvider'
					]
				}
			],
			'local/vscode-dts-event-naming': [
				'warn',
				{
					'allowed': [
						'onCancellationRequested',
						'event'
					],
					'verbs': [
						'accept',
						'change',
						'close',
						'collapse',
						'create',
						'delete',
						'discover',
						'dispose',
						'drop',
						'edit',
						'end',
						'execute',
						'expand',
						'grant',
						'hide',
						'invalidate',
						'open',
						'override',
						'perform',
						'receive',
						'register',
						'remove',
						'rename',
						'save',
						'send',
						'start',
						'terminate',
						'trigger',
						'unregister',
						'write',
						'commit'
					]
				}
			]
		}
	},
	// vscode.d.ts
	{
		files: [
			'**/vscode.d.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'jsdoc/tag-lines': 'off',
			'jsdoc/valid-types': 'off',
			'jsdoc/no-multi-asterisks': [
				'warn',
				{
					'allowWhitespace': true
				}
			],
			'jsdoc/require-jsdoc': [
				'warn',
				{
					'enableFixer': false,
					'contexts': [
						'TSInterfaceDeclaration',
						'TSPropertySignature',
						'TSMethodSignature',
						'TSDeclareFunction',
						'ClassDeclaration',
						'MethodDefinition',
						'PropertyDeclaration',
						'TSEnumDeclaration',
						'TSEnumMember',
						'ExportNamedDeclaration'
					]
				}
			],
			'jsdoc/check-param-names': [
				'warn',
				{
					'enableFixer': false,
					'checkDestructured': false
				}
			],
			'jsdoc/require-returns': 'warn'
		}
	},
	// common/browser layer
	{
		files: [
			'src/**/{common,browser}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-amd-node-module': 'warn'
		}
	},
	// node/electron layer
	{
		files: [
			'src/*.ts',
			'src/**/{node,electron-main,electron-utility}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context',
				// Below are globals that are unsupported in ESM
				'__dirname',
				'__filename',
				'require'
			]
		}
	},
	// browser/electron-browser layer
	{
		files: [
			'src/**/{browser,electron-browser}/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-global-document-listener': 'warn',
			'no-restricted-syntax': [
				'warn',
				{
					'selector': `NewExpression[callee.object.name='Intl']`,
					'message': 'Use safeIntl helper instead for safe and lazy use of potentially expensive Intl methods.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='MouseEvent']`,
					'message': 'Use DOM.isMouseEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name=/^HTML\\w+/]`,
					'message': 'Use DOM.isHTMLElement() and related methods to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name=/^SVG\\w+/]`,
					'message': 'Use DOM.isSVGElement() and related methods to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='KeyboardEvent']`,
					'message': 'Use DOM.isKeyboardEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='PointerEvent']`,
					'message': 'Use DOM.isPointerEvent() to support multi-window scenarios.'
				},
				{
					'selector': `BinaryExpression[operator='instanceof'][right.name='DragEvent']`,
					'message': 'Use DOM.isDragEvent() to support multi-window scenarios.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='activeElement']`,
					'message': 'Use <targetWindow>.document.activeElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='contains']`,
					'message': 'Use <targetWindow>.document.contains to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='styleSheets']`,
					'message': 'Use <targetWindow>.document.styleSheets to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='fullscreenElement']`,
					'message': 'Use <targetWindow>.document.fullscreenElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='body']`,
					'message': 'Use <targetWindow>.document.body to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='addEventListener']`,
					'message': 'Use <targetWindow>.document.addEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='removeEventListener']`,
					'message': 'Use <targetWindow>.document.removeEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='hasFocus']`,
					'message': 'Use <targetWindow>.document.hasFocus to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='head']`,
					'message': 'Use <targetWindow>.document.head to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='exitFullscreen']`,
					'message': 'Use <targetWindow>.document.exitFullscreen to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementById']`,
					'message': 'Use <targetWindow>.document.getElementById to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByClassName']`,
					'message': 'Use <targetWindow>.document.getElementsByClassName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByName']`,
					'message': 'Use <targetWindow>.document.getElementsByName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByTagName']`,
					'message': 'Use <targetWindow>.document.getElementsByTagName to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getElementsByTagNameNS']`,
					'message': 'Use <targetWindow>.document.getElementsByTagNameNS to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='getSelection']`,
					'message': 'Use <targetWindow>.document.getSelection to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='open']`,
					'message': 'Use <targetWindow>.document.open to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='close']`,
					'message': 'Use <targetWindow>.document.close to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='documentElement']`,
					'message': 'Use <targetWindow>.document.documentElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='visibilityState']`,
					'message': 'Use <targetWindow>.document.visibilityState to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='querySelector']`,
					'message': 'Use <targetWindow>.document.querySelector to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='querySelectorAll']`,
					'message': 'Use <targetWindow>.document.querySelectorAll to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='elementFromPoint']`,
					'message': 'Use <targetWindow>.document.elementFromPoint to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='elementsFromPoint']`,
					'message': 'Use <targetWindow>.document.elementsFromPoint to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onkeydown']`,
					'message': 'Use <targetWindow>.document.onkeydown to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onkeyup']`,
					'message': 'Use <targetWindow>.document.onkeyup to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onmousedown']`,
					'message': 'Use <targetWindow>.document.onmousedown to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='onmouseup']`,
					'message': 'Use <targetWindow>.document.onmouseup to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': `MemberExpression[object.name='document'][property.name='execCommand']`,
					'message': 'Use <targetWindow>.document.execCommand to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'querySelector\']',
					'message': 'querySelector should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'querySelectorAll\']',
					'message': 'querySelectorAll should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementById\']',
					'message': 'getElementById should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByClassName\']',
					'message': 'getElementsByClassName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByTagName\']',
					'message': 'getElementsByTagName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByName\']',
					'message': 'getElementsByName should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				},
				{
					'selector': 'CallExpression[callee.property.name=\'getElementsByTagNameNS\']',
					'message': 'getElementsByTagNameNS should not be used as relying on selectors is very fragile. Use dom.ts h() to build your elements and access them directly.'
				}
			],
			'no-restricted-globals': [
				'warn',
				'name',
				'length',
				'event',
				'closed',
				'external',
				'status',
				'origin',
				'orientation',
				'context',
				{
					'name': 'setInterval',
					'message': 'Use <targetWindow>.setInterval to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'clearInterval',
					'message': 'Use <targetWindow>.clearInterval to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'requestAnimationFrame',
					'message': 'Use <targetWindow>.requestAnimationFrame to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'cancelAnimationFrame',
					'message': 'Use <targetWindow>.cancelAnimationFrame to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'requestIdleCallback',
					'message': 'Use <targetWindow>.requestIdleCallback to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'cancelIdleCallback',
					'message': 'Use <targetWindow>.cancelIdleCallback to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'window',
					'message': 'Use <targetWindow> to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'addEventListener',
					'message': 'Use <targetWindow>.addEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'removeEventListener',
					'message': 'Use <targetWindow>.removeEventListener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'getComputedStyle',
					'message': 'Use <targetWindow>.getComputedStyle to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'focus',
					'message': 'Use <targetWindow>.focus to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'blur',
					'message': 'Use <targetWindow>.blur to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'close',
					'message': 'Use <targetWindow>.close to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'dispatchEvent',
					'message': 'Use <targetWindow>.dispatchEvent to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'getSelection',
					'message': 'Use <targetWindow>.getSelection to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'matchMedia',
					'message': 'Use <targetWindow>.matchMedia to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'open',
					'message': 'Use <targetWindow>.open to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'parent',
					'message': 'Use <targetWindow>.parent to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'postMessage',
					'message': 'Use <targetWindow>.postMessage to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'devicePixelRatio',
					'message': 'Use <targetWindow>.devicePixelRatio to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'frames',
					'message': 'Use <targetWindow>.frames to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'frameElement',
					'message': 'Use <targetWindow>.frameElement to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'innerHeight',
					'message': 'Use <targetWindow>.innerHeight to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'innerWidth',
					'message': 'Use <targetWindow>.innerWidth to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'outerHeight',
					'message': 'Use <targetWindow>.outerHeight to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'outerWidth',
					'message': 'Use <targetWindow>.outerWidth to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'opener',
					'message': 'Use <targetWindow>.opener to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'origin',
					'message': 'Use <targetWindow>.origin to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screen',
					'message': 'Use <targetWindow>.screen to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenLeft',
					'message': 'Use <targetWindow>.screenLeft to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenTop',
					'message': 'Use <targetWindow>.screenTop to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenX',
					'message': 'Use <targetWindow>.screenX to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'screenY',
					'message': 'Use <targetWindow>.screenY to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'scrollX',
					'message': 'Use <targetWindow>.scrollX to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'scrollY',
					'message': 'Use <targetWindow>.scrollY to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'top',
					'message': 'Use <targetWindow>.top to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				},
				{
					'name': 'visualViewport',
					'message': 'Use <targetWindow>.visualViewport to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.'
				}
			]
		}
	},
	// electron-utility layer
	{
		files: [
			'src/**/electron-utility/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'no-restricted-imports': [
				'warn',
				{
					'paths': [
						{
							'name': 'electron',
							'allowImportNames': [
								'net',
								'system-preferences',
							],
							'message': 'Only net and system-preferences are allowed to be imported from electron'
						}
					]
				}
			]
		}
	},
	{
		files: [
			'src/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'no-restricted-imports': [
				'warn',
				{
					'patterns': [
						{
							'group': ['dompurify*'],
							'message': 'Use domSanitize instead of dompurify directly'
						},
					]
				}
			],
			'local/code-import-patterns': [
				'warn',
				{
					// imports that are allowed in all files of layers:
					// - browser
					// - electron-browser
					'when': 'hasBrowser',
					'allow': []
				},
				{
					// imports that are allowed in all files of layers:
					// - node
					// - electron-utility
					// - electron-main
					'when': 'hasNode',
					'allow': [
						'@parcel/watcher',
						'@vscode/sqlite3',
						'@vscode/vscode-languagedetection',
						'@vscode/ripgrep',
						'@vscode/iconv-lite-umd',
						'@vscode/policy-watcher',
						'@vscode/proxy-agent',
						'@vscode/spdlog',
						'@vscode/windows-process-tree',
						'assert',
						'child_process',
						'console',
						'cookie',
						'crypto',
						'dns',
						'events',
						'fs',
						'fs/promises',
						'http',
						'https',
						'minimist',
						'node:module',
						'native-keymap',
						'native-watchdog',
						'net',
						'node-pty',
						'os',
						// 'path', NOT allowed: use src/vs/base/common/path.ts instead
						'perf_hooks',
						'readline',
						'stream',
						'string_decoder',
						'tas-client',
						'tls',
						'undici',
						'undici-types',
						'url',
						'util',
						'v8-inspect-profiler',
						'vscode-regexpp',
						'vscode-textmate',
						'worker_threads',
						'@xterm/addon-clipboard',
						'@xterm/addon-image',
						'@xterm/addon-ligatures',
						'@xterm/addon-search',
						'@xterm/addon-serialize',
						'@xterm/addon-unicode11',
						'@xterm/addon-webgl',
						'@xterm/headless',
						'@xterm/xterm',
						'yauzl',
						'yazl',
						'zlib'
					]
				},
				{
					// imports that are allowed in all files of layers:
					// - electron-utility
					// - electron-main
					'when': 'hasElectron',
					'allow': [
						'electron'
					]
				},
				{
					// imports that are allowed in all /test/ files
					'when': 'test',
					'allow': [
						'assert',
						'sinon',
						'sinon-test'
					]
				},
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// !!! Do not relax these rules !!!
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//
				// A path ending in /~ has a special meaning. It indicates a template position
				// which will be substituted with one or more layers.
				//
				// When /~ is used in the target, the rule will be expanded to 14 distinct rules.
				// e.g. 'src/vs/base/~' will be expanded to:
				//  - src/vs/base/common
				//  - src/vs/base/worker
				//  - src/vs/base/browser
				//  - src/vs/base/electron-browser
				//  - src/vs/base/node
				//  - src/vs/base/electron-main
				//  - src/vs/base/test/common
				//  - src/vs/base/test/worker
				//  - src/vs/base/test/browser
				//  - src/vs/base/test/electron-browser
				//  - src/vs/base/test/node
				//  - src/vs/base/test/electron-main
				//
				// When /~ is used in the restrictions, it will be replaced with the correct
				// layers that can be used e.g. 'src/vs/base/electron-browser' will be able
				// to import '{common,browser,electron-sanbox}', etc.
				//
				// It is possible to use /~ in the restrictions property even without using it in
				// the target property by adding a layer property.
				{
					'target': 'src/vs/base/~',
					'restrictions': [
						'vs/base/~'
					]
				},
				{
					'target': 'src/vs/base/parts/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~'
					]
				},
				{
					'target': 'src/vs/platform/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'tas-client', // node module allowed even in /common/
						'@microsoft/1ds-core-js', // node module allowed even in /common/
						'@microsoft/1ds-post-js', // node module allowed even in /common/
						'@xterm/headless' // node module allowed even in /common/
					]
				},
				{
					'target': 'src/vs/editor/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'@vscode/tree-sitter-wasm' // node module allowed even in /common/
					]
				},
				{
					'target': 'src/vs/editor/contrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~'
					]
				},
				{
					'target': 'src/vs/editor/standalone/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/standalone/~',
						'@vscode/tree-sitter-wasm' // type import
					]
				},
				{
					'target': 'src/vs/editor/editor.all.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~'
					]
				},
				{
					'target': 'src/vs/editor/editor.worker.start.ts',
					'layer': 'worker',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~'
					]
				},
				{
					'target': 'src/vs/editor/{editor.api.ts,editor.main.ts}',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/standalone/~',
						'vs/editor/*'
					]
				},
				{
					'target': 'src/vs/workbench/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'assert',
						{
							'when': 'test',
							'pattern': 'vs/workbench/contrib/*/~'
						} // TODO@layers
					]
				},
				{
					'target': 'src/vs/workbench/api/~',
					'restrictions': [
						'vscode',
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/api/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/services/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						{
							'when': 'test',
							'pattern': 'vs/workbench/contrib/*/~'
						}, // TODO@layers
						'tas-client', // node module allowed even in /common/
						'vscode-textmate', // node module allowed even in /common/
						'@vscode/vscode-languagedetection', // node module allowed even in /common/
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						} // node module allowed even in /browser/
					]
				},
				{
					'target': 'src/vs/workbench/contrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminal/terminalContribChatExports*',
						'vs/workbench/contrib/terminal/terminalContribExports*',
						'vscode-notebook-renderer', // Type only import
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/addon-*'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': 'vscode-textmate'
						} // node module allowed even in /browser/
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminalContrib/*/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/workbench/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						// Only allow terminalContrib to import from itself, this works because
						// terminalContrib is one extra folder deep
						'vs/workbench/contrib/terminalContrib/*/~',
						'vscode-notebook-renderer', // Type only import
						'@vscode/tree-sitter-wasm', // type import
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/xterm'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': '@xterm/addon-*'
						}, // node module allowed even in /browser/
						{
							'when': 'hasBrowser',
							'pattern': 'vscode-textmate'
						}, // node module allowed even in /browser/
						'@xterm/headless' // node module allowed even in /common/ and /browser/
					]
				},
				{
					'target': 'src/vs/code/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/code/~',
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/workbench.web.main.js'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/workbench.web.main.internal.js'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/~'
						},
						{
							'when': 'hasBrowser',
							'pattern': 'vs/workbench/services/*/~'
						}
					]
				},
				{
					'target': 'src/vs/server/~',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/server/~'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminal.all.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/workbench/contrib/**'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminalContribChatExports.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/contrib/terminal/terminalContribExports.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/platform/*/~',
						'vs/workbench/contrib/terminalContrib/*/~'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.common.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/contrib/terminal/terminal.all.js'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.web.main.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.common.main.js'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.web.main.internal.ts',
					'layer': 'browser',
					'restrictions': [
						'vs/base/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.common.main.js'
					]
				},
				{
					'target': 'src/vs/workbench/workbench.desktop.main.ts',
					'layer': 'electron-browser',
					'restrictions': [
						'vs/base/*/~',
						'vs/base/parts/*/~',
						'vs/platform/*/~',
						'vs/editor/~',
						'vs/editor/contrib/*/~',
						'vs/editor/editor.all.js',
						'vs/workbench/~',
						'vs/workbench/api/~',
						'vs/workbench/services/*/~',
						'vs/workbench/contrib/*/~',
						'vs/workbench/workbench.common.main.js'
					]
				},
				{
					'target': 'src/vs/amdX.ts',
					'restrictions': [
						'vs/base/common/*'
					]
				},
				{
					'target': 'src/vs/{loader.d.ts,monaco.d.ts,nls.ts,nls.messages.ts}',
					'restrictions': []
				},
				{
					'target': 'src/vscode-dts/**',
					'restrictions': []
				},
				{
					'target': 'src/vs/nls.ts',
					'restrictions': [
						'vs/*'
					]
				},
				{
					'target': 'src/{bootstrap-cli.ts,bootstrap-esm.ts,bootstrap-fork.ts,bootstrap-import.ts,bootstrap-meta.ts,bootstrap-node.ts,bootstrap-server.ts,cli.ts,main.ts,server-cli.ts,server-main.ts}',
					'restrictions': [
						'vs/**/common/*',
						'vs/**/node/*',
						'vs/nls.js',
						'src/*.js',
						'*' // node.js
					]
				}
			]
		}
	},
	{
		files: [
			'test/**/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-import-patterns': [
				'warn',
				{
					'target': 'test/smoke/**',
					'restrictions': [
						'test/automation',
						'test/smoke/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/automation/**',
					'restrictions': [
						'test/automation/**',
						'@vscode/*',
						'@parcel/*',
						'playwright-core/**',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/integration/**',
					'restrictions': [
						'test/integration/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/monaco/**',
					'restrictions': [
						'test/monaco/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'*' // node modules
					]
				},
				{
					'target': 'test/mcp/**',
					'restrictions': [
						'test/automation',
						'test/mcp/**',
						'@vscode/*',
						'@parcel/*',
						'@playwright/*',
						'@modelcontextprotocol/sdk/**/*',
						'*' // node modules
					]
				}
			]
		}
	},
	{
		files: [
			'src/vs/workbench/contrib/notebook/browser/view/renderers/*.ts'
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'local': pluginLocal,
		},
		rules: {
			'local/code-no-runtime-import': [
				'error',
				{
					'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts': [
						'**/*'
					]
				}
			],
			'local/code-limited-top-functions': [
				'error',
				{
					'src/vs/workbench/contrib/notebook/browser/view/renderers/webviewPreloads.ts': [
						'webviewPreloads',
						'preloadsScriptStr'
					]
				}
			]
		}
	},
	// Terminal
	{
		files: [
			'src/vs/workbench/contrib/terminal/**/*.ts',
			'src/vs/workbench/contrib/terminalContrib/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				// variableLike
				{ 'selector': 'variable', 'format': ['camelCase', 'UPPER_CASE', 'PascalCase'] },
				{ 'selector': 'variable', 'filter': '^I.+Service$', 'format': ['PascalCase'], 'prefix': ['I'] },
				// memberLike
				{ 'selector': 'memberLike', 'modifiers': ['private'], 'format': ['camelCase'], 'leadingUnderscore': 'require' },
				{ 'selector': 'memberLike', 'modifiers': ['protected'], 'format': ['camelCase'], 'leadingUnderscore': 'require' },
				{ 'selector': 'enumMember', 'format': ['PascalCase'] },
				// memberLike - Allow enum-like objects to use UPPER_CASE
				{ 'selector': 'method', 'modifiers': ['public'], 'format': ['camelCase', 'UPPER_CASE'] },
				// typeLike
				{ 'selector': 'typeLike', 'format': ['PascalCase'] },
				{ 'selector': 'interface', 'format': ['PascalCase'] }
			],
			'comma-dangle': ['warn', 'only-multiline']
		}
	},
	// markdown-language-features
	{
		files: [
			'extensions/markdown-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					'selector': 'default',
					'modifiers': ['private'],
					'format': null,
					'leadingUnderscore': 'require'
				},
				{
					'selector': 'default',
					'modifiers': ['public'],
					'format': null,
					'leadingUnderscore': 'forbid'
				}
			]
		}
	},
	// Additional extension strictness rules
	{
		files: [
			'extensions/markdown-language-features/**/*.ts',
			'extensions/mermaid-chat-features/**/*.ts',
			'extensions/media-preview/**/*.ts',
			'extensions/simple-browser/**/*.ts',
			'extensions/typescript-language-features/**/*.ts',
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: [
					// Markdown
					'extensions/markdown-language-features/tsconfig.json',
					'extensions/markdown-language-features/notebook/tsconfig.json',
					'extensions/markdown-language-features/preview-src/tsconfig.json',

					// Media preview
					'extensions/media-preview/tsconfig.json',

					// Media preview
					'extensions/simple-browser/tsconfig.json',
					'extensions/simple-browser/preview-src/tsconfig.json',

					// Mermaid chat features
					'extensions/mermaid-chat-features/tsconfig.json',
					'extensions/mermaid-chat-features/chat-webview-src/tsconfig.json',

					// TypeScript
					'extensions/typescript-language-features/tsconfig.json',
					'extensions/typescript-language-features/web/tsconfig.json',
				],
			}
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/prefer-optional-chain': 'warn',
			'@typescript-eslint/prefer-readonly': 'warn',
			'@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
		}
	},
);
```

--------------------------------------------------------------------------------

---[FILE: gulpfile.mjs]---
Location: vscode-main/gulpfile.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './build/gulpfile.ts';
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.txt]---
Location: vscode-main/LICENSE.txt

```text
MIT License

Copyright (c) 2015 - present Microsoft Corporation

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

````

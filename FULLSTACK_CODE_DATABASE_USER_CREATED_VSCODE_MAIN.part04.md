---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 4
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 4 of 552)

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

---[FILE: .devcontainer/README.md]---
Location: vscode-main/.devcontainer/README.md

```markdown
# Code - OSS Development Container

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/microsoft/vscode)

This repository includes configuration for a development container for working with Code - OSS in a local container or using [GitHub Codespaces](https://github.com/features/codespaces).

> **Tip:** The default VNC password is `vscode`. The VNC server runs on port `5901` and a web client is available on port `6080`.

## Quick start - local

If you already have VS Code and Docker installed, you can click the badge above or [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/microsoft/vscode) to get started. Clicking these links will cause VS Code to automatically install the Dev Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

1. Install Docker Desktop or Docker for Linux on your local machine. (See [docs](https://aka.ms/vscode-remote/containers/getting-started) for additional details.)

2. **Important**: Docker needs at least **4 Cores and 8 GB of RAM** to run a full build with **9 GB of RAM** being recommended. If you are on macOS, or are using the old Hyper-V engine for Windows, update these values for Docker Desktop by right-clicking on the Docker status bar item and going to **Preferences/Settings > Resources > Advanced**.

   > **Note:** The [Resource Monitor](https://marketplace.visualstudio.com/items?itemName=mutantdino.resourcemonitor) extension is included in the container so you can keep an eye on CPU/Memory in the status bar.

3. Install [Visual Studio Code Stable](https://code.visualstudio.com/) or [Insiders](https://code.visualstudio.com/insiders/) and the [Dev Containers](https://aka.ms/vscode-remote/download/containers) extension.

   ![Image of Dev Containers extension](https://microsoft.github.io/vscode-remote-release/images/dev-containers-extn.png)

   > **Note:** The Dev Containers extension requires the Visual Studio Code distribution of Code - OSS. See the [FAQ](https://aka.ms/vscode-remote/faq/license) for details.

4. Press <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>F1</kbd> and select **Dev Containers: Clone Repository in Container Volume...**.

   > **Tip:** While you can use your local source tree instead, operations like `npm i` can be slow on macOS or when using the Hyper-V engine on Windows. We recommend using the WSL filesystem on Windows or the "clone repository in container" approach on Windows and macOS instead since it uses "named volume" rather than the local filesystem.

5. Type `https://github.com/microsoft/vscode` (or a branch or PR URL) in the input box and press <kbd>Enter</kbd>.

6. After the container is running:
    1. If you have the `DISPLAY` or `WAYLAND_DISPLAY` environment variables set locally (or in WSL on Windows), desktop apps in the container will be shown in local windows.
    2. If these are not set, open a web browser and go to [http://localhost:6080](http://localhost:6080), or use a [VNC Viewer][def] to connect to `localhost:5901` and enter `vscode` as the password. Anything you start in VS Code, or the integrated terminal, will appear here.

Next: **[Try it out!](#try-it)**

## Quick start - GitHub Codespaces

1. From the [microsoft/vscode GitHub repository](https://github.com/microsoft/vscode), click on the **Code** dropdown, select **Open with Codespaces**, and then click on **New codespace**. If prompted, select the **Standard** machine size (which is also the default).

   > **Note:** You will not see these options within GitHub if you are not in the Codespaces beta.

2. After the codespace is up and running in your browser, press <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>F1</kbd> and select **Ports: Focus on Ports View**.

3. You should see **VNC web client (6080)** under in the list of ports. Select the line and click on the globe icon to open it in a browser tab.

    > **Tip:** If you do not see the port, <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>F1</kbd>, select **Forward a Port** and enter port `6080`.

4. In the new tab, you should see noVNC. Click **Connect** and enter `vscode` as the password.

Anything you start in VS Code, or the integrated terminal, will appear here.

Next: **[Try it out!](#try-it)**

### Using VS Code with GitHub Codespaces

You may see improved VNC responsiveness when accessing a codespace from VS Code client since you can use a [VNC Viewer][def]. Here's how to do it.

1. Install [Visual Studio Code Stable](https://code.visualstudio.com/) or [Insiders](https://code.visualstudio.com/insiders/) and the [GitHub Codespaces extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces).

    > **Note:** The GitHub Codespaces extension requires the Visual Studio Code distribution of Code - OSS.

2. After the VS Code is up and running, press <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>F1</kbd>, choose **Codespaces: Create New Codespace**, and use the following settings:

- `microsoft/vscode` for the repository.
- Select any branch (e.g. **main**) - you can select a different one later.
- Choose **Standard** (4-core, 8GB) as the size.

3. After you have connected to the codespace, you can use a [VNC Viewer][def] to connect to `localhost:5901` and enter `vscode` as the password.

    > **Tip:** You may also need change your VNC client's **Picture Quality** setting to **High** to get a full color desktop.

4. Anything you start in VS Code, or the integrated terminal, will appear here.

Next: **[Try it out!](#try-it)**

## Try it

This container uses the [Fluxbox](http://fluxbox.org/) window manager to keep things lean. **Right-click on the desktop** to see menu options. It works with GNOME and GTK applications, so other tools can be installed if needed.

   > **Note:** You can also set the resolution from the command line by typing `set-resolution`.

To start working with Code - OSS, follow these steps:

1. In your local VS Code client, open a terminal (<kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>\`</kbd>) and type the following commands:

   ```bash
   npm i
   bash scripts/code.sh
   ```

2. After the build is complete, open a web browser or a [VNC Viewer][def] to connect to the desktop environment as described in the quick start and enter `vscode` as the password.

3. You should now see Code - OSS!

Next, let's try debugging.

1. Shut down Code - OSS by clicking the box in the upper right corner of the Code - OSS window through your browser or VNC viewer.

2. Go to your local VS Code client, and use the **Run / Debug** view to launch the **VS Code** configuration. (Typically the default, so you can likely just press <kbd>F5</kbd>).

   > **Note:** If launching times out, you can increase the value of `timeout` in the "VS Code", "Attach Main Process", "Attach Extension Host", and "Attach to Shared Process" configurations in [launch.json](../.vscode/launch.json). However, running `./scripts/code.sh` first will set up Electron which will usually solve timeout issues.

3. After a bit, Code - OSS will appear with the debugger attached!

Enjoy!

### Notes

The container comes with VS Code Insiders installed. To run it from an Integrated Terminal use `VSCODE_IPC_HOOK_CLI= /usr/bin/code-insiders .`.

[def]: https://www.realvnc.com/en/connect/download/viewer/
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-amd-node-module.ts]---
Location: vscode-main/.eslint-plugin-local/code-amd-node-module.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { readFileSync } from 'fs';
import { join } from 'path';


export default new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			amdX: 'Use `import type` for import declarations, use `amdX#importAMDNodeModule` for import expressions'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const modules = new Set<string>();

		try {
			const packageJson = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf-8'));
			const { dependencies, optionalDependencies } = packageJson;
			const all = Object.keys(dependencies).concat(Object.keys(optionalDependencies));
			for (const key of all) {
				modules.add(key);
			}

		} catch (e) {
			console.error(e);
			throw e;
		}


		const checkImport = (node: ESTree.Literal & { parent?: ESTree.Node & { importKind?: string } }) => {

			if (typeof node.value !== 'string') {
				return;
			}

			if (node.parent?.type === 'ImportDeclaration' && node.parent.importKind === 'type') {
				return;
			}

			if (!modules.has(node.value)) {
				return;
			}

			context.report({
				node,
				messageId: 'amdX'
			});
		};

		return {
			['ImportExpression Literal']: checkImport,
			['ImportDeclaration Literal']: checkImport
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-declare-service-brand.ts]---
Location: vscode-main/.eslint-plugin-local/code-declare-service-brand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class DeclareServiceBrand implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		fixable: 'code',
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['PropertyDefinition[key.name="_serviceBrand"][value]']: (node: ESTree.PropertyDefinition) => {
				return context.report({
					node,
					message: `The '_serviceBrand'-property should not have a value`,
					fix: (fixer) => {
						return fixer.replaceText(node, 'declare _serviceBrand: undefined;');
					}
				});
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-ensure-no-disposables-leak-in-test.ts]---
Location: vscode-main/.eslint-plugin-local/code-ensure-no-disposables-leak-in-test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as estree from 'estree';

export default new class EnsureNoDisposablesAreLeakedInTestSuite implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		type: 'problem',
		messages: {
			ensure: 'Suites should include a call to `ensureNoDisposablesAreLeakedInTestSuite()` to ensure no disposables are leaked in tests.'
		},
		fixable: 'code',
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		const config = context.options[0] as { exclude: string[] };

		const needle = context.getFilename().replace(/\\/g, '/');
		if (config.exclude.some((e) => needle.endsWith(e))) {
			return {};
		}

		return {
			[`Program > ExpressionStatement > CallExpression[callee.name='suite']`]: (node: estree.Node) => {
				const src = context.getSourceCode().getText(node);
				if (!src.includes('ensureNoDisposablesAreLeakedInTestSuite(')) {
					context.report({
						node,
						messageId: 'ensure',
						fix: (fixer) => {
							const updatedSrc = src.replace(/(suite\(.*\n)/, '$1\n\tensureNoDisposablesAreLeakedInTestSuite();\n');
							return fixer.replaceText(node, updatedSrc);
						}
					});
				}
			},
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-import-patterns.ts]---
Location: vscode-main/.eslint-plugin-local/code-import-patterns.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import minimatch from 'minimatch';
import { createImportRuleListener } from './utils.ts';

const REPO_ROOT = path.normalize(path.join(import.meta.dirname, '../'));

interface ConditionalPattern {
	when?: 'hasBrowser' | 'hasNode' | 'hasElectron' | 'test';
	pattern: string;
}

interface RawImportPatternsConfig {
	target: string;
	layer?: 'common' | 'worker' | 'browser' | 'electron-browser' | 'node' | 'electron-utility' | 'electron-main';
	test?: boolean;
	restrictions: string | (string | ConditionalPattern)[];
}

interface LayerAllowRule {
	when: 'hasBrowser' | 'hasNode' | 'hasElectron' | 'test';
	allow: string[];
}

type RawOption = RawImportPatternsConfig | LayerAllowRule;

function isLayerAllowRule(option: RawOption): option is LayerAllowRule {
	return !!((option as LayerAllowRule).when && (option as LayerAllowRule).allow);
}

interface ImportPatternsConfig {
	target: string;
	restrictions: string[];
}

export default new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			badImport: 'Imports violates \'{{restrictions}}\' restrictions. See https://github.com/microsoft/vscode/wiki/Source-Code-Organization',
			badFilename: 'Missing definition in `code-import-patterns` for this file. Define rules at https://github.com/microsoft/vscode/blob/main/eslint.config.js',
			badAbsolute: 'Imports have to be relative to support ESM',
			badExtension: 'Imports have to end with `.js` or `.css` to support ESM',
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		const options = context.options as RawOption[];
		const configs = this._processOptions(options);
		const relativeFilename = getRelativeFilename(context);

		for (const config of configs) {
			if (minimatch(relativeFilename, config.target)) {
				return createImportRuleListener((node, value) => this._checkImport(context, config, node, value));
			}
		}

		context.report({
			loc: { line: 1, column: 0 },
			messageId: 'badFilename'
		});

		return {};
	}

	private _optionsCache = new WeakMap<RawOption[], ImportPatternsConfig[]>();

	private _processOptions(options: RawOption[]): ImportPatternsConfig[] {
		if (this._optionsCache.has(options)) {
			return this._optionsCache.get(options)!;
		}

		type Layer = 'common' | 'worker' | 'browser' | 'electron-browser' | 'node' | 'electron-utility' | 'electron-main';

		interface ILayerRule {
			layer: Layer;
			deps: string;
			isBrowser?: boolean;
			isNode?: boolean;
			isElectron?: boolean;
		}

		function orSegment(variants: Layer[]): string {
			return (variants.length === 1 ? variants[0] : `{${variants.join(',')}}`);
		}

		const layerRules: ILayerRule[] = [
			{ layer: 'common', deps: orSegment(['common']) },
			{ layer: 'worker', deps: orSegment(['common', 'worker']) },
			{ layer: 'browser', deps: orSegment(['common', 'browser']), isBrowser: true },
			{ layer: 'electron-browser', deps: orSegment(['common', 'browser', 'electron-browser']), isBrowser: true },
			{ layer: 'node', deps: orSegment(['common', 'node']), isNode: true },
			{ layer: 'electron-utility', deps: orSegment(['common', 'node', 'electron-utility']), isNode: true, isElectron: true },
			{ layer: 'electron-main', deps: orSegment(['common', 'node', 'electron-utility', 'electron-main']), isNode: true, isElectron: true },
		];

		let browserAllow: string[] = [];
		let nodeAllow: string[] = [];
		let electronAllow: string[] = [];
		let testAllow: string[] = [];
		for (const option of options) {
			if (isLayerAllowRule(option)) {
				if (option.when === 'hasBrowser') {
					browserAllow = option.allow.slice(0);
				} else if (option.when === 'hasNode') {
					nodeAllow = option.allow.slice(0);
				} else if (option.when === 'hasElectron') {
					electronAllow = option.allow.slice(0);
				} else if (option.when === 'test') {
					testAllow = option.allow.slice(0);
				}
			}
		}

		function findLayer(layer: Layer): ILayerRule | null {
			for (const layerRule of layerRules) {
				if (layerRule.layer === layer) {
					return layerRule;
				}
			}
			return null;
		}

		function generateConfig(layerRule: ILayerRule, target: string, rawRestrictions: (string | ConditionalPattern)[]): [ImportPatternsConfig, ImportPatternsConfig] {
			const restrictions: string[] = [];
			const testRestrictions: string[] = [...testAllow];

			if (layerRule.isBrowser) {
				restrictions.push(...browserAllow);
			}

			if (layerRule.isNode) {
				restrictions.push(...nodeAllow);
			}

			if (layerRule.isElectron) {
				restrictions.push(...electronAllow);
			}

			for (const rawRestriction of rawRestrictions) {
				let importPattern: string;
				let when: 'hasBrowser' | 'hasNode' | 'hasElectron' | 'test' | undefined = undefined;
				if (typeof rawRestriction === 'string') {
					importPattern = rawRestriction;
				} else {
					importPattern = rawRestriction.pattern;
					when = rawRestriction.when;
				}
				if (typeof when === 'undefined'
					|| (when === 'hasBrowser' && layerRule.isBrowser)
					|| (when === 'hasNode' && layerRule.isNode)
					|| (when === 'hasElectron' && layerRule.isElectron)
				) {
					restrictions.push(importPattern.replace(/\/\~$/, `/${layerRule.deps}/**`));
					testRestrictions.push(importPattern.replace(/\/\~$/, `/test/${layerRule.deps}/**`));
				} else if (when === 'test') {
					testRestrictions.push(importPattern.replace(/\/\~$/, `/${layerRule.deps}/**`));
					testRestrictions.push(importPattern.replace(/\/\~$/, `/test/${layerRule.deps}/**`));
				}
			}

			testRestrictions.push(...restrictions);

			return [
				{
					target: target.replace(/\/\~$/, `/${layerRule.layer}/**`),
					restrictions: restrictions
				},
				{
					target: target.replace(/\/\~$/, `/test/${layerRule.layer}/**`),
					restrictions: testRestrictions
				}
			];
		}

		const configs: ImportPatternsConfig[] = [];
		for (const option of options) {
			if (isLayerAllowRule(option)) {
				continue;
			}
			const target = option.target;
			const targetIsVS = /^src\/vs\//.test(target);
			const restrictions = (typeof option.restrictions === 'string' ? [option.restrictions] : option.restrictions).slice(0);

			if (targetIsVS) {
				// Always add "vs/nls" and "vs/amdX"
				restrictions.push('vs/nls.js');
				restrictions.push('vs/amdX.js'); // TODO@jrieken remove after ESM is real
			}

			if (targetIsVS && option.layer) {
				// single layer => simple substitution for /~
				const layerRule = findLayer(option.layer);
				if (layerRule) {
					const [config, testConfig] = generateConfig(layerRule, target, restrictions);
					if (option.test) {
						configs.push(testConfig);
					} else {
						configs.push(config);
					}
				}
			} else if (targetIsVS && /\/\~$/.test(target)) {
				// generate all layers
				for (const layerRule of layerRules) {
					const [config, testConfig] = generateConfig(layerRule, target, restrictions);
					configs.push(config);
					configs.push(testConfig);
				}
			} else {
				configs.push({ target, restrictions: restrictions.filter(r => typeof r === 'string') as string[] });
			}
		}
		this._optionsCache.set(options, configs);
		return configs;
	}

	private _checkImport(context: eslint.Rule.RuleContext, config: ImportPatternsConfig, node: TSESTree.Node, importPath: string) {
		const targetIsVS = /^src\/vs\//.test(getRelativeFilename(context));
		if (targetIsVS) {

			// ESM: check for import ending with ".js" or ".css"
			if (importPath[0] === '.' && !importPath.endsWith('.js') && !importPath.endsWith('.css')) {
				context.report({
					loc: node.loc,
					messageId: 'badExtension',
				});
			}

			// check for import being relative
			if (importPath.startsWith('vs/')) {
				context.report({
					loc: node.loc,
					messageId: 'badAbsolute',
				});
			}
		}

		// resolve relative paths
		if (importPath[0] === '.') {
			const relativeFilename = getRelativeFilename(context);
			importPath = path.posix.join(path.posix.dirname(relativeFilename), importPath);
			if (/^src\/vs\//.test(importPath)) {
				// resolve using base url
				importPath = importPath.substring('src/'.length);
			}
		}

		const restrictions = config.restrictions;

		let matched = false;
		for (const pattern of restrictions) {
			if (minimatch(importPath, pattern)) {
				matched = true;
				break;
			}
		}

		if (!matched) {
			// None of the restrictions matched
			context.report({
				loc: node.loc,
				messageId: 'badImport',
				data: {
					restrictions: restrictions.join(' or ')
				}
			});
		}
	}
};

/**
 * Returns the filename relative to the project root and using `/` as separators
 */
function getRelativeFilename(context: eslint.Rule.RuleContext): string {
	const filename = path.normalize(context.getFilename());
	return filename.substring(REPO_ROOT.length).replace(/\\/g, '/');
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-layering.ts]---
Location: vscode-main/.eslint-plugin-local/code-layering.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join, dirname } from 'path';
import { createImportRuleListener } from './utils.ts';

type Config = {
	allowed: Set<string>;
	disallowed: Set<string>;
};

export default new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			layerbreaker: 'Bad layering. You are not allowed to access {{from}} from here, allowed layers are: [{{allowed}}]'
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		},
		schema: [
			{
				type: 'object',
				additionalProperties: {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			}
		]
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const fileDirname = dirname(context.getFilename());
		const parts = fileDirname.split(/\\|\//);
		const ruleArgs = context.options[0] as Record<string, string[]>;
		let config: Config | undefined;
		for (let i = parts.length - 1; i >= 0; i--) {
			if (ruleArgs[parts[i]]) {
				config = {
					allowed: new Set(ruleArgs[parts[i]]).add(parts[i]),
					disallowed: new Set()
				};
				Object.keys(ruleArgs).forEach(key => {
					if (!config!.allowed.has(key)) {
						config!.disallowed.add(key);
					}
				});
				break;
			}
		}

		if (!config) {
			// nothing
			return {};
		}

		return createImportRuleListener((node, path) => {
			if (path[0] === '.') {
				path = join(dirname(context.getFilename()), path);
			}

			const parts = dirname(path).split(/\\|\//);
			for (let i = parts.length - 1; i >= 0; i--) {
				const part = parts[i];

				if (config!.allowed.has(part)) {
					// GOOD - same layer
					break;
				}

				if (config!.disallowed.has(part)) {
					// BAD - wrong layer
					context.report({
						loc: node.loc,
						messageId: 'layerbreaker',
						data: {
							from: part,
							allowed: [...config!.allowed.keys()].join(', ')
						}
					});
					break;
				}
			}
		});
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-limited-top-functions.ts]---
Location: vscode-main/.eslint-plugin-local/code-limited-top-functions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { dirname, relative } from 'path';
import minimatch from 'minimatch';
import type * as ESTree from 'estree';

export default new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			layerbreaker: 'You are only allowed to define limited top level functions.'
		},
		schema: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			}
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		let fileRelativePath = relative(dirname(import.meta.dirname), context.getFilename());
		if (!fileRelativePath.endsWith('/')) {
			fileRelativePath += '/';
		}
		const ruleArgs = context.options[0] as Record<string, string[]>;

		const matchingKey = Object.keys(ruleArgs).find(key => fileRelativePath.startsWith(key) || minimatch(fileRelativePath, key));
		if (!matchingKey) {
			// nothing
			return {};
		}

		const restrictedFunctions = ruleArgs[matchingKey];

		return {
			FunctionDeclaration: (node: ESTree.FunctionDeclaration & { parent?: ESTree.Node }) => {
				const isTopLevel = node.parent?.type === 'Program';
				const functionName = node.id.name;
				if (isTopLevel && !restrictedFunctions.includes(node.id.name)) {
					context.report({
						node,
						message: `Top-level function '${functionName}' is restricted in this file. Allowed functions are: ${restrictedFunctions.join(', ')}.`
					});
				}
			},
			ExportNamedDeclaration(node: ESTree.ExportNamedDeclaration & { parent?: ESTree.Node }) {
				if (node.declaration && node.declaration.type === 'FunctionDeclaration') {
					const functionName = node.declaration.id.name;
					const isTopLevel = node.parent?.type === 'Program';
					if (isTopLevel && !restrictedFunctions.includes(node.declaration.id.name)) {
						context.report({
							node,
							message: `Top-level function '${functionName}' is restricted in this file. Allowed functions are: ${restrictedFunctions.join(', ')}.`
						});
					}
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-must-use-result.ts]---
Location: vscode-main/.eslint-plugin-local/code-must-use-result.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

const VALID_USES = new Set<TSESTree.AST_NODE_TYPES | undefined>([
	TSESTree.AST_NODE_TYPES.AwaitExpression,
	TSESTree.AST_NODE_TYPES.VariableDeclarator,
]);

export default new class MustUseResults implements eslint.Rule.RuleModule {
	readonly meta: eslint.Rule.RuleMetaData = {
		schema: false
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const config = context.options[0] as { message: string; functions: string[] }[];
		const listener: eslint.Rule.RuleListener = {};

		for (const { message, functions } of config) {
			for (const fn of functions) {
				const query = `CallExpression[callee.property.name='${fn}'], CallExpression[callee.name='${fn}']`;
				listener[query] = (node: ESTree.Node) => {
					const callExpression = node as TSESTree.CallExpression;
					if (!VALID_USES.has(callExpression.parent?.type)) {
						context.report({ node, message });
					}
				};
			}
		}

		return listener;
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-must-use-super-dispose.ts]---
Location: vscode-main/.eslint-plugin-local/code-must-use-super-dispose.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class NoAsyncSuite implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		function doesCallSuperDispose(node: TSESTree.MethodDefinition) {

			if (!node.override) {
				return;
			}

			const body = context.getSourceCode().getText(node as ESTree.Node);

			if (body.includes('super.dispose')) {
				return;
			}

			context.report({
				node,
				message: 'dispose() should call super.dispose()'
			});
		}

		return {
			['MethodDefinition[override][key.name="dispose"]']: doesCallSuperDispose,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-any-casts.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-any-casts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';

export default new class NoAnyCasts implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			'TSTypeAssertion[typeAnnotation.type="TSAnyKeyword"], TSAsExpression[typeAnnotation.type="TSAnyKeyword"]': (node: TSESTree.TSTypeAssertion | TSESTree.TSAsExpression) => {
				context.report({
					node,
					message: `Avoid casting to 'any' type. Consider using a more specific type or type guards for better type safety.`
				});
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-dangerous-type-assertions.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-dangerous-type-assertions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

export default new class NoDangerousTypeAssertions implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			// Disallow type assertions on object literals: <T>{ ... } or {} as T
			['TSTypeAssertion > ObjectExpression, TSAsExpression > ObjectExpression']: (node: ESTree.ObjectExpression) => {
				const objectNode = node as TSESTree.ObjectExpression;

				const parent = objectNode.parent as TSESTree.TSTypeAssertion | TSESTree.TSAsExpression;
				if (
					// Allow `as const` assertions
					(parent.typeAnnotation.type === 'TSTypeReference' && parent.typeAnnotation.typeName.type === 'Identifier' && parent.typeAnnotation.typeName.name === 'const')

					// For also now still allow `any` casts
					|| (parent.typeAnnotation.type === 'TSAnyKeyword')
				) {
					return;
				}

				context.report({
					node,
					message: `Don't use type assertions for creating objects as this can hide type errors.`
				});
			},
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-deep-import-of-internal.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-deep-import-of-internal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join, dirname } from 'path';
import { createImportRuleListener } from './utils.ts';

export default new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noDeepImportOfInternal: 'No deep import of internal modules allowed! Use a re-export from a non-internal module instead. Internal modules can only be imported by direct parents (any module in {{parentDir}}).'
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		},
		schema: [
			{
				type: 'object',
				additionalProperties: {
					type: 'boolean'
				}
			}
		]
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		const patterns = context.options[0] as Record<string, boolean>;
		const internalModulePattern = Object.entries(patterns).map(([key, v]) => v ? key : undefined).filter((v): v is string => !!v);
		const allowedPatterns = Object.entries(patterns).map(([key, v]) => !v ? key : undefined).filter((v): v is string => !!v);

		return createImportRuleListener((node, path) => {
			const importerModuleDir = dirname(context.filename);
			if (path[0] === '.') {
				path = join(importerModuleDir, path);
			}
			const importedModulePath = path;

			const importerDirParts = splitParts(importerModuleDir);
			const importedModuleParts = splitParts(importedModulePath);

			for (let i = 0; i < importedModuleParts.length; i++) {
				if (internalModulePattern.some(p => importedModuleParts[i].match(p)) && allowedPatterns.every(p => !importedModuleParts[i].match(p))) {
					const importerDirJoined = importerDirParts.join('/');
					const expectedParentDir = importedModuleParts.slice(0, i).join('/');
					if (!importerDirJoined.startsWith(expectedParentDir)) {
						context.report({
							node,
							messageId: 'noDeepImportOfInternal',
							data: {
								parentDir: expectedParentDir
							}
						});
						return;
					}
				}
			}
		});
	}
};

function splitParts(path: string): string[] {
	return path.split(/\\|\//);
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-global-document-listener.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-global-document-listener.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';

export default new class NoGlobalDocumentListener implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			CallExpression(node: any) {
				if (
					(
						node.callee.name === 'addDisposableListener' ||
						node.callee.property?.name === 'addDisposableListener'
					) &&
					node.arguments.length > 0 &&
					node.arguments[0].type === 'Identifier' &&
					node.arguments[0].name === 'document'
				) {
					context.report({
						node,
						message: 'Use <targetWindow>.document to support multi-window scenarios. Resolve targetWindow with DOM.getWindow(element) or DOM.getActiveWindow() or use the predefined mainWindow constant.',
					});
				}
			},
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-in-operator.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-in-operator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

/**
 * Disallows the use of the `in` operator in TypeScript code, except within
 * type predicate functions (functions with `arg is Type` return types).
 *
 * The `in` operator can lead to runtime errors and type safety issues.
 * Consider using Object.hasOwn(), hasOwnProperty(), or other safer patterns.
 *
 * Exception: Type predicate functions are allowed to use the `in` operator
 * since they are the standard way to perform runtime type checking.
 */
export default new class NoInOperator implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noInOperator: 'The "in" operator should not be used. Use type discriminator properties and classes instead or the `hasKey`-utility.',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		function checkInOperator(inNode: ESTree.BinaryExpression) {
			const node = inNode as TSESTree.BinaryExpression;
			// Check if we're inside a type predicate function
			const ancestors = context.sourceCode.getAncestors(node as ESTree.Node);

			for (const ancestor of ancestors) {
				if (ancestor.type === 'FunctionDeclaration' ||
					ancestor.type === 'FunctionExpression' ||
					ancestor.type === 'ArrowFunctionExpression') {

					// Check if this function has a type predicate return type
					// Type predicates have the form: `arg is SomeType`
					if ((ancestor as { returnType?: any }).returnType?.typeAnnotation?.type === 'TSTypePredicate') {
						// This is a type predicate function, allow the "in" operator
						return;
					}
				}
			}

			context.report({
				node,
				messageId: 'noInOperator'
			});
		}

		return {
			['BinaryExpression[operator="in"]']: checkInOperator,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-localization-template-literals.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-localization-template-literals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';

/**
 * Prevents the use of template literals in localization function calls.
 *
 * vscode.l10n.t() and nls.localize() cannot handle string templating.
 * Use placeholders instead: vscode.l10n.t('Message {0}', value)
 *
 * Examples:
 * ❌ vscode.l10n.t(`Message ${value}`)
 * ✅ vscode.l10n.t('Message {0}', value)
 *
 * ❌ nls.localize('key', `Message ${value}`)
 * ✅ nls.localize('key', 'Message {0}', value)
 */
export default new class NoLocalizationTemplateLiterals implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noTemplateLiteral: 'Template literals cannot be used in localization calls. Use placeholders like {0}, {1} instead.'
		},
		docs: {
			description: 'Prevents template literals in vscode.l10n.t() and nls.localize() calls',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		function checkCallExpression(node: TSESTree.CallExpression) {
			const callee = node.callee;
			let isLocalizationCall = false;
			let isNlsLocalize = false;

			// Check for vscode.l10n.t()
			if (callee.type === 'MemberExpression') {
				const object = callee.object;
				const property = callee.property;

				// vscode.l10n.t
				if (object.type === 'MemberExpression') {
					const outerObject = object.object;
					const outerProperty = object.property;
					if (outerObject.type === 'Identifier' && outerObject.name === 'vscode' &&
						outerProperty.type === 'Identifier' && outerProperty.name === 'l10n' &&
						property.type === 'Identifier' && property.name === 't') {
						isLocalizationCall = true;
					}
				}

				// l10n.t or nls.localize or any *.localize
				if (object.type === 'Identifier' && property.type === 'Identifier') {
					if (object.name === 'l10n' && property.name === 't') {
						isLocalizationCall = true;
					} else if (property.name === 'localize') {
						isLocalizationCall = true;
						isNlsLocalize = true;
					}
				}
			}

			if (!isLocalizationCall) {
				return;
			}

			// For vscode.l10n.t(message, ...args) - check the first argument (message)
			// For nls.localize(key, message, ...args) - check first two arguments (key and message)
			const argsToCheck = isNlsLocalize ? 2 : 1;
			for (let i = 0; i < argsToCheck && i < node.arguments.length; i++) {
				const arg = node.arguments[i];
				if (arg && arg.type === 'TemplateLiteral' && arg.expressions.length > 0) {
					context.report({
						node: arg,
						messageId: 'noTemplateLiteral'
					});
				}
			}
		}

		return {
			CallExpression: (node: any) => checkCallExpression(node as TSESTree.CallExpression)
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-localized-model-description.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-localized-model-description.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import * as visitorKeys from 'eslint-visitor-keys';
import type * as ESTree from 'estree';

const MESSAGE_ID = 'noLocalizedModelDescription';
type NodeWithChildren = TSESTree.Node & {
	[key: string]: TSESTree.Node | TSESTree.Node[] | null | undefined;
};
type PropertyKeyNode = TSESTree.Property['key'] | TSESTree.MemberExpression['property'];
type AssignmentTarget = TSESTree.AssignmentExpression['left'];

export default new class NoLocalizedModelDescriptionRule implements eslint.Rule.RuleModule {
	meta: eslint.Rule.RuleMetaData = {
		messages: {
			[MESSAGE_ID]: 'modelDescription values describe behavior to the language model and must not use localized strings.'
		},
		type: 'problem',
		schema: false
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		const reportIfLocalized = (expression: TSESTree.Expression | null | undefined) => {
			if (expression && containsLocalizedCall(expression)) {
				context.report({ node: expression, messageId: MESSAGE_ID });
			}
		};

		return {
			Property: (node: ESTree.Property) => {
				const propertyNode = node as TSESTree.Property;
				if (!isModelDescriptionKey(propertyNode.key, propertyNode.computed)) {
					return;
				}
				reportIfLocalized(propertyNode.value as TSESTree.Expression);
			},
			AssignmentExpression: (node: ESTree.AssignmentExpression) => {
				const assignment = node as TSESTree.AssignmentExpression;
				if (!isModelDescriptionAssignmentTarget(assignment.left)) {
					return;
				}
				reportIfLocalized(assignment.right);
			}
		};
	}
};

function isModelDescriptionKey(key: PropertyKeyNode, computed: boolean | undefined): boolean {
	if (!computed && key.type === 'Identifier') {
		return key.name === 'modelDescription';
	}
	if (key.type === 'Literal' && key.value === 'modelDescription') {
		return true;
	}
	return false;
}

function isModelDescriptionAssignmentTarget(target: AssignmentTarget): target is TSESTree.MemberExpression {
	if (target.type === 'MemberExpression') {
		return isModelDescriptionKey(target.property, target.computed);
	}
	return false;
}

function containsLocalizedCall(expression: TSESTree.Expression): boolean {
	let found = false;

	const visit = (node: TSESTree.Node) => {
		if (found) {
			return;
		}

		if (isLocalizeCall(node)) {
			found = true;
			return;
		}

		for (const key of visitorKeys.KEYS[node.type] ?? []) {
			const value = (node as NodeWithChildren)[key];
			if (Array.isArray(value)) {
				for (const child of value) {
					if (child) {
						visit(child);
						if (found) {
							return;
						}
					}
				}
			} else if (value) {
				visit(value);
			}
		}
	};

	visit(expression);
	return found;
}

function isLocalizeCall(node: TSESTree.Node): boolean {
	if (node.type === 'CallExpression') {
		return isLocalizeCallee(node.callee);
	}
	if (node.type === 'ChainExpression') {
		return isLocalizeCall(node.expression);
	}
	return false;
}


function isLocalizeCallee(callee: TSESTree.CallExpression['callee']): boolean {
	if (callee.type === 'Identifier') {
		return callee.name === 'localize';
	}
	if (callee.type === 'MemberExpression') {
		if (!callee.computed && callee.property.type === 'Identifier') {
			return callee.property.name === 'localize';
		}
		if (callee.property.type === 'Literal' && callee.property.value === 'localize') {
			return true;
		}
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-native-private.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-native-private.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			slow: 'Native private fields are much slower and should only be used when needed. Ignore this warning if you know what you are doing, use compile-time private otherwise. See https://github.com/microsoft/vscode/issues/185991#issuecomment-1614468158 for details',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['PropertyDefinition PrivateIdentifier']: (node: ESTree.Node) => {
				context.report({
					node,
					messageId: 'slow'
				});
			},
			['MethodDefinition PrivateIdentifier']: (node: ESTree.Node) => {
				context.report({
					node,
					messageId: 'slow'
				});
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-nls-in-standalone-editor.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-nls-in-standalone-editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join } from 'path';
import { createImportRuleListener } from './utils.ts';

export default new class NoNlsInStandaloneEditorRule implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noNls: 'Not allowed to import vs/nls in standalone editor modules. Use standaloneStrings.ts'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const fileName = context.getFilename();
		if (
			/vs(\/|\\)editor(\/|\\)standalone(\/|\\)/.test(fileName)
			|| /vs(\/|\\)editor(\/|\\)common(\/|\\)standalone(\/|\\)/.test(fileName)
			|| /vs(\/|\\)editor(\/|\\)editor.api/.test(fileName)
			|| /vs(\/|\\)editor(\/|\\)editor.main/.test(fileName)
			|| /vs(\/|\\)editor(\/|\\)editor.worker.start/.test(fileName)
		) {
			return createImportRuleListener((node, path) => {
				// resolve relative paths
				if (path[0] === '.') {
					path = join(context.getFilename(), path);
				}

				if (
					/vs(\/|\\)nls/.test(path)
				) {
					context.report({
						loc: node.loc,
						messageId: 'noNls'
					});
				}
			});
		}

		return {};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-observable-get-in-reactive-context.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-observable-get-in-reactive-context.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import * as visitorKeys from 'eslint-visitor-keys';
import type * as ESTree from 'estree';

export default new class NoObservableGetInReactiveContext implements eslint.Rule.RuleModule {
	meta: eslint.Rule.RuleMetaData = {
		type: 'problem',
		docs: {
			description: 'Disallow calling .get() on observables inside reactive contexts in favor of .read(undefined).',
		},
		fixable: 'code',
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			'CallExpression': (node: ESTree.CallExpression) => {
				const callExpression = node as TSESTree.CallExpression;

				if (!isReactiveFunctionWithReader(callExpression.callee)) {
					return;
				}

				const functionArg = callExpression.arguments.find(arg =>
					arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression'
				) as TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | undefined;

				if (!functionArg) {
					return;
				}

				const readerName = getReaderParameterName(functionArg);
				if (!readerName) {
					return;
				}

				checkFunctionForObservableGetCalls(functionArg, readerName, context);
			}
		};
	}
};

function checkFunctionForObservableGetCalls(
	fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
	readerName: string,
	context: eslint.Rule.RuleContext
) {
	const visited = new Set<TSESTree.Node>();

	function traverse(node: TSESTree.Node) {
		if (visited.has(node)) {
			return;
		}
		visited.add(node);

		if (node.type === 'CallExpression' && isObservableGetCall(node)) {
			// Flag .get() calls since we're always in a reactive context here
			context.report({
				node: node,
				message: `Observable '.get()' should not be used in reactive context. Use '.read(${readerName})' instead to properly track dependencies or '.read(undefined)' to be explicit about an untracked read.`,
				fix: (fixer) => {
					const memberExpression = node.callee as TSESTree.MemberExpression;
					return fixer.replaceText(node, `${context.getSourceCode().getText(memberExpression.object as ESTree.Node)}.read(undefined)`);
				}
			});
		}

		walkChildren(node, traverse);
	}

	if (fn.body) {
		traverse(fn.body);
	}
}

function isObservableGetCall(node: TSESTree.CallExpression): boolean {
	// Look for pattern: something.get()
	if (node.callee.type === 'MemberExpression' &&
		node.callee.property.type === 'Identifier' &&
		node.callee.property.name === 'get' &&
		node.arguments.length === 0) {

		// This is a .get() call with no arguments, which is likely an observable
		return true;
	}
	return false;
}

const reactiveFunctions = new Set([
	'derived',
	'derivedDisposable',
	'derivedHandleChanges',
	'derivedOpts',
	'derivedWithSetter',
	'derivedWithStore',
	'autorun',
	'autorunOpts',
	'autorunHandleChanges',
	'autorunSelfDisposable',
	'autorunDelta',
	'autorunWithStore',
	'autorunWithStoreHandleChanges',
	'autorunIterableDelta'
]);

function getReaderParameterName(fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression): string | null {
	if (fn.params.length === 0) {
		return null;
	}
	const firstParam = fn.params[0];
	if (firstParam.type === 'Identifier') {
		// Accept any parameter name as a potential reader parameter
		// since reactive functions should always have the reader as the first parameter
		return firstParam.name;
	}
	return null;
}

function isReactiveFunctionWithReader(callee: TSESTree.Node): boolean {
	if (callee.type === 'Identifier') {
		return reactiveFunctions.has(callee.name);
	}
	return false;
}

function walkChildren(node: TSESTree.Node, cb: (child: TSESTree.Node) => void) {
	const keys = visitorKeys.KEYS[node.type] || [];
	for (const key of keys) {
		const child = (node as Record<string, any>)[key];
		if (Array.isArray(child)) {
			for (const item of child) {
				if (item && typeof item === 'object' && item.type) {
					cb(item);
				}
			}
		} else if (child && typeof child === 'object' && child.type) {
			cb(child);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-potentially-unsafe-disposables.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-potentially-unsafe-disposables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

/**
 * Checks for potentially unsafe usage of `DisposableStore` / `MutableDisposable`.
 *
 * These have been the source of leaks in the past.
 */
export default new class implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		function checkVariableDeclaration(inNode: ESTree.Node) {
			context.report({
				node: inNode,
				message: `Use const for 'DisposableStore' to avoid leaks by accidental reassignment.`
			});
		}

		function checkProperty(inNode: ESTree.Node) {
			context.report({
				node: inNode,
				message: `Use readonly for DisposableStore/MutableDisposable to avoid leaks through accidental reassignment.`
			});
		}

		return {
			'VariableDeclaration[kind!="const"] > VariableDeclarator > NewExpression[callee.name="DisposableStore"]': checkVariableDeclaration,

			'PropertyDefinition[readonly!=true][typeAnnotation.typeAnnotation.typeName.name=/DisposableStore|MutableDisposable/]': checkProperty,
			'PropertyDefinition[readonly!=true] > NewExpression[callee.name=/DisposableStore|MutableDisposable/]': checkProperty,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-reader-after-await.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-reader-after-await.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class NoReaderAfterAwait implements eslint.Rule.RuleModule {
	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			'CallExpression': (node: ESTree.CallExpression) => {
				const callExpression = node as TSESTree.CallExpression;

				if (!isFunctionWithReader(callExpression.callee)) {
					return;
				}

				const functionArg = callExpression.arguments.find(arg =>
					arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression'
				) as TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | undefined;

				if (!functionArg) {
					return;
				}

				const readerName = getReaderParameterName(functionArg);
				if (!readerName) {
					return;
				}

				checkFunctionForAwaitBeforeReader(functionArg, readerName, context);
			}
		};
	}
};

function checkFunctionForAwaitBeforeReader(
	fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
	readerName: string,
	context: eslint.Rule.RuleContext
) {
	const awaitPositions: { line: number; column: number }[] = [];
	const visited = new Set<TSESTree.Node>();

	function collectPositions(node: TSESTree.Node) {
		if (visited.has(node)) {
			return;
		}
		visited.add(node);

		if (node.type === 'AwaitExpression') {
			awaitPositions.push({
				line: node.loc?.start.line || 0,
				column: node.loc?.start.column || 0
			});
		} else if (node.type === 'CallExpression' && isReaderMethodCall(node, readerName)) {
			if (awaitPositions.length > 0) {
				const methodName = getMethodName(node);
				context.report({
					node: node,
					message: `Reader method '${methodName}' should not be called after 'await'. The reader becomes invalid after async operations.`
				});
			}
		}

		// Safely traverse known node types only
		switch (node.type) {
			case 'BlockStatement':
				node.body.forEach(stmt => collectPositions(stmt));
				break;
			case 'ExpressionStatement':
				collectPositions(node.expression);
				break;
			case 'VariableDeclaration':
				node.declarations.forEach(decl => {
					if (decl.init) { collectPositions(decl.init); }
				});
				break;
			case 'AwaitExpression':
				if (node.argument) { collectPositions(node.argument); }
				break;
			case 'CallExpression':
				node.arguments.forEach(arg => collectPositions(arg));
				break;
			case 'IfStatement':
				collectPositions(node.test);
				collectPositions(node.consequent);
				if (node.alternate) { collectPositions(node.alternate); }
				break;
			case 'TryStatement':
				collectPositions(node.block);
				if (node.handler) { collectPositions(node.handler.body); }
				if (node.finalizer) { collectPositions(node.finalizer); }
				break;
			case 'ReturnStatement':
				if (node.argument) { collectPositions(node.argument); }
				break;
			case 'BinaryExpression':
			case 'LogicalExpression':
				collectPositions(node.left);
				collectPositions(node.right);
				break;
			case 'MemberExpression':
				collectPositions(node.object);
				if (node.computed) { collectPositions(node.property); }
				break;
			case 'AssignmentExpression':
				collectPositions(node.left);
				collectPositions(node.right);
				break;
		}
	}

	if (fn.body) {
		collectPositions(fn.body);
	}
}

function getMethodName(callExpression: TSESTree.CallExpression): string {
	if (callExpression.callee.type === 'MemberExpression' &&
		callExpression.callee.property.type === 'Identifier') {
		return callExpression.callee.property.name;
	}
	return 'read';
}

function isReaderMethodCall(node: TSESTree.CallExpression, readerName: string): boolean {
	if (node.callee.type === 'MemberExpression') {
		// Pattern 1: reader.read() or reader.readObservable()
		if (node.callee.object.type === 'Identifier' &&
			node.callee.object.name === readerName &&
			node.callee.property.type === 'Identifier') {
			return ['read', 'readObservable'].includes(node.callee.property.name);
		}

		// Pattern 2: observable.read(reader) or observable.readObservable(reader)
		if (node.callee.property.type === 'Identifier' &&
			['read', 'readObservable'].includes(node.callee.property.name)) {
			// Check if the reader is passed as the first argument
			return node.arguments.length > 0 &&
				node.arguments[0].type === 'Identifier' &&
				node.arguments[0].name === readerName;
		}
	}
	return false;
}

const readerFunctions = new Set(['derived', 'autorun', 'autorunOpts', 'autorunHandleChanges', 'autorunSelfDisposable']);

function getReaderParameterName(fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression): string | null {
	if (fn.params.length === 0) {
		return null;
	}
	const firstParam = fn.params[0];
	if (firstParam.type === 'Identifier') {
		return firstParam.name;
	}
	return null;
}

function isFunctionWithReader(callee: TSESTree.Node): boolean {
	if (callee.type === 'Identifier') {
		return readerFunctions.has(callee.name);
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-runtime-import.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-runtime-import.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/typescript-estree';
import * as eslint from 'eslint';
import { dirname, join, relative } from 'path';
import minimatch from 'minimatch';
import { createImportRuleListener } from './utils.ts';

export default new class implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			layerbreaker: 'You are only allowed to import {{import}} from here using `import type ...`.'
		},
		schema: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			}
		}
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		let fileRelativePath = relative(dirname(import.meta.dirname), context.getFilename());
		if (!fileRelativePath.endsWith('/')) {
			fileRelativePath += '/';
		}
		const ruleArgs = context.options[0] as Record<string, string[]>;

		const matchingKey = Object.keys(ruleArgs).find(key => fileRelativePath.startsWith(key) || minimatch(fileRelativePath, key));
		if (!matchingKey) {
			// nothing
			return {};
		}

		const restrictedImports = ruleArgs[matchingKey];
		return createImportRuleListener((node, path) => {
			if (path[0] === '.') {
				path = join(dirname(context.getFilename()), path);
			}

			if ((
				restrictedImports.includes(path) || restrictedImports.some(restriction => minimatch(path, restriction))
			) && !(
				(node.parent?.type === TSESTree.AST_NODE_TYPES.ImportDeclaration && node.parent.importKind === 'type') ||
				(node.parent && 'exportKind' in node.parent && node.parent.exportKind === 'type'))) { // the export could be multiple types
				context.report({
					loc: node.parent!.loc,
					messageId: 'layerbreaker',
					data: {
						import: path
					}
				});
			}
		});
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-standalone-editor.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-standalone-editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { join } from 'path';
import { createImportRuleListener } from './utils.ts';

export default new class NoNlsInStandaloneEditorRule implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			badImport: 'Not allowed to import standalone editor modules.'
		},
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Source-Code-Organization'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		if (/vs(\/|\\)editor/.test(context.getFilename())) {
			// the vs/editor folder is allowed to use the standalone editor
			return {};
		}

		return createImportRuleListener((node, path) => {

			// resolve relative paths
			if (path[0] === '.') {
				path = join(context.getFilename(), path);
			}

			if (
				/vs(\/|\\)editor(\/|\\)standalone(\/|\\)/.test(path)
				|| /vs(\/|\\)editor(\/|\\)common(\/|\\)standalone(\/|\\)/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.api/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.main/.test(path)
				|| /vs(\/|\\)editor(\/|\\)editor.worker.start/.test(path)
			) {
				context.report({
					loc: node.loc,
					messageId: 'badImport'
				});
			}
		});
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-static-self-ref.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-static-self-ref.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

/**
 * WORKAROUND for https://github.com/evanw/esbuild/issues/3823
 */
export default new class implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		function checkProperty(inNode: TSESTree.PropertyDefinition) {

			const classDeclaration = context.sourceCode.getAncestors(inNode as ESTree.Node).find(node => node.type === 'ClassDeclaration');
			const propertyDefinition = inNode;

			if (!classDeclaration || !classDeclaration.id?.name) {
				return;
			}

			if (!propertyDefinition.value) {
				return;
			}

			const classCtor = classDeclaration.body.body.find(node => node.type === 'MethodDefinition' && node.kind === 'constructor');

			if (!classCtor || classCtor.type === 'StaticBlock') {
				return;
			}

			const name = classDeclaration.id.name;
			const valueText = context.sourceCode.getText(propertyDefinition.value as ESTree.Node);

			if (valueText.includes(name + '.')) {
				if (classCtor.value?.type === 'FunctionExpression' && !classCtor.value.params.find((param: any) => param.type === 'TSParameterProperty' && param.decorators?.length > 0)) {
					return;
				}

				context.report({
					loc: propertyDefinition.value.loc,
					message: `Static properties in decorated classes should not reference the class they are defined in. Use 'this' instead. This is a workaround for https://github.com/evanw/esbuild/issues/3823.`
				});
			}

		}

		return {
			'PropertyDefinition[static=true]': checkProperty,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-test-async-suite.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-test-async-suite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

function isCallExpression(node: TSESTree.Node): node is TSESTree.CallExpression {
	return node.type === 'CallExpression';
}

function isFunctionExpression(node: TSESTree.Node): node is TSESTree.FunctionExpression {
	return node.type.includes('FunctionExpression');
}

export default new class NoAsyncSuite implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		function hasAsyncSuite(node: ESTree.Node) {
			const tsNode = node as TSESTree.Node;
			if (isCallExpression(tsNode) && tsNode.arguments.length >= 2 && isFunctionExpression(tsNode.arguments[1]) && tsNode.arguments[1].async) {
				return context.report({
					node: tsNode,
					message: 'suite factory function should never be async'
				});
			}
		}

		return {
			['CallExpression[callee.name=/suite$/][arguments]']: hasAsyncSuite,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-test-only.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-test-only.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class NoTestOnly implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['MemberExpression[object.name=/^(test|suite)$/][property.name="only"]']: (node: ESTree.MemberExpression) => {
				return context.report({
					node,
					message: 'only is a dev-time tool and CANNOT be pushed'
				});
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-unexternalized-strings.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-unexternalized-strings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import type * as ESTree from 'estree';

function isStringLiteral(node: TSESTree.Node | ESTree.Node | null | undefined): node is TSESTree.StringLiteral {
	return !!node && node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string';
}

function isDoubleQuoted(node: TSESTree.StringLiteral): boolean {
	return node.raw[0] === '"' && node.raw[node.raw.length - 1] === '"';
}

/**
 * Enable bulk fixing double-quoted strings to single-quoted strings with the --fix eslint flag
 *
 * Disabled by default as this is often not the desired fix. Instead the string should be localized. However it is
 * useful for bulk conversations of existing code.
 */
const enableDoubleToSingleQuoteFixes = false;


export default new class NoUnexternalizedStrings implements eslint.Rule.RuleModule {

	private static _rNlsKeys = /^[_a-zA-Z0-9][ .\-_a-zA-Z0-9]*$/;

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			doubleQuoted: 'Only use double-quoted strings for externalized strings.',
			badKey: 'The key \'{{key}}\' doesn\'t conform to a valid localize identifier.',
			duplicateKey: 'Duplicate key \'{{key}}\' with different message value.',
			badMessage: 'Message argument to \'{{message}}\' must be a string literal.'
		},
		schema: false,
		fixable: enableDoubleToSingleQuoteFixes ? 'code' : undefined,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const externalizedStringLiterals = new Map<string, { call: TSESTree.CallExpression; message: TSESTree.Node }[]>();
		const doubleQuotedStringLiterals = new Set<TSESTree.Node>();

		function collectDoubleQuotedStrings(node: ESTree.Literal) {
			if (isStringLiteral(node) && isDoubleQuoted(node)) {
				doubleQuotedStringLiterals.add(node);
			}
		}

		function visitLocalizeCall(node: TSESTree.CallExpression) {

			// localize(key, message)
			const [keyNode, messageNode] = node.arguments;

			// (1)
			// extract key so that it can be checked later
			let key: string | undefined;
			if (isStringLiteral(keyNode)) {
				doubleQuotedStringLiterals.delete(keyNode);
				key = keyNode.value;

			} else if (keyNode.type === AST_NODE_TYPES.ObjectExpression) {
				for (const property of keyNode.properties) {
					if (property.type === AST_NODE_TYPES.Property && !property.computed) {
						if (property.key.type === AST_NODE_TYPES.Identifier && property.key.name === 'key') {
							if (isStringLiteral(property.value)) {
								doubleQuotedStringLiterals.delete(property.value);
								key = property.value.value;
								break;
							}
						}
					}
				}
			}
			if (typeof key === 'string') {
				let array = externalizedStringLiterals.get(key);
				if (!array) {
					array = [];
					externalizedStringLiterals.set(key, array);
				}
				array.push({ call: node, message: messageNode });
			}

			// (2)
			// remove message-argument from doubleQuoted list and make
			// sure it is a string-literal
			doubleQuotedStringLiterals.delete(messageNode);
			if (!isStringLiteral(messageNode)) {
				context.report({
					loc: messageNode.loc,
					messageId: 'badMessage',
					data: { message: context.getSourceCode().getText(node as ESTree.Node) }
				});
			}
		}

		function visitL10NCall(node: TSESTree.CallExpression) {

			// localize(key, message)
			const [messageNode] = (node as TSESTree.CallExpression).arguments;			// remove message-argument from doubleQuoted list and make
			// sure it is a string-literal
			if (isStringLiteral(messageNode)) {
				doubleQuotedStringLiterals.delete(messageNode);
			} else if (messageNode.type === AST_NODE_TYPES.ObjectExpression) {
				for (const prop of messageNode.properties) {
					if (prop.type === AST_NODE_TYPES.Property) {
						if (prop.key.type === AST_NODE_TYPES.Identifier && prop.key.name === 'message') {
							doubleQuotedStringLiterals.delete(prop.value);
							break;
						}
					}
				}
			}
		}

		function reportBadStringsAndBadKeys() {
			// (1)
			// report all strings that are in double quotes
			for (const node of doubleQuotedStringLiterals) {
				context.report({
					loc: node.loc,
					messageId: 'doubleQuoted',
					fix: enableDoubleToSingleQuoteFixes ? (fixer) => {
						// Get the raw string content, unescaping any escaped quotes
						const content = (node as ESTree.SimpleLiteral).raw!
							.slice(1, -1)
							.replace(/(?<!\\)\\'/g, `'`)
							.replace(/(?<!\\)\\"/g, `"`);

						// If the escaped content contains a single quote, use template string instead
						if (content.includes(`'`)
							&& !content.includes('${') // Unless the content has a template expressions
							&& !content.includes('`') // Or backticks which would need escaping
						) {
							const templateStr = `\`${content}\``;
							return fixer.replaceText(node, templateStr);
						}

						// Otherwise prefer using a single-quoted string
						const singleStr = `'${content.replace(/'/g, `\\'`)}'`;
						return fixer.replaceText(node, singleStr);
					} : undefined
				});
			}

			for (const [key, values] of externalizedStringLiterals) {

				// (2)
				// report all invalid NLS keys
				if (!key.match(NoUnexternalizedStrings._rNlsKeys)) {
					for (const value of values) {
						context.report({ loc: value.call.loc, messageId: 'badKey', data: { key } });
					}
				}

				// (2)
				// report all invalid duplicates (same key, different message)
				if (values.length > 1) {
					for (let i = 1; i < values.length; i++) {
						if (context.getSourceCode().getText(values[i - 1].message as ESTree.Node) !== context.getSourceCode().getText(values[i].message as ESTree.Node)) {
							context.report({ loc: values[i].call.loc, messageId: 'duplicateKey', data: { key } });
						}
					}
				}
			}
		}

		return {
			['Literal']: (node: ESTree.Literal) => collectDoubleQuotedStrings(node),
			['ExpressionStatement[directive] Literal:exit']: (node: TSESTree.Literal) => doubleQuotedStringLiterals.delete(node),

			// localize(...)
			['CallExpression[callee.type="MemberExpression"][callee.object.name="nls"][callee.property.name="localize"]:exit']: (node: TSESTree.CallExpression) => visitLocalizeCall(node),

			// localize2(...)
			['CallExpression[callee.type="MemberExpression"][callee.object.name="nls"][callee.property.name="localize2"]:exit']: (node: TSESTree.CallExpression) => visitLocalizeCall(node),

			// vscode.l10n.t(...)
			['CallExpression[callee.type="MemberExpression"][callee.object.property.name="l10n"][callee.property.name="t"]:exit']: (node: TSESTree.CallExpression) => visitL10NCall(node),

			// l10n.t(...)
			['CallExpression[callee.object.name="l10n"][callee.property.name="t"]:exit']: (node: TSESTree.CallExpression) => visitL10NCall(node),

			['CallExpression[callee.name="localize"][arguments.length>=2]:exit']: (node: TSESTree.CallExpression) => visitLocalizeCall(node),
			['CallExpression[callee.name="localize2"][arguments.length>=2]:exit']: (node: TSESTree.CallExpression) => visitLocalizeCall(node),
			['Program:exit']: reportBadStringsAndBadKeys,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-no-unused-expressions.ts]---
Location: vscode-main/.eslint-plugin-local/code-no-unused-expressions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// FORKED FROM https://github.com/eslint/eslint/blob/b23ad0d789a909baf8d7c41a35bc53df932eaf30/lib/rules/no-unused-expressions.js
// and added support for `OptionalCallExpression`, see https://github.com/facebook/create-react-app/issues/8107 and https://github.com/eslint/eslint/issues/12642

/**
 * @fileoverview Flag expressions in statement position that do not side effect
 * @author Michael Ficarra
 */

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import type * as ESTree from 'estree';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
	meta: {
		type: 'suggestion',

		docs: {
			description: 'disallow unused expressions',
			category: 'Best Practices',
			recommended: false,
			url: 'https://eslint.org/docs/rules/no-unused-expressions'
		},

		schema: [
			{
				type: 'object',
				properties: {
					allowShortCircuit: {
						type: 'boolean',
						default: false
					},
					allowTernary: {
						type: 'boolean',
						default: false
					},
					allowTaggedTemplates: {
						type: 'boolean',
						default: false
					}
				},
				additionalProperties: false
			}
		]
	},

	create(context: eslint.Rule.RuleContext) {
		const config = context.options[0] || {},
			allowShortCircuit = config.allowShortCircuit || false,
			allowTernary = config.allowTernary || false,
			allowTaggedTemplates = config.allowTaggedTemplates || false;


		/**
		 * @param node any node
		 * @returns whether the given node structurally represents a directive
		 */
		function looksLikeDirective(node: TSESTree.Node): boolean {
			return node.type === 'ExpressionStatement' &&
				node.expression.type === 'Literal' && typeof node.expression.value === 'string';
		}


		/**
		 * @param predicate ([a] -> Boolean) the function used to make the determination
		 * @param list the input list
		 * @returns the leading sequence of members in the given list that pass the given predicate
		 */
		function takeWhile<T>(predicate: (item: T) => boolean, list: T[]): T[] {
			for (let i = 0; i < list.length; ++i) {
				if (!predicate(list[i])) {
					return list.slice(0, i);
				}
			}
			return list.slice();
		}


		/**
		 * @param node a Program or BlockStatement node
		 * @returns the leading sequence of directive nodes in the given node's body
		 */
		function directives(node: TSESTree.Program | TSESTree.BlockStatement): TSESTree.Node[] {
			return takeWhile(looksLikeDirective, node.body);
		}


		/**
		 * @param node any node
		 * @param ancestors the given node's ancestors
		 * @returns whether the given node is considered a directive in its current position
		 */
		function isDirective(node: TSESTree.Node, ancestors: TSESTree.Node[]): boolean {
			const parent = ancestors[ancestors.length - 1],
				grandparent = ancestors[ancestors.length - 2];

			return (parent.type === 'Program' || parent.type === 'BlockStatement' &&
				(/Function/u.test(grandparent.type))) &&
				directives(parent).indexOf(node) >= 0;
		}

		/**
		 * Determines whether or not a given node is a valid expression. Recurses on short circuit eval and ternary nodes if enabled by flags.
		 * @param node any node
		 * @returns whether the given node is a valid expression
		 */
		function isValidExpression(node: TSESTree.Node): boolean {
			if (allowTernary) {

				// Recursive check for ternary and logical expressions
				if (node.type === 'ConditionalExpression') {
					return isValidExpression(node.consequent) && isValidExpression(node.alternate);
				}
			}

			if (allowShortCircuit) {
				if (node.type === 'LogicalExpression') {
					return isValidExpression(node.right);
				}
			}

			if (allowTaggedTemplates && node.type === 'TaggedTemplateExpression') {
				return true;
			}

			if (node.type === 'ExpressionStatement') {
				return isValidExpression(node.expression);
			}

			return /^(?:Assignment|OptionalCall|Call|New|Update|Yield|Await|Chain)Expression$/u.test(node.type) ||
				(node.type === 'UnaryExpression' && ['delete', 'void'].indexOf(node.operator) >= 0);
		}

		return {
			ExpressionStatement(node: TSESTree.ExpressionStatement) {
				if (!isValidExpression(node.expression) && !isDirective(node, context.sourceCode.getAncestors(node as ESTree.Node) as TSESTree.Node[])) {
					context.report({ node: node as ESTree.Node, message: `Expected an assignment or function call and instead saw an expression. ${node.expression}` });
				}
			}
		};

	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-parameter-properties-must-have-explicit-accessibility.ts]---
Location: vscode-main/.eslint-plugin-local/code-parameter-properties-must-have-explicit-accessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';

/**
 * Enforces that all parameter properties have an explicit access modifier (public, protected, private).
 *
 * This catches a common bug where a service is accidentally made public by simply writing: `readonly prop: Foo`
 */
export default new class implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		function check(node: TSESTree.TSParameterProperty) {

			// For now, only apply to injected services
			const firstDecorator = node.decorators?.at(0);
			if (
				firstDecorator?.expression.type !== 'Identifier'
				|| !firstDecorator.expression.name.endsWith('Service')
			) {
				return;
			}

			if (!node.accessibility) {
				context.report({
					node: node,
					message: 'Parameter properties must have an explicit access modifier.'
				});
			}
		}

		return {
			['TSParameterProperty']: check,
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-policy-localization-key-match.ts]---
Location: vscode-main/.eslint-plugin-local/code-policy-localization-key-match.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

/**
 * Ensures that localization keys in policy blocks match the keys used in nls.localize() calls.
 *
 * For example, in a policy block with:
 * ```
 * localization: {
 *   description: {
 *     key: 'autoApprove2.description',
 *     value: nls.localize('autoApprove2.description', '...')
 *   }
 * }
 * ```
 *
 * The key property ('autoApprove2.description') must match the first argument
 * to nls.localize() ('autoApprove2.description').
 */
export default new class PolicyLocalizationKeyMatch implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			mismatch: 'Localization key "{{keyValue}}" does not match the key used in nls.localize("{{localizeKey}}", ...). They must be identical.'
		},
		docs: {
			description: 'Ensures that localization keys in policy blocks match the keys used in nls.localize() calls',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		function checkLocalizationObject(node: ESTree.ObjectExpression) {
			// Look for objects with structure: { key: '...', value: nls.localize('...', '...') }

			let keyProperty: ESTree.Property | undefined;
			let valueProperty: ESTree.Property | undefined;

			for (const property of node.properties) {
				if (property.type !== 'Property') {
					continue;
				}

				const propertyKey = property.key;
				if (propertyKey.type === 'Identifier') {
					if (propertyKey.name === 'key') {
						keyProperty = property;
					} else if (propertyKey.name === 'value') {
						valueProperty = property;
					}
				}
			}

			if (!keyProperty || !valueProperty) {
				return;
			}

			// Extract the key value (should be a string literal)
			let keyValue: string | undefined;
			if (keyProperty.value.type === 'Literal' && typeof keyProperty.value.value === 'string') {
				keyValue = keyProperty.value.value;
			}

			if (!keyValue) {
				return;
			}

			// Check if value is a call to localize or any namespace's localize method
			if (valueProperty.value.type === 'CallExpression') {
				const callee = valueProperty.value.callee;

				// Check if it's <anything>.localize or just localize
				let isLocalizeCall = false;
				if (callee.type === 'MemberExpression') {
					const object = callee.object;
					const property = callee.property;
					if (object.type === 'Identifier' &&
						property.type === 'Identifier' && property.name === 'localize') {
						isLocalizeCall = true;
					}
				} else if (callee.type === 'Identifier' && callee.name === 'localize') {
					// Direct localize() call
					isLocalizeCall = true;
				}

				if (isLocalizeCall) {
					// Get the first argument to localize (the key)
					const args = valueProperty.value.arguments;
					if (args.length > 0) {
						const firstArg = args[0];
						if (firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
							const localizeKey = firstArg.value;

							// Compare the keys
							if (keyValue !== localizeKey) {
								context.report({
									node: keyProperty.value,
									messageId: 'mismatch',
									data: {
										keyValue,
										localizeKey
									}
								});
							}
						}
					}
				}
			}
		}

		function isInPolicyBlock(node: ESTree.Node): boolean {
			// Walk up the AST to see if we're inside a policy object
			const ancestors = context.sourceCode.getAncestors(node);

			for (const ancestor of ancestors) {
				if (ancestor.type === 'Property') {
					// eslint-disable-next-line local/code-no-any-casts
					const property = ancestor as any;
					if (property.key && property.key.type === 'Identifier' && property.key.name === 'policy') {
						return true;
					}
				}
			}

			return false;
		}

		return {
			'ObjectExpression': (node: ESTree.ObjectExpression) => {
				// Only check objects inside policy blocks
				if (!isInPolicyBlock(node)) {
					return;
				}

				// Check if this object has the pattern we're looking for
				checkLocalizationObject(node);
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/code-translation-remind.ts]---
Location: vscode-main/.eslint-plugin-local/code-translation-remind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';
import { readFileSync } from 'fs';
import { createImportRuleListener } from './utils.ts';


export default new class TranslationRemind implements eslint.Rule.RuleModule {

	private static NLS_MODULE = 'vs/nls';

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			missing: 'Please add \'{{resource}}\' to ./build/lib/i18n.resources.json file to use translations here.'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return createImportRuleListener((node, path) => this._checkImport(context, node, path));
	}

	private _checkImport(context: eslint.Rule.RuleContext, node: TSESTree.Node, path: string) {

		if (path !== TranslationRemind.NLS_MODULE) {
			return;
		}

		const currentFile = context.getFilename();
		const matchService = currentFile.match(/vs\/workbench\/services\/\w+/);
		const matchPart = currentFile.match(/vs\/workbench\/contrib\/\w+/);
		if (!matchService && !matchPart) {
			return;
		}

		const resource = matchService ? matchService[0] : matchPart![0];
		let resourceDefined = false;

		let json;
		try {
			json = readFileSync('./build/lib/i18n.resources.json', 'utf8');
		} catch (e) {
			console.error('[translation-remind rule]: File with resources to pull from Transifex was not found. Aborting translation resource check for newly defined workbench part/service.');
			return;
		}
		const workbenchResources = JSON.parse(json).workbench;

		workbenchResources.forEach((existingResource: any) => {
			if (existingResource.name === resource) {
				resourceDefined = true;
				return;
			}
		});

		if (!resourceDefined) {
			context.report({
				loc: node.loc,
				messageId: 'missing',
				data: { resource }
			});
		}
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/index.ts]---
Location: vscode-main/.eslint-plugin-local/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { LooseRuleDefinition } from '@typescript-eslint/utils/ts-eslint';
import glob from 'glob';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

// Re-export all .ts files as rules
const rules: Record<string, LooseRuleDefinition> = {};
glob.sync(`${import.meta.dirname}/*.ts`)
	.filter(file => !file.endsWith('index.ts') && !file.endsWith('utils.ts'))
	.map(file => {
		rules[path.basename(file, '.ts')] = require(file).default;
	});

export { rules };
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/package.json]---
Location: vscode-main/.eslint-plugin-local/package.json

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "typecheck": "tsgo -p tsconfig.json --noEmit"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/README.md]---
Location: vscode-main/.eslint-plugin-local/README.md

```markdown
# Custom ESLint rules

We use a set of custom [ESLint](http://eslint.org) to enforce repo specific coding rules and styles. These custom rules are run in addition to many standard ESLint rules we enable in the project. Some example custom rules includes:

- Enforcing proper code layering
- Preventing checking in of `test.only(...)`
- Enforcing conventions in `vscode.d.ts`

Custom rules are mostly used for enforcing or banning certain coding patterns. We tend to leave stylistic choices up to area owners unless there's a good reason to enforce something project wide.

This doc provides a brief overview of how these rules are setup and how you can add a new one.

# Resources
- [ESLint rules](https://eslint.org/docs/latest/extend/custom-rules) — General documentation about writing eslint rules
- [TypeScript ASTs and eslint](https://typescript-eslint.io/blog/asts-and-typescript-eslint/) — Look at how ESLint works with TS programs
- [ESTree selectors](https://eslint.org/docs/latest/extend/selectors)  — Info about the selector syntax rules use to target specific nodes in an AST. Works similarly to css selectors.
- [TypeScript ESLint playground](https://typescript-eslint.io/play/#showAST=es) — Useful tool for figuring out the structure of TS programs and debugging custom rule selectors


# Custom Rule Configuration

Custom rules are defined in the `.eslint-plugin-local` folder. Each rule is defined in its own TypeScript file. These follow the naming convention:

- `code-RULE-NAME.ts` — General rules that apply to the entire repo.
- `vscode-dts-RULE-NAME.ts` — Rules that apply just to `vscode.d.ts`.

These rules are then enabled in the `eslint.config.js` file. This is the main eslint configuration for our repo. It defines a set of file scopes which rules should apply to files in those scopes.

For example, here's a configuration that enables the no `test.only` rule in all `*.test.ts` files in the VS Code repo:

```ts
{
    // Define which files these rules apply to
    files: [
        '**/*.test.ts'
    ],
    languageOptions: { parser: tseslint.parser, },
    plugins: {
        'local': pluginLocal,
    },
    rules: {
         // Enable the rule from .eslint-plugin-local/code-no-test-only.ts
        'local/code-no-test-only': 'error',
    }
}
```

# Creating a new custom rule
This walks through the steps to create a new eslint rule:

1. Create a new rule file under `.eslint-plugin-local`. Generally you should call it `code-YOUR-RULE-NAME.ts`, for example, `.eslint-plugin-local/code-no-not-null-assertions-on-undefined-values.ts`

2. In this file, add the rule. Here's a template:

    ```ts
    /*---------------------------------------------------------------------------------------------
    *  Copyright (c) Microsoft Corporation. All rights reserved.
    *  Licensed under the MIT License. See License.txt in the project root for license information.
    *--------------------------------------------------------------------------------------------*/

    import * as eslint from 'eslint';

    export = new class YourRuleName implements eslint.Rule.RuleModule {

        readonly meta: eslint.Rule.RuleMetaData = {
            messages: {
                customMessageName: 'message text shown in errors/warnings',
            },
            schema: false,
        };

        create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
            return {
                [SELECTOR]: (node: any) => {
                    // Report errors if needed
                    return context.report({
                        node,
                        messageId: 'customMessageName'
                    });
                }
            };
        }
    };
    ```

    - Update the name of the class to match the name of your rule
    - Add message entries for any errors you want to report
    - Update `SELECTOR` with the [ESTree selector](https://eslint.org/docs/latest/extend/selectors) needed to target the nodes you are interested in. Use the [TypeScript ESLint playground](https://typescript-eslint.io/play/#showAST=es) to figure out which nodes you need and debug selectors

3. Register the rule in `eslint.config.js`

    Generally this is just turning on the rule in the rule list like so:

    ```js
    rules: {
         // Name should match file name
	'local/code-no-not-null-assertions-on-undefined-values': 'warn',
        ...
    }
    ```

Rules can also take custom arguments. For example, here's how we can pass arguments to a custom rule in the `eslint.config.js`:

```
rules: {
    'local/code-no-not-null-assertions-on-undefined-values': ['warn', { testsOk: true }],
    ...
}
```

In these cases make sure to update the `meta.schema` property on your rule with the JSON schema for the arguments. You can access these arguments using `context.options` in the rule `create` function


## Adding fixes to custom rules
Fixes are a useful way to mechanically fix basic linting issues, such as auto inserting semicolons. These fixes typically work at the AST level, so they are a more reliable way to perform bulk fixes compared to find/replaces.

To add a fix for a custom rule:

1. On the `meta` for your rule, add `fixable: 'code'`

2. When reporting an error in the rule, also include a `fix`. This is a function that takes a `fixer` argument and returns one or more fixes.

See the [Double quoted to single quoted string covert fix](https://github.com/microsoft/vscode/blob/b074375e1884ae01033967bf0bbceeaa4795354a/.eslint-plugin-local/code-no-unexternalized-strings.ts#L128) for an example. The ESLint docs also have [details on adding fixes and the fixer api](https://eslint.org/docs/latest/extend/custom-rules#applying-fixes)

The fixes can be run using `npx eslint --fix` in the VS Code repo
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/tsconfig.json]---
Location: vscode-main/.eslint-plugin-local/tsconfig.json

```json
{
	"compilerOptions": {
		"target": "es2024",
		"lib": [
			"ES2024"
		],
		"rootDir": ".",
		"module": "esnext",
		"allowImportingTsExtensions": true,
		"erasableSyntaxOnly": true,
		"verbatimModuleSyntax": true,
		"noEmit": true,
		"strict": true,
		"exactOptionalPropertyTypes": false,
		"useUnknownInCatchVariables": false,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"typeRoots": [
			"."
		]
	},
	"include": [
		"./**/*.ts",
	],
	"exclude": [
		"node_modules/**",
		"./tests/**"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/utils.ts]---
Location: vscode-main/.eslint-plugin-local/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

export function createImportRuleListener(validateImport: (node: TSESTree.Literal, value: string) => any): eslint.Rule.RuleListener {

	function _checkImport(node: TSESTree.Node | null) {
		if (node && node.type === 'Literal' && typeof node.value === 'string') {
			validateImport(node, node.value);
		}
	}

	return {
		// import ??? from 'module'
		ImportDeclaration: (node: ESTree.ImportDeclaration) => {
			_checkImport((node as TSESTree.ImportDeclaration).source);
		},
		// import('module').then(...) OR await import('module')
		['CallExpression[callee.type="Import"][arguments.length=1] > Literal']: (node: TSESTree.Literal) => {
			_checkImport(node);
		},
		// import foo = ...
		['TSImportEqualsDeclaration > TSExternalModuleReference > Literal']: (node: TSESTree.Literal) => {
			_checkImport(node);
		},
		// export ?? from 'module'
		ExportAllDeclaration: (node: ESTree.ExportAllDeclaration) => {
			_checkImport((node as TSESTree.ExportAllDeclaration).source);
		},
		// export {foo} from 'module'
		ExportNamedDeclaration: (node: ESTree.ExportNamedDeclaration) => {
			_checkImport((node as TSESTree.ExportNamedDeclaration).source);
		},

	};
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-cancellation.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-cancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';

export default new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noToken: 'Function lacks a cancellation token, preferable as last argument',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature[key.name=/^(provide|resolve).+/]']: (node: TSESTree.Node) => {

				let found = false;
				for (const param of (node as TSESTree.TSMethodSignature).params) {
					if (param.type === AST_NODE_TYPES.Identifier) {
						found = found || param.name === 'token';
					}
				}

				if (!found) {
					context.report({
						node,
						messageId: 'noToken'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-create-func.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-create-func.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export default new class ApiLiteralOrTypes implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#creating-objects' },
		messages: { sync: '`createXYZ`-functions are constructor-replacements and therefore must return sync', },
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['TSDeclareFunction Identifier[name=/create.*/]']: (node: ESTree.Node) => {

				const decl = (node as TSESTree.Identifier).parent as TSESTree.FunctionDeclaration;

				if (decl.returnType?.typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) {
					return;
				}
				if (decl.returnType.typeAnnotation.typeName.type !== AST_NODE_TYPES.Identifier) {
					return;
				}

				const ident = decl.returnType.typeAnnotation.typeName.name;
				if (ident === 'Promise' || ident === 'Thenable') {
					context.report({
						node,
						messageId: 'sync'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-event-naming.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-event-naming.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';

export default new class ApiEventNaming implements eslint.Rule.RuleModule {

	private static _nameRegExp = /on(Did|Will)([A-Z][a-z]+)([A-Z][a-z]+)?/;

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: {
			url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#event-naming'
		},
		messages: {
			naming: 'Event names must follow this patten: `on[Did|Will]<Verb><Subject>`',
			verb: 'Unknown verb \'{{verb}}\' - is this really a verb? Iff so, then add this verb to the configuration',
			subject: 'Unknown subject \'{{subject}}\' - This subject has not been used before but it should refer to something in the API',
			unknown: 'UNKNOWN event declaration, lint-rule needs tweaking'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const config = context.options[0] as { allowed: string[]; verbs: string[] };
		const allowed = new Set(config.allowed);
		const verbs = new Set(config.verbs);

		return {
			['TSTypeAnnotation TSTypeReference Identifier[name="Event"]']: (node: ESTree.Identifier) => {

				const def = (node as TSESTree.Identifier).parent?.parent?.parent;
				const ident = this.getIdent(def);

				if (!ident) {
					// event on unknown structure...
					return context.report({
						node,
						message: 'unknown'
					});
				}

				if (allowed.has(ident.name)) {
					// configured exception
					return;
				}

				const match = ApiEventNaming._nameRegExp.exec(ident.name);
				if (!match) {
					context.report({
						node: ident,
						messageId: 'naming'
					});
					return;
				}

				// check that <verb> is spelled out (configured) as verb
				if (!verbs.has(match[2].toLowerCase())) {
					context.report({
						node: ident,
						messageId: 'verb',
						data: { verb: match[2] }
					});
				}

				// check that a subject (if present) has occurred
				if (match[3]) {
					const regex = new RegExp(match[3], 'ig');
					const parts = context.getSourceCode().getText().split(regex);
					if (parts.length < 3) {
						context.report({
							node: ident,
							messageId: 'subject',
							data: { subject: match[3] }
						});
					}
				}
			}
		};
	}

	private getIdent(def: TSESTree.Node | undefined): TSESTree.Identifier | undefined {
		if (!def) {
			return;
		}

		if (def.type === AST_NODE_TYPES.Identifier) {
			return def;
		} else if ((def.type === AST_NODE_TYPES.TSPropertySignature || def.type === AST_NODE_TYPES.PropertyDefinition) && def.key.type === AST_NODE_TYPES.Identifier) {
			return def.key;
		}

		return this.getIdent(def.parent);
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-interface-naming.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-interface-naming.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

export default new class ApiInterfaceNaming implements eslint.Rule.RuleModule {

	private static _nameRegExp = /^I[A-Z]/;

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			naming: 'Interfaces must not be prefixed with uppercase `I`',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['TSInterfaceDeclaration Identifier']: (node: ESTree.Identifier) => {

				const name = (node as TSESTree.Identifier).name;
				if (ApiInterfaceNaming._nameRegExp.test(name)) {
					context.report({
						node,
						messageId: 'naming'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-literal-or-types.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-literal-or-types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';

export default new class ApiLiteralOrTypes implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines#enums' },
		messages: { useEnum: 'Use enums, not literal-or-types', },
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['TSTypeAnnotation TSUnionType']: (node: TSESTree.TSUnionType) => {
				if (node.types.every(value => value.type === 'TSLiteralType')) {
					context.report({
						node: node,
						messageId: 'useEnum'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-provider-naming.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-provider-naming.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';

export default new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			naming: 'A provider should only have functions like provideXYZ or resolveXYZ',
		},
		schema: false,
	};

	private static _providerFunctionNames = /^(provide|resolve|prepare).+/;

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const config = context.options[0] as { allowed: string[] };
		const allowed = new Set(config.allowed);

		return {
			['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature']: (node: TSESTree.Node) => {
				const interfaceName = ((node as TSESTree.Identifier).parent?.parent as TSESTree.TSInterfaceDeclaration).id.name;
				if (allowed.has(interfaceName)) {
					// allowed
					return;
				}

				const methodName = ((node as TSESTree.TSMethodSignatureNonComputedName).key as TSESTree.Identifier).name;

				if (!ApiProviderNaming._providerFunctionNames.test(methodName)) {
					context.report({
						node,
						messageId: 'naming'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-string-type-literals.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-string-type-literals.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';
import { TSESTree } from '@typescript-eslint/utils';

export default new class ApiTypeDiscrimination implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines' },
		messages: {
			noTypeDiscrimination: 'Do not use type discrimination properties'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['TSPropertySignature[optional=false] TSTypeAnnotation TSLiteralType Literal']: (node: ESTree.Literal) => {
				const raw = String((node as TSESTree.Literal).raw);

				if (/^('|").*\1$/.test(raw)) {

					context.report({
						node: node,
						messageId: 'noTypeDiscrimination'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-use-export.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-use-export.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TSESTree } from '@typescript-eslint/utils';
import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class VscodeDtsUseExport implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			useExport: `Public api types must use 'export'`,
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['TSModuleDeclaration :matches(TSInterfaceDeclaration, ClassDeclaration, VariableDeclaration, TSEnumDeclaration, TSTypeAliasDeclaration)']: (node: ESTree.Node) => {
				const parent = (node as TSESTree.Node).parent;
				if (parent && parent.type !== TSESTree.AST_NODE_TYPES.ExportNamedDeclaration) {
					context.report({
						node,
						messageId: 'useExport'
					});
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-use-thenable.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-use-thenable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class ApiEventNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			usage: 'Use the Thenable-type instead of the Promise type',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {



		return {
			['TSTypeAnnotation TSTypeReference Identifier[name="Promise"]']: (node: ESTree.Identifier) => {

				context.report({
					node,
					messageId: 'usage',
				});
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/vscode-dts-vscode-in-comments.ts]---
Location: vscode-main/.eslint-plugin-local/vscode-dts-vscode-in-comments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import type * as ESTree from 'estree';

export default new class ApiVsCodeInComments implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			comment: `Don't use the term 'vs code' in comments`
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		const sourceCode = context.getSourceCode();

		return {
			['Program']: (_node: ESTree.Program) => {

				for (const comment of sourceCode.getAllComments()) {
					if (comment.type !== 'Block') {
						continue;
					}
					if (!comment.range) {
						continue;
					}

					const startIndex = comment.range[0] + '/*'.length;
					const re = /vs code/ig;
					let match: RegExpExecArray | null;
					while ((match = re.exec(comment.value))) {
						// Allow using 'VS Code' in quotes
						if (comment.value[match.index - 1] === `'` && comment.value[match.index + match[0].length] === `'`) {
							continue;
						}

						// Types for eslint seem incorrect
						const start = sourceCode.getLocFromIndex(startIndex + match.index);
						const end = sourceCode.getLocFromIndex(startIndex + match.index + match[0].length);
						context.report({
							messageId: 'comment',
							loc: { start, end }
						});
					}
				}
			}
		};
	}
};
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/tests/code-no-observable-get-in-reactive-context-test.ts]---
Location: vscode-main/.eslint-plugin-local/tests/code-no-observable-get-in-reactive-context-test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Test file to verify the code-no-observable-get-in-reactive-context ESLint rule works correctly

import { observableValue, derived, autorun } from '../../src/vs/base/common/observable.js';

export function testValidUsage() {
	const obs = observableValue('test', 0);

	// Valid: Using .read(reader) in derived
	const validDerived = derived(reader => {
		const value = obs.read(reader);
		return value * 2;
	});

	// Valid: Using .read(reader) in autorun
	autorun(rdr => {
		const value = validDerived.read(rdr);
		console.log('Value:', value);
	});

	// Valid: Using .get() outside reactive context
	const outsideValue = obs.get();
	console.log('Outside value:', outsideValue);
}

export function testInvalidUsage() {
	const obs = observableValue('test', 0);

	// Invalid: Using .get() in derived instead of .read(reader)
	const invalidDerived = derived(rdr => {
		// This should use obs.read(reader) instead
		// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
		const value = obs.get();
		// Use reader for something valid to avoid unused var warning
		const validValue = obs.read(rdr);

		obs.read(undefined);

		return value * 2 + validValue;
	});

	// Invalid: Using .get() in autorun instead of .read(reader)
	autorun(reader => {
		// This should use invalidDerived.read(reader) instead
		// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
		const value = invalidDerived.get();
		// Use reader for something valid to avoid unused var warning
		const validValue = obs.read(reader);
		console.log('Value:', value, validValue);
	});

	// Invalid: Using .get() in derivedWithStore
	derived(reader => {
		// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
		const value = obs.get();
		reader.store.add({ dispose: () => { } });
		return value;
	});
}

export function testComplexCases() {
	const obs1 = observableValue('test1', 0);
	const obs2 = observableValue('test2', 10);

	// Invalid: Using .get() in conditional within derived
	derived(reader => {
		const initial = obs1.read(reader);

		if (initial > 0) {
			// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
			return obs2.get();
		}

		return initial;
	});

	// Invalid: Using .get() in nested function call within autorun
	autorun(reader => {
		const process = () => {
			// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
			return obs1.get() + obs2.get();
		};

		// Use reader for something valid to avoid unused var warning
		const validValue = obs1.read(reader);
		const result = process();
		console.log('Result:', result, validValue);
	});

	// Invalid: Using .get() in try-catch within derived
	derived(reader => {
		try {
			// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
			const value = obs1.get();
			// Use reader for something valid to avoid unused var warning
			const validValue = obs2.read(reader);
			return value * 2 + validValue;
		} catch (e) {
			return obs2.read(reader);
		}
	});
}

export function testValidComplexCases() {
	const obs1 = observableValue('test1', 0);
	const obs2 = observableValue('test2', 10);

	// Valid: Proper usage with .read(reader)
	derived(reader => {
		const value1 = obs1.read(reader);
		const value2 = obs2.read(undefined);

		if (value1 > 0) {
			return value2;
		}

		return value1;
	});

	// Valid: Using .get() outside reactive context
	function processValues() {
		const val1 = obs1.get();
		const val2 = obs2.get();
		return val1 + val2;
	}

	// Valid: Mixed usage - .read(reader) inside reactive, .get() outside
	autorun(reader => {
		const reactiveValue = obs1.read(reader);
		const outsideValue = processValues();
		console.log('Values:', reactiveValue, outsideValue);
	});
}

export function testEdgeCases() {
	const obs = observableValue('test', 0);

	// Valid: Function with no reader parameter
	derived(() => {
		const value = obs.get();
		return value;
	});

	// Invalid: Function with differently named parameter (now also flagged)
	derived(_someOtherName => {
		// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
		const value = obs.get();
		return value;
	});

	// Invalid: Correctly named reader parameter
	derived(reader => {
		// eslint-disable-next-line local/code-no-observable-get-in-reactive-context
		const value = obs.get();
		// Use reader for something valid to avoid unused var warning
		const validValue = obs.read(reader);
		return value + validValue;
	});
}

export function testQuickFixScenarios() {
	const obs = observableValue('test', 0);
	const obs2 = observableValue('test2', 10);

	// These examples show what the quick fix should transform:

	// Example 1: Simple case with 'reader' parameter name
	derived(_reader => {
		const value = obs.read(undefined); // This should be the auto-fix result
		return value;
	});

	// Example 2: Different parameter name
	derived(rdr => {
		// Before fix: obs2.get()
		// After fix: obs2.read(rdr)
		const value = obs2.read(rdr); // This should be the auto-fix result
		return value;
	});

	// Example 3: Complex expression
	derived(ctx => {
		// Before fix: (someCondition ? obs : obs2).get()
		// After fix: (someCondition ? obs : obs2).read(ctx)
		const someCondition = true;
		const value = (someCondition ? obs : obs2).read(ctx); // This should be the auto-fix result
		return value;
	});

	// Example 4: Multiple calls in same function
	autorun(reader => {
		// Before fix: obs.get() and obs2.get()
		// After fix: obs.read(reader) and obs2.read(reader)
		const val1 = obs.read(reader); // This should be the auto-fix result
		const val2 = obs2.read(reader); // This should be the auto-fix result
		console.log(val1, val2);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: .eslint-plugin-local/tests/code-no-reader-after-await-test.ts]---
Location: vscode-main/.eslint-plugin-local/tests/code-no-reader-after-await-test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Test file to verify the code-no-reader-after-await ESLint rule works correctly

import { observableValue, derived, autorun } from '../../src/vs/base/common/observable.js';

export function testValidUsage() {
	const obs = observableValue('test', 0);

	const validDerived = derived(reader => {
		const value = obs.read(reader);
		return value * 2;
	});

	autorun(reader => {
		const value = validDerived.read(reader);
		console.log('Value:', value);
	});
}

export function testInvalidUsage() {
	const obs = observableValue('test', 0);

	const invalidDerived = derived(async reader => {
		await Promise.resolve();
		// eslint-disable-next-line local/code-no-reader-after-await
		const value = obs.read(reader);
		return value * 2;
	});

	autorun(async reader => {
		await Promise.resolve();
		// eslint-disable-next-line local/code-no-reader-after-await
		const value = invalidDerived.read(reader);
		console.log('Value:', value);
	});

	autorun(async reader => {
		await Promise.resolve();
		// eslint-disable-next-line local/code-no-reader-after-await
		const value = reader.readObservable(obs);
		console.log('Value:', value);
	});
}

export function testComplexCases() {
	const obs = observableValue('test', 0);

	derived(async reader => {
		const initial = obs.read(reader);

		if (initial > 0) {
			await Promise.resolve();
		}

		// eslint-disable-next-line local/code-no-reader-after-await
		const final = obs.read(reader);
		return final;
	});

	autorun(async reader => {
		try {
			await Promise.resolve();
		} catch (e) {
		} finally {
			// eslint-disable-next-line local/code-no-reader-after-await
			const value = obs.read(reader);
			console.log(value);
		}
	});
}

export function testValidComplexCases() {
	const obs = observableValue('test', 0);

	derived(async reader => {
		const value1 = obs.read(reader);
		const value2 = reader.readObservable(obs);
		const result = value1 + value2;
		await Promise.resolve(result);
		return result;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: .github/classifier.json]---
Location: vscode-main/.github/classifier.json

```json
{
	"$schema": "https://raw.githubusercontent.com/microsoft/vscode-github-triage-actions/stable/classifier-deep/apply/apply-labels/deep-classifier-config.schema.json",
	"vacation": [],
	"assignees": {
		"nameToOverrideAccuracyOf": {"accuracy": 0.8}
	},
	"labels": {
		"accessibility": { "assign": ["meganrogge"]},
		"api": {"assign": ["jrieken"]},
		"api-finalization": {"assign": []},
		"api-proposal": {"assign": ["jrieken"]},
		"authentication": {"assign": ["TylerLeonhardt"]},
		"bisect-ext": {"assign": ["jrieken"]},
		"bot-proposal": {"assign": ["lramos15"]},
		"bracket-pair-colorization": {"assign": ["hediet"]},
		"bracket-pair-guides": {"assign": ["hediet"]},
		"breadcrumbs": {"assign": ["jrieken"]},
		"callhierarchy": {"assign": ["jrieken"]},
		"chat-terminal": {"assign": ["Tyriar"]},
		"chat-terminal-output-monitor": {"assign": ["meganrogge"]},
		"chrome-devtools": {"assign": ["deepak1556"]},
		"cloud-changes": {"assign": ["joyceerhl"]},
		"code-cli": {"assign": ["connor4312"]},
		"code-lens": {"assign": ["jrieken"]},
		"code-server-web": {"assign": ["aeschli"]},
		"command-center": {"assign": ["jrieken"]},
		"comments": {"assign": ["alexr00"]},
		"config": {"assign": ["sandy081"]},
		"containers": {"assign": ["chrmarti"]},
		"context-keys": {"assign": ["ulugbekna"]},
		"continue-working-on": {"assign": ["joyceerhl"]},
		"css-less-scss": {"assign": ["aeschli"]},
		"custom-editors": {"assign": ["mjbvz"]},
		"debug": {"assign": ["roblourens"]},
		"debug-disassembly": {"assign": []},
		"dialogs": {"assign": ["sbatten"]},
		"diff-editor": {"assign": ["hediet"]},
		"dropdown": {"assign": ["lramos15"]},
		"editor-api": {"assign": ["alexdima"]},
		"editor-autoclosing": {"assign": ["alexdima"]},
		"editor-autoindent": {"assign": ["rebornix"]},
		"editor-bracket-matching": {"assign": ["hediet"]},
		"editor-clipboard": {"assign": ["alexdima", "rebornix"]},
		"editor-code-actions": {"assign": ["mjbvz", "justschen"]},
		"editor-color-picker": {"assign": ["aiday-mar"]},
		"editor-columnselect": {"assign": ["alexdima"]},
		"editor-commands": {"assign": ["alexdima"]},
		"editor-comments": {"assign": ["alexdima"]},
		"editor-contrib": {"assign": ["alexdima"]},
		"editor-core": {"assign": ["alexdima"]},
		"editor-drag-and-drop": {"assign": ["rebornix"]},
		"editor-error-widget": {"assign": ["sandy081"]},
		"editor-find": {"assign": ["rebornix"]},
		"editor-folding": {"assign": ["aeschli"]},
		"editor-highlight": {"assign": ["alexdima"]},
		"editor-hover": {"assign": ["aiday-mar"]},
		"editor-indent-detection": {"assign": ["alexdima"]},
		"editor-indent-guides": {"assign": ["hediet"]},
		"editor-input": {"assign": ["aiday-mar"]},
		"editor-input-IME": {"assign": ["aiday-mar"]},
		"editor-insets": {"assign": ["jrieken"]},
		"editor-minimap": {"assign": ["alexdima"]},
		"editor-multicursor": {"assign": ["alexdima"]},
		"editor-parameter-hints": {"assign": ["mjbvz"]},
		"editor-render-whitespace": {"assign": ["alexdima"]},
		"editor-rendering": {"assign": ["alexdima"]},
		"editor-RTL": {"assign": ["alexdima"]},
		"editor-scrollbar": {"assign": ["alexdima"]},
		"editor-sorting": {"assign": ["alexdima"]},
		"editor-sticky-scroll": {"assign": ["aiday-mar"]},
		"editor-symbols": {"assign": ["jrieken"]},
		"editor-synced-region": {"assign": ["aeschli"]},
		"editor-textbuffer": {"assign": ["alexdima", "rebornix"]},
		"editor-theming": {"assign": ["alexdima"]},
		"editor-wordnav": {"assign": ["alexdima"]},
		"editor-wrapping": {"assign": ["alexdima"]},
		"emmet": {"assign": ["rzhao271"]},
		"emmet-parse": {"assign": ["rzhao271"]},
		"error-list": {"assign": ["sandy081"]},
		"extension-activation": {"assign": ["alexdima"]},
		"extension-host": {"assign": ["alexdima"]},
		"extension-prerelease": {"assign": ["sandy081"]},
		"extension-recommendations": {"assign": ["sandy081"]},
		"extensions": {"assign": ["sandy081"]},
		"extensions-development": {"assign": []},
		"file-decorations": {"assign": ["jrieken"]},
		"file-encoding": {"assign": ["bpasero"]},
		"file-explorer": {"assign": ["lramos15"]},
		"file-glob": {"assign": ["bpasero"]},
		"file-io": {"assign": ["bpasero"]},
		"file-nesting": {"assign": ["lramos15"]},
		"file-watcher": {"assign": ["bpasero"]},
		"font-rendering": {"assign": ["rzhao271"]},
		"formatting": {"assign": ["jrieken"]},
		"getting-started": {"assign": ["bhavyaus"]},
		"ghost-text": {"assign": ["hediet"]},
		"git": {"assign": ["lszomoru"]},
		"github": {"assign": ["lszomoru"]},
		"github-authentication": {"assign": ["TylerLeonhardt"]},
		"github-repositories": {"assign": ["lszomoru"]},
		"gpu": {"assign": ["deepak1556"]},
		"grammar": {"assign": ["mjbvz"]},
		"grid-widget": {"assign": ["joaomoreno"]},
		"html": {"assign": ["aeschli"]},
		"icon-brand": {"assign": ["daviddossett"]},
		"icons-product": {"assign": ["daviddossett"]},
		"image-preview": {"assign": ["mjbvz"]},
		"inlay-hints": {"assign": ["jrieken", "hediet"]},
		"inline-completions": {"assign": ["hediet"]},
		"install-update": {"assign": ["joaomoreno"], "accuracy": 0.85},
		"intellisense-config": {"assign": ["rzhao271"]},
		"interactive-playground": {"assign": ["chrmarti"]},
		"interactive-window": {"assign": ["amunger", "rebornix"]},
		"ipc": {"assign": ["joaomoreno"]},
		"issue-bot": {"assign": ["chrmarti"]},
		"issue-reporter": {"assign": ["yoyokrazy"]},
		"javascript": {"assign": ["mjbvz"]},
		"json": {"assign": ["aeschli"]},
		"json-sorting": {"assign": ["aiday-mar"]},
		"keybindings": {"assign": ["ulugbekna"]},
		"keybindings-editor": {"assign": ["ulugbekna"]},
		"keyboard-layout": {"assign": ["ulugbekna"]},
		"L10N": {"assign": ["TylerLeonhardt", "csigs"]},
		"l10n-platform": {"assign": ["TylerLeonhardt"]},
		"label-provider": {"assign": ["lramos15"]},
		"languages-basic": {"assign": ["aeschli"]},
		"languages-diagnostics": {"assign": ["jrieken"]},
		"languages-guessing": {"assign": ["TylerLeonhardt"]},
		"layout": {"assign": ["benibenj"]},
		"lcd-text-rendering": {"assign": []},
		"list-widget": {"assign": ["joaomoreno"]},
		"live-preview": {"assign": []},
		"log": {"assign": ["sandy081"]},
		"markdown": {"assign": ["mjbvz"]},
		"marketplace": {"assign": ["isidorn"]},
		"menus": {"assign": ["sbatten"]},
		"merge-conflict": {"assign": ["chrmarti"]},
		"merge-editor": {"assign": ["hediet"]},
		"merge-editor-workbench": {"assign": ["jrieken"]},
		"monaco-editor": {"assign": []},
		"native-file-dialog": {"assign": ["deepak1556"]},
		"network": {"assign": ["deepak1556"]},
		"notebook": {"assign": ["rebornix"]},
		"notebook-api": {"assign": []},
		"notebook-builtin-renderers": {"assign": []},
		"notebook-cell-editor": {"assign": []},
		"notebook-celltoolbar": {"assign": []},
		"notebook-clipboard": {"assign": []},
		"notebook-commenting": {"assign": []},
		"notebook-debugging": {"assign": []},
		"notebook-diff": {"assign": []},
		"notebook-dnd": {"assign": []},
		"notebook-execution": {"assign": []},
		"notebook-find": {"assign": []},
		"notebook-folding": {"assign": []},
		"notebook-getting-started": {"assign": []},
		"notebook-getting-globaltoolbar": {"assign": []},
		"notebook-ipynb": {"assign": []},
		"notebook-kernel": {"assign": []},
		"notebook-kernel-picker": {"assign": []},
		"notebook-keybinding": {"assign": []},
		"notebook-language": {"assign": []},
		"notebook-layout": {"assign": []},
		"notebook-markdown": {"assign": []},
		"notebook-math": {"assign": []},
		"notebook-minimap": {"assign": []},
		"notebook-multiselect": {"assign": []},
		"notebook-output": {"assign": []},
		"notebook-perf": {"assign": []},
		"notebook-remote": {"assign": []},
		"notebook-rendering": {"assign": []},
		"notebook-serialization": {"assign": []},
		"notebook-serverless-web": {"assign": []},
		"notebook-statusbar": {"assign": []},
		"notebook-toc-outline": {"assign": []},
		"notebook-undo-redo": {"assign": []},
		"notebook-variables": {"assign": []},
		"notebook-workbench-integration": {"assign": []},
		"notebook-workflow": {"assign": []},
		"open-editors": {"assign": ["lramos15"]},
		"opener": {"assign": ["mjbvz"]},
		"outline": {"assign": ["jrieken"]},
		"output": {"assign": ["sandy081"]},
		"perf": {"assign": []},
		"perf-bloat": {"assign": []},
		"perf-startup": {"assign": []},
		"php": {"assign": ["roblourens"]},
		"portable-mode": {"assign": ["joaomoreno"]},
		"proxy": {"assign": ["chrmarti"]},
		"quick-open": {"assign": ["TylerLeonhardt"]},
		"quick-pick": {"assign": ["TylerLeonhardt"]},
		"references-viewlet": {"assign": ["jrieken"]},
		"release-notes": {"assign": []},
		"remote": {"assign": []},
		"remote-connection": {"assign": ["alexdima"]},
		"remote-explorer": {"assign": ["alexr00"]},
		"remote-tunnel": {"assign": ["aeschli", "connor4312"]},
		"rename": {"assign": ["jrieken"]},
		"runCommands": {"assign": ["ulugbekna"]},
		"sandbox": {"assign": ["deepak1556"]},
		"sash-widget": {"assign": ["joaomoreno"]},
		"scm": {"assign": ["lszomoru"]},
		"screencast-mode": {"assign": ["joaomoreno"]},
		"search": {"assign": ["osortega"]},
		"search-api": {"assign": ["osortega"]},
		"search-editor": {"assign": ["osortega"]},
		"search-replace": {"assign": ["sandy081"]},
		"semantic-tokens": {"assign": ["alexdima", "aeschli"]},
		"server": {"assign": ["alexdima"]},
		"settings-editor": {"assign": ["rzhao271"]},
		"settings-search": {"assign": ["rzhao271"]},
		"settings-sync": {"assign": ["sandy081"]},
		"settings-sync-server": {"assign": ["rzhao271"]},
		"shared-process": {"assign": []},
		"simple-file-dialog": {"assign": ["alexr00"]},
		"smart-select": {"assign": ["jrieken"]},
		"snap": {"assign": ["deepak1556"]},
		"snippets": {"assign": ["jrieken"]},
		"splitview-widget": {"assign": ["joaomoreno"]},
		"suggest": {"assign": ["jrieken"]},
		"table-widget": {"assign": ["joaomoreno"]},
		"tasks": {"assign": ["meganrogge"], "accuracy": 0.85},
		"telemetry": {"assign": ["lramos15"]},
		"terminal": {"assign": ["meganrogge"]},
		"terminal-accessibility": {"assign": ["meganrogge"]},
		"terminal-conpty": {"assign": ["meganrogge"]},
		"terminal-editors": {"assign": ["meganrogge"]},
		"terminal-env-collection": {"assign": ["anthonykim1"]},
		"terminal-external": {"assign": ["anthonykim1"]},
		"terminal-find": {"assign": ["anthonykim1"]},
		"terminal-inline-chat": {"assign": ["Tyriar", "meganrogge"]},
		"terminal-input": {"assign": ["Tyriar"]},
		"terminal-layout": {"assign": ["anthonykim1"]},
		"terminal-ligatures": {"assign": ["Tyriar"]},
		"terminal-links": {"assign": ["anthonykim1"]},
		"terminal-local-echo": {"assign": ["anthonykim1"]},
		"terminal-parser": {"assign": ["Tyriar"]},
		"terminal-persistence": {"assign": ["Tyriar"]},
		"terminal-process": {"assign": ["anthonykim1"]},
		"terminal-profiles": {"assign": ["meganrogge"]},
		"terminal-quick-fix": {"assign": ["meganrogge"]},
		"terminal-rendering": {"assign": ["Tyriar"]},
		"terminal-shell-bash": {"assign": ["anthonykim1"]},
		"terminal-shell-cmd": {"assign": ["anthonykim1"]},
		"terminal-shell-fish": {"assign": ["anthonykim1"]},
		"terminal-shell-git-bash": {"assign": ["anthonykim1"]},
		"terminal-shell-integration": {"assign": ["anthonykim1"]},
		"terminal-shell-pwsh": {"assign": ["anthonykim1"]},
		"terminal-shell-sh": {"assign": ["anthonykim1"]},
		"terminal-shell-zsh": {"assign": ["anthonykim1"]},
		"terminal-sticky-scroll": {"assign": ["anthonykim1"]},
		"terminal-suggest": {"assign": ["meganrogge"]},
		"terminal-tabs": {"assign": ["meganrogge"]},
		"terminal-winpty": {"assign": ["anthonykim1"]},
		"testing": {"assign": ["connor4312"]},
		"themes": {"assign": ["aeschli"]},
		"timeline": {"assign": ["lramos15"]},
		"timeline-git": {"assign": ["lszomoru"]},
		"timeline-local-history": {"assign": ["bpasero"]},
		"titlebar": {"assign": ["benibenj"]},
		"tokenization": {"assign": ["alexdima"]},
		"touch/pointer": {"assign": []},
		"trackpad/scroll": {"assign": []},
		"tree-sticky-scroll": {"assign": ["benibenj"]},
		"tree-views": {"assign": ["alexr00"]},
		"tree-widget": {"assign": ["joaomoreno"]},
		"typehierarchy": {"assign": ["jrieken"]},
		"typescript": {"assign": ["mjbvz"]},
		"undo-redo": {"assign": ["alexdima"]},
		"unicode-highlight": {"assign": ["hediet"]},
		"uri": {"assign": ["jrieken"]},
		"user-profiles": {"assign": ["sandy081"]},
		"ux": {"assign": ["daviddossett"]},
		"variable-resolving": {"assign": ["alexr00"]},
		"VIM": {"assign": ["rebornix"]},
		"virtual-workspaces": {"assign": []},
		"vscode.dev": {"assign": []},
		"vscode-build": {"assign": []},
		"vscode-website": {"assign": ["rzhao271"]},
		"web": {"assign": []},
		"webview": {"assign": ["mjbvz"]},
		"webview-views": {"assign": ["mjbvz"]},
		"workbench-actions": {"assign": ["bpasero"]},
		"workbench-auxwindow": {"assign": ["bpasero"]},
		"workbench-banner": {"assign": ["lszomoru", "sbatten"]},
		"workbench-cli": {"assign": ["bpasero"]},
		"workbench-diagnostics": {"assign": ["Tyriar"]},
		"workbench-dnd": {"assign": ["bpasero"]},
		"workbench-editor-grid": {"assign": ["benibenj"]},
		"workbench-editor-groups": {"assign": ["bpasero"]},
		"workbench-editor-resolver": {"assign": ["lramos15"]},
		"workbench-editors": {"assign": ["bpasero"]},
		"workbench-electron": {"assign": ["deepak1556"]},
		"workbench-fonts": {"assign": []},
		"workbench-history": {"assign": ["bpasero"]},
		"workbench-hot-exit": {"assign": ["bpasero"]},
		"workbench-hover": {"assign": ["Tyriar", "benibenj"]},
		"workbench-launch": {"assign": []},
		"workbench-link": {"assign": []},
		"workbench-multiroot": {"assign": ["bpasero"]},
		"workbench-notifications": {"assign": ["bpasero"]},
		"workbench-os-integration": {"assign": ["bpasero"]},
		"workbench-rapid-render": {"assign": ["jrieken"]},
		"workbench-run-as-admin": {"assign": ["bpasero"]},
		"workbench-state": {"assign": ["bpasero"]},
		"workbench-status": {"assign": ["bpasero"]},
		"workbench-tabs": {"assign": ["benibenj"]},
		"workbench-touchbar": {"assign": ["bpasero"]},
		"workbench-untitled-editors": {"assign": ["bpasero"]},
		"workbench-views": {"assign": ["benibenj"]},
		"workbench-welcome": {"assign": ["lramos15"]},
		"workbench-window": {"assign": ["bpasero"]},
		"workbench-workspace": {"assign": []},
		"workbench-zen": {"assign": ["benibenj"]},
		"workspace-edit": {"assign": ["jrieken"]},
		"workspace-symbols": {"assign": []},
		"workspace-trust": {"assign": ["lszomoru", "sbatten"]},
		"zoom": {"assign": ["alexdima"] }
	}
}
```

--------------------------------------------------------------------------------

---[FILE: .github/CODENOTIFY]---
Location: vscode-main/.github/CODENOTIFY

```text
# Base Utilities
src/vs/base/common/extpath.ts @bpasero
src/vs/base/common/fuzzyScorer.ts @bpasero
src/vs/base/common/glob.ts @bpasero
src/vs/base/common/oauth.ts @TylerLeonhardt
src/vs/base/common/path.ts @bpasero
src/vs/base/common/stream.ts @bpasero
src/vs/base/common/uri.ts @jrieken
src/vs/base/browser/domSanitize.ts @mjbvz
src/vs/base/browser/** @bpasero
src/vs/base/node/pfs.ts @bpasero
src/vs/base/node/unc.ts @bpasero
src/vs/base/parts/contextmenu/** @bpasero
src/vs/base/parts/ipc/** @bpasero
src/vs/base/parts/quickinput/** @TylerLeonhardt
src/vs/base/parts/sandbox/** @bpasero
src/vs/base/parts/storage/** @bpasero

# Base Widgets
src/vs/base/browser/ui/grid/** @joaomoreno @benibenj
src/vs/base/browser/ui/list/** @joaomoreno @benibenj
src/vs/base/browser/ui/sash/** @joaomoreno @benibenj
src/vs/base/browser/ui/splitview/** @joaomoreno @benibenj
src/vs/base/browser/ui/table/** @joaomoreno @benibenj
src/vs/base/browser/ui/tree/** @joaomoreno @benibenj

# Platform
src/vs/platform/auxiliaryWindow/** @bpasero
src/vs/platform/backup/** @bpasero
src/vs/platform/dialogs/** @bpasero
src/vs/platform/editor/** @bpasero
src/vs/platform/environment/** @bpasero
src/vs/platform/files/** @bpasero
src/vs/platform/ipc/** @bpasero
src/vs/platform/launch/** @bpasero
src/vs/platform/lifecycle/** @bpasero
src/vs/platform/menubar/** @bpasero
src/vs/platform/native/** @bpasero
src/vs/platform/quickinput/** @TylerLeonhardt
src/vs/platform/secrets/** @TylerLeonhardt
src/vs/platform/sharedProcess/** @bpasero
src/vs/platform/state/** @bpasero
src/vs/platform/storage/** @bpasero
src/vs/platform/terminal/electron-main/** @Tyriar
src/vs/platform/terminal/node/** @Tyriar
src/vs/platform/utilityProcess/** @bpasero
src/vs/platform/window/** @bpasero
src/vs/platform/windows/** @bpasero
src/vs/platform/workspace/** @bpasero
src/vs/platform/workspaces/** @bpasero
src/vs/platform/actions/common/menuService.ts @jrieken
src/vs/platform/instantiation/** @jrieken

# Editor Core
src/vs/editor/contrib/snippet/** @jrieken
src/vs/editor/contrib/suggest/** @jrieken
src/vs/editor/contrib/format/** @jrieken

# Bootstrap
src/*.ts @bpasero

# Electron Main
src/vs/code/** @bpasero @deepak1556

# Workbench Services
src/vs/workbench/services/activity/** @bpasero
src/vs/workbench/services/authentication/** @TylerLeonhardt
src/vs/workbench/services/auxiliaryWindow/** @bpasero
src/vs/workbench/services/chat/** @bpasero
src/vs/workbench/services/contextmenu/** @bpasero
src/vs/workbench/services/dialogs/** @alexr00 @bpasero
src/vs/workbench/services/editor/** @bpasero
src/vs/workbench/services/editor/common/customEditorLabelService.ts @benibenj
src/vs/workbench/services/environment/** @bpasero
src/vs/workbench/services/files/** @bpasero
src/vs/workbench/services/filesConfiguration/** @bpasero
src/vs/workbench/services/history/** @bpasero
src/vs/workbench/services/host/** @bpasero
src/vs/workbench/services/label/** @bpasero
src/vs/workbench/services/languageDetection/** @TylerLeonhardt
src/vs/workbench/services/layout/** @bpasero
src/vs/workbench/services/lifecycle/** @bpasero
src/vs/workbench/services/notification/** @bpasero
src/vs/workbench/services/path/** @bpasero
src/vs/workbench/services/progress/** @bpasero
src/vs/workbench/services/storage/** @bpasero
src/vs/workbench/services/textfile/** @bpasero
src/vs/workbench/services/textmodelResolver/** @bpasero
src/vs/workbench/services/untitled/** @bpasero
src/vs/workbench/services/utilityProcess/** @bpasero
src/vs/workbench/services/views/** @sandy081 @benibenj @bpasero
src/vs/workbench/services/workingCopy/** @bpasero
src/vs/workbench/services/workspaces/** @bpasero

# Workbench Core
src/vs/workbench/common/** @bpasero
src/vs/workbench/browser/** @bpasero
src/vs/workbench/electron-browser/** @bpasero

# Workbench Contributions
src/vs/workbench/contrib/authentication/** @TylerLeonhardt
src/vs/workbench/contrib/files/** @bpasero
src/vs/workbench/contrib/chat/browser/chatListRenderer.ts @roblourens
src/vs/workbench/contrib/chat/browser/chatSetup/** @bpasero
src/vs/workbench/contrib/chat/browser/chatStatus/** @bpasero
src/vs/workbench/contrib/chat/browser/chatViewPane.ts @bpasero
src/vs/workbench/contrib/chat/browser/media/chatViewPane.css @bpasero
src/vs/workbench/contrib/chat/browser/chatViewTitleControl.ts @bpasero
src/vs/workbench/contrib/chat/browser/media/chatViewTitleControl.css @bpasero
src/vs/workbench/contrib/chat/browser/chatManagement/chatUsageWidget.ts @bpasero
src/vs/workbench/contrib/chat/browser/chatManagement/media/chatUsageWidget.css @bpasero
src/vs/workbench/contrib/chat/browser/agentSessions/** @bpasero
src/vs/workbench/contrib/chat/browser/chatSessions/** @bpasero
src/vs/workbench/contrib/localization/** @TylerLeonhardt
src/vs/workbench/contrib/quickaccess/browser/commandsQuickAccess.ts @TylerLeonhardt
src/vs/workbench/contrib/scm/** @lszomoru
src/vs/workbench/contrib/update/browser/releaseNotesEditor.ts @alexr00 @joaomoreno
src/vs/workbench/contrib/preferences/** @rzhao271

# Build
build/azure-pipelines/** @lszomoru
build/lib/i18n.ts @TylerLeonhardt
resources/linux/debian/** @rzhao271
resources/linux/rpm/** @rzhao271

# Editor contrib
src/vs/editor/standalone/browser/quickInput/** @TylerLeonhardt

# Workbench API
src/vs/workbench/api/common/extHostLocalizationService.ts @TylerLeonhardt
src/vs/workbench/api/browser/mainThreadAuthentication.ts @TylerLeonhardt
src/vs/workbench/api/common/extHostAuthentication.ts @TylerLeonhardt
src/vs/workbench/api/node/extHostAuthentication.ts @TylerLeonhardt
src/vs/workbench/api/common/extHostMcp.ts @TylerLeonhardt
src/vs/workbench/api/browser/mainThreadMcp.ts @TylerLeonhardt
src/vs/workbench/api/common/extHostQuickOpen.ts @TylerLeonhardt
src/vs/workbench/api/browser/mainThreadSecretState.ts @TylerLeonhardt

# Extensions
extensions/microsoft-authentication/** @TylerLeonhardt
extensions/github-authentication/** @TylerLeonhardt
extensions/git/** @lszomoru
extensions/git-base/** @lszomoru
extensions/github/** @lszomoru

# Chat Editing, Inline Chat
src/vs/workbench/contrib/chat/browser/chatEditing/** @jrieken
src/vs/workbench/contrib/inlineChat/** @jrieken
```

--------------------------------------------------------------------------------

---[FILE: .github/CODEOWNERS]---
Location: vscode-main/.github/CODEOWNERS

```text
# GitHub actions required reviewers
.github/workflows/monaco-editor.yml @hediet @alexdima @lszomoru @joaomoreno
.github/workflows/no-package-lock-changes.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/no-yarn-lock-changes.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr-darwin-test.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr-linux-cli-test.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr-linux-test.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr-node-modules.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr-win32-test.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/pr.yml @lszomoru @joaomoreno @TylerLeonhardt @rzhao271
.github/workflows/telemetry.yml @lramos15 @lszomoru @joaomoreno

# Ensure those that manage generated policy are aware of changes
build/lib/policies/policyData.jsonc @joshspicer @rebornix @joaomoreno @pwang347 @sandy081

# VS Code API
# Ensure the API team is aware of changes to the vscode-dts file
# this is only about the final API, not about proposed API changes
src/vscode-dts/vscode.d.ts @jrieken @mjbvz @alexr00
```

--------------------------------------------------------------------------------

---[FILE: .github/commands.json]---
Location: vscode-main/.github/commands.json

```json
[
	{
		"type": "comment",
		"name": "question",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "*question"
	},
	{
		"type": "comment",
		"name": "dev-question",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "*dev-question"
	},
	{
		"type": "label",
		"name": "*question",
		"action": "close",
		"reason": "not_planned",
		"comment": "We closed this issue because it is a question about using VS Code rather than an issue or feature request. Please search for help on [StackOverflow](https://aka.ms/vscodestackoverflow), where the community has already answered thousands of similar questions. You may find their [guide on asking a new question](https://aka.ms/vscodestackoverflowquestion) helpful if your question has not already been asked. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*dev-question",
		"action": "close",
		"reason": "not_planned",
		"comment": "We have a great extension developer community over on [GitHub discussions](https://github.com/microsoft/vscode-discussions/discussions) and [Slack](https://vscode-dev-community.slack.com/) where extension authors help each other. This is a great place for you to ask questions and find support.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*extension-candidate",
		"action": "close",
		"reason": "not_planned",
		"comment": "We try to keep VS Code lean and we think the functionality you're asking for is great for a VS Code extension. Maybe you can already find one that suits you in the [VS Code Marketplace](https://aka.ms/vscodemarketplace). Just in case, in a few simple steps you can get started [writing your own extension](https://aka.ms/vscodewritingextensions). See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*not-reproducible",
		"action": "close",
		"reason": "not_planned",
		"comment": "We closed this issue because we are unable to reproduce the problem with the steps you describe. Chances are we've already fixed your problem in a recent version of VS Code. If not, please ask us to reopen the issue and provide us with more detail. Our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) might help you with that.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*out-of-scope",
		"action": "close",
		"reason": "not_planned",
		"comment": "We closed this issue because we [don't plan to address it](https://aka.ms/vscode-out-of-scope) in the foreseeable future. If you disagree and feel that this issue is crucial: we are happy to listen and to reconsider.\n\nIf you wonder what we are up to, please see our [roadmap](https://aka.ms/vscoderoadmap) and [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nThanks for your understanding, and happy coding!"
	},
	{
		"type": "label",
		"name": "wont-fix",
		"action": "close",
		"reason": "not_planned",
		"comment": "We closed this issue because we [don't plan to address it](https://github.com/microsoft/vscode/wiki/Issue-Grooming#wont-fix-bugs).\n\nThanks for your understanding, and happy coding!"
	},
	{
		"type": "comment",
		"name": "causedByExtension",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "*caused-by-extension"
	},
	{
		"type": "label",
		"name": "*caused-by-extension",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is caused by an extension, please file it with the repository (or contact) the extension has linked in its overview in VS Code or the [marketplace](https://aka.ms/vscodemarketplace) for VS Code. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting). If you don't know which extension is causing the problem, you can run `Help: Start extension bisect` from the command palette (F1) to help identify the problem extension.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*as-designed",
		"action": "close",
		"reason": "not_planned",
		"comment": "The described behavior is how it is expected to work. If you disagree, please explain what is expected and what is not in more detail. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "L10N",
		"assign": [
			"csigs",
			"TylerLeonhardt"
		]
	},
	{
		"type": "comment",
		"name": "duplicate",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "*duplicate"
	},
	{
		"type": "label",
		"name": "*duplicate",
		"action": "close",
		"reason": "not_planned",
		"comment": "Thanks for creating this issue! We figured it's covering the same as another one we already have. Thus, we closed this one as a duplicate. You can search for [similar existing issues](${duplicateQuery}). See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "verified",
		"allowUsers": [
			"@author"
		],
		"action": "updateLabels",
		"addLabel": "verified",
		"removeLabel": "author-verification-requested",
		"requireLabel": "author-verification-requested",
		"disallowLabel": "unreleased"
	},
	{
		"type": "comment",
		"name": "confirm",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "confirmed",
		"removeLabel": "confirmation-pending"
	},
	{
		"type": "comment",
		"name": "confirmationPending",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "confirmation-pending",
		"removeLabel": "confirmed"
	},
	{
		"type": "comment",
		"name": "needsMoreInfo",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "~info-needed"
	},
	{
		"type": "comment",
		"name": "needsPerfInfo",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"addLabel": "info-needed",
		"comment": "Thanks for creating this issue regarding performance! Please follow this guide to help us diagnose performance issues: https://github.com/microsoft/vscode/wiki/Performance-Issues \n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "jsDebugLogs",
		"action": "updateLabels",
		"addLabel": "info-needed",
		"comment": "Please collect trace logs using the following instructions:\n\n> If you're able to, add `\"trace\": true` to your `launch.json` and reproduce the issue. The location of the log file on your disk will be written to the Debug Console. Share that with us.\n>\n> ⚠️ This log file will not contain source code, but will contain file paths. You can drop it into https://microsoft.github.io/vscode-pwa-analyzer/index.html to see what it contains. If you'd rather not share the log publicly, you can email it to connor@xbox.com"
	},
	{
		"type": "comment",
		"name": "closedWith",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "completed",
		"addLabel": "unreleased"
	},
	{
		"type": "comment",
		"name": "spam",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "invalid"
	},
	{
		"type": "comment",
		"name": "a11ymas",
		"allowUsers": [
			"AccessibilityTestingTeam-TCS",
			"dixitsonali95",
			"Mohini78",
			"ChitrarupaSharma",
			"mspatil110",
			"umasarath52",
			"v-umnaik"
		],
		"action": "updateLabels",
		"addLabel": "a11ymas"
	},
	{
		"type": "label",
		"name": "*off-topic",
		"action": "close",
		"reason": "not_planned",
		"comment": "Thanks for creating this issue. We think this issue is unactionable or unrelated to the goals of this project. Please follow our [issue reporting guidelines](https://aka.ms/vscodeissuereporting).\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extPython",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Python extension. Please file the issue to the [Python extension repository](https://github.com/microsoft/vscode-python). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extJupyter",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Jupyter extension. Please file the issue to the [Jupyter extension repository](https://github.com/microsoft/vscode-jupyter). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extC",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the C extension. Please file the issue to the [C extension repository](https://github.com/microsoft/vscode-cpptools). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extC++",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the C++ extension. Please file the issue to the [C++ extension repository](https://github.com/microsoft/vscode-cpptools). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extCpp",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the C++ extension. Please file the issue to the [C++ extension repository](https://github.com/microsoft/vscode-cpptools). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extTS",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the TypeScript language service. Please file the issue to the [TypeScript repository](https://github.com/microsoft/TypeScript/). Make sure to check their [contributing guidelines](https://github.com/microsoft/TypeScript/blob/master/CONTRIBUTING.md) and provide relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extJS",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the TypeScript/JavaScript language service. Please file the issue to the [TypeScript repository](https://github.com/microsoft/TypeScript/). Make sure to check their [contributing guidelines](https://github.com/microsoft/TypeScript/blob/master/CONTRIBUTING.md) and provide relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extC#",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the C# extension. Please file the issue to the [C# extension repository](https://github.com/OmniSharp/omnisharp-vscode.git). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extGo",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Go extension. Please file the issue to the [Go extension repository](https://github.com/golang/vscode-go). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extPowershell",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the PowerShell extension. Please file the issue to the [PowerShell extension repository](https://github.com/PowerShell/vscode-powershell). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extLiveShare",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the LiveShare extension. Please file the issue to the [LiveShare repository](https://github.com/MicrosoftDocs/live-share). Make sure to check their [contributing guidelines](https://github.com/MicrosoftDocs/live-share/blob/master/CONTRIBUTING.md) and provide relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extDocker",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Docker extension. Please file the issue to the [Docker extension repository](https://github.com/microsoft/vscode-docker). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extJava",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Java extension. Please file the issue to the [Java extension repository](https://github.com/redhat-developer/vscode-java). Make sure to check their [troubleshooting instructions](https://github.com/redhat-developer/vscode-java/wiki/Troubleshooting) and provide relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extJavaDebug",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Java Debugger extension. Please file the issue to the [Java Debugger repository](https://github.com/microsoft/vscode-java-debug). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extCodespaces",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Codespaces extension. Please file the issue in the [Codespaces Discussion Forum](http://aka.ms/ghcs-feedback). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "extCopilot",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "close",
		"reason": "not_planned",
		"addLabel": "*caused-by-extension",
		"comment": "It looks like this is caused by the Copilot extension. Please file the issue in the [Copilot Discussion Forum](https://github.com/community/community/discussions/categories/copilot). Make sure to check their issue reporting template and provide them relevant information such as the extension version you're using. See also our [issue reporting guidelines](https://aka.ms/vscodeissuereporting) for more information.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "gifPlease",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "comment",
		"addLabel": "info-needed",
		"comment": "Thanks for reporting this issue! Unfortunately, it's hard for us to understand what issue you're seeing. Please help us out by providing a screen recording showing exactly what isn't working as expected. While we can work with most standard formats, `.gif` files are preferred as they are displayed inline on GitHub. You may find https://gifcap.dev helpful as a browser-based gif recording tool.\n\nIf the issue depends on keyboard input, you can help us by enabling screencast mode for the recording (`Developer: Toggle Screencast Mode` in the command palette). Lastly, please attach this file via the GitHub web interface as emailed responses will strip files out from the issue.\n\nHappy coding!"
	},
	{
		"type": "comment",
		"name": "confirmPlease",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "comment",
		"addLabel": "info-needed",
		"comment": "Please diagnose the root cause of the issue by running the command `F1 > Help: Troubleshoot Issue` and following the instructions. Once you have done that, please update the issue with the results.\n\nHappy Coding!"
	},
	{
		"__comment__": "Allows folks on the team to label issues by commenting: `\\label My-Label` ",
		"type": "comment",
		"name": "label",
		"allowUsers": []
	},
	{
		"type": "comment",
		"name": "assign",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		]
	},
	{
		"type": "label",
		"name": "*workspace-trust-docs",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue appears to be the result of the new workspace trust feature shipped in June 2021. This security-focused feature has major impact on the functionality of VS Code. Due to the volume of issues, we ask that you take some time to review our [comprehensive documentation](https://aka.ms/vscode-workspace-trust) on the feature. If your issue is still not resolved, please let us know."
	},
	{
		"type": "label",
		"name": "~verification-steps-needed",
		"action": "updateLabels",
		"addLabel": "verification-steps-needed",
		"removeLabel": "~verification-steps-needed",
		"comment": "Friendly ping! Looks like this issue requires some further steps to be verified. Please provide us with the steps necessary to verify this issue."
	},
	{
		"type": "label",
		"name": "~info-needed",
		"action": "updateLabels",
		"addLabel": "info-needed",
		"removeLabel": "~info-needed",
		"comment": "Thanks for creating this issue! We figured it's missing some basic information or in some other way doesn't follow our [issue reporting guidelines](https://aka.ms/vscodeissuereporting). Please take the time to review these and update the issue.\n\nFor Copilot Issues, be sure to visit our [Copilot-specific guidelines](https://github.com/microsoft/vscode/wiki/Copilot-Issues) page for details on the necessary information.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "~version-info-needed",
		"action": "updateLabels",
		"addLabel": "info-needed",
		"removeLabel": "~version-info-needed",
		"comment": "Thanks for creating this issue! We figured it's missing some basic information, such as a version number, or in some other way doesn't follow our [issue reporting guidelines](https://aka.ms/vscodeissuereporting). Please take the time to review these and update the issue.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "~confirmation-needed",
		"action": "updateLabels",
		"addLabel": "info-needed",
		"removeLabel": "~confirmation-needed",
		"comment": "Please diagnose the root cause of the issue by running the command `F1 > Help: Troubleshoot Issue` and following the instructions. Once you have done that, please update the issue with the results.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "~chat-rate-limiting",
		"removeLabel": "~chat-rate-limiting",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is a duplicate of https://github.com/microsoft/vscode/issues/253124. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-request-failed",
		"removeLabel": "~chat-request-failed",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is a duplicate of https://github.com/microsoft/vscode/issues/253136. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-rai-content-filters",
		"removeLabel": "~chat-rai-content-filters",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is a duplicate of https://github.com/microsoft/vscode/issues/253130. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-public-code-blocking",
		"removeLabel": "~chat-public-code-blocking",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is a duplicate of https://github.com/microsoft/vscode/issues/253129. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-lm-unavailable",
		"removeLabel": "~chat-lm-unavailable",
		"action": "close",
		"reason": "not_planned",
		"comment": "This issue is a duplicate of https://github.com/microsoft/vscode/issues/253137. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-authentication",
		"removeLabel": "~chat-authentication",
		"action": "close",
		"reason": "not_planned",
		"comment": "Please look at the following meta issue: https://github.com/microsoft/vscode/issues/253132, if the bug you are experiencing is not there, please comment on this closed issue thread so we can re-open it.",
		"assign": [
			"TylerLeonhardt"
		]
	},
	{
		"type": "label",
		"name": "~chat-no-response-returned",
		"removeLabel": "~chat-no-response-returned",
		"action": "close",
		"reason": "not_planned",
		"comment": "Please look at the following meta issue: https://github.com/microsoft/vscode/issues/253126. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-billing",
		"removeLabel": "~chat-billing",
		"addLabel": "chat-billing",
		"action": "close",
		"reason": "not_planned",
		"comment": "Please look at the following meta issue: https://github.com/microsoft/vscode/issues/252230. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~chat-infinite-response-loop",
		"removeLabel": "~chat-infinite-response-loop",
		"addLabel": "chat-infinite-response-loop",
		"action": "close",
		"reason": "not_planned",
		"comment": "Please look at the following meta issue: https://github.com/microsoft/vscode/issues/253134. Please refer to that issue for updates and discussions. Feel free to open a new issue if you think this is a different problem."
	},
	{
		"type": "label",
		"name": "~spam",
		"removeLabel": "~spam",
		"addLabel": "spam",
		"action": "close",
		"reason": "not_planned",
		"comment": "Thank you for your submission. This issue has been closed as it doesn't meet our community guidelines or appears to be spam.\n\n**If you believe this was closed in error:**\n- Please review our [Code of Conduct](https://opensource.microsoft.com/codeofconduct/)\n- Ensure your issue contains a clear description of the problem or feature request\n- Feel free to open a new issue with appropriate detail if this was a legitimate concern\n\n**For legitimate issues, please include:**\n- Clear description of the problem\n- Steps to reproduce (for bugs)\n- Expected vs actual behavior\n- VS Code version and environment details\n\nThank you for helping us maintain a welcoming and productive community."
	},
	{
		"type": "label",
		"name": "~capi",
		"addLabel": "capi",
		"removeLabel": "~capi",
		"assign": [
			"samvantran",
			"sharonlo"
		],
		"comment": "Thank you for creating this issue! Please provide one or more `requestIds` to help the platform team investigate. You can follow instructions [found here](https://github.com/microsoft/vscode/wiki/Copilot-Issues#language-model-requests-and-responses) to locate the `requestId` value.\n\nHappy Coding!"
	},
	{
		"type": "label",
		"name": "*edu",
		"action": "close",
		"reason": "not_planned",
		"comment": "We closed this issue because it seems to be about coursework or grading. This issue tracker is for issues about VS Code itself. For coursework-related issues, or issues related to your course's specific VS Code setup, please consider engaging directly with your course instructor.\n\nHappy Coding!"
	},
	{
		"type": "comment",
		"name": "edu",
		"allowUsers": [
			"cleidigh",
			"usernamehw",
			"gjsjohnmurray",
			"IllusionMH"
		],
		"action": "updateLabels",
		"addLabel": "*edu"
	},
	{
		"type": "label",
		"name": "~agent-behavior",
		"action": "close",
		"reason": "not_planned",
		"addLabel": "agent-behavior",
		"removeLabel": "~agent-behavior",
		"comment": "Unfortunately I think you are hitting a AI quality issue that is not actionable enough for us to track a bug. We would recommend that you try other available models and look at the [Tips and tricks for Copilot in VS Code](https://code.visualstudio.com/docs/copilot/copilot-tips-and-tricks) doc page.\n\nWe are constantly improving AI quality in every release, thank you for the feedback! If you believe this is a technical bug, we recommend you report a new issue including logs described on the [Copilot Issues](https://github.com/microsoft/vscode/wiki/Copilot-Issues) wiki page."
	},
	{
		"type": "label",
		"name": "~accessibility-sla",
		"addLabel": "accessibility-sla",
		"removeLabel": "~accessibility-sla",
		"comment": "The Visual Studio and VS Code teams have an agreement with the Accessibility team that 3:1 contrast is enough for inside the editor."
	}
]
```

--------------------------------------------------------------------------------

---[FILE: .github/copilot-instructions.md]---
Location: vscode-main/.github/copilot-instructions.md

```markdown
# VS Code Copilot Instructions

## Project Overview

Visual Studio Code is built with a layered architecture using TypeScript, web APIs and Electron, combining web technologies with native app capabilities. The codebase is organized into key architectural layers:

### Root Folders
- `src/`: Main TypeScript source code with unit tests in `src/vs/*/test/` folders
- `build/`: Build scripts and CI/CD tools
- `extensions/`: Built-in extensions that ship with VS Code
- `test/`: Integration tests and test infrastructure
- `scripts/`: Development and build scripts
- `resources/`: Static resources (icons, themes, etc.)
- `out/`: Compiled JavaScript output (generated during build)

### Core Architecture (`src/` folder)
- `src/vs/base/` - Foundation utilities and cross-platform abstractions
- `src/vs/platform/` - Platform services and dependency injection infrastructure
- `src/vs/editor/` - Text editor implementation with language services, syntax highlighting, and editing features
- `src/vs/workbench/` - Main application workbench for web and desktop
  - `workbench/browser/` - Core workbench UI components (parts, layout, actions)
  - `workbench/services/` - Service implementations
  - `workbench/contrib/` - Feature contributions (git, debug, search, terminal, etc.)
  - `workbench/api/` - Extension host and VS Code API implementation
- `src/vs/code/` - Electron main process specific implementation
- `src/vs/server/` - Server specific implementation

The core architecture follows these principles:
- **Layered architecture** - from `base`, `platform`, `editor`, to `workbench`
- **Dependency injection** - Services are injected through constructor parameters
- **Contribution model** - Features contribute to registries and extension points
- **Cross-platform compatibility** - Abstractions separate platform-specific code

### Built-in Extensions (`extensions/` folder)
The `extensions/` directory contains first-party extensions that ship with VS Code:
- **Language support** - `typescript-language-features/`, `html-language-features/`, `css-language-features/`, etc.
- **Core features** - `git/`, `debug-auto-launch/`, `emmet/`, `markdown-language-features/`
- **Themes** - `theme-*` folders for default color themes
- **Development tools** - `extension-editing/`, `vscode-api-tests/`

Each extension follows the standard VS Code extension structure with `package.json`, TypeScript sources, and contribution points to extend the workbench through the Extension API.

### Finding Related Code
1. **Semantic search first**: Use file search for general concepts
2. **Grep for exact strings**: Use grep for error messages or specific function names
3. **Follow imports**: Check what files import the problematic module
4. **Check test files**: Often reveal usage patterns and expected behavior

## Validating TypeScript changes

MANDATORY: Always check the `VS Code - Build` watch task output via #runTasks/getTaskOutput for compilation errors before running ANY script or declaring work complete, then fix all compilation errors before moving forward.

- NEVER run tests if there are compilation errors
- NEVER use `npm run compile` to compile TypeScript files but call #runTasks/getTaskOutput instead

### TypeScript compilation steps
- Monitor the `VS Code - Build` task outputs for real-time compilation errors as you make changes
- This task runs `Core - Build` and `Ext - Build` to incrementally compile VS Code TypeScript sources and built-in extensions
- Start the task if it's not already running in the background

### TypeScript validation steps
- Use the run test tool if you need to run tests. If that tool is not available, then you can use `scripts/test.sh` (or `scripts\test.bat` on Windows) for unit tests (add `--grep <pattern>` to filter tests) or `scripts/test-integration.sh` (or `scripts\test-integration.bat` on Windows) for integration tests (integration tests end with .integrationTest.ts or are in /extensions/).
- Use `npm run valid-layers-check` to check for layering issues

## Coding Guidelines

### Indentation

We use tabs, not spaces.

### Naming Conventions

- Use PascalCase for `type` names
- Use PascalCase for `enum` values
- Use camelCase for `function` and `method` names
- Use camelCase for `property` names and `local variables`
- Use whole words in names when possible

### Types

- Do not export `types` or `functions` unless you need to share it across multiple components
- Do not introduce new `types` or `values` to the global namespace

### Comments

- Use JSDoc style comments for `functions`, `interfaces`, `enums`, and `classes`

### Strings

- Use "double quotes" for strings shown to the user that need to be externalized (localized)
- Use 'single quotes' otherwise
- All strings visible to the user need to be externalized using the `vs/nls` module
- Externalized strings must not use string concatenation. Use placeholders instead (`{0}`).

### UI labels
- Use title-style capitalization for command labels, buttons and menu items (each word is capitalized).
- Don't capitalize prepositions of four or fewer letters unless it's the first or last word (e.g. "in", "with", "for").

### Style

- Use arrow functions `=>` over anonymous function expressions
- Only surround arrow function parameters when necessary. For example, `(x) => x + x` is wrong but the following are correct:

```typescript
x => x + x
(x, y) => x + y
<T>(x: T, y: T) => x === y
```

- Always surround loop and conditional bodies with curly braces
- Open curly braces always go on the same line as whatever necessitates them
- Parenthesized constructs should have no surrounding whitespace. A single space follows commas, colons, and semicolons in those constructs. For example:

```typescript
for (let i = 0, n = str.length; i < 10; i++) {
    if (x < 10) {
        foo();
    }
}
function f(x: number, y: string): void { }
```

- Whenever possible, use in top-level scopes `export function x(…) {…}` instead of `export const x = (…) => {…}`. One advantage of using the `function` keyword is that the stack-trace shows a good name when debugging.

### Code Quality

- All files must include Microsoft copyright header
- Prefer `async` and `await` over `Promise` and `then` calls
- All user facing messages must be localized using the applicable localization framework (for example `nls.localize()` method)
- Don't add tests to the wrong test suite (e.g., adding to end of file instead of inside relevant suite)
- Look for existing test patterns before creating new structures
- Use `describe` and `test` consistently with existing patterns
- Prefer regex capture groups with names over numbered capture groups.
- If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task
- Never duplicate imports. Always reuse existing imports if they are present.
- Do not use `any` or `unknown` as the type for variables, parameters, or return values unless absolutely necessary. If they need type annotations, they should have proper types or interfaces defined.
- When adding file watching, prefer correlated file watchers (via fileService.createWatcher) to shared ones.
- When adding tooltips to UI elements, prefer the use of IHoverService service.
```

--------------------------------------------------------------------------------

---[FILE: .github/dependabot.yml]---
Location: vscode-main/.github/dependabot.yml

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

--------------------------------------------------------------------------------

---[FILE: .github/insiders.yml]---
Location: vscode-main/.github/insiders.yml

```yaml
{
  insidersLabel: "insiders",
  insidersColor: "006b75",
  action: "remove",
  perform: true,
}
```

--------------------------------------------------------------------------------

---[FILE: .github/pull_request_template.md]---
Location: vscode-main/.github/pull_request_template.md

```markdown
<!-- Thank you for submitting a Pull Request. Please:
* Read our Pull Request guidelines:
  https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests
* Associate an issue with the Pull Request.
* Ensure that the code is up-to-date with the `main` branch.
* Include a description of the proposed changes and how to test them.
-->
```

--------------------------------------------------------------------------------

---[FILE: .github/similarity.yml]---
Location: vscode-main/.github/similarity.yml

```yaml
{
  perform: true,
  whenCreatedByTeam: false,
  comment: "(Experimental duplicate detection)\nThanks for submitting this issue. Please also check if it is already covered by an existing one, like:\n${potentialDuplicates}",
}
```

--------------------------------------------------------------------------------

---[FILE: .github/agents/data.md]---
Location: vscode-main/.github/agents/data.md

```markdown
---
name: Data
description: Answer telemetry questions with data queries using Kusto Query Language (KQL)
tools:
  ['vscode/extensions', 'execute/runInTerminal', 'read/readFile', 'search', 'web/githubRepo', 'azure-mcp/kusto_query', 'todo']
---

# Role and Objective

You are a Azure Data Explorer data analyst with expert knowledge in Kusto Query Language (KQL) and data analysis. Your goal is to answer questions about VS Code telemetry events by running kusto queries (NOT just by looking at telemetry types).

# Workflow

1. Read `vscode-telemetry-docs/.github/copilot-instructions.md` to understand how to access VS Code's telemetry
	- If the `vscode-telemetry-docs` folder doesn't exist (just check your workspace_info, no extra tool call needed), run `npm run mixin-telemetry-docs` to clone the telemetry documentation.
2. Analyze data using kusto queries: Don't just describe what could be queried - actually execute Kusto queries to provide real data and insights:
   - If the `kusto_query` tool doesn't exist (just check your provided tools, no need to run it!), install the `ms-azuretools.vscode-azure-mcp-server` VS Code extension
	- Use the appropriate Kusto cluster and database for the data type
   - Always include proper time filtering to limit data volume
   - Default to a rolling 28-day window if no specific timeframe is requested
   - Format and present the query results clearly to answer the user's question
	- Track progress of your kusto analysis using todos
	- If kusto queries keep failing (up to 3 repeated attempts of fixing parameters or queries), stop and inform the user.

# Kusto Best Practices

When writing Kusto queries, follow these best practices:
- **Explore data efficiently.** Use 1d (1-day) time window and `sample` operator to quickly understand data shape and volume
- **Aggregate usage in proper time windows.** When no specific timeframe is provided:
	- Default to a rolling 28-day window (standard practice in VS Code telemetry)
   - Use full day boundaries to avoid partial day data
   - Follow the time filtering patterns from the telemetry documentation
- **Correctly map names and keys.** EventName is the prefix (`monacoworkbench/` for vscode) and lowercase event name. Properties/Measurements keys are lowercase. Any properties marked `isMeasurement` are in the Measurements bag.
- **Parallelize queries when possible.** Run multiple independent queries as parallel tool calls to speed up analysis.

# Output Format

Your response should include:
- The actual Kusto query executed (formatted nicely)
- Real query results with data to answer the user's question
- Interpretation and analysis of the results
- References to specific documentation files when applicable
- Additional context or insights from the telemetry data
```

--------------------------------------------------------------------------------

````

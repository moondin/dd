---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 90
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 90 of 552)

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

---[FILE: extensions/terminal-suggest/src/test/completions/upstream/mkdir.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/test/completions/upstream/mkdir.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import mkdirSpec from '../../../completions/upstream/mkdir';

const allOptions = [
	'--context <context>',
	'--help',
	'--mode <mode>',
	'--parents',
	'--verbose',
	'--version',
	'-Z <context>',
	'-m <mode>',
	'-p',
	'-v',
];
const expectedCompletions = [{ label: 'mkdir', description: (mkdirSpec as Fig.Subcommand).description }];
export const mkdirTestSuiteSpec: ISuiteSpec = {
	name: 'mkdir',
	completionSpecs: mkdirSpec,
	availableCommands: 'mkdir',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'm|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'mkdir|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'mkdir |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },

		// Duplicate option
		// TODO: Duplicate options should not be presented https://github.com/microsoft/vscode/issues/239607
		// { input: 'mkdir -Z -|', expectedCompletions: removeArrayEntries(allOptions, '-z') },
		// { input: 'mkdir -Z -m -|', expectedCompletions: removeArrayEntries(allOptions, '-z', '-m') },
	]
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/completions/upstream/rm.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/test/completions/upstream/rm.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import rmSpec from '../../../completions/upstream/rm';

const allOptions = [
	'-P',
	'-R',
	'-d',
	'-f',
	'-i',
	'-r',
	'-v',
];
const expectedCompletions = [{ label: 'rm', description: (rmSpec as Fig.Subcommand).description }];
export const rmTestSuiteSpec: ISuiteSpec = {
	name: 'rm',
	completionSpecs: rmSpec,
	availableCommands: 'rm',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'r|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'rm|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'rm |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Duplicate option
		// TODO: Duplicate options should not be presented https://github.com/microsoft/vscode/issues/239607
		// { input: `rm -${allOptions[0]} -|`, expectedCompletions: removeArrayEntries(allOptions, allOptions[0]) },
		// { input: `rm -${allOptions[0]} -${allOptions[1]} -|`, expectedCompletions: removeArrayEntries(allOptions, allOptions[0], allOptions[1]) },
	]
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/completions/upstream/rmdir.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/test/completions/upstream/rmdir.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import rmdirSpec from '../../../completions/upstream/rmdir';

const allOptions = [
	'-p',
];
const expectedCompletions = [{ label: 'rmdir', description: (rmdirSpec as Fig.Subcommand).description }];

export const rmdirTestSuiteSpec: ISuiteSpec = {
	name: 'rmdir',
	completionSpecs: rmdirSpec,
	availableCommands: 'rmdir',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 'r|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'rmdir|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'rmdir |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
	]
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/completions/upstream/touch.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/test/completions/upstream/touch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { testPaths, type ISuiteSpec } from '../../helpers';
import touchSpec from '../../../completions/upstream/touch';

const allOptions = [
	'-A <time>',
	'-a',
	'-c',
	'-f',
	'-h',
	'-m',
	'-r <file>',
	'-t <timestamp>',
];
const expectedCompletions = [{ label: 'touch', description: (touchSpec as Fig.Subcommand).description }];

export const touchTestSuiteSpec: ISuiteSpec = {
	name: 'touch',
	completionSpecs: touchSpec,
	availableCommands: 'touch',
	testSpecs: [
		// Empty input
		{ input: '|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Typing the command
		{ input: 't|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },
		{ input: 'touch|', expectedCompletions, expectedResourceRequests: { type: 'both', cwd: testPaths.cwd } },

		// Basic options
		{ input: 'touch |', expectedCompletions: allOptions, expectedResourceRequests: { type: 'folders', cwd: testPaths.cwd } },
	]
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/env/pathExecutableCache.test.ts]---
Location: vscode-main/extensions/terminal-suggest/src/test/env/pathExecutableCache.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { deepStrictEqual, strictEqual } from 'node:assert';
import type { MarkdownString } from 'vscode';
import { PathExecutableCache } from '../../env/pathExecutableCache';
import { WindowsExecutableExtensionsCache, windowsDefaultExecutableExtensions } from '../../helpers/executable';

suite('PathExecutableCache', () => {
	test('cache should return empty for empty PATH', async () => {
		const cache = new PathExecutableCache();
		const result = await cache.getExecutablesInPath({ PATH: '' });
		strictEqual(Array.from(result!.completionResources!).length, 0);
		strictEqual(Array.from(result!.labels!).length, 0);
	});

	test('results are the same on successive calls', async () => {
		const cache = new PathExecutableCache();
		const env = { PATH: process.env.PATH };
		const result = await cache.getExecutablesInPath(env);
		const result2 = await cache.getExecutablesInPath(env);
		deepStrictEqual(result!.labels, result2!.labels);
	});

	test('refresh clears the cache', async () => {
		const cache = new PathExecutableCache();
		const env = { PATH: process.env.PATH };
		const result = await cache.getExecutablesInPath(env);
		cache.refresh();
		const result2 = await cache.getExecutablesInPath(env);
		strictEqual(result !== result2, true);
	});

	if (process.platform !== 'win32') {
		test('cache should include executables found via symbolic links', async () => {
			const path = require('path');
			// Always use the source fixture directory to ensure symlinks are present
			const fixtureDir = path.resolve(__dirname.replace(/out[\/].*$/, 'src/test/env'), '../fixtures/symlink-test');
			const env = { PATH: fixtureDir };
			const cache = new PathExecutableCache();
			const result = await cache.getExecutablesInPath(env);
			cache.refresh();
			const labels = Array.from(result!.labels!);

			strictEqual(labels.includes('real-executable.sh'), true);
			strictEqual(labels.includes('symlink-executable.sh'), true);
			strictEqual(result?.completionResources?.size, 2);

			const completionResources = result!.completionResources!;
			let realDocRaw: string | MarkdownString | undefined = undefined;
			let symlinkDocRaw: string | MarkdownString | undefined = undefined;
			for (const resource of completionResources) {
				if (resource.label === 'real-executable.sh') {
					realDocRaw = resource.documentation;
				} else if (resource.label === 'symlink-executable.sh') {
					symlinkDocRaw = resource.documentation;
				}
			}
			const realDoc = typeof realDocRaw === 'string' ? realDocRaw : (realDocRaw && 'value' in realDocRaw ? realDocRaw.value : undefined);
			const symlinkDoc = typeof symlinkDocRaw === 'string' ? symlinkDocRaw : (symlinkDocRaw && 'value' in symlinkDocRaw ? symlinkDocRaw.value : undefined);

			const realPath = path.join(fixtureDir, 'real-executable.sh');
			const symlinkPath = path.join(fixtureDir, 'symlink-executable.sh');
			strictEqual(realDoc, realPath);
			strictEqual(symlinkDoc, `${symlinkPath} -> ${realPath}`);
		});
	}

	if (process.platform === 'win32') {
		suite('WindowsExecutableExtensionsCache', () => {
			test('returns default extensions when not configured', () => {
				const cache = new WindowsExecutableExtensionsCache();
				const extensions = cache.getExtensions();

				for (const ext of windowsDefaultExecutableExtensions) {
					strictEqual(extensions.has(ext), true, `expected default extension ${ext}`);
				}
			});

			test('honors configured additions and removals', () => {
				const cache = new WindowsExecutableExtensionsCache({
					'.added': true,
					'.bat': false
				});

				const extensions = cache.getExtensions();
				strictEqual(extensions.has('.added'), true);
				strictEqual(extensions.has('.bat'), false);
				strictEqual(extensions.has('.exe'), true);
			});

			test('recomputes only after update is called', () => {
				const cache = new WindowsExecutableExtensionsCache({ '.one': true });

				const first = cache.getExtensions();
				const second = cache.getExtensions();
				strictEqual(first, second, 'expected cached set to be reused');

				cache.update({ '.two': true });
				const third = cache.getExtensions();
				strictEqual(third.has('.two'), true);
				strictEqual(third.has('.one'), false);
				strictEqual(third === first, false, 'expected cache to recompute after update');
			});
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/fixtures/symlink-test/real-executable.sh]---
Location: vscode-main/extensions/terminal-suggest/src/test/fixtures/symlink-test/real-executable.sh

```bash
#!/bin/bash
echo "real executable"
```

--------------------------------------------------------------------------------

---[FILE: extensions/terminal-suggest/src/test/fixtures/symlink-test/symlink-executable.sh]---
Location: vscode-main/extensions/terminal-suggest/src/test/fixtures/symlink-test/symlink-executable.sh

```bash
real-executable.sh
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-abyss/.vscodeignore]---
Location: vscode-main/extensions/theme-abyss/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-abyss/cgmanifest.json]---
Location: vscode-main/extensions/theme-abyss/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"description": "The themes in this folders are copied from colorsublime.com. <<<TODO check the licenses, we can easily drop the themes>>>",
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-abyss/package.json]---
Location: vscode-main/extensions/theme-abyss/package.json

```json
{
  "name": "theme-abyss",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Abyss",
        "label": "%themeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/abyss-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-abyss/package.nls.json]---
Location: vscode-main/extensions/theme-abyss/package.nls.json

```json
{
	"displayName": "Abyss Theme",
	"description": "Abyss theme for Visual Studio Code",
	"themeLabel": "Abyss"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-abyss/themes/abyss-color-theme.json]---
Location: vscode-main/extensions/theme-abyss/themes/abyss-color-theme.json

```json
{
	"name": "Abyss",
	"tokenColors": [
		{
			"settings": {
				"foreground": "#6688cc"
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown"
			],
			"settings": {
				"foreground": "#6688cc"
			}
		},
		{
			"name": "Comment",
			"scope": "comment",
			"settings": {
				"foreground": "#384887"
			}
		},
		{
			"name": "String",
			"scope": "string",
			"settings": {
				"foreground": "#22aa44"
			}
		},
		{
			"name": "Number",
			"scope": "constant.numeric",
			"settings": {
				"foreground": "#f280d0"
			}
		},
		{
			"name": "Built-in constant",
			"scope": "constant.language",
			"settings": {
				"foreground": "#f280d0"
			}
		},
		{
			"name": "User-defined constant",
			"scope": [
				"constant.character",
				"constant.other"
			],
			"settings": {
				"foreground": "#f280d0"
			}
		},
		{
			"name": "Variable",
			"scope": "variable",
			"settings": {
				"fontStyle": ""
			}
		},
		{
			"name": "Keyword",
			"scope": "keyword",
			"settings": {
				"foreground": "#225588"
			}
		},
		{
			"name": "Storage",
			"scope": "storage",
			"settings": {
				"fontStyle": "",
				"foreground": "#225588"
			}
		},
		{
			"name": "Storage type",
			"scope": "storage.type",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#9966b8"
			}
		},
		{
			"name": "Class name",
			"scope": [
				"entity.name.class",
				"entity.name.type",
				"entity.name.namespace",
				"entity.name.scope-resolution"
			],
			"settings": {
				"fontStyle": "underline",
				"foreground": "#ffeebb"
			}
		},
		{
			"name": "Inherited class",
			"scope": "entity.other.inherited-class",
			"settings": {
				"fontStyle": "italic underline",
				"foreground": "#ddbb88"
			}
		},
		{
			"name": "Function name",
			"scope": "entity.name.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#ddbb88"
			}
		},
		{
			"name": "Function argument",
			"scope": "variable.parameter",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#2277ff"
			}
		},
		{
			"name": "Tag name",
			"scope": "entity.name.tag",
			"settings": {
				"fontStyle": "",
				"foreground": "#225588"
			}
		},
		{
			"name": "Tag attribute",
			"scope": "entity.other.attribute-name",
			"settings": {
				"fontStyle": "",
				"foreground": "#ddbb88"
			}
		},
		{
			"name": "Library function",
			"scope": "support.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#9966b8"
			}
		},
		{
			"name": "Library constant",
			"scope": "support.constant",
			"settings": {
				"fontStyle": "",
				"foreground": "#9966b8"
			}
		},
		{
			"name": "Library class/type",
			"scope": [
				"support.type",
				"support.class"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#9966b8"
			}
		},
		{
			"name": "Library variable",
			"scope": "support.other.variable",
			"settings": {
				"fontStyle": ""
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"fontStyle": "",
				"foreground": "#A22D44"
			}
		},
		{
			"name": "Invalid deprecated",
			"scope": "invalid.deprecated",
			"settings": {
				"foreground": "#A22D44"
			}
		},
		{
			"name": "diff: header",
			"scope": [
				"meta.diff",
				"meta.diff.header"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#E0EDDD"
			}
		},
		{
			"name": "diff: deleted",
			"scope": "markup.deleted",
			"settings": {
				"fontStyle": "",
				"foreground": "#dc322f"
			}
		},
		{
			"name": "diff: changed",
			"scope": "markup.changed",
			"settings": {
				"fontStyle": "",
				"foreground": "#cb4b16"
			}
		},
		{
			"name": "diff: inserted",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#219186"
			}
		},
		{
			"name": "Markup Quote",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#22aa44"
			}
		},
		{
			"name": "Markup Styling",
			"scope": [
				"markup.bold",
				"markup.italic"
			],
			"settings": {
				"foreground": "#22aa44"
			}
		},
		{
			"name": "Markup: Strong",
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markup: Emphasis",
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Markup Inline",
			"scope": "markup.inline.raw",
			"settings": {
				"fontStyle": "",
				"foreground": "#9966b8"
			}
		},
		{
			"name": "Markup Headings",
			"scope": [
				"markup.heading",
				"markup.heading.setext"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#6688cc"
			}
		}
	],
	"colors": {
		"editor.background": "#000c18",
		"editor.foreground": "#6688cc",
		// Base
		// "foreground": "",
		"focusBorder": "#596F99",
		// "contrastActiveBorder": "",
		// "contrastBorder": "",
		// "widget.shadow": "",
		"input.background": "#181f2f",
		// "input.border": "",
		// "input.foreground": "",
		"inputOption.activeBorder": "#1D4A87",
		"inputValidation.infoBorder": "#384078",
		"inputValidation.infoBackground": "#051336",
		"inputValidation.warningBackground": "#5B7E7A",
		"inputValidation.warningBorder": "#5B7E7A",
		"inputValidation.errorBackground": "#A22D44",
		"inputValidation.errorBorder": "#AB395B",
		"badge.background": "#0063a5",
		"progressBar.background": "#0063a5",
		"dropdown.background": "#181f2f",
		// "dropdown.foreground": "",
		// "dropdown.border": "",
		"button.background": "#2B3C5D",
		// "button.foreground": "",
		"list.activeSelectionBackground": "#08286b",
		// "list.activeSelectionForeground": "",
		"quickInputList.focusBackground": "#08286b",
		"list.hoverBackground": "#061940",
		"list.inactiveSelectionBackground": "#152037",
		"list.dropBackground": "#041D52",
		"list.highlightForeground": "#0063a5",
		"scrollbar.shadow": "#515E91AA",
		"scrollbarSlider.activeBackground": "#3B3F5188",
		"scrollbarSlider.background": "#1F2230AA",
		"scrollbarSlider.hoverBackground": "#3B3F5188",
		// Editor
		"editorWidget.background": "#262641",
		"editorCursor.foreground": "#ddbb88",
		"editorWhitespace.foreground": "#103050",
		"editor.lineHighlightBackground": "#082050",
		"editor.selectionBackground": "#770811",
		"editorIndentGuide.background": "#002952",
		"editorIndentGuide.activeBackground": "#204972",
		"editorHoverWidget.background": "#000c38",
		"editorHoverWidget.border": "#004c18",
		"editorLineNumber.foreground": "#406385",
		"editorLineNumber.activeForeground": "#80a2c2",
		"editorMarkerNavigation.background": "#060621",
		"editorMarkerNavigationError.background": "#AB395B",
		"editorMarkerNavigationWarning.background": "#5B7E7A",
		"editorLink.activeForeground": "#0063a5",
		// "editor.findMatchBackground": "",
		"editor.findMatchHighlightBackground": "#eeeeee44",
		// "editor.findRangeHighlightBackground": "",
		// "editor.hoverHighlightBackground": "",
		// "editor.inactiveSelectionBackground": "",
		// "editor.lineHighlightBorder": "",
		// "editor.rangeHighlightBackground": "",
		// "editor.selectionHighlightBackground": "",
		// "editor.wordHighlightBackground": "",
		// "editor.wordHighlightStrongBackground": "",
		// Editor: Suggest Widget
		// "editorSuggestWidget.background": "",
		// "editorSuggestWidget.border": "",
		// "editorSuggestWidget.foreground": "",
		// "editorSuggestWidget.highlightForeground": "",
		// "editorSuggestWidget.selectedBackground": "",
		// Editor: Peek View
		"peekViewResult.background": "#060621",
		// "peekViewResult.lineForeground": "",
		// "peekViewResult.selectionBackground": "",
		// "peekViewResult.selectionForeground": "",
		"peekViewEditor.background": "#10192c",
		"peekViewTitle.background": "#10192c",
		"peekView.border": "#2b2b4a",
		"peekViewEditor.matchHighlightBackground": "#eeeeee33",
		// "peekViewResult.fileForeground": "",
		"peekViewResult.matchHighlightBackground": "#eeeeee44",
		// "peekViewTitleLabel.foreground": "",
		// "peekViewTitleDescription.foreground": "",
		// Ports
		"ports.iconRunningProcessForeground": "#80a2c2",
		// Editor: Diff
		"diffEditor.insertedTextBackground": "#31958A55",
		// "diffEditor.insertedTextBorder": "",
		"diffEditor.removedTextBackground": "#892F4688",
		// "diffEditor.removedTextBorder": "",
		// Editor: Minimap
		"minimap.selectionHighlight": "#750000",
		// Workbench: Title
		"titleBar.activeBackground": "#10192c",
		// "titleBar.activeForeground": "",
		// "titleBar.inactiveBackground": "",
		// "titleBar.inactiveForeground": "",
		// Workbench: Editors
		// "editorGroupHeader.noTabsBackground": "",
		"editorGroup.border": "#2b2b4a",
		"editorGroup.dropBackground": "#25375daa",
		"editorGroupHeader.tabsBackground": "#1c1c2a",
		// Workbench: Tabs
		"tab.border": "#2b2b4a",
		// "tab.activeBackground": "",
		"tab.inactiveBackground": "#10192c",
		// "tab.activeForeground": "",
		// "tab.inactiveForeground": "",
		"tab.lastPinnedBorder": "#2b3c5d",
		// Workbench: Activity Bar
		"activityBar.background": "#051336",
		// "activityBar.foreground": "",
		// "activityBarBadge.background": "",
		// "activityBarBadge.foreground": "",
		// Workbench: Panel
		// "panel.background": "",
		"panel.border": "#2b2b4a",
		// "panelTitle.activeBorder": "",
		// "panelTitle.activeForeground": "",
		// "panelTitle.inactiveForeground": "",
		// Workbench: Side Bar
		"sideBar.background": "#060621",
		// "sideBarTitle.foreground": "",
		"sideBarSectionHeader.background": "#10192c",
		// Workbench: Status Bar
		"statusBar.background": "#10192c",
		"statusBar.noFolderBackground": "#10192c",
		"statusBar.debuggingBackground": "#10192c",
		// "statusBar.foreground": "",
		"statusBarItem.remoteBackground": "#0063a5",
		"statusBarItem.prominentBackground": "#0063a5",
		"statusBarItem.prominentHoverBackground": "#0063a5dd",
		// "statusBarItem.activeBackground": "",
		// "statusBarItem.hoverBackground": "",
		// Workbench: Debug
		"debugToolBar.background": "#051336",
		"debugExceptionWidget.background": "#051336",
		"debugExceptionWidget.border": "#AB395B",
		// Workbench: Quick Open
		"pickerGroup.border": "#596F99",
		"pickerGroup.foreground": "#596F99",
		// Workbench: Extensions
		"extensionButton.prominentBackground": "#5f8b3b",
		"extensionButton.prominentHoverBackground": "#5f8b3bbb",
		// Workbench: Terminal
		"terminal.ansiBlack": "#111111",
		"terminal.ansiRed": "#ff9da4",
		"terminal.ansiGreen": "#d1f1a9",
		"terminal.ansiYellow": "#ffeead",
		"terminal.ansiBlue": "#bbdaff",
		"terminal.ansiMagenta": "#ebbbff",
		"terminal.ansiCyan": "#99ffff",
		"terminal.ansiWhite": "#cccccc",
		"terminal.ansiBrightBlack": "#333333",
		"terminal.ansiBrightRed": "#ff7882",
		"terminal.ansiBrightGreen": "#b8f171",
		"terminal.ansiBrightYellow": "#ffe580",
		"terminal.ansiBrightBlue": "#80baff",
		"terminal.ansiBrightMagenta": "#d778ff",
		"terminal.ansiBrightCyan": "#78ffff",
		"terminal.ansiBrightWhite": "#ffffff"
	},
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/package.json]---
Location: vscode-main/extensions/theme-defaults/package.json

```json
{
  "name": "theme-defaults",
  "displayName": "%displayName%",
  "description": "%description%",
  "categories": [
    "Themes"
  ],
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "contributes": {
    "themes": [
      {
        "id": "Default Dark+",
        "label": "%darkPlusColorThemeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/dark_plus.json"
      },
      {
        "id": "Default Dark Modern",
        "label": "%darkModernThemeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/dark_modern.json"
      },
      {
        "id": "Default Light+",
        "label": "%lightPlusColorThemeLabel%",
        "uiTheme": "vs",
        "path": "./themes/light_plus.json"
      },
      {
        "id": "Default Light Modern",
        "label": "%lightModernThemeLabel%",
        "uiTheme": "vs",
        "path": "./themes/light_modern.json"
      },
      {
        "id": "Visual Studio Dark",
        "label": "%darkColorThemeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/dark_vs.json"
      },
      {
        "id": "Visual Studio Light",
        "label": "%lightColorThemeLabel%",
        "uiTheme": "vs",
        "path": "./themes/light_vs.json"
      },
      {
        "id": "Default High Contrast",
        "label": "%hcColorThemeLabel%",
        "uiTheme": "hc-black",
        "path": "./themes/hc_black.json"
      },
      {
        "id": "Default High Contrast Light",
        "label": "%lightHcColorThemeLabel%",
        "uiTheme": "hc-light",
        "path": "./themes/hc_light.json"
      }
    ],
    "iconThemes": [
      {
        "id": "vs-minimal",
        "label": "%minimalIconThemeLabel%",
        "path": "./fileicons/vs_minimal-icon-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/package.nls.json]---
Location: vscode-main/extensions/theme-defaults/package.nls.json

```json
{
	"displayName": "Default Themes",
	"description": "The default Visual Studio light and dark themes",
	"darkPlusColorThemeLabel": "Dark+",
	"darkModernThemeLabel": "Dark Modern",
	"lightPlusColorThemeLabel": "Light+",
	"lightModernThemeLabel": "Light Modern",
	"darkColorThemeLabel": "Dark (Visual Studio)",
	"lightColorThemeLabel": "Light (Visual Studio)",
	"hcColorThemeLabel": "Dark High Contrast",
	"lightHcColorThemeLabel": "Light High Contrast",
	"minimalIconThemeLabel": "Minimal (Visual Studio Code)"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/vs_minimal-icon-theme.json]---
Location: vscode-main/extensions/theme-defaults/fileicons/vs_minimal-icon-theme.json

```json
{
	"iconDefinitions": {
		"_root_folder_dark": {
			"iconPath": "./images/root-folder-dark.svg"
		},
		"_root_folder_open_dark": {
			"iconPath": "./images/root-folder-open-dark.svg"
		},
		"_folder_dark": {
			"iconPath": "./images/folder-dark.svg"
		},
		"_folder_open_dark": {
			"iconPath": "./images/folder-open-dark.svg"
		},
		"_file_dark": {
			"iconPath": "./images/document-dark.svg"
		},
		"_root_folder": {
			"iconPath": "./images/root-folder-light.svg"
		},
		"_root_folder_open": {
			"iconPath": "./images/root-folder-open-light.svg"
		},
		"_folder_light": {
			"iconPath": "./images/folder-light.svg"
		},
		"_folder_open_light": {
			"iconPath": "./images/folder-open-light.svg"
		},
		"_file_light": {
			"iconPath": "./images/document-light.svg"
		}
	},

	"folderExpanded": "_folder_open_dark",
	"folder": "_folder_dark",
	"file": "_file_dark",
	"rootFolderExpanded": "_root_folder_open_dark",
	"rootFolder": "_root_folder_dark",
	"fileExtensions": {
		// icons by file extension
	},
	"fileNames": {
		// icons by file name
	},
	"languageIds": {
		// icons by language id
	},
	"light": {
		"folderExpanded": "_folder_open_light",
		"folder": "_folder_light",
		"rootFolderExpanded": "_root_folder_open",
		"rootFolder": "_root_folder",
		"file": "_file_light",
		"fileExtensions": {
			// icons by file extension
		},
		"fileNames": {
			// icons by file name
		},
		"languageIds": {
			// icons by language id
		}
	},
	"highContrast": {
		// overrides for high contrast
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/document-dark.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/document-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 1L3 2V14L4 15H13L14 14V5L13.7071 4.29289L10.7071 1.29289L10 1H4ZM4 14V2L9 2V6H13V14H4ZM13 5L10 2V5L13 5Z" fill="#C5C5C5"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/document-light.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/document-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M4 1L3 2V14L4 15H13L14 14V5L13.7071 4.29289L10.7071 1.29289L10 1H4ZM4 14V2L9 2V6H13V14H4ZM13 5L10 2V5L13 5Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/folder-dark.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/folder-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.01087 2.5L1.51087 2H6.50713L6.86068 2.14645L7.71349 2.99925H14.5011L15.0011 3.49925V8.99512L14.9903 9.00599V13.5021L14.4903 14.0021H1.5L1 13.5021V6.50735L1.01087 6.49648V2.5ZM14.0011 3.99925V5.00311H7.5005L7.14695 5.14956L6.28915 6.00735H2.01087V3H6.30002L7.15283 3.8528L7.50638 3.99925H14.0011ZM6.49626 7.00735H2.01087V7.49588H1.99963V11.4929H2V13.0021H13.9903V11.4929H13.9906V7.49588H13.9903V6.00311H7.70761L6.84981 6.8609L6.49626 7.00735Z" fill="#C5C5C5"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/folder-light.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/folder-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.01087 2.5L1.51087 2H6.50713L6.86068 2.14645L7.71349 2.99925H14.5011L15.0011 3.49925V8.99512L14.9903 9.00599V13.5021L14.4903 14.0021H1.5L1 13.5021V6.50735L1.01087 6.49648V2.5ZM14.0011 3.99925V5.00311H7.5005L7.14695 5.14956L6.28915 6.00735H2.01087V3H6.30002L7.15283 3.8528L7.50638 3.99925H14.0011ZM6.49626 7.00735H2.01087V7.49588H1.99963V11.4929H2V13.0021H13.9903V11.4929H13.9906V7.49588H13.9903V6.00311H7.70761L6.84981 6.8609L6.49626 7.00735Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/folder-open-dark.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/folder-open-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 3.5V6H12V4H6.5L6.146 3.854L5.293 3H1V10.418L0.025 13.342L0.5 14L0 13.5V2.5L0.5 2H5.5L5.854 2.146L6.707 3H12.5L13 3.5Z" fill="#C5C5C5"/>
<path d="M15.151 6H8.50002L8.14602 6.146L7.29302 7H2.50002L2.02502 7.342L0.0250244 13.342L0.500024 14L12.516 14L13 13.629L15.634 6.629L15.151 6ZM12.133 13L1.19302 13L2.86002 8H7.50002L7.85402 7.854L8.70702 7H14.5L12.133 13Z" fill="#C5C5C5"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/folder-open-light.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/folder-open-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 3.5V6H12V4H6.5L6.146 3.854L5.293 3H1V10.418L0.025 13.342L0.5 14L0 13.5V2.5L0.5 2H5.5L5.854 2.146L6.707 3H12.5L13 3.5Z" fill="#424242"/>
<path d="M15.151 6H8.50002L8.14602 6.146L7.29302 7H2.50002L2.02502 7.342L0.0250244 13.342L0.500024 14L12.516 14L13 13.629L15.634 6.629L15.151 6ZM12.133 13L1.19302 13L2.86002 8H7.50002L7.85402 7.854L8.70702 7H14.5L12.133 13Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/root-folder-dark.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/root-folder-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.51087 2L1.01087 2.5V6.24821C1.31813 5.99577 1.65323 5.77599 2.01087 5.59417V3H6.30003L7.15283 3.8528L7.50638 3.99925H14.0011V5.00311H7.50051L7.14695 5.14956L6.79587 5.50064C7.11147 5.64581 7.41097 5.81999 7.69096 6.01976L7.70761 6.00311H13.9903V7.49588H13.9906V11.4929H13.9903V13.0021H9.39923C9.21613 13.3599 8.99498 13.695 8.74113 14.0021H14.4903L14.9903 13.5021V9.00599L15.0011 8.99512V3.49925L14.5011 2.99925H7.71349L6.86069 2.14645L6.50713 2H1.51087Z" fill="#C5C5C5"/>
<path d="M6 10.5C6 11.3284 5.32843 12 4.5 12C3.67157 12 3 11.3284 3 10.5C3 9.67157 3.67157 9 4.5 9C5.32843 9 6 9.67157 6 10.5Z" fill="#C4C4C4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5C8 12.433 6.433 14 4.5 14C2.567 14 1 12.433 1 10.5C1 8.567 2.567 7 4.5 7C6.433 7 8 8.567 8 10.5ZM4.5 13C5.88071 13 7 11.8807 7 10.5C7 9.11929 5.88071 8 4.5 8C3.11929 8 2 9.11929 2 10.5C2 11.8807 3.11929 13 4.5 13Z" fill="#C4C4C4"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/root-folder-light.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/root-folder-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.51087 2L1.01087 2.5V6.24821C1.31813 5.99577 1.65323 5.77599 2.01087 5.59417V3H6.30003L7.15283 3.8528L7.50638 3.99925H14.0011V5.00311H7.50051L7.14695 5.14956L6.79587 5.50064C7.11147 5.64581 7.41097 5.81999 7.69096 6.01976L7.70761 6.00311H13.9903V7.49588H13.9906V11.4929H13.9903V13.0021H9.39923C9.21613 13.3599 8.99498 13.695 8.74113 14.0021H14.4903L14.9903 13.5021V9.00599L15.0011 8.99512V3.49925L14.5011 2.99925H7.71349L6.86069 2.14645L6.50713 2H1.51087Z" fill="#424242"/>
<path d="M6 10.5C6 11.3284 5.32843 12 4.5 12C3.67157 12 3 11.3284 3 10.5C3 9.67157 3.67157 9 4.5 9C5.32843 9 6 9.67157 6 10.5Z" fill="#424242"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5C8 12.433 6.433 14 4.5 14C2.567 14 1 12.433 1 10.5C1 8.567 2.567 7 4.5 7C6.433 7 8 8.567 8 10.5ZM4.5 13C5.88071 13 7 11.8807 7 10.5C7 9.11929 5.88071 8 4.5 8C3.11929 8 2 9.11929 2 10.5C2 11.8807 3.11929 13 4.5 13Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/root-folder-open-dark.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/root-folder-open-dark.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3.5V6H15.151L15.634 6.629L13 13.629L12.516 14L8.74284 14C8.99647 13.6929 9.2174 13.3578 9.4003 13L12.133 13L14.5 7H8.74284C8.52467 6.73583 8.2823 6.49238 8.01914 6.27304L8.14602 6.146L8.50002 6H12V4H6.5L6.146 3.854L5.293 3H1V6.25716C0.62057 6.57052 0.283885 6.93379 0 7.33692V2.5L0.5 2H5.5L5.854 2.146L6.707 3H12.5L13 3.5Z" fill="#C5C5C5"/>
<path d="M6 10.5C6 11.3284 5.32843 12 4.5 12C3.67157 12 3 11.3284 3 10.5C3 9.67157 3.67157 9 4.5 9C5.32843 9 6 9.67157 6 10.5Z" fill="#C4C4C4"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5C8 12.433 6.433 14 4.5 14C2.567 14 1 12.433 1 10.5C1 8.567 2.567 7 4.5 7C6.433 7 8 8.567 8 10.5ZM4.5 13C5.88071 13 7 11.8807 7 10.5C7 9.11929 5.88071 8 4.5 8C3.11929 8 2 9.11929 2 10.5C2 11.8807 3.11929 13 4.5 13Z" fill="#C4C4C4"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/fileicons/images/root-folder-open-light.svg]---
Location: vscode-main/extensions/theme-defaults/fileicons/images/root-folder-open-light.svg

```text
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3.5V6H15.151L15.634 6.629L13 13.629L12.516 14L8.74284 14C8.99647 13.6929 9.2174 13.3578 9.4003 13L12.133 13L14.5 7H8.74284C8.52467 6.73583 8.2823 6.49238 8.01914 6.27304L8.14602 6.146L8.50002 6H12V4H6.5L6.146 3.854L5.293 3H1V6.25716C0.62057 6.57052 0.283885 6.93379 0 7.33692V2.5L0.5 2H5.5L5.854 2.146L6.707 3H12.5L13 3.5Z" fill="#424242"/>
<path d="M6 10.5C6 11.3284 5.32843 12 4.5 12C3.67157 12 3 11.3284 3 10.5C3 9.67157 3.67157 9 4.5 9C5.32843 9 6 9.67157 6 10.5Z" fill="#424242"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 10.5C8 12.433 6.433 14 4.5 14C2.567 14 1 12.433 1 10.5C1 8.567 2.567 7 4.5 7C6.433 7 8 8.567 8 10.5ZM4.5 13C5.88071 13 7 11.8807 7 10.5C7 9.11929 5.88071 8 4.5 8C3.11929 8 2 9.11929 2 10.5C2 11.8807 3.11929 13 4.5 13Z" fill="#424242"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/dark_modern.json]---
Location: vscode-main/extensions/theme-defaults/themes/dark_modern.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Default Dark Modern",
	"include": "./dark_plus.json",
	"colors": {
		"activityBar.activeBorder": "#0078D4",
		"activityBar.background": "#181818",
		"activityBar.border": "#2B2B2B",
		"activityBar.foreground": "#D7D7D7",
		"activityBar.inactiveForeground": "#868686",
		"activityBarBadge.background": "#0078D4",
		"activityBarBadge.foreground": "#FFFFFF",
		"badge.background": "#616161",
		"badge.foreground": "#F8F8F8",
		"button.background": "#0078D4",
		"button.border": "#FFFFFF12",
		"button.foreground": "#FFFFFF",
		"button.hoverBackground": "#026EC1",
		"button.secondaryBackground": "#313131",
		"button.secondaryForeground": "#CCCCCC",
		"button.secondaryHoverBackground": "#3C3C3C",
		"chat.slashCommandBackground": "#26477866",
		"chat.slashCommandForeground": "#85B6FF",
		"chat.editedFileForeground": "#E2C08D",
		"checkbox.background": "#313131",
		"checkbox.border": "#3C3C3C",
		"debugToolBar.background": "#181818",
		"descriptionForeground": "#9D9D9D",
		"dropdown.background": "#313131",
		"dropdown.border": "#3C3C3C",
		"dropdown.foreground": "#CCCCCC",
		"dropdown.listBackground": "#1F1F1F",
		"editor.background": "#1F1F1F",
		"editor.findMatchBackground": "#9E6A03",
		"editor.foreground": "#CCCCCC",
		"editorGroup.border": "#FFFFFF17",
		"editorGroupHeader.tabsBackground": "#181818",
		"editorGroupHeader.tabsBorder": "#2B2B2B",
		"editorGutter.addedBackground": "#2EA043",
		"editorGutter.deletedBackground": "#F85149",
		"editorGutter.modifiedBackground": "#0078D4",
		"editorLineNumber.activeForeground": "#CCCCCC",
		"editorLineNumber.foreground": "#6E7681",
		"editorOverviewRuler.border": "#010409",
		"editorWidget.background": "#202020",
		"errorForeground": "#F85149",
		"focusBorder": "#0078D4",
		"foreground": "#CCCCCC",
		"icon.foreground": "#CCCCCC",
		"input.background": "#313131",
		"input.border": "#3C3C3C",
		"input.foreground": "#CCCCCC",
		"input.placeholderForeground": "#989898",
		"inputOption.activeBackground": "#2489DB82",
		"inputOption.activeBorder": "#2488DB",
		"keybindingLabel.foreground": "#CCCCCC",
		"menu.background": "#1F1F1F",
		"menu.selectionBackground": "#0078d4",
		"notificationCenterHeader.background": "#1F1F1F",
		"notificationCenterHeader.foreground": "#CCCCCC",
		"notifications.background": "#1F1F1F",
		"notifications.border": "#2B2B2B",
		"notifications.foreground": "#CCCCCC",
		"panel.background": "#181818",
		"panel.border": "#2B2B2B",
		"panelInput.border": "#2B2B2B",
		"panelTitle.activeBorder": "#0078D4",
		"panelTitle.activeForeground": "#CCCCCC",
		"panelTitle.inactiveForeground": "#9D9D9D",
		"peekViewEditor.background": "#1F1F1F",
		"peekViewEditor.matchHighlightBackground": "#BB800966",
		"peekViewResult.background": "#1F1F1F",
		"peekViewResult.matchHighlightBackground": "#BB800966",
		"pickerGroup.border": "#3C3C3C",
		"progressBar.background": "#0078D4",
		"quickInput.background": "#222222",
		"quickInput.foreground": "#CCCCCC",
		"settings.dropdownBackground": "#313131",
		"settings.dropdownBorder": "#3C3C3C",
		"settings.headerForeground": "#FFFFFF",
		"settings.modifiedItemIndicator": "#BB800966",
		"sideBar.background": "#181818",
		"sideBar.border": "#2B2B2B",
		"sideBar.foreground": "#CCCCCC",
		"sideBarSectionHeader.background": "#181818",
		"sideBarSectionHeader.border": "#2B2B2B",
		"sideBarSectionHeader.foreground": "#CCCCCC",
		"sideBarTitle.foreground": "#CCCCCC",
		"statusBar.background": "#181818",
		"statusBar.border": "#2B2B2B",
		"statusBarItem.hoverBackground": "#F1F1F133",
		"statusBarItem.hoverForeground": "#FFFFFF",
		"statusBar.debuggingBackground": "#0078D4",
		"statusBar.debuggingForeground": "#FFFFFF",
		"statusBar.focusBorder": "#0078D4",
		"statusBar.foreground": "#CCCCCC",
		"statusBar.noFolderBackground": "#1F1F1F",
		"statusBarItem.focusBorder": "#0078D4",
		"statusBarItem.prominentBackground": "#6E768166",
		"statusBarItem.remoteBackground": "#0078D4",
		"statusBarItem.remoteForeground": "#FFFFFF",
		"tab.activeBackground": "#1F1F1F",
		"tab.activeBorder": "#1F1F1F",
		"tab.activeBorderTop": "#0078D4",
		"tab.activeForeground": "#FFFFFF",
		"tab.selectedBorderTop": "#6caddf",
		"tab.border": "#2B2B2B",
		"tab.hoverBackground": "#1F1F1F",
		"tab.inactiveBackground": "#181818",
		"tab.inactiveForeground": "#9D9D9D",
		"tab.unfocusedActiveBorder": "#1F1F1F",
		"tab.unfocusedActiveBorderTop": "#2B2B2B",
		"tab.unfocusedHoverBackground": "#1F1F1F",
		"terminal.foreground": "#CCCCCC",
		"terminal.tab.activeBorder": "#0078D4",
		"textBlockQuote.background": "#2B2B2B",
		"textBlockQuote.border": "#616161",
		"textCodeBlock.background": "#2B2B2B",
		"textLink.activeForeground": "#4daafc",
		"textLink.foreground": "#4daafc",
		"textPreformat.foreground": "#D0D0D0",
		"textPreformat.background": "#3C3C3C",
		"textSeparator.foreground": "#21262D",
		"titleBar.activeBackground": "#181818",
		"titleBar.activeForeground": "#CCCCCC",
		"titleBar.border": "#2B2B2B",
		"titleBar.inactiveBackground": "#1F1F1F",
		"titleBar.inactiveForeground": "#9D9D9D",
		"welcomePage.tileBackground": "#2B2B2B",
		"welcomePage.progress.foreground": "#0078D4",
		"widget.border": "#313131",
	},
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/dark_plus.json]---
Location: vscode-main/extensions/theme-defaults/themes/dark_plus.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Dark+",
	"include": "./dark_vs.json",
	"tokenColors": [
		{
			"name": "Function declarations",
			"scope": [
				"entity.name.function",
				"support.function",
				"support.constant.handlebars",
				"source.powershell variable.other.member",
				"entity.name.operator.custom-literal" // See https://en.cppreference.com/w/cpp/language/user_literal
			],
			"settings": {
				"foreground": "#DCDCAA"
			}
		},
		{
			"name": "Types declaration and references",
			"scope": [
				"support.class",
				"support.type",
				"entity.name.type",
				"entity.name.namespace",
				"entity.other.attribute",
				"entity.name.scope-resolution",
				"entity.name.class",
				"storage.type.numeric.go",
				"storage.type.byte.go",
				"storage.type.boolean.go",
				"storage.type.string.go",
				"storage.type.uintptr.go",
				"storage.type.error.go",
				"storage.type.rune.go",
				"storage.type.cs",
				"storage.type.generic.cs",
				"storage.type.modifier.cs",
				"storage.type.variable.cs",
				"storage.type.annotation.java",
				"storage.type.generic.java",
				"storage.type.java",
				"storage.type.object.array.java",
				"storage.type.primitive.array.java",
				"storage.type.primitive.java",
				"storage.type.token.java",
				"storage.type.groovy",
				"storage.type.annotation.groovy",
				"storage.type.parameters.groovy",
				"storage.type.generic.groovy",
				"storage.type.object.array.groovy",
				"storage.type.primitive.array.groovy",
				"storage.type.primitive.groovy"
			],
			"settings": {
				"foreground": "#4EC9B0"
			}
		},
		{
			"name": "Types declaration and references, TS grammar specific",
			"scope": [
				"meta.type.cast.expr",
				"meta.type.new.expr",
				"support.constant.math",
				"support.constant.dom",
				"support.constant.json",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"foreground": "#4EC9B0"
			}
		},
		{
			"name": "Control flow / Special keywords",
			"scope": [
				"keyword.control",
				"source.cpp keyword.operator.new",
				"keyword.operator.delete",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator",
				"entity.name.operator"
			],
			"settings": {
				"foreground": "#C586C0"
			}
		},
		{
			"name": "Variable and parameter name",
			"scope": [
				"variable",
				"meta.definition.variable.name",
				"support.variable",
				"entity.name.variable",
				"constant.other.placeholder", // placeholders in strings
			],
			"settings": {
				"foreground": "#9CDCFE"
			}
		},
		{
			"name": "Constants and enums",
			"scope": [
				"variable.other.constant",
				"variable.other.enummember"
			],
			"settings": {
				"foreground": "#4FC1FF",
			}
		},
		{
			"name": "Object keys, TS grammar specific",
			"scope": [
				"meta.object-literal.key"
			],
			"settings": {
				"foreground": "#9CDCFE"
			}
		},
		{
			"name": "CSS property value",
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#CE9178"
			}
		},
		{
			"name": "Regular expression groups",
			"scope": [
				"punctuation.definition.group.regexp",
				"punctuation.definition.group.assertion.regexp",
				"punctuation.definition.character-class.regexp",
				"punctuation.character.set.begin.regexp",
				"punctuation.character.set.end.regexp",
				"keyword.operator.negation.regexp",
				"support.other.parenthesis.regexp"
			],
			"settings": {
				"foreground": "#CE9178"
			}
		},
		{
			"scope": [
				"constant.character.character-class.regexp",
				"constant.other.character-class.set.regexp",
				"constant.other.character-class.regexp",
				"constant.character.set.regexp"
			],
			"settings": {
				"foreground": "#d16969"
			}
		},
		{
			"scope": [
				"keyword.operator.or.regexp",
				"keyword.control.anchor.regexp"
			],
			"settings": {
				"foreground": "#DCDCAA"
			}
		},
		{
			"scope": "keyword.operator.quantifier.regexp",
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": [
				"constant.character",
				"constant.other.option"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "constant.character.escape",
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": "entity.name.label",
			"settings": {
				"foreground": "#C8C8C8"
			}
		}
	],
	"semanticTokenColors": {
		"newOperator":"#C586C0",
		"stringLiteral":"#ce9178",
		"customLiteral": "#DCDCAA",
		"numberLiteral": "#b5cea8",
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/dark_vs.json]---
Location: vscode-main/extensions/theme-defaults/themes/dark_vs.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Dark (Visual Studio)",
	"colors": {
		"checkbox.border": "#6B6B6B",
		"editor.background": "#1E1E1E",
		"editor.foreground": "#D4D4D4",
		"editor.inactiveSelectionBackground": "#3A3D41",
		"editorIndentGuide.background1": "#404040",
		"editorIndentGuide.activeBackground1": "#707070",
		"editor.selectionHighlightBackground": "#ADD6FF26",
		"list.dropBackground": "#383B3D",
		"activityBarBadge.background": "#007ACC",
		"sideBarTitle.foreground": "#BBBBBB",
		"input.placeholderForeground": "#A6A6A6",
		"menu.background": "#252526",
		"menu.foreground": "#CCCCCC",
		"menu.separatorBackground": "#454545",
		"menu.border": "#454545",
		"menu.selectionBackground": "#0078d4",
		"statusBarItem.remoteForeground": "#FFF",
		"statusBarItem.remoteBackground": "#16825D",
		"ports.iconRunningProcessForeground": "#369432",
		"sideBarSectionHeader.background": "#0000",
		"sideBarSectionHeader.border": "#ccc3",
		"tab.selectedBackground": "#222222",
		"tab.selectedForeground": "#ffffffa0",
		"tab.lastPinnedBorder": "#ccc3",
		"list.activeSelectionIconForeground": "#FFF",
		"terminal.inactiveSelectionBackground": "#3A3D41",
		"widget.border": "#303031",
		"actionBar.toggledBackground": "#383a49"
	},
	"tokenColors": [
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#D4D4D4"
			}
		},
		{
			"scope": "emphasis",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "strong",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"scope": "header",
			"settings": {
				"foreground": "#000080"
			}
		},
		{
			"scope": "comment",
			"settings": {
				"foreground": "#6A9955"
			}
		},
		{
			"scope": "constant.language",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"constant.numeric",
				"variable.other.enummember",
				"keyword.operator.plus.exponent",
				"keyword.operator.minus.exponent"
			],
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "constant.regexp",
			"settings": {
				"foreground": "#646695"
			}
		},
		{
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"entity.name.tag.css",
				"entity.name.tag.less"
			],
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": [
				"entity.other.attribute-name.class.css",
				"source.css entity.other.attribute-name.class",
				"entity.other.attribute-name.id.css",
				"entity.other.attribute-name.parent-selector.css",
				"entity.other.attribute-name.parent.less",
				"source.css entity.other.attribute-name.pseudo-class",
				"entity.other.attribute-name.pseudo-element.css",
				"source.css.less entity.other.attribute-name.id",
				"entity.other.attribute-name.scss"
			],
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": "invalid",
			"settings": {
				"foreground": "#f44747"
			}
		},
		{
			"scope": "markup.underline",
			"settings": {
				"fontStyle": "underline"
			}
		},
		{
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "markup.heading",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "markup.changed",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "punctuation.definition.quote.begin.markdown",
			"settings": {
				"foreground": "#6A9955"
			}
		},
		{
			"scope": "punctuation.definition.list.begin.markdown",
			"settings": {
				"foreground": "#6796e6"
			}
		},
		{
			"scope": "markup.inline.raw",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"name": "brackets of XML/HTML tags",
			"scope": "punctuation.definition.tag",
			"settings": {
				"foreground": "#808080"
			}
		},
		{
			"scope": [
				"meta.preprocessor",
				"entity.name.function.preprocessor"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "meta.preprocessor.string",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "meta.preprocessor.numeric",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "meta.structure.dictionary.key.python",
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": "meta.diff.header",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "storage",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "storage.type",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"storage.modifier",
				"keyword.operator.noexcept"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"string",
				"meta.embedded.assembly"
			],
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.tag",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.value",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.regexp",
			"settings": {
				"foreground": "#d16969"
			}
		},
		{
			"name": "String interpolation",
			"scope": [
				"punctuation.definition.template-expression.begin",
				"punctuation.definition.template-expression.end",
				"punctuation.section.embedded"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"name": "Reset JavaScript string interpolation expression",
			"scope": [
				"meta.template.expression"
			],
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"scope": [
				"support.type.vendored.property-name",
				"support.type.property-name",
				"source.css variable",
				"source.coffee.embedded"
			],
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": "keyword",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.control",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"scope": [
				"keyword.operator.new",
				"keyword.operator.expression",
				"keyword.operator.cast",
				"keyword.operator.sizeof",
				"keyword.operator.alignof",
				"keyword.operator.typeid",
				"keyword.operator.alignas",
				"keyword.operator.instanceof",
				"keyword.operator.logical.python",
				"keyword.operator.wordlike"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": [
				"punctuation.section.embedded.begin.php",
				"punctuation.section.embedded.end.php"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "support.function.git-rebase",
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": "constant.sha.git-rebase",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"name": "coloring of the Java import and package identifiers",
			"scope": [
				"storage.modifier.import.java",
				"variable.language.wildcard.java",
				"storage.modifier.package.java"
			],
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"name": "this.self",
			"scope": "variable.language",
			"settings": {
				"foreground": "#569cd6"
			}
		}
	],
	"semanticHighlighting": true,
	"semanticTokenColors": {
		"newOperator": "#d4d4d4",
		"stringLiteral": "#ce9178",
		"customLiteral": "#D4D4D4",
		"numberLiteral": "#b5cea8",
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/hc_black.json]---
Location: vscode-main/extensions/theme-defaults/themes/hc_black.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Dark High Contrast",
	"colors": {
		"editor.background": "#000000",
		"editor.foreground": "#FFFFFF",
		"editorIndentGuide.background1": "#FFFFFF",
		"editorIndentGuide.activeBackground1": "#FFFFFF",
		"sideBarTitle.foreground": "#FFFFFF",
		"selection.background": "#008000",
		"editor.selectionBackground": "#FFFFFF",
		"statusBarItem.remoteBackground": "#00000000",
		"ports.iconRunningProcessForeground": "#FFFFFF",
		"editorWhitespace.foreground": "#7c7c7c",
		"actionBar.toggledBackground": "#383a49"
	},
	"tokenColors": [
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#FFFFFF"
			}
		},
		{
			"scope": "emphasis",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "strong",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"scope": "meta.diff.header",
			"settings": {
				"foreground": "#000080"
			}
		},
		{
			"scope": "comment",
			"settings": {
				"foreground": "#7ca668"
			}
		},
		{
			"scope": "constant.language",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"constant.numeric",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "constant.regexp",
			"settings": {
				"foreground": "#b46695"
			}
		},
		{
			"scope": "constant.character",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": [
				"entity.name.tag.css",
				"entity.name.tag.less"
			],
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": [
				"entity.other.attribute-name.class.css",
				"source.css entity.other.attribute-name.class",
				"entity.other.attribute-name.id.css",
				"entity.other.attribute-name.parent-selector.css",
				"entity.other.attribute-name.parent.less",
				"source.css entity.other.attribute-name.pseudo-class",
				"entity.other.attribute-name.pseudo-element.css",
				"source.css.less entity.other.attribute-name.id",
				"entity.other.attribute-name.scss"
			],
			"settings": {
				"foreground": "#d7ba7d"
			}
		},
		{
			"scope": "invalid",
			"settings": {
				"foreground": "#f44747"
			}
		},
		{
			"scope": "markup.underline",
			"settings": {
				"fontStyle": "underline"
			}
		},
		{
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"scope": "markup.heading",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#6796e6"
			}
		},
		{
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "markup.changed",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"name": "brackets of XML/HTML tags",
			"scope": [
				"punctuation.definition.tag"
			],
			"settings": {
				"foreground": "#808080"
			}
		},
		{
			"scope": "meta.preprocessor",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "meta.preprocessor.string",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "meta.preprocessor.numeric",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "meta.structure.dictionary.key.python",
			"settings": {
				"foreground": "#9cdcfe"
			}
		},
		{
			"scope": "storage",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "storage.type",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "storage.modifier",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "string",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.tag",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.value",
			"settings": {
				"foreground": "#ce9178"
			}
		},
		{
			"scope": "string.regexp",
			"settings": {
				"foreground": "#d16969"
			}
		},
		{
			"name": "String interpolation",
			"scope": [
				"punctuation.definition.template-expression.begin",
				"punctuation.definition.template-expression.end",
				"punctuation.section.embedded"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"name": "Reset JavaScript string interpolation expression",
			"scope": [
				"meta.template.expression"
			],
			"settings": {
				"foreground": "#ffffff"
			}
		},
		{
			"scope": [
				"support.type.vendored.property-name",
				"support.type.property-name",
				"source.css variable",
				"source.coffee.embedded"
			],
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"scope": "keyword",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.control",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"scope": [
				"keyword.operator.new",
				"keyword.operator.expression",
				"keyword.operator.cast",
				"keyword.operator.sizeof",
				"keyword.operator.logical.python"
			],
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"scope": "support.function.git-rebase",
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"scope": "constant.sha.git-rebase",
			"settings": {
				"foreground": "#b5cea8"
			}
		},
		{
			"name": "coloring of the Java import and package identifiers",
			"scope": [
				"storage.modifier.import.java",
				"variable.language.wildcard.java",
				"storage.modifier.package.java"
			],
			"settings": {
				"foreground": "#d4d4d4"
			}
		},
		{
			"name": "coloring of the TS this",
			"scope": "variable.language.this",
			"settings": {
				"foreground": "#569cd6"
			}
		},
		{
			"name": "Function declarations",
			"scope": [
				"entity.name.function",
				"support.function",
				"support.constant.handlebars",
				"source.powershell variable.other.member"
			],
			"settings": {
				"foreground": "#DCDCAA"
			}
		},
		{
			"name": "Types declaration and references",
			"scope": [
				"support.class",
				"support.type",
				"entity.name.type",
				"entity.name.namespace",
				"entity.name.scope-resolution",
				"entity.name.class",
				"storage.type.cs",
				"storage.type.generic.cs",
				"storage.type.modifier.cs",
				"storage.type.variable.cs",
				"storage.type.annotation.java",
				"storage.type.generic.java",
				"storage.type.java",
				"storage.type.object.array.java",
				"storage.type.primitive.array.java",
				"storage.type.primitive.java",
				"storage.type.token.java",
				"storage.type.groovy",
				"storage.type.annotation.groovy",
				"storage.type.parameters.groovy",
				"storage.type.generic.groovy",
				"storage.type.object.array.groovy",
				"storage.type.primitive.array.groovy",
				"storage.type.primitive.groovy"
			],
			"settings": {
				"foreground": "#4EC9B0"
			}
		},
		{
			"name": "Types declaration and references, TS grammar specific",
			"scope": [
				"meta.type.cast.expr",
				"meta.type.new.expr",
				"support.constant.math",
				"support.constant.dom",
				"support.constant.json",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"foreground": "#4EC9B0"
			}
		},
		{
			"name": "Control flow / Special keywords",
			"scope": [
				"keyword.control",
				"source.cpp keyword.operator.new",
				"source.cpp keyword.operator.delete",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator"
			],
			"settings": {
				"foreground": "#C586C0"
			}
		},
		{
			"name": "Variable and parameter name",
			"scope": [
				"variable",
				"meta.definition.variable.name",
				"support.variable"
			],
			"settings": {
				"foreground": "#9CDCFE"
			}
		},
		{
			"name": "Object keys, TS grammar specific",
			"scope": [
				"meta.object-literal.key"
			],
			"settings": {
				"foreground": "#9CDCFE"
			}
		},
		{
			"name": "CSS property value",
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#CE9178"
			}
		},
		{
			"name": "HC Search Editor context line override",
			"scope": "meta.resultLinePrefix.contextLinePrefix.search",
			"settings": {
				"foreground": "#CBEDCB"
			}
		}
	],
	"semanticHighlighting": true,
	"semanticTokenColors": {
		"newOperator": "#FFFFFF",
		"stringLiteral": "#ce9178",
		"customLiteral": "#DCDCAA",
		"numberLiteral": "#b5cea8"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/hc_light.json]---
Location: vscode-main/extensions/theme-defaults/themes/hc_light.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Light High Contrast",
	"tokenColors": [
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#292929"
			}
		},
		{
			"scope": "emphasis",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "strong",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"scope": "meta.diff.header",
			"settings": {
				"foreground": "#062F4A"
			}
		},
		{
			"scope": "comment",
			"settings": {
				"foreground": "#515151"
			}
		},
		{
			"scope": "constant.language",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": [
				"constant.numeric",
				"variable.other.enummember",
				"keyword.operator.plus.exponent",
				"keyword.operator.minus.exponent"
			],
			"settings": {
				"foreground": "#096d48"
			}
		},
		{
			"scope": "constant.regexp",
			"settings": {
				"foreground": "#811F3F"
			}
		},
		{
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "entity.name.selector",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#264F78"
			}
		},
		{
			"scope": [
				"entity.other.attribute-name.class.css",
				"source.css entity.other.attribute-name.class",
				"entity.other.attribute-name.id.css",
				"entity.other.attribute-name.parent-selector.css",
				"entity.other.attribute-name.parent.less",
				"source.css entity.other.attribute-name.pseudo-class",
				"entity.other.attribute-name.pseudo-element.css",
				"source.css.less entity.other.attribute-name.id",
				"entity.other.attribute-name.scss"
			],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "invalid",
			"settings": {
				"foreground": "#B5200D"
			}
		},
		{
			"scope": "markup.underline",
			"settings": {
				"fontStyle": "underline"
			}
		},
		{
			"scope": "markup.bold",
			"settings": {
				"foreground": "#000080",
				"fontStyle": "bold"
			}
		},
		{
			"scope": "markup.heading",
			"settings": {
				"foreground": "#0F4A85",
				"fontStyle": "bold"
			}
		},
		{
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#096d48"
			}
		},
		{
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#5A5A5A"
			}
		},
		{
			"scope": "markup.changed",
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": [
				"punctuation.definition.quote.begin.markdown",
				"punctuation.definition.list.begin.markdown"
			],
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": "markup.inline.raw",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "punctuation.definition.tag",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": ["meta.preprocessor", "entity.name.function.preprocessor"],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "meta.preprocessor.string",
			"settings": {
				"foreground": "#b5200d"
			}
		},
		{
			"scope": "meta.preprocessor.numeric",
			"settings": {
				"foreground": "#096d48"
			}
		},
		{
			"scope": "meta.structure.dictionary.key.python",
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": "storage",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "storage.type",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": ["storage.modifier", "keyword.operator.noexcept"],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": ["string", "meta.embedded.assembly"],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": [
				"string.comment.buffered.block.pug",
				"string.quoted.pug",
				"string.interpolated.pug",
				"string.unquoted.plain.in.yaml",
				"string.unquoted.plain.out.yaml",
				"string.unquoted.block.yaml",
				"string.quoted.single.yaml",
				"string.quoted.double.xml",
				"string.quoted.single.xml",
				"string.unquoted.cdata.xml",
				"string.quoted.double.html",
				"string.quoted.single.html",
				"string.unquoted.html",
				"string.quoted.single.handlebars",
				"string.quoted.double.handlebars"
			],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "string.regexp",
			"settings": {
				"foreground": "#811F3F"
			}
		},
		{
			"scope": [
				"punctuation.definition.template-expression.begin",
				"punctuation.definition.template-expression.end",
				"punctuation.section.embedded"
			],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": ["meta.template.expression"],
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": [
				"support.type.vendored.property-name",
				"support.type.property-name",
				"source.css variable",
				"source.coffee.embedded"
			],
			"settings": {
				"foreground": "#264F78"
			}
		},
		{
			"scope": ["support.type.property-name.json"],
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": "keyword",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "keyword.control",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": [
				"keyword.operator.new",
				"keyword.operator.expression",
				"keyword.operator.cast",
				"keyword.operator.sizeof",
				"keyword.operator.alignof",
				"keyword.operator.typeid",
				"keyword.operator.alignas",
				"keyword.operator.instanceof",
				"keyword.operator.logical.python",
				"keyword.operator.wordlike"
			],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#096d48"
			}
		},
		{
			"scope": [
				"punctuation.section.embedded.begin.php",
				"punctuation.section.embedded.end.php"
			],
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "support.function.git-rebase",
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": "constant.sha.git-rebase",
			"settings": {
				"foreground": "#096d48"
			}
		},
		{
			"scope": [
				"storage.modifier.import.java",
				"variable.language.wildcard.java",
				"storage.modifier.package.java"
			],
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": "variable.language",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": [
				"entity.name.function",
				"support.function",
				"support.constant.handlebars",
				"source.powershell variable.other.member",
				"entity.name.operator.custom-literal"
			],
			"settings": {
				"foreground": "#5e2cbc"
			}
		},
		{
			"scope": [
				"support.class",
				"support.type",
				"entity.name.type",
				"entity.name.namespace",
				"entity.other.attribute",
				"entity.name.scope-resolution",
				"entity.name.class",
				"storage.type.numeric.go",
				"storage.type.byte.go",
				"storage.type.boolean.go",
				"storage.type.string.go",
				"storage.type.uintptr.go",
				"storage.type.error.go",
				"storage.type.rune.go",
				"storage.type.cs",
				"storage.type.generic.cs",
				"storage.type.modifier.cs",
				"storage.type.variable.cs",
				"storage.type.annotation.java",
				"storage.type.generic.java",
				"storage.type.java",
				"storage.type.object.array.java",
				"storage.type.primitive.array.java",
				"storage.type.primitive.java",
				"storage.type.token.java",
				"storage.type.groovy",
				"storage.type.annotation.groovy",
				"storage.type.parameters.groovy",
				"storage.type.generic.groovy",
				"storage.type.object.array.groovy",
				"storage.type.primitive.array.groovy",
				"storage.type.primitive.groovy"
			],
			"settings": {
				"foreground": "#185E73"
			}
		},
		{
			"scope": [
				"meta.type.cast.expr",
				"meta.type.new.expr",
				"support.constant.math",
				"support.constant.dom",
				"support.constant.json",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"foreground": "#185E73"
			}
		},
		{
			"scope": [
				"keyword.control",
				"source.cpp keyword.operator.new",
				"source.cpp keyword.operator.delete",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator",
				"entity.name.operator"
			],
			"settings": {
				"foreground": "#b5200d"
			}
		},
		{
			"scope": [
				"variable",
				"meta.definition.variable.name",
				"support.variable",
				"entity.name.variable",
				"constant.other.placeholder"
			],
			"settings": {
				"foreground": "#001080"
			}
		},
		{
			"scope": ["variable.other.constant", "variable.other.enummember"],
			"settings": {
				"foreground": "#02715D"
			}
		},
		{
			"scope": ["meta.object-literal.key"],
			"settings": {
				"foreground": "#001080"
			}
		},
		{
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#0451A5"
			}
		},
		{
			"scope": [
				"punctuation.definition.group.regexp",
				"punctuation.definition.group.assertion.regexp",
				"punctuation.definition.character-class.regexp",
				"punctuation.character.set.begin.regexp",
				"punctuation.character.set.end.regexp",
				"keyword.operator.negation.regexp",
				"support.other.parenthesis.regexp"
			],
			"settings": {
				"foreground": "#D16969"
			}
		},
		{
			"scope": [
				"constant.character.character-class.regexp",
				"constant.other.character-class.set.regexp",
				"constant.other.character-class.regexp",
				"constant.character.set.regexp"
			],
			"settings": {
				"foreground": "#811F3F"
			}
		},
		{
			"scope": "keyword.operator.quantifier.regexp",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": ["keyword.operator.or.regexp", "keyword.control.anchor.regexp"],
			"settings": {
				"foreground": "#EE0000"
			}
		},
		{
			"scope": "constant.character",
			"settings": {
				"foreground": "#0F4A85"
			}
		},
		{
			"scope": "constant.character.escape",
			"settings": {
				"foreground": "#EE0000"
			}
		},
		{
			"scope": "entity.name.label",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": "token.info-token",
			"settings": {
				"foreground": "#316BCD"
			}
		},
		{
			"scope": "token.warn-token",
			"settings": {
				"foreground": "#CD9731"
			}
		},
		{
			"scope": "token.error-token",
			"settings": {
				"foreground": "#CD3131"
			}
		},
		{
			"scope": "token.debug-token",
			"settings": {
				"foreground": "#800080"
			}
		}
	],
	"colors": {
		"actionBar.toggledBackground": "#dddddd",
		"statusBarItem.remoteBackground": "#FFFFFF",
		"statusBarItem.remoteForeground": "#000000"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/light_modern.json]---
Location: vscode-main/extensions/theme-defaults/themes/light_modern.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Default Light Modern",
	"include": "./light_plus.json",
	"colors": {
		"activityBar.activeBorder": "#005FB8",
		"activityBar.background": "#F8F8F8",
		"activityBar.border": "#E5E5E5",
		"activityBar.foreground": "#1F1F1F",
		"activityBar.inactiveForeground": "#616161",
		"activityBarBadge.background": "#005FB8",
		"activityBarBadge.foreground": "#FFFFFF",
		"badge.background": "#CCCCCC",
		"badge.foreground": "#3B3B3B",
		"button.background": "#005FB8",
		"button.border": "#0000001a",
		"button.foreground": "#FFFFFF",
		"button.hoverBackground": "#0258A8",
		"button.secondaryBackground": "#E5E5E5",
		"button.secondaryForeground": "#3B3B3B",
		"button.secondaryHoverBackground": "#CCCCCC",
		"chat.slashCommandBackground": "#ADCEFF7A",
		"chat.slashCommandForeground": "#26569E",
		"chat.editedFileForeground": "#895503",
		"checkbox.background": "#F8F8F8",
		"checkbox.border": "#CECECE",
		"descriptionForeground": "#3B3B3B",
		"dropdown.background": "#FFFFFF",
		"dropdown.border": "#CECECE",
		"dropdown.foreground": "#3B3B3B",
		"dropdown.listBackground": "#FFFFFF",
		"editor.background": "#FFFFFF",
		"editor.foreground": "#3B3B3B",
		"editor.inactiveSelectionBackground": "#E5EBF1",
		"editor.selectionHighlightBackground": "#ADD6FF80",
		"editorGroup.border": "#E5E5E5",
		"editorGroupHeader.tabsBackground": "#F8F8F8",
		"editorGroupHeader.tabsBorder": "#E5E5E5",
		"editorGutter.addedBackground": "#2EA043",
		"editorGutter.deletedBackground": "#F85149",
		"editorGutter.modifiedBackground": "#005FB8",
		"editorIndentGuide.background1": "#D3D3D3",
		"editorLineNumber.activeForeground": "#171184",
		"editorLineNumber.foreground": "#6E7681",
		"editorOverviewRuler.border": "#E5E5E5",
		"editorSuggestWidget.background": "#F8F8F8",
		"editorWidget.background": "#F8F8F8",
		"errorForeground": "#F85149",
		"focusBorder": "#005FB8",
		"foreground": "#3B3B3B",
		"icon.foreground": "#3B3B3B",
		"input.background": "#FFFFFF",
		"input.border": "#CECECE",
		"input.foreground": "#3B3B3B",
		"input.placeholderForeground": "#767676",
		"inputOption.activeBackground": "#BED6ED",
		"inputOption.activeBorder": "#005FB8",
		"inputOption.activeForeground": "#000000",
		"keybindingLabel.foreground": "#3B3B3B",
		"list.activeSelectionBackground": "#E8E8E8",
		"list.activeSelectionForeground": "#000000",
		"list.activeSelectionIconForeground": "#000000",
		"list.hoverBackground": "#F2F2F2",
		"list.focusAndSelectionOutline": "#005FB8",
		"menu.border": "#CECECE",
		"menu.selectionBackground": "#005FB8",
		"menu.selectionForeground": "#ffffff",
		"notebook.cellBorderColor": "#E5E5E5",
		"notebook.selectedCellBackground": "#C8DDF150",
		"notificationCenterHeader.background": "#FFFFFF",
		"notificationCenterHeader.foreground": "#3B3B3B",
		"notifications.background": "#FFFFFF",
		"notifications.border": "#E5E5E5",
		"notifications.foreground": "#3B3B3B",
		"panel.background": "#F8F8F8",
		"panel.border": "#E5E5E5",
		"panelInput.border": "#E5E5E5",
		"panelTitle.activeBorder": "#005FB8",
		"panelTitle.activeForeground": "#3B3B3B",
		"panelTitle.inactiveForeground": "#3B3B3B",
		"peekViewEditor.matchHighlightBackground": "#BB800966",
		"peekViewResult.background": "#FFFFFF",
		"peekViewResult.matchHighlightBackground": "#BB800966",
		"pickerGroup.border": "#E5E5E5",
		"pickerGroup.foreground": "#8B949E",
		"ports.iconRunningProcessForeground": "#369432",
		"progressBar.background": "#005FB8",
		"quickInput.background": "#F8F8F8",
		"quickInput.foreground": "#3B3B3B",
		"searchEditor.textInputBorder": "#CECECE",
		"settings.dropdownBackground": "#FFFFFF",
		"settings.dropdownBorder": "#CECECE",
		"settings.headerForeground": "#1F1F1F",
		"settings.modifiedItemIndicator": "#BB800966",
		"settings.numberInputBorder": "#CECECE",
		"settings.textInputBorder": "#CECECE",
		"sideBar.background": "#F8F8F8",
		"sideBar.border": "#E5E5E5",
		"sideBar.foreground": "#3B3B3B",
		"sideBarSectionHeader.background": "#F8F8F8",
		"sideBarSectionHeader.border": "#E5E5E5",
		"sideBarSectionHeader.foreground": "#3B3B3B",
		"sideBarTitle.foreground": "#3B3B3B",
		"statusBar.background": "#F8F8F8",
		"statusBar.foreground": "#3B3B3B",
		"statusBar.border": "#E5E5E5",
		"statusBarItem.hoverBackground": "#1F1F1F11",
		"statusBarItem.hoverForeground": "#000000",
		"statusBarItem.compactHoverBackground": "#CCCCCC",
		"statusBar.debuggingBackground": "#FD716C",
		"statusBar.debuggingForeground": "#000000",
		"statusBar.focusBorder": "#005FB8",
		"statusBar.noFolderBackground": "#F8F8F8",
		"statusBarItem.errorBackground": "#C72E0F",
		"statusBarItem.focusBorder": "#005FB8",
		"statusBarItem.prominentBackground": "#6E768166",
		"statusBarItem.remoteBackground": "#005FB8",
		"statusBarItem.remoteForeground": "#FFFFFF",
		"tab.activeBackground": "#FFFFFF",
		"tab.activeBorder": "#F8F8F8",
		"tab.activeBorderTop": "#005FB8",
		"tab.activeForeground": "#3B3B3B",
		"tab.selectedBorderTop": "#68a3da",
		"tab.border": "#E5E5E5",
		"tab.hoverBackground": "#FFFFFF",
		"tab.inactiveBackground": "#F8F8F8",
		"tab.inactiveForeground": "#868686",
		"tab.lastPinnedBorder": "#D4D4D4",
		"tab.unfocusedActiveBorder": "#F8F8F8",
		"tab.unfocusedActiveBorderTop": "#E5E5E5",
		"tab.unfocusedHoverBackground": "#F8F8F8",
		"terminalCursor.foreground": "#005FB8",
		"terminal.foreground": "#3B3B3B",
		"terminal.inactiveSelectionBackground": "#E5EBF1",
		"terminal.tab.activeBorder": "#005FB8",
		"textBlockQuote.background": "#F8F8F8",
		"textBlockQuote.border": "#E5E5E5",
		"textCodeBlock.background": "#F8F8F8",
		"textLink.activeForeground": "#005FB8",
		"textLink.foreground": "#005FB8",
		"textPreformat.foreground": "#3B3B3B",
		"textPreformat.background": "#0000001F",
		"textSeparator.foreground": "#21262D",
		"titleBar.activeBackground": "#F8F8F8",
		"titleBar.activeForeground": "#1E1E1E",
		"titleBar.border": "#E5E5E5",
		"titleBar.inactiveBackground": "#F8F8F8",
		"titleBar.inactiveForeground": "#8B949E",
		"welcomePage.tileBackground": "#F3F3F3",
		"widget.border": "#E5E5E5"
	},
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/light_plus.json]---
Location: vscode-main/extensions/theme-defaults/themes/light_plus.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Light+",
	"include": "./light_vs.json",
	"tokenColors": [ // adds rules to the light vs rules
		{
			"name": "Function declarations",
			"scope": [
				"entity.name.function",
				"support.function",
				"support.constant.handlebars",
				"source.powershell variable.other.member",
				"entity.name.operator.custom-literal" // See https://en.cppreference.com/w/cpp/language/user_literal
			],
			"settings": {
				"foreground": "#795E26"
			}
		},
		{
			"name": "Types declaration and references",
			"scope": [
				"support.class",
				"support.type",
				"entity.name.type",
				"entity.name.namespace",
				"entity.other.attribute",
				"entity.name.scope-resolution",
				"entity.name.class",
				"storage.type.numeric.go",
				"storage.type.byte.go",
				"storage.type.boolean.go",
				"storage.type.string.go",
				"storage.type.uintptr.go",
				"storage.type.error.go",
				"storage.type.rune.go",
				"storage.type.cs",
				"storage.type.generic.cs",
				"storage.type.modifier.cs",
				"storage.type.variable.cs",
				"storage.type.annotation.java",
				"storage.type.generic.java",
				"storage.type.java",
				"storage.type.object.array.java",
				"storage.type.primitive.array.java",
				"storage.type.primitive.java",
				"storage.type.token.java",
				"storage.type.groovy",
				"storage.type.annotation.groovy",
				"storage.type.parameters.groovy",
				"storage.type.generic.groovy",
				"storage.type.object.array.groovy",
				"storage.type.primitive.array.groovy",
				"storage.type.primitive.groovy"
			],
			"settings": {
				"foreground": "#267f99"
			}
		},
		{
			"name": "Types declaration and references, TS grammar specific",
			"scope": [
				"meta.type.cast.expr",
				"meta.type.new.expr",
				"support.constant.math",
				"support.constant.dom",
				"support.constant.json",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"foreground": "#267f99"
			}
		},
		{
			"name": "Control flow / Special keywords",
			"scope": [
				"keyword.control",
				"source.cpp keyword.operator.new",
				"source.cpp keyword.operator.delete",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator",
				"entity.name.operator"
			],
			"settings": {
				"foreground": "#AF00DB"
			}
		},
		{
			"name": "Variable and parameter name",
			"scope": [
				"variable",
				"meta.definition.variable.name",
				"support.variable",
				"entity.name.variable",
				"constant.other.placeholder", // placeholders in strings

			],
			"settings": {
				"foreground": "#001080"
			}
		},
		{
			"name": "Constants and enums",
			"scope": [
				"variable.other.constant",
				"variable.other.enummember"
			],
			"settings": {
				"foreground": "#0070C1",
			}
		},
		{
			"name": "Object keys, TS grammar specific",
			"scope": [
				"meta.object-literal.key"
			],
			"settings": {
				"foreground": "#001080"
			}
		},
		{
			"name": "CSS property value",
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"name": "Regular expression groups",
			"scope": [
				"punctuation.definition.group.regexp",
				"punctuation.definition.group.assertion.regexp",
				"punctuation.definition.character-class.regexp",
				"punctuation.character.set.begin.regexp",
				"punctuation.character.set.end.regexp",
				"keyword.operator.negation.regexp",
				"support.other.parenthesis.regexp"
			],
			"settings": {
				"foreground": "#d16969"
			}
		},
		{
			"scope": [
				"constant.character.character-class.regexp",
				"constant.other.character-class.set.regexp",
				"constant.other.character-class.regexp",
				"constant.character.set.regexp"
			],
			"settings": {
				"foreground": "#811f3f"
			}
		},
		{
			"scope": "keyword.operator.quantifier.regexp",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": [
				"keyword.operator.or.regexp",
				"keyword.control.anchor.regexp"
			],
			"settings": {
				"foreground": "#EE0000"
			}
		},
		{
			"scope": [
				"constant.character",
				"constant.other.option"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "constant.character.escape",
			"settings": {
				"foreground": "#EE0000"
			}
		},
		{
			"scope": "entity.name.label",
			"settings": {
				"foreground": "#000000"
			}
		}
	],
	"semanticHighlighting": true,
	"semanticTokenColors": {
		"newOperator": "#AF00DB",
		"stringLiteral": "#a31515",
		"customLiteral": "#795E26",
		"numberLiteral": "#098658",
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-defaults/themes/light_vs.json]---
Location: vscode-main/extensions/theme-defaults/themes/light_vs.json

```json
{
	"$schema": "vscode://schemas/color-theme",
	"name": "Light (Visual Studio)",
	"colors": {
		"checkbox.border": "#919191",
		"editor.background": "#FFFFFF",
		"editor.foreground": "#000000",
		"editor.inactiveSelectionBackground": "#E5EBF1",
		"editorIndentGuide.background1": "#D3D3D3",
		"editorIndentGuide.activeBackground1": "#939393",
		"editor.selectionHighlightBackground": "#ADD6FF80",
		"editorSuggestWidget.background": "#F3F3F3",
		"activityBarBadge.background": "#007ACC",
		"sideBarTitle.foreground": "#6F6F6F",
		"list.hoverBackground": "#E8E8E8",
		"menu.border": "#D4D4D4",
		"input.placeholderForeground": "#767676",
		"searchEditor.textInputBorder": "#CECECE",
		"settings.textInputBorder": "#CECECE",
		"settings.numberInputBorder": "#CECECE",
		"statusBarItem.remoteForeground": "#FFF",
		"statusBarItem.remoteBackground": "#16825D",
		"ports.iconRunningProcessForeground": "#369432",
		"sideBarSectionHeader.background": "#0000",
		"sideBarSectionHeader.border": "#61616130",
		"tab.selectedForeground": "#333333b3",
		"tab.selectedBackground": "#ffffffa5",
		"tab.lastPinnedBorder": "#61616130",
		"notebook.cellBorderColor": "#E8E8E8",
		"notebook.selectedCellBackground": "#c8ddf150",
		"statusBarItem.errorBackground": "#c72e0f",
		"list.activeSelectionIconForeground": "#FFF",
		"list.focusAndSelectionOutline": "#90C2F9",
		"terminal.inactiveSelectionBackground": "#E5EBF1",
		"widget.border": "#d4d4d4",
		"actionBar.toggledBackground": "#dddddd",
		"diffEditor.unchangedRegionBackground": "#f8f8f8"
	},
	"tokenColors": [
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#000000ff"
			}
		},
		{
			"scope": "emphasis",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "strong",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"scope": "meta.diff.header",
			"settings": {
				"foreground": "#000080"
			}
		},
		{
			"scope": "comment",
			"settings": {
				"foreground": "#008000"
			}
		},
		{
			"scope": "constant.language",
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": [
				"constant.numeric",
				"variable.other.enummember",
				"keyword.operator.plus.exponent",
				"keyword.operator.minus.exponent"
			],
			"settings": {
				"foreground": "#098658"
			}
		},
		{
			"scope": "constant.regexp",
			"settings": {
				"foreground": "#811f3f"
			}
		},
		{
			"name": "css tags in selectors, xml tags",
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"scope": "entity.name.selector",
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#e50000"
			}
		},
		{
			"scope": [
				"entity.other.attribute-name.class.css",
				"source.css entity.other.attribute-name.class",
				"entity.other.attribute-name.id.css",
				"entity.other.attribute-name.parent-selector.css",
				"entity.other.attribute-name.parent.less",
				"source.css entity.other.attribute-name.pseudo-class",
				"entity.other.attribute-name.pseudo-element.css",
				"source.css.less entity.other.attribute-name.id",
				"entity.other.attribute-name.scss"
			],
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"scope": "invalid",
			"settings": {
				"foreground": "#cd3131"
			}
		},
		{
			"scope": "markup.underline",
			"settings": {
				"fontStyle": "underline"
			}
		},
		{
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#000080"
			}
		},
		{
			"scope": "markup.heading",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#800000"
			}
		},
		{
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#098658"
			}
		},
		{
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#a31515"
			}
		},
		{
			"scope": "markup.changed",
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": [
				"punctuation.definition.quote.begin.markdown",
				"punctuation.definition.list.begin.markdown"
			],
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": "markup.inline.raw",
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"name": "brackets of XML/HTML tags",
			"scope": "punctuation.definition.tag",
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"scope": [
				"meta.preprocessor",
				"entity.name.function.preprocessor"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "meta.preprocessor.string",
			"settings": {
				"foreground": "#a31515"
			}
		},
		{
			"scope": "meta.preprocessor.numeric",
			"settings": {
				"foreground": "#098658"
			}
		},
		{
			"scope": "meta.structure.dictionary.key.python",
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": "storage",
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "storage.type",
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": [
				"storage.modifier",
				"keyword.operator.noexcept"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": [
				"string",
				"meta.embedded.assembly"
			],
			"settings": {
				"foreground": "#a31515"
			}
		},
		{
			"scope": [
				"string.comment.buffered.block.pug",
				"string.quoted.pug",
				"string.interpolated.pug",
				"string.unquoted.plain.in.yaml",
				"string.unquoted.plain.out.yaml",
				"string.unquoted.block.yaml",
				"string.quoted.single.yaml",
				"string.quoted.double.xml",
				"string.quoted.single.xml",
				"string.unquoted.cdata.xml",
				"string.quoted.double.html",
				"string.quoted.single.html",
				"string.unquoted.html",
				"string.quoted.single.handlebars",
				"string.quoted.double.handlebars"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "string.regexp",
			"settings": {
				"foreground": "#811f3f"
			}
		},
		{
			"name": "String interpolation",
			"scope": [
				"punctuation.definition.template-expression.begin",
				"punctuation.definition.template-expression.end",
				"punctuation.section.embedded"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"name": "Reset JavaScript string interpolation expression",
			"scope": [
				"meta.template.expression"
			],
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": [
				"support.constant.property-value",
				"support.constant.font-name",
				"support.constant.media-type",
				"support.constant.media",
				"constant.other.color.rgb-value",
				"constant.other.rgb-value",
				"support.constant.color"
			],
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": [
				"support.type.vendored.property-name",
				"support.type.property-name",
				"source.css variable",
				"source.coffee.embedded"
			],
			"settings": {
				"foreground": "#e50000"
			}
		},
		{
			"scope": [
				"support.type.property-name.json"
			],
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": "keyword",
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "keyword.control",
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": [
				"keyword.operator.new",
				"keyword.operator.expression",
				"keyword.operator.cast",
				"keyword.operator.sizeof",
				"keyword.operator.alignof",
				"keyword.operator.typeid",
				"keyword.operator.alignas",
				"keyword.operator.instanceof",
				"keyword.operator.logical.python",
				"keyword.operator.wordlike"
			],
			"settings": {
				"foreground": "#0000ff"
			}
		},
		{
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#098658"
			}
		},
		{
			"scope": [
				"punctuation.section.embedded.begin.php",
				"punctuation.section.embedded.end.php"
			],
			"settings": {
				"foreground": "#800000"
			}
		},
		{
			"scope": "support.function.git-rebase",
			"settings": {
				"foreground": "#0451a5"
			}
		},
		{
			"scope": "constant.sha.git-rebase",
			"settings": {
				"foreground": "#098658"
			}
		},
		{
			"name": "coloring of the Java import and package identifiers",
			"scope": [
				"storage.modifier.import.java",
				"variable.language.wildcard.java",
				"storage.modifier.package.java"
			],
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"name": "this.self",
			"scope": "variable.language",
			"settings": {
				"foreground": "#0000ff"
			}
		}
	],
	"semanticHighlighting": true,
	"semanticTokenColors": {
		"newOperator": "#0000ff",
		"stringLiteral": "#a31515",
		"customLiteral": "#000000",
		"numberLiteral": "#098658",
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-kimbie-dark/.vscodeignore]---
Location: vscode-main/extensions/theme-kimbie-dark/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-kimbie-dark/cgmanifest.json]---
Location: vscode-main/extensions/theme-kimbie-dark/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-kimbie-dark/package.json]---
Location: vscode-main/extensions/theme-kimbie-dark/package.json

```json
{
  "name": "theme-kimbie-dark",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Kimbie Dark",
        "label": "%themeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/kimbie-dark-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-kimbie-dark/package.nls.json]---
Location: vscode-main/extensions/theme-kimbie-dark/package.nls.json

```json
{
	"displayName": "Kimbie Dark Theme",
	"description": "Kimbie dark theme for Visual Studio Code",
	"themeLabel": "Kimbie Dark"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-kimbie-dark/themes/kimbie-dark-color-theme.json]---
Location: vscode-main/extensions/theme-kimbie-dark/themes/kimbie-dark-color-theme.json

```json
{
	"name": "Kimbie Dark",
	"type": "dark",
	"colors": {
		"input.background": "#51412c",
		"dropdown.background": "#51412c",
		"editor.background": "#221a0f",
		"editor.foreground": "#d3af86",
		"focusBorder": "#a57a4c",
		"list.highlightForeground": "#e3b583",
		"list.activeSelectionBackground": "#7c5021",
		"list.hoverBackground": "#7c502166",
		"quickInputList.focusBackground": "#7c5021AA",
		"list.inactiveSelectionBackground": "#645342",
		"pickerGroup.foreground": "#e3b583",
		"pickerGroup.border": "#e3b583",
		"inputOption.activeBorder": "#a57a4c",
		"selection.background": "#84613daa",
		"editor.selectionBackground": "#84613daa",
		"minimap.selectionHighlight": "#84613daa",
		"editorWidget.background": "#131510",
		"editorHoverWidget.background": "#221a14",
		"editorGroupHeader.tabsBackground": "#131510",
		"editorLineNumber.activeForeground": "#adadad",
		"tab.inactiveBackground": "#131510",
		"tab.lastPinnedBorder": "#51412c",
		"titleBar.activeBackground": "#423523",
		"statusBar.background": "#423523",
		"statusBar.debuggingBackground": "#423523",
		"statusBar.noFolderBackground": "#423523",
		"statusBarItem.remoteBackground": "#6e583b",
		"ports.iconRunningProcessForeground": "#369432",
		"activityBar.background": "#221a0f",
		"activityBar.foreground": "#d3af86",
		"sideBar.background": "#362712",
		"menu.background": "#362712",
		"menu.foreground": "#CCCCCC",
		"editor.lineHighlightBackground": "#5e452b",
		"editorCursor.foreground": "#d3af86",
		"editorWhitespace.foreground": "#a57a4c",
		"peekViewTitle.background": "#362712",
		"peekView.border": "#5e452b",
		"peekViewResult.background": "#362712",
		"peekViewEditor.background": "#221a14",
		"peekViewEditor.matchHighlightBackground": "#84613daa",
		"button.background": "#6e583b",
		"inputValidation.infoBorder": "#1b60a5",
		"inputValidation.infoBackground": "#2b2a42",
		"inputValidation.warningBackground": "#51412c",
		// "inputValidation.warningBorder": "#5B7E7A",
		"inputValidation.errorBackground": "#5f0d0d",
		"inputValidation.errorBorder": "#9d2f23",
		"badge.background": "#7f5d38",
		"progressBar.background": "#7f5d38"
	},
	"tokenColors": [
		{
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Text",
			"scope": "variable.parameter.function",
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Comments",
			"scope": [
				"comment",
				"punctuation.definition.comment"
			],
			"settings": {
				"foreground": "#a57a4c"
			}
		},
		{
			"name": "Punctuation",
			"scope": [
				"punctuation.definition.string",
				"punctuation.definition.variable",
				"punctuation.definition.string",
				"punctuation.definition.parameters",
				"punctuation.definition.string",
				"punctuation.definition.array"
			],
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Delimiters",
			"scope": "none",
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Operators",
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Keywords",
			"scope": [
				"keyword",
				"keyword.control",
				"keyword.operator.new.cpp",
				"keyword.operator.delete.cpp",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator"
			],
			"settings": {
				"foreground": "#98676a"
			}
		},
		{
			"name": "Variables",
			"scope": "variable",
			"settings": {
				"foreground": "#dc3958"
			}
		},
		{
			"name": "Functions",
			"scope": [
				"entity.name.function",
				"meta.require",
				"support.function.any-method"
			],
			"settings": {
				"foreground": "#8ab1b0"
			}
		},
		{
			"name": "Classes",
			"scope": [
				"support.class",
				"entity.name.class",
				"entity.name.type",
				"entity.name.namespace",
				"entity.name.scope-resolution"
			],
			"settings": {
				"foreground": "#f06431"
			}
		},
		{
			"name": "Methods",
			"scope": "keyword.other.special-method",
			"settings": {
				"foreground": "#8ab1b0"
			}
		},
		{
			"name": "Storage",
			"scope": "storage",
			"settings": {
				"foreground": "#98676a"
			}
		},
		{
			"name": "Support",
			"scope": "support.function",
			"settings": {
				"foreground": "#7e602c"
			}
		},
		{
			"name": "Strings, Inherited Class",
			"scope": [
				"string",
				"constant.other.symbol",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"foreground": "#889b4a"
			}
		},
		{
			"name": "Integers",
			"scope": "constant.numeric",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Floats",
			"scope": "none",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Boolean",
			"scope": "none",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Constants",
			"scope": "constant",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Tags",
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#dc3958"
			}
		},
		{
			"name": "Attributes",
			"scope": "entity.other.attribute-name",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Attribute IDs",
			"scope": [
				"entity.other.attribute-name.id",
				"punctuation.definition.entity"
			],
			"settings": {
				"foreground": "#8ab1b0"
			}
		},
		{
			"name": "Selector",
			"scope": "meta.selector",
			"settings": {
				"foreground": "#98676a"
			}
		},
		{
			"name": "Values",
			"scope": "none",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Headings",
			"scope": [
				"markup.heading",
				"markup.heading.setext",
				"punctuation.definition.heading",
				"entity.name.section"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#8ab1b0"
			}
		},
		{
			"name": "Units",
			"scope": "keyword.other.unit",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Bold",
			"scope": [
				"markup.bold",
				"punctuation.definition.bold"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#f06431"
			}
		},
		{
			"name": "Italic",
			"scope": [
				"markup.italic",
				"punctuation.definition.italic"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#98676a"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Code",
			"scope": "markup.inline.raw",
			"settings": {
				"foreground": "#889b4a"
			}
		},
		{
			"name": "Link Text",
			"scope": "string.other.link",
			"settings": {
				"foreground": "#dc3958"
			}
		},
		{
			"name": "Link Url",
			"scope": "meta.link",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Lists",
			"scope": "markup.list",
			"settings": {
				"foreground": "#dc3958"
			}
		},
		{
			"name": "Quotes",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#f79a32"
			}
		},
		{
			"name": "Separator",
			"scope": "meta.separator",
			"settings": {
				"foreground": "#d3af86"
			}
		},
		{
			"name": "Inserted",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#889b4a"
			}
		},
		{
			"name": "Deleted",
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#dc3958"
			}
		},
		{
			"name": "Changed",
			"scope": "markup.changed",
			"settings": {
				"foreground": "#98676a"
			}
		},
		{
			"name": "Colors",
			"scope": "constant.other.color",
			"settings": {
				"foreground": "#7e602c"
			}
		},
		{
			"name": "Regular Expressions",
			"scope": "string.regexp",
			"settings": {
				"foreground": "#7e602c"
			}
		},
		{
			"name": "Escape Characters",
			"scope": "constant.character.escape",
			"settings": {
				"foreground": "#7e602c"
			}
		},
		{
			"name": "Embedded",
			"scope": [
				"punctuation.section.embedded",
				"variable.interpolation"
			],
			"settings": {
				"foreground": "#088649"
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"foreground": "#dc3958"
			}
		}
	],
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai/.vscodeignore]---
Location: vscode-main/extensions/theme-monokai/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai/cgmanifest.json]---
Location: vscode-main/extensions/theme-monokai/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai/package.json]---
Location: vscode-main/extensions/theme-monokai/package.json

```json
{
  "name": "theme-monokai",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Monokai",
        "label": "%themeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/monokai-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai/package.nls.json]---
Location: vscode-main/extensions/theme-monokai/package.nls.json

```json
{
	"displayName": "Monokai Theme",
	"description": "Monokai theme for Visual Studio Code",
	"themeLabel": "Monokai"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai/themes/monokai-color-theme.json]---
Location: vscode-main/extensions/theme-monokai/themes/monokai-color-theme.json

```json
// This theme's colors are based on the original Monokai:
//   #1e1f1c (tab well, borders)
//   #272822 (editor background)
//   #414339 (selection)
//   #75715e (focus)
//   #f8f8f2 (editor foreground)
{
	"type": "dark",
	"colors": {
		"dropdown.background": "#414339",
		"list.activeSelectionBackground": "#75715E",
		"quickInputList.focusBackground": "#414339",
		"dropdown.listBackground": "#1e1f1c",
		"list.inactiveSelectionBackground": "#414339",
		"list.hoverBackground": "#3e3d32",
		"list.dropBackground": "#414339",
		"list.highlightForeground": "#f8f8f2",
		"button.background": "#75715E",
		"editor.background": "#272822",
		"editor.foreground": "#f8f8f2",
		"selection.background": "#878b9180",
		"editor.selectionHighlightBackground": "#575b6180",
		"editor.selectionBackground": "#878b9180",
		"minimap.selectionHighlight": "#878b9180",
		"editor.wordHighlightBackground": "#4a4a7680",
		"editor.wordHighlightStrongBackground": "#6a6a9680",
		"editor.lineHighlightBackground": "#3e3d32",
		"editorLineNumber.activeForeground": "#c2c2bf",
		"editorCursor.foreground": "#f8f8f0",
		"editorWhitespace.foreground": "#464741",
		"editorIndentGuide.background": "#464741",
		"editorIndentGuide.activeBackground": "#767771",
		"editorGroupHeader.tabsBackground": "#1e1f1c",
		"editorGroup.dropBackground": "#41433980",
		"tab.inactiveBackground": "#34352f",
		"tab.border": "#1e1f1c",
		"tab.inactiveForeground": "#ccccc7", // needs to be bright so it's readable when another editor group is focused
		"tab.lastPinnedBorder": "#414339",
		"widget.shadow": "#00000098",
		"progressBar.background": "#75715E",
		"badge.background": "#75715E",
		"badge.foreground": "#f8f8f2",
		"editorLineNumber.foreground": "#90908a",
		"panelTitle.activeForeground": "#f8f8f2",
		"panelTitle.activeBorder": "#75715E",
		"panelTitle.inactiveForeground": "#75715E",
		"panel.border": "#414339",
		"settings.focusedRowBackground": "#4143395A",
		"titleBar.activeBackground": "#1e1f1c",
		"statusBar.background": "#414339",
		"statusBar.noFolderBackground": "#414339",
		"statusBar.debuggingBackground": "#75715E",
		"statusBarItem.remoteBackground": "#AC6218",
		"ports.iconRunningProcessForeground": "#ccccc7",
		"activityBar.background": "#272822",
		"activityBar.foreground": "#f8f8f2",
		"sideBar.background": "#1e1f1c",
		"sideBarSectionHeader.background": "#272822",
		"menu.background": "#1e1f1c",
		"menu.foreground": "#cccccc",
		"pickerGroup.foreground": "#75715E",
		"input.background": "#414339",
		"inputOption.activeBorder": "#75715E",
		"focusBorder": "#99947c",
		"editorWidget.background": "#1e1f1c",
		"debugToolBar.background": "#1e1f1c",
		"diffEditor.insertedTextBackground": "#4b661680", // middle of #272822 and #a6e22e
		"diffEditor.removedTextBackground": "#90274A70", // middle of #272822 and #f92672
		"inputValidation.errorBackground": "#90274A", // middle of #272822 and #f92672
		"inputValidation.errorBorder": "#f92672",
		"inputValidation.warningBackground": "#848528", // middle of #272822 and #e2e22e
		"inputValidation.warningBorder": "#e2e22e",
		"inputValidation.infoBackground": "#546190", // middle of #272822 and #819aff
		"inputValidation.infoBorder": "#819aff",
		"editorHoverWidget.background": "#414339",
		"editorHoverWidget.border": "#75715E",
		"editorSuggestWidget.background": "#272822",
		"editorSuggestWidget.border": "#75715E",
		"editorGroup.border": "#34352f",
		"peekView.border": "#75715E",
		"peekViewEditor.background": "#272822",
		"peekViewResult.background": "#1e1f1c",
		"peekViewTitle.background": "#1e1f1c",
		"peekViewResult.selectionBackground": "#414339",
		"peekViewResult.matchHighlightBackground": "#75715E",
		"peekViewEditor.matchHighlightBackground": "#75715E",
		"terminal.ansiBlack": "#333333",
		"terminal.ansiRed": "#C4265E", // the bright color with ~75% transparent on the background
		"terminal.ansiGreen": "#86B42B",
		"terminal.ansiYellow": "#B3B42B",
		"terminal.ansiBlue": "#6A7EC8",
		"terminal.ansiMagenta": "#8C6BC8",
		"terminal.ansiCyan": "#56ADBC",
		"terminal.ansiWhite": "#e3e3dd",
		"terminal.ansiBrightBlack": "#666666",
		"terminal.ansiBrightRed": "#f92672",
		"terminal.ansiBrightGreen": "#A6E22E",
		"terminal.ansiBrightYellow": "#e2e22e", // hue shifted #A6E22E
		"terminal.ansiBrightBlue": "#819aff", // hue shifted #AE81FF
		"terminal.ansiBrightMagenta": "#AE81FF",
		"terminal.ansiBrightCyan": "#66D9EF",
		"terminal.ansiBrightWhite": "#f8f8f2"
	},
	"tokenColors": [
		{
			"settings": {
				"foreground": "#F8F8F2"
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#F8F8F2"
			}
		},
		{
			"name": "Comment",
			"scope": "comment",
			"settings": {
				"foreground": "#88846f"
			}
		},
		{
			"name": "String",
			"scope": "string",
			"settings": {
				"foreground": "#E6DB74"
			}
		},
		{
			"name": "Template Definition",
			"scope": [
				"punctuation.definition.template-expression",
				"punctuation.section.embedded"
			],
			"settings": {
				"foreground": "#F92672"
			}
		},
		{
			"name": "Reset JavaScript string interpolation expression",
			"scope": [
				"meta.template.expression"
			],
			"settings": {
				"foreground": "#F8F8F2"
			}
		},
		{
			"name": "Number",
			"scope": "constant.numeric",
			"settings": {
				"foreground": "#AE81FF"
			}
		},
		{
			"name": "Built-in constant",
			"scope": "constant.language",
			"settings": {
				"foreground": "#AE81FF"
			}
		},
		{
			"name": "User-defined constant",
			"scope": "constant.character, constant.other",
			"settings": {
				"foreground": "#AE81FF"
			}
		},
		{
			"name": "Variable",
			"scope": "variable",
			"settings": {
				"fontStyle": "",
				"foreground": "#F8F8F2"
			}
		},
		{
			"name": "Keyword",
			"scope": "keyword",
			"settings": {
				"foreground": "#F92672"
			}
		},
		{
			"name": "Storage",
			"scope": "storage",
			"settings": {
				"fontStyle": "",
				"foreground": "#F92672"
			}
		},
		{
			"name": "Storage type",
			"scope": "storage.type",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#66D9EF"
			}
		},
		{
			"name": "Class name",
			"scope": "entity.name.type, entity.name.class, entity.name.namespace, entity.name.scope-resolution",
			"settings": {
				"fontStyle": "underline",
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "Inherited class",
			"scope": [
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"fontStyle": "italic underline",
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "Function name",
			"scope": "entity.name.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "Function argument",
			"scope": "variable.parameter",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#FD971F"
			}
		},
		{
			"name": "Tag name",
			"scope": "entity.name.tag",
			"settings": {
				"fontStyle": "",
				"foreground": "#F92672"
			}
		},
		{
			"name": "Tag attribute",
			"scope": "entity.other.attribute-name",
			"settings": {
				"fontStyle": "",
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "Library function",
			"scope": "support.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#66D9EF"
			}
		},
		{
			"name": "Library constant",
			"scope": "support.constant",
			"settings": {
				"fontStyle": "",
				"foreground": "#66D9EF"
			}
		},
		{
			"name": "Library class/type",
			"scope": "support.type, support.class",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#66D9EF"
			}
		},
		{
			"name": "Library variable",
			"scope": "support.other.variable",
			"settings": {
				"fontStyle": ""
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"fontStyle": "",
				"foreground": "#F44747"
			}
		},
		{
			"name": "Invalid deprecated",
			"scope": "invalid.deprecated",
			"settings": {
				"foreground": "#F44747"
			}
		},
		{
			"name": "JSON String",
			"scope": "meta.structure.dictionary.json string.quoted.double.json",
			"settings": {
				"foreground": "#CFCFC2"
			}
		},
		{
			"name": "diff.header",
			"scope": "meta.diff, meta.diff.header",
			"settings": {
				"foreground": "#75715E"
			}
		},
		{
			"name": "diff.deleted",
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#F92672"
			}
		},
		{
			"name": "diff.inserted",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "diff.changed",
			"scope": "markup.changed",
			"settings": {
				"foreground": "#E6DB74"
			}
		},
		{
			"scope": "constant.numeric.line-number.find-in-files - match",
			"settings": {
				"foreground": "#AE81FFA0"
			}
		},
		{
			"scope": "entity.name.filename.find-in-files",
			"settings": {
				"foreground": "#E6DB74"
			}
		},
		{
			"name": "Markup Quote",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#F92672"
			}
		},
		{
			"name": "Markup Lists",
			"scope": "markup.list",
			"settings": {
				"foreground": "#E6DB74"
			}
		},
		{
			"name": "Markup Styling",
			"scope": "markup.bold, markup.italic",
			"settings": {
				"foreground": "#66D9EF"
			}
		},
		{
			"name": "Markup Inline",
			"scope": "markup.inline.raw",
			"settings": {
				"fontStyle": "",
				"foreground": "#FD971F"
			}
		},
		{
			"name": "Markup Headings",
			"scope": "markup.heading",
			"settings": {
				"foreground": "#A6E22E"
			}
		},
		{
			"name": "Markup Setext Header",
			"scope": "markup.heading.setext",
			"settings": {
				"foreground": "#A6E22E",
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markup Headings",
			"scope": "markup.heading.markdown",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markdown Quote",
			"scope": "markup.quote.markdown",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#75715E"
			}
		},
		{
			"name": "Markdown Bold",
			"scope": "markup.bold.markdown",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markdown Link Title/Description",
			"scope": "string.other.link.title.markdown,string.other.link.description.markdown",
			"settings": {
				"foreground": "#AE81FF"
			}
		},
		{
			"name": "Markdown Underline Link/Image",
			"scope": "markup.underline.link.markdown,markup.underline.link.image.markdown",
			"settings": {
				"foreground": "#E6DB74"
			}
		},
		{
			"name": "Markdown Emphasis",
			"scope": "markup.italic.markdown",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Markdown Punctuation Definition Link",
			"scope": "markup.list.unnumbered.markdown, markup.list.numbered.markdown",
			"settings": {
				"foreground": "#f8f8f2"
			}
		},
		{
			"name": "Markdown List Punctuation",
			"scope": [
				"punctuation.definition.list.begin.markdown"
			],
			"settings": {
				"foreground": "#A6E22E"
			}
		},
		{
			"scope": "token.info-token",
			"settings": {
				"foreground": "#6796e6"
			}
		},
		{
			"scope": "token.warn-token",
			"settings": {
				"foreground": "#cd9731"
			}
		},
		{
			"scope": "token.error-token",
			"settings": {
				"foreground": "#f44747"
			}
		},
		{
			"scope": "token.debug-token",
			"settings": {
				"foreground": "#b267e6"
			}
		},
		{
			"name": "this.self",
			"scope": "variable.language",
			"settings": {
				"foreground": "#FD971F"
			}
		}
	],
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai-dimmed/.vscodeignore]---
Location: vscode-main/extensions/theme-monokai-dimmed/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai-dimmed/cgmanifest.json]---
Location: vscode-main/extensions/theme-monokai-dimmed/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai-dimmed/package.json]---
Location: vscode-main/extensions/theme-monokai-dimmed/package.json

```json
{
  "name": "theme-monokai-dimmed",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Monokai Dimmed",
        "label": "%themeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/dimmed-monokai-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai-dimmed/package.nls.json]---
Location: vscode-main/extensions/theme-monokai-dimmed/package.nls.json

```json
{
	"displayName": "Monokai Dimmed Theme",
	"description": "Monokai dimmed theme for Visual Studio Code",
	"themeLabel": "Monokai Dimmed"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-monokai-dimmed/themes/dimmed-monokai-color-theme.json]---
Location: vscode-main/extensions/theme-monokai-dimmed/themes/dimmed-monokai-color-theme.json

```json
{
	"type": "dark",
	"colors": {
		"dropdown.background": "#525252",
		"list.activeSelectionBackground": "#707070",
		"quickInputList.focusBackground": "#707070",
		"list.inactiveSelectionBackground": "#4e4e4e",
		"list.hoverBackground": "#444444",
		"list.highlightForeground": "#e58520",
		"button.background": "#565656",
		"editor.background": "#1e1e1e",
		"editor.foreground": "#c5c8c6",
		"editor.selectionBackground": "#676b7180",
		"minimap.selectionHighlight": "#676b7180",
		"editor.selectionHighlightBackground": "#575b6180",
		"editor.lineHighlightBackground": "#303030",
		"editorLineNumber.activeForeground": "#949494",
		"editor.wordHighlightBackground": "#4747a180",
		"editor.wordHighlightStrongBackground": "#6767ce80",
		"editorCursor.foreground": "#c07020",
		"editorWhitespace.foreground": "#505037",
		"editorIndentGuide.background1": "#505037",
		"editorIndentGuide.activeBackground1": "#707057",
		"editorGroupHeader.tabsBackground": "#282828",
		"tab.inactiveBackground": "#404040",
		"tab.border": "#303030",
		"tab.inactiveForeground": "#d8d8d8",
		"tab.lastPinnedBorder": "#505050",
		"peekView.border": "#3655b5",
		"panelTitle.activeForeground": "#ffffff",
		"statusBar.background": "#505050",
		"statusBar.debuggingBackground": "#505050",
		"statusBar.noFolderBackground": "#505050",
		"titleBar.activeBackground": "#505050",
		"statusBarItem.remoteBackground": "#3655b5",
		"ports.iconRunningProcessForeground": "#CCCCCC",
		"activityBar.background": "#353535",
		"activityBar.foreground": "#ffffff",
		"activityBarBadge.background": "#3655b5",
		"sideBar.background": "#272727",
		"sideBarSectionHeader.background": "#505050",
		"menu.background": "#272727",
		"menu.foreground": "#CCCCCC",
		"pickerGroup.foreground": "#b0b0b0",
		"inputOption.activeBorder": "#3655b5",
		"focusBorder": "#3655b5",
		"terminal.ansiBlack": "#1e1e1e",
		"terminal.ansiRed": "#C4265E", // the bright color with ~75% transparent on the background
		"terminal.ansiGreen": "#86B42B",
		"terminal.ansiYellow": "#B3B42B",
		"terminal.ansiBlue": "#6A7EC8",
		"terminal.ansiMagenta": "#8C6BC8",
		"terminal.ansiCyan": "#56ADBC",
		"terminal.ansiWhite": "#e3e3dd",
		"terminal.ansiBrightBlack": "#666666",
		"terminal.ansiBrightRed": "#f92672",
		"terminal.ansiBrightGreen": "#A6E22E",
		"terminal.ansiBrightYellow": "#e2e22e", // hue shifted #A6E22E
		"terminal.ansiBrightBlue": "#819aff", // hue shifted #AE81FF
		"terminal.ansiBrightMagenta": "#AE81FF",
		"terminal.ansiBrightCyan": "#66D9EF",
		"terminal.ansiBrightWhite": "#f8f8f2",
		"terminal.inactiveSelectionBackground": "#676b7140"
	},
	"tokenColors": [
		{
			"settings": {
				"foreground": "#C5C8C6"
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#C5C8C6"
			}
		},
		{
			"name": "Comment",
			"scope": "comment",
			"settings": {
				"fontStyle": "",
				"foreground": "#9A9B99"
			}
		},
		{
			"name": "String",
			"scope": "string",
			"settings": {
				"fontStyle": "",
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "String Embedded Source",
			"scope": "string source",
			"settings": {
				"fontStyle": "",
				"foreground": "#D08442"
			}
		},
		{
			"name": "Number",
			"scope": "constant.numeric",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Built-in constant",
			"scope": "constant.language",
			"settings": {
				"fontStyle": "",
				"foreground": "#408080"
			}
		},
		{
			"name": "User-defined constant",
			"scope": "constant.character, constant.other",
			"settings": {
				"fontStyle": "",
				"foreground": "#8080FF",
			}
		},
		{
			"name": "Support",
			"scope": "support",
			"settings": {
				"fontStyle": "",
				"foreground": "#C7444A"
			}
		},
		{
			"name": "Storage",
			"scope": "storage",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Class name",
			"scope": "entity.name.class, entity.name.type, entity.name.namespace, entity.name.scope-resolution",
			"settings": {
				"fontStyle": "",
				"foreground": "#9B0000",
			}
		},
		{
			"name": "Inherited class",
			"scope": [
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#C7444A"
			}
		},
		{
			"name": "Function name",
			"scope": "entity.name.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#CE6700"
			}
		},
		{
			"name": "Function argument",
			"scope": "variable.parameter",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Library function",
			"scope": "support.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Keyword",
			"scope": "keyword",
			"settings": {
				"fontStyle": "",
				"foreground": "#676867"
			}
		},
		{
			"name": "Class Variable",
			"scope": "variable.other, variable.js, punctuation.separator.variable",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"fontStyle": "",
				"foreground": "#FF0B00"
			}
		},
		{
			"name": "Normal Variable",
			"scope": "variable.other.php, variable.other.normal",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Function Object",
			"scope": "meta.function-call.object",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Function Call Variable",
			"scope": "variable.other.property",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Keyword Control / Special",
			"scope": [
				"keyword.control",
				"keyword.operator.new.cpp",
				"keyword.operator.delete.cpp",
				"keyword.other.using",
				"keyword.other.directive.using",
				"keyword.other.operator"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Tag",
			"scope": "meta.tag",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "Tag Name",
			"scope": "entity.name.tag",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Doctype",
			"scope": "meta.doctype, meta.tag.sgml-declaration.doctype, meta.tag.sgml.doctype",
			"settings": {
				"fontStyle": "",
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "Tag Inline Source",
			"scope": "meta.tag.inline source, text.html.php.source",
			"settings": {
				"fontStyle": "",
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "Tag Other",
			"scope": "meta.tag.other, entity.name.tag.style, entity.name.tag.script, meta.tag.block.script, source.js.embedded punctuation.definition.tag.html, source.css.embedded punctuation.definition.tag.html",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Tag Attribute",
			"scope": "entity.other.attribute-name, meta.tag punctuation.definition.string",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "Tag Value",
			"scope": "meta.tag string -source -punctuation, text source text meta.tag string -punctuation",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Meta Brace",
			"scope": "punctuation.section.embedded -(source string source punctuation.section.embedded), meta.brace.erb.html",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "HTML ID",
			"scope": "meta.toc-list.id",
			"settings": {
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "HTML String",
			"scope": "string.quoted.double.html, punctuation.definition.string.begin.html, punctuation.definition.string.end.html, punctuation.definition.string.end.html source, string.quoted.double.html source",
			"settings": {
				"fontStyle": "",
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "HTML Tags",
			"scope": "punctuation.definition.tag.html, punctuation.definition.tag.begin, punctuation.definition.tag.end",
			"settings": {
				"fontStyle": "",
				"foreground": "#6089B4"
			}
		},
		{
			"name": "CSS ID",
			"scope": "meta.selector entity.other.attribute-name.id",
			"settings": {
				"fontStyle": "",
				"foreground": "#9872A2"
			}
		},
		{
			"name": "CSS Property Name",
			"scope": "source.css support.type.property-name",
			"settings": {
				"fontStyle": "",
				"foreground": "#676867"
			}
		},
		{
			"name": "CSS Property Value",
			"scope": "meta.property-group support.constant.property-value, meta.property-value support.constant.property-value",
			"settings": {
				"fontStyle": "",
				"foreground": "#C7444A"
			}
		},
		{
			"name": "JavaScript Variable",
			"scope": "variable.language.js",
			"settings": {
				"foreground": "#CC555A"
			}
		},
		{
			"name": "Template Definition",
			"scope": [
				"punctuation.definition.template-expression",
				"punctuation.section.embedded.coffee"
			],
			"settings": {
				"foreground": "#D08442"
			}
		},
		{
			"name": "Reset JavaScript string interpolation expression",
			"scope": [
				"meta.template.expression"
			],
			"settings": {
				"foreground": "#C5C8C6"
			}
		},
		{
			"name": "PHP Function Call",
			"scope": "meta.function-call.object.php",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "PHP Single Quote HMTL Fix",
			"scope": "punctuation.definition.string.end.php, punctuation.definition.string.begin.php",
			"settings": {
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "PHP Parenthesis HMTL Fix",
			"scope": "source.php.embedded.line.html",
			"settings": {
				"foreground": "#676867"
			}
		},
		{
			"name": "PHP Punctuation Embedded",
			"scope": "punctuation.section.embedded.begin.php, punctuation.section.embedded.end.php",
			"settings": {
				"fontStyle": "",
				"foreground": "#D08442"
			}
		},
		{
			"name": "Ruby Symbol",
			"scope": "constant.other.symbol.ruby",
			"settings": {
				"fontStyle": "",
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "Ruby Variable",
			"scope": "variable.language.ruby",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "Ruby Special Method",
			"scope": "keyword.other.special-method.ruby",
			"settings": {
				"fontStyle": "",
				"foreground": "#D9B700"
			}
		},
		{
			"name": "Ruby Embedded Source",
			"scope": [
				"punctuation.section.embedded.begin.ruby",
				"punctuation.section.embedded.end.ruby"
			],
			"settings": {
				"foreground": "#D08442"
			}
		},
		{
			"name": "SQL",
			"scope": "keyword.other.DML.sql",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "diff: header",
			"scope": "meta.diff, meta.diff.header",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#E0EDDD"
			}
		},
		{
			"name": "diff: deleted",
			"scope": "markup.deleted",
			"settings": {
				"fontStyle": "",
				"foreground": "#dc322f"
			}
		},
		{
			"name": "diff: changed",
			"scope": "markup.changed",
			"settings": {
				"fontStyle": "",
				"foreground": "#cb4b16"
			}
		},
		{
			"name": "diff: inserted",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#219186"
			}
		},
		{
			"name": "Markup Quote",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#9872A2"
			}
		},
		{
			"name": "Markup Lists",
			"scope": "markup.list",
			"settings": {
				"foreground": "#9AA83A"
			}
		},
		{
			"name": "Markup Styling",
			"scope": "markup.bold, markup.italic",
			"settings": {
				"foreground": "#6089B4"
			}
		},
		{
			"name": "Markup Inline",
			"scope": "markup.inline.raw",
			"settings": {
				"fontStyle": "",
				"foreground": "#FF0080"
			}
		},
		{
			"name": "Markup Headings",
			"scope": "markup.heading",
			"settings": {
				"foreground": "#D0B344"
			}
		},
		{
			"name": "Markup Setext Header",
			"scope": "markup.heading.setext",
			"settings": {
				"fontStyle": "",
				"foreground": "#D0B344"
			}
		},
		{
			"name": "Markdown Headings",
			"scope": "markup.heading.markdown",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markdown Quote",
			"scope": "markup.quote.markdown",
			"settings": {
				"fontStyle": "italic",
				"foreground": ""
			}
		},
		{
			"name": "Markdown Bold",
			"scope": "markup.bold.markdown",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markdown Link Title/Description",
			"scope": "string.other.link.title.markdown,string.other.link.description.markdown",
			"settings": {
				"foreground": "#AE81FF"
			}
		},
		{
			"name": "Markdown Underline Link/Image",
			"scope": "markup.underline.link.markdown,markup.underline.link.image.markdown",
			"settings": {
				"foreground": ""
			}
		},
		{
			"name": "Markdown Emphasis",
			"scope": "markup.italic.markdown",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Markdown Punctuation Definition Link",
			"scope": "markup.list.unnumbered.markdown, markup.list.numbered.markdown",
			"settings": {
				"foreground": ""
			}
		},
		{
			"name": "Markdown List Punctuation",
			"scope": [
				"punctuation.definition.list.begin.markdown"
			],
			"settings": {
				"foreground": ""
			}
		},
		{
			"scope": "token.info-token",
			"settings": {
				"foreground": "#6796e6"
			}
		},
		{
			"scope": "token.warn-token",
			"settings": {
				"foreground": "#cd9731"
			}
		},
		{
			"scope": "token.error-token",
			"settings": {
				"foreground": "#f44747"
			}
		},
		{
			"scope": "token.debug-token",
			"settings": {
				"foreground": "#b267e6"
			}
		},
		{
			"name": "this.self",
			"scope": "variable.language",
			"settings": {
				"foreground": "#c7444a"
			}
		}
	],
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-quietlight/.vscodeignore]---
Location: vscode-main/extensions/theme-quietlight/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-quietlight/cgmanifest.json]---
Location: vscode-main/extensions/theme-quietlight/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-quietlight/package.json]---
Location: vscode-main/extensions/theme-quietlight/package.json

```json
{
  "name": "theme-quietlight",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Quiet Light",
        "label": "%themeLabel%",
        "uiTheme": "vs",
        "path": "./themes/quietlight-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-quietlight/package.nls.json]---
Location: vscode-main/extensions/theme-quietlight/package.nls.json

```json
{
	"displayName": "Quiet Light Theme",
	"description": "Quiet light theme for Visual Studio Code",
	"themeLabel": "Quiet Light"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-quietlight/themes/quietlight-color-theme.json]---
Location: vscode-main/extensions/theme-quietlight/themes/quietlight-color-theme.json

```json
{
	"name": "Quiet Light",
	"tokenColors": [
		{
			"settings": {
				"foreground": "#333333"
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#333333"
			}
		},
		{
			"name": "Comments",
			"scope": [
				"comment",
				"punctuation.definition.comment"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#AAAAAA"
			}
		},
		{
			"name": "Comments: Preprocessor",
			"scope": "comment.block.preprocessor",
			"settings": {
				"fontStyle": "",
				"foreground": "#AAAAAA"
			}
		},
		{
			"name": "Comments: Documentation",
			"scope": [
				"comment.documentation",
				"comment.block.documentation",
				"comment.block.documentation punctuation.definition.comment "
			],
			"settings": {
				"foreground": "#448C27"
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"foreground": "#cd3131"
			}
		},
		{
			"name": "Invalid - Illegal",
			"scope": "invalid.illegal",
			"settings": {
				"foreground": "#660000"
			}
		},
		{
			"name": "Operators",
			"scope": "keyword.operator",
			"settings": {
				"foreground": "#777777"
			}
		},
		{
			"name": "Keywords",
			"scope": [
				"keyword",
				"storage"
			],
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "Types",
			"scope": [
				"storage.type",
				"support.type"
			],
			"settings": {
				"foreground": "#7A3E9D"
			}
		},
		{
			"name": "Language Constants",
			"scope": [
				"constant.language",
				"support.constant",
				"variable.language"
			],
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "Variables",
			"scope": [
				"variable",
				"support.variable"
			],
			"settings": {
				"foreground": "#7A3E9D"
			}
		},
		{
			"name": "Functions",
			"scope": [
				"entity.name.function",
				"support.function"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#AA3731"
			}
		},
		{
			"name": "Classes",
			"scope": [
				"entity.name.type",
				"entity.name.namespace",
				"entity.name.scope-resolution",
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby",
				"support.class"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#7A3E9D"
			}
		},
		{
			"name": "Exceptions",
			"scope": "entity.name.exception",
			"settings": {
				"foreground": "#660000"
			}
		},
		{
			"name": "Sections",
			"scope": "entity.name.section",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Numbers, Characters",
			"scope": [
				"constant.numeric",
				"constant.character",
				"constant"
			],
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "Strings",
			"scope": "string",
			"settings": {
				"foreground": "#448C27"
			}
		},
		{
			"name": "Strings: Escape Sequences",
			"scope": "constant.character.escape",
			"settings": {
				"foreground": "#777777"
			}
		},
		{
			"name": "Strings: Regular Expressions",
			"scope": "string.regexp",
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "Strings: Symbols",
			"scope": "constant.other.symbol",
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "Punctuation",
			"scope": "punctuation",
			"settings": {
				"foreground": "#777777"
			}
		},
		{
			"name": "HTML: Doctype Declaration",
			"scope": [
				"meta.tag.sgml.doctype",
				"meta.tag.sgml.doctype string",
				"meta.tag.sgml.doctype entity.name.tag",
				"meta.tag.sgml punctuation.definition.tag.html"
			],
			"settings": {
				"foreground": "#AAAAAA"
			}
		},
		{
			"name": "HTML: Tags",
			"scope": [
				"meta.tag",
				"punctuation.definition.tag.html",
				"punctuation.definition.tag.begin.html",
				"punctuation.definition.tag.end.html"
			],
			"settings": {
				"foreground": "#91B3E0"
			}
		},
		{
			"name": "HTML: Tag Names",
			"scope": "entity.name.tag",
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "HTML: Attribute Names",
			"scope": [
				"meta.tag entity.other.attribute-name",
				"entity.other.attribute-name.html"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#8190A0"
			}
		},
		{
			"name": "HTML: Entities",
			"scope": [
				"constant.character.entity",
				"punctuation.definition.entity"
			],
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "CSS: Selectors",
			"scope": [
				"meta.selector",
				"meta.selector entity",
				"meta.selector entity punctuation",
				"entity.name.tag.css",
				"entity.name.tag.less"
			],
			"settings": {
				"foreground": "#7A3E9D"
			}
		},
		{
			"name": "CSS: Property Names",
			"scope": [
				"meta.property-name",
				"support.type.property-name"
			],
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "CSS: Property Values",
			"scope": [
				"meta.property-value",
				"meta.property-value constant.other",
				"support.constant.property-value"
			],
			"settings": {
				"foreground": "#448C27"
			}
		},
		{
			"name": "CSS: Important Keyword",
			"scope": "keyword.other.important",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markup: Changed",
			"scope": "markup.changed",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"name": "Markup: Deletion",
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"name": "Markup: Emphasis",
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Markup: Error",
			"scope": "markup.error",
			"settings": {
				"foreground": "#660000"
			}
		},
		{
			"name": "Markup: Insertion",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"name": "Markup: Link",
			"scope": "meta.link",
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "Markup: Output",
			"scope": [
				"markup.output",
				"markup.raw"
			],
			"settings": {
				"foreground": "#777777"
			}
		},
		{
			"name": "Markup: Prompt",
			"scope": "markup.prompt",
			"settings": {
				"foreground": "#777777"
			}
		},
		{
			"name": "Markup: Heading",
			"scope": "markup.heading",
			"settings": {
				"foreground": "#AA3731"
			}
		},
		{
			"name": "Markup: Strong",
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markup: Traceback",
			"scope": "markup.traceback",
			"settings": {
				"foreground": "#660000"
			}
		},
		{
			"name": "Markup: Underline",
			"scope": "markup.underline",
			"settings": {
				"fontStyle": "underline"
			}
		},
		{
			"name": "Markup Quote",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#7A3E9D"
			}
		},
		{
			"name": "Markup Lists",
			"scope": "markup.list",
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "Markup Styling",
			"scope": [
				"markup.bold",
				"markup.italic"
			],
			"settings": {
				"foreground": "#448C27"
			}
		},
		{
			"name": "Markup Inline",
			"scope": "markup.inline.raw",
			"settings": {
				"fontStyle": "",
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "Extra: Diff Range",
			"scope": [
				"meta.diff.range",
				"meta.diff.index",
				"meta.separator"
			],
			"settings": {
				"foreground": "#434343"
			}
		},
		{
			"name": "Extra: Diff From",
			"scope": ["meta.diff.header.from-file", "punctuation.definition.from-file.diff"],
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "Extra: Diff To",
			"scope": ["meta.diff.header.to-file", "punctuation.definition.to-file.diff"],
			"settings": {
				"foreground": "#4B69C6"
			}
		},
		{
			"name": "diff: deleted",
			"scope": "markup.deleted.diff",
			"settings": {
				"foreground": "#C73D20"
			}
		},
		{
			"name": "diff: changed",
			"scope": "markup.changed.diff",
			"settings": {
				"foreground": "#9C5D27"
			}
		},
		{
			"name": "diff: inserted",
			"scope": "markup.inserted.diff",
			"settings": {
				"foreground": "#448C27"
			}
		},
		{
			"name": "JSX: Tags",
			"scope": [
				"punctuation.definition.tag.js",
				"punctuation.definition.tag.begin.js",
				"punctuation.definition.tag.end.js"
			],
			"settings": {
			  "foreground": "#91B3E0"
			}
      	},
      	{
			"name": "JSX: InnerText",
			"scope": "meta.jsx.children.js",
			"settings": {
			  "foreground": "#333333ff"
			}
      	}
	],
	"colors": {
		"focusBorder": "#9769dc",
		"pickerGroup.foreground": "#A6B39B",
		"pickerGroup.border": "#749351",
		"list.activeSelectionForeground": "#6c6c6c",
		"quickInputList.focusBackground": "#CADEB9",
		"list.hoverBackground": "#e0e0e0",
		"list.activeSelectionBackground": "#c4d9b1",
		"list.inactiveSelectionBackground": "#d3dbcd",
		"list.highlightForeground": "#9769dc",
		"selection.background": "#C9D0D9",
		"editor.background": "#F5F5F5",
		"editorWhitespace.foreground": "#AAAAAA",
		"editor.lineHighlightBackground": "#E4F6D4",
		"editorLineNumber.activeForeground": "#9769dc",
		"editor.selectionBackground": "#C9D0D9",
		"minimap.selectionHighlight": "#C9D0D9",
		"panel.background": "#F5F5F5",
		"sideBar.background": "#F2F2F2",
		"sideBarSectionHeader.background": "#ede8ef",
		"editorLineNumber.foreground": "#6D705B",
		"editorCursor.foreground": "#54494B",
		"inputOption.activeBorder": "#adafb7",
		"dropdown.background": "#F5F5F5",
		"editor.findMatchBackground": "#BF9CAC",
		"editor.findMatchHighlightBackground": "#edc9d899",
		"peekViewEditor.matchHighlightBackground": "#C2DFE3",
		"peekViewTitle.background": "#F2F8FC",
		"peekViewEditor.background": "#F2F8FC",
		"peekViewResult.background": "#F2F8FC",
		"peekView.border": "#705697",
		"peekViewResult.matchHighlightBackground": "#93C6D6",
		"tab.lastPinnedBorder": "#c9d0d9",
		"statusBar.background": "#705697",
		"welcomePage.tileBackground": "#f0f0f7",
		"statusBar.noFolderBackground": "#705697",
		"statusBar.debuggingBackground": "#705697",
		"statusBarItem.remoteBackground": "#4e3c69",
		"ports.iconRunningProcessForeground": "#749351",
		"activityBar.background": "#EDEDF5",
		"activityBar.foreground": "#705697",
		"activityBarBadge.background": "#705697",
		"titleBar.activeBackground": "#c4b7d7",
		"button.background": "#705697",
		"editorGroup.dropBackground": "#C9D0D988",
		"inputValidation.infoBorder": "#4ec1e5",
		"inputValidation.infoBackground": "#f2fcff",
		"inputValidation.warningBackground": "#fffee2",
		"inputValidation.warningBorder": "#ffe055",
		"inputValidation.errorBackground": "#ffeaea",
		"inputValidation.errorBorder": "#f1897f",
		"errorForeground": "#f1897f",
		"badge.background": "#705697AA",
		"progressBar.background": "#705697",
		"walkThrough.embeddedEditorBackground": "#00000014",
		"editorIndentGuide.background": "#aaaaaa60",
		"editorIndentGuide.activeBackground": "#777777b0"
	},
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-red/.vscodeignore]---
Location: vscode-main/extensions/theme-red/.vscodeignore

```text
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-red/cgmanifest.json]---
Location: vscode-main/extensions/theme-red/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "Colorsublime-Themes",
					"repositoryUrl": "https://github.com/Colorsublime/Colorsublime-Themes",
					"commitHash": "c10fdd8b144486b7a4f3cb4e2251c66df222a825"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-red/package.json]---
Location: vscode-main/extensions/theme-red/package.json

```json
{
  "name": "theme-red",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "themes": [
      {
        "id": "Red",
        "label": "%themeLabel%",
        "uiTheme": "vs-dark",
        "path": "./themes/Red-color-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-red/package.nls.json]---
Location: vscode-main/extensions/theme-red/package.nls.json

```json
{
	"displayName": "Red Theme",
	"description": "Red theme for Visual Studio Code",
	"themeLabel": "Red"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-red/themes/Red-color-theme.json]---
Location: vscode-main/extensions/theme-red/themes/Red-color-theme.json

```json
{
	"name": "Red",
	"colors": {
		// window
		"activityBar.background": "#580000",
		"tab.inactiveBackground": "#300a0a",
		"tab.activeBackground": "#490000",
		"tab.lastPinnedBorder": "#ff000044",
		"sideBar.background": "#330000",
		"statusBar.background": "#700000",
		"statusBar.noFolderBackground": "#700000",
		"statusBarItem.remoteBackground": "#c33",
		"ports.iconRunningProcessForeground": "#DB7E58",
		"editorGroupHeader.tabsBackground": "#330000",
		"titleBar.activeBackground": "#770000",
		"titleBar.inactiveBackground": "#772222",
		"selection.background": "#ff777788",
		// editor
		"editor.background": "#390000",
		"editorGroup.border": "#ff666633",
		"editorCursor.foreground": "#970000",
		"editor.foreground": "#F8F8F8",
		"editorWhitespace.foreground": "#c10000",
		"editor.selectionBackground": "#750000",
		"minimap.selectionHighlight": "#750000",
		"editorLineNumber.foreground": "#ff777788",
		"editorLineNumber.activeForeground": "#ffbbbb88",
		"editorWidget.background": "#300000",
		"editorHoverWidget.background": "#300000",
		"editorSuggestWidget.background": "#300000",
		"editorSuggestWidget.border": "#220000",
		"editor.lineHighlightBackground": "#ff000033",
		"editor.hoverHighlightBackground": "#ff000044",
		"editor.selectionHighlightBackground": "#f5500039",
		"editorLink.activeForeground": "#FFD0AA",
		"peekViewTitle.background": "#550000",
		"peekView.border": "#ff000044",
		"peekViewResult.background": "#400000",
		"peekViewEditor.background": "#300000",
		// UI
		"debugToolBar.background": "#660000",
		"focusBorder": "#ff6666aa",
		"button.background": "#833",
		"dropdown.background": "#580000",
		"input.background": "#580000",
		"inputOption.activeBorder": "#cc0000",
		"inputValidation.infoBackground": "#550000",
		"inputValidation.infoBorder": "#DB7E58",
		"list.hoverBackground": "#800000",
		"list.activeSelectionBackground": "#880000",
		"list.inactiveSelectionBackground": "#770000",
		"list.dropBackground": "#662222",
		"quickInputList.focusBackground": "#660000",
		"list.highlightForeground": "#ff4444",
		"pickerGroup.foreground": "#cc9999",
		"pickerGroup.border": "#ff000033",
		"badge.background": "#cc3333",
		"progressBar.background": "#cc3333",
		"errorForeground": "#ffeaea",
		"extensionButton.prominentBackground": "#cc3333",
		"extensionButton.prominentHoverBackground": "#cc333388"
	},
	"tokenColors": [
		{
			"settings": {
				"foreground": "#F8F8F8",
			}
		},
		{
			"scope": [
				"meta.embedded",
				"source.groovy.embedded",
				"string meta.image.inline.markdown",
				"variable.legacy.builtin.python"
			],
			"settings": {
				"foreground": "#F8F8F8"
			}
		},
		{
			"name": "Comment",
			"scope": "comment",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#e7c0c0ff"
			}
		},
		{
			"name": "Constant",
			"scope": "constant",
			"settings": {
				"fontStyle": "",
				"foreground": "#994646ff"
			}
		},
		{
			"name": "Keyword",
			"scope": "keyword",
			"settings": {
				"fontStyle": "",
				"foreground": "#f12727ff"
			}
		},
		{
			"name": "Entity",
			"scope": "entity",
			"settings": {
				"fontStyle": "",
				"foreground": "#fec758ff"
			}
		},
		{
			"name": "Storage",
			"scope": "storage",
			"settings": {
				"fontStyle": "bold",
				"foreground": "#ff6262ff"
			}
		},
		{
			"name": "String",
			"scope": "string",
			"settings": {
				"fontStyle": "",
				"foreground": "#cd8d8dff"
			}
		},
		{
			"name": "Support",
			"scope": "support",
			"settings": {
				"fontStyle": "",
				"foreground": "#9df39fff"
			}
		},
		{
			"name": "Variable",
			"scope": "variable",
			"settings": {
				"fontStyle": "italic",
				"foreground": "#fb9a4bff"
			}
		},
		{
			"name": "Invalid",
			"scope": "invalid",
			"settings": {
				"foreground": "#ffffffff"
			}
		},
		{
			"name": "Entity inherited-class",
			"scope": [
				"entity.other.inherited-class",
				"punctuation.separator.namespace.ruby"
			],
		"settings": {
				"fontStyle": "underline",
				"foreground": "#aa5507ff"
			}
		},
		{
			"scope": "constant.character",
			"settings": {
				"foreground": "#ec0d1e"
			}
		},
		{
			"scope": [
				"string constant",
				"constant.character.escape"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#ffe862ff"
			}
		},
		{
			"name": "String.regexp",
			"scope": "string.regexp",
			"settings": {
				"foreground": "#ffb454ff"
			}
		},
		{
			"name": "String variable",
			"scope": "string variable",
			"settings": {
				"foreground": "#edef7dff"
			}
		},
		{
			"name": "Support.function",
			"scope": "support.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#ffb454ff"
			}
		},
		{
			"name": "Support.constant",
			"scope": [ "support.constant", "support.variable"],
			"settings": {
				"fontStyle": "",
				"foreground": "#eb939aff"
			}
		},
		{
			"name": "Doctype/XML Processing",
			"scope": [
				"declaration.sgml.html declaration.doctype",
				"declaration.sgml.html declaration.doctype entity",
				"declaration.sgml.html declaration.doctype string",
				"declaration.xml-processing",
				"declaration.xml-processing entity",
				"declaration.xml-processing string"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#73817dff"
			}
		},
		{
			"name": "Meta.tag.A",
			"scope": [
				"declaration.tag",
				"declaration.tag entity",
				"meta.tag",
				"meta.tag entity"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#ec0d1eff"
			}
		},
		{
			"name": "css tag-name",
			"scope": "meta.selector.css entity.name.tag",
			"settings": {
				"fontStyle": "",
				"foreground": "#aa5507ff"
			}
		},
		{
			"name": "css#id",
			"scope": "meta.selector.css entity.other.attribute-name.id",
			"settings": {
				"foreground": "#fec758ff"
			}
		},
		{
			"name": "css.class",
			"scope": "meta.selector.css entity.other.attribute-name.class",
			"settings": {
				"fontStyle": "",
				"foreground": "#41a83eff"
			}
		},
		{
			"name": "css property-name:",
			"scope": "support.type.property-name.css",
			"settings": {
				"fontStyle": "",
				"foreground": "#96dd3bff"
			}
		},
		{
			"name": "css property-value;",
			"scope": [
				"meta.property-group support.constant.property-value.css",
				"meta.property-value support.constant.property-value.css"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#ffe862ff"
			}
		},
		{
			"name": "css additional-constants",
			"scope": [
				"meta.property-value support.constant.named-color.css",
				"meta.property-value constant"
			],
			"settings": {
				"fontStyle": "",
				"foreground": "#ffe862ff"
			}
		},
		{
			"name": "css @at-rule",
			"scope": "meta.preprocessor.at-rule keyword.control.at-rule",
			"settings": {
				"foreground": "#fd6209ff"
			}
		},
		{
			"name": "css constructor.argument",
			"scope": "meta.constructor.argument.css",
			"settings": {
				"fontStyle": "",
				"foreground": "#ec9799ff"
			}
		},
		{
			"name": "diff.header",
			"scope": [
				"meta.diff",
				"meta.diff.header"
			],
			"settings": {
				"fontStyle": "italic",
				"foreground": "#f8f8f8ff"
			}
		},
		{
			"name": "diff.deleted",
			"scope": "markup.deleted",
			"settings": {
				"foreground": "#ec9799ff"
			}
		},
		{
			"name": "diff.changed",
			"scope": "markup.changed",
			"settings": {
				"foreground": "#f8f8f8ff"
			}
		},
		{
			"name": "diff.inserted",
			"scope": "markup.inserted",
			"settings": {
				"foreground": "#41a83eff"
			}
		},
		{
			"name": "Markup Quote",
			"scope": "markup.quote",
			"settings": {
				"foreground": "#f12727ff"
			}
		},
		{
			"name": "Markup Lists",
			"scope": "markup.list",
			"settings": {
				"foreground": "#ff6262ff"
			}
		},
		{
			"name": "Markup Styling",
			"scope": [
				"markup.bold",
				"markup.italic"
			],
			"settings": {
				"foreground": "#fb9a4bff"
			}
		},
		{
			"name": "Markup: Strong",
			"scope": "markup.bold",
			"settings": {
				"fontStyle": "bold"
			}
		},
		{
			"name": "Markup: Emphasis",
			"scope": "markup.italic",
			"settings": {
				"fontStyle": "italic"
			}
		},
		{
			"scope": "markup.strikethrough",
			"settings": {
				"fontStyle": "strikethrough"
			}
		},
		{
			"name": "Markup Inline",
			"scope": "markup.inline.raw",
			"settings": {
				"fontStyle": "",
				"foreground": "#cd8d8dff"
			}
		},
		{
			"name": "Headings",
			"scope": [
				"markup.heading",
				"markup.heading.setext",
				"punctuation.definition.heading",
				"entity.name.section"
			],
			"settings": {
				"fontStyle": "bold",
				"foreground": "#fec758ff"
			}
		},
		{
			"name": "String interpolation",
			"scope": [
				"punctuation.definition.template-expression.begin",
				"punctuation.definition.template-expression.end",
				"punctuation.section.embedded",
				".format.placeholder"
			],
			"settings": {
				"foreground": "#ec0d1e"
			}
		}
	],
	"semanticHighlighting": true
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/.vscodeignore]---
Location: vscode-main/extensions/theme-seti/.vscodeignore

```text
build/**
cgmanifest.json
icons/preview.html
CONTRIBUTING.md
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/cgmanifest.json]---
Location: vscode-main/extensions/theme-seti/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "seti-ui",
					"repositoryUrl": "https://github.com/jesseweed/seti-ui",
					"commitHash": "2d6c5e68b4ded73c92dac291845ee44e1182d511"
				}
			},
			"version": "0.1.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/CONTRIBUTING.md]---
Location: vscode-main/extensions/theme-seti/CONTRIBUTING.md

```markdown
# theme-seti

This is an icon theme that uses the icons from [`seti-ui`](https://github.com/jesseweed/seti-ui).

## Previewing icons

There is a [`./icons/preview.html`](./icons/preview.html) file that can be opened to see all of the icons included in the theme.
To view this, it needs to be hosted by a web server. The easiest way is to open the file with the `Open with Live Server` command from the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).


## Updating icons

- Make a PR against https://github.com/jesseweed/seti-ui with your icon changes.
- Once accepted there, ping us or make a PR yourself that updates the theme and font here

To adopt the latest changes from https://github.com/jesseweed/seti-ui:

- have the main branches of `https://github.com/jesseweed/seti-ui` and `https://github.com/microsoft/vscode` cloned in the same parent folder
- in the `seti-ui` folder, run `npm install` and `npm run prepublishOnly`. This will generate updated icons and fonts.
- in the `vscode/extensions/theme-seti` folder run  `npm run update`. This will launch the [icon theme update script](build/update-icon-theme.js) that updates the theme as well as the font based on content in `seti-ui`.
- to test the icon theme, look at the icon preview as described above.
- when done, create a PR with the changes in https://github.com/microsoft/vscode.
Add a screenshot of the preview page to accompany it.


### Languages not shipped with `vscode`

Languages that are not shipped with `vscode` must be added to the `nonBuiltInLanguages` object inside of `update-icon-theme.js`.

These should match [the file mapping in `seti-ui`](https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less).

Please try and keep this list in alphabetical order! Thank you.
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/package.json]---
Location: vscode-main/extensions/theme-seti/package.json

```json
{
  "name": "vscode-theme-seti",
  "private": true,
  "version": "1.0.0",
  "displayName": "%displayName%",
  "description": "%description%",
  "publisher": "vscode",
  "license": "MIT",
  "icon": "icons/seti-circular-128x128.png",
  "scripts": {
    "update": "node ./build/update-icon-theme.js"
  },
  "engines": {
    "vscode": "*"
  },
  "categories": ["Themes"],
  "contributes": {
    "iconThemes": [
      {
        "id": "vs-seti",
        "label": "%themeLabel%",
        "path": "./icons/vs-seti-icon-theme.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/package.nls.json]---
Location: vscode-main/extensions/theme-seti/package.nls.json

```json
{
	"displayName": "Seti File Icon Theme",
	"description": "A file icon theme made out of the Seti UI file icons",
	"themeLabel": "Seti (Visual Studio Code)"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/README.md]---
Location: vscode-main/extensions/theme-seti/README.md

```markdown
# theme-seti

This is an icon theme that uses the icons from [`seti-ui`](https://github.com/jesseweed/seti-ui).

## Updating icons

There is script that can be used to update icons, [./build/update-icon-theme.js](build/update-icon-theme.js).

To run this script, run `npm run update` from the `theme-seti` directory.

This can be run in one of two ways: looking at a local copy of `seti-ui` for icons, or getting them straight from GitHub.

If you want to run it from a local copy of `seti-ui`, first clone [`seti-ui`](https://github.com/jesseweed/seti-ui) to the folder next to your `vscode` repo (from the `theme-seti` directory, `../../`).
Then, inside the `set-ui` directory, run `npm install` followed by `npm run prepublishOnly`. This will generate updated icons.

If you want to download the icons straight from GitHub, change the `FROM_DISK` variable to `false` inside of `update-icon-theme.js`.

### Languages not shipped with `vscode`

Languages that are not shipped with `vscode` must be added to the `nonBuiltInLanguages` object inside of `update-icon-theme.js`.

These should match [the file mapping in `seti-ui`](https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less).

Please try and keep this list in alphabetical order! Thank you.

## Previewing icons

There is a [`./icons/preview.html`](./icons/preview.html) file that can be opened to see all of the icons included in the theme.
Note that to view this, it needs to be hosted by a web server.

When updating icons, it is always a good idea to make sure that they work properly by looking at this page.
When submitting a PR that updates these icons, a screenshot of the preview page should accompany it.
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/ThirdPartyNotices.txt]---
Location: vscode-main/extensions/theme-seti/ThirdPartyNotices.txt

```text

THIRD-PARTY SOFTWARE NOTICES AND INFORMATION
For Microsoft vscode-theme-seti

This file is based on or incorporates material from the projects listed below ("Third Party OSS"). The original copyright
notice and the license under which Microsoft received such Third Party OSS, are set forth below. Such licenses and notice
are provided for informational purposes only. Microsoft licenses the Third Party OSS to you under the licensing terms for
the Microsoft product or service. Microsoft reserves all other rights not expressly granted under this agreement, whether
by implication, estoppel or otherwise.†

1.       Seti UI - A subtle dark colored UI theme for Atom. (https://github.com/jesseweed/seti-ui)

Copyright (c) 2014 Jesse Weed

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/build/update-icon-theme.js]---
Location: vscode-main/extensions/theme-seti/build/update-icon-theme.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const path = require('path');
const fs = require('fs');
const https = require('https');
const url = require('url');
const minimatch = require('minimatch');

// list of languagesId not shipped with VSCode. The information is used to associate an icon with a language association
// Please try and keep this list in alphabetical order! Thank you.
const nonBuiltInLanguages = { // { fileNames, extensions  }
	"argdown": { extensions: ['ad', 'adown', 'argdown', 'argdn'] },
	"bicep": { extensions: ['bicep'] },
	"elixir": { extensions: ['ex'] },
	"elm": { extensions: ['elm'] },
	"erb": { extensions: ['erb', 'rhtml', 'html.erb'] },
	"github-issues": { extensions: ['github-issues'] },
	"gradle": { extensions: ['gradle'] },
	"godot": { extensions: ['gd', 'godot', 'tres', 'tscn'] },
	"haml": { extensions: ['haml'] },
	"haskell": { extensions: ['hs'] },
	"haxe": { extensions: ['hx'] },
	"jinja": { extensions: ['jinja'] },
	"kotlin": { extensions: ['kt'] },
	"mustache": { extensions: ['mustache', 'mst', 'mu', 'stache'] },
	"nunjucks": { extensions: ['nunjucks', 'nunjs', 'nunj', 'nj', 'njk', 'tmpl', 'tpl'] },
	"ocaml": { extensions: ['ml', 'mli', 'mll', 'mly', 'eliom', 'eliomi'] },
	"puppet": { extensions: ['puppet'] },
	"r": { extensions: ['r', 'rhistory', 'rprofile', 'rt'] },
	"rescript": { extensions: ['res', 'resi'] },
	"sass": { extensions: ['sass'] },
	"stylus": { extensions: ['styl'] },
	"terraform": { extensions: ['tf', 'tfvars', 'hcl'] },
	"todo": { fileNames: ['todo'] },
	"vala": { extensions: ['vala'] },
	"vue": { extensions: ['vue'] }
};

// list of languagesId that inherit the icon from another language
const inheritIconFromLanguage = {
	"jsonc": 'json',
	"jsonl": 'json',
	"postcss": 'css',
	"django-html": 'html',
	"blade": 'php'
};

const ignoreExtAssociation = {
	"properties": true
};

const FROM_DISK = true; // set to true to take content from a repo checked out next to the vscode repo

let font, fontMappingsFile, fileAssociationFile, colorsFile;
if (!FROM_DISK) {
	font = 'https://raw.githubusercontent.com/jesseweed/seti-ui/master/styles/_fonts/seti/seti.woff';
	fontMappingsFile = 'https://raw.githubusercontent.com/jesseweed/seti-ui/master/styles/_fonts/seti.less';
	fileAssociationFile = 'https://raw.githubusercontent.com/jesseweed/seti-ui/master/styles/components/icons/mapping.less';
	colorsFile = 'https://raw.githubusercontent.com/jesseweed/seti-ui/master/styles/ui-variables.less';
} else {
	font = '../../../seti-ui/styles/_fonts/seti/seti.woff';
	fontMappingsFile = '../../../seti-ui/styles/_fonts/seti.less';
	fileAssociationFile = '../../../seti-ui/styles/components/icons/mapping.less';
	colorsFile = '../../../seti-ui/styles/ui-variables.less';
}

function getCommitSha(repoId) {
	const commitInfo = 'https://api.github.com/repos/' + repoId + '/commits/master';
	return download(commitInfo).then(function (content) {
		try {
			const lastCommit = JSON.parse(content);
			return Promise.resolve({
				commitSha: lastCommit.sha,
				commitDate: lastCommit.commit.author.date
			});
		} catch (e) {
			console.error('Failed parsing ' + content);
			return Promise.resolve(null);
		}
	}, function () {
		console.error('Failed loading ' + commitInfo);
		return Promise.resolve(null);
	});
}

function download(source) {
	if (source.startsWith('.')) {
		return readFile(source);
	}
	return new Promise((c, e) => {
		const _url = url.parse(source);
		const options = { host: _url.host, port: _url.port, path: _url.path, headers: { 'User-Agent': 'NodeJS' } };
		let content = '';
		https.get(options, function (response) {
			response.on('data', function (data) {
				content += data.toString();
			}).on('end', function () {
				c(content);
			});
		}).on('error', function (err) {
			e(err.message);
		});
	});
}

function readFile(fileName) {
	return new Promise((c, e) => {
		fs.readFile(fileName, function (err, data) {
			if (err) {
				e(err);
			} else {
				c(data.toString());
			}
		});
	});
}

function downloadBinary(source, dest) {
	if (source.startsWith('.')) {
		return copyFile(source, dest);
	}

	return new Promise((c, e) => {
		https.get(source, function (response) {
			switch (response.statusCode) {
				case 200: {
					const file = fs.createWriteStream(dest);
					response.on('data', function (chunk) {
						file.write(chunk);
					}).on('end', function () {
						file.end();
						c(null);
					}).on('error', function (err) {
						fs.unlink(dest);
						e(err.message);
					});
					break;
				}
				case 301:
				case 302:
				case 303:
				case 307:
					console.log('redirect to ' + response.headers.location);
					downloadBinary(response.headers.location, dest).then(c, e);
					break;
				default:
					e(new Error('Server responded with status code ' + response.statusCode));
			}
		});
	});
}

function copyFile(fileName, dest) {
	return new Promise((c, e) => {
		let cbCalled = false;
		function handleError(err) {
			if (!cbCalled) {
				e(err);
				cbCalled = true;
			}
		}
		const rd = fs.createReadStream(fileName);
		rd.on("error", handleError);
		const wr = fs.createWriteStream(dest);
		wr.on("error", handleError);
		wr.on("close", function () {
			if (!cbCalled) {
				c();
				cbCalled = true;
			}
		});
		rd.pipe(wr);
	});
}

function darkenColor(color) {
	let res = '#';
	for (let i = 1; i < 7; i += 2) {
		const newVal = Math.round(parseInt('0x' + color.substr(i, 2), 16) * 0.9);
		const hex = newVal.toString(16);
		if (hex.length === 1) {
			res += '0';
		}
		res += hex;
	}
	return res;
}

function mergeMapping(to, from, property) {
	if (from[property]) {
		if (to[property]) {
			to[property].push(...from[property]);
		} else {
			to[property] = from[property];
		}
	}
}

function getLanguageMappings() {
	const langMappings = {};
	const allExtensions = fs.readdirSync('..');
	for (let i = 0; i < allExtensions.length; i++) {
		const dirPath = path.join('..', allExtensions[i], 'package.json');
		if (fs.existsSync(dirPath)) {
			const content = fs.readFileSync(dirPath).toString();
			const jsonContent = JSON.parse(content);
			const languages = jsonContent.contributes && jsonContent.contributes.languages;
			if (Array.isArray(languages)) {
				for (let k = 0; k < languages.length; k++) {
					const languageId = languages[k].id;
					if (languageId) {
						const extensions = languages[k].extensions;
						const mapping = {};
						if (Array.isArray(extensions)) {
							mapping.extensions = extensions.map(function (e) { return e.substr(1).toLowerCase(); });
						}
						const filenames = languages[k].filenames;
						if (Array.isArray(filenames)) {
							mapping.fileNames = filenames.map(function (f) { return f.toLowerCase(); });
						}
						const filenamePatterns = languages[k].filenamePatterns;
						if (Array.isArray(filenamePatterns)) {
							mapping.filenamePatterns = filenamePatterns.map(function (f) { return f.toLowerCase(); });
						}
						const existing = langMappings[languageId];

						if (existing) {
							// multiple contributions to the same language
							// give preference to the contribution wth the configuration
							if (languages[k].configuration) {
								mergeMapping(mapping, existing, 'extensions');
								mergeMapping(mapping, existing, 'fileNames');
								mergeMapping(mapping, existing, 'filenamePatterns');
								langMappings[languageId] = mapping;
							} else {
								mergeMapping(existing, mapping, 'extensions');
								mergeMapping(existing, mapping, 'fileNames');
								mergeMapping(existing, mapping, 'filenamePatterns');
							}
						} else {
							langMappings[languageId] = mapping;
						}
					}
				}
			}
		}
	}
	for (const languageId in nonBuiltInLanguages) {
		langMappings[languageId] = nonBuiltInLanguages[languageId];
	}
	return langMappings;
}

exports.copyFont = function () {
	return downloadBinary(font, './icons/seti.woff');
};

exports.update = function () {

	console.log('Reading from ' + fontMappingsFile);
	const def2Content = {};
	const ext2Def = {};
	const fileName2Def = {};
	const def2ColorId = {};
	const colorId2Value = {};
	const lang2Def = {};

	function writeFileIconContent(info) {
		const iconDefinitions = {};
		const allDefs = Object.keys(def2Content).sort();

		for (let i = 0; i < allDefs.length; i++) {
			const def = allDefs[i];
			const entry = { fontCharacter: def2Content[def] };
			const colorId = def2ColorId[def];
			if (colorId) {
				const colorValue = colorId2Value[colorId];
				if (colorValue) {
					entry.fontColor = colorValue;

					const entryInverse = { fontCharacter: entry.fontCharacter, fontColor: darkenColor(colorValue) };
					iconDefinitions[def + '_light'] = entryInverse;
				}
			}
			iconDefinitions[def] = entry;
		}

		function getInvertSet(input) {
			const result = {};
			for (const assoc in input) {
				const invertDef = input[assoc] + '_light';
				if (iconDefinitions[invertDef]) {
					result[assoc] = invertDef;
				}
			}
			return result;
		}

		const res = {
			information_for_contributors: [
				'This file has been generated from data in https://github.com/jesseweed/seti-ui',
				'- icon definitions: https://github.com/jesseweed/seti-ui/blob/master/styles/_fonts/seti.less',
				'- icon colors: https://github.com/jesseweed/seti-ui/blob/master/styles/ui-variables.less',
				'- file associations: https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less',
				'If you want to provide a fix or improvement, please create a pull request against the jesseweed/seti-ui repository.',
				'Once accepted there, we are happy to receive an update request.',
			],
			fonts: [{
				id: "seti",
				src: [{ "path": "./seti.woff", "format": "woff" }],
				weight: "normal",
				style: "normal",
				size: "150%"
			}],
			iconDefinitions: iconDefinitions,
			//	folder: "_folder",
			file: "_default",
			fileExtensions: ext2Def,
			fileNames: fileName2Def,
			languageIds: lang2Def,
			light: {
				file: "_default_light",
				fileExtensions: getInvertSet(ext2Def),
				languageIds: getInvertSet(lang2Def),
				fileNames: getInvertSet(fileName2Def)
			},
			version: 'https://github.com/jesseweed/seti-ui/commit/' + info.commitSha,
		};

		const path = './icons/vs-seti-icon-theme.json';
		fs.writeFileSync(path, JSON.stringify(res, null, '\t'));
		console.log('written ' + path);
	}


	let match;

	return download(fontMappingsFile).then(function (content) {
		const regex = /@([\w-]+):\s*'(\\E[0-9A-F]+)';/g;
		const contents = {};
		while ((match = regex.exec(content)) !== null) {
			contents[match[1]] = match[2];
		}

		return download(fileAssociationFile).then(function (content) {
			const regex2 = /\.icon-(?:set|partial)\(['"]([\w-\.+]+)['"],\s*['"]([\w-]+)['"],\s*(@[\w-]+)\)/g;
			while ((match = regex2.exec(content)) !== null) {
				const pattern = match[1];
				let def = '_' + match[2];
				const colorId = match[3];
				let storedColorId = def2ColorId[def];
				let i = 1;
				while (storedColorId && colorId !== storedColorId) { // different colors for the same def?
					def = `_${match[2]}_${i}`;
					storedColorId = def2ColorId[def];
					i++;
				}
				if (!def2ColorId[def]) {
					def2ColorId[def] = colorId;
					def2Content[def] = contents[match[2]];
				}

				if (def === '_default') {
					continue; // no need to assign default color.
				}
				if (pattern[0] === '.') {
					ext2Def[pattern.substr(1).toLowerCase()] = def;
				} else {
					fileName2Def[pattern.toLowerCase()] = def;
				}
			}
			// replace extensions for languageId
			const langMappings = getLanguageMappings();
			for (let lang in langMappings) {
				const mappings = langMappings[lang];
				const exts = mappings.extensions || [];
				const fileNames = mappings.fileNames || [];
				const filenamePatterns = mappings.filenamePatterns || [];
				let preferredDef = null;
				// use the first file extension association for the preferred definition
				for (let i1 = 0; i1 < exts.length && !preferredDef; i1++) {
					preferredDef = ext2Def[exts[i1]];
				}
				// use the first file name association for the preferred definition, if not availbale
				for (let i1 = 0; i1 < fileNames.length && !preferredDef; i1++) {
					preferredDef = fileName2Def[fileNames[i1]];
				}
				for (let i1 = 0; i1 < filenamePatterns.length && !preferredDef; i1++) {
					let pattern = filenamePatterns[i1];
					for (const name in fileName2Def) {
						if (minimatch(name, pattern)) {
							preferredDef = fileName2Def[name];
							break;
						}
					}
				}
				if (preferredDef) {
					lang2Def[lang] = preferredDef;
					if (!nonBuiltInLanguages[lang] && !inheritIconFromLanguage[lang]) {
						for (let i2 = 0; i2 < exts.length; i2++) {
							// remove the extension association, unless it is different from the preferred
							if (ext2Def[exts[i2]] === preferredDef || ignoreExtAssociation[exts[i2]]) {
								delete ext2Def[exts[i2]];
							}
						}
						for (let i2 = 0; i2 < fileNames.length; i2++) {
							// remove the fileName association, unless it is different from the preferred
							if (fileName2Def[fileNames[i2]] === preferredDef) {
								delete fileName2Def[fileNames[i2]];
							}
						}
						for (let i2 = 0; i2 < filenamePatterns.length; i2++) {
							let pattern = filenamePatterns[i2];
							// remove the filenamePatterns association, unless it is different from the preferred
							for (const name in fileName2Def) {
								if (minimatch(name, pattern) && fileName2Def[name] === preferredDef) {
									delete fileName2Def[name];
								}
							}
						}
					}
				}
			}
			for (const lang in inheritIconFromLanguage) {
				const superLang = inheritIconFromLanguage[lang];
				const def = lang2Def[superLang];
				if (def) {
					lang2Def[lang] = def;
				} else {
					console.log('skipping icon def for ' + lang + ': no icon for ' + superLang + ' defined');
				}

			}


			return download(colorsFile).then(function (content) {
				const regex3 = /(@[\w-]+):\s*(#[0-9a-z]+)/g;
				while ((match = regex3.exec(content)) !== null) {
					colorId2Value[match[1]] = match[2];
				}
				return getCommitSha('jesseweed/seti-ui').then(function (info) {
					try {
						writeFileIconContent(info);

						const cgmanifestPath = './cgmanifest.json';
						const cgmanifest = fs.readFileSync(cgmanifestPath).toString();
						const cgmanifestContent = JSON.parse(cgmanifest);
						cgmanifestContent['registrations'][0]['component']['git']['commitHash'] = info.commitSha;
						fs.writeFileSync(cgmanifestPath, JSON.stringify(cgmanifestContent, null, '\t'));
						console.log('updated ' + cgmanifestPath);

						console.log('Updated to jesseweed/seti-ui@' + info.commitSha.substr(0, 7) + ' (' + info.commitDate.substr(0, 10) + ')');

					} catch (e) {
						console.error(e);
					}
				});
			});
		});
	}, console.error);
};

if (path.basename(process.argv[1]) === 'update-icon-theme.js') {
	exports.copyFont().then(() => exports.update());
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/theme-seti/icons/preview.html]---
Location: vscode-main/extensions/theme-seti/icons/preview.html

```html
<!DOCTYPE html>
<html lang="en">
<!--- Preview the icons in the Seti icon font. Use a simple-server or the LiveServer extension to view -->
<head>
	<meta charset="UTF-8">
	<title>seti font preview</title>
	<style>
		body {
			font-family: sans-serif;
			margin: 0;
			padding: 10px 20px;
		}

		.preview {
			line-height: 2em;
		}

		.preview_icon {
			display: inline-block;
			width: 32px;
			text-align: center;
		}

		.icon {
			display: inline-block;
			font-size: 16px;
			line-height: 1;
		}

		.icon:before {
			font-family: seti !important;
			font-style: normal;
			font-weight: normal !important;
			vertical-align: top;
		}

		.grid {
			display: grid;
			grid-template-columns: 0.7fr 0.7fr 1fr 0.7fr 0.7fr 1fr;
		}

		.vs {
			background-color: #FFFFFF;
			color: #000000;
		}

		.vs-dark {
			background-color: #1E1E1E;
			color: #D4D4D4;
		}
	</style>
	<script>
		function fetchThemeFile() {
			return fetch('./vs-seti-icon-theme.json').then(res => res.json());
		}
		function generateColumn(label, style, associations, htmContent) {
			htmContent.push('<div class=' + style + '>' + label);
			const keys = Object.keys(associations).sort();
			for (let association of keys) {
				const id = associations[association];
				htmContent.push('<div class="preview"><span class="preview_icon"><span class="icon icon' + id + '"></span></span><span>' + association + '</span></div>');
			}
			htmContent.push('</div>');
		}
		function generateIconsForScheme(label, set, style, htmContent) {
			generateColumn('language IDs', style, set.languageIds, htmContent);
			generateColumn('file extensions', style, set.fileExtensions, htmContent);
			generateColumn('file names', style, set.fileNames, htmContent);
		}

		function generateContent(themeFile) {
			let htmContent = [];
			let cssContent = [];
			const version = themeFile.version.substr(themeFile.version.lastIndexOf('/') + 1);
			cssContent.push('@font-face {font-family: "seti"; src: url("./seti.woff?' + version + '") format("woff"); }');

			let iconDefinitions = themeFile.iconDefinitions;
			for (let id in iconDefinitions) {
				let def = iconDefinitions[id];
				cssContent.push('.icon' + id + ':before { content: "' + def.fontCharacter + '"; color: ' + def.fontColor + '}');
			}
			let style = document.createElement('style');
			style.type = 'text/css';
			style.media = 'screen';
			style.innerHTML = cssContent.join('\n');
			document.head.appendChild(style);

			htmContent.push('<div class="grid">');
			generateIconsForScheme('dark', themeFile, 'vs-dark', htmContent);
			generateIconsForScheme('light', themeFile.light, 'vs', htmContent);
			htmContent.push('</div>');

			document.body.innerHTML += htmContent.join('\n');
		}
		window.addEventListener("load", function () {
			fetchThemeFile().then(generateContent);
		});
	</script>
</head>

<body>
</body>

</html>
```

--------------------------------------------------------------------------------

````

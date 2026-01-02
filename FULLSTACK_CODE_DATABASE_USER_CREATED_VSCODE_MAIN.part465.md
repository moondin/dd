---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 465
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 465 of 552)

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

---[FILE: src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_type_foo_left_twice.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/browser/xterm/recordings/rich/windows11_pwsh7_type_foo_left_twice.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable */

// Windows 24H2
// PowerShell 7.5.2
// Steps:
// - Open terminal
// - Type foo
// - Left arrow twice
export const events = [
	{
		"type": "resize",
		"cols": 167,
		"rows": 22
	},
	{
		"type": "output",
		"data": "\u001b[?9001h\u001b[?1004h"
	},
	{
		"type": "input",
		"data": "\u001b[I"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[2J\u001b[m\u001b[H\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\u001b[H\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe\u0007\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b[?25l\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\r\n\u001b[K\u001b[H\u001b[?25h"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;PromptType=posh-git\u0007\u001b]633;P;HasRichCommandDetection=True\u0007"
	},
	{
		"type": "output",
		"data": "\u001b]633;P;ContinuationPrompt=>> \u0007\u001b]633;P;IsWindows=True\u0007"
	},
	{
		"type": "command",
		"id": "_setContext"
	},
	{
		"type": "output",
		"data": "\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe \u0007"
	},
	{
		"type": "output",
		"data": "\u001b]0;C:\\Program Files\\WindowsApps\\Microsoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\pwsh.exe\u0007\u001b]0;xterm.js [master] - PowerShell 7.5 (30016)\u0007\u001b]633;A\u0007\u001b]633;P;Cwd=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js\u0007\u001b]633;EnvJson;{\"PATH\":\"C:\\x5c\\x5cProgram Files\\x5c\\x5cWindowsApps\\x5c\\x5cMicrosoft.PowerShell_7.5.2.0_x64__8wekyb3d8bbwe\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cMicrosoft SDKs\\x5c\\x5cAzure\\x5c\\x5cCLI2\\x5c\\x5cwbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cEclipse Adoptium\\x5c\\x5cjdk-8.0.345.1-hotspot\\x5c\\x5cbin\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cPhysX\\x5c\\x5cCommon\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit LFS\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnu\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cstarship\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5csystem32\\x3bC:\\x5c\\x5cWINDOWS\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWbem\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cWindowsPowerShell\\x5c\\x5cv1.0\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cNVIDIA Corporation\\x5c\\x5cNVIDIA NvDLISR\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGitHub CLI\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cWindows Kits\\x5c\\x5c10\\x5c\\x5cWindows Performance Toolkit\\x5c\\x5c\\x3bC:\\x5c\\x5cProgramData\\x5c\\x5cchocolatey\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cdotnet\\x5c\\x5c\\x3bC:\\x5c\\x5cWINDOWS\\x5c\\x5cSystem32\\x5c\\x5cOpenSSH\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cGpg4win\\x5c\\x5c..\\x5c\\x5cGnuPG\\x5c\\x5cbin\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cnodejs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files\\x5c\\x5cGit\\x5c\\x5ccmd\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython312\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.cargo\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cPython\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5cScripts\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cPython\\x5c\\x5cPython310\\x5c\\x5c\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5coh-my-posh\\x5c\\x5cthemes\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-cli\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWindowsApps\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cJetBrains\\x5c\\x5cToolbox\\x5c\\x5cscripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cnvs\\x5c\\x5c\\x3bC:\\x5c\\x5cProgram Files (x86)\\x5c\\x5cMicrosoft Visual Studio\\x5c\\x5c2017\\x5c\\x5cBuildTools\\x5c\\x5cMSBuild\\x5c\\x5c15.0\\x5c\\x5cBin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cBurntSushi.ripgrep.MSVC_Microsoft.Winget.Source_8wekyb3d8bbwe\\x5c\\x5cripgrep-13.0.0-x86_64-pc-windows-msvc\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cMicrosoft\\x5c\\x5cWinGet\\x5c\\x5cPackages\\x5c\\x5cSchniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\\x3bc:\\x5c\\x5cusers\\x5c\\x5cdaniel\\x5c\\x5c.local\\x5c\\x5cbin\\x3bC:\\x5c\\x5cTools\\x5c\\x5cHandle\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code Insiders\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cJulia-1.11.1\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cMicrosoft VS Code\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPackages\\x5c\\x5cPythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0\\x5c\\x5cLocalCache\\x5c\\x5clocal-packages\\x5c\\x5cPython39\\x5c\\x5cScripts\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5cWindsurf\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cLocal\\x5c\\x5cPrograms\\x5c\\x5ccursor\\x5c\\x5cresources\\x5c\\x5capp\\x5c\\x5cbin\\x3bC:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5cAppData\\x5c\\x5cRoaming\\x5c\\x5cnpm\\x3bc:\\x5c\\x5cUsers\\x5c\\x5cDaniel\\x5c\\x5c.vscode-oss-dev\\x5c\\x5cUser\\x5c\\x5cglobalStorage\\x5c\\x5cgithub.copilot-chat\\x5c\\x5cdebugCommand\"};a379e16d-df58-451e-8d2c-ad6e2b161777\u0007C:\\Github\\Tyriar\\xterm.js \u001b[93m[\u001b[92mmaster ↑2\u001b[93m]\u001b[m> \u001b]633;P;Prompt=C:\\x5cGithub\\x5cTyriar\\x5cxterm.js \\x1b[93m[\\x1b[39m\\x1b[92mmaster\\x1b[39m\\x1b[92m ↑2\\x1b[39m\\x1b[93m]\\x1b[39m> \u0007\u001b]633;B\u0007"
	},
	{
		"type": "promptInputChange",
		"data": "|"
	},
	{
		"type": "commandDetection.onCommandStarted"
	},
	{
		"type": "input",
		"data": "f"
	},
	{
		"type": "output",
		"data": "\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93mf\u001b[97m\u001b[2m\u001b[3mor ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }\u001b[1;41H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "f|or ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }"
	},
	{
		"type": "promptInputChange",
		"data": "f|[or ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\bfo\u001b[97m\u001b[2m\u001b[3mr ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }\u001b[1;42H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "fo|[r ($i=40; $i -le 101; $i++) { $branch = \"origin/release/1.$i\"; if (git rev-parse --verify $branch 2>$null) { $count = git rev-list --count --first-parent $branch \"^main\" 2>$null; if ($count) { Write-Host \"release/1.$i : $count first-parent commits\" } else { Write-Host \"release/1.$i : 0 first-parent commits\" } } else { Write-Host \"release/1.$i : branch not found\" } }]"
	},
	{
		"type": "input",
		"data": "o"
	},
	{
		"type": "output",
		"data": "\u001b[m\u001b[?25l"
	},
	{
		"type": "output",
		"data": "\u001b[93m\u001b[1;40Hfoo                                                                                                                             \u001b[m                                                                                                                                                                       \r\n\u001b[75X\u001b[1;43H\u001b[?25h"
	},
	{
		"type": "promptInputChange",
		"data": "foo|"
	},
	{
		"type": "input",
		"data": "\u001b[D"
	},
	{
		"type": "output",
		"data": "\b"
	},
	{
		"type": "promptInputChange",
		"data": "fo|o"
	},
	{
		"type": "input",
		"data": "\u001b[D"
	},
	{
		"type": "output",
		"data": "\b"
	},
	{
		"type": "promptInputChange",
		"data": "f|oo"
	}
]
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/environmentVariableCollection.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/environmentVariableCollection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { EnvironmentVariableMutatorType } from '../../../../../platform/terminal/common/environmentVariable.js';
import { IProcessEnvironment, isWindows } from '../../../../../base/common/platform.js';
import { MergedEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariableCollection.js';
import { deserializeEnvironmentDescriptionMap, deserializeEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariableShared.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('EnvironmentVariable - MergedEnvironmentVariableCollection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('ctor', () => {
		test('Should keep entries that come after a Prepend or Append type mutators', () => {
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}],
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}],
				['ext3', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}],
				['ext4', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a4', type: EnvironmentVariableMutatorType.Append, variable: 'A', options: { applyAtProcessCreation: true, applyAtShellIntegration: true } }]
					])
				}]
			]));
			deepStrictEqual([...merged.getVariableMap(undefined).entries()], [
				['A', [
					{ extensionIdentifier: 'ext4', type: EnvironmentVariableMutatorType.Append, value: 'a4', variable: 'A', options: { applyAtProcessCreation: true, applyAtShellIntegration: true } },
					{ extensionIdentifier: 'ext3', type: EnvironmentVariableMutatorType.Prepend, value: 'a3', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Append, value: 'a2', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Prepend, value: 'a1', variable: 'A', options: undefined }
				]]
			]);
		});

		test('Should remove entries that come after a Replace type mutator', () => {
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}],
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}],
				['ext3', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}],
				['ext4', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a4', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			deepStrictEqual([...merged.getVariableMap(undefined).entries()], [
				['A', [
					{ extensionIdentifier: 'ext3', type: EnvironmentVariableMutatorType.Replace, value: 'a3', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Append, value: 'a2', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Prepend, value: 'a1', variable: 'A', options: undefined }
				]]
			], 'The ext4 entry should be removed as it comes after a Replace');
		});

		test('Appropriate workspace scoped entries are returned when querying for a particular workspace folder', () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, scope: scope1, variable: 'A' }]
					])
				}],
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}],
				['ext3', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Prepend, scope: scope2, variable: 'A' }]
					])
				}],
				['ext4', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a4', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			deepStrictEqual([...merged.getVariableMap(scope2).entries()], [
				['A', [
					{ extensionIdentifier: 'ext4', type: EnvironmentVariableMutatorType.Append, value: 'a4', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext3', type: EnvironmentVariableMutatorType.Prepend, value: 'a3', scope: scope2, variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Append, value: 'a2', variable: 'A', options: undefined },
				]]
			]);
		});

		test('Workspace scoped entries are not included when looking for global entries', () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, scope: scope1, variable: 'A' }]
					])
				}],
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}],
				['ext3', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Prepend, scope: scope2, variable: 'A' }]
					])
				}],
				['ext4', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a4', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			deepStrictEqual([...merged.getVariableMap(undefined).entries()], [
				['A', [
					{ extensionIdentifier: 'ext4', type: EnvironmentVariableMutatorType.Append, value: 'a4', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Append, value: 'a2', variable: 'A', options: undefined },
				]]
			]);
		});

		test('Workspace scoped description entries are properly filtered for each extension', () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, scope: scope1, variable: 'A' }]
					]),
					descriptionMap: deserializeEnvironmentDescriptionMap([
						['A-key-scope1', { description: 'ext1 scope1 description', scope: scope1 }],
						['A-key-scope2', { description: 'ext1 scope2 description', scope: scope2 }],
					])
				}],
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					]),
					descriptionMap: deserializeEnvironmentDescriptionMap([
						['A-key', { description: 'ext2 global description' }],
					])
				}],
				['ext3', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Prepend, scope: scope2, variable: 'A' }]
					]),
					descriptionMap: deserializeEnvironmentDescriptionMap([
						['A-key', { description: 'ext3 scope2 description', scope: scope2 }],
					])
				}],
				['ext4', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a4', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			deepStrictEqual([...merged.getDescriptionMap(scope1).entries()], [
				['ext1', 'ext1 scope1 description'],
			]);
			deepStrictEqual([...merged.getDescriptionMap(undefined).entries()], [
				['ext2', 'ext2 global description'],
			]);
		});
	});

	suite('applyToProcessEnvironment', () => {
		test('should apply the collection to an environment', async () => {
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }],
						['C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' }]
					])
				}]
			]));
			const env: IProcessEnvironment = {
				A: 'foo',
				B: 'bar',
				C: 'baz'
			};
			await merged.applyToProcessEnvironment(env, undefined);
			deepStrictEqual(env, {
				A: 'a',
				B: 'barb',
				C: 'cbaz'
			});
		});

		test('should apply the appropriate workspace scoped entries to an environment', async () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, scope: scope1, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, scope: scope2, variable: 'B' }],
						['C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' }]
					])
				}]
			]));
			const env: IProcessEnvironment = {
				A: 'foo',
				B: 'bar',
				C: 'baz'
			};
			await merged.applyToProcessEnvironment(env, scope1);
			deepStrictEqual(env, {
				A: 'a',
				B: 'bar', // This is not changed because the scope does not match
				C: 'cbaz'
			});
		});

		test('should apply the collection to environment entries with no values', async () => {
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }],
						['C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' }]
					])
				}]
			]));
			const env: IProcessEnvironment = {};
			await merged.applyToProcessEnvironment(env, undefined);
			deepStrictEqual(env, {
				A: 'a',
				B: 'b',
				C: 'c'
			});
		});

		test('should apply to variable case insensitively on Windows only', async () => {
			const merged = new MergedEnvironmentVariableCollection(new Map([
				['ext', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'a' }],
						['b', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'b' }],
						['c', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'c' }]
					])
				}]
			]));
			const env: IProcessEnvironment = {
				A: 'A',
				B: 'B',
				C: 'C'
			};
			await merged.applyToProcessEnvironment(env, undefined);
			if (isWindows) {
				deepStrictEqual(env, {
					A: 'a',
					B: 'Bb',
					C: 'cC'
				});
			} else {
				deepStrictEqual(env, {
					a: 'a',
					A: 'A',
					b: 'b',
					B: 'B',
					c: 'c',
					C: 'C'
				});
			}
		});
	});

	suite('diff', () => {
		test('should return undefined when collectinos are the same', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined);
			strictEqual(diff, undefined);
		});
		test('should generate added diffs from when the first entry is added', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			strictEqual(diff.changed.size, 0);
			strictEqual(diff.removed.size, 0);
			const entries = [...diff.added.entries()];
			deepStrictEqual(entries, [
				['A', [{ extensionIdentifier: 'ext1', value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A', options: undefined }]]
			]);
		});

		test('should generate added diffs from the same extension', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			strictEqual(diff.changed.size, 0);
			strictEqual(diff.removed.size, 0);
			const entries = [...diff.added.entries()];
			deepStrictEqual(entries, [
				['B', [{ extensionIdentifier: 'ext1', value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B', options: undefined }]]
			]);
		});

		test('should generate added diffs from a different extension', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}]
			]));

			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}],
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			strictEqual(diff.changed.size, 0);
			strictEqual(diff.removed.size, 0);
			deepStrictEqual([...diff.added.entries()], [
				['A', [{ extensionIdentifier: 'ext2', value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A', options: undefined }]]
			]);

			const merged3 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' }]
					])
				}],
				// This entry should get removed
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			const diff2 = merged1.diff(merged3, undefined)!;
			strictEqual(diff2.changed.size, 0);
			strictEqual(diff2.removed.size, 0);
			deepStrictEqual([...diff.added.entries()], [...diff2.added.entries()], 'Swapping the order of the entries in the other collection should yield the same result');
		});

		test('should remove entries in the diff that come after a Replace', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const merged4 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}],
				// This entry should get removed as it comes after a replace
				['ext2', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Append, variable: 'A' }]
					])
				}]
			]));
			const diff = merged1.diff(merged4, undefined);
			strictEqual(diff, undefined, 'Replace should ignore any entries after it');
		});

		test('should generate removed diffs', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Replace, variable: 'B' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			strictEqual(diff.changed.size, 0);
			strictEqual(diff.added.size, 0);
			deepStrictEqual([...diff.removed.entries()], [
				['B', [{ extensionIdentifier: 'ext1', value: 'b', type: EnvironmentVariableMutatorType.Replace, variable: 'B', options: undefined }]]
			]);
		});

		test('should generate changed diffs', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Replace, variable: 'B' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			strictEqual(diff.added.size, 0);
			strictEqual(diff.removed.size, 0);
			deepStrictEqual([...diff.changed.entries()], [
				['A', [{ extensionIdentifier: 'ext1', value: 'a2', type: EnvironmentVariableMutatorType.Replace, variable: 'A', options: undefined }]],
				['B', [{ extensionIdentifier: 'ext1', value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B', options: undefined }]]
			]);
		});

		test('should generate diffs with added, changed and removed', () => {
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Prepend, variable: 'B' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
						['C', { value: 'c', type: EnvironmentVariableMutatorType.Append, variable: 'C' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, undefined)!;
			deepStrictEqual([...diff.added.entries()], [
				['C', [{ extensionIdentifier: 'ext1', value: 'c', type: EnvironmentVariableMutatorType.Append, variable: 'C', options: undefined }]],
			]);
			deepStrictEqual([...diff.removed.entries()], [
				['B', [{ extensionIdentifier: 'ext1', value: 'b', type: EnvironmentVariableMutatorType.Prepend, variable: 'B', options: undefined }]]
			]);
			deepStrictEqual([...diff.changed.entries()], [
				['A', [{ extensionIdentifier: 'ext1', value: 'a2', type: EnvironmentVariableMutatorType.Replace, variable: 'A', options: undefined }]]
			]);
		});

		test('should only generate workspace specific diffs', () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const merged1 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Replace, scope: scope1, variable: 'A' }],
						['B', { value: 'b', type: EnvironmentVariableMutatorType.Prepend, variable: 'B' }]
					])
				}]
			]));
			const merged2 = new MergedEnvironmentVariableCollection(new Map([
				['ext1', {
					map: deserializeEnvironmentVariableCollection([
						['A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Replace, scope: scope1, variable: 'A' }],
						['C', { value: 'c', type: EnvironmentVariableMutatorType.Append, scope: scope2, variable: 'C' }]
					])
				}]
			]));
			const diff = merged1.diff(merged2, scope1)!;
			strictEqual(diff.added.size, 0);
			deepStrictEqual([...diff.removed.entries()], [
				['B', [{ extensionIdentifier: 'ext1', value: 'b', type: EnvironmentVariableMutatorType.Prepend, variable: 'B', options: undefined }]]
			]);
			deepStrictEqual([...diff.changed.entries()], [
				['A', [{ extensionIdentifier: 'ext1', value: 'a2', type: EnvironmentVariableMutatorType.Replace, scope: scope1, variable: 'A', options: undefined }]]
			]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/environmentVariableService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/environmentVariableService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { TestExtensionService, TestHistoryService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { EnvironmentVariableService } from '../../common/environmentVariableService.js';
import { EnvironmentVariableMutatorType, IEnvironmentVariableMutator } from '../../../../../platform/terminal/common/environmentVariable.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { Emitter } from '../../../../../base/common/event.js';
import { IProcessEnvironment } from '../../../../../base/common/platform.js';
import { IHistoryService } from '../../../../services/history/common/history.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

class TestEnvironmentVariableService extends EnvironmentVariableService {
	persistCollections(): void { this._persistCollections(); }
	notifyCollectionUpdates(): void { this._notifyCollectionUpdates(); }
}

suite('EnvironmentVariable - EnvironmentVariableService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let environmentVariableService: TestEnvironmentVariableService;
	let changeExtensionsEvent: Emitter<void>;

	setup(() => {
		changeExtensionsEvent = store.add(new Emitter<void>());

		instantiationService = store.add(new TestInstantiationService());
		instantiationService.stub(IExtensionService, TestExtensionService);
		instantiationService.stub(IStorageService, store.add(new TestStorageService()));
		instantiationService.stub(IHistoryService, new TestHistoryService());
		instantiationService.stub(IExtensionService, TestExtensionService);
		instantiationService.stub(IExtensionService, 'onDidChangeExtensions', changeExtensionsEvent.event);
		instantiationService.stub(IExtensionService, 'extensions', [
			{ identifier: { value: 'ext1' } },
			{ identifier: { value: 'ext2' } },
			{ identifier: { value: 'ext3' } }
		]);

		environmentVariableService = store.add(instantiationService.createInstance(TestEnvironmentVariableService));
	});

	test('should persist collections to the storage service and be able to restore from them', () => {
		const collection = new Map<string, IEnvironmentVariableMutator>();
		collection.set('A-key', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' });
		collection.set('B-key', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' });
		collection.set('C-key', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C', options: { applyAtProcessCreation: true, applyAtShellIntegration: true } });
		environmentVariableService.set('ext1', { map: collection, persistent: true });
		deepStrictEqual([...environmentVariableService.mergedCollection.getVariableMap(undefined).entries()], [
			['A', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Replace, value: 'a', variable: 'A', options: undefined }]],
			['B', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Append, value: 'b', variable: 'B', options: undefined }]],
			['C', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Prepend, value: 'c', variable: 'C', options: { applyAtProcessCreation: true, applyAtShellIntegration: true } }]]
		]);

		// Persist with old service, create a new service with the same storage service to verify restore
		environmentVariableService.persistCollections();
		const service2: TestEnvironmentVariableService = store.add(instantiationService.createInstance(TestEnvironmentVariableService));
		deepStrictEqual([...service2.mergedCollection.getVariableMap(undefined).entries()], [
			['A', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Replace, value: 'a', variable: 'A', options: undefined }]],
			['B', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Append, value: 'b', variable: 'B', options: undefined }]],
			['C', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Prepend, value: 'c', variable: 'C', options: { applyAtProcessCreation: true, applyAtShellIntegration: true } }]]
		]);
	});

	suite('mergedCollection', () => {
		test('should overwrite any other variable with the first extension that replaces', () => {
			const collection1 = new Map<string, IEnvironmentVariableMutator>();
			const collection2 = new Map<string, IEnvironmentVariableMutator>();
			const collection3 = new Map<string, IEnvironmentVariableMutator>();
			collection1.set('A-key', { value: 'a1', type: EnvironmentVariableMutatorType.Append, variable: 'A' });
			collection1.set('B-key', { value: 'b1', type: EnvironmentVariableMutatorType.Replace, variable: 'B' });
			collection2.set('A-key', { value: 'a2', type: EnvironmentVariableMutatorType.Replace, variable: 'A' });
			collection2.set('B-key', { value: 'b2', type: EnvironmentVariableMutatorType.Append, variable: 'B' });
			collection3.set('A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' });
			collection3.set('B-key', { value: 'b3', type: EnvironmentVariableMutatorType.Replace, variable: 'B' });
			environmentVariableService.set('ext1', { map: collection1, persistent: true });
			environmentVariableService.set('ext2', { map: collection2, persistent: true });
			environmentVariableService.set('ext3', { map: collection3, persistent: true });
			deepStrictEqual([...environmentVariableService.mergedCollection.getVariableMap(undefined).entries()], [
				['A', [
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Replace, value: 'a2', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Append, value: 'a1', variable: 'A', options: undefined }
				]],
				['B', [{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Replace, value: 'b1', variable: 'B', options: undefined }]]
			]);
		});

		test('should correctly apply the environment values from multiple extension contributions in the correct order', async () => {
			const collection1 = new Map<string, IEnvironmentVariableMutator>();
			const collection2 = new Map<string, IEnvironmentVariableMutator>();
			const collection3 = new Map<string, IEnvironmentVariableMutator>();
			collection1.set('A-key', { value: ':a1', type: EnvironmentVariableMutatorType.Append, variable: 'A' });
			collection2.set('A-key', { value: 'a2:', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' });
			collection3.set('A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Replace, variable: 'A' });
			environmentVariableService.set('ext1', { map: collection1, persistent: true });
			environmentVariableService.set('ext2', { map: collection2, persistent: true });
			environmentVariableService.set('ext3', { map: collection3, persistent: true });

			// The entries should be ordered in the order they are applied
			deepStrictEqual([...environmentVariableService.mergedCollection.getVariableMap(undefined).entries()], [
				['A', [
					{ extensionIdentifier: 'ext3', type: EnvironmentVariableMutatorType.Replace, value: 'a3', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Prepend, value: 'a2:', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Append, value: ':a1', variable: 'A', options: undefined }
				]]
			]);

			// Verify the entries get applied to the environment as expected
			const env: IProcessEnvironment = { A: 'foo' };
			await environmentVariableService.mergedCollection.applyToProcessEnvironment(env, undefined);
			deepStrictEqual(env, { A: 'a2:a3:a1' });
		});

		test('should correctly apply the workspace specific environment values from multiple extension contributions in the correct order', async () => {
			const scope1 = { workspaceFolder: { uri: URI.file('workspace1'), name: 'workspace1', index: 0 } };
			const scope2 = { workspaceFolder: { uri: URI.file('workspace2'), name: 'workspace2', index: 3 } };
			const collection1 = new Map<string, IEnvironmentVariableMutator>();
			const collection2 = new Map<string, IEnvironmentVariableMutator>();
			const collection3 = new Map<string, IEnvironmentVariableMutator>();
			collection1.set('A-key', { value: ':a1', type: EnvironmentVariableMutatorType.Append, scope: scope1, variable: 'A' });
			collection2.set('A-key', { value: 'a2:', type: EnvironmentVariableMutatorType.Prepend, variable: 'A' });
			collection3.set('A-key', { value: 'a3', type: EnvironmentVariableMutatorType.Replace, scope: scope2, variable: 'A' });
			environmentVariableService.set('ext1', { map: collection1, persistent: true });
			environmentVariableService.set('ext2', { map: collection2, persistent: true });
			environmentVariableService.set('ext3', { map: collection3, persistent: true });

			// The entries should be ordered in the order they are applied
			deepStrictEqual([...environmentVariableService.mergedCollection.getVariableMap(scope1).entries()], [
				['A', [
					{ extensionIdentifier: 'ext2', type: EnvironmentVariableMutatorType.Prepend, value: 'a2:', variable: 'A', options: undefined },
					{ extensionIdentifier: 'ext1', type: EnvironmentVariableMutatorType.Append, value: ':a1', scope: scope1, variable: 'A', options: undefined }
				]]
			]);

			// Verify the entries get applied to the environment as expected
			const env: IProcessEnvironment = { A: 'foo' };
			await environmentVariableService.mergedCollection.applyToProcessEnvironment(env, scope1);
			deepStrictEqual(env, { A: 'a2:foo:a1' });
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/environmentVariableShared.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/environmentVariableShared.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual } from 'assert';
import { deserializeEnvironmentVariableCollection, serializeEnvironmentVariableCollection } from '../../../../../platform/terminal/common/environmentVariableShared.js';
import { EnvironmentVariableMutatorType, IEnvironmentVariableMutator } from '../../../../../platform/terminal/common/environmentVariable.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('EnvironmentVariable - deserializeEnvironmentVariableCollection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should construct correctly with 3 arguments', () => {
		const c = deserializeEnvironmentVariableCollection([
			['A', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
			['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }],
			['C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' }]
		]);
		const keys = [...c.keys()];
		deepStrictEqual(keys, ['A', 'B', 'C']);
		deepStrictEqual(c.get('A'), { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' });
		deepStrictEqual(c.get('B'), { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' });
		deepStrictEqual(c.get('C'), { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' });
	});
});

suite('EnvironmentVariable - serializeEnvironmentVariableCollection', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('should correctly serialize the object', () => {
		const collection = new Map<string, IEnvironmentVariableMutator>();
		deepStrictEqual(serializeEnvironmentVariableCollection(collection), []);
		collection.set('A', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' });
		collection.set('B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' });
		collection.set('C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' });
		deepStrictEqual(serializeEnvironmentVariableCollection(collection), [
			['A', { value: 'a', type: EnvironmentVariableMutatorType.Replace, variable: 'A' }],
			['B', { value: 'b', type: EnvironmentVariableMutatorType.Append, variable: 'B' }],
			['C', { value: 'c', type: EnvironmentVariableMutatorType.Prepend, variable: 'C' }]
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/terminalColorRegistry.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/terminalColorRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Extensions as ThemeingExtensions, IColorRegistry, ColorIdentifier } from '../../../../../platform/theme/common/colorRegistry.js';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { ansiColorIdentifiers, registerColors } from '../../common/terminalColorRegistry.js';
import { IColorTheme } from '../../../../../platform/theme/common/themeService.js';
import { Color } from '../../../../../base/common/color.js';
import { ColorScheme } from '../../../../../platform/theme/common/theme.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

registerColors();

const themingRegistry = Registry.as<IColorRegistry>(ThemeingExtensions.ColorContribution);
function getMockTheme(type: ColorScheme): IColorTheme {
	const theme = {
		selector: '',
		label: '',
		type: type,
		getColor: (colorId: ColorIdentifier): Color | undefined => themingRegistry.resolveDefaultColor(colorId, theme),
		defines: () => true,
		getTokenStyleMetadata: () => undefined,
		tokenColorMap: [],
		tokenFontMap: [],
		semanticHighlighting: false
	};
	return theme;
}

suite('Workbench - TerminalColorRegistry', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('hc colors', function () {
		const theme = getMockTheme(ColorScheme.HIGH_CONTRAST_DARK);
		const colors = ansiColorIdentifiers.map(colorId => Color.Format.CSS.formatHexA(theme.getColor(colorId)!, true));

		assert.deepStrictEqual(colors, [
			'#000000',
			'#cd0000',
			'#00cd00',
			'#cdcd00',
			'#0000ee',
			'#cd00cd',
			'#00cdcd',
			'#e5e5e5',
			'#7f7f7f',
			'#ff0000',
			'#00ff00',
			'#ffff00',
			'#5c5cff',
			'#ff00ff',
			'#00ffff',
			'#ffffff'
		], 'The high contrast terminal colors should be used when the hc theme is active');

	});

	test('light colors', function () {
		const theme = getMockTheme(ColorScheme.LIGHT);
		const colors = ansiColorIdentifiers.map(colorId => Color.Format.CSS.formatHexA(theme.getColor(colorId)!, true));

		assert.deepStrictEqual(colors, [
			'#000000',
			'#cd3131',
			'#107c10',
			'#949800',
			'#0451a5',
			'#bc05bc',
			'#0598bc',
			'#555555',
			'#666666',
			'#cd3131',
			'#14ce14',
			'#b5ba00',
			'#0451a5',
			'#bc05bc',
			'#0598bc',
			'#a5a5a5'
		], 'The light terminal colors should be used when the light theme is active');

	});

	test('dark colors', function () {
		const theme = getMockTheme(ColorScheme.DARK);
		const colors = ansiColorIdentifiers.map(colorId => Color.Format.CSS.formatHexA(theme.getColor(colorId)!, true));

		assert.deepStrictEqual(colors, [
			'#000000',
			'#cd3131',
			'#0dbc79',
			'#e5e510',
			'#2472c8',
			'#bc3fbc',
			'#11a8cd',
			'#e5e5e5',
			'#666666',
			'#f14c4c',
			'#23d18b',
			'#f5f543',
			'#3b8eea',
			'#d670d6',
			'#29b8db',
			'#e5e5e5'
		], 'The dark terminal colors should be used when a dark theme is active');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/terminalDataBuffering.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/terminalDataBuffering.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter } from '../../../../../base/common/event.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TerminalDataBufferer } from '../../../../../platform/terminal/common/terminalDataBuffering.js';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

suite('Workbench - TerminalDataBufferer', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let bufferer: TerminalDataBufferer;
	let counter: Map<number, number>;
	let data: Map<number, string>;

	setup(async () => {
		counter = new Map();
		data = new Map();
		bufferer = store.add(new TerminalDataBufferer((id, e) => {
			if (!counter.has(id)) {
				counter.set(id, 0);
			}
			counter.set(id, counter.get(id)! + 1);
			if (!data.has(id)) {
				data.set(id, '');
			}
			data.set(id, e);
		}));
	});

	test('start', async () => {
		const terminalOnData = new Emitter<string>();

		store.add(bufferer.startBuffering(1, terminalOnData.event, 0));

		terminalOnData.fire('1');
		terminalOnData.fire('2');
		terminalOnData.fire('3');

		await wait(0);

		terminalOnData.fire('4');

		assert.strictEqual(counter.get(1), 1);
		assert.strictEqual(data.get(1), '123');

		await wait(0);

		assert.strictEqual(counter.get(1), 2);
		assert.strictEqual(data.get(1), '4');
	});

	test('start 2', async () => {
		const terminal1OnData = new Emitter<string>();
		const terminal2OnData = new Emitter<string>();

		store.add(bufferer.startBuffering(1, terminal1OnData.event, 0));
		store.add(bufferer.startBuffering(2, terminal2OnData.event, 0));

		terminal1OnData.fire('1');
		terminal2OnData.fire('4');
		terminal1OnData.fire('2');
		terminal2OnData.fire('5');
		terminal1OnData.fire('3');
		terminal2OnData.fire('6');
		terminal2OnData.fire('7');

		assert.strictEqual(counter.get(1), undefined);
		assert.strictEqual(data.get(1), undefined);
		assert.strictEqual(counter.get(2), undefined);
		assert.strictEqual(data.get(2), undefined);

		await wait(0);

		assert.strictEqual(counter.get(1), 1);
		assert.strictEqual(data.get(1), '123');
		assert.strictEqual(counter.get(2), 1);
		assert.strictEqual(data.get(2), '4567');
	});

	test('stop', async () => {
		const terminalOnData = new Emitter<string>();

		bufferer.startBuffering(1, terminalOnData.event, 0);

		terminalOnData.fire('1');
		terminalOnData.fire('2');
		terminalOnData.fire('3');

		bufferer.stopBuffering(1);
		await wait(0);

		assert.strictEqual(counter.get(1), 1);
		assert.strictEqual(data.get(1), '123');
	});

	test('start 2 stop 1', async () => {
		const terminal1OnData = new Emitter<string>();
		const terminal2OnData = new Emitter<string>();

		bufferer.startBuffering(1, terminal1OnData.event, 0);
		store.add(bufferer.startBuffering(2, terminal2OnData.event, 0));

		terminal1OnData.fire('1');
		terminal2OnData.fire('4');
		terminal1OnData.fire('2');
		terminal2OnData.fire('5');
		terminal1OnData.fire('3');
		terminal2OnData.fire('6');
		terminal2OnData.fire('7');

		assert.strictEqual(counter.get(1), undefined);
		assert.strictEqual(data.get(1), undefined);
		assert.strictEqual(counter.get(2), undefined);
		assert.strictEqual(data.get(2), undefined);

		bufferer.stopBuffering(1);
		await wait(0);

		assert.strictEqual(counter.get(1), 1);
		assert.strictEqual(data.get(1), '123');
		assert.strictEqual(counter.get(2), 1);
		assert.strictEqual(data.get(2), '4567');
	});

	test('dispose should flush remaining data events', async () => {
		const terminal1OnData = new Emitter<string>();
		const terminal2OnData = new Emitter<string>();

		store.add(bufferer.startBuffering(1, terminal1OnData.event, 0));
		store.add(bufferer.startBuffering(2, terminal2OnData.event, 0));

		terminal1OnData.fire('1');
		terminal2OnData.fire('4');
		terminal1OnData.fire('2');
		terminal2OnData.fire('5');
		terminal1OnData.fire('3');
		terminal2OnData.fire('6');
		terminal2OnData.fire('7');

		assert.strictEqual(counter.get(1), undefined);
		assert.strictEqual(data.get(1), undefined);
		assert.strictEqual(counter.get(2), undefined);
		assert.strictEqual(data.get(2), undefined);

		bufferer.dispose();
		await wait(0);

		assert.strictEqual(counter.get(1), 1);
		assert.strictEqual(data.get(1), '123');
		assert.strictEqual(counter.get(2), 1);
		assert.strictEqual(data.get(2), '4567');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/common/terminalEnvironment.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/common/terminalEnvironment.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, strictEqual } from 'assert';
import { IStringDictionary } from '../../../../../base/common/collections.js';
import { isWindows, OperatingSystem } from '../../../../../base/common/platform.js';
import { URI as Uri } from '../../../../../base/common/uri.js';
import { addTerminalEnvironmentKeys, createTerminalEnvironment, getUriLabelForShell, getCwd, getLangEnvVariable, mergeEnvironments, preparePathForShell, shouldSetLangEnvVariable } from '../../common/terminalEnvironment.js';
import { GeneralShellType, PosixShellType, WindowsShellType } from '../../../../../platform/terminal/common/terminal.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const wslPathBackend = {
	getWslPath: async (original: string, direction: 'unix-to-win' | 'win-to-unix') => {
		if (direction === 'unix-to-win') {
			const match = original.match(/^\/mnt\/(?<drive>[a-zA-Z])\/(?<path>.+)$/);
			const groups = match?.groups;
			if (!groups) {
				return original;
			}
			return `${groups.drive}:\\${groups.path.replace(/\//g, '\\')}`;
		}
		const match = original.match(/(?<drive>[a-zA-Z]):\\(?<path>.+)/);
		const groups = match?.groups;
		if (!groups) {
			return original;
		}
		return `/mnt/${groups.drive.toLowerCase()}/${groups.path.replace(/\\/g, '/')}`;
	}
};

suite('Workbench - TerminalEnvironment', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('addTerminalEnvironmentKeys', () => {
		test('should set expected variables', () => {
			const env: { [key: string]: any } = {};
			addTerminalEnvironmentKeys(env, '1.2.3', 'en', 'on');
			strictEqual(env['TERM_PROGRAM'], 'vscode');
			strictEqual(env['TERM_PROGRAM_VERSION'], '1.2.3');
			strictEqual(env['COLORTERM'], 'truecolor');
			strictEqual(env['LANG'], 'en_US.UTF-8');
		});
		test('should use language variant for LANG that is provided in locale', () => {
			const env: { [key: string]: any } = {};
			addTerminalEnvironmentKeys(env, '1.2.3', 'en-au', 'on');
			strictEqual(env['LANG'], 'en_AU.UTF-8', 'LANG is equal to the requested locale with UTF-8');
		});
		test('should fallback to en_US when no locale is provided', () => {
			const env2: { [key: string]: any } = { FOO: 'bar' };
			addTerminalEnvironmentKeys(env2, '1.2.3', undefined, 'on');
			strictEqual(env2['LANG'], 'en_US.UTF-8', 'LANG is equal to en_US.UTF-8 as fallback.'); // More info on issue #14586
		});
		test('should fallback to en_US when an invalid locale is provided', () => {
			const env3 = { LANG: 'replace' };
			addTerminalEnvironmentKeys(env3, '1.2.3', undefined, 'on');
			strictEqual(env3['LANG'], 'en_US.UTF-8', 'LANG is set to the fallback LANG');
		});
		test('should override existing LANG', () => {
			const env4 = { LANG: 'en_AU.UTF-8' };
			addTerminalEnvironmentKeys(env4, '1.2.3', undefined, 'on');
			strictEqual(env4['LANG'], 'en_US.UTF-8', 'LANG is equal to the parent environment\'s LANG');
		});
	});

	suite('shouldSetLangEnvVariable', () => {
		test('auto', () => {
			strictEqual(shouldSetLangEnvVariable({}, 'auto'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US' }, 'auto'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf' }, 'auto'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf8' }, 'auto'), false);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.UTF-8' }, 'auto'), false);
		});
		test('off', () => {
			strictEqual(shouldSetLangEnvVariable({}, 'off'), false);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US' }, 'off'), false);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf' }, 'off'), false);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf8' }, 'off'), false);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.UTF-8' }, 'off'), false);
		});
		test('on', () => {
			strictEqual(shouldSetLangEnvVariable({}, 'on'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US' }, 'on'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf' }, 'on'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.utf8' }, 'on'), true);
			strictEqual(shouldSetLangEnvVariable({ LANG: 'en-US.UTF-8' }, 'on'), true);
		});
	});

	suite('getLangEnvVariable', () => {
		test('should fallback to en_US when no locale is provided', () => {
			strictEqual(getLangEnvVariable(undefined), 'en_US.UTF-8');
			strictEqual(getLangEnvVariable(''), 'en_US.UTF-8');
		});
		test('should fallback to default language variants when variant isn\'t provided', () => {
			strictEqual(getLangEnvVariable('af'), 'af_ZA.UTF-8');
			strictEqual(getLangEnvVariable('am'), 'am_ET.UTF-8');
			strictEqual(getLangEnvVariable('be'), 'be_BY.UTF-8');
			strictEqual(getLangEnvVariable('bg'), 'bg_BG.UTF-8');
			strictEqual(getLangEnvVariable('ca'), 'ca_ES.UTF-8');
			strictEqual(getLangEnvVariable('cs'), 'cs_CZ.UTF-8');
			strictEqual(getLangEnvVariable('da'), 'da_DK.UTF-8');
			strictEqual(getLangEnvVariable('de'), 'de_DE.UTF-8');
			strictEqual(getLangEnvVariable('el'), 'el_GR.UTF-8');
			strictEqual(getLangEnvVariable('en'), 'en_US.UTF-8');
			strictEqual(getLangEnvVariable('es'), 'es_ES.UTF-8');
			strictEqual(getLangEnvVariable('et'), 'et_EE.UTF-8');
			strictEqual(getLangEnvVariable('eu'), 'eu_ES.UTF-8');
			strictEqual(getLangEnvVariable('fi'), 'fi_FI.UTF-8');
			strictEqual(getLangEnvVariable('fr'), 'fr_FR.UTF-8');
			strictEqual(getLangEnvVariable('he'), 'he_IL.UTF-8');
			strictEqual(getLangEnvVariable('hr'), 'hr_HR.UTF-8');
			strictEqual(getLangEnvVariable('hu'), 'hu_HU.UTF-8');
			strictEqual(getLangEnvVariable('hy'), 'hy_AM.UTF-8');
			strictEqual(getLangEnvVariable('is'), 'is_IS.UTF-8');
			strictEqual(getLangEnvVariable('it'), 'it_IT.UTF-8');
			strictEqual(getLangEnvVariable('ja'), 'ja_JP.UTF-8');
			strictEqual(getLangEnvVariable('kk'), 'kk_KZ.UTF-8');
			strictEqual(getLangEnvVariable('ko'), 'ko_KR.UTF-8');
			strictEqual(getLangEnvVariable('lt'), 'lt_LT.UTF-8');
			strictEqual(getLangEnvVariable('nl'), 'nl_NL.UTF-8');
			strictEqual(getLangEnvVariable('no'), 'no_NO.UTF-8');
			strictEqual(getLangEnvVariable('pl'), 'pl_PL.UTF-8');
			strictEqual(getLangEnvVariable('pt'), 'pt_BR.UTF-8');
			strictEqual(getLangEnvVariable('ro'), 'ro_RO.UTF-8');
			strictEqual(getLangEnvVariable('ru'), 'ru_RU.UTF-8');
			strictEqual(getLangEnvVariable('sk'), 'sk_SK.UTF-8');
			strictEqual(getLangEnvVariable('sl'), 'sl_SI.UTF-8');
			strictEqual(getLangEnvVariable('sr'), 'sr_YU.UTF-8');
			strictEqual(getLangEnvVariable('sv'), 'sv_SE.UTF-8');
			strictEqual(getLangEnvVariable('tr'), 'tr_TR.UTF-8');
			strictEqual(getLangEnvVariable('uk'), 'uk_UA.UTF-8');
			strictEqual(getLangEnvVariable('zh'), 'zh_CN.UTF-8');
		});
		test('should set language variant based on full locale', () => {
			strictEqual(getLangEnvVariable('en-AU'), 'en_AU.UTF-8');
			strictEqual(getLangEnvVariable('en-au'), 'en_AU.UTF-8');
			strictEqual(getLangEnvVariable('fa-ke'), 'fa_KE.UTF-8');
		});
	});

	suite('mergeEnvironments', () => {
		test('should add keys', () => {
			const parent = {
				a: 'b'
			};
			const other = {
				c: 'd'
			};
			mergeEnvironments(parent, other);
			deepStrictEqual(parent, {
				a: 'b',
				c: 'd'
			});
		});

		(!isWindows ? test.skip : test)('should add keys ignoring case on Windows', () => {
			const parent = {
				a: 'b'
			};
			const other = {
				A: 'c'
			};
			mergeEnvironments(parent, other);
			deepStrictEqual(parent, {
				a: 'c'
			});
		});

		test('null values should delete keys from the parent env', () => {
			const parent = {
				a: 'b',
				c: 'd'
			};
			const other: IStringDictionary<string | null> = {
				a: null
			};
			mergeEnvironments(parent, other);
			deepStrictEqual(parent, {
				c: 'd'
			});
		});

		(!isWindows ? test.skip : test)('null values should delete keys from the parent env ignoring case on Windows', () => {
			const parent = {
				a: 'b',
				c: 'd'
			};
			const other: IStringDictionary<string | null> = {
				A: null
			};
			mergeEnvironments(parent, other);
			deepStrictEqual(parent, {
				c: 'd'
			});
		});
	});

	suite('getCwd', () => {
		// This helper checks the paths in a cross-platform friendly manner
		function assertPathsMatch(a: string, b: string): void {
			strictEqual(Uri.file(a).fsPath, Uri.file(b).fsPath);
		}

		test('should default to userHome for an empty workspace', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, undefined, undefined), '/userHome/');
		});

		test('should use to the workspace if it exists', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, Uri.file('/foo'), undefined), '/foo');
		});

		test('should use an absolute custom cwd as is', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, undefined, '/foo'), '/foo');
		});

		test('should normalize a relative custom cwd against the workspace path', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, Uri.file('/bar'), 'foo'), '/bar/foo');
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, Uri.file('/bar'), './foo'), '/bar/foo');
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, Uri.file('/bar'), '../foo'), '/foo');
		});

		test('should fall back for relative a custom cwd that doesn\'t have a workspace', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, undefined, 'foo'), '/userHome/');
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, undefined, './foo'), '/userHome/');
			assertPathsMatch(await getCwd({ executable: undefined, args: [] }, '/userHome/', undefined, undefined, '../foo'), '/userHome/');
		});

		test('should ignore custom cwd when told to ignore', async () => {
			assertPathsMatch(await getCwd({ executable: undefined, args: [], ignoreConfigurationCwd: true }, '/userHome/', undefined, Uri.file('/bar'), '/foo'), '/bar');
		});
	});

	suite('preparePathForShell', () => {
		suite('Windows frontend, Windows backend', () => {
			test('Command Prompt', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, true), `c:\\foo\\bar`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, true), `c:\\foo\\bar'baz`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, true), `"c:\\foo\\bar$(echo evil)baz"`);
			});
			test('PowerShell', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, true), `c:\\foo\\bar`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, true), `& 'c:\\foo\\bar''baz'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, true), `& 'c:\\foo\\bar$(echo evil)baz'`);
			});
			test('Git Bash', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, true), `'c:/foo/bar'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, true), `'c:/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, true), `'c:/foo/bar(echo evil)baz'`);
			});
			test('WSL', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'bash', 'bash', WindowsShellType.Wsl, wslPathBackend, OperatingSystem.Windows, true), '/mnt/c/foo/bar');
			});
		});
		suite('Windows frontend, Linux backend', () => {
			test('Bash', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar(echo evil)baz'`);
			});
			test('Zsh', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar(echo evil)baz'`);
			});
			test('Fish', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, true), `'/foo/bar(echo evil)baz'`);
			});
		});
		suite('Linux frontend, Windows backend', () => {
			test('Command Prompt', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, false), `c:\\foo\\bar`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, false), `c:\\foo\\bar'baz`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'cmd', 'cmd', WindowsShellType.CommandPrompt, wslPathBackend, OperatingSystem.Windows, false), `"c:\\foo\\bar$(echo evil)baz"`);
			});
			test('PowerShell', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, false), `c:\\foo\\bar`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, false), `& 'c:\\foo\\bar''baz'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'pwsh', 'pwsh', GeneralShellType.PowerShell, wslPathBackend, OperatingSystem.Windows, false), `& 'c:\\foo\\bar$(echo evil)baz'`);
			});
			test('Git Bash', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, false), `'c:/foo/bar'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar\'baz', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, false), `'c:/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('c:\\foo\\bar$(echo evil)baz', 'bash', 'bash', WindowsShellType.GitBash, wslPathBackend, OperatingSystem.Windows, false), `'c:/foo/bar(echo evil)baz'`);
			});
			test('WSL', async () => {
				strictEqual(await preparePathForShell('c:\\foo\\bar', 'bash', 'bash', WindowsShellType.Wsl, wslPathBackend, OperatingSystem.Windows, false), '/mnt/c/foo/bar');
			});
		});
		suite('Linux frontend, Linux backend', () => {
			test('Bash', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'bash', 'bash', PosixShellType.Bash, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar(echo evil)baz'`);
			});
			test('Zsh', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'zsh', 'zsh', PosixShellType.Zsh, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar(echo evil)baz'`);
			});
			test('Fish', async () => {
				strictEqual(await preparePathForShell('/foo/bar', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar'`);
				strictEqual(await preparePathForShell('/foo/bar\'baz', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar\\'baz'`);
				strictEqual(await preparePathForShell('/foo/bar$(echo evil)baz', 'fish', 'fish', PosixShellType.Fish, wslPathBackend, OperatingSystem.Linux, false), `'/foo/bar(echo evil)baz'`);
			});
		});
	});
	suite('createTerminalEnvironment', () => {
		const commonVariables = {
			COLORTERM: 'truecolor',
			TERM_PROGRAM: 'vscode'
		};
		test('should retain variables equal to the empty string', async () => {
			deepStrictEqual(
				await createTerminalEnvironment({}, undefined, undefined, undefined, 'off', { foo: 'bar', empty: '' }),
				{ foo: 'bar', empty: '', ...commonVariables }
			);
		});
	});
	suite('formatUriForShellDisplay', () => {
		test('Wsl', async () => {
			strictEqual(await getUriLabelForShell('c:\\foo\\bar', wslPathBackend, WindowsShellType.Wsl, OperatingSystem.Windows, true), '/mnt/c/foo/bar');
			strictEqual(await getUriLabelForShell('c:/foo/bar', wslPathBackend, WindowsShellType.Wsl, OperatingSystem.Windows, false), '/mnt/c/foo/bar');
		});
		test('GitBash', async () => {
			strictEqual(await getUriLabelForShell('c:\\foo\\bar', wslPathBackend, WindowsShellType.GitBash, OperatingSystem.Windows, true), '/c/foo/bar');
			strictEqual(await getUriLabelForShell('c:/foo/bar', wslPathBackend, WindowsShellType.GitBash, OperatingSystem.Windows, false), '/c/foo/bar');
		});
		suite('PowerShell', () => {
			test('Windows frontend', async () => {
				strictEqual(await getUriLabelForShell('c:\\foo\\bar', wslPathBackend, GeneralShellType.PowerShell, OperatingSystem.Windows, true), 'c:\\foo\\bar');
				strictEqual(await getUriLabelForShell('C:\\Foo\\Bar', wslPathBackend, GeneralShellType.PowerShell, OperatingSystem.Windows, true), 'C:\\Foo\\Bar');
			});
			test('Non-Windows frontend', async () => {
				strictEqual(await getUriLabelForShell('c:/foo/bar', wslPathBackend, GeneralShellType.PowerShell, OperatingSystem.Windows, false), 'c:\\foo\\bar');
				strictEqual(await getUriLabelForShell('C:/Foo/Bar', wslPathBackend, GeneralShellType.PowerShell, OperatingSystem.Windows, false), 'C:\\Foo\\Bar');
			});
		});
		suite('Bash', () => {
			test('Windows frontend', async () => {
				strictEqual(await getUriLabelForShell('\\foo\\bar', wslPathBackend, PosixShellType.Bash, OperatingSystem.Linux, true), '/foo/bar');
				strictEqual(await getUriLabelForShell('/foo/bar', wslPathBackend, PosixShellType.Bash, OperatingSystem.Linux, true), '/foo/bar');
			});
			test('Non-Windows frontend', async () => {
				strictEqual(await getUriLabelForShell('\\foo\\bar', wslPathBackend, PosixShellType.Bash, OperatingSystem.Linux, false), '\\foo\\bar');
				strictEqual(await getUriLabelForShell('/foo/bar', wslPathBackend, PosixShellType.Bash, OperatingSystem.Linux, false), '/foo/bar');
			});
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminal/test/node/terminalProfiles.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminal/test/node/terminalProfiles.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, fail, ok, strictEqual } from 'assert';
import { isWindows } from '../../../../../base/common/platform.js';
import { ITerminalProfile, ProfileSource } from '../../../../../platform/terminal/common/terminal.js';
import { ITerminalConfiguration, ITerminalProfiles } from '../../common/terminal.js';
import { detectAvailableProfiles, IFsProvider } from '../../../../../platform/terminal/node/terminalProfiles.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

/**
 * Assets that two profiles objects are equal, this will treat explicit undefined and unset
 * properties the same. Order of the profiles is ignored.
 */
function profilesEqual(actualProfiles: ITerminalProfile[], expectedProfiles: ITerminalProfile[]) {
	strictEqual(actualProfiles.length, expectedProfiles.length, `Actual: ${actualProfiles.map(e => e.profileName).join(',')}\nExpected: ${expectedProfiles.map(e => e.profileName).join(',')}`);
	for (const expected of expectedProfiles) {
		const actual = actualProfiles.find(e => e.profileName === expected.profileName);
		ok(actual, `Expected profile ${expected.profileName} not found`);
		strictEqual(actual.profileName, expected.profileName);
		strictEqual(actual.path, expected.path);
		deepStrictEqual(actual.args, expected.args);
		strictEqual(actual.isAutoDetected, expected.isAutoDetected);
		strictEqual(actual.overrideName, expected.overrideName);
	}
}

suite('Workbench - TerminalProfiles', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('detectAvailableProfiles', () => {
		if (isWindows) {
			test('should detect Git Bash and provide login args', async () => {
				const fsProvider = createFsProvider([
					'C:\\Program Files\\Git\\bin\\bash.exe'
				]);
				const config: ITestTerminalConfig = {
					profiles: {
						windows: {
							'Git Bash': { source: ProfileSource.GitBash }
						},
						linux: {},
						osx: {}
					},
					useWslProfiles: false
				};
				const configurationService = new TestConfigurationService({ terminal: { integrated: config } });
				const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, undefined);
				const expected = [
					{ profileName: 'Git Bash', path: 'C:\\Program Files\\Git\\bin\\bash.exe', args: ['--login', '-i'], isDefault: true }
				];
				profilesEqual(profiles, expected);
			});
			test('should allow source to have args', async () => {
				const pwshSourcePaths = [
					'C:\\Program Files\\PowerShell\\7\\pwsh.exe'
				];
				const fsProvider = createFsProvider(pwshSourcePaths);
				const config: ITestTerminalConfig = {
					profiles: {
						windows: {
							'PowerShell': { source: ProfileSource.Pwsh, args: ['-NoProfile'], overrideName: true }
						},
						linux: {},
						osx: {},
					},
					useWslProfiles: false
				};
				const configurationService = new TestConfigurationService({ terminal: { integrated: config } });
				const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, pwshSourcePaths);
				const expected = [
					{ profileName: 'PowerShell', path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe', overrideName: true, args: ['-NoProfile'], isDefault: true }
				];
				profilesEqual(profiles, expected);
			});
			test('configured args should override default source ones', async () => {
				const fsProvider = createFsProvider([
					'C:\\Program Files\\Git\\bin\\bash.exe'
				]);
				const config: ITestTerminalConfig = {
					profiles: {
						windows: {
							'Git Bash': { source: ProfileSource.GitBash, args: [] }
						},
						linux: {},
						osx: {}
					},
					useWslProfiles: false
				};
				const configurationService = new TestConfigurationService({ terminal: { integrated: config } });
				const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, undefined);
				const expected = [{ profileName: 'Git Bash', path: 'C:\\Program Files\\Git\\bin\\bash.exe', args: [], isAutoDetected: undefined, overrideName: undefined, isDefault: true }];
				profilesEqual(profiles, expected);
			});
			suite('pwsh source detection/fallback', () => {
				const pwshSourceConfig = ({
					profiles: {
						windows: {
							'PowerShell': { source: ProfileSource.Pwsh }
						},
						linux: {},
						osx: {},
					},
					useWslProfiles: false
				} as ITestTerminalConfig) as ITerminalConfiguration;

				test('should prefer pwsh 7 to Windows PowerShell', async () => {
					const pwshSourcePaths = [
						'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
						'C:\\Sysnative\\WindowsPowerShell\\v1.0\\powershell.exe',
						'C:\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
					];
					const fsProvider = createFsProvider(pwshSourcePaths);
					const configurationService = new TestConfigurationService({ terminal: { integrated: pwshSourceConfig } });
					const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, pwshSourcePaths);
					const expected = [
						{ profileName: 'PowerShell', path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe', isDefault: true }
					];
					profilesEqual(profiles, expected);
				});
				test('should prefer pwsh 7 to pwsh 6', async () => {
					const pwshSourcePaths = [
						'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
						'C:\\Program Files\\PowerShell\\6\\pwsh.exe',
						'C:\\Sysnative\\WindowsPowerShell\\v1.0\\powershell.exe',
						'C:\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
					];
					const fsProvider = createFsProvider(pwshSourcePaths);
					const configurationService = new TestConfigurationService({ terminal: { integrated: pwshSourceConfig } });
					const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, pwshSourcePaths);
					const expected = [
						{ profileName: 'PowerShell', path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe', isDefault: true }
					];
					profilesEqual(profiles, expected);
				});
				test('should fallback to Windows PowerShell', async () => {
					const pwshSourcePaths = [
						'C:\\Windows\\Sysnative\\WindowsPowerShell\\v1.0\\powershell.exe',
						'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
					];
					const fsProvider = createFsProvider(pwshSourcePaths);
					const configurationService = new TestConfigurationService({ terminal: { integrated: pwshSourceConfig } });
					const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, pwshSourcePaths);
					strictEqual(profiles.length, 1);
					strictEqual(profiles[0].profileName, 'PowerShell');
				});
			});
		} else {
			const absoluteConfig = ({
				profiles: {
					windows: {},
					osx: {
						'fakeshell1': { path: '/bin/fakeshell1' },
						'fakeshell2': { path: '/bin/fakeshell2' },
						'fakeshell3': { path: '/bin/fakeshell3' }
					},
					linux: {
						'fakeshell1': { path: '/bin/fakeshell1' },
						'fakeshell2': { path: '/bin/fakeshell2' },
						'fakeshell3': { path: '/bin/fakeshell3' }
					}
				},
				useWslProfiles: false
			} as ITestTerminalConfig) as ITerminalConfiguration;
			const onPathConfig = ({
				profiles: {
					windows: {},
					osx: {
						'fakeshell1': { path: 'fakeshell1' },
						'fakeshell2': { path: 'fakeshell2' },
						'fakeshell3': { path: 'fakeshell3' }
					},
					linux: {
						'fakeshell1': { path: 'fakeshell1' },
						'fakeshell2': { path: 'fakeshell2' },
						'fakeshell3': { path: 'fakeshell3' }
					}
				},
				useWslProfiles: false
			} as ITestTerminalConfig) as ITerminalConfiguration;

			test('should detect shells via absolute paths', async () => {
				const fsProvider = createFsProvider([
					'/bin/fakeshell1',
					'/bin/fakeshell3'
				]);
				const configurationService = new TestConfigurationService({ terminal: { integrated: absoluteConfig } });
				const profiles = await detectAvailableProfiles(undefined, undefined, false, configurationService, process.env, fsProvider, undefined, undefined, undefined);
				const expected: ITerminalProfile[] = [
					{ profileName: 'fakeshell1', path: '/bin/fakeshell1', isDefault: true },
					{ profileName: 'fakeshell3', path: '/bin/fakeshell3', isDefault: true }
				];
				profilesEqual(profiles, expected);
			});
			test('should auto detect shells via /etc/shells', async () => {
				const fsProvider = createFsProvider([
					'/bin/fakeshell1',
					'/bin/fakeshell3'
				], '/bin/fakeshell1\n/bin/fakeshell3');
				const configurationService = new TestConfigurationService({ terminal: { integrated: onPathConfig } });
				const profiles = await detectAvailableProfiles(undefined, undefined, true, configurationService, process.env, fsProvider, undefined, undefined, undefined);
				const expected: ITerminalProfile[] = [
					{ profileName: 'fakeshell1', path: '/bin/fakeshell1', isFromPath: true, isDefault: true },
					{ profileName: 'fakeshell3', path: '/bin/fakeshell3', isFromPath: true, isDefault: true }
				];
				profilesEqual(profiles, expected);
			});
			test('should validate auto detected shells from /etc/shells exist', async () => {
				// fakeshell3 exists in /etc/shells but not on FS
				const fsProvider = createFsProvider([
					'/bin/fakeshell1'
				], '/bin/fakeshell1\n/bin/fakeshell3');
				const configurationService = new TestConfigurationService({ terminal: { integrated: onPathConfig } });
				const profiles = await detectAvailableProfiles(undefined, undefined, true, configurationService, process.env, fsProvider, undefined, undefined, undefined);
				const expected: ITerminalProfile[] = [
					{ profileName: 'fakeshell1', path: '/bin/fakeshell1', isFromPath: true, isDefault: true }
				];
				profilesEqual(profiles, expected);
			});
		}
	});

	function createFsProvider(expectedPaths: string[], etcShellsContent: string = ''): IFsProvider {
		const provider = {
			async existsFile(path: string): Promise<boolean> {
				return expectedPaths.includes(path);
			},
			async readFile(path: string): Promise<Buffer> {
				if (path !== '/etc/shells') {
					fail('Unexepected path');
				}
				return Buffer.from(etcShellsContent);
			}
		};
		return provider;
	}
});

export interface ITestTerminalConfig {
	profiles: ITerminalProfiles;
	useWslProfiles: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/README.md]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/README.md

```markdown
_Terminal contribs_ are a way of splitting out standalone terminal features into their own components that build upon the main terminal code. The `terminalContrib/` folder can only import from `terminal/`, not the other way around. There are eslint rules to prevent this circular dependencies.

Having the entire feature and its tests in the same place makes not only the contrib easier to maintain and understand, but also the core terminal code as it's less interspersed with feature code. Sometimes it's not possible without bigger changes to make the feature totally standalone, in this case the goal is to get as close as possible.

This should not be confused with the similar `ITerminalContribution` which is a parallel to `IEditorContribution` and is used for decorating each individual terminal with additional functionality. An entry in `terminalContrib/` may use `ITerminalContribution`s to add its features.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/browser/bufferContentTracker.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/browser/bufferContentTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ITerminalLogService, TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { IXtermTerminal } from '../../../terminal/browser/terminal.js';
import type { IMarker, Terminal } from '@xterm/xterm';

export class BufferContentTracker extends Disposable {
	/**
	 * Marks the last part of the buffer that was cached
	 */
	private _lastCachedMarker: IMarker | undefined;
	/**
	 * The number of wrapped lines in the viewport when the last cached marker was set
	 */
	private _priorEditorViewportLineCount: number = 0;

	private _lines: string[] = [];
	get lines(): string[] { return this._lines; }

	bufferToEditorLineMapping: Map<number, number> = new Map();

	constructor(
		private readonly _xterm: Pick<IXtermTerminal, 'getFont'> & { raw: Terminal },
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService,
	) {
		super();
	}

	reset(): void {
		this._lines = [];
		this._lastCachedMarker = undefined;
		this.update();
	}

	update(): void {
		if (this._lastCachedMarker?.isDisposed) {
			// the terminal was cleared, reset the cache
			this._lines = [];
			this._lastCachedMarker = undefined;
		}
		this._removeViewportContent();
		this._updateCachedContent();
		this._updateViewportContent();
		this._lastCachedMarker = this._register(this._xterm.raw.registerMarker());
		this._logService.debug('Buffer content tracker: set ', this._lines.length, ' lines');
	}

	private _updateCachedContent(): void {
		const buffer = this._xterm.raw.buffer.active;
		const start = this._lastCachedMarker?.line ? this._lastCachedMarker.line - this._xterm.raw.rows + 1 : 0;
		const end = buffer.baseY;
		if (start < 0 || start > end) {
			// in the viewport, no need to cache
			return;
		}

		// to keep the cache size down, remove any lines that are no longer in the scrollback
		const scrollback: number = this._configurationService.getValue(TerminalSettingId.Scrollback);
		const maxBufferSize = scrollback + this._xterm.raw.rows - 1;
		const linesToAdd = end - start;
		if (linesToAdd + this._lines.length > maxBufferSize) {
			const numToRemove = linesToAdd + this._lines.length - maxBufferSize;
			for (let i = 0; i < numToRemove; i++) {
				this._lines.shift();
			}
			this._logService.debug('Buffer content tracker: removed ', numToRemove, ' lines from top of cached lines, now ', this._lines.length, ' lines');
		}

		// iterate through the buffer lines and add them to the editor line cache
		const cachedLines = [];
		let currentLine: string = '';
		for (let i = start; i < end; i++) {
			const line = buffer.getLine(i);
			if (!line) {
				continue;
			}
			this.bufferToEditorLineMapping.set(i, this._lines.length + cachedLines.length);
			const isWrapped = buffer.getLine(i + 1)?.isWrapped;
			currentLine += line.translateToString(!isWrapped);
			if (currentLine && !isWrapped || i === (buffer.baseY + this._xterm.raw.rows - 1)) {
				if (line.length) {
					cachedLines.push(currentLine);
					currentLine = '';
				}
			}
		}
		this._logService.debug('Buffer content tracker:', cachedLines.length, ' lines cached');
		this._lines.push(...cachedLines);
	}

	private _removeViewportContent(): void {
		if (!this._lines.length) {
			return;
		}
		// remove previous viewport content in case it has changed
		let linesToRemove = this._priorEditorViewportLineCount;
		let index = 1;
		while (linesToRemove) {
			this.bufferToEditorLineMapping.forEach((value, key) => { if (value === this._lines.length - index) { this.bufferToEditorLineMapping.delete(key); } });
			this._lines.pop();
			index++;
			linesToRemove--;
		}
		this._logService.debug('Buffer content tracker: removed lines from viewport, now ', this._lines.length, ' lines cached');
	}

	private _updateViewportContent(): void {
		const buffer = this._xterm.raw.buffer.active;
		this._priorEditorViewportLineCount = 0;
		let currentLine: string = '';
		for (let i = buffer.baseY; i < buffer.baseY + this._xterm.raw.rows; i++) {
			const line = buffer.getLine(i);
			if (!line) {
				continue;
			}
			this.bufferToEditorLineMapping.set(i, this._lines.length);
			const isWrapped = buffer.getLine(i + 1)?.isWrapped;
			currentLine += line.translateToString(!isWrapped);
			if (currentLine && !isWrapped || i === (buffer.baseY + this._xterm.raw.rows - 1)) {
				if (currentLine.length) {
					this._priorEditorViewportLineCount++;
					this._lines.push(currentLine);
					currentLine = '';
				}
			}
		}
		this._logService.debug('Viewport content update complete, ', this._lines.length, ' lines in the viewport');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminal.accessibility.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminal.accessibility.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Terminal } from '@xterm/xterm';
import { Event } from '../../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { localize2 } from '../../../../../nls.js';
import { AccessibleViewProviderId, IAccessibleViewService, NavigationType } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../platform/accessibility/common/accessibility.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { Action2, registerAction2 } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITerminalCommand, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ICurrentPartialCommand, isFullTerminalCommand } from '../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import { TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';
import { accessibleViewCurrentProviderId, accessibleViewIsShown } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityHelpAction, AccessibleViewAction } from '../../../accessibility/browser/accessibleViewActions.js';
import { ITerminalContribution, ITerminalInstance, ITerminalService, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalContextKeys } from '../../../terminal/common/terminalContextKey.js';
import { TerminalAccessibilityCommandId } from '../common/terminal.accessibility.js';
import { TerminalAccessibilitySettingId } from '../common/terminalAccessibilityConfiguration.js';
import { BufferContentTracker } from './bufferContentTracker.js';
import { TerminalAccessibilityHelpProvider } from './terminalAccessibilityHelp.js';
import { ICommandWithEditorLine, TerminalAccessibleBufferProvider } from './terminalAccessibleBufferProvider.js';
import { TextAreaSyncAddon } from './textAreaSyncAddon.js';
import { alert } from '../../../../../base/browser/ui/aria/aria.js';

// #region Terminal Contributions

class TextAreaSyncContribution extends DisposableStore implements ITerminalContribution {
	static readonly ID = 'terminal.textAreaSync';
	static get(instance: ITerminalInstance): TextAreaSyncContribution | null {
		return instance.getContribution<TextAreaSyncContribution>(TextAreaSyncContribution.ID);
	}
	private _addon: TextAreaSyncAddon | undefined;
	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();
	}
	layout(xterm: IXtermTerminal & { raw: Terminal }): void {
		if (this._addon) {
			return;
		}
		this._addon = this.add(this._instantiationService.createInstance(TextAreaSyncAddon, this._ctx.instance.capabilities));
		xterm.raw.loadAddon(this._addon);
		this._addon.activate(xterm.raw);
	}
}
registerTerminalContribution(TextAreaSyncContribution.ID, TextAreaSyncContribution);

export class TerminalAccessibleViewContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.accessibleBufferProvider';
	static get(instance: ITerminalInstance): TerminalAccessibleViewContribution | null {
		return instance.getContribution<TerminalAccessibleViewContribution>(TerminalAccessibleViewContribution.ID);
	}
	private _bufferTracker: BufferContentTracker | undefined;
	private _bufferProvider: TerminalAccessibleBufferProvider | undefined;
	private _xterm: Pick<IXtermTerminal, 'shellIntegration' | 'getFont'> & { raw: Terminal } | undefined;
	private readonly _onDidRunCommand = this._register(new MutableDisposable());

	constructor(
		private readonly _ctx: ITerminalContributionContext,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();
		this._register(AccessibleViewAction.addImplementation(90, 'terminal', () => {
			if (this._terminalService.activeInstance !== this._ctx.instance) {
				return false;
			}
			this.show();
			return true;
		}, TerminalContextKeys.focus));
		this._register(this._ctx.instance.onDidExecuteText(() => {
			const focusAfterRun = _configurationService.getValue(TerminalSettingId.FocusAfterRun);
			if (focusAfterRun === 'terminal') {
				this._ctx.instance.focus(true);
			} else if (focusAfterRun === 'accessible-buffer') {
				this.show();
			}
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalAccessibilitySettingId.AccessibleViewFocusOnCommandExecution)) {
				this._updateCommandExecutedListener();
			}
		}));
		this._register(this._ctx.instance.capabilities.onDidAddCapability(e => {
			if (e.capability.type === TerminalCapability.CommandDetection) {
				this._updateCommandExecutedListener();
			}
		}));
	}

	xtermReady(xterm: IXtermTerminal & { raw: Terminal }): void {
		const addon = this._instantiationService.createInstance(TextAreaSyncAddon, this._ctx.instance.capabilities);
		xterm.raw.loadAddon(addon);
		addon.activate(xterm.raw);
		this._xterm = xterm;
		this._register(this._xterm.raw.onWriteParsed(async () => {
			if (this._terminalService.activeInstance !== this._ctx.instance) {
				return;
			}
			if (this._isTerminalAccessibleViewOpen() && this._xterm!.raw.buffer.active.baseY === 0) {
				this.show();
			}
		}));

		const onRequestUpdateEditor = Event.latch(this._xterm.raw.onScroll);
		this._register(onRequestUpdateEditor(() => {
			if (this._terminalService.activeInstance !== this._ctx.instance) {
				return;
			}
			if (this._isTerminalAccessibleViewOpen()) {
				this.show();
			}
		}));
	}

	private _updateCommandExecutedListener(): void {
		if (!this._ctx.instance.capabilities.has(TerminalCapability.CommandDetection)) {
			return;
		}
		if (!this._configurationService.getValue(TerminalAccessibilitySettingId.AccessibleViewFocusOnCommandExecution)) {
			this._onDidRunCommand.clear();
			return;
		} else if (this._onDidRunCommand.value) {
			return;
		}

		const capability = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection)!;
		this._onDidRunCommand.value = capability.onCommandExecuted(() => {
			if (this._ctx.instance.hasFocus) {
				this.show();
			}
		});
	}

	private _isTerminalAccessibleViewOpen(): boolean {
		return accessibleViewCurrentProviderId.getValue(this._contextKeyService) === AccessibleViewProviderId.Terminal;
	}

	show(): void {
		if (!this._xterm) {
			return;
		}
		if (!this._bufferTracker) {
			this._bufferTracker = this._register(this._instantiationService.createInstance(BufferContentTracker, this._xterm));
		}
		if (!this._bufferProvider) {
			this._bufferProvider = this._register(this._instantiationService.createInstance(TerminalAccessibleBufferProvider, this._ctx.instance, this._bufferTracker, () => {
				return this._register(this._instantiationService.createInstance(TerminalAccessibilityHelpProvider, this._ctx.instance, this._xterm!)).provideContent();
			}));
		}
		const position = this._configurationService.getValue(TerminalAccessibilitySettingId.AccessibleViewPreserveCursorPosition) ? this._accessibleViewService.getPosition(AccessibleViewProviderId.Terminal) : undefined;
		this._accessibleViewService.show(this._bufferProvider, position);
	}
	navigateToCommand(type: NavigationType): void {
		const currentLine = this._accessibleViewService.getPosition(AccessibleViewProviderId.Terminal)?.lineNumber;
		const commands = this._getCommandsWithEditorLine();
		if (!commands?.length || !currentLine) {
			return;
		}

		const filteredCommands = type === NavigationType.Previous ? commands.filter(c => c.lineNumber < currentLine).sort((a, b) => b.lineNumber - a.lineNumber) : commands.filter(c => c.lineNumber > currentLine).sort((a, b) => a.lineNumber - b.lineNumber);
		if (!filteredCommands.length) {
			return;
		}
		const command = filteredCommands[0];
		const commandLine = command.command.command;
		if (!isWindows && commandLine) {
			this._accessibleViewService.setPosition(new Position(command.lineNumber, 1), true);
			alert(commandLine);
		} else {
			this._accessibleViewService.setPosition(new Position(command.lineNumber, 1), true, true);
		}

		if (command.exitCode) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandFailed);
		} else {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.terminalCommandSucceeded);
		}
	}

	private _getCommandsWithEditorLine(): ICommandWithEditorLine[] | undefined {
		const capability = this._ctx.instance.capabilities.get(TerminalCapability.CommandDetection);
		const commands = capability?.commands;
		const currentCommand = capability?.currentCommand;
		if (!commands?.length) {
			return;
		}
		const result: ICommandWithEditorLine[] = [];
		for (const command of commands) {
			const lineNumber = this._getEditorLineForCommand(command);
			if (!lineNumber) {
				continue;
			}
			result.push({ command, lineNumber, exitCode: command.exitCode });
		}
		if (currentCommand) {
			const lineNumber = this._getEditorLineForCommand(currentCommand);
			if (!!lineNumber) {
				result.push({ command: currentCommand, lineNumber });
			}
		}
		return result;
	}

	private _getEditorLineForCommand(command: ITerminalCommand | ICurrentPartialCommand): number | undefined {
		if (!this._bufferTracker) {
			return;
		}
		let line: number | undefined;
		if (isFullTerminalCommand(command)) {
			line = command.marker?.line;
		} else {
			line = command.commandStartMarker?.line;
		}
		if (line === undefined || line < 0) {
			return;
		}
		line = this._bufferTracker.bufferToEditorLineMapping.get(line);
		if (line === undefined) {
			return;
		}
		return line + 1;
	}

}
registerTerminalContribution(TerminalAccessibleViewContribution.ID, TerminalAccessibleViewContribution);

export class TerminalAccessibilityHelpContribution extends Disposable {
	static ID: 'terminalAccessibilityHelpContribution';
	constructor() {
		super();

		this._register(AccessibilityHelpAction.addImplementation(105, 'terminal', async accessor => {
			const instantiationService = accessor.get(IInstantiationService);
			const terminalService = accessor.get(ITerminalService);
			const accessibleViewService = accessor.get(IAccessibleViewService);
			const instance = await terminalService.getActiveOrCreateInstance();
			await terminalService.revealActiveTerminal();
			const terminal = instance?.xterm;
			if (!terminal) {
				return;
			}
			accessibleViewService.show(instantiationService.createInstance(TerminalAccessibilityHelpProvider, instance, terminal));
		}, ContextKeyExpr.or(TerminalContextKeys.focus, ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal)))));
	}
}
registerTerminalContribution(TerminalAccessibilityHelpContribution.ID, TerminalAccessibilityHelpContribution);

// #endregion

// #region Actions

class FocusAccessibleBufferAction extends Action2 {
	constructor() {
		super({
			id: TerminalAccessibilityCommandId.FocusAccessibleBuffer,
			title: localize2('workbench.action.terminal.focusAccessibleBuffer', "Focus Accessible Terminal View"),
			precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated),
			keybinding: [
				{
					primary: KeyMod.Alt | KeyCode.F2,
					secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow],
					linux: {
						primary: KeyMod.Alt | KeyCode.F2 | KeyMod.Shift,
						secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow]
					},
					weight: KeybindingWeight.WorkbenchContrib,
					when: ContextKeyExpr.and(CONTEXT_ACCESSIBILITY_MODE_ENABLED, TerminalContextKeys.focus)
				}
			]
		});
	}
	override async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const terminalService = accessor.get(ITerminalService);
		const terminal = await terminalService.getActiveOrCreateInstance();
		if (!terminal?.xterm) {
			return;
		}
		TerminalAccessibleViewContribution.get(terminal)?.show();
	}
}
registerAction2(FocusAccessibleBufferAction);

registerTerminalAction({
	id: TerminalAccessibilityCommandId.AccessibleBufferGoToNextCommand,
	title: localize2('workbench.action.terminal.accessibleBufferGoToNextCommand', "Accessible Buffer Go to Next Command"),
	precondition: ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated, ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
	keybinding: [
		{
			primary: KeyMod.Alt | KeyCode.DownArrow,
			when: ContextKeyExpr.and(ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
			weight: KeybindingWeight.WorkbenchContrib + 2
		}
	],
	run: async (c) => {
		const instance = c.service.activeInstance;
		if (!instance) {
			return;
		}
		TerminalAccessibleViewContribution.get(instance)?.navigateToCommand(NavigationType.Next);
	}
});

registerTerminalAction({
	id: TerminalAccessibilityCommandId.AccessibleBufferGoToPreviousCommand,
	title: localize2('workbench.action.terminal.accessibleBufferGoToPreviousCommand', "Accessible Buffer Go to Previous Command"),
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
	keybinding: [
		{
			primary: KeyMod.Alt | KeyCode.UpArrow,
			when: ContextKeyExpr.and(ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
			weight: KeybindingWeight.WorkbenchContrib + 2
		}
	],
	run: async (c) => {
		const instance = c.service.activeInstance;
		if (!instance) {
			return;
		}
		TerminalAccessibleViewContribution.get(instance)?.navigateToCommand(NavigationType.Previous);
	}
});

registerTerminalAction({
	id: TerminalAccessibilityCommandId.ScrollToBottomAccessibleView,
	title: localize2('workbench.action.terminal.scrollToBottomAccessibleView', 'Scroll to Accessible View Bottom'),
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.End,
		linux: { primary: KeyMod.Shift | KeyCode.End },
		when: accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Terminal),
		weight: KeybindingWeight.WorkbenchContrib
	},
	run: (c, accessor) => {
		const accessibleViewService = accessor.get(IAccessibleViewService);
		const lastPosition = accessibleViewService.getLastPosition();
		if (!lastPosition) {
			return;
		}
		accessibleViewService.setPosition(lastPosition, true);
	}
});

registerTerminalAction({
	id: TerminalAccessibilityCommandId.ScrollToTopAccessibleView,
	title: localize2('workbench.action.terminal.scrollToTopAccessibleView', 'Scroll to Accessible View Top'),
	precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.Terminal))),
	keybinding: {
		primary: KeyMod.CtrlCmd | KeyCode.Home,
		linux: { primary: KeyMod.Shift | KeyCode.Home },
		when: accessibleViewCurrentProviderId.isEqualTo(AccessibleViewProviderId.Terminal),
		weight: KeybindingWeight.WorkbenchContrib
	},
	run: (c, accessor) => accessor.get(IAccessibleViewService)?.setPosition(new Position(1, 1), true)
});

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminalAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminalAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ShellIntegrationStatus, TerminalSettingId, WindowsShellType } from '../../../../../platform/terminal/common/terminal.js';
import { AccessibilityCommandId } from '../../../accessibility/common/accessibilityCommands.js';
import { ITerminalInstance, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { TerminalCommandId } from '../../../terminal/common/terminal.js';
import type { Terminal } from '@xterm/xterm';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalAccessibilitySettingId } from '../common/terminalAccessibilityConfiguration.js';
import { TerminalAccessibilityCommandId } from '../common/terminal.accessibility.js';
import { TerminalLinksCommandId } from '../../links/common/terminal.links.js';
import { IAccessibleViewContentProvider, AccessibleViewProviderId, IAccessibleViewOptions, AccessibleViewType } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { accessibleViewIsShown, accessibleViewCurrentProviderId, AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { TerminalHistoryCommandId } from '../../history/common/terminal.history.js';
import { TerminalSuggestCommandId } from '../../suggest/common/terminal.suggest.js';
import { TerminalSuggestSettingId } from '../../suggest/common/terminalSuggestConfiguration.js';

export const enum ClassName {
	Active = 'active',
	EditorTextArea = 'textarea'
}

export class TerminalAccessibilityHelpProvider extends Disposable implements IAccessibleViewContentProvider {
	id = AccessibleViewProviderId.TerminalHelp;
	private readonly _hasShellIntegration: boolean = false;
	onClose() {
		const expr = ContextKeyExpr.and(accessibleViewIsShown, ContextKeyExpr.equals(accessibleViewCurrentProviderId.key, AccessibleViewProviderId.TerminalHelp));
		if (expr?.evaluate(this._contextKeyService.getContext(null))) {
			this._commandService.executeCommand(TerminalAccessibilityCommandId.FocusAccessibleBuffer);
		} else {
			this._instance.focus();
		}
		this.dispose();
	}
	options: IAccessibleViewOptions = {
		type: AccessibleViewType.Help,
		readMoreUrl: 'https://code.visualstudio.com/docs/editor/accessibility#_terminal-accessibility'
	};
	verbositySettingKey = AccessibilityVerbositySettingId.Terminal;

	constructor(
		private readonly _instance: Pick<ITerminalInstance, 'shellType' | 'capabilities' | 'onDidRequestFocus' | 'resource' | 'focus'>,
		_xterm: Pick<IXtermTerminal, 'getFont' | 'shellIntegration'> & { raw: Terminal },
		@ICommandService private readonly _commandService: ICommandService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this._hasShellIntegration = _xterm.shellIntegration.status === ShellIntegrationStatus.VSCode;
	}
	provideContent(): string {
		const content = [
			localize('focusAccessibleTerminalView', 'The Focus Accessible Terminal View command<keybinding:{0}> enables screen readers to read terminal contents.', TerminalAccessibilityCommandId.FocusAccessibleBuffer),
			localize('preserveCursor', 'Customize the behavior of the cursor when toggling between the terminal and accessible view with `terminal.integrated.accessibleViewPreserveCursorPosition.`'),
			localize('openDetectedLink', 'The Open Detected Link command<keybinding:{0}> enables screen readers to easily open links found in the terminal.', TerminalLinksCommandId.OpenDetectedLink),
			localize('newWithProfile', 'The Create New Terminal (With Profile) command<keybinding:{0}> allows for easy terminal creation using a specific profile.', TerminalCommandId.NewWithProfile),
			localize('focusAfterRun', 'Configure what gets focused after running selected text in the terminal with `{0}`.', TerminalSettingId.FocusAfterRun),
		];

		if (!this._configurationService.getValue(TerminalAccessibilitySettingId.AccessibleViewFocusOnCommandExecution)) {
			content.push(localize('focusViewOnExecution', 'Enable `terminal.integrated.accessibleViewFocusOnCommandExecution` to automatically focus the terminal accessible view when a command is executed in the terminal.'));
		}

		if (this._configurationService.getValue(TerminalSuggestSettingId.Enabled)) {
			content.push(localize('suggestTrigger', 'The terminal request completions command can be invoked manually<keybinding:{0}>, but also appears while typing.', TerminalSuggestCommandId.TriggerSuggest));
			content.push(localize('suggest', 'When the terminal suggest widget is focused:'));
			content.push(localize('suggestCommands', '- Accept the suggestion<keybinding:{0}> and configure suggest settings<keybinding:{1}>.', TerminalSuggestCommandId.AcceptSelectedSuggestion, TerminalSuggestCommandId.ConfigureSettings));
			content.push(localize('suggestCommandsMore', '- Toggle between the widget and terminal<keybinding:{0}> and toggle details focus<keybinding:{1}> to learn more about the suggestion.', TerminalSuggestCommandId.ToggleDetails, TerminalSuggestCommandId.ToggleDetailsFocus));
			content.push(localize('suggestLearnMore', '- Learn more about the suggestion<keybinding:{0}>.', TerminalSuggestCommandId.LearnMore));
			content.push(localize('suggestConfigure', '-Configure suggest settings<keybinding:{0}> ', TerminalSuggestCommandId.ConfigureSettings));
		}

		if (this._instance.shellType === WindowsShellType.CommandPrompt) {
			content.push(localize('commandPromptMigration', "Consider using powershell instead of command prompt for an improved experience"));
		}

		if (this._hasShellIntegration) {
			content.push(localize('shellIntegration', "The terminal has a feature called shell integration that offers an enhanced experience and provides useful commands for screen readers such as:"));
			content.push('- ' + localize('goToNextCommand', 'Go to Next Command<keybinding:{0}> in the accessible view', TerminalAccessibilityCommandId.AccessibleBufferGoToNextCommand));
			content.push('- ' + localize('goToPreviousCommand', 'Go to Previous Command<keybinding:{0}> in the accessible view', TerminalAccessibilityCommandId.AccessibleBufferGoToPreviousCommand));
			content.push('- ' + localize('goToSymbol', 'Go to Symbol<keybinding:{0}>', AccessibilityCommandId.GoToSymbol));
			content.push('- ' + localize('runRecentCommand', 'Run Recent Command<keybinding:{0}>', TerminalHistoryCommandId.RunRecentCommand));
			content.push('- ' + localize('goToRecentDirectory', 'Go to Recent Directory<keybinding:{0}>', TerminalHistoryCommandId.GoToRecentDirectory));
		} else {
			content.push(localize('noShellIntegration', 'Shell integration is not enabled. Some accessibility features may not be available.'));
		}

		return content.join('\n');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminalAccessibleBufferProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/browser/terminalAccessibleBufferProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../../base/common/event.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IAccessibleViewContentProvider, AccessibleViewProviderId, IAccessibleViewOptions, AccessibleViewType, IAccessibleViewSymbol } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TerminalCapability, ITerminalCommand } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ICurrentPartialCommand, isFullTerminalCommand } from '../../../../../platform/terminal/common/capabilities/commandDetection/terminalCommand.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { ITerminalInstance, ITerminalService } from '../../../terminal/browser/terminal.js';
import { BufferContentTracker } from './bufferContentTracker.js';
import { TerminalAccessibilitySettingId } from '../common/terminalAccessibilityConfiguration.js';

export class TerminalAccessibleBufferProvider extends Disposable implements IAccessibleViewContentProvider {
	readonly id = AccessibleViewProviderId.Terminal;
	readonly options: IAccessibleViewOptions = { type: AccessibleViewType.View, language: 'terminal', id: AccessibleViewProviderId.Terminal };
	readonly verbositySettingKey = AccessibilityVerbositySettingId.Terminal;

	private _focusedInstance: ITerminalInstance | undefined;

	private readonly _onDidRequestClearProvider = new Emitter<AccessibleViewProviderId>();
	readonly onDidRequestClearLastProvider = this._onDidRequestClearProvider.event;

	constructor(
		private readonly _instance: Pick<ITerminalInstance, 'onDidExecuteText' | 'focus' | 'shellType' | 'capabilities' | 'onDidRequestFocus' | 'resource' | 'onDisposed'>,
		private _bufferTracker: BufferContentTracker,
		customHelp: () => string,
		@IConfigurationService configurationService: IConfigurationService,
		@ITerminalService terminalService: ITerminalService,
	) {
		super();
		this.options.customHelp = customHelp;
		this.options.position = configurationService.getValue(TerminalAccessibilitySettingId.AccessibleViewPreserveCursorPosition) ? 'initial-bottom' : 'bottom';
		this._register(this._instance.onDisposed(() => this._onDidRequestClearProvider.fire(AccessibleViewProviderId.Terminal)));
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalAccessibilitySettingId.AccessibleViewPreserveCursorPosition)) {
				this.options.position = configurationService.getValue(TerminalAccessibilitySettingId.AccessibleViewPreserveCursorPosition) ? 'initial-bottom' : 'bottom';
			}
		}));
		this._focusedInstance = terminalService.activeInstance;
		this._register(terminalService.onDidChangeActiveInstance(() => {
			if (terminalService.activeInstance && this._focusedInstance?.instanceId !== terminalService.activeInstance?.instanceId) {
				this._onDidRequestClearProvider.fire(AccessibleViewProviderId.Terminal);
				this._focusedInstance = terminalService.activeInstance;
			}
		}));
	}

	onClose() {
		this._instance.focus();
	}

	provideContent(): string {
		this._bufferTracker.update();
		return this._bufferTracker.lines.join('\n');
	}

	getSymbols(): IAccessibleViewSymbol[] {
		const commands = this._getCommandsWithEditorLine() ?? [];
		const symbols: IAccessibleViewSymbol[] = [];
		for (const command of commands) {
			const label = command.command.command;
			if (label) {
				symbols.push({
					label,
					lineNumber: command.lineNumber
				});
			}
		}
		return symbols;
	}

	private _getCommandsWithEditorLine(): ICommandWithEditorLine[] | undefined {
		const capability = this._instance.capabilities.get(TerminalCapability.CommandDetection);
		const commands = capability?.commands;
		const currentCommand = capability?.currentCommand;
		if (!commands?.length) {
			return;
		}
		const result: ICommandWithEditorLine[] = [];
		for (const command of commands) {
			const lineNumber = this._getEditorLineForCommand(command);
			if (lineNumber === undefined) {
				continue;
			}
			result.push({ command, lineNumber, exitCode: command.exitCode });
		}
		if (currentCommand) {
			const lineNumber = this._getEditorLineForCommand(currentCommand);
			if (lineNumber !== undefined) {
				result.push({ command: currentCommand, lineNumber });
			}
		}
		return result;
	}
	private _getEditorLineForCommand(command: ITerminalCommand | ICurrentPartialCommand): number | undefined {
		let line: number | undefined;
		if (isFullTerminalCommand(command)) {
			line = command.marker?.line;
		} else {
			line = command.commandStartMarker?.line;
		}
		if (line === undefined || line < 0) {
			return;
		}
		line = this._bufferTracker.bufferToEditorLineMapping.get(line);
		if (line === undefined) {
			return;
		}
		return line + 1;
	}
}
export interface ICommandWithEditorLine { command: ITerminalCommand | ICurrentPartialCommand; lineNumber: number; exitCode?: number }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/browser/textAreaSyncAddon.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/browser/textAreaSyncAddon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ITerminalAddon, Terminal } from '@xterm/xterm';
import { debounce } from '../../../../../base/common/decorators.js';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalLogService, TerminalSettingId } from '../../../../../platform/terminal/common/terminal.js';

export class TextAreaSyncAddon extends Disposable implements ITerminalAddon {
	private _terminal: Terminal | undefined;
	private readonly _listeners = this._register(new MutableDisposable());

	activate(terminal: Terminal): void {
		this._terminal = terminal;
		this._refreshListeners();
	}

	constructor(
		private readonly _capabilities: ITerminalCapabilityStore,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalLogService private readonly _logService: ITerminalLogService
	) {
		super();

		this._register(Event.runAndSubscribe(Event.any(
			this._capabilities.onDidChangeCapabilities,
			this._accessibilityService.onDidChangeScreenReaderOptimized,
		), () => {
			this._refreshListeners();
		}));
	}

	private _refreshListeners(): void {
		const commandDetection = this._capabilities.get(TerminalCapability.CommandDetection);
		if (this._shouldBeActive() && commandDetection) {
			if (!this._listeners.value) {
				const textarea = this._terminal?.textarea;
				if (textarea) {
					this._listeners.value = Event.runAndSubscribe(commandDetection.promptInputModel.onDidChangeInput, () => this._sync(textarea));
				}
			}
		} else {
			this._listeners.clear();
		}
	}

	private _shouldBeActive(): boolean {
		return this._accessibilityService.isScreenReaderOptimized() || this._configurationService.getValue(TerminalSettingId.DevMode);
	}

	@debounce(50)
	private _sync(textArea: HTMLTextAreaElement): void {
		const commandCapability = this._capabilities.get(TerminalCapability.CommandDetection);
		if (!commandCapability) {
			return;
		}

		textArea.value = commandCapability.promptInputModel.value;
		textArea.selectionStart = commandCapability.promptInputModel.cursorIndex;
		textArea.selectionEnd = commandCapability.promptInputModel.cursorIndex;

		this._logService.debug(`TextAreaSyncAddon#sync: text changed to "${textArea.value}"`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/common/terminal.accessibility.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/common/terminal.accessibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalAccessibilityCommandId {
	FocusAccessibleBuffer = 'workbench.action.terminal.focusAccessibleBuffer',
	AccessibleBufferGoToNextCommand = 'workbench.action.terminal.accessibleBufferGoToNextCommand',
	AccessibleBufferGoToPreviousCommand = 'workbench.action.terminal.accessibleBufferGoToPreviousCommand',
	ScrollToBottomAccessibleView = 'workbench.action.terminal.scrollToBottomAccessibleView',
	ScrollToTopAccessibleView = 'workbench.action.terminal.scrollToTopAccessibleView',
}

export const defaultTerminalAccessibilityCommandsToSkipShell = [
	TerminalAccessibilityCommandId.FocusAccessibleBuffer
];
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/common/terminalAccessibilityConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/common/terminalAccessibilityConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalAccessibilitySettingId {
	AccessibleViewPreserveCursorPosition = 'terminal.integrated.accessibleViewPreserveCursorPosition',
	AccessibleViewFocusOnCommandExecution = 'terminal.integrated.accessibleViewFocusOnCommandExecution',
}

export interface ITerminalAccessibilityConfiguration {
	accessibleViewPreserveCursorPosition: boolean;
	accessibleViewFocusOnCommandExecution: number;
}

export const terminalAccessibilityConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalAccessibilitySettingId.AccessibleViewPreserveCursorPosition]: {
		markdownDescription: localize('terminal.integrated.accessibleViewPreserveCursorPosition', "Preserve the cursor position on reopen of the terminal's accessible view rather than setting it to the bottom of the buffer."),
		type: 'boolean',
		default: false
	},
	[TerminalAccessibilitySettingId.AccessibleViewFocusOnCommandExecution]: {
		markdownDescription: localize('terminal.integrated.accessibleViewFocusOnCommandExecution', "Focus the terminal accessible view when a command is executed."),
		type: 'boolean',
		default: false
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/accessibility/test/browser/bufferContentTracker.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/accessibility/test/browser/bufferContentTracker.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { importAMDNodeModule } from '../../../../../../amdX.js';
import { isWindows } from '../../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ContextMenuService } from '../../../../../../platform/contextview/browser/contextMenuService.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILayoutService } from '../../../../../../platform/layout/browser/layoutService.js';
import { ILoggerService, NullLogService } from '../../../../../../platform/log/common/log.js';
import { TerminalCapability } from '../../../../../../platform/terminal/common/capabilities/capabilities.js';
import { TerminalCapabilityStore } from '../../../../../../platform/terminal/common/capabilities/terminalCapabilityStore.js';
import { ITerminalLogService } from '../../../../../../platform/terminal/common/terminal.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../../platform/theme/test/common/testThemeService.js';
import { writeP } from '../../../../terminal/browser/terminalTestHelpers.js';
import { XtermTerminal } from '../../../../terminal/browser/xterm/xtermTerminal.js';
import { ITerminalConfiguration } from '../../../../terminal/common/terminal.js';
import { BufferContentTracker } from '../../browser/bufferContentTracker.js';
import { ILifecycleService } from '../../../../../services/lifecycle/common/lifecycle.js';
import { TestLayoutService, TestLifecycleService } from '../../../../../test/browser/workbenchTestServices.js';
import { TestLoggerService } from '../../../../../test/common/workbenchTestServices.js';
import type { Terminal } from '@xterm/xterm';
import { IAccessibilitySignalService } from '../../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ITerminalConfigurationService } from '../../../../terminal/browser/terminal.js';
import { TerminalConfigurationService } from '../../../../terminal/browser/terminalConfigurationService.js';

const defaultTerminalConfig: Partial<ITerminalConfiguration> = {
	fontFamily: 'monospace',
	fontWeight: 'normal',
	fontWeightBold: 'normal',
	gpuAcceleration: 'off',
	scrollback: 1000,
	fastScrollSensitivity: 2,
	mouseWheelScrollSensitivity: 1,
	unicodeVersion: '6'
};

suite('Buffer Content Tracker', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	let instantiationService: TestInstantiationService;
	let configurationService: TestConfigurationService;
	let themeService: TestThemeService;
	let xterm: XtermTerminal;
	let capabilities: TerminalCapabilityStore;
	let bufferTracker: BufferContentTracker;
	const prompt = 'vscode-git:(prompt/more-tests)';
	const promptPlusData = 'vscode-git:(prompt/more-tests) ' + 'some data';

	setup(async () => {
		configurationService = new TestConfigurationService({ terminal: { integrated: defaultTerminalConfig } });
		instantiationService = store.add(new TestInstantiationService());
		themeService = new TestThemeService();
		instantiationService.stub(IConfigurationService, configurationService);
		instantiationService.stub(ITerminalConfigurationService, store.add(instantiationService.createInstance(TerminalConfigurationService)));
		instantiationService.stub(IThemeService, themeService);
		instantiationService.stub(ITerminalLogService, new NullLogService());
		instantiationService.stub(ILoggerService, store.add(new TestLoggerService()));
		instantiationService.stub(IContextMenuService, store.add(instantiationService.createInstance(ContextMenuService)));
		instantiationService.stub(ILifecycleService, store.add(new TestLifecycleService()));
		instantiationService.stub(IContextKeyService, store.add(new MockContextKeyService()));
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(IAccessibilitySignalService, {
			playSignal: async () => { },
			isSoundEnabled(signal: unknown) { return false; },
		} as any);

		instantiationService.stub(ILayoutService, new TestLayoutService());
		capabilities = store.add(new TerminalCapabilityStore());
		if (!isWindows) {
			capabilities.add(TerminalCapability.NaiveCwdDetection, null!);
		}
		const TerminalCtor = (await importAMDNodeModule<typeof import('@xterm/xterm')>('@xterm/xterm', 'lib/xterm.js')).Terminal;
		xterm = store.add(instantiationService.createInstance(XtermTerminal, undefined, TerminalCtor, {
			cols: 80,
			rows: 30,
			xtermColorProvider: { getBackgroundColor: () => undefined },
			capabilities,
			disableShellIntegrationReporting: true
		}, undefined));
		const container = document.createElement('div');
		xterm.raw.open(container);
		configurationService = new TestConfigurationService({ terminal: { integrated: { tabs: { separator: ' - ', title: '${cwd}', description: '${cwd}' } } } });
		bufferTracker = store.add(instantiationService.createInstance(BufferContentTracker, xterm));
	});

	test('should not clear the prompt line', async () => {
		assert.strictEqual(bufferTracker.lines.length, 0);
		await writeP(xterm.raw, prompt);
		xterm.clearBuffer();
		bufferTracker.update();
		assert.deepStrictEqual(bufferTracker.lines, [prompt]);
	});
	test('repeated updates should not change the content', async () => {
		assert.strictEqual(bufferTracker.lines.length, 0);
		await writeP(xterm.raw, prompt);
		bufferTracker.update();
		assert.deepStrictEqual(bufferTracker.lines, [prompt]);
		bufferTracker.update();
		assert.deepStrictEqual(bufferTracker.lines, [prompt]);
		bufferTracker.update();
		assert.deepStrictEqual(bufferTracker.lines, [prompt]);
	});
	test('should add lines in the viewport and scrollback', async () => {
		await writeAndAssertBufferState(promptPlusData, 38, xterm.raw, bufferTracker);
	});
	test('should add lines in the viewport and full scrollback', async () => {
		await writeAndAssertBufferState(promptPlusData, 1030, xterm.raw, bufferTracker);
	});
	test('should refresh viewport', async () => {
		await writeAndAssertBufferState(promptPlusData, 6, xterm.raw, bufferTracker);
		await writeP(xterm.raw, '\x1b[3Ainserteddata');
		bufferTracker.update();
		assert.deepStrictEqual(bufferTracker.lines, [promptPlusData, promptPlusData, `${promptPlusData}inserteddata`, promptPlusData, promptPlusData, promptPlusData]);
	});
	test('should refresh viewport with full scrollback', async () => {
		const content = `${prompt}\r\n`.repeat(1030).trimEnd();
		await writeP(xterm.raw, content);
		bufferTracker.update();
		await writeP(xterm.raw, '\x1b[4Ainsertion');
		bufferTracker.update();
		const expected = content.split('\r\n');
		expected[1025] = `${prompt}insertion`;
		assert.deepStrictEqual(bufferTracker.lines[1025], `${prompt}insertion`);
	});
	test('should cap the size of the cached lines, removing old lines in favor of new lines', async () => {
		const content = `${prompt}\r\n`.repeat(1036).trimEnd();
		await writeP(xterm.raw, content);
		bufferTracker.update();
		const expected = content.split('\r\n');
		// delete the 6 lines that should be trimmed
		for (let i = 0; i < 6; i++) {
			expected.pop();
		}
		// insert a new character
		await writeP(xterm.raw, '\x1b[2Ainsertion');
		bufferTracker.update();
		expected[1027] = `${prompt}insertion`;
		assert.strictEqual(bufferTracker.lines.length, expected.length);
		assert.deepStrictEqual(bufferTracker.lines, expected);
	});
});

async function writeAndAssertBufferState(data: string, rows: number, terminal: Terminal, bufferTracker: BufferContentTracker): Promise<void> {
	const content = `${data}\r\n`.repeat(rows).trimEnd();
	await writeP(terminal, content);
	bufferTracker.update();
	assert.strictEqual(bufferTracker.lines.length, rows);
	assert.deepStrictEqual(bufferTracker.lines, content.split('\r\n'));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/autoReplies/browser/terminal.autoReplies.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/autoReplies/browser/terminal.autoReplies.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { type ITerminalBackend } from '../../../../../platform/terminal/common/terminal.js';
import { registerWorkbenchContribution2, WorkbenchPhase, type IWorkbenchContribution } from '../../../../common/contributions.js';
import { ITerminalInstanceService } from '../../../terminal/browser/terminal.js';
import { TERMINAL_CONFIG_SECTION } from '../../../terminal/common/terminal.js';
import { TerminalAutoRepliesSettingId, type ITerminalAutoRepliesConfiguration } from '../common/terminalAutoRepliesConfiguration.js';

// #region Workbench contributions

export class TerminalAutoRepliesContribution extends Disposable implements IWorkbenchContribution {
	static ID = 'terminalAutoReplies';

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService,
	) {
		super();

		for (const backend of terminalInstanceService.getRegisteredBackends()) {
			this._installListenersOnBackend(backend);
		}
		this._register(terminalInstanceService.onDidRegisterBackend(async e => this._installListenersOnBackend(e)));
	}

	private _installListenersOnBackend(backend: ITerminalBackend): void {
		// Listen for config changes
		const initialConfig = this._configurationService.getValue<ITerminalAutoRepliesConfiguration>(TERMINAL_CONFIG_SECTION);
		for (const match of Object.keys(initialConfig.autoReplies)) {
			// Ensure the reply is valid
			const reply = initialConfig.autoReplies[match] as string | null;
			if (reply) {
				backend.installAutoReply(match, reply);
			}
		}

		this._register(this._configurationService.onDidChangeConfiguration(async e => {
			if (e.affectsConfiguration(TerminalAutoRepliesSettingId.AutoReplies)) {
				backend.uninstallAllAutoReplies();
				const config = this._configurationService.getValue<ITerminalAutoRepliesConfiguration>(TERMINAL_CONFIG_SECTION);
				for (const match of Object.keys(config.autoReplies)) {
					// Ensure the reply is valid
					const reply = config.autoReplies[match] as string | null;
					if (reply) {
						backend.installAutoReply(match, reply);
					}
				}
			}
		}));
	}
}

registerWorkbenchContribution2(TerminalAutoRepliesContribution.ID, TerminalAutoRepliesContribution, WorkbenchPhase.AfterRestored);

// #endregion Contributions
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/autoReplies/common/terminalAutoRepliesConfiguration.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/autoReplies/common/terminalAutoRepliesConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalAutoRepliesSettingId {
	AutoReplies = 'terminal.integrated.autoReplies',
}

export interface ITerminalAutoRepliesConfiguration {
	autoReplies: { [key: string]: string };
}

export const terminalAutoRepliesConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalAutoRepliesSettingId.AutoReplies]: {
		markdownDescription: localize('terminal.integrated.autoReplies', "A set of messages that, when encountered in the terminal, will be automatically responded to. Provided the message is specific enough, this can help automate away common responses.\n\nRemarks:\n\n- Use {0} to automatically respond to the terminate batch job prompt on Windows.\n- The message includes escape sequences so the reply might not happen with styled text.\n- Each reply can only happen once every second.\n- Use {1} in the reply to mean the enter key.\n- To unset a default key, set the value to null.\n- Restart VS Code if new don't apply.", '`"Terminate batch job (Y/N)": "Y\\r"`', '`"\\r"`'),
		type: 'object',
		additionalProperties: {
			oneOf: [{
				type: 'string',
				description: localize('terminal.integrated.autoReplies.reply', "The reply to send to the process.")
			},
			{ type: 'null' }]
		},
		default: {}
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminal.chat.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminal.chat.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerTerminalContribution } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalInlineChatAccessibleView } from './terminalChatAccessibleView.js';
import { TerminalChatController } from './terminalChatController.js';

// #region Terminal Contributions

registerTerminalContribution(TerminalChatController.ID, TerminalChatController, false);

// #endregion

// #region Contributions

AccessibleViewRegistry.register(new TerminalInlineChatAccessibleView());
AccessibleViewRegistry.register(new TerminalChatAccessibilityHelp());

registerWorkbenchContribution2(TerminalChatEnabler.Id, TerminalChatEnabler, WorkbenchPhase.AfterRestored);

// #endregion

// #region Actions

import './terminalChatActions.js';
import { AccessibleViewRegistry } from '../../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { TerminalChatAccessibilityHelp } from './terminalChatAccessibilityHelp.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../../common/contributions.js';
import { TerminalChatEnabler } from './terminalChatEnabler.js';
import { InstantiationType, registerSingleton } from '../../../../../platform/instantiation/common/extensions.js';
import { ITerminalChatService } from '../../../terminal/browser/terminal.js';
import { TerminalChatService } from './terminalChatService.js';

// #region Services

registerSingleton(ITerminalChatService, TerminalChatService, InstantiationType.Delayed);

// #endregion

// #endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminal.initialHint.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminal.initialHint.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { IDecoration, ITerminalAddon, Terminal as RawXtermTerminal } from '@xterm/xterm';
import * as dom from '../../../../../base/browser/dom.js';
import { IContentActionHandler, renderFormattedText } from '../../../../../base/browser/formattedTextRenderer.js';
import { StandardMouseEvent } from '../../../../../base/browser/mouseEvent.js';
import { status } from '../../../../../base/browser/ui/aria/aria.js';
import { KeybindingLabel } from '../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { OS } from '../../../../../base/common/platform.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ITerminalCapabilityStore, TerminalCapability } from '../../../../../platform/terminal/common/capabilities/capabilities.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { IChatAgent, IChatAgentService } from '../../../chat/common/chatAgents.js';
import { ChatAgentLocation } from '../../../chat/common/constants.js';
import { IDetachedTerminalInstance, ITerminalContribution, ITerminalEditorService, ITerminalGroupService, ITerminalInstance, ITerminalService, IXtermTerminal } from '../../../terminal/browser/terminal.js';
import { registerTerminalContribution, type IDetachedCompatibleTerminalContributionContext, type ITerminalContributionContext } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalInstance } from '../../../terminal/browser/terminalInstance.js';
import { TerminalInitialHintSettingId } from '../common/terminalInitialHintConfiguration.js';
import './media/terminalInitialHint.css';
import { TerminalChatCommandId } from './terminalChat.js';
import { hasKey } from '../../../../../base/common/types.js';

const $ = dom.$;

const enum Constants {
	InitialHintHideStorageKey = 'terminal.initialHint.hide'
}

export class InitialHintAddon extends Disposable implements ITerminalAddon {
	private readonly _onDidRequestCreateHint = this._register(new Emitter<void>());
	get onDidRequestCreateHint(): Event<void> { return this._onDidRequestCreateHint.event; }
	private readonly _disposables = this._register(new MutableDisposable<DisposableStore>());

	constructor(private readonly _capabilities: ITerminalCapabilityStore,
		private readonly _onDidChangeAgents: Event<IChatAgent | undefined>) {
		super();
	}
	activate(terminal: RawXtermTerminal): void {
		const store = this._register(new DisposableStore());
		this._disposables.value = store;
		const capability = this._capabilities.get(TerminalCapability.CommandDetection);
		if (capability) {
			store.add(Event.once(capability.promptInputModel.onDidStartInput)(() => this._onDidRequestCreateHint.fire()));
		} else {
			this._register(this._capabilities.onDidAddCapability(e => {
				if (e.id === TerminalCapability.CommandDetection) {
					const capability = e.capability;
					store.add(Event.once(capability.promptInputModel.onDidStartInput)(() => this._onDidRequestCreateHint.fire()));
					if (!capability.promptInputModel.value) {
						this._onDidRequestCreateHint.fire();
					}
				}
			}));
		}
		const agentListener = this._onDidChangeAgents((e) => {
			if (e?.locations.includes(ChatAgentLocation.Terminal)) {
				this._onDidRequestCreateHint.fire();
				agentListener.dispose();
			}
		});
		this._disposables.value?.add(agentListener);
	}
}

export class TerminalInitialHintContribution extends Disposable implements ITerminalContribution {
	static readonly ID = 'terminal.initialHint';

	private _addon: InitialHintAddon | undefined;

	private _hintWidget: HTMLElement | undefined;

	static get(instance: ITerminalInstance | IDetachedTerminalInstance): TerminalInitialHintContribution | null {
		return instance.getContribution<TerminalInitialHintContribution>(TerminalInitialHintContribution.ID);
	}
	private _decoration: IDecoration | undefined;
	private _xterm: IXtermTerminal & { raw: RawXtermTerminal } | undefined;

	constructor(
		private readonly _ctx: ITerminalContributionContext | IDetachedCompatibleTerminalContributionContext,
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
	) {
		super();

		// Reset hint state when config changes
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalInitialHintSettingId.Enabled)) {
				this._storageService.remove(Constants.InitialHintHideStorageKey, StorageScope.APPLICATION);
			}
		}));
	}

	xtermOpen(xterm: IXtermTerminal & { raw: RawXtermTerminal }): void {
		// Don't show is the terminal was launched by an extension or a feature like debug
		if (hasKey(this._ctx.instance, { shellLaunchConfig: true }) && (this._ctx.instance.shellLaunchConfig.isExtensionOwnedTerminal || this._ctx.instance.shellLaunchConfig.isFeatureTerminal)) {
			return;
		}
		// Don't show if disabled
		if (this._storageService.getBoolean(Constants.InitialHintHideStorageKey, StorageScope.APPLICATION, false)) {
			return;
		}
		// Only show for the first terminal
		if (this._terminalGroupService.instances.length + this._terminalEditorService.instances.length !== 1) {
			return;
		}
		this._xterm = xterm;
		this._addon = this._register(this._instantiationService.createInstance(InitialHintAddon, this._ctx.instance.capabilities, this._chatAgentService.onDidChangeAgents));
		this._xterm.raw.loadAddon(this._addon);
		this._register(this._addon.onDidRequestCreateHint(() => this._createHint()));
	}

	private _createHint(): void {
		const instance = this._ctx.instance instanceof TerminalInstance ? this._ctx.instance : undefined;
		const commandDetectionCapability = instance?.capabilities.get(TerminalCapability.CommandDetection);
		if (!instance || !this._xterm || this._hintWidget || !commandDetectionCapability || commandDetectionCapability.promptInputModel.value || !!instance.shellLaunchConfig.attachPersistentProcess) {
			return;
		}

		if (!this._configurationService.getValue(TerminalInitialHintSettingId.Enabled)) {
			return;
		}

		if (!this._decoration) {
			const marker = this._xterm.raw.registerMarker();
			if (!marker) {
				return;
			}

			if (this._xterm.raw.buffer.active.cursorX === 0) {
				return;
			}
			this._register(marker);
			this._decoration = this._xterm.raw.registerDecoration({
				marker,
				x: this._xterm.raw.buffer.active.cursorX + 1,
			});
			if (this._decoration) {
				this._register(this._decoration);
			}
		}

		this._register(this._xterm.raw.onKey(() => this.dispose()));

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalInitialHintSettingId.Enabled) && !this._configurationService.getValue(TerminalInitialHintSettingId.Enabled)) {
				this.dispose();
			}
		}));

		const inputModel = commandDetectionCapability.promptInputModel;
		if (inputModel) {
			this._register(inputModel.onDidChangeInput(() => {
				if (inputModel.value) {
					this.dispose();
				}
			}));
		}

		if (!this._decoration) {
			return;
		}
		this._register(this._decoration);
		this._register(this._decoration.onRender((e) => {
			if (!this._hintWidget && this._xterm?.isFocused && this._terminalGroupService.instances.length + this._terminalEditorService.instances.length === 1) {
				const terminalAgents = this._chatAgentService.getActivatedAgents().filter(candidate => candidate.locations.includes(ChatAgentLocation.Terminal));
				if (terminalAgents?.length) {
					const widget = this._register(this._instantiationService.createInstance(TerminalInitialHintWidget, instance));
					this._addon?.dispose();
					this._hintWidget = widget.getDomNode(terminalAgents);
					if (!this._hintWidget) {
						return;
					}
					e.appendChild(this._hintWidget);
					e.classList.add('terminal-initial-hint');
					const font = this._xterm.getFont();
					if (font) {
						e.style.fontFamily = font.fontFamily;
						e.style.fontSize = font.fontSize + 'px';
					}
				}
			}
			if (this._hintWidget && this._xterm) {
				const decoration = this._hintWidget.parentElement;
				if (decoration) {
					decoration.style.width = (this._xterm.raw.cols - this._xterm.raw.buffer.active.cursorX) / this._xterm!.raw.cols * 100 + '%';
				}
			}
		}));
	}
}
registerTerminalContribution(TerminalInitialHintContribution.ID, TerminalInitialHintContribution, false);

class TerminalInitialHintWidget extends Disposable {

	private _domNode: HTMLElement | undefined;
	private readonly _toDispose: DisposableStore = this._register(new DisposableStore());
	private _isVisible = false;
	private _ariaLabel: string = '';

	constructor(
		private readonly _instance: ITerminalInstance,
		@ICommandService private readonly _commandService: ICommandService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IStorageService private readonly _storageService: IStorageService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ITerminalService private readonly _terminalService: ITerminalService,
	) {
		super();
		this._toDispose.add(_instance.onDidFocus(() => {
			if (this._instance.hasFocus && this._isVisible && this._ariaLabel && this._configurationService.getValue(AccessibilityVerbositySettingId.TerminalInlineChat)) {
				status(this._ariaLabel);
			}
		}));
		this._toDispose.add(_terminalService.onDidChangeInstances(() => {
			if (this._terminalService.instances.length !== 1) {
				this.dispose();
			}
		}));
		this._toDispose.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TerminalInitialHintSettingId.Enabled) && !this._configurationService.getValue(TerminalInitialHintSettingId.Enabled)) {
				this.dispose();
			}
		}));
	}

	private _getHintInlineChat(agents: IChatAgent[]) {
		let ariaLabel = `Open chat.`;

		const handleClick = () => {
			this._storageService.store(Constants.InitialHintHideStorageKey, true, StorageScope.APPLICATION, StorageTarget.USER);
			this._telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
				id: 'terminalInlineChat.hintAction',
				from: 'hint'
			});
			this._commandService.executeCommand(TerminalChatCommandId.Start, { from: 'hint' });
		};
		this._toDispose.add(this._commandService.onDidExecuteCommand(e => {
			if (e.commandId === TerminalChatCommandId.Start) {
				this._storageService.store(Constants.InitialHintHideStorageKey, true, StorageScope.APPLICATION, StorageTarget.USER);
				this.dispose();
			}
		}));

		const hintHandler: IContentActionHandler = {
			disposables: this._toDispose,
			callback: (index, _event) => {
				switch (index) {
					case '0':
						handleClick();
						break;
				}
			}
		};

		const hintElement = $('div.terminal-initial-hint');
		hintElement.style.display = 'block';

		const keybindingHint = this._keybindingService.lookupKeybinding(TerminalChatCommandId.Start);
		const keybindingHintLabel = keybindingHint?.getLabel();

		if (keybindingHint && keybindingHintLabel) {
			const actionPart = localize('emptyHintText', 'Open chat {0}. ', keybindingHintLabel);

			const [before, after] = actionPart.split(keybindingHintLabel).map((fragment) => {
				const hintPart = $('a', undefined, fragment);
				this._toDispose.add(dom.addDisposableListener(hintPart, dom.EventType.CLICK, handleClick));
				return hintPart;
			});

			hintElement.appendChild(before);

			const label = hintHandler.disposables.add(new KeybindingLabel(hintElement, OS));
			label.set(keybindingHint);
			label.element.style.width = 'min-content';
			label.element.style.display = 'inline';

			label.element.style.cursor = 'pointer';
			this._toDispose.add(dom.addDisposableListener(label.element, dom.EventType.CLICK, handleClick));

			hintElement.appendChild(after);

			const typeToDismiss = localize('hintTextDismiss', 'Start typing to dismiss.');
			const textHint2 = $('span.detail', undefined, typeToDismiss);
			hintElement.appendChild(textHint2);

			ariaLabel = actionPart.concat(typeToDismiss);
		} else {
			const hintMsg = localize({
				key: 'inlineChatHint',
				comment: [
					'Preserve double-square brackets and their order',
				]
			}, '[[Open chat]] or start typing to dismiss.');
			const rendered = renderFormattedText(hintMsg, { actionHandler: hintHandler });
			hintElement.appendChild(rendered);
		}

		return { ariaLabel, hintHandler, hintElement };
	}

	getDomNode(agents: IChatAgent[]): HTMLElement {
		if (!this._domNode) {
			this._domNode = $('.terminal-initial-hint');
			this._domNode!.style.paddingLeft = '4px';

			const { hintElement, ariaLabel } = this._getHintInlineChat(agents);
			this._domNode.append(hintElement);
			this._ariaLabel = ariaLabel.concat(localize('disableHint', ' Toggle {0} in settings to disable this hint.', AccessibilityVerbositySettingId.TerminalInlineChat));

			this._toDispose.add(dom.addDisposableListener(this._domNode, 'click', () => {
				this._domNode?.remove();
				this._domNode = undefined;
			}));

			this._toDispose.add(dom.addDisposableListener(this._domNode, dom.EventType.CONTEXT_MENU, (e) => {
				this._contextMenuService.showContextMenu({
					getAnchor: () => { return new StandardMouseEvent(dom.getActiveWindow(), e); },
					getActions: () => {
						return [{
							id: 'workench.action.disableTerminalInitialHint',
							label: localize('disableInitialHint', "Disable Initial Hint"),
							tooltip: localize('disableInitialHint', "Disable Initial Hint"),
							enabled: true,
							class: undefined,
							run: () => this._configurationService.updateValue(TerminalInitialHintSettingId.Enabled, false)
						}
						];
					}
				});
			}));
		}
		return this._domNode;
	}

	override dispose(): void {
		this._domNode?.remove();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChat.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';

export const enum TerminalChatCommandId {
	Start = 'workbench.action.terminal.chat.start',
	Close = 'workbench.action.terminal.chat.close',
	MakeRequest = 'workbench.action.terminal.chat.makeRequest',
	Cancel = 'workbench.action.terminal.chat.cancel',
	RunCommand = 'workbench.action.terminal.chat.runCommand',
	RunFirstCommand = 'workbench.action.terminal.chat.runFirstCommand',
	InsertCommand = 'workbench.action.terminal.chat.insertCommand',
	InsertFirstCommand = 'workbench.action.terminal.chat.insertFirstCommand',
	ViewInChat = 'workbench.action.terminal.chat.viewInChat',
	RerunRequest = 'workbench.action.terminal.chat.rerunRequest',
	ViewHiddenChatTerminals = 'workbench.action.terminal.chat.viewHiddenChatTerminals',
	OpenTerminalSettingsLink = 'workbench.action.terminal.chat.openTerminalSettingsLink',
	DisableSessionAutoApproval = 'workbench.action.terminal.chat.disableSessionAutoApproval',
	FocusMostRecentChatTerminalOutput = 'workbench.action.terminal.chat.focusMostRecentChatTerminalOutput',
	FocusMostRecentChatTerminal = 'workbench.action.terminal.chat.focusMostRecentChatTerminal',
	ToggleChatTerminalOutput = 'workbench.action.terminal.chat.toggleChatTerminalOutput',
	FocusChatInstanceAction = 'workbench.action.terminal.chat.focusChatInstance',
}

export const MENU_TERMINAL_CHAT_WIDGET_INPUT_SIDE_TOOLBAR = MenuId.for('terminalChatWidget');
export const MENU_TERMINAL_CHAT_WIDGET_STATUS = MenuId.for('terminalChatWidget.status');
export const MENU_TERMINAL_CHAT_WIDGET_TOOLBAR = MenuId.for('terminalChatWidget.toolbar');

export const enum TerminalChatContextKeyStrings {
	ChatFocus = 'terminalChatFocus',
	ChatVisible = 'terminalChatVisible',
	ChatActiveRequest = 'terminalChatActiveRequest',
	ChatInputHasText = 'terminalChatInputHasText',
	ChatAgentRegistered = 'terminalChatAgentRegistered',
	ChatResponseEditorFocused = 'terminalChatResponseEditorFocused',
	ChatResponseContainsCodeBlock = 'terminalChatResponseContainsCodeBlock',
	ChatResponseContainsMultipleCodeBlocks = 'terminalChatResponseContainsMultipleCodeBlocks',
	ChatResponseSupportsIssueReporting = 'terminalChatResponseSupportsIssueReporting',
	ChatSessionResponseVote = 'terminalChatSessionResponseVote',
	ChatHasTerminals = 'hasChatTerminals',
	ChatHasHiddenTerminals = 'hasHiddenChatTerminals',
}


export namespace TerminalChatContextKeys {

	/** Whether the chat widget is focused */
	export const focused = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatFocus, false, localize('chatFocusedContextKey', "Whether the chat view is focused."));

	/** Whether the chat widget is visible */
	export const visible = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatVisible, false, localize('chatVisibleContextKey', "Whether the chat view is visible."));

	/** Whether there is an active chat request */
	export const requestActive = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatActiveRequest, false, localize('chatRequestActiveContextKey', "Whether there is an active chat request."));

	/** Whether the chat input has text */
	export const inputHasText = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatInputHasText, false, localize('chatInputHasTextContextKey', "Whether the chat input has text."));

	/** The chat response contains at least one code block */
	export const responseContainsCodeBlock = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatResponseContainsCodeBlock, false, localize('chatResponseContainsCodeBlockContextKey', "Whether the chat response contains a code block."));

	/** The chat response contains multiple code blocks */
	export const responseContainsMultipleCodeBlocks = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatResponseContainsMultipleCodeBlocks, false, localize('chatResponseContainsMultipleCodeBlocksContextKey', "Whether the chat response contains multiple code blocks."));

	/** A chat agent exists for the terminal location */
	export const hasChatAgent = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatAgentRegistered, false, localize('chatAgentRegisteredContextKey', "Whether a chat agent is registered for the terminal location."));

	/** Has terminals created via chat */
	export const hasChatTerminals = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatHasTerminals, false, localize('terminalHasChatTerminals', "Whether there are any chat terminals."));

	/** Has hidden chat terminals */
	export const hasHiddenChatTerminals = new RawContextKey<boolean>(TerminalChatContextKeyStrings.ChatHasHiddenTerminals, false, localize('terminalHasHiddenChatTerminals', "Whether there are any hidden chat terminals."));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { TerminalChatCommandId, TerminalChatContextKeys } from './terminalChat.js';
import { TerminalChatController } from './terminalChatController.js';

export class TerminalChatAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 110;
	readonly name = 'terminalChat';
	readonly when = TerminalChatContextKeys.focused;
	readonly type = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		const terminalService = accessor.get(ITerminalService);

		const instance = terminalService.activeInstance;
		if (!instance) {
			return;
		}

		const helpText = getAccessibilityHelpText(accessor);
		return new AccessibleContentProvider(
			AccessibleViewProviderId.TerminalChat,
			{ type: AccessibleViewType.Help },
			() => helpText,
			() => TerminalChatController.get(instance)?.terminalChatWidget?.focus(),
			AccessibilityVerbositySettingId.TerminalInlineChat,
		);
	}
}

export function getAccessibilityHelpText(accessor: ServicesAccessor): string {
	const keybindingService = accessor.get(IKeybindingService);
	const content = [];
	const openAccessibleViewKeybinding = keybindingService.lookupKeybinding('editor.action.accessibleView')?.getAriaLabel();
	const runCommandKeybinding = keybindingService.lookupKeybinding(TerminalChatCommandId.RunCommand)?.getAriaLabel();
	const insertCommandKeybinding = keybindingService.lookupKeybinding(TerminalChatCommandId.InsertCommand)?.getAriaLabel();
	const makeRequestKeybinding = keybindingService.lookupKeybinding(TerminalChatCommandId.MakeRequest)?.getAriaLabel();
	const startChatKeybinding = keybindingService.lookupKeybinding(TerminalChatCommandId.Start)?.getAriaLabel();
	const focusResponseKeybinding = keybindingService.lookupKeybinding('chat.action.focus')?.getAriaLabel();
	const focusInputKeybinding = keybindingService.lookupKeybinding('workbench.action.chat.focusInput')?.getAriaLabel();
	content.push(localize('inlineChat.overview', "Inline chat occurs within a terminal. It is useful for suggesting terminal commands. Keep in mind that AI generated code may be incorrect."));
	content.push(localize('inlineChat.access', "It can be activated using the command: Terminal: Start Chat ({0}), which will focus the input box.", startChatKeybinding));
	content.push(makeRequestKeybinding ? localize('inlineChat.input', "The input box is where the user can type a request and can make the request ({0}). The widget will be closed and all content will be discarded when the Escape key is pressed and the terminal will regain focus.", makeRequestKeybinding) : localize('inlineChat.inputNoKb', "The input box is where the user can type a request and can make the request by tabbing to the Make Request button, which is not currently triggerable via keybindings. The widget will be closed and all content will be discarded when the Escape key is pressed and the terminal will regain focus."));
	content.push(openAccessibleViewKeybinding ? localize('inlineChat.inspectResponseMessage', 'The response can be inspected in the accessible view ({0}).', openAccessibleViewKeybinding) : localize('inlineChat.inspectResponseNoKb', 'With the input box focused, inspect the response in the accessible view via the Open Accessible View command, which is currently not triggerable by a keybinding.'));
	content.push(focusResponseKeybinding ? localize('inlineChat.focusResponse', 'Reach the response from the input box ({0}).', focusResponseKeybinding) : localize('inlineChat.focusResponseNoKb', 'Reach the response from the input box by tabbing or assigning a keybinding for the command: Focus Terminal Response.'));
	content.push(focusInputKeybinding ? localize('inlineChat.focusInput', 'Reach the input box from the response ({0}).', focusInputKeybinding) : localize('inlineChat.focusInputNoKb', 'Reach the response from the input box by shift+tabbing or assigning a keybinding for the command: Focus Terminal Input.'));
	content.push(runCommandKeybinding ? localize('inlineChat.runCommand', 'With focus in the input box or command editor, the Terminal: Run Chat Command ({0}) action.', runCommandKeybinding) : localize('inlineChat.runCommandNoKb', 'Run a command by tabbing to the button as the action is currently not triggerable by a keybinding.'));
	content.push(insertCommandKeybinding ? localize('inlineChat.insertCommand', 'With focus in the input box command editor, the Terminal: Insert Chat Command ({0}) action.', insertCommandKeybinding) : localize('inlineChat.insertCommandNoKb', 'Insert a command by tabbing to the button as the action is currently not triggerable by a keybinding.'));
	content.push(localize('inlineChat.toolbar', "Use tab to reach conditional parts like commands, status, message responses and more."));
	content.push(localize('chat.signals', "Accessibility Signals can be changed via settings with a prefix of signals.chat. By default, if a request takes more than 4 seconds, you will hear a sound indicating that progress is still occurring."));
	return content.join('\n');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibilityVerbositySettingId } from '../../../accessibility/browser/accessibilityConfiguration.js';
import { ITerminalService } from '../../../terminal/browser/terminal.js';
import { TerminalChatController } from './terminalChatController.js';
import { IAccessibleViewImplementation } from '../../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IMenuService, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { MENU_TERMINAL_CHAT_WIDGET_STATUS, TerminalChatContextKeys } from './terminalChat.js';
import { IAction } from '../../../../../base/common/actions.js';

export class TerminalInlineChatAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 105;
	readonly name = 'terminalInlineChat';
	readonly type = AccessibleViewType.View;
	readonly when = TerminalChatContextKeys.focused;

	getProvider(accessor: ServicesAccessor) {
		const terminalService = accessor.get(ITerminalService);
		const menuService = accessor.get(IMenuService);
		const actions: IAction[] = [];
		const contextKeyService = TerminalChatController.activeChatController?.scopedContextKeyService;
		if (contextKeyService) {
			const menuActions = menuService.getMenuActions(MENU_TERMINAL_CHAT_WIDGET_STATUS, contextKeyService);
			for (const action of menuActions) {
				for (const a of action[1]) {
					if (a instanceof MenuItemAction) {
						actions.push(a);
					}
				}
			}
		}

		const controller: TerminalChatController | undefined = terminalService.activeInstance?.getContribution(TerminalChatController.ID) ?? undefined;
		if (!controller?.lastResponseContent) {
			return;
		}
		const responseContent = controller.lastResponseContent;
		return new AccessibleContentProvider(
			AccessibleViewProviderId.TerminalChat,
			{ type: AccessibleViewType.View },
			() => { return responseContent; },
			() => {
				controller.focus();
			},
			AccessibilityVerbositySettingId.InlineChat,
			undefined,
			actions
		);
	}
}
```

--------------------------------------------------------------------------------

````

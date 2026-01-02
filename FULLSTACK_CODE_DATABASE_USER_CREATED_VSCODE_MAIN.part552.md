---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 552
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 552 of 552)

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

---[FILE: test/smoke/src/areas/terminal/terminal-persistence.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-persistence.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, TerminalCommandId, TerminalCommandIdWithValue, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Persistence', () => {
		// Acquire automation API
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;

		before(async function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		describe('detach/attach', () => {
			// https://github.com/microsoft/vscode/issues/137799
			it('should support basic reconnection', async () => {
				await terminal.createTerminal();
				// TODO: Handle passing in an actual regex, not string
				await terminal.assertTerminalGroups([
					[{ name: '.*' }]
				]);

				// Get the terminal name
				await terminal.assertTerminalGroups([
					[{ name: '.*' }]
				]);
				const name = (await terminal.getTerminalGroups())[0][0].name!;

				// Detach
				await terminal.runCommand(TerminalCommandId.DetachSession);
				await terminal.assertTerminalViewHidden();

				// Attach
				await terminal.runCommandWithValue(TerminalCommandIdWithValue.AttachToSession, name);
				await terminal.assertTerminalGroups([
					[{ name }]
				]);
			});

			it.skip('should persist buffer content', async () => {
				await terminal.createTerminal();
				// TODO: Handle passing in an actual regex, not string
				await terminal.assertTerminalGroups([
					[{ name: '.*' }]
				]);

				// Get the terminal name
				await terminal.assertTerminalGroups([
					[{ name: '.*' }]
				]);
				const name = (await terminal.getTerminalGroups())[0][0].name!;

				// Write in terminal
				await terminal.runCommandInTerminal('echo terminal_test_content');
				await terminal.waitForTerminalText(buffer => buffer.some(e => e.includes('terminal_test_content')));

				// Detach
				await terminal.runCommand(TerminalCommandId.DetachSession);
				await terminal.assertTerminalViewHidden();

				// Attach
				await terminal.runCommandWithValue(TerminalCommandIdWithValue.AttachToSession, name);
				await terminal.assertTerminalGroups([
					[{ name }]
				]);
				// There can be line wrapping, so remove newlines and carriage returns #216464
				await terminal.waitForTerminalText(buffer => buffer.some(e => e.replaceAll(/[\r\n]/g, '').includes('terminal_test_content')));
			});
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-profiles.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-profiles.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, TerminalCommandId, TerminalCommandIdWithValue, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

const CONTRIBUTED_PROFILE_NAME = `JavaScript Debug Terminal`;
const ANY_PROFILE_NAME = '^((?!JavaScript Debug Terminal).)*$';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Profiles', () => {
		// Acquire automation API
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;

		before(async function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		it('should launch the default profile', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.assertSingleTab({ name: ANY_PROFILE_NAME });
		});

		// This test alone fails in web & remote smoke tests with the introduction of dialogs showing
		// in smoke tests. It's likely due to the other changes in this commit in the terminal service.
		it.skip('should set the default profile to a contributed one', async () => {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.SelectDefaultProfile, CONTRIBUTED_PROFILE_NAME);
			await terminal.createTerminal();
			await terminal.assertSingleTab({ name: CONTRIBUTED_PROFILE_NAME });
		});

		it('should use the default contributed profile on panel open and for splitting', async () => {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.SelectDefaultProfile, CONTRIBUTED_PROFILE_NAME);
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.assertTerminalGroups([[{ name: CONTRIBUTED_PROFILE_NAME }, { name: CONTRIBUTED_PROFILE_NAME }]]);
		});

		it('should set the default profile', async () => {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.SelectDefaultProfile, process.platform === 'win32' ? 'PowerShell' : undefined);
			await terminal.createTerminal();
			await terminal.assertSingleTab({ name: ANY_PROFILE_NAME });
		});

		it('should use the default profile on panel open and for splitting', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.assertSingleTab({ name: ANY_PROFILE_NAME });
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('createWithProfile command should create a terminal with a profile', async () => {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.NewWithProfile);
			await terminal.assertSingleTab({ name: ANY_PROFILE_NAME });
		});

		it('createWithProfile command should create a terminal with a contributed profile', async () => {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.NewWithProfile, CONTRIBUTED_PROFILE_NAME);
			await terminal.assertSingleTab({ name: CONTRIBUTED_PROFILE_NAME });
		});

		it('createWithProfile command should create a split terminal with a profile', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.NewWithProfile, undefined, true);
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('createWithProfile command should create a split terminal with a contributed profile', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.assertSingleTab({});
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.NewWithProfile, CONTRIBUTED_PROFILE_NAME, true);
			await terminal.assertTerminalGroups([[{ name: ANY_PROFILE_NAME }, { name: CONTRIBUTED_PROFILE_NAME }]]);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-shellIntegration.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-shellIntegration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, SettingsEditor, TerminalCommandIdWithValue, TerminalCommandId } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Shell Integration', () => {
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;
		let app: Application;
		// Acquire automation API
		before(async function () {
			app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
		});

		afterEach(async function () {
			await app.workbench.terminal.runCommand(TerminalCommandId.KillAll);
		});

		async function createShellIntegrationProfile() {
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.NewWithProfile, process.platform === 'win32' ? 'PowerShell' : 'bash');
		}

		// TODO: Some agents may not have pwsh installed?
		(process.platform === 'win32' ? describe.skip : describe)(`Process-based tests`, function () {
			before(async function () {
				await setTerminalTestSettings(app, [['terminal.integrated.shellIntegration.enabled', 'true']]);
			});
			after(async function () {
				await settingsEditor.clearUserSettings();
			});
			describe('Decorations', function () {
				describe('Should show default icons', function () {
					it('Placeholder', async () => {
						await createShellIntegrationProfile();
						await terminal.assertCommandDecorations({ placeholder: 1, success: 0, error: 0 });
					});
					it('Success', async () => {
						await createShellIntegrationProfile();
						await terminal.runCommandInTerminal(`echo "success"`);
						await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 0 });
					});
					it('Error', async () => {
						await createShellIntegrationProfile();
						await terminal.runCommandInTerminal(`false`);
						await terminal.assertCommandDecorations({ placeholder: 1, success: 0, error: 1 });
					});
				});
				describe('terminal.integrated.shellIntegration.decorationsEnabled should determine gutter and overview ruler decoration visibility', function () {
					beforeEach(async () => {
						await settingsEditor.clearUserSettings();
						await setTerminalTestSettings(app, [['terminal.integrated.shellIntegration.enabled', 'true']]);
						await createShellIntegrationProfile();
						await terminal.assertCommandDecorations({ placeholder: 1, success: 0, error: 0 });
						await terminal.runCommandInTerminal(`echo "foo"`);
						await terminal.runCommandInTerminal(`bar`);
						await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 });
					});
					afterEach(async () => {
						await app.workbench.terminal.runCommand(TerminalCommandId.KillAll);
					});
					it('never', async () => {
						await settingsEditor.addUserSetting('terminal.integrated.shellIntegration.decorationsEnabled', '"never"');
						await terminal.assertCommandDecorations({ placeholder: 0, success: 0, error: 0 }, undefined, 'never');
					});
					it('both', async () => {
						await settingsEditor.addUserSetting('terminal.integrated.shellIntegration.decorationsEnabled', '"both"');
						await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 }, undefined, 'both');
					});
					it('gutter', async () => {
						await settingsEditor.addUserSetting('terminal.integrated.shellIntegration.decorationsEnabled', '"gutter"');
						await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 }, undefined, 'gutter');
					});
					it('overviewRuler', async () => {
						await settingsEditor.addUserSetting('terminal.integrated.shellIntegration.decorationsEnabled', '"overviewRuler"');
						await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 }, undefined, 'overviewRuler');
					});
				});
			});
		});

		// These are integration tests that only test the UI side by simulating process writes.
		// Because of this, they do not test the shell integration scripts, only what the scripts
		// are expected to write.
		describe('Write data-based tests', () => {
			before(async function () {
				await setTerminalTestSettings(app);
			});
			after(async function () {
				await settingsEditor.clearUserSettings();
			});

			// Don't use beforeEach as that ignores the retry count, createEmptyTerminal has been
			// flaky in the past
			async function beforeEachSetup() {
				// Use the simplest profile to get as little process interaction as possible
				await terminal.createEmptyTerminal();
				// Erase all content and reset cursor to top
				await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${csi('2J')}${csi('3J')}${csi('H')}`);
			}

			describe('VS Code sequences', () => {
				it('should handle the simple case', async () => {
					await beforeEachSetup();
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${vsc('A')}Prompt> ${vsc('B')}exitcode 0`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 0, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `\\r\\n${vsc('C')}Success\\r\\n${vsc('D;0')}`);
					await terminal.assertCommandDecorations({ placeholder: 0, success: 1, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${vsc('A')}Prompt> ${vsc('B')}exitcode 1`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `\\r\\n${vsc('C')}Failure\\r\\n${vsc('D;1')}`);
					await terminal.assertCommandDecorations({ placeholder: 0, success: 1, error: 1 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${vsc('A')}Prompt> ${vsc('B')}`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 });
				});
			});
			describe('Final Term sequences', () => {
				it('should handle the simple case', async () => {
					await beforeEachSetup();
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${ft('A')}Prompt> ${ft('B')}exitcode 0`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 0, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `\\r\\n${ft('C')}Success\\r\\n${ft('D;0')}`);
					await terminal.assertCommandDecorations({ placeholder: 0, success: 1, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${ft('A')}Prompt> ${ft('B')}exitcode 1`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 0 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `\\r\\n${ft('C')}Failure\\r\\n${ft('D;1')}`);
					await terminal.assertCommandDecorations({ placeholder: 0, success: 1, error: 1 });
					await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, `${ft('A')}Prompt> ${ft('B')}exitcode 1`);
					await terminal.assertCommandDecorations({ placeholder: 1, success: 1, error: 1 });
				});
			});
		});
	});
}

function ft(data: string) {
	return setTextParams(`133;${data}`);
}

function vsc(data: string) {
	return setTextParams(`633;${data}`);
}

function setTextParams(data: string) {
	return osc(`${data}\\x07`);
}

function osc(data: string) {
	return `\\x1b]${data}`;
}

function csi(data: string) {
	return `\\x1b[${data}`;
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-splitCwd.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-splitCwd.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal splitCwd', () => {
		// Acquire automation API
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;
		before(async function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app, [
				['terminal.integrated.splitCwd', '"inherited"']
			]);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		it('should inherit cwd when split and update the tab description - alt click', async () => {
			await terminal.createTerminal();
			const cwd = 'test';
			await terminal.runCommandInTerminal(`mkdir ${cwd}`);
			await terminal.runCommandInTerminal(`cd ${cwd}`);
			const page = await terminal.getPage();
			page.keyboard.down('Alt');
			await terminal.clickSingleTab();
			page.keyboard.up('Alt');
			await terminal.assertTerminalGroups([[{ description: cwd }, { description: cwd }]]);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-stickyScroll.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-stickyScroll.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, SettingsEditor, TerminalCommandIdWithValue } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal stickyScroll', () => {
		// Acquire automation API
		let app: Application;
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;
		before(async function () {
			app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app, [
				['terminal.integrated.stickyScroll.enabled', 'true']
			]);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		// A polling approach is used to avoid test flakiness. While it's not ideal that this
		// occurs, the main purpose of the tests is to verify sticky scroll shows and updates,
		// not edge case race conditions on terminal start up
		async function checkCommandAndOutput(
			command: string,
			exitCode: number,
			prompt: string = 'Prompt> ',
			expectedLineCount: number = 1
		): Promise<void> {
			const data = generateCommandAndOutput(prompt, command, exitCode);
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.WriteDataToTerminal, data);
			// Verify line count
			await app.code.waitForElements('.terminal-sticky-scroll .xterm-rows > *', true, e => e.length === expectedLineCount);
			// Verify content
			const element = await app.code.getElement('.terminal-sticky-scroll .xterm-rows');
			if (
				element &&
				// New lines don't come through in textContent
				element.textContent.indexOf(`${prompt.replace(/\\r\\n/g, '')}${command}`) >= 0
			) {
				return;
			}
			throw new Error(`Failed for command ${command}, exitcode ${exitCode}, text content ${element?.textContent}`);
		}

		// Don't use beforeEach as that ignores the retry count, createEmptyTerminal has been
		// flaky in the past
		async function beforeEachSetup() {
			// Create the simplest system profile to get as little process interaction as possible
			await terminal.createEmptyTerminal();
		}

		it('should show sticky scroll when appropriate', async () => {
			await beforeEachSetup();

			// Write prompt, fill viewport, finish command, print new prompt, verify sticky scroll
			await checkCommandAndOutput('sticky scroll 1', 0);

			// And again with a failed command
			await checkCommandAndOutput('sticky scroll 2', 1);
		});

		it('should support multi-line prompt', async () => {
			await beforeEachSetup();

			// Standard multi-line prompt
			await checkCommandAndOutput('sticky scroll 1', 0, 'Multi-line\\r\\nPrompt> ', 2);

			// New line before prompt
			await checkCommandAndOutput('sticky scroll 2', 0, '\\r\\nMulti-line Prompt> ', 1);

			// New line before multi-line prompt
			await checkCommandAndOutput('sticky scroll 3', 0, '\\r\\nMulti-line\\r\\nPrompt> ', 2);
		});
	});
}

function generateCommandAndOutput(prompt: string, command: string, exitCode: number): string {
	return [
		`${vsc('A')}${prompt}${vsc('B')}${command}`,
		`\\r\\n${vsc('C')}`,
		`\\r\\ndata`.repeat(50),
		`\\r\\n${vsc(`D;${exitCode}`)}`,
	].join('');
}

function vsc(data: string) {
	return setTextParams(`633;${data}`);
}

function setTextParams(data: string) {
	return osc(`${data}\\x07`);
}

function osc(data: string) {
	return `\\x1b]${data}`;
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal-tabs.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal-tabs.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, TerminalCommandId, TerminalCommandIdWithValue, SettingsEditor } from '../../../../automation';
import { setTerminalTestSettings } from './terminal-helpers';

export function setup(options?: { skipSuite: boolean }) {
	(options?.skipSuite ? describe.skip : describe)('Terminal Tabs', () => {
		// Acquire automation API
		let terminal: Terminal;
		let settingsEditor: SettingsEditor;

		before(async function () {
			const app = this.app as Application;
			terminal = app.workbench.terminal;
			settingsEditor = app.workbench.settingsEditor;
			await setTerminalTestSettings(app);
		});

		after(async function () {
			await settingsEditor.clearUserSettings();
		});

		it('clicking the plus button should create a terminal and display the tabs view showing no split decorations', async () => {
			await terminal.createTerminal();
			await terminal.clickPlusButton();
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should rename the single tab', async () => {
			await terminal.createTerminal();
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertSingleTab({ name });
		});

		// DEBT: Flaky https://github.com/microsoft/vscode/issues/216564
		it.skip('should reset the tab name to the default value when no name is provided', async () => {
			await terminal.createTerminal();
			const defaultName = await terminal.getSingleTabName();
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertSingleTab({ name });
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, undefined);
			await terminal.assertSingleTab({ name: defaultName });
		});

		it('should rename the tab in the tabs list', async () => {
			await terminal.createTerminal();
			await terminal.runCommand(TerminalCommandId.Split);
			const name = 'my terminal name';
			await terminal.runCommandWithValue(TerminalCommandIdWithValue.Rename, name);
			await terminal.assertTerminalGroups([[{}, { name }]]);
		});

		it('should create a split terminal when single tab is alt clicked', async () => {
			await terminal.createTerminal();
			const page = await terminal.getPage();
			page.keyboard.down('Alt');
			await terminal.clickSingleTab();
			page.keyboard.up('Alt');
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('should do nothing when join tabs is run with only one terminal', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}]]);
		});

		it('should do nothing when join tabs is run with only split terminals', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should join tabs when more than one non-split terminal', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.createTerminal();
			await terminal.runCommand(TerminalCommandId.Join);
			await terminal.assertTerminalGroups([[{}, {}]]);
		});

		it('should do nothing when unsplit tabs called with no splits', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.createTerminal();
			await terminal.assertTerminalGroups([[{}], [{}]]);
			await terminal.runCommand(TerminalCommandId.Unsplit);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should unsplit tabs', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.runCommand(TerminalCommandId.Split);
			await terminal.assertTerminalGroups([[{}, {}]]);
			await terminal.runCommand(TerminalCommandId.Unsplit);
			await terminal.assertTerminalGroups([[{}], [{}]]);
		});

		it('should move the terminal to the editor area', async () => {
			await terminal.runCommand(TerminalCommandId.Show);
			await terminal.assertSingleTab({});
			await terminal.runCommand(TerminalCommandId.MoveToEditor);
			await terminal.assertEditorGroupCount(1);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/terminal/terminal.test.ts]---
Location: vscode-main/test/smoke/src/areas/terminal/terminal.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Application, Terminal, TerminalCommandId, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';
import { setup as setupTerminalEditorsTests } from './terminal-editors.test';
import { setup as setupTerminalInputTests } from './terminal-input.test';
import { setup as setupTerminalPersistenceTests } from './terminal-persistence.test';
import { setup as setupTerminalProfileTests } from './terminal-profiles.test';
import { setup as setupTerminalTabsTests } from './terminal-tabs.test';
import { setup as setupTerminalSplitCwdTests } from './terminal-splitCwd.test';
import { setup as setupTerminalStickyScrollTests } from './terminal-stickyScroll.test';
import { setup as setupTerminalShellIntegrationTests } from './terminal-shellIntegration.test';

export function setup(logger: Logger) {
	describe('Terminal', function () {

		// Retry tests 3 times to minimize build failures due to any flakiness
		this.retries(3);

		// Shared before/after handling
		installAllHandlers(logger);

		let app: Application;
		let terminal: Terminal;
		before(async function () {
			// Fetch terminal automation API
			app = this.app as Application;
			terminal = app.workbench.terminal;
		});

		afterEach(async () => {
			// Kill all terminals between every test for a consistent testing environment
			await terminal.runCommand(TerminalCommandId.KillAll);
		});

		// https://github.com/microsoft/vscode/issues/216564
		// The pty host can crash on Linux in smoke tests for an unknown reason. We need more user
		// reports to investigate
		setupTerminalEditorsTests({ skipSuite: process.platform === 'linux' });
		setupTerminalInputTests({ skipSuite: process.platform === 'linux' });
		setupTerminalPersistenceTests({ skipSuite: process.platform === 'linux' });
		setupTerminalProfileTests({ skipSuite: process.platform === 'linux' });
		setupTerminalTabsTests({ skipSuite: process.platform === 'linux' });
		setupTerminalShellIntegrationTests({ skipSuite: process.platform === 'linux' });
		setupTerminalStickyScrollTests({ skipSuite: true });
		// https://github.com/microsoft/vscode/pull/141974
		// Windows is skipped here as well as it was never enabled from the start
		setupTerminalSplitCwdTests({ skipSuite: process.platform === 'linux' || process.platform === 'win32' });
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/workbench/data-loss.test.ts]---
Location: vscode-main/test/smoke/src/areas/workbench/data-loss.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import { Application, ApplicationOptions, Logger, Quality } from '../../../../automation';
import { createApp, timeout, installDiagnosticsHandler, installAppAfterHandler, getRandomUserDataDir, suiteLogsPath, suiteCrashPath } from '../../utils';

export function setup(ensureStableCode: () => { stableCodePath: string | undefined; stableCodeVersion: { major: number; minor: number; patch: number } | undefined }, logger: Logger) {
	describe('Data Loss (insiders -> insiders)', function () {

		// Double the timeout since these tests involve 2 startups
		this.timeout(4 * 60 * 1000);

		let app: Application | undefined = undefined;

		// Shared before/after handling
		installDiagnosticsHandler(logger, () => app);
		installAppAfterHandler(() => app);

		it('verifies opened editors are restored', async function () {
			app = createApp({
				...this.defaultOptions,
				logsPath: suiteLogsPath(this.defaultOptions, 'test_verifies_opened_editors_are_restored'),
				crashesPath: suiteCrashPath(this.defaultOptions, 'test_verifies_opened_editors_are_restored')
			});
			await app.start();

			// Open 3 editors
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'bin', 'www'));
			await app.workbench.quickaccess.runCommand('View: Keep Editor');
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'app.js'));
			await app.workbench.quickaccess.runCommand('View: Keep Editor');
			await app.workbench.editors.newUntitledFile();

			await app.restart();

			// Verify 3 editors are open
			await app.workbench.editors.selectTab('Untitled-1');
			await app.workbench.editors.selectTab('app.js');
			await app.workbench.editors.selectTab('www');

			await app.stop();
			app = undefined;
		});

		it('verifies editors can save and restore', async function () {
			app = createApp({
				...this.defaultOptions,
				logsPath: suiteLogsPath(this.defaultOptions, 'test_verifies_editors_can_save_and_restore'),
				crashesPath: suiteCrashPath(this.defaultOptions, 'test_verifies_editors_can_save_and_restore')
			});
			await app.start();

			const textToType = 'Hello, Code';

			// open editor and type
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'app.js'));
			await app.workbench.editor.waitForTypeInEditor('app.js', textToType);
			await app.workbench.editors.waitForTab('app.js', true);

			// save
			await app.workbench.editors.saveOpenedFile();
			await app.workbench.editors.waitForTab('app.js', false);

			// restart
			await app.restart();

			// verify contents
			await app.workbench.editor.waitForEditorContents('app.js', contents => contents.indexOf(textToType) > -1);

			await app.stop();
			app = undefined;
		});

		it('verifies that "hot exit" works for dirty files (without delay)', function () {
			return testHotExit.call(this, 'test_verifies_that_hot_exit_works_for_dirty_files_without_delay', undefined, undefined);
		});

		it('verifies that "hot exit" works for dirty files (with delay)', function () {
			return testHotExit.call(this, 'test_verifies_that_hot_exit_works_for_dirty_files_with_delay', 2000, undefined);
		});

		it('verifies that auto save triggers on shutdown', function () {
			return testHotExit.call(this, 'test_verifies_that_auto_save_triggers_on_shutdown', undefined, true);
		});

		async function testHotExit(this: import('mocha').Context, title: string, restartDelay: number | undefined, autoSave: boolean | undefined) {
			app = createApp({
				...this.defaultOptions,
				logsPath: suiteLogsPath(this.defaultOptions, title),
				crashesPath: suiteCrashPath(this.defaultOptions, title)
			});
			await app.start();

			if (autoSave) {
				await app.workbench.settingsEditor.addUserSetting('files.autoSave', '"afterDelay"');
			}

			const textToTypeInUntitled = 'Hello from Untitled';

			await app.workbench.editors.newUntitledFile();
			await app.workbench.editor.waitForTypeInEditor('Untitled-1', textToTypeInUntitled);
			await app.workbench.editors.waitForTab('Untitled-1', true);

			const textToType = 'Hello, Code';
			await app.workbench.quickaccess.openFile(join(app.workspacePathOrFolder, 'readme.md'));
			await app.workbench.editor.waitForTypeInEditor('readme.md', textToType);
			await app.workbench.editors.waitForTab('readme.md', !autoSave);

			if (typeof restartDelay === 'number') {
				// this is an OK use of a timeout in a smoke test:
				// we want to simulate a user having typed into
				// the editor and pausing for a moment before
				// terminating
				await timeout(restartDelay);
			}

			await app.restart();

			await app.workbench.editors.waitForTab('readme.md', !autoSave);
			await app.workbench.editors.waitForTab('Untitled-1', true);

			await app.workbench.editors.selectTab('readme.md');
			await app.workbench.editor.waitForEditorContents('readme.md', contents => contents.indexOf(textToType) > -1);

			await app.workbench.editors.selectTab('Untitled-1');
			await app.workbench.editor.waitForEditorContents('Untitled-1', contents => contents.indexOf(textToTypeInUntitled) > -1);

			await app.stop();
			app = undefined;
		}
	});

	describe('Data Loss (stable -> insiders)', function () {

		// Double the timeout since these tests involve 2 startups
		this.timeout(4 * 60 * 1000);

		let insidersApp: Application | undefined = undefined;
		let stableApp: Application | undefined = undefined;

		// Shared before/after handling
		installDiagnosticsHandler(logger, () => insidersApp ?? stableApp);
		installAppAfterHandler(() => insidersApp ?? stableApp, async () => stableApp?.stop());

		it('verifies opened editors are restored', async function () {
			const { stableCodePath, stableCodeVersion } = ensureStableCode();
			if (!stableCodePath) {
				this.skip();
			}

			// macOS: the first launch of stable Code will trigger
			// additional checks in the OS (notarization validation)
			// so it can take a very long time. as such we install
			// a retry handler to make sure we do not fail as a
			// consequence.
			if (process.platform === 'darwin') {
				this.retries(2);
			}

			const userDataDir = getRandomUserDataDir(this.defaultOptions.userDataDir);
			const logsPath = suiteLogsPath(this.defaultOptions, 'test_verifies_opened_editors_are_restored_from_stable');
			const crashesPath = suiteCrashPath(this.defaultOptions, 'test_verifies_opened_editors_are_restored_from_stable');

			const stableOptions: ApplicationOptions = Object.assign({}, this.defaultOptions);
			stableOptions.codePath = stableCodePath;
			stableOptions.userDataDir = userDataDir;
			stableOptions.quality = Quality.Stable;
			stableOptions.logsPath = logsPath;
			stableOptions.crashesPath = crashesPath;
			stableOptions.version = stableCodeVersion ?? { major: 0, minor: 0, patch: 0 };

			stableApp = new Application(stableOptions);
			await stableApp.start();

			// Open 3 editors
			await stableApp.workbench.quickaccess.openFile(join(stableApp.workspacePathOrFolder, 'bin', 'www'));
			await stableApp.workbench.quickaccess.runCommand('View: Keep Editor');
			await stableApp.workbench.quickaccess.openFile(join(stableApp.workspacePathOrFolder, 'app.js'));
			await stableApp.workbench.quickaccess.runCommand('View: Keep Editor');
			await stableApp.workbench.editors.newUntitledFile();

			await stableApp.stop();
			stableApp = undefined;

			const insiderOptions: ApplicationOptions = Object.assign({}, this.defaultOptions);
			insiderOptions.userDataDir = userDataDir;
			insiderOptions.logsPath = logsPath;
			insiderOptions.crashesPath = crashesPath;

			insidersApp = new Application(insiderOptions);
			await insidersApp.start();

			// Verify 3 editors are open
			await insidersApp.workbench.editors.selectTab('Untitled-1');
			await insidersApp.workbench.editors.selectTab('app.js');
			await insidersApp.workbench.editors.selectTab('www');

			await insidersApp.stop();
			insidersApp = undefined;
		});

		it('verifies that "hot exit" works for dirty files (without delay)', async function () {
			return testHotExit.call(this, `test_verifies_that_hot_exit_works_for_dirty_files_without_delay_from_stable`, undefined);
		});

		it('verifies that "hot exit" works for dirty files (with delay)', async function () {
			return testHotExit.call(this, `test_verifies_that_hot_exit_works_for_dirty_files_with_delay_from_stable`, 2000);
		});

		async function testHotExit(this: import('mocha').Context, title: string, restartDelay: number | undefined) {
			const { stableCodePath, stableCodeVersion } = ensureStableCode();
			if (!stableCodePath) {
				this.skip();
			}

			const userDataDir = getRandomUserDataDir(this.defaultOptions.userDataDir);
			const logsPath = suiteLogsPath(this.defaultOptions, title);
			const crashesPath = suiteCrashPath(this.defaultOptions, title);

			const stableOptions: ApplicationOptions = Object.assign({}, this.defaultOptions);
			stableOptions.codePath = stableCodePath;
			stableOptions.userDataDir = userDataDir;
			stableOptions.quality = Quality.Stable;
			stableOptions.logsPath = logsPath;
			stableOptions.crashesPath = crashesPath;
			stableOptions.version = stableCodeVersion ?? { major: 0, minor: 0, patch: 0 };

			stableApp = new Application(stableOptions);
			await stableApp.start();

			const textToTypeInUntitled = 'Hello from Untitled';

			await stableApp.workbench.editors.newUntitledFile();
			await stableApp.workbench.editor.waitForTypeInEditor('Untitled-1', textToTypeInUntitled);
			await stableApp.workbench.editors.waitForTab('Untitled-1', true);

			const textToType = 'Hello, Code';
			await stableApp.workbench.quickaccess.openFile(join(stableApp.workspacePathOrFolder, 'readme.md'));
			await stableApp.workbench.editor.waitForTypeInEditor('readme.md', textToType);
			await stableApp.workbench.editors.waitForTab('readme.md', true);

			if (typeof restartDelay === 'number') {
				// this is an OK use of a timeout in a smoke test
				// we want to simulate a user having typed into
				// the editor and pausing for a moment before
				// terminating
				await timeout(restartDelay);
			}

			await stableApp.stop();
			stableApp = undefined;

			const insiderOptions: ApplicationOptions = Object.assign({}, this.defaultOptions);
			insiderOptions.userDataDir = userDataDir;
			insiderOptions.logsPath = logsPath;
			insiderOptions.crashesPath = crashesPath;

			insidersApp = new Application(insiderOptions);
			await insidersApp.start();

			await insidersApp.workbench.editors.waitForTab('readme.md', true);
			await insidersApp.workbench.editors.waitForTab('Untitled-1', true);

			await insidersApp.workbench.editors.selectTab('readme.md');
			await insidersApp.workbench.editor.waitForEditorContents('readme.md', contents => contents.indexOf(textToType) > -1);

			await insidersApp.workbench.editors.selectTab('Untitled-1');
			await insidersApp.workbench.editor.waitForEditorContents('Untitled-1', contents => contents.indexOf(textToTypeInUntitled) > -1);

			await insidersApp.stop();
			insidersApp = undefined;
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/workbench/launch.test.ts]---
Location: vscode-main/test/smoke/src/areas/workbench/launch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from 'path';
import { Application, Logger } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {
	describe('Launch', () => {

		// Shared before/after handling
		installAllHandlers(logger, opts => {
			if (opts.userDataDir) {
				return { ...opts, userDataDir: join(opts.userDataDir, 'ø') };
			}
			return opts;
		});

		it('verifies that application launches when user data directory has non-ascii characters', async function () {
			const app = this.app as Application;
			await app.workbench.explorer.openExplorerView();
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/src/areas/workbench/localization.test.ts]---
Location: vscode-main/test/smoke/src/areas/workbench/localization.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Logger, Application } from '../../../../automation';
import { installAllHandlers } from '../../utils';

export function setup(logger: Logger) {

	describe('Localization', () => {

		// Shared before/after handling
		installAllHandlers(logger, opts => {
			opts.verbose = true; // enable verbose logging for tracing
			opts.snapshots = true; // enable network tab in devtools for tracing since we install an extension
			return opts;
		});

		it('starts with "DE" locale and verifies title and viewlets text is in German', async function () {
			const app = this.app as Application;

			await app.workbench.extensions.installExtension('ms-ceintl.vscode-language-pack-de', false);
			await app.restart({ extraArgs: ['--locale=DE'] });

			const result = await app.workbench.localization.getLocalizedStrings();
			const localeInfo = await app.workbench.localization.getLocaleInfo();

			if (localeInfo.locale === undefined || localeInfo.locale.toLowerCase() !== 'de') {
				throw new Error(`The requested locale for VS Code was not German. The received value is: ${localeInfo.locale === undefined ? 'not set' : localeInfo.locale}`);
			}

			if (localeInfo.language.toLowerCase() !== 'de') {
				throw new Error(`The UI language is not German. It is ${localeInfo.language}`);
			}

			if (result.open.toLowerCase() !== 'öffnen' || result.close.toLowerCase() !== 'schließen' || result.find.toLowerCase() !== 'finden') {
				throw new Error(`Received wrong German localized strings: ${JSON.stringify(result, undefined, 0)}`);
			}
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: test/smoke/test/index.js]---
Location: vscode-main/test/smoke/test/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const { join } = require('path');
const Mocha = require('mocha');
const minimist = require('minimist');

const [, , ...args] = process.argv;
const opts = minimist(args, {
	boolean: ['web'],
	string: ['f', 'g']
});

const suite = opts['web'] ? 'Browser Smoke Tests' : 'Desktop Smoke Tests';

const options = {
	color: true,
	timeout: 2 * 60 * 1000,
	slow: 30 * 1000,
	grep: opts['f'] || opts['g']
};

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: join(process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

const mocha = new Mocha(options);
mocha.addFile('out/main.js');
mocha.run(failures => {

	// Indicate location of log files for further diagnosis
	if (failures) {
		const rootPath = join(__dirname, '..', '..', '..');
		const logPath = join(rootPath, '.build', 'logs');

		if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY) {
			console.log(`
###################################################################
#                                                                 #
# Logs are attached as build artefact and can be downloaded       #
# from the build Summary page (Summary -> Related -> N published) #
#                                                                 #
# Please also scan through attached crash logs in case the        #
# failure was caused by a native crash.                           #
#                                                                 #
# Show playwright traces on: https://trace.playwright.dev/        #
#                                                                 #
###################################################################
		`);
		} else if (process.env.GITHUB_WORKSPACE) {
			console.log(`
###################################################################
#                                                                 #
# Logs are attached as build artefact and can be downloaded       #
# from the build Summary page:                                    #
# - click on "Summary" in the top left corner                     #
# - scroll all the way down to "Artifacts"                        #
#                                                                 #
# Please also scan through attached crash logs in case the        #
# failure was caused by a native crash.                           #
#                                                                 #
# Show playwright traces on: https://trace.playwright.dev/        #
#                                                                 #
###################################################################
		`);
		} else {
			console.log(`
#############################################
#
# Log files of client & server are stored into
# '${logPath}'.
#
# Logs of the smoke test runner are stored into
# 'smoke-test-runner.log' in respective folder.
#
#############################################
		`);
		}
	}

	process.exit(failures ? -1 : 0);
});
```

--------------------------------------------------------------------------------

---[FILE: test/unit/analyzeSnapshot.js]---
Location: vscode-main/test/unit/analyzeSnapshot.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

// note: we use a fork here since we can't make a worker from the renderer process

const { fork } = require('child_process');
const workerData = process.env.SNAPSHOT_WORKER_DATA;
const fs = require('fs');
const { pathToFileURL } = require('url');

if (!workerData) {
	const { join } = require('path');
	const { tmpdir } = require('os');

	exports.takeSnapshotAndCountClasses = async (/** @type string */currentTest, /** @type string[] */ classes) => {
		const cleanTitle = currentTest.replace(/[^\w]+/g, '-');
		const file = join(tmpdir(), `vscode-test-snap-${cleanTitle}.heapsnapshot`);

		if (typeof process.takeHeapSnapshot !== 'function') {
			// node.js:
			const inspector = require('inspector');
			const session = new inspector.Session();
			session.connect();

			const fd = fs.openSync(file, 'w');
			await new Promise((resolve, reject) => {
				session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
					fs.writeSync(fd, m.params.chunk);
				});

				session.post('HeapProfiler.takeHeapSnapshot', null, (err) => {
					session.disconnect();
					fs.closeSync(fd);
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		} else {
			// electron exposes this nice method for us:
			process.takeHeapSnapshot(file);
		}

		const worker = fork(__filename, {
			env: {
				...process.env,
				SNAPSHOT_WORKER_DATA: JSON.stringify({
					path: file,
					classes,
				})
			}
		});

		const promise = new Promise((resolve, reject) => {
			worker.on('message', (/** @type any */msg) => {
				if ('err' in msg) {
					reject(new Error(msg.err));
				} else {
					resolve(msg.counts);
				}
				worker.kill();
			});
		});

		return { done: promise, file: pathToFileURL(file) };
	};
} else {
	const { path, classes } = JSON.parse(workerData);
	const { decode_bytes } = require('@vscode/v8-heap-parser');

	fs.promises.readFile(path)
		.then(buf => decode_bytes(buf))
		.then(graph => graph.get_class_counts(classes))
		.then(
			counts => process.send({ counts: Array.from(counts) }),
			err => process.send({ err: String(err.stack || err) })
		);

}
```

--------------------------------------------------------------------------------

---[FILE: test/unit/assert.js]---
Location: vscode-main/test/unit/assert.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// UTILITY

// Object.create compatible in IE
const create = Object.create || function (p) {
	if (!p) { throw Error('no type'); }
	function f() { }
	f.prototype = p;
	return new f();
  };

  // UTILITY
  var util = {
	inherits: function (ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = create(superCtor.prototype, {
		constructor: {
		  value: ctor,
		  enumerable: false,
		  writable: true,
		  configurable: true
		}
	  });
	},
	isArray: function (ar) {
	  return Array.isArray(ar);
	},
	isBoolean: function (arg) {
	  return typeof arg === 'boolean';
	},
	isNull: function (arg) {
	  return arg === null;
	},
	isNullOrUndefined: function (arg) {
	  return arg == null;
	},
	isNumber: function (arg) {
	  return typeof arg === 'number';
	},
	isString: function (arg) {
	  return typeof arg === 'string';
	},
	isSymbol: function (arg) {
	  return typeof arg === 'symbol';
	},
	isUndefined: function (arg) {
	  return arg === undefined;
	},
	isRegExp: function (re) {
	  return util.isObject(re) && util.objectToString(re) === '[object RegExp]';
	},
	isObject: function (arg) {
	  return typeof arg === 'object' && arg !== null;
	},
	isDate: function (d) {
	  return util.isObject(d) && util.objectToString(d) === '[object Date]';
	},
	isError: function (e) {
	  return isObject(e) &&
		(objectToString(e) === '[object Error]' || e instanceof Error);
	},
	isFunction: function (arg) {
	  return typeof arg === 'function';
	},
	isPrimitive: function (arg) {
	  return arg === null ||
		typeof arg === 'boolean' ||
		typeof arg === 'number' ||
		typeof arg === 'string' ||
		typeof arg === 'symbol' ||  // ES6 symbol
		typeof arg === 'undefined';
	},
	objectToString: function (o) {
	  return Object.prototype.toString.call(o);
	}
  };

  const pSlice = Array.prototype.slice;

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  const Object_keys = typeof Object.keys === 'function' ? Object.keys : (function () {
	const hasOwnProperty = Object.prototype.hasOwnProperty,
	  hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	  dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	  ],
	  dontEnumsLength = dontEnums.length;

	return function (obj) {
	  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
		throw new TypeError('Object.keys called on non-object');
	  }

	  let result = [], prop, i;

	  for (prop in obj) {
		if (hasOwnProperty.call(obj, prop)) {
		  result.push(prop);
		}
	  }

	  if (hasDontEnumBug) {
		for (i = 0; i < dontEnumsLength; i++) {
		  if (hasOwnProperty.call(obj, dontEnums[i])) {
			result.push(dontEnums[i]);
		  }
		}
	  }
	  return result;
	};
  })();

  // 1. The assert module provides functions that throw
  // AssertionError's when particular conditions are not met. The
  // assert module must conform to the following interface.

  const assert = ok;

  // 2. The AssertionError is defined in assert.
  // new assert.AssertionError({ message: message,
  //                             actual: actual,
  //                             expected: expected })

  assert.AssertionError = function AssertionError(options) {
	this.name = 'AssertionError';
	this.actual = options.actual;
	this.expected = options.expected;
	this.operator = options.operator;
	if (options.message) {
	  this.message = options.message;
	  this.generatedMessage = false;
	} else {
	  this.message = getMessage(this);
	  this.generatedMessage = true;
	}
	const stackStartFunction = options.stackStartFunction || fail;
	if (Error.captureStackTrace) {
	  Error.captureStackTrace(this, stackStartFunction);
	} else {
	  // try to throw an error now, and from the stack property
	  // work out the line that called in to assert.js.
	  try {
		this.stack = (new Error).stack.toString();
	  } catch (e) { }
	}
  };

  // assert.AssertionError instanceof Error
  util.inherits(assert.AssertionError, Error);

  function replacer(key, value) {
	if (util.isUndefined(value)) {
	  return '' + value;
	}
	if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
	  return value.toString();
	}
	if (util.isFunction(value) || util.isRegExp(value)) {
	  return value.toString();
	}
	return value;
  }

  function truncate(s, n) {
	if (util.isString(s)) {
	  return s.length < n ? s : s.slice(0, n);
	} else {
	  return s;
	}
  }

  function getMessage(self) {
	return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	  self.operator + ' ' +
	  truncate(JSON.stringify(self.expected, replacer), 128);
  }

  // At present only the three keys mentioned above are used and
  // understood by the spec. Implementations or sub modules can pass
  // other keys to the AssertionError's constructor - they will be
  // ignored.

  // 3. All of the following functions must throw an AssertionError
  // when a corresponding condition is not met, with a message that
  // may be undefined if not provided.  All assertion methods provide
  // both the actual and expected values to the assertion error for
  // display purposes.

  export function fail(actual, expected, message, operator, stackStartFunction) {
	throw new assert.AssertionError({
	  message: message,
	  actual: actual,
	  expected: expected,
	  operator: operator,
	  stackStartFunction: stackStartFunction
	});
  }

  // EXTENSION! allows for well behaved errors defined elsewhere.
  assert.fail = fail;

  // 4. Pure assertion tests whether a value is truthy, as determined
  // by !!guard.
  // assert.ok(guard, message_opt);
  // This statement is equivalent to assert.equal(true, !!guard,
  // message_opt);. To test strictly for the value true, use
  // assert.strictEqual(true, guard, message_opt);.

  export function ok(value, message) {
	if (!value) { fail(value, true, message, '==', assert.ok); }
  }
  assert.ok = ok;

  // 5. The equality assertion tests shallow, coercive equality with
  // ==.
  // assert.equal(actual, expected, message_opt);

  assert.equal = function equal(actual, expected, message) {
	if (actual != expected) { fail(actual, expected, message, '==', assert.equal); }
  };

  // 6. The non-equality assertion tests for whether two objects are not equal
  // with != assert.notEqual(actual, expected, message_opt);

  assert.notEqual = function notEqual(actual, expected, message) {
	if (actual == expected) {
	  fail(actual, expected, message, '!=', assert.notEqual);
	}
  };

  // 7. The equivalence assertion tests a deep equality relation.
  // assert.deepEqual(actual, expected, message_opt);

  assert.deepEqual = function deepEqual(actual, expected, message) {
	if (!_deepEqual(actual, expected, false)) {
	  fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	}
  };

  assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	if (!_deepEqual(actual, expected, true)) {
	  fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	}
  };

  function _deepEqual(actual, expected, strict) {
	// 7.1. All identical values are equivalent, as determined by ===.
	if (actual === expected) {
	  return true;
	  // } else if (actual instanceof Buffer && expected instanceof Buffer) {
	  //   return compare(actual, expected) === 0;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	} else if (util.isDate(actual) && util.isDate(expected)) {
	  return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	} else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	  return actual.source === expected.source &&
		actual.global === expected.global &&
		actual.multiline === expected.multiline &&
		actual.lastIndex === expected.lastIndex &&
		actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	} else if ((actual === null || typeof actual !== 'object') &&
	  (expected === null || typeof expected !== 'object')) {
	  return strict ? actual === expected : actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	} else {
	  return objEquiv(actual, expected, strict);
	}
  }

  function isArguments(object) {
	return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function objEquiv(a, b, strict) {
	if (a === null || a === undefined || b === null || b === undefined) { return false; }
	// if one is a primitive, the other must be same
	if (util.isPrimitive(a) || util.isPrimitive(b)) { return a === b; }
	if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) { return false; }
	const aIsArgs = isArguments(a),
	  bIsArgs = isArguments(b);
	if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) { return false; }
	if (aIsArgs) {
	  a = pSlice.call(a);
	  b = pSlice.call(b);
	  return _deepEqual(a, b, strict);
	}
	let ka = Object.keys(a),
	  kb = Object.keys(b),
	  key, i;
	// having the same number of owned properties (keys incorporates
	// hasOwnProperty)
	if (ka.length !== kb.length) { return false; }
	//the same set of keys (although not necessarily the same order),
	ka.sort();
	kb.sort();
	//~~~cheap key test
	for (i = ka.length - 1; i >= 0; i--) {
	  if (ka[i] !== kb[i]) { return false; }
	}
	//equivalent values for every corresponding key, and
	//~~~possibly expensive deep test
	for (i = ka.length - 1; i >= 0; i--) {
	  key = ka[i];
	  if (!_deepEqual(a[key], b[key], strict)) { return false; }
	}
	return true;
  }

  // 8. The non-equivalence assertion tests for any deep inequality.
  // assert.notDeepEqual(actual, expected, message_opt);

  assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	if (_deepEqual(actual, expected, false)) {
	  fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	}
  };

  assert.notDeepStrictEqual = notDeepStrictEqual;
  export function notDeepStrictEqual(actual, expected, message) {
	if (_deepEqual(actual, expected, true)) {
	  fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	}
  }


  // 9. The strict equality assertion tests strict equality, as determined by ===.
  // assert.strictEqual(actual, expected, message_opt);

  assert.strictEqual = function strictEqual(actual, expected, message) {
	if (actual !== expected) {
	  fail(actual, expected, message, '===', assert.strictEqual);
	}
  };

  // 10. The strict non-equality assertion tests for strict inequality, as
  // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

  assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	if (actual === expected) {
	  fail(actual, expected, message, '!==', assert.notStrictEqual);
	}
  };

  function expectedException(actual, expected) {
	if (!actual || !expected) {
	  return false;
	}

	if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	  return expected.test(actual);
	} else if (actual instanceof expected) {
	  return true;
	} else if (expected.call({}, actual) === true) {
	  return true;
	}

	return false;
  }

  function _throws(shouldThrow, block, expected, message) {
	let actual;

	if (typeof block !== 'function') {
	  throw new TypeError('block must be a function');
	}

	if (typeof expected === 'string') {
	  message = expected;
	  expected = null;
	}

	try {
	  block();
	} catch (e) {
	  actual = e;
	}

	message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	  (message ? ' ' + message : '.');

	if (shouldThrow && !actual) {
	  fail(actual, expected, 'Missing expected exception' + message);
	}

	if (!shouldThrow && expectedException(actual, expected)) {
	  fail(actual, expected, 'Got unwanted exception' + message);
	}

	if ((shouldThrow && actual && expected &&
	  !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	  throw actual;
	}
  }

  // 11. Expected to throw an error:
  // assert.throws(block, Error_opt, message_opt);

  assert.throws = function (block, /*optional*/error, /*optional*/message) {
	_throws.apply(this, [true].concat(pSlice.call(arguments)));
  };

  // EXTENSION! This is annoying to write outside this module.
  assert.doesNotThrow = function (block, /*optional*/message) {
	_throws.apply(this, [false].concat(pSlice.call(arguments)));
  };

  assert.ifError = function (err) { if (err) { throw err; } };

  function checkIsPromise(obj) {
	return (obj !== null && typeof obj === 'object' &&
	  typeof obj.then === 'function' &&
	  typeof obj.catch === 'function');
  }

  const NO_EXCEPTION_SENTINEL = {};
  async function waitForActual(promiseFn) {
	let resultPromise;
	if (typeof promiseFn === 'function') {
	  // Return a rejected promise if `promiseFn` throws synchronously.
	  resultPromise = promiseFn();
	  // Fail in case no promise is returned.
	  if (!checkIsPromise(resultPromise)) {
		throw new Error('ERR_INVALID_RETURN_VALUE: promiseFn did not return Promise. ' + resultPromise);
	  }
	} else if (checkIsPromise(promiseFn)) {
	  resultPromise = promiseFn;
	} else {
	  throw new Error('ERR_INVALID_ARG_TYPE: promiseFn is not Function or Promise. ' + promiseFn);
	}

	try {
	  await resultPromise;
	} catch (e) {
	  return e;
	}
	return NO_EXCEPTION_SENTINEL;
  }

  function expectsError(shouldHaveError, actual, message) {
	if (shouldHaveError && actual === NO_EXCEPTION_SENTINEL) {
	  fail(undefined, 'Error', `Missing expected rejection${message ? ': ' + message : ''}`)
	} else if (!shouldHaveError && actual !== NO_EXCEPTION_SENTINEL) {
	  fail(actual, undefined, `Got unexpected rejection (${actual.message})${message ? ': ' + message : ''}`)
	}
  }

  assert.rejects = async function rejects(promiseFn, message) {
	expectsError(true, await waitForActual(promiseFn), message);
  };

  assert.doesNotReject = async function doesNotReject(fn, message) {
	expectsError(false, await waitForActual(fn), message);
  };

  // ESM export
  export default assert;
  export const AssertionError = assert.AssertionError
  // export const fail = assert.fail
  // export const ok = assert.ok
  export const equal = assert.equal
  export const notEqual = assert.notEqual
  export const deepEqual = assert.deepEqual
  export const deepStrictEqual = assert.deepStrictEqual
  export const notDeepEqual = assert.notDeepEqual
  // export const notDeepStrictEqual = assert.notDeepStrictEqual
  export const strictEqual = assert.strictEqual
  export const notStrictEqual = assert.notStrictEqual
  export const throws = assert.throws
  export const doesNotThrow = assert.doesNotThrow
  export const ifError = assert.ifError
  export const rejects = assert.rejects
  export const doesNotReject = assert.doesNotReject
```

--------------------------------------------------------------------------------

---[FILE: test/unit/coverage.js]---
Location: vscode-main/test/unit/coverage.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const minimatch = require('minimatch');
const fs = require('fs');
const path = require('path');
const iLibInstrument = require('istanbul-lib-instrument');
const iLibCoverage = require('istanbul-lib-coverage');
const iLibSourceMaps = require('istanbul-lib-source-maps');
const iLibReport = require('istanbul-lib-report');
const iReports = require('istanbul-reports');

const REPO_PATH = toUpperDriveLetter(path.join(__dirname, '../../'));

exports.initialize = function (loaderConfig) {
	const instrumenter = iLibInstrument.createInstrumenter();
	loaderConfig.nodeInstrumenter = function (contents, source) {
		if (minimatch(source, '**/test/**')) {
			// tests don't get instrumented
			return contents;
		}
		// Try to find a .map file
		let map = undefined;
		try {
			map = JSON.parse(fs.readFileSync(`${source}.map`).toString());
		} catch (err) {
			// missing source map...
		}
		try {
			return instrumenter.instrumentSync(contents, source, map);
		} catch (e) {
			console.error(`Error instrumenting ${source}: ${e}`);
			throw e;
		}
	};
};

exports.createReport = function (isSingle, coveragePath, formats) {
	const mapStore = iLibSourceMaps.createSourceMapStore();
	const coverageMap = iLibCoverage.createCoverageMap(global.__coverage__);
	return mapStore.transformCoverage(coverageMap).then((transformed) => {
		// Paths come out all broken
		const newData = Object.create(null);
		Object.keys(transformed.data).forEach((file) => {
			const entry = transformed.data[file];
			const fixedPath = fixPath(entry.path);
			entry.data.path = fixedPath;
			newData[fixedPath] = entry;
		});
		transformed.data = newData;

		const context = iLibReport.createContext({
			dir: coveragePath || path.join(REPO_PATH, `.build/coverage${isSingle ? '-single' : ''}`),
			coverageMap: transformed
		});
		const tree = context.getTree('flat');

		const reports = [];
		if (formats) {
			if (typeof formats === 'string') {
				formats = [formats];
			}
			formats.forEach(format => {
				reports.push(iReports.create(format));
			});
		} else if (isSingle) {
			reports.push(iReports.create('lcovonly'));
		} else {
			reports.push(iReports.create('json'));
			reports.push(iReports.create('lcov'));
			reports.push(iReports.create('html'));
		}
		reports.forEach(report => tree.visit(report, context));
	});
};

function toUpperDriveLetter(str) {
	if (/^[a-z]:/.test(str)) {
		return str.charAt(0).toUpperCase() + str.substr(1);
	}
	return str;
}

function toLowerDriveLetter(str) {
	if (/^[A-Z]:/.test(str)) {
		return str.charAt(0).toLowerCase() + str.substr(1);
	}
	return str;
}

function fixPath(brokenPath) {
	const startIndex = brokenPath.lastIndexOf(REPO_PATH);
	if (startIndex === -1) {
		return toLowerDriveLetter(brokenPath);
	}
	return toLowerDriveLetter(brokenPath.substr(startIndex));
}
```

--------------------------------------------------------------------------------

---[FILE: test/unit/fullJsonStreamReporter.js]---
Location: vscode-main/test/unit/fullJsonStreamReporter.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { constants } = require('mocha/lib/runner');
const BaseRunner = require('mocha/lib/reporters/base');

const {
	EVENT_TEST_BEGIN,
	EVENT_TEST_PASS,
	EVENT_TEST_FAIL,
	EVENT_RUN_BEGIN,
	EVENT_RUN_END,
} = constants;

/**
 * Similar to the mocha JSON stream, but includes additional information
 * on failure. Specifically, the mocha json-stream does not include unmangled
 * expected versus actual results.
 *
 * Writes a superset of the data that json-stream normally would.
 */
module.exports = class FullJsonStreamReporter extends BaseRunner {
	constructor(runner, options) {
		super(runner, options);

		const total = runner.total;
		runner.once(EVENT_RUN_BEGIN, () => this.writeEvent(['start', { total }]));
		runner.once(EVENT_RUN_END, () => this.writeEvent(['end', this.stats]));

		// custom coverage events:
		runner.on('coverage init', (c) => this.writeEvent(['coverageInit', c]));
		runner.on('coverage increment', (context, coverage) => this.writeEvent(['coverageIncrement', { ...context, coverage }]));

		runner.on(EVENT_TEST_BEGIN, test => this.writeEvent(['testStart', clean(test)]));
		runner.on(EVENT_TEST_PASS, test => this.writeEvent(['pass', clean(test)]));
		runner.on(EVENT_TEST_FAIL, (test, err) => {
			test = clean(test);
			test.actual = err.actual;
			test.expected = err.expected;
			test.actualJSON = err.actualJSON;
			test.expectedJSON = err.expectedJSON;
			test.snapshotPath = err.snapshotPath;
			test.err = err.message;
			test.stack = err.stack || null;
			this.writeEvent(['fail', test]);
		});
	}

	drain() {
		return Promise.resolve(this.lastEvent);
	}

	writeEvent(event) {
		this.lastEvent = new Promise(r => process.stdout.write(JSON.stringify(event) + '\n', r));
	}
};

const clean = test => ({
	title: test.title,
	fullTitle: test.fullTitle(),
	duration: test.duration,
	currentRetry: test.currentRetry()
});
```

--------------------------------------------------------------------------------

---[FILE: test/unit/README.md]---
Location: vscode-main/test/unit/README.md

```markdown
# Unit Tests

## Run (inside Electron)

    ./scripts/test.[sh|bat]

All unit tests are run inside a Electron renderer environment which access to DOM and Nodejs api. This is the closest to the environment in which VS Code itself ships. Notes:

- use the `--debug` to see an electron window with dev tools which allows for debugging
- to run only a subset of tests use the `--run` or `--glob` options
- use `npm run watch` to automatically compile changes

For instance, `./scripts/test.sh --debug --glob **/extHost*.test.js` runs all tests from `extHost`-files and enables you to debug them.

## Run (inside browser)

    npm run test-browser -- --browser webkit --browser chromium

Unit tests from layers `common` and `browser` are run inside `chromium`, `webkit`, and (soon'ish) `firefox` (using playwright). This complements our electron-based unit test runner and adds more coverage of supported platforms. Notes:

- these tests are part of the continuous build, that means you might have test failures that only happen with webkit on _windows_ or _chromium_ on linux
- you can run these tests locally via `npm run test-browser -- --browser chromium --browser webkit`
- to debug, open `<vscode>/test/unit/browser/renderer.html` inside a browser and use the `?m=<amd_module>`-query to specify what AMD module to load, e.g `file:///Users/jrieken/Code/vscode/test/unit/browser/renderer.html?m=vs/base/test/common/strings.test` runs all tests from `strings.test.ts`
- to run only a subset of tests use the `--run` or `--glob` options

**Note**: you can enable verbose logging of playwright library by setting a `DEBUG` environment variable before running the tests (https://playwright.dev/docs/debug#verbose-api-logs)

## Run (with node)

    npm run test-node -- --run src/vs/editor/test/browser/controller/cursor.test.ts

## Coverage

The following command will create a `coverage` folder in the `.build` folder at the root of the workspace:

### OS X and Linux

    ./scripts/test.sh --coverage

### Windows

    scripts\test --coverage
```

--------------------------------------------------------------------------------

---[FILE: test/unit/reporter.js]---
Location: vscode-main/test/unit/reporter.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const mocha = require('mocha');
const FullJsonStreamReporter = require('./fullJsonStreamReporter');
const path = require('path');

function parseReporterOption(value) {
	const r = /^([^=]+)=(.*)$/.exec(value);
	return r ? { [r[1]]: r[2] } : {};
}

exports.importMochaReporter = name => {
	if (name === 'full-json-stream') {
		return FullJsonStreamReporter;
	}

	const reporterPath = path.join(path.dirname(require.resolve('mocha')), 'lib', 'reporters', name);
	return require(reporterPath);
};

exports.applyReporter = (runner, argv) => {
	let Reporter;
	try {
		Reporter = exports.importMochaReporter(argv.reporter);
	} catch (err) {
		try {
			Reporter = require(argv.reporter);
		} catch (err) {
			Reporter = process.platform === 'win32' ? mocha.reporters.List : mocha.reporters.Spec;
			console.warn(`could not load reporter: ${argv.reporter}, using ${Reporter.name}`);
		}
	}

	let reporterOptions = argv['reporter-options'];
	reporterOptions = typeof reporterOptions === 'string' ? [reporterOptions] : reporterOptions;
	reporterOptions = reporterOptions.reduce((r, o) => Object.assign(r, parseReporterOption(o)), {});

	return new Reporter(runner, { reporterOptions });
};
```

--------------------------------------------------------------------------------

---[FILE: test/unit/browser/index.js]---
Location: vscode-main/test/unit/browser/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

const path = require('path');
const glob = require('glob');
const events = require('events');
const mocha = require('mocha');
const createStatsCollector = require('mocha/lib/stats-collector');
const MochaJUnitReporter = require('mocha-junit-reporter');
const url = require('url');
const minimatch = require('minimatch');
const fs = require('fs');
const playwright = require('@playwright/test');
const { applyReporter } = require('../reporter');
const yaserver = require('yaserver');
const http = require('http');
const { randomBytes } = require('crypto');
const minimist = require('minimist');
const { promisify } = require('node:util');

/**
 * @type {{
 * run: string;
 * grep: string;
 * runGlob: string;
 * browser: string;
 * reporter: string;
 * 'reporter-options': string;
 * tfs: string;
 * build: boolean;
 * debug: boolean;
 * sequential: boolean;
 * help: boolean;
 * }}
*/
const args = minimist(process.argv.slice(2), {
	boolean: ['build', 'debug', 'sequential', 'help'],
	string: ['run', 'grep', 'runGlob', 'browser', 'reporter', 'reporter-options', 'tfs'],
	default: {
		build: false,
		browser: ['chromium', 'firefox', 'webkit'],
		reporter: process.platform === 'win32' ? 'list' : 'spec',
		'reporter-options': ''
	},
	alias: {
		grep: ['g', 'f'],
		runGlob: ['glob', 'runGrep'],
		debug: ['debug-browser'],
		help: 'h'
	},
	describe: {
		build: 'run with build output (out-build)',
		run: 'only run tests matching <relative_file_path>',
		grep: 'only run tests matching <pattern>',
		debug: 'do not run browsers headless',
		sequential: 'only run suites for a single browser at a time',
		browser: 'browsers in which tests should run',
		reporter: 'the mocha reporter',
		'reporter-options': 'the mocha reporter options',
		tfs: 'tfs',
		help: 'show the help'
	}
});

if (args.help) {
	console.log(`Usage: node ${process.argv[1]} [options]

Options:
--build              run with build output (out-build)
--run <relative_file_path> only run tests matching <relative_file_path>
--grep, -g, -f <pattern> only run tests matching <pattern>
--debug, --debug-browser do not run browsers headless
--sequential         only run suites for a single browser at a time
--browser <browser>  browsers in which tests should run. separate the channel with a dash, e.g. 'chromium-msedge' or 'chromium-chrome'
--reporter <reporter> the mocha reporter
--reporter-options <reporter-options> the mocha reporter options
--tfs <tfs>          tfs
--help, -h           show the help`);
	process.exit(0);
}

const isDebug = !!args.debug;

const withReporter = (function () {
	if (args.tfs) {
		{
			const testResultsRoot = process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE;
			return (browserType, runner) => {
				new mocha.reporters.Spec(runner);
				new MochaJUnitReporter(runner, {
					reporterOptions: {
						testsuitesTitle: `${args.tfs} ${process.platform}`,
						mochaFile: testResultsRoot ? path.join(testResultsRoot, `test-results/${process.platform}-${process.arch}-${browserType}-${args.tfs.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`) : undefined
					}
				});
			};
		}
	} else {
		return (_, runner) => applyReporter(runner, args);
	}
})();

const outdir = args.build ? 'out-build' : 'out';
const rootDir = path.resolve(__dirname, '..', '..', '..');
const out = path.join(rootDir, `${outdir}`);

function ensureIsArray(a) {
	return Array.isArray(a) ? a : [a];
}

const testModules = (async function () {

	const excludeGlob = '**/{node,electron-browser,electron-main,electron-utility}/**/*.test.js';
	let isDefaultModules = true;
	let promise;

	if (args.run) {
		// use file list (--run)
		isDefaultModules = false;
		promise = Promise.resolve(ensureIsArray(args.run).map(file => {
			file = file.replace(/^src/, 'out');
			file = file.replace(/\.ts$/, '.js');
			return path.relative(out, file);
		}));

	} else {
		// glob patterns (--glob)
		const defaultGlob = '**/*.test.js';
		const pattern = args.runGlob || defaultGlob;
		isDefaultModules = pattern === defaultGlob;

		promise = new Promise((resolve, reject) => {
			glob(pattern, { cwd: out }, (err, files) => {
				if (err) {
					reject(err);
				} else {
					resolve(files);
				}
			});
		});
	}

	return promise.then(files => {
		const modules = [];
		for (const file of files) {
			if (!minimatch(file, excludeGlob)) {
				modules.push(file.replace(/\.js$/, ''));

			} else if (!isDefaultModules) {
				console.warn(`DROPPING ${file} because it cannot be run inside a browser`);
			}
		}
		return modules;
	});
})();

function consoleLogFn(msg) {
	const type = msg.type();
	const candidate = console[type];
	if (candidate) {
		return candidate;
	}

	if (type === 'warning') {
		return console.warn;
	}

	return console.log;
}

async function createServer() {
	// Demand a prefix to avoid issues with other services on the
	// machine being able to access the test server.
	const prefix = '/' + randomBytes(16).toString('hex');
	const serveStatic = await yaserver.createServer({ rootDir });

	/** Handles a request for a remote method call, invoking `fn` and returning the result */
	const remoteMethod = async (req, response, fn) => {
		const params = await new Promise((resolve, reject) => {
			const body = [];
			req.on('data', chunk => body.push(chunk));
			req.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString())));
			req.on('error', reject);
		});
		try {
			const result = await fn(...params);
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(result));
		} catch (err) {
			response.writeHead(500);
			response.end(err.message);
		}
	};

	const server = http.createServer((request, response) => {
		if (!request.url?.startsWith(prefix)) {
			return response.writeHead(404).end();
		}

		// rewrite the URL so the static server can handle the request correctly
		request.url = request.url.slice(prefix.length);

		function massagePath(p) {
			// TODO@jrieken FISHY but it enables snapshot
			// in ESM browser tests
			p = String(p).replace(/\\/g, '/').replace(prefix, rootDir);
			return p;
		}

		switch (request.url) {
			case '/remoteMethod/__readFileInTests':
				return remoteMethod(request, response, p => fs.promises.readFile(massagePath(p), 'utf-8'));
			case '/remoteMethod/__writeFileInTests':
				return remoteMethod(request, response, (p, contents) => fs.promises.writeFile(massagePath(p), contents));
			case '/remoteMethod/__readDirInTests':
				return remoteMethod(request, response, p => fs.promises.readdir(massagePath(p)));
			case '/remoteMethod/__unlinkInTests':
				return remoteMethod(request, response, p => fs.promises.unlink(massagePath(p)));
			case '/remoteMethod/__mkdirPInTests':
				return remoteMethod(request, response, p => fs.promises.mkdir(massagePath(p), { recursive: true }));
			default:
				return serveStatic.handle(request, response);
		}
	});

	return new Promise((resolve, reject) => {
		server.listen(0, 'localhost', () => {
			resolve({
				dispose: () => server.close(),
				// @ts-ignore
				url: `http://localhost:${server.address().port}${prefix}`
			});
		});
		server.on('error', reject);
	});
}

async function runTestsInBrowser(testModules, browserType, browserChannel) {
	const server = await createServer();
	const browser = await playwright[browserType].launch({ headless: !Boolean(args.debug), devtools: Boolean(args.debug), channel: browserChannel });
	const context = await browser.newContext();
	const page = await context.newPage();
	const target = new URL(server.url + '/test/unit/browser/renderer.html');
	target.searchParams.set('baseUrl', url.pathToFileURL(path.join(rootDir, 'src')).toString());
	if (args.build) {
		target.searchParams.set('build', 'true');
	}
	if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
		target.searchParams.set('ci', 'true');
	}

	// append CSS modules as query-param
	await promisify(require('glob'))('**/*.css', { cwd: out }).then(async cssModules => {
		const cssData = await new Response((await new Response(cssModules.join(',')).blob()).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
		target.searchParams.set('_devCssData', Buffer.from(cssData).toString('base64'));
	});

	const emitter = new events.EventEmitter();
	await page.exposeFunction('mocha_report', (type, data1, data2) => {
		emitter.emit(type, data1, data2);
	});

	await page.goto(target.href);

	if (args.build) {
		const nlsMessages = await fs.promises.readFile(path.join(out, 'nls.messages.json'), 'utf8');
		await page.evaluate(value => {
			// when running from `out-build`, ensure to load the default
			// messages file, because all `nls.localize` calls have their
			// english values removed and replaced by an index.
			// @ts-ignore
			globalThis._VSCODE_NLS_MESSAGES = JSON.parse(value);
		}, nlsMessages);
	}

	page.on('console', async msg => {
		consoleLogFn(msg)(msg.text(), await Promise.all(msg.args().map(async arg => await arg.jsonValue())));
	});

	withReporter(browserType, new EchoRunner(emitter, browserChannel ? `${browserType.toUpperCase()}-${browserChannel.toUpperCase()}` : browserType.toUpperCase()));

	// collection failures for console printing
	const failingModuleIds = [];
	const failingTests = [];
	emitter.on('fail', (test, err) => {
		failingTests.push({ title: test.fullTitle, message: err.message });

		if (err.stack) {
			const regex = /(vs\/.*\.test)\.js/;
			for (const line of String(err.stack).split('\n')) {
				const match = regex.exec(line);
				if (match) {
					failingModuleIds.push(match[1]);
					return;
				}
			}
		}
	});

	try {
		// @ts-expect-error
		await page.evaluate(opts => loadAndRun(opts), {
			modules: testModules,
			grep: args.grep,
		});
	} catch (err) {
		console.error(err);
	}
	if (!isDebug) {
		server?.dispose();
		await browser.close();
	}

	if (failingTests.length > 0) {
		let res = `The followings tests are failing:\n - ${failingTests.map(({ title, message }) => `${title} (reason: ${message})`).join('\n - ')}`;

		if (failingModuleIds.length > 0) {
			res += `\n\nTo DEBUG, open ${browserType.toUpperCase()} and navigate to ${target.href}?${failingModuleIds.map(module => `m=${module}`).join('&')}`;
		}

		return `${res}\n`;
	}
}

class EchoRunner extends events.EventEmitter {

	constructor(event, title = '') {
		super();
		createStatsCollector(this);
		event.on('start', () => this.emit('start'));
		event.on('end', () => this.emit('end'));
		event.on('suite', (suite) => this.emit('suite', EchoRunner.deserializeSuite(suite, title)));
		event.on('suite end', (suite) => this.emit('suite end', EchoRunner.deserializeSuite(suite, title)));
		event.on('test', (test) => this.emit('test', EchoRunner.deserializeRunnable(test)));
		event.on('test end', (test) => this.emit('test end', EchoRunner.deserializeRunnable(test)));
		event.on('hook', (hook) => this.emit('hook', EchoRunner.deserializeRunnable(hook)));
		event.on('hook end', (hook) => this.emit('hook end', EchoRunner.deserializeRunnable(hook)));
		event.on('pass', (test) => this.emit('pass', EchoRunner.deserializeRunnable(test)));
		event.on('fail', (test, err) => this.emit('fail', EchoRunner.deserializeRunnable(test, title), EchoRunner.deserializeError(err)));
		event.on('pending', (test) => this.emit('pending', EchoRunner.deserializeRunnable(test)));
	}

	static deserializeSuite(suite, titleExtra) {
		return {
			root: suite.root,
			suites: suite.suites,
			tests: suite.tests,
			title: titleExtra && suite.title ? `${suite.title} - /${titleExtra}/` : suite.title,
			titlePath: () => suite.titlePath,
			fullTitle: () => suite.fullTitle,
			timeout: () => suite.timeout,
			retries: () => suite.retries,
			slow: () => suite.slow,
			bail: () => suite.bail
		};
	}

	static deserializeRunnable(runnable, titleExtra) {
		return {
			title: runnable.title,
			fullTitle: () => titleExtra && runnable.fullTitle ? `${runnable.fullTitle} - /${titleExtra}/` : runnable.fullTitle,
			titlePath: () => runnable.titlePath,
			async: runnable.async,
			slow: () => runnable.slow,
			speed: runnable.speed,
			duration: runnable.duration,
			currentRetry: () => runnable.currentRetry,
		};
	}

	static deserializeError(err) {
		const inspect = err.inspect;
		err.inspect = () => inspect;
		return err;
	}
}

testModules.then(async modules => {

	// run tests in selected browsers
	const browsers = Array.isArray(args.browser)
		? args.browser : [args.browser];

	let messages = [];
	let didFail = false;

	try {
		if (args.sequential) {
			for (const browser of browsers) {
				const [browserType, browserChannel] = browser.split('-');
				messages.push(await runTestsInBrowser(modules, browserType, browserChannel));
			}
		} else {
			messages = await Promise.all(browsers.map(async browser => {
				const [browserType, browserChannel] = browser.split('-');
				return await runTestsInBrowser(modules, browserType, browserChannel);
			}));
		}
	} catch (err) {
		console.error(err);
		if (!isDebug) {
			process.exit(1);
		}
	}

	// aftermath
	for (const msg of messages) {
		if (msg) {
			didFail = true;
			console.log(msg);
		}
	}
	if (!isDebug) {
		process.exit(didFail ? 1 : 0);
	}

}).catch(err => {
	console.error(err);
});
```

--------------------------------------------------------------------------------

---[FILE: test/unit/browser/renderer.html]---
Location: vscode-main/test/unit/browser/renderer.html

```html
<html>

<head>
	<meta charset="utf-8">
	<title>VSCode Tests</title>
	<link href="../../../node_modules/mocha/mocha.css" rel="stylesheet" />
</head>

<body>
	<div id="mocha"></div>
	<script src="../../../node_modules/mocha/mocha.js"></script>
	<script>
		// !!! DO NOT CHANGE !!!
		// Our unit tests may run in environments without
		// display (e.g. from builds) and tests may by
		// accident bring up native dialogs or even open
		// windows. This we cannot allow as it may crash
		// the test run.
		// !!! DO NOT CHANGE !!!
		window.open = function () { throw new Error('window.open() is not supported in tests!'); };
		window.alert = function () { throw new Error('window.alert() is not supported in tests!'); }
		window.confirm = function () { throw new Error('window.confirm() is not supported in tests!'); }

		// Ignore uncaught cancelled promise errors
		window.addEventListener('unhandledrejection', e => {
			const name = e && e.reason && e.reason.name;

			if (name === 'Canceled') {
				e.preventDefault();
				e.stopPropagation();
			}
		});

		const urlParams = new URLSearchParams(window.location.search);
		const isCI = urlParams.get('ci');

		const $globalThis = globalThis;
		const setTimeout0IsFaster = (typeof $globalThis.postMessage === 'function' && !$globalThis.importScripts);

		/**
		 * See https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#:~:text=than%204%2C%20then-,set%20timeout%20to%204,-.
		 *
		 * Works similarly to `setTimeout(0)` but doesn't suffer from the 4ms artificial delay
		 * that browsers set when the nesting level is > 5.
		 */
		const setTimeout0 = (() => {
			if (setTimeout0IsFaster) {
				const pending = [];

				$globalThis.addEventListener('message', (e) => {
					if (e.data && e.data.vscodeScheduleAsyncWork) {
						for (let i = 0, len = pending.length; i < len; i++) {
							const candidate = pending[i];
							if (candidate.id === e.data.vscodeScheduleAsyncWork) {
								pending.splice(i, 1);
								candidate.callback();
								return;
							}
						}
					}
				});
				let lastId = 0;
				return (callback) => {
					const myId = ++lastId;
					pending.push({
						id: myId,
						callback: callback
					});
					$globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, '*');
				};
			}
			return (callback) => setTimeout(callback);
		})();

		Mocha.Runner.immediately = setTimeout0;

		mocha.setup({
			ui: 'tdd',
			timeout: isCI ? 30000 : 5000
		});
	</script>

	<script>
		const isBuild = urlParams.get('build');
		const out = !!isBuild ? 'out-build' : 'out';
		const tasks =[];

		// configure loader
		const baseUrl = window.location.href;

		// generate import map
		const importMapParent = document.currentScript.parentNode;
		const importMap = {
			imports: {
				vs: new URL(`../../../${out}/vs`, baseUrl).href,
				assert: new URL('../assert.js', baseUrl).href,
				sinon: new URL('../../../node_modules/sinon/pkg/sinon-esm.js', baseUrl).href,
				'sinon-test': new URL('../../../node_modules/sinon-test/dist/sinon-test-es.js', baseUrl).href,
				'@xterm/xterm': new URL('../../../node_modules/@xterm/xterm/lib/xterm.js', baseUrl).href,
				'@vscode/iconv-lite-umd': new URL('../../../node_modules/@vscode/iconv-lite-umd/lib/iconv-lite-umd.js', baseUrl).href,
				jschardet: new URL('../../../node_modules/jschardet/dist/jschardet.min.js', baseUrl).href
			}
		}

		// ---- CSS tricks

		const cssDataBase64 = urlParams.get('_devCssData');
		if (typeof cssDataBase64 === 'string') {

			const style = document.createElement('style');
			style.type = 'text/css';
			document.head.appendChild(style);

			globalThis._VSCODE_CSS_LOAD = function (url) {
				// debugger;
				style.sheet.insertRule(`@import url(${url});`);
			};

			const cssData = Uint8Array.from(atob(cssDataBase64), c => c.charCodeAt(0));
			tasks.push(new Response(new Blob([cssData], {type:'application/octet-binary'}).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(value => {
				const cssModules = value.split(',');
				for (const cssModule of cssModules) {
					const cssUrl = new URL(`../../../${out}/${cssModule}`, baseUrl).href;
					const jsSrc = `globalThis._VSCODE_CSS_LOAD('${cssUrl}');\n`;
					const blob = new Blob([jsSrc], { type: 'application/javascript' });
					importMap.imports[cssUrl] = URL.createObjectURL(blob);
				}
			}).catch(err => {
				console.error(err);
			}));
		}

		const initPromise = Promise.allSettled(tasks).then(() => {

			const rawImportMap = JSON.stringify(importMap, undefined, 2);
			const importMapScript = document.createElement('script');
			importMapScript.type = 'importmap';
			importMapScript.textContent = rawImportMap;
			importMapParent.appendChild(importMapScript);

		}).then(() => {
			const bootstrapScript = document.createElement('script');
			bootstrapScript.type = 'module';
			bootstrapScript.textContent = document.getElementById('bootstrap').textContent
			document.getElementById('bootstrap').remove();
			document.body.append(bootstrapScript);
		});

		// set up require

		globalThis._VSCODE_FILE_ROOT = new URL('../../../src', baseUrl).href;
		globalThis.require = {
			paths: {
				xterm: new URL('../../../node_modules/xterm', baseUrl).href,
				'@vscode/iconv-lite-umd': new URL('../../../node_modules/@vscode/iconv-lite-umd', baseUrl).href,
				jschardet: new URL('../../../node_modules/jschardet', baseUrl).href
			}
		}
	</script>

	<script>
		function serializeSuite(suite) {
			return {
				root: suite.root,
				suites: suite.suites.map(serializeSuite),
				tests: suite.tests.map(serializeRunnable),
				title: suite.title,
				fullTitle: suite.fullTitle(),
				titlePath: suite.titlePath(),
				timeout: suite.timeout(),
				retries: suite.retries(),
				slow: suite.slow(),
				bail: suite.bail()
			};
		}
		function serializeRunnable(runnable) {
			return {
				title: runnable.title,
				titlePath: runnable.titlePath(),
				fullTitle: runnable.fullTitle(),
				async: runnable.async,
				slow: runnable.slow(),
				speed: runnable.speed,
				duration: runnable.duration,
				currentRetry: runnable.currentRetry(),
			};
		}
		function serializeError(err) {
			return {
				message: err.message,
				stack: err.stack,
				actual: err.actual,
				expected: err.expected,
				uncaught: err.uncaught,
				showDiff: err.showDiff,
				inspect: typeof err.inspect === 'function' ? err.inspect() : ''
			};
		}
		function PlaywrightReporter(runner) {
			runner.on('start', () => window.mocha_report('start'));
			runner.on('end', () => window.mocha_report('end'));
			runner.on('suite', suite => window.mocha_report('suite', serializeSuite(suite)));
			runner.on('suite end', suite => window.mocha_report('suite end', serializeSuite(suite)));
			runner.on('test', test => window.mocha_report('test', serializeRunnable(test)));
			runner.on('test end', test => window.mocha_report('test end', serializeRunnable(test)));
			runner.on('hook', hook => window.mocha_report('hook', serializeRunnable(hook)));
			runner.on('hook end', hook => window.mocha_report('hook end', serializeRunnable(hook)));
			runner.on('pass', test => window.mocha_report('pass', serializeRunnable(test)));
			runner.on('fail', (test, err) => window.mocha_report('fail', serializeRunnable(test), serializeError(err)));
			runner.on('pending', test => window.mocha_report('pending', serializeRunnable(test)));
		};

		const remoteMethods = [
			'__readFileInTests',
			'__writeFileInTests',
			'__readDirInTests',
			'__unlinkInTests',
			'__mkdirPInTests',
		];

		for (const method of remoteMethods) {
			const prefix = window.location.pathname.split('/')[1];
			globalThis[method] = async (...args) => {
				const res = await fetch(`/${prefix}/remoteMethod/${method}`, {
					body: JSON.stringify(args),
					method: 'POST',
					headers: { 'Content-Type': 'application/json' }
				});

				return res.json();
			}
		}

		async function loadModules(modules) {
			for (const file of modules) {
				mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE, globalThis, file, mocha);
				const m = await new Promise((resolve, reject) => import(`../../../${out}/${file}.js`).then(resolve, err => {
					console.log("BAD " + file + JSON.stringify(err, undefined, '\t'));
					resolve({});
				}));
				mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_REQUIRE, m, file, mocha);
				mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_POST_REQUIRE, globalThis, file, mocha);
			}
		}

		let _resolveTestData;
		let _resolveTestRun;
		globalThis._VSCODE_TEST_RUN = new Promise(resolve => _resolveTestData = resolve)

		window.loadAndRun = async function loadAndRun(data, manual = false) {
			_resolveTestData({data, manual})
			return new Promise(resolve => _resolveTestRun = resolve);
		}

		const modules = new URL(window.location.href).searchParams.getAll('m');
		if (Array.isArray(modules) && modules.length > 0) {
			console.log('MANUALLY running tests', modules);

			loadAndRun(modules, true).then(() => console.log('done'), err => console.log(err));
		}
	</script>

	<script type="text" id="bootstrap">
		const {data: {modules, grep}, manual} = await globalThis._VSCODE_TEST_RUN

		// load
		await loadModules(modules);

		// run
		await new Promise((resolve, reject) => {
			if (grep) {
				mocha.grep(grep);
			}

			if (!manual) {
				mocha.reporter(PlaywrightReporter);
			}
			mocha.run(failCount => resolve(failCount === 0));
		});

		_resolveTestRun();
	</script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: test/unit/electron/index.js]---
Location: vscode-main/test/unit/electron/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

// mocha disables running through electron by default. Note that this must
// come before any mocha imports.
process.env.MOCHA_COLORS = '1';

const { app, BrowserWindow, ipcMain, crashReporter, session } = require('electron');
const product = require('../../../product.json');
const { tmpdir } = require('os');
const { existsSync, mkdirSync, promises } = require('fs');
const path = require('path');
const mocha = require('mocha');
const events = require('events');
const MochaJUnitReporter = require('mocha-junit-reporter');
const url = require('url');
const net = require('net');
const createStatsCollector = require('mocha/lib/stats-collector');
const { applyReporter, importMochaReporter } = require('../reporter');

const minimist = require('minimist');

/**
 * @type {{
 * grep: string;
 * run: string;
 * runGlob: string;
 * testSplit: string;
 * dev: boolean;
 * reporter: string;
 * 'reporter-options': string;
 * 'waitServer': string;
 * timeout: string;
 * 'crash-reporter-directory': string;
 * tfs: string;
 * build: boolean;
 * coverage: boolean;
 * coveragePath: string;
 * coverageFormats: string | string[];
 * 'per-test-coverage': boolean;
 * help: boolean;
 * }}
 */
const args = minimist(process.argv.slice(2), {
	string: ['grep', 'run', 'runGlob', 'reporter', 'reporter-options', 'waitServer', 'timeout', 'crash-reporter-directory', 'tfs', 'coveragePath', 'coverageFormats', 'testSplit'],
	boolean: ['build', 'coverage', 'help', 'dev', 'per-test-coverage'],
	alias: {
		'grep': ['g', 'f'],
		'runGlob': ['glob', 'runGrep'],
		'dev': ['dev-tools', 'devTools'],
		'help': 'h'
	},
	default: {
		'reporter': 'spec',
		'reporter-options': ''
	}
});

if (args.help) {
	console.log(`Usage: node ${process.argv[1]} [options]

Options:
--grep, -g, -f <pattern>      only run tests matching <pattern>
--run <file>                  only run tests from <file>
--runGlob, --glob, --runGrep <file_pattern> only run tests matching <file_pattern>
--testSplit <i>/<n>           split tests into <n> parts and run the <i>th part
--build                       run with build output (out-build)
--coverage                    generate coverage report
--per-test-coverage           generate a per-test V8 coverage report, only valid with the full-json-stream reporter
--dev, --dev-tools, --devTools <window> open dev tools, keep window open, reuse app data
--reporter <reporter>         the mocha reporter (default: "spec")
--reporter-options <options>  the mocha reporter options (default: "")
--waitServer <port>           port to connect to and wait before running tests
--timeout <ms>                timeout for tests
--crash-reporter-directory <path> crash reporter directory
--tfs <url>                   TFS server URL
--help, -h                    show the help`);
	process.exit(0);
}

let crashReporterDirectory = args['crash-reporter-directory'];
if (crashReporterDirectory) {
	crashReporterDirectory = path.normalize(crashReporterDirectory);

	if (!path.isAbsolute(crashReporterDirectory)) {
		console.error(`The path '${crashReporterDirectory}' specified for --crash-reporter-directory must be absolute.`);
		app.exit(1);
	}

	if (!existsSync(crashReporterDirectory)) {
		try {
			mkdirSync(crashReporterDirectory);
		} catch (error) {
			console.error(`The path '${crashReporterDirectory}' specified for --crash-reporter-directory does not seem to exist or cannot be created.`);
			app.exit(1);
		}
	}

	// Crashes are stored in the crashDumps directory by default, so we
	// need to change that directory to the provided one
	console.log(`Found --crash-reporter-directory argument. Setting crashDumps directory to be '${crashReporterDirectory}'`);
	app.setPath('crashDumps', crashReporterDirectory);

	crashReporter.start({
		companyName: 'Microsoft',
		productName: process.env['VSCODE_DEV'] ? `${product.nameShort} Dev` : product.nameShort,
		uploadToServer: false,
		compress: true
	});
}

if (!args.dev) {
	app.setPath('userData', path.join(tmpdir(), `vscode-tests-${Date.now()}`));
}

function deserializeSuite(suite) {
	return {
		root: suite.root,
		suites: suite.suites,
		tests: suite.tests,
		title: suite.title,
		titlePath: () => suite.titlePath,
		fullTitle: () => suite.fullTitle,
		timeout: () => suite.timeout,
		retries: () => suite.retries,
		slow: () => suite.slow,
		bail: () => suite.bail
	};
}

function deserializeRunnable(runnable) {
	return {
		title: runnable.title,
		titlePath: () => runnable.titlePath,
		fullTitle: () => runnable.fullTitle,
		async: runnable.async,
		slow: () => runnable.slow,
		speed: runnable.speed,
		duration: runnable.duration,
		currentRetry: () => runnable.currentRetry
	};
}

function deserializeError(err) {
	const inspect = err.inspect;
	err.inspect = () => inspect;
	// Unfortunately, mocha rewrites and formats err.actual/err.expected.
	// This formatting is hard to reverse, so err.*JSON includes the unformatted value.
	if (err.actual) {
		err.actual = JSON.parse(err.actual).value;
		err.actualJSON = err.actual;
	}
	if (err.expected) {
		err.expected = JSON.parse(err.expected).value;
		err.expectedJSON = err.expected;
	}
	return err;
}

class IPCRunner extends events.EventEmitter {

	constructor(win) {
		super();

		this.didFail = false;
		this.didEnd = false;

		ipcMain.on('start', () => this.emit('start'));
		ipcMain.on('end', () => {
			this.didEnd = true;
			this.emit('end');
		});
		ipcMain.on('suite', (e, suite) => this.emit('suite', deserializeSuite(suite)));
		ipcMain.on('suite end', (e, suite) => this.emit('suite end', deserializeSuite(suite)));
		ipcMain.on('test', (e, test) => this.emit('test', deserializeRunnable(test)));
		ipcMain.on('test end', (e, test) => this.emit('test end', deserializeRunnable(test)));
		ipcMain.on('hook', (e, hook) => this.emit('hook', deserializeRunnable(hook)));
		ipcMain.on('hook end', (e, hook) => this.emit('hook end', deserializeRunnable(hook)));
		ipcMain.on('pass', (e, test) => this.emit('pass', deserializeRunnable(test)));
		ipcMain.on('fail', (e, test, err) => {
			this.didFail = true;
			this.emit('fail', deserializeRunnable(test), deserializeError(err));
		});
		ipcMain.on('pending', (e, test) => this.emit('pending', deserializeRunnable(test)));

		ipcMain.handle('startCoverage', async () => {
			win.webContents.debugger.attach();
			await win.webContents.debugger.sendCommand('Debugger.enable');
			await win.webContents.debugger.sendCommand('Profiler.enable');
			await win.webContents.debugger.sendCommand('Profiler.startPreciseCoverage', {
				detailed: true,
				allowTriggeredUpdates: false,
			});
		});

		const coverageScriptsReported = new Set();
		ipcMain.handle('snapshotCoverage', async (_, test) => {
			const coverage = await win.webContents.debugger.sendCommand('Profiler.takePreciseCoverage');
			await Promise.all(coverage.result.map(async (r) => {
				if (!coverageScriptsReported.has(r.scriptId)) {
					coverageScriptsReported.add(r.scriptId);
					const src = await win.webContents.debugger.sendCommand('Debugger.getScriptSource', { scriptId: r.scriptId });
					r.source = src.scriptSource;
				}
			}));

			if (!test) {
				this.emit('coverage init', coverage);
			} else {
				this.emit('coverage increment', test, coverage);
			}
		});
	}
}

app.on('ready', () => {

	// needed when loading resources from the renderer, e.g xterm.js or the encoding lib
	session.defaultSession.protocol.registerFileProtocol('vscode-file', (request, callback) => {
		const path = new URL(request.url).pathname;
		callback({ path });
	});

	ipcMain.on('error', (_, err) => {
		if (!args.dev) {
			console.error(err);
			app.exit(1);
		}
	});

	// We need to provide a basic `ISandboxConfiguration`
	// for our preload script to function properly because
	// some of our types depend on it (e.g. product.ts).
	ipcMain.handle('vscode:test-vscode-window-config', async () => {
		return {
			product: {
				version: '1.x.y',
				nameShort: 'Code - OSS Dev',
				nameLong: 'Code - OSS Dev',
				applicationName: 'code-oss',
				dataFolderName: '.vscode-oss',
				urlProtocol: 'code-oss',
			}
		};
	});

	// No-op since invoke the IPC as part of IIFE in the preload.
	ipcMain.handle('vscode:fetchShellEnv', event => { });

	/**
	 * Validates that a file path is within the project root for security purposes.
	 * @param {string} filePath - The file path to validate
	 * @throws {Error} If the path is outside the project root
	 */
	function validatePathWithinProject(filePath) {
		const projectRoot = path.join(__dirname, '../../..');
		const resolvedPath = path.resolve(filePath);
		const normalizedRoot = path.resolve(projectRoot);

		// On Windows, paths are case-insensitive
		const isWindows = process.platform === 'win32';
		const rel = path.relative(
			isWindows ? normalizedRoot.toLowerCase() : normalizedRoot,
			isWindows ? resolvedPath.toLowerCase() : resolvedPath
		);
		if (rel.startsWith('..') || path.isAbsolute(rel)) {
			const error = new Error(`Access denied: Path '${filePath}' is outside the project root`);
			console.error(error.message);
			throw error;
		}
	}

	// Handle file reading for tests
	ipcMain.handle('vscode:readFile', async (event, filePath) => {
		validatePathWithinProject(filePath);

		try {
			return await promises.readFile(path.resolve(filePath));
		} catch (error) {
			console.error(`Error reading file ${filePath}:`, error);
			throw error;
		}
	});

	// Handle file stat for tests
	ipcMain.handle('vscode:statFile', async (event, filePath) => {
		validatePathWithinProject(filePath);

		try {
			const stats = await promises.stat(path.resolve(filePath));
			return {
				isFile: stats.isFile(),
				isDirectory: stats.isDirectory(),
				isSymbolicLink: stats.isSymbolicLink(),
				ctimeMs: stats.ctimeMs,
				mtimeMs: stats.mtimeMs,
				size: stats.size,
				isReadonly: (stats.mode & 0o200) === 0 // Check if owner write bit is not set
			};
		} catch (error) {
			console.error(`Error stating file ${filePath}:`, error);
			throw error;
		}
	});

	const win = new BrowserWindow({
		height: 600,
		width: 800,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'), // ensure similar environment as VSCode as tests may depend on this
			additionalArguments: [`--vscode-window-config=vscode:test-vscode-window-config`],
			nodeIntegration: true,
			contextIsolation: false,
			enableWebSQL: false,
			spellcheck: false
		}
	});

	win.webContents.on('did-finish-load', () => {
		if (args.dev) {
			win.show();
			win.webContents.openDevTools();
		}

		if (args.waitServer) {
			waitForServer(Number(args.waitServer)).then(sendRun);
		} else {
			sendRun();
		}
	});

	async function waitForServer(port) {
		let timeout;
		let socket;

		return new Promise(resolve => {
			socket = net.connect(port, '127.0.0.1');
			socket.on('error', e => {
				console.error('error connecting to waitServer', e);
				resolve(undefined);
			});

			socket.on('close', () => {
				resolve(undefined);
			});

			timeout = setTimeout(() => {
				console.error('timed out waiting for before starting tests debugger');
				resolve(undefined);
			}, 15000);
		}).finally(() => {
			if (socket) {
				socket.end();
			}
			clearTimeout(timeout);
		});
	}

	function sendRun() {
		win.webContents.send('run', args);
	}

	const target = url.pathToFileURL(path.join(__dirname, 'renderer.html'));
	target.searchParams.set('argv', JSON.stringify(args));
	win.loadURL(target.href);

	const runner = new IPCRunner(win);
	createStatsCollector(runner);

	// Handle renderer crashes, #117068
	win.webContents.on('render-process-gone', (evt, details) => {
		if (!runner.didEnd) {
			console.error(`Renderer process crashed with: ${JSON.stringify(details)}`);
			app.exit(1);
		}
	});

	const reporters = [];

	if (args.tfs) {
		const testResultsRoot = process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE;
		reporters.push(
			new mocha.reporters.Spec(runner),
			new MochaJUnitReporter(runner, {
				reporterOptions: {
					testsuitesTitle: `${args.tfs} ${process.platform}`,
					mochaFile: testResultsRoot ? path.join(testResultsRoot, `test-results/${process.platform}-${process.arch}-${args.tfs.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`) : undefined
				}
			}),
		);
	} else {
		// mocha patches symbols to use windows escape codes, but it seems like
		// Electron mangles these in its output.
		if (process.platform === 'win32') {
			Object.assign(importMochaReporter('base').symbols, {
				ok: '+',
				err: 'X',
				dot: '.',
			});
		}

		reporters.push(applyReporter(runner, args));
	}

	if (!args.dev) {
		ipcMain.on('all done', async () => {
			await Promise.all(reporters.map(r => r.drain?.()));
			app.exit(runner.didFail ? 1 : 0);
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: test/unit/electron/preload.js]---
Location: vscode-main/test/unit/electron/preload.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check
(function () {
	'use strict';

	const { ipcRenderer, webFrame, contextBridge, webUtils } = require('electron');

	const globals = {

		ipcRenderer: {

			send(channel, ...args) {
				ipcRenderer.send(channel, ...args);
			},

			invoke(channel, ...args) {
				return ipcRenderer.invoke(channel, ...args);
			},

			on(channel, listener) {
				ipcRenderer.on(channel, listener);

				return this;
			},

			once(channel, listener) {
				ipcRenderer.once(channel, listener);

				return this;
			},

			removeListener(channel, listener) {
				ipcRenderer.removeListener(channel, listener);

				return this;
			}
		},

		webFrame: {

			setZoomLevel(level) {
				if (typeof level === 'number') {
					webFrame.setZoomLevel(level);
				}
			}
		},

		webUtils: {

			getPathForFile(file) {
				return webUtils.getPathForFile(file);
			}
		},

		process: {
			get platform() { return process.platform; },
			get arch() { return process.arch; },
			get env() { return { ...process.env }; },
			get versions() { return process.versions; },
			get type() { return 'renderer'; },
			get execPath() { return process.execPath; },

			cwd() {
				return process.env['VSCODE_CWD'] || process.execPath.substr(0, process.execPath.lastIndexOf(process.platform === 'win32' ? '\\' : '/'));
			},

			getProcessMemoryInfo() {
				return process.getProcessMemoryInfo();
			},

			on(type, callback) {
				// @ts-ignore
				process.on(type, callback);
			}
		},
	};

	if (process.contextIsolated) {
		try {
			contextBridge.exposeInMainWorld('vscode', globals);
		} catch (error) {
			console.error(error);
		}
	} else {
		// @ts-ignore
		window.vscode = globals;
	}
}());
```

--------------------------------------------------------------------------------

---[FILE: test/unit/electron/renderer.html]---
Location: vscode-main/test/unit/electron/renderer.html

```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<title>VSCode Tests</title>
	<link href="../../../node_modules/mocha/mocha.css" rel="stylesheet" />
</head>

<body>
	<div id="mocha"></div>
	<script src="../../../node_modules/mocha/mocha.js"></script>

	<script>

		// !!! DO NOT CHANGE !!!
		// Our unit tests may run in environments without
		// display (e.g. from builds) and tests may by
		// accident bring up native dialogs or even open
		// windows. This we cannot allow as it may crash
		// the test run.
		// !!! DO NOT CHANGE !!!
		window.open = function () { throw new Error('window.open() is not supported in tests!'); };
		window.alert = function () { throw new Error('window.alert() is not supported in tests!'); }
		window.confirm = function () { throw new Error('window.confirm() is not supported in tests!'); }

		// Ignore uncaught cancelled promise errors
		window.addEventListener('unhandledrejection', e => {
			const name = e && e.reason && e.reason.name;

			if (name === 'Canceled') {
				e.preventDefault();
				e.stopPropagation();
			}
		});
	</script>
	<script>
		const urlParams = new URLSearchParams(window.location.search);
		const argv = JSON.parse(urlParams.get('argv'));

		const outdir = argv.build ? 'out-build' : 'out';
		const basePath = require('path').join(__dirname, `../../../${outdir}/`);
		const baseUrl = require('url').pathToFileURL(basePath);

		// Tests run in a renderer that IS node-enabled. So we will encounter imports for node-modules which isn't
		// supported by blink/chromium. To work around this, we generate an import map that maps all node modules
		// to a blob that exports all properties of the module as named exports and the module itself as default.

		function asRequireBlobUri(name) {
			let _mod;
			try {
				_mod = require(name);

			} catch (err) {
				// These are somewhat expected because of platform differences (windows vs mac vs linux) or because of node/electron binary differences
				// console.error(`[ESM] Failed to require ${name}`);
				// console.error(err);
				return undefined;
			}

			// export all properties and the module itself as default
			let jsSrc = `const _mod = require('${name}')\n`;
			for (const name of Object.keys(_mod)) {
				jsSrc += `export const ${name} = _mod['${name}'];\n`;
			}
			jsSrc += `export default _mod;\n`;

			const blob = new Blob([jsSrc], { type: 'application/javascript' });
			const url = URL.createObjectURL(blob);
			return url;
		}

		// generate import map
		const importMap = {
			imports: {
				assert: new URL('../test/unit/assert.js', baseUrl).href,
				sinon: new URL('../node_modules/sinon/pkg/sinon-esm.js', baseUrl).href,
				'sinon-test': new URL('../node_modules/sinon-test/dist/sinon-test-es.js', baseUrl).href,
				'electron': asRequireBlobUri('electron'),
			}
		};

		const builtin = require('module').builtinModules.filter(mod => !mod.startsWith('_') && !mod.startsWith('electron/js2c/')).sort();
		const dependencies = Object.keys(require('../../../package.json').dependencies).sort();
		const optionalDependencies = Object.keys(require('../../../package.json').optionalDependencies).sort();
		const dependenciesRemote = Object.keys(require('../../../remote/package.json').dependencies).sort();

		for (const name of new Set([].concat(builtin, dependencies, optionalDependencies, dependenciesRemote))) {
			const url = asRequireBlobUri(name);
			if (!url) {
				continue;
			}

			importMap.imports[name] = url;
		}

		//2: CSS modules
		const style = document.createElement('style');
		style.type = 'text/css';
		document.head.appendChild(style);

		globalThis._VSCODE_CSS_LOAD = function (url) {
			style.sheet.insertRule(`@import url(${url});`);
		};

		const { promisify } = require('util');
		globalThis._VSCODE_TEST_INIT = promisify(require('glob'))('**/*.css', { cwd: basePath }).then(cssModules => {
			for (const cssModule of cssModules) {
				const cssUrl = new URL(cssModule, baseUrl).href;
				const jsSrc = `globalThis._VSCODE_CSS_LOAD('${cssUrl}');\n`;
				const blob = new Blob([jsSrc], { type: 'application/javascript' });
				importMap.imports[cssUrl] = URL.createObjectURL(blob);
			}

		}).then(() => {
			const rawImportMap = JSON.stringify(importMap, undefined, 2);
			const importMapScript = document.createElement('script');
			importMapScript.type = 'importmap';
			importMapScript.textContent = rawImportMap;
			document.head.append(importMapScript);
		});
	</script>
	<script src="./renderer.js"></script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: test/unit/electron/renderer.js]---
Location: vscode-main/test/unit/electron/renderer.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*eslint-env mocha*/

// @ts-check

const fs = require('fs');

(function () {
	const originals = {};
	let logging = false;
	let withStacks = false;

	globalThis.beginLoggingFS = (_withStacks) => {
		logging = true;
		withStacks = _withStacks || false;
	};
	globalThis.endLoggingFS = () => {
		logging = false;
		withStacks = false;
	};

	function createSpy(element, cnt) {
		return function (...args) {
			if (logging) {
				console.log(`calling ${element}: ` + args.slice(0, cnt).join(',') + (withStacks ? (`\n` + new Error().stack?.split('\n').slice(2).join('\n')) : ''));
			}
			return originals[element].call(this, ...args);
		};
	}

	function intercept(element, cnt) {
		originals[element] = fs[element];
		fs[element] = createSpy(element, cnt);
	}

	[
		['realpathSync', 1],
		['readFileSync', 1],
		['openSync', 3],
		['readSync', 1],
		['closeSync', 1],
		['readFile', 2],
		['mkdir', 1],
		['lstat', 1],
		['stat', 1],
		['watch', 1],
		['readdir', 1],
		['access', 2],
		['open', 2],
		['write', 1],
		['fdatasync', 1],
		['close', 1],
		['read', 1],
		['unlink', 1],
		['rmdir', 1],
	].forEach((element) => {
		intercept(element[0], element[1]);
	});
})();

const { ipcRenderer } = require('electron');
const assert = require('assert');
const path = require('path');
const glob = require('glob');
const util = require('util');
const coverage = require('../coverage');
const { pathToFileURL } = require('url');

// Disabled custom inspect. See #38847
if (util.inspect && util.inspect['defaultOptions']) {
	util.inspect['defaultOptions'].customInspect = false;
}

// VSCODE_GLOBALS: package/product.json
globalThis._VSCODE_PRODUCT_JSON = require('../../../product.json');
globalThis._VSCODE_PACKAGE_JSON = require('../../../package.json');

// Test file operations that are common across platforms. Used for test infra, namely snapshot tests
Object.assign(globalThis, {
	__readFileInTests: path => fs.promises.readFile(path, 'utf-8'),
	__writeFileInTests: (path, contents) => fs.promises.writeFile(path, contents),
	__readDirInTests: path => fs.promises.readdir(path),
	__unlinkInTests: path => fs.promises.unlink(path),
	__mkdirPInTests: path => fs.promises.mkdir(path, { recursive: true }),
});

const IS_CI = !!process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || !!process.env.GITHUB_WORKSPACE;
const _tests_glob = '**/test/**/*.test.js';


/**
 * Loads one or N modules.
 * @type {{
 *   (module: string|string[]): Promise<any>|Promise<any[]>;
 *   _out: string;
 * }}
 */
let loadFn;

const _loaderErrors = [];

function initNls(opts) {
	if (opts.build) {
		// when running from `out-build`, ensure to load the default
		// messages file, because all `nls.localize` calls have their
		// english values removed and replaced by an index.
		globalThis._VSCODE_NLS_MESSAGES = require(`../../../out-build/nls.messages.json`);
	}
}

function initLoadFn(opts) {
	const outdir = opts.build ? 'out-build' : 'out';
	const out = path.join(__dirname, `../../../${outdir}`);

	const baseUrl = pathToFileURL(path.join(__dirname, `../../../${outdir}/`));
	globalThis._VSCODE_FILE_ROOT = baseUrl.href;

	// set loader
	function importModules(modules) {
		const moduleArray = Array.isArray(modules) ? modules : [modules];
		const tasks = moduleArray.map(mod => {
			const url = new URL(`./${mod}.js`, baseUrl).href;
			return import(url).catch(err => {
				console.log(mod, url);
				console.log(err);
				_loaderErrors.push(err);
				throw err;
			});
		});

		return Array.isArray(modules)
			? Promise.all(tasks)
			: tasks[0];
	}
	importModules._out = out;
	loadFn = importModules;
}

async function createCoverageReport(opts) {
	if (!opts.coverage) {
		return undefined;
	}
	return coverage.createReport(opts.run || opts.runGlob);
}

async function loadModules(modules) {
	for (const file of modules) {
		mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE, globalThis, file, mocha);
		const m = await loadFn(file);
		mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_REQUIRE, m, file, mocha);
		mocha.suite.emit(Mocha.Suite.constants.EVENT_FILE_POST_REQUIRE, globalThis, file, mocha);
	}
}

const globAsync = util.promisify(glob);

async function loadTestModules(opts) {

	if (opts.run) {
		const files = Array.isArray(opts.run) ? opts.run : [opts.run];
		const modules = files.map(file => {
			file = file.replace(/^src[\\/]/, '');
			return file.replace(/\.[jt]s$/, '');
		});
		return loadModules(modules);
	}

	const pattern = opts.runGlob || _tests_glob;
	const files = await globAsync(pattern, { cwd: loadFn._out });
	let modules = files.map(file => file.replace(/\.js$/, ''));
	if (opts.testSplit) {
		const [i, n] = opts.testSplit.split('/').map(Number);
		const chunkSize = Math.floor(modules.length / n);
		const start = (i - 1) * chunkSize;
		const end = i === n ? modules.length : i * chunkSize;
		modules = modules.slice(start, end);
	}
	return loadModules(modules);
}

/** @type Mocha.Test */
let currentTest;

async function loadTests(opts) {

	//#region Unexpected Output

	const _allowedTestOutput = [
		/The vm module of Node\.js is deprecated in the renderer process and will be removed./,
	];

	// allow snapshot mutation messages locally
	if (!IS_CI) {
		_allowedTestOutput.push(/Creating new snapshot in/);
		_allowedTestOutput.push(/Deleting [0-9]+ old snapshots/);
	}

	const perTestCoverage = opts['per-test-coverage'] ? await PerTestCoverage.init() : undefined;

	const _allowedTestsWithOutput = new Set([
		'creates a snapshot', // self-testing
		'validates a snapshot', // self-testing
		'cleans up old snapshots', // self-testing
		'issue #149412: VS Code hangs when bad semantic token data is received', // https://github.com/microsoft/vscode/issues/192440
		'issue #134973: invalid semantic tokens should be handled better', // https://github.com/microsoft/vscode/issues/192440
		'issue #148651: VSCode UI process can hang if a semantic token with negative values is returned by language service', // https://github.com/microsoft/vscode/issues/192440
		'issue #149130: vscode freezes because of Bracket Pair Colorization', // https://github.com/microsoft/vscode/issues/192440
		'property limits', // https://github.com/microsoft/vscode/issues/192443
		'Error events', // https://github.com/microsoft/vscode/issues/192443
		'fetch returns keybinding with user first if title and id matches', //
		'throw ListenerLeakError'
	]);

	const _allowedSuitesWithOutput = new Set([
		'InlineChatController'
	]);

	let _testsWithUnexpectedOutput = false;

	for (const consoleFn of [console.log, console.error, console.info, console.warn, console.trace, console.debug]) {
		console[consoleFn.name] = function (msg) {
			if (!currentTest) {
				consoleFn.apply(console, arguments);
			} else if (!_allowedTestOutput.some(a => a.test(msg)) && !_allowedTestsWithOutput.has(currentTest.title) && !_allowedSuitesWithOutput.has(currentTest.parent?.title ?? '')) {
				_testsWithUnexpectedOutput = true;
				consoleFn.apply(console, arguments);
			}
		};
	}

	//#endregion

	//#region Unexpected / Loader Errors

	const _unexpectedErrors = [];

	const _allowedTestsWithUnhandledRejections = new Set([
		// Lifecycle tests
		'onWillShutdown - join with error is handled',
		'onBeforeShutdown - veto with error is treated as veto',
		'onBeforeShutdown - final veto with error is treated as veto',
		// Search tests
		'Search Model: Search reports timed telemetry on search when error is called'
	]);

	const errors = await loadFn('vs/base/common/errors');
	const onUnexpectedError = function (err) {
		if (err.name === 'Canceled') {
			return; // ignore canceled errors that are common
		}

		let stack = (err ? err.stack : null);
		if (!stack) {
			stack = new Error().stack;
		}

		_unexpectedErrors.push((err && err.message ? err.message : err) + '\n' + stack);
	};

	process.on('uncaughtException', error => onUnexpectedError(error));
	process.on('unhandledRejection', (reason, promise) => {
		onUnexpectedError(reason);
		promise.catch(() => { });
	});
	window.addEventListener('unhandledrejection', event => {
		event.preventDefault(); // Do not log to test output, we show an error later when test ends
		event.stopPropagation();

		if (!_allowedTestsWithUnhandledRejections.has(currentTest.title)) {
			onUnexpectedError(event.reason);
		}
	});

	errors.setUnexpectedErrorHandler(onUnexpectedError);
	//#endregion

	const { assertCleanState } = await loadFn('vs/workbench/test/common/utils');

	suite('Tests are using suiteSetup and setup correctly', () => {
		test('assertCleanState - check that registries are clean at the start of test running', () => {
			assertCleanState();
		});
	});

	setup(async () => {
		await perTestCoverage?.startTest();
	});

	teardown(async () => {
		await perTestCoverage?.finishTest(currentTest.file, currentTest.fullTitle());

		// should not have unexpected output
		if (_testsWithUnexpectedOutput && !opts.dev) {
			assert.ok(false, 'Error: Unexpected console output in test run. Please ensure no console.[log|error|info|warn] usage in tests or runtime errors.');
		}

		// should not have unexpected errors
		const errors = _unexpectedErrors.concat(_loaderErrors);
		if (errors.length) {
			const msg = [];
			for (const error of errors) {
				console.error(`Error: Test run should not have unexpected errors:\n${error}`);
				msg.push(String(error));
			}
			assert.ok(false, `Error: Test run should not have unexpected errors:\n${msg.join('\n')}`);
		}
	});

	suiteTeardown(() => { // intentionally not in teardown because some tests only cleanup in suiteTeardown

		// should have cleaned up in registries
		assertCleanState();
	});

	return loadTestModules(opts);
}

function serializeSuite(suite) {
	return {
		root: suite.root,
		suites: suite.suites.map(serializeSuite),
		tests: suite.tests.map(serializeRunnable),
		title: suite.title,
		fullTitle: suite.fullTitle(),
		titlePath: suite.titlePath(),
		timeout: suite.timeout(),
		retries: suite.retries(),
		slow: suite.slow(),
		bail: suite.bail()
	};
}

function serializeRunnable(runnable) {
	return {
		title: runnable.title,
		fullTitle: runnable.fullTitle(),
		titlePath: runnable.titlePath(),
		async: runnable.async,
		slow: runnable.slow(),
		speed: runnable.speed,
		duration: runnable.duration
	};
}

function serializeError(err) {
	return {
		message: err.message,
		stack: err.stack,
		snapshotPath: err.snapshotPath,
		actual: safeStringify({ value: err.actual }),
		expected: safeStringify({ value: err.expected }),
		uncaught: err.uncaught,
		showDiff: err.showDiff,
		inspect: typeof err.inspect === 'function' ? err.inspect() : ''
	};
}

function safeStringify(obj) {
	const seen = new Set();
	return JSON.stringify(obj, (key, value) => {
		if (value === undefined) {
			return '[undefined]';
		}

		if (isObject(value) || Array.isArray(value)) {
			if (seen.has(value)) {
				return '[Circular]';
			} else {
				seen.add(value);
			}
		}
		return value;
	});
}

function isObject(obj) {
	// The method can't do a type cast since there are type (like strings) which
	// are subclasses of any put not positively matched by the function. Hence type
	// narrowing results in wrong results.
	return typeof obj === 'object'
		&& obj !== null
		&& !Array.isArray(obj)
		&& !(obj instanceof RegExp)
		&& !(obj instanceof Date);
}

class IPCReporter {

	constructor(runner) {
		runner.on('start', () => ipcRenderer.send('start'));
		runner.on('end', () => ipcRenderer.send('end'));
		runner.on('suite', suite => ipcRenderer.send('suite', serializeSuite(suite)));
		runner.on('suite end', suite => ipcRenderer.send('suite end', serializeSuite(suite)));
		runner.on('test', test => ipcRenderer.send('test', serializeRunnable(test)));
		runner.on('test end', test => ipcRenderer.send('test end', serializeRunnable(test)));
		runner.on('hook', hook => ipcRenderer.send('hook', serializeRunnable(hook)));
		runner.on('hook end', hook => ipcRenderer.send('hook end', serializeRunnable(hook)));
		runner.on('pass', test => ipcRenderer.send('pass', serializeRunnable(test)));
		runner.on('fail', (test, err) => ipcRenderer.send('fail', serializeRunnable(test), serializeError(err)));
		runner.on('pending', test => ipcRenderer.send('pending', serializeRunnable(test)));
	}
}

const $globalThis = globalThis;
const setTimeout0IsFaster = (typeof $globalThis.postMessage === 'function' && !$globalThis.importScripts);

/**
 * See https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#:~:text=than%204%2C%20then-,set%20timeout%20to%204,-.
 *
 * Works similarly to `setTimeout(0)` but doesn't suffer from the 4ms artificial delay
 * that browsers set when the nesting level is > 5.
 */
const setTimeout0 = (() => {
	if (setTimeout0IsFaster) {
		const pending = [];

		$globalThis.addEventListener('message', (e) => {
			if (e.data && e.data.vscodeScheduleAsyncWork) {
				for (let i = 0, len = pending.length; i < len; i++) {
					const candidate = pending[i];
					if (candidate.id === e.data.vscodeScheduleAsyncWork) {
						pending.splice(i, 1);
						candidate.callback();
						return;
					}
				}
			}
		});
		let lastId = 0;
		return (callback) => {
			const myId = ++lastId;
			pending.push({
				id: myId,
				callback: callback
			});
			$globalThis.postMessage({ vscodeScheduleAsyncWork: myId }, '*');
		};
	}
	return (callback) => setTimeout(callback);
})();

async function runTests(opts) {
	// @ts-expect-error
	Mocha.Runner.immediately = setTimeout0;

	mocha.setup({
		ui: 'tdd',
		// @ts-expect-error
		reporter: opts.dev ? 'html' : IPCReporter,
		grep: opts.grep,
		timeout: opts.timeout ?? (IS_CI ? 30000 : 5000),
		forbidOnly: IS_CI // disallow .only() when running on build machine
	});

	// this *must* come before loadTests, or it doesn't work.
	if (opts.timeout !== undefined) {
		mocha.timeout(opts.timeout);
	}

	await loadTests(opts);

	const runner = mocha.run(async () => {
		await createCoverageReport(opts);
		ipcRenderer.send('all done');
	});

	runner.on('test', test => currentTest = test);

	if (opts.dev) {
		runner.on('fail', (test, err) => {
			console.error(test.fullTitle());
			console.error(err.stack);
		});
	}
}

ipcRenderer.on('run', async (_e, opts) => {
	initNls(opts);
	initLoadFn(opts);

	await Promise.resolve(globalThis._VSCODE_TEST_INIT);

	try {
		await runTests(opts);
	} catch (err) {
		if (typeof err !== 'string') {
			err = JSON.stringify(err);
		}
		console.error(err);
		ipcRenderer.send('error', err);
	}
});

class PerTestCoverage {
	static async init() {
		await ipcRenderer.invoke('startCoverage');
		return new PerTestCoverage();
	}

	async startTest() {
		if (!this.didInit) {
			this.didInit = true;
			await ipcRenderer.invoke('snapshotCoverage');
		}
	}

	async finishTest(file, fullTitle) {
		await ipcRenderer.invoke('snapshotCoverage', { file, fullTitle });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: test/unit/node/index.js]---
Location: vscode-main/test/unit/node/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

process.env.MOCHA_COLORS = '1'; // Force colors (note that this must come before any mocha imports)

import * as assert from 'assert';
import Mocha from 'mocha';
import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';
import minimatch from 'minimatch';
import minimist from 'minimist';
import * as module from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import semver from 'semver';

/**
 * @type {{ build: boolean; run: string; runGlob: string; coverage: boolean; help: boolean; coverageFormats: string | string[]; coveragePath: string; }}
 */
const args = minimist(process.argv.slice(2), {
	boolean: ['build', 'coverage', 'help'],
	string: ['run', 'coveragePath', 'coverageFormats'],
	alias: {
		h: 'help'
	},
	default: {
		build: false,
		coverage: false,
		help: false
	},
	description: {
		build: 'Run from out-build',
		run: 'Run a single file',
		coverage: 'Generate a coverage report',
		coveragePath: 'Path to coverage report to generate',
		coverageFormats: 'Coverage formats to generate',
		help: 'Show help'
	}
});

if (args.help) {
	console.log(`Usage: node test/unit/node/index [options]

Options:
--build          Run from out-build
--run <file>     Run a single file
--coverage       Generate a coverage report
--help           Show help`);
	process.exit(0);
}

const TEST_GLOB = '**/test/**/*.test.js';

const excludeGlobs = [
	'**/{browser,electron-browser,electron-main,electron-utility}/**/*.test.js',
	'**/vs/platform/environment/test/node/nativeModules.test.js', // native modules are compiled against Electron and this test would fail with node.js
	'**/vs/base/parts/storage/test/node/storage.test.js', // same as above, due to direct dependency to sqlite native module
	'**/vs/workbench/contrib/testing/test/**' // flaky (https://github.com/microsoft/vscode/issues/137853)
];

const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const out = args.build ? 'out-build' : 'out';
const src = path.join(REPO_ROOT, out);
const baseUrl = pathToFileURL(src);

//@ts-ignore
const requiredNodeVersion = semver.parse(/^target="(.*)"$/m.exec(fs.readFileSync(path.join(REPO_ROOT, 'remote', '.npmrc'), 'utf8'))[1]);
const currentNodeVersion = semver.parse(process.version);
//@ts-ignore
if (currentNodeVersion?.major < requiredNodeVersion?.major) {
	console.error(`node.js unit tests require a major node.js version of ${requiredNodeVersion?.major} (your version is: ${currentNodeVersion?.major})`);
	process.exit(1);
}

function main() {

	// VSCODE_GLOBALS: package/product.json
	const _require = module.createRequire(import.meta.url);
	globalThis._VSCODE_PRODUCT_JSON = _require(`${REPO_ROOT}/product.json`);
	globalThis._VSCODE_PACKAGE_JSON = _require(`${REPO_ROOT}/package.json`);

	// VSCODE_GLOBALS: file root
	globalThis._VSCODE_FILE_ROOT = baseUrl.href;

	if (args.build) {
		// when running from `out-build`, ensure to load the default
		// messages file, because all `nls.localize` calls have their
		// english values removed and replaced by an index.
		globalThis._VSCODE_NLS_MESSAGES = _require(`${REPO_ROOT}/${out}/nls.messages.json`);
	}

	// Test file operations that are common across platforms. Used for test infra, namely snapshot tests
	Object.assign(globalThis, {
		// __analyzeSnapshotInTests: takeSnapshotAndCountClasses,
		__readFileInTests: (/** @type {string} */ path) => fs.promises.readFile(path, 'utf-8'),
		__writeFileInTests: (/** @type {string} */ path, /** @type {BufferEncoding} */ contents) => fs.promises.writeFile(path, contents),
		__readDirInTests: (/** @type {string} */ path) => fs.promises.readdir(path),
		__unlinkInTests: (/** @type {string} */ path) => fs.promises.unlink(path),
		__mkdirPInTests: (/** @type {string} */ path) => fs.promises.mkdir(path, { recursive: true }),
	});

	process.on('uncaughtException', function (e) {
		console.error(e.stack || e);
	});

	/**
	 * @param modules
	 * @param onLoad
	 * @param onError
	 */
	const loader = function (modules, onLoad, onError) {
		const loads = modules.map(mod => import(`${baseUrl}/${mod}.js`).catch(err => {
			console.error(`FAILED to load ${mod} as ${baseUrl}/${mod}.js`);
			throw err;
		}));
		Promise.all(loads).then(onLoad, onError);
	};


	let didErr = false;
	const write = process.stderr.write;
	process.stderr.write = function (...args) {
		didErr = didErr || !!args[0];
		return write.apply(process.stderr, args);
	};


	const runner = new Mocha({
		ui: 'tdd'
	});

	/**
	 * @param modules
	 */
	async function loadModules(modules) {
		for (const file of modules) {
			runner.suite.emit(Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE, globalThis, file, runner);
			const m = await new Promise((resolve, reject) => loader([file], resolve, reject));
			runner.suite.emit(Mocha.Suite.constants.EVENT_FILE_REQUIRE, m, file, runner);
			runner.suite.emit(Mocha.Suite.constants.EVENT_FILE_POST_REQUIRE, globalThis, file, runner);
		}
	}

	/** @type { null|((callback:(err:any)=>void)=>void) } */
	let loadFunc = null;

	if (args.runGlob) {
		loadFunc = (cb) => {
			const doRun = /** @param tests */(tests) => {
				const modulesToLoad = tests.map(test => {
					if (path.isAbsolute(test)) {
						test = path.relative(src, path.resolve(test));
					}

					return test.replace(/(\.js)|(\.d\.ts)|(\.js\.map)$/, '');
				});
				loadModules(modulesToLoad).then(() => cb(null), cb);
			};

			glob(args.runGlob, { cwd: src }, function (err, files) { doRun(files); });
		};
	} else if (args.run) {
		const tests = (typeof args.run === 'string') ? [args.run] : args.run;
		const modulesToLoad = tests.map(function (test) {
			test = test.replace(/^src/, 'out');
			test = test.replace(/\.ts$/, '.js');
			return path.relative(src, path.resolve(test)).replace(/(\.js)|(\.js\.map)$/, '').replace(/\\/g, '/');
		});
		loadFunc = (cb) => {
			loadModules(modulesToLoad).then(() => cb(null), cb);
		};
	} else {
		loadFunc = (cb) => {
			glob(TEST_GLOB, { cwd: src }, function (err, files) {
				/** @type {string[]} */
				const modules = [];
				for (const file of files) {
					if (!excludeGlobs.some(excludeGlob => minimatch(file, excludeGlob))) {
						modules.push(file.replace(/\.js$/, ''));
					}
				}
				loadModules(modules).then(() => cb(null), cb);
			});
		};
	}

	loadFunc(function (err) {
		if (err) {
			console.error(err);
			return process.exit(1);
		}

		process.stderr.write = write;

		if (!args.run && !args.runGlob) {
			// set up last test
			Mocha.suite('Loader', function () {
				test('should not explode while loading', function () {
					assert.ok(!didErr, `should not explode while loading: ${didErr}`);
				});
			});
		}

		// report failing test for every unexpected error during any of the tests
		const unexpectedErrors = [];
		Mocha.suite('Errors', function () {
			test('should not have unexpected errors in tests', function () {
				if (unexpectedErrors.length) {
					unexpectedErrors.forEach(function (stack) {
						console.error('');
						console.error(stack);
					});

					assert.ok(false);
				}
			});
		});

		// replace the default unexpected error handler to be useful during tests
		import(`${baseUrl}/vs/base/common/errors.js`).then(errors => {
			errors.setUnexpectedErrorHandler(function (err) {
				const stack = (err && err.stack) || (new Error().stack);
				unexpectedErrors.push((err && err.message ? err.message : err) + '\n' + stack);
			});

			// fire up mocha
			runner.run(failures => process.exit(failures ? 1 : 0));
		});
	});
}

main();
```

--------------------------------------------------------------------------------

---[FILE: test/unit/node/package.json]---
Location: vscode-main/test/unit/node/package.json

```json
{
	"type": "module"
}
```

--------------------------------------------------------------------------------

````

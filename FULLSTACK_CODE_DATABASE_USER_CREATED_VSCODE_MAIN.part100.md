---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 100
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 100 of 552)

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

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/chat.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/chat.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as fs from 'fs';
import { join } from 'path';
import 'mocha';
import { ChatContext, ChatRequest, ChatRequestTurn, ChatRequestTurn2, ChatResult, Disposable, env, Event, EventEmitter, chat, commands, lm, UIKind } from 'vscode';
import { DeferredPromise, asPromise, assertNoRpc, closeAllEditors, delay, disposeAll } from '../utils';

suite('chat', () => {

	let disposables: Disposable[] = [];
	setup(() => {
		disposables = [];

		// Register a dummy default model which is required for a participant request to go through
		disposables.push(lm.registerLanguageModelChatProvider('test-lm-vendor', {
			async provideLanguageModelChatInformation(_options, _token) {
				return [{
					id: 'test-lm',
					name: 'test-lm',
					family: 'test',
					version: '1.0.0',
					maxInputTokens: 100,
					maxOutputTokens: 100,
					isDefault: true,
					isUserSelectable: true,
					capabilities: {}
				}];
			},
			async provideLanguageModelChatResponse(_model, _messages, _options, _progress, _token) {
				return undefined;
			},
			async provideTokenCount(_model, _text, _token) {
				return 1;
			},
		}));
	});

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
		disposeAll(disposables);
	});

	function setupParticipant(second?: boolean): Event<{ request: ChatRequest; context: ChatContext }> {
		const emitter = new EventEmitter<{ request: ChatRequest; context: ChatContext }>();
		disposables.push(emitter);

		const id = second ? 'api-test.participant2' : 'api-test.participant';
		const participant = chat.createChatParticipant(id, (request, context, _progress, _token) => {
			emitter.fire({ request, context });
		});
		disposables.push(participant);
		return emitter.event;
	}

	test('participant and slash command history', async () => {
		const onRequest = setupParticipant();
		commands.executeCommand('workbench.action.chat.open', { query: '@participant /hello friend' });

		const deferred = new DeferredPromise<void>();
		let i = 0;
		disposables.push(onRequest(request => {
			try {
				if (i === 0) {
					assert.deepStrictEqual(request.request.command, 'hello');
					assert.strictEqual(request.request.prompt, 'friend');
					i++;
					setTimeout(() => {
						commands.executeCommand('workbench.action.chat.open', { query: '@participant /hello friend' });
					}, 0);
				} else {
					assert.strictEqual(request.context.history.length, 2);
					assert.strictEqual(request.context.history[0].participant, 'api-test.participant');
					assert.strictEqual(request.context.history[0].command, 'hello');
					assert.ok(request.context.history[0] instanceof ChatRequestTurn && request.context.history[0] instanceof ChatRequestTurn2);
					deferred.complete();
				}
			} catch (e) {
				deferred.error(e);
			}
		}));

		await deferred.p;
	});

	test('result metadata is returned to the followup provider', async () => {
		const deferred = new DeferredPromise<ChatResult>();
		const participant = chat.createChatParticipant('api-test.participant', (_request, _context, _progress, _token) => {
			return { metadata: { key: 'value' } };
		});
		participant.followupProvider = {
			provideFollowups(result, _context, _token) {
				deferred.complete(result);
				return [];
			},
		};
		disposables.push(participant);

		commands.executeCommand('workbench.action.chat.open', { query: '@participant /hello friend' });
		const result = await deferred.p;
		assert.deepStrictEqual(result.metadata, { key: 'value' });
	});

	test('isolated participant history', async () => {
		const onRequest = setupParticipant();
		const onRequest2 = setupParticipant(true);

		commands.executeCommand('workbench.action.chat.open', { query: '@participant hi' });
		await asPromise(onRequest);

		// Request is still being handled at this point, wait for it to end
		setTimeout(() => {
			commands.executeCommand('workbench.action.chat.open', { query: '@participant2 hi' });
		}, 0);
		const request2 = await asPromise(onRequest2);
		assert.strictEqual(request2.context.history.length, 0);

		setTimeout(() => {
			commands.executeCommand('workbench.action.chat.open', { query: '@participant2 hi' });
		}, 0);
		const request3 = await asPromise(onRequest2);
		assert.strictEqual(request3.context.history.length, 2); // request + response = 2
	});

	// fixme(rwoll): workbench.action.chat.open.blockOnResponse tests are flaking in CI:
	//               * https://github.com/microsoft/vscode/issues/263572
	//               * https://github.com/microsoft/vscode/issues/263575
	test.skip('workbench.action.chat.open.blockOnResponse defaults to non-blocking for backwards compatibility', async () => {
		const toolRegistration = lm.registerTool<void>('requires_confirmation_tool', {
			invoke: async (_options, _token) => null, prepareInvocation: async (_options, _token) => {
				return { invocationMessage: 'Invoking', pastTenseMessage: 'Invoked', confirmationMessages: { title: 'Confirm', message: 'Are you sure?' } };
			}
		});

		const participant = chat.createChatParticipant('api-test.participant', async (_request, _context, _progress, _token) => {
			await lm.invokeTool('requires_confirmation_tool', {
				input: {},
				toolInvocationToken: _request.toolInvocationToken,
			});
			return { metadata: { complete: true } };
		});
		disposables.push(participant, toolRegistration);

		await commands.executeCommand('workbench.action.chat.newChat');
		const result = await commands.executeCommand('workbench.action.chat.open', { query: 'hello' });
		assert.strictEqual(result, undefined);
	});

	test.skip('workbench.action.chat.open.blockOnResponse resolves when waiting for user confirmation to run a tool', async () => {
		const toolRegistration = lm.registerTool<void>('requires_confirmation_tool', {
			invoke: async (_options, _token) => null, prepareInvocation: async (_options, _token) => {
				return { invocationMessage: 'Invoking', pastTenseMessage: 'Invoked', confirmationMessages: { title: 'Confirm', message: 'Are you sure?' } };
			}
		});

		const participant = chat.createChatParticipant('api-test.participant', async (_request, _context, _progress, _token) => {
			await lm.invokeTool('requires_confirmation_tool', {
				input: {},
				toolInvocationToken: _request.toolInvocationToken,
			});
			return { metadata: { complete: true } };
		});
		disposables.push(participant, toolRegistration);

		await commands.executeCommand('workbench.action.chat.newChat');
		const result: any = await commands.executeCommand('workbench.action.chat.open', { query: 'hello', blockOnResponse: true });
		assert.strictEqual(result?.type, 'confirmation');
	});

	test.skip('workbench.action.chat.open.blockOnResponse resolves when an error is hit', async () => {
		const participant = chat.createChatParticipant('api-test.participant', async (_request, _context, _progress, _token) => {
			return { errorDetails: { code: 'rate_limited', message: `You've been rate limited. Try again later!` } };
		});
		disposables.push(participant);

		await commands.executeCommand('workbench.action.chat.newChat');
		const result = await commands.executeCommand('workbench.action.chat.open', { query: 'hello', blockOnResponse: true });
		type PartialChatAgentResult = {
			errorDetails: {
				code: string;
			};
		};
		assert.strictEqual((<PartialChatAgentResult>result).errorDetails.code, 'rate_limited');
	});

	test('title provider is called for first request', async () => {
		let calls = 0;
		const deferred = new DeferredPromise<void>();
		const participant = chat.createChatParticipant('api-test.participant', (_request, _context, _progress, _token) => {
			return { metadata: { key: 'value' } };
		});
		participant.titleProvider = {
			provideChatTitle(_context, _token) {
				calls++;
				deferred.complete();
				return 'title';
			}
		};
		disposables.push(participant);

		await commands.executeCommand('workbench.action.chat.newChat');
		commands.executeCommand('workbench.action.chat.open', { query: '@participant /hello friend' });

		// Wait for title provider to be called once
		await deferred.p;
		assert.strictEqual(calls, 1);

		commands.executeCommand('workbench.action.chat.open', { query: '@participant /hello friend' });
		await delay(500);

		// Title provider was not called again
		assert.strictEqual(calls, 1);
	});

	test('can access node-pty module', async function () {
		// Required for copilot cli in chat extension.
		if (env.uiKind === UIKind.Web) {
			this.skip();
		}
		const nodePtyModules = [
			join(env.appRoot, 'node_modules.asar', 'node-pty'),
			join(env.appRoot, 'node_modules', 'node-pty')
		];

		for (const modulePath of nodePtyModules) {
			// try to stat and require module
			try {
				await fs.promises.stat(modulePath);
				const nodePty = require(modulePath);
				assert.ok(nodePty, `Successfully required node-pty from ${modulePath}`);
				return;
			} catch (err) {
				// failed to require, try next
			}
		}
		assert.fail('Failed to find and require node-pty module');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/commands.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/commands.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { join } from 'path';
import { commands, Position, Range, Uri, ViewColumn, window, workspace } from 'vscode';
import { assertNoRpc, closeAllEditors } from '../utils';

suite('vscode API - commands', () => {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test('getCommands', function (done) {

		const p1 = commands.getCommands().then(commands => {
			let hasOneWithUnderscore = false;
			for (const command of commands) {
				if (command[0] === '_') {
					hasOneWithUnderscore = true;
					break;
				}
			}
			assert.ok(hasOneWithUnderscore);
		}, done);

		const p2 = commands.getCommands(true).then(commands => {
			let hasOneWithUnderscore = false;
			for (const command of commands) {
				if (command[0] === '_') {
					hasOneWithUnderscore = true;
					break;
				}
			}
			assert.ok(!hasOneWithUnderscore);
		}, done);

		Promise.all([p1, p2]).then(() => {
			done();
		}, done);
	});

	test('command with args', async function () {

		let args: IArguments;
		const registration = commands.registerCommand('t1', function () {
			args = arguments;
		});

		await commands.executeCommand('t1', 'start');
		registration.dispose();
		assert.ok(args!);
		assert.strictEqual(args!.length, 1);
		assert.strictEqual(args![0], 'start');
	});

	test('editorCommand with extra args', function () {

		let args: IArguments;
		const registration = commands.registerTextEditorCommand('t1', function () {
			args = arguments;
		});

		return workspace.openTextDocument(join(workspace.rootPath || '', './far.js')).then(doc => {
			return window.showTextDocument(doc).then(_editor => {
				return commands.executeCommand('t1', 12345, commands);
			}).then(() => {
				assert.ok(args);
				assert.strictEqual(args.length, 4);
				assert.ok(args[2] === 12345);
				assert.ok(args[3] === commands);
				registration.dispose();
			});
		});

	});

	test('api-command: vscode.diff', function () {

		const registration = workspace.registerTextDocumentContentProvider('sc', {
			provideTextDocumentContent(uri) {
				return `content of URI <b>${uri.toString()}</b>#${Math.random()}`;
			}
		});


		const a = commands.executeCommand('vscode.diff', Uri.parse('sc:a'), Uri.parse('sc:b'), 'DIFF').then(value => {
			assert.ok(value === undefined);
			registration.dispose();
		});

		const b = commands.executeCommand('vscode.diff', Uri.parse('sc:a'), Uri.parse('sc:b')).then(value => {
			assert.ok(value === undefined);
			registration.dispose();
		});

		const c = commands.executeCommand('vscode.diff', Uri.parse('sc:a'), Uri.parse('sc:b'), 'Title', { selection: new Range(new Position(1, 1), new Position(1, 2)) }).then(value => {
			assert.ok(value === undefined);
			registration.dispose();
		});

		const d = commands.executeCommand('vscode.diff').then(() => assert.ok(false), () => assert.ok(true));
		const e = commands.executeCommand('vscode.diff', 1, 2, 3).then(() => assert.ok(false), () => assert.ok(true));

		return Promise.all([a, b, c, d, e]);
	});

	test('api-command: vscode.open', async function () {
		assert.ok(workspace.workspaceFolders);
		assert.ok(workspace.workspaceFolders.length > 0);
		const uri = Uri.parse(workspace.workspaceFolders[0].uri.toString() + '/far.js');

		await commands.executeCommand('vscode.open', uri);
		assert.strictEqual(window.tabGroups.all.length, 1);
		assert.strictEqual(window.tabGroups.all[0].activeTab?.group.viewColumn, ViewColumn.One);

		await commands.executeCommand('vscode.open', uri, ViewColumn.Two);
		assert.strictEqual(window.tabGroups.all.length, 2);
		assert.strictEqual(window.tabGroups.all[1].activeTab?.group.viewColumn, ViewColumn.Two);

		await commands.executeCommand('vscode.open', uri, ViewColumn.One);
		assert.strictEqual(window.tabGroups.all.length, 2);
		assert.strictEqual(window.tabGroups.all[0].activeTab?.group.viewColumn, ViewColumn.One);

		let e1: Error | undefined = undefined;
		try {
			await commands.executeCommand('vscode.open');
		} catch (error) {
			e1 = error;
		}
		assert.ok(e1);

		let e2: Error | undefined = undefined;
		try {
			await commands.executeCommand('vscode.open', uri, true);
		} catch (error) {
			e2 = error;
		}
		assert.ok(e2);


		// we support strings but only http/https. those we cannot test but we can
		// enforce that other schemes are treated strict
		try {
			await commands.executeCommand('vscode.open', 'file:///some/path/not/http');
			assert.fail('expecting exception');
		} catch {
			assert.ok(true);
		}

	});

	test('api-command: vscode.open with untitled supports associated resource (#138925)', async function () {
		const uri = Uri.parse(workspace.workspaceFolders![0].uri.toString() + '/untitled-file.txt').with({ scheme: 'untitled' });
		await commands.executeCommand('vscode.open', uri).then(() => assert.ok(true), () => assert.ok(false));

		// untitled with associated resource are dirty from the beginning
		assert.ok(window.activeTextEditor?.document.isDirty);

		return closeAllEditors();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/configuration.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/configuration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { assertNoRpc, Mutable } from '../utils';

suite('vscode API - configuration', () => {

	teardown(assertNoRpc);

	test('configurations, language defaults', function () {
		const defaultLanguageSettings = vscode.workspace.getConfiguration().get('[abcLang]');

		assert.deepStrictEqual(defaultLanguageSettings, {
			'editor.lineNumbers': 'off',
			'editor.tabSize': 2
		});
	});

	test('configuration, defaults', () => {
		const config = vscode.workspace.getConfiguration('farboo');

		assert.ok(config.has('config0'));
		assert.strictEqual(config.get('config0'), true);
		assert.strictEqual(config.get('config4'), '');
		assert.strictEqual(config['config0'], true);
		assert.strictEqual(config['config4'], '');

		assert.throws(() => (config as Mutable<typeof config>)['config4'] = 'valuevalue');

		assert.ok(config.has('nested.config1'));
		assert.strictEqual(config.get('nested.config1'), 42);
		assert.ok(config.has('nested.config2'));
		assert.strictEqual(config.get('nested.config2'), 'Das Pferd frisst kein Reis.');
	});

	test('configuration, name vs property', () => {
		const config = vscode.workspace.getConfiguration('farboo');

		assert.ok(config.has('get'));
		assert.strictEqual(config.get('get'), 'get-prop');
		assert.deepStrictEqual(config['get'], config.get);
		assert.throws(() => (config as Mutable<typeof config>)['get'] = 'get-prop' as unknown as typeof config.get);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/debug.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/debug.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { basename } from 'path';
import { commands, debug, Disposable, FunctionBreakpoint, window, workspace } from 'vscode';
import { assertNoRpc, closeAllEditors, createRandomFile, disposeAll } from '../utils';

suite('vscode API - debug', function () {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test.skip('breakpoints are available before accessing debug extension API', async () => {
		const file = await createRandomFile(undefined, undefined, '.js');
		const doc = await workspace.openTextDocument(file);
		await window.showTextDocument(doc);
		await commands.executeCommand('editor.debug.action.toggleBreakpoint');

		assert.strictEqual(debug.breakpoints.length, 1);
		await commands.executeCommand('editor.debug.action.toggleBreakpoint');
	});

	test('breakpoints', async function () {
		assert.strictEqual(debug.breakpoints.length, 0);
		let onDidChangeBreakpointsCounter = 0;
		const toDispose: Disposable[] = [];

		toDispose.push(debug.onDidChangeBreakpoints(() => {
			onDidChangeBreakpointsCounter++;
		}));

		debug.addBreakpoints([{ id: '1', enabled: true }, { id: '2', enabled: false, condition: '2 < 5' }]);
		assert.strictEqual(onDidChangeBreakpointsCounter, 1);
		assert.strictEqual(debug.breakpoints.length, 2);
		assert.strictEqual(debug.breakpoints[0].id, '1');
		assert.strictEqual(debug.breakpoints[1].id, '2');
		assert.strictEqual(debug.breakpoints[1].condition, '2 < 5');

		debug.removeBreakpoints([{ id: '1', enabled: true }]);
		assert.strictEqual(onDidChangeBreakpointsCounter, 2);
		assert.strictEqual(debug.breakpoints.length, 1);

		debug.removeBreakpoints([{ id: '2', enabled: false }]);
		assert.strictEqual(onDidChangeBreakpointsCounter, 3);
		assert.strictEqual(debug.breakpoints.length, 0);

		disposeAll(toDispose);
	});

	test('function breakpoint', async function () {
		assert.strictEqual(debug.breakpoints.length, 0);
		debug.addBreakpoints([new FunctionBreakpoint('func', false, 'condition', 'hitCondition', 'logMessage')]);
		const functionBreakpoint = debug.breakpoints[0] as FunctionBreakpoint;
		assert.strictEqual(functionBreakpoint.condition, 'condition');
		assert.strictEqual(functionBreakpoint.hitCondition, 'hitCondition');
		assert.strictEqual(functionBreakpoint.logMessage, 'logMessage');
		assert.strictEqual(functionBreakpoint.enabled, false);
		assert.strictEqual(functionBreakpoint.functionName, 'func');
	});

	test.skip('start debugging', async function () { // Flaky: https://github.com/microsoft/vscode/issues/242033
		let stoppedEvents = 0;
		let variablesReceived: () => void;
		let initializedReceived: () => void;
		let configurationDoneReceived: () => void;
		const toDispose: Disposable[] = [];
		if (debug.activeDebugSession) {
			// We are re-running due to flakyness, make sure to clear out state
			let sessionTerminatedRetry: () => void;
			toDispose.push(debug.onDidTerminateDebugSession(() => {
				sessionTerminatedRetry();
			}));
			const sessionTerminatedPromise = new Promise<void>(resolve => sessionTerminatedRetry = resolve);
			await commands.executeCommand('workbench.action.debug.stop');
			await sessionTerminatedPromise;
		}

		const firstVariablesRetrieved = new Promise<void>(resolve => variablesReceived = resolve);
		toDispose.push(debug.registerDebugAdapterTrackerFactory('*', {
			createDebugAdapterTracker: () => ({
				onDidSendMessage: m => {
					if (m.event === 'stopped') {
						stoppedEvents++;
					}
					if (m.type === 'response' && m.command === 'variables') {
						variablesReceived();
					}
					if (m.event === 'initialized') {
						initializedReceived();
					}
					if (m.command === 'configurationDone') {
						configurationDoneReceived();
					}
				}
			})
		}));

		const initializedPromise = new Promise<void>(resolve => initializedReceived = resolve);
		const configurationDonePromise = new Promise<void>(resolve => configurationDoneReceived = resolve);
		const success = await debug.startDebugging(workspace.workspaceFolders![0], 'Launch debug.js');
		assert.strictEqual(success, true);
		await initializedPromise;
		await configurationDonePromise;

		await firstVariablesRetrieved;
		assert.notStrictEqual(debug.activeDebugSession, undefined);
		assert.strictEqual(stoppedEvents, 1);

		const secondVariablesRetrieved = new Promise<void>(resolve => variablesReceived = resolve);
		await commands.executeCommand('workbench.action.debug.stepOver');
		await secondVariablesRetrieved;
		assert.strictEqual(stoppedEvents, 2);
		const editor = window.activeTextEditor;
		assert.notStrictEqual(editor, undefined);
		assert.strictEqual(basename(editor!.document.fileName), 'debug.js');

		const thirdVariablesRetrieved = new Promise<void>(resolve => variablesReceived = resolve);
		await commands.executeCommand('workbench.action.debug.stepOver');
		await thirdVariablesRetrieved;
		assert.strictEqual(stoppedEvents, 3);

		const fourthVariablesRetrieved = new Promise<void>(resolve => variablesReceived = resolve);
		await commands.executeCommand('workbench.action.debug.stepInto');
		await fourthVariablesRetrieved;
		assert.strictEqual(stoppedEvents, 4);

		const fifthVariablesRetrieved = new Promise<void>(resolve => variablesReceived = resolve);
		await commands.executeCommand('workbench.action.debug.stepOut');
		await fifthVariablesRetrieved;
		assert.strictEqual(stoppedEvents, 5);

		let sessionTerminated: () => void;
		toDispose.push(debug.onDidTerminateDebugSession(() => {
			sessionTerminated();
		}));
		const sessionTerminatedPromise = new Promise<void>(resolve => sessionTerminated = resolve);
		await commands.executeCommand('workbench.action.debug.stop');
		await sessionTerminatedPromise;
		disposeAll(toDispose);
	});

	test('start debugging failure', async function () {
		let errorCount = 0;
		try {
			await debug.startDebugging(workspace.workspaceFolders![0], 'non existent');
		} catch (e) {
			errorCount++;
		}
		assert.strictEqual(errorCount, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/documentPaste.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/documentPaste.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { closeAllEditors, createRandomFile, disposeAll } from '../utils';

const textPlain = 'text/plain';

// Skipped due to flakiness on Linux Desktop and errors on web
suite.skip('vscode API - Copy Paste', function () {

	this.retries(3);

	const testDisposables: vscode.Disposable[] = [];

	teardown(async function () {
		disposeAll(testDisposables);
		await closeAllEditors();
	});

	test('Copy should be able to overwrite text/plain', async () => {
		const file = await createRandomFile('$abcde@');
		const doc = await vscode.workspace.openTextDocument(file);

		const editor = await vscode.window.showTextDocument(doc);
		editor.selections = [new vscode.Selection(0, 1, 0, 6)];

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				const existing = dataTransfer.get(textPlain);
				if (existing) {
					const str = await existing.asString();
					const reversed = reverseString(str);
					dataTransfer.set(textPlain, new vscode.DataTransferItem(reversed));
				}
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		assert.strictEqual(await newDocContent, '$edcba@');
	});

	test('Copy with empty selection should copy entire line', async () => {
		const file = await createRandomFile('abc\ndef');
		const doc = await vscode.workspace.openTextDocument(file);
		await vscode.window.showTextDocument(doc);

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				const existing = dataTransfer.get(textPlain);
				if (existing) {
					const str = await existing.asString();
					// text/plain includes the trailing new line in this case
					// On windows, this will always be `\r\n` even if the document uses `\n`
					const eol = str.match(/\r?\n$/)?.[0] ?? '\n';
					const reversed = reverseString(str.slice(0, -eol.length));
					dataTransfer.set(textPlain, new vscode.DataTransferItem(reversed + '\n'));
				}
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		assert.strictEqual(await newDocContent, `cba\nabc\ndef`);
	});

	test('Copy with multiple selections should get all selections', async () => {
		const file = await createRandomFile('111\n222\n333');
		const doc = await vscode.workspace.openTextDocument(file);
		const editor = await vscode.window.showTextDocument(doc);

		editor.selections = [
			new vscode.Selection(0, 0, 0, 3),
			new vscode.Selection(2, 0, 2, 3),
		];

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(document: vscode.TextDocument, ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				const existing = dataTransfer.get(textPlain);
				if (existing) {
					const selections = ranges.map(range => document.getText(range));
					dataTransfer.set(textPlain, new vscode.DataTransferItem(`(${ranges.length})${selections.join(' ')}`));
				}
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		editor.selections = [new vscode.Selection(0, 0, 0, 0)];
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');

		assert.strictEqual(await newDocContent, `(2)111 333111\n222\n333`);
	});

	test('Earlier invoked copy providers should win when writing values', async () => {
		const file = await createRandomFile('abc\ndef');
		const doc = await vscode.workspace.openTextDocument(file);

		const editor = await vscode.window.showTextDocument(doc);
		editor.selections = [new vscode.Selection(0, 0, 0, 3)];

		const callOrder: string[] = [];
		const a_id = 'a';
		const b_id = 'b';

		let providerAResolve: () => void;
		const providerAFinished = new Promise<void>(resolve => providerAResolve = resolve);

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				callOrder.push(a_id);
				dataTransfer.set(textPlain, new vscode.DataTransferItem('a'));
				providerAResolve();
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		// Later registered providers will be called first
		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				callOrder.push(b_id);

				// Wait for the first provider to finish even though we were called first.
				// This tests that resulting order does not depend on the order the providers
				// return in.
				await providerAFinished;

				dataTransfer.set(textPlain, new vscode.DataTransferItem('b'));
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		assert.strictEqual(await newDocContent, 'b\ndef');

		// Confirm provider call order is what we expected
		assert.deepStrictEqual(callOrder, [b_id, a_id]);
	});

	test('Copy providers should not be able to effect the data transfer of another', async () => {
		const file = await createRandomFile('abc\ndef');
		const doc = await vscode.workspace.openTextDocument(file);

		const editor = await vscode.window.showTextDocument(doc);
		editor.selections = [new vscode.Selection(0, 0, 0, 3)];


		let providerAResolve: () => void;
		const providerAFinished = new Promise<void>(resolve => providerAResolve = resolve);

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				dataTransfer.set(textPlain, new vscode.DataTransferItem('xyz'));
				providerAResolve();
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {

				// Wait for the first provider to finish
				await providerAFinished;

				// We we access the data transfer here, we should not see changes made by the first provider
				const entry = dataTransfer.get(textPlain);
				const str = await entry!.asString();
				dataTransfer.set(textPlain, new vscode.DataTransferItem(reverseString(str)));
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		assert.strictEqual(await newDocContent, 'cba\ndef');
	});


	test('One failing provider should not effect other', async () => {
		const file = await createRandomFile('abc\ndef');
		const doc = await vscode.workspace.openTextDocument(file);

		const editor = await vscode.window.showTextDocument(doc);
		editor.selections = [new vscode.Selection(0, 0, 0, 3)];

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				dataTransfer.set(textPlain, new vscode.DataTransferItem('xyz'));
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		testDisposables.push(vscode.languages.registerDocumentPasteEditProvider({ language: 'plaintext' }, new class implements vscode.DocumentPasteEditProvider {
			async prepareDocumentPaste(_document: vscode.TextDocument, _ranges: readonly vscode.Range[], _dataTransfer: vscode.DataTransfer, _token: vscode.CancellationToken): Promise<void> {
				throw new Error('Expected testing error from bad provider');
			}
		}, { providedPasteEditKinds: [vscode.DocumentDropOrPasteEditKind.Empty.append('test')], copyMimeTypes: [textPlain] }));

		await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
		const newDocContent = getNextDocumentText(testDisposables, doc);
		await vscode.commands.executeCommand('editor.action.clipboardPasteAction');
		assert.strictEqual(await newDocContent, 'xyz\ndef');
	});
});

function reverseString(str: string) {
	return str.split('').reverse().join('');
}

function getNextDocumentText(disposables: vscode.Disposable[], doc: vscode.TextDocument): Promise<string> {
	return new Promise<string>(resolve => {
		disposables.push(vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.fsPath === doc.uri.fsPath) {
				resolve(e.document.getText());
			}
		}));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/editor.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/editor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { env, Position, Range, Selection, SnippetString, TextDocument, TextEditor, TextEditorCursorStyle, TextEditorLineNumbersStyle, Uri, window, workspace } from 'vscode';
import { assertNoRpc, closeAllEditors, createRandomFile, deleteFile } from '../utils';

suite('vscode API - editors', () => {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	function withRandomFileEditor(initialContents: string, run: (editor: TextEditor, doc: TextDocument) => Thenable<void>): Thenable<boolean> {
		return createRandomFile(initialContents).then(file => {
			return workspace.openTextDocument(file).then(doc => {
				return window.showTextDocument(doc).then((editor) => {
					return run(editor, doc).then(_ => {
						if (doc.isDirty) {
							return doc.save().then(saved => {
								assert.ok(saved);
								assert.ok(!doc.isDirty);
								return deleteFile(file);
							});
						} else {
							return deleteFile(file);
						}
					});
				});
			});
		});
	}

	test('insert snippet', () => {
		const snippetString = new SnippetString()
			.appendText('This is a ')
			.appendTabstop()
			.appendPlaceholder('placeholder')
			.appendText(' snippet');

		return withRandomFileEditor('', (editor, doc) => {
			return editor.insertSnippet(snippetString).then(inserted => {
				assert.ok(inserted);
				assert.strictEqual(doc.getText(), 'This is a placeholder snippet');
				assert.ok(doc.isDirty);
			});
		});
	});

	test('insert snippet with clipboard variables', async function () {
		const old = await env.clipboard.readText();

		const newValue = 'INTEGRATION-TESTS';
		await env.clipboard.writeText(newValue);

		const actualValue = await env.clipboard.readText();

		if (actualValue !== newValue) {
			// clipboard not working?!?
			this.skip();
			return;
		}

		const snippetString = new SnippetString('running: $CLIPBOARD');

		await withRandomFileEditor('', async (editor, doc) => {
			const inserted = await editor.insertSnippet(snippetString);
			assert.ok(inserted);
			assert.strictEqual(doc.getText(), 'running: INTEGRATION-TESTS');
			assert.ok(doc.isDirty);
		});

		await env.clipboard.writeText(old);
	});

	test('insert snippet with replacement, editor selection', () => {
		const snippetString = new SnippetString()
			.appendText('has been');

		return withRandomFileEditor('This will be replaced', (editor, doc) => {
			editor.selection = new Selection(
				new Position(0, 5),
				new Position(0, 12)
			);

			return editor.insertSnippet(snippetString).then(inserted => {
				assert.ok(inserted);
				assert.strictEqual(doc.getText(), 'This has been replaced');
				assert.ok(doc.isDirty);
			});
		});
	});

	/**
	 * Given :
	 * This is line 1
	 *   |
	 *
	 * Expect :
	 * This is line 1
	 *   This is line 2
	 *   This is line 3
	 *
	 * The 3rd line should not be auto-indented, as the edit already
	 * contains the necessary adjustment.
	 */
	test('insert snippet with replacement, avoid adjusting indentation', () => {
		const snippetString = new SnippetString()
			.appendText('This is line 2\n  This is line 3');

		return withRandomFileEditor('This is line 1\n  ', (editor, doc) => {
			editor.selection = new Selection(
				new Position(1, 3),
				new Position(1, 3)
			);

			return editor.insertSnippet(snippetString, undefined, { undoStopAfter: false, undoStopBefore: false, keepWhitespace: true }).then(inserted => {
				assert.ok(inserted);
				assert.strictEqual(doc.getText(), 'This is line 1\n  This is line 2\n  This is line 3');
				assert.ok(doc.isDirty);
			});
		});
	});

	test('insert snippet with replacement, selection as argument', () => {
		const snippetString = new SnippetString()
			.appendText('has been');

		return withRandomFileEditor('This will be replaced', (editor, doc) => {
			const selection = new Selection(
				new Position(0, 5),
				new Position(0, 12)
			);

			return editor.insertSnippet(snippetString, selection).then(inserted => {
				assert.ok(inserted);
				assert.strictEqual(doc.getText(), 'This has been replaced');
				assert.ok(doc.isDirty);
			});
		});
	});

	test('make edit', () => {
		return withRandomFileEditor('', (editor, doc) => {
			return editor.edit((builder) => {
				builder.insert(new Position(0, 0), 'Hello World');
			}).then(applied => {
				assert.ok(applied);
				assert.strictEqual(doc.getText(), 'Hello World');
				assert.ok(doc.isDirty);
			});
		});
	});

	test('issue #6281: Edits fail to validate ranges correctly before applying', () => {
		return withRandomFileEditor('Hello world!', (editor, doc) => {
			return editor.edit((builder) => {
				builder.replace(new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE), 'new');
			}).then(applied => {
				assert.ok(applied);
				assert.strictEqual(doc.getText(), 'new');
				assert.ok(doc.isDirty);
			});
		});
	});

	test('issue #16573: Extension API: insertSpaces and tabSize are undefined', () => {
		return withRandomFileEditor('Hello world!\n\tHello world!', (editor, _doc) => {

			assert.strictEqual(editor.options.tabSize, 4);
			assert.strictEqual(editor.options.insertSpaces, false);
			assert.strictEqual(editor.options.cursorStyle, TextEditorCursorStyle.Line);
			assert.strictEqual(editor.options.lineNumbers, TextEditorLineNumbersStyle.On);

			editor.options = {
				tabSize: 2
			};

			assert.strictEqual(editor.options.tabSize, 2);
			assert.strictEqual(editor.options.insertSpaces, false);
			assert.strictEqual(editor.options.cursorStyle, TextEditorCursorStyle.Line);
			assert.strictEqual(editor.options.lineNumbers, TextEditorLineNumbersStyle.On);

			editor.options.tabSize = 'invalid';

			assert.strictEqual(editor.options.tabSize, 2);
			assert.strictEqual(editor.options.insertSpaces, false);
			assert.strictEqual(editor.options.cursorStyle, TextEditorCursorStyle.Line);
			assert.strictEqual(editor.options.lineNumbers, TextEditorLineNumbersStyle.On);

			return Promise.resolve();
		});
	});

	test('issue #20757: Overlapping ranges are not allowed!', () => {
		return withRandomFileEditor('Hello world!\n\tHello world!', (editor, _doc) => {
			return editor.edit((builder) => {
				// create two edits that overlap (i.e. are illegal)
				builder.replace(new Range(0, 0, 0, 2), 'He');
				builder.replace(new Range(0, 1, 0, 3), 'el');
			}).then(

				(_applied) => {
					assert.ok(false, 'edit with overlapping ranges should fail');
				},

				(_err) => {
					assert.ok(true, 'edit with overlapping ranges should fail');
				}
			);
		});
	});

	test('throw when using invalid edit', async function () {
		await withRandomFileEditor('foo', editor => {
			return new Promise((resolve, reject) => {
				editor.edit(edit => {
					edit.insert(new Position(0, 0), 'bar');
					setTimeout(() => {
						try {
							edit.insert(new Position(0, 0), 'bar');
							reject(new Error('expected error'));
						} catch (err) {
							assert.ok(true);
							resolve();
						}
					}, 0);
				});
			});
		});
	});

	test('editor contents are correctly read (small file)', function () {
		return testEditorContents('/far.js');
	});

	test('editor contents are correctly read (large file)', async function () {
		return testEditorContents('/lorem.txt');
	});

	async function testEditorContents(relativePath: string) {
		const root = workspace.workspaceFolders![0]!.uri;
		const file = Uri.parse(root.toString() + relativePath);
		const document = await workspace.openTextDocument(file);

		assert.strictEqual(document.getText(), Buffer.from(await workspace.fs.readFile(file)).toString());
	}

	test('extEditor.selection can be empty #18075', async function () {
		await withRandomFileEditor('foo', async editor => {

			assert.ok(editor.selections.length > 0);

			editor.selections = [];

			assert.strictEqual(editor.selections.length, 1);
			assert.strictEqual(editor.selections[0].start.line, 0);
			assert.strictEqual(editor.selections[0].start.character, 0);
			assert.strictEqual(editor.selections[0].end.line, 0);
			assert.strictEqual(editor.selections[0].end.character, 0);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/env.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/env.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { env, ExtensionKind, extensions, UIKind, Uri } from 'vscode';
import { assertNoRpc, Mutable } from '../utils';

suite('vscode API - env', () => {

	teardown(assertNoRpc);

	test('env is set', function () {
		assert.strictEqual(typeof env.language, 'string');
		assert.strictEqual(typeof env.appRoot, 'string');
		assert.strictEqual(typeof env.appName, 'string');
		assert.strictEqual(typeof env.machineId, 'string');
		assert.strictEqual(typeof env.sessionId, 'string');
		assert.strictEqual(typeof env.shell, 'string');
	});

	test('env is readonly', function () {
		assert.throws(() => (env as Mutable<typeof env>).language = '234');
		assert.throws(() => (env as Mutable<typeof env>).appRoot = '234');
		assert.throws(() => (env as Mutable<typeof env>).appName = '234');
		assert.throws(() => (env as Mutable<typeof env>).machineId = '234');
		assert.throws(() => (env as Mutable<typeof env>).sessionId = '234');
		assert.throws(() => (env as Mutable<typeof env>).shell = '234');
	});

	test('env.remoteName', function () {
		const remoteName = env.remoteName;
		const knownWorkspaceExtension = extensions.getExtension('vscode.git');
		const knownUiAndWorkspaceExtension = extensions.getExtension('vscode.media-preview');
		if (typeof remoteName === 'undefined') {
			// not running in remote, so we expect both extensions
			assert.ok(knownWorkspaceExtension);
			assert.ok(knownUiAndWorkspaceExtension);
			assert.strictEqual(ExtensionKind.UI, knownUiAndWorkspaceExtension!.extensionKind);
		} else if (typeof remoteName === 'string') {
			// running in remote, so we only expect workspace extensions
			assert.ok(knownWorkspaceExtension);
			if (env.uiKind === UIKind.Desktop) {
				assert.ok(!knownUiAndWorkspaceExtension); // we currently can only access extensions that run on same host
			} else {
				assert.ok(knownUiAndWorkspaceExtension);
			}
			assert.strictEqual(ExtensionKind.Workspace, knownWorkspaceExtension!.extensionKind);
		} else {
			assert.fail();
		}
	});

	test('env.uiKind', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);

		const kind = env.uiKind;
		if (result.scheme === 'http' || result.scheme === 'https') {
			assert.strictEqual(kind, UIKind.Web);
		} else {
			assert.strictEqual(kind, UIKind.Desktop);
		}
	});

	test('env.asExternalUri - with env.uriScheme', async function () {
		const uri = Uri.parse(`${env.uriScheme}:://vscode.vscode-api-tests/path?key=value&other=false`);
		const result = await env.asExternalUri(uri);
		assert.ok(result);

		if (env.uiKind === UIKind.Desktop) {
			assert.strictEqual(uri.scheme, result.scheme);
			assert.strictEqual(uri.authority, result.authority);
			assert.strictEqual(uri.path, result.path);
		} else {
			assert.ok(result.scheme === 'http' || result.scheme === 'https');
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/extensions.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/extensions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';

suite('vscode server cli', () => {


	test('extension is installed and enabled when installed by server cli', function () {
		const extension = process.env.TESTRESOLVER_INSTALL_BUILTIN_EXTENSION;
		if (!process.env.BUILD_SOURCEVERSION // Skip it when running out of sources
			|| process.env.VSCODE_QUALITY === 'oss' // Skip it when running an OSS build
			|| !process.env.REMOTE_VSCODE // Skip it when not a remote integration test
			|| !extension // Skip it when extension is not provided to server
		) {
			this.skip();
		}

		assert.ok(vscode.extensions.getExtension(extension!));
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/index.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: any = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Single Folder Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Single Folder Tests';
} else {
	suite = 'Integration Single Folder Tests';
}

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

testRunner.configure(options);

export = testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/interactiveWindow.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/interactiveWindow.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { asPromise, disposeAll, poll } from '../utils';
import { Kernel, saveAllFilesAndCloseAll } from './notebook.api.test';

export type INativeInteractiveWindow = { notebookUri: vscode.Uri; inputUri: vscode.Uri; notebookEditor: vscode.NotebookEditor };

async function createInteractiveWindow(kernel: Kernel) {
	const { notebookEditor, inputUri } = (await vscode.commands.executeCommand(
		'interactive.open',
		// Keep focus on the owning file if there is one
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
		undefined,
		`vscode.vscode-api-tests/${kernel.controller.id}`,
		undefined
	)) as unknown as INativeInteractiveWindow;
	assert.ok(notebookEditor, 'Interactive Window was not created successfully');

	return { notebookEditor, inputUri };
}

async function addCell(code: string, notebook: vscode.NotebookDocument) {
	const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, code, 'typescript');
	const edit = vscode.NotebookEdit.insertCells(notebook.cellCount, [cell]);
	const workspaceEdit = new vscode.WorkspaceEdit();
	workspaceEdit.set(notebook.uri, [edit]);
	const event = asPromise(vscode.workspace.onDidChangeNotebookDocument);
	await vscode.workspace.applyEdit(workspaceEdit);
	await event;
	return notebook.cellAt(notebook.cellCount - 1);
}

async function addCellAndRun(code: string, notebook: vscode.NotebookDocument) {
	const initialCellCount = notebook.cellCount;
	const cell = await addCell(code, notebook);

	const event = asPromise(vscode.workspace.onDidChangeNotebookDocument);
	await vscode.commands.executeCommand('notebook.cell.execute', { start: initialCellCount, end: initialCellCount + 1 }, notebook.uri);
	try {
		await event;
	} catch (e) {
		const result = notebook.cellAt(notebook.cellCount - 1);
		assert.fail(`Notebook change event was not triggered after executing newly added cell. Initial Cell count: ${initialCellCount}. Current cell count: ${notebook.cellCount}. execution summary: ${JSON.stringify(result.executionSummary)}`);
	}
	assert.strictEqual(cell.outputs.length, 1, `Executed cell has no output. Initial Cell count: ${initialCellCount}. Current cell count: ${notebook.cellCount}. execution summary: ${JSON.stringify(cell.executionSummary)}`);
	return cell;
}


(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('Interactive Window', function () {

	const testDisposables: vscode.Disposable[] = [];
	let defaultKernel: Kernel;
	let secondKernel: Kernel;

	setup(async function () {
		defaultKernel = new Kernel('mainKernel', 'Notebook Default Kernel', 'interactive');
		secondKernel = new Kernel('secondKernel', 'Notebook Secondary Kernel', 'interactive');
		testDisposables.push(defaultKernel.controller);
		testDisposables.push(secondKernel.controller);
		await saveAllFilesAndCloseAll();
	});

	teardown(async function () {
		disposeAll(testDisposables);
		testDisposables.length = 0;
		await saveAllFilesAndCloseAll();
	});

	test.skip('Can open an interactive window and execute from input box', async () => {
		assert.ok(vscode.workspace.workspaceFolders);
		const { notebookEditor, inputUri } = await createInteractiveWindow(defaultKernel);

		const inputBox = vscode.window.visibleTextEditors.find(
			(e) => e.document.uri.path === inputUri.path
		);
		await inputBox!.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(0, 0), 'print foo');
		});
		await vscode.commands.executeCommand('interactive.execute', notebookEditor.notebook.uri);

		assert.strictEqual(notebookEditor.notebook.cellCount, 1);
		assert.strictEqual(notebookEditor.notebook.cellAt(0).kind, vscode.NotebookCellKind.Code);
	});

	test('Interactive window scrolls after execute', async () => {
		assert.ok(vscode.workspace.workspaceFolders);
		const { notebookEditor } = await createInteractiveWindow(defaultKernel);

		// Run and add a bunch of cells
		for (let i = 0; i < 10; i++) {
			await addCellAndRun(`print ${i}`, notebookEditor.notebook);
		}

		// Verify visible range has the last cell
		if (!lastCellIsVisible(notebookEditor)) {
			// scroll happens async, so give it some time to scroll
			await new Promise<void>((resolve) => setTimeout(() => {
				assert.ok(lastCellIsVisible(notebookEditor), `Last cell is not visible`);
				resolve();
			}, 1000));
		}
	});

	// https://github.com/microsoft/vscode/issues/266229
	test.skip('Interactive window has the correct kernel', async function () {
		// Extend timeout a bit as kernel association can be async & occasionally slow on CI
		this.timeout(20000);
		assert.ok(vscode.workspace.workspaceFolders);
		await createInteractiveWindow(defaultKernel);

		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

		// Create a new interactive window with a different kernel
		const { notebookEditor } = await createInteractiveWindow(secondKernel);
		assert.ok(notebookEditor);

		// Run a cell to ensure the kernel is actually exercised
		await addCellAndRun(`print`, notebookEditor.notebook);

		await poll(
			() => Promise.resolve(secondKernel.associatedNotebooks.has(notebookEditor.notebook.uri.toString())),
			v => v,
			'Secondary kernel was not set as the kernel for the interactive window'
		);
		assert.strictEqual(secondKernel.associatedNotebooks.has(notebookEditor.notebook.uri.toString()), true, `Secondary kernel was not set as the kernel for the interactive window`);
	});
});

function lastCellIsVisible(notebookEditor: vscode.NotebookEditor) {
	if (!notebookEditor.visibleRanges.length) {
		return false;
	}
	const lastVisibleCell = notebookEditor.visibleRanges[notebookEditor.visibleRanges.length - 1].end;
	return notebookEditor.notebook.cellCount === lastVisibleCell;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/ipynb.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/ipynb.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import * as vscode from 'vscode';
import { assertNoRpc, closeAllEditors, createRandomFile } from '../utils';

const ipynbContent = JSON.stringify({
	'cells': [
		{
			'cell_type': 'markdown',
			'source': ['## Header'],
			'metadata': {}
		},
		{
			'cell_type': 'code',
			'execution_count': 2,
			'source': [`print('hello 1')\n`, `print('hello 2')`],
			'outputs': [
				{
					'output_type': 'stream',
					'name': 'stdout',
					'text': ['hello 1\n', 'hello 2\n']
				}
			],
			'metadata': {}
		}
	]
});

suite('ipynb NotebookSerializer', function () {
	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test.skip('Can open an ipynb notebook', async () => {
		const file = await createRandomFile(ipynbContent, undefined, '.ipynb');
		const notebook = await vscode.workspace.openNotebookDocument(file);
		await vscode.window.showNotebookDocument(notebook);

		const notebookEditor = vscode.window.activeNotebookEditor;
		assert.ok(notebookEditor);

		assert.strictEqual(notebookEditor.notebook.cellCount, 2);
		assert.strictEqual(notebookEditor.notebook.cellAt(0).kind, vscode.NotebookCellKind.Markup);
		assert.strictEqual(notebookEditor.notebook.cellAt(1).kind, vscode.NotebookCellKind.Code);
		assert.strictEqual(notebookEditor.notebook.cellAt(1).outputs.length, 1);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/languagedetection.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/languagedetection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { asPromise, assertNoRpc, closeAllEditors } from '../utils';

suite('vscode - automatic language detection', () => {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	// TODO@TylerLeonhardt https://github.com/microsoft/vscode/issues/135157
	test.skip('test automatic language detection works', async () => {
		const receivedEvent = asPromise(vscode.workspace.onDidOpenTextDocument, 5000);
		const doc = await vscode.workspace.openTextDocument();
		const editor = await vscode.window.showTextDocument(doc);
		await receivedEvent;

		assert.strictEqual(editor.document.languageId, 'plaintext');

		const settingResult = vscode.workspace.getConfiguration().get<boolean>('workbench.editor.languageDetection');
		assert.ok(settingResult);

		const result = await editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), `{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"removeComments": false,
		"preserveConstEnums": true,
		"sourceMap": false,
		"outDir": "../out/vs",
		"target": "es2020",
		"types": [
			"mocha",
			"semver",
			"sinon",
			"winreg",
			"trusted-types",
			"wicg-file-system-access"
		],
		"plugins": [
			{
				"name": "tsec",
				"exemptionConfig": "./tsec.exemptions.json"
			}
		]
	},
	"include": [
		"./typings",
		"./vs"
	]
}`);
		});

		assert.ok(result);

		// Changing the language triggers a file to be closed and opened again so wait for that event to happen.
		let newDoc;
		do {
			newDoc = await asPromise(vscode.workspace.onDidOpenTextDocument, 5000);
		} while (doc.uri.toString() !== newDoc.uri.toString());

		assert.strictEqual(newDoc.languageId, 'json');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/languages.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/languages.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { join } from 'path';
import * as vscode from 'vscode';
import { assertNoRpc, createRandomFile, testFs } from '../utils';

suite('vscode API - languages', () => {

	teardown(assertNoRpc);

	const isWindows = process.platform === 'win32';

	function positionToString(p: vscode.Position) {
		return `[${p.character}/${p.line}]`;
	}

	function rangeToString(r: vscode.Range) {
		return `[${positionToString(r.start)}/${positionToString(r.end)}]`;
	}

	function assertEqualRange(actual: vscode.Range, expected: vscode.Range, message?: string) {
		assert.strictEqual(rangeToString(actual), rangeToString(expected), message);
	}

	test('setTextDocumentLanguage -> close/open event', async function () {
		const file = await createRandomFile('foo\nbar\nbar');
		const doc = await vscode.workspace.openTextDocument(file);
		const langIdNow = doc.languageId;
		let clock = 0;
		const disposables: vscode.Disposable[] = [];

		const close = new Promise<void>(resolve => {
			disposables.push(vscode.workspace.onDidCloseTextDocument(e => {
				if (e === doc) {
					assert.strictEqual(doc.languageId, langIdNow);
					assert.strictEqual(clock, 0);
					clock += 1;
					resolve();
				}
			}));
		});
		const open = new Promise<void>(resolve => {
			disposables.push(vscode.workspace.onDidOpenTextDocument(e => {
				if (e === doc) { // same instance!
					assert.strictEqual(doc.languageId, 'json');
					assert.strictEqual(clock, 1);
					clock += 1;
					resolve();
				}
			}));
		});
		const change = vscode.languages.setTextDocumentLanguage(doc, 'json');
		await Promise.all([change, close, open]);
		assert.strictEqual(clock, 2);
		assert.strictEqual(doc.languageId, 'json');
		disposables.forEach(disposable => disposable.dispose());
		disposables.length = 0;
	});

	test('setTextDocumentLanguage -> error when language does not exist', async function () {
		const file = await createRandomFile('foo\nbar\nbar');
		const doc = await vscode.workspace.openTextDocument(file);

		try {
			await vscode.languages.setTextDocumentLanguage(doc, 'fooLangDoesNotExist');
			assert.ok(false);
		} catch (err) {
			assert.ok(err);
		}
	});

	test('diagnostics, read & event', function () {
		const uri = vscode.Uri.file('/foo/bar.txt');
		const col1 = vscode.languages.createDiagnosticCollection('foo1');
		col1.set(uri, [new vscode.Diagnostic(new vscode.Range(0, 0, 0, 12), 'error1')]);

		const col2 = vscode.languages.createDiagnosticCollection('foo2');
		col2.set(uri, [new vscode.Diagnostic(new vscode.Range(0, 0, 0, 12), 'error1')]);

		const diag = vscode.languages.getDiagnostics(uri);
		assert.strictEqual(diag.length, 2);

		const tuples = vscode.languages.getDiagnostics();
		let found = false;
		for (const [thisUri,] of tuples) {
			if (thisUri.toString() === uri.toString()) {
				found = true;
				break;
			}
		}
		assert.ok(tuples.length >= 1);
		assert.ok(found);
	});

	// HINT: If this test fails, and you have been modifying code used in workers, you might have
	// accidentally broken the workers. Check the logs for errors.
	test('link detector', async function () {
		const uri = await createRandomFile('class A { // http://a.com }', undefined, '.java');
		const doc = await vscode.workspace.openTextDocument(uri);

		const target = vscode.Uri.file(isWindows ? 'c:\\foo\\bar' : '/foo/bar');
		const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 5));

		const linkProvider: vscode.DocumentLinkProvider = {
			provideDocumentLinks: _doc => {
				return [new vscode.DocumentLink(range, target)];
			}
		};
		vscode.languages.registerDocumentLinkProvider({ language: 'java', scheme: testFs.scheme }, linkProvider);

		const links = await vscode.commands.executeCommand<vscode.DocumentLink[]>('vscode.executeLinkProvider', doc.uri);
		assert.strictEqual(links && links.length, 2, links.map(l => !l.target).join(', '));
		const [link1, link2] = links!.sort((l1, l2) => l1.range.start.compareTo(l2.range.start));

		assert.strictEqual(link1.target && link1.target.toString(), target.toString());
		assertEqualRange(link1.range, range);

		assert.strictEqual(link2.target && link2.target.toString(), 'http://a.com/');
		assertEqualRange(link2.range, new vscode.Range(new vscode.Position(0, 13), new vscode.Position(0, 25)));
	});

	test('diagnostics & CodeActionProvider', async function () {

		class D2 extends vscode.Diagnostic {
			customProp = { complex() { } };
			constructor() {
				super(new vscode.Range(0, 2, 0, 7), 'sonntag');
			}
		}

		const diag1 = new vscode.Diagnostic(new vscode.Range(0, 0, 0, 5), 'montag');
		const diag2 = new D2();

		let ran = false;
		const uri = vscode.Uri.parse('ttt:path.far');

		const r1 = vscode.languages.registerCodeActionsProvider({ pattern: '*.far', scheme: 'ttt' }, {
			provideCodeActions(_document, _range, ctx): vscode.Command[] {

				assert.strictEqual(ctx.diagnostics.length, 2);
				const [first, second] = ctx.diagnostics;
				assert.ok(first === diag1);
				assert.ok(second === diag2);
				assert.ok(diag2 instanceof D2);
				ran = true;
				return [];
			}
		});

		const r2 = vscode.workspace.registerTextDocumentContentProvider('ttt', {
			provideTextDocumentContent() {
				return 'this is some text';
			}
		});

		const r3 = vscode.languages.createDiagnosticCollection();
		r3.set(uri, [diag1]);

		const r4 = vscode.languages.createDiagnosticCollection();
		r4.set(uri, [diag2]);

		await vscode.workspace.openTextDocument(uri);
		await vscode.commands.executeCommand('vscode.executeCodeActionProvider', uri, new vscode.Range(0, 0, 0, 10));
		assert.ok(ran);
		vscode.Disposable.from(r1, r2, r3, r4).dispose();
	});

	test('completions with document filters', async function () {
		let ran = false;
		const uri = vscode.Uri.file(join(vscode.workspace.rootPath || '', './bower.json'));

		const jsonDocumentFilter = [{ language: 'json', pattern: '**/package.json' }, { language: 'json', pattern: '**/bower.json' }, { language: 'json', pattern: '**/.bower.json' }];

		const r1 = vscode.languages.registerCompletionItemProvider(jsonDocumentFilter, {
			provideCompletionItems: (_document: vscode.TextDocument, _position: vscode.Position, _token: vscode.CancellationToken): vscode.CompletionItem[] => {
				const proposal = new vscode.CompletionItem('foo');
				proposal.kind = vscode.CompletionItemKind.Property;
				ran = true;
				return [proposal];
			}
		});

		await vscode.workspace.openTextDocument(uri);
		const result = await vscode.commands.executeCommand<vscode.CompletionList>('vscode.executeCompletionItemProvider', uri, new vscode.Position(1, 0));
		r1.dispose();
		assert.ok(ran, 'Provider has not been invoked');
		assert.ok(result!.items.some(i => i.label === 'foo'), 'Results do not include "foo"');
	});

	test('folding command', async function () {
		const content = `[
			/**
			 * This is a comment with indentation issues
		*/
			{
				"name": "bag of items",
				"items": [
					"foo", "bar"
				]
			}
		]`;
		const uri = await createRandomFile(content, undefined, '.jsonc');
		await vscode.workspace.openTextDocument(uri);
		const jsonExtension = await vscode.extensions.getExtension('vscode.json-language-features');
		assert.ok(jsonExtension);
		await jsonExtension.activate();
		const result1 = await vscode.commands.executeCommand<vscode.FoldingRange[]>('vscode.executeFoldingRangeProvider', uri);
		assert.deepEqual(result1, [
			{ start: 0, end: 9 },
			{ start: 1, end: 3, kind: vscode.FoldingRangeKind.Comment },
			{ start: 4, end: 8 },
			{ start: 6, end: 7 },
		]);

		await vscode.workspace.getConfiguration('editor').update('foldingStrategy', 'indentation');
		try {
			const result2 = await vscode.commands.executeCommand<vscode.FoldingRange[]>('vscode.executeFoldingRangeProvider', uri);
			assert.deepEqual(result2, [
				{ start: 0, end: 10 },
				{ start: 1, end: 2 },
				{ start: 3, end: 9 },
				{ start: 4, end: 8 },
				{ start: 6, end: 7 },
			]);
			await vscode.workspace.getConfiguration('editor').update('folding', false);
			const result3 = await vscode.commands.executeCommand<vscode.FoldingRange[]>('vscode.executeFoldingRangeProvider', uri);
			assert.deepEqual(result3, []);
		} finally {
			await vscode.workspace.getConfiguration('editor').update('foldingStrategy', undefined);
			await vscode.workspace.getConfiguration('editor').update('folding', undefined);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/lm.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/lm.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { assertNoRpc, closeAllEditors, DeferredPromise, disposeAll } from '../utils';


suite('lm', function () {

	let disposables: vscode.Disposable[] = [];

	const testProviderOptions: vscode.LanguageModelChatInformation = {
		id: 'test-lm',
		name: 'test-lm',
		version: '1.0.0',
		family: 'test',
		maxInputTokens: 100,
		maxOutputTokens: 100,
		capabilities: {}
	};

	setup(function () {
		disposables = [];
	});

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
		disposeAll(disposables);
	});


	test('lm request and stream', async function () {

		let p: vscode.Progress<vscode.LanguageModelResponsePart> | undefined;
		const defer = new DeferredPromise<void>();

		try {
			disposables.push(vscode.lm.registerLanguageModelChatProvider('test-lm-vendor', {
				async provideLanguageModelChatInformation(_options, _token) {
					return [testProviderOptions];
				},
				async provideLanguageModelChatResponse(_model, _messages, _options, progress, _token) {
					p = progress;
					return defer.p;
				},
				async provideTokenCount(_model, _text, _token) {
					return 1;
				},
			}));
		} catch (e) {
			assert.fail(`Failed to register chat model provider: ${e}`);
		}


		const models = await vscode.lm.selectChatModels({ id: 'test-lm' });
		assert.strictEqual(models.length, 1);

		const request = await models[0].sendRequest([vscode.LanguageModelChatMessage.User('Hello')]);

		// assert we have a request immediately
		assert.ok(request);
		assert.ok(p);
		assert.strictEqual(defer.isSettled, false);

		let streamDone = false;
		let responseText = '';

		const pp = (async () => {
			for await (const chunk of request.text) {
				responseText += chunk;
			}
			streamDone = true;
		})();

		assert.strictEqual(responseText, '');
		assert.strictEqual(streamDone, false);

		p.report(new vscode.LanguageModelTextPart('Hello'));
		defer.complete();

		await pp;
		await new Promise(r => setTimeout(r, 1000));

		assert.strictEqual(streamDone, true);
		assert.strictEqual(responseText, 'Hello');
	});

	test('lm request fail', async function () {

		disposables.push(vscode.lm.registerLanguageModelChatProvider('test-lm-vendor', {
			async provideLanguageModelChatInformation(_options, _token) {
				return [testProviderOptions];
			},
			async provideLanguageModelChatResponse(_model, _messages, _options, _progress, _token) {
				throw new Error('BAD');
			},
			async provideTokenCount(_model, _text, _token) {
				return 1;
			},
		}));

		const models = await vscode.lm.selectChatModels({ id: 'test-lm' });
		assert.strictEqual(models.length, 1);

		try {
			await models[0].sendRequest([vscode.LanguageModelChatMessage.User('Hello')]);
			assert.ok(false, 'EXPECTED error');
		} catch (error) {
			assert.ok(error instanceof Error);
		}
	});

	test('lm stream fail', async function () {

		const defer = new DeferredPromise<void>();

		disposables.push(vscode.lm.registerLanguageModelChatProvider('test-lm-vendor', {
			async provideLanguageModelChatInformation(_options, _token) {
				return [testProviderOptions];
			},
			async provideLanguageModelChatResponse(_model, _messages, _options, _progress, _token) {
				return defer.p;
			},
			async provideTokenCount(_model, _text, _token) {
				return 1;
			}
		}));

		const models = await vscode.lm.selectChatModels({ id: 'test-lm' });
		assert.strictEqual(models.length, 1);

		const res = await models[0].sendRequest([vscode.LanguageModelChatMessage.User('Hello')]);
		assert.ok(res);

		const result = (async () => {
			for await (const _chunk of res.text) {

			}
		})();

		defer.error(new Error('STREAM FAIL'));

		try {
			await result;
			assert.ok(false, 'EXPECTED error');
		} catch (error) {
			assert.ok(error);
			assert.ok(error instanceof Error);
		}
	});


	test('LanguageModelError instance is not thrown to extensions#235322 (SYNC)', async function () {

		disposables.push(vscode.lm.registerLanguageModelChatProvider('test-lm-vendor', {
			async provideLanguageModelChatInformation(_options, _token) {
				return [testProviderOptions];
			},
			provideLanguageModelChatResponse(_model, _messages, _options, _progress, _token) {
				throw vscode.LanguageModelError.Blocked('You have been blocked SYNC');
			},
			async provideTokenCount(_model, _text, _token) {
				return 1;
			}
		}));

		const models = await vscode.lm.selectChatModels({ id: 'test-lm' });
		assert.strictEqual(models.length, 1);

		try {
			await models[0].sendRequest([vscode.LanguageModelChatMessage.User('Hello')]);
			assert.ok(false, 'EXPECTED error');
		} catch (error) {
			assert.ok(error instanceof vscode.LanguageModelError);
			assert.strictEqual(error.message, 'You have been blocked SYNC');
		}
	});

	test('LanguageModelError instance is not thrown to extensions#235322 (ASYNC)', async function () {

		disposables.push(vscode.lm.registerLanguageModelChatProvider('test-lm-vendor', {
			async provideLanguageModelChatInformation(_options, _token) {
				return [testProviderOptions];
			},
			async provideLanguageModelChatResponse(_model, _messages, _options, _progress, _token) {
				throw vscode.LanguageModelError.Blocked('You have been blocked ASYNC');
			},
			async provideTokenCount(_model, _text, _token) {
				return 1;
			}
		}));

		const models = await vscode.lm.selectChatModels({ id: 'test-lm' });
		assert.strictEqual(models.length, 1);


		const response = await models[0].sendRequest([vscode.LanguageModelChatMessage.User('Hello')]);
		assert.ok(response);

		let output = '';
		try {
			for await (const thing of response.text) {
				output += thing;
			}
		} catch (error) {
			assert.ok(error instanceof vscode.LanguageModelError);
			assert.strictEqual(error.message, 'You have been blocked ASYNC');
		}
		assert.strictEqual(output, '');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/notebook.api.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/notebook.api.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';
import { asPromise, assertNoRpc, closeAllEditors, createRandomFile, disposeAll, revertAllDirty, saveAllEditors } from '../utils';

async function createRandomNotebookFile() {
	return createRandomFile('', undefined, '.vsctestnb');
}

async function openRandomNotebookDocument() {
	const uri = await createRandomNotebookFile();
	return vscode.workspace.openNotebookDocument(uri);
}

async function openUntitledNotebookDocument(data?: vscode.NotebookData) {
	return vscode.workspace.openNotebookDocument('notebookCoreTest', data);
}

export async function saveAllFilesAndCloseAll() {
	await saveAllEditors();
	await closeAllEditors();
}


function sleep(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

const notebookType = 'notebookCoreTest';

export class Kernel {

	readonly controller: vscode.NotebookController;

	readonly associatedNotebooks = new Set<string>();

	constructor(id: string, label: string, viewType: string = notebookType) {
		this.controller = vscode.notebooks.createNotebookController(id, viewType, label);
		this.controller.executeHandler = this._execute.bind(this);
		this.controller.supportsExecutionOrder = true;
		this.controller.supportedLanguages = ['typescript', 'javascript'];
		this.controller.onDidChangeSelectedNotebooks(e => {
			if (e.selected) {
				this.associatedNotebooks.add(e.notebook.uri.toString());
			} else {
				this.associatedNotebooks.delete(e.notebook.uri.toString());
			}
		});
	}

	protected async _execute(cells: vscode.NotebookCell[]): Promise<void> {
		for (const cell of cells) {
			await this._runCell(cell);
		}
	}

	protected async _runCell(cell: vscode.NotebookCell) {
		// create a single output with exec order 1 and output is plain/text
		// of either the cell itself or (iff empty) the cell's document's uri
		const task = this.controller.createNotebookCellExecution(cell);
		task.start(Date.now());
		task.executionOrder = 1;
		await sleep(10); // Force to be take some time
		await task.replaceOutput([new vscode.NotebookCellOutput([
			vscode.NotebookCellOutputItem.text(cell.document.getText() || cell.document.uri.toString(), 'text/plain')
		])]);
		task.end(true);
	}
}


function getFocusedCell(editor?: vscode.NotebookEditor) {
	return editor ? editor.notebook.cellAt(editor.selections[0].start) : undefined;
}

const apiTestSerializer: vscode.NotebookSerializer = {
	serializeNotebook(_data, _token) {
		return new Uint8Array();
	},
	deserializeNotebook(_content, _token) {
		const dto: vscode.NotebookData = {
			metadata: { testMetadata: false },
			cells: [
				{
					value: 'test',
					languageId: 'typescript',
					kind: vscode.NotebookCellKind.Code,
					outputs: [],
					metadata: { testCellMetadata: 123 },
					executionSummary: { timing: { startTime: 10, endTime: 20 } }
				},
				{
					value: 'test2',
					languageId: 'typescript',
					kind: vscode.NotebookCellKind.Code,
					outputs: [
						new vscode.NotebookCellOutput([
							vscode.NotebookCellOutputItem.text('Hello World', 'text/plain')
						],
							{
								testOutputMetadata: true,
								['text/plain']: { testOutputItemMetadata: true }
							})
					],
					executionSummary: { executionOrder: 5, success: true },
					metadata: { testCellMetadata: 456 }
				}
			]
		};
		return dto;
	},
};

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('Notebook API tests', function () {

	const testDisposables: vscode.Disposable[] = [];
	const suiteDisposables: vscode.Disposable[] = [];

	suiteTeardown(async function () {

		assertNoRpc();

		await revertAllDirty();
		await closeAllEditors();

		disposeAll(suiteDisposables);
		suiteDisposables.length = 0;
	});

	suiteSetup(function () {
		suiteDisposables.push(vscode.workspace.registerNotebookSerializer(notebookType, apiTestSerializer));
	});

	let defaultKernel: Kernel;

	setup(async function () {
		// there should be ONE default kernel in this suite
		defaultKernel = new Kernel('mainKernel', 'Notebook Default Kernel');
		testDisposables.push(defaultKernel.controller);
		await saveAllFilesAndCloseAll();
	});

	teardown(async function () {
		disposeAll(testDisposables);
		testDisposables.length = 0;
		await revertAllDirty();
		await saveAllFilesAndCloseAll();
	});

	test('notebook open', async function () {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		assert.strictEqual(getFocusedCell(editor)?.document.getText(), 'test');
		assert.strictEqual(getFocusedCell(editor)?.document.languageId, 'typescript');

		const secondCell = editor.notebook.cellAt(1);
		assert.strictEqual(secondCell.outputs.length, 1);
		assert.deepStrictEqual(secondCell.outputs[0].metadata, { testOutputMetadata: true, ['text/plain']: { testOutputItemMetadata: true } });
		assert.strictEqual(secondCell.outputs[0].items.length, 1);
		assert.strictEqual(secondCell.outputs[0].items[0].mime, 'text/plain');
		assert.strictEqual(new TextDecoder().decode(secondCell.outputs[0].items[0].data), 'Hello World');
		assert.strictEqual(secondCell.executionSummary?.executionOrder, 5);
		assert.strictEqual(secondCell.executionSummary?.success, true);
	});

	test('multiple tabs: different editors with same document', async function () {
		const notebook = await openRandomNotebookDocument();
		const firstNotebookEditor = await vscode.window.showNotebookDocument(notebook, { viewColumn: vscode.ViewColumn.One });
		const secondNotebookEditor = await vscode.window.showNotebookDocument(notebook, { viewColumn: vscode.ViewColumn.Beside });
		assert.notStrictEqual(firstNotebookEditor, secondNotebookEditor);
		assert.strictEqual(firstNotebookEditor?.notebook, secondNotebookEditor?.notebook, 'split notebook editors share the same document');
	});

	test('#106657. Opening a notebook from markers view is broken ', async function () {

		const document = await openRandomNotebookDocument();
		const [cell] = document.getCells();

		assert.strictEqual(vscode.window.activeNotebookEditor, undefined);

		// opening a cell-uri opens a notebook editor
		await vscode.window.showTextDocument(cell.document, { viewColumn: vscode.ViewColumn.Active });

		assert.strictEqual(!!vscode.window.activeNotebookEditor, true);
		assert.strictEqual(vscode.window.activeNotebookEditor!.notebook.uri.toString(), document.uri.toString());
	});

	test('Opening an utitled notebook without content will only open the editor when shown.', async function () {
		const document = await openUntitledNotebookDocument();

		assert.strictEqual(vscode.window.activeNotebookEditor, undefined);

		// opening a cell-uri opens a notebook editor
		await vscode.window.showNotebookDocument(document);

		assert.strictEqual(!!vscode.window.activeNotebookEditor, true);
		assert.strictEqual(vscode.window.activeNotebookEditor!.notebook.uri.toString(), document.uri.toString());
	});

	test('Opening an untitled notebook with content will open a dirty document.', async function () {
		const language = 'python';
		const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, '', language);
		const data = new vscode.NotebookData([cell]);
		const doc = await vscode.workspace.openNotebookDocument('jupyter-notebook', data);

		assert.strictEqual(doc.isDirty, true);
	});

	test('Cannot open notebook from cell-uri with vscode.open-command', async function () {

		const document = await openRandomNotebookDocument();
		const [cell] = document.getCells();

		await saveAllFilesAndCloseAll();
		assert.strictEqual(vscode.window.activeNotebookEditor, undefined);

		// BUG is that the editor opener (https://github.com/microsoft/vscode/blob/8e7877bdc442f1e83a7fec51920d82b696139129/src/vs/editor/browser/services/openerService.ts#L69)
		// removes the fragment if it matches something numeric. For notebooks that's not wanted...
		// opening a cell-uri opens a notebook editor
		await vscode.commands.executeCommand('vscode.open', cell.document.uri);

		assert.strictEqual(vscode.window.activeNotebookEditor!.notebook.uri.toString(), document.uri.toString());
	});

	test('#97830, #97764. Support switch to other editor types', async function () {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		const edit = new vscode.WorkspaceEdit();
		const focusedCell = getFocusedCell(editor);
		assert.ok(focusedCell);
		edit.replace(focusedCell.document.uri, focusedCell.document.lineAt(0).range, 'var abc = 0;');
		await vscode.workspace.applyEdit(edit);

		assert.strictEqual(getFocusedCell(editor)?.document.getText(), 'var abc = 0;');

		// no kernel -> no default language
		assert.strictEqual(getFocusedCell(editor)?.document.languageId, 'typescript');

		await vscode.window.showNotebookDocument(await vscode.workspace.openNotebookDocument(notebook.uri));
		assert.strictEqual(vscode.window.activeTextEditor?.document.uri.path, notebook.uri.path);
	});

	test('#102411 - untitled notebook creation failed', async function () {
		const document = await vscode.workspace.openNotebookDocument(notebookType, undefined);
		await vscode.window.showNotebookDocument(document);
		assert.notStrictEqual(vscode.window.activeNotebookEditor, undefined, 'untitled notebook editor is not undefined');

		await closeAllEditors();
	});

	test('#207742 - New Untitled notebook failed if previous untilted notebook is modified', async function () {
		await vscode.commands.executeCommand('ipynb.newUntitledIpynb');
		assert.notStrictEqual(vscode.window.activeNotebookEditor, undefined, 'untitled notebook editor is not undefined');
		const document = vscode.window.activeNotebookEditor!.notebook;

		// open another text editor
		const textDocument = await vscode.workspace.openTextDocument({ language: 'javascript', content: 'let abc = 0;' });
		await vscode.window.showTextDocument(textDocument);

		// insert a new cell to notebook document
		const edit = new vscode.WorkspaceEdit();
		const notebookEdit = new vscode.NotebookEdit(new vscode.NotebookRange(1, 1), [new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'print(1)', 'python')]);
		edit.set(document.uri, [notebookEdit]);
		await vscode.workspace.applyEdit(edit);

		// switch to the notebook editor
		await vscode.window.showNotebookDocument(document);
		await closeAllEditors();
		await vscode.commands.executeCommand('ipynb.newUntitledIpynb');
		assert.notStrictEqual(vscode.window.activeNotebookEditor, undefined, 'untitled notebook editor is not undefined');

		await closeAllEditors();
	});

	// TODO: Skipped due to notebook content provider removal
	test.skip('#115855 onDidSaveNotebookDocument', async function () {
		const resource = await createRandomNotebookFile();
		const notebook = await vscode.workspace.openNotebookDocument(resource);

		const notebookEdit = new vscode.NotebookEdit(new vscode.NotebookRange(1, 1), [new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'test 2', 'javascript')]);
		const edit = new vscode.WorkspaceEdit();
		edit.set(notebook.uri, [notebookEdit]);
		await vscode.workspace.applyEdit(edit);
		assert.strictEqual(notebook.isDirty, true);

		const saveEvent = asPromise(vscode.workspace.onDidSaveNotebookDocument);
		await notebook.save();
		await saveEvent;

		assert.strictEqual(notebook.isDirty, false);
	});
});

suite('Notebook & LiveShare', function () {

	const suiteDisposables: vscode.Disposable[] = [];
	const notebookType = 'vsls-testing';

	suiteTeardown(() => {
		vscode.Disposable.from(...suiteDisposables).dispose();
	});

	suiteSetup(function () {

		suiteDisposables.push(vscode.workspace.registerNotebookSerializer(notebookType, new class implements vscode.NotebookSerializer {
			deserializeNotebook(content: Uint8Array, _token: vscode.CancellationToken): vscode.NotebookData | Thenable<vscode.NotebookData> {
				const value = new TextDecoder().decode(content);
				const cell1 = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, value, 'fooLang');
				cell1.outputs = [new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.stderr(value)])];
				return new vscode.NotebookData([cell1]);
			}
			serializeNotebook(data: vscode.NotebookData, _token: vscode.CancellationToken): Uint8Array | Thenable<Uint8Array> {
				return new TextEncoder().encode(data.cells[0].value);
			}
		}, {}, {
			displayName: 'LS',
			filenamePattern: ['*'],
		}));
	});

	test('command: vscode.resolveNotebookContentProviders', async function () {

		type Info = { viewType: string; displayName: string; filenamePattern: string[] };

		const info = await vscode.commands.executeCommand<Info[]>('vscode.resolveNotebookContentProviders');
		assert.strictEqual(Array.isArray(info), true);

		const item = info.find(item => item.viewType === notebookType);
		assert.ok(item);
		assert.strictEqual(item?.viewType, notebookType);
	});

	test('command: vscode.executeDataToNotebook', async function () {
		const value = 'dataToNotebook';
		const data = await vscode.commands.executeCommand<vscode.NotebookData>('vscode.executeDataToNotebook', notebookType, new TextEncoder().encode(value));
		assert.ok(data instanceof vscode.NotebookData);
		assert.strictEqual(data.cells.length, 1);
		assert.strictEqual(data.cells[0].value, value);
		assert.strictEqual(new TextDecoder().decode(data.cells[0].outputs![0].items[0].data), value);
	});

	test('command: vscode.executeNotebookToData', async function () {
		const value = 'notebookToData';
		const notebook = new vscode.NotebookData([new vscode.NotebookCellData(vscode.NotebookCellKind.Code, value, 'fooLang')]);
		const data = await vscode.commands.executeCommand<Uint8Array>('vscode.executeNotebookToData', notebookType, notebook);
		assert.ok(data instanceof Uint8Array);
		assert.deepStrictEqual(new TextDecoder().decode(data), value);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/notebook.document.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/notebook.document.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as utils from '../utils';

suite('Notebook Document', function () {

	const simpleContentProvider = new class implements vscode.NotebookSerializer {
		deserializeNotebook(_data: Uint8Array): vscode.NotebookData | Thenable<vscode.NotebookData> {
			return new vscode.NotebookData(
				[new vscode.NotebookCellData(vscode.NotebookCellKind.Code, '// SIMPLE', 'javascript')],
			);
		}
		serializeNotebook(_data: vscode.NotebookData): Uint8Array | Thenable<Uint8Array> {
			return new Uint8Array();
		}
	};

	const disposables: vscode.Disposable[] = [];
	const testDisposables: vscode.Disposable[] = [];

	suiteTeardown(async function () {
		utils.assertNoRpc();
		await utils.revertAllDirty();
		await utils.closeAllEditors();
		utils.disposeAll(disposables);
		disposables.length = 0;
	});

	teardown(async function () {
		utils.disposeAll(testDisposables);
		testDisposables.length = 0;
	});

	suiteSetup(function () {
		disposables.push(vscode.workspace.registerNotebookSerializer('notebook.nbdtest', simpleContentProvider));
	});

	test('cannot open unknown types', async function () {
		try {
			await vscode.workspace.openNotebookDocument(vscode.Uri.parse('some:///thing.notTypeKnown'));
			assert.ok(false);
		} catch {
			assert.ok(true);
		}
	});

	test('document basics', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const notebook = await vscode.workspace.openNotebookDocument(uri);

		assert.strictEqual(notebook.uri.toString(), uri.toString());
		assert.strictEqual(notebook.isDirty, false);
		assert.strictEqual(notebook.isUntitled, false);
		assert.strictEqual(notebook.cellCount, 1);

		assert.strictEqual(notebook.notebookType, 'notebook.nbdtest');
	});

	test('notebook open/close, notebook ready when cell-document open event is fired', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		let didHappen = false;

		const p = new Promise<void>((resolve, reject) => {
			const sub = vscode.workspace.onDidOpenTextDocument(doc => {
				if (doc.uri.scheme !== 'vscode-notebook-cell') {
					// ignore other open events
					return;
				}
				const notebook = vscode.workspace.notebookDocuments.find(notebook => {
					const cell = notebook.getCells().find(cell => cell.document === doc);
					return Boolean(cell);
				});
				assert.ok(notebook, `notebook for cell ${doc.uri} NOT found`);
				didHappen = true;
				sub.dispose();
				resolve();
			});

			setTimeout(() => {
				sub.dispose();
				reject(new Error('TIMEOUT'));
			}, 15000);
		});

		await vscode.workspace.openNotebookDocument(uri);
		await p;
		assert.strictEqual(didHappen, true);
	});

	test('notebook open/close, all cell-documents are ready', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');

		const p = utils.asPromise(vscode.workspace.onDidOpenNotebookDocument).then(notebook => {
			for (let i = 0; i < notebook.cellCount; i++) {
				const cell = notebook.cellAt(i);

				const doc = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === cell.document.uri.toString());
				assert.ok(doc);
				assert.strictEqual(doc === cell.document, true);
				assert.strictEqual(doc?.languageId, cell.document.languageId);
				assert.strictEqual(doc?.isDirty, false);
				assert.strictEqual(doc?.isClosed, false);
			}
		});

		await vscode.workspace.openNotebookDocument(uri);
		await p;
	});

	test('open untitled notebook', async function () {
		const nb = await vscode.workspace.openNotebookDocument('notebook.nbdtest');
		assert.strictEqual(nb.isUntitled, true);
		assert.strictEqual(nb.isClosed, false);
		assert.strictEqual(nb.uri.scheme, 'untitled');
		// assert.strictEqual(nb.cellCount, 0); // NotebookSerializer ALWAYS returns something here
	});

	test('open untitled with data', async function () {
		const nb = await vscode.workspace.openNotebookDocument(
			'notebook.nbdtest',
			new vscode.NotebookData([
				new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'console.log()', 'javascript'),
				new vscode.NotebookCellData(vscode.NotebookCellKind.Markup, 'Hey', 'markdown'),
			])
		);
		assert.strictEqual(nb.isUntitled, true);
		assert.strictEqual(nb.isClosed, false);
		assert.strictEqual(nb.uri.scheme, 'untitled');
		assert.strictEqual(nb.cellCount, 2);
		assert.strictEqual(nb.cellAt(0).kind, vscode.NotebookCellKind.Code);
		assert.strictEqual(nb.cellAt(1).kind, vscode.NotebookCellKind.Markup);
	});


	test('workspace edit API (replaceCells)', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');

		const document = await vscode.workspace.openNotebookDocument(uri);
		assert.strictEqual(document.cellCount, 1);

		// inserting two new cells
		{
			const edit = new vscode.WorkspaceEdit();
			edit.set(document.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, 0), [{
				kind: vscode.NotebookCellKind.Markup,
				languageId: 'markdown',
				metadata: undefined,
				outputs: [],
				value: 'new_markdown'
			}, {
				kind: vscode.NotebookCellKind.Code,
				languageId: 'fooLang',
				metadata: undefined,
				outputs: [],
				value: 'new_code'
			}])]);

			const success = await vscode.workspace.applyEdit(edit);
			assert.strictEqual(success, true);
		}

		assert.strictEqual(document.cellCount, 3);
		assert.strictEqual(document.cellAt(0).document.getText(), 'new_markdown');
		assert.strictEqual(document.cellAt(1).document.getText(), 'new_code');

		// deleting cell 1 and 3
		{
			const edit = new vscode.WorkspaceEdit();
			edit.set(document.uri, [
				vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, 1), []),
				vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(2, 3), [])
			]);
			const success = await vscode.workspace.applyEdit(edit);
			assert.strictEqual(success, true);
		}

		assert.strictEqual(document.cellCount, 1);
		assert.strictEqual(document.cellAt(0).document.getText(), 'new_code');

		// replacing all cells
		{
			const edit = new vscode.WorkspaceEdit();
			edit.set(document.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, 1), [{
				kind: vscode.NotebookCellKind.Markup,
				languageId: 'markdown',
				metadata: undefined,
				outputs: [],
				value: 'new2_markdown'
			}, {
				kind: vscode.NotebookCellKind.Code,
				languageId: 'fooLang',
				metadata: undefined,
				outputs: [],
				value: 'new2_code'
			}])]);
			const success = await vscode.workspace.applyEdit(edit);
			assert.strictEqual(success, true);
		}
		assert.strictEqual(document.cellCount, 2);
		assert.strictEqual(document.cellAt(0).document.getText(), 'new2_markdown');
		assert.strictEqual(document.cellAt(1).document.getText(), 'new2_code');

		// remove all cells
		{
			const edit = new vscode.WorkspaceEdit();
			edit.set(document.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, document.cellCount), [])]);
			const success = await vscode.workspace.applyEdit(edit);
			assert.strictEqual(success, true);
		}
		assert.strictEqual(document.cellCount, 0);
	});

	test('workspace edit API (replaceCells, event)', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(uri);
		assert.strictEqual(document.cellCount, 1);

		const edit = new vscode.WorkspaceEdit();
		edit.set(document.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, 0), [{
			kind: vscode.NotebookCellKind.Markup,
			languageId: 'markdown',
			metadata: undefined,
			outputs: [],
			value: 'new_markdown'
		}, {
			kind: vscode.NotebookCellKind.Code,
			languageId: 'fooLang',
			metadata: undefined,
			outputs: [],
			value: 'new_code'
		}])]);

		const event = utils.asPromise<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument);

		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, true);

		const data = await event;

		// check document
		assert.strictEqual(document.cellCount, 3);
		assert.strictEqual(document.cellAt(0).document.getText(), 'new_markdown');
		assert.strictEqual(document.cellAt(1).document.getText(), 'new_code');

		// check event data
		assert.strictEqual(data.notebook === document, true);
		assert.strictEqual(data.contentChanges.length, 1);
		assert.strictEqual(data.contentChanges[0].range.isEmpty, true);
		assert.strictEqual(data.contentChanges[0].removedCells.length, 0);
		assert.strictEqual(data.contentChanges[0].addedCells.length, 2);
		assert.strictEqual(data.contentChanges[0].addedCells[0], document.cellAt(0));
		assert.strictEqual(data.contentChanges[0].addedCells[1], document.cellAt(1));
	});

	test('workspace edit API (replaceMetadata)', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(uri);

		const edit = new vscode.WorkspaceEdit();
		edit.set(document.uri, [vscode.NotebookEdit.updateCellMetadata(0, { inputCollapsed: true })]);
		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, true);
		assert.strictEqual(document.cellAt(0).metadata.inputCollapsed, true);
	});

	test('workspace edit API (replaceMetadata, event)', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(uri);

		const edit = new vscode.WorkspaceEdit();
		const event = utils.asPromise<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument);

		edit.set(document.uri, [vscode.NotebookEdit.updateCellMetadata(0, { inputCollapsed: true })]);
		const success = await vscode.workspace.applyEdit(edit);
		assert.strictEqual(success, true);
		const data = await event;

		// check document
		assert.strictEqual(document.cellAt(0).metadata.inputCollapsed, true);

		// check event data
		assert.strictEqual(data.notebook === document, true);
		assert.strictEqual(data.contentChanges.length, 0);
		assert.strictEqual(data.cellChanges.length, 1);
		assert.strictEqual(data.cellChanges[0].cell.index, 0);
	});

	test('workspace edit API (notebookMetadata)', async function () {
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(uri);

		const edit = new vscode.WorkspaceEdit();
		const metdataEdit = vscode.NotebookEdit.updateNotebookMetadata({ ...document.metadata, extraNotebookMetadata: true });
		edit.set(document.uri, [metdataEdit]);
		const success = await vscode.workspace.applyEdit(edit);
		assert.equal(success, true);
		assert.ok(document.metadata.extraNotebookMetadata, `Test metadata not found`);
	});

	test('setTextDocumentLanguage for notebook cells', async function () {

		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const notebook = await vscode.workspace.openNotebookDocument(uri);
		const first = notebook.cellAt(0);
		assert.strictEqual(first.document.languageId, 'javascript');

		const pclose = utils.asPromise(vscode.workspace.onDidCloseTextDocument);
		const popen = utils.asPromise(vscode.workspace.onDidOpenTextDocument);

		await vscode.languages.setTextDocumentLanguage(first.document, 'css');
		assert.strictEqual(first.document.languageId, 'css');

		const closed = await pclose;
		const opened = await popen;

		assert.strictEqual(closed.uri.toString(), first.document.uri.toString());
		assert.strictEqual(opened.uri.toString(), first.document.uri.toString());
		assert.strictEqual(opened === closed, true);
	});

	test('setTextDocumentLanguage when notebook editor is not open', async function () {
		const uri = await utils.createRandomFile('', undefined, '.nbdtest');
		const notebook = await vscode.workspace.openNotebookDocument(uri);
		const firstCelUri = notebook.cellAt(0).document.uri;
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

		let cellDoc = await vscode.workspace.openTextDocument(firstCelUri);
		cellDoc = await vscode.languages.setTextDocumentLanguage(cellDoc, 'css');
		assert.strictEqual(cellDoc.languageId, 'css');
	});

	test('dirty state - serializer', async function () {
		const resource = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(resource);
		assert.strictEqual(document.isDirty, false);

		const edit = new vscode.WorkspaceEdit();
		edit.set(document.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(0, document.cellCount), [])]);
		assert.ok(await vscode.workspace.applyEdit(edit));

		assert.strictEqual(document.isDirty, true);

		await document.save();
		assert.strictEqual(document.isDirty, false);
	});

	test.skip('onDidOpenNotebookDocument - emit event only once when opened in two editors', async function () { // TODO@rebornix https://github.com/microsoft/vscode/issues/157222
		const uri = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		let counter = 0;
		testDisposables.push(vscode.workspace.onDidOpenNotebookDocument(nb => {
			if (uri.toString() === nb.uri.toString()) {
				counter++;
			}
		}));

		const notebook = await vscode.workspace.openNotebookDocument(uri);
		assert.strictEqual(counter, 1);

		await vscode.window.showNotebookDocument(notebook, { viewColumn: vscode.ViewColumn.Active });
		assert.strictEqual(counter, 1);
		assert.strictEqual(vscode.window.visibleNotebookEditors.length, 1);

		await vscode.window.showNotebookDocument(notebook, { viewColumn: vscode.ViewColumn.Beside });
		assert.strictEqual(counter, 1);
		assert.strictEqual(vscode.window.visibleNotebookEditors.length, 2);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/notebook.editor.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/notebook.editor.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as utils from '../utils';

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite.skip)('Notebook Editor', function () {

	const contentSerializer = new class implements vscode.NotebookSerializer {
		deserializeNotebook() {
			return new vscode.NotebookData(
				[new vscode.NotebookCellData(vscode.NotebookCellKind.Code, '// code cell', 'javascript')],
			);
		}
		serializeNotebook() {
			return new Uint8Array();
		}
	};

	const onDidOpenNotebookEditor = (timeout = vscode.env.uiKind === vscode.UIKind.Desktop ? 5000 : 15000) => {
		return new Promise<boolean>((resolve, reject) => {

			const handle = setTimeout(() => {
				sub.dispose();
				reject(new Error('onDidOpenNotebookEditor TIMEOUT reached'));
			}, timeout);

			const sub = vscode.window.onDidChangeActiveNotebookEditor(() => {
				if (vscode.window.activeNotebookEditor === undefined) {
					// skip if there is no active notebook editor (e.g. when opening a new notebook)
					return;
				}

				clearTimeout(handle);
				sub.dispose();
				resolve(true);
			});
		});
	};

	const disposables: vscode.Disposable[] = [];
	const testDisposables: vscode.Disposable[] = [];

	suiteTeardown(async function () {
		utils.assertNoRpc();
		await utils.revertAllDirty();
		await utils.closeAllEditors();
		utils.disposeAll(disposables);
		disposables.length = 0;

		for (const doc of vscode.workspace.notebookDocuments) {
			assert.strictEqual(doc.isDirty, false, doc.uri.toString());
		}
	});

	suiteSetup(function () {
		disposables.push(vscode.workspace.registerNotebookSerializer('notebook.nbdtest', contentSerializer));
	});

	teardown(async function () {
		utils.disposeAll(testDisposables);
		testDisposables.length = 0;
	});

	// #138683
	// TODO@rebornix https://github.com/microsoft/vscode/issues/170072
	test.skip('Opening a notebook should fire activeNotebook event changed only once', utils.withVerboseLogs(async function () {
		const openedEditor = onDidOpenNotebookEditor();
		const resource = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(resource);
		const editor = await vscode.window.showNotebookDocument(document);
		assert.ok(await openedEditor);
		assert.strictEqual(editor.notebook.uri.toString(), resource.toString());
	}));

	// TODO@rebornix https://github.com/microsoft/vscode/issues/173125
	test.skip('Active/Visible Editor', async function () {
		const firstEditorOpen = onDidOpenNotebookEditor();
		const resource = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(resource);

		const firstEditor = await vscode.window.showNotebookDocument(document);
		await firstEditorOpen;
		assert.strictEqual(vscode.window.activeNotebookEditor, firstEditor);
		assert.strictEqual(vscode.window.visibleNotebookEditors.includes(firstEditor), true);

		const secondEditor = await vscode.window.showNotebookDocument(document, { viewColumn: vscode.ViewColumn.Beside });
		// There is no guarantee that when `showNotebookDocument` resolves, the active notebook editor is already updated correctly.
		// assert.strictEqual(secondEditor === vscode.window.activeNotebookEditor, true);
		assert.notStrictEqual(firstEditor, secondEditor);
		assert.strictEqual(vscode.window.visibleNotebookEditors.includes(secondEditor), true);
		assert.strictEqual(vscode.window.visibleNotebookEditors.includes(firstEditor), true);
		assert.strictEqual(vscode.window.visibleNotebookEditors.length, 2);
		await utils.closeAllEditors();
	});

	test('Notebook Editor Event - onDidChangeVisibleNotebookEditors on open/close', async function () {
		const openedEditor = utils.asPromise(vscode.window.onDidChangeVisibleNotebookEditors);
		const resource = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(resource);
		await vscode.window.showNotebookDocument(document);
		assert.ok(await openedEditor);

		const firstEditorClose = utils.asPromise(vscode.window.onDidChangeVisibleNotebookEditors);
		await utils.closeAllEditors();
		await firstEditorClose;
	});

	test('Notebook Editor Event - onDidChangeVisibleNotebookEditors on two editor groups', async function () {
		const resource = await utils.createRandomFile(undefined, undefined, '.nbdtest');
		const document = await vscode.workspace.openNotebookDocument(resource);

		let count = 0;
		testDisposables.push(vscode.window.onDidChangeVisibleNotebookEditors(() => {
			count = vscode.window.visibleNotebookEditors.length;
		}));

		await vscode.window.showNotebookDocument(document, { viewColumn: vscode.ViewColumn.Active });
		assert.strictEqual(count, 1);

		await vscode.window.showNotebookDocument(document, { viewColumn: vscode.ViewColumn.Beside });
		assert.strictEqual(count, 2);

		await utils.closeAllEditors();
		assert.strictEqual(count, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/notebook.kernel.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/notebook.kernel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { TextDecoder } from 'util';
import * as vscode from 'vscode';
import { asPromise, assertNoRpc, closeAllEditors, createRandomFile, DeferredPromise, disposeAll, revertAllDirty, saveAllEditors } from '../utils';

async function createRandomNotebookFile() {
	return createRandomFile('', undefined, '.vsctestnb');
}

async function openRandomNotebookDocument() {
	const uri = await createRandomNotebookFile();
	return vscode.workspace.openNotebookDocument(uri);
}

export async function saveAllFilesAndCloseAll() {
	await saveAllEditors();
	await closeAllEditors();
}

async function withEvent<T>(event: vscode.Event<T>, callback: (e: Promise<T>) => Promise<void>) {
	const e = asPromise<T>(event);
	await callback(e);
}


function sleep(ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

export class Kernel {

	readonly controller: vscode.NotebookController;

	readonly associatedNotebooks = new Set<string>();

	constructor(id: string, label: string, viewType: string = 'notebookCoreTest') {
		this.controller = vscode.notebooks.createNotebookController(id, viewType, label);
		this.controller.executeHandler = this._execute.bind(this);
		this.controller.supportsExecutionOrder = true;
		this.controller.supportedLanguages = ['typescript', 'javascript'];
		this.controller.onDidChangeSelectedNotebooks(e => {
			if (e.selected) {
				this.associatedNotebooks.add(e.notebook.uri.toString());
			} else {
				this.associatedNotebooks.delete(e.notebook.uri.toString());
			}
		});
	}

	protected async _execute(cells: vscode.NotebookCell[]): Promise<void> {
		for (const cell of cells) {
			await this._runCell(cell);
		}
	}

	protected async _runCell(cell: vscode.NotebookCell) {
		// create a single output with exec order 1 and output is plain/text
		// of either the cell itself or (iff empty) the cell's document's uri
		const task = this.controller.createNotebookCellExecution(cell);
		task.start(Date.now());
		task.executionOrder = 1;
		await sleep(10); // Force to be take some time
		await task.replaceOutput([new vscode.NotebookCellOutput([
			vscode.NotebookCellOutputItem.text(cell.document.getText() || cell.document.uri.toString(), 'text/plain')
		])]);
		task.end(true);
	}
}


async function assertKernel(kernel: Kernel, notebook: vscode.NotebookDocument): Promise<void> {
	const success = await vscode.commands.executeCommand('notebook.selectKernel', {
		extension: 'vscode.vscode-api-tests',
		id: kernel.controller.id
	});
	assert.ok(success, `expected selected kernel to be ${kernel.controller.id}`);
	assert.ok(kernel.associatedNotebooks.has(notebook.uri.toString()));
}

const apiTestSerializer: vscode.NotebookSerializer = {
	serializeNotebook(_data, _token) {
		return new Uint8Array();
	},
	deserializeNotebook(_content, _token) {
		const dto: vscode.NotebookData = {
			metadata: { testMetadata: false },
			cells: [
				{
					value: 'test',
					languageId: 'typescript',
					kind: vscode.NotebookCellKind.Code,
					outputs: [],
					metadata: { testCellMetadata: 123 },
					executionSummary: { timing: { startTime: 10, endTime: 20 } }
				},
				{
					value: 'test2',
					languageId: 'typescript',
					kind: vscode.NotebookCellKind.Code,
					outputs: [
						new vscode.NotebookCellOutput([
							vscode.NotebookCellOutputItem.text('Hello World', 'text/plain')
						],
							{
								testOutputMetadata: true,
								['text/plain']: { testOutputItemMetadata: true }
							})
					],
					executionSummary: { executionOrder: 5, success: true },
					metadata: { testCellMetadata: 456 }
				}
			]
		};
		return dto;
	}
};

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('Notebook Kernel API tests', function () {

	const testDisposables: vscode.Disposable[] = [];
	const suiteDisposables: vscode.Disposable[] = [];

	suiteTeardown(async function () {

		assertNoRpc();

		await revertAllDirty();
		await closeAllEditors();

		disposeAll(suiteDisposables);
		suiteDisposables.length = 0;
	});

	suiteSetup(() => {
		suiteDisposables.push(vscode.workspace.registerNotebookSerializer('notebookCoreTest', apiTestSerializer));
	});

	let defaultKernel: Kernel;

	setup(async function () {
		// there should be ONE default kernel in this suite
		defaultKernel = new Kernel('mainKernel', 'Notebook Default Kernel');
		testDisposables.push(defaultKernel.controller);
		await saveAllFilesAndCloseAll();
	});

	teardown(async function () {
		disposeAll(testDisposables);
		testDisposables.length = 0;
		await saveAllFilesAndCloseAll();
	});

	test('cell execute command takes arguments', async () => {
		console.log('Step1.cell execute command takes arguments');
		const notebook = await openRandomNotebookDocument();
		console.log('Step2.cell execute command takes arguments');
		await vscode.window.showNotebookDocument(notebook);
		console.log('Step3.cell execute command takes arguments');
		assert.strictEqual(vscode.window.activeNotebookEditor !== undefined, true, 'notebook first');
		const editor = vscode.window.activeNotebookEditor!;
		const cell = editor.notebook.cellAt(0);

		console.log('Step4.cell execute command takes arguments');
		await withEvent(vscode.workspace.onDidChangeNotebookDocument, async event => {
			console.log('Step5.cell execute command takes arguments');
			await vscode.commands.executeCommand('notebook.execute');
			console.log('Step6.cell execute command takes arguments');
			await event;
			console.log('Step7.cell execute command takes arguments');
			assert.strictEqual(cell.outputs.length, 1, 'should execute'); // runnable, it worked
		});

		console.log('Step8.cell execute command takes arguments');
		await withEvent(vscode.workspace.onDidChangeNotebookDocument, async event => {
			console.log('Step9.cell execute command takes arguments');
			await vscode.commands.executeCommand('notebook.cell.clearOutputs');
			console.log('Step10.cell execute command takes arguments');
			await event;
			console.log('Step11.cell execute command takes arguments');
			assert.strictEqual(cell.outputs.length, 0, 'should clear');
		});

		console.log('Step12.cell execute command takes arguments');
		const secondResource = await createRandomNotebookFile();
		console.log('Step13.cell execute command takes arguments');
		const secondDocument = await vscode.workspace.openNotebookDocument(secondResource);
		console.log('Step14.cell execute command takes arguments');
		await vscode.window.showNotebookDocument(secondDocument);
		console.log('Step15.cell execute command takes arguments');

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async event => {
			console.log('Step16.cell execute command takes arguments');
			await vscode.commands.executeCommand('notebook.cell.execute', { start: 0, end: 1 }, notebook.uri);
			console.log('Step17.cell execute command takes arguments');
			await event;
			console.log('Step18.cell execute command takes arguments');
			assert.strictEqual(cell.outputs.length, 1, 'should execute'); // runnable, it worked
			assert.strictEqual(vscode.window.activeNotebookEditor?.notebook.uri.fsPath, secondResource.fsPath);
		});
		console.log('Step19.cell execute command takes arguments');
	});

	test('cell execute command takes arguments 2', async () => {
		console.log('Step1.cell execute command takes arguments 2');
		const notebook = await openRandomNotebookDocument();
		console.log('Step2.cell execute command takes arguments 2');
		await vscode.window.showNotebookDocument(notebook);
		console.log('Step3.cell execute command takes arguments 2');

		let firstCellExecuted = false;
		let secondCellExecuted = false;

		const def = new DeferredPromise<void>();
		testDisposables.push(vscode.workspace.onDidChangeNotebookDocument(e => {
			e.cellChanges.forEach(change => {
				if (change.cell.index === 0 && change.executionSummary) {
					firstCellExecuted = true;
				}

				if (change.cell.index === 1 && change.executionSummary) {
					secondCellExecuted = true;
				}
			});

			if (firstCellExecuted && secondCellExecuted) {
				def.complete();
			}
		}));

		await vscode.commands.executeCommand('notebook.cell.execute', { document: notebook.uri, ranges: [{ start: 0, end: 1 }, { start: 1, end: 2 }] });

		await def.p;
		await saveAllFilesAndCloseAll();
	});

	test('document execute command takes arguments', async () => {
		const notebook = await openRandomNotebookDocument();
		await vscode.window.showNotebookDocument(notebook);
		assert.strictEqual(vscode.window.activeNotebookEditor !== undefined, true, 'notebook first');
		const editor = vscode.window.activeNotebookEditor!;
		const cell = editor.notebook.cellAt(0);

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async (event) => {
			await vscode.commands.executeCommand('notebook.execute', notebook.uri);
			await event;
			assert.strictEqual(cell.outputs.length, 1, 'should execute'); // runnable, it worked
		});
	});

	test('cell execute and select kernel', async function () {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		assert.strictEqual(vscode.window.activeNotebookEditor === editor, true, 'notebook first');

		const cell = editor.notebook.cellAt(0);

		const alternativeKernel = new class extends Kernel {
			constructor() {
				super('secondaryKernel', 'Notebook Secondary Test Kernel');
				this.controller.supportsExecutionOrder = false;
			}

			override async _runCell(cell: vscode.NotebookCell) {
				const task = this.controller.createNotebookCellExecution(cell);
				task.start();
				await task.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('my second output', 'text/plain')
				])]);
				task.end(true);
			}
		};
		testDisposables.push(alternativeKernel.controller);

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async (event) => {
			await assertKernel(defaultKernel, notebook);
			await vscode.commands.executeCommand('notebook.cell.execute');
			await event;
			assert.strictEqual(cell.outputs.length, 1, 'should execute'); // runnable, it worked
			assert.strictEqual(cell.outputs[0].items.length, 1);
			assert.strictEqual(cell.outputs[0].items[0].mime, 'text/plain');
			assert.deepStrictEqual(new TextDecoder().decode(cell.outputs[0].items[0].data), cell.document.getText());
		});

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async (event) => {
			await assertKernel(alternativeKernel, notebook);
			await vscode.commands.executeCommand('notebook.cell.execute');
			await event;
			assert.strictEqual(cell.outputs.length, 1, 'should execute'); // runnable, it worked
			assert.strictEqual(cell.outputs[0].items.length, 1);
			assert.strictEqual(cell.outputs[0].items[0].mime, 'text/plain');
			assert.deepStrictEqual(new TextDecoder().decode(cell.outputs[0].items[0].data), 'my second output');
		});
	});

	test('Output changes are applied once the promise resolves', async function () {

		let called = false;

		const verifyOutputSyncKernel = new class extends Kernel {

			constructor() {
				super('verifyOutputSyncKernel', '');
			}

			override async _execute(cells: vscode.NotebookCell[]) {
				const [cell] = cells;
				const task = this.controller.createNotebookCellExecution(cell);
				task.start();
				await task.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('Some output', 'text/plain')
				])]);
				assert.strictEqual(cell.notebook.cellAt(0).outputs.length, 1);
				assert.deepStrictEqual(new TextDecoder().decode(cell.notebook.cellAt(0).outputs[0].items[0].data), 'Some output');
				task.end(undefined);
				called = true;
			}
		};

		const notebook = await openRandomNotebookDocument();
		await vscode.window.showNotebookDocument(notebook);
		await assertKernel(verifyOutputSyncKernel, notebook);
		await vscode.commands.executeCommand('notebook.cell.execute');
		assert.strictEqual(called, true);
		verifyOutputSyncKernel.controller.dispose();
	});

	test('executionSummary', async () => {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		const cell = editor.notebook.cellAt(0);

		assert.strictEqual(cell.executionSummary?.success, undefined);
		assert.strictEqual(cell.executionSummary?.executionOrder, undefined);
		await vscode.commands.executeCommand('notebook.cell.execute');
		assert.strictEqual(cell.outputs.length, 1, 'should execute');
		assert.ok(cell.executionSummary);
		assert.strictEqual(cell.executionSummary!.success, true);
		assert.strictEqual(typeof cell.executionSummary!.executionOrder, 'number');
	});

	test('initialize executionSummary', async () => {

		const document = await openRandomNotebookDocument();
		const cell = document.cellAt(0);

		assert.strictEqual(cell.executionSummary?.success, undefined);
		assert.strictEqual(cell.executionSummary?.timing?.startTime, 10);
		assert.strictEqual(cell.executionSummary?.timing?.endTime, 20);

	});

	test('execution cancelled when delete while executing', async () => {
		const document = await openRandomNotebookDocument();
		const cell = document.cellAt(0);

		let executionWasCancelled = false;
		const cancelledKernel = new class extends Kernel {
			constructor() {
				super('cancelledKernel', '');
			}

			override async _execute(cells: vscode.NotebookCell[]) {
				const [cell] = cells;
				const exe = this.controller.createNotebookCellExecution(cell);
				exe.token.onCancellationRequested(() => executionWasCancelled = true);
			}
		};
		testDisposables.push(cancelledKernel.controller);

		await vscode.window.showNotebookDocument(document);
		await assertKernel(cancelledKernel, document);
		await vscode.commands.executeCommand('notebook.cell.execute');

		// Delete executing cell
		const edit = new vscode.WorkspaceEdit();
		edit.set(cell!.notebook.uri, [vscode.NotebookEdit.replaceCells(new vscode.NotebookRange(cell!.index, cell!.index + 1), [])]);
		await vscode.workspace.applyEdit(edit);

		assert.strictEqual(executionWasCancelled, true);
	});

	test('appendOutput to different cell', async function () {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		const cell0 = editor.notebook.cellAt(0);
		const notebookEdit = new vscode.NotebookEdit(new vscode.NotebookRange(1, 1), [new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'test 2', 'javascript')]);
		const edit = new vscode.WorkspaceEdit();
		edit.set(notebook.uri, [notebookEdit]);
		await vscode.workspace.applyEdit(edit);
		const cell1 = editor.notebook.cellAt(1);

		const nextCellKernel = new class extends Kernel {
			constructor() {
				super('nextCellKernel', 'Append to cell kernel');
			}

			override async _runCell(cell: vscode.NotebookCell) {
				const task = this.controller.createNotebookCellExecution(cell);
				task.start();
				await task.appendOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('my output')
				])], cell1);
				await task.appendOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('my output 2')
				])], cell1);
				task.end(true);
			}
		};
		testDisposables.push(nextCellKernel.controller);

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async (event) => {
			await assertKernel(nextCellKernel, notebook);
			await vscode.commands.executeCommand('notebook.cell.execute');
			await event;
			assert.strictEqual(cell0.outputs.length, 0, 'should not change cell 0');
			assert.strictEqual(cell1.outputs.length, 2, 'should update cell 1');
			assert.strictEqual(cell1.outputs[0].items.length, 1);
			assert.deepStrictEqual(new TextDecoder().decode(cell1.outputs[0].items[0].data), 'my output');
		});
	});

	test('replaceOutput to different cell', async function () {
		const notebook = await openRandomNotebookDocument();
		const editor = await vscode.window.showNotebookDocument(notebook);
		const cell0 = editor.notebook.cellAt(0);
		const notebookEdit = new vscode.NotebookEdit(new vscode.NotebookRange(1, 1), [new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'test 2', 'javascript')]);
		const edit = new vscode.WorkspaceEdit();
		edit.set(notebook.uri, [notebookEdit]);
		await vscode.workspace.applyEdit(edit);
		const cell1 = editor.notebook.cellAt(1);

		const nextCellKernel = new class extends Kernel {
			constructor() {
				super('nextCellKernel', 'Replace to cell kernel');
			}

			override async _runCell(cell: vscode.NotebookCell) {
				const task = this.controller.createNotebookCellExecution(cell);
				task.start();
				await task.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('my output')
				])], cell1);
				await task.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.text('my output 2')
				])], cell1);
				task.end(true);
			}
		};
		testDisposables.push(nextCellKernel.controller);

		await withEvent<vscode.NotebookDocumentChangeEvent>(vscode.workspace.onDidChangeNotebookDocument, async (event) => {
			await assertKernel(nextCellKernel, notebook);
			await vscode.commands.executeCommand('notebook.cell.execute');
			await event;
			assert.strictEqual(cell0.outputs.length, 0, 'should not change cell 0');
			assert.strictEqual(cell1.outputs.length, 1, 'should update cell 1');
			assert.strictEqual(cell1.outputs[0].items.length, 1);
			assert.deepStrictEqual(new TextDecoder().decode(cell1.outputs[0].items[0].data), 'my output 2');
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/proxy.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/proxy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as https from 'https';
import 'mocha';
import { assertNoRpc } from '../utils';
import { pki } from 'node-forge';
import { AddressInfo } from 'net';
import { resetCaches } from '@vscode/proxy-agent';
import * as vscode from 'vscode';
import { Straightforward, Middleware, RequestContext, ConnectContext, isRequest, isConnect } from 'straightforward';
import assert from 'assert';

declare module 'https' {
	interface Agent {
		testCertificates?: string[];
	}
}

(vscode.env.uiKind === vscode.UIKind.Web ? suite.skip : suite)('vscode API - network proxy support', () => {

	teardown(async function () {
		assertNoRpc();
	});

	test('custom root certificate', async () => {
		const keys = pki.rsa.generateKeyPair(2048);
		const cert = pki.createCertificate();
		cert.publicKey = keys.publicKey;
		cert.serialNumber = '01';
		cert.validity.notBefore = new Date();
		cert.validity.notAfter = new Date();
		cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
		const attrs = [{
			name: 'commonName',
			value: 'localhost-proxy-test'
		}];
		cert.setSubject(attrs);
		cert.setIssuer(attrs);
		cert.sign(keys.privateKey);
		const certPEM = pki.certificateToPem(cert);
		const privateKeyPEM = pki.privateKeyToPem(keys.privateKey);

		let resolvePort: (port: number) => void;
		let rejectPort: (err: any) => void;
		const port = new Promise<number>((resolve, reject) => {
			resolvePort = resolve;
			rejectPort = reject;
		});
		const server = https.createServer({
			key: privateKeyPEM,
			cert: certPEM,
		}, (_req, res) => {
			res.end();
		}).listen(0, '127.0.0.1', () => {
			const address = server.address();
			resolvePort((address as AddressInfo).port);
		}).on('error', err => {
			rejectPort(err);
		});

		// Using https.globalAgent because it is shared with proxyResolver.ts and mutable.
		https.globalAgent.testCertificates = [certPEM];
		resetCaches();

		try {
			const portNumber = await port;
			await new Promise<void>((resolve, reject) => {
				https.get(`https://127.0.0.1:${portNumber}`, { servername: 'localhost-proxy-test' }, res => {
					if (res.statusCode === 200) {
						resolve();
					} else {
						reject(new Error(`Unexpected status code: ${res.statusCode}`));
					}
				})
					.on('error', reject);
			});
		} finally {
			delete https.globalAgent.testCertificates;
			resetCaches();
			server.close();
		}
	});

	test('basic auth', async () => {
		const url = 'https://example.com'; // Need to use non-local URL because local URLs are excepted from proxying.
		const user = 'testuser';
		const pass = 'testpassword';

		const sf = new Straightforward();
		let authEnabled = false;
		const authOpts: AuthOpts = { user, pass };
		const auth = middlewareAuth(authOpts);
		sf.onConnect.use(async (context, next) => {
			if (authEnabled) {
				return auth(context, next);
			}
			next();
		});
		sf.onConnect.use(({ clientSocket }) => {
			// Shortcircuit the request.
			if (authEnabled) {
				clientSocket.end('HTTP/1.1 204\r\n\r\n');
			} else {
				clientSocket.end('HTTP/1.1 418\r\n\r\n');
			}
		});
		const proxyListen = sf.listen(0);

		try {
			await proxyListen;
			const proxyPort = (sf.server.address() as AddressInfo).port;

			const change = waitForConfigChange('http.proxy');
			await vscode.workspace.getConfiguration().update('http.proxy', `http://127.0.0.1:${proxyPort}`, vscode.ConfigurationTarget.Global);
			await change;
			await new Promise<void>((resolve, reject) => {
				https.get(url, res => {
					if (res.statusCode === 418) {
						resolve();
					} else {
						reject(new Error(`Unexpected status code (expected 418): ${res.statusCode}`));
					}
				})
					.on('error', reject);
			});

			authEnabled = true;
			await new Promise<void>((resolve, reject) => {
				https.get(url, res => {
					if (res.statusCode === 407) {
						resolve();
					} else {
						reject(new Error(`Unexpected status code (expected 407): ${res.statusCode}`));
					}
				})
					.on('error', reject);
			});

			authOpts.realm = Buffer.from(JSON.stringify({ username: user, password: pass })).toString('base64');
			await new Promise<void>((resolve, reject) => {
				https.get(url, res => {
					if (res.statusCode === 204) {
						resolve();
					} else {
						reject(new Error(`Unexpected status code (expected 204): ${res.statusCode}`));
					}
				})
					.on('error', reject);
			});
		} finally {
			sf.close();
			const change = waitForConfigChange('http.proxy');
			await vscode.workspace.getConfiguration().update('http.proxy', undefined, vscode.ConfigurationTarget.Global);
			await change;
			await vscode.workspace.getConfiguration().update('integration-test.http.proxyAuth', undefined, vscode.ConfigurationTarget.Global);
		}
	});

	(vscode.env.remoteName ? test : test.skip)('separate local / remote proxy settings', async () => {
		// Assumes test resolver runs with `--use-host-proxy`.
		const localProxy = 'http://localhost:1234';
		const remoteProxy = 'http://localhost:4321';

		const actualLocalProxy1 = vscode.workspace.getConfiguration().get('http.proxy');

		const p1 = waitForConfigChange('http.proxy');
		await vscode.workspace.getConfiguration().update('http.proxy', localProxy, vscode.ConfigurationTarget.Global);
		await p1;
		const actualLocalProxy2 = vscode.workspace.getConfiguration().get('http.proxy');

		const p2 = waitForConfigChange('http.useLocalProxyConfiguration');
		await vscode.workspace.getConfiguration().update('http.useLocalProxyConfiguration', false, vscode.ConfigurationTarget.Global);
		await p2;
		const actualRemoteProxy1 = vscode.workspace.getConfiguration().get('http.proxy');

		const p3 = waitForConfigChange('http.proxy');
		await vscode.workspace.getConfiguration().update('http.proxy', remoteProxy, vscode.ConfigurationTarget.Global);
		await p3;
		const actualRemoteProxy2 = vscode.workspace.getConfiguration().get('http.proxy');

		const p4 = waitForConfigChange('http.proxy');
		await vscode.workspace.getConfiguration().update('http.proxy', undefined, vscode.ConfigurationTarget.Global);
		await p4;
		const actualRemoteProxy3 = vscode.workspace.getConfiguration().get('http.proxy');

		const p5 = waitForConfigChange('http.proxy');
		await vscode.workspace.getConfiguration().update('http.useLocalProxyConfiguration', true, vscode.ConfigurationTarget.Global);
		await p5;
		const actualLocalProxy3 = vscode.workspace.getConfiguration().get('http.proxy');

		const p6 = waitForConfigChange('http.proxy');
		await vscode.workspace.getConfiguration().update('http.proxy', undefined, vscode.ConfigurationTarget.Global);
		await p6;
		const actualLocalProxy4 = vscode.workspace.getConfiguration().get('http.proxy');

		assert.strictEqual(actualLocalProxy1, '');
		assert.strictEqual(actualLocalProxy2, localProxy);
		assert.strictEqual(actualRemoteProxy1, '');
		assert.strictEqual(actualRemoteProxy2, remoteProxy);
		assert.strictEqual(actualRemoteProxy3, '');
		assert.strictEqual(actualLocalProxy3, localProxy);
		assert.strictEqual(actualLocalProxy4, '');
	});

	function waitForConfigChange(key: string) {
		return new Promise<void>(resolve => {
			const s = vscode.workspace.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(key)) {
					s.dispose();
					resolve();
				}
			});
		});
	}
});

// Added 'realm'. From MIT licensed https://github.com/berstend/straightforward/blob/84a4cb88024cffce37a05870da7d9d0aba7dcca8/src/middleware/auth.ts

export interface AuthOpts {
	realm?: string;
	user?: string;
	pass?: string;
	dynamic?: boolean;
}

export interface RequestAdditionsAuth {
	locals: { proxyUser: string; proxyPass: string };
}

/**
 * Authenticate an incoming proxy request
 * Supports static `user` and `pass` or `dynamic`,
 * in which case `ctx.req.locals` will be populated with `proxyUser` and `proxyPass`
 * This middleware supports both onRequest and onConnect
 */
export const middlewareAuth =
	(opts: AuthOpts): Middleware<
		RequestContext<RequestAdditionsAuth> | ConnectContext<RequestAdditionsAuth>
	> =>
		async (ctx, next) => {
			const { realm, user, pass, dynamic } = opts;
			const sendAuthRequired = () => {
				const realmStr = realm ? ` realm="${realm}"` : '';
				if (isRequest(ctx)) {
					ctx.res.writeHead(407, { 'Proxy-Authenticate': `Basic${realmStr}` });
					ctx.res.end();
				} else if (isConnect(ctx)) {
					ctx.clientSocket.end(
						'HTTP/1.1 407\r\n' + `Proxy-Authenticate: basic${realmStr}\r\n` + '\r\n'
					);
				}
			};
			const proxyAuth = ctx.req.headers['proxy-authorization'];
			if (!proxyAuth) {
				return sendAuthRequired();
			}
			const [proxyUser, proxyPass] = Buffer.from(
				proxyAuth.replace('Basic ', ''),
				'base64'
			)
				.toString()
				.split(':');

			if (!dynamic && !!(!!user && !!pass)) {
				if (user !== proxyUser || pass !== proxyPass) {
					return sendAuthRequired();
				}
			}
			ctx.req.locals.proxyUser = proxyUser;
			ctx.req.locals.proxyPass = proxyPass;

			return next();
		};
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/quickInput.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/quickInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { commands, Disposable, QuickPick, QuickPickItem, window, workspace } from 'vscode';
import { assertNoRpc, closeAllEditors } from '../utils';

interface QuickPickExpected {
	events: string[];
	activeItems: string[][];
	selectionItems: string[][];
	acceptedItems: {
		active: string[][];
		selection: string[][];
		dispose: boolean[];
	};
}

suite('vscode API - quick input', function () {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test('createQuickPick, select second', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'active', 'selection', 'accept', 'hide'],
			activeItems: [['eins'], ['zwei']],
			selectionItems: [['zwei']],
			acceptedItems: {
				active: [['zwei']],
				selection: [['zwei']],
				dispose: [true]
			},
		}, (err?: any) => done(err));
		quickPick.items = ['eins', 'zwei', 'drei'].map(label => ({ label }));
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.quickOpenSelectNext');
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		})()
			.catch(err => done(err));
	});

	test('createQuickPick, focus second', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'accept', 'hide'],
			activeItems: [['zwei']],
			selectionItems: [['zwei']],
			acceptedItems: {
				active: [['zwei']],
				selection: [['zwei']],
				dispose: [true]
			},
		}, (err?: any) => done(err));
		quickPick.items = ['eins', 'zwei', 'drei'].map(label => ({ label }));
		quickPick.activeItems = [quickPick.items[1]];
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		})()
			.catch(err => done(err));
	});

	test('createQuickPick, select first and second', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'active', 'selection', 'accept', 'hide'],
			activeItems: [['eins'], ['zwei']],
			selectionItems: [['eins'], ['eins', 'zwei']],
			acceptedItems: {
				active: [['zwei']],
				selection: [['eins', 'zwei']],
				dispose: [true]
			},
		}, (err?: any) => done(err));
		quickPick.canSelectMany = true;
		quickPick.items = ['eins', 'zwei', 'drei'].map(label => ({ label }));
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.quickOpenSelectNext');
			await commands.executeCommand('workbench.action.quickPickManyToggle');
			await commands.executeCommand('workbench.action.quickOpenSelectNext');
			await commands.executeCommand('workbench.action.quickPickManyToggle');
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		})()
			.catch(err => done(err));
	});

	test('createQuickPick, selection events', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'accept', 'selection', 'accept', 'hide'],
			activeItems: [['eins']],
			selectionItems: [['zwei'], ['drei']],
			acceptedItems: {
				active: [['eins'], ['eins']],
				selection: [['zwei'], ['drei']],
				dispose: [false, true]
			},
		}, (err?: any) => done(err));
		quickPick.items = ['eins', 'zwei', 'drei'].map(label => ({ label }));
		quickPick.show();

		quickPick.selectedItems = [quickPick.items[1]];
		setTimeout(() => {
			quickPick.selectedItems = [quickPick.items[2]];
		}, 0);
	});

	test('createQuickPick, continue after first accept', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'accept', 'active', 'selection', 'accept', 'hide'],
			activeItems: [['eins'], ['drei']],
			selectionItems: [['eins'], ['drei']],
			acceptedItems: {
				active: [['eins'], ['drei']],
				selection: [['eins'], ['drei']],
				dispose: [false, true]
			},
		}, (err?: any) => done(err));
		quickPick.items = ['eins', 'zwei'].map(label => ({ label }));
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
			await timeout(async () => {
				quickPick.items = ['drei', 'vier'].map(label => ({ label }));
				await timeout(async () => {
					await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
				}, 0);
			}, 0);
		})()
			.catch(err => done(err));
	});

	test('createQuickPick, dispose in onDidHide', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		let hidden = false;
		const quickPick = window.createQuickPick();
		quickPick.onDidHide(() => {
			if (hidden) {
				done(new Error('Already hidden'));
			} else {
				hidden = true;
				quickPick.dispose();
				setTimeout(done, 0);
			}
		});
		quickPick.show();
		quickPick.hide();
	});

	test('createQuickPick, hide and dispose', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		let hidden = false;
		const quickPick = window.createQuickPick();
		quickPick.onDidHide(() => {
			if (hidden) {
				done(new Error('Already hidden'));
			} else {
				hidden = true;
				setTimeout(done, 0);
			}
		});
		quickPick.show();
		quickPick.hide();
		quickPick.dispose();
	});

	test('createQuickPick, hide and hide', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		let hidden = false;
		const quickPick = window.createQuickPick();
		quickPick.onDidHide(() => {
			if (hidden) {
				done(new Error('Already hidden'));
			} else {
				hidden = true;
				setTimeout(done, 0);
			}
		});
		quickPick.show();
		quickPick.hide();
		quickPick.hide();
	});

	test('createQuickPick, hide show hide', async function () {
		async function waitForHide(quickPick: QuickPick<QuickPickItem>) {
			let disposable: Disposable | undefined;
			try {
				await Promise.race([
					new Promise(resolve => disposable = quickPick.onDidHide(() => resolve(true))),
					new Promise((_, reject) => setTimeout(() => reject(), 4000))
				]);
			} finally {
				disposable?.dispose();
			}
		}

		const quickPick = window.createQuickPick();
		quickPick.show();
		const promise = waitForHide(quickPick);
		quickPick.hide();
		quickPick.show();
		await promise;
		quickPick.hide();
		await waitForHide(quickPick);
	});

	test('createQuickPick, match item by label derived from resourceUri', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'accept', 'hide'],
			activeItems: [['']],
			selectionItems: [['']],
			acceptedItems: {
				active: [['']],
				selection: [['']],
				dispose: [true]
			},
		}, (err?: any) => done(err));

		const baseUri = workspace!.workspaceFolders![0].uri;
		quickPick.items = [
			{ label: 'a1', resourceUri: baseUri.with({ path: baseUri.path + '/test1.txt' }) },
			{ label: '', resourceUri: baseUri.with({ path: baseUri.path + '/test2.txt' }) },
			{ label: 'a3', resourceUri: baseUri.with({ path: baseUri.path + '/test3.txt' }) }
		];
		quickPick.value = 'test2.txt';
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		})()
			.catch(err => done(err));
	});

	test('createQuickPick, match item by description derived from resourceUri', function (_done) {
		let done = (err?: any) => {
			done = () => { };
			_done(err);
		};

		const quickPick = createQuickPick({
			events: ['active', 'selection', 'accept', 'hide'],
			activeItems: [['a2']],
			selectionItems: [['a2']],
			acceptedItems: {
				active: [['a2']],
				selection: [['a2']],
				dispose: [true]
			},
		}, (err?: any) => done(err));

		const baseUri = workspace!.workspaceFolders![0].uri;
		quickPick.items = [
			{ label: 'a1', resourceUri: baseUri.with({ path: baseUri.path + '/test1.txt' }) },
			{ label: 'a2', resourceUri: baseUri.with({ path: baseUri.path + '/test2.txt' }) },
			{ label: 'a3', resourceUri: baseUri.with({ path: baseUri.path + '/test3.txt' }) }
		];
		quickPick.matchOnDescription = true;
		quickPick.value = 'test2.txt';
		quickPick.show();

		(async () => {
			await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');
		})()
			.catch(err => done(err));
	});
});

function createQuickPick(expected: QuickPickExpected, done: (err?: any) => void, record = false) {
	const quickPick = window.createQuickPick();
	let eventIndex = -1;
	quickPick.onDidChangeActive(items => {
		if (record) {
			console.log(`active: [${items.map(item => item.label).join(', ')}]`);
			return;
		}
		try {
			eventIndex++;
			assert.strictEqual('active', expected.events.shift(), `onDidChangeActive (event ${eventIndex})`);
			const expectedItems = expected.activeItems.shift();
			assert.deepStrictEqual(items.map(item => item.label), expectedItems, `onDidChangeActive event items (event ${eventIndex})`);
			assert.deepStrictEqual(quickPick.activeItems.map(item => item.label), expectedItems, `onDidChangeActive active items (event ${eventIndex})`);
		} catch (err) {
			done(err);
		}
	});
	quickPick.onDidChangeSelection(items => {
		if (record) {
			console.log(`selection: [${items.map(item => item.label).join(', ')}]`);
			return;
		}
		try {
			eventIndex++;
			assert.strictEqual('selection', expected.events.shift(), `onDidChangeSelection (event ${eventIndex})`);
			const expectedItems = expected.selectionItems.shift();
			assert.deepStrictEqual(items.map(item => item.label), expectedItems, `onDidChangeSelection event items (event ${eventIndex})`);
			assert.deepStrictEqual(quickPick.selectedItems.map(item => item.label), expectedItems, `onDidChangeSelection selected items (event ${eventIndex})`);
		} catch (err) {
			done(err);
		}
	});
	quickPick.onDidAccept(() => {
		if (record) {
			console.log('accept');
			return;
		}
		try {
			eventIndex++;
			assert.strictEqual('accept', expected.events.shift(), `onDidAccept (event ${eventIndex})`);
			const expectedActive = expected.acceptedItems.active.shift();
			assert.deepStrictEqual(quickPick.activeItems.map(item => item.label), expectedActive, `onDidAccept active items (event ${eventIndex})`);
			const expectedSelection = expected.acceptedItems.selection.shift();
			assert.deepStrictEqual(quickPick.selectedItems.map(item => item.label), expectedSelection, `onDidAccept selected items (event ${eventIndex})`);
			if (expected.acceptedItems.dispose.shift()) {
				quickPick.dispose();
			}
		} catch (err) {
			done(err);
		}
	});
	quickPick.onDidHide(() => {
		if (record) {
			console.log('hide');
			done();
			return;
		}
		try {
			assert.strictEqual('hide', expected.events.shift());
			done();
		} catch (err) {
			done(err);
		}
	});

	return quickPick;
}

async function timeout<T>(run: () => Promise<T> | T, ms: number): Promise<T> {
	return new Promise<T>(resolve => setTimeout(() => resolve(run()), ms));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/readonlyFileSystem.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/readonlyFileSystem.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as vscode from 'vscode';
import { TestFS } from '../memfs';
import { assertNoRpc, closeAllEditors } from '../utils';

suite('vscode API - file system', () => {

	teardown(async function () {
		assertNoRpc();
		await closeAllEditors();
	});

	test('readonly file system - boolean', async function () {
		const fs = new TestFS('this-fs', false);
		const reg = vscode.workspace.registerFileSystemProvider(fs.scheme, fs, { isReadonly: true });
		let error: any | undefined;
		try {
			await vscode.workspace.fs.writeFile(vscode.Uri.parse('this-fs:/foo.txt'), Buffer.from('Hello World'));
		} catch (e) {
			error = e;
		}
		assert.strictEqual(vscode.workspace.fs.isWritableFileSystem('this-fs'), false);
		assert.strictEqual(error instanceof vscode.FileSystemError, true);
		const fileError: vscode.FileSystemError = error;
		assert.strictEqual(fileError.code, 'NoPermissions');
		reg.dispose();
	});

	test('readonly file system - markdown', async function () {
		const fs = new TestFS('this-fs', false);
		const reg = vscode.workspace.registerFileSystemProvider(fs.scheme, fs, { isReadonly: new vscode.MarkdownString('This file is readonly.') });
		let error: any | undefined;
		try {
			await vscode.workspace.fs.writeFile(vscode.Uri.parse('this-fs:/foo.txt'), Buffer.from('Hello World'));
		} catch (e) {
			error = e;
		}
		assert.strictEqual(vscode.workspace.fs.isWritableFileSystem('this-fs'), false);
		assert.strictEqual(error instanceof vscode.FileSystemError, true);
		const fileError: vscode.FileSystemError = error;
		assert.strictEqual(fileError.code, 'NoPermissions');
		reg.dispose();
	});

	test('writeable file system', async function () {
		const fs = new TestFS('this-fs', false);
		const reg = vscode.workspace.registerFileSystemProvider(fs.scheme, fs);
		let error: any | undefined;
		try {
			await vscode.workspace.fs.writeFile(vscode.Uri.parse('this-fs:/foo.txt'), Buffer.from('Hello World'));
		} catch (e) {
			error = e;
		}
		assert.strictEqual(vscode.workspace.fs.isWritableFileSystem('this-fs'), true);
		assert.strictEqual(error, undefined);
		reg.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/rpc.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/rpc.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { assertNoRpc, assertNoRpcFromEntry, disposeAll } from '../utils';

suite('vscode', function () {

	const dispo: vscode.Disposable[] = [];

	teardown(() => {
		assertNoRpc();
		disposeAll(dispo);
	});

	test('no rpc', function () {
		assertNoRpc();
	});

	test('no rpc, createDiagnosticCollection()', function () {
		const item = vscode.languages.createDiagnosticCollection();
		dispo.push(item);
		assertNoRpcFromEntry([item, 'DiagnosticCollection']);
	});

	test('no rpc, createTextEditorDecorationType(...)', function () {
		const item = vscode.window.createTextEditorDecorationType({});
		dispo.push(item);
		assertNoRpcFromEntry([item, 'TextEditorDecorationType']);
	});

	test('no rpc, createOutputChannel(...)', function () {
		const item = vscode.window.createOutputChannel('hello');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'OutputChannel']);
	});

	test('no rpc, createDiagnosticCollection(...)', function () {
		const item = vscode.languages.createDiagnosticCollection();
		dispo.push(item);
		assertNoRpcFromEntry([item, 'DiagnosticCollection']);
	});

	test('no rpc, createQuickPick(...)', function () {
		const item = vscode.window.createQuickPick();
		dispo.push(item);
		assertNoRpcFromEntry([item, 'QuickPick']);
	});

	test('no rpc, createInputBox(...)', function () {
		const item = vscode.window.createInputBox();
		dispo.push(item);
		assertNoRpcFromEntry([item, 'InputBox']);
	});

	test('no rpc, createStatusBarItem(...)', function () {
		const item = vscode.window.createStatusBarItem();
		dispo.push(item);
		assertNoRpcFromEntry([item, 'StatusBarItem']);
	});

	test('no rpc, createSourceControl(...)', function () {
		const item = vscode.scm.createSourceControl('foo', 'Hello');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'SourceControl']);
	});

	test('no rpc, createCommentController(...)', function () {
		const item = vscode.comments.createCommentController('foo', 'Hello');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'CommentController']);
	});

	test('no rpc, createWebviewPanel(...)', function () {
		const item = vscode.window.createWebviewPanel('webview', 'Hello', vscode.ViewColumn.Active);
		dispo.push(item);
		assertNoRpcFromEntry([item, 'WebviewPanel']);
	});

	test('no rpc, createTreeView(...)', function () {
		const treeDataProvider = new class implements vscode.TreeDataProvider<string> {
			getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
				return new vscode.TreeItem(element);
			}
			getChildren(_element?: string): vscode.ProviderResult<string[]> {
				return ['foo', 'bar'];
			}
		};
		const item = vscode.window.createTreeView('test.treeId', { treeDataProvider });
		dispo.push(item);
		assertNoRpcFromEntry([item, 'TreeView']);
	});


	test('no rpc, createNotebookController(...)', function () {
		const ctrl = vscode.notebooks.createNotebookController('foo', 'bar', '');
		dispo.push(ctrl);
		assertNoRpcFromEntry([ctrl, 'NotebookController']);
	});

	test('no rpc, createTerminal(...)', function () {
		const ctrl = vscode.window.createTerminal({ name: 'termi' });
		dispo.push(ctrl);
		assertNoRpcFromEntry([ctrl, 'Terminal']);
	});

	test('no rpc, createFileSystemWatcher(...)', function () {
		const item = vscode.workspace.createFileSystemWatcher('**/*.ts');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'FileSystemWatcher']);
	});

	test('no rpc, createTestController(...)', function () {
		const item = vscode.tests.createTestController('iii', 'lll');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'TestController']);
	});

	test('no rpc, createLanguageStatusItem(...)', function () {
		const item = vscode.languages.createLanguageStatusItem('i', '*');
		dispo.push(item);
		assertNoRpcFromEntry([item, 'LanguageStatusItem']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/state.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/state.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { ExtensionContext, extensions, Uri } from 'vscode';

suite('vscode API - globalState / workspaceState', () => {

	let extensionContext: ExtensionContext;
	suiteSetup(async () => {
		// Trigger extension activation and grab the context as some tests depend on it
		await extensions.getExtension('vscode.vscode-api-tests')?.activate();
		extensionContext = global.testExtensionContext;
	});

	test('state basics', async () => {
		for (const state of [extensionContext.globalState, extensionContext.workspaceState]) {
			let keys = state.keys();
			assert.strictEqual(keys.length, 0);

			let res = state.get('state.test.get', 'default');
			assert.strictEqual(res, 'default');

			state.update('state.test.get', 'testvalue');

			keys = state.keys();
			assert.strictEqual(keys.length, 1);
			assert.strictEqual(keys[0], 'state.test.get');

			res = state.get('state.test.get', 'default');
			assert.strictEqual(res, 'testvalue');

			state.update('state.test.get', undefined);

			keys = state.keys();
			assert.strictEqual(keys.length, 0, `Unexpected keys: ${JSON.stringify(keys)}`);

			res = state.get('state.test.get', 'default');
			assert.strictEqual(res, 'default');
		}
	});

	test('state - handling of objects', async () => {
		for (const state of [extensionContext.globalState, extensionContext.workspaceState]) {
			const keys = state.keys();
			assert.strictEqual(keys.length, 0);

			state.update('state.test.date', new Date());
			const date = state.get('state.test.date');
			assert.ok(typeof date === 'string');

			state.update('state.test.regex', /foo/);
			const regex = state.get('state.test.regex');
			assert.ok(typeof regex === 'object' && !(regex instanceof RegExp));

			class Foo { }
			state.update('state.test.class', new Foo());
			const clazz = state.get('state.test.class');
			assert.ok(typeof clazz === 'object' && !(clazz instanceof Foo));

			const cycle: any = { self: null };
			cycle.self = cycle;
			assert.throws(() => state.update('state.test.cycle', cycle));

			const uriIn = Uri.parse('/foo/bar');
			state.update('state.test.uri', uriIn);
			const uriOut = state.get('state.test.uri') as Uri;
			assert.ok(uriIn.toString() === Uri.from(uriOut).toString());

			state.update('state.test.null', null);
			assert.strictEqual(state.get('state.test.null'), null);

			state.update('state.test.undefined', undefined);
			assert.strictEqual(state.get('state.test.undefined'), undefined);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/singlefolder-tests/terminal.shellIntegration.test.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/singlefolder-tests/terminal.shellIntegration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';
import { platform } from 'os';
import { env, TerminalShellExecutionCommandLineConfidence, UIKind, window, workspace, type Disposable, type Terminal, type TerminalShellExecution, type TerminalShellExecutionCommandLine, type TerminalShellExecutionEndEvent, type TerminalShellIntegration } from 'vscode';
import { assertNoRpc } from '../utils';

// Terminal integration tests are disabled on web https://github.com/microsoft/vscode/issues/92826
// Windows images will often not have functional shell integration
// TODO: Linux https://github.com/microsoft/vscode/issues/221399
(env.uiKind === UIKind.Web || platform() === 'win32' || platform() === 'linux' ? suite.skip : suite)('vscode API - Terminal.shellIntegration', () => {
	const disposables: Disposable[] = [];

	suiteSetup(async () => {
		const config = workspace.getConfiguration('terminal.integrated');
		await config.update('shellIntegration.enabled', true);
	});

	suiteTeardown(async () => {
		const config = workspace.getConfiguration('terminal.integrated');
		await config.update('shellIntegration.enabled', undefined);
	});

	teardown(async () => {
		assertNoRpc();
		disposables.forEach(d => d.dispose());
		disposables.length = 0;
	});

	function createTerminalAndWaitForShellIntegration(): Promise<{ terminal: Terminal; shellIntegration: TerminalShellIntegration }> {
		return new Promise<{ terminal: Terminal; shellIntegration: TerminalShellIntegration }>(resolve => {
			disposables.push(window.onDidChangeTerminalShellIntegration(e => {
				if (e.terminal === terminal) {
					resolve({
						terminal,
						shellIntegration: e.shellIntegration
					});
				}
			}));
			const terminal = platform() === 'win32'
				? window.createTerminal()
				: window.createTerminal({ shellPath: '/bin/bash' });
			terminal.show();
		});
	}

	function executeCommandAsync(shellIntegration: TerminalShellIntegration, command: string, args?: string[]): { execution: Promise<TerminalShellExecution>; endEvent: Promise<TerminalShellExecutionEndEvent> } {
		return {
			execution: new Promise<TerminalShellExecution>(resolve => {
				// Await a short period as pwsh's first SI prompt can fail when launched in quick succession
				setTimeout(() => {
					if (args) {
						resolve(shellIntegration.executeCommand(command, args));
					} else {
						resolve(shellIntegration.executeCommand(command));
					}
				}, 500);
			}),
			endEvent: new Promise<TerminalShellExecutionEndEvent>(resolve => {
				disposables.push(window.onDidEndTerminalShellExecution(e => {
					if (e.shellIntegration === shellIntegration) {
						resolve(e);
					}
				}));
			})
		};
	}

	function closeTerminalAsync(terminal: Terminal): Promise<void> {
		return new Promise<void>(resolve => {
			disposables.push(window.onDidCloseTerminal(e => {
				if (e === terminal) {
					resolve();
				}
			}));
			terminal.dispose();
		});
	}

	test('window.onDidChangeTerminalShellIntegration should activate for the default terminal', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		ok(terminal.shellIntegration);
		ok(shellIntegration);
		await closeTerminalAsync(terminal);
	});

	if (platform() === 'darwin' || platform() === 'linux') {
		// TODO: Enable when this is enabled in stable, otherwise it will break the stable product builds only
		test.skip('Test if env is set', async () => {
			const { shellIntegration } = await createTerminalAndWaitForShellIntegration();
			await new Promise<void>(r => {
				disposables.push(window.onDidChangeTerminalShellIntegration(e => {
					if (e.shellIntegration.env) {
						r();
					}
				}));
			});
			ok(shellIntegration.env);
			ok(shellIntegration.env.value);
			ok(shellIntegration.env.value.PATH);
			ok(shellIntegration.env.value.PATH.length > 0, 'env.value.PATH should have a length greater than 0');
		});
	}

	test('execution events should fire in order when a command runs', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const events: string[] = [];
		disposables.push(window.onDidStartTerminalShellExecution(() => events.push('start')));
		disposables.push(window.onDidEndTerminalShellExecution(() => events.push('end')));

		await executeCommandAsync(shellIntegration, 'echo hello').endEvent;

		deepStrictEqual(events, ['start', 'end']);

		await closeTerminalAsync(terminal);
	});

	test('end execution event should report zero exit code for successful commands', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const events: string[] = [];
		disposables.push(window.onDidStartTerminalShellExecution(() => events.push('start')));
		disposables.push(window.onDidEndTerminalShellExecution(() => events.push('end')));

		const endEvent = await executeCommandAsync(shellIntegration, 'echo hello').endEvent;
		strictEqual(endEvent.exitCode, 0);

		await closeTerminalAsync(terminal);
	});

	test('end execution event should report non-zero exit code for failed commands', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const events: string[] = [];
		disposables.push(window.onDidStartTerminalShellExecution(() => events.push('start')));
		disposables.push(window.onDidEndTerminalShellExecution(() => events.push('end')));

		const endEvent = await executeCommandAsync(shellIntegration, 'fakecommand').endEvent;
		notStrictEqual(endEvent.exitCode, 0);

		await closeTerminalAsync(terminal);
	});

	test('TerminalShellExecution.read iterables should be available between the start and end execution events', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const events: string[] = [];
		disposables.push(window.onDidStartTerminalShellExecution(() => events.push('start')));
		disposables.push(window.onDidEndTerminalShellExecution(() => events.push('end')));

		const { execution, endEvent } = executeCommandAsync(shellIntegration, 'echo hello');
		for await (const _ of (await execution).read()) {
			events.push('data');
		}
		await endEvent;

		ok(events.length >= 3, `should have at least 3 events ${JSON.stringify(events)}`);
		strictEqual(events[0], 'start', `first event should be 'start' ${JSON.stringify(events)}`);
		strictEqual(events.at(-1), 'end', `last event should be 'end' ${JSON.stringify(events)}`);
		for (let i = 1; i < events.length - 1; i++) {
			strictEqual(events[i], 'data', `all middle events should be 'data' ${JSON.stringify(events)}`);
		}

		await closeTerminalAsync(terminal);
	});

	test('TerminalShellExecution.read events should fire with contents of command', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const events: string[] = [];

		const { execution, endEvent } = executeCommandAsync(shellIntegration, 'echo hello');
		for await (const data of (await execution).read()) {
			events.push(data);
		}
		await endEvent;

		ok(events.join('').includes('hello'), `should include 'hello' in ${JSON.stringify(events)}`);

		await closeTerminalAsync(terminal);
	});

	test('TerminalShellExecution.read events should give separate iterables per call', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();

		const { execution, endEvent } = executeCommandAsync(shellIntegration, 'echo hello');
		const executionSync = await execution;
		const firstRead = executionSync.read();
		const secondRead = executionSync.read();

		const [firstReadEvents, secondReadEvents] = await Promise.all([
			new Promise<string[]>(resolve => {
				(async () => {
					const events: string[] = [];
					for await (const data of firstRead) {
						events.push(data);
					}
					resolve(events);
				})();
			}),
			new Promise<string[]>(resolve => {
				(async () => {
					const events: string[] = [];
					for await (const data of secondRead) {
						events.push(data);
					}
					resolve(events);
				})();
			}),
		]);
		await endEvent;

		ok(firstReadEvents.join('').includes('hello'), `should include 'hello' in ${JSON.stringify(firstReadEvents)}`);
		deepStrictEqual(firstReadEvents, secondReadEvents);

		await closeTerminalAsync(terminal);
	});

	test('executeCommand(commandLine)', async () => {
		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const { execution, endEvent } = executeCommandAsync(shellIntegration, 'echo hello');
		const executionSync = await execution;
		const expectedCommandLine: TerminalShellExecutionCommandLine = {
			value: 'echo hello',
			isTrusted: true,
			confidence: TerminalShellExecutionCommandLineConfidence.High
		};
		deepStrictEqual(executionSync.commandLine, expectedCommandLine);
		await endEvent;
		deepStrictEqual(executionSync.commandLine, expectedCommandLine);
		await closeTerminalAsync(terminal);
	});

	test('executeCommand(executable, args)', async function () {
		// HACK: This test has flaked before where the `value` was `e`, not `echo hello`. After an
		// investigation it's not clear how this happened, so in order to keep some of the value
		// that the test adds, it will retry after a failure.
		this.retries(3);

		const { terminal, shellIntegration } = await createTerminalAndWaitForShellIntegration();
		const { execution, endEvent } = executeCommandAsync(shellIntegration, 'echo', ['hello']);
		const executionSync = await execution;
		const expectedCommandLine: TerminalShellExecutionCommandLine = {
			value: 'echo hello',
			isTrusted: true,
			confidence: TerminalShellExecutionCommandLineConfidence.High
		};
		deepStrictEqual(executionSync.commandLine, expectedCommandLine);
		await endEvent;
		deepStrictEqual(executionSync.commandLine, expectedCommandLine);
		await closeTerminalAsync(terminal);
	});
});
```

--------------------------------------------------------------------------------

````

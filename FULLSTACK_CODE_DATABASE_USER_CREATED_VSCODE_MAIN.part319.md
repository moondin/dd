---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 319
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 319 of 552)

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

---[FILE: src/vs/workbench/api/test/browser/extHostBulkEdits.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostBulkEdits.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as extHostTypes from '../../common/extHostTypes.js';
import { MainContext, IWorkspaceEditDto, MainThreadBulkEditsShape, IWorkspaceTextEditDto } from '../../common/extHost.protocol.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { SingleProxyRPCProtocol, TestRPCProtocol } from '../common/testRPCProtocol.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ExtHostBulkEdits } from '../../common/extHostBulkEdits.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { SerializableObjectWithBuffers } from '../../../services/extensions/common/proxyIdentifier.js';

suite('ExtHostBulkEdits.applyWorkspaceEdit', () => {

	const resource = URI.parse('foo:bar');
	let bulkEdits: ExtHostBulkEdits;
	let workspaceResourceEdits: IWorkspaceEditDto;

	setup(() => {
		workspaceResourceEdits = null!;

		const rpcProtocol = new TestRPCProtocol();
		rpcProtocol.set(MainContext.MainThreadBulkEdits, new class extends mock<MainThreadBulkEditsShape>() {
			override $tryApplyWorkspaceEdit(_workspaceResourceEdits: SerializableObjectWithBuffers<IWorkspaceEditDto>): Promise<boolean> {
				workspaceResourceEdits = _workspaceResourceEdits.value;
				return Promise.resolve(true);
			}
		});
		const documentsAndEditors = new ExtHostDocumentsAndEditors(SingleProxyRPCProtocol(null), new NullLogService());
		documentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				languageId: 'foo',
				uri: resource,
				versionId: 1337,
				lines: ['foo'],
				EOL: '\n',
				encoding: 'utf8'
			}]
		});
		bulkEdits = new ExtHostBulkEdits(rpcProtocol, documentsAndEditors);
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('uses version id if document available', async () => {
		const edit = new extHostTypes.WorkspaceEdit();
		edit.replace(resource, new extHostTypes.Range(0, 0, 0, 0), 'hello');
		await bulkEdits.applyWorkspaceEdit(edit, nullExtensionDescription, undefined);
		assert.strictEqual(workspaceResourceEdits.edits.length, 1);
		const [first] = workspaceResourceEdits.edits;
		assert.strictEqual((<IWorkspaceTextEditDto>first).versionId, 1337);
	});

	test('does not use version id if document is not available', async () => {
		const edit = new extHostTypes.WorkspaceEdit();
		edit.replace(URI.parse('foo:bar2'), new extHostTypes.Range(0, 0, 0, 0), 'hello');
		await bulkEdits.applyWorkspaceEdit(edit, nullExtensionDescription, undefined);
		assert.strictEqual(workspaceResourceEdits.edits.length, 1);
		const [first] = workspaceResourceEdits.edits;
		assert.ok(typeof (<IWorkspaceTextEditDto>first).versionId === 'undefined');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostCommands.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostCommands.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ExtHostCommands } from '../../common/extHostCommands.js';
import { MainThreadCommandsShape } from '../../common/extHost.protocol.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { mock } from '../../../../base/test/common/mock.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { IExtHostTelemetry } from '../../common/extHostTelemetry.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostCommands', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('dispose calls unregister', function () {

		let lastUnregister: string;

		const shape = new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand(id: string): void {
				//
			}
			override $unregisterCommand(id: string): void {
				lastUnregister = id;
			}
		};

		const commands = new ExtHostCommands(
			SingleProxyRPCProtocol(shape),
			new NullLogService(),
			new class extends mock<IExtHostTelemetry>() {
				override onExtensionError(): boolean {
					return true;
				}
			}
		);
		commands.registerCommand(true, 'foo', (): any => { }).dispose();
		assert.strictEqual(lastUnregister!, 'foo');
		assert.strictEqual(CommandsRegistry.getCommand('foo'), undefined);

	});

	test('dispose bubbles only once', function () {

		let unregisterCounter = 0;

		const shape = new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand(id: string): void {
				//
			}
			override $unregisterCommand(id: string): void {
				unregisterCounter += 1;
			}
		};

		const commands = new ExtHostCommands(
			SingleProxyRPCProtocol(shape),
			new NullLogService(),
			new class extends mock<IExtHostTelemetry>() {
				override onExtensionError(): boolean {
					return true;
				}
			}
		);
		const reg = commands.registerCommand(true, 'foo', (): any => { });
		reg.dispose();
		reg.dispose();
		reg.dispose();
		assert.strictEqual(unregisterCounter, 1);
	});

	test('execute with retry', async function () {

		let count = 0;

		const shape = new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand(id: string): void {
				//
			}
			override async $executeCommand<T>(id: string, args: any[], retry: boolean): Promise<T | undefined> {
				count++;
				assert.strictEqual(retry, count === 1);
				if (count === 1) {
					assert.strictEqual(retry, true);
					throw new Error('$executeCommand:retry');
				} else {
					assert.strictEqual(retry, false);
					// eslint-disable-next-line local/code-no-any-casts
					return <any>17;
				}
			}
		};

		const commands = new ExtHostCommands(
			SingleProxyRPCProtocol(shape),
			new NullLogService(),
			new class extends mock<IExtHostTelemetry>() {
				override onExtensionError(): boolean {
					return true;
				}
			}
		);

		const result: number = await commands.executeCommand('fooo', [this, true]);
		assert.strictEqual(result, 17);
		assert.strictEqual(count, 2);
	});

	test('onCommand:abc activates extensions when executed from command palette, but not when executed programmatically with vscode.commands.executeCommand #150293', async function () {

		const activationEvents: string[] = [];

		const shape = new class extends mock<MainThreadCommandsShape>() {
			override $registerCommand(id: string): void {
				//
			}
			override $fireCommandActivationEvent(id: string): void {
				activationEvents.push(id);
			}
		};
		const commands = new ExtHostCommands(
			SingleProxyRPCProtocol(shape),
			new NullLogService(),
			new class extends mock<IExtHostTelemetry>() {
				override onExtensionError(): boolean {
					return true;
				}
			}
		);

		commands.registerCommand(true, 'extCmd', (args: any): any => args);

		const result: unknown = await commands.executeCommand('extCmd', this);
		assert.strictEqual(result, this);
		assert.deepStrictEqual(activationEvents, ['extCmd']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostConfiguration.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostConfiguration.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtHostWorkspace } from '../../common/extHostWorkspace.js';
import { ConfigurationInspect, ExtHostConfigProvider } from '../../common/extHostConfiguration.js';
import { MainThreadConfigurationShape, IConfigurationInitData } from '../../common/extHost.protocol.js';
import { ConfigurationModel, ConfigurationModelParser } from '../../../../platform/configuration/common/configurationModels.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { mock } from '../../../../base/test/common/mock.js';
import { IWorkspaceFolder, WorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ConfigurationTarget, IConfigurationModel, IConfigurationChange } from '../../../../platform/configuration/common/configuration.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { FileSystemProviderCapabilities } from '../../../../platform/files/common/files.js';
import { isLinux } from '../../../../base/common/platform.js';
import { IURITransformerService } from '../../common/extHostUriTransformerService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostConfiguration', function () {

	class RecordingShape extends mock<MainThreadConfigurationShape>() {
		lastArgs!: [ConfigurationTarget, string, any];
		override $updateConfigurationOption(target: ConfigurationTarget, key: string, value: any): Promise<void> {
			this.lastArgs = [target, key, value];
			return Promise.resolve(undefined);
		}
	}

	function createExtHostWorkspace(): ExtHostWorkspace {
		return new ExtHostWorkspace(new TestRPCProtocol(), new class extends mock<IExtHostInitDataService>() { }, new class extends mock<IExtHostFileSystemInfo>() { override getCapabilities() { return isLinux ? FileSystemProviderCapabilities.PathCaseSensitive : undefined; } }, new NullLogService(), new class extends mock<IURITransformerService>() { });
	}

	function createExtHostConfiguration(contents: any = Object.create(null), shape?: MainThreadConfigurationShape) {
		if (!shape) {
			shape = new class extends mock<MainThreadConfigurationShape>() { };
		}
		return new ExtHostConfigProvider(shape, createExtHostWorkspace(), createConfigurationData(contents), new NullLogService());
	}

	function createConfigurationData(contents: any): IConfigurationInitData {
		return {
			defaults: new ConfigurationModel(contents, [], [], undefined, new NullLogService()),
			policy: ConfigurationModel.createEmptyModel(new NullLogService()),
			application: ConfigurationModel.createEmptyModel(new NullLogService()),
			userLocal: new ConfigurationModel(contents, [], [], undefined, new NullLogService()),
			userRemote: ConfigurationModel.createEmptyModel(new NullLogService()),
			workspace: ConfigurationModel.createEmptyModel(new NullLogService()),
			folders: [],
			configurationScopes: []
		};
	}

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('getConfiguration fails regression test 1.7.1 -> 1.8 #15552', function () {
		const extHostConfig = createExtHostConfiguration({
			'search': {
				'exclude': {
					'**/node_modules': true
				}
			}
		});

		assert.strictEqual(extHostConfig.getConfiguration('search.exclude')['**/node_modules'], true);
		assert.strictEqual(extHostConfig.getConfiguration('search.exclude').get('**/node_modules'), true);
		assert.strictEqual(extHostConfig.getConfiguration('search').get<any>('exclude')['**/node_modules'], true);

		assert.strictEqual(extHostConfig.getConfiguration('search.exclude').has('**/node_modules'), true);
		assert.strictEqual(extHostConfig.getConfiguration('search').has('exclude.**/node_modules'), true);
	});

	test('has/get', () => {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'nested': {
					'config1': 42,
					'config2': 'Das Pferd frisst kein Reis.'
				},
				'config4': ''
			}
		});

		const config = all.getConfiguration('farboo');

		assert.ok(config.has('config0'));
		assert.strictEqual(config.get('config0'), true);
		assert.strictEqual(config.get('config4'), '');
		assert.strictEqual(config['config0'], true);
		assert.strictEqual(config['config4'], '');

		assert.ok(config.has('nested.config1'));
		assert.strictEqual(config.get('nested.config1'), 42);
		assert.ok(config.has('nested.config2'));
		assert.strictEqual(config.get('nested.config2'), 'Das Pferd frisst kein Reis.');

		assert.ok(config.has('nested'));
		assert.deepStrictEqual(config.get('nested'), { config1: 42, config2: 'Das Pferd frisst kein Reis.' });
	});

	test('get nested config', () => {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'nested': {
					'config1': 42,
					'config2': 'Das Pferd frisst kein Reis.'
				},
				'config4': ''
			}
		});

		assert.deepStrictEqual(all.getConfiguration('farboo.nested').get('config1'), 42);
		assert.deepStrictEqual(all.getConfiguration('farboo.nested').get('config2'), 'Das Pferd frisst kein Reis.');
		assert.deepStrictEqual(all.getConfiguration('farboo.nested')['config1'], 42);
		assert.deepStrictEqual(all.getConfiguration('farboo.nested')['config2'], 'Das Pferd frisst kein Reis.');
		assert.deepStrictEqual(all.getConfiguration('farboo.nested1').get('config1'), undefined);
		assert.deepStrictEqual(all.getConfiguration('farboo.nested1').get('config2'), undefined);
		assert.deepStrictEqual(all.getConfiguration('farboo.config0.config1').get('a'), undefined);
		assert.deepStrictEqual(all.getConfiguration('farboo.config0.config1')['a'], undefined);
	});

	test('can modify the returned configuration', function () {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'nested': {
					'config1': 42,
					'config2': 'Das Pferd frisst kein Reis.'
				},
				'config4': ''
			},
			'workbench': {
				'colorCustomizations': {
					'statusBar.foreground': 'somevalue'
				}
			}
		});

		let testObject = all.getConfiguration();
		let actual = testObject.get<any>('farboo')!;
		actual['nested']['config1'] = 41;
		assert.strictEqual(41, actual['nested']['config1']);
		actual['farboo1'] = 'newValue';
		assert.strictEqual('newValue', actual['farboo1']);

		testObject = all.getConfiguration();
		actual = testObject.get('farboo')!;
		assert.strictEqual(actual['nested']['config1'], 42);
		assert.strictEqual(actual['farboo1'], undefined);

		testObject = all.getConfiguration();
		actual = testObject.get('farboo')!;
		assert.strictEqual(actual['config0'], true);
		actual['config0'] = false;
		assert.strictEqual(actual['config0'], false);

		testObject = all.getConfiguration();
		actual = testObject.get('farboo')!;
		assert.strictEqual(actual['config0'], true);

		testObject = all.getConfiguration();
		actual = testObject.inspect('farboo')!;
		actual['value'] = 'effectiveValue';
		assert.strictEqual('effectiveValue', actual['value']);

		testObject = all.getConfiguration('workbench');
		actual = testObject.get('colorCustomizations')!;
		actual['statusBar.foreground'] = undefined;
		assert.strictEqual(actual['statusBar.foreground'], undefined);
		testObject = all.getConfiguration('workbench');
		actual = testObject.get('colorCustomizations')!;
		assert.strictEqual(actual['statusBar.foreground'], 'somevalue');
	});

	test('Stringify returned configuration', function () {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'nested': {
					'config1': 42,
					'config2': 'Das Pferd frisst kein Reis.'
				},
				'config4': ''
			},
			'workbench': {
				'colorCustomizations': {
					'statusBar.foreground': 'somevalue'
				},
				'emptyobjectkey': {
				}
			}
		});

		const testObject = all.getConfiguration();
		let actual: any = testObject.get('farboo');
		assert.deepStrictEqual(JSON.stringify({
			'config0': true,
			'nested': {
				'config1': 42,
				'config2': 'Das Pferd frisst kein Reis.'
			},
			'config4': ''
		}), JSON.stringify(actual));

		assert.deepStrictEqual(undefined, JSON.stringify(testObject.get('unknownkey')));

		actual = testObject.get('farboo')!;
		actual['config0'] = false;
		assert.deepStrictEqual(JSON.stringify({
			'config0': false,
			'nested': {
				'config1': 42,
				'config2': 'Das Pferd frisst kein Reis.'
			},
			'config4': ''
		}), JSON.stringify(actual));

		actual = testObject.get<any>('workbench')!['colorCustomizations']!;
		actual['statusBar.background'] = 'anothervalue';
		assert.deepStrictEqual(JSON.stringify({
			'statusBar.foreground': 'somevalue',
			'statusBar.background': 'anothervalue'
		}), JSON.stringify(actual));

		actual = testObject.get('workbench');
		actual['unknownkey'] = 'somevalue';
		assert.deepStrictEqual(JSON.stringify({
			'colorCustomizations': {
				'statusBar.foreground': 'somevalue'
			},
			'emptyobjectkey': {},
			'unknownkey': 'somevalue'
		}), JSON.stringify(actual));

		actual = all.getConfiguration('workbench').get('emptyobjectkey');
		actual = {
			...(actual || {}),
			'statusBar.background': `#0ff`,
			'statusBar.foreground': `#ff0`,
		};
		assert.deepStrictEqual(JSON.stringify({
			'statusBar.background': `#0ff`,
			'statusBar.foreground': `#ff0`,
		}), JSON.stringify(actual));

		actual = all.getConfiguration('workbench').get('unknownkey');
		actual = {
			...(actual || {}),
			'statusBar.background': `#0ff`,
			'statusBar.foreground': `#ff0`,
		};
		assert.deepStrictEqual(JSON.stringify({
			'statusBar.background': `#0ff`,
			'statusBar.foreground': `#ff0`,
		}), JSON.stringify(actual));
	});

	test('cannot modify returned configuration', function () {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'nested': {
					'config1': 42,
					'config2': 'Das Pferd frisst kein Reis.'
				},
				'config4': ''
			}
		});

		const testObject: any = all.getConfiguration();

		try {
			testObject['get'] = null;
			assert.fail('This should be readonly');
		} catch (e) {
		}

		try {
			testObject['farboo']['config0'] = false;
			assert.fail('This should be readonly');
		} catch (e) {
		}

		try {
			testObject['farboo']['farboo1'] = 'hello';
			assert.fail('This should be readonly');
		} catch (e) {
		}
	});

	test('inspect in no workspace context', function () {
		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			createExtHostWorkspace(),
			{
				defaults: new ConfigurationModel({
					'editor': {
						'wordWrap': 'off',
						'lineNumbers': 'on',
						'fontSize': '12px'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				policy: ConfigurationModel.createEmptyModel(new NullLogService()),
				application: ConfigurationModel.createEmptyModel(new NullLogService()),
				userLocal: new ConfigurationModel({
					'editor': {
						'wordWrap': 'on',
						'lineNumbers': 'off'
					}
				}, ['editor.wordWrap', 'editor.lineNumbers'], [], undefined, new NullLogService()),
				userRemote: new ConfigurationModel({
					'editor': {
						'lineNumbers': 'relative'
					}
				}, ['editor.lineNumbers'], [], {
					'editor': {
						'lineNumbers': 'relative',
						'fontSize': '14px'
					}
				}, new NullLogService()),
				workspace: new ConfigurationModel({}, [], [], undefined, new NullLogService()),
				folders: [],
				configurationScopes: []
			},
			new NullLogService()
		);

		let actual: ConfigurationInspect<string> = testObject.getConfiguration().inspect('editor.wordWrap')!;
		assert.strictEqual(actual.defaultValue, 'off');
		assert.strictEqual(actual.globalLocalValue, 'on');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.globalValue, 'on');
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);

		actual = testObject.getConfiguration('editor').inspect('wordWrap')!;
		assert.strictEqual(actual.defaultValue, 'off');
		assert.strictEqual(actual.globalLocalValue, 'on');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.globalValue, 'on');
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);

		actual = testObject.getConfiguration('editor').inspect('lineNumbers')!;
		assert.strictEqual(actual.defaultValue, 'on');
		assert.strictEqual(actual.globalLocalValue, 'off');
		assert.strictEqual(actual.globalRemoteValue, 'relative');
		assert.strictEqual(actual.globalValue, 'relative');
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);

		assert.strictEqual(testObject.getConfiguration('editor').get('fontSize'), '12px');

		actual = testObject.getConfiguration('editor').inspect('fontSize')!;
		assert.strictEqual(actual.defaultValue, '12px');
		assert.strictEqual(actual.globalLocalValue, undefined);
		assert.strictEqual(actual.globalRemoteValue, '14px');
		assert.strictEqual(actual.globalValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);
	});

	test('inspect in single root context', function () {
		const workspaceUri = URI.file('foo');
		const folders: [UriComponents, IConfigurationModel][] = [];
		const workspace = new ConfigurationModel({
			'editor': {
				'wordWrap': 'bounded'
			}
		}, ['editor.wordWrap'], [], undefined, new NullLogService());
		folders.push([workspaceUri, workspace]);
		const extHostWorkspace = createExtHostWorkspace();
		extHostWorkspace.$initializeWorkspace({
			'id': 'foo',
			'folders': [aWorkspaceFolder(URI.file('foo'), 0)],
			'name': 'foo'
		}, true);
		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			extHostWorkspace,
			{
				defaults: new ConfigurationModel({
					'editor': {
						'wordWrap': 'off'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				policy: ConfigurationModel.createEmptyModel(new NullLogService()),
				application: ConfigurationModel.createEmptyModel(new NullLogService()),
				userLocal: new ConfigurationModel({
					'editor': {
						'wordWrap': 'on'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				userRemote: ConfigurationModel.createEmptyModel(new NullLogService()),
				workspace,
				folders,
				configurationScopes: []
			},
			new NullLogService()
		);

		let actual1: ConfigurationInspect<string> = testObject.getConfiguration().inspect('editor.wordWrap')!;
		assert.strictEqual(actual1.defaultValue, 'off');
		assert.strictEqual(actual1.globalLocalValue, 'on');
		assert.strictEqual(actual1.globalRemoteValue, undefined);
		assert.strictEqual(actual1.globalValue, 'on');
		assert.strictEqual(actual1.workspaceValue, 'bounded');
		assert.strictEqual(actual1.workspaceFolderValue, undefined);

		actual1 = testObject.getConfiguration('editor').inspect('wordWrap')!;
		assert.strictEqual(actual1.defaultValue, 'off');
		assert.strictEqual(actual1.globalLocalValue, 'on');
		assert.strictEqual(actual1.globalRemoteValue, undefined);
		assert.strictEqual(actual1.globalValue, 'on');
		assert.strictEqual(actual1.workspaceValue, 'bounded');
		assert.strictEqual(actual1.workspaceFolderValue, undefined);

		let actual2: ConfigurationInspect<string> = testObject.getConfiguration(undefined, workspaceUri).inspect('editor.wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'bounded');

		actual2 = testObject.getConfiguration('editor', workspaceUri).inspect('wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'bounded');
	});

	test('inspect in multi root context', function () {
		const workspace = new ConfigurationModel({
			'editor': {
				'wordWrap': 'bounded'
			}
		}, ['editor.wordWrap'], [], undefined, new NullLogService());

		const firstRoot = URI.file('foo1');
		const secondRoot = URI.file('foo2');
		const thirdRoot = URI.file('foo3');
		const folders: [UriComponents, IConfigurationModel][] = [];
		folders.push([firstRoot, new ConfigurationModel({
			'editor': {
				'wordWrap': 'off',
				'lineNumbers': 'relative'
			}
		}, ['editor.wordWrap'], [], undefined, new NullLogService())]);
		folders.push([secondRoot, new ConfigurationModel({
			'editor': {
				'wordWrap': 'on'
			}
		}, ['editor.wordWrap'], [], undefined, new NullLogService())]);
		folders.push([thirdRoot, new ConfigurationModel({}, [], [], undefined, new NullLogService())]);

		const extHostWorkspace = createExtHostWorkspace();
		extHostWorkspace.$initializeWorkspace({
			'id': 'foo',
			'folders': [aWorkspaceFolder(firstRoot, 0), aWorkspaceFolder(secondRoot, 1)],
			'name': 'foo'
		}, true);
		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			extHostWorkspace,
			{
				defaults: new ConfigurationModel({
					'editor': {
						'wordWrap': 'off',
						'lineNumbers': 'on'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				policy: ConfigurationModel.createEmptyModel(new NullLogService()),
				application: ConfigurationModel.createEmptyModel(new NullLogService()),
				userLocal: new ConfigurationModel({
					'editor': {
						'wordWrap': 'on'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				userRemote: ConfigurationModel.createEmptyModel(new NullLogService()),
				workspace,
				folders,
				configurationScopes: []
			},
			new NullLogService()
		);

		let actual1: ConfigurationInspect<string> = testObject.getConfiguration().inspect('editor.wordWrap')!;
		assert.strictEqual(actual1.defaultValue, 'off');
		assert.strictEqual(actual1.globalValue, 'on');
		assert.strictEqual(actual1.globalLocalValue, 'on');
		assert.strictEqual(actual1.globalRemoteValue, undefined);
		assert.strictEqual(actual1.workspaceValue, 'bounded');
		assert.strictEqual(actual1.workspaceFolderValue, undefined);

		actual1 = testObject.getConfiguration('editor').inspect('wordWrap')!;
		assert.strictEqual(actual1.defaultValue, 'off');
		assert.strictEqual(actual1.globalValue, 'on');
		assert.strictEqual(actual1.globalLocalValue, 'on');
		assert.strictEqual(actual1.globalRemoteValue, undefined);
		assert.strictEqual(actual1.workspaceValue, 'bounded');
		assert.strictEqual(actual1.workspaceFolderValue, undefined);

		actual1 = testObject.getConfiguration('editor').inspect('lineNumbers')!;
		assert.strictEqual(actual1.defaultValue, 'on');
		assert.strictEqual(actual1.globalValue, undefined);
		assert.strictEqual(actual1.globalLocalValue, undefined);
		assert.strictEqual(actual1.globalRemoteValue, undefined);
		assert.strictEqual(actual1.workspaceValue, undefined);
		assert.strictEqual(actual1.workspaceFolderValue, undefined);

		let actual2: ConfigurationInspect<string> = testObject.getConfiguration(undefined, firstRoot).inspect('editor.wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'off');

		actual2 = testObject.getConfiguration('editor', firstRoot).inspect('wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'off');

		actual2 = testObject.getConfiguration('editor', firstRoot).inspect('lineNumbers')!;
		assert.strictEqual(actual2.defaultValue, 'on');
		assert.strictEqual(actual2.globalValue, undefined);
		assert.strictEqual(actual2.globalLocalValue, undefined);
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, undefined);
		assert.strictEqual(actual2.workspaceFolderValue, 'relative');

		actual2 = testObject.getConfiguration(undefined, secondRoot).inspect('editor.wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'on');

		actual2 = testObject.getConfiguration('editor', secondRoot).inspect('wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.strictEqual(actual2.workspaceFolderValue, 'on');

		actual2 = testObject.getConfiguration(undefined, thirdRoot).inspect('editor.wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.ok(Object.keys(actual2).indexOf('workspaceFolderValue') !== -1);
		assert.strictEqual(actual2.workspaceFolderValue, undefined);

		actual2 = testObject.getConfiguration('editor', thirdRoot).inspect('wordWrap')!;
		assert.strictEqual(actual2.defaultValue, 'off');
		assert.strictEqual(actual2.globalValue, 'on');
		assert.strictEqual(actual2.globalLocalValue, 'on');
		assert.strictEqual(actual2.globalRemoteValue, undefined);
		assert.strictEqual(actual2.workspaceValue, 'bounded');
		assert.ok(Object.keys(actual2).indexOf('workspaceFolderValue') !== -1);
		assert.strictEqual(actual2.workspaceFolderValue, undefined);
	});

	test('inspect with language overrides', function () {
		const firstRoot = URI.file('foo1');
		const secondRoot = URI.file('foo2');
		const folders: [UriComponents, IConfigurationModel][] = [];
		folders.push([firstRoot, toConfigurationModel({
			'editor.wordWrap': 'bounded',
			'[typescript]': {
				'editor.wordWrap': 'unbounded',
			}
		})]);
		folders.push([secondRoot, toConfigurationModel({})]);

		const extHostWorkspace = createExtHostWorkspace();
		extHostWorkspace.$initializeWorkspace({
			'id': 'foo',
			'folders': [aWorkspaceFolder(firstRoot, 0), aWorkspaceFolder(secondRoot, 1)],
			'name': 'foo'
		}, true);
		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			extHostWorkspace,
			{
				defaults: toConfigurationModel({
					'editor.wordWrap': 'off',
					'[markdown]': {
						'editor.wordWrap': 'bounded',
					}
				}),
				policy: ConfigurationModel.createEmptyModel(new NullLogService()),
				application: ConfigurationModel.createEmptyModel(new NullLogService()),
				userLocal: toConfigurationModel({
					'editor.wordWrap': 'bounded',
					'[typescript]': {
						'editor.lineNumbers': 'off',
					}
				}),
				userRemote: ConfigurationModel.createEmptyModel(new NullLogService()),
				workspace: toConfigurationModel({
					'[typescript]': {
						'editor.wordWrap': 'unbounded',
						'editor.lineNumbers': 'off',
					}
				}),
				folders,
				configurationScopes: []
			},
			new NullLogService()
		);

		let actual: ConfigurationInspect<string> = testObject.getConfiguration(undefined, { uri: firstRoot, languageId: 'typescript' }).inspect('editor.wordWrap')!;
		assert.strictEqual(actual.defaultValue, 'off');
		assert.strictEqual(actual.globalValue, 'bounded');
		assert.strictEqual(actual.globalLocalValue, 'bounded');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, 'bounded');
		assert.strictEqual(actual.defaultLanguageValue, undefined);
		assert.strictEqual(actual.globalLanguageValue, undefined);
		assert.strictEqual(actual.workspaceLanguageValue, 'unbounded');
		assert.strictEqual(actual.workspaceFolderLanguageValue, 'unbounded');
		assert.deepStrictEqual(actual.languageIds, ['markdown', 'typescript']);

		actual = testObject.getConfiguration(undefined, { uri: secondRoot, languageId: 'typescript' }).inspect('editor.wordWrap')!;
		assert.strictEqual(actual.defaultValue, 'off');
		assert.strictEqual(actual.globalValue, 'bounded');
		assert.strictEqual(actual.globalLocalValue, 'bounded');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);
		assert.strictEqual(actual.defaultLanguageValue, undefined);
		assert.strictEqual(actual.globalLanguageValue, undefined);
		assert.strictEqual(actual.workspaceLanguageValue, 'unbounded');
		assert.strictEqual(actual.workspaceFolderLanguageValue, undefined);
		assert.deepStrictEqual(actual.languageIds, ['markdown', 'typescript']);
	});

	test('application is not set in inspect', () => {

		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			createExtHostWorkspace(),
			{
				defaults: new ConfigurationModel({
					'editor': {
						'wordWrap': 'off',
						'lineNumbers': 'on',
						'fontSize': '12px'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				policy: ConfigurationModel.createEmptyModel(new NullLogService()),
				application: new ConfigurationModel({
					'editor': {
						'wordWrap': 'on'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				userLocal: new ConfigurationModel({
					'editor': {
						'wordWrap': 'auto',
						'lineNumbers': 'off'
					}
				}, ['editor.wordWrap'], [], undefined, new NullLogService()),
				userRemote: ConfigurationModel.createEmptyModel(new NullLogService()),
				workspace: new ConfigurationModel({}, [], [], undefined, new NullLogService()),
				folders: [],
				configurationScopes: []
			},
			new NullLogService()
		);

		let actual: ConfigurationInspect<string> = testObject.getConfiguration().inspect('editor.wordWrap')!;
		assert.strictEqual(actual.defaultValue, 'off');
		assert.strictEqual(actual.globalValue, 'auto');
		assert.strictEqual(actual.globalLocalValue, 'auto');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);
		assert.strictEqual(testObject.getConfiguration().get('editor.wordWrap'), 'auto');

		actual = testObject.getConfiguration().inspect('editor.lineNumbers')!;
		assert.strictEqual(actual.defaultValue, 'on');
		assert.strictEqual(actual.globalValue, 'off');
		assert.strictEqual(actual.globalLocalValue, 'off');
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);
		assert.strictEqual(testObject.getConfiguration().get('editor.lineNumbers'), 'off');

		actual = testObject.getConfiguration().inspect('editor.fontSize')!;
		assert.strictEqual(actual.defaultValue, '12px');
		assert.strictEqual(actual.globalLocalValue, undefined);
		assert.strictEqual(actual.globalRemoteValue, undefined);
		assert.strictEqual(actual.globalValue, undefined);
		assert.strictEqual(actual.workspaceValue, undefined);
		assert.strictEqual(actual.workspaceFolderValue, undefined);
		assert.strictEqual(testObject.getConfiguration().get('editor.fontSize'), '12px');
	});

	test('getConfiguration vs get', function () {

		const all = createExtHostConfiguration({
			'farboo': {
				'config0': true,
				'config4': 38
			}
		});

		let config = all.getConfiguration('farboo.config0');
		assert.strictEqual(config.get(''), undefined);
		assert.strictEqual(config.has(''), false);

		config = all.getConfiguration('farboo');
		assert.strictEqual(config.get('config0'), true);
		assert.strictEqual(config.has('config0'), true);
	});

	test('name vs property', function () {
		const all = createExtHostConfiguration({
			'farboo': {
				'get': 'get-prop'
			}
		});
		const config = all.getConfiguration('farboo');

		assert.ok(config.has('get'));
		assert.strictEqual(config.get('get'), 'get-prop');
		assert.deepStrictEqual(config['get'], config.get);
		// eslint-disable-next-line local/code-no-any-casts
		assert.throws(() => config['get'] = <any>'get-prop');
	});

	test('update: no target passes null', function () {
		const shape = new RecordingShape();
		const allConfig = createExtHostConfiguration({
			'foo': {
				'bar': 1,
				'far': 1
			}
		}, shape);

		const config = allConfig.getConfiguration('foo');
		config.update('bar', 42);

		assert.strictEqual(shape.lastArgs[0], null);
	});

	test('update/section to key', function () {

		const shape = new RecordingShape();
		const allConfig = createExtHostConfiguration({
			'foo': {
				'bar': 1,
				'far': 1
			}
		}, shape);

		let config = allConfig.getConfiguration('foo');
		config.update('bar', 42, true);

		assert.strictEqual(shape.lastArgs[0], ConfigurationTarget.USER);
		assert.strictEqual(shape.lastArgs[1], 'foo.bar');
		assert.strictEqual(shape.lastArgs[2], 42);

		config = allConfig.getConfiguration('');
		config.update('bar', 42, true);
		assert.strictEqual(shape.lastArgs[1], 'bar');

		config.update('foo.bar', 42, true);
		assert.strictEqual(shape.lastArgs[1], 'foo.bar');
	});

	test('update, what is #15834', function () {
		const shape = new RecordingShape();
		const allConfig = createExtHostConfiguration({
			'editor': {
				'formatOnSave': true
			}
		}, shape);

		allConfig.getConfiguration('editor').update('formatOnSave', { extensions: ['ts'] });
		assert.strictEqual(shape.lastArgs[1], 'editor.formatOnSave');
		assert.deepStrictEqual(shape.lastArgs[2], { extensions: ['ts'] });
	});

	test('update/error-state not OK', function () {

		const shape = new class extends mock<MainThreadConfigurationShape>() {
			override $updateConfigurationOption(target: ConfigurationTarget, key: string, value: any): Promise<any> {
				return Promise.reject(new Error('Unknown Key')); // something !== OK
			}
		};

		return createExtHostConfiguration({}, shape)
			.getConfiguration('')
			.update('', true, false)
			.then(() => assert.ok(false), err => { /* expecting rejection */ });
	});

	test('configuration change event', (done) => {

		const workspaceFolder = aWorkspaceFolder(URI.file('folder1'), 0);
		const extHostWorkspace = createExtHostWorkspace();
		extHostWorkspace.$initializeWorkspace({
			'id': 'foo',
			'folders': [workspaceFolder],
			'name': 'foo'
		}, true);
		const testObject = new ExtHostConfigProvider(
			new class extends mock<MainThreadConfigurationShape>() { },
			extHostWorkspace,
			createConfigurationData({
				'farboo': {
					'config': false,
					'updatedConfig': false
				}
			}),
			new NullLogService()
		);

		const newConfigData = createConfigurationData({
			'farboo': {
				'config': false,
				'updatedConfig': true,
				'newConfig': true,
			}
		});
		const configEventData: IConfigurationChange = { keys: ['farboo.updatedConfig', 'farboo.newConfig'], overrides: [] };
		store.add(testObject.onDidChangeConfiguration(e => {

			assert.deepStrictEqual(testObject.getConfiguration().get('farboo'), {
				'config': false,
				'updatedConfig': true,
				'newConfig': true,
			});

			assert.ok(e.affectsConfiguration('farboo'));
			assert.ok(e.affectsConfiguration('farboo', workspaceFolder.uri));
			assert.ok(e.affectsConfiguration('farboo', URI.file('any')));

			assert.ok(e.affectsConfiguration('farboo.updatedConfig'));
			assert.ok(e.affectsConfiguration('farboo.updatedConfig', workspaceFolder.uri));
			assert.ok(e.affectsConfiguration('farboo.updatedConfig', URI.file('any')));

			assert.ok(e.affectsConfiguration('farboo.newConfig'));
			assert.ok(e.affectsConfiguration('farboo.newConfig', workspaceFolder.uri));
			assert.ok(e.affectsConfiguration('farboo.newConfig', URI.file('any')));

			assert.ok(!e.affectsConfiguration('farboo.config'));
			assert.ok(!e.affectsConfiguration('farboo.config', workspaceFolder.uri));
			assert.ok(!e.affectsConfiguration('farboo.config', URI.file('any')));
			done();
		}));

		testObject.$acceptConfigurationChanged(newConfigData, configEventData);
	});

	test('get return instance of array value', function () {
		const testObject = createExtHostConfiguration({ 'far': { 'boo': [] } });

		const value: string[] = testObject.getConfiguration().get('far.boo', []);
		value.push('a');

		const actual = testObject.getConfiguration().get('far.boo', []);
		assert.deepStrictEqual(actual, []);
	});

	function aWorkspaceFolder(uri: URI, index: number, name: string = ''): IWorkspaceFolder {
		return new WorkspaceFolder({ uri, name, index });
	}

	function toConfigurationModel(obj: any): ConfigurationModel {
		const parser = new ConfigurationModelParser('test', new NullLogService());
		parser.parse(JSON.stringify(obj));
		return parser.configurationModel;
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostDecorations.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDecorations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { MainThreadDecorationsShape } from '../../common/extHost.protocol.js';
import { ExtHostDecorations } from '../../common/extHostDecorations.js';
import { IExtHostRpcService } from '../../common/extHostRpcService.js';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';

suite('ExtHostDecorations', function () {

	let mainThreadShape: MainThreadDecorationsShape;
	let extHostDecorations: ExtHostDecorations;
	const providers = new Set<number>();

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {

		providers.clear();

		mainThreadShape = new class extends mock<MainThreadDecorationsShape>() {
			override $registerDecorationProvider(handle: number) {
				providers.add(handle);
			}
		};

		extHostDecorations = new ExtHostDecorations(
			new class extends mock<IExtHostRpcService>() {
				override getProxy(): any {
					return mainThreadShape;
				}
			},
			new NullLogService()
		);
	});

	test('SCM Decorations missing #100524', async function () {

		let calledA = false;
		let calledB = false;

		// never returns
		extHostDecorations.registerFileDecorationProvider({

			provideFileDecoration() {
				calledA = true;
				return new Promise(() => { });
			}
		}, nullExtensionDescription);

		// always returns
		extHostDecorations.registerFileDecorationProvider({

			provideFileDecoration() {
				calledB = true;
				return new Promise(resolve => resolve({ badge: 'H', tooltip: 'Hello' }));
			}
		}, nullExtensionDescription);


		const requests = [...providers.values()].map((handle, idx) => {
			return extHostDecorations.$provideDecorations(handle, [{ id: idx, uri: URI.parse('test:///file') }], CancellationToken.None);
		});

		assert.strictEqual(calledA, true);
		assert.strictEqual(calledB, true);

		assert.strictEqual(requests.length, 2);
		const [first, second] = requests;

		const firstResult = await Promise.race([first, timeout(30).then(() => false)]);
		assert.strictEqual(typeof firstResult, 'boolean'); // never finishes...

		const secondResult = await Promise.race([second, timeout(30).then(() => false)]);
		assert.strictEqual(typeof secondResult, 'object');


		await timeout(30);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostDiagnostics.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDiagnostics.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { DiagnosticCollection, ExtHostDiagnostics } from '../../common/extHostDiagnostics.js';
import { Diagnostic, DiagnosticSeverity, Range, DiagnosticRelatedInformation, Location } from '../../common/extHostTypes.js';
import { MainThreadDiagnosticsShape, IMainContext } from '../../common/extHost.protocol.js';
import { IMarkerData, MarkerSeverity } from '../../../../platform/markers/common/markers.js';
import { mock } from '../../../../base/test/common/mock.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import type * as vscode from 'vscode';
import { nullExtensionDescription } from '../../../services/extensions/common/extensions.js';
import { ExtUri, extUri } from '../../../../base/common/resources.js';
import { IExtHostFileSystemInfo } from '../../common/extHostFileSystemInfo.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';
import { IExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('ExtHostDiagnostics', () => {

	class DiagnosticsShape extends mock<MainThreadDiagnosticsShape>() {
		override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]): void {
			//
		}
		override $clear(owner: string): void {
			//
		}
	}

	const fileSystemInfoService = new class extends mock<IExtHostFileSystemInfo>() {
		override readonly extUri = extUri;
	};

	const versionProvider = (uri: URI): number | undefined => {
		return undefined;
	};

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('disposeCheck', () => {

		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());

		collection.dispose();
		collection.dispose(); // that's OK
		assert.throws(() => collection.name);
		assert.throws(() => collection.clear());
		assert.throws(() => collection.delete(URI.parse('aa:bb')));
		assert.throws(() => collection.forEach(() => { }));
		assert.throws(() => collection.get(URI.parse('aa:bb')));
		assert.throws(() => collection.has(URI.parse('aa:bb')));
		assert.throws(() => collection.set(URI.parse('aa:bb'), []));
		assert.throws(() => collection.set(URI.parse('aa:bb'), undefined!));
	});


	test('diagnostic collection, forEach, clear, has', function () {
		let collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		assert.strictEqual(collection.name, 'test');
		collection.dispose();
		assert.throws(() => collection.name);

		let c = 0;
		collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		collection.forEach(() => c++);
		assert.strictEqual(c, 0);

		collection.set(URI.parse('foo:bar'), [
			new Diagnostic(new Range(0, 0, 1, 1), 'message-1'),
			new Diagnostic(new Range(0, 0, 1, 1), 'message-2')
		]);
		collection.forEach(() => c++);
		assert.strictEqual(c, 1);

		c = 0;
		collection.clear();
		collection.forEach(() => c++);
		assert.strictEqual(c, 0);

		collection.set(URI.parse('foo:bar1'), [
			new Diagnostic(new Range(0, 0, 1, 1), 'message-1'),
			new Diagnostic(new Range(0, 0, 1, 1), 'message-2')
		]);
		collection.set(URI.parse('foo:bar2'), [
			new Diagnostic(new Range(0, 0, 1, 1), 'message-1'),
			new Diagnostic(new Range(0, 0, 1, 1), 'message-2')
		]);
		collection.forEach(() => c++);
		assert.strictEqual(c, 2);

		assert.ok(collection.has(URI.parse('foo:bar1')));
		assert.ok(collection.has(URI.parse('foo:bar2')));
		assert.ok(!collection.has(URI.parse('foo:bar3')));
		collection.delete(URI.parse('foo:bar1'));
		assert.ok(!collection.has(URI.parse('foo:bar1')));

		collection.dispose();
	});

	test('diagnostic collection, immutable read', function () {
		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		collection.set(URI.parse('foo:bar'), [
			new Diagnostic(new Range(0, 0, 1, 1), 'message-1'),
			new Diagnostic(new Range(0, 0, 1, 1), 'message-2')
		]);

		let array = collection.get(URI.parse('foo:bar')) as Diagnostic[];
		assert.throws(() => array.length = 0);
		assert.throws(() => array.pop());
		assert.throws(() => array[0] = new Diagnostic(new Range(0, 0, 0, 0), 'evil'));

		collection.forEach((uri: URI, array: readonly vscode.Diagnostic[]): any => {
			assert.throws(() => (array as Diagnostic[]).length = 0);
			assert.throws(() => (array as Diagnostic[]).pop());
			assert.throws(() => (array as Diagnostic[])[0] = new Diagnostic(new Range(0, 0, 0, 0), 'evil'));
		});

		array = collection.get(URI.parse('foo:bar')) as Diagnostic[];
		assert.strictEqual(array.length, 2);

		collection.dispose();
	});


	test('diagnostics collection, set with dupliclated tuples', function () {
		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		const uri = URI.parse('sc:hightower');
		collection.set([
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-1')]],
			[URI.parse('some:thing'), [new Diagnostic(new Range(0, 0, 1, 1), 'something')]],
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-2')]],
		]);

		let array = collection.get(uri);
		assert.strictEqual(array.length, 2);
		let [first, second] = array;
		assert.strictEqual(first.message, 'message-1');
		assert.strictEqual(second.message, 'message-2');

		// clear
		collection.delete(uri);
		assert.ok(!collection.has(uri));

		// bad tuple clears 1/2
		collection.set([
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-1')]],
			[URI.parse('some:thing'), [new Diagnostic(new Range(0, 0, 1, 1), 'something')]],
			[uri, undefined!]
		]);
		assert.ok(!collection.has(uri));

		// clear
		collection.delete(uri);
		assert.ok(!collection.has(uri));

		// bad tuple clears 2/2
		collection.set([
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-1')]],
			[URI.parse('some:thing'), [new Diagnostic(new Range(0, 0, 1, 1), 'something')]],
			[uri, undefined!],
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-2')]],
			[uri, [new Diagnostic(new Range(0, 0, 0, 1), 'message-3')]],
		]);

		array = collection.get(uri);
		assert.strictEqual(array.length, 2);
		[first, second] = array;
		assert.strictEqual(first.message, 'message-2');
		assert.strictEqual(second.message, 'message-3');

		collection.dispose();
	});

	test('diagnostics collection, set tuple overrides, #11547', function () {

		let lastEntries!: [UriComponents, IMarkerData[]][];
		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]): void {
				lastEntries = entries;
				return super.$changeMany(owner, entries);
			}
		}, new Emitter());
		const uri = URI.parse('sc:hightower');

		collection.set([[uri, [new Diagnostic(new Range(0, 0, 1, 1), 'error')]]]);
		assert.strictEqual(collection.get(uri).length, 1);
		assert.strictEqual(collection.get(uri)[0].message, 'error');
		assert.strictEqual(lastEntries.length, 1);
		const [[, data1]] = lastEntries;
		assert.strictEqual(data1.length, 1);
		assert.strictEqual(data1[0].message, 'error');
		lastEntries = undefined!;

		collection.set([[uri, [new Diagnostic(new Range(0, 0, 1, 1), 'warning')]]]);
		assert.strictEqual(collection.get(uri).length, 1);
		assert.strictEqual(collection.get(uri)[0].message, 'warning');
		assert.strictEqual(lastEntries.length, 1);
		const [[, data2]] = lastEntries;
		assert.strictEqual(data2.length, 1);
		assert.strictEqual(data2[0].message, 'warning');
		lastEntries = undefined!;
	});

	test('do send message when not making a change', function () {

		let changeCount = 0;
		let eventCount = 0;

		const emitter = new Emitter<any>();
		store.add(emitter.event(_ => eventCount += 1));
		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany() {
				changeCount += 1;
			}
		}, emitter);

		const uri = URI.parse('sc:hightower');
		const diag = new Diagnostic(new Range(0, 0, 0, 1), 'ffff');

		collection.set(uri, [diag]);
		assert.strictEqual(changeCount, 1);
		assert.strictEqual(eventCount, 1);

		collection.set(uri, [diag]);
		assert.strictEqual(changeCount, 2);
		assert.strictEqual(eventCount, 2);

	});

	test('diagnostics collection, tuples and undefined (small array), #15585', function () {

		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		const uri = URI.parse('sc:hightower');
		const uri2 = URI.parse('sc:nomad');
		const diag = new Diagnostic(new Range(0, 0, 0, 1), 'ffff');

		collection.set([
			[uri, [diag, diag, diag]],
			[uri, undefined!],
			[uri, [diag]],

			[uri2, [diag, diag]],
			[uri2, undefined!],
			[uri2, [diag]],
		]);

		assert.strictEqual(collection.get(uri).length, 1);
		assert.strictEqual(collection.get(uri2).length, 1);
	});

	test('diagnostics collection, tuples and undefined (large array), #15585', function () {

		const collection = new DiagnosticCollection('test', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), new Emitter());
		const tuples: [URI, Diagnostic[]][] = [];

		for (let i = 0; i < 500; i++) {
			const uri = URI.parse('sc:hightower#' + i);
			const diag = new Diagnostic(new Range(0, 0, 0, 1), i.toString());

			tuples.push([uri, [diag, diag, diag]]);
			tuples.push([uri, undefined!]);
			tuples.push([uri, [diag]]);
		}

		collection.set(tuples);

		for (let i = 0; i < 500; i++) {
			const uri = URI.parse('sc:hightower#' + i);
			assert.strictEqual(collection.has(uri), true);
			assert.strictEqual(collection.get(uri).length, 1);
		}
	});

	test('diagnostic capping (max per file)', function () {

		let lastEntries!: [UriComponents, IMarkerData[]][];
		const collection = new DiagnosticCollection('test', 'test', 100, 250, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]): void {
				lastEntries = entries;
				return super.$changeMany(owner, entries);
			}
		}, new Emitter());
		const uri = URI.parse('aa:bb');

		const diagnostics: Diagnostic[] = [];
		for (let i = 0; i < 500; i++) {
			diagnostics.push(new Diagnostic(new Range(i, 0, i + 1, 0), `error#${i}`, i < 300
				? DiagnosticSeverity.Warning
				: DiagnosticSeverity.Error));
		}

		collection.set(uri, diagnostics);
		assert.strictEqual(collection.get(uri).length, 500);
		assert.strictEqual(lastEntries.length, 1);
		assert.strictEqual(lastEntries[0][1].length, 251);
		assert.strictEqual(lastEntries[0][1][0].severity, MarkerSeverity.Error);
		assert.strictEqual(lastEntries[0][1][200].severity, MarkerSeverity.Warning);
		assert.strictEqual(lastEntries[0][1][250].severity, MarkerSeverity.Info);
	});

	test('diagnostic capping (max files)', function () {

		let lastEntries!: [UriComponents, IMarkerData[]][];
		const collection = new DiagnosticCollection('test', 'test', 2, 1, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]): void {
				lastEntries = entries;
				return super.$changeMany(owner, entries);
			}
		}, new Emitter());

		const diag = new Diagnostic(new Range(0, 0, 1, 1), 'Hello');


		collection.set([
			[URI.parse('aa:bb1'), [diag]],
			[URI.parse('aa:bb2'), [diag]],
			[URI.parse('aa:bb3'), [diag]],
			[URI.parse('aa:bb4'), [diag]],
		]);
		assert.strictEqual(lastEntries.length, 3); // goes above the limit and then stops
	});

	test('diagnostic eventing', async function () {
		const emitter = new Emitter<readonly URI[]>();
		const collection = new DiagnosticCollection('ddd', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), emitter);

		const diag1 = new Diagnostic(new Range(1, 1, 2, 3), 'diag1');
		const diag2 = new Diagnostic(new Range(1, 1, 2, 3), 'diag2');
		const diag3 = new Diagnostic(new Range(1, 1, 2, 3), 'diag3');

		let p = Event.toPromise(emitter.event).then(a => {
			assert.strictEqual(a.length, 1);
			assert.strictEqual(a[0].toString(), 'aa:bb');
			assert.ok(URI.isUri(a[0]));
		});
		collection.set(URI.parse('aa:bb'), []);
		await p;

		p = Event.toPromise(emitter.event).then(e => {
			assert.strictEqual(e.length, 2);
			assert.ok(URI.isUri(e[0]));
			assert.ok(URI.isUri(e[1]));
			assert.strictEqual(e[0].toString(), 'aa:bb');
			assert.strictEqual(e[1].toString(), 'aa:cc');
		});
		collection.set([
			[URI.parse('aa:bb'), [diag1]],
			[URI.parse('aa:cc'), [diag2, diag3]],
		]);
		await p;

		p = Event.toPromise(emitter.event).then(e => {
			assert.strictEqual(e.length, 2);
			assert.ok(URI.isUri(e[0]));
			assert.ok(URI.isUri(e[1]));
		});
		collection.clear();
		await p;
	});

	test('vscode.languages.onDidChangeDiagnostics Does Not Provide Document URI #49582', async function () {
		const emitter = new Emitter<readonly URI[]>();
		const collection = new DiagnosticCollection('ddd', 'test', 100, 100, versionProvider, extUri, new DiagnosticsShape(), emitter);

		const diag1 = new Diagnostic(new Range(1, 1, 2, 3), 'diag1');

		// delete
		collection.set(URI.parse('aa:bb'), [diag1]);
		let p = Event.toPromise(emitter.event).then(e => {
			assert.strictEqual(e[0].toString(), 'aa:bb');
		});
		collection.delete(URI.parse('aa:bb'));
		await p;

		// set->undefined (as delete)
		collection.set(URI.parse('aa:bb'), [diag1]);
		p = Event.toPromise(emitter.event).then(e => {
			assert.strictEqual(e[0].toString(), 'aa:bb');
		});
		collection.set(URI.parse('aa:bb'), undefined!);
		await p;
	});

	test('diagnostics with related information', function (done) {

		const collection = new DiagnosticCollection('ddd', 'test', 100, 100, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]) {

				const [[, data]] = entries;
				assert.strictEqual(entries.length, 1);
				assert.strictEqual(data.length, 1);

				const [diag] = data;
				assert.strictEqual(diag.relatedInformation!.length, 2);
				assert.strictEqual(diag.relatedInformation![0].message, 'more1');
				assert.strictEqual(diag.relatedInformation![1].message, 'more2');
				done();
			}
		}, new Emitter<any>());

		const diag = new Diagnostic(new Range(0, 0, 1, 1), 'Foo');
		diag.relatedInformation = [
			new DiagnosticRelatedInformation(new Location(URI.parse('cc:dd'), new Range(0, 0, 0, 0)), 'more1'),
			new DiagnosticRelatedInformation(new Location(URI.parse('cc:ee'), new Range(0, 0, 0, 0)), 'more2')
		];

		collection.set(URI.parse('aa:bb'), [diag]);
	});

	test('vscode.languages.getDiagnostics appears to return old diagnostics in some circumstances #54359', function () {
		const ownerHistory: string[] = [];
		const diags = new ExtHostDiagnostics(new class implements IMainContext {
			getProxy(id: any): any {
				return new class DiagnosticsShape {
					$clear(owner: string): void {
						ownerHistory.push(owner);
					}
				};
			}
			set(): any {
				return null;
			}
			dispose() { }
			assertRegistered(): void {

			}
			drain() {
				return undefined!;
			}
		}, new NullLogService(), fileSystemInfoService, new class extends mock<IExtHostDocumentsAndEditors>() {
			override getDocument() {
				return undefined;
			}
		});

		const collection1 = diags.createDiagnosticCollection(nullExtensionDescription.identifier, 'foo');
		const collection2 = diags.createDiagnosticCollection(nullExtensionDescription.identifier, 'foo'); // warns, uses a different owner

		collection1.clear();
		collection2.clear();

		assert.strictEqual(ownerHistory.length, 2);
		assert.strictEqual(ownerHistory[0], 'foo');
		assert.strictEqual(ownerHistory[1], 'foo0');
	});

	test('Error updating diagnostics from extension #60394', function () {
		let callCount = 0;
		const collection = new DiagnosticCollection('ddd', 'test', 100, 100, versionProvider, extUri, new class extends DiagnosticsShape {
			override $changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]) {
				callCount += 1;
			}
		}, new Emitter<any>());

		const array: Diagnostic[] = [];
		const diag1 = new Diagnostic(new Range(0, 0, 1, 1), 'Foo');
		const diag2 = new Diagnostic(new Range(0, 0, 1, 1), 'Bar');

		array.push(diag1, diag2);

		collection.set(URI.parse('test:me'), array);
		assert.strictEqual(callCount, 1);

		collection.set(URI.parse('test:me'), array);
		assert.strictEqual(callCount, 2); // equal array

		array.push(diag2);
		collection.set(URI.parse('test:me'), array);
		assert.strictEqual(callCount, 3); // same but un-equal array
	});

	test('getDiagnostics does not tolerate sparse diagnostic arrays', function () {
		const diags = new ExtHostDiagnostics(new class implements IMainContext {
			getProxy(): any {
				return new DiagnosticsShape();
			}
			set(): any {
				return null;
			}
			dispose(): void { }
			assertRegistered(): void { }
			drain() {
				return undefined!;
			}
		}, new NullLogService(), fileSystemInfoService, new class extends mock<IExtHostDocumentsAndEditors>() {
			override getDocument() {
				return undefined;
			}
		});

		const collection = diags.createDiagnosticCollection(nullExtensionDescription.identifier, 'sparse');
		const uri = URI.parse('sparse:uri');
		const diag = new Diagnostic(new Range(0, 0, 0, 0), 'holey');
		const sparseDiagnostics: Diagnostic[] = new Array(3);
		sparseDiagnostics[1] = diag;

		collection.set(uri, sparseDiagnostics);

		const result = diags.getDiagnostics(uri);
		assert.strictEqual(result.length, 1);
		const resultWithPossibleHoles = [...result] as (vscode.Diagnostic | undefined)[];
		assert.strictEqual(resultWithPossibleHoles.some(item => item === undefined), false);
	});

	test('Version id is set whenever possible', function () {

		const all: [UriComponents, IMarkerData[]][] = [];

		const collection = new DiagnosticCollection('ddd', 'test', 100, 100, uri => {
			return 7;
		}, extUri, new class extends DiagnosticsShape {
			override $changeMany(_owner: string, entries: [UriComponents, IMarkerData[]][]) {
				all.push(...entries);
			}
		}, new Emitter<any>());

		const array: Diagnostic[] = [];
		const diag1 = new Diagnostic(new Range(0, 0, 1, 1), 'Foo');
		const diag2 = new Diagnostic(new Range(0, 0, 1, 1), 'Bar');

		array.push(diag1, diag2);

		collection.set(URI.parse('test:one'), array);
		collection.set(URI.parse('test:two'), [diag1]);
		collection.set(URI.parse('test:three'), [diag2]);

		const allVersions = all.map(tuple => tuple[1].map(t => t.modelVersionId)).flat();
		assert.deepStrictEqual(allVersions, [7, 7, 7, 7]);
	});

	test('Diagnostics created by tasks aren\'t accessible to extensions #47292', async function () {
		return runWithFakedTimers({}, async function () {

			const diags = new ExtHostDiagnostics(new class implements IMainContext {
				getProxy(id: any): any {
					return {};
				}
				set(): any {
					return null;
				}
				dispose() { }
				assertRegistered(): void {

				}
				drain() {
					return undefined!;
				}
			}, new NullLogService(), fileSystemInfoService, new class extends mock<IExtHostDocumentsAndEditors>() {
				override getDocument() {
					return undefined;
				}
			});


			//
			const uri = URI.parse('foo:bar');
			const data: IMarkerData[] = [{
				message: 'message',
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: 1,
				endColumn: 1,
				severity: MarkerSeverity.Info
			}];

			const p1 = Event.toPromise(diags.onDidChangeDiagnostics);
			diags.$acceptMarkersChange([[uri, data]]);
			await p1;
			assert.strictEqual(diags.getDiagnostics(uri).length, 1);

			const p2 = Event.toPromise(diags.onDidChangeDiagnostics);
			diags.$acceptMarkersChange([[uri, []]]);
			await p2;
			assert.strictEqual(diags.getDiagnostics(uri).length, 0);
		});
	});

	test('languages.getDiagnostics doesn\'t handle case insensitivity correctly #128198', function () {

		const diags = new ExtHostDiagnostics(new class implements IMainContext {
			getProxy(id: any): any {
				return new DiagnosticsShape();
			}
			set(): any {
				return null;
			}
			dispose() { }
			assertRegistered(): void {

			}
			drain() {
				return undefined!;
			}
		}, new NullLogService(), new class extends mock<IExtHostFileSystemInfo>() {

			override readonly extUri = new ExtUri(uri => uri.scheme === 'insensitive');
		}, new class extends mock<IExtHostDocumentsAndEditors>() {
			override getDocument() {
				return undefined;
			}
		});

		const col = diags.createDiagnosticCollection(nullExtensionDescription.identifier);

		const uriSensitive = URI.from({ scheme: 'foo', path: '/SOME/path' });
		const uriSensitiveCaseB = uriSensitive.with({ path: uriSensitive.path.toUpperCase() });

		const uriInSensitive = URI.from({ scheme: 'insensitive', path: '/SOME/path' });
		const uriInSensitiveUpper = uriInSensitive.with({ path: uriInSensitive.path.toUpperCase() });

		col.set(uriSensitive, [new Diagnostic(new Range(0, 0, 0, 0), 'sensitive')]);
		col.set(uriInSensitive, [new Diagnostic(new Range(0, 0, 0, 0), 'insensitive')]);

		// collection itself honours casing
		assert.strictEqual(col.get(uriSensitive)?.length, 1);
		assert.strictEqual(col.get(uriSensitiveCaseB)?.length, 0);

		assert.strictEqual(col.get(uriInSensitive)?.length, 1);
		assert.strictEqual(col.get(uriInSensitiveUpper)?.length, 1);

		// languages.getDiagnostics honours casing
		assert.strictEqual(diags.getDiagnostics(uriSensitive)?.length, 1);
		assert.strictEqual(diags.getDiagnostics(uriSensitiveCaseB)?.length, 0);

		assert.strictEqual(diags.getDiagnostics(uriInSensitive)?.length, 1);
		assert.strictEqual(diags.getDiagnostics(uriInSensitiveUpper)?.length, 1);


		const fromForEach: URI[] = [];
		col.forEach(uri => fromForEach.push(uri));
		assert.strictEqual(fromForEach.length, 2);
		assert.strictEqual(fromForEach[0].toString(), uriSensitive.toString());
		assert.strictEqual(fromForEach[1].toString(), uriInSensitive.toString());
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/browser/extHostDocumentContentProvider.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/browser/extHostDocumentContentProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { ExtHostDocumentsAndEditors } from '../../common/extHostDocumentsAndEditors.js';
import { SingleProxyRPCProtocol } from '../common/testRPCProtocol.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { ExtHostDocumentContentProvider } from '../../common/extHostDocumentContentProviders.js';
import { Emitter } from '../../../../base/common/event.js';
import { MainThreadDocumentContentProvidersShape } from '../../common/extHost.protocol.js';
import { timeout } from '../../../../base/common/async.js';
import { runWithFakedTimers } from '../../../../base/test/common/timeTravelScheduler.js';

suite('ExtHostDocumentContentProvider', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const resource = URI.parse('foo:bar');
	let documentContentProvider: ExtHostDocumentContentProvider;
	let mainThreadContentProvider: MainThreadDocumentContentProvidersShape;
	const changes: [uri: UriComponents, value: string][] = [];

	setup(() => {

		changes.length = 0;

		mainThreadContentProvider = new class implements MainThreadDocumentContentProvidersShape {
			$registerTextContentProvider(handle: number, scheme: string): void {

			}
			$unregisterTextContentProvider(handle: number): void {

			}
			async $onVirtualDocumentChange(uri: UriComponents, value: string): Promise<void> {
				await timeout(10);
				changes.push([uri, value]);
			}
			dispose(): void {
				throw new Error('Method not implemented.');
			}
		};

		const ehContext = SingleProxyRPCProtocol(mainThreadContentProvider);
		const documentsAndEditors = new ExtHostDocumentsAndEditors(ehContext, new NullLogService());
		documentsAndEditors.$acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				isDirty: false,
				languageId: 'foo',
				uri: resource,
				versionId: 1,
				lines: ['foo'],
				EOL: '\n',
				encoding: 'utf8'
			}]
		});
		documentContentProvider = new ExtHostDocumentContentProvider(ehContext, documentsAndEditors, new NullLogService());
	});

	test('TextDocumentContentProvider drops onDidChange events when they happen quickly #179711', async () => {
		await runWithFakedTimers({}, async function () {

			const emitter = new Emitter<URI>();
			const contents = ['X', 'Y'];
			let counter = 0;

			let stack = 0;

			const d = documentContentProvider.registerTextDocumentContentProvider(resource.scheme, {
				onDidChange: emitter.event,
				async provideTextDocumentContent(_uri) {
					assert.strictEqual(stack, 0);
					stack++;
					try {
						await timeout(0);
						return contents[counter++ % contents.length];
					} finally {
						stack--;
					}
				}
			});

			emitter.fire(resource);
			emitter.fire(resource);

			await timeout(100);

			assert.strictEqual(changes.length, 2);
			assert.strictEqual(changes[0][1], 'X');
			assert.strictEqual(changes[1][1], 'Y');

			d.dispose();
		});
	});


});
```

--------------------------------------------------------------------------------

````

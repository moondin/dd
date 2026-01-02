---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 501
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 501 of 552)

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

---[FILE: src/vs/workbench/services/configuration/test/common/configurationModels.test.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/test/common/configurationModels.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Registry } from '../../../../../platform/registry/common/platform.js';
import { StandaloneConfigurationModelParser, Configuration } from '../../common/configurationModels.js';
import { ConfigurationModelParser, ConfigurationModel, ConfigurationParseOptions } from '../../../../../platform/configuration/common/configurationModels.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../../platform/configuration/common/configurationRegistry.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { WorkspaceFolder } from '../../../../../platform/workspace/common/workspace.js';
import { URI } from '../../../../../base/common/uri.js';
import { Workspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';

suite('FolderSettingsModelParser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(() => {
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': 'FolderSettingsModelParser_1',
			'type': 'object',
			'properties': {
				'FolderSettingsModelParser.window': {
					'type': 'string',
					'default': 'isSet'
				},
				'FolderSettingsModelParser.resource': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.RESOURCE,
				},
				'FolderSettingsModelParser.resourceLanguage': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
				},
				'FolderSettingsModelParser.application': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.APPLICATION
				},
				'FolderSettingsModelParser.machine': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.MACHINE
				}
			}
		});
	});

	test('parse all folder settings', () => {
		const testObject = new ConfigurationModelParser('settings', new NullLogService());

		testObject.parse(JSON.stringify({ 'FolderSettingsModelParser.window': 'window', 'FolderSettingsModelParser.resource': 'resource', 'FolderSettingsModelParser.application': 'application', 'FolderSettingsModelParser.machine': 'executable' }), { scopes: [ConfigurationScope.RESOURCE, ConfigurationScope.WINDOW] });

		const expected = Object.create(null);
		expected['FolderSettingsModelParser'] = Object.create(null);
		expected['FolderSettingsModelParser']['window'] = 'window';
		expected['FolderSettingsModelParser']['resource'] = 'resource';
		assert.deepStrictEqual(testObject.configurationModel.contents, expected);
	});

	test('parse resource folder settings', () => {
		const testObject = new ConfigurationModelParser('settings', new NullLogService());

		testObject.parse(JSON.stringify({ 'FolderSettingsModelParser.window': 'window', 'FolderSettingsModelParser.resource': 'resource', 'FolderSettingsModelParser.application': 'application', 'FolderSettingsModelParser.machine': 'executable' }), { scopes: [ConfigurationScope.RESOURCE] });

		const expected = Object.create(null);
		expected['FolderSettingsModelParser'] = Object.create(null);
		expected['FolderSettingsModelParser']['resource'] = 'resource';
		assert.deepStrictEqual(testObject.configurationModel.contents, expected);
	});

	test('parse resource and resource language settings', () => {
		const testObject = new ConfigurationModelParser('settings', new NullLogService());

		testObject.parse(JSON.stringify({ '[json]': { 'FolderSettingsModelParser.window': 'window', 'FolderSettingsModelParser.resource': 'resource', 'FolderSettingsModelParser.resourceLanguage': 'resourceLanguage', 'FolderSettingsModelParser.application': 'application', 'FolderSettingsModelParser.machine': 'executable' } }), { scopes: [ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE] });

		const expected = Object.create(null);
		expected['FolderSettingsModelParser'] = Object.create(null);
		expected['FolderSettingsModelParser']['resource'] = 'resource';
		expected['FolderSettingsModelParser']['resourceLanguage'] = 'resourceLanguage';
		assert.deepStrictEqual(testObject.configurationModel.overrides, [{ 'contents': expected, 'identifiers': ['json'], 'keys': ['FolderSettingsModelParser.resource', 'FolderSettingsModelParser.resourceLanguage'] }]);
	});

	test('reparse folder settings excludes application and machine setting', () => {
		const parseOptions: ConfigurationParseOptions = { scopes: [ConfigurationScope.RESOURCE, ConfigurationScope.WINDOW] };
		const testObject = new ConfigurationModelParser('settings', new NullLogService());

		testObject.parse(JSON.stringify({ 'FolderSettingsModelParser.resource': 'resource', 'FolderSettingsModelParser.anotherApplicationSetting': 'executable' }), parseOptions);

		let expected = Object.create(null);
		expected['FolderSettingsModelParser'] = Object.create(null);
		expected['FolderSettingsModelParser']['resource'] = 'resource';
		expected['FolderSettingsModelParser']['anotherApplicationSetting'] = 'executable';
		assert.deepStrictEqual(testObject.configurationModel.contents, expected);

		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
		configurationRegistry.registerConfiguration({
			'id': 'FolderSettingsModelParser_2',
			'type': 'object',
			'properties': {
				'FolderSettingsModelParser.anotherApplicationSetting': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.APPLICATION
				},
				'FolderSettingsModelParser.anotherMachineSetting': {
					'type': 'string',
					'default': 'isSet',
					scope: ConfigurationScope.MACHINE
				}
			}
		});

		testObject.reparse(parseOptions);

		expected = Object.create(null);
		expected['FolderSettingsModelParser'] = Object.create(null);
		expected['FolderSettingsModelParser']['resource'] = 'resource';
		assert.deepStrictEqual(testObject.configurationModel.contents, expected);
	});

});

suite('StandaloneConfigurationModelParser', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse tasks stand alone configuration model', () => {
		const testObject = new StandaloneConfigurationModelParser('tasks', 'tasks', new NullLogService());

		testObject.parse(JSON.stringify({ 'version': '1.1.1', 'tasks': [] }));

		const expected = Object.create(null);
		expected['tasks'] = Object.create(null);
		expected['tasks']['version'] = '1.1.1';
		expected['tasks']['tasks'] = [];
		assert.deepStrictEqual(testObject.configurationModel.contents, expected);
	});

});

suite('Workspace Configuration', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const defaultConfigurationModel = toConfigurationModel({
		'editor.lineNumbers': 'on',
		'editor.fontSize': 12,
		'window.zoomLevel': 1,
		'[markdown]': {
			'editor.wordWrap': 'off'
		},
		'window.title': 'custom',
		'workbench.enableTabs': false,
		'editor.insertSpaces': true
	});

	test('Test compare same configurations', () => {
		const workspace = new Workspace('a', [new WorkspaceFolder({ index: 0, name: 'a', uri: URI.file('folder1') }), new WorkspaceFolder({ index: 1, name: 'b', uri: URI.file('folder2') }), new WorkspaceFolder({ index: 2, name: 'c', uri: URI.file('folder3') })]);
		const configuration1 = new Configuration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), workspace, new NullLogService());
		configuration1.updateDefaultConfiguration(defaultConfigurationModel);
		configuration1.updateLocalUserConfiguration(toConfigurationModel({ 'window.title': 'native', '[typescript]': { 'editor.insertSpaces': false } }));
		configuration1.updateWorkspaceConfiguration(toConfigurationModel({ 'editor.lineNumbers': 'on' }));
		configuration1.updateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'editor.fontSize': 14 }));
		configuration1.updateFolderConfiguration(URI.file('folder2'), toConfigurationModel({ 'editor.wordWrap': 'on' }));

		const configuration2 = new Configuration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), workspace, new NullLogService());
		configuration2.updateDefaultConfiguration(defaultConfigurationModel);
		configuration2.updateLocalUserConfiguration(toConfigurationModel({ 'window.title': 'native', '[typescript]': { 'editor.insertSpaces': false } }));
		configuration2.updateWorkspaceConfiguration(toConfigurationModel({ 'editor.lineNumbers': 'on' }));
		configuration2.updateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'editor.fontSize': 14 }));
		configuration2.updateFolderConfiguration(URI.file('folder2'), toConfigurationModel({ 'editor.wordWrap': 'on' }));

		const actual = configuration2.compare(configuration1);

		assert.deepStrictEqual(actual, { keys: [], overrides: [] });
	});

	test('Test compare different configurations', () => {
		const workspace = new Workspace('a', [new WorkspaceFolder({ index: 0, name: 'a', uri: URI.file('folder1') }), new WorkspaceFolder({ index: 1, name: 'b', uri: URI.file('folder2') }), new WorkspaceFolder({ index: 2, name: 'c', uri: URI.file('folder3') })]);
		const configuration1 = new Configuration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), workspace, new NullLogService());
		configuration1.updateDefaultConfiguration(defaultConfigurationModel);
		configuration1.updateLocalUserConfiguration(toConfigurationModel({ 'window.title': 'native', '[typescript]': { 'editor.insertSpaces': false } }));
		configuration1.updateWorkspaceConfiguration(toConfigurationModel({ 'editor.lineNumbers': 'on' }));
		configuration1.updateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'editor.fontSize': 14 }));
		configuration1.updateFolderConfiguration(URI.file('folder2'), toConfigurationModel({ 'editor.wordWrap': 'on' }));

		const configuration2 = new Configuration(ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), ConfigurationModel.createEmptyModel(new NullLogService()), new ResourceMap<ConfigurationModel>(), workspace, new NullLogService());
		configuration2.updateDefaultConfiguration(defaultConfigurationModel);
		configuration2.updateLocalUserConfiguration(toConfigurationModel({ 'workbench.enableTabs': true, '[typescript]': { 'editor.insertSpaces': true } }));
		configuration2.updateWorkspaceConfiguration(toConfigurationModel({ 'editor.fontSize': 11 }));
		configuration2.updateFolderConfiguration(URI.file('folder1'), toConfigurationModel({ 'editor.insertSpaces': true }));
		configuration2.updateFolderConfiguration(URI.file('folder2'), toConfigurationModel({
			'[markdown]': {
				'editor.wordWrap': 'on',
				'editor.lineNumbers': 'relative'
			},
		}));

		const actual = configuration2.compare(configuration1);

		assert.deepStrictEqual(actual, { keys: ['editor.wordWrap', 'editor.fontSize', '[markdown]', 'window.title', 'workbench.enableTabs', '[typescript]'], overrides: [['markdown', ['editor.lineNumbers', 'editor.wordWrap']], ['typescript', ['editor.insertSpaces']]] });
	});


});

function toConfigurationModel(obj: Record<string, unknown>): ConfigurationModel {
	const parser = new ConfigurationModelParser('test', new NullLogService());
	parser.parse(JSON.stringify(obj));
	return parser.configurationModel;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/test/common/testServices.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/test/common/testServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { IJSONEditingService, IJSONValue } from '../../common/jsonEditing.js';

export class TestJSONEditingService implements IJSONEditingService {
	_serviceBrand: undefined;

	async write(resource: URI, values: IJSONValue[], save: boolean): Promise<void> { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/browser/baseConfigurationResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/browser/baseConfigurationResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Queue } from '../../../../base/common/async.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { LRUCache } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { IProcessEnvironment } from '../../../../base/common/platform.js';
import * as Types from '../../../../base/common/types.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget, IConfigurationOverrides, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IInputOptions, IPickOptions, IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService, IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IPathService } from '../../path/common/pathService.js';
import { ConfiguredInput, VariableError, VariableKind } from '../common/configurationResolver.js';
import { ConfigurationResolverExpression, IResolvedValue } from '../common/configurationResolverExpression.js';
import { AbstractVariableResolverService } from '../common/variableResolver.js';

const LAST_INPUT_STORAGE_KEY = 'configResolveInputLru';
const LAST_INPUT_CACHE_SIZE = 5;

export abstract class BaseConfigurationResolverService extends AbstractVariableResolverService {

	static readonly INPUT_OR_COMMAND_VARIABLES_PATTERN = /\${((input|command):(.*?))}/g;

	private userInputAccessQueue = new Queue<string | IQuickPickItem | undefined>();

	constructor(
		context: {
			getAppRoot: () => string | undefined;
			getExecPath: () => string | undefined;
		},
		envVariablesPromise: Promise<IProcessEnvironment>,
		editorService: IEditorService,
		private readonly configurationService: IConfigurationService,
		private readonly commandService: ICommandService,
		workspaceContextService: IWorkspaceContextService,
		private readonly quickInputService: IQuickInputService,
		private readonly labelService: ILabelService,
		private readonly pathService: IPathService,
		extensionService: IExtensionService,
		private readonly storageService: IStorageService,
	) {
		super({
			getFolderUri: (folderName: string): uri | undefined => {
				const folder = workspaceContextService.getWorkspace().folders.filter(f => f.name === folderName).pop();
				return folder ? folder.uri : undefined;
			},
			getWorkspaceFolderCount: (): number => {
				return workspaceContextService.getWorkspace().folders.length;
			},
			getConfigurationValue: (folderUri: uri | undefined, section: string): string | undefined => {
				return configurationService.getValue<string>(section, folderUri ? { resource: folderUri } : {});
			},
			getAppRoot: (): string | undefined => {
				return context.getAppRoot();
			},
			getExecPath: (): string | undefined => {
				return context.getExecPath();
			},
			getFilePath: (): string | undefined => {
				const fileResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, {
					supportSideBySide: SideBySideEditor.PRIMARY,
					filterByScheme: [Schemas.file, Schemas.vscodeUserData, this.pathService.defaultUriScheme]
				});
				if (!fileResource) {
					return undefined;
				}
				return this.labelService.getUriLabel(fileResource, { noPrefix: true });
			},
			getWorkspaceFolderPathForFile: (): string | undefined => {
				const fileResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, {
					supportSideBySide: SideBySideEditor.PRIMARY,
					filterByScheme: [Schemas.file, Schemas.vscodeUserData, this.pathService.defaultUriScheme]
				});
				if (!fileResource) {
					return undefined;
				}
				const wsFolder = workspaceContextService.getWorkspaceFolder(fileResource);
				if (!wsFolder) {
					return undefined;
				}
				return this.labelService.getUriLabel(wsFolder.uri, { noPrefix: true });
			},
			getSelectedText: (): string | undefined => {
				const activeTextEditorControl = editorService.activeTextEditorControl;

				let activeControl: ICodeEditor | null = null;

				if (isCodeEditor(activeTextEditorControl)) {
					activeControl = activeTextEditorControl;
				} else if (isDiffEditor(activeTextEditorControl)) {
					const original = activeTextEditorControl.getOriginalEditor();
					const modified = activeTextEditorControl.getModifiedEditor();
					activeControl = original.hasWidgetFocus() ? original : modified;
				}

				const activeModel = activeControl?.getModel();
				const activeSelection = activeControl?.getSelection();
				if (activeModel && activeSelection) {
					return activeModel.getValueInRange(activeSelection);
				}
				return undefined;
			},
			getLineNumber: (): string | undefined => {
				const activeTextEditorControl = editorService.activeTextEditorControl;
				if (isCodeEditor(activeTextEditorControl)) {
					const selection = activeTextEditorControl.getSelection();
					if (selection) {
						const lineNumber = selection.positionLineNumber;
						return String(lineNumber);
					}
				}
				return undefined;
			},
			getColumnNumber: (): string | undefined => {
				const activeTextEditorControl = editorService.activeTextEditorControl;
				if (isCodeEditor(activeTextEditorControl)) {
					const selection = activeTextEditorControl.getSelection();
					if (selection) {
						const columnNumber = selection.positionColumn;
						return String(columnNumber);
					}
				}
				return undefined;
			},
			getExtension: id => {
				return extensionService.getExtension(id);
			},
		}, labelService, pathService.userHome().then(home => home.path), envVariablesPromise);

		this.resolvableVariables.add('command');
		this.resolvableVariables.add('input');
	}

	override async resolveWithInteractionReplace(folder: IWorkspaceFolderData | undefined, config: unknown, section?: string, variables?: IStringDictionary<string>, target?: ConfigurationTarget): Promise<unknown> {
		const parsed = ConfigurationResolverExpression.parse(config);
		await this.resolveWithInteraction(folder, parsed, section, variables, target);

		return parsed.toObject();
	}

	override async resolveWithInteraction(folder: IWorkspaceFolderData | undefined, config: unknown, section?: string, variableToCommandMap?: IStringDictionary<string>, target?: ConfigurationTarget): Promise<Map<string, string> | undefined> {
		const expr = ConfigurationResolverExpression.parse(config);

		// Get values for input variables from UI
		for (const variable of expr.unresolved()) {
			let result: IResolvedValue | undefined;

			// Command
			if (variable.name === 'command') {
				const commandId = (variableToCommandMap ? variableToCommandMap[variable.arg!] : undefined) || variable.arg!;
				const value = await this.commandService.executeCommand(commandId, expr.toObject());
				if (!Types.isUndefinedOrNull(value)) {
					if (typeof value !== 'string') {
						throw new VariableError(VariableKind.Command, localize('commandVariable.noStringType', "Cannot substitute command variable '{0}' because command did not return a result of type string.", commandId));
					}
					result = { value };
				}
			}
			// Input
			else if (variable.name === 'input') {
				result = await this.showUserInput(section!, variable.arg!, await this.resolveInputs(folder, section!, target), variableToCommandMap);
			}
			// Contributed variable
			else if (this._contributedVariables.has(variable.inner)) {
				result = { value: await this._contributedVariables.get(variable.inner)!() };
			}
			else {
				// Fallback to parent evaluation
				const resolvedValue = await this.evaluateSingleVariable(variable, folder?.uri);
				if (resolvedValue === undefined) {
					// Not something we can handle
					continue;
				}
				result = typeof resolvedValue === 'string' ? { value: resolvedValue } : resolvedValue;
			}

			if (result === undefined) {
				// Skip the entire flow if any input variable was canceled
				return undefined;
			}

			expr.resolve(variable, result);
		}

		return new Map(Iterable.map(expr.resolved(), ([key, value]) => [key.inner, value.value!]));
	}

	private async resolveInputs(folder: IWorkspaceFolderData | undefined, section: string, target?: ConfigurationTarget): Promise<ConfiguredInput[] | undefined> {
		if (!section) {
			return undefined;
		}

		// Look at workspace configuration
		let inputs: ConfiguredInput[] | undefined;
		const overrides: IConfigurationOverrides = folder ? { resource: folder.uri } : {};
		const result = this.configurationService.inspect<{ inputs?: ConfiguredInput[] }>(section, overrides);

		if (result) {
			switch (target) {
				case ConfigurationTarget.MEMORY: inputs = result.memoryValue?.inputs; break;
				case ConfigurationTarget.DEFAULT: inputs = result.defaultValue?.inputs; break;
				case ConfigurationTarget.USER: inputs = result.userValue?.inputs; break;
				case ConfigurationTarget.USER_LOCAL: inputs = result.userLocalValue?.inputs; break;
				case ConfigurationTarget.USER_REMOTE: inputs = result.userRemoteValue?.inputs; break;
				case ConfigurationTarget.APPLICATION: inputs = result.applicationValue?.inputs; break;
				case ConfigurationTarget.WORKSPACE: inputs = result.workspaceValue?.inputs; break;

				case ConfigurationTarget.WORKSPACE_FOLDER:
				default:
					inputs = result.workspaceFolderValue?.inputs;
					break;
			}
		}


		inputs ??= this.configurationService.getValue<{ inputs?: ConfiguredInput[] }>(section, overrides)?.inputs;

		return inputs;
	}

	private readInputLru(): LRUCache<string, string> {
		const contents = this.storageService.get(LAST_INPUT_STORAGE_KEY, StorageScope.WORKSPACE);
		const lru = new LRUCache<string, string>(LAST_INPUT_CACHE_SIZE);
		try {
			if (contents) {
				lru.fromJSON(JSON.parse(contents));
			}
		} catch {
			// ignored
		}

		return lru;
	}

	private storeInputLru(lru: LRUCache<string, string>): void {
		this.storageService.store(LAST_INPUT_STORAGE_KEY, JSON.stringify(lru.toJSON()), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}

	private async showUserInput(section: string, variable: string, inputInfos: ConfiguredInput[] | undefined, variableToCommandMap?: IStringDictionary<string>): Promise<IResolvedValue | undefined> {
		if (!inputInfos) {
			throw new VariableError(VariableKind.Input, localize('inputVariable.noInputSection', "Variable '{0}' must be defined in an '{1}' section of the debug or task configuration.", variable, 'inputs'));
		}

		// Find info for the given input variable
		const info = inputInfos.filter(item => item.id === variable).pop();
		if (info) {
			const missingAttribute = (attrName: string) => {
				throw new VariableError(VariableKind.Input, localize('inputVariable.missingAttribute', "Input variable '{0}' is of type '{1}' and must include '{2}'.", variable, info.type, attrName));
			};

			const defaultValueMap = this.readInputLru();
			const defaultValueKey = `${section}.${variable}`;
			const previousPickedValue = defaultValueMap.get(defaultValueKey);

			switch (info.type) {
				case 'promptString': {
					if (!Types.isString(info.description)) {
						missingAttribute('description');
					}
					const inputOptions: IInputOptions = { prompt: info.description, ignoreFocusLost: true, value: variableToCommandMap?.[`input:${variable}`] ?? previousPickedValue ?? info.default };
					if (info.password) {
						inputOptions.password = info.password;
					}
					return this.userInputAccessQueue.queue(() => this.quickInputService.input(inputOptions)).then(resolvedInput => {
						if (typeof resolvedInput === 'string' && !info.password) {
							this.storeInputLru(defaultValueMap.set(defaultValueKey, resolvedInput));
						}
						return resolvedInput !== undefined ? { value: resolvedInput as string, input: info } : undefined;
					});
				}

				case 'pickString': {
					if (!Types.isString(info.description)) {
						missingAttribute('description');
					}
					if (Array.isArray(info.options)) {
						for (const pickOption of info.options) {
							if (!Types.isString(pickOption) && !Types.isString(pickOption.value)) {
								missingAttribute('value');
							}
						}
					} else {
						missingAttribute('options');
					}

					interface PickStringItem extends IQuickPickItem {
						value: string;
					}
					const picks = new Array<PickStringItem>();
					for (const pickOption of info.options) {
						const value = Types.isString(pickOption) ? pickOption : pickOption.value;
						const label = Types.isString(pickOption) ? undefined : pickOption.label;

						const item: PickStringItem = {
							label: label ? `${label}: ${value}` : value,
							value: value
						};

						const topValue = variableToCommandMap?.[`input:${variable}`] ?? previousPickedValue ?? info.default;
						if (value === info.default) {
							item.description = localize('inputVariable.defaultInputValue', "(Default)");
							picks.unshift(item);
						} else if (value === topValue) {
							picks.unshift(item);
						} else {
							picks.push(item);
						}
					}

					const pickOptions: IPickOptions<PickStringItem> = { placeHolder: info.description, matchOnDetail: true, ignoreFocusLost: true };
					return this.userInputAccessQueue.queue(() => this.quickInputService.pick(picks, pickOptions, undefined)).then(resolvedInput => {
						if (resolvedInput) {
							const value = (resolvedInput as PickStringItem).value;
							this.storeInputLru(defaultValueMap.set(defaultValueKey, value));
							return { value, input: info };
						}
						return undefined;
					});
				}

				case 'command': {
					if (!Types.isString(info.command)) {
						missingAttribute('command');
					}
					return this.userInputAccessQueue.queue(() => this.commandService.executeCommand<string>(info.command, info.args)).then(result => {
						if (typeof result === 'string' || Types.isUndefinedOrNull(result)) {
							return { value: result, input: info };
						}
						throw new VariableError(VariableKind.Input, localize('inputVariable.command.noStringType', "Cannot substitute input variable '{0}' because command '{1}' did not return a result of type string.", variable, info.command));
					});
				}

				default:
					throw new VariableError(VariableKind.Input, localize('inputVariable.unknownType', "Input variable '{0}' can only be of type 'promptString', 'pickString', or 'command'.", variable));
			}
		}

		throw new VariableError(VariableKind.Input, localize('inputVariable.undefinedVariable', "Undefined input variable '{0}' encountered. Remove or define '{0}' to continue.", variable));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/browser/configurationResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/browser/configurationResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { BaseConfigurationResolverService } from './baseConfigurationResolverService.js';
import { IConfigurationResolverService } from '../common/configurationResolver.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IPathService } from '../../path/common/pathService.js';

export class ConfigurationResolverService extends BaseConfigurationResolverService {

	constructor(
		@IEditorService editorService: IEditorService,
		@IConfigurationService configurationService: IConfigurationService,
		@ICommandService commandService: ICommandService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IQuickInputService quickInputService: IQuickInputService,
		@ILabelService labelService: ILabelService,
		@IPathService pathService: IPathService,
		@IExtensionService extensionService: IExtensionService,
		@IStorageService storageService: IStorageService,
	) {
		super({ getAppRoot: () => undefined, getExecPath: () => undefined },
			Promise.resolve(Object.create(null)), editorService, configurationService,
			commandService, workspaceContextService, quickInputService, labelService, pathService, extensionService, storageService);
	}
}

registerSingleton(IConfigurationResolverService, ConfigurationResolverService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/common/configurationResolver.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/common/configurationResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { ErrorNoTelemetry } from '../../../../base/common/errors.js';
import { IProcessEnvironment } from '../../../../base/common/platform.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { ConfigurationResolverExpression } from './configurationResolverExpression.js';

export const IConfigurationResolverService = createDecorator<IConfigurationResolverService>('configurationResolverService');

export interface IConfigurationResolverService {
	readonly _serviceBrand: undefined;

	/** Variables the resolver is able to resolve. */
	readonly resolvableVariables: ReadonlySet<string>;

	resolveWithEnvironment(environment: IProcessEnvironment, folder: IWorkspaceFolderData | undefined, value: string): Promise<string>;

	/**
	 * Recursively resolves all variables in the given config and returns a copy of it with substituted values.
	 * Command variables are only substituted if a "commandValueMapping" dictionary is given and if it contains an entry for the command.
	 */
	resolveAsync<T>(folder: IWorkspaceFolderData | undefined, config: T): Promise<T extends ConfigurationResolverExpression<infer R> ? R : T>;

	/**
	 * Recursively resolves all variables (including commands and user input) in the given config and returns a copy of it with substituted values.
	 * If a "variables" dictionary (with names -> command ids) is given, command variables are first mapped through it before being resolved.
	 *
	 * @param section For example, 'tasks' or 'debug'. Used for resolving inputs.
	 * @param variables Aliases for commands.
	 */
	resolveWithInteractionReplace(folder: IWorkspaceFolderData | undefined, config: unknown, section?: string, variables?: IStringDictionary<string>, target?: ConfigurationTarget): Promise<any>;

	/**
	 * Similar to resolveWithInteractionReplace, except without the replace. Returns a map of variables and their resolution.
	 * Keys in the map will be of the format input:variableName or command:variableName.
	 */
	resolveWithInteraction(folder: IWorkspaceFolderData | undefined, config: unknown, section?: string, variables?: IStringDictionary<string>, target?: ConfigurationTarget): Promise<Map<string, string> | undefined>;

	/**
	 * Contributes a variable that can be resolved later. Consumers that use resolveAny, resolveWithInteraction,
	 * and resolveWithInteractionReplace will have contributed variables resolved.
	 */
	contributeVariable(variable: string, resolution: () => Promise<string | undefined>): void;
}

interface PromptStringInputInfo {
	id: string;
	type: 'promptString';
	description: string;
	default?: string;
	password?: boolean;
}

interface PickStringInputInfo {
	id: string;
	type: 'pickString';
	description: string;
	options: (string | { value: string; label?: string })[];
	default?: string;
}

interface CommandInputInfo {
	id: string;
	type: 'command';
	command: string;
	args?: any;
}

export type ConfiguredInput = PromptStringInputInfo | PickStringInputInfo | CommandInputInfo;

export enum VariableKind {
	Unknown = 'unknown',

	Env = 'env',
	Config = 'config',
	Command = 'command',
	Input = 'input',
	ExtensionInstallFolder = 'extensionInstallFolder',

	WorkspaceFolder = 'workspaceFolder',
	Cwd = 'cwd',
	WorkspaceFolderBasename = 'workspaceFolderBasename',
	UserHome = 'userHome',
	LineNumber = 'lineNumber',
	ColumnNumber = 'columnNumber',
	SelectedText = 'selectedText',
	File = 'file',
	FileWorkspaceFolder = 'fileWorkspaceFolder',
	FileWorkspaceFolderBasename = 'fileWorkspaceFolderBasename',
	RelativeFile = 'relativeFile',
	RelativeFileDirname = 'relativeFileDirname',
	FileDirname = 'fileDirname',
	FileExtname = 'fileExtname',
	FileBasename = 'fileBasename',
	FileBasenameNoExtension = 'fileBasenameNoExtension',
	FileDirnameBasename = 'fileDirnameBasename',
	ExecPath = 'execPath',
	ExecInstallFolder = 'execInstallFolder',
	PathSeparator = 'pathSeparator',
	PathSeparatorAlias = '/'
}

export const allVariableKinds = Object.values(VariableKind).filter((value): value is VariableKind => typeof value === 'string');

export class VariableError extends ErrorNoTelemetry {
	constructor(public readonly variable: VariableKind, message?: string) {
		super(message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/common/configurationResolverExpression.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/common/configurationResolverExpression.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../../base/common/iterator.js';
import { isLinux, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { ConfiguredInput } from './configurationResolver.js';

/** A replacement found in the object, as ${name} or ${name:arg} */
export type Replacement = {
	/** ${name:arg} */
	id: string;
	/** The `name:arg` in ${name:arg} */
	inner: string;
	/** The `name` in ${name:arg} */
	name: string;
	/** The `arg` in ${name:arg} */
	arg?: string;
};

interface IConfigurationResolverExpression<T> {
	/**
	 * Gets the replacements which have not yet been
	 * resolved.
	 */
	unresolved(): Iterable<Replacement>;

	/**
	 * Gets the replacements which have been resolved.
	 */
	resolved(): Iterable<[Replacement, IResolvedValue]>;

	/**
	 * Resolves a replacement into the string value.
	 * If the value is undefined, the original variable text will be preserved.
	 */
	resolve(replacement: Replacement, data: string | IResolvedValue): void;

	/**
	 * Returns the complete object. Any unresolved replacements are left intact.
	 */
	toObject(): T;
}

type PropertyLocation = {
	object: any;
	propertyName: string | number;
	replaceKeyName?: boolean;
};

export interface IResolvedValue {
	value: string | undefined;

	/** Present when the variable is resolved from an input field. */
	input?: ConfiguredInput;
}

interface IReplacementLocation {
	replacement: Replacement;
	locations: PropertyLocation[];
	resolved?: IResolvedValue;
}

export class ConfigurationResolverExpression<T> implements IConfigurationResolverExpression<T> {
	public static readonly VARIABLE_LHS = '${';

	private readonly locations = new Map<string, IReplacementLocation>();
	private root: T;
	private stringRoot: boolean;
	/**
	 * Callbacks when a new replacement is made, so that nested resolutions from
	 * `expr.unresolved()` can be fulfilled in the same iteration.
	 */
	private newReplacementNotifiers = new Set<(r: Replacement) => void>();

	private constructor(object: T) {
		// If the input is a string, wrap it in an object so we can use the same logic
		if (typeof object === 'string') {
			this.stringRoot = true;
			// eslint-disable-next-line local/code-no-any-casts
			this.root = { value: object } as any;
		} else {
			this.stringRoot = false;
			this.root = structuredClone(object);
		}
	}

	/**
	 * Creates a new {@link ConfigurationResolverExpression} from an object.
	 * Note that platform-specific keys (i.e. `windows`, `osx`, `linux`) are
	 * applied during parsing.
	 */
	public static parse<T>(object: T): ConfigurationResolverExpression<T> {
		if (object instanceof ConfigurationResolverExpression) {
			return object;
		}

		const expr = new ConfigurationResolverExpression<T>(object);
		expr.applyPlatformSpecificKeys();
		expr.parseObject(expr.root);
		return expr;
	}

	private applyPlatformSpecificKeys() {
		// eslint-disable-next-line local/code-no-any-casts
		const config = this.root as any; // already cloned by ctor, safe to change
		const key = isWindows ? 'windows' : isMacintosh ? 'osx' : isLinux ? 'linux' : undefined;

		if (key && config && typeof config === 'object' && config.hasOwnProperty(key)) {
			Object.keys(config[key]).forEach(k => config[k] = config[key][k]);
		}

		delete config.windows;
		delete config.osx;
		delete config.linux;
	}

	private parseVariable(str: string, start: number): { replacement: Replacement; end: number } | undefined {
		if (str[start] !== '$' || str[start + 1] !== '{') {
			return undefined;
		}

		let end = start + 2;
		let braceCount = 1;
		while (end < str.length) {
			if (str[end] === '{') {
				braceCount++;
			} else if (str[end] === '}') {
				braceCount--;
				if (braceCount === 0) {
					break;
				}
			}
			end++;
		}

		if (braceCount !== 0) {
			return undefined;
		}

		const id = str.slice(start, end + 1);
		const inner = str.substring(start + 2, end);
		const colonIdx = inner.indexOf(':');
		if (colonIdx === -1) {
			return { replacement: { id, name: inner, inner }, end };
		}

		return {
			replacement: {
				id,
				inner,
				name: inner.slice(0, colonIdx),
				arg: inner.slice(colonIdx + 1)
			},
			end
		};
	}

	private parseObject(obj: any): void {
		if (typeof obj !== 'object' || obj === null) {
			return;
		}

		if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				const value = obj[i];
				if (typeof value === 'string') {
					this.parseString(obj, i, value);
				} else {
					this.parseObject(value);
				}
			}
			return;
		}

		for (const [key, value] of Object.entries(obj)) {
			this.parseString(obj, key, key, true); // parse key

			if (typeof value === 'string') {
				this.parseString(obj, key, value);
			} else {
				this.parseObject(value);
			}
		}
	}

	private parseString(object: any, propertyName: string | number, value: string, replaceKeyName?: boolean, replacementPath?: string[]): void {
		let pos = 0;
		while (pos < value.length) {
			const match = value.indexOf('${', pos);
			if (match === -1) {
				break;
			}
			const parsed = this.parseVariable(value, match);
			if (parsed) {
				pos = parsed.end + 1;
				if (replacementPath?.includes(parsed.replacement.id)) {
					continue;
				}

				const locations = this.locations.get(parsed.replacement.id) || { locations: [], replacement: parsed.replacement };
				const newLocation: PropertyLocation = { object, propertyName, replaceKeyName };
				locations.locations.push(newLocation);
				this.locations.set(parsed.replacement.id, locations);

				if (locations.resolved) {
					this._resolveAtLocation(parsed.replacement, newLocation, locations.resolved, replacementPath);
				} else {
					this.newReplacementNotifiers.forEach(n => n(parsed.replacement));
				}
			} else {
				pos = match + 2;
			}
		}
	}

	public *unresolved(): Iterable<Replacement> {
		const newReplacements = new Map<string, Replacement>();
		const notifier = (replacement: Replacement) => {
			newReplacements.set(replacement.id, replacement);
		};

		for (const location of this.locations.values()) {
			if (location.resolved === undefined) {
				newReplacements.set(location.replacement.id, location.replacement);
			}
		}

		this.newReplacementNotifiers.add(notifier);

		while (true) {
			const next = Iterable.first(newReplacements);
			if (!next) {
				break;
			}

			const [key, value] = next;
			yield value;
			newReplacements.delete(key);
		}

		this.newReplacementNotifiers.delete(notifier);
	}

	public resolved(): Iterable<[Replacement, IResolvedValue]> {
		return Iterable.map(Iterable.filter(this.locations.values(), l => !!l.resolved), l => [l.replacement, l.resolved!]);
	}

	public resolve(replacement: Replacement, data: string | IResolvedValue): void {
		if (typeof data !== 'object') {
			data = { value: String(data) };
		}

		const location = this.locations.get(replacement.id);
		if (!location) {
			return;
		}

		location.resolved = data;

		if (data.value !== undefined) {
			for (const l of location.locations || Iterable.empty()) {
				this._resolveAtLocation(replacement, l, data);
			}
		}
	}

	private _resolveAtLocation(replacement: Replacement, { replaceKeyName, propertyName, object }: PropertyLocation, data: IResolvedValue, path: string[] = []) {
		if (data.value === undefined) {
			return;
		}

		// avoid recursive resolution, e.g. ${env:FOO} -> ${env:BAR}=${env:FOO}
		path.push(replacement.id);

		// note: in nested `this.parseString`, parse only the new substring for any replacements, don't reparse the whole string
		if (replaceKeyName && typeof propertyName === 'string') {
			const value = object[propertyName];
			const newKey = propertyName.replaceAll(replacement.id, data.value);
			delete object[propertyName];
			object[newKey] = value;
			this._renameKeyInLocations(object, propertyName, newKey);
			this.parseString(object, newKey, data.value, true, path);
		} else {
			object[propertyName] = object[propertyName].replaceAll(replacement.id, data.value);
			this.parseString(object, propertyName, data.value, false, path);
		}

		path.pop();
	}

	private _renameKeyInLocations(obj: object, oldKey: string, newKey: string) {
		for (const location of this.locations.values()) {
			for (const loc of location.locations) {
				if (loc.object === obj && loc.propertyName === oldKey) {
					loc.propertyName = newKey;
				}
			}
		}
	}

	public toObject(): T {
		// If we wrapped a string, unwrap it
		if (this.stringRoot) {
			// eslint-disable-next-line local/code-no-any-casts
			return (this.root as any).value as T;
		}

		return this.root;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/common/configurationResolverSchema.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/common/configurationResolverSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

const idDescription = nls.localize('JsonSchema.input.id', "The input's id is used to associate an input with a variable of the form ${input:id}.");
const typeDescription = nls.localize('JsonSchema.input.type', "The type of user input prompt to use.");
const descriptionDescription = nls.localize('JsonSchema.input.description', "The description is shown when the user is prompted for input.");
const defaultDescription = nls.localize('JsonSchema.input.default', "The default value for the input.");


export const inputsSchema: IJSONSchema = {
	definitions: {
		inputs: {
			type: 'array',
			description: nls.localize('JsonSchema.inputs', 'User inputs. Used for defining user input prompts, such as free string input or a choice from several options.'),
			items: {
				oneOf: [
					{
						type: 'object',
						required: ['id', 'type', 'description'],
						additionalProperties: false,
						properties: {
							id: {
								type: 'string',
								description: idDescription
							},
							type: {
								type: 'string',
								description: typeDescription,
								enum: ['promptString'],
								enumDescriptions: [
									nls.localize('JsonSchema.input.type.promptString', "The 'promptString' type opens an input box to ask the user for input."),
								]
							},
							description: {
								type: 'string',
								description: descriptionDescription
							},
							default: {
								type: 'string',
								description: defaultDescription
							},
							password: {
								type: 'boolean',
								description: nls.localize('JsonSchema.input.password', "Controls if a password input is shown. Password input hides the typed text."),
							},
						}
					},
					{
						type: 'object',
						required: ['id', 'type', 'description', 'options'],
						additionalProperties: false,
						properties: {
							id: {
								type: 'string',
								description: idDescription
							},
							type: {
								type: 'string',
								description: typeDescription,
								enum: ['pickString'],
								enumDescriptions: [
									nls.localize('JsonSchema.input.type.pickString', "The 'pickString' type shows a selection list."),
								]
							},
							description: {
								type: 'string',
								description: descriptionDescription
							},
							default: {
								type: 'string',
								description: defaultDescription
							},
							options: {
								type: 'array',
								description: nls.localize('JsonSchema.input.options', "An array of strings that defines the options for a quick pick."),
								items: {
									oneOf: [
										{
											type: 'string'
										},
										{
											type: 'object',
											required: ['value'],
											additionalProperties: false,
											properties: {
												label: {
													type: 'string',
													description: nls.localize('JsonSchema.input.pickString.optionLabel', "Label for the option.")
												},
												value: {
													type: 'string',
													description: nls.localize('JsonSchema.input.pickString.optionValue', "Value for the option.")
												}
											}
										}
									]
								}
							}
						}
					},
					{
						type: 'object',
						required: ['id', 'type', 'command'],
						additionalProperties: false,
						properties: {
							id: {
								type: 'string',
								description: idDescription
							},
							type: {
								type: 'string',
								description: typeDescription,
								enum: ['command'],
								enumDescriptions: [
									nls.localize('JsonSchema.input.type.command', "The 'command' type executes a command."),
								]
							},
							command: {
								type: 'string',
								description: nls.localize('JsonSchema.input.command.command', "The command to execute for this input variable.")
							},
							args: {
								oneOf: [
									{
										type: 'object',
										description: nls.localize('JsonSchema.input.command.args', "Optional arguments passed to the command.")
									},
									{
										type: 'array',
										description: nls.localize('JsonSchema.input.command.args', "Optional arguments passed to the command.")
									},
									{
										type: 'string',
										description: nls.localize('JsonSchema.input.command.args', "Optional arguments passed to the command.")
									}
								]
							}
						}
					}
				]
			}
		}
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/common/configurationResolverUtils.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/common/configurationResolverUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

export function applyDeprecatedVariableMessage(schema: IJSONSchema) {
	schema.pattern = schema.pattern || '^(?!.*\\$\\{(env|config|command)\\.)';
	schema.patternErrorMessage = schema.patternErrorMessage ||
		nls.localize('deprecatedVariables', "'env.', 'config.' and 'command.' are deprecated, use 'env:', 'config:' and 'command:' instead.");
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/common/variableResolver.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/common/variableResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../../base/common/collections.js';
import { normalizeDriveLetter } from '../../../../base/common/labels.js';
import * as paths from '../../../../base/common/path.js';
import { IProcessEnvironment, isWindows } from '../../../../base/common/platform.js';
import * as process from '../../../../base/common/process.js';
import * as types from '../../../../base/common/types.js';
import { URI as uri } from '../../../../base/common/uri.js';
import { localize } from '../../../../nls.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IWorkspaceFolderData } from '../../../../platform/workspace/common/workspace.js';
import { allVariableKinds, IConfigurationResolverService, VariableError, VariableKind } from './configurationResolver.js';
import { ConfigurationResolverExpression, IResolvedValue, Replacement } from './configurationResolverExpression.js';

interface IVariableResolveContext {
	getFolderUri(folderName: string): uri | undefined;
	getWorkspaceFolderCount(): number;
	getConfigurationValue(folderUri: uri | undefined, section: string): string | undefined;
	getAppRoot(): string | undefined;
	getExecPath(): string | undefined;
	getFilePath(): string | undefined;
	getWorkspaceFolderPathForFile?(): string | undefined;
	getSelectedText(): string | undefined;
	getLineNumber(): string | undefined;
	getColumnNumber(): string | undefined;
	getExtension(id: string): Promise<{ readonly extensionLocation: uri } | undefined>;
}

type Environment = { env: IProcessEnvironment | undefined; userHome: string | undefined };

export abstract class AbstractVariableResolverService implements IConfigurationResolverService {

	declare readonly _serviceBrand: undefined;

	private _context: IVariableResolveContext;
	private _labelService?: ILabelService;
	private _envVariablesPromise?: Promise<IProcessEnvironment>;
	private _userHomePromise?: Promise<string>;
	protected _contributedVariables: Map<string, () => Promise<string | undefined>> = new Map();

	public readonly resolvableVariables = new Set<string>(allVariableKinds);

	constructor(_context: IVariableResolveContext, _labelService?: ILabelService, _userHomePromise?: Promise<string>, _envVariablesPromise?: Promise<IProcessEnvironment>) {
		this._context = _context;
		this._labelService = _labelService;
		this._userHomePromise = _userHomePromise;
		if (_envVariablesPromise) {
			this._envVariablesPromise = _envVariablesPromise.then(envVariables => {
				return this.prepareEnv(envVariables);
			});
		}
	}

	private prepareEnv(envVariables: IProcessEnvironment): IProcessEnvironment {
		// windows env variables are case insensitive
		if (isWindows) {
			const ev: IProcessEnvironment = Object.create(null);
			Object.keys(envVariables).forEach(key => {
				ev[key.toLowerCase()] = envVariables[key];
			});
			return ev;
		}
		return envVariables;
	}

	public async resolveWithEnvironment(environment: IProcessEnvironment, folder: IWorkspaceFolderData | undefined, value: string): Promise<string> {
		const expr = ConfigurationResolverExpression.parse(value);

		for (const replacement of expr.unresolved()) {
			const resolvedValue = await this.evaluateSingleVariable(replacement, folder?.uri, environment);
			if (resolvedValue !== undefined) {
				expr.resolve(replacement, String(resolvedValue));
			}
		}

		return expr.toObject();
	}

	public async resolveAsync<T>(folder: IWorkspaceFolderData | undefined, config: T): Promise<T extends ConfigurationResolverExpression<infer R> ? R : T> {
		const expr = ConfigurationResolverExpression.parse(config);

		for (const replacement of expr.unresolved()) {
			const resolvedValue = await this.evaluateSingleVariable(replacement, folder?.uri);
			if (resolvedValue !== undefined) {
				expr.resolve(replacement, String(resolvedValue));
			}
		}

		return expr.toObject() as (T extends ConfigurationResolverExpression<infer R> ? R : T);
	}

	public resolveWithInteractionReplace(folder: IWorkspaceFolderData | undefined, config: unknown): Promise<unknown> {
		throw new Error('resolveWithInteractionReplace not implemented.');
	}

	public resolveWithInteraction(folder: IWorkspaceFolderData | undefined, config: unknown): Promise<Map<string, string> | undefined> {
		throw new Error('resolveWithInteraction not implemented.');
	}

	public contributeVariable(variable: string, resolution: () => Promise<string | undefined>): void {
		if (this._contributedVariables.has(variable)) {
			throw new Error('Variable ' + variable + ' is contributed twice.');
		} else {
			this.resolvableVariables.add(variable);
			this._contributedVariables.set(variable, resolution);
		}
	}

	private fsPath(displayUri: uri): string {
		return this._labelService ? this._labelService.getUriLabel(displayUri, { noPrefix: true }) : displayUri.fsPath;
	}

	protected async evaluateSingleVariable(replacement: Replacement, folderUri: uri | undefined, processEnvironment?: IProcessEnvironment, commandValueMapping?: IStringDictionary<IResolvedValue>): Promise<IResolvedValue | string | undefined> {


		const environment: Environment = {
			env: (processEnvironment !== undefined) ? this.prepareEnv(processEnvironment) : await this._envVariablesPromise,
			userHome: (processEnvironment !== undefined) ? undefined : await this._userHomePromise
		};

		const { name: variable, arg: argument } = replacement;

		// common error handling for all variables that require an open editor
		const getFilePath = (variableKind: VariableKind): string => {
			const filePath = this._context.getFilePath();
			if (filePath) {
				return normalizeDriveLetter(filePath);
			}
			throw new VariableError(variableKind, (localize('canNotResolveFile', "Variable {0} can not be resolved. Please open an editor.", replacement.id)));
		};

		// common error handling for all variables that require an open editor
		const getFolderPathForFile = (variableKind: VariableKind): string => {
			const filePath = getFilePath(variableKind);		// throws error if no editor open
			if (this._context.getWorkspaceFolderPathForFile) {
				const folderPath = this._context.getWorkspaceFolderPathForFile();
				if (folderPath) {
					return normalizeDriveLetter(folderPath);
				}
			}
			throw new VariableError(variableKind, localize('canNotResolveFolderForFile', "Variable {0}: can not find workspace folder of '{1}'.", replacement.id, paths.basename(filePath)));
		};

		// common error handling for all variables that require an open folder and accept a folder name argument
		const getFolderUri = (variableKind: VariableKind): uri => {
			if (argument) {
				const folder = this._context.getFolderUri(argument);
				if (folder) {
					return folder;
				}
				throw new VariableError(variableKind, localize('canNotFindFolder', "Variable {0} can not be resolved. No such folder '{1}'.", variableKind, argument));
			}

			if (folderUri) {
				return folderUri;
			}

			if (this._context.getWorkspaceFolderCount() > 1) {
				throw new VariableError(variableKind, localize('canNotResolveWorkspaceFolderMultiRoot', "Variable {0} can not be resolved in a multi folder workspace. Scope this variable using ':' and a workspace folder name.", variableKind));
			}
			throw new VariableError(variableKind, localize('canNotResolveWorkspaceFolder', "Variable {0} can not be resolved. Please open a folder.", variableKind));
		};

		switch (variable) {
			case 'env':
				if (argument) {
					if (environment.env) {
						const env = environment.env[isWindows ? argument.toLowerCase() : argument];
						if (types.isString(env)) {
							return env;
						}
					}
					return '';
				}
				throw new VariableError(VariableKind.Env, localize('missingEnvVarName', "Variable {0} can not be resolved because no environment variable name is given.", replacement.id));

			case 'config':
				if (argument) {
					const config = this._context.getConfigurationValue(folderUri, argument);
					if (types.isUndefinedOrNull(config)) {
						throw new VariableError(VariableKind.Config, localize('configNotFound', "Variable {0} can not be resolved because setting '{1}' not found.", replacement.id, argument));
					}
					if (types.isObject(config)) {
						throw new VariableError(VariableKind.Config, localize('configNoString', "Variable {0} can not be resolved because '{1}' is a structured value.", replacement.id, argument));
					}
					return config;
				}
				throw new VariableError(VariableKind.Config, localize('missingConfigName', "Variable {0} can not be resolved because no settings name is given.", replacement.id));

			case 'command':
				return this.resolveFromMap(VariableKind.Command, replacement.id, argument, commandValueMapping, 'command');

			case 'input':
				return this.resolveFromMap(VariableKind.Input, replacement.id, argument, commandValueMapping, 'input');

			case 'extensionInstallFolder':
				if (argument) {
					const ext = await this._context.getExtension(argument);
					if (!ext) {
						throw new VariableError(VariableKind.ExtensionInstallFolder, localize('extensionNotInstalled', "Variable {0} can not be resolved because the extension {1} is not installed.", replacement.id, argument));
					}
					return this.fsPath(ext.extensionLocation);
				}
				throw new VariableError(VariableKind.ExtensionInstallFolder, localize('missingExtensionName', "Variable {0} can not be resolved because no extension name is given.", replacement.id));

			default: {
				switch (variable) {
					case 'workspaceRoot':
					case 'workspaceFolder': {
						const uri = getFolderUri(VariableKind.WorkspaceFolder);
						return uri ? normalizeDriveLetter(this.fsPath(uri)) : undefined;
					}

					case 'cwd': {
						if (!folderUri && !argument) {
							return process.cwd();
						}
						const uri = getFolderUri(VariableKind.Cwd);
						return uri ? normalizeDriveLetter(this.fsPath(uri)) : undefined;
					}

					case 'workspaceRootFolderName':
					case 'workspaceFolderBasename': {
						const uri = getFolderUri(VariableKind.WorkspaceFolderBasename);
						return uri ? normalizeDriveLetter(paths.basename(this.fsPath(uri))) : undefined;
					}

					case 'userHome':
						if (environment.userHome) {
							return environment.userHome;
						}
						throw new VariableError(VariableKind.UserHome, localize('canNotResolveUserHome', "Variable {0} can not be resolved. UserHome path is not defined", replacement.id));

					case 'lineNumber': {
						const lineNumber = this._context.getLineNumber();
						if (lineNumber) {
							return lineNumber;
						}
						throw new VariableError(VariableKind.LineNumber, localize('canNotResolveLineNumber', "Variable {0} can not be resolved. Make sure to have a line selected in the active editor.", replacement.id));
					}

					case 'columnNumber': {
						const columnNumber = this._context.getColumnNumber();
						if (columnNumber) {
							return columnNumber;
						}
						throw new Error(localize('canNotResolveColumnNumber', "Variable {0} can not be resolved. Make sure to have a column selected in the active editor.", replacement.id));
					}

					case 'selectedText': {
						const selectedText = this._context.getSelectedText();
						if (selectedText) {
							return selectedText;
						}
						throw new VariableError(VariableKind.SelectedText, localize('canNotResolveSelectedText', "Variable {0} can not be resolved. Make sure to have some text selected in the active editor.", replacement.id));
					}

					case 'file':
						return getFilePath(VariableKind.File);

					case 'fileWorkspaceFolder':
						return getFolderPathForFile(VariableKind.FileWorkspaceFolder);

					case 'fileWorkspaceFolderBasename':
						return paths.basename(getFolderPathForFile(VariableKind.FileWorkspaceFolderBasename));

					case 'relativeFile':
						if (folderUri || argument) {
							return paths.relative(this.fsPath(getFolderUri(VariableKind.RelativeFile)), getFilePath(VariableKind.RelativeFile));
						}
						return getFilePath(VariableKind.RelativeFile);

					case 'relativeFileDirname': {
						const dirname = paths.dirname(getFilePath(VariableKind.RelativeFileDirname));
						if (folderUri || argument) {
							const relative = paths.relative(this.fsPath(getFolderUri(VariableKind.RelativeFileDirname)), dirname);
							return relative.length === 0 ? '.' : relative;
						}
						return dirname;
					}

					case 'fileDirname':
						return paths.dirname(getFilePath(VariableKind.FileDirname));

					case 'fileExtname':
						return paths.extname(getFilePath(VariableKind.FileExtname));

					case 'fileBasename':
						return paths.basename(getFilePath(VariableKind.FileBasename));

					case 'fileBasenameNoExtension': {
						const basename = paths.basename(getFilePath(VariableKind.FileBasenameNoExtension));
						return (basename.slice(0, basename.length - paths.extname(basename).length));
					}

					case 'fileDirnameBasename':
						return paths.basename(paths.dirname(getFilePath(VariableKind.FileDirnameBasename)));

					case 'execPath': {
						const ep = this._context.getExecPath();
						if (ep) {
							return ep;
						}
						return replacement.id;
					}

					case 'execInstallFolder': {
						const ar = this._context.getAppRoot();
						if (ar) {
							return ar;
						}
						return replacement.id;
					}

					case 'pathSeparator':
					case '/':
						return paths.sep;

					default: {
						try {
							return this.resolveFromMap(VariableKind.Unknown, replacement.id, argument, commandValueMapping, undefined);
						} catch {
							return replacement.id;
						}
					}
				}
			}
		}
	}

	private resolveFromMap(variableKind: VariableKind, match: string, argument: string | undefined, commandValueMapping: IStringDictionary<IResolvedValue> | undefined, prefix: string | undefined): string {
		if (argument && commandValueMapping) {
			const v = (prefix === undefined) ? commandValueMapping[argument] : commandValueMapping[prefix + ':' + argument];
			if (typeof v === 'string') {
				return v;
			}
			throw new VariableError(variableKind, localize('noValueForCommand', "Variable {0} can not be resolved because the command has no value.", match));
		}
		return match;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/electron-browser/configurationResolverService.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/electron-browser/configurationResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IConfigurationResolverService } from '../common/configurationResolver.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { BaseConfigurationResolverService } from '../browser/baseConfigurationResolverService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IShellEnvironmentService } from '../../environment/electron-browser/shellEnvironmentService.js';
import { IPathService } from '../../path/common/pathService.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class ConfigurationResolverService extends BaseConfigurationResolverService {

	constructor(
		@IEditorService editorService: IEditorService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService,
		@ICommandService commandService: ICommandService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@IQuickInputService quickInputService: IQuickInputService,
		@ILabelService labelService: ILabelService,
		@IShellEnvironmentService shellEnvironmentService: IShellEnvironmentService,
		@IPathService pathService: IPathService,
		@IExtensionService extensionService: IExtensionService,
		@IStorageService storageService: IStorageService,
	) {
		super({
			getAppRoot: (): string | undefined => {
				return environmentService.appRoot;
			},
			getExecPath: (): string | undefined => {
				return environmentService.execPath;
			},
		}, shellEnvironmentService.getShellEnv(), editorService, configurationService, commandService,
			workspaceContextService, quickInputService, labelService, pathService, extensionService, storageService);
	}
}

registerSingleton(IConfigurationResolverService, ConfigurationResolverService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configurationResolver/test/electron-browser/configurationResolverService.test.ts]---
Location: vscode-main/src/vs/workbench/services/configurationResolver/test/electron-browser/configurationResolverService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { stub } from 'sinon';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IPath, normalize } from '../../../../../base/common/path.js';
import * as platform from '../../../../../base/common/platform.js';
import { isLinux, isMacintosh, isWindows } from '../../../../../base/common/platform.js';
import { isObject } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { EditorType } from '../../../../../editor/common/editorCommon.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationOverrides, IConfigurationService, IConfigurationValue } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IExtensionDescription } from '../../../../../platform/extensions/common/extensions.js';
import { IFormatterChangeEvent, ILabelService, ResourceLabelFormatter, Verbosity } from '../../../../../platform/label/common/label.js';
import { IWorkspace, IWorkspaceFolder, IWorkspaceIdentifier, Workspace } from '../../../../../platform/workspace/common/workspace.js';
import { testWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { TestEditorService, TestQuickInputService } from '../../../../test/browser/workbenchTestServices.js';
import { TestContextService, TestExtensionService, TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IExtensionService } from '../../../extensions/common/extensions.js';
import { IPathService } from '../../../path/common/pathService.js';
import { BaseConfigurationResolverService } from '../../browser/baseConfigurationResolverService.js';
import { IConfigurationResolverService } from '../../common/configurationResolver.js';
import { ConfigurationResolverExpression } from '../../common/configurationResolverExpression.js';

const mockLineNumber = 10;
class TestEditorServiceWithActiveEditor extends TestEditorService {
	override get activeTextEditorControl(): any {
		return {
			getEditorType() {
				return EditorType.ICodeEditor;
			},
			getSelection() {
				return new Selection(mockLineNumber, 1, mockLineNumber, 10);
			}
		};
	}
	override get activeEditor(): any {
		return {
			get resource(): any {
				return URI.parse('file:///VSCode/workspaceLocation/file');
			}
		};
	}
}

class TestConfigurationResolverService extends BaseConfigurationResolverService {

}

const nullContext = {
	getAppRoot: () => undefined,
	getExecPath: () => undefined
};

suite('Configuration Resolver Service', () => {
	let configurationResolverService: IConfigurationResolverService | null;
	const envVariables: { [key: string]: string } = { key1: 'Value for key1', key2: 'Value for key2' };
	// let environmentService: MockWorkbenchEnvironmentService;
	let mockCommandService: MockCommandService;
	let editorService: TestEditorServiceWithActiveEditor;
	let containingWorkspace: Workspace;
	let workspace: IWorkspaceFolder;
	let quickInputService: TestQuickInputService;
	let labelService: MockLabelService;
	let pathService: MockPathService;
	let extensionService: IExtensionService;

	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		mockCommandService = new MockCommandService();
		editorService = disposables.add(new TestEditorServiceWithActiveEditor());
		quickInputService = new TestQuickInputService();
		// environmentService = new MockWorkbenchEnvironmentService(envVariables);
		labelService = new MockLabelService();
		pathService = new MockPathService();
		extensionService = new TestExtensionService();
		containingWorkspace = testWorkspace(URI.parse('file:///VSCode/workspaceLocation'));
		workspace = containingWorkspace.folders[0];
		configurationResolverService = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), editorService, new MockInputsConfigurationService(), mockCommandService, new TestContextService(containingWorkspace), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
	});

	teardown(() => {
		configurationResolverService = null;
	});

	test('substitute one', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('does not preserve platform config even when not matched', async () => {
		const obj = {
			program: 'osx.sh',
			windows: {
				program: 'windows.exe'
			},
			linux: {
				program: 'linux.sh'
			}
		};
		const config: any = await configurationResolverService!.resolveAsync(workspace, obj);

		const expected = isWindows ? 'windows.exe' : isMacintosh ? 'osx.sh' : isLinux ? 'linux.sh' : undefined;

		assert.strictEqual(config.windows, undefined);
		assert.strictEqual(config.osx, undefined);
		assert.strictEqual(config.linux, undefined);
		assert.strictEqual(config.program, expected);
	});

	test('apples platform specific config', async () => {
		const expected = isWindows ? 'windows.exe' : isMacintosh ? 'osx.sh' : isLinux ? 'linux.sh' : undefined;
		const obj = {
			windows: {
				program: 'windows.exe'
			},
			osx: {
				program: 'osx.sh'
			},
			linux: {
				program: 'linux.sh'
			}
		};
		const originalObj = JSON.stringify(obj);
		const config: any = await configurationResolverService!.resolveAsync(workspace, obj);

		assert.strictEqual(config.program, expected);
		assert.strictEqual(config.windows, undefined);
		assert.strictEqual(config.osx, undefined);
		assert.strictEqual(config.linux, undefined);
		assert.strictEqual(JSON.stringify(obj), originalObj); // did not mutate original
	});

	test('workspace folder with argument', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('workspace folder with invalid argument', async () => {
		await assert.rejects(async () => await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder:invalidLocation} xyz'));
	});

	test('workspace folder with undefined workspace folder', async () => {
		await assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder} xyz'));
	});

	test('workspace folder with argument and undefined workspace folder', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:workspaceLocation} xyz'), 'abc /VSCode/workspaceLocation xyz');
		}
	});

	test('workspace folder with invalid argument and undefined workspace folder', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${workspaceFolder:invalidLocation} xyz'));
	});

	test('workspace root folder name', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceRootFolderName} xyz'), 'abc workspaceLocation xyz');
	});

	test('current selected line number', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${lineNumber} xyz'), `abc ${mockLineNumber} xyz`);
	});

	test('relative file', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile} xyz'), 'abc file xyz');
	});

	test('relative file with argument', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile:workspaceLocation} xyz'), 'abc file xyz');
	});

	test('relative file with invalid argument', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(workspace, 'abc ${relativeFile:invalidLocation} xyz'));
	});

	test('relative file with undefined workspace folder', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile} xyz'), 'abc \\VSCode\\workspaceLocation\\file xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile} xyz'), 'abc /VSCode/workspaceLocation/file xyz');
		}
	});

	test('relative file with argument and undefined workspace folder', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile:workspaceLocation} xyz'), 'abc file xyz');
	});

	test('relative file with invalid argument and undefined workspace folder', () => {
		assert.rejects(async () => await configurationResolverService!.resolveAsync(undefined, 'abc ${relativeFile:invalidLocation} xyz'));
	});

	test('substitute many', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation');
		}
	});

	test('substitute one env variable', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} ${env:key1} xyz'), 'abc \\VSCode\\workspaceLocation Value for key1 xyz');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, 'abc ${workspaceFolder} ${env:key1} xyz'), 'abc /VSCode/workspaceLocation Value for key1 xyz');
		}
	});

	test('substitute many env variable', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for key1 - Value for key2');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation Value for key1 - Value for key2');
		}
	});

	test('disallows nested keys (#77289)', async () => {
		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} ${env:key1${env:key2}}'), 'Value for key1 ');
	});

	test('supports extensionDir', async () => {
		const getExtension = stub(extensionService, 'getExtension');
		getExtension.withArgs('publisher.extId').returns(Promise.resolve({ extensionLocation: URI.file('/some/path') } as IExtensionDescription));

		assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${extensionInstallFolder:publisher.extId}'), URI.file('/some/path').fsPath);
	});

	// test('substitute keys and values in object', () => {
	// 	const myObject = {
	// 		'${workspaceRootFolderName}': '${lineNumber}',
	// 		'hey ${env:key1} ': '${workspaceRootFolderName}'
	// 	};
	// 	assert.deepStrictEqual(configurationResolverService!.resolveAsync(workspace, myObject), {
	// 		'workspaceLocation': `${editorService.mockLineNumber}`,
	// 		'hey Value for key1 ': 'workspaceLocation'
	// 	});
	// });


	test('substitute one env variable using platform case sensitivity', async () => {
		if (platform.isWindows) {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} - ${env:Key1}'), 'Value for key1 - Value for key1');
		} else {
			assert.strictEqual(await configurationResolverService!.resolveAsync(workspace, '${env:key1} - ${env:Key1}'), 'Value for key1 - ');
		}
	});

	test('substitute one configuration variable', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} xyz'), 'abc foo xyz');
	});

	test('inlines an array (#245718)', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: ['foo', 'bar']
			},
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} xyz'), 'abc foo,bar xyz');
	});

	test('substitute configuration variable with undefined workspace folder', async () => {
		const configurationService: IConfigurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(undefined, 'abc ${config:editor.fontFamily} xyz'), 'abc foo xyz');
	});

	test('substitute many configuration variables', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo bar xyz');
	});

	test('substitute one env variable and a configuration variable', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		if (platform.isWindows) {
			assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${workspaceFolder} ${env:key1} xyz'), 'abc foo \\VSCode\\workspaceLocation Value for key1 xyz');
		} else {
			assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${workspaceFolder} ${env:key1} xyz'), 'abc foo /VSCode/workspaceLocation Value for key1 xyz');
		}
	});

	test('recursively resolve variables', async () => {
		const configurationService = new TestConfigurationService({
			key1: 'key1=${config:key2}',
			key2: 'key2=${config:key3}',
			key3: 'we did it!',
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, '${config:key1}'), 'key1=key2=we did it!');
	});

	test('substitute many env variable and a configuration variable', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		if (platform.isWindows) {
			assert.strictEqual(await service.resolveAsync(workspace, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), 'foo bar \\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for key1 - Value for key2');
		} else {
			assert.strictEqual(await service.resolveAsync(workspace, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceFolder} - ${workspaceFolder} ${env:key1} - ${env:key2}'), 'foo bar /VSCode/workspaceLocation - /VSCode/workspaceLocation Value for key1 - Value for key2');
		}
	});

	test('mixed types of configuration variables', async () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo',
				lineNumbers: 123,
				insertSpaces: false
			},
			terminal: {
				integrated: {
					fontFamily: 'bar'
				}
			},
			json: {
				schemas: [
					{
						fileMatch: [
							'/myfile',
							'/myOtherfile'
						],
						url: 'schemaURL'
					}
				]
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${config:editor.fontFamily} ${config:editor.lineNumbers} ${config:editor.insertSpaces} xyz'), 'abc foo 123 false xyz');
	});

	test('uses original variable as fallback', async () => {
		const configurationService = new TestConfigurationService({
			editor: {}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${unknownVariable} xyz'), 'abc ${unknownVariable} xyz');
		assert.strictEqual(await service.resolveAsync(workspace, 'abc ${env:unknownVariable} xyz'), 'abc  xyz');
	});

	test('configuration variables with invalid accessor', () => {
		const configurationService = new TestConfigurationService({
			editor: {
				fontFamily: 'foo'
			}
		});

		const service = new TestConfigurationResolverService(nullContext, Promise.resolve(envVariables), disposables.add(new TestEditorServiceWithActiveEditor()), configurationService, mockCommandService, new TestContextService(), quickInputService, labelService, pathService, extensionService, disposables.add(new TestStorageService()));

		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${env} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${env:} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor..fontFamily} xyz'));
		assert.rejects(async () => await service.resolveAsync(workspace, 'abc ${config:editor.none.none2} xyz'));
	});

	test('a single command variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:command1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('an old style command variable', () => {
		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};
		const commandVariables = Object.create(null);
		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('multiple new and old-style command variables', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'pid': '${command:command2}',
			'sourceMaps': false,
			'outDir': 'src/${command:command2}',
			'env': {
				'processId': '__${command:command2}__',
			}
		};
		const commandVariables = Object.create(null);
		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {
			const expected = {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'command1-result',
				'pid': 'command2-result',
				'sourceMaps': false,
				'outDir': 'src/command2-result',
				'env': {
					'processId': '__command2-result__',
				}
			};

			assert.deepStrictEqual(Object.keys(result), Object.keys(expected));
			Object.keys(result).forEach(property => {
				const expectedProperty = (expected as Record<string, unknown>)[property];
				if (isObject(result[property])) {
					assert.deepStrictEqual({ ...result[property] }, expectedProperty);
				} else {
					assert.deepStrictEqual(result[property], expectedProperty);
				}
			});
			assert.strictEqual(2, mockCommandService.callCount);
		});
	});

	test('a command variable that relies on resolved env vars', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${command:commandVariable1}',
			'value': '${env:key1}'
		};
		const commandVariables = Object.create(null);
		commandVariables['commandVariable1'] = 'command1';

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, undefined, commandVariables).then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'Value for key1',
				'value': 'Value for key1'
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('a single prompt input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'resolvedEnterinput1',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('a single pick input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input2}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'selectedPick',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('a single command input variable', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input4}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'arg for command',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(1, mockCommandService.callCount);
		});
	});

	test('several input variables and command', () => {

		const configuration = {
			'name': '${input:input3}',
			'type': '${command:command1}',
			'request': '${input:input1}',
			'processId': '${input:input2}',
			'command': '${input:input4}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'resolvedEnterinput3',
				'type': 'command1-result',
				'request': 'resolvedEnterinput1',
				'processId': 'selectedPick',
				'command': 'arg for command',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(2, mockCommandService.callCount);
		});
	});

	test('input variable with undefined workspace folder', () => {

		const configuration = {
			'name': 'Attach to Process',
			'type': 'node',
			'request': 'attach',
			'processId': '${input:input1}',
			'port': 5858,
			'sourceMaps': false,
			'outDir': null
		};

		return configurationResolverService!.resolveWithInteractionReplace(undefined, configuration, 'tasks').then(result => {

			assert.deepStrictEqual({ ...result }, {
				'name': 'Attach to Process',
				'type': 'node',
				'request': 'attach',
				'processId': 'resolvedEnterinput1',
				'port': 5858,
				'sourceMaps': false,
				'outDir': null
			});

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});

	test('contributed variable', () => {
		const buildTask = 'npm: compile';
		const variable = 'defaultBuildTask';
		const configuration = {
			'name': '${' + variable + '}',
		};
		configurationResolverService!.contributeVariable(variable, async () => { return buildTask; });
		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration).then(result => {
			assert.deepStrictEqual({ ...result }, {
				'name': `${buildTask}`
			});
		});
	});

	test('resolveWithEnvironment', async () => {
		const env = {
			'VAR_1': 'VAL_1',
			'VAR_2': 'VAL_2'
		};
		const configuration = 'echo ${env:VAR_1}${env:VAR_2}';
		const resolvedResult = await configurationResolverService!.resolveWithEnvironment({ ...env }, undefined, configuration);
		assert.deepStrictEqual(resolvedResult, 'echo VAL_1VAL_2');
	});

	test('substitution in object key', async () => {

		const configuration = {
			'name': 'Test',
			'mappings': {
				'pos1': 'value1',
				'${workspaceFolder}/test1': '${workspaceFolder}/test2',
				'pos3': 'value3'
			}
		};

		return configurationResolverService!.resolveWithInteractionReplace(workspace, configuration, 'tasks').then(result => {

			if (platform.isWindows) {
				assert.deepStrictEqual({ ...result }, {
					'name': 'Test',
					'mappings': {
						'pos1': 'value1',
						'\\VSCode\\workspaceLocation/test1': '\\VSCode\\workspaceLocation/test2',
						'pos3': 'value3'
					}
				});
			} else {
				assert.deepStrictEqual({ ...result }, {
					'name': 'Test',
					'mappings': {
						'pos1': 'value1',
						'/VSCode/workspaceLocation/test1': '/VSCode/workspaceLocation/test2',
						'pos3': 'value3'
					}
				});
			}

			assert.strictEqual(0, mockCommandService.callCount);
		});
	});
});


class MockCommandService implements ICommandService {

	public _serviceBrand: undefined;
	public callCount = 0;

	onWillExecuteCommand = () => Disposable.None;
	onDidExecuteCommand = () => Disposable.None;
	public executeCommand(commandId: string, ...args: any[]): Promise<any> {
		this.callCount++;

		let result = `${commandId}-result`;
		if (args.length >= 1) {
			if (args[0] && args[0].value) {
				result = args[0].value;
			}
		}

		return Promise.resolve(result);
	}
}

class MockLabelService implements ILabelService {
	_serviceBrand: undefined;
	getUriLabel(resource: URI, options?: { relative?: boolean | undefined; noPrefix?: boolean | undefined }): string {
		return normalize(resource.fsPath);
	}
	getUriBasenameLabel(resource: URI): string {
		throw new Error('Method not implemented.');
	}
	getWorkspaceLabel(workspace: URI | IWorkspaceIdentifier | IWorkspace, options?: { verbose: Verbosity }): string {
		throw new Error('Method not implemented.');
	}
	getHostLabel(scheme: string, authority?: string): string {
		throw new Error('Method not implemented.');
	}
	public getHostTooltip(): string | undefined {
		throw new Error('Method not implemented.');
	}
	getSeparator(scheme: string, authority?: string): '/' | '\\' {
		throw new Error('Method not implemented.');
	}
	registerFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	registerCachedFormatter(formatter: ResourceLabelFormatter): IDisposable {
		throw new Error('Method not implemented.');
	}
	readonly onDidChangeFormatters: Event<IFormatterChangeEvent> = new Emitter<IFormatterChangeEvent>().event;
}

class MockPathService implements IPathService {
	_serviceBrand: undefined;
	get path(): Promise<IPath> {
		throw new Error('Property not implemented');
	}
	defaultUriScheme: string = Schemas.file;
	fileURI(path: string): Promise<URI> {
		throw new Error('Method not implemented.');
	}
	userHome(options?: { preferLocal: boolean }): Promise<URI>;
	userHome(options: { preferLocal: true }): URI;
	userHome(options?: { preferLocal: boolean }): Promise<URI> | URI {
		const uri = URI.file('c:\\users\\username');
		return options?.preferLocal ? uri : Promise.resolve(uri);
	}
	hasValidBasename(resource: URI, basename?: string): Promise<boolean>;
	hasValidBasename(resource: URI, os: platform.OperatingSystem, basename?: string): boolean;
	hasValidBasename(resource: URI, arg2?: string | platform.OperatingSystem, name?: string): boolean | Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	resolvedUserHome: URI | undefined;
}

class MockInputsConfigurationService extends TestConfigurationService {
	public override getValue(arg1?: any, arg2?: any): any {
		let configuration;
		if (arg1 === 'tasks') {
			configuration = {
				inputs: [
					{
						id: 'input1',
						type: 'promptString',
						description: 'Enterinput1',
						default: 'default input1'
					},
					{
						id: 'input2',
						type: 'pickString',
						description: 'Enterinput1',
						default: 'option2',
						options: ['option1', 'option2', 'option3']
					},
					{
						id: 'input3',
						type: 'promptString',
						description: 'Enterinput3',
						default: 'default input3',
						provide: true,
						password: true
					},
					{
						id: 'input4',
						type: 'command',
						command: 'command1',
						args: {
							value: 'arg for command'
						}
					}
				]
			};
		}
		return configuration;
	}

	public override inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<T> {
		return {
			value: undefined,
			defaultValue: undefined,
			userValue: undefined,
			overrideIdentifiers: []
		};
	}
}

suite('ConfigurationResolverExpression', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse empty object', () => {
		const expr = ConfigurationResolverExpression.parse({});
		assert.strictEqual(Array.from(expr.unresolved()).length, 0);
		assert.deepStrictEqual(expr.toObject(), {});
	});

	test('parse simple string', () => {
		const expr = ConfigurationResolverExpression.parse({ value: '${env:HOME}' });
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');
	});

	test('parse string with argument and colon', () => {
		const expr = ConfigurationResolverExpression.parse({ value: '${config:path:to:value}' });
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'config');
		assert.strictEqual(unresolved[0].arg, 'path:to:value');
	});

	test('parse object with nested variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}',
			path: '${env:HOME}/folder',
			settings: {
				value: '${config:path}'
			},
			array: ['${env:TERM}', { key: '${env:KEY}' }]
		});

		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 5);
		assert.deepStrictEqual(unresolved.map(r => r.name).sort(), ['config', 'env', 'env', 'env', 'env']);
	});

	test('resolve and get result', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}',
			path: '${env:HOME}/folder'
		});

		expr.resolve({ inner: 'env:USERNAME', id: '${env:USERNAME}', name: 'env', arg: 'USERNAME' }, 'testuser');
		expr.resolve({ inner: 'env:HOME', id: '${env:HOME}', name: 'env', arg: 'HOME' }, '/home/testuser');

		assert.deepStrictEqual(expr.toObject(), {
			name: 'testuser',
			path: '/home/testuser/folder'
		});
	});

	test('keeps unresolved variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:USERNAME}'
		});

		assert.deepStrictEqual(expr.toObject(), {
			name: '${env:USERNAME}'
		});
	});

	test('deduplicates identical variables', () => {
		const expr = ConfigurationResolverExpression.parse({
			first: '${env:HOME}',
			second: '${env:HOME}'
		});

		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');

		expr.resolve(unresolved[0], '/home/user');
		assert.deepStrictEqual(expr.toObject(), {
			first: '/home/user',
			second: '/home/user'
		});
	});

	test('handles root string value', () => {
		const expr = ConfigurationResolverExpression.parse('abc ${env:HOME} xyz');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME');

		expr.resolve(unresolved[0], '/home/user');
		assert.strictEqual(expr.toObject(), 'abc /home/user xyz');
	});

	test('handles root string value with multiple variables', () => {
		const expr = ConfigurationResolverExpression.parse('${env:HOME}/folder${env:SHELL}');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 2);

		expr.resolve({ id: '${env:HOME}', inner: 'env:HOME', name: 'env', arg: 'HOME' }, '/home/user');
		expr.resolve({ id: '${env:SHELL}', inner: 'env:SHELL', name: 'env', arg: 'SHELL' }, '/bin/bash');
		assert.strictEqual(expr.toObject(), '/home/user/folder/bin/bash');
	});

	test('handles root string with escaped variables', () => {
		const expr = ConfigurationResolverExpression.parse('abc ${env:HOME${env:USER}} xyz');
		const unresolved = Array.from(expr.unresolved());
		assert.strictEqual(unresolved.length, 1);
		assert.strictEqual(unresolved[0].name, 'env');
		assert.strictEqual(unresolved[0].arg, 'HOME${env:USER}');
	});

	test('resolves nested values', () => {
		const expr = ConfigurationResolverExpression.parse({
			name: '${env:REDIRECTED}',
			'key that is ${env:REDIRECTED}': 'cool!',
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'REDIRECTED') {
				expr.resolve(r, 'username: ${env:USERNAME}');
			} else if (r.arg === 'USERNAME') {
				expr.resolve(r, 'testuser');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			name: 'username: testuser',
			'key that is username: testuser': 'cool!'
		});
	});

	test('resolves nested values 2 (#245798)', () => {
		const expr = ConfigurationResolverExpression.parse({
			env: {
				SITE: '${input:site}',
				TLD: '${input:tld}',
				HOST: '${input:host}',
			},
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'site') {
				expr.resolve(r, 'example');
			} else if (r.arg === 'tld') {
				expr.resolve(r, 'com');
			} else if (r.arg === 'host') {
				expr.resolve(r, 'local.${input:site}.${input:tld}');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			env: {
				SITE: 'example',
				TLD: 'com',
				HOST: 'local.example.com'
			}
		});
	});

	test('out-of-order key resolution (#248550)', () => {
		const expr = ConfigurationResolverExpression.parse({
			'${input:key}': '${input:value}',
		});

		for (const r of expr.unresolved()) {
			if (r.arg === 'key') {
				expr.resolve(r, 'the-key');
			}
		}
		for (const r of expr.unresolved()) {
			if (r.arg === 'value') {
				expr.resolve(r, 'the-value');
			}
		}

		assert.deepStrictEqual(expr.toObject(), {
			'the-key': 'the-value'
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/contextmenu/electron-browser/contextmenuService.ts]---
Location: vscode-main/src/vs/workbench/services/contextmenu/electron-browser/contextmenuService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification, Separator, SubmenuAction } from '../../../../base/common/actions.js';
import * as dom from '../../../../base/browser/dom.js';
import { IContextMenuMenuDelegate, IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { getZoomFactor } from '../../../../base/browser/browser.js';
import { unmnemonicLabel } from '../../../../base/common/labels.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IContextMenuDelegate, IContextMenuEvent } from '../../../../base/browser/contextmenu.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { IContextMenuItem } from '../../../../base/parts/contextmenu/common/contextmenu.js';
import { popup } from '../../../../base/parts/contextmenu/electron-browser/contextmenu.js';
import { hasNativeContextMenu, MenuSettings } from '../../../../platform/window/common/window.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextMenuMenuDelegate, ContextMenuService as HTMLContextMenuService } from '../../../../platform/contextview/browser/contextMenuService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { stripIcons } from '../../../../base/common/iconLabels.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { AnchorAlignment, AnchorAxisAlignment, isAnchor } from '../../../../base/browser/ui/contextview/contextview.js';
import { IMenuService } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';

export class ContextMenuService implements IContextMenuService {

	declare readonly _serviceBrand: undefined;

	private impl: HTMLContextMenuService | NativeContextMenuService;
	private listener?: IDisposable;

	get onDidShowContextMenu(): Event<void> { return this.impl.onDidShowContextMenu; }
	get onDidHideContextMenu(): Event<void> { return this.impl.onDidHideContextMenu; }

	constructor(
		@INotificationService notificationService: INotificationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextViewService contextViewService: IContextViewService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		function createContextMenuService(native: boolean) {
			return native ?
				new NativeContextMenuService(notificationService, telemetryService, keybindingService, menuService, contextKeyService)
				: new HTMLContextMenuService(telemetryService, notificationService, contextViewService, keybindingService, menuService, contextKeyService);
		}

		// set initial context menu service
		let isNativeContextMenu = hasNativeContextMenu(configurationService);
		this.impl = createContextMenuService(isNativeContextMenu);

		// MacOS does not need a restart when the menu style changes
		// It should update the context menu style on menu style configuration change
		if (isMacintosh) {
			this.listener = configurationService.onDidChangeConfiguration(e => {
				if (!e.affectsConfiguration(MenuSettings.MenuStyle)) {
					return;
				}

				const newIsNativeContextMenu = hasNativeContextMenu(configurationService);
				if (newIsNativeContextMenu === isNativeContextMenu) {
					return;
				}

				this.impl.dispose();
				this.impl = createContextMenuService(newIsNativeContextMenu);
				isNativeContextMenu = newIsNativeContextMenu;
			});
		}
	}

	dispose(): void {
		this.listener?.dispose();
		this.impl.dispose();
	}

	showContextMenu(delegate: IContextMenuDelegate | IContextMenuMenuDelegate): void {
		this.impl.showContextMenu(delegate);
	}
}

class NativeContextMenuService extends Disposable implements IContextMenuService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidShowContextMenu = this._store.add(new Emitter<void>());
	readonly onDidShowContextMenu = this._onDidShowContextMenu.event;

	private readonly _onDidHideContextMenu = this._store.add(new Emitter<void>());
	readonly onDidHideContextMenu = this._onDidHideContextMenu.event;

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
	}

	showContextMenu(delegate: IContextMenuDelegate | IContextMenuMenuDelegate): void {

		delegate = ContextMenuMenuDelegate.transform(delegate, this.menuService, this.contextKeyService);

		const actions = delegate.getActions();
		if (actions.length) {
			const onHide = createSingleCallFunction(() => {
				delegate.onHide?.(false);

				dom.ModifierKeyEmitter.getInstance().resetKeyStatus();
				this._onDidHideContextMenu.fire();
			});

			const menu = this.createMenu(delegate, actions, onHide);
			const anchor = delegate.getAnchor();

			let x: number | undefined;
			let y: number | undefined;

			let zoom = getZoomFactor(dom.isHTMLElement(anchor) ? dom.getWindow(anchor) : dom.getActiveWindow());
			if (dom.isHTMLElement(anchor)) {
				const clientRect = anchor.getBoundingClientRect();
				const elementPosition = { left: clientRect.left, top: clientRect.top, width: clientRect.width, height: clientRect.height };

				// Determine if element is clipped by viewport; if so we'll use the bottom-right of the visible portion
				const win = dom.getWindow(anchor);
				const vw = win.innerWidth;
				const vh = win.innerHeight;
				const isClipped = clientRect.left < 0 || clientRect.top < 0 || clientRect.right > vw || clientRect.bottom > vh;

				// When drawing context menus, we adjust the pixel position for native menus using zoom level
				// In areas where zoom is applied to the element or its ancestors, we need to adjust accordingly
				// e.g. The title bar has counter zoom behavior meaning it applies the inverse of zoom level.
				// Window Zoom Level: 1.5, Title Bar Zoom: 1/1.5, Coordinate Multiplier: 1.5 * 1.0 / 1.5 = 1.0
				zoom *= dom.getDomNodeZoomLevel(anchor);

				if (isClipped) {
					// Element is partially out of viewport: always place at bottom-right visible corner
					x = Math.min(Math.max(clientRect.right, 0), vw);
					y = Math.min(Math.max(clientRect.bottom, 0), vh);
				} else {
					// Position according to the axis alignment and the anchor alignment:
					// `HORIZONTAL` aligns at the top left or right of the anchor and
					//  `VERTICAL` aligns at the bottom left of the anchor.
					if (delegate.anchorAxisAlignment === AnchorAxisAlignment.HORIZONTAL) {
						if (delegate.anchorAlignment === AnchorAlignment.LEFT) {
							x = elementPosition.left;
							y = elementPosition.top;
						} else {
							x = elementPosition.left + elementPosition.width;
							y = elementPosition.top;
						}

						if (!isMacintosh) {
							const window = dom.getWindow(anchor);
							const availableHeightForMenu = window.screen.height - y;
							if (availableHeightForMenu < actions.length * (isWindows ? 45 : 32) /* guess of 1 menu item height */) {
								// this is a guess to detect whether the context menu would
								// open to the bottom from this point or to the top. If the
								// menu opens to the top, make sure to align it to the bottom
								// of the anchor and not to the top.
								// this seems to be only necessary for Windows and Linux.
								y += elementPosition.height;
							}
						}
					} else {
						if (delegate.anchorAlignment === AnchorAlignment.LEFT) {
							x = elementPosition.left;
							y = elementPosition.top + elementPosition.height;
						} else {
							x = elementPosition.left + elementPosition.width;
							y = elementPosition.top + elementPosition.height;
						}
					}
				}

				// Shift macOS menus by a few pixels below elements
				// to account for extra padding on top of native menu
				// https://github.com/microsoft/vscode/issues/84231
				if (isMacintosh) {
					y += 4 / zoom;
				}
			} else if (isAnchor(anchor)) {
				x = anchor.x;
				y = anchor.y;
			} else {
				// We leave x/y undefined in this case which will result in
				// Electron taking care of opening the menu at the cursor position.
			}

			if (typeof x === 'number') {
				x = Math.floor(x * zoom);
			}

			if (typeof y === 'number') {
				y = Math.floor(y * zoom);
			}

			popup(menu, { x, y, positioningItem: delegate.autoSelectFirstItem ? 0 : undefined, }, () => onHide());

			this._onDidShowContextMenu.fire();
		}
	}

	private createMenu(delegate: IContextMenuDelegate, entries: readonly IAction[], onHide: () => void, submenuIds = new Set<string>()): IContextMenuItem[] {
		return coalesce(entries.map(entry => this.createMenuItem(delegate, entry, onHide, submenuIds)));
	}

	private createMenuItem(delegate: IContextMenuDelegate, entry: IAction, onHide: () => void, submenuIds: Set<string>): IContextMenuItem | undefined {
		// Separator
		if (entry instanceof Separator) {
			return { type: 'separator' };
		}

		// Submenu
		if (entry instanceof SubmenuAction) {
			if (submenuIds.has(entry.id)) {
				console.warn(`Found submenu cycle: ${entry.id}`);
				return undefined;
			}

			return {
				label: unmnemonicLabel(stripIcons(entry.label)).trim(),
				submenu: this.createMenu(delegate, entry.actions, onHide, new Set([...submenuIds, entry.id]))
			};
		}

		// Normal Menu Item
		else {
			let type: 'radio' | 'checkbox' | undefined = undefined;
			if (entry.checked) {
				if (typeof delegate.getCheckedActionsRepresentation === 'function') {
					type = delegate.getCheckedActionsRepresentation(entry);
				} else {
					type = 'checkbox';
				}
			}

			const item: IContextMenuItem = {
				label: unmnemonicLabel(stripIcons(entry.label)).trim(),
				checked: !!entry.checked,
				type,
				enabled: !!entry.enabled,
				click: event => {

					// To preserve pre-electron-2.x behaviour, we first trigger
					// the onHide callback and then the action.
					// Fixes https://github.com/microsoft/vscode/issues/45601
					onHide();

					// Run action which will close the menu
					this.runAction(entry, delegate, event);
				}
			};

			const keybinding = delegate.getKeyBinding ? delegate.getKeyBinding(entry) : this.keybindingService.lookupKeybinding(entry.id);
			if (keybinding) {
				const electronAccelerator = keybinding.getElectronAccelerator();
				if (electronAccelerator) {
					item.accelerator = electronAccelerator;
				} else {
					const label = keybinding.getLabel();
					if (label) {
						item.label = `${item.label} [${label}]`;
					}
				}
			}

			return item;
		}
	}

	private async runAction(actionToRun: IAction, delegate: IContextMenuDelegate, event: IContextMenuEvent): Promise<void> {
		if (!delegate.skipTelemetry) {
			this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', { id: actionToRun.id, from: 'contextMenu' });
		}

		const context = delegate.getActionsContext ? delegate.getActionsContext(event) : undefined;

		try {
			if (delegate.actionRunner) {
				await delegate.actionRunner.run(actionToRun, context);
			} else if (actionToRun.enabled) {
				await actionToRun.run(context);
			}
		} catch (error) {
			this.notificationService.error(error);
		}
	}
}

registerSingleton(IContextMenuService, ContextMenuService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dataChannel/browser/dataChannelService.ts]---
Location: vscode-main/src/vs/workbench/services/dataChannel/browser/dataChannelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IDataChannelService, CoreDataChannel, IDataChannelEvent } from '../../../../platform/dataChannel/common/dataChannel.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class DataChannelService extends Disposable implements IDataChannelService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidSendData = this._register(new Emitter<IDataChannelEvent>());
	readonly onDidSendData = this._onDidSendData.event;

	constructor() {
		super();
	}

	getDataChannel<T>(channelId: string): CoreDataChannel<T> {
		return new CoreDataChannelImpl<T>(channelId, this._onDidSendData);
	}
}

class CoreDataChannelImpl<T> implements CoreDataChannel<T> {
	constructor(
		private readonly channelId: string,
		private readonly _onDidSendData: Emitter<IDataChannelEvent>
	) { }

	sendData(data: T): void {
		this._onDidSendData.fire({
			channelId: this.channelId,
			data
		});
	}
}

registerSingleton(IDataChannelService, DataChannelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/decorations/browser/decorationsService.ts]---
Location: vscode-main/src/vs/workbench/services/decorations/browser/decorationsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Emitter, DebounceEmitter, Event } from '../../../../base/common/event.js';
import { IDecorationsService, IDecoration, IResourceDecorationChangeEvent, IDecorationsProvider, IDecorationData } from '../common/decorations.js';
import { TernarySearchTree } from '../../../../base/common/ternarySearchTree.js';
import { IDisposable, toDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { isThenable } from '../../../../base/common/async.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { createStyleSheet, createCSSRule, removeCSSRulesContainingSelector } from '../../../../base/browser/domStylesheets.js';
import * as cssValue from '../../../../base/browser/cssValue.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { localize } from '../../../../nls.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { hash } from '../../../../base/common/hash.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { asArray, distinct } from '../../../../base/common/arrays.js';
import { asCssVariable, ColorIdentifier } from '../../../../platform/theme/common/colorRegistry.js';
import { getIconRegistry } from '../../../../platform/theme/common/iconRegistry.js';

class DecorationRule {

	static keyOf(data: IDecorationData | IDecorationData[]): string {
		if (Array.isArray(data)) {
			return data.map(DecorationRule.keyOf).join(',');
		} else {
			const { color, letter } = data;
			if (ThemeIcon.isThemeIcon(letter)) {
				return `${color}+${letter.id}`;
			} else {
				return `${color}/${letter}`;
			}
		}
	}

	private static readonly _classNamesPrefix = 'monaco-decoration';

	readonly data: IDecorationData | IDecorationData[];
	readonly itemColorClassName: string;
	readonly itemBadgeClassName: string;
	readonly iconBadgeClassName: string;
	readonly bubbleBadgeClassName: string;

	private _refCounter: number = 0;

	constructor(readonly themeService: IThemeService, data: IDecorationData | IDecorationData[], key: string) {
		this.data = data;
		const suffix = hash(key).toString(36);
		this.itemColorClassName = `${DecorationRule._classNamesPrefix}-itemColor-${suffix}`;
		this.itemBadgeClassName = `${DecorationRule._classNamesPrefix}-itemBadge-${suffix}`;
		this.bubbleBadgeClassName = `${DecorationRule._classNamesPrefix}-bubbleBadge-${suffix}`;
		this.iconBadgeClassName = `${DecorationRule._classNamesPrefix}-iconBadge-${suffix}`;
	}

	acquire(): void {
		this._refCounter += 1;
	}

	release(): boolean {
		return --this._refCounter === 0;
	}

	appendCSSRules(element: HTMLStyleElement): void {
		if (!Array.isArray(this.data)) {
			this._appendForOne(this.data, element);
		} else {
			this._appendForMany(this.data, element);
		}
	}

	private _appendForOne(data: IDecorationData, element: HTMLStyleElement): void {
		const { color, letter } = data;
		// label
		createCSSRule(`.${this.itemColorClassName}`, `color: ${getColor(color)};`, element);
		if (ThemeIcon.isThemeIcon(letter)) {
			this._createIconCSSRule(letter, color, element);
		} else if (letter) {
			createCSSRule(`.${this.itemBadgeClassName}::after`, `content: "${letter}"; color: ${getColor(color)};`, element);
		}
	}

	private _appendForMany(data: IDecorationData[], element: HTMLStyleElement): void {
		// label
		const { color } = data.find(d => !!d.color) ?? data[0];
		createCSSRule(`.${this.itemColorClassName}`, `color: ${getColor(color)};`, element);

		// badge or icon
		const letters: string[] = [];
		let icon: ThemeIcon | undefined;

		for (const d of data) {
			if (ThemeIcon.isThemeIcon(d.letter)) {
				icon = d.letter;
				break;
			} else if (d.letter) {
				letters.push(d.letter);
			}
		}

		if (icon) {
			this._createIconCSSRule(icon, color, element);
		} else {
			if (letters.length) {
				createCSSRule(`.${this.itemBadgeClassName}::after`, `content: "${letters.join(', ')}"; color: ${getColor(color)};`, element);
			}

			// bubble badge
			// TODO @misolori update bubble badge to adopt letter: ThemeIcon instead of unicode
			createCSSRule(
				`.${this.bubbleBadgeClassName}::after`,
				`content: "\uea71"; color: ${getColor(color)}; font-family: codicon; font-size: 14px; margin-right: 14px; opacity: 0.4;`,
				element
			);
		}
	}

	private _createIconCSSRule(icon: ThemeIcon, color: string | undefined, element: HTMLStyleElement) {

		const modifier = ThemeIcon.getModifier(icon);
		if (modifier) {
			icon = ThemeIcon.modify(icon, undefined);
		}
		const iconContribution = getIconRegistry().getIcon(icon.id);
		if (!iconContribution) {
			return;
		}
		const definition = this.themeService.getProductIconTheme().getIcon(iconContribution);
		if (!definition) {
			return;
		}
		createCSSRule(
			`.${this.iconBadgeClassName}::after`,
			`content: '${definition.fontCharacter}';
			color: ${icon.color ? getColor(icon.color.id) : getColor(color)};
			font-family: ${cssValue.stringValue(definition.font?.id ?? 'codicon')};
			font-size: 16px;
			margin-right: 14px;
			font-weight: normal;
			${modifier === 'spin' ? 'animation: codicon-spin 1.5s steps(30) infinite; font-style: normal !important;' : ''};
			`,
			element
		);
	}

	removeCSSRules(element: HTMLStyleElement): void {
		removeCSSRulesContainingSelector(this.itemColorClassName, element);
		removeCSSRulesContainingSelector(this.itemBadgeClassName, element);
		removeCSSRulesContainingSelector(this.bubbleBadgeClassName, element);
		removeCSSRulesContainingSelector(this.iconBadgeClassName, element);
	}
}

class DecorationStyles {

	private readonly _dispoables = new DisposableStore();
	private readonly _styleElement = createStyleSheet(undefined, undefined, this._dispoables);
	private readonly _decorationRules = new Map<string, DecorationRule>();

	constructor(private readonly _themeService: IThemeService) {
	}

	dispose(): void {
		this._dispoables.dispose();
	}

	asDecoration(data: IDecorationData[], onlyChildren: boolean): IDecoration {

		// sort by weight
		data.sort((a, b) => (b.weight || 0) - (a.weight || 0));

		const key = DecorationRule.keyOf(data);
		let rule = this._decorationRules.get(key);

		if (!rule) {
			// new css rule
			rule = new DecorationRule(this._themeService, data, key);
			this._decorationRules.set(key, rule);
			rule.appendCSSRules(this._styleElement);
		}

		rule.acquire();

		const labelClassName = rule.itemColorClassName;
		let badgeClassName = rule.itemBadgeClassName;
		const iconClassName = rule.iconBadgeClassName;
		let tooltip = distinct(data.filter(d => !isFalsyOrWhitespace(d.tooltip)).map(d => d.tooltip)).join(' • ');
		const strikethrough = data.some(d => d.strikethrough);

		if (onlyChildren) {
			// show items from its children only
			badgeClassName = rule.bubbleBadgeClassName;
			tooltip = localize('bubbleTitle', "Contains emphasized items");
		}

		return {
			labelClassName,
			badgeClassName,
			iconClassName,
			strikethrough,
			tooltip,
			dispose: () => {
				if (rule?.release()) {
					this._decorationRules.delete(key);
					rule.removeCSSRules(this._styleElement);
					rule = undefined;
				}
			}
		};
	}
}

class FileDecorationChangeEvent implements IResourceDecorationChangeEvent {

	private readonly _data = TernarySearchTree.forUris<true>(_uri => true); // events ignore all path casings

	constructor(all: URI | URI[]) {
		this._data.fill(true, asArray(all));
	}

	affectsResource(uri: URI): boolean {
		return this._data.hasElementOrSubtree(uri);
	}
}

class DecorationDataRequest {
	constructor(
		readonly source: CancellationTokenSource,
		readonly thenable: Promise<void>,
	) { }
}

function getColor(color: ColorIdentifier | undefined) {
	return color ? asCssVariable(color) : 'inherit';
}

type DecorationEntry = Map<IDecorationsProvider, DecorationDataRequest | IDecorationData | null>;

export class DecorationsService implements IDecorationsService {

	declare _serviceBrand: undefined;

	private readonly _store = new DisposableStore();
	private readonly _onDidChangeDecorationsDelayed = this._store.add(new DebounceEmitter<URI | URI[]>({ merge: all => all.flat() }));
	private readonly _onDidChangeDecorations = this._store.add(new Emitter<IResourceDecorationChangeEvent>());

	readonly onDidChangeDecorations: Event<IResourceDecorationChangeEvent> = this._onDidChangeDecorations.event;

	private readonly _provider = new LinkedList<IDecorationsProvider>();
	private readonly _decorationStyles: DecorationStyles;
	private readonly _data: TernarySearchTree<URI, DecorationEntry>;

	constructor(
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IThemeService themeService: IThemeService,
	) {
		this._decorationStyles = new DecorationStyles(themeService);
		this._data = TernarySearchTree.forUris(key => uriIdentityService.extUri.ignorePathCasing(key));

		this._store.add(this._onDidChangeDecorationsDelayed.event(event => { this._onDidChangeDecorations.fire(new FileDecorationChangeEvent(event)); }));
	}

	dispose(): void {
		this._store.dispose();
		this._data.clear();
	}

	registerDecorationsProvider(provider: IDecorationsProvider): IDisposable {
		const rm = this._provider.unshift(provider);

		this._onDidChangeDecorations.fire({
			// everything might have changed
			affectsResource() { return true; }
		});

		// remove everything what came from this provider
		const removeAll = () => {
			const uris: URI[] = [];
			for (const [uri, map] of this._data) {
				if (map.delete(provider)) {
					uris.push(uri);
				}
			}
			if (uris.length > 0) {
				this._onDidChangeDecorationsDelayed.fire(uris);
			}
		};

		const listener = provider.onDidChange(uris => {
			if (!uris) {
				// flush event -> drop all data, can affect everything
				removeAll();

			} else {
				// selective changes -> drop for resource, fetch again, send event
				for (const uri of uris) {
					const map = this._ensureEntry(uri);
					this._fetchData(map, uri, provider);
				}
			}
		});

		return toDisposable(() => {
			rm();
			listener.dispose();
			removeAll();
		});
	}

	private _ensureEntry(uri: URI): DecorationEntry {
		let map = this._data.get(uri);
		if (!map) {
			// nothing known about this uri
			map = new Map();
			this._data.set(uri, map);
		}
		return map;
	}

	getDecoration(uri: URI, includeChildren: boolean): IDecoration | undefined {

		const all: IDecorationData[] = [];
		let containsChildren: boolean = false;

		const map = this._ensureEntry(uri);

		for (const provider of this._provider) {

			let data = map.get(provider);
			if (data === undefined) {
				// sets data if fetch is sync
				data = this._fetchData(map, uri, provider);
			}

			if (data && !(data instanceof DecorationDataRequest)) {
				// having data
				all.push(data);
			}
		}

		if (includeChildren) {
			// (resolved) children
			const iter = this._data.findSuperstr(uri);
			if (iter) {
				for (const tuple of iter) {
					for (const data of tuple[1].values()) {
						if (data && !(data instanceof DecorationDataRequest)) {
							if (data.bubble) {
								all.push(data);
								containsChildren = true;
							}
						}
					}
				}
			}
		}

		return all.length === 0
			? undefined
			: this._decorationStyles.asDecoration(all, containsChildren);
	}

	private _fetchData(map: DecorationEntry, uri: URI, provider: IDecorationsProvider): IDecorationData | null {

		// check for pending request and cancel it
		const pendingRequest = map.get(provider);
		if (pendingRequest instanceof DecorationDataRequest) {
			pendingRequest.source.cancel();
			map.delete(provider);
		}

		const cts = new CancellationTokenSource();
		const dataOrThenable = provider.provideDecorations(uri, cts.token);
		if (!isThenable<IDecorationData | Promise<IDecorationData | undefined> | undefined>(dataOrThenable)) {
			// sync -> we have a result now
			cts.dispose();
			return this._keepItem(map, provider, uri, dataOrThenable);

		} else {
			// async -> we have a result soon
			const request = new DecorationDataRequest(cts, Promise.resolve(dataOrThenable).then(data => {
				if (map.get(provider) === request) {
					this._keepItem(map, provider, uri, data);
				}
			}).catch(err => {
				if (!isCancellationError(err) && map.get(provider) === request) {
					map.delete(provider);
				}
			}).finally(() => {
				cts.dispose();
			}));

			map.set(provider, request);
			return null;
		}
	}

	private _keepItem(map: DecorationEntry, provider: IDecorationsProvider, uri: URI, data: IDecorationData | undefined): IDecorationData | null {
		const deco = data ? data : null;
		const old = map.get(provider);
		map.set(provider, deco);
		if (deco || old) {
			// only fire event when something changed
			this._onDidChangeDecorationsDelayed.fire(uri);
		}
		return deco;
	}
}

registerSingleton(IDecorationsService, DecorationsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/decorations/common/decorations.ts]---
Location: vscode-main/src/vs/workbench/services/decorations/common/decorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { URI } from '../../../../base/common/uri.js';
import { Event } from '../../../../base/common/event.js';
import { ColorIdentifier } from '../../../../platform/theme/common/colorRegistry.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export const IDecorationsService = createDecorator<IDecorationsService>('IFileDecorationsService');

export interface IDecorationData {
	readonly weight?: number;
	readonly color?: ColorIdentifier;
	readonly letter?: string | ThemeIcon;
	readonly tooltip?: string;
	readonly strikethrough?: boolean;
	readonly bubble?: boolean;
}

export interface IDecoration extends IDisposable {
	readonly tooltip: string;
	readonly strikethrough: boolean;
	readonly labelClassName: string;
	readonly badgeClassName: string;
	readonly iconClassName: string;
}

export interface IDecorationsProvider {
	readonly label: string;
	readonly onDidChange: Event<readonly URI[]>;
	provideDecorations(uri: URI, token: CancellationToken): IDecorationData | Promise<IDecorationData | undefined> | undefined;
}

export interface IResourceDecorationChangeEvent {
	affectsResource(uri: URI): boolean;
}

export interface IDecorationsService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeDecorations: Event<IResourceDecorationChangeEvent>;

	registerDecorationsProvider(provider: IDecorationsProvider): IDisposable;

	getDecoration(uri: URI, includeChildren: boolean): IDecoration | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/decorations/test/browser/decorationsService.test.ts]---
Location: vscode-main/src/vs/workbench/services/decorations/test/browser/decorationsService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DecorationsService } from '../../browser/decorationsService.js';
import { IDecorationsProvider, IDecorationData } from '../../common/decorations.js';
import { URI } from '../../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../../base/common/event.js';
import * as resources from '../../../../../base/common/resources.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('DecorationsService', function () {

	let service: DecorationsService;

	setup(function () {
		service = new DecorationsService(
			new class extends mock<IUriIdentityService>() {
				override extUri = resources.extUri;
			},
			new TestThemeService()
		);
	});

	teardown(function () {
		service.dispose();
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();


	test('Async provider, async/evented result', function () {

		return runWithFakedTimers({}, async function () {

			const uri = URI.parse('foo:bar');
			let callCounter = 0;

			const reg = service.registerDecorationsProvider(new class implements IDecorationsProvider {
				readonly label: string = 'Test';
				readonly onDidChange: Event<readonly URI[]> = Event.None;
				provideDecorations(uri: URI) {
					callCounter += 1;
					return new Promise<IDecorationData>(resolve => {
						setTimeout(() => resolve({
							color: 'someBlue',
							tooltip: 'T',
							strikethrough: true
						}));
					});
				}
			});

			// trigger -> async
			assert.strictEqual(service.getDecoration(uri, false), undefined);
			assert.strictEqual(callCounter, 1);

			// event when result is computed
			const e = await Event.toPromise(service.onDidChangeDecorations);
			assert.strictEqual(e.affectsResource(uri), true);
			// sync result
			assert.deepStrictEqual(service.getDecoration(uri, false)!.tooltip, 'T');
			assert.deepStrictEqual(service.getDecoration(uri, false)!.strikethrough, true);
			assert.strictEqual(callCounter, 1);

			reg.dispose();
		});
	});

	test('Sync provider, sync result', function () {

		const uri = URI.parse('foo:bar');
		let callCounter = 0;

		const reg = service.registerDecorationsProvider(new class implements IDecorationsProvider {
			readonly label: string = 'Test';
			readonly onDidChange: Event<readonly URI[]> = Event.None;
			provideDecorations(uri: URI) {
				callCounter += 1;
				return { color: 'someBlue', tooltip: 'Z' };
			}
		});

		// trigger -> sync
		assert.deepStrictEqual(service.getDecoration(uri, false)!.tooltip, 'Z');
		assert.deepStrictEqual(service.getDecoration(uri, false)!.strikethrough, false);
		assert.strictEqual(callCounter, 1);

		reg.dispose();
	});

	test('Clear decorations on provider dispose', async function () {
		return runWithFakedTimers({}, async function () {

			const uri = URI.parse('foo:bar');
			let callCounter = 0;

			const reg = service.registerDecorationsProvider(new class implements IDecorationsProvider {
				readonly label: string = 'Test';
				readonly onDidChange: Event<readonly URI[]> = Event.None;
				provideDecorations(uri: URI) {
					callCounter += 1;
					return { color: 'someBlue', tooltip: 'J' };
				}
			});

			// trigger -> sync
			assert.deepStrictEqual(service.getDecoration(uri, false)!.tooltip, 'J');
			assert.strictEqual(callCounter, 1);

			// un-register -> ensure good event
			let didSeeEvent = false;
			const p = new Promise<void>(resolve => {
				const l = service.onDidChangeDecorations(e => {
					assert.strictEqual(e.affectsResource(uri), true);
					assert.deepStrictEqual(service.getDecoration(uri, false), undefined);
					assert.strictEqual(callCounter, 1);
					didSeeEvent = true;
					l.dispose();
					resolve();
				});
			});
			reg.dispose(); // will clear all data
			await p;
			assert.strictEqual(didSeeEvent, true);

		});
	});

	test('No default bubbling', function () {

		let reg = service.registerDecorationsProvider({
			label: 'Test',
			onDidChange: Event.None,
			provideDecorations(uri: URI) {
				return uri.path.match(/\.txt/)
					? { tooltip: '.txt', weight: 17 }
					: undefined;
			}
		});

		const childUri = URI.parse('file:///some/path/some/file.txt');

		let deco = service.getDecoration(childUri, false)!;
		assert.strictEqual(deco.tooltip, '.txt');

		deco = service.getDecoration(childUri.with({ path: 'some/path/' }), true)!;
		assert.strictEqual(deco, undefined);
		reg.dispose();

		// bubble
		reg = service.registerDecorationsProvider({
			label: 'Test',
			onDidChange: Event.None,
			provideDecorations(uri: URI) {
				return uri.path.match(/\.txt/)
					? { tooltip: '.txt.bubble', weight: 71, bubble: true }
					: undefined;
			}
		});

		deco = service.getDecoration(childUri, false)!;
		assert.strictEqual(deco.tooltip, '.txt.bubble');

		deco = service.getDecoration(childUri.with({ path: 'some/path/' }), true)!;
		assert.strictEqual(typeof deco.tooltip, 'string');
		reg.dispose();
	});

	test('Decorations not showing up for second root folder #48502', async function () {

		let cancelCount = 0;
		let callCount = 0;

		const provider = new class implements IDecorationsProvider {

			_onDidChange = new Emitter<URI[]>();
			readonly onDidChange: Event<readonly URI[]> = this._onDidChange.event;

			label: string = 'foo';

			provideDecorations(uri: URI, token: CancellationToken): Promise<IDecorationData> {

				store.add(token.onCancellationRequested(() => {
					cancelCount += 1;
				}));

				return new Promise(resolve => {
					callCount += 1;
					setTimeout(() => {
						resolve({ letter: 'foo' });
					}, 10);
				});
			}
		};

		const reg = service.registerDecorationsProvider(provider);

		const uri = URI.parse('foo://bar');
		const d1 = service.getDecoration(uri, false);

		provider._onDidChange.fire([uri]);
		const d2 = service.getDecoration(uri, false);

		assert.strictEqual(cancelCount, 1);
		assert.strictEqual(callCount, 2);

		d1?.dispose();
		d2?.dispose();
		reg.dispose();
	});

	test('Decorations not bubbling... #48745', function () {

		const reg = service.registerDecorationsProvider({
			label: 'Test',
			onDidChange: Event.None,
			provideDecorations(uri: URI) {
				if (uri.path.match(/hello$/)) {
					return { tooltip: 'FOO', weight: 17, bubble: true };
				} else {
					return new Promise<IDecorationData>(_resolve => { });
				}
			}
		});

		const data1 = service.getDecoration(URI.parse('a:b/'), true);
		assert.ok(!data1);

		const data2 = service.getDecoration(URI.parse('a:b/c.hello'), false)!;
		assert.ok(data2.tooltip);

		const data3 = service.getDecoration(URI.parse('a:b/'), true);
		assert.ok(data3);


		reg.dispose();
	});

	test('Folder decorations don\'t go away when file with problems is deleted #61919 (part1)', function () {

		const emitter = new Emitter<URI[]>();
		let gone = false;
		const reg = service.registerDecorationsProvider({
			label: 'Test',
			onDidChange: emitter.event,
			provideDecorations(uri: URI) {
				if (!gone && uri.path.match(/file.ts$/)) {
					return { tooltip: 'FOO', weight: 17, bubble: true };
				}
				return undefined;
			}
		});

		const uri = URI.parse('foo:/folder/file.ts');
		const uri2 = URI.parse('foo:/folder/');
		let data = service.getDecoration(uri, true)!;
		assert.strictEqual(data.tooltip, 'FOO');

		data = service.getDecoration(uri2, true)!;
		assert.ok(data.tooltip); // emphazied items...

		gone = true;
		emitter.fire([uri]);

		data = service.getDecoration(uri, true)!;
		assert.strictEqual(data, undefined);

		data = service.getDecoration(uri2, true)!;
		assert.strictEqual(data, undefined);

		reg.dispose();
	});

	test('Folder decorations don\'t go away when file with problems is deleted #61919 (part2)', function () {

		return runWithFakedTimers({}, async function () {

			const emitter = new Emitter<URI[]>();
			let gone = false;
			const reg = service.registerDecorationsProvider({
				label: 'Test',
				onDidChange: emitter.event,
				provideDecorations(uri: URI) {
					if (!gone && uri.path.match(/file.ts$/)) {
						return { tooltip: 'FOO', weight: 17, bubble: true };
					}
					return undefined;
				}
			});

			const uri = URI.parse('foo:/folder/file.ts');
			const uri2 = URI.parse('foo:/folder/');
			let data = service.getDecoration(uri, true)!;
			assert.strictEqual(data.tooltip, 'FOO');

			data = service.getDecoration(uri2, true)!;
			assert.ok(data.tooltip); // emphazied items...

			return new Promise<void>((resolve, reject) => {
				const l = service.onDidChangeDecorations(e => {
					l.dispose();
					try {
						assert.ok(e.affectsResource(uri));
						assert.ok(e.affectsResource(uri2));
						resolve();
						reg.dispose();
					} catch (err) {
						reject(err);
						reg.dispose();
					}
				});
				gone = true;
				emitter.fire([uri]);
			});
		});
	});

	test('FileDecorationProvider intermittently fails #133210', async function () {

		const invokeOrder: string[] = [];

		store.add(service.registerDecorationsProvider(new class {
			label = 'Provider-1';
			onDidChange = Event.None;
			provideDecorations() {
				invokeOrder.push(this.label);
				return undefined;
			}
		}));

		store.add(service.registerDecorationsProvider(new class {
			label = 'Provider-2';
			onDidChange = Event.None;
			provideDecorations() {
				invokeOrder.push(this.label);
				return undefined;
			}
		}));

		service.getDecoration(URI.parse('test://me/path'), false);

		assert.deepStrictEqual(invokeOrder, ['Provider-2', 'Provider-1']);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dialogs/browser/abstractFileDialogService.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/browser/abstractFileDialogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IWindowOpenable, isWorkspaceToOpen, isFileToOpen } from '../../../../platform/window/common/window.js';
import { IPickAndOpenOptions, ISaveDialogOptions, IOpenDialogOptions, FileFilter, IFileDialogService, IDialogService, ConfirmResult, getFileNamesMessage } from '../../../../platform/dialogs/common/dialogs.js';
import { isSavedWorkspace, isTemporaryWorkspace, IWorkspaceContextService, WorkbenchState, WORKSPACE_EXTENSION } from '../../../../platform/workspace/common/workspace.js';
import { IHistoryService } from '../../history/common/history.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { URI } from '../../../../base/common/uri.js';
import * as resources from '../../../../base/common/resources.js';
import { isAbsolute as localPathIsAbsolute, normalize as localPathNormalize } from '../../../../base/common/path.js';
import { IInstantiationService, } from '../../../../platform/instantiation/common/instantiation.js';
import { ISimpleFileDialog, SimpleFileDialog } from './simpleFileDialog.js';
import { IWorkspacesService } from '../../../../platform/workspaces/common/workspaces.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IHostService } from '../../host/browser/host.js';
import Severity from '../../../../base/common/severity.js';
import { coalesce, distinct } from '../../../../base/common/arrays.js';
import { trim } from '../../../../base/common/strings.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IPathService } from '../../path/common/pathService.js';
import { Schemas } from '../../../../base/common/network.js';
import { PLAINTEXT_EXTENSION } from '../../../../editor/common/languages/modesRegistry.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { EditorOpenSource } from '../../../../platform/editor/common/editor.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export abstract class AbstractFileDialogService implements IFileDialogService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IHostService protected readonly hostService: IHostService,
		@IWorkspaceContextService protected readonly contextService: IWorkspaceContextService,
		@IHistoryService protected readonly historyService: IHistoryService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IFileService protected readonly fileService: IFileService,
		@IOpenerService protected readonly openerService: IOpenerService,
		@IDialogService protected readonly dialogService: IDialogService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IWorkspacesService private readonly workspacesService: IWorkspacesService,
		@ILabelService private readonly labelService: ILabelService,
		@IPathService private readonly pathService: IPathService,
		@ICommandService protected readonly commandService: ICommandService,
		@IEditorService protected readonly editorService: IEditorService,
		@ICodeEditorService protected readonly codeEditorService: ICodeEditorService,
		@ILogService private readonly logService: ILogService
	) { }

	async defaultFilePath(schemeFilter = this.getSchemeFilterForWindow(), authorityFilter = this.getAuthorityFilterForWindow()): Promise<URI> {

		// Check for last active file first...
		let candidate = this.historyService.getLastActiveFile(schemeFilter, authorityFilter);

		// ...then for last active file root
		if (!candidate) {
			candidate = this.historyService.getLastActiveWorkspaceRoot(schemeFilter, authorityFilter);
		} else {
			candidate = resources.dirname(candidate);
		}

		if (!candidate) {
			candidate = await this.preferredHome(schemeFilter);
		}

		return candidate;
	}

	async defaultFolderPath(schemeFilter = this.getSchemeFilterForWindow(), authorityFilter = this.getAuthorityFilterForWindow()): Promise<URI> {

		// Check for last active file root first...
		let candidate = this.historyService.getLastActiveWorkspaceRoot(schemeFilter, authorityFilter);

		// ...then for last active file
		if (!candidate) {
			candidate = this.historyService.getLastActiveFile(schemeFilter, authorityFilter);
		}

		if (!candidate) {
			return this.preferredHome(schemeFilter);
		}

		return resources.dirname(candidate);
	}

	async preferredHome(schemeFilter = this.getSchemeFilterForWindow()): Promise<URI> {
		const preferLocal = schemeFilter === Schemas.file;
		const preferredHomeConfig = this.configurationService.inspect<string>('files.dialog.defaultPath');
		const preferredHomeCandidate = preferLocal ? preferredHomeConfig.userLocalValue : preferredHomeConfig.userRemoteValue;
		if (preferredHomeCandidate) {
			const isPreferredHomeCandidateAbsolute = preferLocal ? localPathIsAbsolute(preferredHomeCandidate) : (await this.pathService.path).isAbsolute(preferredHomeCandidate);
			if (isPreferredHomeCandidateAbsolute) {
				const preferredHomeNormalized = preferLocal ? localPathNormalize(preferredHomeCandidate) : (await this.pathService.path).normalize(preferredHomeCandidate);
				const preferredHome = resources.toLocalResource(await this.pathService.fileURI(preferredHomeNormalized), this.environmentService.remoteAuthority, this.pathService.defaultUriScheme);
				if (await this.fileService.exists(preferredHome)) {
					return preferredHome;
				}
			}
		}

		return this.pathService.userHome({ preferLocal });
	}

	async defaultWorkspacePath(schemeFilter = this.getSchemeFilterForWindow()): Promise<URI> {
		let defaultWorkspacePath: URI | undefined;

		// Check for current workspace config file first...
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			const configuration = this.contextService.getWorkspace().configuration;
			if (configuration?.scheme === schemeFilter && isSavedWorkspace(configuration, this.environmentService) && !isTemporaryWorkspace(configuration)) {
				defaultWorkspacePath = resources.dirname(configuration);
			}
		}

		// ...then fallback to default file path
		if (!defaultWorkspacePath) {
			defaultWorkspacePath = await this.defaultFilePath(schemeFilter);
		}

		return defaultWorkspacePath;
	}

	async showSaveConfirm(fileNamesOrResources: (string | URI)[]): Promise<ConfirmResult> {
		if (this.skipDialogs()) {
			this.logService.trace('FileDialogService: refused to show save confirmation dialog in tests.');

			// no veto when we are in extension dev testing mode because we cannot assume we run interactive
			return ConfirmResult.DONT_SAVE;
		}

		return this.doShowSaveConfirm(fileNamesOrResources);
	}

	private skipDialogs(): boolean {
		if (this.environmentService.enableSmokeTestDriver) {
			this.logService.warn('DialogService: Dialog requested during smoke test.');
		}
		// integration tests
		return this.environmentService.isExtensionDevelopment && !!this.environmentService.extensionTestsLocationURI;
	}

	private async doShowSaveConfirm(fileNamesOrResources: (string | URI)[]): Promise<ConfirmResult> {
		if (fileNamesOrResources.length === 0) {
			return ConfirmResult.DONT_SAVE;
		}

		let message: string;
		let detail = nls.localize('saveChangesDetail', "Your changes will be lost if you don't save them.");
		if (fileNamesOrResources.length === 1) {
			message = nls.localize('saveChangesMessage', "Do you want to save the changes you made to {0}?", typeof fileNamesOrResources[0] === 'string' ? fileNamesOrResources[0] : resources.basename(fileNamesOrResources[0]));
		} else {
			message = nls.localize('saveChangesMessages', "Do you want to save the changes to the following {0} files?", fileNamesOrResources.length);
			detail = getFileNamesMessage(fileNamesOrResources) + '\n' + detail;
		}

		const { result } = await this.dialogService.prompt<ConfirmResult>({
			type: Severity.Warning,
			message,
			detail,
			buttons: [
				{
					label: fileNamesOrResources.length > 1 ?
						nls.localize({ key: 'saveAll', comment: ['&& denotes a mnemonic'] }, "&&Save All") :
						nls.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save"),
					run: () => ConfirmResult.SAVE
				},
				{
					label: nls.localize({ key: 'dontSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save"),
					run: () => ConfirmResult.DONT_SAVE
				}
			],
			cancelButton: {
				run: () => ConfirmResult.CANCEL
			}
		});

		return result;
	}

	protected addFileSchemaIfNeeded(schema: string, _isFolder?: boolean): string[] {
		return schema === Schemas.untitled ? [Schemas.file] : (schema !== Schemas.file ? [schema, Schemas.file] : [schema]);
	}

	protected async pickFileFolderAndOpenSimplified(schema: string, options: IPickAndOpenOptions, preferNewWindow: boolean): Promise<void> {
		const title = nls.localize('openFileOrFolder.title', 'Open File or Folder');
		const availableFileSystems = this.addFileSchemaIfNeeded(schema);

		const uri = await this.pickResource({ canSelectFiles: true, canSelectFolders: true, canSelectMany: false, defaultUri: options.defaultUri, title, availableFileSystems });

		if (uri) {
			const stat = await this.fileService.stat(uri);

			const toOpen: IWindowOpenable = stat.isDirectory ? { folderUri: uri } : { fileUri: uri };
			if (!isWorkspaceToOpen(toOpen) && isFileToOpen(toOpen)) {
				this.addFileToRecentlyOpened(toOpen.fileUri);
			}

			if (stat.isDirectory || options.forceNewWindow || preferNewWindow) {
				await this.hostService.openWindow([toOpen], { forceNewWindow: options.forceNewWindow, remoteAuthority: options.remoteAuthority });
			} else {
				await this.editorService.openEditors([{ resource: uri, options: { source: EditorOpenSource.USER, pinned: true } }], undefined, { validateTrust: true });
			}
		}
	}

	protected async pickFileAndOpenSimplified(schema: string, options: IPickAndOpenOptions, preferNewWindow: boolean): Promise<void> {
		const title = nls.localize('openFile.title', 'Open File');
		const availableFileSystems = this.addFileSchemaIfNeeded(schema);

		const uri = await this.pickResource({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false, defaultUri: options.defaultUri, title, availableFileSystems });
		if (uri) {
			this.addFileToRecentlyOpened(uri);

			if (options.forceNewWindow || preferNewWindow) {
				await this.hostService.openWindow([{ fileUri: uri }], { forceNewWindow: options.forceNewWindow, remoteAuthority: options.remoteAuthority });
			} else {
				await this.editorService.openEditors([{ resource: uri, options: { source: EditorOpenSource.USER, pinned: true } }], undefined, { validateTrust: true });
			}
		}
	}

	protected addFileToRecentlyOpened(uri: URI): void {
		this.workspacesService.addRecentlyOpened([{ fileUri: uri, label: this.labelService.getUriLabel(uri, { appendWorkspaceSuffix: true }) }]);
	}

	protected async pickFolderAndOpenSimplified(schema: string, options: IPickAndOpenOptions): Promise<void> {
		const title = nls.localize('openFolder.title', 'Open Folder');
		const availableFileSystems = this.addFileSchemaIfNeeded(schema, true);

		const uri = await this.pickResource({ canSelectFiles: false, canSelectFolders: true, canSelectMany: false, defaultUri: options.defaultUri, title, availableFileSystems });
		if (uri) {
			return this.hostService.openWindow([{ folderUri: uri }], { forceNewWindow: options.forceNewWindow, remoteAuthority: options.remoteAuthority });
		}
	}

	protected async pickWorkspaceAndOpenSimplified(schema: string, options: IPickAndOpenOptions): Promise<void> {
		const title = nls.localize('openWorkspace.title', 'Open Workspace from File');
		const filters: FileFilter[] = [{ name: nls.localize('filterName.workspace', 'Workspace'), extensions: [WORKSPACE_EXTENSION] }];
		const availableFileSystems = this.addFileSchemaIfNeeded(schema, true);

		const uri = await this.pickResource({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false, defaultUri: options.defaultUri, title, filters, availableFileSystems });
		if (uri) {
			return this.hostService.openWindow([{ workspaceUri: uri }], { forceNewWindow: options.forceNewWindow, remoteAuthority: options.remoteAuthority });
		}
	}

	protected async pickFileToSaveSimplified(schema: string, options: ISaveDialogOptions): Promise<URI | undefined> {
		if (!options.availableFileSystems) {
			options.availableFileSystems = this.addFileSchemaIfNeeded(schema);
		}

		options.title = nls.localize('saveFileAs.title', 'Save As');
		const uri = await this.saveRemoteResource(options);

		if (uri) {
			this.addFileToRecentlyOpened(uri);
		}

		return uri;
	}

	protected async showSaveDialogSimplified(schema: string, options: ISaveDialogOptions): Promise<URI | undefined> {
		if (!options.availableFileSystems) {
			options.availableFileSystems = this.addFileSchemaIfNeeded(schema);
		}

		return this.saveRemoteResource(options);
	}

	protected async showOpenDialogSimplified(schema: string, options: IOpenDialogOptions): Promise<URI[] | undefined> {
		if (!options.availableFileSystems) {
			options.availableFileSystems = this.addFileSchemaIfNeeded(schema, options.canSelectFolders);
		}

		const uri = await this.pickResource(options);

		return uri ? [uri] : undefined;
	}

	protected getSimpleFileDialog(): ISimpleFileDialog {
		return this.instantiationService.createInstance(SimpleFileDialog);
	}

	private pickResource(options: IOpenDialogOptions): Promise<URI | undefined> {
		return this.getSimpleFileDialog().showOpenDialog(options);
	}

	private saveRemoteResource(options: ISaveDialogOptions): Promise<URI | undefined> {
		return this.getSimpleFileDialog().showSaveDialog(options);
	}

	private getSchemeFilterForWindow(defaultUriScheme?: string): string {
		return defaultUriScheme ?? this.pathService.defaultUriScheme;
	}

	private getAuthorityFilterForWindow(): string | undefined {
		return this.environmentService.remoteAuthority;
	}

	protected getFileSystemSchema(options: { availableFileSystems?: readonly string[]; defaultUri?: URI }): string {
		return options.availableFileSystems?.[0] || this.getSchemeFilterForWindow(options.defaultUri?.scheme);
	}

	abstract pickFileFolderAndOpen(options: IPickAndOpenOptions): Promise<void>;
	abstract pickFileAndOpen(options: IPickAndOpenOptions): Promise<void>;
	abstract pickFolderAndOpen(options: IPickAndOpenOptions): Promise<void>;
	abstract pickWorkspaceAndOpen(options: IPickAndOpenOptions): Promise<void>;
	protected getWorkspaceAvailableFileSystems(options: IPickAndOpenOptions): string[] {
		if (options.availableFileSystems && (options.availableFileSystems.length > 0)) {
			return options.availableFileSystems;
		}
		const availableFileSystems = [Schemas.file];
		if (this.environmentService.remoteAuthority) {
			availableFileSystems.unshift(Schemas.vscodeRemote);
		}
		return availableFileSystems;
	}
	abstract showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined>;
	abstract showOpenDialog(options: IOpenDialogOptions): Promise<URI[] | undefined>;

	abstract pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined>;

	protected getPickFileToSaveDialogOptions(defaultUri: URI, availableFileSystems?: string[]): ISaveDialogOptions {
		const options: ISaveDialogOptions = {
			defaultUri,
			title: nls.localize('saveAsTitle', "Save As"),
			availableFileSystems
		};

		interface IFilter { name: string; extensions: string[] }

		// Build the file filter by using our known languages
		const ext: string | undefined = defaultUri ? resources.extname(defaultUri) : undefined;
		let matchingFilter: IFilter | undefined;

		const registeredLanguageNames = this.languageService.getSortedRegisteredLanguageNames();
		const registeredLanguageFilters: IFilter[] = coalesce(registeredLanguageNames.map(({ languageName, languageId }) => {
			const extensions = this.languageService.getExtensions(languageId);
			if (!extensions.length) {
				return null;
			}

			const filter: IFilter = { name: languageName, extensions: distinct(extensions).slice(0, 10).map(e => trim(e, '.')) };

			// https://github.com/microsoft/vscode/issues/115860
			const extOrPlaintext = ext || PLAINTEXT_EXTENSION;
			if (!matchingFilter && extensions.includes(extOrPlaintext)) {
				matchingFilter = filter;

				// The selected extension must be in the set of extensions that are in the filter list that is sent to the save dialog.
				// If it isn't, add it manually. https://github.com/microsoft/vscode/issues/147657
				const trimmedExt = trim(extOrPlaintext, '.');
				if (!filter.extensions.includes(trimmedExt)) {
					filter.extensions.unshift(trimmedExt);
				}

				return null; // first matching filter will be added to the top
			}

			return filter;
		}));

		// We have no matching filter, e.g. because the language
		// is unknown. We still add the extension to the list of
		// filters though so that it can be picked
		// (https://github.com/microsoft/vscode/issues/96283)
		if (!matchingFilter && ext) {
			matchingFilter = { name: trim(ext, '.').toUpperCase(), extensions: [trim(ext, '.')] };
		}

		// Order of filters is
		// - All Files (we MUST do this to fix macOS issue https://github.com/microsoft/vscode/issues/102713)
		// - File Extension Match (if any)
		// - All Languages
		// - No Extension
		options.filters = coalesce([
			{ name: nls.localize('allFiles', "All Files"), extensions: ['*'] },
			matchingFilter,
			...registeredLanguageFilters,
			{ name: nls.localize('noExt', "No Extension"), extensions: [''] }
		]);

		return options;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/dialogs/browser/fileDialogService.ts]---
Location: vscode-main/src/vs/workbench/services/dialogs/browser/fileDialogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPickAndOpenOptions, ISaveDialogOptions, IOpenDialogOptions, IFileDialogService, FileFilter, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { AbstractFileDialogService } from './abstractFileDialogService.js';
import { Schemas } from '../../../../base/common/network.js';
import { memoize } from '../../../../base/common/decorators.js';
import { HTMLFileSystemProvider } from '../../../../platform/files/browser/htmlFileSystemProvider.js';
import { localize } from '../../../../nls.js';
import { getMediaOrTextMime } from '../../../../base/common/mime.js';
import { basename } from '../../../../base/common/resources.js';
import { getActiveWindow, triggerDownload, triggerUpload } from '../../../../base/browser/dom.js';
import Severity from '../../../../base/common/severity.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { extractFileListData } from '../../../../platform/dnd/browser/dnd.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { WebFileSystemAccess } from '../../../../platform/files/browser/webFileSystemAccess.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';

export class FileDialogService extends AbstractFileDialogService implements IFileDialogService {

	@memoize
	private get fileSystemProvider(): HTMLFileSystemProvider {
		return this.fileService.getProvider(Schemas.file) as HTMLFileSystemProvider;
	}

	async pickFileFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFilePath(schema);
		}

		if (this.shouldUseSimplified(schema)) {
			return super.pickFileFolderAndOpenSimplified(schema, options, false);
		}

		throw new Error(localize('pickFolderAndOpen', "Can't open folders, try adding a folder to the workspace instead."));
	}

	protected override addFileSchemaIfNeeded(schema: string, isFolder: boolean): string[] {
		return (schema === Schemas.untitled) ? [Schemas.file]
			: (((schema !== Schemas.file) && (!isFolder || (schema !== Schemas.vscodeRemote))) ? [schema, Schemas.file] : [schema]);
	}

	async pickFileAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFilePath(schema);
		}

		if (this.shouldUseSimplified(schema)) {
			return super.pickFileAndOpenSimplified(schema, options, false);
		}

		const activeWindow = getActiveWindow();
		if (!WebFileSystemAccess.supported(activeWindow)) {
			return this.showUnsupportedBrowserWarning('open');
		}

		let fileHandle: FileSystemHandle | undefined = undefined;
		try {
			([fileHandle] = await activeWindow.showOpenFilePicker({ multiple: false }));
		} catch (error) {
			return; // `showOpenFilePicker` will throw an error when the user cancels
		}

		if (!WebFileSystemAccess.isFileSystemFileHandle(fileHandle)) {
			return;
		}

		const uri = await this.fileSystemProvider.registerFileHandle(fileHandle);

		this.addFileToRecentlyOpened(uri);

		await this.openerService.open(uri, { fromUserGesture: true, editorOptions: { pinned: true } });
	}

	async pickFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultFolderPath(schema);
		}

		if (this.shouldUseSimplified(schema)) {
			return super.pickFolderAndOpenSimplified(schema, options);
		}

		throw new Error(localize('pickFolderAndOpen', "Can't open folders, try adding a folder to the workspace instead."));
	}

	async pickWorkspaceAndOpen(options: IPickAndOpenOptions): Promise<void> {
		options.availableFileSystems = this.getWorkspaceAvailableFileSystems(options);
		const schema = this.getFileSystemSchema(options);

		if (!options.defaultUri) {
			options.defaultUri = await this.defaultWorkspacePath(schema);
		}

		if (this.shouldUseSimplified(schema)) {
			return super.pickWorkspaceAndOpenSimplified(schema, options);
		}

		throw new Error(localize('pickWorkspaceAndOpen', "Can't open workspaces, try adding a folder to the workspace instead."));
	}

	async pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined> {
		const schema = this.getFileSystemSchema({ defaultUri, availableFileSystems });

		const options = this.getPickFileToSaveDialogOptions(defaultUri, availableFileSystems);
		if (this.shouldUseSimplified(schema)) {
			return super.pickFileToSaveSimplified(schema, options);
		}

		const activeWindow = getActiveWindow();
		if (!WebFileSystemAccess.supported(activeWindow)) {
			return this.showUnsupportedBrowserWarning('save');
		}

		let fileHandle: FileSystemHandle | undefined = undefined;
		const startIn = Iterable.first(this.fileSystemProvider.directories);

		try {
			fileHandle = await activeWindow.showSaveFilePicker({ types: this.getFilePickerTypes(options.filters), ...{ suggestedName: basename(defaultUri), startIn } });
		} catch (error) {
			return; // `showSaveFilePicker` will throw an error when the user cancels
		}

		if (!WebFileSystemAccess.isFileSystemFileHandle(fileHandle)) {
			return undefined;
		}

		return this.fileSystemProvider.registerFileHandle(fileHandle);
	}

	private getFilePickerTypes(filters?: FileFilter[]): FilePickerAcceptType[] | undefined {
		return filters?.filter(filter => {
			return !((filter.extensions.length === 1) && ((filter.extensions[0] === '*') || filter.extensions[0] === ''));
		}).map((filter): FilePickerAcceptType => {
			const accept: Record<MIMEType, FileExtension[]> = {};
			const extensions = filter.extensions.filter(ext => (ext.indexOf('-') < 0) && (ext.indexOf('*') < 0) && (ext.indexOf('_') < 0));
			accept[(getMediaOrTextMime(`fileName.${filter.extensions[0]}`) ?? 'text/plain') as MIMEType] = extensions.map(ext => ext.startsWith('.') ? ext : `.${ext}`) as FileExtension[];
			return {
				description: filter.name,
				accept
			};
		});
	}

	async showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
		const schema = this.getFileSystemSchema(options);

		if (this.shouldUseSimplified(schema)) {
			return super.showSaveDialogSimplified(schema, options);
		}

		const activeWindow = getActiveWindow();
		if (!WebFileSystemAccess.supported(activeWindow)) {
			return this.showUnsupportedBrowserWarning('save');
		}

		let fileHandle: FileSystemHandle | undefined = undefined;
		const startIn = Iterable.first(this.fileSystemProvider.directories);

		try {
			fileHandle = await activeWindow.showSaveFilePicker({ types: this.getFilePickerTypes(options.filters), ...options.defaultUri ? { suggestedName: basename(options.defaultUri) } : undefined, ...{ startIn } });
		} catch (error) {
			return undefined; // `showSaveFilePicker` will throw an error when the user cancels
		}

		if (!WebFileSystemAccess.isFileSystemFileHandle(fileHandle)) {
			return undefined;
		}

		return this.fileSystemProvider.registerFileHandle(fileHandle);
	}

	async showOpenDialog(options: IOpenDialogOptions): Promise<URI[] | undefined> {
		const schema = this.getFileSystemSchema(options);

		if (this.shouldUseSimplified(schema)) {
			return super.showOpenDialogSimplified(schema, options);
		}

		const activeWindow = getActiveWindow();
		if (!WebFileSystemAccess.supported(activeWindow)) {
			return this.showUnsupportedBrowserWarning('open');
		}

		let uri: URI | undefined;
		const startIn = Iterable.first(this.fileSystemProvider.directories) ?? 'documents';

		try {
			if (options.canSelectFiles) {
				const handle = await activeWindow.showOpenFilePicker({ multiple: false, types: this.getFilePickerTypes(options.filters), ...{ startIn } });
				if (handle.length === 1 && WebFileSystemAccess.isFileSystemFileHandle(handle[0])) {
					uri = await this.fileSystemProvider.registerFileHandle(handle[0]);
				}
			} else {
				const handle = await activeWindow.showDirectoryPicker({ ...{ startIn } });
				uri = await this.fileSystemProvider.registerDirectoryHandle(handle);
			}
		} catch (error) {
			// ignore - `showOpenFilePicker` / `showDirectoryPicker` will throw an error when the user cancels
		}

		return uri ? [uri] : undefined;
	}

	private async showUnsupportedBrowserWarning(context: 'save' | 'open'): Promise<undefined> {

		// When saving, try to just download the contents
		// of the active text editor if any as a workaround
		if (context === 'save') {
			const activeCodeEditor = this.codeEditorService.getActiveCodeEditor();
			if (!(activeCodeEditor instanceof EmbeddedCodeEditorWidget)) {
				const activeTextModel = activeCodeEditor?.getModel();
				if (activeTextModel) {
					triggerDownload(VSBuffer.fromString(activeTextModel.getValue()).buffer, basename(activeTextModel.uri));
					return;
				}
			}
		}

		// Otherwise inform the user about options

		const buttons: IPromptButton<void>[] = [
			{
				label: localize({ key: 'openRemote', comment: ['&& denotes a mnemonic'] }, "&&Open Remote..."),
				run: async () => { await this.commandService.executeCommand('workbench.action.remote.showMenu'); }
			},
			{
				label: localize({ key: 'learnMore', comment: ['&& denotes a mnemonic'] }, "&&Learn More"),
				run: async () => { await this.openerService.open('https://aka.ms/VSCodeWebLocalFileSystemAccess'); }
			}
		];
		if (context === 'open') {
			buttons.push({
				label: localize({ key: 'openFiles', comment: ['&& denotes a mnemonic'] }, "Open &&Files..."),
				run: async () => {
					const files = await triggerUpload();
					if (files) {
						const filesData = (await this.instantiationService.invokeFunction(accessor => extractFileListData(accessor, files))).filter(fileData => !fileData.isDirectory);
						if (filesData.length > 0) {
							this.editorService.openEditors(filesData.map(fileData => {
								return {
									resource: fileData.resource,
									contents: fileData.contents?.toString(),
									options: { pinned: true }
								};
							}));
						}
					}
				}
			});
		}

		await this.dialogService.prompt({
			type: Severity.Warning,
			message: localize('unsupportedBrowserMessage', "Opening Local Folders is Unsupported"),
			detail: localize('unsupportedBrowserDetail', "Your browser doesn't support opening local folders.\nYou can either open single files or open a remote repository."),
			buttons
		});

		return undefined;
	}

	private shouldUseSimplified(scheme: string): boolean {
		return ![Schemas.file, Schemas.vscodeUserData, Schemas.tmp].includes(scheme);
	}
}

registerSingleton(IFileDialogService, FileDialogService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

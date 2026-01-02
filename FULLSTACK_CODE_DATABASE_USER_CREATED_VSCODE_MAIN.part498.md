---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 498
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 498 of 552)

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

---[FILE: src/vs/workbench/services/commands/common/commandService.ts]---
Location: vscode-main/src/vs/workbench/services/commands/common/commandService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, notCancellablePromise, raceCancellablePromises, timeout } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { CommandsRegistry, ICommandEvent, ICommandService } from '../../../../platform/commands/common/commands.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IExtensionService } from '../../extensions/common/extensions.js';

export class CommandService extends Disposable implements ICommandService {

	declare readonly _serviceBrand: undefined;

	private _extensionHostIsReady: boolean = false;
	private _starActivation: CancelablePromise<void> | null;

	private readonly _onWillExecuteCommand: Emitter<ICommandEvent> = this._register(new Emitter<ICommandEvent>());
	public readonly onWillExecuteCommand: Event<ICommandEvent> = this._onWillExecuteCommand.event;

	private readonly _onDidExecuteCommand: Emitter<ICommandEvent> = new Emitter<ICommandEvent>();
	public readonly onDidExecuteCommand: Event<ICommandEvent> = this._onDidExecuteCommand.event;

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService
	) {
		super();
		this._extensionService.whenInstalledExtensionsRegistered().then(value => this._extensionHostIsReady = value);
		this._starActivation = null;
	}

	private _activateStar(): Promise<void> {
		if (!this._starActivation) {
			// wait for * activation, limited to at most 30s.
			this._starActivation = raceCancellablePromises([
				this._extensionService.activateByEvent(`*`),
				timeout(30000)
			]);
		}

		// This is wrapped with notCancellablePromise so it doesn't get cancelled
		// early because it is shared between consumers.
		return notCancellablePromise(this._starActivation);
	}

	async executeCommand<T>(id: string, ...args: unknown[]): Promise<T> {
		this._logService.trace('CommandService#executeCommand', id);

		const activationEvent = `onCommand:${id}`;
		const commandIsRegistered = !!CommandsRegistry.getCommand(id);

		if (commandIsRegistered) {

			// if the activation event has already resolved (i.e. subsequent call),
			// we will execute the registered command immediately
			if (this._extensionService.activationEventIsDone(activationEvent)) {
				return this._tryExecuteCommand(id, args);
			}

			// if the extension host didn't start yet, we will execute the registered
			// command immediately and send an activation event, but not wait for it
			if (!this._extensionHostIsReady) {
				this._extensionService.activateByEvent(activationEvent); // intentionally not awaited
				return this._tryExecuteCommand(id, args);
			}

			// we will wait for a simple activation event (e.g. in case an extension wants to overwrite it)
			await this._extensionService.activateByEvent(activationEvent);
			return this._tryExecuteCommand(id, args);
		}

		// finally, if the command is not registered we will send a simple activation event
		// as well as a * activation event raced against registration and against 30s
		await Promise.all([
			this._extensionService.activateByEvent(activationEvent),
			raceCancellablePromises<unknown>([
				// race * activation against command registration
				this._activateStar(),
				Event.toPromise(Event.filter(CommandsRegistry.onDidRegisterCommand, e => e === id))
			]),
		]);

		return this._tryExecuteCommand(id, args);
	}

	private _tryExecuteCommand(id: string, args: unknown[]): Promise<any> {
		const command = CommandsRegistry.getCommand(id);
		if (!command) {
			return Promise.reject(new Error(`command '${id}' not found`));
		}
		try {
			this._onWillExecuteCommand.fire({ commandId: id, args });
			const result = this._instantiationService.invokeFunction(command.handler, ...args);
			this._onDidExecuteCommand.fire({ commandId: id, args });
			return Promise.resolve(result);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	public override dispose(): void {
		super.dispose();
		this._starActivation?.cancel();
	}
}

registerSingleton(ICommandService, CommandService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/commands/test/common/commandService.test.ts]---
Location: vscode-main/src/vs/workbench/services/commands/test/common/commandService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { InstantiationService } from '../../../../../platform/instantiation/common/instantiationService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { NullExtensionService } from '../../../extensions/common/extensions.js';
import { CommandService } from '../../common/commandService.js';

suite('CommandService', function () {

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {
		store.add(CommandsRegistry.registerCommand('foo', function () { }));
	});

	test('activateOnCommand', () => {

		let lastEvent: string;

		const service = store.add(new CommandService(new InstantiationService(), new class extends NullExtensionService {
			override activateByEvent(activationEvent: string): Promise<void> {
				lastEvent = activationEvent;
				return super.activateByEvent(activationEvent);
			}
		}, new NullLogService()));

		return service.executeCommand('foo').then(() => {
			assert.ok(lastEvent, 'onCommand:foo');
			return service.executeCommand('unknownCommandId');
		}).then(() => {
			assert.ok(false);
		}, () => {
			assert.ok(lastEvent, 'onCommand:unknownCommandId');
		});
	});

	test('fwd activation error', async function () {

		const extensionService = new class extends NullExtensionService {
			override activateByEvent(activationEvent: string): Promise<void> {
				return Promise.reject(new Error('bad_activate'));
			}
		};

		const service = store.add(new CommandService(new InstantiationService(), extensionService, new NullLogService()));

		await extensionService.whenInstalledExtensionsRegistered();

		return service.executeCommand('foo').then(() => assert.ok(false), err => {
			assert.strictEqual(err.message, 'bad_activate');
		});
	});

	test('!onReady, but executeCommand', function () {

		let callCounter = 0;
		const reg = CommandsRegistry.registerCommand('bar', () => callCounter += 1);

		const service = store.add(new CommandService(new InstantiationService(), new class extends NullExtensionService {
			override whenInstalledExtensionsRegistered() {
				return new Promise<boolean>(_resolve => { /*ignore*/ });
			}
		}, new NullLogService()));

		service.executeCommand('bar');
		assert.strictEqual(callCounter, 1);
		reg.dispose();
	});

	test('issue #34913: !onReady, unknown command', function () {

		let callCounter = 0;
		let resolveFunc: Function;
		const whenInstalledExtensionsRegistered = new Promise<boolean>(_resolve => { resolveFunc = _resolve; });

		const service = store.add(new CommandService(new InstantiationService(), new class extends NullExtensionService {
			override whenInstalledExtensionsRegistered() {
				return whenInstalledExtensionsRegistered;
			}
		}, new NullLogService()));

		const r = service.executeCommand('bar');
		assert.strictEqual(callCounter, 0);

		const reg = CommandsRegistry.registerCommand('bar', () => callCounter += 1);
		resolveFunc!(true);

		return r.then(() => {
			reg.dispose();
			assert.strictEqual(callCounter, 1);
		});
	});

	test('Stop waiting for * extensions to activate when trigger is satisfied #62457', function () {

		let callCounter = 0;
		const disposable = new DisposableStore();
		const events: string[] = [];
		const service = store.add(new CommandService(new InstantiationService(), new class extends NullExtensionService {

			override activateByEvent(event: string): Promise<void> {
				events.push(event);
				if (event === '*') {
					return new Promise(() => { }); //forever promise...
				}
				if (event.indexOf('onCommand:') === 0) {
					return new Promise(resolve => {
						setTimeout(() => {
							const reg = CommandsRegistry.registerCommand(event.substr('onCommand:'.length), () => {
								callCounter += 1;
							});
							disposable.add(reg);
							resolve();
						}, 0);
					});
				}
				return Promise.resolve();
			}

		}, new NullLogService()));

		return service.executeCommand('farboo').then(() => {
			assert.strictEqual(callCounter, 1);
			assert.deepStrictEqual(events.sort(), ['*', 'onCommand:farboo'].sort());
		}).finally(() => {
			disposable.dispose();
		});
	});

	test('issue #71471: wait for onCommand activation even if a command is registered', () => {
		const expectedOrder: string[] = ['registering command', 'resolving activation event', 'executing command'];
		const actualOrder: string[] = [];
		const disposables = new DisposableStore();
		const service = store.add(new CommandService(new InstantiationService(), new class extends NullExtensionService {

			override activateByEvent(event: string): Promise<void> {
				if (event === '*') {
					return new Promise(() => { }); //forever promise...
				}
				if (event.indexOf('onCommand:') === 0) {
					return new Promise(resolve => {
						setTimeout(() => {
							// Register the command after some time
							actualOrder.push('registering command');
							const reg = CommandsRegistry.registerCommand(event.substr('onCommand:'.length), () => {
								actualOrder.push('executing command');
							});
							disposables.add(reg);

							setTimeout(() => {
								// Resolve the activation event after some more time
								actualOrder.push('resolving activation event');
								resolve();
							}, 10);
						}, 10);
					});
				}
				return Promise.resolve();
			}

		}, new NullLogService()));

		return service.executeCommand('farboo2').then(() => {
			assert.deepStrictEqual(actualOrder, expectedOrder);
		}).finally(() => {
			disposables.dispose();
		});
	});

	test('issue #142155: execute commands synchronously if possible', async () => {
		const actualOrder: string[] = [];

		const disposables = new DisposableStore();
		disposables.add(CommandsRegistry.registerCommand(`bizBaz`, () => {
			actualOrder.push('executing command');
		}));
		const extensionService = new class extends NullExtensionService {
			override activationEventIsDone(_activationEvent: string): boolean {
				return true;
			}
		};
		const service = store.add(new CommandService(new InstantiationService(), extensionService, new NullLogService()));

		await extensionService.whenInstalledExtensionsRegistered();

		try {
			actualOrder.push(`before call`);
			const promise = service.executeCommand('bizBaz');
			actualOrder.push(`after call`);
			await promise;
			actualOrder.push(`resolved`);
			assert.deepStrictEqual(actualOrder, [
				'before call',
				'executing command',
				'after call',
				'resolved'
			]);
		} finally {
			disposables.dispose();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/browser/configuration.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/browser/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import * as errors from '../../../../base/common/errors.js';
import { Disposable, IDisposable, dispose, toDisposable, MutableDisposable, combinedDisposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { FileChangeType, FileChangesEvent, IFileService, whenProviderRegistered, FileOperationError, FileOperationResult, FileOperation, FileOperationEvent } from '../../../../platform/files/common/files.js';
import { ConfigurationModel, ConfigurationModelParser, ConfigurationParseOptions, UserSettings } from '../../../../platform/configuration/common/configurationModels.js';
import { WorkspaceConfigurationModelParser, StandaloneConfigurationModelParser } from '../common/configurationModels.js';
import { TASKS_CONFIGURATION_KEY, FOLDER_SETTINGS_NAME, LAUNCH_CONFIGURATION_KEY, IConfigurationCache, ConfigurationKey, REMOTE_MACHINE_SCOPES, FOLDER_SCOPES, WORKSPACE_SCOPES, APPLY_ALL_PROFILES_SETTING, APPLICATION_SCOPES, MCP_CONFIGURATION_KEY } from '../common/configuration.js';
import { IStoredWorkspaceFolder } from '../../../../platform/workspaces/common/workspaces.js';
import { WorkbenchState, IWorkspaceFolder, IWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry, OVERRIDE_PROPERTY_REGEX } from '../../../../platform/configuration/common/configurationRegistry.js';
import { equals } from '../../../../base/common/objects.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { hash } from '../../../../base/common/hash.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { joinPath } from '../../../../base/common/resources.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { isEmptyObject, isObject } from '../../../../base/common/types.js';
import { DefaultConfiguration as BaseDefaultConfiguration } from '../../../../platform/configuration/common/configurations.js';
import { IJSONEditingService } from '../common/jsonEditing.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';

export class DefaultConfiguration extends BaseDefaultConfiguration {

	static readonly DEFAULT_OVERRIDES_CACHE_EXISTS_KEY = 'DefaultOverridesCacheExists';

	private readonly configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	private cachedConfigurationDefaultsOverrides: IStringDictionary<unknown> = {};
	private readonly cacheKey: ConfigurationKey = { type: 'defaults', key: 'configurationDefaultsOverrides' };

	constructor(
		private readonly configurationCache: IConfigurationCache,
		environmentService: IBrowserWorkbenchEnvironmentService,
		logService: ILogService,
	) {
		super(logService);
		if (environmentService.options?.configurationDefaults) {
			this.configurationRegistry.registerDefaultConfigurations([{ overrides: environmentService.options.configurationDefaults as IStringDictionary<IStringDictionary<unknown>> }]);
		}
	}

	protected override getConfigurationDefaultOverrides(): IStringDictionary<unknown> {
		return this.cachedConfigurationDefaultsOverrides;
	}

	override async initialize(): Promise<ConfigurationModel> {
		await this.initializeCachedConfigurationDefaultsOverrides();
		return super.initialize();
	}

	override reload(): ConfigurationModel {
		this.cachedConfigurationDefaultsOverrides = {};
		this.updateCachedConfigurationDefaultsOverrides();
		return super.reload();
	}

	hasCachedConfigurationDefaultsOverrides(): boolean {
		return !isEmptyObject(this.cachedConfigurationDefaultsOverrides);
	}

	private initiaizeCachedConfigurationDefaultsOverridesPromise: Promise<void> | undefined;
	private initializeCachedConfigurationDefaultsOverrides(): Promise<void> {
		if (!this.initiaizeCachedConfigurationDefaultsOverridesPromise) {
			this.initiaizeCachedConfigurationDefaultsOverridesPromise = (async () => {
				try {
					// Read only when the cache exists
					if (localStorage.getItem(DefaultConfiguration.DEFAULT_OVERRIDES_CACHE_EXISTS_KEY)) {
						const content = await this.configurationCache.read(this.cacheKey);
						if (content) {
							this.cachedConfigurationDefaultsOverrides = JSON.parse(content);
						}
					}
				} catch (error) { /* ignore */ }
				this.cachedConfigurationDefaultsOverrides = isObject(this.cachedConfigurationDefaultsOverrides) ? this.cachedConfigurationDefaultsOverrides : {};
			})();
		}
		return this.initiaizeCachedConfigurationDefaultsOverridesPromise;
	}

	protected override onDidUpdateConfiguration(properties: string[], defaultsOverrides?: boolean): void {
		super.onDidUpdateConfiguration(properties, defaultsOverrides);
		if (defaultsOverrides) {
			this.updateCachedConfigurationDefaultsOverrides();
		}
	}

	private async updateCachedConfigurationDefaultsOverrides(): Promise<void> {
		const cachedConfigurationDefaultsOverrides: IStringDictionary<unknown> = {};
		const configurationDefaultsOverrides = this.configurationRegistry.getConfigurationDefaultsOverrides();
		for (const [key, value] of configurationDefaultsOverrides) {
			if (!OVERRIDE_PROPERTY_REGEX.test(key) && value.value !== undefined) {
				cachedConfigurationDefaultsOverrides[key] = value.value;
			}
		}
		try {
			if (Object.keys(cachedConfigurationDefaultsOverrides).length) {
				localStorage.setItem(DefaultConfiguration.DEFAULT_OVERRIDES_CACHE_EXISTS_KEY, 'yes');
				await this.configurationCache.write(this.cacheKey, JSON.stringify(cachedConfigurationDefaultsOverrides));
			} else {
				localStorage.removeItem(DefaultConfiguration.DEFAULT_OVERRIDES_CACHE_EXISTS_KEY);
				await this.configurationCache.remove(this.cacheKey);
			}
		} catch (error) {/* Ignore error */ }
	}

}

export class ApplicationConfiguration extends UserSettings {

	private readonly _onDidChangeConfiguration: Emitter<ConfigurationModel> = this._register(new Emitter<ConfigurationModel>());
	readonly onDidChangeConfiguration: Event<ConfigurationModel> = this._onDidChangeConfiguration.event;

	private readonly reloadConfigurationScheduler: RunOnceScheduler;

	constructor(
		userDataProfilesService: IUserDataProfilesService,
		fileService: IFileService,
		uriIdentityService: IUriIdentityService,
		logService: ILogService,
	) {
		super(userDataProfilesService.defaultProfile.settingsResource, { scopes: APPLICATION_SCOPES, skipUnregistered: true }, uriIdentityService.extUri, fileService, logService);
		this._register(this.onDidChange(() => this.reloadConfigurationScheduler.schedule()));
		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.loadConfiguration().then(configurationModel => this._onDidChangeConfiguration.fire(configurationModel)), 50));
	}

	async initialize(): Promise<ConfigurationModel> {
		return this.loadConfiguration();
	}

	override async loadConfiguration(): Promise<ConfigurationModel> {
		const model = await super.loadConfiguration();
		const value = model.getValue<string[]>(APPLY_ALL_PROFILES_SETTING);
		const allProfilesSettings = Array.isArray(value) ? value : [];
		return this.parseOptions.include || allProfilesSettings.length
			? this.reparse({ ...this.parseOptions, include: allProfilesSettings })
			: model;
	}
}

export class UserConfiguration extends Disposable {

	private readonly _onDidChangeConfiguration: Emitter<ConfigurationModel> = this._register(new Emitter<ConfigurationModel>());
	readonly onDidChangeConfiguration: Event<ConfigurationModel> = this._onDidChangeConfiguration.event;

	private readonly userConfiguration = this._register(new MutableDisposable<UserSettings | FileServiceBasedConfiguration>());
	private readonly userConfigurationChangeDisposable = this._register(new MutableDisposable<IDisposable>());
	private readonly reloadConfigurationScheduler: RunOnceScheduler;

	get hasTasksLoaded(): boolean { return this.userConfiguration.value instanceof FileServiceBasedConfiguration; }

	constructor(
		private settingsResource: URI,
		private tasksResource: URI | undefined,
		private mcpResource: URI | undefined,
		private configurationParseOptions: ConfigurationParseOptions,
		private readonly fileService: IFileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();
		this.userConfiguration.value = new UserSettings(settingsResource, this.configurationParseOptions, uriIdentityService.extUri, this.fileService, logService);
		this.userConfigurationChangeDisposable.value = this.userConfiguration.value.onDidChange(() => this.reloadConfigurationScheduler.schedule());
		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.userConfiguration.value!.loadConfiguration().then(configurationModel => this._onDidChangeConfiguration.fire(configurationModel)), 50));
	}

	async reset(settingsResource: URI, tasksResource: URI | undefined, mcpResource: URI | undefined, configurationParseOptions: ConfigurationParseOptions): Promise<ConfigurationModel> {
		this.settingsResource = settingsResource;
		this.tasksResource = tasksResource;
		this.mcpResource = mcpResource;
		this.configurationParseOptions = configurationParseOptions;
		return this.doReset();
	}

	private async doReset(settingsConfiguration?: ConfigurationModel): Promise<ConfigurationModel> {
		const folder = this.uriIdentityService.extUri.dirname(this.settingsResource);
		const standAloneConfigurationResources: [string, URI][] = [];
		if (this.tasksResource) {
			standAloneConfigurationResources.push([TASKS_CONFIGURATION_KEY, this.tasksResource]);
		}
		if (this.mcpResource) {
			standAloneConfigurationResources.push([MCP_CONFIGURATION_KEY, this.mcpResource]);
		}
		const fileServiceBasedConfiguration = new FileServiceBasedConfiguration(folder.toString(), this.settingsResource, standAloneConfigurationResources, this.configurationParseOptions, this.fileService, this.uriIdentityService, this.logService);
		const configurationModel = await fileServiceBasedConfiguration.loadConfiguration(settingsConfiguration);
		this.userConfiguration.value = fileServiceBasedConfiguration;

		// Check for value because userConfiguration might have been disposed.
		if (this.userConfigurationChangeDisposable.value) {
			this.userConfigurationChangeDisposable.value = this.userConfiguration.value.onDidChange(() => this.reloadConfigurationScheduler.schedule());
		}

		return configurationModel;
	}

	async initialize(): Promise<ConfigurationModel> {
		return this.userConfiguration.value!.loadConfiguration();
	}

	async reload(settingsConfiguration?: ConfigurationModel): Promise<ConfigurationModel> {
		if (this.hasTasksLoaded) {
			return this.userConfiguration.value!.loadConfiguration();
		}
		return this.doReset(settingsConfiguration);
	}

	reparse(parseOptions?: Partial<ConfigurationParseOptions>): ConfigurationModel {
		this.configurationParseOptions = { ...this.configurationParseOptions, ...parseOptions };
		return this.userConfiguration.value!.reparse(this.configurationParseOptions);
	}

	getRestrictedSettings(): string[] {
		return this.userConfiguration.value!.getRestrictedSettings();
	}
}

class FileServiceBasedConfiguration extends Disposable {

	private readonly allResources: URI[];
	private _folderSettingsModelParser: ConfigurationModelParser;
	private _folderSettingsParseOptions: ConfigurationParseOptions;
	private _standAloneConfigurations: ConfigurationModel[];
	private _cache: ConfigurationModel;

	private readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(
		name: string,
		private readonly settingsResource: URI,
		private readonly standAloneConfigurationResources: [string, URI][],
		configurationParseOptions: ConfigurationParseOptions,
		private readonly fileService: IFileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();
		this.allResources = [this.settingsResource, ...this.standAloneConfigurationResources.map(([, resource]) => resource)];
		this._register(combinedDisposable(...this.allResources.map(resource => combinedDisposable(
			this.fileService.watch(uriIdentityService.extUri.dirname(resource)),
			// Also listen to the resource incase the resource is a symlink - https://github.com/microsoft/vscode/issues/118134
			this.fileService.watch(resource)
		))));

		this._folderSettingsModelParser = new ConfigurationModelParser(name, logService);
		this._folderSettingsParseOptions = configurationParseOptions;
		this._standAloneConfigurations = [];
		this._cache = ConfigurationModel.createEmptyModel(this.logService);

		this._register(Event.debounce(
			Event.any(
				Event.filter(this.fileService.onDidFilesChange, e => this.handleFileChangesEvent(e)),
				Event.filter(this.fileService.onDidRunOperation, e => this.handleFileOperationEvent(e))
			), () => undefined, 100)(() => this._onDidChange.fire()));
	}

	async resolveContents(donotResolveSettings?: boolean): Promise<[string | undefined, [string, string | undefined][]]> {

		const resolveContents = async (resources: URI[]): Promise<(string | undefined)[]> => {
			return Promise.all(resources.map(async resource => {
				try {
					const content = await this.fileService.readFile(resource, { atomic: true });
					return content.value.toString();
				} catch (error) {
					this.logService.trace(`Error while resolving configuration file '${resource.toString()}': ${errors.getErrorMessage(error)}`);
					if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND
						&& (<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_DIRECTORY) {
						this.logService.error(error);
					}
				}
				return '{}';
			}));
		};

		const [[settingsContent], standAloneConfigurationContents] = await Promise.all([
			donotResolveSettings ? Promise.resolve([undefined]) : resolveContents([this.settingsResource]),
			resolveContents(this.standAloneConfigurationResources.map(([, resource]) => resource)),
		]);

		return [settingsContent, standAloneConfigurationContents.map((content, index) => ([this.standAloneConfigurationResources[index][0], content]))];
	}

	async loadConfiguration(settingsConfiguration?: ConfigurationModel): Promise<ConfigurationModel> {

		const [settingsContent, standAloneConfigurationContents] = await this.resolveContents(!!settingsConfiguration);

		// reset
		this._standAloneConfigurations = [];
		this._folderSettingsModelParser.parse('', this._folderSettingsParseOptions);

		// parse
		if (settingsContent !== undefined) {
			this._folderSettingsModelParser.parse(settingsContent, this._folderSettingsParseOptions);
		}
		for (let index = 0; index < standAloneConfigurationContents.length; index++) {
			const contents = standAloneConfigurationContents[index][1];
			if (contents !== undefined) {
				const standAloneConfigurationModelParser = new StandaloneConfigurationModelParser(this.standAloneConfigurationResources[index][1].toString(), this.standAloneConfigurationResources[index][0], this.logService);
				standAloneConfigurationModelParser.parse(contents);
				this._standAloneConfigurations.push(standAloneConfigurationModelParser.configurationModel);
			}
		}

		// Consolidate (support *.json files in the workspace settings folder)
		this.consolidate(settingsConfiguration);

		return this._cache;
	}

	getRestrictedSettings(): string[] {
		return this._folderSettingsModelParser.restrictedConfigurations;
	}

	reparse(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		const oldContents = this._folderSettingsModelParser.configurationModel.contents;
		this._folderSettingsParseOptions = configurationParseOptions;
		this._folderSettingsModelParser.reparse(this._folderSettingsParseOptions);
		if (!equals(oldContents, this._folderSettingsModelParser.configurationModel.contents)) {
			this.consolidate();
		}
		return this._cache;
	}

	private consolidate(settingsConfiguration?: ConfigurationModel): void {
		this._cache = (settingsConfiguration ?? this._folderSettingsModelParser.configurationModel).merge(...this._standAloneConfigurations);
	}

	private handleFileChangesEvent(event: FileChangesEvent): boolean {
		// One of the resources has changed
		if (this.allResources.some(resource => event.contains(resource))) {
			return true;
		}
		// One of the resource's parent got deleted
		if (this.allResources.some(resource => event.contains(this.uriIdentityService.extUri.dirname(resource), FileChangeType.DELETED))) {
			return true;
		}
		return false;
	}

	private handleFileOperationEvent(event: FileOperationEvent): boolean {
		// One of the resources has changed
		if ((event.isOperation(FileOperation.CREATE) || event.isOperation(FileOperation.COPY) || event.isOperation(FileOperation.DELETE) || event.isOperation(FileOperation.WRITE))
			&& this.allResources.some(resource => this.uriIdentityService.extUri.isEqual(event.resource, resource))) {
			return true;
		}
		// One of the resource's parent got deleted
		if (event.isOperation(FileOperation.DELETE) && this.allResources.some(resource => this.uriIdentityService.extUri.isEqual(event.resource, this.uriIdentityService.extUri.dirname(resource)))) {
			return true;
		}
		return false;
	}

}

export class RemoteUserConfiguration extends Disposable {

	private readonly _cachedConfiguration: CachedRemoteUserConfiguration;
	private readonly _fileService: IFileService;
	private _userConfiguration: FileServiceBasedRemoteUserConfiguration | CachedRemoteUserConfiguration;
	private _userConfigurationInitializationPromise: Promise<ConfigurationModel> | null = null;

	private readonly _onDidChangeConfiguration: Emitter<ConfigurationModel> = this._register(new Emitter<ConfigurationModel>());
	public readonly onDidChangeConfiguration: Event<ConfigurationModel> = this._onDidChangeConfiguration.event;

	private readonly _onDidInitialize = this._register(new Emitter<ConfigurationModel>());
	public readonly onDidInitialize = this._onDidInitialize.event;

	constructor(
		remoteAuthority: string,
		configurationCache: IConfigurationCache,
		fileService: IFileService,
		uriIdentityService: IUriIdentityService,
		remoteAgentService: IRemoteAgentService,
		logService: ILogService
	) {
		super();
		this._fileService = fileService;
		this._userConfiguration = this._cachedConfiguration = new CachedRemoteUserConfiguration(remoteAuthority, configurationCache, { scopes: REMOTE_MACHINE_SCOPES }, logService);
		remoteAgentService.getEnvironment().then(async environment => {
			if (environment) {
				const userConfiguration = this._register(new FileServiceBasedRemoteUserConfiguration(environment.settingsPath, { scopes: REMOTE_MACHINE_SCOPES }, this._fileService, uriIdentityService, logService));
				this._register(userConfiguration.onDidChangeConfiguration(configurationModel => this.onDidUserConfigurationChange(configurationModel)));
				this._userConfigurationInitializationPromise = userConfiguration.initialize();
				const configurationModel = await this._userConfigurationInitializationPromise;
				this._userConfiguration.dispose();
				this._userConfiguration = userConfiguration;
				this.onDidUserConfigurationChange(configurationModel);
				this._onDidInitialize.fire(configurationModel);
			}
		});
	}

	async initialize(): Promise<ConfigurationModel> {
		if (this._userConfiguration instanceof FileServiceBasedRemoteUserConfiguration) {
			return this._userConfiguration.initialize();
		}

		// Initialize cached configuration
		let configurationModel = await this._userConfiguration.initialize();
		if (this._userConfigurationInitializationPromise) {
			// Use user configuration
			configurationModel = await this._userConfigurationInitializationPromise;
			this._userConfigurationInitializationPromise = null;
		}

		return configurationModel;
	}

	reload(): Promise<ConfigurationModel> {
		return this._userConfiguration.reload();
	}

	reparse(): ConfigurationModel {
		return this._userConfiguration.reparse({ scopes: REMOTE_MACHINE_SCOPES });
	}

	getRestrictedSettings(): string[] {
		return this._userConfiguration.getRestrictedSettings();
	}

	private onDidUserConfigurationChange(configurationModel: ConfigurationModel): void {
		this.updateCache();
		this._onDidChangeConfiguration.fire(configurationModel);
	}

	private async updateCache(): Promise<void> {
		if (this._userConfiguration instanceof FileServiceBasedRemoteUserConfiguration) {
			let content: string | undefined;
			try {
				content = await this._userConfiguration.resolveContent();
			} catch (error) {
				if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
					return;
				}
			}
			await this._cachedConfiguration.updateConfiguration(content);
		}
	}

}

class FileServiceBasedRemoteUserConfiguration extends Disposable {

	private readonly parser: ConfigurationModelParser;
	private parseOptions: ConfigurationParseOptions;
	private readonly reloadConfigurationScheduler: RunOnceScheduler;
	protected readonly _onDidChangeConfiguration: Emitter<ConfigurationModel> = this._register(new Emitter<ConfigurationModel>());
	readonly onDidChangeConfiguration: Event<ConfigurationModel> = this._onDidChangeConfiguration.event;

	private readonly fileWatcherDisposable = this._register(new MutableDisposable());
	private readonly directoryWatcherDisposable = this._register(new MutableDisposable());

	constructor(
		private readonly configurationResource: URI,
		configurationParseOptions: ConfigurationParseOptions,
		private readonly fileService: IFileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();

		this.parser = new ConfigurationModelParser(this.configurationResource.toString(), logService);
		this.parseOptions = configurationParseOptions;
		this._register(fileService.onDidFilesChange(e => this.handleFileChangesEvent(e)));
		this._register(fileService.onDidRunOperation(e => this.handleFileOperationEvent(e)));
		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.reload().then(configurationModel => this._onDidChangeConfiguration.fire(configurationModel)), 50));
		this._register(toDisposable(() => {
			this.stopWatchingResource();
			this.stopWatchingDirectory();
		}));
	}

	private watchResource(): void {
		this.fileWatcherDisposable.value = this.fileService.watch(this.configurationResource);
	}

	private stopWatchingResource(): void {
		this.fileWatcherDisposable.value = undefined;
	}

	private watchDirectory(): void {
		const directory = this.uriIdentityService.extUri.dirname(this.configurationResource);
		this.directoryWatcherDisposable.value = this.fileService.watch(directory);
	}

	private stopWatchingDirectory(): void {
		this.directoryWatcherDisposable.value = undefined;
	}

	async initialize(): Promise<ConfigurationModel> {
		const exists = await this.fileService.exists(this.configurationResource);
		this.onResourceExists(exists);
		return this.reload();
	}

	async resolveContent(): Promise<string> {
		const content = await this.fileService.readFile(this.configurationResource, { atomic: true });
		return content.value.toString();
	}

	async reload(): Promise<ConfigurationModel> {
		try {
			const content = await this.resolveContent();
			this.parser.parse(content, this.parseOptions);
			return this.parser.configurationModel;
		} catch (e) {
			return ConfigurationModel.createEmptyModel(this.logService);
		}
	}

	reparse(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		this.parseOptions = configurationParseOptions;
		this.parser.reparse(this.parseOptions);
		return this.parser.configurationModel;
	}

	getRestrictedSettings(): string[] {
		return this.parser.restrictedConfigurations;
	}

	private handleFileChangesEvent(event: FileChangesEvent): void {

		// Find changes that affect the resource
		let affectedByChanges = false;
		if (event.contains(this.configurationResource, FileChangeType.ADDED)) {
			affectedByChanges = true;
			this.onResourceExists(true);
		} else if (event.contains(this.configurationResource, FileChangeType.DELETED)) {
			affectedByChanges = true;
			this.onResourceExists(false);
		} else if (event.contains(this.configurationResource, FileChangeType.UPDATED)) {
			affectedByChanges = true;
		}

		if (affectedByChanges) {
			this.reloadConfigurationScheduler.schedule();
		}
	}

	private handleFileOperationEvent(event: FileOperationEvent): void {
		if ((event.isOperation(FileOperation.CREATE) || event.isOperation(FileOperation.COPY) || event.isOperation(FileOperation.DELETE) || event.isOperation(FileOperation.WRITE))
			&& this.uriIdentityService.extUri.isEqual(event.resource, this.configurationResource)) {
			this.reloadConfigurationScheduler.schedule();
		}
	}

	private onResourceExists(exists: boolean): void {
		if (exists) {
			this.stopWatchingDirectory();
			this.watchResource();
		} else {
			this.stopWatchingResource();
			this.watchDirectory();
		}
	}
}

class CachedRemoteUserConfiguration extends Disposable {

	private readonly _onDidChange: Emitter<ConfigurationModel> = this._register(new Emitter<ConfigurationModel>());
	readonly onDidChange: Event<ConfigurationModel> = this._onDidChange.event;

	private readonly key: ConfigurationKey;
	private readonly parser: ConfigurationModelParser;
	private parseOptions: ConfigurationParseOptions;
	private configurationModel: ConfigurationModel;

	constructor(
		remoteAuthority: string,
		private readonly configurationCache: IConfigurationCache,
		configurationParseOptions: ConfigurationParseOptions,
		logService: ILogService,
	) {
		super();
		this.key = { type: 'user', key: remoteAuthority };
		this.parser = new ConfigurationModelParser('CachedRemoteUserConfiguration', logService);
		this.parseOptions = configurationParseOptions;
		this.configurationModel = ConfigurationModel.createEmptyModel(logService);
	}

	getConfigurationModel(): ConfigurationModel {
		return this.configurationModel;
	}

	initialize(): Promise<ConfigurationModel> {
		return this.reload();
	}

	reparse(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		this.parseOptions = configurationParseOptions;
		this.parser.reparse(this.parseOptions);
		this.configurationModel = this.parser.configurationModel;
		return this.configurationModel;
	}

	getRestrictedSettings(): string[] {
		return this.parser.restrictedConfigurations;
	}

	async reload(): Promise<ConfigurationModel> {
		try {
			const content = await this.configurationCache.read(this.key);
			const parsed: { content: string } = JSON.parse(content);
			if (parsed.content) {
				this.parser.parse(parsed.content, this.parseOptions);
				this.configurationModel = this.parser.configurationModel;
			}
		} catch (e) { /* Ignore error */ }
		return this.configurationModel;
	}

	async updateConfiguration(content: string | undefined): Promise<void> {
		if (content) {
			return this.configurationCache.write(this.key, JSON.stringify({ content }));
		} else {
			return this.configurationCache.remove(this.key);
		}
	}
}

export class WorkspaceConfiguration extends Disposable {

	private readonly _cachedConfiguration: CachedWorkspaceConfiguration;
	private _workspaceConfiguration: CachedWorkspaceConfiguration | FileServiceBasedWorkspaceConfiguration;
	private readonly _workspaceConfigurationDisposables = this._register(new DisposableStore());
	private _workspaceIdentifier: IWorkspaceIdentifier | null = null;
	private _isWorkspaceTrusted: boolean = false;

	private readonly _onDidUpdateConfiguration = this._register(new Emitter<boolean>());
	public readonly onDidUpdateConfiguration = this._onDidUpdateConfiguration.event;

	private _initialized: boolean = false;
	get initialized(): boolean { return this._initialized; }
	constructor(
		private readonly configurationCache: IConfigurationCache,
		private readonly fileService: IFileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();
		this.fileService = fileService;
		this._workspaceConfiguration = this._cachedConfiguration = new CachedWorkspaceConfiguration(configurationCache, logService);
	}

	async initialize(workspaceIdentifier: IWorkspaceIdentifier, workspaceTrusted: boolean): Promise<void> {
		this._workspaceIdentifier = workspaceIdentifier;
		this._isWorkspaceTrusted = workspaceTrusted;
		if (!this._initialized) {
			if (this.configurationCache.needsCaching(this._workspaceIdentifier.configPath)) {
				this._workspaceConfiguration = this._cachedConfiguration;
				this.waitAndInitialize(this._workspaceIdentifier);
			} else {
				this.doInitialize(new FileServiceBasedWorkspaceConfiguration(this.fileService, this.uriIdentityService, this.logService));
			}
		}
		await this.reload();
	}

	async reload(): Promise<void> {
		if (this._workspaceIdentifier) {
			await this._workspaceConfiguration.load(this._workspaceIdentifier, { scopes: WORKSPACE_SCOPES, skipRestricted: this.isUntrusted() });
		}
	}

	getFolders(): IStoredWorkspaceFolder[] {
		return this._workspaceConfiguration.getFolders();
	}

	setFolders(folders: IStoredWorkspaceFolder[], jsonEditingService: IJSONEditingService): Promise<void> {
		if (this._workspaceIdentifier) {
			return jsonEditingService.write(this._workspaceIdentifier.configPath, [{ path: ['folders'], value: folders }], true)
				.then(() => this.reload());
		}
		return Promise.resolve();
	}

	isTransient(): boolean {
		return this._workspaceConfiguration.isTransient();
	}

	getConfiguration(): ConfigurationModel {
		return this._workspaceConfiguration.getWorkspaceSettings();
	}

	updateWorkspaceTrust(trusted: boolean): ConfigurationModel {
		this._isWorkspaceTrusted = trusted;
		return this.reparseWorkspaceSettings();
	}

	reparseWorkspaceSettings(): ConfigurationModel {
		this._workspaceConfiguration.reparseWorkspaceSettings({ scopes: WORKSPACE_SCOPES, skipRestricted: this.isUntrusted() });
		return this.getConfiguration();
	}

	getRestrictedSettings(): string[] {
		return this._workspaceConfiguration.getRestrictedSettings();
	}

	private async waitAndInitialize(workspaceIdentifier: IWorkspaceIdentifier): Promise<void> {
		await whenProviderRegistered(workspaceIdentifier.configPath, this.fileService);
		if (!(this._workspaceConfiguration instanceof FileServiceBasedWorkspaceConfiguration)) {
			const fileServiceBasedWorkspaceConfiguration = this._register(new FileServiceBasedWorkspaceConfiguration(this.fileService, this.uriIdentityService, this.logService));
			await fileServiceBasedWorkspaceConfiguration.load(workspaceIdentifier, { scopes: WORKSPACE_SCOPES, skipRestricted: this.isUntrusted() });
			this.doInitialize(fileServiceBasedWorkspaceConfiguration);
			this.onDidWorkspaceConfigurationChange(false, true);
		}
	}

	private doInitialize(fileServiceBasedWorkspaceConfiguration: FileServiceBasedWorkspaceConfiguration): void {
		this._workspaceConfigurationDisposables.clear();
		this._workspaceConfiguration = this._workspaceConfigurationDisposables.add(fileServiceBasedWorkspaceConfiguration);
		this._workspaceConfigurationDisposables.add(this._workspaceConfiguration.onDidChange(e => this.onDidWorkspaceConfigurationChange(true, false)));
		this._initialized = true;
	}

	private isUntrusted(): boolean {
		return !this._isWorkspaceTrusted;
	}

	private async onDidWorkspaceConfigurationChange(reload: boolean, fromCache: boolean): Promise<void> {
		if (reload) {
			await this.reload();
		}
		this.updateCache();
		this._onDidUpdateConfiguration.fire(fromCache);
	}

	private async updateCache(): Promise<void> {
		if (this._workspaceIdentifier && this.configurationCache.needsCaching(this._workspaceIdentifier.configPath) && this._workspaceConfiguration instanceof FileServiceBasedWorkspaceConfiguration) {
			const content = await this._workspaceConfiguration.resolveContent(this._workspaceIdentifier);
			await this._cachedConfiguration.updateWorkspace(this._workspaceIdentifier, content);
		}
	}
}

class FileServiceBasedWorkspaceConfiguration extends Disposable {

	workspaceConfigurationModelParser: WorkspaceConfigurationModelParser;
	workspaceSettings: ConfigurationModel;
	private _workspaceIdentifier: IWorkspaceIdentifier | null = null;
	private workspaceConfigWatcher: IDisposable;
	private readonly reloadConfigurationScheduler: RunOnceScheduler;

	protected readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(
		private readonly fileService: IFileService,
		uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
	) {
		super();

		this.workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser('', logService);
		this.workspaceSettings = ConfigurationModel.createEmptyModel(logService);

		this._register(Event.any(
			Event.filter(this.fileService.onDidFilesChange, e => !!this._workspaceIdentifier && e.contains(this._workspaceIdentifier.configPath)),
			Event.filter(this.fileService.onDidRunOperation, e => !!this._workspaceIdentifier && (e.isOperation(FileOperation.CREATE) || e.isOperation(FileOperation.COPY) || e.isOperation(FileOperation.DELETE) || e.isOperation(FileOperation.WRITE)) && uriIdentityService.extUri.isEqual(e.resource, this._workspaceIdentifier.configPath))
		)(() => this.reloadConfigurationScheduler.schedule()));
		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this._onDidChange.fire(), 50));
		this.workspaceConfigWatcher = this._register(this.watchWorkspaceConfigurationFile());
	}

	get workspaceIdentifier(): IWorkspaceIdentifier | null {
		return this._workspaceIdentifier;
	}

	async resolveContent(workspaceIdentifier: IWorkspaceIdentifier): Promise<string> {
		const content = await this.fileService.readFile(workspaceIdentifier.configPath, { atomic: true });
		return content.value.toString();
	}

	async load(workspaceIdentifier: IWorkspaceIdentifier, configurationParseOptions: ConfigurationParseOptions): Promise<void> {
		if (!this._workspaceIdentifier || this._workspaceIdentifier.id !== workspaceIdentifier.id) {
			this._workspaceIdentifier = workspaceIdentifier;
			this.workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser(this._workspaceIdentifier.id, this.logService);
			dispose(this.workspaceConfigWatcher);
			this.workspaceConfigWatcher = this._register(this.watchWorkspaceConfigurationFile());
		}
		let contents = '';
		try {
			contents = await this.resolveContent(this._workspaceIdentifier);
		} catch (error) {
			const exists = await this.fileService.exists(this._workspaceIdentifier.configPath);
			if (exists) {
				this.logService.error(error);
			}
		}
		this.workspaceConfigurationModelParser.parse(contents, configurationParseOptions);
		this.consolidate();
	}

	getConfigurationModel(): ConfigurationModel {
		return this.workspaceConfigurationModelParser.configurationModel;
	}

	getFolders(): IStoredWorkspaceFolder[] {
		return this.workspaceConfigurationModelParser.folders;
	}

	isTransient(): boolean {
		return this.workspaceConfigurationModelParser.transient;
	}

	getWorkspaceSettings(): ConfigurationModel {
		return this.workspaceSettings;
	}

	reparseWorkspaceSettings(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		this.workspaceConfigurationModelParser.reparseWorkspaceSettings(configurationParseOptions);
		this.consolidate();
		return this.getWorkspaceSettings();
	}

	getRestrictedSettings(): string[] {
		return this.workspaceConfigurationModelParser.getRestrictedWorkspaceSettings();
	}

	private consolidate(): void {
		this.workspaceSettings = this.workspaceConfigurationModelParser.settingsModel.merge(this.workspaceConfigurationModelParser.launchModel, this.workspaceConfigurationModelParser.tasksModel);
	}

	private watchWorkspaceConfigurationFile(): IDisposable {
		return this._workspaceIdentifier ? this.fileService.watch(this._workspaceIdentifier.configPath) : Disposable.None;
	}

}

class CachedWorkspaceConfiguration {

	readonly onDidChange: Event<void> = Event.None;

	workspaceConfigurationModelParser: WorkspaceConfigurationModelParser;
	workspaceSettings: ConfigurationModel;

	constructor(
		private readonly configurationCache: IConfigurationCache,
		private readonly logService: ILogService
	) {
		this.workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser('', logService);
		this.workspaceSettings = ConfigurationModel.createEmptyModel(logService);
	}

	async load(workspaceIdentifier: IWorkspaceIdentifier, configurationParseOptions: ConfigurationParseOptions): Promise<void> {
		try {
			const key = this.getKey(workspaceIdentifier);
			const contents = await this.configurationCache.read(key);
			const parsed: { content: string } = JSON.parse(contents);
			if (parsed.content) {
				this.workspaceConfigurationModelParser = new WorkspaceConfigurationModelParser(key.key, this.logService);
				this.workspaceConfigurationModelParser.parse(parsed.content, configurationParseOptions);
				this.consolidate();
			}
		} catch (e) {
		}
	}

	get workspaceIdentifier(): IWorkspaceIdentifier | null {
		return null;
	}

	getConfigurationModel(): ConfigurationModel {
		return this.workspaceConfigurationModelParser.configurationModel;
	}

	getFolders(): IStoredWorkspaceFolder[] {
		return this.workspaceConfigurationModelParser.folders;
	}

	isTransient(): boolean {
		return this.workspaceConfigurationModelParser.transient;
	}

	getWorkspaceSettings(): ConfigurationModel {
		return this.workspaceSettings;
	}

	reparseWorkspaceSettings(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		this.workspaceConfigurationModelParser.reparseWorkspaceSettings(configurationParseOptions);
		this.consolidate();
		return this.getWorkspaceSettings();
	}

	getRestrictedSettings(): string[] {
		return this.workspaceConfigurationModelParser.getRestrictedWorkspaceSettings();
	}

	private consolidate(): void {
		this.workspaceSettings = this.workspaceConfigurationModelParser.settingsModel.merge(this.workspaceConfigurationModelParser.launchModel, this.workspaceConfigurationModelParser.tasksModel);
	}

	async updateWorkspace(workspaceIdentifier: IWorkspaceIdentifier, content: string | undefined): Promise<void> {
		try {
			const key = this.getKey(workspaceIdentifier);
			if (content) {
				await this.configurationCache.write(key, JSON.stringify({ content }));
			} else {
				await this.configurationCache.remove(key);
			}
		} catch (error) {
		}
	}

	private getKey(workspaceIdentifier: IWorkspaceIdentifier): ConfigurationKey {
		return {
			type: 'workspaces',
			key: workspaceIdentifier.id
		};
	}
}

class CachedFolderConfiguration {

	readonly onDidChange = Event.None;

	private _folderSettingsModelParser: ConfigurationModelParser;
	private _folderSettingsParseOptions: ConfigurationParseOptions;
	private _standAloneConfigurations: ConfigurationModel[];
	private configurationModel: ConfigurationModel;
	private readonly key: ConfigurationKey;

	constructor(
		folder: URI,
		configFolderRelativePath: string,
		configurationParseOptions: ConfigurationParseOptions,
		private readonly configurationCache: IConfigurationCache,
		private readonly logService: ILogService
	) {
		this.key = { type: 'folder', key: hash(joinPath(folder, configFolderRelativePath).toString()).toString(16) };
		this._folderSettingsModelParser = new ConfigurationModelParser('CachedFolderConfiguration', logService);
		this._folderSettingsParseOptions = configurationParseOptions;
		this._standAloneConfigurations = [];
		this.configurationModel = ConfigurationModel.createEmptyModel(logService);
	}

	async loadConfiguration(): Promise<ConfigurationModel> {
		try {
			const contents = await this.configurationCache.read(this.key);
			const { content: configurationContents }: { content: IStringDictionary<string> } = JSON.parse(contents.toString());
			if (configurationContents) {
				for (const key of Object.keys(configurationContents)) {
					if (key === FOLDER_SETTINGS_NAME) {
						this._folderSettingsModelParser.parse(configurationContents[key], this._folderSettingsParseOptions);
					} else {
						const standAloneConfigurationModelParser = new StandaloneConfigurationModelParser(key, key, this.logService);
						standAloneConfigurationModelParser.parse(configurationContents[key]);
						this._standAloneConfigurations.push(standAloneConfigurationModelParser.configurationModel);
					}
				}
			}
			this.consolidate();
		} catch (e) {
		}
		return this.configurationModel;
	}

	async updateConfiguration(settingsContent: string | undefined, standAloneConfigurationContents: [string, string | undefined][]): Promise<void> {
		const content: IStringDictionary<unknown> = {};
		if (settingsContent) {
			content[FOLDER_SETTINGS_NAME] = settingsContent;
		}
		standAloneConfigurationContents.forEach(([key, contents]) => {
			if (contents) {
				content[key] = contents;
			}
		});
		if (Object.keys(content).length) {
			await this.configurationCache.write(this.key, JSON.stringify({ content }));
		} else {
			await this.configurationCache.remove(this.key);
		}
	}

	getRestrictedSettings(): string[] {
		return this._folderSettingsModelParser.restrictedConfigurations;
	}

	reparse(configurationParseOptions: ConfigurationParseOptions): ConfigurationModel {
		this._folderSettingsParseOptions = configurationParseOptions;
		this._folderSettingsModelParser.reparse(this._folderSettingsParseOptions);
		this.consolidate();
		return this.configurationModel;
	}

	private consolidate(): void {
		this.configurationModel = this._folderSettingsModelParser.configurationModel.merge(...this._standAloneConfigurations);
	}

	getUnsupportedKeys(): string[] {
		return [];
	}
}

export class FolderConfiguration extends Disposable {

	protected readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private folderConfiguration: CachedFolderConfiguration | FileServiceBasedConfiguration;
	private readonly scopes: ConfigurationScope[];
	private readonly configurationFolder: URI;
	private cachedFolderConfiguration: CachedFolderConfiguration;

	constructor(
		useCache: boolean,
		readonly workspaceFolder: IWorkspaceFolder,
		configFolderRelativePath: string,
		private readonly workbenchState: WorkbenchState,
		private workspaceTrusted: boolean,
		fileService: IFileService,
		uriIdentityService: IUriIdentityService,
		logService: ILogService,
		private readonly configurationCache: IConfigurationCache
	) {
		super();

		this.scopes = WorkbenchState.WORKSPACE === this.workbenchState ? FOLDER_SCOPES : WORKSPACE_SCOPES;
		this.configurationFolder = uriIdentityService.extUri.joinPath(workspaceFolder.uri, configFolderRelativePath);
		this.cachedFolderConfiguration = new CachedFolderConfiguration(workspaceFolder.uri, configFolderRelativePath, { scopes: this.scopes, skipRestricted: this.isUntrusted() }, configurationCache, logService);
		if (useCache && this.configurationCache.needsCaching(workspaceFolder.uri)) {
			this.folderConfiguration = this.cachedFolderConfiguration;
			whenProviderRegistered(workspaceFolder.uri, fileService)
				.then(() => {
					this.folderConfiguration = this._register(this.createFileServiceBasedConfiguration(fileService, uriIdentityService, logService));
					this._register(this.folderConfiguration.onDidChange(e => this.onDidFolderConfigurationChange()));
					this.onDidFolderConfigurationChange();
				});
		} else {
			this.folderConfiguration = this._register(this.createFileServiceBasedConfiguration(fileService, uriIdentityService, logService));
			this._register(this.folderConfiguration.onDidChange(e => this.onDidFolderConfigurationChange()));
		}
	}

	loadConfiguration(): Promise<ConfigurationModel> {
		return this.folderConfiguration.loadConfiguration();
	}

	updateWorkspaceTrust(trusted: boolean): ConfigurationModel {
		this.workspaceTrusted = trusted;
		return this.reparse();
	}

	reparse(): ConfigurationModel {
		const configurationModel = this.folderConfiguration.reparse({ scopes: this.scopes, skipRestricted: this.isUntrusted() });
		this.updateCache();
		return configurationModel;
	}

	getRestrictedSettings(): string[] {
		return this.folderConfiguration.getRestrictedSettings();
	}

	private isUntrusted(): boolean {
		return !this.workspaceTrusted;
	}

	private onDidFolderConfigurationChange(): void {
		this.updateCache();
		this._onDidChange.fire();
	}

	private createFileServiceBasedConfiguration(fileService: IFileService, uriIdentityService: IUriIdentityService, logService: ILogService) {
		const settingsResource = uriIdentityService.extUri.joinPath(this.configurationFolder, `${FOLDER_SETTINGS_NAME}.json`);
		const standAloneConfigurationResources: [string, URI][] = [TASKS_CONFIGURATION_KEY, LAUNCH_CONFIGURATION_KEY, MCP_CONFIGURATION_KEY].map(name => ([name, uriIdentityService.extUri.joinPath(this.configurationFolder, `${name}.json`)]));
		return new FileServiceBasedConfiguration(this.configurationFolder.toString(), settingsResource, standAloneConfigurationResources, { scopes: this.scopes, skipRestricted: this.isUntrusted() }, fileService, uriIdentityService, logService);
	}

	private async updateCache(): Promise<void> {
		if (this.configurationCache.needsCaching(this.configurationFolder) && this.folderConfiguration instanceof FileServiceBasedConfiguration) {
			const [settingsContent, standAloneConfigurationContents] = await this.folderConfiguration.resolveContents();
			this.cachedFolderConfiguration.updateConfiguration(settingsContent, standAloneConfigurationContents);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/browser/configurationService.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/browser/configurationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { equals } from '../../../../base/common/objects.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Queue, Barrier, Promises, Delayer, Throttler } from '../../../../base/common/async.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IWorkspaceContextService, Workspace as BaseWorkspace, WorkbenchState, IWorkspaceFolder, IWorkspaceFoldersChangeEvent, WorkspaceFolder, toWorkspaceFolder, isWorkspaceFolder, IWorkspaceFoldersWillChangeEvent, IEmptyWorkspaceIdentifier, ISingleFolderWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IWorkspaceIdentifier, IAnyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { ConfigurationModel, ConfigurationChangeEvent, mergeChanges } from '../../../../platform/configuration/common/configurationModels.js';
import { IConfigurationChangeEvent, ConfigurationTarget, IConfigurationOverrides, isConfigurationOverrides, IConfigurationData, IConfigurationValue, IConfigurationChange, ConfigurationTargetToString, IConfigurationUpdateOverrides, isConfigurationUpdateOverrides, IConfigurationService, IConfigurationUpdateOptions } from '../../../../platform/configuration/common/configuration.js';
import { IPolicyConfiguration, NullPolicyConfiguration, PolicyConfiguration } from '../../../../platform/configuration/common/configurations.js';
import { Configuration } from '../common/configurationModels.js';
import { FOLDER_CONFIG_FOLDER_NAME, defaultSettingsSchemaId, userSettingsSchemaId, workspaceSettingsSchemaId, folderSettingsSchemaId, IConfigurationCache, machineSettingsSchemaId, LOCAL_MACHINE_SCOPES, IWorkbenchConfigurationService, RestrictedSettings, PROFILE_SCOPES, LOCAL_MACHINE_PROFILE_SCOPES, profileSettingsSchemaId, APPLY_ALL_PROFILES_SETTING, APPLICATION_SCOPES } from '../common/configuration.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions, allSettings, windowSettings, resourceSettings, applicationSettings, machineSettings, machineOverridableSettings, ConfigurationScope, IConfigurationPropertySchema, keyFromOverrideIdentifiers, OVERRIDE_PROPERTY_PATTERN, resourceLanguageSettingsSchemaId, configurationDefaultsSchemaId, applicationMachineSettings } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IStoredWorkspaceFolder, isStoredWorkspaceFolder, IWorkspaceFolderCreationData, getStoredWorkspaceFolder, toWorkspaceFolders } from '../../../../platform/workspaces/common/workspaces.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ConfigurationEditing, EditableConfigurationTarget } from '../common/configurationEditing.js';
import { WorkspaceConfiguration, FolderConfiguration, RemoteUserConfiguration, UserConfiguration, DefaultConfiguration, ApplicationConfiguration } from './configuration.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { mark } from '../../../../base/common/performance.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { delta, distinct, equals as arrayEquals } from '../../../../base/common/arrays.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IWorkbenchAssignmentService } from '../../assignment/common/assignmentService.js';
import { isUndefined } from '../../../../base/common/types.js';
import { localize } from '../../../../nls.js';
import { DidChangeUserDataProfileEvent, IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IPolicyService, NullPolicyService } from '../../../../platform/policy/common/policy.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IJSONEditingService } from '../common/jsonEditing.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { runWhenWindowIdle } from '../../../../base/browser/dom.js';

function getLocalUserConfigurationScopes(userDataProfile: IUserDataProfile, hasRemote: boolean): ConfigurationScope[] | undefined {
	const isDefaultProfile = userDataProfile.isDefault || userDataProfile.useDefaultFlags?.settings;
	if (isDefaultProfile) {
		return hasRemote ? LOCAL_MACHINE_SCOPES : undefined;
	}
	return hasRemote ? LOCAL_MACHINE_PROFILE_SCOPES : PROFILE_SCOPES;
}

class Workspace extends BaseWorkspace {
	initialized: boolean = false;
}

export class WorkspaceService extends Disposable implements IWorkbenchConfigurationService, IWorkspaceContextService {

	public _serviceBrand: undefined;

	private workspace!: Workspace;
	private initRemoteUserConfigurationBarrier: Barrier;
	private completeWorkspaceBarrier: Barrier;
	private readonly configurationCache: IConfigurationCache;
	private _configuration: Configuration;
	private initialized: boolean = false;
	private readonly defaultConfiguration: DefaultConfiguration;
	private readonly policyConfiguration: IPolicyConfiguration;
	private applicationConfiguration: ApplicationConfiguration | null = null;
	private readonly applicationConfigurationDisposables: DisposableStore;
	private readonly localUserConfiguration: UserConfiguration;
	private readonly remoteUserConfiguration: RemoteUserConfiguration | null = null;
	private readonly workspaceConfiguration: WorkspaceConfiguration;
	private cachedFolderConfigs: ResourceMap<FolderConfiguration>;
	private readonly workspaceEditingQueue: Queue<void>;

	private readonly _onDidChangeConfiguration: Emitter<IConfigurationChangeEvent> = this._register(new Emitter<IConfigurationChangeEvent>());
	public readonly onDidChangeConfiguration: Event<IConfigurationChangeEvent> = this._onDidChangeConfiguration.event;

	protected readonly _onWillChangeWorkspaceFolders: Emitter<IWorkspaceFoldersWillChangeEvent> = this._register(new Emitter<IWorkspaceFoldersWillChangeEvent>());
	public readonly onWillChangeWorkspaceFolders: Event<IWorkspaceFoldersWillChangeEvent> = this._onWillChangeWorkspaceFolders.event;

	private readonly _onDidChangeWorkspaceFolders: Emitter<IWorkspaceFoldersChangeEvent> = this._register(new Emitter<IWorkspaceFoldersChangeEvent>());
	public readonly onDidChangeWorkspaceFolders: Event<IWorkspaceFoldersChangeEvent> = this._onDidChangeWorkspaceFolders.event;

	private readonly _onDidChangeWorkspaceName: Emitter<void> = this._register(new Emitter<void>());
	public readonly onDidChangeWorkspaceName: Event<void> = this._onDidChangeWorkspaceName.event;

	private readonly _onDidChangeWorkbenchState: Emitter<WorkbenchState> = this._register(new Emitter<WorkbenchState>());
	public readonly onDidChangeWorkbenchState: Event<WorkbenchState> = this._onDidChangeWorkbenchState.event;

	private isWorkspaceTrusted: boolean = true;

	private _restrictedSettings: RestrictedSettings = { default: [] };
	get restrictedSettings() { return this._restrictedSettings; }
	private readonly _onDidChangeRestrictedSettings = this._register(new Emitter<RestrictedSettings>());
	public readonly onDidChangeRestrictedSettings = this._onDidChangeRestrictedSettings.event;

	private readonly configurationRegistry: IConfigurationRegistry;

	private instantiationService: IInstantiationService | undefined;
	private configurationEditing: Promise<ConfigurationEditing> | undefined;

	constructor(
		{ remoteAuthority, configurationCache }: { remoteAuthority?: string; configurationCache: IConfigurationCache },
		environmentService: IBrowserWorkbenchEnvironmentService,
		private readonly userDataProfileService: IUserDataProfileService,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly fileService: IFileService,
		private readonly remoteAgentService: IRemoteAgentService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly logService: ILogService,
		policyService: IPolicyService
	) {
		super();

		this.configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);

		this.initRemoteUserConfigurationBarrier = new Barrier();
		this.completeWorkspaceBarrier = new Barrier();
		this.defaultConfiguration = this._register(new DefaultConfiguration(configurationCache, environmentService, logService));
		this.policyConfiguration = policyService instanceof NullPolicyService ? new NullPolicyConfiguration() : this._register(new PolicyConfiguration(this.defaultConfiguration, policyService, logService));
		this.configurationCache = configurationCache;
		this._configuration = new Configuration(this.defaultConfiguration.configurationModel, this.policyConfiguration.configurationModel, ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), ConfigurationModel.createEmptyModel(logService), new ResourceMap(), ConfigurationModel.createEmptyModel(logService), new ResourceMap<ConfigurationModel>(), this.workspace, logService);
		this.applicationConfigurationDisposables = this._register(new DisposableStore());
		this.createApplicationConfiguration();
		this.localUserConfiguration = this._register(new UserConfiguration(userDataProfileService.currentProfile.settingsResource, userDataProfileService.currentProfile.tasksResource, userDataProfileService.currentProfile.mcpResource, { scopes: getLocalUserConfigurationScopes(userDataProfileService.currentProfile, !!remoteAuthority) }, fileService, uriIdentityService, logService));
		this.cachedFolderConfigs = new ResourceMap<FolderConfiguration>();
		this._register(this.localUserConfiguration.onDidChangeConfiguration(userConfiguration => this.onLocalUserConfigurationChanged(userConfiguration)));
		if (remoteAuthority) {
			const remoteUserConfiguration = this.remoteUserConfiguration = this._register(new RemoteUserConfiguration(remoteAuthority, configurationCache, fileService, uriIdentityService, remoteAgentService, logService));
			this._register(remoteUserConfiguration.onDidInitialize(remoteUserConfigurationModel => {
				this._register(remoteUserConfiguration.onDidChangeConfiguration(remoteUserConfigurationModel => this.onRemoteUserConfigurationChanged(remoteUserConfigurationModel)));
				this.onRemoteUserConfigurationChanged(remoteUserConfigurationModel);
				this.initRemoteUserConfigurationBarrier.open();
			}));
		} else {
			this.initRemoteUserConfigurationBarrier.open();
		}

		this.workspaceConfiguration = this._register(new WorkspaceConfiguration(configurationCache, fileService, uriIdentityService, logService));
		this._register(this.workspaceConfiguration.onDidUpdateConfiguration(fromCache => {
			this.onWorkspaceConfigurationChanged(fromCache).then(() => {
				this.workspace.initialized = this.workspaceConfiguration.initialized;
				this.checkAndMarkWorkspaceComplete(fromCache);
			});
		}));

		this._register(this.defaultConfiguration.onDidChangeConfiguration(({ properties, defaults }) => this.onDefaultConfigurationChanged(defaults, properties)));
		this._register(this.policyConfiguration.onDidChangeConfiguration(configurationModel => this.onPolicyConfigurationChanged(configurationModel)));
		this._register(userDataProfileService.onDidChangeCurrentProfile(e => this.onUserDataProfileChanged(e)));

		this.workspaceEditingQueue = new Queue<void>();
	}

	private createApplicationConfiguration(): void {
		this.applicationConfigurationDisposables.clear();
		if (this.userDataProfileService.currentProfile.isDefault || this.userDataProfileService.currentProfile.useDefaultFlags?.settings) {
			this.applicationConfiguration = null;
		} else {
			this.applicationConfiguration = this.applicationConfigurationDisposables.add(this._register(new ApplicationConfiguration(this.userDataProfilesService, this.fileService, this.uriIdentityService, this.logService)));
			this.applicationConfigurationDisposables.add(this.applicationConfiguration.onDidChangeConfiguration(configurationModel => this.onApplicationConfigurationChanged(configurationModel)));
		}
	}

	// Workspace Context Service Impl

	public async getCompleteWorkspace(): Promise<Workspace> {
		await this.completeWorkspaceBarrier.wait();
		return this.getWorkspace();
	}

	public getWorkspace(): Workspace {
		return this.workspace;
	}

	public getWorkbenchState(): WorkbenchState {
		// Workspace has configuration file
		if (this.workspace.configuration) {
			return WorkbenchState.WORKSPACE;
		}

		// Folder has single root
		if (this.workspace.folders.length === 1) {
			return WorkbenchState.FOLDER;
		}

		// Empty
		return WorkbenchState.EMPTY;
	}

	public getWorkspaceFolder(resource: URI): IWorkspaceFolder | null {
		return this.workspace.getFolder(resource);
	}

	public addFolders(foldersToAdd: IWorkspaceFolderCreationData[], index?: number): Promise<void> {
		return this.updateFolders(foldersToAdd, [], index);
	}

	public removeFolders(foldersToRemove: URI[]): Promise<void> {
		return this.updateFolders([], foldersToRemove);
	}

	public async updateFolders(foldersToAdd: IWorkspaceFolderCreationData[], foldersToRemove: URI[], index?: number): Promise<void> {
		return this.workspaceEditingQueue.queue(() => this.doUpdateFolders(foldersToAdd, foldersToRemove, index));
	}

	public isInsideWorkspace(resource: URI): boolean {
		return !!this.getWorkspaceFolder(resource);
	}

	public isCurrentWorkspace(workspaceIdOrFolder: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI): boolean {
		switch (this.getWorkbenchState()) {
			case WorkbenchState.FOLDER: {
				let folderUri: URI | undefined = undefined;
				if (URI.isUri(workspaceIdOrFolder)) {
					folderUri = workspaceIdOrFolder;
				} else if (isSingleFolderWorkspaceIdentifier(workspaceIdOrFolder)) {
					folderUri = workspaceIdOrFolder.uri;
				}

				return URI.isUri(folderUri) && this.uriIdentityService.extUri.isEqual(folderUri, this.workspace.folders[0].uri);
			}
			case WorkbenchState.WORKSPACE:
				return isWorkspaceIdentifier(workspaceIdOrFolder) && this.workspace.id === workspaceIdOrFolder.id;
		}
		return false;
	}

	private async doUpdateFolders(foldersToAdd: IWorkspaceFolderCreationData[], foldersToRemove: URI[], index?: number): Promise<void> {
		if (this.getWorkbenchState() !== WorkbenchState.WORKSPACE) {
			return Promise.resolve(undefined); // we need a workspace to begin with
		}

		if (foldersToAdd.length + foldersToRemove.length === 0) {
			return Promise.resolve(undefined); // nothing to do
		}

		let foldersHaveChanged = false;

		// Remove first (if any)
		let currentWorkspaceFolders = this.getWorkspace().folders;
		let newStoredFolders: IStoredWorkspaceFolder[] = currentWorkspaceFolders.map(f => f.raw).filter((folder, index): folder is IStoredWorkspaceFolder => {
			if (!isStoredWorkspaceFolder(folder)) {
				return true; // keep entries which are unrelated
			}

			return !this.contains(foldersToRemove, currentWorkspaceFolders[index].uri); // keep entries which are unrelated
		});

		foldersHaveChanged = currentWorkspaceFolders.length !== newStoredFolders.length;

		// Add afterwards (if any)
		if (foldersToAdd.length) {

			// Recompute current workspace folders if we have folders to add
			const workspaceConfigPath = this.getWorkspace().configuration!;
			const workspaceConfigFolder = this.uriIdentityService.extUri.dirname(workspaceConfigPath);
			currentWorkspaceFolders = toWorkspaceFolders(newStoredFolders, workspaceConfigPath, this.uriIdentityService.extUri);
			const currentWorkspaceFolderUris = currentWorkspaceFolders.map(folder => folder.uri);

			const storedFoldersToAdd: IStoredWorkspaceFolder[] = [];

			for (const folderToAdd of foldersToAdd) {
				const folderURI = folderToAdd.uri;
				if (this.contains(currentWorkspaceFolderUris, folderURI)) {
					continue; // already existing
				}
				try {
					const result = await this.fileService.stat(folderURI);
					if (!result.isDirectory) {
						continue;
					}
				} catch (e) { /* Ignore */ }
				storedFoldersToAdd.push(getStoredWorkspaceFolder(folderURI, false, folderToAdd.name, workspaceConfigFolder, this.uriIdentityService.extUri));
			}

			// Apply to array of newStoredFolders
			if (storedFoldersToAdd.length > 0) {
				foldersHaveChanged = true;

				if (typeof index === 'number' && index >= 0 && index < newStoredFolders.length) {
					newStoredFolders = newStoredFolders.slice(0);
					newStoredFolders.splice(index, 0, ...storedFoldersToAdd);
				} else {
					newStoredFolders = [...newStoredFolders, ...storedFoldersToAdd];
				}
			}
		}

		// Set folders if we recorded a change
		if (foldersHaveChanged) {
			return this.setFolders(newStoredFolders);
		}

		return Promise.resolve(undefined);
	}

	private async setFolders(folders: IStoredWorkspaceFolder[]): Promise<void> {
		if (!this.instantiationService) {
			throw new Error('Cannot update workspace folders because workspace service is not yet ready to accept writes.');
		}

		await this.instantiationService.invokeFunction(accessor => this.workspaceConfiguration.setFolders(folders, accessor.get(IJSONEditingService)));
		return this.onWorkspaceConfigurationChanged(false);
	}

	private contains(resources: URI[], toCheck: URI): boolean {
		return resources.some(resource => this.uriIdentityService.extUri.isEqual(resource, toCheck));
	}

	// Workspace Configuration Service Impl

	getConfigurationData(): IConfigurationData {
		return this._configuration.toData();
	}

	getValue<T>(): T;
	getValue<T>(section: string): T;
	getValue<T>(overrides: IConfigurationOverrides): T;
	getValue<T>(section: string, overrides: IConfigurationOverrides): T;
	getValue(arg1?: unknown, arg2?: unknown): unknown {
		const section = typeof arg1 === 'string' ? arg1 : undefined;
		const overrides = isConfigurationOverrides(arg1) ? arg1 : isConfigurationOverrides(arg2) ? arg2 : undefined;
		return this._configuration.getValue(section, overrides);
	}

	updateValue(key: string, value: unknown): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides): Promise<void>;
	updateValue(key: string, value: unknown, target: ConfigurationTarget): Promise<void>;
	updateValue(key: string, value: unknown, overrides: IConfigurationOverrides | IConfigurationUpdateOverrides, target: ConfigurationTarget, options?: IConfigurationUpdateOptions): Promise<void>;
	async updateValue(key: string, value: unknown, arg3?: unknown, arg4?: unknown, options?: IConfigurationUpdateOptions): Promise<void> {
		const overrides: IConfigurationUpdateOverrides | undefined = isConfigurationUpdateOverrides(arg3) ? arg3
			: isConfigurationOverrides(arg3) ? { resource: arg3.resource, overrideIdentifiers: arg3.overrideIdentifier ? [arg3.overrideIdentifier] : undefined } : undefined;
		const target: ConfigurationTarget | undefined = (overrides ? arg4 : arg3) as ConfigurationTarget | undefined;
		const targets: ConfigurationTarget[] = target ? [target] : [];

		if (overrides?.overrideIdentifiers) {
			overrides.overrideIdentifiers = distinct(overrides.overrideIdentifiers);
			overrides.overrideIdentifiers = overrides.overrideIdentifiers.length ? overrides.overrideIdentifiers : undefined;
		}

		if (!targets.length) {
			if (overrides?.overrideIdentifiers && overrides.overrideIdentifiers.length > 1) {
				throw new Error('Configuration Target is required while updating the value for multiple override identifiers');
			}
			const inspect = this.inspect(key, { resource: overrides?.resource, overrideIdentifier: overrides?.overrideIdentifiers ? overrides.overrideIdentifiers[0] : undefined });
			targets.push(...this.deriveConfigurationTargets(key, value, inspect));

			// Remove the setting, if the value is same as default value and is updated only in user target
			if (equals(value, inspect.defaultValue) && targets.length === 1 && (targets[0] === ConfigurationTarget.USER || targets[0] === ConfigurationTarget.USER_LOCAL)) {
				value = undefined;
			}
		}

		await Promises.settled(targets.map(target => this.writeConfigurationValue(key, value, target, overrides, options)));
	}

	async reloadConfiguration(target?: ConfigurationTarget | IWorkspaceFolder): Promise<void> {
		if (target === undefined) {
			this.reloadDefaultConfiguration();
			const application = await this.reloadApplicationConfiguration(true);
			const { local, remote } = await this.reloadUserConfiguration();
			await this.reloadWorkspaceConfiguration();
			await this.loadConfiguration(application, local, remote, true);
			return;
		}

		if (isWorkspaceFolder(target)) {
			await this.reloadWorkspaceFolderConfiguration(target);
			return;
		}

		switch (target) {
			case ConfigurationTarget.DEFAULT:
				this.reloadDefaultConfiguration();
				return;

			case ConfigurationTarget.USER: {
				const { local, remote } = await this.reloadUserConfiguration();
				await this.loadConfiguration(this._configuration.applicationConfiguration, local, remote, true);
				return;
			}
			case ConfigurationTarget.USER_LOCAL:
				await this.reloadLocalUserConfiguration();
				return;

			case ConfigurationTarget.USER_REMOTE:
				await this.reloadRemoteUserConfiguration();
				return;

			case ConfigurationTarget.WORKSPACE:
			case ConfigurationTarget.WORKSPACE_FOLDER:
				await this.reloadWorkspaceConfiguration();
				return;
		}
	}

	hasCachedConfigurationDefaultsOverrides(): boolean {
		return this.defaultConfiguration.hasCachedConfigurationDefaultsOverrides();
	}

	inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<T> {
		return this._configuration.inspect<T>(key, overrides);
	}

	keys(): {
		default: string[];
		policy: string[];
		user: string[];
		workspace: string[];
		workspaceFolder: string[];
	} {
		return this._configuration.keys();
	}

	public async whenRemoteConfigurationLoaded(): Promise<void> {
		await this.initRemoteUserConfigurationBarrier.wait();
	}

	/**
	 * At present, all workspaces (empty, single-folder, multi-root) in local and remote
	 * can be initialized without requiring extension host except following case:
	 *
	 * A multi root workspace with .code-workspace file that has to be resolved by an extension.
	 * Because of readonly `rootPath` property in extension API we have to resolve multi root workspace
	 * before extension host starts so that `rootPath` can be set to first folder.
	 *
	 * This restriction is lifted partially for web in `MainThreadWorkspace`.
	 * In web, we start extension host with empty `rootPath` in this case.
	 *
	 * Related root path issue discussion is being tracked here - https://github.com/microsoft/vscode/issues/69335
	 */
	async initialize(arg: IAnyWorkspaceIdentifier): Promise<void> {
		mark('code/willInitWorkspaceService');

		const trigger = this.initialized;
		this.initialized = false;
		const workspace = await this.createWorkspace(arg);
		await this.updateWorkspaceAndInitializeConfiguration(workspace, trigger);
		this.checkAndMarkWorkspaceComplete(false);

		mark('code/didInitWorkspaceService');
	}

	updateWorkspaceTrust(trusted: boolean): void {
		if (this.isWorkspaceTrusted !== trusted) {
			this.isWorkspaceTrusted = trusted;
			const data = this._configuration.toData();
			const folderConfigurationModels: (ConfigurationModel | undefined)[] = [];
			for (const folder of this.workspace.folders) {
				const folderConfiguration = this.cachedFolderConfigs.get(folder.uri);
				let configurationModel: ConfigurationModel | undefined;
				if (folderConfiguration) {
					configurationModel = folderConfiguration.updateWorkspaceTrust(this.isWorkspaceTrusted);
					this._configuration.updateFolderConfiguration(folder.uri, configurationModel);
				}
				folderConfigurationModels.push(configurationModel);
			}
			if (this.getWorkbenchState() === WorkbenchState.FOLDER) {
				if (folderConfigurationModels[0]) {
					this._configuration.updateWorkspaceConfiguration(folderConfigurationModels[0]);
				}
			} else {
				this._configuration.updateWorkspaceConfiguration(this.workspaceConfiguration.updateWorkspaceTrust(this.isWorkspaceTrusted));
			}
			this.updateRestrictedSettings();

			let keys: string[] = [];
			if (this.restrictedSettings.userLocal) {
				keys.push(...this.restrictedSettings.userLocal);
			}
			if (this.restrictedSettings.userRemote) {
				keys.push(...this.restrictedSettings.userRemote);
			}
			if (this.restrictedSettings.workspace) {
				keys.push(...this.restrictedSettings.workspace);
			}
			this.restrictedSettings.workspaceFolder?.forEach((value) => keys.push(...value));
			keys = distinct(keys);
			if (keys.length) {
				this.triggerConfigurationChange({ keys, overrides: [] }, { data, workspace: this.workspace }, ConfigurationTarget.WORKSPACE);
			}
		}
	}

	acquireInstantiationService(instantiationService: IInstantiationService): void {
		this.instantiationService = instantiationService;
	}

	isSettingAppliedForAllProfiles(key: string): boolean {
		const scope = this.configurationRegistry.getConfigurationProperties()[key]?.scope;
		if (scope && APPLICATION_SCOPES.includes(scope)) {
			return true;
		}
		const allProfilesSettings = this.getValue<string[]>(APPLY_ALL_PROFILES_SETTING) ?? [];
		return Array.isArray(allProfilesSettings) && allProfilesSettings.includes(key);
	}

	private async createWorkspace(arg: IAnyWorkspaceIdentifier): Promise<Workspace> {
		if (isWorkspaceIdentifier(arg)) {
			return this.createMultiFolderWorkspace(arg);
		}

		if (isSingleFolderWorkspaceIdentifier(arg)) {
			return this.createSingleFolderWorkspace(arg);
		}

		return this.createEmptyWorkspace(arg);
	}

	private async createMultiFolderWorkspace(workspaceIdentifier: IWorkspaceIdentifier): Promise<Workspace> {
		await this.workspaceConfiguration.initialize({ id: workspaceIdentifier.id, configPath: workspaceIdentifier.configPath }, this.isWorkspaceTrusted);
		const workspaceConfigPath = workspaceIdentifier.configPath;
		const workspaceFolders = toWorkspaceFolders(this.workspaceConfiguration.getFolders(), workspaceConfigPath, this.uriIdentityService.extUri);
		const workspaceId = workspaceIdentifier.id;
		const workspace = new Workspace(workspaceId, workspaceFolders, this.workspaceConfiguration.isTransient(), workspaceConfigPath, uri => this.uriIdentityService.extUri.ignorePathCasing(uri));
		workspace.initialized = this.workspaceConfiguration.initialized;
		return workspace;
	}

	private createSingleFolderWorkspace(singleFolderWorkspaceIdentifier: ISingleFolderWorkspaceIdentifier): Workspace {
		const workspace = new Workspace(singleFolderWorkspaceIdentifier.id, [toWorkspaceFolder(singleFolderWorkspaceIdentifier.uri)], false, null, uri => this.uriIdentityService.extUri.ignorePathCasing(uri));
		workspace.initialized = true;
		return workspace;
	}

	private createEmptyWorkspace(emptyWorkspaceIdentifier: IEmptyWorkspaceIdentifier): Promise<Workspace> {
		const workspace = new Workspace(emptyWorkspaceIdentifier.id, [], false, null, uri => this.uriIdentityService.extUri.ignorePathCasing(uri));
		workspace.initialized = true;
		return Promise.resolve(workspace);
	}

	private checkAndMarkWorkspaceComplete(fromCache: boolean): void {
		if (!this.completeWorkspaceBarrier.isOpen() && this.workspace.initialized) {
			this.completeWorkspaceBarrier.open();
			this.validateWorkspaceFoldersAndReload(fromCache);
		}
	}

	private async updateWorkspaceAndInitializeConfiguration(workspace: Workspace, trigger: boolean): Promise<void> {
		const hasWorkspaceBefore = !!this.workspace;
		let previousState: WorkbenchState | undefined;
		let previousWorkspacePath: string | undefined;
		let previousFolders: WorkspaceFolder[] = [];

		if (hasWorkspaceBefore) {
			previousState = this.getWorkbenchState();
			previousWorkspacePath = this.workspace.configuration ? this.workspace.configuration.fsPath : undefined;
			previousFolders = this.workspace.folders;
			this.workspace.update(workspace);
		} else {
			this.workspace = workspace;
		}

		await this.initializeConfiguration(trigger);

		// Trigger changes after configuration initialization so that configuration is up to date.
		if (hasWorkspaceBefore) {
			const newState = this.getWorkbenchState();
			if (previousState && newState !== previousState) {
				this._onDidChangeWorkbenchState.fire(newState);
			}

			const newWorkspacePath = this.workspace.configuration ? this.workspace.configuration.fsPath : undefined;
			if (previousWorkspacePath && newWorkspacePath !== previousWorkspacePath || newState !== previousState) {
				this._onDidChangeWorkspaceName.fire();
			}

			const folderChanges = this.compareFolders(previousFolders, this.workspace.folders);
			if (folderChanges && (folderChanges.added.length || folderChanges.removed.length || folderChanges.changed.length)) {
				await this.handleWillChangeWorkspaceFolders(folderChanges, false);
				this._onDidChangeWorkspaceFolders.fire(folderChanges);
			}
		}

		if (!this.localUserConfiguration.hasTasksLoaded) {
			// Reload local user configuration again to load user tasks
			this._register(runWhenWindowIdle(mainWindow, () => this.reloadLocalUserConfiguration(false, this._configuration.localUserConfiguration)));
		}
	}

	private compareFolders(currentFolders: IWorkspaceFolder[], newFolders: IWorkspaceFolder[]): IWorkspaceFoldersChangeEvent {
		const result: IWorkspaceFoldersChangeEvent = { added: [], removed: [], changed: [] };
		result.added = newFolders.filter(newFolder => !currentFolders.some(currentFolder => newFolder.uri.toString() === currentFolder.uri.toString()));
		for (let currentIndex = 0; currentIndex < currentFolders.length; currentIndex++) {
			const currentFolder = currentFolders[currentIndex];
			let newIndex = 0;
			for (newIndex = 0; newIndex < newFolders.length && currentFolder.uri.toString() !== newFolders[newIndex].uri.toString(); newIndex++) { }
			if (newIndex < newFolders.length) {
				if (currentIndex !== newIndex || currentFolder.name !== newFolders[newIndex].name) {
					result.changed.push(currentFolder);
				}
			} else {
				result.removed.push(currentFolder);
			}
		}
		return result;
	}

	private async initializeConfiguration(trigger: boolean): Promise<void> {
		await this.defaultConfiguration.initialize();

		const initPolicyConfigurationPromise = this.policyConfiguration.initialize();
		const initApplicationConfigurationPromise = this.applicationConfiguration ? this.applicationConfiguration.initialize() : Promise.resolve(ConfigurationModel.createEmptyModel(this.logService));
		const initUserConfiguration = async () => {
			mark('code/willInitUserConfiguration');
			const result = await Promise.all([this.localUserConfiguration.initialize(), this.remoteUserConfiguration ? this.remoteUserConfiguration.initialize() : Promise.resolve(ConfigurationModel.createEmptyModel(this.logService))]);
			if (this.applicationConfiguration) {
				const applicationConfigurationModel = await initApplicationConfigurationPromise;
				result[0] = this.localUserConfiguration.reparse({ exclude: applicationConfigurationModel.getValue(APPLY_ALL_PROFILES_SETTING) });
			}
			mark('code/didInitUserConfiguration');
			return result;
		};

		const [, application, [local, remote]] = await Promise.all([
			initPolicyConfigurationPromise,
			initApplicationConfigurationPromise,
			initUserConfiguration()
		]);

		mark('code/willInitWorkspaceConfiguration');
		await this.loadConfiguration(application, local, remote, trigger);
		mark('code/didInitWorkspaceConfiguration');
	}

	private reloadDefaultConfiguration(): void {
		this.onDefaultConfigurationChanged(this.defaultConfiguration.reload());
	}

	private async reloadApplicationConfiguration(donotTrigger?: boolean): Promise<ConfigurationModel> {
		if (!this.applicationConfiguration) {
			return ConfigurationModel.createEmptyModel(this.logService);
		}
		const model = await this.applicationConfiguration.loadConfiguration();
		if (!donotTrigger) {
			this.onApplicationConfigurationChanged(model);
		}
		return model;
	}

	private async reloadUserConfiguration(): Promise<{ local: ConfigurationModel; remote: ConfigurationModel }> {
		const [local, remote] = await Promise.all([this.reloadLocalUserConfiguration(true), this.reloadRemoteUserConfiguration(true)]);
		return { local, remote };
	}

	async reloadLocalUserConfiguration(donotTrigger?: boolean, settingsConfiguration?: ConfigurationModel): Promise<ConfigurationModel> {
		const model = await this.localUserConfiguration.reload(settingsConfiguration);
		if (!donotTrigger) {
			this.onLocalUserConfigurationChanged(model);
		}
		return model;
	}

	private async reloadRemoteUserConfiguration(donotTrigger?: boolean): Promise<ConfigurationModel> {
		if (this.remoteUserConfiguration) {
			const model = await this.remoteUserConfiguration.reload();
			if (!donotTrigger) {
				this.onRemoteUserConfigurationChanged(model);
			}
			return model;
		}
		return ConfigurationModel.createEmptyModel(this.logService);
	}

	private async reloadWorkspaceConfiguration(): Promise<void> {
		const workbenchState = this.getWorkbenchState();
		if (workbenchState === WorkbenchState.FOLDER) {
			return this.onWorkspaceFolderConfigurationChanged(this.workspace.folders[0]);
		}
		if (workbenchState === WorkbenchState.WORKSPACE) {
			return this.workspaceConfiguration.reload().then(() => this.onWorkspaceConfigurationChanged(false));
		}
	}

	private reloadWorkspaceFolderConfiguration(folder: IWorkspaceFolder): Promise<void> {
		return this.onWorkspaceFolderConfigurationChanged(folder);
	}

	private async loadConfiguration(applicationConfigurationModel: ConfigurationModel, userConfigurationModel: ConfigurationModel, remoteUserConfigurationModel: ConfigurationModel, trigger: boolean): Promise<void> {
		// reset caches
		this.cachedFolderConfigs = new ResourceMap<FolderConfiguration>();

		const folders = this.workspace.folders;
		const folderConfigurations = await this.loadFolderConfigurations(folders);

		const workspaceConfiguration = this.getWorkspaceConfigurationModel(folderConfigurations);
		const folderConfigurationModels = new ResourceMap<ConfigurationModel>();
		folderConfigurations.forEach((folderConfiguration, index) => folderConfigurationModels.set(folders[index].uri, folderConfiguration));

		const currentConfiguration = this._configuration;
		this._configuration = new Configuration(this.defaultConfiguration.configurationModel, this.policyConfiguration.configurationModel, applicationConfigurationModel, userConfigurationModel, remoteUserConfigurationModel, workspaceConfiguration, folderConfigurationModels, ConfigurationModel.createEmptyModel(this.logService), new ResourceMap<ConfigurationModel>(), this.workspace, this.logService);

		this.initialized = true;

		if (trigger) {
			const change = this._configuration.compare(currentConfiguration);
			this.triggerConfigurationChange(change, { data: currentConfiguration.toData(), workspace: this.workspace }, ConfigurationTarget.WORKSPACE);
		}

		this.updateRestrictedSettings();
	}

	private getWorkspaceConfigurationModel(folderConfigurations: ConfigurationModel[]): ConfigurationModel {
		switch (this.getWorkbenchState()) {
			case WorkbenchState.FOLDER:
				return folderConfigurations[0];
			case WorkbenchState.WORKSPACE:
				return this.workspaceConfiguration.getConfiguration();
			default:
				return ConfigurationModel.createEmptyModel(this.logService);
		}
	}

	private onUserDataProfileChanged(e: DidChangeUserDataProfileEvent): void {
		e.join((async () => {
			const promises: Promise<ConfigurationModel>[] = [];
			promises.push(this.localUserConfiguration.reset(e.profile.settingsResource, e.profile.tasksResource, e.profile.mcpResource, { scopes: getLocalUserConfigurationScopes(e.profile, !!this.remoteUserConfiguration) }));
			if (e.previous.isDefault !== e.profile.isDefault
				|| !!e.previous.useDefaultFlags?.settings !== !!e.profile.useDefaultFlags?.settings) {
				this.createApplicationConfiguration();
				if (this.applicationConfiguration) {
					promises.push(this.reloadApplicationConfiguration(true));
				}
			}
			let [localUser, application] = await Promise.all(promises);
			application = application ?? this._configuration.applicationConfiguration;
			if (this.applicationConfiguration) {
				localUser = this.localUserConfiguration.reparse({ exclude: application.getValue(APPLY_ALL_PROFILES_SETTING) });
			}
			await this.loadConfiguration(application, localUser, this._configuration.remoteUserConfiguration, true);
		})());
	}

	private onDefaultConfigurationChanged(configurationModel: ConfigurationModel, properties?: string[]): void {
		if (this.workspace) {
			const previousData = this._configuration.toData();
			const change = this._configuration.compareAndUpdateDefaultConfiguration(configurationModel, properties);
			if (this.applicationConfiguration) {
				this._configuration.updateApplicationConfiguration(this.applicationConfiguration.reparse());
			}
			if (this.remoteUserConfiguration) {
				this._configuration.updateLocalUserConfiguration(this.localUserConfiguration.reparse());
				this._configuration.updateRemoteUserConfiguration(this.remoteUserConfiguration.reparse());
			}
			if (this.getWorkbenchState() === WorkbenchState.FOLDER) {
				const folderConfiguration = this.cachedFolderConfigs.get(this.workspace.folders[0].uri);
				if (folderConfiguration) {
					this._configuration.updateWorkspaceConfiguration(folderConfiguration.reparse());
					this._configuration.updateFolderConfiguration(this.workspace.folders[0].uri, folderConfiguration.reparse());
				}
			} else {
				this._configuration.updateWorkspaceConfiguration(this.workspaceConfiguration.reparseWorkspaceSettings());
				for (const folder of this.workspace.folders) {
					const folderConfiguration = this.cachedFolderConfigs.get(folder.uri);
					if (folderConfiguration) {
						this._configuration.updateFolderConfiguration(folder.uri, folderConfiguration.reparse());
					}
				}
			}
			this.triggerConfigurationChange(change, { data: previousData, workspace: this.workspace }, ConfigurationTarget.DEFAULT);
			this.updateRestrictedSettings();
		}
	}

	private onPolicyConfigurationChanged(policyConfiguration: ConfigurationModel): void {
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const change = this._configuration.compareAndUpdatePolicyConfiguration(policyConfiguration);
		this.triggerConfigurationChange(change, previous, ConfigurationTarget.DEFAULT);
	}

	private onApplicationConfigurationChanged(applicationConfiguration: ConfigurationModel): void {
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const previousAllProfilesSettings = this._configuration.applicationConfiguration.getValue<string[]>(APPLY_ALL_PROFILES_SETTING) ?? [];
		const change = this._configuration.compareAndUpdateApplicationConfiguration(applicationConfiguration);
		const currentAllProfilesSettings = this.getValue<string[]>(APPLY_ALL_PROFILES_SETTING) ?? [];
		const configurationProperties = this.configurationRegistry.getConfigurationProperties();
		const changedKeys: string[] = [];
		for (const changedKey of change.keys) {
			const scope = configurationProperties[changedKey]?.scope;
			if (scope && APPLICATION_SCOPES.includes(scope)) {
				changedKeys.push(changedKey);
				if (changedKey === APPLY_ALL_PROFILES_SETTING) {
					for (const previousAllProfileSetting of previousAllProfilesSettings) {
						if (!currentAllProfilesSettings.includes(previousAllProfileSetting)) {
							changedKeys.push(previousAllProfileSetting);
						}
					}
					for (const currentAllProfileSetting of currentAllProfilesSettings) {
						if (!previousAllProfilesSettings.includes(currentAllProfileSetting)) {
							changedKeys.push(currentAllProfileSetting);
						}
					}
				}
			}
			else if (currentAllProfilesSettings.includes(changedKey)) {
				changedKeys.push(changedKey);
			}
		}
		change.keys = changedKeys;
		if (change.keys.includes(APPLY_ALL_PROFILES_SETTING)) {
			this._configuration.updateLocalUserConfiguration(this.localUserConfiguration.reparse({ exclude: currentAllProfilesSettings }));
		}
		this.triggerConfigurationChange(change, previous, ConfigurationTarget.USER);
	}

	private onLocalUserConfigurationChanged(userConfiguration: ConfigurationModel): void {
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const change = this._configuration.compareAndUpdateLocalUserConfiguration(userConfiguration);
		this.triggerConfigurationChange(change, previous, ConfigurationTarget.USER);
	}

	private onRemoteUserConfigurationChanged(userConfiguration: ConfigurationModel): void {
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const change = this._configuration.compareAndUpdateRemoteUserConfiguration(userConfiguration);
		this.triggerConfigurationChange(change, previous, ConfigurationTarget.USER);
	}

	private async onWorkspaceConfigurationChanged(fromCache: boolean): Promise<void> {
		if (this.workspace && this.workspace.configuration) {
			let newFolders = toWorkspaceFolders(this.workspaceConfiguration.getFolders(), this.workspace.configuration, this.uriIdentityService.extUri);

			// Validate only if workspace is initialized
			if (this.workspace.initialized) {
				const { added, removed, changed } = this.compareFolders(this.workspace.folders, newFolders);

				/* If changed validate new folders */
				if (added.length || removed.length || changed.length) {
					newFolders = await this.toValidWorkspaceFolders(newFolders);
				}
				/* Otherwise use existing */
				else {
					newFolders = this.workspace.folders;
				}
			}

			await this.updateWorkspaceConfiguration(newFolders, this.workspaceConfiguration.getConfiguration(), fromCache);
		}
	}

	private updateRestrictedSettings(): void {
		const changed: string[] = [];

		const allProperties = this.configurationRegistry.getConfigurationProperties();
		const defaultRestrictedSettings: string[] = Object.keys(allProperties).filter(key => allProperties[key].restricted).sort((a, b) => a.localeCompare(b));
		const defaultDelta = delta(defaultRestrictedSettings, this._restrictedSettings.default, (a, b) => a.localeCompare(b));
		changed.push(...defaultDelta.added, ...defaultDelta.removed);

		const application = (this.applicationConfiguration?.getRestrictedSettings() || []).sort((a, b) => a.localeCompare(b));
		const applicationDelta = delta(application, this._restrictedSettings.application || [], (a, b) => a.localeCompare(b));
		changed.push(...applicationDelta.added, ...applicationDelta.removed);

		const userLocal = this.localUserConfiguration.getRestrictedSettings().sort((a, b) => a.localeCompare(b));
		const userLocalDelta = delta(userLocal, this._restrictedSettings.userLocal || [], (a, b) => a.localeCompare(b));
		changed.push(...userLocalDelta.added, ...userLocalDelta.removed);

		const userRemote = (this.remoteUserConfiguration?.getRestrictedSettings() || []).sort((a, b) => a.localeCompare(b));
		const userRemoteDelta = delta(userRemote, this._restrictedSettings.userRemote || [], (a, b) => a.localeCompare(b));
		changed.push(...userRemoteDelta.added, ...userRemoteDelta.removed);

		const workspaceFolderMap = new ResourceMap<ReadonlyArray<string>>();
		for (const workspaceFolder of this.workspace.folders) {
			const cachedFolderConfig = this.cachedFolderConfigs.get(workspaceFolder.uri);
			const folderRestrictedSettings = (cachedFolderConfig?.getRestrictedSettings() || []).sort((a, b) => a.localeCompare(b));
			if (folderRestrictedSettings.length) {
				workspaceFolderMap.set(workspaceFolder.uri, folderRestrictedSettings);
			}
			const previous = this._restrictedSettings.workspaceFolder?.get(workspaceFolder.uri) || [];
			const workspaceFolderDelta = delta(folderRestrictedSettings, previous, (a, b) => a.localeCompare(b));
			changed.push(...workspaceFolderDelta.added, ...workspaceFolderDelta.removed);
		}

		const workspace = this.getWorkbenchState() === WorkbenchState.WORKSPACE ? this.workspaceConfiguration.getRestrictedSettings().sort((a, b) => a.localeCompare(b))
			: this.workspace.folders[0] ? (workspaceFolderMap.get(this.workspace.folders[0].uri) || []) : [];
		const workspaceDelta = delta(workspace, this._restrictedSettings.workspace || [], (a, b) => a.localeCompare(b));
		changed.push(...workspaceDelta.added, ...workspaceDelta.removed);

		if (changed.length) {
			this._restrictedSettings = {
				default: defaultRestrictedSettings,
				application: application.length ? application : undefined,
				userLocal: userLocal.length ? userLocal : undefined,
				userRemote: userRemote.length ? userRemote : undefined,
				workspace: workspace.length ? workspace : undefined,
				workspaceFolder: workspaceFolderMap.size ? workspaceFolderMap : undefined,
			};
			this._onDidChangeRestrictedSettings.fire(this.restrictedSettings);
		}
	}

	private async updateWorkspaceConfiguration(workspaceFolders: WorkspaceFolder[], configuration: ConfigurationModel, fromCache: boolean): Promise<void> {
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const change = this._configuration.compareAndUpdateWorkspaceConfiguration(configuration);
		const changes = this.compareFolders(this.workspace.folders, workspaceFolders);
		if (changes.added.length || changes.removed.length || changes.changed.length) {
			this.workspace.folders = workspaceFolders;
			const change = await this.onFoldersChanged();
			await this.handleWillChangeWorkspaceFolders(changes, fromCache);
			this.triggerConfigurationChange(change, previous, ConfigurationTarget.WORKSPACE_FOLDER);
			this._onDidChangeWorkspaceFolders.fire(changes);
		} else {
			this.triggerConfigurationChange(change, previous, ConfigurationTarget.WORKSPACE);
		}
		this.updateRestrictedSettings();
	}

	private async handleWillChangeWorkspaceFolders(changes: IWorkspaceFoldersChangeEvent, fromCache: boolean): Promise<void> {
		const joiners: Promise<void>[] = [];
		this._onWillChangeWorkspaceFolders.fire({
			join(updateWorkspaceTrustStatePromise) {
				joiners.push(updateWorkspaceTrustStatePromise);
			},
			changes,
			fromCache
		});
		try { await Promises.settled(joiners); } catch (error) { /* Ignore */ }
	}

	private async onWorkspaceFolderConfigurationChanged(folder: IWorkspaceFolder): Promise<void> {
		const [folderConfiguration] = await this.loadFolderConfigurations([folder]);
		const previous = { data: this._configuration.toData(), workspace: this.workspace };
		const folderConfigurationChange = this._configuration.compareAndUpdateFolderConfiguration(folder.uri, folderConfiguration);
		if (this.getWorkbenchState() === WorkbenchState.FOLDER) {
			const workspaceConfigurationChange = this._configuration.compareAndUpdateWorkspaceConfiguration(folderConfiguration);
			this.triggerConfigurationChange(mergeChanges(folderConfigurationChange, workspaceConfigurationChange), previous, ConfigurationTarget.WORKSPACE);
		} else {
			this.triggerConfigurationChange(folderConfigurationChange, previous, ConfigurationTarget.WORKSPACE_FOLDER);
		}
		this.updateRestrictedSettings();
	}

	private async onFoldersChanged(): Promise<IConfigurationChange> {
		const changes: IConfigurationChange[] = [];

		// Remove the configurations of deleted folders
		for (const key of this.cachedFolderConfigs.keys()) {
			if (!this.workspace.folders.filter(folder => folder.uri.toString() === key.toString())[0]) {
				const folderConfiguration = this.cachedFolderConfigs.get(key);
				folderConfiguration!.dispose();
				this.cachedFolderConfigs.delete(key);
				changes.push(this._configuration.compareAndDeleteFolderConfiguration(key));
			}
		}

		const toInitialize = this.workspace.folders.filter(folder => !this.cachedFolderConfigs.has(folder.uri));
		if (toInitialize.length) {
			const folderConfigurations = await this.loadFolderConfigurations(toInitialize);
			folderConfigurations.forEach((folderConfiguration, index) => {
				changes.push(this._configuration.compareAndUpdateFolderConfiguration(toInitialize[index].uri, folderConfiguration));
			});
		}
		return mergeChanges(...changes);
	}

	private loadFolderConfigurations(folders: IWorkspaceFolder[]): Promise<ConfigurationModel[]> {
		return Promise.all([...folders.map(folder => {
			let folderConfiguration = this.cachedFolderConfigs.get(folder.uri);
			if (!folderConfiguration) {
				folderConfiguration = new FolderConfiguration(!this.initialized, folder, FOLDER_CONFIG_FOLDER_NAME, this.getWorkbenchState(), this.isWorkspaceTrusted, this.fileService, this.uriIdentityService, this.logService, this.configurationCache);
				this._register(folderConfiguration.onDidChange(() => this.onWorkspaceFolderConfigurationChanged(folder)));
				this.cachedFolderConfigs.set(folder.uri, this._register(folderConfiguration));
			}
			return folderConfiguration.loadConfiguration();
		})]);
	}

	private async validateWorkspaceFoldersAndReload(fromCache: boolean): Promise<void> {
		const validWorkspaceFolders = await this.toValidWorkspaceFolders(this.workspace.folders);
		const { removed } = this.compareFolders(this.workspace.folders, validWorkspaceFolders);
		if (removed.length) {
			await this.updateWorkspaceConfiguration(validWorkspaceFolders, this.workspaceConfiguration.getConfiguration(), fromCache);
		}
	}

	// Filter out workspace folders which are files (not directories)
	// Workspace folders those cannot be resolved are not filtered because they are handled by the Explorer.
	private async toValidWorkspaceFolders(workspaceFolders: WorkspaceFolder[]): Promise<WorkspaceFolder[]> {
		const validWorkspaceFolders: WorkspaceFolder[] = [];
		for (const workspaceFolder of workspaceFolders) {
			try {
				const result = await this.fileService.stat(workspaceFolder.uri);
				if (!result.isDirectory) {
					continue;
				}
			} catch (e) {
				this.logService.warn(`Ignoring the error while validating workspace folder ${workspaceFolder.uri.toString()} - ${toErrorMessage(e)}`);
			}
			validWorkspaceFolders.push(workspaceFolder);
		}
		return validWorkspaceFolders;
	}

	private async writeConfigurationValue(key: string, value: unknown, target: ConfigurationTarget, overrides: IConfigurationUpdateOverrides | undefined, options?: IConfigurationUpdateOptions): Promise<void> {
		if (!this.instantiationService) {
			throw new Error('Cannot write configuration because the configuration service is not yet ready to accept writes.');
		}

		if (target === ConfigurationTarget.DEFAULT) {
			throw new Error('Invalid configuration target');
		}

		if (target === ConfigurationTarget.MEMORY) {
			const previous = { data: this._configuration.toData(), workspace: this.workspace };
			this._configuration.updateValue(key, value, overrides);
			this.triggerConfigurationChange({ keys: overrides?.overrideIdentifiers?.length ? [keyFromOverrideIdentifiers(overrides.overrideIdentifiers), key] : [key], overrides: overrides?.overrideIdentifiers?.length ? overrides.overrideIdentifiers.map(overrideIdentifier => ([overrideIdentifier, [key]])) : [] }, previous, target);
			return;
		}

		const editableConfigurationTarget = this.toEditableConfigurationTarget(target, key);
		if (!editableConfigurationTarget) {
			throw new Error('Invalid configuration target');
		}

		if (editableConfigurationTarget === EditableConfigurationTarget.USER_REMOTE && !this.remoteUserConfiguration) {
			throw new Error('Invalid configuration target');
		}

		if (overrides?.overrideIdentifiers?.length && overrides.overrideIdentifiers.length > 1) {
			const configurationModel = this.getConfigurationModelForEditableConfigurationTarget(editableConfigurationTarget, overrides.resource);
			if (configurationModel) {
				const overrideIdentifiers = overrides.overrideIdentifiers.sort();
				const existingOverrides = configurationModel.overrides.find(override => arrayEquals([...override.identifiers].sort(), overrideIdentifiers));
				if (existingOverrides) {
					overrides.overrideIdentifiers = existingOverrides.identifiers;
				}
			}
		}

		// Use same instance of ConfigurationEditing to make sure all writes go through the same queue
		this.configurationEditing = this.configurationEditing ?? this.createConfigurationEditingService(this.instantiationService);
		await (await this.configurationEditing).writeConfiguration(editableConfigurationTarget, { key, value }, { scopes: overrides, ...options });
		switch (editableConfigurationTarget) {
			case EditableConfigurationTarget.USER_LOCAL:
				if (this.applicationConfiguration && this.isSettingAppliedForAllProfiles(key)) {
					await this.reloadApplicationConfiguration();
				} else {
					await this.reloadLocalUserConfiguration();
				}
				return;
			case EditableConfigurationTarget.USER_REMOTE:
				return this.reloadRemoteUserConfiguration().then(() => undefined);
			case EditableConfigurationTarget.WORKSPACE:
				return this.reloadWorkspaceConfiguration();
			case EditableConfigurationTarget.WORKSPACE_FOLDER: {
				const workspaceFolder = overrides && overrides.resource ? this.workspace.getFolder(overrides.resource) : null;
				if (workspaceFolder) {
					return this.reloadWorkspaceFolderConfiguration(workspaceFolder);
				}
			}
		}
	}

	private async createConfigurationEditingService(instantiationService: IInstantiationService): Promise<ConfigurationEditing> {
		const remoteSettingsResource = (await this.remoteAgentService.getEnvironment())?.settingsPath ?? null;
		return instantiationService.createInstance(ConfigurationEditing, remoteSettingsResource);
	}

	private getConfigurationModelForEditableConfigurationTarget(target: EditableConfigurationTarget, resource?: URI | null): ConfigurationModel | undefined {
		switch (target) {
			case EditableConfigurationTarget.USER_LOCAL: return this._configuration.localUserConfiguration;
			case EditableConfigurationTarget.USER_REMOTE: return this._configuration.remoteUserConfiguration;
			case EditableConfigurationTarget.WORKSPACE: return this._configuration.workspaceConfiguration;
			case EditableConfigurationTarget.WORKSPACE_FOLDER: return resource ? this._configuration.folderConfigurations.get(resource) : undefined;
		}
	}

	getConfigurationModel(target: ConfigurationTarget, resource?: URI | null): ConfigurationModel | undefined {
		switch (target) {
			case ConfigurationTarget.USER_LOCAL: return this._configuration.localUserConfiguration;
			case ConfigurationTarget.USER_REMOTE: return this._configuration.remoteUserConfiguration;
			case ConfigurationTarget.WORKSPACE: return this._configuration.workspaceConfiguration;
			case ConfigurationTarget.WORKSPACE_FOLDER: return resource ? this._configuration.folderConfigurations.get(resource) : undefined;
			default: return undefined;
		}
	}

	private deriveConfigurationTargets(key: string, value: unknown, inspect: IConfigurationValue<unknown>): ConfigurationTarget[] {
		if (equals(value, inspect.value)) {
			return [];
		}

		const definedTargets: ConfigurationTarget[] = [];
		if (inspect.workspaceFolderValue !== undefined) {
			definedTargets.push(ConfigurationTarget.WORKSPACE_FOLDER);
		}
		if (inspect.workspaceValue !== undefined) {
			definedTargets.push(ConfigurationTarget.WORKSPACE);
		}
		if (inspect.userRemoteValue !== undefined) {
			definedTargets.push(ConfigurationTarget.USER_REMOTE);
		}
		if (inspect.userLocalValue !== undefined) {
			definedTargets.push(ConfigurationTarget.USER_LOCAL);
		}
		if (inspect.applicationValue !== undefined) {
			definedTargets.push(ConfigurationTarget.APPLICATION);
		}

		if (value === undefined) {
			// Remove the setting in all defined targets
			return definedTargets;
		}

		return [definedTargets[0] || ConfigurationTarget.USER];
	}

	private triggerConfigurationChange(change: IConfigurationChange, previous: { data: IConfigurationData; workspace?: Workspace } | undefined, target: ConfigurationTarget): void {
		if (change.keys.length) {
			if (target !== ConfigurationTarget.DEFAULT) {
				this.logService.debug(`Configuration keys changed in ${ConfigurationTargetToString(target)} target`, ...change.keys);
			}
			const configurationChangeEvent = new ConfigurationChangeEvent(change, previous, this._configuration, this.workspace, this.logService);
			configurationChangeEvent.source = target;
			this._onDidChangeConfiguration.fire(configurationChangeEvent);
		}
	}

	private toEditableConfigurationTarget(target: ConfigurationTarget, key: string): EditableConfigurationTarget | null {
		if (target === ConfigurationTarget.APPLICATION) {
			return EditableConfigurationTarget.USER_LOCAL;
		}
		if (target === ConfigurationTarget.USER) {
			if (this.remoteUserConfiguration) {
				const scope = this.configurationRegistry.getConfigurationProperties()[key]?.scope;
				if (scope === ConfigurationScope.MACHINE || scope === ConfigurationScope.MACHINE_OVERRIDABLE || scope === ConfigurationScope.APPLICATION_MACHINE) {
					return EditableConfigurationTarget.USER_REMOTE;
				}
				if (this.inspect(key).userRemoteValue !== undefined) {
					return EditableConfigurationTarget.USER_REMOTE;
				}
			}
			return EditableConfigurationTarget.USER_LOCAL;
		}
		if (target === ConfigurationTarget.USER_LOCAL) {
			return EditableConfigurationTarget.USER_LOCAL;
		}
		if (target === ConfigurationTarget.USER_REMOTE) {
			return EditableConfigurationTarget.USER_REMOTE;
		}
		if (target === ConfigurationTarget.WORKSPACE) {
			return EditableConfigurationTarget.WORKSPACE;
		}
		if (target === ConfigurationTarget.WORKSPACE_FOLDER) {
			return EditableConfigurationTarget.WORKSPACE_FOLDER;
		}
		return null;
	}
}

class RegisterConfigurationSchemasContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IExtensionService extensionService: IExtensionService,
		@ILifecycleService lifecycleService: ILifecycleService,
	) {
		super();

		extensionService.whenInstalledExtensionsRegistered().then(() => {
			this.registerConfigurationSchemas();

			const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
			const delayer = this._register(new Delayer<void>(50));
			this._register(Event.any(configurationRegistry.onDidUpdateConfiguration, configurationRegistry.onDidSchemaChange, workspaceTrustManagementService.onDidChangeTrust)(() =>
				delayer.trigger(() => this.registerConfigurationSchemas(), lifecycleService.phase === LifecyclePhase.Eventually ? undefined : 2500 /* delay longer in early phases */)));
		});
	}

	private registerConfigurationSchemas(): void {
		const allSettingsSchema: IJSONSchema = {
			properties: allSettings.properties,
			patternProperties: allSettings.patternProperties,
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		const userSettingsSchema: IJSONSchema = this.environmentService.remoteAuthority ?
			{
				properties: Object.assign({},
					applicationSettings.properties,
					windowSettings.properties,
					resourceSettings.properties
				),
				patternProperties: allSettings.patternProperties,
				additionalProperties: true,
				allowTrailingCommas: true,
				allowComments: true
			}
			: allSettingsSchema;

		const profileSettingsSchema: IJSONSchema = {
			properties: Object.assign({},
				machineSettings.properties,
				machineOverridableSettings.properties,
				windowSettings.properties,
				resourceSettings.properties
			),
			patternProperties: allSettings.patternProperties,
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		const machineSettingsSchema: IJSONSchema = {
			properties: Object.assign({},
				applicationMachineSettings.properties,
				machineSettings.properties,
				machineOverridableSettings.properties,
				windowSettings.properties,
				resourceSettings.properties
			),
			patternProperties: allSettings.patternProperties,
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		const workspaceSettingsSchema: IJSONSchema = {
			properties: Object.assign({},
				this.checkAndFilterPropertiesRequiringTrust(machineOverridableSettings.properties),
				this.checkAndFilterPropertiesRequiringTrust(windowSettings.properties),
				this.checkAndFilterPropertiesRequiringTrust(resourceSettings.properties)
			),
			patternProperties: allSettings.patternProperties,
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		const defaultSettingsSchema = {
			properties: Object.keys(allSettings.properties).reduce<IJSONSchemaMap>((result, key) => {
				result[key] = Object.assign({ deprecationMessage: undefined }, allSettings.properties[key]);
				return result;
			}, {}),
			patternProperties: Object.keys(allSettings.patternProperties).reduce<IJSONSchemaMap>((result, key) => {
				result[key] = Object.assign({ deprecationMessage: undefined }, allSettings.patternProperties[key]);
				return result;
			}, {}),
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		const folderSettingsSchema: IJSONSchema = WorkbenchState.WORKSPACE === this.workspaceContextService.getWorkbenchState() ?
			{
				properties: Object.assign({},
					this.checkAndFilterPropertiesRequiringTrust(machineOverridableSettings.properties),
					this.checkAndFilterPropertiesRequiringTrust(resourceSettings.properties)
				),
				patternProperties: allSettings.patternProperties,
				additionalProperties: true,
				allowTrailingCommas: true,
				allowComments: true
			} : workspaceSettingsSchema;

		const configDefaultsSchema: IJSONSchema = {
			type: 'object',
			description: localize('configurationDefaults.description', 'Contribute defaults for configurations'),
			properties: Object.assign({},
				this.filterDefaultOverridableProperties(machineOverridableSettings.properties),
				this.filterDefaultOverridableProperties(windowSettings.properties),
				this.filterDefaultOverridableProperties(resourceSettings.properties)
			),
			patternProperties: {
				[OVERRIDE_PROPERTY_PATTERN]: {
					type: 'object',
					default: {},
					$ref: resourceLanguageSettingsSchemaId,
				}
			},
			additionalProperties: false
		};
		this.registerSchemas({
			defaultSettingsSchema,
			userSettingsSchema,
			profileSettingsSchema,
			machineSettingsSchema,
			workspaceSettingsSchema,
			folderSettingsSchema,
			configDefaultsSchema,
		});
	}

	private registerSchemas(schemas: {
		defaultSettingsSchema: IJSONSchema;
		userSettingsSchema: IJSONSchema;
		profileSettingsSchema: IJSONSchema;
		machineSettingsSchema: IJSONSchema;
		workspaceSettingsSchema: IJSONSchema;
		folderSettingsSchema: IJSONSchema;
		configDefaultsSchema: IJSONSchema;
	}): void {
		const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
		jsonRegistry.registerSchema(defaultSettingsSchemaId, schemas.defaultSettingsSchema);
		jsonRegistry.registerSchema(userSettingsSchemaId, schemas.userSettingsSchema);
		jsonRegistry.registerSchema(profileSettingsSchemaId, schemas.profileSettingsSchema);
		jsonRegistry.registerSchema(machineSettingsSchemaId, schemas.machineSettingsSchema);
		jsonRegistry.registerSchema(workspaceSettingsSchemaId, schemas.workspaceSettingsSchema);
		jsonRegistry.registerSchema(folderSettingsSchemaId, schemas.folderSettingsSchema);
		jsonRegistry.registerSchema(configurationDefaultsSchemaId, schemas.configDefaultsSchema);
	}

	private checkAndFilterPropertiesRequiringTrust(properties: IStringDictionary<IConfigurationPropertySchema>): IStringDictionary<IConfigurationPropertySchema> {
		if (this.workspaceTrustManagementService.isWorkspaceTrusted()) {
			return properties;
		}

		const result: IStringDictionary<IConfigurationPropertySchema> = {};
		Object.entries(properties).forEach(([key, value]) => {
			if (!value.restricted) {
				result[key] = value;
			}
		});
		return result;
	}

	private filterDefaultOverridableProperties(properties: IStringDictionary<IConfigurationPropertySchema>): IStringDictionary<IConfigurationPropertySchema> {
		const result: IStringDictionary<IConfigurationPropertySchema> = {};
		Object.entries(properties).forEach(([key, value]) => {
			if (!value.disallowConfigurationDefault) {
				result[key] = value;
			}
		});
		return result;
	}
}

class ConfigurationDefaultOverridesContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.configurationDefaultOverridesContribution';

	private readonly processedExperimentalSettings = new Set<string>();
	private readonly autoExperimentalSettings = new Set<string>();
	private readonly configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
	private readonly throttler = this._register(new Throttler());

	constructor(
		@IWorkbenchAssignmentService private readonly workbenchAssignmentService: IWorkbenchAssignmentService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IConfigurationService private readonly configurationService: WorkspaceService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.throttler.queue(() => this.updateDefaults());
		this._register(workbenchAssignmentService.onDidRefetchAssignments(() => this.throttler.queue(() => this.processExperimentalSettings(this.autoExperimentalSettings, true))));

		// When configuration is updated make sure to apply experimental configuration overrides
		this._register(this.configurationRegistry.onDidUpdateConfiguration(({ properties }) => this.processExperimentalSettings(properties, false)));
	}

	private async updateDefaults(): Promise<void> {
		this.logService.trace('ConfigurationService#updateDefaults: begin');
		try {
			// Check for experiments
			await this.processExperimentalSettings(Object.keys(this.configurationRegistry.getConfigurationProperties()), false);
		} finally {
			// Invalidate defaults cache after extensions have registered
			// and after the experiments have been resolved to prevent
			// resetting the overrides too early.
			await this.extensionService.whenInstalledExtensionsRegistered();
			this.logService.trace('ConfigurationService#updateDefaults: resetting the defaults');
			this.configurationService.reloadConfiguration(ConfigurationTarget.DEFAULT);
		}
	}

	private async processExperimentalSettings(properties: Iterable<string>, autoRefetch: boolean): Promise<void> {
		const overrides: IStringDictionary<unknown> = {};
		const allProperties = this.configurationRegistry.getConfigurationProperties();
		for (const property of properties) {
			const schema = allProperties[property];
			if (!schema?.experiment) {
				continue;
			}
			if (!autoRefetch && this.processedExperimentalSettings.has(property)) {
				continue;
			}
			this.processedExperimentalSettings.add(property);
			if (schema.experiment.mode === 'auto') {
				this.autoExperimentalSettings.add(property);
			}
			try {
				const value = await this.workbenchAssignmentService.getTreatment(schema.experiment.name ?? `config.${property}`);
				if (!isUndefined(value) && !equals(value, schema.default)) {
					overrides[property] = value;
				}
			} catch (error) {/*ignore */ }
		}
		if (Object.keys(overrides).length) {
			this.configurationRegistry.registerDefaultConfigurations([{ overrides }]);
		}
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(RegisterConfigurationSchemasContribution, LifecyclePhase.Restored);
registerWorkbenchContribution2(ConfigurationDefaultOverridesContribution.ID, ConfigurationDefaultOverridesContribution, WorkbenchPhase.BlockRestore);

const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
configurationRegistry.registerConfiguration({
	...workbenchConfigurationNodeBase,
	properties: {
		[APPLY_ALL_PROFILES_SETTING]: {
			'type': 'array',
			description: localize('setting description', "Configure settings to be applied for all profiles."),
			'default': [],
			'scope': ConfigurationScope.APPLICATION,
			additionalProperties: true,
			uniqueItems: true,
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/configuration.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IAnyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';

export const FOLDER_CONFIG_FOLDER_NAME = '.vscode';
export const FOLDER_SETTINGS_NAME = 'settings';
export const FOLDER_SETTINGS_PATH = `${FOLDER_CONFIG_FOLDER_NAME}/${FOLDER_SETTINGS_NAME}.json`;

export const defaultSettingsSchemaId = 'vscode://schemas/settings/default';
export const userSettingsSchemaId = 'vscode://schemas/settings/user';
export const profileSettingsSchemaId = 'vscode://schemas/settings/profile';
export const machineSettingsSchemaId = 'vscode://schemas/settings/machine';
export const workspaceSettingsSchemaId = 'vscode://schemas/settings/workspace';
export const folderSettingsSchemaId = 'vscode://schemas/settings/folder';
export const launchSchemaId = 'vscode://schemas/launch';
export const tasksSchemaId = 'vscode://schemas/tasks';
export const mcpSchemaId = 'vscode://schemas/mcp';

export const APPLICATION_SCOPES = [ConfigurationScope.APPLICATION, ConfigurationScope.APPLICATION_MACHINE];
export const PROFILE_SCOPES = [ConfigurationScope.MACHINE, ConfigurationScope.WINDOW, ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE, ConfigurationScope.MACHINE_OVERRIDABLE];
export const LOCAL_MACHINE_PROFILE_SCOPES = [ConfigurationScope.WINDOW, ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE];
export const LOCAL_MACHINE_SCOPES = [ConfigurationScope.APPLICATION, ...LOCAL_MACHINE_PROFILE_SCOPES];
export const REMOTE_MACHINE_SCOPES = [ConfigurationScope.MACHINE, ConfigurationScope.APPLICATION_MACHINE, ConfigurationScope.WINDOW, ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE, ConfigurationScope.MACHINE_OVERRIDABLE];
export const WORKSPACE_SCOPES = [ConfigurationScope.WINDOW, ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE, ConfigurationScope.MACHINE_OVERRIDABLE];
export const FOLDER_SCOPES = [ConfigurationScope.RESOURCE, ConfigurationScope.LANGUAGE_OVERRIDABLE, ConfigurationScope.MACHINE_OVERRIDABLE];

export const TASKS_CONFIGURATION_KEY = 'tasks';
export const LAUNCH_CONFIGURATION_KEY = 'launch';
export const MCP_CONFIGURATION_KEY = 'mcp';

export const WORKSPACE_STANDALONE_CONFIGURATIONS = Object.create(null);
WORKSPACE_STANDALONE_CONFIGURATIONS[TASKS_CONFIGURATION_KEY] = `${FOLDER_CONFIG_FOLDER_NAME}/${TASKS_CONFIGURATION_KEY}.json`;
WORKSPACE_STANDALONE_CONFIGURATIONS[LAUNCH_CONFIGURATION_KEY] = `${FOLDER_CONFIG_FOLDER_NAME}/${LAUNCH_CONFIGURATION_KEY}.json`;
WORKSPACE_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY] = `${FOLDER_CONFIG_FOLDER_NAME}/${MCP_CONFIGURATION_KEY}.json`;
export const USER_STANDALONE_CONFIGURATIONS = Object.create(null);
USER_STANDALONE_CONFIGURATIONS[TASKS_CONFIGURATION_KEY] = `${TASKS_CONFIGURATION_KEY}.json`;
USER_STANDALONE_CONFIGURATIONS[MCP_CONFIGURATION_KEY] = `${MCP_CONFIGURATION_KEY}.json`;

export type ConfigurationKey = { type: 'defaults' | 'user' | 'workspaces' | 'folder'; key: string };

export interface IConfigurationCache {

	needsCaching(resource: URI): boolean;
	read(key: ConfigurationKey): Promise<string>;
	write(key: ConfigurationKey, content: string): Promise<void>;
	remove(key: ConfigurationKey): Promise<void>;

}

export type RestrictedSettings = {
	default: ReadonlyArray<string>;
	application?: ReadonlyArray<string>;
	userLocal?: ReadonlyArray<string>;
	userRemote?: ReadonlyArray<string>;
	workspace?: ReadonlyArray<string>;
	workspaceFolder?: ResourceMap<ReadonlyArray<string>>;
};

export const IWorkbenchConfigurationService = refineServiceDecorator<IConfigurationService, IWorkbenchConfigurationService>(IConfigurationService);
export interface IWorkbenchConfigurationService extends IConfigurationService {
	/**
	 * Restricted settings defined in each configuration target
	 */
	readonly restrictedSettings: RestrictedSettings;

	/**
	 * Event that triggers when the restricted settings changes
	 */
	readonly onDidChangeRestrictedSettings: Event<RestrictedSettings>;

	/**
	 * A promise that resolves when the remote configuration is loaded in a remote window.
	 * The promise is resolved immediately if the window is not remote.
	 */
	whenRemoteConfigurationLoaded(): Promise<void>;

	/**
	 * Initialize configuration service for the given workspace
	 * @param arg workspace Identifier
	 */
	initialize(arg: IAnyWorkspaceIdentifier): Promise<void>;

	/**
	 * Returns true if the setting can be applied for all profiles otherwise false.
	 * @param setting
	 */
	isSettingAppliedForAllProfiles(setting: string): boolean;
}

export const TASKS_DEFAULT = '{\n\t\"version\": \"2.0.0\",\n\t\"tasks\": []\n}';

export const APPLY_ALL_PROFILES_SETTING = 'workbench.settings.applyToAllProfiles';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/configurationCache.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/configurationCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationCache, ConfigurationKey } from './configuration.js';
import { URI } from '../../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { joinPath } from '../../../../base/common/resources.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { Queue } from '../../../../base/common/async.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';

export class ConfigurationCache implements IConfigurationCache {

	private readonly cacheHome: URI;
	private readonly cachedConfigurations: Map<string, CachedConfiguration> = new Map<string, CachedConfiguration>();

	constructor(
		private readonly donotCacheResourcesWithSchemes: string[],
		environmentService: IEnvironmentService,
		private readonly fileService: IFileService
	) {
		this.cacheHome = environmentService.cacheHome;
	}

	needsCaching(resource: URI): boolean {
		// Cache all non native resources
		return !this.donotCacheResourcesWithSchemes.includes(resource.scheme);
	}

	read(key: ConfigurationKey): Promise<string> {
		return this.getCachedConfiguration(key).read();
	}

	write(key: ConfigurationKey, content: string): Promise<void> {
		return this.getCachedConfiguration(key).save(content);
	}

	remove(key: ConfigurationKey): Promise<void> {
		return this.getCachedConfiguration(key).remove();
	}

	private getCachedConfiguration({ type, key }: ConfigurationKey): CachedConfiguration {
		const k = `${type}:${key}`;
		let cachedConfiguration = this.cachedConfigurations.get(k);
		if (!cachedConfiguration) {
			cachedConfiguration = new CachedConfiguration({ type, key }, this.cacheHome, this.fileService);
			this.cachedConfigurations.set(k, cachedConfiguration);
		}
		return cachedConfiguration;
	}
}

class CachedConfiguration {

	private queue: Queue<void>;
	private cachedConfigurationFolderResource: URI;
	private cachedConfigurationFileResource: URI;

	constructor(
		{ type, key }: ConfigurationKey,
		cacheHome: URI,
		private readonly fileService: IFileService
	) {
		this.cachedConfigurationFolderResource = joinPath(cacheHome, 'CachedConfigurations', type, key);
		this.cachedConfigurationFileResource = joinPath(this.cachedConfigurationFolderResource, type === 'workspaces' ? 'workspace.json' : 'configuration.json');
		this.queue = new Queue<void>();
	}

	async read(): Promise<string> {
		try {
			const content = await this.fileService.readFile(this.cachedConfigurationFileResource);
			return content.value.toString();
		} catch (e) {
			return '';
		}
	}

	async save(content: string): Promise<void> {
		const created = await this.createCachedFolder();
		if (created) {
			await this.queue.queue(async () => {
				await this.fileService.writeFile(this.cachedConfigurationFileResource, VSBuffer.fromString(content));
			});
		}
	}

	async remove(): Promise<void> {
		try {
			await this.queue.queue(() => this.fileService.del(this.cachedConfigurationFolderResource, { recursive: true, useTrash: false }));
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				throw error;
			}
		}
	}

	private async createCachedFolder(): Promise<boolean> {
		if (await this.fileService.exists(this.cachedConfigurationFolderResource)) {
			return true;
		}
		try {
			await this.fileService.createFolder(this.cachedConfigurationFolderResource);
			return true;
		} catch (error) {
			return false;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/configurationEditing.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/configurationEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import * as json from '../../../../base/common/json.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { Queue } from '../../../../base/common/async.js';
import { Edit, FormattingOptions } from '../../../../base/common/jsonFormatter.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IConfigurationUpdateOptions, IConfigurationUpdateOverrides } from '../../../../platform/configuration/common/configuration.js';
import { FOLDER_SETTINGS_PATH, WORKSPACE_STANDALONE_CONFIGURATIONS, TASKS_CONFIGURATION_KEY, LAUNCH_CONFIGURATION_KEY, USER_STANDALONE_CONFIGURATIONS, TASKS_DEFAULT, FOLDER_SCOPES, IWorkbenchConfigurationService, APPLICATION_SCOPES, MCP_CONFIGURATION_KEY } from './configuration.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope, keyFromOverrideIdentifiers, OVERRIDE_PROPERTY_REGEX } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenSettingsOptions, IPreferencesService } from '../../preferences/common/preferences.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { Range } from '../../../../editor/common/core/range.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { ErrorNoTelemetry } from '../../../../base/common/errors.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';

export const enum ConfigurationEditingErrorCode {

	/**
	 * Error when trying to write a configuration key that is not registered.
	 */
	ERROR_UNKNOWN_KEY,

	/**
	 * Error when trying to write an application setting into workspace settings.
	 */
	ERROR_INVALID_WORKSPACE_CONFIGURATION_APPLICATION,

	/**
	 * Error when trying to write a machne setting into workspace settings.
	 */
	ERROR_INVALID_WORKSPACE_CONFIGURATION_MACHINE,

	/**
	 * Error when trying to write an invalid folder configuration key to folder settings.
	 */
	ERROR_INVALID_FOLDER_CONFIGURATION,

	/**
	 * Error when trying to write to user target but not supported for provided key.
	 */
	ERROR_INVALID_USER_TARGET,

	/**
	 * Error when trying to write to user target but not supported for provided key.
	 */
	ERROR_INVALID_WORKSPACE_TARGET,

	/**
	 * Error when trying to write a configuration key to folder target
	 */
	ERROR_INVALID_FOLDER_TARGET,

	/**
	 * Error when trying to write to language specific setting but not supported for preovided key
	 */
	ERROR_INVALID_RESOURCE_LANGUAGE_CONFIGURATION,

	/**
	 * Error when trying to write to the workspace configuration without having a workspace opened.
	 */
	ERROR_NO_WORKSPACE_OPENED,

	/**
	 * Error when trying to write and save to the configuration file while it is dirty in the editor.
	 */
	ERROR_CONFIGURATION_FILE_DIRTY,

	/**
	 * Error when trying to write and save to the configuration file while it is not the latest in the disk.
	 */
	ERROR_CONFIGURATION_FILE_MODIFIED_SINCE,

	/**
	 * Error when trying to write to a configuration file that contains JSON errors.
	 */
	ERROR_INVALID_CONFIGURATION,

	/**
	 * Error when trying to write a policy configuration
	 */
	ERROR_POLICY_CONFIGURATION,

	/**
	 * Internal Error.
	 */
	ERROR_INTERNAL
}

export class ConfigurationEditingError extends ErrorNoTelemetry {
	constructor(message: string, public code: ConfigurationEditingErrorCode) {
		super(message);
	}
}

export interface IConfigurationValue {
	key: string;
	value: unknown;
}

export interface IConfigurationEditingOptions extends IConfigurationUpdateOptions {
	/**
	 * Scope of configuration to be written into.
	 */
	scopes?: IConfigurationUpdateOverrides;
}

export const enum EditableConfigurationTarget {
	USER_LOCAL = 1,
	USER_REMOTE,
	WORKSPACE,
	WORKSPACE_FOLDER
}

interface IConfigurationEditOperation extends IConfigurationValue {
	target: EditableConfigurationTarget;
	jsonPath: json.JSONPath;
	resource?: URI;
	workspaceStandAloneConfigurationKey?: string;
}

export class ConfigurationEditing {

	public _serviceBrand: undefined;

	private queue: Queue<void>;

	constructor(
		private readonly remoteSettingsResource: URI | null,
		@IWorkbenchConfigurationService private readonly configurationService: IWorkbenchConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IFileService private readonly fileService: IFileService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@INotificationService private readonly notificationService: INotificationService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IEditorService private readonly editorService: IEditorService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService
	) {
		this.queue = new Queue<void>();
	}

	async writeConfiguration(target: EditableConfigurationTarget, value: IConfigurationValue, options: IConfigurationEditingOptions = {}): Promise<void> {
		const operation = this.getConfigurationEditOperation(target, value, options.scopes || {});
		// queue up writes to prevent race conditions
		return this.queue.queue(async () => {
			try {
				await this.doWriteConfiguration(operation, options);
			} catch (error) {
				if (options.donotNotifyError) {
					throw error;
				}
				await this.onError(error, operation, options.scopes);
			}
		});
	}

	private async doWriteConfiguration(operation: IConfigurationEditOperation, options: IConfigurationEditingOptions): Promise<void> {
		await this.validate(operation.target, operation, !options.handleDirtyFile, options.scopes || {});
		const resource: URI = operation.resource!;
		const reference = await this.resolveModelReference(resource);
		try {
			const formattingOptions = this.getFormattingOptions(reference.object.textEditorModel);
			await this.updateConfiguration(operation, reference.object.textEditorModel, formattingOptions, options);
		} finally {
			reference.dispose();
		}
	}

	private async updateConfiguration(operation: IConfigurationEditOperation, model: ITextModel, formattingOptions: FormattingOptions, options: IConfigurationEditingOptions): Promise<void> {
		if (this.hasParseErrors(model.getValue(), operation)) {
			throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION, operation.target, operation);
		}

		if (this.textFileService.isDirty(model.uri) && options.handleDirtyFile) {
			switch (options.handleDirtyFile) {
				case 'save': await this.save(model, operation); break;
				case 'revert': await this.textFileService.revert(model.uri); break;
			}
		}

		const edit = this.getEdits(operation, model.getValue(), formattingOptions)[0];
		if (edit) {
			let disposable: IDisposable | undefined;
			try {
				// Optimization: we apply edits to a text model and save it
				// right after. Use the files config service to signal this
				// to the workbench to optimise the UI during this operation.
				// For example, avoids to briefly show dirty indicators.
				disposable = this.filesConfigurationService.enableAutoSaveAfterShortDelay(model.uri);
				if (this.applyEditsToBuffer(edit, model)) {
					await this.save(model, operation);
				}
			} finally {
				disposable?.dispose();
			}
		}
	}

	private async save(model: ITextModel, operation: IConfigurationEditOperation): Promise<void> {
		try {
			await this.textFileService.save(model.uri, { ignoreErrorHandler: true });
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE) {
				throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_MODIFIED_SINCE, operation.target, operation);
			}
			throw new ConfigurationEditingError(nls.localize('fsError', "Error while writing to {0}. {1}", this.stringifyTarget(operation.target), error.message), ConfigurationEditingErrorCode.ERROR_INTERNAL);
		}
	}

	private applyEditsToBuffer(edit: Edit, model: ITextModel): boolean {
		const startPosition = model.getPositionAt(edit.offset);
		const endPosition = model.getPositionAt(edit.offset + edit.length);
		const range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
		const currentText = model.getValueInRange(range);
		if (edit.content !== currentText) {
			const editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
			model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], () => []);
			return true;
		}
		return false;
	}

	private getEdits({ value, jsonPath }: IConfigurationEditOperation, modelContent: string, formattingOptions: FormattingOptions): Edit[] {
		if (jsonPath.length) {
			return setProperty(modelContent, jsonPath, value, formattingOptions);
		}

		// Without jsonPath, the entire configuration file is being replaced, so we just use JSON.stringify
		const content = JSON.stringify(value, null, formattingOptions.insertSpaces && formattingOptions.tabSize ? ' '.repeat(formattingOptions.tabSize) : '\t');
		return [{
			content,
			length: modelContent.length,
			offset: 0
		}];
	}

	private getFormattingOptions(model: ITextModel): FormattingOptions {
		const { insertSpaces, tabSize } = model.getOptions();
		const eol = model.getEOL();
		return { insertSpaces, tabSize, eol };
	}

	private async onError(error: ConfigurationEditingError, operation: IConfigurationEditOperation, scopes: IConfigurationUpdateOverrides | undefined): Promise<void> {
		switch (error.code) {
			case ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION:
				this.onInvalidConfigurationError(error, operation);
				break;
			case ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY:
				this.onConfigurationFileDirtyError(error, operation, scopes);
				break;
			case ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_MODIFIED_SINCE:
				return this.doWriteConfiguration(operation, { scopes, handleDirtyFile: 'revert' });
			default:
				this.notificationService.error(error.message);
		}
	}

	private onInvalidConfigurationError(error: ConfigurationEditingError, operation: IConfigurationEditOperation,): void {
		const openStandAloneConfigurationActionLabel = operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY ? nls.localize('openTasksConfiguration', "Open Tasks Configuration")
			: operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY ? nls.localize('openLaunchConfiguration', "Open Launch Configuration")
				: operation.workspaceStandAloneConfigurationKey === MCP_CONFIGURATION_KEY ? nls.localize('openMcpConfiguration', "Open MCP Configuration")
					: null;
		if (openStandAloneConfigurationActionLabel) {
			this.notificationService.prompt(Severity.Error, error.message,
				[{
					label: openStandAloneConfigurationActionLabel,
					run: () => this.openFile(operation.resource!)
				}]
			);
		} else {
			this.notificationService.prompt(Severity.Error, error.message,
				[{
					label: nls.localize('open', "Open Settings"),
					run: () => this.openSettings(operation)
				}]
			);
		}
	}

	private onConfigurationFileDirtyError(error: ConfigurationEditingError, operation: IConfigurationEditOperation, scopes: IConfigurationUpdateOverrides | undefined): void {
		const openStandAloneConfigurationActionLabel = operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY ? nls.localize('openTasksConfiguration', "Open Tasks Configuration")
			: operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY ? nls.localize('openLaunchConfiguration', "Open Launch Configuration")
				: null;
		if (openStandAloneConfigurationActionLabel) {
			this.notificationService.prompt(Severity.Error, error.message,
				[{
					label: nls.localize('saveAndRetry', "Save and Retry"),
					run: () => {
						const key = operation.key ? `${operation.workspaceStandAloneConfigurationKey}.${operation.key}` : operation.workspaceStandAloneConfigurationKey!;
						this.writeConfiguration(operation.target, { key, value: operation.value }, { handleDirtyFile: 'save', scopes });
					}
				},
				{
					label: openStandAloneConfigurationActionLabel,
					run: () => this.openFile(operation.resource!)
				}]
			);
		} else {
			this.notificationService.prompt(Severity.Error, error.message,
				[{
					label: nls.localize('saveAndRetry', "Save and Retry"),
					run: () => this.writeConfiguration(operation.target, { key: operation.key, value: operation.value }, { handleDirtyFile: 'save', scopes })
				},
				{
					label: nls.localize('open', "Open Settings"),
					run: () => this.openSettings(operation)
				}]
			);
		}
	}

	private openSettings(operation: IConfigurationEditOperation): void {
		const options: IOpenSettingsOptions = { jsonEditor: true };
		switch (operation.target) {
			case EditableConfigurationTarget.USER_LOCAL:
				this.preferencesService.openUserSettings(options);
				break;
			case EditableConfigurationTarget.USER_REMOTE:
				this.preferencesService.openRemoteSettings(options);
				break;
			case EditableConfigurationTarget.WORKSPACE:
				this.preferencesService.openWorkspaceSettings(options);
				break;
			case EditableConfigurationTarget.WORKSPACE_FOLDER:
				if (operation.resource) {
					const workspaceFolder = this.contextService.getWorkspaceFolder(operation.resource);
					if (workspaceFolder) {
						this.preferencesService.openFolderSettings({ folderUri: workspaceFolder.uri, jsonEditor: true });
					}
				}
				break;
		}
	}

	private openFile(resource: URI): void {
		this.editorService.openEditor({ resource, options: { pinned: true } });
	}

	private toConfigurationEditingError(code: ConfigurationEditingErrorCode, target: EditableConfigurationTarget, operation: IConfigurationEditOperation): ConfigurationEditingError {
		const message = this.toErrorMessage(code, target, operation);
		return new ConfigurationEditingError(message, code);
	}

	private toErrorMessage(error: ConfigurationEditingErrorCode, target: EditableConfigurationTarget, operation: IConfigurationEditOperation): string {
		switch (error) {

			// API constraints
			case ConfigurationEditingErrorCode.ERROR_POLICY_CONFIGURATION: return nls.localize('errorPolicyConfiguration', "Unable to write {0} because it is configured in system policy.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY: return nls.localize('errorUnknownKey', "Unable to write to {0} because {1} is not a registered configuration.", this.stringifyTarget(target), operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_WORKSPACE_CONFIGURATION_APPLICATION: return nls.localize('errorInvalidWorkspaceConfigurationApplication', "Unable to write {0} to Workspace Settings. This setting can be written only into User settings.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_WORKSPACE_CONFIGURATION_MACHINE: return nls.localize('errorInvalidWorkspaceConfigurationMachine', "Unable to write {0} to Workspace Settings. This setting can be written only into User settings.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_CONFIGURATION: return nls.localize('errorInvalidFolderConfiguration', "Unable to write to Folder Settings because {0} does not support the folder resource scope.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_USER_TARGET: return nls.localize('errorInvalidUserTarget', "Unable to write to User Settings because {0} does not support for global scope.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_WORKSPACE_TARGET: return nls.localize('errorInvalidWorkspaceTarget', "Unable to write to Workspace Settings because {0} does not support for workspace scope in a multi folder workspace.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_TARGET: return nls.localize('errorInvalidFolderTarget', "Unable to write to Folder Settings because no resource is provided.");
			case ConfigurationEditingErrorCode.ERROR_INVALID_RESOURCE_LANGUAGE_CONFIGURATION: return nls.localize('errorInvalidResourceLanguageConfiguration', "Unable to write to Language Settings because {0} is not a resource language setting.", operation.key);
			case ConfigurationEditingErrorCode.ERROR_NO_WORKSPACE_OPENED: return nls.localize('errorNoWorkspaceOpened', "Unable to write to {0} because no workspace is opened. Please open a workspace first and try again.", this.stringifyTarget(target));

			// User issues
			case ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION: {
				if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY) {
					return nls.localize('errorInvalidTaskConfiguration', "Unable to write into the tasks configuration file. Please open it to correct errors/warnings in it and try again.");
				}
				if (operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY) {
					return nls.localize('errorInvalidLaunchConfiguration', "Unable to write into the launch configuration file. Please open it to correct errors/warnings in it and try again.");
				}
				if (operation.workspaceStandAloneConfigurationKey === MCP_CONFIGURATION_KEY) {
					return nls.localize('errorInvalidMCPConfiguration', "Unable to write into the MCP configuration file. Please open it to correct errors/warnings in it and try again.");
				}
				switch (target) {
					case EditableConfigurationTarget.USER_LOCAL:
						return nls.localize('errorInvalidConfiguration', "Unable to write into user settings. Please open the user settings to correct errors/warnings in it and try again.");
					case EditableConfigurationTarget.USER_REMOTE:
						return nls.localize('errorInvalidRemoteConfiguration', "Unable to write into remote user settings. Please open the remote user settings to correct errors/warnings in it and try again.");
					case EditableConfigurationTarget.WORKSPACE:
						return nls.localize('errorInvalidConfigurationWorkspace', "Unable to write into workspace settings. Please open the workspace settings to correct errors/warnings in the file and try again.");
					case EditableConfigurationTarget.WORKSPACE_FOLDER: {
						let workspaceFolderName: string = '<<unknown>>';
						if (operation.resource) {
							const folder = this.contextService.getWorkspaceFolder(operation.resource);
							if (folder) {
								workspaceFolderName = folder.name;
							}
						}
						return nls.localize('errorInvalidConfigurationFolder', "Unable to write into folder settings. Please open the '{0}' folder settings to correct errors/warnings in it and try again.", workspaceFolderName);
					}
					default:
						return '';
				}
			}
			case ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY: {
				if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY) {
					return nls.localize('errorTasksConfigurationFileDirty', "Unable to write into tasks configuration file because the file has unsaved changes. Please save it first and then try again.");
				}
				if (operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY) {
					return nls.localize('errorLaunchConfigurationFileDirty', "Unable to write into launch configuration file because the file has unsaved changes. Please save it first and then try again.");
				}
				if (operation.workspaceStandAloneConfigurationKey === MCP_CONFIGURATION_KEY) {
					return nls.localize('errorMCPConfigurationFileDirty', "Unable to write into MCP configuration file because the file has unsaved changes. Please save it first and then try again.");
				}
				switch (target) {
					case EditableConfigurationTarget.USER_LOCAL:
						return nls.localize('errorConfigurationFileDirty', "Unable to write into user settings because the file has unsaved changes. Please save the user settings file first and then try again.");
					case EditableConfigurationTarget.USER_REMOTE:
						return nls.localize('errorRemoteConfigurationFileDirty', "Unable to write into remote user settings because the file has unsaved changes. Please save the remote user settings file first and then try again.");
					case EditableConfigurationTarget.WORKSPACE:
						return nls.localize('errorConfigurationFileDirtyWorkspace', "Unable to write into workspace settings because the file has unsaved changes. Please save the workspace settings file first and then try again.");
					case EditableConfigurationTarget.WORKSPACE_FOLDER: {
						let workspaceFolderName: string = '<<unknown>>';
						if (operation.resource) {
							const folder = this.contextService.getWorkspaceFolder(operation.resource);
							if (folder) {
								workspaceFolderName = folder.name;
							}
						}
						return nls.localize('errorConfigurationFileDirtyFolder', "Unable to write into folder settings because the file has unsaved changes. Please save the '{0}' folder settings file first and then try again.", workspaceFolderName);
					}
					default:
						return '';
				}
			}
			case ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_MODIFIED_SINCE:
				if (operation.workspaceStandAloneConfigurationKey === TASKS_CONFIGURATION_KEY) {
					return nls.localize('errorTasksConfigurationFileModifiedSince', "Unable to write into tasks configuration file because the content of the file is newer.");
				}
				if (operation.workspaceStandAloneConfigurationKey === LAUNCH_CONFIGURATION_KEY) {
					return nls.localize('errorLaunchConfigurationFileModifiedSince', "Unable to write into launch configuration file because the content of the file is newer.");
				}
				if (operation.workspaceStandAloneConfigurationKey === MCP_CONFIGURATION_KEY) {
					return nls.localize('errorMCPConfigurationFileModifiedSince', "Unable to write into MCP configuration file because the content of the file is newer.");
				}
				switch (target) {
					case EditableConfigurationTarget.USER_LOCAL:
						return nls.localize('errorConfigurationFileModifiedSince', "Unable to write into user settings because the content of the file is newer.");
					case EditableConfigurationTarget.USER_REMOTE:
						return nls.localize('errorRemoteConfigurationFileModifiedSince', "Unable to write into remote user settings because the content of the file is newer.");
					case EditableConfigurationTarget.WORKSPACE:
						return nls.localize('errorConfigurationFileModifiedSinceWorkspace', "Unable to write into workspace settings because the content of the file is newer.");
					case EditableConfigurationTarget.WORKSPACE_FOLDER:
						return nls.localize('errorConfigurationFileModifiedSinceFolder', "Unable to write into folder settings because the content of the file is newer.");
				}
			case ConfigurationEditingErrorCode.ERROR_INTERNAL: return nls.localize('errorUnknown', "Unable to write to {0} because of an internal error.", this.stringifyTarget(target));
		}
	}

	private stringifyTarget(target: EditableConfigurationTarget): string {
		switch (target) {
			case EditableConfigurationTarget.USER_LOCAL:
				return nls.localize('userTarget', "User Settings");
			case EditableConfigurationTarget.USER_REMOTE:
				return nls.localize('remoteUserTarget', "Remote User Settings");
			case EditableConfigurationTarget.WORKSPACE:
				return nls.localize('workspaceTarget', "Workspace Settings");
			case EditableConfigurationTarget.WORKSPACE_FOLDER:
				return nls.localize('folderTarget', "Folder Settings");
			default:
				return '';
		}
	}

	private defaultResourceValue(resource: URI): string {
		const basename: string = this.uriIdentityService.extUri.basename(resource);
		const configurationValue: string = basename.substr(0, basename.length - this.uriIdentityService.extUri.extname(resource).length);
		switch (configurationValue) {
			case TASKS_CONFIGURATION_KEY: return TASKS_DEFAULT;
			default: return '{}';
		}
	}

	private async resolveModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {
		const exists = await this.fileService.exists(resource);
		if (!exists) {
			await this.textFileService.write(resource, this.defaultResourceValue(resource), { encoding: 'utf8' });
		}
		return this.textModelResolverService.createModelReference(resource);
	}

	private hasParseErrors(content: string, operation: IConfigurationEditOperation): boolean {
		// If we write to a workspace standalone file and replace the entire contents (no key provided)
		// we can return here because any parse errors can safely be ignored since all contents are replaced
		if (operation.workspaceStandAloneConfigurationKey && !operation.key) {
			return false;
		}
		const parseErrors: json.ParseError[] = [];
		json.parse(content, parseErrors, { allowTrailingComma: true, allowEmptyContent: true });
		return parseErrors.length > 0;
	}

	private async validate(target: EditableConfigurationTarget, operation: IConfigurationEditOperation, checkDirty: boolean, overrides: IConfigurationUpdateOverrides): Promise<void> {

		if (this.configurationService.inspect(operation.key).policyValue !== undefined) {
			throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_POLICY_CONFIGURATION, target, operation);
		}

		const configurationProperties = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
		const configurationScope = configurationProperties[operation.key]?.scope;

		/**
		 * Key to update must be a known setting from the registry unless
		 * 	- the key is standalone configuration (eg: tasks, debug)
		 * 	- the key is an override identifier
		 * 	- the operation is to delete the key
		 */
		if (!operation.workspaceStandAloneConfigurationKey) {
			const validKeys = this.configurationService.keys().default;
			if (validKeys.indexOf(operation.key) < 0 && !OVERRIDE_PROPERTY_REGEX.test(operation.key) && operation.value !== undefined) {
				throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY, target, operation);
			}
		}

		if (operation.workspaceStandAloneConfigurationKey) {
			// Global launches are not supported
			if ((operation.workspaceStandAloneConfigurationKey !== TASKS_CONFIGURATION_KEY) && (operation.workspaceStandAloneConfigurationKey !== MCP_CONFIGURATION_KEY) && (target === EditableConfigurationTarget.USER_LOCAL || target === EditableConfigurationTarget.USER_REMOTE)) {
				throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_USER_TARGET, target, operation);
			}
		}

		// Target cannot be workspace or folder if no workspace opened
		if ((target === EditableConfigurationTarget.WORKSPACE || target === EditableConfigurationTarget.WORKSPACE_FOLDER) && this.contextService.getWorkbenchState() === WorkbenchState.EMPTY) {
			throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_NO_WORKSPACE_OPENED, target, operation);
		}

		if (target === EditableConfigurationTarget.WORKSPACE) {
			if (!operation.workspaceStandAloneConfigurationKey && !OVERRIDE_PROPERTY_REGEX.test(operation.key)) {
				if (configurationScope && APPLICATION_SCOPES.includes(configurationScope)) {
					throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_WORKSPACE_CONFIGURATION_APPLICATION, target, operation);
				}
				if (configurationScope === ConfigurationScope.MACHINE) {
					throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_WORKSPACE_CONFIGURATION_MACHINE, target, operation);
				}
			}
		}

		if (target === EditableConfigurationTarget.WORKSPACE_FOLDER) {
			if (!operation.resource) {
				throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_TARGET, target, operation);
			}

			if (!operation.workspaceStandAloneConfigurationKey && !OVERRIDE_PROPERTY_REGEX.test(operation.key)) {
				if (configurationScope !== undefined && !FOLDER_SCOPES.includes(configurationScope)) {
					throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_CONFIGURATION, target, operation);
				}
			}
		}

		if (overrides.overrideIdentifiers?.length) {
			if (configurationScope !== ConfigurationScope.LANGUAGE_OVERRIDABLE) {
				throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_RESOURCE_LANGUAGE_CONFIGURATION, target, operation);
			}
		}

		if (!operation.resource) {
			throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_TARGET, target, operation);
		}

		if (checkDirty && this.textFileService.isDirty(operation.resource)) {
			throw this.toConfigurationEditingError(ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY, target, operation);
		}

	}

	private getConfigurationEditOperation(target: EditableConfigurationTarget, config: IConfigurationValue, overrides: IConfigurationUpdateOverrides): IConfigurationEditOperation {

		// Check for standalone workspace configurations
		if (config.key) {
			const standaloneConfigurationMap = target === EditableConfigurationTarget.USER_LOCAL ? USER_STANDALONE_CONFIGURATIONS : WORKSPACE_STANDALONE_CONFIGURATIONS;
			const standaloneConfigurationKeys = Object.keys(standaloneConfigurationMap);
			for (const key of standaloneConfigurationKeys) {
				const resource = this.getConfigurationFileResource(target, key, standaloneConfigurationMap[key], overrides.resource, undefined);

				// Check for prefix
				if (config.key === key) {
					const jsonPath = this.isWorkspaceConfigurationResource(resource) ? [key] : [];
					return { key: jsonPath[jsonPath.length - 1], jsonPath, value: config.value, resource: resource ?? undefined, workspaceStandAloneConfigurationKey: key, target };
				}

				// Check for prefix.<setting>
				const keyPrefix = `${key}.`;
				if (config.key.indexOf(keyPrefix) === 0) {
					const jsonPath = this.isWorkspaceConfigurationResource(resource) ? [key, config.key.substring(keyPrefix.length)] : [config.key.substring(keyPrefix.length)];
					return { key: jsonPath[jsonPath.length - 1], jsonPath, value: config.value, resource: resource ?? undefined, workspaceStandAloneConfigurationKey: key, target };
				}
			}
		}

		const key = config.key;
		const configurationProperties = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
		const configurationScope = configurationProperties[key]?.scope;
		let jsonPath = overrides.overrideIdentifiers?.length ? [keyFromOverrideIdentifiers(overrides.overrideIdentifiers), key] : [key];
		if (target === EditableConfigurationTarget.USER_LOCAL || target === EditableConfigurationTarget.USER_REMOTE) {
			return { key, jsonPath, value: config.value, resource: this.getConfigurationFileResource(target, key, '', null, configurationScope) ?? undefined, target };
		}

		const resource = this.getConfigurationFileResource(target, key, FOLDER_SETTINGS_PATH, overrides.resource, configurationScope);
		if (this.isWorkspaceConfigurationResource(resource)) {
			jsonPath = ['settings', ...jsonPath];
		}
		return { key, jsonPath, value: config.value, resource: resource ?? undefined, target };
	}

	private isWorkspaceConfigurationResource(resource: URI | null): boolean {
		const workspace = this.contextService.getWorkspace();
		return !!(workspace.configuration && resource && workspace.configuration.fsPath === resource.fsPath);
	}

	private getConfigurationFileResource(target: EditableConfigurationTarget, key: string, relativePath: string, resource: URI | null | undefined, scope: ConfigurationScope | undefined): URI | null {
		if (target === EditableConfigurationTarget.USER_LOCAL) {
			if (key === TASKS_CONFIGURATION_KEY) {
				return this.userDataProfileService.currentProfile.tasksResource;
			} if (key === MCP_CONFIGURATION_KEY) {
				return this.userDataProfileService.currentProfile.mcpResource;
			} else {
				if (!this.userDataProfileService.currentProfile.isDefault && this.configurationService.isSettingAppliedForAllProfiles(key)) {
					return this.userDataProfilesService.defaultProfile.settingsResource;
				}
				return this.userDataProfileService.currentProfile.settingsResource;
			}
		}
		if (target === EditableConfigurationTarget.USER_REMOTE) {
			return this.remoteSettingsResource;
		}
		const workbenchState = this.contextService.getWorkbenchState();
		if (workbenchState !== WorkbenchState.EMPTY) {

			const workspace = this.contextService.getWorkspace();

			if (target === EditableConfigurationTarget.WORKSPACE) {
				if (workbenchState === WorkbenchState.WORKSPACE) {
					return workspace.configuration ?? null;
				}
				if (workbenchState === WorkbenchState.FOLDER) {
					return workspace.folders[0].toResource(relativePath);
				}
			}

			if (target === EditableConfigurationTarget.WORKSPACE_FOLDER) {
				if (resource) {
					const folder = this.contextService.getWorkspaceFolder(resource);
					if (folder) {
						return folder.toResource(relativePath);
					}
				}
			}
		}
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/configurationModels.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/configurationModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/objects.js';
import { toValuesTree, IConfigurationModel, IConfigurationOverrides, IConfigurationValue, IConfigurationChange } from '../../../../platform/configuration/common/configuration.js';
import { Configuration as BaseConfiguration, ConfigurationModelParser, ConfigurationModel, ConfigurationParseOptions } from '../../../../platform/configuration/common/configurationModels.js';
import { IStoredWorkspaceFolder } from '../../../../platform/workspaces/common/workspaces.js';
import { Workspace } from '../../../../platform/workspace/common/workspace.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { isBoolean } from '../../../../base/common/types.js';
import { distinct } from '../../../../base/common/arrays.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStringDictionary } from '../../../../base/common/collections.js';

export class WorkspaceConfigurationModelParser extends ConfigurationModelParser {

	private _folders: IStoredWorkspaceFolder[] = [];
	private _transient: boolean = false;
	private _settingsModelParser: ConfigurationModelParser;
	private _launchModel: ConfigurationModel;
	private _tasksModel: ConfigurationModel;

	constructor(name: string, logService: ILogService) {
		super(name, logService);
		this._settingsModelParser = new ConfigurationModelParser(name, logService);
		this._launchModel = ConfigurationModel.createEmptyModel(logService);
		this._tasksModel = ConfigurationModel.createEmptyModel(logService);
	}

	get folders(): IStoredWorkspaceFolder[] {
		return this._folders;
	}

	get transient(): boolean {
		return this._transient;
	}

	get settingsModel(): ConfigurationModel {
		return this._settingsModelParser.configurationModel;
	}

	get launchModel(): ConfigurationModel {
		return this._launchModel;
	}

	get tasksModel(): ConfigurationModel {
		return this._tasksModel;
	}

	reparseWorkspaceSettings(configurationParseOptions: ConfigurationParseOptions): void {
		this._settingsModelParser.reparse(configurationParseOptions);
	}

	getRestrictedWorkspaceSettings(): string[] {
		return this._settingsModelParser.restrictedConfigurations;
	}

	protected override doParseRaw(raw: IStringDictionary<unknown>, configurationParseOptions?: ConfigurationParseOptions): IConfigurationModel {
		this._folders = (raw['folders'] || []) as IStoredWorkspaceFolder[];
		this._transient = isBoolean(raw['transient']) && raw['transient'];
		this._settingsModelParser.parseRaw(raw['settings'] as IStringDictionary<unknown>, configurationParseOptions);
		this._launchModel = this.createConfigurationModelFrom(raw, 'launch');
		this._tasksModel = this.createConfigurationModelFrom(raw, 'tasks');
		return super.doParseRaw(raw, configurationParseOptions);
	}

	private createConfigurationModelFrom(raw: IStringDictionary<unknown>, key: string): ConfigurationModel {
		const data = raw[key] as IStringDictionary<unknown> | undefined;
		if (data) {
			const contents = toValuesTree(data, message => console.error(`Conflict in settings file ${this._name}: ${message}`));
			const scopedContents = Object.create(null);
			scopedContents[key] = contents;
			const keys = Object.keys(data).map(k => `${key}.${k}`);
			return new ConfigurationModel(scopedContents, keys, [], undefined, this.logService);
		}
		return ConfigurationModel.createEmptyModel(this.logService);
	}
}

export class StandaloneConfigurationModelParser extends ConfigurationModelParser {

	constructor(name: string, private readonly scope: string, logService: ILogService,) {
		super(name, logService);
	}

	protected override doParseRaw(raw: IStringDictionary<unknown>, configurationParseOptions?: ConfigurationParseOptions): IConfigurationModel {
		const contents = toValuesTree(raw, message => console.error(`Conflict in settings file ${this._name}: ${message}`));
		const scopedContents = Object.create(null);
		scopedContents[this.scope] = contents;
		const keys = Object.keys(raw).map(key => `${this.scope}.${key}`);
		return { contents: scopedContents, keys, overrides: [] };
	}

}

export class Configuration extends BaseConfiguration {

	constructor(
		defaults: ConfigurationModel,
		policy: ConfigurationModel,
		application: ConfigurationModel,
		localUser: ConfigurationModel,
		remoteUser: ConfigurationModel,
		workspaceConfiguration: ConfigurationModel,
		folders: ResourceMap<ConfigurationModel>,
		memoryConfiguration: ConfigurationModel,
		memoryConfigurationByResource: ResourceMap<ConfigurationModel>,
		private readonly _workspace: Workspace | undefined,
		logService: ILogService
	) {
		super(defaults, policy, application, localUser, remoteUser, workspaceConfiguration, folders, memoryConfiguration, memoryConfigurationByResource, logService);
	}

	override getValue(key: string | undefined, overrides: IConfigurationOverrides = {}): unknown {
		return super.getValue(key, overrides, this._workspace);
	}

	override inspect<C>(key: string, overrides: IConfigurationOverrides = {}): IConfigurationValue<C> {
		return super.inspect(key, overrides, this._workspace);
	}

	override keys(): {
		default: string[];
		policy: string[];
		user: string[];
		workspace: string[];
		workspaceFolder: string[];
	} {
		return super.keys(this._workspace);
	}

	override compareAndDeleteFolderConfiguration(folder: URI): IConfigurationChange {
		if (this._workspace && this._workspace.folders.length > 0 && this._workspace.folders[0].uri.toString() === folder.toString()) {
			// Do not remove workspace configuration
			return { keys: [], overrides: [] };
		}
		return super.compareAndDeleteFolderConfiguration(folder);
	}

	compare(other: Configuration): IConfigurationChange {
		const compare = (fromKeys: string[], toKeys: string[], overrideIdentifier?: string): string[] => {
			const keys: string[] = [];
			keys.push(...toKeys.filter(key => fromKeys.indexOf(key) === -1));
			keys.push(...fromKeys.filter(key => toKeys.indexOf(key) === -1));
			keys.push(...fromKeys.filter(key => {
				// Ignore if the key does not exist in both models
				if (toKeys.indexOf(key) === -1) {
					return false;
				}
				// Compare workspace value
				if (!equals(this.getValue(key, { overrideIdentifier }), other.getValue(key, { overrideIdentifier }))) {
					return true;
				}
				// Compare workspace folder value
				return this._workspace && this._workspace.folders.some(folder => !equals(this.getValue(key, { resource: folder.uri, overrideIdentifier }), other.getValue(key, { resource: folder.uri, overrideIdentifier })));
			}));
			return keys;
		};
		const keys = compare(this.allKeys(), other.allKeys());
		const overrides: [string, string[]][] = [];
		const allOverrideIdentifiers = distinct([...this.allOverrideIdentifiers(), ...other.allOverrideIdentifiers()]);
		for (const overrideIdentifier of allOverrideIdentifiers) {
			const keys = compare(this.getAllKeysForOverrideIdentifier(overrideIdentifier), other.getAllKeysForOverrideIdentifier(overrideIdentifier), overrideIdentifier);
			if (keys.length) {
				overrides.push([overrideIdentifier, keys]);
			}
		}
		return { keys, overrides };
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/jsonEditing.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/jsonEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { JSONPath } from '../../../../base/common/json.js';

export const IJSONEditingService = createDecorator<IJSONEditingService>('jsonEditingService');

export const enum JSONEditingErrorCode {

	/**
	 * Error when trying to write to a file that contains JSON errors.
	 */
	ERROR_INVALID_FILE
}

export class JSONEditingError extends Error {
	constructor(message: string, public code: JSONEditingErrorCode) {
		super(message);
	}
}

export interface IJSONValue {
	path: JSONPath;
	value: unknown;
}

export interface IJSONEditingService {

	readonly _serviceBrand: undefined;

	write(resource: URI, values: IJSONValue[], save: boolean): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/configuration/common/jsonEditingService.ts]---
Location: vscode-main/src/vs/workbench/services/configuration/common/jsonEditingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import * as json from '../../../../base/common/json.js';
import { setProperty } from '../../../../base/common/jsonEdit.js';
import { Queue } from '../../../../base/common/async.js';
import { Edit } from '../../../../base/common/jsonFormatter.js';
import { IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ITextFileService } from '../../textfile/common/textfiles.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ITextModelService, IResolvedTextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { IJSONEditingService, IJSONValue, JSONEditingError, JSONEditingErrorCode } from './jsonEditing.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';

export class JSONEditingService implements IJSONEditingService {

	public _serviceBrand: undefined;

	private queue: Queue<void>;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService
	) {
		this.queue = new Queue<void>();
	}

	write(resource: URI, values: IJSONValue[]): Promise<void> {
		return Promise.resolve(this.queue.queue(() => this.doWriteConfiguration(resource, values))); // queue up writes to prevent race conditions
	}

	private async doWriteConfiguration(resource: URI, values: IJSONValue[]): Promise<void> {
		const reference = await this.resolveAndValidate(resource, true);
		try {
			await this.writeToBuffer(reference.object.textEditorModel, values);
		} finally {
			reference.dispose();
		}
	}

	private async writeToBuffer(model: ITextModel, values: IJSONValue[]): Promise<URI | undefined> {
		let disposable: IDisposable | undefined;
		try {
			// Optimization: we apply edits to a text model and save it
			// right after. Use the files config service to signal this
			// to the workbench to optimise the UI during this operation.
			// For example, avoids to briefly show dirty indicators.
			disposable = this.filesConfigurationService.enableAutoSaveAfterShortDelay(model.uri);

			let hasEdits: boolean = false;
			for (const value of values) {
				const edit = this.getEdits(model, value)[0];
				hasEdits = (!!edit && this.applyEditsToBuffer(edit, model)) || hasEdits;
			}
			if (hasEdits) {
				return this.textFileService.save(model.uri);
			}
		} finally {
			disposable?.dispose();
		}

		return undefined;
	}

	private applyEditsToBuffer(edit: Edit, model: ITextModel): boolean {
		const startPosition = model.getPositionAt(edit.offset);
		const endPosition = model.getPositionAt(edit.offset + edit.length);
		const range = new Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
		const currentText = model.getValueInRange(range);
		if (edit.content !== currentText) {
			const editOperation = currentText ? EditOperation.replace(range, edit.content) : EditOperation.insert(startPosition, edit.content);
			model.pushEditOperations([new Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], () => []);
			return true;
		}
		return false;
	}

	private getEdits(model: ITextModel, configurationValue: IJSONValue): Edit[] {
		const { tabSize, insertSpaces } = model.getOptions();
		const eol = model.getEOL();
		const { path, value } = configurationValue;

		// With empty path the entire file is being replaced, so we just use JSON.stringify
		if (!path.length) {
			const content = JSON.stringify(value, null, insertSpaces ? ' '.repeat(tabSize) : '\t');
			return [{
				content,
				length: content.length,
				offset: 0
			}];
		}

		return setProperty(model.getValue(), path, value, { tabSize, insertSpaces, eol });
	}

	private async resolveModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {
		const exists = await this.fileService.exists(resource);
		if (!exists) {
			await this.textFileService.write(resource, '{}', { encoding: 'utf8' });
		}
		return this.textModelResolverService.createModelReference(resource);
	}

	private hasParseErrors(model: ITextModel): boolean {
		const parseErrors: json.ParseError[] = [];
		json.parse(model.getValue(), parseErrors, { allowTrailingComma: true, allowEmptyContent: true });
		return parseErrors.length > 0;
	}

	private async resolveAndValidate(resource: URI, checkDirty: boolean): Promise<IReference<IResolvedTextEditorModel>> {
		const reference = await this.resolveModelReference(resource);

		const model = reference.object.textEditorModel;

		if (this.hasParseErrors(model)) {
			reference.dispose();
			return this.reject<IReference<IResolvedTextEditorModel>>(JSONEditingErrorCode.ERROR_INVALID_FILE);
		}

		return reference;
	}

	private reject<T>(code: JSONEditingErrorCode): Promise<T> {
		const message = this.toErrorMessage(code);
		return Promise.reject(new JSONEditingError(message, code));
	}

	private toErrorMessage(error: JSONEditingErrorCode): string {
		switch (error) {
			// User issues
			case JSONEditingErrorCode.ERROR_INVALID_FILE: {
				return nls.localize('errorInvalidFile', "Unable to write into the file. Please open the file to correct errors/warnings in the file and try again.");
			}
		}
	}
}

registerSingleton(IJSONEditingService, JSONEditingService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````

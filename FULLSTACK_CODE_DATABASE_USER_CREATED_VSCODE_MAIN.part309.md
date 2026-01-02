---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 309
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 309 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostEmbeddingVector.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostEmbeddingVector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostAiEmbeddingVectorShape, IMainContext, MainContext, MainThreadAiEmbeddingVectorShape } from './extHost.protocol.js';
import type { CancellationToken, EmbeddingVectorProvider } from 'vscode';
import { Disposable } from './extHostTypes.js';

export class ExtHostAiEmbeddingVector implements ExtHostAiEmbeddingVectorShape {
	private _AiEmbeddingVectorProviders: Map<number, EmbeddingVectorProvider> = new Map();
	private _nextHandle = 0;

	private readonly _proxy: MainThreadAiEmbeddingVectorShape;

	constructor(
		mainContext: IMainContext
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadAiEmbeddingVector);
	}

	async $provideAiEmbeddingVector(handle: number, strings: string[], token: CancellationToken): Promise<number[][]> {
		if (this._AiEmbeddingVectorProviders.size === 0) {
			throw new Error('No embedding vector providers registered');
		}

		const provider = this._AiEmbeddingVectorProviders.get(handle);
		if (!provider) {
			throw new Error('Embedding vector provider not found');
		}

		const result = await provider.provideEmbeddingVector(strings, token);
		if (!result) {
			throw new Error('Embedding vector provider returned undefined');
		}
		return result;
	}

	registerEmbeddingVectorProvider(extension: IExtensionDescription, model: string, provider: EmbeddingVectorProvider): Disposable {
		const handle = this._nextHandle;
		this._nextHandle++;
		this._AiEmbeddingVectorProviders.set(handle, provider);
		this._proxy.$registerAiEmbeddingVectorProvider(model, handle);
		return new Disposable(() => {
			this._proxy.$unregisterAiEmbeddingVectorProvider(handle);
			this._AiEmbeddingVectorProviders.delete(handle);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostExtensionActivator.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostExtensionActivator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import * as errors from '../../../base/common/errors.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { ExtensionDescriptionRegistry } from '../../services/extensions/common/extensionDescriptionRegistry.js';
import { ExtensionIdentifier, ExtensionIdentifierMap } from '../../../platform/extensions/common/extensions.js';
import { ExtensionActivationReason, MissingExtensionDependency } from '../../services/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Barrier } from '../../../base/common/async.js';

/**
 * Represents the source code (module) of an extension.
 */
export interface IExtensionModule {
	activate?(ctx: vscode.ExtensionContext): Promise<IExtensionAPI>;
	deactivate?(): void;
}

/**
 * Represents the API of an extension (return value of `activate`).
 */
export interface IExtensionAPI {
	// _extensionAPIBrand: any;
}

export type ExtensionActivationTimesFragment = {
	startup?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Activation occurred during startup' };
	codeLoadingTime?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time it took to load the extension\'s code' };
	activateCallTime?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time it took to call activate' };
	activateResolvedTime?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Time it took for async-activation to finish' };
};

export class ExtensionActivationTimes {

	public static readonly NONE = new ExtensionActivationTimes(false, -1, -1, -1);

	public readonly startup: boolean;
	public readonly codeLoadingTime: number;
	public readonly activateCallTime: number;
	public readonly activateResolvedTime: number;

	constructor(startup: boolean, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number) {
		this.startup = startup;
		this.codeLoadingTime = codeLoadingTime;
		this.activateCallTime = activateCallTime;
		this.activateResolvedTime = activateResolvedTime;
	}
}

export class ExtensionActivationTimesBuilder {

	private readonly _startup: boolean;
	private _codeLoadingStart: number;
	private _codeLoadingStop: number;
	private _activateCallStart: number;
	private _activateCallStop: number;
	private _activateResolveStart: number;
	private _activateResolveStop: number;

	constructor(startup: boolean) {
		this._startup = startup;
		this._codeLoadingStart = -1;
		this._codeLoadingStop = -1;
		this._activateCallStart = -1;
		this._activateCallStop = -1;
		this._activateResolveStart = -1;
		this._activateResolveStop = -1;
	}

	private _delta(start: number, stop: number): number {
		if (start === -1 || stop === -1) {
			return -1;
		}
		return stop - start;
	}

	public build(): ExtensionActivationTimes {
		return new ExtensionActivationTimes(
			this._startup,
			this._delta(this._codeLoadingStart, this._codeLoadingStop),
			this._delta(this._activateCallStart, this._activateCallStop),
			this._delta(this._activateResolveStart, this._activateResolveStop)
		);
	}

	public codeLoadingStart(): void {
		this._codeLoadingStart = Date.now();
	}

	public codeLoadingStop(): void {
		this._codeLoadingStop = Date.now();
	}

	public activateCallStart(): void {
		this._activateCallStart = Date.now();
	}

	public activateCallStop(): void {
		this._activateCallStop = Date.now();
	}

	public activateResolveStart(): void {
		this._activateResolveStart = Date.now();
	}

	public activateResolveStop(): void {
		this._activateResolveStop = Date.now();
	}
}

export class ActivatedExtension {

	public readonly activationFailed: boolean;
	public readonly activationFailedError: Error | null;
	public readonly activationTimes: ExtensionActivationTimes;
	public readonly module: IExtensionModule;
	public readonly exports: IExtensionAPI | undefined;
	public readonly disposable: IDisposable;

	constructor(
		activationFailed: boolean,
		activationFailedError: Error | null,
		activationTimes: ExtensionActivationTimes,
		module: IExtensionModule,
		exports: IExtensionAPI | undefined,
		disposable: IDisposable
	) {
		this.activationFailed = activationFailed;
		this.activationFailedError = activationFailedError;
		this.activationTimes = activationTimes;
		this.module = module;
		this.exports = exports;
		this.disposable = disposable;
	}
}

export class EmptyExtension extends ActivatedExtension {
	constructor(activationTimes: ExtensionActivationTimes) {
		super(false, null, activationTimes, { activate: undefined, deactivate: undefined }, undefined, Disposable.None);
	}
}

export class HostExtension extends ActivatedExtension {
	constructor() {
		super(false, null, ExtensionActivationTimes.NONE, { activate: undefined, deactivate: undefined }, undefined, Disposable.None);
	}
}

class FailedExtension extends ActivatedExtension {
	constructor(activationError: Error) {
		super(true, activationError, ExtensionActivationTimes.NONE, { activate: undefined, deactivate: undefined }, undefined, Disposable.None);
	}
}

export interface IExtensionsActivatorHost {
	onExtensionActivationError(extensionId: ExtensionIdentifier, error: Error | null, missingExtensionDependency: MissingExtensionDependency | null): void;
	actualActivateExtension(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<ActivatedExtension>;
}

type ActivationIdAndReason = { id: ExtensionIdentifier; reason: ExtensionActivationReason };

export class ExtensionsActivator implements IDisposable {

	private readonly _registry: ExtensionDescriptionRegistry;
	private readonly _globalRegistry: ExtensionDescriptionRegistry;
	private readonly _host: IExtensionsActivatorHost;
	private readonly _operations: ExtensionIdentifierMap<ActivationOperation>;
	/**
	 * A map of already activated events to speed things up if the same activation event is triggered multiple times.
	 */
	private readonly _alreadyActivatedEvents: { [activationEvent: string]: boolean };

	constructor(
		registry: ExtensionDescriptionRegistry,
		globalRegistry: ExtensionDescriptionRegistry,
		host: IExtensionsActivatorHost,
		@ILogService private readonly _logService: ILogService
	) {
		this._registry = registry;
		this._globalRegistry = globalRegistry;
		this._host = host;
		this._operations = new ExtensionIdentifierMap<ActivationOperation>();
		this._alreadyActivatedEvents = Object.create(null);
	}

	public dispose(): void {
		for (const [_, op] of this._operations) {
			op.dispose();
		}
	}

	public async waitForActivatingExtensions(): Promise<void> {
		const res: Promise<boolean>[] = [];
		for (const [_, op] of this._operations) {
			res.push(op.wait());
		}
		await Promise.all(res);
	}

	public isActivated(extensionId: ExtensionIdentifier): boolean {
		const op = this._operations.get(extensionId);
		return Boolean(op && op.value);
	}

	public getActivatedExtension(extensionId: ExtensionIdentifier): ActivatedExtension {
		const op = this._operations.get(extensionId);
		if (!op || !op.value) {
			throw new Error(`Extension '${extensionId.value}' is not known or not activated`);
		}
		return op.value;
	}

	public async activateByEvent(activationEvent: string, startup: boolean): Promise<void> {
		if (this._alreadyActivatedEvents[activationEvent]) {
			return;
		}

		const activateExtensions = this._registry.getExtensionDescriptionsForActivationEvent(activationEvent);
		await this._activateExtensions(activateExtensions.map(e => ({
			id: e.identifier,
			reason: { startup, extensionId: e.identifier, activationEvent }
		})));

		this._alreadyActivatedEvents[activationEvent] = true;
	}

	public activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		const desc = this._registry.getExtensionDescription(extensionId);
		if (!desc) {
			throw new Error(`Extension '${extensionId.value}' is not known`);
		}
		return this._activateExtensions([{ id: desc.identifier, reason }]);
	}

	private async _activateExtensions(extensions: ActivationIdAndReason[]): Promise<void> {
		const operations = extensions
			.filter((p) => !this.isActivated(p.id))
			.map(ext => this._handleActivationRequest(ext));
		await Promise.all(operations.map(op => op.wait()));
	}

	/**
	 * Handle semantics related to dependencies for `currentExtension`.
	 * We don't need to worry about dependency loops because they are handled by the registry.
	 */
	private _handleActivationRequest(currentActivation: ActivationIdAndReason): ActivationOperation {
		if (this._operations.has(currentActivation.id)) {
			return this._operations.get(currentActivation.id)!;
		}

		if (this._isHostExtension(currentActivation.id)) {
			return this._createAndSaveOperation(currentActivation, null, [], null);
		}

		const currentExtension = this._registry.getExtensionDescription(currentActivation.id);
		if (!currentExtension) {
			// Error condition 0: unknown extension
			const error = new Error(`Cannot activate unknown extension '${currentActivation.id.value}'`);
			const result = this._createAndSaveOperation(currentActivation, null, [], new FailedExtension(error));
			this._host.onExtensionActivationError(
				currentActivation.id,
				error,
				new MissingExtensionDependency(currentActivation.id.value)
			);
			return result;
		}

		const deps: ActivationOperation[] = [];
		const depIds = (typeof currentExtension.extensionDependencies === 'undefined' ? [] : currentExtension.extensionDependencies);
		for (const depId of depIds) {

			if (this._isResolvedExtension(depId)) {
				// This dependency is already resolved
				continue;
			}

			const dep = this._operations.get(depId);
			if (dep) {
				deps.push(dep);
				continue;
			}

			if (this._isHostExtension(depId)) {
				// must first wait for the dependency to activate
				deps.push(this._handleActivationRequest({
					id: this._globalRegistry.getExtensionDescription(depId)!.identifier,
					reason: currentActivation.reason
				}));
				continue;
			}

			const depDesc = this._registry.getExtensionDescription(depId);
			if (depDesc) {
				if (!depDesc.main && !depDesc.browser) {
					// this dependency does not need to activate because it is descriptive only
					continue;
				}

				// must first wait for the dependency to activate
				deps.push(this._handleActivationRequest({
					id: depDesc.identifier,
					reason: currentActivation.reason
				}));
				continue;
			}

			// Error condition 1: unknown dependency
			const currentExtensionFriendlyName = currentExtension.displayName || currentExtension.identifier.value;
			const error = new Error(`Cannot activate the '${currentExtensionFriendlyName}' extension because it depends on unknown extension '${depId}'`);
			const result = this._createAndSaveOperation(currentActivation, currentExtension.displayName, [], new FailedExtension(error));
			this._host.onExtensionActivationError(
				currentExtension.identifier,
				error,
				new MissingExtensionDependency(depId)
			);
			return result;
		}

		return this._createAndSaveOperation(currentActivation, currentExtension.displayName, deps, null);
	}

	private _createAndSaveOperation(activation: ActivationIdAndReason, displayName: string | null | undefined, deps: ActivationOperation[], value: ActivatedExtension | null): ActivationOperation {
		const operation = new ActivationOperation(activation.id, displayName, activation.reason, deps, value, this._host, this._logService);
		this._operations.set(activation.id, operation);
		return operation;
	}

	private _isHostExtension(extensionId: ExtensionIdentifier | string): boolean {
		return ExtensionDescriptionRegistry.isHostExtension(extensionId, this._registry, this._globalRegistry);
	}

	private _isResolvedExtension(extensionId: ExtensionIdentifier | string): boolean {
		const extensionDescription = this._globalRegistry.getExtensionDescription(extensionId);
		if (!extensionDescription) {
			// unknown extension
			return false;
		}
		return (!extensionDescription.main && !extensionDescription.browser);
	}
}

class ActivationOperation {

	private readonly _barrier = new Barrier();
	private _isDisposed = false;

	public get value(): ActivatedExtension | null {
		return this._value;
	}

	public get friendlyName(): string {
		return this._displayName || this._id.value;
	}

	constructor(
		private readonly _id: ExtensionIdentifier,
		private readonly _displayName: string | null | undefined,
		private readonly _reason: ExtensionActivationReason,
		private readonly _deps: ActivationOperation[],
		private _value: ActivatedExtension | null,
		private readonly _host: IExtensionsActivatorHost,
		@ILogService private readonly _logService: ILogService
	) {
		this._initialize();
	}

	public dispose(): void {
		this._isDisposed = true;
	}

	public wait() {
		return this._barrier.wait();
	}

	private async _initialize(): Promise<void> {
		await this._waitForDepsThenActivate();
		this._barrier.open();
	}

	private async _waitForDepsThenActivate(): Promise<void> {
		if (this._value) {
			// this operation is already finished
			return;
		}

		while (this._deps.length > 0) {
			// remove completed deps
			for (let i = 0; i < this._deps.length; i++) {
				const dep = this._deps[i];

				if (dep.value && !dep.value.activationFailed) {
					// the dependency is already activated OK
					this._deps.splice(i, 1);
					i--;
					continue;
				}

				if (dep.value && dep.value.activationFailed) {
					// Error condition 2: a dependency has already failed activation
					const error = new Error(`Cannot activate the '${this.friendlyName}' extension because its dependency '${dep.friendlyName}' failed to activate`);
					// eslint-disable-next-line local/code-no-any-casts
					(<any>error).detail = dep.value.activationFailedError;
					this._value = new FailedExtension(error);
					this._host.onExtensionActivationError(this._id, error, null);
					return;
				}
			}

			if (this._deps.length > 0) {
				// wait for one dependency
				await Promise.race(this._deps.map(dep => dep.wait()));
			}
		}

		await this._activate();
	}

	private async _activate(): Promise<void> {
		try {
			this._value = await this._host.actualActivateExtension(this._id, this._reason);
		} catch (err) {

			const error = new Error();
			if (err && err.name) {
				error.name = err.name;
			}
			if (err && err.message) {
				error.message = `Activating extension '${this._id.value}' failed: ${err.message}.`;
			} else {
				error.message = `Activating extension '${this._id.value}' failed: ${err}.`;
			}
			if (err && err.stack) {
				error.stack = err.stack;
			}

			// Treat the extension as being empty
			this._value = new FailedExtension(error);

			if (this._isDisposed && errors.isCancellationError(err)) {
				// It is expected for ongoing activations to fail if the extension host is going down
				// So simply ignore and don't log canceled errors in this case
				return;
			}

			this._host.onExtensionActivationError(this._id, error, null);
			this._logService.error(`Activating extension ${this._id.value} failed due to an error:`);
			this._logService.error(err);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostExtensionService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import * as nls from '../../../nls.js';
import * as path from '../../../base/common/path.js';
import * as performance from '../../../base/common/performance.js';
import { originalFSPath, joinPath, extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { asPromise, Barrier, IntervalTimer, timeout } from '../../../base/common/async.js';
import { dispose, toDisposable, Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostExtensionServiceShape, MainContext, MainThreadExtensionServiceShape, MainThreadTelemetryShape, MainThreadWorkspaceShape } from './extHost.protocol.js';
import { IExtensionDescriptionDelta, IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { ExtHostConfiguration, IExtHostConfiguration } from './extHostConfiguration.js';
import { ActivatedExtension, EmptyExtension, ExtensionActivationTimes, ExtensionActivationTimesBuilder, ExtensionsActivator, IExtensionAPI, IExtensionModule, HostExtension, ExtensionActivationTimesFragment } from './extHostExtensionActivator.js';
import { ExtHostStorage, IExtHostStorage } from './extHostStorage.js';
import { ExtHostWorkspace, IExtHostWorkspace } from './extHostWorkspace.js';
import { MissingExtensionDependency, ActivationKind, checkProposedApiEnabled, isProposedApiEnabled, ExtensionActivationReason } from '../../services/extensions/common/extensions.js';
import { ExtensionDescriptionRegistry, IActivationEventsReader } from '../../services/extensions/common/extensionDescriptionRegistry.js';
import * as errors from '../../../base/common/errors.js';
import type * as vscode from 'vscode';
import { ExtensionIdentifier, ExtensionIdentifierMap, ExtensionIdentifierSet, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { ExtensionGlobalMemento, ExtensionMemento } from './extHostMemento.js';
import { RemoteAuthorityResolverError, ExtensionKind, ExtensionMode, ExtensionRuntime, ManagedResolvedAuthority as ExtHostManagedResolvedAuthority } from './extHostTypes.js';
import { ResolvedAuthority, ResolvedOptions, RemoteAuthorityResolverErrorCode, IRemoteConnectionData, getRemoteAuthorityPrefix, TunnelInformation, ManagedRemoteConnection, WebSocketRemoteConnection } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { IInstantiationService, createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtensionStoragePaths } from './extHostStoragePaths.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ServiceCollection } from '../../../platform/instantiation/common/serviceCollection.js';
import { IExtHostTunnelService } from './extHostTunnelService.js';
import { IExtHostTerminalService } from './extHostTerminalService.js';
import { IExtHostLanguageModels } from './extHostLanguageModels.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IExtensionActivationHost, checkActivateWorkspaceContainsExtension } from '../../services/extensions/common/workspaceContains.js';
import { ExtHostSecretState, IExtHostSecretState } from './extHostSecretState.js';
import { ExtensionSecrets } from './extHostSecrets.js';
import { Schemas } from '../../../base/common/network.js';
import { IResolveAuthorityResult } from '../../services/extensions/common/extensionHostProxy.js';
import { IExtHostLocalizationService } from './extHostLocalizationService.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { isCI, setTimeout0 } from '../../../base/common/platform.js';
import { IExtHostManagedSockets } from './extHostManagedSockets.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';

interface ITestRunner {
	/** Old test runner API, as exported from `vscode/lib/testrunner` */
	run(testsRoot: string, clb: (error: Error, failures?: number) => void): void;
}

interface INewTestRunner {
	/** New test runner API, as explained in the extension test doc */
	run(): Promise<void>;
}

export const IHostUtils = createDecorator<IHostUtils>('IHostUtils');

export interface IHostUtils {
	readonly _serviceBrand: undefined;
	readonly pid: number | undefined;
	exit(code: number): void;
	fsExists?(path: string): Promise<boolean>;
	fsRealpath?(path: string): Promise<string>;
}

type TelemetryActivationEventFragment = {
	id: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The identifier of an extension' };
	name: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The name of the extension' };
	extensionVersion: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The version of the extension' };
	publisherDisplayName: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The publisher of the extension' };
	activationEvents: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'All activation events of the extension' };
	isBuiltin: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If the extension is builtin or git installed' };
	reason: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The activation event' };
	reasonId: { classification: 'PublicNonPersonalData'; purpose: 'FeatureInsight'; comment: 'The identifier of the activation event' };
};

export abstract class AbstractExtHostExtensionService extends Disposable implements ExtHostExtensionServiceShape {

	readonly _serviceBrand: undefined;

	abstract readonly extensionRuntime: ExtensionRuntime;

	private readonly _onDidChangeRemoteConnectionData = this._register(new Emitter<void>());
	public readonly onDidChangeRemoteConnectionData = this._onDidChangeRemoteConnectionData.event;

	protected readonly _hostUtils: IHostUtils;
	protected readonly _initData: IExtensionHostInitData;
	protected readonly _extHostContext: IExtHostRpcService;
	protected readonly _instaService: IInstantiationService;
	protected readonly _extHostWorkspace: ExtHostWorkspace;
	protected readonly _extHostConfiguration: ExtHostConfiguration;
	protected readonly _logService: ILogService;
	protected readonly _extHostTunnelService: IExtHostTunnelService;
	protected readonly _extHostTerminalService: IExtHostTerminalService;
	protected readonly _extHostLocalizationService: IExtHostLocalizationService;

	protected readonly _mainThreadWorkspaceProxy: MainThreadWorkspaceShape;
	protected readonly _mainThreadTelemetryProxy: MainThreadTelemetryShape;
	protected readonly _mainThreadExtensionsProxy: MainThreadExtensionServiceShape;

	private readonly _almostReadyToRunExtensions: Barrier;
	private readonly _readyToStartExtensionHost: Barrier;
	private readonly _readyToRunExtensions: Barrier;
	private readonly _eagerExtensionsActivated: Barrier;

	private readonly _activationEventsReader: SyncedActivationEventsReader;
	protected readonly _myRegistry: ExtensionDescriptionRegistry;
	protected readonly _globalRegistry: ExtensionDescriptionRegistry;
	private readonly _storage: ExtHostStorage;
	private readonly _secretState: ExtHostSecretState;
	private readonly _storagePath: IExtensionStoragePaths;
	private readonly _activator: ExtensionsActivator;
	private _extensionPathIndex: Promise<ExtensionPaths> | null;
	private _realPathCache = new Map<string, Promise<string>>();

	private readonly _resolvers: { [authorityPrefix: string]: vscode.RemoteAuthorityResolver };

	private _started: boolean;
	private _isTerminating: boolean = false;
	private _remoteConnectionData: IRemoteConnectionData | null;

	constructor(
		@IInstantiationService instaService: IInstantiationService,
		@IHostUtils hostUtils: IHostUtils,
		@IExtHostRpcService extHostContext: IExtHostRpcService,
		@IExtHostWorkspace extHostWorkspace: IExtHostWorkspace,
		@IExtHostConfiguration extHostConfiguration: IExtHostConfiguration,
		@ILogService logService: ILogService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtensionStoragePaths storagePath: IExtensionStoragePaths,
		@IExtHostTunnelService extHostTunnelService: IExtHostTunnelService,
		@IExtHostTerminalService extHostTerminalService: IExtHostTerminalService,
		@IExtHostLocalizationService extHostLocalizationService: IExtHostLocalizationService,
		@IExtHostManagedSockets private readonly _extHostManagedSockets: IExtHostManagedSockets,
		@IExtHostLanguageModels private readonly _extHostLanguageModels: IExtHostLanguageModels,
	) {
		super();
		this._hostUtils = hostUtils;
		this._extHostContext = extHostContext;
		this._initData = initData;

		this._extHostWorkspace = extHostWorkspace;
		this._extHostConfiguration = extHostConfiguration;
		this._logService = logService;
		this._extHostTunnelService = extHostTunnelService;
		this._extHostTerminalService = extHostTerminalService;
		this._extHostLocalizationService = extHostLocalizationService;

		this._mainThreadWorkspaceProxy = this._extHostContext.getProxy(MainContext.MainThreadWorkspace);
		this._mainThreadTelemetryProxy = this._extHostContext.getProxy(MainContext.MainThreadTelemetry);
		this._mainThreadExtensionsProxy = this._extHostContext.getProxy(MainContext.MainThreadExtensionService);

		this._almostReadyToRunExtensions = new Barrier();
		this._readyToStartExtensionHost = new Barrier();
		this._readyToRunExtensions = new Barrier();
		this._eagerExtensionsActivated = new Barrier();
		this._activationEventsReader = new SyncedActivationEventsReader(this._initData.extensions.activationEvents);
		this._globalRegistry = new ExtensionDescriptionRegistry(this._activationEventsReader, this._initData.extensions.allExtensions);
		const myExtensionsSet = new ExtensionIdentifierSet(this._initData.extensions.myExtensions);
		this._myRegistry = new ExtensionDescriptionRegistry(
			this._activationEventsReader,
			filterExtensions(this._globalRegistry, myExtensionsSet)
		);

		if (isCI) {
			this._logService.info(`Creating extension host with the following global extensions: ${printExtIds(this._globalRegistry)}`);
			this._logService.info(`Creating extension host with the following local extensions: ${printExtIds(this._myRegistry)}`);
		}

		this._storage = new ExtHostStorage(this._extHostContext, this._logService);
		this._secretState = new ExtHostSecretState(this._extHostContext);
		this._storagePath = storagePath;

		this._instaService = this._store.add(instaService.createChild(new ServiceCollection(
			[IExtHostStorage, this._storage],
			[IExtHostSecretState, this._secretState]
		)));

		this._activator = this._register(new ExtensionsActivator(
			this._myRegistry,
			this._globalRegistry,
			{
				onExtensionActivationError: (extensionId: ExtensionIdentifier, error: Error, missingExtensionDependency: MissingExtensionDependency | null): void => {
					this._mainThreadExtensionsProxy.$onExtensionActivationError(extensionId, errors.transformErrorForSerialization(error), missingExtensionDependency);
				},

				actualActivateExtension: async (extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<ActivatedExtension> => {
					if (ExtensionDescriptionRegistry.isHostExtension(extensionId, this._myRegistry, this._globalRegistry)) {
						await this._mainThreadExtensionsProxy.$activateExtension(extensionId, reason);
						return new HostExtension();
					}
					const extensionDescription = this._myRegistry.getExtensionDescription(extensionId)!;
					return this._activateExtension(extensionDescription, reason);
				}
			},
			this._logService
		));
		this._extensionPathIndex = null;
		this._resolvers = Object.create(null);
		this._started = false;
		this._remoteConnectionData = this._initData.remote.connectionData;
	}

	public getRemoteConnectionData(): IRemoteConnectionData | null {
		return this._remoteConnectionData;
	}

	public async initialize(): Promise<void> {
		try {

			await this._beforeAlmostReadyToRunExtensions();
			this._almostReadyToRunExtensions.open();

			await this._extHostWorkspace.waitForInitializeCall();
			performance.mark('code/extHost/ready');
			this._readyToStartExtensionHost.open();

			if (this._initData.autoStart) {
				this._startExtensionHost();
			}
		} catch (err) {
			errors.onUnexpectedError(err);
		}
	}

	private async _deactivateAll(): Promise<void> {
		this._storagePath.onWillDeactivateAll();

		let allPromises: Promise<void>[] = [];
		try {
			const allExtensions = this._myRegistry.getAllExtensionDescriptions();
			const allExtensionsIds = allExtensions.map(ext => ext.identifier);
			const activatedExtensions = allExtensionsIds.filter(id => this.isActivated(id));

			allPromises = activatedExtensions.map((extensionId) => {
				return this._deactivate(extensionId);
			});
		} catch (err) {
			// TODO: write to log once we have one
		}
		await Promise.all(allPromises);
	}

	public terminate(reason: string, code: number = 0): void {
		if (this._isTerminating) {
			// we are already shutting down...
			return;
		}
		this._isTerminating = true;
		this._logService.info(`Extension host terminating: ${reason}`);
		this._logService.flush();

		this._extHostTerminalService.dispose();
		this._activator.dispose();

		errors.setUnexpectedErrorHandler((err) => {
			this._logService.error(err);
		});

		// Invalidate all proxies
		this._extHostContext.dispose();

		const extensionsDeactivated = this._deactivateAll();

		// Give extensions at most 5 seconds to wrap up any async deactivate, then exit
		Promise.race([timeout(5000), extensionsDeactivated]).finally(() => {
			if (this._hostUtils.pid) {
				this._logService.info(`Extension host with pid ${this._hostUtils.pid} exiting with code ${code}`);
			} else {
				this._logService.info(`Extension host exiting with code ${code}`);
			}
			this._logService.flush();
			this._logService.dispose();
			this._hostUtils.exit(code);
		});
	}

	public isActivated(extensionId: ExtensionIdentifier): boolean {
		if (this._readyToRunExtensions.isOpen()) {
			return this._activator.isActivated(extensionId);
		}
		return false;
	}

	public async getExtension(extensionId: string): Promise<IExtensionDescription | undefined> {
		const ext = await this._mainThreadExtensionsProxy.$getExtension(extensionId);
		return ext && {
			...ext,
			identifier: new ExtensionIdentifier(ext.identifier.value),
			extensionLocation: URI.revive(ext.extensionLocation)
		};
	}

	private _activateByEvent(activationEvent: string, startup: boolean): Promise<void> {
		return this._activator.activateByEvent(activationEvent, startup);
	}

	private _activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		return this._activator.activateById(extensionId, reason);
	}

	public activateByIdWithErrors(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		return this._activateById(extensionId, reason).then(() => {
			const extension = this._activator.getActivatedExtension(extensionId);
			if (extension.activationFailed) {
				// activation failed => bubble up the error as the promise result
				return Promise.reject(extension.activationFailedError);
			}
			return undefined;
		});
	}

	public getExtensionRegistry(): Promise<ExtensionDescriptionRegistry> {
		return this._readyToRunExtensions.wait().then(_ => this._myRegistry);
	}

	public getExtensionExports(extensionId: ExtensionIdentifier): IExtensionAPI | null | undefined {
		if (this._readyToRunExtensions.isOpen()) {
			return this._activator.getActivatedExtension(extensionId).exports;
		} else {
			try {
				return this._activator.getActivatedExtension(extensionId).exports;
			} catch (err) {
				return null;
			}
		}
	}

	/**
	 * Applies realpath to file-uris and returns all others uris unmodified.
	 * The real path is cached for the lifetime of the extension host.
	 */
	private async _realPathExtensionUri(uri: URI): Promise<URI> {
		if (uri.scheme === Schemas.file && this._hostUtils.fsRealpath) {
			const fsPath = uri.fsPath;
			if (!this._realPathCache.has(fsPath)) {
				this._realPathCache.set(fsPath, this._hostUtils.fsRealpath(fsPath));
			}
			const realpathValue = await this._realPathCache.get(fsPath)!;
			return URI.file(realpathValue);
		}
		return uri;
	}

	// create trie to enable fast 'filename -> extension id' look up
	public async getExtensionPathIndex(): Promise<ExtensionPaths> {
		if (!this._extensionPathIndex) {
			this._extensionPathIndex = this._createExtensionPathIndex(this._myRegistry.getAllExtensionDescriptions()).then((searchTree) => {
				return new ExtensionPaths(searchTree);
			});
		}
		return this._extensionPathIndex;
	}

	/**
	 * create trie to enable fast 'filename -> extension id' look up
	 */
	private async _createExtensionPathIndex(extensions: IExtensionDescription[]): Promise<TernarySearchTree<URI, IExtensionDescription>> {
		const tst = TernarySearchTree.forUris<IExtensionDescription>(key => {
			// using the default/biased extUri-util because the IExtHostFileSystemInfo-service
			// isn't ready to be used yet, e.g the knowledge about `file` protocol and others
			// comes in while this code runs
			return extUriBiasedIgnorePathCase.ignorePathCasing(key);
		});
		// const tst = TernarySearchTree.forUris<IExtensionDescription>(key => true);
		await Promise.all(extensions.map(async (ext) => {
			if (this._getEntryPoint(ext)) {
				const uri = await this._realPathExtensionUri(ext.extensionLocation);
				tst.set(uri, ext);
			}
		}));
		return tst;
	}

	private _deactivate(extensionId: ExtensionIdentifier): Promise<void> {
		let result = Promise.resolve(undefined);

		if (!this._readyToRunExtensions.isOpen()) {
			return result;
		}

		if (!this._activator.isActivated(extensionId)) {
			return result;
		}

		const extension = this._activator.getActivatedExtension(extensionId);
		if (!extension) {
			return result;
		}

		// call deactivate if available
		try {
			if (typeof extension.module.deactivate === 'function') {
				result = Promise.resolve(extension.module.deactivate()).then(undefined, (err) => {
					this._logService.error(err);
					return Promise.resolve(undefined);
				});
			}
		} catch (err) {
			this._logService.error(`An error occurred when deactivating the extension '${extensionId.value}':`);
			this._logService.error(err);
		}

		// clean up subscriptions
		try {
			extension.disposable.dispose();
		} catch (err) {
			this._logService.error(`An error occurred when disposing the subscriptions for extension '${extensionId.value}':`);
			this._logService.error(err);
		}

		return result;
	}

	// --- impl

	private async _activateExtension(extensionDescription: IExtensionDescription, reason: ExtensionActivationReason): Promise<ActivatedExtension> {
		if (!this._initData.remote.isRemote) {
			// local extension host process
			await this._mainThreadExtensionsProxy.$onWillActivateExtension(extensionDescription.identifier);
		} else {
			// remote extension host process
			// do not wait for renderer confirmation
			this._mainThreadExtensionsProxy.$onWillActivateExtension(extensionDescription.identifier);
		}
		return this._doActivateExtension(extensionDescription, reason).then((activatedExtension) => {
			const activationTimes = activatedExtension.activationTimes;
			this._mainThreadExtensionsProxy.$onDidActivateExtension(extensionDescription.identifier, activationTimes.codeLoadingTime, activationTimes.activateCallTime, activationTimes.activateResolvedTime, reason);
			this._logExtensionActivationTimes(extensionDescription, reason, 'success', activationTimes);
			return activatedExtension;
		}, (err) => {
			this._logExtensionActivationTimes(extensionDescription, reason, 'failure');
			throw err;
		});
	}

	private _logExtensionActivationTimes(extensionDescription: IExtensionDescription, reason: ExtensionActivationReason, outcome: string, activationTimes?: ExtensionActivationTimes) {
		const event = getTelemetryActivationEvent(extensionDescription, reason);
		type ExtensionActivationTimesClassification = {
			owner: 'jrieken';
			comment: 'Timestamps for extension activation';
			outcome: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Did extension activation succeed or fail' };
		} & TelemetryActivationEventFragment & ExtensionActivationTimesFragment;

		type ExtensionActivationTimesEvent = {
			outcome: string;
		} & ActivationTimesEvent & TelemetryActivationEvent;

		type ActivationTimesEvent = {
			startup?: boolean;
			codeLoadingTime?: number;
			activateCallTime?: number;
			activateResolvedTime?: number;
		};

		this._mainThreadTelemetryProxy.$publicLog2<ExtensionActivationTimesEvent, ExtensionActivationTimesClassification>('extensionActivationTimes', {
			...event,
			...(activationTimes || {}),
			outcome
		});
	}

	private _doActivateExtension(extensionDescription: IExtensionDescription, reason: ExtensionActivationReason): Promise<ActivatedExtension> {
		const event = getTelemetryActivationEvent(extensionDescription, reason);
		type ActivatePluginClassification = {
			owner: 'jrieken';
			comment: 'Data about how/why an extension was activated';
		} & TelemetryActivationEventFragment;
		this._mainThreadTelemetryProxy.$publicLog2<TelemetryActivationEvent, ActivatePluginClassification>('activatePlugin', event);
		const entryPoint = this._getEntryPoint(extensionDescription);
		if (!entryPoint) {
			// Treat the extension as being empty => NOT AN ERROR CASE
			return Promise.resolve(new EmptyExtension(ExtensionActivationTimes.NONE));
		}

		this._logService.info(`ExtensionService#_doActivateExtension ${extensionDescription.identifier.value}, startup: ${reason.startup}, activationEvent: '${reason.activationEvent}'${extensionDescription.identifier.value !== reason.extensionId.value ? `, root cause: ${reason.extensionId.value}` : ``}`);
		this._logService.flush();

		const isESM = this._isESM(extensionDescription);

		const extensionInternalStore = new DisposableStore(); // disposables that follow the extension lifecycle
		const activationTimesBuilder = new ExtensionActivationTimesBuilder(reason.startup);
		return Promise.all([
			isESM
				? this._loadESMModule<IExtensionModule>(extensionDescription, joinPath(extensionDescription.extensionLocation, entryPoint), activationTimesBuilder)
				: this._loadCommonJSModule<IExtensionModule>(extensionDescription, joinPath(extensionDescription.extensionLocation, entryPoint), activationTimesBuilder),
			this._loadExtensionContext(extensionDescription, extensionInternalStore)
		]).then(values => {
			performance.mark(`code/extHost/willActivateExtension/${extensionDescription.identifier.value}`);
			return AbstractExtHostExtensionService._callActivate(this._logService, extensionDescription.identifier, values[0], values[1], extensionInternalStore, activationTimesBuilder);
		}).then((activatedExtension) => {
			performance.mark(`code/extHost/didActivateExtension/${extensionDescription.identifier.value}`);
			return activatedExtension;
		});
	}

	private _loadExtensionContext(extensionDescription: IExtensionDescription, extensionInternalStore: DisposableStore): Promise<vscode.ExtensionContext> {

		const languageModelAccessInformation = this._extHostLanguageModels.createLanguageModelAccessInformation(extensionDescription);
		const globalState = extensionInternalStore.add(new ExtensionGlobalMemento(extensionDescription, this._storage));
		const workspaceState = extensionInternalStore.add(new ExtensionMemento(extensionDescription.identifier.value, false, this._storage));
		const secrets = extensionInternalStore.add(new ExtensionSecrets(extensionDescription, this._secretState));
		const extensionMode = extensionDescription.isUnderDevelopment
			? (this._initData.environment.extensionTestsLocationURI ? ExtensionMode.Test : ExtensionMode.Development)
			: ExtensionMode.Production;
		const extensionKind = this._initData.remote.isRemote ? ExtensionKind.Workspace : ExtensionKind.UI;

		this._logService.trace(`ExtensionService#loadExtensionContext ${extensionDescription.identifier.value}`);

		return Promise.all([
			globalState.whenReady,
			workspaceState.whenReady,
			this._storagePath.whenReady
		]).then(() => {
			const that = this;
			let extension: vscode.Extension<any> | undefined;

			let messagePassingProtocol: vscode.MessagePassingProtocol | undefined;
			const messagePort = isProposedApiEnabled(extensionDescription, 'ipc')
				? this._initData.messagePorts?.get(ExtensionIdentifier.toKey(extensionDescription.identifier))
				: undefined;

			return Object.freeze<vscode.ExtensionContext>({
				globalState,
				workspaceState,
				secrets,
				subscriptions: [],
				get languageModelAccessInformation() { return languageModelAccessInformation; },
				get extensionUri() { return extensionDescription.extensionLocation; },
				get extensionPath() { return extensionDescription.extensionLocation.fsPath; },
				asAbsolutePath(relativePath: string) { return path.join(extensionDescription.extensionLocation.fsPath, relativePath); },
				get storagePath() { return that._storagePath.workspaceValue(extensionDescription)?.fsPath; },
				get globalStoragePath() { return that._storagePath.globalValue(extensionDescription).fsPath; },
				get logPath() { return path.join(that._initData.logsLocation.fsPath, extensionDescription.identifier.value); },
				get logUri() { return URI.joinPath(that._initData.logsLocation, extensionDescription.identifier.value); },
				get storageUri() { return that._storagePath.workspaceValue(extensionDescription); },
				get globalStorageUri() { return that._storagePath.globalValue(extensionDescription); },
				get extensionMode() { return extensionMode; },
				get extension() {
					if (extension === undefined) {
						extension = new Extension(that, extensionDescription.identifier, extensionDescription, extensionKind, false);
					}
					return extension;
				},
				get extensionRuntime() {
					checkProposedApiEnabled(extensionDescription, 'extensionRuntime');
					return that.extensionRuntime;
				},
				get environmentVariableCollection() { return that._extHostTerminalService.getEnvironmentVariableCollection(extensionDescription); },
				get messagePassingProtocol() {
					if (!messagePassingProtocol) {
						if (!messagePort) {
							return undefined;
						}

						const onDidReceiveMessage = Event.buffer(Event.fromDOMEventEmitter(messagePort, 'message', e => e.data));
						messagePort.start();
						messagePassingProtocol = {
							onDidReceiveMessage,
							// eslint-disable-next-line local/code-no-any-casts
							postMessage: messagePort.postMessage.bind(messagePort) as any
						};
					}

					return messagePassingProtocol;
				}
			});
		});
	}

	private static _callActivate(logService: ILogService, extensionId: ExtensionIdentifier, extensionModule: IExtensionModule, context: vscode.ExtensionContext, extensionInternalStore: IDisposable, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<ActivatedExtension> {
		// Make sure the extension's surface is not undefined
		extensionModule = extensionModule || {
			activate: undefined,
			deactivate: undefined
		};

		return this._callActivateOptional(logService, extensionId, extensionModule, context, activationTimesBuilder).then((extensionExports) => {
			return new ActivatedExtension(false, null, activationTimesBuilder.build(), extensionModule, extensionExports, toDisposable(() => {
				extensionInternalStore.dispose();
				dispose(context.subscriptions);
			}));
		});
	}

	private static _callActivateOptional(logService: ILogService, extensionId: ExtensionIdentifier, extensionModule: IExtensionModule, context: vscode.ExtensionContext, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<IExtensionAPI> {
		if (typeof extensionModule.activate === 'function') {
			try {
				activationTimesBuilder.activateCallStart();
				logService.trace(`ExtensionService#_callActivateOptional ${extensionId.value}`);
				const activateResult: Promise<IExtensionAPI> = extensionModule.activate.apply(globalThis, [context]);
				activationTimesBuilder.activateCallStop();

				activationTimesBuilder.activateResolveStart();
				return Promise.resolve(activateResult).then((value) => {
					activationTimesBuilder.activateResolveStop();
					return value;
				});
			} catch (err) {
				return Promise.reject(err);
			}
		} else {
			// No activate found => the module is the extension's exports
			return Promise.resolve<IExtensionAPI>(extensionModule);
		}
	}

	// -- eager activation

	private _activateOneStartupFinished(desc: IExtensionDescription, activationEvent: string): void {
		this._activateById(desc.identifier, {
			startup: false,
			extensionId: desc.identifier,
			activationEvent: activationEvent
		}).then(undefined, (err) => {
			this._logService.error(err);
		});
	}

	private _activateAllStartupFinishedDeferred(extensions: IExtensionDescription[], start: number = 0): void {
		const timeBudget = 50; // 50 milliseconds
		const startTime = Date.now();

		setTimeout0(() => {
			for (let i = start; i < extensions.length; i += 1) {
				const desc = extensions[i];
				for (const activationEvent of (desc.activationEvents ?? [])) {
					if (activationEvent === 'onStartupFinished') {
						if (Date.now() - startTime > timeBudget) {
							// time budget for current task has been exceeded
							// set a new task to activate current and remaining extensions
							this._activateAllStartupFinishedDeferred(extensions, i);
							break;
						} else {
							this._activateOneStartupFinished(desc, activationEvent);
						}
					}
				}
			}
		});
	}

	private _activateAllStartupFinished(): void {
		// startup is considered finished
		this._mainThreadExtensionsProxy.$setPerformanceMarks(performance.getMarks());

		this._extHostConfiguration.getConfigProvider().then((configProvider) => {
			const shouldDeferActivation = configProvider.getConfiguration('extensions.experimental').get<boolean>('deferredStartupFinishedActivation');
			const allExtensionDescriptions = this._myRegistry.getAllExtensionDescriptions();
			if (shouldDeferActivation) {
				this._activateAllStartupFinishedDeferred(allExtensionDescriptions);
			} else {
				for (const desc of allExtensionDescriptions) {
					if (desc.activationEvents) {
						for (const activationEvent of desc.activationEvents) {
							if (activationEvent === 'onStartupFinished') {
								this._activateOneStartupFinished(desc, activationEvent);
							}
						}
					}
				}
			}
		});
	}

	// Handle "eager" activation extensions
	private _handleEagerExtensions(): Promise<void> {
		const starActivation = this._activateByEvent('*', true).then(undefined, (err) => {
			this._logService.error(err);
		});

		this._register(this._extHostWorkspace.onDidChangeWorkspace((e) => this._handleWorkspaceContainsEagerExtensions(e.added)));
		const folders = this._extHostWorkspace.workspace ? this._extHostWorkspace.workspace.folders : [];
		const workspaceContainsActivation = this._handleWorkspaceContainsEagerExtensions(folders);
		const remoteResolverActivation = this._handleRemoteResolverEagerExtensions();
		const eagerExtensionsActivation = Promise.all([remoteResolverActivation, starActivation, workspaceContainsActivation]).then(() => { });

		Promise.race([eagerExtensionsActivation, timeout(10000)]).then(() => {
			this._activateAllStartupFinished();
		});

		return eagerExtensionsActivation;
	}

	private _handleWorkspaceContainsEagerExtensions(folders: ReadonlyArray<vscode.WorkspaceFolder>): Promise<void> {
		if (folders.length === 0) {
			return Promise.resolve(undefined);
		}

		return Promise.all(
			this._myRegistry.getAllExtensionDescriptions().map((desc) => {
				return this._handleWorkspaceContainsEagerExtension(folders, desc);
			})
		).then(() => { });
	}

	private async _handleWorkspaceContainsEagerExtension(folders: ReadonlyArray<vscode.WorkspaceFolder>, desc: IExtensionDescription): Promise<void> {
		if (this.isActivated(desc.identifier)) {
			return;
		}

		const localWithRemote = !this._initData.remote.isRemote && !!this._initData.remote.authority;
		const host: IExtensionActivationHost = {
			logService: this._logService,
			folders: folders.map(folder => folder.uri),
			forceUsingSearch: localWithRemote || !this._hostUtils.fsExists,
			exists: (uri) => this._hostUtils.fsExists!(uri.fsPath),
			checkExists: (folders, includes, token) => this._mainThreadWorkspaceProxy.$checkExists(folders, includes, token)
		};

		const result = await checkActivateWorkspaceContainsExtension(host, desc);
		if (!result) {
			return;
		}

		return (
			this._activateById(desc.identifier, { startup: true, extensionId: desc.identifier, activationEvent: result.activationEvent })
				.then(undefined, err => this._logService.error(err))
		);
	}

	private async _handleRemoteResolverEagerExtensions(): Promise<void> {
		if (this._initData.remote.authority) {
			return this._activateByEvent(`onResolveRemoteAuthority:${this._initData.remote.authority}`, false);
		}
	}

	public async $extensionTestsExecute(): Promise<number> {
		await this._eagerExtensionsActivated.wait();
		try {
			return await this._doHandleExtensionTests();
		} catch (error) {
			console.error(error); // ensure any error message makes it onto the console
			throw error;
		}
	}

	private async _doHandleExtensionTests(): Promise<number> {
		const { extensionDevelopmentLocationURI, extensionTestsLocationURI } = this._initData.environment;
		if (!extensionDevelopmentLocationURI || !extensionTestsLocationURI) {
			throw new Error(nls.localize('extensionTestError1', "Cannot load test runner."));
		}

		const extensionDescription = (await this.getExtensionPathIndex()).findSubstr(extensionTestsLocationURI);
		const isESM = this._isESM(extensionDescription, extensionTestsLocationURI.path);

		// Require the test runner via node require from the provided path
		const testRunner = await (isESM
			? this._loadESMModule<ITestRunner | INewTestRunner | undefined>(null, extensionTestsLocationURI, new ExtensionActivationTimesBuilder(false))
			: this._loadCommonJSModule<ITestRunner | INewTestRunner | undefined>(null, extensionTestsLocationURI, new ExtensionActivationTimesBuilder(false)));

		if (!testRunner || typeof testRunner.run !== 'function') {
			throw new Error(nls.localize('extensionTestError', "Path {0} does not point to a valid extension test runner.", extensionTestsLocationURI.toString()));
		}

		// Execute the runner if it follows the old `run` spec
		return new Promise<number>((resolve, reject) => {
			const oldTestRunnerCallback = (error: Error, failures: number | undefined) => {
				if (error) {
					if (isCI) {
						this._logService.error(`Test runner called back with error`, error);
					}
					reject(error);
				} else {
					if (isCI) {
						if (failures) {
							this._logService.info(`Test runner called back with ${failures} failures.`);
						} else {
							this._logService.info(`Test runner called back with successful outcome.`);
						}
					}
					resolve((typeof failures === 'number' && failures > 0) ? 1 /* ERROR */ : 0 /* OK */);
				}
			};

			const extensionTestsPath = originalFSPath(extensionTestsLocationURI); // for the old test runner API

			const runResult = testRunner.run(extensionTestsPath, oldTestRunnerCallback);

			// Using the new API `run(): Promise<void>`
			if (runResult && runResult.then) {
				runResult
					.then(() => {
						if (isCI) {
							this._logService.info(`Test runner finished successfully.`);
						}
						resolve(0);
					})
					.catch((err: unknown) => {
						if (isCI) {
							this._logService.error(`Test runner finished with error`, err);
						}
						reject(err instanceof Error && err.stack ? err.stack : String(err));
					});
			}
		});
	}

	private _startExtensionHost(): Promise<void> {
		if (this._started) {
			throw new Error(`Extension host is already started!`);
		}
		this._started = true;

		return this._readyToStartExtensionHost.wait()
			.then(() => this._readyToRunExtensions.open())
			.then(() => {
				// wait for all activation events that came in during workbench startup, but at maximum 1s
				return Promise.race([this._activator.waitForActivatingExtensions(), timeout(1000)]);
			})
			.then(() => this._handleEagerExtensions())
			.then(() => {
				this._eagerExtensionsActivated.open();
				this._logService.info(`Eager extensions activated`);
			});
	}

	// -- called by extensions

	public registerRemoteAuthorityResolver(authorityPrefix: string, resolver: vscode.RemoteAuthorityResolver): vscode.Disposable {
		this._resolvers[authorityPrefix] = resolver;
		return toDisposable(() => {
			delete this._resolvers[authorityPrefix];
		});
	}

	public async getRemoteExecServer(remoteAuthority: string): Promise<vscode.ExecServer | undefined> {
		const { resolver } = await this._activateAndGetResolver(remoteAuthority);
		return resolver?.resolveExecServer?.(remoteAuthority, { resolveAttempt: 0 });
	}

	// -- called by main thread

	private async _activateAndGetResolver(remoteAuthority: string): Promise<{ authorityPrefix: string; resolver: vscode.RemoteAuthorityResolver | undefined }> {
		const authorityPlusIndex = remoteAuthority.indexOf('+');
		if (authorityPlusIndex === -1) {
			throw new RemoteAuthorityResolverError(`Not an authority that can be resolved!`, RemoteAuthorityResolverErrorCode.InvalidAuthority);
		}
		const authorityPrefix = remoteAuthority.substr(0, authorityPlusIndex);

		await this._almostReadyToRunExtensions.wait();
		await this._activateByEvent(`onResolveRemoteAuthority:${authorityPrefix}`, false);

		return { authorityPrefix, resolver: this._resolvers[authorityPrefix] };
	}

	public async $resolveAuthority(remoteAuthorityChain: string, resolveAttempt: number): Promise<Dto<IResolveAuthorityResult>> {
		const sw = StopWatch.create(false);
		const prefix = () => `[resolveAuthority(${getRemoteAuthorityPrefix(remoteAuthorityChain)},${resolveAttempt})][${sw.elapsed()}ms] `;
		const logInfo = (msg: string) => this._logService.info(`${prefix()}${msg}`);
		const logWarning = (msg: string) => this._logService.warn(`${prefix()}${msg}`);
		const logError = (msg: string, err: any = undefined) => this._logService.error(`${prefix()}${msg}`, err);
		const normalizeError = (err: unknown) => {
			if (err instanceof RemoteAuthorityResolverError) {
				return {
					type: 'error' as const,
					error: {
						code: err._code,
						message: err._message,
						detail: err._detail
					}
				};
			}
			throw err;
		};

		const getResolver = async (remoteAuthority: string) => {
			logInfo(`activating resolver for ${remoteAuthority}...`);
			const { resolver, authorityPrefix } = await this._activateAndGetResolver(remoteAuthority);
			if (!resolver) {
				logError(`no resolver for ${authorityPrefix}`);
				throw new RemoteAuthorityResolverError(`No remote extension installed to resolve ${authorityPrefix}.`, RemoteAuthorityResolverErrorCode.NoResolverFound);
			}
			return { resolver, authorityPrefix, remoteAuthority };
		};

		const chain = remoteAuthorityChain.split(/@|%40/g).reverse();
		logInfo(`activating remote resolvers ${chain.join(' -> ')}`);

		let resolvers;
		try {
			resolvers = await Promise.all(chain.map(getResolver)).catch(async (e: Error) => {
				if (!(e instanceof RemoteAuthorityResolverError) || e._code !== RemoteAuthorityResolverErrorCode.InvalidAuthority) { throw e; }
				logWarning(`resolving nested authorities failed: ${e.message}`);
				return [await getResolver(remoteAuthorityChain)];
			});
		} catch (e) {
			return normalizeError(e);
		}

		const intervalLogger = new IntervalTimer();
		intervalLogger.cancelAndSet(() => logInfo('waiting...'), 1000);

		let result!: vscode.ResolverResult;
		let execServer: vscode.ExecServer | undefined;
		for (const [i, { authorityPrefix, resolver, remoteAuthority }] of resolvers.entries()) {
			try {
				if (i === resolvers.length - 1) {
					logInfo(`invoking final resolve()...`);
					performance.mark(`code/extHost/willResolveAuthority/${authorityPrefix}`);
					result = await resolver.resolve(remoteAuthority, { resolveAttempt, execServer });
					performance.mark(`code/extHost/didResolveAuthorityOK/${authorityPrefix}`);
					logInfo(`setting tunnel factory...`);
					this._register(await this._extHostTunnelService.setTunnelFactory(
						resolver,
						ExtHostManagedResolvedAuthority.isManagedResolvedAuthority(result) ? result : undefined
					));
				} else {
					logInfo(`invoking resolveExecServer() for ${remoteAuthority}`);
					performance.mark(`code/extHost/willResolveExecServer/${authorityPrefix}`);
					execServer = await resolver.resolveExecServer?.(remoteAuthority, { resolveAttempt, execServer });
					if (!execServer) {
						throw new RemoteAuthorityResolverError(`Exec server was not available for ${remoteAuthority}`, RemoteAuthorityResolverErrorCode.NoResolverFound); // we did, in fact, break the chain :(
					}
					performance.mark(`code/extHost/didResolveExecServerOK/${authorityPrefix}`);
				}
			} catch (e) {
				performance.mark(`code/extHost/didResolveAuthorityError/${authorityPrefix}`);
				logError(`returned an error`, e);
				intervalLogger.dispose();
				return normalizeError(e);
			}
		}

		intervalLogger.dispose();

		const tunnelInformation: TunnelInformation = {
			environmentTunnels: result.environmentTunnels,
			features: result.tunnelFeatures ? {
				elevation: result.tunnelFeatures.elevation,
				privacyOptions: result.tunnelFeatures.privacyOptions,
				protocol: result.tunnelFeatures.protocol === undefined ? true : result.tunnelFeatures.protocol,
			} : undefined
		};

		// Split merged API result into separate authority/options
		const options: ResolvedOptions = {
			extensionHostEnv: result.extensionHostEnv,
			isTrusted: result.isTrusted,
			authenticationSession: result.authenticationSessionForInitializingExtensions ? { id: result.authenticationSessionForInitializingExtensions.id, providerId: result.authenticationSessionForInitializingExtensions.providerId } : undefined
		};

		// extension are not required to return an instance of ResolvedAuthority or ManagedResolvedAuthority, so don't use `instanceof`
		logInfo(`returned ${ExtHostManagedResolvedAuthority.isManagedResolvedAuthority(result) ? 'managed authority' : `${result.host}:${result.port}`}`);

		let authority: ResolvedAuthority;
		if (ExtHostManagedResolvedAuthority.isManagedResolvedAuthority(result)) {
			// The socket factory is identified by the `resolveAttempt`, since that is a number which
			// always increments and is unique over all resolve() calls in a workbench session.
			const socketFactoryId = resolveAttempt;

			// There is only on managed socket factory at a time, so we can just overwrite the old one.
			this._extHostManagedSockets.setFactory(socketFactoryId, result.makeConnection);

			authority = {
				authority: remoteAuthorityChain,
				connectTo: new ManagedRemoteConnection(socketFactoryId),
				connectionToken: result.connectionToken
			};
		} else {
			authority = {
				authority: remoteAuthorityChain,
				connectTo: new WebSocketRemoteConnection(result.host, result.port),
				connectionToken: result.connectionToken
			};
		}

		return {
			type: 'ok',
			value: {
				authority: authority as Dto<ResolvedAuthority>,
				options,
				tunnelInformation,
			}
		};
	}

	public async $getCanonicalURI(remoteAuthority: string, uriComponents: UriComponents): Promise<UriComponents | null> {
		this._logService.info(`$getCanonicalURI invoked for authority (${getRemoteAuthorityPrefix(remoteAuthority)})`);

		const { resolver } = await this._activateAndGetResolver(remoteAuthority);
		if (!resolver) {
			// Return `null` if no resolver for `remoteAuthority` is found.
			return null;
		}

		const uri = URI.revive(uriComponents);

		if (typeof resolver.getCanonicalURI === 'undefined') {
			// resolver cannot compute canonical URI
			return uri;
		}

		const result = await asPromise(() => resolver.getCanonicalURI!(uri));
		if (!result) {
			return uri;
		}

		return result;
	}

	public async $startExtensionHost(extensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		// eslint-disable-next-line local/code-no-any-casts
		extensionsDelta.toAdd.forEach((extension) => (<any>extension).extensionLocation = URI.revive(extension.extensionLocation));

		const { globalRegistry, myExtensions } = applyExtensionsDelta(this._activationEventsReader, this._globalRegistry, this._myRegistry, extensionsDelta);
		const newSearchTree = await this._createExtensionPathIndex(myExtensions);
		const extensionsPaths = await this.getExtensionPathIndex();
		extensionsPaths.setSearchTree(newSearchTree);
		this._globalRegistry.set(globalRegistry.getAllExtensionDescriptions());
		this._myRegistry.set(myExtensions);

		if (isCI) {
			this._logService.info(`$startExtensionHost: global extensions: ${printExtIds(this._globalRegistry)}`);
			this._logService.info(`$startExtensionHost: local extensions: ${printExtIds(this._myRegistry)}`);
		}

		return this._startExtensionHost();
	}

	public $activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		if (activationKind === ActivationKind.Immediate) {
			return this._almostReadyToRunExtensions.wait()
				.then(_ => this._activateByEvent(activationEvent, false));
		}

		return (
			this._readyToRunExtensions.wait()
				.then(_ => this._activateByEvent(activationEvent, false))
		);
	}

	public async $activate(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean> {
		await this._readyToRunExtensions.wait();
		if (!this._myRegistry.getExtensionDescription(extensionId)) {
			// unknown extension => ignore
			return false;
		}
		await this._activateById(extensionId, reason);
		return true;
	}

	public async $deltaExtensions(extensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		// eslint-disable-next-line local/code-no-any-casts
		extensionsDelta.toAdd.forEach((extension) => (<any>extension).extensionLocation = URI.revive(extension.extensionLocation));

		// First build up and update the trie and only afterwards apply the delta
		const { globalRegistry, myExtensions } = applyExtensionsDelta(this._activationEventsReader, this._globalRegistry, this._myRegistry, extensionsDelta);
		const newSearchTree = await this._createExtensionPathIndex(myExtensions);
		const extensionsPaths = await this.getExtensionPathIndex();
		extensionsPaths.setSearchTree(newSearchTree);
		this._globalRegistry.set(globalRegistry.getAllExtensionDescriptions());
		this._myRegistry.set(myExtensions);

		if (isCI) {
			this._logService.info(`$deltaExtensions: global extensions: ${printExtIds(this._globalRegistry)}`);
			this._logService.info(`$deltaExtensions: local extensions: ${printExtIds(this._myRegistry)}`);
		}

		return Promise.resolve(undefined);
	}

	public async $test_latency(n: number): Promise<number> {
		return n;
	}

	public async $test_up(b: VSBuffer): Promise<number> {
		return b.byteLength;
	}

	public async $test_down(size: number): Promise<VSBuffer> {
		const buff = VSBuffer.alloc(size);
		const value = Math.random() % 256;
		for (let i = 0; i < size; i++) {
			buff.writeUInt8(value, i);
		}
		return buff;
	}

	public async $updateRemoteConnectionData(connectionData: IRemoteConnectionData): Promise<void> {
		this._remoteConnectionData = connectionData;
		this._onDidChangeRemoteConnectionData.fire();
	}

	protected _isESM(extensionDescription: IExtensionDescription | undefined, modulePath?: string): boolean {
		modulePath ??= extensionDescription ? this._getEntryPoint(extensionDescription) : modulePath;
		return modulePath?.endsWith('.mjs') || (extensionDescription?.type === 'module' && !modulePath?.endsWith('.cjs'));
	}

	protected abstract _beforeAlmostReadyToRunExtensions(): Promise<void>;
	protected abstract _getEntryPoint(extensionDescription: IExtensionDescription): string | undefined;
	protected abstract _loadCommonJSModule<T extends object | undefined>(extensionId: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T>;
	protected abstract _loadESMModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T>;
	public abstract $setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void>;
}

function applyExtensionsDelta(activationEventsReader: SyncedActivationEventsReader, oldGlobalRegistry: ExtensionDescriptionRegistry, oldMyRegistry: ExtensionDescriptionRegistry, extensionsDelta: IExtensionDescriptionDelta) {
	activationEventsReader.addActivationEvents(extensionsDelta.addActivationEvents);
	const globalRegistry = new ExtensionDescriptionRegistry(activationEventsReader, oldGlobalRegistry.getAllExtensionDescriptions());
	globalRegistry.deltaExtensions(extensionsDelta.toAdd, extensionsDelta.toRemove);

	const myExtensionsSet = new ExtensionIdentifierSet(oldMyRegistry.getAllExtensionDescriptions().map(extension => extension.identifier));
	for (const extensionId of extensionsDelta.myToRemove) {
		myExtensionsSet.delete(extensionId);
	}
	for (const extensionId of extensionsDelta.myToAdd) {
		myExtensionsSet.add(extensionId);
	}
	const myExtensions = filterExtensions(globalRegistry, myExtensionsSet);

	return { globalRegistry, myExtensions };
}

type TelemetryActivationEvent = {
	id: string;
	name: string;
	extensionVersion: string;
	publisherDisplayName: string;
	activationEvents: string | null;
	isBuiltin: boolean;
	reason: string;
	reasonId: string;
};

function getTelemetryActivationEvent(extensionDescription: IExtensionDescription, reason: ExtensionActivationReason): TelemetryActivationEvent {
	const event = {
		id: extensionDescription.identifier.value,
		name: extensionDescription.name,
		extensionVersion: extensionDescription.version,
		publisherDisplayName: extensionDescription.publisher,
		activationEvents: extensionDescription.activationEvents ? extensionDescription.activationEvents.join(',') : null,
		isBuiltin: extensionDescription.isBuiltin,
		reason: reason.activationEvent,
		reasonId: reason.extensionId.value,
	};

	return event;
}

function printExtIds(registry: ExtensionDescriptionRegistry) {
	return registry.getAllExtensionDescriptions().map(ext => ext.identifier.value).join(',');
}

export const IExtHostExtensionService = createDecorator<IExtHostExtensionService>('IExtHostExtensionService');

export interface IExtHostExtensionService extends AbstractExtHostExtensionService {
	readonly _serviceBrand: undefined;
	initialize(): Promise<void>;
	terminate(reason: string): void;
	getExtension(extensionId: string): Promise<IExtensionDescription | undefined>;
	isActivated(extensionId: ExtensionIdentifier): boolean;
	activateByIdWithErrors(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void>;
	getExtensionExports(extensionId: ExtensionIdentifier): IExtensionAPI | null | undefined;
	getExtensionRegistry(): Promise<ExtensionDescriptionRegistry>;
	getExtensionPathIndex(): Promise<ExtensionPaths>;
	registerRemoteAuthorityResolver(authorityPrefix: string, resolver: vscode.RemoteAuthorityResolver): vscode.Disposable;
	getRemoteExecServer(authority: string): Promise<vscode.ExecServer | undefined>;

	readonly onDidChangeRemoteConnectionData: Event<void>;
	getRemoteConnectionData(): IRemoteConnectionData | null;
}

export class Extension<T extends object | null | undefined> implements vscode.Extension<T> {

	#extensionService: IExtHostExtensionService;
	#originExtensionId: ExtensionIdentifier;
	#identifier: ExtensionIdentifier;

	readonly id: string;
	readonly extensionUri: URI;
	readonly extensionPath: string;
	readonly packageJSON: IExtensionDescription;
	readonly extensionKind: vscode.ExtensionKind;
	readonly isFromDifferentExtensionHost: boolean;

	constructor(extensionService: IExtHostExtensionService, originExtensionId: ExtensionIdentifier, description: IExtensionDescription, kind: ExtensionKind, isFromDifferentExtensionHost: boolean) {
		this.#extensionService = extensionService;
		this.#originExtensionId = originExtensionId;
		this.#identifier = description.identifier;
		this.id = description.identifier.value;
		this.extensionUri = description.extensionLocation;
		this.extensionPath = path.normalize(originalFSPath(description.extensionLocation));
		this.packageJSON = description;
		this.extensionKind = kind;
		this.isFromDifferentExtensionHost = isFromDifferentExtensionHost;
	}

	get isActive(): boolean {
		// TODO@alexdima support this
		return this.#extensionService.isActivated(this.#identifier);
	}

	get exports(): T {
		if (this.packageJSON.api === 'none' || this.isFromDifferentExtensionHost) {
			return undefined!; // Strict nulloverride - Public api
		}
		return <T>this.#extensionService.getExtensionExports(this.#identifier);
	}

	async activate(): Promise<T> {
		if (this.isFromDifferentExtensionHost) {
			throw new Error('Cannot activate foreign extension'); // TODO@alexdima support this
		}
		await this.#extensionService.activateByIdWithErrors(this.#identifier, { startup: false, extensionId: this.#originExtensionId, activationEvent: 'api' });
		return this.exports;
	}
}

function filterExtensions(globalRegistry: ExtensionDescriptionRegistry, desiredExtensions: ExtensionIdentifierSet): IExtensionDescription[] {
	return globalRegistry.getAllExtensionDescriptions().filter(
		extension => desiredExtensions.has(extension.identifier)
	);
}

export class ExtensionPaths {

	constructor(
		private _searchTree: TernarySearchTree<URI, IExtensionDescription>
	) { }

	setSearchTree(searchTree: TernarySearchTree<URI, IExtensionDescription>): void {
		this._searchTree = searchTree;
	}

	findSubstr(key: URI): IExtensionDescription | undefined {
		return this._searchTree.findSubstr(key);
	}

	forEach(callback: (value: IExtensionDescription, index: URI) => any): void {
		return this._searchTree.forEach(callback);
	}
}

/**
 * This mirrors the activation events as seen by the renderer. The renderer
 * is the only one which can have a reliable view of activation events because
 * implicit activation events are generated via extension points, and they
 * are registered only on the renderer side.
 */
class SyncedActivationEventsReader implements IActivationEventsReader {

	private readonly _map = new ExtensionIdentifierMap<string[]>();

	constructor(activationEvents: { [extensionId: string]: string[] }) {
		this.addActivationEvents(activationEvents);
	}

	public readActivationEvents(extensionDescription: IExtensionDescription): string[] {
		return this._map.get(extensionDescription.identifier) ?? [];
	}

	public addActivationEvents(activationEvents: { [extensionId: string]: string[] }): void {
		for (const extensionId of Object.keys(activationEvents)) {
			this._map.set(extensionId, activationEvents[extensionId]);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostFileSystem.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostFileSystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import { MainContext, IMainContext, ExtHostFileSystemShape, MainThreadFileSystemShape, IFileChangeDto } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import * as files from '../../../platform/files/common/files.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { FileChangeType } from './extHostTypes.js';
import * as typeConverter from './extHostTypeConverters.js';
import { ExtHostLanguageFeatures } from './extHostLanguageFeatures.js';
import { State, StateMachine, LinkComputer, Edge } from '../../../editor/common/languages/linkComputer.js';
import { commonPrefixLength } from '../../../base/common/strings.js';
import { CharCode } from '../../../base/common/charCode.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { IMarkdownString, isMarkdownString } from '../../../base/common/htmlContent.js';

class FsLinkProvider {

	private _schemes: string[] = [];
	private _stateMachine?: StateMachine;

	add(scheme: string): void {
		this._stateMachine = undefined;
		this._schemes.push(scheme);
	}

	delete(scheme: string): void {
		const idx = this._schemes.indexOf(scheme);
		if (idx >= 0) {
			this._schemes.splice(idx, 1);
			this._stateMachine = undefined;
		}
	}

	private _initStateMachine(): void {
		if (!this._stateMachine) {

			// sort and compute common prefix with previous scheme
			// then build state transitions based on the data
			const schemes = this._schemes.sort();
			const edges: Edge[] = [];
			let prevScheme: string | undefined;
			let prevState: State;
			let lastState = State.LastKnownState;
			let nextState = State.LastKnownState;
			for (const scheme of schemes) {

				// skip the common prefix of the prev scheme
				// and continue with its last state
				let pos = !prevScheme ? 0 : commonPrefixLength(prevScheme, scheme);
				if (pos === 0) {
					prevState = State.Start;
				} else {
					prevState = nextState;
				}

				for (; pos < scheme.length; pos++) {
					// keep creating new (next) states until the
					// end (and the BeforeColon-state) is reached
					if (pos + 1 === scheme.length) {
						// Save the last state here, because we need to continue for the next scheme
						lastState = nextState;
						nextState = State.BeforeColon;
					} else {
						nextState += 1;
					}
					edges.push([prevState, scheme.toUpperCase().charCodeAt(pos), nextState]);
					edges.push([prevState, scheme.toLowerCase().charCodeAt(pos), nextState]);
					prevState = nextState;
				}

				prevScheme = scheme;
				// Restore the last state
				nextState = lastState;
			}

			// all link must match this pattern `<scheme>:/<more>`
			edges.push([State.BeforeColon, CharCode.Colon, State.AfterColon]);
			edges.push([State.AfterColon, CharCode.Slash, State.End]);

			this._stateMachine = new StateMachine(edges);
		}
	}

	provideDocumentLinks(document: vscode.TextDocument): vscode.ProviderResult<vscode.DocumentLink[]> {
		this._initStateMachine();

		const result: vscode.DocumentLink[] = [];
		const links = LinkComputer.computeLinks({
			getLineContent(lineNumber: number): string {
				return document.lineAt(lineNumber - 1).text;
			},
			getLineCount(): number {
				return document.lineCount;
			}
		}, this._stateMachine);

		for (const link of links) {
			const docLink = typeConverter.DocumentLink.to(link);
			if (docLink.target) {
				result.push(docLink);
			}
		}
		return result;
	}
}

export class ExtHostFileSystem implements ExtHostFileSystemShape {

	private readonly _proxy: MainThreadFileSystemShape;
	private readonly _linkProvider = new FsLinkProvider();
	private readonly _fsProvider = new Map<number, vscode.FileSystemProvider>();
	private readonly _registeredSchemes = new Set<string>();
	private readonly _watches = new Map<number, IDisposable>();

	private _linkProviderRegistration?: IDisposable;
	private _handlePool: number = 0;

	constructor(mainContext: IMainContext, private _extHostLanguageFeatures: ExtHostLanguageFeatures) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadFileSystem);
	}

	dispose(): void {
		this._linkProviderRegistration?.dispose();
	}

	registerFileSystemProvider(extension: IExtensionDescription, scheme: string, provider: vscode.FileSystemProvider, options: { isCaseSensitive?: boolean; isReadonly?: boolean | vscode.MarkdownString } = {}) {

		// validate the given provider is complete
		ExtHostFileSystem._validateFileSystemProvider(provider);

		if (this._registeredSchemes.has(scheme)) {
			throw new Error(`a provider for the scheme '${scheme}' is already registered`);
		}

		//
		if (!this._linkProviderRegistration) {
			this._linkProviderRegistration = this._extHostLanguageFeatures.registerDocumentLinkProvider(extension, '*', this._linkProvider);
		}

		const handle = this._handlePool++;
		this._linkProvider.add(scheme);
		this._registeredSchemes.add(scheme);
		this._fsProvider.set(handle, provider);

		let capabilities = files.FileSystemProviderCapabilities.FileReadWrite;
		if (options.isCaseSensitive) {
			capabilities += files.FileSystemProviderCapabilities.PathCaseSensitive;
		}
		if (options.isReadonly) {
			capabilities += files.FileSystemProviderCapabilities.Readonly;
		}
		if (typeof provider.copy === 'function') {
			capabilities += files.FileSystemProviderCapabilities.FileFolderCopy;
		}
		if (typeof provider.open === 'function' && typeof provider.close === 'function'
			&& typeof provider.read === 'function' && typeof provider.write === 'function'
		) {
			checkProposedApiEnabled(extension, 'fsChunks');
			capabilities += files.FileSystemProviderCapabilities.FileOpenReadWriteClose;
		}

		let readOnlyMessage: IMarkdownString | undefined;
		if (options.isReadonly && isMarkdownString(options.isReadonly) && options.isReadonly.value !== '') {
			readOnlyMessage = {
				value: options.isReadonly.value,
				isTrusted: options.isReadonly.isTrusted,
				supportThemeIcons: options.isReadonly.supportThemeIcons,
				supportHtml: options.isReadonly.supportHtml,
				baseUri: options.isReadonly.baseUri,
				uris: options.isReadonly.uris
			};
		}

		this._proxy.$registerFileSystemProvider(handle, scheme, capabilities, readOnlyMessage).catch(err => {
			console.error(`FAILED to register filesystem provider of ${extension.identifier.value}-extension for the scheme ${scheme}`);
			console.error(err);
		});

		const subscription = provider.onDidChangeFile(event => {
			const mapped: IFileChangeDto[] = [];
			for (const e of event) {
				const { uri: resource, type } = e;
				if (resource.scheme !== scheme) {
					// dropping events for wrong scheme
					continue;
				}
				let newType: files.FileChangeType | undefined;
				switch (type) {
					case FileChangeType.Changed:
						newType = files.FileChangeType.UPDATED;
						break;
					case FileChangeType.Created:
						newType = files.FileChangeType.ADDED;
						break;
					case FileChangeType.Deleted:
						newType = files.FileChangeType.DELETED;
						break;
					default:
						throw new Error('Unknown FileChangeType');
				}
				mapped.push({ resource, type: newType });
			}
			this._proxy.$onFileSystemChange(handle, mapped);
		});

		return toDisposable(() => {
			subscription.dispose();
			this._linkProvider.delete(scheme);
			this._registeredSchemes.delete(scheme);
			this._fsProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	private static _validateFileSystemProvider(provider: vscode.FileSystemProvider) {
		if (!provider) {
			throw new Error('MISSING provider');
		}
		if (typeof provider.watch !== 'function') {
			throw new Error('Provider does NOT implement watch');
		}
		if (typeof provider.stat !== 'function') {
			throw new Error('Provider does NOT implement stat');
		}
		if (typeof provider.readDirectory !== 'function') {
			throw new Error('Provider does NOT implement readDirectory');
		}
		if (typeof provider.createDirectory !== 'function') {
			throw new Error('Provider does NOT implement createDirectory');
		}
		if (typeof provider.readFile !== 'function') {
			throw new Error('Provider does NOT implement readFile');
		}
		if (typeof provider.writeFile !== 'function') {
			throw new Error('Provider does NOT implement writeFile');
		}
		if (typeof provider.delete !== 'function') {
			throw new Error('Provider does NOT implement delete');
		}
		if (typeof provider.rename !== 'function') {
			throw new Error('Provider does NOT implement rename');
		}
	}

	private static _asIStat(stat: vscode.FileStat): files.IStat {
		const { type, ctime, mtime, size, permissions } = stat;
		return { type, ctime, mtime, size, permissions };
	}

	$stat(handle: number, resource: UriComponents): Promise<files.IStat> {
		return Promise.resolve(this._getFsProvider(handle).stat(URI.revive(resource))).then(stat => ExtHostFileSystem._asIStat(stat));
	}

	$readdir(handle: number, resource: UriComponents): Promise<[string, files.FileType][]> {
		return Promise.resolve(this._getFsProvider(handle).readDirectory(URI.revive(resource)));
	}

	$readFile(handle: number, resource: UriComponents): Promise<VSBuffer> {
		return Promise.resolve(this._getFsProvider(handle).readFile(URI.revive(resource))).then(data => VSBuffer.wrap(data));
	}

	$writeFile(handle: number, resource: UriComponents, content: VSBuffer, opts: files.IFileWriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).writeFile(URI.revive(resource), content.buffer, opts));
	}

	$delete(handle: number, resource: UriComponents, opts: files.IFileDeleteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).delete(URI.revive(resource), opts));
	}

	$rename(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).rename(URI.revive(oldUri), URI.revive(newUri), opts));
	}

	$copy(handle: number, oldUri: UriComponents, newUri: UriComponents, opts: files.IFileOverwriteOptions): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.copy) {
			throw new Error('FileSystemProvider does not implement "copy"');
		}
		return Promise.resolve(provider.copy(URI.revive(oldUri), URI.revive(newUri), opts));
	}

	$mkdir(handle: number, resource: UriComponents): Promise<void> {
		return Promise.resolve(this._getFsProvider(handle).createDirectory(URI.revive(resource)));
	}

	$watch(handle: number, session: number, resource: UriComponents, opts: files.IWatchOptions): void {
		const subscription = this._getFsProvider(handle).watch(URI.revive(resource), opts);
		this._watches.set(session, subscription);
	}

	$unwatch(_handle: number, session: number): void {
		const subscription = this._watches.get(session);
		if (subscription) {
			subscription.dispose();
			this._watches.delete(session);
		}
	}

	$open(handle: number, resource: UriComponents, opts: files.IFileOpenOptions): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.open) {
			throw new Error('FileSystemProvider does not implement "open"');
		}
		return Promise.resolve(provider.open(URI.revive(resource), opts));
	}

	$close(handle: number, fd: number): Promise<void> {
		const provider = this._getFsProvider(handle);
		if (!provider.close) {
			throw new Error('FileSystemProvider does not implement "close"');
		}
		return Promise.resolve(provider.close(fd));
	}

	$read(handle: number, fd: number, pos: number, length: number): Promise<VSBuffer> {
		const provider = this._getFsProvider(handle);
		if (!provider.read) {
			throw new Error('FileSystemProvider does not implement "read"');
		}
		const data = VSBuffer.alloc(length);
		return Promise.resolve(provider.read(fd, pos, data.buffer, 0, length)).then(read => {
			return data.slice(0, read); // don't send zeros
		});
	}

	$write(handle: number, fd: number, pos: number, data: VSBuffer): Promise<number> {
		const provider = this._getFsProvider(handle);
		if (!provider.write) {
			throw new Error('FileSystemProvider does not implement "write"');
		}
		return Promise.resolve(provider.write(fd, pos, data.buffer, 0, data.byteLength));
	}

	private _getFsProvider(handle: number): vscode.FileSystemProvider {
		const provider = this._fsProvider.get(handle);
		if (!provider) {
			const err = new Error();
			err.name = 'ENOPRO';
			err.message = `no provider`;
			throw err;
		}
		return provider;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostFileSystemConsumer.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostFileSystemConsumer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadFileSystemShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import * as files from '../../../platform/files/common/files.js';
import { FileSystemError } from './extHostTypes.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IExtHostFileSystemInfo } from './extHostFileSystemInfo.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ResourceQueue } from '../../../base/common/async.js';
import { IExtUri, extUri, extUriIgnorePathCase } from '../../../base/common/resources.js';
import { Schemas } from '../../../base/common/network.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';

export class ExtHostConsumerFileSystem {

	readonly _serviceBrand: undefined;

	readonly value: vscode.FileSystem;

	private readonly _proxy: MainThreadFileSystemShape;
	private readonly _fileSystemProvider = new Map<string, { impl: vscode.FileSystemProvider; extUri: IExtUri; isReadonly: boolean }>();

	private readonly _writeQueue = new ResourceQueue();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostFileSystemInfo fileSystemInfo: IExtHostFileSystemInfo,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadFileSystem);
		const that = this;

		this.value = Object.freeze({
			async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
				try {
					let stat;

					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						stat = await provider.impl.stat(uri);
					} else {
						stat = await that._proxy.$stat(uri);
					}

					return {
						type: stat.type,
						ctime: stat.ctime,
						mtime: stat.mtime,
						size: stat.size,
						permissions: stat.permissions === files.FilePermission.Readonly ? 1 : undefined
					};
				} catch (err) {
					ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
				try {
					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						return (await provider.impl.readDirectory(uri)).slice(); // safe-copy
					} else {
						return await that._proxy.$readdir(uri);
					}
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async createDirectory(uri: vscode.Uri): Promise<void> {
				try {
					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider && !provider.isReadonly) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						return await that.mkdirp(provider.impl, provider.extUri, uri);
					} else {
						return await that._proxy.$mkdir(uri);
					}
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async readFile(uri: vscode.Uri): Promise<Uint8Array> {
				try {
					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						return (await provider.impl.readFile(uri)).slice(); // safe-copy
					} else {
						const buff = await that._proxy.$readFile(uri);
						return buff.buffer;
					}
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
				try {
					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider && !provider.isReadonly) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						await that.mkdirp(provider.impl, provider.extUri, provider.extUri.dirname(uri));
						return await that._writeQueue.queueFor(uri, () => Promise.resolve(provider.impl.writeFile(uri, content, { create: true, overwrite: true })));
					} else {
						return await that._proxy.$writeFile(uri, VSBuffer.wrap(content));
					}
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async delete(uri: vscode.Uri, options?: { recursive?: boolean; useTrash?: boolean }): Promise<void> {
				try {
					const provider = that._fileSystemProvider.get(uri.scheme);
					if (provider && !provider.isReadonly && !options?.useTrash /* no shortcut: use trash */) {
						// use shortcut
						await that._proxy.$ensureActivation(uri.scheme);
						return await provider.impl.delete(uri, { recursive: false, ...options });
					} else {
						return await that._proxy.$delete(uri, { recursive: false, useTrash: false, atomic: false, ...options });
					}
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async rename(oldUri: vscode.Uri, newUri: vscode.Uri, options?: { overwrite?: boolean }): Promise<void> {
				try {
					// no shortcut: potentially involves different schemes, does mkdirp
					return await that._proxy.$rename(oldUri, newUri, { ...{ overwrite: false }, ...options });
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			async copy(source: vscode.Uri, destination: vscode.Uri, options?: { overwrite?: boolean }): Promise<void> {
				try {
					// no shortcut: potentially involves different schemes, does mkdirp
					return await that._proxy.$copy(source, destination, { ...{ overwrite: false }, ...options });
				} catch (err) {
					return ExtHostConsumerFileSystem._handleError(err);
				}
			},
			isWritableFileSystem(scheme: string): boolean | undefined {
				const capabilities = fileSystemInfo.getCapabilities(scheme);
				if (typeof capabilities === 'number') {
					return !(capabilities & files.FileSystemProviderCapabilities.Readonly);
				}
				return undefined;
			}
		});
	}

	private async mkdirp(provider: vscode.FileSystemProvider, providerExtUri: IExtUri, directory: vscode.Uri): Promise<void> {
		const directoriesToCreate: string[] = [];

		while (!providerExtUri.isEqual(directory, providerExtUri.dirname(directory))) {
			try {
				const stat = await provider.stat(directory);
				if ((stat.type & files.FileType.Directory) === 0) {
					throw FileSystemError.FileExists(`Unable to create folder '${directory.scheme === Schemas.file ? directory.fsPath : directory.toString(true)}' that already exists but is not a directory`);
				}

				break; // we have hit a directory that exists -> good
			} catch (error) {
				if (files.toFileSystemProviderErrorCode(error) !== files.FileSystemProviderErrorCode.FileNotFound) {
					throw error;
				}

				// further go up and remember to create this directory
				directoriesToCreate.push(providerExtUri.basename(directory));
				directory = providerExtUri.dirname(directory);
			}
		}

		for (let i = directoriesToCreate.length - 1; i >= 0; i--) {
			directory = providerExtUri.joinPath(directory, directoriesToCreate[i]);

			try {
				await provider.createDirectory(directory);
			} catch (error) {
				if (files.toFileSystemProviderErrorCode(error) !== files.FileSystemProviderErrorCode.FileExists) {
					// For mkdirp() we tolerate that the mkdir() call fails
					// in case the folder already exists. This follows node.js
					// own implementation of fs.mkdir({ recursive: true }) and
					// reduces the chances of race conditions leading to errors
					// if multiple calls try to create the same folders
					// As such, we only throw an error here if it is other than
					// the fact that the file already exists.
					// (see also https://github.com/microsoft/vscode/issues/89834)
					throw error;
				}
			}
		}
	}

	private static _handleError(err: any): never {
		// desired error type
		if (err instanceof FileSystemError) {
			throw err;
		}

		// file system provider error
		if (err instanceof files.FileSystemProviderError) {
			switch (err.code) {
				case files.FileSystemProviderErrorCode.FileExists: throw FileSystemError.FileExists(err.message);
				case files.FileSystemProviderErrorCode.FileNotFound: throw FileSystemError.FileNotFound(err.message);
				case files.FileSystemProviderErrorCode.FileNotADirectory: throw FileSystemError.FileNotADirectory(err.message);
				case files.FileSystemProviderErrorCode.FileIsADirectory: throw FileSystemError.FileIsADirectory(err.message);
				case files.FileSystemProviderErrorCode.NoPermissions: throw FileSystemError.NoPermissions(err.message);
				case files.FileSystemProviderErrorCode.Unavailable: throw FileSystemError.Unavailable(err.message);

				default: throw new FileSystemError(err.message, err.name as files.FileSystemProviderErrorCode);
			}
		}

		// generic error
		if (!(err instanceof Error)) {
			throw new FileSystemError(String(err));
		}

		// no provider (unknown scheme) error
		if (err.name === 'ENOPRO' || err.message.includes('ENOPRO')) {
			throw FileSystemError.Unavailable(err.message);
		}

		// file system error
		switch (err.name) {
			case files.FileSystemProviderErrorCode.FileExists: throw FileSystemError.FileExists(err.message);
			case files.FileSystemProviderErrorCode.FileNotFound: throw FileSystemError.FileNotFound(err.message);
			case files.FileSystemProviderErrorCode.FileNotADirectory: throw FileSystemError.FileNotADirectory(err.message);
			case files.FileSystemProviderErrorCode.FileIsADirectory: throw FileSystemError.FileIsADirectory(err.message);
			case files.FileSystemProviderErrorCode.NoPermissions: throw FileSystemError.NoPermissions(err.message);
			case files.FileSystemProviderErrorCode.Unavailable: throw FileSystemError.Unavailable(err.message);

			default: throw new FileSystemError(err.message, err.name as files.FileSystemProviderErrorCode);
		}
	}

	// ---

	addFileSystemProvider(scheme: string, provider: vscode.FileSystemProvider, options?: { isCaseSensitive?: boolean; isReadonly?: boolean | IMarkdownString }): IDisposable {
		this._fileSystemProvider.set(scheme, { impl: provider, extUri: options?.isCaseSensitive ? extUri : extUriIgnorePathCase, isReadonly: !!options?.isReadonly });
		return toDisposable(() => this._fileSystemProvider.delete(scheme));
	}

	getFileSystemProviderExtUri(scheme: string) {
		return this._fileSystemProvider.get(scheme)?.extUri ?? extUri;
	}
}

export interface IExtHostConsumerFileSystem extends ExtHostConsumerFileSystem { }
export const IExtHostConsumerFileSystem = createDecorator<IExtHostConsumerFileSystem>('IExtHostConsumerFileSystem');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostFileSystemEventService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostFileSystemEventService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event, AsyncEmitter, IWaitUntil, IWaitUntilData } from '../../../base/common/event.js';
import { GLOBSTAR, GLOB_SPLIT, IRelativePattern, parse } from '../../../base/common/glob.js';
import { URI } from '../../../base/common/uri.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import type * as vscode from 'vscode';
import { ExtHostFileSystemEventServiceShape, FileSystemEvents, IMainContext, SourceTargetPair, IWorkspaceEditDto, IWillRunFileOperationParticipation, MainContext, IRelativePatternDto } from './extHost.protocol.js';
import * as typeConverter from './extHostTypeConverters.js';
import { Disposable, WorkspaceEdit } from './extHostTypes.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { FileChangeFilter, FileOperation, FileSystemProviderCapabilities, IGlobPatterns } from '../../../platform/files/common/files.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IExtHostWorkspace } from './extHostWorkspace.js';
import { Lazy } from '../../../base/common/lazy.js';
import { ExtHostConfigProvider } from './extHostConfiguration.js';
import { rtrim } from '../../../base/common/strings.js';
import { normalizeWatcherPattern } from '../../../platform/files/common/watcher.js';
import { ExtHostFileSystemInfo } from './extHostFileSystemInfo.js';
import { Schemas } from '../../../base/common/network.js';

export interface FileSystemWatcherCreateOptions {
	readonly ignoreCreateEvents?: boolean;
	readonly ignoreChangeEvents?: boolean;
	readonly ignoreDeleteEvents?: boolean;
}

class FileSystemWatcher implements vscode.FileSystemWatcher {

	private readonly session = Math.random();

	private readonly _onDidCreate = new Emitter<vscode.Uri>();
	private readonly _onDidChange = new Emitter<vscode.Uri>();
	private readonly _onDidDelete = new Emitter<vscode.Uri>();

	private _disposable: Disposable;
	private _config: number;

	get ignoreCreateEvents(): boolean {
		return Boolean(this._config & 0b001);
	}

	get ignoreChangeEvents(): boolean {
		return Boolean(this._config & 0b010);
	}

	get ignoreDeleteEvents(): boolean {
		return Boolean(this._config & 0b100);
	}

	constructor(mainContext: IMainContext, configuration: ExtHostConfigProvider, fileSystemInfo: ExtHostFileSystemInfo, workspace: IExtHostWorkspace, extension: IExtensionDescription, dispatcher: Event<FileSystemEvents>, globPattern: string | IRelativePatternDto, options: FileSystemWatcherCreateOptions) {
		this._config = 0;
		if (options.ignoreCreateEvents) {
			this._config += 0b001;
		}
		if (options.ignoreChangeEvents) {
			this._config += 0b010;
		}
		if (options.ignoreDeleteEvents) {
			this._config += 0b100;
		}

		const ignoreCase = typeof globPattern === 'string' ?
			!((fileSystemInfo.getCapabilities(Schemas.file) ?? 0) & FileSystemProviderCapabilities.PathCaseSensitive) :
			fileSystemInfo.extUri.ignorePathCasing(URI.revive(globPattern.baseUri));

		const parsedPattern = parse(globPattern, { ignoreCase });

		// 1.64.x behavior change: given the new support to watch any folder
		// we start to ignore events outside the workspace when only a string
		// pattern is provided to avoid sending events to extensions that are
		// unexpected.
		// https://github.com/microsoft/vscode/issues/3025
		const excludeOutOfWorkspaceEvents = typeof globPattern === 'string';

		// 1.84.x introduces new proposed API for a watcher to set exclude
		// rules. In these cases, we turn the file watcher into correlation
		// mode and ignore any event that does not match the correlation ID.
		//
		// Update (Feb 2025): proposal is discontinued, so the previous
		// `options.correlate` is always `false`.
		const excludeUncorrelatedEvents = false;

		const subscription = dispatcher(events => {
			if (typeof events.session === 'number' && events.session !== this.session) {
				return; // ignore events from other file watchers that are in correlation mode
			}

			if (excludeUncorrelatedEvents && typeof events.session === 'undefined') {
				return; // ignore events from other non-correlating file watcher when we are in correlation mode
			}

			if (!options.ignoreCreateEvents) {
				for (const created of events.created) {
					const uri = URI.revive(created);
					if (parsedPattern(uri.fsPath) && (!excludeOutOfWorkspaceEvents || workspace.getWorkspaceFolder(uri))) {
						this._onDidCreate.fire(uri);
					}
				}
			}
			if (!options.ignoreChangeEvents) {
				for (const changed of events.changed) {
					const uri = URI.revive(changed);
					if (parsedPattern(uri.fsPath) && (!excludeOutOfWorkspaceEvents || workspace.getWorkspaceFolder(uri))) {
						this._onDidChange.fire(uri);
					}
				}
			}
			if (!options.ignoreDeleteEvents) {
				for (const deleted of events.deleted) {
					const uri = URI.revive(deleted);
					if (parsedPattern(uri.fsPath) && (!excludeOutOfWorkspaceEvents || workspace.getWorkspaceFolder(uri))) {
						this._onDidDelete.fire(uri);
					}
				}
			}
		});

		this._disposable = Disposable.from(this.ensureWatching(mainContext, workspace, configuration, extension, globPattern, options, false), this._onDidCreate, this._onDidChange, this._onDidDelete, subscription);
	}

	private ensureWatching(mainContext: IMainContext, workspace: IExtHostWorkspace, configuration: ExtHostConfigProvider, extension: IExtensionDescription, globPattern: string | IRelativePatternDto, options: FileSystemWatcherCreateOptions, correlate: boolean | undefined): Disposable {
		const disposable = Disposable.from();

		if (typeof globPattern === 'string') {
			return disposable; // workspace is already watched by default, no need to watch again!
		}

		if (options.ignoreChangeEvents && options.ignoreCreateEvents && options.ignoreDeleteEvents) {
			return disposable; // no need to watch if we ignore all events
		}

		const proxy = mainContext.getProxy(MainContext.MainThreadFileSystemEventService);

		let recursive = false;
		if (globPattern.pattern.includes(GLOBSTAR) || globPattern.pattern.includes(GLOB_SPLIT)) {
			recursive = true; // only watch recursively if pattern indicates the need for it
		}

		const excludes = [];
		let includes: Array<string | IRelativePattern> | undefined = undefined;
		let filter: FileChangeFilter | undefined;

		// Correlated: adjust filter based on arguments
		if (correlate) {
			if (options.ignoreChangeEvents || options.ignoreCreateEvents || options.ignoreDeleteEvents) {
				filter = FileChangeFilter.UPDATED | FileChangeFilter.ADDED | FileChangeFilter.DELETED;

				if (options.ignoreChangeEvents) {
					filter &= ~FileChangeFilter.UPDATED;
				}

				if (options.ignoreCreateEvents) {
					filter &= ~FileChangeFilter.ADDED;
				}

				if (options.ignoreDeleteEvents) {
					filter &= ~FileChangeFilter.DELETED;
				}
			}
		}

		// Uncorrelated: adjust includes and excludes based on settings
		else {

			// Automatically add `files.watcherExclude` patterns when watching
			// recursively to give users a chance to configure exclude rules
			// for reducing the overhead of watching recursively
			if (recursive && excludes.length === 0) {
				const workspaceFolder = workspace.getWorkspaceFolder(URI.revive(globPattern.baseUri));
				const watcherExcludes = configuration.getConfiguration('files', workspaceFolder).get<IGlobPatterns>('watcherExclude');
				if (watcherExcludes) {
					for (const key in watcherExcludes) {
						if (key && watcherExcludes[key] === true) {
							excludes.push(key);
						}
					}
				}
			}

			// Non-recursive watching inside the workspace will overlap with
			// our standard workspace watchers. To prevent duplicate events,
			// we only want to include events for files that are otherwise
			// excluded via `files.watcherExclude`. As such, we configure
			// to include each configured exclude pattern so that only those
			// events are reported that are otherwise excluded.
			// However, we cannot just use the pattern as is, because a pattern
			// such as `bar` for a exclude, will work to exclude any of
			// `<workspace path>/bar` but will not work as include for files within
			// `bar` unless a suffix of `/**` if added.
			// (https://github.com/microsoft/vscode/issues/148245)
			else if (!recursive) {
				const workspaceFolder = workspace.getWorkspaceFolder(URI.revive(globPattern.baseUri));
				if (workspaceFolder) {
					const watcherExcludes = configuration.getConfiguration('files', workspaceFolder).get<IGlobPatterns>('watcherExclude');
					if (watcherExcludes) {
						for (const key in watcherExcludes) {
							if (key && watcherExcludes[key] === true) {
								const includePattern = `${rtrim(key, '/')}/${GLOBSTAR}`;
								if (!includes) {
									includes = [];
								}

								includes.push(normalizeWatcherPattern(workspaceFolder.uri.fsPath, includePattern));
							}
						}
					}

					// Still ignore watch request if there are actually no configured
					// exclude rules, because in that case our default recursive watcher
					// should be able to take care of all events.
					if (!includes || includes.length === 0) {
						return disposable;
					}
				}
			}
		}

		proxy.$watch(extension.identifier.value, this.session, globPattern.baseUri, { recursive, excludes, includes, filter }, Boolean(correlate));

		return Disposable.from({ dispose: () => proxy.$unwatch(this.session) });
	}

	dispose() {
		this._disposable.dispose();
	}

	get onDidCreate(): Event<vscode.Uri> {
		return this._onDidCreate.event;
	}

	get onDidChange(): Event<vscode.Uri> {
		return this._onDidChange.event;
	}

	get onDidDelete(): Event<vscode.Uri> {
		return this._onDidDelete.event;
	}
}

interface IExtensionListener<E> {
	extension: IExtensionDescription;
	(e: E): any;
}

class LazyRevivedFileSystemEvents implements FileSystemEvents {

	readonly session: number | undefined;

	private _created = new Lazy(() => this._events.created.map(URI.revive) as URI[]);
	get created(): URI[] { return this._created.value; }

	private _changed = new Lazy(() => this._events.changed.map(URI.revive) as URI[]);
	get changed(): URI[] { return this._changed.value; }

	private _deleted = new Lazy(() => this._events.deleted.map(URI.revive) as URI[]);
	get deleted(): URI[] { return this._deleted.value; }

	constructor(private readonly _events: FileSystemEvents) {
		this.session = this._events.session;
	}
}

export class ExtHostFileSystemEventService implements ExtHostFileSystemEventServiceShape {

	private readonly _onFileSystemEvent = new Emitter<FileSystemEvents>();

	private readonly _onDidRenameFile = new Emitter<vscode.FileRenameEvent>();
	private readonly _onDidCreateFile = new Emitter<vscode.FileCreateEvent>();
	private readonly _onDidDeleteFile = new Emitter<vscode.FileDeleteEvent>();
	private readonly _onWillRenameFile = new AsyncEmitter<vscode.FileWillRenameEvent>();
	private readonly _onWillCreateFile = new AsyncEmitter<vscode.FileWillCreateEvent>();
	private readonly _onWillDeleteFile = new AsyncEmitter<vscode.FileWillDeleteEvent>();

	readonly onDidRenameFile: Event<vscode.FileRenameEvent> = this._onDidRenameFile.event;
	readonly onDidCreateFile: Event<vscode.FileCreateEvent> = this._onDidCreateFile.event;
	readonly onDidDeleteFile: Event<vscode.FileDeleteEvent> = this._onDidDeleteFile.event;

	constructor(
		private readonly _mainContext: IMainContext,
		private readonly _logService: ILogService,
		private readonly _extHostDocumentsAndEditors: ExtHostDocumentsAndEditors
	) {
		//
	}

	//--- file events

	createFileSystemWatcher(workspace: IExtHostWorkspace, configProvider: ExtHostConfigProvider, fileSystemInfo: ExtHostFileSystemInfo, extension: IExtensionDescription, globPattern: vscode.GlobPattern, options: FileSystemWatcherCreateOptions): vscode.FileSystemWatcher {
		return new FileSystemWatcher(this._mainContext, configProvider, fileSystemInfo, workspace, extension, this._onFileSystemEvent.event, typeConverter.GlobPattern.from(globPattern), options);
	}

	$onFileEvent(events: FileSystemEvents) {
		this._onFileSystemEvent.fire(new LazyRevivedFileSystemEvents(events));
	}

	//--- file operations

	$onDidRunFileOperation(operation: FileOperation, files: SourceTargetPair[]): void {
		switch (operation) {
			case FileOperation.MOVE:
				this._onDidRenameFile.fire(Object.freeze({ files: files.map(f => ({ oldUri: URI.revive(f.source!), newUri: URI.revive(f.target) })) }));
				break;
			case FileOperation.DELETE:
				this._onDidDeleteFile.fire(Object.freeze({ files: files.map(f => URI.revive(f.target)) }));
				break;
			case FileOperation.CREATE:
			case FileOperation.COPY:
				this._onDidCreateFile.fire(Object.freeze({ files: files.map(f => URI.revive(f.target)) }));
				break;
			default:
			//ignore, dont send
		}
	}


	getOnWillRenameFileEvent(extension: IExtensionDescription): Event<vscode.FileWillRenameEvent> {
		return this._createWillExecuteEvent(extension, this._onWillRenameFile);
	}

	getOnWillCreateFileEvent(extension: IExtensionDescription): Event<vscode.FileWillCreateEvent> {
		return this._createWillExecuteEvent(extension, this._onWillCreateFile);
	}

	getOnWillDeleteFileEvent(extension: IExtensionDescription): Event<vscode.FileWillDeleteEvent> {
		return this._createWillExecuteEvent(extension, this._onWillDeleteFile);
	}

	private _createWillExecuteEvent<E extends IWaitUntil>(extension: IExtensionDescription, emitter: AsyncEmitter<E>): Event<E> {
		return (listener, thisArg, disposables) => {
			const wrappedListener: IExtensionListener<E> = function wrapped(e: E) { listener.call(thisArg, e); };
			wrappedListener.extension = extension;
			return emitter.event(wrappedListener, undefined, disposables);
		};
	}

	async $onWillRunFileOperation(operation: FileOperation, files: SourceTargetPair[], timeout: number, token: CancellationToken): Promise<IWillRunFileOperationParticipation | undefined> {
		switch (operation) {
			case FileOperation.MOVE:
				return await this._fireWillEvent(this._onWillRenameFile, { files: files.map(f => ({ oldUri: URI.revive(f.source!), newUri: URI.revive(f.target) })) }, timeout, token);
			case FileOperation.DELETE:
				return await this._fireWillEvent(this._onWillDeleteFile, { files: files.map(f => URI.revive(f.target)) }, timeout, token);
			case FileOperation.CREATE:
			case FileOperation.COPY:
				return await this._fireWillEvent(this._onWillCreateFile, { files: files.map(f => URI.revive(f.target)) }, timeout, token);
		}
		return undefined;
	}

	private async _fireWillEvent<E extends IWaitUntil>(emitter: AsyncEmitter<E>, data: IWaitUntilData<E>, timeout: number, token: CancellationToken): Promise<IWillRunFileOperationParticipation | undefined> {

		const extensionNames = new Set<string>();
		const edits: [IExtensionDescription, WorkspaceEdit][] = [];

		await emitter.fireAsync(data, token, async (thenable: Promise<unknown>, listener) => {
			// ignore all results except for WorkspaceEdits. Those are stored in an array.
			const now = Date.now();
			const result = await Promise.resolve(thenable);
			if (result instanceof WorkspaceEdit) {
				edits.push([(<IExtensionListener<E>>listener).extension, result]);
				extensionNames.add((<IExtensionListener<E>>listener).extension.displayName ?? (<IExtensionListener<E>>listener).extension.identifier.value);
			}

			if (Date.now() - now > timeout) {
				this._logService.warn('SLOW file-participant', (<IExtensionListener<E>>listener).extension.identifier);
			}
		});

		if (token.isCancellationRequested) {
			return undefined;
		}

		if (edits.length === 0) {
			return undefined;
		}

		// concat all WorkspaceEdits collected via waitUntil-call and send them over to the renderer
		const dto: IWorkspaceEditDto = { edits: [] };
		for (const [, edit] of edits) {
			const { edits } = typeConverter.WorkspaceEdit.from(edit, {
				getTextDocumentVersion: uri => this._extHostDocumentsAndEditors.getDocument(uri)?.version,
				getNotebookDocumentVersion: () => undefined,
			});
			dto.edits = dto.edits.concat(edits);
		}
		return { edit: dto, extensionNames: Array.from(extensionNames) };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostFileSystemInfo.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostFileSystemInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { ExtUri, IExtUri } from '../../../base/common/resources.js';
import { UriComponents } from '../../../base/common/uri.js';
import { FileSystemProviderCapabilities } from '../../../platform/files/common/files.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostFileSystemInfoShape } from './extHost.protocol.js';

export class ExtHostFileSystemInfo implements ExtHostFileSystemInfoShape {

	declare readonly _serviceBrand: undefined;

	private readonly _systemSchemes = new Set(Object.keys(Schemas));
	private readonly _providerInfo = new Map<string, number>();

	readonly extUri: IExtUri;

	constructor() {
		this.extUri = new ExtUri(uri => {
			const capabilities = this._providerInfo.get(uri.scheme);
			if (capabilities === undefined) {
				// default: not ignore
				return false;
			}
			if (capabilities & FileSystemProviderCapabilities.PathCaseSensitive) {
				// configured as case sensitive
				return false;
			}
			return true;
		});
	}

	$acceptProviderInfos(uri: UriComponents, capabilities: number | null): void {
		if (capabilities === null) {
			this._providerInfo.delete(uri.scheme);
		} else {
			this._providerInfo.set(uri.scheme, capabilities);
		}
	}

	isFreeScheme(scheme: string): boolean {
		return !this._providerInfo.has(scheme) && !this._systemSchemes.has(scheme);
	}

	getCapabilities(scheme: string): number | undefined {
		return this._providerInfo.get(scheme);
	}
}

export interface IExtHostFileSystemInfo extends ExtHostFileSystemInfo {
	readonly extUri: IExtUri;
}
export const IExtHostFileSystemInfo = createDecorator<IExtHostFileSystemInfo>('IExtHostFileSystemInfo');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostInitDataService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostInitDataService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const IExtHostInitDataService = createDecorator<IExtHostInitDataService>('IExtHostInitDataService');

export interface IExtHostInitDataService extends Readonly<IExtensionHostInitData> {
	readonly _serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostInteractive.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostInteractive.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostInteractiveShape, IMainContext } from './extHost.protocol.js';
import { ApiCommand, ApiCommandArgument, ApiCommandResult, ExtHostCommands } from './extHostCommands.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { ExtHostNotebookController } from './extHostNotebook.js';
import { NotebookEditor } from 'vscode';

export class ExtHostInteractive implements ExtHostInteractiveShape {
	constructor(
		mainContext: IMainContext,
		private _extHostNotebooks: ExtHostNotebookController,
		private _textDocumentsAndEditors: ExtHostDocumentsAndEditors,
		private _commands: ExtHostCommands,
		_logService: ILogService
	) {
		const openApiCommand = new ApiCommand(
			'interactive.open',
			'_interactive.open',
			'Open interactive window and return notebook editor and input URI',
			[
				new ApiCommandArgument('showOptions', 'Show Options', v => true, v => v),
				new ApiCommandArgument('resource', 'Interactive resource Uri', v => true, v => v),
				new ApiCommandArgument('controllerId', 'Notebook controller Id', v => true, v => v),
				new ApiCommandArgument('title', 'Interactive editor title', v => true, v => v)
			],
			new ApiCommandResult<{ notebookUri: UriComponents; inputUri: UriComponents; notebookEditorId?: string }, { notebookUri: URI; inputUri: URI; notebookEditor?: NotebookEditor }>('Notebook and input URI', (v: { notebookUri: UriComponents; inputUri: UriComponents; notebookEditorId?: string }) => {
				_logService.debug('[ExtHostInteractive] open iw with notebook editor id', v.notebookEditorId);
				if (v.notebookEditorId !== undefined) {
					const editor = this._extHostNotebooks.getEditorById(v.notebookEditorId);
					_logService.debug('[ExtHostInteractive] notebook editor found', editor.id);
					return { notebookUri: URI.revive(v.notebookUri), inputUri: URI.revive(v.inputUri), notebookEditor: editor.apiEditor };
				}
				_logService.debug('[ExtHostInteractive] notebook editor not found, uris for the interactive document', v.notebookUri, v.inputUri);
				return { notebookUri: URI.revive(v.notebookUri), inputUri: URI.revive(v.inputUri) };
			})
		);
		this._commands.registerApiCommand(openApiCommand);
	}

	$willAddInteractiveDocument(uri: UriComponents, eol: string, languageId: string, notebookUri: UriComponents) {
		this._textDocumentsAndEditors.acceptDocumentsAndEditorsDelta({
			addedDocuments: [{
				EOL: eol,
				lines: [''],
				languageId: languageId,
				uri: uri,
				isDirty: false,
				versionId: 1,
				encoding: 'utf8'
			}]
		});
	}

	$willRemoveInteractiveDocument(uri: UriComponents, notebookUri: UriComponents) {
		this._textDocumentsAndEditors.acceptDocumentsAndEditorsDelta({
			removedDocuments: [uri]
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostLabelService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostLabelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResourceLabelFormatter } from '../../../platform/label/common/label.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { MainThreadLabelServiceShape, ExtHostLabelServiceShape, MainContext, IMainContext } from './extHost.protocol.js';

export class ExtHostLabelService implements ExtHostLabelServiceShape {

	private readonly _proxy: MainThreadLabelServiceShape;
	private _handlePool: number = 0;

	constructor(mainContext: IMainContext) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadLabelService);
	}

	$registerResourceLabelFormatter(formatter: ResourceLabelFormatter): IDisposable {
		const handle = this._handlePool++;
		this._proxy.$registerResourceLabelFormatter(handle, formatter);

		return toDisposable(() => {
			this._proxy.$unregisterResourceLabelFormatter(handle);
		});
	}
}
```

--------------------------------------------------------------------------------

````

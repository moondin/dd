---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 312
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 312 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostRequireInterceptor.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostRequireInterceptor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as performance from '../../../base/common/performance.js';
import { URI } from '../../../base/common/uri.js';
import { MainThreadTelemetryShape, MainContext } from './extHost.protocol.js';
import { ExtHostConfigProvider, IExtHostConfiguration } from './extHostConfiguration.js';
import { nullExtensionDescription } from '../../services/extensions/common/extensions.js';
import * as vscode from 'vscode';
import { ExtensionIdentifierMap } from '../../../platform/extensions/common/extensions.js';
import { IExtensionApiFactory, IExtensionRegistries } from './extHost.api.impl.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ExtensionPaths, IExtHostExtensionService } from './extHostExtensionService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';


interface LoadFunction {
	(request: string): any;
}

interface IAlternativeModuleProvider {
	alternativeModuleName(name: string): string | undefined;
}

export interface INodeModuleFactory extends Partial<IAlternativeModuleProvider> {
	readonly nodeModuleName: string | string[];
	load(request: string, parent: URI, original: LoadFunction): any;
}

export abstract class RequireInterceptor {

	protected readonly _factories: Map<string, INodeModuleFactory>;
	protected readonly _alternatives: ((moduleName: string) => string | undefined)[];

	constructor(
		private _apiFactory: IExtensionApiFactory,
		private _extensionRegistry: IExtensionRegistries,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IExtHostConfiguration private readonly _extHostConfiguration: IExtHostConfiguration,
		@IExtHostExtensionService private readonly _extHostExtensionService: IExtHostExtensionService,
		@IExtHostInitDataService private readonly _initData: IExtHostInitDataService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._factories = new Map<string, INodeModuleFactory>();
		this._alternatives = [];
	}

	async install(): Promise<void> {

		this._installInterceptor();

		performance.mark('code/extHost/willWaitForConfig');
		const configProvider = await this._extHostConfiguration.getConfigProvider();
		performance.mark('code/extHost/didWaitForConfig');
		const extensionPaths = await this._extHostExtensionService.getExtensionPathIndex();

		this.register(new VSCodeNodeModuleFactory(this._apiFactory, extensionPaths, this._extensionRegistry, configProvider, this._logService));
		this.register(this._instaService.createInstance(NodeModuleAliasingModuleFactory));
		if (this._initData.remote.isRemote) {
			this.register(this._instaService.createInstance(OpenNodeModuleFactory, extensionPaths, this._initData.environment.appUriScheme));
		}
	}

	protected abstract _installInterceptor(): void;

	public register(interceptor: INodeModuleFactory | IAlternativeModuleProvider): void {
		if ('nodeModuleName' in interceptor) {
			if (Array.isArray(interceptor.nodeModuleName)) {
				for (const moduleName of interceptor.nodeModuleName) {
					this._factories.set(moduleName, interceptor);
				}
			} else {
				this._factories.set(interceptor.nodeModuleName, interceptor);
			}
		}

		if (typeof interceptor.alternativeModuleName === 'function') {
			this._alternatives.push((moduleName) => {
				return interceptor.alternativeModuleName!(moduleName);
			});
		}
	}
}

//#region --- module renames

class NodeModuleAliasingModuleFactory implements IAlternativeModuleProvider {
	/**
	 * Map of aliased internal node_modules, used to allow for modules to be
	 * renamed without breaking extensions. In the form "original -> new name".
	 */
	private static readonly aliased: ReadonlyMap<string, string> = new Map([
		['vscode-ripgrep', '@vscode/ripgrep'],
		['vscode-windows-registry', '@vscode/windows-registry'],
	]);

	private readonly re?: RegExp;

	constructor(@IExtHostInitDataService initData: IExtHostInitDataService) {
		if (initData.environment.appRoot && NodeModuleAliasingModuleFactory.aliased.size) {
			const root = escapeRegExpCharacters(this.forceForwardSlashes(initData.environment.appRoot.fsPath));
			// decompose ${appRoot}/node_modules/foo/bin to ['${appRoot}/node_modules/', 'foo', '/bin'],
			// and likewise the more complex form ${appRoot}/node_modules.asar.unpacked/@vcode/foo/bin
			// to ['${appRoot}/node_modules.asar.unpacked/',' @vscode/foo', '/bin'].
			const npmIdChrs = `[a-z0-9_.-]`;
			const npmModuleName = `@${npmIdChrs}+\\/${npmIdChrs}+|${npmIdChrs}+`;
			const moduleFolders = 'node_modules|node_modules\\.asar(?:\\.unpacked)?';
			this.re = new RegExp(`^(${root}/${moduleFolders}\\/)(${npmModuleName})(.*)$`, 'i');
		}
	}

	public alternativeModuleName(name: string): string | undefined {
		if (!this.re) {
			return;
		}

		const result = this.re.exec(this.forceForwardSlashes(name));
		if (!result) {
			return;
		}

		const [, prefix, moduleName, suffix] = result;
		const dealiased = NodeModuleAliasingModuleFactory.aliased.get(moduleName);
		if (dealiased === undefined) {
			return;
		}

		console.warn(`${moduleName} as been renamed to ${dealiased}, please update your imports`);

		return prefix + dealiased + suffix;
	}

	private forceForwardSlashes(str: string) {
		return str.replace(/\\/g, '/');
	}
}

//#endregion

//#region --- vscode-module

class VSCodeNodeModuleFactory implements INodeModuleFactory {
	public readonly nodeModuleName = 'vscode';

	private readonly _extApiImpl = new ExtensionIdentifierMap<typeof vscode>();
	private _defaultApiImpl?: typeof vscode;

	constructor(
		private readonly _apiFactory: IExtensionApiFactory,
		private readonly _extensionPaths: ExtensionPaths,
		private readonly _extensionRegistry: IExtensionRegistries,
		private readonly _configProvider: ExtHostConfigProvider,
		private readonly _logService: ILogService,
	) {
	}

	public load(_request: string, parent: URI): any {

		// get extension id from filename and api for extension
		const ext = this._extensionPaths.findSubstr(parent);
		if (ext) {
			let apiImpl = this._extApiImpl.get(ext.identifier);
			if (!apiImpl) {
				apiImpl = this._apiFactory(ext, this._extensionRegistry, this._configProvider);
				this._extApiImpl.set(ext.identifier, apiImpl);
			}
			return apiImpl;
		}

		// fall back to a default implementation
		if (!this._defaultApiImpl) {
			let extensionPathsPretty = '';
			this._extensionPaths.forEach((value, index) => extensionPathsPretty += `\t${index} -> ${value.identifier.value}\n`);
			this._logService.warn(`Could not identify extension for 'vscode' require call from ${parent}. These are the extension path mappings: \n${extensionPathsPretty}`);
			this._defaultApiImpl = this._apiFactory(nullExtensionDescription, this._extensionRegistry, this._configProvider);
		}
		return this._defaultApiImpl;
	}
}

//#endregion

//#region --- opn/open-module

interface OpenOptions {
	wait: boolean;
	app: string | string[];
}

interface IOriginalOpen {
	(target: string, options?: OpenOptions): Thenable<any>;
}

interface IOpenModule {
	(target: string, options?: OpenOptions): Thenable<void>;
}

class OpenNodeModuleFactory implements INodeModuleFactory {

	public readonly nodeModuleName: string[] = ['open', 'opn'];

	private _extensionId: string | undefined;
	private _original?: IOriginalOpen;
	private _impl: IOpenModule;
	private _mainThreadTelemetry: MainThreadTelemetryShape;

	constructor(
		private readonly _extensionPaths: ExtensionPaths,
		private readonly _appUriScheme: string,
		@IExtHostRpcService rpcService: IExtHostRpcService,
	) {

		this._mainThreadTelemetry = rpcService.getProxy(MainContext.MainThreadTelemetry);
		const mainThreadWindow = rpcService.getProxy(MainContext.MainThreadWindow);

		this._impl = (target, options) => {
			const uri: URI = URI.parse(target);
			// If we have options use the original method.
			if (options) {
				return this.callOriginal(target, options);
			}
			if (uri.scheme === 'http' || uri.scheme === 'https') {
				return mainThreadWindow.$openUri(uri, target, { allowTunneling: true });
			} else if (uri.scheme === 'mailto' || uri.scheme === this._appUriScheme) {
				return mainThreadWindow.$openUri(uri, target, {});
			}
			return this.callOriginal(target, options);
		};
	}

	public load(request: string, parent: URI, original: LoadFunction): any {
		// get extension id from filename and api for extension
		const extension = this._extensionPaths.findSubstr(parent);
		if (extension) {
			this._extensionId = extension.identifier.value;
			this.sendShimmingTelemetry();
		}

		this._original = original(request);
		return this._impl;
	}

	private callOriginal(target: string, options: OpenOptions | undefined): Thenable<any> {
		this.sendNoForwardTelemetry();
		return this._original!(target, options);
	}

	private sendShimmingTelemetry(): void {
		if (!this._extensionId) {
			return;
		}
		type ShimmingOpenClassification = {
			owner: 'jrieken';
			comment: 'Know when the open-shim was used';
			extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension is question' };
		};
		this._mainThreadTelemetry.$publicLog2<{ extension: string }, ShimmingOpenClassification>('shimming.open', { extension: this._extensionId });
	}

	private sendNoForwardTelemetry(): void {
		if (!this._extensionId) {
			return;
		}
		type ShimmingOpenCallNoForwardClassification = {
			owner: 'jrieken';
			comment: 'Know when the open-shim was used';
			extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension is question' };
		};
		this._mainThreadTelemetry.$publicLog2<{ extension: string }, ShimmingOpenCallNoForwardClassification>('shimming.open.call.noForward', { extension: this._extensionId });
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostRpcService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostRpcService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProxyIdentifier, IRPCProtocol, Proxied } from '../../services/extensions/common/proxyIdentifier.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const IExtHostRpcService = createDecorator<IExtHostRpcService>('IExtHostRpcService');

export interface IExtHostRpcService extends IRPCProtocol {
	readonly _serviceBrand: undefined;
}

export class ExtHostRpcService implements IExtHostRpcService {
	readonly _serviceBrand: undefined;

	readonly getProxy: <T>(identifier: ProxyIdentifier<T>) => Proxied<T>;
	readonly set: <T, R extends T> (identifier: ProxyIdentifier<T>, instance: R) => R;
	readonly dispose: () => void;
	readonly assertRegistered: (identifiers: ProxyIdentifier<any>[]) => void;
	readonly drain: () => Promise<void>;

	constructor(rpcProtocol: IRPCProtocol) {
		this.getProxy = rpcProtocol.getProxy.bind(rpcProtocol);
		this.set = rpcProtocol.set.bind(rpcProtocol);
		this.dispose = rpcProtocol.dispose.bind(rpcProtocol);
		this.assertRegistered = rpcProtocol.assertRegistered.bind(rpcProtocol);
		this.drain = rpcProtocol.drain.bind(rpcProtocol);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostSCM.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostSCM.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { URI, UriComponents } from '../../../base/common/uri.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { debounce } from '../../../base/common/decorators.js';
import { DisposableMap, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import { asPromise } from '../../../base/common/async.js';
import { ExtHostCommands } from './extHostCommands.js';
import { MainContext, MainThreadSCMShape, SCMRawResource, SCMRawResourceSplice, SCMRawResourceSplices, IMainContext, ExtHostSCMShape, ICommandDto, MainThreadTelemetryShape, SCMGroupFeatures, SCMHistoryItemDto, SCMHistoryItemChangeDto, SCMHistoryItemRefDto, SCMActionButtonDto, SCMArtifactGroupDto, SCMArtifactDto } from './extHost.protocol.js';
import { sortedDiff, equals } from '../../../base/common/arrays.js';
import { comparePaths } from '../../../base/common/comparers.js';
import type * as vscode from 'vscode';
import { ISplice } from '../../../base/common/sequence.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { ExtensionIdentifierMap, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { MarkdownString, SourceControlInputBoxValidationType } from './extHostTypeConverters.js';
import { checkProposedApiEnabled, isProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { Schemas } from '../../../base/common/network.js';
import { isLinux } from '../../../base/common/platform.js';
import { structuralEquals } from '../../../base/common/equals.js';
import { Iterable } from '../../../base/common/iterator.js';

type ProviderHandle = number;
type GroupHandle = number;
type ResourceStateHandle = number;

function isUri(thing: any): thing is vscode.Uri {
	return thing instanceof URI;
}

function uriEquals(a: vscode.Uri, b: vscode.Uri): boolean {
	if (a.scheme === Schemas.file && b.scheme === Schemas.file && isLinux) {
		return a.toString() === b.toString();
	}

	return a.toString().toLowerCase() === b.toString().toLowerCase();
}

function getIconResource(decorations?: vscode.SourceControlResourceThemableDecorations): UriComponents | ThemeIcon | undefined {
	if (!decorations) {
		return undefined;
	} else if (typeof decorations.iconPath === 'string') {
		return URI.file(decorations.iconPath);
	} else if (URI.isUri(decorations.iconPath)) {
		return decorations.iconPath;
	} else if (ThemeIcon.isThemeIcon(decorations.iconPath)) {
		return decorations.iconPath;
	} else {
		return undefined;
	}
}

function getHistoryItemIconDto(icon: vscode.Uri | { light: vscode.Uri; dark: vscode.Uri } | vscode.ThemeIcon | undefined): UriComponents | { light: UriComponents; dark: UriComponents } | ThemeIcon | undefined {
	if (!icon) {
		return undefined;
	} else if (URI.isUri(icon)) {
		return icon;
	} else if (ThemeIcon.isThemeIcon(icon)) {
		return icon;
	} else {
		const iconDto = icon as { light: URI; dark: URI };
		return { light: iconDto.light, dark: iconDto.dark };
	}
}

function toSCMHistoryItemDto(historyItem: vscode.SourceControlHistoryItem): SCMHistoryItemDto {
	const authorIcon = getHistoryItemIconDto(historyItem.authorIcon);
	const tooltip = Array.isArray(historyItem.tooltip)
		? MarkdownString.fromMany(historyItem.tooltip)
		: historyItem.tooltip ? MarkdownString.from(historyItem.tooltip) : undefined;

	const references = historyItem.references?.map(r => ({
		...r, icon: getHistoryItemIconDto(r.icon)
	}));

	return { ...historyItem, authorIcon, references, tooltip };
}

function toSCMHistoryItemRefDto(historyItemRef?: vscode.SourceControlHistoryItemRef): SCMHistoryItemRefDto | undefined {
	return historyItemRef ? { ...historyItemRef, icon: getHistoryItemIconDto(historyItemRef.icon) } : undefined;
}

function compareResourceThemableDecorations(a: vscode.SourceControlResourceThemableDecorations, b: vscode.SourceControlResourceThemableDecorations): number {
	if (!a.iconPath && !b.iconPath) {
		return 0;
	} else if (!a.iconPath) {
		return -1;
	} else if (!b.iconPath) {
		return 1;
	}

	const aPath = typeof a.iconPath === 'string' ? a.iconPath : URI.isUri(a.iconPath) ? a.iconPath.fsPath : (a.iconPath as vscode.ThemeIcon).id;
	const bPath = typeof b.iconPath === 'string' ? b.iconPath : URI.isUri(b.iconPath) ? b.iconPath.fsPath : (b.iconPath as vscode.ThemeIcon).id;
	return comparePaths(aPath, bPath);
}

function compareResourceStatesDecorations(a: vscode.SourceControlResourceDecorations, b: vscode.SourceControlResourceDecorations): number {
	let result = 0;

	if (a.strikeThrough !== b.strikeThrough) {
		return a.strikeThrough ? 1 : -1;
	}

	if (a.faded !== b.faded) {
		return a.faded ? 1 : -1;
	}

	if (a.tooltip !== b.tooltip) {
		return (a.tooltip || '').localeCompare(b.tooltip || '');
	}

	result = compareResourceThemableDecorations(a, b);

	if (result !== 0) {
		return result;
	}

	if (a.light && b.light) {
		result = compareResourceThemableDecorations(a.light, b.light);
	} else if (a.light) {
		return 1;
	} else if (b.light) {
		return -1;
	}

	if (result !== 0) {
		return result;
	}

	if (a.dark && b.dark) {
		result = compareResourceThemableDecorations(a.dark, b.dark);
	} else if (a.dark) {
		return 1;
	} else if (b.dark) {
		return -1;
	}

	return result;
}

function compareCommands(a: vscode.Command, b: vscode.Command): number {
	if (a.command !== b.command) {
		return a.command < b.command ? -1 : 1;
	}

	if (a.title !== b.title) {
		return a.title < b.title ? -1 : 1;
	}

	if (a.tooltip !== b.tooltip) {
		if (a.tooltip !== undefined && b.tooltip !== undefined) {
			return a.tooltip < b.tooltip ? -1 : 1;
		} else if (a.tooltip !== undefined) {
			return 1;
		} else if (b.tooltip !== undefined) {
			return -1;
		}
	}

	if (a.arguments === b.arguments) {
		return 0;
	} else if (!a.arguments) {
		return -1;
	} else if (!b.arguments) {
		return 1;
	} else if (a.arguments.length !== b.arguments.length) {
		return a.arguments.length - b.arguments.length;
	}

	for (let i = 0; i < a.arguments.length; i++) {
		const aArg = a.arguments[i];
		const bArg = b.arguments[i];

		if (aArg === bArg) {
			continue;
		}

		if (isUri(aArg) && isUri(bArg) && uriEquals(aArg, bArg)) {
			continue;
		}

		return aArg < bArg ? -1 : 1;
	}

	return 0;
}

function compareResourceStates(a: vscode.SourceControlResourceState, b: vscode.SourceControlResourceState): number {
	let result = comparePaths(a.resourceUri.fsPath, b.resourceUri.fsPath, true);

	if (result !== 0) {
		return result;
	}

	if (a.command && b.command) {
		result = compareCommands(a.command, b.command);
	} else if (a.command) {
		return 1;
	} else if (b.command) {
		return -1;
	}

	if (result !== 0) {
		return result;
	}

	if (a.decorations && b.decorations) {
		result = compareResourceStatesDecorations(a.decorations, b.decorations);
	} else if (a.decorations) {
		return 1;
	} else if (b.decorations) {
		return -1;
	}

	if (result !== 0) {
		return result;
	}

	if (a.multiFileDiffEditorModifiedUri && b.multiFileDiffEditorModifiedUri) {
		result = comparePaths(a.multiFileDiffEditorModifiedUri.fsPath, b.multiFileDiffEditorModifiedUri.fsPath, true);
	} else if (a.multiFileDiffEditorModifiedUri) {
		return 1;
	} else if (b.multiFileDiffEditorModifiedUri) {
		return -1;
	}

	if (result !== 0) {
		return result;
	}

	if (a.multiDiffEditorOriginalUri && b.multiDiffEditorOriginalUri) {
		result = comparePaths(a.multiDiffEditorOriginalUri.fsPath, b.multiDiffEditorOriginalUri.fsPath, true);
	} else if (a.multiDiffEditorOriginalUri) {
		return 1;
	} else if (b.multiDiffEditorOriginalUri) {
		return -1;
	}

	return result;
}

function compareArgs(a: any[], b: any[]): boolean {
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}

function commandEquals(a: vscode.Command, b: vscode.Command): boolean {
	return a.command === b.command
		&& a.title === b.title
		&& a.tooltip === b.tooltip
		&& (a.arguments && b.arguments ? compareArgs(a.arguments, b.arguments) : a.arguments === b.arguments);
}

function commandListEquals(a: readonly vscode.Command[], b: readonly vscode.Command[]): boolean {
	return equals(a, b, commandEquals);
}

export interface IValidateInput {
	(value: string, cursorPosition: number): vscode.ProviderResult<vscode.SourceControlInputBoxValidation | undefined | null>;
}

export class ExtHostSCMInputBox implements vscode.SourceControlInputBox {

	#proxy: MainThreadSCMShape;
	#extHostDocuments: ExtHostDocuments;

	private _value: string = '';

	get value(): string {
		return this._value;
	}

	set value(value: string) {
		value = value ?? '';
		this.#proxy.$setInputBoxValue(this._sourceControlHandle, value);
		this.updateValue(value);
	}

	private readonly _onDidChange = new Emitter<string>();

	get onDidChange(): Event<string> {
		return this._onDidChange.event;
	}

	private _placeholder: string = '';

	get placeholder(): string {
		return this._placeholder;
	}

	set placeholder(placeholder: string) {
		this.#proxy.$setInputBoxPlaceholder(this._sourceControlHandle, placeholder);
		this._placeholder = placeholder;
	}

	private _validateInput: IValidateInput | undefined;

	get validateInput(): IValidateInput | undefined {
		checkProposedApiEnabled(this._extension, 'scmValidation');

		return this._validateInput;
	}

	set validateInput(fn: IValidateInput | undefined) {
		checkProposedApiEnabled(this._extension, 'scmValidation');

		if (fn && typeof fn !== 'function') {
			throw new Error(`[${this._extension.identifier.value}]: Invalid SCM input box validation function`);
		}

		this._validateInput = fn;
		this.#proxy.$setValidationProviderIsEnabled(this._sourceControlHandle, !!fn);
	}

	private _enabled: boolean = true;

	get enabled(): boolean {
		return this._enabled;
	}

	set enabled(enabled: boolean) {
		enabled = !!enabled;

		if (this._enabled === enabled) {
			return;
		}

		this._enabled = enabled;
		this.#proxy.$setInputBoxEnablement(this._sourceControlHandle, enabled);
	}

	private _visible: boolean = true;

	get visible(): boolean {
		return this._visible;
	}

	set visible(visible: boolean) {
		visible = !!visible;

		if (this._visible === visible) {
			return;
		}

		this._visible = visible;
		this.#proxy.$setInputBoxVisibility(this._sourceControlHandle, visible);
	}

	get document(): vscode.TextDocument {
		checkProposedApiEnabled(this._extension, 'scmTextDocument');

		return this.#extHostDocuments.getDocument(this._documentUri);
	}

	constructor(private _extension: IExtensionDescription, _extHostDocuments: ExtHostDocuments, proxy: MainThreadSCMShape, private _sourceControlHandle: number, private _documentUri: URI) {
		this.#extHostDocuments = _extHostDocuments;
		this.#proxy = proxy;
	}

	showValidationMessage(message: string | vscode.MarkdownString, type: vscode.SourceControlInputBoxValidationType) {
		checkProposedApiEnabled(this._extension, 'scmValidation');
		this.#proxy.$showValidationMessage(this._sourceControlHandle, message, SourceControlInputBoxValidationType.from(type));
	}

	$onInputBoxValueChange(value: string): void {
		this.updateValue(value);
	}

	private updateValue(value: string): void {
		this._value = value;
		this._onDidChange.fire(value);
	}
}

class ExtHostSourceControlResourceGroup implements vscode.SourceControlResourceGroup {

	private static _handlePool: number = 0;
	private _resourceHandlePool: number = 0;
	private _resourceStates: vscode.SourceControlResourceState[] = [];

	private _resourceStatesMap = new Map<ResourceStateHandle, vscode.SourceControlResourceState>();
	private _resourceStatesCommandsMap = new Map<ResourceStateHandle, vscode.Command>();
	private _resourceStatesDisposablesMap = new Map<ResourceStateHandle, IDisposable>();

	private readonly _onDidUpdateResourceStates = new Emitter<void>();
	readonly onDidUpdateResourceStates = this._onDidUpdateResourceStates.event;

	private _disposed = false;
	get disposed(): boolean { return this._disposed; }
	private readonly _onDidDispose = new Emitter<void>();
	readonly onDidDispose = this._onDidDispose.event;

	private _handlesSnapshot: number[] = [];
	private _resourceSnapshot: vscode.SourceControlResourceState[] = [];

	get id(): string { return this._id; }

	get label(): string { return this._label; }
	set label(label: string) {
		this._label = label;
		this._proxy.$updateGroupLabel(this._sourceControlHandle, this.handle, label);
	}

	private _contextValue: string | undefined = undefined;
	get contextValue(): string | undefined {
		return this._contextValue;
	}
	set contextValue(contextValue: string | undefined) {
		this._contextValue = contextValue;
		this._proxy.$updateGroup(this._sourceControlHandle, this.handle, this.features);
	}

	private _hideWhenEmpty: boolean | undefined = undefined;
	get hideWhenEmpty(): boolean | undefined { return this._hideWhenEmpty; }
	set hideWhenEmpty(hideWhenEmpty: boolean | undefined) {
		this._hideWhenEmpty = hideWhenEmpty;
		this._proxy.$updateGroup(this._sourceControlHandle, this.handle, this.features);
	}

	get features(): SCMGroupFeatures {
		return {
			contextValue: this.contextValue,
			hideWhenEmpty: this.hideWhenEmpty
		};
	}

	get resourceStates(): vscode.SourceControlResourceState[] { return [...this._resourceStates]; }
	set resourceStates(resources: vscode.SourceControlResourceState[]) {
		this._resourceStates = [...resources];
		this._onDidUpdateResourceStates.fire();
	}

	readonly handle = ExtHostSourceControlResourceGroup._handlePool++;

	constructor(
		private _proxy: MainThreadSCMShape,
		private _commands: ExtHostCommands,
		private _sourceControlHandle: number,
		private _id: string,
		private _label: string,
		public readonly multiDiffEditorEnableViewChanges: boolean,
		private readonly _extension: IExtensionDescription,
	) { }

	getResourceState(handle: number): vscode.SourceControlResourceState | undefined {
		return this._resourceStatesMap.get(handle);
	}

	$executeResourceCommand(handle: number, preserveFocus: boolean): Promise<void> {
		const command = this._resourceStatesCommandsMap.get(handle);

		if (!command) {
			return Promise.resolve(undefined);
		}

		return asPromise(() => this._commands.executeCommand(command.command, ...(command.arguments || []), preserveFocus));
	}

	_takeResourceStateSnapshot(): SCMRawResourceSplice[] {
		const snapshot = [...this._resourceStates].sort(compareResourceStates);
		const diffs = sortedDiff(this._resourceSnapshot, snapshot, compareResourceStates);

		const splices = diffs.map<ISplice<{ rawResource: SCMRawResource; handle: number }>>(diff => {
			const toInsert = diff.toInsert.map(r => {
				const handle = this._resourceHandlePool++;
				this._resourceStatesMap.set(handle, r);

				const sourceUri = r.resourceUri;

				let command: ICommandDto | undefined;
				if (r.command) {
					if (r.command.command === 'vscode.open' || r.command.command === 'vscode.diff' || r.command.command === 'vscode.changes') {
						const disposables = new DisposableStore();
						command = this._commands.converter.toInternal(r.command, disposables);
						this._resourceStatesDisposablesMap.set(handle, disposables);
					} else {
						this._resourceStatesCommandsMap.set(handle, r.command);
					}
				}

				const hasScmMultiDiffEditorProposalEnabled = isProposedApiEnabled(this._extension, 'scmMultiDiffEditor');
				const multiFileDiffEditorOriginalUri = hasScmMultiDiffEditorProposalEnabled ? r.multiDiffEditorOriginalUri : undefined;
				const multiFileDiffEditorModifiedUri = hasScmMultiDiffEditorProposalEnabled ? r.multiFileDiffEditorModifiedUri : undefined;

				const icon = getIconResource(r.decorations);
				const lightIcon = r.decorations && getIconResource(r.decorations.light) || icon;
				const darkIcon = r.decorations && getIconResource(r.decorations.dark) || icon;
				const icons: SCMRawResource[2] = [lightIcon, darkIcon];

				const tooltip = (r.decorations && r.decorations.tooltip) || '';
				const strikeThrough = r.decorations && !!r.decorations.strikeThrough;
				const faded = r.decorations && !!r.decorations.faded;
				const contextValue = r.contextValue || '';

				const rawResource = [handle, sourceUri, icons, tooltip, strikeThrough, faded, contextValue, command, multiFileDiffEditorOriginalUri, multiFileDiffEditorModifiedUri] as SCMRawResource;

				return { rawResource, handle };
			});

			return { start: diff.start, deleteCount: diff.deleteCount, toInsert };
		});

		const rawResourceSplices = splices
			.map(({ start, deleteCount, toInsert }) => [start, deleteCount, toInsert.map(i => i.rawResource)] as SCMRawResourceSplice);

		const reverseSplices = splices.reverse();

		for (const { start, deleteCount, toInsert } of reverseSplices) {
			const handles = toInsert.map(i => i.handle);
			const handlesToDelete = this._handlesSnapshot.splice(start, deleteCount, ...handles);

			for (const handle of handlesToDelete) {
				this._resourceStatesMap.delete(handle);
				this._resourceStatesCommandsMap.delete(handle);
				this._resourceStatesDisposablesMap.get(handle)?.dispose();
				this._resourceStatesDisposablesMap.delete(handle);
			}
		}

		this._resourceSnapshot = snapshot;
		return rawResourceSplices;
	}

	dispose(): void {
		this._disposed = true;
		this._onDidDispose.fire();
	}
}

class ExtHostSourceControl implements vscode.SourceControl {

	private static _handlePool: number = 0;

	readonly onDidDisposeParent: Event<void>;

	private readonly _onDidDispose = new Emitter<void>();
	readonly onDidDispose = this._onDidDispose.event;


	#proxy: MainThreadSCMShape;

	private _groups: Map<GroupHandle, ExtHostSourceControlResourceGroup> = new Map<GroupHandle, ExtHostSourceControlResourceGroup>();

	get id(): string {
		return this._id;
	}

	get label(): string {
		return this._label;
	}

	get rootUri(): vscode.Uri | undefined {
		return this._rootUri;
	}

	private _contextValue: string | undefined = undefined;

	get contextValue(): string | undefined {
		checkProposedApiEnabled(this._extension, 'scmProviderOptions');
		return this._contextValue;
	}

	set contextValue(contextValue: string | undefined) {
		checkProposedApiEnabled(this._extension, 'scmProviderOptions');

		if (this._contextValue === contextValue) {
			return;
		}

		this._contextValue = contextValue;
		this.#proxy.$updateSourceControl(this.handle, { contextValue });
	}

	private _inputBox: ExtHostSCMInputBox;
	get inputBox(): ExtHostSCMInputBox { return this._inputBox; }

	private _count: number | undefined = undefined;

	get count(): number | undefined {
		return this._count;
	}

	set count(count: number | undefined) {
		if (this._count === count) {
			return;
		}

		this._count = count;
		this.#proxy.$updateSourceControl(this.handle, { count });
	}

	private _quickDiffProvider: vscode.QuickDiffProvider | undefined = undefined;

	get quickDiffProvider(): vscode.QuickDiffProvider | undefined {
		return this._quickDiffProvider;
	}

	set quickDiffProvider(quickDiffProvider: vscode.QuickDiffProvider | undefined) {
		this._quickDiffProvider = quickDiffProvider;
		let quickDiffLabel = undefined;
		if (isProposedApiEnabled(this._extension, 'quickDiffProvider')) {
			quickDiffLabel = quickDiffProvider?.label;
		}
		this.#proxy.$updateSourceControl(this.handle, { hasQuickDiffProvider: !!quickDiffProvider, quickDiffLabel });
	}

	private _secondaryQuickDiffProvider: vscode.QuickDiffProvider | undefined = undefined;

	get secondaryQuickDiffProvider(): vscode.QuickDiffProvider | undefined {
		checkProposedApiEnabled(this._extension, 'quickDiffProvider');
		return this._secondaryQuickDiffProvider;
	}

	set secondaryQuickDiffProvider(secondaryQuickDiffProvider: vscode.QuickDiffProvider | undefined) {
		checkProposedApiEnabled(this._extension, 'quickDiffProvider');

		this._secondaryQuickDiffProvider = secondaryQuickDiffProvider;
		const secondaryQuickDiffLabel = secondaryQuickDiffProvider?.label;
		this.#proxy.$updateSourceControl(this.handle, { hasSecondaryQuickDiffProvider: !!secondaryQuickDiffProvider, secondaryQuickDiffLabel });
	}

	private _historyProvider: vscode.SourceControlHistoryProvider | undefined;
	private readonly _historyProviderDisposable = new MutableDisposable<DisposableStore>();

	get historyProvider(): vscode.SourceControlHistoryProvider | undefined {
		checkProposedApiEnabled(this._extension, 'scmHistoryProvider');
		return this._historyProvider;
	}

	set historyProvider(historyProvider: vscode.SourceControlHistoryProvider | undefined) {
		checkProposedApiEnabled(this._extension, 'scmHistoryProvider');

		this._historyProvider = historyProvider;
		this._historyProviderDisposable.value = new DisposableStore();

		this.#proxy.$updateSourceControl(this.handle, { hasHistoryProvider: !!historyProvider });

		if (historyProvider) {
			this._historyProviderDisposable.value.add(historyProvider.onDidChangeCurrentHistoryItemRefs(() => {
				const historyItemRef = toSCMHistoryItemRefDto(historyProvider?.currentHistoryItemRef);
				const historyItemRemoteRef = toSCMHistoryItemRefDto(historyProvider?.currentHistoryItemRemoteRef);
				const historyItemBaseRef = toSCMHistoryItemRefDto(historyProvider?.currentHistoryItemBaseRef);

				this.#proxy.$onDidChangeHistoryProviderCurrentHistoryItemRefs(this.handle, historyItemRef, historyItemRemoteRef, historyItemBaseRef);
			}));
			this._historyProviderDisposable.value.add(historyProvider.onDidChangeHistoryItemRefs((e) => {
				if (e.added.length === 0 && e.modified.length === 0 && e.removed.length === 0) {
					return;
				}

				const added = e.added.map(ref => ({ ...ref, icon: getHistoryItemIconDto(ref.icon) }));
				const modified = e.modified.map(ref => ({ ...ref, icon: getHistoryItemIconDto(ref.icon) }));
				const removed = e.removed.map(ref => ({ ...ref, icon: getHistoryItemIconDto(ref.icon) }));

				this.#proxy.$onDidChangeHistoryProviderHistoryItemRefs(this.handle, { added, modified, removed, silent: e.silent });
			}));
		}
	}

	private _artifactProvider: vscode.SourceControlArtifactProvider | undefined;
	private readonly _artifactProviderDisposable = new MutableDisposable<DisposableStore>();

	get artifactProvider(): vscode.SourceControlArtifactProvider | undefined {
		checkProposedApiEnabled(this._extension, 'scmArtifactProvider');
		return this._artifactProvider;
	}

	set artifactProvider(artifactProvider: vscode.SourceControlArtifactProvider | undefined) {
		checkProposedApiEnabled(this._extension, 'scmArtifactProvider');

		this._artifactProvider = artifactProvider;
		this._artifactProviderDisposable.value = new DisposableStore();

		this.#proxy.$updateSourceControl(this.handle, { hasArtifactProvider: !!artifactProvider });

		if (artifactProvider) {
			this._artifactProviderDisposable.value.add(artifactProvider.onDidChangeArtifacts((groups: string[]) => {
				if (groups.length !== 0) {
					this.#proxy.$onDidChangeArtifacts(this.handle, groups);
				}
			}));
		}
	}

	private _commitTemplate: string | undefined = undefined;

	get commitTemplate(): string | undefined {
		return this._commitTemplate;
	}

	set commitTemplate(commitTemplate: string | undefined) {
		if (commitTemplate === this._commitTemplate) {
			return;
		}

		this._commitTemplate = commitTemplate;
		this.#proxy.$updateSourceControl(this.handle, { commitTemplate });
	}

	private readonly _acceptInputDisposables = new MutableDisposable<DisposableStore>();
	private _acceptInputCommand: vscode.Command | undefined = undefined;

	get acceptInputCommand(): vscode.Command | undefined {
		return this._acceptInputCommand;
	}

	set acceptInputCommand(acceptInputCommand: vscode.Command | undefined) {
		this._acceptInputDisposables.value = new DisposableStore();

		this._acceptInputCommand = acceptInputCommand;

		const internal = this._commands.converter.toInternal(acceptInputCommand, this._acceptInputDisposables.value);
		this.#proxy.$updateSourceControl(this.handle, { acceptInputCommand: internal });
	}

	// We know what we're doing here:
	// eslint-disable-next-line local/code-no-potentially-unsafe-disposables
	private _actionButtonDisposables = new DisposableStore();
	private _actionButton: vscode.SourceControlActionButton | undefined;
	get actionButton(): vscode.SourceControlActionButton | undefined {
		checkProposedApiEnabled(this._extension, 'scmActionButton');
		return this._actionButton;
	}

	set actionButton(actionButton: vscode.SourceControlActionButton | undefined) {
		checkProposedApiEnabled(this._extension, 'scmActionButton');

		// We have to do this check before converting the command to it's internal
		// representation since that would always create a command with a unique
		// identifier
		if (structuralEquals(this._actionButton, actionButton)) {
			return;
		}

		// In order to prevent disposing the action button command that are still rendered in the UI
		// until the next UI update, we ensure to dispose them after the update has been completed.
		const oldActionButtonDisposables = this._actionButtonDisposables;
		this._actionButtonDisposables = new DisposableStore();

		this._actionButton = actionButton;

		const actionButtonDto = actionButton !== undefined ?
			{
				command: {
					...this._commands.converter.toInternal(actionButton.command, this._actionButtonDisposables),
					shortTitle: actionButton.command.shortTitle
				},
				secondaryCommands: actionButton.secondaryCommands?.map(commandGroup => {
					return commandGroup.map(command => this._commands.converter.toInternal(command, this._actionButtonDisposables));
				}),
				enabled: actionButton.enabled
			} satisfies SCMActionButtonDto : null;

		this.#proxy.$updateSourceControl(this.handle, { actionButton: actionButtonDto })
			.finally(() => oldActionButtonDisposables.dispose());
	}

	// We know what we're doing here:
	// eslint-disable-next-line local/code-no-potentially-unsafe-disposables
	private _statusBarDisposables = new DisposableStore();
	private _statusBarCommands: vscode.Command[] | undefined = undefined;

	get statusBarCommands(): vscode.Command[] | undefined {
		return this._statusBarCommands;
	}

	set statusBarCommands(statusBarCommands: vscode.Command[] | undefined) {
		if (this._statusBarCommands && statusBarCommands && commandListEquals(this._statusBarCommands, statusBarCommands)) {
			return;
		}

		// In order to prevent disposing status bar commands that are still rendered in the UI
		// until the next UI update, we ensure to dispose them after the update has been completed.
		const oldStatusBarDisposables = this._statusBarDisposables;
		this._statusBarDisposables = new DisposableStore();

		this._statusBarCommands = statusBarCommands;

		const internal = (statusBarCommands || []).map(c => this._commands.converter.toInternal(c, this._statusBarDisposables)) as ICommandDto[];

		this.#proxy.$updateSourceControl(this.handle, { statusBarCommands: internal })
			.finally(() => oldStatusBarDisposables.dispose());
	}

	private _selected: boolean = false;

	get selected(): boolean {
		return this._selected;
	}

	private readonly _onDidChangeSelection = new Emitter<boolean>();
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	private readonly _artifactCommandsDisposables = new DisposableMap<string /* artifact group */, DisposableStore>();

	readonly handle: number = ExtHostSourceControl._handlePool++;

	constructor(
		private readonly _extension: IExtensionDescription,
		_extHostDocuments: ExtHostDocuments,
		proxy: MainThreadSCMShape,
		private _commands: ExtHostCommands,
		private _id: string,
		private _label: string,
		private _rootUri?: vscode.Uri,
		_iconPath?: vscode.IconPath,
		_parent?: ExtHostSourceControl
	) {
		this.#proxy = proxy;

		const inputBoxDocumentUri = URI.from({
			scheme: Schemas.vscodeSourceControl,
			path: `${_id}/scm${this.handle}/input`,
			query: _rootUri ? `rootUri=${encodeURIComponent(_rootUri.toString())}` : undefined
		});

		this._inputBox = new ExtHostSCMInputBox(_extension, _extHostDocuments, this.#proxy, this.handle, inputBoxDocumentUri);
		this.#proxy.$registerSourceControl(this.handle, _parent?.handle, _id, _label, _rootUri, getHistoryItemIconDto(_iconPath), inputBoxDocumentUri);

		this.onDidDisposeParent = _parent ? _parent.onDidDispose : Event.None;
	}

	private createdResourceGroups = new Map<ExtHostSourceControlResourceGroup, IDisposable>();
	private updatedResourceGroups = new Set<ExtHostSourceControlResourceGroup>();

	createResourceGroup(id: string, label: string, options?: { multiDiffEditorEnableViewChanges?: boolean }): ExtHostSourceControlResourceGroup {
		const multiDiffEditorEnableViewChanges = isProposedApiEnabled(this._extension, 'scmMultiDiffEditor') && options?.multiDiffEditorEnableViewChanges === true;
		const group = new ExtHostSourceControlResourceGroup(this.#proxy, this._commands, this.handle, id, label, multiDiffEditorEnableViewChanges, this._extension);
		const disposable = Event.once(group.onDidDispose)(() => this.createdResourceGroups.delete(group));
		this.createdResourceGroups.set(group, disposable);
		this.eventuallyAddResourceGroups();
		return group;
	}

	@debounce(100)
	eventuallyAddResourceGroups(): void {
		const groups: [number /*handle*/, string /*id*/, string /*label*/, SCMGroupFeatures, /*multiDiffEditorEnableViewChanges*/ boolean][] = [];
		const splices: SCMRawResourceSplices[] = [];

		for (const [group, disposable] of this.createdResourceGroups) {
			disposable.dispose();

			const updateListener = group.onDidUpdateResourceStates(() => {
				this.updatedResourceGroups.add(group);
				this.eventuallyUpdateResourceStates();
			});

			Event.once(group.onDidDispose)(() => {
				this.updatedResourceGroups.delete(group);
				updateListener.dispose();
				this._groups.delete(group.handle);
				this.#proxy.$unregisterGroup(this.handle, group.handle);
			});

			groups.push([group.handle, group.id, group.label, group.features, group.multiDiffEditorEnableViewChanges]);

			const snapshot = group._takeResourceStateSnapshot();

			if (snapshot.length > 0) {
				splices.push([group.handle, snapshot]);
			}

			this._groups.set(group.handle, group);
		}

		this.#proxy.$registerGroups(this.handle, groups, splices);
		this.createdResourceGroups.clear();
	}

	@debounce(100)
	eventuallyUpdateResourceStates(): void {
		const splices: SCMRawResourceSplices[] = [];

		this.updatedResourceGroups.forEach(group => {
			const snapshot = group._takeResourceStateSnapshot();

			if (snapshot.length === 0) {
				return;
			}

			splices.push([group.handle, snapshot]);
		});

		if (splices.length > 0) {
			this.#proxy.$spliceResourceStates(this.handle, splices);
		}

		this.updatedResourceGroups.clear();
	}

	getResourceGroup(handle: GroupHandle): ExtHostSourceControlResourceGroup | undefined {
		return this._groups.get(handle);
	}

	setSelectionState(selected: boolean): void {
		this._selected = selected;
		this._onDidChangeSelection.fire(selected);
	}

	async provideArtifacts(group: string, token: CancellationToken): Promise<SCMArtifactDto[] | undefined> {
		const commandsDisposables = new DisposableStore();
		const artifacts = await this.artifactProvider?.provideArtifacts(group, token);
		const artifactsDto = artifacts?.map(artifact => ({
			...artifact,
			icon: getHistoryItemIconDto(artifact.icon),
			command: artifact.command ? this._commands.converter.toInternal(artifact.command, commandsDisposables) : undefined
		}));

		this._artifactCommandsDisposables.get(group)?.dispose();
		this._artifactCommandsDisposables.set(group, commandsDisposables);

		return artifactsDto;
	}

	dispose(): void {
		this._acceptInputDisposables.dispose();
		this._actionButtonDisposables.dispose();
		this._statusBarDisposables.dispose();
		this._historyProviderDisposable.dispose();
		this._artifactProviderDisposable.dispose();
		this._artifactCommandsDisposables.dispose();

		this._groups.forEach(group => group.dispose());
		this.#proxy.$unregisterSourceControl(this.handle);

		this._onDidDispose.fire();
		this._onDidDispose.dispose();
	}
}

export class ExtHostSCM implements ExtHostSCMShape {

	private _proxy: MainThreadSCMShape;
	private readonly _telemetry: MainThreadTelemetryShape;
	private _sourceControls: Map<ProviderHandle, ExtHostSourceControl> = new Map<ProviderHandle, ExtHostSourceControl>();
	private _sourceControlsByExtension: ExtensionIdentifierMap<ExtHostSourceControl[]> = new ExtensionIdentifierMap<ExtHostSourceControl[]>();

	private readonly _onDidChangeActiveProvider = new Emitter<vscode.SourceControl>();
	get onDidChangeActiveProvider(): Event<vscode.SourceControl> { return this._onDidChangeActiveProvider.event; }

	private _selectedSourceControlHandle: number | undefined;

	constructor(
		mainContext: IMainContext,
		private _commands: ExtHostCommands,
		private _extHostDocuments: ExtHostDocuments,
		@ILogService private readonly logService: ILogService
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadSCM);
		this._telemetry = mainContext.getProxy(MainContext.MainThreadTelemetry);

		_commands.registerArgumentProcessor({
			processArgument: arg => {
				if (arg && arg.$mid === MarshalledId.ScmResource) {
					const sourceControl = this._sourceControls.get(arg.sourceControlHandle);

					if (!sourceControl) {
						return arg;
					}

					const group = sourceControl.getResourceGroup(arg.groupHandle);

					if (!group) {
						return arg;
					}

					return group.getResourceState(arg.handle);
				} else if (arg && arg.$mid === MarshalledId.ScmResourceGroup) {
					const sourceControl = this._sourceControls.get(arg.sourceControlHandle);

					if (!sourceControl) {
						return arg;
					}

					return sourceControl.getResourceGroup(arg.groupHandle);
				} else if (arg && arg.$mid === MarshalledId.ScmProvider) {
					const sourceControl = this._sourceControls.get(arg.handle);

					if (!sourceControl) {
						return arg;
					}

					return sourceControl;
				}

				return arg;
			}
		});
	}

	createSourceControl(extension: IExtensionDescription, id: string, label: string, rootUri: vscode.Uri | undefined, iconPath: vscode.IconPath | undefined, parent: vscode.SourceControl | undefined): vscode.SourceControl {
		this.logService.trace('ExtHostSCM#createSourceControl', extension.identifier.value, id, label, rootUri);

		type TEvent = { extensionId: string };
		type TMeta = {
			owner: 'joaomoreno';
			extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The ID of the extension contributing to the Source Control API.' };
			comment: 'This is used to know what extensions contribute to the Source Control API.';
		};
		this._telemetry.$publicLog2<TEvent, TMeta>('api/scm/createSourceControl', {
			extensionId: extension.identifier.value,
		});

		const parentSourceControl = parent ? Iterable.find(this._sourceControls.values(), s => s === parent) : undefined;
		const sourceControl = new ExtHostSourceControl(extension, this._extHostDocuments, this._proxy, this._commands, id, label, rootUri, iconPath, parentSourceControl);
		this._sourceControls.set(sourceControl.handle, sourceControl);

		const sourceControls = this._sourceControlsByExtension.get(extension.identifier) || [];
		sourceControls.push(sourceControl);
		this._sourceControlsByExtension.set(extension.identifier, sourceControls);

		return sourceControl;
	}

	// Deprecated
	getLastInputBox(extension: IExtensionDescription): ExtHostSCMInputBox | undefined {
		this.logService.trace('ExtHostSCM#getLastInputBox', extension.identifier.value);

		const sourceControls = this._sourceControlsByExtension.get(extension.identifier);
		const sourceControl = sourceControls && sourceControls[sourceControls.length - 1];
		return sourceControl && sourceControl.inputBox;
	}

	$provideOriginalResource(sourceControlHandle: number, uriComponents: UriComponents, token: CancellationToken): Promise<UriComponents | null> {
		const uri = URI.revive(uriComponents);
		this.logService.trace('ExtHostSCM#$provideOriginalResource', sourceControlHandle, uri.toString());

		const sourceControl = this._sourceControls.get(sourceControlHandle);

		if (!sourceControl || !sourceControl.quickDiffProvider || !sourceControl.quickDiffProvider.provideOriginalResource) {
			return Promise.resolve(null);
		}

		return asPromise(() => sourceControl.quickDiffProvider!.provideOriginalResource!(uri, token))
			.then<UriComponents | null>(r => r || null);
	}

	$provideSecondaryOriginalResource(sourceControlHandle: number, uriComponents: UriComponents, token: CancellationToken): Promise<UriComponents | null> {
		const uri = URI.revive(uriComponents);
		this.logService.trace('ExtHostSCM#$provideSecondaryOriginalResource', sourceControlHandle, uri.toString());

		const sourceControl = this._sourceControls.get(sourceControlHandle);

		if (!sourceControl || !sourceControl.secondaryQuickDiffProvider || !sourceControl.secondaryQuickDiffProvider.provideOriginalResource) {
			return Promise.resolve(null);
		}

		return asPromise(() => sourceControl.secondaryQuickDiffProvider!.provideOriginalResource!(uri, token))
			.then<UriComponents | null>(r => r || null);
	}

	$onInputBoxValueChange(sourceControlHandle: number, value: string): Promise<void> {
		this.logService.trace('ExtHostSCM#$onInputBoxValueChange', sourceControlHandle);

		const sourceControl = this._sourceControls.get(sourceControlHandle);

		if (!sourceControl) {
			return Promise.resolve(undefined);
		}

		sourceControl.inputBox.$onInputBoxValueChange(value);
		return Promise.resolve(undefined);
	}

	$executeResourceCommand(sourceControlHandle: number, groupHandle: number, handle: number, preserveFocus: boolean): Promise<void> {
		this.logService.trace('ExtHostSCM#$executeResourceCommand', sourceControlHandle, groupHandle, handle);

		const sourceControl = this._sourceControls.get(sourceControlHandle);

		if (!sourceControl) {
			return Promise.resolve(undefined);
		}

		const group = sourceControl.getResourceGroup(groupHandle);

		if (!group) {
			return Promise.resolve(undefined);
		}

		return group.$executeResourceCommand(handle, preserveFocus);
	}

	$validateInput(sourceControlHandle: number, value: string, cursorPosition: number): Promise<[string | IMarkdownString, number] | undefined> {
		this.logService.trace('ExtHostSCM#$validateInput', sourceControlHandle);

		const sourceControl = this._sourceControls.get(sourceControlHandle);

		if (!sourceControl) {
			return Promise.resolve(undefined);
		}

		if (!sourceControl.inputBox.validateInput) {
			return Promise.resolve(undefined);
		}

		return asPromise(() => sourceControl.inputBox.validateInput!(value, cursorPosition)).then(result => {
			if (!result) {
				return Promise.resolve(undefined);
			}

			const message = MarkdownString.fromStrict(result.message);
			if (!message) {
				return Promise.resolve(undefined);
			}

			return Promise.resolve<[string | IMarkdownString, number]>([message, result.type]);
		});
	}

	$setSelectedSourceControl(selectedSourceControlHandle: number | undefined): Promise<void> {
		this.logService.trace('ExtHostSCM#$setSelectedSourceControl', selectedSourceControlHandle);

		if (selectedSourceControlHandle !== undefined) {
			this._sourceControls.get(selectedSourceControlHandle)?.setSelectionState(true);
		}

		if (this._selectedSourceControlHandle !== undefined) {
			this._sourceControls.get(this._selectedSourceControlHandle)?.setSelectionState(false);
		}

		this._selectedSourceControlHandle = selectedSourceControlHandle;
		return Promise.resolve(undefined);
	}

	async $resolveHistoryItem(sourceControlHandle: number, historyItemId: string, token: CancellationToken): Promise<SCMHistoryItemDto | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const historyItem = await historyProvider?.resolveHistoryItem(historyItemId, token);

			return historyItem ? toSCMHistoryItemDto(historyItem) : undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$resolveHistoryItem', err);
			return undefined;
		}
	}

	async $resolveHistoryItemChatContext(sourceControlHandle: number, historyItemId: string, token: CancellationToken): Promise<string | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const chatContext = await historyProvider?.resolveHistoryItemChatContext(historyItemId, token);

			return chatContext ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$resolveHistoryItemChatContext', err);
			return undefined;
		}
	}

	async $resolveHistoryItemChangeRangeChatContext(sourceControlHandle: number, historyItemId: string, historyItemParentId: string, path: string, token: CancellationToken): Promise<string | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const chatContext = await historyProvider?.resolveHistoryItemChangeRangeChatContext?.(historyItemId, historyItemParentId, path, token);

			return chatContext ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$resolveHistoryItemChangeRangeChatContext', err);
			return undefined;
		}
	}

	async $resolveHistoryItemRefsCommonAncestor(sourceControlHandle: number, historyItemRefs: string[], token: CancellationToken): Promise<string | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const ancestor = await historyProvider?.resolveHistoryItemRefsCommonAncestor(historyItemRefs, token);

			return ancestor ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$resolveHistoryItemRefsCommonAncestor', err);
			return undefined;
		}
	}

	async $provideHistoryItemRefs(sourceControlHandle: number, historyItemRefs: string[] | undefined, token: CancellationToken): Promise<SCMHistoryItemRefDto[] | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const refs = await historyProvider?.provideHistoryItemRefs(historyItemRefs, token);

			return refs?.map(ref => ({ ...ref, icon: getHistoryItemIconDto(ref.icon) })) ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$provideHistoryItemRefs', err);
			return undefined;
		}
	}

	async $provideHistoryItems(sourceControlHandle: number, options: vscode.SourceControlHistoryOptions, token: CancellationToken): Promise<SCMHistoryItemDto[] | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const historyItems = await historyProvider?.provideHistoryItems(options, token);

			return historyItems?.map(item => toSCMHistoryItemDto(item)) ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$provideHistoryItems', err);
			return undefined;
		}
	}

	async $provideHistoryItemChanges(sourceControlHandle: number, historyItemId: string, historyItemParentId: string | undefined, token: CancellationToken): Promise<SCMHistoryItemChangeDto[] | undefined> {
		try {
			const historyProvider = this._sourceControls.get(sourceControlHandle)?.historyProvider;
			const changes = await historyProvider?.provideHistoryItemChanges(historyItemId, historyItemParentId, token);

			return changes ?? undefined;
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$provideHistoryItemChanges', err);
			return undefined;
		}
	}

	async $provideArtifactGroups(sourceControlHandle: number, token: CancellationToken): Promise<SCMArtifactGroupDto[] | undefined> {
		try {
			const artifactProvider = this._sourceControls.get(sourceControlHandle)?.artifactProvider;
			const groups = await artifactProvider?.provideArtifactGroups(token);

			return groups?.map(group => ({
				...group,
				icon: getHistoryItemIconDto(group.icon)
			}));
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$provideArtifactGroups', err);
			return undefined;
		}
	}

	async $provideArtifacts(sourceControlHandle: number, group: string, token: CancellationToken): Promise<SCMArtifactDto[] | undefined> {
		try {
			const sourceControl = this._sourceControls.get(sourceControlHandle);
			return sourceControl?.provideArtifacts(group, token);
		}
		catch (err) {
			this.logService.error('ExtHostSCM#$provideArtifacts', err);
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostSearch.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import type * as vscode from 'vscode';
import { ExtHostSearchShape, MainThreadSearchShape, MainContext } from './extHost.protocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { FileSearchManager } from '../../services/search/common/fileSearchManager.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IURITransformerService } from './extHostUriTransformerService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IRawFileQuery, ISearchCompleteStats, IFileQuery, IRawTextQuery, IRawQuery, ITextQuery, IFolderQuery, IRawAITextQuery, IAITextQuery } from '../../services/search/common/search.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { TextSearchManager } from '../../services/search/common/textSearchManager.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { revive } from '../../../base/common/marshalling.js';
import { OldFileSearchProviderConverter, OldTextSearchProviderConverter } from '../../services/search/common/searchExtConversionTypes.js';

export interface IExtHostSearch extends ExtHostSearchShape {
	registerTextSearchProviderOld(scheme: string, provider: vscode.TextSearchProvider): IDisposable;
	registerFileSearchProviderOld(scheme: string, provider: vscode.FileSearchProvider): IDisposable;
	registerTextSearchProvider(scheme: string, provider: vscode.TextSearchProvider2): IDisposable;
	registerAITextSearchProvider(scheme: string, provider: vscode.AITextSearchProvider): IDisposable;
	registerFileSearchProvider(scheme: string, provider: vscode.FileSearchProvider2): IDisposable;
	doInternalFileSearchWithCustomCallback(query: IFileQuery, token: CancellationToken, handleFileMatch: (data: URI[]) => void): Promise<ISearchCompleteStats>;
}

export const IExtHostSearch = createDecorator<IExtHostSearch>('IExtHostSearch');

export class ExtHostSearch implements IExtHostSearch {

	protected readonly _proxy: MainThreadSearchShape;
	protected _handlePool: number;

	private readonly _textSearchProvider: Map<number, vscode.TextSearchProvider2>;
	private readonly _textSearchUsedSchemes: Set<string>;

	private readonly _aiTextSearchProvider: Map<number, vscode.AITextSearchProvider>;
	private readonly _aiTextSearchUsedSchemes: Set<string>;

	private readonly _fileSearchProvider: Map<number, vscode.FileSearchProvider2>;
	private readonly _fileSearchUsedSchemes: Set<string>;

	private readonly _fileSearchManager: FileSearchManager;

	constructor(
		@IExtHostRpcService private extHostRpc: IExtHostRpcService,
		@IURITransformerService protected _uriTransformer: IURITransformerService,
		@ILogService protected _logService: ILogService,
	) {
		this._proxy = this.extHostRpc.getProxy(MainContext.MainThreadSearch);
		this._handlePool = 0;
		this._textSearchProvider = new Map<number, vscode.TextSearchProvider2>();
		this._textSearchUsedSchemes = new Set<string>();
		this._aiTextSearchProvider = new Map<number, vscode.AITextSearchProvider>();
		this._aiTextSearchUsedSchemes = new Set<string>();
		this._fileSearchProvider = new Map<number, vscode.FileSearchProvider2>();
		this._fileSearchUsedSchemes = new Set<string>();
		this._fileSearchManager = new FileSearchManager();
	}

	protected _transformScheme(scheme: string): string {
		return this._uriTransformer.transformOutgoingScheme(scheme);
	}

	registerTextSearchProviderOld(scheme: string, provider: vscode.TextSearchProvider): IDisposable {
		if (this._textSearchUsedSchemes.has(scheme)) {
			throw new Error(`a text search provider for the scheme '${scheme}' is already registered`);
		}

		this._textSearchUsedSchemes.add(scheme);
		const handle = this._handlePool++;
		this._textSearchProvider.set(handle, new OldTextSearchProviderConverter(provider));
		this._proxy.$registerTextSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._textSearchUsedSchemes.delete(scheme);
			this._textSearchProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	registerTextSearchProvider(scheme: string, provider: vscode.TextSearchProvider2): IDisposable {
		if (this._textSearchUsedSchemes.has(scheme)) {
			throw new Error(`a text search provider for the scheme '${scheme}' is already registered`);
		}

		this._textSearchUsedSchemes.add(scheme);
		const handle = this._handlePool++;
		this._textSearchProvider.set(handle, provider);
		this._proxy.$registerTextSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._textSearchUsedSchemes.delete(scheme);
			this._textSearchProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	registerAITextSearchProvider(scheme: string, provider: vscode.AITextSearchProvider): IDisposable {
		if (this._aiTextSearchUsedSchemes.has(scheme)) {
			throw new Error(`an AI text search provider for the scheme '${scheme}'is already registered`);
		}

		this._aiTextSearchUsedSchemes.add(scheme);
		const handle = this._handlePool++;
		this._aiTextSearchProvider.set(handle, provider);
		this._proxy.$registerAITextSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._aiTextSearchUsedSchemes.delete(scheme);
			this._aiTextSearchProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	registerFileSearchProviderOld(scheme: string, provider: vscode.FileSearchProvider): IDisposable {
		if (this._fileSearchUsedSchemes.has(scheme)) {
			throw new Error(`a file search provider for the scheme '${scheme}' is already registered`);
		}

		this._fileSearchUsedSchemes.add(scheme);
		const handle = this._handlePool++;
		this._fileSearchProvider.set(handle, new OldFileSearchProviderConverter(provider));
		this._proxy.$registerFileSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._fileSearchUsedSchemes.delete(scheme);
			this._fileSearchProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	registerFileSearchProvider(scheme: string, provider: vscode.FileSearchProvider2): IDisposable {
		if (this._fileSearchUsedSchemes.has(scheme)) {
			throw new Error(`a file search provider for the scheme '${scheme}' is already registered`);
		}

		this._fileSearchUsedSchemes.add(scheme);
		const handle = this._handlePool++;
		this._fileSearchProvider.set(handle, provider);
		this._proxy.$registerFileSearchProvider(handle, this._transformScheme(scheme));
		return toDisposable(() => {
			this._fileSearchUsedSchemes.delete(scheme);
			this._fileSearchProvider.delete(handle);
			this._proxy.$unregisterProvider(handle);
		});
	}

	$provideFileSearchResults(handle: number, session: number, rawQuery: IRawFileQuery, token: vscode.CancellationToken): Promise<ISearchCompleteStats> {
		const query = reviveQuery(rawQuery);
		const provider = this._fileSearchProvider.get(handle);
		if (provider) {
			return this._fileSearchManager.fileSearch(query, provider, batch => {
				this._proxy.$handleFileMatch(handle, session, batch.map(p => p.resource));
			}, token);
		} else {
			throw new Error('unknown provider: ' + handle);
		}
	}

	async doInternalFileSearchWithCustomCallback(query: IFileQuery, token: CancellationToken, handleFileMatch: (data: URI[]) => void): Promise<ISearchCompleteStats> {
		return { messages: [] };
	}

	$clearCache(cacheKey: string): Promise<void> {
		this._fileSearchManager.clearCache(cacheKey);

		return Promise.resolve(undefined);
	}

	$provideTextSearchResults(handle: number, session: number, rawQuery: IRawTextQuery, token: vscode.CancellationToken): Promise<ISearchCompleteStats> {
		const provider = this._textSearchProvider.get(handle);
		if (!provider || !provider.provideTextSearchResults) {
			throw new Error(`Unknown Text Search Provider ${handle}`);
		}

		const query = reviveQuery(rawQuery);
		const engine = this.createTextSearchManager(query, provider);
		return engine.search(progress => this._proxy.$handleTextMatch(handle, session, progress), token);
	}

	$provideAITextSearchResults(handle: number, session: number, rawQuery: IRawAITextQuery, token: vscode.CancellationToken): Promise<ISearchCompleteStats> {
		const provider = this._aiTextSearchProvider.get(handle);
		if (!provider || !provider.provideAITextSearchResults) {
			throw new Error(`Unknown AI Text Search Provider ${handle}`);
		}

		const query = reviveQuery(rawQuery);
		const engine = this.createAITextSearchManager(query, provider);
		return engine.search(progress => this._proxy.$handleTextMatch(handle, session, progress), token, result => this._proxy.$handleKeywordResult(handle, session, result));
	}

	$enableExtensionHostSearch(): void { }

	async $getAIName(handle: number): Promise<string | undefined> {
		const provider = this._aiTextSearchProvider.get(handle);
		if (!provider || !provider.provideAITextSearchResults) {
			return undefined;
		}

		// if the provider is defined, but has no name, use default name
		return provider.name ?? 'AI';
	}

	protected createTextSearchManager(query: ITextQuery, provider: vscode.TextSearchProvider2): TextSearchManager {
		return new TextSearchManager({ query, provider }, {
			readdir: resource => Promise.resolve([]),
			toCanonicalName: encoding => encoding
		}, 'textSearchProvider');
	}

	protected createAITextSearchManager(query: IAITextQuery, provider: vscode.AITextSearchProvider): TextSearchManager {
		return new TextSearchManager({ query, provider }, {
			readdir: resource => Promise.resolve([]),
			toCanonicalName: encoding => encoding
		}, 'aiTextSearchProvider');
	}
}

export function reviveQuery<U extends IRawQuery>(rawQuery: U): U extends IRawTextQuery ? ITextQuery : U extends IRawAITextQuery ? IAITextQuery : IFileQuery {
	return {
		// eslint-disable-next-line local/code-no-any-casts
		...<any>rawQuery, // TODO@rob ???
		...{
			folderQueries: rawQuery.folderQueries && rawQuery.folderQueries.map(reviveFolderQuery),
			extraFileResources: rawQuery.extraFileResources && rawQuery.extraFileResources.map(components => URI.revive(components))
		}
	};
}

function reviveFolderQuery(rawFolderQuery: IFolderQuery<UriComponents>): IFolderQuery<URI> {
	return revive(rawFolderQuery);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostSecrets.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostSecrets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import type * as vscode from 'vscode';

import { ExtHostSecretState } from './extHostSecretState.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';

export class ExtensionSecrets implements vscode.SecretStorage {

	protected readonly _id: string;
	readonly #secretState: ExtHostSecretState;

	readonly onDidChange: Event<vscode.SecretStorageChangeEvent>;
	readonly disposables = new DisposableStore();

	constructor(extensionDescription: IExtensionDescription, secretState: ExtHostSecretState) {
		this._id = ExtensionIdentifier.toKey(extensionDescription.identifier);
		this.#secretState = secretState;

		this.onDidChange = Event.map(
			Event.filter(this.#secretState.onDidChangePassword, e => e.extensionId === this._id),
			e => ({ key: e.key }),
			this.disposables
		);
	}

	dispose() {
		this.disposables.dispose();
	}

	get(key: string): Promise<string | undefined> {
		return this.#secretState.get(this._id, key);
	}

	store(key: string, value: string): Promise<void> {
		return this.#secretState.store(this._id, key, value);
	}

	delete(key: string): Promise<void> {
		return this.#secretState.delete(this._id, key);
	}

	keys(): Promise<string[]> {
		return this.#secretState.keys(this._id) || [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostSecretState.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostSecretState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtHostSecretStateShape, MainContext, MainThreadSecretStateShape } from './extHost.protocol.js';
import { Emitter } from '../../../base/common/event.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export class ExtHostSecretState implements ExtHostSecretStateShape {
	private _proxy: MainThreadSecretStateShape;
	private _onDidChangePassword = new Emitter<{ extensionId: string; key: string }>();
	readonly onDidChangePassword = this._onDidChangePassword.event;

	constructor(mainContext: IExtHostRpcService) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadSecretState);
	}

	async $onDidChangePassword(e: { extensionId: string; key: string }): Promise<void> {
		this._onDidChangePassword.fire(e);
	}

	get(extensionId: string, key: string): Promise<string | undefined> {
		return this._proxy.$getPassword(extensionId, key);
	}

	store(extensionId: string, key: string, value: string): Promise<void> {
		return this._proxy.$setPassword(extensionId, key, value);
	}

	delete(extensionId: string, key: string): Promise<void> {
		return this._proxy.$deletePassword(extensionId, key);
	}

	keys(extensionId: string): Promise<string[]> {
		return this._proxy.$getKeys(extensionId);
	}
}

export interface IExtHostSecretState extends ExtHostSecretState { }
export const IExtHostSecretState = createDecorator<IExtHostSecretState>('IExtHostSecretState');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostShare.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostShare.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { ExtHostShareShape, IMainContext, IShareableItemDto, MainContext, MainThreadShareShape } from './extHost.protocol.js';
import { DocumentSelector, Range } from './extHostTypeConverters.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../base/common/uri.js';

export class ExtHostShare implements ExtHostShareShape {
	private static handlePool: number = 0;

	private proxy: MainThreadShareShape;
	private providers: Map<number, vscode.ShareProvider> = new Map();

	constructor(
		mainContext: IMainContext,
		private readonly uriTransformer: IURITransformer | undefined
	) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadShare);
	}

	async $provideShare(handle: number, shareableItem: IShareableItemDto, token: CancellationToken): Promise<UriComponents | string | undefined> {
		const provider = this.providers.get(handle);
		const result = await provider?.provideShare({ selection: Range.to(shareableItem.selection), resourceUri: URI.revive(shareableItem.resourceUri) }, token);
		return result ?? undefined;
	}

	registerShareProvider(selector: vscode.DocumentSelector, provider: vscode.ShareProvider): vscode.Disposable {
		const handle = ExtHostShare.handlePool++;
		this.providers.set(handle, provider);
		this.proxy.$registerShareProvider(handle, DocumentSelector.from(selector, this.uriTransformer), provider.id, provider.label, provider.priority);
		return {
			dispose: () => {
				this.proxy.$unregisterShareProvider(handle);
				this.providers.delete(handle);
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostSpeech.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostSpeech.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../base/common/cancellation.js';
import { DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ExtHostSpeechShape, IMainContext, MainContext, MainThreadSpeechShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';

export class ExtHostSpeech implements ExtHostSpeechShape {

	private static ID_POOL = 1;

	private readonly proxy: MainThreadSpeechShape;

	private readonly providers = new Map<number, vscode.SpeechProvider>();
	private readonly sessions = new Map<number, CancellationTokenSource>();
	private readonly synthesizers = new Map<number, vscode.TextToSpeechSession>();

	constructor(
		mainContext: IMainContext
	) {
		this.proxy = mainContext.getProxy(MainContext.MainThreadSpeech);
	}

	async $createSpeechToTextSession(handle: number, session: number, language?: string): Promise<void> {
		const provider = this.providers.get(handle);
		if (!provider) {
			return;
		}

		const disposables = new DisposableStore();

		const cts = new CancellationTokenSource();
		this.sessions.set(session, cts);

		const speechToTextSession = await provider.provideSpeechToTextSession(cts.token, language ? { language } : undefined);
		if (!speechToTextSession) {
			return;
		}

		disposables.add(speechToTextSession.onDidChange(e => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			this.proxy.$emitSpeechToTextEvent(session, e);
		}));

		disposables.add(cts.token.onCancellationRequested(() => disposables.dispose()));
	}

	async $cancelSpeechToTextSession(session: number): Promise<void> {
		this.sessions.get(session)?.dispose(true);
		this.sessions.delete(session);
	}

	async $createTextToSpeechSession(handle: number, session: number, language?: string): Promise<void> {
		const provider = this.providers.get(handle);
		if (!provider) {
			return;
		}

		const disposables = new DisposableStore();

		const cts = new CancellationTokenSource();
		this.sessions.set(session, cts);

		const textToSpeech = await provider.provideTextToSpeechSession(cts.token, language ? { language } : undefined);
		if (!textToSpeech) {
			return;
		}

		this.synthesizers.set(session, textToSpeech);

		disposables.add(textToSpeech.onDidChange(e => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			this.proxy.$emitTextToSpeechEvent(session, e);
		}));

		disposables.add(cts.token.onCancellationRequested(() => disposables.dispose()));
	}

	async $synthesizeSpeech(session: number, text: string): Promise<void> {
		this.synthesizers.get(session)?.synthesize(text);
	}

	async $cancelTextToSpeechSession(session: number): Promise<void> {
		this.sessions.get(session)?.dispose(true);
		this.sessions.delete(session);
		this.synthesizers.delete(session);
	}

	async $createKeywordRecognitionSession(handle: number, session: number): Promise<void> {
		const provider = this.providers.get(handle);
		if (!provider) {
			return;
		}

		const disposables = new DisposableStore();

		const cts = new CancellationTokenSource();
		this.sessions.set(session, cts);

		const keywordRecognitionSession = await provider.provideKeywordRecognitionSession(cts.token);
		if (!keywordRecognitionSession) {
			return;
		}

		disposables.add(keywordRecognitionSession.onDidChange(e => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			this.proxy.$emitKeywordRecognitionEvent(session, e);
		}));

		disposables.add(cts.token.onCancellationRequested(() => disposables.dispose()));
	}

	async $cancelKeywordRecognitionSession(session: number): Promise<void> {
		this.sessions.get(session)?.dispose(true);
		this.sessions.delete(session);
	}

	registerProvider(extension: ExtensionIdentifier, identifier: string, provider: vscode.SpeechProvider): IDisposable {
		const handle = ExtHostSpeech.ID_POOL++;

		this.providers.set(handle, provider);
		this.proxy.$registerProvider(handle, identifier, { extension, displayName: extension.value });

		return toDisposable(() => {
			this.proxy.$unregisterProvider(handle);
			this.providers.delete(handle);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostStatusBar.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostStatusBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { StatusBarAlignment as ExtHostStatusBarAlignment, Disposable, ThemeColor, asStatusBarItemIdentifier } from './extHostTypes.js';
import type * as vscode from 'vscode';
import { MainContext, MainThreadStatusBarShape, IMainContext, ICommandDto, ExtHostStatusBarShape, StatusBarItemDto } from './extHost.protocol.js';
import { localize } from '../../../nls.js';
import { CommandsConverter } from './extHostCommands.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { MarkdownString } from './extHostTypeConverters.js';
import { isNumber } from '../../../base/common/types.js';
import * as htmlContent from '../../../base/common/htmlContent.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';


export class ExtHostStatusBarEntry implements vscode.StatusBarItem {

	private static ID_GEN = 0;

	private static ALLOWED_BACKGROUND_COLORS = new Map<string, ThemeColor>(
		[
			['statusBarItem.errorBackground', new ThemeColor('statusBarItem.errorForeground')],
			['statusBarItem.warningBackground', new ThemeColor('statusBarItem.warningForeground')]
		]
	);

	#proxy: MainThreadStatusBarShape;
	#commands: CommandsConverter;

	private readonly _entryId: string;

	private _extension?: IExtensionDescription;

	private _id?: string;
	private _alignment: number;
	private _priority?: number;

	private _disposed: boolean = false;
	private _visible?: boolean;

	private _text: string = '';
	private _tooltip?: string | vscode.MarkdownString;
	private _tooltip2?: string | vscode.MarkdownString | undefined | ((token: vscode.CancellationToken) => Promise<string | vscode.MarkdownString | undefined>);
	private _name?: string;
	private _color?: string | ThemeColor;
	private _backgroundColor?: ThemeColor;
	// eslint-disable-next-line local/code-no-potentially-unsafe-disposables
	private _latestCommandRegistration?: DisposableStore;
	private readonly _staleCommandRegistrations = new DisposableStore();
	private _command?: {
		readonly fromApi: string | vscode.Command;
		readonly internal: ICommandDto;
	};

	private _timeoutHandle: Timeout | undefined;
	private _accessibilityInformation?: vscode.AccessibilityInformation;

	constructor(proxy: MainThreadStatusBarShape, commands: CommandsConverter, staticItems: ReadonlyMap<string, StatusBarItemDto>, extension: IExtensionDescription, id?: string, alignment?: ExtHostStatusBarAlignment, priority?: number, _onDispose?: () => void);
	constructor(proxy: MainThreadStatusBarShape, commands: CommandsConverter, staticItems: ReadonlyMap<string, StatusBarItemDto>, extension: IExtensionDescription | undefined, id: string, alignment?: ExtHostStatusBarAlignment, priority?: number, _onDispose?: () => void);
	constructor(proxy: MainThreadStatusBarShape, commands: CommandsConverter, staticItems: ReadonlyMap<string, StatusBarItemDto>, extension?: IExtensionDescription, id?: string, alignment: ExtHostStatusBarAlignment = ExtHostStatusBarAlignment.Left, priority?: number, private _onDispose?: () => void) {
		this.#proxy = proxy;
		this.#commands = commands;

		if (id && extension) {
			this._entryId = asStatusBarItemIdentifier(extension.identifier, id);
			// if new item already exists mark it as visible and copy properties
			// this can only happen when an item was contributed by an extension
			const item = staticItems.get(this._entryId);
			if (item) {
				alignment = item.alignLeft ? ExtHostStatusBarAlignment.Left : ExtHostStatusBarAlignment.Right;
				priority = item.priority;
				this._visible = true;
				this.name = item.name;
				this.text = item.text;
				this.tooltip = item.tooltip;
				this.command = item.command;
				this.accessibilityInformation = item.accessibilityInformation;
			}
		} else {
			this._entryId = String(ExtHostStatusBarEntry.ID_GEN++);
		}
		this._extension = extension;

		this._id = id;
		this._alignment = alignment;
		this._priority = this.validatePriority(priority);
	}

	private validatePriority(priority?: number): number | undefined {
		if (!isNumber(priority)) {
			return undefined; // using this method to catch `NaN` too!
		}

		// Our RPC mechanism use JSON to serialize data which does
		// not support `Infinity` so we need to fill in the number
		// equivalent as close as possible.
		// https://github.com/microsoft/vscode/issues/133317

		if (priority === Number.POSITIVE_INFINITY) {
			return Number.MAX_VALUE;
		}

		if (priority === Number.NEGATIVE_INFINITY) {
			return -Number.MAX_VALUE;
		}

		return priority;
	}

	public get id(): string {
		return this._id ?? this._extension!.identifier.value;
	}

	public get entryId(): string {
		return this._entryId;
	}

	public get alignment(): vscode.StatusBarAlignment {
		return this._alignment;
	}

	public get priority(): number | undefined {
		return this._priority;
	}

	public get text(): string {
		return this._text;
	}

	public get name(): string | undefined {
		return this._name;
	}

	public get tooltip(): vscode.MarkdownString | string | undefined {
		return this._tooltip;
	}

	public get tooltip2(): vscode.MarkdownString | string | undefined | ((token: vscode.CancellationToken) => Promise<vscode.MarkdownString | string | undefined>) {
		if (this._extension) {
			checkProposedApiEnabled(this._extension, 'statusBarItemTooltip');
		}

		return this._tooltip2;
	}

	public get color(): string | ThemeColor | undefined {
		return this._color;
	}

	public get backgroundColor(): ThemeColor | undefined {
		return this._backgroundColor;
	}

	public get command(): string | vscode.Command | undefined {
		return this._command?.fromApi;
	}

	public get accessibilityInformation(): vscode.AccessibilityInformation | undefined {
		return this._accessibilityInformation;
	}

	public set text(text: string) {
		this._text = text;
		this.update();
	}

	public set name(name: string | undefined) {
		this._name = name;
		this.update();
	}

	public set tooltip(tooltip: vscode.MarkdownString | string | undefined) {
		this._tooltip = tooltip;
		this.update();
	}

	public set tooltip2(tooltip: vscode.MarkdownString | string | undefined | ((token: vscode.CancellationToken) => Promise<vscode.MarkdownString | string | undefined>)) {
		if (this._extension) {
			checkProposedApiEnabled(this._extension, 'statusBarItemTooltip');
		}

		this._tooltip2 = tooltip;
		this.update();
	}

	public set color(color: string | ThemeColor | undefined) {
		this._color = color;
		this.update();
	}

	public set backgroundColor(color: ThemeColor | undefined) {
		if (color && !ExtHostStatusBarEntry.ALLOWED_BACKGROUND_COLORS.has(color.id)) {
			color = undefined;
		}

		this._backgroundColor = color;
		this.update();
	}

	public set command(command: string | vscode.Command | undefined) {
		if (this._command?.fromApi === command) {
			return;
		}

		if (this._latestCommandRegistration) {
			this._staleCommandRegistrations.add(this._latestCommandRegistration);
		}
		this._latestCommandRegistration = new DisposableStore();
		if (typeof command === 'string') {
			this._command = {
				fromApi: command,
				internal: this.#commands.toInternal({ title: '', command }, this._latestCommandRegistration),
			};
		} else if (command) {
			this._command = {
				fromApi: command,
				internal: this.#commands.toInternal(command, this._latestCommandRegistration),
			};
		} else {
			this._command = undefined;
		}
		this.update();
	}

	public set accessibilityInformation(accessibilityInformation: vscode.AccessibilityInformation | undefined) {
		this._accessibilityInformation = accessibilityInformation;
		this.update();
	}

	public show(): void {
		this._visible = true;
		this.update();
	}

	public hide(): void {
		clearTimeout(this._timeoutHandle);
		this._visible = false;
		this.#proxy.$disposeEntry(this._entryId);
	}

	private update(): void {
		if (this._disposed || !this._visible) {
			return;
		}

		clearTimeout(this._timeoutHandle);

		// Defer the update so that multiple changes to setters dont cause a redraw each
		this._timeoutHandle = setTimeout(() => {
			this._timeoutHandle = undefined;

			// If the id is not set, derive it from the extension identifier,
			// otherwise make sure to prefix it with the extension identifier
			// to get a more unique value across extensions.
			let id: string;
			if (this._extension) {
				if (this._id) {
					id = `${this._extension.identifier.value}.${this._id}`;
				} else {
					id = this._extension.identifier.value;
				}
			} else {
				id = this._id!;
			}

			// If the name is not set, derive it from the extension descriptor
			let name: string;
			if (this._name) {
				name = this._name;
			} else {
				name = localize('extensionLabel', "{0} (Extension)", this._extension!.displayName || this._extension!.name);
			}

			// If a background color is set, the foreground is determined
			let color = this._color;
			if (this._backgroundColor) {
				color = ExtHostStatusBarEntry.ALLOWED_BACKGROUND_COLORS.get(this._backgroundColor.id);
			}

			let tooltip: undefined | string | htmlContent.IMarkdownString;
			let hasTooltipProvider: boolean;
			if (typeof this._tooltip2 === 'function') {
				tooltip = MarkdownString.fromStrict(this._tooltip);
				hasTooltipProvider = true;
			} else {
				tooltip = MarkdownString.fromStrict(this._tooltip2 ?? this._tooltip);
				hasTooltipProvider = false;
			}

			// Set to status bar
			this.#proxy.$setEntry(this._entryId, id, this._extension?.identifier.value, name, this._text, tooltip, hasTooltipProvider, this._command?.internal, color,
				this._backgroundColor, this._alignment === ExtHostStatusBarAlignment.Left,
				this._priority, this._accessibilityInformation);

			// clean-up state commands _after_ updating the UI
			this._staleCommandRegistrations.clear();
		}, 0);
	}

	public dispose(): void {
		this.hide();
		this._onDispose?.();
		this._disposed = true;
	}
}

class StatusBarMessage {

	private readonly _item: vscode.StatusBarItem;
	private readonly _messages: { message: string }[] = [];

	constructor(statusBar: ExtHostStatusBar) {
		this._item = statusBar.createStatusBarEntry(undefined, 'status.extensionMessage', ExtHostStatusBarAlignment.Left, Number.MIN_VALUE);
		this._item.name = localize('status.extensionMessage', "Extension Status");
	}

	dispose() {
		this._messages.length = 0;
		this._item.dispose();
	}

	setMessage(message: string): Disposable {
		const data: { message: string } = { message }; // use object to not confuse equal strings
		this._messages.unshift(data);
		this._update();

		return new Disposable(() => {
			const idx = this._messages.indexOf(data);
			if (idx >= 0) {
				this._messages.splice(idx, 1);
				this._update();
			}
		});
	}

	private _update() {
		if (this._messages.length > 0) {
			this._item.text = this._messages[0].message;
			this._item.show();
		} else {
			this._item.hide();
		}
	}
}

export class ExtHostStatusBar implements ExtHostStatusBarShape {

	private readonly _proxy: MainThreadStatusBarShape;
	private readonly _commands: CommandsConverter;
	private readonly _statusMessage: StatusBarMessage;
	private readonly _entries = new Map<string, ExtHostStatusBarEntry>();
	private readonly _existingItems = new Map<string, StatusBarItemDto>();

	constructor(mainContext: IMainContext, commands: CommandsConverter) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadStatusBar);
		this._commands = commands;
		this._statusMessage = new StatusBarMessage(this);
	}

	$acceptStaticEntries(added: StatusBarItemDto[]): void {
		for (const item of added) {
			this._existingItems.set(item.entryId, item);
		}
	}

	async $provideTooltip(entryId: string, cancellation: vscode.CancellationToken): Promise<string | htmlContent.IMarkdownString | undefined> {
		const entry = this._entries.get(entryId);
		if (!entry) {
			return undefined;
		}

		const tooltip = typeof entry.tooltip2 === 'function' ? await entry.tooltip2(cancellation) : entry.tooltip2;
		return !cancellation.isCancellationRequested ? MarkdownString.fromStrict(tooltip) : undefined;
	}

	createStatusBarEntry(extension: IExtensionDescription | undefined, id: string, alignment?: ExtHostStatusBarAlignment, priority?: number): vscode.StatusBarItem;
	createStatusBarEntry(extension: IExtensionDescription, id?: string, alignment?: ExtHostStatusBarAlignment, priority?: number): vscode.StatusBarItem;
	createStatusBarEntry(extension: IExtensionDescription, id: string, alignment?: ExtHostStatusBarAlignment, priority?: number): vscode.StatusBarItem {
		const entry = new ExtHostStatusBarEntry(this._proxy, this._commands, this._existingItems, extension, id, alignment, priority, () => this._entries.delete(entry.entryId));
		this._entries.set(entry.entryId, entry);

		return entry;
	}

	setStatusBarMessage(text: string, timeoutOrThenable?: number | Thenable<any>): Disposable {
		const d = this._statusMessage.setMessage(text);
		let handle: Timeout | undefined;

		if (typeof timeoutOrThenable === 'number') {
			handle = setTimeout(() => d.dispose(), timeoutOrThenable);
		} else if (typeof timeoutOrThenable !== 'undefined') {
			timeoutOrThenable.then(() => d.dispose(), () => d.dispose());
		}

		return new Disposable(() => {
			d.dispose();
			clearTimeout(handle);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostStorage.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadStorageShape, ExtHostStorageShape } from './extHost.protocol.js';
import { Emitter } from '../../../base/common/event.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtensionIdWithVersion } from '../../../platform/extensionManagement/common/extensionStorage.js';
import { ILogService } from '../../../platform/log/common/log.js';

export interface IStorageChangeEvent {
	shared: boolean;
	key: string;
	value: object;
}

export class ExtHostStorage implements ExtHostStorageShape {

	readonly _serviceBrand: undefined;

	private _proxy: MainThreadStorageShape;

	private readonly _onDidChangeStorage = new Emitter<IStorageChangeEvent>();
	readonly onDidChangeStorage = this._onDidChangeStorage.event;

	constructor(
		mainContext: IExtHostRpcService,
		private readonly _logService: ILogService
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadStorage);
	}

	registerExtensionStorageKeysToSync(extension: IExtensionIdWithVersion, keys: string[]): void {
		this._proxy.$registerExtensionStorageKeysToSync(extension, keys);
	}

	async initializeExtensionStorage(shared: boolean, key: string, defaultValue?: object): Promise<object | undefined> {
		const value = await this._proxy.$initializeExtensionStorage(shared, key);

		let parsedValue: object | undefined;
		if (value) {
			parsedValue = this.safeParseValue(shared, key, value);
		}

		return parsedValue || defaultValue;
	}

	setValue(shared: boolean, key: string, value: object): Promise<void> {
		return this._proxy.$setValue(shared, key, value);
	}

	$acceptValue(shared: boolean, key: string, value: string): void {
		const parsedValue = this.safeParseValue(shared, key, value);
		if (parsedValue) {
			this._onDidChangeStorage.fire({ shared, key, value: parsedValue });
		}
	}

	private safeParseValue(shared: boolean, key: string, value: string): object | undefined {
		try {
			return JSON.parse(value);
		} catch (error) {
			// Do not fail this call but log it for diagnostics
			// https://github.com/microsoft/vscode/issues/132777
			this._logService.error(`[extHostStorage] unexpected error parsing storage contents (extensionId: ${key}, global: ${shared}): ${error}`);
		}

		return undefined;
	}
}

export interface IExtHostStorage extends ExtHostStorage { }
export const IExtHostStorage = createDecorator<IExtHostStorage>('IExtHostStorage');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostStoragePaths.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostStoragePaths.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IEnvironment, IStaticWorkspaceData } from '../../services/extensions/common/extensionHostProtocol.js';
import { IExtHostConsumerFileSystem } from './extHostFileSystemConsumer.js';
import { URI } from '../../../base/common/uri.js';

export const IExtensionStoragePaths = createDecorator<IExtensionStoragePaths>('IExtensionStoragePaths');

export interface IExtensionStoragePaths {
	readonly _serviceBrand: undefined;
	whenReady: Promise<any>;
	workspaceValue(extension: IExtensionDescription): URI | undefined;
	globalValue(extension: IExtensionDescription): URI;
	onWillDeactivateAll(): void;
}

export class ExtensionStoragePaths implements IExtensionStoragePaths {

	readonly _serviceBrand: undefined;

	private readonly _workspace?: IStaticWorkspaceData;
	protected readonly _environment: IEnvironment;

	readonly whenReady: Promise<URI | undefined>;
	private _value?: URI;

	constructor(
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@ILogService protected readonly _logService: ILogService,
		@IExtHostConsumerFileSystem private readonly _extHostFileSystem: IExtHostConsumerFileSystem
	) {
		this._workspace = initData.workspace ?? undefined;
		this._environment = initData.environment;
		this.whenReady = this._getOrCreateWorkspaceStoragePath().then(value => this._value = value);
	}

	protected async _getWorkspaceStorageURI(storageName: string): Promise<URI> {
		return URI.joinPath(this._environment.workspaceStorageHome, storageName);
	}

	private async _getOrCreateWorkspaceStoragePath(): Promise<URI | undefined> {
		if (!this._workspace) {
			return Promise.resolve(undefined);
		}
		const storageName = this._workspace.id;
		const storageUri = await this._getWorkspaceStorageURI(storageName);

		try {
			await this._extHostFileSystem.value.stat(storageUri);
			this._logService.trace('[ExtHostStorage] storage dir already exists', storageUri);
			return storageUri;
		} catch {
			// doesn't exist, that's OK
		}

		try {
			this._logService.trace('[ExtHostStorage] creating dir and metadata-file', storageUri);
			await this._extHostFileSystem.value.createDirectory(storageUri);
			await this._extHostFileSystem.value.writeFile(
				URI.joinPath(storageUri, 'meta.json'),
				new TextEncoder().encode(JSON.stringify({
					id: this._workspace.id,
					configuration: URI.revive(this._workspace.configuration)?.toString(),
					name: this._workspace.name
				}, undefined, 2))
			);
			return storageUri;

		} catch (e) {
			this._logService.error('[ExtHostStorage]', e);
			return undefined;
		}
	}

	workspaceValue(extension: IExtensionDescription): URI | undefined {
		if (this._value) {
			return URI.joinPath(this._value, extension.identifier.value);
		}
		return undefined;
	}

	globalValue(extension: IExtensionDescription): URI {
		return URI.joinPath(this._environment.globalStorageHome, extension.identifier.value.toLowerCase());
	}

	onWillDeactivateAll(): void {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTask.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTask.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { URI, UriComponents } from '../../../base/common/uri.js';
import { asPromise } from '../../../base/common/async.js';
import { Event, Emitter } from '../../../base/common/event.js';

import { MainContext, MainThreadTaskShape, ExtHostTaskShape } from './extHost.protocol.js';
import * as types from './extHostTypes.js';
import { IExtHostWorkspaceProvider, IExtHostWorkspace } from './extHostWorkspace.js';
import type * as vscode from 'vscode';
import * as tasks from './shared/tasks.js';
import { IExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { IExtHostConfiguration } from './extHostConfiguration.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { IExtHostTerminalService } from './extHostTerminalService.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { Schemas } from '../../../base/common/network.js';
import * as Platform from '../../../base/common/platform.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IExtHostApiDeprecationService } from './extHostApiDeprecationService.js';
import { USER_TASKS_GROUP_KEY } from '../../contrib/tasks/common/tasks.js';
import { ErrorNoTelemetry, NotSupportedError } from '../../../base/common/errors.js';
import { asArray } from '../../../base/common/arrays.js';
import { ITaskProblemMatcherStartedDto, ITaskProblemMatcherEndedDto } from './shared/tasks.js';

export interface IExtHostTask extends ExtHostTaskShape {

	readonly _serviceBrand: undefined;

	taskExecutions: vscode.TaskExecution[];
	readonly onDidStartTask: Event<vscode.TaskStartEvent>;
	readonly onDidEndTask: Event<vscode.TaskEndEvent>;
	readonly onDidStartTaskProcess: Event<vscode.TaskProcessStartEvent>;
	readonly onDidEndTaskProcess: Event<vscode.TaskProcessEndEvent>;
	readonly onDidStartTaskProblemMatchers: Event<vscode.TaskProblemMatcherStartedEvent>;
	readonly onDidEndTaskProblemMatchers: Event<vscode.TaskProblemMatcherEndedEvent>;

	registerTaskProvider(extension: IExtensionDescription, type: string, provider: vscode.TaskProvider): vscode.Disposable;
	registerTaskSystem(scheme: string, info: tasks.ITaskSystemInfoDTO): void;
	fetchTasks(filter?: vscode.TaskFilter): Promise<vscode.Task[]>;
	executeTask(extension: IExtensionDescription, task: vscode.Task): Promise<vscode.TaskExecution>;
	terminateTask(execution: vscode.TaskExecution): Promise<void>;
}

namespace TaskDefinitionDTO {
	export function from(value: vscode.TaskDefinition): tasks.ITaskDefinitionDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
	export function to(value: tasks.ITaskDefinitionDTO): vscode.TaskDefinition | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
}

namespace TaskPresentationOptionsDTO {
	export function from(value: vscode.TaskPresentationOptions): tasks.ITaskPresentationOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
	export function to(value: tasks.ITaskPresentationOptionsDTO): vscode.TaskPresentationOptions | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
}

namespace ProcessExecutionOptionsDTO {
	export function from(value: vscode.ProcessExecutionOptions): tasks.IProcessExecutionOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
	export function to(value: tasks.IProcessExecutionOptionsDTO): vscode.ProcessExecutionOptions | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
}

namespace ProcessExecutionDTO {
	export function is(value: tasks.IShellExecutionDTO | tasks.IProcessExecutionDTO | tasks.ICustomExecutionDTO | undefined): value is tasks.IProcessExecutionDTO {
		if (value) {
			const candidate = value as tasks.IProcessExecutionDTO;
			return candidate && !!candidate.process;
		} else {
			return false;
		}
	}
	export function from(value: vscode.ProcessExecution): tasks.IProcessExecutionDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		const result: tasks.IProcessExecutionDTO = {
			process: value.process,
			args: value.args
		};
		if (value.options) {
			result.options = ProcessExecutionOptionsDTO.from(value.options);
		}
		return result;
	}
	export function to(value: tasks.IProcessExecutionDTO): types.ProcessExecution | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return new types.ProcessExecution(value.process, value.args, value.options);
	}
}

namespace ShellExecutionOptionsDTO {
	export function from(value: vscode.ShellExecutionOptions): tasks.IShellExecutionOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
	export function to(value: tasks.IShellExecutionOptionsDTO): vscode.ShellExecutionOptions | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return value;
	}
}

namespace ShellExecutionDTO {
	export function is(value: tasks.IShellExecutionDTO | tasks.IProcessExecutionDTO | tasks.ICustomExecutionDTO | undefined): value is tasks.IShellExecutionDTO {
		if (value) {
			const candidate = value as tasks.IShellExecutionDTO;
			return candidate && (!!candidate.commandLine || !!candidate.command);
		} else {
			return false;
		}
	}
	export function from(value: vscode.ShellExecution): tasks.IShellExecutionDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		const result: tasks.IShellExecutionDTO = {
		};
		if (value.commandLine !== undefined) {
			result.commandLine = value.commandLine;
		} else {
			result.command = value.command;
			result.args = value.args;
		}
		if (value.options) {
			result.options = ShellExecutionOptionsDTO.from(value.options);
		}
		return result;
	}
	export function to(value: tasks.IShellExecutionDTO): types.ShellExecution | undefined {
		if (value === undefined || value === null || (value.command === undefined && value.commandLine === undefined)) {
			return undefined;
		}
		if (value.commandLine) {
			return new types.ShellExecution(value.commandLine, value.options);
		} else {
			return new types.ShellExecution(value.command!, value.args ? value.args : [], value.options);
		}
	}
}

export namespace CustomExecutionDTO {
	export function is(value: tasks.IShellExecutionDTO | tasks.IProcessExecutionDTO | tasks.ICustomExecutionDTO | undefined): value is tasks.ICustomExecutionDTO {
		if (value) {
			const candidate = value as tasks.ICustomExecutionDTO;
			return candidate && candidate.customExecution === 'customExecution';
		} else {
			return false;
		}
	}

	export function from(value: vscode.CustomExecution): tasks.ICustomExecutionDTO {
		return {
			customExecution: 'customExecution'
		};
	}

	export function to(taskId: string, providedCustomExeutions: Map<string, types.CustomExecution>): types.CustomExecution | undefined {
		return providedCustomExeutions.get(taskId);
	}
}


export namespace TaskHandleDTO {
	export function from(value: types.Task, workspaceService?: IExtHostWorkspace): tasks.ITaskHandleDTO {
		let folder: UriComponents | string;
		if (value.scope !== undefined && typeof value.scope !== 'number') {
			folder = value.scope.uri;
		} else if (value.scope !== undefined && typeof value.scope === 'number') {
			if ((value.scope === types.TaskScope.Workspace) && workspaceService && workspaceService.workspaceFile) {
				folder = workspaceService.workspaceFile;
			} else {
				folder = USER_TASKS_GROUP_KEY;
			}
		}
		return {
			id: value._id!,
			workspaceFolder: folder!
		};
	}
}
namespace TaskGroupDTO {
	export function from(value: vscode.TaskGroup): tasks.ITaskGroupDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return { _id: value.id, isDefault: value.isDefault };
	}
}

export namespace TaskDTO {
	export function fromMany(tasks: vscode.Task[], extension: IExtensionDescription): tasks.ITaskDTO[] {
		if (tasks === undefined || tasks === null) {
			return [];
		}
		const result: tasks.ITaskDTO[] = [];
		for (const task of tasks) {
			const converted = from(task, extension);
			if (converted) {
				result.push(converted);
			}
		}
		return result;
	}

	export function from(value: vscode.Task, extension: IExtensionDescription): tasks.ITaskDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		let execution: tasks.IShellExecutionDTO | tasks.IProcessExecutionDTO | tasks.ICustomExecutionDTO | undefined;
		if (value.execution instanceof types.ProcessExecution) {
			execution = ProcessExecutionDTO.from(value.execution);
		} else if (value.execution instanceof types.ShellExecution) {
			execution = ShellExecutionDTO.from(value.execution);
		} else if (value.execution && value.execution instanceof types.CustomExecution) {
			execution = CustomExecutionDTO.from(<types.CustomExecution>value.execution);
		}

		const definition: tasks.ITaskDefinitionDTO | undefined = TaskDefinitionDTO.from(value.definition);
		let scope: number | UriComponents;
		if (value.scope) {
			if (typeof value.scope === 'number') {
				scope = value.scope;
			} else {
				scope = value.scope.uri;
			}
		} else {
			// To continue to support the deprecated task constructor that doesn't take a scope, we must add a scope here:
			scope = types.TaskScope.Workspace;
		}
		if (!definition || !scope) {
			return undefined;
		}
		const result: tasks.ITaskDTO = {
			_id: (value as types.Task)._id!,
			definition,
			name: value.name,
			source: {
				extensionId: extension.identifier.value,
				label: value.source,
				scope: scope
			},
			execution: execution!,
			isBackground: value.isBackground,
			group: TaskGroupDTO.from(value.group as vscode.TaskGroup),
			presentationOptions: TaskPresentationOptionsDTO.from(value.presentationOptions),
			problemMatchers: asArray(value.problemMatchers),
			hasDefinedMatchers: (value as types.Task).hasDefinedMatchers,
			runOptions: value.runOptions ? value.runOptions : { reevaluateOnRerun: true },
			detail: value.detail
		};
		return result;
	}
	export async function to(value: tasks.ITaskDTO | undefined, workspace: IExtHostWorkspaceProvider, providedCustomExeutions: Map<string, types.CustomExecution>): Promise<types.Task | undefined> {
		if (value === undefined || value === null) {
			return undefined;
		}
		let execution: types.ShellExecution | types.ProcessExecution | types.CustomExecution | undefined;
		if (ProcessExecutionDTO.is(value.execution)) {
			execution = ProcessExecutionDTO.to(value.execution);
		} else if (ShellExecutionDTO.is(value.execution)) {
			execution = ShellExecutionDTO.to(value.execution);
		} else if (CustomExecutionDTO.is(value.execution)) {
			execution = CustomExecutionDTO.to(value._id, providedCustomExeutions);
		}
		const definition: vscode.TaskDefinition | undefined = TaskDefinitionDTO.to(value.definition);
		let scope: vscode.TaskScope.Global | vscode.TaskScope.Workspace | vscode.WorkspaceFolder | undefined;
		if (value.source) {
			if (value.source.scope !== undefined) {
				if (typeof value.source.scope === 'number') {
					scope = value.source.scope;
				} else {
					scope = await workspace.resolveWorkspaceFolder(URI.revive(value.source.scope));
				}
			} else {
				scope = types.TaskScope.Workspace;
			}
		}
		if (!definition || !scope) {
			return undefined;
		}
		const result = new types.Task(definition, scope, value.name!, value.source.label, execution, value.problemMatchers);
		if (value.isBackground !== undefined) {
			result.isBackground = value.isBackground;
		}
		if (value.group !== undefined) {
			result.group = types.TaskGroup.from(value.group._id);
			if (result.group && value.group.isDefault) {
				result.group = new types.TaskGroup(result.group.id, result.group.label);
				if (value.group.isDefault === true) {
					result.group.isDefault = value.group.isDefault;
				}
			}
		}
		if (value.presentationOptions) {
			result.presentationOptions = TaskPresentationOptionsDTO.to(value.presentationOptions)!;
		}
		if (value._id) {
			result._id = value._id;
		}
		if (value.detail) {
			result.detail = value.detail;
		}
		return result;
	}
}

namespace TaskFilterDTO {
	export function from(value: vscode.TaskFilter | undefined): tasks.ITaskFilterDTO | undefined {
		return value;
	}

	export function to(value: tasks.ITaskFilterDTO): vscode.TaskFilter | undefined {
		if (!value) {
			return undefined;
		}
		return Object.assign(Object.create(null), value);
	}
}

class TaskExecutionImpl implements vscode.TaskExecution {

	readonly #tasks: ExtHostTaskBase;
	private _terminal: vscode.Terminal | undefined;

	constructor(tasks: ExtHostTaskBase, readonly _id: string, private readonly _task: vscode.Task) {
		this.#tasks = tasks;
	}

	public get task(): vscode.Task {
		return this._task;
	}

	public terminate(): void {
		this.#tasks.terminateTask(this);
	}

	public fireDidStartProcess(value: tasks.ITaskProcessStartedDTO): void {
	}

	public fireDidEndProcess(value: tasks.ITaskProcessEndedDTO): void {
	}

	public get terminal(): vscode.Terminal | undefined {
		return this._terminal;
	}

	public set terminal(term: vscode.Terminal | undefined) {
		this._terminal = term;
	}
}

export interface HandlerData {
	type: string;
	provider: vscode.TaskProvider;
	extension: IExtensionDescription;
}

export abstract class ExtHostTaskBase implements ExtHostTaskShape, IExtHostTask {
	readonly _serviceBrand: undefined;

	protected readonly _proxy: MainThreadTaskShape;
	protected readonly _workspaceProvider: IExtHostWorkspaceProvider;
	protected readonly _editorService: IExtHostDocumentsAndEditors;
	protected readonly _configurationService: IExtHostConfiguration;
	protected readonly _terminalService: IExtHostTerminalService;
	protected readonly _logService: ILogService;
	protected readonly _deprecationService: IExtHostApiDeprecationService;
	protected _handleCounter: number;
	protected _handlers: Map<number, HandlerData>;
	protected _taskExecutions: Map<string, TaskExecutionImpl>;
	protected _taskExecutionPromises: Map<string, Promise<TaskExecutionImpl>>;
	protected _providedCustomExecutions2: Map<string, types.CustomExecution>;
	private _notProvidedCustomExecutions: Set<string>; // Used for custom executions tasks that are created and run through executeTask.
	protected _activeCustomExecutions2: Map<string, types.CustomExecution>;
	private _lastStartedTask: string | undefined;
	protected readonly _onDidExecuteTask: Emitter<vscode.TaskStartEvent> = new Emitter<vscode.TaskStartEvent>();
	protected readonly _onDidTerminateTask: Emitter<vscode.TaskEndEvent> = new Emitter<vscode.TaskEndEvent>();

	protected readonly _onDidTaskProcessStarted: Emitter<vscode.TaskProcessStartEvent> = new Emitter<vscode.TaskProcessStartEvent>();
	protected readonly _onDidTaskProcessEnded: Emitter<vscode.TaskProcessEndEvent> = new Emitter<vscode.TaskProcessEndEvent>();
	protected readonly _onDidStartTaskProblemMatchers: Emitter<vscode.TaskProblemMatcherStartedEvent> = new Emitter<vscode.TaskProblemMatcherStartedEvent>();
	protected readonly _onDidEndTaskProblemMatchers: Emitter<vscode.TaskProblemMatcherEndedEvent> = new Emitter<vscode.TaskProblemMatcherEndedEvent>();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtHostWorkspace workspaceService: IExtHostWorkspace,
		@IExtHostDocumentsAndEditors editorService: IExtHostDocumentsAndEditors,
		@IExtHostConfiguration configurationService: IExtHostConfiguration,
		@IExtHostTerminalService extHostTerminalService: IExtHostTerminalService,
		@ILogService logService: ILogService,
		@IExtHostApiDeprecationService deprecationService: IExtHostApiDeprecationService
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadTask);
		this._workspaceProvider = workspaceService;
		this._editorService = editorService;
		this._configurationService = configurationService;
		this._terminalService = extHostTerminalService;
		this._handleCounter = 0;
		this._handlers = new Map<number, HandlerData>();
		this._taskExecutions = new Map<string, TaskExecutionImpl>();
		this._taskExecutionPromises = new Map<string, Promise<TaskExecutionImpl>>();
		this._providedCustomExecutions2 = new Map<string, types.CustomExecution>();
		this._notProvidedCustomExecutions = new Set<string>();
		this._activeCustomExecutions2 = new Map<string, types.CustomExecution>();
		this._logService = logService;
		this._deprecationService = deprecationService;
		this._proxy.$registerSupportedExecutions(true);
	}

	public registerTaskProvider(extension: IExtensionDescription, type: string, provider: vscode.TaskProvider): vscode.Disposable {
		if (!provider) {
			return new types.Disposable(() => { });
		}
		const handle = this.nextHandle();
		this._handlers.set(handle, { type, provider, extension });
		this._proxy.$registerTaskProvider(handle, type);
		return new types.Disposable(() => {
			this._handlers.delete(handle);
			this._proxy.$unregisterTaskProvider(handle);
		});
	}

	public registerTaskSystem(scheme: string, info: tasks.ITaskSystemInfoDTO): void {
		this._proxy.$registerTaskSystem(scheme, info);
	}

	public fetchTasks(filter?: vscode.TaskFilter): Promise<vscode.Task[]> {
		return this._proxy.$fetchTasks(TaskFilterDTO.from(filter)).then(async (values) => {
			const result: vscode.Task[] = [];
			for (const value of values) {
				const task = await TaskDTO.to(value, this._workspaceProvider, this._providedCustomExecutions2);
				if (task) {
					result.push(task);
				}
			}
			return result;
		});
	}

	public abstract executeTask(extension: IExtensionDescription, task: vscode.Task): Promise<vscode.TaskExecution>;

	public get taskExecutions(): vscode.TaskExecution[] {
		const result: vscode.TaskExecution[] = [];
		this._taskExecutions.forEach(value => result.push(value));
		return result;
	}

	public terminateTask(execution: vscode.TaskExecution): Promise<void> {
		if (!(execution instanceof TaskExecutionImpl)) {
			throw new Error('No valid task execution provided');
		}
		return this._proxy.$terminateTask((execution as TaskExecutionImpl)._id);
	}

	public get onDidStartTask(): Event<vscode.TaskStartEvent> {
		return this._onDidExecuteTask.event;
	}

	public async $onDidStartTask(execution: tasks.ITaskExecutionDTO, terminalId: number, resolvedDefinition: tasks.ITaskDefinitionDTO): Promise<void> {
		const customExecution: types.CustomExecution | undefined = this._providedCustomExecutions2.get(execution.id);
		if (customExecution) {
			// Clone the custom execution to keep the original untouched. This is important for multiple runs of the same task.
			this._activeCustomExecutions2.set(execution.id, customExecution);
			this._terminalService.attachPtyToTerminal(terminalId, await customExecution.callback(resolvedDefinition));
		}
		this._lastStartedTask = execution.id;

		const taskExecution = await this.getTaskExecution(execution);
		const terminal = this._terminalService.getTerminalById(terminalId)?.value;
		if (taskExecution) {
			taskExecution.terminal = terminal;
		}

		this._onDidExecuteTask.fire({
			execution: taskExecution
		});
	}

	public get onDidEndTask(): Event<vscode.TaskEndEvent> {
		return this._onDidTerminateTask.event;
	}

	public async $OnDidEndTask(execution: tasks.ITaskExecutionDTO): Promise<void> {
		if (!this._taskExecutionPromises.has(execution.id)) {
			// Event already fired by the main thread
			// See https://github.com/microsoft/vscode/commit/aaf73920aeae171096d205efb2c58804a32b6846
			return;
		}
		const _execution = await this.getTaskExecution(execution);
		this._taskExecutionPromises.delete(execution.id);
		this._taskExecutions.delete(execution.id);
		this.customExecutionComplete(execution);
		this._onDidTerminateTask.fire({
			execution: _execution
		});
	}

	public get onDidStartTaskProcess(): Event<vscode.TaskProcessStartEvent> {
		return this._onDidTaskProcessStarted.event;
	}

	public async $onDidStartTaskProcess(value: tasks.ITaskProcessStartedDTO): Promise<void> {
		const execution = await this.getTaskExecution(value.id);
		this._onDidTaskProcessStarted.fire({
			execution: execution,
			processId: value.processId
		});
	}

	public get onDidEndTaskProcess(): Event<vscode.TaskProcessEndEvent> {
		return this._onDidTaskProcessEnded.event;
	}

	public async $onDidEndTaskProcess(value: tasks.ITaskProcessEndedDTO): Promise<void> {
		const execution = await this.getTaskExecution(value.id);
		this._onDidTaskProcessEnded.fire({
			execution: execution,
			exitCode: value.exitCode
		});
	}

	public get onDidStartTaskProblemMatchers(): Event<vscode.TaskProblemMatcherStartedEvent> {
		return this._onDidStartTaskProblemMatchers.event;
	}

	public async $onDidStartTaskProblemMatchers(value: ITaskProblemMatcherStartedDto): Promise<void> {
		let execution;
		try {
			execution = await this.getTaskExecution(value.execution.id);
		} catch (error) {
			// The task execution is not available anymore
			return;
		}

		this._onDidStartTaskProblemMatchers.fire({ execution });
	}

	public get onDidEndTaskProblemMatchers(): Event<vscode.TaskProblemMatcherEndedEvent> {
		return this._onDidEndTaskProblemMatchers.event;
	}

	public async $onDidEndTaskProblemMatchers(value: ITaskProblemMatcherEndedDto): Promise<void> {
		let execution;
		try {
			execution = await this.getTaskExecution(value.execution.id);
		} catch (error) {
			// The task execution is not available anymore
			return;
		}

		this._onDidEndTaskProblemMatchers.fire({ execution, hasErrors: value.hasErrors });
	}

	protected abstract provideTasksInternal(validTypes: { [key: string]: boolean }, taskIdPromises: Promise<void>[], handler: HandlerData, value: vscode.Task[] | null | undefined): { tasks: tasks.ITaskDTO[]; extension: IExtensionDescription };

	public $provideTasks(handle: number, validTypes: { [key: string]: boolean }): Promise<tasks.ITaskSetDTO> {
		const handler = this._handlers.get(handle);
		if (!handler) {
			return Promise.reject(new Error('no handler found'));
		}

		// Set up a list of task ID promises that we can wait on
		// before returning the provided tasks. The ensures that
		// our task IDs are calculated for any custom execution tasks.
		// Knowing this ID ahead of time is needed because when a task
		// start event is fired this is when the custom execution is called.
		// The task start event is also the first time we see the ID from the main
		// thread, which is too late for us because we need to save an map
		// from an ID to the custom execution function. (Kind of a cart before the horse problem).
		const taskIdPromises: Promise<void>[] = [];
		const fetchPromise = asPromise(() => handler.provider.provideTasks(CancellationToken.None)).then(value => {
			return this.provideTasksInternal(validTypes, taskIdPromises, handler, value);
		});

		return new Promise((resolve) => {
			fetchPromise.then((result) => {
				Promise.all(taskIdPromises).then(() => {
					resolve(result);
				});
			});
		});
	}

	protected abstract resolveTaskInternal(resolvedTaskDTO: tasks.ITaskDTO): Promise<tasks.ITaskDTO | undefined>;

	public async $resolveTask(handle: number, taskDTO: tasks.ITaskDTO): Promise<tasks.ITaskDTO | undefined> {
		const handler = this._handlers.get(handle);
		if (!handler) {
			return Promise.reject(new Error('no handler found'));
		}

		if (taskDTO.definition.type !== handler.type) {
			throw new Error(`Unexpected: Task of type [${taskDTO.definition.type}] cannot be resolved by provider of type [${handler.type}].`);
		}

		const task = await TaskDTO.to(taskDTO, this._workspaceProvider, this._providedCustomExecutions2);
		if (!task) {
			throw new Error('Unexpected: Task cannot be resolved.');
		}

		const resolvedTask = await handler.provider.resolveTask(task, CancellationToken.None);
		if (!resolvedTask) {
			return;
		}

		this.checkDeprecation(resolvedTask, handler);

		const resolvedTaskDTO: tasks.ITaskDTO | undefined = TaskDTO.from(resolvedTask, handler.extension);
		if (!resolvedTaskDTO) {
			throw new Error('Unexpected: Task cannot be resolved.');
		}

		if (resolvedTask.definition !== task.definition) {
			throw new Error('Unexpected: The resolved task definition must be the same object as the original task definition. The task definition cannot be changed.');
		}

		if (CustomExecutionDTO.is(resolvedTaskDTO.execution)) {
			await this.addCustomExecution(resolvedTaskDTO, resolvedTask, true);
		}

		return await this.resolveTaskInternal(resolvedTaskDTO);
	}

	public abstract $resolveVariables(uriComponents: UriComponents, toResolve: { process?: { name: string; cwd?: string; path?: string }; variables: string[] }): Promise<{ process?: string; variables: { [key: string]: string } }>;

	private nextHandle(): number {
		return this._handleCounter++;
	}

	protected async addCustomExecution(taskDTO: tasks.ITaskDTO, task: vscode.Task, isProvided: boolean): Promise<void> {
		const taskId = await this._proxy.$createTaskId(taskDTO);
		if (!isProvided && !this._providedCustomExecutions2.has(taskId)) {
			this._notProvidedCustomExecutions.add(taskId);
			// Also add to active executions when not coming from a provider to prevent timing issue.
			this._activeCustomExecutions2.set(taskId, <types.CustomExecution>task.execution);
		}
		this._providedCustomExecutions2.set(taskId, <types.CustomExecution>task.execution);
	}

	protected async getTaskExecution(execution: tasks.ITaskExecutionDTO | string, task?: vscode.Task): Promise<TaskExecutionImpl> {
		if (typeof execution === 'string') {
			const taskExecution = this._taskExecutionPromises.get(execution);
			if (!taskExecution) {
				throw new ErrorNoTelemetry('Unexpected: The specified task is missing an execution');
			}
			return taskExecution;
		}

		const result: Promise<TaskExecutionImpl> | undefined = this._taskExecutionPromises.get(execution.id);
		if (result) {
			return result;
		}

		let executionPromise: Promise<TaskExecutionImpl>;
		if (!task) {
			executionPromise = TaskDTO.to(execution.task, this._workspaceProvider, this._providedCustomExecutions2).then(t => {
				if (!t) {
					throw new ErrorNoTelemetry('Unexpected: Task does not exist.');
				}
				return new TaskExecutionImpl(this, execution.id, t);
			});
		} else {
			executionPromise = Promise.resolve(new TaskExecutionImpl(this, execution.id, task));
		}
		this._taskExecutionPromises.set(execution.id, executionPromise);
		return executionPromise.then(taskExecution => {
			this._taskExecutions.set(execution.id, taskExecution);
			return taskExecution;
		});
	}

	protected checkDeprecation(task: vscode.Task, handler: HandlerData) {
		const tTask = (task as types.Task);
		if (tTask._deprecated) {
			this._deprecationService.report('Task.constructor', handler.extension, 'Use the Task constructor that takes a `scope` instead.');
		}
	}

	private customExecutionComplete(execution: tasks.ITaskExecutionDTO): void {
		const extensionCallback2: vscode.CustomExecution | undefined = this._activeCustomExecutions2.get(execution.id);
		if (extensionCallback2) {
			this._activeCustomExecutions2.delete(execution.id);
		}

		// Technically we don't really need to do this, however, if an extension
		// is executing a task through "executeTask" over and over again
		// with different properties in the task definition, then the map of executions
		// could grow indefinitely, something we don't want.
		if (this._notProvidedCustomExecutions.has(execution.id) && (this._lastStartedTask !== execution.id)) {
			this._providedCustomExecutions2.delete(execution.id);
			this._notProvidedCustomExecutions.delete(execution.id);
		}
		const iterator = this._notProvidedCustomExecutions.values();
		let iteratorResult = iterator.next();
		while (!iteratorResult.done) {
			if (!this._activeCustomExecutions2.has(iteratorResult.value) && (this._lastStartedTask !== iteratorResult.value)) {
				this._providedCustomExecutions2.delete(iteratorResult.value);
				this._notProvidedCustomExecutions.delete(iteratorResult.value);
			}
			iteratorResult = iterator.next();
		}
	}

	public abstract $jsonTasksSupported(): Promise<boolean>;

	public abstract $findExecutable(command: string, cwd?: string | undefined, paths?: string[] | undefined): Promise<string | undefined>;
}

export class WorkerExtHostTask extends ExtHostTaskBase {
	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtHostWorkspace workspaceService: IExtHostWorkspace,
		@IExtHostDocumentsAndEditors editorService: IExtHostDocumentsAndEditors,
		@IExtHostConfiguration configurationService: IExtHostConfiguration,
		@IExtHostTerminalService extHostTerminalService: IExtHostTerminalService,
		@ILogService logService: ILogService,
		@IExtHostApiDeprecationService deprecationService: IExtHostApiDeprecationService
	) {
		super(extHostRpc, initData, workspaceService, editorService, configurationService, extHostTerminalService, logService, deprecationService);
		this.registerTaskSystem(Schemas.vscodeRemote, {
			scheme: Schemas.vscodeRemote,
			authority: '',
			platform: Platform.PlatformToString(Platform.Platform.Web)
		});
	}

	public async executeTask(extension: IExtensionDescription, task: vscode.Task): Promise<vscode.TaskExecution> {
		if (!task.execution) {
			throw new Error('Tasks to execute must include an execution');
		}

		const dto = TaskDTO.from(task, extension);
		if (dto === undefined) {
			throw new Error('Task is not valid');
		}

		// If this task is a custom execution, then we need to save it away
		// in the provided custom execution map that is cleaned up after the
		// task is executed.
		if (CustomExecutionDTO.is(dto.execution)) {
			await this.addCustomExecution(dto, task, false);
		} else {
			throw new NotSupportedError();
		}

		// Always get the task execution first to prevent timing issues when retrieving it later
		const execution = await this.getTaskExecution(await this._proxy.$getTaskExecution(dto), task);
		this._proxy.$executeTask(dto).catch(error => { throw new Error(error); });
		return execution;
	}

	protected provideTasksInternal(validTypes: { [key: string]: boolean }, taskIdPromises: Promise<void>[], handler: HandlerData, value: vscode.Task[] | null | undefined): { tasks: tasks.ITaskDTO[]; extension: IExtensionDescription } {
		const taskDTOs: tasks.ITaskDTO[] = [];
		if (value) {
			for (const task of value) {
				this.checkDeprecation(task, handler);
				if (!task.definition || !validTypes[task.definition.type]) {
					const source = task.source ? task.source : 'No task source';
					this._logService.warn(`The task [${source}, ${task.name}] uses an undefined task type. The task will be ignored in the future.`);
				}

				const taskDTO: tasks.ITaskDTO | undefined = TaskDTO.from(task, handler.extension);
				if (taskDTO && CustomExecutionDTO.is(taskDTO.execution)) {
					taskDTOs.push(taskDTO);
					// The ID is calculated on the main thread task side, so, let's call into it here.
					// We need the task id's pre-computed for custom task executions because when OnDidStartTask
					// is invoked, we have to be able to map it back to our data.
					taskIdPromises.push(this.addCustomExecution(taskDTO, task, true));
				} else {
					this._logService.warn('Only custom execution tasks supported.');
				}
			}
		}
		return {
			tasks: taskDTOs,
			extension: handler.extension
		};
	}

	protected async resolveTaskInternal(resolvedTaskDTO: tasks.ITaskDTO): Promise<tasks.ITaskDTO | undefined> {
		if (CustomExecutionDTO.is(resolvedTaskDTO.execution)) {
			return resolvedTaskDTO;
		} else {
			this._logService.warn('Only custom execution tasks supported.');
		}
		return undefined;
	}

	public async $resolveVariables(uriComponents: UriComponents, toResolve: { process?: { name: string; cwd?: string; path?: string }; variables: string[] }): Promise<{ process?: string; variables: { [key: string]: string } }> {
		const result = {
			process: <unknown>undefined as string,
			variables: Object.create(null)
		};
		return result;
	}

	public async $jsonTasksSupported(): Promise<boolean> {
		return false;
	}

	public async $findExecutable(command: string, cwd?: string | undefined, paths?: string[] | undefined): Promise<string | undefined> {
		return undefined;
	}
}

export const IExtHostTask = createDecorator<IExtHostTask>('IExtHostTask');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTelemetry.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { ExtHostTelemetryShape } from './extHost.protocol.js';
import { ICommonProperties, TelemetryLevel } from '../../../platform/telemetry/common/telemetry.js';
import { ILogger, ILoggerService } from '../../../platform/log/common/log.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { UIKind } from '../../services/extensions/common/extensionHostProtocol.js';
import { getRemoteName } from '../../../platform/remote/common/remoteHosts.js';
import { cleanData, cleanRemoteAuthority, TelemetryLogGroup } from '../../../platform/telemetry/common/telemetryUtils.js';
import { mixin } from '../../../base/common/objects.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';

type ExtHostTelemetryEventData = Record<string, any> & {
	properties?: Record<string, any>;
	measurements?: Record<string, number>;
};

export class ExtHostTelemetry extends Disposable implements ExtHostTelemetryShape {

	readonly _serviceBrand: undefined;

	private readonly _onDidChangeTelemetryEnabled = this._register(new Emitter<boolean>());
	readonly onDidChangeTelemetryEnabled: Event<boolean> = this._onDidChangeTelemetryEnabled.event;

	private readonly _onDidChangeTelemetryConfiguration = this._register(new Emitter<vscode.TelemetryConfiguration>());
	readonly onDidChangeTelemetryConfiguration: Event<vscode.TelemetryConfiguration> = this._onDidChangeTelemetryConfiguration.event;

	private _productConfig: { usage: boolean; error: boolean } = { usage: true, error: true };
	private _level: TelemetryLevel = TelemetryLevel.NONE;
	private _oldTelemetryEnablement: boolean | undefined;
	private readonly _inLoggingOnlyMode: boolean = false;
	private readonly _outputLogger: ILogger;
	private readonly _telemetryLoggers = new Map<string, ExtHostTelemetryLogger[]>();

	constructor(
		isWorker: boolean,
		@IExtHostInitDataService private readonly initData: IExtHostInitDataService,
		@ILoggerService loggerService: ILoggerService,
	) {
		super();
		this._inLoggingOnlyMode = this.initData.environment.isExtensionTelemetryLoggingOnly;
		const id = initData.remote.isRemote ? 'remoteExtHostTelemetry' : isWorker ? 'workerExtHostTelemetry' : 'extHostTelemetry';
		this._outputLogger = this._register(loggerService.createLogger(id,
			{
				name: localize('extensionTelemetryLog', "Extension Telemetry{0}", this._inLoggingOnlyMode ? ' (Not Sent)' : ''),
				hidden: true,
				group: TelemetryLogGroup,
			}));
	}

	getTelemetryConfiguration(): boolean {
		return this._level === TelemetryLevel.USAGE;
	}

	getTelemetryDetails(): vscode.TelemetryConfiguration {
		return {
			isCrashEnabled: this._level >= TelemetryLevel.CRASH,
			isErrorsEnabled: this._productConfig.error ? this._level >= TelemetryLevel.ERROR : false,
			isUsageEnabled: this._productConfig.usage ? this._level >= TelemetryLevel.USAGE : false
		};
	}

	instantiateLogger(extension: IExtensionDescription, sender: vscode.TelemetrySender, options?: vscode.TelemetryLoggerOptions) {
		const telemetryDetails = this.getTelemetryDetails();
		const logger = new ExtHostTelemetryLogger(
			sender,
			options,
			extension,
			this._outputLogger,
			this._inLoggingOnlyMode,
			this.getBuiltInCommonProperties(extension),
			{ isUsageEnabled: telemetryDetails.isUsageEnabled, isErrorsEnabled: telemetryDetails.isErrorsEnabled }
		);
		const loggers = this._telemetryLoggers.get(extension.identifier.value) ?? [];
		this._telemetryLoggers.set(extension.identifier.value, [...loggers, logger]);
		return logger.apiTelemetryLogger;
	}

	$initializeTelemetryLevel(level: TelemetryLevel, supportsTelemetry: boolean, productConfig?: { usage: boolean; error: boolean }): void {
		this._level = level;
		this._productConfig = productConfig ?? { usage: true, error: true };
	}

	getBuiltInCommonProperties(extension: IExtensionDescription): ICommonProperties {
		const commonProperties: ICommonProperties = Object.create(null);
		// TODO @lramos15, does os info like node arch, platform version, etc exist here.
		// Or will first party extensions just mix this in
		commonProperties['common.extname'] = `${extension.publisher}.${extension.name}`;
		commonProperties['common.extversion'] = extension.version;
		commonProperties['common.vscodemachineid'] = this.initData.telemetryInfo.machineId;
		commonProperties['common.vscodesessionid'] = this.initData.telemetryInfo.sessionId;
		commonProperties['common.vscodecommithash'] = this.initData.commit;
		commonProperties['common.sqmid'] = this.initData.telemetryInfo.sqmId;
		commonProperties['common.devDeviceId'] = this.initData.telemetryInfo.devDeviceId ?? this.initData.telemetryInfo.machineId;
		commonProperties['common.vscodeversion'] = this.initData.version;
		commonProperties['common.vscodereleasedate'] = this.initData.date;
		commonProperties['common.isnewappinstall'] = isNewAppInstall(this.initData.telemetryInfo.firstSessionDate);
		commonProperties['common.product'] = this.initData.environment.appHost;

		switch (this.initData.uiKind) {
			case UIKind.Web:
				commonProperties['common.uikind'] = 'web';
				break;
			case UIKind.Desktop:
				commonProperties['common.uikind'] = 'desktop';
				break;
			default:
				commonProperties['common.uikind'] = 'unknown';
		}

		commonProperties['common.remotename'] = getRemoteName(cleanRemoteAuthority(this.initData.remote.authority));

		return commonProperties;
	}

	$onDidChangeTelemetryLevel(level: TelemetryLevel): void {
		this._oldTelemetryEnablement = this.getTelemetryConfiguration();
		this._level = level;
		const telemetryDetails = this.getTelemetryDetails();
		// Remove all disposed loggers
		this._telemetryLoggers.forEach((loggers, key) => {
			const newLoggers = loggers.filter(l => !l.isDisposed);
			if (newLoggers.length === 0) {
				this._telemetryLoggers.delete(key);
			} else {
				this._telemetryLoggers.set(key, newLoggers);
			}
		});
		// Loop through all loggers and update their level
		this._telemetryLoggers.forEach(loggers => {
			for (const logger of loggers) {
				logger.updateTelemetryEnablements(telemetryDetails.isUsageEnabled, telemetryDetails.isErrorsEnabled);
			}
		});

		if (this._oldTelemetryEnablement !== this.getTelemetryConfiguration()) {
			this._onDidChangeTelemetryEnabled.fire(this.getTelemetryConfiguration());
		}
		this._onDidChangeTelemetryConfiguration.fire(this.getTelemetryDetails());
	}

	onExtensionError(extension: ExtensionIdentifier, error: Error): boolean {
		const loggers = this._telemetryLoggers.get(extension.value);
		const nonDisposedLoggers = loggers?.filter(l => !l.isDisposed);
		if (!nonDisposedLoggers) {
			this._telemetryLoggers.delete(extension.value);
			return false;
		}
		let errorEmitted = false;
		for (const logger of nonDisposedLoggers) {
			if (logger.ignoreUnhandledExtHostErrors) {
				continue;
			}
			logger.logError(error);
			errorEmitted = true;
		}
		return errorEmitted;
	}
}

export class ExtHostTelemetryLogger {

	static validateSender(sender: vscode.TelemetrySender): void {
		if (typeof sender !== 'object') {
			throw new TypeError('TelemetrySender argument is invalid');
		}
		if (typeof sender.sendEventData !== 'function') {
			throw new TypeError('TelemetrySender.sendEventData must be a function');
		}
		if (typeof sender.sendErrorData !== 'function') {
			throw new TypeError('TelemetrySender.sendErrorData must be a function');
		}
		if (typeof sender.flush !== 'undefined' && typeof sender.flush !== 'function') {
			throw new TypeError('TelemetrySender.flush must be a function or undefined');
		}
	}

	private readonly _onDidChangeEnableStates = new Emitter<vscode.TelemetryLogger>();
	private readonly _ignoreBuiltinCommonProperties: boolean;
	private readonly _additionalCommonProperties: Record<string, any> | undefined;
	public readonly ignoreUnhandledExtHostErrors: boolean;

	private _telemetryEnablements: { isUsageEnabled: boolean; isErrorsEnabled: boolean };
	private _apiObject: vscode.TelemetryLogger | undefined;
	private _sender: vscode.TelemetrySender | undefined;

	constructor(
		sender: vscode.TelemetrySender,
		options: vscode.TelemetryLoggerOptions | undefined,
		private readonly _extension: IExtensionDescription,
		private readonly _logger: ILogger,
		private readonly _inLoggingOnlyMode: boolean,
		private readonly _commonProperties: Record<string, any>,
		telemetryEnablements: { isUsageEnabled: boolean; isErrorsEnabled: boolean }
	) {
		this.ignoreUnhandledExtHostErrors = options?.ignoreUnhandledErrors ?? false;
		this._ignoreBuiltinCommonProperties = options?.ignoreBuiltInCommonProperties ?? false;
		this._additionalCommonProperties = options?.additionalCommonProperties;
		this._sender = sender;
		this._telemetryEnablements = { isUsageEnabled: telemetryEnablements.isUsageEnabled, isErrorsEnabled: telemetryEnablements.isErrorsEnabled };
	}

	updateTelemetryEnablements(isUsageEnabled: boolean, isErrorsEnabled: boolean): void {
		if (this._apiObject) {
			this._telemetryEnablements = { isUsageEnabled, isErrorsEnabled };
			this._onDidChangeEnableStates.fire(this._apiObject);
		}
	}

	mixInCommonPropsAndCleanData(data: ExtHostTelemetryEventData): Record<string, any> {
		// Some telemetry modules prefer to break properties and measurmements up
		// We mix common properties into the properties tab.
		let updatedData = data.properties ? (data.properties ?? {}) : data;

		// We don't clean measurements since they are just numbers
		updatedData = cleanData(updatedData, []);

		if (this._additionalCommonProperties) {
			updatedData = mixin(updatedData, this._additionalCommonProperties);
		}

		if (!this._ignoreBuiltinCommonProperties) {
			updatedData = mixin(updatedData, this._commonProperties);
		}

		if (data.properties) {
			data.properties = updatedData;
		} else {
			data = updatedData;
		}

		return data;
	}

	private logEvent(eventName: string, data?: Record<string, any>): void {
		// No sender means likely disposed of, we should no-op
		if (!this._sender) {
			return;
		}
		// If it's a built-in extension (vscode publisher) we don't prefix the publisher and only the ext name
		if (this._extension.publisher === 'vscode') {
			eventName = this._extension.name + '/' + eventName;
		} else {
			eventName = this._extension.identifier.value + '/' + eventName;
		}
		data = this.mixInCommonPropsAndCleanData(data || {});
		if (!this._inLoggingOnlyMode) {
			this._sender?.sendEventData(eventName, data);
		}
		this._logger.trace(eventName, data);
	}

	logUsage(eventName: string, data?: Record<string, any>): void {
		if (!this._telemetryEnablements.isUsageEnabled) {
			return;
		}
		this.logEvent(eventName, data);
	}

	logError(eventNameOrException: Error | string, data?: Record<string, any>): void {
		if (!this._telemetryEnablements.isErrorsEnabled || !this._sender) {
			return;
		}
		if (typeof eventNameOrException === 'string') {
			this.logEvent(eventNameOrException, data);
		} else {
			const errorData = {
				name: eventNameOrException.name,
				message: eventNameOrException.message,
				stack: eventNameOrException.stack,
				cause: eventNameOrException.cause
			};
			const cleanedErrorData = cleanData(errorData, []);
			// Reconstruct the error object with the cleaned data
			const cleanedError = new Error(typeof cleanedErrorData.message === 'string' ? cleanedErrorData.message : undefined, {
				cause: cleanedErrorData.cause
			});
			cleanedError.stack = typeof cleanedErrorData.stack === 'string' ? cleanedErrorData.stack : undefined;
			cleanedError.name = typeof cleanedErrorData.name === 'string' ? cleanedErrorData.name : 'unknown';
			data = this.mixInCommonPropsAndCleanData(data || {});
			if (!this._inLoggingOnlyMode) {
				this._sender.sendErrorData(cleanedError, data);
			}
			this._logger.trace('exception', data);
		}
	}

	get apiTelemetryLogger(): vscode.TelemetryLogger {
		if (!this._apiObject) {
			const that = this;
			const obj: vscode.TelemetryLogger = {
				logUsage: that.logUsage.bind(that),
				get isUsageEnabled() {
					return that._telemetryEnablements.isUsageEnabled;
				},
				get isErrorsEnabled() {
					return that._telemetryEnablements.isErrorsEnabled;
				},
				logError: that.logError.bind(that),
				dispose: that.dispose.bind(that),
				onDidChangeEnableStates: that._onDidChangeEnableStates.event.bind(that)
			};
			this._apiObject = Object.freeze(obj);
		}
		return this._apiObject;
	}

	get isDisposed(): boolean {
		return !this._sender;
	}

	dispose(): void {
		if (this._sender?.flush) {
			let tempSender: vscode.TelemetrySender | undefined = this._sender;
			this._sender = undefined;
			Promise.resolve(tempSender.flush!()).then(tempSender = undefined);
			this._apiObject = undefined;
		} else {
			this._sender = undefined;
		}
	}
}

export function isNewAppInstall(firstSessionDate: string): boolean {
	const installAge = Date.now() - new Date(firstSessionDate).getTime();
	return isNaN(installAge) ? false : installAge < 1000 * 60 * 60 * 24; // install age is less than a day
}

export const IExtHostTelemetry = createDecorator<IExtHostTelemetry>('IExtHostTelemetry');
export interface IExtHostTelemetry extends ExtHostTelemetry, ExtHostTelemetryShape { }
```

--------------------------------------------------------------------------------

````

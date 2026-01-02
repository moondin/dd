---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 99
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 99 of 552)

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

---[FILE: extensions/typescript-language-features/src/tsServer/spawner.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/spawner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SyntaxServerConfiguration, TsServerLogLevel, TypeScriptServiceConfiguration } from '../configuration/configuration';
import { Logger } from '../logging/logger';
import { TelemetryReporter } from '../logging/telemetry';
import Tracer from '../logging/tracer';
import { OngoingRequestCancellerFactory } from '../tsServer/cancellation';
import { ClientCapabilities, ClientCapability, ServerType } from '../typescriptService';
import { isWeb, isWebAndHasSharedArrayBuffers } from '../utils/platform';
import { API } from './api';
import { ILogDirectoryProvider } from './logDirectoryProvider';
import { TypeScriptPluginPathsProvider } from './pluginPathsProvider';
import { PluginManager } from './plugins';
import { GetErrRoutingTsServer, ITypeScriptServer, SingleTsServer, SyntaxRoutingTsServer, TsServerDelegate, TsServerLog, TsServerProcessFactory, TsServerProcessKind } from './server';
import { TypeScriptVersionManager } from './versionManager';
import { ITypeScriptVersionProvider, TypeScriptVersion } from './versionProvider';
import { NodeVersionManager } from './nodeManager';
import { Lazy } from '../utils/lazy';

const enum CompositeServerType {
	/** Run a single server that handles all commands  */
	Single,

	/** Run a separate server for syntax commands */
	SeparateSyntax,

	/** Use a separate syntax server while the project is loading */
	DynamicSeparateSyntax,

	/** Only enable the syntax server */
	SyntaxOnly
}

export class TypeScriptServerSpawner {

	public static readonly tsServerLogOutputChannel = new Lazy<vscode.OutputChannel>(() => {
		return vscode.window.createOutputChannel(vscode.l10n.t("TypeScript Server Log"));
	});

	public constructor(
		private readonly _versionProvider: ITypeScriptVersionProvider,
		private readonly _versionManager: TypeScriptVersionManager,
		private readonly _nodeVersionManager: NodeVersionManager,
		private readonly _logDirectoryProvider: ILogDirectoryProvider,
		private readonly _pluginPathsProvider: TypeScriptPluginPathsProvider,
		private readonly _logger: Logger,
		private readonly _telemetryReporter: TelemetryReporter,
		private readonly _tracer: Tracer,
		private readonly _factory: TsServerProcessFactory,
	) { }

	public spawn(
		version: TypeScriptVersion,
		capabilities: ClientCapabilities,
		configuration: TypeScriptServiceConfiguration,
		pluginManager: PluginManager,
		cancellerFactory: OngoingRequestCancellerFactory,
		delegate: TsServerDelegate,
	): ITypeScriptServer {
		let primaryServer: ITypeScriptServer;
		const serverType = this.getCompositeServerType(version, capabilities, configuration);
		const shouldUseSeparateDiagnosticsServer = this.shouldUseSeparateDiagnosticsServer(configuration);

		switch (serverType) {
			case CompositeServerType.SeparateSyntax:
			case CompositeServerType.DynamicSeparateSyntax:
				{
					const enableDynamicRouting = !shouldUseSeparateDiagnosticsServer && serverType === CompositeServerType.DynamicSeparateSyntax;
					primaryServer = new SyntaxRoutingTsServer({
						syntax: this.spawnTsServer(TsServerProcessKind.Syntax, version, configuration, pluginManager, cancellerFactory),
						semantic: this.spawnTsServer(TsServerProcessKind.Semantic, version, configuration, pluginManager, cancellerFactory),
					}, delegate, enableDynamicRouting);
					break;
				}
			case CompositeServerType.Single:
				{
					primaryServer = this.spawnTsServer(TsServerProcessKind.Main, version, configuration, pluginManager, cancellerFactory);
					break;
				}
			case CompositeServerType.SyntaxOnly:
				{
					primaryServer = this.spawnTsServer(TsServerProcessKind.Syntax, version, configuration, pluginManager, cancellerFactory);
					break;
				}
		}

		if (shouldUseSeparateDiagnosticsServer) {
			return new GetErrRoutingTsServer({
				getErr: this.spawnTsServer(TsServerProcessKind.Diagnostics, version, configuration, pluginManager, cancellerFactory),
				primary: primaryServer,
			}, delegate);
		}

		return primaryServer;
	}

	private getCompositeServerType(
		version: TypeScriptVersion,
		capabilities: ClientCapabilities,
		configuration: TypeScriptServiceConfiguration,
	): CompositeServerType {
		if (!capabilities.has(ClientCapability.Semantic)) {
			return CompositeServerType.SyntaxOnly;
		}

		switch (configuration.useSyntaxServer) {
			case SyntaxServerConfiguration.Always:
				return CompositeServerType.SyntaxOnly;

			case SyntaxServerConfiguration.Never:
				return CompositeServerType.Single;

			case SyntaxServerConfiguration.Auto:
				return version.apiVersion?.gte(API.v400)
					? CompositeServerType.DynamicSeparateSyntax
					: CompositeServerType.SeparateSyntax;
		}
	}

	private shouldUseSeparateDiagnosticsServer(
		configuration: TypeScriptServiceConfiguration,
	): boolean {
		return configuration.enableProjectDiagnostics;
	}

	private spawnTsServer(
		kind: TsServerProcessKind,
		version: TypeScriptVersion,
		configuration: TypeScriptServiceConfiguration,
		pluginManager: PluginManager,
		cancellerFactory: OngoingRequestCancellerFactory,
	): ITypeScriptServer {
		const apiVersion = version.apiVersion || API.defaultVersion;

		const canceller = cancellerFactory.create(kind, this._tracer);
		const { args, tsServerLog, tsServerTraceDirectory } = this.getTsServerArgs(kind, configuration, version, apiVersion, pluginManager, canceller.cancellationPipeName);

		if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
			if (tsServerLog?.type === 'file') {
				this._logger.info(`<${kind}> Log file: ${tsServerLog.uri.fsPath}`);
			} else if (tsServerLog?.type === 'output') {
				this._logger.info(`<${kind}> Logging to output`);
			} else {
				this._logger.error(`<${kind}> Could not create TS Server log`);
			}
		}

		if (configuration.enableTsServerTracing) {
			if (tsServerTraceDirectory) {
				this._logger.info(`<${kind}> Trace directory: ${tsServerTraceDirectory.fsPath}`);
			} else {
				this._logger.error(`<${kind}> Could not create trace directory`);
			}
		}

		this._logger.info(`<${kind}> Forking...`);
		const process = this._factory.fork(version, args, kind, configuration, this._versionManager, this._nodeVersionManager, tsServerLog);
		this._logger.info(`<${kind}> Starting...`);

		return new SingleTsServer(
			kind,
			this.kindToServerType(kind),
			process!,
			tsServerLog,
			canceller,
			version,
			this._telemetryReporter,
			this._tracer);
	}

	private kindToServerType(kind: TsServerProcessKind): ServerType {
		switch (kind) {
			case TsServerProcessKind.Syntax:
				return ServerType.Syntax;

			case TsServerProcessKind.Main:
			case TsServerProcessKind.Semantic:
			case TsServerProcessKind.Diagnostics:
			default:
				return ServerType.Semantic;
		}
	}

	private getTsServerArgs(
		kind: TsServerProcessKind,
		configuration: TypeScriptServiceConfiguration,
		currentVersion: TypeScriptVersion,
		apiVersion: API,
		pluginManager: PluginManager,
		cancellationPipeName: string | undefined,
	): { args: string[]; tsServerLog: TsServerLog | undefined; tsServerTraceDirectory: vscode.Uri | undefined } {
		const args: string[] = [];
		let tsServerLog: TsServerLog | undefined;
		let tsServerTraceDirectory: vscode.Uri | undefined;

		if (kind === TsServerProcessKind.Syntax) {
			if (apiVersion.gte(API.v401)) {
				args.push('--serverMode', 'partialSemantic');
			} else {
				args.push('--syntaxOnly');
			}
		}

		args.push('--useInferredProjectPerProjectRoot');

		if (configuration.disableAutomaticTypeAcquisition || kind === TsServerProcessKind.Syntax || kind === TsServerProcessKind.Diagnostics) {
			args.push('--disableAutomaticTypingAcquisition');
		}

		if (kind === TsServerProcessKind.Semantic || kind === TsServerProcessKind.Main) {
			args.push('--enableTelemetry');
		}

		if (cancellationPipeName) {
			args.push('--cancellationPipeName', cancellationPipeName + '*');
		}

		if (TypeScriptServerSpawner.isLoggingEnabled(configuration)) {
			if (isWeb()) {
				args.push('--logVerbosity', TsServerLogLevel.toString(configuration.tsServerLogLevel));
				tsServerLog = { type: 'output', output: TypeScriptServerSpawner.tsServerLogOutputChannel.value };
			} else {
				const logDir = this._logDirectoryProvider.getNewLogDirectory();
				if (logDir) {
					const logFilePath = vscode.Uri.joinPath(logDir, `tsserver.log`);
					tsServerLog = { type: 'file', uri: logFilePath };

					args.push('--logVerbosity', TsServerLogLevel.toString(configuration.tsServerLogLevel));
					args.push('--logFile', logFilePath.fsPath);
				}
			}
		}

		if (configuration.enableTsServerTracing && !isWeb()) {
			tsServerTraceDirectory = this._logDirectoryProvider.getNewLogDirectory();
			if (tsServerTraceDirectory) {
				args.push('--traceDirectory', `"${tsServerTraceDirectory.fsPath}"`);
			}
		}

		const pluginPaths = isWeb() ? [] : this._pluginPathsProvider.getPluginPaths();

		if (pluginManager.plugins.length) {
			args.push('--globalPlugins', pluginManager.plugins.map(x => x.name).join(','));

			const isUsingBundledTypeScriptVersion = currentVersion.path === this._versionProvider.defaultVersion.path;
			for (const plugin of pluginManager.plugins) {
				if (isUsingBundledTypeScriptVersion || plugin.enableForWorkspaceTypeScriptVersions) {
					pluginPaths.push(isWeb() ? plugin.uri.toString() : plugin.uri.fsPath);
				}
			}
		}

		if (pluginPaths.length !== 0) {
			args.push('--pluginProbeLocations', pluginPaths.join(','));
		}

		if (configuration.npmLocation && !isWeb()) {
			args.push('--npmLocation', `"${configuration.npmLocation}"`);
		}

		args.push('--locale', TypeScriptServerSpawner.getTsLocale(configuration));

		args.push('--noGetErrOnBackgroundUpdate');

		const configUseVsCodeWatcher = configuration.useVsCodeWatcher;
		const isYarnPnp = apiVersion.isYarnPnp();
		if (
			apiVersion.gte(API.v544)
			&& configUseVsCodeWatcher
			&& !isYarnPnp // Disable for yarn pnp as it currently breaks with the VS Code watcher
		) {
			args.push('--canUseWatchEvents');
		} else {
			if (!configUseVsCodeWatcher) {
				this._logger.info(`<${kind}> Falling back to legacy node.js based file watching because of user settings.`);
			} else if (isYarnPnp) {
				this._logger.info(`<${kind}> Falling back to legacy node.js based file watching because of Yarn PnP.`);
			}
		}

		args.push('--validateDefaultNpmLocation');

		if (isWebAndHasSharedArrayBuffers()) {
			args.push('--enableProjectWideIntelliSenseOnWeb');
		}

		return { args, tsServerLog, tsServerTraceDirectory };
	}

	private static isLoggingEnabled(configuration: TypeScriptServiceConfiguration) {
		return configuration.tsServerLogLevel !== TsServerLogLevel.Off;
	}

	private static getTsLocale(configuration: TypeScriptServiceConfiguration): string {
		return configuration.locale
			? configuration.locale
			: vscode.env.language;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/versionManager.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/versionManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { tsNativeExtensionId } from '../commands/useTsgo';
import { setImmediate } from '../utils/async';
import { Disposable } from '../utils/dispose';
import { ITypeScriptVersionProvider, TypeScriptVersion } from './versionProvider';


const useWorkspaceTsdkStorageKey = 'typescript.useWorkspaceTsdk';
const suppressPromptWorkspaceTsdkStorageKey = 'typescript.suppressPromptWorkspaceTsdk';

interface QuickPickItem extends vscode.QuickPickItem {
	run(): void;
}

export class TypeScriptVersionManager extends Disposable {

	private _currentVersion: TypeScriptVersion;

	public constructor(
		private configuration: TypeScriptServiceConfiguration,
		private readonly versionProvider: ITypeScriptVersionProvider,
		private readonly workspaceState: vscode.Memento
	) {
		super();

		this._currentVersion = this.versionProvider.defaultVersion;

		if (this.useWorkspaceTsdkSetting) {
			if (vscode.workspace.isTrusted) {
				const localVersion = this.versionProvider.localVersion;
				if (localVersion) {
					this._currentVersion = localVersion;
				}
			} else {
				this._disposables.push(vscode.workspace.onDidGrantWorkspaceTrust(() => {
					if (this.versionProvider.localVersion) {
						this.updateActiveVersion(this.versionProvider.localVersion);
					}
				}));
			}
		}

		if (this.isInPromptWorkspaceTsdkState(configuration)) {
			setImmediate(() => {
				this.promptUseWorkspaceTsdk();
			});
		}

	}

	private readonly _onDidPickNewVersion = this._register(new vscode.EventEmitter<void>());
	public readonly onDidPickNewVersion = this._onDidPickNewVersion.event;

	public updateConfiguration(nextConfiguration: TypeScriptServiceConfiguration) {
		const lastConfiguration = this.configuration;
		this.configuration = nextConfiguration;

		if (
			!this.isInPromptWorkspaceTsdkState(lastConfiguration)
			&& this.isInPromptWorkspaceTsdkState(nextConfiguration)
		) {
			this.promptUseWorkspaceTsdk();
		}
	}

	public get currentVersion(): TypeScriptVersion {
		return this._currentVersion;
	}

	public reset(): void {
		this._currentVersion = this.versionProvider.bundledVersion;
	}

	public async promptUserForVersion(): Promise<void> {
		const nativePreviewItem = this.getNativePreviewPickItem();
		const items: QuickPickItem[] = [
			this.getBundledPickItem(),
			...this.getLocalPickItems(),
		];

		if (nativePreviewItem) {
			items.push(nativePreviewItem);
		}

		items.push(
			{
				kind: vscode.QuickPickItemKind.Separator,
				label: '',
				run: () => { /* noop */ },
			},
			LearnMorePickItem,
		);

		const selected = await vscode.window.showQuickPick<QuickPickItem>(items, {
			placeHolder: vscode.l10n.t("Select the TypeScript version used for JavaScript and TypeScript language features"),
		});

		return selected?.run();
	}

	private getBundledPickItem(): QuickPickItem {
		const bundledVersion = this.versionProvider.defaultVersion;
		return {
			label: (!this.useWorkspaceTsdkSetting || !vscode.workspace.isTrusted
				? '• '
				: '') + vscode.l10n.t("Use VS Code's Version"),
			description: bundledVersion.displayName,
			detail: bundledVersion.pathLabel,
			run: async () => {
				await this.workspaceState.update(useWorkspaceTsdkStorageKey, false);
				this.updateActiveVersion(bundledVersion);
			},
		};
	}

	private getLocalPickItems(): QuickPickItem[] {
		return this.versionProvider.localVersions.map(version => {
			return {
				label: (this.useWorkspaceTsdkSetting && vscode.workspace.isTrusted && this.currentVersion.eq(version)
					? '• '
					: '') + vscode.l10n.t("Use Workspace Version"),
				description: version.displayName,
				detail: version.pathLabel,
				run: async () => {
					const trusted = await vscode.workspace.requestWorkspaceTrust();
					if (trusted) {
						await this.workspaceState.update(useWorkspaceTsdkStorageKey, true);
						const tsConfig = vscode.workspace.getConfiguration('typescript');
						await tsConfig.update('tsdk', version.pathLabel, false);
						this.updateActiveVersion(version);
					}
				},
			};
		});
	}

	private getNativePreviewPickItem(): QuickPickItem | undefined {
		const nativePreviewExtension = vscode.extensions.getExtension(tsNativeExtensionId);
		if (!nativePreviewExtension) {
			return undefined;
		}

		const tsConfig = vscode.workspace.getConfiguration('typescript');
		const isUsingTsgo = tsConfig.get<boolean>('experimental.useTsgo', false);

		return {
			label: (isUsingTsgo ? '• ' : '') + vscode.l10n.t("Use TypeScript Native Preview (Experimental)"),
			description: nativePreviewExtension.packageJSON.version,
			run: async () => {
				await vscode.commands.executeCommand('typescript.native-preview.enable');
			},
		};
	}

	private async promptUseWorkspaceTsdk(): Promise<void> {
		const workspaceVersion = this.versionProvider.localVersion;

		if (workspaceVersion === undefined) {
			throw new Error('Could not prompt to use workspace TypeScript version because no workspace version is specified');
		}

		const allowIt = vscode.l10n.t("Allow");
		const dismissPrompt = vscode.l10n.t("Dismiss");
		const suppressPrompt = vscode.l10n.t("Never in this Workspace");

		const result = await vscode.window.showInformationMessage(vscode.l10n.t("This workspace contains a TypeScript version. Would you like to use the workspace TypeScript version for TypeScript and JavaScript language features?"),
			allowIt,
			dismissPrompt,
			suppressPrompt
		);

		if (result === allowIt) {
			await this.workspaceState.update(useWorkspaceTsdkStorageKey, true);
			this.updateActiveVersion(workspaceVersion);
		} else if (result === suppressPrompt) {
			await this.workspaceState.update(suppressPromptWorkspaceTsdkStorageKey, true);
		}
	}

	private updateActiveVersion(pickedVersion: TypeScriptVersion) {
		const oldVersion = this.currentVersion;
		this._currentVersion = pickedVersion;
		if (!oldVersion.eq(pickedVersion)) {
			this._onDidPickNewVersion.fire();
		}
	}

	private get useWorkspaceTsdkSetting(): boolean {
		return this.workspaceState.get<boolean>(useWorkspaceTsdkStorageKey, false);
	}

	private get suppressPromptWorkspaceTsdkSetting(): boolean {
		return this.workspaceState.get<boolean>(suppressPromptWorkspaceTsdkStorageKey, false);
	}

	private isInPromptWorkspaceTsdkState(configuration: TypeScriptServiceConfiguration) {
		return (
			configuration.localTsdk !== null
			&& configuration.enablePromptUseWorkspaceTsdk === true
			&& this.suppressPromptWorkspaceTsdkSetting === false
			&& this.useWorkspaceTsdkSetting === false
		);
	}
}

const LearnMorePickItem: QuickPickItem = {
	label: vscode.l10n.t("Learn more about managing TypeScript versions"),
	description: '',
	run: () => {
		vscode.env.openExternal(vscode.Uri.parse('https://go.microsoft.com/fwlink/?linkid=839919'));
	}
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/versionProvider.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/versionProvider.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { RelativeWorkspacePathResolver } from '../utils/relativePathResolver';
import { API } from './api';
import { ITypeScriptVersionProvider, TypeScriptVersion, TypeScriptVersionSource } from './versionProvider';


export class DiskTypeScriptVersionProvider implements ITypeScriptVersionProvider {

	public constructor(
		private configuration?: TypeScriptServiceConfiguration
	) { }

	public updateConfiguration(configuration: TypeScriptServiceConfiguration): void {
		this.configuration = configuration;
	}

	public get defaultVersion(): TypeScriptVersion {
		return this.globalVersion || this.bundledVersion;
	}

	public get globalVersion(): TypeScriptVersion | undefined {
		if (this.configuration?.globalTsdk) {
			const globals = this.loadVersionsFromSetting(TypeScriptVersionSource.UserSetting, this.configuration.globalTsdk);
			if (globals?.length) {
				return globals[0];
			}
		}
		return this.contributedTsNextVersion;
	}

	public get localVersion(): TypeScriptVersion | undefined {
		const tsdkVersions = this.localTsdkVersions;
		if (tsdkVersions?.length) {
			return tsdkVersions[0];
		}

		const nodeVersions = this.localNodeModulesVersions;
		if (nodeVersions && nodeVersions.length === 1) {
			return nodeVersions[0];
		}
		return undefined;
	}


	public get localVersions(): TypeScriptVersion[] {
		const allVersions = this.localTsdkVersions.concat(this.localNodeModulesVersions);
		const paths = new Set<string>();
		return allVersions.filter(x => {
			if (paths.has(x.path)) {
				return false;
			}
			paths.add(x.path);
			return true;
		});
	}

	public get bundledVersion(): TypeScriptVersion {
		const version = this.getContributedVersion(TypeScriptVersionSource.Bundled, 'vscode.typescript-language-features', ['..', 'node_modules']);
		if (version) {
			return version;
		}

		vscode.window.showErrorMessage(vscode.l10n.t("VS Code\'s tsserver was deleted by another application such as a misbehaving virus detection tool. Please reinstall VS Code."));
		throw new Error('Could not find bundled tsserver.js');
	}

	private get contributedTsNextVersion(): TypeScriptVersion | undefined {
		return this.getContributedVersion(TypeScriptVersionSource.TsNightlyExtension, 'ms-vscode.vscode-typescript-next', ['node_modules']);
	}

	private getContributedVersion(source: TypeScriptVersionSource, extensionId: string, pathToTs: readonly string[]): TypeScriptVersion | undefined {
		try {
			const extension = vscode.extensions.getExtension(extensionId);
			if (extension) {
				const serverPath = path.join(extension.extensionPath, ...pathToTs, 'typescript', 'lib', 'tsserver.js');
				const bundledVersion = new TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), '');
				if (bundledVersion.isValid) {
					return bundledVersion;
				}
			}
		} catch {
			// noop
		}
		return undefined;
	}

	private get localTsdkVersions(): TypeScriptVersion[] {
		const localTsdk = this.configuration?.localTsdk;
		return localTsdk ? this.loadVersionsFromSetting(TypeScriptVersionSource.WorkspaceSetting, localTsdk) : [];
	}

	private loadVersionsFromSetting(source: TypeScriptVersionSource, tsdkPathSetting: string): TypeScriptVersion[] {
		if (path.isAbsolute(tsdkPathSetting)) {
			const serverPath = path.join(tsdkPathSetting, 'tsserver.js');
			return [
				new TypeScriptVersion(source,
					serverPath,
					DiskTypeScriptVersionProvider.getApiVersion(serverPath),
					tsdkPathSetting)
			];
		}

		const workspacePath = RelativeWorkspacePathResolver.asAbsoluteWorkspacePath(tsdkPathSetting);
		if (workspacePath !== undefined) {
			const serverPath = path.join(workspacePath, 'tsserver.js');
			return [
				new TypeScriptVersion(source,
					serverPath,
					DiskTypeScriptVersionProvider.getApiVersion(serverPath),
					tsdkPathSetting)
			];
		}

		return this.loadTypeScriptVersionsFromPath(source, tsdkPathSetting);
	}

	private get localNodeModulesVersions(): TypeScriptVersion[] {
		return this.loadTypeScriptVersionsFromPath(TypeScriptVersionSource.NodeModules, path.join('node_modules', 'typescript', 'lib'))
			.filter(x => x.isValid);
	}

	private loadTypeScriptVersionsFromPath(source: TypeScriptVersionSource, relativePath: string): TypeScriptVersion[] {
		if (!vscode.workspace.workspaceFolders) {
			return [];
		}

		const versions: TypeScriptVersion[] = [];
		for (const root of vscode.workspace.workspaceFolders) {
			let label: string = relativePath;
			if (vscode.workspace.workspaceFolders.length > 1) {
				label = path.join(root.name, relativePath);
			}

			const serverPath = path.join(root.uri.fsPath, relativePath, 'tsserver.js');
			versions.push(new TypeScriptVersion(source, serverPath, DiskTypeScriptVersionProvider.getApiVersion(serverPath), label));
		}
		return versions;
	}

	private static getApiVersion(serverPath: string): API | undefined {
		const version = DiskTypeScriptVersionProvider.getTypeScriptVersion(serverPath);
		if (version) {
			return version;
		}

		// Allow TS developers to provide custom version
		const tsdkVersion = vscode.workspace.getConfiguration().get<string | undefined>('typescript.tsdk_version', undefined);
		if (tsdkVersion) {
			return API.fromVersionString(tsdkVersion);
		}

		return undefined;
	}

	private static getTypeScriptVersion(serverPath: string): API | undefined {
		if (!fs.existsSync(serverPath)) {
			return undefined;
		}

		const p = serverPath.split(path.sep);
		if (p.length <= 2) {
			return undefined;
		}
		const p2 = p.slice(0, -2);
		const modulePath = p2.join(path.sep);
		let fileName = path.join(modulePath, 'package.json');
		if (!fs.existsSync(fileName)) {
			// Special case for ts dev versions
			if (path.basename(modulePath) === 'built') {
				fileName = path.join(modulePath, '..', 'package.json');
			}
		}
		if (!fs.existsSync(fileName)) {
			return undefined;
		}

		const contents = fs.readFileSync(fileName).toString();
		let desc: any;
		try {
			desc = JSON.parse(contents);
		} catch (err) {
			return undefined;
		}
		if (!desc?.version) {
			return undefined;
		}
		return desc.version ? API.fromVersionString(desc.version) : undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/versionProvider.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/versionProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { API } from './api';


export const enum TypeScriptVersionSource {
	Bundled = 'bundled',
	TsNightlyExtension = 'ts-nightly-extension',
	NodeModules = 'node-modules',
	UserSetting = 'user-setting',
	WorkspaceSetting = 'workspace-setting',
}

export class TypeScriptVersion {

	constructor(
		public readonly source: TypeScriptVersionSource,
		public readonly path: string,
		public readonly apiVersion: API | undefined,
		private readonly _pathLabel?: string,
	) { }

	public get tsServerPath(): string {
		return this.path;
	}

	public get pathLabel(): string {
		return this._pathLabel ?? this.path;
	}

	public get isValid(): boolean {
		return this.apiVersion !== undefined;
	}

	public eq(other: TypeScriptVersion): boolean {
		if (this.path !== other.path) {
			return false;
		}

		if (this.apiVersion === other.apiVersion) {
			return true;
		}
		if (!this.apiVersion || !other.apiVersion) {
			return false;
		}
		return this.apiVersion.eq(other.apiVersion);
	}

	public get displayName(): string {
		const version = this.apiVersion;
		return version ? version.displayName : vscode.l10n.t("Could not load the TypeScript version at this path");
	}
}

export interface ITypeScriptVersionProvider {
	updateConfiguration(configuration: TypeScriptServiceConfiguration): void;

	readonly defaultVersion: TypeScriptVersion;
	readonly globalVersion: TypeScriptVersion | undefined;
	readonly localVersion: TypeScriptVersion | undefined;
	readonly localVersions: readonly TypeScriptVersion[];
	readonly bundledVersion: TypeScriptVersion;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/protocol/errorCodes.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/protocol/errorCodes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const variableDeclaredButNeverUsed = new Set([6196, 6133]);
export const propertyDeclaretedButNeverUsed = new Set([6138]);
export const allImportsAreUnused = new Set([6192]);
export const unreachableCode = new Set([7027]);
export const unusedLabel = new Set([7028]);
export const fallThroughCaseInSwitch = new Set([7029]);
export const notAllCodePathsReturnAValue = new Set([7030]);
export const incorrectlyImplementsInterface = new Set([2420]);
export const cannotFindName = new Set([2552, 2304]);
export const extendsShouldBeImplements = new Set([2689]);
export const asyncOnlyAllowedInAsyncFunctions = new Set([1308]);
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/protocol/fixNames.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/protocol/fixNames.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const addMissingAwait = 'addMissingAwait';
export const addMissingNewOperator = 'addMissingNewOperator';
export const addMissingOverride = 'fixOverrideModifier';
export const annotateWithTypeFromJSDoc = 'annotateWithTypeFromJSDoc';
export const awaitInSyncFunction = 'fixAwaitInSyncFunction';
export const classDoesntImplementInheritedAbstractMember = 'fixClassDoesntImplementInheritedAbstractMember';
export const classIncorrectlyImplementsInterface = 'fixClassIncorrectlyImplementsInterface';
export const constructorForDerivedNeedSuperCall = 'constructorForDerivedNeedSuperCall';
export const extendsInterfaceBecomesImplements = 'extendsInterfaceBecomesImplements';
export const fixImport = 'import';
export const forgottenThisPropertyAccess = 'forgottenThisPropertyAccess';
export const removeUnnecessaryAwait = 'removeUnnecessaryAwait';
export const spelling = 'spelling';
export const inferFromUsage = 'inferFromUsage';
export const addNameToNamelessParameter = 'addNameToNamelessParameter';
export const fixMissingFunctionDeclaration = 'fixMissingFunctionDeclaration';
export const fixClassDoesntImplementInheritedAbstractMember = 'fixClassDoesntImplementInheritedAbstractMember';
export const unreachableCode = 'fixUnreachableCode';
export const unusedIdentifier = 'unusedIdentifier';
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/protocol/modifiers.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/protocol/modifiers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function parseKindModifier(kindModifiers: string): Set<string> {
	return new Set(kindModifiers.split(/,|\s+/g));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/protocol/protocol.const.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/protocol/protocol.const.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Kind {
	public static readonly alias = 'alias';
	public static readonly callSignature = 'call';
	public static readonly class = 'class';
	public static readonly const = 'const';
	public static readonly constructorImplementation = 'constructor';
	public static readonly constructSignature = 'construct';
	public static readonly directory = 'directory';
	public static readonly enum = 'enum';
	public static readonly enumMember = 'enum member';
	public static readonly externalModuleName = 'external module name';
	public static readonly function = 'function';
	public static readonly indexSignature = 'index';
	public static readonly interface = 'interface';
	public static readonly keyword = 'keyword';
	public static readonly let = 'let';
	public static readonly localFunction = 'local function';
	public static readonly localVariable = 'local var';
	public static readonly method = 'method';
	public static readonly memberGetAccessor = 'getter';
	public static readonly memberSetAccessor = 'setter';
	public static readonly memberVariable = 'property';
	public static readonly module = 'module';
	public static readonly primitiveType = 'primitive type';
	public static readonly script = 'script';
	public static readonly type = 'type';
	public static readonly variable = 'var';
	public static readonly warning = 'warning';
	public static readonly string = 'string';
	public static readonly parameter = 'parameter';
	public static readonly typeParameter = 'type parameter';
}


export class DiagnosticCategory {
	public static readonly error = 'error';
	public static readonly warning = 'warning';
	public static readonly suggestion = 'suggestion';
}

export class KindModifiers {
	public static readonly optional = 'optional';
	public static readonly deprecated = 'deprecated';
	public static readonly color = 'color';

	public static readonly dtsFile = '.d.ts';
	public static readonly tsFile = '.ts';
	public static readonly tsxFile = '.tsx';
	public static readonly jsFile = '.js';
	public static readonly jsxFile = '.jsx';
	public static readonly jsonFile = '.json';

	public static readonly fileExtensionKindModifiers = [
		KindModifiers.dtsFile,
		KindModifiers.tsFile,
		KindModifiers.tsxFile,
		KindModifiers.jsFile,
		KindModifiers.jsxFile,
		KindModifiers.jsonFile,
	];
}

export class DisplayPartKind {
	public static readonly functionName = 'functionName';
	public static readonly methodName = 'methodName';
	public static readonly parameterName = 'parameterName';
	public static readonly propertyName = 'propertyName';
	public static readonly punctuation = 'punctuation';
	public static readonly text = 'text';
}

export enum EventName {
	syntaxDiag = 'syntaxDiag',
	semanticDiag = 'semanticDiag',
	suggestionDiag = 'suggestionDiag',
	regionSemanticDiag = 'regionSemanticDiag',
	configFileDiag = 'configFileDiag',
	telemetry = 'telemetry',
	projectLanguageServiceState = 'projectLanguageServiceState',
	projectsUpdatedInBackground = 'projectsUpdatedInBackground',
	beginInstallTypes = 'beginInstallTypes',
	endInstallTypes = 'endInstallTypes',
	typesInstallerInitializationFailed = 'typesInstallerInitializationFailed',
	surveyReady = 'surveyReady',
	projectLoadingStart = 'projectLoadingStart',
	projectLoadingFinish = 'projectLoadingFinish',
	createFileWatcher = 'createFileWatcher',
	createDirectoryWatcher = 'createDirectoryWatcher',
	closeFileWatcher = 'closeFileWatcher',
	requestCompleted = 'requestCompleted',
}

export enum OrganizeImportsMode {
	All = 'All',
	SortAndCombine = 'SortAndCombine',
	RemoveUnused = 'RemoveUnused',
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/tsServer/protocol/protocol.d.ts]---
Location: vscode-main/extensions/typescript-language-features/src/tsServer/protocol/protocol.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type ts from '../../../../node_modules/typescript/lib/typescript';
export = ts.server.protocol;


declare enum ServerType {
	Syntax = 'syntax',
	Semantic = 'semantic',
}

declare module '../../../../node_modules/typescript/lib/typescript' {
	namespace server.protocol {
		type TextInsertion = ts.TextInsertion;
		type ScriptElementKind = ts.ScriptElementKind;

		interface Response {
			readonly _serverType?: ServerType;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/activeJsTsEditorTracker.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/activeJsTsEditorTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { isJsConfigOrTsConfigFileName } from '../configuration/languageDescription';
import { isSupportedLanguageMode } from '../configuration/languageIds';
import { Disposable } from '../utils/dispose';
import { coalesce } from '../utils/arrays';

/**
 * Tracks the active JS/TS editor.
 *
 * This tries to handle the case where the user focuses in the output view / debug console.
 * When this happens, we want to treat the last real focused editor as the active editor,
 * instead of using `vscode.window.activeTextEditor`
 */
export class ActiveJsTsEditorTracker extends Disposable {

	private _activeJsTsEditor: vscode.TextEditor | undefined;

	private readonly _onDidChangeActiveJsTsEditor = this._register(new vscode.EventEmitter<vscode.TextEditor | undefined>());
	public readonly onDidChangeActiveJsTsEditor = this._onDidChangeActiveJsTsEditor.event;

	public constructor() {
		super();

		this._register(vscode.window.onDidChangeActiveTextEditor(_ => this.update()));
		this._register(vscode.window.onDidChangeVisibleTextEditors(_ => this.update()));
		this._register(vscode.window.tabGroups.onDidChangeTabGroups(_ => this.update()));

		this.update();
	}

	public get activeJsTsEditor(): vscode.TextEditor | undefined {
		return this._activeJsTsEditor;
	}


	private update() {
		// Use tabs to find the active editor.
		// This correctly handles switching to the output view / debug console, which changes the activeEditor but not
		// the active tab.
		const editorCandidates = this.getEditorCandidatesForActiveTab();
		const managedEditors = editorCandidates.filter(editor => this.isManagedFile(editor));
		const newActiveJsTsEditor = managedEditors.at(0);
		if (this._activeJsTsEditor !== newActiveJsTsEditor) {
			this._activeJsTsEditor = newActiveJsTsEditor;
			this._onDidChangeActiveJsTsEditor.fire(this._activeJsTsEditor);
		}
	}

	private getEditorCandidatesForActiveTab(): vscode.TextEditor[] {
		const tab = vscode.window.tabGroups.activeTabGroup.activeTab;
		if (!tab) {
			return [];
		}

		// Basic text editor tab
		if (tab.input instanceof vscode.TabInputText) {
			const inputUri = tab.input.uri;
			const editor = vscode.window.visibleTextEditors.find(editor => {
				return editor.document.uri.toString() === inputUri.toString()
					&& editor.viewColumn === tab.group.viewColumn;
			});
			return editor ? [editor] : [];
		}

		// Diff editor tab. We could be focused on either side of the editor.
		if (tab.input instanceof vscode.TabInputTextDiff) {
			const original = tab.input.original;
			const modified = tab.input.modified;
			// Check the active editor first. However if a non tab editor like the output view is focused,
			// we still need to check the visible text editors.
			// TODO: This may return incorrect editors incorrect as there does not seem to be a reliable way to map from an editor to the
			// view column of its parent diff editor. See https://github.com/microsoft/vscode/issues/201845
			return coalesce([vscode.window.activeTextEditor, ...vscode.window.visibleTextEditors]).filter(editor => {
				return (editor.document.uri.toString() === original.toString() || editor.document.uri.toString() === modified.toString())
					&& editor.viewColumn === undefined; // Editors in diff views have undefined view columns
			});
		}

		// Notebook editor. Find editor for notebook cell.
		if (tab.input instanceof vscode.TabInputNotebook) {
			const activeEditor = vscode.window.activeTextEditor;
			if (!activeEditor) {
				return [];
			}

			// Notebooks cell editors have undefined view columns.
			if (activeEditor.viewColumn !== undefined) {
				return [];
			}

			const notebook = vscode.window.visibleNotebookEditors.find(editor =>
				editor.notebook.uri.toString() === (tab.input as vscode.TabInputNotebook).uri.toString()
				&& editor.viewColumn === tab.group.viewColumn);

			return notebook?.notebook.getCells().some(cell => cell.document.uri.toString() === activeEditor.document.uri.toString()) ? [activeEditor] : [];
		}

		return [];
	}

	private isManagedFile(editor: vscode.TextEditor): boolean {
		return this.isManagedScriptFile(editor) || this.isManagedConfigFile(editor);
	}

	private isManagedScriptFile(editor: vscode.TextEditor): boolean {
		return isSupportedLanguageMode(editor.document);
	}

	private isManagedConfigFile(editor: vscode.TextEditor): boolean {
		return isJsConfigOrTsConfigFileName(editor.document.fileName);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/intellisenseStatus.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/intellisenseStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CommandManager } from '../commands/commandManager';
import { isSupportedLanguageMode, isTypeScriptDocument, jsTsLanguageModes } from '../configuration/languageIds';
import { ProjectType, isImplicitProjectConfigFile, openOrCreateConfig, openProjectConfigForFile, openProjectConfigOrPromptToCreate } from '../tsconfig';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';
import { ActiveJsTsEditorTracker } from './activeJsTsEditorTracker';


namespace IntellisenseState {
	export const enum Type { None, Pending, Resolved, SyntaxOnly }

	export const None = Object.freeze({ type: Type.None } as const);

	export const SyntaxOnly = Object.freeze({ type: Type.SyntaxOnly } as const);

	export class Pending {
		public readonly type = Type.Pending;

		public readonly cancellation = new vscode.CancellationTokenSource();

		constructor(
			public readonly resource: vscode.Uri,
			public readonly projectType: ProjectType,
		) { }
	}

	export class Resolved {
		public readonly type = Type.Resolved;

		constructor(
			public readonly resource: vscode.Uri,
			public readonly projectType: ProjectType,
			public readonly configFile: string,
		) { }
	}

	export type State = typeof None | Pending | Resolved | typeof SyntaxOnly;
}

type CreateOrOpenConfigCommandArgs = [root: vscode.Uri, projectType: ProjectType];

export class IntellisenseStatus extends Disposable {

	public readonly openOpenConfigCommandId = '_typescript.openConfig';
	public readonly createOrOpenConfigCommandId = '_typescript.createOrOpenConfig';

	private _statusItem?: vscode.LanguageStatusItem;

	private _ready = false;
	private _state: IntellisenseState.State = IntellisenseState.None;

	constructor(
		private readonly _client: ITypeScriptServiceClient,
		commandManager: CommandManager,
		private readonly _activeTextEditorManager: ActiveJsTsEditorTracker,
	) {
		super();

		commandManager.register({
			id: this.openOpenConfigCommandId,
			execute: async (...[root, projectType]: CreateOrOpenConfigCommandArgs) => {
				if (this._state.type === IntellisenseState.Type.Resolved) {
					await openProjectConfigOrPromptToCreate(projectType, this._client, root, this._state.configFile);
				} else if (this._state.type === IntellisenseState.Type.Pending) {
					await openProjectConfigForFile(projectType, this._client, this._state.resource);
				}
			},
		});
		commandManager.register({
			id: this.createOrOpenConfigCommandId,
			execute: async (...[root, projectType]: CreateOrOpenConfigCommandArgs) => {
				await openOrCreateConfig(this._client.apiVersion, projectType, root, this._client.configuration);
			},
		});

		_activeTextEditorManager.onDidChangeActiveJsTsEditor(this.updateStatus, this, this._disposables);

		this._client.onReady(() => {
			this._ready = true;
			this.updateStatus();
		});
	}

	override dispose() {
		super.dispose();
		this._statusItem?.dispose();
	}

	private async updateStatus() {
		const doc = this._activeTextEditorManager.activeJsTsEditor?.document;
		if (!doc || !isSupportedLanguageMode(doc)) {
			this.updateState(IntellisenseState.None);
			return;
		}

		if (!this._client.hasCapabilityForResource(doc.uri, ClientCapability.Semantic)) {
			this.updateState(IntellisenseState.SyntaxOnly);
			return;
		}

		const file = this._client.toOpenTsFilePath(doc, { suppressAlertOnFailure: true });
		if (!file) {
			this.updateState(IntellisenseState.None);
			return;
		}

		if (!this._ready) {
			return;
		}

		const projectType = isTypeScriptDocument(doc) ? ProjectType.TypeScript : ProjectType.JavaScript;

		const pendingState = new IntellisenseState.Pending(doc.uri, projectType);
		this.updateState(pendingState);

		const response = await this._client.execute('projectInfo', { file, needFileNameList: false }, pendingState.cancellation.token);
		if (response.type === 'response' && response.body) {
			if (this._state === pendingState) {
				this.updateState(new IntellisenseState.Resolved(doc.uri, projectType, response.body.configFileName));
			}
		}
	}

	private updateState(newState: IntellisenseState.State): void {
		if (this._state === newState) {
			return;
		}

		if (this._state.type === IntellisenseState.Type.Pending) {
			this._state.cancellation.cancel();
			this._state.cancellation.dispose();
		}

		this._state = newState;

		switch (this._state.type) {
			case IntellisenseState.Type.None: {
				this._statusItem?.dispose();
				this._statusItem = undefined;
				break;
			}
			case IntellisenseState.Type.Pending: {
				const statusItem = this.ensureStatusItem();
				statusItem.severity = vscode.LanguageStatusSeverity.Information;
				statusItem.text = vscode.l10n.t("Loading IntelliSense status");
				statusItem.detail = undefined;
				statusItem.command = undefined;
				statusItem.busy = true;
				break;
			}
			case IntellisenseState.Type.Resolved: {
				const noConfigFileText = this._state.projectType === ProjectType.TypeScript
					? vscode.l10n.t("No tsconfig")
					: vscode.l10n.t("No jsconfig");

				const rootPath = this._client.getWorkspaceRootForResource(this._state.resource);
				if (!rootPath) {
					if (this._statusItem) {
						this._statusItem.text = noConfigFileText;
						this._statusItem.detail = !vscode.workspace.workspaceFolders
							? vscode.l10n.t("No opened folders")
							: vscode.l10n.t("File is not part opened folders");
						this._statusItem.busy = false;
					}
					return;
				}

				const statusItem = this.ensureStatusItem();
				statusItem.busy = false;
				statusItem.detail = undefined;

				statusItem.severity = vscode.LanguageStatusSeverity.Information;
				if (isImplicitProjectConfigFile(this._state.configFile)) {
					statusItem.text = noConfigFileText;
					statusItem.detail = undefined;
					statusItem.command = {
						command: this.createOrOpenConfigCommandId,
						title: this._state.projectType === ProjectType.TypeScript
							? vscode.l10n.t("Configure TSConfig")
							: vscode.l10n.t("Configure JSConfig"),
						arguments: [rootPath, this._state.projectType] satisfies CreateOrOpenConfigCommandArgs,
					};
				} else {
					statusItem.text = vscode.workspace.asRelativePath(this._state.configFile);
					statusItem.detail = undefined;
					statusItem.command = {
						command: this.openOpenConfigCommandId,
						title: vscode.l10n.t("Open Config File"),
						arguments: [rootPath, this._state.projectType] satisfies CreateOrOpenConfigCommandArgs,
					};
				}
				break;
			}
			case IntellisenseState.Type.SyntaxOnly: {
				const statusItem = this.ensureStatusItem();
				statusItem.severity = vscode.LanguageStatusSeverity.Warning;
				statusItem.text = vscode.l10n.t("Partial mode");
				statusItem.detail = vscode.l10n.t("Project wide IntelliSense not available");
				statusItem.busy = false;
				statusItem.command = {
					title: vscode.l10n.t("Learn More"),
					command: 'vscode.open',
					arguments: [
						vscode.Uri.parse('https://aka.ms/vscode/jsts/partial-mode'),
					]
				};
				break;
			}
		}
	}

	private ensureStatusItem(): vscode.LanguageStatusItem {
		if (!this._statusItem) {
			this._statusItem = vscode.languages.createLanguageStatusItem('typescript.projectStatus', jsTsLanguageModes);
			this._statusItem.name = vscode.l10n.t("JS/TS IntelliSense Status");
		}
		return this._statusItem;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/largeProjectStatus.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/largeProjectStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TelemetryReporter } from '../logging/telemetry';
import { isImplicitProjectConfigFile, openOrCreateConfig, ProjectType } from '../tsconfig';
import { ITypeScriptServiceClient } from '../typescriptService';


interface Hint {
	message: string;
}

class ExcludeHintItem {
	public configFileName?: string;
	private readonly _item: vscode.StatusBarItem;
	private _currentHint?: Hint;

	constructor(
		private readonly telemetryReporter: TelemetryReporter
	) {
		this._item = vscode.window.createStatusBarItem('status.typescript.exclude', vscode.StatusBarAlignment.Right, 98 /* to the right of typescript version status (99) */);
		this._item.name = vscode.l10n.t("TypeScript: Configure Excludes");
		this._item.command = 'js.projectStatus.command';
	}

	public getCurrentHint(): Hint {
		return this._currentHint!;
	}

	public hide() {
		this._item.hide();
	}

	public show(largeRoots?: string) {
		this._currentHint = {
			message: largeRoots
				? vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude folders with many files, like: {0}", largeRoots)
				: vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.")
		};
		this._item.tooltip = this._currentHint.message;
		this._item.text = vscode.l10n.t("Configure Excludes");
		this._item.tooltip = vscode.l10n.t("To enable project-wide JavaScript/TypeScript language features, exclude large folders with source files that you do not work on.");
		this._item.color = '#A5DF3B';
		this._item.show();
		/* __GDPR__
			"js.hintProjectExcludes" : {
				"owner": "mjbvz",
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('js.hintProjectExcludes');
	}
}


function createLargeProjectMonitorFromTypeScript(item: ExcludeHintItem, client: ITypeScriptServiceClient): vscode.Disposable {

	interface LargeProjectMessageItem extends vscode.MessageItem {
		index: number;
	}

	return client.onProjectLanguageServiceStateChanged(body => {
		if (body.languageServiceEnabled) {
			item.hide();
		} else {
			item.show();
			const configFileName = body.projectName;
			if (configFileName) {
				item.configFileName = configFileName;
				vscode.window.showWarningMessage<LargeProjectMessageItem>(item.getCurrentHint().message,
					{
						title: vscode.l10n.t("Configure Excludes"),
						index: 0
					}).then(selected => {
						if (selected && selected.index === 0) {
							onConfigureExcludesSelected(client, configFileName);
						}
					});
			}
		}
	});
}

function onConfigureExcludesSelected(
	client: ITypeScriptServiceClient,
	configFileName: string
) {
	if (!isImplicitProjectConfigFile(configFileName)) {
		vscode.workspace.openTextDocument(configFileName)
			.then(vscode.window.showTextDocument);
	} else {
		const root = client.getWorkspaceRootForResource(vscode.Uri.file(configFileName));
		if (root) {
			openOrCreateConfig(
				client.apiVersion,
				/tsconfig\.?.*\.json/.test(configFileName) ? ProjectType.TypeScript : ProjectType.JavaScript,
				root,
				client.configuration);
		}
	}
}

export function create(
	client: ITypeScriptServiceClient,
): vscode.Disposable {
	const toDispose: vscode.Disposable[] = [];

	const item = new ExcludeHintItem(client.telemetryReporter);
	toDispose.push(vscode.commands.registerCommand('js.projectStatus.command', () => {
		if (item.configFileName) {
			onConfigureExcludesSelected(client, item.configFileName);
		}
		const { message } = item.getCurrentHint();
		return vscode.window.showInformationMessage(message);
	}));

	toDispose.push(createLargeProjectMonitorFromTypeScript(item, client));

	return vscode.Disposable.from(...toDispose);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/managedFileContext.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/managedFileContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { disabledSchemes } from '../configuration/fileSchemes';
import { isJsConfigOrTsConfigFileName } from '../configuration/languageDescription';
import { isSupportedLanguageMode } from '../configuration/languageIds';
import { Disposable } from '../utils/dispose';
import { ActiveJsTsEditorTracker } from './activeJsTsEditorTracker';

/**
 * When clause context set when the current file is managed by vscode's built-in typescript extension.
 */
export default class ManagedFileContextManager extends Disposable {
	private static readonly contextName = 'typescript.isManagedFile';

	private isInManagedFileContext: boolean = false;

	constructor(activeJsTsEditorTracker: ActiveJsTsEditorTracker) {
		super();
		activeJsTsEditorTracker.onDidChangeActiveJsTsEditor(this.onDidChangeActiveTextEditor, this, this._disposables);

		this.onDidChangeActiveTextEditor(activeJsTsEditorTracker.activeJsTsEditor);
	}

	override dispose() {
		// Clear the context
		this.updateContext(false);

		super.dispose();
	}

	private onDidChangeActiveTextEditor(editor?: vscode.TextEditor): void {
		if (editor) {
			this.updateContext(this.isManagedFile(editor));
		} else {
			this.updateContext(false);
		}
	}

	private updateContext(newValue: boolean) {
		if (newValue === this.isInManagedFileContext) {
			return;
		}

		vscode.commands.executeCommand('setContext', ManagedFileContextManager.contextName, newValue);
		this.isInManagedFileContext = newValue;
	}

	private isManagedFile(editor: vscode.TextEditor): boolean {
		return this.isManagedScriptFile(editor) || this.isManagedConfigFile(editor);
	}

	private isManagedScriptFile(editor: vscode.TextEditor): boolean {
		return isSupportedLanguageMode(editor.document) && !disabledSchemes.has(editor.document.uri.scheme);
	}

	private isManagedConfigFile(editor: vscode.TextEditor): boolean {
		return isJsConfigOrTsConfigFileName(editor.document.fileName);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/typingsStatus.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/typingsStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';


const typingsInstallTimeout = 30 * 1000;

export default class TypingsStatus extends Disposable {
	private readonly _acquiringTypings = new Map<number, NodeJS.Timeout>();
	private readonly _client: ITypeScriptServiceClient;

	constructor(client: ITypeScriptServiceClient) {
		super();
		this._client = client;

		this._register(
			this._client.onDidBeginInstallTypings(event => this.onBeginInstallTypings(event.eventId)));

		this._register(
			this._client.onDidEndInstallTypings(event => this.onEndInstallTypings(event.eventId)));
	}

	public override dispose(): void {
		super.dispose();

		for (const timeout of this._acquiringTypings.values()) {
			clearTimeout(timeout);
		}
	}

	public get isAcquiringTypings(): boolean {
		return Object.keys(this._acquiringTypings).length > 0;
	}

	private onBeginInstallTypings(eventId: number): void {
		if (this._acquiringTypings.has(eventId)) {
			return;
		}
		this._acquiringTypings.set(eventId, setTimeout(() => {
			this.onEndInstallTypings(eventId);
		}, typingsInstallTimeout));
	}

	private onEndInstallTypings(eventId: number): void {
		const timer = this._acquiringTypings.get(eventId);
		if (timer) {
			clearTimeout(timer);
		}
		this._acquiringTypings.delete(eventId);
	}
}

export class AtaProgressReporter extends Disposable {

	private readonly _promises = new Map<number, Function>();

	constructor(client: ITypeScriptServiceClient) {
		super();
		this._register(client.onDidBeginInstallTypings(e => this._onBegin(e.eventId)));
		this._register(client.onDidEndInstallTypings(e => this._onEndOrTimeout(e.eventId)));
		this._register(client.onTypesInstallerInitializationFailed(_ => this.onTypesInstallerInitializationFailed()));
	}

	override dispose(): void {
		super.dispose();
		this._promises.forEach(value => value());
	}

	private _onBegin(eventId: number): void {
		const handle = setTimeout(() => this._onEndOrTimeout(eventId), typingsInstallTimeout);
		const promise = new Promise<void>(resolve => {
			this._promises.set(eventId, () => {
				clearTimeout(handle);
				resolve();
			});
		});

		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: vscode.l10n.t("Fetching data for better TypeScript IntelliSense")
		}, () => promise);
	}

	private _onEndOrTimeout(eventId: number): void {
		const resolve = this._promises.get(eventId);
		if (resolve) {
			this._promises.delete(eventId);
			resolve();
		}
	}

	private async onTypesInstallerInitializationFailed() {
		const config = vscode.workspace.getConfiguration('typescript');

		if (config.get<boolean>('check.npmIsInstalled', true)) {
			const dontShowAgain: vscode.MessageItem = {
				title: vscode.l10n.t("Don't Show Again"),
			};
			const selected = await vscode.window.showWarningMessage(
				vscode.l10n.t(
					"Could not install typings files for JavaScript language features. Please ensure that NPM is installed, or configure 'typescript.npm' in your user settings. Alternatively, check the [documentation]({0}) to learn more.",
					'https://go.microsoft.com/fwlink/?linkid=847635'
				),
				dontShowAgain);

			if (selected === dontShowAgain) {
				config.update('check.npmIsInstalled', false, true);
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/ui/versionStatus.ts]---
Location: vscode-main/extensions/typescript-language-features/src/ui/versionStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { SelectTypeScriptVersionCommand } from '../commands/selectTypeScriptVersion';
import { jsTsLanguageModes } from '../configuration/languageIds';
import { TypeScriptVersion } from '../tsServer/versionProvider';
import { ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';


export class VersionStatus extends Disposable {

	private readonly _statusItem: vscode.LanguageStatusItem;

	constructor(
		private readonly _client: ITypeScriptServiceClient,
	) {
		super();

		this._statusItem = this._register(vscode.languages.createLanguageStatusItem('typescript.version', jsTsLanguageModes));

		this._statusItem.name = vscode.l10n.t("TypeScript Version");
		this._statusItem.detail = vscode.l10n.t("TypeScript version");

		this._register(this._client.onTsServerStarted(({ version }) => this.onDidChangeTypeScriptVersion(version)));
	}

	private onDidChangeTypeScriptVersion(version: TypeScriptVersion) {
		this._statusItem.text = version.displayName;
		this._statusItem.command = {
			command: SelectTypeScriptVersionCommand.id,
			title: vscode.l10n.t("Select Version"),
			tooltip: version.path
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/arrays.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/arrays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const empty = Object.freeze([]);

export function equals<T>(
	a: ReadonlyArray<T>,
	b: ReadonlyArray<T>,
	itemEquals: (a: T, b: T) => boolean = (a, b) => a === b
): boolean {
	if (a === b) {
		return true;
	}
	if (a.length !== b.length) {
		return false;
	}
	return a.every((x, i) => itemEquals(x, b[i]));
}

export function coalesce<T>(array: ReadonlyArray<T | undefined>): T[] {
	return array.filter((e): e is T => !!e);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/async.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/async.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vscode';

export interface ITask<T> {
	(): T;
}

export class Delayer<T> {

	public defaultDelay: number;
	private timeout: any; // Timer
	private completionPromise: Promise<T | undefined> | null;
	private onSuccess: ((value: T | PromiseLike<T> | undefined) => void) | null;
	private task: ITask<T> | null;

	constructor(defaultDelay: number) {
		this.defaultDelay = defaultDelay;
		this.timeout = null;
		this.completionPromise = null;
		this.onSuccess = null;
		this.task = null;
	}

	public trigger(task: ITask<T>, delay: number = this.defaultDelay): Promise<T | undefined> {
		this.task = task;
		if (delay >= 0) {
			this.cancelTimeout();
		}

		if (!this.completionPromise) {
			this.completionPromise = new Promise<T | undefined>((resolve) => {
				this.onSuccess = resolve;
			}).then(() => {
				this.completionPromise = null;
				this.onSuccess = null;
				const result = this.task?.();
				this.task = null;
				return result;
			});
		}

		if (delay >= 0 || this.timeout === null) {
			this.timeout = setTimeout(() => {
				this.timeout = null;
				this.onSuccess?.(undefined);
			}, delay >= 0 ? delay : this.defaultDelay);
		}

		return this.completionPromise;
	}

	private cancelTimeout(): void {
		if (this.timeout !== null) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}
}

export function setImmediate(callback: (...args: unknown[]) => void, ...args: unknown[]): Disposable {
	if (global.setImmediate) {
		const handle = global.setImmediate(callback, ...args);
		return { dispose: () => global.clearImmediate(handle) };
	} else {
		const handle = setTimeout(callback, 0, ...args);
		return { dispose: () => clearTimeout(handle) };
	}
}


/**
 * A helper to prevent accumulation of sequential async tasks.
 *
 * Imagine a mail man with the sole task of delivering letters. As soon as
 * a letter submitted for delivery, he drives to the destination, delivers it
 * and returns to his base. Imagine that during the trip, N more letters were submitted.
 * When the mail man returns, he picks those N letters and delivers them all in a
 * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
 *
 * The throttler implements this via the queue() method, by providing it a task
 * factory. Following the example:
 *
 * 		const throttler = new Throttler();
 * 		const letters = [];
 *
 * 		function deliver() {
 * 			const lettersToDeliver = letters;
 * 			letters = [];
 * 			return makeTheTrip(lettersToDeliver);
 * 		}
 *
 * 		function onLetterReceived(l) {
 * 			letters.push(l);
 * 			throttler.queue(deliver);
 * 		}
 */
export class Throttler {

	private activePromise: Promise<any> | null;
	private queuedPromise: Promise<any> | null;
	private queuedPromiseFactory: ITask<Promise<any>> | null;

	private isDisposed = false;

	constructor() {
		this.activePromise = null;
		this.queuedPromise = null;
		this.queuedPromiseFactory = null;
	}

	queue<T>(promiseFactory: ITask<Promise<T>>): Promise<T> {
		if (this.isDisposed) {
			return Promise.reject(new Error('Throttler is disposed'));
		}

		if (this.activePromise) {
			this.queuedPromiseFactory = promiseFactory;

			if (!this.queuedPromise) {
				const onComplete = () => {
					this.queuedPromise = null;

					if (this.isDisposed) {
						return;
					}

					const result = this.queue(this.queuedPromiseFactory!);
					this.queuedPromiseFactory = null;

					return result;
				};

				this.queuedPromise = new Promise(resolve => {
					this.activePromise!.then(onComplete, onComplete).then(resolve);
				});
			}

			return new Promise((resolve, reject) => {
				this.queuedPromise!.then(resolve, reject);
			});
		}

		this.activePromise = promiseFactory();

		return new Promise((resolve, reject) => {
			this.activePromise!.then((result: T) => {
				this.activePromise = null;
				resolve(result);
			}, (err: unknown) => {
				this.activePromise = null;
				reject(err);
			});
		});
	}

	dispose(): void {
		this.isDisposed = true;
	}
}

export function raceTimeout<T>(promise: Promise<T>, timeout: number, onTimeout?: () => void): Promise<T | undefined> {
	let promiseResolve: ((value: T | undefined) => void) | undefined = undefined;

	const timer = setTimeout(() => {
		promiseResolve?.(undefined);
		onTimeout?.();
	}, timeout);

	return Promise.race([
		promise.finally(() => clearTimeout(timer)),
		new Promise<T | undefined>(resolve => promiseResolve = resolve)
	]);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/cancellation.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/cancellation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

const noopDisposable = vscode.Disposable.from();

export const nulToken: vscode.CancellationToken = {
	isCancellationRequested: false,
	onCancellationRequested: () => noopDisposable
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/dispose.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/dispose.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';


export function disposeAll(disposables: Iterable<vscode.Disposable>) {
	const errors: any[] = [];

	for (const disposable of disposables) {
		try {
			disposable.dispose();
		} catch (e) {
			errors.push(e);
		}
	}

	if (errors.length === 1) {
		throw errors[0];
	} else if (errors.length > 1) {
		throw new AggregateError(errors, 'Encountered errors while disposing of store');
	}
}

export interface IDisposable {
	dispose(): void;
}

export abstract class Disposable {
	private _isDisposed = false;

	protected _disposables: vscode.Disposable[] = [];

	public dispose(): any {
		if (this._isDisposed) {
			return;
		}
		this._isDisposed = true;
		disposeAll(this._disposables);
	}

	protected _register<T extends vscode.Disposable>(value: T): T {
		if (this._isDisposed) {
			value.dispose();
		} else {
			this._disposables.push(value);
		}
		return value;
	}

	protected get isDisposed() {
		return this._isDisposed;
	}
}

export class DisposableStore extends Disposable {

	public add<T extends IDisposable>(disposable: T): T {
		this._register(disposable);

		return disposable;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/fs.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/fs.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { getTempFile } from './temp.electron';

export const onCaseInsensitiveFileSystem = (() => {
	let value: boolean | undefined;
	return (): boolean => {
		if (typeof value === 'undefined') {
			if (process.platform === 'win32') {
				value = true;
			} else if (process.platform !== 'darwin') {
				value = false;
			} else {
				const temp = getTempFile('typescript-case-check');
				fs.writeFileSync(temp, '');
				value = fs.existsSync(temp.toUpperCase());
			}
		}
		return value;
	};
})();
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/fs.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/fs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export async function exists(resource: vscode.Uri): Promise<boolean> {
	try {
		const stat = await vscode.workspace.fs.stat(resource);
		// stat.type is an enum flag
		return !!(stat.type & vscode.FileType.File);
	} catch {
		return false;
	}
}

export function looksLikeAbsoluteWindowsPath(path: string): boolean {
	return /^[a-zA-Z]:[\/\\]/.test(path);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/hash.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/hash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Return a hash value for an object.
 */
export function hash(obj: any, hashVal = 0): number {
	switch (typeof obj) {
		case 'object':
			if (obj === null) {
				return numberHash(349, hashVal);
			} else if (Array.isArray(obj)) {
				return arrayHash(obj, hashVal);
			}
			return objectHash(obj, hashVal);
		case 'string':
			return stringHash(obj, hashVal);
		case 'boolean':
			return booleanHash(obj, hashVal);
		case 'number':
			return numberHash(obj, hashVal);
		case 'undefined':
			return 937 * 31;
		default:
			return numberHash(obj, 617);
	}
}

function numberHash(val: number, initialHashVal: number): number {
	return (((initialHashVal << 5) - initialHashVal) + val) | 0;  // hashVal * 31 + ch, keep as int32
}

function booleanHash(b: boolean, initialHashVal: number): number {
	return numberHash(b ? 433 : 863, initialHashVal);
}

function stringHash(s: string, hashVal: number) {
	hashVal = numberHash(149417, hashVal);
	for (let i = 0, length = s.length; i < length; i++) {
		hashVal = numberHash(s.charCodeAt(i), hashVal);
	}
	return hashVal;
}

function arrayHash(arr: any[], initialHashVal: number): number {
	initialHashVal = numberHash(104579, initialHashVal);
	return arr.reduce((hashVal, item) => hash(item, hashVal), initialHashVal);
}

function objectHash(obj: any, initialHashVal: number): number {
	initialHashVal = numberHash(181387, initialHashVal);
	return Object.keys(obj).sort().reduce((hashVal, key) => {
		hashVal = stringHash(key, hashVal);
		return hash(obj[key], hashVal);
	}, initialHashVal);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/lazy.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/lazy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Lazy<T> {

	private _didRun: boolean = false;
	private _value?: T;
	private _error: Error | undefined;

	constructor(
		private readonly executor: () => T,
	) { }

	/**
	 * True if the lazy value has been resolved.
	 */
	get hasValue() { return this._didRun; }

	/**
	 * Get the wrapped value.
	 *
	 * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
	 * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
	 */
	get value(): T {
		if (!this._didRun) {
			try {
				this._value = this.executor();
			} catch (err) {
				this._error = err;
			} finally {
				this._didRun = true;
			}
		}
		if (this._error) {
			throw this._error;
		}
		return this._value!;
	}

	/**
	 * Get the wrapped value without forcing evaluation.
	 */
	get rawValue(): T | undefined { return this._value; }

	map<R>(fn: (value: T) => R): Lazy<R> {
		return new Lazy(() => fn(this.value));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/objects.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/objects.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as array from './arrays';

export function equals(one: any, other: any): boolean {
	if (one === other) {
		return true;
	}
	if (one === null || one === undefined || other === null || other === undefined) {
		return false;
	}
	if (typeof one !== typeof other) {
		return false;
	}
	if (typeof one !== 'object') {
		return false;
	}
	if (Array.isArray(one) !== Array.isArray(other)) {
		return false;
	}

	if (Array.isArray(one)) {
		return array.equals(one, other, equals);
	} else {
		const oneKeys: string[] = [];
		for (const key in one) {
			oneKeys.push(key);
		}
		oneKeys.sort();
		const otherKeys: string[] = [];
		for (const key in other) {
			otherKeys.push(key);
		}
		otherKeys.sort();
		if (!array.equals(oneKeys, otherKeys)) {
			return false;
		}
		return oneKeys.every(key => equals(one[key], other[key]));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/packageInfo.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/packageInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface PackageInfo {
	name: string;
	version: string;
	aiKey: string;
}

export function getPackageInfo(context: vscode.ExtensionContext) {
	const packageJSON = context.extension.packageJSON;
	if (packageJSON && typeof packageJSON === 'object') {
		return {
			name: packageJSON.name ?? '',
			version: packageJSON.version ?? '',
			aiKey: packageJSON.aiKey ?? '',
		};
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/platform.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/platform.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function isWeb(): boolean {
	return !(typeof process === 'object' && !!process.versions.node) && vscode.env.uiKind === vscode.UIKind.Web;
}

export function isWebAndHasSharedArrayBuffers(): boolean {
	return isWeb() && !!(globalThis as Record<string, unknown>)['crossOriginIsolated'];
}

export function supportsReadableByteStreams(): boolean {
	return isWeb() && 'ReadableByteStreamController' in globalThis;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/regexp.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/regexp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/relativePathResolver.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/relativePathResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as vscode from 'vscode';

export class RelativeWorkspacePathResolver {
	public static asAbsoluteWorkspacePath(relativePath: string): string | undefined {
		for (const root of vscode.workspace.workspaceFolders || []) {
			const rootPrefixes = [`./${root.name}/`, `${root.name}/`, `.\\${root.name}\\`, `${root.name}\\`];
			for (const rootPrefix of rootPrefixes) {
				if (relativePath.startsWith(rootPrefix)) {
					return path.join(root.uri.fsPath, relativePath.replace(rootPrefix, ''));
				}
			}
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/resourceMap.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/resourceMap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as fileSchemes from '../configuration/fileSchemes';
import { looksLikeAbsoluteWindowsPath } from './fs';

/**
 * Maps of file resources
 *
 * Attempts to handle correct mapping on both case sensitive and case in-sensitive
 * file systems.
 */
export class ResourceMap<T> {

	private static readonly defaultPathNormalizer = (resource: vscode.Uri): string => {
		if (resource.scheme === fileSchemes.file) {
			return resource.fsPath;
		}
		return resource.toString(true);
	};

	private readonly _map = new Map<string, { readonly resource: vscode.Uri; value: T }>();

	constructor(
		protected readonly _normalizePath: (resource: vscode.Uri) => string | undefined = ResourceMap.defaultPathNormalizer,
		protected readonly config: {
			readonly onCaseInsensitiveFileSystem: boolean;
		},
	) { }

	public get size() {
		return this._map.size;
	}

	public has(resource: vscode.Uri): boolean {
		const file = this.toKey(resource);
		return !!file && this._map.has(file);
	}

	public get(resource: vscode.Uri): T | undefined {
		const file = this.toKey(resource);
		if (!file) {
			return undefined;
		}
		const entry = this._map.get(file);
		return entry ? entry.value : undefined;
	}

	public set(resource: vscode.Uri, value: T) {
		const file = this.toKey(resource);
		if (!file) {
			return;
		}
		const entry = this._map.get(file);
		if (entry) {
			entry.value = value;
		} else {
			this._map.set(file, { resource, value });
		}
	}

	public delete(resource: vscode.Uri): void {
		const file = this.toKey(resource);
		if (file) {
			this._map.delete(file);
		}
	}

	public clear(): void {
		this._map.clear();
	}

	public values(): Iterable<T> {
		return Array.from(this._map.values(), x => x.value);
	}

	public entries(): Iterable<{ resource: vscode.Uri; value: T }> {
		return this._map.values();
	}

	private toKey(resource: vscode.Uri): string | undefined {
		const key = this._normalizePath(resource);
		if (!key) {
			return key;
		}
		return this.isCaseInsensitivePath(key) ? key.toLowerCase() : key;
	}

	private isCaseInsensitivePath(path: string) {
		if (looksLikeAbsoluteWindowsPath(path)) {
			return true;
		}
		return path[0] === '/' && this.config.onCaseInsensitiveFileSystem;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/utils/temp.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/utils/temp.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Lazy } from './lazy';

function makeRandomHexString(length: number): string {
	const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
	let result = '';
	for (let i = 0; i < length; i++) {
		const idx = Math.floor(chars.length * Math.random());
		result += chars[idx];
	}
	return result;
}

const rootTempDir = new Lazy(() => {
	const filename = `vscode-typescript${process.platform !== 'win32' && process.getuid ? process.getuid() : ''}`;
	return path.join(os.tmpdir(), filename);
});

export const instanceTempDir = new Lazy(() => {
	const dir = path.join(rootTempDir.value, makeRandomHexString(20));
	fs.mkdirSync(dir, { recursive: true });
	return dir;
});

export function getTempFile(prefix: string): string {
	return path.join(instanceTempDir.value, `${prefix}-${makeRandomHexString(20)}.tmp`);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/test-workspace/bar.ts]---
Location: vscode-main/extensions/typescript-language-features/test-workspace/bar.ts

```typescript
// export const foo = 1;
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/test-workspace/tsconfig.json]---
Location: vscode-main/extensions/typescript-language-features/test-workspace/tsconfig.json

```json
{
	"compilerOptions": {
		"target": "es2018",
		"noEmit": true
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/README.md]---
Location: vscode-main/extensions/typescript-language-features/web/README.md

```markdown
# vscode-wasm-typescript

Language server host for typescript using vscode's sync-api in the browser.

## Getting up and running

To test this out, you'll need three shells:

1. `npm i` for vscode itself
2. `npm run watch-web` for the web side
3. `node <root>/scripts/code-web.js --coi`

The last command will open a browser window. You'll want to add `?vscode-coi=`
to the end. This is for enabling shared array buffers. So, for example:
`http://localhost:8080/?vscode-coi=`.

### Working on type acquisition

In order to work with web's new type acquisition, you'll need to enable
`TypeScript > Experimental > Tsserver > Web: Enable Project Wide Intellisense`
in your VS Code options (`Ctrl-,`), you may need to reload the page.

This happens when working in a regular `.js` file on a dependency without
declared types. You should be able to open `file.js` and write something like
`import lodash from 'lodash';` at the top of the file and, after a moment, get
types and other intellisense features (like Go To Def/Source Def) working as
expected. This scenario works off Tsserver's own Automatic Type Acquisition
capabilities, and simulates a "global" types cache stored at
`/vscode-global-typings/ts-nul-authority/project`, which is backed by an
in-memory `MemFs` `FileSystemProvider`.

### Simulated `node_modules`

For regular `.ts` files, instead of going through Tsserver's type acquisition,
a separate `AutoInstallerFs` is used to create a "virtual" `node_modules` that
extracts desired packages on demand, to an underlying `MemFs`. This will
happen any time a filesystem operation is done inside a `node_modules` folder
across any project in the workspace, and will use the "real" `package.json`
(and, if present, `package-lock.json`) to resolve the dependency tree.

A fallback is then set up such that when a URI like
`memfs:/path/to/node_modules/lodash/lodash.d.ts` is accessed, that gets
redirected to
`vscode-node-modules:/ts-nul-authority/memfs/ts-nul-authority/path/to/node_modules/lodash/lodash.d.ts`,
which will be sent to the `AutoInstallerFs`.
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/tsconfig.json]---
Location: vscode-main/extensions/typescript-language-features/web/tsconfig.json

```json
{
	"extends": "../../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "../../out",
		"esModuleInterop": true,
		"types": [
			"node"
		]
	},
	"include": [
		"src/**/*.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/fileWatcherManager.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/fileWatcherManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as ts from 'typescript/lib/tsserverlibrary';
import { URI } from 'vscode-uri';
import { Logger } from './logging';
import { PathMapper, fromResource, looksLikeLibDtsPath, looksLikeNodeModules, mapUri } from './pathMapper';

/**
 * Copied from `ts.FileWatcherEventKind` to avoid direct dependency.
 */
enum FileWatcherEventKind {
	Created = 0,
	Changed = 1,
	Deleted = 2,
}

export class FileWatcherManager {
	private static readonly noopWatcher: ts.FileWatcher = { close() { } };

	private readonly watchFiles = new Map<string, { callback: ts.FileWatcherCallback; pollingInterval?: number; options?: ts.WatchOptions }>();
	private readonly watchDirectories = new Map<string, { callback: ts.DirectoryWatcherCallback; recursive?: boolean; options?: ts.WatchOptions }>();

	private watchId = 0;

	constructor(
		private readonly watchPort: MessagePort,
		extensionUri: URI,
		private readonly enabledExperimentalTypeAcquisition: boolean,
		private readonly pathMapper: PathMapper,
		private readonly logger: Logger
	) {
		watchPort.onmessage = (e: any) => this.updateWatch(e.data.event, URI.from(e.data.uri), extensionUri);
	}

	watchFile(path: string, callback: ts.FileWatcherCallback, pollingInterval?: number, options?: ts.WatchOptions): ts.FileWatcher {
		if (looksLikeLibDtsPath(path)) { // We don't support watching lib files on web since they are readonly
			return FileWatcherManager.noopWatcher;
		}

		this.logger.logVerbose('fs.watchFile', { path });

		let uri: URI;
		try {
			uri = this.pathMapper.toResource(path);
		} catch (e) {
			console.error(e);
			return FileWatcherManager.noopWatcher;
		}

		this.watchFiles.set(path, { callback, pollingInterval, options });
		const watchIds = [++this.watchId];
		this.watchPort.postMessage({ type: 'watchFile', uri: uri, id: watchIds[0] });
		if (this.enabledExperimentalTypeAcquisition && looksLikeNodeModules(path) && uri.scheme !== 'vscode-global-typings') {
			watchIds.push(++this.watchId);
			this.watchPort.postMessage({ type: 'watchFile', uri: mapUri(uri, 'vscode-global-typings'), id: watchIds[1] });
		}
		return {
			close: () => {
				this.logger.logVerbose('fs.watchFile.close', { path });
				this.watchFiles.delete(path);
				for (const id of watchIds) {
					this.watchPort.postMessage({ type: 'dispose', id });
				}
			}
		};
	}

	watchDirectory(path: string, callback: ts.DirectoryWatcherCallback, recursive?: boolean, options?: ts.WatchOptions): ts.FileWatcher {
		this.logger.logVerbose('fs.watchDirectory', { path });

		let uri: URI;
		try {
			uri = this.pathMapper.toResource(path);
		} catch (e) {
			console.error(e);
			return FileWatcherManager.noopWatcher;
		}

		this.watchDirectories.set(path, { callback, recursive, options });
		const watchIds = [++this.watchId];
		this.watchPort.postMessage({ type: 'watchDirectory', recursive, uri, id: this.watchId });
		return {
			close: () => {
				this.logger.logVerbose('fs.watchDirectory.close', { path });

				this.watchDirectories.delete(path);
				for (const id of watchIds) {
					this.watchPort.postMessage({ type: 'dispose', id });
				}
			}
		};
	}

	private updateWatch(event: 'create' | 'change' | 'delete', uri: URI, extensionUri: URI) {
		const kind = this.toTsWatcherKind(event);
		const path = fromResource(extensionUri, uri);

		const fileWatcher = this.watchFiles.get(path);
		if (fileWatcher) {
			fileWatcher.callback(path, kind);
			return;
		}

		for (const watch of Array.from(this.watchDirectories.keys()).filter(dir => path.startsWith(dir))) {
			this.watchDirectories.get(watch)!.callback(path);
			return;
		}

		console.error(`no watcher found for ${path}`);
	}

	private toTsWatcherKind(event: 'create' | 'change' | 'delete') {
		if (event === 'create') {
			return FileWatcherEventKind.Created;
		} else if (event === 'change') {
			return FileWatcherEventKind.Changed;
		} else if (event === 'delete') {
			return FileWatcherEventKind.Deleted;
		}
		throw new Error(`Unknown event: ${event}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/logging.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/logging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as ts from 'typescript/lib/tsserverlibrary';

/**
 * Matches the ts.server.LogLevel enum
 */
export enum LogLevel {
	terse = 0,
	normal = 1,
	requestTime = 2,
	verbose = 3,
}

export class Logger {
	public readonly tsLogger: ts.server.Logger;

	constructor(logLevel: LogLevel | undefined) {
		const doLog = typeof logLevel === 'undefined'
			? (_message: string) => { }
			: (message: string) => { postMessage({ type: 'log', body: message }); };

		this.tsLogger = {
			close: () => { },
			hasLevel: level => typeof logLevel === 'undefined' ? false : level <= logLevel,
			loggingEnabled: () => true,
			perftrc: () => { },
			info: doLog,
			msg: doLog,
			startGroup: () => { },
			endGroup: () => { },
			getLogFileName: () => undefined
		};
	}

	log(level: LogLevel, message: string, data?: any) {
		if (this.tsLogger.hasLevel(level)) {
			this.tsLogger.info(message + (data ? ' ' + JSON.stringify(data) : ''));
		}
	}

	logNormal(message: string, data?: any) {
		this.log(LogLevel.normal, message, data);
	}

	logVerbose(message: string, data?: any) {
		this.log(LogLevel.verbose, message, data);
	}
}

export function parseLogLevel(input: string | undefined): LogLevel | undefined {
	switch (input) {
		case 'normal': return LogLevel.normal;
		case 'terse': return LogLevel.terse;
		case 'verbose': return LogLevel.verbose;
		default: return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/pathMapper.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/pathMapper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from 'vscode-uri';

export class PathMapper {

	private readonly projectRootPaths = new Map</* original path*/ string, /* parsed URI */ URI>();

	constructor(
		private readonly extensionUri: URI
	) { }

	/**
	 * Copied from toResource in typescriptServiceClient.ts
	 */
	toResource(filepath: string): URI {
		if (looksLikeLibDtsPath(filepath) || looksLikeLocaleResourcePath(filepath)) {
			return URI.from({
				scheme: this.extensionUri.scheme,
				authority: this.extensionUri.authority,
				path: this.extensionUri.path + '/dist/browser/typescript/' + filepath.slice(1)
			});
		}

		const uri = filePathToResourceUri(filepath);
		if (!uri) {
			throw new Error(`Could not parse path ${filepath}`);
		}

		// Check if TS is trying to read a file outside of the project root.
		// We allow reading files on unknown scheme as these may be loose files opened by the user.
		// However we block reading files on schemes that are on a known file system with an unknown root
		let allowRead: 'implicit' | 'block' | 'allow' = 'implicit';
		for (const projectRoot of this.projectRootPaths.values()) {
			if (uri.scheme === projectRoot.scheme) {
				if (uri.toString().startsWith(projectRoot.toString())) {
					allowRead = 'allow';
					break;
				}

				// Tentatively block the read but a future loop may allow it
				allowRead = 'block';
			}
		}

		if (allowRead === 'block') {
			throw new AccessOutsideOfRootError(filepath, Array.from(this.projectRootPaths.keys()));
		}

		return uri;
	}

	addProjectRoot(projectRootPath: string) {
		const uri = filePathToResourceUri(projectRootPath);
		if (uri) {
			this.projectRootPaths.set(projectRootPath, uri);
		}
	}
}

class AccessOutsideOfRootError extends Error {
	constructor(
		public readonly filepath: string,
		public readonly projectRootPaths: readonly string[]
	) {
		super(`Could not read file outside of project root ${filepath}`);
	}
}

export function fromResource(extensionUri: URI, uri: URI) {
	if (uri.scheme === extensionUri.scheme
		&& uri.authority === extensionUri.authority
		&& uri.path.startsWith(extensionUri.path + '/dist/browser/typescript/lib.')
		&& uri.path.endsWith('.d.ts')) {
		return uri.path;
	}
	return `/${uri.scheme}/${uri.authority}${uri.path}`;
}

export function looksLikeLibDtsPath(filepath: string) {
	return filepath.startsWith('/lib.') && filepath.endsWith('.d.ts');
}

export function looksLikeLocaleResourcePath(filepath: string) {
	return !!filepath.match(/^\/[a-zA-Z]+(-[a-zA-Z]+)?\/diagnosticMessages\.generated\.json$/);
}

export function looksLikeNodeModules(filepath: string) {
	return filepath.includes('/node_modules');
}

function filePathToResourceUri(filepath: string): URI | undefined {
	const parts = filepath.match(/^\/([^\/]+)\/([^\/]*)(?:\/(.+))?$/);
	if (!parts) {
		return undefined;
	}

	const scheme = parts[1];
	const authority = parts[2] === 'ts-nul-authority' ? '' : parts[2];
	const path = parts[3];
	return URI.from({ scheme, authority, path: (path ? '/' + path : path) });
}

export function mapUri(uri: URI, mappedScheme: string): URI {
	if (uri.scheme === 'vscode-global-typings') {
		throw new Error('can\'t map vscode-global-typings');
	}
	if (!uri.authority) {
		uri = uri.with({ authority: 'ts-nul-authority' });
	}
	uri = uri.with({ scheme: mappedScheme, path: `/${uri.scheme}/${uri.authority || 'ts-nul-authority'}${uri.path}` });

	return uri;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/serverHost.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/serverHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ApiClient, FileStat, FileType, Requests } from '@vscode/sync-api-client';
import { ClientConnection } from '@vscode/sync-api-common/browser';
import { basename } from 'path';
import type * as ts from 'typescript/lib/tsserverlibrary';
import { FileWatcherManager } from './fileWatcherManager';
import { Logger } from './logging';
import { PathMapper, looksLikeNodeModules, mapUri } from './pathMapper';
import { findArgument, hasArgument } from './util/args';
import { URI } from 'vscode-uri';

type TsModule = typeof ts;

interface TsInternals extends TsModule {
	combinePaths(path: string, ...paths: (string | undefined)[]): string;

	matchFiles(
		path: string,
		extensions: readonly string[] | undefined,
		excludes: readonly string[] | undefined,
		includes: readonly string[] | undefined,
		useCaseSensitiveFileNames: boolean,
		currentDirectory: string,
		depth: number | undefined,
		getFileSystemEntries: (path: string) => { files: readonly string[]; directories: readonly string[] },
		realpath: (path: string) => string
	): string[];

	generateDjb2Hash(data: string): string;

	memoize: <T>(callback: () => T) => () => T;
	ensureTrailingDirectorySeparator: (path: string) => string;
	getDirectoryPath: (path: string) => string;
	directorySeparator: string;
}

type ServerHostWithImport = ts.server.ServerHost & { importPlugin(root: string, moduleName: string): Promise<ts.server.ModuleImportResult> };

function createServerHost(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	logger: Logger,
	apiClient: ApiClient | undefined,
	args: readonly string[],
	watchManager: FileWatcherManager,
	pathMapper: PathMapper,
	enabledExperimentalTypeAcquisition: boolean,
	exit: () => void,
): ServerHostWithImport {
	const currentDirectory = '/';
	const fs = apiClient?.vscode.workspace.fileSystem;

	// Internals
	const combinePaths = (ts as TsInternals).combinePaths;
	const byteOrderMarkIndicator = '\uFEFF';
	const matchFiles = (ts as TsInternals).matchFiles;
	const generateDjb2Hash = (ts as TsInternals).generateDjb2Hash;

	// Legacy web
	const memoize = (ts as TsInternals).memoize;
	const ensureTrailingDirectorySeparator = (ts as TsInternals).ensureTrailingDirectorySeparator;
	const getDirectoryPath = (ts as TsInternals).getDirectoryPath;
	const directorySeparator = (ts as TsInternals).directorySeparator;
	const executingFilePath = findArgument(args, '--executingFilePath') || location + '';
	const getExecutingDirectoryPath = memoize(() => memoize(() => ensureTrailingDirectorySeparator(getDirectoryPath(executingFilePath))));
	const getWebPath = (path: string) => path.startsWith(directorySeparator) ? path.replace(directorySeparator, getExecutingDirectoryPath()) : undefined;

	const textDecoder = new TextDecoder();
	const textEncoder = new TextEncoder();

	return {
		watchFile: watchManager.watchFile.bind(watchManager),
		watchDirectory: watchManager.watchDirectory.bind(watchManager),
		setTimeout(callback: (...args: unknown[]) => void, ms: number, ...args: unknown[]): unknown {
			return setTimeout(callback, ms, ...args);
		},
		clearTimeout(timeoutId: any): void {
			clearTimeout(timeoutId);
		},
		setImmediate(callback: (...args: unknown[]) => void, ...args: unknown[]): unknown {
			return this.setTimeout(callback, 0, ...args);
		},
		clearImmediate(timeoutId: unknown): void {
			this.clearTimeout(timeoutId);
		},
		importPlugin: async (root, moduleName) => {
			const packageRoot = combinePaths(root, moduleName);

			let packageJson: any | undefined;
			try {
				const packageJsonResponse = await fetch(combinePaths(packageRoot, 'package.json'));
				packageJson = await packageJsonResponse.json();
			} catch (e) {
				return { module: undefined, error: new Error(`Could not load plugin. Could not load 'package.json'.`) };
			}

			const browser = packageJson.browser;
			if (!browser) {
				return { module: undefined, error: new Error(`Could not load plugin. No 'browser' field found in package.json.`) };
			}

			const scriptPath = combinePaths(packageRoot, browser);
			try {
				const { default: module } = await import(/* webpackIgnore: true */ scriptPath);
				return { module, error: undefined };
			} catch (e) {
				return { module: undefined, error: e };
			}
		},
		args: Array.from(args),
		newLine: '\n',
		useCaseSensitiveFileNames: true,
		write: s => {
			apiClient?.vscode.terminal.write(s);
		},
		writeOutputIsTTY() {
			return true;
		},
		readFile(path) {
			logger.logVerbose('fs.readFile', { path });

			if (!fs) {
				const webPath = getWebPath(path);
				if (webPath) {
					const request = new XMLHttpRequest();
					request.open('GET', webPath, /* asynchronous */ false);
					request.send();
					return request.status === 200 ? request.responseText : undefined;
				} else {
					return undefined;
				}
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return undefined;
			}

			let contents: Uint8Array | undefined;
			try {
				// We need to slice the bytes since we can't pass a shared array to text decoder
				contents = fs.readFile(uri);
			} catch (error) {
				if (!enabledExperimentalTypeAcquisition) {
					return undefined;
				}
				try {
					contents = fs.readFile(mapUri(uri, 'vscode-node-modules'));
				} catch (e) {
					return undefined;
				}
			}
			return textDecoder.decode(contents.slice());
		},
		getFileSize(path) {
			logger.logVerbose('fs.getFileSize', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			const uri = pathMapper.toResource(path);
			let ret = 0;
			try {
				ret = fs.stat(uri).size;
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						ret = fs.stat(mapUri(uri, 'vscode-node-modules')).size;
					} catch (_error) {
					}
				}
			}
			return ret;
		},
		writeFile(path, data, writeByteOrderMark) {
			logger.logVerbose('fs.writeFile', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			if (writeByteOrderMark) {
				data = byteOrderMarkIndicator + data;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return;
			}
			const encoded = textEncoder.encode(data);
			try {
				fs.writeFile(uri, encoded);
				const name = basename(uri.path);
				if (uri.scheme !== 'vscode-global-typings' && (name === 'package.json' || name === 'package-lock.json' || name === 'package-lock.kdl')) {
					fs.writeFile(mapUri(uri, 'vscode-node-modules'), encoded);
				}
			} catch (error) {
				console.error('fs.writeFile', { path, error });
			}
		},
		resolvePath(path: string): string {
			return path;
		},
		fileExists(path: string): boolean {
			logger.logVerbose('fs.fileExists', { path });

			if (!fs) {
				const webPath = getWebPath(path);
				if (!webPath) {
					return false;
				}

				const request = new XMLHttpRequest();
				request.open('HEAD', webPath, /* asynchronous */ false);
				request.send();
				return request.status === 200;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (e) {
				return false;
			}
			let ret = false;
			try {
				ret = fs.stat(uri).type === FileType.File;
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						ret = fs.stat(mapUri(uri, 'vscode-node-modules')).type === FileType.File;
					} catch (_error) {
					}
				}
			}
			return ret;
		},
		directoryExists(path: string): boolean {
			logger.logVerbose('fs.directoryExists', { path });

			if (!fs) {
				return false;
			}

			let uri;
			try {
				uri = pathMapper.toResource(path);
			} catch (_error) {
				return false;
			}

			let stat: FileStat | undefined = undefined;
			try {
				stat = fs.stat(uri);
			} catch (_error) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						stat = fs.stat(mapUri(uri, 'vscode-node-modules'));
					} catch (_error) {
					}
				}
			}
			if (stat) {
				if (path.startsWith('/https') && !path.endsWith('.d.ts')) {
					// TODO: Hack, https 'file system' can't actually tell what is a file vs directory
					return stat.type === FileType.File || stat.type === FileType.Directory;
				}

				return stat.type === FileType.Directory;
			} else {
				return false;
			}
		},
		createDirectory(path: string): void {
			logger.logVerbose('fs.createDirectory', { path });
			if (!fs) {
				throw new Error('not supported');
			}

			try {
				fs.createDirectory(pathMapper.toResource(path));
			} catch (error) {
				logger.logNormal('Error fs.createDirectory', { path, error: error + '' });
			}
		},
		getExecutingFilePath(): string {
			return currentDirectory;
		},
		getCurrentDirectory(): string {
			return currentDirectory;
		},
		getDirectories(path: string): string[] {
			logger.logVerbose('fs.getDirectories', { path });

			return getAccessibleFileSystemEntries(path).directories.slice();
		},
		readDirectory(path: string, extensions?: readonly string[], excludes?: readonly string[], includes?: readonly string[], depth?: number): string[] {
			logger.logVerbose('fs.readDirectory', { path });

			return matchFiles(path, extensions, excludes, includes, /*useCaseSensitiveFileNames*/ true, currentDirectory, depth, getAccessibleFileSystemEntries, realpath);
		},
		getModifiedTime(path: string): Date | undefined {
			logger.logVerbose('fs.getModifiedTime', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			const uri = pathMapper.toResource(path);
			let s: FileStat | undefined = undefined;
			try {
				s = fs.stat(uri);
			} catch (_e) {
				if (enabledExperimentalTypeAcquisition) {
					try {
						s = fs.stat(mapUri(uri, 'vscode-node-modules'));
					} catch (_e) {
					}
				}
			}
			return s && new Date(s.mtime);
		},
		deleteFile(path: string): void {
			logger.logVerbose('fs.deleteFile', { path });

			if (!fs) {
				throw new Error('not supported');
			}

			try {
				fs.delete(pathMapper.toResource(path));
			} catch (error) {
				logger.logNormal('Error fs.deleteFile', { path, error: error + '' });
			}
		},
		createHash: generateDjb2Hash,
		/** This must be cryptographically secure.
			The browser implementation, crypto.subtle.digest, is async so not possible to call from tsserver. */
		createSHA256Hash: undefined,
		exit: exit,
		realpath,
		base64decode: input => Buffer.from(input, 'base64').toString('utf8'),
		base64encode: input => Buffer.from(input).toString('base64'),
	};

	// For module resolution only. `node_modules` is also automatically mapped
	// as if all node_modules-like paths are symlinked.
	function realpath(path: string): string {
		if (path.startsWith('/^/')) {
			// In memory file. No mapping needed
			return path;
		}

		const isNm = looksLikeNodeModules(path)
			&& !path.startsWith('/vscode-global-typings/')
			// Handle the case where a local folder has been opened in VS Code
			// In these cases we do not want to use the mapped node_module
			&& !path.startsWith('/file/');

		// skip paths without .. or ./ or /
		if (!isNm && !path.match(/\.\.|\/\.|\.\//)) {
			return path;
		}

		let uri: URI;
		try {
			uri = pathMapper.toResource(path);
		} catch {
			return path;
		}

		if (isNm) {
			uri = mapUri(uri, 'vscode-node-modules');
		}
		const out = [uri.scheme];
		if (uri.authority) { out.push(uri.authority); }
		for (const part of uri.path.split('/')) {
			switch (part) {
				case '':
				case '.':
					break;
				case '..':
					//delete if there is something there to delete
					out.pop();
					break;
				default:
					out.push(part);
			}
		}
		return '/' + out.join('/');
	}

	function getAccessibleFileSystemEntries(path: string): { files: readonly string[]; directories: readonly string[] } {
		if (!fs) {
			throw new Error('not supported');
		}

		const uri = pathMapper.toResource(path || '.');
		let entries: [string, FileType][] = [];
		const files: string[] = [];
		const directories: string[] = [];
		try {
			entries = fs.readDirectory(uri);
		} catch (_e) {
			try {
				entries = fs.readDirectory(mapUri(uri, 'vscode-node-modules'));
			} catch (_e) {
			}
		}
		for (const [entry, type] of entries) {
			// This is necessary because on some file system node fails to exclude
			// '.' and '..'. See https://github.com/nodejs/node/issues/4002
			if (entry === '.' || entry === '..') {
				continue;
			}

			if (type === FileType.File) {
				files.push(entry);
			}
			else if (type === FileType.Directory) {
				directories.push(entry);
			}
		}
		files.sort();
		directories.sort();
		return { files, directories };
	}
}

export async function createSys(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	args: readonly string[],
	fsPort: MessagePort,
	logger: Logger,
	watchManager: FileWatcherManager,
	pathMapper: PathMapper,
	onExit: () => void,
) {
	if (hasArgument(args, '--enableProjectWideIntelliSenseOnWeb')) {
		const enabledExperimentalTypeAcquisition = hasArgument(args, '--experimentalTypeAcquisition');
		const connection = new ClientConnection<Requests>(fsPort);
		await connection.serviceReady();

		const apiClient = new ApiClient(connection);
		const fs = apiClient.vscode.workspace.fileSystem;
		const sys = createServerHost(ts, logger, apiClient, args, watchManager, pathMapper, enabledExperimentalTypeAcquisition, onExit);
		return { sys, fs };
	} else {
		return { sys: createServerHost(ts, logger, undefined, args, watchManager, pathMapper, false, onExit) };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/wasmCancellationToken.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/wasmCancellationToken.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as ts from 'typescript/lib/tsserverlibrary';

export class WasmCancellationToken implements ts.server.ServerCancellationToken {
	shouldCancel: (() => boolean) | undefined;
	currentRequestId: number | undefined = undefined;

	setRequest(requestId: number) {
		this.currentRequestId = requestId;
	}

	resetRequest(requestId: number) {
		if (requestId === this.currentRequestId) {
			this.currentRequestId = undefined;
		} else {
			throw new Error(`Mismatched request id, expected ${this.currentRequestId} but got ${requestId}`);
		}
	}

	isCancellationRequested(): boolean {
		return this.currentRequestId !== undefined && !!this.shouldCancel && this.shouldCancel();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/webServer.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/webServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference lib='webworker' />

import ts from 'typescript/lib/tsserverlibrary';
import { URI } from 'vscode-uri';
import { FileWatcherManager } from './fileWatcherManager';
import { Logger, parseLogLevel } from './logging';
import { PathMapper } from './pathMapper';
import { createSys } from './serverHost';
import { findArgument, findArgumentStringArray, hasArgument, parseServerMode } from './util/args';
import { StartSessionOptions, startWorkerSession } from './workerSession';

type TsModule = typeof ts;

interface TsInternals extends TsModule {
	setSys(sys: ts.System): void;
}

const setSys: (s: ts.System) => void = (ts as TsInternals).setSys;

async function initializeSession(
	args: readonly string[],
	extensionUri: URI,
	ports: { tsserver: MessagePort; sync: MessagePort; watcher: MessagePort },
): Promise<void> {
	const logLevel = parseLogLevel(findArgument(args, '--logVerbosity'));
	const logger = new Logger(logLevel);

	const modeOrUnknown = parseServerMode(args);
	const serverMode = typeof modeOrUnknown === 'number' ? modeOrUnknown : undefined;
	const unknownServerMode = typeof modeOrUnknown === 'string' ? modeOrUnknown : undefined;
	logger.tsLogger.info(`Starting TS Server`);
	logger.tsLogger.info(`Version: 0.0.0`);
	logger.tsLogger.info(`Arguments: ${args.join(' ')}`);
	logger.tsLogger.info(`ServerMode: ${serverMode} unknownServerMode: ${unknownServerMode}`);
	const sessionOptions = parseSessionOptions(args, serverMode);

	const enabledExperimentalTypeAcquisition = hasArgument(args, '--enableProjectWideIntelliSenseOnWeb') && hasArgument(args, '--experimentalTypeAcquisition');

	const pathMapper = new PathMapper(extensionUri);
	const watchManager = new FileWatcherManager(ports.watcher, extensionUri, enabledExperimentalTypeAcquisition, pathMapper, logger);

	const { sys, fs } = await createSys(ts, args, ports.sync, logger, watchManager, pathMapper, () => {
		removeEventListener('message', listener);
	});
	setSys(sys);

	const localeStr = findArgument(args, '--locale');
	if (localeStr) {
		ts.validateLocaleAndSetLanguage(localeStr, sys);
	}

	startWorkerSession(ts, sys, fs, sessionOptions, ports.tsserver, pathMapper, logger);
}

function parseSessionOptions(args: readonly string[], serverMode: ts.LanguageServiceMode | undefined): StartSessionOptions {
	return {
		globalPlugins: findArgumentStringArray(args, '--globalPlugins'),
		pluginProbeLocations: findArgumentStringArray(args, '--pluginProbeLocations'),
		allowLocalPluginLoads: hasArgument(args, '--allowLocalPluginLoads'),
		useSingleInferredProject: hasArgument(args, '--useSingleInferredProject'),
		useInferredProjectPerProjectRoot: hasArgument(args, '--useInferredProjectPerProjectRoot'),
		suppressDiagnosticEvents: hasArgument(args, '--suppressDiagnosticEvents'),
		noGetErrOnBackgroundUpdate: hasArgument(args, '--noGetErrOnBackgroundUpdate'),
		serverMode,
		disableAutomaticTypingAcquisition: hasArgument(args, '--disableAutomaticTypingAcquisition'),
	};
}

let hasInitialized = false;
const listener = async (e: any) => {
	if (!hasInitialized) {
		hasInitialized = true;
		if ('args' in e.data) {
			const args = e.data.args;
			const extensionUri = URI.from(e.data.extensionUri);
			const [sync, tsserver, watcher] = e.ports as MessagePort[];
			await initializeSession(args, extensionUri, { sync, tsserver, watcher });
		} else {
			console.error('unexpected message in place of initial message: ' + JSON.stringify(e.data));
		}
		return;
	}
	console.error(`unexpected message on main channel: ${JSON.stringify(e)}`);
};
addEventListener('message', listener);
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/workerSession.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/workerSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { FileSystem } from '@vscode/sync-api-client';
import type * as ts from 'typescript/lib/tsserverlibrary';
import { Logger } from './logging';
import { WebTypingsInstallerClient } from './typingsInstaller/typingsInstaller';
import { hrtime } from './util/hrtime';
import { WasmCancellationToken } from './wasmCancellationToken';
import { PathMapper } from './pathMapper';

export interface StartSessionOptions {
	readonly globalPlugins: ts.server.SessionOptions['globalPlugins'];
	readonly pluginProbeLocations: ts.server.SessionOptions['pluginProbeLocations'];
	readonly allowLocalPluginLoads: ts.server.SessionOptions['allowLocalPluginLoads'];
	readonly useSingleInferredProject: ts.server.SessionOptions['useSingleInferredProject'];
	readonly useInferredProjectPerProjectRoot: ts.server.SessionOptions['useInferredProjectPerProjectRoot'];
	readonly suppressDiagnosticEvents: ts.server.SessionOptions['suppressDiagnosticEvents'];
	readonly noGetErrOnBackgroundUpdate: ts.server.SessionOptions['noGetErrOnBackgroundUpdate'];
	readonly serverMode: ts.server.SessionOptions['serverMode'];
	readonly disableAutomaticTypingAcquisition: boolean;
}

type ServerModule = typeof ts.server;

interface TsServerInternals extends ServerModule {
	indent(str: string): string;
}

export function startWorkerSession(
	ts: typeof import('typescript/lib/tsserverlibrary'),
	host: ts.server.ServerHost,
	fs: FileSystem | undefined,
	options: StartSessionOptions,
	port: MessagePort,
	pathMapper: PathMapper,
	logger: Logger,
): void {
	const indent = (ts.server as TsServerInternals).indent;

	const worker = new class WorkerSession extends ts.server.Session<{}> {

		private readonly wasmCancellationToken: WasmCancellationToken;
		private readonly listener: (message: any) => void;

		constructor() {
			const cancellationToken = new WasmCancellationToken();
			const typingsInstaller = options.disableAutomaticTypingAcquisition || !fs ? ts.server.nullTypingsInstaller : new WebTypingsInstallerClient(host, '/vscode-global-typings/ts-nul-authority/projects');

			super({
				host,
				cancellationToken,
				...options,
				typingsInstaller,
				byteLength: () => { throw new Error('Not implemented'); }, // Formats the message text in send of Session which is overridden in this class so not needed
				hrtime,
				logger: logger.tsLogger,
				canUseEvents: true,
			});
			this.wasmCancellationToken = cancellationToken;

			this.listener = (message: any) => {
				// TEMP fix since Cancellation.retrieveCheck is not correct
				function retrieveCheck2(data: any) {
					if (!globalThis.crossOriginIsolated || !(data.$cancellationData instanceof SharedArrayBuffer)) {
						return () => false;
					}
					const typedArray = new Int32Array(data.$cancellationData, 0, 1);
					return () => {
						return Atomics.load(typedArray, 0) === 1;
					};
				}

				const shouldCancel = retrieveCheck2(message.data);
				if (shouldCancel) {
					this.wasmCancellationToken.shouldCancel = shouldCancel;
				}

				try {
					if (message.data.command === 'updateOpen') {
						const args = message.data.arguments as ts.server.protocol.UpdateOpenRequestArgs;
						for (const open of args.openFiles ?? []) {
							if (open.projectRootPath) {
								pathMapper.addProjectRoot(open.projectRootPath);
							}
						}
					}
				} catch {
					// Noop
				}

				this.onMessage(message.data);
			};
		}

		public override send(msg: ts.server.protocol.Message) {
			if (msg.type === 'event' && !this.canUseEvents) {
				if (this.logger.hasLevel(ts.server.LogLevel.verbose)) {
					this.logger.info(`Session does not support events: ignored event: ${JSON.stringify(msg)}`);
				}
				return;
			}
			if (this.logger.hasLevel(ts.server.LogLevel.verbose)) {
				this.logger.info(`${msg.type}:${indent(JSON.stringify(msg))}`);
			}
			port.postMessage(msg);
		}

		protected override parseMessage(message: {}): ts.server.protocol.Request {
			return message as ts.server.protocol.Request;
		}

		protected override toStringMessage(message: {}) {
			return JSON.stringify(message, undefined, 2);
		}

		override exit() {
			this.logger.info('Exiting...');
			port.removeEventListener('message', this.listener);
			this.projectService.closeLog();
			close();
		}

		listen() {
			this.logger.info(`webServer.ts: tsserver starting to listen for messages on 'message'...`);
			port.onmessage = this.listener;
		}
	}();

	worker.listen();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/typingsInstaller/jsTyping.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/typingsInstaller/jsTyping.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// Utilities copied from ts.JsTyping internals

export const enum NameValidationResult {
	Ok,
	EmptyName,
	NameTooLong,
	NameStartsWithDot,
	NameStartsWithUnderscore,
	NameContainsNonURISafeCharacters
}

type PackageNameValidationResult = NameValidationResult | ScopedPackageNameValidationResult;

interface ScopedPackageNameValidationResult {
	readonly name: string;
	readonly isScopeName: boolean;
	readonly result: NameValidationResult;
}

enum CharacterCodes {
	_ = 0x5F,
	dot = 0x2E,
}

const maxPackageNameLength = 214;

// Validates package name using rules defined at https://docs.npmjs.com/files/package.json
// Copied from typescript/jsTypings.ts
export function validatePackageNameWorker(packageName: string, supportScopedPackage: true): ScopedPackageNameValidationResult;
export function validatePackageNameWorker(packageName: string, supportScopedPackage: false): NameValidationResult;
export function validatePackageNameWorker(packageName: string, supportScopedPackage: boolean): PackageNameValidationResult {
	if (!packageName) {
		return NameValidationResult.EmptyName;
	}
	if (packageName.length > maxPackageNameLength) {
		return NameValidationResult.NameTooLong;
	}
	if (packageName.charCodeAt(0) === CharacterCodes.dot) {
		return NameValidationResult.NameStartsWithDot;
	}
	if (packageName.charCodeAt(0) === CharacterCodes._) {
		return NameValidationResult.NameStartsWithUnderscore;
	}

	// check if name is scope package like: starts with @ and has one '/' in the middle
	// scoped packages are not currently supported
	if (supportScopedPackage) {
		const matches = /^@([^/]+)\/([^/]+)$/.exec(packageName);
		if (matches) {
			const scopeResult = validatePackageNameWorker(matches[1], /*supportScopedPackage*/ false);
			if (scopeResult !== NameValidationResult.Ok) {
				return { name: matches[1], isScopeName: true, result: scopeResult };
			}
			const packageResult = validatePackageNameWorker(matches[2], /*supportScopedPackage*/ false);
			if (packageResult !== NameValidationResult.Ok) {
				return { name: matches[2], isScopeName: false, result: packageResult };
			}
			return NameValidationResult.Ok;
		}
	}

	if (encodeURIComponent(packageName) !== packageName) {
		return NameValidationResult.NameContainsNonURISafeCharacters;
	}

	return NameValidationResult.Ok;
}

export interface TypingResolutionHost {
	directoryExists(path: string): boolean;
	fileExists(fileName: string): boolean;
	readFile(path: string, encoding?: string): string | undefined;
	readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[] | undefined, depth?: number): string[];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/typingsInstaller/typingsInstaller.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/typingsInstaller/typingsInstaller.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/*
 * This file implements the global typings installer API for web clients. It
 * uses [nassun](https://docs.rs/nassun) and
 * [node-maintainer](https://docs.rs/node-maintainer) to install typings
 * in-memory (and maybe eventually cache them in IndexedDB?).
 *
 * Implementing a typings installer involves implementing two parts:
 *
 * -> ITypingsInstaller: the "top level" interface that tsserver uses to
 * request typings. Implementers of this interface are what actually get
 * passed to tsserver.
 *
 * -> TypingsInstaller: an abstract class that implements a good chunk of
 * the "generic" functionality for what ITypingsInstaller needs to do. For
 * implementation detail reasons, it does this in a "server/client" model of
 * sorts. In our case, we don't need a separate process, or even _quite_ a
 * pure "server/client" model, so we play along a bit for the sake of reusing
 * the stuff the abstract class is already doing for us.
 */

import { PackageManager, PackageType } from '@vscode/ts-package-manager';
import { join } from 'path';
import * as ts from 'typescript/lib/tsserverlibrary';
import { NameValidationResult, validatePackageNameWorker } from './jsTyping';

type InstallerResponse = ts.server.PackageInstalledResponse | ts.server.SetTypings | ts.server.InvalidateCachedTypings | ts.server.BeginInstallTypes | ts.server.EndInstallTypes | ts.server.WatchTypingLocations;

/**
 * The "server" part of the "server/client" model. This is the part that
 * actually gets instantiated and passed to tsserver.
 */
export class WebTypingsInstallerClient implements ts.server.ITypingsInstaller {

	private projectService: ts.server.ProjectService | undefined;

	private requestedRegistry = false;

	private typesRegistryCache = new Map<string, ts.MapLike<string>>();

	private readonly server: Promise<WebTypingsInstallerServer>;

	constructor(
		private readonly fs: ts.server.ServerHost,
		readonly globalTypingsCacheLocation: string,
	) {
		this.server = WebTypingsInstallerServer.initialize(
			(response: InstallerResponse) => this.handleResponse(response),
			this.fs,
			globalTypingsCacheLocation
		);
	}

	/**
	 * TypingsInstaller expects a "server/client" model, and as such, some of
	 * its methods are implemented in terms of sending responses back to a
	 * client. This method is a catch-all for those responses generated by
	 * TypingsInstaller internals.
	 */
	private async handleResponse(response: InstallerResponse): Promise<void> {
		switch (response.kind) {
			case 'action::packageInstalled':
			case 'action::invalidate':
			case 'action::set':
				this.projectService!.updateTypingsForProject(response);
				break;
			case 'event::beginInstallTypes':
			case 'event::endInstallTypes':
			// TODO(@zkat): maybe do something with this?
			case 'action::watchTypingLocations':
				// Don't care.
				break;
			default:
				throw new Error(`unexpected response: ${JSON.stringify(response)}`);
		}
	}

	// NB(kmarchan): this is a code action that expects an actual NPM-specific
	// installation. We shouldn't mess with this ourselves.
	async installPackage(_options: ts.server.InstallPackageOptionsWithProject): Promise<ts.ApplyCodeActionCommandResult> {
		throw new Error('not implemented');
	}

	// NB(kmarchan): As far as I can tell, this is only ever used for
	// completions?
	isKnownTypesPackageName(packageName: string): boolean {
		console.log('isKnownTypesPackageName', packageName);
		const looksLikeValidName = validatePackageNameWorker(packageName, true);
		if (looksLikeValidName.result !== NameValidationResult.Ok) {
			return false;
		}

		if (this.requestedRegistry) {
			return !!this.typesRegistryCache && this.typesRegistryCache.has(packageName);
		}

		this.requestedRegistry = true;
		this.server.then(s => this.typesRegistryCache = s.typesRegistry);
		return false;
	}

	enqueueInstallTypingsRequest(p: ts.server.Project, typeAcquisition: ts.TypeAcquisition, unresolvedImports: ts.SortedReadonlyArray<string>): void {
		console.log('enqueueInstallTypingsRequest', typeAcquisition, unresolvedImports);
		const req = ts.server.createInstallTypingsRequest(p, typeAcquisition, unresolvedImports);
		this.server.then(s => s.install(req));
	}

	attach(projectService: ts.server.ProjectService): void {
		this.projectService = projectService;
	}

	onProjectClosed(_projectService: ts.server.Project): void {
		// noop
	}
}

/**
 * Internal implementation of the "server" part of the "server/client" model.
 * This takes advantage of the existing TypingsInstaller to reuse a lot of
 * already-implemented logic around package installation, but with
 * installation details handled by Nassun/Node Maintainer.
 */
class WebTypingsInstallerServer extends ts.server.typingsInstaller.TypingsInstaller {

	private static readonly typesRegistryPackageName = 'types-registry';

	private constructor(
		override typesRegistry: Map<string, ts.MapLike<string>>,
		private readonly handleResponse: (response: InstallerResponse) => void,
		fs: ts.server.ServerHost,
		private readonly packageManager: PackageManager,
		globalTypingsCachePath: string,
	) {
		super(fs, globalTypingsCachePath, join(globalTypingsCachePath, 'fakeSafeList') as ts.Path, join(globalTypingsCachePath, 'fakeTypesMapLocation') as ts.Path, Infinity);
	}

	/**
	 * Because loading the typesRegistry is an async operation for us, we need
	 * to have a separate "constructor" that will be used by
	 * WebTypingsInstallerClient.
	 *
	 * @returns a promise that resolves to a WebTypingsInstallerServer
	 */
	static async initialize(
		handleResponse: (response: InstallerResponse) => void,
		fs: ts.server.ServerHost,
		globalTypingsCachePath: string,
	): Promise<WebTypingsInstallerServer> {
		const pm = new PackageManager(fs);
		const pkgJson = join(globalTypingsCachePath, 'package.json');
		if (!fs.fileExists(pkgJson)) {
			fs.writeFile(pkgJson, '{"private":true}');
		}
		const resolved = await pm.resolveProject(globalTypingsCachePath, {
			addPackages: [this.typesRegistryPackageName]
		});
		await resolved.restore();

		const registry = new Map<string, ts.MapLike<string>>();
		const indexPath = join(globalTypingsCachePath, 'node_modules/types-registry/index.json');
		const index = WebTypingsInstallerServer.readJson(fs, indexPath);
		for (const [packageName, entry] of Object.entries(index.entries)) {
			registry.set(packageName, entry as ts.MapLike<string>);
		}
		console.log('ATA registry loaded');
		return new WebTypingsInstallerServer(registry, handleResponse, fs, pm, globalTypingsCachePath);
	}

	/**
	 * Implements the actual logic of installing a set of given packages. It
	 * does this by looking up the latest versions of those packages using
	 * Nassun, then handing Node Maintainer the updated package.json to run a
	 * full install (modulo existing lockfiles, which can make this faster).
	 */
	protected override installWorker(requestId: number, packageNames: string[], cwd: string, onRequestCompleted: ts.server.typingsInstaller.RequestCompletedAction): void {
		console.log('installWorker', requestId, cwd);
		(async () => {
			try {
				const resolved = await this.packageManager.resolveProject(cwd, {
					addPackages: packageNames,
					packageType: PackageType.DevDependency
				});
				await resolved.restore();
				onRequestCompleted(true);
			} catch (e) {
				onRequestCompleted(false);
			}
		})();
	}

	/**
	 * This is a thing that TypingsInstaller uses internally to send
	 * responses, and we'll need to handle this in the Client later.
	 */
	protected override sendResponse(response: InstallerResponse): void {
		this.handleResponse(response);
	}

	/**
	 * What it says on the tin. Reads a JSON file from the given path. Throws
	 * if the file doesn't exist (as opposed to returning `undefined`, like
	 * fs.readFile does).
	 */
	private static readJson(fs: ts.server.ServerHost, path: string): any {
		const data = fs.readFile(path);
		if (!data) {
			throw new Error('Failed to read file: ' + path);
		}
		return JSON.parse(data.trim());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/util/args.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/util/args.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type * as ts from 'typescript/lib/tsserverlibrary';

export function hasArgument(args: readonly string[], name: string): boolean {
	return args.indexOf(name) >= 0;
}

export function findArgument(args: readonly string[], name: string): string | undefined {
	const index = args.indexOf(name);
	return 0 <= index && index < args.length - 1
		? args[index + 1]
		: undefined;
}

export function findArgumentStringArray(args: readonly string[], name: string): readonly string[] {
	const arg = findArgument(args, name);
	return arg === undefined ? [] : arg.split(',').filter(name => name !== '');
}

/**
 * Copied from `ts.LanguageServiceMode` to avoid direct dependency.
 */
export enum LanguageServiceMode {
	Semantic = 0,
	PartialSemantic = 1,
	Syntactic = 2,
}

export function parseServerMode(args: readonly string[]): ts.LanguageServiceMode | string | undefined {
	const mode = findArgument(args, '--serverMode');
	if (!mode) { return undefined; }

	switch (mode.toLowerCase()) {
		case 'semantic': return LanguageServiceMode.Semantic;
		case 'partialsemantic': return LanguageServiceMode.PartialSemantic;
		case 'syntactic': return LanguageServiceMode.Syntactic;
		default: return mode;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/web/src/util/hrtime.ts]---
Location: vscode-main/extensions/typescript-language-features/web/src/util/hrtime.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function hrtime(previous?: [number, number]): [number, number] {
	const now = self.performance.now() * 0.001;
	let seconds = Math.floor(now);
	let nanoseconds = Math.floor((now % 1) * 1000000000);
	// NOTE: This check is added probably because it's missed without strictFunctionTypes on
	if (previous?.[0] !== undefined && previous?.[1] !== undefined) {
		seconds = seconds - previous[0];
		nanoseconds = nanoseconds - previous[1];
		if (nanoseconds < 0) {
			seconds--;
			nanoseconds += 1000000000;
		}
	}
	return [seconds, nanoseconds];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/.vscodeignore]---
Location: vscode-main/extensions/vb/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/cgmanifest.json]---
Location: vscode-main/extensions/vb/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/asp.vb.net.tmbundle",
					"repositoryUrl": "https://github.com/textmate/asp.vb.net.tmbundle",
					"commitHash": "72d44550b3286d0382d7be0624140cf97857ff69"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-asp.vb.net.tmbundle project authors",
				"",
				"If not otherwise specified (see below), files in this folder fall under the following license: ",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information, ",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added ",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example ",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/language-configuration.json]---
Location: vscode-main/extensions/vb/language-configuration.json

```json
{
	"comments": {
		"lineComment": "'"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["<", ">"]
	],
	"folding": {
		"markers": {
			"start": "^\\s*#Region\\b",
			"end": "^\\s*#End Region\\b"
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/package.json]---
Location: vscode-main/extensions/vb/package.json

```json
{
  "name": "vb",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin textmate/asp.vb.net.tmbundle Syntaxes/ASP%20VB.net.plist ./syntaxes/asp-vb-net.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "vb",
        "extensions": [
          ".vb",
          ".brs",
          ".vbs",
          ".bas",
          ".vba"
        ],
        "aliases": [
          "Visual Basic",
          "vb"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "vb",
        "scopeName": "source.asp.vb.net",
        "path": "./syntaxes/asp-vb-net.tmLanguage.json"
      }
    ],
    "snippets": [
      {
        "language": "vb",
        "path": "./snippets/vb.code-snippets"
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

---[FILE: extensions/vb/package.nls.json]---
Location: vscode-main/extensions/vb/package.nls.json

```json
{
	"displayName": "Visual Basic Language Basics",
	"description": "Provides snippets, syntax highlighting, bracket matching and folding in Visual Basic files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/snippets/vb.code-snippets]---
Location: vscode-main/extensions/vb/snippets/vb.code-snippets

```text
{
	"For Next Loop": {
		"prefix": "for",
		"body": [
			"For ${1:index} As ${2:ObjectType} = ${3:lower} To ${4:Upper}",
			"\t$0",
			"Next ${1:index}"
		],
		"description": "For Next Loop"
	},
	"For Each...Next": {
		"prefix": "fore",
		"body": [
			"For Each ${1:Variable} As ${2:ObjectType} In ${3:Collection}",
			"\t$0",
			"Next"
		],
		"description": "For Each...Next"
	},
	"For i...Next i": {
		"prefix": "fori",
		"body": [
			"For i As ${1:Integer} = ${2:Lower} To ${3:Upper}",
			"\t$0",
			"Next i"
		],
		"description": "For i...Next i"
	},
	"For j...Next j": {
		"prefix": "forj",
		"body": [
			"For j As ${1:Integer} = ${2:Lower} To ${3:Upper}",
			"\t$0",
			"Next j"
		],
		"description": "For j...Next j"
	},
	"Public Function...": {
		"prefix": "pf",
		"body": [
			"Public Function ${1:FunctionName}(${2:ParameterList}) As ${3:ReturnType}",
			"\tTry",
			"\t\t$0",
			"\tCatch ex As Exception",
			"\tEnd Try",
			"\tReturn ${3:ReturnValue}",
			"End Function"
		],
		"description": "Public Function..."
	},
	"Public Sub ...": {
		"prefix": "ps",
		"body": [
			"Public Sub ${1:ProcedureName}(${2:ParameterList})",
			"\tTry",
			"\t\t$0",
			"\tCatch ex As Exception",
			"\tEnd Try",
			"End Sub"
		],
		"description": "Public Sub ..."
	},
	"While ... End While": {
		"prefix": "while",
		"body": [
			"While ${1:Boolean}",
			"\t$0",
			"End While"
		],
		"description": "While ... End While"
	},
	"Region Start": {
		"prefix": "#Region",
		"body": [
			"#Region $0"
		],
		"description": "Folding Region Start"
	},
	"Region End": {
		"prefix": "#End Region",
		"body": [
			"#End Region"
		],
		"description": "Folding Region End"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vb/syntaxes/asp-vb-net.tmLanguage.json]---
Location: vscode-main/extensions/vb/syntaxes/asp-vb-net.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/asp.vb.net.tmbundle/blob/master/Syntaxes/ASP%20VB.net.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/asp.vb.net.tmbundle/commit/72d44550b3286d0382d7be0624140cf97857ff69",
	"name": "ASP vb.NET",
	"scopeName": "source.asp.vb.net",
	"comment": "Modified from the original ASP bundle. Originally modified by Thomas Aylott subtleGradient.com",
	"patterns": [
		{
			"match": "\\n",
			"name": "meta.ending-space"
		},
		{
			"include": "#round-brackets"
		},
		{
			"begin": "^(?=\\t)",
			"end": "(?=[^\\t])",
			"name": "meta.leading-space",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "meta.odd-tab.tabs"
						},
						"2": {
							"name": "meta.even-tab.tabs"
						}
					},
					"match": "(\\t)(\\t)?"
				}
			]
		},
		{
			"begin": "^(?= )",
			"end": "(?=[^ ])",
			"name": "meta.leading-space",
			"patterns": [
				{
					"captures": {
						"1": {
							"name": "meta.odd-tab.spaces"
						},
						"2": {
							"name": "meta.even-tab.spaces"
						}
					},
					"match": "(  )(  )?"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.function.asp"
				},
				"2": {
					"name": "entity.name.function.asp"
				},
				"3": {
					"name": "punctuation.definition.parameters.asp"
				},
				"4": {
					"name": "variable.parameter.function.asp"
				},
				"5": {
					"name": "punctuation.definition.parameters.asp"
				}
			},
			"match": "^\\s*((?i:function|sub))\\s*([a-zA-Z_]\\w*)\\s*(\\()([^)]*)(\\)).*\\n?",
			"name": "meta.function.asp"
		},
		{
			"begin": "(^[ \\t]+)?(?=')",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.asp"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": "'",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.asp"
						}
					},
					"end": "\\n",
					"name": "comment.line.apostrophe.asp"
				}
			]
		},
		{
			"match": "(?i:\\b(If|Then|Else|ElseIf|Else If|End If|While|Wend|For|To|Each|Case|Select|End Select|Return|Continue|Do|Until|Loop|Next|With|Exit Do|Exit For|Exit Function|Exit Property|Exit Sub|IIf)\\b)",
			"name": "keyword.control.asp"
		},
		{
			"match": "(?i:\\b(Mod|And|Not|Or|Xor|as)\\b)",
			"name": "keyword.operator.asp"
		},
		{
			"captures": {
				"1": {
					"name": "storage.type.asp"
				},
				"2": {
					"name": "variable.other.bfeac.asp"
				},
				"3": {
					"name": "meta.separator.comma.asp"
				}
			},
			"match": "(?i:(dim)\\s*(?:(\\b[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b)\\s*(,?)))",
			"name": "variable.other.dim.asp"
		},
		{
			"match": "(?i:\\s*\\b(Call|Class|Const|Dim|Redim|Function|Sub|Private Sub|Public Sub|End Sub|End Function|End Class|End Property|Public Property|Private Property|Set|Let|Get|New|Randomize|Option Explicit|On Error Resume Next|On Error GoTo)\\b\\s*)",
			"name": "storage.type.asp"
		},
		{
			"match": "(?i:\\b(Private|Public|Default)\\b)",
			"name": "storage.modifier.asp"
		},
		{
			"match": "(?i:\\s*\\b(Empty|False|Nothing|Null|True)\\b)",
			"name": "constant.language.asp"
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.asp"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.asp"
				}
			},
			"name": "string.quoted.double.asp",
			"patterns": [
				{
					"match": "\"\"",
					"name": "constant.character.escape.apostrophe.asp"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.variable.asp"
				}
			},
			"match": "(\\$)[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b\\s*",
			"name": "variable.other.asp"
		},
		{
			"match": "(?i:\\b(Application|ObjectContext|Request|Response|Server|Session)\\b)",
			"name": "support.class.asp"
		},
		{
			"match": "(?i:\\b(Contents|StaticObjects|ClientCertificate|Cookies|Form|QueryString|ServerVariables)\\b)",
			"name": "support.class.collection.asp"
		},
		{
			"match": "(?i:\\b(TotalBytes|Buffer|CacheControl|Charset|ContentType|Expires|ExpiresAbsolute|IsClientConnected|PICS|Status|ScriptTimeout|CodePage|LCID|SessionID|Timeout)\\b)",
			"name": "support.constant.asp"
		},
		{
			"match": "(?i:\\b(Lock|Unlock|SetAbort|SetComplete|BinaryRead|AddHeader|AppendToLog|BinaryWrite|Clear|End|Flush|Redirect|Write|CreateObject|HTMLEncode|MapPath|URLEncode|Abandon|Convert|Regex)\\b)",
			"name": "support.function.asp"
		},
		{
			"match": "(?i:\\b(Application_OnEnd|Application_OnStart|OnTransactionAbort|OnTransactionCommit|Session_OnEnd|Session_OnStart)\\b)",
			"name": "support.function.event.asp"
		},
		{
			"match": "(?i:(?<=as )(\\b[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b))",
			"name": "support.type.vb.asp"
		},
		{
			"match": "(?i:\\b(Array|Add|Asc|Atn|CBool|CByte|CCur|CDate|CDbl|Chr|CInt|CLng|Conversions|Cos|CreateObject|CSng|CStr|Date|DateAdd|DateDiff|DatePart|DateSerial|DateValue|Day|Derived|Math|Escape|Eval|Exists|Exp|Filter|FormatCurrency|FormatDateTime|FormatNumber|FormatPercent|GetLocale|GetObject|GetRef|Hex|Hour|InputBox|InStr|InStrRev|Int|Fix|IsArray|IsDate|IsEmpty|IsNull|IsNumeric|IsObject|Item|Items|Join|Keys|LBound|LCase|Left|Len|LoadPicture|Log|LTrim|RTrim|Trim|Maths|Mid|Minute|Month|MonthName|MsgBox|Now|Oct|Remove|RemoveAll|Replace|RGB|Right|Rnd|Round|ScriptEngine|ScriptEngineBuildVersion|ScriptEngineMajorVersion|ScriptEngineMinorVersion|Second|SetLocale|Sgn|Sin|Space|Split|Sqr|StrComp|String|StrReverse|Tan|Time|Timer|TimeSerial|TimeValue|TypeName|UBound|UCase|Unescape|VarType|Weekday|WeekdayName|Year)\\b)",
			"name": "support.function.vb.asp"
		},
		{
			"match": "-?\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f)?\\b",
			"name": "constant.numeric.asp"
		},
		{
			"match": "(?i:\\b(vbtrue|vbfalse|vbcr|vbcrlf|vbformfeed|vblf|vbnewline|vbnullchar|vbnullstring|int32|vbtab|vbverticaltab|vbbinarycompare|vbtextcomparevbsunday|vbmonday|vbtuesday|vbwednesday|vbthursday|vbfriday|vbsaturday|vbusesystemdayofweek|vbfirstjan1|vbfirstfourdays|vbfirstfullweek|vbgeneraldate|vblongdate|vbshortdate|vblongtime|vbshorttime|vbobjecterror|vbEmpty|vbNull|vbInteger|vbLong|vbSingle|vbDouble|vbCurrency|vbDate|vbString|vbObject|vbError|vbBoolean|vbVariant|vbDataObject|vbDecimal|vbByte|vbArray)\\b)",
			"name": "support.type.vb.asp"
		},
		{
			"captures": {
				"1": {
					"name": "entity.name.function.asp"
				}
			},
			"match": "(?i:(\\b[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b)(?=\\(\\)?))",
			"name": "support.function.asp"
		},
		{
			"match": "(?i:((?<=(\\+|=|-|\\&|\\\\|/|<|>|\\(|,))\\s*\\b([a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?)\\b(?!(\\(|\\.))|\\b([a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?)\\b(?=\\s*(\\+|=|-|\\&|\\\\|/|<|>|\\(|\\)))))",
			"name": "variable.other.asp"
		},
		{
			"match": "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|/=|%=|\\+=|\\-=|&=|\\^=|\\b(in|instanceof|new|delete|typeof|void)\\b",
			"name": "keyword.operator.js"
		}
	],
	"repository": {
		"round-brackets": {
			"begin": "\\(",
			"beginCaptures": {
				"0": {
					"name": "punctuation.section.round-brackets.begin.asp"
				}
			},
			"end": "\\)",
			"endCaptures": {
				"0": {
					"name": "punctuation.section.round-brackets.end.asp"
				}
			},
			"name": "meta.round-brackets",
			"patterns": [
				{
					"include": "source.asp.vb.net"
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/.gitignore]---
Location: vscode-main/extensions/vscode-api-tests/.gitignore

```text
out
node_modules
testWorkspace/.vscode/tasks.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/.npmrc]---
Location: vscode-main/extensions/vscode-api-tests/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/.vscodeignore]---
Location: vscode-main/extensions/vscode-api-tests/.vscodeignore

```text
.vscode/**
typings/**
**/*.ts
**/*.map
.gitignore
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/package-lock.json]---
Location: vscode-main/extensions/vscode-api-tests/package-lock.json

```json
{
  "name": "vscode-api-tests",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "vscode-api-tests",
      "version": "0.0.1",
      "license": "MIT",
      "devDependencies": {
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x",
        "@types/node-forge": "^1.3.11",
        "node-forge": "^1.3.2",
        "straightforward": "^4.2.2"
      },
      "engines": {
        "vscode": "^1.55.0"
      }
    },
    "node_modules/@types/mocha": {
      "version": "10.0.10",
      "resolved": "https://registry.npmjs.org/@types/mocha/-/mocha-10.0.10.tgz",
      "integrity": "sha512-xPyYSz1cMPnJQhl0CLMH68j3gprKZaTjG3s5Vi+fDgx+uhG9NOXwbVt52eFS8ECyXhyKcjDLCBEqBExKuiZb7Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@types/node-forge": {
      "version": "1.3.11",
      "resolved": "https://registry.npmjs.org/@types/node-forge/-/node-forge-1.3.11.tgz",
      "integrity": "sha512-FQx220y22OKNTqaByeBGqHWYz4cl94tpcxeFdvBo3wjG6XPBuZ0BNgNZRV5J5TFmmcsJ4IzsLkmGRiQbnYsBEQ==",
      "dev": true,
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "dev": true,
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true
    },
    "node_modules/debug": {
      "version": "4.3.5",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.3.5.tgz",
      "integrity": "sha512-pt0bNEmneDIvdL1Xsd9oDQ/wrQRkXDT4AUWlNZNPKvW5x/jyO9VFXkJUP07vQ2upmw5PlaITaPKc31jK13V+jg==",
      "dev": true,
      "dependencies": {
        "ms": "2.1.2"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true
    },
    "node_modules/escalade": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.1.2.tgz",
      "integrity": "sha512-ErCHMCae19vR8vQGe50xIsVomy19rg6gFu3+r3jkEO46suLMWBksvVyoGgQV+jOfl84ZSOSlmv6Gxa89PmTGmA==",
      "dev": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "dev": true,
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ms": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.2.tgz",
      "integrity": "sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==",
      "dev": true
    },
    "node_modules/node-forge": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/node-forge/-/node-forge-1.3.2.tgz",
      "integrity": "sha512-6xKiQ+cph9KImrRh0VsjH2d8/GXA4FIMlgU4B757iI1ApvcyA9VlouP0yZJha01V+huImO+kKMU7ih+2+E14fw==",
      "dev": true,
      "license": "(BSD-3-Clause OR GPL-2.0)",
      "engines": {
        "node": ">= 6.13.0"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "dev": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/straightforward": {
      "version": "4.2.2",
      "resolved": "https://registry.npmjs.org/straightforward/-/straightforward-4.2.2.tgz",
      "integrity": "sha512-MxfuNnyTP4RPjadI3DkYIcNIp0DMXeDmAXY4/6QivU8lLIPGUqaS5VsEkaQ2QC+FICzc7QTb/lJPRIhGRKVuMA==",
      "dev": true,
      "dependencies": {
        "debug": "^4.3.4",
        "yargs": "^17.6.2"
      },
      "bin": {
        "straightforward": "cli.js"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "dev": true,
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "dev": true,
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "dev": true,
      "engines": {
        "node": ">=12"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/package.json]---
Location: vscode-main/extensions/vscode-api-tests/package.json

```json
{
  "name": "vscode-api-tests",
  "description": "API tests for VS Code",
  "version": "0.0.1",
  "publisher": "vscode",
  "license": "MIT",
  "enabledApiProposals": [
    "activeComment",
    "authSession",
    "chatParticipantPrivate",
    "chatProvider",
    "contribStatusBarItems",
    "contribViewsRemote",
    "customEditorMove",
    "defaultChatParticipant",
    "diffCommand",
    "documentFiltersExclusive",
    "editorInsets",
    "embeddings",
    "extensionRuntime",
    "extensionsAny",
    "externalUriOpener",
    "fileSearchProvider",
    "findFiles2",
    "findTextInFiles",
    "fsChunks",
    "interactive",
    "languageStatusText",
    "nativeWindowHandle",
    "notebookDeprecated",
    "notebookLiveShare",
    "notebookMessaging",
    "notebookMime",
    "portsAttributes",
    "quickInputButtonLocation",
    "quickPickSortByLabel",
    "resolvers",
    "scmActionButton",
    "scmSelectedProvider",
    "scmTextDocument",
    "scmValidation",
    "taskPresentationGroup",
    "telemetry",
    "terminalDataWriteEvent",
    "terminalDimensions",
    "testObserver",
    "textSearchProvider",
    "timeline",
    "tokenInformation",
    "treeViewActiveItem",
    "treeViewReveal",
    "tunnels",
    "workspaceTrust",
    "inlineCompletionsAdditions",
    "devDeviceId",
    "languageModelProxy"
  ],
  "private": true,
  "activationEvents": [],
  "main": "./out/extension",
  "engines": {
    "vscode": "^1.55.0"
  },
  "icon": "media/icon.png",
  "contributes": {
    "languageModelChatProviders": [
      {
        "vendor": "test-lm-vendor",
        "displayName": "Test LM Vendor"
      }
    ],
    "chatParticipants": [
      {
        "id": "api-test.participant",
        "name": "participant",
        "description": "test",
        "isDefault": true,
        "commands": [
          {
            "name": "hello",
            "description": "Hello"
          }
        ],
        "modes": [
          "agent",
          "ask",
          "edit"
        ]
      },
      {
        "id": "api-test.participant2",
        "name": "participant2",
        "description": "test",
        "commands": []
      }
    ],
    "languageModelTools": [
      {
        "name": "requires_confirmation_tool",
        "toolReferenceName": "requires_confirmation_tool",
        "displayName": "Requires Confirmation Tool",
        "modelDescription": "A noop tool to trigger confirmation.",
        "canBeReferencedInPrompt": true,
        "icon": "$(files)",
        "inputSchema": {}
      }
    ],
    "configuration": {
      "type": "object",
      "title": "Test Config",
      "properties": {
        "farboo.config0": {
          "type": "boolean",
          "default": true
        },
        "farboo.nested.config1": {
          "type": "number",
          "default": 42
        },
        "farboo.nested.config2": {
          "type": "string",
          "default": "Das Pferd frisst kein Reis."
        },
        "farboo.config4": {
          "type": "string"
        },
        "farboo.get": {
          "type": "string",
          "default": "get-prop"
        },
        "integration-test.http.proxy": {
          "type": "string"
        },
        "integration-test.http.proxyAuth": {
          "type": "string",
          "default": "get-prop"
        }
      }
    },
    "views": {
      "remote": [
        {
          "id": "test.treeId",
          "name": "test-tree",
          "when": "never"
        }
      ]
    },
    "configurationDefaults": {
      "[abcLang]": {
        "editor.lineNumbers": "off",
        "editor.tabSize": 2
      }
    },
    "taskDefinitions": [
      {
        "type": "custombuildscript",
        "required": [
          "flavor"
        ],
        "properties": {
          "flavor": {
            "type": "string",
            "description": "The build flavor. Should be either '32' or '64'."
          },
          "flags": {
            "type": "array",
            "description": "Additional build flags."
          }
        }
      }
    ],
    "breakpoints": [
      {
        "language": "markdown"
      }
    ],
    "debuggers": [
      {
        "type": "mock",
        "label": "Mock Debug",
        "languages": [
          "markdown"
        ],
        "configurationAttributes": {
          "launch": {
            "required": [
              "program"
            ],
            "properties": {
              "program": {
                "type": "string",
                "description": "Absolute path to a text file.",
                "default": "${workspaceFolder}/file.md"
              },
              "stopOnEntry": {
                "type": "boolean",
                "description": "Automatically stop after launch.",
                "default": true
              },
              "trace": {
                "type": "boolean",
                "description": "Enable logging of the Debug Adapter Protocol.",
                "default": true
              }
            }
          }
        },
        "initialConfigurations": [
          {
            "type": "mock",
            "request": "launch",
            "name": "Debug file.md",
            "program": "${workspaceFolder}/file.md"
          }
        ]
      }
    ],
    "interactiveSession": [
      {
        "id": "provider",
        "label": "Provider"
      }
    ],
    "notebooks": [
      {
        "type": "notebookCoreTest",
        "displayName": "Notebook Core Test",
        "selector": [
          {
            "filenamePattern": "*.vsctestnb",
            "excludeFileNamePattern": ""
          }
        ]
      },
      {
        "type": "notebook.nbdtest",
        "displayName": "notebook.nbdtest",
        "selector": [
          {
            "filenamePattern": "**/*.nbdtest"
          }
        ]
      },
      {
        "type": "notebook.nbdserializer",
        "displayName": "notebook.nbdserializer",
        "selector": [
          {
            "filenamePattern": "**/*.nbdserializer"
          }
        ]
      }
    ],
    "statusBarItems": {
      "id": "myStaticItem",
      "alignment": "right",
      "priority": 17,
      "name": "My Static Item",
      "text": "Hello $(globe)",
      "tooltip": "Hover World",
      "accessibilityInformation": {
        "label": "Hello World",
        "role": "button"
      }
    }
  },
  "scripts": {
    "compile": "node ./node_modules/vscode/bin/compile -watch -p ./",
    "vscode:prepublish": "node ../../node_modules/gulp/bin/gulp.js --gulpfile ../../build/gulpfile.extensions.mjs compile-extension:vscode-api-tests ./tsconfig.json"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x",
    "@types/node-forge": "^1.3.11",
    "node-forge": "^1.3.2",
    "straightforward": "^4.2.2"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/testworkspace.code-workspace]---
Location: vscode-main/extensions/vscode-api-tests/testworkspace.code-workspace

```text
{
	"folders": [
		{
			"path": "testWorkspace"
		},
		{
			"path": "testWorkspace2",
			"name": "Test Workspace 2"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/tsconfig.json]---
Location: vscode-main/extensions/vscode-api-tests/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"skipLibCheck": true
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.*.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/.vscode/launch.json]---
Location: vscode-main/extensions/vscode-api-tests/.vscode/launch.json

```json
// A launch configuration that compiles the extension and then opens it inside a new window
{
	"version": "0.1.0",
	"configurations": [
		{
			"name": "Launch Tests",
			"type": "extensionHost",
			"request": "launch",
			"args": [
				"${workspaceFolder}/../../",
				"${workspaceFolder}/testWorkspace",
				"--extensionDevelopmentPath=${workspaceFolder}",
				"--extensionTestsPath=${workspaceFolder}/out"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"preLaunchTask": "npm"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/.vscode/tasks.json]---
Location: vscode-main/extensions/vscode-api-tests/.vscode/tasks.json

```json
{
	"version": "2.0.0",
	"command": "npm",
	"type": "shell",
	"presentation": {
		"reveal": "silent"
	},
	"args": ["run", "compile"],
	"isBackground": true,
	"problemMatcher": "$tsc-watch"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/extension.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

declare global {
	var testExtensionContext: vscode.ExtensionContext;
}

export function activate(_context: vscode.ExtensionContext) {
	// Set context as a global as some tests depend on it
	global.testExtensionContext = _context;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/memfs.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/memfs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import * as path from 'path';
import * as vscode from 'vscode';

class File implements vscode.FileStat {

	type: vscode.FileType;
	ctime: number;
	mtime: number;
	size: number;

	name: string;
	data?: Uint8Array;

	constructor(name: string) {
		this.type = vscode.FileType.File;
		this.ctime = Date.now();
		this.mtime = Date.now();
		this.size = 0;
		this.name = name;
	}
}

class Directory implements vscode.FileStat {

	type: vscode.FileType;
	ctime: number;
	mtime: number;
	size: number;

	name: string;
	entries: Map<string, File | Directory>;

	constructor(name: string) {
		this.type = vscode.FileType.Directory;
		this.ctime = Date.now();
		this.mtime = Date.now();
		this.size = 0;
		this.name = name;
		this.entries = new Map();
	}
}

export type Entry = File | Directory;

export class TestFS implements vscode.FileSystemProvider {

	constructor(
		readonly scheme: string,
		readonly isCaseSensitive: boolean
	) { }

	readonly root = new Directory('');

	// --- manage file metadata

	stat(uri: vscode.Uri): vscode.FileStat {
		return this._lookup(uri, false);
	}

	readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
		const entry = this._lookupAsDirectory(uri, false);
		const result: [string, vscode.FileType][] = [];
		for (const [name, child] of entry.entries) {
			result.push([name, child.type]);
		}
		return result;
	}

	// --- manage file contents

	readFile(uri: vscode.Uri): Uint8Array {
		const data = this._lookupAsFile(uri, false).data;
		if (data) {
			return data;
		}
		throw vscode.FileSystemError.FileNotFound();
	}

	writeFile(uri: vscode.Uri, content: Uint8Array, options: { create: boolean; overwrite: boolean }): void {
		const basename = path.posix.basename(uri.path);
		const parent = this._lookupParentDirectory(uri);
		let entry = parent.entries.get(basename);
		if (entry instanceof Directory) {
			throw vscode.FileSystemError.FileIsADirectory(uri);
		}
		if (!entry && !options.create) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		if (entry && options.create && !options.overwrite) {
			throw vscode.FileSystemError.FileExists(uri);
		}
		if (!entry) {
			entry = new File(basename);
			parent.entries.set(basename, entry);
			this._fireSoon({ type: vscode.FileChangeType.Created, uri });
		}
		entry.mtime = Date.now();
		entry.size = content.byteLength;
		entry.data = content;

		this._fireSoon({ type: vscode.FileChangeType.Changed, uri });
	}

	// --- manage files/folders

	rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {

		if (!options.overwrite && this._lookup(newUri, true)) {
			throw vscode.FileSystemError.FileExists(newUri);
		}

		const entry = this._lookup(oldUri, false);
		const oldParent = this._lookupParentDirectory(oldUri);

		const newParent = this._lookupParentDirectory(newUri);
		const newName = path.posix.basename(newUri.path);

		oldParent.entries.delete(entry.name);
		entry.name = newName;
		newParent.entries.set(newName, entry);

		this._fireSoon(
			{ type: vscode.FileChangeType.Deleted, uri: oldUri },
			{ type: vscode.FileChangeType.Created, uri: newUri }
		);
	}

	delete(uri: vscode.Uri): void {
		const dirname = uri.with({ path: path.posix.dirname(uri.path) });
		const basename = path.posix.basename(uri.path);
		const parent = this._lookupAsDirectory(dirname, false);
		if (!parent.entries.has(basename)) {
			throw vscode.FileSystemError.FileNotFound(uri);
		}
		parent.entries.delete(basename);
		parent.mtime = Date.now();
		parent.size -= 1;
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { uri, type: vscode.FileChangeType.Deleted });
	}

	createDirectory(uri: vscode.Uri): void {
		const basename = path.posix.basename(uri.path);
		const dirname = uri.with({ path: path.posix.dirname(uri.path) });
		const parent = this._lookupAsDirectory(dirname, false);

		const entry = new Directory(basename);
		parent.entries.set(entry.name, entry);
		parent.mtime = Date.now();
		parent.size += 1;
		this._fireSoon({ type: vscode.FileChangeType.Changed, uri: dirname }, { type: vscode.FileChangeType.Created, uri });
	}

	// --- lookup

	private _lookup(uri: vscode.Uri, silent: false): Entry;
	private _lookup(uri: vscode.Uri, silent: boolean): Entry | undefined;
	private _lookup(uri: vscode.Uri, silent: boolean): Entry | undefined {
		const parts = uri.path.split('/');
		let entry: Entry = this.root;
		for (const part of parts) {
			const partLow = part.toLowerCase();
			if (!part) {
				continue;
			}
			let child: Entry | undefined;
			if (entry instanceof Directory) {
				if (this.isCaseSensitive) {
					child = entry.entries.get(part);
				} else {
					for (const [key, value] of entry.entries) {
						if (key.toLowerCase() === partLow) {
							child = value;
							break;
						}
					}
				}
			}
			if (!child) {
				if (!silent) {
					throw vscode.FileSystemError.FileNotFound(uri);
				} else {
					return undefined;
				}
			}
			entry = child;
		}
		return entry;
	}

	private _lookupAsDirectory(uri: vscode.Uri, silent: boolean): Directory {
		const entry = this._lookup(uri, silent);
		if (entry instanceof Directory) {
			return entry;
		}
		throw vscode.FileSystemError.FileNotADirectory(uri);
	}

	private _lookupAsFile(uri: vscode.Uri, silent: boolean): File {
		const entry = this._lookup(uri, silent);
		if (entry instanceof File) {
			return entry;
		}
		throw vscode.FileSystemError.FileIsADirectory(uri);
	}

	private _lookupParentDirectory(uri: vscode.Uri): Directory {
		const dirname = uri.with({ path: path.posix.dirname(uri.path) });
		return this._lookupAsDirectory(dirname, false);
	}

	// --- manage file events

	private _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	private _bufferedEvents: vscode.FileChangeEvent[] = [];
	private _fireSoonHandle?: NodeJS.Timeout;

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;

	watch(_resource: vscode.Uri, _options: { recursive: boolean; excludes: string[] }): vscode.Disposable {
		// ignore, fires for all changes...
		return new vscode.Disposable(() => { });
	}

	private _fireSoon(...events: vscode.FileChangeEvent[]): void {
		this._bufferedEvents.push(...events);

		if (this._fireSoonHandle) {
			clearTimeout(this._fireSoonHandle);
		}

		this._fireSoonHandle = setTimeout(() => {
			this._emitter.fire(this._bufferedEvents);
			this._bufferedEvents.length = 0;
		}, 5);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/vscode-api-tests/src/utils.ts]---
Location: vscode-main/extensions/vscode-api-tests/src/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { EOL } from 'os';
import * as crypto from 'crypto';
import * as vscode from 'vscode';
import { TestFS } from './memfs';

export function rndName() {
	return crypto.randomBytes(8).toString('hex');
}

export const testFs = new TestFS('fake-fs', true);
vscode.workspace.registerFileSystemProvider(testFs.scheme, testFs, { isCaseSensitive: testFs.isCaseSensitive });

export async function createRandomFile(contents: string | Uint8Array = '', dir: vscode.Uri | undefined = undefined, ext = ''): Promise<vscode.Uri> {
	let fakeFile: vscode.Uri;
	if (dir) {
		assert.strictEqual(dir.scheme, testFs.scheme);
		fakeFile = dir.with({ path: dir.path + '/' + rndName() + ext });
	} else {
		fakeFile = vscode.Uri.parse(`${testFs.scheme}:/${rndName() + ext}`);
	}
	testFs.writeFile(fakeFile, typeof contents === 'string' ? Buffer.from(contents) : Buffer.from(contents), { create: true, overwrite: true });
	return fakeFile;
}

export async function deleteFile(file: vscode.Uri): Promise<boolean> {
	try {
		testFs.delete(file);
		return true;
	} catch {
		return false;
	}
}

export function pathEquals(path1: string, path2: string): boolean {
	if (process.platform !== 'linux') {
		path1 = path1.toLowerCase();
		path2 = path2.toLowerCase();
	}

	return path1 === path2;
}

export function closeAllEditors(): Thenable<any> {
	return vscode.commands.executeCommand('workbench.action.closeAllEditors');
}

export function saveAllEditors(): Thenable<any> {
	return vscode.commands.executeCommand('workbench.action.files.saveAll');
}

export async function revertAllDirty(): Promise<void> {
	return vscode.commands.executeCommand('_workbench.revertAllDirty');
}

export function disposeAll(disposables: vscode.Disposable[]) {
	vscode.Disposable.from(...disposables).dispose();
}

export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function withLogLevel(level: string, runnable: () => Promise<any>): () => Promise<void> {
	return async (): Promise<void> => {
		const logLevel = await vscode.commands.executeCommand('_extensionTests.getLogLevel');
		await vscode.commands.executeCommand('_extensionTests.setLogLevel', level);

		try {
			await runnable();
		} finally {
			await vscode.commands.executeCommand('_extensionTests.setLogLevel', logLevel);
		}
	};
}

export function withLogDisabled(runnable: () => Promise<any>): () => Promise<void> {
	return withLogLevel('off', runnable);
}

export function withVerboseLogs(runnable: () => Promise<any>): () => Promise<void> {
	return withLogLevel('trace', runnable);
}

export function assertNoRpc() {
	assertNoRpcFromEntry([vscode, 'vscode']);
}

export function assertNoRpcFromEntry(entry: [obj: any, name: string]) {

	const symProxy = Symbol.for('rpcProxy');
	const symProtocol = Symbol.for('rpcProtocol');

	const proxyPaths: string[] = [];
	const rpcPaths: string[] = [];

	function walk(obj: any, path: string, seen: Set<any>) {
		if (!obj) {
			return;
		}
		if (typeof obj !== 'object' && typeof obj !== 'function') {
			return;
		}
		if (seen.has(obj)) {
			return;
		}
		seen.add(obj);

		if (obj[symProtocol]) {
			rpcPaths.push(`PROTOCOL via ${path}`);
		}
		if (obj[symProxy]) {
			proxyPaths.push(`PROXY '${obj[symProxy]}' via ${path}`);
		}

		for (const key in obj) {
			walk(obj[key], `${path}.${String(key)}`, seen);
		}
	}

	try {
		walk(entry[0], entry[1], new Set());
	} catch (err) {
		assert.fail(err);
	}
	assert.strictEqual(rpcPaths.length, 0, rpcPaths.join('\n'));
	assert.strictEqual(proxyPaths.length, 0, proxyPaths.join('\n')); // happens...
}

export async function asPromise<T>(event: vscode.Event<T>, timeout = vscode.env.uiKind === vscode.UIKind.Desktop ? 5000 : 15000): Promise<T> {
	const error = new Error('asPromise TIMEOUT reached');
	return new Promise<T>((resolve, reject) => {

		const handle = setTimeout(() => {
			sub.dispose();
			reject(error);
		}, timeout);

		const sub = event(e => {
			clearTimeout(handle);
			sub.dispose();
			resolve(e);
		});
	});
}

export function testRepeat(n: number, description: string, callback: (this: any) => any): void {
	for (let i = 0; i < n; i++) {
		test(`${description} (iteration ${i})`, callback);
	}
}

export function suiteRepeat(n: number, description: string, callback: (this: any) => any): void {
	for (let i = 0; i < n; i++) {
		suite(`${description} (iteration ${i})`, callback);
	}
}

export async function poll<T>(
	fn: () => Thenable<T>,
	acceptFn: (result: T) => boolean,
	timeoutMessage: string,
	retryCount: number = 200,
	retryInterval: number = 100 // millis
): Promise<T> {
	let trial = 1;
	let lastError: string = '';

	while (true) {
		if (trial > retryCount) {
			throw new Error(`Timeout: ${timeoutMessage} after ${(retryCount * retryInterval) / 1000} seconds.\r${lastError}`);
		}

		let result;
		try {
			result = await fn();
			if (acceptFn(result)) {
				return result;
			} else {
				lastError = 'Did not pass accept function';
			}
		} catch (e: any) {
			lastError = Array.isArray(e.stack) ? e.stack.join(EOL) : e.stack;
		}

		await new Promise(resolve => setTimeout(resolve, retryInterval));
		trial++;
	}
}

export type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;

/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export class DeferredPromise<T> {

	private completeCallback!: ValueCallback<T>;
	private errorCallback!: (err: unknown) => void;
	private rejected = false;
	private resolved = false;

	public get isRejected() {
		return this.rejected;
	}

	public get isResolved() {
		return this.resolved;
	}

	public get isSettled() {
		return this.rejected || this.resolved;
	}

	public readonly p: Promise<T>;

	constructor() {
		this.p = new Promise<T>((c, e) => {
			this.completeCallback = c;
			this.errorCallback = e;
		});
	}

	public complete(value: T) {
		return new Promise<void>(resolve => {
			this.completeCallback(value);
			this.resolved = true;
			resolve();
		});
	}

	public error(err: unknown) {
		return new Promise<void>(resolve => {
			this.errorCallback(err);
			this.rejected = true;
			resolve();
		});
	}

	public cancel() {
		new Promise<void>(resolve => {
			this.errorCallback(new Error('Canceled'));
			this.rejected = true;
			resolve();
		});
	}
}

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};
```

--------------------------------------------------------------------------------

````

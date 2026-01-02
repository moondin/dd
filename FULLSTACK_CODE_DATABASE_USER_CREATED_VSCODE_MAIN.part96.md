---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 96
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 96 of 552)

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

---[FILE: extensions/typescript-language-features/src/configuration/configuration.browser.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/configuration.browser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { BaseServiceConfigurationProvider } from './configuration';

export class BrowserServiceConfigurationProvider extends BaseServiceConfigurationProvider {

	// On browsers, we only support using the built-in TS version
	protected readGlobalTsdk(_configuration: vscode.WorkspaceConfiguration): string | null {
		return null;
	}

	protected readLocalTsdk(_configuration: vscode.WorkspaceConfiguration): string | null {
		return null;
	}

	// On browsers, we don't run TSServer on Node
	protected readLocalNodePath(_configuration: vscode.WorkspaceConfiguration): string | null {
		return null;
	}

	protected override readGlobalNodePath(_configuration: vscode.WorkspaceConfiguration): string | null {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/configuration.electron.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/configuration.electron.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import { BaseServiceConfigurationProvider } from './configuration';
import { RelativeWorkspacePathResolver } from '../utils/relativePathResolver';

export class ElectronServiceConfigurationProvider extends BaseServiceConfigurationProvider {

	private fixPathPrefixes(inspectValue: string): string {
		const pathPrefixes = ['~' + path.sep];
		for (const pathPrefix of pathPrefixes) {
			if (inspectValue.startsWith(pathPrefix)) {
				return path.join(os.homedir(), inspectValue.slice(pathPrefix.length));
			}
		}
		return inspectValue;
	}

	protected readGlobalTsdk(configuration: vscode.WorkspaceConfiguration): string | null {
		const inspect = configuration.inspect('typescript.tsdk');
		if (inspect && typeof inspect.globalValue === 'string') {
			return this.fixPathPrefixes(inspect.globalValue);
		}
		return null;
	}

	protected readLocalTsdk(configuration: vscode.WorkspaceConfiguration): string | null {
		const inspect = configuration.inspect('typescript.tsdk');
		if (inspect && typeof inspect.workspaceValue === 'string') {
			return this.fixPathPrefixes(inspect.workspaceValue);
		}
		return null;
	}

	protected readLocalNodePath(configuration: vscode.WorkspaceConfiguration): string | null {
		return this.validatePath(this.readLocalNodePathWorker(configuration));
	}

	private readLocalNodePathWorker(configuration: vscode.WorkspaceConfiguration): string | null {
		const inspect = configuration.inspect('typescript.tsserver.nodePath');
		if (inspect?.workspaceValue && typeof inspect.workspaceValue === 'string') {
			if (inspect.workspaceValue === 'node') {
				return this.findNodePath();
			}
			const fixedPath = this.fixPathPrefixes(inspect.workspaceValue);
			if (!path.isAbsolute(fixedPath)) {
				const workspacePath = RelativeWorkspacePathResolver.asAbsoluteWorkspacePath(fixedPath);
				return workspacePath || null;
			}
			return fixedPath;
		}
		return null;
	}

	protected readGlobalNodePath(configuration: vscode.WorkspaceConfiguration): string | null {
		return this.validatePath(this.readGlobalNodePathWorker(configuration));
	}

	private readGlobalNodePathWorker(configuration: vscode.WorkspaceConfiguration): string | null {
		const inspect = configuration.inspect('typescript.tsserver.nodePath');
		if (inspect?.globalValue && typeof inspect.globalValue === 'string') {
			if (inspect.globalValue === 'node') {
				return this.findNodePath();
			}
			const fixedPath = this.fixPathPrefixes(inspect.globalValue);
			if (path.isAbsolute(fixedPath)) {
				return fixedPath;
			}
		}
		return null;
	}

	private findNodePath(): string | null {
		try {
			const out = child_process.execFileSync('node', ['-e', 'console.log(process.execPath)'], {
				windowsHide: true,
				timeout: 2000,
				cwd: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
				encoding: 'utf-8',
			});
			return out.trim();
		} catch (error) {
			vscode.window.showWarningMessage(vscode.l10n.t("Could not detect a Node installation to run TS Server."));
			return null;
		}
	}

	private validatePath(nodePath: string | null): string | null {
		if (nodePath && (!fs.existsSync(nodePath) || fs.lstatSync(nodePath).isDirectory())) {
			vscode.window.showWarningMessage(vscode.l10n.t("The path {0} doesn\'t point to a valid Node installation to run TS Server. Falling back to bundled Node.", nodePath));
			return null;
		}
		return nodePath;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/configuration.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/configuration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as Proto from '../tsServer/protocol/protocol';
import * as objects from '../utils/objects';

export enum TsServerLogLevel {
	Off,
	Normal,
	Terse,
	Verbose,
	RequestTime
}

export namespace TsServerLogLevel {
	export function fromString(value: string): TsServerLogLevel {
		switch (value?.toLowerCase()) {
			case 'normal':
				return TsServerLogLevel.Normal;
			case 'terse':
				return TsServerLogLevel.Terse;
			case 'verbose':
				return TsServerLogLevel.Verbose;
			case 'requestTime':
				return TsServerLogLevel.RequestTime;
			case 'off':
			default:
				return TsServerLogLevel.Off;
		}
	}

	export function toString(value: TsServerLogLevel): string {
		switch (value) {
			case TsServerLogLevel.Normal:
				return 'normal';
			case TsServerLogLevel.Terse:
				return 'terse';
			case TsServerLogLevel.Verbose:
				return 'verbose';
			case TsServerLogLevel.RequestTime:
				return 'requestTime';
			case TsServerLogLevel.Off:
			default:
				return 'off';
		}
	}
}

export const enum SyntaxServerConfiguration {
	Never,
	Always,
	/** Use a single syntax server for every request, even on desktop */
	Auto,
}

export class ImplicitProjectConfiguration {

	public readonly target: string | undefined;
	public readonly module: string | undefined;
	public readonly checkJs: boolean;
	public readonly experimentalDecorators: boolean;
	public readonly strictNullChecks: boolean;
	public readonly strictFunctionTypes: boolean;
	public readonly strict: boolean;

	constructor(configuration: vscode.WorkspaceConfiguration) {
		this.target = ImplicitProjectConfiguration.readTarget(configuration);
		this.module = ImplicitProjectConfiguration.readModule(configuration);
		this.checkJs = ImplicitProjectConfiguration.readCheckJs(configuration);
		this.experimentalDecorators = ImplicitProjectConfiguration.readExperimentalDecorators(configuration);
		this.strictNullChecks = ImplicitProjectConfiguration.readImplicitStrictNullChecks(configuration);
		this.strictFunctionTypes = ImplicitProjectConfiguration.readImplicitStrictFunctionTypes(configuration);
		this.strict = ImplicitProjectConfiguration.readImplicitStrict(configuration);
	}

	public isEqualTo(other: ImplicitProjectConfiguration): boolean {
		return objects.equals(this, other);
	}

	private static readTarget(configuration: vscode.WorkspaceConfiguration): string | undefined {
		return configuration.get<string>('js/ts.implicitProjectConfig.target');
	}

	private static readModule(configuration: vscode.WorkspaceConfiguration): string | undefined {
		return configuration.get<string>('js/ts.implicitProjectConfig.module');
	}

	private static readCheckJs(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('js/ts.implicitProjectConfig.checkJs', false);
	}

	private static readExperimentalDecorators(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('js/ts.implicitProjectConfig.experimentalDecorators', false);
	}

	private static readImplicitStrictNullChecks(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('js/ts.implicitProjectConfig.strictNullChecks', true);
	}

	private static readImplicitStrictFunctionTypes(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('js/ts.implicitProjectConfig.strictFunctionTypes', true);
	}

	private static readImplicitStrict(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('js/ts.implicitProjectConfig.strict', true);
	}
}

export interface TypeScriptServiceConfiguration {
	readonly locale: string | null;
	readonly globalTsdk: string | null;
	readonly localTsdk: string | null;
	readonly npmLocation: string | null;
	readonly tsServerLogLevel: TsServerLogLevel;
	readonly tsServerPluginPaths: readonly string[];
	readonly implicitProjectConfiguration: ImplicitProjectConfiguration;
	readonly disableAutomaticTypeAcquisition: boolean;
	readonly useSyntaxServer: SyntaxServerConfiguration;
	readonly webProjectWideIntellisenseEnabled: boolean;
	readonly webProjectWideIntellisenseSuppressSemanticErrors: boolean;
	readonly webTypeAcquisitionEnabled: boolean;
	readonly enableDiagnosticsTelemetry: boolean;
	readonly enableProjectDiagnostics: boolean;
	readonly maxTsServerMemory: number;
	readonly enablePromptUseWorkspaceTsdk: boolean;
	readonly useVsCodeWatcher: boolean;
	readonly watchOptions: Proto.WatchOptions | undefined;
	readonly includePackageJsonAutoImports: 'auto' | 'on' | 'off' | undefined;
	readonly enableTsServerTracing: boolean;
	readonly localNodePath: string | null;
	readonly globalNodePath: string | null;
	readonly workspaceSymbolsExcludeLibrarySymbols: boolean;
	readonly enableRegionDiagnostics: boolean;
}

export function areServiceConfigurationsEqual(a: TypeScriptServiceConfiguration, b: TypeScriptServiceConfiguration): boolean {
	return objects.equals(a, b);
}

export interface ServiceConfigurationProvider {
	loadFromWorkspace(): TypeScriptServiceConfiguration;
}

const vscodeWatcherName = 'vscode';
type vscodeWatcherName = typeof vscodeWatcherName;


export abstract class BaseServiceConfigurationProvider implements ServiceConfigurationProvider {

	public loadFromWorkspace(): TypeScriptServiceConfiguration {
		const configuration = vscode.workspace.getConfiguration();
		return {
			locale: this.readLocale(configuration),
			globalTsdk: this.readGlobalTsdk(configuration),
			localTsdk: this.readLocalTsdk(configuration),
			npmLocation: this.readNpmLocation(configuration),
			tsServerLogLevel: this.readTsServerLogLevel(configuration),
			tsServerPluginPaths: this.readTsServerPluginPaths(configuration),
			implicitProjectConfiguration: new ImplicitProjectConfiguration(configuration),
			disableAutomaticTypeAcquisition: this.readDisableAutomaticTypeAcquisition(configuration),
			useSyntaxServer: this.readUseSyntaxServer(configuration),
			webProjectWideIntellisenseEnabled: this.readWebProjectWideIntellisenseEnable(configuration),
			webProjectWideIntellisenseSuppressSemanticErrors: this.readWebProjectWideIntellisenseSuppressSemanticErrors(configuration),
			webTypeAcquisitionEnabled: this.readWebTypeAcquisition(configuration),
			enableDiagnosticsTelemetry: this.readEnableDiagnosticsTelemetry(configuration),
			enableProjectDiagnostics: this.readEnableProjectDiagnostics(configuration),
			maxTsServerMemory: this.readMaxTsServerMemory(configuration),
			enablePromptUseWorkspaceTsdk: this.readEnablePromptUseWorkspaceTsdk(configuration),
			useVsCodeWatcher: this.readUseVsCodeWatcher(configuration),
			watchOptions: this.readWatchOptions(configuration),
			includePackageJsonAutoImports: this.readIncludePackageJsonAutoImports(configuration),
			enableTsServerTracing: this.readEnableTsServerTracing(configuration),
			localNodePath: this.readLocalNodePath(configuration),
			globalNodePath: this.readGlobalNodePath(configuration),
			workspaceSymbolsExcludeLibrarySymbols: this.readWorkspaceSymbolsExcludeLibrarySymbols(configuration),
			enableRegionDiagnostics: this.readEnableRegionDiagnostics(configuration),
		};
	}

	protected abstract readGlobalTsdk(configuration: vscode.WorkspaceConfiguration): string | null;
	protected abstract readLocalTsdk(configuration: vscode.WorkspaceConfiguration): string | null;
	protected abstract readLocalNodePath(configuration: vscode.WorkspaceConfiguration): string | null;
	protected abstract readGlobalNodePath(configuration: vscode.WorkspaceConfiguration): string | null;

	protected readTsServerLogLevel(configuration: vscode.WorkspaceConfiguration): TsServerLogLevel {
		const setting = configuration.get<string>('typescript.tsserver.log', 'off');
		return TsServerLogLevel.fromString(setting);
	}

	protected readTsServerPluginPaths(configuration: vscode.WorkspaceConfiguration): string[] {
		return configuration.get<string[]>('typescript.tsserver.pluginPaths', []);
	}

	protected readNpmLocation(configuration: vscode.WorkspaceConfiguration): string | null {
		return configuration.get<string | null>('typescript.npm', null);
	}

	protected readDisableAutomaticTypeAcquisition(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.disableAutomaticTypeAcquisition', false);
	}

	protected readLocale(configuration: vscode.WorkspaceConfiguration): string | null {
		const value = configuration.get<string>('typescript.locale', 'auto');
		return !value || value === 'auto' ? null : value;
	}

	protected readUseSyntaxServer(configuration: vscode.WorkspaceConfiguration): SyntaxServerConfiguration {
		const value = configuration.get<string>('typescript.tsserver.useSyntaxServer');
		switch (value) {
			case 'never': return SyntaxServerConfiguration.Never;
			case 'always': return SyntaxServerConfiguration.Always;
			case 'auto': return SyntaxServerConfiguration.Auto;
		}

		// Fallback to deprecated setting
		const deprecatedValue = configuration.get<boolean | string>('typescript.tsserver.useSeparateSyntaxServer', true);
		if (deprecatedValue === 'forAllRequests') { // Undocumented setting
			return SyntaxServerConfiguration.Always;
		}
		if (deprecatedValue === true) {
			return SyntaxServerConfiguration.Auto;
		}
		return SyntaxServerConfiguration.Never;
	}

	protected readEnableDiagnosticsTelemetry(configuration: vscode.WorkspaceConfiguration): boolean {
		// This setting does not appear in the settings view, as it is not to be enabled by users outside the team
		return configuration.get<boolean>('typescript.enableDiagnosticsTelemetry', false);
	}

	protected readEnableProjectDiagnostics(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.tsserver.experimental.enableProjectDiagnostics', false);
	}

	private readUseVsCodeWatcher(configuration: vscode.WorkspaceConfiguration): boolean {
		const watcherExcludes = configuration.get<Record<string, boolean>>('files.watcherExclude') ?? {};
		if (
			watcherExcludes['**/node_modules/*/**'] === true || // VS Code default prior to 1.94.x
			watcherExcludes['**/node_modules/**'] === true ||
			watcherExcludes['**/node_modules'] === true ||
			watcherExcludes['**'] === true	 					// VS Code Watching is entirely disabled
		) {
			return false;
		}

		const experimentalConfig = configuration.inspect('typescript.tsserver.experimental.useVsCodeWatcher');
		if (typeof experimentalConfig?.globalValue === 'boolean') {
			return experimentalConfig.globalValue;
		}
		if (typeof experimentalConfig?.workspaceValue === 'boolean') {
			return experimentalConfig.workspaceValue;
		}
		if (typeof experimentalConfig?.workspaceFolderValue === 'boolean') {
			return experimentalConfig.workspaceFolderValue;
		}

		return configuration.get<Proto.WatchOptions | vscodeWatcherName>('typescript.tsserver.watchOptions', vscodeWatcherName) === vscodeWatcherName;
	}

	private readWatchOptions(configuration: vscode.WorkspaceConfiguration): Proto.WatchOptions | undefined {
		const watchOptions = configuration.get<Proto.WatchOptions | vscodeWatcherName>('typescript.tsserver.watchOptions');
		if (watchOptions === vscodeWatcherName) {
			return undefined;
		}

		// Returned value may be a proxy. Clone it into a normal object
		return { ...(watchOptions ?? {}) };
	}

	protected readIncludePackageJsonAutoImports(configuration: vscode.WorkspaceConfiguration): 'auto' | 'on' | 'off' | undefined {
		return configuration.get<'auto' | 'on' | 'off'>('typescript.preferences.includePackageJsonAutoImports');
	}

	protected readMaxTsServerMemory(configuration: vscode.WorkspaceConfiguration): number {
		const defaultMaxMemory = 3072;
		const minimumMaxMemory = 128;
		const memoryInMB = configuration.get<number>('typescript.tsserver.maxTsServerMemory', defaultMaxMemory);
		if (!Number.isSafeInteger(memoryInMB)) {
			return defaultMaxMemory;
		}
		return Math.max(memoryInMB, minimumMaxMemory);
	}

	protected readEnablePromptUseWorkspaceTsdk(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.enablePromptUseWorkspaceTsdk', false);
	}

	protected readEnableTsServerTracing(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.tsserver.enableTracing', false);
	}

	private readWorkspaceSymbolsExcludeLibrarySymbols(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.workspaceSymbols.excludeLibrarySymbols', true);
	}

	private readWebProjectWideIntellisenseEnable(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.tsserver.web.projectWideIntellisense.enabled', true);
	}

	private readWebProjectWideIntellisenseSuppressSemanticErrors(configuration: vscode.WorkspaceConfiguration): boolean {
		return this.readWebTypeAcquisition(configuration) && configuration.get<boolean>('typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors', false);
	}

	private readWebTypeAcquisition(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.tsserver.web.typeAcquisition.enabled', true);
	}

	private readEnableRegionDiagnostics(configuration: vscode.WorkspaceConfiguration): boolean {
		return configuration.get<boolean>('typescript.tsserver.enableRegionDiagnostics', true);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/documentSelector.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/documentSelector.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface DocumentSelector {
	/**
	 * Selector for files which only require a basic syntax server.
	 */
	readonly syntax: readonly vscode.DocumentFilter[];

	/**
	 * Selector for files which require semantic server support.
	 */
	readonly semantic: readonly vscode.DocumentFilter[];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/fileSchemes.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/fileSchemes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { isWeb } from '../utils/platform';

export const file = 'file';
export const untitled = 'untitled';
export const git = 'git';
export const github = 'github';
export const azurerepos = 'azurerepos';
export const chatEditingTextModel = 'chat-editing-text-model';

/** Live share scheme */
export const vsls = 'vsls';
export const walkThroughSnippet = 'walkThroughSnippet';
export const vscodeNotebookCell = 'vscode-notebook-cell';
export const officeScript = 'office-script';

/** Used for code blocks in chat by vs code core */
export const chatCodeBlock = 'vscode-chat-code-block';

export function getSemanticSupportedSchemes() {
	const alwaysSupportedSchemes = [
		untitled,
		walkThroughSnippet,
		vscodeNotebookCell,
		chatCodeBlock,
	];

	if (isWeb()) {
		return [
			...(vscode.workspace.workspaceFolders ?? []).map(folder => folder.uri.scheme),
			...alwaysSupportedSchemes,
		];
	}

	return [
		file,
		...alwaysSupportedSchemes,
	];
}

/**
 * File scheme for which JS/TS language feature should be disabled
 */
export const disabledSchemes = new Set([
	git,
	vsls,
	github,
	azurerepos,
	chatEditingTextModel,
]);

export function isOfScheme(uri: vscode.Uri, ...schemes: string[]): boolean {
	const normalizedUriScheme = uri.scheme.toLowerCase();
	return schemes.some(scheme => normalizedUriScheme === scheme);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/languageDescription.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/languageDescription.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename } from 'path';
import * as vscode from 'vscode';
import * as languageIds from './languageIds';

export const enum DiagnosticLanguage {
	JavaScript,
	TypeScript
}

export const allDiagnosticLanguages = [DiagnosticLanguage.JavaScript, DiagnosticLanguage.TypeScript];

export interface LanguageDescription {
	readonly id: string;
	readonly diagnosticOwner: string;
	readonly diagnosticSource: string;
	readonly diagnosticLanguage: DiagnosticLanguage;
	readonly languageIds: readonly string[];
	readonly configFilePattern?: RegExp;
	readonly isExternal?: boolean;
	readonly standardFileExtensions: readonly string[];
}

export const standardLanguageDescriptions: LanguageDescription[] = [
	{
		id: 'typescript',
		diagnosticOwner: 'typescript',
		diagnosticSource: 'ts',
		diagnosticLanguage: DiagnosticLanguage.TypeScript,
		languageIds: [languageIds.typescript, languageIds.typescriptreact],
		configFilePattern: /^tsconfig(\..*)?\.json$/i,
		standardFileExtensions: [
			'ts',
			'tsx',
			'cts',
			'mts'
		],
	}, {
		id: 'javascript',
		diagnosticOwner: 'typescript',
		diagnosticSource: 'ts',
		diagnosticLanguage: DiagnosticLanguage.JavaScript,
		languageIds: [languageIds.javascript, languageIds.javascriptreact],
		configFilePattern: /^jsconfig(\..*)?\.json$/i,
		standardFileExtensions: [
			'js',
			'jsx',
			'cjs',
			'mjs',
			'es6',
			'pac',
		],
	}
];

export function isTsConfigFileName(fileName: string): boolean {
	return /^tsconfig\.(.+\.)?json$/i.test(basename(fileName));
}

export function isJsConfigOrTsConfigFileName(fileName: string): boolean {
	return /^[jt]sconfig\.(.+\.)?json$/i.test(basename(fileName));
}

export function doesResourceLookLikeATypeScriptFile(resource: vscode.Uri): boolean {
	return /\.(tsx?|mts|cts)$/i.test(resource.fsPath);
}

export function doesResourceLookLikeAJavaScriptFile(resource: vscode.Uri): boolean {
	return /\.(jsx?|mjs|cjs)$/i.test(resource.fsPath);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/languageIds.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/languageIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export const typescript = 'typescript';
export const typescriptreact = 'typescriptreact';
export const javascript = 'javascript';
export const javascriptreact = 'javascriptreact';
export const jsxTags = 'jsx-tags';

export const jsTsLanguageModes = [
	javascript,
	javascriptreact,
	typescript,
	typescriptreact,
];

export function isSupportedLanguageMode(doc: vscode.TextDocument) {
	return vscode.languages.match([typescript, typescriptreact, javascript, javascriptreact], doc) > 0;
}

export function isTypeScriptDocument(doc: vscode.TextDocument) {
	return vscode.languages.match([typescript, typescriptreact], doc) > 0;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/configuration/schemes.ts]---
Location: vscode-main/extensions/typescript-language-features/src/configuration/schemes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const Schemes = Object.freeze({
	file: 'file',
	untitled: 'untitled',
	mailto: 'mailto',
	vscode: 'vscode',
	'vscode-insiders': 'vscode-insiders',
	notebookCell: 'vscode-notebook-cell',
});

export function isOfScheme(scheme: string, link: string): boolean {
	return link.toLowerCase().startsWith(scheme + ':');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/filesystems/ata.ts]---
Location: vscode-main/extensions/typescript-language-features/src/filesystems/ata.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { conditionalRegistration, requireGlobalConfiguration } from '../languageFeatures/util/dependentRegistration';
import { supportsReadableByteStreams } from '../utils/platform';
import { AutoInstallerFs } from './autoInstallerFs';
import { MemFs } from './memFs';
import { Logger } from '../logging/logger';

export function registerAtaSupport(logger: Logger): vscode.Disposable {
	if (!supportsReadableByteStreams()) {
		return vscode.Disposable.from();
	}

	return conditionalRegistration([
		requireGlobalConfiguration('typescript', 'tsserver.web.typeAcquisition.enabled'),
	], () => {
		return vscode.Disposable.from(
			// Ata
			vscode.workspace.registerFileSystemProvider('vscode-global-typings', new MemFs('global-typings', logger), {
				isCaseSensitive: true,
				isReadonly: false,
			}),

			// Read accesses to node_modules
			vscode.workspace.registerFileSystemProvider('vscode-node-modules', new AutoInstallerFs(logger), {
				isCaseSensitive: true,
				isReadonly: false
			}));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/filesystems/autoInstallerFs.ts]---
Location: vscode-main/extensions/typescript-language-features/src/filesystems/autoInstallerFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PackageManager, ResolvedProject } from '@vscode/ts-package-manager';
import { basename, join } from 'path';
import * as vscode from 'vscode';
import { URI } from 'vscode-uri';
import { Disposable } from '../utils/dispose';
import { MemFs } from './memFs';
import { Logger } from '../logging/logger';

const TEXT_DECODER = new TextDecoder('utf-8');
const TEXT_ENCODER = new TextEncoder();

export class AutoInstallerFs extends Disposable implements vscode.FileSystemProvider {

	private readonly memfs: MemFs;
	private readonly packageManager: PackageManager;
	private readonly _projectCache = new Map</* root */ string, Promise<void> | undefined>();

	private readonly _emitter = this._register(new vscode.EventEmitter<vscode.FileChangeEvent[]>());
	readonly onDidChangeFile = this._emitter.event;

	constructor(
		private readonly logger: Logger
	) {
		super();

		const memfs = new MemFs('auto-installer', logger);
		this.memfs = memfs;
		memfs.onDidChangeFile((e) => {
			this._emitter.fire(e.map(ev => ({
				type: ev.type,
				// TODO: we're gonna need a MappedUri dance...
				uri: ev.uri.with({ scheme: 'memfs' })
			})));
		});

		this.packageManager = new PackageManager({
			readDirectory(path: string, _extensions?: readonly string[], _exclude?: readonly string[], _include?: readonly string[], _depth?: number): string[] {
				return memfs.readDirectory(URI.file(path)).map(([name, _]) => name);
			},

			deleteFile(path: string): void {
				memfs.delete(URI.file(path));
			},

			createDirectory(path: string): void {
				memfs.createDirectory(URI.file(path));
			},

			writeFile(path: string, data: string, _writeByteOrderMark?: boolean): void {
				memfs.writeFile(URI.file(path), TEXT_ENCODER.encode(data), { overwrite: true, create: true });
			},

			directoryExists(path: string): boolean {
				try {
					const stat = memfs.stat(URI.file(path));
					return stat.type === vscode.FileType.Directory;
				} catch (e) {
					return false;
				}
			},

			readFile(path: string, _encoding?: string): string | undefined {
				try {
					return TEXT_DECODER.decode(memfs.readFile(URI.file(path)));
				} catch (e) {
					return undefined;
				}
			}
		});
	}

	watch(resource: vscode.Uri): vscode.Disposable {
		this.logger.trace(`AutoInstallerFs.watch. Resource: ${resource.toString()}}`);
		return this.memfs.watch(resource);
	}

	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		this.logger.trace(`AutoInstallerFs.stat: ${uri}`);

		const mapped = new MappedUri(uri);

		// TODO: case sensitivity configuration

		// We pretend every single node_modules or @types directory ever actually
		// exists.
		if (basename(mapped.path) === 'node_modules' || basename(mapped.path) === '@types') {
			return {
				mtime: 0,
				ctime: 0,
				type: vscode.FileType.Directory,
				size: 0
			};
		}

		await this.ensurePackageContents(mapped);

		return this.memfs.stat(URI.file(mapped.path));
	}

	async readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		this.logger.trace(`AutoInstallerFs.readDirectory: ${uri}`);

		const mapped = new MappedUri(uri);
		await this.ensurePackageContents(mapped);

		return this.memfs.readDirectory(URI.file(mapped.path));
	}

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		this.logger.trace(`AutoInstallerFs.readFile: ${uri}`);

		const mapped = new MappedUri(uri);
		await this.ensurePackageContents(mapped);

		return this.memfs.readFile(URI.file(mapped.path));
	}

	writeFile(_uri: vscode.Uri, _content: Uint8Array, _options: { create: boolean; overwrite: boolean }): void {
		throw new Error('not implemented');
	}

	rename(_oldUri: vscode.Uri, _newUri: vscode.Uri, _options: { overwrite: boolean }): void {
		throw new Error('not implemented');
	}

	delete(_uri: vscode.Uri): void {
		throw new Error('not implemented');
	}

	createDirectory(_uri: vscode.Uri): void {
		throw new Error('not implemented');
	}

	private async ensurePackageContents(incomingUri: MappedUri): Promise<void> {
		// If we're not looking for something inside node_modules, bail early.
		if (!incomingUri.path.includes('node_modules')) {
			throw vscode.FileSystemError.FileNotFound();
		}

		// standard lib files aren't handled through here
		if (incomingUri.path.includes('node_modules/@typescript') || incomingUri.path.includes('node_modules/@types/typescript__')) {
			throw vscode.FileSystemError.FileNotFound();
		}

		const root = await this.getProjectRoot(incomingUri.original);
		if (!root) {
			return;
		}

		this.logger.trace(`AutoInstallerFs.ensurePackageContents. Path: ${incomingUri.path}, Root: ${root}`);

		const existingInstall = this._projectCache.get(root);
		if (existingInstall) {
			this.logger.trace(`AutoInstallerFs.ensurePackageContents. Found ongoing install for: ${root}/node_modules`);
			return existingInstall;
		}

		const installing = (async () => {
			let proj: ResolvedProject;
			try {
				proj = await this.packageManager.resolveProject(root, await this.getInstallOpts(incomingUri.original, root));
			} catch (e) {
				console.error(`failed to resolve project at ${incomingUri.path}: `, e);
				return;
			}

			try {
				await proj.restore();
			} catch (e) {
				console.error(`failed to restore package at ${incomingUri.path}: `, e);
			}
		})();
		this._projectCache.set(root, installing);
		await installing;
	}

	private async getInstallOpts(originalUri: URI, root: string) {
		const vsfs = vscode.workspace.fs;

		// We definitely need a package.json to be there.
		const pkgJson = TEXT_DECODER.decode(await vsfs.readFile(originalUri.with({ path: join(root, 'package.json') })));

		let kdlLock;
		try {
			kdlLock = TEXT_DECODER.decode(await vsfs.readFile(originalUri.with({ path: join(root, 'package-lock.kdl') })));
		} catch (e) { }

		let npmLock;
		try {
			npmLock = TEXT_DECODER.decode(await vsfs.readFile(originalUri.with({ path: join(root, 'package-lock.json') })));
		} catch (e) { }

		return {
			pkgJson,
			kdlLock,
			npmLock
		};
	}

	private async getProjectRoot(incomingUri: URI): Promise<string | undefined> {
		const vsfs = vscode.workspace.fs;
		const pkgPath = incomingUri.path.match(/^(.*?)\/node_modules/);
		const ret = pkgPath?.[1];
		if (!ret) {
			return;
		}
		try {
			await vsfs.stat(incomingUri.with({ path: join(ret, 'package.json') }));
			return ret;
		} catch (e) {
			return;
		}
	}
}

class MappedUri {
	readonly raw: vscode.Uri;
	readonly original: vscode.Uri;
	readonly mapped: vscode.Uri;
	constructor(uri: vscode.Uri) {
		this.raw = uri;

		const parts = uri.path.match(/^\/([^\/]+)\/([^\/]*)(?:\/(.+))?$/);
		if (!parts) {
			throw new Error(`Invalid uri: ${uri.toString()}, ${uri.path}`);
		}

		const scheme = parts[1];
		const authority = parts[2] === 'ts-nul-authority' ? '' : parts[2];
		const path = parts[3];
		this.original = URI.from({ scheme, authority, path: (path ? '/' + path : path) });
		this.mapped = this.original.with({ scheme: this.raw.scheme, authority: this.raw.authority });
	}

	get path() {
		return this.mapped.path;
	}
	get scheme() {
		return this.mapped.scheme;
	}
	get authority() {
		return this.mapped.authority;
	}
	get flatPath() {
		return join('/', this.scheme, this.authority, this.path);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/filesystems/memFs.ts]---
Location: vscode-main/extensions/typescript-language-features/src/filesystems/memFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { basename, dirname } from 'path';
import * as vscode from 'vscode';
import { Logger } from '../logging/logger';

export class MemFs implements vscode.FileSystemProvider {

	private readonly root = new FsDirectoryEntry(
		new Map(),
		0,
		0,
	);

	constructor(
		private readonly id: string,
		private readonly logger: Logger,
	) { }

	stat(uri: vscode.Uri): vscode.FileStat {
		this.logger.trace(`MemFs.stat ${this.id}. uri: ${uri}`);
		const entry = this.getEntry(uri);
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound();
		}

		return entry;
	}

	readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
		this.logger.trace(`MemFs.readDirectory ${this.id}. uri: ${uri}`);

		const entry = this.getEntry(uri);
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound();
		}
		if (!(entry instanceof FsDirectoryEntry)) {
			throw vscode.FileSystemError.FileNotADirectory();
		}

		return Array.from(entry.contents.entries(), ([name, entry]) => [name, entry.type]);
	}

	readFile(uri: vscode.Uri): Uint8Array {
		this.logger.trace(`MemFs.readFile ${this.id}. uri: ${uri}`);

		const entry = this.getEntry(uri);
		if (!entry) {
			throw vscode.FileSystemError.FileNotFound();
		}

		if (!(entry instanceof FsFileEntry)) {
			throw vscode.FileSystemError.FileIsADirectory(uri);
		}

		return entry.data;
	}

	writeFile(uri: vscode.Uri, content: Uint8Array, { create, overwrite }: { create: boolean; overwrite: boolean }): void {
		this.logger.trace(`MemFs.writeFile ${this.id}. uri: ${uri}`);

		const dir = this.getParent(uri);

		const fileName = basename(uri.path);
		const dirContents = dir.contents;

		const time = Date.now() / 1000;
		const entry = dirContents.get(basename(uri.path));
		if (!entry) {
			if (create) {
				dirContents.set(fileName, new FsFileEntry(content, time, time));
				this._emitter.fire([{ type: vscode.FileChangeType.Created, uri }]);
			} else {
				throw vscode.FileSystemError.FileNotFound();
			}
		} else {
			if (entry instanceof FsDirectoryEntry) {
				throw vscode.FileSystemError.FileIsADirectory(uri);
			}

			if (overwrite) {
				entry.mtime = time;
				entry.data = content;
				this._emitter.fire([{ type: vscode.FileChangeType.Changed, uri }]);
			} else {
				throw vscode.FileSystemError.NoPermissions('overwrite option was not passed in');
			}
		}
	}

	rename(_oldUri: vscode.Uri, _newUri: vscode.Uri, _options: { overwrite: boolean }): void {
		throw new Error('not implemented');
	}

	delete(uri: vscode.Uri): void {
		try {
			const dir = this.getParent(uri);
			dir.contents.delete(basename(uri.path));
			this._emitter.fire([{ type: vscode.FileChangeType.Deleted, uri }]);
		} catch (e) { }
	}

	createDirectory(uri: vscode.Uri): void {
		this.logger.trace(`MemFs.createDirectory ${this.id}. uri: ${uri}`);

		const dir = this.getParent(uri);
		const now = Date.now() / 1000;
		dir.contents.set(basename(uri.path), new FsDirectoryEntry(new Map(), now, now));
	}

	private getEntry(uri: vscode.Uri): FsEntry | undefined {
		// TODO: have this throw FileNotFound itself?
		// TODO: support configuring case sensitivity
		let node: FsEntry = this.root;
		for (const component of uri.path.split('/')) {
			if (!component) {
				// Skip empty components (root, stuff between double slashes,
				// trailing slashes)
				continue;
			}

			if (!(node instanceof FsDirectoryEntry)) {
				// We're looking at a File or such, so bail.
				return;
			}

			const next = node.contents.get(component);
			if (!next) {
				// not found!
				return;
			}

			node = next;
		}
		return node;
	}

	private getParent(uri: vscode.Uri): FsDirectoryEntry {
		const dir = this.getEntry(uri.with({ path: dirname(uri.path) }));
		if (!dir) {
			throw vscode.FileSystemError.FileNotFound();
		}
		if (!(dir instanceof FsDirectoryEntry)) {
			throw vscode.FileSystemError.FileNotADirectory();
		}
		return dir;
	}

	// --- manage file events

	private readonly _emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();

	readonly onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._emitter.event;
	private readonly watchers = new Map<string, Set<Symbol>>;

	watch(resource: vscode.Uri): vscode.Disposable {
		if (!this.watchers.has(resource.path)) {
			this.watchers.set(resource.path, new Set());
		}
		const sy = Symbol(resource.path);
		return new vscode.Disposable(() => {
			const watcher = this.watchers.get(resource.path);
			if (watcher) {
				watcher.delete(sy);
				if (!watcher.size) {
					this.watchers.delete(resource.path);
				}
			}
		});
	}
}

class FsFileEntry {
	readonly type = vscode.FileType.File;

	get size(): number {
		return this.data.length;
	}

	constructor(
		public data: Uint8Array,
		public readonly ctime: number,
		public mtime: number,
	) { }
}

class FsDirectoryEntry {
	readonly type = vscode.FileType.Directory;

	get size(): number {
		return [...this.contents.values()].reduce((acc: number, entry: FsEntry) => acc + entry.size, 0);
	}

	constructor(
		public readonly contents: Map<string, FsEntry>,
		public readonly ctime: number,
		public readonly mtime: number,
	) { }
}

type FsEntry = FsFileEntry | FsDirectoryEntry;
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/callHierarchy.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/callHierarchy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { API } from '../tsServer/api';
import { parseKindModifier } from '../tsServer/protocol/modifiers';
import type * as Proto from '../tsServer/protocol/protocol';
import * as PConst from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { conditionalRegistration, requireMinVersion, requireSomeCapability } from './util/dependentRegistration';

class TypeScriptCallHierarchySupport implements vscode.CallHierarchyProvider {
	public static readonly minVersion = API.v380;

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async prepareCallHierarchy(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.CallHierarchyItem | vscode.CallHierarchyItem[] | undefined> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
		const response = await this.client.execute('prepareCallHierarchy', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		return Array.isArray(response.body)
			? response.body.map(fromProtocolCallHierarchyItem)
			: fromProtocolCallHierarchyItem(response.body);
	}

	public async provideCallHierarchyIncomingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): Promise<vscode.CallHierarchyIncomingCall[] | undefined> {
		const filepath = this.client.toTsFilePath(item.uri);
		if (!filepath) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, item.selectionRange.start);
		const response = await this.client.execute('provideCallHierarchyIncomingCalls', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		return response.body.map(fromProtocolCallHierarchyIncomingCall);
	}

	public async provideCallHierarchyOutgoingCalls(item: vscode.CallHierarchyItem, token: vscode.CancellationToken): Promise<vscode.CallHierarchyOutgoingCall[] | undefined> {
		const filepath = this.client.toTsFilePath(item.uri);
		if (!filepath) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, item.selectionRange.start);
		const response = await this.client.execute('provideCallHierarchyOutgoingCalls', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		return response.body.map(fromProtocolCallHierarchyOutgoingCall);
	}
}

function isSourceFileItem(item: Proto.CallHierarchyItem) {
	return item.kind === PConst.Kind.script || item.kind === PConst.Kind.module && item.selectionSpan.start.line === 1 && item.selectionSpan.start.offset === 1;
}

function fromProtocolCallHierarchyItem(item: Proto.CallHierarchyItem): vscode.CallHierarchyItem {
	const useFileName = isSourceFileItem(item);
	const name = useFileName ? path.basename(item.file) : item.name;
	const detail = useFileName ? vscode.workspace.asRelativePath(path.dirname(item.file)) : item.containerName ?? '';
	const result = new vscode.CallHierarchyItem(
		typeConverters.SymbolKind.fromProtocolScriptElementKind(item.kind),
		name,
		detail,
		vscode.Uri.file(item.file),
		typeConverters.Range.fromTextSpan(item.span),
		typeConverters.Range.fromTextSpan(item.selectionSpan)
	);

	const kindModifiers = item.kindModifiers ? parseKindModifier(item.kindModifiers) : undefined;
	if (kindModifiers?.has(PConst.KindModifiers.deprecated)) {
		result.tags = [vscode.SymbolTag.Deprecated];
	}
	return result;
}

function fromProtocolCallHierarchyIncomingCall(item: Proto.CallHierarchyIncomingCall): vscode.CallHierarchyIncomingCall {
	return new vscode.CallHierarchyIncomingCall(
		fromProtocolCallHierarchyItem(item.from),
		item.fromSpans.map(typeConverters.Range.fromTextSpan)
	);
}

function fromProtocolCallHierarchyOutgoingCall(item: Proto.CallHierarchyOutgoingCall): vscode.CallHierarchyOutgoingCall {
	return new vscode.CallHierarchyOutgoingCall(
		fromProtocolCallHierarchyItem(item.to),
		item.fromSpans.map(typeConverters.Range.fromTextSpan)
	);
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient
) {
	return conditionalRegistration([
		requireMinVersion(client, TypeScriptCallHierarchySupport.minVersion),
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCallHierarchyProvider(selector.semantic,
			new TypeScriptCallHierarchySupport(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/completions.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/completions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command, CommandManager } from '../commands/commandManager';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import { TelemetryReporter } from '../logging/telemetry';
import { API } from '../tsServer/api';
import { parseKindModifier } from '../tsServer/protocol/modifiers';
import type * as Proto from '../tsServer/protocol/protocol';
import * as PConst from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient, ServerResponse } from '../typescriptService';
import TypingsStatus from '../ui/typingsStatus';
import { nulToken } from '../utils/cancellation';
import FileConfigurationManager from './fileConfigurationManager';
import { applyCodeAction } from './util/codeAction';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';
import { snippetForFunctionCall } from './util/snippetForFunctionCall';
import * as Previewer from './util/textRendering';


interface DotAccessorContext {
	readonly range: vscode.Range;
	readonly text: string;
}

interface CompletionContext {
	readonly isNewIdentifierLocation: boolean;
	readonly isMemberCompletion: boolean;

	readonly dotAccessorContext?: DotAccessorContext;

	readonly enableCallCompletions: boolean;
	readonly completeFunctionCalls: boolean;

	readonly wordRange: vscode.Range | undefined;
	readonly line: string;
	readonly optionalReplacementRange: vscode.Range | undefined;
}

type ResolvedCompletionItem = {
	readonly edits?: readonly vscode.TextEdit[];
	readonly commands: readonly vscode.Command[];
};

class MyCompletionItem extends vscode.CompletionItem {

	public readonly useCodeSnippet: boolean;

	constructor(
		public readonly position: vscode.Position,
		public readonly document: vscode.TextDocument,
		public readonly tsEntry: Proto.CompletionEntry,
		private readonly completionContext: CompletionContext,
		public readonly metadata: unknown | undefined,
		client: ITypeScriptServiceClient,
		defaultCommitCharacters: readonly string[] | undefined,
	) {
		const label = tsEntry.name || (tsEntry.insertText ?? '');
		super(label, MyCompletionItem.convertKind(tsEntry.kind));

		if (tsEntry.source && tsEntry.hasAction && client.apiVersion.lt(API.v490)) {
			// De-prioritze auto-imports
			// https://github.com/microsoft/vscode/issues/40311
			this.sortText = '\uffff' + tsEntry.sortText;
		} else {
			this.sortText = tsEntry.sortText;
		}

		if (tsEntry.source && tsEntry.hasAction) {
			// Render "fancy" when source is a workspace path
			const qualifierCandidate = vscode.workspace.asRelativePath(tsEntry.source);
			if (qualifierCandidate !== tsEntry.source) {
				this.label = { label, description: qualifierCandidate };
			}

		}

		const { sourceDisplay, isSnippet } = tsEntry;
		if (sourceDisplay) {
			this.label = { label, description: Previewer.asPlainTextWithLinks(sourceDisplay, client) };
		}

		if (tsEntry.labelDetails) {
			this.label = { label, ...tsEntry.labelDetails };
		}

		this.preselect = tsEntry.isRecommended;
		this.position = position;
		this.useCodeSnippet = completionContext.completeFunctionCalls && (this.kind === vscode.CompletionItemKind.Function || this.kind === vscode.CompletionItemKind.Method);

		this.range = this.getRangeFromReplacementSpan(tsEntry, completionContext);
		this.commitCharacters = MyCompletionItem.getCommitCharacters(completionContext, tsEntry, defaultCommitCharacters);
		this.insertText = isSnippet && tsEntry.insertText ? new vscode.SnippetString(tsEntry.insertText) : tsEntry.insertText;
		this.filterText = tsEntry.filterText || this.getFilterText(completionContext.line, tsEntry.insertText);

		if (completionContext.isMemberCompletion && completionContext.dotAccessorContext && !(this.insertText instanceof vscode.SnippetString)) {
			this.filterText = completionContext.dotAccessorContext.text + (this.insertText || this.textLabel);
			if (!this.range) {
				const replacementRange = this.completionContext.wordRange;
				if (replacementRange) {
					this.range = {
						inserting: completionContext.dotAccessorContext.range,
						replacing: completionContext.dotAccessorContext.range.union(replacementRange),
					};
				} else {
					this.range = completionContext.dotAccessorContext.range;
				}
				this.insertText = this.filterText;
			}
		}

		if (tsEntry.kindModifiers) {
			const kindModifiers = parseKindModifier(tsEntry.kindModifiers);
			if (kindModifiers.has(PConst.KindModifiers.optional)) {
				this.insertText ??= this.textLabel;
				this.filterText ??= this.textLabel;

				if (typeof this.label === 'string') {
					this.label += '?';
				} else {
					this.label.label += '?';
				}
			}
			if (kindModifiers.has(PConst.KindModifiers.deprecated)) {
				this.tags = [vscode.CompletionItemTag.Deprecated];
			}

			if (kindModifiers.has(PConst.KindModifiers.color)) {
				this.kind = vscode.CompletionItemKind.Color;
			}

			this.detail = getScriptKindDetails(tsEntry);
		}

		this.resolveRange();
	}

	private get textLabel() {
		return typeof this.label === 'string' ? this.label : this.label.label;
	}

	private _resolvedPromise?: {
		readonly requestToken: vscode.CancellationTokenSource;
		readonly promise: Promise<ResolvedCompletionItem | undefined>;
		waiting: number;
	};

	public async resolveCompletionItem(
		client: ITypeScriptServiceClient,
		token: vscode.CancellationToken,
	): Promise<ResolvedCompletionItem | undefined> {
		token.onCancellationRequested(() => {
			if (this._resolvedPromise && --this._resolvedPromise.waiting <= 0) {
				// Give a little extra time for another caller to come in
				setTimeout(() => {
					if (this._resolvedPromise && this._resolvedPromise.waiting <= 0) {
						this._resolvedPromise.requestToken.cancel();
					}
				}, 300);
			}
		});

		if (this._resolvedPromise) {
			++this._resolvedPromise.waiting;
			return this._resolvedPromise.promise;
		}

		const requestToken = new vscode.CancellationTokenSource();

		const promise = (async (): Promise<ResolvedCompletionItem | undefined> => {
			const filepath = client.toOpenTsFilePath(this.document);
			if (!filepath) {
				return undefined;
			}

			const args: Proto.CompletionDetailsRequestArgs = {
				...typeConverters.Position.toFileLocationRequestArgs(filepath, this.position),
				entryNames: [
					this.tsEntry.source || this.tsEntry.data ? {
						name: this.tsEntry.name,
						source: this.tsEntry.source,
						data: this.tsEntry.data,
					} : this.tsEntry.name
				]
			};
			const response = await client.interruptGetErr(() => client.execute('completionEntryDetails', args, requestToken.token));
			if (response.type !== 'response' || !response.body?.length) {
				return undefined;
			}

			const detail = response.body[0];

			const newItemDetails = this.getDetails(client, detail);
			if (newItemDetails) {
				this.detail = newItemDetails;
			}

			this.documentation = this.getDocumentation(client, detail, this.document.uri);

			const codeAction = this.getCodeActions(detail, filepath);
			const commands: vscode.Command[] = [{
				command: CompletionAcceptedCommand.ID,
				title: '',
				arguments: [this]
			}];
			if (codeAction.command) {
				commands.push(codeAction.command);
			}
			const additionalTextEdits = codeAction.additionalTextEdits;

			if (this.useCodeSnippet) {
				const shouldCompleteFunction = await this.isValidFunctionCompletionContext(client, filepath, this.position, this.document, token);
				if (shouldCompleteFunction) {
					const { snippet, parameterCount } = snippetForFunctionCall({ ...this, label: this.textLabel }, detail.displayParts);
					this.insertText = snippet;
					if (parameterCount > 0) {
						//Fix for https://github.com/microsoft/vscode/issues/104059
						//Don't show parameter hints if "editor.parameterHints.enabled": false
						if (vscode.workspace.getConfiguration('editor.parameterHints').get('enabled')) {
							commands.push({ title: 'triggerParameterHints', command: 'editor.action.triggerParameterHints' });
						}
					}
				}
			}

			return { commands, edits: additionalTextEdits };
		})();

		this._resolvedPromise = {
			promise,
			requestToken,
			waiting: 1,
		};

		return this._resolvedPromise.promise;
	}

	private getDetails(
		client: ITypeScriptServiceClient,
		detail: Proto.CompletionEntryDetails,
	): string | undefined {
		const parts: string[] = [];

		if (detail.kind === PConst.Kind.script) {
			// details were already added
			return undefined;
		}

		for (const action of detail.codeActions ?? []) {
			parts.push(action.description);
		}

		parts.push(Previewer.asPlainTextWithLinks(detail.displayParts, client));
		return parts.join('\n\n');
	}

	private getDocumentation(
		client: ITypeScriptServiceClient,
		detail: Proto.CompletionEntryDetails,
		baseUri: vscode.Uri,
	): vscode.MarkdownString | undefined {
		const documentation = new vscode.MarkdownString();
		Previewer.appendDocumentationAsMarkdown(documentation, detail.documentation, detail.tags, client);
		documentation.baseUri = baseUri;
		return documentation.value.length ? documentation : undefined;
	}

	private async isValidFunctionCompletionContext(
		client: ITypeScriptServiceClient,
		filepath: string,
		position: vscode.Position,
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Promise<boolean> {
		// Workaround for https://github.com/microsoft/TypeScript/issues/12677
		// Don't complete function calls inside of destructive assignments or imports
		try {
			const args: Proto.FileLocationRequestArgs = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
			const response = await client.execute('quickinfo', args, token);
			if (response.type === 'response' && response.body) {
				switch (response.body.kind) {
					case 'var':
					case 'let':
					case 'const':
					case 'alias':
						return false;
				}
			}
		} catch {
			// Noop
		}

		const line = document.lineAt(position.line);
		// Don't complete function call if there is already something that looks like a function call
		// https://github.com/microsoft/vscode/issues/18131

		const after = line.text.slice(position.character);
		if (after.match(/^[a-z_$0-9]*\s*\(/gi)) {
			return false;
		}

		// Don't complete function call if it looks like a jsx tag.
		const before = line.text.slice(0, position.character);
		if (before.match(/<\s*[\w]*$/gi)) {
			return false;
		}

		return true;
	}

	private getCodeActions(
		detail: Proto.CompletionEntryDetails,
		filepath: string
	): { command?: vscode.Command; additionalTextEdits?: vscode.TextEdit[] } {
		if (!detail.codeActions?.length) {
			return {};
		}

		// Try to extract out the additionalTextEdits for the current file.
		// Also check if we still have to apply other workspace edits and commands
		// using a vscode command
		const additionalTextEdits: vscode.TextEdit[] = [];
		let hasRemainingCommandsOrEdits = false;
		for (const tsAction of detail.codeActions) {
			if (tsAction.commands) {
				hasRemainingCommandsOrEdits = true;
			}

			// Apply all edits in the current file using `additionalTextEdits`
			if (tsAction.changes) {
				for (const change of tsAction.changes) {
					if (change.fileName === filepath) {
						additionalTextEdits.push(...change.textChanges.map(typeConverters.TextEdit.fromCodeEdit));
					} else {
						hasRemainingCommandsOrEdits = true;
					}
				}
			}
		}

		let command: vscode.Command | undefined = undefined;
		if (hasRemainingCommandsOrEdits) {
			// Create command that applies all edits not in the current file.
			command = {
				title: '',
				command: ApplyCompletionCodeActionCommand.ID,
				arguments: [filepath, detail.codeActions.map((x): Proto.CodeAction => ({
					commands: x.commands,
					description: x.description,
					changes: x.changes.filter(x => x.fileName !== filepath)
				}))]
			};
		}

		return {
			command,
			additionalTextEdits: additionalTextEdits.length ? additionalTextEdits : undefined
		};
	}

	private getRangeFromReplacementSpan(tsEntry: Proto.CompletionEntry, completionContext: CompletionContext) {
		if (!tsEntry.replacementSpan) {
			if (completionContext.optionalReplacementRange) {
				return {
					inserting: new vscode.Range(completionContext.optionalReplacementRange.start, this.position),
					replacing: completionContext.optionalReplacementRange,
				};
			}

			return undefined;
		}

		// If TS returns an explicit replacement range on this item, we should use it for both types of completion

		// Make sure we only replace a single line at most
		let replaceRange = typeConverters.Range.fromTextSpan(tsEntry.replacementSpan);
		if (!replaceRange.isSingleLine) {
			replaceRange = new vscode.Range(replaceRange.start.line, replaceRange.start.character, replaceRange.start.line, completionContext.line.length);
		}
		return {
			inserting: replaceRange,
			replacing: replaceRange,
		};
	}

	private getFilterText(line: string, insertText: string | undefined): string | undefined {
		// Handle private field completions
		if (this.tsEntry.name.startsWith('#')) {
			const wordRange = this.completionContext.wordRange;
			const wordStart = wordRange ? line.charAt(wordRange.start.character) : undefined;
			if (insertText) {
				if (insertText.startsWith('this.#')) {
					return wordStart === '#' ? insertText : insertText.replace(/^this\.#/, '');
				} else {
					return insertText;
				}
			} else {
				return wordStart === '#' ? undefined : this.tsEntry.name.replace(/^#/, '');
			}
		}

		// For `this.` completions, generally don't set the filter text since we don't want them to be overly prioritized. #74164
		if (insertText?.startsWith('this.')) {
			return undefined;
		}

		// Handle the case:
		// ```
		// const xyz = { 'ab c': 1 };
		// xyz.ab|
		// ```
		// In which case we want to insert a bracket accessor but should use `.abc` as the filter text instead of
		// the bracketed insert text.
		else if (insertText?.startsWith('[')) {
			return insertText.replace(/^\[['"](.+)[['"]\]$/, '.$1');
		}

		// In all other cases, fallback to using the insertText
		return insertText;
	}

	private resolveRange(): void {
		if (this.range) {
			return;
		}

		const replaceRange = this.completionContext.wordRange;
		if (replaceRange) {
			this.range = {
				inserting: new vscode.Range(replaceRange.start, this.position),
				replacing: replaceRange
			};
		}
	}

	private static convertKind(kind: string): vscode.CompletionItemKind {
		switch (kind) {
			case PConst.Kind.primitiveType:
			case PConst.Kind.keyword:
				return vscode.CompletionItemKind.Keyword;

			case PConst.Kind.const:
			case PConst.Kind.let:
			case PConst.Kind.variable:
			case PConst.Kind.localVariable:
			case PConst.Kind.alias:
			case PConst.Kind.parameter:
				return vscode.CompletionItemKind.Variable;

			case PConst.Kind.memberVariable:
			case PConst.Kind.memberGetAccessor:
			case PConst.Kind.memberSetAccessor:
				return vscode.CompletionItemKind.Field;

			case PConst.Kind.function:
			case PConst.Kind.localFunction:
				return vscode.CompletionItemKind.Function;

			case PConst.Kind.method:
			case PConst.Kind.constructSignature:
			case PConst.Kind.callSignature:
			case PConst.Kind.indexSignature:
				return vscode.CompletionItemKind.Method;

			case PConst.Kind.enum:
				return vscode.CompletionItemKind.Enum;

			case PConst.Kind.enumMember:
				return vscode.CompletionItemKind.EnumMember;

			case PConst.Kind.module:
			case PConst.Kind.externalModuleName:
				return vscode.CompletionItemKind.Module;

			case PConst.Kind.class:
			case PConst.Kind.type:
				return vscode.CompletionItemKind.Class;

			case PConst.Kind.interface:
				return vscode.CompletionItemKind.Interface;

			case PConst.Kind.warning:
				return vscode.CompletionItemKind.Text;

			case PConst.Kind.script:
				return vscode.CompletionItemKind.File;

			case PConst.Kind.directory:
				return vscode.CompletionItemKind.Folder;

			case PConst.Kind.string:
				return vscode.CompletionItemKind.Constant;

			default:
				return vscode.CompletionItemKind.Property;
		}
	}

	private static getCommitCharacters(
		context: CompletionContext,
		entry: Proto.CompletionEntry,
		defaultCommitCharacters: readonly string[] | undefined,
	): string[] | undefined {
		let commitCharacters = entry.commitCharacters ?? (defaultCommitCharacters ? Array.from(defaultCommitCharacters) : undefined);
		if (commitCharacters) {
			if (context.enableCallCompletions
				&& !context.isNewIdentifierLocation
				&& entry.kind !== PConst.Kind.warning
				&& entry.kind !== PConst.Kind.string) {
				commitCharacters.push('(');
			}
			return commitCharacters;
		}

		if (entry.kind === PConst.Kind.warning || entry.kind === PConst.Kind.string) { // Ambient JS word based suggestion, strings
			return undefined;
		}

		if (context.isNewIdentifierLocation) {
			return undefined;
		}

		commitCharacters = ['.', ',', ';'];
		if (context.enableCallCompletions) {
			commitCharacters.push('(');
		}

		return commitCharacters;
	}
}

function getScriptKindDetails(tsEntry: Proto.CompletionEntry,): string | undefined {
	if (!tsEntry.kindModifiers || tsEntry.kind !== PConst.Kind.script) {
		return;
	}

	const kindModifiers = parseKindModifier(tsEntry.kindModifiers);
	for (const extModifier of PConst.KindModifiers.fileExtensionKindModifiers) {
		if (kindModifiers.has(extModifier)) {
			if (tsEntry.name.toLowerCase().endsWith(extModifier)) {
				return tsEntry.name;
			} else {
				return tsEntry.name + extModifier;
			}
		}
	}
	return undefined;
}


class CompletionAcceptedCommand implements Command {
	public static readonly ID = '_typescript.onCompletionAccepted';
	public readonly id = CompletionAcceptedCommand.ID;

	public constructor(
		private readonly onCompletionAccepted: (item: vscode.CompletionItem) => void,
		private readonly telemetryReporter: TelemetryReporter,
	) { }

	public execute(item: vscode.CompletionItem) {
		this.onCompletionAccepted(item);
		if (item instanceof MyCompletionItem) {
			/* __GDPR__
				"completions.accept" : {
					"owner": "mjbvz",
					"isPackageJsonImport" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
					"isImportStatementCompletion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
					"${include}": [
						"${TypeScriptCommonProperties}"
					]
				}
			*/
			this.telemetryReporter.logTelemetry('completions.accept', {
				isPackageJsonImport: item.tsEntry.isPackageJsonImport ? 'true' : undefined,
				isImportStatementCompletion: item.tsEntry.isImportStatementCompletion ? 'true' : undefined,
			});
		}
	}
}

/**
 * Command fired when an completion item needs to be applied
 */
class ApplyCompletionCommand implements Command {
	public static readonly ID = '_typescript.applyCompletionCommand';
	public readonly id = ApplyCompletionCommand.ID;

	public constructor(
		private readonly client: ITypeScriptServiceClient,
	) { }

	public async execute(item: MyCompletionItem) {
		const resolved = await item.resolveCompletionItem(this.client, nulToken);
		if (!resolved) {
			return;
		}

		const { edits, commands } = resolved;

		if (edits) {
			const workspaceEdit = new vscode.WorkspaceEdit();
			for (const edit of edits) {
				workspaceEdit.replace(item.document.uri, edit.range, edit.newText);
			}
			await vscode.workspace.applyEdit(workspaceEdit);
		}

		for (const command of commands) {
			await vscode.commands.executeCommand(command.command, ...(command.arguments ?? []));
		}
	}
}

class ApplyCompletionCodeActionCommand implements Command {
	public static readonly ID = '_typescript.applyCompletionCodeAction';
	public readonly id = ApplyCompletionCodeActionCommand.ID;

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async execute(_file: string, codeActions: Proto.CodeAction[]): Promise<boolean> {
		if (codeActions.length === 0) {
			return true;
		}

		if (codeActions.length === 1) {
			return applyCodeAction(this.client, codeActions[0], nulToken);
		}

		const selection = await vscode.window.showQuickPick(
			codeActions.map(action => ({
				label: action.description,
				description: '',
				action,
			})), {
			placeHolder: vscode.l10n.t("Select code action to apply")
		});

		if (selection) {
			return applyCodeAction(this.client, selection.action, nulToken);
		}
		return false;
	}
}

interface CompletionConfiguration {
	readonly completeFunctionCalls: boolean;
	readonly nameSuggestions: boolean;
	readonly pathSuggestions: boolean;
	readonly autoImportSuggestions: boolean;
	readonly importStatementSuggestions: boolean;
}

namespace CompletionConfiguration {
	export const completeFunctionCalls = 'suggest.completeFunctionCalls';
	export const nameSuggestions = 'suggest.names';
	export const pathSuggestions = 'suggest.paths';
	export const autoImportSuggestions = 'suggest.autoImports';
	export const importStatementSuggestions = 'suggest.importStatements';

	export function getConfigurationForResource(
		modeId: string,
		resource: vscode.Uri
	): CompletionConfiguration {
		const config = vscode.workspace.getConfiguration(modeId, resource);
		return {
			completeFunctionCalls: config.get<boolean>(CompletionConfiguration.completeFunctionCalls, false),
			pathSuggestions: config.get<boolean>(CompletionConfiguration.pathSuggestions, true),
			autoImportSuggestions: config.get<boolean>(CompletionConfiguration.autoImportSuggestions, true),
			nameSuggestions: config.get<boolean>(CompletionConfiguration.nameSuggestions, true),
			importStatementSuggestions: config.get<boolean>(CompletionConfiguration.importStatementSuggestions, true),
		};
	}
}

class TypeScriptCompletionItemProvider implements vscode.CompletionItemProvider<MyCompletionItem> {

	public static readonly triggerCharacters = ['.', '"', '\'', '`', '/', '@', '<', '#', ' '];

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly language: LanguageDescription,
		private readonly typingsStatus: TypingsStatus,
		private readonly fileConfigurationManager: FileConfigurationManager,
		commandManager: CommandManager,
		private readonly telemetryReporter: TelemetryReporter,
		onCompletionAccepted: (item: vscode.CompletionItem) => void
	) {
		commandManager.register(new ApplyCompletionCodeActionCommand(this.client));
		commandManager.register(new CompletionAcceptedCommand(onCompletionAccepted, this.telemetryReporter));
		commandManager.register(new ApplyCompletionCommand(this.client));
	}

	public async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.CompletionContext
	): Promise<vscode.CompletionList<MyCompletionItem> | undefined> {
		if (!vscode.workspace.getConfiguration(this.language.id, document).get('suggest.enabled')) {
			return undefined;
		}

		if (this.typingsStatus.isAcquiringTypings) {
			return Promise.reject<vscode.CompletionList<MyCompletionItem>>({
				label: vscode.l10n.t({
					message: "Acquiring typings...",
					comment: ['Typings refers to the *.d.ts typings files that power our IntelliSense. It should not be localized'],
				}),
				detail: vscode.l10n.t({
					message: "Acquiring typings definitions for IntelliSense.",
					comment: ['Typings refers to the *.d.ts typings files that power our IntelliSense. It should not be localized'],
				})
			});
		}

		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const line = document.lineAt(position.line);
		const completionConfiguration = CompletionConfiguration.getConfigurationForResource(this.language.id, document.uri);

		if (!this.shouldTrigger(context, line, position, completionConfiguration)) {
			return undefined;
		}

		let wordRange = document.getWordRangeAtPosition(position);
		if (wordRange && !wordRange.isEmpty) {
			const secondCharPosition = wordRange.start.translate(0, 1);
			const firstChar = document.getText(new vscode.Range(wordRange.start, secondCharPosition));
			if (firstChar === '@') {
				wordRange = wordRange.with(secondCharPosition);
			}
		}

		await this.client.interruptGetErr(() => this.fileConfigurationManager.ensureConfigurationForDocument(document, token));

		const args: Proto.CompletionsRequestArgs = {
			...typeConverters.Position.toFileLocationRequestArgs(file, position),
			includeExternalModuleExports: completionConfiguration.autoImportSuggestions,
			includeInsertTextCompletions: true,
			triggerCharacter: this.getTsTriggerCharacter(context),
			triggerKind: typeConverters.CompletionTriggerKind.toProtocolCompletionTriggerKind(context.triggerKind),
		};

		let dotAccessorContext: DotAccessorContext | undefined;
		let response: ServerResponse.Response<Proto.CompletionInfoResponse> | undefined;
		let duration: number | undefined;
		let optionalReplacementRange: vscode.Range | undefined;

		const startTime = Date.now();
		try {
			response = await this.client.interruptGetErr(() => this.client.execute('completionInfo', args, token));
		} finally {
			duration = Date.now() - startTime;
		}

		if (response.type !== 'response' || !response.body) {
			this.logCompletionsTelemetry(duration, response);
			return undefined;
		}
		const isNewIdentifierLocation = response.body.isNewIdentifierLocation;
		const isMemberCompletion = response.body.isMemberCompletion;
		if (isMemberCompletion) {
			const dotMatch = line.text.slice(0, position.character).match(/\??\.\s*$/) || undefined;
			if (dotMatch) {
				const range = new vscode.Range(position.translate({ characterDelta: -dotMatch[0].length }), position);
				const text = document.getText(range);
				dotAccessorContext = { range, text };
			}
		}
		const isIncomplete = !!response.body.isIncomplete || !!(response.metadata as Record<string, unknown>)?.isIncomplete;
		const entries = response.body.entries;
		const metadata = response.metadata;
		const defaultCommitCharacters = Object.freeze(response.body.defaultCommitCharacters);

		if (response.body.optionalReplacementSpan) {
			optionalReplacementRange = typeConverters.Range.fromTextSpan(response.body.optionalReplacementSpan);
		}

		const completionContext: CompletionContext = {
			isNewIdentifierLocation,
			isMemberCompletion,
			dotAccessorContext,
			enableCallCompletions: !completionConfiguration.completeFunctionCalls,
			wordRange,
			line: line.text,
			completeFunctionCalls: completionConfiguration.completeFunctionCalls,
			optionalReplacementRange,
		};

		let includesPackageJsonImport = false;
		let includesImportStatementCompletion = false;
		const items: MyCompletionItem[] = [];
		for (const entry of entries) {
			if (!shouldExcludeCompletionEntry(entry, completionConfiguration)) {
				const item = new MyCompletionItem(
					position,
					document,
					entry,
					completionContext,
					metadata,
					this.client,
					defaultCommitCharacters);
				item.command = {
					command: ApplyCompletionCommand.ID,
					title: '',
					arguments: [item]
				};
				items.push(item);
				includesPackageJsonImport = includesPackageJsonImport || !!entry.isPackageJsonImport;
				includesImportStatementCompletion = includesImportStatementCompletion || !!entry.isImportStatementCompletion;
			}
		}
		if (duration !== undefined) {
			this.logCompletionsTelemetry(duration, response, includesPackageJsonImport, includesImportStatementCompletion);
		}
		return new vscode.CompletionList(items, isIncomplete);
	}

	private logCompletionsTelemetry(
		duration: number,
		response: ServerResponse.Response<Proto.CompletionInfoResponse> | undefined,
		includesPackageJsonImport?: boolean,
		includesImportStatementCompletion?: boolean,
	) {
		/* __GDPR__
			"completions.execute" : {
				"owner": "mjbvz",
				"duration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"type" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"count" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"flags": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"updateGraphDurationMs" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"createAutoImportProviderProgramDurationMs" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"includesPackageJsonImport" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"includesImportStatementCompletion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('completions.execute', {
			duration: String(duration),
			type: response?.type ?? 'unknown',
			flags: response?.type === 'response' && typeof response.body?.flags === 'number' ? String(response.body.flags) : undefined,
			count: String(response?.type === 'response' && response.body ? response.body.entries.length : 0),
			updateGraphDurationMs: response?.type === 'response' && typeof response.performanceData?.updateGraphDurationMs === 'number'
				? String(response.performanceData.updateGraphDurationMs)
				: undefined,
			createAutoImportProviderProgramDurationMs: response?.type === 'response' && typeof response.performanceData?.createAutoImportProviderProgramDurationMs === 'number'
				? String(response.performanceData.createAutoImportProviderProgramDurationMs)
				: undefined,
			includesPackageJsonImport: includesPackageJsonImport ? 'true' : undefined,
			includesImportStatementCompletion: includesImportStatementCompletion ? 'true' : undefined,
		});
	}

	private getTsTriggerCharacter(context: vscode.CompletionContext): Proto.CompletionsTriggerCharacter | undefined {
		switch (context.triggerCharacter) {
			case '@': {
				return '@';
			}
			case '#': {
				return '#';
			}
			case ' ': {
				return this.client.apiVersion.gte(API.v430) ? ' ' : undefined;
			}
			case '.':
			case '"':
			case '\'':
			case '`':
			case '/':
			case '<': {
				return context.triggerCharacter;
			}
			default: {
				return undefined;
			}
		}
	}

	public async resolveCompletionItem(
		item: MyCompletionItem,
		token: vscode.CancellationToken
	): Promise<MyCompletionItem | undefined> {
		await item.resolveCompletionItem(this.client, token);
		return item;
	}

	private shouldTrigger(
		context: vscode.CompletionContext,
		line: vscode.TextLine,
		position: vscode.Position,
		configuration: CompletionConfiguration,
	): boolean {
		if (context.triggerCharacter === ' ') {
			if (!configuration.importStatementSuggestions || this.client.apiVersion.lt(API.v430)) {
				return false;
			}
			const pre = line.text.slice(0, position.character);
			return pre === 'import';
		}
		return true;
	}
}

function shouldExcludeCompletionEntry(
	element: Proto.CompletionEntry,
	completionConfiguration: CompletionConfiguration
) {
	return (
		(!completionConfiguration.nameSuggestions && element.kind === PConst.Kind.warning)
		|| (!completionConfiguration.pathSuggestions &&
			(element.kind === PConst.Kind.directory || element.kind === PConst.Kind.script || element.kind === PConst.Kind.externalModuleName))
		|| (!completionConfiguration.autoImportSuggestions && element.hasAction)
	);
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	typingsStatus: TypingsStatus,
	fileConfigurationManager: FileConfigurationManager,
	commandManager: CommandManager,
	telemetryReporter: TelemetryReporter,
	onCompletionAccepted: (item: vscode.CompletionItem) => void
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerCompletionItemProvider(selector.syntax,
			new TypeScriptCompletionItemProvider(client, language, typingsStatus, fileConfigurationManager, commandManager, telemetryReporter, onCompletionAccepted),
			...TypeScriptCompletionItemProvider.triggerCharacters);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/copyPaste.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/copyPaste.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import { API } from '../tsServer/api';
import protocol from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient, ServerResponse } from '../typescriptService';
import { raceTimeout } from '../utils/async';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireGlobalConfiguration, requireMinVersion, requireSomeCapability } from './util/dependentRegistration';

class CopyMetadata {

	static parse(data: string): CopyMetadata | undefined {
		try {

			const parsedData = JSON.parse(data);
			const resource = vscode.Uri.parse(parsedData.resource);
			const ranges = parsedData.ranges.map((range: any) => new vscode.Range(range.start, range.end));
			const copyOperation = parsedData.copyOperation ? Promise.resolve(parsedData.copyOperation) : undefined;
			return new CopyMetadata(resource, ranges, copyOperation);
		} catch (error) {
			return undefined;
		}
	}

	constructor(
		public readonly resource: vscode.Uri,
		public readonly ranges: readonly vscode.Range[],
		public readonly copyOperation: Promise<ServerResponse.Response<protocol.PreparePasteEditsResponse>> | undefined
	) { }
}

class TsPasteEdit extends vscode.DocumentPasteEdit {

	static tryCreateFromResponse(
		client: ITypeScriptServiceClient,
		response: ServerResponse.Response<protocol.GetPasteEditsResponse>
	): TsPasteEdit | undefined {
		if (response.type !== 'response' || !response.body?.edits.length) {
			return undefined;
		}

		const pasteEdit = new TsPasteEdit();

		const additionalEdit = new vscode.WorkspaceEdit();
		for (const edit of response.body.edits) {
			additionalEdit.set(client.toResource(edit.fileName), edit.textChanges.map(typeConverters.TextEdit.fromCodeEdit));
		}
		pasteEdit.additionalEdit = additionalEdit;

		return pasteEdit;
	}

	constructor() {
		super('', vscode.l10n.t("Paste with imports"), DocumentPasteProvider.kind);
		this.yieldTo = [
			vscode.DocumentDropOrPasteEditKind.Text.append('plain')
		];
	}
}

class TsPendingPasteEdit extends TsPasteEdit {
	constructor(
		text: string,
		public readonly operation: Promise<ServerResponse.Response<protocol.GetPasteEditsResponse>>
	) {
		super();
		this.insertText = text;
	}
}

const enabledSettingId = 'updateImportsOnPaste.enabled';

class DocumentPasteProvider implements vscode.DocumentPasteEditProvider<TsPasteEdit> {

	static readonly kind = vscode.DocumentDropOrPasteEditKind.TextUpdateImports.append('jsts');
	static readonly metadataMimeType = 'application/vnd.code.jsts.metadata';

	constructor(
		private readonly _modeId: string,
		private readonly _client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
	) { }

	async prepareDocumentPaste(document: vscode.TextDocument, ranges: readonly vscode.Range[], dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken) {
		if (!this.isEnabled(document)) {
			return;
		}

		const file = this._client.toOpenTsFilePath(document);
		if (!file) {
			return;
		}

		const copyRequest = this._client.interruptGetErr(() => this._client.execute('preparePasteEdits', {
			file,
			copiedTextSpan: ranges.map(typeConverters.Range.toTextSpan),
		}, token));

		const copyTimeout = 200;
		const response = await raceTimeout(copyRequest, copyTimeout);
		if (token.isCancellationRequested) {
			return;
		}

		if (response) {
			if (response.type !== 'response' || !response.body) {
				// We got a response which told us no to bother with the paste
				// Don't store anything so that we don't trigger on paste
				return;
			}

			dataTransfer.set(DocumentPasteProvider.metadataMimeType,
				new vscode.DataTransferItem(new CopyMetadata(document.uri, ranges, undefined)));
		} else {
			// We are still waiting on the response. Store the pending request so that we can try checking it on paste
			// when it has hopefully resolved
			dataTransfer.set(DocumentPasteProvider.metadataMimeType,
				new vscode.DataTransferItem(new CopyMetadata(document.uri, ranges, copyRequest)));
		}
	}

	async provideDocumentPasteEdits(
		document: vscode.TextDocument,
		ranges: readonly vscode.Range[],
		dataTransfer: vscode.DataTransfer,
		_context: vscode.DocumentPasteEditContext,
		token: vscode.CancellationToken,
	): Promise<TsPasteEdit[] | undefined> {
		if (!this.isEnabled(document)) {
			return;
		}

		const file = this._client.toOpenTsFilePath(document);
		if (!file) {
			return;
		}

		const text = await dataTransfer.get('text/plain')?.asString();
		if (!text || token.isCancellationRequested) {
			return;
		}

		// Get optional metadata
		const metadata = await this.extractMetadata(dataTransfer, token);
		if (token.isCancellationRequested) {
			return;
		}

		let copiedFrom: {
			file: string;
			spans: protocol.TextSpan[];
		} | undefined;
		if (metadata) {
			const spans = metadata.ranges.map(typeConverters.Range.toTextSpan);
			const copyFile = this._client.toTsFilePath(metadata.resource);
			if (copyFile) {
				copiedFrom = { file: copyFile, spans };
			}
		}

		if (copiedFrom?.file === file) {
			// We are pasting in the same file we copied from. No need to do anything
			return;
		}

		const pasteCts = new vscode.CancellationTokenSource();
		token.onCancellationRequested(() => pasteCts.cancel());

		// If we have a copy operation, use that to potentially eagerly cancel the paste if it resolves to false
		metadata?.copyOperation?.then(copyResponse => {
			if (copyResponse.type !== 'response' || !copyResponse.body) {
				pasteCts.cancel();
			}
		}, (_err) => {
			// Expected. May have been cancelled.
		});

		try {
			const pasteOperation = this._client.interruptGetErr(() => {
				this.fileConfigurationManager.ensureConfigurationForDocument(document, token);

				return this._client.execute('getPasteEdits', {
					file,
					// TODO: only supports a single paste for now
					pastedText: [text],
					pasteLocations: ranges.map(typeConverters.Range.toTextSpan),
					copiedFrom
				}, pasteCts.token);
			});

			const pasteTimeout = 200;
			const response = await raceTimeout(pasteOperation, pasteTimeout);
			if (response) {
				// Success, can return real paste edit.
				const edit = TsPasteEdit.tryCreateFromResponse(this._client, response);
				return edit ? [edit] : undefined;
			} else {
				// Still waiting on the response. Eagerly return a paste edit that we will resolve when we
				// really need to apply it
				return [new TsPendingPasteEdit(text, pasteOperation)];
			}
		} finally {
			pasteCts.dispose();
		}
	}

	async resolveDocumentPasteEdit(inEdit: TsPasteEdit, _token: vscode.CancellationToken): Promise<TsPasteEdit | undefined> {
		if (!(inEdit instanceof TsPendingPasteEdit)) {
			return;
		}

		const response = await inEdit.operation;
		const pasteEdit = TsPendingPasteEdit.tryCreateFromResponse(this._client, response);
		return pasteEdit ?? inEdit;
	}

	private async extractMetadata(dataTransfer: vscode.DataTransfer, token: vscode.CancellationToken): Promise<CopyMetadata | undefined> {
		const metadata = await dataTransfer.get(DocumentPasteProvider.metadataMimeType)?.value;
		if (token.isCancellationRequested) {
			return undefined;
		}

		if (metadata instanceof CopyMetadata) {
			return metadata;
		}

		if (typeof metadata === 'string') {
			return CopyMetadata.parse(metadata);
		}

		return undefined;
	}

	private isEnabled(document: vscode.TextDocument) {
		const config = vscode.workspace.getConfiguration(this._modeId, document.uri);
		return config.get(enabledSettingId, true);
	}
}

export function register(selector: DocumentSelector, language: LanguageDescription, client: ITypeScriptServiceClient, fileConfigurationManager: FileConfigurationManager) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
		requireMinVersion(client, API.v570),
		requireGlobalConfiguration(language.id, enabledSettingId),
	], () => {
		return vscode.languages.registerDocumentPasteEditProvider(selector.semantic, new DocumentPasteProvider(language.id, client, fileConfigurationManager), {
			providedPasteEditKinds: [DocumentPasteProvider.kind],
			copyMimeTypes: [DocumentPasteProvider.metadataMimeType],
			pasteMimeTypes: [DocumentPasteProvider.metadataMimeType],
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/definitionProviderBase.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/definitionProviderBase.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';


export default class TypeScriptDefinitionProviderBase {
	constructor(
		protected readonly client: ITypeScriptServiceClient
	) { }

	protected async getSymbolLocations(
		definitionType: 'definition' | 'implementation' | 'typeDefinition',
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.Location[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
		const response = await this.client.execute(definitionType, args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		return response.body.map(location =>
			typeConverters.Location.fromTextSpan(this.client.toResource(location.file), location));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/definitions.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/definitions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { API } from '../tsServer/api';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import DefinitionProviderBase from './definitionProviderBase';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

export default class TypeScriptDefinitionProvider extends DefinitionProviderBase implements vscode.DefinitionProvider {

	public async provideDefinition(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.DefinitionLink[] | vscode.Definition | undefined> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
		const response = await this.client.execute('definitionAndBoundSpan', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const span = response.body.textSpan ? typeConverters.Range.fromTextSpan(response.body.textSpan) : undefined;
		let definitions = response.body.definitions;

		if (vscode.workspace.getConfiguration(document.languageId).get('preferGoToSourceDefinition', false) && this.client.apiVersion.gte(API.v470)) {
			const sourceDefinitionsResponse = await this.client.execute('findSourceDefinition', args, token);
			if (sourceDefinitionsResponse.type === 'response' && sourceDefinitionsResponse.body?.length) {
				definitions = sourceDefinitionsResponse.body;
			}
		}

		return definitions
			.map((location): vscode.DefinitionLink => {
				const target = typeConverters.Location.fromTextSpan(this.client.toResource(location.file), location);
				if (location.contextStart && location.contextEnd) {
					return {
						originSelectionRange: span,
						targetRange: typeConverters.Range.fromLocations(location.contextStart, location.contextEnd),
						targetUri: target.uri,
						targetSelectionRange: target.range,
					};
				}
				return {
					originSelectionRange: span,
					targetRange: target.range,
					targetUri: target.uri
				};
			});
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerDefinitionProvider(selector.syntax,
			new TypeScriptDefinitionProvider(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/diagnostics.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/diagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TypeScriptServiceConfiguration } from '../configuration/configuration';
import { DiagnosticLanguage } from '../configuration/languageDescription';
import { TelemetryReporter } from '../logging/telemetry';
import { DiagnosticPerformanceData as TsDiagnosticPerformanceData } from '../tsServer/protocol/protocol';
import * as arrays from '../utils/arrays';
import { Disposable } from '../utils/dispose';
import { equals } from '../utils/objects';
import { ResourceMap } from '../utils/resourceMap';

function diagnosticsEquals(a: vscode.Diagnostic, b: vscode.Diagnostic): boolean {
	if (a === b) {
		return true;
	}

	return a.code === b.code
		&& a.message === b.message
		&& a.severity === b.severity
		&& a.source === b.source
		&& a.range.isEqual(b.range)
		&& arrays.equals(a.relatedInformation || arrays.empty, b.relatedInformation || arrays.empty, (a, b) => {
			return a.message === b.message
				&& a.location.range.isEqual(b.location.range)
				&& a.location.uri.fsPath === b.location.uri.fsPath;
		})
		&& arrays.equals(a.tags || arrays.empty, b.tags || arrays.empty);
}

export const enum DiagnosticKind {
	Syntax,
	Semantic,
	Suggestion,
	RegionSemantic,
}

class FileDiagnostics {

	private readonly _diagnostics = new Map<DiagnosticKind, ReadonlyArray<vscode.Diagnostic>>();

	constructor(
		public readonly file: vscode.Uri,
		public language: DiagnosticLanguage
	) { }

	public updateDiagnostics(
		language: DiagnosticLanguage,
		kind: DiagnosticKind,
		diagnostics: ReadonlyArray<vscode.Diagnostic>,
		ranges: ReadonlyArray<vscode.Range> | undefined
	): boolean {
		if (language !== this.language) {
			this._diagnostics.clear();
			this.language = language;
		}

		const existing = this._diagnostics.get(kind);
		if (existing?.length === 0 && diagnostics.length === 0) {
			// No need to update
			return false;
		}

		if (kind === DiagnosticKind.RegionSemantic) {
			return this.updateRegionDiagnostics(diagnostics, ranges!);
		}
		this._diagnostics.set(kind, diagnostics);
		return true;
	}

	public getAllDiagnostics(settings: DiagnosticSettings): vscode.Diagnostic[] {
		if (!settings.getValidate(this.language)) {
			return [];
		}

		return [
			...this.get(DiagnosticKind.Syntax),
			...this.get(DiagnosticKind.Semantic),
			...this.getSuggestionDiagnostics(settings),
		];
	}

	public delete(toDelete: vscode.Diagnostic): void {
		for (const [type, diags] of this._diagnostics) {
			this._diagnostics.set(type, diags.filter(diag => !diagnosticsEquals(diag, toDelete)));
		}
	}

	/**
	 * @param ranges The ranges whose diagnostics were updated.
	 */
	private updateRegionDiagnostics(
		diagnostics: ReadonlyArray<vscode.Diagnostic>,
		ranges: ReadonlyArray<vscode.Range>): boolean {
		if (!this._diagnostics.get(DiagnosticKind.Semantic)) {
			this._diagnostics.set(DiagnosticKind.Semantic, diagnostics);
			return true;
		}
		const oldDiagnostics = this._diagnostics.get(DiagnosticKind.Semantic)!;
		const newDiagnostics = oldDiagnostics.filter(diag => !ranges.some(range => diag.range.intersection(range)));
		newDiagnostics.push(...diagnostics);
		this._diagnostics.set(DiagnosticKind.Semantic, newDiagnostics);
		return true;
	}

	private getSuggestionDiagnostics(settings: DiagnosticSettings) {
		const enableSuggestions = settings.getEnableSuggestions(this.language);
		return this.get(DiagnosticKind.Suggestion).filter(x => {
			if (!enableSuggestions) {
				// Still show unused
				return x.tags && (x.tags.includes(vscode.DiagnosticTag.Unnecessary) || x.tags.includes(vscode.DiagnosticTag.Deprecated));
			}
			return true;
		});
	}

	private get(kind: DiagnosticKind): ReadonlyArray<vscode.Diagnostic> {
		return this._diagnostics.get(kind) || [];
	}
}

interface LanguageDiagnosticSettings {
	readonly validate: boolean;
	readonly enableSuggestions: boolean;
}

function areLanguageDiagnosticSettingsEqual(currentSettings: LanguageDiagnosticSettings, newSettings: LanguageDiagnosticSettings): boolean {
	return currentSettings.validate === newSettings.validate
		&& currentSettings.enableSuggestions === newSettings.enableSuggestions;
}

class DiagnosticSettings {
	private static readonly defaultSettings: LanguageDiagnosticSettings = {
		validate: true,
		enableSuggestions: true
	};

	private readonly _languageSettings = new Map<DiagnosticLanguage, LanguageDiagnosticSettings>();

	public getValidate(language: DiagnosticLanguage): boolean {
		return this.get(language).validate;
	}

	public setValidate(language: DiagnosticLanguage, value: boolean): boolean {
		return this.update(language, settings => ({
			validate: value,
			enableSuggestions: settings.enableSuggestions,
		}));
	}

	public getEnableSuggestions(language: DiagnosticLanguage): boolean {
		return this.get(language).enableSuggestions;
	}

	public setEnableSuggestions(language: DiagnosticLanguage, value: boolean): boolean {
		return this.update(language, settings => ({
			validate: settings.validate,
			enableSuggestions: value
		}));
	}

	private get(language: DiagnosticLanguage): LanguageDiagnosticSettings {
		return this._languageSettings.get(language) || DiagnosticSettings.defaultSettings;
	}

	private update(language: DiagnosticLanguage, f: (x: LanguageDiagnosticSettings) => LanguageDiagnosticSettings): boolean {
		const currentSettings = this.get(language);
		const newSettings = f(currentSettings);
		this._languageSettings.set(language, newSettings);
		return !areLanguageDiagnosticSettingsEqual(currentSettings, newSettings);
	}
}

interface DiagnosticPerformanceData extends TsDiagnosticPerformanceData {
	fileLineCount?: number;
}

class DiagnosticsTelemetryManager extends Disposable {

	private readonly _diagnosticCodesMap = new Map<number, number>();
	private readonly _diagnosticSnapshotsMap = new ResourceMap<readonly vscode.Diagnostic[]>(uri => uri.toString(), { onCaseInsensitiveFileSystem: false });
	private _timeout: NodeJS.Timeout | undefined;
	private _telemetryEmitter: NodeJS.Timeout | undefined;

	constructor(
		private readonly _telemetryReporter: TelemetryReporter,
		private readonly _diagnosticsCollection: vscode.DiagnosticCollection,
	) {
		super();
		this._register(vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.languageId === 'typescript' || e.document.languageId === 'typescriptreact') {
				this._updateAllDiagnosticCodesAfterTimeout();
			}
		}));
		this._updateAllDiagnosticCodesAfterTimeout();
		this._registerTelemetryEventEmitter();
	}

	public logDiagnosticsPerformanceTelemetry(performanceData: DiagnosticPerformanceData[]): void {
		for (const data of performanceData) {
			/* __GDPR__
				"diagnostics.performance" : {
					"owner": "mjbvz",
					"syntaxDiagDuration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
					"semanticDiagDuration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
					"suggestionDiagDuration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
					"regionSemanticDiagDuration" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
					"fileLineCount" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
					"${include}": [
						"${TypeScriptCommonProperties}"
					]
				}
			*/
			this._telemetryReporter.logTelemetry('diagnostics.performance',
				{
					syntaxDiagDuration: data.syntaxDiag,
					semanticDiagDuration: data.semanticDiag,
					suggestionDiagDuration: data.suggestionDiag,
					regionSemanticDiagDuration: data.regionSemanticDiag,
					fileLineCount: data.fileLineCount,
				},
			);
		}
	}

	private _updateAllDiagnosticCodesAfterTimeout() {
		clearTimeout(this._timeout);
		this._timeout = setTimeout(() => this._updateDiagnosticCodes(), 5000);
	}

	private _increaseDiagnosticCodeCount(code: string | number | undefined) {
		if (code === undefined) {
			return;
		}
		this._diagnosticCodesMap.set(Number(code), (this._diagnosticCodesMap.get(Number(code)) || 0) + 1);
	}

	private _updateDiagnosticCodes() {
		this._diagnosticsCollection.forEach((uri, diagnostics) => {
			const previousDiagnostics = this._diagnosticSnapshotsMap.get(uri);
			this._diagnosticSnapshotsMap.set(uri, diagnostics);
			const diagnosticsDiff = diagnostics.filter((diagnostic) => !previousDiagnostics?.some((previousDiagnostic) => equals(diagnostic, previousDiagnostic)));
			diagnosticsDiff.forEach((diagnostic) => {
				const code = diagnostic.code;
				this._increaseDiagnosticCodeCount(typeof code === 'string' || typeof code === 'number' ? code : code?.value);
			});
		});
	}

	private _registerTelemetryEventEmitter() {
		this._telemetryEmitter = setInterval(() => {
			if (this._diagnosticCodesMap.size > 0) {
				let diagnosticCodes = '';
				this._diagnosticCodesMap.forEach((value, key) => {
					diagnosticCodes += `${key}:${value},`;
				});
				this._diagnosticCodesMap.clear();
				/* __GDPR__
					"typescript.diagnostics" : {
						"owner": "aiday-mar",
						"diagnosticCodes" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" },
						"${include}": [
							"${TypeScriptCommonProperties}"
						]
					}
				*/
				this._telemetryReporter.logTelemetry('typescript.diagnostics', {
					diagnosticCodes: diagnosticCodes
				});
			}
		}, 5 * 60 * 1000); // 5 minutes
	}

	override dispose() {
		super.dispose();
		clearTimeout(this._timeout);
		clearInterval(this._telemetryEmitter);
	}
}

export class DiagnosticsManager extends Disposable {
	private readonly _diagnostics: ResourceMap<FileDiagnostics>;
	private readonly _settings = new DiagnosticSettings();
	private readonly _currentDiagnostics: vscode.DiagnosticCollection;
	private readonly _pendingUpdates: ResourceMap</* timeout */ any>;

	private readonly _updateDelay = 50;

	private readonly _diagnosticsTelemetryManager: DiagnosticsTelemetryManager | undefined;

	constructor(
		owner: string,
		configuration: TypeScriptServiceConfiguration,
		telemetryReporter: TelemetryReporter,
		onCaseInsensitiveFileSystem: boolean
	) {
		super();
		this._diagnostics = new ResourceMap<FileDiagnostics>(undefined, { onCaseInsensitiveFileSystem });
		this._pendingUpdates = new ResourceMap<any>(undefined, { onCaseInsensitiveFileSystem });

		this._currentDiagnostics = this._register(vscode.languages.createDiagnosticCollection(owner));
		// Here we are selecting only 1 user out of 1000 to send telemetry diagnostics
		if (Math.random() * 1000 <= 1 || configuration.enableDiagnosticsTelemetry) {
			this._diagnosticsTelemetryManager = this._register(new DiagnosticsTelemetryManager(telemetryReporter, this._currentDiagnostics));
		}
	}

	public override dispose() {
		super.dispose();

		for (const value of this._pendingUpdates.values()) {
			clearTimeout(value);
		}
		this._pendingUpdates.clear();
	}

	public reInitialize(): void {
		this._currentDiagnostics.clear();
		this._diagnostics.clear();
	}

	public setValidate(language: DiagnosticLanguage, value: boolean) {
		const didUpdate = this._settings.setValidate(language, value);
		if (didUpdate) {
			this.rebuildAll();
		}
	}

	public setEnableSuggestions(language: DiagnosticLanguage, value: boolean) {
		const didUpdate = this._settings.setEnableSuggestions(language, value);
		if (didUpdate) {
			this.rebuildAll();
		}
	}

	public updateDiagnostics(
		file: vscode.Uri,
		language: DiagnosticLanguage,
		kind: DiagnosticKind,
		diagnostics: ReadonlyArray<vscode.Diagnostic>,
		ranges: ReadonlyArray<vscode.Range> | undefined,
	): void {
		let didUpdate = false;
		const entry = this._diagnostics.get(file);
		if (entry) {
			didUpdate = entry.updateDiagnostics(language, kind, diagnostics, ranges);
		} else if (diagnostics.length) {
			const fileDiagnostics = new FileDiagnostics(file, language);
			fileDiagnostics.updateDiagnostics(language, kind, diagnostics, ranges);
			this._diagnostics.set(file, fileDiagnostics);
			didUpdate = true;
		}

		if (didUpdate) {
			this.scheduleDiagnosticsUpdate(file);
		}
	}

	public configFileDiagnosticsReceived(
		file: vscode.Uri,
		diagnostics: ReadonlyArray<vscode.Diagnostic>
	): void {
		this._currentDiagnostics.set(file, diagnostics);
	}

	public deleteAllDiagnosticsInFile(resource: vscode.Uri): void {
		this._currentDiagnostics.delete(resource);
		this._diagnostics.delete(resource);
	}

	public deleteDiagnostic(resource: vscode.Uri, diagnostic: vscode.Diagnostic): void {
		const fileDiagnostics = this._diagnostics.get(resource);
		if (fileDiagnostics) {
			fileDiagnostics.delete(diagnostic);
			this.rebuildFile(fileDiagnostics);
		}
	}

	public getDiagnostics(file: vscode.Uri): ReadonlyArray<vscode.Diagnostic> {
		return this._currentDiagnostics.get(file) || [];
	}

	public logDiagnosticsPerformanceTelemetry(performanceData: DiagnosticPerformanceData[]): void {
		this._diagnosticsTelemetryManager?.logDiagnosticsPerformanceTelemetry(performanceData);
	}

	private scheduleDiagnosticsUpdate(file: vscode.Uri) {
		if (!this._pendingUpdates.has(file)) {
			this._pendingUpdates.set(file, setTimeout(() => this.updateCurrentDiagnostics(file), this._updateDelay));
		}
	}

	private updateCurrentDiagnostics(file: vscode.Uri): void {
		if (this._pendingUpdates.has(file)) {
			clearTimeout(this._pendingUpdates.get(file));
			this._pendingUpdates.delete(file);
		}

		const fileDiagnostics = this._diagnostics.get(file);
		this._currentDiagnostics.set(file, fileDiagnostics ? fileDiagnostics.getAllDiagnostics(this._settings) : []);
	}

	private rebuildAll(): void {
		this._currentDiagnostics.clear();
		for (const fileDiagnostic of this._diagnostics.values()) {
			this.rebuildFile(fileDiagnostic);
		}
	}

	private rebuildFile(fileDiagnostic: FileDiagnostics) {
		this._currentDiagnostics.set(fileDiagnostic.file, fileDiagnostic.getAllDiagnostics(this._settings));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/directiveCommentCompletions.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/directiveCommentCompletions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { API } from '../tsServer/api';
import { ITypeScriptServiceClient } from '../typescriptService';


interface Directive {
	readonly value: string;
	readonly description: string;
}

const tsDirectives: Directive[] = [
	{
		value: '@ts-check',
		description: vscode.l10n.t("Enables semantic checking in a JavaScript file. Must be at the top of a file.")
	}, {
		value: '@ts-nocheck',
		description: vscode.l10n.t("Disables semantic checking in a JavaScript file. Must be at the top of a file.")
	}, {
		value: '@ts-ignore',
		description: vscode.l10n.t("Suppresses @ts-check errors on the next line of a file.")
	}
];

const tsDirectives390: Directive[] = [
	...tsDirectives,
	{
		value: '@ts-expect-error',
		description: vscode.l10n.t("Suppresses @ts-check errors on the next line of a file, expecting at least one to exist.")
	}
];

class DirectiveCommentCompletionProvider implements vscode.CompletionItemProvider {

	constructor(
		private readonly client: ITypeScriptServiceClient,
	) { }

	public provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		_token: vscode.CancellationToken
	): vscode.CompletionItem[] {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return [];
		}

		const line = document.lineAt(position.line).text;
		const prefix = line.slice(0, position.character);
		const match = prefix.match(/^\s*\/\/+\s?(@[a-zA-Z\-]*)?$/);
		if (match) {
			const directives = this.client.apiVersion.gte(API.v390)
				? tsDirectives390
				: tsDirectives;

			return directives.map(directive => {
				const item = new vscode.CompletionItem(directive.value, vscode.CompletionItemKind.Snippet);
				item.detail = directive.description;
				item.range = new vscode.Range(position.line, Math.max(0, position.character - (match[1] ? match[1].length : 0)), position.line, position.character);
				return item;
			});
		}
		return [];
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return vscode.languages.registerCompletionItemProvider(selector.syntax,
		new DirectiveCommentCompletionProvider(client),
		'@');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/documentHighlight.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/documentHighlight.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';

class TypeScriptDocumentHighlightProvider implements vscode.DocumentHighlightProvider, vscode.MultiDocumentHighlightProvider {
	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async provideMultiDocumentHighlights(
		document: vscode.TextDocument,
		position: vscode.Position,
		otherDocuments: vscode.TextDocument[],
		token: vscode.CancellationToken
	): Promise<vscode.MultiDocumentHighlight[]> {
		const allFiles = [document, ...otherDocuments].map(doc => this.client.toOpenTsFilePath(doc)).filter(file => !!file) as string[];
		const file = this.client.toOpenTsFilePath(document);

		if (!file || allFiles.length === 0) {
			return [];
		}

		const args = {
			...typeConverters.Position.toFileLocationRequestArgs(file, position),
			filesToSearch: allFiles
		};
		const response = await this.client.execute('documentHighlights', args, token);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		const result = response.body.map(highlightItem =>
			new vscode.MultiDocumentHighlight(
				vscode.Uri.file(highlightItem.file),
				[...convertDocumentHighlight(highlightItem)]
			)
		);

		return result;
	}

	public async provideDocumentHighlights(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.DocumentHighlight[]> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return [];
		}

		const args = {
			...typeConverters.Position.toFileLocationRequestArgs(file, position),
			filesToSearch: [file]
		};
		const response = await this.client.execute('documentHighlights', args, token);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		return response.body.flatMap(convertDocumentHighlight);
	}
}

function convertDocumentHighlight(highlight: Proto.DocumentHighlightsItem): ReadonlyArray<vscode.DocumentHighlight> {
	return highlight.highlightSpans.map(span =>
		new vscode.DocumentHighlight(
			typeConverters.Range.fromTextSpan(span),
			span.kind === 'writtenReference' ? vscode.DocumentHighlightKind.Write : vscode.DocumentHighlightKind.Read));
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	const provider = new TypeScriptDocumentHighlightProvider(client);

	return vscode.Disposable.from(
		vscode.languages.registerDocumentHighlightProvider(selector.syntax, provider),
		vscode.languages.registerMultiDocumentHighlightProvider(selector.syntax, provider)
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/documentSymbol.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/documentSymbol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { CachedResponse } from '../tsServer/cachedResponse';
import { parseKindModifier } from '../tsServer/protocol/modifiers';
import type * as Proto from '../tsServer/protocol/protocol';
import * as PConst from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';

const getSymbolKind = (kind: string): vscode.SymbolKind => {
	switch (kind) {
		case PConst.Kind.module: return vscode.SymbolKind.Module;
		case PConst.Kind.class: return vscode.SymbolKind.Class;
		case PConst.Kind.enum: return vscode.SymbolKind.Enum;
		case PConst.Kind.interface: return vscode.SymbolKind.Interface;
		case PConst.Kind.method: return vscode.SymbolKind.Method;
		case PConst.Kind.memberVariable: return vscode.SymbolKind.Property;
		case PConst.Kind.memberGetAccessor: return vscode.SymbolKind.Property;
		case PConst.Kind.memberSetAccessor: return vscode.SymbolKind.Property;
		case PConst.Kind.variable: return vscode.SymbolKind.Variable;
		case PConst.Kind.const: return vscode.SymbolKind.Variable;
		case PConst.Kind.localVariable: return vscode.SymbolKind.Variable;
		case PConst.Kind.function: return vscode.SymbolKind.Function;
		case PConst.Kind.localFunction: return vscode.SymbolKind.Function;
		case PConst.Kind.constructSignature: return vscode.SymbolKind.Constructor;
		case PConst.Kind.constructorImplementation: return vscode.SymbolKind.Constructor;
	}
	return vscode.SymbolKind.Variable;
};

class TypeScriptDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly cachedResponse: CachedResponse<Proto.NavTreeResponse>,
	) { }

	public async provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.DocumentSymbol[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const args: Proto.FileRequestArgs = { file };
		const response = await this.cachedResponse.execute(document, () => this.client.execute('navtree', args, token));
		if (response.type !== 'response' || !response.body?.childItems) {
			return undefined;
		}

		// The root represents the file. Ignore this when showing in the UI
		const result: vscode.DocumentSymbol[] = [];
		for (const item of response.body.childItems) {
			TypeScriptDocumentSymbolProvider.convertNavTree(document.uri, result, item);
		}
		return result;
	}

	private static convertNavTree(
		resource: vscode.Uri,
		output: vscode.DocumentSymbol[],
		item: Proto.NavigationTree,
	): boolean {
		let shouldInclude = TypeScriptDocumentSymbolProvider.shouldInclueEntry(item);
		if (!shouldInclude && !item.childItems?.length) {
			return false;
		}

		const children = new Set(item.childItems || []);
		for (const span of item.spans) {
			const range = typeConverters.Range.fromTextSpan(span);
			const symbolInfo = TypeScriptDocumentSymbolProvider.convertSymbol(item, range);

			for (const child of children) {
				if (child.spans.some(span => !!range.intersection(typeConverters.Range.fromTextSpan(span)))) {
					const includedChild = TypeScriptDocumentSymbolProvider.convertNavTree(resource, symbolInfo.children, child);
					shouldInclude = shouldInclude || includedChild;
					children.delete(child);
				}
			}

			if (shouldInclude) {
				output.push(symbolInfo);
			}
		}

		return shouldInclude;
	}

	private static convertSymbol(item: Proto.NavigationTree, range: vscode.Range): vscode.DocumentSymbol {
		const selectionRange = item.nameSpan ? typeConverters.Range.fromTextSpan(item.nameSpan) : range;
		let label = item.text;

		switch (item.kind) {
			case PConst.Kind.memberGetAccessor: label = `(get) ${label}`; break;
			case PConst.Kind.memberSetAccessor: label = `(set) ${label}`; break;
		}

		const symbolInfo = new vscode.DocumentSymbol(
			label,
			'',
			getSymbolKind(item.kind),
			range,
			range.contains(selectionRange) ? selectionRange : range);


		const kindModifiers = parseKindModifier(item.kindModifiers);
		if (kindModifiers.has(PConst.KindModifiers.deprecated)) {
			symbolInfo.tags = [vscode.SymbolTag.Deprecated];
		}

		return symbolInfo;
	}

	private static shouldInclueEntry(item: Proto.NavigationTree | Proto.NavigationBarItem): boolean {
		if (item.kind === PConst.Kind.alias) {
			return false;
		}
		return !!(item.text && item.text !== '<function>' && item.text !== '<class>');
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	cachedResponse: CachedResponse<Proto.NavTreeResponse>,
) {
	return vscode.languages.registerDocumentSymbolProvider(selector.syntax,
		new TypeScriptDocumentSymbolProvider(client, cachedResponse), { label: 'TypeScript' });
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/fileConfigurationManager.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/fileConfigurationManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import * as fileSchemes from '../configuration/fileSchemes';
import { isTypeScriptDocument } from '../configuration/languageIds';
import { API } from '../tsServer/api';
import type * as Proto from '../tsServer/protocol/protocol';
import { ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';
import { equals } from '../utils/objects';
import { ResourceMap } from '../utils/resourceMap';

interface FileConfiguration {
	readonly formatOptions: Proto.FormatCodeSettings;
	readonly preferences: Proto.UserPreferences;
}

interface FormattingOptions {

	readonly tabSize: number | undefined;

	readonly insertSpaces: boolean | undefined;
}

function areFileConfigurationsEqual(a: FileConfiguration, b: FileConfiguration): boolean {
	return equals(a, b);
}

export default class FileConfigurationManager extends Disposable {
	private readonly formatOptions: ResourceMap<Promise<FileConfiguration | undefined>>;

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		onCaseInsensitiveFileSystem: boolean
	) {
		super();
		this.formatOptions = new ResourceMap(undefined, { onCaseInsensitiveFileSystem });
		vscode.workspace.onDidCloseTextDocument(textDocument => {
			// When a document gets closed delete the cached formatting options.
			// This is necessary since the tsserver now closed a project when its
			// last file in it closes which drops the stored formatting options
			// as well.
			this.formatOptions.delete(textDocument.uri);
		}, undefined, this._disposables);
	}

	public async ensureConfigurationForDocument(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Promise<void> {
		const formattingOptions = this.getFormattingOptions(document);
		if (formattingOptions) {
			return this.ensureConfigurationOptions(document, formattingOptions, token);
		}
	}

	private getFormattingOptions(document: vscode.TextDocument): FormattingOptions | undefined {
		const editor = vscode.window.visibleTextEditors.find(editor => editor.document.uri.toString() === document.uri.toString());
		if (!editor) {
			return undefined;
		}

		return {
			tabSize: typeof editor.options.tabSize === 'number' ? editor.options.tabSize : undefined,
			insertSpaces: typeof editor.options.insertSpaces === 'boolean' ? editor.options.insertSpaces : undefined,
		};
	}

	public async ensureConfigurationOptions(
		document: vscode.TextDocument,
		options: FormattingOptions,
		token: vscode.CancellationToken
	): Promise<void> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return;
		}

		const currentOptions = this.getFileOptions(document, options);
		const cachedOptions = this.formatOptions.get(document.uri);
		if (cachedOptions) {
			const cachedOptionsValue = await cachedOptions;
			if (token.isCancellationRequested) {
				return;
			}

			if (cachedOptionsValue && areFileConfigurationsEqual(cachedOptionsValue, currentOptions)) {
				return;
			}
		}

		const task = (async () => {
			try {
				const response = await this.client.execute('configure', { file, ...currentOptions }, token);
				return response.type === 'response' ? currentOptions : undefined;
			} catch {
				return undefined;
			}
		})();

		this.formatOptions.set(document.uri, task);

		await task;
	}

	public async setGlobalConfigurationFromDocument(
		document: vscode.TextDocument,
		token: vscode.CancellationToken,
	): Promise<void> {
		const formattingOptions = this.getFormattingOptions(document);
		if (!formattingOptions) {
			return;
		}

		const args: Proto.ConfigureRequestArguments = {
			file: undefined /*global*/,
			...this.getFileOptions(document, formattingOptions),
		};
		await this.client.execute('configure', args, token);
	}

	public reset() {
		this.formatOptions.clear();
	}

	private getFileOptions(
		document: vscode.TextDocument,
		options: FormattingOptions
	): FileConfiguration {
		return {
			formatOptions: this.getFormatOptions(document, options),
			preferences: this.getPreferences(document)
		};
	}

	private getFormatOptions(
		document: vscode.TextDocument,
		options: FormattingOptions
	): Proto.FormatCodeSettings {
		const config = vscode.workspace.getConfiguration(
			isTypeScriptDocument(document) ? 'typescript.format' : 'javascript.format',
			document.uri);

		return {
			tabSize: options.tabSize,
			indentSize: options.tabSize,
			convertTabsToSpaces: options.insertSpaces,
			// We can use \n here since the editor normalizes later on to its line endings.
			newLineCharacter: '\n',
			insertSpaceAfterCommaDelimiter: config.get<boolean>('insertSpaceAfterCommaDelimiter'),
			insertSpaceAfterConstructor: config.get<boolean>('insertSpaceAfterConstructor'),
			insertSpaceAfterSemicolonInForStatements: config.get<boolean>('insertSpaceAfterSemicolonInForStatements'),
			insertSpaceBeforeAndAfterBinaryOperators: config.get<boolean>('insertSpaceBeforeAndAfterBinaryOperators'),
			insertSpaceAfterKeywordsInControlFlowStatements: config.get<boolean>('insertSpaceAfterKeywordsInControlFlowStatements'),
			insertSpaceAfterFunctionKeywordForAnonymousFunctions: config.get<boolean>('insertSpaceAfterFunctionKeywordForAnonymousFunctions'),
			insertSpaceBeforeFunctionParenthesis: config.get<boolean>('insertSpaceBeforeFunctionParenthesis'),
			insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis'),
			insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets'),
			insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces'),
			insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingEmptyBraces'),
			insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces'),
			insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: config.get<boolean>('insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces'),
			insertSpaceAfterTypeAssertion: config.get<boolean>('insertSpaceAfterTypeAssertion'),
			placeOpenBraceOnNewLineForFunctions: config.get<boolean>('placeOpenBraceOnNewLineForFunctions'),
			placeOpenBraceOnNewLineForControlBlocks: config.get<boolean>('placeOpenBraceOnNewLineForControlBlocks'),
			semicolons: config.get<Proto.SemicolonPreference>('semicolons'),
			indentSwitchCase: config.get<boolean>('indentSwitchCase'),
		};
	}

	private getPreferences(document: vscode.TextDocument): Proto.UserPreferences {
		const config = vscode.workspace.getConfiguration(
			isTypeScriptDocument(document) ? 'typescript' : 'javascript',
			document);

		const preferencesConfig = vscode.workspace.getConfiguration(
			isTypeScriptDocument(document) ? 'typescript.preferences' : 'javascript.preferences',
			document);

		const preferences: Proto.UserPreferences = {
			...config.get('unstable'),
			quotePreference: this.getQuoteStylePreference(preferencesConfig),
			importModuleSpecifierPreference: getImportModuleSpecifierPreference(preferencesConfig),
			importModuleSpecifierEnding: getImportModuleSpecifierEndingPreference(preferencesConfig),
			jsxAttributeCompletionStyle: getJsxAttributeCompletionStyle(preferencesConfig),
			allowTextChangesInNewFiles: document.uri.scheme === fileSchemes.file,
			providePrefixAndSuffixTextForRename: preferencesConfig.get<boolean>('useAliasesForRenames', true),
			allowRenameOfImportPath: true,
			includeAutomaticOptionalChainCompletions: config.get<boolean>('suggest.includeAutomaticOptionalChainCompletions', true),
			provideRefactorNotApplicableReason: true,
			generateReturnInDocTemplate: config.get<boolean>('suggest.jsdoc.generateReturns', true),
			includeCompletionsForImportStatements: config.get<boolean>('suggest.includeCompletionsForImportStatements', true),
			includeCompletionsWithSnippetText: true,
			includeCompletionsWithClassMemberSnippets: config.get<boolean>('suggest.classMemberSnippets.enabled', true),
			includeCompletionsWithObjectLiteralMethodSnippets: config.get<boolean>('suggest.objectLiteralMethodSnippets.enabled', true),
			autoImportFileExcludePatterns: this.getAutoImportFileExcludePatternsPreference(preferencesConfig, vscode.workspace.getWorkspaceFolder(document.uri)?.uri),
			autoImportSpecifierExcludeRegexes: preferencesConfig.get<string[]>('autoImportSpecifierExcludeRegexes'),
			preferTypeOnlyAutoImports: preferencesConfig.get<boolean>('preferTypeOnlyAutoImports', false),
			useLabelDetailsInCompletionEntries: true,
			allowIncompleteCompletions: true,
			displayPartsForJSDoc: true,
			disableLineTextInReferences: true,
			interactiveInlayHints: true,
			includeCompletionsForModuleExports: config.get<boolean>('suggest.autoImports'),
			...getInlayHintsPreferences(config),
			...this.getOrganizeImportsPreferences(preferencesConfig),
			maximumHoverLength: this.getMaximumHoverLength(document),
		};

		return preferences;
	}

	private getQuoteStylePreference(config: vscode.WorkspaceConfiguration) {
		switch (config.get<string>('quoteStyle')) {
			case 'single': return 'single';
			case 'double': return 'double';
			default: return 'auto';
		}
	}

	private getAutoImportFileExcludePatternsPreference(config: vscode.WorkspaceConfiguration, workspaceFolder: vscode.Uri | undefined): string[] | undefined {
		return workspaceFolder && config.get<string[]>('autoImportFileExcludePatterns')?.map(p => {
			// Normalization rules: https://github.com/microsoft/TypeScript/pull/49578
			const isRelative = /^\.\.?($|[\/\\])/.test(p);
			// In TypeScript < 5.3, the first path component cannot be a wildcard, so we need to prefix
			// it with a path root (e.g. `/` or `c:\`)
			const wildcardPrefix = this.client.apiVersion.gte(API.v540)
				? ''
				: path.parse(this.client.toTsFilePath(workspaceFolder)!).root;
			return path.isAbsolute(p) ? p :
				p.startsWith('*') ? wildcardPrefix + p :
					isRelative ? this.client.toTsFilePath(vscode.Uri.joinPath(workspaceFolder, p))! :
						wildcardPrefix + '**' + path.sep + p;
		});
	}

	private getOrganizeImportsPreferences(config: vscode.WorkspaceConfiguration): Proto.UserPreferences {
		const organizeImportsCollation = config.get<'ordinal' | 'unicode'>('organizeImports.unicodeCollation');
		const organizeImportsCaseSensitivity = config.get<'auto' | 'caseInsensitive' | 'caseSensitive'>('organizeImports.caseSensitivity');
		return {
			// More specific settings
			organizeImportsTypeOrder: withDefaultAsUndefined(config.get<'auto' | 'last' | 'inline' | 'first'>('organizeImports.typeOrder', 'auto'), 'auto'),
			organizeImportsIgnoreCase: organizeImportsCaseSensitivity === 'caseInsensitive' ? true
				: organizeImportsCaseSensitivity === 'caseSensitive' ? false
					: 'auto',
			organizeImportsCollation,

			// The rest of the settings are only applicable when using unicode collation
			...(organizeImportsCollation === 'unicode' ? {
				organizeImportsCaseFirst: organizeImportsCaseSensitivity === 'caseInsensitive' ? undefined : withDefaultAsUndefined(config.get<'default' | 'upper' | 'lower' | false>('organizeImports.caseFirst', false), 'default'),
				organizeImportsAccentCollation: config.get<boolean>('organizeImports.accentCollation'),
				organizeImportsLocale: config.get<string>('organizeImports.locale'),
				organizeImportsNumericCollation: config.get<boolean>('organizeImports.numericCollation'),
			} : {}),
		};
	}


	private getMaximumHoverLength(document: vscode.TextDocument): number {
		const defaultMaxLength = 500;
		const maximumHoverLength = vscode.workspace.getConfiguration('js/ts', document).get<number>('hover.maximumLength', defaultMaxLength);
		if (!Number.isSafeInteger(maximumHoverLength) || maximumHoverLength <= 0) {
			return defaultMaxLength;
		}
		return maximumHoverLength;
	}
}

function withDefaultAsUndefined<T, O extends T>(value: T, def: O): Exclude<T, O> | undefined {
	return value === def ? undefined : value as Exclude<T, O>;
}

export class InlayHintSettingNames {
	static readonly parameterNamesSuppressWhenArgumentMatchesName = 'inlayHints.parameterNames.suppressWhenArgumentMatchesName';
	static readonly parameterNamesEnabled = 'inlayHints.parameterTypes.enabled';
	static readonly variableTypesEnabled = 'inlayHints.variableTypes.enabled';
	static readonly variableTypesSuppressWhenTypeMatchesName = 'inlayHints.variableTypes.suppressWhenTypeMatchesName';
	static readonly propertyDeclarationTypesEnabled = 'inlayHints.propertyDeclarationTypes.enabled';
	static readonly functionLikeReturnTypesEnabled = 'inlayHints.functionLikeReturnTypes.enabled';
	static readonly enumMemberValuesEnabled = 'inlayHints.enumMemberValues.enabled';
}

export function getInlayHintsPreferences(config: vscode.WorkspaceConfiguration) {
	return {
		includeInlayParameterNameHints: getInlayParameterNameHintsPreference(config),
		includeInlayParameterNameHintsWhenArgumentMatchesName: !config.get<boolean>(InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName, true),
		includeInlayFunctionParameterTypeHints: config.get<boolean>(InlayHintSettingNames.parameterNamesEnabled, false),
		includeInlayVariableTypeHints: config.get<boolean>(InlayHintSettingNames.variableTypesEnabled, false),
		includeInlayVariableTypeHintsWhenTypeMatchesName: !config.get<boolean>(InlayHintSettingNames.variableTypesSuppressWhenTypeMatchesName, true),
		includeInlayPropertyDeclarationTypeHints: config.get<boolean>(InlayHintSettingNames.propertyDeclarationTypesEnabled, false),
		includeInlayFunctionLikeReturnTypeHints: config.get<boolean>(InlayHintSettingNames.functionLikeReturnTypesEnabled, false),
		includeInlayEnumMemberValueHints: config.get<boolean>(InlayHintSettingNames.enumMemberValuesEnabled, false),
	} as const;
}

function getInlayParameterNameHintsPreference(config: vscode.WorkspaceConfiguration) {
	switch (config.get<string>('inlayHints.parameterNames.enabled')) {
		case 'none': return 'none';
		case 'literals': return 'literals';
		case 'all': return 'all';
		default: return undefined;
	}
}

function getImportModuleSpecifierPreference(config: vscode.WorkspaceConfiguration) {
	switch (config.get<string>('importModuleSpecifier')) {
		case 'project-relative': return 'project-relative';
		case 'relative': return 'relative';
		case 'non-relative': return 'non-relative';
		default: return undefined;
	}
}

function getImportModuleSpecifierEndingPreference(config: vscode.WorkspaceConfiguration) {
	switch (config.get<string>('importModuleSpecifierEnding')) {
		case 'minimal': return 'minimal';
		case 'index': return 'index';
		case 'js': return 'js';
		default: return 'auto';
	}
}

function getJsxAttributeCompletionStyle(config: vscode.WorkspaceConfiguration) {
	switch (config.get<string>('jsxAttributeCompletionStyle')) {
		case 'braces': return 'braces';
		case 'none': return 'none';
		default: return 'auto';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/fileReferences.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/fileReferences.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command, CommandManager } from '../commands/commandManager';
import { isSupportedLanguageMode } from '../configuration/languageIds';
import { API } from '../tsServer/api';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';


class FileReferencesCommand implements Command {

	public static readonly context = 'tsSupportsFileReferences';
	public static readonly minVersion = API.v420;

	public readonly id = 'typescript.findAllFileReferences';

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	public async execute(resource?: vscode.Uri) {
		if (this.client.apiVersion.lt(FileReferencesCommand.minVersion)) {
			vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Requires TypeScript 4.2+."));
			return;
		}

		resource ??= vscode.window.activeTextEditor?.document.uri;
		if (!resource) {
			vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. No resource provided."));
			return;
		}

		const document = await vscode.workspace.openTextDocument(resource);
		if (!isSupportedLanguageMode(document)) {
			vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Unsupported file type."));
			return;
		}

		const openedFiledPath = this.client.toOpenTsFilePath(document);
		if (!openedFiledPath) {
			vscode.window.showErrorMessage(vscode.l10n.t("Find file references failed. Unknown file type."));
			return;
		}

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: vscode.l10n.t("Finding file references")
		}, async (_progress, token) => {

			const response = await this.client.execute('fileReferences', {
				file: openedFiledPath
			}, token);
			if (response.type !== 'response' || !response.body) {
				return;
			}

			const locations: vscode.Location[] = response.body.refs.map(reference =>
				typeConverters.Location.fromTextSpan(this.client.toResource(reference.file), reference));

			const config = vscode.workspace.getConfiguration('references');
			const existingSetting = config.inspect<string>('preferredLocation');

			await config.update('preferredLocation', 'view');
			try {
				await vscode.commands.executeCommand('editor.action.showReferences', resource, new vscode.Position(0, 0), locations);
			} finally {
				await config.update('preferredLocation', existingSetting?.workspaceFolderValue ?? existingSetting?.workspaceValue);
			}
		});
	}
}


export function register(
	client: ITypeScriptServiceClient,
	commandManager: CommandManager
) {
	function updateContext(overrideValue?: boolean) {
		vscode.commands.executeCommand('setContext', FileReferencesCommand.context, overrideValue ?? client.apiVersion.gte(FileReferencesCommand.minVersion));
	}
	updateContext();

	commandManager.register(new FileReferencesCommand(client));
	return vscode.Disposable.from(
		client.onTsServerStarted(() => updateContext()),
		new vscode.Disposable(() => updateContext(false)),
	);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/fixAll.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/fixAll.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import * as errorCodes from '../tsServer/protocol/errorCodes';
import * as fixNames from '../tsServer/protocol/fixNames';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { DiagnosticsManager } from './diagnostics';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';


interface AutoFix {
	readonly codes: Set<number>;
	readonly fixName: string;
}

async function buildIndividualFixes(
	fixes: readonly AutoFix[],
	edit: vscode.WorkspaceEdit,
	client: ITypeScriptServiceClient,
	file: string,
	diagnostics: readonly vscode.Diagnostic[],
	token: vscode.CancellationToken,
): Promise<void> {
	for (const diagnostic of diagnostics) {
		for (const { codes, fixName } of fixes) {
			if (token.isCancellationRequested) {
				return;
			}

			if (!codes.has(diagnostic.code as number)) {
				continue;
			}

			const args: Proto.CodeFixRequestArgs = {
				...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
				errorCodes: [+(diagnostic.code!)]
			};

			const response = await client.execute('getCodeFixes', args, token);
			if (response.type !== 'response') {
				continue;
			}

			const fix = response.body?.find(fix => fix.fixName === fixName);
			if (fix) {
				typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, fix.changes);
				break;
			}
		}
	}
}

async function buildCombinedFix(
	fixes: readonly AutoFix[],
	edit: vscode.WorkspaceEdit,
	client: ITypeScriptServiceClient,
	file: string,
	diagnostics: readonly vscode.Diagnostic[],
	token: vscode.CancellationToken,
): Promise<void> {
	for (const diagnostic of diagnostics) {
		for (const { codes, fixName } of fixes) {
			if (token.isCancellationRequested) {
				return;
			}

			if (!codes.has(diagnostic.code as number)) {
				continue;
			}

			const args: Proto.CodeFixRequestArgs = {
				...typeConverters.Range.toFileRangeRequestArgs(file, diagnostic.range),
				errorCodes: [+(diagnostic.code!)]
			};

			const response = await client.execute('getCodeFixes', args, token);
			if (response.type !== 'response' || !response.body?.length) {
				continue;
			}

			const fix = response.body?.find(fix => fix.fixName === fixName);
			if (!fix) {
				continue;
			}

			if (!fix.fixId) {
				typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, fix.changes);
				return;
			}

			const combinedArgs: Proto.GetCombinedCodeFixRequestArgs = {
				scope: {
					type: 'file',
					args: { file }
				},
				fixId: fix.fixId,
			};

			const combinedResponse = await client.execute('getCombinedCodeFix', combinedArgs, token);
			if (combinedResponse.type !== 'response' || !combinedResponse.body) {
				return;
			}

			typeConverters.WorkspaceEdit.withFileCodeEdits(edit, client, combinedResponse.body.changes);
			return;
		}
	}
}

// #region Source Actions

abstract class SourceAction extends vscode.CodeAction {
	abstract build(
		client: ITypeScriptServiceClient,
		file: string,
		diagnostics: readonly vscode.Diagnostic[],
		token: vscode.CancellationToken,
	): Promise<void>;
}

class SourceFixAll extends SourceAction {

	static readonly kind = vscode.CodeActionKind.SourceFixAll.append('ts');

	constructor() {
		super(vscode.l10n.t("Fix all fixable JS/TS issues"), SourceFixAll.kind);
	}

	async build(client: ITypeScriptServiceClient, file: string, diagnostics: readonly vscode.Diagnostic[], token: vscode.CancellationToken): Promise<void> {
		this.edit = new vscode.WorkspaceEdit();

		await buildIndividualFixes([
			{ codes: errorCodes.incorrectlyImplementsInterface, fixName: fixNames.classIncorrectlyImplementsInterface },
			{ codes: errorCodes.asyncOnlyAllowedInAsyncFunctions, fixName: fixNames.awaitInSyncFunction },
		], this.edit, client, file, diagnostics, token);

		await buildCombinedFix([
			{ codes: errorCodes.unreachableCode, fixName: fixNames.unreachableCode }
		], this.edit, client, file, diagnostics, token);
	}
}

class SourceRemoveUnused extends SourceAction {

	static readonly kind = vscode.CodeActionKind.Source.append('removeUnused').append('ts');

	constructor() {
		super(vscode.l10n.t("Remove all unused code"), SourceRemoveUnused.kind);
	}

	async build(client: ITypeScriptServiceClient, file: string, diagnostics: readonly vscode.Diagnostic[], token: vscode.CancellationToken): Promise<void> {
		this.edit = new vscode.WorkspaceEdit();
		await buildCombinedFix([
			{ codes: errorCodes.variableDeclaredButNeverUsed, fixName: fixNames.unusedIdentifier },
		], this.edit, client, file, diagnostics, token);
	}
}

class SourceAddMissingImports extends SourceAction {

	static readonly kind = vscode.CodeActionKind.Source.append('addMissingImports').append('ts');

	constructor() {
		super(vscode.l10n.t("Add all missing imports"), SourceAddMissingImports.kind);
	}

	async build(client: ITypeScriptServiceClient, file: string, diagnostics: readonly vscode.Diagnostic[], token: vscode.CancellationToken): Promise<void> {
		this.edit = new vscode.WorkspaceEdit();
		await buildCombinedFix([
			{ codes: errorCodes.cannotFindName, fixName: fixNames.fixImport }
		],
			this.edit, client, file, diagnostics, token);
	}
}

//#endregion

class TypeScriptAutoFixProvider implements vscode.CodeActionProvider {

	private static readonly kindProviders = [
		SourceFixAll,
		SourceRemoveUnused,
		SourceAddMissingImports,
	];

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
		private readonly diagnosticsManager: DiagnosticsManager,
	) { }

	public get metadata(): vscode.CodeActionProviderMetadata {
		return {
			providedCodeActionKinds: TypeScriptAutoFixProvider.kindProviders.map(x => x.kind),
		};
	}

	public async provideCodeActions(
		document: vscode.TextDocument,
		_range: vscode.Range,
		context: vscode.CodeActionContext,
		token: vscode.CancellationToken
	): Promise<vscode.CodeAction[] | undefined> {
		if (!context.only || !vscode.CodeActionKind.Source.intersects(context.only)) {
			return undefined;
		}

		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		const actions = this.getFixAllActions(context.only);
		const diagnostics = this.diagnosticsManager.getDiagnostics(document.uri);
		if (!diagnostics.length) {
			// Actions are a no-op in this case but we still want to return them
			return actions;
		}

		await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);

		if (token.isCancellationRequested) {
			return undefined;
		}

		await Promise.all(actions.map(action => action.build(this.client, file, diagnostics, token)));

		return actions;
	}

	private getFixAllActions(only: vscode.CodeActionKind): SourceAction[] {
		return TypeScriptAutoFixProvider.kindProviders
			.filter(provider => only.intersects(provider.kind))
			.map(provider => new provider());
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
	diagnosticsManager: DiagnosticsManager,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		const provider = new TypeScriptAutoFixProvider(client, fileConfigurationManager, diagnosticsManager);
		return vscode.languages.registerCodeActionsProvider(selector.semantic, provider, provider.metadata);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/folding.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/folding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';
import { coalesce } from '../utils/arrays';

class TypeScriptFoldingProvider implements vscode.FoldingRangeProvider {

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	async provideFoldingRanges(
		document: vscode.TextDocument,
		_context: vscode.FoldingContext,
		token: vscode.CancellationToken
	): Promise<vscode.FoldingRange[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return;
		}

		const args: Proto.FileRequestArgs = { file };
		const response = await this.client.execute('getOutliningSpans', args, token);
		if (response.type !== 'response' || !response.body) {
			return;
		}

		return coalesce(response.body.map(span => this.convertOutliningSpan(span, document)));
	}

	private convertOutliningSpan(
		span: Proto.OutliningSpan,
		document: vscode.TextDocument
	): vscode.FoldingRange | undefined {
		const range = typeConverters.Range.fromTextSpan(span.textSpan);
		const kind = TypeScriptFoldingProvider.getFoldingRangeKind(span);

		// Workaround for #49904
		if (span.kind === 'comment') {
			const line = document.lineAt(range.start.line).text;
			if (/\/\/\s*#endregion/gi.test(line)) {
				return undefined;
			}
		}

		const start = range.start.line;
		const end = this.adjustFoldingEnd(range, document);
		return new vscode.FoldingRange(start, end, kind);
	}

	private static readonly foldEndPairCharacters = ['}', ']', ')', '`', '>'];

	private adjustFoldingEnd(range: vscode.Range, document: vscode.TextDocument) {
		// workaround for #47240
		if (range.end.character > 0) {
			const foldEndCharacter = document.getText(new vscode.Range(range.end.translate(0, -1), range.end));
			if (TypeScriptFoldingProvider.foldEndPairCharacters.includes(foldEndCharacter)) {
				return Math.max(range.end.line - 1, range.start.line);
			}
		}

		return range.end.line;
	}

	private static getFoldingRangeKind(span: Proto.OutliningSpan): vscode.FoldingRangeKind | undefined {
		switch (span.kind) {
			case 'comment': return vscode.FoldingRangeKind.Comment;
			case 'region': return vscode.FoldingRangeKind.Region;
			case 'imports': return vscode.FoldingRangeKind.Imports;
			case 'code':
			default: return undefined;
		}
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
): vscode.Disposable {
	return vscode.languages.registerFoldingRangeProvider(selector.syntax,
		new TypeScriptFoldingProvider(client));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/formatting.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/formatting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import type * as Proto from '../tsServer/protocol/protocol';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireGlobalConfiguration } from './util/dependentRegistration';

class TypeScriptFormattingProvider implements vscode.DocumentRangeFormattingEditProvider, vscode.OnTypeFormattingEditProvider {
	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager
	) { }

	public async provideDocumentRangeFormattingEdits(
		document: vscode.TextDocument,
		range: vscode.Range,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): Promise<vscode.TextEdit[] | undefined> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		await this.fileConfigurationManager.ensureConfigurationOptions(document, options, token);

		const args = typeConverters.Range.toFormattingRequestArgs(file, range);
		const response = await this.client.execute('format', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		return response.body.map(typeConverters.TextEdit.fromCodeEdit);
	}

	public async provideOnTypeFormattingEdits(
		document: vscode.TextDocument,
		position: vscode.Position,
		ch: string,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken
	): Promise<vscode.TextEdit[]> {
		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return [];
		}

		await this.fileConfigurationManager.ensureConfigurationOptions(document, options, token);

		const args: Proto.FormatOnKeyRequestArgs = {
			...typeConverters.Position.toFileLocationRequestArgs(file, position),
			key: ch
		};
		const response = await this.client.execute('formatonkey', args, token);
		if (response.type !== 'response' || !response.body) {
			return [];
		}

		const result: vscode.TextEdit[] = [];
		for (const edit of response.body) {
			const textEdit = typeConverters.TextEdit.fromCodeEdit(edit);
			const range = textEdit.range;
			// Work around for https://github.com/microsoft/TypeScript/issues/6700.
			// Check if we have an edit at the beginning of the line which only removes white spaces and leaves
			// an empty line. Drop those edits
			if (range.start.character === 0 && range.start.line === range.end.line && textEdit.newText === '') {
				const lText = document.lineAt(range.start.line).text;
				// If the edit leaves something on the line keep the edit (note that the end character is exclusive).
				// Keep it also if it removes something else than whitespace
				if (lText.trim().length > 0 || lText.length > range.end.character) {
					result.push(textEdit);
				}
			} else {
				result.push(textEdit);
			}
		}
		return result;
	}
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager
) {
	return conditionalRegistration([
		requireGlobalConfiguration(language.id, 'format.enable'),
	], () => {
		const formattingProvider = new TypeScriptFormattingProvider(client, fileConfigurationManager);
		return vscode.Disposable.from(
			vscode.languages.registerOnTypeFormattingEditProvider(selector.syntax, formattingProvider, ';', '}', '\n'),
			vscode.languages.registerDocumentRangeFormattingEditProvider(selector.syntax, formattingProvider),
		);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/hover.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/hover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import type * as Proto from '../tsServer/protocol/protocol';
import { ClientCapability, ITypeScriptServiceClient, ServerType } from '../typescriptService';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';
import { DocumentSelector } from '../configuration/documentSelector';
import { documentationToMarkdown } from './util/textRendering';
import * as typeConverters from '../typeConverters';
import FileConfigurationManager from './fileConfigurationManager';
import { API } from '../tsServer/api';


class TypeScriptHoverProvider implements vscode.HoverProvider {
	private lastHoverAndLevel: [vscode.Hover, number] | undefined;

	public constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
	) { }

	public async provideHover(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context?: vscode.HoverContext,
	): Promise<vscode.VerboseHover | undefined> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return undefined;
		}

		let verbosityLevel: number | undefined;
		if (this.client.apiVersion.gte(API.v590)) {
			verbosityLevel = Math.max(0, this.getPreviousLevel(context?.previousHover) + (context?.verbosityDelta ?? 0));
		}
		const args = { ...typeConverters.Position.toFileLocationRequestArgs(filepath, position), verbosityLevel };

		const response = await this.client.interruptGetErr(async () => {
			await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);

			return this.client.execute('quickinfo', args, token);
		});

		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const contents = this.getContents(document.uri, response.body, response._serverType);
		const range = typeConverters.Range.fromTextSpan(response.body);
		const hover = verbosityLevel !== undefined ?
			new vscode.VerboseHover(
				contents,
				range,
				/*canIncreaseVerbosity*/ response.body.canIncreaseVerbosityLevel,
				/*canDecreaseVerbosity*/ verbosityLevel !== 0
			) : new vscode.Hover(
				contents,
				range
			);

		if (verbosityLevel !== undefined) {
			this.lastHoverAndLevel = [hover, verbosityLevel];
		}
		return hover;
	}

	private getContents(
		resource: vscode.Uri,
		data: Proto.QuickInfoResponseBody,
		source: ServerType | undefined,
	) {
		const parts: vscode.MarkdownString[] = [];

		if (data.displayString) {
			const displayParts: string[] = [];

			if (source === ServerType.Syntax && this.client.hasCapabilityForResource(resource, ClientCapability.Semantic)) {
				displayParts.push(
					vscode.l10n.t({
						message: "(loading...)",
						comment: ['Prefix displayed for hover entries while the server is still loading']
					}));
			}

			displayParts.push(data.displayString);
			parts.push(new vscode.MarkdownString().appendCodeblock(displayParts.join(' '), 'typescript'));
		}
		const md = documentationToMarkdown(data.documentation, data.tags, this.client, resource);
		parts.push(md);
		return parts;
	}

	private getPreviousLevel(previousHover: vscode.Hover | undefined): number {
		if (previousHover && this.lastHoverAndLevel && this.lastHoverAndLevel[0] === previousHover) {
			return this.lastHoverAndLevel[1];
		}
		return 0;
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
): vscode.Disposable {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.EnhancedSyntax, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerHoverProvider(selector.syntax,
			new TypeScriptHoverProvider(client, fileConfigurationManager));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/implementations.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/implementations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import DefinitionProviderBase from './definitionProviderBase';
import { conditionalRegistration, requireSomeCapability } from './util/dependentRegistration';

class TypeScriptImplementationProvider extends DefinitionProviderBase implements vscode.ImplementationProvider {
	public provideImplementation(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Definition | undefined> {
		return this.getSymbolLocations('implementation', document, position, token);
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
) {
	return conditionalRegistration([
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		return vscode.languages.registerImplementationProvider(selector.semantic,
			new TypeScriptImplementationProvider(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/inlayHints.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/inlayHints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import { TelemetryReporter } from '../logging/telemetry';
import { API } from '../tsServer/api';
import type * as Proto from '../tsServer/protocol/protocol';
import { Location, Position } from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { Disposable } from '../utils/dispose';
import FileConfigurationManager, { InlayHintSettingNames, getInlayHintsPreferences } from './fileConfigurationManager';
import { conditionalRegistration, requireMinVersion, requireSomeCapability } from './util/dependentRegistration';


const inlayHintSettingNames = Object.freeze([
	InlayHintSettingNames.parameterNamesSuppressWhenArgumentMatchesName,
	InlayHintSettingNames.parameterNamesEnabled,
	InlayHintSettingNames.variableTypesEnabled,
	InlayHintSettingNames.variableTypesSuppressWhenTypeMatchesName,
	InlayHintSettingNames.propertyDeclarationTypesEnabled,
	InlayHintSettingNames.functionLikeReturnTypesEnabled,
	InlayHintSettingNames.enumMemberValuesEnabled,
]);

class TypeScriptInlayHintsProvider extends Disposable implements vscode.InlayHintsProvider {

	public static readonly minVersion = API.v440;

	private readonly _onDidChangeInlayHints = this._register(new vscode.EventEmitter<void>());
	public readonly onDidChangeInlayHints = this._onDidChangeInlayHints.event;

	private hasReportedTelemetry = false;

	constructor(
		private readonly language: LanguageDescription,
		private readonly client: ITypeScriptServiceClient,
		private readonly fileConfigurationManager: FileConfigurationManager,
		private readonly telemetryReporter: TelemetryReporter,
	) {
		super();

		this._register(vscode.workspace.onDidChangeConfiguration(e => {
			if (inlayHintSettingNames.some(settingName => e.affectsConfiguration(language.id + '.' + settingName))) {
				this._onDidChangeInlayHints.fire();
			}
		}));

		// When a JS/TS file changes, change inlay hints for all visible editors
		// since changes in one file can effect the hints the others.
		this._register(vscode.workspace.onDidChangeTextDocument(e => {
			if (language.languageIds.includes(e.document.languageId)) {
				this._onDidChangeInlayHints.fire();
			}
		}));
	}

	async provideInlayHints(model: vscode.TextDocument, range: vscode.Range, token: vscode.CancellationToken): Promise<vscode.InlayHint[] | undefined> {
		const filepath = this.client.toOpenTsFilePath(model);
		if (!filepath) {
			return;
		}

		if (!areInlayHintsEnabledForFile(this.language, model)) {
			return;
		}

		const start = model.offsetAt(range.start);
		const length = model.offsetAt(range.end) - start;

		await this.fileConfigurationManager.ensureConfigurationForDocument(model, token);
		if (token.isCancellationRequested) {
			return;
		}

		if (!this.hasReportedTelemetry) {
			this.hasReportedTelemetry = true;
			/* __GDPR__
				"inlayHints.provide" : {
					"owner": "mjbvz",
					"${include}": [
						"${TypeScriptCommonProperties}"
					]
				}
			*/
			this.telemetryReporter.logTelemetry('inlayHints.provide', {});
		}

		const response = await this.client.execute('provideInlayHints', { file: filepath, start, length }, token);
		if (response.type !== 'response' || !response.success || !response.body) {
			return;
		}

		return response.body.map(hint => {
			const result = new vscode.InlayHint(
				Position.fromLocation(hint.position),
				this.convertInlayHintText(hint),
				fromProtocolInlayHintKind(hint.kind)
			);
			result.paddingLeft = hint.whitespaceBefore;
			result.paddingRight = hint.whitespaceAfter;
			return result;
		});
	}

	private convertInlayHintText(tsHint: Proto.InlayHintItem): string | vscode.InlayHintLabelPart[] {
		if (tsHint.displayParts) {
			return tsHint.displayParts.map((part): vscode.InlayHintLabelPart => {
				const out = new vscode.InlayHintLabelPart(part.text);
				if (part.span) {
					out.location = Location.fromTextSpan(this.client.toResource(part.span.file), part.span);
				}
				return out;
			});
		}

		return tsHint.text;
	}
}

function fromProtocolInlayHintKind(kind: Proto.InlayHintKind): vscode.InlayHintKind | undefined {
	switch (kind) {
		case 'Parameter': return vscode.InlayHintKind.Parameter;
		case 'Type': return vscode.InlayHintKind.Type;
		case 'Enum': return undefined;
		default: return undefined;
	}
}

function areInlayHintsEnabledForFile(language: LanguageDescription, document: vscode.TextDocument) {
	const config = vscode.workspace.getConfiguration(language.id, document);
	const preferences = getInlayHintsPreferences(config);

	return preferences.includeInlayParameterNameHints === 'literals' ||
		preferences.includeInlayParameterNameHints === 'all' ||
		preferences.includeInlayEnumMemberValueHints ||
		preferences.includeInlayFunctionLikeReturnTypeHints ||
		preferences.includeInlayFunctionParameterTypeHints ||
		preferences.includeInlayPropertyDeclarationTypeHints ||
		preferences.includeInlayVariableTypeHints;
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,
	telemetryReporter: TelemetryReporter,
) {
	return conditionalRegistration([
		requireMinVersion(client, TypeScriptInlayHintsProvider.minVersion),
		requireSomeCapability(client, ClientCapability.Semantic),
	], () => {
		const provider = new TypeScriptInlayHintsProvider(language, client, fileConfigurationManager, telemetryReporter);
		return vscode.languages.registerInlayHintsProvider(selector.semantic, provider);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/jsDocCompletions.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/jsDocCompletions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { LanguageDescription } from '../configuration/languageDescription';
import * as typeConverters from '../typeConverters';
import { ITypeScriptServiceClient } from '../typescriptService';
import FileConfigurationManager from './fileConfigurationManager';



const defaultJsDoc = new vscode.SnippetString(`/**\n * $0\n */`);

class JsDocCompletionItem extends vscode.CompletionItem {
	constructor(
		public readonly document: vscode.TextDocument,
		public readonly position: vscode.Position
	) {
		super('/** */', vscode.CompletionItemKind.Text);
		this.detail = vscode.l10n.t("JSDoc comment");
		this.sortText = '\0';

		const line = document.lineAt(position.line).text;
		const prefix = line.slice(0, position.character).match(/\/\**\s*$/);
		const suffix = line.slice(position.character).match(/^\s*\**\//);
		const start = position.translate(0, prefix ? -prefix[0].length : 0);
		const range = new vscode.Range(start, position.translate(0, suffix ? suffix[0].length : 0));
		this.range = { inserting: range, replacing: range };
	}
}

class JsDocCompletionProvider implements vscode.CompletionItemProvider {

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly language: LanguageDescription,
		private readonly fileConfigurationManager: FileConfigurationManager,
	) { }

	public async provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken
	): Promise<vscode.CompletionItem[] | undefined> {
		if (!vscode.workspace.getConfiguration(this.language.id, document).get('suggest.completeJSDocs')) {
			return undefined;
		}

		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return undefined;
		}

		if (!this.isPotentiallyValidDocCompletionPosition(document, position)) {
			return undefined;
		}

		const response = await this.client.interruptGetErr(async () => {
			await this.fileConfigurationManager.ensureConfigurationForDocument(document, token);

			const args = typeConverters.Position.toFileLocationRequestArgs(file, position);
			return this.client.execute('docCommentTemplate', args, token);
		});
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const item = new JsDocCompletionItem(document, position);

		// Workaround for #43619
		// docCommentTemplate previously returned undefined for empty jsdoc templates.
		// TS 2.7 now returns a single line doc comment, which breaks indentation.
		if (response.body.newText === '/** */') {
			item.insertText = defaultJsDoc;
		} else {
			item.insertText = templateToSnippet(response.body.newText);
		}

		return [item];
	}

	private isPotentiallyValidDocCompletionPosition(
		document: vscode.TextDocument,
		position: vscode.Position
	): boolean {
		// Only show the JSdoc completion when the everything before the cursor is whitespace
		// or could be the opening of a comment
		const line = document.lineAt(position.line).text;
		const prefix = line.slice(0, position.character);
		if (!/^\s*$|\/\*\*\s*$|^\s*\/\*\*+\s*$/.test(prefix)) {
			return false;
		}

		// And everything after is possibly a closing comment or more whitespace
		const suffix = line.slice(position.character);
		return /^\s*(\*+\/)?\s*$/.test(suffix);
	}
}

export function templateToSnippet(template: string): vscode.SnippetString {
	// TODO: use append placeholder
	let snippetIndex = 1;
	template = template.replace(/\$/g, '\\$'); // CodeQL [SM02383] This is only used for text which is put into the editor. It is not for rendered html
	template = template.replace(/^[ \t]*(?=(\/|[ ]\*))/gm, '');
	template = template.replace(/^(\/\*\*\s*\*[ ]*)$/m, (x) => x + `\$0`);
	template = template.replace(/\* @param([ ]\{\S+\})?\s+(\S+)[ \t]*$/gm, (_param, type, post) => {
		let out = '* @param ';
		if (type === ' {any}' || type === ' {*}') {
			out += `{\$\{${snippetIndex++}:*\}} `;
		} else if (type) {
			out += type + ' ';
		}
		out += post + ` \${${snippetIndex++}}`;
		return out;
	});

	template = template.replace(/\* @returns[ \t]*$/gm, `* @returns \${${snippetIndex++}}`);

	return new vscode.SnippetString(template);
}

export function register(
	selector: DocumentSelector,
	language: LanguageDescription,
	client: ITypeScriptServiceClient,
	fileConfigurationManager: FileConfigurationManager,

): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider(selector.syntax,
		new JsDocCompletionProvider(client, language, fileConfigurationManager),
		'*');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/linkedEditing.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/linkedEditing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { DocumentSelector } from '../configuration/documentSelector';
import { API } from '../tsServer/api';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { conditionalRegistration, requireMinVersion, requireSomeCapability } from './util/dependentRegistration';

class LinkedEditingSupport implements vscode.LinkedEditingRangeProvider {

	public static readonly minVersion = API.v510;

	public constructor(
		private readonly client: ITypeScriptServiceClient
	) { }

	async provideLinkedEditingRanges(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.LinkedEditingRanges | undefined> {
		const filepath = this.client.toOpenTsFilePath(document);
		if (!filepath) {
			return undefined;
		}

		const args = typeConverters.Position.toFileLocationRequestArgs(filepath, position);
		const response = await this.client.execute('linkedEditingRange', args, token);
		if (response.type !== 'response' || !response.body) {
			return undefined;
		}

		const wordPattern = response.body.wordPattern ? new RegExp(response.body.wordPattern) : undefined;
		return new vscode.LinkedEditingRanges(response.body.ranges.map(range => typeConverters.Range.fromTextSpan(range)), wordPattern);
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient
) {
	return conditionalRegistration([
		requireMinVersion(client, LinkedEditingSupport.minVersion),
		requireSomeCapability(client, ClientCapability.Syntax),
	], () => {
		return vscode.languages.registerLinkedEditingRangeProvider(selector.syntax,
			new LinkedEditingSupport(client));
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/typescript-language-features/src/languageFeatures/organizeImports.ts]---
Location: vscode-main/extensions/typescript-language-features/src/languageFeatures/organizeImports.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command, CommandManager } from '../commands/commandManager';
import { DocumentSelector } from '../configuration/documentSelector';
import { TelemetryReporter } from '../logging/telemetry';
import { API } from '../tsServer/api';
import type * as Proto from '../tsServer/protocol/protocol';
import { OrganizeImportsMode } from '../tsServer/protocol/protocol.const';
import * as typeConverters from '../typeConverters';
import { ClientCapability, ITypeScriptServiceClient } from '../typescriptService';
import { nulToken } from '../utils/cancellation';
import FileConfigurationManager from './fileConfigurationManager';
import { conditionalRegistration, requireMinVersion, requireSomeCapability } from './util/dependentRegistration';


interface OrganizeImportsCommandMetadata {
	readonly commandIds: readonly string[];
	readonly title: string;
	readonly minVersion?: API;
	readonly kind: vscode.CodeActionKind;
	readonly mode: OrganizeImportsMode;
}

const organizeImportsCommand: OrganizeImportsCommandMetadata = {
	commandIds: [], // We use the generic 'Organize imports' command
	title: vscode.l10n.t("Organize Imports"),
	kind: vscode.CodeActionKind.SourceOrganizeImports,
	mode: OrganizeImportsMode.All,
};

const sortImportsCommand: OrganizeImportsCommandMetadata = {
	commandIds: ['typescript.sortImports', 'javascript.sortImports'],
	minVersion: API.v430,
	title: vscode.l10n.t("Sort Imports"),
	kind: vscode.CodeActionKind.Source.append('sortImports'),
	mode: OrganizeImportsMode.SortAndCombine,
};

const removeUnusedImportsCommand: OrganizeImportsCommandMetadata = {
	commandIds: ['typescript.removeUnusedImports', 'javascript.removeUnusedImports'],
	minVersion: API.v490,
	title: vscode.l10n.t("Remove Unused Imports"),
	kind: vscode.CodeActionKind.Source.append('removeUnusedImports'),
	mode: OrganizeImportsMode.RemoveUnused,
};

class DidOrganizeImportsCommand implements Command {

	public static readonly ID = '_typescript.didOrganizeImports';
	public readonly id = DidOrganizeImportsCommand.ID;

	constructor(
		private readonly telemetryReporter: TelemetryReporter,
	) { }

	public async execute(): Promise<void> {
		/* __GDPR__
			"organizeImports.execute" : {
				"owner": "mjbvz",
				"${include}": [
					"${TypeScriptCommonProperties}"
				]
			}
		*/
		this.telemetryReporter.logTelemetry('organizeImports.execute', {});
	}
}

class ImportCodeAction extends vscode.CodeAction {
	constructor(
		title: string,
		kind: vscode.CodeActionKind,
		public readonly document: vscode.TextDocument,
	) {
		super(title, kind);
	}
}

class ImportsCodeActionProvider implements vscode.CodeActionProvider<ImportCodeAction> {

	constructor(
		private readonly client: ITypeScriptServiceClient,
		private readonly commandMetadata: OrganizeImportsCommandMetadata,
		commandManager: CommandManager,
		private readonly fileConfigManager: FileConfigurationManager,
		telemetryReporter: TelemetryReporter,
	) {
		commandManager.register(new DidOrganizeImportsCommand(telemetryReporter));
	}

	public provideCodeActions(
		document: vscode.TextDocument,
		_range: vscode.Range,
		context: vscode.CodeActionContext,
		_token: vscode.CancellationToken
	): ImportCodeAction[] {
		if (!context.only?.contains(this.commandMetadata.kind)) {
			return [];
		}

		const file = this.client.toOpenTsFilePath(document);
		if (!file) {
			return [];
		}

		return [new ImportCodeAction(this.commandMetadata.title, this.commandMetadata.kind, document)];
	}

	async resolveCodeAction(codeAction: ImportCodeAction, token: vscode.CancellationToken): Promise<ImportCodeAction | undefined> {
		const response = await this.client.interruptGetErr(async () => {
			await this.fileConfigManager.ensureConfigurationForDocument(codeAction.document, token);
			if (token.isCancellationRequested) {
				return;
			}

			const file = this.client.toOpenTsFilePath(codeAction.document);
			if (!file) {
				return;
			}

			const args: Proto.OrganizeImportsRequestArgs = {
				scope: {
					type: 'file',
					args: { file }
				},
				// Deprecated in 4.9; `mode` takes priority
				skipDestructiveCodeActions: this.commandMetadata.mode === OrganizeImportsMode.SortAndCombine,
				mode: typeConverters.OrganizeImportsMode.toProtocolOrganizeImportsMode(this.commandMetadata.mode),
			};

			return this.client.execute('organizeImports', args, nulToken);
		});
		if (response?.type !== 'response' || !response.body || token.isCancellationRequested) {
			return;
		}

		if (response.body.length) {
			codeAction.edit = typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client, response.body);
		}

		codeAction.command = { command: DidOrganizeImportsCommand.ID, title: '', arguments: [] };

		return codeAction;
	}
}

export function register(
	selector: DocumentSelector,
	client: ITypeScriptServiceClient,
	commandManager: CommandManager,
	fileConfigurationManager: FileConfigurationManager,
	telemetryReporter: TelemetryReporter,
): vscode.Disposable {
	const disposables: vscode.Disposable[] = [];

	for (const command of [organizeImportsCommand, sortImportsCommand, removeUnusedImportsCommand]) {
		disposables.push(
			conditionalRegistration([
				requireMinVersion(client, command.minVersion ?? API.defaultVersion),
				requireSomeCapability(client, ClientCapability.Semantic),
			], () => {
				const provider = new ImportsCodeActionProvider(client, command, commandManager, fileConfigurationManager, telemetryReporter);
				return vscode.Disposable.from(
					vscode.languages.registerCodeActionsProvider(selector.semantic, provider, {
						providedCodeActionKinds: [command.kind]
					}));
			}),
			// Always register these commands. We will show a warning if the user tries to run them on an unsupported version
			...command.commandIds.map(id =>
				commandManager.register({
					id,
					execute() {
						return vscode.commands.executeCommand('editor.action.sourceAction', {
							kind: command.kind.value,
							apply: 'first',
						});
					}
				}))
		);
	}

	return vscode.Disposable.from(...disposables);
}
```

--------------------------------------------------------------------------------

````

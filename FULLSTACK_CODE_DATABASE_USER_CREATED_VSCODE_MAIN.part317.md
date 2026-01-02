---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 317
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 317 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostWorkspace.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { delta as arrayDelta, mapArrayOrNot } from '../../../base/common/arrays.js';
import { AsyncIterableProducer, Barrier } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { AsyncEmitter, Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { TernarySearchTree } from '../../../base/common/ternarySearchTree.js';
import { Schemas } from '../../../base/common/network.js';
import { Counter } from '../../../base/common/numbers.js';
import { basename, basenameOrAuthority, dirname, ExtUri, relativePath } from '../../../base/common/resources.js';
import { compare } from '../../../base/common/strings.js';
import { isUriComponents, URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { FileSystemProviderCapabilities } from '../../../platform/files/common/files.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Severity } from '../../../platform/notification/common/notification.js';
import { EditSessionIdentityMatch } from '../../../platform/workspace/common/editSessions.js';
import { Workspace, WorkspaceFolder } from '../../../platform/workspace/common/workspace.js';
import { IExtHostFileSystemInfo } from './extHostFileSystemInfo.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { GlobPattern } from './extHostTypeConverters.js';
import { Range } from './extHostTypes.js';
import { IURITransformerService } from './extHostUriTransformerService.js';
import { IFileQueryBuilderOptions, ISearchPatternBuilder, ITextQueryBuilderOptions } from '../../services/search/common/queryBuilder.js';
import { IRawFileMatch2, ITextSearchResult, resultIsMatch } from '../../services/search/common/search.js';
import type * as vscode from 'vscode';
import { ExtHostWorkspaceShape, IRelativePatternDto, IWorkspaceData, MainContext, MainThreadMessageOptions, MainThreadMessageServiceShape, MainThreadWorkspaceShape } from './extHost.protocol.js';
import { revive } from '../../../base/common/marshalling.js';
import { AuthInfo, Credentials } from '../../../platform/request/common/request.js';
import { ExcludeSettingOptions, TextSearchContext2, TextSearchMatch2 } from '../../services/search/common/searchExtTypes.js';
import { bufferToStream, readableToBuffer, VSBuffer } from '../../../base/common/buffer.js';
import { toDecodeStream, toEncodeReadable, UTF8 } from '../../services/textfile/common/encoding.js';
import { consumeStream } from '../../../base/common/stream.js';
import { stringToSnapshot } from '../../services/textfile/common/textfiles.js';

export interface IExtHostWorkspaceProvider {
	getWorkspaceFolder2(uri: vscode.Uri, resolveParent?: boolean): Promise<vscode.WorkspaceFolder | undefined>;
	resolveWorkspaceFolder(uri: vscode.Uri): Promise<vscode.WorkspaceFolder | undefined>;
	getWorkspaceFolders2(): Promise<vscode.WorkspaceFolder[] | undefined>;
	resolveProxy(url: string): Promise<string | undefined>;
	lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined>;
	lookupKerberosAuthorization(url: string): Promise<string | undefined>;
	loadCertificates(): Promise<string[]>;
}

function isFolderEqual(folderA: URI, folderB: URI, extHostFileSystemInfo: IExtHostFileSystemInfo): boolean {
	return new ExtUri(uri => ignorePathCasing(uri, extHostFileSystemInfo)).isEqual(folderA, folderB);
}

function compareWorkspaceFolderByUri(a: vscode.WorkspaceFolder, b: vscode.WorkspaceFolder, extHostFileSystemInfo: IExtHostFileSystemInfo): number {
	return isFolderEqual(a.uri, b.uri, extHostFileSystemInfo) ? 0 : compare(a.uri.toString(), b.uri.toString());
}

function compareWorkspaceFolderByUriAndNameAndIndex(a: vscode.WorkspaceFolder, b: vscode.WorkspaceFolder, extHostFileSystemInfo: IExtHostFileSystemInfo): number {
	if (a.index !== b.index) {
		return a.index < b.index ? -1 : 1;
	}

	return isFolderEqual(a.uri, b.uri, extHostFileSystemInfo) ? compare(a.name, b.name) : compare(a.uri.toString(), b.uri.toString());
}

function delta(oldFolders: vscode.WorkspaceFolder[], newFolders: vscode.WorkspaceFolder[], compare: (a: vscode.WorkspaceFolder, b: vscode.WorkspaceFolder, extHostFileSystemInfo: IExtHostFileSystemInfo) => number, extHostFileSystemInfo: IExtHostFileSystemInfo): { removed: vscode.WorkspaceFolder[]; added: vscode.WorkspaceFolder[] } {
	const oldSortedFolders = oldFolders.slice(0).sort((a, b) => compare(a, b, extHostFileSystemInfo));
	const newSortedFolders = newFolders.slice(0).sort((a, b) => compare(a, b, extHostFileSystemInfo));

	return arrayDelta(oldSortedFolders, newSortedFolders, (a, b) => compare(a, b, extHostFileSystemInfo));
}

function ignorePathCasing(uri: URI, extHostFileSystemInfo: IExtHostFileSystemInfo): boolean {
	const capabilities = extHostFileSystemInfo.getCapabilities(uri.scheme);
	return !(capabilities && (capabilities & FileSystemProviderCapabilities.PathCaseSensitive));
}

interface MutableWorkspaceFolder extends vscode.WorkspaceFolder {
	name: string;
	index: number;
}

interface QueryOptions<T> {
	options: T;
	folder: URI | undefined;
}

class ExtHostWorkspaceImpl extends Workspace {

	static toExtHostWorkspace(data: IWorkspaceData | null, previousConfirmedWorkspace: ExtHostWorkspaceImpl | undefined, previousUnconfirmedWorkspace: ExtHostWorkspaceImpl | undefined, extHostFileSystemInfo: IExtHostFileSystemInfo): { workspace: ExtHostWorkspaceImpl | null; added: vscode.WorkspaceFolder[]; removed: vscode.WorkspaceFolder[] } {
		if (!data) {
			return { workspace: null, added: [], removed: [] };
		}

		const { id, name, folders, configuration, transient, isUntitled } = data;
		const newWorkspaceFolders: vscode.WorkspaceFolder[] = [];

		// If we have an existing workspace, we try to find the folders that match our
		// data and update their properties. It could be that an extension stored them
		// for later use and we want to keep them "live" if they are still present.
		const oldWorkspace = previousConfirmedWorkspace;
		if (previousConfirmedWorkspace) {
			folders.forEach((folderData, index) => {
				const folderUri = URI.revive(folderData.uri);
				const existingFolder = ExtHostWorkspaceImpl._findFolder(previousUnconfirmedWorkspace || previousConfirmedWorkspace, folderUri, extHostFileSystemInfo);

				if (existingFolder) {
					existingFolder.name = folderData.name;
					existingFolder.index = folderData.index;

					newWorkspaceFolders.push(existingFolder);
				} else {
					newWorkspaceFolders.push({ uri: folderUri, name: folderData.name, index });
				}
			});
		} else {
			newWorkspaceFolders.push(...folders.map(({ uri, name, index }) => ({ uri: URI.revive(uri), name, index })));
		}

		// make sure to restore sort order based on index
		newWorkspaceFolders.sort((f1, f2) => f1.index < f2.index ? -1 : 1);

		const workspace = new ExtHostWorkspaceImpl(id, name, newWorkspaceFolders, !!transient, configuration ? URI.revive(configuration) : null, !!isUntitled, uri => ignorePathCasing(uri, extHostFileSystemInfo));
		const { added, removed } = delta(oldWorkspace ? oldWorkspace.workspaceFolders : [], workspace.workspaceFolders, compareWorkspaceFolderByUri, extHostFileSystemInfo);

		return { workspace, added, removed };
	}

	private static _findFolder(workspace: ExtHostWorkspaceImpl, folderUriToFind: URI, extHostFileSystemInfo: IExtHostFileSystemInfo): MutableWorkspaceFolder | undefined {
		for (let i = 0; i < workspace.folders.length; i++) {
			const folder = workspace.workspaceFolders[i];
			if (isFolderEqual(folder.uri, folderUriToFind, extHostFileSystemInfo)) {
				return folder;
			}
		}

		return undefined;
	}

	private readonly _workspaceFolders: vscode.WorkspaceFolder[] = [];
	private readonly _structure: TernarySearchTree<URI, vscode.WorkspaceFolder>;

	constructor(id: string, private _name: string, folders: vscode.WorkspaceFolder[], transient: boolean, configuration: URI | null, private _isUntitled: boolean, ignorePathCasing: (key: URI) => boolean) {
		super(id, folders.map(f => new WorkspaceFolder(f)), transient, configuration, ignorePathCasing);
		this._structure = TernarySearchTree.forUris<vscode.WorkspaceFolder>(ignorePathCasing, () => true);

		// setup the workspace folder data structure
		folders.forEach(folder => {
			this._workspaceFolders.push(folder);
			this._structure.set(folder.uri, folder);
		});
	}

	get name(): string {
		return this._name;
	}

	get isUntitled(): boolean {
		return this._isUntitled;
	}

	get workspaceFolders(): vscode.WorkspaceFolder[] {
		return this._workspaceFolders.slice(0);
	}

	getWorkspaceFolder(uri: URI, resolveParent?: boolean): vscode.WorkspaceFolder | undefined {
		if (resolveParent && this._structure.get(uri)) {
			// `uri` is a workspace folder so we check for its parent
			uri = dirname(uri);
		}
		return this._structure.findSubstr(uri);
	}

	resolveWorkspaceFolder(uri: URI): vscode.WorkspaceFolder | undefined {
		return this._structure.get(uri);
	}
}

export class ExtHostWorkspace implements ExtHostWorkspaceShape, IExtHostWorkspaceProvider {

	readonly _serviceBrand: undefined;

	private readonly _onDidChangeWorkspace = new Emitter<vscode.WorkspaceFoldersChangeEvent>();
	readonly onDidChangeWorkspace: Event<vscode.WorkspaceFoldersChangeEvent> = this._onDidChangeWorkspace.event;

	private readonly _onDidGrantWorkspaceTrust = new Emitter<void>();
	readonly onDidGrantWorkspaceTrust: Event<void> = this._onDidGrantWorkspaceTrust.event;

	private readonly _logService: ILogService;
	private readonly _requestIdProvider: Counter;
	private readonly _barrier: Barrier;

	private _confirmedWorkspace?: ExtHostWorkspaceImpl;
	private _unconfirmedWorkspace?: ExtHostWorkspaceImpl;

	private readonly _proxy: MainThreadWorkspaceShape;
	private readonly _messageService: MainThreadMessageServiceShape;
	private readonly _extHostFileSystemInfo: IExtHostFileSystemInfo;
	private readonly _uriTransformerService: IURITransformerService;

	private readonly _activeSearchCallbacks: ((match: IRawFileMatch2) => any)[] = [];

	private _trusted: boolean = false;

	private readonly _editSessionIdentityProviders = new Map<string, vscode.EditSessionIdentityProvider>();

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
		@IExtHostFileSystemInfo extHostFileSystemInfo: IExtHostFileSystemInfo,
		@ILogService logService: ILogService,
		@IURITransformerService uriTransformerService: IURITransformerService,
	) {
		this._logService = logService;
		this._extHostFileSystemInfo = extHostFileSystemInfo;
		this._uriTransformerService = uriTransformerService;
		this._requestIdProvider = new Counter();
		this._barrier = new Barrier();

		this._proxy = extHostRpc.getProxy(MainContext.MainThreadWorkspace);
		this._messageService = extHostRpc.getProxy(MainContext.MainThreadMessageService);
		const data = initData.workspace;
		this._confirmedWorkspace = data ? new ExtHostWorkspaceImpl(data.id, data.name, [], !!data.transient, data.configuration ? URI.revive(data.configuration) : null, !!data.isUntitled, uri => ignorePathCasing(uri, extHostFileSystemInfo)) : undefined;
	}

	$initializeWorkspace(data: IWorkspaceData | null, trusted: boolean): void {
		this._trusted = trusted;
		this.$acceptWorkspaceData(data);
		this._barrier.open();
	}

	waitForInitializeCall(): Promise<boolean> {
		return this._barrier.wait();
	}

	// --- workspace ---

	get workspace(): Workspace | undefined {
		return this._actualWorkspace;
	}

	get name(): string | undefined {
		return this._actualWorkspace ? this._actualWorkspace.name : undefined;
	}

	get workspaceFile(): vscode.Uri | undefined {
		if (this._actualWorkspace) {
			if (this._actualWorkspace.configuration) {
				if (this._actualWorkspace.isUntitled) {
					return URI.from({ scheme: Schemas.untitled, path: basename(dirname(this._actualWorkspace.configuration)) }); // Untitled Workspace: return untitled URI
				}

				return this._actualWorkspace.configuration; // Workspace: return the configuration location
			}
		}

		return undefined;
	}

	private get _actualWorkspace(): ExtHostWorkspaceImpl | undefined {
		return this._unconfirmedWorkspace || this._confirmedWorkspace;
	}

	getWorkspaceFolders(): vscode.WorkspaceFolder[] | undefined {
		if (!this._actualWorkspace) {
			return undefined;
		}
		return this._actualWorkspace.workspaceFolders.slice(0);
	}

	async getWorkspaceFolders2(): Promise<vscode.WorkspaceFolder[] | undefined> {
		await this._barrier.wait();
		if (!this._actualWorkspace) {
			return undefined;
		}
		return this._actualWorkspace.workspaceFolders.slice(0);
	}

	updateWorkspaceFolders(extension: IExtensionDescription, index: number, deleteCount: number, ...workspaceFoldersToAdd: { uri: vscode.Uri; name?: string }[]): boolean {
		const validatedDistinctWorkspaceFoldersToAdd: { uri: vscode.Uri; name?: string }[] = [];
		if (Array.isArray(workspaceFoldersToAdd)) {
			workspaceFoldersToAdd.forEach(folderToAdd => {
				if (URI.isUri(folderToAdd.uri) && !validatedDistinctWorkspaceFoldersToAdd.some(f => isFolderEqual(f.uri, folderToAdd.uri, this._extHostFileSystemInfo))) {
					validatedDistinctWorkspaceFoldersToAdd.push({ uri: folderToAdd.uri, name: folderToAdd.name || basenameOrAuthority(folderToAdd.uri) });
				}
			});
		}

		if (!!this._unconfirmedWorkspace) {
			return false; // prevent accumulated calls without a confirmed workspace
		}

		if ([index, deleteCount].some(i => typeof i !== 'number' || i < 0)) {
			return false; // validate numbers
		}

		if (deleteCount === 0 && validatedDistinctWorkspaceFoldersToAdd.length === 0) {
			return false; // nothing to delete or add
		}

		const currentWorkspaceFolders: MutableWorkspaceFolder[] = this._actualWorkspace ? this._actualWorkspace.workspaceFolders : [];
		if (index + deleteCount > currentWorkspaceFolders.length) {
			return false; // cannot delete more than we have
		}

		// Simulate the updateWorkspaceFolders method on our data to do more validation
		const newWorkspaceFolders = currentWorkspaceFolders.slice(0);
		newWorkspaceFolders.splice(index, deleteCount, ...validatedDistinctWorkspaceFoldersToAdd.map(f => ({ uri: f.uri, name: f.name || basenameOrAuthority(f.uri), index: undefined! /* fixed later */ })));

		for (let i = 0; i < newWorkspaceFolders.length; i++) {
			const folder = newWorkspaceFolders[i];
			if (newWorkspaceFolders.some((otherFolder, index) => index !== i && isFolderEqual(folder.uri, otherFolder.uri, this._extHostFileSystemInfo))) {
				return false; // cannot add the same folder multiple times
			}
		}

		newWorkspaceFolders.forEach((f, index) => f.index = index); // fix index
		const { added, removed } = delta(currentWorkspaceFolders, newWorkspaceFolders, compareWorkspaceFolderByUriAndNameAndIndex, this._extHostFileSystemInfo);
		if (added.length === 0 && removed.length === 0) {
			return false; // nothing actually changed
		}

		// Trigger on main side
		if (this._proxy) {
			const extName = extension.displayName || extension.name;
			this._proxy.$updateWorkspaceFolders(extName, index, deleteCount, validatedDistinctWorkspaceFoldersToAdd).then(undefined, error => {

				// in case of an error, make sure to clear out the unconfirmed workspace
				// because we cannot expect the acknowledgement from the main side for this
				this._unconfirmedWorkspace = undefined;

				// show error to user
				const options: MainThreadMessageOptions = { source: { identifier: extension.identifier, label: extension.displayName || extension.name } };
				this._messageService.$showMessage(Severity.Error, localize('updateerror', "Extension '{0}' failed to update workspace folders: {1}", extName, error.toString()), options, []);
			});
		}

		// Try to accept directly
		this.trySetWorkspaceFolders(newWorkspaceFolders);

		return true;
	}

	getWorkspaceFolder(uri: vscode.Uri, resolveParent?: boolean): vscode.WorkspaceFolder | undefined {
		if (!this._actualWorkspace) {
			return undefined;
		}
		return this._actualWorkspace.getWorkspaceFolder(uri, resolveParent);
	}

	async getWorkspaceFolder2(uri: vscode.Uri, resolveParent?: boolean): Promise<vscode.WorkspaceFolder | undefined> {
		await this._barrier.wait();
		if (!this._actualWorkspace) {
			return undefined;
		}
		return this._actualWorkspace.getWorkspaceFolder(uri, resolveParent);
	}

	async resolveWorkspaceFolder(uri: vscode.Uri): Promise<vscode.WorkspaceFolder | undefined> {
		await this._barrier.wait();
		if (!this._actualWorkspace) {
			return undefined;
		}
		return this._actualWorkspace.resolveWorkspaceFolder(uri);
	}

	getPath(): string | undefined {

		// this is legacy from the days before having
		// multi-root and we keep it only alive if there
		// is just one workspace folder.
		if (!this._actualWorkspace) {
			return undefined;
		}

		const { folders } = this._actualWorkspace;
		if (folders.length === 0) {
			return undefined;
		}
		// #54483 @Joh Why are we still using fsPath?
		return folders[0].uri.fsPath;
	}

	getRelativePath(pathOrUri: string | vscode.Uri, includeWorkspace?: boolean): string {

		let resource: URI | undefined;
		let path: string = '';
		if (typeof pathOrUri === 'string') {
			resource = URI.file(pathOrUri);
			path = pathOrUri;
		} else if (typeof pathOrUri !== 'undefined') {
			resource = pathOrUri;
			path = pathOrUri.fsPath;
		}

		if (!resource) {
			return path;
		}

		const folder = this.getWorkspaceFolder(
			resource,
			true
		);

		if (!folder) {
			return path;
		}

		if (typeof includeWorkspace === 'undefined' && this._actualWorkspace) {
			includeWorkspace = this._actualWorkspace.folders.length > 1;
		}

		let result = relativePath(folder.uri, resource);
		if (includeWorkspace && folder.name) {
			result = `${folder.name}/${result}`;
		}
		return result!;
	}

	private trySetWorkspaceFolders(folders: vscode.WorkspaceFolder[]): void {

		// Update directly here. The workspace is unconfirmed as long as we did not get an
		// acknowledgement from the main side (via $acceptWorkspaceData)
		if (this._actualWorkspace) {
			this._unconfirmedWorkspace = ExtHostWorkspaceImpl.toExtHostWorkspace({
				id: this._actualWorkspace.id,
				name: this._actualWorkspace.name,
				configuration: this._actualWorkspace.configuration,
				folders,
				isUntitled: this._actualWorkspace.isUntitled
			}, this._actualWorkspace, undefined, this._extHostFileSystemInfo).workspace || undefined;
		}
	}

	$acceptWorkspaceData(data: IWorkspaceData | null): void {

		const { workspace, added, removed } = ExtHostWorkspaceImpl.toExtHostWorkspace(data, this._confirmedWorkspace, this._unconfirmedWorkspace, this._extHostFileSystemInfo);

		// Update our workspace object. We have a confirmed workspace, so we drop our
		// unconfirmed workspace.
		this._confirmedWorkspace = workspace || undefined;
		this._unconfirmedWorkspace = undefined;

		// Events
		this._onDidChangeWorkspace.fire(Object.freeze({
			added,
			removed,
		}));
	}

	// --- search ---

	/**
	 * Note, null/undefined have different and important meanings for "exclude"
	 */
	findFiles(include: vscode.GlobPattern | undefined, exclude: vscode.GlobPattern | null | undefined, maxResults: number | undefined, extensionId: ExtensionIdentifier, token: vscode.CancellationToken = CancellationToken.None): Promise<vscode.Uri[]> {
		this._logService.trace(`extHostWorkspace#findFiles: fileSearch, extension: ${extensionId.value}, entryPoint: findFiles`);

		let excludeString: string = '';
		let useFileExcludes = true;
		if (exclude === null) {
			useFileExcludes = false;
		} else if (exclude !== undefined) {
			if (typeof exclude === 'string') {
				excludeString = exclude;
			} else {
				excludeString = exclude.pattern;
			}
		}

		// todo: consider exclude baseURI if available
		return this._findFilesImpl({ type: 'include', value: include }, {
			exclude: [excludeString],
			maxResults,
			useExcludeSettings: useFileExcludes ? ExcludeSettingOptions.FilesExclude : ExcludeSettingOptions.None,
			useIgnoreFiles: {
				local: false
			}
		}, token);
	}


	findFiles2(filePatterns: readonly vscode.GlobPattern[],
		options: vscode.FindFiles2Options = {},
		extensionId: ExtensionIdentifier,
		token: vscode.CancellationToken = CancellationToken.None): Promise<vscode.Uri[]> {
		this._logService.trace(`extHostWorkspace#findFiles2New: fileSearch, extension: ${extensionId.value}, entryPoint: findFiles2New`);
		return this._findFilesImpl({ type: 'filePatterns', value: filePatterns }, options, token);
	}

	private async _findFilesImpl(
		// the old `findFiles` used `include` to query, but the new `findFiles2` uses `filePattern` to query.
		// `filePattern` is the proper way to handle this, since it takes less precedence than the ignore files.
		query: { readonly type: 'include'; readonly value: vscode.GlobPattern | undefined } | { readonly type: 'filePatterns'; readonly value: readonly vscode.GlobPattern[] },
		options: vscode.FindFiles2Options,
		token: vscode.CancellationToken
	): Promise<vscode.Uri[]> {
		if (token.isCancellationRequested) {
			return Promise.resolve([]);
		}

		const filePatternsToUse = query.type === 'include' ? [query.value] : query.value ?? [];
		if (!Array.isArray(filePatternsToUse)) {
			console.error('Invalid file pattern provided', filePatternsToUse);
			throw new Error(`Invalid file pattern provided ${JSON.stringify(filePatternsToUse)}`);
		}

		const queryOptions: QueryOptions<IFileQueryBuilderOptions>[] = filePatternsToUse.map(filePattern => {

			const excludePatterns = globsToISearchPatternBuilder(options.exclude);

			const fileQueries: IFileQueryBuilderOptions = {
				ignoreSymlinks: typeof options.followSymlinks === 'boolean' ? !options.followSymlinks : undefined,
				disregardIgnoreFiles: typeof options.useIgnoreFiles?.local === 'boolean' ? !options.useIgnoreFiles.local : undefined,
				disregardGlobalIgnoreFiles: typeof options.useIgnoreFiles?.global === 'boolean' ? !options.useIgnoreFiles.global : undefined,
				disregardParentIgnoreFiles: typeof options.useIgnoreFiles?.parent === 'boolean' ? !options.useIgnoreFiles.parent : undefined,
				disregardExcludeSettings: options.useExcludeSettings !== undefined && options.useExcludeSettings === ExcludeSettingOptions.None,
				disregardSearchExcludeSettings: options.useExcludeSettings !== undefined && (options.useExcludeSettings !== ExcludeSettingOptions.SearchAndFilesExclude),
				maxResults: options.maxResults,
				excludePattern: excludePatterns.length > 0 ? excludePatterns : undefined,
				_reason: 'startFileSearch',
				shouldGlobSearch: query.type === 'include' ? undefined : true,
			};

			const parseInclude = parseSearchExcludeInclude(GlobPattern.from(filePattern));
			const folderToUse = parseInclude?.folder;
			if (query.type === 'include') {
				fileQueries.includePattern = parseInclude?.pattern;
			} else {
				fileQueries.filePattern = parseInclude?.pattern;
			}

			return {
				folder: folderToUse,
				options: fileQueries
			};
		});

		return this._findFilesBase(queryOptions, token);
	}

	private async _findFilesBase(
		queryOptions: QueryOptions<IFileQueryBuilderOptions>[] | undefined,
		token: CancellationToken
	): Promise<vscode.Uri[]> {
		const result = await Promise.all(queryOptions?.map(option => this._proxy.$startFileSearch(
			option.folder ?? null,
			option.options,
			token).then(data => Array.isArray(data) ? data.map(d => URI.revive(d)) : [])
		) ?? []);

		const flatResult = result.flat();

		// Dedupe entries in a flat array
		const extUri = new ExtUri(uri => ignorePathCasing(uri, this._extHostFileSystemInfo));
		const uriMap = new Map<string, vscode.Uri>();

		for (const uri of flatResult) {
			const key = extUri.getComparisonKey(uri);
			if (!uriMap.has(key)) {
				uriMap.set(key, uri);
			}
		}

		return Array.from(uriMap.values());
	}

	findTextInFiles2(query: vscode.TextSearchQuery2, options: vscode.FindTextInFilesOptions2 | undefined, extensionId: ExtensionIdentifier, token: vscode.CancellationToken = CancellationToken.None): vscode.FindTextInFilesResponse {
		this._logService.trace(`extHostWorkspace#findTextInFiles2: textSearch, extension: ${extensionId.value}, entryPoint: findTextInFiles2`);


		const getOptions = (include: vscode.GlobPattern | undefined): QueryOptions<ITextQueryBuilderOptions> => {
			if (!options) {
				return {
					folder: undefined,
					options: {}
				};
			}
			const parsedInclude = include ? parseSearchExcludeInclude(GlobPattern.from(include)) : undefined;

			const excludePatterns = options.exclude ? globsToISearchPatternBuilder(options.exclude) : undefined;

			return {
				options: {

					ignoreSymlinks: typeof options.followSymlinks === 'boolean' ? !options.followSymlinks : undefined,
					disregardIgnoreFiles: typeof options.useIgnoreFiles?.local === 'boolean' ? !options.useIgnoreFiles?.local : undefined,
					disregardGlobalIgnoreFiles: typeof options.useIgnoreFiles?.global === 'boolean' ? !options.useIgnoreFiles?.global : undefined,
					disregardParentIgnoreFiles: typeof options.useIgnoreFiles?.parent === 'boolean' ? !options.useIgnoreFiles?.parent : undefined,
					disregardExcludeSettings: options.useExcludeSettings !== undefined && options.useExcludeSettings === ExcludeSettingOptions.None,
					disregardSearchExcludeSettings: options.useExcludeSettings !== undefined && (options.useExcludeSettings !== ExcludeSettingOptions.SearchAndFilesExclude),
					fileEncoding: options.encoding,
					maxResults: options.maxResults,
					previewOptions: options.previewOptions ? {
						matchLines: options.previewOptions?.numMatchLines ?? 100,
						charsPerLine: options.previewOptions?.charsPerLine ?? 10000,
					} : undefined,
					surroundingContext: options.surroundingContext,

					includePattern: parsedInclude?.pattern,
					excludePattern: excludePatterns
				} satisfies ITextQueryBuilderOptions,
				folder: parsedInclude?.folder
			} satisfies QueryOptions<ITextQueryBuilderOptions>;
		};

		const queryOptionsRaw: (QueryOptions<ITextQueryBuilderOptions> | undefined)[] = ((options?.include?.map((include) =>
			getOptions(include)))) ?? [getOptions(undefined)];

		const queryOptions = queryOptionsRaw.filter((queryOps): queryOps is QueryOptions<ITextQueryBuilderOptions> => !!queryOps);

		const disposables = new DisposableStore();
		const progressEmitter = disposables.add(new Emitter<{ result: ITextSearchResult<URI>; uri: URI }>());
		const complete = this.findTextInFilesBase(
			query,
			queryOptions,
			(result, uri) => progressEmitter.fire({ result, uri }),
			token
		);
		const asyncIterable = new AsyncIterableProducer<vscode.TextSearchResult2>(async emitter => {
			disposables.add(progressEmitter.event(e => {
				const result = e.result;
				const uri = e.uri;
				if (resultIsMatch(result)) {
					emitter.emitOne(new TextSearchMatch2(
						uri,
						result.rangeLocations.map((range) => ({
							previewRange: new Range(range.preview.startLineNumber, range.preview.startColumn, range.preview.endLineNumber, range.preview.endColumn),
							sourceRange: new Range(range.source.startLineNumber, range.source.startColumn, range.source.endLineNumber, range.source.endColumn)
						})),
						result.previewText

					));
				} else {
					emitter.emitOne(new TextSearchContext2(
						uri,
						result.text,
						result.lineNumber
					));

				}
			}));
			await complete;
		});

		return {
			results: asyncIterable,
			complete: complete.then((e) => {
				disposables.dispose();
				return {
					limitHit: e?.limitHit ?? false
				};
			}),
		};
	}


	async findTextInFilesBase(query: vscode.TextSearchQuery, queryOptions: QueryOptions<ITextQueryBuilderOptions>[] | undefined, callback: (result: ITextSearchResult<URI>, uri: URI) => void, token: vscode.CancellationToken = CancellationToken.None): Promise<vscode.TextSearchComplete> {
		const requestId = this._requestIdProvider.getNext();

		let isCanceled = false;
		token.onCancellationRequested(_ => {
			isCanceled = true;
		});

		this._activeSearchCallbacks[requestId] = p => {
			if (isCanceled) {
				return;
			}

			const uri = URI.revive(p.resource);
			p.results!.forEach(rawResult => {
				const result: ITextSearchResult<URI> = revive(rawResult);
				callback(result, uri);
			});
		};

		if (token.isCancellationRequested) {
			return {};
		}

		try {
			const result = await Promise.all(queryOptions?.map(option => this._proxy.$startTextSearch(
				query,
				option.folder ?? null,
				option.options,
				requestId,
				token) || {}
			) ?? []);
			delete this._activeSearchCallbacks[requestId];
			return result.reduce((acc, val) => {
				return {
					limitHit: acc?.limitHit || (val?.limitHit ?? false),
					message: [acc?.message ?? [], val?.message ?? []].flat(),
				};
			}, {}) ?? { limitHit: false };

		} catch (err) {
			delete this._activeSearchCallbacks[requestId];
			throw err;
		}
	}

	async findTextInFiles(query: vscode.TextSearchQuery, options: vscode.FindTextInFilesOptions & { useSearchExclude?: boolean }, callback: (result: vscode.TextSearchResult) => void, extensionId: ExtensionIdentifier, token: vscode.CancellationToken = CancellationToken.None): Promise<vscode.TextSearchComplete> {
		this._logService.trace(`extHostWorkspace#findTextInFiles: textSearch, extension: ${extensionId.value}, entryPoint: findTextInFiles`);

		const previewOptions: vscode.TextSearchPreviewOptions = typeof options.previewOptions === 'undefined' ?
			{
				matchLines: 100,
				charsPerLine: 10000
			} :
			options.previewOptions;

		const parsedInclude = parseSearchExcludeInclude(GlobPattern.from(options.include));

		const excludePattern = (typeof options.exclude === 'string') ? options.exclude :
			options.exclude ? options.exclude.pattern : undefined;
		const queryOptions: ITextQueryBuilderOptions = {
			ignoreSymlinks: typeof options.followSymlinks === 'boolean' ? !options.followSymlinks : undefined,
			disregardIgnoreFiles: typeof options.useIgnoreFiles === 'boolean' ? !options.useIgnoreFiles : undefined,
			disregardGlobalIgnoreFiles: typeof options.useGlobalIgnoreFiles === 'boolean' ? !options.useGlobalIgnoreFiles : undefined,
			disregardParentIgnoreFiles: typeof options.useParentIgnoreFiles === 'boolean' ? !options.useParentIgnoreFiles : undefined,
			disregardExcludeSettings: typeof options.useDefaultExcludes === 'boolean' ? !options.useDefaultExcludes : true,
			disregardSearchExcludeSettings: typeof options.useSearchExclude === 'boolean' ? !options.useSearchExclude : true,
			fileEncoding: options.encoding,
			maxResults: options.maxResults,
			previewOptions,
			surroundingContext: options.afterContext, // TODO: remove ability to have before/after context separately

			includePattern: parsedInclude?.pattern,
			excludePattern: excludePattern ? [{ pattern: excludePattern }] : undefined,
		};

		const progress = (result: ITextSearchResult<URI>, uri: URI) => {
			if (resultIsMatch(result)) {
				callback({
					uri,
					preview: {
						text: result.previewText,
						matches: mapArrayOrNot(
							result.rangeLocations,
							m => new Range(m.preview.startLineNumber, m.preview.startColumn, m.preview.endLineNumber, m.preview.endColumn))
					},
					ranges: mapArrayOrNot(
						result.rangeLocations,
						r => new Range(r.source.startLineNumber, r.source.startColumn, r.source.endLineNumber, r.source.endColumn))
				} satisfies vscode.TextSearchMatch);
			} else {
				callback({
					uri,
					text: result.text,
					lineNumber: result.lineNumber
				} satisfies vscode.TextSearchContext);
			}
		};

		return this.findTextInFilesBase(query, [{ options: queryOptions, folder: parsedInclude?.folder }], progress, token);
	}

	$handleTextSearchResult(result: IRawFileMatch2, requestId: number): void {
		this._activeSearchCallbacks[requestId]?.(result);
	}

	async save(uri: URI): Promise<URI | undefined> {
		const result = await this._proxy.$save(uri, { saveAs: false });

		return URI.revive(result);
	}

	async saveAs(uri: URI): Promise<URI | undefined> {
		const result = await this._proxy.$save(uri, { saveAs: true });

		return URI.revive(result);
	}

	saveAll(includeUntitled?: boolean): Promise<boolean> {
		return this._proxy.$saveAll(includeUntitled);
	}

	resolveProxy(url: string): Promise<string | undefined> {
		return this._proxy.$resolveProxy(url);
	}

	lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> {
		return this._proxy.$lookupAuthorization(authInfo);
	}

	lookupKerberosAuthorization(url: string): Promise<string | undefined> {
		return this._proxy.$lookupKerberosAuthorization(url);
	}

	loadCertificates(): Promise<string[]> {
		return this._proxy.$loadCertificates();
	}

	// --- trust ---

	get trusted(): boolean {
		return this._trusted;
	}

	requestWorkspaceTrust(options?: vscode.WorkspaceTrustRequestOptions): Promise<boolean | undefined> {
		return this._proxy.$requestWorkspaceTrust(options);
	}

	$onDidGrantWorkspaceTrust(): void {
		if (!this._trusted) {
			this._trusted = true;
			this._onDidGrantWorkspaceTrust.fire();
		}
	}

	// --- edit sessions ---

	private _providerHandlePool = 0;

	// called by ext host
	registerEditSessionIdentityProvider(scheme: string, provider: vscode.EditSessionIdentityProvider) {
		if (this._editSessionIdentityProviders.has(scheme)) {
			throw new Error(`A provider has already been registered for scheme ${scheme}`);
		}

		this._editSessionIdentityProviders.set(scheme, provider);
		const outgoingScheme = this._uriTransformerService.transformOutgoingScheme(scheme);
		const handle = this._providerHandlePool++;
		this._proxy.$registerEditSessionIdentityProvider(handle, outgoingScheme);

		return toDisposable(() => {
			this._editSessionIdentityProviders.delete(scheme);
			this._proxy.$unregisterEditSessionIdentityProvider(handle);
		});
	}

	// called by main thread
	async $getEditSessionIdentifier(workspaceFolder: UriComponents, cancellationToken: CancellationToken): Promise<string | undefined> {
		this._logService.info('Getting edit session identifier for workspaceFolder', workspaceFolder);
		const folder = await this.resolveWorkspaceFolder(URI.revive(workspaceFolder));
		if (!folder) {
			this._logService.warn('Unable to resolve workspace folder');
			return undefined;
		}

		this._logService.info('Invoking #provideEditSessionIdentity for workspaceFolder', folder);

		const provider = this._editSessionIdentityProviders.get(folder.uri.scheme);
		this._logService.info(`Provider for scheme ${folder.uri.scheme} is defined: `, !!provider);
		if (!provider) {
			return undefined;
		}

		const result = await provider.provideEditSessionIdentity(folder, cancellationToken);
		this._logService.info('Provider returned edit session identifier: ', result);
		if (!result) {
			return undefined;
		}

		return result;
	}

	async $provideEditSessionIdentityMatch(workspaceFolder: UriComponents, identity1: string, identity2: string, cancellationToken: CancellationToken): Promise<EditSessionIdentityMatch | undefined> {
		this._logService.info('Getting edit session identifier for workspaceFolder', workspaceFolder);
		const folder = await this.resolveWorkspaceFolder(URI.revive(workspaceFolder));
		if (!folder) {
			this._logService.warn('Unable to resolve workspace folder');
			return undefined;
		}

		this._logService.info('Invoking #provideEditSessionIdentity for workspaceFolder', folder);

		const provider = this._editSessionIdentityProviders.get(folder.uri.scheme);
		this._logService.info(`Provider for scheme ${folder.uri.scheme} is defined: `, !!provider);
		if (!provider) {
			return undefined;
		}

		const result = await provider.provideEditSessionIdentityMatch?.(identity1, identity2, cancellationToken);
		this._logService.info('Provider returned edit session identifier match result: ', result);
		if (!result) {
			return undefined;
		}

		return result;
	}

	private readonly _onWillCreateEditSessionIdentityEvent = new AsyncEmitter<vscode.EditSessionIdentityWillCreateEvent>();

	getOnWillCreateEditSessionIdentityEvent(extension: IExtensionDescription): Event<vscode.EditSessionIdentityWillCreateEvent> {
		return (listener, thisArg, disposables) => {
			const wrappedListener: IExtensionListener<vscode.EditSessionIdentityWillCreateEvent> = function wrapped(e) { listener.call(thisArg, e); };
			wrappedListener.extension = extension;
			return this._onWillCreateEditSessionIdentityEvent.event(wrappedListener, undefined, disposables);
		};
	}

	// main thread calls this to trigger participants
	async $onWillCreateEditSessionIdentity(workspaceFolder: UriComponents, token: CancellationToken, timeout: number): Promise<void> {
		const folder = await this.resolveWorkspaceFolder(URI.revive(workspaceFolder));

		if (folder === undefined) {
			throw new Error('Unable to resolve workspace folder');
		}

		await this._onWillCreateEditSessionIdentityEvent.fireAsync({ workspaceFolder: folder }, token, async (thenable: Promise<unknown>, listener) => {
			const now = Date.now();
			await Promise.resolve(thenable);
			if (Date.now() - now > timeout) {
				this._logService.warn('SLOW edit session create-participant', (<IExtensionListener<vscode.EditSessionIdentityWillCreateEvent>>listener).extension.identifier);
			}
		});

		if (token.isCancellationRequested) {
			return undefined;
		}
	}

	// --- canonical uri identity ---

	private readonly _canonicalUriProviders = new Map<string, vscode.CanonicalUriProvider>();

	// called by ext host
	registerCanonicalUriProvider(scheme: string, provider: vscode.CanonicalUriProvider) {
		if (this._canonicalUriProviders.has(scheme)) {
			throw new Error(`A provider has already been registered for scheme ${scheme}`);
		}

		this._canonicalUriProviders.set(scheme, provider);
		const outgoingScheme = this._uriTransformerService.transformOutgoingScheme(scheme);
		const handle = this._providerHandlePool++;
		this._proxy.$registerCanonicalUriProvider(handle, outgoingScheme);

		return toDisposable(() => {
			this._canonicalUriProviders.delete(scheme);
			this._proxy.$unregisterCanonicalUriProvider(handle);
		});
	}

	async provideCanonicalUri(uri: URI, options: vscode.CanonicalUriRequestOptions, cancellationToken: CancellationToken): Promise<URI | undefined> {
		const provider = this._canonicalUriProviders.get(uri.scheme);
		if (!provider) {
			return undefined;
		}

		const result = await provider.provideCanonicalUri?.(URI.revive(uri), options, cancellationToken);
		if (!result) {
			return undefined;
		}

		return result;
	}

	// called by main thread
	async $provideCanonicalUri(uri: UriComponents, targetScheme: string, cancellationToken: CancellationToken): Promise<UriComponents | undefined> {
		return this.provideCanonicalUri(URI.revive(uri), { targetScheme }, cancellationToken);
	}

	// --- encodings ---

	async decode(content: Uint8Array, args?: { uri?: vscode.Uri; encoding?: string }): Promise<string> {
		const [uri, opts] = this.toEncodeDecodeParameters(args);
		const options = await this._proxy.$resolveDecoding(uri, opts);

		const stream = (await toDecodeStream(bufferToStream(VSBuffer.wrap(content)), {
			...options,
			acceptTextOnly: true,
			overwriteEncoding: detectedEncoding => {
				if (detectedEncoding === null || detectedEncoding === options.preferredEncoding) {
					// Prevent another roundtrip to the main thread
					// if the detected encoding is null or the same
					// as the preferred encoding
					return Promise.resolve(options.preferredEncoding);
				}

				return this._proxy.$validateDetectedEncoding(uri, detectedEncoding, opts);
			},
		})).stream;

		return consumeStream(stream, chunks => chunks.join(''));
	}

	async encode(content: string, args?: { uri?: vscode.Uri; encoding?: string }): Promise<Uint8Array> {
		const [uri, options] = this.toEncodeDecodeParameters(args);
		const { encoding, addBOM } = await this._proxy.$resolveEncoding(uri, options);

		// when encoding is standard skip encoding step
		if (encoding === UTF8 && !addBOM) {
			return VSBuffer.fromString(content).buffer;
		}

		// otherwise create encoded readable
		const res = await toEncodeReadable(stringToSnapshot(content), encoding, { addBOM });
		return readableToBuffer(res).buffer;
	}

	private toEncodeDecodeParameters(opts?: { uri?: vscode.Uri; encoding?: string }): [UriComponents | undefined, { encoding: string } | undefined] {
		const uri = isUriComponents(opts?.uri) ? opts.uri : undefined;
		const encoding = typeof opts?.encoding === 'string' ? opts.encoding : undefined;

		return [uri, encoding ? { encoding } : undefined];
	}
}

export const IExtHostWorkspace = createDecorator<IExtHostWorkspace>('IExtHostWorkspace');
export interface IExtHostWorkspace extends ExtHostWorkspace, ExtHostWorkspaceShape, IExtHostWorkspaceProvider { }

function parseSearchExcludeInclude(include: string | IRelativePatternDto | undefined | null): { pattern: string; folder?: URI } | undefined {
	let pattern: string | undefined;
	let includeFolder: URI | undefined;
	if (include) {
		if (typeof include === 'string') {
			pattern = include;
		} else {
			pattern = include.pattern;
			includeFolder = URI.revive(include.baseUri);
		}

		return {
			pattern,
			folder: includeFolder
		};
	}
	return undefined;
}

interface IExtensionListener<E> {
	extension: IExtensionDescription;
	(e: E): any;
}

function globsToISearchPatternBuilder(excludes: vscode.GlobPattern[] | undefined): ISearchPatternBuilder<URI>[] {
	return (
		excludes?.map((exclude): ISearchPatternBuilder<URI> | undefined => {
			if (typeof exclude === 'string') {
				if (exclude === '') {
					return undefined;
				}
				return {
					pattern: exclude,
					uri: undefined
				} satisfies ISearchPatternBuilder<URI>;
			} else {
				const parsedExclude = parseSearchExcludeInclude(exclude);
				if (!parsedExclude) {
					return undefined;
				}
				return {
					pattern: parsedExclude.pattern,
					uri: parsedExclude.folder
				} satisfies ISearchPatternBuilder<URI>;
			}
		}) ?? []
	).filter((e): e is ISearchPatternBuilder<URI> => !!e);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/jsonValidationExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/api/common/jsonValidationExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { ExtensionsRegistry } from '../../services/extensions/common/extensionsRegistry.js';
import * as resources from '../../../base/common/resources.js';
import { isString } from '../../../base/common/types.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { Extensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../services/extensionManagement/common/extensionFeatures.js';
import { IExtensionManifest } from '../../../platform/extensions/common/extensions.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { MarkdownString } from '../../../base/common/htmlContent.js';

interface IJSONValidationExtensionPoint {
	fileMatch: string | string[];
	url: string;
}

const configurationExtPoint = ExtensionsRegistry.registerExtensionPoint<IJSONValidationExtensionPoint[]>({
	extensionPoint: 'jsonValidation',
	defaultExtensionKind: ['workspace', 'web'],
	jsonSchema: {
		description: nls.localize('contributes.jsonValidation', 'Contributes json schema configuration.'),
		type: 'array',
		defaultSnippets: [{ body: [{ fileMatch: '${1:file.json}', url: '${2:url}' }] }],
		items: {
			type: 'object',
			defaultSnippets: [{ body: { fileMatch: '${1:file.json}', url: '${2:url}' } }],
			properties: {
				fileMatch: {
					type: ['string', 'array'],
					description: nls.localize('contributes.jsonValidation.fileMatch', 'The file pattern (or an array of patterns) to match, for example "package.json" or "*.launch". Exclusion patterns start with \'!\''),
					items: {
						type: ['string']
					}
				},
				url: {
					description: nls.localize('contributes.jsonValidation.url', 'A schema URL (\'http:\', \'https:\') or relative path to the extension folder (\'./\').'),
					type: 'string'
				}
			}
		}
	}
});

export class JSONValidationExtensionPoint {

	constructor() {
		configurationExtPoint.setHandler((extensions) => {
			for (const extension of extensions) {
				const extensionValue = <IJSONValidationExtensionPoint[]>extension.value;
				const collector = extension.collector;
				const extensionLocation = extension.description.extensionLocation;

				if (!extensionValue || !Array.isArray(extensionValue)) {
					collector.error(nls.localize('invalid.jsonValidation', "'configuration.jsonValidation' must be a array"));
					return;
				}
				extensionValue.forEach(extension => {
					if (!isString(extension.fileMatch) && !(Array.isArray(extension.fileMatch) && extension.fileMatch.every(isString))) {
						collector.error(nls.localize('invalid.fileMatch', "'configuration.jsonValidation.fileMatch' must be defined as a string or an array of strings."));
						return;
					}
					const uri = extension.url;
					if (!isString(uri)) {
						collector.error(nls.localize('invalid.url', "'configuration.jsonValidation.url' must be a URL or relative path"));
						return;
					}
					if (uri.startsWith('./')) {
						try {
							const colorThemeLocation = resources.joinPath(extensionLocation, uri);
							if (!resources.isEqualOrParent(colorThemeLocation, extensionLocation)) {
								collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.url` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", configurationExtPoint.name, colorThemeLocation.toString(), extensionLocation.path));
							}
						} catch (e) {
							collector.error(nls.localize('invalid.url.fileschema', "'configuration.jsonValidation.url' is an invalid relative URL: {0}", e.message));
						}
					} else if (!/^[^:/?#]+:\/\//.test(uri)) {
						collector.error(nls.localize('invalid.url.schema', "'configuration.jsonValidation.url' must be an absolute URL or start with './'  to reference schemas located in the extension."));
						return;
					}
				});
			}
		});
	}

}

class JSONValidationDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.jsonValidation;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const contrib = manifest.contributes?.jsonValidation || [];
		if (!contrib.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			nls.localize('fileMatch', "File Match"),
			nls.localize('schema', "Schema"),
		];

		const rows: IRowData[][] = contrib.map(v => {
			return [
				new MarkdownString().appendMarkdown(`\`${Array.isArray(v.fileMatch) ? v.fileMatch.join(', ') : v.fileMatch}\``),
				v.url,
			];
		});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'jsonValidation',
	label: nls.localize('jsonValidation', "JSON Validation"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(JSONValidationDataRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/codeActionKind.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/codeActionKind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { es5ClassCompat } from './es5ClassCompat.js';

@es5ClassCompat
export class CodeActionKind {
	private static readonly sep = '.';

	public static Empty: CodeActionKind;
	public static QuickFix: CodeActionKind;
	public static Refactor: CodeActionKind;
	public static RefactorExtract: CodeActionKind;
	public static RefactorInline: CodeActionKind;
	public static RefactorMove: CodeActionKind;
	public static RefactorRewrite: CodeActionKind;
	public static Source: CodeActionKind;
	public static SourceOrganizeImports: CodeActionKind;
	public static SourceFixAll: CodeActionKind;
	public static Notebook: CodeActionKind;

	constructor(
		public readonly value: string
	) { }

	public append(parts: string): CodeActionKind {
		return new CodeActionKind(this.value ? this.value + CodeActionKind.sep + parts : parts);
	}

	public intersects(other: CodeActionKind): boolean {
		return this.contains(other) || other.contains(this);
	}

	public contains(other: CodeActionKind): boolean {
		return this.value === other.value || other.value.startsWith(this.value + CodeActionKind.sep);
	}
}
CodeActionKind.Empty = new CodeActionKind('');
CodeActionKind.QuickFix = CodeActionKind.Empty.append('quickfix');
CodeActionKind.Refactor = CodeActionKind.Empty.append('refactor');
CodeActionKind.RefactorExtract = CodeActionKind.Refactor.append('extract');
CodeActionKind.RefactorInline = CodeActionKind.Refactor.append('inline');
CodeActionKind.RefactorMove = CodeActionKind.Refactor.append('move');
CodeActionKind.RefactorRewrite = CodeActionKind.Refactor.append('rewrite');
CodeActionKind.Source = CodeActionKind.Empty.append('source');
CodeActionKind.SourceOrganizeImports = CodeActionKind.Source.append('organizeImports');
CodeActionKind.SourceFixAll = CodeActionKind.Source.append('fixAll');
CodeActionKind.Notebook = CodeActionKind.Empty.append('notebook');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/diagnostic.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/diagnostic.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';
import { URI } from '../../../../base/common/uri.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Location } from './location.js';
import { Range } from './range.js';

export enum DiagnosticTag {
	Unnecessary = 1,
	Deprecated = 2
}

export enum DiagnosticSeverity {
	Hint = 3,
	Information = 2,
	Warning = 1,
	Error = 0
}

@es5ClassCompat
export class DiagnosticRelatedInformation {

	static is(thing: unknown): thing is DiagnosticRelatedInformation {
		if (!thing) {
			return false;
		}
		return typeof (<DiagnosticRelatedInformation>thing).message === 'string'
			&& (<DiagnosticRelatedInformation>thing).location
			&& Range.isRange((<DiagnosticRelatedInformation>thing).location.range)
			&& URI.isUri((<DiagnosticRelatedInformation>thing).location.uri);
	}

	location: Location;
	message: string;

	constructor(location: Location, message: string) {
		this.location = location;
		this.message = message;
	}

	static isEqual(a: DiagnosticRelatedInformation, b: DiagnosticRelatedInformation): boolean {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.message === b.message
			&& a.location.range.isEqual(b.location.range)
			&& a.location.uri.toString() === b.location.uri.toString();
	}
}

@es5ClassCompat
export class Diagnostic {

	range: Range;
	message: string;
	severity: DiagnosticSeverity;
	source?: string;
	code?: string | number;
	relatedInformation?: DiagnosticRelatedInformation[];
	tags?: DiagnosticTag[];

	constructor(range: Range, message: string, severity: DiagnosticSeverity = DiagnosticSeverity.Error) {
		if (!Range.isRange(range)) {
			throw new TypeError('range must be set');
		}
		if (!message) {
			throw new TypeError('message must be set');
		}
		this.range = range;
		this.message = message;
		this.severity = severity;
	}

	toJSON(): { severity: string; message: string; range: Range; source?: string; code?: string | number } {
		return {
			severity: DiagnosticSeverity[this.severity],
			message: this.message,
			range: this.range,
			source: this.source,
			code: this.code,
		};
	}

	static isEqual(a: Diagnostic | undefined, b: Diagnostic | undefined): boolean {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		return a.message === b.message
			&& a.severity === b.severity
			&& a.code === b.code
			&& a.severity === b.severity
			&& a.source === b.source
			&& a.range.isEqual(b.range)
			&& equals(a.tags, b.tags)
			&& equals(a.relatedInformation, b.relatedInformation, DiagnosticRelatedInformation.isEqual);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/es5ClassCompat.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/es5ClassCompat.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @deprecated
 *
 * This utility ensures that old JS code that uses functions for classes still works. Existing usages cannot be removed
 * but new ones must not be added
 */
export function es5ClassCompat(target: Function): any {
	const interceptFunctions = {
		apply: function (...args: any[]): any {
			if (args.length === 0) {
				return Reflect.construct(target, []);
			} else {
				const argsList = args.length === 1 ? [] : args[1];
				return Reflect.construct(target, argsList, args[0].constructor);
			}
		},
		call: function (...args: any[]): any {
			if (args.length === 0) {
				return Reflect.construct(target, []);
			} else {
				const [thisArg, ...restArgs] = args;
				return Reflect.construct(target, restArgs, thisArg.constructor);
			}
		}
	};
	return Object.assign(target, interceptFunctions);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/location.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/location.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { URI } from '../../../../base/common/uri.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Position } from './position.js';
import { Range } from './range.js';

@es5ClassCompat
export class Location {

	static isLocation(thing: unknown): thing is vscode.Location {
		if (thing instanceof Location) {
			return true;
		}
		if (!thing) {
			return false;
		}
		return Range.isRange((<Location>thing).range)
			&& URI.isUri((<Location>thing).uri);
	}

	uri: URI;
	range!: Range;

	constructor(uri: URI, rangeOrPosition: Range | Position) {
		this.uri = uri;

		if (!rangeOrPosition) {
			//that's OK
		} else if (Range.isRange(rangeOrPosition)) {
			this.range = Range.of(rangeOrPosition);
		} else if (Position.isPosition(rangeOrPosition)) {
			this.range = new Range(rangeOrPosition, rangeOrPosition);
		} else {
			throw new Error('Illegal argument');
		}
	}

	toJSON(): any {
		return {
			uri: this.uri,
			range: this.range
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/markdownString.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/markdownString.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import type * as vscode from 'vscode';
import { MarkdownString as BaseMarkdownString, MarkdownStringTrustedOptions } from '../../../../base/common/htmlContent.js';
import { es5ClassCompat } from './es5ClassCompat.js';

@es5ClassCompat
export class MarkdownString implements vscode.MarkdownString {

	readonly #delegate: BaseMarkdownString;

	static isMarkdownString(thing: unknown): thing is vscode.MarkdownString {
		if (thing instanceof MarkdownString) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return (thing as vscode.MarkdownString).appendCodeblock && (thing as vscode.MarkdownString).appendMarkdown && (thing as vscode.MarkdownString).appendText && ((thing as vscode.MarkdownString).value !== undefined);
	}

	constructor(value?: string, supportThemeIcons: boolean = false) {
		this.#delegate = new BaseMarkdownString(value, { supportThemeIcons });
	}

	get value(): string {
		return this.#delegate.value;
	}
	set value(value: string) {
		this.#delegate.value = value;
	}

	get isTrusted(): boolean | MarkdownStringTrustedOptions | undefined {
		return this.#delegate.isTrusted;
	}

	set isTrusted(value: boolean | MarkdownStringTrustedOptions | undefined) {
		this.#delegate.isTrusted = value;
	}

	get supportThemeIcons(): boolean | undefined {
		return this.#delegate.supportThemeIcons;
	}

	set supportThemeIcons(value: boolean | undefined) {
		this.#delegate.supportThemeIcons = value;
	}

	get supportHtml(): boolean | undefined {
		return this.#delegate.supportHtml;
	}

	set supportHtml(value: boolean | undefined) {
		this.#delegate.supportHtml = value;
	}

	get supportAlertSyntax(): boolean | undefined {
		return this.#delegate.supportAlertSyntax;
	}

	set supportAlertSyntax(value: boolean | undefined) {
		this.#delegate.supportAlertSyntax = value;
	}

	get baseUri(): vscode.Uri | undefined {
		return this.#delegate.baseUri;
	}

	set baseUri(value: vscode.Uri | undefined) {
		this.#delegate.baseUri = value;
	}

	appendText(value: string): vscode.MarkdownString {
		this.#delegate.appendText(value);
		return this;
	}

	appendMarkdown(value: string): vscode.MarkdownString {
		this.#delegate.appendMarkdown(value);
		return this;
	}

	appendCodeblock(value: string, language?: string): vscode.MarkdownString {
		this.#delegate.appendCodeblock(language ?? '', value);
		return this;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/notebooks.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/notebooks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { es5ClassCompat } from './es5ClassCompat.js';
import { illegalArgument } from '../../../../base/common/errors.js';
import { Mimes, normalizeMimeType, isTextStreamMime } from '../../../../base/common/mime.js';
import { generateUuid } from '../../../../base/common/uuid.js';

/* eslint-disable local/code-no-native-private */

export enum NotebookCellKind {
	Markup = 1,
	Code = 2
}

export class NotebookRange {
	static isNotebookRange(thing: unknown): thing is vscode.NotebookRange {
		if (thing instanceof NotebookRange) {
			return true;
		}
		if (!thing) {
			return false;
		}
		return typeof (<NotebookRange>thing).start === 'number'
			&& typeof (<NotebookRange>thing).end === 'number';
	}

	private _start: number;
	private _end: number;

	get start() {
		return this._start;
	}

	get end() {
		return this._end;
	}

	get isEmpty(): boolean {
		return this._start === this._end;
	}

	constructor(start: number, end: number) {
		if (start < 0) {
			throw illegalArgument('start must be positive');
		}
		if (end < 0) {
			throw illegalArgument('end must be positive');
		}
		if (start <= end) {
			this._start = start;
			this._end = end;
		} else {
			this._start = end;
			this._end = start;
		}
	}

	with(change: { start?: number; end?: number }): NotebookRange {
		let start = this._start;
		let end = this._end;

		if (change.start !== undefined) {
			start = change.start;
		}
		if (change.end !== undefined) {
			end = change.end;
		}
		if (start === this._start && end === this._end) {
			return this;
		}
		return new NotebookRange(start, end);
	}
}

export class NotebookCellData {

	static validate(data: NotebookCellData): void {
		if (typeof data.kind !== 'number') {
			throw new Error('NotebookCellData MUST have \'kind\' property');
		}
		if (typeof data.value !== 'string') {
			throw new Error('NotebookCellData MUST have \'value\' property');
		}
		if (typeof data.languageId !== 'string') {
			throw new Error('NotebookCellData MUST have \'languageId\' property');
		}
	}

	static isNotebookCellDataArray(value: unknown): value is vscode.NotebookCellData[] {
		return Array.isArray(value) && (<unknown[]>value).every(elem => NotebookCellData.isNotebookCellData(elem));
	}

	static isNotebookCellData(value: unknown): value is vscode.NotebookCellData {
		// return value instanceof NotebookCellData;
		return true;
	}

	kind: NotebookCellKind;
	value: string;
	languageId: string;
	mime?: string;
	outputs?: vscode.NotebookCellOutput[];
	metadata?: Record<string, unknown>;
	executionSummary?: vscode.NotebookCellExecutionSummary;

	constructor(kind: NotebookCellKind, value: string, languageId: string, mime?: string, outputs?: vscode.NotebookCellOutput[], metadata?: Record<string, unknown>, executionSummary?: vscode.NotebookCellExecutionSummary) {
		this.kind = kind;
		this.value = value;
		this.languageId = languageId;
		this.mime = mime;
		this.outputs = outputs ?? [];
		this.metadata = metadata;
		this.executionSummary = executionSummary;

		NotebookCellData.validate(this);
	}
}

export class NotebookData {

	cells: NotebookCellData[];
	metadata?: { [key: string]: unknown };

	constructor(cells: NotebookCellData[]) {
		this.cells = cells;
	}
}

@es5ClassCompat
export class NotebookEdit implements vscode.NotebookEdit {

	static isNotebookCellEdit(thing: unknown): thing is NotebookEdit {
		if (thing instanceof NotebookEdit) {
			return true;
		}
		if (!thing) {
			return false;
		}
		return NotebookRange.isNotebookRange((<NotebookEdit>thing))
			&& Array.isArray((<NotebookEdit>thing).newCells);
	}

	static replaceCells(range: NotebookRange, newCells: NotebookCellData[]): NotebookEdit {
		return new NotebookEdit(range, newCells);
	}

	static insertCells(index: number, newCells: vscode.NotebookCellData[]): vscode.NotebookEdit {
		return new NotebookEdit(new NotebookRange(index, index), newCells);
	}

	static deleteCells(range: NotebookRange): NotebookEdit {
		return new NotebookEdit(range, []);
	}

	static updateCellMetadata(index: number, newMetadata: { [key: string]: unknown }): NotebookEdit {
		const edit = new NotebookEdit(new NotebookRange(index, index), []);
		edit.newCellMetadata = newMetadata;
		return edit;
	}

	static updateNotebookMetadata(newMetadata: { [key: string]: unknown }): NotebookEdit {
		const edit = new NotebookEdit(new NotebookRange(0, 0), []);
		edit.newNotebookMetadata = newMetadata;
		return edit;
	}

	range: NotebookRange;
	newCells: NotebookCellData[];
	newCellMetadata?: { [key: string]: unknown };
	newNotebookMetadata?: { [key: string]: unknown };

	constructor(range: NotebookRange, newCells: NotebookCellData[]) {
		this.range = range;
		this.newCells = newCells;
	}
}

export class NotebookCellOutputItem {

	static isNotebookCellOutputItem(obj: unknown): obj is vscode.NotebookCellOutputItem {
		if (obj instanceof NotebookCellOutputItem) {
			return true;
		}
		if (!obj) {
			return false;
		}
		return typeof (<vscode.NotebookCellOutputItem>obj).mime === 'string'
			&& (<vscode.NotebookCellOutputItem>obj).data instanceof Uint8Array;
	}

	static error(err: Error | { name: string; message?: string; stack?: string }): NotebookCellOutputItem {
		const obj = {
			name: err.name,
			message: err.message,
			stack: err.stack
		};
		return NotebookCellOutputItem.json(obj, 'application/vnd.code.notebook.error');
	}

	static stdout(value: string): NotebookCellOutputItem {
		return NotebookCellOutputItem.text(value, 'application/vnd.code.notebook.stdout');
	}

	static stderr(value: string): NotebookCellOutputItem {
		return NotebookCellOutputItem.text(value, 'application/vnd.code.notebook.stderr');
	}

	static bytes(value: Uint8Array, mime: string = 'application/octet-stream'): NotebookCellOutputItem {
		return new NotebookCellOutputItem(value, mime);
	}

	static #encoder = new TextEncoder();

	static text(value: string, mime: string = Mimes.text): NotebookCellOutputItem {
		const bytes = NotebookCellOutputItem.#encoder.encode(String(value));
		return new NotebookCellOutputItem(bytes, mime);
	}

	static json(value: unknown, mime: string = 'text/x-json'): NotebookCellOutputItem {
		const rawStr = JSON.stringify(value, undefined, '\t');
		return NotebookCellOutputItem.text(rawStr, mime);
	}

	constructor(
		public data: Uint8Array,
		public mime: string
	) {
		const mimeNormalized = normalizeMimeType(mime, true);
		if (!mimeNormalized) {
			throw new Error(`INVALID mime type: ${mime}. Must be in the format "type/subtype[;optionalparameter]"`);
		}
		this.mime = mimeNormalized;
	}
}

export class NotebookCellOutput {

	static isNotebookCellOutput(candidate: unknown): candidate is vscode.NotebookCellOutput {
		if (candidate instanceof NotebookCellOutput) {
			return true;
		}
		if (!candidate || typeof candidate !== 'object') {
			return false;
		}
		return typeof (<NotebookCellOutput>candidate).id === 'string' && Array.isArray((<NotebookCellOutput>candidate).items);
	}

	static ensureUniqueMimeTypes(items: NotebookCellOutputItem[], warn: boolean = false): NotebookCellOutputItem[] {
		const seen = new Set<string>();
		const removeIdx = new Set<number>();
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const normalMime = normalizeMimeType(item.mime);
			// We can have multiple text stream mime types in the same output.
			if (!seen.has(normalMime) || isTextStreamMime(normalMime)) {
				seen.add(normalMime);
				continue;
			}
			// duplicated mime types... first has won
			removeIdx.add(i);
			if (warn) {
				console.warn(`DUPLICATED mime type '${item.mime}' will be dropped`);
			}
		}
		if (removeIdx.size === 0) {
			return items;
		}
		return items.filter((_item, index) => !removeIdx.has(index));
	}

	id: string;
	items: NotebookCellOutputItem[];
	metadata?: Record<string, unknown>;

	constructor(
		items: NotebookCellOutputItem[],
		idOrMetadata?: string | Record<string, unknown>,
		metadata?: Record<string, unknown>
	) {
		this.items = NotebookCellOutput.ensureUniqueMimeTypes(items, true);
		if (typeof idOrMetadata === 'string') {
			this.id = idOrMetadata;
			this.metadata = metadata;
		} else {
			this.id = generateUuid();
			this.metadata = idOrMetadata ?? metadata;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/position.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/position.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { illegalArgument } from '../../../../base/common/errors.js';
import { es5ClassCompat } from './es5ClassCompat.js';

@es5ClassCompat
export class Position {

	static Min(...positions: Position[]): Position {
		if (positions.length === 0) {
			throw new TypeError();
		}
		let result = positions[0];
		for (let i = 1; i < positions.length; i++) {
			const p = positions[i];
			if (p.isBefore(result)) {
				result = p;
			}
		}
		return result;
	}

	static Max(...positions: Position[]): Position {
		if (positions.length === 0) {
			throw new TypeError();
		}
		let result = positions[0];
		for (let i = 1; i < positions.length; i++) {
			const p = positions[i];
			if (p.isAfter(result)) {
				result = p;
			}
		}
		return result;
	}

	static isPosition(other: unknown): other is Position {
		if (!other) {
			return false;
		}
		if (other instanceof Position) {
			return true;
		}
		const { line, character } = <Position>other;
		if (typeof line === 'number' && typeof character === 'number') {
			return true;
		}
		return false;
	}

	static of(obj: vscode.Position): Position {
		if (obj instanceof Position) {
			return obj;
		} else if (this.isPosition(obj)) {
			return new Position(obj.line, obj.character);
		}
		throw new Error('Invalid argument, is NOT a position-like object');
	}

	private _line: number;
	private _character: number;

	get line(): number {
		return this._line;
	}

	get character(): number {
		return this._character;
	}

	constructor(line: number, character: number) {
		if (line < 0) {
			throw illegalArgument('line must be non-negative');
		}
		if (character < 0) {
			throw illegalArgument('character must be non-negative');
		}
		this._line = line;
		this._character = character;
	}

	isBefore(other: Position): boolean {
		if (this._line < other._line) {
			return true;
		}
		if (other._line < this._line) {
			return false;
		}
		return this._character < other._character;
	}

	isBeforeOrEqual(other: Position): boolean {
		if (this._line < other._line) {
			return true;
		}
		if (other._line < this._line) {
			return false;
		}
		return this._character <= other._character;
	}

	isAfter(other: Position): boolean {
		return !this.isBeforeOrEqual(other);
	}

	isAfterOrEqual(other: Position): boolean {
		return !this.isBefore(other);
	}

	isEqual(other: Position): boolean {
		return this._line === other._line && this._character === other._character;
	}

	compareTo(other: Position): number {
		if (this._line < other._line) {
			return -1;
		} else if (this._line > other.line) {
			return 1;
		} else {
			// equal line
			if (this._character < other._character) {
				return -1;
			} else if (this._character > other._character) {
				return 1;
			} else {
				// equal line and character
				return 0;
			}
		}
	}

	translate(change: { lineDelta?: number; characterDelta?: number }): Position;
	translate(lineDelta?: number, characterDelta?: number): Position;
	translate(lineDeltaOrChange: number | undefined | { lineDelta?: number; characterDelta?: number }, characterDelta: number = 0): Position {

		if (lineDeltaOrChange === null || characterDelta === null) {
			throw illegalArgument();
		}

		let lineDelta: number;
		if (typeof lineDeltaOrChange === 'undefined') {
			lineDelta = 0;
		} else if (typeof lineDeltaOrChange === 'number') {
			lineDelta = lineDeltaOrChange;
		} else {
			lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
			characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
		}

		if (lineDelta === 0 && characterDelta === 0) {
			return this;
		}
		return new Position(this.line + lineDelta, this.character + characterDelta);
	}

	with(change: { line?: number; character?: number }): Position;
	with(line?: number, character?: number): Position;
	with(lineOrChange: number | undefined | { line?: number; character?: number }, character: number = this.character): Position {

		if (lineOrChange === null || character === null) {
			throw illegalArgument();
		}

		let line: number;
		if (typeof lineOrChange === 'undefined') {
			line = this.line;

		} else if (typeof lineOrChange === 'number') {
			line = lineOrChange;

		} else {
			line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
			character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
		}

		if (line === this.line && character === this.character) {
			return this;
		}
		return new Position(line, character);
	}

	toJSON(): { line: number; character: number } {
		return { line: this.line, character: this.character };
	}

	[Symbol.for('debug.description')]() {
		return `(${this.line}:${this.character})`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/range.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/range.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { illegalArgument } from '../../../../base/common/errors.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Position } from './position.js';

@es5ClassCompat
export class Range {

	static isRange(thing: unknown): thing is vscode.Range {
		if (thing instanceof Range) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return Position.isPosition((<Range>thing).start)
			&& Position.isPosition((<Range>thing).end);
	}

	static of(obj: vscode.Range): Range {
		if (obj instanceof Range) {
			return obj;
		}
		if (this.isRange(obj)) {
			return new Range(obj.start, obj.end);
		}
		throw new Error('Invalid argument, is NOT a range-like object');
	}

	protected _start: Position;
	protected _end: Position;

	get start(): Position {
		return this._start;
	}

	get end(): Position {
		return this._end;
	}

	constructor(start: vscode.Position, end: vscode.Position);
	constructor(start: Position, end: Position);
	constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
	constructor(startLineOrStart: number | Position | vscode.Position, startColumnOrEnd: number | Position | vscode.Position, endLine?: number, endColumn?: number) {
		let start: Position | undefined;
		let end: Position | undefined;

		if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
			start = new Position(startLineOrStart, startColumnOrEnd);
			end = new Position(endLine, endColumn);
		} else if (Position.isPosition(startLineOrStart) && Position.isPosition(startColumnOrEnd)) {
			start = Position.of(startLineOrStart);
			end = Position.of(startColumnOrEnd);
		}

		if (!start || !end) {
			throw new Error('Invalid arguments');
		}

		if (start.isBefore(end)) {
			this._start = start;
			this._end = end;
		} else {
			this._start = end;
			this._end = start;
		}
	}

	contains(positionOrRange: Position | Range): boolean {
		if (Range.isRange(positionOrRange)) {
			return this.contains(positionOrRange.start)
				&& this.contains(positionOrRange.end);

		} else if (Position.isPosition(positionOrRange)) {
			if (Position.of(positionOrRange).isBefore(this._start)) {
				return false;
			}
			if (this._end.isBefore(positionOrRange)) {
				return false;
			}
			return true;
		}
		return false;
	}

	isEqual(other: Range): boolean {
		return this._start.isEqual(other._start) && this._end.isEqual(other._end);
	}

	intersection(other: Range): Range | undefined {
		const start = Position.Max(other.start, this._start);
		const end = Position.Min(other.end, this._end);
		if (start.isAfter(end)) {
			// this happens when there is no overlap:
			// |-----|
			//          |----|
			return undefined;
		}
		return new Range(start, end);
	}

	union(other: Range): Range {
		if (this.contains(other)) {
			return this;
		} else if (other.contains(this)) {
			return other;
		}
		const start = Position.Min(other.start, this._start);
		const end = Position.Max(other.end, this.end);
		return new Range(start, end);
	}

	get isEmpty(): boolean {
		return this._start.isEqual(this._end);
	}

	get isSingleLine(): boolean {
		return this._start.line === this._end.line;
	}

	with(change: { start?: Position; end?: Position }): Range;
	with(start?: Position, end?: Position): Range;
	with(startOrChange: Position | undefined | { start?: Position; end?: Position }, end: Position = this.end): Range {

		if (startOrChange === null || end === null) {
			throw illegalArgument();
		}

		let start: Position;
		if (!startOrChange) {
			start = this.start;

		} else if (Position.isPosition(startOrChange)) {
			start = startOrChange;

		} else {
			start = startOrChange.start || this.start;
			end = startOrChange.end || this.end;
		}

		if (start.isEqual(this._start) && end.isEqual(this.end)) {
			return this;
		}
		return new Range(start, end);
	}

	toJSON(): unknown {
		return [this.start, this.end];
	}

	[Symbol.for('debug.description')]() {
		return getDebugDescriptionOfRange(this);
	}
}

export function getDebugDescriptionOfRange(range: vscode.Range): string {
	return range.isEmpty
		? `[${range.start.line}:${range.start.character})`
		: `[${range.start.line}:${range.start.character} -> ${range.end.line}:${range.end.character})`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/selection.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/selection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Position } from './position.js';
import { getDebugDescriptionOfRange, Range } from './range.js';

@es5ClassCompat
export class Selection extends Range {

	static isSelection(thing: unknown): thing is Selection {
		if (thing instanceof Selection) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return Range.isRange(thing)
			&& Position.isPosition((<Selection>thing).anchor)
			&& Position.isPosition((<Selection>thing).active)
			&& typeof (<Selection>thing).isReversed === 'boolean';
	}

	private _anchor: Position;

	public get anchor(): Position {
		return this._anchor;
	}

	private _active: Position;

	public get active(): Position {
		return this._active;
	}

	constructor(anchor: Position, active: Position);
	constructor(anchorLine: number, anchorColumn: number, activeLine: number, activeColumn: number);
	constructor(anchorLineOrAnchor: number | Position, anchorColumnOrActive: number | Position, activeLine?: number, activeColumn?: number) {
		let anchor: Position | undefined;
		let active: Position | undefined;

		if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
			anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
			active = new Position(activeLine, activeColumn);
		} else if (Position.isPosition(anchorLineOrAnchor) && Position.isPosition(anchorColumnOrActive)) {
			anchor = Position.of(anchorLineOrAnchor);
			active = Position.of(anchorColumnOrActive);
		}

		if (!anchor || !active) {
			throw new Error('Invalid arguments');
		}

		super(anchor, active);

		this._anchor = anchor;
		this._active = active;
	}

	get isReversed(): boolean {
		return this._anchor === this._end;
	}

	override toJSON() {
		return {
			start: this.start,
			end: this.end,
			active: this.active,
			anchor: this.anchor
		};
	}


	[Symbol.for('debug.description')]() {
		return getDebugDescriptionOfSelection(this);
	}
}

export function getDebugDescriptionOfSelection(selection: vscode.Selection): string {
	let rangeStr = getDebugDescriptionOfRange(selection);
	if (!selection.isEmpty) {
		if (selection.active.isEqual(selection.start)) {
			rangeStr = `|${rangeStr}`;
		} else {
			rangeStr = `${rangeStr}|`;
		}
	}
	return rangeStr;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/snippetString.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/snippetString.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { es5ClassCompat } from './es5ClassCompat.js';

@es5ClassCompat
export class SnippetString {

	static isSnippetString(thing: unknown): thing is SnippetString {
		if (thing instanceof SnippetString) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return typeof (<SnippetString>thing).value === 'string';
	}

	private static _escape(value: string): string {
		return value.replace(/\$|}|\\/g, '\\$&');
	}

	private _tabstop: number = 1;

	value: string;

	constructor(value?: string) {
		this.value = value || '';
	}

	appendText(string: string): SnippetString {
		this.value += SnippetString._escape(string);
		return this;
	}

	appendTabstop(number: number = this._tabstop++): SnippetString {
		this.value += '$';
		this.value += number;
		return this;
	}

	appendPlaceholder(value: string | ((snippet: SnippetString) => unknown), number: number = this._tabstop++): SnippetString {

		if (typeof value === 'function') {
			const nested = new SnippetString();
			nested._tabstop = this._tabstop;
			value(nested);
			this._tabstop = nested._tabstop;
			value = nested.value;
		} else {
			value = SnippetString._escape(value);
		}

		this.value += '${';
		this.value += number;
		this.value += ':';
		this.value += value;
		this.value += '}';

		return this;
	}

	appendChoice(values: string[], number: number = this._tabstop++): SnippetString {
		const value = values.map(s => s.replaceAll(/[|\\,]/g, '\\$&')).join(',');

		this.value += '${';
		this.value += number;
		this.value += '|';
		this.value += value;
		this.value += '|}';

		return this;
	}

	appendVariable(name: string, defaultValue?: string | ((snippet: SnippetString) => unknown)): SnippetString {

		if (typeof defaultValue === 'function') {
			const nested = new SnippetString();
			nested._tabstop = this._tabstop;
			defaultValue(nested);
			this._tabstop = nested._tabstop;
			defaultValue = nested.value;

		} else if (typeof defaultValue === 'string') {
			defaultValue = defaultValue.replace(/\$|}/g, '\\$&'); // CodeQL [SM02383] I do not want to escape backslashes here
		}

		this.value += '${';
		this.value += name;
		if (defaultValue) {
			this.value += ':';
			this.value += defaultValue;
		}
		this.value += '}';


		return this;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/snippetTextEdit.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/snippetTextEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { SnippetString } from './snippetString.js';
import { Position } from './position.js';
import { Range } from './range.js';

export class SnippetTextEdit implements vscode.SnippetTextEdit {

	static isSnippetTextEdit(thing: unknown): thing is SnippetTextEdit {
		if (thing instanceof SnippetTextEdit) {
			return true;
		}
		if (!thing) {
			return false;
		}
		return Range.isRange((<SnippetTextEdit>thing).range)
			&& SnippetString.isSnippetString((<SnippetTextEdit>thing).snippet);
	}

	static replace(range: Range, snippet: SnippetString): SnippetTextEdit {
		return new SnippetTextEdit(range, snippet);
	}

	static insert(position: Position, snippet: SnippetString): SnippetTextEdit {
		return SnippetTextEdit.replace(new Range(position, position), snippet);
	}

	range: Range;

	snippet: SnippetString;

	keepWhitespace?: boolean;

	constructor(range: Range, snippet: SnippetString) {
		this.range = range;
		this.snippet = snippet;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/symbolInformation.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/symbolInformation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Location } from './location.js';
import { Range } from './range.js';

export enum SymbolKind {
	File = 0,
	Module = 1,
	Namespace = 2,
	Package = 3,
	Class = 4,
	Method = 5,
	Property = 6,
	Field = 7,
	Constructor = 8,
	Enum = 9,
	Interface = 10,
	Function = 11,
	Variable = 12,
	Constant = 13,
	String = 14,
	Number = 15,
	Boolean = 16,
	Array = 17,
	Object = 18,
	Key = 19,
	Null = 20,
	EnumMember = 21,
	Struct = 22,
	Event = 23,
	Operator = 24,
	TypeParameter = 25
}

export enum SymbolTag {
	Deprecated = 1
}

@es5ClassCompat
export class SymbolInformation {

	static validate(candidate: SymbolInformation): void {
		if (!candidate.name) {
			throw new Error('name must not be falsy');
		}
	}

	name: string;
	location!: Location;
	kind: SymbolKind;
	tags?: SymbolTag[];
	containerName: string | undefined;

	constructor(name: string, kind: SymbolKind, containerName: string | undefined, location: Location);
	constructor(name: string, kind: SymbolKind, range: Range, uri?: URI, containerName?: string);
	constructor(name: string, kind: SymbolKind, rangeOrContainer: string | undefined | Range, locationOrUri?: Location | URI, containerName?: string) {
		this.name = name;
		this.kind = kind;
		this.containerName = containerName;

		if (typeof rangeOrContainer === 'string') {
			this.containerName = rangeOrContainer;
		}

		if (locationOrUri instanceof Location) {
			this.location = locationOrUri;
		} else if (rangeOrContainer instanceof Range) {
			this.location = new Location(locationOrUri!, rangeOrContainer);
		}

		SymbolInformation.validate(this);
	}

	toJSON(): { name: string; kind: string; location: Location; containerName: string | undefined } {
		return {
			name: this.name,
			kind: SymbolKind[this.kind],
			location: this.location,
			containerName: this.containerName
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/textEdit.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/textEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from '../../../../base/common/errors.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Position } from './position.js';
import { Range } from './range.js';

export enum EndOfLine {
	LF = 1,
	CRLF = 2
}

@es5ClassCompat
export class TextEdit {

	static isTextEdit(thing: unknown): thing is TextEdit {
		if (thing instanceof TextEdit) {
			return true;
		}
		if (!thing || typeof thing !== 'object') {
			return false;
		}
		return Range.isRange((<TextEdit>thing))
			&& typeof (<TextEdit>thing).newText === 'string';
	}

	static replace(range: Range, newText: string): TextEdit {
		return new TextEdit(range, newText);
	}

	static insert(position: Position, newText: string): TextEdit {
		return TextEdit.replace(new Range(position, position), newText);
	}

	static delete(range: Range): TextEdit {
		return TextEdit.replace(range, '');
	}

	static setEndOfLine(eol: EndOfLine): TextEdit {
		const ret = new TextEdit(new Range(new Position(0, 0), new Position(0, 0)), '');
		ret.newEol = eol;
		return ret;
	}

	protected _range: Range;
	protected _newText: string | null;
	protected _newEol?: EndOfLine;

	get range(): Range {
		return this._range;
	}

	set range(value: Range) {
		if (value && !Range.isRange(value)) {
			throw illegalArgument('range');
		}
		this._range = value;
	}

	get newText(): string {
		return this._newText || '';
	}

	set newText(value: string) {
		if (value && typeof value !== 'string') {
			throw illegalArgument('newText');
		}
		this._newText = value;
	}

	get newEol(): EndOfLine | undefined {
		return this._newEol;
	}

	set newEol(value: EndOfLine | undefined) {
		if (value && typeof value !== 'number') {
			throw illegalArgument('newEol');
		}
		this._newEol = value;
	}

	constructor(range: Range, newText: string | null) {
		this._range = range;
		this._newText = newText;
	}

	toJSON(): { range: Range; newText: string; newEol: EndOfLine | undefined } {
		return {
			range: this.range,
			newText: this.newText,
			newEol: this._newEol
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostTypes/workspaceEdit.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostTypes/workspaceEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { coalesceInPlace } from '../../../../base/common/arrays.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { CellEditType, ICellMetadataEdit, IDocumentMetadataEdit } from '../../../contrib/notebook/common/notebookCommon.js';
import { NotebookEdit } from './notebooks.js';
import { SnippetTextEdit } from './snippetTextEdit.js';
import { es5ClassCompat } from './es5ClassCompat.js';
import { Position } from './position.js';
import { Range } from './range.js';
import { TextEdit } from './textEdit.js';

export interface IFileOperationOptions {
	readonly overwrite?: boolean;
	readonly ignoreIfExists?: boolean;
	readonly ignoreIfNotExists?: boolean;
	readonly recursive?: boolean;
	readonly contents?: Uint8Array | vscode.DataTransferFile;
}

export const enum FileEditType {
	File = 1,
	Text = 2,
	Cell = 3,
	CellReplace = 5,
	Snippet = 6,
}

export interface IFileOperation {
	readonly _type: FileEditType.File;
	readonly from?: URI;
	readonly to?: URI;
	readonly options?: IFileOperationOptions;
	readonly metadata?: vscode.WorkspaceEditEntryMetadata;
}

export interface IFileTextEdit {
	readonly _type: FileEditType.Text;
	readonly uri: URI;
	readonly edit: TextEdit;
	readonly metadata?: vscode.WorkspaceEditEntryMetadata;
}

export interface IFileSnippetTextEdit {
	readonly _type: FileEditType.Snippet;
	readonly uri: URI;
	readonly range: vscode.Range;
	readonly edit: vscode.SnippetString;
	readonly metadata?: vscode.WorkspaceEditEntryMetadata;
	readonly keepWhitespace?: boolean;
}

export interface IFileCellEdit {
	readonly _type: FileEditType.Cell;
	readonly uri: URI;
	readonly edit?: ICellMetadataEdit | IDocumentMetadataEdit;
	readonly metadata?: vscode.WorkspaceEditEntryMetadata;
}

export interface ICellEdit {
	readonly _type: FileEditType.CellReplace;
	readonly metadata?: vscode.WorkspaceEditEntryMetadata;
	readonly uri: URI;
	readonly index: number;
	readonly count: number;
	readonly cells: vscode.NotebookCellData[];
}

export type WorkspaceEditEntry = IFileOperation | IFileTextEdit | IFileSnippetTextEdit | IFileCellEdit | ICellEdit;

@es5ClassCompat
export class WorkspaceEdit implements vscode.WorkspaceEdit {

	private readonly _edits: WorkspaceEditEntry[] = [];


	_allEntries(): ReadonlyArray<WorkspaceEditEntry> {
		return this._edits;
	}

	// --- file
	renameFile(from: vscode.Uri, to: vscode.Uri, options?: { readonly overwrite?: boolean; readonly ignoreIfExists?: boolean }, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.File, from, to, options, metadata });
	}

	createFile(uri: vscode.Uri, options?: { readonly overwrite?: boolean; readonly ignoreIfExists?: boolean; readonly contents?: Uint8Array | vscode.DataTransferFile }, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.File, from: undefined, to: uri, options, metadata });
	}

	deleteFile(uri: vscode.Uri, options?: { readonly recursive?: boolean; readonly ignoreIfNotExists?: boolean }, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.File, from: uri, to: undefined, options, metadata });
	}

	// --- notebook
	private replaceNotebookMetadata(uri: URI, value: Record<string, unknown>, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.Cell, metadata, uri, edit: { editType: CellEditType.DocumentMetadata, metadata: value } });
	}

	private replaceNotebookCells(uri: URI, startOrRange: vscode.NotebookRange, cellData: vscode.NotebookCellData[], metadata?: vscode.WorkspaceEditEntryMetadata): void {
		const start = startOrRange.start;
		const end = startOrRange.end;

		if (start !== end || cellData.length > 0) {
			this._edits.push({ _type: FileEditType.CellReplace, uri, index: start, count: end - start, cells: cellData, metadata });
		}
	}

	private replaceNotebookCellMetadata(uri: URI, index: number, cellMetadata: Record<string, unknown>, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.Cell, metadata, uri, edit: { editType: CellEditType.Metadata, index, metadata: cellMetadata } });
	}

	// --- text
	replace(uri: URI, range: Range, newText: string, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this._edits.push({ _type: FileEditType.Text, uri, edit: new TextEdit(range, newText), metadata });
	}

	insert(resource: URI, position: Position, newText: string, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this.replace(resource, new Range(position, position), newText, metadata);
	}

	delete(resource: URI, range: Range, metadata?: vscode.WorkspaceEditEntryMetadata): void {
		this.replace(resource, range, '', metadata);
	}

	// --- text (Maplike)
	has(uri: URI): boolean {
		return this._edits.some(edit => edit._type === FileEditType.Text && edit.uri.toString() === uri.toString());
	}

	set(uri: URI, edits: ReadonlyArray<TextEdit | SnippetTextEdit>): void;
	set(uri: URI, edits: ReadonlyArray<[TextEdit | SnippetTextEdit, vscode.WorkspaceEditEntryMetadata | undefined]>): void;
	set(uri: URI, edits: readonly NotebookEdit[]): void;
	set(uri: URI, edits: ReadonlyArray<[NotebookEdit, vscode.WorkspaceEditEntryMetadata | undefined]>): void;

	set(uri: URI, edits: null | undefined | ReadonlyArray<TextEdit | SnippetTextEdit | NotebookEdit | [NotebookEdit, vscode.WorkspaceEditEntryMetadata | undefined] | [TextEdit | SnippetTextEdit, vscode.WorkspaceEditEntryMetadata | undefined]>): void {
		if (!edits) {
			// remove all text, snippet, or notebook edits for `uri`
			for (let i = 0; i < this._edits.length; i++) {
				const element = this._edits[i];
				switch (element._type) {
					case FileEditType.Text:
					case FileEditType.Snippet:
					case FileEditType.Cell:
					case FileEditType.CellReplace:
						if (element.uri.toString() === uri.toString()) {
							this._edits[i] = undefined!; // will be coalesced down below
						}
						break;
				}
			}
			coalesceInPlace(this._edits);
		} else {
			// append edit to the end
			for (const editOrTuple of edits) {
				if (!editOrTuple) {
					continue;
				}
				let edit: TextEdit | SnippetTextEdit | NotebookEdit;
				let metadata: vscode.WorkspaceEditEntryMetadata | undefined;
				if (Array.isArray(editOrTuple)) {
					edit = editOrTuple[0];
					metadata = editOrTuple[1];
				} else {
					edit = editOrTuple;
				}
				if (NotebookEdit.isNotebookCellEdit(edit)) {
					if (edit.newCellMetadata) {
						this.replaceNotebookCellMetadata(uri, edit.range.start, edit.newCellMetadata, metadata);
					} else if (edit.newNotebookMetadata) {
						this.replaceNotebookMetadata(uri, edit.newNotebookMetadata, metadata);
					} else {
						this.replaceNotebookCells(uri, edit.range, edit.newCells, metadata);
					}
				} else if (SnippetTextEdit.isSnippetTextEdit(edit)) {
					this._edits.push({ _type: FileEditType.Snippet, uri, range: edit.range, edit: edit.snippet, metadata, keepWhitespace: edit.keepWhitespace });

				} else {
					this._edits.push({ _type: FileEditType.Text, uri, edit, metadata });
				}
			}
		}
	}

	get(uri: URI): TextEdit[] {
		const res: TextEdit[] = [];
		for (const candidate of this._edits) {
			if (candidate._type === FileEditType.Text && candidate.uri.toString() === uri.toString()) {
				res.push(candidate.edit);
			}
		}
		return res;
	}

	entries(): [URI, TextEdit[]][] {
		const textEdits = new ResourceMap<[URI, TextEdit[]]>();
		for (const candidate of this._edits) {
			if (candidate._type === FileEditType.Text) {
				let textEdit = textEdits.get(candidate.uri);
				if (!textEdit) {
					textEdit = [candidate.uri, []];
					textEdits.set(candidate.uri, textEdit);
				}
				textEdit[1].push(candidate.edit);
			}
		}
		return [...textEdits.values()];
	}

	get size(): number {
		return this.entries().length;
	}

	toJSON(): [URI, TextEdit[]][] {
		return this.entries();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/shared/dataTransferCache.ts]---
Location: vscode-main/src/vs/workbench/api/common/shared/dataTransferCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../base/common/arrays.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { IDataTransferFile, IReadonlyVSDataTransfer } from '../../../../base/common/dataTransfer.js';

export class DataTransferFileCache {

	private requestIdPool = 0;
	private readonly dataTransferFiles = new Map</* requestId */ number, ReadonlyArray<IDataTransferFile>>();

	public add(dataTransfer: IReadonlyVSDataTransfer): { id: number; dispose: () => void } {
		const requestId = this.requestIdPool++;
		this.dataTransferFiles.set(requestId, coalesce(Array.from(dataTransfer, ([, item]) => item.asFile())));
		return {
			id: requestId,
			dispose: () => {
				this.dataTransferFiles.delete(requestId);
			}
		};
	}

	async resolveFileData(requestId: number, dataItemId: string): Promise<VSBuffer> {
		const files = this.dataTransferFiles.get(requestId);
		if (!files) {
			throw new Error('No data transfer found');
		}

		const file = files.find(file => file.id === dataItemId);
		if (!file) {
			throw new Error('No matching file found in data transfer');
		}

		return VSBuffer.wrap(await file.data());
	}

	dispose() {
		this.dataTransferFiles.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/shared/tasks.ts]---
Location: vscode-main/src/vs/workbench/api/common/shared/tasks.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../../base/common/uri.js';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import type { Dto } from '../../../services/extensions/common/proxyIdentifier.js';
import { ITaskExecution } from '../../../contrib/tasks/common/tasks.js';

export interface ITaskDefinitionDTO {
	type: string;
	[name: string]: any;
}

export interface ITaskPresentationOptionsDTO {
	reveal?: number;
	echo?: boolean;
	focus?: boolean;
	panel?: number;
	showReuseMessage?: boolean;
	clear?: boolean;
	group?: string;
	close?: boolean;
}

export interface IRunOptionsDTO {
	reevaluateOnRerun?: boolean;
}

export interface IExecutionOptionsDTO {
	cwd?: string;
	env?: { [key: string]: string };
}

export interface IProcessExecutionOptionsDTO extends IExecutionOptionsDTO {
}

export interface IProcessExecutionDTO {
	process: string;
	args: string[];
	options?: IProcessExecutionOptionsDTO;
}

export interface IShellQuotingOptionsDTO {
	escape?: string | {
		escapeChar: string;
		charsToEscape: string;
	};
	strong?: string;
	weak?: string;
}

export enum TaskEventKind {
	/** Indicates that a task's properties or configuration have changed */
	Changed = 'changed',

	/** Indicates that a task has begun executing */
	ProcessStarted = 'processStarted',

	/** Indicates that a task process has completed */
	ProcessEnded = 'processEnded',

	/** Indicates that a task was terminated, either by user action or by the system */
	Terminated = 'terminated',

	/** Indicates that a task has started running */
	Start = 'start',

	/** Indicates that a task has acquired all needed input/variables to execute */
	AcquiredInput = 'acquiredInput',

	/** Indicates that a dependent task has started */
	DependsOnStarted = 'dependsOnStarted',

	/** Indicates that a task is actively running/processing */
	Active = 'active',

	/** Indicates that a task is paused/waiting but not complete */
	Inactive = 'inactive',

	/** Indicates that a task has completed fully */
	End = 'end',

	/** Indicates that a task's problem matcher has started */
	ProblemMatcherStarted = 'problemMatcherStarted',

	/** Indicates that a task's problem matcher has ended */
	ProblemMatcherEnded = 'problemMatcherEnded',

	/** Indicates that a task's problem matcher has found errors */
	ProblemMatcherFoundErrors = 'problemMatcherFoundErrors'
}

export interface IShellExecutionOptionsDTO extends IExecutionOptionsDTO {
	executable?: string;
	shellArgs?: string[];
	shellQuoting?: IShellQuotingOptionsDTO;
}

export interface IShellQuotedStringDTO {
	value: string;
	quoting: number;
}

export interface IShellExecutionDTO {
	commandLine?: string;
	command?: string | IShellQuotedStringDTO;
	args?: Array<string | IShellQuotedStringDTO>;
	options?: IShellExecutionOptionsDTO;
}

export interface ICustomExecutionDTO {
	customExecution: 'customExecution';
}

export interface ITaskSourceDTO {
	label: string;
	extensionId?: string;
	scope?: number | UriComponents;
	color?: string;
	icon?: string;
	hide?: boolean;
}

export interface ITaskHandleDTO {
	id: string;
	workspaceFolder: UriComponents | string;
}

export interface ITaskGroupDTO {
	isDefault?: boolean;
	_id: string;
}

export interface ITaskDTO {
	_id: string;
	name?: string;
	execution: IProcessExecutionDTO | IShellExecutionDTO | ICustomExecutionDTO | undefined;
	definition: ITaskDefinitionDTO;
	isBackground?: boolean;
	source: ITaskSourceDTO;
	group?: ITaskGroupDTO;
	detail?: string;
	presentationOptions?: ITaskPresentationOptionsDTO;
	problemMatchers: string[];
	hasDefinedMatchers: boolean;
	runOptions?: IRunOptionsDTO;
}

export interface ITaskSetDTO {
	tasks: ITaskDTO[];
	extension: Dto<IExtensionDescription>;
}

export interface ITaskExecutionDTO {
	id: string;
	task: ITaskDTO | undefined;
}

export interface ITaskProcessStartedDTO {
	id: string;
	processId: number;
}

export interface ITaskProcessEndedDTO {
	id: string;
	exitCode: number | undefined;
}


export interface ITaskFilterDTO {
	version?: string;
	type?: string;
}

export interface ITaskSystemInfoDTO {
	scheme: string;
	authority: string;
	platform: string;
}

export interface ITaskProblemMatcherStarted {
	execution: ITaskExecution;
}

export interface ITaskProblemMatcherStartedDto {
	execution: ITaskExecutionDTO;
}

export interface ITaskProblemMatcherEnded {
	execution: ITaskExecution;
	hasErrors: boolean;
}

export interface ITaskProblemMatcherEndedDto {
	execution: ITaskExecutionDTO;
	hasErrors: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extensionHostProcess.ts]---
Location: vscode-main/src/vs/workbench/api/node/extensionHostProcess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import minimist from 'minimist';
import * as nativeWatchdog from 'native-watchdog';
import * as net from 'net';
import { ProcessTimeRunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { PendingMigrationError, isCancellationError, isSigPipeError, onUnexpectedError, onUnexpectedExternalError } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import * as performance from '../../../base/common/performance.js';
import { IURITransformer } from '../../../base/common/uriIpc.js';
import { Promises } from '../../../base/node/pfs.js';
import { IMessagePassingProtocol } from '../../../base/parts/ipc/common/ipc.js';
import { BufferedEmitter, PersistentProtocol, ProtocolConstants } from '../../../base/parts/ipc/common/ipc.net.js';
import { NodeSocket, WebSocketNodeSocket } from '../../../base/parts/ipc/node/ipc.net.js';
import type { MessagePortMain, MessageEvent as UtilityMessageEvent } from '../../../base/parts/sandbox/node/electronTypes.js';
import { boolean } from '../../../editor/common/config/editorOptions.js';
import product from '../../../platform/product/common/product.js';
import { ExtensionHostMain, IExitFn } from '../common/extensionHostMain.js';
import { IHostUtils } from '../common/extHostExtensionService.js';
import { createURITransformer } from '../../../base/common/uriTransformer.js';
import { ExtHostConnectionType, readExtHostConnection } from '../../services/extensions/common/extensionHostEnv.js';
import { ExtensionHostExitCode, IExtHostReadyMessage, IExtHostReduceGraceTimeMessage, IExtHostSocketMessage, IExtensionHostInitData, MessageType, createMessageOfType, isMessageOfType } from '../../services/extensions/common/extensionHostProtocol.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import '../common/extHost.common.services.js';
import './extHost.node.services.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

interface ParsedExtHostArgs {
	transformURIs?: boolean;
	skipWorkspaceStorageLock?: boolean;
	supportGlobalNavigator?: boolean; // enable global navigator object in nodejs
	useHostProxy?: 'true' | 'false'; // use a string, as undefined is also a valid value
}

// silence experimental warnings when in development
if (process.env.VSCODE_DEV) {
	const warningListeners = process.listeners('warning');
	process.removeAllListeners('warning');
	process.on('warning', (warning: any) => {
		if (warning.code === 'ExperimentalWarning' || warning.name === 'ExperimentalWarning' || warning.name === 'DeprecationWarning') {
			console.debug(warning);
			return;
		}

		warningListeners[0](warning);
	});
}

// workaround for https://github.com/microsoft/vscode/issues/85490
// remove --inspect-port=0 after start so that it doesn't trigger LSP debugging
(function removeInspectPort() {
	for (let i = 0; i < process.execArgv.length; i++) {
		if (process.execArgv[i] === '--inspect-port=0') {
			process.execArgv.splice(i, 1);
			i--;
		}
	}
})();

const args = minimist(process.argv.slice(2), {
	boolean: [
		'transformURIs',
		'skipWorkspaceStorageLock',
		'supportGlobalNavigator',
	],
	string: [
		'useHostProxy' // 'true' | 'false' | undefined
	]
}) as ParsedExtHostArgs;

// With Electron 2.x and node.js 8.x the "natives" module
// can cause a native crash (see https://github.com/nodejs/node/issues/19891 and
// https://github.com/electron/electron/issues/10905). To prevent this from
// happening we essentially blocklist this module from getting loaded in any
// extension by patching the node require() function.
(function () {
	const Module = require('module');
	const originalLoad = Module._load;

	Module._load = function (request: string) {
		if (request === 'natives') {
			throw new Error('Either the extension or an NPM dependency is using the [unsupported "natives" node module](https://go.microsoft.com/fwlink/?linkid=871887).');
		}

		return originalLoad.apply(this, arguments);
	};
})();

// custom process.exit logic...
const nativeExit: IExitFn = process.exit.bind(process);
const nativeOn = process.on.bind(process);
function patchProcess(allowExit: boolean) {
	process.exit = function (code?: number) {
		if (allowExit) {
			nativeExit(code);
		} else {
			const err = new Error('An extension called process.exit() and this was prevented.');
			console.warn(err.stack);
		}
	} as (code?: number) => never;

	// override Electron's process.crash() method
	// eslint-disable-next-line local/code-no-any-casts
	(process as any /* bypass layer checker */).crash = function () {
		const err = new Error('An extension called process.crash() and this was prevented.');
		console.warn(err.stack);
	};

	// Set ELECTRON_RUN_AS_NODE environment variable for extensions that use
	// child_process.spawn with process.execPath and expect to run as node process
	// on the desktop.
	// Refs https://github.com/microsoft/vscode/issues/151012#issuecomment-1156593228
	process.env['ELECTRON_RUN_AS_NODE'] = '1';

	// eslint-disable-next-line local/code-no-any-casts
	process.on = <any>function (event: string, listener: (...args: any[]) => void) {
		if (event === 'uncaughtException') {
			const actualListener = listener;
			listener = function (...args: unknown[]) {
				try {
					return actualListener.apply(undefined, args);
				} catch {
					// DO NOT HANDLE NOR PRINT the error here because this can and will lead to
					// more errors which will cause error handling to be reentrant and eventually
					// overflowing the stack. Do not be sad, we do handle and annotate uncaught
					// errors properly in 'extensionHostMain'
				}
			};
		}
		nativeOn(event, listener);
	};

}

// NodeJS since v21 defines navigator as a global object. This will likely surprise many extensions and potentially break them
// because `navigator` has historically often been used to check if running in a browser (vs running inside NodeJS)
if (!args.supportGlobalNavigator) {
	Object.defineProperty(globalThis, 'navigator', {
		get: () => {
			onUnexpectedExternalError(new PendingMigrationError('navigator is now a global in nodejs, please see https://aka.ms/vscode-extensions/navigator for additional info on this error.'));
			return undefined;
		}
	});
}


interface IRendererConnection {
	protocol: IMessagePassingProtocol;
	initData: IExtensionHostInitData;
}

// This calls exit directly in case the initialization is not finished and we need to exit
// Otherwise, if initialization completed we go to extensionHostMain.terminate()
let onTerminate = function (reason: string) {
	nativeExit();
};

function readReconnectionValue(envKey: string, fallback: number): number {
	const raw = process.env[envKey];
	if (typeof raw !== 'string' || raw.trim().length === 0) {
		console.log(`[reconnection-grace-time] Extension host: env var ${envKey} not set, using default: ${fallback}ms (${Math.floor(fallback / 1000)}s)`);
		return fallback;
	}
	const parsed = Number(raw);
	if (!isFinite(parsed) || parsed < 0) {
		console.log(`[reconnection-grace-time] Extension host: env var ${envKey} invalid value '${raw}', using default: ${fallback}ms (${Math.floor(fallback / 1000)}s)`);
		return fallback;
	}
	const millis = Math.floor(parsed);
	const result = millis > Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : millis;
	console.log(`[reconnection-grace-time] Extension host: read ${envKey}=${raw}ms (${Math.floor(result / 1000)}s)`);
	return result;
}

function _createExtHostProtocol(): Promise<IMessagePassingProtocol> {
	const extHostConnection = readExtHostConnection(process.env);

	if (extHostConnection.type === ExtHostConnectionType.MessagePort) {

		return new Promise<IMessagePassingProtocol>((resolve, reject) => {

			const withPorts = (ports: MessagePortMain[]) => {
				const port = ports[0];
				const onMessage = new BufferedEmitter<VSBuffer>();
				port.on('message', (e) => onMessage.fire(VSBuffer.wrap(e.data as Uint8Array)));
				port.on('close', () => {
					onTerminate('renderer closed the MessagePort');
				});
				port.start();

				resolve({
					onMessage: onMessage.event,
					send: message => port.postMessage(message.buffer)
				});
			};

			(process as unknown as { parentPort: { on: (event: 'message', listener: (messageEvent: UtilityMessageEvent) => void) => void } }).parentPort.on('message', (e: UtilityMessageEvent) => withPorts(e.ports));
		});

	} else if (extHostConnection.type === ExtHostConnectionType.Socket) {

		return new Promise<PersistentProtocol>((resolve, reject) => {

			let protocol: PersistentProtocol | null = null;

			const timer = setTimeout(() => {
				onTerminate('VSCODE_EXTHOST_IPC_SOCKET timeout');
			}, 60000);

			const reconnectionGraceTime = readReconnectionValue('VSCODE_RECONNECTION_GRACE_TIME', ProtocolConstants.ReconnectionGraceTime);
			const reconnectionShortGraceTime = reconnectionGraceTime > 0 ? Math.min(ProtocolConstants.ReconnectionShortGraceTime, reconnectionGraceTime) : 0;
			const disconnectRunner1 = new ProcessTimeRunOnceScheduler(() => onTerminate('renderer disconnected for too long (1)'), reconnectionGraceTime);
			const disconnectRunner2 = new ProcessTimeRunOnceScheduler(() => onTerminate('renderer disconnected for too long (2)'), reconnectionShortGraceTime);

			process.on('message', (msg: IExtHostSocketMessage | IExtHostReduceGraceTimeMessage, handle: net.Socket) => {
				if (msg && msg.type === 'VSCODE_EXTHOST_IPC_SOCKET') {
					// Disable Nagle's algorithm. We also do this on the server process,
					// but nodejs doesn't document if this option is transferred with the socket
					handle.setNoDelay(true);

					const initialDataChunk = VSBuffer.wrap(Buffer.from(msg.initialDataChunk, 'base64'));
					let socket: NodeSocket | WebSocketNodeSocket;
					if (msg.skipWebSocketFrames) {
						socket = new NodeSocket(handle, 'extHost-socket');
					} else {
						const inflateBytes = VSBuffer.wrap(Buffer.from(msg.inflateBytes, 'base64'));
						socket = new WebSocketNodeSocket(new NodeSocket(handle, 'extHost-socket'), msg.permessageDeflate, inflateBytes, false);
					}
					if (protocol) {
						// reconnection case
						disconnectRunner1.cancel();
						disconnectRunner2.cancel();
						protocol.beginAcceptReconnection(socket, initialDataChunk);
						protocol.endAcceptReconnection();
						protocol.sendResume();
					} else {
						clearTimeout(timer);
						protocol = new PersistentProtocol({ socket, initialChunk: initialDataChunk });
						protocol.sendResume();
						protocol.onDidDispose(() => onTerminate('renderer disconnected'));
						resolve(protocol);

						// Wait for rich client to reconnect
						protocol.onSocketClose(() => {
							// The socket has closed, let's give the renderer a certain amount of time to reconnect
							disconnectRunner1.schedule();
						});
					}
				}
				if (msg && msg.type === 'VSCODE_EXTHOST_IPC_REDUCE_GRACE_TIME') {
					if (disconnectRunner2.isScheduled()) {
						// we are disconnected and already running the short reconnection timer
						return;
					}
					if (disconnectRunner1.isScheduled()) {
						// we are disconnected and running the long reconnection timer
						disconnectRunner2.schedule();
					}
				}
			});

			// Now that we have managed to install a message listener, ask the other side to send us the socket
			const req: IExtHostReadyMessage = { type: 'VSCODE_EXTHOST_IPC_READY' };
			process.send?.(req);
		});

	} else {

		const pipeName = extHostConnection.pipeName;

		return new Promise<PersistentProtocol>((resolve, reject) => {

			const socket = net.createConnection(pipeName, () => {
				socket.removeListener('error', reject);
				const protocol = new PersistentProtocol({ socket: new NodeSocket(socket, 'extHost-renderer') });
				protocol.sendResume();
				resolve(protocol);
			});
			socket.once('error', reject);

			socket.on('close', () => {
				onTerminate('renderer closed the socket');
			});
		});
	}
}

async function createExtHostProtocol(): Promise<IMessagePassingProtocol> {

	const protocol = await _createExtHostProtocol();

	return new class implements IMessagePassingProtocol {

		private readonly _onMessage = new BufferedEmitter<VSBuffer>();
		readonly onMessage: Event<VSBuffer> = this._onMessage.event;

		private _terminating: boolean;
		private _protocolListener: IDisposable;

		constructor() {
			this._terminating = false;
			this._protocolListener = protocol.onMessage((msg) => {
				if (isMessageOfType(msg, MessageType.Terminate)) {
					this._terminating = true;
					this._protocolListener.dispose();
					onTerminate('received terminate message from renderer');
				} else {
					this._onMessage.fire(msg);
				}
			});
		}

		send(msg: any): void {
			if (!this._terminating) {
				protocol.send(msg);
			}
		}

		async drain(): Promise<void> {
			if (protocol.drain) {
				return protocol.drain();
			}
		}
	};
}

function connectToRenderer(protocol: IMessagePassingProtocol): Promise<IRendererConnection> {
	return new Promise<IRendererConnection>((c) => {

		// Listen init data message
		const first = protocol.onMessage(raw => {
			first.dispose();

			const initData = <IExtensionHostInitData>JSON.parse(raw.toString());

			const rendererCommit = initData.commit;
			const myCommit = product.commit;

			if (rendererCommit && myCommit) {
				// Running in the built version where commits are defined
				if (rendererCommit !== myCommit) {
					nativeExit(ExtensionHostExitCode.VersionMismatch);
				}
			}

			if (initData.parentPid) {
				// Kill oneself if one's parent dies. Much drama.
				let epermErrors = 0;
				setInterval(function () {
					try {
						process.kill(initData.parentPid, 0); // throws an exception if the main process doesn't exist anymore.
						epermErrors = 0;
					} catch (e) {
						if (e && e.code === 'EPERM') {
							// Even if the parent process is still alive,
							// some antivirus software can lead to an EPERM error to be thrown here.
							// Let's terminate only if we get 3 consecutive EPERM errors.
							epermErrors++;
							if (epermErrors >= 3) {
								onTerminate(`parent process ${initData.parentPid} does not exist anymore (3 x EPERM): ${e.message} (code: ${e.code}) (errno: ${e.errno})`);
							}
						} else {
							onTerminate(`parent process ${initData.parentPid} does not exist anymore: ${e.message} (code: ${e.code}) (errno: ${e.errno})`);
						}
					}
				}, 1000);

				// In certain cases, the event loop can become busy and never yield
				// e.g. while-true or process.nextTick endless loops
				// So also use the native node module to do it from a separate thread
				let watchdog: typeof nativeWatchdog;
				try {
					watchdog = require('native-watchdog');
					watchdog.start(initData.parentPid);
				} catch (err) {
					// no problem...
					onUnexpectedError(err);
				}
			}

			// Tell the outside that we are initialized
			protocol.send(createMessageOfType(MessageType.Initialized));

			c({ protocol, initData });
		});

		// Tell the outside that we are ready to receive messages
		protocol.send(createMessageOfType(MessageType.Ready));
	});
}

async function startExtensionHostProcess(): Promise<void> {

	// Print a console message when rejection isn't handled within N seconds. For details:
	// see https://nodejs.org/api/process.html#process_event_unhandledrejection
	// and https://nodejs.org/api/process.html#process_event_rejectionhandled
	const unhandledPromises: Promise<any>[] = [];
	process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
		unhandledPromises.push(promise);
		setTimeout(() => {
			const idx = unhandledPromises.indexOf(promise);
			if (idx >= 0) {
				promise.catch(e => {
					unhandledPromises.splice(idx, 1);
					if (!isCancellationError(e)) {
						console.warn(`rejected promise not handled within 1 second: ${e}`);
						if (e && e.stack) {
							console.warn(`stack trace: ${e.stack}`);
						}
						if (reason) {
							onUnexpectedError(reason);
						}
					}
				});
			}
		}, 1000);
	});

	process.on('rejectionHandled', (promise: Promise<any>) => {
		const idx = unhandledPromises.indexOf(promise);
		if (idx >= 0) {
			unhandledPromises.splice(idx, 1);
		}
	});

	// Print a console message when an exception isn't handled.
	process.on('uncaughtException', function (err: Error) {
		if (!isSigPipeError(err)) {
			onUnexpectedError(err);
		}
	});

	performance.mark(`code/extHost/willConnectToRenderer`);
	const protocol = await createExtHostProtocol();
	performance.mark(`code/extHost/didConnectToRenderer`);
	const renderer = await connectToRenderer(protocol);
	performance.mark(`code/extHost/didWaitForInitData`);
	const { initData } = renderer;
	// setup things
	patchProcess(!!initData.environment.extensionTestsLocationURI); // to support other test frameworks like Jasmin that use process.exit (https://github.com/microsoft/vscode/issues/37708)
	initData.environment.useHostProxy = args.useHostProxy !== undefined ? args.useHostProxy !== 'false' : undefined;
	initData.environment.skipWorkspaceStorageLock = boolean(args.skipWorkspaceStorageLock, false);

	// host abstraction
	const hostUtils = new class NodeHost implements IHostUtils {
		declare readonly _serviceBrand: undefined;
		public readonly pid = process.pid;
		exit(code: number) { nativeExit(code); }
		fsExists(path: string) { return Promises.exists(path); }
		fsRealpath(path: string) { return Promises.realpath(path); }
	};

	// Attempt to load uri transformer
	let uriTransformer: IURITransformer | null = null;
	if (initData.remote.authority && args.transformURIs) {
		uriTransformer = createURITransformer(initData.remote.authority);
	}

	const extensionHostMain = new ExtensionHostMain(
		renderer.protocol,
		initData,
		hostUtils,
		uriTransformer
	);

	// rewrite onTerminate-function to be a proper shutdown
	onTerminate = (reason: string) => extensionHostMain.terminate(reason);
}

startExtensionHostProcess().catch((err) => console.log(err));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHost.node.services.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHost.node.services.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { ExtHostTerminalService } from './extHostTerminalService.js';
import { ExtHostTask } from './extHostTask.js';
import { ExtHostDebugService } from './extHostDebugService.js';
import { NativeExtHostSearch } from './extHostSearch.js';
import { ExtHostExtensionService } from './extHostExtensionService.js';
import { NodeExtHostTunnelService } from './extHostTunnelService.js';
import { IExtHostDebugService } from '../common/extHostDebugService.js';
import { IExtHostExtensionService } from '../common/extHostExtensionService.js';
import { IExtHostSearch } from '../common/extHostSearch.js';
import { IExtHostTask } from '../common/extHostTask.js';
import { IExtHostTerminalService } from '../common/extHostTerminalService.js';
import { IExtHostTunnelService } from '../common/extHostTunnelService.js';
import { IExtensionStoragePaths } from '../common/extHostStoragePaths.js';
import { ExtensionStoragePaths } from './extHostStoragePaths.js';
import { ExtHostLoggerService } from './extHostLoggerService.js';
import { ILogService, ILoggerService } from '../../../platform/log/common/log.js';
import { NodeExtHostVariableResolverProviderService } from './extHostVariableResolverService.js';
import { IExtHostVariableResolverProvider } from '../common/extHostVariableResolverService.js';
import { ExtHostLogService } from '../common/extHostLogService.js';
import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { ISignService } from '../../../platform/sign/common/sign.js';
import { SignService } from '../../../platform/sign/node/signService.js';
import { ExtHostTelemetry, IExtHostTelemetry } from '../common/extHostTelemetry.js';
import { IExtHostMpcService } from '../common/extHostMcp.js';
import { NodeExtHostMpcService } from './extHostMcpNode.js';
import { IExtHostAuthentication } from '../common/extHostAuthentication.js';
import { NodeExtHostAuthentication } from './extHostAuthentication.js';

// #########################################################################
// ###                                                                   ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO extHost.common.services.ts !!! ###
// ###                                                                   ###
// #########################################################################

registerSingleton(IExtHostExtensionService, ExtHostExtensionService, InstantiationType.Eager);
registerSingleton(ILoggerService, ExtHostLoggerService, InstantiationType.Delayed);
registerSingleton(ILogService, new SyncDescriptor(ExtHostLogService, [false], true));
registerSingleton(ISignService, SignService, InstantiationType.Delayed);
registerSingleton(IExtensionStoragePaths, ExtensionStoragePaths, InstantiationType.Eager);
registerSingleton(IExtHostTelemetry, new SyncDescriptor(ExtHostTelemetry, [false], true));

registerSingleton(IExtHostAuthentication, NodeExtHostAuthentication, InstantiationType.Eager);
registerSingleton(IExtHostDebugService, ExtHostDebugService, InstantiationType.Eager);
registerSingleton(IExtHostSearch, NativeExtHostSearch, InstantiationType.Eager);
registerSingleton(IExtHostTask, ExtHostTask, InstantiationType.Eager);
registerSingleton(IExtHostTerminalService, ExtHostTerminalService, InstantiationType.Eager);
registerSingleton(IExtHostTunnelService, NodeExtHostTunnelService, InstantiationType.Eager);
registerSingleton(IExtHostVariableResolverProvider, NodeExtHostVariableResolverProviderService, InstantiationType.Eager);
registerSingleton(IExtHostMpcService, NodeExtHostMpcService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostAuthentication.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostAuthentication.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import type * as vscode from 'vscode';
import { URL } from 'url';
import { ExtHostAuthentication, DynamicAuthProvider, IExtHostAuthentication } from '../common/extHostAuthentication.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { IExtHostWindow } from '../common/extHostWindow.js';
import { IExtHostUrlsService } from '../common/extHostUrls.js';
import { ILoggerService, ILogService } from '../../../platform/log/common/log.js';
import { MainThreadAuthenticationShape } from '../common/extHost.protocol.js';
import { IAuthorizationServerMetadata, IAuthorizationProtectedResourceMetadata, IAuthorizationTokenResponse, IAuthorizationDeviceResponse, isAuthorizationDeviceResponse, isAuthorizationTokenResponse, IAuthorizationDeviceTokenErrorResponse, AuthorizationErrorType, AuthorizationDeviceCodeErrorType } from '../../../base/common/oauth.js';
import { Emitter } from '../../../base/common/event.js';
import { raceCancellationError } from '../../../base/common/async.js';
import { IExtHostProgress } from '../common/extHostProgress.js';
import { IProgressStep } from '../../../platform/progress/common/progress.js';
import { CancellationError, isCancellationError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { LoopbackAuthServer } from './loopbackServer.js';

export class NodeDynamicAuthProvider extends DynamicAuthProvider {

	constructor(
		extHostWindow: IExtHostWindow,
		extHostUrls: IExtHostUrlsService,
		initData: IExtHostInitDataService,
		extHostProgress: IExtHostProgress,
		loggerService: ILoggerService,
		proxy: MainThreadAuthenticationShape,
		authorizationServer: URI,
		serverMetadata: IAuthorizationServerMetadata,
		resourceMetadata: IAuthorizationProtectedResourceMetadata | undefined,
		clientId: string,
		clientSecret: string | undefined,
		onDidDynamicAuthProviderTokensChange: Emitter<{ authProviderId: string; clientId: string; tokens: any[] }>,
		initialTokens: any[]
	) {
		super(
			extHostWindow,
			extHostUrls,
			initData,
			extHostProgress,
			loggerService,
			proxy,
			authorizationServer,
			serverMetadata,
			resourceMetadata,
			clientId,
			clientSecret,
			onDidDynamicAuthProviderTokensChange,
			initialTokens
		);

		// Prepend Node-specific flows to the existing flows
		if (!initData.remote.isRemote && serverMetadata.authorization_endpoint) {
			// If we are not in a remote environment, we can use the loopback server for authentication
			this._createFlows.unshift({
				label: nls.localize('loopback', "Loopback Server"),
				handler: (scopes, progress, token) => this._createWithLoopbackServer(scopes, progress, token)
			});
		}

		// Add device code flow to the end since it's not as streamlined
		if (serverMetadata.device_authorization_endpoint) {
			this._createFlows.push({
				label: nls.localize('device code', "Device Code"),
				handler: (scopes, progress, token) => this._createWithDeviceCode(scopes, progress, token)
			});
		}
	}

	private async _createWithLoopbackServer(scopes: string[], progress: vscode.Progress<IProgressStep>, token: vscode.CancellationToken): Promise<IAuthorizationTokenResponse> {
		if (!this._serverMetadata.authorization_endpoint) {
			throw new Error('Authorization Endpoint required');
		}
		if (!this._serverMetadata.token_endpoint) {
			throw new Error('Token endpoint not available in server metadata');
		}

		// Generate PKCE code verifier (random string) and code challenge (SHA-256 hash of verifier)
		const codeVerifier = this.generateRandomString(64);
		const codeChallenge = await this.generateCodeChallenge(codeVerifier);

		// Generate a random state value to prevent CSRF
		const nonce = this.generateRandomString(32);
		const callbackUri = URI.parse(`${this._initData.environment.appUriScheme}://dynamicauthprovider/${this.authorizationServer.authority}/redirect?nonce=${nonce}`);
		let appUri: URI;
		try {
			appUri = await this._extHostUrls.createAppUri(callbackUri);
		} catch (error) {
			throw new Error(`Failed to create external URI: ${error}`);
		}

		// Prepare the authorization request URL
		const authorizationUrl = new URL(this._serverMetadata.authorization_endpoint);
		authorizationUrl.searchParams.append('client_id', this._clientId);
		authorizationUrl.searchParams.append('response_type', 'code');
		authorizationUrl.searchParams.append('code_challenge', codeChallenge);
		authorizationUrl.searchParams.append('code_challenge_method', 'S256');
		const scopeString = scopes.join(' ');
		if (scopeString) {
			authorizationUrl.searchParams.append('scope', scopeString);
		}
		if (this._resourceMetadata?.resource) {
			// If a resource is specified, include it in the request
			authorizationUrl.searchParams.append('resource', this._resourceMetadata.resource);
		}

		// Create and start the loopback server
		const server = new LoopbackAuthServer(
			this._logger,
			appUri,
			this._initData.environment.appName
		);
		try {
			await server.start();
		} catch (err) {
			throw new Error(`Failed to start loopback server: ${err}`);
		}

		// Update the authorization URL with the actual redirect URI
		authorizationUrl.searchParams.set('redirect_uri', server.redirectUri);
		authorizationUrl.searchParams.set('state', server.state);

		const promise = server.waitForOAuthResponse();
		// Set up a Uri Handler but it's just to redirect not to handle the code
		void this._proxy.$waitForUriHandler(appUri);

		try {
			// Open the browser for user authorization
			this._logger.info(`Opening authorization URL for scopes: ${scopeString}`);
			this._logger.trace(`Authorization URL: ${authorizationUrl.toString()}`);
			const opened = await this._extHostWindow.openUri(authorizationUrl.toString(), {});
			if (!opened) {
				throw new CancellationError();
			}
			progress.report({
				message: nls.localize('completeAuth', "Complete the authentication in the browser window that has opened."),
			});

			// Wait for the authorization code via the loopback server
			let code: string | undefined;
			try {
				const response = await raceCancellationError(promise, token);
				code = response.code;
			} catch (err) {
				if (isCancellationError(err)) {
					this._logger.info('Authorization code request was cancelled by the user.');
					throw err;
				}
				this._logger.error(`Failed to receive authorization code: ${err}`);
				throw new Error(`Failed to receive authorization code: ${err}`);
			}
			this._logger.info(`Authorization code received for scopes: ${scopeString}`);

			// Exchange the authorization code for tokens
			const tokenResponse = await this.exchangeCodeForToken(code, codeVerifier, server.redirectUri);
			return tokenResponse;
		} finally {
			// Clean up the server
			setTimeout(() => {
				void server.stop();
			}, 5000);
		}
	}

	private async _createWithDeviceCode(scopes: string[], progress: vscode.Progress<IProgressStep>, token: vscode.CancellationToken): Promise<IAuthorizationTokenResponse> {
		if (!this._serverMetadata.token_endpoint) {
			throw new Error('Token endpoint not available in server metadata');
		}
		if (!this._serverMetadata.device_authorization_endpoint) {
			throw new Error('Device authorization endpoint not available in server metadata');
		}

		const deviceAuthUrl = this._serverMetadata.device_authorization_endpoint;
		const scopeString = scopes.join(' ');
		this._logger.info(`Starting device code flow for scopes: ${scopeString}`);

		// Step 1: Request device and user codes
		const deviceCodeRequest = new URLSearchParams();
		deviceCodeRequest.append('client_id', this._clientId);
		if (scopeString) {
			deviceCodeRequest.append('scope', scopeString);
		}
		if (this._resourceMetadata?.resource) {
			// If a resource is specified, include it in the request
			deviceCodeRequest.append('resource', this._resourceMetadata.resource);
		}

		let deviceCodeResponse: Response;
		try {
			deviceCodeResponse = await fetch(deviceAuthUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				body: deviceCodeRequest.toString()
			});
		} catch (error) {
			this._logger.error(`Failed to request device code: ${error}`);
			throw new Error(`Failed to request device code: ${error}`);
		}

		if (!deviceCodeResponse.ok) {
			const text = await deviceCodeResponse.text();
			throw new Error(`Device code request failed: ${deviceCodeResponse.status} ${deviceCodeResponse.statusText} - ${text}`);
		}

		const deviceCodeData: IAuthorizationDeviceResponse = await deviceCodeResponse.json();
		if (!isAuthorizationDeviceResponse(deviceCodeData)) {
			this._logger.error('Invalid device code response received from server');
			throw new Error('Invalid device code response received from server');
		}
		this._logger.info(`Device code received: ${deviceCodeData.user_code}`);

		// Step 2: Show the device code modal
		const userConfirmed = await this._proxy.$showDeviceCodeModal(
			deviceCodeData.user_code,
			deviceCodeData.verification_uri
		);

		if (!userConfirmed) {
			throw new CancellationError();
		}

		// Step 3: Poll for token
		progress.report({
			message: nls.localize('waitingForAuth', "Open [{0}]({0}) in a new tab and paste your one-time code: {1}", deviceCodeData.verification_uri, deviceCodeData.user_code)
		});

		const pollInterval = (deviceCodeData.interval || 5) * 1000; // Convert to milliseconds
		const expiresAt = Date.now() + (deviceCodeData.expires_in * 1000);

		while (Date.now() < expiresAt) {
			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Wait for the specified interval
			await new Promise(resolve => setTimeout(resolve, pollInterval));

			if (token.isCancellationRequested) {
				throw new CancellationError();
			}

			// Poll the token endpoint
			const tokenRequest = new URLSearchParams();
			tokenRequest.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
			tokenRequest.append('device_code', deviceCodeData.device_code);
			tokenRequest.append('client_id', this._clientId);

			// Add resource indicator if available (RFC 8707)
			if (this._resourceMetadata?.resource) {
				tokenRequest.append('resource', this._resourceMetadata.resource);
			}

			try {
				const tokenResponse = await fetch(this._serverMetadata.token_endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Accept': 'application/json'
					},
					body: tokenRequest.toString()
				});

				if (tokenResponse.ok) {
					const tokenData: IAuthorizationTokenResponse = await tokenResponse.json();
					if (!isAuthorizationTokenResponse(tokenData)) {
						this._logger.error('Invalid token response received from server');
						throw new Error('Invalid token response received from server');
					}
					this._logger.info(`Device code flow completed successfully for scopes: ${scopeString}`);
					return tokenData;
				} else {
					let errorData: IAuthorizationDeviceTokenErrorResponse;
					try {
						errorData = await tokenResponse.json();
					} catch (e) {
						this._logger.error(`Failed to parse error response: ${e}`);
						throw new Error(`Token request failed with status ${tokenResponse.status}: ${tokenResponse.statusText}`);
					}

					// Handle known error cases
					if (errorData.error === AuthorizationDeviceCodeErrorType.AuthorizationPending) {
						// User hasn't completed authorization yet, continue polling
						continue;
					} else if (errorData.error === AuthorizationDeviceCodeErrorType.SlowDown) {
						// Server is asking us to slow down
						await new Promise(resolve => setTimeout(resolve, pollInterval));
						continue;
					} else if (errorData.error === AuthorizationDeviceCodeErrorType.ExpiredToken) {
						throw new Error('Device code expired. Please try again.');
					} else if (errorData.error === AuthorizationDeviceCodeErrorType.AccessDenied) {
						throw new CancellationError();
					} else if (errorData.error === AuthorizationErrorType.InvalidClient) {
						this._logger.warn(`Client ID (${this._clientId}) was invalid, generated a new one.`);
						await this._generateNewClientId();
						throw new Error(`Client ID was invalid, generated a new one. Please try again.`);
					} else {
						throw new Error(`Token request failed: ${errorData.error_description || errorData.error || 'Unknown error'}`);
					}
				}
			} catch (error) {
				if (isCancellationError(error)) {
					throw error;
				}
				throw new Error(`Error polling for token: ${error}`);
			}
		}

		throw new Error('Device code flow timed out. Please try again.');
	}
}

export class NodeExtHostAuthentication extends ExtHostAuthentication implements IExtHostAuthentication {

	protected override readonly _dynamicAuthProviderCtor = NodeDynamicAuthProvider;

	constructor(
		extHostRpc: IExtHostRpcService,
		initData: IExtHostInitDataService,
		extHostWindow: IExtHostWindow,
		extHostUrls: IExtHostUrlsService,
		extHostProgress: IExtHostProgress,
		extHostLoggerService: ILoggerService,
		extHostLogService: ILogService
	) {
		super(extHostRpc, initData, extHostWindow, extHostUrls, extHostProgress, extHostLoggerService, extHostLogService);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostCLIServer.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostCLIServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createRandomIPCHandle } from '../../../base/parts/ipc/node/ipc.net.js';
import * as http from 'http';
import * as fs from 'fs';
import { IExtHostCommands } from '../common/extHostCommands.js';
import { IWindowOpenable, IOpenWindowOptions } from '../../../platform/window/common/window.js';
import { URI } from '../../../base/common/uri.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { hasWorkspaceFileExtension } from '../../../platform/workspace/common/workspace.js';

export interface OpenCommandPipeArgs {
	type: 'open';
	fileURIs?: string[];
	folderURIs?: string[];
	forceNewWindow?: boolean;
	diffMode?: boolean;
	mergeMode?: boolean;
	addMode?: boolean;
	removeMode?: boolean;
	gotoLineMode?: boolean;
	forceReuseWindow?: boolean;
	waitMarkerFilePath?: string;
	remoteAuthority?: string | null;
}

export interface OpenExternalCommandPipeArgs {
	type: 'openExternal';
	uris: string[];
}

export interface StatusPipeArgs {
	type: 'status';
}

export interface ExtensionManagementPipeArgs {
	type: 'extensionManagement';
	list?: { showVersions?: boolean; category?: string };
	install?: string[];
	uninstall?: string[];
	force?: boolean;
}

export type PipeCommand = OpenCommandPipeArgs | StatusPipeArgs | OpenExternalCommandPipeArgs | ExtensionManagementPipeArgs;

export interface ICommandsExecuter {
	executeCommand<T>(id: string, ...args: any[]): Promise<T>;
}

export class CLIServerBase {
	private readonly _server: http.Server;

	constructor(
		private readonly _commands: ICommandsExecuter,
		private readonly logService: ILogService,
		private readonly _ipcHandlePath: string,
	) {
		this._server = http.createServer((req, res) => this.onRequest(req, res));
		this.setup().catch(err => {
			logService.error(err);
			return '';
		});
	}

	public get ipcHandlePath() {
		return this._ipcHandlePath;
	}

	private async setup(): Promise<string> {
		try {
			this._server.listen(this.ipcHandlePath);
			this._server.on('error', err => this.logService.error(err));
		} catch (err) {
			this.logService.error('Could not start open from terminal server.');
		}

		return this._ipcHandlePath;
	}

	private onRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
		const sendResponse = (statusCode: number, returnObj: string | undefined) => {
			res.writeHead(statusCode, { 'content-type': 'application/json' });
			res.end(JSON.stringify(returnObj || null), (err?: any) => err && this.logService.error(err)); // CodeQL [SM01524] Only the message portion of errors are passed in.
		};

		const chunks: string[] = [];
		req.setEncoding('utf8');
		req.on('data', (d: string) => chunks.push(d));
		req.on('end', async () => {
			try {
				const data: PipeCommand | any = JSON.parse(chunks.join(''));
				let returnObj: string | undefined;
				switch (data.type) {
					case 'open':
						returnObj = await this.open(data);
						break;
					case 'openExternal':
						returnObj = await this.openExternal(data);
						break;
					case 'status':
						returnObj = await this.getStatus(data);
						break;
					case 'extensionManagement':
						returnObj = await this.manageExtensions(data);
						break;
					default:
						sendResponse(404, `Unknown message type: ${data.type}`);
						break;
				}
				sendResponse(200, returnObj);
			} catch (e) {
				const message = e instanceof Error ? e.message : JSON.stringify(e);
				sendResponse(500, message);
				this.logService.error('Error while processing pipe request', e);
			}
		});
	}

	private async open(data: OpenCommandPipeArgs): Promise<undefined> {
		const { fileURIs, folderURIs, forceNewWindow, diffMode, mergeMode, addMode, removeMode, forceReuseWindow, gotoLineMode, waitMarkerFilePath, remoteAuthority } = data;
		const urisToOpen: IWindowOpenable[] = [];
		if (Array.isArray(folderURIs)) {
			for (const s of folderURIs) {
				try {
					urisToOpen.push({ folderUri: URI.parse(s) });
				} catch (e) {
					// ignore
				}
			}
		}
		if (Array.isArray(fileURIs)) {
			for (const s of fileURIs) {
				try {
					if (hasWorkspaceFileExtension(s)) {
						urisToOpen.push({ workspaceUri: URI.parse(s) });
					} else {
						urisToOpen.push({ fileUri: URI.parse(s) });
					}
				} catch (e) {
					// ignore
				}
			}
		}
		const waitMarkerFileURI = waitMarkerFilePath ? URI.file(waitMarkerFilePath) : undefined;
		const preferNewWindow = !forceReuseWindow && !waitMarkerFileURI && !addMode && !removeMode;
		const windowOpenArgs: IOpenWindowOptions = { forceNewWindow, diffMode, mergeMode, addMode, removeMode, gotoLineMode, forceReuseWindow, preferNewWindow, waitMarkerFileURI, remoteAuthority };
		this._commands.executeCommand('_remoteCLI.windowOpen', urisToOpen, windowOpenArgs);
	}

	private async openExternal(data: OpenExternalCommandPipeArgs): Promise<undefined> {
		for (const uriString of data.uris) {
			const uri = URI.parse(uriString);
			const urioOpen = uri.scheme === 'file' ? uri : uriString; // workaround for #112577
			await this._commands.executeCommand('_remoteCLI.openExternal', urioOpen);
		}
	}

	private async manageExtensions(data: ExtensionManagementPipeArgs): Promise<string | undefined> {
		const toExtOrVSIX = (inputs: string[] | undefined) => inputs?.map(input => /\.vsix$/i.test(input) ? URI.parse(input) : input);
		const commandArgs = {
			list: data.list,
			install: toExtOrVSIX(data.install),
			uninstall: toExtOrVSIX(data.uninstall),
			force: data.force
		};
		return await this._commands.executeCommand<string | undefined>('_remoteCLI.manageExtensions', commandArgs);
	}

	private async getStatus(data: StatusPipeArgs): Promise<string | undefined> {
		return await this._commands.executeCommand<string | undefined>('_remoteCLI.getSystemStatus');
	}

	dispose(): void {
		this._server.close();

		if (this._ipcHandlePath && process.platform !== 'win32' && fs.existsSync(this._ipcHandlePath)) {
			fs.unlinkSync(this._ipcHandlePath);
		}
	}
}

export class CLIServer extends CLIServerBase {
	constructor(
		@IExtHostCommands commands: IExtHostCommands,
		@ILogService logService: ILogService
	) {
		super(commands, logService, createRandomIPCHandle());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostConsoleForwarder.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostConsoleForwarder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractExtHostConsoleForwarder } from '../common/extHostConsoleForwarder.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { NativeLogMarkers } from '../../services/extensions/common/extensionHostProtocol.js';

const MAX_STREAM_BUFFER_LENGTH = 1024 * 1024;

export class ExtHostConsoleForwarder extends AbstractExtHostConsoleForwarder {

	private _isMakingConsoleCall: boolean = false;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
	) {
		super(extHostRpc, initData);

		this._wrapStream('stderr', 'error');
		this._wrapStream('stdout', 'log');
	}

	protected override _nativeConsoleLogMessage(method: 'log' | 'info' | 'warn' | 'error' | 'debug', original: (...args: any[]) => void, args: IArguments) {
		const stream = method === 'error' || method === 'warn' ? process.stderr : process.stdout;
		this._isMakingConsoleCall = true;
		stream.write(`\n${NativeLogMarkers.Start}\n`);
		// eslint-disable-next-line local/code-no-any-casts
		original.apply(console, args as any);
		stream.write(`\n${NativeLogMarkers.End}\n`);
		this._isMakingConsoleCall = false;
	}

	/**
	 * Wraps process.stderr/stdout.write() so that it is transmitted to the
	 * renderer or CLI. It both calls through to the original method as well
	 * as to console.log with complete lines so that they're made available
	 * to the debugger/CLI.
	 */
	private _wrapStream(streamName: 'stdout' | 'stderr', severity: 'log' | 'warn' | 'error') {
		const stream = process[streamName];
		const original = stream.write;

		let buf = '';

		Object.defineProperty(stream, 'write', {
			set: () => { },
			get: () => (chunk: Uint8Array | string, encoding?: BufferEncoding, callback?: (err?: Error | null) => void) => {
				if (!this._isMakingConsoleCall) {
					// eslint-disable-next-line local/code-no-any-casts
					buf += (chunk as any).toString(encoding);
					const eol = buf.length > MAX_STREAM_BUFFER_LENGTH ? buf.length : buf.lastIndexOf('\n');
					if (eol !== -1) {
						console[severity](buf.slice(0, eol));
						buf = buf.slice(eol + 1);
					}
				}

				original.call(stream, chunk, encoding, callback);
			},
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostDebugService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostDebugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { createCancelablePromise, disposableTimeout, firstParallel, RunOnceScheduler, timeout } from '../../../base/common/async.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import * as platform from '../../../base/common/platform.js';
import * as nls from '../../../nls.js';
import { IExternalTerminalService } from '../../../platform/externalTerminal/common/externalTerminal.js';
import { LinuxExternalTerminalService, MacExternalTerminalService, WindowsExternalTerminalService } from '../../../platform/externalTerminal/node/externalTerminalService.js';
import { ISignService } from '../../../platform/sign/common/sign.js';
import { SignService } from '../../../platform/sign/node/signService.js';
import { AbstractDebugAdapter } from '../../contrib/debug/common/abstractDebugAdapter.js';
import { ExecutableDebugAdapter, NamedPipeDebugAdapter, SocketDebugAdapter } from '../../contrib/debug/node/debugAdapter.js';
import { hasChildProcesses, prepareCommand } from '../../contrib/debug/node/terminals.js';
import { ExtensionDescriptionRegistry } from '../../services/extensions/common/extensionDescriptionRegistry.js';
import { IExtHostCommands } from '../common/extHostCommands.js';
import { ExtHostConfigProvider, IExtHostConfiguration } from '../common/extHostConfiguration.js';
import { ExtHostDebugServiceBase, ExtHostDebugSession } from '../common/extHostDebugService.js';
import { IExtHostEditorTabs } from '../common/extHostEditorTabs.js';
import { IExtHostExtensionService } from '../common/extHostExtensionService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';
import { IExtHostTerminalService } from '../common/extHostTerminalService.js';
import { IExtHostTesting } from '../common/extHostTesting.js';
import { DebugAdapterExecutable, DebugAdapterNamedPipeServer, DebugAdapterServer, ThemeIcon } from '../common/extHostTypes.js';
import { IExtHostVariableResolverProvider } from '../common/extHostVariableResolverService.js';
import { IExtHostWorkspace } from '../common/extHostWorkspace.js';
import { IExtHostTerminalShellIntegration } from '../common/extHostTerminalShellIntegration.js';

export class ExtHostDebugService extends ExtHostDebugServiceBase {

	private _integratedTerminalInstances = new DebugTerminalCollection();
	private _terminalDisposedListener: IDisposable | undefined;

	constructor(
		@IExtHostRpcService extHostRpcService: IExtHostRpcService,
		@IExtHostWorkspace workspaceService: IExtHostWorkspace,
		@IExtHostExtensionService extensionService: IExtHostExtensionService,
		@IExtHostConfiguration configurationService: IExtHostConfiguration,
		@IExtHostTerminalService private _terminalService: IExtHostTerminalService,
		@IExtHostTerminalShellIntegration private _terminalShellIntegrationService: IExtHostTerminalShellIntegration,
		@IExtHostEditorTabs editorTabs: IExtHostEditorTabs,
		@IExtHostVariableResolverProvider variableResolver: IExtHostVariableResolverProvider,
		@IExtHostCommands commands: IExtHostCommands,
		@IExtHostTesting testing: IExtHostTesting,
	) {
		super(extHostRpcService, workspaceService, extensionService, configurationService, editorTabs, variableResolver, commands, testing);
	}

	protected override createDebugAdapter(adapter: vscode.DebugAdapterDescriptor, session: ExtHostDebugSession): AbstractDebugAdapter | undefined {
		if (adapter instanceof DebugAdapterExecutable) {
			return new ExecutableDebugAdapter(this.convertExecutableToDto(adapter), session.type);
		} else if (adapter instanceof DebugAdapterServer) {
			return new SocketDebugAdapter(this.convertServerToDto(adapter));
		} else if (adapter instanceof DebugAdapterNamedPipeServer) {
			return new NamedPipeDebugAdapter(this.convertPipeServerToDto(adapter));
		} else {
			return super.createDebugAdapter(adapter, session);
		}
	}

	protected override daExecutableFromPackage(session: ExtHostDebugSession, extensionRegistry: ExtensionDescriptionRegistry): DebugAdapterExecutable | undefined {
		const dae = ExecutableDebugAdapter.platformAdapterExecutable(extensionRegistry.getAllExtensionDescriptions(), session.type);
		if (dae) {
			return new DebugAdapterExecutable(dae.command, dae.args, dae.options);
		}
		return undefined;
	}

	protected override createSignService(): ISignService | undefined {
		return new SignService();
	}

	public override async $runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined> {

		if (args.kind === 'integrated') {

			if (!this._terminalDisposedListener) {
				// React on terminal disposed and check if that is the debug terminal #12956
				this._terminalDisposedListener = this._register(this._terminalService.onDidCloseTerminal(terminal => {
					this._integratedTerminalInstances.onTerminalClosed(terminal);
				}));
			}

			const configProvider = await this._configurationService.getConfigProvider();
			const shell = this._terminalService.getDefaultShell(true);
			const shellArgs = this._terminalService.getDefaultShellArgs(true);

			const terminalName = args.title || nls.localize('debug.terminal.title', "Debug Process");

			const shellConfig = JSON.stringify({ shell, shellArgs });
			let terminal = await this._integratedTerminalInstances.checkout(shellConfig, terminalName);

			let cwdForPrepareCommand: string | undefined;
			let giveShellTimeToInitialize = false;

			if (!terminal) {
				const options: vscode.TerminalOptions = {
					shellPath: shell,
					shellArgs: shellArgs,
					cwd: args.cwd,
					name: terminalName,
					iconPath: new ThemeIcon('debug'),
				};
				giveShellTimeToInitialize = true;
				terminal = this._terminalService.createTerminalFromOptions(options, {
					isFeatureTerminal: true,
					// Since debug termnials are REPLs, we want shell integration to be enabled.
					// Ignore isFeatureTerminal when evaluating shell integration enablement.
					forceShellIntegration: true,
					useShellEnvironment: true
				});
				this._integratedTerminalInstances.insert(terminal, shellConfig);

			} else {
				cwdForPrepareCommand = args.cwd;
			}

			terminal.show(true);

			const shellProcessId = await terminal.processId;

			if (giveShellTimeToInitialize) {
				// give a new terminal some time to initialize the shell (most recently, #228191)
				// - If shell integration is available, use that as a deterministic signal
				// - Debounce content being written to known when the prompt is available
				// - Give a longer timeout otherwise
				const enum Timing {
					DataDebounce = 500,
					MaxDelay = 5000,
				}

				const ds = new DisposableStore();
				await new Promise<void>(resolve => {
					const scheduler = ds.add(new RunOnceScheduler(resolve, Timing.DataDebounce));
					ds.add(this._terminalService.onDidWriteTerminalData(e => {
						if (e.terminal === terminal) {
							scheduler.schedule();
						}
					}));
					ds.add(this._terminalShellIntegrationService.onDidChangeTerminalShellIntegration(e => {
						if (e.terminal === terminal) {
							resolve();
						}
					}));
					ds.add(disposableTimeout(resolve, Timing.MaxDelay));
				});

				ds.dispose();
			} else {
				if (terminal.state.isInteractedWith && !terminal.shellIntegration) {
					terminal.sendText('\u0003'); // Ctrl+C for #106743. Not part of the same command for #107969
					await timeout(200); // mirroring https://github.com/microsoft/vscode/blob/c67ccc70ece5f472ec25464d3eeb874cfccee9f1/src/vs/workbench/contrib/terminal/browser/terminalInstance.ts#L852-L857
				}

				if (configProvider.getConfiguration('debug.terminal').get<boolean>('clearBeforeReusing')) {
					// clear terminal before reusing it
					let clearCommand: string;
					if (shell.indexOf('powershell') >= 0 || shell.indexOf('pwsh') >= 0 || shell.indexOf('cmd.exe') >= 0) {
						clearCommand = 'cls';
					} else if (shell.indexOf('bash') >= 0) {
						clearCommand = 'clear';
					} else if (platform.isWindows) {
						clearCommand = 'cls';
					} else {
						clearCommand = 'clear';
					}

					if (terminal.shellIntegration) {
						const ds = new DisposableStore();
						const execution = terminal.shellIntegration.executeCommand(clearCommand);
						await new Promise<void>(resolve => {
							ds.add(this._terminalShellIntegrationService.onDidEndTerminalShellExecution(e => {
								if (e.execution === execution) {
									resolve();
								}
							}));
							ds.add(disposableTimeout(resolve, 500)); // 500ms timeout to ensure we resolve
						});

						ds.dispose();
					} else {
						terminal.sendText(clearCommand);
						await timeout(200); // add a small delay to ensure the command is processed, see #240953
					}
				}
			}

			const command = prepareCommand(shell, args.args, !!args.argsCanBeInterpretedByShell, cwdForPrepareCommand, args.env);

			if (terminal.shellIntegration) {
				terminal.shellIntegration.executeCommand(command);
			} else {
				terminal.sendText(command);
			}

			// Mark terminal as unused when its session ends, see #112055
			const sessionListener = this.onDidTerminateDebugSession(s => {
				if (s.id === sessionId) {
					this._integratedTerminalInstances.free(terminal);
					sessionListener.dispose();
				}
			});

			return shellProcessId;

		} else if (args.kind === 'external') {
			return runInExternalTerminal(args, await this._configurationService.getConfigProvider());
		}
		return super.$runInTerminal(args, sessionId);
	}
}

let externalTerminalService: IExternalTerminalService | undefined = undefined;

function runInExternalTerminal(args: DebugProtocol.RunInTerminalRequestArguments, configProvider: ExtHostConfigProvider): Promise<number | undefined> {
	if (!externalTerminalService) {
		if (platform.isWindows) {
			externalTerminalService = new WindowsExternalTerminalService();
		} else if (platform.isMacintosh) {
			externalTerminalService = new MacExternalTerminalService();
		} else if (platform.isLinux) {
			externalTerminalService = new LinuxExternalTerminalService();
		} else {
			throw new Error('external terminals not supported on this platform');
		}
	}
	const config = configProvider.getConfiguration('terminal');
	return externalTerminalService.runInTerminal(args.title!, args.cwd, args.args, args.env || {}, config.external || {});
}

class DebugTerminalCollection {
	/**
	 * Delay before a new terminal is a candidate for reuse. See #71850
	 */
	private static minUseDelay = 1000;

	private _terminalInstances = new Map<vscode.Terminal, { lastUsedAt: number; config: string }>();

	public async checkout(config: string, name: string, cleanupOthersByName = false) {
		const entries = [...this._terminalInstances.entries()];
		const promises = entries.map(([terminal, termInfo]) => createCancelablePromise(async ct => {

			// Only allow terminals that match the title.  See #123189
			if (terminal.name !== name) {
				return null;
			}

			if (termInfo.lastUsedAt !== -1 && await hasChildProcesses(await terminal.processId)) {
				return null;
			}

			// important: date check and map operations must be synchronous
			const now = Date.now();
			if (termInfo.lastUsedAt + DebugTerminalCollection.minUseDelay > now || ct.isCancellationRequested) {
				return null;
			}

			if (termInfo.config !== config) {
				if (cleanupOthersByName) {
					terminal.dispose();
				}
				return null;
			}

			termInfo.lastUsedAt = now;
			return terminal;
		}));

		return await firstParallel(promises, (t): t is vscode.Terminal => !!t);
	}

	public insert(terminal: vscode.Terminal, termConfig: string) {
		this._terminalInstances.set(terminal, { lastUsedAt: Date.now(), config: termConfig });
	}

	public free(terminal: vscode.Terminal) {
		const info = this._terminalInstances.get(terminal);
		if (info) {
			info.lastUsedAt = -1;
		}
	}

	public onTerminalClosed(terminal: vscode.Terminal) {
		this._terminalInstances.delete(terminal);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostDiskFileSystemProvider.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostDiskFileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { IExtHostConsumerFileSystem } from '../common/extHostFileSystemConsumer.js';
import { Schemas } from '../../../base/common/network.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { DiskFileSystemProvider } from '../../../platform/files/node/diskFileSystemProvider.js';
import { FilePermission } from '../../../platform/files/common/files.js';
import { isLinux } from '../../../base/common/platform.js';

export class ExtHostDiskFileSystemProvider {

	constructor(
		@IExtHostConsumerFileSystem extHostConsumerFileSystem: IExtHostConsumerFileSystem,
		@ILogService logService: ILogService
	) {

		// Register disk file system provider so that certain
		// file operations can execute fast within the extension
		// host without roundtripping.
		extHostConsumerFileSystem.addFileSystemProvider(Schemas.file, new DiskFileSystemProviderAdapter(logService), { isCaseSensitive: isLinux });
	}
}

class DiskFileSystemProviderAdapter implements vscode.FileSystemProvider {

	private readonly impl: DiskFileSystemProvider;

	constructor(logService: ILogService) {
		this.impl = new DiskFileSystemProvider(logService);
	}

	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const stat = await this.impl.stat(uri);

		return {
			type: stat.type,
			ctime: stat.ctime,
			mtime: stat.mtime,
			size: stat.size,
			permissions: stat.permissions === FilePermission.Readonly ? 1 : undefined
		};
	}

	readDirectory(uri: vscode.Uri): Promise<[string, vscode.FileType][]> {
		return this.impl.readdir(uri);
	}

	createDirectory(uri: vscode.Uri): Promise<void> {
		return this.impl.mkdir(uri);
	}

	readFile(uri: vscode.Uri): Promise<Uint8Array> {
		return this.impl.readFile(uri);
	}

	writeFile(uri: vscode.Uri, content: Uint8Array, options: { readonly create: boolean; readonly overwrite: boolean }): Promise<void> {
		return this.impl.writeFile(uri, content, { ...options, unlock: false, atomic: false });
	}

	delete(uri: vscode.Uri, options: { readonly recursive: boolean }): Promise<void> {
		return this.impl.delete(uri, { ...options, useTrash: false, atomic: false });
	}

	rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { readonly overwrite: boolean }): Promise<void> {
		return this.impl.rename(oldUri, newUri, options);
	}

	copy(source: vscode.Uri, destination: vscode.Uri, options: { readonly overwrite: boolean }): Promise<void> {
		return this.impl.copy(source, destination, options);
	}

	// --- Not Implemented ---

	get onDidChangeFile(): never { throw new Error('Method not implemented.'); }
	watch(uri: vscode.Uri, options: { readonly recursive: boolean; readonly excludes: readonly string[] }): vscode.Disposable { throw new Error('Method not implemented.'); }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostDownloadService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostDownloadService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join } from '../../../base/common/path.js';
import { tmpdir } from 'os';
import { generateUuid } from '../../../base/common/uuid.js';
import { IExtHostCommands } from '../common/extHostCommands.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { MainContext } from '../common/extHost.protocol.js';
import { URI } from '../../../base/common/uri.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';

export class ExtHostDownloadService extends Disposable {

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostCommands commands: IExtHostCommands
	) {
		super();

		const proxy = extHostRpc.getProxy(MainContext.MainThreadDownloadService);

		commands.registerCommand(false, '_workbench.downloadResource', async (resource: URI): Promise<any> => {
			const location = URI.file(join(tmpdir(), generateUuid()));
			await proxy.$download(resource, location);
			return location;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostExtensionService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as performance from '../../../base/common/performance.js';
import type * as vscode from 'vscode';
import { createApiFactoryAndRegisterActors } from '../common/extHost.api.impl.js';
import { INodeModuleFactory, RequireInterceptor } from '../common/extHostRequireInterceptor.js';
import { ExtensionActivationTimesBuilder } from '../common/extHostExtensionActivator.js';
import { connectProxyResolver } from './proxyResolver.js';
import { AbstractExtHostExtensionService } from '../common/extHostExtensionService.js';
import { ExtHostDownloadService } from './extHostDownloadService.js';
import { URI } from '../../../base/common/uri.js';
import { Schemas } from '../../../base/common/network.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtensionRuntime } from '../common/extHostTypes.js';
import { CLIServer } from './extHostCLIServer.js';
import { realpathSync } from '../../../base/node/pfs.js';
import { ExtHostConsoleForwarder } from './extHostConsoleForwarder.js';
import { ExtHostDiskFileSystemProvider } from './extHostDiskFileSystemProvider.js';
import nodeModule from 'node:module';
import { assertType } from '../../../base/common/types.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { BidirectionalMap } from '../../../base/common/map.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';

const require = nodeModule.createRequire(import.meta.url);

class NodeModuleRequireInterceptor extends RequireInterceptor {

	protected _installInterceptor(): void {
		const that = this;
		const node_module = require('module');
		const originalLoad = node_module._load;
		node_module._load = function load(request: string, parent: { filename: string }, isMain: boolean) {
			request = applyAlternatives(request);
			if (!that._factories.has(request)) {
				return originalLoad.apply(this, arguments);
			}
			return that._factories.get(request)!.load(
				request,
				URI.file(realpathSync(parent.filename)),
				request => originalLoad.apply(this, [request, parent, isMain])
			);
		};

		const originalLookup = node_module._resolveLookupPaths;
		node_module._resolveLookupPaths = (request: string, parent: unknown) => {
			return originalLookup.call(this, applyAlternatives(request), parent);
		};

		const originalResolveFilename = node_module._resolveFilename;
		node_module._resolveFilename = function resolveFilename(request: string, parent: unknown, isMain: boolean, options?: { paths?: string[] }) {
			if (request === 'vsda' && Array.isArray(options?.paths) && options.paths.length === 0) {
				// ESM: ever since we moved to ESM, `require.main` will be `undefined` for extensions
				// Some extensions have been using `require.resolve('vsda', { paths: require.main.paths })`
				// to find the `vsda` module in our app root. To be backwards compatible with this pattern,
				// we help by filling in the `paths` array with the node modules paths of the current module.
				options.paths = node_module._nodeModulePaths(import.meta.dirname);
			}
			return originalResolveFilename.call(this, request, parent, isMain, options);
		};

		const applyAlternatives = (request: string) => {
			for (const alternativeModuleName of that._alternatives) {
				const alternative = alternativeModuleName(request);
				if (alternative) {
					request = alternative;
					break;
				}
			}
			return request;
		};
	}
}

class NodeModuleESMInterceptor extends RequireInterceptor {

	private static _createDataUri(scriptContent: string): string {
		return `data:text/javascript;base64,${Buffer.from(scriptContent).toString('base64')}`;
	}

	// This string is a script that runs in the loader thread of NodeJS.
	private static _loaderScript = `
	let lookup;
	export const initialize = async (context) => {
		let requestIds = 0;
		const { port } = context;
		const pendingRequests = new Map();
		port.onmessage = (event) => {
			const { id, url } = event.data;
			pendingRequests.get(id)?.(url);
		};
		lookup = url => {
			// debugger;
			const myId = requestIds++;
			return new Promise((resolve) => {
				pendingRequests.set(myId, resolve);
				port.postMessage({ id: myId, url, });
			});
		};
	};
	export const resolve = async (specifier, context, nextResolve) => {
		if (specifier !== 'vscode' || !context.parentURL) {
			return nextResolve(specifier, context);
		}
		const otherUrl = await lookup(context.parentURL);
		return {
			url: otherUrl,
			shortCircuit: true,
		};
	};`;

	private static _vscodeImportFnName = `_VSCODE_IMPORT_VSCODE_API`;

	private readonly _store = new DisposableStore();

	dispose(): void {
		this._store.dispose();
	}

	protected override _installInterceptor(): void {

		type Message = { id: string; url: string };

		const apiInstances = new BidirectionalMap<typeof vscode, string>();
		const apiImportDataUrl = new Map<string, string>();

		// define a global function that can be used to get API instances given a random key
		Object.defineProperty(globalThis, NodeModuleESMInterceptor._vscodeImportFnName, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: (key: string) => {
				return apiInstances.getKey(key);
			}
		});

		const { port1, port2 } = new MessageChannel();

		let apiModuleFactory: INodeModuleFactory | undefined;

		// this is a workaround for the fact that the layer checker does not understand
		// that onmessage is NodeJS API here
		const port1LayerCheckerWorkaround: any = port1;

		port1LayerCheckerWorkaround.onmessage = (e: { data: Message }) => {

			// Get the vscode-module factory - which is the same logic that's also used by
			// the CommonJS require interceptor
			if (!apiModuleFactory) {
				apiModuleFactory = this._factories.get('vscode');
				assertType(apiModuleFactory);
			}

			const { id, url } = e.data;
			const uri = URI.parse(url);

			// Get or create the API instance. The interface is per extension and extensions are
			// looked up by the uri (e.data.url) and path containment.
			const apiInstance = apiModuleFactory.load('_not_used', uri, () => { throw new Error('CANNOT LOAD MODULE from here.'); });
			let key = apiInstances.get(apiInstance);
			if (!key) {
				key = generateUuid();
				apiInstances.set(apiInstance, key);
			}

			// Create and cache a data-url which is the import script for the API instance
			let scriptDataUrlSrc = apiImportDataUrl.get(key);
			if (!scriptDataUrlSrc) {
				const jsCode = `const _vscodeInstance = globalThis.${NodeModuleESMInterceptor._vscodeImportFnName}('${key}');\n\n${Object.keys(apiInstance).map((name => `export const ${name} = _vscodeInstance['${name}'];`)).join('\n')}`;
				scriptDataUrlSrc = NodeModuleESMInterceptor._createDataUri(jsCode);
				apiImportDataUrl.set(key, scriptDataUrlSrc);
			}

			port1.postMessage({
				id,
				url: scriptDataUrlSrc
			});
		};

		nodeModule.register(NodeModuleESMInterceptor._createDataUri(NodeModuleESMInterceptor._loaderScript), {
			parentURL: import.meta.url,
			data: { port: port2 },
			transferList: [port2],
		});

		this._store.add(toDisposable(() => {
			port1.close();
			port2.close();
		}));
	}
}

export class ExtHostExtensionService extends AbstractExtHostExtensionService {

	readonly extensionRuntime = ExtensionRuntime.Node;

	protected async _beforeAlmostReadyToRunExtensions(): Promise<void> {
		// make sure console.log calls make it to the render
		this._instaService.createInstance(ExtHostConsoleForwarder);

		// initialize API and register actors
		const extensionApiFactory = this._instaService.invokeFunction(createApiFactoryAndRegisterActors);

		// Register Download command
		this._instaService.createInstance(ExtHostDownloadService);

		// Register CLI Server for ipc
		if (this._initData.remote.isRemote && this._initData.remote.authority) {
			const cliServer = this._instaService.createInstance(CLIServer);
			process.env['VSCODE_IPC_HOOK_CLI'] = cliServer.ipcHandlePath;
		}

		// Register local file system shortcut
		this._instaService.createInstance(ExtHostDiskFileSystemProvider);

		// Module loading tricks
		await this._instaService.createInstance(NodeModuleRequireInterceptor, extensionApiFactory, { mine: this._myRegistry, all: this._globalRegistry })
			.install();

		// ESM loading tricks
		await this._store.add(this._instaService.createInstance(NodeModuleESMInterceptor, extensionApiFactory, { mine: this._myRegistry, all: this._globalRegistry }))
			.install();

		performance.mark('code/extHost/didInitAPI');

		// Do this when extension service exists, but extensions are not being activated yet.
		const configProvider = await this._extHostConfiguration.getConfigProvider();
		await connectProxyResolver(this._extHostWorkspace, configProvider, this, this._logService, this._mainThreadTelemetryProxy, this._initData, this._store);
		performance.mark('code/extHost/didInitProxyResolver');
	}

	protected _getEntryPoint(extensionDescription: IExtensionDescription): string | undefined {
		return extensionDescription.main;
	}

	private async _doLoadModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder, mode: 'esm' | 'cjs'): Promise<T> {
		if (module.scheme !== Schemas.file) {
			throw new Error(`Cannot load URI: '${module}', must be of file-scheme`);
		}
		let r: T | null = null;
		activationTimesBuilder.codeLoadingStart();
		this._logService.trace(`ExtensionService#loadModule [${mode}] -> ${module.toString(true)}`);
		this._logService.flush();
		const extensionId = extension?.identifier.value;
		if (extension) {
			await this._extHostLocalizationService.initializeLocalizedMessages(extension);
		}
		try {
			if (extensionId) {
				performance.mark(`code/extHost/willLoadExtensionCode/${extensionId}`);
			}
			if (mode === 'esm') {
				r = <T>await import(module.toString(true));
			} else {
				r = <T>require(module.fsPath);
			}
		} finally {
			if (extensionId) {
				performance.mark(`code/extHost/didLoadExtensionCode/${extensionId}`);
			}
			activationTimesBuilder.codeLoadingStop();
		}
		return r;
	}

	protected async _loadCommonJSModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		return this._doLoadModule<T>(extension, module, activationTimesBuilder, 'cjs');
	}

	protected async _loadESMModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		return this._doLoadModule<T>(extension, module, activationTimesBuilder, 'esm');
	}

	public async $setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void> {
		if (!this._initData.remote.isRemote) {
			return;
		}

		for (const key in env) {
			const value = env[key];
			if (value === null) {
				delete process.env[key];
			} else {
				process.env[key] = value;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostLoggerService.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostLoggerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger, ILoggerOptions, ILoggerResource, LogLevel } from '../../../platform/log/common/log.js';
import { URI } from '../../../base/common/uri.js';
import { ExtHostLoggerService as BaseExtHostLoggerService } from '../common/extHostLoggerService.js';
import { Schemas } from '../../../base/common/network.js';
import { SpdLogLogger } from '../../../platform/log/node/spdlogLog.js';
import { generateUuid } from '../../../base/common/uuid.js';

export class ExtHostLoggerService extends BaseExtHostLoggerService {

	protected override doCreateLogger(resource: URI, logLevel: LogLevel, options?: ILoggerOptions): ILogger {
		if (resource.scheme === Schemas.file) {
			/* Create the logger in the Extension Host process to prevent loggers (log, output channels...) traffic  over IPC */
			return new SpdLogLogger(options?.name || generateUuid(), resource.fsPath, !options?.donotRotate, !!options?.donotUseFormatters, logLevel);
		}
		return super.doCreateLogger(resource, logLevel, options);
	}

	override registerLogger(resource: ILoggerResource): void {
		super.registerLogger(resource);
		this._proxy.$registerLogger(resource);
	}

	override deregisterLogger(resource: URI): void {
		super.deregisterLogger(resource);
		this._proxy.$deregisterLogger(resource);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/node/extHostMcpNode.ts]---
Location: vscode-main/src/vs/workbench/api/node/extHostMcpNode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { readFile } from 'fs/promises';
import { homedir } from 'os';
import type { RequestInit as UndiciRequestInit } from 'undici';
import { parseEnvFile } from '../../../base/common/envfile.js';
import { untildify } from '../../../base/common/labels.js';
import { Lazy } from '../../../base/common/lazy.js';
import { DisposableMap } from '../../../base/common/lifecycle.js';
import * as path from '../../../base/common/path.js';
import { URI } from '../../../base/common/uri.js';
import { StreamSplitter } from '../../../base/node/nodeStreams.js';
import { findExecutable } from '../../../base/node/processes.js';
import { LogLevel } from '../../../platform/log/common/log.js';
import { McpConnectionState, McpServerLaunch, McpServerTransportStdio, McpServerTransportType } from '../../contrib/mcp/common/mcpTypes.js';
import { McpStdioStateHandler } from '../../contrib/mcp/node/mcpStdioStateHandler.js';
import { CommonRequestInit, CommonResponse, ExtHostMcpService, McpHTTPHandle } from '../common/extHostMcp.js';

export class NodeExtHostMpcService extends ExtHostMcpService {
	private nodeServers = this._register(new DisposableMap<number, McpStdioStateHandler>());

	protected override _startMcp(id: number, launch: McpServerLaunch, defaultCwd?: URI, errorOnUserInteraction?: boolean): void {
		if (launch.type === McpServerTransportType.Stdio) {
			this.startNodeMpc(id, launch, defaultCwd);
		} else if (launch.type === McpServerTransportType.HTTP) {
			this._sseEventSources.set(id, new McpHTTPHandleNode(id, launch, this._proxy, this._logService, errorOnUserInteraction));
		} else {
			super._startMcp(id, launch, defaultCwd, errorOnUserInteraction);
		}
	}

	override $stopMcp(id: number): void {
		const nodeServer = this.nodeServers.get(id);
		if (nodeServer) {
			nodeServer.stop(); // will get removed from map when process is fully stopped
		} else {
			super.$stopMcp(id);
		}
	}

	override $sendMessage(id: number, message: string): void {
		const nodeServer = this.nodeServers.get(id);
		if (nodeServer) {
			nodeServer.write(message);
		} else {
			super.$sendMessage(id, message);
		}
	}

	private async startNodeMpc(id: number, launch: McpServerTransportStdio, defaultCwd?: URI): Promise<void> {
		const onError = (err: Error | string) => this._proxy.$onDidChangeState(id, {
			state: McpConnectionState.Kind.Error,
			// eslint-disable-next-line local/code-no-any-casts
			code: err.hasOwnProperty('code') ? String((err as any).code) : undefined,
			message: typeof err === 'string' ? err : err.message,
		});

		// MCP servers are run on the same authority where they are defined, so
		// reading the envfile based on its path off the filesystem here is fine.
		const env = { ...process.env };
		if (launch.envFile) {
			try {
				for (const [key, value] of parseEnvFile(await readFile(launch.envFile, 'utf-8'))) {
					env[key] = value;
				}
			} catch (e) {
				onError(`Failed to read envFile '${launch.envFile}': ${e.message}`);
				return;
			}
		}
		for (const [key, value] of Object.entries(launch.env)) {
			env[key] = value === null ? undefined : String(value);
		}

		let child: ChildProcessWithoutNullStreams;
		try {
			const home = homedir();
			let cwd = launch.cwd ? untildify(launch.cwd, home) : (defaultCwd?.fsPath || home);
			if (!path.isAbsolute(cwd)) {
				cwd = defaultCwd ? path.join(defaultCwd.fsPath, cwd) : path.join(home, cwd);
			}

			const { executable, args, shell } = await formatSubprocessArguments(
				untildify(launch.command, home),
				launch.args.map(a => untildify(a, home)),
				cwd,
				env
			);

			this._proxy.$onDidPublishLog(id, LogLevel.Debug, `Server command line: ${executable} ${args.join(' ')}`);
			child = spawn(executable, args, {
				stdio: 'pipe',
				cwd,
				env,
				shell,
			});
		} catch (e) {
			onError(e);
			return;
		}

		// Create the connection manager for graceful shutdown
		const connectionManager = new McpStdioStateHandler(child);

		this._proxy.$onDidChangeState(id, { state: McpConnectionState.Kind.Starting });

		child.stdout.pipe(new StreamSplitter('\n')).on('data', line => this._proxy.$onDidReceiveMessage(id, line.toString()));

		child.stdin.on('error', onError);
		child.stdout.on('error', onError);

		// Stderr handling is not currently specified https://github.com/modelcontextprotocol/specification/issues/177
		// Just treat it as generic log data for now
		child.stderr.pipe(new StreamSplitter('\n')).on('data', line => this._proxy.$onDidPublishLog(id, LogLevel.Warning, `[server stderr] ${line.toString().trimEnd()}`));

		child.on('spawn', () => this._proxy.$onDidChangeState(id, { state: McpConnectionState.Kind.Running }));

		child.on('error', e => {
			onError(e);
		});
		child.on('exit', code => {
			this.nodeServers.deleteAndDispose(id);

			if (code === 0 || connectionManager.stopped) {
				this._proxy.$onDidChangeState(id, { state: McpConnectionState.Kind.Stopped });
			} else {
				this._proxy.$onDidChangeState(id, {
					state: McpConnectionState.Kind.Error,
					message: `Process exited with code ${code}`,
				});
			}
		});

		this.nodeServers.set(id, connectionManager);
	}
}

class McpHTTPHandleNode extends McpHTTPHandle {
	private readonly _undici = new Lazy(() => import('undici'));

	protected override async _fetchInternal(url: string, init?: CommonRequestInit): Promise<CommonResponse> {
		// Note: imported async so that we can ensure we load undici after proxy patches have been applied
		const { fetch, Agent } = await this._undici.value;

		const undiciInit: UndiciRequestInit = { ...init };

		let httpUrl = url;
		const uri = URI.parse(url);

		if (uri.scheme === 'unix' || uri.scheme === 'pipe') {
			// By convention, we put the *socket path* as the URI path, and the *request path* in the fragment
			// So, set the dispatcher with the socket path
			undiciInit.dispatcher = new Agent({
				socketPath: uri.path,
			});

			// And then rewrite the URL to be http://localhost/<fragment>
			httpUrl = uri.with({
				scheme: 'http',
				authority: 'localhost', // HTTP always wants a host (not that we're using it), but if we're using a socket or pipe then localhost is sorta right anyway
				path: uri.fragment,
			}).toString(true);
		} else {
			return super._fetchInternal(url, init);
		}

		const undiciResponse = await fetch(httpUrl, undiciInit);

		return {
			status: undiciResponse.status,
			statusText: undiciResponse.statusText,
			headers: undiciResponse.headers,
			body: undiciResponse.body as ReadableStream, // Way down in `ReadableStreamReadDoneResult<T>`, `value` is optional in the undici type but required (yet can be `undefined`) in the standard type
			url: undiciResponse.url,
			json: () => undiciResponse.json(),
			text: () => undiciResponse.text(),
		};
	}
}

const windowsShellScriptRe = /\.(bat|cmd)$/i;

/**
 * Formats arguments to avoid issues on Windows for CVE-2024-27980.
 */
export const formatSubprocessArguments = async (
	executable: string,
	args: ReadonlyArray<string>,
	cwd: string | undefined,
	env: Record<string, string | undefined>,
) => {
	if (process.platform !== 'win32') {
		return { executable, args, shell: false };
	}

	const found = await findExecutable(executable, cwd, undefined, env);
	if (found && windowsShellScriptRe.test(found)) {
		const quote = (s: string) => s.includes(' ') ? `"${s}"` : s;
		return {
			executable: quote(found),
			args: args.map(quote),
			shell: true,
		};
	}

	return { executable, args, shell: false };
};
```

--------------------------------------------------------------------------------

````

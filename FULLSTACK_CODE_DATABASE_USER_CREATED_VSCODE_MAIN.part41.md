---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 41
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 41 of 552)

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

---[FILE: extensions/git/src/api/api1.ts]---
Location: vscode-main/extensions/git/src/api/api1.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { Model } from '../model';
import { Repository as BaseRepository, Resource } from '../repository';
import { InputBox, Git, API, Repository, Remote, RepositoryState, Branch, ForcePushMode, Ref, Submodule, Commit, Change, RepositoryUIState, Status, LogOptions, APIState, CommitOptions, RefType, CredentialsProvider, BranchQuery, PushErrorHandler, PublishEvent, FetchOptions, RemoteSourceProvider, RemoteSourcePublisher, PostCommitCommandsProvider, RefQuery, BranchProtectionProvider, InitOptions, SourceControlHistoryItemDetailsProvider, GitErrorCodes, CloneOptions, CommitShortStat } from './git';
import { Event, SourceControlInputBox, Uri, SourceControl, Disposable, commands, CancellationToken } from 'vscode';
import { combinedDisposable, filterEvent, mapEvent } from '../util';
import { toGitUri } from '../uri';
import { GitExtensionImpl } from './extension';
import { GitBaseApi } from '../git-base';
import { PickRemoteSourceOptions } from '../typings/git-base';
import { OperationKind, OperationResult } from '../operation';
import { CloneManager } from '../cloneManager';

class ApiInputBox implements InputBox {
	#inputBox: SourceControlInputBox;

	constructor(inputBox: SourceControlInputBox) { this.#inputBox = inputBox; }

	set value(value: string) { this.#inputBox.value = value; }
	get value(): string { return this.#inputBox.value; }
}

export class ApiChange implements Change {
	#resource: Resource;
	constructor(resource: Resource) { this.#resource = resource; }

	get uri(): Uri { return this.#resource.resourceUri; }
	get originalUri(): Uri { return this.#resource.original; }
	get renameUri(): Uri | undefined { return this.#resource.renameResourceUri; }
	get status(): Status { return this.#resource.type; }
}

export class ApiRepositoryState implements RepositoryState {
	#repository: BaseRepository;
	readonly onDidChange: Event<void>;

	constructor(repository: BaseRepository) {
		this.#repository = repository;
		this.onDidChange = this.#repository.onDidRunGitStatus;
	}

	get HEAD(): Branch | undefined { return this.#repository.HEAD; }
	/**
	 * @deprecated Use ApiRepository.getRefs() instead.
	 */
	get refs(): Ref[] { console.warn('Deprecated. Use ApiRepository.getRefs() instead.'); return []; }
	get remotes(): Remote[] { return [...this.#repository.remotes]; }
	get submodules(): Submodule[] { return [...this.#repository.submodules]; }
	get rebaseCommit(): Commit | undefined { return this.#repository.rebaseCommit; }

	get mergeChanges(): Change[] { return this.#repository.mergeGroup.resourceStates.map(r => new ApiChange(r)); }
	get indexChanges(): Change[] { return this.#repository.indexGroup.resourceStates.map(r => new ApiChange(r)); }
	get workingTreeChanges(): Change[] { return this.#repository.workingTreeGroup.resourceStates.map(r => new ApiChange(r)); }
	get untrackedChanges(): Change[] { return this.#repository.untrackedGroup.resourceStates.map(r => new ApiChange(r)); }
}

export class ApiRepositoryUIState implements RepositoryUIState {
	#sourceControl: SourceControl;
	readonly onDidChange: Event<void>;

	constructor(sourceControl: SourceControl) {
		this.#sourceControl = sourceControl;
		this.onDidChange = mapEvent<boolean, void>(this.#sourceControl.onDidChangeSelection, () => null);
	}

	get selected(): boolean { return this.#sourceControl.selected; }
}

export class ApiRepository implements Repository {
	#repository: BaseRepository;

	readonly rootUri: Uri;
	readonly inputBox: InputBox;
	readonly state: RepositoryState;
	readonly ui: RepositoryUIState;

	readonly onDidCommit: Event<void>;
	readonly onDidCheckout: Event<void>;

	constructor(repository: BaseRepository) {
		this.#repository = repository;

		this.rootUri = Uri.file(this.#repository.root);
		this.inputBox = new ApiInputBox(this.#repository.inputBox);
		this.state = new ApiRepositoryState(this.#repository);
		this.ui = new ApiRepositoryUIState(this.#repository.sourceControl);

		this.onDidCommit = mapEvent<OperationResult, void>(
			filterEvent(this.#repository.onDidRunOperation, e => e.operation.kind === OperationKind.Commit), () => null);
		this.onDidCheckout = mapEvent<OperationResult, void>(
			filterEvent(this.#repository.onDidRunOperation, e => e.operation.kind === OperationKind.Checkout || e.operation.kind === OperationKind.CheckoutTracking), () => null);
	}

	apply(patch: string, reverse?: boolean): Promise<void> {
		return this.#repository.apply(patch, reverse);
	}

	getConfigs(): Promise<{ key: string; value: string }[]> {
		return this.#repository.getConfigs();
	}

	getConfig(key: string): Promise<string> {
		return this.#repository.getConfig(key);
	}

	setConfig(key: string, value: string): Promise<string> {
		return this.#repository.setConfig(key, value);
	}

	unsetConfig(key: string): Promise<string> {
		return this.#repository.unsetConfig(key);
	}

	getGlobalConfig(key: string): Promise<string> {
		return this.#repository.getGlobalConfig(key);
	}

	getObjectDetails(treeish: string, path: string): Promise<{ mode: string; object: string; size: number }> {
		return this.#repository.getObjectDetails(treeish, path);
	}

	detectObjectType(object: string): Promise<{ mimetype: string; encoding?: string }> {
		return this.#repository.detectObjectType(object);
	}

	buffer(ref: string, filePath: string): Promise<Buffer> {
		return this.#repository.buffer(ref, filePath);
	}

	show(ref: string, path: string): Promise<string> {
		return this.#repository.show(ref, path);
	}

	getCommit(ref: string): Promise<Commit> {
		return this.#repository.getCommit(ref);
	}

	add(paths: string[]) {
		return this.#repository.add(paths.map(p => Uri.file(p)));
	}

	revert(paths: string[]) {
		return this.#repository.revert(paths.map(p => Uri.file(p)));
	}

	clean(paths: string[]) {
		return this.#repository.clean(paths.map(p => Uri.file(p)));
	}

	diff(cached?: boolean) {
		return this.#repository.diff(cached);
	}

	diffWithHEAD(): Promise<Change[]>;
	diffWithHEAD(path: string): Promise<string>;
	diffWithHEAD(path?: string): Promise<string | Change[]> {
		return this.#repository.diffWithHEAD(path);
	}

	diffWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.#repository.diffWithHEADShortStats(path);
	}

	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffWith(ref: string, path?: string): Promise<string | Change[]> {
		return this.#repository.diffWith(ref, path);
	}

	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWithHEAD(path?: string): Promise<string | Change[]> {
		return this.#repository.diffIndexWithHEAD(path);
	}

	diffIndexWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.#repository.diffIndexWithHEADShortStats(path);
	}

	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffIndexWith(ref: string, path?: string): Promise<string | Change[]> {
		return this.#repository.diffIndexWith(ref, path);
	}

	diffBlobs(object1: string, object2: string): Promise<string> {
		return this.#repository.diffBlobs(object1, object2);
	}

	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;
	diffBetween(ref1: string, ref2: string, path?: string): Promise<string | Change[]> {
		return this.#repository.diffBetween(ref1, ref2, path);
	}

	hashObject(data: string): Promise<string> {
		return this.#repository.hashObject(data);
	}

	createBranch(name: string, checkout: boolean, ref?: string | undefined): Promise<void> {
		return this.#repository.branch(name, checkout, ref);
	}

	deleteBranch(name: string, force?: boolean): Promise<void> {
		return this.#repository.deleteBranch(name, force);
	}

	getBranch(name: string): Promise<Branch> {
		return this.#repository.getBranch(name);
	}

	getBranches(query: BranchQuery, cancellationToken?: CancellationToken): Promise<Ref[]> {
		return this.#repository.getBranches(query, cancellationToken);
	}

	getBranchBase(name: string): Promise<Branch | undefined> {
		return this.#repository.getBranchBase(name);
	}

	setBranchUpstream(name: string, upstream: string): Promise<void> {
		return this.#repository.setBranchUpstream(name, upstream);
	}

	getRefs(query: RefQuery, cancellationToken?: CancellationToken): Promise<Ref[]> {
		return this.#repository.getRefs(query, cancellationToken);
	}

	checkIgnore(paths: string[]): Promise<Set<string>> {
		return this.#repository.checkIgnore(paths);
	}

	getMergeBase(ref1: string, ref2: string): Promise<string | undefined> {
		return this.#repository.getMergeBase(ref1, ref2);
	}

	tag(name: string, message: string, ref?: string | undefined): Promise<void> {
		return this.#repository.tag({ name, message, ref });
	}

	deleteTag(name: string): Promise<void> {
		return this.#repository.deleteTag(name);
	}

	status(): Promise<void> {
		return this.#repository.status();
	}

	checkout(treeish: string): Promise<void> {
		return this.#repository.checkout(treeish);
	}

	addRemote(name: string, url: string): Promise<void> {
		return this.#repository.addRemote(name, url);
	}

	removeRemote(name: string): Promise<void> {
		return this.#repository.removeRemote(name);
	}

	renameRemote(name: string, newName: string): Promise<void> {
		return this.#repository.renameRemote(name, newName);
	}

	fetch(arg0?: FetchOptions | string | undefined,
		ref?: string | undefined,
		depth?: number | undefined,
		prune?: boolean | undefined
	): Promise<void> {
		if (arg0 !== undefined && typeof arg0 !== 'string') {
			return this.#repository.fetch(arg0);
		}

		return this.#repository.fetch({ remote: arg0, ref, depth, prune });
	}

	pull(unshallow?: boolean): Promise<void> {
		return this.#repository.pull(undefined, unshallow);
	}

	push(remoteName?: string, branchName?: string, setUpstream: boolean = false, force?: ForcePushMode): Promise<void> {
		return this.#repository.pushTo(remoteName, branchName, setUpstream, force);
	}

	blame(path: string): Promise<string> {
		return this.#repository.blame(path);
	}

	log(options?: LogOptions): Promise<Commit[]> {
		return this.#repository.log(options);
	}

	commit(message: string, opts?: CommitOptions): Promise<void> {
		return this.#repository.commit(message, { ...opts, postCommitCommand: null });
	}

	merge(ref: string): Promise<void> {
		return this.#repository.merge(ref);
	}

	mergeAbort(): Promise<void> {
		return this.#repository.mergeAbort();
	}

	createStash(options?: { message?: string; includeUntracked?: boolean; staged?: boolean }): Promise<void> {
		return this.#repository.createStash(options?.message, options?.includeUntracked, options?.staged);
	}

	applyStash(index?: number): Promise<void> {
		return this.#repository.applyStash(index);
	}

	popStash(index?: number): Promise<void> {
		return this.#repository.popStash(index);
	}

	dropStash(index?: number): Promise<void> {
		return this.#repository.dropStash(index);
	}

	createWorktree(options?: { path?: string; commitish?: string; branch?: string }): Promise<string> {
		return this.#repository.createWorktree(options);
	}

	deleteWorktree(path: string, options?: { force?: boolean }): Promise<void> {
		return this.#repository.deleteWorktree(path, options);
	}

	migrateChanges(sourceRepositoryPath: string, options?: { confirmation?: boolean; deleteFromSource?: boolean; untracked?: boolean }): Promise<void> {
		return this.#repository.migrateChanges(sourceRepositoryPath, options);
	}
}

export class ApiGit implements Git {
	#model: Model;

	private _env: { [key: string]: string } | undefined;

	constructor(model: Model) { this.#model = model; }

	get path(): string { return this.#model.git.path; }

	get env(): { [key: string]: string } {
		if (this._env === undefined) {
			this._env = Object.freeze(this.#model.git.env);
		}

		return this._env;
	}
}

export class ApiImpl implements API {
	#model: Model;
	#cloneManager: CloneManager;
	readonly git: ApiGit;

	constructor(privates: { model: Model; cloneManager: CloneManager }) {
		this.#model = privates.model;
		this.#cloneManager = privates.cloneManager;
		this.git = new ApiGit(this.#model);
	}

	get state(): APIState {
		return this.#model.state;
	}

	get onDidChangeState(): Event<APIState> {
		return this.#model.onDidChangeState;
	}

	get onDidPublish(): Event<PublishEvent> {
		return this.#model.onDidPublish;
	}

	get onDidOpenRepository(): Event<Repository> {
		return mapEvent(this.#model.onDidOpenRepository, r => new ApiRepository(r));
	}

	get onDidCloseRepository(): Event<Repository> {
		return mapEvent(this.#model.onDidCloseRepository, r => new ApiRepository(r));
	}

	get repositories(): Repository[] {
		return this.#model.repositories.map(r => new ApiRepository(r));
	}

	toGitUri(uri: Uri, ref: string): Uri {
		return toGitUri(uri, ref);
	}

	getRepository(uri: Uri): Repository | null {
		const result = this.#model.getRepository(uri);
		return result ? new ApiRepository(result) : null;
	}

	async getRepositoryRoot(uri: Uri): Promise<Uri | null> {
		const repository = this.getRepository(uri);
		if (repository) {
			return repository.rootUri;
		}

		try {
			const root = await this.#model.git.getRepositoryRoot(uri.fsPath);
			return Uri.file(root);
		} catch (err) {
			if (
				err.gitErrorCode === GitErrorCodes.NotAGitRepository ||
				err.gitErrorCode === GitErrorCodes.NotASafeGitRepository
			) {
				return null;
			}

			throw err;
		}
	}

	async getRepositoryWorkspace(uri: Uri): Promise<Uri[] | null> {
		const workspaces = this.#model.repositoryCache.get(uri.toString());
		return workspaces ? workspaces.map(r => Uri.file(r.workspacePath)) : null;
	}

	async init(root: Uri, options?: InitOptions): Promise<Repository | null> {
		const path = root.fsPath;
		await this.#model.git.init(path, options);
		await this.#model.openRepository(path);
		return this.getRepository(root) || null;
	}

	async clone(uri: Uri, options?: CloneOptions): Promise<Uri | null> {
		const parentPath = options?.parentPath?.fsPath;
		const result = await this.#cloneManager.clone(uri.toString(), { parentPath, recursive: options?.recursive, ref: options?.ref, postCloneAction: options?.postCloneAction });
		return result ? Uri.file(result) : null;
	}

	async openRepository(root: Uri): Promise<Repository | null> {
		if (root.scheme !== 'file') {
			return null;
		}

		await this.#model.openRepository(root.fsPath);
		return this.getRepository(root) || null;
	}

	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable {
		const disposables: Disposable[] = [];

		if (provider.publishRepository) {
			disposables.push(this.#model.registerRemoteSourcePublisher(provider as RemoteSourcePublisher));
		}
		disposables.push(GitBaseApi.getAPI().registerRemoteSourceProvider(provider));

		return combinedDisposable(disposables);
	}

	registerRemoteSourcePublisher(publisher: RemoteSourcePublisher): Disposable {
		return this.#model.registerRemoteSourcePublisher(publisher);
	}

	registerCredentialsProvider(provider: CredentialsProvider): Disposable {
		return this.#model.registerCredentialsProvider(provider);
	}

	registerPostCommitCommandsProvider(provider: PostCommitCommandsProvider): Disposable {
		return this.#model.registerPostCommitCommandsProvider(provider);
	}

	registerPushErrorHandler(handler: PushErrorHandler): Disposable {
		return this.#model.registerPushErrorHandler(handler);
	}

	registerSourceControlHistoryItemDetailsProvider(provider: SourceControlHistoryItemDetailsProvider): Disposable {
		return this.#model.registerSourceControlHistoryItemDetailsProvider(provider);
	}

	registerBranchProtectionProvider(root: Uri, provider: BranchProtectionProvider): Disposable {
		return this.#model.registerBranchProtectionProvider(root, provider);
	}
}

function getRefType(type: RefType): string {
	switch (type) {
		case RefType.Head: return 'Head';
		case RefType.RemoteHead: return 'RemoteHead';
		case RefType.Tag: return 'Tag';
	}

	return 'unknown';
}

function getStatus(status: Status): string {
	switch (status) {
		case Status.INDEX_MODIFIED: return 'INDEX_MODIFIED';
		case Status.INDEX_ADDED: return 'INDEX_ADDED';
		case Status.INDEX_DELETED: return 'INDEX_DELETED';
		case Status.INDEX_RENAMED: return 'INDEX_RENAMED';
		case Status.INDEX_COPIED: return 'INDEX_COPIED';
		case Status.MODIFIED: return 'MODIFIED';
		case Status.DELETED: return 'DELETED';
		case Status.UNTRACKED: return 'UNTRACKED';
		case Status.IGNORED: return 'IGNORED';
		case Status.INTENT_TO_ADD: return 'INTENT_TO_ADD';
		case Status.INTENT_TO_RENAME: return 'INTENT_TO_RENAME';
		case Status.TYPE_CHANGED: return 'TYPE_CHANGED';
		case Status.ADDED_BY_US: return 'ADDED_BY_US';
		case Status.ADDED_BY_THEM: return 'ADDED_BY_THEM';
		case Status.DELETED_BY_US: return 'DELETED_BY_US';
		case Status.DELETED_BY_THEM: return 'DELETED_BY_THEM';
		case Status.BOTH_ADDED: return 'BOTH_ADDED';
		case Status.BOTH_DELETED: return 'BOTH_DELETED';
		case Status.BOTH_MODIFIED: return 'BOTH_MODIFIED';
	}

	return 'UNKNOWN';
}

export function registerAPICommands(extension: GitExtensionImpl): Disposable {
	const disposables: Disposable[] = [];

	disposables.push(commands.registerCommand('git.api.getRepositories', () => {
		const api = extension.getAPI(1);
		return api.repositories.map(r => r.rootUri.toString());
	}));

	disposables.push(commands.registerCommand('git.api.getRepositoryState', (uri: string) => {
		const api = extension.getAPI(1);
		const repository = api.getRepository(Uri.parse(uri));

		if (!repository) {
			return null;
		}

		const state = repository.state;

		const ref = (ref: Ref | undefined) => (ref && { ...ref, type: getRefType(ref.type) });
		const change = (change: Change) => ({
			uri: change.uri.toString(),
			originalUri: change.originalUri.toString(),
			renameUri: change.renameUri?.toString(),
			status: getStatus(change.status)
		});

		return {
			HEAD: ref(state.HEAD),
			refs: state.refs.map(ref),
			remotes: state.remotes,
			submodules: state.submodules,
			rebaseCommit: state.rebaseCommit,
			mergeChanges: state.mergeChanges.map(change),
			indexChanges: state.indexChanges.map(change),
			workingTreeChanges: state.workingTreeChanges.map(change)
		};
	}));

	disposables.push(commands.registerCommand('git.api.getRemoteSources', (opts?: PickRemoteSourceOptions) => {
		return commands.executeCommand('git-base.api.getRemoteSources', opts);
	}));

	return Disposable.from(...disposables);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/api/extension.ts]---
Location: vscode-main/extensions/git/src/api/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Model } from '../model';
import { GitExtension, Repository, API } from './git';
import { ApiRepository, ApiImpl } from './api1';
import { Event, EventEmitter } from 'vscode';
import { CloneManager } from '../cloneManager';

function deprecated(original: unknown, context: ClassMemberDecoratorContext) {
	if (typeof original !== 'function' || context.kind !== 'method') {
		throw new Error('not supported');
	}

	const key = context.name.toString();
	return function (this: unknown, ...args: unknown[]) {
		console.warn(`Git extension API method '${key}' is deprecated.`);
		return original.apply(this, args);
	};
}

export class GitExtensionImpl implements GitExtension {

	enabled: boolean = false;

	private _onDidChangeEnablement = new EventEmitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _model: Model | undefined = undefined;
	private _cloneManager: CloneManager | undefined = undefined;

	set model(model: Model | undefined) {
		this._model = model;

		const enabled = !!model;

		if (this.enabled === enabled) {
			return;
		}

		this.enabled = enabled;
		this._onDidChangeEnablement.fire(this.enabled);
	}

	get model(): Model | undefined {
		return this._model;
	}

	set cloneManager(cloneManager: CloneManager | undefined) {
		this._cloneManager = cloneManager;
	}

	constructor(privates?: { model: Model; cloneManager: CloneManager }) {
		if (privates) {
			this.enabled = true;
			this._model = privates.model;
			this._cloneManager = privates.cloneManager;
		}
	}

	@deprecated
	async getGitPath(): Promise<string> {
		if (!this._model) {
			throw new Error('Git model not found');
		}

		return this._model.git.path;
	}

	@deprecated
	async getRepositories(): Promise<Repository[]> {
		if (!this._model) {
			throw new Error('Git model not found');
		}

		return this._model.repositories.map(repository => new ApiRepository(repository));
	}

	getAPI(version: number): API {
		if (!this._model || !this._cloneManager) {
			throw new Error('Git model not found');
		}

		if (version !== 1) {
			throw new Error(`No API version ${version} found.`);
		}

		return new ApiImpl({ model: this._model, cloneManager: this._cloneManager });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/api/git.d.ts]---
Location: vscode-main/extensions/git/src/api/git.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri, Event, Disposable, ProviderResult, Command, CancellationToken, SourceControlHistoryItem } from 'vscode';
export { ProviderResult } from 'vscode';

export interface Git {
	readonly path: string;
}

export interface InputBox {
	value: string;
}

export const enum ForcePushMode {
	Force,
	ForceWithLease,
	ForceWithLeaseIfIncludes,
}

export const enum RefType {
	Head,
	RemoteHead,
	Tag
}

export interface Ref {
	readonly type: RefType;
	readonly name?: string;
	readonly commit?: string;
	readonly commitDetails?: Commit;
	readonly remote?: string;
}

export interface UpstreamRef {
	readonly remote: string;
	readonly name: string;
	readonly commit?: string;
}

export interface Branch extends Ref {
	readonly upstream?: UpstreamRef;
	readonly ahead?: number;
	readonly behind?: number;
}

export interface CommitShortStat {
	readonly files: number;
	readonly insertions: number;
	readonly deletions: number;
}

export interface Commit {
	readonly hash: string;
	readonly message: string;
	readonly parents: string[];
	readonly authorDate?: Date;
	readonly authorName?: string;
	readonly authorEmail?: string;
	readonly commitDate?: Date;
	readonly shortStat?: CommitShortStat;
}

export interface Submodule {
	readonly name: string;
	readonly path: string;
	readonly url: string;
}

export interface Remote {
	readonly name: string;
	readonly fetchUrl?: string;
	readonly pushUrl?: string;
	readonly isReadOnly: boolean;
}

export interface Worktree {
	readonly name: string;
	readonly path: string;
	readonly ref: string;
	readonly detached: boolean;
	readonly commitDetails?: Commit;
}

export const enum Status {
	INDEX_MODIFIED,
	INDEX_ADDED,
	INDEX_DELETED,
	INDEX_RENAMED,
	INDEX_COPIED,

	MODIFIED,
	DELETED,
	UNTRACKED,
	IGNORED,
	INTENT_TO_ADD,
	INTENT_TO_RENAME,
	TYPE_CHANGED,

	ADDED_BY_US,
	ADDED_BY_THEM,
	DELETED_BY_US,
	DELETED_BY_THEM,
	BOTH_ADDED,
	BOTH_DELETED,
	BOTH_MODIFIED
}

export interface Change {

	/**
	 * Returns either `originalUri` or `renameUri`, depending
	 * on whether this change is a rename change. When
	 * in doubt always use `uri` over the other two alternatives.
	 */
	readonly uri: Uri;
	readonly originalUri: Uri;
	readonly renameUri: Uri | undefined;
	readonly status: Status;
}

export interface RepositoryState {
	readonly HEAD: Branch | undefined;
	readonly refs: Ref[];
	readonly remotes: Remote[];
	readonly submodules: Submodule[];
	readonly rebaseCommit: Commit | undefined;

	readonly mergeChanges: Change[];
	readonly indexChanges: Change[];
	readonly workingTreeChanges: Change[];
	readonly untrackedChanges: Change[];

	readonly onDidChange: Event<void>;
}

export interface RepositoryUIState {
	readonly selected: boolean;
	readonly onDidChange: Event<void>;
}

/**
 * Log options.
 */
export interface LogOptions {
	/** Max number of log entries to retrieve. If not specified, the default is 32. */
	readonly maxEntries?: number;
	readonly path?: string;
	/** A commit range, such as "0a47c67f0fb52dd11562af48658bc1dff1d75a38..0bb4bdea78e1db44d728fd6894720071e303304f" */
	readonly range?: string;
	readonly reverse?: boolean;
	readonly sortByAuthorDate?: boolean;
	readonly shortStats?: boolean;
	readonly author?: string;
	readonly grep?: string;
	readonly refNames?: string[];
	readonly maxParents?: number;
	readonly skip?: number;
}

export interface CommitOptions {
	all?: boolean | 'tracked';
	amend?: boolean;
	signoff?: boolean;
	signCommit?: boolean;
	empty?: boolean;
	noVerify?: boolean;
	requireUserConfig?: boolean;
	useEditor?: boolean;
	verbose?: boolean;
	/**
	 * string    - execute the specified command after the commit operation
	 * undefined - execute the command specified in git.postCommitCommand
	 *             after the commit operation
	 * null      - do not execute any command after the commit operation
	 */
	postCommitCommand?: string | null;
}

export interface FetchOptions {
	remote?: string;
	ref?: string;
	all?: boolean;
	prune?: boolean;
	depth?: number;
}

export interface InitOptions {
	defaultBranch?: string;
}

export interface CloneOptions {
	parentPath?: Uri;
	/**
	 * ref is only used if the repository cache is missed.
	 */
	ref?: string;
	recursive?: boolean;
	/**
	 * If no postCloneAction is provided, then the users setting for git.openAfterClone is used.
	 */
	postCloneAction?: 'none';
}

export interface RefQuery {
	readonly contains?: string;
	readonly count?: number;
	readonly pattern?: string | string[];
	readonly sort?: 'alphabetically' | 'committerdate' | 'creatordate';
}

export interface BranchQuery extends RefQuery {
	readonly remote?: boolean;
}

export interface Repository {

	readonly rootUri: Uri;
	readonly inputBox: InputBox;
	readonly state: RepositoryState;
	readonly ui: RepositoryUIState;

	readonly onDidCommit: Event<void>;
	readonly onDidCheckout: Event<void>;

	getConfigs(): Promise<{ key: string; value: string; }[]>;
	getConfig(key: string): Promise<string>;
	setConfig(key: string, value: string): Promise<string>;
	unsetConfig(key: string): Promise<string>;
	getGlobalConfig(key: string): Promise<string>;

	getObjectDetails(treeish: string, path: string): Promise<{ mode: string, object: string, size: number }>;
	detectObjectType(object: string): Promise<{ mimetype: string, encoding?: string }>;
	buffer(ref: string, path: string): Promise<Buffer>;
	show(ref: string, path: string): Promise<string>;
	getCommit(ref: string): Promise<Commit>;

	add(paths: string[]): Promise<void>;
	revert(paths: string[]): Promise<void>;
	clean(paths: string[]): Promise<void>;

	apply(patch: string, reverse?: boolean): Promise<void>;
	diff(cached?: boolean): Promise<string>;
	diffWithHEAD(): Promise<Change[]>;
	diffWithHEAD(path: string): Promise<string>;
	diffWithHEADShortStats(path?: string): Promise<CommitShortStat>;
	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWithHEADShortStats(path?: string): Promise<CommitShortStat>;
	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffBlobs(object1: string, object2: string): Promise<string>;
	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;

	hashObject(data: string): Promise<string>;

	createBranch(name: string, checkout: boolean, ref?: string): Promise<void>;
	deleteBranch(name: string, force?: boolean): Promise<void>;
	getBranch(name: string): Promise<Branch>;
	getBranches(query: BranchQuery, cancellationToken?: CancellationToken): Promise<Ref[]>;
	getBranchBase(name: string): Promise<Branch | undefined>;
	setBranchUpstream(name: string, upstream: string): Promise<void>;

	checkIgnore(paths: string[]): Promise<Set<string>>;

	getRefs(query: RefQuery, cancellationToken?: CancellationToken): Promise<Ref[]>;

	getMergeBase(ref1: string, ref2: string): Promise<string | undefined>;

	tag(name: string, message: string, ref?: string | undefined): Promise<void>;
	deleteTag(name: string): Promise<void>;

	status(): Promise<void>;
	checkout(treeish: string): Promise<void>;

	addRemote(name: string, url: string): Promise<void>;
	removeRemote(name: string): Promise<void>;
	renameRemote(name: string, newName: string): Promise<void>;

	fetch(options?: FetchOptions): Promise<void>;
	fetch(remote?: string, ref?: string, depth?: number): Promise<void>;
	pull(unshallow?: boolean): Promise<void>;
	push(remoteName?: string, branchName?: string, setUpstream?: boolean, force?: ForcePushMode): Promise<void>;

	blame(path: string): Promise<string>;
	log(options?: LogOptions): Promise<Commit[]>;

	commit(message: string, opts?: CommitOptions): Promise<void>;
	merge(ref: string): Promise<void>;
	mergeAbort(): Promise<void>;

	createStash(options?: { message?: string; includeUntracked?: boolean; staged?: boolean }): Promise<void>;
	applyStash(index?: number): Promise<void>;
	popStash(index?: number): Promise<void>;
	dropStash(index?: number): Promise<void>;

	createWorktree(options?: { path?: string; commitish?: string; branch?: string }): Promise<string>;
	deleteWorktree(path: string, options?: { force?: boolean }): Promise<void>;

	migrateChanges(sourceRepositoryPath: string, options?: { confirmation?: boolean; deleteFromSource?: boolean; untracked?: boolean }): Promise<void>;
}

export interface RemoteSource {
	readonly name: string;
	readonly description?: string;
	readonly url: string | string[];
}

export interface RemoteSourceProvider {
	readonly name: string;
	readonly icon?: string; // codicon name
	readonly supportsQuery?: boolean;
	getRemoteSources(query?: string): ProviderResult<RemoteSource[]>;
	getBranches?(url: string): ProviderResult<string[]>;
	publishRepository?(repository: Repository): Promise<void>;
}

export interface RemoteSourcePublisher {
	readonly name: string;
	readonly icon?: string; // codicon name
	publishRepository(repository: Repository): Promise<void>;
}

export interface Credentials {
	readonly username: string;
	readonly password: string;
}

export interface CredentialsProvider {
	getCredentials(host: Uri): ProviderResult<Credentials>;
}

export interface PostCommitCommandsProvider {
	getCommands(repository: Repository): Command[];
}

export interface PushErrorHandler {
	handlePushError(repository: Repository, remote: Remote, refspec: string, error: Error & { gitErrorCode: GitErrorCodes }): Promise<boolean>;
}

export interface BranchProtection {
	readonly remote: string;
	readonly rules: BranchProtectionRule[];
}

export interface BranchProtectionRule {
	readonly include?: string[];
	readonly exclude?: string[];
}

export interface BranchProtectionProvider {
	onDidChangeBranchProtection: Event<Uri>;
	provideBranchProtection(): BranchProtection[];
}

export interface AvatarQueryCommit {
	readonly hash: string;
	readonly authorName?: string;
	readonly authorEmail?: string;
}

export interface AvatarQuery {
	readonly commits: AvatarQueryCommit[];
	readonly size: number;
}

export interface SourceControlHistoryItemDetailsProvider {
	provideAvatar(repository: Repository, query: AvatarQuery): ProviderResult<Map<string, string | undefined>>;
	provideHoverCommands(repository: Repository): ProviderResult<Command[]>;
	provideMessageLinks(repository: Repository, message: string): ProviderResult<string>;
}

export type APIState = 'uninitialized' | 'initialized';

export interface PublishEvent {
	repository: Repository;
	branch?: string;
}

export interface API {
	readonly state: APIState;
	readonly onDidChangeState: Event<APIState>;
	readonly onDidPublish: Event<PublishEvent>;
	readonly git: Git;
	readonly repositories: Repository[];
	readonly onDidOpenRepository: Event<Repository>;
	readonly onDidCloseRepository: Event<Repository>;

	toGitUri(uri: Uri, ref: string): Uri;
	getRepository(uri: Uri): Repository | null;
	getRepositoryRoot(uri: Uri): Promise<Uri | null>;
	getRepositoryWorkspace(uri: Uri): Promise<Uri[] | null>;
	init(root: Uri, options?: InitOptions): Promise<Repository | null>;
	/**
	 * Checks the cache of known cloned repositories, and clones if the repository is not found.
	 * Make sure to pass `postCloneAction` 'none' if you want to have the uri where you can find the repository returned.
	 * @returns The URI of a folder or workspace file which, when opened, will open the cloned repository.
	 */
	clone(uri: Uri, options?: CloneOptions): Promise<Uri | null>;
	openRepository(root: Uri): Promise<Repository | null>;

	registerRemoteSourcePublisher(publisher: RemoteSourcePublisher): Disposable;
	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable;
	registerCredentialsProvider(provider: CredentialsProvider): Disposable;
	registerPostCommitCommandsProvider(provider: PostCommitCommandsProvider): Disposable;
	registerPushErrorHandler(handler: PushErrorHandler): Disposable;
	registerBranchProtectionProvider(root: Uri, provider: BranchProtectionProvider): Disposable;
	registerSourceControlHistoryItemDetailsProvider(provider: SourceControlHistoryItemDetailsProvider): Disposable;
}

export interface GitExtension {

	readonly enabled: boolean;
	readonly onDidChangeEnablement: Event<boolean>;

	/**
	 * Returns a specific API version.
	 *
	 * Throws error if git extension is disabled. You can listen to the
	 * [GitExtension.onDidChangeEnablement](#GitExtension.onDidChangeEnablement) event
	 * to know when the extension becomes enabled/disabled.
	 *
	 * @param version Version number.
	 * @returns API instance
	 */
	getAPI(version: 1): API;
}

export const enum GitErrorCodes {
	BadConfigFile = 'BadConfigFile',
	BadRevision = 'BadRevision',
	AuthenticationFailed = 'AuthenticationFailed',
	NoUserNameConfigured = 'NoUserNameConfigured',
	NoUserEmailConfigured = 'NoUserEmailConfigured',
	NoRemoteRepositorySpecified = 'NoRemoteRepositorySpecified',
	NotAGitRepository = 'NotAGitRepository',
	NotASafeGitRepository = 'NotASafeGitRepository',
	NotAtRepositoryRoot = 'NotAtRepositoryRoot',
	Conflict = 'Conflict',
	StashConflict = 'StashConflict',
	UnmergedChanges = 'UnmergedChanges',
	PushRejected = 'PushRejected',
	ForcePushWithLeaseRejected = 'ForcePushWithLeaseRejected',
	ForcePushWithLeaseIfIncludesRejected = 'ForcePushWithLeaseIfIncludesRejected',
	RemoteConnectionError = 'RemoteConnectionError',
	DirtyWorkTree = 'DirtyWorkTree',
	CantOpenResource = 'CantOpenResource',
	GitNotFound = 'GitNotFound',
	CantCreatePipe = 'CantCreatePipe',
	PermissionDenied = 'PermissionDenied',
	CantAccessRemote = 'CantAccessRemote',
	RepositoryNotFound = 'RepositoryNotFound',
	RepositoryIsLocked = 'RepositoryIsLocked',
	BranchNotFullyMerged = 'BranchNotFullyMerged',
	NoRemoteReference = 'NoRemoteReference',
	InvalidBranchName = 'InvalidBranchName',
	BranchAlreadyExists = 'BranchAlreadyExists',
	NoLocalChanges = 'NoLocalChanges',
	NoStashFound = 'NoStashFound',
	LocalChangesOverwritten = 'LocalChangesOverwritten',
	NoUpstreamBranch = 'NoUpstreamBranch',
	IsInSubmodule = 'IsInSubmodule',
	WrongCase = 'WrongCase',
	CantLockRef = 'CantLockRef',
	CantRebaseMultipleBranches = 'CantRebaseMultipleBranches',
	PatchDoesNotApply = 'PatchDoesNotApply',
	NoPathFound = 'NoPathFound',
	UnknownPath = 'UnknownPath',
	EmptyCommitMessage = 'EmptyCommitMessage',
	BranchFastForwardRejected = 'BranchFastForwardRejected',
	BranchNotYetBorn = 'BranchNotYetBorn',
	TagConflict = 'TagConflict',
	CherryPickEmpty = 'CherryPickEmpty',
	CherryPickConflict = 'CherryPickConflict',
	WorktreeContainsChanges = 'WorktreeContainsChanges',
	WorktreeAlreadyExists = 'WorktreeAlreadyExists',
	WorktreeBranchAlreadyUsed = 'WorktreeBranchAlreadyUsed'
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/ipc/ipcClient.ts]---
Location: vscode-main/extensions/git/src/ipc/ipcClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as http from 'http';

export class IPCClient {

	private ipcHandlePath: string;

	constructor(private handlerName: string) {
		const ipcHandlePath = process.env['VSCODE_GIT_IPC_HANDLE'];

		if (!ipcHandlePath) {
			throw new Error('Missing VSCODE_GIT_IPC_HANDLE');
		}

		this.ipcHandlePath = ipcHandlePath;
	}

	call(request: unknown): Promise<unknown> {
		const opts: http.RequestOptions = {
			socketPath: this.ipcHandlePath,
			path: `/${this.handlerName}`,
			method: 'POST'
		};

		return new Promise((c, e) => {
			const req = http.request(opts, res => {
				if (res.statusCode !== 200) {
					return e(new Error(`Bad status code: ${res.statusCode}`));
				}

				const chunks: Buffer[] = [];
				res.on('data', d => chunks.push(d));
				res.on('end', () => c(JSON.parse(Buffer.concat(chunks).toString('utf8'))));
			});

			req.on('error', err => e(err));
			req.write(JSON.stringify(request));
			req.end();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/ipc/ipcServer.ts]---
Location: vscode-main/extensions/git/src/ipc/ipcServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vscode';
import { ITerminalEnvironmentProvider } from '../terminal';
import { toDisposable } from '../util';
import * as path from 'path';
import * as http from 'http';
import * as os from 'os';
import * as fs from 'fs';
import * as crypto from 'crypto';

function getIPCHandlePath(id: string): string {
	if (process.platform === 'win32') {
		return `\\\\.\\pipe\\vscode-git-${id}-sock`;
	}

	if (process.platform !== 'darwin' && process.env['XDG_RUNTIME_DIR']) {
		return path.join(process.env['XDG_RUNTIME_DIR'] as string, `vscode-git-${id}.sock`);
	}

	return path.join(os.tmpdir(), `vscode-git-${id}.sock`);
}

export interface IIPCHandler {
	handle(request: unknown): Promise<unknown>;
}

export async function createIPCServer(context?: string): Promise<IPCServer> {
	const server = http.createServer();
	const hash = crypto.createHash('sha256');

	if (!context) {
		const buffer = await new Promise<Buffer>((c, e) => crypto.randomBytes(20, (err, buf) => err ? e(err) : c(buf)));
		hash.update(buffer);
	} else {
		hash.update(context);
	}

	const ipcHandlePath = getIPCHandlePath(hash.digest('hex').substring(0, 10));

	if (process.platform !== 'win32') {
		try {
			await fs.promises.unlink(ipcHandlePath);
		} catch {
			// noop
		}
	}

	return new Promise((c, e) => {
		try {
			server.on('error', err => e(err));
			server.listen(ipcHandlePath);
			c(new IPCServer(server, ipcHandlePath));
		} catch (err) {
			e(err);
		}
	});
}

export interface IIPCServer extends Disposable {
	readonly ipcHandlePath: string | undefined;
	getEnv(): { [key: string]: string };
	registerHandler(name: string, handler: IIPCHandler): Disposable;
}

export class IPCServer implements IIPCServer, ITerminalEnvironmentProvider, Disposable {

	private handlers = new Map<string, IIPCHandler>();
	get ipcHandlePath(): string { return this._ipcHandlePath; }

	constructor(private server: http.Server, private _ipcHandlePath: string) {
		this.server.on('request', this.onRequest.bind(this));
	}

	registerHandler(name: string, handler: IIPCHandler): Disposable {
		this.handlers.set(`/${name}`, handler);
		return toDisposable(() => this.handlers.delete(name));
	}

	private onRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
		if (!req.url) {
			console.warn(`Request lacks url`);
			return;
		}

		const handler = this.handlers.get(req.url);

		if (!handler) {
			console.warn(`IPC handler for ${req.url} not found`);
			return;
		}

		const chunks: Buffer[] = [];
		req.on('data', d => chunks.push(d));
		req.on('end', () => {
			const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
			handler.handle(request).then(result => {
				res.writeHead(200);
				res.end(JSON.stringify(result));
			}, () => {
				res.writeHead(500);
				res.end();
			});
		});
	}

	getEnv(): { [key: string]: string } {
		return { VSCODE_GIT_IPC_HANDLE: this.ipcHandlePath };
	}

	getTerminalEnv(): { [key: string]: string } {
		return { VSCODE_GIT_IPC_HANDLE: this.ipcHandlePath };
	}

	dispose(): void {
		this.handlers.clear();
		this.server.close();

		if (this._ipcHandlePath && process.platform !== 'win32') {
			fs.unlinkSync(this._ipcHandlePath);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/test/git.test.ts]---
Location: vscode-main/extensions/git/src/test/git.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import { GitStatusParser, parseGitCommits, parseGitmodules, parseLsTree, parseLsFiles, parseGitRemotes } from '../git';
import * as assert from 'assert';
import { splitInChunks } from '../util';

suite('git', () => {
	suite('GitStatusParser', () => {
		test('empty parser', () => {
			const parser = new GitStatusParser();
			assert.deepStrictEqual(parser.status, []);
		});

		test('empty parser 2', () => {
			const parser = new GitStatusParser();
			parser.update('');
			assert.deepStrictEqual(parser.status, []);
		});

		test('simple', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('simple 2', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt\0');
			parser.update('?? file2.txt\0');
			parser.update('?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('empty lines', () => {
			const parser = new GitStatusParser();
			parser.update('');
			parser.update('?? file.txt\0');
			parser.update('');
			parser.update('');
			parser.update('?? file2.txt\0');
			parser.update('');
			parser.update('?? file3.txt\0');
			parser.update('');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('combined', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt\0?? file2.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('split 1', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt\0?? file2');
			parser.update('.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('split 2', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt');
			parser.update('\0?? file2.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('split 3', () => {
			const parser = new GitStatusParser();
			parser.update('?? file.txt\0?? file2.txt\0?? file3.txt');
			parser.update('\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('rename', () => {
			const parser = new GitStatusParser();
			parser.update('R  newfile.txt\0file.txt\0?? file2.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: 'newfile.txt', x: 'R', y: ' ' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('rename split', () => {
			const parser = new GitStatusParser();
			parser.update('R  newfile.txt\0fil');
			parser.update('e.txt\0?? file2.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file.txt', rename: 'newfile.txt', x: 'R', y: ' ' },
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});

		test('rename split 3', () => {
			const parser = new GitStatusParser();
			parser.update('?? file2.txt\0R  new');
			parser.update('file.txt\0fil');
			parser.update('e.txt\0?? file3.txt\0');
			assert.deepStrictEqual(parser.status, [
				{ path: 'file2.txt', rename: undefined, x: '?', y: '?' },
				{ path: 'file.txt', rename: 'newfile.txt', x: 'R', y: ' ' },
				{ path: 'file3.txt', rename: undefined, x: '?', y: '?' }
			]);
		});
	});

	suite('parseGitmodules', () => {
		test('empty', () => {
			assert.deepStrictEqual(parseGitmodules(''), []);
		});

		test('sample', () => {
			const sample = `[submodule "deps/spdlog"]
	path = deps/spdlog
	url = https://github.com/gabime/spdlog.git
`;

			assert.deepStrictEqual(parseGitmodules(sample), [
				{ name: 'deps/spdlog', path: 'deps/spdlog', url: 'https://github.com/gabime/spdlog.git' }
			]);
		});

		test('big', () => {
			const sample = `[submodule "deps/spdlog"]
	path = deps/spdlog
	url = https://github.com/gabime/spdlog.git
[submodule "deps/spdlog2"]
	path = deps/spdlog2
	url = https://github.com/gabime/spdlog.git
[submodule "deps/spdlog3"]
	path = deps/spdlog3
	url = https://github.com/gabime/spdlog.git
[submodule "deps/spdlog4"]
	path = deps/spdlog4
	url = https://github.com/gabime/spdlog4.git
`;

			assert.deepStrictEqual(parseGitmodules(sample), [
				{ name: 'deps/spdlog', path: 'deps/spdlog', url: 'https://github.com/gabime/spdlog.git' },
				{ name: 'deps/spdlog2', path: 'deps/spdlog2', url: 'https://github.com/gabime/spdlog.git' },
				{ name: 'deps/spdlog3', path: 'deps/spdlog3', url: 'https://github.com/gabime/spdlog.git' },
				{ name: 'deps/spdlog4', path: 'deps/spdlog4', url: 'https://github.com/gabime/spdlog4.git' }
			]);
		});

		test('whitespace #74844', () => {
			const sample = `[submodule "deps/spdlog"]
	path = deps/spdlog
	url  = https://github.com/gabime/spdlog.git
`;

			assert.deepStrictEqual(parseGitmodules(sample), [
				{ name: 'deps/spdlog', path: 'deps/spdlog', url: 'https://github.com/gabime/spdlog.git' }
			]);
		});

		test('whitespace again #108371', () => {
			const sample = `[submodule "deps/spdlog"]
	path= deps/spdlog
	url=https://github.com/gabime/spdlog.git
`;

			assert.deepStrictEqual(parseGitmodules(sample), [
				{ name: 'deps/spdlog', path: 'deps/spdlog', url: 'https://github.com/gabime/spdlog.git' }
			]);
		});
	});

	suite('parseGitRemotes', () => {
		test('empty', () => {
			assert.deepStrictEqual(parseGitRemotes(''), []);
		});

		test('single remote', () => {
			const sample = `[remote "origin"]
	url = https://github.com/microsoft/vscode.git
	fetch = +refs/heads/*:refs/remotes/origin/*
`;

			assert.deepStrictEqual(parseGitRemotes(sample), [
				{ name: 'origin', fetchUrl: 'https://github.com/microsoft/vscode.git', pushUrl: 'https://github.com/microsoft/vscode.git', isReadOnly: false }
			]);
		});

		test('single remote (multiple urls)', () => {
			const sample = `[remote "origin"]
	url = https://github.com/microsoft/vscode.git
	url = https://github.com/microsoft/vscode2.git
	fetch = +refs/heads/*:refs/remotes/origin/*
`;

			assert.deepStrictEqual(parseGitRemotes(sample), [
				{ name: 'origin', fetchUrl: 'https://github.com/microsoft/vscode.git', pushUrl: 'https://github.com/microsoft/vscode.git', isReadOnly: false }
			]);
		});

		test('multiple remotes', () => {
			const sample = `[remote "origin"]
	url = https://github.com/microsoft/vscode.git
	pushurl = https://github.com/microsoft/vscode1.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[remote "remote2"]
	url = https://github.com/microsoft/vscode2.git
	fetch = +refs/heads/*:refs/remotes/origin/*
`;

			assert.deepStrictEqual(parseGitRemotes(sample), [
				{ name: 'origin', fetchUrl: 'https://github.com/microsoft/vscode.git', pushUrl: 'https://github.com/microsoft/vscode1.git', isReadOnly: false },
				{ name: 'remote2', fetchUrl: 'https://github.com/microsoft/vscode2.git', pushUrl: 'https://github.com/microsoft/vscode2.git', isReadOnly: false }
			]);
		});

		test('remotes (white space)', () => {
			const sample = ` [remote "origin"]
	url  =  https://github.com/microsoft/vscode.git
	pushurl=https://github.com/microsoft/vscode1.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[ remote"remote2"]
	url = https://github.com/microsoft/vscode2.git
	fetch = +refs/heads/*:refs/remotes/origin/*
`;

			assert.deepStrictEqual(parseGitRemotes(sample), [
				{ name: 'origin', fetchUrl: 'https://github.com/microsoft/vscode.git', pushUrl: 'https://github.com/microsoft/vscode1.git', isReadOnly: false },
				{ name: 'remote2', fetchUrl: 'https://github.com/microsoft/vscode2.git', pushUrl: 'https://github.com/microsoft/vscode2.git', isReadOnly: false }
			]);
		});

		test('remotes (invalid section)', () => {
			const sample = `[remote "origin"
	url = https://github.com/microsoft/vscode.git
	pushurl = https://github.com/microsoft/vscode1.git
	fetch = +refs/heads/*:refs/remotes/origin/*
`;

			assert.deepStrictEqual(parseGitRemotes(sample), []);
		});
	});

	suite('parseGitCommit', () => {
		test('single parent commit', function () {
			const GIT_OUTPUT_SINGLE_PARENT =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main', 'branch'],
				shortStat: undefined
			}]);
		});

		test('multiple parent commits', function () {
			const GIT_OUTPUT_MULTIPLE_PARENTS =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554 df27d8c75b129ab9b178b386077da2822101b217\n' +
				'main\n' +
				'This is a commit message.\x00';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_MULTIPLE_PARENTS), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554', 'df27d8c75b129ab9b178b386077da2822101b217'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main'],
				shortStat: undefined
			}]);
		});

		test('no parent commits', function () {
			const GIT_OUTPUT_NO_PARENTS =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'\n' +
				'main\n' +
				'This is a commit message.\x00';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_NO_PARENTS), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: [],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main'],
				shortStat: undefined
			}]);
		});

		test('commit with shortstat', function () {
			const GIT_OUTPUT_SINGLE_PARENT =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00\n' +
				' 1 file changed, 2 insertions(+), 3 deletion(-)';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main', 'branch'],
				shortStat: {
					deletions: 3,
					files: 1,
					insertions: 2
				}
			}]);
		});

		test('commit with shortstat (no insertions)', function () {
			const GIT_OUTPUT_SINGLE_PARENT =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00\n' +
				' 1 file changed, 3 deletion(-)';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main', 'branch'],
				shortStat: {
					deletions: 3,
					files: 1,
					insertions: 0
				}
			}]);
		});

		test('commit with shortstat (no deletions)', function () {
			const GIT_OUTPUT_SINGLE_PARENT =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00\n' +
				' 1 file changed, 2 insertions(+)';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main', 'branch'],
				shortStat: {
					deletions: 0,
					files: 1,
					insertions: 2
				}
			}]);
		});

		test('commit list', function () {
			const GIT_OUTPUT_SINGLE_PARENT =
				'52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00\n' +
				'52c293a05038d865604c2284aa8698bd087915a2\n' +
				'Jane Doe\n' +
				'jane.doe@mail.com\n' +
				'1580811032\n' +
				'1580811033\n' +
				'8e5a374372b8393906c7e380dbb09349c5385555\n' +
				'main,branch\n' +
				'This is another commit message.\x00';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [
				{
					hash: '52c293a05038d865604c2284aa8698bd087915a1',
					message: 'This is a commit message.',
					parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
					authorDate: new Date(1580811030000),
					authorName: 'John Doe',
					authorEmail: 'john.doe@mail.com',
					commitDate: new Date(1580811031000),
					refNames: ['main', 'branch'],
					shortStat: undefined,
				},
				{
					hash: '52c293a05038d865604c2284aa8698bd087915a2',
					message: 'This is another commit message.',
					parents: ['8e5a374372b8393906c7e380dbb09349c5385555'],
					authorDate: new Date(1580811032000),
					authorName: 'Jane Doe',
					authorEmail: 'jane.doe@mail.com',
					commitDate: new Date(1580811033000),
					refNames: ['main', 'branch'],
					shortStat: undefined,
				},
			]);
		});

		test('commit list with shortstat', function () {
			const GIT_OUTPUT_SINGLE_PARENT = '52c293a05038d865604c2284aa8698bd087915a1\n' +
				'John Doe\n' +
				'john.doe@mail.com\n' +
				'1580811030\n' +
				'1580811031\n' +
				'8e5a374372b8393906c7e380dbb09349c5385554\n' +
				'main,branch\n' +
				'This is a commit message.\x00\n' +
				' 5 file changed, 12 insertions(+), 13 deletion(-)\n' +
				'52c293a05038d865604c2284aa8698bd087915a2\n' +
				'Jane Doe\n' +
				'jane.doe@mail.com\n' +
				'1580811032\n' +
				'1580811033\n' +
				'8e5a374372b8393906c7e380dbb09349c5385555\n' +
				'main,branch\n' +
				'This is another commit message.\x00\n' +
				' 6 file changed, 22 insertions(+), 23 deletion(-)';

			assert.deepStrictEqual(parseGitCommits(GIT_OUTPUT_SINGLE_PARENT), [{
				hash: '52c293a05038d865604c2284aa8698bd087915a1',
				message: 'This is a commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385554'],
				authorDate: new Date(1580811030000),
				authorName: 'John Doe',
				authorEmail: 'john.doe@mail.com',
				commitDate: new Date(1580811031000),
				refNames: ['main', 'branch'],
				shortStat: {
					deletions: 13,
					files: 5,
					insertions: 12
				}
			},
			{
				hash: '52c293a05038d865604c2284aa8698bd087915a2',
				message: 'This is another commit message.',
				parents: ['8e5a374372b8393906c7e380dbb09349c5385555'],
				authorDate: new Date(1580811032000),
				authorName: 'Jane Doe',
				authorEmail: 'jane.doe@mail.com',
				commitDate: new Date(1580811033000),
				refNames: ['main', 'branch'],
				shortStat: {
					deletions: 23,
					files: 6,
					insertions: 22
				}
			}]);
		});
	});

	suite('parseLsTree', function () {
		test('sample', function () {
			const input = `040000 tree 0274a81f8ee9ca3669295dc40f510bd2021d0043       -	.vscode
100644 blob 1d487c1817262e4f20efbfa1d04c18f51b0046f6  491570	Screen Shot 2018-06-01 at 14.48.05.png
100644 blob 686c16e4f019b734655a2576ce8b98749a9ffdb9  764420	Screen Shot 2018-06-07 at 20.04.59.png
100644 blob 257cc5642cb1a054f08cc83f2d943e56fd3ebe99       4	boom.txt
100644 blob 86dc360dd25f13fa50ffdc8259e9653921f4f2b7      11	boomcaboom.txt
100644 blob a68b14060589b16d7ac75f67b905c918c03c06eb      24	file.js
100644 blob f7bcfb05af46850d780f88c069edcd57481d822d     201	file.md
100644 blob ab8b86114a051f6490f1ec5e3141b9a632fb46b5       8	hello.js
100644 blob 257cc5642cb1a054f08cc83f2d943e56fd3ebe99       4	what.js
100644 blob be859e3f412fa86513cd8bebe8189d1ea1a3e46d      24	what.txt
100644 blob 56ec42c9dc6fcf4534788f0fe34b36e09f37d085  261186	what.txt2`;

			const output = parseLsTree(input);

			assert.deepStrictEqual(output, [
				{ mode: '040000', type: 'tree', object: '0274a81f8ee9ca3669295dc40f510bd2021d0043', size: '-', file: '.vscode' },
				{ mode: '100644', type: 'blob', object: '1d487c1817262e4f20efbfa1d04c18f51b0046f6', size: '491570', file: 'Screen Shot 2018-06-01 at 14.48.05.png' },
				{ mode: '100644', type: 'blob', object: '686c16e4f019b734655a2576ce8b98749a9ffdb9', size: '764420', file: 'Screen Shot 2018-06-07 at 20.04.59.png' },
				{ mode: '100644', type: 'blob', object: '257cc5642cb1a054f08cc83f2d943e56fd3ebe99', size: '4', file: 'boom.txt' },
				{ mode: '100644', type: 'blob', object: '86dc360dd25f13fa50ffdc8259e9653921f4f2b7', size: '11', file: 'boomcaboom.txt' },
				{ mode: '100644', type: 'blob', object: 'a68b14060589b16d7ac75f67b905c918c03c06eb', size: '24', file: 'file.js' },
				{ mode: '100644', type: 'blob', object: 'f7bcfb05af46850d780f88c069edcd57481d822d', size: '201', file: 'file.md' },
				{ mode: '100644', type: 'blob', object: 'ab8b86114a051f6490f1ec5e3141b9a632fb46b5', size: '8', file: 'hello.js' },
				{ mode: '100644', type: 'blob', object: '257cc5642cb1a054f08cc83f2d943e56fd3ebe99', size: '4', file: 'what.js' },
				{ mode: '100644', type: 'blob', object: 'be859e3f412fa86513cd8bebe8189d1ea1a3e46d', size: '24', file: 'what.txt' },
				{ mode: '100644', type: 'blob', object: '56ec42c9dc6fcf4534788f0fe34b36e09f37d085', size: '261186', file: 'what.txt2' }
			]);
		});
	});

	suite('parseLsFiles', function () {
		test('sample', function () {
			const input = `100644 7a73a41bfdf76d6f793007240d80983a52f15f97 0	.vscode/settings.json
100644 1d487c1817262e4f20efbfa1d04c18f51b0046f6 0	Screen Shot 2018-06-01 at 14.48.05.png
100644 686c16e4f019b734655a2576ce8b98749a9ffdb9 0	Screen Shot 2018-06-07 at 20.04.59.png
100644 257cc5642cb1a054f08cc83f2d943e56fd3ebe99 0	boom.txt
100644 86dc360dd25f13fa50ffdc8259e9653921f4f2b7 0	boomcaboom.txt
100644 a68b14060589b16d7ac75f67b905c918c03c06eb 0	file.js
100644 f7bcfb05af46850d780f88c069edcd57481d822d 0	file.md
100644 ab8b86114a051f6490f1ec5e3141b9a632fb46b5 0	hello.js
100644 257cc5642cb1a054f08cc83f2d943e56fd3ebe99 0	what.js
100644 be859e3f412fa86513cd8bebe8189d1ea1a3e46d 0	what.txt
100644 56ec42c9dc6fcf4534788f0fe34b36e09f37d085 0	what.txt2`;

			const output = parseLsFiles(input);

			assert.deepStrictEqual(output, [
				{ mode: '100644', object: '7a73a41bfdf76d6f793007240d80983a52f15f97', stage: '0', file: '.vscode/settings.json' },
				{ mode: '100644', object: '1d487c1817262e4f20efbfa1d04c18f51b0046f6', stage: '0', file: 'Screen Shot 2018-06-01 at 14.48.05.png' },
				{ mode: '100644', object: '686c16e4f019b734655a2576ce8b98749a9ffdb9', stage: '0', file: 'Screen Shot 2018-06-07 at 20.04.59.png' },
				{ mode: '100644', object: '257cc5642cb1a054f08cc83f2d943e56fd3ebe99', stage: '0', file: 'boom.txt' },
				{ mode: '100644', object: '86dc360dd25f13fa50ffdc8259e9653921f4f2b7', stage: '0', file: 'boomcaboom.txt' },
				{ mode: '100644', object: 'a68b14060589b16d7ac75f67b905c918c03c06eb', stage: '0', file: 'file.js' },
				{ mode: '100644', object: 'f7bcfb05af46850d780f88c069edcd57481d822d', stage: '0', file: 'file.md' },
				{ mode: '100644', object: 'ab8b86114a051f6490f1ec5e3141b9a632fb46b5', stage: '0', file: 'hello.js' },
				{ mode: '100644', object: '257cc5642cb1a054f08cc83f2d943e56fd3ebe99', stage: '0', file: 'what.js' },
				{ mode: '100644', object: 'be859e3f412fa86513cd8bebe8189d1ea1a3e46d', stage: '0', file: 'what.txt' },
				{ mode: '100644', object: '56ec42c9dc6fcf4534788f0fe34b36e09f37d085', stage: '0', file: 'what.txt2' },
			]);
		});
	});

	suite('splitInChunks', () => {
		test('unit tests', function () {
			assert.deepStrictEqual(
				[...splitInChunks(['hello', 'there', 'cool', 'stuff'], 6)],
				[['hello'], ['there'], ['cool'], ['stuff']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['hello', 'there', 'cool', 'stuff'], 10)],
				[['hello', 'there'], ['cool', 'stuff']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['hello', 'there', 'cool', 'stuff'], 12)],
				[['hello', 'there'], ['cool', 'stuff']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['hello', 'there', 'cool', 'stuff'], 14)],
				[['hello', 'there', 'cool'], ['stuff']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['hello', 'there', 'cool', 'stuff'], 2000)],
				[['hello', 'there', 'cool', 'stuff']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 1)],
				[['0'], ['01'], ['012'], ['0'], ['01'], ['012'], ['0'], ['01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 2)],
				[['0'], ['01'], ['012'], ['0'], ['01'], ['012'], ['0'], ['01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 3)],
				[['0', '01'], ['012'], ['0', '01'], ['012'], ['0', '01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 4)],
				[['0', '01'], ['012', '0'], ['01'], ['012', '0'], ['01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 5)],
				[['0', '01'], ['012', '0'], ['01', '012'], ['0', '01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 6)],
				[['0', '01', '012'], ['0', '01', '012'], ['0', '01', '012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 7)],
				[['0', '01', '012', '0'], ['01', '012', '0'], ['01', '012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 8)],
				[['0', '01', '012', '0'], ['01', '012', '0', '01'], ['012']]
			);

			assert.deepStrictEqual(
				[...splitInChunks(['0', '01', '012', '0', '01', '012', '0', '01', '012'], 9)],
				[['0', '01', '012', '0', '01'], ['012', '0', '01', '012']]
			);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/test/index.ts]---
Location: vscode-main/extensions/git/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

// These integration tests is being run in multiple environments (electron, web, remote)
// so we need to set the suite name based on the environment as the suite name is used
// for the test results file name
let suite = '';
if (process.env.VSCODE_BROWSER) {
	suite = `${process.env.VSCODE_BROWSER} Browser Integration Git Tests`;
} else if (process.env.REMOTE_VSCODE) {
	suite = 'Remote Integration Git Tests';
} else {
	suite = 'Integration Git Tests';
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

---[FILE: extensions/git/src/test/repositoryCache.test.ts]---
Location: vscode-main/extensions/git/src/test/repositoryCache.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { RepositoryCache } from '../repositoryCache';
import { Event, EventEmitter, LogLevel, LogOutputChannel, Memento, Uri, WorkspaceFolder } from 'vscode';

class InMemoryMemento implements Memento {
	private store = new Map<string, any>();

	constructor(initial?: Record<string, any>) {
		if (initial) {
			for (const k of Object.keys(initial)) {
				this.store.set(k, initial[k]);
			}
		}
	}

	get<T>(key: string): T | undefined;
	get<T>(key: string, defaultValue: T): T;
	get<T>(key: string, defaultValue?: T): T | undefined {
		if (this.store.has(key)) {
			return this.store.get(key);
		}
		return defaultValue as (T | undefined);
	}

	update(key: string, value: any): Thenable<void> {
		this.store.set(key, value);
		return Promise.resolve();
	}

	keys(): readonly string[] {
		return Array.from(this.store.keys());
	}
}

class MockLogOutputChannel implements LogOutputChannel {
	logLevel: LogLevel = LogLevel.Info;
	onDidChangeLogLevel: Event<LogLevel> = new EventEmitter<LogLevel>().event;
	trace(_message: string, ..._args: any[]): void { }
	debug(_message: string, ..._args: any[]): void { }
	info(_message: string, ..._args: any[]): void { }
	warn(_message: string, ..._args: any[]): void { }
	error(_error: string | Error, ..._args: any[]): void { }
	name: string = 'MockLogOutputChannel';
	append(_value: string): void { }
	appendLine(_value: string): void { }
	replace(_value: string): void { }
	clear(): void { }
	show(_column?: unknown, _preserveFocus?: unknown): void { }
	hide(): void { }
	dispose(): void { }
}

class TestRepositoryCache extends RepositoryCache {
	constructor(memento: Memento, logger: LogOutputChannel, private readonly _workspaceFileProp: Uri | undefined, private readonly _workspaceFoldersProp: readonly WorkspaceFolder[] | undefined) {
		super(memento, logger);
	}

	protected override get _workspaceFile() {
		return this._workspaceFileProp;
	}

	protected override get _workspaceFolders() {
		return this._workspaceFoldersProp;
	}
}

suite('RepositoryCache', () => {

	test('set & get basic', () => {
		const memento = new InMemoryMemento();
		const folder = Uri.file('/workspace/repo');
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, [{ uri: folder, name: 'workspace', index: 0 }]);

		cache.set('https://example.com/repo.git', folder.fsPath);
		const folders = cache.get('https://example.com/repo.git')!.map(folder => folder.workspacePath);
		assert.ok(folders, 'folders should be defined');
		assert.deepStrictEqual(folders, [folder.fsPath]);
	});

	test('inner LRU capped at 10 entries', () => {
		const memento = new InMemoryMemento();
		const workspaceFolders: WorkspaceFolder[] = [];
		for (let i = 1; i <= 12; i++) {
			workspaceFolders.push({ uri: Uri.file(`/ws/folder-${i.toString().padStart(2, '0')}`), name: `folder-${i.toString().padStart(2, '0')}`, index: i - 1 });
		}
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, workspaceFolders);
		const repo = 'https://example.com/repo.git';
		for (let i = 1; i <= 12; i++) {
			cache.set(repo, Uri.file(`/ws/folder-${i.toString().padStart(2, '0')}`).fsPath);
		}
		const folders = cache.get(repo)!.map(folder => folder.workspacePath);
		assert.strictEqual(folders.length, 10, 'should only retain 10 most recent folders');
		assert.ok(!folders.includes(Uri.file('/ws/folder-01').fsPath), 'oldest folder-01 should be evicted');
		assert.ok(!folders.includes(Uri.file('/ws/folder-02').fsPath), 'second oldest folder-02 should be evicted');
		assert.ok(folders.includes(Uri.file('/ws/folder-12').fsPath), 'latest folder should be present');
	});

	test('outer LRU capped at 30 repos', () => {
		const memento = new InMemoryMemento();
		const workspaceFolders: WorkspaceFolder[] = [];
		for (let i = 1; i <= 35; i++) {
			workspaceFolders.push({ uri: Uri.file(`/ws/r${i}`), name: `r${i}`, index: i - 1 });
		}
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, workspaceFolders);
		for (let i = 1; i <= 35; i++) {
			const repo = `https://example.com/r${i}.git`;
			cache.set(repo, Uri.file(`/ws/r${i}`).fsPath);
		}
		assert.strictEqual(cache.get('https://example.com/r1.git'), undefined, 'oldest repo should be trimmed');
		assert.ok(cache.get('https://example.com/r35.git'), 'newest repo should remain');
	});

	test('delete removes folder and prunes empty repo', () => {
		const memento = new InMemoryMemento();
		const workspaceFolders: WorkspaceFolder[] = [];
		workspaceFolders.push({ uri: Uri.file(`/ws/a`), name: `a`, index: 0 });
		workspaceFolders.push({ uri: Uri.file(`/ws/b`), name: `b`, index: 1 });

		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, workspaceFolders);
		const repo = 'https://example.com/repo.git';
		const a = Uri.file('/ws/a').fsPath;
		const b = Uri.file('/ws/b').fsPath;
		cache.set(repo, a);
		cache.set(repo, b);
		assert.deepStrictEqual(new Set(cache.get(repo)?.map(folder => folder.workspacePath)), new Set([a, b]));
		cache.delete(repo, a);
		assert.deepStrictEqual(cache.get(repo)!.map(folder => folder.workspacePath), [b]);
		cache.delete(repo, b);
		assert.strictEqual(cache.get(repo), undefined, 'repo should be pruned when last folder removed');
	});

	test('normalizes URLs with trailing .git', () => {
		const memento = new InMemoryMemento();
		const folder = Uri.file('/workspace/repo');
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, [{ uri: folder, name: 'workspace', index: 0 }]);

		// Set with .git extension
		cache.set('https://example.com/repo.git', folder.fsPath);

		// Should be able to get with or without .git
		const withGit = cache.get('https://example.com/repo.git');
		const withoutGit = cache.get('https://example.com/repo');

		assert.ok(withGit, 'should find repo when querying with .git');
		assert.ok(withoutGit, 'should find repo when querying without .git');
		assert.deepStrictEqual(withGit, withoutGit, 'should return same result regardless of .git suffix');
	});

	test('normalizes URLs with trailing slashes and .git', () => {
		const memento = new InMemoryMemento();
		const folder = Uri.file('/workspace/repo');
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, [{ uri: folder, name: 'workspace', index: 0 }]);

		// Set with .git and trailing slashes
		cache.set('https://example.com/repo.git///', folder.fsPath);

		// Should be able to get with various combinations
		const variations = [
			'https://example.com/repo.git///',
			'https://example.com/repo.git/',
			'https://example.com/repo.git',
			'https://example.com/repo/',
			'https://example.com/repo'
		];

		const results = variations.map(url => cache.get(url));

		// All should return the same non-undefined result
		assert.ok(results[0], 'should find repo with original URL');
		for (let i = 1; i < results.length; i++) {
			assert.deepStrictEqual(results[i], results[0], `variation ${variations[i]} should return same result`);
		}
	});

	test('handles URLs without .git correctly', () => {
		const memento = new InMemoryMemento();
		const folder = Uri.file('/workspace/repo');
		const cache = new TestRepositoryCache(memento, new MockLogOutputChannel(), undefined, [{ uri: folder, name: 'workspace', index: 0 }]);

		// Set without .git extension
		cache.set('https://example.com/repo', folder.fsPath);

		// Should be able to get with or without .git
		const withoutGit = cache.get('https://example.com/repo');
		const withGit = cache.get('https://example.com/repo.git');

		assert.ok(withoutGit, 'should find repo when querying without .git');
		assert.ok(withGit, 'should find repo when querying with .git');
		assert.deepStrictEqual(withoutGit, withGit, 'should return same result regardless of .git suffix');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/test/smoke.test.ts]---
Location: vscode-main/extensions/git/src/test/smoke.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import assert from 'assert';
import { workspace, commands, window, Uri, WorkspaceEdit, Range, TextDocument, extensions, TabInputTextDiff } from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { GitExtension, API, Repository, Status } from '../api/git';
import { eventToPromise } from '../util';

suite('git smoke test', function () {
	const cwd = workspace.workspaceFolders![0].uri.fsPath;

	function file(relativePath: string) {
		return path.join(cwd, relativePath);
	}

	function uri(relativePath: string) {
		return Uri.file(file(relativePath));
	}

	async function open(relativePath: string) {
		const doc = await workspace.openTextDocument(uri(relativePath));
		await window.showTextDocument(doc);
		return doc;
	}

	async function type(doc: TextDocument, text: string) {
		const edit = new WorkspaceEdit();
		const end = doc.lineAt(doc.lineCount - 1).range.end;
		edit.replace(doc.uri, new Range(end, end), text);
		await workspace.applyEdit(edit);
	}

	let git: API;
	let repository: Repository;

	suiteSetup(async function () {
		fs.writeFileSync(file('app.js'), 'hello', 'utf8');
		fs.writeFileSync(file('index.pug'), 'hello', 'utf8');
		cp.execSync('git init -b main', { cwd });
		cp.execSync('git config user.name testuser', { cwd });
		cp.execSync('git config user.email monacotools@example.com', { cwd });
		cp.execSync('git config commit.gpgsign false', { cwd });
		cp.execSync('git add .', { cwd });
		cp.execSync('git commit -m "initial commit"', { cwd });

		// make sure git is activated
		const ext = extensions.getExtension<GitExtension>('vscode.git');
		await ext?.activate();
		git = ext!.exports.getAPI(1);

		if (git.repositories.length === 0) {
			const onDidOpenRepository = eventToPromise(git.onDidOpenRepository);
			await commands.executeCommand('git.openRepository', cwd);
			await onDidOpenRepository;
		}

		assert.strictEqual(git.repositories.length, 1);
		assert.strictEqual(git.repositories[0].rootUri.fsPath, cwd);

		repository = git.repositories[0];
	});

	test('reflects working tree changes', async function () {
		await commands.executeCommand('workbench.view.scm');

		const appjs = await open('app.js');
		await type(appjs, ' world');
		await appjs.save();
		await repository.status();

		assert.strictEqual(repository.state.workingTreeChanges.length, 1);
		assert.strictEqual(repository.state.workingTreeChanges[0].uri.path, appjs.uri.path);
		assert.strictEqual(repository.state.workingTreeChanges[0].status, Status.MODIFIED);

		fs.writeFileSync(file('newfile.txt'), '');
		const newfile = await open('newfile.txt');
		await type(newfile, 'hey there');
		await newfile.save();
		await repository.status();

		assert.strictEqual(repository.state.workingTreeChanges.length, 2);
		assert.strictEqual(repository.state.workingTreeChanges[0].uri.path, appjs.uri.path);
		assert.strictEqual(repository.state.workingTreeChanges[0].status, Status.MODIFIED);
		assert.strictEqual(repository.state.workingTreeChanges[1].uri.path, newfile.uri.path);
		assert.strictEqual(repository.state.workingTreeChanges[1].status, Status.UNTRACKED);
	});

	test('opens diff editor', async function () {
		const appjs = uri('app.js');
		await commands.executeCommand('git.openChange', appjs);

		assert(window.activeTextEditor);
		assert.strictEqual(window.activeTextEditor!.document.uri.path, appjs.path);

		assert(window.tabGroups.activeTabGroup.activeTab);
		assert(window.tabGroups.activeTabGroup.activeTab!.input instanceof TabInputTextDiff);
	});

	test('stages correctly', async function () {
		const appjs = uri('app.js');
		const newfile = uri('newfile.txt');

		await repository.add([appjs.fsPath]);

		assert.strictEqual(repository.state.indexChanges.length, 1);
		assert.strictEqual(repository.state.indexChanges[0].uri.path, appjs.path);
		assert.strictEqual(repository.state.indexChanges[0].status, Status.INDEX_MODIFIED);

		assert.strictEqual(repository.state.workingTreeChanges.length, 1);
		assert.strictEqual(repository.state.workingTreeChanges[0].uri.path, newfile.path);
		assert.strictEqual(repository.state.workingTreeChanges[0].status, Status.UNTRACKED);

		await repository.revert([appjs.fsPath]);

		assert.strictEqual(repository.state.indexChanges.length, 0);

		assert.strictEqual(repository.state.workingTreeChanges.length, 2);
		assert.strictEqual(repository.state.workingTreeChanges[0].uri.path, appjs.path);
		assert.strictEqual(repository.state.workingTreeChanges[0].status, Status.MODIFIED);
		assert.strictEqual(repository.state.workingTreeChanges[1].uri.path, newfile.path);
		assert.strictEqual(repository.state.workingTreeChanges[1].status, Status.UNTRACKED);
	});

	test('stages, commits changes and verifies outgoing change', async function () {
		const appjs = uri('app.js');
		const newfile = uri('newfile.txt');

		await repository.add([appjs.fsPath]);
		await repository.commit('second commit');

		assert.strictEqual(repository.state.workingTreeChanges.length, 1);
		assert.strictEqual(repository.state.workingTreeChanges[0].uri.path, newfile.path);
		assert.strictEqual(repository.state.workingTreeChanges[0].status, Status.UNTRACKED);

		assert.strictEqual(repository.state.indexChanges.length, 0);

		await repository.commit('third commit', { all: true });

		assert.strictEqual(repository.state.workingTreeChanges.length, 0);
		assert.strictEqual(repository.state.indexChanges.length, 0);
	});

	test('rename/delete conflict', async function () {
		await commands.executeCommand('workbench.view.scm');

		const appjs = file('app.js');
		const renamejs = file('rename.js');

		await repository.createBranch('test', true);

		// Delete file (test branch)
		fs.unlinkSync(appjs);
		await repository.commit('commit on test', { all: true });

		await repository.checkout('main');

		// Rename file (main branch)
		fs.renameSync(appjs, renamejs);
		await repository.commit('commit on main', { all: true });

		try {
			await repository.merge('test');
		} catch (e) { }

		assert.strictEqual(repository.state.mergeChanges.length, 1);
		assert.strictEqual(repository.state.mergeChanges[0].status, Status.DELETED_BY_THEM);

		assert.strictEqual(repository.state.workingTreeChanges.length, 0);
		assert.strictEqual(repository.state.indexChanges.length, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/typings/git-base.d.ts]---
Location: vscode-main/extensions/git/src/typings/git-base.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, Disposable, Event, ProviderResult } from 'vscode';
export { ProviderResult } from 'vscode';

export interface API {
	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable;
	getRemoteSourceActions(url: string): Promise<RemoteSourceAction[]>;
	pickRemoteSource(options: PickRemoteSourceOptions): Promise<string | PickRemoteSourceResult | undefined>;
}

export interface GitBaseExtension {

	readonly enabled: boolean;
	readonly onDidChangeEnablement: Event<boolean>;

	/**
	 * Returns a specific API version.
	 *
	 * Throws error if git-base extension is disabled. You can listed to the
	 * [GitBaseExtension.onDidChangeEnablement](#GitBaseExtension.onDidChangeEnablement)
	 * event to know when the extension becomes enabled/disabled.
	 *
	 * @param version Version number.
	 * @returns API instance
	 */
	getAPI(version: 1): API;
}

export interface PickRemoteSourceOptions {
	readonly providerLabel?: (provider: RemoteSourceProvider) => string;
	readonly urlLabel?: string | ((url: string) => string);
	readonly providerName?: string;
	readonly title?: string;
	readonly placeholder?: string;
	readonly branch?: boolean; // then result is PickRemoteSourceResult
	readonly showRecentSources?: boolean;
}

export interface PickRemoteSourceResult {
	readonly url: string;
	readonly branch?: string;
}

export interface RemoteSourceAction {
	readonly label: string;
	/**
	 * Codicon name
	 */
	readonly icon: string;
	run(branch: string): void;
}

export interface RemoteSource {
	readonly name: string;
	readonly description?: string;
	readonly detail?: string;
	/**
	 * Codicon name
	 */
	readonly icon?: string;
	readonly url: string | string[];
}

export interface RecentRemoteSource extends RemoteSource {
	readonly timestamp: number;
}

export interface RemoteSourceProvider {
	readonly name: string;
	/**
	 * Codicon name
	 */
	readonly icon?: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly supportsQuery?: boolean;

	getBranches?(url: string): ProviderResult<string[]>;
	getRemoteSourceActions?(url: string): ProviderResult<RemoteSourceAction[]>;
	getRecentRemoteSources?(query?: string): ProviderResult<RecentRemoteSource[]>;
	getRemoteSources(query?: string): ProviderResult<RemoteSource[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/.npmrc]---
Location: vscode-main/extensions/git-base/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/.vscodeignore]---
Location: vscode-main/extensions/git-base/.vscodeignore

```text
src/**
build/**
cgmanifest.json
extension.webpack.config.js
extension-browser.webpack.config.js
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/cgmanifest.json]---
Location: vscode-main/extensions/git-base/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/git.tmbundle",
					"repositoryUrl": "https://github.com/textmate/git.tmbundle",
					"commitHash": "5870cf3f8abad3a6637bdf69250b5d2ded427dc4"
				}
			},
			"licenseDetail": [
				"Copyright (c) 2008 Tim Harper",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining",
				"a copy of this software and associated documentation files (the\"",
				"Software\"), to deal in the Software without restriction, including",
				"without limitation the rights to use, copy, modify, merge, publish,",
				"distribute, sublicense, and/or sell copies of the Software, and to",
				"permit persons to whom the Software is furnished to do so, subject to",
				"the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be",
				"included in all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,",
				"EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF",
				"MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND",
				"NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE",
				"LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION",
				"OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION",
				"WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
			],
			"license": "MIT",
			"version": "0.0.0"
		},
		{
			"component": {
				"type": "git",
				"git": {
					"name": "walles/git-commit-message-plus",
					"repositoryUrl": "https://github.com/walles/git-commit-message-plus",
					"commitHash": "35a079dea5a91b087021b40c01a6bb4eb0337a87"
				}
			},
			"licenseDetail": [
				"Copyright (c) 2023 Johan Walles <johan.walles@gmail.com>",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining",
				"a copy of this software and associated documentation files (the\"",
				"Software\"), to deal in the Software without restriction, including",
				"without limitation the rights to use, copy, modify, merge, publish,",
				"distribute, sublicense, and/or sell copies of the Software, and to",
				"permit persons to whom the Software is furnished to do so, subject to",
				"the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be",
				"included in all copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,",
				"EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF",
				"MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND",
				"NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE",
				"LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION",
				"OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION",
				"WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
			],
			"license": "MIT",
			"version": "1.0.0",
			"description": "The original JSON grammars were derived from https://github.com/microsoft/vscode/blob/e95c74c4c7af876e79ec58df262464467c06df28/extensions/git-base/syntaxes/git-commit.tmLanguage.json. That file was originally copied from https://github.com/textmate/git.tmbundle."
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/git-base/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
	output: {
		filename: 'extension.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/extension.webpack.config.js]---
Location: vscode-main/extensions/git-base/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
	output: {
		filename: 'extension.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/package-lock.json]---
Location: vscode-main/extensions/git-base/package-lock.json

```json
{
  "name": "git-base",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "git-base",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "0.10.x"
      }
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
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/package.json]---
Location: vscode-main/extensions/git-base/package.json

```json
{
  "name": "git-base",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "*"
  ],
  "main": "./out/extension.js",
  "browser": "./dist/browser/extension.js",
  "icon": "resources/icons/git.png",
  "scripts": {
    "compile": "gulp compile-extension:git-base",
    "watch": "gulp watch-extension:git-base",
    "update-grammar": "node ./build/update-grammars.js"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "commands": [
      {
        "command": "git-base.api.getRemoteSources",
        "title": "%command.api.getRemoteSources%",
        "category": "Git Base API"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "git-base.api.getRemoteSources",
          "when": "false"
        }
      ]
    },
    "languages": [
      {
        "id": "git-commit",
        "aliases": [
          "Git Commit Message",
          "git-commit"
        ],
        "filenames": [
          "COMMIT_EDITMSG",
          "MERGE_MSG"
        ],
        "configuration": "./languages/git-commit.language-configuration.json"
      },
      {
        "id": "git-rebase",
        "aliases": [
          "Git Rebase Message",
          "git-rebase"
        ],
        "filenames": [
          "git-rebase-todo"
        ],
        "filenamePatterns": [
          "**/rebase-merge/done"
        ],
        "configuration": "./languages/git-rebase.language-configuration.json"
      },
      {
        "id": "ignore",
        "aliases": [
          "Ignore",
          "ignore"
        ],
        "extensions": [
          ".gitignore_global",
          ".gitignore",
          ".git-blame-ignore-revs"
        ],
        "configuration": "./languages/ignore.language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "git-commit",
        "scopeName": "text.git-commit",
        "path": "./syntaxes/git-commit.tmLanguage.json"
      },
      {
        "language": "git-rebase",
        "scopeName": "text.git-rebase",
        "path": "./syntaxes/git-rebase.tmLanguage.json"
      },
      {
        "language": "ignore",
        "scopeName": "source.ignore",
        "path": "./syntaxes/ignore.tmLanguage.json"
      }
    ]
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/package.nls.json]---
Location: vscode-main/extensions/git-base/package.nls.json

```json
{
	"displayName": "Git Base",
	"description": "Git static contributions and pickers.",
	"command.api.getRemoteSources": "Get Remote Sources"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/README.md]---
Location: vscode-main/extensions/git-base/README.md

```markdown
# Git static contributions and remote repository picker

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

Git static contributions and remote repository picker.

## API

The Git extension exposes an API, reachable by any other extension.

1. Copy `src/api/git-base.d.ts` to your extension's sources;
2. Include `git-base.d.ts` in your extension's compilation.
3. Get a hold of the API with the following snippet:

 ```ts
 const gitBaseExtension = vscode.extensions.getExtension<GitBaseExtension>('vscode.git-base').exports;
 const git = gitBaseExtension.getAPI(1);

 ```
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/tsconfig.json]---
Location: vscode-main/extensions/git-base/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/build/update-grammars.js]---
Location: vscode-main/extensions/git-base/build/update-grammars.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

updateGrammar.update('walles/git-commit-message-plus', 'syntaxes/git-commit.tmLanguage.json', './syntaxes/git-commit.tmLanguage.json', undefined, 'main');
updateGrammar.update('textmate/git.tmbundle', 'Syntaxes/Git%20Rebase%20Message.tmLanguage', './syntaxes/git-rebase.tmLanguage.json');
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/languages/git-commit.language-configuration.json]---
Location: vscode-main/extensions/git-base/languages/git-commit.language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "#", " " ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] },
		{ "open": "/**", "close": " */", "notIn": ["string"] }
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/languages/git-rebase.language-configuration.json]---
Location: vscode-main/extensions/git-base/languages/git-rebase.language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "#", " " ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] },
		{ "open": "/**", "close": " */", "notIn": ["string"] }
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/languages/ignore.language-configuration.json]---
Location: vscode-main/extensions/git-base/languages/ignore.language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
	},
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] }
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/decorators.ts]---
Location: vscode-main/extensions/git-base/src/decorators.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { done } from './util';

export function debounce(delay: number): Function {
	return decorate((fn, key) => {
		const timerKey = `$debounce$${key}`;

		return function (this: any, ...args: any[]) {
			clearTimeout(this[timerKey]);
			this[timerKey] = setTimeout(() => fn.apply(this, args), delay);
		};
	});
}

export const throttle = decorate(_throttle);

function _throttle<T>(fn: Function, key: string): Function {
	const currentKey = `$throttle$current$${key}`;
	const nextKey = `$throttle$next$${key}`;

	const trigger = function (this: any, ...args: any[]) {
		if (this[nextKey]) {
			return this[nextKey];
		}

		if (this[currentKey]) {
			this[nextKey] = done(this[currentKey]).then(() => {
				this[nextKey] = undefined;
				return trigger.apply(this, args);
			});

			return this[nextKey];
		}

		this[currentKey] = fn.apply(this, args) as Promise<T>;

		const clear = () => this[currentKey] = undefined;
		done(this[currentKey]).then(clear, clear);

		return this[currentKey];
	};

	return trigger;
}

function decorate(decorator: (fn: Function, key: string) => Function): Function {
	return function (original: any, context: ClassMethodDecoratorContext) {
		if (context.kind !== 'method') {
			throw new Error('not supported');
		}
		return decorator(original, context.name.toString());
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/extension.ts]---
Location: vscode-main/extensions/git-base/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, languages } from 'vscode';
import { registerAPICommands } from './api/api1';
import { GitBaseExtensionImpl } from './api/extension';
import { Model } from './model';
import { GitCommitFoldingProvider } from './foldingProvider';

export function activate(context: ExtensionContext): GitBaseExtensionImpl {
	const apiImpl = new GitBaseExtensionImpl(new Model());
	context.subscriptions.push(registerAPICommands(apiImpl));

	// Register folding provider for git-commit language
	context.subscriptions.push(
		languages.registerFoldingRangeProvider('git-commit', new GitCommitFoldingProvider())
	);

	return apiImpl;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/foldingProvider.ts]---
Location: vscode-main/extensions/git-base/src/foldingProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export class GitCommitFoldingProvider implements vscode.FoldingRangeProvider {

	provideFoldingRanges(
		document: vscode.TextDocument,
		_context: vscode.FoldingContext,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.FoldingRange[]> {
		const ranges: vscode.FoldingRange[] = [];

		let commentBlockStart: number | undefined;
		let currentDiffStart: number | undefined;

		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i);
			const lineText = line.text;

			// Check for comment lines (lines starting with #)
			if (lineText.startsWith('#')) {
				// Close any active diff block when we encounter a comment
				if (currentDiffStart !== undefined) {
					// Only create fold if there are at least 2 lines
					if (i - currentDiffStart > 1) {
						ranges.push(new vscode.FoldingRange(currentDiffStart, i - 1));
					}
					currentDiffStart = undefined;
				}

				if (commentBlockStart === undefined) {
					commentBlockStart = i;
				}
			} else {
				// End of comment block
				if (commentBlockStart !== undefined) {
					// Only create fold if there are at least 2 lines
					if (i - commentBlockStart > 1) {
						ranges.push(new vscode.FoldingRange(
							commentBlockStart,
							i - 1,
							vscode.FoldingRangeKind.Comment
						));
					}
					commentBlockStart = undefined;
				}
			}

			// Check for diff sections (lines starting with "diff --git")
			if (lineText.startsWith('diff --git ')) {
				// If there's a previous diff block, close it
				if (currentDiffStart !== undefined) {
					// Only create fold if there are at least 2 lines
					if (i - currentDiffStart > 1) {
						ranges.push(new vscode.FoldingRange(currentDiffStart, i - 1));
					}
				}
				// Start new diff block
				currentDiffStart = i;
			}
		}

		// Handle end-of-document cases

		// If comment block extends to end of document
		if (commentBlockStart !== undefined) {
			if (document.lineCount - commentBlockStart > 1) {
				ranges.push(new vscode.FoldingRange(
					commentBlockStart,
					document.lineCount - 1,
					vscode.FoldingRangeKind.Comment
				));
			}
		}

		// If diff block extends to end of document
		if (currentDiffStart !== undefined) {
			if (document.lineCount - currentDiffStart > 1) {
				ranges.push(new vscode.FoldingRange(
					currentDiffStart,
					document.lineCount - 1
				));
			}
		}

		return ranges;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/model.ts]---
Location: vscode-main/extensions/git-base/src/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventEmitter, Disposable } from 'vscode';
import { toDisposable } from './util';
import { RemoteSourceProvider } from './api/git-base';
import { IRemoteSourceProviderRegistry } from './remoteProvider';

export class Model implements IRemoteSourceProviderRegistry {

	private remoteSourceProviders = new Set<RemoteSourceProvider>();

	private _onDidAddRemoteSourceProvider = new EventEmitter<RemoteSourceProvider>();
	readonly onDidAddRemoteSourceProvider = this._onDidAddRemoteSourceProvider.event;

	private _onDidRemoveRemoteSourceProvider = new EventEmitter<RemoteSourceProvider>();
	readonly onDidRemoveRemoteSourceProvider = this._onDidRemoveRemoteSourceProvider.event;

	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable {
		this.remoteSourceProviders.add(provider);
		this._onDidAddRemoteSourceProvider.fire(provider);

		return toDisposable(() => {
			this.remoteSourceProviders.delete(provider);
			this._onDidRemoveRemoteSourceProvider.fire(provider);
		});
	}

	getRemoteProviders(): RemoteSourceProvider[] {
		return [...this.remoteSourceProviders.values()];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/remoteProvider.ts]---
Location: vscode-main/extensions/git-base/src/remoteProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, Event } from 'vscode';
import { RemoteSourceProvider } from './api/git-base';

export interface IRemoteSourceProviderRegistry {
	readonly onDidAddRemoteSourceProvider: Event<RemoteSourceProvider>;
	readonly onDidRemoveRemoteSourceProvider: Event<RemoteSourceProvider>;

	getRemoteProviders(): RemoteSourceProvider[];
	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/remoteSource.ts]---
Location: vscode-main/extensions/git-base/src/remoteSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, QuickPick, QuickPickItemKind, l10n, Disposable } from 'vscode';
import { RemoteSourceProvider, RemoteSource, PickRemoteSourceOptions, PickRemoteSourceResult, RemoteSourceAction } from './api/git-base';
import { Model } from './model';
import { throttle, debounce } from './decorators';

async function getQuickPickResult<T extends QuickPickItem>(quickpick: QuickPick<T>): Promise<T | undefined> {
	const listeners: Disposable[] = [];
	const result = await new Promise<T | undefined>(c => {
		listeners.push(
			quickpick.onDidAccept(() => c(quickpick.selectedItems[0])),
			quickpick.onDidHide(() => c(undefined)),
		);
		quickpick.show();
	});

	quickpick.hide();
	listeners.forEach(l => l.dispose());
	return result;
}

class RemoteSourceProviderQuickPick implements Disposable {

	private disposables: Disposable[] = [];
	private isDisposed: boolean = false;

	private quickpick: QuickPick<QuickPickItem & { remoteSource?: RemoteSource }> | undefined;

	constructor(private provider: RemoteSourceProvider) { }

	dispose() {
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
		this.quickpick = undefined;
		this.isDisposed = true;
	}

	private ensureQuickPick() {
		if (!this.quickpick) {
			this.quickpick = window.createQuickPick();
			this.disposables.push(this.quickpick);
			this.quickpick.ignoreFocusOut = true;
			this.disposables.push(this.quickpick.onDidHide(() => this.dispose()));
			if (this.provider.supportsQuery) {
				this.quickpick.placeholder = this.provider.placeholder ?? l10n.t('Repository name (type to search)');
				this.disposables.push(this.quickpick.onDidChangeValue(this.onDidChangeValue, this));
			} else {
				this.quickpick.placeholder = this.provider.placeholder ?? l10n.t('Repository name');
			}
		}
	}

	@debounce(300)
	private onDidChangeValue(): void {
		this.query();
	}

	@throttle
	private async query(): Promise<void> {
		try {
			if (this.isDisposed) {
				return;
			}
			this.ensureQuickPick();
			this.quickpick!.busy = true;
			this.quickpick!.show();

			const remoteSources = await this.provider.getRemoteSources(this.quickpick?.value) || [];
			// The user may have cancelled the picker in the meantime
			if (this.isDisposed) {
				return;
			}

			if (remoteSources.length === 0) {
				this.quickpick!.items = [{
					label: l10n.t('No remote repositories found.'),
					alwaysShow: true
				}];
			} else {
				this.quickpick!.items = remoteSources.map(remoteSource => ({
					label: remoteSource.icon ? `$(${remoteSource.icon}) ${remoteSource.name}` : remoteSource.name,
					description: remoteSource.description || (typeof remoteSource.url === 'string' ? remoteSource.url : remoteSource.url[0]),
					detail: remoteSource.detail,
					remoteSource,
					alwaysShow: true
				}));
			}
		} catch (err) {
			this.quickpick!.items = [{ label: l10n.t('{0} Error: {1}', '$(error)', err.message), alwaysShow: true }];
			console.error(err);
		} finally {
			if (!this.isDisposed) {
				this.quickpick!.busy = false;
			}
		}
	}

	async pick(): Promise<RemoteSource | undefined> {
		await this.query();
		if (this.isDisposed) {
			return;
		}
		const result = await getQuickPickResult(this.quickpick!);
		return result?.remoteSource;
	}
}

export async function getRemoteSourceActions(model: Model, url: string): Promise<RemoteSourceAction[]> {
	const providers = model.getRemoteProviders();

	const remoteSourceActions = [];
	for (const provider of providers) {
		const providerActions = await provider.getRemoteSourceActions?.(url);
		if (providerActions?.length) {
			remoteSourceActions.push(...providerActions);
		}
	}

	return remoteSourceActions;
}

export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions): Promise<string | PickRemoteSourceResult | undefined>;
export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions & { branch?: false | undefined }): Promise<string | undefined>;
export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions & { branch: true }): Promise<PickRemoteSourceResult | undefined>;
export async function pickRemoteSource(model: Model, options: PickRemoteSourceOptions = {}): Promise<string | PickRemoteSourceResult | undefined> {
	const quickpick = window.createQuickPick<(QuickPickItem & { provider?: RemoteSourceProvider; url?: string })>();
	quickpick.title = options.title;

	if (options.providerName) {
		const provider = model.getRemoteProviders()
			.filter(provider => provider.name === options.providerName)[0];

		if (provider) {
			return await pickProviderSource(provider, options);
		}
	}

	const remoteProviders = model.getRemoteProviders()
		.map(provider => ({ label: (provider.icon ? `$(${provider.icon}) ` : '') + (options.providerLabel ? options.providerLabel(provider) : provider.name), alwaysShow: true, provider }));

	const recentSources: (QuickPickItem & { url?: string; timestamp: number })[] = [];
	if (options.showRecentSources) {
		for (const { provider } of remoteProviders) {
			const sources = (await provider.getRecentRemoteSources?.() ?? []).map((item) => {
				return {
					...item,
					label: (item.icon ? `$(${item.icon}) ` : '') + item.name,
					url: typeof item.url === 'string' ? item.url : item.url[0],
				};
			});
			recentSources.push(...sources);
		}
	}

	const items = [
		{ kind: QuickPickItemKind.Separator, label: l10n.t('remote sources') },
		...remoteProviders,
		{ kind: QuickPickItemKind.Separator, label: l10n.t('recently opened') },
		...recentSources.sort((a, b) => b.timestamp - a.timestamp)
	];

	quickpick.placeholder = options.placeholder ?? (remoteProviders.length === 0
		? l10n.t('Provide repository URL')
		: l10n.t('Provide repository URL or pick a repository source.'));

	const updatePicks = (value?: string) => {
		if (value) {
			const label = (typeof options.urlLabel === 'string' ? options.urlLabel : options.urlLabel?.(value)) ?? l10n.t('URL');
			quickpick.items = [{
				label: label,
				description: value,
				alwaysShow: true,
				url: value
			},
			...items
			];
		} else {
			quickpick.items = items;
		}
	};

	quickpick.onDidChangeValue(updatePicks);
	updatePicks();

	const result = await getQuickPickResult(quickpick);

	if (result) {
		if (result.url) {
			return result.url;
		} else if (result.provider) {
			return await pickProviderSource(result.provider, options);
		}
	}

	return undefined;
}

async function pickProviderSource(provider: RemoteSourceProvider, options: PickRemoteSourceOptions = {}): Promise<string | PickRemoteSourceResult | undefined> {
	const quickpick = new RemoteSourceProviderQuickPick(provider);
	const remote = await quickpick.pick();
	quickpick.dispose();

	let url: string | undefined;

	if (remote) {
		if (typeof remote.url === 'string') {
			url = remote.url;
		} else if (remote.url.length > 0) {
			url = await window.showQuickPick(remote.url, { ignoreFocusOut: true, placeHolder: l10n.t('Choose a URL to clone from.') });
		}
	}

	if (!url || !options.branch) {
		return url;
	}

	if (!provider.getBranches) {
		return { url };
	}

	const branches = await provider.getBranches(url);

	if (!branches) {
		return { url };
	}

	const branch = await window.showQuickPick(branches, {
		placeHolder: l10n.t('Branch name')
	});

	if (!branch) {
		return { url };
	}

	return { url, branch };
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/util.ts]---
Location: vscode-main/extensions/git-base/src/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IDisposable {
	dispose(): void;
}

export function toDisposable(dispose: () => void): IDisposable {
	return { dispose };
}

export function done<T>(promise: Promise<T>): Promise<void> {
	return promise.then<void>(() => undefined);
}

export namespace Versions {
	declare type VersionComparisonResult = -1 | 0 | 1;

	export interface Version {
		major: number;
		minor: number;
		patch: number;
		pre?: string;
	}

	export function compare(v1: string | Version, v2: string | Version): VersionComparisonResult {
		if (typeof v1 === 'string') {
			v1 = fromString(v1);
		}
		if (typeof v2 === 'string') {
			v2 = fromString(v2);
		}

		if (v1.major > v2.major) { return 1; }
		if (v1.major < v2.major) { return -1; }

		if (v1.minor > v2.minor) { return 1; }
		if (v1.minor < v2.minor) { return -1; }

		if (v1.patch > v2.patch) { return 1; }
		if (v1.patch < v2.patch) { return -1; }

		if (v1.pre === undefined && v2.pre !== undefined) { return 1; }
		if (v1.pre !== undefined && v2.pre === undefined) { return -1; }

		if (v1.pre !== undefined && v2.pre !== undefined) {
			return v1.pre.localeCompare(v2.pre) as VersionComparisonResult;
		}

		return 0;
	}

	export function from(major: string | number, minor: string | number, patch?: string | number, pre?: string): Version {
		return {
			major: typeof major === 'string' ? parseInt(major, 10) : major,
			minor: typeof minor === 'string' ? parseInt(minor, 10) : minor,
			patch: patch === undefined || patch === null ? 0 : typeof patch === 'string' ? parseInt(patch, 10) : patch,
			pre: pre,
		};
	}

	export function fromString(version: string): Version {
		const [ver, pre] = version.split('-');
		const [major, minor, patch] = ver.split('.');
		return from(major, minor, patch, pre);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/api/api1.ts]---
Location: vscode-main/extensions/git-base/src/api/api1.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, commands } from 'vscode';
import { Model } from '../model';
import { getRemoteSourceActions, pickRemoteSource } from '../remoteSource';
import { GitBaseExtensionImpl } from './extension';
import { API, PickRemoteSourceOptions, PickRemoteSourceResult, RemoteSourceAction, RemoteSourceProvider } from './git-base';

export class ApiImpl implements API {

	constructor(private _model: Model) { }

	pickRemoteSource(options: PickRemoteSourceOptions): Promise<PickRemoteSourceResult | string | undefined> {
		return pickRemoteSource(this._model, options);
	}

	getRemoteSourceActions(url: string): Promise<RemoteSourceAction[]> {
		return getRemoteSourceActions(this._model, url);
	}

	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable {
		return this._model.registerRemoteSourceProvider(provider);
	}
}

export function registerAPICommands(extension: GitBaseExtensionImpl): Disposable {
	const disposables: Disposable[] = [];

	disposables.push(commands.registerCommand('git-base.api.getRemoteSources', (opts?: PickRemoteSourceOptions) => {
		if (!extension.model || !opts) {
			return;
		}

		return pickRemoteSource(extension.model, opts);
	}));

	return Disposable.from(...disposables);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/api/extension.ts]---
Location: vscode-main/extensions/git-base/src/api/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Model } from '../model';
import { GitBaseExtension, API } from './git-base';
import { Event, EventEmitter } from 'vscode';
import { ApiImpl } from './api1';

export class GitBaseExtensionImpl implements GitBaseExtension {

	enabled: boolean = false;

	private _onDidChangeEnablement = new EventEmitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _model: Model | undefined = undefined;

	set model(model: Model | undefined) {
		this._model = model;

		const enabled = !!model;

		if (this.enabled === enabled) {
			return;
		}

		this.enabled = enabled;
		this._onDidChangeEnablement.fire(this.enabled);
	}

	get model(): Model | undefined {
		return this._model;
	}

	constructor(model?: Model) {
		if (model) {
			this.enabled = true;
			this._model = model;
		}
	}

	getAPI(version: number): API {
		if (!this._model) {
			throw new Error('Git model not found');
		}

		if (version !== 1) {
			throw new Error(`No API version ${version} found.`);
		}

		return new ApiImpl(this._model);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/api/git-base.d.ts]---
Location: vscode-main/extensions/git-base/src/api/git-base.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, Disposable, Event, ProviderResult } from 'vscode';
export { ProviderResult } from 'vscode';

export interface API {
	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable;
	getRemoteSourceActions(url: string): Promise<RemoteSourceAction[]>;
	pickRemoteSource(options: PickRemoteSourceOptions): Promise<string | PickRemoteSourceResult | undefined>;
}

export interface GitBaseExtension {

	readonly enabled: boolean;
	readonly onDidChangeEnablement: Event<boolean>;

	/**
	 * Returns a specific API version.
	 *
	 * Throws error if git-base extension is disabled. You can listed to the
	 * [GitBaseExtension.onDidChangeEnablement](#GitBaseExtension.onDidChangeEnablement)
	 * event to know when the extension becomes enabled/disabled.
	 *
	 * @param version Version number.
	 * @returns API instance
	 */
	getAPI(version: 1): API;
}

export interface PickRemoteSourceOptions {
	readonly providerLabel?: (provider: RemoteSourceProvider) => string;
	readonly urlLabel?: string | ((url: string) => string);
	readonly providerName?: string;
	readonly title?: string;
	readonly placeholder?: string;
	readonly branch?: boolean; // then result is PickRemoteSourceResult
	readonly showRecentSources?: boolean;
}

export interface PickRemoteSourceResult {
	readonly url: string;
	readonly branch?: string;
}

export interface RemoteSourceAction {
	readonly label: string;
	/**
	 * Codicon name
	 */
	readonly icon: string;
	run(branch: string): void;
}

export interface RemoteSource {
	readonly name: string;
	readonly description?: string;
	readonly detail?: string;
	/**
	 * Codicon name
	 */
	readonly icon?: string;
	readonly url: string | string[];
}

export interface RecentRemoteSource extends RemoteSource {
	readonly timestamp: number;
}

export interface RemoteSourceProvider {
	readonly name: string;
	/**
	 * Codicon name
	 */
	readonly icon?: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly supportsQuery?: boolean;

	getBranches?(url: string): ProviderResult<string[]>;
	getRemoteSourceActions?(url: string): ProviderResult<RemoteSourceAction[]>;
	getRecentRemoteSources?(query?: string): ProviderResult<RecentRemoteSource[]>;
	getRemoteSources(query?: string): ProviderResult<RemoteSource[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/src/test/foldingProvider.test.ts]---
Location: vscode-main/extensions/git-base/src/test/foldingProvider.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { GitCommitFoldingProvider } from '../foldingProvider';

suite('GitCommitFoldingProvider', () => {

	function createMockDocument(content: string): vscode.TextDocument {
		const lines = content.split('\n');
		return {
			lineCount: lines.length,
			lineAt: (index: number) => ({
				text: lines[index] || '',
				lineNumber: index
			}),
		} as vscode.TextDocument;
	}

	const mockContext: vscode.FoldingContext = {} as vscode.FoldingContext;
	const mockToken: vscode.CancellationToken = { isCancellationRequested: false } as vscode.CancellationToken;

	test('empty document returns no folding ranges', () => {
		const provider = new GitCommitFoldingProvider();
		const doc = createMockDocument('');
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken);

		assert.strictEqual(Array.isArray(ranges) ? ranges.length : 0, 0);
	});

	test('single line document returns no folding ranges', () => {
		const provider = new GitCommitFoldingProvider();
		const doc = createMockDocument('commit message');
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken);

		assert.strictEqual(Array.isArray(ranges) ? ranges.length : 0, 0);
	});

	test('single comment line returns no folding ranges', () => {
		const provider = new GitCommitFoldingProvider();
		const doc = createMockDocument('# Comment');
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken);

		assert.strictEqual(Array.isArray(ranges) ? ranges.length : 0, 0);
	});

	test('two comment lines create one folding range', () => {
		const provider = new GitCommitFoldingProvider();
		const content = '# Comment 1\n# Comment 2';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 1);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);
	});

	test('multiple comment lines create one folding range', () => {
		const provider = new GitCommitFoldingProvider();
		const content = '# Comment 1\n# Comment 2\n# Comment 3\n# Comment 4';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 3);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);
	});

	test('comment block followed by content', () => {
		const provider = new GitCommitFoldingProvider();
		const content = '# Comment 1\n# Comment 2\nCommit message';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 1);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);
	});

	test('comment block at end of document', () => {
		const provider = new GitCommitFoldingProvider();
		const content = 'Commit message\n\n# Comment 1\n# Comment 2';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 2);
		assert.strictEqual(ranges[0].end, 3);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);
	});

	test('multiple separated comment blocks', () => {
		const provider = new GitCommitFoldingProvider();
		const content = '# Comment 1\n# Comment 2\n\nCommit message\n\n# Comment 3\n# Comment 4';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 2);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 1);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);
		assert.strictEqual(ranges[1].start, 5);
		assert.strictEqual(ranges[1].end, 6);
		assert.strictEqual(ranges[1].kind, vscode.FoldingRangeKind.Comment);
	});

	test('single diff line returns no folding ranges', () => {
		const provider = new GitCommitFoldingProvider();
		const doc = createMockDocument('diff --git a/file.txt b/file.txt');
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken);

		assert.strictEqual(Array.isArray(ranges) ? ranges.length : 0, 0);
	});

	test('diff block with content creates folding range', () => {
		const provider = new GitCommitFoldingProvider();
		const content = 'diff --git a/file.txt b/file.txt\nindex 1234..5678\n--- a/file.txt\n+++ b/file.txt';
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 3);
		assert.strictEqual(ranges[0].kind, undefined); // Diff blocks don't have a specific kind
	});

	test('multiple diff blocks', () => {
		const provider = new GitCommitFoldingProvider();
		const content = [
			'diff --git a/file1.txt b/file1.txt',
			'--- a/file1.txt',
			'+++ b/file1.txt',
			'diff --git a/file2.txt b/file2.txt',
			'--- a/file2.txt',
			'+++ b/file2.txt'
		].join('\n');
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 2);
		assert.strictEqual(ranges[0].start, 0);
		assert.strictEqual(ranges[0].end, 2);
		assert.strictEqual(ranges[1].start, 3);
		assert.strictEqual(ranges[1].end, 5);
	});

	test('diff block at end of document', () => {
		const provider = new GitCommitFoldingProvider();
		const content = [
			'Commit message',
			'',
			'diff --git a/file.txt b/file.txt',
			'--- a/file.txt',
			'+++ b/file.txt'
		].join('\n');
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 1);
		assert.strictEqual(ranges[0].start, 2);
		assert.strictEqual(ranges[0].end, 4);
	});

	test('realistic git commit message with comments and verbose diff', () => {
		const provider = new GitCommitFoldingProvider();
		const content = [
			'Add folding support for git commit messages',
			'',
			'# Please enter the commit message for your changes. Lines starting',
			'# with \'#\' will be ignored, and an empty message aborts the commit.',
			'#',
			'# On branch main',
			'# Changes to be committed:',
			'#\tmodified:   extension.ts',
			'#\tnew file:   foldingProvider.ts',
			'#',
			'# ------------------------ >8 ------------------------',
			'# Do not modify or remove the line above.',
			'# Everything below it will be ignored.',
			'diff --git a/extensions/git-base/src/extension.ts b/extensions/git-base/src/extension.ts',
			'index 17ffb89..453d8f7 100644',
			'--- a/extensions/git-base/src/extension.ts',
			'+++ b/extensions/git-base/src/extension.ts',
			'@@ -3,14 +3,20 @@',
			' *  Licensed under the MIT License.',
			'-import { ExtensionContext } from \'vscode\';',
			'+import { ExtensionContext, languages } from \'vscode\';',
			'diff --git a/extensions/git-base/src/foldingProvider.ts b/extensions/git-base/src/foldingProvider.ts',
			'new file mode 100644',
			'index 0000000..2c4a9c3',
			'--- /dev/null',
			'+++ b/extensions/git-base/src/foldingProvider.ts'
		].join('\n');
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		// Should have one comment block and two diff blocks
		assert.strictEqual(ranges.length, 3);

		// Comment block (lines 2-12)
		assert.strictEqual(ranges[0].start, 2);
		assert.strictEqual(ranges[0].end, 12);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);

		// First diff block (lines 13-20)
		assert.strictEqual(ranges[1].start, 13);
		assert.strictEqual(ranges[1].end, 20);
		assert.strictEqual(ranges[1].kind, undefined);

		// Second diff block (lines 21-25)
		assert.strictEqual(ranges[2].start, 21);
		assert.strictEqual(ranges[2].end, 25);
		assert.strictEqual(ranges[2].kind, undefined);
	});

	test('mixed comment and diff content', () => {
		const provider = new GitCommitFoldingProvider();
		const content = [
			'Fix bug in parser',
			'',
			'# Comment 1',
			'# Comment 2',
			'',
			'diff --git a/file.txt b/file.txt',
			'--- a/file.txt',
			'+++ b/file.txt',
			'',
			'# Comment 3',
			'# Comment 4'
		].join('\n');
		const doc = createMockDocument(content);
		const ranges = provider.provideFoldingRanges(doc, mockContext, mockToken) as vscode.FoldingRange[];

		assert.strictEqual(ranges.length, 3);

		// First comment block
		assert.strictEqual(ranges[0].start, 2);
		assert.strictEqual(ranges[0].end, 3);
		assert.strictEqual(ranges[0].kind, vscode.FoldingRangeKind.Comment);

		// Diff block
		assert.strictEqual(ranges[1].start, 5);
		assert.strictEqual(ranges[1].end, 8);
		assert.strictEqual(ranges[1].kind, undefined);

		// Second comment block
		assert.strictEqual(ranges[2].start, 9);
		assert.strictEqual(ranges[2].end, 10);
		assert.strictEqual(ranges[2].kind, vscode.FoldingRangeKind.Comment);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/syntaxes/git-commit.tmLanguage.json]---
Location: vscode-main/extensions/git-base/syntaxes/git-commit.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/walles/git-commit-message-plus/blob/master/syntaxes/git-commit.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/walles/git-commit-message-plus/commit/35a079dea5a91b087021b40c01a6bb4eb0337a87",
	"name": "Git Commit Message",
	"scopeName": "text.git-commit",
	"patterns": [
		{
			"comment": "diff presented at the end of the commit message when using commit -v.",
			"name": "meta.embedded.diff.git-commit",
			"contentName": "source.diff",
			"begin": "(?=^diff\\ \\-\\-git)",
			"end": "\\z",
			"patterns": [
				{
					"include": "source.diff"
				}
			]
		},
		{
			"comment": "User supplied message",
			"name": "meta.scope.message.git-commit",
			"begin": "^(?!#)",
			"end": "^(?=#)",
			"patterns": [
				{
					"comment": "Mark > 50 lines as deprecated, > 72 as illegal",
					"name": "meta.scope.subject.git-commit",
					"match": "\\G.{0,50}(.{0,22}(.*))$",
					"captures": {
						"1": {
							"name": "invalid.deprecated.line-too-long.git-commit"
						},
						"2": {
							"name": "invalid.illegal.line-too-long.git-commit"
						}
					}
				}
			]
		},
		{
			"comment": "Git supplied metadata in a number of lines starting with #",
			"name": "meta.scope.metadata.git-commit",
			"begin": "^(?=#)",
			"contentName": "comment.line.number-sign.git-commit",
			"end": "^(?!#)",
			"patterns": [
				{
					"match": "^#\\t((modified|renamed):.*)$",
					"captures": {
						"1": {
							"name": "markup.changed.git-commit"
						}
					}
				},
				{
					"match": "^#\\t(new file:.*)$",
					"captures": {
						"1": {
							"name": "markup.inserted.git-commit"
						}
					}
				},
				{
					"match": "^#\\t(deleted.*)$",
					"captures": {
						"1": {
							"name": "markup.deleted.git-commit"
						}
					}
				},
				{
					"comment": "Fallback for non-English git commit template",
					"match": "^#\\t([^:]+): *(.*)$",
					"captures": {
						"1": {
							"name": "keyword.other.file-type.git-commit"
						},
						"2": {
							"name": "string.unquoted.filename.git-commit"
						}
					}
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/syntaxes/git-rebase.tmLanguage.json]---
Location: vscode-main/extensions/git-base/syntaxes/git-rebase.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/git.tmbundle/blob/master/Syntaxes/Git%20Rebase%20Message.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/git.tmbundle/commit/5870cf3f8abad3a6637bdf69250b5d2ded427dc4",
	"name": "Git Rebase Message",
	"scopeName": "text.git-rebase",
	"patterns": [
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.comment.git-rebase"
				}
			},
			"match": "^\\s*(#).*$\\n?",
			"name": "comment.line.number-sign.git-rebase"
		},
		{
			"captures": {
				"1": {
					"name": "support.function.git-rebase"
				},
				"2": {
					"name": "constant.sha.git-rebase"
				},
				"3": {
					"name": "meta.commit-message.git-rebase"
				}
			},
			"match": "^\\s*(pick|p|reword|r|edit|e|squash|s|fixup|f|drop|d)\\s+([0-9a-f]+)\\s+(.*)$",
			"name": "meta.commit-command.git-rebase"
		},
		{
			"captures": {
				"1": {
					"name": "support.function.git-rebase"
				},
				"2": {
					"patterns": [
						{
							"include": "source.shell"
						}
					]
				}
			},
			"match": "^\\s*(exec|x)\\s+(.*)$",
			"name": "meta.commit-command.git-rebase"
		},
		{
			"captures": {
				"1": {
					"name": "support.function.git-rebase"
				}
			},
			"match": "^\\s*(break|b)\\s*$",
			"name": "meta.commit-command.git-rebase"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git-base/syntaxes/ignore.tmLanguage.json]---
Location: vscode-main/extensions/git-base/syntaxes/ignore.tmLanguage.json

```json
{
	"name": "Ignore",
	"scopeName": "source.ignore",
	"patterns": [
		{
			"match": "^#.*",
			"name": "comment.line.number-sign.ignore"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/.npmrc]---
Location: vscode-main/extensions/github/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/.vscodeignore]---
Location: vscode-main/extensions/github/.vscodeignore

```text
src/**
!src/common/config.json
out/**
build/**
extension.webpack.config.js
tsconfig.json
package-lock.json
testWorkspace/**
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/extension.webpack.config.js]---
Location: vscode-main/extensions/github/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts'
	},
	output: {
		libraryTarget: 'module',
		chunkFormat: 'module',
	},
	externals: {
		'vscode': 'module vscode',
	},
	experiments: {
		outputModule: true
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/markdown.css]---
Location: vscode-main/extensions/github/markdown.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.vscode-dark img[src$=\#gh-light-mode-only],
.vscode-light img[src$=\#gh-dark-mode-only],
.vscode-high-contrast:not(.vscode-high-contrast-light) img[src$=\#gh-light-mode-only],
.vscode-high-contrast-light img[src$=\#gh-dark-mode-only] {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/package-lock.json]---
Location: vscode-main/extensions/github/package-lock.json

```json
{
  "name": "github",
  "version": "0.0.1",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "github",
      "version": "0.0.1",
      "license": "MIT",
      "dependencies": {
        "@octokit/graphql": "8.2.0",
        "@octokit/graphql-schema": "14.4.0",
        "@octokit/rest": "21.1.0",
        "@vscode/extension-telemetry": "^1.0.0",
        "tunnel": "^0.0.6"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.41.0"
      }
    },
    "node_modules/@microsoft/1ds-core-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-core-js/-/1ds-core-js-4.3.4.tgz",
      "integrity": "sha512-3gbDUQgAO8EoyQTNcAEkxpuPnioC0May13P1l1l0NKZ128L9Ts/sj8QsfwCRTjHz0HThlA+4FptcAJXNYUy3rg==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/1ds-post-js": {
      "version": "4.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/1ds-post-js/-/1ds-post-js-4.3.4.tgz",
      "integrity": "sha512-nlKjWricDj0Tn68Dt0P8lX9a+X7LYrqJ6/iSfQwMfDhRIGLqW+wxx8gxS+iGWC/oc8zMQAeiZaemUpCwQcwpRQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "4.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-channel-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-channel-js/-/applicationinsights-channel-js-3.3.4.tgz",
      "integrity": "sha512-Z4nrxYwGKP9iyrYtm7iPQXVOFy4FsEsX0nDKkAi96Qpgw+vEh6NH4ORxMMuES0EollBQ3faJyvYCwckuCVIj0g==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-common": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-common/-/applicationinsights-common-3.3.4.tgz",
      "integrity": "sha512-4ms16MlIvcP4WiUPqopifNxcWCcrXQJ2ADAK/75uok2mNQe6ZNRsqb/P+pvhUxc8A5HRlvoXPP1ptDSN5Girgw==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-core-js": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-core-js/-/applicationinsights-core-js-3.3.4.tgz",
      "integrity": "sha512-MummANF0mgKIkdvVvfmHQTBliK114IZLRhTL0X0Ep+zjDwWMHqYZgew0nlFKAl6ggu42abPZFK5afpE7qjtYJA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/applicationinsights-shims": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-shims/-/applicationinsights-shims-3.0.1.tgz",
      "integrity": "sha512-DKwboF47H1nb33rSUfjqI6ryX29v+2QWcTrRvcQDA32AZr5Ilkr7whOOSsD1aBzwqX0RJEIP1Z81jfE3NBm/Lg==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.9.4 < 2.x"
      }
    },
    "node_modules/@microsoft/applicationinsights-web-basic": {
      "version": "3.3.4",
      "resolved": "https://registry.npmjs.org/@microsoft/applicationinsights-web-basic/-/applicationinsights-web-basic-3.3.4.tgz",
      "integrity": "sha512-OpEPXr8vU/t/M8T9jvWJzJx/pCyygIiR1nGM/2PTde0wn7anl71Gxl5fWol7K/WwFEORNjkL3CEyWOyDc+28AA==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/applicationinsights-channel-js": "3.3.4",
        "@microsoft/applicationinsights-common": "3.3.4",
        "@microsoft/applicationinsights-core-js": "3.3.4",
        "@microsoft/applicationinsights-shims": "3.0.1",
        "@microsoft/dynamicproto-js": "^2.0.3",
        "@nevware21/ts-async": ">= 0.5.2 < 2.x",
        "@nevware21/ts-utils": ">= 0.11.3 < 2.x"
      },
      "peerDependencies": {
        "tslib": ">= 1.0.0"
      }
    },
    "node_modules/@microsoft/dynamicproto-js": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/@microsoft/dynamicproto-js/-/dynamicproto-js-2.0.3.tgz",
      "integrity": "sha512-JTWTU80rMy3mdxOjjpaiDQsTLZ6YSGGqsjURsY6AUQtIj0udlF/jYmhdLZu8693ZIC0T1IwYnFa0+QeiMnziBA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.10.4 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-async": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-async/-/ts-async-0.5.4.tgz",
      "integrity": "sha512-IBTyj29GwGlxfzXw2NPnzty+w0Adx61Eze1/lknH/XIVdxtF9UnOpk76tnrHXWa6j84a1RR9hsOcHQPFv9qJjA==",
      "license": "MIT",
      "dependencies": {
        "@nevware21/ts-utils": ">= 0.11.6 < 2.x"
      }
    },
    "node_modules/@nevware21/ts-utils": {
      "version": "0.11.6",
      "resolved": "https://registry.npmjs.org/@nevware21/ts-utils/-/ts-utils-0.11.6.tgz",
      "integrity": "sha512-OUUJTh3fnaUSzg9DEHgv3d7jC+DnPL65mIO7RaR+jWve7+MmcgIvF79gY97DPQ4frH+IpNR78YAYd/dW4gK3kg==",
      "license": "MIT"
    },
    "node_modules/@octokit/auth-token": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/@octokit/auth-token/-/auth-token-5.1.2.tgz",
      "integrity": "sha512-JcQDsBdg49Yky2w2ld20IHAlwr8d/d8N6NiOXbtuoPCqzbsiJgF633mVUw3x4mo0H5ypataQIX7SFu3yy44Mpw==",
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/core": {
      "version": "6.1.5",
      "resolved": "https://registry.npmjs.org/@octokit/core/-/core-6.1.5.tgz",
      "integrity": "sha512-vvmsN0r7rguA+FySiCsbaTTobSftpIDIpPW81trAmsv9TGxg3YCujAxRYp/Uy8xmDgYCzzgulG62H7KYUFmeIg==",
      "dependencies": {
        "@octokit/auth-token": "^5.0.0",
        "@octokit/graphql": "^8.2.2",
        "@octokit/request": "^9.2.3",
        "@octokit/request-error": "^6.1.8",
        "@octokit/types": "^14.0.0",
        "before-after-hook": "^3.0.2",
        "universal-user-agent": "^7.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/core/node_modules/@octokit/graphql": {
      "version": "8.2.2",
      "resolved": "https://registry.npmjs.org/@octokit/graphql/-/graphql-8.2.2.tgz",
      "integrity": "sha512-Yi8hcoqsrXGdt0yObxbebHXFOiUA+2v3n53epuOg1QUgOB6c4XzvisBNVXJSl8RYA5KrDuSL2yq9Qmqe5N0ryA==",
      "dependencies": {
        "@octokit/request": "^9.2.3",
        "@octokit/types": "^14.0.0",
        "universal-user-agent": "^7.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/core/node_modules/@octokit/openapi-types": {
      "version": "25.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-25.0.0.tgz",
      "integrity": "sha512-FZvktFu7HfOIJf2BScLKIEYjDsw6RKc7rBJCdvCTfKsVnx2GEB/Nbzjr29DUdb7vQhlzS/j8qDzdditP0OC6aw=="
    },
    "node_modules/@octokit/core/node_modules/@octokit/types": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-14.0.0.tgz",
      "integrity": "sha512-VVmZP0lEhbo2O1pdq63gZFiGCKkm8PPp8AUOijlwPO6hojEVjspA0MWKP7E4hbvGxzFKNqKr6p0IYtOH/Wf/zA==",
      "dependencies": {
        "@octokit/openapi-types": "^25.0.0"
      }
    },
    "node_modules/@octokit/endpoint": {
      "version": "10.1.4",
      "resolved": "https://registry.npmjs.org/@octokit/endpoint/-/endpoint-10.1.4.tgz",
      "integrity": "sha512-OlYOlZIsfEVZm5HCSR8aSg02T2lbUWOsCQoPKfTXJwDzcHQBrVBGdGXb89dv2Kw2ToZaRtudp8O3ZIYoaOjKlA==",
      "dependencies": {
        "@octokit/types": "^14.0.0",
        "universal-user-agent": "^7.0.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/endpoint/node_modules/@octokit/openapi-types": {
      "version": "25.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-25.0.0.tgz",
      "integrity": "sha512-FZvktFu7HfOIJf2BScLKIEYjDsw6RKc7rBJCdvCTfKsVnx2GEB/Nbzjr29DUdb7vQhlzS/j8qDzdditP0OC6aw=="
    },
    "node_modules/@octokit/endpoint/node_modules/@octokit/types": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-14.0.0.tgz",
      "integrity": "sha512-VVmZP0lEhbo2O1pdq63gZFiGCKkm8PPp8AUOijlwPO6hojEVjspA0MWKP7E4hbvGxzFKNqKr6p0IYtOH/Wf/zA==",
      "dependencies": {
        "@octokit/openapi-types": "^25.0.0"
      }
    },
    "node_modules/@octokit/graphql": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/@octokit/graphql/-/graphql-8.2.0.tgz",
      "integrity": "sha512-gejfDywEml/45SqbWTWrhfwvLBrcGYhOn50sPOjIeVvH6i7D16/9xcFA8dAJNp2HMcd+g4vru41g4E2RBiZvfQ==",
      "dependencies": {
        "@octokit/request": "^9.1.4",
        "@octokit/types": "^13.8.0",
        "universal-user-agent": "^7.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/graphql-schema": {
      "version": "14.4.0",
      "resolved": "https://registry.npmjs.org/@octokit/graphql-schema/-/graphql-schema-14.4.0.tgz",
      "integrity": "sha512-+O6/dsLlR6V9gv+t1lqsN+x73TLwyQWZpd3M8/eYnuny7VaznV9TAyUxf18tX8WBBS5IqtlLDk1nG+aSTPRZzQ==",
      "dependencies": {
        "graphql": "^16.0.0",
        "graphql-tag": "^2.10.3"
      }
    },
    "node_modules/@octokit/openapi-types": {
      "version": "24.2.0",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-24.2.0.tgz",
      "integrity": "sha512-9sIH3nSUttelJSXUrmGzl7QUBFul0/mB8HRYl3fOlgHbIWG+WnYDXU3v/2zMtAvuzZ/ed00Ei6on975FhBfzrg=="
    },
    "node_modules/@octokit/plugin-paginate-rest": {
      "version": "11.6.0",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-paginate-rest/-/plugin-paginate-rest-11.6.0.tgz",
      "integrity": "sha512-n5KPteiF7pWKgBIBJSk8qzoZWcUkza2O6A0za97pMGVrGfPdltxrfmfF5GucHYvHGZD8BdaZmmHGz5cX/3gdpw==",
      "dependencies": {
        "@octokit/types": "^13.10.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/plugin-request-log": {
      "version": "5.3.1",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-request-log/-/plugin-request-log-5.3.1.tgz",
      "integrity": "sha512-n/lNeCtq+9ofhC15xzmJCNKP2BWTv8Ih2TTy+jatNCCq/gQP/V7rK3fjIfuz0pDWDALO/o/4QY4hyOF6TQQFUw==",
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/plugin-rest-endpoint-methods": {
      "version": "13.5.0",
      "resolved": "https://registry.npmjs.org/@octokit/plugin-rest-endpoint-methods/-/plugin-rest-endpoint-methods-13.5.0.tgz",
      "integrity": "sha512-9Pas60Iv9ejO3WlAX3maE1+38c5nqbJXV5GrncEfkndIpZrJ/WPMRd2xYDcPPEt5yzpxcjw9fWNoPhsSGzqKqw==",
      "dependencies": {
        "@octokit/types": "^13.10.0"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "@octokit/core": ">=6"
      }
    },
    "node_modules/@octokit/request": {
      "version": "9.2.3",
      "resolved": "https://registry.npmjs.org/@octokit/request/-/request-9.2.3.tgz",
      "integrity": "sha512-Ma+pZU8PXLOEYzsWf0cn/gY+ME57Wq8f49WTXA8FMHp2Ps9djKw//xYJ1je8Hm0pR2lU9FUGeJRWOtxq6olt4w==",
      "dependencies": {
        "@octokit/endpoint": "^10.1.4",
        "@octokit/request-error": "^6.1.8",
        "@octokit/types": "^14.0.0",
        "fast-content-type-parse": "^2.0.0",
        "universal-user-agent": "^7.0.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/request-error": {
      "version": "6.1.8",
      "resolved": "https://registry.npmjs.org/@octokit/request-error/-/request-error-6.1.8.tgz",
      "integrity": "sha512-WEi/R0Jmq+IJKydWlKDmryPcmdYSVjL3ekaiEL1L9eo1sUnqMJ+grqmC9cjk7CA7+b2/T397tO5d8YLOH3qYpQ==",
      "dependencies": {
        "@octokit/types": "^14.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/request-error/node_modules/@octokit/openapi-types": {
      "version": "25.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-25.0.0.tgz",
      "integrity": "sha512-FZvktFu7HfOIJf2BScLKIEYjDsw6RKc7rBJCdvCTfKsVnx2GEB/Nbzjr29DUdb7vQhlzS/j8qDzdditP0OC6aw=="
    },
    "node_modules/@octokit/request-error/node_modules/@octokit/types": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-14.0.0.tgz",
      "integrity": "sha512-VVmZP0lEhbo2O1pdq63gZFiGCKkm8PPp8AUOijlwPO6hojEVjspA0MWKP7E4hbvGxzFKNqKr6p0IYtOH/Wf/zA==",
      "dependencies": {
        "@octokit/openapi-types": "^25.0.0"
      }
    },
    "node_modules/@octokit/request/node_modules/@octokit/openapi-types": {
      "version": "25.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/openapi-types/-/openapi-types-25.0.0.tgz",
      "integrity": "sha512-FZvktFu7HfOIJf2BScLKIEYjDsw6RKc7rBJCdvCTfKsVnx2GEB/Nbzjr29DUdb7vQhlzS/j8qDzdditP0OC6aw=="
    },
    "node_modules/@octokit/request/node_modules/@octokit/types": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-14.0.0.tgz",
      "integrity": "sha512-VVmZP0lEhbo2O1pdq63gZFiGCKkm8PPp8AUOijlwPO6hojEVjspA0MWKP7E4hbvGxzFKNqKr6p0IYtOH/Wf/zA==",
      "dependencies": {
        "@octokit/openapi-types": "^25.0.0"
      }
    },
    "node_modules/@octokit/rest": {
      "version": "21.1.0",
      "resolved": "https://registry.npmjs.org/@octokit/rest/-/rest-21.1.0.tgz",
      "integrity": "sha512-93iLxcKDJboUpmnUyeJ6cRIi7z7cqTZT1K7kRK4LobGxwTwpsa+2tQQbRQNGy7IFDEAmrtkf4F4wBj3D5rVlJQ==",
      "dependencies": {
        "@octokit/core": "^6.1.3",
        "@octokit/plugin-paginate-rest": "^11.4.0",
        "@octokit/plugin-request-log": "^5.3.1",
        "@octokit/plugin-rest-endpoint-methods": "^13.3.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/@octokit/types": {
      "version": "13.10.0",
      "resolved": "https://registry.npmjs.org/@octokit/types/-/types-13.10.0.tgz",
      "integrity": "sha512-ifLaO34EbbPj0Xgro4G5lP5asESjwHracYJvVaPIyXMuiuXLlhic3S47cBdTb+jfODkTE5YtGCLt3Ay3+J97sA==",
      "dependencies": {
        "@octokit/openapi-types": "^24.2.0"
      }
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
    "node_modules/@vscode/extension-telemetry": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-1.0.0.tgz",
      "integrity": "sha512-vaTZE65zigWwSWYB6yaZUAyVC/Ux+6U82hnzy/ejuS/KpFifO+0oORNd5yAoPeIRnYjvllM6ES3YlX4K5tUuww==",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/before-after-hook": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/before-after-hook/-/before-after-hook-3.0.2.tgz",
      "integrity": "sha512-Nik3Sc0ncrMK4UUdXQmAnRtzmNQTAAXmXIopizwZ1W1t8QmfJj+zL4OA2I7XPTPW5z5TDqv4hRo/JzouDJnX3A=="
    },
    "node_modules/fast-content-type-parse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/fast-content-type-parse/-/fast-content-type-parse-2.0.1.tgz",
      "integrity": "sha512-nGqtvLrj5w0naR6tDPfB4cUmYCqouzyQiz6C5y/LtcDllJdrcc6WaWW6iXyIIOErTa/XRybj28aasdn4LkVk6Q==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/fastify"
        },
        {
          "type": "opencollective",
          "url": "https://opencollective.com/fastify"
        }
      ]
    },
    "node_modules/graphql": {
      "version": "16.8.1",
      "resolved": "https://registry.npmjs.org/graphql/-/graphql-16.8.1.tgz",
      "integrity": "sha512-59LZHPdGZVh695Ud9lRzPBVTtlX9ZCV150Er2W43ro37wVof0ctenSaskPPjN7lVTIN8mSZt8PHUNKZuNQUuxw==",
      "engines": {
        "node": "^12.22.0 || ^14.16.0 || ^16.0.0 || >=17.0.0"
      }
    },
    "node_modules/graphql-tag": {
      "version": "2.12.6",
      "resolved": "https://registry.npmjs.org/graphql-tag/-/graphql-tag-2.12.6.tgz",
      "integrity": "sha512-FdSNcu2QQcWnM2VNvSCCDCVS5PpPqpzgFT8+GXzqJuoDd0CBncxCY278u4mhRO7tMgo2JjgJA5aZ+nWSQ/Z+xg==",
      "dependencies": {
        "tslib": "^2.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "peerDependencies": {
        "graphql": "^0.9.0 || ^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0 || ^14.0.0 || ^15.0.0 || ^16.0.0"
      }
    },
    "node_modules/tslib": {
      "version": "2.6.3",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.6.3.tgz",
      "integrity": "sha512-xNvxJEOUiWPGhUuUdQgAJPKOOJfGnIyKySOc09XkKsgdUV/3E2zvwZYdejjmRgPCgcym1juLH3226yA7sEFJKQ=="
    },
    "node_modules/tunnel": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/tunnel/-/tunnel-0.0.6.tgz",
      "integrity": "sha512-1h/Lnq9yajKY2PEbBadPXj3VxsDDu844OnaAo52UVmIzIvwwtBPIuNvkjuzBlTWpfJyUbG3ez0KSBibQkj4ojg==",
      "engines": {
        "node": ">=0.6.11 <=0.7.0 || >=0.7.3"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/universal-user-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/universal-user-agent/-/universal-user-agent-7.0.2.tgz",
      "integrity": "sha512-0JCqzSKnStlRRQfCdowvqy3cy0Dvtlb8xecj/H8JFZuCze4rwjPZQOgvFvn0Ws/usCHQFGpyr+pB9adaGwXn4Q=="
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/package.json]---
Location: vscode-main/extensions/github/package.json

```json
{
  "name": "github",
  "displayName": "%displayName%",
  "description": "%description%",
  "publisher": "vscode",
  "license": "MIT",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.41.0"
  },
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "icon": "images/icon.png",
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "*"
  ],
  "extensionDependencies": [
    "vscode.git-base"
  ],
  "main": "./out/extension.js",
  "type": "module",
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "enabledApiProposals": [
    "canonicalUriProvider",
    "contribEditSessions",
    "contribShareMenu",
    "contribSourceControlHistoryItemMenu",
    "scmHistoryProvider",
    "shareProvider",
    "timeline"
  ],
  "contributes": {
    "commands": [
      {
        "command": "github.publish",
        "title": "%command.publish%"
      },
      {
        "command": "github.copyVscodeDevLink",
        "title": "%command.copyVscodeDevLink%"
      },
      {
        "command": "github.copyVscodeDevLinkFile",
        "title": "%command.copyVscodeDevLink%"
      },
      {
        "command": "github.copyVscodeDevLinkWithoutRange",
        "title": "%command.copyVscodeDevLink%"
      },
      {
        "command": "github.openOnVscodeDev",
        "title": "%command.openOnVscodeDev%",
        "icon": "$(globe)"
      },
      {
        "command": "github.graph.openOnGitHub",
        "title": "%command.openOnGitHub%",
        "icon": "$(github)"
      },
      {
        "command": "github.timeline.openOnGitHub",
        "title": "%command.openOnGitHub%",
        "icon": "$(github)"
      }
    ],
    "continueEditSession": [
      {
        "command": "github.openOnVscodeDev",
        "when": "github.hasGitHubRepo",
        "qualifiedName": "Continue Working in vscode.dev",
        "category": "Remote Repositories",
        "remoteGroup": "virtualfs_44_vscode-vfs_2_web@2"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "github.publish",
          "when": "git-base.gitEnabled && workspaceFolderCount != 0 && remoteName != 'codespaces'"
        },
        {
          "command": "github.graph.openOnGitHub",
          "when": "false"
        },
        {
          "command": "github.copyVscodeDevLink",
          "when": "false"
        },
        {
          "command": "github.copyVscodeDevLinkFile",
          "when": "false"
        },
        {
          "command": "github.copyVscodeDevLinkWithoutRange",
          "when": "false"
        },
        {
          "command": "github.openOnVscodeDev",
          "when": "false"
        },
        {
          "command": "github.timeline.openOnGitHub",
          "when": "false"
        }
      ],
      "file/share": [
        {
          "command": "github.copyVscodeDevLinkFile",
          "when": "github.hasGitHubRepo && remoteName != 'codespaces'",
          "group": "0_vscode@0"
        }
      ],
      "editor/context/share": [
        {
          "command": "github.copyVscodeDevLink",
          "when": "github.hasGitHubRepo && resourceScheme != untitled && !isInEmbeddedEditor && remoteName != 'codespaces'",
          "group": "0_vscode@0"
        }
      ],
      "explorer/context/share": [
        {
          "command": "github.copyVscodeDevLinkWithoutRange",
          "when": "github.hasGitHubRepo && resourceScheme != untitled && !isInEmbeddedEditor && remoteName != 'codespaces'",
          "group": "0_vscode@0"
        }
      ],
      "editor/lineNumber/context": [
        {
          "command": "github.copyVscodeDevLink",
          "when": "github.hasGitHubRepo && resourceScheme != untitled && activeEditor == workbench.editors.files.textFileEditor && config.editor.lineNumbers == on && remoteName != 'codespaces'",
          "group": "1_cutcopypaste@2"
        },
        {
          "command": "github.copyVscodeDevLink",
          "when": "github.hasGitHubRepo && resourceScheme != untitled && activeEditor == workbench.editor.notebook && remoteName != 'codespaces'",
          "group": "1_cutcopypaste@2"
        }
      ],
      "editor/title/context/share": [
        {
          "command": "github.copyVscodeDevLinkWithoutRange",
          "when": "github.hasGitHubRepo && resourceScheme != untitled && remoteName != 'codespaces'",
          "group": "0_vscode@0"
        }
      ],
      "scm/historyItem/context": [
        {
          "command": "github.graph.openOnGitHub",
          "when": "github.hasGitHubRepo",
          "group": "0_view@2"
        }
      ],
      "timeline/item/context": [
        {
          "command": "github.timeline.openOnGitHub",
          "group": "1_actions@3",
          "when": "github.hasGitHubRepo && timelineItem =~ /git:file:commit\\b/"
        }
      ]
    },
    "configuration": [
      {
        "title": "GitHub",
        "properties": {
          "github.branchProtection": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%config.branchProtection%"
          },
          "github.gitAuthentication": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%config.gitAuthentication%"
          },
          "github.gitProtocol": {
            "type": "string",
            "enum": [
              "https",
              "ssh"
            ],
            "default": "https",
            "description": "%config.gitProtocol%"
          },
          "github.showAvatar": {
            "type": "boolean",
            "scope": "resource",
            "default": true,
            "description": "%config.showAvatar%"
          }
        }
      }
    ],
    "viewsWelcome": [
      {
        "view": "scm",
        "contents": "%welcome.publishFolder%",
        "when": "config.git.enabled && git.state == initialized && workbenchState == folder && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0"
      },
      {
        "view": "scm",
        "contents": "%welcome.publishWorkspaceFolder%",
        "when": "config.git.enabled && git.state == initialized && workbenchState == workspace && workspaceFolderCount != 0 && git.parentRepositoryCount == 0 && git.unsafeRepositoryCount == 0 && git.closedRepositoryCount == 0"
      }
    ],
    "markdown.previewStyles": [
      "./markdown.css"
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "gulp compile-extension:github",
    "watch": "gulp watch-extension:github"
  },
  "dependencies": {
    "@octokit/graphql": "8.2.0",
    "@octokit/graphql-schema": "14.4.0",
    "@octokit/rest": "21.1.0",
    "tunnel": "^0.0.6",
    "@vscode/extension-telemetry": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/package.nls.json]---
Location: vscode-main/extensions/github/package.nls.json

```json
{
	"displayName": "GitHub",
	"description": "GitHub features for VS Code",
	"command.copyVscodeDevLink": "Copy vscode.dev Link",
	"command.publish": "Publish to GitHub",
	"command.openOnGitHub": "Open on GitHub",
	"command.openOnVscodeDev": "Open in vscode.dev",
	"config.branchProtection": "Controls whether to query repository rules for GitHub repositories",
	"config.gitAuthentication": "Controls whether to enable automatic GitHub authentication for git commands within VS Code.",
	"config.gitProtocol": "Controls which protocol is used to clone a GitHub repository",
	"config.showAvatar": "Controls whether to show the GitHub avatar of the commit author in various hovers (ex: Git blame, Timeline, Source Control Graph, etc.)",
	"welcome.publishFolder": {
		"message": "You can directly publish this folder to a GitHub repository. Once published, you'll have access to source control features powered by Git and GitHub.\n[$(github) Publish to GitHub](command:github.publish)",
		"comment": [
			"{Locked='$(github)'}",
			"Do not translate '$(github)'. It will be rendered as an icon",
			"{Locked='](command:github.publish'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	},
	"welcome.publishWorkspaceFolder": {
		"message": "You can directly publish a workspace folder to a GitHub repository. Once published, you'll have access to source control features powered by Git and GitHub.\n[$(github) Publish to GitHub](command:github.publish)",
		"comment": [
			"{Locked='$(github)'}",
			"Do not translate '$(github)'. It will be rendered as an icon",
			"{Locked='](command:github.publish'}",
			"Do not translate the 'command:*' part inside of the '(..)'. It is an internal command syntax for VS Code",
			"Please make sure there is no space between the right bracket and left parenthesis:  ]( this is an internal syntax for links"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/README.md]---
Location: vscode-main/extensions/github/README.md

```markdown
# GitHub for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides the following GitHub-related features for VS Code:

- `Publish to GitHub` command
- `Clone from GitHub` participant to the `Git: Clone` command
- GitHub authentication for built-in git commands, controlled via the `github.gitAuthentication` command
- Automatic fork creation when attempting to push to a repository without permissions
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/tsconfig.json]---
Location: vscode-main/extensions/github/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"module": "NodeNext",
		"moduleResolution": "NodeNext",
		"outDir": "./out",
		"skipLibCheck": true,
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.canonicalUriProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.scmHistoryProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.shareProvider.d.ts",
		"../../src/vscode-dts/vscode.proposed.timeline.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/auth.ts]---
Location: vscode-main/extensions/github/src/auth.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AuthenticationSession, EventEmitter, authentication, window } from 'vscode';
import { Agent, globalAgent } from 'https';
import { graphql } from '@octokit/graphql/types';
import { Octokit } from '@octokit/rest';
import { httpsOverHttp } from 'tunnel';
import { URL } from 'url';
import { DisposableStore, sequentialize } from './util.js';

export class AuthenticationError extends Error { }

function getAgent(url: string | undefined = process.env.HTTPS_PROXY): Agent {
	if (!url) {
		return globalAgent;
	}

	try {
		const { hostname, port, username, password } = new URL(url);
		const auth = username && password && `${username}:${password}`;
		return httpsOverHttp({ proxy: { host: hostname, port, proxyAuth: auth } });
	} catch (e) {
		window.showErrorMessage(`HTTPS_PROXY environment variable ignored: ${e.message}`);
		return globalAgent;
	}
}

const scopes = ['repo', 'workflow', 'user:email', 'read:user'];

export async function getSession(): Promise<AuthenticationSession> {
	return await authentication.getSession('github', scopes, { createIfNone: true });
}

let _octokit: Promise<Octokit> | undefined;

export function getOctokit(): Promise<Octokit> {
	if (!_octokit) {
		_octokit = getSession().then(async session => {
			const token = session.accessToken;
			const agent = getAgent();

			const { Octokit } = await import('@octokit/rest');

			return new Octokit({
				request: { agent },
				userAgent: 'GitHub VSCode',
				auth: `token ${token}`
			});
		}).then(null, async err => {
			_octokit = undefined;
			throw err;
		});
	}

	return _octokit;
}

export class OctokitService {
	private _octokitGraphql: graphql | undefined;

	private readonly _onDidChangeSessions = new EventEmitter<void>();
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	private readonly _disposables = new DisposableStore();

	constructor() {
		this._disposables.add(this._onDidChangeSessions);
		this._disposables.add(authentication.onDidChangeSessions(e => {
			if (e.provider.id === 'github') {
				this._octokitGraphql = undefined;
				this._onDidChangeSessions.fire();
			}
		}));
	}

	@sequentialize
	public async getOctokitGraphql(): Promise<graphql> {
		if (!this._octokitGraphql) {
			try {
				const session = await authentication.getSession('github', scopes, { silent: true });

				if (!session) {
					throw new AuthenticationError('No GitHub authentication session available.');
				}

				const token = session.accessToken;
				const { graphql } = await import('@octokit/graphql');

				this._octokitGraphql = graphql.defaults({
					headers: {
						authorization: `token ${token}`
					},
					request: {
						agent: getAgent()
					}
				});

				return this._octokitGraphql;
			} catch (err) {
				this._octokitGraphql = undefined;
				throw new AuthenticationError(err.message);
			}
		}

		return this._octokitGraphql;
	}

	dispose(): void {
		this._octokitGraphql = undefined;
		this._disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/branchProtection.ts]---
Location: vscode-main/extensions/github/src/branchProtection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventEmitter, LogOutputChannel, Memento, Uri, workspace } from 'vscode';
import { Repository as GitHubRepository, RepositoryRuleset } from '@octokit/graphql-schema';
import { AuthenticationError, OctokitService } from './auth.js';
import { API, BranchProtection, BranchProtectionProvider, BranchProtectionRule, Repository } from './typings/git.js';
import { DisposableStore, getRepositoryFromUrl } from './util.js';
import { TelemetryReporter } from '@vscode/extension-telemetry';

const REPOSITORY_QUERY = `
	query repositoryPermissions($owner: String!, $repo: String!) {
		repository(owner: $owner, name: $repo) {
			defaultBranchRef {
				name
			},
			viewerPermission
		}
	}
`;

const REPOSITORY_RULESETS_QUERY = `
	query repositoryRulesets($owner: String!, $repo: String!, $cursor: String, $limit: Int = 100) {
		repository(owner: $owner, name: $repo) {
			rulesets(includeParents: true, first: $limit, after: $cursor) {
				nodes {
					name
					enforcement
					rules(type: PULL_REQUEST) {
						totalCount
					}
					conditions {
						refName {
							include
							exclude
						}
					}
					target
				},
				pageInfo {
					endCursor,
					hasNextPage
				}
			}
		}
	}
`;

export class GitHubBranchProtectionProviderManager {

	private readonly disposables = new DisposableStore();
	private readonly providerDisposables = new DisposableStore();

	private _enabled = false;
	private set enabled(enabled: boolean) {
		if (this._enabled === enabled) {
			return;
		}

		if (enabled) {
			for (const repository of this.gitAPI.repositories) {
				this.providerDisposables.add(this.gitAPI.registerBranchProtectionProvider(repository.rootUri, new GitHubBranchProtectionProvider(repository, this.globalState, this.octokitService, this.logger, this.telemetryReporter)));
			}
		} else {
			this.providerDisposables.dispose();
		}

		this._enabled = enabled;
	}

	constructor(
		private readonly gitAPI: API,
		private readonly globalState: Memento,
		private readonly octokitService: OctokitService,
		private readonly logger: LogOutputChannel,
		private readonly telemetryReporter: TelemetryReporter) {
		this.disposables.add(this.gitAPI.onDidOpenRepository(repository => {
			if (this._enabled) {
				this.providerDisposables.add(gitAPI.registerBranchProtectionProvider(repository.rootUri,
					new GitHubBranchProtectionProvider(repository, this.globalState, this.octokitService, this.logger, this.telemetryReporter)));
			}
		}));

		this.disposables.add(workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('github.branchProtection')) {
				this.updateEnablement();
			}
		}));

		this.updateEnablement();
	}

	private updateEnablement(): void {
		const config = workspace.getConfiguration('github', null);
		this.enabled = config.get<boolean>('branchProtection', true) === true;
	}

	dispose(): void {
		this.enabled = false;
		this.disposables.dispose();
	}

}

export class GitHubBranchProtectionProvider implements BranchProtectionProvider {
	private readonly _onDidChangeBranchProtection = new EventEmitter<Uri>();
	onDidChangeBranchProtection = this._onDidChangeBranchProtection.event;

	private branchProtection: BranchProtection[];
	private readonly globalStateKey: string;

	private readonly disposables = new DisposableStore();

	constructor(
		private readonly repository: Repository,
		private readonly globalState: Memento,
		private readonly octokitService: OctokitService,
		private readonly logger: LogOutputChannel,
		private readonly telemetryReporter: TelemetryReporter
	) {
		this.globalStateKey = `branchProtection:${this.repository.rootUri.toString()}`;

		this.disposables.add(this._onDidChangeBranchProtection);

		// Restore branch protection from global state
		this.branchProtection = this.globalState.get<BranchProtection[]>(this.globalStateKey, []);

		repository.status().then(() => {
			this.disposables.add(this.octokitService.onDidChangeSessions(() => {
				this.updateRepositoryBranchProtection();
			}));
			this.updateRepositoryBranchProtection();
		});
	}

	provideBranchProtection(): BranchProtection[] {
		return this.branchProtection;
	}

	private async getRepositoryDetails(owner: string, repo: string): Promise<GitHubRepository> {
		const graphql = await this.octokitService.getOctokitGraphql();
		const { repository } = await graphql<{ repository: GitHubRepository }>(REPOSITORY_QUERY, { owner, repo });

		return repository;
	}

	private async getRepositoryRulesets(owner: string, repo: string): Promise<RepositoryRuleset[]> {
		const rulesets: RepositoryRuleset[] = [];

		let cursor: string | undefined = undefined;
		const graphql = await this.octokitService.getOctokitGraphql();

		while (true) {
			const { repository } = await graphql<{ repository: GitHubRepository }>(REPOSITORY_RULESETS_QUERY, { owner, repo, cursor });

			rulesets.push(...(repository.rulesets?.nodes ?? [])
				// Active branch ruleset that contains the pull request required rule
				.filter(node => node && node.target === 'BRANCH' && node.enforcement === 'ACTIVE' && (node.rules?.totalCount ?? 0) > 0) as RepositoryRuleset[]);

			if (repository.rulesets?.pageInfo.hasNextPage) {
				cursor = repository.rulesets.pageInfo.endCursor as string | undefined;
			} else {
				break;
			}
		}

		return rulesets;
	}

	private async updateRepositoryBranchProtection(): Promise<void> {
		const branchProtection: BranchProtection[] = [];

		try {
			for (const remote of this.repository.state.remotes) {
				const repository = getRepositoryFromUrl(remote.pushUrl ?? remote.fetchUrl ?? '');

				if (!repository) {
					continue;
				}

				// Repository details
				this.logger.trace(`[GitHubBranchProtectionProvider][updateRepositoryBranchProtection] Fetching repository details for "${repository.owner}/${repository.repo}".`);
				const repositoryDetails = await this.getRepositoryDetails(repository.owner, repository.repo);

				// Check repository write permission
				if (repositoryDetails.viewerPermission !== 'ADMIN' && repositoryDetails.viewerPermission !== 'MAINTAIN' && repositoryDetails.viewerPermission !== 'WRITE') {
					this.logger.trace(`[GitHubBranchProtectionProvider][updateRepositoryBranchProtection] Skipping branch protection for "${repository.owner}/${repository.repo}" due to missing repository write permission.`);
					continue;
				}

				// Get repository rulesets
				const branchProtectionRules: BranchProtectionRule[] = [];
				const repositoryRulesets = await this.getRepositoryRulesets(repository.owner, repository.repo);

				for (const ruleset of repositoryRulesets) {
					branchProtectionRules.push({
						include: (ruleset.conditions.refName?.include ?? []).map(r => this.parseRulesetRefName(repositoryDetails, r)),
						exclude: (ruleset.conditions.refName?.exclude ?? []).map(r => this.parseRulesetRefName(repositoryDetails, r))
					});
				}

				branchProtection.push({ remote: remote.name, rules: branchProtectionRules });
			}

			this.branchProtection = branchProtection;
			this._onDidChangeBranchProtection.fire(this.repository.rootUri);

			// Save branch protection to global state
			await this.globalState.update(this.globalStateKey, branchProtection);
			this.logger.trace(`[GitHubBranchProtectionProvider][updateRepositoryBranchProtection] Branch protection for "${this.repository.rootUri.toString()}": ${JSON.stringify(branchProtection)}.`);

			/* __GDPR__
				"branchProtection" : {
					"owner": "lszomoru",
					"rulesetCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Number of repository rulesets" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('branchProtection', undefined, { rulesetCount: this.branchProtection.length });
		} catch (err) {
			this.logger.warn(`[GitHubBranchProtectionProvider][updateRepositoryBranchProtection] Failed to update repository branch protection: ${err.message}`);

			if (err instanceof AuthenticationError) {
				// A GitHub authentication session could be missing if the user has not yet
				// signed in with their GitHub account or they have signed out. If there is
				// branch protection information we have to clear it.
				if (this.branchProtection.length !== 0) {
					this.branchProtection = branchProtection;
					this._onDidChangeBranchProtection.fire(this.repository.rootUri);

					await this.globalState.update(this.globalStateKey, undefined);
				}
			}
		}
	}

	private parseRulesetRefName(repository: GitHubRepository, refName: string): string {
		if (refName.startsWith('refs/heads/')) {
			return refName.substring(11);
		}

		switch (refName) {
			case '~ALL':
				return '**/*';
			case '~DEFAULT_BRANCH':
				return repository.defaultBranchRef!.name;
			default:
				return refName;
		}
	}

	dispose(): void {
		this.disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/canonicalUriProvider.ts]---
Location: vscode-main/extensions/github/src/canonicalUriProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CanonicalUriProvider, CanonicalUriRequestOptions, Disposable, ProviderResult, Uri, workspace } from 'vscode';
import { API } from './typings/git.js';

const SUPPORTED_SCHEMES = ['ssh', 'https', 'file'];

export class GitHubCanonicalUriProvider implements CanonicalUriProvider {

	private disposables: Disposable[] = [];
	constructor(private gitApi: API) {
		this.disposables.push(...SUPPORTED_SCHEMES.map((scheme) => workspace.registerCanonicalUriProvider(scheme, this)));
	}

	dispose() { this.disposables.forEach((disposable) => disposable.dispose()); }

	provideCanonicalUri(uri: Uri, options: CanonicalUriRequestOptions, _token: CancellationToken): ProviderResult<Uri> {
		if (options.targetScheme !== 'https') {
			return;
		}

		switch (uri.scheme) {
			case 'file': {
				const repository = this.gitApi.getRepository(uri);
				const remote = repository?.state.remotes.find((remote) => remote.name === repository.state.HEAD?.remote)?.pushUrl?.replace(/^(git@[^\/:]+)(:)/i, 'ssh://$1/');
				if (remote) {
					return toHttpsGitHubRemote(uri);
				}
			}
			default:
				return toHttpsGitHubRemote(uri);
		}
	}
}

function toHttpsGitHubRemote(uri: Uri) {
	if (uri.scheme === 'ssh' && uri.authority === 'git@github.com') {
		// if this is a git@github.com URI, return the HTTPS equivalent
		const [owner, repo] = (uri.path.endsWith('.git') ? uri.path.slice(0, -4) : uri.path).split('/').filter((segment) => segment.length > 0);
		return Uri.parse(`https://github.com/${owner}/${repo}`);
	}
	if (uri.scheme === 'https' && uri.authority === 'github.com') {
		return uri;
	}
	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/commands.ts]---
Location: vscode-main/extensions/github/src/commands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { API as GitAPI, RefType, Repository } from './typings/git.js';
import { publishRepository } from './publish.js';
import { DisposableStore, getRepositoryFromUrl } from './util.js';
import { LinkContext, getCommitLink, getLink, getVscodeDevHost } from './links.js';

async function copyVscodeDevLink(gitAPI: GitAPI, useSelection: boolean, context: LinkContext, includeRange = true) {
	try {
		const permalink = await getLink(gitAPI, useSelection, true, getVscodeDevHost(), 'headlink', context, includeRange);
		if (permalink) {
			return vscode.env.clipboard.writeText(permalink);
		}
	} catch (err) {
		if (!(err instanceof vscode.CancellationError)) {
			vscode.window.showErrorMessage(err.message);
		}
	}
}

async function openVscodeDevLink(gitAPI: GitAPI): Promise<vscode.Uri | undefined> {
	try {
		const headlink = await getLink(gitAPI, true, false, getVscodeDevHost(), 'headlink');
		return headlink ? vscode.Uri.parse(headlink) : undefined;
	} catch (err) {
		if (!(err instanceof vscode.CancellationError)) {
			vscode.window.showErrorMessage(err.message);
		}
		return undefined;
	}
}

async function openOnGitHub(repository: Repository, commit: string): Promise<void> {
	// Get the unique remotes that contain the commit
	const branches = await repository.getBranches({ contains: commit, remote: true });
	const remoteNames = new Set(branches.filter(b => b.type === RefType.RemoteHead && b.remote).map(b => b.remote!));

	// GitHub remotes that contain the commit
	const remotes = repository.state.remotes
		.filter(r => remoteNames.has(r.name) && r.fetchUrl && getRepositoryFromUrl(r.fetchUrl));

	if (remotes.length === 0) {
		vscode.window.showInformationMessage(vscode.l10n.t('No GitHub remotes found that contain this commit.'));
		return;
	}

	// upstream -> origin -> first
	const remote = remotes.find(r => r.name === 'upstream')
		?? remotes.find(r => r.name === 'origin')
		?? remotes[0];

	const link = getCommitLink(remote.fetchUrl!, commit);
	vscode.env.openExternal(vscode.Uri.parse(link));
}

export function registerCommands(gitAPI: GitAPI): vscode.Disposable {
	const disposables = new DisposableStore();

	disposables.add(vscode.commands.registerCommand('github.publish', async () => {
		try {
			publishRepository(gitAPI);
		} catch (err) {
			vscode.window.showErrorMessage(err.message);
		}
	}));

	disposables.add(vscode.commands.registerCommand('github.copyVscodeDevLink', async (context: LinkContext) => {
		return copyVscodeDevLink(gitAPI, true, context);
	}));

	disposables.add(vscode.commands.registerCommand('github.copyVscodeDevLinkFile', async (context: LinkContext) => {
		return copyVscodeDevLink(gitAPI, false, context);
	}));

	disposables.add(vscode.commands.registerCommand('github.copyVscodeDevLinkWithoutRange', async (context: LinkContext) => {
		return copyVscodeDevLink(gitAPI, true, context, false);
	}));

	disposables.add(vscode.commands.registerCommand('github.openOnGitHub', async (url: string, historyItemId: string) => {
		const link = getCommitLink(url, historyItemId);
		vscode.env.openExternal(vscode.Uri.parse(link));
	}));

	disposables.add(vscode.commands.registerCommand('github.graph.openOnGitHub', async (repository: vscode.SourceControl, historyItem: vscode.SourceControlHistoryItem) => {
		if (!repository || !historyItem) {
			return;
		}

		const apiRepository = gitAPI.repositories.find(r => r.rootUri.fsPath === repository.rootUri?.fsPath);
		if (!apiRepository) {
			return;
		}

		await openOnGitHub(apiRepository, historyItem.id);
	}));

	disposables.add(vscode.commands.registerCommand('github.timeline.openOnGitHub', async (item: vscode.TimelineItem, uri: vscode.Uri) => {
		if (!item.id || !uri) {
			return;
		}

		const apiRepository = gitAPI.getRepository(uri);
		if (!apiRepository) {
			return;
		}

		await openOnGitHub(apiRepository, item.id);
	}));

	disposables.add(vscode.commands.registerCommand('github.openOnVscodeDev', async () => {
		return openVscodeDevLink(gitAPI);
	}));

	return disposables;
}
```

--------------------------------------------------------------------------------

````

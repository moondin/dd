---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 40
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 40 of 552)

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

---[FILE: extensions/git/src/repository.ts]---
Location: vscode-main/extensions/git/src/repository.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import TelemetryReporter from '@vscode/extension-telemetry';
import * as fs from 'fs';
import * as path from 'path';
import picomatch from 'picomatch';
import { CancellationError, CancellationToken, CancellationTokenSource, Command, commands, Disposable, Event, EventEmitter, FileDecoration, FileType, l10n, LogLevel, LogOutputChannel, Memento, ProgressLocation, ProgressOptions, QuickDiffProvider, RelativePattern, scm, SourceControl, SourceControlInputBox, SourceControlInputBoxValidation, SourceControlInputBoxValidationType, SourceControlResourceDecorations, SourceControlResourceGroup, SourceControlResourceState, TabInputNotebookDiff, TabInputTextDiff, TabInputTextMultiDiff, ThemeColor, ThemeIcon, Uri, window, workspace, WorkspaceEdit } from 'vscode';
import { ActionButton } from './actionButton';
import { ApiRepository } from './api/api1';
import { Branch, BranchQuery, Change, CommitOptions, FetchOptions, ForcePushMode, GitErrorCodes, LogOptions, Ref, RefType, Remote, Status, Worktree } from './api/git';
import { AutoFetcher } from './autofetch';
import { GitBranchProtectionProvider, IBranchProtectionProviderRegistry } from './branchProtection';
import { debounce, memoize, sequentialize, throttle } from './decorators';
import { Repository as BaseRepository, BlameInformation, Commit, CommitShortStat, GitError, LogFileOptions, LsTreeElement, PullOptions, RefQuery, Stash, Submodule } from './git';
import { GitHistoryProvider } from './historyProvider';
import { Operation, OperationKind, OperationManager, OperationResult } from './operation';
import { CommitCommandsCenter, IPostCommitCommandsProviderRegistry } from './postCommitCommands';
import { IPushErrorHandlerRegistry } from './pushError';
import { IRemoteSourcePublisherRegistry } from './remotePublisher';
import { StatusBarCommands } from './statusbar';
import { toGitUri } from './uri';
import { anyEvent, combinedDisposable, debounceEvent, dispose, EmptyDisposable, eventToPromise, filterEvent, find, getCommitShortHash, IDisposable, isDescendant, isLinuxSnap, isRemote, isWindows, Limiter, onceEvent, pathEquals, relativePath } from './util';
import { IFileWatcher, watch } from './watch';
import { ISourceControlHistoryItemDetailsProviderRegistry } from './historyItemDetailsProvider';
import { GitArtifactProvider } from './artifactProvider';
import { RepositoryCache } from './repositoryCache';

const timeout = (millis: number) => new Promise(c => setTimeout(c, millis));

const iconsRootPath = path.join(path.dirname(__dirname), 'resources', 'icons');

function getIconUri(iconName: string, theme: string): Uri {
	return Uri.file(path.join(iconsRootPath, theme, `${iconName}.svg`));
}

export const enum RepositoryState {
	Idle,
	Disposed
}

export const enum ResourceGroupType {
	Merge,
	Index,
	WorkingTree,
	Untracked
}

export class Resource implements SourceControlResourceState {

	static getStatusLetter(type: Status): string {
		switch (type) {
			case Status.INDEX_MODIFIED:
			case Status.MODIFIED:
				return 'M';
			case Status.INDEX_ADDED:
			case Status.INTENT_TO_ADD:
				return 'A';
			case Status.INDEX_DELETED:
			case Status.DELETED:
				return 'D';
			case Status.INDEX_RENAMED:
			case Status.INTENT_TO_RENAME:
				return 'R';
			case Status.TYPE_CHANGED:
				return 'T';
			case Status.UNTRACKED:
				return 'U';
			case Status.IGNORED:
				return 'I';
			case Status.INDEX_COPIED:
				return 'C';
			case Status.BOTH_DELETED:
			case Status.ADDED_BY_US:
			case Status.DELETED_BY_THEM:
			case Status.ADDED_BY_THEM:
			case Status.DELETED_BY_US:
			case Status.BOTH_ADDED:
			case Status.BOTH_MODIFIED:
				return '!'; // Using ! instead of ⚠, because the latter looks really bad on windows
			default:
				throw new Error('Unknown git status: ' + type);
		}
	}

	static getStatusText(type: Status) {
		switch (type) {
			case Status.INDEX_MODIFIED: return l10n.t('Index Modified');
			case Status.MODIFIED: return l10n.t('Modified');
			case Status.INDEX_ADDED: return l10n.t('Index Added');
			case Status.INDEX_DELETED: return l10n.t('Index Deleted');
			case Status.DELETED: return l10n.t('Deleted');
			case Status.INDEX_RENAMED: return l10n.t('Index Renamed');
			case Status.INDEX_COPIED: return l10n.t('Index Copied');
			case Status.UNTRACKED: return l10n.t('Untracked');
			case Status.IGNORED: return l10n.t('Ignored');
			case Status.INTENT_TO_ADD: return l10n.t('Intent to Add');
			case Status.INTENT_TO_RENAME: return l10n.t('Intent to Rename');
			case Status.TYPE_CHANGED: return l10n.t('Type Changed');
			case Status.BOTH_DELETED: return l10n.t('Conflict: Both Deleted');
			case Status.ADDED_BY_US: return l10n.t('Conflict: Added By Us');
			case Status.DELETED_BY_THEM: return l10n.t('Conflict: Deleted By Them');
			case Status.ADDED_BY_THEM: return l10n.t('Conflict: Added By Them');
			case Status.DELETED_BY_US: return l10n.t('Conflict: Deleted By Us');
			case Status.BOTH_ADDED: return l10n.t('Conflict: Both Added');
			case Status.BOTH_MODIFIED: return l10n.t('Conflict: Both Modified');
			default: return '';
		}
	}

	static getStatusColor(type: Status): ThemeColor {
		switch (type) {
			case Status.INDEX_MODIFIED:
				return new ThemeColor('gitDecoration.stageModifiedResourceForeground');
			case Status.MODIFIED:
			case Status.TYPE_CHANGED:
				return new ThemeColor('gitDecoration.modifiedResourceForeground');
			case Status.INDEX_DELETED:
				return new ThemeColor('gitDecoration.stageDeletedResourceForeground');
			case Status.DELETED:
				return new ThemeColor('gitDecoration.deletedResourceForeground');
			case Status.INDEX_ADDED:
			case Status.INTENT_TO_ADD:
				return new ThemeColor('gitDecoration.addedResourceForeground');
			case Status.INDEX_COPIED:
			case Status.INDEX_RENAMED:
			case Status.INTENT_TO_RENAME:
				return new ThemeColor('gitDecoration.renamedResourceForeground');
			case Status.UNTRACKED:
				return new ThemeColor('gitDecoration.untrackedResourceForeground');
			case Status.IGNORED:
				return new ThemeColor('gitDecoration.ignoredResourceForeground');
			case Status.BOTH_DELETED:
			case Status.ADDED_BY_US:
			case Status.DELETED_BY_THEM:
			case Status.ADDED_BY_THEM:
			case Status.DELETED_BY_US:
			case Status.BOTH_ADDED:
			case Status.BOTH_MODIFIED:
				return new ThemeColor('gitDecoration.conflictingResourceForeground');
			default:
				throw new Error('Unknown git status: ' + type);
		}
	}

	@memoize
	get resourceUri(): Uri {
		if (this.renameResourceUri && (this._type === Status.MODIFIED || this._type === Status.DELETED || this._type === Status.INDEX_RENAMED || this._type === Status.INDEX_COPIED || this._type === Status.INTENT_TO_RENAME)) {
			return this.renameResourceUri;
		}

		return this._resourceUri;
	}

	get leftUri(): Uri | undefined {
		return this.resources.left;
	}

	get rightUri(): Uri | undefined {
		return this.resources.right;
	}

	get multiDiffEditorOriginalUri(): Uri | undefined {
		return this.resources.original;
	}

	get multiFileDiffEditorModifiedUri(): Uri | undefined {
		return this.resources.modified;
	}

	@memoize
	get command(): Command {
		return this._commandResolver.resolveDefaultCommand(this);
	}

	@memoize
	private get resources(): { left: Uri | undefined; right: Uri | undefined; original: Uri | undefined; modified: Uri | undefined } {
		return this._commandResolver.getResources(this);
	}

	get resourceGroupType(): ResourceGroupType { return this._resourceGroupType; }
	get type(): Status { return this._type; }
	get original(): Uri { return this._resourceUri; }
	get renameResourceUri(): Uri | undefined { return this._renameResourceUri; }
	get contextValue(): string | undefined { return this._repositoryKind; }

	private static Icons = {
		light: {
			Modified: getIconUri('status-modified', 'light'),
			Added: getIconUri('status-added', 'light'),
			Deleted: getIconUri('status-deleted', 'light'),
			Renamed: getIconUri('status-renamed', 'light'),
			Copied: getIconUri('status-copied', 'light'),
			Untracked: getIconUri('status-untracked', 'light'),
			Ignored: getIconUri('status-ignored', 'light'),
			Conflict: getIconUri('status-conflict', 'light'),
			TypeChanged: getIconUri('status-type-changed', 'light')
		},
		dark: {
			Modified: getIconUri('status-modified', 'dark'),
			Added: getIconUri('status-added', 'dark'),
			Deleted: getIconUri('status-deleted', 'dark'),
			Renamed: getIconUri('status-renamed', 'dark'),
			Copied: getIconUri('status-copied', 'dark'),
			Untracked: getIconUri('status-untracked', 'dark'),
			Ignored: getIconUri('status-ignored', 'dark'),
			Conflict: getIconUri('status-conflict', 'dark'),
			TypeChanged: getIconUri('status-type-changed', 'dark')
		}
	};

	private getIconPath(theme: 'light' | 'dark'): Uri {
		switch (this.type) {
			case Status.INDEX_MODIFIED: return Resource.Icons[theme].Modified;
			case Status.MODIFIED: return Resource.Icons[theme].Modified;
			case Status.INDEX_ADDED: return Resource.Icons[theme].Added;
			case Status.INDEX_DELETED: return Resource.Icons[theme].Deleted;
			case Status.DELETED: return Resource.Icons[theme].Deleted;
			case Status.INDEX_RENAMED: return Resource.Icons[theme].Renamed;
			case Status.INDEX_COPIED: return Resource.Icons[theme].Copied;
			case Status.UNTRACKED: return Resource.Icons[theme].Untracked;
			case Status.IGNORED: return Resource.Icons[theme].Ignored;
			case Status.INTENT_TO_ADD: return Resource.Icons[theme].Added;
			case Status.INTENT_TO_RENAME: return Resource.Icons[theme].Renamed;
			case Status.TYPE_CHANGED: return Resource.Icons[theme].TypeChanged;
			case Status.BOTH_DELETED: return Resource.Icons[theme].Conflict;
			case Status.ADDED_BY_US: return Resource.Icons[theme].Conflict;
			case Status.DELETED_BY_THEM: return Resource.Icons[theme].Conflict;
			case Status.ADDED_BY_THEM: return Resource.Icons[theme].Conflict;
			case Status.DELETED_BY_US: return Resource.Icons[theme].Conflict;
			case Status.BOTH_ADDED: return Resource.Icons[theme].Conflict;
			case Status.BOTH_MODIFIED: return Resource.Icons[theme].Conflict;
			default: throw new Error('Unknown git status: ' + this.type);
		}
	}

	private get tooltip(): string {
		return Resource.getStatusText(this.type);
	}

	private get strikeThrough(): boolean {
		switch (this.type) {
			case Status.DELETED:
			case Status.BOTH_DELETED:
			case Status.DELETED_BY_THEM:
			case Status.DELETED_BY_US:
			case Status.INDEX_DELETED:
				return true;
			default:
				return false;
		}
	}

	@memoize
	private get faded(): boolean {
		// TODO@joao
		return false;
		// const workspaceRootPath = this.workspaceRoot.fsPath;
		// return this.resourceUri.fsPath.substr(0, workspaceRootPath.length) !== workspaceRootPath;
	}

	get decorations(): SourceControlResourceDecorations {
		const light = this._useIcons ? { iconPath: this.getIconPath('light') } : undefined;
		const dark = this._useIcons ? { iconPath: this.getIconPath('dark') } : undefined;
		const tooltip = this.tooltip;
		const strikeThrough = this.strikeThrough;
		const faded = this.faded;
		return { strikeThrough, faded, tooltip, light, dark };
	}

	get letter(): string {
		return Resource.getStatusLetter(this.type);
	}

	get color(): ThemeColor {
		return Resource.getStatusColor(this.type);
	}

	get priority(): number {
		switch (this.type) {
			case Status.INDEX_MODIFIED:
			case Status.MODIFIED:
			case Status.INDEX_COPIED:
			case Status.TYPE_CHANGED:
				return 2;
			case Status.IGNORED:
				return 3;
			case Status.BOTH_DELETED:
			case Status.ADDED_BY_US:
			case Status.DELETED_BY_THEM:
			case Status.ADDED_BY_THEM:
			case Status.DELETED_BY_US:
			case Status.BOTH_ADDED:
			case Status.BOTH_MODIFIED:
				return 4;
			default:
				return 1;
		}
	}

	get resourceDecoration(): FileDecoration {
		const res = new FileDecoration(this.letter, this.tooltip, this.color);
		res.propagate = this.type !== Status.DELETED && this.type !== Status.INDEX_DELETED;
		return res;
	}

	constructor(
		private _commandResolver: ResourceCommandResolver,
		private _resourceGroupType: ResourceGroupType,
		private _resourceUri: Uri,
		private _type: Status,
		private _useIcons: boolean,
		private _renameResourceUri?: Uri,
		private _repositoryKind?: 'repository' | 'submodule' | 'worktree',
	) { }

	async open(): Promise<void> {
		const command = this.command;
		await commands.executeCommand<void>(command.command, ...(command.arguments || []));
	}

	async openFile(): Promise<void> {
		const command = this._commandResolver.resolveFileCommand(this);
		await commands.executeCommand<void>(command.command, ...(command.arguments || []));
	}

	async openChange(): Promise<void> {
		const command = this._commandResolver.resolveChangeCommand(this);
		await commands.executeCommand<void>(command.command, ...(command.arguments || []));
	}

	async compareWithWorkspace(): Promise<void> {
		const command = this._commandResolver.resolveCompareWithWorkspaceCommand(this);
		await commands.executeCommand<void>(command.command, ...(command.arguments || []));
	}

	clone(resourceGroupType?: ResourceGroupType) {
		return new Resource(this._commandResolver, resourceGroupType ?? this._resourceGroupType, this._resourceUri, this._type, this._useIcons, this._renameResourceUri, this._repositoryKind);
	}
}

export interface GitResourceGroup extends SourceControlResourceGroup {
	resourceStates: Resource[];
}

interface GitResourceGroups {
	indexGroup?: Resource[];
	mergeGroup?: Resource[];
	untrackedGroup?: Resource[];
	workingTreeGroup?: Resource[];
}

class ProgressManager {

	private enabled = false;
	private disposable: IDisposable = EmptyDisposable;

	constructor(private repository: Repository) {
		const onDidChange = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git', Uri.file(this.repository.root)));
		onDidChange(_ => this.updateEnablement());
		this.updateEnablement();

		this.repository.onDidChangeOperations(() => {
			// Disable input box when the commit operation is running
			this.repository.sourceControl.inputBox.enabled = !this.repository.operations.isRunning(OperationKind.Commit);
		});
	}

	private updateEnablement(): void {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));

		if (config.get<boolean>('showProgress')) {
			this.enable();
		} else {
			this.disable();
		}
	}

	private enable(): void {
		if (this.enabled) {
			return;
		}

		const start = onceEvent(filterEvent(this.repository.onDidChangeOperations, () => this.repository.operations.shouldShowProgress()));
		const end = onceEvent(filterEvent(debounceEvent(this.repository.onDidChangeOperations, 300), () => !this.repository.operations.shouldShowProgress()));

		const setup = () => {
			this.disposable = start(() => {
				const promise = eventToPromise(end).then(() => setup());
				window.withProgress({ location: ProgressLocation.SourceControl }, () => promise);
			});
		};

		setup();
		this.enabled = true;
	}

	private disable(): void {
		if (!this.enabled) {
			return;
		}

		this.disposable.dispose();
		this.disposable = EmptyDisposable;
		this.enabled = false;
	}

	dispose(): void {
		this.disable();
	}
}

class FileEventLogger {

	private eventDisposable: IDisposable = EmptyDisposable;
	private logLevelDisposable: IDisposable = EmptyDisposable;

	constructor(
		private onWorkspaceWorkingTreeFileChange: Event<Uri>,
		private onDotGitFileChange: Event<Uri>,
		private logger: LogOutputChannel
	) {
		this.logLevelDisposable = logger.onDidChangeLogLevel(this.onDidChangeLogLevel, this);
		this.onDidChangeLogLevel(logger.logLevel);
	}

	private onDidChangeLogLevel(logLevel: LogLevel): void {
		this.eventDisposable.dispose();

		if (logLevel > LogLevel.Debug) {
			return;
		}

		this.eventDisposable = combinedDisposable([
			this.onWorkspaceWorkingTreeFileChange(uri => this.logger.debug(`[FileEventLogger][onWorkspaceWorkingTreeFileChange] ${uri.fsPath}`)),
			this.onDotGitFileChange(uri => this.logger.debug(`[FileEventLogger][onDotGitFileChange] ${uri.fsPath}`))
		]);
	}

	dispose(): void {
		this.eventDisposable.dispose();
		this.logLevelDisposable.dispose();
	}
}

class DotGitWatcher implements IFileWatcher {

	readonly event: Event<Uri>;

	private emitter = new EventEmitter<Uri>();
	private transientDisposables: IDisposable[] = [];
	private disposables: IDisposable[] = [];

	constructor(
		private repository: Repository,
		private logger: LogOutputChannel
	) {
		const rootWatcher = watch(repository.dotGit.path);
		this.disposables.push(rootWatcher);

		// Ignore changes to the "index.lock" file, and watchman fsmonitor hook (https://git-scm.com/docs/githooks#_fsmonitor_watchman) cookie files.
		// Watchman creates a cookie file inside the git directory whenever a query is run (https://facebook.github.io/watchman/docs/cookies.html).
		const filteredRootWatcher = filterEvent(rootWatcher.event, uri => uri.scheme === 'file' && !/\/\.git(\/index\.lock)?$|\/\.watchman-cookie-/.test(uri.path));
		this.event = anyEvent(filteredRootWatcher, this.emitter.event);

		repository.onDidRunGitStatus(this.updateTransientWatchers, this, this.disposables);
		this.updateTransientWatchers();
	}

	private updateTransientWatchers() {
		this.transientDisposables = dispose(this.transientDisposables);

		if (!this.repository.HEAD || !this.repository.HEAD.upstream) {
			return;
		}

		this.transientDisposables = dispose(this.transientDisposables);

		const { name, remote } = this.repository.HEAD.upstream;
		const upstreamPath = path.join(this.repository.dotGit.commonPath ?? this.repository.dotGit.path, 'refs', 'remotes', remote, name);

		try {
			const upstreamWatcher = watch(upstreamPath);
			this.transientDisposables.push(upstreamWatcher);
			upstreamWatcher.event(this.emitter.fire, this.emitter, this.transientDisposables);
		} catch (err) {
			this.logger.warn(`[DotGitWatcher][updateTransientWatchers] Failed to watch ref '${upstreamPath}', is most likely packed.`);
		}
	}

	dispose() {
		this.emitter.dispose();
		this.transientDisposables = dispose(this.transientDisposables);
		this.disposables = dispose(this.disposables);
	}
}

class ResourceCommandResolver {

	constructor(private repository: Repository) { }

	resolveDefaultCommand(resource: Resource): Command {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const openDiffOnClick = config.get<boolean>('openDiffOnClick', true);
		return openDiffOnClick ? this.resolveChangeCommand(resource) : this.resolveFileCommand(resource);
	}

	resolveFileCommand(resource: Resource): Command {
		return {
			command: 'vscode.open',
			title: l10n.t('Open'),
			arguments: [resource.resourceUri]
		};
	}

	resolveChangeCommand(resource: Resource, compareWithWorkspace?: boolean, leftUri?: Uri): Command {
		if (!compareWithWorkspace) {
			leftUri = resource.leftUri;
		}

		const title = this.getTitle(resource);

		if (!leftUri) {
			const bothModified = resource.type === Status.BOTH_MODIFIED;
			if (resource.rightUri && workspace.getConfiguration('git').get<boolean>('mergeEditor', false) && (bothModified || resource.type === Status.BOTH_ADDED)) {
				const command = this.repository.isWorktreeMigrating ? 'git.openWorktreeMergeEditor' : 'git.openMergeEditor';
				return {
					command,
					title: l10n.t('Open Merge'),
					arguments: [resource.rightUri]
				};
			} else {
				return {
					command: 'vscode.open',
					title: l10n.t('Open'),
					arguments: [resource.rightUri, { override: bothModified ? false : undefined }, title]
				};
			}
		} else {
			return {
				command: 'vscode.diff',
				title: l10n.t('Open'),
				arguments: [leftUri, resource.rightUri, title]
			};
		}
	}

	resolveCompareWithWorkspaceCommand(resource: Resource): Command {
		// Resource is not a worktree
		if (!this.repository.dotGit.commonPath) {
			return this.resolveChangeCommand(resource);
		}

		const parentRepoRoot = path.dirname(this.repository.dotGit.commonPath);
		const relPath = path.relative(this.repository.root, resource.resourceUri.fsPath);
		const candidateFsPath = path.join(parentRepoRoot, relPath);

		const leftUri = fs.existsSync(candidateFsPath) ? Uri.file(candidateFsPath) : undefined;

		return this.resolveChangeCommand(resource, true, leftUri);
	}

	getResources(resource: Resource): { left: Uri | undefined; right: Uri | undefined; original: Uri | undefined; modified: Uri | undefined } {
		for (const submodule of this.repository.submodules) {
			if (path.join(this.repository.root, submodule.path) === resource.resourceUri.fsPath) {
				const original = undefined;
				const modified = toGitUri(resource.resourceUri, resource.resourceGroupType === ResourceGroupType.Index ? 'index' : 'wt', { submoduleOf: this.repository.root });
				return { left: original, right: modified, original, modified };
			}
		}

		const left = this.getLeftResource(resource);
		const right = this.getRightResource(resource);

		return {
			left: left.original ?? left.modified,
			right: right.original ?? right.modified,
			original: left.original ?? right.original,
			modified: left.modified ?? right.modified,
		};
	}

	private getLeftResource(resource: Resource): ModifiedOrOriginal {
		switch (resource.type) {
			case Status.INDEX_MODIFIED:
			case Status.INDEX_RENAMED:
			case Status.INTENT_TO_RENAME:
			case Status.TYPE_CHANGED:
				return { original: toGitUri(resource.original, 'HEAD') };

			case Status.MODIFIED:
				return { original: toGitUri(resource.resourceUri, '~') };

			case Status.DELETED_BY_US:
			case Status.DELETED_BY_THEM:
				return { original: toGitUri(resource.resourceUri, '~1') };
		}
		return {};
	}

	private getRightResource(resource: Resource): ModifiedOrOriginal {
		switch (resource.type) {
			case Status.INDEX_MODIFIED:
			case Status.INDEX_ADDED:
			case Status.INDEX_COPIED:
			case Status.INDEX_RENAMED:
				return { modified: toGitUri(resource.resourceUri, '') };

			case Status.INDEX_DELETED:
			case Status.DELETED:
				return { original: toGitUri(resource.resourceUri, 'HEAD') };

			case Status.DELETED_BY_US:
				return { original: toGitUri(resource.resourceUri, '~3') };

			case Status.DELETED_BY_THEM:
				return { original: toGitUri(resource.resourceUri, '~2') };

			case Status.MODIFIED:
			case Status.UNTRACKED:
			case Status.IGNORED:
			case Status.INTENT_TO_ADD:
			case Status.INTENT_TO_RENAME:
			case Status.TYPE_CHANGED: {
				const uriString = resource.resourceUri.toString();
				const [indexStatus] = this.repository.indexGroup.resourceStates.filter(r => r.resourceUri.toString() === uriString);

				if (indexStatus && indexStatus.renameResourceUri) {
					return { modified: indexStatus.renameResourceUri };
				}

				return { modified: resource.resourceUri };
			}
			case Status.BOTH_ADDED:
			case Status.BOTH_MODIFIED:
				return { modified: resource.resourceUri };
		}

		return {};
	}

	private getTitle(resource: Resource): string {
		const basename = path.basename(resource.resourceUri.fsPath);

		switch (resource.type) {
			case Status.INDEX_MODIFIED:
			case Status.INDEX_RENAMED:
			case Status.INDEX_ADDED:
				return l10n.t('{0} (Index)', basename);

			case Status.MODIFIED:
			case Status.BOTH_ADDED:
			case Status.BOTH_MODIFIED:
				return l10n.t('{0} (Working Tree)', basename);

			case Status.INDEX_DELETED:
			case Status.DELETED:
				return l10n.t('{0} (Deleted)', basename);

			case Status.DELETED_BY_US:
				return l10n.t('{0} (Theirs)', basename);

			case Status.DELETED_BY_THEM:
				return l10n.t('{0} (Ours)', basename);

			case Status.UNTRACKED:
				return l10n.t('{0} (Untracked)', basename);

			case Status.INTENT_TO_ADD:
			case Status.INTENT_TO_RENAME:
				return l10n.t('{0} (Intent to add)', basename);

			case Status.TYPE_CHANGED:
				return l10n.t('{0} (Type changed)', basename);

			default:
				return '';
		}
	}
}

interface ModifiedOrOriginal {
	modified?: Uri | undefined;
	original?: Uri | undefined;
}

interface BranchProtectionMatcher {
	include?: picomatch.Matcher;
	exclude?: picomatch.Matcher;
}

export interface IRepositoryResolver {
	getRepository(hint: SourceControl | SourceControlResourceGroup | Uri | string): Repository | undefined;
}

export class Repository implements Disposable {
	static readonly WORKTREE_ROOT_STORAGE_KEY = 'worktreeRoot';

	private _onDidChangeRepository = new EventEmitter<Uri>();
	readonly onDidChangeRepository: Event<Uri> = this._onDidChangeRepository.event;

	private _onDidChangeState = new EventEmitter<RepositoryState>();
	readonly onDidChangeState: Event<RepositoryState> = this._onDidChangeState.event;

	private _onDidChangeStatus = new EventEmitter<void>();
	readonly onDidRunGitStatus: Event<void> = this._onDidChangeStatus.event;

	private _onDidChangeOriginalResource = new EventEmitter<Uri>();
	readonly onDidChangeOriginalResource: Event<Uri> = this._onDidChangeOriginalResource.event;

	private _onRunOperation = new EventEmitter<OperationKind>();
	readonly onRunOperation: Event<OperationKind> = this._onRunOperation.event;

	private _onDidRunOperation = new EventEmitter<OperationResult>();
	readonly onDidRunOperation: Event<OperationResult> = this._onDidRunOperation.event;

	private _onDidChangeBranchProtection = new EventEmitter<void>();
	readonly onDidChangeBranchProtection: Event<void> = this._onDidChangeBranchProtection.event;

	@memoize
	get onDidChangeOperations(): Event<void> {
		return anyEvent(
			this.onRunOperation as Event<unknown>,
			this.onDidRunOperation as Event<unknown>) as Event<void>;
	}

	private _sourceControl: SourceControl;
	get sourceControl(): SourceControl { return this._sourceControl; }

	get inputBox(): SourceControlInputBox { return this._sourceControl.inputBox; }

	private _mergeGroup: SourceControlResourceGroup;
	get mergeGroup(): GitResourceGroup { return this._mergeGroup as GitResourceGroup; }

	private _indexGroup: SourceControlResourceGroup;
	get indexGroup(): GitResourceGroup { return this._indexGroup as GitResourceGroup; }

	private _workingTreeGroup: SourceControlResourceGroup;
	get workingTreeGroup(): GitResourceGroup { return this._workingTreeGroup as GitResourceGroup; }

	private _untrackedGroup: SourceControlResourceGroup;
	get untrackedGroup(): GitResourceGroup { return this._untrackedGroup as GitResourceGroup; }

	private _EMPTY_TREE: string | undefined;

	private _HEAD: Branch | undefined;
	get HEAD(): Branch | undefined {
		return this._HEAD;
	}

	private _refs: Ref[] = [];
	get refs(): Ref[] {
		return this._refs;
	}

	get headShortName(): string | undefined {
		if (!this.HEAD) {
			return;
		}

		const HEAD = this.HEAD;

		if (HEAD.name) {
			return HEAD.name;
		}

		return (HEAD.commit || '').substr(0, 8);
	}

	private _remotes: Remote[] = [];
	get remotes(): Remote[] {
		return this._remotes;
	}

	private _submodules: Submodule[] = [];
	get submodules(): Submodule[] {
		return this._submodules;
	}

	private _worktrees: Worktree[] = [];
	get worktrees(): Worktree[] {
		return this._worktrees;
	}

	private _rebaseCommit: Commit | undefined = undefined;

	set rebaseCommit(rebaseCommit: Commit | undefined) {
		if (this._rebaseCommit && !rebaseCommit) {
			this.inputBox.value = '';
		} else if (rebaseCommit && (!this._rebaseCommit || this._rebaseCommit.hash !== rebaseCommit.hash)) {
			this.inputBox.value = rebaseCommit.message;
		}

		const shouldUpdateContext = !!this._rebaseCommit !== !!rebaseCommit;
		this._rebaseCommit = rebaseCommit;

		if (shouldUpdateContext) {
			commands.executeCommand('setContext', 'gitRebaseInProgress', !!this._rebaseCommit);
		}
	}

	get rebaseCommit(): Commit | undefined {
		return this._rebaseCommit;
	}

	private _mergeInProgress: boolean = false;

	set mergeInProgress(value: boolean) {
		if (this._mergeInProgress === value) {
			return;
		}

		this._mergeInProgress = value;
		commands.executeCommand('setContext', 'gitMergeInProgress', value);
	}

	get mergeInProgress() {
		return this._mergeInProgress;
	}

	private _cherryPickInProgress: boolean = false;

	set cherryPickInProgress(value: boolean) {
		if (this._cherryPickInProgress === value) {
			return;
		}

		this._cherryPickInProgress = value;
		commands.executeCommand('setContext', 'gitCherryPickInProgress', value);
	}

	get cherryPickInProgress() {
		return this._cherryPickInProgress;
	}

	private _isWorktreeMigrating: boolean = false;
	get isWorktreeMigrating(): boolean { return this._isWorktreeMigrating; }
	set isWorktreeMigrating(value: boolean) { this._isWorktreeMigrating = value; }

	private readonly _operations: OperationManager;
	get operations(): OperationManager { return this._operations; }

	private _state = RepositoryState.Idle;
	get state(): RepositoryState { return this._state; }
	set state(state: RepositoryState) {
		this._state = state;
		this._onDidChangeState.fire(state);

		this._HEAD = undefined;
		this._remotes = [];
		this.mergeGroup.resourceStates = [];
		this.indexGroup.resourceStates = [];
		this.workingTreeGroup.resourceStates = [];
		this.untrackedGroup.resourceStates = [];
		this._sourceControl.count = 0;
	}

	get root(): string {
		return this.repository.root;
	}

	get rootRealPath(): string | undefined {
		return this.repository.rootRealPath;
	}

	get dotGit(): { path: string; commonPath?: string } {
		return this.repository.dotGit;
	}

	get kind(): 'repository' | 'submodule' | 'worktree' {
		return this.repository.kind;
	}

	private _artifactProvider: GitArtifactProvider;
	get artifactProvider(): GitArtifactProvider { return this._artifactProvider; }

	private _historyProvider: GitHistoryProvider;
	get historyProvider(): GitHistoryProvider { return this._historyProvider; }

	private isRepositoryHuge: false | { limit: number } = false;
	private didWarnAboutLimit = false;

	private unpublishedCommits: Set<string> | undefined = undefined;
	private branchProtection = new Map<string, BranchProtectionMatcher[]>();
	private commitCommandCenter: CommitCommandsCenter;
	private resourceCommandResolver = new ResourceCommandResolver(this);
	private updateModelStateCancellationTokenSource: CancellationTokenSource | undefined;
	private disposables: Disposable[] = [];

	constructor(
		private readonly repository: BaseRepository,
		private readonly repositoryResolver: IRepositoryResolver,
		private pushErrorHandlerRegistry: IPushErrorHandlerRegistry,
		remoteSourcePublisherRegistry: IRemoteSourcePublisherRegistry,
		postCommitCommandsProviderRegistry: IPostCommitCommandsProviderRegistry,
		private readonly branchProtectionProviderRegistry: IBranchProtectionProviderRegistry,
		historyItemDetailProviderRegistry: ISourceControlHistoryItemDetailsProviderRegistry,
		private readonly globalState: Memento,
		private readonly logger: LogOutputChannel,
		private telemetryReporter: TelemetryReporter,
		private readonly repositoryCache: RepositoryCache
	) {
		this._operations = new OperationManager(this.logger);

		const repositoryWatcher = workspace.createFileSystemWatcher(new RelativePattern(Uri.file(repository.root), '**'));
		this.disposables.push(repositoryWatcher);

		const onRepositoryFileChange = anyEvent(repositoryWatcher.onDidChange, repositoryWatcher.onDidCreate, repositoryWatcher.onDidDelete);
		const onRepositoryWorkingTreeFileChange = filterEvent(onRepositoryFileChange, uri => !/\.git($|\\|\/)/.test(relativePath(repository.root, uri.fsPath)));

		let onRepositoryDotGitFileChange: Event<Uri>;

		try {
			const dotGitFileWatcher = new DotGitWatcher(this, logger);
			onRepositoryDotGitFileChange = dotGitFileWatcher.event;
			this.disposables.push(dotGitFileWatcher);
		} catch (err) {
			logger.error(`Failed to watch path:'${this.dotGit.path}' or commonPath:'${this.dotGit.commonPath}', reverting to legacy API file watched. Some events might be lost.\n${err.stack || err}`);

			onRepositoryDotGitFileChange = filterEvent(onRepositoryFileChange, uri => /\.git($|\\|\/)/.test(uri.path));
		}

		// FS changes should trigger `git status`:
		// 	- any change inside the repository working tree
		//	- any change whithin the first level of the `.git` folder, except the folder itself and `index.lock`
		const onFileChange = anyEvent(onRepositoryWorkingTreeFileChange, onRepositoryDotGitFileChange);
		onFileChange(this.onFileChange, this, this.disposables);

		// Relevate repository changes should trigger virtual document change events
		onRepositoryDotGitFileChange(this._onDidChangeRepository.fire, this._onDidChangeRepository, this.disposables);

		this.disposables.push(new FileEventLogger(onRepositoryWorkingTreeFileChange, onRepositoryDotGitFileChange, logger));

		// Parent source control
		const parentRoot = repository.kind === 'submodule'
			? repository.dotGit.superProjectPath
			: repository.kind === 'worktree' && repository.dotGit.commonPath
				? path.dirname(repository.dotGit.commonPath)
				: undefined;
		const parent = parentRoot
			? this.repositoryResolver.getRepository(parentRoot)?.sourceControl
			: undefined;

		// Icon
		const icon = repository.kind === 'submodule'
			? new ThemeIcon('archive')
			: repository.kind === 'worktree'
				? new ThemeIcon('list-tree')
				: new ThemeIcon('repo');

		const root = Uri.file(repository.root);
		this._sourceControl = scm.createSourceControl('git', 'Git', root, icon, parent);
		this._sourceControl.contextValue = repository.kind;

		this._sourceControl.quickDiffProvider = this;
		this._sourceControl.secondaryQuickDiffProvider = new StagedResourceQuickDiffProvider(this, logger);

		this._historyProvider = new GitHistoryProvider(historyItemDetailProviderRegistry, this, logger);
		this._sourceControl.historyProvider = this._historyProvider;
		this.disposables.push(this._historyProvider);

		this._artifactProvider = new GitArtifactProvider(this, logger);
		this._sourceControl.artifactProvider = this._artifactProvider;
		this.disposables.push(this._artifactProvider);

		this._sourceControl.acceptInputCommand = { command: 'git.commit', title: l10n.t('Commit'), arguments: [this._sourceControl] };
		this._sourceControl.inputBox.validateInput = this.validateInput.bind(this);

		this.disposables.push(this._sourceControl);

		this.updateInputBoxPlaceholder();
		this.disposables.push(this.onDidRunGitStatus(() => this.updateInputBoxPlaceholder()));

		this._mergeGroup = this._sourceControl.createResourceGroup('merge', l10n.t('Merge Changes'));
		this._indexGroup = this._sourceControl.createResourceGroup('index', l10n.t('Staged Changes'), { multiDiffEditorEnableViewChanges: true });
		this._workingTreeGroup = this._sourceControl.createResourceGroup('workingTree', l10n.t('Changes'), { multiDiffEditorEnableViewChanges: true });
		this._untrackedGroup = this._sourceControl.createResourceGroup('untracked', l10n.t('Untracked Changes'), { multiDiffEditorEnableViewChanges: true });

		const updateIndexGroupVisibility = () => {
			const config = workspace.getConfiguration('git', root);
			this.indexGroup.hideWhenEmpty = !config.get<boolean>('alwaysShowStagedChangesResourceGroup');
		};

		const onConfigListener = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.alwaysShowStagedChangesResourceGroup', root));
		onConfigListener(updateIndexGroupVisibility, this, this.disposables);
		updateIndexGroupVisibility();

		workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('git.mergeEditor')) {
				this.mergeGroup.resourceStates = this.mergeGroup.resourceStates.map(r => r.clone());
			}
		}, undefined, this.disposables);

		filterEvent(workspace.onDidChangeConfiguration, e =>
			e.affectsConfiguration('git.branchSortOrder', root)
			|| e.affectsConfiguration('git.untrackedChanges', root)
			|| e.affectsConfiguration('git.ignoreSubmodules', root)
			|| e.affectsConfiguration('git.openDiffOnClick', root)
			|| e.affectsConfiguration('git.showActionButton', root)
			|| e.affectsConfiguration('git.similarityThreshold', root)
		)(() => this.updateModelState(), this, this.disposables);

		const updateInputBoxVisibility = () => {
			const config = workspace.getConfiguration('git', root);
			this._sourceControl.inputBox.visible = config.get<boolean>('showCommitInput', true);
		};

		const onConfigListenerForInputBoxVisibility = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.showCommitInput', root));
		onConfigListenerForInputBoxVisibility(updateInputBoxVisibility, this, this.disposables);
		updateInputBoxVisibility();

		this.mergeGroup.hideWhenEmpty = true;
		this.untrackedGroup.hideWhenEmpty = true;

		this.disposables.push(this.mergeGroup);
		this.disposables.push(this.indexGroup);
		this.disposables.push(this.workingTreeGroup);
		this.disposables.push(this.untrackedGroup);

		// Don't allow auto-fetch in untrusted workspaces
		if (workspace.isTrusted) {
			this.disposables.push(new AutoFetcher(this, globalState));
		} else {
			const trustDisposable = workspace.onDidGrantWorkspaceTrust(() => {
				trustDisposable.dispose();
				this.disposables.push(new AutoFetcher(this, globalState));
			});
			this.disposables.push(trustDisposable);
		}

		// https://github.com/microsoft/vscode/issues/39039
		const onSuccessfulPush = filterEvent(this.onDidRunOperation, e => e.operation.kind === OperationKind.Push && !e.error);
		onSuccessfulPush(() => {
			const gitConfig = workspace.getConfiguration('git');

			if (gitConfig.get<boolean>('showPushSuccessNotification')) {
				window.showInformationMessage(l10n.t('Successfully pushed.'));
			}
		}, null, this.disposables);

		// Default branch protection provider
		const onBranchProtectionProviderChanged = filterEvent(this.branchProtectionProviderRegistry.onDidChangeBranchProtectionProviders, e => pathEquals(e.fsPath, root.fsPath));
		this.disposables.push(onBranchProtectionProviderChanged(root => this.updateBranchProtectionMatchers(root)));
		this.disposables.push(this.branchProtectionProviderRegistry.registerBranchProtectionProvider(root, new GitBranchProtectionProvider(root)));

		const statusBar = new StatusBarCommands(this, remoteSourcePublisherRegistry);
		this.disposables.push(statusBar);
		statusBar.onDidChange(() => this._sourceControl.statusBarCommands = statusBar.commands, null, this.disposables);
		this._sourceControl.statusBarCommands = statusBar.commands;

		this.commitCommandCenter = new CommitCommandsCenter(globalState, this, postCommitCommandsProviderRegistry);
		this.disposables.push(this.commitCommandCenter);

		const actionButton = new ActionButton(this, this.commitCommandCenter, this.logger);
		this.disposables.push(actionButton);
		actionButton.onDidChange(() => this._sourceControl.actionButton = actionButton.button, this, this.disposables);
		this._sourceControl.actionButton = actionButton.button;

		const progressManager = new ProgressManager(this);
		this.disposables.push(progressManager);

		const onDidChangeCountBadge = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.countBadge', root));
		onDidChangeCountBadge(this.setCountBadge, this, this.disposables);
		this.setCountBadge();
	}

	validateInput(text: string, _: number): SourceControlInputBoxValidation | undefined {
		if (this.isRepositoryHuge) {
			return {
				message: l10n.t('Too many changes were detected. Only the first {0} changes will be shown below.', this.isRepositoryHuge.limit),
				type: SourceControlInputBoxValidationType.Warning
			};
		}

		if (this.rebaseCommit) {
			if (this.rebaseCommit.message !== text) {
				return {
					message: l10n.t('It\'s not possible to change the commit message in the middle of a rebase. Please complete the rebase operation and use interactive rebase instead.'),
					type: SourceControlInputBoxValidationType.Warning
				};
			}
		}

		return undefined;
	}

	/**
	 * Quick diff label
	 */
	get label(): string {
		return l10n.t('Git Local Changes (Working Tree)');
	}

	async provideOriginalResource(uri: Uri): Promise<Uri | undefined> {
		this.logger.trace(`[Repository][provideOriginalResource] Resource: ${uri.toString()}`);

		if (uri.scheme !== 'file') {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is not a file: ${uri.scheme}`);
			return undefined;
		}

		// Ignore symbolic links
		const stat = await workspace.fs.stat(uri);
		if ((stat.type & FileType.SymbolicLink) !== 0) {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is a symbolic link: ${uri.toString()}`);
			return undefined;
		}

		// Ignore path that is not inside the current repository
		if (this.repositoryResolver.getRepository(uri) !== this) {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is not part of the repository: ${uri.toString()}`);
			return undefined;
		}

		// Ignore path that is inside a merge group
		if (this.mergeGroup.resourceStates.some(r => pathEquals(r.resourceUri.fsPath, uri.fsPath))) {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is part of a merge group: ${uri.toString()}`);
			return undefined;
		}

		// Ignore path that is untracked
		if (this.untrackedGroup.resourceStates.some(r => pathEquals(r.resourceUri.path, uri.path)) ||
			this.workingTreeGroup.resourceStates.some(r => pathEquals(r.resourceUri.path, uri.path) && r.type === Status.UNTRACKED)) {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is untracked: ${uri.toString()}`);
			return undefined;
		}

		// Ignore path that is git ignored
		const ignored = await this.checkIgnore([uri.fsPath]);
		if (ignored.size > 0) {
			this.logger.trace(`[Repository][provideOriginalResource] Resource is git ignored: ${uri.toString()}`);
			return undefined;
		}

		const originalResource = toGitUri(uri, '', { replaceFileExtension: true });
		this.logger.trace(`[Repository][provideOriginalResource] Original resource: ${originalResource.toString()}`);

		return originalResource;
	}

	async getInputTemplate(): Promise<string> {
		const commitMessage = (await Promise.all([this.repository.getMergeMessage(), this.repository.getSquashMessage()])).find(msg => !!msg);

		if (commitMessage) {
			return commitMessage;
		}

		return await this.repository.getCommitTemplate();
	}

	getConfigs(): Promise<{ key: string; value: string }[]> {
		return this.run(Operation.Config(true), () => this.repository.getConfigs('local'));
	}

	getConfig(key: string): Promise<string> {
		return this.run(Operation.Config(true), () => this.repository.config('get', 'local', key));
	}

	getGlobalConfig(key: string): Promise<string> {
		return this.run(Operation.Config(true), () => this.repository.config('get', 'global', key));
	}

	setConfig(key: string, value: string): Promise<string> {
		return this.run(Operation.Config(false), () => this.repository.config('add', 'local', key, value));
	}

	unsetConfig(key: string): Promise<string> {
		return this.run(Operation.Config(false), () => this.repository.config('unset', 'local', key));
	}

	log(options?: LogOptions & { silent?: boolean }, cancellationToken?: CancellationToken): Promise<Commit[]> {
		const showProgress = !options || options.silent !== true;
		return this.run(Operation.Log(showProgress), () => this.repository.log(options, cancellationToken));
	}

	logFile(uri: Uri, options?: LogFileOptions, cancellationToken?: CancellationToken): Promise<Commit[]> {
		// TODO: This probably needs per-uri granularity
		return this.run(Operation.LogFile, () => this.repository.logFile(uri, options, cancellationToken));
	}

	@throttle
	async status(): Promise<void> {
		await this.run(Operation.Status);
	}

	@throttle
	async refresh(): Promise<void> {
		await this.run(Operation.Refresh);
	}

	diff(cached?: boolean): Promise<string> {
		return this.run(Operation.Diff, () => this.repository.diff(cached));
	}

	diffWithHEAD(): Promise<Change[]>;
	diffWithHEAD(path: string): Promise<string>;
	diffWithHEAD(path?: string | undefined): Promise<string | Change[]>;
	diffWithHEAD(path?: string | undefined): Promise<string | Change[]> {
		return this.run(Operation.Diff, () => this.repository.diffWithHEAD(path));
	}

	diffWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.run(Operation.Diff, () => this.repository.diffWithHEADShortStats(path));
	}

	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffWith(ref: string, path?: string | undefined): Promise<string | Change[]>;
	diffWith(ref: string, path?: string): Promise<string | Change[]> {
		return this.run(Operation.Diff, () => this.repository.diffWith(ref, path));
	}

	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWithHEAD(path?: string | undefined): Promise<string | Change[]>;
	diffIndexWithHEAD(path?: string): Promise<string | Change[]> {
		return this.run(Operation.Diff, () => this.repository.diffIndexWithHEAD(path));
	}

	diffIndexWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.run(Operation.Diff, () => this.repository.diffIndexWithHEADShortStats(path));
	}

	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffIndexWith(ref: string, path?: string | undefined): Promise<string | Change[]>;
	diffIndexWith(ref: string, path?: string): Promise<string | Change[]> {
		return this.run(Operation.Diff, () => this.repository.diffIndexWith(ref, path));
	}

	diffBlobs(object1: string, object2: string): Promise<string> {
		return this.run(Operation.Diff, () => this.repository.diffBlobs(object1, object2));
	}

	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;
	diffBetween(ref1: string, ref2: string, path?: string | undefined): Promise<string | Change[]>;
	diffBetween(ref1: string, ref2: string, path?: string): Promise<string | Change[]> {
		return this.run(Operation.Diff, () => this.repository.diffBetween(ref1, ref2, path));
	}

	diffBetween2(ref1: string, ref2: string): Promise<Change[]> {
		if (ref1 === this._EMPTY_TREE) {
			// Use git diff-tree to get the
			// changes in the first commit
			return this.diffTrees(ref1, ref2);
		}

		const scopedConfig = workspace.getConfiguration('git', Uri.file(this.root));
		const similarityThreshold = scopedConfig.get<number>('similarityThreshold', 50);

		return this.run(Operation.Diff, () => this.repository.diffBetween2(ref1, ref2, { similarityThreshold }));
	}

	diffTrees(treeish1: string, treeish2?: string): Promise<Change[]> {
		const scopedConfig = workspace.getConfiguration('git', Uri.file(this.root));
		const similarityThreshold = scopedConfig.get<number>('similarityThreshold', 50);

		return this.run(Operation.Diff, () => this.repository.diffTrees(treeish1, treeish2, { similarityThreshold }));
	}

	getMergeBase(ref1: string, ref2: string, ...refs: string[]): Promise<string | undefined> {
		return this.run(Operation.MergeBase, () => this.repository.getMergeBase(ref1, ref2, ...refs));
	}

	async hashObject(data: string): Promise<string> {
		return this.run(Operation.HashObject, () => this.repository.hashObject(data));
	}

	async add(resources: Uri[], opts?: { update?: boolean }): Promise<void> {
		await this.run(
			Operation.Add(!this.optimisticUpdateEnabled()),
			async () => {
				await this.repository.add(resources.map(r => r.fsPath), opts);
				this.closeDiffEditors([], [...resources.map(r => r.fsPath)]);

				// Accept working set changes across all chat sessions
				commands.executeCommand('_chat.editSessions.accept', resources);
			},
			() => {
				const resourcePaths = resources.map(r => r.fsPath);
				const indexGroupResourcePaths = this.indexGroup.resourceStates.map(r => r.resourceUri.fsPath);

				// Collect added resources
				const addedResourceStates: Resource[] = [];
				for (const resource of [...this.mergeGroup.resourceStates, ...this.untrackedGroup.resourceStates, ...this.workingTreeGroup.resourceStates]) {
					if (resourcePaths.includes(resource.resourceUri.fsPath) && !indexGroupResourcePaths.includes(resource.resourceUri.fsPath)) {
						addedResourceStates.push(resource.clone(ResourceGroupType.Index));
					}
				}

				// Add new resource(s) to index group
				const indexGroup = [...this.indexGroup.resourceStates, ...addedResourceStates];

				// Remove resource(s) from merge group
				const mergeGroup = this.mergeGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				// Remove resource(s) from working group
				const workingTreeGroup = this.workingTreeGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				// Remove resource(s) from untracked group
				const untrackedGroup = this.untrackedGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				return { indexGroup, mergeGroup, workingTreeGroup, untrackedGroup };
			});
	}

	async rm(resources: Uri[]): Promise<void> {
		await this.run(Operation.Remove, () => this.repository.rm(resources.map(r => r.fsPath)));
	}

	async stage(resource: Uri, contents: string, encoding: string): Promise<void> {
		await this.run(Operation.Stage, async () => {
			const data = await workspace.encode(contents, { encoding });
			await this.repository.stage(resource.fsPath, data);

			this._onDidChangeOriginalResource.fire(resource);
			this.closeDiffEditors([], [...resource.fsPath]);
		});
	}

	async revert(resources: Uri[]): Promise<void> {
		await this.run(
			Operation.RevertFiles(!this.optimisticUpdateEnabled()),
			async () => {
				await this.repository.revert('HEAD', resources.map(r => r.fsPath));
				for (const resource of resources) {
					this._onDidChangeOriginalResource.fire(resource);
				}
				this.closeDiffEditors([...resources.length !== 0 ?
					resources.map(r => r.fsPath) :
					this.indexGroup.resourceStates.map(r => r.resourceUri.fsPath)], []);
			},
			() => {
				const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
				const untrackedChanges = config.get<'mixed' | 'separate' | 'hidden'>('untrackedChanges');
				const untrackedChangesResourceGroupType = untrackedChanges === 'mixed' ? ResourceGroupType.WorkingTree : ResourceGroupType.Untracked;

				const resourcePaths = resources.length === 0 ?
					this.indexGroup.resourceStates.map(r => r.resourceUri.fsPath) : resources.map(r => r.fsPath);

				// Collect removed resources
				const trackedResources: Resource[] = [];
				const untrackedResources: Resource[] = [];
				for (const resource of this.indexGroup.resourceStates) {
					if (resourcePaths.includes(resource.resourceUri.fsPath)) {
						if (resource.type === Status.INDEX_ADDED) {
							untrackedResources.push(resource.clone(untrackedChangesResourceGroupType));
						} else {
							trackedResources.push(resource.clone(ResourceGroupType.WorkingTree));
						}
					}
				}

				// Remove resource(s) from index group
				const indexGroup = this.indexGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				// Add resource(s) to working group
				const workingTreeGroup = untrackedChanges === 'mixed' ?
					[...this.workingTreeGroup.resourceStates, ...trackedResources, ...untrackedResources] :
					[...this.workingTreeGroup.resourceStates, ...trackedResources];

				// Add resource(s) to untracked group
				const untrackedGroup = untrackedChanges === 'separate' ?
					[...this.untrackedGroup.resourceStates, ...untrackedResources] : undefined;

				return { indexGroup, workingTreeGroup, untrackedGroup };
			});
	}

	async commit(message: string | undefined, opts: CommitOptions = Object.create(null)): Promise<void> {
		const indexResources = [...this.indexGroup.resourceStates.map(r => r.resourceUri.fsPath)];
		const workingGroupResources = opts.all && opts.all !== 'tracked' ?
			[...this.workingTreeGroup.resourceStates.map(r => r.resourceUri.fsPath)] : [];

		if (this.rebaseCommit) {
			await this.run(
				Operation.RebaseContinue,
				async () => {
					if (opts.all) {
						const addOpts = opts.all === 'tracked' ? { update: true } : {};
						await this.repository.add([], addOpts);
					}

					await this.repository.rebaseContinue();
					await this.commitOperationCleanup(message, indexResources, workingGroupResources);
				},
				() => this.commitOperationGetOptimisticResourceGroups(opts));
		} else {
			// Set post-commit command to render the correct action button
			this.commitCommandCenter.postCommitCommand = opts.postCommitCommand;

			await this.run(
				Operation.Commit,
				async () => {
					if (opts.all) {
						const addOpts = opts.all === 'tracked' ? { update: true } : {};
						await this.repository.add([], addOpts);
					}

					delete opts.all;

					if (opts.requireUserConfig === undefined || opts.requireUserConfig === null) {
						const config = workspace.getConfiguration('git', Uri.file(this.root));
						opts.requireUserConfig = config.get<boolean>('requireGitUserConfig');
					}

					await this.repository.commit(message, opts);
					await this.commitOperationCleanup(message, indexResources, workingGroupResources);
				},
				() => this.commitOperationGetOptimisticResourceGroups(opts));

			// Execute post-commit command
			await this.run(Operation.PostCommitCommand, async () => {
				await this.commitCommandCenter.executePostCommitCommand(opts.postCommitCommand);
			});
		}
	}

	private async commitOperationCleanup(message: string | undefined, indexResources: string[], workingGroupResources: string[]) {
		if (message) {
			this.inputBox.value = await this.getInputTemplate();
		}
		this.closeDiffEditors(indexResources, workingGroupResources);

		// Accept working set changes across all chat sessions
		const resources = indexResources.length !== 0
			? indexResources.map(r => Uri.file(r))
			: workingGroupResources.map(r => Uri.file(r));
		commands.executeCommand('_chat.editSessions.accept', resources);
	}

	private commitOperationGetOptimisticResourceGroups(opts: CommitOptions): GitResourceGroups {
		let untrackedGroup: Resource[] | undefined = undefined,
			workingTreeGroup: Resource[] | undefined = undefined;

		if (opts.all === 'tracked') {
			workingTreeGroup = this.workingTreeGroup.resourceStates
				.filter(r => r.type === Status.UNTRACKED);
		} else if (opts.all) {
			untrackedGroup = workingTreeGroup = [];
		}

		return { indexGroup: [], mergeGroup: [], untrackedGroup, workingTreeGroup };
	}

	async clean(resources: Uri[]): Promise<void> {
		const config = workspace.getConfiguration('git');
		const discardUntrackedChangesToTrash = config.get<boolean>('discardUntrackedChangesToTrash', true) && !isRemote && !isLinuxSnap;

		await this.run(
			Operation.Clean(!this.optimisticUpdateEnabled()),
			async () => {
				const toClean: string[] = [];
				const toCheckout: string[] = [];
				const submodulesToUpdate: string[] = [];
				const resourceStates = [...this.workingTreeGroup.resourceStates, ...this.untrackedGroup.resourceStates];

				resources.forEach(r => {
					const fsPath = r.fsPath;

					for (const submodule of this.submodules) {
						if (path.join(this.root, submodule.path) === fsPath) {
							submodulesToUpdate.push(fsPath);
							return;
						}
					}

					const raw = r.toString();
					const scmResource = find(resourceStates, sr => sr.resourceUri.toString() === raw);

					if (!scmResource) {
						return;
					}

					switch (scmResource.type) {
						case Status.UNTRACKED:
						case Status.IGNORED:
							toClean.push(fsPath);
							break;

						default:
							toCheckout.push(fsPath);
							break;
					}
				});

				if (toClean.length > 0) {
					if (discardUntrackedChangesToTrash) {
						try {
							// Attempt to move the first resource to the recycle bin/trash to check
							// if it is supported. If it fails, we show a confirmation dialog and
							// fall back to deletion.
							await workspace.fs.delete(Uri.file(toClean[0]), { useTrash: true });

							const limiter = new Limiter<void>(5);
							await Promise.all(toClean.slice(1).map(fsPath => limiter.queue(
								async () => await workspace.fs.delete(Uri.file(fsPath), { useTrash: true }))));
						} catch {
							const message = isWindows
								? l10n.t('Failed to delete using the Recycle Bin. Do you want to permanently delete instead?')
								: l10n.t('Failed to delete using the Trash. Do you want to permanently delete instead?');
							const primaryAction = toClean.length === 1
								? l10n.t('Delete File')
								: l10n.t('Delete All {0} Files', resources.length);

							const result = await window.showWarningMessage(message, { modal: true }, primaryAction);
							if (result === primaryAction) {
								// Delete permanently
								await this.repository.clean(toClean);
							}
						}
					} else {
						await this.repository.clean(toClean);
					}
				}

				if (toCheckout.length > 0) {
					try {
						await this.repository.checkout('', toCheckout);
					} catch (err) {
						if (err.gitErrorCode !== GitErrorCodes.BranchNotYetBorn) {
							throw err;
						}
					}
				}

				if (submodulesToUpdate.length > 0) {
					await this.repository.updateSubmodules(submodulesToUpdate);
				}

				this.closeDiffEditors([], [...toClean, ...toCheckout]);
			},
			() => {
				const resourcePaths = resources.map(r => r.fsPath);

				// Remove resource(s) from working group
				const workingTreeGroup = this.workingTreeGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				// Remove resource(s) from untracked group
				const untrackedGroup = this.untrackedGroup.resourceStates
					.filter(r => !resourcePaths.includes(r.resourceUri.fsPath));

				return { workingTreeGroup, untrackedGroup };
			});
	}

	closeDiffEditors(indexResources: string[] | undefined, workingTreeResources: string[] | undefined, ignoreSetting = false): void {
		const config = workspace.getConfiguration('git', Uri.file(this.root));
		if (!config.get<boolean>('closeDiffOnOperation', false) && !ignoreSetting) { return; }

		function checkTabShouldClose(input: TabInputTextDiff | TabInputNotebookDiff) {
			if (input.modified.scheme === 'git' && (indexResources === undefined || indexResources.some(r => pathEquals(r, input.modified.fsPath)))) {
				// Index
				return true;
			}
			if (input.modified.scheme === 'file' && input.original.scheme === 'git' && (workingTreeResources === undefined || workingTreeResources.some(r => pathEquals(r, input.modified.fsPath)))) {
				// Working Tree
				return true;
			}
			return false;
		}

		const diffEditorTabsToClose = window.tabGroups.all
			.flatMap(g => g.tabs)
			.filter(({ input }) => {
				if (input instanceof TabInputTextDiff || input instanceof TabInputNotebookDiff) {
					return checkTabShouldClose(input);
				} else if (input instanceof TabInputTextMultiDiff) {
					return input.textDiffs.every(checkTabShouldClose);
				}
				return false;
			});

		// Close editors
		window.tabGroups.close(diffEditorTabsToClose, true);
	}

	async branch(name: string, _checkout: boolean, _ref?: string): Promise<void> {
		await this.run(Operation.Branch, () => this.repository.branch(name, _checkout, _ref));
	}

	async deleteBranch(name: string, force?: boolean): Promise<void> {
		return this.run(Operation.DeleteBranch, async () => {
			await this.repository.deleteBranch(name, force);
			await this.repository.config('unset', 'local', `branch.${name}.vscode-merge-base`);
		});
	}

	async renameBranch(name: string): Promise<void> {
		await this.run(Operation.RenameBranch, () => this.repository.renameBranch(name));
	}

	@throttle
	async fastForwardBranch(name: string): Promise<void> {
		// Get branch details
		const branch = await this.getBranch(name);
		if (!branch.upstream?.remote || !branch.upstream?.name || !branch.name) {
			return;
		}

		try {
			// Fast-forward the branch if possible
			const options = { remote: branch.upstream.remote, ref: `${branch.upstream.name}:${branch.name}` };
			await this.run(Operation.Fetch(true), async () => this.repository.fetch(options));
		} catch (err) {
			if (err.gitErrorCode === GitErrorCodes.BranchFastForwardRejected) {
				return;
			}

			throw err;
		}
	}

	async cherryPick(commitHash: string): Promise<void> {
		await this.run(Operation.CherryPick, () => this.repository.cherryPick(commitHash));
	}

	async cherryPickAbort(): Promise<void> {
		await this.run(Operation.CherryPick, () => this.repository.cherryPickAbort());
	}

	async move(from: string, to: string): Promise<void> {
		await this.run(Operation.Move, () => this.repository.move(from, to));
	}

	async getBranch(name: string): Promise<Branch> {
		return await this.run(Operation.GetBranch, () => this.repository.getBranch(name));
	}

	async getBranches(query: BranchQuery = {}, cancellationToken?: CancellationToken): Promise<Ref[]> {
		return await this.run(Operation.GetBranches, async () => {
			const refs = await this.getRefs(query, cancellationToken);
			return refs.filter(value => value.type === RefType.Head || (value.type === RefType.RemoteHead && query.remote));
		});
	}

	@sequentialize
	async getBranchBase(ref: string): Promise<Branch | undefined> {
		const branch = await this.getBranch(ref);

		// Git config
		const mergeBaseConfigKey = `branch.${branch.name}.vscode-merge-base`;

		try {
			const mergeBase = await this.getConfig(mergeBaseConfigKey);
			const branchFromConfig = mergeBase !== '' ? await this.getBranch(mergeBase) : undefined;

			// There was a brief period of time when we would consider local branches as a valid
			// merge base. Since then we have fixed the issue and only remote branches can be used
			// as a merge base so we are adding an additional check.
			if (branchFromConfig && branchFromConfig.remote) {
				return branchFromConfig;
			}
		} catch (err) { }

		// Reflog
		const branchFromReflog = await this.getBranchBaseFromReflog(ref);

		let branchFromReflogUpstream: Branch | undefined = undefined;

		if (branchFromReflog?.type === RefType.RemoteHead) {
			branchFromReflogUpstream = branchFromReflog;
		} else if (branchFromReflog?.type === RefType.Head) {
			branchFromReflogUpstream = await this.getUpstreamBranch(branchFromReflog);
		}

		if (branchFromReflogUpstream) {
			await this.setConfig(mergeBaseConfigKey, `${branchFromReflogUpstream.remote}/${branchFromReflogUpstream.name}`);
			return branchFromReflogUpstream;
		}

		// Default branch
		const defaultBranch = await this.getDefaultBranch();
		if (defaultBranch) {
			await this.setConfig(mergeBaseConfigKey, `${defaultBranch.remote}/${defaultBranch.name}`);
			return defaultBranch;
		}

		return undefined;
	}

	private async getBranchBaseFromReflog(ref: string): Promise<Branch | undefined> {
		try {
			const reflogEntries = await this.repository.reflog(ref, 'branch: Created from *.');
			if (reflogEntries.length !== 1) {
				return undefined;
			}

			// Branch created from an explicit branch
			const match = reflogEntries[0].match(/branch: Created from (?<name>.*)$/);
			if (match && match.length === 2 && match[1] !== 'HEAD') {
				return await this.getBranch(match[1]);
			}

			// Branch created from HEAD
			const headReflogEntries = await this.repository.reflog('HEAD', `checkout: moving from .* to ${ref.replace('refs/heads/', '')}`);
			if (headReflogEntries.length === 0) {
				return undefined;
			}

			const match2 = headReflogEntries[headReflogEntries.length - 1].match(/checkout: moving from ([^\s]+)\s/);
			if (match2 && match2.length === 2) {
				return await this.getBranch(match2[1]);
			}

		}
		catch (err) { }

		return undefined;
	}

	private async getDefaultBranch(): Promise<Branch | undefined> {
		const defaultRemote = this.getDefaultRemote();
		if (!defaultRemote) {
			return undefined;
		}

		try {
			const defaultBranch = await this.repository.getDefaultBranch(defaultRemote.name);
			return defaultBranch;
		}
		catch (err) {
			this.logger.warn(`[Repository][getDefaultBranch] Failed to get default branch details: ${err.message}.`);
			return undefined;
		}
	}

	private async getUpstreamBranch(branch: Branch): Promise<Branch | undefined> {
		if (!branch.upstream) {
			return undefined;
		}

		try {
			const upstreamBranch = await this.getBranch(`refs/remotes/${branch.upstream.remote}/${branch.upstream.name}`);
			return upstreamBranch;
		}
		catch (err) {
			this.logger.warn(`[Repository][getUpstreamBranch] Failed to get branch details for 'refs/remotes/${branch.upstream.remote}/${branch.upstream.name}': ${err.message}.`);
			return undefined;
		}
	}

	async getRefs(query: RefQuery = {}, cancellationToken?: CancellationToken): Promise<(Ref | Branch)[]> {
		const config = workspace.getConfiguration('git');
		let defaultSort = config.get<'alphabetically' | 'committerdate'>('branchSortOrder');
		if (defaultSort !== 'alphabetically' && defaultSort !== 'committerdate') {
			defaultSort = 'alphabetically';
		}

		query = { ...query, sort: query?.sort ?? defaultSort };
		return await this.run(Operation.GetRefs, () => this.repository.getRefs(query, cancellationToken));
	}

	async getWorktrees(): Promise<Worktree[]> {
		return await this.run(Operation.Worktree(true), () => this.repository.getWorktrees());
	}

	async getWorktreeDetails(): Promise<Worktree[]> {
		return this.run(Operation.Worktree(true), async () => {
			const worktrees = await this.repository.getWorktrees();
			if (worktrees.length === 0) {
				return [];
			}

			// Get refs for worktrees that point to a ref
			const worktreeRefs = worktrees
				.filter(worktree => !worktree.detached)
				.map(worktree => worktree.ref);

			// Get the commit details for worktrees that point to a ref
			const refs = await this.getRefs({ pattern: worktreeRefs, includeCommitDetails: true });

			// Get the commit details for detached worktrees
			const commits = await Promise.all(worktrees
				.filter(worktree => worktree.detached)
				.map(worktree => this.repository.getCommit(worktree.ref)));

			return worktrees.map(worktree => {
				const commitDetails = worktree.detached
					? commits.find(commit => commit.hash === worktree.ref)
					: refs.find(ref => `refs/heads/${ref.name}` === worktree.ref)?.commitDetails;

				return { ...worktree, commitDetails } satisfies Worktree;
			});
		});
	}

	async getRemoteRefs(remote: string, opts?: { heads?: boolean; tags?: boolean }): Promise<Ref[]> {
		return await this.run(Operation.GetRemoteRefs, () => this.repository.getRemoteRefs(remote, opts));
	}

	async setBranchUpstream(name: string, upstream: string): Promise<void> {
		await this.run(Operation.SetBranchUpstream, () => this.repository.setBranchUpstream(name, upstream));
	}

	async merge(ref: string): Promise<void> {
		await this.run(Operation.Merge, () => this.repository.merge(ref));
	}

	async mergeAbort(): Promise<void> {
		await this.run(Operation.MergeAbort, async () => await this.repository.mergeAbort());
	}

	async rebase(branch: string): Promise<void> {
		await this.run(Operation.Rebase, () => this.repository.rebase(branch));
	}

	async tag(options: { name: string; message?: string; ref?: string }): Promise<void> {
		await this.run(Operation.Tag, () => this.repository.tag(options));
	}

	async deleteTag(name: string): Promise<void> {
		await this.run(Operation.DeleteTag, () => this.repository.deleteTag(name));
	}

	async createWorktree(options?: { path?: string; commitish?: string; branch?: string }): Promise<string> {
		const defaultWorktreeRoot = this.globalState.get<string>(`${Repository.WORKTREE_ROOT_STORAGE_KEY}:${this.root}`);
		const config = workspace.getConfiguration('git', Uri.file(this.root));
		const branchPrefix = config.get<string>('branchPrefix', '');

		return await this.run(Operation.Worktree(false), async () => {
			let worktreeName: string | undefined;
			let { path: worktreePath, commitish, branch } = options || {};

			// Create worktree path based on the branch name
			if (worktreePath === undefined && branch !== undefined) {
				worktreeName = branch.startsWith(branchPrefix)
					? branch.substring(branchPrefix.length).replace(/\//g, '-')
					: branch.replace(/\//g, '-');

				worktreePath = defaultWorktreeRoot
					? path.join(defaultWorktreeRoot, worktreeName)
					: path.join(path.dirname(this.root), `${path.basename(this.root)}.worktrees`, worktreeName);
			}

			// Ensure that the worktree path is unique
			if (this.worktrees.some(worktree => pathEquals(path.normalize(worktree.path), path.normalize(worktreePath!)))) {
				let counter = 0, uniqueWorktreePath: string;
				do {
					uniqueWorktreePath = `${worktreePath}-${++counter}`;
				} while (this.worktrees.some(wt => pathEquals(path.normalize(wt.path), path.normalize(uniqueWorktreePath))));

				worktreePath = uniqueWorktreePath;
			}

			// Create the worktree
			await this.repository.addWorktree({ path: worktreePath!, commitish: commitish ?? 'HEAD', branch });

			// Update worktree root in global state
			const newWorktreeRoot = path.dirname(worktreePath!);
			if (defaultWorktreeRoot && !pathEquals(newWorktreeRoot, defaultWorktreeRoot)) {
				this.globalState.update(`${Repository.WORKTREE_ROOT_STORAGE_KEY}:${this.root}`, newWorktreeRoot);
			}

			return worktreePath!;
		});
	}

	async deleteWorktree(path: string, options?: { force?: boolean }): Promise<void> {
		await this.run(Operation.Worktree(false), async () => {
			const worktree = this.repositoryResolver.getRepository(path);

			const deleteWorktree = async (options?: { force?: boolean }): Promise<void> => {
				await this.repository.deleteWorktree(path, options);
				worktree?.dispose();
			};

			try {
				await deleteWorktree();
			} catch (err) {
				if (err.gitErrorCode === GitErrorCodes.WorktreeContainsChanges) {
					const forceDelete = l10n.t('Force Delete');
					const message = l10n.t('The worktree contains modified or untracked files. Do you want to force delete?');
					const choice = await window.showWarningMessage(message, { modal: true }, forceDelete);
					if (choice === forceDelete) {
						await deleteWorktree({ ...options, force: true });
					}
					return;
				}

				throw err;
			}
		});
	}

	async deleteRemoteRef(remoteName: string, refName: string, options?: { force?: boolean }): Promise<void> {
		await this.run(Operation.DeleteRemoteRef, () => this.repository.deleteRemoteRef(remoteName, refName, options));
	}

	async checkout(treeish: string, opts?: { detached?: boolean; pullBeforeCheckout?: boolean }): Promise<void> {
		const refLabel = opts?.detached ? getCommitShortHash(Uri.file(this.root), treeish) : treeish;

		await this.run(Operation.Checkout(refLabel),
			async () => {
				if (opts?.pullBeforeCheckout && !opts?.detached) {
					try {
						await this.fastForwardBranch(treeish);
					}
					catch (err) {
						// noop
					}
				}

				await this.repository.checkout(treeish, [], opts);
			});
	}

	async checkoutTracking(treeish: string, opts: { detached?: boolean } = {}): Promise<void> {
		const refLabel = opts.detached ? getCommitShortHash(Uri.file(this.root), treeish) : treeish;
		await this.run(Operation.CheckoutTracking(refLabel), () => this.repository.checkout(treeish, [], { ...opts, track: true }));
	}

	async findTrackingBranches(upstreamRef: string): Promise<Branch[]> {
		return await this.run(Operation.FindTrackingBranches, () => this.repository.findTrackingBranches(upstreamRef));
	}

	async getCommit(ref: string): Promise<Commit> {
		return await this.repository.getCommit(ref);
	}

	async showChanges(ref: string): Promise<string> {
		return await this.run(Operation.Log(false), () => this.repository.showChanges(ref));
	}

	async showChangesBetween(ref1: string, ref2: string, path?: string): Promise<string> {
		return await this.run(Operation.Log(false), () => this.repository.showChangesBetween(ref1, ref2, path));
	}

	async getEmptyTree(): Promise<string> {
		if (!this._EMPTY_TREE) {
			const result = await this.repository.exec(['hash-object', '-t', 'tree', '/dev/null']);
			this._EMPTY_TREE = result.stdout.trim();
		}

		return this._EMPTY_TREE;
	}

	async reset(treeish: string, hard?: boolean): Promise<void> {
		await this.run(Operation.Reset, () => this.repository.reset(treeish, hard));
	}

	async deleteRef(ref: string): Promise<void> {
		await this.run(Operation.DeleteRef, () => this.repository.deleteRef(ref));
	}

	getDefaultRemote(): Remote | undefined {
		if (this.remotes.length === 0) {
			return undefined;
		}

		return this.remotes.find(r => r.name === 'origin') ?? this.remotes[0];
	}

	async addRemote(name: string, url: string): Promise<void> {
		await this.run(Operation.Remote, async () => {
			const result = await this.repository.addRemote(name, url);
			this.repositoryCache.update(this.remotes, [], this.root);
			return result;
		});
	}

	async removeRemote(name: string): Promise<void> {
		await this.run(Operation.Remote, async () => {
			const result = this.repository.removeRemote(name);
			const remote = this.remotes.find(remote => remote.name === name);
			if (remote) {
				this.repositoryCache.update([], [remote], this.root);
			}
			return result;
		});

	}

	async renameRemote(name: string, newName: string): Promise<void> {
		await this.run(Operation.Remote, () => this.repository.renameRemote(name, newName));
	}

	@throttle
	async fetchDefault(options: { silent?: boolean } = {}): Promise<void> {
		await this._fetch({ silent: options.silent });
	}

	@throttle
	async fetchPrune(): Promise<void> {
		await this._fetch({ prune: true });
	}

	@throttle
	async fetchAll(options: { silent?: boolean } = {}, cancellationToken?: CancellationToken): Promise<void> {
		await this._fetch({ all: true, silent: options.silent, cancellationToken });
	}

	async fetch(options: FetchOptions): Promise<void> {
		await this._fetch(options);
	}

	private async _fetch(options: { remote?: string; ref?: string; all?: boolean; prune?: boolean; depth?: number; silent?: boolean; cancellationToken?: CancellationToken } = {}): Promise<void> {
		if (!options.prune) {
			const config = workspace.getConfiguration('git', Uri.file(this.root));
			const prune = config.get<boolean>('pruneOnFetch');
			options.prune = prune;
		}

		await this.run(Operation.Fetch(options.silent !== true), async () => this.repository.fetch(options));
	}

	@throttle
	async pullWithRebase(head: Branch | undefined): Promise<void> {
		let remote: string | undefined;
		let branch: string | undefined;

		if (head && head.name && head.upstream) {
			remote = head.upstream.remote;
			branch = `${head.upstream.name}`;
		}

		return this.pullFrom(true, remote, branch);
	}

	@throttle
	async pull(head?: Branch, unshallow?: boolean): Promise<void> {
		let remote: string | undefined;
		let branch: string | undefined;

		if (head && head.name && head.upstream) {
			remote = head.upstream.remote;
			branch = `${head.upstream.name}`;
		}

		return this.pullFrom(false, remote, branch, unshallow);
	}

	async pullFrom(rebase?: boolean, remote?: string, branch?: string, unshallow?: boolean): Promise<void> {
		await this.run(Operation.Pull, async () => {
			await this.maybeAutoStash(async () => {
				const config = workspace.getConfiguration('git', Uri.file(this.root));
				const autoStash = config.get<boolean>('autoStash');
				const fetchOnPull = config.get<boolean>('fetchOnPull');
				const tags = config.get<boolean>('pullTags');

				// When fetchOnPull is enabled, fetch all branches when pulling
				if (fetchOnPull) {
					await this.fetchAll();
				}

				if (await this.checkIfMaybeRebased(this.HEAD?.name)) {
					await this._pullAndHandleTagConflict(rebase, remote, branch, { unshallow, tags, autoStash });
				}
			});
		});
	}

	private async _pullAndHandleTagConflict(rebase?: boolean, remote?: string, branch?: string, options: PullOptions = {}): Promise<void> {
		try {
			await this.repository.pull(rebase, remote, branch, options);
		}
		catch (err) {
			if (err.gitErrorCode !== GitErrorCodes.TagConflict) {
				throw err;
			}

			// Handle tag(s) conflict
			if (await this.handleTagConflict(remote, err.stderr)) {
				await this.repository.pull(rebase, remote, branch, options);
			}
		}
	}

	@throttle
	async push(head: Branch, forcePushMode?: ForcePushMode): Promise<void> {
		let remote: string | undefined;
		let branch: string | undefined;

		if (head && head.name && head.upstream) {
			remote = head.upstream.remote;
			branch = `${head.name}:${head.upstream.name}`;
		}

		await this.run(Operation.Push, () => this._push(remote, branch, undefined, undefined, forcePushMode));
	}

	async pushTo(remote?: string, name?: string, setUpstream = false, forcePushMode?: ForcePushMode): Promise<void> {
		await this.run(Operation.Push, () => this._push(remote, name, setUpstream, undefined, forcePushMode));
	}

	async pushFollowTags(remote?: string, forcePushMode?: ForcePushMode): Promise<void> {
		await this.run(Operation.Push, () => this._push(remote, undefined, false, true, forcePushMode));
	}

	async pushTags(remote?: string, forcePushMode?: ForcePushMode): Promise<void> {
		await this.run(Operation.Push, () => this._push(remote, undefined, false, false, forcePushMode, true));
	}

	async blame(path: string): Promise<string> {
		return await this.run(Operation.Blame(true), () => this.repository.blame(path));
	}

	async blame2(path: string, ref?: string): Promise<BlameInformation[] | undefined> {
		return await this.run(Operation.Blame(false), () => this.repository.blame2(path, ref));
	}

	@throttle
	sync(head: Branch, rebase: boolean): Promise<void> {
		return this._sync(head, rebase);
	}

	private async _sync(head: Branch, rebase: boolean): Promise<void> {
		let remoteName: string | undefined;
		let pullBranch: string | undefined;
		let pushBranch: string | undefined;

		if (head.name && head.upstream) {
			remoteName = head.upstream.remote;
			pullBranch = `${head.upstream.name}`;
			pushBranch = `${head.name}:${head.upstream.name}`;
		}

		await this.run(Operation.Sync, async () => {
			await this.maybeAutoStash(async () => {
				const config = workspace.getConfiguration('git', Uri.file(this.root));
				const autoStash = config.get<boolean>('autoStash');
				const fetchOnPull = config.get<boolean>('fetchOnPull');
				const tags = config.get<boolean>('pullTags');
				const followTags = config.get<boolean>('followTagsWhenSync');
				const supportCancellation = config.get<boolean>('supportCancellation');

				const fn = async (cancellationToken?: CancellationToken) => {
					// When fetchOnPull is enabled, fetch all branches when pulling
					if (fetchOnPull) {
						await this.fetchAll({}, cancellationToken);
					}

					if (await this.checkIfMaybeRebased(this.HEAD?.name)) {
						await this._pullAndHandleTagConflict(rebase, remoteName, pullBranch, { tags, cancellationToken, autoStash });
					}
				};

				if (supportCancellation) {
					const opts: ProgressOptions = {
						location: ProgressLocation.Notification,
						title: l10n.t('Syncing. Cancelling may cause serious damages to the repository'),
						cancellable: true
					};

					await window.withProgress(opts, (_, token) => fn(token));
				} else {
					await fn();
				}

				const remote = this.remotes.find(r => r.name === remoteName);

				if (remote && remote.isReadOnly) {
					return;
				}

				const shouldPush = this.HEAD && (typeof this.HEAD.ahead === 'number' ? this.HEAD.ahead > 0 : true);

				if (shouldPush) {
					await this._push(remoteName, pushBranch, false, followTags);
				}
			});
		});
	}

	private async checkIfMaybeRebased(currentBranch?: string) {
		const config = workspace.getConfiguration('git');
		const shouldIgnore = config.get<boolean>('ignoreRebaseWarning') === true;

		if (shouldIgnore) {
			return true;
		}

		const maybeRebased = await this.run(Operation.Log(true), async () => {
			try {
				const result = await this.repository.exec(['log', '--oneline', '--cherry', `${currentBranch ?? ''}...${currentBranch ?? ''}@{upstream}`, '--']);
				if (result.exitCode) {
					return false;
				}

				return /^=/.test(result.stdout);
			} catch {
				return false;
			}
		});

		if (!maybeRebased) {
			return true;
		}

		const always = { title: l10n.t('Always Pull') };
		const pull = { title: l10n.t('Pull') };
		const cancel = { title: l10n.t('Don\'t Pull') };
		const result = await window.showWarningMessage(
			currentBranch
				? l10n.t('It looks like the current branch "{0}" might have been rebased. Are you sure you still want to pull into it?', currentBranch)
				: l10n.t('It looks like the current branch might have been rebased. Are you sure you still want to pull into it?'),
			always, pull, cancel
		);

		if (result === pull) {
			return true;
		}

		if (result === always) {
			await config.update('ignoreRebaseWarning', true, true);

			return true;
		}

		return false;
	}

	async show(ref: string, filePath: string): Promise<string> {
		return await this.run(Operation.Show, async () => {
			try {
				const content = await this.repository.buffer(ref, filePath);
				return await workspace.decode(content, { uri: Uri.file(filePath) });
			} catch (err) {
				if (err.gitErrorCode === GitErrorCodes.WrongCase) {
					const gitFilePath = await this.repository.getGitFilePath(ref, filePath);
					const content = await this.repository.buffer(ref, gitFilePath);
					return await workspace.decode(content, { uri: Uri.file(filePath) });
				}

				throw err;
			}
		});
	}

	async buffer(ref: string, filePath: string): Promise<Buffer> {
		return this.run(Operation.Show, () => this.repository.buffer(ref, filePath));
	}

	getObjectFiles(ref: string): Promise<LsTreeElement[]> {
		return this.run(Operation.GetObjectFiles, () => this.repository.lstree(ref));
	}

	getObjectDetails(ref: string, path: string): Promise<{ mode: string; object: string; size: number }> {
		return this.run(Operation.GetObjectDetails, () => this.repository.getObjectDetails(ref, path));
	}

	detectObjectType(object: string): Promise<{ mimetype: string; encoding?: string }> {
		return this.run(Operation.Show, () => this.repository.detectObjectType(object));
	}

	async apply(patch: string, reverse?: boolean): Promise<void> {
		return await this.run(Operation.Apply, () => this.repository.apply(patch, reverse));
	}

	async getStashes(): Promise<Stash[]> {
		return this.run(Operation.Stash(true), () => this.repository.getStashes());
	}

	async createStash(message?: string, includeUntracked?: boolean, staged?: boolean): Promise<void> {
		const indexResources = [...this.indexGroup.resourceStates.map(r => r.resourceUri.fsPath)];
		const workingGroupResources = [
			...!staged ? this.workingTreeGroup.resourceStates.map(r => r.resourceUri.fsPath) : [],
			...includeUntracked ? this.untrackedGroup.resourceStates.map(r => r.resourceUri.fsPath) : []];

		return await this.run(Operation.Stash(false), async () => {
			await this.repository.createStash(message, includeUntracked, staged);
			this.closeDiffEditors(indexResources, workingGroupResources);
		});
	}

	async popStash(index?: number, options?: { reinstateStagedChanges?: boolean }): Promise<void> {
		return await this.run(Operation.Stash(false), () => this.repository.popStash(index, options));
	}

	async dropStash(index?: number): Promise<void> {
		return await this.run(Operation.Stash(false), () => this.repository.dropStash(index));
	}

	async applyStash(index?: number, options?: { reinstateStagedChanges?: boolean }): Promise<void> {
		return await this.run(Operation.Stash(false), () => this.repository.applyStash(index, options));
	}

	async showStash(index: number): Promise<Change[] | undefined> {
		return await this.run(Operation.Stash(true), () => this.repository.showStash(index));
	}

	async getCommitTemplate(): Promise<string> {
		return await this.run(Operation.GetCommitTemplate, async () => this.repository.getCommitTemplate());
	}

	async ignore(files: Uri[]): Promise<void> {
		return await this.run(Operation.Ignore, async () => {
			const ignoreFile = `${this.repository.root}${path.sep}.gitignore`;
			const textToAppend = files
				.map(uri => relativePath(this.repository.root, uri.fsPath)
					.replace(/\\|\[/g, match => match === '\\' ? '/' : `\\${match}`))
				.join('\n');

			const document = await new Promise(c => fs.exists(ignoreFile, c))
				? await workspace.openTextDocument(ignoreFile)
				: await workspace.openTextDocument(Uri.file(ignoreFile).with({ scheme: 'untitled' }));

			await window.showTextDocument(document);

			const edit = new WorkspaceEdit();
			const lastLine = document.lineAt(document.lineCount - 1);
			const text = lastLine.isEmptyOrWhitespace ? `${textToAppend}\n` : `\n${textToAppend}\n`;

			edit.insert(document.uri, lastLine.range.end, text);
			await workspace.applyEdit(edit);
			await document.save();
		});
	}

	async rebaseAbort(): Promise<void> {
		await this.run(Operation.RebaseAbort, async () => await this.repository.rebaseAbort());
	}

	checkIgnore(filePaths: string[]): Promise<Set<string>> {
		return this.run(Operation.CheckIgnore, () => {
			return new Promise<Set<string>>((resolve, reject) => {

				filePaths = filePaths
					.filter(filePath => isDescendant(this.root, filePath));

				if (filePaths.length === 0) {
					// nothing left
					return resolve(new Set<string>());
				}

				// https://git-scm.com/docs/git-check-ignore#git-check-ignore--z
				const child = this.repository.stream(['check-ignore', '-v', '-z', '--stdin'], { stdio: [null, null, null] });
				child.stdin!.end(filePaths.join('\0'), 'utf8');

				const onExit = (exitCode: number) => {
					if (exitCode === 1) {
						// nothing ignored
						resolve(new Set<string>());
					} else if (exitCode === 0) {
						resolve(new Set<string>(this.parseIgnoreCheck(data)));
					} else {
						if (/ is in submodule /.test(stderr)) {
							reject(new GitError({ stdout: data, stderr, exitCode, gitErrorCode: GitErrorCodes.IsInSubmodule }));
						} else {
							reject(new GitError({ stdout: data, stderr, exitCode }));
						}
					}
				};

				let data = '';
				const onStdoutData = (raw: string) => {
					data += raw;
				};

				child.stdout!.setEncoding('utf8');
				child.stdout!.on('data', onStdoutData);

				let stderr: string = '';
				child.stderr!.setEncoding('utf8');
				child.stderr!.on('data', raw => stderr += raw);

				child.on('error', reject);
				child.on('exit', onExit);
			});
		});
	}

	// Parses output of `git check-ignore -v -z` and returns only those paths
	// that are actually ignored by git.
	// Matches to a negative pattern (starting with '!') are filtered out.
	// See also https://git-scm.com/docs/git-check-ignore#_output.
	private parseIgnoreCheck(raw: string): string[] {
		const ignored = [];
		const elements = raw.split('\0');
		for (let i = 0; i < elements.length; i += 4) {
			const pattern = elements[i + 2];
			const path = elements[i + 3];
			if (pattern && !pattern.startsWith('!')) {
				ignored.push(path);
			}
		}
		return ignored;
	}

	private async _push(remote?: string, refspec?: string, setUpstream = false, followTags = false, forcePushMode?: ForcePushMode, tags = false): Promise<void> {
		try {
			await this.repository.push(remote, refspec, setUpstream, followTags, forcePushMode, tags);
		} catch (err) {
			if (!remote || !refspec) {
				throw err;
			}

			const repository = new ApiRepository(this);
			const remoteObj = repository.state.remotes.find(r => r.name === remote);

			if (!remoteObj) {
				throw err;
			}

			for (const handler of this.pushErrorHandlerRegistry.getPushErrorHandlers()) {
				if (await handler.handlePushError(repository, remoteObj, refspec, err)) {
					return;
				}
			}

			throw err;
		}
	}

	private async run<T>(
		operation: Operation,
		runOperation: () => Promise<T> = () => Promise.resolve(null) as Promise<T>,
		getOptimisticResourceGroups: () => GitResourceGroups | undefined = () => undefined
	): Promise<T> {

		if (this.state !== RepositoryState.Idle) {
			throw new Error('Repository not initialized');
		}

		let error: unknown = null;

		this._operations.start(operation);
		this._onRunOperation.fire(operation.kind);

		try {
			const result = await this.retryRun(operation, runOperation);

			if (!operation.readOnly) {
				await this.updateModelState(this.optimisticUpdateEnabled() ? getOptimisticResourceGroups() : undefined);
			}

			return result;
		} catch (err) {
			error = err;

			if (err instanceof GitError && err.gitErrorCode === GitErrorCodes.NotAGitRepository) {
				this.state = RepositoryState.Disposed;
			}

			if (!operation.readOnly) {
				await this.updateModelState();
			}

			throw err;
		} finally {
			this._operations.end(operation);
			this._onDidRunOperation.fire({ operation: operation, error });
		}
	}

	async migrateChanges(sourceRepositoryRoot: string, options?: { confirmation?: boolean; deleteFromSource?: boolean; untracked?: boolean }): Promise<void> {
		const sourceRepository = this.repositoryResolver.getRepository(sourceRepositoryRoot);
		if (!sourceRepository) {
			window.showWarningMessage(l10n.t('The source repository could not be found.'));
			return;
		}

		if (sourceRepository.indexGroup.resourceStates.length === 0 &&
			sourceRepository.workingTreeGroup.resourceStates.length === 0 &&
			sourceRepository.untrackedGroup.resourceStates.length === 0) {
			await window.showInformationMessage(l10n.t('There are no changes in the selected worktree to migrate.'));
			return;
		}

		const sourceFilePaths = [
			...sourceRepository.indexGroup.resourceStates,
			...sourceRepository.workingTreeGroup.resourceStates,
			...sourceRepository.untrackedGroup.resourceStates
		].map(resource => path.relative(sourceRepository.root, resource.resourceUri.fsPath));

		const targetFilePaths = [
			...this.workingTreeGroup.resourceStates,
			...this.untrackedGroup.resourceStates
		].map(resource => path.relative(this.root, resource.resourceUri.fsPath));

		// Detect overlapping unstaged files in worktree stash and target repository
		const conflicts = sourceFilePaths.filter(path => targetFilePaths.includes(path));

		if (conflicts.length > 0) {
			const maxFilesShown = 5;
			const filesToShow = conflicts.slice(0, maxFilesShown);
			const remainingCount = conflicts.length - maxFilesShown;

			const fileList = filesToShow.join('\n ') +
				(remainingCount > 0 ? l10n.t('\n and {0} more file{1}...', remainingCount, remainingCount > 1 ? 's' : '') : '');

			const message = l10n.t('Your local changes to the following files would be overwritten by merge:\n {0}\n\nPlease stage, commit, or stash your changes in the repository before migrating changes.', fileList);
			await window.showErrorMessage(message, { modal: true });
			return;
		}

		if (options?.confirmation) {
			// Non-interactive migration, do not show confirmation dialog
			const message = l10n.t('Proceed with migrating changes to the current repository?');
			const detail = l10n.t('This will apply the worktree\'s changes to this repository and discard changes in the worktree.\nThis is IRREVERSIBLE!');
			const proceed = l10n.t('Proceed');
			const pick = await window.showWarningMessage(message, { modal: true, detail }, proceed);
			if (pick !== proceed) {
				return;
			}
		}

		const stashName = `migration:${sourceRepository.HEAD?.name ?? sourceRepository.HEAD?.commit}-${this.HEAD?.name ?? this.HEAD?.commit}`;
		await sourceRepository.createStash(stashName, options?.untracked);
		const stashes = await sourceRepository.getStashes();

		try {
			if (options?.deleteFromSource) {
				await this.popStash(stashes[0].index);
			} else {
				await this.applyStash(stashes[0].index);
				await sourceRepository.popStash(stashes[0].index, { reinstateStagedChanges: true });
			}
		} catch (err) {
			if (err.gitErrorCode === GitErrorCodes.StashConflict) {
				this.isWorktreeMigrating = true;

				const message = l10n.t('There are merge conflicts from migrating changes. Please resolve them before committing.');
				const show = l10n.t('Show Changes');
				const choice = await window.showWarningMessage(message, show);
				if (choice === show) {
					await commands.executeCommand('workbench.view.scm');
				}

				await sourceRepository.popStash(stashes[0].index, { reinstateStagedChanges: true });
				return;
			}

			await sourceRepository.popStash(stashes[0].index, { reinstateStagedChanges: true });
			throw err;
		}
	}

	private async retryRun<T>(operation: Operation, runOperation: () => Promise<T>): Promise<T> {
		let attempt = 0;

		while (true) {
			try {
				attempt++;
				return await runOperation();
			} catch (err) {
				const shouldRetry = attempt <= 10 && (
					(err.gitErrorCode === GitErrorCodes.RepositoryIsLocked)
					|| (operation.retry && (err.gitErrorCode === GitErrorCodes.CantLockRef || err.gitErrorCode === GitErrorCodes.CantRebaseMultipleBranches))
				);

				if (shouldRetry) {
					// quatratic backoff
					await timeout(Math.pow(attempt, 2) * 50);
				} else {
					throw err;
				}
			}
		}
	}

	private static KnownHugeFolderNames = ['node_modules'];

	private async findKnownHugeFolderPathsToIgnore(): Promise<string[]> {
		const folderPaths: string[] = [];

		for (const folderName of Repository.KnownHugeFolderNames) {
			const folderPath = path.join(this.repository.root, folderName);

			if (await new Promise<boolean>(c => fs.exists(folderPath, c))) {
				folderPaths.push(folderPath);
			}
		}

		const ignored = await this.checkIgnore(folderPaths);

		return folderPaths.filter(p => !ignored.has(p));
	}

	private async updateModelState(optimisticResourcesGroups?: GitResourceGroups) {
		this.updateModelStateCancellationTokenSource?.cancel();

		this.updateModelStateCancellationTokenSource = new CancellationTokenSource();
		await this._updateModelState(optimisticResourcesGroups, this.updateModelStateCancellationTokenSource.token);
	}

	private async _updateModelState(optimisticResourcesGroups?: GitResourceGroups, cancellationToken?: CancellationToken): Promise<void> {
		try {
			// Optimistically update resource groups
			if (optimisticResourcesGroups) {
				this._updateResourceGroupsState(optimisticResourcesGroups);
			}

			const [HEAD, remotes, submodules, worktrees, rebaseCommit, mergeInProgress, cherryPickInProgress, commitTemplate] =
				await Promise.all([
					this.repository.getHEADRef(),
					this.repository.getRemotes(),
					this.repository.getSubmodules(),
					this.repository.getWorktrees(),
					this.getRebaseCommit(),
					this.isMergeInProgress(),
					this.isCherryPickInProgress(),
					this.getInputTemplate()]);

			// Reset the list of unpublished commits if HEAD has
			// changed (ex: checkout, fetch, pull, push, publish, etc.).
			// The list of unpublished commits will be computed lazily
			// on demand.
			if (this.HEAD?.name !== HEAD?.name ||
				this.HEAD?.commit !== HEAD?.commit ||
				this.HEAD?.ahead !== HEAD?.ahead ||
				this.HEAD?.upstream !== HEAD?.upstream) {
				this.unpublishedCommits = undefined;
			}

			this._HEAD = HEAD;
			this._remotes = remotes!;
			this._submodules = submodules!;
			this._worktrees = worktrees!;
			this.rebaseCommit = rebaseCommit;
			this.mergeInProgress = mergeInProgress;
			this.cherryPickInProgress = cherryPickInProgress;

			this._sourceControl.commitTemplate = commitTemplate;

			// Execute cancellable long-running operation
			const [resourceGroups, refs] =
				await Promise.all([
					this.getStatus(cancellationToken),
					this.getRefs({}, cancellationToken)]);

			this._refs = refs;
			this._updateResourceGroupsState(resourceGroups);

			this._onDidChangeStatus.fire();
		}
		catch (err) {
			if (err instanceof CancellationError) {
				return;
			}

			throw err;
		}
	}

	private _updateResourceGroupsState(resourcesGroups: GitResourceGroups): void {
		// set resource groups
		if (resourcesGroups.indexGroup) { this.indexGroup.resourceStates = resourcesGroups.indexGroup; }
		if (resourcesGroups.mergeGroup) { this.mergeGroup.resourceStates = resourcesGroups.mergeGroup; }
		if (resourcesGroups.untrackedGroup) { this.untrackedGroup.resourceStates = resourcesGroups.untrackedGroup; }
		if (resourcesGroups.workingTreeGroup) { this.workingTreeGroup.resourceStates = resourcesGroups.workingTreeGroup; }

		// clear worktree migrating flag once all conflicts are resolved
		if (this._isWorktreeMigrating && resourcesGroups.mergeGroup && resourcesGroups.mergeGroup.length === 0) {
			this._isWorktreeMigrating = false;
		}

		// set count badge
		this.setCountBadge();
	}

	private async getStatus(cancellationToken?: CancellationToken): Promise<GitResourceGroups> {
		if (cancellationToken && cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		const scopedConfig = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const untrackedChanges = scopedConfig.get<'mixed' | 'separate' | 'hidden'>('untrackedChanges');
		const ignoreSubmodules = scopedConfig.get<boolean>('ignoreSubmodules');

		const limit = scopedConfig.get<number>('statusLimit', 10000);
		const similarityThreshold = scopedConfig.get<number>('similarityThreshold', 50);

		const start = new Date().getTime();
		const { status, statusLength, didHitLimit } = await this.repository.getStatus({ limit, ignoreSubmodules, similarityThreshold, untrackedChanges, cancellationToken });
		const totalTime = new Date().getTime() - start;

		this.isRepositoryHuge = didHitLimit ? { limit } : false;

		if (didHitLimit) {
			/* __GDPR__
				"statusLimit" : {
					"owner": "lszomoru",
					"ignoreSubmodules": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting indicating whether submodules are ignored" },
					"limit": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Setting indicating the limit of status entries" },
					"statusLength": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Total number of status entries" },
					"totalTime": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Total number of ms the operation took" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('statusLimit', { ignoreSubmodules: String(ignoreSubmodules) }, { limit, statusLength, totalTime });
		}

		if (totalTime > 5000) {
			/* __GDPR__
				"statusSlow" : {
					"owner": "digitarald",
					"comment": "Reports when git status is slower than 5s",
					"expiration": "1.73",
					"ignoreSubmodules": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting indicating whether submodules are ignored" },
					"didHitLimit": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Total number of status entries" },
					"didWarnAboutLimit": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "True when the user was warned about slow git status" },
					"statusLength": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Total number of status entries" },
					"totalTime": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Total number of ms the operation took" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('statusSlow', { ignoreSubmodules: String(ignoreSubmodules), didHitLimit: String(didHitLimit), didWarnAboutLimit: String(this.didWarnAboutLimit) }, { statusLength, totalTime });
		}

		// Triggers or clears any validation warning
		this._sourceControl.inputBox.validateInput = this._sourceControl.inputBox.validateInput;

		const config = workspace.getConfiguration('git');
		const shouldIgnore = config.get<boolean>('ignoreLimitWarning') === true;
		const useIcons = !config.get<boolean>('decorations.enabled', true);

		if (didHitLimit && !shouldIgnore && !this.didWarnAboutLimit) {
			const knownHugeFolderPaths = await this.findKnownHugeFolderPathsToIgnore();
			const gitWarn = l10n.t('The git repository at "{0}" has too many active changes, only a subset of Git features will be enabled.', this.repository.root);
			const neverAgain = { title: l10n.t('Don\'t Show Again') };

			if (knownHugeFolderPaths.length > 0) {
				const folderPath = knownHugeFolderPaths[0];
				const folderName = path.basename(folderPath);

				const addKnown = l10n.t('Would you like to add "{0}" to .gitignore?', folderName);
				const yes = { title: l10n.t('Yes') };
				const no = { title: l10n.t('No') };

				window.showWarningMessage(`${gitWarn} ${addKnown}`, yes, no, neverAgain).then(result => {
					if (result === yes) {
						this.ignore([Uri.file(folderPath)]);
					} else {
						if (result === neverAgain) {
							config.update('ignoreLimitWarning', true, false);
						}

						this.didWarnAboutLimit = true;
					}
				});
			} else {
				const ok = { title: l10n.t('OK') };
				window.showWarningMessage(gitWarn, ok, neverAgain).then(result => {
					if (result === neverAgain) {
						config.update('ignoreLimitWarning', true, false);
					}

					this.didWarnAboutLimit = true;
				});
			}
		}

		const indexGroup: Resource[] = [],
			mergeGroup: Resource[] = [],
			untrackedGroup: Resource[] = [],
			workingTreeGroup: Resource[] = [];

		status.forEach(raw => {
			const uri = Uri.file(path.join(this.repository.root, raw.path));
			const renameUri = raw.rename
				? Uri.file(path.join(this.repository.root, raw.rename))
				: undefined;

			switch (raw.x + raw.y) {
				case '??': switch (untrackedChanges) {
					case 'mixed': return workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.UNTRACKED, useIcons, undefined, this.kind));
					case 'separate': return untrackedGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Untracked, uri, Status.UNTRACKED, useIcons));
					default: return undefined;
				}
				case '!!': switch (untrackedChanges) {
					case 'mixed': return workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.IGNORED, useIcons, undefined, this.kind));
					case 'separate': return untrackedGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Untracked, uri, Status.IGNORED, useIcons));
					default: return undefined;
				}
				case 'DD': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.BOTH_DELETED, useIcons));
				case 'AU': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.ADDED_BY_US, useIcons));
				case 'UD': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.DELETED_BY_THEM, useIcons));
				case 'UA': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.ADDED_BY_THEM, useIcons));
				case 'DU': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.DELETED_BY_US, useIcons));
				case 'AA': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.BOTH_ADDED, useIcons));
				case 'UU': return mergeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Merge, uri, Status.BOTH_MODIFIED, useIcons));
			}

			switch (raw.x) {
				case 'M': indexGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Index, uri, Status.INDEX_MODIFIED, useIcons, undefined, this.kind)); break;
				case 'A': indexGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Index, uri, Status.INDEX_ADDED, useIcons, undefined, this.kind)); break;
				case 'D': indexGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Index, uri, Status.INDEX_DELETED, useIcons, undefined, this.kind)); break;
				case 'R': indexGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Index, uri, Status.INDEX_RENAMED, useIcons, renameUri, this.kind)); break;
				case 'C': indexGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.Index, uri, Status.INDEX_COPIED, useIcons, renameUri, this.kind)); break;
			}

			switch (raw.y) {
				case 'M': workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.MODIFIED, useIcons, renameUri, this.kind)); break;
				case 'D': workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.DELETED, useIcons, renameUri, this.kind)); break;
				case 'A': workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.INTENT_TO_ADD, useIcons, renameUri, this.kind)); break;
				case 'R': workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.INTENT_TO_RENAME, useIcons, renameUri, this.kind)); break;
				case 'T': workingTreeGroup.push(new Resource(this.resourceCommandResolver, ResourceGroupType.WorkingTree, uri, Status.TYPE_CHANGED, useIcons, renameUri, this.kind)); break;
			}

			return undefined;
		});

		return { indexGroup, mergeGroup, untrackedGroup, workingTreeGroup };
	}

	private setCountBadge(): void {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const countBadge = config.get<'all' | 'tracked' | 'off'>('countBadge');
		const untrackedChanges = config.get<'mixed' | 'separate' | 'hidden'>('untrackedChanges');

		let count =
			this.mergeGroup.resourceStates.length +
			this.indexGroup.resourceStates.length +
			this.workingTreeGroup.resourceStates.length;

		switch (countBadge) {
			case 'off': count = 0; break;
			case 'tracked':
				if (untrackedChanges === 'mixed') {
					count -= this.workingTreeGroup.resourceStates.filter(r => r.type === Status.UNTRACKED || r.type === Status.IGNORED).length;
				}
				break;
			case 'all':
				if (untrackedChanges === 'separate') {
					count += this.untrackedGroup.resourceStates.length;
				}
				break;
		}

		this._sourceControl.count = count;
	}

	private async getRebaseCommit(): Promise<Commit | undefined> {
		const rebaseHeadPath = path.join(this.repository.root, '.git', 'REBASE_HEAD');
		const rebaseApplyPath = path.join(this.repository.root, '.git', 'rebase-apply');
		const rebaseMergePath = path.join(this.repository.root, '.git', 'rebase-merge');

		try {
			const [rebaseApplyExists, rebaseMergePathExists, rebaseHead] = await Promise.all([
				new Promise<boolean>(c => fs.exists(rebaseApplyPath, c)),
				new Promise<boolean>(c => fs.exists(rebaseMergePath, c)),
				new Promise<string>((c, e) => fs.readFile(rebaseHeadPath, 'utf8', (err, result) => err ? e(err) : c(result)))
			]);
			if (!rebaseApplyExists && !rebaseMergePathExists) {
				return undefined;
			}
			return await this.getCommit(rebaseHead.trim());
		} catch (err) {
			return undefined;
		}
	}

	private isMergeInProgress(): Promise<boolean> {
		const mergeHeadPath = path.join(this.repository.root, '.git', 'MERGE_HEAD');
		return new Promise<boolean>(resolve => fs.exists(mergeHeadPath, resolve));
	}

	private isCherryPickInProgress(): Promise<boolean> {
		const cherryPickHeadPath = path.join(this.repository.root, '.git', 'CHERRY_PICK_HEAD');
		return new Promise<boolean>(resolve => fs.exists(cherryPickHeadPath, resolve));
	}

	private async maybeAutoStash<T>(runOperation: () => Promise<T>): Promise<T> {
		const config = workspace.getConfiguration('git', Uri.file(this.root));
		const shouldAutoStash = config.get<boolean>('autoStash')
			&& this.repository.git.compareGitVersionTo('2.27.0') < 0
			&& (this.indexGroup.resourceStates.length > 0
				|| this.workingTreeGroup.resourceStates.some(
					r => r.type !== Status.UNTRACKED && r.type !== Status.IGNORED));

		if (!shouldAutoStash) {
			return await runOperation();
		}

		await this.repository.createStash(undefined, true);
		try {
			const result = await runOperation();
			return result;
		} finally {
			await this.repository.popStash(undefined, { reinstateStagedChanges: true });
		}
	}

	private onFileChange(_uri: Uri): void {
		const config = workspace.getConfiguration('git');
		const autorefresh = config.get<boolean>('autorefresh');

		if (!autorefresh) {
			this.logger.trace('[Repository][onFileChange] Skip running git status because autorefresh setting is disabled.');
			return;
		}

		if (this.isRepositoryHuge) {
			this.logger.trace('[Repository][onFileChange] Skip running git status because repository is huge.');
			return;
		}

		if (!this.operations.isIdle()) {
			this.logger.trace('[Repository][onFileChange] Skip running git status because an operation is running.');
			return;
		}

		this.eventuallyUpdateWhenIdleAndWait();
	}

	@debounce(1000)
	private eventuallyUpdateWhenIdleAndWait(): void {
		this.updateWhenIdleAndWait();
	}

	@throttle
	private async updateWhenIdleAndWait(): Promise<void> {
		await this.whenIdleAndFocused();
		await this.status();
		await timeout(5000);
	}

	async whenIdleAndFocused(): Promise<void> {
		while (true) {
			if (!this.operations.isIdle()) {
				await eventToPromise(this.onDidRunOperation);
				continue;
			}

			if (!window.state.focused) {
				const onDidFocusWindow = filterEvent(window.onDidChangeWindowState, e => e.focused);
				await eventToPromise(onDidFocusWindow);
				continue;
			}

			return;
		}
	}

	get headLabel(): string {
		const HEAD = this.HEAD;

		if (!HEAD) {
			return '';
		}

		const head = HEAD.name || (HEAD.commit || '').substr(0, 8);

		return head
			+ (this.workingTreeGroup.resourceStates.length + this.untrackedGroup.resourceStates.length > 0 ? '*' : '')
			+ (this.indexGroup.resourceStates.length > 0 ? '+' : '')
			+ (this.mergeInProgress || !!this.rebaseCommit ? '!' : '');
	}

	get syncLabel(): string {
		if (!this.HEAD
			|| !this.HEAD.name
			|| !this.HEAD.commit
			|| !this.HEAD.upstream
			|| !(this.HEAD.ahead || this.HEAD.behind)
		) {
			return '';
		}

		const remoteName = this.HEAD && this.HEAD.remote || this.HEAD.upstream.remote;
		const remote = this.remotes.find(r => r.name === remoteName);

		if (remote && remote.isReadOnly) {
			return `${this.HEAD.behind}↓`;
		}

		return `${this.HEAD.behind}↓ ${this.HEAD.ahead}↑`;
	}

	get syncTooltip(): string {
		if (!this.HEAD
			|| !this.HEAD.name
			|| !this.HEAD.commit
			|| !this.HEAD.upstream
			|| !(this.HEAD.ahead || this.HEAD.behind)
		) {
			return l10n.t('Synchronize Changes');
		}

		const remoteName = this.HEAD && this.HEAD.remote || this.HEAD.upstream.remote;
		const remote = this.remotes.find(r => r.name === remoteName);

		if ((remote && remote.isReadOnly) || !this.HEAD.ahead) {
			return l10n.t('Pull {0} commits from {1}/{2}', this.HEAD.behind!, this.HEAD.upstream.remote, this.HEAD.upstream.name);
		} else if (!this.HEAD.behind) {
			return l10n.t('Push {0} commits to {1}/{2}', this.HEAD.ahead, this.HEAD.upstream.remote, this.HEAD.upstream.name);
		} else {
			return l10n.t('Pull {0} and push {1} commits between {2}/{3}', this.HEAD.behind, this.HEAD.ahead, this.HEAD.upstream.remote, this.HEAD.upstream.name);
		}
	}

	private updateInputBoxPlaceholder(): void {
		const branchName = this.headShortName;

		if (branchName) {
			// '{0}' will be replaced by the corresponding key-command later in the process, which is why it needs to stay.
			this._sourceControl.inputBox.placeholder = l10n.t('Message ({0} to commit on "{1}")', '{0}', branchName);
		} else {
			this._sourceControl.inputBox.placeholder = l10n.t('Message ({0} to commit)');
		}
	}

	private updateBranchProtectionMatchers(root: Uri): void {
		this.branchProtection.clear();

		for (const provider of this.branchProtectionProviderRegistry.getBranchProtectionProviders(root)) {
			for (const { remote, rules } of provider.provideBranchProtection()) {
				const matchers: BranchProtectionMatcher[] = [];

				for (const rule of rules) {
					const include = rule.include && rule.include.length !== 0 ? picomatch(rule.include) : undefined;
					const exclude = rule.exclude && rule.exclude.length !== 0 ? picomatch(rule.exclude) : undefined;

					if (include || exclude) {
						matchers.push({ include, exclude });
					}
				}

				if (matchers.length !== 0) {
					this.branchProtection.set(remote, matchers);
				}
			}
		}

		this._onDidChangeBranchProtection.fire();
	}

	private optimisticUpdateEnabled(): boolean {
		const config = workspace.getConfiguration('git', Uri.file(this.root));
		return config.get<boolean>('optimisticUpdate') === true;
	}

	private async handleTagConflict(remote: string | undefined, raw: string): Promise<boolean> {
		// Ensure there is a remote
		remote = remote ?? this.HEAD?.upstream?.remote;
		if (!remote) {
			throw new Error('Unable to resolve tag conflict due to missing remote.');
		}

		// Extract tag names from message
		const tags: string[] = [];
		for (const match of raw.matchAll(/^ ! \[rejected\]\s+([^\s]+)\s+->\s+([^\s]+)\s+\(would clobber existing tag\)$/gm)) {
			if (match.length === 3) {
				tags.push(match[1]);
			}
		}
		if (tags.length === 0) {
			throw new Error(`Unable to extract tag names from error message: ${raw}`);
		}

		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const replaceTagsWhenPull = config.get<boolean>('replaceTagsWhenPull', false) === true;

		if (!replaceTagsWhenPull) {
			// Notification
			const replaceLocalTags = l10n.t('Replace Local Tag(s)');
			const replaceLocalTagsAlways = l10n.t('Always Replace Local Tag(s)');
			const message = l10n.t('Unable to pull from remote repository due to conflicting tag(s): {0}. Would you like to resolve the conflict by replacing the local tag(s)?', tags.join(', '));
			const choice = await window.showErrorMessage(message, { modal: true }, replaceLocalTags, replaceLocalTagsAlways);

			if (choice !== replaceLocalTags && choice !== replaceLocalTagsAlways) {
				return false;
			}

			if (choice === replaceLocalTagsAlways) {
				await config.update('replaceTagsWhenPull', true, true);
			}
		}

		// Force fetch tags
		await this.repository.fetchTags({ remote, tags, force: true });
		return true;
	}

	public isBranchProtected(branch = this.HEAD): boolean {
		if (branch?.name) {
			// Default branch protection (settings)
			const defaultBranchProtectionMatcher = this.branchProtection.get('');
			if (defaultBranchProtectionMatcher?.length === 1 &&
				defaultBranchProtectionMatcher[0].include &&
				defaultBranchProtectionMatcher[0].include(branch.name)) {
				return true;
			}

			if (branch.upstream?.remote) {
				// Branch protection (contributed)
				const remoteBranchProtectionMatcher = this.branchProtection.get(branch.upstream.remote);
				if (remoteBranchProtectionMatcher && remoteBranchProtectionMatcher?.length !== 0) {
					return remoteBranchProtectionMatcher.some(matcher => {
						const include = matcher.include ? matcher.include(branch.name!) : true;
						const exclude = matcher.exclude ? matcher.exclude(branch.name!) : false;

						return include && !exclude;
					});
				}
			}
		}

		return false;
	}

	async getUnpublishedCommits(): Promise<Set<string>> {
		if (this.unpublishedCommits) {
			return this.unpublishedCommits;
		}

		if (!this.HEAD?.name) {
			this.unpublishedCommits = new Set<string>();
			return this.unpublishedCommits;
		}

		if (this.HEAD.upstream) {
			// Upstream
			if (this.HEAD.ahead === 0) {
				this.unpublishedCommits = new Set<string>();
			} else {
				const ref1 = `${this.HEAD.upstream.remote}/${this.HEAD.upstream.name}`;
				const ref2 = this.HEAD.name;

				const revList = await this.repository.revList(ref1, ref2);
				this.unpublishedCommits = new Set<string>(revList);
			}
		} else if (this.historyProvider.currentHistoryItemBaseRef) {
			// Base
			const ref1 = this.historyProvider.currentHistoryItemBaseRef.id;
			const ref2 = this.HEAD.name;

			const revList = await this.repository.revList(ref1, ref2);
			this.unpublishedCommits = new Set<string>(revList);
		} else {
			this.unpublishedCommits = new Set<string>();
		}

		return this.unpublishedCommits;
	}

	dispose(): void {
		this.disposables = dispose(this.disposables);
	}
}

export class StagedResourceQuickDiffProvider implements QuickDiffProvider {
	readonly label = l10n.t('Git Local Changes (Index)');

	constructor(
		private readonly _repository: Repository,
		private readonly logger: LogOutputChannel
	) { }

	async provideOriginalResource(uri: Uri): Promise<Uri | undefined> {
		this.logger.trace(`[StagedResourceQuickDiffProvider][provideOriginalResource] Resource: ${uri.toString()}`);

		if (uri.scheme !== 'file') {
			this.logger.trace(`[StagedResourceQuickDiffProvider][provideOriginalResource] Resource is not a file: ${uri.scheme}`);
			return undefined;
		}

		// Ignore symbolic links
		const stat = await workspace.fs.stat(uri);
		if ((stat.type & FileType.SymbolicLink) !== 0) {
			this.logger.trace(`[StagedResourceQuickDiffProvider][provideOriginalResource] Resource is a symbolic link: ${uri.toString()}`);
			return undefined;
		}

		// Ignore resources that are not in the index group
		if (!this._repository.indexGroup.resourceStates.some(r => pathEquals(r.resourceUri.fsPath, uri.fsPath))) {
			this.logger.trace(`[StagedResourceQuickDiffProvider][provideOriginalResource] Resource is not part of a index group: ${uri.toString()}`);
			return undefined;
		}

		const originalResource = toGitUri(uri, 'HEAD', { replaceFileExtension: true });
		this.logger.trace(`[StagedResourceQuickDiffProvider][provideOriginalResource] Original resource: ${originalResource.toString()}`);
		return originalResource;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/repositoryCache.ts]---
Location: vscode-main/extensions/git/src/repositoryCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LogOutputChannel, Memento, workspace } from 'vscode';
import { LRUCache } from './cache';
import { Remote } from './api/git';
import { isDescendant } from './util';

export interface RepositoryCacheInfo {
	workspacePath: string; // path of the workspace folder or workspace file
}

function isRepositoryCacheInfo(obj: unknown): obj is RepositoryCacheInfo {
	if (!obj || typeof obj !== 'object') {
		return false;
	}
	const rec = obj as Record<string, unknown>;
	return typeof rec.workspacePath === 'string';
}

export class RepositoryCache {

	private static readonly STORAGE_KEY = 'git.repositoryCache';
	private static readonly MAX_REPO_ENTRIES = 30; // Max repositories tracked
	private static readonly MAX_FOLDER_ENTRIES = 10; // Max folders per repository

	private normalizeRepoUrl(url: string): string {
		try {
			const trimmed = url.trim();
			return trimmed.replace(/(?:\.git)?\/*$/i, '');
		} catch {
			return url;
		}
	}

	// Outer LRU: repoUrl -> inner LRU (folderPathOrWorkspaceFile -> RepositoryCacheInfo).
	private readonly lru = new LRUCache<string, LRUCache<string, RepositoryCacheInfo>>(RepositoryCache.MAX_REPO_ENTRIES);

	constructor(public readonly _globalState: Memento, private readonly _logger: LogOutputChannel) {
		this.load();
	}

	// Exposed for testing
	protected get _workspaceFile() {
		return workspace.workspaceFile;
	}

	// Exposed for testing
	protected get _workspaceFolders() {
		return workspace.workspaceFolders;
	}

	/**
	 * Associate a repository remote URL with a local workspace folder or workspace file.
	 * Re-associating bumps recency and persists the updated LRU state.
	 * @param repoUrl Remote repository URL (e.g. https://github.com/owner/repo.git)
	 * @param rootPath Root path of the local repo clone.
	 */
	set(repoUrl: string, rootPath: string): void {
		const key = this.normalizeRepoUrl(repoUrl);
		let foldersLru = this.lru.get(key);
		if (!foldersLru) {
			foldersLru = new LRUCache<string, RepositoryCacheInfo>(RepositoryCache.MAX_FOLDER_ENTRIES);
		}
		const folderPathOrWorkspaceFile: string | undefined = this._findWorkspaceForRepo(rootPath);
		if (!folderPathOrWorkspaceFile) {
			return;
		}

		foldersLru.set(folderPathOrWorkspaceFile, {
			workspacePath: folderPathOrWorkspaceFile
		}); // touch entry
		this.lru.set(key, foldersLru);
		this.save();
	}

	private _findWorkspaceForRepo(rootPath: string): string | undefined {
		// If the current workspace is a workspace file, use that. Otherwise, find the workspace folder that contains the rootUri
		let folderPathOrWorkspaceFile: string | undefined;
		try {
			if (this._workspaceFile) {
				folderPathOrWorkspaceFile = this._workspaceFile.fsPath;
			} else if (this._workspaceFolders && this._workspaceFolders.length) {
				const sorted = [...this._workspaceFolders].sort((a, b) => b.uri.fsPath.length - a.uri.fsPath.length);
				for (const folder of sorted) {
					const folderPath = folder.uri.fsPath;
					if (isDescendant(folderPath, rootPath) || isDescendant(rootPath, folderPath)) {
						folderPathOrWorkspaceFile = folderPath;
						break;
					}
				}
			}
			return folderPathOrWorkspaceFile;
		} catch {
			return;
		}

	}

	update(addedRemotes: Remote[], removedRemotes: Remote[], rootPath: string): void {
		for (const remote of removedRemotes) {
			const url = remote.fetchUrl;
			if (!url) {
				continue;
			}
			const relatedWorkspace = this._findWorkspaceForRepo(rootPath);
			if (relatedWorkspace) {
				this.delete(url, relatedWorkspace);
			}
		}

		for (const remote of addedRemotes) {
			const url = remote.fetchUrl;
			if (!url) {
				continue;
			}
			this.set(url, rootPath);
		}
	}

	/**
	 * We should possibly support converting between ssh remotes and http remotes.
	 */
	get(repoUrl: string): RepositoryCacheInfo[] | undefined {
		const key = this.normalizeRepoUrl(repoUrl);
		const inner = this.lru.get(key);
		return inner ? Array.from(inner.values()) : undefined;
	}

	delete(repoUrl: string, folderPathOrWorkspaceFile: string) {
		const key = this.normalizeRepoUrl(repoUrl);
		const inner = this.lru.get(key);
		if (!inner) {
			return;
		}
		if (!inner.remove(folderPathOrWorkspaceFile)) {
			return;
		}
		if (inner.size === 0) {
			this.lru.remove(key);
		} else {
			// Re-set to bump outer LRU recency after modification
			this.lru.set(key, inner);
		}
		this.save();
	}

	private load(): void {
		try {
			const raw = this._globalState.get<[string, [string, RepositoryCacheInfo][]][]>(RepositoryCache.STORAGE_KEY);
			if (!Array.isArray(raw)) {
				return;
			}
			for (const [repo, storedFolders] of raw) {
				if (typeof repo !== 'string' || !Array.isArray(storedFolders)) {
					continue;
				}
				const inner = new LRUCache<string, RepositoryCacheInfo>(RepositoryCache.MAX_FOLDER_ENTRIES);
				for (const entry of storedFolders) {
					if (!Array.isArray(entry) || entry.length !== 2) {
						continue;
					}
					const [folderPath, info] = entry;
					if (typeof folderPath !== 'string' || !isRepositoryCacheInfo(info)) {
						continue;
					}

					inner.set(folderPath, info);
				}
				if (inner.size) {
					this.lru.set(repo, inner);
				}
			}

		} catch {
			this._logger.warn('[CachedRepositories][load] Failed to load cached repositories from global state.');
		}
	}

	private save(): void {
		// Serialize as [repoUrl, [folderPathOrWorkspaceFile, RepositoryCacheInfo][]] preserving outer LRU order.
		const serialized: [string, [string, RepositoryCacheInfo][]][] = [];
		for (const [repo, inner] of this.lru) {
			const folders: [string, RepositoryCacheInfo][] = [];
			for (const [folder, info] of inner) {
				folders.push([folder, info]);
			}
			serialized.push([repo, folders]);
		}
		void this._globalState.update(RepositoryCache.STORAGE_KEY, serialized);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/ssh-askpass-empty.sh]---
Location: vscode-main/extensions/git/src/ssh-askpass-empty.sh

```bash
#!/bin/sh
echo ''
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/ssh-askpass.sh]---
Location: vscode-main/extensions/git/src/ssh-askpass.sh

```bash
#!/bin/sh
VSCODE_GIT_ASKPASS_PIPE=`mktemp`
ELECTRON_RUN_AS_NODE="1" VSCODE_GIT_ASKPASS_PIPE="$VSCODE_GIT_ASKPASS_PIPE" VSCODE_GIT_ASKPASS_TYPE="ssh" "$VSCODE_GIT_ASKPASS_NODE" "$VSCODE_GIT_ASKPASS_MAIN" $VSCODE_GIT_ASKPASS_EXTRA_ARGS $*
cat $VSCODE_GIT_ASKPASS_PIPE
rm $VSCODE_GIT_ASKPASS_PIPE
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/staging.ts]---
Location: vscode-main/extensions/git/src/staging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument, Range, Selection, Uri, TextEditor, TextEditorDiffInformation } from 'vscode';
import { fromGitUri, isGitUri } from './uri';

export interface LineChange {
	readonly originalStartLineNumber: number;
	readonly originalEndLineNumber: number;
	readonly modifiedStartLineNumber: number;
	readonly modifiedEndLineNumber: number;
}

export function applyLineChanges(original: TextDocument, modified: TextDocument, diffs: LineChange[]): string {
	const result: string[] = [];
	let currentLine = 0;

	for (const diff of diffs) {
		const isInsertion = diff.originalEndLineNumber === 0;
		const isDeletion = diff.modifiedEndLineNumber === 0;

		let endLine = isInsertion ? diff.originalStartLineNumber : diff.originalStartLineNumber - 1;
		let endCharacter = 0;

		// if this is a deletion at the very end of the document,then we need to account
		// for a newline at the end of the last line which may have been deleted
		// https://github.com/microsoft/vscode/issues/59670
		if (isDeletion && diff.originalEndLineNumber === original.lineCount) {
			endLine -= 1;
			endCharacter = original.lineAt(endLine).range.end.character;
		}

		result.push(original.getText(new Range(currentLine, 0, endLine, endCharacter)));

		if (!isDeletion) {
			let fromLine = diff.modifiedStartLineNumber - 1;
			let fromCharacter = 0;

			// if this is an insertion at the very end of the document,
			// then we must start the next range after the last character of the
			// previous line, in order to take the correct eol
			if (isInsertion && diff.originalStartLineNumber === original.lineCount) {
				fromLine -= 1;
				fromCharacter = modified.lineAt(fromLine).range.end.character;
			}

			result.push(modified.getText(new Range(fromLine, fromCharacter, diff.modifiedEndLineNumber, 0)));
		}

		currentLine = isInsertion ? diff.originalStartLineNumber : diff.originalEndLineNumber;
	}

	result.push(original.getText(new Range(currentLine, 0, original.lineCount, 0)));

	return result.join('');
}

export function toLineRanges(selections: readonly Selection[], textDocument: TextDocument): Range[] {
	const lineRanges = selections.map(s => {
		const startLine = textDocument.lineAt(s.start.line);
		const endLine = textDocument.lineAt(s.end.line);
		return new Range(startLine.range.start, endLine.range.end);
	});

	lineRanges.sort((a, b) => a.start.line - b.start.line);

	const result = lineRanges.reduce((result, l) => {
		if (result.length === 0) {
			result.push(l);
			return result;
		}

		const [last, ...rest] = result;
		const intersection = l.intersection(last);

		if (intersection) {
			return [intersection, ...rest];
		}

		if (l.start.line === last.end.line + 1) {
			const merge = new Range(last.start, l.end);
			return [merge, ...rest];
		}

		return [l, ...result];
	}, [] as Range[]);

	result.reverse();

	return result;
}

export function getModifiedRange(textDocument: TextDocument, diff: LineChange): Range {
	if (diff.modifiedEndLineNumber === 0) {
		if (diff.modifiedStartLineNumber === 0) {
			return new Range(textDocument.lineAt(diff.modifiedStartLineNumber).range.end, textDocument.lineAt(diff.modifiedStartLineNumber).range.start);
		} else if (textDocument.lineCount === diff.modifiedStartLineNumber) {
			return new Range(textDocument.lineAt(diff.modifiedStartLineNumber - 1).range.end, textDocument.lineAt(diff.modifiedStartLineNumber - 1).range.end);
		} else {
			return new Range(textDocument.lineAt(diff.modifiedStartLineNumber - 1).range.end, textDocument.lineAt(diff.modifiedStartLineNumber).range.start);
		}
	} else {
		return new Range(textDocument.lineAt(diff.modifiedStartLineNumber - 1).range.start, textDocument.lineAt(diff.modifiedEndLineNumber - 1).range.end);
	}
}

export function intersectDiffWithRange(textDocument: TextDocument, diff: LineChange, range: Range): LineChange | null {
	const modifiedRange = getModifiedRange(textDocument, diff);
	const intersection = range.intersection(modifiedRange);

	if (!intersection) {
		return null;
	}

	if (diff.modifiedEndLineNumber === 0) {
		return diff;
	} else {
		const modifiedStartLineNumber = intersection.start.line + 1;
		const modifiedEndLineNumber = intersection.end.line + 1;

		// heuristic: same number of lines on both sides, let's assume line by line
		if (diff.originalEndLineNumber - diff.originalStartLineNumber === diff.modifiedEndLineNumber - diff.modifiedStartLineNumber) {
			const delta = modifiedStartLineNumber - diff.modifiedStartLineNumber;
			const length = modifiedEndLineNumber - modifiedStartLineNumber;

			return {
				originalStartLineNumber: diff.originalStartLineNumber + delta,
				originalEndLineNumber: diff.originalStartLineNumber + delta + length,
				modifiedStartLineNumber,
				modifiedEndLineNumber
			};
		} else {
			return {
				originalStartLineNumber: diff.originalStartLineNumber,
				originalEndLineNumber: diff.originalEndLineNumber,
				modifiedStartLineNumber,
				modifiedEndLineNumber
			};
		}
	}
}

export function invertLineChange(diff: LineChange): LineChange {
	return {
		modifiedStartLineNumber: diff.originalStartLineNumber,
		modifiedEndLineNumber: diff.originalEndLineNumber,
		originalStartLineNumber: diff.modifiedStartLineNumber,
		originalEndLineNumber: diff.modifiedEndLineNumber
	};
}

export function toLineChanges(diffInformation: TextEditorDiffInformation): LineChange[] {
	return diffInformation.changes.map(x => {
		let originalStartLineNumber: number;
		let originalEndLineNumber: number;
		let modifiedStartLineNumber: number;
		let modifiedEndLineNumber: number;

		if (x.original.startLineNumber === x.original.endLineNumberExclusive) {
			// Insertion
			originalStartLineNumber = x.original.startLineNumber - 1;
			originalEndLineNumber = 0;
		} else {
			originalStartLineNumber = x.original.startLineNumber;
			originalEndLineNumber = x.original.endLineNumberExclusive - 1;
		}

		if (x.modified.startLineNumber === x.modified.endLineNumberExclusive) {
			// Deletion
			modifiedStartLineNumber = x.modified.startLineNumber - 1;
			modifiedEndLineNumber = 0;
		} else {
			modifiedStartLineNumber = x.modified.startLineNumber;
			modifiedEndLineNumber = x.modified.endLineNumberExclusive - 1;
		}

		return {
			originalStartLineNumber,
			originalEndLineNumber,
			modifiedStartLineNumber,
			modifiedEndLineNumber
		};
	});
}

export function compareLineChanges(a: LineChange, b: LineChange): number {
	let result = a.modifiedStartLineNumber - b.modifiedStartLineNumber;

	if (result !== 0) {
		return result;
	}

	result = a.modifiedEndLineNumber - b.modifiedEndLineNumber;

	if (result !== 0) {
		return result;
	}

	result = a.originalStartLineNumber - b.originalStartLineNumber;

	if (result !== 0) {
		return result;
	}

	return a.originalEndLineNumber - b.originalEndLineNumber;
}

export function getIndexDiffInformation(textEditor: TextEditor): TextEditorDiffInformation | undefined {
	// Diff Editor (Index)
	return textEditor.diffInformation?.find(diff =>
		diff.original && isGitUri(diff.original) && fromGitUri(diff.original).ref === 'HEAD' &&
		diff.modified && isGitUri(diff.modified) && fromGitUri(diff.modified).ref === '');
}

export function getWorkingTreeDiffInformation(textEditor: TextEditor): TextEditorDiffInformation | undefined {
	// Working tree diff information. Diff Editor (Working Tree) -> Text Editor
	return getDiffInformation(textEditor, '~') ?? getDiffInformation(textEditor, '');
}

export function getWorkingTreeAndIndexDiffInformation(textEditor: TextEditor): TextEditorDiffInformation | undefined {
	return getDiffInformation(textEditor, 'HEAD');
}

function getDiffInformation(textEditor: TextEditor, ref: string): TextEditorDiffInformation | undefined {
	return textEditor.diffInformation?.find(diff => diff.original && isGitUri(diff.original) && fromGitUri(diff.original).ref === ref);
}

export interface DiffEditorSelectionHunkToolbarContext {
	mapping: unknown;
	/**
	 * The original text with the selected modified changes applied.
	*/
	originalWithModifiedChanges: string;

	modifiedUri: Uri;
	originalUri: Uri;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/statusbar.ts]---
Location: vscode-main/extensions/git/src/statusbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, Command, EventEmitter, Event, workspace, Uri, l10n } from 'vscode';
import { Repository } from './repository';
import { anyEvent, dispose, filterEvent } from './util';
import { Branch, RefType, RemoteSourcePublisher } from './api/git';
import { IRemoteSourcePublisherRegistry } from './remotePublisher';
import { CheckoutOperation, CheckoutTrackingOperation, OperationKind } from './operation';

interface CheckoutStatusBarState {
	readonly isCheckoutRunning: boolean;
	readonly isCommitRunning: boolean;
	readonly isSyncRunning: boolean;
}

class CheckoutStatusBar {

	private _onDidChange = new EventEmitter<void>();
	get onDidChange(): Event<void> { return this._onDidChange.event; }
	private disposables: Disposable[] = [];

	private _state: CheckoutStatusBarState;
	private get state() { return this._state; }
	private set state(state: CheckoutStatusBarState) {
		this._state = state;
		this._onDidChange.fire();
	}

	constructor(private repository: Repository) {
		this._state = {
			isCheckoutRunning: false,
			isCommitRunning: false,
			isSyncRunning: false
		};

		repository.onDidChangeOperations(this.onDidChangeOperations, this, this.disposables);
		repository.onDidRunGitStatus(this._onDidChange.fire, this._onDidChange, this.disposables);
		repository.onDidChangeBranchProtection(this._onDidChange.fire, this._onDidChange, this.disposables);
	}

	get command(): Command | undefined {
		const operationData = [
			...this.repository.operations.getOperations(OperationKind.Checkout) as CheckoutOperation[],
			...this.repository.operations.getOperations(OperationKind.CheckoutTracking) as CheckoutTrackingOperation[]
		];

		const rebasing = !!this.repository.rebaseCommit;
		const label = operationData[0]?.refLabel ?? `${this.repository.headLabel}${rebasing ? ` (${l10n.t('Rebasing')})` : ''}`;
		const command = (this.state.isCheckoutRunning || this.state.isCommitRunning || this.state.isSyncRunning) ? '' : 'git.checkout';

		return {
			command,
			tooltip: `${label}, ${this.getTooltip()}`,
			title: `${this.getIcon()} ${label}`,
			arguments: [this.repository.sourceControl]
		};
	}

	private getIcon(): string {
		if (!this.repository.HEAD) {
			return '';
		}

		// Checkout
		if (this.state.isCheckoutRunning) {
			return '$(loading~spin)';
		}

		// Branch
		if (this.repository.HEAD.type === RefType.Head && this.repository.HEAD.name) {
			switch (true) {
				case this.repository.isBranchProtected():
					return '$(lock)';
				case this.repository.mergeInProgress || !!this.repository.rebaseCommit:
					return '$(git-branch-conflicts)';
				case this.repository.indexGroup.resourceStates.length > 0:
					return '$(git-branch-staged-changes)';
				case this.repository.workingTreeGroup.resourceStates.length + this.repository.untrackedGroup.resourceStates.length > 0:
					return '$(git-branch-changes)';
				default:
					return '$(git-branch)';
			}
		}

		// Tag
		if (this.repository.HEAD.type === RefType.Tag) {
			return '$(tag)';
		}

		// Commit
		return '$(git-commit)';
	}

	private getTooltip(): string {
		if (this.state.isCheckoutRunning) {
			return l10n.t('Checking Out Branch/Tag...');
		}

		if (this.state.isCommitRunning) {
			return l10n.t('Committing Changes...');

		}

		if (this.state.isSyncRunning) {
			return l10n.t('Synchronizing Changes...');
		}

		return l10n.t('Checkout Branch/Tag...');
	}

	private onDidChangeOperations(): void {
		const isCommitRunning = this.repository.operations.isRunning(OperationKind.Commit);
		const isCheckoutRunning = this.repository.operations.isRunning(OperationKind.Checkout) ||
			this.repository.operations.isRunning(OperationKind.CheckoutTracking);
		const isSyncRunning = this.repository.operations.isRunning(OperationKind.Sync) ||
			this.repository.operations.isRunning(OperationKind.Push) ||
			this.repository.operations.isRunning(OperationKind.Pull);

		this.state = { ...this.state, isCheckoutRunning, isCommitRunning, isSyncRunning };
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
	}
}

interface SyncStatusBarState {
	readonly enabled: boolean;
	readonly isCheckoutRunning: boolean;
	readonly isCommitRunning: boolean;
	readonly isSyncRunning: boolean;
	readonly hasRemotes: boolean;
	readonly HEAD: Branch | undefined;
	readonly remoteSourcePublishers: RemoteSourcePublisher[];
}

class SyncStatusBar {

	private _onDidChange = new EventEmitter<void>();
	get onDidChange(): Event<void> { return this._onDidChange.event; }
	private disposables: Disposable[] = [];

	private _state: SyncStatusBarState;
	private get state() { return this._state; }
	private set state(state: SyncStatusBarState) {
		this._state = state;
		this._onDidChange.fire();
	}

	constructor(private repository: Repository, private remoteSourcePublisherRegistry: IRemoteSourcePublisherRegistry) {
		this._state = {
			enabled: true,
			isCheckoutRunning: false,
			isCommitRunning: false,
			isSyncRunning: false,
			hasRemotes: false,
			HEAD: undefined,
			remoteSourcePublishers: remoteSourcePublisherRegistry.getRemoteSourcePublishers()
		};

		repository.onDidRunGitStatus(this.onDidRunGitStatus, this, this.disposables);
		repository.onDidChangeOperations(this.onDidChangeOperations, this, this.disposables);

		anyEvent(remoteSourcePublisherRegistry.onDidAddRemoteSourcePublisher, remoteSourcePublisherRegistry.onDidRemoveRemoteSourcePublisher)
			(this.onDidChangeRemoteSourcePublishers, this, this.disposables);

		const onEnablementChange = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.enableStatusBarSync'));
		onEnablementChange(this.updateEnablement, this, this.disposables);
		this.updateEnablement();
	}

	private updateEnablement(): void {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const enabled = config.get<boolean>('enableStatusBarSync', true);

		this.state = { ... this.state, enabled };
	}

	private onDidChangeOperations(): void {
		const isCommitRunning = this.repository.operations.isRunning(OperationKind.Commit);
		const isCheckoutRunning = this.repository.operations.isRunning(OperationKind.Checkout) ||
			this.repository.operations.isRunning(OperationKind.CheckoutTracking);
		const isSyncRunning = this.repository.operations.isRunning(OperationKind.Sync) ||
			this.repository.operations.isRunning(OperationKind.Push) ||
			this.repository.operations.isRunning(OperationKind.Pull);

		this.state = { ...this.state, isCheckoutRunning, isCommitRunning, isSyncRunning };
	}

	private onDidRunGitStatus(): void {
		this.state = {
			...this.state,
			hasRemotes: this.repository.remotes.length > 0,
			HEAD: this.repository.HEAD
		};
	}

	private onDidChangeRemoteSourcePublishers(): void {
		this.state = {
			...this.state,
			remoteSourcePublishers: this.remoteSourcePublisherRegistry.getRemoteSourcePublishers()
		};
	}

	get command(): Command | undefined {
		if (!this.state.enabled) {
			return;
		}

		if (!this.state.hasRemotes) {
			if (this.state.remoteSourcePublishers.length === 0) {
				return;
			}

			const command = (this.state.isCheckoutRunning || this.state.isCommitRunning) ? '' : 'git.publish';
			const tooltip =
				this.state.isCheckoutRunning ? l10n.t('Checking Out Changes...') :
					this.state.isCommitRunning ? l10n.t('Committing Changes...') :
						this.state.remoteSourcePublishers.length === 1
							? l10n.t('Publish to {0}', this.state.remoteSourcePublishers[0].name)
							: l10n.t('Publish to...');

			return {
				command,
				title: `$(cloud-upload)`,
				tooltip,
				arguments: [this.repository.sourceControl]
			};
		}

		const HEAD = this.state.HEAD;
		let icon = '$(sync)';
		let text = '';
		let command = '';
		let tooltip = '';

		if (HEAD && HEAD.name && HEAD.commit) {
			if (HEAD.upstream) {
				if (HEAD.ahead || HEAD.behind) {
					text += this.repository.syncLabel;
				}

				command = 'git.sync';
				tooltip = this.repository.syncTooltip;
			} else {
				icon = '$(cloud-upload)';
				command = 'git.publish';
				tooltip = l10n.t('Publish Branch');
			}
		} else {
			command = '';
			tooltip = '';
		}

		if (this.state.isCheckoutRunning) {
			command = '';
			tooltip = l10n.t('Checking Out Changes...');
		}

		if (this.state.isCommitRunning) {
			command = '';
			tooltip = l10n.t('Committing Changes...');
		}

		if (this.state.isSyncRunning) {
			icon = '$(sync~spin)';
			command = '';
			tooltip = l10n.t('Synchronizing Changes...');
		}

		return {
			command,
			title: [icon, text].join(' ').trim(),
			tooltip,
			arguments: [this.repository.sourceControl]
		};
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
	}
}

export class StatusBarCommands {

	readonly onDidChange: Event<void>;

	private syncStatusBar: SyncStatusBar;
	private checkoutStatusBar: CheckoutStatusBar;
	private disposables: Disposable[] = [];

	constructor(repository: Repository, remoteSourcePublisherRegistry: IRemoteSourcePublisherRegistry) {
		this.syncStatusBar = new SyncStatusBar(repository, remoteSourcePublisherRegistry);
		this.checkoutStatusBar = new CheckoutStatusBar(repository);
		this.onDidChange = anyEvent(this.syncStatusBar.onDidChange, this.checkoutStatusBar.onDidChange);
	}

	get commands(): Command[] {
		return [this.checkoutStatusBar.command, this.syncStatusBar.command]
			.filter((c): c is Command => !!c);
	}

	dispose(): void {
		this.syncStatusBar.dispose();
		this.checkoutStatusBar.dispose();
		this.disposables = dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/terminal.ts]---
Location: vscode-main/extensions/git/src/terminal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, l10n, LogOutputChannel, TerminalShellExecutionEndEvent, window, workspace } from 'vscode';
import { dispose, filterEvent, IDisposable } from './util';
import { Model } from './model';

export interface ITerminalEnvironmentProvider {
	featureDescription?: string;
	getTerminalEnv(): { [key: string]: string };
}

export class TerminalEnvironmentManager {

	private readonly disposable: IDisposable;

	constructor(private readonly context: ExtensionContext, private readonly envProviders: (ITerminalEnvironmentProvider | undefined)[]) {
		this.disposable = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git'))
			(this.refresh, this);

		this.refresh();
	}

	private refresh(): void {
		const config = workspace.getConfiguration('git', null);
		this.context.environmentVariableCollection.clear();

		if (!config.get<boolean>('enabled', true)) {
			return;
		}

		const features: string[] = [];
		for (const envProvider of this.envProviders) {
			const terminalEnv = envProvider?.getTerminalEnv() ?? {};

			for (const name of Object.keys(terminalEnv)) {
				this.context.environmentVariableCollection.replace(name, terminalEnv[name]);
			}
			if (envProvider?.featureDescription && Object.keys(terminalEnv).length > 0) {
				features.push(envProvider.featureDescription);
			}
		}
		if (features.length) {
			this.context.environmentVariableCollection.description = l10n.t('Enables the following features: {0}', features.join(', '));
		}
	}

	dispose(): void {
		this.disposable.dispose();
	}
}

export class TerminalShellExecutionManager {
	private readonly subcommands = new Set<string>([
		'add', 'branch', 'checkout', 'cherry-pick', 'clean', 'commit', 'fetch', 'merge',
		'mv', 'rebase', 'reset', 'restore', 'revert', 'rm', 'pull', 'push', 'stash', 'switch']);

	private readonly disposables: IDisposable[] = [];

	constructor(
		private readonly model: Model,
		private readonly logger: LogOutputChannel
	) {
		window.onDidEndTerminalShellExecution(this.onDidEndTerminalShellExecution, this, this.disposables);
	}

	private onDidEndTerminalShellExecution(e: TerminalShellExecutionEndEvent): void {
		const { execution, exitCode, shellIntegration } = e;
		const [executable, subcommand] = execution.commandLine.value.split(/\s+/);
		const cwd = execution.cwd ?? shellIntegration.cwd;

		if (executable.toLowerCase() !== 'git' || !this.subcommands.has(subcommand?.toLowerCase()) || !cwd || exitCode !== 0) {
			return;
		}

		this.logger.trace(`[TerminalShellExecutionManager][onDidEndTerminalShellExecution] Matched git subcommand: ${subcommand}`);

		const repository = this.model.getRepository(cwd);
		if (!repository) {
			this.logger.trace(`[TerminalShellExecutionManager][onDidEndTerminalShellExecution] Unable to find repository for current working directory: ${cwd.toString()}`);
			return;
		}

		repository.status();
	}

	dispose(): void {
		dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/timelineProvider.ts]---
Location: vscode-main/extensions/git/src/timelineProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, ConfigurationChangeEvent, Disposable, Event, EventEmitter, ThemeIcon, Timeline, TimelineChangeEvent, TimelineItem, TimelineOptions, TimelineProvider, Uri, workspace, l10n, Command } from 'vscode';
import { Model } from './model';
import { Repository, Resource } from './repository';
import { debounce } from './decorators';
import { emojify, ensureEmojis } from './emoji';
import { CommandCenter } from './commands';
import { OperationKind, OperationResult } from './operation';
import { truncate } from './util';
import { provideSourceControlHistoryItemAvatar, provideSourceControlHistoryItemHoverCommands, provideSourceControlHistoryItemMessageLinks } from './historyItemDetailsProvider';
import { AvatarQuery, AvatarQueryCommit } from './api/git';
import { getCommitHover, getHoverCommitHashCommands, processHoverRemoteCommands } from './hover';

export class GitTimelineItem extends TimelineItem {
	static is(item: TimelineItem): item is GitTimelineItem {
		return item instanceof GitTimelineItem;
	}

	readonly ref: string;
	readonly previousRef: string;
	readonly message: string;

	constructor(
		ref: string,
		previousRef: string,
		message: string,
		timestamp: number,
		id: string,
		contextValue: string
	) {
		const index = message.indexOf('\n');
		const label = index !== -1 ? `${truncate(message, index, false)}` : message;

		super(label, timestamp);

		this.ref = ref;
		this.previousRef = previousRef;
		this.message = message;
		this.id = id;
		this.contextValue = contextValue;
	}

	get shortRef() {
		return this.shortenRef(this.ref);
	}

	get shortPreviousRef() {
		return this.shortenRef(this.previousRef);
	}

	private shortenRef(ref: string): string {
		if (ref === '' || ref === '~' || ref === 'HEAD') {
			return ref;
		}
		return ref.endsWith('^') ? `${ref.substr(0, 8)}^` : ref.substr(0, 8);
	}
}

export class GitTimelineProvider implements TimelineProvider {
	private _onDidChange = new EventEmitter<TimelineChangeEvent | undefined>();
	get onDidChange(): Event<TimelineChangeEvent | undefined> {
		return this._onDidChange.event;
	}

	readonly id = 'git-history';
	readonly label = l10n.t('Git History');

	private readonly disposable: Disposable;
	private providerDisposable: Disposable | undefined;

	private repo: Repository | undefined;
	private repoDisposable: Disposable | undefined;
	private repoOperationDate: Date | undefined;

	constructor(private readonly model: Model, private commands: CommandCenter) {
		this.disposable = Disposable.from(
			model.onDidOpenRepository(this.onRepositoriesChanged, this),
			workspace.onDidChangeConfiguration(this.onConfigurationChanged, this)
		);

		if (model.repositories.length) {
			this.ensureProviderRegistration();
		}
	}

	dispose() {
		this.providerDisposable?.dispose();
		this.disposable.dispose();
	}

	async provideTimeline(uri: Uri, options: TimelineOptions, token: CancellationToken): Promise<Timeline> {
		// console.log(`GitTimelineProvider.provideTimeline: uri=${uri}`);

		const repo = this.model.getRepository(uri);
		if (!repo) {
			this.repoDisposable?.dispose();
			this.repoOperationDate = undefined;
			this.repo = undefined;

			return { items: [] };
		}

		if (this.repo?.root !== repo.root) {
			this.repoDisposable?.dispose();

			this.repo = repo;
			this.repoOperationDate = new Date();
			this.repoDisposable = Disposable.from(
				repo.onDidChangeRepository(uri => this.onRepositoryChanged(repo, uri)),
				repo.onDidRunGitStatus(() => this.onRepositoryStatusChanged(repo)),
				repo.onDidRunOperation(result => this.onRepositoryOperationRun(repo, result))
			);
		}

		// TODO@eamodio: Ensure that the uri is a file -- if not we could get the history of the repo?

		let limit: number | undefined;
		if (options.limit !== undefined && typeof options.limit !== 'number') {
			try {
				const result = await this.model.git.exec(repo.root, ['rev-list', '--count', `${options.limit.id}..`, '--', uri.fsPath]);
				if (!result.exitCode) {
					// Ask for 2 more (1 for the limit commit and 1 for the next commit) than so we can determine if there are more commits
					limit = Number(result.stdout) + 2;
				}
			}
			catch {
				limit = undefined;
			}
		} else {
			// If we are not getting everything, ask for 1 more than so we can determine if there are more commits
			limit = options.limit === undefined ? undefined : options.limit + 1;
		}

		await ensureEmojis();

		const commits = await repo.logFile(
			uri,
			{
				maxEntries: limit,
				hash: options.cursor,
				follow: true,
				shortStats: true,
				// sortByAuthorDate: true
			},
			token
		);

		const paging = commits.length ? {
			cursor: limit === undefined ? undefined : (commits.length >= limit ? commits[commits.length - 1]?.hash : undefined)
		} : undefined;

		// If we asked for an extra commit, strip it off
		if (limit !== undefined && commits.length >= limit) {
			commits.splice(commits.length - 1, 1);
		}

		const config = workspace.getConfiguration('git', Uri.file(repo.root));
		const dateType = config.get<'committed' | 'authored'>('timeline.date');
		const showAuthor = config.get<boolean>('timeline.showAuthor');
		const showUncommitted = config.get<boolean>('timeline.showUncommitted');

		const openComparison = l10n.t('Open Comparison');

		const emptyTree = await repo.getEmptyTree();
		const unpublishedCommits = await repo.getUnpublishedCommits();
		const remoteHoverCommands = await provideSourceControlHistoryItemHoverCommands(this.model, repo);

		const avatarQuery = {
			commits: commits.map(c => ({
				hash: c.hash,
				authorName: c.authorName,
				authorEmail: c.authorEmail
			}) satisfies AvatarQueryCommit),
			size: 20
		} satisfies AvatarQuery;
		const avatars = await provideSourceControlHistoryItemAvatar(this.model, repo, avatarQuery);

		const items: GitTimelineItem[] = [];
		for (let index = 0; index < commits.length; index++) {
			const c = commits[index];

			const date = dateType === 'authored' ? c.authorDate : c.commitDate;

			const message = emojify(c.message);

			const previousRef = commits[index + 1]?.hash ?? emptyTree;
			const item = new GitTimelineItem(c.hash, previousRef, message, date?.getTime() ?? 0, c.hash, 'git:file:commit');
			item.iconPath = new ThemeIcon('git-commit');
			if (showAuthor) {
				item.description = c.authorName;
			}

			const commitRemoteSourceCommands = !unpublishedCommits.has(c.hash) ? remoteHoverCommands ?? [] : [];
			const messageWithLinks = await provideSourceControlHistoryItemMessageLinks(this.model, repo, message) ?? message;

			const commands: Command[][] = [
				getHoverCommitHashCommands(uri, c.hash),
				processHoverRemoteCommands(commitRemoteSourceCommands, c.hash)
			];

			item.tooltip = getCommitHover(avatars?.get(c.hash), c.authorName, c.authorEmail, date, messageWithLinks, c.shortStat, commands);

			const cmd = this.commands.resolveTimelineOpenDiffCommand(item, uri);
			if (cmd) {
				item.command = {
					title: openComparison,
					command: cmd.command,
					arguments: cmd.arguments,
				};
			}

			items.push(item);
		}

		if (options.cursor === undefined) {
			const you = l10n.t('You');

			const index = repo.indexGroup.resourceStates.find(r => r.resourceUri.fsPath === uri.fsPath);
			if (index) {
				const date = this.repoOperationDate ?? new Date();

				const item = new GitTimelineItem('~', 'HEAD', l10n.t('Staged Changes'), date.getTime(), 'index', 'git:file:index');
				// TODO@eamodio: Replace with a better icon -- reflecting its status maybe?
				item.iconPath = new ThemeIcon('git-commit');
				item.description = '';
				item.tooltip = getCommitHover(undefined, you, undefined, date, Resource.getStatusText(index.type), undefined, undefined);

				const cmd = this.commands.resolveTimelineOpenDiffCommand(item, uri);
				if (cmd) {
					item.command = {
						title: openComparison,
						command: cmd.command,
						arguments: cmd.arguments,
					};
				}

				items.splice(0, 0, item);
			}

			if (showUncommitted) {
				const working = repo.workingTreeGroup.resourceStates.find(r => r.resourceUri.fsPath === uri.fsPath);
				if (working) {
					const date = new Date();

					const item = new GitTimelineItem('', index ? '~' : 'HEAD', l10n.t('Uncommitted Changes'), date.getTime(), 'working', 'git:file:working');
					item.iconPath = new ThemeIcon('circle-outline');
					item.description = '';
					item.tooltip = getCommitHover(undefined, you, undefined, date, Resource.getStatusText(working.type), undefined, undefined);

					const cmd = this.commands.resolveTimelineOpenDiffCommand(item, uri);
					if (cmd) {
						item.command = {
							title: openComparison,
							command: cmd.command,
							arguments: cmd.arguments,
						};
					}

					items.splice(0, 0, item);
				}
			}
		}

		return {
			items: items,
			paging: paging
		};
	}

	private ensureProviderRegistration() {
		if (this.providerDisposable === undefined) {
			this.providerDisposable = workspace.registerTimelineProvider(['file', 'git', 'vscode-remote', 'vscode-local-history'], this);
		}
	}

	private onConfigurationChanged(e: ConfigurationChangeEvent) {
		if (e.affectsConfiguration('git.timeline.date') || e.affectsConfiguration('git.timeline.showAuthor') || e.affectsConfiguration('git.timeline.showUncommitted')) {
			this.fireChanged();
		}
	}

	private onRepositoriesChanged(_repo: Repository) {
		// console.log(`GitTimelineProvider.onRepositoriesChanged`);

		this.ensureProviderRegistration();

		// TODO@eamodio: Being naive for now and just always refreshing each time there is a new repository
		this.fireChanged();
	}

	private onRepositoryChanged(_repo: Repository, _uri: Uri) {
		// console.log(`GitTimelineProvider.onRepositoryChanged: uri=${uri.toString(true)}`);

		this.fireChanged();
	}

	private onRepositoryStatusChanged(_repo: Repository) {
		// console.log(`GitTimelineProvider.onRepositoryStatusChanged`);

		const config = workspace.getConfiguration('git.timeline');
		const showUncommitted = config.get<boolean>('showUncommitted') === true;

		if (showUncommitted) {
			this.fireChanged();
		}
	}

	private onRepositoryOperationRun(_repo: Repository, _result: OperationResult) {
		// console.log(`GitTimelineProvider.onRepositoryOperationRun`);

		// Successful operations that are not read-only and not status operations
		if (!_result.error && !_result.operation.readOnly && _result.operation.kind !== OperationKind.Status) {
			// This is less than ideal, but for now just save the last time an
			// operation was run and use that as the timestamp for staged items
			this.repoOperationDate = new Date();

			this.fireChanged();
		}
	}

	@debounce(500)
	private fireChanged() {
		this._onDidChange.fire(undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/uri.ts]---
Location: vscode-main/extensions/git/src/uri.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri } from 'vscode';
import { Change, Status } from './api/git';

export interface GitUriParams {
	path: string;
	ref: string;
	submoduleOf?: string;
}

export function isGitUri(uri: Uri): boolean {
	return /^git$/.test(uri.scheme);
}

export function fromGitUri(uri: Uri): GitUriParams {
	return JSON.parse(uri.query);
}

export interface GitUriOptions {
	scheme?: string;
	replaceFileExtension?: boolean;
	submoduleOf?: string;
}

// As a mitigation for extensions like ESLint showing warnings and errors
// for git URIs, let's change the file extension of these uris to .git,
// when `replaceFileExtension` is true.
export function toGitUri(uri: Uri, ref: string, options: GitUriOptions = {}): Uri {
	const params: GitUriParams = {
		path: uri.fsPath,
		ref
	};

	if (options.submoduleOf) {
		params.submoduleOf = options.submoduleOf;
	}

	let path = uri.path;

	if (options.replaceFileExtension) {
		path = `${path}.git`;
	} else if (options.submoduleOf) {
		path = `${path}.diff`;
	}

	return uri.with({ scheme: options.scheme ?? 'git', path, query: JSON.stringify(params) });
}

/**
 * Assuming `uri` is being merged it creates uris for `base`, `ours`, and `theirs`
 */
export function toMergeUris(uri: Uri): { base: Uri; ours: Uri; theirs: Uri } {
	return {
		base: toGitUri(uri, ':1'),
		ours: toGitUri(uri, ':2'),
		theirs: toGitUri(uri, ':3'),
	};
}

export function toMultiFileDiffEditorUris(change: Change, originalRef: string, modifiedRef: string): { originalUri: Uri | undefined; modifiedUri: Uri | undefined } {
	switch (change.status) {
		case Status.INDEX_ADDED:
			return {
				originalUri: undefined,
				modifiedUri: toGitUri(change.uri, modifiedRef)
			};
		case Status.DELETED:
			return {
				originalUri: toGitUri(change.uri, originalRef),
				modifiedUri: undefined
			};
		case Status.INDEX_RENAMED:
			return {
				originalUri: toGitUri(change.originalUri, originalRef),
				modifiedUri: toGitUri(change.uri, modifiedRef)
			};
		default:
			return {
				originalUri: toGitUri(change.uri, originalRef),
				modifiedUri: toGitUri(change.uri, modifiedRef)
			};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/util.ts]---
Location: vscode-main/extensions/git/src/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Disposable, EventEmitter, SourceControlHistoryItemRef, l10n, workspace, Uri, DiagnosticSeverity, env, SourceControlHistoryItem } from 'vscode';
import { dirname, normalize, sep, relative } from 'path';
import { Readable } from 'stream';
import { promises as fs, createReadStream } from 'fs';
import byline from 'byline';
import { Stash } from './git';

export const isMacintosh = process.platform === 'darwin';
export const isWindows = process.platform === 'win32';
export const isRemote = env.remoteName !== undefined;
export const isLinux = process.platform === 'linux';
export const isLinuxSnap = isLinux && !!process.env['SNAP'] && !!process.env['SNAP_REVISION'];

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P]
};

export function log(...args: any[]): void {
	console.log.apply(console, ['git:', ...args]);
}

export interface IDisposable {
	dispose(): void;
}

export function dispose<T extends IDisposable>(disposables: T[]): T[] {
	disposables.forEach(d => d.dispose());
	return [];
}

export function toDisposable(dispose: () => void): IDisposable {
	return { dispose };
}

export function combinedDisposable(disposables: IDisposable[]): IDisposable {
	return toDisposable(() => dispose(disposables));
}

export const EmptyDisposable = toDisposable(() => null);

export function mapEvent<I, O>(event: Event<I>, map: (i: I) => O): Event<O> {
	return (listener: (e: O) => any, thisArgs?: any, disposables?: Disposable[]) => event(i => listener.call(thisArgs, map(i)), null, disposables);
}

export function filterEvent<T>(event: Event<T>, filter: (e: T) => boolean): Event<T> {
	return (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables);
}

export function runAndSubscribeEvent<T>(event: Event<T>, handler: (e: T) => any, initial: T): IDisposable;
export function runAndSubscribeEvent<T>(event: Event<T>, handler: (e: T | undefined) => any): IDisposable;
export function runAndSubscribeEvent<T>(event: Event<T>, handler: (e: T | undefined) => any, initial?: T): IDisposable {
	handler(initial);
	return event(e => handler(e));
}

export function anyEvent<T>(...events: Event<T>[]): Event<T> {
	return (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
		const result = combinedDisposable(events.map(event => event(i => listener.call(thisArgs, i))));

		disposables?.push(result);

		return result;
	};
}

export function done<T>(promise: Promise<T>): Promise<void> {
	return promise.then<void>(() => undefined);
}

export function onceEvent<T>(event: Event<T>): Event<T> {
	return (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
		const result = event(e => {
			result.dispose();
			return listener.call(thisArgs, e);
		}, null, disposables);

		return result;
	};
}

export function debounceEvent<T>(event: Event<T>, delay: number): Event<T> {
	return (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => {
		let timer: NodeJS.Timeout;
		return event(e => {
			clearTimeout(timer);
			timer = setTimeout(() => listener.call(thisArgs, e), delay);
		}, null, disposables);
	};
}

export function eventToPromise<T>(event: Event<T>): Promise<T> {
	return new Promise<T>(c => onceEvent(event)(c));
}

export function once(fn: (...args: any[]) => any): (...args: any[]) => any {
	const didRun = false;

	return (...args) => {
		if (didRun) {
			return;
		}

		return fn(...args);
	};
}

export function assign<T>(destination: T, ...sources: any[]): T {
	for (const source of sources) {
		Object.keys(source).forEach(key =>
			(destination as Record<string, unknown>)[key] = source[key]);
	}

	return destination;
}

export function uniqBy<T>(arr: T[], fn: (el: T) => string): T[] {
	const seen = Object.create(null);

	return arr.filter(el => {
		const key = fn(el);

		if (seen[key]) {
			return false;
		}

		seen[key] = true;
		return true;
	});
}

export function groupBy<T>(arr: T[], fn: (el: T) => string): { [key: string]: T[] } {
	return arr.reduce((result, el) => {
		const key = fn(el);
		result[key] = [...(result[key] || []), el];
		return result;
	}, Object.create(null));
}

export function coalesce<T>(array: ReadonlyArray<T | undefined>): T[] {
	return array.filter((e): e is T => !!e);
}

export async function mkdirp(path: string, mode?: number): Promise<boolean> {
	const mkdir = async () => {
		try {
			await fs.mkdir(path, mode);
		} catch (err) {
			if (err.code === 'EEXIST') {
				const stat = await fs.stat(path);

				if (stat.isDirectory()) {
					return;
				}

				throw new Error(`'${path}' exists and is not a directory.`);
			}

			throw err;
		}
	};

	// is root?
	if (path === dirname(path)) {
		return true;
	}

	try {
		await mkdir();
	} catch (err) {
		if (err.code !== 'ENOENT') {
			throw err;
		}

		await mkdirp(dirname(path), mode);
		await mkdir();
	}

	return true;
}

export function uniqueFilter<T>(keyFn: (t: T) => string): (t: T) => boolean {
	const seen: { [key: string]: boolean } = Object.create(null);

	return element => {
		const key = keyFn(element);

		if (seen[key]) {
			return false;
		}

		seen[key] = true;
		return true;
	};
}

export function find<T>(array: T[], fn: (t: T) => boolean): T | undefined {
	let result: T | undefined = undefined;

	array.some(e => {
		if (fn(e)) {
			result = e;
			return true;
		}

		return false;
	});

	return result;
}

export async function grep(filename: string, pattern: RegExp): Promise<boolean> {
	return new Promise<boolean>((c, e) => {
		const fileStream = createReadStream(filename, { encoding: 'utf8' });
		const stream = byline(fileStream);
		stream.on('data', (line: string) => {
			if (pattern.test(line)) {
				fileStream.close();
				c(true);
			}
		});

		stream.on('error', e);
		stream.on('end', () => c(false));
	});
}

export function readBytes(stream: Readable, bytes: number): Promise<Buffer> {
	return new Promise<Buffer>((complete, error) => {
		let done = false;
		const buffer = Buffer.allocUnsafe(bytes);
		let bytesRead = 0;

		stream.on('data', (data: Buffer) => {
			const bytesToRead = Math.min(bytes - bytesRead, data.length);
			data.copy(buffer, bytesRead, 0, bytesToRead);
			bytesRead += bytesToRead;

			if (bytesRead === bytes) {
				stream.destroy(); // Will trigger the close event eventually
			}
		});

		stream.on('error', (e: Error) => {
			if (!done) {
				done = true;
				error(e);
			}
		});

		stream.on('close', () => {
			if (!done) {
				done = true;
				complete(buffer.slice(0, bytesRead));
			}
		});
	});
}

export const enum Encoding {
	UTF8 = 'utf8',
	UTF16be = 'utf16be',
	UTF16le = 'utf16le'
}

export function detectUnicodeEncoding(buffer: Buffer): Encoding | null {
	if (buffer.length < 2) {
		return null;
	}

	const b0 = buffer.readUInt8(0);
	const b1 = buffer.readUInt8(1);

	if (b0 === 0xFE && b1 === 0xFF) {
		return Encoding.UTF16be;
	}

	if (b0 === 0xFF && b1 === 0xFE) {
		return Encoding.UTF16le;
	}

	if (buffer.length < 3) {
		return null;
	}

	const b2 = buffer.readUInt8(2);

	if (b0 === 0xEF && b1 === 0xBB && b2 === 0xBF) {
		return Encoding.UTF8;
	}

	return null;
}

export function truncate(value: string, maxLength = 20, ellipsis = true): string {
	return value.length <= maxLength ? value : `${value.substring(0, maxLength)}${ellipsis ? '\u2026' : ''}`;
}

export function subject(value: string): string {
	const index = value.indexOf('\n');
	return index === -1 ? value : truncate(value, index, false);
}

function normalizePath(path: string): string {
	// Windows & Mac are currently being handled
	// as case insensitive file systems in VS Code.
	if (isWindows || isMacintosh) {
		path = path.toLowerCase();
	}

	// Trailing separator
	if (/[/\\]$/.test(path)) {
		// Remove trailing separator
		path = path.substring(0, path.length - 1);
	}

	// Normalize the path
	return normalize(path);
}

export function isDescendant(parent: string, descendant: string): boolean {
	if (parent === descendant) {
		return true;
	}

	// Normalize the paths
	parent = normalizePath(parent);
	descendant = normalizePath(descendant);

	// Ensure parent ends with separator
	if (parent.charAt(parent.length - 1) !== sep) {
		parent += sep;
	}

	return descendant.startsWith(parent);
}

export function pathEquals(a: string, b: string): boolean {
	return normalizePath(a) === normalizePath(b);
}

/**
 * Given the `repository.root` compute the relative path while trying to preserve
 * the casing of the resource URI. The `repository.root` segment of the path can
 * have a casing mismatch if the folder/workspace is being opened with incorrect
 * casing which is why we attempt to use substring() before relative().
 */
export function relativePath(from: string, to: string): string {
	return relativePathWithNoFallback(from, to) ?? relative(from, to);
}

export function relativePathWithNoFallback(from: string, to: string): string | undefined {
	// There are cases in which the `from` path may contain a trailing separator at
	// the end (ex: "C:\", "\\server\folder\" (Windows) or "/" (Linux/macOS)) which
	// is by design as documented in https://github.com/nodejs/node/issues/1765. If
	// the trailing separator is missing, we add it.
	if (from.charAt(from.length - 1) !== sep) {
		from += sep;
	}

	if (isDescendant(from, to) && from.length < to.length) {
		return to.substring(from.length);
	}

	return undefined;
}

export function* splitInChunks(array: string[], maxChunkLength: number): IterableIterator<string[]> {
	let current: string[] = [];
	let length = 0;

	for (const value of array) {
		let newLength = length + value.length;

		if (newLength > maxChunkLength && current.length > 0) {
			yield current;
			current = [];
			newLength = value.length;
		}

		current.push(value);
		length = newLength;
	}

	if (current.length > 0) {
		yield current;
	}
}

/**
 * @returns whether the provided parameter is defined.
 */
export function isDefined<T>(arg: T | null | undefined): arg is T {
	return !isUndefinedOrNull(arg);
}

/**
 * @returns whether the provided parameter is undefined or null.
 */
export function isUndefinedOrNull(obj: unknown): obj is undefined | null {
	return (isUndefined(obj) || obj === null);
}

/**
 * @returns whether the provided parameter is undefined.
 */
export function isUndefined(obj: unknown): obj is undefined {
	return (typeof obj === 'undefined');
}

interface ILimitedTaskFactory<T> {
	factory: () => Promise<T>;
	c: (value: T | Promise<T>) => void;
	e: (error?: any) => void;
}

export class Limiter<T> {

	private runningPromises: number;
	private maxDegreeOfParalellism: number;
	private outstandingPromises: ILimitedTaskFactory<T>[];

	constructor(maxDegreeOfParalellism: number) {
		this.maxDegreeOfParalellism = maxDegreeOfParalellism;
		this.outstandingPromises = [];
		this.runningPromises = 0;
	}

	queue(factory: () => Promise<T>): Promise<T> {
		return new Promise<T>((c, e) => {
			this.outstandingPromises.push({ factory, c, e });
			this.consume();
		});
	}

	private consume(): void {
		while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
			const iLimitedTask = this.outstandingPromises.shift()!;
			this.runningPromises++;

			const promise = iLimitedTask.factory();
			promise.then(iLimitedTask.c, iLimitedTask.e);
			promise.then(() => this.consumed(), () => this.consumed());
		}
	}

	private consumed(): void {
		this.runningPromises--;

		if (this.outstandingPromises.length > 0) {
			this.consume();
		}
	}
}

type Completion<T> = { success: true; value: T } | { success: false; err: any };

export class PromiseSource<T> {

	private _onDidComplete = new EventEmitter<Completion<T>>();

	private _promise: Promise<T> | undefined;
	get promise(): Promise<T> {
		if (this._promise) {
			return this._promise;
		}

		return eventToPromise(this._onDidComplete.event).then(completion => {
			if (completion.success) {
				return completion.value;
			} else {
				throw completion.err;
			}
		});
	}

	resolve(value: T): void {
		if (!this._promise) {
			this._promise = Promise.resolve(value);
			this._onDidComplete.fire({ success: true, value });
		}
	}

	reject(err: any): void {
		if (!this._promise) {
			this._promise = Promise.reject(err);
			this._onDidComplete.fire({ success: false, err });
		}
	}
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

export function deltaHistoryItemRefs(before: SourceControlHistoryItemRef[], after: SourceControlHistoryItemRef[]): {
	added: SourceControlHistoryItemRef[];
	modified: SourceControlHistoryItemRef[];
	removed: SourceControlHistoryItemRef[];
} {
	if (before.length === 0) {
		return { added: after, modified: [], removed: [] };
	}

	const added: SourceControlHistoryItemRef[] = [];
	const modified: SourceControlHistoryItemRef[] = [];
	const removed: SourceControlHistoryItemRef[] = [];

	let beforeIdx = 0;
	let afterIdx = 0;

	while (true) {
		if (beforeIdx === before.length) {
			added.push(...after.slice(afterIdx));
			break;
		}
		if (afterIdx === after.length) {
			removed.push(...before.slice(beforeIdx));
			break;
		}

		const beforeElement = before[beforeIdx];
		const afterElement = after[afterIdx];

		const result = beforeElement.id.localeCompare(afterElement.id);

		if (result === 0) {
			if (beforeElement.revision !== afterElement.revision) {
				// modified
				modified.push(afterElement);
			}

			beforeIdx += 1;
			afterIdx += 1;
		} else if (result < 0) {
			// beforeElement is smaller -> before element removed
			removed.push(beforeElement);

			beforeIdx += 1;
		} else if (result > 0) {
			// beforeElement is greater -> after element added
			added.push(afterElement);

			afterIdx += 1;
		}
	}

	return { added, modified, removed };
}

const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

/**
 * Create a l10n.td difference of the time between now and the specified date.
 * @param date The date to generate the difference from.
 * @param appendAgoLabel Whether to append the " ago" to the end.
 * @param useFullTimeWords Whether to use full words (eg. seconds) instead of
 * shortened (eg. secs).
 * @param disallowNow Whether to disallow the string "now" when the difference
 * is less than 30 seconds.
 */
export function fromNow(date: number | Date, appendAgoLabel?: boolean, useFullTimeWords?: boolean, disallowNow?: boolean): string {
	if (typeof date !== 'number') {
		date = date.getTime();
	}

	const seconds = Math.round((new Date().getTime() - date) / 1000);
	if (seconds < -30) {
		return l10n.t('in {0}', fromNow(new Date().getTime() + seconds * 1000, false));
	}

	if (!disallowNow && seconds < 30) {
		return l10n.t('now');
	}

	let value: number;
	if (seconds < minute) {
		value = seconds;

		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} second ago', value)
					: l10n.t('{0} sec ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} seconds ago', value)
					: l10n.t('{0} secs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} second', value)
					: l10n.t('{0} sec', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} seconds', value)
					: l10n.t('{0} secs', value);
			}
		}
	}

	if (seconds < hour) {
		value = Math.floor(seconds / minute);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} minute ago', value)
					: l10n.t('{0} min ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} minutes ago', value)
					: l10n.t('{0} mins ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} minute', value)
					: l10n.t('{0} min', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} minutes', value)
					: l10n.t('{0} mins', value);
			}
		}
	}

	if (seconds < day) {
		value = Math.floor(seconds / hour);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} hour ago', value)
					: l10n.t('{0} hr ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} hours ago', value)
					: l10n.t('{0} hrs ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} hour', value)
					: l10n.t('{0} hr', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} hours', value)
					: l10n.t('{0} hrs', value);
			}
		}
	}

	if (seconds < week) {
		value = Math.floor(seconds / day);
		if (appendAgoLabel) {
			return value === 1
				? l10n.t('{0} day ago', value)
				: l10n.t('{0} days ago', value);
		} else {
			return value === 1
				? l10n.t('{0} day', value)
				: l10n.t('{0} days', value);
		}
	}

	if (seconds < month) {
		value = Math.floor(seconds / week);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} week ago', value)
					: l10n.t('{0} wk ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} weeks ago', value)
					: l10n.t('{0} wks ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} week', value)
					: l10n.t('{0} wk', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} weeks', value)
					: l10n.t('{0} wks', value);
			}
		}
	}

	if (seconds < year) {
		value = Math.floor(seconds / month);
		if (appendAgoLabel) {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} month ago', value)
					: l10n.t('{0} mo ago', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} months ago', value)
					: l10n.t('{0} mos ago', value);
			}
		} else {
			if (value === 1) {
				return useFullTimeWords
					? l10n.t('{0} month', value)
					: l10n.t('{0} mo', value);
			} else {
				return useFullTimeWords
					? l10n.t('{0} months', value)
					: l10n.t('{0} mos', value);
			}
		}
	}

	value = Math.floor(seconds / year);
	if (appendAgoLabel) {
		if (value === 1) {
			return useFullTimeWords
				? l10n.t('{0} year ago', value)
				: l10n.t('{0} yr ago', value);
		} else {
			return useFullTimeWords
				? l10n.t('{0} years ago', value)
				: l10n.t('{0} yrs ago', value);
		}
	} else {
		if (value === 1) {
			return useFullTimeWords
				? l10n.t('{0} year', value)
				: l10n.t('{0} yr', value);
		} else {
			return useFullTimeWords
				? l10n.t('{0} years', value)
				: l10n.t('{0} yrs', value);
		}
	}
}

export function getCommitShortHash(scope: Uri, hash: string): string {
	const config = workspace.getConfiguration('git', scope);
	const shortHashLength = config.get<number>('commitShortHashLength', 7);
	return hash.substring(0, shortHashLength);
}

export function getHistoryItemDisplayName(historyItem: SourceControlHistoryItem): string {
	return historyItem.references?.length
		? historyItem.references[0].name
		: historyItem.displayId ?? historyItem.id;
}

export type DiagnosticSeverityConfig = 'error' | 'warning' | 'information' | 'hint' | 'none';

export function toDiagnosticSeverity(value: DiagnosticSeverityConfig): DiagnosticSeverity {
	return value === 'error'
		? DiagnosticSeverity.Error
		: value === 'warning'
			? DiagnosticSeverity.Warning
			: value === 'information'
				? DiagnosticSeverity.Information
				: DiagnosticSeverity.Hint;
}

export function extractFilePathFromArgs(argv: string[], startIndex: number): string {
	// Argument doesn't start with a quote
	const firstArg = argv[startIndex];
	if (!firstArg.match(/^["']/)) {
		return firstArg.replace(/^["']+|["':]+$/g, '');
	}

	// If it starts with a quote, we need to find the matching closing
	// quote which might be in a later argument if the path contains
	// spaces
	const quote = firstArg[0];

	// If the first argument ends with the same quote, it's complete
	if (firstArg.endsWith(quote) && firstArg.length > 1) {
		return firstArg.slice(1, -1);
	}

	// Concatenate arguments until we find the closing quote
	let path = firstArg;
	for (let i = startIndex + 1; i < argv.length; i++) {
		path = `${path} ${argv[i]}`;
		if (argv[i].endsWith(quote)) {
			// Found the matching quote
			return path.slice(1, -1);
		}
	}

	// If no closing quote was found, remove
	// leading quote and return the path as-is
	return path.slice(1);
}

export function getStashDescription(stash: Stash): string | undefined {
	if (!stash.commitDate && !stash.branchName) {
		return undefined;
	}

	const descriptionSegments: string[] = [];
	if (stash.commitDate) {
		descriptionSegments.push(fromNow(stash.commitDate));
	}
	if (stash.branchName) {
		descriptionSegments.push(stash.branchName);
	}

	return descriptionSegments.join(' \u2022 ');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/watch.ts]---
Location: vscode-main/extensions/git/src/watch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, RelativePattern, Uri, workspace } from 'vscode';
import { IDisposable, anyEvent } from './util';

export interface IFileWatcher extends IDisposable {
	readonly event: Event<Uri>;
}

export function watch(location: string): IFileWatcher {
	const watcher = workspace.createFileSystemWatcher(new RelativePattern(location, '*'));

	return new class implements IFileWatcher {
		event = anyEvent(watcher.onDidCreate, watcher.onDidChange, watcher.onDidDelete);
		dispose() {
			watcher.dispose();
		}
	};
}
```

--------------------------------------------------------------------------------

````

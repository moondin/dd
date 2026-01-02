---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 39
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 39 of 552)

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

---[FILE: extensions/git/src/model.ts]---
Location: vscode-main/extensions/git/src/model.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder, ThemeIcon } from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { IRepositoryResolver, Repository, RepositoryState } from './repository';
import { memoize, sequentialize, debounce } from './decorators';
import { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';
import { Git } from './git';
import * as path from 'path';
import * as fs from 'fs';
import { fromGitUri } from './uri';
import { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider, SourceControlHistoryItemDetailsProvider } from './api/git';
import { Askpass } from './askpass';
import { IPushErrorHandlerRegistry } from './pushError';
import { ApiRepository } from './api/api1';
import { IRemoteSourcePublisherRegistry } from './remotePublisher';
import { IPostCommitCommandsProviderRegistry } from './postCommitCommands';
import { IBranchProtectionProviderRegistry } from './branchProtection';
import { ISourceControlHistoryItemDetailsProviderRegistry } from './historyItemDetailsProvider';
import { RepositoryCache } from './repositoryCache';

class RepositoryPick implements QuickPickItem {
	@memoize get label(): string {
		return path.basename(this.repository.root);
	}

	@memoize get description(): string {
		return [this.repository.headLabel, this.repository.syncLabel]
			.filter(l => !!l)
			.join(' ');
	}

	@memoize get iconPath(): ThemeIcon {
		switch (this.repository.kind) {
			case 'submodule':
				return new ThemeIcon('archive');
			case 'worktree':
				return new ThemeIcon('list-tree');
			default:
				return new ThemeIcon('repo');
		}
	}

	constructor(public readonly repository: Repository, public readonly index: number) { }
}

export interface ModelChangeEvent {
	repository: Repository;
	uri: Uri;
}

export interface OriginalResourceChangeEvent {
	repository: Repository;
	uri: Uri;
}

interface OpenRepository extends Disposable {
	repository: Repository;
}

class ClosedRepositoriesManager {

	private _repositories: Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly workspaceState: Memento) {
		this._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	isRepositoryClosed(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		this.workspaceState.update('closedRepositories', [...this._repositories.values()]);
		commands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);
	}
}

class ParentRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - value indicating whether the repository should be opened
	 */
	private _repositories = new Set<string>;
	get repositories(): string[] {
		return [...this._repositories.values()];
	}

	constructor(private readonly globalState: Memento) {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string): void {
		this._repositories.add(repository);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	openRepository(repository: string): void {
		this.globalState.update(`parentRepository:${repository}`, true);
		this.deleteRepository(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);
	}
}

class UnsafeRepositoriesManager {

	/**
	 * Key   - normalized path used in user interface
	 * Value - path extracted from the output of the `git status` command
	 *         used when calling `git config --global --add safe.directory`
	 */
	private _repositories = new Map<string, string>();
	get repositories(): string[] {
		return [...this._repositories.keys()];
	}

	constructor() {
		this.onDidChangeRepositories();
	}

	addRepository(repository: string, path: string): void {
		this._repositories.set(repository, path);
		this.onDidChangeRepositories();
	}

	deleteRepository(repository: string): boolean {
		const result = this._repositories.delete(repository);
		if (result) {
			this.onDidChangeRepositories();
		}

		return result;
	}

	getRepositoryPath(repository: string): string | undefined {
		return this._repositories.get(repository);
	}

	hasRepository(repository: string): boolean {
		return this._repositories.has(repository);
	}

	private onDidChangeRepositories(): void {
		commands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);
	}
}

export class Model implements IRepositoryResolver, IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry, ISourceControlHistoryItemDetailsProviderRegistry {

	private _onDidOpenRepository = new EventEmitter<Repository>();
	readonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;

	private _onDidCloseRepository = new EventEmitter<Repository>();
	readonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;

	private _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();
	readonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;

	private _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();
	readonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;

	private openRepositories: OpenRepository[] = [];
	get repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }

	private possibleGitRepositoryPaths = new Set<string>();

	private _onDidChangeState = new EventEmitter<State>();
	readonly onDidChangeState = this._onDidChangeState.event;

	private _onDidPublish = new EventEmitter<PublishEvent>();
	readonly onDidPublish = this._onDidPublish.event;

	firePublishEvent(repository: Repository, branch?: string) {
		this._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });
	}

	private _state: State = 'uninitialized';
	get state(): State { return this._state; }

	setState(state: State): void {
		this._state = state;
		this._onDidChangeState.fire(state);
		commands.executeCommand('setContext', 'git.state', state);
	}

	@memoize
	get isInitialized(): Promise<void> {
		if (this._state === 'initialized') {
			return Promise.resolve();
		}

		return eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized') as Event<unknown>) as Promise<void>;
	}

	private remoteSourcePublishers = new Set<RemoteSourcePublisher>();

	private _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;

	private _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();
	readonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;

	private postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();

	private _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();
	readonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;

	private branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();

	private _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();
	readonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;

	private pushErrorHandlers = new Set<PushErrorHandler>();
	private historyItemDetailsProviders = new Set<SourceControlHistoryItemDetailsProvider>();

	private _unsafeRepositoriesManager: UnsafeRepositoriesManager;
	get unsafeRepositories(): string[] {
		return this._unsafeRepositoriesManager.repositories;
	}

	private _parentRepositoriesManager: ParentRepositoriesManager;
	get parentRepositories(): string[] {
		return this._parentRepositoriesManager.repositories;
	}

	private _closedRepositoriesManager: ClosedRepositoriesManager;
	get closedRepositories(): string[] {
		return [...this._closedRepositoriesManager.repositories];
	}

	/**
	 * We maintain a map containing both the path and the canonical path of the
	 * workspace folders. We are doing this as `git.exe` expands the symbolic links
	 * while there are scenarios in which VS Code does not.
	 *
	 * Key   - path of the workspace folder
	 * Value - canonical path of the workspace folder
	 */
	private _workspaceFolders = new Map<string, string>();

	private readonly _repositoryCache: RepositoryCache;
	get repositoryCache(): RepositoryCache {
		return this._repositoryCache;
	}

	private disposables: Disposable[] = [];

	constructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private readonly telemetryReporter: TelemetryReporter) {
		// Repositories managers
		this._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);
		this._parentRepositoriesManager = new ParentRepositoriesManager(globalState);
		this._unsafeRepositoriesManager = new UnsafeRepositoriesManager();

		workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);
		window.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);
		window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, this.disposables);
		workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);

		const fsWatcher = workspace.createFileSystemWatcher('**');
		this.disposables.push(fsWatcher);

		const onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);
		const onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\/\.git/.test(uri.path));
		const onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));
		onPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);

		this.setState('uninitialized');
		this.doInitialScan().finally(() => this.setState('initialized'));
		this._repositoryCache = new RepositoryCache(globalState, logger);
	}

	private async doInitialScan(): Promise<void> {
		this.logger.info('[Model][doInitialScan] Initial repository scan started');

		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');
		const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');

		this.logger.trace(`[Model][doInitialScan] Settings: autoRepositoryDetection=${autoRepositoryDetection}, openRepositoryInParentFolders=${parentRepositoryConfig}`);

		// Initial repository scan function
		const initialScanFn = () => Promise.all([
			this.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),
			this.onDidChangeVisibleTextEditors(window.visibleTextEditors),
			this.scanWorkspaceFolders()
		]);

		if (config.get<boolean>('showProgress', true)) {
			await window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);
		} else {
			await initialScanFn();
		}

		if (this.parentRepositories.length !== 0 &&
			parentRepositoryConfig === 'prompt') {
			// Parent repositories notification
			this.showParentRepositoryNotification();
		} else if (this.unsafeRepositories.length !== 0) {
			// Unsafe repositories notification
			this.showUnsafeRepositoryNotification();
		}

		/* __GDPR__
			"git.repositoryInitialScan" : {
				"owner": "lszomoru",
				"autoRepositoryDetection": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "Setting that controls the initial repository scan" },
				"repositoryCount": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true, "comment": "Number of repositories opened during initial repository scan" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });
		this.logger.info(`[Model][doInitialScan] Initial repository scan completed - repositories (${this.repositories.length}), closed repositories (${this.closedRepositories.length}), parent repositories (${this.parentRepositories.length}), unsafe repositories (${this.unsafeRepositories.length})`);
	}

	/**
	 * Scans each workspace folder, looking for git repositories. By
	 * default it scans one level deep but that can be changed using
	 * the git.repositoryScanMaxDepth setting.
	 */
	private async scanWorkspaceFolders(): Promise<void> {
		try {
			const config = workspace.getConfiguration('git');
			const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');

			if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {
				return;
			}

			await Promise.all((workspace.workspaceFolders || []).map(async folder => {
				const root = folder.uri.fsPath;
				this.logger.trace(`[Model][scanWorkspaceFolders] Workspace folder: ${root}`);

				// Workspace folder children
				const repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);
				const repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);

				const subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));

				// Repository scan folders
				const scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];
				this.logger.trace(`[Model][scanWorkspaceFolders] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);

				for (const scanPath of scanPaths) {
					if (scanPath === '.git') {
						this.logger.trace('[Model][scanWorkspaceFolders] \'.git\' not supported in \'git.scanRepositories\' setting.');
						continue;
					}

					if (path.isAbsolute(scanPath)) {
						const notSupportedMessage = l10n.t('Absolute paths not supported in "git.scanRepositories" setting.');
						this.logger.warn(`[Model][scanWorkspaceFolders] ${notSupportedMessage}`);
						console.warn(notSupportedMessage);
						continue;
					}

					subfolders.add(path.join(root, scanPath));
				}

				this.logger.trace(`[Model][scanWorkspaceFolders] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);
				await Promise.all([...subfolders].map(f => this.openRepository(f)));
			}));
		}
		catch (err) {
			this.logger.warn(`[Model][scanWorkspaceFolders] Error: ${err}`);
		}
	}

	private async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {
		const result: string[] = [];
		const foldersToTravers = [{ path: workspaceFolder, depth: 0 }];

		while (foldersToTravers.length > 0) {
			const currentFolder = foldersToTravers.shift()!;

			const children: fs.Dirent[] = [];
			try {
				children.push(...await fs.promises.readdir(currentFolder.path, { withFileTypes: true }));

				if (currentFolder.depth !== 0) {
					result.push(currentFolder.path);
				}
			}
			catch (err) {
				this.logger.warn(`[Model][traverseWorkspaceFolder] Unable to read workspace folder '${currentFolder.path}': ${err}`);
				continue;
			}

			if (currentFolder.depth < maxDepth || maxDepth === -1) {
				const childrenFolders = children
					.filter(dirent =>
						dirent.isDirectory() && dirent.name !== '.git' &&
						!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))
					.map(dirent => path.join(currentFolder.path, dirent.name));

				foldersToTravers.push(...childrenFolders.map(folder => {
					return { path: folder, depth: currentFolder.depth + 1 };
				}));
			}
		}

		return result;
	}

	private onPossibleGitRepositoryChange(uri: Uri): void {
		const config = workspace.getConfiguration('git');
		const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');

		if (autoRepositoryDetection === false) {
			return;
		}

		this.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\.git.*$/, ''));
	}

	private eventuallyScanPossibleGitRepository(path: string) {
		this.possibleGitRepositoryPaths.add(path);
		this.eventuallyScanPossibleGitRepositories();
	}

	@debounce(500)
	private eventuallyScanPossibleGitRepositories(): void {
		for (const path of this.possibleGitRepositoryPaths) {
			this.openRepository(path, false, true);
		}

		this.possibleGitRepositoryPaths.clear();
	}

	private async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {
		try {
			const possibleRepositoryFolders = added
				.filter(folder => !this.getOpenRepository(folder.uri));

			const activeRepositoriesList = window.visibleTextEditors
				.map(editor => this.getRepository(editor.document.uri))
				.filter(repository => !!repository) as Repository[];

			const activeRepositories = new Set<Repository>(activeRepositoriesList);
			const openRepositoriesToDispose = removed
				.map(folder => this.getOpenRepository(folder.uri))
				.filter(r => !!r)
				.filter(r => !activeRepositories.has(r!.repository))
				.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];

			openRepositoriesToDispose.forEach(r => r.dispose());
			this.logger.trace(`[Model][onDidChangeWorkspaceFolders] Workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
			await Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));
		}
		catch (err) {
			this.logger.warn(`[Model][onDidChangeWorkspaceFolders] Error: ${err}`);
		}
	}

	private onDidChangeConfiguration(): void {
		const possibleRepositoryFolders = (workspace.workspaceFolders || [])
			.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)
			.filter(folder => !this.getOpenRepository(folder.uri));

		const openRepositoriesToDispose = this.openRepositories
			.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))
			.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)
			.map(({ repository }) => repository);

		this.logger.trace(`[Model][onDidChangeConfiguration] Workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);
		possibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));
		openRepositoriesToDispose.forEach(r => r.dispose());
	}

	private async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {
		try {
			if (!workspace.isTrusted) {
				this.logger.trace('[Model][onDidChangeVisibleTextEditors] Workspace is not trusted.');
				return;
			}

			const config = workspace.getConfiguration('git');
			const autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');

			if (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {
				return;
			}

			await Promise.all(editors.map(async editor => {
				const uri = editor.document.uri;

				if (uri.scheme !== 'file') {
					return;
				}

				const repository = this.getRepository(uri);

				if (repository) {
					this.logger.trace(`[Model][onDidChangeVisibleTextEditors] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);
					return;
				}

				this.logger.trace(`[Model][onDidChangeVisibleTextEditors] Open repository for editor resource ${uri.fsPath}`);
				await this.openRepository(path.dirname(uri.fsPath));
			}));
		}
		catch (err) {
			this.logger.warn(`[Model][onDidChangeVisibleTextEditors] Error: ${err}`);
		}
	}

	private onDidChangeActiveTextEditor(): void {
		const textEditor = window.activeTextEditor;

		if (textEditor === undefined) {
			commands.executeCommand('setContext', 'git.activeResourceHasUnstagedChanges', false);
			commands.executeCommand('setContext', 'git.activeResourceHasStagedChanges', false);
			commands.executeCommand('setContext', 'git.activeResourceHasMergeConflicts', false);
			return;
		}

		const repository = this.getRepository(textEditor.document.uri);
		if (!repository) {
			commands.executeCommand('setContext', 'git.activeResourceHasUnstagedChanges', false);
			commands.executeCommand('setContext', 'git.activeResourceHasStagedChanges', false);
			commands.executeCommand('setContext', 'git.activeResourceHasMergeConflicts', false);
			return;
		}

		const indexResource = repository.indexGroup.resourceStates
			.find(resource => pathEquals(resource.resourceUri.fsPath, textEditor.document.uri.fsPath));
		const workingTreeResource = repository.workingTreeGroup.resourceStates
			.find(resource => pathEquals(resource.resourceUri.fsPath, textEditor.document.uri.fsPath));
		const mergeChangesResource = repository.mergeGroup.resourceStates
			.find(resource => pathEquals(resource.resourceUri.fsPath, textEditor.document.uri.fsPath));
		const hasMergeConflicts = mergeChangesResource ? /^(<{7,}|={7,}|>{7,})/m.test(textEditor.document.getText()) : false;

		commands.executeCommand('setContext', 'git.activeResourceHasStagedChanges', indexResource !== undefined);
		commands.executeCommand('setContext', 'git.activeResourceHasUnstagedChanges', workingTreeResource !== undefined);
		commands.executeCommand('setContext', 'git.activeResourceHasMergeConflicts', hasMergeConflicts);
	}

	@sequentialize
	async openRepository(repoPath: string, openIfClosed = false, openIfParent = false): Promise<void> {
		this.logger.trace(`[Model][openRepository] Repository: ${repoPath}`);
		const existingRepository = await this.getRepositoryExact(repoPath);
		if (existingRepository) {
			this.logger.trace(`[Model][openRepository] Repository for path ${repoPath} already exists: ${existingRepository.root}`);
			return;
		}

		const config = workspace.getConfiguration('git', Uri.file(repoPath));
		const enabled = config.get<boolean>('enabled') === true;

		if (!enabled) {
			this.logger.trace('[Model][openRepository] Git is not enabled');
			return;
		}

		if (!workspace.isTrusted) {
			// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty
			try {
				fs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);
				const result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);
				if (result.stderr.trim() === '' && result.stdout.trim() === '') {
					this.logger.trace(`[Model][openRepository] Bare repository: ${repoPath}`);
					return;
				}
			} catch {
				// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)
			}
		}

		try {
			const { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);
			this.logger.trace(`[Model][openRepository] Repository root for path ${repoPath} is: ${repositoryRoot}`);

			const existingRepository = await this.getRepositoryExact(repositoryRoot);
			if (existingRepository) {
				this.logger.trace(`[Model][openRepository] Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);
				return;
			}

			if (this.shouldRepositoryBeIgnored(repositoryRoot)) {
				this.logger.trace(`[Model][openRepository] Repository for path ${repositoryRoot} is ignored`);
				return;
			}

			// Handle git repositories that are in parent folders
			const parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');
			if (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {
				const isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);
				if (!openIfParent && isRepositoryOutsideWorkspace) {
					this.logger.trace(`[Model][openRepository] Repository in parent folder: ${repositoryRoot}`);

					if (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {
						// Show a notification if the parent repository is opened after the initial scan
						if (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {
							this.showParentRepositoryNotification();
						}

						this._parentRepositoriesManager.addRepository(repositoryRoot);
					}

					return;
				}
			}

			// Handle unsafe repositories
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				this.logger.trace(`[Model][openRepository] Unsafe repository: ${repositoryRoot}`);

				// Show a notification if the unsafe repository is opened after the initial scan
				if (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {
					this.showUnsafeRepositoryNotification();
				}

				this._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);

				return;
			}

			// Handle repositories that were closed by the user
			if (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {
				this.logger.trace(`[Model][openRepository] Repository for path ${repositoryRoot} is closed`);
				return;
			}

			// Open repository
			const [dotGit, repositoryRootRealPath] = await Promise.all([this.git.getRepositoryDotGit(repositoryRoot), this.getRepositoryRootRealPath(repositoryRoot)]);
			const gitRepository = this.git.open(repositoryRoot, repositoryRootRealPath, dotGit, this.logger);
			const repository = new Repository(gitRepository, this, this, this, this, this, this, this.globalState, this.logger, this.telemetryReporter, this._repositoryCache);

			this.open(repository);
			this._closedRepositoriesManager.deleteRepository(repository.root);

			this.logger.info(`[Model][openRepository] Opened repository (path): ${repository.root}`);
			this.logger.info(`[Model][openRepository] Opened repository (real path): ${repository.rootRealPath ?? repository.root}`);
			this.logger.info(`[Model][openRepository] Opened repository (kind): ${gitRepository.kind}`);

			// Do not await this, we want SCM
			// to know about the repo asap
			repository.status().then(() => {
				this._repositoryCache.update(repository.remotes, [], repository.root);
			});
		} catch (err) {
			// noop
			this.logger.trace(`[Model][openRepository] Opening repository for path='${repoPath}' failed. Error:${err}`);
		}
	}

	async openParentRepository(repoPath: string): Promise<void> {
		this._parentRepositoriesManager.openRepository(repoPath);
		await this.openRepository(repoPath);
	}

	private async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {
		try {
			const rawRoot = await this.git.getRepositoryRoot(repoPath);

			// This can happen whenever `path` has the wrong case sensitivity in case
			// insensitive file systems https://github.com/microsoft/vscode/issues/33498
			return { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };
		} catch (err) {
			// Handle unsafe repository
			const unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \'([^']+)\'[\s\S]*git config --global --add safe\.directory '?([^'\n]+)'?$/m.exec(err.stderr);
			if (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {
				return { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };
			}

			throw err;
		}
	}

	private async getRepositoryRootRealPath(repositoryRoot: string): Promise<string | undefined> {
		try {
			const repositoryRootRealPath = await fs.promises.realpath(repositoryRoot);
			return !pathEquals(repositoryRoot, repositoryRootRealPath) ? repositoryRootRealPath : undefined;
		} catch (err) {
			this.logger.warn(`[Model][getRepositoryRootRealPath] Failed to get repository realpath for "${repositoryRoot}": ${err}`);
			return undefined;
		}
	}

	private shouldRepositoryBeIgnored(repositoryRoot: string): boolean {
		const config = workspace.getConfiguration('git');
		const ignoredRepos = config.get<string[]>('ignoredRepositories') || [];

		for (const ignoredRepo of ignoredRepos) {
			if (path.isAbsolute(ignoredRepo)) {
				if (pathEquals(ignoredRepo, repositoryRoot)) {
					return true;
				}
			} else {
				for (const folder of workspace.workspaceFolders || []) {
					if (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	private open(repository: Repository): void {
		this.logger.trace(`[Model][open] Repository: ${repository.root}`);

		const onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);
		const disappearListener = onDidDisappearRepository(() => dispose());
		const disposeParentListener = repository.sourceControl.onDidDisposeParent(() => dispose());
		const changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));
		const originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));

		const shouldDetectSubmodules = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<boolean>('detectSubmodules') as boolean;

		const submodulesLimit = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<number>('detectSubmodulesLimit') as number;

		const shouldDetectWorktrees = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<boolean>('detectWorktrees') as boolean;

		const worktreesLimit = workspace
			.getConfiguration('git', Uri.file(repository.root))
			.get<number>('detectWorktreesLimit') as number;

		const checkForSubmodules = () => {
			if (!shouldDetectSubmodules) {
				this.logger.trace('[Model][open] Automatic detection of git submodules is not enabled.');
				return;
			}

			if (repository.submodules.length > submodulesLimit) {
				window.showWarningMessage(l10n.t('The "{0}" repository has {1} submodules which won\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));
				statusListener.dispose();
			}

			repository.submodules
				.slice(0, submodulesLimit)
				.map(r => path.join(repository.root, r.path))
				.forEach(p => {
					this.logger.trace(`[Model][open] Opening submodule: '${p}'`);
					this.eventuallyScanPossibleGitRepository(p);
				});
		};

		const checkForWorktrees = () => {
			if (!shouldDetectWorktrees) {
				this.logger.trace('[Model][open] Automatic detection of git worktrees is not enabled.');
				return;
			}

			if (repository.kind === 'worktree') {
				this.logger.trace('[Model][open] Automatic detection of git worktrees is not skipped.');
				return;
			}

			if (repository.worktrees.length > worktreesLimit) {
				window.showWarningMessage(l10n.t('The "{0}" repository has {1} worktrees which won\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.worktrees.length));
				statusListener.dispose();
			}

			repository.worktrees
				.slice(0, worktreesLimit)
				.forEach(w => {
					this.logger.trace(`[Model][open] Opening worktree: '${w.path}'`);
					this.eventuallyScanPossibleGitRepository(w.path);
				});
		};

		const updateMergeChanges = () => {
			// set mergeChanges context
			const mergeChanges: Uri[] = [];
			for (const { repository } of this.openRepositories.values()) {
				for (const state of repository.mergeGroup.resourceStates) {
					mergeChanges.push(state.resourceUri);
				}
			}
			commands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);
		};

		const statusListener = repository.onDidRunGitStatus(() => {
			checkForSubmodules();
			checkForWorktrees();
			updateMergeChanges();
			this.onDidChangeActiveTextEditor();
		});
		checkForSubmodules();
		checkForWorktrees();
		this.onDidChangeActiveTextEditor();

		const updateOperationInProgressContext = () => {
			let operationInProgress = false;
			for (const { repository } of this.openRepositories.values()) {
				if (repository.operations.shouldDisableCommands()) {
					operationInProgress = true;
				}
			}

			commands.executeCommand('setContext', 'operationInProgress', operationInProgress);
		};

		const operationEvent = anyEvent(repository.onDidRunOperation as Event<unknown>, repository.onRunOperation as Event<unknown>);
		const operationListener = operationEvent(() => updateOperationInProgressContext());
		updateOperationInProgressContext();

		const dispose = () => {
			disappearListener.dispose();
			disposeParentListener.dispose();
			changeListener.dispose();
			originalResourceChangeListener.dispose();
			statusListener.dispose();
			operationListener.dispose();
			repository.dispose();

			this.openRepositories = this.openRepositories.filter(e => e !== openRepository);
			this._onDidCloseRepository.fire(repository);
		};

		const openRepository = { repository, dispose };
		this.openRepositories.push(openRepository);
		updateMergeChanges();
		this._onDidOpenRepository.fire(repository);
	}

	close(repository: Repository): void {
		const openRepository = this.getOpenRepository(repository);

		if (!openRepository) {
			return;
		}

		this.logger.info(`[Model][close] Repository: ${repository.root}`);
		this._closedRepositoriesManager.addRepository(openRepository.repository.root);
		this._repositoryCache.update(repository.remotes, [], repository.root);
		openRepository.dispose();
	}

	async pickRepository(repositoryFilter?: ('repository' | 'submodule' | 'worktree')[]): Promise<Repository | undefined> {
		if (this.openRepositories.length === 0) {
			throw new Error(l10n.t('There are no available repositories'));
		}

		const repositories = this.openRepositories
			.filter(r => !repositoryFilter || repositoryFilter.includes(r.repository.kind));

		if (repositories.length === 0) {
			throw new Error(l10n.t('There are no available repositories matching the filter'));
		} else if (repositories.length === 1) {
			return repositories[0].repository;
		}

		const active = window.activeTextEditor;
		const picks = repositories.map((e, index) => new RepositoryPick(e.repository, index));
		const repository = active && this.getRepository(active.document.fileName);
		const index = picks.findIndex(pick => pick.repository === repository);

		// Move repository pick containing the active text editor to appear first
		if (index > -1) {
			picks.unshift(...picks.splice(index, 1));
		}

		const placeHolder = l10n.t('Choose a repository');
		const pick = await window.showQuickPick(picks, { placeHolder });

		return pick && pick.repository;
	}

	getRepository(hint: SourceControl | SourceControlResourceGroup | Uri | string): Repository | undefined {
		const liveRepository = this.getOpenRepository(hint);
		return liveRepository && liveRepository.repository;
	}

	private async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {
		// Use the repository path
		const openRepository = this.openRepositories
			.find(r => pathEquals(r.repository.root, repoPath));

		if (openRepository) {
			return openRepository.repository;
		}

		try {
			// Use the repository real path
			const repoPathRealPath = await fs.promises.realpath(repoPath, { encoding: 'utf8' });
			const openRepositoryRealPath = this.openRepositories
				.find(r => pathEquals(r.repository.rootRealPath ?? r.repository.root, repoPathRealPath));

			return openRepositoryRealPath?.repository;
		} catch (err) {
			this.logger.warn(`[Model][getRepositoryExact] Failed to get repository realpath for: "${repoPath}". Error:${err}`);
			return undefined;
		}
	}

	private getOpenRepository(hint: SourceControl | SourceControlResourceGroup | Repository | Uri | string): OpenRepository | undefined {
		if (!hint) {
			return undefined;
		}

		if (hint instanceof Repository) {
			return this.openRepositories.filter(r => r.repository === hint)[0];
		}

		if (hint instanceof ApiRepository) {
			hint = hint.rootUri;
		}

		if (typeof hint === 'string') {
			hint = Uri.file(hint);
		}

		if (hint instanceof Uri) {
			let resourcePath: string;

			if (hint.scheme === 'git') {
				resourcePath = fromGitUri(hint).path;
			} else {
				resourcePath = hint.fsPath;
			}

			outer:
			for (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {
				if (!isDescendant(liveRepository.repository.root, resourcePath)) {
					continue;
				}

				for (const submodule of liveRepository.repository.submodules) {
					const submoduleRoot = path.join(liveRepository.repository.root, submodule.path);

					if (isDescendant(submoduleRoot, resourcePath)) {
						continue outer;
					}
				}

				return liveRepository;
			}

			return undefined;
		}

		for (const liveRepository of this.openRepositories) {
			const repository = liveRepository.repository;

			if (hint === repository.sourceControl) {
				return liveRepository;
			}

			if (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {
				return liveRepository;
			}
		}

		return undefined;
	}

	getRepositoryForSubmodule(submoduleUri: Uri): Repository | undefined {
		for (const repository of this.repositories) {
			for (const submodule of repository.submodules) {
				const submodulePath = path.join(repository.root, submodule.path);

				if (submodulePath === submoduleUri.fsPath) {
					return repository;
				}
			}
		}

		return undefined;
	}

	registerRemoteSourcePublisher(publisher: RemoteSourcePublisher): Disposable {
		this.remoteSourcePublishers.add(publisher);
		this._onDidAddRemoteSourcePublisher.fire(publisher);

		return toDisposable(() => {
			this.remoteSourcePublishers.delete(publisher);
			this._onDidRemoveRemoteSourcePublisher.fire(publisher);
		});
	}

	getRemoteSourcePublishers(): RemoteSourcePublisher[] {
		return [...this.remoteSourcePublishers.values()];
	}

	registerBranchProtectionProvider(root: Uri, provider: BranchProtectionProvider): Disposable {
		const providerDisposables: Disposable[] = [];

		this.branchProtectionProviders.set(root.toString(), (this.branchProtectionProviders.get(root.toString()) ?? new Set()).add(provider));
		providerDisposables.push(provider.onDidChangeBranchProtection(uri => this._onDidChangeBranchProtectionProviders.fire(uri)));

		this._onDidChangeBranchProtectionProviders.fire(root);

		return toDisposable(() => {
			const providers = this.branchProtectionProviders.get(root.toString());

			if (providers && providers.has(provider)) {
				providers.delete(provider);
				this.branchProtectionProviders.set(root.toString(), providers);
				this._onDidChangeBranchProtectionProviders.fire(root);
			}

			dispose(providerDisposables);
		});
	}

	getBranchProtectionProviders(root: Uri): BranchProtectionProvider[] {
		return [...(this.branchProtectionProviders.get(root.toString()) ?? new Set()).values()];
	}

	registerPostCommitCommandsProvider(provider: PostCommitCommandsProvider): Disposable {
		this.postCommitCommandsProviders.add(provider);
		this._onDidChangePostCommitCommandsProviders.fire();

		return toDisposable(() => {
			this.postCommitCommandsProviders.delete(provider);
			this._onDidChangePostCommitCommandsProviders.fire();
		});
	}

	getPostCommitCommandsProviders(): PostCommitCommandsProvider[] {
		return [...this.postCommitCommandsProviders.values()];
	}

	registerCredentialsProvider(provider: CredentialsProvider): Disposable {
		return this.askpass.registerCredentialsProvider(provider);
	}

	registerPushErrorHandler(handler: PushErrorHandler): Disposable {
		this.pushErrorHandlers.add(handler);
		return toDisposable(() => this.pushErrorHandlers.delete(handler));
	}

	getPushErrorHandlers(): PushErrorHandler[] {
		return [...this.pushErrorHandlers];
	}

	registerSourceControlHistoryItemDetailsProvider(provider: SourceControlHistoryItemDetailsProvider): Disposable {
		this.historyItemDetailsProviders.add(provider);
		return toDisposable(() => this.historyItemDetailsProviders.delete(provider));
	}

	getSourceControlHistoryItemDetailsProviders(): SourceControlHistoryItemDetailsProvider[] {
		return [...this.historyItemDetailsProviders];
	}

	getUnsafeRepositoryPath(repository: string): string | undefined {
		return this._unsafeRepositoriesManager.getRepositoryPath(repository);
	}

	deleteUnsafeRepository(repository: string): boolean {
		return this._unsafeRepositoriesManager.deleteRepository(repository);
	}

	private async isRepositoryOutsideWorkspace(repositoryPath: string): Promise<boolean> {
		const workspaceFolders = (workspace.workspaceFolders || [])
			.filter(folder => folder.uri.scheme === 'file');

		if (workspaceFolders.length === 0) {
			return true;
		}

		// The repository path may be a canonical path or it may contain a symbolic link so we have
		// to match it against the workspace folders and the canonical paths of the workspace folders
		const workspaceFolderPaths = new Set<string | undefined>([
			...workspaceFolders.map(folder => folder.uri.fsPath),
			...await Promise.all(workspaceFolders.map(folder => this.getWorkspaceFolderRealPath(folder)))
		]);

		return !Array.from(workspaceFolderPaths).some(folder => folder && (pathEquals(folder, repositoryPath) || isDescendant(folder, repositoryPath)));
	}

	private async getWorkspaceFolderRealPath(workspaceFolder: WorkspaceFolder): Promise<string | undefined> {
		let result = this._workspaceFolders.get(workspaceFolder.uri.fsPath);

		if (!result) {
			try {
				result = await fs.promises.realpath(workspaceFolder.uri.fsPath, { encoding: 'utf8' });
				this._workspaceFolders.set(workspaceFolder.uri.fsPath, result);
			} catch (err) {
				// noop - Workspace folder does not exist
				this.logger.trace(`[Model][getWorkspaceFolderRealPath] Failed to resolve workspace folder "${workspaceFolder.uri.fsPath}". Error:${err}`);
			}
		}

		return result;
	}

	private async showParentRepositoryNotification(): Promise<void> {
		const message = this.parentRepositories.length === 1 ?
			l10n.t('A git repository was found in the parent folders of the workspace or the open file(s). Would you like to open the repository?') :
			l10n.t('Git repositories were found in the parent folders of the workspace or the open file(s). Would you like to open the repositories?');

		const yes = l10n.t('Yes');
		const always = l10n.t('Always');
		const never = l10n.t('Never');

		const choice = await window.showInformationMessage(message, yes, always, never);
		if (choice === yes) {
			// Open Parent Repositories
			commands.executeCommand('git.openRepositoriesInParentFolders');
		} else if (choice === always || choice === never) {
			// Update setting
			const config = workspace.getConfiguration('git');
			await config.update('openRepositoryInParentFolders', choice === always ? 'always' : 'never', true);

			if (choice === always) {
				for (const parentRepository of this.parentRepositories) {
					await this.openParentRepository(parentRepository);
				}
			}
		}
	}

	private async showUnsafeRepositoryNotification(): Promise<void> {
		// If no repositories are open, we will use a welcome view to inform the user
		// that a potentially unsafe repository was found so we do not have to show
		// the notification
		if (this.repositories.length === 0) {
			return;
		}

		const message = this.unsafeRepositories.length === 1 ?
			l10n.t('The git repository in the current folder is potentially unsafe as the folder is owned by someone other than the current user.') :
			l10n.t('The git repositories in the current folder are potentially unsafe as the folders are owned by someone other than the current user.');

		const manageUnsafeRepositories = l10n.t('Manage Unsafe Repositories');
		const learnMore = l10n.t('Learn More');

		const choice = await window.showErrorMessage(message, manageUnsafeRepositories, learnMore);
		if (choice === manageUnsafeRepositories) {
			// Manage Unsafe Repositories
			commands.executeCommand('git.manageUnsafeRepositories');
		} else if (choice === learnMore) {
			// Learn More
			commands.executeCommand('vscode.open', Uri.parse('https://aka.ms/vscode-git-unsafe-repository'));
		}
	}

	dispose(): void {
		const openRepositories = [...this.openRepositories];
		openRepositories.forEach(r => r.dispose());
		this.openRepositories = [];

		this.possibleGitRepositoryPaths.clear();
		this.disposables = dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/operation.ts]---
Location: vscode-main/extensions/git/src/operation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable local/code-no-dangerous-type-assertions */

import { LogOutputChannel } from 'vscode';

export const enum OperationKind {
	Add = 'Add',
	Apply = 'Apply',
	Blame = 'Blame',
	Branch = 'Branch',
	CheckIgnore = 'CheckIgnore',
	Checkout = 'Checkout',
	CheckoutTracking = 'CheckoutTracking',
	CherryPick = 'CherryPick',
	Clean = 'Clean',
	Commit = 'Commit',
	Config = 'Config',
	DeleteBranch = 'DeleteBranch',
	DeleteRef = 'DeleteRef',
	DeleteRemoteRef = 'DeleteRemoteRef',
	DeleteTag = 'DeleteTag',
	DeleteWorktree = 'DeleteWorktree',
	Diff = 'Diff',
	Fetch = 'Fetch',
	FindTrackingBranches = 'GetTracking',
	GetBranch = 'GetBranch',
	GetBranches = 'GetBranches',
	GetCommitTemplate = 'GetCommitTemplate',
	GetObjectDetails = 'GetObjectDetails',
	GetObjectFiles = 'GetObjectFiles',
	GetRefs = 'GetRefs',
	GetRemoteRefs = 'GetRemoteRefs',
	HashObject = 'HashObject',
	Ignore = 'Ignore',
	Log = 'Log',
	LogFile = 'LogFile',
	Merge = 'Merge',
	MergeAbort = 'MergeAbort',
	MergeBase = 'MergeBase',
	Move = 'Move',
	PostCommitCommand = 'PostCommitCommand',
	Pull = 'Pull',
	Push = 'Push',
	Remote = 'Remote',
	RenameBranch = 'RenameBranch',
	Remove = 'Remove',
	Reset = 'Reset',
	Rebase = 'Rebase',
	RebaseAbort = 'RebaseAbort',
	RebaseContinue = 'RebaseContinue',
	Refresh = 'Refresh',
	RevertFiles = 'RevertFiles',
	RevList = 'RevList',
	RevParse = 'RevParse',
	SetBranchUpstream = 'SetBranchUpstream',
	Show = 'Show',
	Stage = 'Stage',
	Status = 'Status',
	Stash = 'Stash',
	SubmoduleUpdate = 'SubmoduleUpdate',
	Sync = 'Sync',
	Tag = 'Tag',
	Worktree = 'Worktree'
}

export type Operation = AddOperation | ApplyOperation | BlameOperation | BranchOperation | CheckIgnoreOperation | CherryPickOperation |
	CheckoutOperation | CheckoutTrackingOperation | CleanOperation | CommitOperation | ConfigOperation | DeleteBranchOperation |
	DeleteRefOperation | DeleteRemoteRefOperation | DeleteTagOperation | DiffOperation | FetchOperation | FindTrackingBranchesOperation |
	GetBranchOperation | GetBranchesOperation | GetCommitTemplateOperation | GetObjectDetailsOperation | GetObjectFilesOperation | GetRefsOperation |
	GetRemoteRefsOperation | HashObjectOperation | IgnoreOperation | LogOperation | LogFileOperation | MergeOperation | MergeAbortOperation |
	MergeBaseOperation | MoveOperation | PostCommitCommandOperation | PullOperation | PushOperation | RemoteOperation | RenameBranchOperation |
	RemoveOperation | ResetOperation | RebaseOperation | RebaseAbortOperation | RebaseContinueOperation | RefreshOperation | RevertFilesOperation |
	RevListOperation | RevParseOperation | SetBranchUpstreamOperation | ShowOperation | StageOperation | StatusOperation | StashOperation |
	SubmoduleUpdateOperation | SyncOperation | TagOperation | WorktreeOperation;

type BaseOperation = { kind: OperationKind; blocking: boolean; readOnly: boolean; remote: boolean; retry: boolean; showProgress: boolean };
export type AddOperation = BaseOperation & { kind: OperationKind.Add };
export type ApplyOperation = BaseOperation & { kind: OperationKind.Apply };
export type BlameOperation = BaseOperation & { kind: OperationKind.Blame };
export type BranchOperation = BaseOperation & { kind: OperationKind.Branch };
export type CheckIgnoreOperation = BaseOperation & { kind: OperationKind.CheckIgnore };
export type CherryPickOperation = BaseOperation & { kind: OperationKind.CherryPick };
export type CheckoutOperation = BaseOperation & { kind: OperationKind.Checkout; refLabel: string };
export type CheckoutTrackingOperation = BaseOperation & { kind: OperationKind.CheckoutTracking; refLabel: string };
export type CleanOperation = BaseOperation & { kind: OperationKind.Clean };
export type CommitOperation = BaseOperation & { kind: OperationKind.Commit };
export type ConfigOperation = BaseOperation & { kind: OperationKind.Config };
export type DeleteBranchOperation = BaseOperation & { kind: OperationKind.DeleteBranch };
export type DeleteRefOperation = BaseOperation & { kind: OperationKind.DeleteRef };
export type DeleteRemoteRefOperation = BaseOperation & { kind: OperationKind.DeleteRemoteRef };
export type DeleteTagOperation = BaseOperation & { kind: OperationKind.DeleteTag };
export type DiffOperation = BaseOperation & { kind: OperationKind.Diff };
export type FetchOperation = BaseOperation & { kind: OperationKind.Fetch };
export type FindTrackingBranchesOperation = BaseOperation & { kind: OperationKind.FindTrackingBranches };
export type GetBranchOperation = BaseOperation & { kind: OperationKind.GetBranch };
export type GetBranchesOperation = BaseOperation & { kind: OperationKind.GetBranches };
export type GetCommitTemplateOperation = BaseOperation & { kind: OperationKind.GetCommitTemplate };
export type GetObjectDetailsOperation = BaseOperation & { kind: OperationKind.GetObjectDetails };
export type GetObjectFilesOperation = BaseOperation & { kind: OperationKind.GetObjectFiles };
export type GetRefsOperation = BaseOperation & { kind: OperationKind.GetRefs };
export type GetRemoteRefsOperation = BaseOperation & { kind: OperationKind.GetRemoteRefs };
export type HashObjectOperation = BaseOperation & { kind: OperationKind.HashObject };
export type IgnoreOperation = BaseOperation & { kind: OperationKind.Ignore };
export type LogOperation = BaseOperation & { kind: OperationKind.Log };
export type LogFileOperation = BaseOperation & { kind: OperationKind.LogFile };
export type MergeOperation = BaseOperation & { kind: OperationKind.Merge };
export type MergeAbortOperation = BaseOperation & { kind: OperationKind.MergeAbort };
export type MergeBaseOperation = BaseOperation & { kind: OperationKind.MergeBase };
export type MoveOperation = BaseOperation & { kind: OperationKind.Move };
export type PostCommitCommandOperation = BaseOperation & { kind: OperationKind.PostCommitCommand };
export type PullOperation = BaseOperation & { kind: OperationKind.Pull };
export type PushOperation = BaseOperation & { kind: OperationKind.Push };
export type RemoteOperation = BaseOperation & { kind: OperationKind.Remote };
export type RenameBranchOperation = BaseOperation & { kind: OperationKind.RenameBranch };
export type RemoveOperation = BaseOperation & { kind: OperationKind.Remove };
export type ResetOperation = BaseOperation & { kind: OperationKind.Reset };
export type RebaseOperation = BaseOperation & { kind: OperationKind.Rebase };
export type RebaseAbortOperation = BaseOperation & { kind: OperationKind.RebaseAbort };
export type RebaseContinueOperation = BaseOperation & { kind: OperationKind.RebaseContinue };
export type RefreshOperation = BaseOperation & { kind: OperationKind.Refresh };
export type RevertFilesOperation = BaseOperation & { kind: OperationKind.RevertFiles };
export type RevListOperation = BaseOperation & { kind: OperationKind.RevList };
export type RevParseOperation = BaseOperation & { kind: OperationKind.RevParse };
export type SetBranchUpstreamOperation = BaseOperation & { kind: OperationKind.SetBranchUpstream };
export type ShowOperation = BaseOperation & { kind: OperationKind.Show };
export type StageOperation = BaseOperation & { kind: OperationKind.Stage };
export type StatusOperation = BaseOperation & { kind: OperationKind.Status };
export type StashOperation = BaseOperation & { kind: OperationKind.Stash };
export type SubmoduleUpdateOperation = BaseOperation & { kind: OperationKind.SubmoduleUpdate };
export type SyncOperation = BaseOperation & { kind: OperationKind.Sync };
export type TagOperation = BaseOperation & { kind: OperationKind.Tag };
export type WorktreeOperation = BaseOperation & { kind: OperationKind.Worktree };

export const Operation = {
	Add: (showProgress: boolean): AddOperation => ({ kind: OperationKind.Add, blocking: false, readOnly: false, remote: false, retry: false, showProgress }),
	Apply: { kind: OperationKind.Apply, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as ApplyOperation,
	Blame: (showProgress: boolean) => ({ kind: OperationKind.Blame, blocking: false, readOnly: true, remote: false, retry: false, showProgress } as BlameOperation),
	Branch: { kind: OperationKind.Branch, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as BranchOperation,
	CheckIgnore: { kind: OperationKind.CheckIgnore, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as CheckIgnoreOperation,
	CherryPick: { kind: OperationKind.CherryPick, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as CherryPickOperation,
	Checkout: (refLabel: string) => ({ kind: OperationKind.Checkout, blocking: true, readOnly: false, remote: false, retry: false, showProgress: true, refLabel } as CheckoutOperation),
	CheckoutTracking: (refLabel: string) => ({ kind: OperationKind.CheckoutTracking, blocking: true, readOnly: false, remote: false, retry: false, showProgress: true, refLabel } as CheckoutTrackingOperation),
	Clean: (showProgress: boolean) => ({ kind: OperationKind.Clean, blocking: false, readOnly: false, remote: false, retry: false, showProgress } as CleanOperation),
	Commit: { kind: OperationKind.Commit, blocking: true, readOnly: false, remote: false, retry: false, showProgress: true } as CommitOperation,
	Config: (readOnly: boolean) => ({ kind: OperationKind.Config, blocking: false, readOnly, remote: false, retry: false, showProgress: false } as ConfigOperation),
	DeleteBranch: { kind: OperationKind.DeleteBranch, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as DeleteBranchOperation,
	DeleteRef: { kind: OperationKind.DeleteRef, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as DeleteRefOperation,
	DeleteRemoteRef: { kind: OperationKind.DeleteRemoteRef, blocking: false, readOnly: false, remote: true, retry: false, showProgress: true } as DeleteRemoteRefOperation,
	DeleteTag: { kind: OperationKind.DeleteTag, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as DeleteTagOperation,
	Diff: { kind: OperationKind.Diff, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as DiffOperation,
	Fetch: (showProgress: boolean) => ({ kind: OperationKind.Fetch, blocking: false, readOnly: false, remote: true, retry: true, showProgress } as FetchOperation),
	FindTrackingBranches: { kind: OperationKind.FindTrackingBranches, blocking: false, readOnly: true, remote: false, retry: false, showProgress: true } as FindTrackingBranchesOperation,
	GetBranch: { kind: OperationKind.GetBranch, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as GetBranchOperation,
	GetBranches: { kind: OperationKind.GetBranches, blocking: false, readOnly: true, remote: false, retry: false, showProgress: true } as GetBranchesOperation,
	GetCommitTemplate: { kind: OperationKind.GetCommitTemplate, blocking: false, readOnly: true, remote: false, retry: false, showProgress: true } as GetCommitTemplateOperation,
	GetObjectDetails: { kind: OperationKind.GetObjectDetails, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as GetObjectDetailsOperation,
	GetObjectFiles: { kind: OperationKind.GetObjectFiles, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as GetObjectFilesOperation,
	GetRefs: { kind: OperationKind.GetRefs, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as GetRefsOperation,
	GetRemoteRefs: { kind: OperationKind.GetRemoteRefs, blocking: false, readOnly: true, remote: true, retry: false, showProgress: false } as GetRemoteRefsOperation,
	HashObject: { kind: OperationKind.HashObject, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as HashObjectOperation,
	Ignore: { kind: OperationKind.Ignore, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as IgnoreOperation,
	Log: (showProgress: boolean) => ({ kind: OperationKind.Log, blocking: false, readOnly: true, remote: false, retry: false, showProgress }) as LogOperation,
	LogFile: { kind: OperationKind.LogFile, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as LogFileOperation,
	Merge: { kind: OperationKind.Merge, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as MergeOperation,
	MergeAbort: { kind: OperationKind.MergeAbort, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as MergeAbortOperation,
	MergeBase: { kind: OperationKind.MergeBase, blocking: false, readOnly: true, remote: false, retry: false, showProgress: true } as MergeBaseOperation,
	Move: { kind: OperationKind.Move, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as MoveOperation,
	PostCommitCommand: { kind: OperationKind.PostCommitCommand, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as PostCommitCommandOperation,
	Pull: { kind: OperationKind.Pull, blocking: true, readOnly: false, remote: true, retry: true, showProgress: true } as PullOperation,
	Push: { kind: OperationKind.Push, blocking: true, readOnly: false, remote: true, retry: false, showProgress: true } as PushOperation,
	Remote: { kind: OperationKind.Remote, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RemoteOperation,
	RenameBranch: { kind: OperationKind.RenameBranch, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RenameBranchOperation,
	Remove: { kind: OperationKind.Remove, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RemoveOperation,
	Reset: { kind: OperationKind.Reset, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as ResetOperation,
	Rebase: { kind: OperationKind.Rebase, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RebaseOperation,
	RebaseAbort: { kind: OperationKind.RebaseAbort, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RebaseAbortOperation,
	RebaseContinue: { kind: OperationKind.RebaseContinue, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RebaseContinueOperation,
	Refresh: { kind: OperationKind.Refresh, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as RefreshOperation,
	RevertFiles: (showProgress: boolean) => ({ kind: OperationKind.RevertFiles, blocking: false, readOnly: false, remote: false, retry: false, showProgress } as RevertFilesOperation),
	RevList: { kind: OperationKind.RevList, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as RevListOperation,
	RevParse: { kind: OperationKind.RevParse, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as RevParseOperation,
	SetBranchUpstream: { kind: OperationKind.SetBranchUpstream, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as SetBranchUpstreamOperation,
	Show: { kind: OperationKind.Show, blocking: false, readOnly: true, remote: false, retry: false, showProgress: false } as ShowOperation,
	Stage: { kind: OperationKind.Stage, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as StageOperation,
	Status: { kind: OperationKind.Status, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as StatusOperation,
	Stash: (readOnly: boolean) => ({ kind: OperationKind.Stash, blocking: false, readOnly, remote: false, retry: false, showProgress: true } as StashOperation),
	SubmoduleUpdate: { kind: OperationKind.SubmoduleUpdate, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as SubmoduleUpdateOperation,
	Sync: { kind: OperationKind.Sync, blocking: true, readOnly: false, remote: true, retry: true, showProgress: true } as SyncOperation,
	Tag: { kind: OperationKind.Tag, blocking: false, readOnly: false, remote: false, retry: false, showProgress: true } as TagOperation,
	Worktree: (readOnly: boolean) => ({ kind: OperationKind.Worktree, blocking: false, readOnly, remote: false, retry: false, showProgress: true } as WorktreeOperation)
};

export interface OperationResult {
	operation: Operation;
	error: unknown;
}

interface IOperationManager {
	getOperations(operationKind: OperationKind): Operation[];
	isIdle(): boolean;
	isRunning(operationKind: OperationKind): boolean;
	shouldDisableCommands(): boolean;
	shouldShowProgress(): boolean;
}

export class OperationManager implements IOperationManager {

	private operations = new Map<OperationKind, Set<Operation>>();

	constructor(private readonly logger: LogOutputChannel) { }

	start(operation: Operation): void {
		if (this.operations.has(operation.kind)) {
			this.operations.get(operation.kind)!.add(operation);
		} else {
			this.operations.set(operation.kind, new Set([operation]));
		}

		this.logger.trace(`[OperationManager][start] ${operation.kind} (blocking: ${operation.blocking}, readOnly: ${operation.readOnly}; retry: ${operation.retry}; showProgress: ${operation.showProgress})`);
	}

	end(operation: Operation): void {
		const operationSet = this.operations.get(operation.kind);
		if (operationSet) {
			operationSet.delete(operation);
			if (operationSet.size === 0) {
				this.operations.delete(operation.kind);
			}
		}

		this.logger.trace(`[OperationManager][end] ${operation.kind} (blocking: ${operation.blocking}, readOnly: ${operation.readOnly}; retry: ${operation.retry}; showProgress: ${operation.showProgress})`);
	}

	getOperations(operationKind: OperationKind): Operation[] {
		const operationSet = this.operations.get(operationKind);
		return operationSet ? Array.from(operationSet) : [];
	}

	isIdle(): boolean {
		const operationSets = this.operations.values();

		for (const operationSet of operationSets) {
			for (const operation of operationSet) {
				if (!operation.readOnly) {
					return false;
				}
			}
		}

		return true;
	}

	isRunning(operationKind: OperationKind): boolean {
		return this.operations.has(operationKind);
	}

	shouldDisableCommands(): boolean {
		const operationSets = this.operations.values();

		for (const operationSet of operationSets) {
			for (const operation of operationSet) {
				if (operation.blocking) {
					return true;
				}
			}
		}

		return false;
	}

	shouldShowProgress(): boolean {
		const operationSets = this.operations.values();

		for (const operationSet of operationSets) {
			for (const operation of operationSet) {
				if (operation.showProgress) {
					return true;
				}
			}
		}

		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/postCommitCommands.ts]---
Location: vscode-main/extensions/git/src/postCommitCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, commands, Disposable, Event, EventEmitter, Memento, Uri, workspace, l10n } from 'vscode';
import { PostCommitCommandsProvider } from './api/git';
import { IRepositoryResolver, Repository } from './repository';
import { ApiRepository } from './api/api1';
import { dispose } from './util';
import { OperationKind } from './operation';

export interface IPostCommitCommandsProviderRegistry {
	readonly onDidChangePostCommitCommandsProviders: Event<void>;

	getPostCommitCommandsProviders(): PostCommitCommandsProvider[];
	registerPostCommitCommandsProvider(provider: PostCommitCommandsProvider): Disposable;
}

export class GitPostCommitCommandsProvider implements PostCommitCommandsProvider {
	constructor(private readonly _repositoryResolver: IRepositoryResolver) { }

	getCommands(apiRepository: ApiRepository): Command[] {
		const repository = this._repositoryResolver.getRepository(apiRepository.rootUri);
		if (!repository) {
			return [];
		}

		const config = workspace.getConfiguration('git', Uri.file(repository.root));

		// Branch protection
		const isBranchProtected = repository.isBranchProtected();
		const branchProtectionPrompt = config.get<'alwaysCommit' | 'alwaysCommitToNewBranch' | 'alwaysPrompt'>('branchProtectionPrompt')!;
		const alwaysPrompt = isBranchProtected && branchProtectionPrompt === 'alwaysPrompt';
		const alwaysCommitToNewBranch = isBranchProtected && branchProtectionPrompt === 'alwaysCommitToNewBranch';

		// Icon
		const isCommitInProgress = repository.operations.isRunning(OperationKind.Commit) || repository.operations.isRunning(OperationKind.PostCommitCommand);
		const icon = isCommitInProgress ? '$(sync~spin)' : alwaysPrompt ? '$(lock)' : alwaysCommitToNewBranch ? '$(git-branch)' : undefined;

		// Tooltip (default)
		let pushCommandTooltip = !alwaysCommitToNewBranch ?
			l10n.t('Commit & Push Changes') :
			l10n.t('Commit to New Branch & Push Changes');

		let syncCommandTooltip = !alwaysCommitToNewBranch ?
			l10n.t('Commit & Sync Changes') :
			l10n.t('Commit to New Branch & Synchronize Changes');

		// Tooltip (in progress)
		if (isCommitInProgress) {
			pushCommandTooltip = !alwaysCommitToNewBranch ?
				l10n.t('Committing & Pushing Changes...') :
				l10n.t('Committing to New Branch & Pushing Changes...');

			syncCommandTooltip = !alwaysCommitToNewBranch ?
				l10n.t('Committing & Synchronizing Changes...') :
				l10n.t('Committing to New Branch & Synchronizing Changes...');
		}

		return [
			{
				command: 'git.push',
				title: l10n.t('{0} Commit & Push', icon ?? '$(arrow-up)'),
				tooltip: pushCommandTooltip
			},
			{
				command: 'git.sync',
				title: l10n.t('{0} Commit & Sync', icon ?? '$(sync)'),
				tooltip: syncCommandTooltip
			},
		];
	}
}

export class CommitCommandsCenter {

	private _onDidChange = new EventEmitter<void>();
	get onDidChange(): Event<void> { return this._onDidChange.event; }

	private disposables: Disposable[] = [];

	set postCommitCommand(command: string | null | undefined) {
		if (command === undefined) {
			// Commit WAS NOT initiated using the action button
			// so there is no need to store the post-commit command
			return;
		}

		this.globalState.update(this.getGlobalStateKey(), command)
			.then(() => this._onDidChange.fire());
	}

	constructor(
		private readonly globalState: Memento,
		private readonly repository: Repository,
		private readonly postCommitCommandsProviderRegistry: IPostCommitCommandsProviderRegistry
	) {
		const root = Uri.file(repository.root);

		// Migrate post commit command storage
		this.migratePostCommitCommandStorage()
			.then(() => {
				const onRememberPostCommitCommandChange = async () => {
					const config = workspace.getConfiguration('git', root);
					if (!config.get<boolean>('rememberPostCommitCommand')) {
						await this.globalState.update(this.getGlobalStateKey(), undefined);
					}
				};
				this.disposables.push(workspace.onDidChangeConfiguration(e => {
					if (e.affectsConfiguration('git.rememberPostCommitCommand', root)) {
						onRememberPostCommitCommandChange();
					}
				}));
				onRememberPostCommitCommandChange();

				this.disposables.push(postCommitCommandsProviderRegistry.onDidChangePostCommitCommandsProviders(() => this._onDidChange.fire()));
			});
	}

	getPrimaryCommand(): Command {
		const allCommands = this.getSecondaryCommands().map(c => c).flat();
		const commandFromStorage = allCommands.find(c => c.arguments?.length === 2 && c.arguments[1] === this.getPostCommitCommandStringFromStorage());
		const commandFromSetting = allCommands.find(c => c.arguments?.length === 2 && c.arguments[1] === this.getPostCommitCommandStringFromSetting());

		return commandFromStorage ?? commandFromSetting ?? this.getCommitCommands()[0];
	}

	getSecondaryCommands(): Command[][] {
		const commandGroups: Command[][] = [];

		for (const provider of this.postCommitCommandsProviderRegistry.getPostCommitCommandsProviders()) {
			const commands = provider.getCommands(new ApiRepository(this.repository));
			commandGroups.push((commands ?? []).map(c => {
				return { command: 'git.commit', title: c.title, tooltip: c.tooltip, arguments: [this.repository.sourceControl, c.command] };
			}));
		}

		if (commandGroups.length > 0) {
			commandGroups.splice(0, 0, this.getCommitCommands());
		}

		return commandGroups;
	}

	async executePostCommitCommand(command: string | null | undefined): Promise<void> {
		try {
			if (command === null) {
				// No post-commit command
				return;
			}

			if (command === undefined) {
				// Commit WAS NOT initiated using the action button (ex: keybinding, toolbar action,
				// command palette) so we have to honour the default post commit command (memento/setting).
				const primaryCommand = this.getPrimaryCommand();
				command = primaryCommand.arguments?.length === 2 ? primaryCommand.arguments[1] : null;
			}

			if (command !== null) {
				await commands.executeCommand(command!.toString(), new ApiRepository(this.repository));
			}
		} catch (err) {
			throw err;
		}
		finally {
			if (!this.isRememberPostCommitCommandEnabled()) {
				await this.globalState.update(this.getGlobalStateKey(), undefined);
				this._onDidChange.fire();
			}
		}
	}

	private getGlobalStateKey(): string {
		return `postCommitCommand:${this.repository.root}`;
	}

	private getCommitCommands(): Command[] {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));

		// Branch protection
		const isBranchProtected = this.repository.isBranchProtected();
		const branchProtectionPrompt = config.get<'alwaysCommit' | 'alwaysCommitToNewBranch' | 'alwaysPrompt'>('branchProtectionPrompt')!;
		const alwaysPrompt = isBranchProtected && branchProtectionPrompt === 'alwaysPrompt';
		const alwaysCommitToNewBranch = isBranchProtected && branchProtectionPrompt === 'alwaysCommitToNewBranch';

		// Icon
		const icon = alwaysPrompt ? '$(lock)' : alwaysCommitToNewBranch ? '$(git-branch)' : undefined;

		// Tooltip (default)
		const branch = this.repository.HEAD?.name;
		let tooltip = alwaysCommitToNewBranch ?
			l10n.t('Commit Changes to New Branch') :
			branch ?
				l10n.t('Commit Changes on "{0}"', branch) :
				l10n.t('Commit Changes');

		// Tooltip (in progress)
		if (this.repository.operations.isRunning(OperationKind.Commit)) {
			tooltip = !alwaysCommitToNewBranch ?
				l10n.t('Committing Changes...') :
				l10n.t('Committing Changes to New Branch...');
		}

		return [
			{ command: 'git.commit', title: l10n.t('{0} Commit', icon ?? '$(check)'), tooltip, arguments: [this.repository.sourceControl, null] },
			{ command: 'git.commitAmend', title: l10n.t('{0} Commit (Amend)', icon ?? '$(check)'), tooltip, arguments: [this.repository.sourceControl, null] },
		];
	}

	private getPostCommitCommandStringFromSetting(): string | undefined {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		const postCommitCommandSetting = config.get<string>('postCommitCommand');

		return postCommitCommandSetting === 'push' || postCommitCommandSetting === 'sync' ? `git.${postCommitCommandSetting}` : undefined;
	}

	private getPostCommitCommandStringFromStorage(): string | null | undefined {
		return this.globalState.get<string | null>(this.getGlobalStateKey());
	}

	private async migratePostCommitCommandStorage(): Promise<void> {
		const postCommitCommandString = this.globalState.get<string | null>(this.repository.root);

		if (postCommitCommandString !== undefined) {
			await this.globalState.update(this.getGlobalStateKey(), postCommitCommandString);
			await this.globalState.update(this.repository.root, undefined);
		}
	}

	private isRememberPostCommitCommandEnabled(): boolean {
		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		return config.get<boolean>('rememberPostCommitCommand') === true;
	}

	dispose(): void {
		this.disposables = dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/protocolHandler.ts]---
Location: vscode-main/extensions/git/src/protocolHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriHandler, Uri, window, Disposable, commands, LogOutputChannel, l10n } from 'vscode';
import { dispose, isWindows } from './util';
import * as querystring from 'querystring';

const schemes = isWindows ?
	new Set(['git', 'http', 'https', 'ssh']) :
	new Set(['file', 'git', 'http', 'https', 'ssh']);

const refRegEx = /^$|[~\^:\\\*\s\[\]]|^-|^\.|\/\.|\.\.|\.lock\/|\.lock$|\/$|\.$/;

export class GitProtocolHandler implements UriHandler {

	private disposables: Disposable[] = [];

	constructor(private readonly logger: LogOutputChannel) {
		this.disposables.push(window.registerUriHandler(this));
	}

	// example code-oss://vscode.git/clone?url=https://github.com/microsoft/vscode
	handleUri(uri: Uri): void {
		this.logger.info(`[GitProtocolHandler][handleUri] URI:(${uri.toString()})`);

		switch (uri.path) {
			case '/clone': this.clone(uri);
		}
	}

	private async clone(uri: Uri): Promise<void> {
		const data = querystring.parse(uri.query);
		const ref = data.ref;

		if (!data.url) {
			this.logger.warn('[GitProtocolHandler][clone] Failed to open URI:' + uri.toString());
			return;
		}

		if (Array.isArray(data.url) && data.url.length === 0) {
			this.logger.warn('[GitProtocolHandler][clone] Failed to open URI:' + uri.toString());
			return;
		}

		if (ref !== undefined && typeof ref !== 'string') {
			this.logger.warn('[GitProtocolHandler][clone] Failed to open URI due to multiple references:' + uri.toString());
			return;
		}

		let cloneUri: Uri;
		try {
			let rawUri = Array.isArray(data.url) ? data.url[0] : data.url;

			// Handle SSH Uri
			// Ex: git@github.com:microsoft/vscode.git
			rawUri = rawUri.replace(/^(git@[^\/:]+)(:)/i, 'ssh://$1/');

			cloneUri = Uri.parse(rawUri, true);

			// Validate against supported schemes
			if (!schemes.has(cloneUri.scheme.toLowerCase())) {
				throw new Error('Unsupported scheme.');
			}

			// Validate the reference
			if (typeof ref === 'string' && refRegEx.test(ref)) {
				throw new Error('Invalid reference.');
			}
		}
		catch (ex) {
			this.logger.warn('[GitProtocolHandler][clone] Invalid URI:' + uri.toString());
			return;
		}

		if (!(await commands.getCommands(true)).includes('git.clone')) {
			this.logger.error('[GitProtocolHandler][clone] Could not complete git clone operation as git installation was not found.');

			const errorMessage = l10n.t('Could not clone your repository as Git is not installed.');
			const downloadGit = l10n.t('Download Git');

			if (await window.showErrorMessage(errorMessage, { modal: true }, downloadGit) === downloadGit) {
				commands.executeCommand('vscode.open', Uri.parse('https://aka.ms/vscode-download-git'));
			}

			return;
		} else {
			const cloneTarget = cloneUri.toString(true);
			this.logger.info(`[GitProtocolHandler][clone] Executing git.clone for ${cloneTarget}`);
			commands.executeCommand('git.clone', cloneTarget, undefined, { ref: ref });
		}
	}

	dispose(): void {
		this.disposables = dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/pushError.ts]---
Location: vscode-main/extensions/git/src/pushError.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vscode';
import { PushErrorHandler } from './api/git';

export interface IPushErrorHandlerRegistry {
	registerPushErrorHandler(provider: PushErrorHandler): Disposable;
	getPushErrorHandlers(): PushErrorHandler[];
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/remotePublisher.ts]---
Location: vscode-main/extensions/git/src/remotePublisher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, Event } from 'vscode';
import { RemoteSourcePublisher } from './api/git';

export interface IRemoteSourcePublisherRegistry {
	readonly onDidAddRemoteSourcePublisher: Event<RemoteSourcePublisher>;
	readonly onDidRemoveRemoteSourcePublisher: Event<RemoteSourcePublisher>;

	getRemoteSourcePublishers(): RemoteSourcePublisher[];
	registerRemoteSourcePublisher(publisher: RemoteSourcePublisher): Disposable;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/remoteSource.ts]---
Location: vscode-main/extensions/git/src/remoteSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PickRemoteSourceOptions, PickRemoteSourceResult } from './typings/git-base';
import { GitBaseApi } from './git-base';

export async function pickRemoteSource(options: PickRemoteSourceOptions & { branch?: false | undefined }): Promise<string | undefined>;
export async function pickRemoteSource(options: PickRemoteSourceOptions & { branch: true }): Promise<PickRemoteSourceResult | undefined>;
export async function pickRemoteSource(options: PickRemoteSourceOptions = {}): Promise<string | PickRemoteSourceResult | undefined> {
	return GitBaseApi.getAPI().pickRemoteSource(options);
}

export async function getRemoteSourceActions(url: string) {
	return GitBaseApi.getAPI().getRemoteSourceActions(url);
}
```

--------------------------------------------------------------------------------

````

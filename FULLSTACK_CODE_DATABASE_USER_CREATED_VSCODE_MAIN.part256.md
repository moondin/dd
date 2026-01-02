---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 256
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 256 of 552)

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

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-diff-trimws/legacy.expected.diff.json

```json
{
	"original": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';\nimport TelemetryReporter from '@vscode/extension-telemetry';\nimport { Repository, RepositoryState } from './repository';\nimport { memoize, sequentialize, debounce } from './decorators';\nimport { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';\nimport { Git } from './git';\nimport * as path from 'path';\nimport * as fs from 'fs';\nimport { fromGitUri } from './uri';\nimport { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';\nimport { Askpass } from './askpass';\nimport { IPushErrorHandlerRegistry } from './pushError';\nimport { ApiRepository } from './api/api1';\nimport { IRemoteSourcePublisherRegistry } from './remotePublisher';\nimport { IPostCommitCommandsProviderRegistry } from './postCommitCommands';\nimport { IBranchProtectionProviderRegistry } from './branchProtection';\n\nclass ClosedRepositoriesManager {\n\n\tprivate _repositories: Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly workspaceState: Memento) {\n\t\tthis._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tisRepositoryClosed(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tthis.workspaceState.update('closedRepositories', [...this._repositories.values()]);\n\t\tcommands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass ParentRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - value indicating whether the repository should be opened\n\t */\n\tprivate _repositories = new Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly globalState: Memento) {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\topenRepository(repository: string): void {\n\t\tthis.globalState.update(`parentRepository:${repository}`, true);\n\t\tthis.deleteRepository(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass UnsafeRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - path extracted from the output of the `git status` command\n\t *         used when calling `git config --global --add safe.directory`\n\t */\n\tprivate _repositories = new Map<string, string>();\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.keys()];\n\t}\n\n\tconstructor() {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string, path: string): void {\n\t\tthis._repositories.set(repository, path);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tgetRepositoryPath(repository: string): string | undefined {\n\t\treturn this._repositories.get(repository);\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);\n\t}\n}\n\nexport class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {\n\n\tprivate _onDidOpenRepository = new EventEmitter<Repository>();\n\treadonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;\n\n\tprivate _onDidCloseRepository = new EventEmitter<Repository>();\n\treadonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;\n\n\tprivate _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();\n\treadonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;\n\n\tprivate _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();\n\treadonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;\n\n\tprivate openRepositories: OpenRepository[] = [];\n\tget repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }\n\n\tprivate possibleGitRepositoryPaths = new Set<string>();\n\n\tprivate _onDidChangeState = new EventEmitter<State>();\n\treadonly onDidChangeState = this._onDidChangeState.event;\n\n\tprivate _onDidPublish = new EventEmitter<PublishEvent>();\n\treadonly onDidPublish = this._onDidPublish.event;\n\n\tfirePublishEvent(repository: Repository, branch?: string) {\n\t\tthis._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });\n\t}\n\n\tprivate _state: State = 'uninitialized';\n\tget state(): State { return this._state; }\n\n\tsetState(state: State): void {\n\t\tthis._state = state;\n\t\tthis._onDidChangeState.fire(state);\n\t\tcommands.executeCommand('setContext', 'git.state', state);\n\t}\n\n\t@memoize\n\tget isInitialized(): Promise<void> {\n\t\tif (this._state === 'initialized') {\n\t\t\treturn Promise.resolve();\n\t\t}\n\n\t\treturn eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;\n\t}\n\n\tprivate remoteSourcePublishers = new Set<RemoteSourcePublisher>();\n\n\tprivate _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;\n\n\tprivate _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;\n\n\tprivate postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();\n\n\tprivate _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();\n\treadonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;\n\n\tprivate branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();\n\n\tprivate _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();\n\treadonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;\n\n\tprivate pushErrorHandlers = new Set<PushErrorHandler>();\n\n\tprivate _unsafeRepositoriesManager: UnsafeRepositoriesManager;\n\tget unsafeRepositories(): string[] {\n\t\treturn this._unsafeRepositoriesManager.repositories;\n\t}\n\n\tprivate _parentRepositoriesManager: ParentRepositoriesManager;\n\tget parentRepositories(): string[] {\n\t\treturn this._parentRepositoriesManager.repositories;\n\t}\n\n\tprivate _closedRepositoriesManager: ClosedRepositoriesManager;\n\tget closedRepositories(): string[] {\n\t\treturn [...this._closedRepositoriesManager.repositories];\n\t}\n\n\t/**\n\t * We maintain a map containing both the path and the canonical path of the\n\t * workspace folders. We are doing this as `git.exe` expands the symbolic links\n\t * while there are scenarios in which VS Code does not.\n\t *\n\t * Key   - path of the workspace folder\n\t * Value - canonical path of the workspace folder\n\t */\n\tprivate _workspaceFolders = new Map<string, string>();\n\n\tprivate disposables: Disposable[] = [];\n\n\tconstructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {\n\t\t// Repositories managers\n\t\tthis._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);\n\t\tthis._parentRepositoriesManager = new ParentRepositoriesManager(globalState);\n\t\tthis._unsafeRepositoriesManager = new UnsafeRepositoriesManager();\n\n\t\tworkspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);\n\t\twindow.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);\n\t\tworkspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);\n\n\t\tconst fsWatcher = workspace.createFileSystemWatcher('**');\n\t\tthis.disposables.push(fsWatcher);\n\n\t\tconst onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);\n\t\tconst onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\\/\\.git/.test(uri.path));\n\t\tconst onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));\n\t\tonPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);\n\n\t\tthis.setState('uninitialized');\n\t\tthis.doInitialScan().finally(() => this.setState('initialized'));\n\t}\n\n\tprivate async doInitialScan(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\n\t\t// Initial repository scan function\n\t\tconst initialScanFn = () => Promise.all([\n\t\t\tthis.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),\n\t\t\tthis.onDidChangeVisibleTextEditors(window.visibleTextEditors),\n\t\t\tthis.scanWorkspaceFolders()\n\t\t]);\n\n\t\tif (config.get<boolean>('showProgress', true)) {\n\t\t\tawait window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);\n\t\t} else {\n\t\t\tawait initialScanFn();\n\t\t}\n\n\t\tif (this.parentRepositories.length !== 0 &&\n\t\t\tparentRepositoryConfig === 'prompt') {\n\t\t\t// Parent repositories notification\n\t\t\tthis.showParentRepositoryNotification();\n\t\t} else if (this.unsafeRepositories.length !== 0) {\n\t\t\t// Unsafe repositories notification\n\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t}\n\n\t\t/* __GDPR__\n\t\t\t\"git.repositoryInitialScan\" : {\n\t\t\t\t\"owner\": \"lszomoru\",\n\t\t\t\t\"autoRepositoryDetection\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"comment\": \"Setting that controls the initial repository scan\" },\n\t\t\t\t\"repositoryCount\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"isMeasurement\": true, \"comment\": \"Number of repositories opened during initial repository scan\" }\n\t\t\t}\n\t\t*/\n\t\tthis.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });\n\t}\n\n\t/**\n\t * Scans each workspace folder, looking for git repositories. By\n\t * default it scans one level deep but that can be changed using\n\t * the git.repositoryScanMaxDepth setting.\n\t */\n\tprivate async scanWorkspaceFolders(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all((workspace.workspaceFolders || []).map(async folder => {\n\t\t\tconst root = folder.uri.fsPath;\n\t\t\tthis.logger.trace(`[swsf] Workspace folder: ${root}`);\n\n\t\t\t// Workspace folder children\n\t\t\tconst repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);\n\t\t\tconst repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);\n\n\t\t\tconst subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));\n\n\t\t\t// Repository scan folders\n\t\t\tconst scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];\n\t\t\tthis.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);\n\n\t\t\tfor (const scanPath of scanPaths) {\n\t\t\t\tif (scanPath === '.git') {\n\t\t\t\t\tthis.logger.trace('[swsf] \\'.git\\' not supported in \\'git.scanRepositories\\' setting.');\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (path.isAbsolute(scanPath)) {\n\t\t\t\t\tconst notSupportedMessage = l10n.t('Absolute paths not supported in \"git.scanRepositories\" setting.');\n\t\t\t\t\tthis.logger.warn(notSupportedMessage);\n\t\t\t\t\tconsole.warn(notSupportedMessage);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tsubfolders.add(path.join(root, scanPath));\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);\n\t\t\tawait Promise.all([...subfolders].map(f => this.openRepository(f)));\n\t\t}));\n\t}\n\n\tprivate async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {\n\t\tconst result: string[] = [];\n\t\tconst foldersToTravers = [{ path: workspaceFolder, depth: 0 }];\n\n\t\twhile (foldersToTravers.length > 0) {\n\t\t\tconst currentFolder = foldersToTravers.shift()!;\n\n\t\t\tif (currentFolder.depth < maxDepth || maxDepth === -1) {\n\t\t\t\tconst children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });\n\t\t\t\tconst childrenFolders = children\n\t\t\t\t\t.filter(dirent =>\n\t\t\t\t\t\tdirent.isDirectory() && dirent.name !== '.git' &&\n\t\t\t\t\t\t!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))\n\t\t\t\t\t.map(dirent => path.join(currentFolder.path, dirent.name));\n\n\t\t\t\tresult.push(...childrenFolders);\n\t\t\t\tfoldersToTravers.push(...childrenFolders.map(folder => {\n\t\t\t\t\treturn { path: folder, depth: currentFolder.depth + 1 };\n\t\t\t\t}));\n\t\t\t}\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tprivate onPossibleGitRepositoryChange(uri: Uri): void {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\n\t\tif (autoRepositoryDetection === false) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\\.git.*$/, ''));\n\t}\n\n\tprivate eventuallyScanPossibleGitRepository(path: string) {\n\t\tthis.possibleGitRepositoryPaths.add(path);\n\t\tthis.eventuallyScanPossibleGitRepositories();\n\t}\n\n\t@debounce(500)\n\tprivate eventuallyScanPossibleGitRepositories(): void {\n\t\tfor (const path of this.possibleGitRepositoryPaths) {\n\t\t\tthis.openRepository(path);\n\t\t}\n\n\t\tthis.possibleGitRepositoryPaths.clear();\n\t}\n\n\tprivate async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {\n\t\tconst possibleRepositoryFolders = added\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst activeRepositoriesList = window.visibleTextEditors\n\t\t\t.map(editor => this.getRepository(editor.document.uri))\n\t\t\t.filter(repository => !!repository) as Repository[];\n\n\t\tconst activeRepositories = new Set<Repository>(activeRepositoriesList);\n\t\tconst openRepositoriesToDispose = removed\n\t\t\t.map(folder => this.getOpenRepository(folder.uri))\n\t\t\t.filter(r => !!r)\n\t\t\t.filter(r => !activeRepositories.has(r!.repository))\n\t\t\t.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];\n\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tawait Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));\n\t}\n\n\tprivate onDidChangeConfiguration(): void {\n\t\tconst possibleRepositoryFolders = (workspace.workspaceFolders || [])\n\t\t\t.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst openRepositoriesToDispose = this.openRepositories\n\t\t\t.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))\n\t\t\t.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)\n\t\t\t.map(({ repository }) => repository);\n\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tpossibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t}\n\n\tprivate async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {\n\t\tif (!workspace.isTrusted) {\n\t\t\tthis.logger.trace('[svte] Workspace is not trusted.');\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all(editors.map(async editor => {\n\t\t\tconst uri = editor.document.uri;\n\n\t\t\tif (uri.scheme !== 'file') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tconst repository = this.getRepository(uri);\n\n\t\t\tif (repository) {\n\t\t\t\tthis.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);\n\t\t\tawait this.openRepository(path.dirname(uri.fsPath));\n\t\t}));\n\t}\n\n\t@sequentialize\n\tasync openRepository(repoPath: string, openIfClosed = false): Promise<void> {\n\t\tthis.logger.trace(`Opening repository: ${repoPath}`);\n\t\tconst existingRepository = await this.getRepositoryExact(repoPath);\n\t\tif (existingRepository) {\n\t\t\tthis.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git', Uri.file(repoPath));\n\t\tconst enabled = config.get<boolean>('enabled') === true;\n\n\t\tif (!enabled) {\n\t\t\tthis.logger.trace('Git is not enabled');\n\t\t\treturn;\n\t\t}\n\n\t\tif (!workspace.isTrusted) {\n\t\t\t// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty\n\t\t\ttry {\n\t\t\t\tfs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);\n\t\t\t\tconst result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);\n\t\t\t\tif (result.stderr.trim() === '' && result.stdout.trim() === '') {\n\t\t\t\t\tthis.logger.trace(`Bare repository: ${repoPath}`);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t} catch {\n\t\t\t\t// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)\n\t\t\t}\n\t\t}\n\n\t\ttry {\n\t\t\tconst { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);\n\t\t\tthis.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);\n\n\t\t\tconst existingRepository = await this.getRepositoryExact(repositoryRoot);\n\t\t\tif (existingRepository) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (this.shouldRepositoryBeIgnored(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is ignored`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle git repositories that are in parent folders\n\t\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\t\t\tif (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {\n\t\t\t\tconst isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);\n\t\t\t\tif (isRepositoryOutsideWorkspace) {\n\t\t\t\t\tthis.logger.trace(`Repository in parent folder: ${repositoryRoot}`);\n\n\t\t\t\t\tif (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\t\t// Show a notification if the parent repository is opened after the initial scan\n\t\t\t\t\t\tif (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {\n\t\t\t\t\t\t\tthis.showParentRepositoryNotification();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis._parentRepositoriesManager.addRepository(repositoryRoot);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Handle unsafe repositories\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\tthis.logger.trace(`Unsafe repository: ${repositoryRoot}`);\n\n\t\t\t\t// Show a notification if the unsafe repository is opened after the initial scan\n\t\t\t\tif (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t\t\t}\n\n\t\t\t\tthis._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);\n\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle repositories that were closed by the user\n\t\t\tif (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is closed`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Open repository\n\t\t\tconst dotGit = await this.git.getRepositoryDotGit(repositoryRoot);\n\t\t\tconst repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);\n\n\t\t\tthis.open(repository);\n\t\t\tthis._closedRepositoriesManager.deleteRepository(repository.root);\n\n\t\t\t// Do not await this, we want SCM\n\t\t\t// to know about the repo asap\n\t\t\trepository.status();\n\t\t} catch (err) {\n\t\t\t// noop\n\t\t\tthis.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);\n\t\t}\n\t}\n\n\tasync openParentRepository(repoPath: string): Promise<void> {\n\t\tawait this.openRepository(repoPath);\n\t\tthis._parentRepositoriesManager.openRepository(repoPath);\n\t}\n\n\tprivate async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {\n\t\ttry {\n\t\t\tconst rawRoot = await this.git.getRepositoryRoot(repoPath);\n\n\t\t\t// This can happen whenever `path` has the wrong case sensitivity in case\n\t\t\t// insensitive file systems https://github.com/microsoft/vscode/issues/33498\n\t\t\treturn { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };\n\t\t} catch (err) {\n\t\t\t// Handle unsafe repository\n\t\t\tconst unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \\'([^']+)\\'[\\s\\S]*git config --global --add safe\\.directory '?([^'\\n]+)'?$/m.exec(err.stderr);\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\treturn { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };\n\t\t\t}\n\n\t\t\tthrow err;\n\t\t}\n\t}\n\n\tprivate shouldRepositoryBeIgnored(repositoryRoot: string): boolean {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst ignoredRepos = config.get<string[]>('ignoredRepositories') || [];\n\n\t\tfor (const ignoredRepo of ignoredRepos) {\n\t\t\tif (path.isAbsolute(ignoredRepo)) {\n\t\t\t\tif (pathEquals(ignoredRepo, repositoryRoot)) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tfor (const folder of workspace.workspaceFolders || []) {\n\t\t\t\t\tif (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tprivate open(repository: Repository): void {\n\t\tthis.logger.info(`Open repository: ${repository.root}`);\n\n\t\tconst onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);\n\t\tconst disappearListener = onDidDisappearRepository(() => dispose());\n\t\tconst changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));\n\t\tconst originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));\n\n\t\tconst shouldDetectSubmodules = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<boolean>('detectSubmodules') as boolean;\n\n\t\tconst submodulesLimit = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<number>('detectSubmodulesLimit') as number;\n\n\t\tconst checkForSubmodules = () => {\n\t\t\tif (!shouldDetectSubmodules) {\n\t\t\t\tthis.logger.trace('Automatic detection of git submodules is not enabled.');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (repository.submodules.length > submodulesLimit) {\n\t\t\t\twindow.showWarningMessage(l10n.t('The \"{0}\" repository has {1} submodules which won\\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));\n\t\t\t\tstatusListener.dispose();\n\t\t\t}\n\n\t\t\trepository.submodules\n\t\t\t\t.slice(0, submodulesLimit)\n\t\t\t\t.map(r => path.join(repository.root, r.path))\n\t\t\t\t.forEach(p => {\n\t\t\t\t\tthis.logger.trace(`Opening submodule: '${p}'`);\n\t\t\t\t\tthis.eventuallyScanPossibleGitRepository(p);\n\t\t\t\t});\n\t\t};\n\n\t\tconst updateMergeChanges = () => {\n\t\t\t// set mergeChanges context\n\t\t\tconst mergeChanges: Uri[] = [];\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tfor (const state of repository.mergeGroup.resourceStates) {\n\t\t\t\t\tmergeChanges.push(state.resourceUri);\n\t\t\t\t}\n\t\t\t}\n\t\t\tcommands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);\n\t\t};\n\n\t\tconst statusListener = repository.onDidRunGitStatus(() => {\n\t\t\tcheckForSubmodules();\n\t\t\tupdateMergeChanges();\n\t\t});\n\t\tcheckForSubmodules();\n\n\t\tconst updateOperationInProgressContext = () => {\n\t\t\tlet operationInProgress = false;\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tif (repository.operations.shouldDisableCommands()) {\n\t\t\t\t\toperationInProgress = true;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tcommands.executeCommand('setContext', 'operationInProgress', operationInProgress);\n\t\t};\n\n\t\tconst operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);\n\t\tconst operationListener = operationEvent(() => updateOperationInProgressContext());\n\t\tupdateOperationInProgressContext();\n\n\t\tconst dispose = () => {\n\t\t\tdisappearListener.dispose();\n\t\t\tchangeListener.dispose();\n\t\t\toriginalResourceChangeListener.dispose();\n\t\t\tstatusListener.dispose();\n\t\t\toperationListener.dispose();\n\t\t\trepository.dispose();\n\n\t\t\tthis.openRepositories = this.openRepositories.filter(e => e !== openRepository);\n\t\t\tthis._onDidCloseRepository.fire(repository);\n\t\t};\n\n\t\tconst openRepository = { repository, dispose };\n\t\tthis.openRepositories.push(openRepository);\n\t\tupdateMergeChanges();\n\t\tthis._onDidOpenRepository.fire(repository);\n\t}\n\n\tclose(repository: Repository): void {\n\t\tconst openRepository = this.getOpenRepository(repository);\n\n\t\tif (!openRepository) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.logger.info(`Close repository: ${repository.root}`);\n\t\tthis._closedRepositoriesManager.addRepository(openRepository.repository.root);\n\n\t\topenRepository.dispose();\n\t}\n\n\tasync pickRepository(): Promise<Repository | undefined> {\n\t\tif (this.openRepositories.length === 0) {\n\t\t\tthrow new Error(l10n.t('There are no available repositories'));\n\t\t}\n\n\t\tconst picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));\n\t\tconst active = window.activeTextEditor;\n\t\tconst repository = active && this.getRepository(active.document.fileName);\n\t\tconst index = picks.findIndex(pick => pick.repository === repository);\n\n\t\t// Move repository pick containing the active text editor to appear first\n\t\tif (index > -1) {\n\t\t\tpicks.unshift(...picks.splice(index, 1));\n\t\t}\n\n\t\tconst placeHolder = l10n.t('Choose a repository');\n\t\tconst pick = await window.showQuickPick(picks, { placeHolder });\n\n\t\treturn pick && pick.repository;\n\t}\n\n\tgetRepository(sourceControl: SourceControl): Repository | undefined;\n\tgetRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;\n\tgetRepository(path: string): Repository | undefined;\n\tgetRepository(resource: Uri): Repository | undefined;\n\tgetRepository(hint: any): Repository | undefined {\n\t\tconst liveRepository = this.getOpenRepository(hint);\n\t\treturn liveRepository && liveRepository.repository;\n\t}\n\n\tprivate async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {\n\t\tconst repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });\n\t\tconst openRepository = this.openRepositories.find(async r => {\n\t\t\tconst rootPathCanonical = await fs.promises.realpath(r.repository.root, { encoding: 'utf8' });\n\t\t\treturn pathEquals(rootPathCanonical, repoPathCanonical);\n\t\t});\n\t\treturn openRepository?.repository;\n\t}\n\n\tprivate getOpenRepository(repository: Repository): OpenRepository | undefined;\n\tprivate getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;\n\tprivate getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;\n\tprivate getOpenRepository(path: string): OpenRepository | undefined;\n\tprivate getOpenRepository(resource: Uri): OpenRepository | undefined;\n\tprivate getOpenRepository(hint: any): OpenRepository | undefined {\n\t\tif (!hint) {\n\t\t\treturn undefined;\n\t\t}\n\n\t\tif (hint instanceof Repository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint)[0];\n\t\t}\n\n\t\tif (hint instanceof ApiRepository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint.repository)[0];\n\t\t}\n\n\t\tif (typeof hint === 'string') {\n\t\t\thint = Uri.file(hint);\n\t\t}\n\n\t\tif (hint instanceof Uri) {\n\t\t\tlet resourcePath: string;\n\n\t\t\tif (hint.scheme === 'git') {\n\t\t\t\tresourcePath = fromGitUri(hint).path;\n\t\t\t} else {\n\t\t\t\tresourcePath = hint.fsPath;\n\t\t\t}\n\n\t\t\touter:\n\t\t\tfor (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {\n\t\t\t\tif (!isDescendant(liveRepository.repository.root, resourcePath)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tfor (const submodule of liveRepository.repository.submodules) {\n\t\t\t\t\tconst submoduleRoot = path.join(liveRepository.repository.root, submodule.path);\n\n\t\t\t\t\tif (isDescendant(submoduleRoot, resourcePath)) {\n\t\t\t\t\t\tcontinue outer;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\treturn undefined;\n\t\t}\n\n\t\tfor (const liveRepository of this.openRepositories) {\n\t\t\tconst repository = liveRepository.repository;\n\n\t\t\tif (hint === repository.sourceControl) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\tif (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n}\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "/*---------------------------------------------------------------------------------------------\n *  Copyright (c) Microsoft Corporation. All rights reserved.\n *  Licensed under the MIT License. See License.txt in the project root for license information.\n *--------------------------------------------------------------------------------------------*/\n\nimport { workspace, WorkspaceFoldersChangeEvent, Uri, window, Event, EventEmitter, QuickPickItem, Disposable, SourceControl, SourceControlResourceGroup, TextEditor, Memento, commands, LogOutputChannel, l10n, ProgressLocation, WorkspaceFolder } from 'vscode';\nimport TelemetryReporter from '@vscode/extension-telemetry';\nimport { Repository, RepositoryState } from './repository';\nimport { memoize, sequentialize, debounce } from './decorators';\nimport { dispose, anyEvent, filterEvent, isDescendant, pathEquals, toDisposable, eventToPromise } from './util';\nimport { Git } from './git';\nimport * as path from 'path';\nimport * as fs from 'fs';\nimport { fromGitUri } from './uri';\nimport { APIState as State, CredentialsProvider, PushErrorHandler, PublishEvent, RemoteSourcePublisher, PostCommitCommandsProvider, BranchProtectionProvider } from './api/git';\nimport { Askpass } from './askpass';\nimport { IPushErrorHandlerRegistry } from './pushError';\nimport { ApiRepository } from './api/api1';\nimport { IRemoteSourcePublisherRegistry } from './remotePublisher';\nimport { IPostCommitCommandsProviderRegistry } from './postCommitCommands';\nimport { IBranchProtectionProviderRegistry } from './branchProtection';\n\nclass ClosedRepositoriesManager {\n\n\tprivate _repositories: Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly workspaceState: Memento) {\n\t\tthis._repositories = new Set<string>(workspaceState.get<string[]>('closedRepositories', []));\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tisRepositoryClosed(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tthis.workspaceState.update('closedRepositories', [...this._repositories.values()]);\n\t\tcommands.executeCommand('setContext', 'git.closedRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass ParentRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - value indicating whether the repository should be opened\n\t */\n\tprivate _repositories = new Set<string>;\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.values()];\n\t}\n\n\tconstructor(private readonly globalState: Memento) {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string): void {\n\t\tthis._repositories.add(repository);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\topenRepository(repository: string): void {\n\t\tthis.globalState.update(`parentRepository:${repository}`, true);\n\t\tthis.deleteRepository(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.parentRepositoryCount', this._repositories.size);\n\t}\n}\n\nclass UnsafeRepositoriesManager {\n\n\t/**\n\t * Key   - normalized path used in user interface\n\t * Value - path extracted from the output of the `git status` command\n\t *         used when calling `git config --global --add safe.directory`\n\t */\n\tprivate _repositories = new Map<string, string>();\n\tget repositories(): string[] {\n\t\treturn [...this._repositories.keys()];\n\t}\n\n\tconstructor() {\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\taddRepository(repository: string, path: string): void {\n\t\tthis._repositories.set(repository, path);\n\t\tthis.onDidChangeRepositories();\n\t}\n\n\tdeleteRepository(repository: string): boolean {\n\t\tconst result = this._repositories.delete(repository);\n\t\tif (result) {\n\t\t\tthis.onDidChangeRepositories();\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tgetRepositoryPath(repository: string): string | undefined {\n\t\treturn this._repositories.get(repository);\n\t}\n\n\thasRepository(repository: string): boolean {\n\t\treturn this._repositories.has(repository);\n\t}\n\n\tprivate onDidChangeRepositories(): void {\n\t\tcommands.executeCommand('setContext', 'git.unsafeRepositoryCount', this._repositories.size);\n\t}\n}\n\nexport class Model implements IBranchProtectionProviderRegistry, IRemoteSourcePublisherRegistry, IPostCommitCommandsProviderRegistry, IPushErrorHandlerRegistry {\n\n\tprivate _onDidOpenRepository = new EventEmitter<Repository>();\n\treadonly onDidOpenRepository: Event<Repository> = this._onDidOpenRepository.event;\n\n\tprivate _onDidCloseRepository = new EventEmitter<Repository>();\n\treadonly onDidCloseRepository: Event<Repository> = this._onDidCloseRepository.event;\n\n\tprivate _onDidChangeRepository = new EventEmitter<ModelChangeEvent>();\n\treadonly onDidChangeRepository: Event<ModelChangeEvent> = this._onDidChangeRepository.event;\n\n\tprivate _onDidChangeOriginalResource = new EventEmitter<OriginalResourceChangeEvent>();\n\treadonly onDidChangeOriginalResource: Event<OriginalResourceChangeEvent> = this._onDidChangeOriginalResource.event;\n\n\tprivate openRepositories: OpenRepository[] = [];\n\tget repositories(): Repository[] { return this.openRepositories.map(r => r.repository); }\n\n\tprivate possibleGitRepositoryPaths = new Set<string>();\n\n\tprivate _onDidChangeState = new EventEmitter<State>();\n\treadonly onDidChangeState = this._onDidChangeState.event;\n\n\tprivate _onDidPublish = new EventEmitter<PublishEvent>();\n\treadonly onDidPublish = this._onDidPublish.event;\n\n\tfirePublishEvent(repository: Repository, branch?: string) {\n\t\tthis._onDidPublish.fire({ repository: new ApiRepository(repository), branch: branch });\n\t}\n\n\tprivate _state: State = 'uninitialized';\n\tget state(): State { return this._state; }\n\n\tsetState(state: State): void {\n\t\tthis._state = state;\n\t\tthis._onDidChangeState.fire(state);\n\t\tcommands.executeCommand('setContext', 'git.state', state);\n\t}\n\n\t@memoize\n\tget isInitialized(): Promise<void> {\n\t\tif (this._state === 'initialized') {\n\t\t\treturn Promise.resolve();\n\t\t}\n\n\t\treturn eventToPromise(filterEvent(this.onDidChangeState, s => s === 'initialized')) as Promise<any>;\n\t}\n\n\tprivate remoteSourcePublishers = new Set<RemoteSourcePublisher>();\n\n\tprivate _onDidAddRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidAddRemoteSourcePublisher = this._onDidAddRemoteSourcePublisher.event;\n\n\tprivate _onDidRemoveRemoteSourcePublisher = new EventEmitter<RemoteSourcePublisher>();\n\treadonly onDidRemoveRemoteSourcePublisher = this._onDidRemoveRemoteSourcePublisher.event;\n\n\tprivate postCommitCommandsProviders = new Set<PostCommitCommandsProvider>();\n\n\tprivate _onDidChangePostCommitCommandsProviders = new EventEmitter<void>();\n\treadonly onDidChangePostCommitCommandsProviders = this._onDidChangePostCommitCommandsProviders.event;\n\n\tprivate branchProtectionProviders = new Map<string, Set<BranchProtectionProvider>>();\n\n\tprivate _onDidChangeBranchProtectionProviders = new EventEmitter<Uri>();\n\treadonly onDidChangeBranchProtectionProviders = this._onDidChangeBranchProtectionProviders.event;\n\n\tprivate pushErrorHandlers = new Set<PushErrorHandler>();\n\n\tprivate _unsafeRepositoriesManager: UnsafeRepositoriesManager;\n\tget unsafeRepositories(): string[] {\n\t\treturn this._unsafeRepositoriesManager.repositories;\n\t}\n\n\tprivate _parentRepositoriesManager: ParentRepositoriesManager;\n\tget parentRepositories(): string[] {\n\t\treturn this._parentRepositoriesManager.repositories;\n\t}\n\n\tprivate _closedRepositoriesManager: ClosedRepositoriesManager;\n\tget closedRepositories(): string[] {\n\t\treturn [...this._closedRepositoriesManager.repositories];\n\t}\n\n\t/**\n\t * We maintain a map containing both the path and the canonical path of the\n\t * workspace folders. We are doing this as `git.exe` expands the symbolic links\n\t * while there are scenarios in which VS Code does not.\n\t *\n\t * Key   - path of the workspace folder\n\t * Value - canonical path of the workspace folder\n\t */\n\tprivate _workspaceFolders = new Map<string, string>();\n\n\tprivate disposables: Disposable[] = [];\n\n\tconstructor(readonly git: Git, private readonly askpass: Askpass, private globalState: Memento, readonly workspaceState: Memento, private logger: LogOutputChannel, private telemetryReporter: TelemetryReporter) {\n\t\t// Repositories managers\n\t\tthis._closedRepositoriesManager = new ClosedRepositoriesManager(workspaceState);\n\t\tthis._parentRepositoriesManager = new ParentRepositoriesManager(globalState);\n\t\tthis._unsafeRepositoriesManager = new UnsafeRepositoriesManager();\n\n\t\tworkspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders, this, this.disposables);\n\t\twindow.onDidChangeVisibleTextEditors(this.onDidChangeVisibleTextEditors, this, this.disposables);\n\t\tworkspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, this.disposables);\n\n\t\tconst fsWatcher = workspace.createFileSystemWatcher('**');\n\t\tthis.disposables.push(fsWatcher);\n\n\t\tconst onWorkspaceChange = anyEvent(fsWatcher.onDidChange, fsWatcher.onDidCreate, fsWatcher.onDidDelete);\n\t\tconst onGitRepositoryChange = filterEvent(onWorkspaceChange, uri => /\\/\\.git/.test(uri.path));\n\t\tconst onPossibleGitRepositoryChange = filterEvent(onGitRepositoryChange, uri => !this.getRepository(uri));\n\t\tonPossibleGitRepositoryChange(this.onPossibleGitRepositoryChange, this, this.disposables);\n\n\t\tthis.setState('uninitialized');\n\t\tthis.doInitialScan().finally(() => this.setState('initialized'));\n\t}\n\n\tprivate async doInitialScan(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\n\t\t// Initial repository scan function\n\t\tconst initialScanFn = () => Promise.all([\n\t\t\tthis.onDidChangeWorkspaceFolders({ added: workspace.workspaceFolders || [], removed: [] }),\n\t\t\tthis.onDidChangeVisibleTextEditors(window.visibleTextEditors),\n\t\t\tthis.scanWorkspaceFolders()\n\t\t]);\n\n\t\tif (config.get<boolean>('showProgress', true)) {\n\t\t\tawait window.withProgress({ location: ProgressLocation.SourceControl }, initialScanFn);\n\t\t} else {\n\t\t\tawait initialScanFn();\n\t\t}\n\n\t\tif (this.parentRepositories.length !== 0 &&\n\t\t\tparentRepositoryConfig === 'prompt') {\n\t\t\t// Parent repositories notification\n\t\t\tthis.showParentRepositoryNotification();\n\t\t} else if (this.unsafeRepositories.length !== 0) {\n\t\t\t// Unsafe repositories notification\n\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t}\n\n\t\t/* __GDPR__\n\t\t\t\"git.repositoryInitialScan\" : {\n\t\t\t\t\"owner\": \"lszomoru\",\n\t\t\t\t\"autoRepositoryDetection\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"comment\": \"Setting that controls the initial repository scan\" },\n\t\t\t\t\"repositoryCount\": { \"classification\": \"SystemMetaData\", \"purpose\": \"FeatureInsight\", \"isMeasurement\": true, \"comment\": \"Number of repositories opened during initial repository scan\" }\n\t\t\t}\n\t\t*/\n\t\tthis.telemetryReporter.sendTelemetryEvent('git.repositoryInitialScan', { autoRepositoryDetection: String(autoRepositoryDetection) }, { repositoryCount: this.openRepositories.length });\n\t}\n\n\t/**\n\t * Scans each workspace folder, looking for git repositories. By\n\t * default it scans one level deep but that can be changed using\n\t * the git.repositoryScanMaxDepth setting.\n\t */\n\tprivate async scanWorkspaceFolders(): Promise<void> {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[swsf] Scan workspace sub folders. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'subFolders') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all((workspace.workspaceFolders || []).map(async folder => {\n\t\t\tconst root = folder.uri.fsPath;\n\t\t\tthis.logger.trace(`[swsf] Workspace folder: ${root}`);\n\n\t\t\t// Workspace folder children\n\t\t\tconst repositoryScanMaxDepth = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<number>('repositoryScanMaxDepth', 1);\n\t\t\tconst repositoryScanIgnoredFolders = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('repositoryScanIgnoredFolders', []);\n\n\t\t\tconst subfolders = new Set(await this.traverseWorkspaceFolder(root, repositoryScanMaxDepth, repositoryScanIgnoredFolders));\n\n\t\t\t// Repository scan folders\n\t\t\tconst scanPaths = (workspace.isTrusted ? workspace.getConfiguration('git', folder.uri) : config).get<string[]>('scanRepositories') || [];\n\t\t\tthis.logger.trace(`[swsf] Workspace scan settings: repositoryScanMaxDepth=${repositoryScanMaxDepth}; repositoryScanIgnoredFolders=[${repositoryScanIgnoredFolders.join(', ')}]; scanRepositories=[${scanPaths.join(', ')}]`);\n\n\t\t\tfor (const scanPath of scanPaths) {\n\t\t\t\tif (scanPath === '.git') {\n\t\t\t\t\tthis.logger.trace('[swsf] \\'.git\\' not supported in \\'git.scanRepositories\\' setting.');\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (path.isAbsolute(scanPath)) {\n\t\t\t\t\tconst notSupportedMessage = l10n.t('Absolute paths not supported in \"git.scanRepositories\" setting.');\n\t\t\t\t\tthis.logger.warn(notSupportedMessage);\n\t\t\t\t\tconsole.warn(notSupportedMessage);\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tsubfolders.add(path.join(root, scanPath));\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[swsf] Workspace scan sub folders: [${[...subfolders].join(', ')}]`);\n\t\t\tawait Promise.all([...subfolders].map(f => this.openRepository(f)));\n\t\t}));\n\t}\n\n\tprivate async traverseWorkspaceFolder(workspaceFolder: string, maxDepth: number, repositoryScanIgnoredFolders: string[]): Promise<string[]> {\n\t\tconst result: string[] = [];\n\t\tconst foldersToTravers = [{ path: workspaceFolder, depth: 0 }];\n\n\t\twhile (foldersToTravers.length > 0) {\n\t\t\tconst currentFolder = foldersToTravers.shift()!;\n\n\t\t\tif (currentFolder.depth < maxDepth || maxDepth === -1) {\n\t\t\t\tconst children = await fs.promises.readdir(currentFolder.path, { withFileTypes: true });\n\t\t\t\tconst childrenFolders = children\n\t\t\t\t\t.filter(dirent =>\n\t\t\t\t\t\tdirent.isDirectory() && dirent.name !== '.git' &&\n\t\t\t\t\t\t!repositoryScanIgnoredFolders.find(f => pathEquals(dirent.name, f)))\n\t\t\t\t\t.map(dirent => path.join(currentFolder.path, dirent.name));\n\n\t\t\t\tresult.push(...childrenFolders);\n\t\t\t\tfoldersToTravers.push(...childrenFolders.map(folder => {\n\t\t\t\t\treturn { path: folder, depth: currentFolder.depth + 1 };\n\t\t\t\t}));\n\t\t\t}\n\t\t}\n\n\t\treturn result;\n\t}\n\n\tprivate onPossibleGitRepositoryChange(uri: Uri): void {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\n\t\tif (autoRepositoryDetection === false) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.eventuallyScanPossibleGitRepository(uri.fsPath.replace(/\\.git.*$/, ''));\n\t}\n\n\tprivate eventuallyScanPossibleGitRepository(path: string) {\n\t\tthis.possibleGitRepositoryPaths.add(path);\n\t\tthis.eventuallyScanPossibleGitRepositories();\n\t}\n\n\t@debounce(500)\n\tprivate eventuallyScanPossibleGitRepositories(): void {\n\t\tfor (const path of this.possibleGitRepositoryPaths) {\n\t\t\tthis.openRepository(path);\n\t\t}\n\n\t\tthis.possibleGitRepositoryPaths.clear();\n\t}\n\n\tprivate async onDidChangeWorkspaceFolders({ added, removed }: WorkspaceFoldersChangeEvent): Promise<void> {\n\t\tconst possibleRepositoryFolders = added\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst activeRepositoriesList = window.visibleTextEditors\n\t\t\t.map(editor => this.getRepository(editor.document.uri))\n\t\t\t.filter(repository => !!repository) as Repository[];\n\n\t\tconst activeRepositories = new Set<Repository>(activeRepositoriesList);\n\t\tconst openRepositoriesToDispose = removed\n\t\t\t.map(folder => this.getOpenRepository(folder.uri))\n\t\t\t.filter(r => !!r)\n\t\t\t.filter(r => !activeRepositories.has(r!.repository))\n\t\t\t.filter(r => !(workspace.workspaceFolders || []).some(f => isDescendant(f.uri.fsPath, r!.repository.root))) as OpenRepository[];\n\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tawait Promise.all(possibleRepositoryFolders.map(p => this.openRepository(p.uri.fsPath)));\n\t}\n\n\tprivate onDidChangeConfiguration(): void {\n\t\tconst possibleRepositoryFolders = (workspace.workspaceFolders || [])\n\t\t\t.filter(folder => workspace.getConfiguration('git', folder.uri).get<boolean>('enabled') === true)\n\t\t\t.filter(folder => !this.getOpenRepository(folder.uri));\n\n\t\tconst openRepositoriesToDispose = this.openRepositories\n\t\t\t.map(repository => ({ repository, root: Uri.file(repository.repository.root) }))\n\t\t\t.filter(({ root }) => workspace.getConfiguration('git', root).get<boolean>('enabled') !== true)\n\t\t\t.map(({ repository }) => repository);\n\n\t\tthis.logger.trace(`[swf] Scan workspace folders: [${possibleRepositoryFolders.map(p => p.uri.fsPath).join(', ')}]`);\n\t\tpossibleRepositoryFolders.forEach(p => this.openRepository(p.uri.fsPath));\n\t\topenRepositoriesToDispose.forEach(r => r.dispose());\n\t}\n\n\tprivate async onDidChangeVisibleTextEditors(editors: readonly TextEditor[]): Promise<void> {\n\t\tif (!workspace.isTrusted) {\n\t\t\tthis.logger.trace('[svte] Workspace is not trusted.');\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst autoRepositoryDetection = config.get<boolean | 'subFolders' | 'openEditors'>('autoRepositoryDetection');\n\t\tthis.logger.trace(`[svte] Scan visible text editors. autoRepositoryDetection=${autoRepositoryDetection}`);\n\n\t\tif (autoRepositoryDetection !== true && autoRepositoryDetection !== 'openEditors') {\n\t\t\treturn;\n\t\t}\n\n\t\tawait Promise.all(editors.map(async editor => {\n\t\t\tconst uri = editor.document.uri;\n\n\t\t\tif (uri.scheme !== 'file') {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tconst repository = this.getRepository(uri);\n\n\t\t\tif (repository) {\n\t\t\t\tthis.logger.trace(`[svte] Repository for editor resource ${uri.fsPath} already exists: ${repository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis.logger.trace(`[svte] Open repository for editor resource ${uri.fsPath}`);\n\t\t\tawait this.openRepository(path.dirname(uri.fsPath));\n\t\t}));\n\t}\n\n\t@sequentialize\n\tasync openRepository(repoPath: string, openIfClosed = false): Promise<void> {\n\t\tthis.logger.trace(`Opening repository: ${repoPath}`);\n\t\tconst existingRepository = await this.getRepositoryExact(repoPath);\n\t\tif (existingRepository) {\n\t\t\tthis.logger.trace(`Repository for path ${repoPath} already exists: ${existingRepository.root})`);\n\t\t\treturn;\n\t\t}\n\n\t\tconst config = workspace.getConfiguration('git', Uri.file(repoPath));\n\t\tconst enabled = config.get<boolean>('enabled') === true;\n\n\t\tif (!enabled) {\n\t\t\tthis.logger.trace('Git is not enabled');\n\t\t\treturn;\n\t\t}\n\n\t\tif (!workspace.isTrusted) {\n\t\t\t// Check if the folder is a bare repo: if it has a file named HEAD && `rev-parse --show -cdup` is empty\n\t\t\ttry {\n\t\t\t\tfs.accessSync(path.join(repoPath, 'HEAD'), fs.constants.F_OK);\n\t\t\t\tconst result = await this.git.exec(repoPath, ['-C', repoPath, 'rev-parse', '--show-cdup']);\n\t\t\t\tif (result.stderr.trim() === '' && result.stdout.trim() === '') {\n\t\t\t\t\tthis.logger.trace(`Bare repository: ${repoPath}`);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t} catch {\n\t\t\t\t// If this throw, we should be good to open the repo (e.g. HEAD doesn't exist)\n\t\t\t}\n\t\t}\n\n\t\ttry {\n\t\t\tconst { repositoryRoot, unsafeRepositoryMatch } = await this.getRepositoryRoot(repoPath);\n\t\t\tthis.logger.trace(`Repository root for path ${repoPath} is: ${repositoryRoot}`);\n\n\t\t\tconst existingRepository = await this.getRepositoryExact(repositoryRoot);\n\t\t\tif (existingRepository) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} already exists: ${existingRepository.root}`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (this.shouldRepositoryBeIgnored(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is ignored`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle git repositories that are in parent folders\n\t\t\tconst parentRepositoryConfig = config.get<'always' | 'never' | 'prompt'>('openRepositoryInParentFolders', 'prompt');\n\t\t\tif (parentRepositoryConfig !== 'always' && this.globalState.get<boolean>(`parentRepository:${repositoryRoot}`) !== true) {\n\t\t\t\tconst isRepositoryOutsideWorkspace = await this.isRepositoryOutsideWorkspace(repositoryRoot);\n\t\t\t\tif (isRepositoryOutsideWorkspace) {\n\t\t\t\t\tthis.logger.trace(`Repository in parent folder: ${repositoryRoot}`);\n\n\t\t\t\t\tif (!this._parentRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\t\t// Show a notification if the parent repository is opened after the initial scan\n\t\t\t\t\t\tif (this.state === 'initialized' && parentRepositoryConfig === 'prompt') {\n\t\t\t\t\t\t\tthis.showParentRepositoryNotification();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis._parentRepositoriesManager.addRepository(repositoryRoot);\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t// Handle unsafe repositories\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\tthis.logger.trace(`Unsafe repository: ${repositoryRoot}`);\n\n\t\t\t\t// Show a notification if the unsafe repository is opened after the initial scan\n\t\t\t\tif (this._state === 'initialized' && !this._unsafeRepositoriesManager.hasRepository(repositoryRoot)) {\n\t\t\t\t\tthis.showUnsafeRepositoryNotification();\n\t\t\t\t}\n\n\t\t\t\tthis._unsafeRepositoriesManager.addRepository(repositoryRoot, unsafeRepositoryMatch[2]);\n\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Handle repositories that were closed by the user\n\t\t\tif (!openIfClosed && this._closedRepositoriesManager.isRepositoryClosed(repositoryRoot)) {\n\t\t\t\tthis.logger.trace(`Repository for path ${repositoryRoot} is closed`);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\t// Open repository\n\t\t\tconst dotGit = await this.git.getRepositoryDotGit(repositoryRoot);\n\t\t\tconst repository = new Repository(this.git.open(repositoryRoot, dotGit, this.logger), this, this, this, this, this.globalState, this.logger, this.telemetryReporter);\n\n\t\t\tthis.open(repository);\n\t\t\tthis._closedRepositoriesManager.deleteRepository(repository.root);\n\n\t\t\t// Do not await this, we want SCM\n\t\t\t// to know about the repo asap\n\t\t\trepository.status();\n\t\t} catch (err) {\n\t\t\t// noop\n\t\t\tthis.logger.trace(`Opening repository for path='${repoPath}' failed; ex=${err}`);\n\t\t}\n\t}\n\n\tasync openParentRepository(repoPath: string): Promise<void> {\n\t\tawait this.openRepository(repoPath);\n\t\tthis._parentRepositoriesManager.openRepository(repoPath);\n\t}\n\n\tprivate async getRepositoryRoot(repoPath: string): Promise<{ repositoryRoot: string; unsafeRepositoryMatch: RegExpMatchArray | null }> {\n\t\ttry {\n\t\t\tconst rawRoot = await this.git.getRepositoryRoot(repoPath);\n\n\t\t\t// This can happen whenever `path` has the wrong case sensitivity in case\n\t\t\t// insensitive file systems https://github.com/microsoft/vscode/issues/33498\n\t\t\treturn { repositoryRoot: Uri.file(rawRoot).fsPath, unsafeRepositoryMatch: null };\n\t\t} catch (err) {\n\t\t\t// Handle unsafe repository\n\t\t\tconst unsafeRepositoryMatch = /^fatal: detected dubious ownership in repository at \\'([^']+)\\'[\\s\\S]*git config --global --add safe\\.directory '?([^'\\n]+)'?$/m.exec(err.stderr);\n\t\t\tif (unsafeRepositoryMatch && unsafeRepositoryMatch.length === 3) {\n\t\t\t\treturn { repositoryRoot: path.normalize(unsafeRepositoryMatch[1]), unsafeRepositoryMatch };\n\t\t\t}\n\n\t\t\tthrow err;\n\t\t}\n\t}\n\n\tprivate shouldRepositoryBeIgnored(repositoryRoot: string): boolean {\n\t\tconst config = workspace.getConfiguration('git');\n\t\tconst ignoredRepos = config.get<string[]>('ignoredRepositories') || [];\n\n\t\tfor (const ignoredRepo of ignoredRepos) {\n\t\t\tif (path.isAbsolute(ignoredRepo)) {\n\t\t\t\tif (pathEquals(ignoredRepo, repositoryRoot)) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tfor (const folder of workspace.workspaceFolders || []) {\n\t\t\t\t\tif (pathEquals(path.join(folder.uri.fsPath, ignoredRepo), repositoryRoot)) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tprivate open(repository: Repository): void {\n\t\tthis.logger.info(`Open repository: ${repository.root}`);\n\n\t\tconst onDidDisappearRepository = filterEvent(repository.onDidChangeState, state => state === RepositoryState.Disposed);\n\t\tconst disappearListener = onDidDisappearRepository(() => dispose());\n\t\tconst changeListener = repository.onDidChangeRepository(uri => this._onDidChangeRepository.fire({ repository, uri }));\n\t\tconst originalResourceChangeListener = repository.onDidChangeOriginalResource(uri => this._onDidChangeOriginalResource.fire({ repository, uri }));\n\n\t\tconst shouldDetectSubmodules = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<boolean>('detectSubmodules') as boolean;\n\n\t\tconst submodulesLimit = workspace\n\t\t\t.getConfiguration('git', Uri.file(repository.root))\n\t\t\t.get<number>('detectSubmodulesLimit') as number;\n\n\t\tconst checkForSubmodules = () => {\n\t\t\tif (!shouldDetectSubmodules) {\n\t\t\t\tthis.logger.trace('Automatic detection of git submodules is not enabled.');\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (repository.submodules.length > submodulesLimit) {\n\t\t\t\twindow.showWarningMessage(l10n.t('The \"{0}\" repository has {1} submodules which won\\'t be opened automatically. You can still open each one individually by opening a file within.', path.basename(repository.root), repository.submodules.length));\n\t\t\t\tstatusListener.dispose();\n\t\t\t}\n\n\t\t\trepository.submodules\n\t\t\t\t.slice(0, submodulesLimit)\n\t\t\t\t.map(r => path.join(repository.root, r.path))\n\t\t\t\t.forEach(p => {\n\t\t\t\t\tthis.logger.trace(`Opening submodule: '${p}'`);\n\t\t\t\t\tthis.eventuallyScanPossibleGitRepository(p);\n\t\t\t\t});\n\t\t};\n\n\t\tconst updateMergeChanges = () => {\n\t\t\t// set mergeChanges context\n\t\t\tconst mergeChanges: Uri[] = [];\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tfor (const state of repository.mergeGroup.resourceStates) {\n\t\t\t\t\tmergeChanges.push(state.resourceUri);\n\t\t\t\t}\n\t\t\t}\n\t\t\tcommands.executeCommand('setContext', 'git.mergeChanges', mergeChanges);\n\t\t};\n\n\t\tconst statusListener = repository.onDidRunGitStatus(() => {\n\t\t\tcheckForSubmodules();\n\t\t\tupdateMergeChanges();\n\t\t});\n\t\tcheckForSubmodules();\n\n\t\tconst updateOperationInProgressContext = () => {\n\t\t\tlet operationInProgress = false;\n\t\t\tfor (const { repository } of this.openRepositories.values()) {\n\t\t\t\tif (repository.operations.shouldDisableCommands()) {\n\t\t\t\t\toperationInProgress = true;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tcommands.executeCommand('setContext', 'operationInProgress', operationInProgress);\n\t\t};\n\n\t\tconst operationEvent = anyEvent(repository.onDidRunOperation as Event<any>, repository.onRunOperation as Event<any>);\n\t\tconst operationListener = operationEvent(() => updateOperationInProgressContext());\n\t\tupdateOperationInProgressContext();\n\n\t\tconst dispose = () => {\n\t\t\tdisappearListener.dispose();\n\t\t\tchangeListener.dispose();\n\t\t\toriginalResourceChangeListener.dispose();\n\t\t\tstatusListener.dispose();\n\t\t\toperationListener.dispose();\n\t\t\trepository.dispose();\n\n\t\t\tthis.openRepositories = this.openRepositories.filter(e => e !== openRepository);\n\t\t\tthis._onDidCloseRepository.fire(repository);\n\t\t};\n\n\t\tconst openRepository = { repository, dispose };\n\t\tthis.openRepositories.push(openRepository);\n\t\tupdateMergeChanges();\n\t\tthis._onDidOpenRepository.fire(repository);\n\t}\n\n\tclose(repository: Repository): void {\n\t\tconst openRepository = this.getOpenRepository(repository);\n\n\t\tif (!openRepository) {\n\t\t\treturn;\n\t\t}\n\n\t\tthis.logger.info(`Close repository: ${repository.root}`);\n\t\tthis._closedRepositoriesManager.addRepository(openRepository.repository.root);\n\n\t\topenRepository.dispose();\n\t}\n\n\tasync pickRepository(): Promise<Repository | undefined> {\n\t\tif (this.openRepositories.length === 0) {\n\t\t\tthrow new Error(l10n.t('There are no available repositories'));\n\t\t}\n\n\t\tconst picks = this.openRepositories.map((e, index) => new RepositoryPick(e.repository, index));\n\t\tconst active = window.activeTextEditor;\n\t\tconst repository = active && this.getRepository(active.document.fileName);\n\t\tconst index = picks.findIndex(pick => pick.repository === repository);\n\n\t\t// Move repository pick containing the active text editor to appear first\n\t\tif (index > -1) {\n\t\t\tpicks.unshift(...picks.splice(index, 1));\n\t\t}\n\n\t\tconst placeHolder = l10n.t('Choose a repository');\n\t\tconst pick = await window.showQuickPick(picks, { placeHolder });\n\n\t\treturn pick && pick.repository;\n\t}\n\n\tgetRepository(sourceControl: SourceControl): Repository | undefined;\n\tgetRepository(resourceGroup: SourceControlResourceGroup): Repository | undefined;\n\tgetRepository(path: string): Repository | undefined;\n\tgetRepository(resource: Uri): Repository | undefined;\n\tgetRepository(hint: any): Repository | undefined {\n\t\tconst liveRepository = this.getOpenRepository(hint);\n\t\treturn liveRepository && liveRepository.repository;\n\t}\n\n\tprivate async getRepositoryExact(repoPath: string): Promise<Repository | undefined> {\n\t\tconst repoPathCanonical = await fs.promises.realpath(repoPath, { encoding: 'utf8' });\n\n\t\tfor (const openRepository of this.openRepositories) {\n\t\t\tconst rootPathCanonical = await fs.promises.realpath(openRepository.repository.root, { encoding: 'utf8' });\n\t\t\tif (pathEquals(rootPathCanonical, repoPathCanonical)) {\n\t\t\t\treturn openRepository.repository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n\tprivate getOpenRepository(repository: Repository): OpenRepository | undefined;\n\tprivate getOpenRepository(sourceControl: SourceControl): OpenRepository | undefined;\n\tprivate getOpenRepository(resourceGroup: SourceControlResourceGroup): OpenRepository | undefined;\n\tprivate getOpenRepository(path: string): OpenRepository | undefined;\n\tprivate getOpenRepository(resource: Uri): OpenRepository | undefined;\n\tprivate getOpenRepository(hint: any): OpenRepository | undefined {\n\t\tif (!hint) {\n\t\t\treturn undefined;\n\t\t}\n\n\t\tif (hint instanceof Repository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint)[0];\n\t\t}\n\n\t\tif (hint instanceof ApiRepository) {\n\t\t\treturn this.openRepositories.filter(r => r.repository === hint.repository)[0];\n\t\t}\n\n\t\tif (typeof hint === 'string') {\n\t\t\thint = Uri.file(hint);\n\t\t}\n\n\t\tif (hint instanceof Uri) {\n\t\t\tlet resourcePath: string;\n\n\t\t\tif (hint.scheme === 'git') {\n\t\t\t\tresourcePath = fromGitUri(hint).path;\n\t\t\t} else {\n\t\t\t\tresourcePath = hint.fsPath;\n\t\t\t}\n\n\t\t\touter:\n\t\t\tfor (const liveRepository of this.openRepositories.sort((a, b) => b.repository.root.length - a.repository.root.length)) {\n\t\t\t\tif (!isDescendant(liveRepository.repository.root, resourcePath)) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tfor (const submodule of liveRepository.repository.submodules) {\n\t\t\t\t\tconst submoduleRoot = path.join(liveRepository.repository.root, submodule.path);\n\n\t\t\t\t\tif (isDescendant(submoduleRoot, resourcePath)) {\n\t\t\t\t\t\tcontinue outer;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\treturn undefined;\n\t\t}\n\n\t\tfor (const liveRepository of this.openRepositories) {\n\t\t\tconst repository = liveRepository.repository;\n\n\t\t\tif (hint === repository.sourceControl) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\n\t\t\tif (hint === repository.mergeGroup || hint === repository.indexGroup || hint === repository.workingTreeGroup || hint === repository.untrackedGroup) {\n\t\t\t\treturn liveRepository;\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n\n\tgetRepositoryForSubmodule(submoduleUri: Uri): Repository | undefined {\n\t\tfor (const repository of this.repositories) {\n\t\t\tfor (const submodule of repository.submodules) {\n\t\t\t\tconst submodulePath = path.join(repository.root, submodule.path);\n\n\t\t\t\tif (submodulePath === submoduleUri.fsPath) {\n\t\t\t\t\treturn repository;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn undefined;\n\t}\n}\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[742,747)",
			"modifiedRange": "[742,751)",
			"innerChanges": [
				{
					"originalRange": "[742,3 -> 742,3]",
					"modifiedRange": "[743,3 -> 743,8]"
				},
				{
					"originalRange": "[742,24 -> 742,25]",
					"modifiedRange": "[743,29 -> 743,31]"
				},
				{
					"originalRange": "[742,47 -> 742,63]",
					"modifiedRange": "[743,53 -> 743,54]"
				},
				{
					"originalRange": "[743,57 -> 743,58]",
					"modifiedRange": "[744,57 -> 744,71]"
				},
				{
					"originalRange": "[744,4 -> 744,11]",
					"modifiedRange": "[745,4 -> 745,8]"
				},
				{
					"originalRange": "[744,59 -> 745,6 EOL]",
					"modifiedRange": "[745,56 -> 745,59 EOL]"
				},
				{
					"originalRange": "[746,24 -> 746,25]",
					"modifiedRange": "[746,26 -> 746,26]"
				},
				{
					"originalRange": "[746,37 -> 746,37 EOL]",
					"modifiedRange": "[747,4 -> 750,20 EOL]"
				}
			]
		},
		{
			"originalRange": "[815,815)",
			"modifiedRange": "[819,832)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-ranges/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-ranges/2.tst

```text
Tempor duis sunt laborum aliqua id eu irure.
Consequat aliquip excepteur.
Adipisicing incididunt do magn.
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-ranges/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-ranges/advanced.expected.diff.json

```json
{
	"original": {
		"content": "",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "Tempor duis sunt laborum aliqua id eu irure.\nConsequat aliquip excepteur.\nAdipisicing incididunt do magn.\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,5)",
			"innerChanges": [
				{
					"originalRange": "[1,1 -> 1,1 EOL]",
					"modifiedRange": "[1,1 -> 4,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/invalid-ranges/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/invalid-ranges/legacy.expected.diff.json

```json
{
	"original": {
		"content": "",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "Tempor duis sunt laborum aliqua id eu irure.\nConsequat aliquip excepteur.\nAdipisicing incididunt do magn.\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,5)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-131091/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-131091/1.tst

```text
{
	if (A) {
		if (B) {
			doit
		}
	}
}
C
X
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-131091/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-131091/2.tst

```text
{
	if (A && B) {
		doit
	}
}
C
Y
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-131091/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-131091/advanced.expected.diff.json

```json
{
	"original": {
		"content": "{\n\tif (A) {\n\t\tif (B) {\n\t\t\tdoit\n\t\t}\n\t}\n}\nC\nX\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "{\n\tif (A && B) {\n\t\tdoit\n\t}\n}\nC\nY\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,6)",
			"modifiedRange": "[2,4)",
			"innerChanges": [
				{
					"originalRange": "[2,7 -> 3,7]",
					"modifiedRange": "[2,7 -> 2,11]"
				},
				{
					"originalRange": "[4,1 -> 4,2]",
					"modifiedRange": "[3,1 -> 3,1]"
				},
				{
					"originalRange": "[5,1 -> 6,1]",
					"modifiedRange": "[4,1 -> 4,1]"
				}
			]
		},
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[7,8)",
			"innerChanges": [
				{
					"originalRange": "[9,1 -> 9,2 EOL]",
					"modifiedRange": "[7,1 -> 7,2 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-131091/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-131091/legacy.expected.diff.json

```json
{
	"original": {
		"content": "{\n\tif (A) {\n\t\tif (B) {\n\t\t\tdoit\n\t\t}\n\t}\n}\nC\nX\n",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "{\n\tif (A && B) {\n\t\tdoit\n\t}\n}\nC\nY\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[2,8)",
			"modifiedRange": "[2,6)",
			"innerChanges": null
		},
		{
			"originalRange": "[9,10)",
			"modifiedRange": "[7,8)",
			"innerChanges": [
				{
					"originalRange": "[9,1 -> 9,2 EOL]",
					"modifiedRange": "[7,1 -> 7,2 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-185779/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-185779/1.txt

```text

	private doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		// Add view
		const container = $('.split-view-view');

		if (index === this.viewItems.length) {
			this.viewContainer.appendChild(container);
		} else {
			this.viewContainer.insertBefore(container, this.viewContainer.children.item(index));
		}

		const onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));
		const containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));
		const disposable = combinedDisposable(onChangeDisposable, containerDisposable);

		let viewSize: ViewItemSize;

		if (typeof size === 'number') {
			viewSize = size;
		} else if (size.type === 'split') {
			viewSize = this.getViewSize(size.index) / 2;
		} else if (size.type === 'invisible') {
			viewSize = { cachedVisibleSize: size.cachedVisibleSize };
		} else {
			viewSize = view.minimumSize;
		}

		const item = this.orientation === Orientation.VERTICAL
			? new VerticalViewItem(container, view, viewSize, disposable)
			: new HorizontalViewItem(container, view, viewSize, disposable);

		this.viewItems.splice(index, 0, item);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-185779/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-185779/2.txt

```text

	private doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		// Add view
		const container = $('.split-view-view');

		if (index === this.viewItems.length) {
			this.viewContainer.appendChild(container);
		} else {
			this.viewContainer.insertBefore(container, this.viewContainer.children.item(index));
		}

		const onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));
		const containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));
		const disposable = combinedDisposable(onChangeDisposable, containerDisposable);

		let viewSize: ViewItemSize;

		if (typeof size === 'number') {
			viewSize = size;
		} else {
			if (size.type === 'auto') {
				if (this.areViewsDistributed()) {
					size = { type: 'distribute' };
				} else {
					size = { type: 'split', index: size.index };
				}
			}

			if (size.type === 'split') {
				viewSize = this.getViewSize(size.index) / 2;
			} else if (size.type === 'invisible') {
				viewSize = { cachedVisibleSize: size.cachedVisibleSize };
			} else {
				viewSize = view.minimumSize;
			}
		}

		const item = this.orientation === Orientation.VERTICAL
			? new VerticalViewItem(container, view, viewSize, disposable)
			: new HorizontalViewItem(container, view, viewSize, disposable);

		this.viewItems.splice(index, 0, item);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-185779/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-185779/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\n\tprivate doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {\n\t\tif (this.state !== State.Idle) {\n\t\t\tthrow new Error('Cant modify splitview');\n\t\t}\n\n\t\tthis.state = State.Busy;\n\n\t\t// Add view\n\t\tconst container = $('.split-view-view');\n\n\t\tif (index === this.viewItems.length) {\n\t\t\tthis.viewContainer.appendChild(container);\n\t\t} else {\n\t\t\tthis.viewContainer.insertBefore(container, this.viewContainer.children.item(index));\n\t\t}\n\n\t\tconst onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));\n\t\tconst containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));\n\t\tconst disposable = combinedDisposable(onChangeDisposable, containerDisposable);\n\n\t\tlet viewSize: ViewItemSize;\n\n\t\tif (typeof size === 'number') {\n\t\t\tviewSize = size;\n\t\t} else if (size.type === 'split') {\n\t\t\tviewSize = this.getViewSize(size.index) / 2;\n\t\t} else if (size.type === 'invisible') {\n\t\t\tviewSize = { cachedVisibleSize: size.cachedVisibleSize };\n\t\t} else {\n\t\t\tviewSize = view.minimumSize;\n\t\t}\n\n\t\tconst item = this.orientation === Orientation.VERTICAL\n\t\t\t? new VerticalViewItem(container, view, viewSize, disposable)\n\t\t\t: new HorizontalViewItem(container, view, viewSize, disposable);\n\n\t\tthis.viewItems.splice(index, 0, item);\n\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "\n\tprivate doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {\n\t\tif (this.state !== State.Idle) {\n\t\t\tthrow new Error('Cant modify splitview');\n\t\t}\n\n\t\tthis.state = State.Busy;\n\n\t\t// Add view\n\t\tconst container = $('.split-view-view');\n\n\t\tif (index === this.viewItems.length) {\n\t\t\tthis.viewContainer.appendChild(container);\n\t\t} else {\n\t\t\tthis.viewContainer.insertBefore(container, this.viewContainer.children.item(index));\n\t\t}\n\n\t\tconst onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));\n\t\tconst containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));\n\t\tconst disposable = combinedDisposable(onChangeDisposable, containerDisposable);\n\n\t\tlet viewSize: ViewItemSize;\n\n\t\tif (typeof size === 'number') {\n\t\t\tviewSize = size;\n\t\t} else {\n\t\t\tif (size.type === 'auto') {\n\t\t\t\tif (this.areViewsDistributed()) {\n\t\t\t\t\tsize = { type: 'distribute' };\n\t\t\t\t} else {\n\t\t\t\t\tsize = { type: 'split', index: size.index };\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (size.type === 'split') {\n\t\t\t\tviewSize = this.getViewSize(size.index) / 2;\n\t\t\t} else if (size.type === 'invisible') {\n\t\t\t\tviewSize = { cachedVisibleSize: size.cachedVisibleSize };\n\t\t\t} else {\n\t\t\t\tviewSize = view.minimumSize;\n\t\t\t}\n\t\t}\n\n\t\tconst item = this.orientation === Orientation.VERTICAL\n\t\t\t? new VerticalViewItem(container, view, viewSize, disposable)\n\t\t\t: new HorizontalViewItem(container, view, viewSize, disposable);\n\n\t\tthis.viewItems.splice(index, 0, item);\n\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[26,32)",
			"modifiedRange": "[26,42)",
			"innerChanges": [
				{
					"originalRange": "[26,10 -> 26,10]",
					"modifiedRange": "[26,10 -> 35,4]"
				},
				{
					"originalRange": "[27,1 -> 27,1]",
					"modifiedRange": "[36,1 -> 36,2]"
				},
				{
					"originalRange": "[28,1 -> 28,1]",
					"modifiedRange": "[37,1 -> 37,2]"
				},
				{
					"originalRange": "[29,1 -> 29,1]",
					"modifiedRange": "[38,1 -> 38,2]"
				},
				{
					"originalRange": "[30,1 -> 30,1]",
					"modifiedRange": "[39,1 -> 39,2]"
				},
				{
					"originalRange": "[31,1 -> 31,1]",
					"modifiedRange": "[40,1 -> 40,2]"
				},
				{
					"originalRange": "[32,1 -> 32,1]",
					"modifiedRange": "[41,1 -> 42,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-185779/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-185779/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\n\tprivate doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {\n\t\tif (this.state !== State.Idle) {\n\t\t\tthrow new Error('Cant modify splitview');\n\t\t}\n\n\t\tthis.state = State.Busy;\n\n\t\t// Add view\n\t\tconst container = $('.split-view-view');\n\n\t\tif (index === this.viewItems.length) {\n\t\t\tthis.viewContainer.appendChild(container);\n\t\t} else {\n\t\t\tthis.viewContainer.insertBefore(container, this.viewContainer.children.item(index));\n\t\t}\n\n\t\tconst onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));\n\t\tconst containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));\n\t\tconst disposable = combinedDisposable(onChangeDisposable, containerDisposable);\n\n\t\tlet viewSize: ViewItemSize;\n\n\t\tif (typeof size === 'number') {\n\t\t\tviewSize = size;\n\t\t} else if (size.type === 'split') {\n\t\t\tviewSize = this.getViewSize(size.index) / 2;\n\t\t} else if (size.type === 'invisible') {\n\t\t\tviewSize = { cachedVisibleSize: size.cachedVisibleSize };\n\t\t} else {\n\t\t\tviewSize = view.minimumSize;\n\t\t}\n\n\t\tconst item = this.orientation === Orientation.VERTICAL\n\t\t\t? new VerticalViewItem(container, view, viewSize, disposable)\n\t\t\t: new HorizontalViewItem(container, view, viewSize, disposable);\n\n\t\tthis.viewItems.splice(index, 0, item);\n\n",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "\n\tprivate doAddView(view: IView<TLayoutContext>, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {\n\t\tif (this.state !== State.Idle) {\n\t\t\tthrow new Error('Cant modify splitview');\n\t\t}\n\n\t\tthis.state = State.Busy;\n\n\t\t// Add view\n\t\tconst container = $('.split-view-view');\n\n\t\tif (index === this.viewItems.length) {\n\t\t\tthis.viewContainer.appendChild(container);\n\t\t} else {\n\t\t\tthis.viewContainer.insertBefore(container, this.viewContainer.children.item(index));\n\t\t}\n\n\t\tconst onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));\n\t\tconst containerDisposable = toDisposable(() => this.viewContainer.removeChild(container));\n\t\tconst disposable = combinedDisposable(onChangeDisposable, containerDisposable);\n\n\t\tlet viewSize: ViewItemSize;\n\n\t\tif (typeof size === 'number') {\n\t\t\tviewSize = size;\n\t\t} else {\n\t\t\tif (size.type === 'auto') {\n\t\t\t\tif (this.areViewsDistributed()) {\n\t\t\t\t\tsize = { type: 'distribute' };\n\t\t\t\t} else {\n\t\t\t\t\tsize = { type: 'split', index: size.index };\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (size.type === 'split') {\n\t\t\t\tviewSize = this.getViewSize(size.index) / 2;\n\t\t\t} else if (size.type === 'invisible') {\n\t\t\t\tviewSize = { cachedVisibleSize: size.cachedVisibleSize };\n\t\t\t} else {\n\t\t\t\tviewSize = view.minimumSize;\n\t\t\t}\n\t\t}\n\n\t\tconst item = this.orientation === Orientation.VERTICAL\n\t\t\t? new VerticalViewItem(container, view, viewSize, disposable)\n\t\t\t: new HorizontalViewItem(container, view, viewSize, disposable);\n\n\t\tthis.viewItems.splice(index, 0, item);\n\n",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[26,32)",
			"modifiedRange": "[26,42)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-201713/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-201713/1.tst

```text
const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;
if (deletedCodeLineBreaksComputer) {
	for (const a of alignmentsVal) {
		if (a.diff) {
			for (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {
				deletedCodeLineBreaksComputer?.addRequest(this._editors.original.getModel()!.getLineContent(i), null, null);
			}
		}
	}
}

const lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];
let lineBreakDataIdx = 0;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-201713/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-201713/2.tst

```text
const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;
if (deletedCodeLineBreaksComputer) {
	const originalModel = this._editors.original.getModel()!;
	for (const a of alignmentsVal) {
		if (a.diff) {
			for (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {
				// `i` can be out of bound when the diff has not been updated yet.
				// In this case, we do an early return.
				// TODO@hediet: Fix this by applying the edit directly to the diff model, so that the diff is always valid.
				if (i > originalModel.getLineCount()) {
					return { orig: origViewZones, mod: modViewZones };
				}
				deletedCodeLineBreaksComputer?.addRequest(originalModel.getLineContent(i), null, null);
			}
		}
	}
}

const lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];
let lineBreakDataIdx = 0;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-201713/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-201713/advanced.expected.diff.json

```json
{
	"original": {
		"content": "const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;\nif (deletedCodeLineBreaksComputer) {\n\tfor (const a of alignmentsVal) {\n\t\tif (a.diff) {\n\t\t\tfor (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {\n\t\t\t\tdeletedCodeLineBreaksComputer?.addRequest(this._editors.original.getModel()!.getLineContent(i), null, null);\n\t\t\t}\n\t\t}\n\t}\n}\n\nconst lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];\nlet lineBreakDataIdx = 0;",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;\nif (deletedCodeLineBreaksComputer) {\n\tconst originalModel = this._editors.original.getModel()!;\n\tfor (const a of alignmentsVal) {\n\t\tif (a.diff) {\n\t\t\tfor (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {\n\t\t\t\t// `i` can be out of bound when the diff has not been updated yet.\n\t\t\t\t// In this case, we do an early return.\n\t\t\t\t// TODO@hediet: Fix this by applying the edit directly to the diff model, so that the diff is always valid.\n\t\t\t\tif (i > originalModel.getLineCount()) {\n\t\t\t\t\treturn { orig: origViewZones, mod: modViewZones };\n\t\t\t\t}\n\t\t\t\tdeletedCodeLineBreaksComputer?.addRequest(originalModel.getLineContent(i), null, null);\n\t\t\t}\n\t\t}\n\t}\n}\n\nconst lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];\nlet lineBreakDataIdx = 0;",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,3)",
			"modifiedRange": "[3,4)",
			"innerChanges": [
				{
					"originalRange": "[3,1 -> 3,1]",
					"modifiedRange": "[3,1 -> 4,1]"
				}
			]
		},
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[7,14)",
			"innerChanges": [
				{
					"originalRange": "[6,1 -> 6,34]",
					"modifiedRange": "[7,1 -> 13,34]"
				},
				{
					"originalRange": "[6,47 -> 6,61]",
					"modifiedRange": "[13,47 -> 13,47]"
				},
				{
					"originalRange": "[6,69 -> 6,73]",
					"modifiedRange": "[13,55 -> 13,55]"
				},
				{
					"originalRange": "[6,78 -> 6,81]",
					"modifiedRange": "[13,60 -> 13,60]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-201713/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-201713/legacy.expected.diff.json

```json
{
	"original": {
		"content": "const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;\nif (deletedCodeLineBreaksComputer) {\n\tfor (const a of alignmentsVal) {\n\t\tif (a.diff) {\n\t\t\tfor (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {\n\t\t\t\tdeletedCodeLineBreaksComputer?.addRequest(this._editors.original.getModel()!.getLineContent(i), null, null);\n\t\t\t}\n\t\t}\n\t}\n}\n\nconst lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];\nlet lineBreakDataIdx = 0;",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "const deletedCodeLineBreaksComputer = !renderSideBySide ? this._editors.modified._getViewModel()?.createLineBreaksComputer() : undefined;\nif (deletedCodeLineBreaksComputer) {\n\tconst originalModel = this._editors.original.getModel()!;\n\tfor (const a of alignmentsVal) {\n\t\tif (a.diff) {\n\t\t\tfor (let i = a.originalRange.startLineNumber; i < a.originalRange.endLineNumberExclusive; i++) {\n\t\t\t\t// `i` can be out of bound when the diff has not been updated yet.\n\t\t\t\t// In this case, we do an early return.\n\t\t\t\t// TODO@hediet: Fix this by applying the edit directly to the diff model, so that the diff is always valid.\n\t\t\t\tif (i > originalModel.getLineCount()) {\n\t\t\t\t\treturn { orig: origViewZones, mod: modViewZones };\n\t\t\t\t}\n\t\t\t\tdeletedCodeLineBreaksComputer?.addRequest(originalModel.getLineContent(i), null, null);\n\t\t\t}\n\t\t}\n\t}\n}\n\nconst lineBreakData = deletedCodeLineBreaksComputer?.finalize() ?? [];\nlet lineBreakDataIdx = 0;",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,3)",
			"modifiedRange": "[3,4)",
			"innerChanges": null
		},
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[7,14)",
			"innerChanges": [
				{
					"originalRange": "[6,1 -> 6,1]",
					"modifiedRange": "[7,1 -> 13,1]"
				},
				{
					"originalRange": "[6,47 -> 6,61]",
					"modifiedRange": "[13,47 -> 13,47]"
				},
				{
					"originalRange": "[6,69 -> 6,73]",
					"modifiedRange": "[13,55 -> 13,55]"
				},
				{
					"originalRange": "[6,78 -> 6,81]",
					"modifiedRange": "[13,60 -> 13,60]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/1.tst

```text


		item.row!.domNode.classList.toggle('drop-target', item.dropTarget);
	}


a
x
a
a
a
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/2.tst

```text


		item.row!.domNode.classList.toggle('drop-target', item.dropTarget !== false);
		if (typeof item.dropTarget !== 'boolean') {
			item.row!.domNode.classList.toggle('drop-target-start', item.dropTarget.first);
		}
	}


a
x
a
a
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/advanced.expected.diff.json

```json
{
	"original": {
		"content": "\n\n\t\titem.row!.domNode.classList.toggle('drop-target', item.dropTarget);\n\t}\n\n\na\nx\na\na\na",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\n\n\t\titem.row!.domNode.classList.toggle('drop-target', item.dropTarget !== false);\n\t\tif (typeof item.dropTarget !== 'boolean') {\n\t\t\titem.row!.domNode.classList.toggle('drop-target-start', item.dropTarget.first);\n\t\t}\n\t}\n\n\na\nx\na\na\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,7)",
			"innerChanges": [
				{
					"originalRange": "[3,68 -> 4,1]",
					"modifiedRange": "[3,68 -> 7,1]"
				}
			]
		},
		{
			"originalRange": "[11,12)",
			"modifiedRange": "[14,15)",
			"innerChanges": [
				{
					"originalRange": "[11,1 -> 11,2 EOL]",
					"modifiedRange": "[14,1 -> 14,1 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-202147-trimws/legacy.expected.diff.json

```json
{
	"original": {
		"content": "\n\n\t\titem.row!.domNode.classList.toggle('drop-target', item.dropTarget);\n\t}\n\n\na\nx\na\na\na",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "\n\n\t\titem.row!.domNode.classList.toggle('drop-target', item.dropTarget !== false);\n\t\tif (typeof item.dropTarget !== 'boolean') {\n\t\t\titem.row!.domNode.classList.toggle('drop-target-start', item.dropTarget.first);\n\t\t}\n\t}\n\n\na\nx\na\na\n",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[3,4)",
			"modifiedRange": "[3,7)",
			"innerChanges": [
				{
					"originalRange": "[3,68 -> 3,70 EOL]",
					"modifiedRange": "[3,68 -> 6,4 EOL]"
				}
			]
		},
		{
			"originalRange": "[11,12)",
			"modifiedRange": "[14,15)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-204948/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-204948/1.txt

```text
    "@babel/types" "^7.22.15"

"@babel/traverse@^7.23.9":
  version "7.23.9"
  resolved "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305"
  integrity sha512-tY3mM8rH9jM0YHFGyfC0/xf+SB5eKUu7HPj7/k3fpi9dAlsMc5YbQvDi0Sh2QTPXqMhyaAtzAr807TIyfQrmyg==
  dependencies:
    "@babel/code-frame" "^7.23.5"
    "@babel/generator" "^7.23.6"
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-204948/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-204948/2.txt

```text
    "@babel/types" "^7.22.15"

"@babel/traverse@^7.23.9":
  version "7.23.9"
  resolved "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305"
  integrity sha512-I/4UJ9vs90OkBtY6iiiTORVMyIhJ4kAVmsKo9KFc8UOxMeUfi2hvtIBsET5u9GizXE6/GFSuKCTNfgCswuEjRg==
  dependencies:
    "@babel/code-frame" "^7.23.5"
    "@babel/generator" "^7.23.6"
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-204948/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-204948/advanced.expected.diff.json

```json
{
	"original": {
		"content": "    \"@babel/types\" \"^7.22.15\"\n\n\"@babel/traverse@^7.23.9\":\n  version \"7.23.9\"\n  resolved \"https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305\"\n  integrity sha512-tY3mM8rH9jM0YHFGyfC0/xf+SB5eKUu7HPj7/k3fpi9dAlsMc5YbQvDi0Sh2QTPXqMhyaAtzAr807TIyfQrmyg==\n  dependencies:\n    \"@babel/code-frame\" \"^7.23.5\"\n    \"@babel/generator\" \"^7.23.6\"",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "    \"@babel/types\" \"^7.22.15\"\n\n\"@babel/traverse@^7.23.9\":\n  version \"7.23.9\"\n  resolved \"https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305\"\n  integrity sha512-I/4UJ9vs90OkBtY6iiiTORVMyIhJ4kAVmsKo9KFc8UOxMeUfi2hvtIBsET5u9GizXE6/GFSuKCTNfgCswuEjRg==\n  dependencies:\n    \"@babel/code-frame\" \"^7.23.5\"\n    \"@babel/generator\" \"^7.23.6\"",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,20 -> 7,1]",
					"modifiedRange": "[6,20 -> 7,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-204948/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-204948/legacy.expected.diff.json

```json
{
	"original": {
		"content": "    \"@babel/types\" \"^7.22.15\"\n\n\"@babel/traverse@^7.23.9\":\n  version \"7.23.9\"\n  resolved \"https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305\"\n  integrity sha512-tY3mM8rH9jM0YHFGyfC0/xf+SB5eKUu7HPj7/k3fpi9dAlsMc5YbQvDi0Sh2QTPXqMhyaAtzAr807TIyfQrmyg==\n  dependencies:\n    \"@babel/code-frame\" \"^7.23.5\"\n    \"@babel/generator\" \"^7.23.6\"",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "    \"@babel/types\" \"^7.22.15\"\n\n\"@babel/traverse@^7.23.9\":\n  version \"7.23.9\"\n  resolved \"https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.23.7.tgz#9a7bf285c928cb99b5ead19c3b1ce5b310c9c305\"\n  integrity sha512-I/4UJ9vs90OkBtY6iiiTORVMyIhJ4kAVmsKo9KFc8UOxMeUfi2hvtIBsET5u9GizXE6/GFSuKCTNfgCswuEjRg==\n  dependencies:\n    \"@babel/code-frame\" \"^7.23.5\"\n    \"@babel/generator\" \"^7.23.6\"",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[6,7)",
			"modifiedRange": "[6,7)",
			"innerChanges": [
				{
					"originalRange": "[6,20 -> 6,105]",
					"modifiedRange": "[6,20 -> 6,105]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-214049/1.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-214049/1.txt

```text
hello world; 
y
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-214049/2.txt]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-214049/2.txt

```text
hello world;
// new line
y
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-214049/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-214049/advanced.expected.diff.json

```json
{
	"diffs": [
		{
			"innerChanges": [
				{
					"modifiedRange": "[1,13 -> 1,13 EOL]",
					"originalRange": "[1,13 -> 1,14 EOL]"
				},
				{
					"modifiedRange": "[2,1 -> 3,1]",
					"originalRange": "[2,1 -> 2,1]"
				}
			],
			"modifiedRange": "[1,3)",
			"originalRange": "[1,2)"
		}
	],
	"modified": {
		"content": "hello world;\n// new line\ny",
		"fileName": "./2.txt"
	},
	"original": {
		"content": "hello world; \ny",
		"fileName": "./1.txt"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/issue-214049/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/issue-214049/legacy.expected.diff.json

```json
{
	"original": {
		"content": "hello world; \ny",
		"fileName": "./1.txt"
	},
	"modified": {
		"content": "hello world;\n// new line\ny",
		"fileName": "./2.txt"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,3)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/json-brackets/1.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/json-brackets/1.json

```json
{
	"editor": [
		{
			"name": "vs/platform",
			"project": "vscode-editor"
		},
		{
			"name": "vs/editor/contrib",
			"project": "vscode-editor"
		},
		{
			"name": "vs/editor",
			"project": "vscode-editor"
		},
		{
			"name": "vs/base",
			"project": "vscode-editor"
		}
	],
	"workbench": [
		{
			"name": "vs/code",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/api/common",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/bulkEdit",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/cli",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/codeEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/callHierarchy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/typeHierarchy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/codeActions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/comments",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/debug",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/dialogs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/emmet",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/experiments",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/extensions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/externalTerminal",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/feedback",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/files",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/html",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/issue",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/inlayHints",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/interactive",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/languageStatus",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/keybindings",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/markers",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/mergeEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/localization",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/logs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/output",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/performance",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/preferences",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/notebook",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/quickaccess",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userData",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/remote",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/relauncher",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/sash",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/scm",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/search",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/searchEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/snippets",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/format",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/tags",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/surveys",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/tasks",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/testing",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/terminal",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/themes",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/trust",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/update",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/url",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/watermark",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/webview",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/webviewPanel",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/workspace",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/workspaces",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/customEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/externalUriOpener",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeGettingStarted",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeOverlay",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomePage",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeViews",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeWalkthrough",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/outline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userDataSync",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/editSessions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/views",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/languageDetection",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/audioCues",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/deprecatedExtensionMigrator",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/offline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/actions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/authToken",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/backup",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/bulkEdit",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/clipboard",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/commands",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/configuration",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/configurationResolver",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/dialogs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/editor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensionManagement",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/files",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/history",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/log",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/integrity",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/keybinding",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/lifecycle",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/language",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/progress",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/remote",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/search",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/textfile",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/themes",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/textMate",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/workingCopy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/workspaces",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/decorations",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/label",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/preferences",
			"project": "vscode-preferences"
		},
		{
			"name": "vs/workbench/services/notification",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/userData",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/userDataSync",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/editSessions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/views",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/timeline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/localHistory",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/authentication",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensionRecommendations",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/gettingStarted",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/host",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userDataProfile",
			"project": "vscode-profiles"
		},
		{
			"name": "vs/workbench/services/userDataProfile",
			"project": "vscode-profiles"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/json-brackets/2.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/json-brackets/2.json

```json
{
	"editor": [
		{
			"name": "vs/platform",
			"project": "vscode-editor"
		},
		{
			"name": "vs/editor/contrib",
			"project": "vscode-editor"
		},
		{
			"name": "vs/editor",
			"project": "vscode-editor"
		},
		{
			"name": "vs/base",
			"project": "vscode-editor"
		}
	],
	"workbench": [
		{
			"name": "vs/code",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/api/common",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/bulkEdit",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/cli",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/codeEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/callHierarchy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/typeHierarchy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/codeActions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/comments",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/debug",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/dialogs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/emmet",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/experiments",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/extensions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/externalTerminal",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/feedback",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/files",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/html",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/issue",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/inlayHints",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/interactive",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/languageStatus",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/keybindings",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/markers",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/mergeEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/localization",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/logs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/output",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/performance",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/preferences",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/notebook",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/quickaccess",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userData",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/remote",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/relauncher",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/sash",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/scm",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/search",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/searchEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/snippets",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/format",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/tags",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/surveys",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/tasks",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/testing",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/terminal",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/themes",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/trust",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/update",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/url",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/watermark",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/webview",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/webviewPanel",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/workspace",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/workspaces",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/customEditor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/externalUriOpener",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeGettingStarted",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeOverlay",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomePage",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeViews",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/welcomeWalkthrough",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/outline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userDataSync",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/editSessions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/views",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/languageDetection",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/audioCues",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/deprecatedExtensionMigrator",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/bracketPairColorizer2Telemetry",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/offline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/actions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/authToken",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/backup",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/bulkEdit",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/clipboard",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/commands",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/configuration",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/configurationResolver",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/dialogs",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/editor",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensionManagement",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/files",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/history",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/log",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/integrity",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/keybinding",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/lifecycle",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/language",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/progress",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/remote",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/search",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/textfile",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/themes",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/textMate",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/workingCopy",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/workspaces",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/decorations",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/label",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/preferences",
			"project": "vscode-preferences"
		},
		{
			"name": "vs/workbench/services/notification",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/userData",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/userDataSync",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/editSessions",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/views",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/timeline",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/localHistory",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/authentication",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/extensionRecommendations",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/gettingStarted",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/services/host",
			"project": "vscode-workbench"
		},
		{
			"name": "vs/workbench/contrib/userDataProfile",
			"project": "vscode-profiles"
		},
		{
			"name": "vs/workbench/services/userDataProfile",
			"project": "vscode-profiles"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/json-brackets/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/json-brackets/advanced.expected.diff.json

```json
{
	"original": {
		"content": "{\n\t\"editor\": [\n\t\t{\n\t\t\t\"name\": \"vs/platform\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor/contrib\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/base\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t}\n\t],\n\t\"workbench\": [\n\t\t{\n\t\t\t\"name\": \"vs/code\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/api/common\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/cli\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/callHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/typeHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeActions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/comments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/debug\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/emmet\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/experiments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalTerminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/feedback\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/html\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/issue\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/inlayHints\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/interactive\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageStatus\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/keybindings\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/markers\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/mergeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localization\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/logs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/output\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/performance\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/preferences\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/notebook\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/quickaccess\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/relauncher\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/sash\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/scm\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/searchEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/snippets\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/format\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tags\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/surveys\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tasks\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/testing\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/terminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/trust\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/update\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/url\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/watermark\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webview\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webviewPanel\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspace\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/customEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalUriOpener\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeGettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeOverlay\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomePage\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeViews\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeWalkthrough\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/outline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageDetection\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/audioCues\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/deprecatedExtensionMigrator\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/offline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/actions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authToken\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/backup\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/clipboard\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/commands\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configuration\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configurationResolver\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionManagement\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/history\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/log\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/integrity\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/keybinding\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/lifecycle\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/language\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/progress\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textfile\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textMate\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workingCopy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/decorations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/label\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/preferences\",\n\t\t\t\"project\": \"vscode-preferences\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/notification\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/timeline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localHistory\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authentication\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionRecommendations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/gettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/host\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t}\n\t]\n}\n",
		"fileName": "./1.json"
	},
	"modified": {
		"content": "{\n\t\"editor\": [\n\t\t{\n\t\t\t\"name\": \"vs/platform\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor/contrib\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/base\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t}\n\t],\n\t\"workbench\": [\n\t\t{\n\t\t\t\"name\": \"vs/code\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/api/common\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/cli\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/callHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/typeHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeActions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/comments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/debug\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/emmet\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/experiments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalTerminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/feedback\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/html\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/issue\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/inlayHints\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/interactive\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageStatus\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/keybindings\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/markers\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/mergeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localization\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/logs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/output\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/performance\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/preferences\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/notebook\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/quickaccess\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/relauncher\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/sash\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/scm\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/searchEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/snippets\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/format\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tags\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/surveys\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tasks\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/testing\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/terminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/trust\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/update\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/url\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/watermark\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webview\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webviewPanel\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspace\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/customEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalUriOpener\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeGettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeOverlay\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomePage\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeViews\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeWalkthrough\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/outline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageDetection\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/audioCues\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/deprecatedExtensionMigrator\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bracketPairColorizer2Telemetry\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/offline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/actions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authToken\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/backup\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/clipboard\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/commands\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configuration\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configurationResolver\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionManagement\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/history\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/log\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/integrity\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/keybinding\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/lifecycle\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/language\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/progress\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textfile\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textMate\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workingCopy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/decorations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/label\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/preferences\",\n\t\t\t\"project\": \"vscode-preferences\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/notification\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/timeline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localHistory\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authentication\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionRecommendations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/gettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/host\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t}\n\t]\n}\n",
		"fileName": "./2.json"
	},
	"diffs": [
		{
			"originalRange": "[301,301)",
			"modifiedRange": "[301,305)",
			"innerChanges": [
				{
					"originalRange": "[301,1 -> 301,1]",
					"modifiedRange": "[301,1 -> 305,1]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/json-brackets/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/json-brackets/legacy.expected.diff.json

```json
{
	"original": {
		"content": "{\n\t\"editor\": [\n\t\t{\n\t\t\t\"name\": \"vs/platform\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor/contrib\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/base\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t}\n\t],\n\t\"workbench\": [\n\t\t{\n\t\t\t\"name\": \"vs/code\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/api/common\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/cli\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/callHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/typeHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeActions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/comments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/debug\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/emmet\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/experiments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalTerminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/feedback\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/html\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/issue\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/inlayHints\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/interactive\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageStatus\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/keybindings\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/markers\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/mergeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localization\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/logs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/output\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/performance\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/preferences\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/notebook\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/quickaccess\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/relauncher\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/sash\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/scm\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/searchEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/snippets\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/format\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tags\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/surveys\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tasks\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/testing\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/terminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/trust\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/update\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/url\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/watermark\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webview\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webviewPanel\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspace\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/customEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalUriOpener\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeGettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeOverlay\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomePage\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeViews\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeWalkthrough\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/outline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageDetection\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/audioCues\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/deprecatedExtensionMigrator\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/offline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/actions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authToken\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/backup\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/clipboard\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/commands\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configuration\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configurationResolver\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionManagement\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/history\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/log\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/integrity\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/keybinding\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/lifecycle\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/language\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/progress\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textfile\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textMate\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workingCopy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/decorations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/label\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/preferences\",\n\t\t\t\"project\": \"vscode-preferences\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/notification\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/timeline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localHistory\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authentication\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionRecommendations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/gettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/host\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t}\n\t]\n}\n",
		"fileName": "./1.json"
	},
	"modified": {
		"content": "{\n\t\"editor\": [\n\t\t{\n\t\t\t\"name\": \"vs/platform\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor/contrib\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/editor\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/base\",\n\t\t\t\"project\": \"vscode-editor\"\n\t\t}\n\t],\n\t\"workbench\": [\n\t\t{\n\t\t\t\"name\": \"vs/code\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/api/common\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/cli\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/callHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/typeHierarchy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/codeActions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/comments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/debug\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/emmet\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/experiments\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalTerminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/feedback\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/html\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/issue\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/inlayHints\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/interactive\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageStatus\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/keybindings\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/markers\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/mergeEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localization\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/logs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/output\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/performance\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/preferences\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/notebook\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/quickaccess\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/relauncher\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/sash\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/scm\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/searchEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/snippets\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/format\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tags\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/surveys\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/tasks\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/testing\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/terminal\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/trust\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/update\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/url\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/watermark\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webview\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/webviewPanel\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspace\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/customEditor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/externalUriOpener\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeGettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeOverlay\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomePage\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeViews\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/welcomeWalkthrough\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/outline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/languageDetection\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/audioCues\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/deprecatedExtensionMigrator\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/bracketPairColorizer2Telemetry\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/offline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/actions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authToken\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/backup\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/bulkEdit\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/clipboard\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/commands\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configuration\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/configurationResolver\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/dialogs\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editor\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionManagement\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/files\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/history\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/log\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/integrity\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/keybinding\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/lifecycle\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/language\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/progress\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/remote\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/search\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textfile\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/themes\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/textMate\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workingCopy\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/workspaces\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/decorations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/label\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/preferences\",\n\t\t\t\"project\": \"vscode-preferences\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/notification\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userData\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataSync\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/editSessions\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/views\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/timeline\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/localHistory\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/authentication\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/extensionRecommendations\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/gettingStarted\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/host\",\n\t\t\t\"project\": \"vscode-workbench\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/contrib/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t},\n\t\t{\n\t\t\t\"name\": \"vs/workbench/services/userDataProfile\",\n\t\t\t\"project\": \"vscode-profiles\"\n\t\t}\n\t]\n}\n",
		"fileName": "./2.json"
	},
	"diffs": [
		{
			"originalRange": "[302,302)",
			"modifiedRange": "[302,306)",
			"innerChanges": null
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/just-whitespace/1.js]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/just-whitespace/1.js

```javascript
console.log('foo');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/just-whitespace/2.js]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/just-whitespace/2.js

```javascript
console.log('foo');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/just-whitespace/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/just-whitespace/advanced.expected.diff.json

```json
{
	"original": {
		"content": "console.log('foo'); ",
		"fileName": "./1.js"
	},
	"modified": {
		"content": "console.log('foo');",
		"fileName": "./2.js"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,20 -> 1,21 EOL]",
					"modifiedRange": "[1,20 -> 1,20 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/just-whitespace/legacy.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/just-whitespace/legacy.expected.diff.json

```json
{
	"original": {
		"content": "console.log('foo'); ",
		"fileName": "./1.js"
	},
	"modified": {
		"content": "console.log('foo');",
		"fileName": "./2.js"
	},
	"diffs": [
		{
			"originalRange": "[1,2)",
			"modifiedRange": "[1,2)",
			"innerChanges": [
				{
					"originalRange": "[1,20 -> 1,21 EOL]",
					"modifiedRange": "[1,20 -> 1,20 EOL]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/method-splitting/1.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/method-splitting/1.tst

```text
class Test {
    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {
		return null!;
	}

	public getInlineDecorationsOnLine(lineNumber: number): InlineDecoration[] {
		const range = new Range(lineNumber, this._linesCollection.getViewLineMinColumn(lineNumber), lineNumber, this._linesCollection.getViewLineMaxColumn(lineNumber));
		return this._getDecorationsInRange(range).inlineDecorations[0];
	}

	private _getDecorationsInRange(viewRange: Range): IDecorationsViewportData {
		const modelDecorations = this._linesCollection.getDecorationsInRange(viewRange, this.editorId, filterValidationDecorations(this.configuration.options));
		const startLineNumber = viewRange.startLineNumber;
		const endLineNumber = viewRange.endLineNumber;

		const decorationsInViewport: ViewModelDecoration[] = [];
		let decorationsInViewportLen = 0;
		const inlineDecorations: InlineDecoration[][] = [];
		for (let j = startLineNumber; j <= endLineNumber; j++) {
			inlineDecorations[j - startLineNumber] = [];
		}

		for (let i = 0, len = modelDecorations.length; i < len; i++) {
			const modelDecoration = modelDecorations[i];
			const decorationOptions = modelDecoration.options;

			if (!isModelDecorationVisible(this.model, modelDecoration)) {
				continue;
			}

			const viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);
			const viewRange = viewModelDecoration.range;

			decorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;

			if (decorationOptions.inlineClassName) {
				const inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);
				const intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);
				const intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);
				for (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {
					inlineDecorations[j - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.beforeContentClassName) {
				if (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),
						decorationOptions.beforeContentClassName,
						InlineDecorationType.Before
					);
					inlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.afterContentClassName) {
				if (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),
						decorationOptions.afterContentClassName,
						InlineDecorationType.After
					);
					inlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
		}

		return {
			decorations: decorationsInViewport,
			inlineDecorations: inlineDecorations
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/method-splitting/2.tst]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/method-splitting/2.tst

```text
class Test {
    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {
		return null!;
	}

	private _getDecorationsViewportData(viewportRange: Range, onlyMinimapDecorations: boolean): IDecorationsViewportData {
		const modelDecorations = this._linesCollection.getDecorationsInRange(viewportRange, this.editorId, filterValidationDecorations(this.configuration.options), onlyMinimapDecorations);

		const startLineNumber = viewportRange.startLineNumber;
		const endLineNumber = viewportRange.endLineNumber;

		const decorationsInViewport: ViewModelDecoration[] = [];
		let decorationsInViewportLen = 0;
		const inlineDecorations: InlineDecoration[][] = [];
		for (let j = startLineNumber; j <= endLineNumber; j++) {
			inlineDecorations[j - startLineNumber] = [];
		}

		for (let i = 0, len = modelDecorations.length; i < len; i++) {
			const modelDecoration = modelDecorations[i];
			const decorationOptions = modelDecoration.options;

			if (!isModelDecorationVisible(this.model, modelDecoration)) {
				continue;
			}

			const viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);
			const viewRange = viewModelDecoration.range;

			decorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;

			if (decorationOptions.inlineClassName) {
				const inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);
				const intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);
				const intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);
				for (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {
					inlineDecorations[j - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.beforeContentClassName) {
				if (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),
						decorationOptions.beforeContentClassName,
						InlineDecorationType.Before
					);
					inlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
			if (decorationOptions.afterContentClassName) {
				if (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {
					const inlineDecoration = new InlineDecoration(
						new Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),
						decorationOptions.afterContentClassName,
						InlineDecorationType.After
					);
					inlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);
				}
			}
		}

		return {
			decorations: decorationsInViewport,
			inlineDecorations: inlineDecorations
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/test/node/diffing/fixtures/method-splitting/advanced.expected.diff.json]---
Location: vscode-main/src/vs/editor/test/node/diffing/fixtures/method-splitting/advanced.expected.diff.json

```json
{
	"original": {
		"content": "class Test {\n    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {\n\t\treturn null!;\n\t}\n\n\tpublic getInlineDecorationsOnLine(lineNumber: number): InlineDecoration[] {\n\t\tconst range = new Range(lineNumber, this._linesCollection.getViewLineMinColumn(lineNumber), lineNumber, this._linesCollection.getViewLineMaxColumn(lineNumber));\n\t\treturn this._getDecorationsInRange(range).inlineDecorations[0];\n\t}\n\n\tprivate _getDecorationsInRange(viewRange: Range): IDecorationsViewportData {\n\t\tconst modelDecorations = this._linesCollection.getDecorationsInRange(viewRange, this.editorId, filterValidationDecorations(this.configuration.options));\n\t\tconst startLineNumber = viewRange.startLineNumber;\n\t\tconst endLineNumber = viewRange.endLineNumber;\n\n\t\tconst decorationsInViewport: ViewModelDecoration[] = [];\n\t\tlet decorationsInViewportLen = 0;\n\t\tconst inlineDecorations: InlineDecoration[][] = [];\n\t\tfor (let j = startLineNumber; j <= endLineNumber; j++) {\n\t\t\tinlineDecorations[j - startLineNumber] = [];\n\t\t}\n\n\t\tfor (let i = 0, len = modelDecorations.length; i < len; i++) {\n\t\t\tconst modelDecoration = modelDecorations[i];\n\t\t\tconst decorationOptions = modelDecoration.options;\n\n\t\t\tif (!isModelDecorationVisible(this.model, modelDecoration)) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);\n\t\t\tconst viewRange = viewModelDecoration.range;\n\n\t\t\tdecorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;\n\n\t\t\tif (decorationOptions.inlineClassName) {\n\t\t\t\tconst inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);\n\t\t\t\tconst intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);\n\t\t\t\tconst intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);\n\t\t\t\tfor (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {\n\t\t\t\t\tinlineDecorations[j - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.beforeContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),\n\t\t\t\t\t\tdecorationOptions.beforeContentClassName,\n\t\t\t\t\t\tInlineDecorationType.Before\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.afterContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),\n\t\t\t\t\t\tdecorationOptions.afterContentClassName,\n\t\t\t\t\t\tInlineDecorationType.After\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn {\n\t\t\tdecorations: decorationsInViewport,\n\t\t\tinlineDecorations: inlineDecorations\n\t\t};\n\t}\n}",
		"fileName": "./1.tst"
	},
	"modified": {
		"content": "class Test {\n    public getDecorationsViewportData(viewRange: Range): IDecorationsViewportData {\n\t\treturn null!;\n\t}\n\n\tprivate _getDecorationsViewportData(viewportRange: Range, onlyMinimapDecorations: boolean): IDecorationsViewportData {\n\t\tconst modelDecorations = this._linesCollection.getDecorationsInRange(viewportRange, this.editorId, filterValidationDecorations(this.configuration.options), onlyMinimapDecorations);\n\n\t\tconst startLineNumber = viewportRange.startLineNumber;\n\t\tconst endLineNumber = viewportRange.endLineNumber;\n\n\t\tconst decorationsInViewport: ViewModelDecoration[] = [];\n\t\tlet decorationsInViewportLen = 0;\n\t\tconst inlineDecorations: InlineDecoration[][] = [];\n\t\tfor (let j = startLineNumber; j <= endLineNumber; j++) {\n\t\t\tinlineDecorations[j - startLineNumber] = [];\n\t\t}\n\n\t\tfor (let i = 0, len = modelDecorations.length; i < len; i++) {\n\t\t\tconst modelDecoration = modelDecorations[i];\n\t\t\tconst decorationOptions = modelDecoration.options;\n\n\t\t\tif (!isModelDecorationVisible(this.model, modelDecoration)) {\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tconst viewModelDecoration = this._getOrCreateViewModelDecoration(modelDecoration);\n\t\t\tconst viewRange = viewModelDecoration.range;\n\n\t\t\tdecorationsInViewport[decorationsInViewportLen++] = viewModelDecoration;\n\n\t\t\tif (decorationOptions.inlineClassName) {\n\t\t\t\tconst inlineDecoration = new InlineDecoration(viewRange, decorationOptions.inlineClassName, decorationOptions.inlineClassNameAffectsLetterSpacing ? InlineDecorationType.RegularAffectingLetterSpacing : InlineDecorationType.Regular);\n\t\t\t\tconst intersectedStartLineNumber = Math.max(startLineNumber, viewRange.startLineNumber);\n\t\t\t\tconst intersectedEndLineNumber = Math.min(endLineNumber, viewRange.endLineNumber);\n\t\t\t\tfor (let j = intersectedStartLineNumber; j <= intersectedEndLineNumber; j++) {\n\t\t\t\t\tinlineDecorations[j - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.beforeContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.startLineNumber && viewRange.startLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.startLineNumber, viewRange.startColumn, viewRange.startLineNumber, viewRange.startColumn),\n\t\t\t\t\t\tdecorationOptions.beforeContentClassName,\n\t\t\t\t\t\tInlineDecorationType.Before\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.startLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (decorationOptions.afterContentClassName) {\n\t\t\t\tif (startLineNumber <= viewRange.endLineNumber && viewRange.endLineNumber <= endLineNumber) {\n\t\t\t\t\tconst inlineDecoration = new InlineDecoration(\n\t\t\t\t\t\tnew Range(viewRange.endLineNumber, viewRange.endColumn, viewRange.endLineNumber, viewRange.endColumn),\n\t\t\t\t\t\tdecorationOptions.afterContentClassName,\n\t\t\t\t\t\tInlineDecorationType.After\n\t\t\t\t\t);\n\t\t\t\t\tinlineDecorations[viewRange.endLineNumber - startLineNumber].push(inlineDecoration);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\treturn {\n\t\t\tdecorations: decorationsInViewport,\n\t\t\tinlineDecorations: inlineDecorations\n\t\t};\n\t}\n}",
		"fileName": "./2.tst"
	},
	"diffs": [
		{
			"originalRange": "[6,15)",
			"modifiedRange": "[6,11)",
			"innerChanges": [
				{
					"originalRange": "[6,1 -> 11,49]",
					"modifiedRange": "[6,1 -> 6,91]"
				},
				{
					"originalRange": "[12,76 -> 12,76]",
					"modifiedRange": "[7,76 -> 7,80]"
				},
				{
					"originalRange": "[12,153 -> 12,153]",
					"modifiedRange": "[7,157 -> 7,181]"
				},
				{
					"originalRange": "[13,1 -> 13,1]",
					"modifiedRange": "[8,1 -> 9,1]"
				},
				{
					"originalRange": "[13,31 -> 13,31]",
					"modifiedRange": "[9,31 -> 9,35]"
				},
				{
					"originalRange": "[14,29 -> 14,29]",
					"modifiedRange": "[10,29 -> 10,33]"
				}
			]
		}
	]
}
```

--------------------------------------------------------------------------------

````

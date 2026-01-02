---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 42
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 42 of 552)

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

---[FILE: extensions/github/src/credentialProvider.ts]---
Location: vscode-main/extensions/github/src/credentialProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CredentialsProvider, Credentials, API as GitAPI } from './typings/git.js';
import { workspace, Uri, Disposable } from 'vscode';
import { getSession } from './auth.js';

const EmptyDisposable: Disposable = { dispose() { } };

class GitHubCredentialProvider implements CredentialsProvider {

	async getCredentials(host: Uri): Promise<Credentials | undefined> {
		if (!/github\.com/i.test(host.authority)) {
			return;
		}

		const session = await getSession();
		return { username: session.account.id, password: session.accessToken };
	}
}

export class GithubCredentialProviderManager {

	private providerDisposable: Disposable = EmptyDisposable;
	private readonly disposable: Disposable;

	private _enabled = false;
	private set enabled(enabled: boolean) {
		if (this._enabled === enabled) {
			return;
		}

		this._enabled = enabled;

		if (enabled) {
			this.providerDisposable = this.gitAPI.registerCredentialsProvider(new GitHubCredentialProvider());
		} else {
			this.providerDisposable.dispose();
		}
	}

	constructor(private gitAPI: GitAPI) {
		this.disposable = workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('github')) {
				this.refresh();
			}
		});

		this.refresh();
	}

	private refresh(): void {
		const config = workspace.getConfiguration('github', null);
		const enabled = config.get<boolean>('gitAuthentication', true);
		this.enabled = !!enabled;
	}

	dispose(): void {
		this.enabled = false;
		this.disposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/extension.ts]---
Location: vscode-main/extensions/github/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commands, Disposable, ExtensionContext, extensions, l10n, LogLevel, LogOutputChannel, window } from 'vscode';
import { TelemetryReporter } from '@vscode/extension-telemetry';
import { GithubRemoteSourceProvider } from './remoteSourceProvider.js';
import { API, GitExtension } from './typings/git.js';
import { registerCommands } from './commands.js';
import { GithubCredentialProviderManager } from './credentialProvider.js';
import { DisposableStore, repositoryHasGitHubRemote } from './util.js';
import { GithubPushErrorHandler } from './pushErrorHandler.js';
import { GitBaseExtension } from './typings/git-base.js';
import { GithubRemoteSourcePublisher } from './remoteSourcePublisher.js';
import { GitHubBranchProtectionProviderManager } from './branchProtection.js';
import { GitHubCanonicalUriProvider } from './canonicalUriProvider.js';
import { VscodeDevShareProvider } from './shareProviders.js';
import { GitHubSourceControlHistoryItemDetailsProvider } from './historyItemDetailsProvider.js';
import { OctokitService } from './auth.js';

export function activate(context: ExtensionContext): void {
	const disposables: Disposable[] = [];
	context.subscriptions.push(new Disposable(() => Disposable.from(...disposables).dispose()));

	const logger = window.createOutputChannel('GitHub', { log: true });
	disposables.push(logger);

	const onDidChangeLogLevel = (logLevel: LogLevel) => {
		logger.appendLine(l10n.t('Log level: {0}', LogLevel[logLevel]));
	};
	disposables.push(logger.onDidChangeLogLevel(onDidChangeLogLevel));
	onDidChangeLogLevel(logger.logLevel);

	const { aiKey } = context.extension.packageJSON as { aiKey: string };
	const telemetryReporter = new TelemetryReporter(aiKey);
	disposables.push(telemetryReporter);

	const octokitService = new OctokitService();
	disposables.push(octokitService);

	disposables.push(initializeGitBaseExtension());
	disposables.push(initializeGitExtension(context, octokitService, telemetryReporter, logger));
}

function initializeGitBaseExtension(): Disposable {
	const disposables = new DisposableStore();

	const initialize = () => {
		try {
			const gitBaseAPI = gitBaseExtension.getAPI(1);

			disposables.add(gitBaseAPI.registerRemoteSourceProvider(new GithubRemoteSourceProvider()));
		}
		catch (err) {
			console.error('Could not initialize GitHub extension');
			console.warn(err);
		}
	};

	const onDidChangeGitBaseExtensionEnablement = (enabled: boolean) => {
		if (!enabled) {
			disposables.dispose();
		} else {
			initialize();
		}
	};

	const gitBaseExtension = extensions.getExtension<GitBaseExtension>('vscode.git-base')!.exports;
	disposables.add(gitBaseExtension.onDidChangeEnablement(onDidChangeGitBaseExtensionEnablement));
	onDidChangeGitBaseExtensionEnablement(gitBaseExtension.enabled);

	return disposables;
}

function setGitHubContext(gitAPI: API, disposables: DisposableStore) {
	if (gitAPI.repositories.find(repo => repositoryHasGitHubRemote(repo))) {
		commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
	} else {
		const openRepoDisposable = gitAPI.onDidOpenRepository(async e => {
			await e.status();
			if (repositoryHasGitHubRemote(e)) {
				commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
				openRepoDisposable.dispose();
			}
		});
		disposables.add(openRepoDisposable);
	}
}

function initializeGitExtension(context: ExtensionContext, octokitService: OctokitService, telemetryReporter: TelemetryReporter, logger: LogOutputChannel): Disposable {
	const disposables = new DisposableStore();

	let gitExtension = extensions.getExtension<GitExtension>('vscode.git');

	const initialize = () => {
		gitExtension!.activate()
			.then(extension => {
				const onDidChangeGitExtensionEnablement = (enabled: boolean) => {
					if (enabled) {
						const gitAPI = extension.getAPI(1);

						disposables.add(registerCommands(gitAPI));
						disposables.add(new GithubCredentialProviderManager(gitAPI));
						disposables.add(new GitHubBranchProtectionProviderManager(gitAPI, context.globalState, octokitService, logger, telemetryReporter));
						disposables.add(gitAPI.registerPushErrorHandler(new GithubPushErrorHandler(telemetryReporter)));
						disposables.add(gitAPI.registerRemoteSourcePublisher(new GithubRemoteSourcePublisher(gitAPI)));
						disposables.add(gitAPI.registerSourceControlHistoryItemDetailsProvider(new GitHubSourceControlHistoryItemDetailsProvider(gitAPI, octokitService, logger)));
						disposables.add(new GitHubCanonicalUriProvider(gitAPI));
						disposables.add(new VscodeDevShareProvider(gitAPI));
						setGitHubContext(gitAPI, disposables);

						commands.executeCommand('setContext', 'git-base.gitEnabled', true);
					} else {
						disposables.dispose();
					}
				};

				disposables.add(extension.onDidChangeEnablement(onDidChangeGitExtensionEnablement));
				onDidChangeGitExtensionEnablement(extension.enabled);
			});
	};

	if (gitExtension) {
		initialize();
	} else {
		const listener = extensions.onDidChange(() => {
			if (!gitExtension && extensions.getExtension<GitExtension>('vscode.git')) {
				gitExtension = extensions.getExtension<GitExtension>('vscode.git');
				initialize();
				listener.dispose();
			}
		});
		disposables.add(listener);
	}

	return disposables;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/historyItemDetailsProvider.ts]---
Location: vscode-main/extensions/github/src/historyItemDetailsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, l10n, LogOutputChannel, workspace } from 'vscode';
import { Commit, Repository as GitHubRepository, Maybe } from '@octokit/graphql-schema';
import { API, AvatarQuery, AvatarQueryCommit, Repository, SourceControlHistoryItemDetailsProvider } from './typings/git.js';
import { DisposableStore, getRepositoryDefaultRemote, getRepositoryDefaultRemoteUrl, getRepositoryFromUrl, groupBy, sequentialize } from './util.js';
import { AuthenticationError, OctokitService } from './auth.js';
import { getAvatarLink } from './links.js';

const ISSUE_EXPRESSION = /(([A-Za-z0-9_.\-]+)\/([A-Za-z0-9_.\-]+))?(#|GH-)([1-9][0-9]*)($|\b)/g;

const ASSIGNABLE_USERS_QUERY = `
	query assignableUsers($owner: String!, $repo: String!) {
		repository(owner: $owner, name: $repo) {
			assignableUsers(first: 100) {
				nodes {
					id
					login
					name
					email
					avatarUrl
				}
			}
		}
	}
`;

const COMMIT_AUTHOR_QUERY = `
	query commitAuthor($owner: String!, $repo: String!, $commit: String!) {
		repository(owner: $owner, name: $repo) {
			object(expression: $commit) {
				... on Commit {
					author {
						name
						email
						avatarUrl
						user {
							id
							login
						}
					}
				}
			}
		}
	}
`;

interface GitHubRepositoryStore {
	readonly users: GitHubUser[];
	readonly commits: Set<string>;
}

interface GitHubUser {
	readonly id: string;
	readonly login: string;
	readonly name?: Maybe<string>;
	readonly email: string;
	readonly avatarUrl: string;
}

function getUserIdFromNoReplyEmail(email: string | undefined): string | undefined {
	const match = email?.match(/^([0-9]+)\+[^@]+@users\.noreply\.github\.com$/);
	return match?.[1];
}

function compareAvatarQuery(a: AvatarQueryCommit, b: AvatarQueryCommit): number {
	// Email
	const emailComparison = (a.authorEmail ?? '').localeCompare(b.authorEmail ?? '');
	if (emailComparison !== 0) {
		return emailComparison;
	}

	// Name
	return (a.authorName ?? '').localeCompare(b.authorName ?? '');
}

export class GitHubSourceControlHistoryItemDetailsProvider implements SourceControlHistoryItemDetailsProvider {
	private _isUserAuthenticated = true;
	private readonly _store = new Map<string, GitHubRepositoryStore>();
	private readonly _disposables = new DisposableStore();

	constructor(
		private readonly _gitAPI: API,
		private readonly _octokitService: OctokitService,
		private readonly _logger: LogOutputChannel
	) {
		this._disposables.add(this._gitAPI.onDidCloseRepository(repository => this._onDidCloseRepository(repository)));

		this._disposables.add(this._octokitService.onDidChangeSessions(() => {
			this._isUserAuthenticated = true;
			this._store.clear();
		}));

		this._disposables.add(workspace.onDidChangeConfiguration(e => {
			if (!e.affectsConfiguration('github.showAvatar')) {
				return;
			}

			this._store.clear();
		}));
	}

	async provideAvatar(repository: Repository, query: AvatarQuery): Promise<Map<string, string | undefined> | undefined> {
		this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][provideAvatar] Avatar resolution for ${query.commits.length} commit(s) in ${repository.rootUri.fsPath}.`);

		const config = workspace.getConfiguration('github', repository.rootUri);
		const showAvatar = config.get<boolean>('showAvatar', true) === true;

		if (!this._isUserAuthenticated || !showAvatar) {
			this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][provideAvatar] Avatar resolution is disabled. (${showAvatar === false ? 'setting' : 'auth'})`);
			return undefined;
		}

		// upstream -> origin -> first
		const descriptor = getRepositoryDefaultRemote(repository, ['upstream', 'origin']);
		if (!descriptor) {
			this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][provideAvatar] Repository does not have a GitHub remote.`);
			return undefined;
		}

		try {
			const logs = { cached: 0, email: 0, github: 0, incomplete: 0 };

			// Warm up the in-memory cache with the first page
			// (100 users) from this list of assignable users
			await this._loadAssignableUsers(descriptor);

			const repositoryStore = this._store.get(this._getRepositoryKey(descriptor));
			if (!repositoryStore) {
				return undefined;
			}

			// Group the query by author
			const authorQuery = groupBy<AvatarQueryCommit>(query.commits, compareAvatarQuery);

			const results = new Map<string, string | undefined>();
			await Promise.all(authorQuery.map(async commits => {
				if (commits.length === 0) {
					return;
				}

				// Query the in-memory cache for the user
				const avatarUrl = repositoryStore.users.find(
					user => user.email === commits[0].authorEmail || user.name === commits[0].authorName)?.avatarUrl;

				// Cache hit
				if (avatarUrl) {
					// Add avatar for each commit
					logs.cached += commits.length;
					commits.forEach(({ hash }) => results.set(hash, `${avatarUrl}&s=${query.size}`));
					return;
				}

				// Check if any of the commit are being tracked in the list
				// of known commits that have incomplte author information
				if (commits.some(({ hash }) => repositoryStore.commits.has(hash))) {
					commits.forEach(({ hash }) => results.set(hash, undefined));
					return;
				}

				// Try to extract the user identifier from GitHub no-reply emails
				const userIdFromEmail = getUserIdFromNoReplyEmail(commits[0].authorEmail);
				if (userIdFromEmail) {
					logs.email += commits.length;
					const avatarUrl = getAvatarLink(userIdFromEmail, query.size);
					commits.forEach(({ hash }) => results.set(hash, avatarUrl));
					return;
				}

				// Get the commit details
				const commitAuthor = await this._getCommitAuthor(descriptor, commits[0].hash);
				if (!commitAuthor) {
					// The commit has incomplete author information, so
					// we should not try to query the authors details again
					logs.incomplete += commits.length;
					for (const { hash } of commits) {
						repositoryStore.commits.add(hash);
						results.set(hash, undefined);
					}
					return;
				}

				// Save the user to the cache
				repositoryStore.users.push(commitAuthor);

				// Add avatar for each commit
				logs.github += commits.length;
				commits.forEach(({ hash }) => results.set(hash, `${commitAuthor.avatarUrl}&s=${query.size}`));
			}));

			this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][provideAvatar] Avatar resolution for ${query.commits.length} commit(s) in ${repository.rootUri.fsPath} complete: ${JSON.stringify(logs)}.`);

			return results;
		} catch (err) {
			// A GitHub authentication session could be missing if the user has not yet
			// signed in with their GitHub account or they have signed out. Disable the
			// avatar resolution until the user signes in with their GitHub account.
			if (err instanceof AuthenticationError) {
				this._isUserAuthenticated = false;
			}

			return undefined;
		}
	}

	async provideHoverCommands(repository: Repository): Promise<Command[] | undefined> {
		// origin -> upstream -> first
		const url = getRepositoryDefaultRemoteUrl(repository, ['origin', 'upstream']);
		if (!url) {
			return undefined;
		}

		return [{
			title: l10n.t('{0} Open on GitHub', '$(github)'),
			tooltip: l10n.t('Open on GitHub'),
			command: 'github.openOnGitHub',
			arguments: [url]
		}];
	}

	async provideMessageLinks(repository: Repository, message: string): Promise<string | undefined> {
		// upstream -> origin -> first
		const descriptor = getRepositoryDefaultRemote(repository, ['upstream', 'origin']);
		if (!descriptor) {
			return undefined;
		}

		return message.replace(
			ISSUE_EXPRESSION,
			(match, _group1, owner: string | undefined, repo: string | undefined, _group2, number: string | undefined) => {
				if (!number || Number.isNaN(parseInt(number))) {
					return match;
				}

				const label = owner && repo
					? `${owner}/${repo}#${number}`
					: `#${number}`;

				owner = owner ?? descriptor.owner;
				repo = repo ?? descriptor.repo;

				return `[${label}](https://github.com/${owner}/${repo}/issues/${number})`;
			});
	}

	private _onDidCloseRepository(repository: Repository) {
		for (const remote of repository.state.remotes) {
			if (!remote.fetchUrl) {
				continue;
			}

			const repository = getRepositoryFromUrl(remote.fetchUrl);
			if (!repository) {
				continue;
			}

			this._store.delete(this._getRepositoryKey(repository));
		}
	}

	@sequentialize
	private async _loadAssignableUsers(descriptor: { owner: string; repo: string }): Promise<void> {
		if (this._store.has(this._getRepositoryKey(descriptor))) {
			return;
		}

		this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][_loadAssignableUsers] Querying assignable user(s) for ${descriptor.owner}/${descriptor.repo}.`);

		try {
			const graphql = await this._octokitService.getOctokitGraphql();
			const { repository } = await graphql<{ repository: GitHubRepository }>(ASSIGNABLE_USERS_QUERY, descriptor);

			const users: GitHubUser[] = [];
			for (const node of repository.assignableUsers.nodes ?? []) {
				if (!node) {
					continue;
				}

				users.push({
					id: node.id,
					login: node.login,
					name: node.name,
					email: node.email,
					avatarUrl: node.avatarUrl,
				} satisfies GitHubUser);
			}

			this._store.set(this._getRepositoryKey(descriptor), { users, commits: new Set() });
			this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][_loadAssignableUsers] Successfully queried assignable user(s) for ${descriptor.owner}/${descriptor.repo}: ${users.length} user(s).`);
		} catch (err) {
			this._logger.warn(`[GitHubSourceControlHistoryItemDetailsProvider][_loadAssignableUsers] Failed to load assignable user(s) for ${descriptor.owner}/${descriptor.repo}: ${err}`);
			throw err;
		}
	}

	private async _getCommitAuthor(descriptor: { owner: string; repo: string }, commit: string): Promise<GitHubUser | undefined> {
		this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][_getCommitAuthor] Querying commit author for ${descriptor.owner}/${descriptor.repo}/${commit}.`);

		try {
			const graphql = await this._octokitService.getOctokitGraphql();
			const { repository } = await graphql<{ repository: GitHubRepository }>(COMMIT_AUTHOR_QUERY, { ...descriptor, commit });

			const commitAuthor = (repository.object as Commit).author;
			if (!commitAuthor?.user?.id || !commitAuthor.user?.login ||
				!commitAuthor?.name || !commitAuthor?.email || !commitAuthor?.avatarUrl) {
				this._logger.info(`[GitHubSourceControlHistoryItemDetailsProvider][_getCommitAuthor] Incomplete commit author for ${descriptor.owner}/${descriptor.repo}/${commit}: ${JSON.stringify(repository.object)}`);

				return undefined;
			}

			const user = {
				id: commitAuthor.user.id,
				login: commitAuthor.user.login,
				name: commitAuthor.name,
				email: commitAuthor.email,
				avatarUrl: commitAuthor.avatarUrl,
			} satisfies GitHubUser;

			this._logger.trace(`[GitHubSourceControlHistoryItemDetailsProvider][_getCommitAuthor] Successfully queried commit author for ${descriptor.owner}/${descriptor.repo}/${commit}: ${user.login}.`);
			return user;
		} catch (err) {
			this._logger.warn(`[GitHubSourceControlHistoryItemDetailsProvider][_getCommitAuthor] Failed to get commit author for ${descriptor.owner}/${descriptor.repo}/${commit}: ${err}`);
			throw err;
		}
	}

	private _getRepositoryKey(descriptor: { owner: string; repo: string }): string {
		return `${descriptor.owner}/${descriptor.repo}`;
	}

	dispose(): void {
		this._disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/links.ts]---
Location: vscode-main/extensions/github/src/links.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { API as GitAPI, RefType, Repository } from './typings/git.js';
import { getRepositoryFromUrl, repositoryHasGitHubRemote } from './util.js';

export function isFileInRepo(repository: Repository, file: vscode.Uri): boolean {
	return file.path.toLowerCase() === repository.rootUri.path.toLowerCase() ||
		(file.path.toLowerCase().startsWith(repository.rootUri.path.toLowerCase()) &&
			file.path.substring(repository.rootUri.path.length).startsWith('/'));
}

export function getRepositoryForFile(gitAPI: GitAPI, file: vscode.Uri): Repository | undefined {
	for (const repository of gitAPI.repositories) {
		if (isFileInRepo(repository, file)) {
			return repository;
		}
	}
	return undefined;
}

enum LinkType {
	File = 1,
	Notebook = 2
}

interface IFilePosition {
	type: LinkType.File;
	uri: vscode.Uri;
	range: vscode.Range | undefined;
}

interface INotebookPosition {
	type: LinkType.Notebook;
	uri: vscode.Uri;
	cellIndex: number;
	range: vscode.Range | undefined;
}

interface EditorLineNumberContext {
	uri: vscode.Uri;
	lineNumber: number;
}
export type LinkContext = vscode.Uri | EditorLineNumberContext | undefined;

function extractContext(context: LinkContext): { fileUri: vscode.Uri | undefined; lineNumber: number | undefined } {
	if (context === undefined) {
		return { fileUri: undefined, lineNumber: undefined };
	} else if (context instanceof vscode.Uri) {
		return { fileUri: context, lineNumber: undefined };
	} else {
		return { fileUri: context.uri, lineNumber: context.lineNumber };
	}
}

function getFileAndPosition(context: LinkContext): IFilePosition | INotebookPosition | undefined {
	let range: vscode.Range | undefined;

	const { fileUri, lineNumber } = extractContext(context);
	const uri = fileUri ?? vscode.window.activeTextEditor?.document.uri;

	if (uri) {
		if (uri.scheme === 'vscode-notebook-cell' && vscode.window.activeNotebookEditor?.notebook.uri.fsPath === uri.fsPath) {
			// if the active editor is a notebook editor and the focus is inside any a cell text editor
			// generate deep link for text selection for the notebook cell.
			const cell = vscode.window.activeNotebookEditor.notebook.getCells().find(cell => cell.document.uri.fragment === uri?.fragment);
			const cellIndex = cell?.index ?? vscode.window.activeNotebookEditor.selection.start;

			const range = getRangeOrSelection(lineNumber);
			return { type: LinkType.Notebook, uri, cellIndex, range };
		} else {
			// the active editor is a text editor
			range = getRangeOrSelection(lineNumber);
			return { type: LinkType.File, uri, range };
		}
	}

	if (vscode.window.activeNotebookEditor) {
		// if the active editor is a notebook editor but the focus is not inside any cell text editor, generate deep link for the cell selection in the notebook document.
		return { type: LinkType.Notebook, uri: vscode.window.activeNotebookEditor.notebook.uri, cellIndex: vscode.window.activeNotebookEditor.selection.start, range: undefined };
	}

	return undefined;
}

function getRangeOrSelection(lineNumber: number | undefined) {
	return lineNumber !== undefined && (!vscode.window.activeTextEditor || vscode.window.activeTextEditor.selection.isEmpty || !vscode.window.activeTextEditor.selection.contains(new vscode.Position(lineNumber - 1, 0)))
		? new vscode.Range(lineNumber - 1, 0, lineNumber - 1, 1)
		: vscode.window.activeTextEditor?.selection;
}

export function rangeString(range: vscode.Range | undefined) {
	if (!range) {
		return '';
	}
	let hash = `#L${range.start.line + 1}`;
	if (range.start.line !== range.end.line) {
		hash += `-L${range.end.line + 1}`;
	}
	return hash;
}

export function notebookCellRangeString(index: number | undefined, range: vscode.Range | undefined) {
	if (index === undefined) {
		return '';
	}

	if (!range) {
		return `#C${index + 1}`;
	}

	let hash = `#C${index + 1}:L${range.start.line + 1}`;
	if (range.start.line !== range.end.line) {
		hash += `-L${range.end.line + 1}`;
	}
	return hash;
}

export function encodeURIComponentExceptSlashes(path: string) {
	// There may be special characters like # and whitespace in the path.
	// These characters are not escaped by encodeURI(), so it is not sufficient to
	// feed the full URI to encodeURI().
	// Additonally, if we feed the full path into encodeURIComponent(),
	// this will also encode the path separators, leading to an invalid path.
	// Therefore, split on the path separator and encode each segment individually.
	return path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

export async function getLink(gitAPI: GitAPI, useSelection: boolean, shouldEnsurePublished: boolean, hostPrefix?: string, linkType: 'permalink' | 'headlink' = 'permalink', context?: LinkContext, useRange?: boolean): Promise<string | undefined> {
	hostPrefix = hostPrefix ?? 'https://github.com';
	const fileAndPosition = getFileAndPosition(context);
	const fileUri = fileAndPosition?.uri;

	// Use the first repo if we cannot determine a repo from the uri.
	const githubRepository = gitAPI.repositories.find(repo => repositoryHasGitHubRemote(repo));
	const gitRepo = (fileUri ? getRepositoryForFile(gitAPI, fileUri) : githubRepository) ?? githubRepository;
	if (!gitRepo) {
		return;
	}

	if (shouldEnsurePublished && fileUri) {
		await ensurePublished(gitRepo, fileUri);
	}

	let repo: { owner: string; repo: string } | undefined;
	gitRepo.state.remotes.find(remote => {
		if (remote.fetchUrl) {
			const foundRepo = getRepositoryFromUrl(remote.fetchUrl);
			if (foundRepo && (remote.name === gitRepo.state.HEAD?.upstream?.remote)) {
				repo = foundRepo;
				return;
			} else if (foundRepo && !repo) {
				repo = foundRepo;
			}
		}
		return;
	});
	if (!repo) {
		return;
	}

	const blobSegment = gitRepo.state.HEAD ? (`/blob/${linkType === 'headlink' && gitRepo.state.HEAD.name ? encodeURIComponentExceptSlashes(gitRepo.state.HEAD.name) : gitRepo.state.HEAD?.commit}`) : '';
	const uriWithoutFileSegments = `${hostPrefix}/${repo.owner}/${repo.repo}${blobSegment}`;
	if (!fileUri) {
		return uriWithoutFileSegments;
	}

	const encodedFilePath = encodeURIComponentExceptSlashes(fileUri.path.substring(gitRepo.rootUri.path.length));
	const fileSegments = fileAndPosition.type === LinkType.File
		? (useSelection ? `${encodedFilePath}${useRange ? rangeString(fileAndPosition.range) : ''}` : '')
		: (useSelection ? `${encodedFilePath}${useRange ? notebookCellRangeString(fileAndPosition.cellIndex, fileAndPosition.range) : ''}` : '');

	return `${uriWithoutFileSegments}${fileSegments}`;
}

export function getAvatarLink(userId: string, size: number): string {
	return `https://avatars.githubusercontent.com/u/${userId}?s=${size}`;
}

export function getBranchLink(url: string, branch: string, hostPrefix: string = 'https://github.com') {
	const repo = getRepositoryFromUrl(url);
	if (!repo) {
		throw new Error('Invalid repository URL provided');
	}

	branch = encodeURIComponentExceptSlashes(branch);
	return `${hostPrefix}/${repo.owner}/${repo.repo}/tree/${branch}`;
}

export function getCommitLink(url: string, hash: string, hostPrefix: string = 'https://github.com') {
	const repo = getRepositoryFromUrl(url);
	if (!repo) {
		throw new Error('Invalid repository URL provided');
	}

	return `${hostPrefix}/${repo.owner}/${repo.repo}/commit/${hash}`;
}

export function getVscodeDevHost(): string {
	return `https://${vscode.env.appName.toLowerCase().includes('insiders') ? 'insiders.' : ''}vscode.dev/github`;
}

export async function ensurePublished(repository: Repository, file: vscode.Uri) {
	await repository.status();

	if ((repository.state.HEAD?.type === RefType.Head || repository.state.HEAD?.type === RefType.Tag)
		// If HEAD is not published, make sure it is
		&& !repository?.state.HEAD?.upstream
	) {
		const publishBranch = vscode.l10n.t('Publish Branch & Copy Link');
		const selection = await vscode.window.showInformationMessage(
			vscode.l10n.t('The current branch is not published to the remote. Would you like to publish your branch before copying a link?'),
			{ modal: true },
			publishBranch
		);
		if (selection !== publishBranch) {
			throw new vscode.CancellationError();
		}

		await vscode.commands.executeCommand('git.publish');
	}

	const uncommittedChanges = [...repository.state.workingTreeChanges, ...repository.state.indexChanges];
	if (uncommittedChanges.find((c) => c.uri.toString() === file.toString()) && !repository.state.HEAD?.ahead && !repository.state.HEAD?.behind) {
		const commitChanges = vscode.l10n.t('Commit Changes');
		const copyAnyway = vscode.l10n.t('Copy Anyway');
		const selection = await vscode.window.showWarningMessage(
			vscode.l10n.t('The current file has uncommitted changes. Please commit your changes before copying a link.'),
			{ modal: true },
			commitChanges,
			copyAnyway
		);

		if (selection !== copyAnyway) {
			// Focus the SCM view
			vscode.commands.executeCommand('workbench.view.scm');
			throw new vscode.CancellationError();
		}
	} else if (repository.state.HEAD?.ahead) {
		const pushCommits = vscode.l10n.t('Push Commits & Copy Link');
		const selection = await vscode.window.showInformationMessage(
			vscode.l10n.t('The current branch has unpublished commits. Would you like to push your commits before copying a link?'),
			{ modal: true },
			pushCommits
		);
		if (selection !== pushCommits) {
			throw new vscode.CancellationError();
		}

		await repository.push();
	} else if (repository.state.HEAD?.behind) {
		const pull = vscode.l10n.t('Pull Changes & Copy Link');
		const selection = await vscode.window.showInformationMessage(
			vscode.l10n.t('The current branch is not up to date. Would you like to pull before copying a link?'),
			{ modal: true },
			pull
		);
		if (selection !== pull) {
			throw new vscode.CancellationError();
		}

		await repository.pull();
	}

	await repository.status();
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/publish.ts]---
Location: vscode-main/extensions/github/src/publish.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { API as GitAPI, Repository } from './typings/git.js';
import { getOctokit } from './auth.js';
import { TextEncoder } from 'util';
import { basename } from 'path';
import { Octokit } from '@octokit/rest';
import { isInCodespaces } from './pushErrorHandler.js';

function sanitizeRepositoryName(value: string): string {
	return value.trim().replace(/[^a-z0-9_.]/ig, '-');
}

function getPick<T extends vscode.QuickPickItem>(quickpick: vscode.QuickPick<T>): Promise<T | undefined> {
	return Promise.race<T | undefined>([
		new Promise<T>(c => quickpick.onDidAccept(() => quickpick.selectedItems.length > 0 && c(quickpick.selectedItems[0]))),
		new Promise<undefined>(c => quickpick.onDidHide(() => c(undefined)))
	]);
}

export async function publishRepository(gitAPI: GitAPI, repository?: Repository): Promise<void> {
	if (!vscode.workspace.workspaceFolders?.length) {
		return;
	}

	let folder: vscode.Uri;

	if (repository) {
		folder = repository.rootUri;
	} else if (gitAPI.repositories.length === 1) {
		repository = gitAPI.repositories[0];
		folder = repository.rootUri;
	} else if (vscode.workspace.workspaceFolders.length === 1) {
		folder = vscode.workspace.workspaceFolders[0].uri;
	} else {
		const picks = vscode.workspace.workspaceFolders.map(folder => ({ label: folder.name, folder }));
		const placeHolder = vscode.l10n.t('Pick a folder to publish to GitHub');
		const pick = await vscode.window.showQuickPick(picks, { placeHolder });

		if (!pick) {
			return;
		}

		folder = pick.folder.uri;
	}

	let quickpick = vscode.window.createQuickPick<vscode.QuickPickItem & { repo?: string; auth?: 'https' | 'ssh'; isPrivate?: boolean }>();
	quickpick.ignoreFocusOut = true;

	quickpick.placeholder = 'Repository Name';
	quickpick.value = basename(folder.fsPath);
	quickpick.show();
	quickpick.busy = true;

	let owner: string;
	let octokit: Octokit;
	try {
		octokit = await getOctokit();
		const user = await octokit.users.getAuthenticated({});
		owner = user.data.login;
	} catch (e) {
		// User has cancelled sign in
		quickpick.dispose();
		return;
	}

	quickpick.busy = false;

	let repo: string | undefined;
	let isPrivate: boolean;

	const onDidChangeValue = async () => {
		const sanitizedRepo = sanitizeRepositoryName(quickpick.value);

		if (!sanitizedRepo) {
			quickpick.items = [];
		} else {
			quickpick.items = [
				{ label: `$(repo) Publish to GitHub private repository`, description: `$(github) ${owner}/${sanitizedRepo}`, alwaysShow: true, repo: sanitizedRepo, isPrivate: true },
				{ label: `$(repo) Publish to GitHub public repository`, description: `$(github) ${owner}/${sanitizedRepo}`, alwaysShow: true, repo: sanitizedRepo, isPrivate: false },
			];
		}
	};

	onDidChangeValue();

	while (true) {
		const listener = quickpick.onDidChangeValue(onDidChangeValue);
		const pick = await getPick(quickpick);
		listener.dispose();

		repo = pick?.repo;
		isPrivate = pick?.isPrivate ?? true;

		if (repo) {
			try {
				quickpick.busy = true;
				const fullName = `${owner}/${repo}`;
				const result = await octokit.repos.get({ owner, repo: repo });
				if (result.data.full_name.toLowerCase() !== fullName.toLowerCase()) {
					// Repository has moved permanently due to it being renamed
					break;
				}
				quickpick.items = [{ label: `$(error) GitHub repository already exists`, description: `$(github) ${fullName}`, alwaysShow: true }];
			} catch {
				break;
			} finally {
				quickpick.busy = false;
			}
		}
	}

	quickpick.dispose();

	if (!repo) {
		return;
	}

	if (!repository) {
		const gitignore = vscode.Uri.joinPath(folder, '.gitignore');
		let shouldGenerateGitignore = false;

		try {
			await vscode.workspace.fs.stat(gitignore);
		} catch (err) {
			shouldGenerateGitignore = true;
		}

		if (shouldGenerateGitignore) {
			quickpick = vscode.window.createQuickPick();
			quickpick.placeholder = vscode.l10n.t('Select which files should be included in the repository.');
			quickpick.canSelectMany = true;
			quickpick.show();

			try {
				quickpick.busy = true;

				const children = (await vscode.workspace.fs.readDirectory(folder))
					.map(([name]) => name)
					.filter(name => name !== '.git');

				quickpick.items = children.map(name => ({ label: name }));
				quickpick.selectedItems = quickpick.items;
				quickpick.busy = false;

				const result = await Promise.race([
					new Promise<readonly vscode.QuickPickItem[]>(c => quickpick.onDidAccept(() => c(quickpick.selectedItems))),
					new Promise<undefined>(c => quickpick.onDidHide(() => c(undefined)))
				]);

				if (!result || result.length === 0) {
					return;
				}

				const ignored = new Set(children);
				result.forEach(c => ignored.delete(c.label));

				if (ignored.size > 0) {
					const raw = [...ignored].map(i => `/${i}`).join('\n');
					const encoder = new TextEncoder();
					await vscode.workspace.fs.writeFile(gitignore, encoder.encode(raw));
				}
			} finally {
				quickpick.dispose();
			}
		}
	}

	const githubRepository = await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, cancellable: false, title: 'Publish to GitHub' }, async progress => {
		progress.report({
			message: isPrivate
				? vscode.l10n.t('Publishing to a private GitHub repository')
				: vscode.l10n.t('Publishing to a public GitHub repository'),
			increment: 25
		});

		type CreateRepositoryResponseData = Awaited<ReturnType<typeof octokit.repos.createForAuthenticatedUser>>['data'];
		let createdGithubRepository: CreateRepositoryResponseData | undefined = undefined;

		if (isInCodespaces()) {
			createdGithubRepository = await vscode.commands.executeCommand<CreateRepositoryResponseData>('github.codespaces.publish', { name: repo!, isPrivate });
		} else {
			const res = await octokit.repos.createForAuthenticatedUser({
				name: repo!,
				private: isPrivate
			});
			createdGithubRepository = res.data;
		}

		if (createdGithubRepository) {
			progress.report({ message: vscode.l10n.t('Creating first commit'), increment: 25 });

			if (!repository) {
				repository = await gitAPI.init(folder, { defaultBranch: createdGithubRepository.default_branch }) || undefined;

				if (!repository) {
					return;
				}

				await repository.commit('first commit', { all: true, postCommitCommand: null });
			}

			progress.report({ message: vscode.l10n.t('Uploading files'), increment: 25 });

			const branch = await repository.getBranch('HEAD');
			const protocol = vscode.workspace.getConfiguration('github').get<'https' | 'ssh'>('gitProtocol');
			const remoteUrl = protocol === 'https' ? createdGithubRepository.clone_url : createdGithubRepository.ssh_url;
			await repository.addRemote('origin', remoteUrl);
			await repository.push('origin', branch.name, true);
		}

		return createdGithubRepository;
	});

	if (!githubRepository) {
		return;
	}

	const openOnGitHub = vscode.l10n.t('Open on GitHub');
	vscode.window.showInformationMessage(vscode.l10n.t('Successfully published the "{0}" repository to GitHub.', `${owner}/${repo}`), openOnGitHub).then(action => {
		if (action === openOnGitHub) {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(githubRepository.html_url));
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/pushErrorHandler.ts]---
Location: vscode-main/extensions/github/src/pushErrorHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDecoder } from 'util';
import { commands, env, ProgressLocation, Uri, window, workspace, QuickPickOptions, FileType, l10n, Disposable, TextDocumentContentProvider } from 'vscode';
import { getOctokit } from './auth.js';
import { GitErrorCodes, PushErrorHandler, Remote, Repository } from './typings/git.js';
import * as path from 'path';
import { TelemetryReporter } from '@vscode/extension-telemetry';



type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

export function isInCodespaces(): boolean {
	return env.remoteName === 'codespaces';
}

const PR_TEMPLATE_FILES = [
	{ dir: '.', files: ['pull_request_template.md', 'PULL_REQUEST_TEMPLATE.md'] },
	{ dir: 'docs', files: ['pull_request_template.md', 'PULL_REQUEST_TEMPLATE.md'] },
	{ dir: '.github', files: ['PULL_REQUEST_TEMPLATE.md', 'PULL_REQUEST_TEMPLATE.md'] }
];

const PR_TEMPLATE_DIRECTORY_NAMES = [
	'PULL_REQUEST_TEMPLATE',
	'docs/PULL_REQUEST_TEMPLATE',
	'.github/PULL_REQUEST_TEMPLATE'
];

async function assertMarkdownFiles(dir: Uri, files: string[]): Promise<Uri[]> {
	const dirFiles = await workspace.fs.readDirectory(dir);
	return dirFiles
		.filter(([name, type]) => Boolean(type & FileType.File) && files.indexOf(name) !== -1)
		.map(([name]) => Uri.joinPath(dir, name));
}

async function findMarkdownFilesInDir(uri: Uri): Promise<Uri[]> {
	const files = await workspace.fs.readDirectory(uri);
	return files
		.filter(([name, type]) => Boolean(type & FileType.File) && path.extname(name) === '.md')
		.map(([name]) => Uri.joinPath(uri, name));
}

/**
 * PR templates can be:
 * - In the root, `docs`, or `.github` folders, called `pull_request_template.md` or `PULL_REQUEST_TEMPLATE.md`
 * - Or, in a `PULL_REQUEST_TEMPLATE` directory directly below the root, `docs`, or `.github` folders, called `*.md`
 *
 * NOTE This method is a modified copy of a method with same name at microsoft/vscode-pull-request-github repository:
 *   https://github.com/microsoft/vscode-pull-request-github/blob/0a0c3c6c21c0b9c2f4d5ffbc3f8c6a825472e9e6/src/github/folderRepositoryManager.ts#L1061
 *
 */
export async function findPullRequestTemplates(repositoryRootUri: Uri): Promise<Uri[]> {
	const results = await Promise.allSettled([
		...PR_TEMPLATE_FILES.map(x => assertMarkdownFiles(Uri.joinPath(repositoryRootUri, x.dir), x.files)),
		...PR_TEMPLATE_DIRECTORY_NAMES.map(x => findMarkdownFilesInDir(Uri.joinPath(repositoryRootUri, x)))
	]);

	return results.flatMap(x => x.status === 'fulfilled' && x.value || []);
}

export async function pickPullRequestTemplate(repositoryRootUri: Uri, templates: Uri[]): Promise<Uri | undefined> {
	const quickPickItemFromUri = (x: Uri) => ({ label: path.relative(repositoryRootUri.path, x.path), template: x });
	const quickPickItems = [
		{
			label: l10n.t('No template'),
			picked: true,
			template: undefined,
		},
		...templates.map(quickPickItemFromUri)
	];
	const quickPickOptions: QuickPickOptions = {
		placeHolder: l10n.t('Select the Pull Request template'),
		ignoreFocusOut: true
	};
	const pickedTemplate = await window.showQuickPick(quickPickItems, quickPickOptions);
	return pickedTemplate?.template;
}

class CommandErrorOutputTextDocumentContentProvider implements TextDocumentContentProvider {

	private items = new Map<string, string>();

	set(uri: Uri, contents: string): void {
		this.items.set(uri.path, contents);
	}

	delete(uri: Uri): void {
		this.items.delete(uri.path);
	}

	provideTextDocumentContent(uri: Uri): string | undefined {
		return this.items.get(uri.path);
	}
}

export class GithubPushErrorHandler implements PushErrorHandler {

	private disposables: Disposable[] = [];
	private commandErrors = new CommandErrorOutputTextDocumentContentProvider();

	constructor(private readonly telemetryReporter: TelemetryReporter) {
		this.disposables.push(workspace.registerTextDocumentContentProvider('github-output', this.commandErrors));
	}

	async handlePushError(repository: Repository, remote: Remote, refspec: string, error: Error & { stderr: string; gitErrorCode: GitErrorCodes }): Promise<boolean> {
		if (error.gitErrorCode !== GitErrorCodes.PermissionDenied && error.gitErrorCode !== GitErrorCodes.PushRejected) {
			return false;
		}

		const remoteUrl = remote.pushUrl || (isInCodespaces() ? remote.fetchUrl : undefined);
		if (!remoteUrl) {
			return false;
		}

		const match = /^(?:https:\/\/github\.com\/|git@github\.com:)([^\/]+)\/([^\/.]+)/i.exec(remoteUrl);
		if (!match) {
			return false;
		}

		if (/^:/.test(refspec)) {
			return false;
		}

		const [, owner, repo] = match;

		if (error.gitErrorCode === GitErrorCodes.PermissionDenied) {
			await this.handlePermissionDeniedError(repository, remote, refspec, owner, repo);

			/* __GDPR__
				"pushErrorHandler" : {
					"owner": "lszomoru",
					"handler": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('pushErrorHandler', { handler: 'PermissionDenied' });

			return true;
		}

		// Push protection
		if (/GH009: Secrets detected!/i.test(error.stderr)) {
			await this.handlePushProtectionError(owner, repo, error.stderr);

			/* __GDPR__
				"pushErrorHandler" : {
					"owner": "lszomoru",
					"handler": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			this.telemetryReporter.sendTelemetryEvent('pushErrorHandler', { handler: 'PushRejected.PushProtection' });

			return true;
		}

		/* __GDPR__
			"pushErrorHandler" : {
				"owner": "lszomoru",
				"handler": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		this.telemetryReporter.sendTelemetryEvent('pushErrorHandler', { handler: 'None' });

		return false;
	}

	private async handlePermissionDeniedError(repository: Repository, remote: Remote, refspec: string, owner: string, repo: string): Promise<void> {
		const yes = l10n.t('Create Fork');
		const no = l10n.t('No');
		const askFork = l10n.t('You don\'t have permissions to push to "{0}/{1}" on GitHub. Would you like to create a fork and push to it instead?', owner, repo);

		const answer = await window.showWarningMessage(askFork, { modal: true }, yes, no);
		if (answer !== yes) {
			return;
		}

		const match = /^([^:]*):([^:]*)$/.exec(refspec);
		const localName = match ? match[1] : refspec;
		let remoteName = match ? match[2] : refspec;

		const [octokit, ghRepository] = await window.withProgress({ location: ProgressLocation.Notification, cancellable: false, title: l10n.t('Create GitHub fork') }, async progress => {
			progress.report({ message: l10n.t('Forking "{0}/{1}"...', owner, repo), increment: 33 });

			const octokit = await getOctokit();

			type CreateForkResponseData = Awaited<ReturnType<typeof octokit.repos.createFork>>['data'];

			// Issue: what if the repo already exists?
			let ghRepository: CreateForkResponseData;
			try {
				if (isInCodespaces()) {
					// Call into the codespaces extension to fork the repository
					const resp = await commands.executeCommand<{ repository: CreateForkResponseData; ref: string }>('github.codespaces.forkRepository');
					if (!resp) {
						throw new Error('Unable to fork respository');
					}

					ghRepository = resp.repository;

					if (resp.ref) {
						let ref = resp.ref;
						if (ref.startsWith('refs/heads/')) {
							ref = ref.substr(11);
						}

						remoteName = ref;
					}
				} else {
					const resp = await octokit.repos.createFork({ owner, repo });
					ghRepository = resp.data;
				}
			} catch (ex) {
				console.error(ex);
				throw ex;
			}

			progress.report({ message: l10n.t('Pushing changes...'), increment: 33 });

			// Issue: what if there's already an `upstream` repo?
			await repository.renameRemote(remote.name, 'upstream');

			// Issue: what if there's already another `origin` repo?
			const protocol = workspace.getConfiguration('github').get<'https' | 'ssh'>('gitProtocol');
			const remoteUrl = protocol === 'https' ? ghRepository.clone_url : ghRepository.ssh_url;
			await repository.addRemote('origin', remoteUrl);

			try {
				await repository.fetch('origin', remoteName);
				await repository.setBranchUpstream(localName, `origin/${remoteName}`);
			} catch {
				// noop
			}

			await repository.push('origin', localName, true);

			return [octokit, ghRepository] as const;
		});

		// yield
		(async () => {
			const openOnGitHub = l10n.t('Open on GitHub');
			const createPR = l10n.t('Create PR');
			const action = await window.showInformationMessage(l10n.t('The fork "{0}" was successfully created on GitHub.', ghRepository.full_name), openOnGitHub, createPR);

			if (action === openOnGitHub) {
				await commands.executeCommand('vscode.open', Uri.parse(ghRepository.html_url));
			} else if (action === createPR) {
				const pr = await window.withProgress({ location: ProgressLocation.Notification, cancellable: false, title: l10n.t('Creating GitHub Pull Request...') }, async _ => {
					let title = `Update ${remoteName}`;
					const head = repository.state.HEAD?.name;

					let body: string | undefined;

					if (head) {
						const commit = await repository.getCommit(head);
						title = commit.message.split('\n')[0];
						body = commit.message.slice(title.length + 1).trim();
					}

					const templates = await findPullRequestTemplates(repository.rootUri);
					if (templates.length > 0) {
						templates.sort((a, b) => a.path.localeCompare(b.path));

						const template = await pickPullRequestTemplate(repository.rootUri, templates);

						if (template) {
							body = new TextDecoder('utf-8').decode(await workspace.fs.readFile(template));
						}
					}

					const { data: pr } = await octokit.pulls.create({
						owner,
						repo,
						title,
						body,
						head: `${ghRepository.owner.login}:${remoteName}`,
						base: ghRepository.default_branch
					});

					await repository.setConfig(`branch.${localName}.remote`, 'upstream');
					await repository.setConfig(`branch.${localName}.merge`, `refs/heads/${remoteName}`);
					await repository.setConfig(`branch.${localName}.github-pr-owner-number`, `${owner}#${repo}#${pr.number}`);

					return pr;
				});

				const openPR = l10n.t('Open PR');
				const action = await window.showInformationMessage(l10n.t('The PR "{0}/{1}#{2}" was successfully created on GitHub.', owner, repo, pr.number), openPR);

				if (action === openPR) {
					await commands.executeCommand('vscode.open', Uri.parse(pr.html_url));
				}
			}
		})();
	}

	private async handlePushProtectionError(owner: string, repo: string, stderr: string): Promise<void> {
		// Open command output in an editor
		const timestamp = new Date().getTime();
		const uri = Uri.parse(`github-output:/github-error-${timestamp}`);
		this.commandErrors.set(uri, stderr);

		try {
			const doc = await workspace.openTextDocument(uri);
			await window.showTextDocument(doc);
		}
		finally {
			this.commandErrors.set(uri, stderr);
		}

		// Show dialog
		const learnMore = l10n.t('Learn More');
		const message = l10n.t('Your push to "{0}/{1}" was rejected by GitHub because push protection is enabled and one or more secrets were detected.', owner, repo);
		const answer = await window.showWarningMessage(message, { modal: true }, learnMore);
		if (answer === learnMore) {
			commands.executeCommand('vscode.open', 'https://aka.ms/vscode-github-push-protection');
		}
	}

	dispose() {
		this.disposables.forEach(d => d.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/remoteSourceProvider.ts]---
Location: vscode-main/extensions/github/src/remoteSourceProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri, env, l10n, workspace } from 'vscode';
import { RemoteSourceProvider, RemoteSource, RemoteSourceAction } from './typings/git-base.js';
import { getOctokit } from './auth.js';
import { Octokit } from '@octokit/rest';
import { getRepositoryFromQuery, getRepositoryFromUrl } from './util.js';
import { getBranchLink, getVscodeDevHost } from './links.js';

type RemoteSourceResponse = {
	readonly full_name: string;
	readonly description: string | null;
	readonly stargazers_count: number;
	readonly clone_url: string;
	readonly ssh_url: string;
};

function asRemoteSource(raw: RemoteSourceResponse): RemoteSource {
	const protocol = workspace.getConfiguration('github').get<'https' | 'ssh'>('gitProtocol');
	return {
		name: `$(github) ${raw.full_name}`,
		description: `${raw.stargazers_count > 0 ? `$(star-full) ${raw.stargazers_count}` : ''
			}`,
		detail: raw.description || undefined,
		url: protocol === 'https' ? raw.clone_url : raw.ssh_url
	};
}

export class GithubRemoteSourceProvider implements RemoteSourceProvider {

	readonly name = 'GitHub';
	readonly icon = 'github';
	readonly supportsQuery = true;

	private userReposCache: RemoteSource[] = [];

	async getRemoteSources(query?: string): Promise<RemoteSource[]> {
		const octokit = await getOctokit();

		if (query) {
			const repository = getRepositoryFromUrl(query);

			if (repository) {
				const raw = await octokit.repos.get(repository);
				return [asRemoteSource(raw.data)];
			}
		}

		const all = await Promise.all([
			this.getQueryRemoteSources(octokit, query),
			this.getUserRemoteSources(octokit, query),
		]);

		const map = new Map<string, RemoteSource>();

		for (const group of all) {
			for (const remoteSource of group) {
				map.set(remoteSource.name, remoteSource);
			}
		}

		return [...map.values()];
	}

	private async getUserRemoteSources(octokit: Octokit, query?: string): Promise<RemoteSource[]> {
		if (!query) {
			const user = await octokit.users.getAuthenticated({});
			const username = user.data.login;
			const res = await octokit.repos.listForAuthenticatedUser({ username, sort: 'updated', per_page: 100 });
			this.userReposCache = res.data.map(asRemoteSource);
		}

		return this.userReposCache;
	}

	private async getQueryRemoteSources(octokit: Octokit, query?: string): Promise<RemoteSource[]> {
		if (!query) {
			return [];
		}

		const repository = getRepositoryFromQuery(query);

		if (repository) {
			query = `user:${repository.owner}+${repository.repo}`;
		}

		query += ` fork:true`;

		const raw = await octokit.search.repos({ q: query, sort: 'stars' });
		return raw.data.items.map(asRemoteSource);
	}

	async getBranches(url: string): Promise<string[]> {
		const repository = getRepositoryFromUrl(url);

		if (!repository) {
			return [];
		}

		const octokit = await getOctokit();

		const branches: string[] = [];
		let page = 1;

		while (true) {
			const res = await octokit.repos.listBranches({ ...repository, per_page: 100, page });

			if (res.data.length === 0) {
				break;
			}

			branches.push(...res.data.map(b => b.name));
			page++;
		}

		const repo = await octokit.repos.get(repository);
		const defaultBranch = repo.data.default_branch;

		return branches.sort((a, b) => a === defaultBranch ? -1 : b === defaultBranch ? 1 : 0);
	}

	async getRemoteSourceActions(url: string): Promise<RemoteSourceAction[]> {
		const repository = getRepositoryFromUrl(url);
		if (!repository) {
			return [];
		}

		return [{
			label: l10n.t('Open on GitHub'),
			icon: 'github',
			run(branch: string) {
				const link = getBranchLink(url, branch);
				env.openExternal(Uri.parse(link));
			}
		}, {
			label: l10n.t('Checkout on vscode.dev'),
			icon: 'globe',
			run(branch: string) {
				const link = getBranchLink(url, branch, getVscodeDevHost());
				env.openExternal(Uri.parse(link));
			}
		}];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/remoteSourcePublisher.ts]---
Location: vscode-main/extensions/github/src/remoteSourcePublisher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { publishRepository } from './publish.js';
import { API as GitAPI, RemoteSourcePublisher, Repository } from './typings/git.js';

export class GithubRemoteSourcePublisher implements RemoteSourcePublisher {
	readonly name = 'GitHub';
	readonly icon = 'github';

	constructor(private gitAPI: GitAPI) { }

	publishRepository(repository: Repository): Promise<void> {
		return publishRepository(this.gitAPI, repository);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/shareProviders.ts]---
Location: vscode-main/extensions/github/src/shareProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { API } from './typings/git.js';
import { getRepositoryFromUrl, repositoryHasGitHubRemote } from './util.js';
import { encodeURIComponentExceptSlashes, ensurePublished, getRepositoryForFile, notebookCellRangeString, rangeString } from './links.js';

export class VscodeDevShareProvider implements vscode.ShareProvider, vscode.Disposable {
	readonly id: string = 'copyVscodeDevLink';
	readonly label: string = vscode.l10n.t('Copy vscode.dev Link');
	readonly priority: number = 10;


	private _hasGitHubRepositories: boolean = false;
	private set hasGitHubRepositories(value: boolean) {
		vscode.commands.executeCommand('setContext', 'github.hasGitHubRepo', value);
		this._hasGitHubRepositories = value;
		this.ensureShareProviderRegistration();
	}

	private shareProviderRegistration: vscode.Disposable | undefined;
	private disposables: vscode.Disposable[] = [];

	constructor(private readonly gitAPI: API) {
		this.initializeGitHubRepoContext();
	}

	dispose() {
		this.disposables.forEach(d => d.dispose());
	}

	private initializeGitHubRepoContext() {
		if (this.gitAPI.repositories.find(repo => repositoryHasGitHubRemote(repo))) {
			this.hasGitHubRepositories = true;
			vscode.commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
		} else {
			this.disposables.push(this.gitAPI.onDidOpenRepository(async e => {
				await e.status();
				if (repositoryHasGitHubRemote(e)) {
					vscode.commands.executeCommand('setContext', 'github.hasGitHubRepo', true);
					this.hasGitHubRepositories = true;
				}
			}));
		}
		this.disposables.push(this.gitAPI.onDidCloseRepository(() => {
			if (!this.gitAPI.repositories.find(repo => repositoryHasGitHubRemote(repo))) {
				this.hasGitHubRepositories = false;
			}
		}));
	}

	private ensureShareProviderRegistration() {
		if (vscode.env.appHost !== 'codespaces' && !this.shareProviderRegistration && this._hasGitHubRepositories) {
			const shareProviderRegistration = vscode.window.registerShareProvider({ scheme: 'file' }, this);
			this.shareProviderRegistration = shareProviderRegistration;
			this.disposables.push(shareProviderRegistration);
		} else if (this.shareProviderRegistration && !this._hasGitHubRepositories) {
			this.shareProviderRegistration.dispose();
			this.shareProviderRegistration = undefined;
		}
	}

	async provideShare(item: vscode.ShareableItem, _token: vscode.CancellationToken): Promise<vscode.Uri | undefined> {
		const repository = getRepositoryForFile(this.gitAPI, item.resourceUri);
		if (!repository) {
			return;
		}

		await ensurePublished(repository, item.resourceUri);

		let repo: { owner: string; repo: string } | undefined;
		repository.state.remotes.find(remote => {
			if (remote.fetchUrl) {
				const foundRepo = getRepositoryFromUrl(remote.fetchUrl);
				if (foundRepo && (remote.name === repository.state.HEAD?.upstream?.remote)) {
					repo = foundRepo;
					return;
				} else if (foundRepo && !repo) {
					repo = foundRepo;
				}
			}
			return;
		});

		if (!repo) {
			return;
		}

		const blobSegment = repository?.state.HEAD?.name ? encodeURIComponentExceptSlashes(repository.state.HEAD?.name) : repository?.state.HEAD?.commit;
		const filepathSegment = encodeURIComponentExceptSlashes(item.resourceUri.path.substring(repository?.rootUri.path.length));
		const rangeSegment = getRangeSegment(item);
		return vscode.Uri.parse(`${this.getVscodeDevHost()}/${repo.owner}/${repo.repo}/blob/${blobSegment}${filepathSegment}${rangeSegment}`);

	}

	private getVscodeDevHost(): string {
		return `https://${vscode.env.appName.toLowerCase().includes('insiders') ? 'insiders.' : ''}vscode.dev/github`;
	}
}

function getRangeSegment(item: vscode.ShareableItem) {
	if (item.resourceUri.scheme === 'vscode-notebook-cell') {
		const notebookEditor = vscode.window.visibleNotebookEditors.find(editor => editor.notebook.uri.fsPath === item.resourceUri.fsPath);
		const cell = notebookEditor?.notebook.getCells().find(cell => cell.document.uri.fragment === item.resourceUri?.fragment);
		const cellIndex = cell?.index ?? notebookEditor?.selection.start;
		return notebookCellRangeString(cellIndex, item.selection);
	}

	return rangeString(item.selection);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/util.ts]---
Location: vscode-main/extensions/github/src/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Repository } from './typings/git.js';

export class DisposableStore {

	private disposables = new Set<vscode.Disposable>();

	add(disposable: vscode.Disposable): void {
		this.disposables.add(disposable);
	}

	dispose(): void {
		for (const disposable of this.disposables) {
			disposable.dispose();
		}

		this.disposables.clear();
	}
}

function decorate(decorator: (fn: Function, key: string) => Function): Function {
	return function (original: any, context: ClassMethodDecoratorContext) {
		if (context.kind === 'method' || context.kind === 'getter' || context.kind === 'setter') {
			return decorator(original, context.name.toString());
		}
		throw new Error('not supported');
	};
}

function _sequentialize(fn: Function, key: string): Function {
	const currentKey = `__$sequence$${key}`;

	return function (this: any, ...args: any[]) {
		const currentPromise = this[currentKey] as Promise<any> || Promise.resolve(null);
		const run = async () => await fn.apply(this, args);
		this[currentKey] = currentPromise.then(run, run);
		return this[currentKey];
	};
}

export const sequentialize = decorate(_sequentialize);

export function groupBy<T>(data: ReadonlyArray<T>, compare: (a: T, b: T) => number): T[][] {
	const result: T[][] = [];
	let currentGroup: T[] | undefined = undefined;
	for (const element of data.slice(0).sort(compare)) {
		if (!currentGroup || compare(currentGroup[0], element) !== 0) {
			currentGroup = [element];
			result.push(currentGroup);
		} else {
			currentGroup.push(element);
		}
	}
	return result;
}

export function getRepositoryFromUrl(url: string): { owner: string; repo: string } | undefined {
	const match = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(\.git)?$/i.exec(url)
		|| /^git@github\.com:([^/]+)\/([^/]+?)(\.git)?$/i.exec(url);
	return match ? { owner: match[1], repo: match[2] } : undefined;
}

export function getRepositoryFromQuery(query: string): { owner: string; repo: string } | undefined {
	const match = /^([^/]+)\/([^/]+)$/i.exec(query);
	return match ? { owner: match[1], repo: match[2] } : undefined;
}

export function repositoryHasGitHubRemote(repository: Repository) {
	return !!repository.state.remotes.find(remote => remote.fetchUrl ? getRepositoryFromUrl(remote.fetchUrl) : undefined);
}

export function getRepositoryDefaultRemoteUrl(repository: Repository, order: string[]): string | undefined {
	const remotes = repository.state.remotes
		.filter(remote => remote.fetchUrl && getRepositoryFromUrl(remote.fetchUrl));

	if (remotes.length === 0) {
		return undefined;
	}

	for (const name of order) {
		const remote = remotes
			.find(remote => remote.name === name);

		if (remote) {
			return remote.fetchUrl;
		}
	}

	// Fallback to first remote
	return remotes[0].fetchUrl;
}

export function getRepositoryDefaultRemote(repository: Repository, order: string[]): { owner: string; repo: string } | undefined {
	const fetchUrl = getRepositoryDefaultRemoteUrl(repository, order);
	return fetchUrl ? getRepositoryFromUrl(fetchUrl) : undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/test/github.test.ts]---
Location: vscode-main/extensions/github/src/test/github.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { workspace, extensions, Uri, commands } from 'vscode';
import { findPullRequestTemplates, pickPullRequestTemplate } from '../pushErrorHandler.js';

suite('github smoke test', function () {
	const cwd = workspace.workspaceFolders![0].uri;

	suiteSetup(async function () {
		const ext = extensions.getExtension('vscode.github');
		await ext?.activate();
	});

	test('should find all templates', async function () {
		const expectedValuesSorted = [
			'PULL_REQUEST_TEMPLATE/a.md',
			'PULL_REQUEST_TEMPLATE/b.md',
			'docs/PULL_REQUEST_TEMPLATE.md',
			'docs/PULL_REQUEST_TEMPLATE/a.md',
			'docs/PULL_REQUEST_TEMPLATE/b.md',
			'.github/PULL_REQUEST_TEMPLATE.md',
			'.github/PULL_REQUEST_TEMPLATE/a.md',
			'.github/PULL_REQUEST_TEMPLATE/b.md',
			'PULL_REQUEST_TEMPLATE.md'
		];
		expectedValuesSorted.sort();

		const uris = await findPullRequestTemplates(cwd);

		const urisSorted = uris.map(x => x.path.slice(cwd.path.length));
		urisSorted.sort();

		assert.deepStrictEqual(urisSorted, expectedValuesSorted);
	});

	test('selecting non-default quick-pick item should correspond to a template', async () => {
		const template0 = Uri.file('some-imaginary-template-0');
		const template1 = Uri.file('some-imaginary-template-1');
		const templates = [template0, template1];

		const pick = pickPullRequestTemplate(Uri.file('/'), templates);

		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');

		assert.ok(await pick === template0);
	});

	test('selecting first quick-pick item should return undefined', async () => {
		const templates = [Uri.file('some-imaginary-file')];

		const pick = pickPullRequestTemplate(Uri.file('/'), templates);

		await commands.executeCommand('workbench.action.quickOpenSelectNext');
		await commands.executeCommand('workbench.action.acceptSelectedQuickOpenItem');

		assert.ok(await pick === undefined);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/test/index.ts]---
Location: vscode-main/extensions/github/src/test/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as testRunner from '../../../../test/integration/electron/testrunner.js';

const suite = 'Github Tests';

const options: import('mocha').MochaOptions = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

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

export default testRunner;
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/typings/git-base.d.ts]---
Location: vscode-main/extensions/github/src/typings/git-base.d.ts

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

---[FILE: extensions/github/src/typings/git.d.ts]---
Location: vscode-main/extensions/github/src/typings/git.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uri, Event, Disposable, ProviderResult, Command, SourceControlHistoryItem } from 'vscode';
export { ProviderResult } from 'vscode';

export interface Git {
	readonly path: string;
}

export interface InputBox {
	value: string;
}

export const enum ForcePushMode {
	Force,
	ForceWithLease
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
	readonly remote?: string;
}

export interface UpstreamRef {
	readonly remote: string;
	readonly name: string;
}

export interface Branch extends Ref {
	readonly upstream?: UpstreamRef;
	readonly ahead?: number;
	readonly behind?: number;
}

export interface Commit {
	readonly hash: string;
	readonly message: string;
	readonly parents: string[];
	readonly authorDate?: Date;
	readonly authorName?: string;
	readonly authorEmail?: string;
	readonly commitDate?: Date;
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

export interface BranchQuery {
	readonly remote?: boolean;
	readonly pattern?: string;
	readonly count?: number;
	readonly contains?: string;
}

export interface Repository {

	readonly rootUri: Uri;
	readonly inputBox: InputBox;
	readonly state: RepositoryState;
	readonly ui: RepositoryUIState;

	getConfigs(): Promise<{ key: string; value: string; }[]>;
	getConfig(key: string): Promise<string>;
	setConfig(key: string, value: string): Promise<string>;
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
	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffBlobs(object1: string, object2: string): Promise<string>;
	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;

	hashObject(data: string): Promise<string>;

	createBranch(name: string, checkout: boolean, ref?: string): Promise<void>;
	deleteBranch(name: string, force?: boolean): Promise<void>;
	getBranch(name: string): Promise<Branch>;
	getBranches(query: BranchQuery): Promise<Ref[]>;
	setBranchUpstream(name: string, upstream: string): Promise<void>;

	getMergeBase(ref1: string, ref2: string): Promise<string>;

	tag(name: string, upstream: string): Promise<void>;
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
	provideAvatar(repository: Repository, query: AvatarQuery): Promise<Map<string, string | undefined> | undefined>;
	provideHoverCommands(repository: Repository): Promise<Command[] | undefined>;
	provideMessageLinks(repository: Repository, message: string): Promise<string | undefined>;
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
	init(root: Uri, options?: InitOptions): Promise<Repository | null>;
	openRepository(root: Uri): Promise<Repository | null>

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
	AuthenticationFailed = 'AuthenticationFailed',
	NoUserNameConfigured = 'NoUserNameConfigured',
	NoUserEmailConfigured = 'NoUserEmailConfigured',
	NoRemoteRepositorySpecified = 'NoRemoteRepositorySpecified',
	NotAGitRepository = 'NotAGitRepository',
	NotAtRepositoryRoot = 'NotAtRepositoryRoot',
	Conflict = 'Conflict',
	StashConflict = 'StashConflict',
	UnmergedChanges = 'UnmergedChanges',
	PushRejected = 'PushRejected',
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
	EmptyCommitMessage = 'EmptyCommitMessage'
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github/src/typings/ref.d.ts]---
Location: vscode-main/extensions/github/src/typings/ref.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'tunnel';
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/.gitignore]---
Location: vscode-main/extensions/github-authentication/.gitignore

```text
src/common/config.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/.npmrc]---
Location: vscode-main/extensions/github-authentication/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/.vscodeignore]---
Location: vscode-main/extensions/github-authentication/.vscodeignore

```text
.gitignore
src/**
!src/common/config.json
out/**
build/**
extension.webpack.config.js
extension-browser.webpack.config.js
tsconfig.json
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/github-authentication/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	node: false,
	entry: {
		extension: './src/extension.ts',
	},
	resolve: {
		alias: {
			'uuid': path.resolve(import.meta.dirname, 'node_modules/uuid/dist/esm-browser/index.js'),
			'./node/authServer': path.resolve(import.meta.dirname, 'src/browser/authServer'),
			'./node/crypto': path.resolve(import.meta.dirname, 'src/browser/crypto'),
			'./node/fetch': path.resolve(import.meta.dirname, 'src/browser/fetch'),
			'./node/buffer': path.resolve(import.meta.dirname, 'src/browser/buffer'),
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/extension.webpack.config.js]---
Location: vscode-main/extensions/github-authentication/extension.webpack.config.js

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
		extension: './src/extension.ts',
	},
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/package-lock.json]---
Location: vscode-main/extensions/github-authentication/package-lock.json

```json
{
  "name": "github-authentication",
  "version": "0.0.2",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "github-authentication",
      "version": "0.0.2",
      "license": "MIT",
      "dependencies": {
        "@vscode/extension-telemetry": "^0.9.8",
        "node-fetch": "2.6.7",
        "vscode-tas-client": "^0.1.84"
      },
      "devDependencies": {
        "@types/mocha": "^10.0.10",
        "@types/node": "22.x",
        "@types/node-fetch": "^2.5.7"
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
    "node_modules/@types/node-fetch": {
      "version": "2.5.7",
      "resolved": "https://registry.npmjs.org/@types/node-fetch/-/node-fetch-2.5.7.tgz",
      "integrity": "sha512-o2WVNf5UhWRkxlf6eq+jMZDu7kjgpgJfl4xVNlvryc95O/6F2ld8ztKX+qu+Rjyet93WAWm5LjeX9H5FGkODvw==",
      "dev": true,
      "dependencies": {
        "@types/node": "*",
        "form-data": "^3.0.0"
      }
    },
    "node_modules/@vscode/extension-telemetry": {
      "version": "0.9.8",
      "resolved": "https://registry.npmjs.org/@vscode/extension-telemetry/-/extension-telemetry-0.9.8.tgz",
      "integrity": "sha512-7YcKoUvmHlIB8QYCE4FNzt3ErHi9gQPhdCM3ZWtpw1bxPT0I+lMdx52KHlzTNoJzQ2NvMX7HyzyDwBEiMgTrWQ==",
      "license": "MIT",
      "dependencies": {
        "@microsoft/1ds-core-js": "^4.3.4",
        "@microsoft/1ds-post-js": "^4.3.4",
        "@microsoft/applicationinsights-web-basic": "^3.3.4"
      },
      "engines": {
        "vscode": "^1.75.0"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha1-x57Zf380y48robyXkLzDZkdLS3k= sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "dev": true
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "dev": true,
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha1-3zrhmayt+31ECqrgsp4icrJOxhk= sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "dev": true,
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/form-data": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-3.0.4.tgz",
      "integrity": "sha512-f0cRzm6dkyVYV3nPoooP8XlccPQukegwhAnpoLcXy+X+A8KfpGOoXwDr9FLZd3wzgLaBGQBE3lY93Zm/i1JvIQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-fetch": {
      "version": "2.6.7",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.6.7.tgz",
      "integrity": "sha512-ZjMPFEfVx5j+y2yF35Kzx5sF7kDzxuDj6ziH4FFbOp87zKDZNx8yExJIb05OGF4Nlt9IHFIMBkRl41VdvcNdbQ==",
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/tas-client": {
      "version": "0.2.33",
      "resolved": "https://registry.npmjs.org/tas-client/-/tas-client-0.2.33.tgz",
      "integrity": "sha512-V+uqV66BOQnWxvI6HjDnE4VkInmYZUQ4dgB7gzaDyFyFSK1i1nF/j7DpS9UbQAgV9NaF1XpcyuavnM1qOeiEIg=="
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha1-gYT9NH2snNwYWZLzpmIuFLnZq2o= sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw=="
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-tas-client": {
      "version": "0.1.84",
      "resolved": "https://registry.npmjs.org/vscode-tas-client/-/vscode-tas-client-0.1.84.tgz",
      "integrity": "sha512-rUTrUopV+70hvx1hW5ebdw1nd6djxubkLvVxjGdyD/r5v/wcVF41LIfiAtbm5qLZDtQdsMH1IaCuDoluoIa88w==",
      "dependencies": {
        "tas-client": "0.2.33"
      },
      "engines": {
        "vscode": "^1.85.0"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha1-JFNCdeKnvGvnvIZhHMFq4KVlSHE= sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ=="
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha1-lmRU6HZUYuN2RNNib2dCzotwll0= sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/package.json]---
Location: vscode-main/extensions/github-authentication/package.json

```json
{
  "name": "github-authentication",
  "displayName": "%displayName%",
  "description": "%description%",
  "publisher": "vscode",
  "license": "MIT",
  "version": "0.0.2",
  "engines": {
    "vscode": "^1.41.0"
  },
  "icon": "images/icon.png",
  "categories": [
    "Other"
  ],
  "api": "none",
  "extensionKind": [
    "ui",
    "workspace"
  ],
  "enabledApiProposals": [
    "authIssuers",
    "authProviderSpecific"
  ],
  "activationEvents": [],
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": "limited",
      "restrictedConfigurations": [
        "github-enterprise.uri"
      ]
    }
  },
  "contributes": {
    "authentication": [
      {
        "label": "GitHub",
        "id": "github",
        "authorizationServerGlobs": [
          "https://github.com/login/oauth"
        ]
      },
      {
        "label": "GitHub Enterprise Server",
        "id": "github-enterprise",
        "authorizationServerGlobs": [
          "*"
        ]
      }
    ],
    "configuration": [
      {
        "title": "%config.github-enterprise.title%",
        "properties": {
          "github-enterprise.uri": {
            "type": "string",
            "markdownDescription": "%config.github-enterprise.uri.description%",
            "pattern": "^(?:$|(https?)://(?!github\\.com).*)"
          },
          "github-authentication.useElectronFetch": {
            "type": "boolean",
            "default": true,
            "scope": "application",
            "markdownDescription": "%config.github-authentication.useElectronFetch.description%"
          },
          "github-authentication.preferDeviceCodeFlow": {
            "type": "boolean",
            "default": false,
            "scope": "application",
            "markdownDescription": "%config.github-authentication.preferDeviceCodeFlow.description%"
          }
        }
      }
    ]
  },
  "aiKey": "0c6ae279ed8443289764825290e4f9e2-1a736e7c-1324-4338-be46-fc2a58ae4d14-7255",
  "main": "./out/extension.js",
  "browser": "./dist/browser/extension.js",
  "scripts": {
    "compile": "gulp compile-extension:github-authentication",
    "compile-web": "npx webpack-cli --config extension-browser.webpack.config --mode none",
    "watch": "gulp watch-extension:github-authentication",
    "watch-web": "npx webpack-cli --config extension-browser.webpack.config --mode none --watch --info-verbosity verbose",
    "vscode:prepublish": "npm run compile"
  },
  "dependencies": {
    "node-fetch": "2.6.7",
    "@vscode/extension-telemetry": "^0.9.8",
    "vscode-tas-client": "^0.1.84"
  },
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "@types/node": "22.x",
    "@types/node-fetch": "^2.5.7"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/package.nls.json]---
Location: vscode-main/extensions/github-authentication/package.nls.json

```json
{
	"displayName": "GitHub Authentication",
	"description": "GitHub Authentication Provider",
	"config.github-enterprise.title": "GHE.com & GitHub Enterprise Server Authentication",
	"config.github-enterprise.uri.description": "The URI for your GHE.com or GitHub Enterprise Server instance.\n\nExamples:\n* GHE.com: `https://octocat.ghe.com`\n* GitHub Enterprise Server: `https://github.octocat.com`\n\n> **Note:** This should _not_ be set to a GitHub.com URI. If your account exists on GitHub.com or is a GitHub Enterprise Managed User, you do not need any additional configuration and can simply log in to GitHub.",
	"config.github-authentication.useElectronFetch.description": "When true, uses Electron's built-in fetch function for HTTP requests. When false, uses the Node.js global fetch function. This setting only applies when running in the Electron environment. **Note:** A restart is required for this setting to take effect.",
	"config.github-authentication.preferDeviceCodeFlow.description": "When true, prioritize the device code flow for authentication instead of other available flows. This is useful for environments like WSL where the local server or URL handler flows may not work as expected."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/README.md]---
Location: vscode-main/extensions/github-authentication/README.md

```markdown
# GitHub Authentication for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides support for authenticating to GitHub. It registers the `github` Authentication Provider that can be leveraged by other extensions. This also provides the GitHub authentication used by Settings Sync.
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/tsconfig.json]---
Location: vscode-main/extensions/github-authentication/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"lib": [
			"WebWorker"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.authIssuers.d.ts",
		"../../src/vscode-dts/vscode.proposed.authProviderSpecific.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/media/auth.css]---
Location: vscode-main/extensions/github-authentication/media/auth.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

:root {
	/* Dark theme colors (default) */
	--vscode-foreground: #CCCCCC;
	--vscode-editor-background: #1F1F1F;
	--vscode-error-foreground: #F85149;
	--vscode-textLink-foreground: #4daafc;

	--vscode-filter-0: drop-shadow(0 0 0 rgba(0, 122, 204, 0));
	--vscode-filter-50: drop-shadow(0 4px 12px rgba(0, 122, 204, 0.15));
	--vscode-filter-70: drop-shadow(0 6px 18px rgba(0, 122, 204, 0.25));
	--vscode-filter-100: drop-shadow(0 8px 24px rgba(0, 122, 204, 0.3));

	--vscode-insiders-filter-0: drop-shadow(0 0 0 rgba(36, 191, 165, 0));
	--vscode-insiders-filter-50: drop-shadow(0 4px 12px rgba(36, 191, 165, 0.15));
	--vscode-insiders-filter-70: drop-shadow(0 6px 18px rgba(36, 191, 165, 0.25));
	--vscode-insiders-filter-100: drop-shadow(0 8px 24px rgba(36, 191, 165, 0.3));
}

/* Light theme colors */
@media (prefers-color-scheme: light) {
	:root {
		--vscode-foreground: #3B3B3B;
		--vscode-editor-background: #FFFFFF;
		--vscode-error-foreground: #F85149;
		--vscode-textLink-foreground: #005FB8;
	}
}

html {
	height: 100%;
}

body {
	box-sizing: border-box;
	min-height: 100%;
	margin: 0;
	padding: 15px 30px;
	display: flex;
	flex-direction: column;
	color: var(--vscode-foreground);
	font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, "Ubuntu", "Droid Sans", sans-serif;
	background-color: var(--vscode-editor-background);
}

a {
	color: var(--vscode-textLink-foreground);
	text-decoration: none;
}

a:hover, a:focus {
	text-decoration: underline;
}

.container {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.icon-container {
	margin-bottom: 24px;
}

@keyframes rise-and-glow {
	0% {
		opacity: 0;
		transform: translateY(15px) scale(0.95);
		filter: var(--vscode-filter-0);
	}

	50% {
		opacity: 0.8;
		transform: translateY(-2px) scale(1.02);
		filter: var(--vscode-filter-50);
	}

	70% {
		opacity: 1;
		transform: translateY(1px) scale(0.99);
		filter: var(--vscode-filter-70);
	}

	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: var(--vscode-filter-100);
	}
}

.vscode-icon {
	width: 128px;
	height: 128px;
	animation: rise-and-glow 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.title {
	font-size: 28px;
	font-weight: 300;
	margin: 0 0 12px 0;
	color: var(--vscode-foreground);
}

.subtitle {
	font-size: 18px;
	font-weight: 300;
	color: var(--vscode-foreground);
	opacity: 0.7;
	margin: 0 0 36px 0;
}

.detail {
	font-size: 14px;
	color: var(--vscode-foreground);
	opacity: 0.7;
	margin: 0;
}

body.error .detail {
	color: var(--vscode-error-foreground);
}

body.error .success-message {
	display: none;
}

body:not(.error) .error-message {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/media/code-icon.svg]---
Location: vscode-main/extensions/github-authentication/media/code-icon.svg

```text
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>.st0{fill:#f6f6f6;fill-opacity:0}.st1{fill:#fff}.st2{fill:#167abf}</style><path class="st0" d="M1024 1024H0V0h1024v1024z"/><path class="st1" d="M1024 85.333v853.333H0V85.333h1024z"/><path class="st2" d="M0 85.333h298.667v853.333H0V85.333zm1024 0v853.333H384V85.333h640zm-554.667 160h341.333v-64H469.333v64zm341.334 533.334H469.333v64h341.333l.001-64zm128-149.334H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/media/index.html]---
Location: vscode-main/extensions/github-authentication/media/index.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>GitHub Authentication - Sign In</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" media="screen" href="auth.css" />
</head>

<body>
	<div class="container">
		<div class="content">
			<div class="icon-container">
				<img src="code-icon.svg" class="vscode-icon">
			</div>
			<h1 class="title">Launching <span class="app-name"></span></h1>
			<div class="message">
				<div class="success-message">
					<p class="subtitle">You will be redirected in a few moments.</p>
					<p class="detail">If nothing happens, <a href="#" id="fallback-link">open this link in your browser</a>.</p>
				</div>
				<div class="error-message">
					<p class="subtitle">An error occurred while signing in:</p>
					<div class="detail"></div>
				</div>
			</div>
		</div>
	</div>
	<script>
		const urlParams = new URLSearchParams(window.location.search);
		const appName = urlParams.get('app_name');
		document.querySelectorAll('.app-name').forEach(e => e.innerText = appName);

		// if name contains 'insiders', update filter CSS variables
		if (appName.toLowerCase().includes('insiders')) {
			document.documentElement.style.setProperty('--vscode-filter-0', 'var(--vscode-insiders-filter-0)');
			document.documentElement.style.setProperty('--vscode-filter-50', 'var(--vscode-insiders-filter-50)');
			document.documentElement.style.setProperty('--vscode-filter-70', 'var(--vscode-insiders-filter-70)');
			document.documentElement.style.setProperty('--vscode-filter-100', 'var(--vscode-insiders-filter-100)');
		}

		const error = urlParams.get('error');
		const redirectUri = urlParams.get('redirect_uri');
		if (error) {
			document.querySelector('.error-message > .detail').textContent = error;
			document.querySelector('body').classList.add('error');
		} else if (redirectUri) {
			// Wrap the redirect URI so that the browser remembers who triggered the redirect
			const wrappedRedirectUri = `https://vscode.dev/redirect?url=${encodeURIComponent(redirectUri)}`;
			// Set up the fallback link
			const fallbackLink = document.getElementById('fallback-link');
			if (fallbackLink) {
				fallbackLink.href = wrappedRedirectUri;
			}

			// Redirect after a delay
			setTimeout(() => {
				window.location = wrappedRedirectUri;
			}, 1000);
		}
	</script>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/config.ts]---
Location: vscode-main/extensions/github-authentication/src/config.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IConfig {
	// The client ID of the GitHub OAuth app
	gitHubClientId: string;
	gitHubClientSecret?: string;
}

// For easy access to mixin client ID and secret
//
// NOTE: GitHub client secrets cannot be secured when running in a native client so in other words, the client secret is
// not really a secret... so we allow the client secret in code. It is brought in before we publish VS Code. Reference:
// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app#client-secrets
export const Config: IConfig = {
	gitHubClientId: '01ab8ac9400c4e429b23'
};
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/extension.ts]---
Location: vscode-main/extensions/github-authentication/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { GitHubAuthenticationProvider, UriEventHandler } from './github';

const settingNotSent = '"github-enterprise.uri" not set';
const settingInvalid = '"github-enterprise.uri" invalid';

class NullAuthProvider implements vscode.AuthenticationProvider {
	private _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	onDidChangeSessions = this._onDidChangeSessions.event;

	private readonly _disposable: vscode.Disposable;

	constructor(private readonly _errorMessage: string) {
		this._disposable = vscode.authentication.registerAuthenticationProvider('github-enterprise', 'GitHub Enterprise', this);
	}

	createSession(): Thenable<vscode.AuthenticationSession> {
		throw new Error(this._errorMessage);
	}

	getSessions(): Thenable<vscode.AuthenticationSession[]> {
		return Promise.resolve([]);
	}
	removeSession(): Thenable<void> {
		throw new Error(this._errorMessage);
	}

	dispose() {
		this._onDidChangeSessions.dispose();
		this._disposable.dispose();
	}
}

function initGHES(context: vscode.ExtensionContext, uriHandler: UriEventHandler): vscode.Disposable {
	const settingValue = vscode.workspace.getConfiguration().get<string>('github-enterprise.uri');
	if (!settingValue) {
		const provider = new NullAuthProvider(settingNotSent);
		context.subscriptions.push(provider);
		return provider;
	}

	// validate user value
	let uri: vscode.Uri;
	try {
		uri = vscode.Uri.parse(settingValue, true);
	} catch (e) {
		vscode.window.showErrorMessage(vscode.l10n.t('GitHub Enterprise Server URI is not a valid URI: {0}', e.message ?? e));
		const provider = new NullAuthProvider(settingInvalid);
		context.subscriptions.push(provider);
		return provider;
	}

	const githubEnterpriseAuthProvider = new GitHubAuthenticationProvider(context, uriHandler, uri);
	context.subscriptions.push(githubEnterpriseAuthProvider);
	return githubEnterpriseAuthProvider;
}

export function activate(context: vscode.ExtensionContext) {
	const uriHandler = new UriEventHandler();
	context.subscriptions.push(uriHandler);
	context.subscriptions.push(vscode.window.registerUriHandler(uriHandler));

	context.subscriptions.push(new GitHubAuthenticationProvider(context, uriHandler));

	let before = vscode.workspace.getConfiguration().get<string>('github-enterprise.uri');
	let githubEnterpriseAuthProvider = initGHES(context, uriHandler);
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration('github-enterprise.uri')) {
			const after = vscode.workspace.getConfiguration().get<string>('github-enterprise.uri');
			if (before !== after) {
				githubEnterpriseAuthProvider?.dispose();
				before = after;
				githubEnterpriseAuthProvider = initGHES(context, uriHandler);
			}
		}
	}));

	// Listener to prompt for reload when the fetch implementation setting changes
	const beforeFetchSetting = vscode.workspace.getConfiguration().get<boolean>('github-authentication.useElectronFetch', true);
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async e => {
		if (e.affectsConfiguration('github-authentication.useElectronFetch')) {
			const afterFetchSetting = vscode.workspace.getConfiguration().get<boolean>('github-authentication.useElectronFetch', true);
			if (beforeFetchSetting !== afterFetchSetting) {
				const selection = await vscode.window.showInformationMessage(
					vscode.l10n.t('GitHub Authentication - Reload required'),
					{
						modal: true,
						detail: vscode.l10n.t('A reload is required for the fetch setting change to take effect.')
					},
					vscode.l10n.t('Reload Window')
				);
				if (selection) {
					await vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
			}
		}
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/flows.ts]---
Location: vscode-main/extensions/github-authentication/src/flows.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import { ProgressLocation, Uri, commands, env, l10n, window, workspace } from 'vscode';
import { Log } from './common/logger';
import { Config } from './config';
import { UriEventHandler } from './github';
import { fetching } from './node/fetch';
import { crypto } from './node/crypto';
import { LoopbackAuthServer } from './node/authServer';
import { promiseFromEvent } from './common/utils';
import { isHostedGitHubEnterprise } from './common/env';
import { NETWORK_ERROR, TIMED_OUT_ERROR, USER_CANCELLATION_ERROR } from './common/errors';

interface IGitHubDeviceCodeResponse {
	device_code: string;
	user_code: string;
	verification_uri: string;
	interval: number;
}

interface IFlowOptions {
	// GitHub.com
	readonly supportsGitHubDotCom: boolean;
	// A GitHub Enterprise Server that is hosted by an organization
	readonly supportsGitHubEnterpriseServer: boolean;
	// A GitHub Enterprise Server that is hosted by GitHub for an organization
	readonly supportsHostedGitHubEnterprise: boolean;

	// Runtimes - there are constraints on which runtimes support which flows
	readonly supportsWebWorkerExtensionHost: boolean;
	readonly supportsRemoteExtensionHost: boolean;

	// Clients - see `isSupportedClient` in `common/env.ts` for what constitutes a supported client
	readonly supportsSupportedClients: boolean;
	readonly supportsUnsupportedClients: boolean;

	// Configurations - some flows require a client secret
	readonly supportsNoClientSecret: boolean;
}

export const enum GitHubTarget {
	DotCom,
	Enterprise,
	HostedEnterprise
}

export const enum ExtensionHost {
	WebWorker,
	Remote,
	Local
}

export interface IFlowQuery {
	target: GitHubTarget;
	extensionHost: ExtensionHost;
	isSupportedClient: boolean;
}

interface IFlowTriggerOptions {
	/**
	 * The scopes to request for the OAuth flow.
	 */
	scopes: string;
	/**
	 * The base URI for the flow. This is used to determine which GitHub instance to authenticate against.
	 */
	baseUri: Uri;
	/**
	 * The specific auth provider to use for the flow.
	 */
	signInProvider?: GitHubSocialSignInProvider;
	/**
	 * Extra parameters to include in the OAuth flow.
	 */
	extraAuthorizeParameters?: Record<string, string>;
	/**
	 * The Uri that the OAuth flow will redirect to. (i.e. vscode.dev/redirect)
	 */
	redirectUri: Uri;
	/**
	 * The Uri to redirect to after redirecting to the redirect Uri. (i.e. vscode://....)
	 */
	callbackUri: Uri;
	/**
	 * The enterprise URI for the flow, if applicable.
	 */
	enterpriseUri?: Uri;
	/**
	 * The existing login which will be used to pre-fill the login prompt.
	 */
	existingLogin?: string;
	/**
	 * The nonce for this particular flow. This is used to prevent replay attacks.
	 */
	nonce: string;
	/**
	 * The instance of the Uri Handler for this extension
	 */
	uriHandler: UriEventHandler;
	/**
	 * The logger to use for this flow.
	 */
	logger: Log;
}

interface IFlow {
	label: string;
	options: IFlowOptions;
	trigger(options: IFlowTriggerOptions): Promise<string>;
}

/**
 * Generates a cryptographically secure random string for PKCE code verifier.
 * @param length The length of the string to generate
 * @returns A random hex string
 */
function generateRandomString(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array)
		.map(b => b.toString(16).padStart(2, '0'))
		.join('')
		.substring(0, length);
}

/**
 * Generates a PKCE code challenge from a code verifier using SHA-256.
 * @param codeVerifier The code verifier string
 * @returns A base64url-encoded SHA-256 hash of the code verifier
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await crypto.subtle.digest('SHA-256', data);

	// Base64url encode the digest
	const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)));
	return base64String
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

async function exchangeCodeForToken(
	logger: Log,
	endpointUri: Uri,
	redirectUri: Uri,
	code: string,
	codeVerifier: string,
	enterpriseUri?: Uri
): Promise<string> {
	logger.info('Exchanging code for token...');

	const clientSecret = Config.gitHubClientSecret;
	if (!clientSecret) {
		throw new Error('No client secret configured for GitHub authentication.');
	}

	const body = new URLSearchParams([
		['code', code],
		['client_id', Config.gitHubClientId],
		['redirect_uri', redirectUri.toString(true)],
		['client_secret', clientSecret],
		['code_verifier', codeVerifier]
	]);
	if (enterpriseUri) {
		body.append('github_enterprise', enterpriseUri.toString(true));
	}
	const result = await fetching(endpointUri.toString(true), {
		logger,
		retryFallbacks: true,
		expectJSON: true,
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: body.toString()
	});

	if (result.ok) {
		const json = await result.json();
		logger.info('Token exchange success!');
		return json.access_token;
	} else {
		const text = await result.text();
		const error = new Error(text);
		error.name = 'GitHubTokenExchangeError';
		throw error;
	}
}

class UrlHandlerFlow implements IFlow {
	label = l10n.t('url handler');
	options: IFlowOptions = {
		supportsGitHubDotCom: true,
		// Supporting GHES would be challenging because different versions
		// used a different client ID. We could try to detect the version
		// and use the right one, but that's a lot of work when we have
		// other flows that work well.
		supportsGitHubEnterpriseServer: false,
		supportsHostedGitHubEnterprise: true,
		supportsRemoteExtensionHost: true,
		supportsWebWorkerExtensionHost: true,
		// exchanging a code for a token requires a client secret
		supportsNoClientSecret: false,
		supportsSupportedClients: true,
		supportsUnsupportedClients: false
	};

	async trigger({
		scopes,
		baseUri,
		redirectUri,
		callbackUri,
		enterpriseUri,
		nonce,
		signInProvider,
		extraAuthorizeParameters,
		uriHandler,
		existingLogin,
		logger,
	}: IFlowTriggerOptions): Promise<string> {
		logger.info(`Trying without local server... (${scopes})`);
		return await window.withProgress<string>({
			location: ProgressLocation.Notification,
			title: l10n.t({
				message: 'Signing in to {0}...',
				args: [baseUri.authority],
				comment: ['The {0} will be a url, e.g. github.com']
			}),
			cancellable: true
		}, async (_, token) => {
			// Generate PKCE parameters
			const codeVerifier = generateRandomString(64);
			const codeChallenge = await generateCodeChallenge(codeVerifier);

			const promise = uriHandler.waitForCode(logger, scopes, nonce, token);

			const searchParams = new URLSearchParams([
				['client_id', Config.gitHubClientId],
				['redirect_uri', redirectUri.toString(true)],
				['scope', scopes],
				['state', encodeURIComponent(callbackUri.toString(true))],
				['code_challenge', codeChallenge],
				['code_challenge_method', 'S256']
			]);
			if (existingLogin) {
				searchParams.append('login', existingLogin);
			} else {
				searchParams.append('prompt', 'select_account');
			}
			if (signInProvider) {
				searchParams.append('provider', signInProvider);
			}
			if (extraAuthorizeParameters) {
				for (const [key, value] of Object.entries(extraAuthorizeParameters)) {
					searchParams.append(key, value);
				}
			}

			// The extra toString, parse is apparently needed for env.openExternal
			// to open the correct URL.
			const uri = Uri.parse(baseUri.with({
				path: '/login/oauth/authorize',
				query: searchParams.toString()
			}).toString(true));
			await env.openExternal(uri);

			const code = await promise;

			const proxyEndpoints: { [providerId: string]: string } | undefined = await commands.executeCommand('workbench.getCodeExchangeProxyEndpoints');
			const endpointUrl = proxyEndpoints?.github
				? Uri.parse(`${proxyEndpoints.github}login/oauth/access_token`)
				: baseUri.with({ path: '/login/oauth/access_token' });

			const accessToken = await exchangeCodeForToken(logger, endpointUrl, redirectUri, code, codeVerifier, enterpriseUri);
			return accessToken;
		});
	}
}

class LocalServerFlow implements IFlow {
	label = l10n.t('local server');
	options: IFlowOptions = {
		supportsGitHubDotCom: true,
		// Supporting GHES would be challenging because different versions
		// used a different client ID. We could try to detect the version
		// and use the right one, but that's a lot of work when we have
		// other flows that work well.
		supportsGitHubEnterpriseServer: false,
		supportsHostedGitHubEnterprise: true,
		// Opening a port on the remote side can't be open in the browser on
		// the client side so this flow won't work in remote extension hosts
		supportsRemoteExtensionHost: false,
		// Web worker can't open a port to listen for the redirect
		supportsWebWorkerExtensionHost: false,
		// exchanging a code for a token requires a client secret
		supportsNoClientSecret: false,
		supportsSupportedClients: true,
		supportsUnsupportedClients: true
	};
	async trigger({
		scopes,
		baseUri,
		redirectUri,
		callbackUri,
		enterpriseUri,
		signInProvider,
		extraAuthorizeParameters,
		existingLogin,
		logger
	}: IFlowTriggerOptions): Promise<string> {
		logger.info(`Trying with local server... (${scopes})`);
		return await window.withProgress<string>({
			location: ProgressLocation.Notification,
			title: l10n.t({
				message: 'Signing in to {0}...',
				args: [baseUri.authority],
				comment: ['The {0} will be a url, e.g. github.com']
			}),
			cancellable: true
		}, async (_, token) => {
			// Generate PKCE parameters
			const codeVerifier = generateRandomString(64);
			const codeChallenge = await generateCodeChallenge(codeVerifier);

			const searchParams = new URLSearchParams([
				['client_id', Config.gitHubClientId],
				['redirect_uri', redirectUri.toString(true)],
				['scope', scopes],
				['code_challenge', codeChallenge],
				['code_challenge_method', 'S256']
			]);
			if (existingLogin) {
				searchParams.append('login', existingLogin);
			} else {
				searchParams.append('prompt', 'select_account');
			}
			if (signInProvider) {
				searchParams.append('provider', signInProvider);
			}
			if (extraAuthorizeParameters) {
				for (const [key, value] of Object.entries(extraAuthorizeParameters)) {
					searchParams.append(key, value);
				}
			}

			const loginUrl = baseUri.with({
				path: '/login/oauth/authorize',
				query: searchParams.toString()
			});
			const server = new LoopbackAuthServer(path.join(__dirname, '../media'), loginUrl.toString(true), callbackUri.toString(true));
			const port = await server.start();

			let codeToExchange;
			try {
				env.openExternal(Uri.parse(`http://127.0.0.1:${port}/signin?nonce=${encodeURIComponent(server.nonce)}`));
				const { code } = await Promise.race([
					server.waitForOAuthResponse(),
					new Promise<any>((_, reject) => setTimeout(() => reject(TIMED_OUT_ERROR), 300_000)), // 5min timeout
					promiseFromEvent<any, any>(token.onCancellationRequested, (_, __, reject) => { reject(USER_CANCELLATION_ERROR); }).promise
				]);
				codeToExchange = code;
			} finally {
				setTimeout(() => {
					void server.stop();
				}, 5000);
			}

			const accessToken = await exchangeCodeForToken(
				logger,
				baseUri.with({ path: '/login/oauth/access_token' }),
				redirectUri,
				codeToExchange,
				codeVerifier,
				enterpriseUri);
			return accessToken;
		});
	}
}

class DeviceCodeFlow implements IFlow {
	label = l10n.t('device code');
	options: IFlowOptions = {
		supportsGitHubDotCom: true,
		supportsGitHubEnterpriseServer: true,
		supportsHostedGitHubEnterprise: true,
		supportsRemoteExtensionHost: true,
		// CORS prevents this from working in web workers
		supportsWebWorkerExtensionHost: false,
		supportsNoClientSecret: true,
		supportsSupportedClients: true,
		supportsUnsupportedClients: true
	};
	async trigger({ scopes, baseUri, signInProvider, extraAuthorizeParameters, logger }: IFlowTriggerOptions) {
		logger.info(`Trying device code flow... (${scopes})`);

		// Get initial device code
		const uri = baseUri.with({
			path: '/login/device/code',
			query: `client_id=${Config.gitHubClientId}&scope=${scopes}`
		});
		const result = await fetching(uri.toString(true), {
			logger,
			retryFallbacks: true,
			expectJSON: true,
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
		});
		if (!result.ok) {
			throw new Error(`Failed to get one-time code: ${await result.text()}`);
		}

		const json = await result.json() as IGitHubDeviceCodeResponse;

		const button = l10n.t('Copy & Continue to {0}', signInProvider ? GitHubSocialSignInProviderLabels[signInProvider] : l10n.t('GitHub'));
		const modalResult = await window.showInformationMessage(
			l10n.t({ message: 'Your Code: {0}', args: [json.user_code], comment: ['The {0} will be a code, e.g. 123-456'] }),
			{
				modal: true,
				detail: l10n.t('To finish authenticating, navigate to GitHub and paste in the above one-time code.')
			}, button);

		if (modalResult !== button) {
			throw new Error(USER_CANCELLATION_ERROR);
		}

		await env.clipboard.writeText(json.user_code);

		let open = Uri.parse(json.verification_uri);
		const query = new URLSearchParams(open.query);
		if (signInProvider) {
			query.set('provider', signInProvider);
		}
		if (extraAuthorizeParameters) {
			for (const [key, value] of Object.entries(extraAuthorizeParameters)) {
				query.set(key, value);
			}
		}
		if (signInProvider || extraAuthorizeParameters) {
			open = open.with({ query: query.toString() });
		}
		const uriToOpen = await env.asExternalUri(open);
		await env.openExternal(uriToOpen);

		return await this.waitForDeviceCodeAccessToken(logger, baseUri, json);
	}

	private async waitForDeviceCodeAccessToken(
		logger: Log,
		baseUri: Uri,
		json: IGitHubDeviceCodeResponse,
	): Promise<string> {
		return await window.withProgress<string>({
			location: ProgressLocation.Notification,
			cancellable: true,
			title: l10n.t({
				message: 'Open [{0}]({0}) in a new tab and paste your one-time code: {1}',
				args: [json.verification_uri, json.user_code],
				comment: [
					'The [{0}]({0}) will be a url and the {1} will be a code, e.g. 123-456',
					'{Locked="[{0}]({0})"}'
				]
			})
		}, async (_, token) => {
			const refreshTokenUri = baseUri.with({
				path: '/login/oauth/access_token',
				query: `client_id=${Config.gitHubClientId}&device_code=${json.device_code}&grant_type=urn:ietf:params:oauth:grant-type:device_code`
			});

			// Try for 2 minutes
			const attempts = 120 / json.interval;
			for (let i = 0; i < attempts; i++) {
				await new Promise(resolve => setTimeout(resolve, json.interval * 1000));
				if (token.isCancellationRequested) {
					throw new Error(USER_CANCELLATION_ERROR);
				}
				let accessTokenResult;
				try {
					accessTokenResult = await fetching(refreshTokenUri.toString(true), {
						logger,
						retryFallbacks: true,
						expectJSON: true,
						method: 'POST',
						headers: {
							Accept: 'application/json'
						}
					});
				} catch {
					continue;
				}

				if (!accessTokenResult.ok) {
					continue;
				}

				const accessTokenJson = await accessTokenResult.json();

				if (accessTokenJson.error === 'authorization_pending') {
					continue;
				}

				if (accessTokenJson.error) {
					throw new Error(accessTokenJson.error_description);
				}

				return accessTokenJson.access_token;
			}

			throw new Error(TIMED_OUT_ERROR);
		});
	}
}

class PatFlow implements IFlow {
	label = l10n.t('personal access token');
	options: IFlowOptions = {
		supportsGitHubDotCom: true,
		supportsGitHubEnterpriseServer: true,
		supportsHostedGitHubEnterprise: true,
		supportsRemoteExtensionHost: true,
		supportsWebWorkerExtensionHost: true,
		supportsNoClientSecret: true,
		// PATs can't be used with Settings Sync so we don't enable this flow
		// for supported clients
		supportsSupportedClients: false,
		supportsUnsupportedClients: true
	};

	async trigger({ scopes, baseUri, logger, enterpriseUri }: IFlowTriggerOptions) {
		logger.info(`Trying to retrieve PAT... (${scopes})`);

		const button = l10n.t('Continue to GitHub');
		const modalResult = await window.showInformationMessage(
			l10n.t('Continue to GitHub to create a Personal Access Token (PAT)'),
			{
				modal: true,
				detail: l10n.t('To finish authenticating, navigate to GitHub to create a PAT then paste the PAT into the input box.')
			}, button);

		if (modalResult !== button) {
			throw new Error(USER_CANCELLATION_ERROR);
		}

		const description = `${env.appName} (${scopes})`;
		const uriToOpen = await env.asExternalUri(baseUri.with({ path: '/settings/tokens/new', query: `description=${description}&scopes=${scopes.split(' ').join(',')}` }));
		await env.openExternal(uriToOpen);
		const token = await window.showInputBox({ placeHolder: `ghp_1a2b3c4...`, prompt: `GitHub Personal Access Token - ${scopes}`, ignoreFocusOut: true });
		if (!token) { throw new Error(USER_CANCELLATION_ERROR); }

		const appUri = !enterpriseUri || isHostedGitHubEnterprise(enterpriseUri)
			? Uri.parse(`${baseUri.scheme}://api.${baseUri.authority}`)
			: Uri.parse(`${baseUri.scheme}://${baseUri.authority}/api/v3`);

		const tokenScopes = await this.getScopes(token, appUri, logger); // Example: ['repo', 'user']
		const scopesList = scopes.split(' '); // Example: 'read:user repo user:email'
		if (!scopesList.every(scope => {
			const included = tokenScopes.includes(scope);
			if (included || !scope.includes(':')) {
				return included;
			}

			return scope.split(':').some(splitScopes => {
				return tokenScopes.includes(splitScopes);
			});
		})) {
			throw new Error(`The provided token does not match the requested scopes: ${scopes}`);
		}

		return token;
	}

	private async getScopes(token: string, serverUri: Uri, logger: Log): Promise<string[]> {
		try {
			logger.info('Getting token scopes...');
			const result = await fetching(serverUri.toString(), {
				logger,
				retryFallbacks: true,
				expectJSON: false,
				headers: {
					Authorization: `token ${token}`,
					'User-Agent': `${env.appName} (${env.appHost})`
				}
			});

			if (result.ok) {
				const scopes = result.headers.get('X-OAuth-Scopes');
				return scopes ? scopes.split(',').map(scope => scope.trim()) : [];
			} else {
				logger.error(`Getting scopes failed: ${result.statusText}`);
				throw new Error(result.statusText);
			}
		} catch (ex) {
			logger.error(ex.message);
			throw new Error(NETWORK_ERROR);
		}
	}
}

const allFlows: IFlow[] = [
	new LocalServerFlow(),
	new UrlHandlerFlow(),
	new DeviceCodeFlow(),
	new PatFlow()
];

export function getFlows(query: IFlowQuery) {
	const validFlows = allFlows.filter(flow => {
		let useFlow: boolean = true;
		switch (query.target) {
			case GitHubTarget.DotCom:
				useFlow &&= flow.options.supportsGitHubDotCom;
				break;
			case GitHubTarget.Enterprise:
				useFlow &&= flow.options.supportsGitHubEnterpriseServer;
				break;
			case GitHubTarget.HostedEnterprise:
				useFlow &&= flow.options.supportsHostedGitHubEnterprise;
				break;
		}

		switch (query.extensionHost) {
			case ExtensionHost.Remote:
				useFlow &&= flow.options.supportsRemoteExtensionHost;
				break;
			case ExtensionHost.WebWorker:
				useFlow &&= flow.options.supportsWebWorkerExtensionHost;
				break;
		}

		if (!Config.gitHubClientSecret) {
			useFlow &&= flow.options.supportsNoClientSecret;
		}

		if (query.isSupportedClient) {
			// TODO: revisit how we support PAT in GHES but not DotCom... but this works for now since
			// there isn't another flow that has supportsSupportedClients = false
			useFlow &&= (flow.options.supportsSupportedClients || query.target !== GitHubTarget.DotCom);
		} else {
			useFlow &&= flow.options.supportsUnsupportedClients;
		}
		return useFlow;
	});

	const preferDeviceCodeFlow = workspace.getConfiguration('github-authentication').get<boolean>('preferDeviceCodeFlow', false);
	if (preferDeviceCodeFlow) {
		return [
			...validFlows.filter(flow => flow instanceof DeviceCodeFlow),
			...validFlows.filter(flow => !(flow instanceof DeviceCodeFlow))
		];
	}

	return validFlows;
}

/**
 * Social authentication providers for GitHub
 */
export const enum GitHubSocialSignInProvider {
	Google = 'google',
	Apple = 'apple',
}

const GitHubSocialSignInProviderLabels = {
	[GitHubSocialSignInProvider.Google]: l10n.t('Google'),
	[GitHubSocialSignInProvider.Apple]: l10n.t('Apple'),
};

export function isSocialSignInProvider(provider: unknown): provider is GitHubSocialSignInProvider {
	return provider === GitHubSocialSignInProvider.Google || provider === GitHubSocialSignInProvider.Apple;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/github.ts]---
Location: vscode-main/extensions/github-authentication/src/github.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { Keychain } from './common/keychain';
import { GitHubServer, IGitHubServer } from './githubServer';
import { PromiseAdapter, arrayEquals, promiseFromEvent } from './common/utils';
import { ExperimentationTelemetry } from './common/experimentationService';
import { Log } from './common/logger';
import { crypto } from './node/crypto';
import { TIMED_OUT_ERROR, USER_CANCELLATION_ERROR } from './common/errors';
import { GitHubSocialSignInProvider, isSocialSignInProvider } from './flows';

interface SessionData {
	id: string;
	account?: {
		label?: string;
		displayName?: string;
		// Unfortunately, for some time the id was a number, so we need to support both.
		// This can be removed once we are confident that all users have migrated to the new id.
		id: string | number;
	};
	scopes: string[];
	accessToken: string;
}

export enum AuthProviderType {
	github = 'github',
	githubEnterprise = 'github-enterprise'
}

interface GitHubAuthenticationProviderOptions extends vscode.AuthenticationProviderSessionOptions {
	/**
	 * This is specific to GitHub and is used to determine which social sign-in provider to use.
	 * If not provided, the default (GitHub) is used which shows all options.
	 *
	 * Example: If you specify Google, then the sign-in flow will skip the initial page that asks you
	 * to choose how you want to sign in and will directly take you to the Google sign-in page.
	 *
	 * This allows us to show "Continue with Google" buttons in the product, rather than always
	 * leaving it up to the user to choose the social sign-in provider on the sign-in page.
	 */
	readonly provider?: GitHubSocialSignInProvider;
	readonly extraAuthorizeParameters?: Record<string, string>;
}

function isGitHubAuthenticationProviderOptions(object: any): object is GitHubAuthenticationProviderOptions {
	if (!object || typeof object !== 'object') {
		throw new Error('Options are not an object');
	}
	if (object.provider !== undefined && !isSocialSignInProvider(object.provider)) {
		throw new Error(`Provider is invalid: ${object.provider}`);
	}
	if (object.extraAuthorizeParameters !== undefined) {
		if (!object.extraAuthorizeParameters || typeof object.extraAuthorizeParameters !== 'object') {
			throw new Error('Extra parameters must be a record of string keys and string values.');
		}
		for (const [key, value] of Object.entries(object.extraAuthorizeParameters)) {
			if (typeof key !== 'string' || typeof value !== 'string') {
				throw new Error('Extra parameters must be a record of string keys and string values.');
			}
		}
	}
	return true;
}

export class UriEventHandler extends vscode.EventEmitter<vscode.Uri> implements vscode.UriHandler {
	private readonly _pendingNonces = new Map<string, string[]>();
	private readonly _codeExchangePromises = new Map<string, { promise: Promise<string>; cancel: vscode.EventEmitter<void> }>();

	public handleUri(uri: vscode.Uri) {
		this.fire(uri);
	}

	public async waitForCode(logger: Log, scopes: string, nonce: string, token: vscode.CancellationToken) {
		const existingNonces = this._pendingNonces.get(scopes) || [];
		this._pendingNonces.set(scopes, [...existingNonces, nonce]);

		let codeExchangePromise = this._codeExchangePromises.get(scopes);
		if (!codeExchangePromise) {
			codeExchangePromise = promiseFromEvent(this.event, this.handleEvent(logger, scopes));
			this._codeExchangePromises.set(scopes, codeExchangePromise);
		}

		try {
			return await Promise.race([
				codeExchangePromise.promise,
				new Promise<string>((_, reject) => setTimeout(() => reject(TIMED_OUT_ERROR), 300_000)), // 5min timeout
				promiseFromEvent<void, string>(token.onCancellationRequested, (_, __, reject) => { reject(USER_CANCELLATION_ERROR); }).promise
			]);
		} finally {
			this._pendingNonces.delete(scopes);
			codeExchangePromise?.cancel.fire();
			this._codeExchangePromises.delete(scopes);
		}
	}

	private handleEvent: (logger: Log, scopes: string) => PromiseAdapter<vscode.Uri, string> =
		(logger: Log, scopes) => (uri, resolve, reject) => {
			const query = new URLSearchParams(uri.query);
			const code = query.get('code');
			const nonce = query.get('nonce');
			if (!code) {
				reject(new Error('No code'));
				return;
			}
			if (!nonce) {
				reject(new Error('No nonce'));
				return;
			}

			const acceptedNonces = this._pendingNonces.get(scopes) || [];
			if (!acceptedNonces.includes(nonce)) {
				// A common scenario of this happening is if you:
				// 1. Trigger a sign in with one set of scopes
				// 2. Before finishing 1, you trigger a sign in with a different set of scopes
				// In this scenario we should just return and wait for the next UriHandler event
				// to run as we are probably still waiting on the user to hit 'Continue'
				logger.info('Nonce not found in accepted nonces. Skipping this execution...');
				return;
			}

			resolve(code);
		};
}

export class GitHubAuthenticationProvider implements vscode.AuthenticationProvider, vscode.Disposable {
	private readonly _sessionChangeEmitter = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	private readonly _logger: Log;
	private readonly _githubServer: IGitHubServer;
	private readonly _telemetryReporter: ExperimentationTelemetry;
	private readonly _keychain: Keychain;
	private readonly _accountsSeen = new Set<string>();
	private readonly _disposable: vscode.Disposable | undefined;

	private _sessionsPromise: Promise<vscode.AuthenticationSession[]>;

	constructor(
		private readonly context: vscode.ExtensionContext,
		uriHandler: UriEventHandler,
		ghesUri?: vscode.Uri
	) {
		const { aiKey } = context.extension.packageJSON as { name: string; version: string; aiKey: string };
		this._telemetryReporter = new ExperimentationTelemetry(context, new TelemetryReporter(aiKey));

		const type = ghesUri ? AuthProviderType.githubEnterprise : AuthProviderType.github;

		this._logger = new Log(type);

		this._keychain = new Keychain(
			this.context,
			type === AuthProviderType.github
				? `${type}.auth`
				: `${ghesUri?.authority}${ghesUri?.path}.ghes.auth`,
			this._logger);

		this._githubServer = new GitHubServer(
			this._logger,
			this._telemetryReporter,
			uriHandler,
			context.extension.extensionKind,
			ghesUri);

		// Contains the current state of the sessions we have available.
		this._sessionsPromise = this.readSessions().then((sessions) => {
			// fire telemetry after a second to allow the workbench to focus on loading
			setTimeout(() => sessions.forEach(s => this.afterSessionLoad(s)), 1000);
			return sessions;
		});

		const supportedAuthorizationServers = ghesUri
			? [vscode.Uri.joinPath(ghesUri, '/login/oauth')]
			: [vscode.Uri.parse('https://github.com/login/oauth')];
		this._disposable = vscode.Disposable.from(
			this._telemetryReporter,
			vscode.authentication.registerAuthenticationProvider(
				type,
				this._githubServer.friendlyName,
				this,
				{
					supportsMultipleAccounts: true,
					supportedAuthorizationServers
				}
			),
			this.context.secrets.onDidChange(() => this.checkForUpdates())
		);
	}

	dispose() {
		this._disposable?.dispose();
	}

	get onDidChangeSessions() {
		return this._sessionChangeEmitter.event;
	}

	async getSessions(scopes: string[] | undefined, options?: vscode.AuthenticationProviderSessionOptions): Promise<vscode.AuthenticationSession[]> {
		// For GitHub scope list, order doesn't matter so we immediately sort the scopes
		const sortedScopes = scopes?.sort() || [];
		this._logger.info(`Getting sessions for ${sortedScopes.length ? sortedScopes.join(',') : 'all scopes'}...`);
		const sessions = await this._sessionsPromise;
		const accountFilteredSessions = options?.account
			? sessions.filter(session => session.account.label === options.account?.label)
			: sessions;
		const finalSessions = sortedScopes.length
			? accountFilteredSessions.filter(session => arrayEquals([...session.scopes].sort(), sortedScopes))
			: accountFilteredSessions;

		this._logger.info(`Got ${finalSessions.length} sessions for ${sortedScopes?.join(',') ?? 'all scopes'}...`);
		return finalSessions;
	}

	private async afterSessionLoad(session: vscode.AuthenticationSession): Promise<void> {
		// We only want to fire a telemetry if we haven't seen this account yet in this session.
		if (!this._accountsSeen.has(session.account.id)) {
			this._accountsSeen.add(session.account.id);
			this._githubServer.sendAdditionalTelemetryInfo(session);
		}
	}

	private async checkForUpdates() {
		const previousSessions = await this._sessionsPromise;
		this._sessionsPromise = this.readSessions();
		const storedSessions = await this._sessionsPromise;

		const added: vscode.AuthenticationSession[] = [];
		const removed: vscode.AuthenticationSession[] = [];

		storedSessions.forEach(session => {
			const matchesExisting = previousSessions.some(s => s.id === session.id);
			// Another window added a session to the keychain, add it to our state as well
			if (!matchesExisting) {
				this._logger.info('Adding session found in keychain');
				added.push(session);
			}
		});

		previousSessions.forEach(session => {
			const matchesExisting = storedSessions.some(s => s.id === session.id);
			// Another window has logged out, remove from our state
			if (!matchesExisting) {
				this._logger.info('Removing session no longer found in keychain');
				removed.push(session);
			}
		});

		if (added.length || removed.length) {
			this._sessionChangeEmitter.fire({ added, removed, changed: [] });
		}
	}

	private async readSessions(): Promise<vscode.AuthenticationSession[]> {
		let sessionData: SessionData[];
		try {
			this._logger.info('Reading sessions from keychain...');
			const storedSessions = await this._keychain.getToken();
			if (!storedSessions) {
				return [];
			}
			this._logger.info('Got stored sessions!');

			try {
				sessionData = JSON.parse(storedSessions);
			} catch (e) {
				await this._keychain.deleteToken();
				throw e;
			}
		} catch (e) {
			this._logger.error(`Error reading token: ${e}`);
			return [];
		}

		// Unfortunately, we were using a number secretly for the account id for some time... this is due to a bad `any`.
		// AuthenticationSession's account id is a string, so we need to detect when there is a number accountId and re-store
		// the sessions to migrate away from the bad number usage.
		// TODO@TylerLeonhardt: Remove this after we are confident that all users have migrated to the new id.
		let seenNumberAccountId: boolean = false;
		// TODO: eventually remove this Set because we should only have one session per set of scopes.
		const scopesSeen = new Set<string>();
		const sessionPromises = sessionData.map(async (session: SessionData): Promise<vscode.AuthenticationSession | undefined> => {
			// For GitHub scope list, order doesn't matter so we immediately sort the scopes
			const scopesStr = [...session.scopes].sort().join(' ');
			let userInfo: { id: string; accountName: string } | undefined;
			if (!session.account) {
				try {
					userInfo = await this._githubServer.getUserInfo(session.accessToken);
					this._logger.info(`Verified session with the following scopes: ${scopesStr}`);
				} catch (e) {
					// Remove sessions that return unauthorized response
					if (e.message === 'Unauthorized') {
						return undefined;
					}
				}
			}

			this._logger.trace(`Read the following session from the keychain with the following scopes: ${scopesStr}`);
			scopesSeen.add(scopesStr);

			let accountId: string;
			if (session.account?.id) {
				if (typeof session.account.id === 'number') {
					seenNumberAccountId = true;
				}
				accountId = `${session.account.id}`;
			} else {
				accountId = userInfo?.id ?? '<unknown>';
			}
			return {
				id: session.id,
				account: {
					label: session.account
						? session.account.label ?? session.account.displayName ?? '<unknown>'
						: userInfo?.accountName ?? '<unknown>',
					id: accountId
				},
				// we set this to session.scopes to maintain the original order of the scopes requested
				// by the extension that called getSession()
				scopes: session.scopes,
				accessToken: session.accessToken
			};
		});

		const verifiedSessions = (await Promise.allSettled(sessionPromises))
			.filter(p => p.status === 'fulfilled')
			.map(p => (p as PromiseFulfilledResult<vscode.AuthenticationSession | undefined>).value)
			.filter(<T>(p?: T): p is T => Boolean(p));

		this._logger.info(`Got ${verifiedSessions.length} verified sessions.`);
		if (seenNumberAccountId || verifiedSessions.length !== sessionData.length) {
			await this.storeSessions(verifiedSessions);
		}

		return verifiedSessions;
	}

	private async storeSessions(sessions: vscode.AuthenticationSession[]): Promise<void> {
		this._logger.info(`Storing ${sessions.length} sessions...`);
		this._sessionsPromise = Promise.resolve(sessions);
		await this._keychain.setToken(JSON.stringify(sessions));
		this._logger.info(`Stored ${sessions.length} sessions!`);
	}

	public async createSession(scopes: string[], options?: GitHubAuthenticationProviderOptions): Promise<vscode.AuthenticationSession> {
		try {
			// For GitHub scope list, order doesn't matter so we use a sorted scope to determine
			// if we've got a session already.
			const sortedScopes = [...scopes].sort();

			/* __GDPR__
				"login" : {
					"owner": "TylerLeonhardt",
					"comment": "Used to determine how much usage the GitHub Auth Provider gets.",
					"scopes": { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight", "comment": "Used to determine what scope combinations are being requested." }
				}
			*/
			this._telemetryReporter?.sendTelemetryEvent('login', {
				scopes: JSON.stringify(scopes),
			});

			if (options && !isGitHubAuthenticationProviderOptions(options)) {
				throw new Error('Invalid options');
			}
			const sessions = await this._sessionsPromise;
			const loginWith = options?.account?.label;
			const signInProvider = options?.provider;
			this._logger.info(`Logging in with${signInProvider ? ` ${signInProvider}, ` : ''} '${loginWith ? loginWith : 'any'}' account...`);
			const scopeString = sortedScopes.join(' ');
			const token = await this._githubServer.login(scopeString, signInProvider, options?.extraAuthorizeParameters, loginWith);
			const session = await this.tokenToSession(token, scopes);
			this.afterSessionLoad(session);

			const sessionIndex = sessions.findIndex(s => s.account.id === session.account.id && arrayEquals([...s.scopes].sort(), sortedScopes));
			const removed = new Array<vscode.AuthenticationSession>();
			if (sessionIndex > -1) {
				removed.push(...sessions.splice(sessionIndex, 1, session));
			} else {
				sessions.push(session);
			}
			await this.storeSessions(sessions);

			this._sessionChangeEmitter.fire({ added: [session], removed, changed: [] });

			this._logger.info('Login success!');

			return session;
		} catch (e) {
			// If login was cancelled, do not notify user.
			if (e === 'Cancelled' || e.message === 'Cancelled') {
				/* __GDPR__
					"loginCancelled" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users cancel the login flow." }
				*/
				this._telemetryReporter?.sendTelemetryEvent('loginCancelled');
				throw e;
			}

			/* __GDPR__
				"loginFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users run into an error login flow." }
			*/
			this._telemetryReporter?.sendTelemetryEvent('loginFailed');

			vscode.window.showErrorMessage(vscode.l10n.t('Sign in failed: {0}', `${e}`));
			this._logger.error(e);
			throw e;
		}
	}

	private async tokenToSession(token: string, scopes: string[]): Promise<vscode.AuthenticationSession> {
		const userInfo = await this._githubServer.getUserInfo(token);
		return {
			id: crypto.getRandomValues(new Uint32Array(2)).reduce((prev, curr) => prev += curr.toString(16), ''),
			accessToken: token,
			account: { label: userInfo.accountName, id: userInfo.id },
			scopes
		};
	}

	public async removeSession(id: string) {
		try {
			/* __GDPR__
				"logout" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often users log out of an account." }
			*/
			this._telemetryReporter?.sendTelemetryEvent('logout');

			this._logger.info(`Logging out of ${id}`);

			const sessions = await this._sessionsPromise;
			const sessionIndex = sessions.findIndex(session => session.id === id);
			if (sessionIndex > -1) {
				const session = sessions[sessionIndex];
				sessions.splice(sessionIndex, 1);

				await this.storeSessions(sessions);
				await this._githubServer.logout(session);

				this._sessionChangeEmitter.fire({ added: [], removed: [session], changed: [] });
			} else {
				this._logger.error('Session not found');
			}
		} catch (e) {
			/* __GDPR__
				"logoutFailed" : { "owner": "TylerLeonhardt", "comment": "Used to determine how often logging out of an account fails." }
			*/
			this._telemetryReporter?.sendTelemetryEvent('logoutFailed');

			vscode.window.showErrorMessage(vscode.l10n.t('Sign out failed: {0}', `${e}`));
			this._logger.error(e);
			throw e;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/githubServer.ts]---
Location: vscode-main/extensions/github-authentication/src/githubServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ExperimentationTelemetry } from './common/experimentationService';
import { AuthProviderType, UriEventHandler } from './github';
import { Log } from './common/logger';
import { isSupportedClient, isSupportedTarget } from './common/env';
import { crypto } from './node/crypto';
import { fetching } from './node/fetch';
import { ExtensionHost, GitHubSocialSignInProvider, GitHubTarget, getFlows } from './flows';
import { CANCELLATION_ERROR, NETWORK_ERROR, USER_CANCELLATION_ERROR } from './common/errors';
import { Config } from './config';
import { base64Encode } from './node/buffer';

const REDIRECT_URL_STABLE = 'https://vscode.dev/redirect';
const REDIRECT_URL_INSIDERS = 'https://insiders.vscode.dev/redirect';

export interface IGitHubServer {
	login(scopes: string, signInProvider?: GitHubSocialSignInProvider, extraAuthorizeParameters?: Record<string, string>, existingLogin?: string): Promise<string>;
	logout(session: vscode.AuthenticationSession): Promise<void>;
	getUserInfo(token: string): Promise<{ id: string; accountName: string }>;
	sendAdditionalTelemetryInfo(session: vscode.AuthenticationSession): Promise<void>;
	friendlyName: string;
}


export class GitHubServer implements IGitHubServer {
	readonly friendlyName: string;

	private readonly _type: AuthProviderType;

	private _redirectEndpoint: string | undefined;

	constructor(
		private readonly _logger: Log,
		private readonly _telemetryReporter: ExperimentationTelemetry,
		private readonly _uriHandler: UriEventHandler,
		private readonly _extensionKind: vscode.ExtensionKind,
		private readonly _ghesUri?: vscode.Uri
	) {
		this._type = _ghesUri ? AuthProviderType.githubEnterprise : AuthProviderType.github;
		this.friendlyName = this._type === AuthProviderType.github ? 'GitHub' : _ghesUri?.authority!;
	}

	get baseUri() {
		if (this._type === AuthProviderType.github) {
			return vscode.Uri.parse('https://github.com/');
		}
		return this._ghesUri!;
	}

	private async getRedirectEndpoint(): Promise<string> {
		if (this._redirectEndpoint) {
			return this._redirectEndpoint;
		}
		if (this._type === AuthProviderType.github) {
			const proxyEndpoints = await vscode.commands.executeCommand<{ [providerId: string]: string } | undefined>('workbench.getCodeExchangeProxyEndpoints');
			// If we are running in insiders vscode.dev, then ensure we use the redirect route on that.
			this._redirectEndpoint = REDIRECT_URL_STABLE;
			if (proxyEndpoints?.github && new URL(proxyEndpoints.github).hostname === 'insiders.vscode.dev') {
				this._redirectEndpoint = REDIRECT_URL_INSIDERS;
			}
		} else {
			// GHE only supports a single redirect endpoint, so we can't use
			// insiders.vscode.dev/redirect when we're running in Insiders, unfortunately.
			// Additionally, we make the assumption that this function will only be used
			// in flows that target supported GHE targets, not on-prem GHES. Because of this
			// assumption, we can assume that the GHE version used is at least 3.8 which is
			// the version that changed the redirect endpoint to this URI from the old
			// GitHub maintained server.
			this._redirectEndpoint = 'https://vscode.dev/redirect';
		}
		return this._redirectEndpoint;
	}

	// TODO@joaomoreno TODO@TylerLeonhardt
	private _isNoCorsEnvironment: boolean | undefined;
	private async isNoCorsEnvironment(): Promise<boolean> {
		if (this._isNoCorsEnvironment !== undefined) {
			return this._isNoCorsEnvironment;
		}
		const uri = await vscode.env.asExternalUri(vscode.Uri.parse(`${vscode.env.uriScheme}://vscode.github-authentication/dummy`));
		this._isNoCorsEnvironment = (uri.scheme === 'https' && /^((insiders\.)?vscode|github)\./.test(uri.authority)) || (uri.scheme === 'http' && /^localhost/.test(uri.authority));
		return this._isNoCorsEnvironment;
	}

	public async login(scopes: string, signInProvider?: GitHubSocialSignInProvider, extraAuthorizeParameters?: Record<string, string>, existingLogin?: string): Promise<string> {
		this._logger.info(`Logging in for the following scopes: ${scopes}`);

		// Used for showing a friendlier message to the user when the explicitly cancel a flow.
		let userCancelled: boolean | undefined;
		const yes = vscode.l10n.t('Yes');
		const no = vscode.l10n.t('No');
		const promptToContinue = async (mode: string) => {
			if (userCancelled === undefined) {
				// We haven't had a failure yet so wait to prompt
				return;
			}
			const message = userCancelled
				? vscode.l10n.t('Having trouble logging in? Would you like to try a different way? ({0})', mode)
				: vscode.l10n.t('You have not yet finished authorizing this extension to use GitHub. Would you like to try a different way? ({0})', mode);
			const result = await vscode.window.showWarningMessage(message, yes, no);
			if (result !== yes) {
				throw new Error(CANCELLATION_ERROR);
			}
		};

		const nonce: string = crypto.getRandomValues(new Uint32Array(2)).reduce((prev, curr) => prev += curr.toString(16), '');
		const callbackUri = await vscode.env.asExternalUri(vscode.Uri.parse(`${vscode.env.uriScheme}://vscode.github-authentication/did-authenticate?nonce=${encodeURIComponent(nonce)}`));

		const supportedClient = isSupportedClient(callbackUri);
		const supportedTarget = isSupportedTarget(this._type, this._ghesUri);

		const isNodeEnvironment = typeof process !== 'undefined' && typeof process?.versions?.node === 'string';
		const flows = getFlows({
			target: this._type === AuthProviderType.github
				? GitHubTarget.DotCom
				: supportedTarget ? GitHubTarget.HostedEnterprise : GitHubTarget.Enterprise,
			extensionHost: isNodeEnvironment
				? this._extensionKind === vscode.ExtensionKind.UI ? ExtensionHost.Local : ExtensionHost.Remote
				: ExtensionHost.WebWorker,
			isSupportedClient: supportedClient
		});


		for (const flow of flows) {
			try {
				if (flow !== flows[0]) {
					await promptToContinue(flow.label);
				}
				return await flow.trigger({
					scopes,
					callbackUri,
					nonce,
					signInProvider,
					extraAuthorizeParameters,
					baseUri: this.baseUri,
					logger: this._logger,
					uriHandler: this._uriHandler,
					enterpriseUri: this._ghesUri,
					redirectUri: vscode.Uri.parse(await this.getRedirectEndpoint()),
					existingLogin
				});
			} catch (e) {
				userCancelled = this.processLoginError(e);
			}
		}

		throw new Error(userCancelled ? CANCELLATION_ERROR : 'No auth flow succeeded.');
	}

	public async logout(session: vscode.AuthenticationSession): Promise<void> {
		this._logger.trace(`Deleting session (${session.id}) from server...`);

		if (!Config.gitHubClientSecret) {
			this._logger.warn('No client secret configured for GitHub authentication. The token has been deleted with best effort on this system, but we are unable to delete the token on server without the client secret.');
			return;
		}

		// Only attempt to delete OAuth tokens. They are always prefixed with `gho_`.
		// https://docs.github.com/en/rest/apps/oauth-applications#about-oauth-apps-and-oauth-authorizations-of-github-apps
		if (!session.accessToken.startsWith('gho_')) {
			this._logger.warn('The token being deleted is not an OAuth token. It has been deleted locally, but we cannot delete it on server.');
			return;
		}

		if (!isSupportedTarget(this._type, this._ghesUri)) {
			this._logger.trace('GitHub.com and GitHub hosted GitHub Enterprise are the only options that support deleting tokens on the server. Skipping.');
			return;
		}

		const authHeader = 'Basic ' + base64Encode(`${Config.gitHubClientId}:${Config.gitHubClientSecret}`);
		const uri = this.getServerUri(`/applications/${Config.gitHubClientId}/token`);

		try {
			// Defined here: https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28#delete-an-app-token
			const result = await fetching(uri.toString(true), {
				logger: this._logger,
				retryFallbacks: true,
				expectJSON: false,
				method: 'DELETE',
				headers: {
					Accept: 'application/vnd.github+json',
					Authorization: authHeader,
					'X-GitHub-Api-Version': '2022-11-28',
					'User-Agent': `${vscode.env.appName} (${vscode.env.appHost})`
				},
				body: JSON.stringify({ access_token: session.accessToken }),
			});

			if (result.status === 204) {
				this._logger.trace(`Successfully deleted token from session (${session.id}) from server.`);
				return;
			}

			try {
				const body = await result.text();
				throw new Error(body);
			} catch (e) {
				throw new Error(`${result.status} ${result.statusText}`);
			}
		} catch (e) {
			this._logger.warn('Failed to delete token from server.' + (e.message ?? e));
		}
	}

	private getServerUri(path: string = '') {
		const apiUri = this.baseUri;
		// github.com and Hosted GitHub Enterprise instances
		if (isSupportedTarget(this._type, this._ghesUri)) {
			return vscode.Uri.parse(`${apiUri.scheme}://api.${apiUri.authority}`).with({ path });
		}
		// GitHub Enterprise Server (aka on-prem)
		return vscode.Uri.parse(`${apiUri.scheme}://${apiUri.authority}/api/v3${path}`);
	}

	public async getUserInfo(token: string): Promise<{ id: string; accountName: string }> {
		let result;
		try {
			this._logger.info('Getting user info...');
			result = await fetching(this.getServerUri('/user').toString(), {
				logger: this._logger,
				retryFallbacks: true,
				expectJSON: true,
				headers: {
					Authorization: `token ${token}`,
					'User-Agent': `${vscode.env.appName} (${vscode.env.appHost})`
				}
			});
		} catch (ex) {
			this._logger.error(ex.message);
			throw new Error(NETWORK_ERROR);
		}

		if (result.ok) {
			try {
				const json = await result.json() as { id: number; login: string };
				this._logger.info('Got account info!');
				return { id: `${json.id}`, accountName: json.login };
			} catch (e) {
				this._logger.error(`Unexpected error parsing response from GitHub: ${e.message ?? e}`);
				throw e;
			}
		} else {
			// either display the response message or the http status text
			let errorMessage = result.statusText;
			try {
				const json = await result.json();
				if (json.message) {
					errorMessage = json.message;
				}
			} catch (err) {
				// noop
			}
			this._logger.error(`Getting account info failed: ${errorMessage}`);
			throw new Error(errorMessage);
		}
	}

	public async sendAdditionalTelemetryInfo(session: vscode.AuthenticationSession): Promise<void> {
		if (!vscode.env.isTelemetryEnabled) {
			return;
		}
		const nocors = await this.isNoCorsEnvironment();

		if (nocors) {
			return;
		}

		if (this._type === AuthProviderType.github) {
			return await this.checkUserDetails(session);
		}

		// GHES
		await this.checkEnterpriseVersion(session.accessToken);
	}

	private async checkUserDetails(session: vscode.AuthenticationSession): Promise<void> {
		let edu: string | undefined;

		try {
			const result = await fetching('https://education.github.com/api/user', {
				logger: this._logger,
				retryFallbacks: true,
				expectJSON: true,
				headers: {
					Authorization: `token ${session.accessToken}`,
					'faculty-check-preview': 'true',
					'User-Agent': `${vscode.env.appName} (${vscode.env.appHost})`
				}
			});

			if (result.ok) {
				const json: { student: boolean; faculty: boolean } = await result.json();
				edu = json.student
					? 'student'
					: json.faculty
						? 'faculty'
						: 'none';
			} else {
				this._logger.info(`Unable to resolve optional EDU details. Status: ${result.status} ${result.statusText}`);
				edu = 'unknown';
			}
		} catch (e) {
			this._logger.info(`Unable to resolve optional EDU details. Error: ${e}`);
			edu = 'unknown';
		}

		/* __GDPR__
			"session" : {
				"owner": "TylerLeonhardt",
				"isEdu": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
				"isManaged": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		this._telemetryReporter.sendTelemetryEvent('session', {
			isEdu: edu,
			// Apparently, this is how you tell if a user is an EMU...
			isManaged: session.account.label.includes('_') ? 'true' : 'false'
		});
	}

	private async checkEnterpriseVersion(token: string): Promise<void> {
		try {
			let version: string;
			if (!isSupportedTarget(this._type, this._ghesUri)) {
				const result = await fetching(this.getServerUri('/meta').toString(), {
					logger: this._logger,
					retryFallbacks: true,
					expectJSON: true,
					headers: {
						Authorization: `token ${token}`,
						'User-Agent': `${vscode.env.appName} (${vscode.env.appHost})`
					}
				});

				if (!result.ok) {
					return;
				}

				const json: { verifiable_password_authentication: boolean; installed_version: string } = await result.json();
				version = json.installed_version;
			} else {
				version = 'hosted';
			}

			/* __GDPR__
				"ghe-session" : {
					"owner": "TylerLeonhardt",
					"version": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
				}
			*/
			this._telemetryReporter.sendTelemetryEvent('ghe-session', {
				version
			});
		} catch {
			// No-op
		}
	}

	private processLoginError(error: Error): boolean {
		if (error.message === CANCELLATION_ERROR) {
			throw error;
		}
		this._logger.error(error.message ?? error);
		return error.message === USER_CANCELLATION_ERROR;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/browser/authServer.ts]---
Location: vscode-main/extensions/github-authentication/src/browser/authServer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function startServer(_: any): any {
	throw new Error('Not implemented');
}

export function createServer(_: any): any {
	throw new Error('Not implemented');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/browser/buffer.ts]---
Location: vscode-main/extensions/github-authentication/src/browser/buffer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function base64Encode(text: string): string {
	return btoa(text);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/browser/crypto.ts]---
Location: vscode-main/extensions/github-authentication/src/browser/crypto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const crypto = globalThis.crypto;
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/browser/fetch.ts]---
Location: vscode-main/extensions/github-authentication/src/browser/fetch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const fetching = fetch;
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/env.ts]---
Location: vscode-main/extensions/github-authentication/src/common/env.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Uri } from 'vscode';
import { AuthProviderType } from '../github';

const VALID_DESKTOP_CALLBACK_SCHEMES = [
	'vscode',
	'vscode-insiders',
	// On Windows, some browsers don't seem to redirect back to OSS properly.
	// As a result, you get stuck in the auth flow. We exclude this from the
	// list until we can figure out a way to fix this behavior in browsers.
	// 'code-oss',
	'vscode-wsl',
	'vscode-exploration'
];

export function isSupportedClient(uri: Uri): boolean {
	return (
		VALID_DESKTOP_CALLBACK_SCHEMES.includes(uri.scheme) ||
		// vscode.dev & insiders.vscode.dev
		/(?:^|\.)vscode\.dev$/.test(uri.authority) ||
		// github.dev & codespaces
		/(?:^|\.)github\.dev$/.test(uri.authority)
	);
}

export function isSupportedTarget(type: AuthProviderType, gheUri?: Uri): boolean {
	return (
		type === AuthProviderType.github ||
		isHostedGitHubEnterprise(gheUri!)
	);
}

export function isHostedGitHubEnterprise(uri: Uri): boolean {
	return /\.ghe\.com$/.test(uri.authority);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/errors.ts]---
Location: vscode-main/extensions/github-authentication/src/common/errors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const TIMED_OUT_ERROR = 'Timed out';

// These error messages are internal and should not be shown to the user in any way.
export const USER_CANCELLATION_ERROR = 'User Cancelled';
export const NETWORK_ERROR = 'network error';

// This is the error message that we throw if the login was cancelled for any reason. Extensions
// calling `getSession` can handle this error to know that the user cancelled the login.
export const CANCELLATION_ERROR = 'Cancelled';
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/experimentationService.ts]---
Location: vscode-main/extensions/github-authentication/src/common/experimentationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';
import { getExperimentationService, IExperimentationService, IExperimentationTelemetry, TargetPopulation } from 'vscode-tas-client';

export class ExperimentationTelemetry implements IExperimentationTelemetry {
	private sharedProperties: Record<string, string> = {};
	private experimentationServicePromise: Promise<IExperimentationService> | undefined;

	constructor(private readonly context: vscode.ExtensionContext, private baseReporter: TelemetryReporter) { }

	private async createExperimentationService(): Promise<IExperimentationService> {
		let targetPopulation: TargetPopulation;
		switch (vscode.env.uriScheme) {
			case 'vscode':
				targetPopulation = TargetPopulation.Public;
				break;
			case 'vscode-insiders':
				targetPopulation = TargetPopulation.Insiders;
				break;
			case 'vscode-exploration':
				targetPopulation = TargetPopulation.Internal;
				break;
			case 'code-oss':
				targetPopulation = TargetPopulation.Team;
				break;
			default:
				targetPopulation = TargetPopulation.Public;
				break;
		}

		const id = this.context.extension.id;
		const version = this.context.extension.packageJSON.version;
		const experimentationService = getExperimentationService(id, version, targetPopulation, this, this.context.globalState);
		await experimentationService.initialFetch;
		return experimentationService;
	}

	/**
	 * @returns A promise that you shouldn't need to await because this is just telemetry.
	 */
	async sendTelemetryEvent(eventName: string, properties?: Record<string, string>, measurements?: Record<string, number>) {
		if (!this.experimentationServicePromise) {
			this.experimentationServicePromise = this.createExperimentationService();
		}
		await this.experimentationServicePromise;

		this.baseReporter.sendTelemetryEvent(
			eventName,
			{
				...this.sharedProperties,
				...properties,
			},
			measurements,
		);
	}

	/**
	 * @returns A promise that you shouldn't need to await because this is just telemetry.
	 */
	async sendTelemetryErrorEvent(
		eventName: string,
		properties?: Record<string, string>,
		_measurements?: Record<string, number>
	) {
		if (!this.experimentationServicePromise) {
			this.experimentationServicePromise = this.createExperimentationService();
		}
		await this.experimentationServicePromise;

		this.baseReporter.sendTelemetryErrorEvent(eventName, {
			...this.sharedProperties,
			...properties,
		});
	}

	setSharedProperty(name: string, value: string): void {
		this.sharedProperties[name] = value;
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const event: Record<string, string> = {};
		for (const [key, value] of props) {
			event[key] = value;
		}
		this.sendTelemetryEvent(eventName, event);
	}

	dispose(): Promise<any> {
		return this.baseReporter.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/keychain.ts]---
Location: vscode-main/extensions/github-authentication/src/common/keychain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Log } from './logger';

export class Keychain {
	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly serviceId: string,
		private readonly Logger: Log
	) { }

	async setToken(token: string): Promise<void> {
		try {
			return await this.context.secrets.store(this.serviceId, token);
		} catch (e) {
			// Ignore
			this.Logger.error(`Setting token failed: ${e}`);
		}
	}

	async getToken(): Promise<string | null | undefined> {
		try {
			const secret = await this.context.secrets.get(this.serviceId);
			if (secret && secret !== '[]') {
				this.Logger.trace('Token acquired from secret storage.');
			}
			return secret;
		} catch (e) {
			// Ignore
			this.Logger.error(`Getting token failed: ${e}`);
			return Promise.resolve(undefined);
		}
	}

	async deleteToken(): Promise<void> {
		try {
			return await this.context.secrets.delete(this.serviceId);
		} catch (e) {
			// Ignore
			this.Logger.error(`Deleting token failed: ${e}`);
			return Promise.resolve(undefined);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/logger.ts]---
Location: vscode-main/extensions/github-authentication/src/common/logger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { AuthProviderType } from '../github';

export class Log {
	private output: vscode.LogOutputChannel;

	constructor(private readonly type: AuthProviderType) {
		const friendlyName = this.type === AuthProviderType.github ? 'GitHub' : 'GitHub Enterprise';
		this.output = vscode.window.createOutputChannel(`${friendlyName} Authentication`, { log: true });
	}

	public trace(message: string): void {
		this.output.trace(message);
	}

	public debug(message: string): void {
		this.output.debug(message);
	}

	public info(message: string): void {
		this.output.info(message);
	}

	public error(message: string): void {
		this.output.error(message);
	}

	public warn(message: string): void {
		this.output.warn(message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/github-authentication/src/common/utils.ts]---
Location: vscode-main/extensions/github-authentication/src/common/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventEmitter, Event, Disposable } from 'vscode';

export function filterEvent<T>(event: Event<T>, filter: (e: T) => boolean): Event<T> {
	return (listener, thisArgs = null, disposables?) => event(e => filter(e) && listener.call(thisArgs, e), null, disposables);
}

export function onceEvent<T>(event: Event<T>): Event<T> {
	return (listener, thisArgs = null, disposables?) => {
		const result = event(e => {
			result.dispose();
			return listener.call(thisArgs, e);
		}, null, disposables);

		return result;
	};
}


export interface PromiseAdapter<T, U> {
	(
		value: T,
		resolve:
			(value: U | PromiseLike<U>) => void,
		reject:
			(reason: any) => void
	): any;
}

const passthrough = (value: any, resolve: (value?: any) => void) => resolve(value);

/**
 * Return a promise that resolves with the next emitted event, or with some future
 * event as decided by an adapter.
 *
 * If specified, the adapter is a function that will be called with
 * `(event, resolve, reject)`. It will be called once per event until it resolves or
 * rejects.
 *
 * The default adapter is the passthrough function `(value, resolve) => resolve(value)`.
 *
 * @param event the event
 * @param adapter controls resolution of the returned promise
 * @returns a promise that resolves or rejects as specified by the adapter
 */
export function promiseFromEvent<T, U>(
	event: Event<T>,
	adapter: PromiseAdapter<T, U> = passthrough): { promise: Promise<U>; cancel: EventEmitter<void> } {
	let subscription: Disposable;
	const cancel = new EventEmitter<void>();
	return {
		promise: new Promise<U>((resolve, reject) => {
			cancel.event(_ => reject('Cancelled'));
			subscription = event((value: T) => {
				try {
					Promise.resolve(adapter(value, resolve, reject))
						.catch(reject);
				} catch (error) {
					reject(error);
				}
			});
		}).then(
			(result: U) => {
				subscription.dispose();
				return result;
			},
			error => {
				subscription.dispose();
				throw error;
			}
		),
		cancel
	};
}

export function arrayEquals<T>(one: ReadonlyArray<T> | undefined, other: ReadonlyArray<T> | undefined, itemEquals: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
	if (one === other) {
		return true;
	}

	if (!one || !other) {
		return false;
	}

	if (one.length !== other.length) {
		return false;
	}

	for (let i = 0, len = one.length; i < len; i++) {
		if (!itemEquals(one[i], other[i])) {
			return false;
		}
	}

	return true;
}


export class StopWatch {

	private _startTime: number = Date.now();
	private _stopTime: number = -1;

	public stop(): void {
		this._stopTime = Date.now();
	}

	public elapsed(): number {
		if (this._stopTime !== -1) {
			return this._stopTime - this._startTime;
		}
		return Date.now() - this._startTime;
	}
}
```

--------------------------------------------------------------------------------

````

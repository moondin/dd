---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 38
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 38 of 552)

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

---[FILE: extensions/git/src/decorationProvider.ts]---
Location: vscode-main/extensions/git/src/decorationProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window, workspace, Uri, Disposable, Event, EventEmitter, FileDecoration, FileDecorationProvider, ThemeColor, l10n, SourceControlHistoryItemRef } from 'vscode';
import * as path from 'path';
import { Repository, GitResourceGroup } from './repository';
import { Model } from './model';
import { debounce } from './decorators';
import { filterEvent, dispose, anyEvent, PromiseSource, combinedDisposable, runAndSubscribeEvent } from './util';
import { Change, GitErrorCodes, Status } from './api/git';

function equalSourceControlHistoryItemRefs(ref1?: SourceControlHistoryItemRef, ref2?: SourceControlHistoryItemRef): boolean {
	if (ref1 === ref2) {
		return true;
	}

	return ref1?.id === ref2?.id &&
		ref1?.name === ref2?.name &&
		ref1?.revision === ref2?.revision;
}

class GitIgnoreDecorationProvider implements FileDecorationProvider {

	private static Decoration: FileDecoration = { color: new ThemeColor('gitDecoration.ignoredResourceForeground') };

	private readonly _onDidChangeDecorations = new EventEmitter<undefined | Uri | Uri[]>();
	readonly onDidChangeFileDecorations: Event<undefined | Uri | Uri[]> = this._onDidChangeDecorations.event;

	private queue = new Map<string, { repository: Repository; queue: Map<string, PromiseSource<FileDecoration | undefined>> }>();
	private disposables: Disposable[] = [];

	constructor(private model: Model) {
		const onDidChangeRepository = anyEvent<unknown>(
			filterEvent(workspace.onDidSaveTextDocument, e => /\.gitignore$|\.git\/info\/exclude$/.test(e.uri.path)),
			model.onDidOpenRepository,
			model.onDidCloseRepository
		);
		this.disposables.push(onDidChangeRepository(() => this._onDidChangeDecorations.fire(undefined)));
		this.disposables.push(window.registerFileDecorationProvider(this));
	}

	async provideFileDecoration(uri: Uri): Promise<FileDecoration | undefined> {
		const repository = this.model.getRepository(uri);

		if (!repository) {
			return;
		}

		let queueItem = this.queue.get(repository.root);

		if (!queueItem) {
			queueItem = { repository, queue: new Map<string, PromiseSource<FileDecoration | undefined>>() };
			this.queue.set(repository.root, queueItem);
		}

		let promiseSource = queueItem.queue.get(uri.fsPath);

		if (!promiseSource) {
			promiseSource = new PromiseSource();
			queueItem!.queue.set(uri.fsPath, promiseSource);
			this.checkIgnoreSoon();
		}

		return await promiseSource.promise;
	}

	@debounce(500)
	private checkIgnoreSoon(): void {
		const queue = new Map(this.queue.entries());
		this.queue.clear();

		for (const [, item] of queue) {
			const paths = [...item.queue.keys()];

			item.repository.checkIgnore(paths).then(ignoreSet => {
				for (const [path, promiseSource] of item.queue.entries()) {
					promiseSource.resolve(ignoreSet.has(path) ? GitIgnoreDecorationProvider.Decoration : undefined);
				}
			}, err => {
				if (err.gitErrorCode !== GitErrorCodes.IsInSubmodule) {
					console.error(err);
				}

				for (const [, promiseSource] of item.queue.entries()) {
					promiseSource.reject(err);
				}
			});
		}
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
		this.queue.clear();
	}
}

class GitDecorationProvider implements FileDecorationProvider {

	private static SubmoduleDecorationData: FileDecoration = {
		tooltip: 'Submodule',
		badge: 'S',
		color: new ThemeColor('gitDecoration.submoduleResourceForeground')
	};

	private readonly _onDidChangeDecorations = new EventEmitter<Uri[]>();
	readonly onDidChangeFileDecorations: Event<Uri[]> = this._onDidChangeDecorations.event;

	private disposables: Disposable[] = [];
	private decorations = new Map<string, FileDecoration>();

	constructor(private repository: Repository) {
		this.disposables.push(
			window.registerFileDecorationProvider(this),
			runAndSubscribeEvent(repository.onDidRunGitStatus, () => this.onDidRunGitStatus())
		);
	}

	private onDidRunGitStatus(): void {
		const newDecorations = new Map<string, FileDecoration>();

		this.collectDecorationData(this.repository.indexGroup, newDecorations);
		this.collectDecorationData(this.repository.untrackedGroup, newDecorations);
		this.collectDecorationData(this.repository.workingTreeGroup, newDecorations);
		this.collectDecorationData(this.repository.mergeGroup, newDecorations);
		this.collectSubmoduleDecorationData(newDecorations);

		const uris = new Set([...this.decorations.keys()].concat([...newDecorations.keys()]));
		this.decorations = newDecorations;
		this._onDidChangeDecorations.fire([...uris.values()].map(value => Uri.parse(value, true)));
	}

	private collectDecorationData(group: GitResourceGroup, bucket: Map<string, FileDecoration>): void {
		for (const r of group.resourceStates) {
			const decoration = r.resourceDecoration;

			if (decoration) {
				// not deleted and has a decoration
				bucket.set(r.original.toString(), decoration);

				if (r.type === Status.DELETED && r.rightUri) {
					bucket.set(r.rightUri.toString(), decoration);
				}

				if (r.type === Status.INDEX_RENAMED || r.type === Status.INTENT_TO_RENAME) {
					bucket.set(r.resourceUri.toString(), decoration);
				}
			}
		}
	}

	private collectSubmoduleDecorationData(bucket: Map<string, FileDecoration>): void {
		for (const submodule of this.repository.submodules) {
			bucket.set(Uri.file(path.join(this.repository.root, submodule.path)).toString(), GitDecorationProvider.SubmoduleDecorationData);
		}
	}

	provideFileDecoration(uri: Uri): FileDecoration | undefined {
		return this.decorations.get(uri.toString());
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
	}
}

class GitIncomingChangesFileDecorationProvider implements FileDecorationProvider {

	private readonly _onDidChangeDecorations = new EventEmitter<Uri[]>();
	readonly onDidChangeFileDecorations: Event<Uri[]> = this._onDidChangeDecorations.event;

	private _currentHistoryItemRef: SourceControlHistoryItemRef | undefined;
	private _currentHistoryItemRemoteRef: SourceControlHistoryItemRef | undefined;

	private _decorations = new Map<string, FileDecoration>();
	private readonly disposables: Disposable[] = [];

	constructor(private readonly repository: Repository) {
		this.disposables.push(
			window.registerFileDecorationProvider(this),
			runAndSubscribeEvent(repository.historyProvider.onDidChangeCurrentHistoryItemRefs, () => this.onDidChangeCurrentHistoryItemRefs())
		);
	}

	private async onDidChangeCurrentHistoryItemRefs(): Promise<void> {
		const historyProvider = this.repository.historyProvider;
		const currentHistoryItemRef = historyProvider.currentHistoryItemRef;
		const currentHistoryItemRemoteRef = historyProvider.currentHistoryItemRemoteRef;

		if (equalSourceControlHistoryItemRefs(this._currentHistoryItemRef, currentHistoryItemRef) &&
			equalSourceControlHistoryItemRefs(this._currentHistoryItemRemoteRef, currentHistoryItemRemoteRef)) {
			return;
		}

		const decorations = new Map<string, FileDecoration>();
		await this.collectIncomingChangesFileDecorations(decorations);
		const uris = new Set([...this._decorations.keys()].concat([...decorations.keys()]));

		this._decorations = decorations;
		this._currentHistoryItemRef = currentHistoryItemRef;
		this._currentHistoryItemRemoteRef = currentHistoryItemRemoteRef;

		this._onDidChangeDecorations.fire([...uris.values()].map(value => Uri.parse(value, true)));
	}

	private async collectIncomingChangesFileDecorations(bucket: Map<string, FileDecoration>): Promise<void> {
		for (const change of await this.getIncomingChanges()) {
			switch (change.status) {
				case Status.INDEX_ADDED:
					bucket.set(change.uri.toString(), {
						badge: '↓A',
						tooltip: l10n.t('Incoming Changes (added)'),
					});
					break;
				case Status.DELETED:
					bucket.set(change.uri.toString(), {
						badge: '↓D',
						tooltip: l10n.t('Incoming Changes (deleted)'),
					});
					break;
				case Status.INDEX_RENAMED:
					bucket.set(change.originalUri.toString(), {
						badge: '↓R',
						tooltip: l10n.t('Incoming Changes (renamed)'),
					});
					break;
				case Status.MODIFIED:
					bucket.set(change.uri.toString(), {
						badge: '↓M',
						tooltip: l10n.t('Incoming Changes (modified)'),
					});
					break;
				default: {
					bucket.set(change.uri.toString(), {
						badge: '↓~',
						tooltip: l10n.t('Incoming Changes'),
					});
					break;
				}
			}
		}
	}

	private async getIncomingChanges(): Promise<Change[]> {
		try {
			const historyProvider = this.repository.historyProvider;
			const currentHistoryItemRef = historyProvider.currentHistoryItemRef;
			const currentHistoryItemRemoteRef = historyProvider.currentHistoryItemRemoteRef;

			if (!currentHistoryItemRef || !currentHistoryItemRemoteRef) {
				return [];
			}

			const ancestor = await historyProvider.resolveHistoryItemRefsCommonAncestor([currentHistoryItemRef.id, currentHistoryItemRemoteRef.id]);
			if (!ancestor) {
				return [];
			}

			const changes = await this.repository.diffBetween2(ancestor, currentHistoryItemRemoteRef.id);
			return changes;
		} catch (err) {
			return [];
		}
	}

	provideFileDecoration(uri: Uri): FileDecoration | undefined {
		return this._decorations.get(uri.toString());
	}

	dispose(): void {
		dispose(this.disposables);
	}
}

export class GitDecorations {

	private enabled = false;
	private disposables: Disposable[] = [];
	private modelDisposables: Disposable[] = [];
	private providers = new Map<Repository, Disposable>();

	constructor(private model: Model) {
		this.disposables.push(new GitIgnoreDecorationProvider(model));

		const onEnablementChange = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.decorations.enabled'));
		onEnablementChange(this.update, this, this.disposables);
		this.update();
	}

	private update(): void {
		const config = workspace.getConfiguration('git');
		const enabled = config.get<boolean>('decorations.enabled') === true;
		if (this.enabled === enabled) {
			return;
		}

		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}

		this.enabled = enabled;
	}

	private enable(): void {
		this.model.onDidOpenRepository(this.onDidOpenRepository, this, this.modelDisposables);
		this.model.onDidCloseRepository(this.onDidCloseRepository, this, this.modelDisposables);
		this.model.repositories.forEach(this.onDidOpenRepository, this);
	}

	private disable(): void {
		this.modelDisposables = dispose(this.modelDisposables);
		this.providers.forEach(value => value.dispose());
		this.providers.clear();
	}

	private onDidOpenRepository(repository: Repository): void {
		const providers = combinedDisposable([
			new GitDecorationProvider(repository),
			new GitIncomingChangesFileDecorationProvider(repository)
		]);

		this.providers.set(repository, providers);
	}

	private onDidCloseRepository(repository: Repository): void {
		const provider = this.providers.get(repository);

		if (provider) {
			provider.dispose();
			this.providers.delete(repository);
		}
	}

	dispose(): void {
		this.disable();
		this.disposables = dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/decorators.ts]---
Location: vscode-main/extensions/git/src/decorators.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { done } from './util';

function decorate(decorator: (fn: Function, key: string) => Function): Function {
	return function (original: unknown, context: ClassMethodDecoratorContext) {
		if (typeof original === 'function' && (context.kind === 'method' || context.kind === 'getter' || context.kind === 'setter')) {
			return decorator(original, context.name.toString());
		}
		throw new Error('not supported');
	};
}

function _memoize(fn: Function, key: string): Function {
	const memoizeKey = `$memoize$${key}`;

	return function (this: any, ...args: any[]) {
		if (!this.hasOwnProperty(memoizeKey)) {
			Object.defineProperty(this, memoizeKey, {
				configurable: false,
				enumerable: false,
				writable: false,
				value: fn.apply(this, args)
			});
		}

		return this[memoizeKey];
	};
}

export const memoize = decorate(_memoize);

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

export const throttle = decorate(_throttle);

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

export function debounce(delay: number): Function {
	return decorate((fn, key) => {
		const timerKey = `$debounce$${key}`;

		return function (this: any, ...args: any[]) {
			clearTimeout(this[timerKey]);
			this[timerKey] = setTimeout(() => fn.apply(this, args), delay);
		};
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/diagnostics.ts]---
Location: vscode-main/extensions/git/src/diagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CodeAction, CodeActionKind, CodeActionProvider, Diagnostic, DiagnosticCollection, DiagnosticSeverity, Disposable, Range, Selection, TextDocument, Uri, WorkspaceEdit, l10n, languages, workspace } from 'vscode';
import { mapEvent, filterEvent, dispose } from './util';
import { Model } from './model';

export enum DiagnosticCodes {
	empty_message = 'empty_message',
	line_length = 'line_length'
}

export class GitCommitInputBoxDiagnosticsManager {

	private readonly diagnostics: DiagnosticCollection;
	private readonly severity = DiagnosticSeverity.Warning;
	private readonly disposables: Disposable[] = [];

	constructor(private readonly model: Model) {
		this.diagnostics = languages.createDiagnosticCollection();

		this.migrateInputValidationSettings()
			.then(() => {
				mapEvent(filterEvent(workspace.onDidChangeTextDocument, e => e.document.uri.scheme === 'vscode-scm'), e => e.document)(this.onDidChangeTextDocument, this, this.disposables);
				filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git.inputValidation') || e.affectsConfiguration('git.inputValidationLength') || e.affectsConfiguration('git.inputValidationSubjectLength'))(this.onDidChangeConfiguration, this, this.disposables);
			});
	}

	public getDiagnostics(uri: Uri): ReadonlyArray<Diagnostic> {
		return this.diagnostics.get(uri) ?? [];
	}

	private async migrateInputValidationSettings(): Promise<void> {
		try {
			const config = workspace.getConfiguration('git');
			const inputValidation = config.inspect<'always' | 'warn' | 'off' | boolean>('inputValidation');

			if (inputValidation === undefined) {
				return;
			}

			// Workspace setting
			if (typeof inputValidation.workspaceValue === 'string') {
				await config.update('inputValidation', inputValidation.workspaceValue !== 'off', false);
			}

			// User setting
			if (typeof inputValidation.globalValue === 'string') {
				await config.update('inputValidation', inputValidation.workspaceValue !== 'off', true);
			}
		} catch { }
	}

	private onDidChangeConfiguration(): void {
		for (const repository of this.model.repositories) {
			this.onDidChangeTextDocument(repository.inputBox.document);
		}
	}

	private onDidChangeTextDocument(document: TextDocument): void {
		const config = workspace.getConfiguration('git');
		const inputValidation = config.get<boolean>('inputValidation', false);
		if (!inputValidation) {
			this.diagnostics.set(document.uri, undefined);
			return;
		}

		if (/^\s+$/.test(document.getText())) {
			const documentRange = new Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end);
			const diagnostic = new Diagnostic(documentRange, l10n.t('Current commit message only contains whitespace characters'), this.severity);
			diagnostic.code = DiagnosticCodes.empty_message;

			this.diagnostics.set(document.uri, [diagnostic]);
			return;
		}

		const diagnostics: Diagnostic[] = [];
		const inputValidationLength = config.get<number>('inputValidationLength', 50);
		const inputValidationSubjectLength = config.get<number | undefined>('inputValidationSubjectLength', undefined);

		for (let index = 0; index < document.lineCount; index++) {
			const line = document.lineAt(index);
			const threshold = index === 0 ? inputValidationSubjectLength ?? inputValidationLength : inputValidationLength;

			if (line.text.length > threshold) {
				const diagnostic = new Diagnostic(line.range, l10n.t('{0} characters over {1} in current line', line.text.length - threshold, threshold), this.severity);
				diagnostic.code = DiagnosticCodes.line_length;

				diagnostics.push(diagnostic);
			}
		}

		this.diagnostics.set(document.uri, diagnostics);
	}

	dispose() {
		dispose(this.disposables);
	}
}

export class GitCommitInputBoxCodeActionsProvider implements CodeActionProvider {

	private readonly disposables: Disposable[] = [];

	constructor(private readonly diagnosticsManager: GitCommitInputBoxDiagnosticsManager) {
		this.disposables.push(languages.registerCodeActionsProvider({ scheme: 'vscode-scm' }, this));
	}

	provideCodeActions(document: TextDocument, range: Range | Selection): CodeAction[] {
		const codeActions: CodeAction[] = [];
		const diagnostics = this.diagnosticsManager.getDiagnostics(document.uri);
		const wrapAllLinesCodeAction = this.getWrapAllLinesCodeAction(document, diagnostics);

		for (const diagnostic of diagnostics) {
			if (!diagnostic.range.contains(range)) {
				continue;
			}

			switch (diagnostic.code) {
				case DiagnosticCodes.empty_message: {
					const workspaceEdit = new WorkspaceEdit();
					workspaceEdit.delete(document.uri, diagnostic.range);

					const codeAction = new CodeAction(l10n.t('Clear whitespace characters'), CodeActionKind.QuickFix);
					codeAction.diagnostics = [diagnostic];
					codeAction.edit = workspaceEdit;
					codeActions.push(codeAction);

					break;
				}
				case DiagnosticCodes.line_length: {
					const workspaceEdit = this.getWrapLineWorkspaceEdit(document, diagnostic.range);

					const codeAction = new CodeAction(l10n.t('Hard wrap line'), CodeActionKind.QuickFix);
					codeAction.diagnostics = [diagnostic];
					codeAction.edit = workspaceEdit;
					codeActions.push(codeAction);

					if (wrapAllLinesCodeAction) {
						wrapAllLinesCodeAction.diagnostics = [diagnostic];
						codeActions.push(wrapAllLinesCodeAction);
					}

					break;
				}
			}
		}

		return codeActions;
	}

	private getWrapLineWorkspaceEdit(document: TextDocument, range: Range): WorkspaceEdit {
		const lineSegments = this.wrapTextDocumentLine(document, range.start.line);

		const workspaceEdit = new WorkspaceEdit();
		workspaceEdit.replace(document.uri, range, lineSegments.join('\n'));

		return workspaceEdit;
	}

	private getWrapAllLinesCodeAction(document: TextDocument, diagnostics: readonly Diagnostic[]): CodeAction | undefined {
		const lineLengthDiagnostics = diagnostics.filter(d => d.code === DiagnosticCodes.line_length);
		if (lineLengthDiagnostics.length < 2) {
			return undefined;
		}

		const wrapAllLinesCodeAction = new CodeAction(l10n.t('Hard wrap all lines'), CodeActionKind.QuickFix);
		wrapAllLinesCodeAction.edit = this.getWrapAllLinesWorkspaceEdit(document, lineLengthDiagnostics);

		return wrapAllLinesCodeAction;
	}

	private getWrapAllLinesWorkspaceEdit(document: TextDocument, diagnostics: Diagnostic[]): WorkspaceEdit {
		const workspaceEdit = new WorkspaceEdit();

		for (const diagnostic of diagnostics) {
			const lineSegments = this.wrapTextDocumentLine(document, diagnostic.range.start.line);
			workspaceEdit.replace(document.uri, diagnostic.range, lineSegments.join('\n'));
		}

		return workspaceEdit;
	}

	private wrapTextDocumentLine(document: TextDocument, line: number): string[] {
		const config = workspace.getConfiguration('git');
		const inputValidationLength = config.get<number>('inputValidationLength', 50);
		const inputValidationSubjectLength = config.get<number | undefined>('inputValidationSubjectLength', undefined);
		const lineLengthThreshold = line === 0 ? inputValidationSubjectLength ?? inputValidationLength : inputValidationLength;

		const lineSegments: string[] = [];
		const lineText = document.lineAt(line).text.trim();

		let position = 0;
		while (lineText.length - position > lineLengthThreshold) {
			const lastSpaceBeforeThreshold = lineText.lastIndexOf(' ', position + lineLengthThreshold);

			if (lastSpaceBeforeThreshold !== -1 && lastSpaceBeforeThreshold > position) {
				lineSegments.push(lineText.substring(position, lastSpaceBeforeThreshold));
				position = lastSpaceBeforeThreshold + 1;
			} else {
				// Find first space after threshold
				const firstSpaceAfterThreshold = lineText.indexOf(' ', position + lineLengthThreshold);
				if (firstSpaceAfterThreshold !== -1) {
					lineSegments.push(lineText.substring(position, firstSpaceAfterThreshold));
					position = firstSpaceAfterThreshold + 1;
				} else {
					lineSegments.push(lineText.substring(position));
					position = lineText.length;
				}
			}
		}
		if (position < lineText.length) {
			lineSegments.push(lineText.substring(position));
		}

		return lineSegments;
	}

	dispose() {
		dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/editSessionIdentityProvider.ts]---
Location: vscode-main/extensions/git/src/editSessionIdentityProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path';
import * as vscode from 'vscode';
import { RefType } from './api/git';
import { Model } from './model';

export class GitEditSessionIdentityProvider implements vscode.EditSessionIdentityProvider, vscode.Disposable {

	private providerRegistration: vscode.Disposable;

	constructor(private model: Model) {
		this.providerRegistration = vscode.Disposable.from(
			vscode.workspace.registerEditSessionIdentityProvider('file', this),
			vscode.workspace.onWillCreateEditSessionIdentity((e) => {
				e.waitUntil(
					this._onWillCreateEditSessionIdentity(e.workspaceFolder).catch(err => {
						if (err instanceof vscode.CancellationError) {
							throw err;
						}
					})
				);
			})
		);
	}

	dispose() {
		this.providerRegistration.dispose();
	}

	async provideEditSessionIdentity(workspaceFolder: vscode.WorkspaceFolder, token: vscode.CancellationToken): Promise<string | undefined> {
		await this.model.openRepository(path.dirname(workspaceFolder.uri.fsPath));

		const repository = this.model.getRepository(workspaceFolder.uri);
		await repository?.status();

		if (!repository || !repository?.HEAD?.upstream) {
			return undefined;
		}

		const remoteUrl = repository.remotes.find((remote) => remote.name === repository.HEAD?.upstream?.remote)?.pushUrl?.replace(/^(git@[^\/:]+)(:)/i, 'ssh://$1/');
		const remote = remoteUrl ? await vscode.workspace.getCanonicalUri(vscode.Uri.parse(remoteUrl), { targetScheme: 'https' }, token) : null;

		return JSON.stringify({
			remote: remote?.toString() ?? remoteUrl,
			ref: repository.HEAD?.upstream?.name ?? null,
			sha: repository.HEAD?.commit ?? null,
		});
	}

	provideEditSessionIdentityMatch(identity1: string, identity2: string): vscode.EditSessionIdentityMatch {
		try {
			const normalizedIdentity1 = normalizeEditSessionIdentity(identity1);
			const normalizedIdentity2 = normalizeEditSessionIdentity(identity2);

			if (normalizedIdentity1.remote === normalizedIdentity2.remote &&
				normalizedIdentity1.ref === normalizedIdentity2.ref &&
				normalizedIdentity1.sha === normalizedIdentity2.sha) {
				// This is a perfect match
				return vscode.EditSessionIdentityMatch.Complete;
			} else if (normalizedIdentity1.remote === normalizedIdentity2.remote &&
				normalizedIdentity1.ref === normalizedIdentity2.ref &&
				normalizedIdentity1.sha !== normalizedIdentity2.sha) {
				// Same branch and remote but different SHA
				return vscode.EditSessionIdentityMatch.Partial;
			} else {
				return vscode.EditSessionIdentityMatch.None;
			}
		} catch (ex) {
			return vscode.EditSessionIdentityMatch.Partial;
		}
	}

	private async _onWillCreateEditSessionIdentity(workspaceFolder: vscode.WorkspaceFolder): Promise<void> {
		await this._doPublish(workspaceFolder);
	}

	private async _doPublish(workspaceFolder: vscode.WorkspaceFolder) {
		await this.model.openRepository(path.dirname(workspaceFolder.uri.fsPath));

		const repository = this.model.getRepository(workspaceFolder.uri);
		if (!repository) {
			return;
		}

		await repository.status();

		if (!repository.HEAD?.commit) {
			// Handle publishing empty repository with no commits

			const yes = vscode.l10n.t('Yes');
			const selection = await vscode.window.showInformationMessage(
				vscode.l10n.t('Would you like to publish this repository to continue working on it elsewhere?'),
				{ modal: true },
				yes
			);
			if (selection !== yes) {
				throw new vscode.CancellationError();
			}
			await repository.commit('Initial commit', { all: true });
			await vscode.commands.executeCommand('git.publish');
		} else if (!repository.HEAD?.upstream && repository.HEAD?.type === RefType.Head) {
			// If this branch hasn't been published to the remote yet,
			// ensure that it is published before Continue On is invoked

			const publishBranch = vscode.l10n.t('Publish Branch');
			const selection = await vscode.window.showInformationMessage(
				vscode.l10n.t('The current branch is not published to the remote. Would you like to publish it to access your changes elsewhere?'),
				{ modal: true },
				publishBranch
			);
			if (selection !== publishBranch) {
				throw new vscode.CancellationError();
			}

			await vscode.commands.executeCommand('git.publish');
		}
	}
}

function normalizeEditSessionIdentity(identity: string) {
	let { remote, ref, sha } = JSON.parse(identity);

	if (typeof remote === 'string' && remote.endsWith('.git')) {
		remote = remote.slice(0, remote.length - 4);
	}

	return {
		remote,
		ref,
		sha
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/emoji.ts]---
Location: vscode-main/extensions/git/src/emoji.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import { workspace, Uri } from 'vscode';
import { getExtensionContext } from './main';
import { TextDecoder } from 'util';

const emojiRegex = /:([-+_a-z0-9]+):/g;

let emojiMap: Record<string, string> | undefined;
let emojiMapPromise: Promise<void> | undefined;

export async function ensureEmojis() {
	if (emojiMap === undefined) {
		if (emojiMapPromise === undefined) {
			emojiMapPromise = loadEmojiMap();
		}
		await emojiMapPromise;
	}
}

async function loadEmojiMap() {
	const context = getExtensionContext();
	const uri = Uri.joinPath(context.extensionUri, 'resources', 'emojis.json');
	emojiMap = JSON.parse(new TextDecoder('utf8').decode(await workspace.fs.readFile(uri)));
}

export function emojify(message: string) {
	if (emojiMap === undefined) {
		return message;
	}

	return message.replace(emojiRegex, (s, code) => {
		return emojiMap?.[code] || s;
	});
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/fileSystemProvider.ts]---
Location: vscode-main/extensions/git/src/fileSystemProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace, Uri, Disposable, Event, EventEmitter, window, FileSystemProvider, FileChangeEvent, FileStat, FileType, FileChangeType, FileSystemError, LogOutputChannel } from 'vscode';
import { debounce, throttle } from './decorators';
import { fromGitUri, toGitUri } from './uri';
import { Model, ModelChangeEvent, OriginalResourceChangeEvent } from './model';
import { filterEvent, eventToPromise, isDescendant, pathEquals, EmptyDisposable } from './util';
import { Repository } from './repository';

interface CacheRow {
	uri: Uri;
	timestamp: number;
}

const THREE_MINUTES = 1000 * 60 * 3;
const FIVE_MINUTES = 1000 * 60 * 5;

function sanitizeRef(ref: string, path: string, submoduleOf: string | undefined, repository: Repository): string {
	if (ref === '~') {
		const fileUri = Uri.file(path);
		const uriString = fileUri.toString();
		const [indexStatus] = repository.indexGroup.resourceStates.filter(r => r.resourceUri.toString() === uriString);
		return indexStatus ? '' : 'HEAD';
	}

	if (/^~\d$/.test(ref)) {
		return `:${ref[1]}`;
	}

	// Submodule HEAD
	if (submoduleOf && (ref === 'index' || ref === 'wt')) {
		return 'HEAD';
	}

	return ref;
}

export class GitFileSystemProvider implements FileSystemProvider {

	private _onDidChangeFile = new EventEmitter<FileChangeEvent[]>();
	readonly onDidChangeFile: Event<FileChangeEvent[]> = this._onDidChangeFile.event;

	private changedRepositoryRoots = new Set<string>();
	private cache = new Map<string, CacheRow>();
	private mtime = new Date().getTime();
	private disposables: Disposable[] = [];

	constructor(private readonly model: Model, private readonly logger: LogOutputChannel) {
		this.disposables.push(
			model.onDidChangeRepository(this.onDidChangeRepository, this),
			model.onDidChangeOriginalResource(this.onDidChangeOriginalResource, this),
			workspace.registerFileSystemProvider('git', this, { isReadonly: true, isCaseSensitive: true }),
		);

		setInterval(() => this.cleanup(), FIVE_MINUTES);
	}

	private onDidChangeRepository({ repository }: ModelChangeEvent): void {
		this.changedRepositoryRoots.add(repository.root);
		this.eventuallyFireChangeEvents();
	}

	private onDidChangeOriginalResource({ uri }: OriginalResourceChangeEvent): void {
		if (uri.scheme !== 'file') {
			return;
		}

		const diffOriginalResourceUri = toGitUri(uri, '~',);
		const quickDiffOriginalResourceUri = toGitUri(uri, '', { replaceFileExtension: true });

		this.mtime = new Date().getTime();
		this._onDidChangeFile.fire([
			{ type: FileChangeType.Changed, uri: diffOriginalResourceUri },
			{ type: FileChangeType.Changed, uri: quickDiffOriginalResourceUri }
		]);
	}

	@debounce(1100)
	private eventuallyFireChangeEvents(): void {
		this.fireChangeEvents();
	}

	@throttle
	private async fireChangeEvents(): Promise<void> {
		if (!window.state.focused) {
			const onDidFocusWindow = filterEvent(window.onDidChangeWindowState, e => e.focused);
			await eventToPromise(onDidFocusWindow);
		}

		const events: FileChangeEvent[] = [];

		for (const { uri } of this.cache.values()) {
			const fsPath = uri.fsPath;

			for (const root of this.changedRepositoryRoots) {
				if (isDescendant(root, fsPath)) {
					events.push({ type: FileChangeType.Changed, uri });
					break;
				}
			}
		}

		if (events.length > 0) {
			this.mtime = new Date().getTime();
			this._onDidChangeFile.fire(events);
		}

		this.changedRepositoryRoots.clear();
	}

	private cleanup(): void {
		const now = new Date().getTime();
		const cache = new Map<string, CacheRow>();

		for (const row of this.cache.values()) {
			const { path } = fromGitUri(row.uri);
			const isOpen = workspace.textDocuments
				.filter(d => d.uri.scheme === 'file')
				.some(d => pathEquals(d.uri.fsPath, path));

			if (isOpen || now - row.timestamp < THREE_MINUTES) {
				cache.set(row.uri.toString(), row);
			} else {
				// TODO: should fire delete events?
			}
		}

		this.cache = cache;
	}

	watch(): Disposable {
		return EmptyDisposable;
	}

	async stat(uri: Uri): Promise<FileStat> {
		await this.model.isInitialized;

		const { submoduleOf, path, ref } = fromGitUri(uri);
		const repository = submoduleOf ? this.model.getRepository(submoduleOf) : this.model.getRepository(uri);
		if (!repository) {
			this.logger.warn(`[GitFileSystemProvider][stat] Repository not found - ${uri.toString()}`);
			throw FileSystemError.FileNotFound();
		}

		try {
			const details = await repository.getObjectDetails(sanitizeRef(ref, path, submoduleOf, repository), path);
			return { type: FileType.File, size: details.size, mtime: this.mtime, ctime: 0 };
		} catch {
			// Empty tree
			if (ref === await repository.getEmptyTree()) {
				this.logger.warn(`[GitFileSystemProvider][stat] Empty tree - ${uri.toString()}`);
				return { type: FileType.File, size: 0, mtime: this.mtime, ctime: 0 };
			}

			// File does not exist in git. This could be because the file is untracked or ignored
			this.logger.warn(`[GitFileSystemProvider][stat] File not found - ${uri.toString()}`);
			throw FileSystemError.FileNotFound();
		}
	}

	readDirectory(): Thenable<[string, FileType][]> {
		throw new Error('Method not implemented.');
	}

	createDirectory(): void {
		throw new Error('Method not implemented.');
	}

	async readFile(uri: Uri): Promise<Uint8Array> {
		await this.model.isInitialized;

		const { path, ref, submoduleOf } = fromGitUri(uri);

		if (submoduleOf) {
			const repository = this.model.getRepository(submoduleOf);

			if (!repository) {
				throw FileSystemError.FileNotFound();
			}

			const encoder = new TextEncoder();

			if (ref === 'index') {
				return encoder.encode(await repository.diffIndexWithHEAD(path));
			} else {
				return encoder.encode(await repository.diffWithHEAD(path));
			}
		}

		const repository = this.model.getRepository(uri);

		if (!repository) {
			this.logger.warn(`[GitFileSystemProvider][readFile] Repository not found - ${uri.toString()}`);
			throw FileSystemError.FileNotFound();
		}

		const timestamp = new Date().getTime();
		const cacheValue: CacheRow = { uri, timestamp };

		this.cache.set(uri.toString(), cacheValue);

		try {
			return await repository.buffer(sanitizeRef(ref, path, submoduleOf, repository), path);
		} catch {
			// Empty tree
			if (ref === await repository.getEmptyTree()) {
				this.logger.warn(`[GitFileSystemProvider][readFile] Empty tree - ${uri.toString()}`);
				return new Uint8Array(0);
			}

			// File does not exist in git. This could be because the file is untracked or ignored
			this.logger.warn(`[GitFileSystemProvider][readFile] File not found - ${uri.toString()}`);
			throw FileSystemError.FileNotFound();
		}
	}

	writeFile(): void {
		throw new Error('Method not implemented.');
	}

	delete(): void {
		throw new Error('Method not implemented.');
	}

	rename(): void {
		throw new Error('Method not implemented.');
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/git-base.ts]---
Location: vscode-main/extensions/git/src/git-base.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extensions } from 'vscode';
import { API as GitBaseAPI, GitBaseExtension } from './typings/git-base';

export class GitBaseApi {

	private static _gitBaseApi: GitBaseAPI | undefined;

	static getAPI(): GitBaseAPI {
		if (!this._gitBaseApi) {
			const gitBaseExtension = extensions.getExtension<GitBaseExtension>('vscode.git-base')!.exports;
			const onDidChangeGitBaseExtensionEnablement = (enabled: boolean) => {
				this._gitBaseApi = enabled ? gitBaseExtension.getAPI(1) : undefined;
			};

			gitBaseExtension.onDidChangeEnablement(onDidChangeGitBaseExtensionEnablement);
			onDidChangeGitBaseExtensionEnablement(gitBaseExtension.enabled);

			if (!this._gitBaseApi) {
				throw new Error('vscode.git-base extension is not enabled.');
			}
		}

		return this._gitBaseApi;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/git-editor-empty.sh]---
Location: vscode-main/extensions/git/src/git-editor-empty.sh

```bash
#!/bin/sh
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/git-editor-main.ts]---
Location: vscode-main/extensions/git/src/git-editor-main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IPCClient } from './ipc/ipcClient';

function fatal(err: unknown): void {
	console.error(err);
	process.exit(1);
}

function main(argv: string[]): void {
	const ipcClient = new IPCClient('git-editor');
	const commitMessagePath = argv[argv.length - 1];

	ipcClient.call({ commitMessagePath }).then(() => {
		setTimeout(() => process.exit(0), 0);
	}).catch(err => fatal(err));
}

main(process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/git-editor.sh]---
Location: vscode-main/extensions/git/src/git-editor.sh

```bash
#!/bin/sh

ELECTRON_RUN_AS_NODE="1" \
"$VSCODE_GIT_EDITOR_NODE" "$VSCODE_GIT_EDITOR_MAIN" $VSCODE_GIT_EDITOR_EXTRA_ARGS "$@"
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/git.ts]---
Location: vscode-main/extensions/git/src/git.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs, exists, realpath } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as cp from 'child_process';
import { fileURLToPath } from 'url';
import which from 'which';
import { EventEmitter } from 'events';
import * as filetype from 'file-type';
import { assign, groupBy, IDisposable, toDisposable, dispose, mkdirp, readBytes, detectUnicodeEncoding, Encoding, onceEvent, splitInChunks, Limiter, Versions, isWindows, pathEquals, isMacintosh, isDescendant, relativePathWithNoFallback, Mutable } from './util';
import { CancellationError, CancellationToken, ConfigurationChangeEvent, LogOutputChannel, Progress, Uri, workspace } from 'vscode';
import { Commit as ApiCommit, Ref, RefType, Branch, Remote, ForcePushMode, GitErrorCodes, LogOptions, Change, Status, CommitOptions, RefQuery as ApiRefQuery, InitOptions, Worktree } from './api/git';
import * as byline from 'byline';
import { StringDecoder } from 'string_decoder';

// https://github.com/microsoft/vscode/issues/65693
const MAX_CLI_LENGTH = 30000;

export interface IGit {
	path: string;
	version: string;
}

export interface IDotGit {
	readonly path: string;
	readonly commonPath?: string;
	readonly superProjectPath?: string;
}

export interface IFileStatus {
	x: string;
	y: string;
	path: string;
	rename?: string;
}

export interface Stash {
	readonly hash: string;
	readonly parents: string[];
	readonly index: number;
	readonly description: string;
	readonly branchName?: string;
	readonly authorDate?: Date;
	readonly commitDate?: Date;
}

interface MutableRemote extends Remote {
	fetchUrl?: string;
	pushUrl?: string;
	isReadOnly: boolean;
}

// TODO@eamodio: Move to git.d.ts once we are good with the api
/**
 * Log file options.
 */
export interface LogFileOptions {
	/** Optional. Continue listing the history of a file beyond renames */
	readonly follow?: boolean;
	/** Optional. The maximum number of log entries to retrieve. */
	readonly maxEntries?: number | string;
	/** Optional. The Git sha (hash) to start retrieving log entries from. */
	readonly hash?: string;
	/** Optional. Specifies whether to start retrieving log entries in reverse order. */
	readonly reverse?: boolean;
	readonly sortByAuthorDate?: boolean;
	readonly shortStats?: boolean;
}

function parseVersion(raw: string): string {
	return raw.replace(/^git version /, '');
}

function findSpecificGit(path: string, onValidate: (path: string) => boolean): Promise<IGit> {
	return new Promise<IGit>((c, e) => {
		if (!onValidate(path)) {
			return e(new Error(`Path "${path}" is invalid.`));
		}

		const buffers: Buffer[] = [];
		const child = cp.spawn(path, ['--version']);
		child.stdout.on('data', (b: Buffer) => buffers.push(b));
		child.on('error', cpErrorHandler(e));
		child.on('close', code => code ? e(new Error(`Not found. Code: ${code}`)) : c({ path, version: parseVersion(Buffer.concat(buffers).toString('utf8').trim()) }));
	});
}

function findGitDarwin(onValidate: (path: string) => boolean): Promise<IGit> {
	return new Promise<IGit>((c, e) => {
		cp.exec('which git', (err, gitPathBuffer) => {
			if (err) {
				return e(new Error(`Executing "which git" failed: ${err.message}`));
			}

			const path = gitPathBuffer.toString().trim();

			function getVersion(path: string) {
				if (!onValidate(path)) {
					return e(new Error(`Path "${path}" is invalid.`));
				}

				// make sure git executes
				cp.exec('git --version', (err, stdout) => {

					if (err) {
						return e(new Error(`Executing "git --version" failed: ${err.message}`));
					}

					return c({ path, version: parseVersion(stdout.trim()) });
				});
			}

			if (path !== '/usr/bin/git') {
				return getVersion(path);
			}

			// must check if XCode is installed
			cp.exec('xcode-select -p', (err) => {
				if (err && err.code === 2) {
					// git is not installed, and launching /usr/bin/git
					// will prompt the user to install it

					return e(new Error('Executing "xcode-select -p" failed with error code 2.'));
				}

				getVersion(path);
			});
		});
	});
}

function findSystemGitWin32(base: string, onValidate: (path: string) => boolean): Promise<IGit> {
	if (!base) {
		return Promise.reject<IGit>('Not found');
	}

	return findSpecificGit(path.join(base, 'Git', 'cmd', 'git.exe'), onValidate);
}

async function findGitWin32InPath(onValidate: (path: string) => boolean): Promise<IGit> {
	const path = await which('git.exe');
	return findSpecificGit(path, onValidate);
}

function findGitWin32(onValidate: (path: string) => boolean): Promise<IGit> {
	return findSystemGitWin32(process.env['ProgramW6432'] as string, onValidate)
		.then(undefined, () => findSystemGitWin32(process.env['ProgramFiles(x86)'] as string, onValidate))
		.then(undefined, () => findSystemGitWin32(process.env['ProgramFiles'] as string, onValidate))
		.then(undefined, () => findSystemGitWin32(path.join(process.env['LocalAppData'] as string, 'Programs'), onValidate))
		.then(undefined, () => findGitWin32InPath(onValidate));
}

export async function findGit(hints: string[], onValidate: (path: string) => boolean, logger: LogOutputChannel): Promise<IGit> {
	for (const hint of hints) {
		try {
			return await findSpecificGit(hint, onValidate);
		} catch (err) {
			// noop
			logger.info(`Unable to find git on the PATH: "${hint}". Error: ${err.message}`);
		}
	}

	try {
		switch (process.platform) {
			case 'darwin': return await findGitDarwin(onValidate);
			case 'win32': return await findGitWin32(onValidate);
			default: return await findSpecificGit('git', onValidate);
		}
	} catch (err) {
		// noop
		logger.warn(`Unable to find git. Error: ${err.message}`);
	}

	throw new Error('Git installation not found.');
}

export interface IExecutionResult<T extends string | Buffer> {
	exitCode: number;
	stdout: T;
	stderr: string;
}

function cpErrorHandler(cb: (reason?: any) => void): (reason?: any) => void {
	return err => {
		if (/ENOENT/.test(err.message)) {
			err = new GitError({
				error: err,
				message: 'Failed to execute git (ENOENT)',
				gitErrorCode: GitErrorCodes.NotAGitRepository
			});
		}

		cb(err);
	};
}

export interface SpawnOptions extends cp.SpawnOptions {
	input?: string;
	log?: boolean;
	cancellationToken?: CancellationToken;
	onSpawn?: (childProcess: cp.ChildProcess) => void;
}

async function exec(child: cp.ChildProcess, cancellationToken?: CancellationToken): Promise<IExecutionResult<Buffer>> {
	if (!child.stdout || !child.stderr) {
		throw new GitError({ message: 'Failed to get stdout or stderr from git process.' });
	}

	if (cancellationToken && cancellationToken.isCancellationRequested) {
		throw new CancellationError();
	}

	const disposables: IDisposable[] = [];

	const once = (ee: NodeJS.EventEmitter, name: string, fn: (...args: any[]) => void) => {
		ee.once(name, fn);
		disposables.push(toDisposable(() => ee.removeListener(name, fn)));
	};

	const on = (ee: NodeJS.EventEmitter, name: string, fn: (...args: any[]) => void) => {
		ee.on(name, fn);
		disposables.push(toDisposable(() => ee.removeListener(name, fn)));
	};

	let result = Promise.all<any>([
		new Promise<number>((c, e) => {
			once(child, 'error', cpErrorHandler(e));
			once(child, 'exit', c);
		}),
		new Promise<Buffer>(c => {
			const buffers: Buffer[] = [];
			on(child.stdout!, 'data', (b: Buffer) => buffers.push(b));
			once(child.stdout!, 'close', () => c(Buffer.concat(buffers)));
		}),
		new Promise<string>(c => {
			const buffers: Buffer[] = [];
			on(child.stderr!, 'data', (b: Buffer) => buffers.push(b));
			once(child.stderr!, 'close', () => c(Buffer.concat(buffers).toString('utf8')));
		})
	]) as Promise<[number, Buffer, string]>;

	if (cancellationToken) {
		const cancellationPromise = new Promise<[number, Buffer, string]>((_, e) => {
			onceEvent(cancellationToken.onCancellationRequested)(() => {
				try {
					child.kill();
				} catch (err) {
					// noop
				}

				e(new CancellationError());
			});
		});

		result = Promise.race([result, cancellationPromise]);
	}

	try {
		const [exitCode, stdout, stderr] = await result;
		return { exitCode, stdout, stderr };
	} finally {
		dispose(disposables);
	}
}

export interface IGitErrorData {
	error?: Error;
	message?: string;
	stdout?: string;
	stderr?: string;
	exitCode?: number;
	gitErrorCode?: string;
	gitCommand?: string;
	gitArgs?: string[];
}

export class GitError extends Error {

	error?: Error;
	stdout?: string;
	stderr?: string;
	exitCode?: number;
	gitErrorCode?: string;
	gitCommand?: string;
	gitArgs?: string[];

	constructor(data: IGitErrorData) {
		super(data.error?.message || data.message || 'Git error');

		this.error = data.error;
		this.stdout = data.stdout;
		this.stderr = data.stderr;
		this.exitCode = data.exitCode;
		this.gitErrorCode = data.gitErrorCode;
		this.gitCommand = data.gitCommand;
		this.gitArgs = data.gitArgs;
	}

	override toString(): string {
		let result = this.message + ' ' + JSON.stringify({
			exitCode: this.exitCode,
			gitErrorCode: this.gitErrorCode,
			gitCommand: this.gitCommand,
			stdout: this.stdout,
			stderr: this.stderr
		}, null, 2);

		if (this.error?.stack) {
			result += this.error.stack;
		}

		return result;
	}
}

export interface IGitOptions {
	gitPath: string;
	userAgent: string;
	version: string;
	env?: { [key: string]: string };
}

function getGitErrorCode(stderr: string): string | undefined {
	if (/Another git process seems to be running in this repository|If no other git process is currently running/.test(stderr)) {
		return GitErrorCodes.RepositoryIsLocked;
	} else if (/Authentication failed/i.test(stderr)) {
		return GitErrorCodes.AuthenticationFailed;
	} else if (/Not a git repository/i.test(stderr)) {
		return GitErrorCodes.NotAGitRepository;
	} else if (/bad config file/.test(stderr)) {
		return GitErrorCodes.BadConfigFile;
	} else if (/cannot make pipe for command substitution|cannot create standard input pipe/.test(stderr)) {
		return GitErrorCodes.CantCreatePipe;
	} else if (/Repository not found/.test(stderr)) {
		return GitErrorCodes.RepositoryNotFound;
	} else if (/unable to access/.test(stderr)) {
		return GitErrorCodes.CantAccessRemote;
	} else if (/branch '.+' is not fully merged/.test(stderr)) {
		return GitErrorCodes.BranchNotFullyMerged;
	} else if (/Couldn\'t find remote ref/.test(stderr)) {
		return GitErrorCodes.NoRemoteReference;
	} else if (/A branch named '.+' already exists/.test(stderr)) {
		return GitErrorCodes.BranchAlreadyExists;
	} else if (/'.+' is not a valid branch name/.test(stderr)) {
		return GitErrorCodes.InvalidBranchName;
	} else if (/Please,? commit your changes or stash them/.test(stderr)) {
		return GitErrorCodes.DirtyWorkTree;
	} else if (/detected dubious ownership in repository at/.test(stderr)) {
		return GitErrorCodes.NotASafeGitRepository;
	} else if (/contains modified or untracked files|use --force to delete it/.test(stderr)) {
		return GitErrorCodes.WorktreeContainsChanges;
	} else if (/fatal: '[^']+' already exists/.test(stderr)) {
		return GitErrorCodes.WorktreeAlreadyExists;
	} else if (/is already used by worktree at/.test(stderr)) {
		return GitErrorCodes.WorktreeBranchAlreadyUsed;
	}
	return undefined;
}

// https://github.com/microsoft/vscode/issues/89373
// https://github.com/git-for-windows/git/issues/2478
function sanitizePath(path: string): string {
	return path.replace(/^([a-z]):\\/i, (_, letter) => `${letter.toUpperCase()}:\\`);
}

function sanitizeRelativePath(path: string): string {
	return path.replace(/\\/g, '/');
}

const COMMIT_FORMAT = '%H%n%aN%n%aE%n%at%n%ct%n%P%n%D%n%B';
const STASH_FORMAT = '%H%n%P%n%gd%n%gs%n%at%n%ct';

export interface ICloneOptions {
	readonly parentPath: string;
	readonly progress: Progress<{ increment: number }>;
	readonly recursive?: boolean;
	readonly ref?: string;
}

export class Git {

	readonly path: string;
	readonly userAgent: string;
	readonly version: string;
	readonly env: { [key: string]: string };

	private commandsToLog: string[] = [];

	private _onOutput = new EventEmitter();
	get onOutput(): EventEmitter { return this._onOutput; }

	constructor(options: IGitOptions) {
		this.path = options.gitPath;
		this.version = options.version;
		this.userAgent = options.userAgent;
		this.env = options.env || {};

		const onConfigurationChanged = (e?: ConfigurationChangeEvent) => {
			if (e !== undefined && !e.affectsConfiguration('git.commandsToLog')) {
				return;
			}

			const config = workspace.getConfiguration('git');
			this.commandsToLog = config.get<string[]>('commandsToLog', []);
		};

		workspace.onDidChangeConfiguration(onConfigurationChanged, this);
		onConfigurationChanged();
	}

	compareGitVersionTo(version: string): -1 | 0 | 1 {
		return Versions.compare(Versions.fromString(this.version), Versions.fromString(version));
	}

	open(repositoryRoot: string, repositoryRootRealPath: string | undefined, dotGit: IDotGit, logger: LogOutputChannel): Repository {
		return new Repository(this, repositoryRoot, repositoryRootRealPath, dotGit, logger);
	}

	async init(repository: string, options: InitOptions = {}): Promise<void> {
		const args = ['init'];

		if (options.defaultBranch && options.defaultBranch !== '' && this.compareGitVersionTo('2.28.0') !== -1) {
			args.push('-b', options.defaultBranch);
		}

		await this.exec(repository, args);
	}

	async clone(url: string, options: ICloneOptions, cancellationToken?: CancellationToken): Promise<string> {
		const baseFolderName = decodeURI(url).replace(/[\/]+$/, '').replace(/^.*[\/\\]/, '').replace(/\.git$/, '') || 'repository';
		let folderName = baseFolderName;
		let folderPath = path.join(options.parentPath, folderName);
		let count = 1;

		while (count < 20 && await new Promise(c => exists(folderPath, c))) {
			folderName = `${baseFolderName}-${count++}`;
			folderPath = path.join(options.parentPath, folderName);
		}

		await mkdirp(options.parentPath);

		const onSpawn = (child: cp.ChildProcess) => {
			const decoder = new StringDecoder('utf8');
			const lineStream = new byline.LineStream({ encoding: 'utf8' });
			child.stderr!.on('data', (buffer: Buffer) => lineStream.write(decoder.write(buffer)));

			let totalProgress = 0;
			let previousProgress = 0;

			lineStream.on('data', (line: string) => {
				let match: RegExpExecArray | null = null;

				if (match = /Counting objects:\s*(\d+)%/i.exec(line)) {
					totalProgress = Math.floor(parseInt(match[1]) * 0.1);
				} else if (match = /Compressing objects:\s*(\d+)%/i.exec(line)) {
					totalProgress = 10 + Math.floor(parseInt(match[1]) * 0.1);
				} else if (match = /Receiving objects:\s*(\d+)%/i.exec(line)) {
					totalProgress = 20 + Math.floor(parseInt(match[1]) * 0.4);
				} else if (match = /Resolving deltas:\s*(\d+)%/i.exec(line)) {
					totalProgress = 60 + Math.floor(parseInt(match[1]) * 0.4);
				}

				if (totalProgress !== previousProgress) {
					options.progress.report({ increment: totalProgress - previousProgress });
					previousProgress = totalProgress;
				}
			});
		};

		try {
			const command = ['clone', url.includes(' ') ? encodeURI(url) : url, folderPath, '--progress'];
			if (options.recursive) {
				command.push('--recursive');
			}
			if (options.ref) {
				command.push('--branch', options.ref);
			}
			await this.exec(options.parentPath, command, {
				cancellationToken,
				env: { 'GIT_HTTP_USER_AGENT': this.userAgent },
				onSpawn,
			});
		} catch (err) {
			if (err.stderr) {
				err.stderr = err.stderr.replace(/^Cloning.+$/m, '').trim();
				err.stderr = err.stderr.replace(/^ERROR:\s+/, '').trim();
			}

			throw err;
		}

		return folderPath;
	}

	async getRepositoryRoot(pathInsidePossibleRepository: string): Promise<string> {
		const result = await this.exec(pathInsidePossibleRepository, ['rev-parse', '--show-toplevel']);

		// Keep trailing spaces which are part of the directory name
		const repositoryRootPath = path.normalize(result.stdout.trimStart().replace(/[\r\n]+$/, ''));

		// Handle symbolic links and UNC paths
		// Git 2.31 added the `--path-format` flag to rev-parse which
		// allows us to get the relative path of the repository root
		if (!pathEquals(pathInsidePossibleRepository, repositoryRootPath) &&
			!isDescendant(repositoryRootPath, pathInsidePossibleRepository) &&
			!isDescendant(pathInsidePossibleRepository, repositoryRootPath) &&
			this.compareGitVersionTo('2.31.0') !== -1) {
			const relativePathResult = await this.exec(pathInsidePossibleRepository, ['rev-parse', '--path-format=relative', '--show-toplevel',]);
			return path.resolve(pathInsidePossibleRepository, relativePathResult.stdout.trimStart().replace(/[\r\n]+$/, ''));
		}

		if (isWindows) {
			// On Git 2.25+ if you call `rev-parse --show-toplevel` on a mapped drive, instead of getting the mapped
			// drive path back, you get the UNC path for the mapped drive. So we will try to normalize it back to the
			// mapped drive path, if possible
			const repoUri = Uri.file(repositoryRootPath);
			const pathUri = Uri.file(pathInsidePossibleRepository);
			if (repoUri.authority.length !== 0 && pathUri.authority.length === 0) {
				const match = /^[\/]?([a-zA-Z])[:\/]/.exec(pathUri.path);
				if (match !== null) {
					const [, letter] = match;

					try {
						const networkPath = await new Promise<string | undefined>(resolve =>
							realpath.native(`${letter}:\\`, { encoding: 'utf8' }, (err, resolvedPath) =>
								resolve(err !== null ? undefined : resolvedPath),
							),
						);
						if (networkPath !== undefined) {
							// If the repository is at the root of the mapped drive then we
							// have to append `\` (ex: D:\) otherwise the path is not valid.
							const isDriveRoot = pathEquals(repoUri.fsPath, networkPath);

							return path.normalize(
								repoUri.fsPath.replace(
									networkPath,
									`${letter.toLowerCase()}:${isDriveRoot || networkPath.endsWith('\\') ? '\\' : ''}`
								),
							);
						}
					} catch { }
				}

				return path.normalize(pathUri.fsPath);
			}
		}

		return repositoryRootPath;
	}

	async getRepositoryDotGit(repositoryPath: string): Promise<IDotGit> {
		let dotGitPath: string | undefined, commonDotGitPath: string | undefined, superProjectPath: string | undefined;

		const args = ['rev-parse', '--git-dir', '--git-common-dir'];
		if (this.compareGitVersionTo('2.13.0') >= 0) {
			args.push('--show-superproject-working-tree');
		}

		const result = await this.exec(repositoryPath, args);
		[dotGitPath, commonDotGitPath, superProjectPath] = result.stdout.split('\n').map(r => r.trim());

		if (!path.isAbsolute(dotGitPath)) {
			dotGitPath = path.join(repositoryPath, dotGitPath);
		}
		dotGitPath = path.normalize(dotGitPath);

		if (commonDotGitPath) {
			if (!path.isAbsolute(commonDotGitPath)) {
				commonDotGitPath = path.join(repositoryPath, commonDotGitPath);
			}
			commonDotGitPath = path.normalize(commonDotGitPath);
		}

		return {
			path: dotGitPath,
			commonPath: commonDotGitPath !== dotGitPath ? commonDotGitPath : undefined,
			superProjectPath: superProjectPath ? path.normalize(superProjectPath) : undefined
		};
	}

	async exec(cwd: string, args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
		options = assign({ cwd }, options || {});
		return await this._exec(args, options);
	}

	async exec2(args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
		return await this._exec(args, options);
	}

	stream(cwd: string, args: string[], options: SpawnOptions = {}): cp.ChildProcess {
		options = assign({ cwd }, options || {});
		const child = this.spawn(args, options);

		if (options.log !== false) {
			const startTime = Date.now();
			child.on('exit', (_) => {
				this.log(`> git ${args.join(' ')} [${Date.now() - startTime}ms]${child.killed ? ' (cancelled)' : ''}\n`);
			});
		}

		return child;
	}

	private async _exec(args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
		const child = this.spawn(args, options);

		options.onSpawn?.(child);

		if (options.input) {
			child.stdin!.end(options.input, 'utf8');
		}

		const startExec = Date.now();
		let bufferResult: IExecutionResult<Buffer>;

		try {
			bufferResult = await exec(child, options.cancellationToken);
		} catch (ex) {
			if (ex instanceof CancellationError) {
				this.log(`> git ${args.join(' ')} [${Date.now() - startExec}ms] (cancelled)\n`);
			}

			throw ex;
		}

		if (options.log !== false) {
			// command
			this.log(`> git ${args.join(' ')} [${Date.now() - startExec}ms]\n`);

			// stdout
			if (bufferResult.stdout.length > 0 && args.find(a => this.commandsToLog.includes(a))) {
				this.log(`${bufferResult.stdout}\n`);
			}

			// stderr
			if (bufferResult.stderr.length > 0) {
				this.log(`${bufferResult.stderr}\n`);
			}
		}

		const result: IExecutionResult<string> = {
			exitCode: bufferResult.exitCode,
			stdout: bufferResult.stdout.toString('utf8'),
			stderr: bufferResult.stderr
		};

		if (bufferResult.exitCode) {
			return Promise.reject<IExecutionResult<string>>(new GitError({
				message: 'Failed to execute git',
				stdout: result.stdout,
				stderr: result.stderr,
				exitCode: result.exitCode,
				gitErrorCode: getGitErrorCode(result.stderr),
				gitCommand: args[0],
				gitArgs: args
			}));
		}

		return result;
	}

	spawn(args: string[], options: SpawnOptions = {}): cp.ChildProcess {
		if (!this.path) {
			throw new Error('git could not be found in the system.');
		}

		if (!options) {
			options = {};
		}

		if (!options.stdio && !options.input) {
			options.stdio = ['ignore', null, null]; // Unless provided, ignore stdin and leave default streams for stdout and stderr
		}

		options.env = assign({}, process.env, this.env, options.env || {}, {
			VSCODE_GIT_COMMAND: args[0],
			LC_ALL: 'en_US.UTF-8',
			LANG: 'en_US.UTF-8',
			GIT_PAGER: 'cat'
		});

		const cwd = this.getCwd(options);
		if (cwd) {
			options.cwd = sanitizePath(cwd);
		}

		return cp.spawn(this.path, args, options);
	}

	private getCwd(options: SpawnOptions): string | undefined {
		const cwd = options.cwd;
		if (typeof cwd === 'undefined' || typeof cwd === 'string') {
			return cwd;
		}

		if (cwd.protocol === 'file:') {
			return fileURLToPath(cwd);
		}

		return undefined;
	}

	private log(output: string): void {
		this._onOutput.emit('log', output);
	}

	async mergeFile(options: { input1Path: string; input2Path: string; basePath: string; diff3?: boolean }): Promise<string> {
		const args = ['merge-file', '-p', options.input1Path, options.basePath, options.input2Path];
		if (options.diff3) {
			args.push('--diff3');
		} else {
			args.push('--no-diff3');
		}

		try {
			const result = await this.exec(os.homedir(), args);
			return result.stdout;
		} catch (err) {
			if (typeof err.stdout === 'string') {
				// The merge had conflicts, stdout still contains the merged result (with conflict markers)
				return err.stdout;
			} else {
				throw err;
			}
		}
	}

	async addSafeDirectory(repositoryPath: string): Promise<void> {
		await this.exec(os.homedir(), ['config', '--global', '--add', 'safe.directory', repositoryPath]);
		return;
	}
}

export interface CommitShortStat {
	readonly files: number;
	readonly insertions: number;
	readonly deletions: number;
}

export interface Commit {
	hash: string;
	message: string;
	parents: string[];
	authorDate?: Date;
	authorName?: string;
	authorEmail?: string;
	commitDate?: Date;
	refNames: string[];
	shortStat?: CommitShortStat;
}

export interface RefQuery extends ApiRefQuery {
	readonly includeCommitDetails?: boolean;
}

interface GitConfigSection {
	name: string;
	subSectionName?: string;
	properties: { [key: string]: string };
}

class GitConfigParser {
	private static readonly _lineSeparator = /\r?\n/;

	private static readonly _propertyRegex = /^\s*(\w+)\s*=\s*"?([^"]+)"?$/;
	private static readonly _sectionRegex = /^\s*\[\s*([^\]]+?)\s*(\"[^"]+\")*\]\s*$/;

	static parse(raw: string): GitConfigSection[] {
		const config: { sections: GitConfigSection[] } = { sections: [] };
		let section: GitConfigSection = { name: 'DEFAULT', properties: {} };

		const addSection = (section?: GitConfigSection) => {
			if (!section) { return; }
			config.sections.push(section);
		};

		for (const line of raw.split(GitConfigParser._lineSeparator)) {
			// Section
			const sectionMatch = line.match(GitConfigParser._sectionRegex);
			if (sectionMatch?.length === 3) {
				addSection(section);
				section = { name: sectionMatch[1], subSectionName: sectionMatch[2]?.replaceAll('"', ''), properties: {} };

				continue;
			}

			// Property
			const propertyMatch = line.match(GitConfigParser._propertyRegex);
			if (propertyMatch?.length === 3 && !Object.keys(section.properties).includes(propertyMatch[1])) {
				section.properties[propertyMatch[1]] = propertyMatch[2];
			}
		}

		addSection(section);

		return config.sections;
	}
}

export class GitStatusParser {

	private lastRaw = '';
	private result: IFileStatus[] = [];

	get status(): IFileStatus[] {
		return this.result;
	}

	update(raw: string): void {
		let i = 0;
		let nextI: number | undefined;

		raw = this.lastRaw + raw;

		while ((nextI = this.parseEntry(raw, i)) !== undefined) {
			i = nextI;
		}

		this.lastRaw = raw.substr(i);
	}

	private parseEntry(raw: string, i: number): number | undefined {
		if (i + 4 >= raw.length) {
			return;
		}

		let lastIndex: number;
		const entry: IFileStatus = {
			x: raw.charAt(i++),
			y: raw.charAt(i++),
			rename: undefined,
			path: ''
		};

		// space
		i++;

		if (entry.x === 'R' || entry.y === 'R' || entry.x === 'C') {
			lastIndex = raw.indexOf('\0', i);

			if (lastIndex === -1) {
				return;
			}

			entry.rename = raw.substring(i, lastIndex);
			i = lastIndex + 1;
		}

		lastIndex = raw.indexOf('\0', i);

		if (lastIndex === -1) {
			return;
		}

		entry.path = raw.substring(i, lastIndex);

		// If path ends with slash, it must be a nested git repo
		if (entry.path[entry.path.length - 1] !== '/') {
			this.result.push(entry);
		}

		return lastIndex + 1;
	}
}

export interface Submodule {
	name: string;
	path: string;
	url: string;
}

export function parseGitmodules(raw: string): Submodule[] {
	const result: Submodule[] = [];

	for (const submoduleSection of GitConfigParser.parse(raw).filter(s => s.name === 'submodule')) {
		if (submoduleSection.subSectionName && submoduleSection.properties['path'] && submoduleSection.properties['url']) {
			result.push({
				name: submoduleSection.subSectionName,
				path: submoduleSection.properties['path'],
				url: submoduleSection.properties['url']
			});
		}
	}

	return result;
}

export function parseGitRemotes(raw: string): MutableRemote[] {
	const remotes: MutableRemote[] = [];

	for (const remoteSection of GitConfigParser.parse(raw).filter(s => s.name === 'remote')) {
		if (remoteSection.subSectionName) {
			remotes.push({
				name: remoteSection.subSectionName,
				fetchUrl: remoteSection.properties['url'],
				pushUrl: remoteSection.properties['pushurl'] ?? remoteSection.properties['url'],
				isReadOnly: false
			});
		}
	}

	return remotes;
}

const commitRegex = /([0-9a-f]{40})\n(.*)\n(.*)\n(.*)\n(.*)\n(.*)\n(.*)(?:\n([^]*?))?(?:\x00)(?:\n((?:.*)files? changed(?:.*))$)?/gm;

export function parseGitCommits(data: string): Commit[] {
	const commits: Commit[] = [];

	let ref;
	let authorName;
	let authorEmail;
	let authorDate;
	let commitDate;
	let parents;
	let refNames;
	let message;
	let shortStat;
	let match;

	do {
		match = commitRegex.exec(data);
		if (match === null) {
			break;
		}

		[, ref, authorName, authorEmail, authorDate, commitDate, parents, refNames, message, shortStat] = match;

		if (message[message.length - 1] === '\n') {
			message = message.substr(0, message.length - 1);
		}

		// Stop excessive memory usage by using substr -- https://bugs.chromium.org/p/v8/issues/detail?id=2869
		commits.push({
			hash: ` ${ref}`.substr(1),
			message: ` ${message}`.substr(1),
			parents: parents ? parents.split(' ') : [],
			authorDate: new Date(Number(authorDate) * 1000),
			authorName: ` ${authorName}`.substr(1),
			authorEmail: ` ${authorEmail}`.substr(1),
			commitDate: new Date(Number(commitDate) * 1000),
			refNames: refNames.split(',').map(s => s.trim()),
			shortStat: shortStat ? parseGitDiffShortStat(shortStat) : undefined
		});
	} while (true);

	return commits;
}

const diffShortStatRegex = /(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/;

function parseGitDiffShortStat(data: string): CommitShortStat {
	const matches = data.trim().match(diffShortStatRegex);

	if (!matches) {
		return { files: 0, insertions: 0, deletions: 0 };
	}

	const [, files, insertions = undefined, deletions = undefined] = matches;
	return { files: parseInt(files), insertions: parseInt(insertions ?? '0'), deletions: parseInt(deletions ?? '0') };
}

export interface LsTreeElement {
	mode: string;
	type: string;
	object: string;
	size: string;
	file: string;
}

export function parseLsTree(raw: string): LsTreeElement[] {
	return raw.split('\n')
		.filter(l => !!l)
		.map(line => /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(line)!)
		.filter(m => !!m)
		.map(([, mode, type, object, size, file]) => ({ mode, type, object, size, file }));
}

interface LsFilesElement {
	mode: string;
	object: string;
	stage: string;
	file: string;
}

export function parseLsFiles(raw: string): LsFilesElement[] {
	return raw.split('\n')
		.filter(l => !!l)
		.map(line => /^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(line)!)
		.filter(m => !!m)
		.map(([, mode, object, stage, file]) => ({ mode, object, stage, file }));
}

const stashRegex = /([0-9a-f]{40})\n(.*)\nstash@{(\d+)}\n(WIP\s)?on\s([^:]+):\s(.*)\n(\d+)\n(\d+)(?:\x00)/gmi;

function parseGitStashes(raw: string): Stash[] {
	const result: Stash[] = [];

	let match, hash, parents, index, wip, branchName, description, authorDate, commitDate;

	do {
		match = stashRegex.exec(raw);
		if (match === null) {
			break;
		}

		[, hash, parents, index, wip, branchName, description, authorDate, commitDate] = match;
		result.push({
			hash,
			parents: parents.split(' '),
			index: parseInt(index),
			branchName: branchName.trim(),
			description: wip ? `WIP (${description.trim()})` : description.trim(),
			authorDate: authorDate ? new Date(Number(authorDate) * 1000) : undefined,
			commitDate: commitDate ? new Date(Number(commitDate) * 1000) : undefined,
		});
	} while (true);

	return result;
}

function parseGitChanges(repositoryRoot: string, raw: string): Change[] {
	let index = 0;
	const result: Change[] = [];
	const segments = raw.trim().split('\x00').filter(s => s);

	segmentsLoop:
	while (index < segments.length - 1) {
		const change = segments[index++];
		const resourcePath = segments[index++];

		if (!change || !resourcePath) {
			break;
		}

		const originalUri = Uri.file(path.isAbsolute(resourcePath) ? resourcePath : path.join(repositoryRoot, resourcePath));

		let uri = originalUri;
		let renameUri = originalUri;
		let status = Status.UNTRACKED;

		// Copy or Rename status comes with a number (ex: 'R100').
		// We don't need the number, we use only first character of the status.
		switch (change[0]) {
			case 'A':
				status = Status.INDEX_ADDED;
				break;

			case 'M':
				status = Status.MODIFIED;
				break;

			case 'D':
				status = Status.DELETED;
				break;

			// Rename contains two paths, the second one is what the file is renamed/copied to.
			case 'R': {
				if (index >= segments.length) {
					break;
				}

				const newPath = segments[index++];
				if (!newPath) {
					break;
				}

				status = Status.INDEX_RENAMED;
				uri = renameUri = Uri.file(path.isAbsolute(newPath) ? newPath : path.join(repositoryRoot, newPath));
				break;
			}
			default:
				// Unknown status
				break segmentsLoop;
		}

		result.push({ status, uri, originalUri, renameUri });
	}

	return result;
}

export interface BlameInformation {
	readonly hash: string;
	readonly subject?: string;
	readonly authorName?: string;
	readonly authorEmail?: string;
	readonly authorDate?: number;
	readonly ranges: {
		readonly startLineNumber: number;
		readonly endLineNumber: number;
	}[];
}

function parseGitBlame(data: string): BlameInformation[] {
	const lineSeparator = /\r?\n/;
	const commitRegex = /^([0-9a-f]{40})/gm;

	const blameInformation = new Map<string, BlameInformation>();

	let commitHash: string | undefined = undefined;
	let authorName: string | undefined = undefined;
	let authorEmail: string | undefined = undefined;
	let authorTime: number | undefined = undefined;
	let message: string | undefined = undefined;
	let startLineNumber: number | undefined = undefined;
	let endLineNumber: number | undefined = undefined;

	for (const line of data.split(lineSeparator)) {
		// Commit
		const commitMatch = line.match(commitRegex);
		if (!commitHash && commitMatch) {
			const segments = line.split(' ');

			commitHash = commitMatch[0];
			startLineNumber = Number(segments[2]);
			endLineNumber = Number(segments[2]) + Number(segments[3]) - 1;
		}

		// Commit properties
		if (commitHash && line.startsWith('author ')) {
			authorName = line.substring('author '.length);
		}
		if (commitHash && line.startsWith('author-mail ')) {
			authorEmail = line.substring('author-mail <'.length, line.length - 1);
		}
		if (commitHash && line.startsWith('author-time ')) {
			authorTime = Number(line.substring('author-time '.length)) * 1000;
		}
		if (commitHash && line.startsWith('summary ')) {
			message = line.substring('summary '.length);
		}

		// Commit end
		if (commitHash && startLineNumber && endLineNumber && line.startsWith('filename ')) {
			const existingCommit = blameInformation.get(commitHash);
			if (existingCommit) {
				existingCommit.ranges.push({ startLineNumber, endLineNumber });
				blameInformation.set(commitHash, existingCommit);
			} else {
				blameInformation.set(commitHash, {
					hash: commitHash, authorName, authorEmail, authorDate: authorTime, subject: message, ranges: [{ startLineNumber, endLineNumber }]
				});
			}

			commitHash = authorName = authorEmail = authorTime = message = startLineNumber = endLineNumber = undefined;
		}
	}

	return Array.from(blameInformation.values());
}

const REFS_FORMAT = '%(refname)%00%(objectname)%00%(*objectname)';
const REFS_WITH_DETAILS_FORMAT = `${REFS_FORMAT}%00%(parent)%00%(*parent)%00%(authorname)%00%(*authorname)%00%(committerdate:unix)%00%(*committerdate:unix)%00%(subject)%00%(*subject)`;

function parseRefs(data: string): (Ref | Branch)[] {
	const refRegex = /^(refs\/[^\0]+)\0([0-9a-f]{40})\0([0-9a-f]{40})?(?:\0(.*))?$/gm;

	const headRegex = /^refs\/heads\/([^ ]+)$/;
	const remoteHeadRegex = /^refs\/remotes\/([^/]+)\/([^ ]+)$/;
	const tagRegex = /^refs\/tags\/([^ ]+)$/;
	const statusRegex = /\[(?:ahead ([0-9]+))?[,\s]*(?:behind ([0-9]+))?]|\[gone]/;

	let ref: string | undefined;
	let commitHash: string | undefined;
	let tagCommitHash: string | undefined;
	let details: string | undefined;
	let commitParents: string | undefined;
	let tagCommitParents: string | undefined;
	let commitSubject: string | undefined;
	let tagCommitSubject: string | undefined;
	let authorName: string | undefined;
	let tagAuthorName: string | undefined;
	let committerDate: string | undefined;
	let tagCommitterDate: string | undefined;
	let status: string | undefined;

	const refs: (Ref | Branch)[] = [];

	let match: RegExpExecArray | null;
	let refMatch: RegExpExecArray | null;

	do {
		match = refRegex.exec(data);
		if (match === null) {
			break;
		}

		[, ref, commitHash, tagCommitHash, details] = match;
		[commitParents, tagCommitParents, authorName, tagAuthorName, committerDate, tagCommitterDate, commitSubject, tagCommitSubject, status] = details?.split('\0') ?? [];

		const parents = tagCommitParents || commitParents;
		const subject = tagCommitSubject || commitSubject;
		const author = tagAuthorName || authorName;
		const date = tagCommitterDate || committerDate;

		const commitDetails = parents && subject && author && date
			? {
				hash: commitHash,
				message: subject,
				parents: parents.split(' '),
				authorName: author,
				commitDate: date ? new Date(Number(date) * 1000) : undefined,
			} satisfies ApiCommit : undefined;

		if (refMatch = headRegex.exec(ref)) {
			const [, aheadCount, behindCount] = statusRegex.exec(status) ?? [];
			const ahead = status ? aheadCount ? Number(aheadCount) : 0 : undefined;
			const behind = status ? behindCount ? Number(behindCount) : 0 : undefined;
			refs.push({ name: refMatch[1], commit: commitHash, commitDetails, ahead, behind, type: RefType.Head });
		} else if (refMatch = remoteHeadRegex.exec(ref)) {
			const name = `${refMatch[1]}/${refMatch[2]}`;
			refs.push({ name, remote: refMatch[1], commit: commitHash, commitDetails, type: RefType.RemoteHead });
		} else if (refMatch = tagRegex.exec(ref)) {
			refs.push({ name: refMatch[1], commit: tagCommitHash ?? commitHash, commitDetails, type: RefType.Tag });
		}
	} while (true);

	return refs;
}

export interface PullOptions {
	readonly unshallow?: boolean;
	readonly tags?: boolean;
	readonly autoStash?: boolean;
	readonly cancellationToken?: CancellationToken;
}

export class Repository {
	private _isUsingRefTable = false;

	constructor(
		private _git: Git,
		private repositoryRoot: string,
		private repositoryRootRealPath: string | undefined,
		readonly dotGit: IDotGit,
		private logger: LogOutputChannel
	) {
		this._kind = this.dotGit.commonPath
			? 'worktree'
			: this.dotGit.superProjectPath
				? 'submodule'
				: 'repository';
	}

	private readonly _kind: 'repository' | 'submodule' | 'worktree';
	get kind(): 'repository' | 'submodule' | 'worktree' {
		return this._kind;
	}

	get git(): Git {
		return this._git;
	}

	get root(): string {
		return this.repositoryRoot;
	}

	get rootRealPath(): string | undefined {
		return this.repositoryRootRealPath;
	}

	async exec(args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
		return await this.git.exec(this.repositoryRoot, args, options);
	}

	stream(args: string[], options: SpawnOptions = {}): cp.ChildProcess {
		return this.git.stream(this.repositoryRoot, args, options);
	}

	spawn(args: string[], options: SpawnOptions = {}): cp.ChildProcess {
		return this.git.spawn(args, options);
	}

	async config(command: string, scope: string, key: string, value: any = null, options: SpawnOptions = {}): Promise<string> {
		const args = ['config', `--${command}`];

		if (scope) {
			args.push(`--${scope}`);
		}

		args.push(key);

		if (value) {
			args.push(value);
		}

		try {
			const result = await this.exec(args, options);
			return result.stdout.trim();
		}
		catch (err) {
			this.logger.warn(`[Git][config] git config failed: ${err.message}`);
			return '';
		}
	}

	async getConfigs(scope: string): Promise<{ key: string; value: string }[]> {
		const args = ['config'];

		if (scope) {
			args.push('--' + scope);
		}

		args.push('-l');

		const result = await this.exec(args);
		const lines = result.stdout.trim().split(/\r|\r\n|\n/);

		return lines.map(entry => {
			const equalsIndex = entry.indexOf('=');
			return { key: entry.substr(0, equalsIndex), value: entry.substr(equalsIndex + 1) };
		});
	}

	async log(options?: LogOptions, cancellationToken?: CancellationToken): Promise<Commit[]> {
		const spawnOptions: SpawnOptions = { cancellationToken };
		const args = ['log', `--format=${COMMIT_FORMAT}`, '-z'];

		if (options?.shortStats) {
			args.push('--shortstat');

			if (this._git.compareGitVersionTo('2.31') !== -1) {
				args.push('--diff-merges=first-parent');
			}
		}

		if (options?.reverse) {
			args.push('--reverse', '--ancestry-path');
		}

		if (options?.sortByAuthorDate) {
			args.push('--author-date-order');
		}

		if (options?.range) {
			args.push(options.range);
		} else {
			args.push(`-n${options?.maxEntries ?? 32}`);
		}

		if (options?.author) {
			args.push(`--author=${options.author}`);
		}

		if (options?.grep) {
			args.push(`--grep=${options.grep}`);
			args.push('--extended-regexp');
			args.push('--regexp-ignore-case');
		}

		if (typeof options?.maxParents === 'number') {
			args.push(`--max-parents=${options.maxParents}`);
		}

		if (typeof options?.skip === 'number') {
			args.push(`--skip=${options.skip}`);
		}

		if (options?.refNames) {
			args.push('--topo-order');
			args.push('--decorate=full');

			// In order to avoid hitting the command line limit due to large number of reference
			// names (can happen when the `all` filter is used in the Source Control Graph view),
			// we are passing the reference names via stdin.
			spawnOptions.input = options.refNames.join('\n');
			args.push('--stdin');
		}

		if (options?.path) {
			args.push('--', options.path);
		}

		const result = await this.exec(args, spawnOptions);
		if (result.exitCode) {
			// An empty repo
			return [];
		}

		return parseGitCommits(result.stdout);
	}

	async logFile(uri: Uri, options?: LogFileOptions, cancellationToken?: CancellationToken): Promise<Commit[]> {
		const args = ['log', `--format=${COMMIT_FORMAT}`, '-z'];

		if (options?.maxEntries && !options?.reverse) {
			args.push(`-n${options.maxEntries}`);
		}

		if (options?.hash) {
			// If we are reversing, we must add a range (with HEAD) because we are using --ancestry-path for better reverse walking
			if (options?.reverse) {
				args.push('--reverse', '--ancestry-path', `${options.hash}..HEAD`);
			} else {
				args.push(options.hash);
			}
		}

		if (options?.shortStats) {
			args.push('--shortstat');
		}

		if (options?.sortByAuthorDate) {
			args.push('--author-date-order');
		}

		if (options?.follow) {
			args.push('--follow');
		}

		args.push('--', uri.fsPath);

		try {
			const result = await this.exec(args, { cancellationToken });
			if (result.exitCode) {
				// No file history, e.g. a new file or untracked
				return [];
			}

			return parseGitCommits(result.stdout);
		} catch (err) {
			// Repository has no commits yet
			if (/does not have any commits yet/.test(err.stderr)) {
				return [];
			}

			throw err;
		}
	}

	async reflog(ref: string, pattern: string): Promise<string[]> {
		const args = ['reflog', ref, `--grep-reflog=${pattern}`];
		const result = await this.exec(args);
		if (result.exitCode) {
			return [];
		}

		return result.stdout.split('\n')
			.filter(entry => !!entry);
	}

	async buffer(ref: string, filePath: string): Promise<Buffer> {
		const relativePath = this.sanitizeRelativePath(filePath);
		const child = this.stream(['show', '--textconv', `${ref}:${relativePath}`]);

		if (!child.stdout) {
			return Promise.reject<Buffer>('Can\'t open file from git');
		}

		const { exitCode, stdout, stderr } = await exec(child);

		if (exitCode) {
			const err = new GitError({
				message: 'Could not show object.',
				exitCode
			});

			if (/exists on disk, but not in/.test(stderr)) {
				err.gitErrorCode = GitErrorCodes.WrongCase;
			}

			return Promise.reject<Buffer>(err);
		}

		return stdout;
	}

	async getObjectDetails(treeish: string, path: string): Promise<{ mode: string; object: string; size: number }> {
		if (!treeish || treeish === ':1' || treeish === ':2' || treeish === ':3') { // index
			const elements = await this.lsfiles(path);

			if (elements.length === 0) {
				throw new GitError({ message: 'Path not known by git', gitErrorCode: GitErrorCodes.UnknownPath });
			}

			const { mode, object } = treeish !== ''
				? elements.find(e => e.stage === treeish.substring(1)) ?? elements[0]
				: elements[0];

			const catFile = await this.exec(['cat-file', '-s', object]);
			const size = parseInt(catFile.stdout);

			return { mode, object, size };
		}

		const elements = await this.lstree(treeish, path);

		if (elements.length === 0) {
			throw new GitError({ message: 'Path not known by git', gitErrorCode: GitErrorCodes.UnknownPath });
		}

		const { mode, object, size } = elements[0];
		return { mode, object, size: parseInt(size) || 0 };
	}

	async lstree(treeish: string, path?: string, options?: { recursive?: boolean }): Promise<LsTreeElement[]> {
		const args = ['ls-tree', '-l'];

		if (options?.recursive) {
			args.push('-r');
		}

		args.push(treeish);

		if (path) {
			args.push('--', this.sanitizeRelativePath(path));
		}

		const { stdout } = await this.exec(args);
		return parseLsTree(stdout);
	}

	async lsfiles(path: string): Promise<LsFilesElement[]> {
		const args = ['ls-files', '--stage'];
		const relativePath = this.sanitizeRelativePath(path);

		if (relativePath) {
			args.push('--', relativePath);
		}

		const { stdout } = await this.exec(args);
		return parseLsFiles(stdout);
	}

	async getGitFilePath(ref: string, filePath: string): Promise<string> {
		const elements: { file: string }[] = ref
			? await this.lstree(ref, undefined, { recursive: true })
			: await this.lsfiles(this.repositoryRoot);

		const relativePathLowercase = this.sanitizeRelativePath(filePath).toLowerCase();
		const element = elements.find(file => file.file.toLowerCase() === relativePathLowercase);

		if (!element) {
			throw new GitError({
				message: `Git relative path not found. Was looking for ${relativePathLowercase} among ${JSON.stringify(elements.map(({ file }) => file), null, 2)}`,
			});
		}

		return path.join(this.repositoryRoot, element.file);
	}

	async detectObjectType(object: string): Promise<{ mimetype: string; encoding?: string }> {
		const child = await this.stream(['show', '--textconv', object]);
		const buffer = await readBytes(child.stdout!, 4100);

		try {
			child.kill();
		} catch (err) {
			// noop
		}

		const encoding = detectUnicodeEncoding(buffer);
		let isText = true;

		if (encoding !== Encoding.UTF16be && encoding !== Encoding.UTF16le) {
			for (let i = 0; i < buffer.length; i++) {
				if (buffer.readInt8(i) === 0) {
					isText = false;
					break;
				}
			}
		}

		if (!isText) {
			const result = await filetype.fromBuffer(buffer);

			if (!result) {
				return { mimetype: 'application/octet-stream' };
			} else {
				return { mimetype: result.mime };
			}
		}

		if (encoding) {
			return { mimetype: 'text/plain', encoding };
		} else {
			// TODO@JOAO: read the setting OUTSIDE!
			return { mimetype: 'text/plain' };
		}
	}

	async apply(patch: string, reverse?: boolean): Promise<void> {
		const args = ['apply', patch];

		if (reverse) {
			args.push('-R');
		}

		try {
			await this.exec(args);
		} catch (err) {
			if (/patch does not apply/.test(err.stderr)) {
				err.gitErrorCode = GitErrorCodes.PatchDoesNotApply;
			}

			throw err;
		}
	}

	async diff(cached = false): Promise<string> {
		const args = ['diff'];

		if (cached) {
			args.push('--cached');
		}

		const result = await this.exec(args);
		return result.stdout;
	}

	diffWithHEAD(): Promise<Change[]>;
	diffWithHEAD(path: string): Promise<string>;
	diffWithHEAD(path?: string | undefined): Promise<string | Change[]>;
	async diffWithHEAD(path?: string | undefined): Promise<string | Change[]> {
		if (!path) {
			return await this.diffFiles(undefined, { cached: false });
		}

		const args = ['diff', '--', this.sanitizeRelativePath(path)];
		const result = await this.exec(args);
		return result.stdout;
	}

	async diffWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.diffFilesShortStat(undefined, { cached: false, path });
	}

	diffWith(ref: string): Promise<Change[]>;
	diffWith(ref: string, path: string): Promise<string>;
	diffWith(ref: string, path?: string | undefined): Promise<string | Change[]>;
	async diffWith(ref: string, path?: string): Promise<string | Change[]> {
		if (!path) {
			return await this.diffFiles(ref, { cached: false });
		}

		const args = ['diff', ref, '--', this.sanitizeRelativePath(path)];
		const result = await this.exec(args);
		return result.stdout;
	}

	diffIndexWithHEAD(): Promise<Change[]>;
	diffIndexWithHEAD(path: string): Promise<string>;
	diffIndexWithHEAD(path?: string | undefined): Promise<Change[]>;
	async diffIndexWithHEAD(path?: string): Promise<string | Change[]> {
		if (!path) {
			return await this.diffFiles(undefined, { cached: true });
		}

		const args = ['diff', '--cached', '--', this.sanitizeRelativePath(path)];
		const result = await this.exec(args);
		return result.stdout;
	}

	async diffIndexWithHEADShortStats(path?: string): Promise<CommitShortStat> {
		return this.diffFilesShortStat(undefined, { cached: true, path });
	}

	diffIndexWith(ref: string): Promise<Change[]>;
	diffIndexWith(ref: string, path: string): Promise<string>;
	diffIndexWith(ref: string, path?: string | undefined): Promise<string | Change[]>;
	async diffIndexWith(ref: string, path?: string): Promise<string | Change[]> {
		if (!path) {
			return await this.diffFiles(ref, { cached: true });
		}

		const args = ['diff', '--cached', ref, '--', this.sanitizeRelativePath(path)];
		const result = await this.exec(args);
		return result.stdout;
	}

	async diffBlobs(object1: string, object2: string): Promise<string> {
		const args = ['diff', object1, object2];
		const result = await this.exec(args);
		return result.stdout;
	}

	diffBetween(ref1: string, ref2: string): Promise<Change[]>;
	diffBetween(ref1: string, ref2: string, path: string): Promise<string>;
	diffBetween(ref1: string, ref2: string, path?: string | undefined): Promise<string | Change[]>;
	async diffBetween(ref1: string, ref2: string, path?: string): Promise<string | Change[]> {
		const range = `${ref1}...${ref2}`;
		if (!path) {
			return await this.diffFiles(range, { cached: false });
		}

		const args = ['diff', range, '--', this.sanitizeRelativePath(path)];
		const result = await this.exec(args);

		return result.stdout.trim();
	}

	async diffBetween2(ref1: string, ref2: string, options: { similarityThreshold?: number }): Promise<Change[]> {
		return await this.diffFiles(`${ref1}...${ref2}`, { cached: false, similarityThreshold: options.similarityThreshold });
	}

	private async diffFiles(ref: string | undefined, options: { cached: boolean; similarityThreshold?: number }): Promise<Change[]> {
		const args = ['diff', '--name-status', '-z', '--diff-filter=ADMR'];

		if (options.cached) {
			args.push('--cached');
		}

		if (options.similarityThreshold) {
			args.push(`--find-renames=${options.similarityThreshold}%`);
		}

		if (ref) {
			args.push(ref);
		}

		args.push('--');

		const gitResult = await this.exec(args);
		if (gitResult.exitCode) {
			return [];
		}

		return parseGitChanges(this.repositoryRoot, gitResult.stdout);
	}

	private async diffFilesShortStat(ref: string | undefined, options: { cached: boolean; path?: string }): Promise<CommitShortStat> {
		const args = ['diff', '--shortstat'];

		if (options.cached) {
			args.push('--cached');
		}

		if (ref !== undefined) {
			args.push(ref);
		}

		args.push('--');

		if (options.path) {
			args.push(this.sanitizeRelativePath(options.path));
		}

		const result = await this.exec(args);
		if (result.exitCode) {
			return { files: 0, insertions: 0, deletions: 0 };
		}

		return parseGitDiffShortStat(result.stdout.trim());
	}


	async diffTrees(treeish1: string, treeish2?: string, options?: { similarityThreshold?: number }): Promise<Change[]> {
		const args = ['diff-tree', '-r', '--name-status', '-z', '--diff-filter=ADMR'];

		if (options?.similarityThreshold) {
			args.push(`--find-renames=${options.similarityThreshold}%`);
		}

		args.push(treeish1);

		if (treeish2) {
			args.push(treeish2);
		}

		args.push('--');

		const gitResult = await this.exec(args);
		if (gitResult.exitCode) {
			return [];
		}

		return parseGitChanges(this.repositoryRoot, gitResult.stdout);
	}

	async getMergeBase(ref1: string, ref2: string, ...refs: string[]): Promise<string | undefined> {
		try {
			const args = ['merge-base'];
			if (refs.length !== 0) {
				args.push('--octopus');
				args.push(...refs);
			}

			args.push(ref1, ref2);

			const result = await this.exec(args);

			return result.stdout.trim();
		}
		catch (err) {
			return undefined;
		}
	}

	async hashObject(data: string): Promise<string> {
		const args = ['hash-object', '-w', '--stdin'];
		const result = await this.exec(args, { input: data });

		return result.stdout.trim();
	}

	async add(paths: string[], opts?: { update?: boolean }): Promise<void> {
		const args = ['add'];

		if (opts && opts.update) {
			args.push('-u');
		} else {
			args.push('-A');
		}

		if (paths && paths.length) {
			for (const chunk of splitInChunks(paths.map(p => this.sanitizeRelativePath(p)), MAX_CLI_LENGTH)) {
				await this.exec([...args, '--', ...chunk]);
			}
		} else {
			await this.exec([...args, '--', '.']);
		}
	}

	async rm(paths: string[]): Promise<void> {
		const args = ['rm', '--'];

		if (!paths || !paths.length) {
			return;
		}

		args.push(...paths.map(p => this.sanitizeRelativePath(p)));

		await this.exec(args);
	}

	async stage(path: string, data: Uint8Array): Promise<void> {
		const relativePath = this.sanitizeRelativePath(path);
		const child = this.stream(['hash-object', '--stdin', '-w', '--path', relativePath], { stdio: [null, null, null] });
		child.stdin!.end(data);

		const { exitCode, stdout } = await exec(child);
		const hash = stdout.toString('utf8');

		if (exitCode) {
			throw new GitError({
				message: 'Could not hash object.',
				exitCode: exitCode
			});
		}

		const treeish = await this.getCommit('HEAD').then(() => 'HEAD', () => '');
		let mode: string;
		let add: string = '';

		try {
			const details = await this.getObjectDetails(treeish, path);
			mode = details.mode;
		} catch (err) {
			if (err.gitErrorCode !== GitErrorCodes.UnknownPath) {
				throw err;
			}

			mode = '100644';
			add = '--add';
		}

		await this.exec(['update-index', add, '--cacheinfo', mode, hash, relativePath]);
	}

	async checkout(treeish: string, paths: string[], opts: { track?: boolean; detached?: boolean } = Object.create(null)): Promise<void> {
		const args = ['checkout', '-q'];

		if (opts.track) {
			args.push('--track');
		}

		if (opts.detached) {
			args.push('--detach');
		}

		if (treeish) {
			args.push(treeish);
		}

		try {
			if (paths && paths.length > 0) {
				for (const chunk of splitInChunks(paths.map(p => this.sanitizeRelativePath(p)), MAX_CLI_LENGTH)) {
					await this.exec([...args, '--', ...chunk]);
				}
			} else {
				await this.exec(args);
			}
		} catch (err) {
			if (/Please,? commit your changes or stash them/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.DirtyWorkTree;
				err.gitTreeish = treeish;
			} else if (/You are on a branch yet to be born/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.BranchNotYetBorn;
			}

			throw err;
		}
	}

	async commit(message: string | undefined, opts: CommitOptions = Object.create(null)): Promise<void> {
		const args = ['commit', '--quiet'];
		const options: SpawnOptions = {};

		if (message) {
			options.input = message;
			args.push('--allow-empty-message', '--file', '-');
		}

		if (opts.verbose) {
			args.push('--verbose');
		}

		if (opts.all) {
			args.push('--all');
		}

		if (opts.amend) {
			args.push('--amend');
		}

		if (!opts.useEditor) {
			if (!message) {
				if (opts.amend) {
					args.push('--no-edit');
				} else {
					options.input = '';
					args.push('--file', '-');
				}
			}

			args.push('--allow-empty-message');
		}

		if (opts.signoff) {
			args.push('--signoff');
		}

		if (opts.signCommit) {
			args.push('-S');
		}

		if (opts.empty) {
			args.push('--allow-empty');
		}

		if (opts.noVerify) {
			args.push('--no-verify');
		}

		if (opts.requireUserConfig ?? true) {
			// Stops git from guessing at user/email
			args.splice(0, 0, '-c', 'user.useConfigOnly=true');
		}

		try {
			await this.exec(args, options);
		} catch (commitErr) {
			await this.handleCommitError(commitErr);
		}
	}

	async rebaseAbort(): Promise<void> {
		await this.exec(['rebase', '--abort']);
	}

	async rebaseContinue(): Promise<void> {
		const args = ['rebase', '--continue'];

		try {
			await this.exec(args, { env: { GIT_EDITOR: 'true' } });
		} catch (commitErr) {
			await this.handleCommitError(commitErr);
		}
	}


	private async handleCommitError(commitErr: unknown): Promise<void> {
		if (commitErr instanceof GitError && /not possible because you have unmerged files/.test(commitErr.stderr || '')) {
			commitErr.gitErrorCode = GitErrorCodes.UnmergedChanges;
			throw commitErr;
		} else if (commitErr instanceof GitError && /Aborting commit due to empty commit message/.test(commitErr.stderr || '')) {
			commitErr.gitErrorCode = GitErrorCodes.EmptyCommitMessage;
			throw commitErr;
		}

		try {
			await this.exec(['config', '--get-all', 'user.name']);
		} catch (err) {
			err.gitErrorCode = GitErrorCodes.NoUserNameConfigured;
			throw err;
		}

		try {
			await this.exec(['config', '--get-all', 'user.email']);
		} catch (err) {
			err.gitErrorCode = GitErrorCodes.NoUserEmailConfigured;
			throw err;
		}

		throw commitErr;
	}

	async branch(name: string, checkout: boolean, ref?: string): Promise<void> {
		const args = checkout ? ['checkout', '-q', '-b', name, '--no-track'] : ['branch', '-q', name];

		if (ref) {
			args.push(ref);
		}

		await this.exec(args);
	}

	async deleteBranch(name: string, force?: boolean): Promise<void> {
		const args = ['branch', force ? '-D' : '-d', name];
		await this.exec(args);
	}

	async renameBranch(name: string): Promise<void> {
		const args = ['branch', '-m', name];
		await this.exec(args);
	}

	async move(from: string, to: string): Promise<void> {
		const args = ['mv', from, to];
		await this.exec(args);
	}

	async setBranchUpstream(name: string, upstream: string): Promise<void> {
		const args = ['branch', '--set-upstream-to', upstream, name];
		await this.exec(args);
	}

	async deleteRef(ref: string): Promise<void> {
		const args = ['update-ref', '-d', ref];
		await this.exec(args);
	}

	async merge(ref: string): Promise<void> {
		const args = ['merge', ref];

		try {
			await this.exec(args);
		} catch (err) {
			if (/^CONFLICT /m.test(err.stdout || '')) {
				err.gitErrorCode = GitErrorCodes.Conflict;
			}

			throw err;
		}
	}

	async mergeAbort(): Promise<void> {
		await this.exec(['merge', '--abort']);
	}

	async tag(options: { name: string; message?: string; ref?: string }): Promise<void> {
		let args = ['tag'];

		if (options.message) {
			args = [...args, '-a', options.name, '-m', options.message];
		} else {
			args = [...args, options.name];
		}

		if (options.ref) {
			args.push(options.ref);
		}

		await this.exec(args);
	}

	async deleteTag(name: string): Promise<void> {
		const args = ['tag', '-d', name];
		await this.exec(args);
	}

	async addWorktree(options: { path: string; commitish: string; branch?: string }): Promise<void> {
		const args = ['worktree', 'add'];

		if (options.branch) {
			args.push('-b', options.branch);
		}

		args.push(options.path, options.commitish);

		await this.exec(args);
	}

	async deleteWorktree(path: string, options?: { force?: boolean }): Promise<void> {
		const args = ['worktree', 'remove'];

		if (options?.force) {
			args.push('--force');
		}

		args.push(path);
		await this.exec(args);
	}

	async deleteRemoteRef(remoteName: string, refName: string, options?: { force?: boolean }): Promise<void> {
		const args = ['push', remoteName, '--delete'];

		if (options?.force) {
			args.push('--force');
		}

		args.push(refName);
		await this.exec(args);
	}

	async clean(paths: string[]): Promise<void> {
		const pathsByGroup = groupBy(paths.map(sanitizePath), p => path.dirname(p));
		const groups = Object.keys(pathsByGroup).map(k => pathsByGroup[k]);

		const limiter = new Limiter<IExecutionResult<string>>(5);
		const promises: Promise<IExecutionResult<string>>[] = [];
		const args = ['clean', '-f', '-q'];

		for (const paths of groups) {
			for (const chunk of splitInChunks(paths.map(p => this.sanitizeRelativePath(p)), MAX_CLI_LENGTH)) {
				promises.push(limiter.queue(() => this.exec([...args, '--', ...chunk])));
			}
		}

		await Promise.all(promises);
	}

	async undo(): Promise<void> {
		await this.exec(['clean', '-fd']);

		try {
			await this.exec(['checkout', '--', '.']);
		} catch (err) {
			if (/did not match any file\(s\) known to git\./.test(err.stderr || '')) {
				return;
			}

			throw err;
		}
	}

	async reset(treeish: string, hard: boolean = false): Promise<void> {
		const args = ['reset', hard ? '--hard' : '--soft', treeish];
		await this.exec(args);
	}

	async revert(treeish: string, paths: string[]): Promise<void> {
		const result = await this.exec(['branch']);
		let args: string[];

		// In case there are no branches, we must use rm --cached
		if (!result.stdout) {
			args = ['rm', '--cached', '-r'];
		} else {
			args = ['reset', '-q', treeish];
		}

		try {
			if (paths && paths.length > 0) {
				for (const chunk of splitInChunks(paths.map(p => this.sanitizeRelativePath(p)), MAX_CLI_LENGTH)) {
					await this.exec([...args, '--', ...chunk]);
				}
			} else {
				await this.exec([...args, '--', '.']);
			}
		} catch (err) {
			// In case there are merge conflicts to be resolved, git reset will output
			// some "needs merge" data. We try to get around that.
			if (/([^:]+: needs merge\n)+/m.test(err.stdout || '')) {
				return;
			}

			throw err;
		}
	}

	async addRemote(name: string, url: string): Promise<void> {
		const args = ['remote', 'add', name, url];
		await this.exec(args);
	}

	async removeRemote(name: string): Promise<void> {
		const args = ['remote', 'remove', name];
		await this.exec(args);
	}

	async renameRemote(name: string, newName: string): Promise<void> {
		const args = ['remote', 'rename', name, newName];
		await this.exec(args);
	}

	async fetch(options: { remote?: string; ref?: string; all?: boolean; prune?: boolean; depth?: number; silent?: boolean; readonly cancellationToken?: CancellationToken } = {}): Promise<void> {
		const args = ['fetch'];
		const spawnOptions: SpawnOptions = {
			cancellationToken: options.cancellationToken,
			env: { 'GIT_HTTP_USER_AGENT': this.git.userAgent }
		};

		if (options.remote) {
			args.push(options.remote);

			if (options.ref) {
				args.push(options.ref);
			}
		} else if (options.all) {
			args.push('--all');
		}

		if (options.prune) {
			args.push('--prune');
		}

		if (typeof options.depth === 'number') {
			args.push(`--depth=${options.depth}`);
		}

		if (options.silent) {
			spawnOptions.env!['VSCODE_GIT_FETCH_SILENT'] = 'true';
		}

		try {
			await this.exec(args, spawnOptions);
		} catch (err) {
			if (/No remote repository specified\./.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoRemoteRepositorySpecified;
			} else if (/Could not read from remote repository/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.RemoteConnectionError;
			} else if (/! \[rejected\].*\(non-fast-forward\)/m.test(err.stderr || '')) {
				// The local branch has outgoing changes and it cannot be fast-forwarded.
				err.gitErrorCode = GitErrorCodes.BranchFastForwardRejected;
			}

			throw err;
		}
	}

	async fetchTags(options: { remote: string; tags: string[]; force?: boolean }): Promise<void> {
		const args = ['fetch'];
		const spawnOptions: SpawnOptions = {
			env: { 'GIT_HTTP_USER_AGENT': this.git.userAgent }
		};

		args.push(options.remote);

		for (const tag of options.tags) {
			args.push(`refs/tags/${tag}:refs/tags/${tag}`);
		}

		if (options.force) {
			args.push('--force');
		}

		await this.exec(args, spawnOptions);
	}

	async pull(rebase?: boolean, remote?: string, branch?: string, options: PullOptions = {}): Promise<void> {
		const args = ['pull'];

		if (options.tags) {
			args.push('--tags');
		}

		if (options.unshallow) {
			args.push('--unshallow');
		}

		// --auto-stash option is only available `git pull --merge` starting with git 2.27.0
		if (options.autoStash && this._git.compareGitVersionTo('2.27.0') !== -1) {
			args.push('--autostash');
		}

		if (rebase) {
			args.push('-r');
		}

		if (remote && branch) {
			args.push(remote);
			args.push(branch);
		}

		try {
			await this.exec(args, {
				cancellationToken: options.cancellationToken,
				env: { 'GIT_HTTP_USER_AGENT': this.git.userAgent }
			});
		} catch (err) {
			if (/^CONFLICT \([^)]+\): \b/m.test(err.stdout || '')) {
				err.gitErrorCode = GitErrorCodes.Conflict;
			} else if (/Please tell me who you are\./.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoUserNameConfigured;
			} else if (/Could not read from remote repository/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.RemoteConnectionError;
			} else if (/Pull(?:ing)? is not possible because you have unmerged files|Cannot pull with rebase: You have unstaged changes|Your local changes to the following files would be overwritten|Please, commit your changes before you can merge/i.test(err.stderr)) {
				err.stderr = err.stderr.replace(/Cannot pull with rebase: You have unstaged changes/i, 'Cannot pull with rebase, you have unstaged changes');
				err.gitErrorCode = GitErrorCodes.DirtyWorkTree;
			} else if (/cannot lock ref|unable to update local ref/i.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.CantLockRef;
			} else if (/cannot rebase onto multiple branches/i.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.CantRebaseMultipleBranches;
			} else if (/! \[rejected\].*\(would clobber existing tag\)/m.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.TagConflict;
			}

			throw err;
		}
	}

	async rebase(branch: string, options: PullOptions = {}): Promise<void> {
		const args = ['rebase'];

		args.push(branch);

		try {
			await this.exec(args, options);
		} catch (err) {
			if (/^CONFLICT \([^)]+\): \b/m.test(err.stdout || '')) {
				err.gitErrorCode = GitErrorCodes.Conflict;
			} else if (/cannot rebase onto multiple branches/i.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.CantRebaseMultipleBranches;
			}

			throw err;
		}
	}

	async push(remote?: string, name?: string, setUpstream: boolean = false, followTags = false, forcePushMode?: ForcePushMode, tags = false): Promise<void> {
		const args = ['push'];

		if (forcePushMode === ForcePushMode.ForceWithLease || forcePushMode === ForcePushMode.ForceWithLeaseIfIncludes) {
			args.push('--force-with-lease');
			if (forcePushMode === ForcePushMode.ForceWithLeaseIfIncludes && this._git.compareGitVersionTo('2.30') !== -1) {
				args.push('--force-if-includes');
			}
		} else if (forcePushMode === ForcePushMode.Force) {
			args.push('--force');
		}

		if (setUpstream) {
			args.push('-u');
		}

		if (followTags) {
			args.push('--follow-tags');
		}

		if (tags) {
			args.push('--tags');
		}

		if (remote) {
			args.push(remote);
		}

		if (name) {
			args.push(name);
		}

		try {
			await this.exec(args, { env: { 'GIT_HTTP_USER_AGENT': this.git.userAgent } });
		} catch (err) {
			if (/^error: failed to push some refs to\b/m.test(err.stderr || '')) {
				if (forcePushMode === ForcePushMode.ForceWithLease && /! \[rejected\].*\(stale info\)/m.test(err.stderr || '')) {
					err.gitErrorCode = GitErrorCodes.ForcePushWithLeaseRejected;
				} else if (forcePushMode === ForcePushMode.ForceWithLeaseIfIncludes && /! \[rejected\].*\(remote ref updated since checkout\)/m.test(err.stderr || '')) {
					err.gitErrorCode = GitErrorCodes.ForcePushWithLeaseIfIncludesRejected;
				} else {
					err.gitErrorCode = GitErrorCodes.PushRejected;
				}
			} else if (/Permission.*denied/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.PermissionDenied;
			} else if (/Could not read from remote repository/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.RemoteConnectionError;
			} else if (/^fatal: The current branch .* has no upstream branch/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoUpstreamBranch;
			}

			throw err;
		}
	}

	async cherryPick(commitHash: string): Promise<void> {
		try {
			await this.exec(['cherry-pick', commitHash]);
		} catch (err) {
			if (/The previous cherry-pick is now empty, possibly due to conflict resolution./.test(err.stderr ?? '')) {
				// Abort cherry-pick
				await this.cherryPickAbort();

				err.gitErrorCode = GitErrorCodes.CherryPickEmpty;
			} else {
				// Conflict during cherry-pick
				err.gitErrorCode = GitErrorCodes.CherryPickConflict;
			}

			throw err;
		}
	}

	async cherryPickAbort(): Promise<void> {
		await this.exec(['cherry-pick', '--abort']);
	}

	async blame(path: string): Promise<string> {
		try {
			const args = ['blame', '--', this.sanitizeRelativePath(path)];
			const result = await this.exec(args);
			return result.stdout.trim();
		} catch (err) {
			if (/^fatal: no such path/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoPathFound;
			}

			throw err;
		}
	}

	async blame2(path: string, ref?: string): Promise<BlameInformation[] | undefined> {
		try {
			const args = ['blame', '--root', '--incremental'];

			if (ref) {
				args.push(ref);
			}

			args.push('--', this.sanitizeRelativePath(path));

			const result = await this.exec(args);

			return parseGitBlame(result.stdout.trim());
		}
		catch (err) {
			return undefined;
		}
	}

	async createStash(message?: string, includeUntracked?: boolean, staged?: boolean): Promise<void> {
		try {
			const args = ['stash', 'push'];

			if (includeUntracked) {
				args.push('-u');
			}

			if (staged) {
				args.push('-S');
			}

			if (message) {
				args.push('-m', message);
			}

			await this.exec(args);
		} catch (err) {
			if (/No local changes to save/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoLocalChanges;
			}

			throw err;
		}
	}

	async popStash(index?: number, options?: { reinstateStagedChanges?: boolean }): Promise<void> {
		const args = ['stash', 'pop'];
		if (options?.reinstateStagedChanges) {
			args.push('--index');
		}
		await this.popOrApplyStash(args, index);
	}

	async applyStash(index?: number, options?: { reinstateStagedChanges?: boolean }): Promise<void> {
		const args = ['stash', 'apply'];
		if (options?.reinstateStagedChanges) {
			args.push('--index');
		}
		await this.popOrApplyStash(args, index);
	}

	private async popOrApplyStash(args: string[], index?: number): Promise<void> {
		try {
			if (typeof index === 'number') {
				args.push(`stash@{${index}}`);
			}

			await this.exec(args);
		} catch (err) {
			if (/No stash found/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoStashFound;
			} else if (/error: Your local changes to the following files would be overwritten/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.LocalChangesOverwritten;
			} else if (/^CONFLICT/m.test(err.stdout || '')) {
				err.gitErrorCode = GitErrorCodes.StashConflict;
			}

			throw err;
		}
	}

	async dropStash(index?: number): Promise<void> {
		const args = ['stash'];

		if (typeof index === 'number') {
			args.push('drop');
			args.push(`stash@{${index}}`);
		} else {
			args.push('clear');
		}

		try {
			await this.exec(args);
		} catch (err) {
			if (/No stash found/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.NoStashFound;
			}

			throw err;
		}
	}

	async showStash(index: number): Promise<Change[] | undefined> {
		const args = ['stash', 'show', `stash@{${index}}`, '--name-status', '-z', '-u'];

		try {
			const result = await this.exec(args);
			if (result.exitCode) {
				return [];
			}

			return parseGitChanges(this.repositoryRoot, result.stdout.trim());
		} catch (err) {
			if (/No stash found/.test(err.stderr || '')) {
				return undefined;
			}

			throw err;
		}
	}

	async getStatus(opts?: { limit?: number; ignoreSubmodules?: boolean; similarityThreshold?: number; untrackedChanges?: 'mixed' | 'separate' | 'hidden'; cancellationToken?: CancellationToken }): Promise<{ status: IFileStatus[]; statusLength: number; didHitLimit: boolean }> {
		if (opts?.cancellationToken && opts?.cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		const disposables: IDisposable[] = [];

		const env = { GIT_OPTIONAL_LOCKS: '0' };
		const args = ['status', '-z'];

		if (opts?.untrackedChanges === 'hidden') {
			args.push('-uno');
		} else {
			args.push('-uall');
		}

		if (opts?.ignoreSubmodules) {
			args.push('--ignore-submodules');
		}

		// --find-renames option is only available starting with git 2.18.0
		if (opts?.similarityThreshold && opts.similarityThreshold !== 50 && this._git.compareGitVersionTo('2.18.0') !== -1) {
			args.push(`--find-renames=${opts.similarityThreshold}%`);
		}

		const child = this.stream(args, { env });

		let result = new Promise<{ status: IFileStatus[]; statusLength: number; didHitLimit: boolean }>((c, e) => {
			const parser = new GitStatusParser();

			const onClose = (exitCode: number) => {
				if (exitCode !== 0) {
					const stderr = stderrData.join('');
					return e(new GitError({
						message: 'Failed to execute git',
						stderr,
						exitCode,
						gitErrorCode: getGitErrorCode(stderr),
						gitCommand: 'status',
						gitArgs: args
					}));
				}

				c({ status: parser.status, statusLength: parser.status.length, didHitLimit: false });
			};

			const limit = opts?.limit ?? 10000;
			const onStdoutData = (raw: string) => {
				parser.update(raw);

				if (limit !== 0 && parser.status.length > limit) {
					child.removeListener('close', onClose);
					child.stdout!.removeListener('data', onStdoutData);
					child.kill();

					c({ status: parser.status.slice(0, limit), statusLength: parser.status.length, didHitLimit: true });
				}
			};

			child.stdout!.setEncoding('utf8');
			child.stdout!.on('data', onStdoutData);

			const stderrData: string[] = [];
			child.stderr!.setEncoding('utf8');
			child.stderr!.on('data', raw => stderrData.push(raw as string));

			child.on('error', cpErrorHandler(e));
			child.on('close', onClose);
		});

		if (opts?.cancellationToken) {
			const cancellationPromise = new Promise<{ status: IFileStatus[]; statusLength: number; didHitLimit: boolean }>((_, e) => {
				disposables.push(onceEvent(opts.cancellationToken!.onCancellationRequested)(() => {
					try {
						child.kill();
					} catch (err) {
						// noop
					}

					e(new CancellationError());
				}));
			});

			result = Promise.race([result, cancellationPromise]);
		}

		try {
			const { status, statusLength, didHitLimit } = await result;
			return { status, statusLength, didHitLimit };
		}
		finally {
			dispose(disposables);
		}
	}

	async getHEADRef(): Promise<Branch | undefined> {
		let HEAD: Branch | undefined;

		try {
			HEAD = await this.getHEAD();

			if (HEAD.name) {
				// Branch
				HEAD = await this.getBranch(HEAD.name);

				// Upstream commit
				if (HEAD && HEAD.upstream) {
					const ref = HEAD.upstream.remote !== '.'
						? `refs/remotes/${HEAD.upstream.remote}/${HEAD.upstream.name}`
						: `refs/heads/${HEAD.upstream.name}`;
					const commit = await this.revParse(ref);
					HEAD = { ...HEAD, upstream: { ...HEAD.upstream, commit } };
				}
			} else if (HEAD.commit) {
				// Tag || Commit
				const tags = await this.getRefs({ pattern: 'refs/tags' });
				const tag = tags.find(tag => tag.commit === HEAD!.commit);

				if (tag) {
					HEAD = { ...HEAD, name: tag.name, type: RefType.Tag };
				}
			}
		} catch (err) {
			// noop
		}

		return HEAD;
	}

	async getHEAD(): Promise<Ref> {
		if (!this._isUsingRefTable) {
			try {
				// Attempt to parse the HEAD file
				const result = await this.getHEADFS();

				// Git 2.45 adds support for a new reference storage backend called "reftable", promising
				// faster lookups, reads, and writes for repositories with any number of references. For
				// backwards compatibility the `.git/HEAD` file contains `ref: refs/heads/.invalid`. More
				// details are available at https://git-scm.com/docs/reftable
				if (result.name === '.invalid') {
					this._isUsingRefTable = true;
					this.logger.warn(`[Git][getHEAD] Failed to parse HEAD file: Repository is using reftable format.`);
				} else {
					return result;
				}
			}
			catch (err) {
				this.logger.warn(`[Git][getHEAD] Failed to parse HEAD file: ${err.message}`);
			}
		}

		try {
			// Fallback to using git to determine HEAD
			const result = await this.exec(['symbolic-ref', '--short', 'HEAD']);

			if (!result.stdout) {
				throw new Error('Not in a branch');
			}

			return { name: result.stdout.trim(), commit: undefined, type: RefType.Head };
		}
		catch (err) { }

		// Detached HEAD
		const result = await this.exec(['rev-parse', 'HEAD']);

		if (!result.stdout) {
			throw new Error('Error parsing HEAD');
		}

		return { name: undefined, commit: result.stdout.trim(), type: RefType.Head };
	}

	async getHEADFS(): Promise<Ref> {
		const raw = await fs.readFile(path.join(this.dotGit.path, 'HEAD'), 'utf8');

		// Branch
		const branchMatch = raw.match(/^ref: refs\/heads\/(?<name>.*)$/m);
		if (branchMatch?.groups?.name) {
			return { name: branchMatch.groups.name, commit: undefined, type: RefType.Head };
		}

		// Detached
		const commitMatch = raw.match(/^(?<commit>[0-9a-f]{40})$/m);
		if (commitMatch?.groups?.commit) {
			return { name: undefined, commit: commitMatch.groups.commit, type: RefType.Head };
		}

		throw new Error(`Unable to parse HEAD file. HEAD file contents: ${raw}.`);
	}

	async findTrackingBranches(upstreamBranch: string): Promise<Branch[]> {
		const result = await this.exec(['for-each-ref', '--format', '%(refname:short)%00%(upstream:short)', 'refs/heads']);
		return result.stdout.trim().split('\n')
			.map(line => line.trim().split('\0'))
			.filter(([_, upstream]) => upstream === upstreamBranch)
			.map(([ref]): Branch => ({ name: ref, type: RefType.Head }));
	}

	async getRefs(query: RefQuery, cancellationToken?: CancellationToken): Promise<(Ref | Branch)[]> {
		if (cancellationToken && cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		const args = ['for-each-ref'];

		if (query.count) {
			args.push(`--count=${query.count}`);
		}

		if (query.sort && query.sort !== 'alphabetically') {
			args.push('--sort', `-${query.sort}`);
		}

		if (query.includeCommitDetails) {
			const format = this._git.compareGitVersionTo('1.9.0') !== -1
				? `${REFS_WITH_DETAILS_FORMAT}%00%(upstream:track)`
				: REFS_WITH_DETAILS_FORMAT;
			args.push('--format', format);
		} else {
			args.push('--format', REFS_FORMAT);
		}

		if (query.pattern) {
			const patterns = Array.isArray(query.pattern) ? query.pattern : [query.pattern];
			for (const pattern of patterns) {
				args.push(pattern.startsWith('refs/') ? pattern : `refs/${pattern}`);
			}
		}

		if (query.contains) {
			args.push('--contains', query.contains);
		}

		const result = await this.exec(args, { cancellationToken });
		return parseRefs(result.stdout);
	}

	async getRemoteRefs(remote: string, opts?: { heads?: boolean; tags?: boolean; cancellationToken?: CancellationToken }): Promise<Ref[]> {
		if (opts?.cancellationToken && opts?.cancellationToken.isCancellationRequested) {
			throw new CancellationError();
		}

		const args = ['ls-remote'];

		if (opts?.heads) {
			args.push('--heads');
		}

		if (opts?.tags) {
			args.push('--tags');
		}

		args.push(remote);

		const result = await this.exec(args, { cancellationToken: opts?.cancellationToken });

		const fn = (line: string): Ref | null => {
			let match: RegExpExecArray | null;

			if (match = /^([0-9a-f]{40})\trefs\/heads\/([^ ]+)$/.exec(line)) {
				return { name: match[1], commit: match[2], type: RefType.Head };
			} else if (match = /^([0-9a-f]{40})\trefs\/tags\/([^ ]+)$/.exec(line)) {
				return { name: match[2], commit: match[1], type: RefType.Tag };
			}

			return null;
		};

		return result.stdout.split('\n')
			.filter(line => !!line)
			.map(fn)
			.filter(ref => !!ref) as Ref[];
	}

	async getStashes(): Promise<Stash[]> {
		const result = await this.exec(['stash', 'list', `--format=${STASH_FORMAT}`, '-z']);
		return parseGitStashes(result.stdout.trim());
	}

	async getWorktrees(): Promise<Worktree[]> {
		return await this.getWorktreesFS();
	}

	private async getWorktreesFS(): Promise<Worktree[]> {
		try {
			// List all worktree folder names
			const worktreesPath = path.join(this.dotGit.commonPath ?? this.dotGit.path, 'worktrees');
			const dirents = await fs.readdir(worktreesPath, { withFileTypes: true });
			const result: Worktree[] = [];

			for (const dirent of dirents) {
				if (!dirent.isDirectory()) {
					continue;
				}

				try {
					const headPath = path.join(worktreesPath, dirent.name, 'HEAD');
					const headContent = (await fs.readFile(headPath, 'utf8')).trim();

					const gitdirPath = path.join(worktreesPath, dirent.name, 'gitdir');
					const gitdirContent = (await fs.readFile(gitdirPath, 'utf8')).trim();

					result.push({
						name: dirent.name,
						// Remove '/.git' suffix
						path: gitdirContent.replace(/\/.git.*$/, ''),
						// Remove 'ref: ' prefix
						ref: headContent.replace(/^ref: /, ''),
						// Detached if HEAD does not start with 'ref: '
						detached: !headContent.startsWith('ref: ')
					});
				} catch (err) {
					if (/ENOENT/.test(err.message)) {
						continue;
					}

					throw err;
				}
			}

			return result;
		}
		catch (err) {
			if (/ENOENT/.test(err.message) || /ENOTDIR/.test(err.message)) {
				return [];
			}

			throw err;
		}
	}

	async getRemotes(): Promise<Remote[]> {
		const remotes: MutableRemote[] = [];

		try {
			// Attempt to parse the config file
			remotes.push(...await this.getRemotesFS());

			if (remotes.length === 0) {
				this.logger.info('[Git][getRemotes] No remotes found in the git config file');
			}
		}
		catch (err) {
			this.logger.warn(`[Git][getRemotes] Error: ${err.message}`);

			// Fallback to using git to get the remotes
			remotes.push(...await this.getRemotesGit());
		}

		for (const remote of remotes) {
			// https://github.com/microsoft/vscode/issues/45271
			remote.isReadOnly = remote.pushUrl === undefined || remote.pushUrl === 'no_push';
		}

		return remotes;
	}

	private async getRemotesFS(): Promise<MutableRemote[]> {
		const raw = await fs.readFile(path.join(this.dotGit.commonPath ?? this.dotGit.path, 'config'), 'utf8');
		return parseGitRemotes(raw);
	}

	private async getRemotesGit(): Promise<MutableRemote[]> {
		const remotes: MutableRemote[] = [];

		const result = await this.exec(['remote', '--verbose']);
		const lines = result.stdout.trim().split('\n').filter(l => !!l);

		for (const line of lines) {
			const parts = line.split(/\s/);
			const [name, url, type] = parts;

			let remote = remotes.find(r => r.name === name);

			if (!remote) {
				remote = { name, isReadOnly: false };
				remotes.push(remote);
			}

			if (/fetch/i.test(type)) {
				remote.fetchUrl = url;
			} else if (/push/i.test(type)) {
				remote.pushUrl = url;
			} else {
				remote.fetchUrl = url;
				remote.pushUrl = url;
			}
		}

		return remotes;
	}

	async getBranch(name: string): Promise<Branch> {
		if (name === 'HEAD') {
			return this.getHEAD();
		}

		const args = ['for-each-ref'];

		let supportsAheadBehind = true;
		if (this._git.compareGitVersionTo('1.9.0') === -1) {
			args.push('--format=%(refname)%00%(upstream:short)%00%(objectname)');
			supportsAheadBehind = false;
		} else if (this._git.compareGitVersionTo('2.16.0') === -1) {
			args.push('--format=%(refname)%00%(upstream:short)%00%(objectname)%00%(upstream:track)');
		} else {
			args.push('--format=%(refname)%00%(upstream:short)%00%(objectname)%00%(upstream:track)%00%(upstream:remotename)%00%(upstream:remoteref)');
		}

		// On Windows and macOS ref names are case insensitive so we add --ignore-case
		// to handle the scenario where the user switched to a branch with incorrect
		// casing
		if (this.git.compareGitVersionTo('2.12') !== -1 && (isWindows || isMacintosh)) {
			args.push('--ignore-case');
		}

		if (/^refs\/(heads|remotes)\//i.test(name)) {
			args.push(name);
		} else {
			args.push(`refs/heads/${name}`, `refs/remotes/${name}`);
		}

		const result = await this.exec(args);
		const branches: Branch[] = result.stdout.trim().split('\n').map<Branch | undefined>(line => {
			let [branchName, upstream, ref, status, remoteName, upstreamRef] = line.trim().split('\0');

			if (branchName.startsWith('refs/heads/')) {
				branchName = branchName.substring(11);
				const index = upstream.indexOf('/');

				let ahead;
				let behind;
				const match = /\[(?:ahead ([0-9]+))?[,\s]*(?:behind ([0-9]+))?]|\[gone]/.exec(status);
				if (match) {
					[, ahead, behind] = match;
				}

				return {
					type: RefType.Head,
					name: branchName,
					upstream: upstream !== '' && status !== '[gone]' ? {
						name: upstreamRef ? upstreamRef.substring(11) : upstream.substring(index + 1),
						remote: remoteName ? remoteName : upstream.substring(0, index)
					} : undefined,
					commit: ref || undefined,
					ahead: Number(ahead) || 0,
					behind: Number(behind) || 0,
				};
			} else if (branchName.startsWith('refs/remotes/')) {
				branchName = branchName.substring(13);
				const index = branchName.indexOf('/');

				return {
					type: RefType.RemoteHead,
					name: branchName.substring(index + 1),
					remote: branchName.substring(0, index),
					commit: ref,
				};
			} else {
				return undefined;
			}
		}).filter((b?: Branch): b is Branch => !!b);

		if (branches.length) {
			const [branch] = branches;

			if (!supportsAheadBehind && branch.upstream) {
				try {
					const result = await this.exec(['rev-list', '--left-right', '--count', `${branch.name}...${branch.upstream.remote}/${branch.upstream.name}`]);
					const [ahead, behind] = result.stdout.trim().split('\t');

					(branch as Mutable<Branch>).ahead = Number(ahead) || 0;
					(branch as Mutable<Branch>).behind = Number(behind) || 0;
				} catch { }
			}

			return branch;
		}

		this.logger.warn(`[Git][getBranch] No such branch: ${name}`);
		return Promise.reject<Branch>(new Error(`No such branch: ${name}.`));
	}

	async getDefaultBranch(remoteName: string): Promise<Branch> {
		const result = await this.exec(['symbolic-ref', '--short', `refs/remotes/${remoteName}/HEAD`]);
		if (!result.stdout || result.stderr) {
			throw new Error('No default branch');
		}

		return this.getBranch(result.stdout.trim());
	}

	// TODO: Support core.commentChar
	stripCommitMessageComments(message: string): string {
		return message.replace(/^\s*#.*$\n?/gm, '').trim();
	}

	async getSquashMessage(): Promise<string | undefined> {
		const squashMsgPath = path.join(this.repositoryRoot, '.git', 'SQUASH_MSG');

		try {
			const raw = await fs.readFile(squashMsgPath, 'utf8');
			return this.stripCommitMessageComments(raw);
		} catch {
			return undefined;
		}
	}

	async getMergeMessage(): Promise<string | undefined> {
		const mergeMsgPath = path.join(this.repositoryRoot, '.git', 'MERGE_MSG');

		try {
			const raw = await fs.readFile(mergeMsgPath, 'utf8');
			return this.stripCommitMessageComments(raw);
		} catch {
			return undefined;
		}
	}

	async getCommitTemplate(): Promise<string> {
		try {
			const result = await this.exec(['config', '--get', 'commit.template']);

			if (!result.stdout) {
				return '';
			}

			// https://github.com/git/git/blob/3a0f269e7c82aa3a87323cb7ae04ac5f129f036b/path.c#L612
			const homedir = os.homedir();
			let templatePath = result.stdout.trim()
				.replace(/^~([^\/]*)\//, (_, user) => `${user ? path.join(path.dirname(homedir), user) : homedir}/`);

			if (!path.isAbsolute(templatePath)) {
				templatePath = path.join(this.repositoryRoot, templatePath);
			}

			const raw = await fs.readFile(templatePath, 'utf8');
			return this.stripCommitMessageComments(raw);
		} catch (err) {
			return '';
		}
	}

	async getCommit(ref: string): Promise<Commit> {
		const result = await this.exec(['show', '-s', '--decorate=full', '--shortstat', `--format=${COMMIT_FORMAT}`, '-z', ref, '--']);
		const commits = parseGitCommits(result.stdout);
		if (commits.length === 0) {
			return Promise.reject<Commit>('bad commit format');
		}
		return commits[0];
	}

	async showChanges(ref: string): Promise<string> {
		try {
			const result = await this.exec(['log', '-p', '-n1', ref, '--']);
			return result.stdout.trim();
		} catch (err) {
			if (/^fatal: bad revision '.+'/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.BadRevision;
			}

			throw err;
		}
	}

	async showChangesBetween(ref1: string, ref2: string, path?: string): Promise<string> {
		try {
			const args = ['log', '-p', `${ref1}..${ref2}`, '--'];
			if (path) {
				args.push(this.sanitizeRelativePath(path));
			}

			const result = await this.exec(args);
			return result.stdout.trim();
		} catch (err) {
			if (/^fatal: bad revision '.+'/.test(err.stderr || '')) {
				err.gitErrorCode = GitErrorCodes.BadRevision;
			}

			throw err;
		}
	}

	async revList(ref1: string, ref2: string): Promise<string[]> {
		const result = await this.exec(['rev-list', `${ref1}..${ref2}`]);
		if (result.stderr) {
			return [];
		}

		return result.stdout.trim().split('\n');
	}

	async revParse(ref: string): Promise<string | undefined> {
		try {
			const result = await fs.readFile(path.join(this.dotGit.path, ref), 'utf8');
			return result.trim();
		} catch (err) {
			this.logger.warn(`[Git][revParse] Unable to read file: ${err.message}`);
		}

		try {
			const result = await this.exec(['rev-parse', ref]);
			if (result.stderr) {
				return undefined;
			}
			return result.stdout.trim();
		} catch (err) {
			return undefined;
		}
	}

	async updateSubmodules(paths: string[]): Promise<void> {
		const args = ['submodule', 'update'];

		for (const chunk of splitInChunks(paths.map(p => this.sanitizeRelativePath(p)), MAX_CLI_LENGTH)) {
			await this.exec([...args, '--', ...chunk]);
		}
	}

	async getSubmodules(): Promise<Submodule[]> {
		const gitmodulesPath = path.join(this.root, '.gitmodules');

		try {
			const gitmodulesRaw = await fs.readFile(gitmodulesPath, 'utf8');
			return parseGitmodules(gitmodulesRaw);
		} catch (err) {
			if (/ENOENT/.test(err.message)) {
				return [];
			}

			throw err;
		}
	}

	private sanitizeRelativePath(filePath: string): string {
		this.logger.trace(`[Git][sanitizeRelativePath] filePath: ${filePath}`);

		// Relative path
		if (!path.isAbsolute(filePath)) {
			filePath = sanitizeRelativePath(filePath);
			this.logger.trace(`[Git][sanitizeRelativePath] relativePath (noop): ${filePath}`);
			return filePath;
		}

		let relativePath: string | undefined;

		// Repository root real path
		if (this.repositoryRootRealPath) {
			relativePath = relativePathWithNoFallback(this.repositoryRootRealPath, filePath);
			if (relativePath) {
				relativePath = sanitizeRelativePath(relativePath);
				this.logger.trace(`[Git][sanitizeRelativePath] relativePath (real path): ${relativePath}`);
				return relativePath;
			}
		}

		// Repository root path
		relativePath = relativePathWithNoFallback(this.repositoryRoot, filePath);
		if (relativePath) {
			relativePath = sanitizeRelativePath(relativePath);
			this.logger.trace(`[Git][sanitizeRelativePath] relativePath (path): ${relativePath}`);
			return relativePath;
		}

		// Fallback to relative()
		filePath = sanitizeRelativePath(path.relative(this.repositoryRoot, filePath));
		this.logger.trace(`[Git][sanitizeRelativePath] relativePath (fallback): ${filePath}`);
		return filePath;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/gitEditor.ts]---
Location: vscode-main/extensions/git/src/gitEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import { CancellationToken, DocumentLink, DocumentLinkProvider, l10n, Range, TabInputText, TextDocument, Uri, window, workspace } from 'vscode';
import { IIPCHandler, IIPCServer } from './ipc/ipcServer';
import { ITerminalEnvironmentProvider } from './terminal';
import { EmptyDisposable, IDisposable } from './util';
import { Model } from './model';
import { Repository } from './repository';

interface GitEditorRequest {
	commitMessagePath?: string;
}

export class GitEditor implements IIPCHandler, ITerminalEnvironmentProvider {

	private env: { [key: string]: string };
	private disposable: IDisposable = EmptyDisposable;

	readonly featureDescription = 'git editor';

	constructor(ipc?: IIPCServer) {
		if (ipc) {
			this.disposable = ipc.registerHandler('git-editor', this);
		}

		this.env = {
			GIT_EDITOR: `"${path.join(__dirname, ipc ? 'git-editor.sh' : 'git-editor-empty.sh')}"`,
			VSCODE_GIT_EDITOR_NODE: process.execPath,
			VSCODE_GIT_EDITOR_EXTRA_ARGS: '',
			VSCODE_GIT_EDITOR_MAIN: path.join(__dirname, 'git-editor-main.js')
		};
	}

	async handle({ commitMessagePath }: GitEditorRequest): Promise<boolean> {
		if (commitMessagePath) {
			const uri = Uri.file(commitMessagePath);
			const doc = await workspace.openTextDocument(uri);
			await window.showTextDocument(doc, { preview: false });

			return new Promise((c) => {
				const onDidClose = window.tabGroups.onDidChangeTabs(async (tabs) => {
					if (tabs.closed.some(t => t.input instanceof TabInputText && t.input.uri.toString() === uri.toString())) {
						onDidClose.dispose();
						return c(true);
					}
				});
			});
		}

		return Promise.resolve(false);
	}

	getEnv(): { [key: string]: string } {
		const config = workspace.getConfiguration('git');
		return config.get<boolean>('useEditorAsCommitInput') ? this.env : {};
	}

	getTerminalEnv(): { [key: string]: string } {
		const config = workspace.getConfiguration('git');
		return config.get<boolean>('useEditorAsCommitInput') && config.get<boolean>('terminalGitEditor') ? this.env : {};
	}

	dispose(): void {
		this.disposable.dispose();
	}
}

export class GitEditorDocumentLinkProvider implements DocumentLinkProvider {
	private readonly _regex = /^#\s+(modified|new file|deleted|renamed|copied|type change):\s+(?<file1>.*?)(?:\s+->\s+(?<file2>.*))*$/gm;

	constructor(private readonly _model: Model) { }

	provideDocumentLinks(document: TextDocument, token: CancellationToken): DocumentLink[] {
		if (token.isCancellationRequested) {
			return [];
		}

		const repository = this._model.getRepository(document.uri);
		if (!repository) {
			return [];
		}

		const links: DocumentLink[] = [];
		for (const match of document.getText().matchAll(this._regex)) {
			if (!match.groups) {
				continue;
			}

			const { file1, file2 } = match.groups;

			if (file1) {
				links.push(this._createDocumentLink(repository, document, match, file1));
			}
			if (file2) {
				links.push(this._createDocumentLink(repository, document, match, file2));
			}
		}

		return links;
	}

	private _createDocumentLink(repository: Repository, document: TextDocument, match: RegExpExecArray, file: string): DocumentLink {
		const startIndex = match[0].indexOf(file);
		const startPosition = document.positionAt(match.index + startIndex);
		const endPosition = document.positionAt(match.index + startIndex + file.length);

		const documentLink = new DocumentLink(
			new Range(startPosition, endPosition),
			Uri.file(path.join(repository.root, file)));
		documentLink.tooltip = l10n.t('Open File');

		return documentLink;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/historyItemDetailsProvider.ts]---
Location: vscode-main/extensions/git/src/historyItemDetailsProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, Disposable } from 'vscode';
import { AvatarQuery, SourceControlHistoryItemDetailsProvider } from './api/git';
import { Repository } from './repository';
import { ApiRepository } from './api/api1';

export interface ISourceControlHistoryItemDetailsProviderRegistry {
	registerSourceControlHistoryItemDetailsProvider(provider: SourceControlHistoryItemDetailsProvider): Disposable;
	getSourceControlHistoryItemDetailsProviders(): SourceControlHistoryItemDetailsProvider[];
}

export async function provideSourceControlHistoryItemAvatar(
	registry: ISourceControlHistoryItemDetailsProviderRegistry,
	repository: Repository,
	query: AvatarQuery
): Promise<Map<string, string | undefined> | undefined> {
	for (const provider of registry.getSourceControlHistoryItemDetailsProviders()) {
		const result = await provider.provideAvatar(new ApiRepository(repository), query);

		if (result) {
			return result;
		}
	}

	return undefined;
}

export async function provideSourceControlHistoryItemHoverCommands(
	registry: ISourceControlHistoryItemDetailsProviderRegistry,
	repository: Repository
): Promise<Command[] | undefined> {
	for (const provider of registry.getSourceControlHistoryItemDetailsProviders()) {
		const result = await provider.provideHoverCommands(new ApiRepository(repository));

		if (result) {
			return result;
		}
	}

	return undefined;
}

export async function provideSourceControlHistoryItemMessageLinks(
	registry: ISourceControlHistoryItemDetailsProviderRegistry,
	repository: Repository,
	message: string
): Promise<string | undefined> {
	for (const provider of registry.getSourceControlHistoryItemDetailsProviders()) {
		const result = await provider.provideMessageLinks(
			new ApiRepository(repository), message);

		if (result) {
			return result;
		}
	}

	return undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/historyProvider.ts]---
Location: vscode-main/extensions/git/src/historyProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { CancellationToken, Disposable, Event, EventEmitter, FileDecoration, FileDecorationProvider, SourceControlHistoryItem, SourceControlHistoryItemChange, SourceControlHistoryOptions, SourceControlHistoryProvider, ThemeIcon, Uri, window, LogOutputChannel, SourceControlHistoryItemRef, l10n, SourceControlHistoryItemRefsChangeEvent, workspace, ConfigurationChangeEvent, Command, commands } from 'vscode';
import { Repository, Resource } from './repository';
import { IDisposable, deltaHistoryItemRefs, dispose, filterEvent, subject, truncate } from './util';
import { toMultiFileDiffEditorUris } from './uri';
import { AvatarQuery, AvatarQueryCommit, Branch, LogOptions, Ref, RefType } from './api/git';
import { emojify, ensureEmojis } from './emoji';
import { Commit } from './git';
import { OperationKind, OperationResult } from './operation';
import { ISourceControlHistoryItemDetailsProviderRegistry, provideSourceControlHistoryItemAvatar, provideSourceControlHistoryItemHoverCommands, provideSourceControlHistoryItemMessageLinks } from './historyItemDetailsProvider';
import { throttle } from './decorators';
import { getHistoryItemHover, getHoverCommitHashCommands, processHoverRemoteCommands } from './hover';

function compareSourceControlHistoryItemRef(ref1: SourceControlHistoryItemRef, ref2: SourceControlHistoryItemRef): number {
	const getOrder = (ref: SourceControlHistoryItemRef): number => {
		if (ref.id.startsWith('refs/heads/')) {
			return 1;
		} else if (ref.id.startsWith('refs/remotes/')) {
			return 2;
		} else if (ref.id.startsWith('refs/tags/')) {
			return 3;
		}

		return 99;
	};

	const ref1Order = getOrder(ref1);
	const ref2Order = getOrder(ref2);

	if (ref1Order !== ref2Order) {
		return ref1Order - ref2Order;
	}

	return ref1.name.localeCompare(ref2.name);
}

export class GitHistoryProvider implements SourceControlHistoryProvider, FileDecorationProvider, IDisposable {
	private readonly _onDidChangeDecorations = new EventEmitter<Uri[]>();
	readonly onDidChangeFileDecorations: Event<Uri[]> = this._onDidChangeDecorations.event;

	private _currentHistoryItemRef: SourceControlHistoryItemRef | undefined;
	get currentHistoryItemRef(): SourceControlHistoryItemRef | undefined { return this._currentHistoryItemRef; }

	private _currentHistoryItemRemoteRef: SourceControlHistoryItemRef | undefined;
	get currentHistoryItemRemoteRef(): SourceControlHistoryItemRef | undefined { return this._currentHistoryItemRemoteRef; }

	private _currentHistoryItemBaseRef: SourceControlHistoryItemRef | undefined;
	get currentHistoryItemBaseRef(): SourceControlHistoryItemRef | undefined { return this._currentHistoryItemBaseRef; }

	private readonly _onDidChangeCurrentHistoryItemRefs = new EventEmitter<void>();
	readonly onDidChangeCurrentHistoryItemRefs: Event<void> = this._onDidChangeCurrentHistoryItemRefs.event;

	private readonly _onDidChangeHistoryItemRefs = new EventEmitter<SourceControlHistoryItemRefsChangeEvent>();
	readonly onDidChangeHistoryItemRefs: Event<SourceControlHistoryItemRefsChangeEvent> = this._onDidChangeHistoryItemRefs.event;

	private _HEAD: Branch | undefined;
	private _historyItemRefs: SourceControlHistoryItemRef[] = [];

	private commitShortHashLength = 7;
	private historyItemDecorations = new Map<string, FileDecoration>();

	private disposables: Disposable[] = [];

	constructor(
		private historyItemDetailProviderRegistry: ISourceControlHistoryItemDetailsProviderRegistry,
		private readonly repository: Repository,
		private readonly logger: LogOutputChannel
	) {
		this.disposables.push(workspace.onDidChangeConfiguration(this.onDidChangeConfiguration));
		this.onDidChangeConfiguration();

		const onDidRunWriteOperation = filterEvent(repository.onDidRunOperation, e => !e.operation.readOnly);
		this.disposables.push(onDidRunWriteOperation(this.onDidRunWriteOperation, this));

		this.disposables.push(window.registerFileDecorationProvider(this));
	}

	private onDidChangeConfiguration(e?: ConfigurationChangeEvent): void {
		if (e && !e.affectsConfiguration('git.commitShortHashLength')) {
			return;
		}

		const config = workspace.getConfiguration('git', Uri.file(this.repository.root));
		this.commitShortHashLength = config.get<number>('commitShortHashLength', 7);
	}

	@throttle
	private async onDidRunWriteOperation(result: OperationResult): Promise<void> {
		if (!this.repository.HEAD) {
			this.logger.trace('[GitHistoryProvider][onDidRunWriteOperation] repository.HEAD is undefined');
			this._currentHistoryItemRef = this._currentHistoryItemRemoteRef = this._currentHistoryItemBaseRef = undefined;
			this._onDidChangeCurrentHistoryItemRefs.fire();

			return;
		}

		// Refs (alphabetically)
		const historyItemRefs = this.repository.refs
			.map(ref => this.toSourceControlHistoryItemRef(ref))
			.sort((a, b) => a.id.localeCompare(b.id));

		const delta = deltaHistoryItemRefs(this._historyItemRefs, historyItemRefs);
		this._historyItemRefs = historyItemRefs;

		let historyItemRefId = '';
		let historyItemRefName = '';

		switch (this.repository.HEAD.type) {
			case RefType.Head: {
				if (this.repository.HEAD.name !== undefined) {
					// Branch
					historyItemRefId = `refs/heads/${this.repository.HEAD.name}`;
					historyItemRefName = this.repository.HEAD.name;

					// Remote
					if (this.repository.HEAD.upstream) {
						if (this.repository.HEAD.upstream.remote === '.') {
							// Local branch
							this._currentHistoryItemRemoteRef = {
								id: `refs/heads/${this.repository.HEAD.upstream.name}`,
								name: this.repository.HEAD.upstream.name,
								revision: this.repository.HEAD.upstream.commit,
								icon: new ThemeIcon('git-branch')
							};
						} else {
							// Remote branch
							this._currentHistoryItemRemoteRef = {
								id: `refs/remotes/${this.repository.HEAD.upstream.remote}/${this.repository.HEAD.upstream.name}`,
								name: `${this.repository.HEAD.upstream.remote}/${this.repository.HEAD.upstream.name}`,
								revision: this.repository.HEAD.upstream.commit,
								icon: new ThemeIcon('cloud')
							};
						}
					} else {
						this._currentHistoryItemRemoteRef = undefined;
					}

					// Base
					if (this._HEAD?.name !== this.repository.HEAD.name) {
						// Compute base if the branch has changed
						const mergeBase = await this.resolveHEADMergeBase();

						this._currentHistoryItemBaseRef = mergeBase && mergeBase.name && mergeBase.remote &&
							(mergeBase.remote !== this.repository.HEAD.upstream?.remote ||
								mergeBase.name !== this.repository.HEAD.upstream?.name) ? {
							id: `refs/remotes/${mergeBase.remote}/${mergeBase.name}`,
							name: `${mergeBase.remote}/${mergeBase.name}`,
							revision: mergeBase.commit,
							icon: new ThemeIcon('cloud')
						} : undefined;
					} else {
						// Update base revision if it has changed
						const mergeBaseModified = delta.modified
							.find(ref => ref.id === this._currentHistoryItemBaseRef?.id);

						if (this._currentHistoryItemBaseRef && mergeBaseModified) {
							this._currentHistoryItemBaseRef = {
								...this._currentHistoryItemBaseRef,
								revision: mergeBaseModified.revision
							};
						}
					}
				} else {
					// Detached commit
					historyItemRefId = this.repository.HEAD.commit ?? '';
					historyItemRefName = this.repository.HEAD.commit ?? '';

					this._currentHistoryItemRemoteRef = undefined;
					this._currentHistoryItemBaseRef = undefined;
				}
				break;
			}
			case RefType.Tag: {
				// Tag
				historyItemRefId = `refs/tags/${this.repository.HEAD.name}`;
				historyItemRefName = this.repository.HEAD.name ?? this.repository.HEAD.commit ?? '';

				this._currentHistoryItemRemoteRef = undefined;
				this._currentHistoryItemBaseRef = undefined;
				break;
			}
		}

		// Update context keys for HEAD
		if (this._HEAD?.ahead !== this.repository.HEAD?.ahead) {
			commands.executeCommand('setContext', 'git.currentHistoryItemIsAhead', (this.repository.HEAD?.ahead ?? 0) > 0);
		}
		if (this._HEAD?.behind !== this.repository.HEAD?.behind) {
			commands.executeCommand('setContext', 'git.currentHistoryItemIsBehind', (this.repository.HEAD?.behind ?? 0) > 0);
		}

		this._HEAD = this.repository.HEAD;

		this._currentHistoryItemRef = {
			id: historyItemRefId,
			name: historyItemRefName,
			revision: this.repository.HEAD.commit,
			icon: new ThemeIcon('target'),
		};

		this._onDidChangeCurrentHistoryItemRefs.fire();
		this.logger.trace(`[GitHistoryProvider][onDidRunWriteOperation] currentHistoryItemRef: ${JSON.stringify(this._currentHistoryItemRef)}`);
		this.logger.trace(`[GitHistoryProvider][onDidRunWriteOperation] currentHistoryItemRemoteRef: ${JSON.stringify(this._currentHistoryItemRemoteRef)}`);
		this.logger.trace(`[GitHistoryProvider][onDidRunWriteOperation] currentHistoryItemBaseRef: ${JSON.stringify(this._currentHistoryItemBaseRef)}`);

		// Auto-fetch
		const silent = result.operation.kind === OperationKind.Fetch && result.operation.showProgress === false;
		this._onDidChangeHistoryItemRefs.fire({ ...delta, silent });

		const deltaLog = {
			added: delta.added.map(ref => ref.id),
			modified: delta.modified.map(ref => ref.id),
			removed: delta.removed.map(ref => ref.id),
			silent
		};
		this.logger.trace(`[GitHistoryProvider][onDidRunWriteOperation] historyItemRefs: ${JSON.stringify(deltaLog)}`);
	}

	async provideHistoryItemRefs(historyItemRefs: string[] | undefined): Promise<SourceControlHistoryItemRef[]> {
		const refs = await this.repository.getRefs({ pattern: historyItemRefs });

		const branches: SourceControlHistoryItemRef[] = [];
		const remoteBranches: SourceControlHistoryItemRef[] = [];
		const tags: SourceControlHistoryItemRef[] = [];

		for (const ref of refs) {
			switch (ref.type) {
				case RefType.RemoteHead:
					remoteBranches.push(this.toSourceControlHistoryItemRef(ref));
					break;
				case RefType.Tag:
					tags.push(this.toSourceControlHistoryItemRef(ref));
					break;
				default:
					branches.push(this.toSourceControlHistoryItemRef(ref));
					break;
			}
		}

		return [...branches, ...remoteBranches, ...tags];
	}

	async provideHistoryItems(options: SourceControlHistoryOptions, token: CancellationToken): Promise<SourceControlHistoryItem[]> {
		if (!this.currentHistoryItemRef || !options.historyItemRefs) {
			return [];
		}

		// Deduplicate refNames
		const refNames = Array.from(new Set<string>(options.historyItemRefs));

		let logOptions: LogOptions = { refNames, shortStats: true };

		try {
			if (options.limit === undefined || typeof options.limit === 'number') {
				logOptions = { ...logOptions, maxEntries: options.limit ?? 50 };
			} else if (typeof options.limit.id === 'string') {
				// Get the common ancestor commit, and commits
				const commit = await this.repository.getCommit(options.limit.id);
				const commitParentId = commit.parents.length > 0 ? commit.parents[0] : await this.repository.getEmptyTree();

				logOptions = { ...logOptions, range: `${commitParentId}..` };
			}

			if (typeof options.skip === 'number') {
				logOptions = { ...logOptions, skip: options.skip };
			}

			const commits = typeof options.filterText === 'string' && options.filterText !== ''
				? await this._searchHistoryItems(options.filterText.trim(), logOptions, token)
				: await this.repository.log({ ...logOptions, silent: true }, token);

			if (token.isCancellationRequested) {
				return [];
			}

			// Avatars
			const avatarQuery = {
				commits: commits.map(c => ({
					hash: c.hash,
					authorName: c.authorName,
					authorEmail: c.authorEmail
				} satisfies AvatarQueryCommit)),
				size: 20
			} satisfies AvatarQuery;

			const commitAvatars = await provideSourceControlHistoryItemAvatar(
				this.historyItemDetailProviderRegistry, this.repository, avatarQuery);

			const remoteHoverCommands = await provideSourceControlHistoryItemHoverCommands(this.historyItemDetailProviderRegistry, this.repository) ?? [];

			await ensureEmojis();

			const historyItems: SourceControlHistoryItem[] = [];
			for (const commit of commits) {
				const message = emojify(commit.message);
				const messageWithLinks = await provideSourceControlHistoryItemMessageLinks(
					this.historyItemDetailProviderRegistry, this.repository, message) ?? message;

				const avatarUrl = commitAvatars?.get(commit.hash);
				const references = this._resolveHistoryItemRefs(commit);

				const commands: Command[][] = [
					getHoverCommitHashCommands(Uri.file(this.repository.root), commit.hash),
					processHoverRemoteCommands(remoteHoverCommands, commit.hash)
				];

				const tooltip = getHistoryItemHover(avatarUrl, commit.authorName, commit.authorEmail, commit.authorDate ?? commit.commitDate, messageWithLinks, commit.shortStat, commands);

				historyItems.push({
					id: commit.hash,
					parentIds: commit.parents,
					subject: subject(message),
					message: messageWithLinks,
					author: commit.authorName,
					authorEmail: commit.authorEmail,
					authorIcon: avatarUrl ? Uri.parse(avatarUrl) : new ThemeIcon('account'),
					displayId: truncate(commit.hash, this.commitShortHashLength, false),
					timestamp: commit.authorDate?.getTime(),
					statistics: commit.shortStat ?? { files: 0, insertions: 0, deletions: 0 },
					references: references.length !== 0 ? references : undefined,
					tooltip
				} satisfies SourceControlHistoryItem);
			}

			return historyItems;
		} catch (err) {
			this.logger.error(`[GitHistoryProvider][provideHistoryItems] Failed to get history items with options '${JSON.stringify(options)}': ${err}`);
			return [];
		}
	}

	async provideHistoryItemChanges(historyItemId: string, historyItemParentId: string | undefined): Promise<SourceControlHistoryItemChange[]> {
		historyItemParentId = historyItemParentId ?? await this.repository.getEmptyTree();

		const historyItemChangesUri: Uri[] = [];
		const historyItemChanges: SourceControlHistoryItemChange[] = [];
		const changes = await this.repository.diffBetween2(historyItemParentId, historyItemId);

		for (const change of changes) {
			const historyItemUri = change.uri.with({
				query: `ref=${historyItemId}`
			});

			// History item change
			historyItemChanges.push({
				uri: historyItemUri,
				...toMultiFileDiffEditorUris(change, historyItemParentId, historyItemId)
			} satisfies SourceControlHistoryItemChange);

			// History item change decoration
			const letter = Resource.getStatusLetter(change.status);
			const tooltip = Resource.getStatusText(change.status);
			const color = Resource.getStatusColor(change.status);
			const fileDecoration = new FileDecoration(letter, tooltip, color);
			this.historyItemDecorations.set(historyItemUri.toString(), fileDecoration);

			historyItemChangesUri.push(historyItemUri);
		}

		this._onDidChangeDecorations.fire(historyItemChangesUri);
		return historyItemChanges;
	}

	async resolveHistoryItem(historyItemId: string, token: CancellationToken): Promise<SourceControlHistoryItem | undefined> {
		try {
			const commit = await this.repository.getCommit(historyItemId);

			if (!commit || token.isCancellationRequested) {
				return undefined;
			}

			// Avatars
			const avatarQuery = {
				commits: [{
					hash: commit.hash,
					authorName: commit.authorName,
					authorEmail: commit.authorEmail
				} satisfies AvatarQueryCommit],
				size: 20
			} satisfies AvatarQuery;

			const commitAvatars = await provideSourceControlHistoryItemAvatar(
				this.historyItemDetailProviderRegistry, this.repository, avatarQuery);

			await ensureEmojis();

			const message = emojify(commit.message);
			const messageWithLinks = await provideSourceControlHistoryItemMessageLinks(
				this.historyItemDetailProviderRegistry, this.repository, message) ?? message;

			const newLineIndex = message.indexOf('\n');
			const subject = newLineIndex !== -1
				? `${truncate(message, newLineIndex, false)}`
				: message;

			const avatarUrl = commitAvatars?.get(commit.hash);
			const references = this._resolveHistoryItemRefs(commit);

			return {
				id: commit.hash,
				parentIds: commit.parents,
				subject,
				message: messageWithLinks,
				author: commit.authorName,
				authorEmail: commit.authorEmail,
				authorIcon: avatarUrl ? Uri.parse(avatarUrl) : new ThemeIcon('account'),
				displayId: truncate(commit.hash, this.commitShortHashLength, false),
				timestamp: commit.authorDate?.getTime(),
				statistics: commit.shortStat ?? { files: 0, insertions: 0, deletions: 0 },
				references: references.length !== 0 ? references : undefined
			} satisfies SourceControlHistoryItem;
		} catch (err) {
			this.logger.error(`[GitHistoryProvider][resolveHistoryItem] Failed to resolve history item '${historyItemId}': ${err}`);
			return undefined;
		}
	}

	async resolveHistoryItemChatContext(historyItemId: string): Promise<string | undefined> {
		try {
			const changes = await this.repository.showChanges(historyItemId);
			return changes;
		} catch (err) {
			this.logger.error(`[GitHistoryProvider][resolveHistoryItemChatContext] Failed to resolve history item '${historyItemId}': ${err}`);
		}

		return undefined;
	}

	async resolveHistoryItemChangeRangeChatContext(historyItemId: string, historyItemParentId: string, path: string, token: CancellationToken): Promise<string | undefined> {
		try {
			const changes = await this.repository.showChangesBetween(historyItemParentId, historyItemId, path);

			if (token.isCancellationRequested) {
				return undefined;
			}

			return `Output of git log -p ${historyItemParentId}..${historyItemId} -- ${path}:\n\n${changes}`;
		} catch (err) {
			this.logger.error(`[GitHistoryProvider][resolveHistoryItemChangeRangeChatContext] Failed to resolve history item change range '${historyItemId}' for '${path}': ${err}`);
		}

		return undefined;
	}

	async resolveHistoryItemRefsCommonAncestor(historyItemRefs: string[]): Promise<string | undefined> {
		try {
			if (historyItemRefs.length === 0) {
				// TODO@lszomoru - log
				return undefined;
			} else if (historyItemRefs.length === 1 && historyItemRefs[0] === this.currentHistoryItemRef?.id) {
				// Remote
				if (this.currentHistoryItemRemoteRef) {
					const ancestor = await this.repository.getMergeBase(historyItemRefs[0], this.currentHistoryItemRemoteRef.id);
					return ancestor;
				}

				// Base
				if (this.currentHistoryItemBaseRef) {
					const ancestor = await this.repository.getMergeBase(historyItemRefs[0], this.currentHistoryItemBaseRef.id);
					return ancestor;
				}

				// First commit
				const commits = await this.repository.log({ maxParents: 0, refNames: ['HEAD'] });
				if (commits.length > 0) {
					return commits[0].hash;
				}
			} else if (historyItemRefs.length > 1) {
				const ancestor = await this.repository.getMergeBase(historyItemRefs[0], historyItemRefs[1], ...historyItemRefs.slice(2));
				return ancestor;
			}
		}
		catch (err) {
			this.logger.error(`[GitHistoryProvider][resolveHistoryItemRefsCommonAncestor] Failed to resolve common ancestor for ${historyItemRefs.join(',')}: ${err}`);
		}

		return undefined;
	}

	provideFileDecoration(uri: Uri): FileDecoration | undefined {
		return this.historyItemDecorations.get(uri.toString());
	}

	private _resolveHistoryItemRefs(commit: Commit): SourceControlHistoryItemRef[] {
		const references: SourceControlHistoryItemRef[] = [];

		for (const ref of commit.refNames) {
			if (ref === 'refs/remotes/origin/HEAD') {
				continue;
			}

			switch (true) {
				case ref.startsWith('HEAD -> refs/heads/'):
					references.push({
						id: ref.substring('HEAD -> '.length),
						name: ref.substring('HEAD -> refs/heads/'.length),
						revision: commit.hash,
						category: l10n.t('branches'),
						icon: new ThemeIcon('target')
					});
					break;
				case ref.startsWith('refs/heads/'):
					references.push({
						id: ref,
						name: ref.substring('refs/heads/'.length),
						revision: commit.hash,
						category: l10n.t('branches'),
						icon: new ThemeIcon('git-branch')
					});
					break;
				case ref.startsWith('refs/remotes/'):
					references.push({
						id: ref,
						name: ref.substring('refs/remotes/'.length),
						revision: commit.hash,
						category: l10n.t('remote branches'),
						icon: new ThemeIcon('cloud')
					});
					break;
				case ref.startsWith('tag: refs/tags/'):
					references.push({
						id: ref.substring('tag: '.length),
						name: ref.substring('tag: refs/tags/'.length),
						revision: commit.hash,
						category: l10n.t('tags'),
						icon: new ThemeIcon('tag')
					});
					break;
			}
		}

		return references.sort(compareSourceControlHistoryItemRef);
	}

	private async resolveHEADMergeBase(): Promise<Branch | undefined> {
		try {
			if (this.repository.HEAD?.type !== RefType.Head || !this.repository.HEAD?.name) {
				return undefined;
			}

			const mergeBase = await this.repository.getBranchBase(this.repository.HEAD.name);
			return mergeBase;
		} catch (err) {
			this.logger.error(`[GitHistoryProvider][resolveHEADMergeBase] Failed to resolve merge base for ${this.repository.HEAD?.name}: ${err}`);
			return undefined;
		}
	}

	private async _searchHistoryItems(filterText: string, options: LogOptions, token: CancellationToken): Promise<Commit[]> {
		if (token.isCancellationRequested) {
			return [];
		}

		const commits = new Map<string, Commit>();

		// Search by author and commit message in parallel
		const [authorResults, grepResults] = await Promise.all([
			this.repository.log({ ...options, refNames: undefined, author: filterText, silent: true }, token),
			this.repository.log({ ...options, refNames: undefined, grep: filterText, silent: true }, token)
		]);

		for (const commit of [...authorResults, ...grepResults]) {
			if (!commits.has(commit.hash)) {
				commits.set(commit.hash, commit);
			}
		}

		return Array.from(commits.values()).slice(0, options.maxEntries ?? 50);
	}

	private toSourceControlHistoryItemRef(ref: Ref): SourceControlHistoryItemRef {
		switch (ref.type) {
			case RefType.RemoteHead:
				return {
					id: `refs/remotes/${ref.name}`,
					name: ref.name ?? '',
					description: ref.commit ? l10n.t('Remote branch at {0}', truncate(ref.commit, this.commitShortHashLength, false)) : undefined,
					revision: ref.commit,
					icon: new ThemeIcon('cloud'),
					category: l10n.t('remote branches')
				};
			case RefType.Tag:
				return {
					id: `refs/tags/${ref.name}`,
					name: ref.name ?? '',
					description: ref.commit ? l10n.t('Tag at {0}', truncate(ref.commit, this.commitShortHashLength, false)) : undefined,
					revision: ref.commit,
					icon: new ThemeIcon('tag'),
					category: l10n.t('tags')
				};
			default:
				return {
					id: `refs/heads/${ref.name}`,
					name: ref.name ?? '',
					description: ref.commit ? truncate(ref.commit, this.commitShortHashLength, false) : undefined,
					revision: ref.commit,
					icon: new ThemeIcon('git-branch'),
					category: l10n.t('branches')
				};
		}
	}

	dispose(): void {
		dispose(this.disposables);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/hover.ts]---
Location: vscode-main/extensions/git/src/hover.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command, l10n, MarkdownString, Uri } from 'vscode';
import { fromNow, getCommitShortHash } from './util';
import { emojify } from './emoji';
import { CommitShortStat } from './git';

export const AVATAR_SIZE = 20;

export function getCommitHover(authorAvatar: string | undefined, authorName: string | undefined, authorEmail: string | undefined, authorDate: Date | number | undefined, message: string, shortStats: CommitShortStat | undefined, commands: Command[][] | undefined): MarkdownString {
	const markdownString = new MarkdownString('', true);
	markdownString.isTrusted = {
		enabledCommands: commands?.flat().map(c => c.command) ?? []
	};

	// Author, Subject | Message (escape image syntax)
	appendContent(markdownString, authorAvatar, authorName, authorEmail, authorDate, message);

	// Short stats
	if (shortStats) {
		appendShortStats(markdownString, shortStats);
	}

	// Commands
	if (commands && commands.length > 0) {
		appendCommands(markdownString, commands);
	}

	return markdownString;
}

export function getHistoryItemHover(authorAvatar: string | undefined, authorName: string | undefined, authorEmail: string | undefined, authorDate: Date | number | undefined, message: string, shortStats: CommitShortStat | undefined, commands: Command[][] | undefined): MarkdownString[] {
	const hoverContent: MarkdownString[] = [];

	// Author, Subject | Message (escape image syntax)
	const authorMarkdownString = new MarkdownString('', true);
	appendContent(authorMarkdownString, authorAvatar, authorName, authorEmail, authorDate, message);
	hoverContent.push(authorMarkdownString);

	// Short stats
	if (shortStats) {
		const shortStatsMarkdownString = new MarkdownString('', true);
		shortStatsMarkdownString.supportHtml = true;
		appendShortStats(shortStatsMarkdownString, shortStats);
		hoverContent.push(shortStatsMarkdownString);
	}

	// Commands
	if (commands && commands.length > 0) {
		const commandsMarkdownString = new MarkdownString('', true);
		commandsMarkdownString.isTrusted = {
			enabledCommands: commands?.flat().map(c => c.command) ?? []
		};
		appendCommands(commandsMarkdownString, commands);
		hoverContent.push(commandsMarkdownString);
	}

	return hoverContent;
}

function appendContent(markdownString: MarkdownString, authorAvatar: string | undefined, authorName: string | undefined, authorEmail: string | undefined, authorDate: Date | number | undefined, message: string): void {
	// Author
	if (authorName) {
		// Avatar
		if (authorAvatar) {
			markdownString.appendMarkdown('![');
			markdownString.appendText(authorName);
			markdownString.appendMarkdown('](');
			markdownString.appendText(authorAvatar);
			markdownString.appendMarkdown(`|width=${AVATAR_SIZE},height=${AVATAR_SIZE})`);
		} else {
			markdownString.appendMarkdown('$(account)');
		}

		// Email
		if (authorEmail) {
			markdownString.appendMarkdown(' [**');
			markdownString.appendText(authorName);
			markdownString.appendMarkdown('**](mailto:');
			markdownString.appendText(authorEmail);
			markdownString.appendMarkdown(')');
		} else {
			markdownString.appendMarkdown(' **');
			markdownString.appendText(authorName);
			markdownString.appendMarkdown('**');
		}

		// Date
		if (authorDate && !isNaN(new Date(authorDate).getTime())) {
			const dateString = new Date(authorDate).toLocaleString(undefined, {
				year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
			});

			markdownString.appendMarkdown(', $(history)');
			markdownString.appendText(` ${fromNow(authorDate, true, true)} (${dateString})`);
		}

		markdownString.appendMarkdown('\n\n');
	}

	// Subject | Message (escape image syntax)
	markdownString.appendMarkdown(`${emojify(message.replace(/!\[/g, '&#33;&#91;').replace(/\r\n|\r|\n/g, '\n\n'))}`);
	markdownString.appendMarkdown(`\n\n---\n\n`);
}

function appendShortStats(markdownString: MarkdownString, shortStats: { files: number; insertions: number; deletions: number }): void {
	// Short stats
	markdownString.appendMarkdown(`<span>${shortStats.files === 1 ?
		l10n.t('{0} file changed', shortStats.files) :
		l10n.t('{0} files changed', shortStats.files)}</span>`);

	if (shortStats.insertions) {
		markdownString.appendMarkdown(`,&nbsp;<span style="color:var(--vscode-scmGraph-historyItemHoverAdditionsForeground);">${shortStats.insertions === 1 ?
			l10n.t('{0} insertion{1}', shortStats.insertions, '(+)') :
			l10n.t('{0} insertions{1}', shortStats.insertions, '(+)')}</span>`);
	}

	if (shortStats.deletions) {
		markdownString.appendMarkdown(`,&nbsp;<span style="color:var(--vscode-scmGraph-historyItemHoverDeletionsForeground);">${shortStats.deletions === 1 ?
			l10n.t('{0} deletion{1}', shortStats.deletions, '(-)') :
			l10n.t('{0} deletions{1}', shortStats.deletions, '(-)')}</span>`);
	}

	markdownString.appendMarkdown(`\n\n---\n\n`);
}

function appendCommands(markdownString: MarkdownString, commands: Command[][]): void {
	for (let index = 0; index < commands.length; index++) {
		if (index !== 0) {
			markdownString.appendMarkdown('&nbsp;&nbsp;|&nbsp;&nbsp;');
		}

		const commandsMarkdown = commands[index]
			.map(command => `[${command.title}](command:${command.command}?${encodeURIComponent(JSON.stringify(command.arguments))} "${command.tooltip}")`);
		markdownString.appendMarkdown(commandsMarkdown.join('&nbsp;'));
	}
}

export function getHoverCommitHashCommands(documentUri: Uri, hash: string): Command[] {
	return [{
		title: `$(git-commit) ${getCommitShortHash(documentUri, hash)}`,
		tooltip: l10n.t('Open Commit'),
		command: 'git.viewCommit',
		arguments: [documentUri, hash, documentUri]
	}, {
		title: `$(copy)`,
		tooltip: l10n.t('Copy Commit Hash'),
		command: 'git.copyContentToClipboard',
		arguments: [hash]
	}] satisfies Command[];
}

export function processHoverRemoteCommands(commands: Command[], hash: string): Command[] {
	return commands.map(command => ({
		...command,
		arguments: [...command.arguments ?? [], hash]
	} satisfies Command));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/git/src/main.ts]---
Location: vscode-main/extensions/git/src/main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { env, ExtensionContext, workspace, window, Disposable, commands, Uri, version as vscodeVersion, WorkspaceFolder, LogOutputChannel, l10n, LogLevel, languages } from 'vscode';
import { findGit, Git, IGit } from './git';
import { Model } from './model';
import { CommandCenter } from './commands';
import { GitFileSystemProvider } from './fileSystemProvider';
import { GitDecorations } from './decorationProvider';
import { Askpass } from './askpass';
import { toDisposable, filterEvent, eventToPromise } from './util';
import TelemetryReporter from '@vscode/extension-telemetry';
import { GitExtension } from './api/git';
import { GitProtocolHandler } from './protocolHandler';
import { GitExtensionImpl } from './api/extension';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { GitTimelineProvider } from './timelineProvider';
import { registerAPICommands } from './api/api1';
import { TerminalEnvironmentManager, TerminalShellExecutionManager } from './terminal';
import { createIPCServer, IPCServer } from './ipc/ipcServer';
import { GitEditor, GitEditorDocumentLinkProvider } from './gitEditor';
import { GitPostCommitCommandsProvider } from './postCommitCommands';
import { GitEditSessionIdentityProvider } from './editSessionIdentityProvider';
import { GitCommitInputBoxCodeActionsProvider, GitCommitInputBoxDiagnosticsManager } from './diagnostics';
import { GitBlameController } from './blame';
import { CloneManager } from './cloneManager';

const deactivateTasks: { (): Promise<void> }[] = [];

export async function deactivate(): Promise<void> {
	for (const task of deactivateTasks) {
		await task();
	}
}

async function createModel(context: ExtensionContext, logger: LogOutputChannel, telemetryReporter: TelemetryReporter, disposables: Disposable[]): Promise<{ model: Model; cloneManager: CloneManager }> {
	const pathValue = workspace.getConfiguration('git').get<string | string[]>('path');
	let pathHints = Array.isArray(pathValue) ? pathValue : pathValue ? [pathValue] : [];

	const { isTrusted, workspaceFolders = [] } = workspace;
	const excludes = isTrusted ? [] : workspaceFolders.map(f => path.normalize(f.uri.fsPath).replace(/[\r\n]+$/, ''));

	if (!isTrusted && pathHints.length !== 0) {
		// Filter out any non-absolute paths
		pathHints = pathHints.filter(p => path.isAbsolute(p));
	}

	const info = await findGit(pathHints, gitPath => {
		logger.info(l10n.t('[main] Validating found git in: "{0}"', gitPath));
		if (excludes.length === 0) {
			return true;
		}

		const normalized = path.normalize(gitPath).replace(/[\r\n]+$/, '');
		const skip = excludes.some(e => normalized.startsWith(e));
		if (skip) {
			logger.info(l10n.t('[main] Skipped found git in: "{0}"', gitPath));
		}
		return !skip;
	}, logger);

	let ipcServer: IPCServer | undefined = undefined;

	try {
		ipcServer = await createIPCServer(context.storagePath);
	} catch (err) {
		logger.error(`[main] Failed to create git IPC: ${err}`);
	}

	const askpass = new Askpass(ipcServer, logger);
	disposables.push(askpass);

	const gitEditor = new GitEditor(ipcServer);
	disposables.push(gitEditor);

	const environment = { ...askpass.getEnv(), ...gitEditor.getEnv(), ...ipcServer?.getEnv() };
	const terminalEnvironmentManager = new TerminalEnvironmentManager(context, [askpass, gitEditor, ipcServer]);
	disposables.push(terminalEnvironmentManager);

	logger.info(l10n.t('[main] Using git "{0}" from "{1}"', info.version, info.path));

	const git = new Git({
		gitPath: info.path,
		userAgent: `git/${info.version} (${os.version() ?? os.type()} ${os.release()}; ${os.platform()} ${os.arch()}) vscode/${vscodeVersion} (${env.appName})`,
		version: info.version,
		env: environment,
	});
	const model = new Model(git, askpass, context.globalState, context.workspaceState, logger, telemetryReporter);
	disposables.push(model);
	const cloneManager = new CloneManager(model, telemetryReporter, model.repositoryCache);

	const onRepository = () => commands.executeCommand('setContext', 'gitOpenRepositoryCount', `${model.repositories.length}`);
	model.onDidOpenRepository(onRepository, null, disposables);
	model.onDidCloseRepository(onRepository, null, disposables);
	onRepository();

	const onOutput = (str: string) => {
		const lines = str.split(/\r?\n/mg);

		while (/^\s*$/.test(lines[lines.length - 1])) {
			lines.pop();
		}

		logger.appendLine(lines.join('\n'));
	};
	git.onOutput.addListener('log', onOutput);
	disposables.push(toDisposable(() => git.onOutput.removeListener('log', onOutput)));

	const cc = new CommandCenter(git, model, context.globalState, logger, telemetryReporter, cloneManager);
	disposables.push(
		cc,
		new GitFileSystemProvider(model, logger),
		new GitDecorations(model),
		new GitBlameController(model),
		new GitTimelineProvider(model, cc),
		new GitEditSessionIdentityProvider(model),
		new TerminalShellExecutionManager(model, logger)
	);

	const postCommitCommandsProvider = new GitPostCommitCommandsProvider(model);
	model.registerPostCommitCommandsProvider(postCommitCommandsProvider);

	const diagnosticsManager = new GitCommitInputBoxDiagnosticsManager(model);
	disposables.push(diagnosticsManager);

	const codeActionsProvider = new GitCommitInputBoxCodeActionsProvider(diagnosticsManager);
	disposables.push(codeActionsProvider);

	const gitEditorDocumentLinkProvider = languages.registerDocumentLinkProvider('git-commit', new GitEditorDocumentLinkProvider(model));
	disposables.push(gitEditorDocumentLinkProvider);

	checkGitVersion(info);
	commands.executeCommand('setContext', 'gitVersion2.35', git.compareGitVersionTo('2.35') >= 0);

	return { model, cloneManager };
}

async function isGitRepository(folder: WorkspaceFolder): Promise<boolean> {
	if (folder.uri.scheme !== 'file') {
		return false;
	}

	const dotGit = path.join(folder.uri.fsPath, '.git');

	try {
		const dotGitStat = await new Promise<fs.Stats>((c, e) => fs.stat(dotGit, (err, stat) => err ? e(err) : c(stat)));
		return dotGitStat.isDirectory();
	} catch (err) {
		return false;
	}
}

async function warnAboutMissingGit(): Promise<void> {
	const config = workspace.getConfiguration('git');
	const shouldIgnore = config.get<boolean>('ignoreMissingGitWarning') === true;

	if (shouldIgnore) {
		return;
	}

	if (!workspace.workspaceFolders) {
		return;
	}

	const areGitRepositories = await Promise.all(workspace.workspaceFolders.map(isGitRepository));

	if (areGitRepositories.every(isGitRepository => !isGitRepository)) {
		return;
	}

	const download = l10n.t('Download Git');
	const neverShowAgain = l10n.t('Don\'t Show Again');
	const choice = await window.showWarningMessage(
		l10n.t('Git not found. Install it or configure it using the "git.path" setting.'),
		download,
		neverShowAgain
	);

	if (choice === download) {
		commands.executeCommand('vscode.open', Uri.parse('https://aka.ms/vscode-download-git'));
	} else if (choice === neverShowAgain) {
		await config.update('ignoreMissingGitWarning', true, true);
	}
}

export async function _activate(context: ExtensionContext): Promise<GitExtensionImpl> {
	const disposables: Disposable[] = [];
	context.subscriptions.push(new Disposable(() => Disposable.from(...disposables).dispose()));

	const logger = window.createOutputChannel('Git', { log: true });
	disposables.push(logger);

	const onDidChangeLogLevel = (logLevel: LogLevel) => {
		logger.appendLine(l10n.t('[main] Log level: {0}', LogLevel[logLevel]));
	};
	disposables.push(logger.onDidChangeLogLevel(onDidChangeLogLevel));
	onDidChangeLogLevel(logger.logLevel);

	const { aiKey } = require('../package.json') as { aiKey: string };
	const telemetryReporter = new TelemetryReporter(aiKey);
	deactivateTasks.push(() => telemetryReporter.dispose());

	const config = workspace.getConfiguration('git', null);
	const enabled = config.get<boolean>('enabled');

	if (!enabled) {
		const onConfigChange = filterEvent(workspace.onDidChangeConfiguration, e => e.affectsConfiguration('git'));
		const onEnabled = filterEvent(onConfigChange, () => workspace.getConfiguration('git', null).get<boolean>('enabled') === true);
		const result = new GitExtensionImpl();

		eventToPromise(onEnabled).then(async () => {
			const { model, cloneManager } = await createModel(context, logger, telemetryReporter, disposables);
			result.model = model;
			result.cloneManager = cloneManager;
		});
		return result;
	}

	try {
		const { model, cloneManager } = await createModel(context, logger, telemetryReporter, disposables);

		return new GitExtensionImpl({ model, cloneManager });
	} catch (err) {
		console.warn(err.message);
		logger.warn(`[main] Failed to create model: ${err}`);

		if (!/Git installation not found/.test(err.message || '')) {
			throw err;
		}

		/* __GDPR__
			"git.missing" : {
				"owner": "lszomoru"
			}
		*/
		telemetryReporter.sendTelemetryEvent('git.missing');

		commands.executeCommand('setContext', 'git.missing', true);
		warnAboutMissingGit();

		return new GitExtensionImpl();
	} finally {
		disposables.push(new GitProtocolHandler(logger));
	}
}

let _context: ExtensionContext;
export function getExtensionContext(): ExtensionContext {
	return _context;
}

export async function activate(context: ExtensionContext): Promise<GitExtension> {
	_context = context;

	const result = await _activate(context);
	context.subscriptions.push(registerAPICommands(result));
	return result;
}

async function checkGitv1(info: IGit): Promise<void> {
	const config = workspace.getConfiguration('git');
	const shouldIgnore = config.get<boolean>('ignoreLegacyWarning') === true;

	if (shouldIgnore) {
		return;
	}

	if (!/^[01]/.test(info.version)) {
		return;
	}

	const update = l10n.t('Update Git');
	const neverShowAgain = l10n.t('Don\'t Show Again');

	const choice = await window.showWarningMessage(
		l10n.t('You seem to have git "{0}" installed. Code works best with git >= 2', info.version),
		update,
		neverShowAgain
	);

	if (choice === update) {
		commands.executeCommand('vscode.open', Uri.parse('https://aka.ms/vscode-download-git'));
	} else if (choice === neverShowAgain) {
		await config.update('ignoreLegacyWarning', true, true);
	}
}

async function checkGitWindows(info: IGit): Promise<void> {
	if (!/^2\.(25|26)\./.test(info.version)) {
		return;
	}

	const config = workspace.getConfiguration('git');
	const shouldIgnore = config.get<boolean>('ignoreWindowsGit27Warning') === true;

	if (shouldIgnore) {
		return;
	}

	const update = l10n.t('Update Git');
	const neverShowAgain = l10n.t('Don\'t Show Again');
	const choice = await window.showWarningMessage(
		l10n.t('There are known issues with the installed Git "{0}". Please update to Git >= 2.27 for the git features to work correctly.', info.version),
		update,
		neverShowAgain
	);

	if (choice === update) {
		commands.executeCommand('vscode.open', Uri.parse('https://aka.ms/vscode-download-git'));
	} else if (choice === neverShowAgain) {
		await config.update('ignoreWindowsGit27Warning', true, true);
	}
}

async function checkGitVersion(info: IGit): Promise<void> {
	await checkGitv1(info);

	if (process.platform === 'win32') {
		await checkGitWindows(info);
	}
}
```

--------------------------------------------------------------------------------

````

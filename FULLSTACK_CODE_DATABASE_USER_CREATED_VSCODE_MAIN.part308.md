---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 308
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 308 of 552)

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

---[FILE: src/vs/workbench/api/common/extHostComments.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostComments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asPromise } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { debounce } from '../../../base/common/decorators.js';
import { Emitter } from '../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IRange } from '../../../editor/common/core/range.js';
import * as languages from '../../../editor/common/languages.js';
import { ExtensionIdentifierMap, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import * as extHostTypeConverter from './extHostTypeConverters.js';
import * as types from './extHostTypes.js';
import type * as vscode from 'vscode';
import { ExtHostCommentsShape, IMainContext, MainContext, CommentThreadChanges, CommentChanges } from './extHost.protocol.js';
import { ExtHostCommands } from './extHostCommands.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { MarshalledCommentThread } from '../../common/comments.js';

type ProviderHandle = number;

interface ExtHostComments {
	createCommentController(extension: IExtensionDescription, id: string, label: string): vscode.CommentController;
}

export function createExtHostComments(mainContext: IMainContext, commands: ExtHostCommands, documents: ExtHostDocuments): ExtHostCommentsShape & ExtHostComments {
	const proxy = mainContext.getProxy(MainContext.MainThreadComments);

	class ExtHostCommentsImpl implements ExtHostCommentsShape, ExtHostComments {

		private static handlePool = 0;


		private _commentControllers: Map<ProviderHandle, ExtHostCommentController> = new Map<ProviderHandle, ExtHostCommentController>();

		private _commentControllersByExtension: ExtensionIdentifierMap<ExtHostCommentController[]> = new ExtensionIdentifierMap<ExtHostCommentController[]>();


		constructor(
		) {
			commands.registerArgumentProcessor({
				processArgument: arg => {
					if (arg && arg.$mid === MarshalledId.CommentController) {
						const commentController = this._commentControllers.get(arg.handle);

						if (!commentController) {
							return arg;
						}

						return commentController.value;
					} else if (arg && arg.$mid === MarshalledId.CommentThread) {
						const marshalledCommentThread: MarshalledCommentThread = arg;
						const commentController = this._commentControllers.get(marshalledCommentThread.commentControlHandle);

						if (!commentController) {
							return marshalledCommentThread;
						}

						const commentThread = commentController.getCommentThread(marshalledCommentThread.commentThreadHandle);

						if (!commentThread) {
							return marshalledCommentThread;
						}

						return commentThread.value;
					} else if (arg && (arg.$mid === MarshalledId.CommentThreadReply || arg.$mid === MarshalledId.CommentThreadInstance)) {
						const commentController = this._commentControllers.get(arg.thread.commentControlHandle);

						if (!commentController) {
							return arg;
						}

						const commentThread = commentController.getCommentThread(arg.thread.commentThreadHandle);

						if (!commentThread) {
							return arg;
						}

						if (arg.$mid === MarshalledId.CommentThreadInstance) {
							return commentThread.value;
						}

						return {
							thread: commentThread.value,
							text: arg.text
						};
					} else if (arg && arg.$mid === MarshalledId.CommentNode) {
						const commentController = this._commentControllers.get(arg.thread.commentControlHandle);

						if (!commentController) {
							return arg;
						}

						const commentThread = commentController.getCommentThread(arg.thread.commentThreadHandle);

						if (!commentThread) {
							return arg;
						}

						const commentUniqueId = arg.commentUniqueId;

						const comment = commentThread.getCommentByUniqueId(commentUniqueId);

						if (!comment) {
							return arg;
						}

						return comment;

					} else if (arg && arg.$mid === MarshalledId.CommentThreadNode) {
						const commentController = this._commentControllers.get(arg.thread.commentControlHandle);

						if (!commentController) {
							return arg;
						}

						const commentThread = commentController.getCommentThread(arg.thread.commentThreadHandle);

						if (!commentThread) {
							return arg;
						}

						const body: string = arg.text;
						const commentUniqueId = arg.commentUniqueId;

						const comment = commentThread.getCommentByUniqueId(commentUniqueId);

						if (!comment) {
							return arg;
						}

						// If the old comment body was a markdown string, use a markdown string here too.
						if (typeof comment.body === 'string') {
							comment.body = body;
						} else {
							comment.body = new types.MarkdownString(body);
						}
						return comment;
					}

					return arg;
				}
			});
		}

		createCommentController(extension: IExtensionDescription, id: string, label: string): vscode.CommentController {
			const handle = ExtHostCommentsImpl.handlePool++;
			const commentController = new ExtHostCommentController(extension, handle, id, label);
			this._commentControllers.set(commentController.handle, commentController);

			const commentControllers = this._commentControllersByExtension.get(extension.identifier) || [];
			commentControllers.push(commentController);
			this._commentControllersByExtension.set(extension.identifier, commentControllers);

			return commentController.value;
		}

		async $createCommentThreadTemplate(commentControllerHandle: number, uriComponents: UriComponents, range: IRange | undefined, editorId?: string): Promise<void> {
			const commentController = this._commentControllers.get(commentControllerHandle);

			if (!commentController) {
				return;
			}

			commentController.$createCommentThreadTemplate(uriComponents, range, editorId);
		}

		async $setActiveComment(controllerHandle: number, commentInfo: { commentThreadHandle: number; uniqueIdInThread?: number }): Promise<void> {
			const commentController = this._commentControllers.get(controllerHandle);

			if (!commentController) {
				return;
			}

			commentController.$setActiveComment(commentInfo ?? undefined);
		}

		async $updateCommentThreadTemplate(commentControllerHandle: number, threadHandle: number, range: IRange) {
			const commentController = this._commentControllers.get(commentControllerHandle);

			if (!commentController) {
				return;
			}

			commentController.$updateCommentThreadTemplate(threadHandle, range);
		}

		$deleteCommentThread(commentControllerHandle: number, commentThreadHandle: number) {
			const commentController = this._commentControllers.get(commentControllerHandle);

			commentController?.$deleteCommentThread(commentThreadHandle);
		}

		async $updateCommentThread(commentControllerHandle: number, commentThreadHandle: number, changes: CommentThreadChanges) {
			const commentController = this._commentControllers.get(commentControllerHandle);

			commentController?.$updateCommentThread(commentThreadHandle, changes);
		}

		async $provideCommentingRanges(commentControllerHandle: number, uriComponents: UriComponents, token: CancellationToken): Promise<{ ranges: IRange[]; fileComments: boolean } | undefined> {
			const commentController = this._commentControllers.get(commentControllerHandle);

			if (!commentController || !commentController.commentingRangeProvider) {
				return Promise.resolve(undefined);
			}

			const document = await documents.ensureDocumentData(URI.revive(uriComponents));
			return asPromise(async () => {
				const rangesResult = await commentController.commentingRangeProvider?.provideCommentingRanges(document.document, token);
				let ranges: { ranges: vscode.Range[]; fileComments: boolean } | undefined;
				if (Array.isArray(rangesResult)) {
					ranges = {
						ranges: rangesResult,
						fileComments: false
					};
				} else if (rangesResult) {
					ranges = {
						ranges: rangesResult.ranges || [],
						fileComments: rangesResult.enableFileComments || false
					};
				} else {
					ranges = rangesResult ?? undefined;
				}
				return ranges;
			}).then(ranges => {
				let convertedResult: { ranges: IRange[]; fileComments: boolean } | undefined = undefined;
				if (ranges) {
					convertedResult = {
						ranges: ranges.ranges.map(x => extHostTypeConverter.Range.from(x)),
						fileComments: ranges.fileComments
					};
				}
				return convertedResult;
			});
		}

		$toggleReaction(commentControllerHandle: number, threadHandle: number, uri: UriComponents, comment: languages.Comment, reaction: languages.CommentReaction): Promise<void> {
			const commentController = this._commentControllers.get(commentControllerHandle);

			if (!commentController || !commentController.reactionHandler) {
				return Promise.resolve(undefined);
			}

			return asPromise(() => {
				const commentThread = commentController.getCommentThread(threadHandle);
				if (commentThread) {
					const vscodeComment = commentThread.getCommentByUniqueId(comment.uniqueIdInThread);

					if (commentController !== undefined && vscodeComment) {
						if (commentController.reactionHandler) {
							return commentController.reactionHandler(vscodeComment, convertFromReaction(reaction));
						}
					}
				}

				return Promise.resolve(undefined);
			});
		}
	}
	type CommentThreadModification = Partial<{
		range: vscode.Range;
		label: string | undefined;
		contextValue: string | undefined;
		comments: vscode.Comment[];
		collapsibleState: vscode.CommentThreadCollapsibleState;
		canReply: boolean | vscode.CommentAuthorInformation;
		state: vscode.CommentThreadState;
		isTemplate: boolean;
		applicability: vscode.CommentThreadApplicability;
	}>;

	class ExtHostCommentThread implements vscode.CommentThread2 {
		private static _handlePool: number = 0;
		readonly handle = ExtHostCommentThread._handlePool++;
		public commentHandle: number = 0;

		private modifications: CommentThreadModification = Object.create(null);

		set threadId(id: string) {
			this._id = id;
		}

		get threadId(): string {
			return this._id!;
		}

		get id(): string {
			return this._id!;
		}

		get resource(): vscode.Uri {
			return this._uri;
		}

		get uri(): vscode.Uri {
			return this._uri;
		}

		private readonly _onDidUpdateCommentThread = new Emitter<void>();
		readonly onDidUpdateCommentThread = this._onDidUpdateCommentThread.event;

		set range(range: vscode.Range | undefined) {
			if (((range === undefined) !== (this._range === undefined)) || (!range || !this._range || !range.isEqual(this._range))) {
				this._range = range;
				this.modifications.range = range;
				this._onDidUpdateCommentThread.fire();
			}
		}

		get range(): vscode.Range | undefined {
			return this._range;
		}

		private _canReply: boolean | vscode.CommentAuthorInformation = true;

		set canReply(state: boolean | vscode.CommentAuthorInformation) {
			if (this._canReply !== state) {
				this._canReply = state;
				this.modifications.canReply = state;
				this._onDidUpdateCommentThread.fire();
			}
		}
		get canReply() {
			return this._canReply;
		}

		private _label: string | undefined;

		get label(): string | undefined {
			return this._label;
		}

		set label(label: string | undefined) {
			this._label = label;
			this.modifications.label = label;
			this._onDidUpdateCommentThread.fire();
		}

		private _contextValue: string | undefined;

		get contextValue(): string | undefined {
			return this._contextValue;
		}

		set contextValue(context: string | undefined) {
			this._contextValue = context;
			this.modifications.contextValue = context;
			this._onDidUpdateCommentThread.fire();
		}

		get comments(): vscode.Comment[] {
			return this._comments;
		}

		set comments(newComments: vscode.Comment[]) {
			this._comments = newComments;
			this.modifications.comments = newComments;
			this._onDidUpdateCommentThread.fire();
		}

		private _collapseState?: vscode.CommentThreadCollapsibleState;

		get collapsibleState(): vscode.CommentThreadCollapsibleState {
			return this._collapseState!;
		}

		set collapsibleState(newState: vscode.CommentThreadCollapsibleState) {
			if (this._collapseState === newState) {
				return;
			}
			this._collapseState = newState;
			this.modifications.collapsibleState = newState;
			this._onDidUpdateCommentThread.fire();
		}

		private _state?: vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability };

		get state(): vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability } | undefined {
			return this._state!;
		}

		set state(newState: vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability }) {
			this._state = newState;
			if (typeof newState === 'object') {
				checkProposedApiEnabled(this.extensionDescription, 'commentThreadApplicability');
				this.modifications.state = newState.resolved;
				this.modifications.applicability = newState.applicability;
			} else {
				this.modifications.state = newState;
			}
			this._onDidUpdateCommentThread.fire();
		}

		private _localDisposables: types.Disposable[];

		private _isDiposed: boolean;

		public get isDisposed(): boolean {
			return this._isDiposed;
		}

		private _commentsMap: Map<vscode.Comment, number> = new Map<vscode.Comment, number>();

		private readonly _acceptInputDisposables = new MutableDisposable<DisposableStore>();

		readonly value: vscode.CommentThread2;

		constructor(
			commentControllerId: string,
			private _commentControllerHandle: number,
			private _id: string | undefined,
			private _uri: vscode.Uri,
			private _range: vscode.Range | undefined,
			private _comments: vscode.Comment[],
			public readonly extensionDescription: IExtensionDescription,
			private _isTemplate: boolean,
			editorId?: string
		) {
			this._acceptInputDisposables.value = new DisposableStore();

			if (this._id === undefined) {
				this._id = `${commentControllerId}.${this.handle}`;
			}

			proxy.$createCommentThread(
				_commentControllerHandle,
				this.handle,
				this._id,
				this._uri,
				extHostTypeConverter.Range.from(this._range),
				this._comments.map(cmt => convertToDTOComment(this, cmt, this._commentsMap, this.extensionDescription)),
				extensionDescription.identifier,
				this._isTemplate,
				editorId
			);

			this._localDisposables = [];
			this._isDiposed = false;

			this._localDisposables.push(this.onDidUpdateCommentThread(() => {
				this.eventuallyUpdateCommentThread();
			}));

			this._localDisposables.push({
				dispose: () => {
					proxy.$deleteCommentThread(
						_commentControllerHandle,
						this.handle
					);
				}
			});

			const that = this;
			this.value = {
				get uri() { return that.uri; },
				get range() { return that.range; },
				set range(value: vscode.Range | undefined) { that.range = value; },
				get comments() { return that.comments; },
				set comments(value: vscode.Comment[]) { that.comments = value; },
				get collapsibleState() { return that.collapsibleState; },
				set collapsibleState(value: vscode.CommentThreadCollapsibleState) { that.collapsibleState = value; },
				get canReply() { return that.canReply; },
				set canReply(state: boolean | vscode.CommentAuthorInformation) { that.canReply = state; },
				get contextValue() { return that.contextValue; },
				set contextValue(value: string | undefined) { that.contextValue = value; },
				get label() { return that.label; },
				set label(value: string | undefined) { that.label = value; },
				get state(): vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability } | undefined { return that.state; },
				set state(value: vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability }) { that.state = value; },
				reveal: (comment?: vscode.Comment | vscode.CommentThreadRevealOptions, options?: vscode.CommentThreadRevealOptions) => that.reveal(comment, options),
				hide: () => that.hide(),
				dispose: () => {
					that.dispose();
				}
			};
		}

		private updateIsTemplate() {
			if (this._isTemplate) {
				this._isTemplate = false;
				this.modifications.isTemplate = false;
			}
		}

		@debounce(100)
		eventuallyUpdateCommentThread(): void {
			if (this._isDiposed) {
				return;
			}
			this.updateIsTemplate();

			if (!this._acceptInputDisposables.value) {
				this._acceptInputDisposables.value = new DisposableStore();
			}

			const modified = (value: keyof CommentThreadModification): boolean =>
				Object.prototype.hasOwnProperty.call(this.modifications, value);

			const formattedModifications: CommentThreadChanges = {};
			if (modified('range')) {
				formattedModifications.range = extHostTypeConverter.Range.from(this._range);
			}
			if (modified('label')) {
				formattedModifications.label = this.label;
			}
			if (modified('contextValue')) {
				/*
				 * null -> cleared contextValue
				 * undefined -> no change
				 */
				formattedModifications.contextValue = this.contextValue ?? null;
			}
			if (modified('comments')) {
				formattedModifications.comments =
					this._comments.map(cmt => convertToDTOComment(this, cmt, this._commentsMap, this.extensionDescription));
			}
			if (modified('collapsibleState')) {
				formattedModifications.collapseState = convertToCollapsibleState(this._collapseState);
			}
			if (modified('canReply')) {
				formattedModifications.canReply = this.canReply;
			}
			if (modified('state')) {
				formattedModifications.state = convertToState(this._state);
			}
			if (modified('applicability')) {
				formattedModifications.applicability = convertToRelevance(this._state);
			}
			if (modified('isTemplate')) {
				formattedModifications.isTemplate = this._isTemplate;
			}
			this.modifications = {};

			proxy.$updateCommentThread(
				this._commentControllerHandle,
				this.handle,
				this._id!,
				this._uri,
				formattedModifications
			);
		}

		getCommentByUniqueId(uniqueId: number): vscode.Comment | undefined {
			for (const key of this._commentsMap) {
				const comment = key[0];
				const id = key[1];
				if (uniqueId === id) {
					return comment;
				}
			}

			return;
		}

		async reveal(commentOrOptions?: vscode.Comment | vscode.CommentThreadRevealOptions, options?: vscode.CommentThreadRevealOptions): Promise<void> {
			checkProposedApiEnabled(this.extensionDescription, 'commentReveal');
			let comment: vscode.Comment | undefined;
			if (commentOrOptions && (commentOrOptions as vscode.Comment).body !== undefined) {
				comment = commentOrOptions as vscode.Comment;
			} else {
				options = options ?? commentOrOptions as vscode.CommentThreadRevealOptions;
			}
			let commentToReveal = comment ? this._commentsMap.get(comment) : undefined;
			commentToReveal ??= this._commentsMap.get(this._comments[0])!;
			let preserveFocus: boolean = true;
			let focusReply: boolean = false;
			if (options?.focus === types.CommentThreadFocus.Reply) {
				focusReply = true;
				preserveFocus = false;
			} else if (options?.focus === types.CommentThreadFocus.Comment) {
				preserveFocus = false;
			}
			return proxy.$revealCommentThread(this._commentControllerHandle, this.handle, commentToReveal, { preserveFocus, focusReply });
		}

		async hide(): Promise<void> {
			return proxy.$hideCommentThread(this._commentControllerHandle, this.handle);
		}

		dispose() {
			this._isDiposed = true;
			this._acceptInputDisposables.dispose();
			this._localDisposables.forEach(disposable => disposable.dispose());
		}
	}

	type ReactionHandler = (comment: vscode.Comment, reaction: vscode.CommentReaction) => Promise<void>;

	class ExtHostCommentController {
		get id(): string {
			return this._id;
		}

		get label(): string {
			return this._label;
		}

		public get handle(): number {
			return this._handle;
		}

		private _threads: Map<number, ExtHostCommentThread> = new Map<number, ExtHostCommentThread>();

		private _commentingRangeProvider?: vscode.CommentingRangeProvider;
		get commentingRangeProvider(): vscode.CommentingRangeProvider | undefined {
			return this._commentingRangeProvider;
		}

		set commentingRangeProvider(provider: vscode.CommentingRangeProvider | undefined) {
			this._commentingRangeProvider = provider;
			if (provider?.resourceHints) {
				checkProposedApiEnabled(this._extension, 'commentingRangeHint');
			}
			proxy.$updateCommentingRanges(this.handle, provider?.resourceHints);
		}

		private _reactionHandler?: ReactionHandler;

		get reactionHandler(): ReactionHandler | undefined {
			return this._reactionHandler;
		}

		set reactionHandler(handler: ReactionHandler | undefined) {
			this._reactionHandler = handler;

			proxy.$updateCommentControllerFeatures(this.handle, { reactionHandler: !!handler });
		}

		private _options: languages.CommentOptions | undefined;

		get options() {
			return this._options;
		}

		set options(options: languages.CommentOptions | undefined) {
			this._options = options;

			proxy.$updateCommentControllerFeatures(this.handle, { options: this._options });
		}

		private _activeComment: vscode.Comment | undefined;

		get activeComment(): vscode.Comment | undefined {
			checkProposedApiEnabled(this._extension, 'activeComment');
			return this._activeComment;
		}

		private _activeThread: ExtHostCommentThread | undefined;

		get activeCommentThread(): vscode.CommentThread2 | undefined {
			checkProposedApiEnabled(this._extension, 'activeComment');
			return this._activeThread?.value;
		}

		private _localDisposables: types.Disposable[];
		readonly value: vscode.CommentController;

		constructor(
			private _extension: IExtensionDescription,
			private _handle: number,
			private _id: string,
			private _label: string
		) {
			proxy.$registerCommentController(this.handle, _id, _label, this._extension.identifier.value);

			const that = this;
			this.value = Object.freeze({
				id: that.id,
				label: that.label,
				get options() { return that.options; },
				set options(options: vscode.CommentOptions | undefined) { that.options = options; },
				get commentingRangeProvider(): vscode.CommentingRangeProvider | undefined { return that.commentingRangeProvider; },
				set commentingRangeProvider(commentingRangeProvider: vscode.CommentingRangeProvider | undefined) { that.commentingRangeProvider = commentingRangeProvider; },
				get reactionHandler(): ReactionHandler | undefined { return that.reactionHandler; },
				set reactionHandler(handler: ReactionHandler | undefined) { that.reactionHandler = handler; },
				// get activeComment(): vscode.Comment | undefined { return that.activeComment; },
				get activeCommentThread(): vscode.CommentThread | undefined { return that.activeCommentThread as vscode.CommentThread | undefined; },
				createCommentThread(uri: vscode.Uri, range: vscode.Range | undefined, comments: vscode.Comment[]): vscode.CommentThread {
					return that.createCommentThread(uri, range, comments).value as vscode.CommentThread;
				},
				dispose: () => { that.dispose(); },
			});

			this._localDisposables = [];
			this._localDisposables.push({
				dispose: () => {
					proxy.$unregisterCommentController(this.handle);
				}
			});
		}

		createCommentThread(resource: vscode.Uri, range: vscode.Range | undefined, comments: vscode.Comment[]): ExtHostCommentThread {
			const commentThread = new ExtHostCommentThread(this.id, this.handle, undefined, resource, range, comments, this._extension, false);
			this._threads.set(commentThread.handle, commentThread);
			return commentThread;
		}

		$setActiveComment(commentInfo: { commentThreadHandle: number; uniqueIdInThread?: number } | undefined) {
			if (!commentInfo) {
				this._activeComment = undefined;
				this._activeThread = undefined;
				return;
			}
			const thread = this._threads.get(commentInfo.commentThreadHandle);
			if (thread) {
				this._activeComment = commentInfo.uniqueIdInThread ? thread.getCommentByUniqueId(commentInfo.uniqueIdInThread) : undefined;
				this._activeThread = thread;
			}
		}

		$createCommentThreadTemplate(uriComponents: UriComponents, range: IRange | undefined, editorId?: string): ExtHostCommentThread {
			const commentThread = new ExtHostCommentThread(this.id, this.handle, undefined, URI.revive(uriComponents), extHostTypeConverter.Range.to(range), [], this._extension, true, editorId);
			commentThread.collapsibleState = languages.CommentThreadCollapsibleState.Expanded;
			this._threads.set(commentThread.handle, commentThread);
			return commentThread;
		}

		$updateCommentThreadTemplate(threadHandle: number, range: IRange): void {
			const thread = this._threads.get(threadHandle);
			if (thread) {
				thread.range = extHostTypeConverter.Range.to(range);
			}
		}

		$updateCommentThread(threadHandle: number, changes: CommentThreadChanges): void {
			const thread = this._threads.get(threadHandle);
			if (!thread) {
				return;
			}

			const modified = (value: keyof CommentThreadChanges): boolean =>
				Object.prototype.hasOwnProperty.call(changes, value);

			if (modified('collapseState')) {
				thread.collapsibleState = convertToCollapsibleState(changes.collapseState);
			}
		}

		$deleteCommentThread(threadHandle: number): void {
			const thread = this._threads.get(threadHandle);

			thread?.dispose();

			this._threads.delete(threadHandle);
		}

		getCommentThread(handle: number): ExtHostCommentThread | undefined {
			return this._threads.get(handle);
		}

		dispose(): void {
			this._threads.forEach(value => {
				value.dispose();
			});

			this._localDisposables.forEach(disposable => disposable.dispose());
		}
	}

	function convertToDTOComment(thread: ExtHostCommentThread, vscodeComment: vscode.Comment, commentsMap: Map<vscode.Comment, number>, extension: IExtensionDescription): CommentChanges {
		let commentUniqueId = commentsMap.get(vscodeComment)!;
		if (!commentUniqueId) {
			commentUniqueId = ++thread.commentHandle;
			commentsMap.set(vscodeComment, commentUniqueId);
		}

		if (vscodeComment.state !== undefined) {
			checkProposedApiEnabled(extension, 'commentsDraftState');
		}

		if (vscodeComment.reactions?.some(reaction => reaction.reactors !== undefined)) {
			checkProposedApiEnabled(extension, 'commentReactor');
		}

		return {
			mode: vscodeComment.mode,
			contextValue: vscodeComment.contextValue,
			uniqueIdInThread: commentUniqueId,
			body: (typeof vscodeComment.body === 'string') ? vscodeComment.body : extHostTypeConverter.MarkdownString.from(vscodeComment.body),
			userName: vscodeComment.author.name,
			userIconPath: vscodeComment.author.iconPath,
			label: vscodeComment.label,
			commentReactions: vscodeComment.reactions ? vscodeComment.reactions.map(reaction => convertToReaction(reaction)) : undefined,
			state: vscodeComment.state,
			timestamp: vscodeComment.timestamp?.toJSON()
		};
	}

	function convertToReaction(reaction: vscode.CommentReaction): languages.CommentReaction {
		return {
			label: reaction.label,
			iconPath: reaction.iconPath ? extHostTypeConverter.pathOrURIToURI(reaction.iconPath) : undefined,
			count: reaction.count,
			hasReacted: reaction.authorHasReacted,
			reactors: ((reaction.reactors && (reaction.reactors.length > 0) && (typeof reaction.reactors[0] !== 'string')) ? (reaction.reactors as languages.CommentAuthorInformation[]).map(reactor => reactor.name) : reaction.reactors) as string[]
		};
	}

	function convertFromReaction(reaction: languages.CommentReaction): vscode.CommentReaction {
		return {
			label: reaction.label || '',
			count: reaction.count || 0,
			iconPath: reaction.iconPath ? URI.revive(reaction.iconPath) : '',
			authorHasReacted: reaction.hasReacted || false,
			reactors: reaction.reactors?.map(reactor => ({ name: reactor }))
		};
	}

	function convertToCollapsibleState(kind: vscode.CommentThreadCollapsibleState | undefined): languages.CommentThreadCollapsibleState {
		if (kind !== undefined) {
			switch (kind) {
				case types.CommentThreadCollapsibleState.Expanded:
					return languages.CommentThreadCollapsibleState.Expanded;
				case types.CommentThreadCollapsibleState.Collapsed:
					return languages.CommentThreadCollapsibleState.Collapsed;
			}
		}
		return languages.CommentThreadCollapsibleState.Collapsed;
	}

	function convertToState(kind: vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability } | undefined): languages.CommentThreadState {
		let resolvedKind: vscode.CommentThreadState | undefined;
		if (typeof kind === 'object') {
			resolvedKind = kind.resolved;
		} else {
			resolvedKind = kind;
		}

		if (resolvedKind !== undefined) {
			switch (resolvedKind) {
				case types.CommentThreadState.Unresolved:
					return languages.CommentThreadState.Unresolved;
				case types.CommentThreadState.Resolved:
					return languages.CommentThreadState.Resolved;
			}
		}
		return languages.CommentThreadState.Unresolved;
	}

	function convertToRelevance(kind: vscode.CommentThreadState | { resolved?: vscode.CommentThreadState; applicability?: vscode.CommentThreadApplicability } | undefined): languages.CommentThreadApplicability {
		let applicabilityKind: vscode.CommentThreadApplicability | undefined = undefined;
		if (typeof kind === 'object') {
			applicabilityKind = kind.applicability;
		}

		if (applicabilityKind !== undefined) {
			switch (applicabilityKind) {
				case types.CommentThreadApplicability.Current:
					return languages.CommentThreadApplicability.Current;
				case types.CommentThreadApplicability.Outdated:
					return languages.CommentThreadApplicability.Outdated;
			}
		}
		return languages.CommentThreadApplicability.Current;
	}

	return new ExtHostCommentsImpl();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostConfiguration.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mixin, deepClone } from '../../../base/common/objects.js';
import { Event, Emitter } from '../../../base/common/event.js';
import type * as vscode from 'vscode';
import { ExtHostWorkspace, IExtHostWorkspace } from './extHostWorkspace.js';
import { ExtHostConfigurationShape, MainThreadConfigurationShape, IConfigurationInitData, MainContext } from './extHost.protocol.js';
import { ConfigurationTarget as ExtHostConfigurationTarget } from './extHostTypes.js';
import { ConfigurationTarget, IConfigurationChange, IConfigurationData, IConfigurationOverrides } from '../../../platform/configuration/common/configuration.js';
import { Configuration, ConfigurationChangeEvent } from '../../../platform/configuration/common/configurationModels.js';
import { ConfigurationScope, OVERRIDE_PROPERTY_REGEX } from '../../../platform/configuration/common/configurationRegistry.js';
import { isObject } from '../../../base/common/types.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { Barrier } from '../../../base/common/async.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { Workspace } from '../../../platform/workspace/common/workspace.js';
import { URI } from '../../../base/common/uri.js';

function lookUp(tree: unknown, key: string) {
	if (key) {
		const parts = key.split('.');
		let node = tree;
		for (let i = 0; node && i < parts.length; i++) {
			node = (node as Record<string, unknown>)[parts[i]];
		}
		return node;
	}
	return undefined;
}

export type ConfigurationInspect<T> = {
	key: string;

	defaultValue?: T;
	globalLocalValue?: T;
	globalRemoteValue?: T;
	globalValue?: T;
	workspaceValue?: T;
	workspaceFolderValue?: T;

	defaultLanguageValue?: T;
	globalLocalLanguageValue?: T;
	globalRemoteLanguageValue?: T;
	globalLanguageValue?: T;
	workspaceLanguageValue?: T;
	workspaceFolderLanguageValue?: T;

	languageIds?: string[];
};

function isUri(thing: unknown): thing is vscode.Uri {
	return thing instanceof URI;
}

function isResourceLanguage(thing: unknown): thing is { uri: URI; languageId: string } {
	return isObject(thing)
		&& (thing as Record<string, unknown>).uri instanceof URI
		&& !!(thing as Record<string, unknown>).languageId
		&& typeof (thing as Record<string, unknown>).languageId === 'string';
}

function isLanguage(thing: unknown): thing is { languageId: string } {
	return isObject(thing)
		&& !(thing as Record<string, unknown>).uri
		&& !!(thing as Record<string, unknown>).languageId
		&& typeof (thing as Record<string, unknown>).languageId === 'string';
}

function isWorkspaceFolder(thing: unknown): thing is vscode.WorkspaceFolder {
	return isObject(thing)
		&& (thing as Record<string, unknown>).uri instanceof URI
		&& (!(thing as Record<string, unknown>).name || typeof (thing as Record<string, unknown>).name === 'string')
		&& (!(thing as Record<string, unknown>).index || typeof (thing as Record<string, unknown>).index === 'number');
}

function scopeToOverrides(scope: vscode.ConfigurationScope | undefined | null): IConfigurationOverrides | undefined {
	if (isUri(scope)) {
		return { resource: scope };
	}
	if (isResourceLanguage(scope)) {
		return { resource: scope.uri, overrideIdentifier: scope.languageId };
	}
	if (isLanguage(scope)) {
		return { overrideIdentifier: scope.languageId };
	}
	if (isWorkspaceFolder(scope)) {
		return { resource: scope.uri };
	}
	if (scope === null) {
		return { resource: null };
	}
	return undefined;
}

export class ExtHostConfiguration implements ExtHostConfigurationShape {

	readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadConfigurationShape;
	private readonly _logService: ILogService;
	private readonly _extHostWorkspace: ExtHostWorkspace;
	private readonly _barrier: Barrier;
	private _actual: ExtHostConfigProvider | null;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostWorkspace extHostWorkspace: IExtHostWorkspace,
		@ILogService logService: ILogService,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadConfiguration);
		this._extHostWorkspace = extHostWorkspace;
		this._logService = logService;
		this._barrier = new Barrier();
		this._actual = null;
	}

	public getConfigProvider(): Promise<ExtHostConfigProvider> {
		return this._barrier.wait().then(_ => this._actual!);
	}

	$initializeConfiguration(data: IConfigurationInitData): void {
		this._actual = new ExtHostConfigProvider(this._proxy, this._extHostWorkspace, data, this._logService);
		this._barrier.open();
	}

	$acceptConfigurationChanged(data: IConfigurationInitData, change: IConfigurationChange): void {
		this.getConfigProvider().then(provider => provider.$acceptConfigurationChanged(data, change));
	}
}

export class ExtHostConfigProvider {

	private readonly _onDidChangeConfiguration = new Emitter<vscode.ConfigurationChangeEvent>();
	private readonly _proxy: MainThreadConfigurationShape;
	private readonly _extHostWorkspace: ExtHostWorkspace;
	private _configurationScopes: Map<string, ConfigurationScope | undefined>;
	private _configuration: Configuration;
	private _logService: ILogService;

	constructor(proxy: MainThreadConfigurationShape, extHostWorkspace: ExtHostWorkspace, data: IConfigurationInitData, logService: ILogService) {
		this._proxy = proxy;
		this._logService = logService;
		this._extHostWorkspace = extHostWorkspace;
		this._configuration = Configuration.parse(data, logService);
		this._configurationScopes = this._toMap(data.configurationScopes);
	}

	get onDidChangeConfiguration(): Event<vscode.ConfigurationChangeEvent> {
		return this._onDidChangeConfiguration && this._onDidChangeConfiguration.event;
	}

	$acceptConfigurationChanged(data: IConfigurationInitData, change: IConfigurationChange) {
		const previous = { data: this._configuration.toData(), workspace: this._extHostWorkspace.workspace };
		this._configuration = Configuration.parse(data, this._logService);
		this._configurationScopes = this._toMap(data.configurationScopes);
		this._onDidChangeConfiguration.fire(this._toConfigurationChangeEvent(change, previous));
	}

	getConfiguration(section?: string, scope?: vscode.ConfigurationScope | null, extensionDescription?: IExtensionDescription): vscode.WorkspaceConfiguration {
		const overrides = scopeToOverrides(scope) || {};
		const config = this._toReadonlyValue(this._configuration.getValue(section, overrides, this._extHostWorkspace.workspace));

		if (section) {
			this._validateConfigurationAccess(section, overrides, extensionDescription?.identifier);
		}

		function parseConfigurationTarget(arg: boolean | ExtHostConfigurationTarget): ConfigurationTarget | null {
			if (arg === undefined || arg === null) {
				return null;
			}
			if (typeof arg === 'boolean') {
				return arg ? ConfigurationTarget.USER : ConfigurationTarget.WORKSPACE;
			}

			switch (arg) {
				case ExtHostConfigurationTarget.Global: return ConfigurationTarget.USER;
				case ExtHostConfigurationTarget.Workspace: return ConfigurationTarget.WORKSPACE;
				case ExtHostConfigurationTarget.WorkspaceFolder: return ConfigurationTarget.WORKSPACE_FOLDER;
			}
		}

		const result: vscode.WorkspaceConfiguration = {
			has(key: string): boolean {
				return typeof lookUp(config, key) !== 'undefined';
			},
			get: <T>(key: string, defaultValue?: T) => {
				this._validateConfigurationAccess(section ? `${section}.${key}` : key, overrides, extensionDescription?.identifier);
				let result: unknown = lookUp(config, key);
				if (typeof result === 'undefined') {
					result = defaultValue;
				} else {
					let clonedConfig: unknown | undefined = undefined;
					const cloneOnWriteProxy = (target: unknown, accessor: string): unknown => {
						if (isObject(target)) {
							let clonedTarget: unknown | undefined = undefined;
							const cloneTarget = () => {
								clonedConfig = clonedConfig ? clonedConfig : deepClone(config);
								clonedTarget = clonedTarget ? clonedTarget : lookUp(clonedConfig, accessor);
							};
							return new Proxy(target, {
								get: (target: Record<string, unknown>, property: PropertyKey) => {
									if (typeof property === 'string' && property.toLowerCase() === 'tojson') {
										cloneTarget();
										return () => clonedTarget;
									}
									if (clonedConfig) {
										clonedTarget = clonedTarget ? clonedTarget : lookUp(clonedConfig, accessor);
										return (clonedTarget as Record<PropertyKey, unknown>)[property];
									}
									const result = (target as Record<PropertyKey, unknown>)[property];
									if (typeof property === 'string') {
										return cloneOnWriteProxy(result, `${accessor}.${property}`);
									}
									return result;
								},
								set: (_target: Record<string, unknown>, property: PropertyKey, value: unknown) => {
									cloneTarget();
									if (clonedTarget) {
										(clonedTarget as Record<PropertyKey, unknown>)[property] = value;
									}
									return true;
								},
								deleteProperty: (_target: Record<string, unknown>, property: PropertyKey) => {
									cloneTarget();
									if (clonedTarget) {
										delete (clonedTarget as Record<PropertyKey, unknown>)[property];
									}
									return true;
								},
								defineProperty: (_target: Record<string, unknown>, property: PropertyKey, descriptor: PropertyDescriptor) => {
									cloneTarget();
									if (clonedTarget) {
										Object.defineProperty(clonedTarget as Record<string, unknown>, property, descriptor);
									}
									return true;
								}
							});
						}
						if (Array.isArray(target)) {
							return deepClone(target);
						}
						return target;
					};
					result = cloneOnWriteProxy(result, key);
				}
				return result;
			},
			update: (key: string, value: unknown, extHostConfigurationTarget: ExtHostConfigurationTarget | boolean, scopeToLanguage?: boolean) => {
				key = section ? `${section}.${key}` : key;
				const target = parseConfigurationTarget(extHostConfigurationTarget);
				if (value !== undefined) {
					return this._proxy.$updateConfigurationOption(target, key, value, overrides, scopeToLanguage);
				} else {
					return this._proxy.$removeConfigurationOption(target, key, overrides, scopeToLanguage);
				}
			},
			inspect: <T>(key: string): ConfigurationInspect<T> | undefined => {
				key = section ? `${section}.${key}` : key;
				const config = this._configuration.inspect<T>(key, overrides, this._extHostWorkspace.workspace);
				if (config) {
					return {
						key,

						defaultValue: deepClone(config.policy?.value ?? config.default?.value),
						globalLocalValue: deepClone(config.userLocal?.value),
						globalRemoteValue: deepClone(config.userRemote?.value),
						globalValue: deepClone(config.user?.value ?? config.application?.value),
						workspaceValue: deepClone(config.workspace?.value),
						workspaceFolderValue: deepClone(config.workspaceFolder?.value),

						defaultLanguageValue: deepClone(config.default?.override),
						globalLocalLanguageValue: deepClone(config.userLocal?.override),
						globalRemoteLanguageValue: deepClone(config.userRemote?.override),
						globalLanguageValue: deepClone(config.user?.override ?? config.application?.override),
						workspaceLanguageValue: deepClone(config.workspace?.override),
						workspaceFolderLanguageValue: deepClone(config.workspaceFolder?.override),

						languageIds: deepClone(config.overrideIdentifiers)
					};
				}
				return undefined;
			}
		};

		if (typeof config === 'object') {
			mixin(result, config, false);
		}

		return Object.freeze(result);
	}

	private _toReadonlyValue(result: unknown): unknown {
		const readonlyProxy = (target: unknown): unknown => {
			return isObject(target) ?
				new Proxy(target, {
					get: (target: Record<string, unknown>, property: PropertyKey) => readonlyProxy((target as Record<PropertyKey, unknown>)[property]),
					set: (_target: Record<string, unknown>, property: PropertyKey, _value: unknown) => { throw new Error(`TypeError: Cannot assign to read only property '${String(property)}' of object`); },
					deleteProperty: (_target: Record<string, unknown>, property: PropertyKey) => { throw new Error(`TypeError: Cannot delete read only property '${String(property)}' of object`); },
					defineProperty: (_target: Record<string, unknown>, property: PropertyKey) => { throw new Error(`TypeError: Cannot define property '${String(property)}' for a readonly object`); },
					setPrototypeOf: (_target: unknown) => { throw new Error(`TypeError: Cannot set prototype for a readonly object`); },
					isExtensible: () => false,
					preventExtensions: () => true
				}) : target;
		};
		return readonlyProxy(result);
	}

	private _validateConfigurationAccess(key: string, overrides?: IConfigurationOverrides, extensionId?: ExtensionIdentifier): void {
		const scope = OVERRIDE_PROPERTY_REGEX.test(key) ? ConfigurationScope.RESOURCE : this._configurationScopes.get(key);
		const extensionIdText = extensionId ? `[${extensionId.value}] ` : '';
		if (ConfigurationScope.RESOURCE === scope) {
			if (typeof overrides?.resource === 'undefined') {
				this._logService.warn(`${extensionIdText}Accessing a resource scoped configuration without providing a resource is not expected. To get the effective value for '${key}', provide the URI of a resource or 'null' for any resource.`);
			}
			return;
		}
		if (ConfigurationScope.WINDOW === scope) {
			if (overrides?.resource) {
				this._logService.warn(`${extensionIdText}Accessing a window scoped configuration for a resource is not expected. To associate '${key}' to a resource, define its scope to 'resource' in configuration contributions in 'package.json'.`);
			}
			return;
		}
	}

	private _toConfigurationChangeEvent(change: IConfigurationChange, previous: { data: IConfigurationData; workspace: Workspace | undefined }): vscode.ConfigurationChangeEvent {
		const event = new ConfigurationChangeEvent(change, previous, this._configuration, this._extHostWorkspace.workspace, this._logService);
		return Object.freeze({
			affectsConfiguration: (section: string, scope?: vscode.ConfigurationScope) => event.affectsConfiguration(section, scopeToOverrides(scope))
		});
	}

	private _toMap(scopes: [string, ConfigurationScope | undefined][]): Map<string, ConfigurationScope | undefined> {
		return scopes.reduce((result, scope) => { result.set(scope[0], scope[1]); return result; }, new Map<string, ConfigurationScope | undefined>());
	}

}

export const IExtHostConfiguration = createDecorator<IExtHostConfiguration>('IExtHostConfiguration');
export interface IExtHostConfiguration extends ExtHostConfiguration { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostConsoleForwarder.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostConsoleForwarder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStackArgument } from '../../../base/common/console.js';
import { safeStringify } from '../../../base/common/objects.js';
import { MainContext, MainThreadConsoleShape } from './extHost.protocol.js';
import { IExtHostInitDataService } from './extHostInitDataService.js';
import { IExtHostRpcService } from './extHostRpcService.js';

export abstract class AbstractExtHostConsoleForwarder {

	private readonly _mainThreadConsole: MainThreadConsoleShape;
	private readonly _includeStack: boolean;
	private readonly _logNative: boolean;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
	) {
		this._mainThreadConsole = extHostRpc.getProxy(MainContext.MainThreadConsole);
		this._includeStack = initData.consoleForward.includeStack;
		this._logNative = initData.consoleForward.logNative;

		// Pass console logging to the outside so that we have it in the main side if told so
		this._wrapConsoleMethod('info', 'log');
		this._wrapConsoleMethod('log', 'log');
		this._wrapConsoleMethod('warn', 'warn');
		this._wrapConsoleMethod('debug', 'debug');
		this._wrapConsoleMethod('error', 'error');
	}

	/**
	 * Wraps a console message so that it is transmitted to the renderer. If
	 * native logging is turned on, the original console message will be written
	 * as well. This is needed since the console methods are "magic" in V8 and
	 * are the only methods that allow later introspection of logged variables.
	 *
	 * The wrapped property is not defined with `writable: false` to avoid
	 * throwing errors, but rather a no-op setting. See https://github.com/microsoft/vscode-extension-telemetry/issues/88
	 */
	private _wrapConsoleMethod(method: 'log' | 'info' | 'warn' | 'error' | 'debug', severity: 'log' | 'warn' | 'error' | 'debug') {
		const that = this;
		const original = console[method];

		Object.defineProperty(console, method, {
			set: () => { },
			get: () => function () {
				that._handleConsoleCall(method, severity, original, arguments);
			},
		});
	}

	private _handleConsoleCall(method: 'log' | 'info' | 'warn' | 'error' | 'debug', severity: 'log' | 'warn' | 'error' | 'debug', original: (...args: any[]) => void, args: IArguments): void {
		this._mainThreadConsole.$logExtensionHostMessage({
			type: '__$console',
			severity,
			arguments: safeStringifyArgumentsToArray(args, this._includeStack)
		});
		if (this._logNative) {
			this._nativeConsoleLogMessage(method, original, args);
		}
	}

	protected abstract _nativeConsoleLogMessage(method: 'log' | 'info' | 'warn' | 'error' | 'debug', original: (...args: any[]) => void, args: IArguments): void;

}

const MAX_LENGTH = 100000;

/**
 * Prevent circular stringify and convert arguments to real array
 */
function safeStringifyArgumentsToArray(args: IArguments, includeStack: boolean): string {
	const argsArray = [];

	// Massage some arguments with special treatment
	if (args.length) {
		for (let i = 0; i < args.length; i++) {
			let arg = args[i];

			// Any argument of type 'undefined' needs to be specially treated because
			// JSON.stringify will simply ignore those. We replace them with the string
			// 'undefined' which is not 100% right, but good enough to be logged to console
			if (typeof arg === 'undefined') {
				arg = 'undefined';
			}

			// Any argument that is an Error will be changed to be just the error stack/message
			// itself because currently cannot serialize the error over entirely.
			else if (arg instanceof Error) {
				const errorObj = arg;
				if (errorObj.stack) {
					arg = errorObj.stack;
				} else {
					arg = errorObj.toString();
				}
			}

			argsArray.push(arg);
		}
	}

	// Add the stack trace as payload if we are told so. We remove the message and the 2 top frames
	// to start the stacktrace where the console message was being written
	if (includeStack) {
		const stack = new Error().stack;
		if (stack) {
			argsArray.push({ __$stack: stack.split('\n').slice(3).join('\n') } satisfies IStackArgument);
		}
	}

	try {
		const res = safeStringify(argsArray);

		if (res.length > MAX_LENGTH) {
			return 'Output omitted for a large object that exceeds the limits';
		}

		return res;
	} catch (error) {
		return `Output omitted for an object that cannot be inspected ('${error.toString()}')`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostCustomEditors.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostCustomEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { hash } from '../../../base/common/hash.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { IExtensionStoragePaths } from './extHostStoragePaths.js';
import * as typeConverters from './extHostTypeConverters.js';
import { ExtHostWebviews, shouldSerializeBuffersForPostMessage, toExtensionData } from './extHostWebview.js';
import { ExtHostWebviewPanels } from './extHostWebviewPanels.js';
import { EditorGroupColumn } from '../../services/editor/common/editorGroupColumn.js';
import type * as vscode from 'vscode';
import { Cache } from './cache.js';
import * as extHostProtocol from './extHost.protocol.js';
import * as extHostTypes from './extHostTypes.js';


class CustomDocumentStoreEntry {

	private _backupCounter = 1;

	constructor(
		public readonly document: vscode.CustomDocument,
		private readonly _storagePath: URI | undefined,
	) { }

	private readonly _edits = new Cache<vscode.CustomDocumentEditEvent>('custom documents');

	private _backup?: vscode.CustomDocumentBackup;

	addEdit(item: vscode.CustomDocumentEditEvent): number {
		return this._edits.add([item]);
	}

	async undo(editId: number, isDirty: boolean): Promise<void> {
		await this.getEdit(editId).undo();
		if (!isDirty) {
			this.disposeBackup();
		}
	}

	async redo(editId: number, isDirty: boolean): Promise<void> {
		await this.getEdit(editId).redo();
		if (!isDirty) {
			this.disposeBackup();
		}
	}

	disposeEdits(editIds: number[]): void {
		for (const id of editIds) {
			this._edits.delete(id);
		}
	}

	getNewBackupUri(): URI {
		if (!this._storagePath) {
			throw new Error('Backup requires a valid storage path');
		}
		const fileName = hashPath(this.document.uri) + (this._backupCounter++);
		return joinPath(this._storagePath, fileName);
	}

	updateBackup(backup: vscode.CustomDocumentBackup): void {
		this._backup?.delete();
		this._backup = backup;
	}

	disposeBackup(): void {
		this._backup?.delete();
		this._backup = undefined;
	}

	private getEdit(editId: number): vscode.CustomDocumentEditEvent {
		const edit = this._edits.get(editId, 0);
		if (!edit) {
			throw new Error('No edit found');
		}
		return edit;
	}
}

class CustomDocumentStore {
	private readonly _documents = new Map<string, CustomDocumentStoreEntry>();

	public get(viewType: string, resource: vscode.Uri): CustomDocumentStoreEntry | undefined {
		return this._documents.get(this.key(viewType, resource));
	}

	public add(viewType: string, document: vscode.CustomDocument, storagePath: URI | undefined): CustomDocumentStoreEntry {
		const key = this.key(viewType, document.uri);
		if (this._documents.has(key)) {
			throw new Error(`Document already exists for viewType:${viewType} resource:${document.uri}`);
		}
		const entry = new CustomDocumentStoreEntry(document, storagePath);
		this._documents.set(key, entry);
		return entry;
	}

	public delete(viewType: string, document: vscode.CustomDocument) {
		const key = this.key(viewType, document.uri);
		this._documents.delete(key);
	}

	private key(viewType: string, resource: vscode.Uri): string {
		return `${viewType}@@@${resource}`;
	}
}

const enum CustomEditorType {
	Text,
	Custom
}

type ProviderEntry = {
	readonly extension: IExtensionDescription;
	readonly type: CustomEditorType.Text;
	readonly provider: vscode.CustomTextEditorProvider;
} | {
	readonly extension: IExtensionDescription;
	readonly type: CustomEditorType.Custom;
	readonly provider: vscode.CustomReadonlyEditorProvider;
};

class EditorProviderStore {
	private readonly _providers = new Map<string, ProviderEntry>();

	public addTextProvider(viewType: string, extension: IExtensionDescription, provider: vscode.CustomTextEditorProvider): vscode.Disposable {
		return this.add(viewType, { type: CustomEditorType.Text, extension, provider });
	}

	public addCustomProvider(viewType: string, extension: IExtensionDescription, provider: vscode.CustomReadonlyEditorProvider): vscode.Disposable {
		return this.add(viewType, { type: CustomEditorType.Custom, extension, provider });
	}

	public get(viewType: string): ProviderEntry | undefined {
		return this._providers.get(viewType);
	}

	private add(viewType: string, entry: ProviderEntry): vscode.Disposable {
		if (this._providers.has(viewType)) {
			throw new Error(`Provider for viewType:${viewType} already registered`);
		}
		this._providers.set(viewType, entry);
		return new extHostTypes.Disposable(() => this._providers.delete(viewType));
	}
}

export class ExtHostCustomEditors implements extHostProtocol.ExtHostCustomEditorsShape {

	private readonly _proxy: extHostProtocol.MainThreadCustomEditorsShape;

	private readonly _editorProviders = new EditorProviderStore();

	private readonly _documents = new CustomDocumentStore();

	constructor(
		mainContext: extHostProtocol.IMainContext,
		private readonly _extHostDocuments: ExtHostDocuments,
		private readonly _extensionStoragePaths: IExtensionStoragePaths | undefined,
		private readonly _extHostWebview: ExtHostWebviews,
		private readonly _extHostWebviewPanels: ExtHostWebviewPanels,
	) {
		this._proxy = mainContext.getProxy(extHostProtocol.MainContext.MainThreadCustomEditors);
	}

	public registerCustomEditorProvider(
		extension: IExtensionDescription,
		viewType: string,
		provider: vscode.CustomReadonlyEditorProvider | vscode.CustomTextEditorProvider,
		options: { webviewOptions?: vscode.WebviewPanelOptions; supportsMultipleEditorsPerDocument?: boolean },
	): vscode.Disposable {
		const disposables = new DisposableStore();
		if (isCustomTextEditorProvider(provider)) {
			disposables.add(this._editorProviders.addTextProvider(viewType, extension, provider));
			this._proxy.$registerTextEditorProvider(toExtensionData(extension), viewType, options.webviewOptions || {}, {
				supportsMove: !!provider.moveCustomTextEditor,
			}, shouldSerializeBuffersForPostMessage(extension));
		} else {
			disposables.add(this._editorProviders.addCustomProvider(viewType, extension, provider));

			if (isCustomEditorProviderWithEditingCapability(provider)) {
				disposables.add(provider.onDidChangeCustomDocument(e => {
					const entry = this.getCustomDocumentEntry(viewType, e.document.uri);
					if (isEditEvent(e)) {
						const editId = entry.addEdit(e);
						this._proxy.$onDidEdit(e.document.uri, viewType, editId, e.label);
					} else {
						this._proxy.$onContentChange(e.document.uri, viewType);
					}
				}));
			}

			this._proxy.$registerCustomEditorProvider(toExtensionData(extension), viewType, options.webviewOptions || {}, !!options.supportsMultipleEditorsPerDocument, shouldSerializeBuffersForPostMessage(extension));
		}

		return extHostTypes.Disposable.from(
			disposables,
			new extHostTypes.Disposable(() => {
				this._proxy.$unregisterEditorProvider(viewType);
			}));
	}

	async $createCustomDocument(resource: UriComponents, viewType: string, backupId: string | undefined, untitledDocumentData: VSBuffer | undefined, cancellation: CancellationToken) {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (entry.type !== CustomEditorType.Custom) {
			throw new Error(`Invalid provide type for '${viewType}'`);
		}

		const revivedResource = URI.revive(resource);
		const document = await entry.provider.openCustomDocument(revivedResource, { backupId, untitledDocumentData: untitledDocumentData?.buffer }, cancellation);

		let storageRoot: URI | undefined;
		if (isCustomEditorProviderWithEditingCapability(entry.provider) && this._extensionStoragePaths) {
			storageRoot = this._extensionStoragePaths.workspaceValue(entry.extension) ?? this._extensionStoragePaths.globalValue(entry.extension);
		}
		this._documents.add(viewType, document, storageRoot);

		return { editable: isCustomEditorProviderWithEditingCapability(entry.provider) };
	}

	async $disposeCustomDocument(resource: UriComponents, viewType: string): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (entry.type !== CustomEditorType.Custom) {
			throw new Error(`Invalid provider type for '${viewType}'`);
		}

		const revivedResource = URI.revive(resource);
		const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
		this._documents.delete(viewType, document);
		document.dispose();
	}

	async $resolveCustomEditor(
		resource: UriComponents,
		handle: extHostProtocol.WebviewHandle,
		viewType: string,
		initData: {
			title: string;
			contentOptions: extHostProtocol.IWebviewContentOptions;
			options: extHostProtocol.IWebviewPanelOptions;
			active: boolean;
		},
		position: EditorGroupColumn,
		cancellation: CancellationToken,
	): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		const viewColumn = typeConverters.ViewColumn.to(position);

		const webview = this._extHostWebview.createNewWebview(handle, initData.contentOptions, entry.extension);
		const panel = this._extHostWebviewPanels.createNewWebviewPanel(handle, viewType, initData.title, viewColumn, initData.options, webview, initData.active);

		const revivedResource = URI.revive(resource);

		switch (entry.type) {
			case CustomEditorType.Custom: {
				const { document } = this.getCustomDocumentEntry(viewType, revivedResource);
				return entry.provider.resolveCustomEditor(document, panel, cancellation);
			}
			case CustomEditorType.Text: {
				const document = this._extHostDocuments.getDocument(revivedResource);
				return entry.provider.resolveCustomTextEditor(document, panel, cancellation);
			}
			default: {
				throw new Error('Unknown webview provider type');
			}
		}
	}

	$disposeEdits(resourceComponents: UriComponents, viewType: string, editIds: number[]): void {
		const document = this.getCustomDocumentEntry(viewType, resourceComponents);
		document.disposeEdits(editIds);
	}

	async $onMoveCustomEditor(handle: string, newResourceComponents: UriComponents, viewType: string): Promise<void> {
		const entry = this._editorProviders.get(viewType);
		if (!entry) {
			throw new Error(`No provider found for '${viewType}'`);
		}

		if (!(entry.provider as vscode.CustomTextEditorProvider).moveCustomTextEditor) {
			throw new Error(`Provider does not implement move '${viewType}'`);
		}

		const webview = this._extHostWebviewPanels.getWebviewPanel(handle);
		if (!webview) {
			throw new Error(`No webview found`);
		}

		const resource = URI.revive(newResourceComponents);
		const document = this._extHostDocuments.getDocument(resource);
		await (entry.provider as vscode.CustomTextEditorProvider).moveCustomTextEditor!(document, webview, CancellationToken.None);
	}

	async $undo(resourceComponents: UriComponents, viewType: string, editId: number, isDirty: boolean): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		return entry.undo(editId, isDirty);
	}

	async $redo(resourceComponents: UriComponents, viewType: string, editId: number, isDirty: boolean): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		return entry.redo(editId, isDirty);
	}

	async $revert(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		await provider.revertCustomDocument(entry.document, cancellation);
		entry.disposeBackup();
	}

	async $onSave(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		await provider.saveCustomDocument(entry.document, cancellation);
		entry.disposeBackup();
	}

	async $onSaveAs(resourceComponents: UriComponents, viewType: string, targetResource: UriComponents, cancellation: CancellationToken): Promise<void> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);
		return provider.saveCustomDocumentAs(entry.document, URI.revive(targetResource), cancellation);
	}

	async $backup(resourceComponents: UriComponents, viewType: string, cancellation: CancellationToken): Promise<string> {
		const entry = this.getCustomDocumentEntry(viewType, resourceComponents);
		const provider = this.getCustomEditorProvider(viewType);

		const backup = await provider.backupCustomDocument(entry.document, {
			destination: entry.getNewBackupUri(),
		}, cancellation);
		entry.updateBackup(backup);
		return backup.id;
	}

	private getCustomDocumentEntry(viewType: string, resource: UriComponents): CustomDocumentStoreEntry {
		const entry = this._documents.get(viewType, URI.revive(resource));
		if (!entry) {
			throw new Error('No custom document found');
		}
		return entry;
	}

	private getCustomEditorProvider(viewType: string): vscode.CustomEditorProvider {
		const entry = this._editorProviders.get(viewType);
		const provider = entry?.provider;
		if (!provider || !isCustomEditorProviderWithEditingCapability(provider)) {
			throw new Error('Custom document is not editable');
		}
		return provider;
	}
}

function isCustomEditorProviderWithEditingCapability(provider: vscode.CustomTextEditorProvider | vscode.CustomEditorProvider | vscode.CustomReadonlyEditorProvider): provider is vscode.CustomEditorProvider {
	return !!(provider as vscode.CustomEditorProvider).onDidChangeCustomDocument;
}

function isCustomTextEditorProvider(provider: vscode.CustomReadonlyEditorProvider<vscode.CustomDocument> | vscode.CustomTextEditorProvider): provider is vscode.CustomTextEditorProvider {
	return typeof (provider as vscode.CustomTextEditorProvider).resolveCustomTextEditor === 'function';
}

function isEditEvent(e: vscode.CustomDocumentContentChangeEvent | vscode.CustomDocumentEditEvent): e is vscode.CustomDocumentEditEvent {
	return typeof (e as vscode.CustomDocumentEditEvent).undo === 'function'
		&& typeof (e as vscode.CustomDocumentEditEvent).redo === 'function';
}

function hashPath(resource: URI): string {
	const str = resource.scheme === Schemas.file || resource.scheme === Schemas.untitled ? resource.fsPath : resource.toString();
	return hash(str) + '';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDataChannels.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDataChannels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ExtHostDataChannelsShape } from './extHost.protocol.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export interface IExtHostDataChannels extends ExtHostDataChannelsShape {
	readonly _serviceBrand: undefined;
	createDataChannel<T>(extension: IExtensionDescription, channelId: string): vscode.DataChannel<T>;
}

export const IExtHostDataChannels = createDecorator<IExtHostDataChannels>('IExtHostDataChannels');

export class ExtHostDataChannels implements IExtHostDataChannels {
	declare readonly _serviceBrand: undefined;

	private readonly _channels = new Map<string, DataChannelImpl<any>>();

	constructor() {
	}

	createDataChannel<T>(extension: IExtensionDescription, channelId: string): vscode.DataChannel<T> {
		checkProposedApiEnabled(extension, 'dataChannels');

		let channel = this._channels.get(channelId);
		if (!channel) {
			channel = new DataChannelImpl<T>(channelId);
			this._channels.set(channelId, channel);
		}
		return channel;
	}

	$onDidReceiveData(channelId: string, data: any): void {
		const channel = this._channels.get(channelId);
		if (channel) {
			channel._fireDidReceiveData(data);
		}
	}
}

class DataChannelImpl<T> extends Disposable implements vscode.DataChannel<T> {
	private readonly _onDidReceiveData = new Emitter<vscode.DataChannelEvent<T>>();
	public readonly onDidReceiveData: Event<vscode.DataChannelEvent<T>> = this._onDidReceiveData.event;

	constructor(private readonly channelId: string) {
		super();
		this._register(this._onDidReceiveData);
	}

	_fireDidReceiveData(data: T): void {
		this._onDidReceiveData.fire({ data });
	}

	override toString(): string {
		return `DataChannel(${this.channelId})`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDebugService.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDebugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { coalesce } from '../../../base/common/arrays.js';
import { asPromise } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable as DisposableCls, toDisposable } from '../../../base/common/lifecycle.js';
import { ThemeIcon as ThemeIconUtils } from '../../../base/common/themables.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ISignService } from '../../../platform/sign/common/sign.js';
import { IWorkspaceFolderData } from '../../../platform/workspace/common/workspace.js';
import { AbstractDebugAdapter } from '../../contrib/debug/common/abstractDebugAdapter.js';
import { DebugVisualizationType, IAdapterDescriptor, IConfig, IDebugAdapter, IDebugAdapterExecutable, IDebugAdapterImpl, IDebugAdapterNamedPipeServer, IDebugAdapterServer, IDebuggerContribution, IDebugVisualization, IDebugVisualizationContext, IDebugVisualizationTreeItem, MainThreadDebugVisualization } from '../../contrib/debug/common/debug.js';
import { convertToDAPaths, convertToVSCPaths, isDebuggerMainContribution } from '../../contrib/debug/common/debugUtils.js';
import { ExtensionDescriptionRegistry } from '../../services/extensions/common/extensionDescriptionRegistry.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { DebugSessionUUID, ExtHostDebugServiceShape, IBreakpointsDeltaDto, IDebugSessionDto, IFunctionBreakpointDto, ISourceMultiBreakpointDto, IStackFrameFocusDto, IThreadFocusDto, MainContext, MainThreadDebugServiceShape, MainThreadTelemetryShape } from './extHost.protocol.js';
import { IExtHostCommands } from './extHostCommands.js';
import { IExtHostConfiguration } from './extHostConfiguration.js';
import { IExtHostEditorTabs } from './extHostEditorTabs.js';
import { IExtHostExtensionService } from './extHostExtensionService.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { IExtHostTesting } from './extHostTesting.js';
import * as Convert from './extHostTypeConverters.js';
import { Breakpoint, DataBreakpoint, DebugAdapterExecutable, DebugAdapterInlineImplementation, DebugAdapterNamedPipeServer, DebugAdapterServer, DebugConsoleMode, DebugStackFrame, DebugThread, Disposable, FunctionBreakpoint, Location, Position, setBreakpointId, SourceBreakpoint, ThemeIcon } from './extHostTypes.js';
import { IExtHostVariableResolverProvider } from './extHostVariableResolverService.js';
import { IExtHostWorkspace } from './extHostWorkspace.js';

export const IExtHostDebugService = createDecorator<IExtHostDebugService>('IExtHostDebugService');

export interface IExtHostDebugService extends ExtHostDebugServiceShape {

	readonly _serviceBrand: undefined;

	readonly onDidStartDebugSession: Event<vscode.DebugSession>;
	readonly onDidTerminateDebugSession: Event<vscode.DebugSession>;
	readonly onDidChangeActiveDebugSession: Event<vscode.DebugSession | undefined>;
	activeDebugSession: vscode.DebugSession | undefined;
	activeDebugConsole: vscode.DebugConsole;
	readonly onDidReceiveDebugSessionCustomEvent: Event<vscode.DebugSessionCustomEvent>;
	readonly onDidChangeBreakpoints: Event<vscode.BreakpointsChangeEvent>;
	breakpoints: vscode.Breakpoint[];
	readonly onDidChangeActiveStackItem: Event<vscode.DebugThread | vscode.DebugStackFrame | undefined>;
	activeStackItem: vscode.DebugThread | vscode.DebugStackFrame | undefined;

	addBreakpoints(breakpoints0: readonly vscode.Breakpoint[]): Promise<void>;
	removeBreakpoints(breakpoints0: readonly vscode.Breakpoint[]): Promise<void>;
	startDebugging(folder: vscode.WorkspaceFolder | undefined, nameOrConfig: string | vscode.DebugConfiguration, options: vscode.DebugSessionOptions): Promise<boolean>;
	stopDebugging(session?: vscode.DebugSession): Promise<void>;
	registerDebugConfigurationProvider(type: string, provider: vscode.DebugConfigurationProvider, trigger: vscode.DebugConfigurationProviderTriggerKind): vscode.Disposable;
	registerDebugAdapterDescriptorFactory(extension: IExtensionDescription, type: string, factory: vscode.DebugAdapterDescriptorFactory): vscode.Disposable;
	registerDebugAdapterTrackerFactory(type: string, factory: vscode.DebugAdapterTrackerFactory): vscode.Disposable;
	registerDebugVisualizationProvider<T extends vscode.DebugVisualization>(extension: IExtensionDescription, id: string, provider: vscode.DebugVisualizationProvider<T>): vscode.Disposable;
	registerDebugVisualizationTree<T extends vscode.DebugTreeItem>(extension: IExtensionDescription, id: string, provider: vscode.DebugVisualizationTree<T>): vscode.Disposable;
	asDebugSourceUri(source: vscode.DebugProtocolSource, session?: vscode.DebugSession): vscode.Uri;
}

export abstract class ExtHostDebugServiceBase extends DisposableCls implements IExtHostDebugService, ExtHostDebugServiceShape {

	declare readonly _serviceBrand: undefined;

	private _configProviderHandleCounter: number;
	private _configProviders: ConfigProviderTuple[];

	private _adapterFactoryHandleCounter: number;
	private _adapterFactories: DescriptorFactoryTuple[];

	private _trackerFactoryHandleCounter: number;
	private _trackerFactories: TrackerFactoryTuple[];

	private _debugServiceProxy: MainThreadDebugServiceShape;
	private _debugSessions: Map<DebugSessionUUID, ExtHostDebugSession> = new Map<DebugSessionUUID, ExtHostDebugSession>();

	private readonly _onDidStartDebugSession: Emitter<vscode.DebugSession>;
	get onDidStartDebugSession(): Event<vscode.DebugSession> { return this._onDidStartDebugSession.event; }

	private readonly _onDidTerminateDebugSession: Emitter<vscode.DebugSession>;
	get onDidTerminateDebugSession(): Event<vscode.DebugSession> { return this._onDidTerminateDebugSession.event; }

	private readonly _onDidChangeActiveDebugSession: Emitter<vscode.DebugSession | undefined>;
	get onDidChangeActiveDebugSession(): Event<vscode.DebugSession | undefined> { return this._onDidChangeActiveDebugSession.event; }

	private _activeDebugSession: ExtHostDebugSession | undefined;
	get activeDebugSession(): vscode.DebugSession | undefined { return this._activeDebugSession?.api; }

	private readonly _onDidReceiveDebugSessionCustomEvent: Emitter<vscode.DebugSessionCustomEvent>;
	get onDidReceiveDebugSessionCustomEvent(): Event<vscode.DebugSessionCustomEvent> { return this._onDidReceiveDebugSessionCustomEvent.event; }

	private _activeDebugConsole: ExtHostDebugConsole;
	get activeDebugConsole(): vscode.DebugConsole { return this._activeDebugConsole.value; }

	private _breakpoints: Map<string, vscode.Breakpoint>;

	private readonly _onDidChangeBreakpoints: Emitter<vscode.BreakpointsChangeEvent>;

	private _activeStackItem: vscode.DebugThread | vscode.DebugStackFrame | undefined;
	private readonly _onDidChangeActiveStackItem: Emitter<vscode.DebugThread | vscode.DebugStackFrame | undefined>;

	private _debugAdapters: Map<number, IDebugAdapter>;
	private _debugAdaptersTrackers: Map<number, vscode.DebugAdapterTracker>;

	private _debugVisualizationTreeItemIdsCounter = 0;
	private readonly _debugVisualizationProviders = new Map<string, vscode.DebugVisualizationProvider>();
	private readonly _debugVisualizationTrees = new Map<string, vscode.DebugVisualizationTree>();
	private readonly _debugVisualizationTreeItemIds = new WeakMap<vscode.DebugTreeItem, number>();
	private readonly _debugVisualizationElements = new Map<number, { provider: string; item: vscode.DebugTreeItem; children?: number[] }>();

	private _signService: ISignService | undefined;

	private readonly _visualizers = new Map<number, { v: vscode.DebugVisualization; provider: vscode.DebugVisualizationProvider; extensionId: string }>();
	private _visualizerIdCounter = 0;

	private _telemetryProxy: MainThreadTelemetryShape;

	constructor(
		@IExtHostRpcService extHostRpcService: IExtHostRpcService,
		@IExtHostWorkspace protected readonly _workspaceService: IExtHostWorkspace,
		@IExtHostExtensionService private readonly _extensionService: IExtHostExtensionService,
		@IExtHostConfiguration protected readonly _configurationService: IExtHostConfiguration,
		@IExtHostEditorTabs protected readonly _editorTabs: IExtHostEditorTabs,
		@IExtHostVariableResolverProvider private readonly _variableResolver: IExtHostVariableResolverProvider,
		@IExtHostCommands private readonly _commands: IExtHostCommands,
		@IExtHostTesting private readonly _testing: IExtHostTesting,
	) {
		super();

		this._configProviderHandleCounter = 0;
		this._configProviders = [];

		this._adapterFactoryHandleCounter = 0;
		this._adapterFactories = [];

		this._trackerFactoryHandleCounter = 0;
		this._trackerFactories = [];

		this._debugAdapters = new Map();
		this._debugAdaptersTrackers = new Map();

		this._onDidStartDebugSession = this._register(new Emitter<vscode.DebugSession>());
		this._onDidTerminateDebugSession = this._register(new Emitter<vscode.DebugSession>());
		this._onDidChangeActiveDebugSession = this._register(new Emitter<vscode.DebugSession | undefined>());
		this._onDidReceiveDebugSessionCustomEvent = this._register(new Emitter<vscode.DebugSessionCustomEvent>());

		this._debugServiceProxy = extHostRpcService.getProxy(MainContext.MainThreadDebugService);

		this._onDidChangeBreakpoints = this._register(new Emitter<vscode.BreakpointsChangeEvent>());

		this._onDidChangeActiveStackItem = this._register(new Emitter<vscode.DebugThread | vscode.DebugStackFrame | undefined>());

		this._activeDebugConsole = new ExtHostDebugConsole(this._debugServiceProxy);

		this._breakpoints = new Map<string, vscode.Breakpoint>();

		this._extensionService.getExtensionRegistry().then((extensionRegistry: ExtensionDescriptionRegistry) => {
			this._register(extensionRegistry.onDidChange(_ => {
				this.registerAllDebugTypes(extensionRegistry);
			}));
			this.registerAllDebugTypes(extensionRegistry);
		});

		this._telemetryProxy = extHostRpcService.getProxy(MainContext.MainThreadTelemetry);
	}

	public async $getVisualizerTreeItem(treeId: string, element: IDebugVisualizationContext): Promise<IDebugVisualizationTreeItem | undefined> {
		const context = this.hydrateVisualizationContext(element);
		if (!context) {
			return undefined;
		}

		const item = await this._debugVisualizationTrees.get(treeId)?.getTreeItem?.(context);
		return item ? this.convertVisualizerTreeItem(treeId, item) : undefined;
	}

	public registerDebugVisualizationTree<T extends vscode.DebugTreeItem>(manifest: IExtensionDescription, id: string, provider: vscode.DebugVisualizationTree<T>): vscode.Disposable {
		const extensionId = ExtensionIdentifier.toKey(manifest.identifier);
		const key = this.extensionVisKey(extensionId, id);
		if (this._debugVisualizationProviders.has(key)) {
			throw new Error(`A debug visualization provider with id '${id}' is already registered`);
		}

		this._debugVisualizationTrees.set(key, provider);
		this._debugServiceProxy.$registerDebugVisualizerTree(key, !!provider.editItem);
		return toDisposable(() => {
			this._debugServiceProxy.$unregisterDebugVisualizerTree(key);
			this._debugVisualizationTrees.delete(id);
		});
	}

	public async $getVisualizerTreeItemChildren(treeId: string, element: number): Promise<IDebugVisualizationTreeItem[]> {
		const item = this._debugVisualizationElements.get(element)?.item;
		if (!item) {
			return [];
		}

		const children = await this._debugVisualizationTrees.get(treeId)?.getChildren?.(item);
		return children?.map(i => this.convertVisualizerTreeItem(treeId, i)) || [];
	}

	public async $editVisualizerTreeItem(element: number, value: string): Promise<IDebugVisualizationTreeItem | undefined> {
		const e = this._debugVisualizationElements.get(element);
		if (!e) { return undefined; }

		const r = await this._debugVisualizationTrees.get(e.provider)?.editItem?.(e.item, value);
		return this.convertVisualizerTreeItem(e.provider, r || e.item);
	}

	public $disposeVisualizedTree(element: number): void {
		const root = this._debugVisualizationElements.get(element);
		if (!root) {
			return;
		}

		const queue = [root.children];
		for (const children of queue) {
			if (children) {
				for (const child of children) {
					queue.push(this._debugVisualizationElements.get(child)?.children);
					this._debugVisualizationElements.delete(child);
				}
			}
		}
	}

	private convertVisualizerTreeItem(treeId: string, item: vscode.DebugTreeItem): IDebugVisualizationTreeItem {
		let id = this._debugVisualizationTreeItemIds.get(item);
		if (!id) {
			id = this._debugVisualizationTreeItemIdsCounter++;
			this._debugVisualizationTreeItemIds.set(item, id);
			this._debugVisualizationElements.set(id, { provider: treeId, item });
		}

		return Convert.DebugTreeItem.from(item, id);
	}

	public asDebugSourceUri(src: vscode.DebugProtocolSource, session?: vscode.DebugSession): URI {

		// eslint-disable-next-line local/code-no-any-casts
		const source = <any>src;

		if (typeof source.sourceReference === 'number' && source.sourceReference > 0) {
			// src can be retrieved via DAP's "source" request

			let debug = `debug:${encodeURIComponent(source.path || '')}`;
			let sep = '?';

			if (session) {
				debug += `${sep}session=${encodeURIComponent(session.id)}`;
				sep = '&';
			}

			debug += `${sep}ref=${source.sourceReference}`;

			return URI.parse(debug);
		} else if (source.path) {
			// src is just a local file path
			return URI.file(source.path);
		} else {
			throw new Error(`cannot create uri from DAP 'source' object; properties 'path' and 'sourceReference' are both missing.`);
		}
	}

	private registerAllDebugTypes(extensionRegistry: ExtensionDescriptionRegistry) {

		const debugTypes: string[] = [];

		for (const ed of extensionRegistry.getAllExtensionDescriptions()) {
			if (ed.contributes) {
				const debuggers = <IDebuggerContribution[]>ed.contributes['debuggers'];
				if (debuggers && debuggers.length > 0) {
					for (const dbg of debuggers) {
						if (isDebuggerMainContribution(dbg)) {
							debugTypes.push(dbg.type);
						}
					}
				}
			}
		}

		this._debugServiceProxy.$registerDebugTypes(debugTypes);
	}

	// extension debug API


	get activeStackItem(): vscode.DebugThread | vscode.DebugStackFrame | undefined {
		return this._activeStackItem;
	}

	get onDidChangeActiveStackItem(): Event<vscode.DebugThread | vscode.DebugStackFrame | undefined> {
		return this._onDidChangeActiveStackItem.event;
	}

	get onDidChangeBreakpoints(): Event<vscode.BreakpointsChangeEvent> {
		return this._onDidChangeBreakpoints.event;
	}

	get breakpoints(): vscode.Breakpoint[] {
		const result: vscode.Breakpoint[] = [];
		this._breakpoints.forEach(bp => result.push(bp));
		return result;
	}

	public async $resolveDebugVisualizer(id: number, token: CancellationToken): Promise<MainThreadDebugVisualization> {
		const visualizer = this._visualizers.get(id);
		if (!visualizer) {
			throw new Error(`No debug visualizer found with id '${id}'`);
		}

		let { v, provider, extensionId } = visualizer;
		if (!v.visualization) {
			v = await provider.resolveDebugVisualization?.(v, token) || v;
			visualizer.v = v;
		}

		if (!v.visualization) {
			throw new Error(`No visualization returned from resolveDebugVisualization in '${provider}'`);
		}

		return this.serializeVisualization(extensionId, v.visualization)!;
	}

	public async $executeDebugVisualizerCommand(id: number): Promise<void> {
		const visualizer = this._visualizers.get(id);
		if (!visualizer) {
			throw new Error(`No debug visualizer found with id '${id}'`);
		}

		const command = visualizer.v.visualization;
		if (command && 'command' in command) {
			this._commands.executeCommand(command.command, ...(command.arguments || []));
		}
	}

	private hydrateVisualizationContext(context: IDebugVisualizationContext): vscode.DebugVisualizationContext | undefined {
		const session = this._debugSessions.get(context.sessionId);
		return session && {
			session: session.api,
			variable: context.variable,
			containerId: context.containerId,
			frameId: context.frameId,
			threadId: context.threadId,
		};
	}

	public async $provideDebugVisualizers(extensionId: string, id: string, context: IDebugVisualizationContext, token: CancellationToken): Promise<IDebugVisualization.Serialized[]> {
		const contextHydrated = this.hydrateVisualizationContext(context);
		const key = this.extensionVisKey(extensionId, id);
		const provider = this._debugVisualizationProviders.get(key);
		if (!contextHydrated || !provider) {
			return []; // probably ended in the meantime
		}

		const visualizations = await provider.provideDebugVisualization(contextHydrated, token);

		if (!visualizations) {
			return [];
		}

		return visualizations.map(v => {
			const id = ++this._visualizerIdCounter;
			this._visualizers.set(id, { v, provider, extensionId });
			const icon = v.iconPath ? this.getIconPathOrClass(v.iconPath) : undefined;
			return {
				id,
				name: v.name,
				iconClass: icon?.iconClass,
				iconPath: icon?.iconPath,
				visualization: this.serializeVisualization(extensionId, v.visualization),
			};
		});
	}

	public $disposeDebugVisualizers(ids: number[]): void {
		for (const id of ids) {
			this._visualizers.delete(id);
		}
	}

	public registerDebugVisualizationProvider<T extends vscode.DebugVisualization>(manifest: IExtensionDescription, id: string, provider: vscode.DebugVisualizationProvider<T>): vscode.Disposable {
		if (!manifest.contributes?.debugVisualizers?.some(r => r.id === id)) {
			throw new Error(`Extensions may only call registerDebugVisualizationProvider() for renderers they contribute (got ${id})`);
		}

		const extensionId = ExtensionIdentifier.toKey(manifest.identifier);
		const key = this.extensionVisKey(extensionId, id);
		if (this._debugVisualizationProviders.has(key)) {
			throw new Error(`A debug visualization provider with id '${id}' is already registered`);
		}

		this._debugVisualizationProviders.set(key, provider);
		this._debugServiceProxy.$registerDebugVisualizer(extensionId, id);
		return toDisposable(() => {
			this._debugServiceProxy.$unregisterDebugVisualizer(extensionId, id);
			this._debugVisualizationProviders.delete(id);
		});
	}

	public addBreakpoints(breakpoints0: vscode.Breakpoint[]): Promise<void> {
		// filter only new breakpoints
		const breakpoints = breakpoints0.filter(bp => {
			const id = bp.id;
			if (!this._breakpoints.has(id)) {
				this._breakpoints.set(id, bp);
				return true;
			}
			return false;
		});

		// send notification for added breakpoints
		this.fireBreakpointChanges(breakpoints, [], []);

		// convert added breakpoints to DTOs
		const dtos: Array<ISourceMultiBreakpointDto | IFunctionBreakpointDto> = [];
		const map = new Map<string, ISourceMultiBreakpointDto>();
		for (const bp of breakpoints) {
			if (bp instanceof SourceBreakpoint) {
				let dto = map.get(bp.location.uri.toString());
				if (!dto) {
					dto = {
						type: 'sourceMulti',
						uri: bp.location.uri,
						lines: []
					} satisfies ISourceMultiBreakpointDto;
					map.set(bp.location.uri.toString(), dto);
					dtos.push(dto);
				}
				dto.lines.push({
					id: bp.id,
					enabled: bp.enabled,
					condition: bp.condition,
					hitCondition: bp.hitCondition,
					logMessage: bp.logMessage,
					line: bp.location.range.start.line,
					character: bp.location.range.start.character,
					mode: bp.mode,
				});
			} else if (bp instanceof FunctionBreakpoint) {
				dtos.push({
					type: 'function',
					id: bp.id,
					enabled: bp.enabled,
					hitCondition: bp.hitCondition,
					logMessage: bp.logMessage,
					condition: bp.condition,
					functionName: bp.functionName,
					mode: bp.mode,
				});
			}
		}

		// send DTOs to VS Code
		return this._debugServiceProxy.$registerBreakpoints(dtos);
	}

	public removeBreakpoints(breakpoints0: vscode.Breakpoint[]): Promise<void> {
		// remove from array
		const breakpoints = breakpoints0.filter(b => this._breakpoints.delete(b.id));

		// send notification
		this.fireBreakpointChanges([], breakpoints, []);

		// unregister with VS Code
		const ids = breakpoints.filter(bp => bp instanceof SourceBreakpoint).map(bp => bp.id);
		const fids = breakpoints.filter(bp => bp instanceof FunctionBreakpoint).map(bp => bp.id);
		const dids = breakpoints.filter(bp => bp instanceof DataBreakpoint).map(bp => bp.id);
		return this._debugServiceProxy.$unregisterBreakpoints(ids, fids, dids);
	}

	public startDebugging(folder: vscode.WorkspaceFolder | undefined, nameOrConfig: string | vscode.DebugConfiguration, options: vscode.DebugSessionOptions): Promise<boolean> {
		const testRunMeta = options.testRun && this._testing.getMetadataForRun(options.testRun);

		return this._debugServiceProxy.$startDebugging(folder ? folder.uri : undefined, nameOrConfig, {
			parentSessionID: options.parentSession ? options.parentSession.id : undefined,
			lifecycleManagedByParent: options.lifecycleManagedByParent,
			repl: options.consoleMode === DebugConsoleMode.MergeWithParent ? 'mergeWithParent' : 'separate',
			noDebug: options.noDebug,
			compact: options.compact,
			suppressSaveBeforeStart: options.suppressSaveBeforeStart,
			testRun: testRunMeta && {
				runId: testRunMeta.runId,
				taskId: testRunMeta.taskId,
			},

			// Check debugUI for back-compat, #147264
			// eslint-disable-next-line local/code-no-any-casts
			suppressDebugStatusbar: options.suppressDebugStatusbar ?? (options as any).debugUI?.simple,
			// eslint-disable-next-line local/code-no-any-casts
			suppressDebugToolbar: options.suppressDebugToolbar ?? (options as any).debugUI?.simple,
			// eslint-disable-next-line local/code-no-any-casts
			suppressDebugView: options.suppressDebugView ?? (options as any).debugUI?.simple,
		});
	}

	public stopDebugging(session?: vscode.DebugSession): Promise<void> {
		return this._debugServiceProxy.$stopDebugging(session ? session.id : undefined);
	}

	public registerDebugConfigurationProvider(type: string, provider: vscode.DebugConfigurationProvider, trigger: vscode.DebugConfigurationProviderTriggerKind): vscode.Disposable {

		if (!provider) {
			return new Disposable(() => { });
		}

		const handle = this._configProviderHandleCounter++;
		this._configProviders.push({ type, handle, provider });

		this._debugServiceProxy.$registerDebugConfigurationProvider(type, trigger,
			!!provider.provideDebugConfigurations,
			!!provider.resolveDebugConfiguration,
			!!provider.resolveDebugConfigurationWithSubstitutedVariables,
			handle);

		return new Disposable(() => {
			this._configProviders = this._configProviders.filter(p => p.provider !== provider);		// remove
			this._debugServiceProxy.$unregisterDebugConfigurationProvider(handle);
		});
	}

	public registerDebugAdapterDescriptorFactory(extension: IExtensionDescription, type: string, factory: vscode.DebugAdapterDescriptorFactory): vscode.Disposable {

		if (!factory) {
			return new Disposable(() => { });
		}

		// a DebugAdapterDescriptorFactory can only be registered in the extension that contributes the debugger
		if (!this.definesDebugType(extension, type)) {
			throw new Error(`a DebugAdapterDescriptorFactory can only be registered from the extension that defines the '${type}' debugger.`);
		}

		// make sure that only one factory for this type is registered
		if (this.getAdapterDescriptorFactoryByType(type)) {
			throw new Error(`a DebugAdapterDescriptorFactory can only be registered once per a type.`);
		}

		const handle = this._adapterFactoryHandleCounter++;
		this._adapterFactories.push({ type, handle, factory });

		this._debugServiceProxy.$registerDebugAdapterDescriptorFactory(type, handle);

		return new Disposable(() => {
			this._adapterFactories = this._adapterFactories.filter(p => p.factory !== factory);		// remove
			this._debugServiceProxy.$unregisterDebugAdapterDescriptorFactory(handle);
		});
	}

	public registerDebugAdapterTrackerFactory(type: string, factory: vscode.DebugAdapterTrackerFactory): vscode.Disposable {

		if (!factory) {
			return new Disposable(() => { });
		}

		const handle = this._trackerFactoryHandleCounter++;
		this._trackerFactories.push({ type, handle, factory });

		return new Disposable(() => {
			this._trackerFactories = this._trackerFactories.filter(p => p.factory !== factory);		// remove
		});
	}

	// RPC methods (ExtHostDebugServiceShape)

	public async $runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined> {
		return Promise.resolve(undefined);
	}

	public async $substituteVariables(folderUri: UriComponents | undefined, config: IConfig): Promise<IConfig> {
		let ws: IWorkspaceFolderData | undefined;
		const folder = await this.getFolder(folderUri);
		if (folder) {
			ws = {
				uri: folder.uri,
				name: folder.name,
				index: folder.index,
			};
		}
		const variableResolver = await this._variableResolver.getResolver();
		return variableResolver.resolveAsync(ws, config);
	}

	protected createDebugAdapter(adapter: vscode.DebugAdapterDescriptor, session: ExtHostDebugSession): AbstractDebugAdapter | undefined {
		if (adapter instanceof DebugAdapterInlineImplementation) {
			return new DirectDebugAdapter(adapter.implementation);
		}
		return undefined;
	}

	protected createSignService(): ISignService | undefined {
		return undefined;
	}

	public async $startDASession(debugAdapterHandle: number, sessionDto: IDebugSessionDto): Promise<void> {
		const mythis = this;

		const session = await this.getSession(sessionDto);

		return this.getAdapterDescriptor(this.getAdapterDescriptorFactoryByType(session.type), session).then(daDescriptor => {

			if (!daDescriptor) {
				throw new Error(`Couldn't find a debug adapter descriptor for debug type '${session.type}' (extension might have failed to activate)`);
			}

			const da = this.createDebugAdapter(daDescriptor, session);
			if (!da) {
				throw new Error(`Couldn't create a debug adapter for type '${session.type}'.`);
			}

			const debugAdapter = da;

			this._debugAdapters.set(debugAdapterHandle, debugAdapter);

			return this.getDebugAdapterTrackers(session).then(tracker => {

				if (tracker) {
					this._debugAdaptersTrackers.set(debugAdapterHandle, tracker);
				}

				debugAdapter.onMessage(async message => {

					if (message.type === 'request' && (<DebugProtocol.Request>message).command === 'handshake') {

						const request = <DebugProtocol.Request>message;

						const response: DebugProtocol.Response = {
							type: 'response',
							seq: 0,
							command: request.command,
							request_seq: request.seq,
							success: true
						};

						if (!this._signService) {
							this._signService = this.createSignService();
						}

						try {
							if (this._signService) {
								const signature = await this._signService.sign(request.arguments.value);
								response.body = {
									signature: signature
								};
								debugAdapter.sendResponse(response);
							} else {
								throw new Error('no signer');
							}
						} catch (e) {
							response.success = false;
							response.message = e.message;
							debugAdapter.sendResponse(response);
						}
					} else {
						if (tracker && tracker.onDidSendMessage) {
							tracker.onDidSendMessage(message);
						}

						// DA -> VS Code
						try {
							// Try to catch details for #233167
							message = convertToVSCPaths(message, true);
						} catch (e) {
							// eslint-disable-next-line local/code-no-any-casts
							const type = message.type + '_' + ((message as any).command ?? (message as any).event ?? '');
							this._telemetryProxy.$publicLog2<DebugProtocolMessageErrorEvent, DebugProtocolMessageErrorClassification>('debugProtocolMessageError', { type, from: session.type });
							throw e;
						}

						mythis._debugServiceProxy.$acceptDAMessage(debugAdapterHandle, message);
					}
				});
				debugAdapter.onError(err => {
					if (tracker && tracker.onError) {
						tracker.onError(err);
					}
					this._debugServiceProxy.$acceptDAError(debugAdapterHandle, err.name, err.message, err.stack);
				});
				debugAdapter.onExit((code: number | null) => {
					if (tracker && tracker.onExit) {
						tracker.onExit(code ?? undefined, undefined);
					}
					this._debugServiceProxy.$acceptDAExit(debugAdapterHandle, code ?? undefined, undefined);
				});

				if (tracker && tracker.onWillStartSession) {
					tracker.onWillStartSession();
				}

				return debugAdapter.startSession();
			});
		});
	}

	public $sendDAMessage(debugAdapterHandle: number, message: DebugProtocol.ProtocolMessage): void {

		// VS Code -> DA
		message = convertToDAPaths(message, false);

		const tracker = this._debugAdaptersTrackers.get(debugAdapterHandle);	// TODO@AW: same handle?
		if (tracker && tracker.onWillReceiveMessage) {
			tracker.onWillReceiveMessage(message);
		}

		const da = this._debugAdapters.get(debugAdapterHandle);
		da?.sendMessage(message);
	}

	public $stopDASession(debugAdapterHandle: number): Promise<void> {

		const tracker = this._debugAdaptersTrackers.get(debugAdapterHandle);
		this._debugAdaptersTrackers.delete(debugAdapterHandle);
		if (tracker && tracker.onWillStopSession) {
			tracker.onWillStopSession();
		}

		const da = this._debugAdapters.get(debugAdapterHandle);
		this._debugAdapters.delete(debugAdapterHandle);
		if (da) {
			return da.stopSession();
		} else {
			return Promise.resolve(void 0);
		}
	}

	public $acceptBreakpointsDelta(delta: IBreakpointsDeltaDto): void {

		const a: vscode.Breakpoint[] = [];
		const r: vscode.Breakpoint[] = [];
		const c: vscode.Breakpoint[] = [];

		if (delta.added) {
			for (const bpd of delta.added) {
				const id = bpd.id;
				if (id && !this._breakpoints.has(id)) {
					let bp: Breakpoint;
					if (bpd.type === 'function') {
						bp = new FunctionBreakpoint(bpd.functionName, bpd.enabled, bpd.condition, bpd.hitCondition, bpd.logMessage, bpd.mode);
					} else if (bpd.type === 'data') {
						bp = new DataBreakpoint(bpd.label, bpd.dataId, bpd.canPersist, bpd.enabled, bpd.hitCondition, bpd.condition, bpd.logMessage, bpd.mode);
					} else {
						const uri = URI.revive(bpd.uri);
						bp = new SourceBreakpoint(new Location(uri, new Position(bpd.line, bpd.character)), bpd.enabled, bpd.condition, bpd.hitCondition, bpd.logMessage, bpd.mode);
					}
					setBreakpointId(bp, id);
					this._breakpoints.set(id, bp);
					a.push(bp);
				}
			}
		}

		if (delta.removed) {
			for (const id of delta.removed) {
				const bp = this._breakpoints.get(id);
				if (bp) {
					this._breakpoints.delete(id);
					r.push(bp);
				}
			}
		}

		if (delta.changed) {
			for (const bpd of delta.changed) {
				if (bpd.id) {
					const bp = this._breakpoints.get(bpd.id);
					if (bp) {
						if (bp instanceof FunctionBreakpoint && bpd.type === 'function') {
							// eslint-disable-next-line local/code-no-any-casts
							const fbp = <any>bp;
							fbp.enabled = bpd.enabled;
							fbp.condition = bpd.condition;
							fbp.hitCondition = bpd.hitCondition;
							fbp.logMessage = bpd.logMessage;
							fbp.functionName = bpd.functionName;
						} else if (bp instanceof SourceBreakpoint && bpd.type === 'source') {
							// eslint-disable-next-line local/code-no-any-casts
							const sbp = <any>bp;
							sbp.enabled = bpd.enabled;
							sbp.condition = bpd.condition;
							sbp.hitCondition = bpd.hitCondition;
							sbp.logMessage = bpd.logMessage;
							sbp.location = new Location(URI.revive(bpd.uri), new Position(bpd.line, bpd.character));
						}
						c.push(bp);
					}
				}
			}
		}

		this.fireBreakpointChanges(a, r, c);
	}

	public async $acceptStackFrameFocus(focusDto: IThreadFocusDto | IStackFrameFocusDto | undefined): Promise<void> {
		let focus: vscode.DebugThread | vscode.DebugStackFrame | undefined;
		if (focusDto) {
			const session = await this.getSession(focusDto.sessionId);
			if (focusDto.kind === 'thread') {
				focus = new DebugThread(session.api, focusDto.threadId);
			} else {
				focus = new DebugStackFrame(session.api, focusDto.threadId, focusDto.frameId);
			}
		}

		this._activeStackItem = focus;
		this._onDidChangeActiveStackItem.fire(this._activeStackItem);
	}

	public $provideDebugConfigurations(configProviderHandle: number, folderUri: UriComponents | undefined, token: CancellationToken): Promise<vscode.DebugConfiguration[]> {
		return asPromise(async () => {
			const provider = this.getConfigProviderByHandle(configProviderHandle);
			if (!provider) {
				throw new Error('no DebugConfigurationProvider found');
			}
			if (!provider.provideDebugConfigurations) {
				throw new Error('DebugConfigurationProvider has no method provideDebugConfigurations');
			}
			const folder = await this.getFolder(folderUri);
			return provider.provideDebugConfigurations(folder, token);
		}).then(debugConfigurations => {
			if (!debugConfigurations) {
				throw new Error('nothing returned from DebugConfigurationProvider.provideDebugConfigurations');
			}
			return debugConfigurations;
		});
	}

	public $resolveDebugConfiguration(configProviderHandle: number, folderUri: UriComponents | undefined, debugConfiguration: vscode.DebugConfiguration, token: CancellationToken): Promise<vscode.DebugConfiguration | null | undefined> {
		return asPromise(async () => {
			const provider = this.getConfigProviderByHandle(configProviderHandle);
			if (!provider) {
				throw new Error('no DebugConfigurationProvider found');
			}
			if (!provider.resolveDebugConfiguration) {
				throw new Error('DebugConfigurationProvider has no method resolveDebugConfiguration');
			}
			const folder = await this.getFolder(folderUri);
			return provider.resolveDebugConfiguration(folder, debugConfiguration, token);
		});
	}

	public $resolveDebugConfigurationWithSubstitutedVariables(configProviderHandle: number, folderUri: UriComponents | undefined, debugConfiguration: vscode.DebugConfiguration, token: CancellationToken): Promise<vscode.DebugConfiguration | null | undefined> {
		return asPromise(async () => {
			const provider = this.getConfigProviderByHandle(configProviderHandle);
			if (!provider) {
				throw new Error('no DebugConfigurationProvider found');
			}
			if (!provider.resolveDebugConfigurationWithSubstitutedVariables) {
				throw new Error('DebugConfigurationProvider has no method resolveDebugConfigurationWithSubstitutedVariables');
			}
			const folder = await this.getFolder(folderUri);
			return provider.resolveDebugConfigurationWithSubstitutedVariables(folder, debugConfiguration, token);
		});
	}

	public async $provideDebugAdapter(adapterFactoryHandle: number, sessionDto: IDebugSessionDto): Promise<Dto<IAdapterDescriptor>> {
		const adapterDescriptorFactory = this.getAdapterDescriptorFactoryByHandle(adapterFactoryHandle);
		if (!adapterDescriptorFactory) {
			return Promise.reject(new Error('no adapter descriptor factory found for handle'));
		}
		const session = await this.getSession(sessionDto);
		return this.getAdapterDescriptor(adapterDescriptorFactory, session).then(adapterDescriptor => {
			if (!adapterDescriptor) {
				throw new Error(`Couldn't find a debug adapter descriptor for debug type '${session.type}'`);
			}
			return this.convertToDto(adapterDescriptor);
		});
	}

	public async $acceptDebugSessionStarted(sessionDto: IDebugSessionDto): Promise<void> {
		const session = await this.getSession(sessionDto);
		this._onDidStartDebugSession.fire(session.api);
	}

	public async $acceptDebugSessionTerminated(sessionDto: IDebugSessionDto): Promise<void> {
		const session = await this.getSession(sessionDto);
		if (session) {
			this._onDidTerminateDebugSession.fire(session.api);
			this._debugSessions.delete(session.id);
		}
	}

	public async $acceptDebugSessionActiveChanged(sessionDto: IDebugSessionDto | undefined): Promise<void> {
		this._activeDebugSession = sessionDto ? await this.getSession(sessionDto) : undefined;
		this._onDidChangeActiveDebugSession.fire(this._activeDebugSession?.api);
	}

	public async $acceptDebugSessionNameChanged(sessionDto: IDebugSessionDto, name: string): Promise<void> {
		const session = await this.getSession(sessionDto);
		session?._acceptNameChanged(name);
	}

	public async $acceptDebugSessionCustomEvent(sessionDto: IDebugSessionDto, event: any): Promise<void> {
		const session = await this.getSession(sessionDto);
		const ee: vscode.DebugSessionCustomEvent = {
			session: session.api,
			event: event.event,
			body: event.body
		};
		this._onDidReceiveDebugSessionCustomEvent.fire(ee);
	}

	// private & dto helpers

	private convertToDto(x: vscode.DebugAdapterDescriptor): Dto<IAdapterDescriptor> {
		if (x instanceof DebugAdapterExecutable) {
			return this.convertExecutableToDto(x);
		} else if (x instanceof DebugAdapterServer) {
			return this.convertServerToDto(x);
		} else if (x instanceof DebugAdapterNamedPipeServer) {
			return this.convertPipeServerToDto(x);
		} else if (x instanceof DebugAdapterInlineImplementation) {
			return this.convertImplementationToDto(x);
		} else {
			throw new Error('convertToDto unexpected type');
		}
	}

	protected convertExecutableToDto(x: DebugAdapterExecutable): IDebugAdapterExecutable {
		return {
			type: 'executable',
			command: x.command,
			args: x.args,
			options: x.options
		};
	}

	protected convertServerToDto(x: DebugAdapterServer): IDebugAdapterServer {
		return {
			type: 'server',
			port: x.port,
			host: x.host
		};
	}

	protected convertPipeServerToDto(x: DebugAdapterNamedPipeServer): IDebugAdapterNamedPipeServer {
		return {
			type: 'pipeServer',
			path: x.path
		};
	}

	protected convertImplementationToDto(x: DebugAdapterInlineImplementation): IDebugAdapterImpl {
		return {
			type: 'implementation',
		};
	}

	private getAdapterDescriptorFactoryByType(type: string): vscode.DebugAdapterDescriptorFactory | undefined {
		const results = this._adapterFactories.filter(p => p.type === type);
		if (results.length > 0) {
			return results[0].factory;
		}
		return undefined;
	}

	private getAdapterDescriptorFactoryByHandle(handle: number): vscode.DebugAdapterDescriptorFactory | undefined {
		const results = this._adapterFactories.filter(p => p.handle === handle);
		if (results.length > 0) {
			return results[0].factory;
		}
		return undefined;
	}

	private getConfigProviderByHandle(handle: number): vscode.DebugConfigurationProvider | undefined {
		const results = this._configProviders.filter(p => p.handle === handle);
		if (results.length > 0) {
			return results[0].provider;
		}
		return undefined;
	}

	private definesDebugType(ed: IExtensionDescription, type: string) {
		if (ed.contributes) {
			const debuggers = ed.contributes['debuggers'];
			if (debuggers && debuggers.length > 0) {
				for (const dbg of debuggers) {
					// only debugger contributions with a "label" are considered a "defining" debugger contribution
					if (dbg.label && dbg.type) {
						if (dbg.type === type) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	private getDebugAdapterTrackers(session: ExtHostDebugSession): Promise<vscode.DebugAdapterTracker | undefined> {

		const config = session.configuration;
		const type = config.type;

		const promises = this._trackerFactories
			.filter(tuple => tuple.type === type || tuple.type === '*')
			.map(tuple => asPromise<vscode.ProviderResult<vscode.DebugAdapterTracker>>(() => tuple.factory.createDebugAdapterTracker(session.api)).then(p => p, err => null));

		return Promise.race([
			Promise.all(promises).then(result => {
				const trackers = coalesce(result);	// filter null
				if (trackers.length > 0) {
					return new MultiTracker(trackers);
				}
				return undefined;
			}),
			new Promise<undefined>(resolve => setTimeout(() => resolve(undefined), 1000)),
		]).catch(err => {
			// ignore errors
			return undefined;
		});
	}

	private async getAdapterDescriptor(adapterDescriptorFactory: vscode.DebugAdapterDescriptorFactory | undefined, session: ExtHostDebugSession): Promise<vscode.DebugAdapterDescriptor | undefined> {

		// a "debugServer" attribute in the launch config takes precedence
		const serverPort = session.configuration.debugServer;
		if (typeof serverPort === 'number') {
			return Promise.resolve(new DebugAdapterServer(serverPort));
		}

		if (adapterDescriptorFactory) {
			const extensionRegistry = await this._extensionService.getExtensionRegistry();
			return asPromise(() => adapterDescriptorFactory.createDebugAdapterDescriptor(session.api, this.daExecutableFromPackage(session, extensionRegistry))).then(daDescriptor => {
				if (daDescriptor) {
					return daDescriptor;
				}
				return undefined;
			});
		}

		// fallback: use executable information from package.json
		const extensionRegistry = await this._extensionService.getExtensionRegistry();
		return Promise.resolve(this.daExecutableFromPackage(session, extensionRegistry));
	}

	protected daExecutableFromPackage(session: ExtHostDebugSession, extensionRegistry: ExtensionDescriptionRegistry): DebugAdapterExecutable | undefined {
		return undefined;
	}

	private fireBreakpointChanges(added: vscode.Breakpoint[], removed: vscode.Breakpoint[], changed: vscode.Breakpoint[]) {
		if (added.length > 0 || removed.length > 0 || changed.length > 0) {
			this._onDidChangeBreakpoints.fire(Object.freeze({
				added,
				removed,
				changed,
			}));
		}
	}

	private async getSession(dto: IDebugSessionDto): Promise<ExtHostDebugSession> {
		if (dto) {
			if (typeof dto === 'string') {
				const ds = this._debugSessions.get(dto);
				if (ds) {
					return ds;
				}
			} else {
				let ds = this._debugSessions.get(dto.id);
				if (!ds) {
					const folder = await this.getFolder(dto.folderUri);
					const parent = dto.parent ? this._debugSessions.get(dto.parent) : undefined;
					ds = new ExtHostDebugSession(this._debugServiceProxy, dto.id, dto.type, dto.name, folder, dto.configuration, parent?.api);
					this._debugSessions.set(ds.id, ds);
					this._debugServiceProxy.$sessionCached(ds.id);
				}
				return ds;
			}
		}
		throw new Error('cannot find session');
	}

	private getFolder(_folderUri: UriComponents | undefined): Promise<vscode.WorkspaceFolder | undefined> {
		if (_folderUri) {
			const folderURI = URI.revive(_folderUri);
			return this._workspaceService.resolveWorkspaceFolder(folderURI);
		}
		return Promise.resolve(undefined);
	}

	private extensionVisKey(extensionId: string, id: string) {
		return `${extensionId}\0${id}`;
	}

	private serializeVisualization(extensionId: string, viz: vscode.DebugVisualization['visualization']): MainThreadDebugVisualization | undefined {
		if (!viz) {
			return undefined;
		}

		if ('title' in viz && 'command' in viz) {
			return { type: DebugVisualizationType.Command };
		}

		if ('treeId' in viz) {
			return { type: DebugVisualizationType.Tree, id: `${extensionId}\0${viz.treeId}` };
		}

		throw new Error('Unsupported debug visualization type');
	}

	private getIconPathOrClass(icon: vscode.DebugVisualization['iconPath']) {
		const iconPathOrIconClass = this.getIconUris(icon);
		let iconPath: { dark: URI; light?: URI | undefined } | undefined;
		let iconClass: string | undefined;
		if ('id' in iconPathOrIconClass) {
			iconClass = ThemeIconUtils.asClassName(iconPathOrIconClass);
		} else {
			iconPath = iconPathOrIconClass;
		}

		return {
			iconPath,
			iconClass
		};
	}

	private getIconUris(iconPath: vscode.DebugVisualization['iconPath']): { dark: URI; light?: URI } | { id: string } {
		if (iconPath instanceof ThemeIcon) {
			return { id: iconPath.id };
		}
		const dark = typeof iconPath === 'object' && 'dark' in iconPath ? iconPath.dark : iconPath;
		const light = typeof iconPath === 'object' && 'light' in iconPath ? iconPath.light : iconPath;
		return {
			dark: (typeof dark === 'string' ? URI.file(dark) : dark) as URI,
			light: (typeof light === 'string' ? URI.file(light) : light) as URI,
		};
	}
}

export class ExtHostDebugSession {
	private apiSession?: vscode.DebugSession;
	constructor(
		private _debugServiceProxy: MainThreadDebugServiceShape,
		private _id: DebugSessionUUID,
		private _type: string,
		private _name: string,
		private _workspaceFolder: vscode.WorkspaceFolder | undefined,
		private _configuration: vscode.DebugConfiguration,
		private _parentSession: vscode.DebugSession | undefined) {
	}

	public get api(): vscode.DebugSession {
		const that = this;
		return this.apiSession ??= Object.freeze({
			id: that._id,
			type: that._type,
			get name() {
				return that._name;
			},
			set name(name: string) {
				that._name = name;
				that._debugServiceProxy.$setDebugSessionName(that._id, name);
			},
			parentSession: that._parentSession,
			workspaceFolder: that._workspaceFolder,
			configuration: that._configuration,
			customRequest(command: string, args: any): Promise<any> {
				return that._debugServiceProxy.$customDebugAdapterRequest(that._id, command, args);
			},
			getDebugProtocolBreakpoint(breakpoint: vscode.Breakpoint): Promise<vscode.DebugProtocolBreakpoint | undefined> {
				return that._debugServiceProxy.$getDebugProtocolBreakpoint(that._id, breakpoint.id);
			}
		});
	}

	public get id(): string {
		return this._id;
	}

	public get type(): string {
		return this._type;
	}

	_acceptNameChanged(name: string) {
		this._name = name;
	}

	public get configuration(): vscode.DebugConfiguration {
		return this._configuration;
	}
}

export class ExtHostDebugConsole {

	readonly value: vscode.DebugConsole;

	constructor(proxy: MainThreadDebugServiceShape) {

		this.value = Object.freeze({
			append(value: string): void {
				proxy.$appendDebugConsole(value);
			},
			appendLine(value: string): void {
				this.append(value + '\n');
			}
		});
	}
}

interface ConfigProviderTuple {
	type: string;
	handle: number;
	provider: vscode.DebugConfigurationProvider;
}

interface DescriptorFactoryTuple {
	type: string;
	handle: number;
	factory: vscode.DebugAdapterDescriptorFactory;
}

interface TrackerFactoryTuple {
	type: string;
	handle: number;
	factory: vscode.DebugAdapterTrackerFactory;
}

class MultiTracker implements vscode.DebugAdapterTracker {

	constructor(private trackers: vscode.DebugAdapterTracker[]) {
	}

	onWillStartSession(): void {
		this.trackers.forEach(t => t.onWillStartSession ? t.onWillStartSession() : undefined);
	}

	onWillReceiveMessage(message: any): void {
		this.trackers.forEach(t => t.onWillReceiveMessage ? t.onWillReceiveMessage(message) : undefined);
	}

	onDidSendMessage(message: any): void {
		this.trackers.forEach(t => t.onDidSendMessage ? t.onDidSendMessage(message) : undefined);
	}

	onWillStopSession(): void {
		this.trackers.forEach(t => t.onWillStopSession ? t.onWillStopSession() : undefined);
	}

	onError(error: Error): void {
		this.trackers.forEach(t => t.onError ? t.onError(error) : undefined);
	}

	onExit(code: number, signal: string): void {
		this.trackers.forEach(t => t.onExit ? t.onExit(code, signal) : undefined);
	}
}

/*
 * Call directly into a debug adapter implementation
 */
class DirectDebugAdapter extends AbstractDebugAdapter {

	constructor(private implementation: vscode.DebugAdapter) {
		super();

		implementation.onDidSendMessage((message: vscode.DebugProtocolMessage) => {
			this.acceptMessage(message as DebugProtocol.ProtocolMessage);
		});
	}

	startSession(): Promise<void> {
		return Promise.resolve(undefined);
	}

	sendMessage(message: DebugProtocol.ProtocolMessage): void {
		this.implementation.handleMessage(message);
	}

	stopSession(): Promise<void> {
		this.implementation.dispose();
		return Promise.resolve(undefined);
	}
}


export class WorkerExtHostDebugService extends ExtHostDebugServiceBase {
	constructor(
		@IExtHostRpcService extHostRpcService: IExtHostRpcService,
		@IExtHostWorkspace workspaceService: IExtHostWorkspace,
		@IExtHostExtensionService extensionService: IExtHostExtensionService,
		@IExtHostConfiguration configurationService: IExtHostConfiguration,
		@IExtHostEditorTabs editorTabs: IExtHostEditorTabs,
		@IExtHostVariableResolverProvider variableResolver: IExtHostVariableResolverProvider,
		@IExtHostCommands commands: IExtHostCommands,
		@IExtHostTesting testing: IExtHostTesting,
	) {
		super(extHostRpcService, workspaceService, extensionService, configurationService, editorTabs, variableResolver, commands, testing);
	}
}

// Collecting info for #233167 specifically
type DebugProtocolMessageErrorClassification = {
	from: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of the debug adapter that the event is from.' };
	type: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of the event that was malformed.' };
	owner: 'roblourens';
	comment: 'Sent to collect details about misbehaving debug extensions.';
};

type DebugProtocolMessageErrorEvent = {
	from: string;
	type: string;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDecorations.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { URI } from '../../../base/common/uri.js';
import { MainContext, ExtHostDecorationsShape, MainThreadDecorationsShape, DecorationData, DecorationRequest, DecorationReply } from './extHost.protocol.js';
import { Disposable, FileDecoration } from './extHostTypes.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { asArray, groupBy } from '../../../base/common/arrays.js';
import { compare, count } from '../../../base/common/strings.js';
import { dirname } from '../../../base/common/path.js';
import { checkProposedApiEnabled } from '../../services/extensions/common/extensions.js';

interface ProviderData {
	provider: vscode.FileDecorationProvider;
	extensionDescription: IExtensionDescription;
}

export class ExtHostDecorations implements ExtHostDecorationsShape {

	private static _handlePool = 0;
	private static _maxEventSize = 250;

	readonly _serviceBrand: undefined;
	private readonly _provider = new Map<number, ProviderData>();
	private readonly _proxy: MainThreadDecorationsShape;

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadDecorations);
	}

	registerFileDecorationProvider(provider: vscode.FileDecorationProvider, extensionDescription: IExtensionDescription): vscode.Disposable {
		const handle = ExtHostDecorations._handlePool++;
		this._provider.set(handle, { provider, extensionDescription });
		this._proxy.$registerDecorationProvider(handle, extensionDescription.identifier.value);

		const listener = provider.onDidChangeFileDecorations && provider.onDidChangeFileDecorations(e => {
			if (!e) {
				this._proxy.$onDidChange(handle, null);
				return;
			}
			const array = asArray(e);
			if (array.length <= ExtHostDecorations._maxEventSize) {
				this._proxy.$onDidChange(handle, array);
				return;
			}

			// too many resources per event. pick one resource per folder, starting
			// with parent folders
			this._logService.warn('[Decorations] CAPPING events from decorations provider', extensionDescription.identifier.value, array.length);
			const mapped = array.map(uri => ({ uri, rank: count(uri.path, '/') }));
			const groups = groupBy(mapped, (a, b) => a.rank - b.rank || compare(a.uri.path, b.uri.path));
			const picked: URI[] = [];
			outer: for (const uris of groups) {
				let lastDirname: string | undefined;
				for (const obj of uris) {
					const myDirname = dirname(obj.uri.path);
					if (lastDirname !== myDirname) {
						lastDirname = myDirname;
						if (picked.push(obj.uri) >= ExtHostDecorations._maxEventSize) {
							break outer;
						}
					}
				}
			}
			this._proxy.$onDidChange(handle, picked);
		});

		return new Disposable(() => {
			listener?.dispose();
			this._proxy.$unregisterDecorationProvider(handle);
			this._provider.delete(handle);
		});
	}

	async $provideDecorations(handle: number, requests: DecorationRequest[], token: CancellationToken): Promise<DecorationReply> {

		if (!this._provider.has(handle)) {
			// might have been unregistered in the meantime
			return Object.create(null);
		}

		const result: DecorationReply = Object.create(null);
		const { provider, extensionDescription: extensionId } = this._provider.get(handle)!;

		await Promise.all(requests.map(async request => {
			try {
				const { uri, id } = request;
				const data = await Promise.resolve(provider.provideFileDecoration(URI.revive(uri), token));
				if (!data) {
					return;
				}
				try {
					FileDecoration.validate(data);
					if (data.badge && typeof data.badge !== 'string') {
						checkProposedApiEnabled(extensionId, 'codiconDecoration');
					}
					result[id] = <DecorationData>[data.propagate, data.tooltip, data.badge, data.color];
				} catch (e) {
					this._logService.warn(`INVALID decoration from extension '${extensionId.identifier.value}': ${e}`);
				}
			} catch (err) {
				this._logService.error(err);
			}
		}));

		return result;
	}
}

export const IExtHostDecorations = createDecorator<IExtHostDecorations>('IExtHostDecorations');
export interface IExtHostDecorations extends ExtHostDecorations { }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDiagnostics.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDiagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable local/code-no-native-private */

import { localize } from '../../../nls.js';
import { IMarkerData, MarkerSeverity } from '../../../platform/markers/common/markers.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import type * as vscode from 'vscode';
import { MainContext, MainThreadDiagnosticsShape, ExtHostDiagnosticsShape, IMainContext } from './extHost.protocol.js';
import { DiagnosticSeverity } from './extHostTypes.js';
import * as converter from './extHostTypeConverters.js';
import { Event, Emitter, DebounceEmitter } from '../../../base/common/event.js';
import { coalesce } from '../../../base/common/arrays.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ResourceMap } from '../../../base/common/map.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IExtHostFileSystemInfo } from './extHostFileSystemInfo.js';
import { IExtUri } from '../../../base/common/resources.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';

export class DiagnosticCollection implements vscode.DiagnosticCollection {

	readonly #proxy: MainThreadDiagnosticsShape | undefined;
	readonly #onDidChangeDiagnostics: Emitter<readonly vscode.Uri[]>;
	readonly #data: ResourceMap<vscode.Diagnostic[]>;

	private _isDisposed = false;

	constructor(
		private readonly _name: string,
		private readonly _owner: string,
		private readonly _maxDiagnosticsTotal: number,
		private readonly _maxDiagnosticsPerFile: number,
		private readonly _modelVersionIdProvider: (uri: URI) => number | undefined,
		extUri: IExtUri,
		proxy: MainThreadDiagnosticsShape | undefined,
		onDidChangeDiagnostics: Emitter<readonly vscode.Uri[]>
	) {
		this._maxDiagnosticsTotal = Math.max(_maxDiagnosticsPerFile, _maxDiagnosticsTotal);
		this.#data = new ResourceMap(uri => extUri.getComparisonKey(uri));
		this.#proxy = proxy;
		this.#onDidChangeDiagnostics = onDidChangeDiagnostics;
	}

	dispose(): void {
		if (!this._isDisposed) {
			this.#onDidChangeDiagnostics.fire([...this.#data.keys()]);
			this.#proxy?.$clear(this._owner);
			this.#data.clear();
			this._isDisposed = true;
		}
	}

	get name(): string {
		this._checkDisposed();
		return this._name;
	}

	set(uri: vscode.Uri, diagnostics: ReadonlyArray<vscode.Diagnostic>): void;
	set(entries: ReadonlyArray<[vscode.Uri, ReadonlyArray<vscode.Diagnostic>]>): void;
	set(first: vscode.Uri | ReadonlyArray<[vscode.Uri, ReadonlyArray<vscode.Diagnostic>]>, diagnostics?: ReadonlyArray<vscode.Diagnostic>) {

		if (!first) {
			// this set-call is a clear-call
			this.clear();
			return;
		}

		// the actual implementation for #set

		this._checkDisposed();
		let toSync: vscode.Uri[] = [];

		if (URI.isUri(first)) {

			if (!diagnostics) {
				// remove this entry
				this.delete(first);
				return;
			}

			// update single row
			this.#data.set(first, coalesce(diagnostics));
			toSync = [first];

		} else if (Array.isArray(first)) {
			// update many rows
			toSync = [];
			let lastUri: vscode.Uri | undefined;

			// ensure stable-sort
			first = [...first].sort(DiagnosticCollection._compareIndexedTuplesByUri);

			for (const tuple of first) {
				const [uri, diagnostics] = tuple;
				if (!lastUri || uri.toString() !== lastUri.toString()) {
					if (lastUri && this.#data.get(lastUri)!.length === 0) {
						this.#data.delete(lastUri);
					}
					lastUri = uri;
					toSync.push(uri);
					this.#data.set(uri, []);
				}

				if (!diagnostics) {
					// [Uri, undefined] means clear this
					const currentDiagnostics = this.#data.get(uri);
					if (currentDiagnostics) {
						currentDiagnostics.length = 0;
					}
				} else {
					const currentDiagnostics = this.#data.get(uri);
					currentDiagnostics?.push(...coalesce(diagnostics));
				}
			}
		}

		// send event for extensions
		this.#onDidChangeDiagnostics.fire(toSync);

		// compute change and send to main side
		if (!this.#proxy) {
			return;
		}
		const entries: [URI, IMarkerData[]][] = [];
		let totalMarkerCount = 0;
		for (const uri of toSync) {
			let marker: IMarkerData[] = [];
			const diagnostics = this.#data.get(uri);
			if (diagnostics) {

				// no more than N diagnostics per file
				if (diagnostics.length > this._maxDiagnosticsPerFile) {
					marker = [];
					const order = [DiagnosticSeverity.Error, DiagnosticSeverity.Warning, DiagnosticSeverity.Information, DiagnosticSeverity.Hint];
					orderLoop: for (let i = 0; i < 4; i++) {
						for (const diagnostic of diagnostics) {
							if (diagnostic.severity === order[i]) {
								const len = marker.push({ ...converter.Diagnostic.from(diagnostic), modelVersionId: this._modelVersionIdProvider(uri) });
								if (len === this._maxDiagnosticsPerFile) {
									break orderLoop;
								}
							}
						}
					}

					// add 'signal' marker for showing omitted errors/warnings
					marker.push({
						severity: MarkerSeverity.Info,
						message: localize({ key: 'limitHit', comment: ['amount of errors/warning skipped due to limits'] }, "Not showing {0} further errors and warnings.", diagnostics.length - this._maxDiagnosticsPerFile),
						startLineNumber: marker[marker.length - 1].startLineNumber,
						startColumn: marker[marker.length - 1].startColumn,
						endLineNumber: marker[marker.length - 1].endLineNumber,
						endColumn: marker[marker.length - 1].endColumn
					});
				} else {
					marker = diagnostics.map(diag => ({ ...converter.Diagnostic.from(diag), modelVersionId: this._modelVersionIdProvider(uri) }));
				}
			}

			entries.push([uri, marker]);

			totalMarkerCount += marker.length;
			if (totalMarkerCount > this._maxDiagnosticsTotal) {
				// ignore markers that are above the limit
				break;
			}
		}
		this.#proxy.$changeMany(this._owner, entries);
	}

	delete(uri: vscode.Uri): void {
		this._checkDisposed();
		this.#onDidChangeDiagnostics.fire([uri]);
		this.#data.delete(uri);
		this.#proxy?.$changeMany(this._owner, [[uri, undefined]]);
	}

	clear(): void {
		this._checkDisposed();
		this.#onDidChangeDiagnostics.fire([...this.#data.keys()]);
		this.#data.clear();
		this.#proxy?.$clear(this._owner);
	}

	forEach(callback: (uri: URI, diagnostics: ReadonlyArray<vscode.Diagnostic>, collection: DiagnosticCollection) => unknown, thisArg?: unknown): void {
		this._checkDisposed();
		for (const [uri, values] of this) {
			callback.call(thisArg, uri, values, this);
		}
	}

	*[Symbol.iterator](): IterableIterator<[uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]]> {
		this._checkDisposed();
		for (const uri of this.#data.keys()) {
			yield [uri, this.get(uri)];
		}
	}

	get(uri: URI): ReadonlyArray<vscode.Diagnostic> {
		this._checkDisposed();
		const result = this.#data.get(uri);
		if (Array.isArray(result)) {
			return Object.freeze(result.slice(0));
		}
		return [];
	}

	has(uri: URI): boolean {
		this._checkDisposed();
		return Array.isArray(this.#data.get(uri));
	}

	private _checkDisposed() {
		if (this._isDisposed) {
			throw new Error('illegal state - object is disposed');
		}
	}

	private static _compareIndexedTuplesByUri(a: [vscode.Uri, readonly vscode.Diagnostic[]], b: [vscode.Uri, readonly vscode.Diagnostic[]]): number {
		if (a[0].toString() < b[0].toString()) {
			return -1;
		} else if (a[0].toString() > b[0].toString()) {
			return 1;
		} else {
			return 0;
		}
	}
}

export class ExtHostDiagnostics implements ExtHostDiagnosticsShape {

	private static _idPool: number = 0;
	private static readonly _maxDiagnosticsPerFile: number = 1000;
	private static readonly _maxDiagnosticsTotal: number = 1.1 * this._maxDiagnosticsPerFile;

	private readonly _proxy: MainThreadDiagnosticsShape;
	private readonly _collections = new Map<string, DiagnosticCollection>();
	private readonly _onDidChangeDiagnostics = new DebounceEmitter<readonly vscode.Uri[]>({ merge: all => all.flat(), delay: 50 });

	static _mapper(last: readonly vscode.Uri[]): { uris: readonly vscode.Uri[] } {
		const map = new ResourceMap<vscode.Uri>();
		for (const uri of last) {
			map.set(uri, uri);
		}
		return { uris: Object.freeze(Array.from(map.values())) };
	}

	readonly onDidChangeDiagnostics: Event<vscode.DiagnosticChangeEvent> = Event.map(this._onDidChangeDiagnostics.event, ExtHostDiagnostics._mapper);

	constructor(
		mainContext: IMainContext,
		@ILogService private readonly _logService: ILogService,
		@IExtHostFileSystemInfo private readonly _fileSystemInfoService: IExtHostFileSystemInfo,
		private readonly _extHostDocumentsAndEditors: ExtHostDocumentsAndEditors,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadDiagnostics);
	}

	createDiagnosticCollection(extensionId: ExtensionIdentifier, name?: string): vscode.DiagnosticCollection {

		const { _collections, _proxy, _onDidChangeDiagnostics, _logService, _fileSystemInfoService, _extHostDocumentsAndEditors } = this;

		const loggingProxy = new class implements MainThreadDiagnosticsShape {
			$changeMany(owner: string, entries: [UriComponents, IMarkerData[] | undefined][]): void {
				_proxy.$changeMany(owner, entries);
				_logService.trace('[DiagnosticCollection] change many (extension, owner, uris)', extensionId.value, owner, entries.length === 0 ? 'CLEARING' : entries);
			}
			$clear(owner: string): void {
				_proxy.$clear(owner);
				_logService.trace('[DiagnosticCollection] remove all (extension, owner)', extensionId.value, owner);
			}
			dispose(): void {
				_proxy.dispose();
			}
		};


		let owner: string;
		if (!name) {
			name = '_generated_diagnostic_collection_name_#' + ExtHostDiagnostics._idPool++;
			owner = name;
		} else if (!_collections.has(name)) {
			owner = name;
		} else {
			this._logService.warn(`DiagnosticCollection with name '${name}' does already exist.`);
			do {
				owner = name + ExtHostDiagnostics._idPool++;
			} while (_collections.has(owner));
		}

		const result = new class extends DiagnosticCollection {
			constructor() {
				super(
					name!, owner,
					ExtHostDiagnostics._maxDiagnosticsTotal,
					ExtHostDiagnostics._maxDiagnosticsPerFile,
					uri => _extHostDocumentsAndEditors.getDocument(uri)?.version,
					_fileSystemInfoService.extUri, loggingProxy, _onDidChangeDiagnostics
				);
				_collections.set(owner, this);
			}
			override dispose() {
				super.dispose();
				_collections.delete(owner);
			}
		};

		return result;
	}

	getDiagnostics(resource: vscode.Uri): ReadonlyArray<vscode.Diagnostic>;
	getDiagnostics(): ReadonlyArray<[vscode.Uri, ReadonlyArray<vscode.Diagnostic>]>;
	getDiagnostics(resource?: vscode.Uri): ReadonlyArray<vscode.Diagnostic> | ReadonlyArray<[vscode.Uri, ReadonlyArray<vscode.Diagnostic>]>;
	getDiagnostics(resource?: vscode.Uri): ReadonlyArray<vscode.Diagnostic> | ReadonlyArray<[vscode.Uri, ReadonlyArray<vscode.Diagnostic>]> {
		if (resource) {
			return this._getDiagnostics(resource);
		} else {
			const index = new Map<string, number>();
			const res: [vscode.Uri, vscode.Diagnostic[]][] = [];
			for (const collection of this._collections.values()) {
				collection.forEach((uri, diagnostics) => {
					let idx = index.get(uri.toString());
					if (typeof idx === 'undefined') {
						idx = res.length;
						index.set(uri.toString(), idx);
						res.push([uri, []]);
					}
					res[idx][1] = res[idx][1].concat(...diagnostics);
				});
			}
			return res;
		}
	}

	private _getDiagnostics(resource: vscode.Uri): ReadonlyArray<vscode.Diagnostic> {
		let res: vscode.Diagnostic[] = [];
		for (const collection of this._collections.values()) {
			if (collection.has(resource)) {
				res = res.concat(collection.get(resource));
			}
		}
		return res;
	}

	private _mirrorCollection: vscode.DiagnosticCollection | undefined;

	$acceptMarkersChange(data: [UriComponents, IMarkerData[]][]): void {

		if (!this._mirrorCollection) {
			const name = '_generated_mirror';
			const collection = new DiagnosticCollection(
				name, name,
				Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, // no limits because this collection is just a mirror of "sanitized" data
				_uri => undefined,
				this._fileSystemInfoService.extUri, undefined, this._onDidChangeDiagnostics
			);
			this._collections.set(name, collection);
			this._mirrorCollection = collection;
		}

		for (const [uri, markers] of data) {
			this._mirrorCollection.set(URI.revive(uri), markers.map(converter.Diagnostic.to));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDialogs.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDialogs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as vscode from 'vscode';
import { URI } from '../../../base/common/uri.js';
import { MainContext, MainThreadDiaglogsShape, IMainContext } from './extHost.protocol.js';

export class ExtHostDialogs {

	private readonly _proxy: MainThreadDiaglogsShape;

	constructor(mainContext: IMainContext) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadDialogs);
	}

	showOpenDialog(options?: vscode.OpenDialogOptions): Promise<URI[] | undefined> {
		return this._proxy.$showOpenDialog(options).then(filepaths => {
			return filepaths ? filepaths.map(p => URI.revive(p)) : undefined;
		});
	}

	showSaveDialog(options?: vscode.SaveDialogOptions): Promise<URI | undefined> {
		return this._proxy.$showSaveDialog(options).then(filepath => {
			return filepath ? URI.revive(filepath) : undefined;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDocumentContentProviders.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDocumentContentProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../base/common/errors.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { Disposable } from './extHostTypes.js';
import type * as vscode from 'vscode';
import { MainContext, ExtHostDocumentContentProvidersShape, MainThreadDocumentContentProvidersShape, IMainContext } from './extHost.protocol.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import { Schemas } from '../../../base/common/network.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { splitLines } from '../../../base/common/strings.js';

export class ExtHostDocumentContentProvider implements ExtHostDocumentContentProvidersShape {

	private static _handlePool = 0;

	private readonly _documentContentProviders = new Map<number, vscode.TextDocumentContentProvider>();
	private readonly _proxy: MainThreadDocumentContentProvidersShape;

	constructor(
		mainContext: IMainContext,
		private readonly _documentsAndEditors: ExtHostDocumentsAndEditors,
		private readonly _logService: ILogService,
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadDocumentContentProviders);
	}

	registerTextDocumentContentProvider(scheme: string, provider: vscode.TextDocumentContentProvider): vscode.Disposable {
		// todo@remote
		// check with scheme from fs-providers!
		if (Object.keys(Schemas).indexOf(scheme) >= 0) {
			throw new Error(`scheme '${scheme}' already registered`);
		}

		const handle = ExtHostDocumentContentProvider._handlePool++;

		this._documentContentProviders.set(handle, provider);
		this._proxy.$registerTextContentProvider(handle, scheme);

		let subscription: IDisposable | undefined;
		if (typeof provider.onDidChange === 'function') {

			let lastEvent: Promise<void> | undefined;

			subscription = provider.onDidChange(async uri => {
				if (uri.scheme !== scheme) {
					this._logService.warn(`Provider for scheme '${scheme}' is firing event for schema '${uri.scheme}' which will be IGNORED`);
					return;
				}
				if (!this._documentsAndEditors.getDocument(uri)) {
					// ignore event if document isn't open
					return;
				}

				if (lastEvent) {
					await lastEvent;
				}

				const thisEvent = this.$provideTextDocumentContent(handle, uri)
					.then(async value => {
						if (!value && typeof value !== 'string') {
							return;
						}

						const document = this._documentsAndEditors.getDocument(uri);
						if (!document) {
							// disposed in the meantime
							return;
						}

						// create lines and compare
						const lines = splitLines(value);

						// broadcast event when content changed
						if (!document.equalLines(lines)) {
							return this._proxy.$onVirtualDocumentChange(uri, value);
						}
					})
					.catch(onUnexpectedError)
					.finally(() => {
						if (lastEvent === thisEvent) {
							lastEvent = undefined;
						}
					});

				lastEvent = thisEvent;
			});
		}
		return new Disposable(() => {
			if (this._documentContentProviders.delete(handle)) {
				this._proxy.$unregisterTextContentProvider(handle);
			}
			if (subscription) {
				subscription.dispose();
				subscription = undefined;
			}
		});
	}

	$provideTextDocumentContent(handle: number, uri: UriComponents): Promise<string | null | undefined> {
		const provider = this._documentContentProviders.get(handle);
		if (!provider) {
			return Promise.reject(new Error(`unsupported uri-scheme: ${uri.scheme}`));
		}
		return Promise.resolve(provider.provideTextDocumentContent(URI.revive(uri), CancellationToken.None));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDocumentData.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDocumentData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ok } from '../../../base/common/assert.js';
import { Schemas } from '../../../base/common/network.js';
import { regExpLeadsToEndlessLoop } from '../../../base/common/strings.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { MirrorTextModel } from '../../../editor/common/model/mirrorTextModel.js';
import { ensureValidWordDefinition, getWordAtText } from '../../../editor/common/core/wordHelper.js';
import type * as vscode from 'vscode';
import { equals } from '../../../base/common/arrays.js';
import { EndOfLine } from './extHostTypes/textEdit.js';
import { Position } from './extHostTypes/position.js';
import { Range } from './extHostTypes/range.js';

const _languageId2WordDefinition = new Map<string, RegExp>();
export function setWordDefinitionFor(languageId: string, wordDefinition: RegExp | undefined): void {
	if (!wordDefinition) {
		_languageId2WordDefinition.delete(languageId);
	} else {
		_languageId2WordDefinition.set(languageId, wordDefinition);
	}
}

function getWordDefinitionFor(languageId: string): RegExp | undefined {
	return _languageId2WordDefinition.get(languageId);
}

export interface IExtHostDocumentSaveDelegate {
	$trySaveDocument(uri: UriComponents): Promise<boolean>;
}

export class ExtHostDocumentData extends MirrorTextModel {

	private _document?: vscode.TextDocument;
	private _isDisposed: boolean = false;

	constructor(
		private readonly _proxy: IExtHostDocumentSaveDelegate,
		uri: URI, lines: string[], eol: string, versionId: number,
		private _languageId: string,
		private _isDirty: boolean,
		private _encoding: string,
		private readonly _strictInstanceofChecks = true // used for code reuse
	) {
		super(uri, lines, eol, versionId);
	}

	// eslint-disable-next-line local/code-must-use-super-dispose
	override dispose(): void {
		// we don't really dispose documents but let
		// extensions still read from them. some
		// operations, live saving, will now error tho
		ok(!this._isDisposed);
		this._isDisposed = true;
		this._isDirty = false;
	}

	equalLines(lines: readonly string[]): boolean {
		return equals(this._lines, lines);
	}

	get document(): vscode.TextDocument {
		if (!this._document) {
			const that = this;
			this._document = {
				get uri() { return that._uri; },
				get fileName() { return that._uri.fsPath; },
				get isUntitled() { return that._uri.scheme === Schemas.untitled; },
				get languageId() { return that._languageId; },
				get version() { return that._versionId; },
				get isClosed() { return that._isDisposed; },
				get isDirty() { return that._isDirty; },
				get encoding() { return that._encoding; },
				save() { return that._save(); },
				getText(range?) { return range ? that._getTextInRange(range) : that.getText(); },
				get eol() { return that._eol === '\n' ? EndOfLine.LF : EndOfLine.CRLF; },
				get lineCount() { return that._lines.length; },
				lineAt(lineOrPos: number | vscode.Position) { return that._lineAt(lineOrPos); },
				offsetAt(pos) { return that._offsetAt(pos); },
				positionAt(offset) { return that._positionAt(offset); },
				validateRange(ran) { return that._validateRange(ran); },
				validatePosition(pos) { return that._validatePosition(pos); },
				getWordRangeAtPosition(pos, regexp?) { return that._getWordRangeAtPosition(pos, regexp); },
				[Symbol.for('debug.description')]() {
					return `TextDocument(${that._uri.toString()})`;
				}
			};
		}
		return Object.freeze(this._document);
	}

	_acceptLanguageId(newLanguageId: string): void {
		ok(!this._isDisposed);
		this._languageId = newLanguageId;
	}

	_acceptIsDirty(isDirty: boolean): void {
		ok(!this._isDisposed);
		this._isDirty = isDirty;
	}

	_acceptEncoding(encoding: string): void {
		ok(!this._isDisposed);
		this._encoding = encoding;
	}

	private _save(): Promise<boolean> {
		if (this._isDisposed) {
			return Promise.reject(new Error('Document has been closed'));
		}
		return this._proxy.$trySaveDocument(this._uri);
	}

	private _getTextInRange(_range: vscode.Range): string {
		const range = this._validateRange(_range);

		if (range.isEmpty) {
			return '';
		}

		if (range.isSingleLine) {
			return this._lines[range.start.line].substring(range.start.character, range.end.character);
		}

		const lineEnding = this._eol,
			startLineIndex = range.start.line,
			endLineIndex = range.end.line,
			resultLines: string[] = [];

		resultLines.push(this._lines[startLineIndex].substring(range.start.character));
		for (let i = startLineIndex + 1; i < endLineIndex; i++) {
			resultLines.push(this._lines[i]);
		}
		resultLines.push(this._lines[endLineIndex].substring(0, range.end.character));

		return resultLines.join(lineEnding);
	}

	private _lineAt(lineOrPosition: number | vscode.Position): vscode.TextLine {

		let line: number | undefined;
		if (lineOrPosition instanceof Position) {
			line = lineOrPosition.line;
		} else if (typeof lineOrPosition === 'number') {
			line = lineOrPosition;
		} else if (!this._strictInstanceofChecks && Position.isPosition(lineOrPosition)) {
			line = lineOrPosition.line;
		}

		if (typeof line !== 'number' || line < 0 || line >= this._lines.length || Math.floor(line) !== line) {
			throw new Error('Illegal value for `line`');
		}

		return new ExtHostDocumentLine(line, this._lines[line], line === this._lines.length - 1);
	}

	private _offsetAt(position: vscode.Position): number {
		position = this._validatePosition(position);
		this._ensureLineStarts();
		return this._lineStarts!.getPrefixSum(position.line - 1) + position.character;
	}

	private _positionAt(offset: number): vscode.Position {
		offset = Math.floor(offset);
		offset = Math.max(0, offset);

		this._ensureLineStarts();
		const out = this._lineStarts!.getIndexOf(offset);

		const lineLength = this._lines[out.index].length;

		// Ensure we return a valid position
		return new Position(out.index, Math.min(out.remainder, lineLength));
	}

	// ---- range math

	private _validateRange(range: vscode.Range): vscode.Range {
		if (this._strictInstanceofChecks) {
			if (!(range instanceof Range)) {
				throw new Error('Invalid argument');
			}
		} else {
			if (!Range.isRange(range)) {
				throw new Error('Invalid argument');
			}
		}

		const start = this._validatePosition(range.start);
		const end = this._validatePosition(range.end);

		if (start === range.start && end === range.end) {
			return range;
		}
		return new Range(start.line, start.character, end.line, end.character);
	}

	private _validatePosition(position: vscode.Position): vscode.Position {
		if (this._strictInstanceofChecks) {
			if (!(position instanceof Position)) {
				throw new Error('Invalid argument');
			}
		} else {
			if (!Position.isPosition(position)) {
				throw new Error('Invalid argument');
			}
		}

		if (this._lines.length === 0) {
			return position.with(0, 0);
		}

		let { line, character } = position;
		let hasChanged = false;

		if (line < 0) {
			line = 0;
			character = 0;
			hasChanged = true;
		}
		else if (line >= this._lines.length) {
			line = this._lines.length - 1;
			character = this._lines[line].length;
			hasChanged = true;
		}
		else {
			const maxCharacter = this._lines[line].length;
			if (character < 0) {
				character = 0;
				hasChanged = true;
			}
			else if (character > maxCharacter) {
				character = maxCharacter;
				hasChanged = true;
			}
		}

		if (!hasChanged) {
			return position;
		}
		return new Position(line, character);
	}

	private _getWordRangeAtPosition(_position: vscode.Position, regexp?: RegExp): vscode.Range | undefined {
		const position = this._validatePosition(_position);

		if (!regexp) {
			// use default when custom-regexp isn't provided
			regexp = getWordDefinitionFor(this._languageId);

		} else if (regExpLeadsToEndlessLoop(regexp)) {
			// use default when custom-regexp is bad
			throw new Error(`[getWordRangeAtPosition]: ignoring custom regexp '${regexp.source}' because it matches the empty string.`);
		}

		const wordAtText = getWordAtText(
			position.character + 1,
			ensureValidWordDefinition(regexp),
			this._lines[position.line],
			0
		);

		if (wordAtText) {
			return new Range(position.line, wordAtText.startColumn - 1, position.line, wordAtText.endColumn - 1);
		}
		return undefined;
	}
}

export class ExtHostDocumentLine implements vscode.TextLine {

	private readonly _line: number;
	private readonly _text: string;
	private readonly _isLastLine: boolean;

	constructor(line: number, text: string, isLastLine: boolean) {
		this._line = line;
		this._text = text;
		this._isLastLine = isLastLine;
	}

	public get lineNumber(): number {
		return this._line;
	}

	public get text(): string {
		return this._text;
	}

	public get range(): Range {
		return new Range(this._line, 0, this._line, this._text.length);
	}

	public get rangeIncludingLineBreak(): Range {
		if (this._isLastLine) {
			return this.range;
		}
		return new Range(this._line, 0, this._line + 1, 0);
	}

	public get firstNonWhitespaceCharacterIndex(): number {
		//TODO@api, rename to 'leadingWhitespaceLength'
		return /^(\s*)/.exec(this._text)![1].length;
	}

	public get isEmptyOrWhitespace(): boolean {
		return this.firstNonWhitespaceCharacterIndex === this._text.length;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDocuments.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDocuments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtHostDocumentsShape, IMainContext, MainContext, MainThreadDocumentsShape } from './extHost.protocol.js';
import { ExtHostDocumentData, setWordDefinitionFor } from './extHostDocumentData.js';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors.js';
import * as TypeConverters from './extHostTypeConverters.js';
import type * as vscode from 'vscode';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { deepFreeze } from '../../../base/common/objects.js';
import { TextDocumentChangeReason } from './extHostTypes.js';
import { ISerializedModelContentChangedEvent } from '../../../editor/common/textModelEvents.js';

export class ExtHostDocuments implements ExtHostDocumentsShape {

	private readonly _onDidAddDocument = new Emitter<vscode.TextDocument>();
	private readonly _onDidRemoveDocument = new Emitter<vscode.TextDocument>();
	private readonly _onDidChangeDocument = new Emitter<Omit<vscode.TextDocumentChangeEvent, 'detailedReason'>>();
	private readonly _onDidChangeDocumentWithReason = new Emitter<vscode.TextDocumentChangeEvent>();
	private readonly _onDidSaveDocument = new Emitter<vscode.TextDocument>();

	readonly onDidAddDocument: Event<vscode.TextDocument> = this._onDidAddDocument.event;
	readonly onDidRemoveDocument: Event<vscode.TextDocument> = this._onDidRemoveDocument.event;
	readonly onDidChangeDocument: Event<vscode.TextDocumentChangeEvent> = this._onDidChangeDocument.event as Event<vscode.TextDocumentChangeEvent>;
	readonly onDidChangeDocumentWithReason: Event<vscode.TextDocumentChangeEvent> = this._onDidChangeDocumentWithReason.event;
	readonly onDidSaveDocument: Event<vscode.TextDocument> = this._onDidSaveDocument.event;

	private readonly _toDispose = new DisposableStore();
	private _proxy: MainThreadDocumentsShape;
	private _documentsAndEditors: ExtHostDocumentsAndEditors;
	private _documentLoader = new Map<string, Promise<ExtHostDocumentData>>();

	constructor(mainContext: IMainContext, documentsAndEditors: ExtHostDocumentsAndEditors) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadDocuments);
		this._documentsAndEditors = documentsAndEditors;

		this._documentsAndEditors.onDidRemoveDocuments(documents => {
			for (const data of documents) {
				this._onDidRemoveDocument.fire(data.document);
			}
		}, undefined, this._toDispose);
		this._documentsAndEditors.onDidAddDocuments(documents => {
			for (const data of documents) {
				this._onDidAddDocument.fire(data.document);
			}
		}, undefined, this._toDispose);
	}

	public dispose(): void {
		this._toDispose.dispose();
	}

	public getAllDocumentData(): ExtHostDocumentData[] {
		return [...this._documentsAndEditors.allDocuments()];
	}

	public getDocumentData(resource: vscode.Uri): ExtHostDocumentData | undefined {
		if (!resource) {
			return undefined;
		}
		const data = this._documentsAndEditors.getDocument(resource);
		if (data) {
			return data;
		}
		return undefined;
	}

	public getDocument(resource: vscode.Uri): vscode.TextDocument {
		const data = this.getDocumentData(resource);
		if (!data?.document) {
			throw new Error(`Unable to retrieve document from URI '${resource}'`);
		}
		return data.document;
	}

	public ensureDocumentData(uri: URI, options?: { encoding?: string }): Promise<ExtHostDocumentData> {

		const cached = this._documentsAndEditors.getDocument(uri);
		if (cached && (!options?.encoding || cached.document.encoding === options.encoding)) {
			return Promise.resolve(cached);
		}

		let promise = this._documentLoader.get(uri.toString());
		if (!promise) {
			promise = this._proxy.$tryOpenDocument(uri, options).then(uriData => {
				this._documentLoader.delete(uri.toString());
				const canonicalUri = URI.revive(uriData);
				return assertReturnsDefined(this._documentsAndEditors.getDocument(canonicalUri));
			}, err => {
				this._documentLoader.delete(uri.toString());
				return Promise.reject(err);
			});
			this._documentLoader.set(uri.toString(), promise);
		} else {
			if (options?.encoding) {
				promise = promise.then(data => {
					if (data.document.encoding !== options.encoding) {
						return this.ensureDocumentData(uri, options);
					}
					return data;
				});
			}
		}

		return promise;
	}

	public createDocumentData(options?: { language?: string; content?: string; encoding?: string }): Promise<URI> {
		return this._proxy.$tryCreateDocument(options).then(data => URI.revive(data));
	}

	public $acceptModelLanguageChanged(uriComponents: UriComponents, newLanguageId: string): void {
		const uri = URI.revive(uriComponents);
		const data = this._documentsAndEditors.getDocument(uri);
		if (!data) {
			throw new Error('unknown document');
		}
		// Treat a language change as a remove + add

		this._onDidRemoveDocument.fire(data.document);
		data._acceptLanguageId(newLanguageId);
		this._onDidAddDocument.fire(data.document);
	}

	public $acceptModelSaved(uriComponents: UriComponents): void {
		const uri = URI.revive(uriComponents);
		const data = this._documentsAndEditors.getDocument(uri);
		if (!data) {
			throw new Error('unknown document');
		}
		this.$acceptDirtyStateChanged(uriComponents, false);
		this._onDidSaveDocument.fire(data.document);
	}

	public $acceptDirtyStateChanged(uriComponents: UriComponents, isDirty: boolean): void {
		const uri = URI.revive(uriComponents);
		const data = this._documentsAndEditors.getDocument(uri);
		if (!data) {
			throw new Error('unknown document');
		}
		data._acceptIsDirty(isDirty);
		this._onDidChangeDocument.fire({
			document: data.document,
			contentChanges: [],
			reason: undefined,
		});
		this._onDidChangeDocumentWithReason.fire({
			document: data.document,
			contentChanges: [],
			reason: undefined,
			detailedReason: undefined,
		});
	}

	public $acceptEncodingChanged(uriComponents: UriComponents, encoding: string): void {
		const uri = URI.revive(uriComponents);
		const data = this._documentsAndEditors.getDocument(uri);
		if (!data) {
			throw new Error('unknown document');
		}
		data._acceptEncoding(encoding);
		this._onDidChangeDocument.fire({
			document: data.document,
			contentChanges: [],
			reason: undefined,
		});
		this._onDidChangeDocumentWithReason.fire({
			document: data.document,
			contentChanges: [],
			reason: undefined,
			detailedReason: undefined,
		});
	}

	public $acceptModelChanged(uriComponents: UriComponents, events: ISerializedModelContentChangedEvent, isDirty: boolean): void {
		const uri = URI.revive(uriComponents);
		const data = this._documentsAndEditors.getDocument(uri);
		if (!data) {
			throw new Error('unknown document');
		}
		data._acceptIsDirty(isDirty);
		data.onEvents(events);

		let reason: vscode.TextDocumentChangeReason | undefined = undefined;
		if (events.isUndoing) {
			reason = TextDocumentChangeReason.Undo;
		} else if (events.isRedoing) {
			reason = TextDocumentChangeReason.Redo;
		}

		this._onDidChangeDocument.fire(deepFreeze<Omit<vscode.TextDocumentChangeEvent, 'detailedReason'>>({
			document: data.document,
			contentChanges: events.changes.map((change) => {
				return {
					range: TypeConverters.Range.to(change.range),
					rangeOffset: change.rangeOffset,
					rangeLength: change.rangeLength,
					text: change.text
				};
			}),
			reason,
		}));
		this._onDidChangeDocumentWithReason.fire(deepFreeze<vscode.TextDocumentChangeEvent>({
			document: data.document,
			contentChanges: events.changes.map((change) => {
				return {
					range: TypeConverters.Range.to(change.range),
					rangeOffset: change.rangeOffset,
					rangeLength: change.rangeLength,
					text: change.text
				};
			}),
			reason,
			detailedReason: events.detailedReason ? {
				source: events.detailedReason.source as string,
				metadata: events.detailedReason,
			} : undefined,
		}));
	}

	public setWordDefinitionFor(languageId: string, wordDefinition: RegExp | undefined): void {
		setWordDefinitionFor(languageId, wordDefinition);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDocumentsAndEditors.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDocumentsAndEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from '../../../base/common/assert.js';
import * as vscode from 'vscode';
import { Emitter, Event } from '../../../base/common/event.js';
import { dispose } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostDocumentsAndEditorsShape, IDocumentsAndEditorsDelta, MainContext } from './extHost.protocol.js';
import { ExtHostDocumentData } from './extHostDocumentData.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import { ExtHostTextEditor } from './extHostTextEditor.js';
import * as typeConverters from './extHostTypeConverters.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ResourceMap } from '../../../base/common/map.js';
import { Schemas } from '../../../base/common/network.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Lazy } from '../../../base/common/lazy.js';

class Reference<T> {
	private _count = 0;
	constructor(readonly value: T) { }
	ref() {
		this._count++;
	}
	unref() {
		return --this._count === 0;
	}
}

export class ExtHostDocumentsAndEditors implements ExtHostDocumentsAndEditorsShape {

	readonly _serviceBrand: undefined;

	private _activeEditorId: string | null = null;

	private readonly _editors = new Map<string, ExtHostTextEditor>();
	private readonly _documents = new ResourceMap<Reference<ExtHostDocumentData>>();

	private readonly _onDidAddDocuments = new Emitter<readonly ExtHostDocumentData[]>();
	private readonly _onDidRemoveDocuments = new Emitter<readonly ExtHostDocumentData[]>();
	private readonly _onDidChangeVisibleTextEditors = new Emitter<readonly vscode.TextEditor[]>();
	private readonly _onDidChangeActiveTextEditor = new Emitter<vscode.TextEditor | undefined>();

	readonly onDidAddDocuments: Event<readonly ExtHostDocumentData[]> = this._onDidAddDocuments.event;
	readonly onDidRemoveDocuments: Event<readonly ExtHostDocumentData[]> = this._onDidRemoveDocuments.event;
	readonly onDidChangeVisibleTextEditors: Event<readonly vscode.TextEditor[]> = this._onDidChangeVisibleTextEditors.event;
	readonly onDidChangeActiveTextEditor: Event<vscode.TextEditor | undefined> = this._onDidChangeActiveTextEditor.event;

	constructor(
		@IExtHostRpcService private readonly _extHostRpc: IExtHostRpcService,
		@ILogService private readonly _logService: ILogService
	) { }

	$acceptDocumentsAndEditorsDelta(delta: IDocumentsAndEditorsDelta): void {
		this.acceptDocumentsAndEditorsDelta(delta);
	}

	acceptDocumentsAndEditorsDelta(delta: IDocumentsAndEditorsDelta): void {

		const removedDocuments: ExtHostDocumentData[] = [];
		const addedDocuments: ExtHostDocumentData[] = [];
		const removedEditors: ExtHostTextEditor[] = [];

		if (delta.removedDocuments) {
			for (const uriComponent of delta.removedDocuments) {
				const uri = URI.revive(uriComponent);
				const data = this._documents.get(uri);
				if (data?.unref()) {
					this._documents.delete(uri);
					removedDocuments.push(data.value);
				}
			}
		}

		if (delta.addedDocuments) {
			for (const data of delta.addedDocuments) {
				const resource = URI.revive(data.uri);
				let ref = this._documents.get(resource);

				// double check -> only notebook cell documents should be
				// referenced/opened more than once...
				if (ref) {
					if (resource.scheme !== Schemas.vscodeNotebookCell && resource.scheme !== Schemas.vscodeInteractiveInput) {
						throw new Error(`document '${resource} already exists!'`);
					}
				}
				if (!ref) {
					ref = new Reference(new ExtHostDocumentData(
						this._extHostRpc.getProxy(MainContext.MainThreadDocuments),
						resource,
						data.lines,
						data.EOL,
						data.versionId,
						data.languageId,
						data.isDirty,
						data.encoding
					));
					this._documents.set(resource, ref);
					addedDocuments.push(ref.value);
				}

				ref.ref();
			}
		}

		if (delta.removedEditors) {
			for (const id of delta.removedEditors) {
				const editor = this._editors.get(id);
				this._editors.delete(id);
				if (editor) {
					removedEditors.push(editor);
				}
			}
		}

		if (delta.addedEditors) {
			for (const data of delta.addedEditors) {
				const resource = URI.revive(data.documentUri);
				assert.ok(this._documents.has(resource), `document '${resource}' does not exist`);
				assert.ok(!this._editors.has(data.id), `editor '${data.id}' already exists!`);

				const documentData = this._documents.get(resource)!.value;
				const editor = new ExtHostTextEditor(
					data.id,
					this._extHostRpc.getProxy(MainContext.MainThreadTextEditors),
					this._logService,
					new Lazy(() => documentData.document),
					data.selections.map(typeConverters.Selection.to),
					data.options,
					data.visibleRanges.map(range => typeConverters.Range.to(range)),
					typeof data.editorPosition === 'number' ? typeConverters.ViewColumn.to(data.editorPosition) : undefined
				);
				this._editors.set(data.id, editor);
			}
		}

		if (delta.newActiveEditor !== undefined) {
			assert.ok(delta.newActiveEditor === null || this._editors.has(delta.newActiveEditor), `active editor '${delta.newActiveEditor}' does not exist`);
			this._activeEditorId = delta.newActiveEditor;
		}

		dispose(removedDocuments);
		dispose(removedEditors);

		// now that the internal state is complete, fire events
		if (delta.removedDocuments) {
			this._onDidRemoveDocuments.fire(removedDocuments);
		}
		if (delta.addedDocuments) {
			this._onDidAddDocuments.fire(addedDocuments);
		}

		if (delta.removedEditors || delta.addedEditors) {
			this._onDidChangeVisibleTextEditors.fire(this.allEditors().map(editor => editor.value));
		}
		if (delta.newActiveEditor !== undefined) {
			this._onDidChangeActiveTextEditor.fire(this.activeEditor());
		}
	}

	getDocument(uri: URI): ExtHostDocumentData | undefined {
		return this._documents.get(uri)?.value;
	}

	allDocuments(): Iterable<ExtHostDocumentData> {
		return Iterable.map(this._documents.values(), ref => ref.value);
	}

	getEditor(id: string): ExtHostTextEditor | undefined {
		return this._editors.get(id);
	}

	activeEditor(): vscode.TextEditor | undefined;
	activeEditor(internal: true): ExtHostTextEditor | undefined;
	activeEditor(internal?: true): vscode.TextEditor | ExtHostTextEditor | undefined {
		if (!this._activeEditorId) {
			return undefined;
		}
		const editor = this._editors.get(this._activeEditorId);
		if (internal) {
			return editor;
		} else {
			return editor?.value;
		}
	}

	allEditors(): ExtHostTextEditor[] {
		return [...this._editors.values()];
	}
}

export interface IExtHostDocumentsAndEditors extends ExtHostDocumentsAndEditors { }
export const IExtHostDocumentsAndEditors = createDecorator<IExtHostDocumentsAndEditors>('IExtHostDocumentsAndEditors');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostDocumentSaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostDocumentSaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { illegalState } from '../../../base/common/errors.js';
import { ExtHostDocumentSaveParticipantShape, IWorkspaceEditDto, MainThreadBulkEditsShape } from './extHost.protocol.js';
import { TextEdit } from './extHostTypes.js';
import { Range, TextDocumentSaveReason, EndOfLine } from './extHostTypeConverters.js';
import { ExtHostDocuments } from './extHostDocuments.js';
import { SaveReason } from '../../common/editor.js';
import type * as vscode from 'vscode';
import { LinkedList } from '../../../base/common/linkedList.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';

type Listener = [Function, unknown, IExtensionDescription];

export class ExtHostDocumentSaveParticipant implements ExtHostDocumentSaveParticipantShape {

	private readonly _callbacks = new LinkedList<Listener>();
	private readonly _badListeners = new WeakMap<Function, number>();

	constructor(
		private readonly _logService: ILogService,
		private readonly _documents: ExtHostDocuments,
		private readonly _mainThreadBulkEdits: MainThreadBulkEditsShape,
		private readonly _thresholds: { timeout: number; errors: number } = { timeout: 1500, errors: 3 }
	) {
		//
	}

	dispose(): void {
		this._callbacks.clear();
	}

	getOnWillSaveTextDocumentEvent(extension: IExtensionDescription): Event<vscode.TextDocumentWillSaveEvent> {
		return (listener, thisArg, disposables) => {
			const remove = this._callbacks.push([listener, thisArg, extension]);
			const result = { dispose: remove };
			if (Array.isArray(disposables)) {
				disposables.push(result);
			}
			return result;
		};
	}

	async $participateInSave(data: UriComponents, reason: SaveReason): Promise<boolean[]> {
		const resource = URI.revive(data);

		let didTimeout = false;
		const didTimeoutHandle = setTimeout(() => didTimeout = true, this._thresholds.timeout);

		const results: boolean[] = [];
		try {
			for (const listener of [...this._callbacks]) { // copy to prevent concurrent modifications
				if (didTimeout) {
					// timeout - no more listeners
					break;
				}
				const document = this._documents.getDocument(resource);

				const success = await this._deliverEventAsyncAndBlameBadListeners(listener, { document, reason: TextDocumentSaveReason.to(reason) });
				results.push(success);
			}
		} finally {
			clearTimeout(didTimeoutHandle);
		}
		return results;
	}

	private _deliverEventAsyncAndBlameBadListeners([listener, thisArg, extension]: Listener, stubEvent: Pick<vscode.TextDocumentWillSaveEvent, 'document' | 'reason'>): Promise<boolean> {
		const errors = this._badListeners.get(listener);
		if (typeof errors === 'number' && errors > this._thresholds.errors) {
			// bad listener - ignore
			return Promise.resolve(false);
		}

		return this._deliverEventAsync(extension, listener, thisArg, stubEvent).then(() => {
			// don't send result across the wire
			return true;

		}, err => {

			this._logService.error(`onWillSaveTextDocument-listener from extension '${extension.identifier.value}' threw ERROR`);
			this._logService.error(err);

			if (!(err instanceof Error) || (<Error>err).message !== 'concurrent_edits') {
				const errors = this._badListeners.get(listener);
				this._badListeners.set(listener, !errors ? 1 : errors + 1);

				if (typeof errors === 'number' && errors > this._thresholds.errors) {
					this._logService.info(`onWillSaveTextDocument-listener from extension '${extension.identifier.value}' will now be IGNORED because of timeouts and/or errors`);
				}
			}
			return false;
		});
	}

	private _deliverEventAsync(extension: IExtensionDescription, listener: Function, thisArg: unknown, stubEvent: Pick<vscode.TextDocumentWillSaveEvent, 'document' | 'reason'>): Promise<boolean | undefined> {

		const promises: Promise<vscode.TextEdit[]>[] = [];

		const t1 = Date.now();
		const { document, reason } = stubEvent;
		const { version } = document;

		const event = Object.freeze<vscode.TextDocumentWillSaveEvent>({
			document,
			reason,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			waitUntil(p: Promise<any | vscode.TextEdit[]>) {
				if (Object.isFrozen(promises)) {
					throw illegalState('waitUntil can not be called async');
				}
				promises.push(Promise.resolve(p));
			}
		});

		try {
			// fire event
			listener.apply(thisArg, [event]);
		} catch (err) {
			return Promise.reject(err);
		}

		// freeze promises after event call
		Object.freeze(promises);

		return new Promise<vscode.TextEdit[][]>((resolve, reject) => {
			// join on all listener promises, reject after timeout
			const handle = setTimeout(() => reject(new Error('timeout')), this._thresholds.timeout);

			return Promise.all(promises).then(edits => {
				this._logService.debug(`onWillSaveTextDocument-listener from extension '${extension.identifier.value}' finished after ${(Date.now() - t1)}ms`);
				clearTimeout(handle);
				resolve(edits);
			}).catch(err => {
				clearTimeout(handle);
				reject(err);
			});

		}).then(values => {
			const dto: IWorkspaceEditDto = { edits: [] };
			for (const value of values) {
				if (Array.isArray(value) && (<vscode.TextEdit[]>value).every(e => e instanceof TextEdit)) {
					for (const { newText, newEol, range } of value) {
						dto.edits.push({
							resource: document.uri,
							versionId: undefined,
							textEdit: {
								range: range && Range.from(range),
								text: newText,
								eol: newEol && EndOfLine.from(newEol),
							}
						});
					}
				}
			}

			// apply edits if any and if document
			// didn't change somehow in the meantime
			if (dto.edits.length === 0) {
				return undefined;
			}

			if (version === document.version) {
				return this._mainThreadBulkEdits.$tryApplyWorkspaceEdit(new SerializableObjectWithBuffers(dto));
			}

			return Promise.reject(new Error('concurrent_edits'));
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostEditorTabs.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostEditorTabs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { diffSets } from '../../../base/common/collections.js';
import { Emitter } from '../../../base/common/event.js';
import { assertReturnsDefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { IEditorTabDto, IEditorTabGroupDto, IExtHostEditorTabsShape, MainContext, MainThreadEditorTabsShape, TabInputKind, TabModelOperationKind, TabOperation } from './extHost.protocol.js';
import { IExtHostRpcService } from './extHostRpcService.js';
import * as typeConverters from './extHostTypeConverters.js';
import { ChatEditorTabInput, CustomEditorTabInput, InteractiveWindowInput, NotebookDiffEditorTabInput, NotebookEditorTabInput, TerminalEditorTabInput, TextDiffTabInput, TextMergeTabInput, TextTabInput, WebviewEditorTabInput, TextMultiDiffTabInput } from './extHostTypes.js';
import type * as vscode from 'vscode';

export interface IExtHostEditorTabs extends IExtHostEditorTabsShape {
	readonly _serviceBrand: undefined;
	tabGroups: vscode.TabGroups;
}

export const IExtHostEditorTabs = createDecorator<IExtHostEditorTabs>('IExtHostEditorTabs');

type AnyTabInput = TextTabInput | TextDiffTabInput | TextMultiDiffTabInput | CustomEditorTabInput | NotebookEditorTabInput | NotebookDiffEditorTabInput | WebviewEditorTabInput | TerminalEditorTabInput | InteractiveWindowInput | ChatEditorTabInput;

class ExtHostEditorTab {
	private _apiObject: vscode.Tab | undefined;
	private _dto!: IEditorTabDto;
	private _input: AnyTabInput | undefined;
	private _parentGroup: ExtHostEditorTabGroup;
	private readonly _activeTabIdGetter: () => string;

	constructor(dto: IEditorTabDto, parentGroup: ExtHostEditorTabGroup, activeTabIdGetter: () => string) {
		this._activeTabIdGetter = activeTabIdGetter;
		this._parentGroup = parentGroup;
		this.acceptDtoUpdate(dto);
	}

	get apiObject(): vscode.Tab {
		if (!this._apiObject) {
			// Don't want to lose reference to parent `this` in the getters
			const that = this;
			const obj: vscode.Tab = {
				get isActive() {
					// We use a getter function here to always ensure at most 1 active tab per group and prevent iteration for being required
					return that._dto.id === that._activeTabIdGetter();
				},
				get label() {
					return that._dto.label;
				},
				get input() {
					return that._input;
				},
				get isDirty() {
					return that._dto.isDirty;
				},
				get isPinned() {
					return that._dto.isPinned;
				},
				get isPreview() {
					return that._dto.isPreview;
				},
				get group() {
					return that._parentGroup.apiObject;
				}
			};
			this._apiObject = Object.freeze<vscode.Tab>(obj);
		}
		return this._apiObject;
	}

	get tabId(): string {
		return this._dto.id;
	}

	acceptDtoUpdate(dto: IEditorTabDto) {
		this._dto = dto;
		this._input = this._initInput();
	}

	private _initInput() {
		switch (this._dto.input.kind) {
			case TabInputKind.TextInput:
				return new TextTabInput(URI.revive(this._dto.input.uri));
			case TabInputKind.TextDiffInput:
				return new TextDiffTabInput(URI.revive(this._dto.input.original), URI.revive(this._dto.input.modified));
			case TabInputKind.TextMergeInput:
				return new TextMergeTabInput(URI.revive(this._dto.input.base), URI.revive(this._dto.input.input1), URI.revive(this._dto.input.input2), URI.revive(this._dto.input.result));
			case TabInputKind.CustomEditorInput:
				return new CustomEditorTabInput(URI.revive(this._dto.input.uri), this._dto.input.viewType);
			case TabInputKind.WebviewEditorInput:
				return new WebviewEditorTabInput(this._dto.input.viewType);
			case TabInputKind.NotebookInput:
				return new NotebookEditorTabInput(URI.revive(this._dto.input.uri), this._dto.input.notebookType);
			case TabInputKind.NotebookDiffInput:
				return new NotebookDiffEditorTabInput(URI.revive(this._dto.input.original), URI.revive(this._dto.input.modified), this._dto.input.notebookType);
			case TabInputKind.TerminalEditorInput:
				return new TerminalEditorTabInput();
			case TabInputKind.InteractiveEditorInput:
				return new InteractiveWindowInput(URI.revive(this._dto.input.uri), URI.revive(this._dto.input.inputBoxUri));
			case TabInputKind.ChatEditorInput:
				return new ChatEditorTabInput();
			case TabInputKind.MultiDiffEditorInput:
				return new TextMultiDiffTabInput(this._dto.input.diffEditors.map(diff => new TextDiffTabInput(URI.revive(diff.original), URI.revive(diff.modified))));
			default:
				return undefined;
		}
	}
}

class ExtHostEditorTabGroup {

	private _apiObject: vscode.TabGroup | undefined;
	private _dto: IEditorTabGroupDto;
	private _tabs: ExtHostEditorTab[] = [];
	private _activeTabId: string = '';
	private _activeGroupIdGetter: () => number | undefined;

	constructor(dto: IEditorTabGroupDto, activeGroupIdGetter: () => number | undefined) {
		this._dto = dto;
		this._activeGroupIdGetter = activeGroupIdGetter;
		// Construct all tabs from the given dto
		for (const tabDto of dto.tabs) {
			if (tabDto.isActive) {
				this._activeTabId = tabDto.id;
			}
			this._tabs.push(new ExtHostEditorTab(tabDto, this, () => this.activeTabId()));
		}
	}

	get apiObject(): vscode.TabGroup {
		if (!this._apiObject) {
			// Don't want to lose reference to parent `this` in the getters
			const that = this;
			const obj: vscode.TabGroup = {
				get isActive() {
					// We use a getter function here to always ensure at most 1 active group and prevent iteration for being required
					return that._dto.groupId === that._activeGroupIdGetter();
				},
				get viewColumn() {
					return typeConverters.ViewColumn.to(that._dto.viewColumn);
				},
				get activeTab() {
					return that._tabs.find(tab => tab.tabId === that._activeTabId)?.apiObject;
				},
				get tabs() {
					return Object.freeze(that._tabs.map(tab => tab.apiObject));
				}
			};
			this._apiObject = Object.freeze<vscode.TabGroup>(obj);
		}
		return this._apiObject;
	}

	get groupId(): number {
		return this._dto.groupId;
	}

	get tabs(): ExtHostEditorTab[] {
		return this._tabs;
	}

	acceptGroupDtoUpdate(dto: IEditorTabGroupDto) {
		this._dto = dto;
	}

	acceptTabOperation(operation: TabOperation): ExtHostEditorTab {
		// In the open case we add the tab to the group
		if (operation.kind === TabModelOperationKind.TAB_OPEN) {
			const tab = new ExtHostEditorTab(operation.tabDto, this, () => this.activeTabId());
			// Insert tab at editor index
			this._tabs.splice(operation.index, 0, tab);
			if (operation.tabDto.isActive) {
				this._activeTabId = tab.tabId;
			}
			return tab;
		} else if (operation.kind === TabModelOperationKind.TAB_CLOSE) {
			const tab = this._tabs.splice(operation.index, 1)[0];
			if (!tab) {
				throw new Error(`Tab close updated received for index ${operation.index} which does not exist`);
			}
			if (tab.tabId === this._activeTabId) {
				this._activeTabId = '';
			}
			return tab;
		} else if (operation.kind === TabModelOperationKind.TAB_MOVE) {
			if (operation.oldIndex === undefined) {
				throw new Error('Invalid old index on move IPC');
			}
			// Splice to remove at old index and insert at new index === moving the tab
			const tab = this._tabs.splice(operation.oldIndex, 1)[0];
			if (!tab) {
				throw new Error(`Tab move updated received for index ${operation.oldIndex} which does not exist`);
			}
			this._tabs.splice(operation.index, 0, tab);
			return tab;
		}
		const tab = this._tabs.find(extHostTab => extHostTab.tabId === operation.tabDto.id);
		if (!tab) {
			throw new Error('INVALID tab');
		}
		if (operation.tabDto.isActive) {
			this._activeTabId = operation.tabDto.id;
		} else if (this._activeTabId === operation.tabDto.id && !operation.tabDto.isActive) {
			// Events aren't guaranteed to be in order so if we receive a dto that matches the active tab id
			// but isn't active we mark the active tab id as empty. This prevent onDidActiveTabChange from
			// firing incorrectly
			this._activeTabId = '';
		}
		tab.acceptDtoUpdate(operation.tabDto);
		return tab;
	}

	// Not a getter since it must be a function to be used as a callback for the tabs
	activeTabId(): string {
		return this._activeTabId;
	}
}

export class ExtHostEditorTabs implements IExtHostEditorTabs {
	readonly _serviceBrand: undefined;

	private readonly _proxy: MainThreadEditorTabsShape;
	private readonly _onDidChangeTabs = new Emitter<vscode.TabChangeEvent>();
	private readonly _onDidChangeTabGroups = new Emitter<vscode.TabGroupChangeEvent>();

	// Have to use ! because this gets initialized via an RPC proxy
	private _activeGroupId!: number;

	private _extHostTabGroups: ExtHostEditorTabGroup[] = [];

	private _apiObject: vscode.TabGroups | undefined;

	constructor(@IExtHostRpcService extHostRpc: IExtHostRpcService) {
		this._proxy = extHostRpc.getProxy(MainContext.MainThreadEditorTabs);
	}

	get tabGroups(): vscode.TabGroups {
		if (!this._apiObject) {
			const that = this;
			const obj: vscode.TabGroups = {
				// never changes -> simple value
				onDidChangeTabGroups: that._onDidChangeTabGroups.event,
				onDidChangeTabs: that._onDidChangeTabs.event,
				// dynamic -> getters
				get all() {
					return Object.freeze(that._extHostTabGroups.map(group => group.apiObject));
				},
				get activeTabGroup() {
					const activeTabGroupId = that._activeGroupId;
					const activeTabGroup = assertReturnsDefined(that._extHostTabGroups.find(candidate => candidate.groupId === activeTabGroupId)?.apiObject);
					return activeTabGroup;
				},
				close: async (tabOrTabGroup: vscode.Tab | readonly vscode.Tab[] | vscode.TabGroup | readonly vscode.TabGroup[], preserveFocus?: boolean) => {
					const tabsOrTabGroups = Array.isArray(tabOrTabGroup) ? tabOrTabGroup : [tabOrTabGroup];
					if (!tabsOrTabGroups.length) {
						return true;
					}
					// Check which type was passed in and call the appropriate close
					// Casting is needed as typescript doesn't seem to infer enough from this
					if (isTabGroup(tabsOrTabGroups[0])) {
						return this._closeGroups(tabsOrTabGroups as vscode.TabGroup[], preserveFocus);
					} else {
						return this._closeTabs(tabsOrTabGroups as vscode.Tab[], preserveFocus);
					}
				},
				// move: async (tab: vscode.Tab, viewColumn: ViewColumn, index: number, preserveFocus?: boolean) => {
				// 	const extHostTab = this._findExtHostTabFromApi(tab);
				// 	if (!extHostTab) {
				// 		throw new Error('Invalid tab');
				// 	}
				// 	this._proxy.$moveTab(extHostTab.tabId, index, typeConverters.ViewColumn.from(viewColumn), preserveFocus);
				// 	return;
				// }
			};
			this._apiObject = Object.freeze(obj);
		}
		return this._apiObject;
	}

	$acceptEditorTabModel(tabGroups: IEditorTabGroupDto[]): void {

		const groupIdsBefore = new Set(this._extHostTabGroups.map(group => group.groupId));
		const groupIdsAfter = new Set(tabGroups.map(dto => dto.groupId));
		const diff = diffSets(groupIdsBefore, groupIdsAfter);

		const closed: vscode.TabGroup[] = this._extHostTabGroups.filter(group => diff.removed.includes(group.groupId)).map(group => group.apiObject);
		const opened: vscode.TabGroup[] = [];
		const changed: vscode.TabGroup[] = [];


		this._extHostTabGroups = tabGroups.map(tabGroup => {
			const group = new ExtHostEditorTabGroup(tabGroup, () => this._activeGroupId);
			if (diff.added.includes(group.groupId)) {
				opened.push(group.apiObject);
			} else {
				changed.push(group.apiObject);
			}
			return group;
		});

		// Set the active tab group id
		const activeTabGroupId = assertReturnsDefined(tabGroups.find(group => group.isActive === true)?.groupId);
		if (activeTabGroupId !== undefined && this._activeGroupId !== activeTabGroupId) {
			this._activeGroupId = activeTabGroupId;
		}
		this._onDidChangeTabGroups.fire(Object.freeze({ opened, closed, changed }));
	}

	$acceptTabGroupUpdate(groupDto: IEditorTabGroupDto) {
		const group = this._extHostTabGroups.find(group => group.groupId === groupDto.groupId);
		if (!group) {
			throw new Error('Update Group IPC call received before group creation.');
		}
		group.acceptGroupDtoUpdate(groupDto);
		if (groupDto.isActive) {
			this._activeGroupId = groupDto.groupId;
		}
		this._onDidChangeTabGroups.fire(Object.freeze({ changed: [group.apiObject], opened: [], closed: [] }));
	}

	$acceptTabOperation(operation: TabOperation) {
		const group = this._extHostTabGroups.find(group => group.groupId === operation.groupId);
		if (!group) {
			throw new Error('Update Tabs IPC call received before group creation.');
		}
		const tab = group.acceptTabOperation(operation);

		// Construct the tab change event based on the operation
		switch (operation.kind) {
			case TabModelOperationKind.TAB_OPEN:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [tab.apiObject],
					closed: [],
					changed: []
				}));
				return;
			case TabModelOperationKind.TAB_CLOSE:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [],
					closed: [tab.apiObject],
					changed: []
				}));
				return;
			case TabModelOperationKind.TAB_MOVE:
			case TabModelOperationKind.TAB_UPDATE:
				this._onDidChangeTabs.fire(Object.freeze({
					opened: [],
					closed: [],
					changed: [tab.apiObject]
				}));
				return;
		}
	}

	private _findExtHostTabFromApi(apiTab: vscode.Tab): ExtHostEditorTab | undefined {
		for (const group of this._extHostTabGroups) {
			for (const tab of group.tabs) {
				if (tab.apiObject === apiTab) {
					return tab;
				}
			}
		}
		return;
	}

	private _findExtHostTabGroupFromApi(apiTabGroup: vscode.TabGroup): ExtHostEditorTabGroup | undefined {
		return this._extHostTabGroups.find(candidate => candidate.apiObject === apiTabGroup);
	}

	private async _closeTabs(tabs: vscode.Tab[], preserveFocus?: boolean): Promise<boolean> {
		const extHostTabIds: string[] = [];
		for (const tab of tabs) {
			const extHostTab = this._findExtHostTabFromApi(tab);
			if (!extHostTab) {
				throw new Error('Tab close: Invalid tab not found!');
			}
			extHostTabIds.push(extHostTab.tabId);
		}
		return this._proxy.$closeTab(extHostTabIds, preserveFocus);
	}

	private async _closeGroups(groups: vscode.TabGroup[], preserverFoucs?: boolean): Promise<boolean> {
		const extHostGroupIds: number[] = [];
		for (const group of groups) {
			const extHostGroup = this._findExtHostTabGroupFromApi(group);
			if (!extHostGroup) {
				throw new Error('Group close: Invalid group not found!');
			}
			extHostGroupIds.push(extHostGroup.groupId);
		}
		return this._proxy.$closeGroup(extHostGroupIds, preserverFoucs);
	}
}

//#region Utils
function isTabGroup(obj: unknown): obj is vscode.TabGroup {
	const tabGroup = obj as vscode.TabGroup;
	if (tabGroup.tabs !== undefined) {
		return true;
	}
	return false;
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/common/extHostEmbedding.ts]---
Location: vscode-main/src/vs/workbench/api/common/extHostEmbedding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtHostEmbeddingsShape, IMainContext, MainContext, MainThreadEmbeddingsShape } from './extHost.protocol.js';
import type * as vscode from 'vscode';


export class ExtHostEmbeddings implements ExtHostEmbeddingsShape {

	private readonly _proxy: MainThreadEmbeddingsShape;
	private readonly _provider = new Map<number, { id: string; provider: vscode.EmbeddingsProvider }>();

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _allKnownModels = new Set<string>();
	private _handlePool: number = 0;

	constructor(
		mainContext: IMainContext
	) {
		this._proxy = mainContext.getProxy(MainContext.MainThreadEmbeddings);
	}

	registerEmbeddingsProvider(_extension: IExtensionDescription, embeddingsModel: string, provider: vscode.EmbeddingsProvider): IDisposable {
		if (this._allKnownModels.has(embeddingsModel)) {
			throw new Error('An embeddings provider for this model is already registered');
		}

		const handle = this._handlePool++;

		this._proxy.$registerEmbeddingProvider(handle, embeddingsModel);
		this._provider.set(handle, { id: embeddingsModel, provider });

		return toDisposable(() => {
			this._allKnownModels.delete(embeddingsModel);
			this._proxy.$unregisterEmbeddingProvider(handle);
			this._provider.delete(handle);
		});
	}

	async computeEmbeddings(embeddingsModel: string, input: string, token?: vscode.CancellationToken): Promise<vscode.Embedding>;
	async computeEmbeddings(embeddingsModel: string, input: string[], token?: vscode.CancellationToken): Promise<vscode.Embedding[]>;
	async computeEmbeddings(embeddingsModel: string, input: string | string[], token?: vscode.CancellationToken): Promise<vscode.Embedding[] | vscode.Embedding> {

		token ??= CancellationToken.None;

		let returnSingle = false;
		if (typeof input === 'string') {
			input = [input];
			returnSingle = true;
		}
		const result = await this._proxy.$computeEmbeddings(embeddingsModel, input, token);
		if (result.length !== input.length) {
			throw new Error();
		}
		if (returnSingle) {
			if (result.length !== 1) {
				throw new Error();
			}
			return result[0];
		}
		return result;

	}

	async $provideEmbeddings(handle: number, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		const data = this._provider.get(handle);
		if (!data) {
			return [];
		}
		const result = await data.provider.provideEmbeddings(input, token);
		if (!result) {
			return [];
		}
		return result;
	}

	get embeddingsModels(): string[] {
		return Array.from(this._allKnownModels);
	}

	$acceptEmbeddingModels(models: string[]): void {
		this._allKnownModels = new Set(models);
		this._onDidChange.fire();
	}
}
```

--------------------------------------------------------------------------------

````

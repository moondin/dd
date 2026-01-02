---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 400
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 400 of 552)

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

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatController.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderAsPlaintext } from '../../../../base/browser/markdownRenderer.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Barrier, DeferredPromise, Queue, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { MovingAverage } from '../../../../base/common/numbers.js';
import { autorun, derived, IObservable, observableFromEvent, observableSignalFromEvent, observableValue, waitForState } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../editor/browser/observableCodeEditor.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { IPosition, Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ISelection, Selection, SelectionDirection } from '../../../../editor/common/core/selection.js';
import { IEditorContribution } from '../../../../editor/common/editorCommon.js';
import { TextEdit, VersionedExtensionId } from '../../../../editor/common/languages.js';
import { ITextModel, IValidEditOperation } from '../../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { IMarkerDecorationsService } from '../../../../editor/common/services/markerDecorations.js';
import { DefaultModelSHA1Computer } from '../../../../editor/common/services/modelService.js';
import { EditSuggestionId } from '../../../../editor/common/textModelEditSource.js';
import { InlineCompletionsController } from '../../../../editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.js';
import { MessageController } from '../../../../editor/contrib/message/browser/messageController.js';
import { localize } from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { ISharedWebContentExtractorService } from '../../../../platform/webContentExtractor/common/webContentExtractor.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IChatAttachmentResolveService } from '../../chat/browser/chatAttachmentResolveService.js';
import { IChatWidgetLocationOptions } from '../../chat/browser/chatWidget.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { IChatEditingSession, ModifiedFileEntryState } from '../../chat/common/chatEditingService.js';
import { ChatModel, ChatRequestRemovalReason, IChatRequestModel, IChatTextEditGroup, IChatTextEditGroupState, IResponse } from '../../chat/common/chatModel.js';
import { ChatMode } from '../../chat/common/chatModes.js';
import { IChatService } from '../../chat/common/chatService.js';
import { IChatRequestVariableEntry, IDiagnosticVariableEntryFilterData } from '../../chat/common/chatVariableEntries.js';
import { isResponseVM } from '../../chat/common/chatViewModel.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';
import { ILanguageModelChatSelector, ILanguageModelsService, isILanguageModelChatSelector } from '../../chat/common/languageModels.js';
import { isNotebookContainingCellEditor as isNotebookWithCellEditor } from '../../notebook/browser/notebookEditor.js';
import { INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { ICellEditOperation } from '../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { CTX_INLINE_CHAT_EDITING, CTX_INLINE_CHAT_REQUEST_IN_PROGRESS, CTX_INLINE_CHAT_RESPONSE_TYPE, CTX_INLINE_CHAT_VISIBLE, INLINE_CHAT_ID, InlineChatConfigKeys, InlineChatResponseType } from '../common/inlineChat.js';
import { HunkInformation, Session, StashedSession } from './inlineChatSession.js';
import { IInlineChatSession2, IInlineChatSessionService, moveToPanelChat } from './inlineChatSessionService.js';
import { InlineChatError } from './inlineChatSessionServiceImpl.js';
import { HunkAction, IEditObserver, IInlineChatMetadata, LiveStrategy, ProgressingEditsOptions } from './inlineChatStrategies.js';
import { EditorBasedInlineChatWidget } from './inlineChatWidget.js';
import { InlineChatZoneWidget } from './inlineChatZoneWidget.js';

export const enum State {
	CREATE_SESSION = 'CREATE_SESSION',
	INIT_UI = 'INIT_UI',
	WAIT_FOR_INPUT = 'WAIT_FOR_INPUT',
	SHOW_REQUEST = 'SHOW_REQUEST',
	PAUSE = 'PAUSE',
	CANCEL = 'CANCEL',
	ACCEPT = 'DONE',
}

const enum Message {
	NONE = 0,
	ACCEPT_SESSION = 1 << 0,
	CANCEL_SESSION = 1 << 1,
	PAUSE_SESSION = 1 << 2,
	CANCEL_REQUEST = 1 << 3,
	CANCEL_INPUT = 1 << 4,
	ACCEPT_INPUT = 1 << 5,
}

export abstract class InlineChatRunOptions {

	initialSelection?: ISelection;
	initialRange?: IRange;
	message?: string;
	attachments?: URI[];
	autoSend?: boolean;
	existingSession?: Session;
	position?: IPosition;
	modelSelector?: ILanguageModelChatSelector;
	blockOnResponse?: boolean;

	static isInlineChatRunOptions(options: unknown): options is InlineChatRunOptions {

		if (typeof options !== 'object' || options === null) {
			return false;
		}

		const { initialSelection, initialRange, message, autoSend, position, existingSession, attachments, modelSelector, blockOnResponse } = <InlineChatRunOptions>options;
		if (
			typeof message !== 'undefined' && typeof message !== 'string'
			|| typeof autoSend !== 'undefined' && typeof autoSend !== 'boolean'
			|| typeof initialRange !== 'undefined' && !Range.isIRange(initialRange)
			|| typeof initialSelection !== 'undefined' && !Selection.isISelection(initialSelection)
			|| typeof position !== 'undefined' && !Position.isIPosition(position)
			|| typeof existingSession !== 'undefined' && !(existingSession instanceof Session)
			|| typeof attachments !== 'undefined' && (!Array.isArray(attachments) || !attachments.every(item => item instanceof URI))
			|| typeof modelSelector !== 'undefined' && !isILanguageModelChatSelector(modelSelector)
			|| typeof blockOnResponse !== 'undefined' && typeof blockOnResponse !== 'boolean'
		) {
			return false;
		}

		return true;
	}
}

export class InlineChatController implements IEditorContribution {

	static ID = 'editor.contrib.inlineChatController';

	static get(editor: ICodeEditor) {
		return editor.getContribution<InlineChatController>(InlineChatController.ID);
	}

	private readonly _delegate: IObservable<InlineChatController1 | InlineChatController2>;

	constructor(
		editor: ICodeEditor,
		@IConfigurationService configurationService: IConfigurationService,
		@INotebookEditorService private readonly _notebookEditorService: INotebookEditorService
	) {
		const notebookAgent = observableConfigValue(InlineChatConfigKeys.notebookAgent, false, configurationService);

		this._delegate = derived(r => {
			const isNotebookCell = !!this._notebookEditorService.getNotebookForPossibleCell(editor);
			if (!isNotebookCell || notebookAgent.read(r)) {
				return InlineChatController2.get(editor)!;
			} else {
				return InlineChatController1.get(editor)!;
			}
		});
	}

	dispose(): void {

	}

	get isActive(): boolean {
		return this._delegate.get().isActive;
	}

	async run(arg?: InlineChatRunOptions): Promise<boolean> {
		return this._delegate.get().run(arg);
	}

	focus() {
		return this._delegate.get().focus();
	}

	get widget(): EditorBasedInlineChatWidget {
		return this._delegate.get().widget;
	}

	getWidgetPosition() {
		return this._delegate.get().getWidgetPosition();
	}

	acceptSession() {
		return this._delegate.get().acceptSession();
	}
}

// TODO@jrieken THIS should be shared with the code in MainThreadEditors
function getEditorId(editor: ICodeEditor, model: ITextModel): string {
	return `${editor.getId()},${model.id}`;
}

/**
 * @deprecated
 */
export class InlineChatController1 implements IEditorContribution {

	static get(editor: ICodeEditor) {
		return editor.getContribution<InlineChatController1>(INLINE_CHAT_ID);
	}

	private _isDisposed: boolean = false;
	private readonly _store = new DisposableStore();

	private readonly _ui: Lazy<InlineChatZoneWidget>;

	private readonly _ctxVisible: IContextKey<boolean>;
	private readonly _ctxEditing: IContextKey<boolean>;
	private readonly _ctxResponseType: IContextKey<undefined | InlineChatResponseType>;
	private readonly _ctxRequestInProgress: IContextKey<boolean>;

	private readonly _ctxResponse: IContextKey<boolean>;

	private readonly _messages = this._store.add(new Emitter<Message>());
	protected readonly _onDidEnterState = this._store.add(new Emitter<State>());

	get chatWidget() {
		return this._ui.value.widget.chatWidget;
	}

	private readonly _sessionStore = this._store.add(new DisposableStore());
	private readonly _stashedSession = this._store.add(new MutableDisposable<StashedSession>());
	private _delegateSession?: IChatEditingSession;

	private _session?: Session;
	private _strategy?: LiveStrategy;

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IInlineChatSessionService private readonly _inlineChatSessionService: IInlineChatSessionService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@ILogService private readonly _logService: ILogService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatService private readonly _chatService: IChatService,
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookEditorService notebookEditorService: INotebookEditorService,
		@ISharedWebContentExtractorService private readonly _webContentExtractorService: ISharedWebContentExtractorService,
		@IFileService private readonly _fileService: IFileService,
		@IChatAttachmentResolveService private readonly _chatAttachmentResolveService: IChatAttachmentResolveService
	) {
		this._ctxVisible = CTX_INLINE_CHAT_VISIBLE.bindTo(contextKeyService);
		this._ctxEditing = CTX_INLINE_CHAT_EDITING.bindTo(contextKeyService);
		this._ctxResponseType = CTX_INLINE_CHAT_RESPONSE_TYPE.bindTo(contextKeyService);
		this._ctxRequestInProgress = CTX_INLINE_CHAT_REQUEST_IN_PROGRESS.bindTo(contextKeyService);

		this._ctxResponse = ChatContextKeys.isResponse.bindTo(contextKeyService);
		ChatContextKeys.responseHasError.bindTo(contextKeyService);

		this._ui = new Lazy(() => {

			const location: IChatWidgetLocationOptions = {
				location: ChatAgentLocation.EditorInline,
				resolveData: () => {
					assertType(this._editor.hasModel());
					assertType(this._session);
					return {
						type: ChatAgentLocation.EditorInline,
						id: getEditorId(this._editor, this._session.textModelN),
						selection: this._editor.getSelection(),
						document: this._session.textModelN.uri,
						wholeRange: this._session?.wholeRange.trackedInitialRange,
						close: () => this.cancelSession(),
						delegateSessionResource: this._delegateSession?.chatSessionResource,
					};
				}
			};

			// inline chat in notebooks
			// check if this editor is part of a notebook editor
			// and iff so, use the notebook location but keep the resolveData
			// talk about editor data
			const notebookEditor = notebookEditorService.getNotebookForPossibleCell(this._editor);
			if (!!notebookEditor) {
				location.location = ChatAgentLocation.Notebook;
			}

			const clear = async () => {
				const r = this.joinCurrentRun();
				this.cancelSession();
				await r;
				this.run();
			};
			const zone = _instaService.createInstance(InlineChatZoneWidget, location, undefined, { editor: this._editor, notebookEditor }, clear);
			this._store.add(zone);

			return zone;
		});

		this._store.add(this._editor.onDidChangeModel(async e => {
			if (this._session || !e.newModelUrl) {
				return;
			}

			const existingSession = this._inlineChatSessionService.getSession(this._editor, e.newModelUrl);
			if (!existingSession) {
				return;
			}

			this._log('session RESUMING after model change', e);
			await this.run({ existingSession });
		}));

		this._store.add(this._inlineChatSessionService.onDidEndSession(e => {
			if (e.session === this._session && e.endedByExternalCause) {
				this._log('session ENDED by external cause');
				this.acceptSession();
			}
		}));

		this._store.add(this._inlineChatSessionService.onDidMoveSession(async e => {
			if (e.editor === this._editor) {
				this._log('session RESUMING after move', e);
				await this.run({ existingSession: e.session });
			}
		}));

		this._log(`NEW controller`);
	}

	dispose(): void {
		if (this._currentRun) {
			this._messages.fire(this._session?.chatModel.hasRequests
				? Message.PAUSE_SESSION
				: Message.CANCEL_SESSION);
		}
		this._store.dispose();
		this._isDisposed = true;
		this._log('DISPOSED controller');
	}

	private _log(message: string | Error, ...more: unknown[]): void {
		if (message instanceof Error) {
			this._logService.error(message, ...more);
		} else {
			this._logService.trace(`[IE] (editor:${this._editor.getId()}) ${message}`, ...more);
		}
	}

	get widget(): EditorBasedInlineChatWidget {
		return this._ui.value.widget;
	}

	getId(): string {
		return INLINE_CHAT_ID;
	}

	getWidgetPosition(): Position | undefined {
		return this._ui.value.position;
	}

	private _currentRun?: Promise<void>;

	async run(options: InlineChatRunOptions | undefined = {}): Promise<boolean> {

		let lastState: State | undefined;
		const d = this._onDidEnterState.event(e => lastState = e);

		try {
			this.acceptSession();
			if (this._currentRun) {
				await this._currentRun;
			}
			if (options.initialSelection) {
				this._editor.setSelection(options.initialSelection);
			}
			this._stashedSession.clear();
			this._currentRun = this._nextState(State.CREATE_SESSION, options);
			await this._currentRun;

		} catch (error) {
			// this should not happen but when it does make sure to tear down the UI and everything
			this._log('error during run', error);
			onUnexpectedError(error);
			if (this._session) {
				this._inlineChatSessionService.releaseSession(this._session);
			}
			this[State.PAUSE]();

		} finally {
			this._currentRun = undefined;
			d.dispose();
		}

		return lastState !== State.CANCEL;
	}

	// ---- state machine

	protected async _nextState(state: State, options: InlineChatRunOptions): Promise<void> {
		let nextState: State | void = state;
		while (nextState && !this._isDisposed) {
			this._log('setState to ', nextState);
			const p: State | Promise<State> | Promise<void> = this[nextState](options);
			this._onDidEnterState.fire(nextState);
			nextState = await p;
		}
	}

	private async [State.CREATE_SESSION](options: InlineChatRunOptions): Promise<State.CANCEL | State.INIT_UI> {
		assertType(this._session === undefined);
		assertType(this._editor.hasModel());

		let session: Session | undefined = options.existingSession;

		let initPosition: Position | undefined;
		if (options.position) {
			initPosition = Position.lift(options.position).delta(-1);
			delete options.position;
		}

		const widgetPosition = this._showWidget(session?.headless, true, initPosition);

		// this._updatePlaceholder();
		let errorMessage = localize('create.fail', "Failed to start editor chat");

		if (!session) {
			const createSessionCts = new CancellationTokenSource();
			const msgListener = Event.once(this._messages.event)(m => {
				this._log('state=_createSession) message received', m);
				if (m === Message.ACCEPT_INPUT) {
					// user accepted the input before having a session
					options.autoSend = true;
					this._ui.value.widget.updateInfo(localize('welcome.2', "Getting ready..."));
				} else {
					createSessionCts.cancel();
				}
			});

			try {
				session = await this._inlineChatSessionService.createSession(
					this._editor,
					{ wholeRange: options.initialRange },
					createSessionCts.token
				);
			} catch (error) {
				// Inline chat errors are from the provider and have their error messages shown to the user
				if (error instanceof InlineChatError || error?.name === InlineChatError.code) {
					errorMessage = error.message;
				}
			}

			createSessionCts.dispose();
			msgListener.dispose();

			if (createSessionCts.token.isCancellationRequested) {
				if (session) {
					this._inlineChatSessionService.releaseSession(session);
				}
				return State.CANCEL;
			}
		}

		delete options.initialRange;
		delete options.existingSession;

		if (!session) {
			MessageController.get(this._editor)?.showMessage(errorMessage, widgetPosition);
			this._log('Failed to start editor chat');
			return State.CANCEL;
		}

		// create a new strategy
		this._strategy = this._instaService.createInstance(LiveStrategy, session, this._editor, this._ui.value, session.headless);

		this._session = session;
		return State.INIT_UI;
	}

	private async [State.INIT_UI](options: InlineChatRunOptions): Promise<State.WAIT_FOR_INPUT | State.SHOW_REQUEST> {
		assertType(this._session);
		assertType(this._strategy);

		// hide/cancel inline completions when invoking IE
		InlineCompletionsController.get(this._editor)?.reject();

		this._sessionStore.clear();

		const wholeRangeDecoration = this._editor.createDecorationsCollection();
		const handleWholeRangeChange = () => {
			const newDecorations = this._strategy?.getWholeRangeDecoration() ?? [];
			wholeRangeDecoration.set(newDecorations);

			this._ctxEditing.set(!this._session?.wholeRange.trackedInitialRange.isEmpty());
		};
		this._sessionStore.add(toDisposable(() => {
			wholeRangeDecoration.clear();
			this._ctxEditing.reset();
		}));
		this._sessionStore.add(this._session.wholeRange.onDidChange(handleWholeRangeChange));
		handleWholeRangeChange();

		this._ui.value.widget.setChatModel(this._session.chatModel);
		this._updatePlaceholder();

		const isModelEmpty = !this._session.chatModel.hasRequests;
		this._ui.value.widget.updateToolbar(true);
		this._ui.value.widget.toggleStatus(!isModelEmpty);
		this._showWidget(this._session.headless, isModelEmpty);

		this._sessionStore.add(this._editor.onDidChangeModel((e) => {
			const msg = this._session?.chatModel.hasRequests
				? Message.PAUSE_SESSION // pause when switching models/tabs and when having a previous exchange
				: Message.CANCEL_SESSION;
			this._log('model changed, pause or cancel session', msg, e);
			this._messages.fire(msg);
		}));

		const filePartOfEditSessions = this._chatService.editingSessions.filter(session =>
			session.entries.get().some(e => e.state.get() === ModifiedFileEntryState.Modified && e.modifiedURI.toString() === this._session!.textModelN.uri.toString())
		);

		const withinEditSession = filePartOfEditSessions.find(session =>
			session.entries.get().some(e => e.state.get() === ModifiedFileEntryState.Modified && e.hasModificationAt({
				range: this._session!.wholeRange.trackedInitialRange,
				uri: this._session!.textModelN.uri
			}))
		);

		const chatWidget = this._ui.value.widget.chatWidget;
		this._delegateSession = withinEditSession || filePartOfEditSessions[0];
		chatWidget.input.setIsWithinEditSession(!!withinEditSession, filePartOfEditSessions.length > 0);

		this._sessionStore.add(this._editor.onDidChangeModelContent(e => {


			if (this._session?.hunkData.ignoreTextModelNChanges || this._ui.value.widget.hasFocus()) {
				return;
			}

			const wholeRange = this._session!.wholeRange;
			let shouldFinishSession = false;
			if (this._configurationService.getValue<boolean>(InlineChatConfigKeys.FinishOnType)) {
				for (const { range } of e.changes) {
					shouldFinishSession = !Range.areIntersectingOrTouching(range, wholeRange.value);
				}
			}

			this._session!.recordExternalEditOccurred(shouldFinishSession);

			if (shouldFinishSession) {
				this._log('text changed outside of whole range, FINISH session');
				this.acceptSession();
			}
		}));

		this._sessionStore.add(this._session.chatModel.onDidChange(async e => {
			if (e.kind === 'removeRequest') {
				// TODO@jrieken there is still some work left for when a request "in the middle"
				// is removed. We will undo all changes till that point but not remove those
				// later request
				await this._session!.undoChangesUntil(e.requestId);
			}
		}));

		// apply edits from completed requests that haven't been applied yet
		const editState = this._createChatTextEditGroupState();
		let didEdit = false;
		for (const request of this._session.chatModel.getRequests()) {
			if (!request.response || request.response.result?.errorDetails) {
				// done when seeing the first request that is still pending (no response).
				break;
			}
			for (const part of request.response.response.value) {
				if (part.kind !== 'textEditGroup' || !isEqual(part.uri, this._session.textModelN.uri)) {
					continue;
				}
				if (part.state?.applied) {
					continue;
				}
				for (const edit of part.edits) {
					this._makeChanges(edit, undefined, !didEdit);
					didEdit = true;
				}
				part.state ??= editState;
			}
		}
		if (didEdit) {
			const diff = await this._editorWorkerService.computeDiff(this._session.textModel0.uri, this._session.textModelN.uri, { computeMoves: false, maxComputationTimeMs: Number.MAX_SAFE_INTEGER, ignoreTrimWhitespace: false }, 'advanced');
			this._session.wholeRange.fixup(diff?.changes ?? []);
			await this._session.hunkData.recompute(editState, diff);

			this._updateCtxResponseType();
		}
		options.position = await this._strategy.renderChanges();

		if (this._session.chatModel.requestInProgress.get()) {
			return State.SHOW_REQUEST;
		} else {
			return State.WAIT_FOR_INPUT;
		}
	}

	private async [State.WAIT_FOR_INPUT](options: InlineChatRunOptions): Promise<State.ACCEPT | State.CANCEL | State.PAUSE | State.WAIT_FOR_INPUT | State.SHOW_REQUEST> {
		assertType(this._session);
		assertType(this._strategy);

		this._updatePlaceholder();

		if (options.message) {
			this._updateInput(options.message);
			aria.alert(options.message);
			delete options.message;
			this._showWidget(this._session.headless, false);
		}

		let message = Message.NONE;
		let request: IChatRequestModel | undefined;

		const barrier = new Barrier();
		const store = new DisposableStore();
		store.add(this._session.chatModel.onDidChange(e => {
			if (e.kind === 'addRequest') {
				request = e.request;
				message = Message.ACCEPT_INPUT;
				barrier.open();
			}
		}));
		store.add(this._strategy.onDidAccept(() => this.acceptSession()));
		store.add(this._strategy.onDidDiscard(() => this.cancelSession()));
		store.add(this.chatWidget.onDidHide(() => this.cancelSession()));
		store.add(Event.once(this._messages.event)(m => {
			this._log('state=_waitForInput) message received', m);
			message = m;
			barrier.open();
		}));

		if (options.attachments) {
			await Promise.all(options.attachments.map(async attachment => {
				await this._ui.value.widget.chatWidget.attachmentModel.addFile(attachment);
			}));
			delete options.attachments;
		}
		if (options.autoSend) {
			delete options.autoSend;
			this._showWidget(this._session.headless, false);
			this._ui.value.widget.chatWidget.acceptInput();
		}

		await barrier.wait();
		store.dispose();


		if (message & (Message.CANCEL_INPUT | Message.CANCEL_SESSION)) {
			return State.CANCEL;
		}

		if (message & Message.PAUSE_SESSION) {
			return State.PAUSE;
		}

		if (message & Message.ACCEPT_SESSION) {
			this._ui.value.widget.selectAll();
			return State.ACCEPT;
		}

		if (!request?.message.text) {
			return State.WAIT_FOR_INPUT;
		}


		return State.SHOW_REQUEST;
	}


	private async [State.SHOW_REQUEST](options: InlineChatRunOptions): Promise<State.WAIT_FOR_INPUT | State.CANCEL | State.PAUSE | State.ACCEPT> {
		assertType(this._session);
		assertType(this._strategy);
		assertType(this._session.chatModel.requestInProgress.get());

		this._ctxRequestInProgress.set(true);

		const { chatModel } = this._session;
		const request = chatModel.lastRequest;

		assertType(request);
		assertType(request.response);

		this._showWidget(this._session.headless, false);
		this._ui.value.widget.selectAll();
		this._ui.value.widget.updateInfo('');
		this._ui.value.widget.toggleStatus(true);

		const { response } = request;
		const responsePromise = new DeferredPromise<void>();

		const store = new DisposableStore();

		const progressiveEditsCts = store.add(new CancellationTokenSource());
		const progressiveEditsAvgDuration = new MovingAverage();
		const progressiveEditsClock = StopWatch.create();
		const progressiveEditsQueue = new Queue();

		// disable typing and squiggles while streaming a reply
		const origDeco = this._editor.getOption(EditorOption.renderValidationDecorations);
		this._editor.updateOptions({
			renderValidationDecorations: 'off'
		});
		store.add(toDisposable(() => {
			this._editor.updateOptions({
				renderValidationDecorations: origDeco
			});
		}));


		let next: State.WAIT_FOR_INPUT | State.SHOW_REQUEST | State.CANCEL | State.PAUSE | State.ACCEPT = State.WAIT_FOR_INPUT;
		store.add(Event.once(this._messages.event)(message => {
			this._log('state=_makeRequest) message received', message);
			this._chatService.cancelCurrentRequestForSession(chatModel.sessionResource);
			if (message & Message.CANCEL_SESSION) {
				next = State.CANCEL;
			} else if (message & Message.PAUSE_SESSION) {
				next = State.PAUSE;
			} else if (message & Message.ACCEPT_SESSION) {
				next = State.ACCEPT;
			}
		}));

		store.add(chatModel.onDidChange(async e => {
			if (e.kind === 'removeRequest' && e.requestId === request.id) {
				progressiveEditsCts.cancel();
				responsePromise.complete();
				if (e.reason === ChatRequestRemovalReason.Resend) {
					next = State.SHOW_REQUEST;
				} else {
					next = State.CANCEL;
				}
				return;
			}
			if (e.kind === 'move') {
				assertType(this._session);
				const log: typeof this._log = (msg: string, ...args: unknown[]) => this._log('state=_showRequest) moving inline chat', msg, ...args);

				log('move was requested', e.target, e.range);

				// if there's already a tab open for targetUri, show it and move inline chat to that tab
				// otherwise, open the tab to the side
				const initialSelection = Selection.fromRange(Range.lift(e.range), SelectionDirection.LTR);
				const editorPane = await this._editorService.openEditor({ resource: e.target, options: { selection: initialSelection } }, SIDE_GROUP);

				if (!editorPane) {
					log('opening editor failed');
					return;
				}

				const newEditor = editorPane.getControl();
				if (!isCodeEditor(newEditor) || !newEditor.hasModel()) {
					log('new editor is either missing or not a code editor or does not have a model');
					return;
				}

				if (this._inlineChatSessionService.getSession(newEditor, e.target)) {
					log('new editor ALREADY has a session');
					return;
				}

				const newSession = await this._inlineChatSessionService.createSession(
					newEditor,
					{
						session: this._session,
					},
					CancellationToken.None); // TODO@ulugbekna: add proper cancellation?


				InlineChatController1.get(newEditor)?.run({ existingSession: newSession });

				next = State.CANCEL;
				responsePromise.complete();

				return;
			}
		}));

		// cancel the request when the user types
		store.add(this._ui.value.widget.chatWidget.inputEditor.onDidChangeModelContent(() => {
			this._chatService.cancelCurrentRequestForSession(chatModel.sessionResource);
		}));

		let lastLength = 0;
		let isFirstChange = true;

		const editState = this._createChatTextEditGroupState();
		let localEditGroup: IChatTextEditGroup | undefined;

		// apply edits
		const handleResponse = () => {

			this._updateCtxResponseType();

			if (!localEditGroup) {
				localEditGroup = <IChatTextEditGroup | undefined>response.response.value.find(part => part.kind === 'textEditGroup' && isEqual(part.uri, this._session?.textModelN.uri));
			}

			if (localEditGroup) {

				localEditGroup.state ??= editState;

				const edits = localEditGroup.edits;
				const newEdits = edits.slice(lastLength);
				if (newEdits.length > 0) {

					this._log(`${this._session?.textModelN.uri.toString()} received ${newEdits.length} edits`);

					// NEW changes
					lastLength = edits.length;
					progressiveEditsAvgDuration.update(progressiveEditsClock.elapsed());
					progressiveEditsClock.reset();

					progressiveEditsQueue.queue(async () => {

						const startThen = this._session!.wholeRange.value.getStartPosition();

						// making changes goes into a queue because otherwise the async-progress time will
						// influence the time it takes to receive the changes and progressive typing will
						// become infinitely fast
						for (const edits of newEdits) {
							await this._makeChanges(edits, {
								duration: progressiveEditsAvgDuration.value,
								token: progressiveEditsCts.token
							}, isFirstChange);

							isFirstChange = false;
						}

						// reshow the widget if the start position changed or shows at the wrong position
						const startNow = this._session!.wholeRange.value.getStartPosition();
						if (!startNow.equals(startThen) || !this._ui.value.position?.equals(startNow)) {
							this._showWidget(this._session!.headless, false, startNow.delta(-1));
						}
					});
				}
			}

			if (response.isCanceled) {
				progressiveEditsCts.cancel();
				responsePromise.complete();

			} else if (response.isComplete) {
				responsePromise.complete();
			}
		};
		store.add(response.onDidChange(handleResponse));
		handleResponse();

		// (1) we must wait for the request to finish
		// (2) we must wait for all edits that came in via progress to complete
		await responsePromise.p;
		await progressiveEditsQueue.whenIdle();

		if (response.result?.errorDetails && !response.result.errorDetails.responseIsFiltered) {
			await this._session.undoChangesUntil(response.requestId);
		}

		store.dispose();

		const diff = await this._editorWorkerService.computeDiff(this._session.textModel0.uri, this._session.textModelN.uri, { computeMoves: false, maxComputationTimeMs: Number.MAX_SAFE_INTEGER, ignoreTrimWhitespace: false }, 'advanced');
		this._session.wholeRange.fixup(diff?.changes ?? []);
		await this._session.hunkData.recompute(editState, diff);

		this._ctxRequestInProgress.set(false);


		let newPosition: Position | undefined;

		if (response.result?.errorDetails) {
			// error -> no message, errors are shown with the request
			alert(response.result.errorDetails.message);
		} else if (response.response.value.length === 0) {
			// empty -> show message
			const status = localize('empty', "No results, please refine your input and try again");
			this._ui.value.widget.updateStatus(status, { classes: ['warn'] });
			alert(status);
		} else {
			// real response -> no message
			this._ui.value.widget.updateStatus('');
			alert(localize('responseWasEmpty', "Response was empty"));
		}

		const position = await this._strategy.renderChanges();
		if (position) {
			// if the selection doesn't start far off we keep the widget at its current position
			// because it makes reading this nicer
			const selection = this._editor.getSelection();
			if (selection?.containsPosition(position)) {
				if (position.lineNumber - selection.startLineNumber > 8) {
					newPosition = position;
				}
			} else {
				newPosition = position;
			}
		}
		this._showWidget(this._session.headless, false, newPosition);

		return next;
	}

	private async[State.PAUSE]() {

		this._resetWidget();

		this._strategy?.dispose?.();
		this._session = undefined;
	}

	private async[State.ACCEPT]() {
		assertType(this._session);
		assertType(this._strategy);
		this._sessionStore.clear();

		try {
			await this._strategy.apply();
		} catch (err) {
			this._dialogService.error(localize('err.apply', "Failed to apply changes.", toErrorMessage(err)));
			this._log('FAILED to apply changes');
			this._log(err);
		}

		this._resetWidget();
		this._inlineChatSessionService.releaseSession(this._session);


		this._strategy?.dispose();
		this._strategy = undefined;
		this._session = undefined;
	}

	private async[State.CANCEL]() {

		this._resetWidget();

		if (this._session) {
			// assertType(this._session);
			assertType(this._strategy);
			this._sessionStore.clear();

			// only stash sessions that were not unstashed, not "empty", and not interacted with
			const shouldStash = !this._session.isUnstashed && this._session.chatModel.hasRequests && this._session.hunkData.size === this._session.hunkData.pending;
			let undoCancelEdits: IValidEditOperation[] = [];
			try {
				undoCancelEdits = this._strategy.cancel();
			} catch (err) {
				this._dialogService.error(localize('err.discard', "Failed to discard changes.", toErrorMessage(err)));
				this._log('FAILED to discard changes');
				this._log(err);
			}

			this._stashedSession.clear();
			if (shouldStash) {
				this._stashedSession.value = this._inlineChatSessionService.stashSession(this._session, this._editor, undoCancelEdits);
			} else {
				this._inlineChatSessionService.releaseSession(this._session);
			}
		}


		this._strategy?.dispose();
		this._strategy = undefined;
		this._session = undefined;
	}

	// ----

	private _showWidget(headless: boolean = false, initialRender: boolean = false, position?: Position) {
		assertType(this._editor.hasModel());
		this._ctxVisible.set(true);

		let widgetPosition: Position;
		if (position) {
			// explicit position wins
			widgetPosition = position;
		} else if (this._ui.rawValue?.position) {
			// already showing - special case of line 1
			if (this._ui.rawValue?.position.lineNumber === 1) {
				widgetPosition = this._ui.rawValue?.position.delta(-1);
			} else {
				widgetPosition = this._ui.rawValue?.position;
			}
		} else {
			// default to ABOVE the selection
			widgetPosition = this._editor.getSelection().getStartPosition().delta(-1);
		}

		if (this._session && !position && (this._session.hasChangedText || this._session.chatModel.hasRequests)) {
			widgetPosition = this._session.wholeRange.trackedInitialRange.getStartPosition().delta(-1);
		}

		if (initialRender && (this._editor.getOption(EditorOption.stickyScroll)).enabled) {
			this._editor.revealLine(widgetPosition.lineNumber); // do NOT substract `this._editor.getOption(EditorOption.stickyScroll).maxLineCount` because the editor already does that
		}

		if (!headless) {
			if (this._ui.rawValue?.position) {
				this._ui.value.updatePositionAndHeight(widgetPosition);
			} else {
				this._ui.value.show(widgetPosition);
			}
		}

		return widgetPosition;
	}

	private _resetWidget() {

		this._sessionStore.clear();
		this._ctxVisible.reset();

		this._ui.rawValue?.hide();

		// Return focus to the editor only if the current focus is within the editor widget
		if (this._editor.hasWidgetFocus()) {
			this._editor.focus();
		}
	}

	private _updateCtxResponseType(): void {

		if (!this._session) {
			this._ctxResponseType.set(InlineChatResponseType.None);
			return;
		}

		const hasLocalEdit = (response: IResponse): boolean => {
			return response.value.some(part => part.kind === 'textEditGroup' && isEqual(part.uri, this._session?.textModelN.uri));
		};

		let responseType = InlineChatResponseType.None;
		for (const request of this._session.chatModel.getRequests()) {
			if (!request.response) {
				continue;
			}
			responseType = InlineChatResponseType.Messages;
			if (hasLocalEdit(request.response.response)) {
				responseType = InlineChatResponseType.MessagesAndEdits;
				break; // no need to check further
			}
		}
		this._ctxResponseType.set(responseType);
		this._ctxResponse.set(responseType !== InlineChatResponseType.None);
	}

	private _createChatTextEditGroupState(): IChatTextEditGroupState {
		assertType(this._session);

		const sha1 = new DefaultModelSHA1Computer();
		const textModel0Sha1 = sha1.canComputeSHA1(this._session.textModel0)
			? sha1.computeSHA1(this._session.textModel0)
			: generateUuid();

		return {
			sha1: textModel0Sha1,
			applied: 0
		};
	}

	private async _makeChanges(edits: TextEdit[], opts: ProgressingEditsOptions | undefined, undoStopBefore: boolean) {
		assertType(this._session);
		assertType(this._strategy);

		const moreMinimalEdits = await raceCancellation(this._editorWorkerService.computeMoreMinimalEdits(this._session.textModelN.uri, edits), opts?.token || CancellationToken.None);
		this._log('edits from PROVIDER and after making them MORE MINIMAL', this._session.agent.extensionId, edits, moreMinimalEdits);

		if (moreMinimalEdits?.length === 0) {
			// nothing left to do
			return;
		}

		const actualEdits = !opts && moreMinimalEdits ? moreMinimalEdits : edits;
		const editOperations = actualEdits.map(TextEdit.asEditOperation);

		const editsObserver: IEditObserver = {
			start: () => this._session!.hunkData.ignoreTextModelNChanges = true,
			stop: () => this._session!.hunkData.ignoreTextModelNChanges = false,
		};

		const metadata = this._getMetadata();
		if (opts) {
			await this._strategy.makeProgressiveChanges(editOperations, editsObserver, opts, undoStopBefore, metadata);
		} else {
			await this._strategy.makeChanges(editOperations, editsObserver, undoStopBefore, metadata);
		}
	}

	private _getMetadata(): IInlineChatMetadata {
		const lastRequest = this._session?.chatModel.lastRequest;
		return {
			extensionId: VersionedExtensionId.tryCreate(this._session?.agent.extensionId.value, this._session?.agent.extensionVersion),
			modelId: lastRequest?.modelId,
			requestId: lastRequest?.id,
		};
	}

	private _updatePlaceholder(): void {
		this._ui.value.widget.placeholder = this._session?.agent.description ?? localize('askOrEditInContext', 'Ask or edit in context');
	}

	private _updateInput(text: string, selectAll = true): void {

		this._ui.value.widget.chatWidget.setInput(text);
		if (selectAll) {
			const newSelection = new Selection(1, 1, Number.MAX_SAFE_INTEGER, 1);
			this._ui.value.widget.chatWidget.inputEditor.setSelection(newSelection);
		}
	}

	// ---- controller API

	arrowOut(up: boolean): void {
		if (this._ui.value.position && this._editor.hasModel()) {
			const { column } = this._editor.getPosition();
			const { lineNumber } = this._ui.value.position;
			const newLine = up ? lineNumber : lineNumber + 1;
			this._editor.setPosition({ lineNumber: newLine, column });
			this._editor.focus();
		}
	}

	focus(): void {
		this._ui.value.widget.focus();
	}

	async viewInChat() {
		if (!this._strategy || !this._session) {
			return;
		}

		let someApplied = false;
		let lastEdit: IChatTextEditGroup | undefined;

		const uri = this._editor.getModel()?.uri;
		const requests = this._session.chatModel.getRequests();
		for (const request of requests) {
			if (!request.response) {
				continue;
			}
			for (const part of request.response.response.value) {
				if (part.kind === 'textEditGroup' && isEqual(part.uri, uri)) {
					// fully or partially applied edits
					someApplied = someApplied || Boolean(part.state?.applied);
					lastEdit = part;
					part.edits = [];
					part.state = undefined;
				}
			}
		}

		const doEdits = this._strategy.cancel();

		if (someApplied) {
			assertType(lastEdit);
			lastEdit.edits = [doEdits];
		}

		await this._instaService.invokeFunction(moveToPanelChat, this._session?.chatModel, false);

		this.cancelSession();
	}

	acceptSession(): void {
		const response = this._session?.chatModel.getRequests().at(-1)?.response;
		if (response) {
			this._chatService.notifyUserAction({
				sessionResource: response.session.sessionResource,
				requestId: response.requestId,
				agentId: response.agent?.id,
				command: response.slashCommand?.name,
				result: response.result,
				action: {
					kind: 'inlineChat',
					action: 'accepted'
				}
			});
		}
		this._messages.fire(Message.ACCEPT_SESSION);
	}

	acceptHunk(hunkInfo?: HunkInformation) {
		return this._strategy?.performHunkAction(hunkInfo, HunkAction.Accept);
	}

	discardHunk(hunkInfo?: HunkInformation) {
		return this._strategy?.performHunkAction(hunkInfo, HunkAction.Discard);
	}

	toggleDiff(hunkInfo?: HunkInformation) {
		return this._strategy?.performHunkAction(hunkInfo, HunkAction.ToggleDiff);
	}

	moveHunk(next: boolean) {
		this.focus();
		this._strategy?.performHunkAction(undefined, next ? HunkAction.MoveNext : HunkAction.MovePrev);
	}

	async cancelSession() {
		const response = this._session?.chatModel.lastRequest?.response;
		if (response) {
			this._chatService.notifyUserAction({
				sessionResource: response.session.sessionResource,
				requestId: response.requestId,
				agentId: response.agent?.id,
				command: response.slashCommand?.name,
				result: response.result,
				action: {
					kind: 'inlineChat',
					action: 'discarded'
				}
			});
		}

		this._resetWidget();
		this._messages.fire(Message.CANCEL_SESSION);
	}

	reportIssue() {
		const response = this._session?.chatModel.lastRequest?.response;
		if (response) {
			this._chatService.notifyUserAction({
				sessionResource: response.session.sessionResource,
				requestId: response.requestId,
				agentId: response.agent?.id,
				command: response.slashCommand?.name,
				result: response.result,
				action: { kind: 'bug' }
			});
		}
	}

	unstashLastSession(): Session | undefined {
		const result = this._stashedSession.value?.unstash();
		return result;
	}

	joinCurrentRun(): Promise<void> | undefined {
		return this._currentRun;
	}

	get isActive() {
		return Boolean(this._currentRun);
	}

	async createImageAttachment(attachment: URI): Promise<IChatRequestVariableEntry | undefined> {
		if (attachment.scheme === Schemas.file) {
			if (await this._fileService.canHandleResource(attachment)) {
				return await this._chatAttachmentResolveService.resolveImageEditorAttachContext(attachment);
			}
		} else if (attachment.scheme === Schemas.http || attachment.scheme === Schemas.https) {
			const extractedImages = await this._webContentExtractorService.readImage(attachment, CancellationToken.None);
			if (extractedImages) {
				return await this._chatAttachmentResolveService.resolveImageEditorAttachContext(attachment, extractedImages);
			}
		}

		return undefined;
	}
}

export class InlineChatController2 implements IEditorContribution {

	static readonly ID = 'editor.contrib.inlineChatController2';

	static get(editor: ICodeEditor): InlineChatController2 | undefined {
		return editor.getContribution<InlineChatController2>(InlineChatController2.ID) ?? undefined;
	}

	private readonly _store = new DisposableStore();
	private readonly _isActiveController = observableValue(this, false);
	private readonly _zone: Lazy<InlineChatZoneWidget>;

	private readonly _currentSession: IObservable<IInlineChatSession2 | undefined>;

	get widget(): EditorBasedInlineChatWidget {
		return this._zone.value.widget;
	}

	get isActive() {
		return Boolean(this._currentSession.get());
	}

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@INotebookEditorService private readonly _notebookEditorService: INotebookEditorService,
		@IInlineChatSessionService private readonly _inlineChatSessionService: IInlineChatSessionService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ISharedWebContentExtractorService private readonly _webContentExtractorService: ISharedWebContentExtractorService,
		@IFileService private readonly _fileService: IFileService,
		@IChatAttachmentResolveService private readonly _chatAttachmentResolveService: IChatAttachmentResolveService,
		@IEditorService private readonly _editorService: IEditorService,
		@IMarkerDecorationsService private readonly _markerDecorationsService: IMarkerDecorationsService,
		@ILanguageModelsService private readonly _languageModelService: ILanguageModelsService,
		@IChatService chatService: IChatService,
	) {

		const ctxInlineChatVisible = CTX_INLINE_CHAT_VISIBLE.bindTo(contextKeyService);

		this._zone = new Lazy<InlineChatZoneWidget>(() => {

			assertType(this._editor.hasModel(), '[Illegal State] widget should only be created when the editor has a model');

			const location: IChatWidgetLocationOptions = {
				location: ChatAgentLocation.EditorInline,
				resolveData: () => {
					assertType(this._editor.hasModel());
					const wholeRange = this._editor.getSelection();
					const document = this._editor.getModel().uri;

					return {
						type: ChatAgentLocation.EditorInline,
						id: getEditorId(this._editor, this._editor.getModel()),
						selection: this._editor.getSelection(),
						document,
						wholeRange,
						close: () => { /* TODO@jrieken */ },
						delegateSessionResource: chatService.editingSessions.find(session =>
							session.entries.get().some(e => e.hasModificationAt({
								range: wholeRange,
								uri: document
							}))
						)?.chatSessionResource,
					};
				}
			};

			// inline chat in notebooks
			// check if this editor is part of a notebook editor
			// if so, update the location and use the notebook specific widget
			const notebookEditor = this._notebookEditorService.getNotebookForPossibleCell(this._editor);
			if (!!notebookEditor) {
				location.location = ChatAgentLocation.Notebook;
				location.resolveData = () => {
					assertType(this._editor.hasModel());

					return {
						type: ChatAgentLocation.Notebook,
						sessionInputUri: this._editor.getModel().uri,
					};
				};
			}

			const result = this._instaService.createInstance(InlineChatZoneWidget,
				location,
				{
					enableWorkingSet: 'implicit',
					enableImplicitContext: false,
					renderInputOnTop: false,
					renderInputToolbarBelowInput: true,
					filter: item => {
						if (!isResponseVM(item)) {
							return false;
						}
						return !!item.model.isPendingConfirmation.get();
					},
					menus: {
						telemetrySource: 'inlineChatWidget',
						executeToolbar: MenuId.ChatEditorInlineExecute,
						inputSideToolbar: MenuId.ChatEditorInlineInputSide
					},
					defaultMode: ChatMode.Ask
				},
				{ editor: this._editor, notebookEditor },
				() => Promise.resolve(),
			);

			result.domNode.classList.add('inline-chat-2');

			return result;
		});


		const editorObs = observableCodeEditor(_editor);

		const sessionsSignal = observableSignalFromEvent(this, _inlineChatSessionService.onDidChangeSessions);

		this._currentSession = derived(r => {
			sessionsSignal.read(r);
			const model = editorObs.model.read(r);
			const session = model && _inlineChatSessionService.getSession2(model.uri);
			return session ?? undefined;
		});


		let lastSession: IInlineChatSession2 | undefined = undefined;

		this._store.add(autorun(r => {
			const session = this._currentSession.read(r);
			if (!session) {
				this._isActiveController.set(false, undefined);

				if (lastSession && !lastSession.chatModel.hasRequests) {
					const state = lastSession.chatModel.inputModel.state.read(undefined);
					if (!state || (!state.inputText && state.attachments.length === 0)) {
						lastSession.dispose();
						lastSession = undefined;
					}
				}
				return;
			}

			lastSession = session;

			let foundOne = false;
			for (const editor of codeEditorService.listCodeEditors()) {
				if (Boolean(InlineChatController2.get(editor)?._isActiveController.read(undefined))) {
					foundOne = true;
					break;
				}
			}
			if (!foundOne && editorObs.isFocused.read(r)) {
				this._isActiveController.set(true, undefined);
			}
		}));

		const visibleSessionObs = observableValue<IInlineChatSession2 | undefined>(this, undefined);

		this._store.add(autorun(r => {

			const model = editorObs.model.read(r);
			const session = this._currentSession.read(r);
			const isActive = this._isActiveController.read(r);

			if (!session || !isActive || !model) {
				visibleSessionObs.set(undefined, undefined);
			} else {
				visibleSessionObs.set(session, undefined);
			}
		}));

		const defaultPlaceholderObs = visibleSessionObs.map((session, r) => {
			return session?.initialSelection.isEmpty()
				? localize('placeholder', "Generate code")
				: localize('placeholderWithSelection', "Modify selected code");
		});


		this._store.add(autorun(r => {

			// HIDE/SHOW
			const session = visibleSessionObs.read(r);
			if (!session) {
				this._zone.rawValue?.hide();
				this._zone.rawValue?.widget.chatWidget.setModel(undefined);
				_editor.focus();
				ctxInlineChatVisible.reset();
			} else {
				ctxInlineChatVisible.set(true);
				this._zone.value.widget.chatWidget.setModel(session.chatModel);
				if (!this._zone.value.position) {
					this._zone.value.widget.chatWidget.setInputPlaceholder(defaultPlaceholderObs.read(r));
					this._zone.value.widget.chatWidget.input.renderAttachedContext(); // TODO - fights layout bug
					this._zone.value.show(session.initialPosition);
				}
				this._zone.value.reveal(this._zone.value.position!);
				this._zone.value.widget.focus();
			}
		}));

		this._store.add(autorun(r => {
			const session = visibleSessionObs.read(r);
			if (session) {
				const entries = session.editingSession.entries.read(r);
				const otherEntries = entries.filter(entry => !isEqual(entry.modifiedURI, session.uri));
				for (const entry of otherEntries) {
					// OPEN other modified files in side group. This is a workaround, temp-solution until we have no more backend
					// that modifies other files
					this._editorService.openEditor({ resource: entry.modifiedURI }, SIDE_GROUP).catch(onUnexpectedError);
				}
			}
		}));

		const lastResponseObs = visibleSessionObs.map((session, r) => {
			if (!session) {
				return;
			}
			const lastRequest = observableFromEvent(this, session.chatModel.onDidChange, () => session.chatModel.getRequests().at(-1)).read(r);
			return lastRequest?.response;
		});

		const lastResponseProgressObs = lastResponseObs.map((response, r) => {
			if (!response) {
				return;
			}
			return observableFromEvent(this, response.onDidChange, () => response.response.value.findLast(part => part.kind === 'progressMessage')).read(r);
		});


		this._store.add(autorun(r => {
			const response = lastResponseObs.read(r);

			this._zone.rawValue?.widget.updateInfo('');

			if (!response?.isInProgress.read(r)) {

				if (response?.result?.errorDetails) {
					// ERROR case
					this._zone.rawValue?.widget.updateInfo(`$(error) ${response.result.errorDetails.message}`);
					alert(response.result.errorDetails.message);
				}

				// no response or not in progress
				this._zone.rawValue?.widget.domNode.classList.toggle('request-in-progress', false);
				this._zone.rawValue?.widget.chatWidget.setInputPlaceholder(defaultPlaceholderObs.read(r));

			} else {
				this._zone.rawValue?.widget.domNode.classList.toggle('request-in-progress', true);
				let placeholder = response.request?.message.text;
				const lastProgress = lastResponseProgressObs.read(r);
				if (lastProgress) {
					placeholder = renderAsPlaintext(lastProgress.content);
				}
				this._zone.rawValue?.widget.chatWidget.setInputPlaceholder(placeholder || localize('loading', "Working..."));
			}

		}));

		this._store.add(autorun(r => {
			const session = visibleSessionObs.read(r);
			if (!session) {
				return;
			}

			const entry = session.editingSession.readEntry(session.uri, r);
			if (entry?.state.read(r) === ModifiedFileEntryState.Modified) {
				entry?.enableReviewModeUntilSettled();
			}
		}));


		this._store.add(autorun(r => {

			const session = visibleSessionObs.read(r);
			const entry = session?.editingSession.readEntry(session.uri, r);

			// make sure there is an editor integration
			const pane = this._editorService.visibleEditorPanes.find(candidate => candidate.getControl() === this._editor || isNotebookWithCellEditor(candidate, this._editor));
			if (pane && entry) {
				entry?.getEditorIntegration(pane);
			}

			// make sure the ZONE isn't inbetween a diff and move above if so
			if (entry?.diffInfo && this._zone.value.position) {
				const { position } = this._zone.value;
				const diff = entry.diffInfo.read(r);

				for (const change of diff.changes) {
					if (change.modified.contains(position.lineNumber)) {
						this._zone.value.updatePositionAndHeight(new Position(change.modified.startLineNumber - 1, 1));
						break;
					}
				}
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}

	getWidgetPosition(): Position | undefined {
		return this._zone.rawValue?.position;
	}

	focus() {
		this._zone.rawValue?.widget.focus();
	}

	async run(arg?: InlineChatRunOptions): Promise<boolean> {
		assertType(this._editor.hasModel());


		const uri = this._editor.getModel().uri;

		const existingSession = this._inlineChatSessionService.getSession2(uri);
		if (existingSession) {
			await existingSession.editingSession.accept();
			existingSession.dispose();
		}

		this._isActiveController.set(true, undefined);

		const session = await this._inlineChatSessionService.createSession2(this._editor, uri, CancellationToken.None);

		// ADD diagnostics
		const entries: IChatRequestVariableEntry[] = [];
		for (const [range, marker] of this._markerDecorationsService.getLiveMarkers(uri)) {
			if (range.intersectRanges(this._editor.getSelection())) {
				const filter = IDiagnosticVariableEntryFilterData.fromMarker(marker);
				entries.push(IDiagnosticVariableEntryFilterData.toEntry(filter));
			}
		}
		if (entries.length > 0) {
			this._zone.value.widget.chatWidget.attachmentModel.addContext(...entries);
			this._zone.value.widget.chatWidget.input.setValue(entries.length > 1
				? localize('fixN', "Fix the attached problems")
				: localize('fix1', "Fix the attached problem"),
				true
			);
			this._zone.value.widget.chatWidget.inputEditor.setSelection(new Selection(1, 1, Number.MAX_SAFE_INTEGER, 1));
		}

		// Check args
		if (arg && InlineChatRunOptions.isInlineChatRunOptions(arg)) {
			if (arg.initialRange) {
				this._editor.revealRange(arg.initialRange);
			}
			if (arg.initialSelection) {
				this._editor.setSelection(arg.initialSelection);
			}
			if (arg.attachments) {
				await Promise.all(arg.attachments.map(async attachment => {
					await this._zone.value.widget.chatWidget.attachmentModel.addFile(attachment);
				}));
				delete arg.attachments;
			}
			if (arg.modelSelector) {
				const id = (await this._languageModelService.selectLanguageModels(arg.modelSelector, false)).sort().at(0);
				if (!id) {
					throw new Error(`No language models found matching selector: ${JSON.stringify(arg.modelSelector)}.`);
				}
				const model = this._languageModelService.lookupLanguageModel(id);
				if (!model) {
					throw new Error(`Language model not loaded: ${id}.`);
				}
				this._zone.value.widget.chatWidget.input.setCurrentLanguageModel({ metadata: model, identifier: id });
			}
			if (arg.message) {
				this._zone.value.widget.chatWidget.setInput(arg.message);
				if (arg.autoSend) {
					await this._zone.value.widget.chatWidget.acceptInput();
				}
			}
		}

		await Event.toPromise(session.editingSession.onDidDispose);

		const rejected = session.editingSession.getEntry(uri)?.state.get() === ModifiedFileEntryState.Rejected;
		return !rejected;
	}

	async acceptSession() {
		const session = this._currentSession.get();
		if (!session) {
			return;
		}
		await session.editingSession.accept();
		session.dispose();
	}

	async rejectSession() {
		const session = this._currentSession.get();
		if (!session) {
			return;
		}
		await session.editingSession.reject();
		session.dispose();
	}

	async createImageAttachment(attachment: URI): Promise<IChatRequestVariableEntry | undefined> {
		const value = this._currentSession.get();
		if (!value) {
			return undefined;
		}
		if (attachment.scheme === Schemas.file) {
			if (await this._fileService.canHandleResource(attachment)) {
				return await this._chatAttachmentResolveService.resolveImageEditorAttachContext(attachment);
			}
		} else if (attachment.scheme === Schemas.http || attachment.scheme === Schemas.https) {
			const extractedImages = await this._webContentExtractorService.readImage(attachment, CancellationToken.None);
			if (extractedImages) {
				return await this._chatAttachmentResolveService.resolveImageEditorAttachContext(attachment, extractedImages);
			}
		}
		return undefined;
	}
}

export async function reviewEdits(accessor: ServicesAccessor, editor: ICodeEditor, stream: AsyncIterable<TextEdit[]>, token: CancellationToken, applyCodeBlockSuggestionId: EditSuggestionId | undefined): Promise<boolean> {
	if (!editor.hasModel()) {
		return false;
	}

	const chatService = accessor.get(IChatService);
	const uri = editor.getModel().uri;
	const chatModelRef = chatService.startSession(ChatAgentLocation.EditorInline);
	const chatModel = chatModelRef.object as ChatModel;

	chatModel.startEditingSession(true);

	const store = new DisposableStore();
	store.add(chatModelRef);

	// STREAM
	const chatRequest = chatModel?.addRequest({ text: '', parts: [] }, { variables: [] }, 0, {
		kind: undefined,
		modeId: 'applyCodeBlock',
		modeInstructions: undefined,
		isBuiltin: true,
		applyCodeBlockSuggestionId,
	});
	assertType(chatRequest.response);
	chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: false });
	for await (const chunk of stream) {

		if (token.isCancellationRequested) {
			chatRequest.response.cancel();
			break;
		}

		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: chunk, done: false });
	}
	chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: true });

	if (!token.isCancellationRequested) {
		chatRequest.response.complete();
	}

	const isSettled = derived(r => {
		const entry = chatModel.editingSession?.readEntry(uri, r);
		if (!entry) {
			return false;
		}
		const state = entry.state.read(r);
		return state === ModifiedFileEntryState.Accepted || state === ModifiedFileEntryState.Rejected;
	});
	const whenDecided = waitForState(isSettled, Boolean);
	await raceCancellation(whenDecided, token);
	store.dispose();
	return true;
}

export async function reviewNotebookEdits(accessor: ServicesAccessor, uri: URI, stream: AsyncIterable<[URI, TextEdit[]] | ICellEditOperation[]>, token: CancellationToken): Promise<boolean> {

	const chatService = accessor.get(IChatService);
	const notebookService = accessor.get(INotebookService);
	const isNotebook = notebookService.hasSupportedNotebooks(uri);
	const chatModelRef = chatService.startSession(ChatAgentLocation.EditorInline);
	const chatModel = chatModelRef.object as ChatModel;

	chatModel.startEditingSession(true);

	const store = new DisposableStore();
	store.add(chatModelRef);

	// STREAM
	const chatRequest = chatModel?.addRequest({ text: '', parts: [] }, { variables: [] }, 0);
	assertType(chatRequest.response);
	if (isNotebook) {
		chatRequest.response.updateContent({ kind: 'notebookEdit', uri, edits: [], done: false });
	} else {
		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: false });
	}
	for await (const chunk of stream) {

		if (token.isCancellationRequested) {
			chatRequest.response.cancel();
			break;
		}
		if (chunk.every(isCellEditOperation)) {
			chatRequest.response.updateContent({ kind: 'notebookEdit', uri, edits: chunk, done: false });
		} else {
			chatRequest.response.updateContent({ kind: 'textEdit', uri: chunk[0], edits: chunk[1], done: false });
		}
	}
	if (isNotebook) {
		chatRequest.response.updateContent({ kind: 'notebookEdit', uri, edits: [], done: true });
	} else {
		chatRequest.response.updateContent({ kind: 'textEdit', uri, edits: [], done: true });
	}

	if (!token.isCancellationRequested) {
		chatRequest.response.complete();
	}

	const isSettled = derived(r => {
		const entry = chatModel.editingSession?.readEntry(uri, r);
		if (!entry) {
			return false;
		}
		const state = entry.state.read(r);
		return state === ModifiedFileEntryState.Accepted || state === ModifiedFileEntryState.Rejected;
	});

	const whenDecided = waitForState(isSettled, Boolean);

	await raceCancellation(whenDecided, token);

	store.dispose();

	return true;
}

function isCellEditOperation(edit: URI | TextEdit[] | ICellEditOperation): edit is ICellEditOperation {
	if (URI.isUri(edit)) {
		return false;
	}
	if (Array.isArray(edit)) {
		return false;
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatNotebook.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatNotebook.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalState } from '../../../../base/common/errors.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { InlineChatController } from './inlineChatController.js';
import { IInlineChatSessionService } from './inlineChatSessionService.js';
import { INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { CellUri } from '../../notebook/common/notebookCommon.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { NotebookTextDiffEditor } from '../../notebook/browser/diff/notebookDiffEditor.js';
import { NotebookMultiTextDiffEditor } from '../../notebook/browser/diff/notebookMultiDiffEditor.js';

export class InlineChatNotebookContribution {

	private readonly _store = new DisposableStore();

	constructor(
		@IInlineChatSessionService sessionService: IInlineChatSessionService,
		@IEditorService editorService: IEditorService,
		@INotebookEditorService notebookEditorService: INotebookEditorService,
	) {

		this._store.add(sessionService.registerSessionKeyComputer(Schemas.vscodeNotebookCell, {
			getComparisonKey: (editor, uri) => {
				const data = CellUri.parse(uri);
				if (!data) {
					throw illegalState('Expected notebook cell uri');
				}
				let fallback: string | undefined;
				for (const notebookEditor of notebookEditorService.listNotebookEditors()) {
					if (notebookEditor.hasModel() && isEqual(notebookEditor.textModel.uri, data.notebook)) {

						const candidate = `<notebook>${notebookEditor.getId()}#${uri}`;

						if (!fallback) {
							fallback = candidate;
						}

						// find the code editor in the list of cell-code editors
						if (notebookEditor.codeEditors.find((tuple) => tuple[1] === editor)) {
							return candidate;
						}

						// 	// reveal cell and try to find code editor again
						// 	const cell = notebookEditor.getCellByHandle(data.handle);
						// 	if (cell) {
						// 		notebookEditor.revealInViewAtTop(cell);
						// 		if (notebookEditor.codeEditors.find((tuple) => tuple[1] === editor)) {
						// 			return candidate;
						// 		}
						// 	}
					}
				}

				if (fallback) {
					return fallback;
				}

				const activeEditor = editorService.activeEditorPane;
				if (activeEditor && (activeEditor.getId() === NotebookTextDiffEditor.ID || activeEditor.getId() === NotebookMultiTextDiffEditor.ID)) {
					return `<notebook>${editor.getId()}#${uri}`;
				}

				throw illegalState('Expected notebook editor');
			}
		}));

		this._store.add(sessionService.onWillStartSession(newSessionEditor => {
			const candidate = CellUri.parse(newSessionEditor.getModel().uri);
			if (!candidate) {
				return;
			}
			for (const notebookEditor of notebookEditorService.listNotebookEditors()) {
				if (isEqual(notebookEditor.textModel?.uri, candidate.notebook)) {
					let found = false;
					const editors: ICodeEditor[] = [];
					for (const [, codeEditor] of notebookEditor.codeEditors) {
						editors.push(codeEditor);
						found = codeEditor === newSessionEditor || found;
					}
					if (found) {
						// found the this editor in the outer notebook editor -> make sure to
						// cancel all sibling sessions
						for (const editor of editors) {
							if (editor !== newSessionEditor) {
								InlineChatController.get(editor)?.acceptSession();
							}
						}
						break;
					}
				}
			}
		}));
	}

	dispose(): void {
		this._store.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatSession.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IIdentifiedSingleEditOperation, IModelDecorationOptions, IModelDeltaDecoration, ITextModel, IValidEditOperation, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { CTX_INLINE_CHAT_HAS_STASHED_SESSION } from '../common/inlineChat.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { EditOperation, ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { DetailedLineRangeMapping, LineRangeMapping, RangeMapping } from '../../../../editor/common/diff/rangeMapping.js';
import { IInlineChatSessionService } from './inlineChatSessionService.js';
import { LineRange } from '../../../../editor/common/core/ranges/lineRange.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { coalesceInPlace } from '../../../../base/common/arrays.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { IModelContentChangedEvent } from '../../../../editor/common/textModelEvents.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IChatModel, IChatRequestModel, IChatTextEditGroupState } from '../../chat/common/chatModel.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IChatAgent } from '../../chat/common/chatAgents.js';
import { IDocumentDiff } from '../../../../editor/common/diff/documentDiffProvider.js';


export type TelemetryData = {
	extension: string;
	rounds: string;
	undos: string;
	unstashed: number;
	edits: number;
	finishedByEdit: boolean;
	startTime: string;
	endTime: string;
	acceptedHunks: number;
	discardedHunks: number;
	responseTypes: string;
};

export type TelemetryDataClassification = {
	owner: 'jrieken';
	comment: 'Data about an interaction editor session';
	extension: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension providing the data' };
	rounds: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of request that were made' };
	undos: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Requests that have been undone' };
	edits: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Did edits happen while the session was active' };
	unstashed: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How often did this session become stashed and resumed' };
	finishedByEdit: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Did edits cause the session to terminate' };
	startTime: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'When the session started' };
	endTime: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'When the session ended' };
	acceptedHunks: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of accepted hunks' };
	discardedHunks: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Number of discarded hunks' };
	responseTypes: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Comma separated list of response types like edits, message, mixed' };
};


export class SessionWholeRange {

	private static readonly _options: IModelDecorationOptions = ModelDecorationOptions.register({ description: 'inlineChat/session/wholeRange' });

	private readonly _onDidChange = new Emitter<this>();
	readonly onDidChange: Event<this> = this._onDidChange.event;

	private _decorationIds: string[] = [];

	constructor(private readonly _textModel: ITextModel, wholeRange: IRange) {
		this._decorationIds = _textModel.deltaDecorations([], [{ range: wholeRange, options: SessionWholeRange._options }]);
	}

	dispose() {
		this._onDidChange.dispose();
		if (!this._textModel.isDisposed()) {
			this._textModel.deltaDecorations(this._decorationIds, []);
		}
	}

	fixup(changes: readonly DetailedLineRangeMapping[]): void {
		const newDeco: IModelDeltaDecoration[] = [];
		for (const { modified } of changes) {
			const modifiedRange = this._textModel.validateRange(modified.isEmpty
				? new Range(modified.startLineNumber, 1, modified.startLineNumber, Number.MAX_SAFE_INTEGER)
				: new Range(modified.startLineNumber, 1, modified.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER));

			newDeco.push({ range: modifiedRange, options: SessionWholeRange._options });
		}
		const [first, ...rest] = this._decorationIds; // first is the original whole range
		const newIds = this._textModel.deltaDecorations(rest, newDeco);
		this._decorationIds = [first].concat(newIds);
		this._onDidChange.fire(this);
	}

	get trackedInitialRange(): Range {
		const [first] = this._decorationIds;
		return this._textModel.getDecorationRange(first) ?? new Range(1, 1, 1, 1);
	}

	get value(): Range {
		let result: Range | undefined;
		for (const id of this._decorationIds) {
			const range = this._textModel.getDecorationRange(id);
			if (range) {
				if (!result) {
					result = range;
				} else {
					result = Range.plusRange(result, range);
				}
			}
		}
		return result!;
	}
}

export class Session {

	private _isUnstashed: boolean = false;
	private readonly _startTime = new Date();
	private readonly _teldata: TelemetryData;

	private readonly _versionByRequest = new Map<string, number>();

	constructor(
		readonly headless: boolean,
		/**
		 * The URI of the document which is being EditorEdit
		 */
		readonly targetUri: URI,
		/**
		 * A copy of the document at the time the session was started
		 */
		readonly textModel0: ITextModel,
		/**
		 * The model of the editor
		 */
		readonly textModelN: ITextModel,
		readonly agent: IChatAgent,
		readonly wholeRange: SessionWholeRange,
		readonly hunkData: HunkData,
		readonly chatModel: IChatModel,
		versionsByRequest?: [string, number][], // DEBT? this is needed when a chat model is "reused" for a new chat session
	) {

		this._teldata = {
			extension: ExtensionIdentifier.toKey(agent.extensionId),
			startTime: this._startTime.toISOString(),
			endTime: this._startTime.toISOString(),
			edits: 0,
			finishedByEdit: false,
			rounds: '',
			undos: '',
			unstashed: 0,
			acceptedHunks: 0,
			discardedHunks: 0,
			responseTypes: ''
		};
		if (versionsByRequest) {
			this._versionByRequest = new Map(versionsByRequest);
		}
	}

	get isUnstashed(): boolean {
		return this._isUnstashed;
	}

	markUnstashed() {
		this._teldata.unstashed! += 1;
		this._isUnstashed = true;
	}

	markModelVersion(request: IChatRequestModel) {
		this._versionByRequest.set(request.id, this.textModelN.getAlternativeVersionId());
	}

	get versionsByRequest() {
		return Array.from(this._versionByRequest);
	}

	async undoChangesUntil(requestId: string): Promise<boolean> {

		const targetAltVersion = this._versionByRequest.get(requestId);
		if (targetAltVersion === undefined) {
			return false;
		}
		// undo till this point
		this.hunkData.ignoreTextModelNChanges = true;
		try {
			while (targetAltVersion < this.textModelN.getAlternativeVersionId() && this.textModelN.canUndo()) {
				await this.textModelN.undo();
			}
		} finally {
			this.hunkData.ignoreTextModelNChanges = false;
		}
		return true;
	}

	get hasChangedText(): boolean {
		return !this.textModel0.equalsTextBuffer(this.textModelN.getTextBuffer());
	}

	asChangedText(changes: readonly LineRangeMapping[]): string | undefined {
		if (changes.length === 0) {
			return undefined;
		}

		let startLine = Number.MAX_VALUE;
		let endLine = Number.MIN_VALUE;
		for (const change of changes) {
			startLine = Math.min(startLine, change.modified.startLineNumber);
			endLine = Math.max(endLine, change.modified.endLineNumberExclusive);
		}

		return this.textModelN.getValueInRange(new Range(startLine, 1, endLine, Number.MAX_VALUE));
	}

	recordExternalEditOccurred(didFinish: boolean) {
		this._teldata.edits += 1;
		this._teldata.finishedByEdit = didFinish;
	}

	asTelemetryData(): TelemetryData {

		for (const item of this.hunkData.getInfo()) {
			switch (item.getState()) {
				case HunkState.Accepted:
					this._teldata.acceptedHunks += 1;
					break;
				case HunkState.Rejected:
					this._teldata.discardedHunks += 1;
					break;
			}
		}

		this._teldata.endTime = new Date().toISOString();
		return this._teldata;
	}
}


export class StashedSession {

	private readonly _listener: IDisposable;
	private readonly _ctxHasStashedSession: IContextKey<boolean>;
	private _session: Session | undefined;

	constructor(
		editor: ICodeEditor,
		session: Session,
		private readonly _undoCancelEdits: IValidEditOperation[],
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInlineChatSessionService private readonly _sessionService: IInlineChatSessionService,
		@ILogService private readonly _logService: ILogService
	) {
		this._ctxHasStashedSession = CTX_INLINE_CHAT_HAS_STASHED_SESSION.bindTo(contextKeyService);

		// keep session for a little bit, only release when user continues to work (type, move cursor, etc.)
		this._session = session;
		this._ctxHasStashedSession.set(true);
		this._listener = Event.once(Event.any(editor.onDidChangeCursorSelection, editor.onDidChangeModelContent, editor.onDidChangeModel, editor.onDidBlurEditorWidget))(() => {
			this._session = undefined;
			this._sessionService.releaseSession(session);
			this._ctxHasStashedSession.reset();
		});
	}

	dispose() {
		this._listener.dispose();
		this._ctxHasStashedSession.reset();
		if (this._session) {
			this._sessionService.releaseSession(this._session);
		}
	}

	unstash(): Session | undefined {
		if (!this._session) {
			return undefined;
		}
		this._listener.dispose();
		const result = this._session;
		result.markUnstashed();
		result.hunkData.ignoreTextModelNChanges = true;
		result.textModelN.pushEditOperations(null, this._undoCancelEdits, () => null);
		result.hunkData.ignoreTextModelNChanges = false;
		this._session = undefined;
		this._logService.debug('[IE] Unstashed session');
		return result;
	}
}

// ---

function lineRangeAsRange(lineRange: LineRange, model: ITextModel): Range {
	return lineRange.isEmpty
		? new Range(lineRange.startLineNumber, 1, lineRange.startLineNumber, Number.MAX_SAFE_INTEGER)
		: new Range(lineRange.startLineNumber, 1, lineRange.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
}

export class HunkData {

	private static readonly _HUNK_TRACKED_RANGE = ModelDecorationOptions.register({
		description: 'inline-chat-hunk-tracked-range',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
	});

	private static readonly _HUNK_THRESHOLD = 8;

	private readonly _store = new DisposableStore();
	private readonly _data = new Map<RawHunk, RawHunkData>();
	private _ignoreChanges: boolean = false;

	constructor(
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		private readonly _textModel0: ITextModel,
		private readonly _textModelN: ITextModel,
	) {

		this._store.add(_textModelN.onDidChangeContent(e => {
			if (!this._ignoreChanges) {
				this._mirrorChanges(e);
			}
		}));
	}

	dispose(): void {
		if (!this._textModelN.isDisposed()) {
			this._textModelN.changeDecorations(accessor => {
				for (const { textModelNDecorations } of this._data.values()) {
					textModelNDecorations.forEach(accessor.removeDecoration, accessor);
				}
			});
		}
		if (!this._textModel0.isDisposed()) {
			this._textModel0.changeDecorations(accessor => {
				for (const { textModel0Decorations } of this._data.values()) {
					textModel0Decorations.forEach(accessor.removeDecoration, accessor);
				}
			});
		}
		this._data.clear();
		this._store.dispose();
	}

	set ignoreTextModelNChanges(value: boolean) {
		this._ignoreChanges = value;
	}

	get ignoreTextModelNChanges(): boolean {
		return this._ignoreChanges;
	}

	private _mirrorChanges(event: IModelContentChangedEvent) {

		// mirror textModelN changes to textModel0 execept for those that
		// overlap with a hunk

		type HunkRangePair = { rangeN: Range; range0: Range; markAccepted: () => void };
		const hunkRanges: HunkRangePair[] = [];

		const ranges0: Range[] = [];

		for (const entry of this._data.values()) {

			if (entry.state === HunkState.Pending) {
				// pending means the hunk's changes aren't "sync'd" yet
				for (let i = 1; i < entry.textModelNDecorations.length; i++) {
					const rangeN = this._textModelN.getDecorationRange(entry.textModelNDecorations[i]);
					const range0 = this._textModel0.getDecorationRange(entry.textModel0Decorations[i]);
					if (rangeN && range0) {
						hunkRanges.push({
							rangeN, range0,
							markAccepted: () => entry.state = HunkState.Accepted
						});
					}
				}

			} else if (entry.state === HunkState.Accepted) {
				// accepted means the hunk's changes are also in textModel0
				for (let i = 1; i < entry.textModel0Decorations.length; i++) {
					const range = this._textModel0.getDecorationRange(entry.textModel0Decorations[i]);
					if (range) {
						ranges0.push(range);
					}
				}
			}
		}

		hunkRanges.sort((a, b) => Range.compareRangesUsingStarts(a.rangeN, b.rangeN));
		ranges0.sort(Range.compareRangesUsingStarts);

		const edits: IIdentifiedSingleEditOperation[] = [];

		for (const change of event.changes) {

			let isOverlapping = false;

			let pendingChangesLen = 0;

			for (const entry of hunkRanges) {
				if (entry.rangeN.getEndPosition().isBefore(Range.getStartPosition(change.range))) {
					// pending hunk _before_ this change. When projecting into textModel0 we need to
					// subtract that. Because diffing is relaxed it might include changes that are not
					// actual insertions/deletions. Therefore we need to take the length of the original
					// range into account.
					pendingChangesLen += this._textModelN.getValueLengthInRange(entry.rangeN);
					pendingChangesLen -= this._textModel0.getValueLengthInRange(entry.range0);

				} else if (Range.areIntersectingOrTouching(entry.rangeN, change.range)) {
					// an edit overlaps with a (pending) hunk. We take this as a signal
					// to mark the hunk as accepted and to ignore the edit. The range of the hunk
					// will be up-to-date because of decorations created for them
					entry.markAccepted();
					isOverlapping = true;
					break;

				} else {
					// hunks past this change aren't relevant
					break;
				}
			}

			if (isOverlapping) {
				// hunk overlaps, it grew
				continue;
			}

			const offset0 = change.rangeOffset - pendingChangesLen;
			const start0 = this._textModel0.getPositionAt(offset0);

			let acceptedChangesLen = 0;
			for (const range of ranges0) {
				if (range.getEndPosition().isBefore(start0)) {
					// accepted hunk _before_ this projected change. When projecting into textModel0
					// we need to add that
					acceptedChangesLen += this._textModel0.getValueLengthInRange(range);
				}
			}

			const start = this._textModel0.getPositionAt(offset0 + acceptedChangesLen);
			const end = this._textModel0.getPositionAt(offset0 + acceptedChangesLen + change.rangeLength);
			edits.push(EditOperation.replace(Range.fromPositions(start, end), change.text));
		}

		this._textModel0.pushEditOperations(null, edits, () => null);
	}

	async recompute(editState: IChatTextEditGroupState, diff?: IDocumentDiff | null) {

		diff ??= await this._editorWorkerService.computeDiff(this._textModel0.uri, this._textModelN.uri, { ignoreTrimWhitespace: false, maxComputationTimeMs: Number.MAX_SAFE_INTEGER, computeMoves: false }, 'advanced');

		let mergedChanges: DetailedLineRangeMapping[] = [];

		if (diff && diff.changes.length > 0) {
			// merge changes neighboring changes
			mergedChanges = [diff.changes[0]];
			for (let i = 1; i < diff.changes.length; i++) {
				const lastChange = mergedChanges[mergedChanges.length - 1];
				const thisChange = diff.changes[i];
				if (thisChange.modified.startLineNumber - lastChange.modified.endLineNumberExclusive <= HunkData._HUNK_THRESHOLD) {
					mergedChanges[mergedChanges.length - 1] = new DetailedLineRangeMapping(
						lastChange.original.join(thisChange.original),
						lastChange.modified.join(thisChange.modified),
						(lastChange.innerChanges ?? []).concat(thisChange.innerChanges ?? [])
					);
				} else {
					mergedChanges.push(thisChange);
				}
			}
		}

		const hunks = mergedChanges.map(change => new RawHunk(change.original, change.modified, change.innerChanges ?? []));

		editState.applied = hunks.length;

		this._textModelN.changeDecorations(accessorN => {

			this._textModel0.changeDecorations(accessor0 => {

				// clean up old decorations
				for (const { textModelNDecorations, textModel0Decorations } of this._data.values()) {
					textModelNDecorations.forEach(accessorN.removeDecoration, accessorN);
					textModel0Decorations.forEach(accessor0.removeDecoration, accessor0);
				}

				this._data.clear();

				// add new decorations
				for (const hunk of hunks) {

					const textModelNDecorations: string[] = [];
					const textModel0Decorations: string[] = [];

					textModelNDecorations.push(accessorN.addDecoration(lineRangeAsRange(hunk.modified, this._textModelN), HunkData._HUNK_TRACKED_RANGE));
					textModel0Decorations.push(accessor0.addDecoration(lineRangeAsRange(hunk.original, this._textModel0), HunkData._HUNK_TRACKED_RANGE));

					for (const change of hunk.changes) {
						textModelNDecorations.push(accessorN.addDecoration(change.modifiedRange, HunkData._HUNK_TRACKED_RANGE));
						textModel0Decorations.push(accessor0.addDecoration(change.originalRange, HunkData._HUNK_TRACKED_RANGE));
					}

					this._data.set(hunk, {
						editState,
						textModelNDecorations,
						textModel0Decorations,
						state: HunkState.Pending
					});
				}
			});
		});
	}

	get size(): number {
		return this._data.size;
	}

	get pending(): number {
		return Iterable.reduce(this._data.values(), (r, { state }) => r + (state === HunkState.Pending ? 1 : 0), 0);
	}

	private _discardEdits(item: HunkInformation): ISingleEditOperation[] {
		const edits: ISingleEditOperation[] = [];
		const rangesN = item.getRangesN();
		const ranges0 = item.getRanges0();
		for (let i = 1; i < rangesN.length; i++) {
			const modifiedRange = rangesN[i];

			const originalValue = this._textModel0.getValueInRange(ranges0[i]);
			edits.push(EditOperation.replace(modifiedRange, originalValue));
		}
		return edits;
	}

	discardAll() {
		const edits: ISingleEditOperation[][] = [];
		for (const item of this.getInfo()) {
			if (item.getState() === HunkState.Pending) {
				edits.push(this._discardEdits(item));
			}
		}
		const undoEdits: IValidEditOperation[][] = [];
		this._textModelN.pushEditOperations(null, edits.flat(), (_undoEdits) => {
			undoEdits.push(_undoEdits);
			return null;
		});
		return undoEdits.flat();
	}

	getInfo(): HunkInformation[] {

		const result: HunkInformation[] = [];

		for (const [hunk, data] of this._data.entries()) {
			const item: HunkInformation = {
				getState: () => {
					return data.state;
				},
				isInsertion: () => {
					return hunk.original.isEmpty;
				},
				getRangesN: () => {
					const ranges = data.textModelNDecorations.map(id => this._textModelN.getDecorationRange(id));
					coalesceInPlace(ranges);
					return ranges;
				},
				getRanges0: () => {
					const ranges = data.textModel0Decorations.map(id => this._textModel0.getDecorationRange(id));
					coalesceInPlace(ranges);
					return ranges;
				},
				discardChanges: () => {
					// DISCARD: replace modified range with original value. The modified range is retrieved from a decoration
					// which was created above so that typing in the editor keeps discard working.
					if (data.state === HunkState.Pending) {
						const edits = this._discardEdits(item);
						this._textModelN.pushEditOperations(null, edits, () => null);
						data.state = HunkState.Rejected;
						if (data.editState.applied > 0) {
							data.editState.applied -= 1;
						}
					}
				},
				acceptChanges: () => {
					// ACCEPT: replace original range with modified value. The modified value is retrieved from the model via
					// its decoration and the original range is retrieved from the hunk.
					if (data.state === HunkState.Pending) {
						const edits: ISingleEditOperation[] = [];
						const rangesN = item.getRangesN();
						const ranges0 = item.getRanges0();
						for (let i = 1; i < ranges0.length; i++) {
							const originalRange = ranges0[i];
							const modifiedValue = this._textModelN.getValueInRange(rangesN[i]);
							edits.push(EditOperation.replace(originalRange, modifiedValue));
						}
						this._textModel0.pushEditOperations(null, edits, () => null);
						data.state = HunkState.Accepted;
					}
				}
			};
			result.push(item);
		}

		return result;
	}
}

class RawHunk {
	constructor(
		readonly original: LineRange,
		readonly modified: LineRange,
		readonly changes: RangeMapping[]
	) { }
}

type RawHunkData = {
	textModelNDecorations: string[];
	textModel0Decorations: string[];
	state: HunkState;
	editState: IChatTextEditGroupState;
};

export const enum HunkState {
	Pending = 0,
	Accepted = 1,
	Rejected = 2
}

export interface HunkInformation {
	/**
	 * The first element [0] is the whole modified range and subsequent elements are word-level changes
	 */
	getRangesN(): Range[];

	getRanges0(): Range[];

	isInsertion(): boolean;

	discardChanges(): void;

	/**
	 * Accept the hunk. Applies the corresponding edits into textModel0
	 */
	acceptChanges(): void;

	getState(): HunkState;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatSessionService.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatSessionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { IValidEditOperation } from '../../../../editor/common/model.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ChatViewPaneTarget, IChatWidgetService } from '../../chat/browser/chat.js';
import { IChatEditingSession } from '../../chat/common/chatEditingService.js';
import { IChatModel, IChatModelInputState, IChatRequestModel } from '../../chat/common/chatModel.js';
import { IChatService } from '../../chat/common/chatService.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';
import { Session, StashedSession } from './inlineChatSession.js';

export interface ISessionKeyComputer {
	getComparisonKey(editor: ICodeEditor, uri: URI): string;
}

export const IInlineChatSessionService = createDecorator<IInlineChatSessionService>('IInlineChatSessionService');

export interface IInlineChatSessionEvent {
	readonly editor: ICodeEditor;
	readonly session: Session;
}

export interface IInlineChatSessionEndEvent extends IInlineChatSessionEvent {
	readonly endedByExternalCause: boolean;
}

export interface IInlineChatSession2 {
	readonly initialPosition: Position;
	readonly initialSelection: Selection;
	readonly uri: URI;
	readonly chatModel: IChatModel;
	readonly editingSession: IChatEditingSession;
	dispose(): void;
}

export interface IInlineChatSessionService {
	_serviceBrand: undefined;

	readonly onWillStartSession: Event<IActiveCodeEditor>;
	readonly onDidMoveSession: Event<IInlineChatSessionEvent>;
	readonly onDidStashSession: Event<IInlineChatSessionEvent>;
	readonly onDidEndSession: Event<IInlineChatSessionEndEvent>;

	createSession(editor: IActiveCodeEditor, options: { wholeRange?: IRange; session?: Session; headless?: boolean }, token: CancellationToken): Promise<Session | undefined>;

	moveSession(session: Session, newEditor: ICodeEditor): void;

	getCodeEditor(session: Session): ICodeEditor;

	getSession(editor: ICodeEditor, uri: URI): Session | undefined;

	releaseSession(session: Session): void;

	stashSession(session: Session, editor: ICodeEditor, undoCancelEdits: IValidEditOperation[]): StashedSession;

	registerSessionKeyComputer(scheme: string, value: ISessionKeyComputer): IDisposable;

	dispose(): void;

	createSession2(editor: ICodeEditor, uri: URI, token: CancellationToken): Promise<IInlineChatSession2>;
	getSession2(uri: URI): IInlineChatSession2 | undefined;
	getSessionBySessionUri(uri: URI): IInlineChatSession2 | undefined;
	readonly onDidChangeSessions: Event<this>;
}

export async function moveToPanelChat(accessor: ServicesAccessor, model: IChatModel | undefined, resend: boolean) {

	const chatService = accessor.get(IChatService);
	const widgetService = accessor.get(IChatWidgetService);

	const widget = await widgetService.revealWidget();

	if (widget && widget.viewModel && model) {
		let lastRequest: IChatRequestModel | undefined;
		for (const request of model.getRequests().slice()) {
			await chatService.adoptRequest(widget.viewModel.model.sessionResource, request);
			lastRequest = request;
		}

		if (lastRequest && resend) {
			chatService.resendRequest(lastRequest, { location: widget.location });
		}

		widget.focusResponseItem();
	}
}

export async function askInPanelChat(accessor: ServicesAccessor, request: IChatRequestModel, state: IChatModelInputState | undefined) {

	const widgetService = accessor.get(IChatWidgetService);
	const chatService = accessor.get(IChatService);


	if (!request) {
		return;
	}

	const newModelRef = chatService.startSession(ChatAgentLocation.Chat);
	const newModel = newModelRef.object;

	newModel.inputModel.setState({ ...state });

	const widget = await widgetService.openSession(newModelRef.object.sessionResource, ChatViewPaneTarget);

	newModelRef.dispose(); // can be freed after opening because the widget also holds a reference
	widget?.acceptInput(request.message.text);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatSessionServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatSessionServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Schemas } from '../../../../base/common/network.js';
import { autorun, observableFromEvent } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IActiveCodeEditor, ICodeEditor, isCodeEditor, isCompositeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IValidEditOperation } from '../../../../editor/common/model.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../editor/common/model/textModel.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../common/editor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { UntitledTextEditorInput } from '../../../services/untitled/common/untitledTextEditorInput.js';
import { IChatWidgetService } from '../../chat/browser/chat.js';
import { IChatAgentService } from '../../chat/common/chatAgents.js';
import { ModifiedFileEntryState } from '../../chat/common/chatEditingService.js';
import { IChatService } from '../../chat/common/chatService.js';
import { ChatAgentLocation } from '../../chat/common/constants.js';
import { ILanguageModelToolsService, IToolData, ToolDataSource } from '../../chat/common/languageModelToolsService.js';
import { CTX_INLINE_CHAT_HAS_AGENT2, CTX_INLINE_CHAT_HAS_NOTEBOOK_AGENT, CTX_INLINE_CHAT_HAS_NOTEBOOK_INLINE, CTX_INLINE_CHAT_POSSIBLE, InlineChatConfigKeys } from '../common/inlineChat.js';
import { HunkData, Session, SessionWholeRange, StashedSession, TelemetryData, TelemetryDataClassification } from './inlineChatSession.js';
import { askInPanelChat, IInlineChatSession2, IInlineChatSessionEndEvent, IInlineChatSessionEvent, IInlineChatSessionService, ISessionKeyComputer } from './inlineChatSessionService.js';


type SessionData = {
	editor: ICodeEditor;
	session: Session;
	store: IDisposable;
};

export class InlineChatError extends Error {
	static readonly code = 'InlineChatError';
	constructor(message: string) {
		super(message);
		this.name = InlineChatError.code;
	}
}


export class InlineChatSessionServiceImpl implements IInlineChatSessionService {

	declare _serviceBrand: undefined;

	private readonly _store = new DisposableStore();

	private readonly _onWillStartSession = this._store.add(new Emitter<IActiveCodeEditor>());
	readonly onWillStartSession: Event<IActiveCodeEditor> = this._onWillStartSession.event;

	private readonly _onDidMoveSession = this._store.add(new Emitter<IInlineChatSessionEvent>());
	readonly onDidMoveSession: Event<IInlineChatSessionEvent> = this._onDidMoveSession.event;

	private readonly _onDidEndSession = this._store.add(new Emitter<IInlineChatSessionEndEvent>());
	readonly onDidEndSession: Event<IInlineChatSessionEndEvent> = this._onDidEndSession.event;

	private readonly _onDidStashSession = this._store.add(new Emitter<IInlineChatSessionEvent>());
	readonly onDidStashSession: Event<IInlineChatSessionEvent> = this._onDidStashSession.event;

	private readonly _sessions = new Map<string, SessionData>();
	private readonly _keyComputers = new Map<string, ISessionKeyComputer>();

	constructor(
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@ILogService private readonly _logService: ILogService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IEditorService private readonly _editorService: IEditorService,
		@ITextFileService private readonly _textFileService: ITextFileService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IChatService private readonly _chatService: IChatService,
		@IChatAgentService private readonly _chatAgentService: IChatAgentService,
		@IChatWidgetService private readonly _chatWidgetService: IChatWidgetService,
	) {

	}

	dispose() {
		this._store.dispose();
		this._sessions.forEach(x => x.store.dispose());
		this._sessions.clear();
	}

	async createSession(editor: IActiveCodeEditor, options: { headless?: boolean; wholeRange?: Range; session?: Session }, token: CancellationToken): Promise<Session | undefined> {

		const agent = this._chatAgentService.getDefaultAgent(ChatAgentLocation.EditorInline);

		if (!agent) {
			this._logService.trace('[IE] NO agent found');
			return undefined;
		}

		this._onWillStartSession.fire(editor);

		const textModel = editor.getModel();
		const selection = editor.getSelection();

		const store = new DisposableStore();
		this._logService.trace(`[IE] creating NEW session for ${editor.getId()}, ${agent.extensionId}`);

		const chatModelRef = options.session ? undefined : this._chatService.startSession(ChatAgentLocation.EditorInline);
		const chatModel = options.session?.chatModel ?? chatModelRef?.object;
		if (!chatModel) {
			this._logService.trace('[IE] NO chatModel found');
			chatModelRef?.dispose();
			return undefined;
		}
		if (chatModelRef) {
			store.add(chatModelRef);
		}

		const lastResponseListener = store.add(new MutableDisposable());
		store.add(chatModel.onDidChange(e => {
			if (e.kind !== 'addRequest' || !e.request.response) {
				return;
			}

			const { response } = e.request;

			session.markModelVersion(e.request);
			lastResponseListener.value = response.onDidChange(() => {

				if (!response.isComplete) {
					return;
				}

				lastResponseListener.clear(); // ONCE

				// special handling for untitled files
				for (const part of response.response.value) {
					if (part.kind !== 'textEditGroup' || part.uri.scheme !== Schemas.untitled || isEqual(part.uri, session.textModelN.uri)) {
						continue;
					}
					const langSelection = this._languageService.createByFilepathOrFirstLine(part.uri, undefined);
					const untitledTextModel = this._textFileService.untitled.create({
						associatedResource: part.uri,
						languageId: langSelection.languageId
					});
					untitledTextModel.resolve();
					this._textModelService.createModelReference(part.uri).then(ref => {
						store.add(ref);
					});
				}

			});
		}));

		store.add(this._chatAgentService.onDidChangeAgents(e => {
			if (e === undefined && (!this._chatAgentService.getAgent(agent.id) || !this._chatAgentService.getActivatedAgents().map(agent => agent.id).includes(agent.id))) {
				this._logService.trace(`[IE] provider GONE for ${editor.getId()}, ${agent.extensionId}`);
				this._releaseSession(session, true);
			}
		}));

		const id = generateUuid();
		const targetUri = textModel.uri;

		// AI edits happen in the actual model, keep a reference but make no copy
		store.add((await this._textModelService.createModelReference(textModel.uri)));
		const textModelN = textModel;

		// create: keep a snapshot of the "actual" model
		const textModel0 = store.add(this._modelService.createModel(
			createTextBufferFactoryFromSnapshot(textModel.createSnapshot()),
			{ languageId: textModel.getLanguageId(), onDidChange: Event.None },
			targetUri.with({ scheme: Schemas.vscode, authority: 'inline-chat', path: '', query: new URLSearchParams({ id, 'textModel0': '' }).toString() }), true
		));

		// untitled documents are special and we are releasing their session when their last editor closes
		if (targetUri.scheme === Schemas.untitled) {
			store.add(this._editorService.onDidCloseEditor(() => {
				if (!this._editorService.isOpened({ resource: targetUri, typeId: UntitledTextEditorInput.ID, editorId: DEFAULT_EDITOR_ASSOCIATION.id })) {
					this._releaseSession(session, true);
				}
			}));
		}

		let wholeRange = options.wholeRange;
		if (!wholeRange) {
			wholeRange = new Range(selection.selectionStartLineNumber, selection.selectionStartColumn, selection.positionLineNumber, selection.positionColumn);
		}

		if (token.isCancellationRequested) {
			store.dispose();
			return undefined;
		}

		const session = new Session(
			options.headless ?? false,
			targetUri,
			textModel0,
			textModelN,
			agent,
			store.add(new SessionWholeRange(textModelN, wholeRange)),
			store.add(new HunkData(this._editorWorkerService, textModel0, textModelN)),
			chatModel,
			options.session?.versionsByRequest,
		);

		// store: key -> session
		const key = this._key(editor, session.targetUri);
		if (this._sessions.has(key)) {
			store.dispose();
			throw new Error(`Session already stored for ${key}`);
		}
		this._sessions.set(key, { session, editor, store });
		return session;
	}

	moveSession(session: Session, target: ICodeEditor): void {
		const newKey = this._key(target, session.targetUri);
		const existing = this._sessions.get(newKey);
		if (existing) {
			if (existing.session !== session) {
				throw new Error(`Cannot move session because the target editor already/still has one`);
			} else {
				// noop
				return;
			}
		}

		let found = false;
		for (const [oldKey, data] of this._sessions) {
			if (data.session === session) {
				found = true;
				this._sessions.delete(oldKey);
				this._sessions.set(newKey, { ...data, editor: target });
				this._logService.trace(`[IE] did MOVE session for ${data.editor.getId()} to NEW EDITOR ${target.getId()}, ${session.agent.extensionId}`);
				this._onDidMoveSession.fire({ session, editor: target });
				break;
			}
		}
		if (!found) {
			throw new Error(`Cannot move session because it is not stored`);
		}
	}

	releaseSession(session: Session): void {
		this._releaseSession(session, false);
	}

	private _releaseSession(session: Session, byServer: boolean): void {

		let tuple: [string, SessionData] | undefined;

		// cleanup
		for (const candidate of this._sessions) {
			if (candidate[1].session === session) {
				// if (value.session === session) {
				tuple = candidate;
				break;
			}
		}

		if (!tuple) {
			// double remove
			return;
		}

		this._telemetryService.publicLog2<TelemetryData, TelemetryDataClassification>('interactiveEditor/session', session.asTelemetryData());

		const [key, value] = tuple;
		this._sessions.delete(key);
		this._logService.trace(`[IE] did RELEASED session for ${value.editor.getId()}, ${session.agent.extensionId}`);

		this._onDidEndSession.fire({ editor: value.editor, session, endedByExternalCause: byServer });
		value.store.dispose();
	}

	stashSession(session: Session, editor: ICodeEditor, undoCancelEdits: IValidEditOperation[]): StashedSession {
		const result = this._instaService.createInstance(StashedSession, editor, session, undoCancelEdits);
		this._onDidStashSession.fire({ editor, session });
		this._logService.trace(`[IE] did STASH session for ${editor.getId()}, ${session.agent.extensionId}`);
		return result;
	}

	getCodeEditor(session: Session): ICodeEditor {
		for (const [, data] of this._sessions) {
			if (data.session === session) {
				return data.editor;
			}
		}
		throw new Error('session not found');
	}

	getSession(editor: ICodeEditor, uri: URI): Session | undefined {
		const key = this._key(editor, uri);
		return this._sessions.get(key)?.session;
	}

	private _key(editor: ICodeEditor, uri: URI): string {
		const item = this._keyComputers.get(uri.scheme);
		return item
			? item.getComparisonKey(editor, uri)
			: `${editor.getId()}@${uri.toString()}`;

	}

	registerSessionKeyComputer(scheme: string, value: ISessionKeyComputer): IDisposable {
		this._keyComputers.set(scheme, value);
		return toDisposable(() => this._keyComputers.delete(scheme));
	}

	// ---- NEW

	private readonly _sessions2 = new ResourceMap<IInlineChatSession2>();

	private readonly _onDidChangeSessions = this._store.add(new Emitter<this>());
	readonly onDidChangeSessions: Event<this> = this._onDidChangeSessions.event;


	async createSession2(editor: ICodeEditor, uri: URI, token: CancellationToken): Promise<IInlineChatSession2> {

		assertType(editor.hasModel());

		if (this._sessions2.has(uri)) {
			throw new Error('Session already exists');
		}

		this._onWillStartSession.fire(editor as IActiveCodeEditor);

		const chatModelRef = this._chatService.startSession(ChatAgentLocation.EditorInline, { canUseTools: false /* SEE https://github.com/microsoft/vscode/issues/279946 */ });
		const chatModel = chatModelRef.object;
		chatModel.startEditingSession(false);

		const widget = this._chatWidgetService.getWidgetBySessionResource(chatModel.sessionResource);
		await widget?.attachmentModel.addFile(uri);

		const store = new DisposableStore();
		store.add(toDisposable(() => {
			this._chatService.cancelCurrentRequestForSession(chatModel.sessionResource);
			chatModel.editingSession?.reject();
			this._sessions2.delete(uri);
			this._onDidChangeSessions.fire(this);
		}));
		store.add(chatModelRef);

		store.add(autorun(r => {

			const entries = chatModel.editingSession?.entries.read(r);
			if (!entries?.length) {
				return;
			}

			const state = entries.find(entry => isEqual(entry.modifiedURI, uri))?.state.read(r);
			if (state === ModifiedFileEntryState.Accepted || state === ModifiedFileEntryState.Rejected) {
				const response = chatModel.getRequests().at(-1)?.response;
				if (response) {
					this._chatService.notifyUserAction({
						sessionResource: response.session.sessionResource,
						requestId: response.requestId,
						agentId: response.agent?.id,
						command: response.slashCommand?.name,
						result: response.result,
						action: {
							kind: 'inlineChat',
							action: state === ModifiedFileEntryState.Accepted ? 'accepted' : 'discarded'
						}
					});
				}
			}

			const allSettled = entries.every(entry => {
				const state = entry.state.read(r);
				return (state === ModifiedFileEntryState.Accepted || state === ModifiedFileEntryState.Rejected)
					&& !entry.isCurrentlyBeingModifiedBy.read(r);
			});

			if (allSettled && !chatModel.requestInProgress.read(undefined)) {
				// self terminate
				store.dispose();
			}
		}));

		const result: IInlineChatSession2 = {
			uri,
			initialPosition: editor.getSelection().getStartPosition().delta(-1), /* one line above selection start */
			initialSelection: editor.getSelection(),
			chatModel,
			editingSession: chatModel.editingSession!,
			dispose: store.dispose.bind(store)
		};
		this._sessions2.set(uri, result);
		this._onDidChangeSessions.fire(this);
		return result;
	}

	getSession2(uri: URI): IInlineChatSession2 | undefined {
		let result = this._sessions2.get(uri);
		if (!result) {
			// no direct session, try to find an editing session which has a file entry for the uri
			for (const [_, candidate] of this._sessions2) {
				const entry = candidate.editingSession.getEntry(uri);
				if (entry) {
					result = candidate;
					break;
				}
			}
		}
		return result;
	}

	getSessionBySessionUri(sessionResource: URI): IInlineChatSession2 | undefined {
		for (const session of this._sessions2.values()) {
			if (isEqual(session.chatModel.sessionResource, sessionResource)) {
				return session;
			}
		}
		return undefined;
	}
}

export class InlineChatEnabler {

	static Id = 'inlineChat.enabler';

	private readonly _ctxHasProvider2: IContextKey<boolean>;
	private readonly _ctxHasNotebookInline: IContextKey<boolean>;
	private readonly _ctxHasNotebookProvider: IContextKey<boolean>;
	private readonly _ctxPossible: IContextKey<boolean>;

	private readonly _store = new DisposableStore();

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatAgentService chatAgentService: IChatAgentService,
		@IEditorService editorService: IEditorService,
		@IConfigurationService configService: IConfigurationService,
	) {
		this._ctxHasProvider2 = CTX_INLINE_CHAT_HAS_AGENT2.bindTo(contextKeyService);
		this._ctxHasNotebookInline = CTX_INLINE_CHAT_HAS_NOTEBOOK_INLINE.bindTo(contextKeyService);
		this._ctxHasNotebookProvider = CTX_INLINE_CHAT_HAS_NOTEBOOK_AGENT.bindTo(contextKeyService);
		this._ctxPossible = CTX_INLINE_CHAT_POSSIBLE.bindTo(contextKeyService);

		const agentObs = observableFromEvent(this, chatAgentService.onDidChangeAgents, () => chatAgentService.getDefaultAgent(ChatAgentLocation.EditorInline));
		const notebookAgentObs = observableFromEvent(this, chatAgentService.onDidChangeAgents, () => chatAgentService.getDefaultAgent(ChatAgentLocation.Notebook));
		const notebookAgentConfigObs = observableConfigValue(InlineChatConfigKeys.notebookAgent, false, configService);

		this._store.add(autorun(r => {
			const agent = agentObs.read(r);
			if (!agent) {
				this._ctxHasProvider2.reset();
			} else {
				this._ctxHasProvider2.set(true);
			}
		}));

		this._store.add(autorun(r => {
			this._ctxHasNotebookInline.set(!notebookAgentConfigObs.read(r) && !!agentObs.read(r));
			this._ctxHasNotebookProvider.set(notebookAgentConfigObs.read(r) && !!notebookAgentObs.read(r));
		}));

		const updateEditor = () => {
			const ctrl = editorService.activeEditorPane?.getControl();
			const isCodeEditorLike = isCodeEditor(ctrl) || isDiffEditor(ctrl) || isCompositeEditor(ctrl);
			this._ctxPossible.set(isCodeEditorLike);
		};

		this._store.add(editorService.onDidActiveEditorChange(updateEditor));
		updateEditor();
	}

	dispose() {
		this._ctxPossible.reset();
		this._ctxHasProvider2.reset();
		this._store.dispose();
	}
}


export class InlineChatEscapeToolContribution extends Disposable {

	static readonly Id = 'inlineChat.escapeTool';

	static readonly DONT_ASK_AGAIN_KEY = 'inlineChat.dontAskMoveToPanelChat';

	private static readonly _data: IToolData = {
		id: 'inline_chat_exit',
		source: ToolDataSource.Internal,
		canBeReferencedInPrompt: false,
		alwaysDisplayInputOutput: false,
		displayName: localize('name', "Inline Chat to Panel Chat"),
		modelDescription: 'Moves the inline chat session to the richer panel chat which supports edits across files, creating and deleting files, multi-turn conversations between the user and the assistant, and access to more IDE tools, like retrieve problems, interact with source control, run terminal commands etc.',
	};

	constructor(
		@ILanguageModelToolsService lmTools: ILanguageModelToolsService,
		@IInlineChatSessionService inlineChatSessionService: IInlineChatSessionService,
		@IDialogService dialogService: IDialogService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IChatService chatService: IChatService,
		@ILogService logService: ILogService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService instaService: IInstantiationService,
	) {

		super();

		this._store.add(lmTools.registerTool(InlineChatEscapeToolContribution._data, {
			invoke: async (invocation, _tokenCountFn, _progress, _token) => {

				const sessionResource = invocation.context?.sessionResource;

				if (!sessionResource) {
					logService.warn('InlineChatEscapeToolContribution: no sessionId in tool invocation context');
					return { content: [{ kind: 'text', value: 'Cancel' }] };
				}

				const session = inlineChatSessionService.getSessionBySessionUri(sessionResource);

				if (!session) {
					logService.warn(`InlineChatEscapeToolContribution: no session found for id ${sessionResource}`);
					return { content: [{ kind: 'text', value: 'Cancel' }] };
				}

				const dontAskAgain = storageService.getBoolean(InlineChatEscapeToolContribution.DONT_ASK_AGAIN_KEY, StorageScope.PROFILE);

				let result: { confirmed: boolean; checkboxChecked?: boolean };
				if (dontAskAgain !== undefined) {
					// Use previously stored user preference: true = 'Continue in Chat view', false = 'Rephrase' (Cancel)
					result = { confirmed: dontAskAgain, checkboxChecked: false };
				} else {
					result = await dialogService.confirm({
						type: 'question',
						title: localize('confirm.title', "Do you want to continue in Chat view?"),
						message: localize('confirm', "Do you want to continue in Chat view?"),
						detail: localize('confirm.detail', "Inline chat is designed for making single-file code changes. Continue your request in the Chat view or rephrase it for inline chat."),
						primaryButton: localize('confirm.yes', "Continue in Chat view"),
						cancelButton: localize('confirm.cancel', "Cancel"),
						checkbox: { label: localize('chat.remove.confirmation.checkbox', "Don't ask again"), checked: false },
					});
				}

				const editor = codeEditorService.getFocusedCodeEditor();

				if (!editor || result.confirmed) {
					logService.trace('InlineChatEscapeToolContribution: moving session to panel chat');
					await instaService.invokeFunction(askInPanelChat, session.chatModel.getRequests().at(-1)!, session.chatModel.inputModel.state.get());
					session.dispose();

				} else {
					logService.trace('InlineChatEscapeToolContribution: rephrase prompt');
					const lastRequest = session.chatModel.getRequests().at(-1)!;
					chatService.removeRequest(session.chatModel.sessionResource, lastRequest.id);
					session.chatModel.inputModel.setState({ inputText: lastRequest.message.text });
				}

				if (result.checkboxChecked) {
					storageService.store(InlineChatEscapeToolContribution.DONT_ASK_AGAIN_KEY, result.confirmed, StorageScope.PROFILE, StorageTarget.USER);
					logService.trace('InlineChatEscapeToolContribution: stored don\'t ask again preference');
				}

				return { content: [{ kind: 'text', value: 'Success' }] };
			}
		}));
	}
}

registerAction2(class ResetMoveToPanelChatChoice extends Action2 {
	constructor() {
		super({
			id: 'inlineChat.resetMoveToPanelChatChoice',
			precondition: ContextKeyExpr.has('config.chat.disableAIFeatures').negate(),
			title: localize2('resetChoice.label', "Reset Choice for 'Move Inline Chat to Panel Chat'"),
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IStorageService).remove(InlineChatEscapeToolContribution.DONT_ASK_AGAIN_KEY, StorageScope.PROFILE);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatStrategies.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatStrategies.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WindowIntervalTimer } from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { themeColorFromId, ThemeIcon } from '../../../../base/common/themables.js';
import { ICodeEditor, IViewZone, IViewZoneChangeAccessor } from '../../../../editor/browser/editorBrowser.js';
import { StableEditorScrollState } from '../../../../editor/browser/stableEditorScroll.js';
import { LineSource, RenderOptions, renderLines } from '../../../../editor/browser/widget/diffEditor/components/diffEditorViewZones/renderLines.js';
import { ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { LineRange } from '../../../../editor/common/core/ranges/lineRange.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { IModelDecorationsChangeAccessor, IModelDeltaDecoration, IValidEditOperation, MinimapPosition, OverviewRulerLane, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Progress } from '../../../../platform/progress/common/progress.js';
import { SaveReason } from '../../../common/editor.js';
import { countWords } from '../../chat/common/chatWordCounter.js';
import { HunkInformation, Session, HunkState } from './inlineChatSession.js';
import { InlineChatZoneWidget } from './inlineChatZoneWidget.js';
import { ACTION_TOGGLE_DIFF, CTX_INLINE_CHAT_CHANGE_HAS_DIFF, CTX_INLINE_CHAT_CHANGE_SHOWS_DIFF, MENU_INLINE_CHAT_ZONE, minimapInlineChatDiffInserted, overviewRulerInlineChatDiffInserted } from '../common/inlineChat.js';
import { assertType } from '../../../../base/common/types.js';
import { performAsyncTextEdit, asProgressiveEdit } from './utils.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IUntitledTextEditorModel } from '../../../services/untitled/common/untitledTextEditorModel.js';
import { Schemas } from '../../../../base/common/network.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { DefaultChatTextEditor } from '../../chat/browser/codeBlockPart.js';
import { isEqual } from '../../../../base/common/resources.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { ConflictActionsFactory, IContentWidgetAction } from '../../mergeEditor/browser/view/conflictActions.js';
import { observableValue } from '../../../../base/common/observable.js';
import { IMenuService, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { InlineDecoration, InlineDecorationType } from '../../../../editor/common/viewModel/inlineDecorations.js';
import { EditSources } from '../../../../editor/common/textModelEditSource.js';
import { VersionedExtensionId } from '../../../../editor/common/languages.js';

export interface IEditObserver {
	start(): void;
	stop(): void;
}

export const enum HunkAction {
	Accept,
	Discard,
	MoveNext,
	MovePrev,
	ToggleDiff
}

export class LiveStrategy {

	private readonly _decoInsertedText = ModelDecorationOptions.register({
		description: 'inline-modified-line',
		className: 'inline-chat-inserted-range-linehighlight',
		isWholeLine: true,
		overviewRuler: {
			position: OverviewRulerLane.Full,
			color: themeColorFromId(overviewRulerInlineChatDiffInserted),
		},
		minimap: {
			position: MinimapPosition.Inline,
			color: themeColorFromId(minimapInlineChatDiffInserted),
		}
	});

	private readonly _decoInsertedTextRange = ModelDecorationOptions.register({
		description: 'inline-chat-inserted-range-linehighlight',
		className: 'inline-chat-inserted-range',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	});

	protected readonly _store = new DisposableStore();
	protected readonly _onDidAccept = this._store.add(new Emitter<void>());
	protected readonly _onDidDiscard = this._store.add(new Emitter<void>());
	private readonly _ctxCurrentChangeHasDiff: IContextKey<boolean>;
	private readonly _ctxCurrentChangeShowsDiff: IContextKey<boolean>;
	private readonly _progressiveEditingDecorations: IEditorDecorationsCollection;
	private readonly _lensActionsFactory: ConflictActionsFactory;
	private _editCount: number = 0;
	private readonly _hunkData = new Map<HunkInformation, HunkDisplayData>();

	readonly onDidAccept: Event<void> = this._onDidAccept.event;
	readonly onDidDiscard: Event<void> = this._onDidDiscard.event;

	constructor(
		protected readonly _session: Session,
		protected readonly _editor: ICodeEditor,
		protected readonly _zone: InlineChatZoneWidget,
		private readonly _showOverlayToolbar: boolean,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IEditorWorkerService protected readonly _editorWorkerService: IEditorWorkerService,
		// @IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		// @IConfigurationService private readonly _configService: IConfigurationService,
		@IMenuService private readonly _menuService: IMenuService,
		@IContextKeyService private readonly _contextService: IContextKeyService,
		@ITextFileService private readonly _textFileService: ITextFileService,
		@IInstantiationService protected readonly _instaService: IInstantiationService
	) {
		this._ctxCurrentChangeHasDiff = CTX_INLINE_CHAT_CHANGE_HAS_DIFF.bindTo(contextKeyService);
		this._ctxCurrentChangeShowsDiff = CTX_INLINE_CHAT_CHANGE_SHOWS_DIFF.bindTo(contextKeyService);

		this._progressiveEditingDecorations = this._editor.createDecorationsCollection();
		this._lensActionsFactory = this._store.add(new ConflictActionsFactory(this._editor));
	}

	dispose(): void {
		this._resetDiff();
		this._store.dispose();
	}

	private _resetDiff(): void {
		this._ctxCurrentChangeHasDiff.reset();
		this._ctxCurrentChangeShowsDiff.reset();
		this._zone.widget.updateStatus('');
		this._progressiveEditingDecorations.clear();


		for (const data of this._hunkData.values()) {
			data.remove();
		}
	}

	async apply() {
		this._resetDiff();
		if (this._editCount > 0) {
			this._editor.pushUndoStop();
		}
		await this._doApplyChanges(true);
	}

	cancel() {
		this._resetDiff();
		return this._session.hunkData.discardAll();
	}

	async makeChanges(edits: ISingleEditOperation[], obs: IEditObserver, undoStopBefore: boolean, metadata: IInlineChatMetadata): Promise<void> {
		return this._makeChanges(edits, obs, undefined, undefined, undoStopBefore, metadata);
	}

	async makeProgressiveChanges(edits: ISingleEditOperation[], obs: IEditObserver, opts: ProgressingEditsOptions, undoStopBefore: boolean, metadata: IInlineChatMetadata): Promise<void> {

		// add decorations once per line that got edited
		const progress = new Progress<IValidEditOperation[]>(edits => {

			const newLines = new Set<number>();
			for (const edit of edits) {
				LineRange.fromRange(edit.range).forEach(line => newLines.add(line));
			}
			const existingRanges = this._progressiveEditingDecorations.getRanges().map(LineRange.fromRange);
			for (const existingRange of existingRanges) {
				existingRange.forEach(line => newLines.delete(line));
			}
			const newDecorations: IModelDeltaDecoration[] = [];
			for (const line of newLines) {
				newDecorations.push({ range: new Range(line, 1, line, Number.MAX_VALUE), options: this._decoInsertedText });
			}

			this._progressiveEditingDecorations.append(newDecorations);
		});
		return this._makeChanges(edits, obs, opts, progress, undoStopBefore, metadata);
	}

	private async _makeChanges(edits: ISingleEditOperation[], obs: IEditObserver, opts: ProgressingEditsOptions | undefined, progress: Progress<IValidEditOperation[]> | undefined, undoStopBefore: boolean, metadata: IInlineChatMetadata): Promise<void> {

		// push undo stop before first edit
		if (undoStopBefore) {
			this._editor.pushUndoStop();
		}

		this._editCount++;
		const editSource = EditSources.inlineChatApplyEdit({
			modelId: metadata.modelId,
			extensionId: metadata.extensionId,
			requestId: metadata.requestId,
			sessionId: undefined,
			languageId: this._session.textModelN.getLanguageId(),
		});

		if (opts) {
			// ASYNC
			const durationInSec = opts.duration / 1000;
			for (const edit of edits) {
				const wordCount = countWords(edit.text ?? '');
				const speed = wordCount / durationInSec;
				// console.log({ durationInSec, wordCount, speed: wordCount / durationInSec });
				const asyncEdit = asProgressiveEdit(new WindowIntervalTimer(this._zone.domNode), edit, speed, opts.token);
				await performAsyncTextEdit(this._session.textModelN, asyncEdit, progress, obs, editSource);
			}

		} else {
			// SYNC
			obs.start();
			this._session.textModelN.pushEditOperations(null, edits, (undoEdits) => {
				progress?.report(undoEdits);
				return null;
			}, undefined, editSource);
			obs.stop();
		}
	}

	performHunkAction(hunk: HunkInformation | undefined, action: HunkAction) {
		const displayData = this._findDisplayData(hunk);

		if (!displayData) {
			// no hunks (left or not yet) found, make sure to
			// finish the sessions
			if (action === HunkAction.Accept) {
				this._onDidAccept.fire();
			} else if (action === HunkAction.Discard) {
				this._onDidDiscard.fire();
			}
			return;
		}

		if (action === HunkAction.Accept) {
			displayData.acceptHunk();
		} else if (action === HunkAction.Discard) {
			displayData.discardHunk();
		} else if (action === HunkAction.MoveNext) {
			displayData.move(true);
		} else if (action === HunkAction.MovePrev) {
			displayData.move(false);
		} else if (action === HunkAction.ToggleDiff) {
			displayData.toggleDiff?.();
		}
	}

	private _findDisplayData(hunkInfo?: HunkInformation) {
		let result: HunkDisplayData | undefined;
		if (hunkInfo) {
			// use context hunk (from tool/buttonbar)
			result = this._hunkData.get(hunkInfo);
		}

		if (!result && this._zone.position) {
			// find nearest from zone position
			const zoneLine = this._zone.position.lineNumber;
			let distance: number = Number.MAX_SAFE_INTEGER;
			for (const candidate of this._hunkData.values()) {
				if (candidate.hunk.getState() !== HunkState.Pending) {
					continue;
				}
				const hunkRanges = candidate.hunk.getRangesN();
				if (hunkRanges.length === 0) {
					// bogous hunk
					continue;
				}
				const myDistance = zoneLine <= hunkRanges[0].startLineNumber
					? hunkRanges[0].startLineNumber - zoneLine
					: zoneLine - hunkRanges[0].endLineNumber;

				if (myDistance < distance) {
					distance = myDistance;
					result = candidate;
				}
			}
		}

		if (!result) {
			// fallback: first hunk that is pending
			result = Iterable.first(Iterable.filter(this._hunkData.values(), candidate => candidate.hunk.getState() === HunkState.Pending));
		}
		return result;
	}

	async renderChanges() {

		this._progressiveEditingDecorations.clear();

		const renderHunks = () => {

			let widgetData: HunkDisplayData | undefined;

			changeDecorationsAndViewZones(this._editor, (decorationsAccessor, viewZoneAccessor) => {

				const keysNow = new Set(this._hunkData.keys());
				widgetData = undefined;

				for (const hunkData of this._session.hunkData.getInfo()) {

					keysNow.delete(hunkData);

					const hunkRanges = hunkData.getRangesN();
					let data = this._hunkData.get(hunkData);
					if (!data) {
						// first time -> create decoration
						const decorationIds: string[] = [];
						for (let i = 0; i < hunkRanges.length; i++) {
							decorationIds.push(decorationsAccessor.addDecoration(hunkRanges[i], i === 0
								? this._decoInsertedText
								: this._decoInsertedTextRange)
							);
						}

						const acceptHunk = () => {
							hunkData.acceptChanges();
							renderHunks();
						};

						const discardHunk = () => {
							hunkData.discardChanges();
							renderHunks();
						};

						// original view zone
						const mightContainNonBasicASCII = this._session.textModel0.mightContainNonBasicASCII();
						const mightContainRTL = this._session.textModel0.mightContainRTL();
						const renderOptions = RenderOptions.fromEditor(this._editor);
						const originalRange = hunkData.getRanges0()[0];
						const source = new LineSource(
							LineRange.fromRangeInclusive(originalRange).mapToLineArray(l => this._session.textModel0.tokenization.getLineTokens(l)),
							[],
							mightContainNonBasicASCII,
							mightContainRTL,
						);
						const domNode = document.createElement('div');
						domNode.className = 'inline-chat-original-zone2';
						const result = renderLines(source, renderOptions, [new InlineDecoration(new Range(originalRange.startLineNumber, 1, originalRange.startLineNumber, 1), '', InlineDecorationType.Regular)], domNode);
						const viewZoneData: IViewZone = {
							afterLineNumber: -1,
							heightInLines: result.heightInLines,
							domNode,
							ordinal: 50000 + 2 // more than https://github.com/microsoft/vscode/blob/bf52a5cfb2c75a7327c9adeaefbddc06d529dcad/src/vs/workbench/contrib/inlineChat/browser/inlineChatZoneWidget.ts#L42
						};

						const toggleDiff = () => {
							const scrollState = StableEditorScrollState.capture(this._editor);
							changeDecorationsAndViewZones(this._editor, (_decorationsAccessor, viewZoneAccessor) => {
								assertType(data);
								if (!data.diffViewZoneId) {
									const [hunkRange] = hunkData.getRangesN();
									viewZoneData.afterLineNumber = hunkRange.startLineNumber - 1;
									data.diffViewZoneId = viewZoneAccessor.addZone(viewZoneData);
								} else {
									viewZoneAccessor.removeZone(data.diffViewZoneId!);
									data.diffViewZoneId = undefined;
								}
							});
							this._ctxCurrentChangeShowsDiff.set(typeof data?.diffViewZoneId === 'string');
							scrollState.restore(this._editor);
						};


						let lensActions: DisposableStore | undefined;
						const lensActionsViewZoneIds: string[] = [];

						if (this._showOverlayToolbar && hunkData.getState() === HunkState.Pending) {

							lensActions = new DisposableStore();

							const menu = this._menuService.createMenu(MENU_INLINE_CHAT_ZONE, this._contextService);
							const makeActions = () => {
								const actions: IContentWidgetAction[] = [];
								const tuples = menu.getActions({ arg: hunkData });
								for (const [, group] of tuples) {
									for (const item of group) {
										if (item instanceof MenuItemAction) {

											let text = item.label;

											if (item.id === ACTION_TOGGLE_DIFF) {
												text = item.checked ? 'Hide Changes' : 'Show Changes';
											} else if (ThemeIcon.isThemeIcon(item.item.icon)) {
												text = `$(${item.item.icon.id}) ${text}`;
											}

											actions.push({
												text,
												tooltip: item.tooltip,
												action: async () => item.run(),
											});
										}
									}
								}
								return actions;
							};

							const obs = observableValue(this, makeActions());
							lensActions.add(menu.onDidChange(() => obs.set(makeActions(), undefined)));
							lensActions.add(menu);

							lensActions.add(this._lensActionsFactory.createWidget(viewZoneAccessor,
								hunkRanges[0].startLineNumber - 1,
								obs,
								lensActionsViewZoneIds
							));
						}

						const remove = () => {
							changeDecorationsAndViewZones(this._editor, (decorationsAccessor, viewZoneAccessor) => {
								assertType(data);
								for (const decorationId of data.decorationIds) {
									decorationsAccessor.removeDecoration(decorationId);
								}
								if (data.diffViewZoneId) {
									viewZoneAccessor.removeZone(data.diffViewZoneId!);
								}
								data.decorationIds = [];
								data.diffViewZoneId = undefined;

								data.lensActionsViewZoneIds?.forEach(viewZoneAccessor.removeZone);
								data.lensActionsViewZoneIds = undefined;
							});

							lensActions?.dispose();
						};

						const move = (next: boolean) => {
							const keys = Array.from(this._hunkData.keys());
							const idx = keys.indexOf(hunkData);
							const nextIdx = (idx + (next ? 1 : -1) + keys.length) % keys.length;
							if (nextIdx !== idx) {
								const nextData = this._hunkData.get(keys[nextIdx])!;
								this._zone.updatePositionAndHeight(nextData?.position);
								renderHunks();
							}
						};

						const zoneLineNumber = this._zone.position?.lineNumber ?? this._editor.getPosition()!.lineNumber;
						const myDistance = zoneLineNumber <= hunkRanges[0].startLineNumber
							? hunkRanges[0].startLineNumber - zoneLineNumber
							: zoneLineNumber - hunkRanges[0].endLineNumber;

						data = {
							hunk: hunkData,
							decorationIds,
							diffViewZoneId: '',
							diffViewZone: viewZoneData,
							lensActionsViewZoneIds,
							distance: myDistance,
							position: hunkRanges[0].getStartPosition().delta(-1),
							acceptHunk,
							discardHunk,
							toggleDiff: !hunkData.isInsertion() ? toggleDiff : undefined,
							remove,
							move,
						};

						this._hunkData.set(hunkData, data);

					} else if (hunkData.getState() !== HunkState.Pending) {
						data.remove();

					} else {
						// update distance and position based on modifiedRange-decoration
						const zoneLineNumber = this._zone.position?.lineNumber ?? this._editor.getPosition()!.lineNumber;
						const modifiedRangeNow = hunkRanges[0];
						data.position = modifiedRangeNow.getStartPosition().delta(-1);
						data.distance = zoneLineNumber <= modifiedRangeNow.startLineNumber
							? modifiedRangeNow.startLineNumber - zoneLineNumber
							: zoneLineNumber - modifiedRangeNow.endLineNumber;
					}

					if (hunkData.getState() === HunkState.Pending && (!widgetData || data.distance < widgetData.distance)) {
						widgetData = data;
					}
				}

				for (const key of keysNow) {
					const data = this._hunkData.get(key);
					if (data) {
						this._hunkData.delete(key);
						data.remove();
					}
				}
			});

			if (widgetData) {
				this._zone.reveal(widgetData.position);

				// const mode = this._configService.getValue<'on' | 'off' | 'auto'>(InlineChatConfigKeys.AccessibleDiffView);
				// if (mode === 'on' || mode === 'auto' && this._accessibilityService.isScreenReaderOptimized()) {
				// 	this._zone.widget.showAccessibleHunk(this._session, widgetData.hunk);
				// }

				this._ctxCurrentChangeHasDiff.set(Boolean(widgetData.toggleDiff));

			} else if (this._hunkData.size > 0) {
				// everything accepted or rejected
				let oneAccepted = false;
				for (const hunkData of this._session.hunkData.getInfo()) {
					if (hunkData.getState() === HunkState.Accepted) {
						oneAccepted = true;
						break;
					}
				}
				if (oneAccepted) {
					this._onDidAccept.fire();
				} else {
					this._onDidDiscard.fire();
				}
			}

			return widgetData;
		};

		return renderHunks()?.position;
	}

	getWholeRangeDecoration(): IModelDeltaDecoration[] {
		// don't render the blue in live mode
		return [];
	}

	private async _doApplyChanges(ignoreLocal: boolean): Promise<void> {

		const untitledModels: IUntitledTextEditorModel[] = [];

		const editor = this._instaService.createInstance(DefaultChatTextEditor);


		for (const request of this._session.chatModel.getRequests()) {

			if (!request.response?.response) {
				continue;
			}

			for (const item of request.response.response.value) {
				if (item.kind !== 'textEditGroup') {
					continue;
				}
				if (ignoreLocal && isEqual(item.uri, this._session.textModelN.uri)) {
					continue;
				}

				await editor.apply(request.response, item, undefined);

				if (item.uri.scheme === Schemas.untitled) {
					const untitled = this._textFileService.untitled.get(item.uri);
					if (untitled) {
						untitledModels.push(untitled);
					}
				}
			}
		}

		for (const untitledModel of untitledModels) {
			if (!untitledModel.isDisposed()) {
				await untitledModel.resolve();
				await untitledModel.save({ reason: SaveReason.EXPLICIT });
			}
		}
	}
}

export interface ProgressingEditsOptions {
	duration: number;
	token: CancellationToken;
}

type HunkDisplayData = {

	decorationIds: string[];

	diffViewZoneId: string | undefined;
	diffViewZone: IViewZone;

	lensActionsViewZoneIds?: string[];

	distance: number;
	position: Position;
	acceptHunk: () => void;
	discardHunk: () => void;
	toggleDiff?: () => any;
	remove(): void;
	move: (next: boolean) => void;

	hunk: HunkInformation;
};

function changeDecorationsAndViewZones(editor: ICodeEditor, callback: (accessor: IModelDecorationsChangeAccessor, viewZoneAccessor: IViewZoneChangeAccessor) => void): void {
	editor.changeDecorations(decorationsAccessor => {
		editor.changeViewZones(viewZoneAccessor => {
			callback(decorationsAccessor, viewZoneAccessor);
		});
	});
}

export interface IInlineChatMetadata {
	modelId: string | undefined;
	extensionId: VersionedExtensionId | undefined;
	requestId: string | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, Dimension, getActiveElement, getTotalHeight, getWindow, h, reset, trackFocus } from '../../../../base/browser/dom.js';
import { IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { renderLabelWithIcons } from '../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IAction } from '../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, constObservable, derived, IObservable, ISettableObservable, observableValue } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { AccessibleDiffViewer, IAccessibleDiffViewerModel } from '../../../../editor/browser/widget/diffEditor/components/accessibleDiffViewer.js';
import { EditorOption, IComputedEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { LineRange } from '../../../../editor/common/core/ranges/lineRange.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { DetailedLineRangeMapping, RangeMapping } from '../../../../editor/common/diff/rangeMapping.js';
import { ICodeEditorViewState, ScrollType } from '../../../../editor/common/editorCommon.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../nls.js';
import { IAccessibleViewService } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IWorkbenchButtonBarOptions, MenuWorkbenchButtonBar } from '../../../../platform/actions/browser/buttonbar.js';
import { createActionViewItem, IMenuEntryActionViewItemOptions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import product from '../../../../platform/product/common/product.js';
import { asCssVariable, asCssVariableName, editorBackground, inputBackground } from '../../../../platform/theme/common/colorRegistry.js';
import { EDITOR_DRAG_AND_DROP_BACKGROUND } from '../../../common/theme.js';
import { IChatEntitlementService } from '../../../services/chat/common/chatEntitlementService.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { MarkUnhelpfulActionId } from '../../chat/browser/actions/chatTitleActions.js';
import { IChatWidgetViewOptions } from '../../chat/browser/chat.js';
import { ChatVoteDownButton } from '../../chat/browser/chatListRenderer.js';
import { ChatWidget, IChatWidgetLocationOptions } from '../../chat/browser/chatWidget.js';
import { chatRequestBackground } from '../../chat/common/chatColors.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';
import { IChatModel } from '../../chat/common/chatModel.js';
import { ChatMode } from '../../chat/common/chatModes.js';
import { ChatAgentVoteDirection, IChatService } from '../../chat/common/chatService.js';
import { isResponseVM } from '../../chat/common/chatViewModel.js';
import { CTX_INLINE_CHAT_FOCUSED, CTX_INLINE_CHAT_RESPONSE_FOCUSED, inlineChatBackground, inlineChatForeground } from '../common/inlineChat.js';
import { HunkInformation, Session } from './inlineChatSession.js';
import './media/inlineChat.css';

export interface InlineChatWidgetViewState {
	editorViewState: ICodeEditorViewState;
	input: string;
	placeholder: string;
}

export interface IInlineChatWidgetConstructionOptions {

	/**
	 * The menu that rendered as button bar, use for accept, discard etc
	 */
	statusMenuId: MenuId | { menu: MenuId; options: IWorkbenchButtonBarOptions };

	secondaryMenuId?: MenuId;

	/**
	 * The options for the chat widget
	 */
	chatWidgetViewOptions?: IChatWidgetViewOptions;

	inZoneWidget?: boolean;
}

export class InlineChatWidget {

	protected readonly _elements = h(
		'div.inline-chat@root',
		[
			h('div.chat-widget@chatWidget'),
			h('div.accessibleViewer@accessibleViewer'),
			h('div.status@status', [
				h('div.label.info.hidden@infoLabel'),
				h('div.actions.hidden@toolbar1'),
				h('div.label.status.hidden@statusLabel'),
				h('div.actions.secondary.hidden@toolbar2'),
				h('div.label.disclaimer.hidden@disclaimerLabel'),
			]),
		]
	);

	protected readonly _store = new DisposableStore();

	private readonly _ctxInputEditorFocused: IContextKey<boolean>;
	private readonly _ctxResponseFocused: IContextKey<boolean>;

	private readonly _chatWidget: ChatWidget;

	protected readonly _onDidChangeHeight = this._store.add(new Emitter<void>());
	readonly onDidChangeHeight: Event<void> = Event.filter(this._onDidChangeHeight.event, _ => !this._isLayouting);

	private readonly _requestInProgress = observableValue(this, false);
	readonly requestInProgress: IObservable<boolean> = this._requestInProgress;

	private _isLayouting: boolean = false;

	readonly scopedContextKeyService: IContextKeyService;

	constructor(
		location: IChatWidgetLocationOptions,
		private readonly _options: IInlineChatWidgetConstructionOptions,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IAccessibleViewService private readonly _accessibleViewService: IAccessibleViewService,
		@ITextModelService protected readonly _textModelResolverService: ITextModelService,
		@IChatService private readonly _chatService: IChatService,
		@IHoverService private readonly _hoverService: IHoverService,
		@IChatEntitlementService private readonly _chatEntitlementService: IChatEntitlementService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		this.scopedContextKeyService = this._store.add(_contextKeyService.createScoped(this._elements.chatWidget));
		const scopedInstaService = _instantiationService.createChild(
			new ServiceCollection([
				IContextKeyService,
				this.scopedContextKeyService
			]),
			this._store
		);

		this._chatWidget = scopedInstaService.createInstance(
			ChatWidget,
			location,
			{ isInlineChat: true },
			{
				autoScroll: true,
				defaultElementHeight: 32,
				renderStyle: 'minimal',
				renderInputOnTop: false,
				renderFollowups: true,
				supportsFileReferences: true,
				filter: item => {
					if (!isResponseVM(item) || item.errorDetails) {
						// show all requests and errors
						return true;
					}
					const emptyResponse = item.response.value.length === 0;
					if (emptyResponse) {
						return false;
					}
					if (item.response.value.every(item => item.kind === 'textEditGroup' && _options.chatWidgetViewOptions?.rendererOptions?.renderTextEditsAsSummary?.(item.uri))) {
						return false;
					}
					return true;
				},
				dndContainer: this._elements.root,
				defaultMode: ChatMode.Ask,
				..._options.chatWidgetViewOptions
			},
			{
				listForeground: inlineChatForeground,
				listBackground: inlineChatBackground,
				overlayBackground: EDITOR_DRAG_AND_DROP_BACKGROUND,
				inputEditorBackground: inputBackground,
				resultEditorBackground: editorBackground
			}
		);
		this._elements.root.classList.toggle('in-zone-widget', !!_options.inZoneWidget);
		this._chatWidget.render(this._elements.chatWidget);
		this._elements.chatWidget.style.setProperty(asCssVariableName(chatRequestBackground), asCssVariable(inlineChatBackground));
		this._chatWidget.setVisible(true);
		this._store.add(this._chatWidget);

		const ctxResponse = ChatContextKeys.isResponse.bindTo(this.scopedContextKeyService);
		const ctxResponseVote = ChatContextKeys.responseVote.bindTo(this.scopedContextKeyService);
		const ctxResponseSupportIssues = ChatContextKeys.responseSupportsIssueReporting.bindTo(this.scopedContextKeyService);
		const ctxResponseError = ChatContextKeys.responseHasError.bindTo(this.scopedContextKeyService);
		const ctxResponseErrorFiltered = ChatContextKeys.responseIsFiltered.bindTo(this.scopedContextKeyService);

		const viewModelStore = this._store.add(new DisposableStore());
		this._store.add(this._chatWidget.onDidChangeViewModel(() => {
			viewModelStore.clear();

			const viewModel = this._chatWidget.viewModel;
			if (!viewModel) {
				return;
			}

			viewModelStore.add(toDisposable(() => {
				toolbar2.context = undefined;
				ctxResponse.reset();
				ctxResponseVote.reset();
				ctxResponseError.reset();
				ctxResponseErrorFiltered.reset();
				ctxResponseSupportIssues.reset();
			}));

			viewModelStore.add(viewModel.onDidChange(() => {

				this._requestInProgress.set(viewModel.model.requestInProgress.get(), undefined);

				const last = viewModel.getItems().at(-1);
				toolbar2.context = last;

				ctxResponse.set(isResponseVM(last));
				ctxResponseVote.set(isResponseVM(last) ? last.vote === ChatAgentVoteDirection.Down ? 'down' : last.vote === ChatAgentVoteDirection.Up ? 'up' : '' : '');
				ctxResponseError.set(isResponseVM(last) && last.errorDetails !== undefined);
				ctxResponseErrorFiltered.set((!!(isResponseVM(last) && last.errorDetails?.responseIsFiltered)));
				ctxResponseSupportIssues.set(isResponseVM(last) && (last.agent?.metadata.supportIssueReporting ?? false));

				this._onDidChangeHeight.fire();
			}));
			this._onDidChangeHeight.fire();
		}));

		this._store.add(this.chatWidget.onDidChangeContentHeight(() => {
			this._onDidChangeHeight.fire();
		}));

		// context keys
		this._ctxResponseFocused = CTX_INLINE_CHAT_RESPONSE_FOCUSED.bindTo(this._contextKeyService);
		const tracker = this._store.add(trackFocus(this.domNode));
		this._store.add(tracker.onDidBlur(() => this._ctxResponseFocused.set(false)));
		this._store.add(tracker.onDidFocus(() => this._ctxResponseFocused.set(true)));

		this._ctxInputEditorFocused = CTX_INLINE_CHAT_FOCUSED.bindTo(_contextKeyService);
		this._store.add(this._chatWidget.inputEditor.onDidFocusEditorWidget(() => this._ctxInputEditorFocused.set(true)));
		this._store.add(this._chatWidget.inputEditor.onDidBlurEditorWidget(() => this._ctxInputEditorFocused.set(false)));

		const statusMenuId = _options.statusMenuId instanceof MenuId ? _options.statusMenuId : _options.statusMenuId.menu;

		// BUTTON bar
		const statusMenuOptions = _options.statusMenuId instanceof MenuId ? undefined : _options.statusMenuId.options;
		const statusButtonBar = scopedInstaService.createInstance(MenuWorkbenchButtonBar, this._elements.toolbar1, statusMenuId, {
			toolbarOptions: { primaryGroup: '0_main' },
			telemetrySource: _options.chatWidgetViewOptions?.menus?.telemetrySource,
			menuOptions: { renderShortTitle: true },
			...statusMenuOptions,
		});
		this._store.add(statusButtonBar.onDidChange(() => this._onDidChangeHeight.fire()));
		this._store.add(statusButtonBar);

		// secondary toolbar
		const toolbar2 = scopedInstaService.createInstance(MenuWorkbenchToolBar, this._elements.toolbar2, _options.secondaryMenuId ?? MenuId.for(''), {
			telemetrySource: _options.chatWidgetViewOptions?.menus?.telemetrySource,
			menuOptions: { renderShortTitle: true, shouldForwardArgs: true },
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => {
				if (action instanceof MenuItemAction && action.item.id === MarkUnhelpfulActionId) {
					return scopedInstaService.createInstance(ChatVoteDownButton, action, options as IMenuEntryActionViewItemOptions);
				}
				return createActionViewItem(scopedInstaService, action, options);
			}
		});
		this._store.add(toolbar2.onDidChangeMenuItems(() => this._onDidChangeHeight.fire()));
		this._store.add(toolbar2);


		this._store.add(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(AccessibilityVerbositySettingId.InlineChat)) {
				this._updateAriaLabel();
			}
		}));

		this._elements.root.tabIndex = 0;
		this._elements.statusLabel.tabIndex = 0;
		this._updateAriaLabel();
		this._setupDisclaimer();

		this._store.add(this._hoverService.setupManagedHover(getDefaultHoverDelegate('element'), this._elements.statusLabel, () => {
			return this._elements.statusLabel.dataset['title'];
		}));

		this._store.add(this._chatService.onDidPerformUserAction(e => {
			if (isEqual(e.sessionResource, this._chatWidget.viewModel?.model.sessionResource) && e.action.kind === 'vote') {
				this.updateStatus(localize('feedbackThanks', "Thank you for your feedback!"), { resetAfter: 1250 });
			}
		}));
	}

	private _updateAriaLabel(): void {

		this._elements.root.ariaLabel = this._accessibleViewService.getOpenAriaHint(AccessibilityVerbositySettingId.InlineChat);

		if (this._accessibilityService.isScreenReaderOptimized()) {
			let label = defaultAriaLabel;
			if (this._configurationService.getValue<boolean>(AccessibilityVerbositySettingId.InlineChat)) {
				const kbLabel = this._keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp)?.getLabel();
				label = kbLabel
					? localize('inlineChat.accessibilityHelp', "Inline Chat Input, Use {0} for Inline Chat Accessibility Help.", kbLabel)
					: localize('inlineChat.accessibilityHelpNoKb', "Inline Chat Input, Run the Inline Chat Accessibility Help command for more information.");
			}
			this._chatWidget.inputEditor.updateOptions({ ariaLabel: label });
		}
	}

	private _setupDisclaimer(): void {
		const disposables = this._store.add(new DisposableStore());

		this._store.add(autorun(reader => {
			disposables.clear();
			reset(this._elements.disclaimerLabel);

			const sentiment = this._chatEntitlementService.sentimentObs.read(reader);
			const anonymous = this._chatEntitlementService.anonymousObs.read(reader);
			const requestInProgress = this._chatService.requestInProgressObs.read(reader);

			const showDisclaimer = !sentiment.installed && anonymous && !requestInProgress;
			this._elements.disclaimerLabel.classList.toggle('hidden', !showDisclaimer);

			if (showDisclaimer) {
				const renderedMarkdown = disposables.add(this._markdownRendererService.render(new MarkdownString(localize({ key: 'termsDisclaimer', comment: ['{Locked="]({2})"}', '{Locked="]({3})"}'] }, "By continuing with {0} Copilot, you agree to {1}'s [Terms]({2}) and [Privacy Statement]({3})", product.defaultChatAgent?.provider?.default?.name ?? '', product.defaultChatAgent?.provider?.default?.name ?? '', product.defaultChatAgent?.termsStatementUrl ?? '', product.defaultChatAgent?.privacyStatementUrl ?? ''), { isTrusted: true })));
				this._elements.disclaimerLabel.appendChild(renderedMarkdown.element);
			}

			this._onDidChangeHeight.fire();
		}));
	}

	dispose(): void {
		this._store.dispose();
	}

	get domNode(): HTMLElement {
		return this._elements.root;
	}

	get chatWidget(): ChatWidget {
		return this._chatWidget;
	}

	saveState() {
		this._chatWidget.saveState();
	}

	layout(widgetDim: Dimension) {
		const contentHeight = this.contentHeight;
		this._isLayouting = true;
		try {
			this._doLayout(widgetDim);
		} finally {
			this._isLayouting = false;

			if (this.contentHeight !== contentHeight) {
				this._onDidChangeHeight.fire();
			}
		}
	}

	protected _doLayout(dimension: Dimension): void {
		const extraHeight = this._getExtraHeight();
		const statusHeight = getTotalHeight(this._elements.status);

		// console.log('ZONE#Widget#layout', { height: dimension.height, extraHeight, progressHeight, followUpsHeight, statusHeight, LIST: dimension.height - progressHeight - followUpsHeight - statusHeight - extraHeight });

		this._elements.root.style.height = `${dimension.height - extraHeight}px`;
		this._elements.root.style.width = `${dimension.width}px`;

		this._chatWidget.layout(
			dimension.height - statusHeight - extraHeight,
			dimension.width
		);
	}

	/**
	 * The content height of this widget is the size that would require no scrolling
	 */
	get contentHeight(): number {
		const data = {
			chatWidgetContentHeight: this._chatWidget.contentHeight,
			statusHeight: getTotalHeight(this._elements.status),
			extraHeight: this._getExtraHeight()
		};
		const result = data.chatWidgetContentHeight + data.statusHeight + data.extraHeight;
		return result;
	}

	get minHeight(): number {
		// The chat widget is variable height and supports scrolling. It should be
		// at least "maxWidgetHeight" high and at most the content height.

		let maxWidgetOutputHeight = 100;
		for (const item of this._chatWidget.viewModel?.getItems() ?? []) {
			if (isResponseVM(item) && item.response.value.some(r => r.kind === 'textEditGroup' && !r.state?.applied)) {
				maxWidgetOutputHeight = 270;
				break;
			}
		}

		let value = this.contentHeight;
		value -= this._chatWidget.contentHeight;
		value += Math.min(this._chatWidget.input.contentHeight + maxWidgetOutputHeight, this._chatWidget.contentHeight);
		return value;
	}

	protected _getExtraHeight(): number {
		return this._options.inZoneWidget ? 1 : (2 /*border*/ + 4 /*shadow*/);
	}

	get value(): string {
		return this._chatWidget.getInput();
	}

	set value(value: string) {
		this._chatWidget.setInput(value);
	}

	selectAll() {
		this._chatWidget.inputEditor.setSelection(new Selection(1, 1, Number.MAX_SAFE_INTEGER, 1));
	}

	set placeholder(value: string) {
		this._chatWidget.setInputPlaceholder(value);
	}

	toggleStatus(show: boolean) {
		this._elements.toolbar1.classList.toggle('hidden', !show);
		this._elements.toolbar2.classList.toggle('hidden', !show);
		this._elements.status.classList.toggle('hidden', !show);
		this._elements.infoLabel.classList.toggle('hidden', !show);
		this._onDidChangeHeight.fire();
	}

	updateToolbar(show: boolean) {
		this._elements.root.classList.toggle('toolbar', show);
		this._elements.toolbar1.classList.toggle('hidden', !show);
		this._elements.toolbar2.classList.toggle('hidden', !show);
		this._elements.status.classList.toggle('actions', show);
		this._elements.infoLabel.classList.toggle('hidden', show);
		this._onDidChangeHeight.fire();
	}

	async getCodeBlockInfo(codeBlockIndex: number): Promise<ITextModel | undefined> {
		const { viewModel } = this._chatWidget;
		if (!viewModel) {
			return undefined;
		}
		const items = viewModel.getItems().filter(i => isResponseVM(i));
		const item = items.at(-1);
		if (!item) {
			return;
		}
		return viewModel.codeBlockModelCollection.get(viewModel.sessionResource, item, codeBlockIndex)?.model;
	}

	get responseContent(): string | undefined {
		const requests = this._chatWidget.viewModel?.model.getRequests();
		return requests?.at(-1)?.response?.response.toString();
	}


	getChatModel(): IChatModel | undefined {
		return this._chatWidget.viewModel?.model;
	}

	setChatModel(chatModel: IChatModel) {
		chatModel.inputModel.setState({ inputText: '', selections: [] });
		this._chatWidget.setModel(chatModel);
	}

	updateInfo(message: string): void {
		this._elements.infoLabel.classList.toggle('hidden', !message);
		const renderedMessage = renderLabelWithIcons(message);
		reset(this._elements.infoLabel, ...renderedMessage);
		this._onDidChangeHeight.fire();
	}

	updateStatus(message: string, ops: { classes?: string[]; resetAfter?: number; keepMessage?: boolean; title?: string } = {}) {
		const isTempMessage = typeof ops.resetAfter === 'number';
		if (isTempMessage && !this._elements.statusLabel.dataset['state']) {
			const statusLabel = this._elements.statusLabel.innerText;
			const title = this._elements.statusLabel.dataset['title'];
			const classes = Array.from(this._elements.statusLabel.classList.values());
			setTimeout(() => {
				this.updateStatus(statusLabel, { classes, keepMessage: true, title });
			}, ops.resetAfter);
		}
		const renderedMessage = renderLabelWithIcons(message);
		reset(this._elements.statusLabel, ...renderedMessage);
		this._elements.statusLabel.className = `label status ${(ops.classes ?? []).join(' ')}`;
		this._elements.statusLabel.classList.toggle('hidden', !message);
		if (isTempMessage) {
			this._elements.statusLabel.dataset['state'] = 'temp';
		} else {
			delete this._elements.statusLabel.dataset['state'];
		}

		if (ops.title) {
			this._elements.statusLabel.dataset['title'] = ops.title;
		} else {
			delete this._elements.statusLabel.dataset['title'];
		}
		this._onDidChangeHeight.fire();
	}

	reset() {
		this._chatWidget.attachmentModel.clear(true);
		this._chatWidget.saveState();

		reset(this._elements.statusLabel);
		this._elements.statusLabel.classList.toggle('hidden', true);
		this._elements.toolbar1.classList.add('hidden');
		this._elements.toolbar2.classList.add('hidden');
		this.updateInfo('');

		this._elements.accessibleViewer.classList.toggle('hidden', true);
		this._onDidChangeHeight.fire();
	}

	focus() {
		this._chatWidget.focusInput();
	}

	hasFocus() {
		return this.domNode.contains(getActiveElement());
	}

}

const defaultAriaLabel = localize('aria-label', "Inline Chat Input");

export class EditorBasedInlineChatWidget extends InlineChatWidget {

	private readonly _accessibleViewer = this._store.add(new MutableDisposable<HunkAccessibleDiffViewer>());


	constructor(
		location: IChatWidgetLocationOptions,
		private readonly _parentEditor: ICodeEditor,
		options: IInlineChatWidgetConstructionOptions,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@IConfigurationService configurationService: IConfigurationService,
		@IAccessibleViewService accessibleViewService: IAccessibleViewService,
		@ITextModelService textModelResolverService: ITextModelService,
		@IChatService chatService: IChatService,
		@IHoverService hoverService: IHoverService,
		@ILayoutService layoutService: ILayoutService,
		@IChatEntitlementService chatEntitlementService: IChatEntitlementService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		const overflowWidgetsNode = layoutService.getContainer(getWindow(_parentEditor.getContainerDomNode())).appendChild($('.inline-chat-overflow.monaco-editor'));
		super(location, {
			...options,
			chatWidgetViewOptions: {
				...options.chatWidgetViewOptions,
				editorOverflowWidgetsDomNode: overflowWidgetsNode
			}
		}, instantiationService, contextKeyService, keybindingService, accessibilityService, configurationService, accessibleViewService, textModelResolverService, chatService, hoverService, chatEntitlementService, markdownRendererService);

		this._store.add(toDisposable(() => {
			overflowWidgetsNode.remove();
		}));
	}

	// --- layout

	override get contentHeight(): number {
		let result = super.contentHeight;

		if (this._accessibleViewer.value) {
			result += this._accessibleViewer.value.height + 8 /* padding */;
		}

		return result;
	}

	protected override _doLayout(dimension: Dimension): void {

		let newHeight = dimension.height;

		if (this._accessibleViewer.value) {
			this._accessibleViewer.value.width = dimension.width - 12;
			newHeight -= this._accessibleViewer.value.height + 8;
		}

		super._doLayout(dimension.with(undefined, newHeight));

		// update/fix the height of the zone which was set to newHeight in super._doLayout
		this._elements.root.style.height = `${dimension.height - this._getExtraHeight()}px`;
	}

	override reset() {
		this._accessibleViewer.clear();
		this.chatWidget.setInput();
		super.reset();
	}

	// --- accessible viewer

	showAccessibleHunk(session: Session, hunkData: HunkInformation): void {

		this._elements.accessibleViewer.classList.remove('hidden');
		this._accessibleViewer.clear();

		this._accessibleViewer.value = this._instantiationService.createInstance(HunkAccessibleDiffViewer,
			this._elements.accessibleViewer,
			session,
			hunkData,
			new AccessibleHunk(this._parentEditor, session, hunkData)
		);

		this._onDidChangeHeight.fire();
	}
}

class HunkAccessibleDiffViewer extends AccessibleDiffViewer {

	readonly height: number;

	set width(value: number) {
		this._width2.set(value, undefined);
	}

	private readonly _width2: ISettableObservable<number>;

	constructor(
		parentNode: HTMLElement,
		session: Session,
		hunk: HunkInformation,
		models: IAccessibleDiffViewerModel,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const width = observableValue('width', 0);
		const diff = observableValue('diff', HunkAccessibleDiffViewer._asMapping(hunk));
		const diffs = derived(r => [diff.read(r)]);
		const lines = Math.min(10, 8 + diff.get().changedLineCount);
		const height = models.getModifiedOptions().get(EditorOption.lineHeight) * lines;

		super(parentNode, constObservable(true), () => { }, constObservable(false), width, constObservable(height), diffs, models, instantiationService);

		this.height = height;
		this._width2 = width;

		this._store.add(session.textModelN.onDidChangeContent(() => {
			diff.set(HunkAccessibleDiffViewer._asMapping(hunk), undefined);
		}));
	}

	private static _asMapping(hunk: HunkInformation): DetailedLineRangeMapping {
		const ranges0 = hunk.getRanges0();
		const rangesN = hunk.getRangesN();
		const originalLineRange = LineRange.fromRangeInclusive(ranges0[0]);
		const modifiedLineRange = LineRange.fromRangeInclusive(rangesN[0]);
		const innerChanges: RangeMapping[] = [];
		for (let i = 1; i < ranges0.length; i++) {
			innerChanges.push(new RangeMapping(ranges0[i], rangesN[i]));
		}
		return new DetailedLineRangeMapping(originalLineRange, modifiedLineRange, innerChanges);
	}

}

class AccessibleHunk implements IAccessibleDiffViewerModel {

	constructor(
		private readonly _editor: ICodeEditor,
		private readonly _session: Session,
		private readonly _hunk: HunkInformation
	) { }

	getOriginalModel(): ITextModel {
		return this._session.textModel0;
	}
	getModifiedModel(): ITextModel {
		return this._session.textModelN;
	}
	getOriginalOptions(): IComputedEditorOptions {
		return this._editor.getOptions();
	}
	getModifiedOptions(): IComputedEditorOptions {
		return this._editor.getOptions();
	}
	originalReveal(range: Range): void {
		// throw new Error('Method not implemented.');
	}
	modifiedReveal(range?: Range | undefined): void {
		this._editor.revealRangeInCenterIfOutsideViewport(range || this._hunk.getRangesN()[0], ScrollType.Smooth);
	}
	modifiedSetSelection(range: Range): void {
		// this._editor.revealRangeInCenterIfOutsideViewport(range, ScrollType.Smooth);
		// this._editor.setSelection(range);
	}
	modifiedFocus(): void {
		this._editor.focus();
	}
	getModifiedPosition(): Position | undefined {
		return this._hunk.getRangesN()[0].getStartPosition();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/inlineChatZoneWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/inlineChatZoneWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { addDisposableListener, Dimension } from '../../../../base/browser/dom.js';
import * as aria from '../../../../base/browser/ui/aria/aria.js';
import { MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { autorun } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { assertType } from '../../../../base/common/types.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { StableEditorBottomScrollState } from '../../../../editor/browser/stableEditorScroll.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ScrollType } from '../../../../editor/common/editorCommon.js';
import { IOptions, ZoneWidget } from '../../../../editor/contrib/zoneWidget/browser/zoneWidget.js';
import { localize } from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IChatWidgetViewOptions } from '../../chat/browser/chat.js';
import { IChatWidgetLocationOptions } from '../../chat/browser/chatWidget.js';
import { ChatMode } from '../../chat/common/chatModes.js';
import { isResponseVM } from '../../chat/common/chatViewModel.js';
import { INotebookEditor } from '../../notebook/browser/notebookBrowser.js';
import { ACTION_REGENERATE_RESPONSE, ACTION_REPORT_ISSUE, ACTION_TOGGLE_DIFF, CTX_INLINE_CHAT_OUTER_CURSOR_POSITION, MENU_INLINE_CHAT_SIDE, MENU_INLINE_CHAT_WIDGET_SECONDARY, MENU_INLINE_CHAT_WIDGET_STATUS } from '../common/inlineChat.js';
import { EditorBasedInlineChatWidget } from './inlineChatWidget.js';

export class InlineChatZoneWidget extends ZoneWidget {

	private static readonly _options: IOptions = {
		showFrame: true,
		frameWidth: 1,
		// frameColor: 'var(--vscode-inlineChat-border)',
		isResizeable: true,
		showArrow: false,
		isAccessible: true,
		className: 'inline-chat-widget',
		keepEditorSelection: true,
		showInHiddenAreas: true,
		ordinal: 50000,
	};

	readonly widget: EditorBasedInlineChatWidget;

	private readonly _scrollUp = this._disposables.add(new ScrollUpState(this.editor));
	private readonly _ctxCursorPosition: IContextKey<'above' | 'below' | ''>;
	private _dimension?: Dimension;
	private notebookEditor?: INotebookEditor;

	constructor(
		location: IChatWidgetLocationOptions,
		options: IChatWidgetViewOptions | undefined,
		editors: { editor: ICodeEditor; notebookEditor?: INotebookEditor },
		/** @deprecated should go away with inline2 */
		clearDelegate: () => Promise<void>,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ILogService private _logService: ILogService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(editors.editor, InlineChatZoneWidget._options);
		this.notebookEditor = editors.notebookEditor;

		this._ctxCursorPosition = CTX_INLINE_CHAT_OUTER_CURSOR_POSITION.bindTo(contextKeyService);

		this._disposables.add(toDisposable(() => {
			this._ctxCursorPosition.reset();
		}));

		this.widget = this._instaService.createInstance(EditorBasedInlineChatWidget, location, this.editor, {
			statusMenuId: {
				menu: MENU_INLINE_CHAT_WIDGET_STATUS,
				options: {
					buttonConfigProvider: (action, index) => {
						const isSecondary = index > 0;
						if (new Set([ACTION_REGENERATE_RESPONSE, ACTION_TOGGLE_DIFF, ACTION_REPORT_ISSUE]).has(action.id)) {
							return { isSecondary, showIcon: true, showLabel: false };
						} else {
							return { isSecondary };
						}
					}
				}
			},
			secondaryMenuId: MENU_INLINE_CHAT_WIDGET_SECONDARY,
			inZoneWidget: true,
			chatWidgetViewOptions: {
				menus: {
					telemetrySource: 'interactiveEditorWidget-toolbar',
					inputSideToolbar: MENU_INLINE_CHAT_SIDE
				},
				clear: clearDelegate,
				...options,
				rendererOptions: {
					renderTextEditsAsSummary: (uri) => {
						// render when dealing with the current file in the editor
						return isEqual(uri, editors.editor.getModel()?.uri);
					},
					renderDetectedCommandsWithRequest: true,
					...options?.rendererOptions
				},
				defaultMode: ChatMode.Ask
			}
		});
		this._disposables.add(this.widget);

		let revealFn: (() => void) | undefined;
		this._disposables.add(this.widget.chatWidget.onWillMaybeChangeHeight(() => {
			if (this.position) {
				revealFn = this._createZoneAndScrollRestoreFn(this.position);
			}
		}));
		this._disposables.add(this.widget.onDidChangeHeight(() => {
			if (this.position && !this._usesResizeHeight) {
				// only relayout when visible
				revealFn ??= this._createZoneAndScrollRestoreFn(this.position);
				const height = this._computeHeight();
				this._relayout(height.linesValue);
				revealFn?.();
				revealFn = undefined;
			}
		}));

		this.create();

		this._disposables.add(autorun(r => {
			const isBusy = this.widget.requestInProgress.read(r);
			this.domNode.firstElementChild?.classList.toggle('busy', isBusy);
		}));

		this._disposables.add(addDisposableListener(this.domNode, 'click', e => {
			if (!this.editor.hasWidgetFocus() && !this.widget.hasFocus()) {
				this.editor.focus();
			}
		}, true));


		// todo@jrieken listen ONLY when showing
		const updateCursorIsAboveContextKey = () => {
			if (!this.position || !this.editor.hasModel()) {
				this._ctxCursorPosition.reset();
			} else if (this.position.lineNumber === this.editor.getPosition().lineNumber) {
				this._ctxCursorPosition.set('above');
			} else if (this.position.lineNumber + 1 === this.editor.getPosition().lineNumber) {
				this._ctxCursorPosition.set('below');
			} else {
				this._ctxCursorPosition.reset();
			}
		};
		this._disposables.add(this.editor.onDidChangeCursorPosition(e => updateCursorIsAboveContextKey()));
		this._disposables.add(this.editor.onDidFocusEditorText(e => updateCursorIsAboveContextKey()));
		updateCursorIsAboveContextKey();
	}

	protected override _fillContainer(container: HTMLElement): void {

		container.style.setProperty('--vscode-inlineChat-background', 'var(--vscode-editor-background)');

		container.appendChild(this.widget.domNode);
	}

	protected override _doLayout(heightInPixel: number): void {

		this._updatePadding();

		const info = this.editor.getLayoutInfo();
		const width = info.contentWidth - info.verticalScrollbarWidth;
		// width = Math.min(850, width);

		this._dimension = new Dimension(width, heightInPixel);
		this.widget.layout(this._dimension);
	}

	private _computeHeight(): { linesValue: number; pixelsValue: number } {
		const chatContentHeight = this.widget.contentHeight;
		const editorHeight = this.notebookEditor?.getLayoutInfo().height ?? this.editor.getLayoutInfo().height;

		const contentHeight = this._decoratingElementsHeight() + Math.min(chatContentHeight, Math.max(this.widget.minHeight, editorHeight * 0.42));
		const heightInLines = contentHeight / this.editor.getOption(EditorOption.lineHeight);
		return { linesValue: heightInLines, pixelsValue: contentHeight };
	}

	protected override _getResizeBounds(): { minLines: number; maxLines: number } {
		const lineHeight = this.editor.getOption(EditorOption.lineHeight);
		const decoHeight = this._decoratingElementsHeight();

		const minHeightPx = decoHeight + this.widget.minHeight;
		const maxHeightPx = decoHeight + this.widget.contentHeight;

		return {
			minLines: minHeightPx / lineHeight,
			maxLines: maxHeightPx / lineHeight
		};
	}

	protected override _onWidth(_widthInPixel: number): void {
		if (this._dimension) {
			this._doLayout(this._dimension.height);
		}
	}

	override show(position: Position): void {
		assertType(this.container);

		this._updatePadding();

		const revealZone = this._createZoneAndScrollRestoreFn(position);
		super.show(position, this._computeHeight().linesValue);
		this.widget.chatWidget.setVisible(true);
		this.widget.focus();

		revealZone();
		this._scrollUp.enable();
	}

	private _updatePadding() {
		assertType(this.container);

		const info = this.editor.getLayoutInfo();
		const marginWithoutIndentation = info.glyphMarginWidth + info.lineNumbersWidth + info.decorationsWidth;
		this.container.style.paddingLeft = `${marginWithoutIndentation}px`;
	}

	reveal(position: Position) {
		const stickyScroll = this.editor.getOption(EditorOption.stickyScroll);
		const magicValue = stickyScroll.enabled ? stickyScroll.maxLineCount : 0;
		this.editor.revealLines(position.lineNumber + magicValue, position.lineNumber + magicValue, ScrollType.Immediate);
		this._scrollUp.reset();
		this.updatePositionAndHeight(position);
	}

	override updatePositionAndHeight(position: Position): void {
		const revealZone = this._createZoneAndScrollRestoreFn(position);
		super.updatePositionAndHeight(position, !this._usesResizeHeight ? this._computeHeight().linesValue : undefined);
		revealZone();
	}

	private _createZoneAndScrollRestoreFn(position: Position): () => void {

		const scrollState = StableEditorBottomScrollState.capture(this.editor);

		const lineNumber = position.lineNumber <= 1 ? 1 : 1 + position.lineNumber;
		const scrollTop = this.editor.getScrollTop();
		const lineTop = this.editor.getTopForLineNumber(lineNumber);
		const zoneTop = lineTop - this._computeHeight().pixelsValue;

		const hasResponse = this.widget.chatWidget.viewModel?.getItems().find(candidate => {
			return isResponseVM(candidate) && candidate.response.value.length > 0;
		});

		if (hasResponse && zoneTop < scrollTop || this._scrollUp.didScrollUpOrDown) {
			// don't reveal the zone if it is already out of view (unless we are still getting ready)
			// or if an outside scroll-up happened (e.g the user scrolled up/down to see the new content)
			return this._scrollUp.runIgnored(() => {
				scrollState.restore(this.editor);
			});
		}

		return this._scrollUp.runIgnored(() => {
			scrollState.restore(this.editor);

			const scrollTop = this.editor.getScrollTop();
			const lineTop = this.editor.getTopForLineNumber(lineNumber);
			const zoneTop = lineTop - this._computeHeight().pixelsValue;
			const editorHeight = this.editor.getLayoutInfo().height;
			const lineBottom = this.editor.getBottomForLineNumber(lineNumber);

			let newScrollTop = zoneTop;
			let forceScrollTop = false;

			if (lineBottom >= (scrollTop + editorHeight)) {
				// revealing the top of the zone would push out the line we are interested in and
				// therefore we keep the line in the viewport
				newScrollTop = lineBottom - editorHeight;
				forceScrollTop = true;
			}

			if (newScrollTop < scrollTop || forceScrollTop) {
				this._logService.trace('[IE] REVEAL zone', { zoneTop, lineTop, lineBottom, scrollTop, newScrollTop, forceScrollTop });
				this.editor.setScrollTop(newScrollTop, ScrollType.Immediate);
			}
		});
	}

	protected override revealRange(range: Range, isLastLine: boolean): void {
		// noop
	}

	override hide(): void {
		const scrollState = StableEditorBottomScrollState.capture(this.editor);
		this._scrollUp.disable();
		this._ctxCursorPosition.reset();
		this.widget.chatWidget.setVisible(false);
		super.hide();
		aria.status(localize('inlineChatClosed', 'Closed inline chat widget'));
		scrollState.restore(this.editor);
	}
}

class ScrollUpState {

	private _didScrollUpOrDown?: boolean;
	private _ignoreEvents = false;

	private readonly _listener = new MutableDisposable();

	constructor(private readonly _editor: ICodeEditor) { }

	dispose(): void {
		this._listener.dispose();
	}

	reset(): void {
		this._didScrollUpOrDown = undefined;
	}

	enable(): void {
		this._didScrollUpOrDown = undefined;
		this._listener.value = this._editor.onDidScrollChange(e => {
			if (!e.scrollTopChanged || this._ignoreEvents) {
				return;
			}
			this._listener.clear();
			this._didScrollUpOrDown = true;
		});
	}

	disable(): void {
		this._listener.clear();
		this._didScrollUpOrDown = undefined;
	}

	runIgnored(callback: () => void): () => void {
		return () => {
			this._ignoreEvents = true;
			try {
				return callback();
			} finally {
				this._ignoreEvents = false;
			}
		};
	}

	get didScrollUpOrDown(): boolean | undefined {
		return this._didScrollUpOrDown;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/inlineChat/browser/utils.ts]---
Location: vscode-main/src/vs/workbench/contrib/inlineChat/browser/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditOperation } from '../../../../editor/common/core/editOperation.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IIdentifiedSingleEditOperation, ITextModel, IValidEditOperation, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { IEditObserver } from './inlineChatStrategies.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IntervalTimer, AsyncIterableSource } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { getNWords } from '../../chat/common/chatWordCounter.js';
import { TextModelEditSource } from '../../../../editor/common/textModelEditSource.js';



// --- async edit

export interface AsyncTextEdit {
	readonly range: IRange;
	readonly newText: AsyncIterable<string>;
}

export async function performAsyncTextEdit(model: ITextModel, edit: AsyncTextEdit, progress?: IProgress<IValidEditOperation[]>, obs?: IEditObserver, editSource?: TextModelEditSource) {

	const [id] = model.deltaDecorations([], [{
		range: edit.range,
		options: {
			description: 'asyncTextEdit',
			stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
		}
	}]);

	let first = true;
	for await (const part of edit.newText) {

		if (model.isDisposed()) {
			break;
		}

		const range = model.getDecorationRange(id);
		if (!range) {
			throw new Error('FAILED to perform async replace edit because the anchor decoration was removed');
		}

		const edit = first
			? EditOperation.replace(range, part) // first edit needs to override the "anchor"
			: EditOperation.insert(range.getEndPosition(), part);
		obs?.start();

		model.pushEditOperations(null, [edit], (undoEdits) => {
			progress?.report(undoEdits);
			return null;
		}, undefined, editSource);

		obs?.stop();
		first = false;
	}
}

export function asProgressiveEdit(interval: IntervalTimer, edit: IIdentifiedSingleEditOperation, wordsPerSec: number, token: CancellationToken): AsyncTextEdit {

	wordsPerSec = Math.max(30, wordsPerSec);

	const stream = new AsyncIterableSource<string>();
	let newText = edit.text ?? '';

	interval.cancelAndSet(() => {
		if (token.isCancellationRequested) {
			return;
		}
		const r = getNWords(newText, 1);
		stream.emitOne(r.value);
		newText = newText.substring(r.value.length);
		if (r.isFullString) {
			interval.cancel();
			stream.resolve();
			d.dispose();
		}

	}, 1000 / wordsPerSec);

	// cancel ASAP
	const d = token.onCancellationRequested(() => {
		interval.cancel();
		stream.resolve();
		d.dispose();
	});

	return {
		range: edit.range,
		newText: stream.asyncIterable
	};
}
```

--------------------------------------------------------------------------------

````

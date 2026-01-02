---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 355
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 355 of 552)

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

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedDocumentEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedDocumentEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IReference, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ITransaction, autorun, transaction } from '../../../../../base/common/observable.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { getCodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { TextEdit as EditorTextEdit } from '../../../../../editor/common/core/edits/textEdit.js';
import { StringText } from '../../../../../editor/common/core/text/abstractText.js';
import { IDocumentDiff } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { Location, TextEdit } from '../../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { SingleModelEditStackElement } from '../../../../../editor/common/model/editStack.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../../editor/common/model/textModel.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IMarkerService } from '../../../../../platform/markers/common/markers.js';
import { IUndoRedoElement, IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { IEditorPane, SaveReason } from '../../../../common/editor.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ITextFileService, isTextFileEditorModel, stringToSnapshot } from '../../../../services/textfile/common/textfiles.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { ChatEditKind, IModifiedEntryTelemetryInfo, IModifiedFileEntry, IModifiedFileEntryEditorIntegration, ISnapshotEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { ChatEditingCodeEditorIntegration } from './chatEditingCodeEditorIntegration.js';
import { AbstractChatEditingModifiedFileEntry } from './chatEditingModifiedFileEntry.js';
import { ChatEditingTextModelChangeService } from './chatEditingTextModelChangeService.js';
import { ChatEditingSnapshotTextModelContentProvider, ChatEditingTextModelContentProvider } from './chatEditingTextModelContentProviders.js';

interface IMultiDiffEntryDelegate {
	collapse: (transaction: ITransaction | undefined) => void;
}


export class ChatEditingModifiedDocumentEntry extends AbstractChatEditingModifiedFileEntry implements IModifiedFileEntry {

	readonly initialContent: string;

	private readonly originalModel: ITextModel;
	private readonly modifiedModel: ITextModel;

	private readonly _docFileEditorModel: IResolvedTextEditorModel;

	override get changesCount() {
		return this._textModelChangeService.diffInfo.map(diff => diff.changes.length);
	}

	get diffInfo() {
		return this._textModelChangeService.diffInfo;
	}

	get linesAdded() {
		return this._textModelChangeService.diffInfo.map(diff => {
			let added = 0;
			for (const c of diff.changes) {
				added += Math.max(0, c.modified.endLineNumberExclusive - c.modified.startLineNumber);
			}
			return added;
		});
	}
	get linesRemoved() {
		return this._textModelChangeService.diffInfo.map(diff => {
			let removed = 0;
			for (const c of diff.changes) {
				removed += Math.max(0, c.original.endLineNumberExclusive - c.original.startLineNumber);
			}
			return removed;
		});
	}

	readonly originalURI: URI;
	private readonly _textModelChangeService: ChatEditingTextModelChangeService;

	constructor(
		resourceRef: IReference<IResolvedTextEditorModel>,
		private readonly _multiDiffEntryDelegate: IMultiDiffEntryDelegate,
		telemetryInfo: IModifiedEntryTelemetryInfo,
		kind: ChatEditKind,
		initialContent: string | undefined,
		@IMarkerService markerService: IMarkerService,
		@IModelService modelService: IModelService,
		@ITextModelService textModelService: ITextModelService,
		@ILanguageService languageService: ILanguageService,
		@IConfigurationService configService: IConfigurationService,
		@IFilesConfigurationService fileConfigService: IFilesConfigurationService,
		@IChatService chatService: IChatService,
		@ITextFileService private readonly _textFileService: ITextFileService,
		@IFileService fileService: IFileService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IAiEditTelemetryService aiEditTelemetryService: IAiEditTelemetryService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
	) {
		super(
			resourceRef.object.textEditorModel.uri,
			telemetryInfo,
			kind,
			configService,
			fileConfigService,
			chatService,
			fileService,
			undoRedoService,
			instantiationService,
			aiEditTelemetryService,
		);

		this._docFileEditorModel = this._register(resourceRef).object;
		this.modifiedModel = resourceRef.object.textEditorModel;
		this.originalURI = ChatEditingTextModelContentProvider.getFileURI(telemetryInfo.sessionResource, this.entryId, this.modifiedURI.path);

		this.initialContent = initialContent ?? this.modifiedModel.getValue();
		const docSnapshot = this.originalModel = this._register(
			modelService.createModel(
				createTextBufferFactoryFromSnapshot(initialContent !== undefined ? stringToSnapshot(initialContent) : this.modifiedModel.createSnapshot()),
				languageService.createById(this.modifiedModel.getLanguageId()),
				this.originalURI,
				false
			)
		);

		this._textModelChangeService = this._register(instantiationService.createInstance(ChatEditingTextModelChangeService,
			this.originalModel, this.modifiedModel, this._stateObs, () => this._isExternalEditInProgress));

		this._register(this._textModelChangeService.onDidAcceptOrRejectAllHunks(action => {
			this._stateObs.set(action, undefined);
			this._notifySessionAction(action === ModifiedFileEntryState.Accepted ? 'accepted' : 'rejected');
		}));

		this._register(this._textModelChangeService.onDidAcceptOrRejectLines(action => {
			this._notifyAction({
				kind: 'chatEditingHunkAction',
				uri: this.modifiedURI,
				outcome: action.state,
				languageId: this.modifiedModel.getLanguageId(),
				...action
			});
		}));

		// Create a reference to this model to avoid it being disposed from under our nose
		(async () => {
			const reference = await textModelService.createModelReference(docSnapshot.uri);
			if (this._store.isDisposed) {
				reference.dispose();
				return;
			}
			this._register(reference);
		})();


		this._register(this._textModelChangeService.onDidUserEditModel(() => {
			this._userEditScheduler.schedule();
			const didResetToOriginalContent = this.modifiedModel.getValue() === this.initialContent;
			if (this._stateObs.get() === ModifiedFileEntryState.Modified && didResetToOriginalContent) {
				this._stateObs.set(ModifiedFileEntryState.Rejected, undefined);
			}
		}));

		const resourceFilter = this._register(new MutableDisposable());
		this._register(autorun(r => {
			const inProgress = this._waitsForLastEdits.read(r);
			if (inProgress) {
				const res = this._lastModifyingResponseObs.read(r);
				const req = res && res.session.getRequests().find(value => value.id === res.requestId);
				resourceFilter.value = markerService.installResourceFilter(this.modifiedURI, req?.message.text || localize('default', "Chat Edits"));
			} else {
				resourceFilter.clear();
			}
		}));
	}

	getDiffInfo(): Promise<IDocumentDiff> {
		return this._textModelChangeService.getDiffInfo();
	}

	equalsSnapshot(snapshot: ISnapshotEntry | undefined): boolean {
		return !!snapshot &&
			this.modifiedURI.toString() === snapshot.resource.toString() &&
			this.modifiedModel.getLanguageId() === snapshot.languageId &&
			this.originalModel.getValue() === snapshot.original &&
			this.modifiedModel.getValue() === snapshot.current &&
			this.state.get() === snapshot.state;
	}

	createSnapshot(chatSessionResource: URI, requestId: string | undefined, undoStop: string | undefined): ISnapshotEntry {
		return {
			resource: this.modifiedURI,
			languageId: this.modifiedModel.getLanguageId(),
			snapshotUri: ChatEditingSnapshotTextModelContentProvider.getSnapshotFileURI(chatSessionResource, requestId, undoStop, this.modifiedURI.path),
			original: this.originalModel.getValue(),
			current: this.modifiedModel.getValue(),
			state: this.state.get(),
			telemetryInfo: this._telemetryInfo
		};
	}

	public getCurrentContents() {
		return this.modifiedModel.getValue();
	}

	public override hasModificationAt(location: Location): boolean {
		return location.uri.toString() === this.modifiedModel.uri.toString() && this._textModelChangeService.hasHunkAt(location.range);
	}

	async restoreFromSnapshot(snapshot: ISnapshotEntry, restoreToDisk = true) {
		this._stateObs.set(snapshot.state, undefined);
		await this._textModelChangeService.resetDocumentValues(snapshot.original, restoreToDisk ? snapshot.current : undefined);
	}

	async resetToInitialContent() {
		await this._textModelChangeService.resetDocumentValues(undefined, this.initialContent);
	}

	protected override async _areOriginalAndModifiedIdentical(): Promise<boolean> {
		return this._textModelChangeService.areOriginalAndModifiedIdentical();
	}

	protected override _resetEditsState(tx: ITransaction): void {
		super._resetEditsState(tx);
		this._textModelChangeService.clearCurrentEditLineDecoration();
	}

	protected override _createUndoRedoElement(response: IChatResponseModel): IUndoRedoElement {
		const request = response.session.getRequests().find(req => req.id === response.requestId);
		const label = request?.message.text ? localize('chatEditing1', "Chat Edit: '{0}'", request.message.text) : localize('chatEditing2', "Chat Edit");
		return new SingleModelEditStackElement(label, 'chat.edit', this.modifiedModel, null);
	}

	async acceptAgentEdits(resource: URI, textEdits: (TextEdit | ICellEditOperation)[], isLastEdits: boolean, responseModel: IChatResponseModel | undefined): Promise<void> {

		const result = await this._textModelChangeService.acceptAgentEdits(resource, textEdits, isLastEdits, responseModel);

		transaction((tx) => {
			this._waitsForLastEdits.set(!isLastEdits, tx);
			this._stateObs.set(ModifiedFileEntryState.Modified, tx);

			if (!isLastEdits) {
				this._rewriteRatioObs.set(result.rewriteRatio, tx);
			} else {
				this._resetEditsState(tx);
				this._rewriteRatioObs.set(1, tx);
			}
		});
		if (isLastEdits && this._shouldAutoSave()) {
			await this._textFileService.save(this.modifiedModel.uri, {
				reason: SaveReason.AUTO,
				skipSaveParticipants: true,
			});
		}
	}


	protected override async _doAccept(): Promise<void> {
		this._textModelChangeService.keep();
		this._multiDiffEntryDelegate.collapse(undefined);

		const config = this._fileConfigService.getAutoSaveConfiguration(this.modifiedURI);
		if (!config.autoSave || !this._textFileService.isDirty(this.modifiedURI)) {
			// SAVE after accept for manual-savers, for auto-savers
			// trigger explict save to get save participants going
			try {
				await this._textFileService.save(this.modifiedURI, {
					reason: SaveReason.EXPLICIT,
					force: true,
					ignoreErrorHandler: true
				});
			} catch {
				// ignored
			}
		}
	}

	protected override async _doReject(): Promise<void> {
		if (this.createdInRequestId === this._telemetryInfo.requestId) {
			if (isTextFileEditorModel(this._docFileEditorModel)) {
				await this._docFileEditorModel.revert({ soft: true });
				await this._fileService.del(this.modifiedURI).catch(err => {
					// don't block if file is already deleted
				});
			}
			this._onDidDelete.fire();
		} else {
			this._textModelChangeService.undo();
			if (this._textModelChangeService.allEditsAreFromUs && isTextFileEditorModel(this._docFileEditorModel) && this._shouldAutoSave()) {
				// save the file after discarding so that the dirty indicator goes away
				// and so that an intermediate saved state gets reverted
				await this._docFileEditorModel.save({ reason: SaveReason.EXPLICIT, skipSaveParticipants: true });
			}
			this._multiDiffEntryDelegate.collapse(undefined);
		}
	}

	protected _createEditorIntegration(editor: IEditorPane): IModifiedFileEntryEditorIntegration {
		const codeEditor = getCodeEditor(editor.getControl());
		assertType(codeEditor);

		const diffInfo = this._textModelChangeService.diffInfo;

		return this._instantiationService.createInstance(ChatEditingCodeEditorIntegration, this, codeEditor, diffInfo, false);
	}

	private _shouldAutoSave() {
		return this.modifiedURI.scheme !== Schemas.untitled;
	}

	async computeEditsFromSnapshots(beforeSnapshot: string, afterSnapshot: string): Promise<(TextEdit | ICellEditOperation)[]> {
		const stringEdit = await this._editorWorkerService.computeStringEditFromDiff(
			beforeSnapshot,
			afterSnapshot,
			{ maxComputationTimeMs: 5000 },
			'advanced'
		);

		const editorTextEdit = EditorTextEdit.fromStringEdit(stringEdit, new StringText(beforeSnapshot));
		return editorTextEdit.replacements.slice();
	}

	async save(): Promise<void> {
		if (this.modifiedModel.uri.scheme === Schemas.untitled) {
			return;
		}

		// Save the current model state to disk if dirty
		if (this._textFileService.isDirty(this.modifiedModel.uri)) {
			await this._textFileService.save(this.modifiedModel.uri, {
				reason: SaveReason.EXPLICIT,
				skipSaveParticipants: true
			});
		}
	}

	async revertToDisk(): Promise<void> {
		if (this.modifiedModel.uri.scheme === Schemas.untitled) {
			return;
		}

		// Revert to reload from disk, ensuring in-memory model matches disk
		const fileModel = this._textFileService.files.get(this.modifiedModel.uri);
		if (fileModel && !fileModel.isDisposed()) {
			await fileModel.revert({ soft: false });
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedFileEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedFileEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableMap, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { clamp } from '../../../../../base/common/numbers.js';
import { autorun, derived, IObservable, ITransaction, observableValue, observableValueOpts, transaction } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { Location, TextEdit } from '../../../../../editor/common/languages.js';
import { EditDeltaInfo } from '../../../../../editor/common/textModelEditSource.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import { editorBackground, registerColor, transparent } from '../../../../../platform/theme/common/colorRegistry.js';
import { IUndoRedoElement, IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { IEditorPane } from '../../../../common/editor.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { ChatEditKind, IModifiedEntryTelemetryInfo, IModifiedFileEntry, IModifiedFileEntryEditorIntegration, ISnapshotEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { ChatUserAction, IChatService } from '../../common/chatService.js';

class AutoAcceptControl {
	constructor(
		readonly total: number,
		readonly remaining: number,
		readonly cancel: () => void
	) { }
}

export const pendingRewriteMinimap = registerColor('minimap.chatEditHighlight',
	transparent(editorBackground, 0.6),
	localize('editorSelectionBackground', "Color of pending edit regions in the minimap"));


export abstract class AbstractChatEditingModifiedFileEntry extends Disposable implements IModifiedFileEntry {

	static readonly scheme = 'modified-file-entry';

	private static lastEntryId = 0;

	readonly entryId = `${AbstractChatEditingModifiedFileEntry.scheme}::${++AbstractChatEditingModifiedFileEntry.lastEntryId}`;

	protected readonly _onDidDelete = this._register(new Emitter<void>());
	readonly onDidDelete = this._onDidDelete.event;

	protected readonly _stateObs = observableValue<ModifiedFileEntryState>(this, ModifiedFileEntryState.Modified);
	readonly state: IObservable<ModifiedFileEntryState> = this._stateObs;

	protected readonly _waitsForLastEdits = observableValue<boolean>(this, false);
	readonly waitsForLastEdits: IObservable<boolean> = this._waitsForLastEdits;

	protected readonly _isCurrentlyBeingModifiedByObs = observableValue<{ responseModel: IChatResponseModel; undoStopId: string | undefined } | undefined>(this, undefined);
	readonly isCurrentlyBeingModifiedBy: IObservable<{ responseModel: IChatResponseModel; undoStopId: string | undefined } | undefined> = this._isCurrentlyBeingModifiedByObs;

	/**
	 * Flag to track if we're currently in an external edit operation.
	 * When true, file system changes should be treated as agent edits, not user edits.
	 */
	protected _isExternalEditInProgress = false;

	protected readonly _lastModifyingResponseObs = observableValueOpts<IChatResponseModel | undefined>({ equalsFn: (a, b) => a?.requestId === b?.requestId }, undefined);
	readonly lastModifyingResponse: IObservable<IChatResponseModel | undefined> = this._lastModifyingResponseObs;

	protected readonly _lastModifyingResponseInProgressObs = this._lastModifyingResponseObs.map((value, r) => {
		return value?.isInProgress.read(r) ?? false;
	});

	protected readonly _rewriteRatioObs = observableValue<number>(this, 0);
	readonly rewriteRatio: IObservable<number> = this._rewriteRatioObs;

	private readonly _reviewModeTempObs = observableValue<true | undefined>(this, undefined);
	readonly reviewMode: IObservable<boolean>;

	private readonly _autoAcceptCtrl = observableValue<AutoAcceptControl | undefined>(this, undefined);
	readonly autoAcceptController: IObservable<AutoAcceptControl | undefined> = this._autoAcceptCtrl;

	protected readonly _autoAcceptTimeout: IObservable<number>;

	get telemetryInfo(): IModifiedEntryTelemetryInfo {
		return this._telemetryInfo;
	}

	readonly createdInRequestId: string | undefined;

	get lastModifyingRequestId() {
		return this._telemetryInfo.requestId;
	}

	private _refCounter: number = 1;

	readonly abstract originalURI: URI;

	protected readonly _userEditScheduler = this._register(new RunOnceScheduler(() => this._notifySessionAction('userModified'), 1000));

	constructor(
		readonly modifiedURI: URI,
		protected _telemetryInfo: IModifiedEntryTelemetryInfo,
		kind: ChatEditKind,
		@IConfigurationService configService: IConfigurationService,
		@IFilesConfigurationService protected _fileConfigService: IFilesConfigurationService,
		@IChatService protected readonly _chatService: IChatService,
		@IFileService protected readonly _fileService: IFileService,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@IAiEditTelemetryService private readonly _aiEditTelemetryService: IAiEditTelemetryService,
	) {
		super();

		if (kind === ChatEditKind.Created) {
			this.createdInRequestId = this._telemetryInfo.requestId;
		}

		if (this.modifiedURI.scheme !== Schemas.untitled && this.modifiedURI.scheme !== Schemas.vscodeNotebookCell) {
			this._register(this._fileService.watch(this.modifiedURI));
			this._register(this._fileService.onDidFilesChange(e => {
				if (e.affects(this.modifiedURI) && kind === ChatEditKind.Created && e.gotDeleted()) {
					this._onDidDelete.fire();
				}
			}));
		}

		// review mode depends on setting and temporary override
		const autoAcceptRaw = observableConfigValue('chat.editing.autoAcceptDelay', 0, configService);
		this._autoAcceptTimeout = derived(r => {
			const value = autoAcceptRaw.read(r);
			return clamp(value, 0, 100);
		});
		this.reviewMode = derived(r => {
			const configuredValue = this._autoAcceptTimeout.read(r);
			const tempValue = this._reviewModeTempObs.read(r);
			return tempValue ?? configuredValue === 0;
		});

		this._store.add(toDisposable(() => this._lastModifyingResponseObs.set(undefined, undefined)));

		const autoSaveOff = this._store.add(new MutableDisposable());
		this._store.add(autorun(r => {
			if (this._waitsForLastEdits.read(r)) {
				autoSaveOff.value = _fileConfigService.disableAutoSave(this.modifiedURI);
			} else {
				autoSaveOff.clear();
			}
		}));

		this._store.add(autorun(r => {
			const inProgress = this._lastModifyingResponseInProgressObs.read(r);
			if (inProgress === false && !this.reviewMode.read(r)) {
				// AUTO accept mode (when request is done)

				const acceptTimeout = this._autoAcceptTimeout.read(undefined) * 1000;
				const future = Date.now() + acceptTimeout;
				const update = () => {

					const reviewMode = this.reviewMode.read(undefined);
					if (reviewMode) {
						// switched back to review mode
						this._autoAcceptCtrl.set(undefined, undefined);
						return;
					}

					const remain = Math.round(future - Date.now());
					if (remain <= 0) {
						this.accept();
					} else {
						const handle = setTimeout(update, 100);
						this._autoAcceptCtrl.set(new AutoAcceptControl(acceptTimeout, remain, () => {
							clearTimeout(handle);
							this._autoAcceptCtrl.set(undefined, undefined);
						}), undefined);
					}
				};
				update();
			}
		}));
	}

	override dispose(): void {
		if (--this._refCounter === 0) {
			super.dispose();
		}
	}

	public abstract hasModificationAt(location: Location): boolean;

	acquire() {
		this._refCounter++;
		return this;
	}

	enableReviewModeUntilSettled(): void {

		if (this.state.get() !== ModifiedFileEntryState.Modified) {
			// nothing to do
			return;
		}

		this._reviewModeTempObs.set(true, undefined);

		const cleanup = autorun(r => {
			// reset config when settled
			const resetConfig = this.state.read(r) !== ModifiedFileEntryState.Modified;
			if (resetConfig) {
				this._store.delete(cleanup);
				this._reviewModeTempObs.set(undefined, undefined);
			}
		});

		this._store.add(cleanup);
	}

	updateTelemetryInfo(telemetryInfo: IModifiedEntryTelemetryInfo) {
		this._telemetryInfo = telemetryInfo;
	}

	async accept(): Promise<void> {
		const callback = await this.acceptDeferred();
		if (callback) {
			transaction(callback);
		}
	}

	/** Accepts and returns a function used to transition the state. This MUST be called by the consumer. */
	async acceptDeferred(): Promise<((tx: ITransaction) => void) | undefined> {
		if (this._stateObs.get() !== ModifiedFileEntryState.Modified) {
			// already accepted or rejected
			return;
		}

		await this._doAccept();

		return (tx: ITransaction) => {
			this._stateObs.set(ModifiedFileEntryState.Accepted, tx);
			this._autoAcceptCtrl.set(undefined, tx);
			this._notifySessionAction('accepted');
		};
	}

	protected abstract _doAccept(): Promise<void>;

	async reject(): Promise<void> {
		const callback = await this.rejectDeferred();
		if (callback) {
			transaction(callback);
		}
	}

	/** Rejects and returns a function used to transition the state. This MUST be called by the consumer. */
	async rejectDeferred(): Promise<((tx: ITransaction) => void) | undefined> {
		if (this._stateObs.get() !== ModifiedFileEntryState.Modified) {
			// already accepted or rejected
			return undefined;
		}

		this._notifySessionAction('rejected');
		await this._doReject();

		return (tx: ITransaction) => {
			this._stateObs.set(ModifiedFileEntryState.Rejected, tx);
			this._autoAcceptCtrl.set(undefined, tx);
		};
	}

	protected abstract _doReject(): Promise<void>;

	protected _notifySessionAction(outcome: 'accepted' | 'rejected' | 'userModified') {
		this._notifyAction({ kind: 'chatEditingSessionAction', uri: this.modifiedURI, hasRemainingEdits: false, outcome });
	}

	protected _notifyAction(action: ChatUserAction) {
		if (action.kind === 'chatEditingHunkAction') {
			this._aiEditTelemetryService.handleCodeAccepted({
				suggestionId: undefined, // TODO@hediet try to figure this out
				acceptanceMethod: 'accept',
				presentation: 'highlightedEdit',
				modelId: this._telemetryInfo.modelId,
				modeId: this._telemetryInfo.modeId,
				applyCodeBlockSuggestionId: this._telemetryInfo.applyCodeBlockSuggestionId,
				editDeltaInfo: new EditDeltaInfo(
					action.linesAdded,
					action.linesRemoved,
					-1,
					-1,
				),
				feature: this._telemetryInfo.feature,
				languageId: action.languageId,
				source: undefined,
			});
		}

		this._chatService.notifyUserAction({
			action,
			agentId: this._telemetryInfo.agentId,
			modelId: this._telemetryInfo.modelId,
			modeId: this._telemetryInfo.modeId,
			command: this._telemetryInfo.command,
			sessionResource: this._telemetryInfo.sessionResource,
			requestId: this._telemetryInfo.requestId,
			result: this._telemetryInfo.result
		});
	}

	private readonly _editorIntegrations = this._register(new DisposableMap<IEditorPane, IModifiedFileEntryEditorIntegration>());

	getEditorIntegration(pane: IEditorPane): IModifiedFileEntryEditorIntegration {
		let value = this._editorIntegrations.get(pane);
		if (!value) {
			value = this._createEditorIntegration(pane);
			this._editorIntegrations.set(pane, value);
		}
		return value;
	}

	/**
	 * Create the editor integration for this entry and the given editor pane. This will only be called
	 * once (and cached) per pane. The integration is meant to be scoped to this entry only and when the
	 * passed pane/editor changes input, then the editor integration must handle that, e.g use default/null
	 * values
	 */
	protected abstract _createEditorIntegration(editor: IEditorPane): IModifiedFileEntryEditorIntegration;

	abstract readonly changesCount: IObservable<number>;

	acceptStreamingEditsStart(responseModel: IChatResponseModel, undoStopId: string | undefined, tx: ITransaction | undefined) {
		this._resetEditsState(tx);
		this._isCurrentlyBeingModifiedByObs.set({ responseModel, undoStopId }, tx);
		this._lastModifyingResponseObs.set(responseModel, tx);
		this._autoAcceptCtrl.get()?.cancel();

		const undoRedoElement = this._createUndoRedoElement(responseModel);
		if (undoRedoElement) {
			this._undoRedoService.pushElement(undoRedoElement);
		}
	}

	protected abstract _createUndoRedoElement(response: IChatResponseModel): IUndoRedoElement | undefined;

	abstract acceptAgentEdits(uri: URI, edits: (TextEdit | ICellEditOperation)[], isLastEdits: boolean, responseModel: IChatResponseModel | undefined): Promise<void>;

	async acceptStreamingEditsEnd() {
		this._resetEditsState(undefined);

		if (await this._areOriginalAndModifiedIdentical()) {
			// ACCEPT if identical
			await this.accept();
		}
	}

	protected abstract _areOriginalAndModifiedIdentical(): Promise<boolean>;

	protected _resetEditsState(tx: ITransaction | undefined): void {
		this._isCurrentlyBeingModifiedByObs.set(undefined, tx);
		this._rewriteRatioObs.set(0, tx);
		this._waitsForLastEdits.set(false, tx);
	}

	// --- snapshot

	abstract createSnapshot(chatSessionResource: URI, requestId: string | undefined, undoStop: string | undefined): ISnapshotEntry;

	abstract equalsSnapshot(snapshot: ISnapshotEntry | undefined): boolean;

	abstract restoreFromSnapshot(snapshot: ISnapshotEntry, restoreToDisk?: boolean): Promise<void>;

	// --- inital content

	abstract resetToInitialContent(): Promise<void>;

	abstract initialContent: string;

	/**
	 * Computes the edits between two snapshots of the file content.
	 * @param beforeSnapshot The content before the changes
	 * @param afterSnapshot The content after the changes
	 * @returns Array of text edits or cell edit operations
	 */
	abstract computeEditsFromSnapshots(beforeSnapshot: string, afterSnapshot: string): Promise<(TextEdit | ICellEditOperation)[]>;

	/**
	 * Marks the start of an external edit operation.
	 * File system changes will be treated as agent edits until stopExternalEdit is called.
	 */
	startExternalEdit(): void {
		this._isExternalEditInProgress = true;
	}

	/**
	 * Marks the end of an external edit operation.
	 */
	stopExternalEdit(): void {
		this._isExternalEditInProgress = false;
	}

	/**
	 * Saves the current model state to disk.
	 */
	abstract save(): Promise<void>;

	/**
	 * Reloads the model from disk to ensure it's in sync with file system changes.
	 */
	abstract revertToDisk(): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedNotebookEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingModifiedNotebookEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { streamToBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { StringSHA1 } from '../../../../../base/common/hash.js';
import { DisposableStore, IReference, thenRegisterOrDispose } from '../../../../../base/common/lifecycle.js';
import { ResourceMap, ResourceSet } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { ITransaction, IObservable, observableValue, autorun, transaction, ObservablePromise } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { nullDocumentDiff } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping, RangeMapping } from '../../../../../editor/common/diff/rangeMapping.js';
import { Location, TextEdit } from '../../../../../editor/common/languages.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IUndoRedoElement, IUndoRedoService, UndoRedoElementType } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { IEditorPane, SaveReason } from '../../../../common/editor.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { SnapshotContext } from '../../../../services/workingCopy/common/fileWorkingCopy.js';
import { NotebookTextDiffEditor } from '../../../notebook/browser/diff/notebookDiffEditor.js';
import { INotebookTextDiffEditor } from '../../../notebook/browser/diff/notebookDiffEditorBrowser.js';
import { CellDiffInfo } from '../../../notebook/browser/diff/notebookDiffViewModel.js';
import { getNotebookEditorFromEditorPane } from '../../../notebook/browser/notebookBrowser.js';
import { NotebookCellTextModel } from '../../../notebook/common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, ICellDto2, ICellEditOperation, ICellReplaceEdit, IResolvedNotebookEditorModel, NotebookCellsChangeType, NotebookSetting, NotebookTextModelChangedEvent, TransientOptions } from '../../../notebook/common/notebookCommon.js';
import { computeDiff } from '../../../notebook/common/notebookDiff.js';
import { INotebookEditorModelResolverService } from '../../../notebook/common/notebookEditorModelResolverService.js';
import { INotebookLoggingService } from '../../../notebook/common/notebookLoggingService.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { INotebookEditorWorkerService } from '../../../notebook/common/services/notebookWorkerService.js';
import { ChatEditKind, IModifiedEntryTelemetryInfo, IModifiedFileEntryEditorIntegration, ISnapshotEntry, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { AbstractChatEditingModifiedFileEntry } from './chatEditingModifiedFileEntry.js';
import { createSnapshot, deserializeSnapshot, getNotebookSnapshotFileURI, restoreSnapshot, SnapshotComparer } from './notebook/chatEditingModifiedNotebookSnapshot.js';
import { ChatEditingNewNotebookContentEdits } from './notebook/chatEditingNewNotebookContentEdits.js';
import { ChatEditingNotebookCellEntry } from './notebook/chatEditingNotebookCellEntry.js';
import { ChatEditingNotebookDiffEditorIntegration, ChatEditingNotebookEditorIntegration } from './notebook/chatEditingNotebookEditorIntegration.js';
import { ChatEditingNotebookFileSystemProvider } from './notebook/chatEditingNotebookFileSystemProvider.js';
import { adjustCellDiffAndOriginalModelBasedOnCellAddDelete, adjustCellDiffAndOriginalModelBasedOnCellMovements, adjustCellDiffForKeepingAnInsertedCell, adjustCellDiffForRevertingADeletedCell, adjustCellDiffForRevertingAnInsertedCell, calculateNotebookRewriteRatio, getCorrespondingOriginalCellIndex, isTransientIPyNbExtensionEvent } from './notebook/helpers.js';
import { countChanges, ICellDiffInfo, sortCellChanges } from './notebook/notebookCellChanges.js';
import { IAiEditTelemetryService } from '../../../editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';


const SnapshotLanguageId = 'VSCodeChatNotebookSnapshotLanguage';

export class ChatEditingModifiedNotebookEntry extends AbstractChatEditingModifiedFileEntry {
	static NewModelCounter: number = 0;
	private readonly modifiedModel: NotebookTextModel;
	private readonly originalModel: NotebookTextModel;
	override originalURI: URI;
	/**
	 * JSON stringified version of the original notebook.
	 */
	override initialContent: string;
	/**
	 * Whether we're still generating diffs from a response.
	 */
	private _isProcessingResponse = observableValue<boolean>('isProcessingResponse', false);
	get isProcessingResponse(): IObservable<boolean> {
		return this._isProcessingResponse;
	}
	private _isEditFromUs: boolean = false;
	/**
	 * Whether all edits are from us, e.g. is possible a user has made edits, then this will be false.
	 */
	private _allEditsAreFromUs: boolean = true;
	private readonly _changesCount = observableValue<number>(this, 0);
	override changesCount: IObservable<number> = this._changesCount;

	private readonly cellEntryMap = new ResourceMap<ChatEditingNotebookCellEntry>();
	private modifiedToOriginalCell = new ResourceMap<URI>();
	private readonly _cellsDiffInfo = observableValue<ICellDiffInfo[]>('diffInfo', []);

	get cellsDiffInfo(): IObservable<ICellDiffInfo[]> {
		return this._cellsDiffInfo;
	}

	get viewType() {
		return this.modifiedModel.viewType;
	}

	/**
	 * List of Cell URIs that are edited,
	 * Will be cleared once all edits have been accepted.
	 * I.e. this will only contain URIS while acceptAgentEdits is being called & before `isLastEdit` is sent.
	 * I.e. this is populated only when edits are being streamed.
	 */
	private readonly editedCells = new ResourceSet();

	public static async create(uri: URI, _multiDiffEntryDelegate: { collapse: (transaction: ITransaction | undefined) => void }, telemetryInfo: IModifiedEntryTelemetryInfo, chatKind: ChatEditKind, initialContent: string | undefined, instantiationService: IInstantiationService): Promise<AbstractChatEditingModifiedFileEntry> {
		return instantiationService.invokeFunction(async accessor => {
			const notebookService = accessor.get(INotebookService);
			const resolver = accessor.get(INotebookEditorModelResolverService);
			const configurationServie = accessor.get(IConfigurationService);
			const resourceRef: IReference<IResolvedNotebookEditorModel> = await resolver.resolve(uri);
			const notebook = resourceRef.object.notebook;
			const originalUri = getNotebookSnapshotFileURI(telemetryInfo.sessionResource, telemetryInfo.requestId, generateUuid(), notebook.uri.scheme === Schemas.untitled ? `/${notebook.uri.path}` : notebook.uri.path, notebook.viewType);
			const [options, buffer] = await Promise.all([
				notebookService.withNotebookDataProvider(resourceRef.object.notebook.notebookType),
				notebookService.createNotebookTextDocumentSnapshot(notebook.uri, SnapshotContext.Backup, CancellationToken.None).then(s => streamToBuffer(s))
			]);
			const disposables = new DisposableStore();
			// Register so that we can load this from file system.
			disposables.add(ChatEditingNotebookFileSystemProvider.registerFile(originalUri, buffer));
			const originalRef = await resolver.resolve(originalUri, notebook.viewType);
			if (initialContent !== undefined) {
				try {
					restoreSnapshot(originalRef.object.notebook, initialContent);
				} catch (ex) {
					console.error(`Error restoring snapshot: ${initialContent}`, ex);
					initialContent = createSnapshot(notebook, options.serializer.options, configurationServie);
				}
			} else {
				initialContent = createSnapshot(notebook, options.serializer.options, configurationServie);
				// Both models are the same, ensure the cell ids are the same, this way we get a perfect diffing.
				// No need to generate edits for this.
				// We want to ensure they are identitcal, possible original notebook was open and got modified.
				// Or something gets changed between serialization & deserialization of the snapshot into the original.
				// E.g. in jupyter notebooks the metadata contains transient data that gets updated after deserialization.
				restoreSnapshot(originalRef.object.notebook, initialContent);
				const edits: ICellEditOperation[] = [];
				notebook.cells.forEach((cell, index) => {
					const internalId = generateCellHash(cell.uri);
					edits.push({ editType: CellEditType.PartialInternalMetadata, index, internalMetadata: { internalId } });
				});
				resourceRef.object.notebook.applyEdits(edits, true, undefined, () => undefined, undefined, false);
				originalRef.object.notebook.applyEdits(edits, true, undefined, () => undefined, undefined, false);
			}
			const instance = instantiationService.createInstance(ChatEditingModifiedNotebookEntry, resourceRef, originalRef, _multiDiffEntryDelegate, options.serializer.options, telemetryInfo, chatKind, initialContent);
			instance._register(disposables);
			return instance;
		});
	}

	public static canHandleSnapshotContent(initialContent: string | undefined): boolean {
		if (!initialContent) {
			return false;
		}

		try {
			deserializeSnapshot(initialContent);
			return true;
		} catch (ex) {
			// not a valid snapshot
			return false;
		}
	}

	public static canHandleSnapshot(snapshot: ISnapshotEntry): boolean {
		if (snapshot.languageId === SnapshotLanguageId && ChatEditingModifiedNotebookEntry.canHandleSnapshotContent(snapshot.current)) {
			return true;
		}
		return false;
	}

	private readonly initialContentComparer: SnapshotComparer;

	constructor(
		private readonly modifiedResourceRef: IReference<IResolvedNotebookEditorModel>,
		originalResourceRef: IReference<IResolvedNotebookEditorModel>,
		private readonly _multiDiffEntryDelegate: { collapse: (transaction: ITransaction | undefined) => void },
		private readonly transientOptions: TransientOptions | undefined,
		telemetryInfo: IModifiedEntryTelemetryInfo,
		kind: ChatEditKind,
		initialContent: string,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFilesConfigurationService fileConfigService: IFilesConfigurationService,
		@IChatService chatService: IChatService,
		@IFileService fileService: IFileService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IModelService private readonly modelService: IModelService,
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@INotebookEditorWorkerService private readonly notebookEditorWorkerService: INotebookEditorWorkerService,
		@INotebookLoggingService private readonly loggingService: INotebookLoggingService,
		@INotebookEditorModelResolverService private readonly notebookResolver: INotebookEditorModelResolverService,
		@IAiEditTelemetryService aiEditTelemetryService: IAiEditTelemetryService,
	) {
		super(modifiedResourceRef.object.notebook.uri, telemetryInfo, kind, configurationService, fileConfigService, chatService, fileService, undoRedoService, instantiationService, aiEditTelemetryService);
		this.initialContentComparer = new SnapshotComparer(initialContent);
		this.modifiedModel = this._register(modifiedResourceRef).object.notebook;
		this.originalModel = this._register(originalResourceRef).object.notebook;
		this.originalURI = this.originalModel.uri;
		this.initialContent = initialContent;
		this.initializeModelsFromDiff();
		this._register(this.modifiedModel.onDidChangeContent(this.mirrorNotebookEdits, this));
	}

	public override hasModificationAt(location: Location): boolean {
		return this.cellEntryMap.get(location.uri)?.hasModificationAt(location.range) ?? false;
	}

	initializeModelsFromDiffImpl(cellsDiffInfo: CellDiffInfo[]) {
		this.cellEntryMap.forEach(entry => entry.dispose());
		this.cellEntryMap.clear();
		const diffs = cellsDiffInfo.map((cellDiff, i) => {
			switch (cellDiff.type) {
				case 'delete':
					return this.createDeleteCellDiffInfo(cellDiff.originalCellIndex);
				case 'insert':
					return this.createInsertedCellDiffInfo(cellDiff.modifiedCellIndex);
				default:
					return this.createModifiedCellDiffInfo(cellDiff.modifiedCellIndex, cellDiff.originalCellIndex);
			}
		});
		this._cellsDiffInfo.set(diffs, undefined);
		this._changesCount.set(countChanges(diffs), undefined);
	}

	getIndexOfCellHandle(handle: number) {
		return this.modifiedModel.cells.findIndex(c => c.handle === handle);
	}

	private computeRequestId: number = 0;
	async initializeModelsFromDiff() {
		const id = ++this.computeRequestId;
		if (this._areOriginalAndModifiedIdenticalImpl()) {
			const cellsDiffInfo: CellDiffInfo[] = this.modifiedModel.cells.map((_, index) => {
				return { type: 'unchanged', originalCellIndex: index, modifiedCellIndex: index } satisfies CellDiffInfo;
			});
			this.initializeModelsFromDiffImpl(cellsDiffInfo);
			return;
		}
		const cellsDiffInfo: CellDiffInfo[] = [];
		try {
			this._isProcessingResponse.set(true, undefined);
			const notebookDiff = await this.notebookEditorWorkerService.computeDiff(this.originalURI, this.modifiedURI);
			if (id !== this.computeRequestId || this._store.isDisposed) {
				return;
			}
			const result = computeDiff(this.originalModel, this.modifiedModel, notebookDiff);
			if (result.cellDiffInfo.length) {
				cellsDiffInfo.push(...result.cellDiffInfo);
			}
		} catch (ex) {
			this.loggingService.error('Notebook Chat', 'Error computing diff:\n' + ex);
		} finally {
			this._isProcessingResponse.set(false, undefined);
		}
		this.initializeModelsFromDiffImpl(cellsDiffInfo);
	}
	updateCellDiffInfo(cellsDiffInfo: ICellDiffInfo[], transcation: ITransaction | undefined) {
		this._cellsDiffInfo.set(sortCellChanges(cellsDiffInfo), transcation);
		this._changesCount.set(countChanges(cellsDiffInfo), transcation);
	}

	mirrorNotebookEdits(e: NotebookTextModelChangedEvent) {
		if (this._isEditFromUs || this._isExternalEditInProgress || Array.from(this.cellEntryMap.values()).some(entry => entry.isEditFromUs)) {
			return;
		}

		// Possible user reverted the changes from SCM or the like.
		// Or user just reverted the changes made via edits (e.g. edit made a change in a cell and user undid that change either by typing over or other).
		// Computing snapshot is too slow, as this event gets triggered for every key stroke in a cell,
		// const didResetToOriginalContent = createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService) === this.initialContent;
		let didResetToOriginalContent = this.initialContentComparer.isEqual(this.modifiedModel);
		const currentState = this._stateObs.get();
		if (currentState === ModifiedFileEntryState.Modified && didResetToOriginalContent) {
			this._stateObs.set(ModifiedFileEntryState.Rejected, undefined);
			this.updateCellDiffInfo([], undefined);
			this.initializeModelsFromDiff();
			this._notifySessionAction('rejected');
			return;
		}

		if (!e.rawEvents.length) {
			return;
		}

		if (currentState === ModifiedFileEntryState.Rejected) {
			return;
		}

		if (isTransientIPyNbExtensionEvent(this.modifiedModel.notebookType, e)) {
			return;
		}

		this._allEditsAreFromUs = false;
		this._userEditScheduler.schedule();

		// Changes to cell text is sync'ed and handled separately.
		// See ChatEditingNotebookCellEntry._mirrorEdits
		for (const event of e.rawEvents.filter(event => event.kind !== NotebookCellsChangeType.ChangeCellContent)) {
			switch (event.kind) {
				case NotebookCellsChangeType.ChangeDocumentMetadata: {
					const edit: ICellEditOperation = {
						editType: CellEditType.DocumentMetadata,
						metadata: this.modifiedModel.metadata
					};
					this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
					break;
				}
				case NotebookCellsChangeType.ModelChange: {
					let cellDiffs = sortCellChanges(this._cellsDiffInfo.get());
					// Ensure the new notebook cells have internalIds
					this._applyEditsSync(() => {
						event.changes.forEach(change => {
							change[2].forEach((cell, i) => {
								if (cell.internalMetadata.internalId) {
									return;
								}
								const index = change[0] + i;
								const internalId = generateCellHash(cell.uri);
								const edits: ICellEditOperation[] = [{ editType: CellEditType.PartialInternalMetadata, index, internalMetadata: { internalId } }];
								this.modifiedModel.applyEdits(edits, true, undefined, () => undefined, undefined, false);
								cell.internalMetadata ??= {};
								cell.internalMetadata.internalId = internalId;
							});
						});
					});
					event.changes.forEach(change => {
						cellDiffs = adjustCellDiffAndOriginalModelBasedOnCellAddDelete(change,
							cellDiffs,
							this.modifiedModel.cells.length,
							this.originalModel.cells.length,
							this.originalModel.applyEdits.bind(this.originalModel),
							this.createModifiedCellDiffInfo.bind(this));
					});
					this.updateCellDiffInfo(cellDiffs, undefined);
					this.disposeDeletedCellEntries();
					break;
				}
				case NotebookCellsChangeType.ChangeCellLanguage: {
					const index = getCorrespondingOriginalCellIndex(event.index, this._cellsDiffInfo.get());
					if (typeof index === 'number') {
						const edit: ICellEditOperation = {
							editType: CellEditType.CellLanguage,
							index,
							language: event.language
						};
						this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
					}
					break;
				}
				case NotebookCellsChangeType.ChangeCellMetadata: {
					// ipynb and other extensions can alter metadata, ensure we update the original model in the corresponding cell.
					const index = getCorrespondingOriginalCellIndex(event.index, this._cellsDiffInfo.get());
					if (typeof index === 'number') {
						const edit: ICellEditOperation = {
							editType: CellEditType.Metadata,
							index,
							metadata: event.metadata
						};
						this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
					}
					break;
				}
				case NotebookCellsChangeType.ChangeCellMime:
					break;
				case NotebookCellsChangeType.ChangeCellInternalMetadata: {
					const index = getCorrespondingOriginalCellIndex(event.index, this._cellsDiffInfo.get());
					if (typeof index === 'number') {
						const edit: ICellEditOperation = {
							editType: CellEditType.PartialInternalMetadata,
							index,
							internalMetadata: event.internalMetadata
						};
						this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
					}
					break;
				}
				case NotebookCellsChangeType.Output: {
					// User can run cells.
					const index = getCorrespondingOriginalCellIndex(event.index, this._cellsDiffInfo.get());
					if (typeof index === 'number') {
						const edit: ICellEditOperation = {
							editType: CellEditType.Output,
							index,
							append: event.append,
							outputs: event.outputs
						};
						this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
					}
					break;
				}
				case NotebookCellsChangeType.OutputItem: {
					// outputs are shared between original and modified model, so the original model is already updated.
					break;
				}
				case NotebookCellsChangeType.Move: {
					const result = adjustCellDiffAndOriginalModelBasedOnCellMovements(event, this._cellsDiffInfo.get().slice());
					if (result) {
						this.originalModel.applyEdits(result[1], true, undefined, () => undefined, undefined, false);
						this._cellsDiffInfo.set(result[0], undefined);
					}
					break;
				}
				default: {
					break;
				}
			}
		}

		didResetToOriginalContent = this.initialContentComparer.isEqual(this.modifiedModel);
		if (currentState === ModifiedFileEntryState.Modified && didResetToOriginalContent) {
			this._stateObs.set(ModifiedFileEntryState.Rejected, undefined);
			this.updateCellDiffInfo([], undefined);
			this.initializeModelsFromDiff();
			return;
		}
	}

	protected override async _doAccept(): Promise<void> {
		this.updateCellDiffInfo([], undefined);
		const snapshot = createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService);
		restoreSnapshot(this.originalModel, snapshot);
		this.initializeModelsFromDiff();
		await this._collapse(undefined);

		const config = this._fileConfigService.getAutoSaveConfiguration(this.modifiedURI);
		if (this.modifiedModel.uri.scheme !== Schemas.untitled && (!config.autoSave || !this.notebookResolver.isDirty(this.modifiedURI))) {
			// SAVE after accept for manual-savers, for auto-savers
			// trigger explict save to get save participants going
			await this._applyEdits(async () => {
				try {
					await this.modifiedResourceRef.object.save({
						reason: SaveReason.EXPLICIT,
						force: true,
					});
				} catch {
					// ignored
				}
			});
		}
	}

	protected override async _doReject(): Promise<void> {
		this.updateCellDiffInfo([], undefined);
		if (this.createdInRequestId === this._telemetryInfo.requestId) {
			await this._applyEdits(async () => {
				await this.modifiedResourceRef.object.revert({ soft: true });
				await this._fileService.del(this.modifiedURI);
			});
			this._onDidDelete.fire();
		} else {
			await this._applyEdits(async () => {
				const snapshot = createSnapshot(this.originalModel, this.transientOptions, this.configurationService);
				this.restoreSnapshotInModifiedModel(snapshot);
				if (this._allEditsAreFromUs && Array.from(this.cellEntryMap.values()).every(entry => entry.allEditsAreFromUs)) {
					// save the file after discarding so that the dirty indicator goes away
					// and so that an intermediate saved state gets reverted
					await this.modifiedResourceRef.object.save({ reason: SaveReason.EXPLICIT, skipSaveParticipants: true });
				}
			});
			this.initializeModelsFromDiff();
			await this._collapse(undefined);
		}
	}

	private async _collapse(transaction: ITransaction | undefined): Promise<void> {
		this._multiDiffEntryDelegate.collapse(transaction);
	}

	protected override _createEditorIntegration(editor: IEditorPane): IModifiedFileEntryEditorIntegration {
		const notebookEditor = getNotebookEditorFromEditorPane(editor);
		if (!notebookEditor && editor.getId() === NotebookTextDiffEditor.ID) {
			const diffEditor = (editor.getControl() as INotebookTextDiffEditor);
			return this._instantiationService.createInstance(ChatEditingNotebookDiffEditorIntegration, diffEditor, this._cellsDiffInfo);
		}
		assertType(notebookEditor);
		return this._instantiationService.createInstance(ChatEditingNotebookEditorIntegration, this, editor, this.modifiedModel, this.originalModel, this._cellsDiffInfo);
	}

	protected override _resetEditsState(tx: ITransaction): void {
		super._resetEditsState(tx);
		this.cellEntryMap.forEach(entry => !entry.isDisposed && entry.clearCurrentEditLineDecoration());
	}

	protected override _createUndoRedoElement(response: IChatResponseModel): IUndoRedoElement | undefined {
		const request = response.session.getRequests().find(req => req.id === response.requestId);
		const label = request?.message.text ? localize('chatNotebookEdit1', "Chat Edit: '{0}'", request.message.text) : localize('chatNotebookEdit2', "Chat Edit");
		const transientOptions = this.transientOptions;
		const outputSizeLimit = this.configurationService.getValue<number>(NotebookSetting.outputBackupSizeLimit) * 1024;

		// create a snapshot of the current state of the model, before the next set of edits
		let initial = createSnapshot(this.modifiedModel, transientOptions, outputSizeLimit);
		let last = '';
		let redoState = ModifiedFileEntryState.Rejected;

		return {
			type: UndoRedoElementType.Resource,
			resource: this.modifiedURI,
			label,
			code: 'chat.edit',
			confirmBeforeUndo: false,
			undo: async () => {
				last = createSnapshot(this.modifiedModel, transientOptions, outputSizeLimit);
				this._isEditFromUs = true;
				try {
					restoreSnapshot(this.modifiedModel, initial);
					restoreSnapshot(this.originalModel, initial);
				} finally {
					this._isEditFromUs = false;
				}
				redoState = this._stateObs.get() === ModifiedFileEntryState.Accepted ? ModifiedFileEntryState.Accepted : ModifiedFileEntryState.Rejected;
				this._stateObs.set(ModifiedFileEntryState.Rejected, undefined);
				this.updateCellDiffInfo([], undefined);
				this.initializeModelsFromDiff();
				this._notifySessionAction('userModified');
			},
			redo: async () => {
				initial = createSnapshot(this.modifiedModel, transientOptions, outputSizeLimit);
				this._isEditFromUs = true;
				try {
					restoreSnapshot(this.modifiedModel, last);
					restoreSnapshot(this.originalModel, last);
				} finally {
					this._isEditFromUs = false;
				}
				this._stateObs.set(redoState, undefined);
				this.updateCellDiffInfo([], undefined);
				this.initializeModelsFromDiff();
				this._notifySessionAction('userModified');
			}
		};
	}

	protected override async _areOriginalAndModifiedIdentical(): Promise<boolean> {
		return this._areOriginalAndModifiedIdenticalImpl();
	}

	private _areOriginalAndModifiedIdenticalImpl(): boolean {
		const snapshot = createSnapshot(this.originalModel, this.transientOptions, this.configurationService);
		return new SnapshotComparer(snapshot).isEqual(this.modifiedModel);
	}

	private newNotebookEditGenerator?: ChatEditingNewNotebookContentEdits;
	override async acceptAgentEdits(resource: URI, edits: (TextEdit | ICellEditOperation)[], isLastEdits: boolean, responseModel: IChatResponseModel | undefined): Promise<void> {
		const isCellUri = resource.scheme === Schemas.vscodeNotebookCell;
		const cell = isCellUri && this.modifiedModel.cells.find(cell => isEqual(cell.uri, resource));
		let cellEntry: ChatEditingNotebookCellEntry | undefined;
		if (cell) {
			const index = this.modifiedModel.cells.indexOf(cell);
			const entry = this._cellsDiffInfo.get().slice().find(entry => entry.modifiedCellIndex === index);
			if (!entry) {
				// Not possible.
				console.error('Original cell model not found');
				return;
			}

			cellEntry = this.getOrCreateModifiedTextFileEntryForCell(cell, await entry.modifiedModel.promise, await entry.originalModel.promise);
		}

		// For all cells that were edited, send the `isLastEdits` flag.
		const finishPreviousCells = async () => {
			await Promise.all(Array.from(this.editedCells).map(async (uri) => {
				const cell = this.modifiedModel.cells.find(cell => isEqual(cell.uri, uri));
				const cellEntry = cell && this.cellEntryMap.get(cell.uri);
				await cellEntry?.acceptAgentEdits([], true, responseModel);
			}));
			this.editedCells.clear();
		};

		await this._applyEdits(async () => {
			await Promise.all(edits.map(async (edit, idx) => {
				const last = isLastEdits && idx === edits.length - 1;
				if (TextEdit.isTextEdit(edit)) {
					// Possible we're getting the raw content for the notebook.
					if (isEqual(resource, this.modifiedModel.uri)) {
						this.newNotebookEditGenerator ??= this._instantiationService.createInstance(ChatEditingNewNotebookContentEdits, this.modifiedModel);
						this.newNotebookEditGenerator.acceptTextEdits([edit]);
					} else {
						// If we get cell edits, its impossible to get text edits for the notebook uri.
						this.newNotebookEditGenerator = undefined;
						if (!this.editedCells.has(resource)) {
							await finishPreviousCells();
							this.editedCells.add(resource);
						}
						await cellEntry?.acceptAgentEdits([edit], last, responseModel);
					}
				} else {
					// If we notebook edits, its impossible to get text edits for the notebook uri.
					this.newNotebookEditGenerator = undefined;
					this.acceptNotebookEdit(edit);
				}
			}));
		});

		// If the last edit for a cell was sent, then handle it
		if (isLastEdits) {
			await finishPreviousCells();
		}

		// isLastEdits can be true for cell Uris, but when its true for Cells edits.
		// It cannot be true for the notebook itself.
		isLastEdits = !isCellUri && isLastEdits;

		// If this is the last edit and & we got regular text edits for generating new notebook content
		// Then generate notebook edits from those text edits & apply those notebook edits.
		if (isLastEdits && this.newNotebookEditGenerator) {
			const notebookEdits = await this.newNotebookEditGenerator.generateEdits();
			this.newNotebookEditGenerator = undefined;
			notebookEdits.forEach(edit => this.acceptNotebookEdit(edit));
		}

		transaction((tx) => {
			this._stateObs.set(ModifiedFileEntryState.Modified, tx);
			if (!isLastEdits) {
				const newRewriteRation = Math.max(this._rewriteRatioObs.get(), calculateNotebookRewriteRatio(this._cellsDiffInfo.get(), this.originalModel, this.modifiedModel));
				this._rewriteRatioObs.set(Math.min(1, newRewriteRation), tx);
			} else {
				this.editedCells.clear();
				this._resetEditsState(tx);
				this._rewriteRatioObs.set(1, tx);
			}
		});
	}

	private disposeDeletedCellEntries() {
		const cellsUris = new ResourceSet(this.modifiedModel.cells.map(cell => cell.uri));
		Array.from(this.cellEntryMap.keys()).forEach(uri => {
			if (cellsUris.has(uri)) {
				return;
			}
			this.cellEntryMap.get(uri)?.dispose();
			this.cellEntryMap.delete(uri);
		});
	}

	acceptNotebookEdit(edit: ICellEditOperation): void {
		// make the actual edit
		this.modifiedModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
		this.disposeDeletedCellEntries();


		if (edit.editType !== CellEditType.Replace) {
			return;
		}
		// Ensure cells have internal Ids.
		edit.cells.forEach((_, i) => {
			const index = edit.index + i;
			const cell = this.modifiedModel.cells[index];
			if (cell.internalMetadata.internalId) {
				return;
			}
			const internalId = generateCellHash(cell.uri);
			const edits: ICellEditOperation[] = [{ editType: CellEditType.PartialInternalMetadata, index, internalMetadata: { internalId } }];
			this.modifiedModel.applyEdits(edits, true, undefined, () => undefined, undefined, false);
		});

		let diff: ICellDiffInfo[] = [];
		if (edit.count === 0) {
			// All existing indexes are shifted by number of cells added.
			diff = sortCellChanges(this._cellsDiffInfo.get());
			diff.forEach(d => {
				if (d.type !== 'delete' && d.modifiedCellIndex >= edit.index) {
					d.modifiedCellIndex += edit.cells.length;
				}
			});
			const diffInsert = edit.cells.map((_, i) => this.createInsertedCellDiffInfo(edit.index + i));
			diff.splice(edit.index, 0, ...diffInsert);
		} else {
			// All existing indexes are shifted by number of cells removed.
			// And unchanged cells should be converted to deleted cells.
			diff = sortCellChanges(this._cellsDiffInfo.get()).map((d) => {
				if (d.type === 'unchanged' && d.modifiedCellIndex >= edit.index && d.modifiedCellIndex <= (edit.index + edit.count - 1)) {
					return this.createDeleteCellDiffInfo(d.originalCellIndex);
				}
				if (d.type !== 'delete' && d.modifiedCellIndex >= (edit.index + edit.count)) {
					d.modifiedCellIndex -= edit.count;
					return d;
				}
				return d;
			});
		}
		this.updateCellDiffInfo(diff, undefined);
	}

	private computeStateAfterAcceptingRejectingChanges(accepted: boolean) {
		const currentSnapshot = createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService);
		if (new SnapshotComparer(currentSnapshot).isEqual(this.originalModel)) {
			const state = accepted ? ModifiedFileEntryState.Accepted : ModifiedFileEntryState.Rejected;
			this._stateObs.set(state, undefined);
			this._notifySessionAction(accepted ? 'accepted' : 'rejected');
		}
	}

	createModifiedCellDiffInfo(modifiedCellIndex: number, originalCellIndex: number): ICellDiffInfo {
		const modifiedCell = this.modifiedModel.cells[modifiedCellIndex];
		const originalCell = this.originalModel.cells[originalCellIndex];
		this.modifiedToOriginalCell.set(modifiedCell.uri, originalCell.uri);
		const modifiedCellModelPromise = this.resolveCellModel(modifiedCell.uri);
		const originalCellModelPromise = this.resolveCellModel(originalCell.uri);

		Promise.all([modifiedCellModelPromise, originalCellModelPromise]).then(([modifiedCellModel, originalCellModel]) => {
			this.getOrCreateModifiedTextFileEntryForCell(modifiedCell, modifiedCellModel, originalCellModel);
		});

		const diff = observableValue('diff', nullDocumentDiff);
		const unchangedCell: ICellDiffInfo = {
			type: 'unchanged',
			modifiedCellIndex,
			originalCellIndex,
			keep: async (changes: DetailedLineRangeMapping) => {
				const [modifiedCellModel, originalCellModel] = await Promise.all([modifiedCellModelPromise, originalCellModelPromise]);
				const entry = this.getOrCreateModifiedTextFileEntryForCell(modifiedCell, modifiedCellModel, originalCellModel);
				return entry ? entry.keep(changes) : false;
			},
			undo: async (changes: DetailedLineRangeMapping) => {
				const [modifiedCellModel, originalCellModel] = await Promise.all([modifiedCellModelPromise, originalCellModelPromise]);
				const entry = this.getOrCreateModifiedTextFileEntryForCell(modifiedCell, modifiedCellModel, originalCellModel);
				return entry ? entry.undo(changes) : false;
			},
			modifiedModel: new ObservablePromise(modifiedCellModelPromise),
			originalModel: new ObservablePromise(originalCellModelPromise),
			diff
		};

		return unchangedCell;

	}
	createInsertedCellDiffInfo(modifiedCellIndex: number): ICellDiffInfo {
		const cell = this.modifiedModel.cells[modifiedCellIndex];
		const lines = cell.getValue().split(/\r?\n/);
		const originalRange = new Range(1, 0, 1, 0);
		const modifiedRange = new Range(1, 0, lines.length, lines[lines.length - 1].length);
		const innerChanges = new RangeMapping(originalRange, modifiedRange);
		const changes = [new DetailedLineRangeMapping(new LineRange(1, 1), new LineRange(1, lines.length), [innerChanges])];
		// When a new cell is inserted, we use the ChatEditingCodeEditorIntegration to handle the edits.
		// & to also display undo/redo and decorations.
		// However that needs a modified and original model.
		// For inserted cells there's no original model, so we create a new empty text model and pass that as the original.
		const originalModelUri = this.modifiedModel.uri.with({ query: (ChatEditingModifiedNotebookEntry.NewModelCounter++).toString(), scheme: 'emptyCell' });
		const originalModel = this.modelService.getModel(originalModelUri) || this._register(this.modelService.createModel('', null, originalModelUri));
		this.modifiedToOriginalCell.set(cell.uri, originalModelUri);
		const keep = async () => {
			this._applyEditsSync(() => this.keepPreviouslyInsertedCell(cell));
			this.computeStateAfterAcceptingRejectingChanges(true);
			return true;
		};
		const undo = async () => {
			this._applyEditsSync(() => this.undoPreviouslyInsertedCell(cell));
			this.computeStateAfterAcceptingRejectingChanges(false);
			return true;
		};
		this.resolveCellModel(cell.uri).then(modifiedModel => {
			if (this._store.isDisposed) {
				return;
			}
			// We want decorators for the cell just as we display decorators for modified cells.
			// This way we have the ability to accept/reject the entire cell.
			this.getOrCreateModifiedTextFileEntryForCell(cell, modifiedModel, originalModel);
		});
		return {
			type: 'insert' as const,
			originalCellIndex: undefined,
			modifiedCellIndex: modifiedCellIndex,
			keep,
			undo,
			modifiedModel: new ObservablePromise(this.resolveCellModel(cell.uri)),
			originalModel: new ObservablePromise(Promise.resolve(originalModel)),
			diff: observableValue('deletedCellDiff', {
				changes,
				identical: false,
				moves: [],
				quitEarly: false,
			})
		} satisfies ICellDiffInfo;
	}
	createDeleteCellDiffInfo(originalCellIndex: number): ICellDiffInfo {
		const originalCell = this.originalModel.cells[originalCellIndex];
		const lines = new Array(originalCell.textBuffer.getLineCount()).fill(0).map((_, i) => originalCell.textBuffer.getLineContent(i + 1));
		const originalRange = new Range(1, 0, lines.length, lines[lines.length - 1].length);
		const modifiedRange = new Range(1, 0, 1, 0);
		const innerChanges = new RangeMapping(modifiedRange, originalRange);
		const changes = [new DetailedLineRangeMapping(new LineRange(1, lines.length), new LineRange(1, 1), [innerChanges])];
		const modifiedModelUri = this.modifiedModel.uri.with({ query: (ChatEditingModifiedNotebookEntry.NewModelCounter++).toString(), scheme: 'emptyCell' });
		const modifiedModel = this.modelService.getModel(modifiedModelUri) || this._register(this.modelService.createModel('', null, modifiedModelUri));
		const keep = async () => {
			this._applyEditsSync(() => this.keepPreviouslyDeletedCell(this.originalModel.cells.indexOf(originalCell)));
			this.computeStateAfterAcceptingRejectingChanges(true);
			return true;
		};
		const undo = async () => {
			this._applyEditsSync(() => this.undoPreviouslyDeletedCell(this.originalModel.cells.indexOf(originalCell), originalCell));
			this.computeStateAfterAcceptingRejectingChanges(false);
			return true;
		};

		// This will be deleted.
		return {
			type: 'delete' as const,
			modifiedCellIndex: undefined,
			originalCellIndex,
			originalModel: new ObservablePromise(this.resolveCellModel(originalCell.uri)),
			modifiedModel: new ObservablePromise(Promise.resolve(modifiedModel)),
			keep,
			undo,
			diff: observableValue('cellDiff', {
				changes,
				identical: false,
				moves: [],
				quitEarly: false,
			})
		} satisfies ICellDiffInfo;
	}

	private undoPreviouslyInsertedCell(cell: NotebookCellTextModel) {
		let diffs: ICellDiffInfo[] = [];
		this._applyEditsSync(() => {
			const index = this.modifiedModel.cells.indexOf(cell);
			diffs = adjustCellDiffForRevertingAnInsertedCell(index,
				this._cellsDiffInfo.get(),
				this.modifiedModel.applyEdits.bind(this.modifiedModel));
		});
		this.disposeDeletedCellEntries();
		this.updateCellDiffInfo(diffs, undefined);
	}

	private keepPreviouslyInsertedCell(cell: NotebookCellTextModel) {
		const modifiedCellIndex = this.modifiedModel.cells.indexOf(cell);
		if (modifiedCellIndex === -1) {
			// Not possible.
			return;
		}
		const cellToInsert: ICellDto2 = {
			cellKind: cell.cellKind,
			language: cell.language,
			metadata: cell.metadata,
			outputs: cell.outputs,
			source: cell.getValue(),
			mime: cell.mime,
			internalMetadata: {
				internalId: cell.internalMetadata.internalId
			}
		};
		this.cellEntryMap.get(cell.uri)?.dispose();
		this.cellEntryMap.delete(cell.uri);
		const cellDiffs = adjustCellDiffForKeepingAnInsertedCell(
			modifiedCellIndex,
			this._cellsDiffInfo.get().slice(),
			cellToInsert,
			this.originalModel.applyEdits.bind(this.originalModel),
			this.createModifiedCellDiffInfo.bind(this)
		);
		this.updateCellDiffInfo(cellDiffs, undefined);
	}

	private undoPreviouslyDeletedCell(deletedOriginalIndex: number, originalCell: NotebookCellTextModel) {
		const cellToInsert: ICellDto2 = {
			cellKind: originalCell.cellKind,
			language: originalCell.language,
			metadata: originalCell.metadata,
			outputs: originalCell.outputs,
			source: originalCell.getValue(),
			mime: originalCell.mime,
			internalMetadata: {
				internalId: originalCell.internalMetadata.internalId
			}
		};
		let cellDiffs: ICellDiffInfo[] = [];
		this._applyEditsSync(() => {
			cellDiffs = adjustCellDiffForRevertingADeletedCell(
				deletedOriginalIndex,
				this._cellsDiffInfo.get(),
				cellToInsert,
				this.modifiedModel.applyEdits.bind(this.modifiedModel),
				this.createModifiedCellDiffInfo.bind(this)
			);
		});
		this.updateCellDiffInfo(cellDiffs, undefined);
	}


	private keepPreviouslyDeletedCell(deletedOriginalIndex: number) {
		// Delete this cell from original as well.
		const edit: ICellReplaceEdit = { cells: [], count: 1, editType: CellEditType.Replace, index: deletedOriginalIndex, };
		this.originalModel.applyEdits([edit], true, undefined, () => undefined, undefined, false);
		const diffs = sortCellChanges(this._cellsDiffInfo.get())
			.filter(d => !(d.type === 'delete' && d.originalCellIndex === deletedOriginalIndex))
			.map(diff => {
				if (diff.type !== 'insert' && diff.originalCellIndex > deletedOriginalIndex) {
					return {
						...diff,
						originalCellIndex: diff.originalCellIndex - 1,
					};
				}
				return diff;
			});
		this.updateCellDiffInfo(diffs, undefined);
	}

	private async _applyEdits(operation: () => Promise<void>) {
		// make the actual edit
		this._isEditFromUs = true;
		try {
			await operation();
		} finally {
			this._isEditFromUs = false;
		}
	}

	private _applyEditsSync(operation: () => void) {
		// make the actual edit
		this._isEditFromUs = true;
		try {
			operation();
		} finally {
			this._isEditFromUs = false;
		}
	}

	public getCurrentSnapshot() {
		return createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService);
	}

	override createSnapshot(chatSessionResource: URI, requestId: string | undefined, undoStop: string | undefined): ISnapshotEntry {
		return {
			resource: this.modifiedURI,
			languageId: SnapshotLanguageId,
			snapshotUri: getNotebookSnapshotFileURI(chatSessionResource, requestId, undoStop, this.modifiedURI.path, this.modifiedModel.viewType),
			original: createSnapshot(this.originalModel, this.transientOptions, this.configurationService),
			current: createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService),
			state: this.state.get(),
			telemetryInfo: this.telemetryInfo,
		};
	}

	override equalsSnapshot(snapshot: ISnapshotEntry | undefined): boolean {
		return !!snapshot &&
			isEqual(this.modifiedURI, snapshot.resource) &&
			this.state.get() === snapshot.state &&
			new SnapshotComparer(snapshot.original).isEqual(this.originalModel) &&
			new SnapshotComparer(snapshot.current).isEqual(this.modifiedModel);

	}

	override async restoreFromSnapshot(snapshot: ISnapshotEntry, restoreToDisk = true): Promise<void> {
		this.updateCellDiffInfo([], undefined);
		this._stateObs.set(snapshot.state, undefined);
		restoreSnapshot(this.originalModel, snapshot.original);
		if (restoreToDisk) {
			this.restoreSnapshotInModifiedModel(snapshot.current);
		}
		this.initializeModelsFromDiff();
	}

	override async resetToInitialContent(): Promise<void> {
		this.updateCellDiffInfo([], undefined);
		this.restoreSnapshotInModifiedModel(this.initialContent);
		this.initializeModelsFromDiff();
	}

	public restoreModifiedModelFromSnapshot(snapshot: string) {
		this.restoreSnapshotInModifiedModel(snapshot);
		return this.initializeModelsFromDiff();
	}

	private restoreSnapshotInModifiedModel(snapshot: string) {
		if (snapshot === createSnapshot(this.modifiedModel, this.transientOptions, this.configurationService)) {
			return;
		}

		this._applyEditsSync(() => {
			// See private _setDocValue in chatEditingModifiedDocumentEntry.ts
			this.modifiedModel.pushStackElement();
			restoreSnapshot(this.modifiedModel, snapshot);
			this.modifiedModel.pushStackElement();
		});
	}

	private readonly cellTextModelMap = new ResourceMap<ITextModel>();

	private async resolveCellModel(cellURI: URI): Promise<ITextModel> {
		const cell = this.originalModel.cells.concat(this.modifiedModel.cells).find(cell => isEqual(cell.uri, cellURI));
		if (!cell) {
			throw new Error('Cell not found');
		}
		const model = this.cellTextModelMap.get(cell.uri);
		if (model) {
			this.cellTextModelMap.set(cell.uri, model);
			return model;
		} else {
			const textEditorModel = await thenRegisterOrDispose(this.textModelService.createModelReference(cell.uri), this._store);
			const model = textEditorModel.object.textEditorModel;
			this.cellTextModelMap.set(cell.uri, model);
			return model;
		}
	}

	getOrCreateModifiedTextFileEntryForCell(cell: NotebookCellTextModel, modifiedCellModel: ITextModel, originalCellModel: ITextModel): ChatEditingNotebookCellEntry | undefined {
		let cellEntry = this.cellEntryMap.get(cell.uri);
		if (cellEntry) {
			return cellEntry;
		}
		if (this._store.isDisposed) {
			return;
		}
		const disposables = new DisposableStore();
		cellEntry = this._register(this._instantiationService.createInstance(ChatEditingNotebookCellEntry, this.modifiedResourceRef.object.resource, cell, modifiedCellModel, originalCellModel, () => this._isExternalEditInProgress, disposables));
		this.cellEntryMap.set(cell.uri, cellEntry);
		disposables.add(autorun(r => {
			if (this.modifiedModel.cells.indexOf(cell) === -1) {
				return;
			}
			const diffs = this.cellsDiffInfo.read(undefined).slice();
			const index = this.modifiedModel.cells.indexOf(cell);
			let entry = diffs.find(entry => entry.modifiedCellIndex === index);
			if (!entry) {
				// Not possible.
				return;
			}
			const entryIndex = diffs.indexOf(entry);
			entry.diff.set(cellEntry.diffInfo.read(r), undefined);
			if (cellEntry.diffInfo.read(undefined).identical && entry.type === 'modified') {
				entry = {
					...entry,
					type: 'unchanged',
				};
			}
			if (!cellEntry.diffInfo.read(undefined).identical && entry.type === 'unchanged') {
				entry = {
					...entry,
					type: 'modified',
				};
			}
			diffs.splice(entryIndex, 1, { ...entry });

			transaction(tx => {
				this.updateCellDiffInfo(diffs, tx);
			});
		}));

		disposables.add(autorun(r => {
			if (this.modifiedModel.cells.indexOf(cell) === -1) {
				return;
			}

			const cellState = cellEntry.state.read(r);
			if (cellState === ModifiedFileEntryState.Accepted) {
				this.computeStateAfterAcceptingRejectingChanges(true);
			} else if (cellState === ModifiedFileEntryState.Rejected) {
				this.computeStateAfterAcceptingRejectingChanges(false);
			}
		}));

		return cellEntry;
	}

	async computeEditsFromSnapshots(beforeSnapshot: string, afterSnapshot: string): Promise<(TextEdit | ICellEditOperation)[]> {
		// For notebooks, we restore the snapshot and compute the cell-level edits
		// This is a simplified approach that replaces cells as needed

		const beforeData = deserializeSnapshot(beforeSnapshot);
		const afterData = deserializeSnapshot(afterSnapshot);

		const edits: ICellEditOperation[] = [];

		// Simple approach: replace all cells
		// A more sophisticated approach would diff individual cells
		if (beforeData.data.cells.length > 0) {
			edits.push({
				editType: CellEditType.Replace,
				index: 0,
				count: beforeData.data.cells.length,
				cells: afterData.data.cells
			});
		} else if (afterData.data.cells.length > 0) {
			edits.push({
				editType: CellEditType.Replace,
				index: 0,
				count: 0,
				cells: afterData.data.cells
			});
		}

		return edits;
	}

	async save(): Promise<void> {
		if (this.modifiedModel.uri.scheme === Schemas.untitled) {
			return;
		}

		// Save the notebook if dirty
		if (this.notebookResolver.isDirty(this.modifiedModel.uri)) {
			await this.modifiedResourceRef.object.save({
				reason: SaveReason.EXPLICIT,
				skipSaveParticipants: true
			});
		}
	}

	async revertToDisk(): Promise<void> {
		if (this.modifiedModel.uri.scheme === Schemas.untitled) {
			return;
		}

		// Revert to reload from disk
		await this.modifiedResourceRef.object.revert({ soft: false });
	}
}


function generateCellHash(cellUri: URI) {
	const hash = new StringSHA1();
	hash.update(cellUri.toString());
	return hash.digest().substring(0, 8);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingOperations.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StringSHA1 } from '../../../../../base/common/hash.js';
import { URI } from '../../../../../base/common/uri.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { IModifiedEntryTelemetryInfo } from '../../common/chatEditingService.js';
import { LocalChatSessionUri } from '../../common/chatUri.js';

export enum FileOperationType {
	Create = 'create',
	Delete = 'delete',
	Rename = 'rename',
	TextEdit = 'textEdit',
	NotebookEdit = 'notebookEdit'
}

/**
 * Base interface for all file operations in the checkpoint timeline
 */
export interface IFileOperation {
	readonly type: FileOperationType;
	readonly uri: URI;
	readonly requestId: string;
	readonly epoch: number;
}

/**
 * Operation representing the creation of a new file
 */
export interface IFileCreateOperation extends IFileOperation {
	readonly type: FileOperationType.Create;
	readonly initialContent: string;
	readonly notebookViewType?: string;
	readonly telemetryInfo: IModifiedEntryTelemetryInfo;
}

/**
 * Operation representing the deletion of a file
 */
export interface IFileDeleteOperation extends IFileOperation {
	readonly type: FileOperationType.Delete;
	readonly finalContent: string; // content before deletion for potential restoration
}

/**
 * Operation representing the renaming/moving of a file
 */
export interface IFileRenameOperation extends IFileOperation {
	readonly type: FileOperationType.Rename;
	readonly oldUri: URI;
	readonly newUri: URI;
}

/**
 * Operation representing text edits applied to a file
 */
export interface ITextEditOperation extends IFileOperation {
	readonly type: FileOperationType.TextEdit;
	readonly edits: readonly TextEdit[];
	/**
	 * For cell URIs, the cell index that was edited. Needed because the original
	 * edit URI only contains the `handle` which is not portable between notebooks.
	 */
	readonly cellIndex?: number;
}

/**
 * Operation representing notebook cell edits applied to a notebook
 */
export interface INotebookEditOperation extends IFileOperation {
	readonly type: FileOperationType.NotebookEdit;
	readonly cellEdits: readonly ICellEditOperation[];
}

/**
 * Union type of all possible file operations
 */
export type FileOperation = IFileCreateOperation | IFileDeleteOperation | IFileRenameOperation | ITextEditOperation | INotebookEditOperation;

/**
 * File baseline represents the initial state of a file when first edited in a request
 */
export interface IFileBaseline {
	readonly uri: URI;
	readonly requestId: string;
	readonly content: string;
	readonly epoch: number;
	readonly telemetryInfo: IModifiedEntryTelemetryInfo;
	readonly notebookViewType?: string;
}

export interface IReconstructedFileExistsState {
	readonly exists: true;
	readonly content: string;
	readonly uri: URI;
	readonly telemetryInfo: IModifiedEntryTelemetryInfo;
	readonly notebookViewType?: string;
}

export interface IReconstructedFileNotExistsState {
	readonly exists: false;
	readonly uri: URI;
}

/**
 * The reconstructed state of a file at a specific checkpoint
 */
export type IReconstructedFileState = IReconstructedFileNotExistsState | IReconstructedFileExistsState;

/**
 * Checkpoint represents a stable state that can be navigated to
 */
export interface ICheckpoint {
	readonly checkpointId: string;
	readonly requestId: string | undefined; // undefined for initial state
	readonly undoStopId: string | undefined;
	readonly epoch: number;
	readonly label: string; // for UI display
	readonly description?: string; // optional detailed description
}

/**
 * State that can be persisted and restored for the checkpoint timeline
 */
export interface IChatEditingTimelineState {
	readonly checkpoints: readonly ICheckpoint[];
	readonly fileBaselines: [string, IFileBaseline][]; // key: `${uri}::${requestId}`
	readonly operations: readonly FileOperation[];
	readonly currentEpoch: number;
	readonly epochCounter: number;
}

export function getKeyForChatSessionResource(chatSessionResource: URI) {
	const sessionId = LocalChatSessionUri.parseLocalSessionId(chatSessionResource);
	if (sessionId) {
		return sessionId;
	}

	const sha = new StringSHA1();
	sha.update(chatSessionResource.toString());
	return sha.digest();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce, compareBy, delta } from '../../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { groupBy } from '../../../../../base/common/collections.js';
import { ErrorNoTelemetry } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../../base/common/linkedList.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { derived, IObservable, observableValueOpts, runOnChange, ValueWithChangeEventFromObservable } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { compare } from '../../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IDecorationData, IDecorationsProvider, IDecorationsService } from '../../../../services/decorations/common/decorations.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IMultiDiffSourceResolver, IMultiDiffSourceResolverService, IResolvedMultiDiffSource, MultiDiffEditorItem } from '../../../multiDiffEditor/browser/multiDiffSourceResolverService.js';
import { CellUri, ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME, chatEditingAgentSupportsReadonlyReferencesContextKey, chatEditingResourceContextKey, ChatEditingSessionState, IChatEditingService, IChatEditingSession, IChatRelatedFile, IChatRelatedFilesProvider, IModifiedFileEntry, inChatEditingSessionContextKey, IStreamingEdits, ModifiedFileEntryState, parseChatMultiDiffUri } from '../../common/chatEditingService.js';
import { ChatModel, ICellTextEditOperation, IChatResponseModel, isCellTextEditOperationArray } from '../../common/chatModel.js';
import { IChatService } from '../../common/chatService.js';
import { ChatEditorInput } from '../chatEditorInput.js';
import { AbstractChatEditingModifiedFileEntry } from './chatEditingModifiedFileEntry.js';
import { ChatEditingSession } from './chatEditingSession.js';
import { ChatEditingSnapshotTextModelContentProvider, ChatEditingTextModelContentProvider } from './chatEditingTextModelContentProviders.js';

export class ChatEditingService extends Disposable implements IChatEditingService {

	_serviceBrand: undefined;


	private readonly _sessionsObs = observableValueOpts<LinkedList<ChatEditingSession>>({ equalsFn: (a, b) => false }, new LinkedList());

	readonly editingSessionsObs: IObservable<readonly IChatEditingSession[]> = derived(r => {
		const result = Array.from(this._sessionsObs.read(r));
		return result;
	});

	private _chatRelatedFilesProviders = new Map<number, IChatRelatedFilesProvider>();

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IMultiDiffSourceResolverService multiDiffSourceResolverService: IMultiDiffSourceResolverService,
		@ITextModelService textModelService: ITextModelService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IChatService private readonly _chatService: IChatService,
		@IEditorService private readonly _editorService: IEditorService,
		@IDecorationsService decorationsService: IDecorationsService,
		@IFileService private readonly _fileService: IFileService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
		@IExtensionService extensionService: IExtensionService,
		@IProductService productService: IProductService,
		@INotebookService private readonly notebookService: INotebookService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();
		this._register(decorationsService.registerDecorationsProvider(_instantiationService.createInstance(ChatDecorationsProvider, this.editingSessionsObs)));
		this._register(multiDiffSourceResolverService.registerResolver(_instantiationService.createInstance(ChatEditingMultiDiffSourceResolver, this.editingSessionsObs)));

		// TODO@jrieken
		// some ugly casting so that this service can pass itself as argument instad as service dependeny
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		this._register(textModelService.registerTextModelContentProvider(ChatEditingTextModelContentProvider.scheme, _instantiationService.createInstance(ChatEditingTextModelContentProvider as any, this)));
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		this._register(textModelService.registerTextModelContentProvider(Schemas.chatEditingSnapshotScheme, _instantiationService.createInstance(ChatEditingSnapshotTextModelContentProvider as any, this)));

		this._register(this._chatService.onDidDisposeSession((e) => {
			if (e.reason === 'cleared') {
				for (const resource of e.sessionResource) {
					this.getEditingSession(resource)?.stop();
				}
			}
		}));

		// todo@connor4312: temporary until chatReadonlyPromptReference proposal is finalized
		const readonlyEnabledContextKey = chatEditingAgentSupportsReadonlyReferencesContextKey.bindTo(contextKeyService);
		const setReadonlyFilesEnabled = () => {
			const enabled = productService.quality !== 'stable' && extensionService.extensions.some(e => e.enabledApiProposals?.includes('chatReadonlyPromptReference'));
			readonlyEnabledContextKey.set(enabled);
		};
		setReadonlyFilesEnabled();
		this._register(extensionService.onDidRegisterExtensions(setReadonlyFilesEnabled));
		this._register(extensionService.onDidChangeExtensions(setReadonlyFilesEnabled));


		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let storageTask: Promise<any> | undefined;

		this._register(storageService.onWillSaveState(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const tasks: Promise<any>[] = [];

			for (const session of this.editingSessionsObs.get()) {
				if (!session.isGlobalEditingSession) {
					continue;
				}
				tasks.push((session as ChatEditingSession).storeState());
			}

			storageTask = Promise.resolve(storageTask)
				.then(() => Promise.all(tasks))
				.finally(() => storageTask = undefined);
		}));

		this._register(this.lifecycleService.onWillShutdown(e => {
			if (!storageTask) {
				return;
			}
			e.join(storageTask, {
				id: 'join.chatEditingSession',
				label: localize('join.chatEditingSession', "Saving chat edits history")
			});
		}));
	}

	override dispose(): void {
		dispose(this._sessionsObs.get());
		super.dispose();
	}

	startOrContinueGlobalEditingSession(chatModel: ChatModel): IChatEditingSession {
		return this.getEditingSession(chatModel.sessionResource) || this.createEditingSession(chatModel, true);
	}

	private _lookupEntry(uri: URI): AbstractChatEditingModifiedFileEntry | undefined {

		for (const item of Iterable.concat(this.editingSessionsObs.get())) {
			const candidate = item.getEntry(uri);
			if (candidate instanceof AbstractChatEditingModifiedFileEntry) {
				// make sure to ref-count this object
				return candidate.acquire();
			}
		}
		return undefined;
	}

	getEditingSession(chatSessionResource: URI): IChatEditingSession | undefined {
		return this.editingSessionsObs.get()
			.find(candidate => isEqual(candidate.chatSessionResource, chatSessionResource));
	}

	createEditingSession(chatModel: ChatModel, global: boolean = false): IChatEditingSession {
		return this._createEditingSession(chatModel, global, undefined);
	}

	transferEditingSession(chatModel: ChatModel, session: IChatEditingSession): IChatEditingSession {
		return this._createEditingSession(chatModel, session.isGlobalEditingSession, session);
	}

	private _createEditingSession(chatModel: ChatModel, global: boolean, initFrom: IChatEditingSession | undefined): IChatEditingSession {

		assertType(this.getEditingSession(chatModel.sessionResource) === undefined, 'CANNOT have more than one editing session per chat session');

		const session = this._instantiationService.createInstance(ChatEditingSession, chatModel.sessionResource, global, this._lookupEntry.bind(this), initFrom);

		const list = this._sessionsObs.get();
		const removeSession = list.unshift(session);

		const store = new DisposableStore();
		this._store.add(store);

		store.add(this.installAutoApplyObserver(session, chatModel));

		store.add(session.onDidDispose(e => {
			removeSession();
			this._sessionsObs.set(list, undefined);
			this._store.delete(store);
		}));

		this._sessionsObs.set(list, undefined);

		return session;
	}

	private installAutoApplyObserver(session: ChatEditingSession, chatModel: ChatModel): IDisposable {
		if (!chatModel) {
			throw new ErrorNoTelemetry(`Edit session was created for a non-existing chat session: ${session.chatSessionResource}`);
		}

		const observerDisposables = new DisposableStore();

		observerDisposables.add(chatModel.onDidChange(async e => {
			if (e.kind !== 'addRequest') {
				return;
			}
			session.createSnapshot(e.request.id, undefined);
			const responseModel = e.request.response;
			if (responseModel) {
				this.observerEditsInResponse(e.request.id, responseModel, session, observerDisposables);
			}
		}));
		observerDisposables.add(chatModel.onDidDispose(() => observerDisposables.dispose()));
		return observerDisposables;
	}

	private observerEditsInResponse(requestId: string, responseModel: IChatResponseModel, session: ChatEditingSession, observerDisposables: DisposableStore) {
		// Sparse array: the indicies are indexes of `responseModel.response.value`
		// that are edit groups, and then this tracks the edit application for
		// each of them. Note that text edit groups can be updated
		// multiple times during the process of response streaming.
		const editsSeen: ({ seen: number; streaming: IStreamingEdits } | undefined)[] = [];

		let editorDidChange = false;
		const editorListener = Event.once(this._editorService.onDidActiveEditorChange)(() => {
			editorDidChange = true;
		});
		const editorOpenPromises = new ResourceMap<Promise<void>>();
		const openChatEditedFiles = this._configurationService.getValue('accessibility.openChatEditedFiles');

		const ensureEditorOpen = (partUri: URI) => {
			const uri = CellUri.parse(partUri)?.notebook ?? partUri;
			if (editorOpenPromises.has(uri)) {
				return;
			}
			editorOpenPromises.set(uri, (async () => {
				if (this.notebookService.getNotebookTextModel(uri) || uri.scheme === Schemas.untitled || await this._fileService.exists(uri).catch(() => false)) {
					const activeUri = this._editorService.activeEditorPane?.input.resource;
					const inactive = editorDidChange
						|| this._editorService.activeEditorPane?.input instanceof ChatEditorInput && isEqual(this._editorService.activeEditorPane.input.sessionResource, session.chatSessionResource)
						|| Boolean(activeUri && session.entries.get().find(entry => isEqual(activeUri, entry.modifiedURI)));

					this._editorService.openEditor({ resource: uri, options: { inactive, preserveFocus: true, pinned: true } });
				}
			})());
		};

		const onResponseComplete = () => {
			for (const remaining of editsSeen) {
				remaining?.streaming.complete();
			}

			editsSeen.length = 0;
			editorOpenPromises.clear();
			editorListener.dispose();
		};

		const handleResponseParts = async () => {
			if (responseModel.isCanceled) {
				return;
			}

			let undoStop: undefined | string;
			for (let i = 0; i < responseModel.response.value.length; i++) {
				const part = responseModel.response.value[i];

				if (part.kind === 'undoStop') {
					undoStop = part.id;
					continue;
				}

				if (part.kind !== 'textEditGroup' && part.kind !== 'notebookEditGroup') {
					continue;
				}

				// Skip external edits - they're already applied on disk
				if (part.isExternalEdit) {
					continue;
				}

				if (openChatEditedFiles) {
					ensureEditorOpen(part.uri);
				}

				// get new edits and start editing session
				let entry = editsSeen[i];
				if (!entry) {
					entry = { seen: 0, streaming: session.startStreamingEdits(CellUri.parse(part.uri)?.notebook ?? part.uri, responseModel, undoStop) };
					editsSeen[i] = entry;
				}

				const isFirst = entry.seen === 0;
				const newEdits = part.edits.slice(entry.seen);
				entry.seen = part.edits.length;

				if (newEdits.length > 0 || isFirst) {
					for (let i = 0; i < newEdits.length; i++) {
						const edit = newEdits[i];
						const done = part.done ? i === newEdits.length - 1 : false;

						if (isTextEditOperationArray(edit)) {
							entry.streaming.pushText(edit, done);
						} else if (isCellTextEditOperationArray(edit)) {
							for (const edits of Object.values(groupBy(edit, e => e.uri.toString()))) {
								if (edits) {
									entry.streaming.pushNotebookCellText(edits[0].uri, edits.map(e => e.edit), done);
								}
							}
						} else {
							entry.streaming.pushNotebook(edit, done);
						}
					}
				}

				if (part.done) {
					entry.streaming.complete();
				}
			}
		};

		if (responseModel.isComplete) {
			handleResponseParts().then(() => {
				onResponseComplete();
			});
		} else {
			const disposable = observerDisposables.add(responseModel.onDidChange(e2 => {
				if (e2.reason === 'undoStop') {
					session.createSnapshot(requestId, e2.id);
				} else {
					handleResponseParts().then(() => {
						if (responseModel.isComplete) {
							onResponseComplete();
							observerDisposables.delete(disposable);
						}
					});
				}
			}));
		}
	}

	hasRelatedFilesProviders(): boolean {
		return this._chatRelatedFilesProviders.size > 0;
	}

	registerRelatedFilesProvider(handle: number, provider: IChatRelatedFilesProvider): IDisposable {
		this._chatRelatedFilesProviders.set(handle, provider);
		return toDisposable(() => {
			this._chatRelatedFilesProviders.delete(handle);
		});
	}

	async getRelatedFiles(chatSessionResource: URI, prompt: string, files: URI[], token: CancellationToken): Promise<{ group: string; files: IChatRelatedFile[] }[] | undefined> {
		const providers = Array.from(this._chatRelatedFilesProviders.values());
		const result = await Promise.all(providers.map(async provider => {
			try {
				const relatedFiles = await provider.provideRelatedFiles({ prompt, files }, token);
				if (relatedFiles?.length) {
					return { group: provider.description, files: relatedFiles };
				}
				return undefined;
			} catch (e) {
				return undefined;
			}
		}));

		return coalesce(result);
	}
}

/**
 * Emits an event containing the added or removed elements of the observable.
 */
function observeArrayChanges<T>(obs: IObservable<T[]>, compare: (a: T, b: T) => number, store: DisposableStore): Event<T[]> {
	const emitter = store.add(new Emitter<T[]>());
	store.add(runOnChange(obs, (newArr, oldArr) => {
		const change = delta(oldArr || [], newArr, compare);
		const changedElements = ([] as T[]).concat(change.added).concat(change.removed);
		emitter.fire(changedElements);
	}));
	return emitter.event;
}

class ChatDecorationsProvider extends Disposable implements IDecorationsProvider {

	readonly label: string = localize('chat', "Chat Editing");

	private readonly _currentEntries = derived<readonly IModifiedFileEntry[]>(this, (r) => {
		const sessions = this._sessions.read(r);
		if (!sessions) {
			return [];
		}
		const result: IModifiedFileEntry[] = [];
		for (const session of sessions) {
			if (session.state.read(r) !== ChatEditingSessionState.Disposed) {
				const entries = session.entries.read(r);
				result.push(...entries);
			}
		}
		return result;
	});

	private readonly _currentlyEditingUris = derived<URI[]>(this, (r) => {
		const uri = this._currentEntries.read(r);
		return uri.filter(entry => entry.isCurrentlyBeingModifiedBy.read(r)).map(entry => entry.modifiedURI);
	});

	private readonly _modifiedUris = derived<URI[]>(this, (r) => {
		const uri = this._currentEntries.read(r);
		return uri.filter(entry => !entry.isCurrentlyBeingModifiedBy.read(r) && entry.state.read(r) === ModifiedFileEntryState.Modified).map(entry => entry.modifiedURI);
	});

	readonly onDidChange: Event<URI[]>;

	constructor(
		private readonly _sessions: IObservable<readonly IChatEditingSession[]>
	) {
		super();
		this.onDidChange = Event.any(
			observeArrayChanges(this._currentlyEditingUris, compareBy(uri => uri.toString(), compare), this._store),
			observeArrayChanges(this._modifiedUris, compareBy(uri => uri.toString(), compare), this._store),
		);
	}

	provideDecorations(uri: URI, _token: CancellationToken): IDecorationData | undefined {
		const isCurrentlyBeingModified = this._currentlyEditingUris.get().some(e => e.toString() === uri.toString());
		if (isCurrentlyBeingModified) {
			return {
				weight: 1000,
				letter: ThemeIcon.modify(Codicon.loading, 'spin'),
				bubble: false
			};
		}
		const isModified = this._modifiedUris.get().some(e => e.toString() === uri.toString());
		if (isModified) {
			return {
				weight: 1000,
				letter: Codicon.diffModified,
				tooltip: localize('chatEditing.modified2', "Pending changes from chat"),
				bubble: true
			};
		}
		return undefined;
	}
}

export class ChatEditingMultiDiffSourceResolver implements IMultiDiffSourceResolver {

	constructor(
		private readonly _editingSessionsObs: IObservable<readonly IChatEditingSession[]>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	canHandleUri(uri: URI): boolean {
		return uri.scheme === CHAT_EDITING_MULTI_DIFF_SOURCE_RESOLVER_SCHEME;
	}

	async resolveDiffSource(uri: URI): Promise<IResolvedMultiDiffSource> {

		const parsed = parseChatMultiDiffUri(uri);
		const thisSession = derived(this, r => {
			return this._editingSessionsObs.read(r).find(candidate => isEqual(candidate.chatSessionResource, parsed.chatSessionResource));
		});

		return this._instantiationService.createInstance(ChatEditingMultiDiffSource, thisSession, parsed.showPreviousChanges);
	}
}

class ChatEditingMultiDiffSource implements IResolvedMultiDiffSource {
	private readonly _resources = derived<readonly MultiDiffEditorItem[]>(this, (reader) => {
		const currentSession = this._currentSession.read(reader);
		if (!currentSession) {
			return [];
		}
		const entries = currentSession.entries.read(reader);
		return entries.map((entry) => {
			if (this._showPreviousChanges) {
				const entryDiffObs = currentSession.getEntryDiffBetweenStops(entry.modifiedURI, undefined, undefined);
				const entryDiff = entryDiffObs?.read(reader);
				if (entryDiff) {
					return new MultiDiffEditorItem(
						entryDiff.originalURI,
						entryDiff.modifiedURI,
						undefined,
						undefined,
						{
							[chatEditingResourceContextKey.key]: entry.entryId,
						},
					);
				}
			}

			return new MultiDiffEditorItem(
				entry.originalURI,
				entry.modifiedURI,
				undefined,
				undefined,
				{
					[chatEditingResourceContextKey.key]: entry.entryId,
					// [inChatEditingSessionContextKey.key]: true
				},
			);
		});
	});
	readonly resources = new ValueWithChangeEventFromObservable(this._resources);

	readonly contextKeys = {
		[inChatEditingSessionContextKey.key]: true
	};

	constructor(
		private readonly _currentSession: IObservable<IChatEditingSession | undefined>,
		private readonly _showPreviousChanges: boolean
	) { }
}

function isTextEditOperationArray(value: TextEdit[] | ICellTextEditOperation[] | ICellEditOperation[]): value is TextEdit[] {
	return value.some(e => TextEdit.isTextEdit(e));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSession.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSession.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, ITask, Sequencer, SequencerByKey, timeout } from '../../../../../base/common/async.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { BugIndicatingError } from '../../../../../base/common/errors.js';
import { Emitter } from '../../../../../base/common/event.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Disposable, DisposableStore, dispose } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { derived, IObservable, IReader, ITransaction, observableValue, transaction } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { hasKey, Mutable } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { IBulkEditService } from '../../../../../editor/browser/services/bulkEditService.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextEdit } from '../../../../../editor/common/languages.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { EditorActivation } from '../../../../../platform/editor/common/editor.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { DiffEditorInput } from '../../../../common/editor/diffEditorInput.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { MultiDiffEditor } from '../../../multiDiffEditor/browser/multiDiffEditor.js';
import { MultiDiffEditorInput } from '../../../multiDiffEditor/browser/multiDiffEditorInput.js';
import { CellUri, ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { chatEditingSessionIsReady, ChatEditingSessionState, ChatEditKind, getMultiDiffSourceUri, IChatEditingSession, IEditSessionEntryDiff, IModifiedEntryTelemetryInfo, IModifiedFileEntry, ISnapshotEntry, IStreamingEdits, ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { IChatProgress } from '../../common/chatService.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { IChatEditingCheckpointTimeline } from './chatEditingCheckpointTimeline.js';
import { ChatEditingCheckpointTimelineImpl, IChatEditingTimelineFsDelegate } from './chatEditingCheckpointTimelineImpl.js';
import { ChatEditingModifiedDocumentEntry } from './chatEditingModifiedDocumentEntry.js';
import { AbstractChatEditingModifiedFileEntry } from './chatEditingModifiedFileEntry.js';
import { ChatEditingModifiedNotebookEntry } from './chatEditingModifiedNotebookEntry.js';
import { FileOperation, FileOperationType } from './chatEditingOperations.js';
import { ChatEditingSessionStorage, IChatEditingSessionStop, StoredSessionState } from './chatEditingSessionStorage.js';
import { ChatEditingTextModelContentProvider } from './chatEditingTextModelContentProviders.js';

const enum NotExistBehavior {
	Create,
	Abort,
}

class ThrottledSequencer extends Sequencer {

	private _size = 0;

	constructor(
		private readonly _minDuration: number,
		private readonly _maxOverallDelay: number
	) {
		super();
	}

	override queue<T>(promiseTask: ITask<Promise<T>>): Promise<T> {

		this._size += 1;

		const noDelay = this._size * this._minDuration > this._maxOverallDelay;

		return super.queue(async () => {
			try {
				const p1 = promiseTask();
				const p2 = noDelay
					? Promise.resolve(undefined)
					: timeout(this._minDuration, CancellationToken.None);

				const [result] = await Promise.all([p1, p2]);
				return result;

			} finally {
				this._size -= 1;
			}
		});
	}
}

function createOpeningEditCodeBlock(uri: URI, isNotebook: boolean, undoStopId: string): IChatProgress[] {
	return [
		{
			kind: 'markdownContent',
			content: new MarkdownString('\n````\n')
		},
		{
			kind: 'codeblockUri',
			uri,
			isEdit: true,
			undoStopId
		},
		{
			kind: 'markdownContent',
			content: new MarkdownString('\n````\n')
		},
		isNotebook
			? {
				kind: 'notebookEdit',
				uri,
				edits: [],
				done: false,
				isExternalEdit: true
			}
			: {
				kind: 'textEdit',
				uri,
				edits: [],
				done: false,
				isExternalEdit: true
			},
	];
}


export class ChatEditingSession extends Disposable implements IChatEditingSession {
	private readonly _state = observableValue<ChatEditingSessionState>(this, ChatEditingSessionState.Initial);
	private readonly _timeline: IChatEditingCheckpointTimeline;

	/**
	 * Contains the contents of a file when the AI first began doing edits to it.
	 */
	private readonly _initialFileContents = new ResourceMap<string>();

	private readonly _baselineCreationLocks = new SequencerByKey</* URI.path */ string>();
	private readonly _streamingEditLocks = new SequencerByKey</* URI */ string>();

	/**
	 * Tracks active external edit operations.
	 * Key is operationId, value contains the operation state.
	 */
	private readonly _externalEditOperations = new Map<number, {
		responseModel: IChatResponseModel;
		snapshots: ResourceMap<string | undefined>;
		undoStopId: string;
		releaseLocks: () => void;
	}>();

	private readonly _entriesObs = observableValue<readonly AbstractChatEditingModifiedFileEntry[]>(this, []);
	public readonly entries: IObservable<readonly IModifiedFileEntry[]> = derived(reader => {
		const state = this._state.read(reader);
		if (state === ChatEditingSessionState.Disposed || state === ChatEditingSessionState.Initial) {
			return [];
		} else {
			return this._entriesObs.read(reader);
		}
	});

	private _editorPane: MultiDiffEditor | undefined;

	get state(): IObservable<ChatEditingSessionState> {
		return this._state;
	}

	public readonly canUndo: IObservable<boolean>;
	public readonly canRedo: IObservable<boolean>;

	public get requestDisablement() {
		return this._timeline.requestDisablement;
	}

	private readonly _onDidDispose = new Emitter<void>();
	get onDidDispose() {
		this._assertNotDisposed();
		return this._onDidDispose.event;
	}

	constructor(
		readonly chatSessionResource: URI,
		readonly isGlobalEditingSession: boolean,
		private _lookupExternalEntry: (uri: URI) => AbstractChatEditingModifiedFileEntry | undefined,
		transferFrom: IChatEditingSession | undefined,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IBulkEditService public readonly _bulkEditService: IBulkEditService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookService private readonly _notebookService: INotebookService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@ILogService private readonly _logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._timeline = this._instantiationService.createInstance(
			ChatEditingCheckpointTimelineImpl,
			chatSessionResource,
			this._getTimelineDelegate(),
		);

		this.canRedo = this._timeline.canRedo.map((hasHistory, reader) =>
			hasHistory && this._state.read(reader) === ChatEditingSessionState.Idle);
		this.canUndo = this._timeline.canUndo.map((hasHistory, reader) =>
			hasHistory && this._state.read(reader) === ChatEditingSessionState.Idle);

		this._init(transferFrom);
	}

	private _getTimelineDelegate(): IChatEditingTimelineFsDelegate {
		return {
			createFile: (uri, content) => {
				return this._bulkEditService.apply({
					edits: [{
						newResource: uri,
						options: {
							overwrite: true,
							contents: content ? Promise.resolve(VSBuffer.fromString(content)) : undefined,
						},
					}],
				});
			},
			deleteFile: async (uri) => {
				const entries = this._entriesObs.get().filter(e => !isEqual(e.modifiedURI, uri));
				this._entriesObs.set(entries, undefined);
				await this._bulkEditService.apply({ edits: [{ oldResource: uri, options: { ignoreIfNotExists: true } }] });
			},
			renameFile: async (fromUri, toUri) => {
				const entries = this._entriesObs.get();
				const previousEntry = entries.find(e => isEqual(e.modifiedURI, fromUri));
				if (previousEntry) {
					const newEntry = await this._getOrCreateModifiedFileEntry(toUri, NotExistBehavior.Create, previousEntry.telemetryInfo, this._getCurrentTextOrNotebookSnapshot(previousEntry));
					previousEntry.dispose();
					this._entriesObs.set(entries.map(e => e === previousEntry ? newEntry : e), undefined);
				}
			},
			setContents: async (uri, content, telemetryInfo) => {
				const entry = await this._getOrCreateModifiedFileEntry(uri, NotExistBehavior.Create, telemetryInfo);
				if (entry instanceof ChatEditingModifiedNotebookEntry) {
					await entry.restoreModifiedModelFromSnapshot(content);
				} else {
					await entry.acceptAgentEdits(uri, [{ range: new Range(1, 1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), text: content }], true, undefined);
				}
			}
		};
	}

	private async _init(transferFrom?: IChatEditingSession): Promise<void> {
		const storage = this._instantiationService.createInstance(ChatEditingSessionStorage, this.chatSessionResource);
		let restoredSessionState: StoredSessionState | undefined;
		if (transferFrom instanceof ChatEditingSession) {
			restoredSessionState = transferFrom._getStoredState(this.chatSessionResource);
		} else {
			restoredSessionState = await storage.restoreState().catch(err => {
				this._logService.error(`Error restoring chat editing session state for ${this.chatSessionResource}`, err);
				return undefined;
			});

			if (this._store.isDisposed) {
				return; // disposed while restoring
			}
		}


		if (restoredSessionState) {
			for (const [uri, content] of restoredSessionState.initialFileContents) {
				this._initialFileContents.set(uri, content);
			}
			if (restoredSessionState.timeline) {
				transaction(tx => this._timeline.restoreFromState(restoredSessionState.timeline!, tx));
			}
			await this._initEntries(restoredSessionState.recentSnapshot);
		}

		this._state.set(ChatEditingSessionState.Idle, undefined);
	}

	private _getEntry(uri: URI): AbstractChatEditingModifiedFileEntry | undefined {
		uri = CellUri.parse(uri)?.notebook ?? uri;
		return this._entriesObs.get().find(e => isEqual(e.modifiedURI, uri));
	}

	public getEntry(uri: URI): IModifiedFileEntry | undefined {
		return this._getEntry(uri);
	}

	public readEntry(uri: URI, reader: IReader | undefined): IModifiedFileEntry | undefined {
		uri = CellUri.parse(uri)?.notebook ?? uri;
		return this._entriesObs.read(reader).find(e => isEqual(e.modifiedURI, uri));
	}

	public storeState(): Promise<void> {
		const storage = this._instantiationService.createInstance(ChatEditingSessionStorage, this.chatSessionResource);
		return storage.storeState(this._getStoredState());
	}

	private _getStoredState(sessionResource = this.chatSessionResource): StoredSessionState {
		const entries = new ResourceMap<ISnapshotEntry>();
		for (const entry of this._entriesObs.get()) {
			entries.set(entry.modifiedURI, entry.createSnapshot(sessionResource, undefined, undefined));
		}

		const state: StoredSessionState = {
			initialFileContents: this._initialFileContents,
			timeline: this._timeline.getStateForPersistence(),
			recentSnapshot: { entries, stopId: undefined },
		};

		return state;
	}

	public getEntryDiffBetweenStops(uri: URI, requestId: string | undefined, stopId: string | undefined) {
		return this._timeline.getEntryDiffBetweenStops(uri, requestId, stopId);
	}

	public getEntryDiffBetweenRequests(uri: URI, startRequestId: string, stopRequestId: string) {
		return this._timeline.getEntryDiffBetweenRequests(uri, startRequestId, stopRequestId);
	}

	public getDiffsForFilesInSession() {
		return this._timeline.getDiffsForFilesInSession();
	}

	public getDiffForSession() {
		return this._timeline.getDiffForSession();
	}

	public getDiffsForFilesInRequest(requestId: string): IObservable<readonly IEditSessionEntryDiff[]> {
		return this._timeline.getDiffsForFilesInRequest(requestId);
	}

	public hasEditsInRequest(requestId: string, reader?: IReader): boolean {
		return this._timeline.hasEditsInRequest(requestId, reader);
	}

	public createSnapshot(requestId: string, undoStop: string | undefined): void {
		const label = undoStop ? `Request ${requestId} - Stop ${undoStop}` : `Request ${requestId}`;
		this._timeline.createCheckpoint(requestId, undoStop, label);
	}

	public async getSnapshotContents(requestId: string, uri: URI, stopId: string | undefined): Promise<VSBuffer | undefined> {
		const content = await this._timeline.getContentAtStop(requestId, uri, stopId);
		return typeof content === 'string' ? VSBuffer.fromString(content) : content;
	}

	public async getSnapshotModel(requestId: string, undoStop: string | undefined, snapshotUri: URI): Promise<ITextModel | null> {
		await this._baselineCreationLocks.peek(snapshotUri.path);

		const content = await this._timeline.getContentAtStop(requestId, snapshotUri, undoStop);
		if (content === undefined) {
			return null;
		}

		const contentStr = typeof content === 'string' ? content : content.toString();
		const model = this._modelService.createModel(contentStr, this._languageService.createByFilepathOrFirstLine(snapshotUri), snapshotUri, false);

		const store = new DisposableStore();
		store.add(model.onWillDispose(() => store.dispose()));
		store.add(this._timeline.onDidChangeContentsAtStop(requestId, snapshotUri, undoStop, c => model.setValue(c)));

		return model;
	}

	public getSnapshotUri(requestId: string, uri: URI, stopId: string | undefined): URI | undefined {
		return this._timeline.getContentURIAtStop(requestId, uri, stopId);
	}

	public async restoreSnapshot(requestId: string, stopId: string | undefined): Promise<void> {
		const checkpointId = this._timeline.getCheckpointIdForRequest(requestId, stopId);
		if (checkpointId) {
			await this._timeline.navigateToCheckpoint(checkpointId);
		}
	}

	private _assertNotDisposed(): void {
		if (this._state.get() === ChatEditingSessionState.Disposed) {
			throw new BugIndicatingError(`Cannot access a disposed editing session`);
		}
	}

	async accept(...uris: URI[]): Promise<void> {
		if (await this._operateEntry('accept', uris)) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.editsKept, { allowManyInParallel: true });
		}

	}

	async reject(...uris: URI[]): Promise<void> {
		if (await this._operateEntry('reject', uris)) {
			this._accessibilitySignalService.playSignal(AccessibilitySignal.editsUndone, { allowManyInParallel: true });
		}
	}

	private async _operateEntry(action: 'accept' | 'reject', uris: URI[]): Promise<number> {
		this._assertNotDisposed();

		const applicableEntries = this._entriesObs.get()
			.filter(e => uris.length === 0 || uris.some(u => isEqual(u, e.modifiedURI)))
			.filter(e => !e.isCurrentlyBeingModifiedBy.get())
			.filter(e => e.state.get() === ModifiedFileEntryState.Modified);

		if (applicableEntries.length === 0) {
			return 0;
		}

		// Perform all I/O operations in parallel, each resolving to a state transition callback
		const method = action === 'accept' ? 'acceptDeferred' : 'rejectDeferred';
		const transitionCallbacks = await Promise.all(
			applicableEntries.map(entry => entry[method]().catch(err => {
				this._logService.error(`Error calling ${method} on entry ${entry.modifiedURI}`, err);
			}))
		);

		// Execute all state transitions atomically in a single transaction
		transaction(tx => {
			transitionCallbacks.forEach(callback => callback?.(tx));
		});

		return applicableEntries.length;
	}

	async show(previousChanges?: boolean): Promise<void> {
		this._assertNotDisposed();
		if (this._editorPane) {
			if (this._editorPane.isVisible()) {
				return;
			} else if (this._editorPane.input) {
				await this._editorGroupsService.activeGroup.openEditor(this._editorPane.input, { pinned: true, activation: EditorActivation.ACTIVATE });
				return;
			}
		}
		const input = MultiDiffEditorInput.fromResourceMultiDiffEditorInput({
			multiDiffSource: getMultiDiffSourceUri(this, previousChanges),
			label: localize('multiDiffEditorInput.name', "Suggested Edits")
		}, this._instantiationService);

		this._editorPane = await this._editorGroupsService.activeGroup.openEditor(input, { pinned: true, activation: EditorActivation.ACTIVATE }) as MultiDiffEditor | undefined;
	}

	private _stopPromise: Promise<void> | undefined;

	async stop(clearState = false): Promise<void> {
		this._stopPromise ??= Promise.allSettled([this._performStop(), this.storeState()]).then(() => { });
		await this._stopPromise;
		if (clearState) {
			await this._instantiationService.createInstance(ChatEditingSessionStorage, this.chatSessionResource).clearState();
		}
	}

	private async _performStop(): Promise<void> {
		// Close out all open files
		const schemes = [AbstractChatEditingModifiedFileEntry.scheme, ChatEditingTextModelContentProvider.scheme];
		await Promise.allSettled(this._editorGroupsService.groups.flatMap(async (g) => {
			return g.editors.map(async (e) => {
				if ((e instanceof MultiDiffEditorInput && e.initialResources?.some(r => r.originalUri && schemes.indexOf(r.originalUri.scheme) !== -1))
					|| (e instanceof DiffEditorInput && e.original.resource && schemes.indexOf(e.original.resource.scheme) !== -1)) {
					await g.closeEditor(e);
				}
			});
		}));
	}

	override dispose() {
		this._assertNotDisposed();
		dispose(this._entriesObs.get());
		super.dispose();
		this._state.set(ChatEditingSessionState.Disposed, undefined);
		this._onDidDispose.fire();
		this._onDidDispose.dispose();
	}

	private get isDisposed() {
		return this._state.get() === ChatEditingSessionState.Disposed;
	}

	startStreamingEdits(resource: URI, responseModel: IChatResponseModel, inUndoStop: string | undefined): IStreamingEdits {
		const completePromise = new DeferredPromise<void>();
		const startPromise = new DeferredPromise<void>();

		// Sequence all edits made this this resource in this streaming edits instance,
		// and also sequence the resource overall in the rare (currently invalid?) case
		// that edits are made in parallel to the same resource,
		const sequencer = new ThrottledSequencer(15, 1000);
		sequencer.queue(() => startPromise.p);

		// Lock around creating the baseline so we don't fail to resolve models
		// in the edit pills if they render quickly
		this._baselineCreationLocks.queue(resource.path, () => startPromise.p);

		this._streamingEditLocks.queue(resource.toString(), async () => {
			await chatEditingSessionIsReady(this);

			if (!this.isDisposed) {
				await this._acceptStreamingEditsStart(responseModel, inUndoStop, resource);
			}

			startPromise.complete();
			return completePromise.p;
		});


		let didComplete = false;

		return {
			pushText: (edits, isLastEdits) => {
				sequencer.queue(async () => {
					if (!this.isDisposed) {
						await this._acceptEdits(resource, edits, isLastEdits, responseModel);
					}
				});
			},
			pushNotebookCellText: (cell, edits, isLastEdits) => {
				sequencer.queue(async () => {
					if (!this.isDisposed) {
						await this._acceptEdits(cell, edits, isLastEdits, responseModel);
					}
				});
			},
			pushNotebook: (edits, isLastEdits) => {
				sequencer.queue(async () => {
					if (!this.isDisposed) {
						await this._acceptEdits(resource, edits, isLastEdits, responseModel);
					}
				});
			},
			complete: () => {
				if (didComplete) {
					return;
				}

				didComplete = true;
				sequencer.queue(async () => {
					if (!this.isDisposed) {
						await this._acceptEdits(resource, [], true, responseModel);
						await this._resolve(responseModel.requestId, inUndoStop, resource);
						completePromise.complete();
					}
				});
			},
		};
	}

	async startExternalEdits(responseModel: IChatResponseModel, operationId: number, resources: URI[], undoStopId: string): Promise<IChatProgress[]> {
		const snapshots = new ResourceMap<string | undefined>();
		const acquiredLockPromises: DeferredPromise<void>[] = [];
		const releaseLockPromises: DeferredPromise<void>[] = [];
		const progress: IChatProgress[] = [];
		const telemetryInfo = this._getTelemetryInfoForModel(responseModel);

		await chatEditingSessionIsReady(this);

		// Acquire locks for each resource and take snapshots
		for (const resource of resources) {
			const releaseLock = new DeferredPromise<void>();
			releaseLockPromises.push(releaseLock);

			const acquiredLock = new DeferredPromise<void>();
			acquiredLockPromises.push(acquiredLock);

			this._streamingEditLocks.queue(resource.toString(), async () => {
				if (this.isDisposed) {
					acquiredLock.complete();
					return;
				}

				const entry = await this._getOrCreateModifiedFileEntry(resource, NotExistBehavior.Abort, telemetryInfo);
				if (entry) {
					await this._acceptStreamingEditsStart(responseModel, undoStopId, resource);
				}


				const notebookUri = CellUri.parse(resource)?.notebook || resource;
				progress.push(...createOpeningEditCodeBlock(resource, this._notebookService.hasSupportedNotebooks(notebookUri), undoStopId));

				// Save to disk to ensure disk state is current before external edits
				await entry?.save();

				// Take snapshot of current state
				snapshots.set(resource, entry && this._getCurrentTextOrNotebookSnapshot(entry));
				entry?.startExternalEdit();
				acquiredLock.complete();

				// Wait for the lock to be released by stopExternalEdits
				return releaseLock.p;
			});
		}

		await Promise.all(acquiredLockPromises.map(p => p.p));
		this.createSnapshot(responseModel.requestId, undoStopId);

		// Store the operation state
		this._externalEditOperations.set(operationId, {
			responseModel,
			snapshots,
			undoStopId,
			releaseLocks: () => releaseLockPromises.forEach(p => p.complete())
		});

		return progress;
	}

	async stopExternalEdits(responseModel: IChatResponseModel, operationId: number): Promise<IChatProgress[]> {
		const operation = this._externalEditOperations.get(operationId);
		if (!operation) {
			this._logService.warn(`stopExternalEdits called for unknown operation ${operationId}`);
			return [];
		}

		this._externalEditOperations.delete(operationId);

		const progress: IChatProgress[] = [];

		try {
			// For each resource, compute the diff and create edit parts
			for (const [resource, beforeSnapshot] of operation.snapshots) {
				let entry = this._getEntry(resource);

				// Files that did not exist on disk before may not exist in our working
				// set yet. Create those if that's the case.
				if (!entry && beforeSnapshot === undefined) {
					entry = await this._getOrCreateModifiedFileEntry(resource, NotExistBehavior.Abort, this._getTelemetryInfoForModel(responseModel), '');
					if (entry) {
						entry.startExternalEdit();
						entry.acceptStreamingEditsStart(responseModel, operation.undoStopId, undefined);
					}
				}

				if (!entry) {
					continue;
				}

				// Reload from disk to ensure in-memory model is in sync with file system
				await entry.revertToDisk();

				// Take new snapshot after external changes
				const afterSnapshot = this._getCurrentTextOrNotebookSnapshot(entry);

				// Compute edits from the snapshots
				let edits: (TextEdit | ICellEditOperation)[] = [];
				if (beforeSnapshot === undefined) {
					this._timeline.recordFileOperation({
						type: FileOperationType.Create,
						uri: resource,
						requestId: responseModel.requestId,
						epoch: this._timeline.incrementEpoch(),
						initialContent: afterSnapshot,
						telemetryInfo: entry.telemetryInfo,
					});
				} else {
					edits = await entry.computeEditsFromSnapshots(beforeSnapshot, afterSnapshot);
					this._recordEditOperations(entry, resource, edits, responseModel);
				}

				progress.push(entry instanceof ChatEditingModifiedNotebookEntry ? {
					kind: 'notebookEdit',
					uri: resource,
					edits: edits as ICellEditOperation[],
					done: true,
					isExternalEdit: true
				} : {
					kind: 'textEdit',
					uri: resource,
					edits: edits as TextEdit[],
					done: true,
					isExternalEdit: true
				});

				// Mark as no longer being modified
				await entry.acceptStreamingEditsEnd();

				// Clear external edit mode
				entry.stopExternalEdit();
			}
		} finally {
			// Release all the locks
			operation.releaseLocks();

			const hasOtherTasks = Iterable.some(this._streamingEditLocks.keys(), k => !operation.snapshots.has(URI.parse(k)));
			if (!hasOtherTasks) {
				this._state.set(ChatEditingSessionState.Idle, undefined);
			}
		}


		return progress;
	}

	async undoInteraction(): Promise<void> {
		await this._timeline.undoToLastCheckpoint();
	}

	async redoInteraction(): Promise<void> {
		await this._timeline.redoToNextCheckpoint();
	}

	private _recordEditOperations(entry: AbstractChatEditingModifiedFileEntry, resource: URI, edits: (TextEdit | ICellEditOperation)[], responseModel: IChatResponseModel): void {
		// Determine if these are text edits or notebook edits
		const isNotebookEdits = edits.length > 0 && hasKey(edits[0], { cells: true });

		if (isNotebookEdits) {
			// Record notebook edit operation
			const notebookEdits = edits as ICellEditOperation[];
			this._timeline.recordFileOperation({
				type: FileOperationType.NotebookEdit,
				uri: resource,
				requestId: responseModel.requestId,
				epoch: this._timeline.incrementEpoch(),
				cellEdits: notebookEdits
			});
		} else {
			let cellIndex: number | undefined;
			if (entry instanceof ChatEditingModifiedNotebookEntry) {
				const cellUri = CellUri.parse(resource);
				if (cellUri) {
					const i = entry.getIndexOfCellHandle(cellUri.handle);
					if (i !== -1) {
						cellIndex = i;
					}
				}
			}

			const textEdits = edits as TextEdit[];
			this._timeline.recordFileOperation({
				type: FileOperationType.TextEdit,
				uri: resource,
				requestId: responseModel.requestId,
				epoch: this._timeline.incrementEpoch(),
				edits: textEdits,
				cellIndex,
			});
		}
	}

	private _getCurrentTextOrNotebookSnapshot(entry: AbstractChatEditingModifiedFileEntry): string {
		if (entry instanceof ChatEditingModifiedNotebookEntry) {
			return entry.getCurrentSnapshot();
		} else if (entry instanceof ChatEditingModifiedDocumentEntry) {
			return entry.getCurrentContents();
		} else {
			throw new Error(`unknown entry type for ${entry.modifiedURI}`);
		}
	}

	private async _acceptStreamingEditsStart(responseModel: IChatResponseModel, undoStop: string | undefined, resource: URI) {
		const entry = await this._getOrCreateModifiedFileEntry(resource, NotExistBehavior.Create, this._getTelemetryInfoForModel(responseModel));

		// Record file baseline if this is the first edit for this file in this request
		if (!this._timeline.hasFileBaseline(resource, responseModel.requestId)) {
			this._timeline.recordFileBaseline({
				uri: resource,
				requestId: responseModel.requestId,
				content: this._getCurrentTextOrNotebookSnapshot(entry),
				epoch: this._timeline.incrementEpoch(),
				telemetryInfo: entry.telemetryInfo,
				notebookViewType: entry instanceof ChatEditingModifiedNotebookEntry ? entry.viewType : undefined,
			});
		}

		transaction((tx) => {
			this._state.set(ChatEditingSessionState.StreamingEdits, tx);
			entry.acceptStreamingEditsStart(responseModel, undoStop, tx);
			// Note: Individual edit operations will be recorded by the file entries
		});

		return entry;
	}

	private async _initEntries({ entries }: IChatEditingSessionStop): Promise<void> {
		// Reset all the files which are modified in this session state
		// but which are not found in the snapshot
		for (const entry of this._entriesObs.get()) {
			const snapshotEntry = entries.get(entry.modifiedURI);
			if (!snapshotEntry) {
				await entry.resetToInitialContent();
				entry.dispose();
			}
		}

		const entriesArr: AbstractChatEditingModifiedFileEntry[] = [];
		// Restore all entries from the snapshot
		for (const snapshotEntry of entries.values()) {
			const entry = await this._getOrCreateModifiedFileEntry(snapshotEntry.resource, NotExistBehavior.Abort, snapshotEntry.telemetryInfo);
			if (entry) {
				const restoreToDisk = snapshotEntry.state === ModifiedFileEntryState.Modified;
				await entry.restoreFromSnapshot(snapshotEntry, restoreToDisk);
				entriesArr.push(entry);
			}
		}

		this._entriesObs.set(entriesArr, undefined);
	}

	private async _acceptEdits(resource: URI, textEdits: (TextEdit | ICellEditOperation)[], isLastEdits: boolean, responseModel: IChatResponseModel): Promise<void> {
		const entry = await this._getOrCreateModifiedFileEntry(resource, NotExistBehavior.Create, this._getTelemetryInfoForModel(responseModel));

		// Record edit operations in the timeline if there are actual edits
		if (textEdits.length > 0) {
			this._recordEditOperations(entry, resource, textEdits, responseModel);
		}

		await entry.acceptAgentEdits(resource, textEdits, isLastEdits, responseModel);
	}

	private _getTelemetryInfoForModel(responseModel: IChatResponseModel): IModifiedEntryTelemetryInfo {
		// Make these getters because the response result is not available when the file first starts to be edited
		return new class implements IModifiedEntryTelemetryInfo {
			get agentId() { return responseModel.agent?.id; }
			get modelId() { return responseModel.request?.modelId; }
			get modeId() { return responseModel.request?.modeInfo?.modeId; }
			get command() { return responseModel.slashCommand?.name; }
			get sessionResource() { return responseModel.session.sessionResource; }
			get requestId() { return responseModel.requestId; }
			get result() { return responseModel.result; }
			get applyCodeBlockSuggestionId() { return responseModel.request?.modeInfo?.applyCodeBlockSuggestionId; }

			get feature(): 'sideBarChat' | 'inlineChat' | undefined {
				if (responseModel.session.initialLocation === ChatAgentLocation.Chat) {
					return 'sideBarChat';
				} else if (responseModel.session.initialLocation === ChatAgentLocation.EditorInline) {
					return 'inlineChat';
				}
				return undefined;
			}
		};
	}

	private async _resolve(requestId: string, undoStop: string | undefined, resource: URI): Promise<void> {
		const hasOtherTasks = Iterable.some(this._streamingEditLocks.keys(), k => k !== resource.toString());
		if (!hasOtherTasks) {
			this._state.set(ChatEditingSessionState.Idle, undefined);
		}

		const entry = this._getEntry(resource);
		if (!entry) {
			return;
		}

		// Create checkpoint for this edit completion
		const label = undoStop ? `Request ${requestId} - Stop ${undoStop}` : `Request ${requestId}`;
		this._timeline.createCheckpoint(requestId, undoStop, label);

		return entry.acceptStreamingEditsEnd();
	}

	/**
	 * Retrieves or creates a modified file entry.
	 *
	 * @returns The modified file entry.
	 */
	private async _getOrCreateModifiedFileEntry(resource: URI, ifNotExists: NotExistBehavior.Create, telemetryInfo: IModifiedEntryTelemetryInfo, initialContent?: string): Promise<AbstractChatEditingModifiedFileEntry>;
	private async _getOrCreateModifiedFileEntry(resource: URI, ifNotExists: NotExistBehavior, telemetryInfo: IModifiedEntryTelemetryInfo, initialContent?: string): Promise<AbstractChatEditingModifiedFileEntry | undefined>;
	private async _getOrCreateModifiedFileEntry(resource: URI, ifNotExists: NotExistBehavior, telemetryInfo: IModifiedEntryTelemetryInfo, _initialContent?: string): Promise<AbstractChatEditingModifiedFileEntry | undefined> {

		resource = CellUri.parse(resource)?.notebook ?? resource;

		const existingEntry = this._entriesObs.get().find(e => isEqual(e.modifiedURI, resource));
		if (existingEntry) {
			if (telemetryInfo.requestId !== existingEntry.telemetryInfo.requestId) {
				existingEntry.updateTelemetryInfo(telemetryInfo);
			}
			return existingEntry;
		}

		let entry: AbstractChatEditingModifiedFileEntry;
		const existingExternalEntry = this._lookupExternalEntry(resource);
		if (existingExternalEntry) {
			entry = existingExternalEntry;

			if (telemetryInfo.requestId !== entry.telemetryInfo.requestId) {
				entry.updateTelemetryInfo(telemetryInfo);
			}
		} else {
			const initialContent = _initialContent ?? this._initialFileContents.get(resource);
			// This gets manually disposed in .dispose() or in .restoreSnapshot()
			const maybeEntry = await this._createModifiedFileEntry(resource, telemetryInfo, ifNotExists, initialContent);
			if (!maybeEntry) {
				return undefined;
			}
			entry = maybeEntry;
			if (initialContent === undefined) {
				this._initialFileContents.set(resource, entry.initialContent);
			}
		}

		// If an entry is deleted e.g. reverting a created file,
		// remove it from the entries and don't show it in the working set anymore
		// so that it can be recreated e.g. through retry
		const listener = entry.onDidDelete(() => {
			const newEntries = this._entriesObs.get().filter(e => !isEqual(e.modifiedURI, entry.modifiedURI));
			this._entriesObs.set(newEntries, undefined);
			this._editorService.closeEditors(this._editorService.findEditors(entry.modifiedURI));

			if (!existingExternalEntry) {
				// don't dispose entries that are not yours!
				entry.dispose();
			}

			this._store.delete(listener);
		});
		this._store.add(listener);

		const entriesArr = [...this._entriesObs.get(), entry];
		this._entriesObs.set(entriesArr, undefined);

		return entry;
	}

	private async _createModifiedFileEntry(resource: URI, telemetryInfo: IModifiedEntryTelemetryInfo, ifNotExists: NotExistBehavior.Create, initialContent: string | undefined): Promise<AbstractChatEditingModifiedFileEntry>;
	private async _createModifiedFileEntry(resource: URI, telemetryInfo: IModifiedEntryTelemetryInfo, ifNotExists: NotExistBehavior, initialContent: string | undefined): Promise<AbstractChatEditingModifiedFileEntry | undefined>;

	private async _createModifiedFileEntry(resource: URI, telemetryInfo: IModifiedEntryTelemetryInfo, ifNotExists: NotExistBehavior, initialContent: string | undefined): Promise<AbstractChatEditingModifiedFileEntry | undefined> {
		const multiDiffEntryDelegate = {
			collapse: (transaction: ITransaction | undefined) => this._collapse(resource, transaction),
			recordOperation: (operation: Mutable<FileOperation>) => {
				operation.epoch = this._timeline.incrementEpoch();
				this._timeline.recordFileOperation(operation);
			},
		};
		const notebookUri = CellUri.parse(resource)?.notebook || resource;
		const doCreate = async (chatKind: ChatEditKind) => {
			if (this._notebookService.hasSupportedNotebooks(notebookUri)) {
				return await ChatEditingModifiedNotebookEntry.create(notebookUri, multiDiffEntryDelegate, telemetryInfo, chatKind, initialContent, this._instantiationService);
			} else {
				const ref = await this._textModelService.createModelReference(resource);
				return this._instantiationService.createInstance(ChatEditingModifiedDocumentEntry, ref, multiDiffEntryDelegate, telemetryInfo, chatKind, initialContent);
			}
		};

		try {
			return await doCreate(ChatEditKind.Modified);
		} catch (err) {
			if (ifNotExists === NotExistBehavior.Abort) {
				return undefined;
			}

			// this file does not exist yet, create it and try again
			await this._bulkEditService.apply({ edits: [{ newResource: resource }] });
			if (this.configurationService.getValue<boolean>('accessibility.openChatEditedFiles')) {
				this._editorService.openEditor({ resource, options: { inactive: true, preserveFocus: true, pinned: true } });
			}

			// Record file creation operation
			this._timeline.recordFileOperation({
				type: FileOperationType.Create,
				uri: resource,
				requestId: telemetryInfo.requestId,
				epoch: this._timeline.incrementEpoch(),
				initialContent: initialContent || '',
				telemetryInfo,
			});

			if (this._notebookService.hasSupportedNotebooks(notebookUri)) {
				return await ChatEditingModifiedNotebookEntry.create(resource, multiDiffEntryDelegate, telemetryInfo, ChatEditKind.Created, initialContent, this._instantiationService);
			} else {
				return await doCreate(ChatEditKind.Created);
			}
		}
	}

	private _collapse(resource: URI, transaction: ITransaction | undefined) {
		const multiDiffItem = this._editorPane?.findDocumentDiffItem(resource);
		if (multiDiffItem) {
			this._editorPane?.viewModel?.items.get().find((documentDiffItem) =>
				isEqual(documentDiffItem.originalUri, multiDiffItem.originalUri) &&
				isEqual(documentDiffItem.modifiedUri, multiDiffItem.modifiedUri))
				?.collapsed.set(true, transaction);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSessionStorage.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingSessionStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../../base/common/buffer.js';
import { hashAsync } from '../../../../../base/common/hash.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { revive } from '../../../../../base/common/marshalling.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { EditSuggestionId } from '../../../../../editor/common/textModelEditSource.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { Dto } from '../../../../services/extensions/common/proxyIdentifier.js';
import { ISnapshotEntry, ModifiedFileEntryState, WorkingSetDisplayMetadata } from '../../common/chatEditingService.js';
import { getKeyForChatSessionResource, IChatEditingTimelineState } from './chatEditingOperations.js';

const STORAGE_CONTENTS_FOLDER = 'contents';
const STORAGE_STATE_FILE = 'state.json';

export interface StoredSessionState {
	readonly initialFileContents: ResourceMap<string>;
	readonly recentSnapshot: IChatEditingSessionStop;
	readonly timeline: IChatEditingTimelineState | undefined;
}

export class ChatEditingSessionStorage {
	private readonly storageKey: string;
	constructor(
		private readonly _chatSessionResource: URI,
		@IFileService private readonly _fileService: IFileService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@ILogService private readonly _logService: ILogService,
		@IWorkspaceContextService private readonly _workspaceContextService: IWorkspaceContextService,
	) {
		this.storageKey = getKeyForChatSessionResource(_chatSessionResource);
	}

	protected _getStorageLocation(): URI {
		const workspaceId = this._workspaceContextService.getWorkspace().id;
		return joinPath(this._environmentService.workspaceStorageHome, workspaceId, 'chatEditingSessions', this.storageKey);
	}

	public async restoreState(): Promise<StoredSessionState | undefined> {
		const storageLocation = this._getStorageLocation();
		const fileContents = new Map<string, Promise<string>>();
		const getFileContent = (hash: string) => {
			let readPromise = fileContents.get(hash);
			if (!readPromise) {
				readPromise = this._fileService.readFile(joinPath(storageLocation, STORAGE_CONTENTS_FOLDER, hash)).then(content => content.value.toString());
				fileContents.set(hash, readPromise);
			}
			return readPromise;
		};
		const deserializeSnapshotEntriesDTO = async (dtoEntries: ISnapshotEntryDTO[]): Promise<ResourceMap<ISnapshotEntry>> => {
			const entries = new ResourceMap<ISnapshotEntry>();
			for (const entryDTO of dtoEntries) {
				const entry = await deserializeSnapshotEntry(entryDTO);
				entries.set(entry.resource, entry);
			}
			return entries;
		};
		const deserializeChatEditingStopDTO = async (stopDTO: IChatEditingSessionStopDTO | IChatEditingSessionSnapshotDTO): Promise<IChatEditingSessionStop> => {
			const entries = await deserializeSnapshotEntriesDTO(stopDTO.entries);
			return { stopId: 'stopId' in stopDTO ? stopDTO.stopId : undefined, entries };
		};
		const deserializeSnapshotEntry = async (entry: ISnapshotEntryDTO) => {
			return {
				resource: URI.parse(entry.resource),
				languageId: entry.languageId,
				original: await getFileContent(entry.originalHash),
				current: await getFileContent(entry.currentHash),
				state: entry.state,
				snapshotUri: URI.parse(entry.snapshotUri),
				telemetryInfo: {
					requestId: entry.telemetryInfo.requestId,
					agentId: entry.telemetryInfo.agentId,
					command: entry.telemetryInfo.command,
					sessionResource: this._chatSessionResource,
					result: undefined,
					modelId: entry.telemetryInfo.modelId,
					modeId: entry.telemetryInfo.modeId,
					applyCodeBlockSuggestionId: entry.telemetryInfo.applyCodeBlockSuggestionId,
					feature: entry.telemetryInfo.feature,
				}
			} satisfies ISnapshotEntry;
		};
		try {
			const stateFilePath = joinPath(storageLocation, STORAGE_STATE_FILE);
			if (! await this._fileService.exists(stateFilePath)) {
				this._logService.debug(`chatEditingSession: No editing session state found at ${stateFilePath.toString()}`);
				return undefined;
			}
			this._logService.debug(`chatEditingSession: Restoring editing session at ${stateFilePath.toString()}`);
			const stateFileContent = await this._fileService.readFile(stateFilePath);
			const data = JSON.parse(stateFileContent.value.toString()) as IChatEditingSessionDTO;
			if (!COMPATIBLE_STORAGE_VERSIONS.includes(data.version)) {
				return undefined;
			}

			const initialFileContents = new ResourceMap<string>();
			for (const fileContentDTO of data.initialFileContents) {
				initialFileContents.set(URI.parse(fileContentDTO[0]), await getFileContent(fileContentDTO[1]));
			}
			const recentSnapshot = await deserializeChatEditingStopDTO(data.recentSnapshot);

			return {
				initialFileContents,
				recentSnapshot,
				timeline: revive(data.timeline),
			};
		} catch (e) {
			this._logService.error(`Error restoring chat editing session from ${storageLocation.toString()}`, e);
		}
		return undefined;
	}

	public async storeState(state: StoredSessionState): Promise<void> {
		const storageFolder = this._getStorageLocation();
		const contentsFolder = URI.joinPath(storageFolder, STORAGE_CONTENTS_FOLDER);

		// prepare the content folder
		const existingContents = new Set<string>();
		try {
			const stat = await this._fileService.resolve(contentsFolder);
			stat.children?.forEach(child => {
				if (child.isFile) {
					existingContents.add(child.name);
				}
			});
		} catch (e) {
			try {
				// does not exist, create
				await this._fileService.createFolder(contentsFolder);
			} catch (e) {
				this._logService.error(`Error creating chat editing session content folder ${contentsFolder.toString()}`, e);
				return;
			}
		}

		const contentWritePromises = new Map<string, Promise<string>>();

		// saves a file content under a path containing a hash of the content.
		// Returns the hash to represent the content.
		const writeContent = async (content: string): Promise<string> => {
			const buffer = VSBuffer.fromString(content);
			const hash = (await hashAsync(buffer)).substring(0, 7);
			if (!existingContents.has(hash)) {
				await this._fileService.writeFile(joinPath(contentsFolder, hash), buffer);
			}
			return hash;
		};
		const addFileContent = async (content: string): Promise<string> => {
			let storedContentHash = contentWritePromises.get(content);
			if (!storedContentHash) {
				storedContentHash = writeContent(content);
				contentWritePromises.set(content, storedContentHash);
			}
			return storedContentHash;
		};
		const serializeResourceMap = async <T, U>(resourceMap: ResourceMap<T>, serialize: (value: T) => Promise<U>): Promise<ResourceMapDTO<U>> => {
			return await Promise.all(Array.from(resourceMap.entries()).map(async ([resourceURI, value]) => [resourceURI.toString(), await serialize(value)]));
		};
		const serializeChatEditingSessionStop = async (stop: IChatEditingSessionStop): Promise<IChatEditingSessionStopDTO> => {
			return {
				stopId: stop.stopId,
				entries: await Promise.all(Array.from(stop.entries.values()).map(serializeSnapshotEntry))
			};
		};
		const serializeSnapshotEntry = async (entry: ISnapshotEntry): Promise<ISnapshotEntryDTO> => {
			return {
				resource: entry.resource.toString(),
				languageId: entry.languageId,
				originalHash: await addFileContent(entry.original),
				currentHash: await addFileContent(entry.current),
				state: entry.state,
				snapshotUri: entry.snapshotUri.toString(),
				telemetryInfo: { requestId: entry.telemetryInfo.requestId, agentId: entry.telemetryInfo.agentId, command: entry.telemetryInfo.command, modelId: entry.telemetryInfo.modelId, modeId: entry.telemetryInfo.modeId }
			};
		};

		try {
			const data: IChatEditingSessionDTO = {
				version: STORAGE_VERSION,
				initialFileContents: await serializeResourceMap(state.initialFileContents, value => addFileContent(value)),
				timeline: state.timeline,
				recentSnapshot: await serializeChatEditingSessionStop(state.recentSnapshot),
			};

			this._logService.debug(`chatEditingSession: Storing editing session at ${storageFolder.toString()}: ${contentWritePromises.size} files`);

			await this._fileService.writeFile(joinPath(storageFolder, STORAGE_STATE_FILE), VSBuffer.fromString(JSON.stringify(data)));
		} catch (e) {
			this._logService.debug(`Error storing chat editing session to ${storageFolder.toString()}`, e);
		}
	}

	public async clearState(): Promise<void> {
		const storageFolder = this._getStorageLocation();
		if (await this._fileService.exists(storageFolder)) {
			this._logService.debug(`chatEditingSession: Clearing editing session at ${storageFolder.toString()}`);
			try {
				await this._fileService.del(storageFolder, { recursive: true });
			} catch (e) {
				this._logService.debug(`Error clearing chat editing session from ${storageFolder.toString()}`, e);
			}
		}
	}
}

export interface IChatEditingSessionSnapshot {
	/**
	 * Index of this session in the linear history. It's the sum of the lengths
	 * of all {@link stops} prior this one.
	 */
	readonly startIndex: number;

	readonly requestId: string | undefined;
	/**
	 * Edit stops in the request. Always initially populatd with stopId: undefind
	 * for th request's initial state.
	 *
	 * Invariant: never empty.
	 */
	readonly stops: IChatEditingSessionStop[];
}

export interface IChatEditingSessionStop {
	/** Edit stop ID, first for a request is always undefined. */
	stopId: string | undefined;

	readonly entries: ResourceMap<ISnapshotEntry>;
}

interface IChatEditingSessionStopDTO {
	readonly stopId: string | undefined;
	readonly entries: ISnapshotEntryDTO[];
}


interface IChatEditingSessionSnapshotDTO {
	readonly requestId: string | undefined;
	readonly workingSet: ResourceMapDTO<WorkingSetDisplayMetadata>;
	readonly entries: ISnapshotEntryDTO[];
}

interface ISnapshotEntryDTO {
	readonly resource: string;
	readonly languageId: string;
	readonly originalHash: string;
	readonly currentHash: string;
	readonly state: ModifiedFileEntryState;
	readonly snapshotUri: string;
	readonly telemetryInfo: IModifiedEntryTelemetryInfoDTO;
}

interface IModifiedEntryTelemetryInfoDTO {
	readonly requestId: string;
	readonly agentId?: string;
	readonly command?: string;

	readonly modelId?: string;
	readonly modeId?: 'ask' | 'edit' | 'agent' | 'custom' | 'applyCodeBlock' | undefined;
	readonly applyCodeBlockSuggestionId?: EditSuggestionId | undefined;
	readonly feature?: 'sideBarChat' | 'inlineChat' | undefined;
}

type ResourceMapDTO<T> = [string, T][];

const COMPATIBLE_STORAGE_VERSIONS = [1, 2];
const STORAGE_VERSION = 2;

/** Old history uses IChatEditingSessionSnapshotDTO, new history uses IChatEditingSessionSnapshotDTO. */
interface IChatEditingSessionDTO {
	readonly version: number;
	readonly recentSnapshot: (IChatEditingSessionStopDTO | IChatEditingSessionSnapshotDTO);
	readonly timeline: Dto<IChatEditingTimelineState> | undefined;
	readonly initialFileContents: ResourceMapDTO<string>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingTextModelChangeService.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingTextModelChangeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, getWindow } from '../../../../../base/browser/dom.js';
import { assert } from '../../../../../base/common/assert.js';
import { DeferredPromise, RunOnceScheduler, timeout } from '../../../../../base/common/async.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, IObservable, observableValue } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { themeColorFromId } from '../../../../../base/common/themables.js';
import { assertType } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { EditOperation, ISingleEditOperation } from '../../../../../editor/common/core/editOperation.js';
import { StringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { IRange, Range } from '../../../../../editor/common/core/range.js';
import { LineRange } from '../../../../../editor/common/core/ranges/lineRange.js';
import { IDocumentDiff, nullDocumentDiff } from '../../../../../editor/common/diff/documentDiffProvider.js';
import { DetailedLineRangeMapping } from '../../../../../editor/common/diff/rangeMapping.js';
import { TextEdit, VersionedExtensionId } from '../../../../../editor/common/languages.js';
import { IModelDeltaDecoration, ITextModel, ITextSnapshot, MinimapPosition, OverviewRulerLane } from '../../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../../editor/common/model/textModel.js';
import { offsetEditFromContentChanges, offsetEditFromLineRangeMapping, offsetEditToEditOperations } from '../../../../../editor/common/model/textModelStringEdit.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { EditSources, TextModelEditSource } from '../../../../../editor/common/textModelEditSource.js';
import { IModelContentChangedEvent } from '../../../../../editor/common/textModelEvents.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { editorSelectionBackground } from '../../../../../platform/theme/common/colorRegistry.js';
import { ICellEditOperation } from '../../../notebook/common/notebookCommon.js';
import { ModifiedFileEntryState } from '../../common/chatEditingService.js';
import { IChatResponseModel } from '../../common/chatModel.js';
import { ChatAgentLocation } from '../../common/constants.js';
import { IDocumentDiff2 } from './chatEditingCodeEditorIntegration.js';
import { pendingRewriteMinimap } from './chatEditingModifiedFileEntry.js';

type affectedLines = { linesAdded: number; linesRemoved: number; lineCount: number; hasRemainingEdits: boolean };
type acceptedOrRejectedLines = affectedLines & { state: 'accepted' | 'rejected' };

export class ChatEditingTextModelChangeService extends Disposable {

	private static readonly _lastEditDecorationOptions = ModelDecorationOptions.register({
		isWholeLine: true,
		description: 'chat-last-edit',
		className: 'chat-editing-last-edit-line',
		marginClassName: 'chat-editing-last-edit',
		overviewRuler: {
			position: OverviewRulerLane.Full,
			color: themeColorFromId(editorSelectionBackground)
		},
	});

	private static readonly _pendingEditDecorationOptions = ModelDecorationOptions.register({
		isWholeLine: true,
		description: 'chat-pending-edit',
		className: 'chat-editing-pending-edit',
		minimap: {
			position: MinimapPosition.Inline,
			color: themeColorFromId(pendingRewriteMinimap)
		}
	});

	private static readonly _atomicEditDecorationOptions = ModelDecorationOptions.register({
		isWholeLine: true,
		description: 'chat-atomic-edit',
		className: 'chat-editing-atomic-edit',
		minimap: {
			position: MinimapPosition.Inline,
			color: themeColorFromId(pendingRewriteMinimap)
		}
	});

	private _isEditFromUs: boolean = false;
	public get isEditFromUs() {
		return this._isEditFromUs;
	}
	private _allEditsAreFromUs: boolean = true;
	public get allEditsAreFromUs() {
		return this._allEditsAreFromUs;
	}
	private _isExternalEditInProgress: (() => boolean) | undefined;
	private _diffOperation: Promise<IDocumentDiff | undefined> | undefined;
	private _diffOperationIds: number = 0;

	private readonly _diffInfo = observableValue<IDocumentDiff>(this, nullDocumentDiff);
	public get diffInfo() {
		return this._diffInfo.map(value => {
			return {
				...value,
				originalModel: this.originalModel,
				modifiedModel: this.modifiedModel,
				keep: changes => this._keepHunk(changes),
				undo: changes => this._undoHunk(changes)
			} satisfies IDocumentDiff2;
		});
	}

	private readonly _editDecorationClear = this._register(new RunOnceScheduler(() => { this._editDecorations = this.modifiedModel.deltaDecorations(this._editDecorations, []); }, 500));
	private _editDecorations: string[] = [];

	private readonly _didAcceptOrRejectAllHunks = this._register(new Emitter<ModifiedFileEntryState.Accepted | ModifiedFileEntryState.Rejected>());
	public readonly onDidAcceptOrRejectAllHunks = this._didAcceptOrRejectAllHunks.event;

	private readonly _didAcceptOrRejectLines = this._register(new Emitter<acceptedOrRejectedLines>());
	public readonly onDidAcceptOrRejectLines = this._didAcceptOrRejectLines.event;

	private notifyHunkAction(state: 'accepted' | 'rejected', affectedLines: affectedLines) {
		if (affectedLines.lineCount > 0) {
			this._didAcceptOrRejectLines.fire({ state, ...affectedLines });
		}
	}

	private _didUserEditModelFired = false;
	private readonly _didUserEditModel = this._register(new Emitter<void>());
	public readonly onDidUserEditModel = this._didUserEditModel.event;

	private _originalToModifiedEdit: StringEdit = StringEdit.empty;

	private lineChangeCount: number = 0;
	private linesAdded: number = 0;
	private linesRemoved: number = 0;

	constructor(
		private readonly originalModel: ITextModel,
		private readonly modifiedModel: ITextModel,
		private readonly state: IObservable<ModifiedFileEntryState>,
		isExternalEditInProgress: (() => boolean) | undefined,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
	) {
		super();
		this._isExternalEditInProgress = isExternalEditInProgress;
		this._register(this.modifiedModel.onDidChangeContent(e => {
			this._mirrorEdits(e);
		}));

		this._register(toDisposable(() => {
			this.clearCurrentEditLineDecoration();
		}));

		this._register(autorun(r => this.updateLineChangeCount(this._diffInfo.read(r))));

		if (!originalModel.equalsTextBuffer(modifiedModel.getTextBuffer())) {
			this._updateDiffInfoSeq();
		}
	}

	private updateLineChangeCount(diff: IDocumentDiff) {
		this.lineChangeCount = 0;
		this.linesAdded = 0;
		this.linesRemoved = 0;

		for (const change of diff.changes) {
			const modifiedRange = change.modified.endLineNumberExclusive - change.modified.startLineNumber;
			this.linesAdded += Math.max(0, modifiedRange);
			const originalRange = change.original.endLineNumberExclusive - change.original.startLineNumber;
			this.linesRemoved += Math.max(0, originalRange);

			this.lineChangeCount += Math.max(modifiedRange, originalRange);
		}
	}

	public clearCurrentEditLineDecoration() {
		if (!this.modifiedModel.isDisposed()) {
			this._editDecorations = this.modifiedModel.deltaDecorations(this._editDecorations, []);
		}
	}

	public async areOriginalAndModifiedIdentical(): Promise<boolean> {
		const diff = await this._diffOperation;
		return diff ? diff.identical : false;
	}

	async acceptAgentEdits(resource: URI, textEdits: (TextEdit | ICellEditOperation)[], isLastEdits: boolean, responseModel: IChatResponseModel | undefined): Promise<{ rewriteRatio: number; maxLineNumber: number }> {

		assertType(textEdits.every(TextEdit.isTextEdit), 'INVALID args, can only handle text edits');
		assert(isEqual(resource, this.modifiedModel.uri), ' INVALID args, can only edit THIS document');

		const isAtomicEdits = textEdits.length > 0 && isLastEdits;
		let maxLineNumber = 0;
		let rewriteRatio = 0;

		const source = this._createEditSource(responseModel);

		if (isAtomicEdits) {
			// EDIT and DONE
			const minimalEdits = await this._editorWorkerService.computeMoreMinimalEdits(this.modifiedModel.uri, textEdits) ?? textEdits;
			const ops = minimalEdits.map(TextEdit.asEditOperation);
			const undoEdits = this._applyEdits(ops, source);

			if (undoEdits.length > 0) {
				let range: Range | undefined;
				for (let i = 0; i < undoEdits.length; i++) {
					const op = undoEdits[i];
					if (!range) {
						range = Range.lift(op.range);
					} else {
						range = Range.plusRange(range, op.range);
					}
				}
				if (range) {

					const defer = new DeferredPromise<void>();
					const listener = addDisposableListener(getWindow(undefined), 'animationend', e => {
						if (e.animationName === 'kf-chat-editing-atomic-edit') { // CHECK with chat.css
							defer.complete();
							listener.dispose();
						}
					});

					this._editDecorations = this.modifiedModel.deltaDecorations(this._editDecorations, [{
						options: ChatEditingTextModelChangeService._atomicEditDecorationOptions,
						range
					}]);

					await Promise.any([defer.p, timeout(500)]); // wait for animation to finish but also time-cap it
					listener.dispose();
				}
			}


		} else {
			// EDIT a bit, then DONE
			const ops = textEdits.map(TextEdit.asEditOperation);
			const undoEdits = this._applyEdits(ops, source);
			maxLineNumber = undoEdits.reduce((max, op) => Math.max(max, op.range.startLineNumber), 0);
			rewriteRatio = Math.min(1, maxLineNumber / this.modifiedModel.getLineCount());

			const newDecorations: IModelDeltaDecoration[] = [
				// decorate pending edit (region)
				{
					options: ChatEditingTextModelChangeService._pendingEditDecorationOptions,
					range: new Range(maxLineNumber + 1, 1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
				}
			];

			if (maxLineNumber > 0) {
				// decorate last edit
				newDecorations.push({
					options: ChatEditingTextModelChangeService._lastEditDecorationOptions,
					range: new Range(maxLineNumber, 1, maxLineNumber, Number.MAX_SAFE_INTEGER)
				});
			}
			this._editDecorations = this.modifiedModel.deltaDecorations(this._editDecorations, newDecorations);

		}

		if (isLastEdits) {
			this._updateDiffInfoSeq();
			this._editDecorationClear.schedule();
		}

		return { rewriteRatio, maxLineNumber };
	}

	private _createEditSource(responseModel: IChatResponseModel | undefined) {

		if (!responseModel) {
			return EditSources.unknown({ name: 'editSessionUndoRedo' });
		}

		const sessionId = responseModel.session.sessionId;
		const request = responseModel.session.getRequests().at(-1);
		const languageId = this.modifiedModel.getLanguageId();
		const agent = responseModel.agent;
		const extensionId = VersionedExtensionId.tryCreate(agent?.extensionId.value, agent?.extensionVersion);

		if (responseModel.request?.locationData?.type === ChatAgentLocation.EditorInline) {

			return EditSources.inlineChatApplyEdit({
				modelId: request?.modelId,
				requestId: request?.id,
				sessionId,
				languageId,
				extensionId,
			});
		}

		return EditSources.chatApplyEdits({
			modelId: request?.modelId,
			requestId: request?.id,
			sessionId,
			languageId,
			mode: request?.modeInfo?.modeId,
			extensionId,
			codeBlockSuggestionId: request?.modeInfo?.applyCodeBlockSuggestionId,
		});
	}

	private _applyEdits(edits: ISingleEditOperation[], source: TextModelEditSource) {

		if (edits.length === 0) {
			return [];
		}

		try {
			this._isEditFromUs = true;
			// make the actual edit
			let result: ISingleEditOperation[] = [];

			this.modifiedModel.pushEditOperations(null, edits, (undoEdits) => {
				result = undoEdits;
				return null;
			}, undefined, source);

			return result;
		} finally {
			this._isEditFromUs = false;
		}
	}

	/**
	 * Keeps the current modified document as the final contents.
	 */
	public keep() {
		this.notifyHunkAction('accepted', { linesAdded: this.linesAdded, linesRemoved: this.linesRemoved, lineCount: this.lineChangeCount, hasRemainingEdits: false });
		this.originalModel.setValue(this.modifiedModel.createSnapshot());
		this._reset();
	}

	/**
	 * Undoes the current modified document as the final contents.
	 */
	public undo() {
		this.notifyHunkAction('rejected', { linesAdded: this.linesAdded, linesRemoved: this.linesRemoved, lineCount: this.lineChangeCount, hasRemainingEdits: false });
		this.modifiedModel.pushStackElement();
		this._applyEdits([(EditOperation.replace(this.modifiedModel.getFullModelRange(), this.originalModel.getValue()))], EditSources.chatUndoEdits());
		this.modifiedModel.pushStackElement();
		this._reset();
	}

	private _reset() {
		this._originalToModifiedEdit = StringEdit.empty;
		this._diffInfo.set(nullDocumentDiff, undefined);
		this._didUserEditModelFired = false;
	}

	public async resetDocumentValues(newOriginal: string | ITextSnapshot | undefined, newModified: string | undefined): Promise<void> {
		let didChange = false;
		if (newOriginal !== undefined) {
			this.originalModel.setValue(newOriginal);
			didChange = true;
		}
		if (newModified !== undefined && this.modifiedModel.getValue() !== newModified) {
			// NOTE that this isn't done via `setValue` so that the undo stack is preserved
			this.modifiedModel.pushStackElement();
			this._applyEdits([(EditOperation.replace(this.modifiedModel.getFullModelRange(), newModified))], EditSources.chatReset());
			this.modifiedModel.pushStackElement();
			didChange = true;
		}
		if (didChange) {
			await this._updateDiffInfoSeq();
		}
	}

	private _mirrorEdits(event: IModelContentChangedEvent) {
		const edit = offsetEditFromContentChanges(event.changes);
		const isExternalEdit = this._isExternalEditInProgress?.();

		if (this._isEditFromUs || isExternalEdit) {
			const e_sum = this._originalToModifiedEdit;
			const e_ai = edit;
			this._originalToModifiedEdit = e_sum.compose(e_ai);
			if (isExternalEdit) {
				this._updateDiffInfoSeq();
			}
		} else {

			//           e_ai
			//   d0 ---------------> s0
			//   |                   |
			//   |                   |
			//   | e_user_r          | e_user
			//   |                   |
			//   |                   |
			//   v       e_ai_r      v
			///  d1 ---------------> s1
			//
			// d0 - document snapshot
			// s0 - document
			// e_ai - ai edits
			// e_user - user edits
			//
			const e_ai = this._originalToModifiedEdit;
			const e_user = edit;

			const e_user_r = e_user.tryRebase(e_ai.inverse(this.originalModel.getValue()));

			if (e_user_r === undefined) {
				// user edits overlaps/conflicts with AI edits
				this._originalToModifiedEdit = e_ai.compose(e_user);
			} else {
				const edits = offsetEditToEditOperations(e_user_r, this.originalModel);
				this.originalModel.applyEdits(edits);
				this._originalToModifiedEdit = e_ai.rebaseSkipConflicting(e_user_r);
			}

			this._allEditsAreFromUs = false;
			this._updateDiffInfoSeq();
			if (!this._didUserEditModelFired) {
				this._didUserEditModelFired = true;
				this._didUserEditModel.fire();
			}
		}
	}

	private async _keepHunk(change: DetailedLineRangeMapping): Promise<boolean> {
		if (!this._diffInfo.get().changes.includes(change)) {
			// diffInfo should have model version ids and check them (instead of the caller doing that)
			return false;
		}
		const edits: ISingleEditOperation[] = [];
		for (const edit of change.innerChanges ?? []) {
			const newText = this.modifiedModel.getValueInRange(edit.modifiedRange);
			edits.push(EditOperation.replace(edit.originalRange, newText));
		}
		this.originalModel.pushEditOperations(null, edits, _ => null);
		await this._updateDiffInfoSeq('accepted');
		if (this._diffInfo.get().identical) {
			this._didAcceptOrRejectAllHunks.fire(ModifiedFileEntryState.Accepted);
		}
		this._accessibilitySignalService.playSignal(AccessibilitySignal.editsKept, { allowManyInParallel: true });
		return true;
	}

	private async _undoHunk(change: DetailedLineRangeMapping): Promise<boolean> {
		if (!this._diffInfo.get().changes.includes(change)) {
			return false;
		}
		const edits: ISingleEditOperation[] = [];
		for (const edit of change.innerChanges ?? []) {
			const newText = this.originalModel.getValueInRange(edit.originalRange);
			edits.push(EditOperation.replace(edit.modifiedRange, newText));
		}
		this.modifiedModel.pushEditOperations(null, edits, _ => null);
		await this._updateDiffInfoSeq('rejected');
		if (this._diffInfo.get().identical) {
			this._didAcceptOrRejectAllHunks.fire(ModifiedFileEntryState.Rejected);
		}
		this._accessibilitySignalService.playSignal(AccessibilitySignal.editsUndone, { allowManyInParallel: true });
		return true;
	}

	public async getDiffInfo() {
		if (!this._diffOperation) {
			this._updateDiffInfoSeq();
		}

		await this._diffOperation;
		return this._diffInfo.get();
	}


	private async _updateDiffInfoSeq(notifyAction: 'accepted' | 'rejected' | undefined = undefined) {
		const myDiffOperationId = ++this._diffOperationIds;
		await Promise.resolve(this._diffOperation);
		const previousCount = this.lineChangeCount;
		const previousAdded = this.linesAdded;
		const previousRemoved = this.linesRemoved;
		if (this._diffOperationIds === myDiffOperationId) {
			const thisDiffOperation = this._updateDiffInfo();
			this._diffOperation = thisDiffOperation;
			await thisDiffOperation;
			if (notifyAction) {
				const affectedLines = {
					linesAdded: previousAdded - this.linesAdded,
					linesRemoved: previousRemoved - this.linesRemoved,
					lineCount: previousCount - this.lineChangeCount,
					hasRemainingEdits: this.lineChangeCount > 0
				};
				this.notifyHunkAction(notifyAction, affectedLines);
			}
		}
	}

	public hasHunkAt(range: IRange) {
		// return true if the range overlaps a diff range
		return this._diffInfo.get().changes.some(c => c.modified.intersectsStrict(LineRange.fromRangeInclusive(range)));
	}

	private async _updateDiffInfo(): Promise<IDocumentDiff | undefined> {

		if (this.originalModel.isDisposed() || this.modifiedModel.isDisposed() || this._store.isDisposed) {
			return undefined;
		}

		if (this.state.get() !== ModifiedFileEntryState.Modified) {
			this._diffInfo.set(nullDocumentDiff, undefined);
			this._originalToModifiedEdit = StringEdit.empty;
			return nullDocumentDiff;
		}

		const docVersionNow = this.modifiedModel.getVersionId();
		const snapshotVersionNow = this.originalModel.getVersionId();

		const diff = await this._editorWorkerService.computeDiff(
			this.originalModel.uri,
			this.modifiedModel.uri,
			{
				ignoreTrimWhitespace: false, // NEVER ignore whitespace so that undo/accept edits are correct and so that all changes (1 of 2) are spelled out
				computeMoves: false,
				maxComputationTimeMs: 3000
			},
			'advanced'
		);

		if (this.originalModel.isDisposed() || this.modifiedModel.isDisposed() || this._store.isDisposed) {
			return undefined;
		}

		// only update the diff if the documents didn't change in the meantime
		if (this.modifiedModel.getVersionId() === docVersionNow && this.originalModel.getVersionId() === snapshotVersionNow) {
			const diff2 = diff ?? nullDocumentDiff;
			this._diffInfo.set(diff2, undefined);
			this._originalToModifiedEdit = offsetEditFromLineRangeMapping(this.originalModel, this.modifiedModel, diff2.changes);
			return diff2;
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingTextModelContentProviders.ts]---
Location: vscode-main/src/vs/workbench/contrib/chat/browser/chatEditing/chatEditingTextModelContentProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../../base/common/network.js';
import { URI, UriComponents } from '../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModelContentProvider } from '../../../../../editor/common/services/resolverService.js';
import { IChatEditingService } from '../../common/chatEditingService.js';

type ChatEditingTextModelContentQueryData = { kind: 'doc'; documentId: string; chatSessionResource: UriComponents };

export class ChatEditingTextModelContentProvider implements ITextModelContentProvider {
	public static readonly scheme = Schemas.chatEditingModel;

	public static getFileURI(chatSessionResource: URI, documentId: string, path: string): URI {
		return URI.from({
			scheme: ChatEditingTextModelContentProvider.scheme,
			path,
			query: JSON.stringify({ kind: 'doc', documentId, chatSessionResource } satisfies ChatEditingTextModelContentQueryData),
		});
	}

	constructor(
		private readonly _chatEditingService: IChatEditingService,
		@IModelService private readonly _modelService: IModelService,
	) { }

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}

		const data: ChatEditingTextModelContentQueryData = JSON.parse(resource.query);

		const session = this._chatEditingService.getEditingSession(URI.revive(data.chatSessionResource));

		const entry = session?.entries.get().find(candidate => candidate.entryId === data.documentId);
		if (!entry) {
			return null;
		}

		return this._modelService.getModel(entry.originalURI);
	}
}

type ChatEditingSnapshotTextModelContentQueryData = { session: UriComponents; requestId: string | undefined; undoStop: string | undefined; scheme: string | undefined };

export class ChatEditingSnapshotTextModelContentProvider implements ITextModelContentProvider {
	public static getSnapshotFileURI(chatSessionResource: URI, requestId: string | undefined, undoStop: string | undefined, path: string, scheme?: string): URI {
		return URI.from({
			scheme: Schemas.chatEditingSnapshotScheme,
			path,
			query: JSON.stringify({ session: chatSessionResource, requestId: requestId ?? '', undoStop: undoStop ?? '', scheme } satisfies ChatEditingSnapshotTextModelContentQueryData),
		});
	}

	constructor(
		private readonly _chatEditingService: IChatEditingService,
		@IModelService private readonly _modelService: IModelService,
	) { }

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing && !existing.isDisposed()) {
			return existing;
		}

		const data: ChatEditingSnapshotTextModelContentQueryData = JSON.parse(resource.query);
		const session = this._chatEditingService.getEditingSession(URI.revive(data.session));
		if (!session || !data.requestId) {
			return null;
		}

		return session.getSnapshotModel(data.requestId, data.undoStop || undefined, resource);
	}
}
```

--------------------------------------------------------------------------------

````

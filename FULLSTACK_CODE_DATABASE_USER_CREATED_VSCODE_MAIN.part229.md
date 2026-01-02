---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 229
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 229 of 552)

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

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/controller/inlineCompletionsController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { alert } from '../../../../../base/browser/ui/aria/aria.js';
import { timeout } from '../../../../../base/common/async.js';
import { cancelOnDispose } from '../../../../../base/common/cancellation.js';
import { createHotClass } from '../../../../../base/common/hotReloadHelpers.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ITransaction, autorun, derived, derivedDisposable, derivedObservableWithCache, observableFromEvent, observableSignal, observableValue, runOnChange, runOnChangeWithStore, transaction, waitForState } from '../../../../../base/common/observable.js';
import { isEqual } from '../../../../../base/common/resources.js';
import { isUndefined } from '../../../../../base/common/types.js';
import { localize } from '../../../../../nls.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { AccessibilitySignal, IAccessibilitySignalService } from '../../../../../platform/accessibilitySignal/browser/accessibilitySignalService.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { hotClassGetOriginalInstance } from '../../../../../platform/observable/common/wrapInHotClass.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../browser/observableCodeEditor.js';
import { TriggerInlineEditCommandsRegistry } from '../../../../browser/triggerInlineEditCommandsRegistry.js';
import { getOuterEditor } from '../../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { CursorChangeReason } from '../../../../common/cursorEvents.js';
import { ILanguageFeatureDebounceService } from '../../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { FIND_IDS } from '../../../find/browser/findModel.js';
import { InsertLineAfterAction, InsertLineBeforeAction } from '../../../linesOperations/browser/linesOperations.js';
import { InlineSuggestionHintsContentWidget } from '../hintsWidget/inlineCompletionsHintsWidget.js';
import { TextModelChangeRecorder } from '../model/changeRecorder.js';
import { InlineCompletionsModel } from '../model/inlineCompletionsModel.js';
import { ObservableSuggestWidgetAdapter } from '../model/suggestWidgetAdapter.js';
import { ObservableContextKeyService } from '../utils.js';
import { InlineSuggestionsView } from '../view/inlineSuggestionsView.js';
import { inlineSuggestCommitId } from './commandIds.js';
import { InlineCompletionContextKeys } from './inlineCompletionContextKeys.js';

export class InlineCompletionsController extends Disposable {
	private static readonly _instances = new Set<InlineCompletionsController>();

	public static hot = createHotClass(this);
	public static ID = 'editor.contrib.inlineCompletionsController';

	/**
	 * Find the controller in the focused editor or in the outer editor (if applicable)
	 */
	public static getInFocusedEditorOrParent(accessor: ServicesAccessor): InlineCompletionsController | null {
		const outerEditor = getOuterEditor(accessor);
		if (!outerEditor) {
			return null;
		}
		return InlineCompletionsController.get(outerEditor);
	}

	public static get(editor: ICodeEditor): InlineCompletionsController | null {
		return hotClassGetOriginalInstance(editor.getContribution<InlineCompletionsController>(InlineCompletionsController.ID));
	}

	private readonly _editorObs;
	private readonly _positions;

	private readonly _suggestWidgetAdapter;

	private readonly _enabledInConfig;
	private readonly _isScreenReaderEnabled;
	private readonly _editorDictationInProgress;
	private readonly _enabled = derived(this, reader => this._enabledInConfig.read(reader) && (!this._isScreenReaderEnabled.read(reader) || !this._editorDictationInProgress.read(reader)));

	private readonly _debounceValue;

	private readonly _focusIsInMenu = observableValue<boolean>(this, false);
	private readonly _focusIsInEditorOrMenu = derived(this, reader => {
		const editorHasFocus = this._editorObs.isFocused.read(reader);
		const menuHasFocus = this._focusIsInMenu.read(reader);
		return editorHasFocus || menuHasFocus;
	});

	private readonly _cursorIsInIndentation = derived(this, reader => {
		const cursorPos = this._editorObs.cursorPosition.read(reader);
		if (cursorPos === null) { return false; }
		const model = this._editorObs.model.read(reader);
		if (!model) { return false; }
		this._editorObs.versionId.read(reader);
		const indentMaxColumn = model.getLineIndentColumn(cursorPos.lineNumber);
		return cursorPos.column <= indentMaxColumn;
	});

	public readonly model = derivedDisposable<InlineCompletionsModel | undefined>(this, reader => {
		if (this._editorObs.isReadonly.read(reader)) { return undefined; }
		const textModel = this._editorObs.model.read(reader);
		if (!textModel) { return undefined; }

		const model: InlineCompletionsModel = this._instantiationService.createInstance(
			InlineCompletionsModel,
			textModel,
			this._suggestWidgetAdapter.selectedItem,
			this._editorObs.versionId,
			this._positions,
			this._debounceValue,
			this._enabled,
			this.editor,
		);
		return model;
	});

	private readonly _playAccessibilitySignal = observableSignal(this);

	private readonly _hideInlineEditOnSelectionChange;

	protected readonly _view = derived(reader => reader.store.add(this._instantiationService.createInstance(InlineSuggestionsView.hot.read(reader), this.editor, this.model, this._focusIsInMenu)));

	constructor(
		public readonly editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ICommandService private readonly _commandService: ICommandService,
		@ILanguageFeatureDebounceService private readonly _debounceService: ILanguageFeatureDebounceService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IAccessibilitySignalService private readonly _accessibilitySignalService: IAccessibilitySignalService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super();
		this._editorObs = observableCodeEditor(this.editor);
		this._positions = derived(this, reader => this._editorObs.selections.read(reader)?.map(s => s.getEndPosition()) ?? [new Position(1, 1)]);
		this._suggestWidgetAdapter = this._register(new ObservableSuggestWidgetAdapter(
			this._editorObs,
			item => this.model.get()?.handleSuggestAccepted(item),
			() => this.model.get()?.selectedInlineCompletion.get()?.getSingleTextEdit(),
		));
		this._enabledInConfig = observableFromEvent(this, this.editor.onDidChangeConfiguration, () => this.editor.getOption(EditorOption.inlineSuggest).enabled);
		this._isScreenReaderEnabled = observableFromEvent(this, this._accessibilityService.onDidChangeScreenReaderOptimized, () => this._accessibilityService.isScreenReaderOptimized());
		this._editorDictationInProgress = observableFromEvent(this,
			this._contextKeyService.onDidChangeContext,
			() => this._contextKeyService.getContext(this.editor.getDomNode()).getValue('editorDictation.inProgress') === true
		);

		this._debounceValue = this._debounceService.for(
			this._languageFeaturesService.inlineCompletionsProvider,
			'InlineCompletionsDebounce',
			{ min: 50, max: 50 }
		);
		this.model.recomputeInitiallyAndOnChange(this._store);
		this._hideInlineEditOnSelectionChange = this._editorObs.getOption(EditorOption.inlineSuggest).map(val => true);

		this._view.recomputeInitiallyAndOnChange(this._store);

		InlineCompletionsController._instances.add(this);
		this._register(toDisposable(() => InlineCompletionsController._instances.delete(this)));

		this._register(autorun(reader => {
			// Cancel all other inline completions when a new one starts
			const model = this.model.read(reader);
			if (!model) { return; }
			const state = model.state.read(reader);
			if (!state) { return; }
			if (!this._focusIsInEditorOrMenu.read(undefined)) { return; }

			// This controller is in focus, hence reject others.
			// However if we display a NES that relates to another edit then trigger NES on that related controller
			const nextEditUri = state.kind === 'inlineEdit' ? state.nextEditUri : undefined;
			for (const ctrl of InlineCompletionsController._instances) {
				if (ctrl === this) {
					continue;
				} else if (nextEditUri && isEqual(nextEditUri, ctrl.editor.getModel()?.uri)) {
					// The next edit in other edito is related to this controller, trigger it.
					ctrl.model.read(undefined)?.trigger();
				} else {
					ctrl.reject();
				}
			}
		}));
		this._register(autorun(reader => {
			// Cancel all other inline completions when a new one starts
			const model = this.model.read(reader);
			const uri = this.editor.getModel()?.uri;
			if (!model || !uri) { return; }

			// This NES was accepted, its possible there is an NES that points to this editor.
			// I.e. there's an NES that reads `Go To Next Edit`,
			// If there is one that points to this editor, then we need to hide that as this NES was accepted.
			reader.store.add(model.onDidAccept(() => {
				for (const ctrl of InlineCompletionsController._instances) {
					if (ctrl === this) {
						continue;
					}
					// Find the nes from another editor that points to this.
					const state = ctrl.model.read(undefined)?.state.read(undefined);
					if (state?.kind === 'inlineEdit' && isEqual(state.nextEditUri, uri)) {
						ctrl.model.read(undefined)?.stop('automatic');
					}
				}
			}));

		}));

		this._register(runOnChange(this._editorObs.onDidType, (_value, _changes) => {
			if (this._enabled.get()) {
				this.model.get()?.trigger();
			}
		}));

		this._register(runOnChange(this._editorObs.onDidPaste, (_value, _changes) => {
			if (this._enabled.get()) {
				this.model.get()?.trigger();
			}
		}));

		// These commands don't trigger onDidType.
		const triggerCommands = new Set([
			CoreEditingCommands.Tab.id,
			CoreEditingCommands.DeleteLeft.id,
			CoreEditingCommands.DeleteRight.id,
			inlineSuggestCommitId,
			'acceptSelectedSuggestion',
			InsertLineAfterAction.ID,
			InsertLineBeforeAction.ID,
			FIND_IDS.NextMatchFindAction,
			...TriggerInlineEditCommandsRegistry.getRegisteredCommands(),
		]);
		this._register(this._commandService.onDidExecuteCommand((e) => {
			if (triggerCommands.has(e.commandId) && editor.hasTextFocus() && this._enabled.get()) {
				let noDelay = false;
				if (e.commandId === inlineSuggestCommitId) {
					noDelay = true;
				}
				this._editorObs.forceUpdate(tx => {
					/** @description onDidExecuteCommand */
					this.model.get()?.trigger(tx, { noDelay });
				});
			}
		}));

		this._register(runOnChange(this._editorObs.selections, (_value, _, changes) => {
			if (changes.some(e => e.reason === CursorChangeReason.Explicit || e.source === 'api')) {
				if (!this._hideInlineEditOnSelectionChange.get() && this.model.get()?.state.get()?.kind === 'inlineEdit') {
					return;
				}
				const m = this.model.get();
				if (!m) { return; }
				if (m.state.get()?.kind === 'ghostText') {
					this.model.get()?.stop();
				}
			}
		}));

		this._register(autorun(reader => {
			const isFocused = this._focusIsInEditorOrMenu.read(reader);
			const model = this.model.read(undefined);
			if (isFocused) {
				// If this model already has an NES for another editor, then leave as is
				// Else stop other models.
				const state = model?.state.read(undefined);
				if (!state || state.kind !== 'inlineEdit' || !state.nextEditUri) {
					transaction(tx => {
						for (const ctrl of InlineCompletionsController._instances) {
							if (ctrl !== this) {
								ctrl.model.read(undefined)?.stop('automatic', tx);
							}
						}
					});
				}
				return;
			}

			// This is a hidden setting very useful for debugging
			if (this._contextKeyService.getContextKeyValue<boolean>('accessibleViewIsShown')
				|| this._configurationService.getValue('editor.inlineSuggest.keepOnBlur')
				|| editor.getOption(EditorOption.inlineSuggest).keepOnBlur
				|| InlineSuggestionHintsContentWidget.dropDownVisible) {
				return;
			}

			if (!model) { return; }
			if (model.state.read(undefined)?.inlineSuggestion?.isFromExplicitRequest && model.inlineEditAvailable.read(undefined)) {
				// dont hide inline edits on blur when requested explicitly
				return;
			}

			transaction(tx => {
				/** @description InlineCompletionsController.onDidBlurEditorWidget */
				model.stop('automatic', tx);
			});
		}));

		this._register(autorun(reader => {
			/** @description InlineCompletionsController.forceRenderingAbove */
			const state = this.model.read(reader)?.inlineCompletionState.read(reader);
			if (state?.suggestItem) {
				if (state.primaryGhostText.lineCount >= 2) {
					this._suggestWidgetAdapter.forceRenderingAbove();
				}
			} else {
				this._suggestWidgetAdapter.stopForceRenderingAbove();
			}
		}));
		this._register(toDisposable(() => {
			this._suggestWidgetAdapter.stopForceRenderingAbove();
		}));

		const currentInlineCompletionBySemanticId = derivedObservableWithCache<string | undefined>(this, (reader, last) => {
			const model = this.model.read(reader);
			const state = model?.state.read(reader);
			if (this._suggestWidgetAdapter.selectedItem.get()) {
				return last;
			}
			return state?.inlineSuggestion?.semanticId;
		});
		this._register(runOnChangeWithStore(derived(reader => {
			this._playAccessibilitySignal.read(reader);
			currentInlineCompletionBySemanticId.read(reader);
			return {};
		}), async (_value, _, _deltas, store) => {
			/** @description InlineCompletionsController.playAccessibilitySignalAndReadSuggestion */
			let model = this.model.get();
			let state = model?.state.get();
			if (!state || !model) { return; }

			await timeout(50, cancelOnDispose(store));
			await waitForState(this._suggestWidgetAdapter.selectedItem, isUndefined, () => false, cancelOnDispose(store));

			model = this.model.get();
			state = model?.state.get();
			if (!state || !model) { return; }
			const lineText = state.kind === 'ghostText' ? model.textModel.getLineContent(state.primaryGhostText.lineNumber) : '';
			this._accessibilitySignalService.playSignal(state.kind === 'ghostText' ? AccessibilitySignal.inlineSuggestion : AccessibilitySignal.nextEditSuggestion);

			if (this.editor.getOption(EditorOption.screenReaderAnnounceInlineSuggestion)) {
				if (state.kind === 'ghostText') {
					this._provideScreenReaderUpdate(state.primaryGhostText.renderForScreenReader(lineText));
				} else {
					this._provideScreenReaderUpdate(''); // Only announce Alt+F2
				}
			}
		}));

		// TODO@hediet
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('accessibility.verbosity.inlineCompletions')) {
				this.editor.updateOptions({ inlineCompletionsAccessibilityVerbose: this._configurationService.getValue('accessibility.verbosity.inlineCompletions') });
			}
		}));
		this.editor.updateOptions({ inlineCompletionsAccessibilityVerbose: this._configurationService.getValue('accessibility.verbosity.inlineCompletions') });

		const contextKeySvcObs = new ObservableContextKeyService(this._contextKeyService);

		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.cursorInIndentation, this._cursorIsInIndentation));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.hasSelection, reader => !this._editorObs.cursorSelection.read(reader)?.isEmpty()));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.cursorAtInlineEdit, this.model.map((m, reader) => m?.inlineEditState?.read(reader)?.cursorAtInlineEdit.read(reader))));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.tabShouldAcceptInlineEdit, this.model.map((m, r) => !!m?.tabShouldAcceptInlineEdit.read(r))));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.tabShouldJumpToInlineEdit, this.model.map((m, r) => !!m?.tabShouldJumpToInlineEdit.read(r))));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.inlineEditVisible, reader => this.model.read(reader)?.inlineEditState.read(reader) !== undefined));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.inlineSuggestionHasIndentation,
			reader => this.model.read(reader)?.getIndentationInfo(reader)?.startsWithIndentation
		));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.inlineSuggestionHasIndentationLessThanTabSize,
			reader => this.model.read(reader)?.getIndentationInfo(reader)?.startsWithIndentationLessThanTabSize
		));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.suppressSuggestions, reader => {
			const model = this.model.read(reader);
			const state = model?.inlineCompletionState.read(reader);
			return state?.primaryGhostText && state?.inlineSuggestion ? state.inlineSuggestion.source.inlineSuggestions.suppressSuggestions : undefined;
		}));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.inlineSuggestionAlternativeActionVisible, reader => {
			const model = this.model.read(reader);
			const state = model?.inlineEditState.read(reader);
			const action = state?.inlineSuggestion.action;
			return action && action.kind === 'edit' && action.alternativeAction !== undefined;
		}));
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.inlineSuggestionVisible, reader => {
			const model = this.model.read(reader);
			const state = model?.inlineCompletionState.read(reader);
			return !!state?.inlineSuggestion && state?.primaryGhostText !== undefined && !state?.primaryGhostText.isEmpty();
		}));
		const firstGhostTextPos = derived(this, reader => {
			const model = this.model.read(reader);
			const state = model?.inlineCompletionState.read(reader);
			const primaryGhostText = state?.primaryGhostText;
			if (!primaryGhostText || primaryGhostText.isEmpty()) {
				return undefined;
			}
			const firstPartPos = new Position(primaryGhostText.lineNumber, primaryGhostText.parts[0].column);
			return firstPartPos;
		});
		this._register(contextKeySvcObs.bind(InlineCompletionContextKeys.cursorBeforeGhostText, reader => {
			const firstPartPos = firstGhostTextPos.read(reader);
			if (!firstPartPos) {
				return false;
			}
			const cursorPos = this._editorObs.cursorPosition.read(reader);
			if (!cursorPos) {
				return false;
			}
			return firstPartPos.equals(cursorPos);
		}));

		this._register(this._instantiationService.createInstance(TextModelChangeRecorder, this.editor));
	}

	public playAccessibilitySignal(tx: ITransaction) {
		this._playAccessibilitySignal.trigger(tx);
	}

	private _provideScreenReaderUpdate(content: string): void {
		const accessibleViewShowing = this._contextKeyService.getContextKeyValue<boolean>('accessibleViewIsShown');
		const accessibleViewKeybinding = this._keybindingService.lookupKeybinding('editor.action.accessibleView');
		let hint: string | undefined;
		if (!accessibleViewShowing && accessibleViewKeybinding && this.editor.getOption(EditorOption.inlineCompletionsAccessibilityVerbose)) {
			hint = localize('showAccessibleViewHint', "Inspect this in the accessible view ({0})", accessibleViewKeybinding.getAriaLabel());
		}
		alert(hint ? content + ', ' + hint : content);
	}

	public shouldShowHoverAt(range: Range) {
		const ghostText = this.model.get()?.primaryGhostText.get();
		if (!ghostText) {
			return false;
		}
		return ghostText.parts.some(p => range.containsPosition(new Position(ghostText.lineNumber, p.column)));
	}

	public shouldShowHoverAtViewZone(viewZoneId: string): boolean {
		return this._view.get().shouldShowHoverAtViewZone(viewZoneId);
	}

	public reject(): void {
		transaction(tx => {
			const m = this.model.get();
			if (m) {
				m.stop('explicitCancel', tx);
				// Only if this controller is in focus can we cancel others.
				if (this._focusIsInEditorOrMenu.get()) {
					for (const ctrl of InlineCompletionsController._instances) {
						if (ctrl !== this) {
							ctrl.model.get()?.stop('automatic', tx);
						}
					}
				}
			}
		});
	}

	public jump(): void {
		const m = this.model.get();
		if (m) {
			m.jump();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/hoverParticipant.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/hoverParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../../base/browser/dom.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, autorunWithStore, constObservable } from '../../../../../base/common/observable.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../../browser/editorBrowser.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Range } from '../../../../common/core/range.js';
import { IModelDecoration } from '../../../../common/model.js';
import { HoverAnchor, HoverAnchorType, HoverForeignElementAnchor, IEditorHoverParticipant, IEditorHoverRenderContext, IHoverPart, IRenderedHoverPart, IRenderedHoverParts, RenderedHoverParts } from '../../../hover/browser/hoverTypes.js';
import { InlineCompletionsController } from '../controller/inlineCompletionsController.js';
import { InlineSuggestionHintsContentWidget } from './inlineCompletionsHintsWidget.js';
import { IMarkdownRendererService } from '../../../../../platform/markdown/browser/markdownRenderer.js';
import * as nls from '../../../../../nls.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { GhostTextView } from '../view/ghostText/ghostTextView.js';

export class InlineCompletionsHover implements IHoverPart {
	constructor(
		public readonly owner: IEditorHoverParticipant<InlineCompletionsHover>,
		public readonly range: Range,
		public readonly controller: InlineCompletionsController
	) { }

	public isValidForHoverAnchor(anchor: HoverAnchor): boolean {
		return (
			anchor.type === HoverAnchorType.Range
			&& this.range.startColumn <= anchor.range.startColumn
			&& this.range.endColumn >= anchor.range.endColumn
		);
	}
}

export class InlineCompletionsHoverParticipant implements IEditorHoverParticipant<InlineCompletionsHover> {

	public readonly hoverOrdinal: number = 4;

	constructor(
		private readonly _editor: ICodeEditor,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
	}

	suggestHoverAnchor(mouseEvent: IEditorMouseEvent): HoverAnchor | null {
		const controller = InlineCompletionsController.get(this._editor);
		if (!controller) {
			return null;
		}

		const target = mouseEvent.target;
		if (target.type === MouseTargetType.CONTENT_VIEW_ZONE) {
			// handle the case where the mouse is over the view zone
			const viewZoneData = target.detail;
			if (controller.shouldShowHoverAtViewZone(viewZoneData.viewZoneId)) {
				return new HoverForeignElementAnchor(1000, this, Range.fromPositions(this._editor.getModel()!.validatePosition(viewZoneData.positionBefore || viewZoneData.position)), mouseEvent.event.posx, mouseEvent.event.posy, false);
			}
		}
		if (target.type === MouseTargetType.CONTENT_EMPTY) {
			// handle the case where the mouse is over the empty portion of a line following ghost text
			if (controller.shouldShowHoverAt(target.range)) {
				return new HoverForeignElementAnchor(1000, this, target.range, mouseEvent.event.posx, mouseEvent.event.posy, false);
			}
		}
		if (target.type === MouseTargetType.CONTENT_TEXT) {
			// handle the case where the mouse is directly over ghost text
			const mightBeForeignElement = target.detail.mightBeForeignElement;
			if (mightBeForeignElement && controller.shouldShowHoverAt(target.range)) {
				return new HoverForeignElementAnchor(1000, this, target.range, mouseEvent.event.posx, mouseEvent.event.posy, false);
			}
		}
		if (target.type === MouseTargetType.CONTENT_WIDGET && target.element) {
			const ctx = GhostTextView.getWarningWidgetContext(target.element);
			if (ctx && controller.shouldShowHoverAt(ctx.range)) {
				return new HoverForeignElementAnchor(1000, this, ctx.range, mouseEvent.event.posx, mouseEvent.event.posy, false);
			}
		}
		return null;
	}

	computeSync(anchor: HoverAnchor, lineDecorations: IModelDecoration[]): InlineCompletionsHover[] {
		if (this._editor.getOption(EditorOption.inlineSuggest).showToolbar !== 'onHover') {
			return [];
		}

		const controller = InlineCompletionsController.get(this._editor);
		if (controller && controller.shouldShowHoverAt(anchor.range)) {
			return [new InlineCompletionsHover(this, anchor.range, controller)];
		}
		return [];
	}

	renderHoverParts(context: IEditorHoverRenderContext, hoverParts: InlineCompletionsHover[]): IRenderedHoverParts<InlineCompletionsHover> {
		const disposables = new DisposableStore();
		const part = hoverParts[0];

		this._telemetryService.publicLog2<{}, {
			owner: 'hediet';
			comment: 'This event tracks whenever an inline completion hover is shown.';
		}>('inlineCompletionHover.shown');

		if (this.accessibilityService.isScreenReaderOptimized() && !this._editor.getOption(EditorOption.screenReaderAnnounceInlineSuggestion)) {
			disposables.add(this.renderScreenReaderText(context, part));
		}

		const model = part.controller.model.get()!;
		const widgetNode: HTMLElement = document.createElement('div');
		context.fragment.appendChild(widgetNode);

		disposables.add(autorunWithStore((reader, store) => {
			const w = store.add(this._instantiationService.createInstance(
				InlineSuggestionHintsContentWidget.hot.read(reader),
				this._editor,
				false,
				constObservable(null),
				model.selectedInlineCompletionIndex,
				model.inlineCompletionsCount,
				model.activeCommands,
				model.warning,
				() => {
					context.onContentsChanged();
				},
			));
			widgetNode.replaceChildren(w.getDomNode());
		}));

		model.triggerExplicitly();

		const renderedHoverPart: IRenderedHoverPart<InlineCompletionsHover> = {
			hoverPart: part,
			hoverElement: widgetNode,
			dispose() { disposables.dispose(); }
		};
		return new RenderedHoverParts([renderedHoverPart]);
	}

	getAccessibleContent(hoverPart: InlineCompletionsHover): string {
		return nls.localize('hoverAccessibilityStatusBar', 'There are inline completions here');
	}

	private renderScreenReaderText(context: IEditorHoverRenderContext, part: InlineCompletionsHover): IDisposable {
		const disposables = new DisposableStore();
		const $ = dom.$;
		const markdownHoverElement = $('div.hover-row.markdown-hover');
		const hoverContentsElement = dom.append(markdownHoverElement, $('div.hover-contents', { ['aria-live']: 'assertive' }));
		const render = (code: string) => {
			const inlineSuggestionAvailable = nls.localize('inlineSuggestionFollows', "Suggestion:");
			const renderedContents = disposables.add(this._markdownRendererService.render(new MarkdownString().appendText(inlineSuggestionAvailable).appendCodeblock('text', code), {
				context: this._editor,
				asyncRenderCallback: () => {
					hoverContentsElement.className = 'hover-contents code-hover-contents';
					context.onContentsChanged();
				}
			}));
			hoverContentsElement.replaceChildren(renderedContents.element);
		};

		disposables.add(autorun(reader => {
			/** @description update hover */
			const ghostText = part.controller.model.read(reader)?.primaryGhostText.read(reader);
			if (ghostText) {
				const lineText = this._editor.getModel()!.getLineContent(ghostText.lineNumber);
				render(ghostText.renderForScreenReader(lineText));
			} else {
				dom.reset(hoverContentsElement);
			}
		}));

		context.fragment.appendChild(markdownHoverElement);
		return disposables;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/inlineCompletionsHintsWidget.css]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/inlineCompletionsHintsWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .inlineSuggestionsHints {
	padding: 4px;

	.warningMessage p {
		margin: 0;
	}
}

.monaco-editor .inlineSuggestionsHints.withBorder {
	z-index: 39;
	color: var(--vscode-editorHoverWidget-foreground);
	background-color: var(--vscode-editorHoverWidget-background);
	border: 1px solid var(--vscode-editorHoverWidget-border);
}

.monaco-editor .inlineSuggestionsHints a {
	color: var(--vscode-foreground) !important;
}

.monaco-editor .inlineSuggestionsHints a:hover {
	color: var(--vscode-foreground) !important;
}

.monaco-editor .inlineSuggestionsHints .keybinding {
	display: flex;
	margin-left: 4px;
	opacity: 0.6;
}

.monaco-editor .inlineSuggestionsHints .keybinding .monaco-keybinding-key {
	font-size: 8px;
	padding: 2px 3px;
}

.monaco-editor .inlineSuggestionsHints .availableSuggestionCount a {
	display: flex;
	min-width: 19px;
	justify-content: center;
}

.monaco-editor .inlineSuggestionStatusBarItemLabel {
	margin-right: 2px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/inlineCompletionsHintsWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/hintsWidget/inlineCompletionsHintsWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h, n } from '../../../../../base/browser/dom.js';
import { renderMarkdown } from '../../../../../base/browser/markdownRenderer.js';
import { ActionViewItem } from '../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { KeybindingLabel, unthemedKeybindingLabelOptions } from '../../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { Action, IAction, Separator } from '../../../../../base/common/actions.js';
import { equals } from '../../../../../base/common/arrays.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { createHotClass } from '../../../../../base/common/hotReloadHelpers.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, autorun, autorunWithStore, derived, derivedObservableWithCache, observableFromEvent } from '../../../../../base/common/observable.js';
import { OS } from '../../../../../base/common/platform.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { MenuEntryActionViewItem, getActionBarActions } from '../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuWorkbenchToolBarOptions, WorkbenchToolBar } from '../../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../../browser/editorBrowser.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { Position } from '../../../../common/core/position.js';
import { InlineCompletionCommand, InlineCompletionTriggerKind, InlineCompletionWarning } from '../../../../common/languages.js';
import { PositionAffinity } from '../../../../common/model.js';
import { showNextInlineSuggestionActionId, showPreviousInlineSuggestionActionId } from '../controller/commandIds.js';
import { InlineCompletionsModel } from '../model/inlineCompletionsModel.js';
import './inlineCompletionsHintsWidget.css';

export class InlineCompletionsHintsWidget extends Disposable {
	private readonly alwaysShowToolbar;

	private sessionPosition: Position | undefined;

	private readonly position;

	constructor(
		private readonly editor: ICodeEditor,
		private readonly model: IObservable<InlineCompletionsModel | undefined>,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.alwaysShowToolbar = observableFromEvent(this, this.editor.onDidChangeConfiguration, () => this.editor.getOption(EditorOption.inlineSuggest).showToolbar === 'always');
		this.sessionPosition = undefined;
		this.position = derived(this, reader => {
			const ghostText = this.model.read(reader)?.primaryGhostText.read(reader);

			if (!this.alwaysShowToolbar.read(reader) || !ghostText || ghostText.parts.length === 0) {
				this.sessionPosition = undefined;
				return null;
			}

			const firstColumn = ghostText.parts[0].column;
			if (this.sessionPosition && this.sessionPosition.lineNumber !== ghostText.lineNumber) {
				this.sessionPosition = undefined;
			}

			const position = new Position(ghostText.lineNumber, Math.min(firstColumn, this.sessionPosition?.column ?? Number.MAX_SAFE_INTEGER));
			this.sessionPosition = position;
			return position;
		});

		this._register(autorunWithStore((reader, store) => {
			/** @description setup content widget */
			const model = this.model.read(reader);
			if (!model || !this.alwaysShowToolbar.read(reader)) {
				return;
			}

			const contentWidgetValue = derived((reader) => {
				const contentWidget = reader.store.add(this.instantiationService.createInstance(
					InlineSuggestionHintsContentWidget.hot.read(reader),
					this.editor,
					true,
					this.position,
					model.selectedInlineCompletionIndex,
					model.inlineCompletionsCount,
					model.activeCommands,
					model.warning,
					() => { },
				));
				editor.addContentWidget(contentWidget);
				reader.store.add(toDisposable(() => editor.removeContentWidget(contentWidget)));

				reader.store.add(autorun(reader => {
					/** @description request explicit */
					const position = this.position.read(reader);
					if (!position) {
						return;
					}
					if (model.lastTriggerKind.read(reader) !== InlineCompletionTriggerKind.Explicit) {
						model.triggerExplicitly();
					}
				}));
				return contentWidget;
			});

			const hadPosition = derivedObservableWithCache(this, (reader, lastValue) => !!this.position.read(reader) || !!lastValue);
			store.add(autorun(reader => {
				if (hadPosition.read(reader)) {
					contentWidgetValue.read(reader);
				}
			}));
		}));
	}
}

const inlineSuggestionHintsNextIcon = registerIcon('inline-suggestion-hints-next', Codicon.chevronRight, localize('parameterHintsNextIcon', 'Icon for show next parameter hint.'));
const inlineSuggestionHintsPreviousIcon = registerIcon('inline-suggestion-hints-previous', Codicon.chevronLeft, localize('parameterHintsPreviousIcon', 'Icon for show previous parameter hint.'));

export class InlineSuggestionHintsContentWidget extends Disposable implements IContentWidget {
	public static readonly hot = createHotClass(this);

	private static _dropDownVisible = false;
	public static get dropDownVisible() { return this._dropDownVisible; }

	private static id = 0;

	private readonly id;
	public readonly allowEditorOverflow;
	public readonly suppressMouseDown;

	private readonly _warningMessageContentNode;

	private readonly _warningMessageNode;

	private readonly nodes;

	private createCommandAction(commandId: string, label: string, iconClassName: string): Action {
		const action = new Action(
			commandId,
			label,
			iconClassName,
			true,
			() => this._commandService.executeCommand(commandId),
		);
		const kb = this.keybindingService.lookupKeybinding(commandId, this._contextKeyService);
		let tooltip = label;
		if (kb) {
			tooltip = localize({ key: 'content', comment: ['A label', 'A keybinding'] }, '{0} ({1})', label, kb.getLabel());
		}
		action.tooltip = tooltip;
		return action;
	}

	private readonly previousAction;
	private readonly availableSuggestionCountAction;
	private readonly nextAction;

	private readonly toolBar: CustomizedMenuWorkbenchToolBar;

	// TODO@hediet: deprecate MenuId.InlineCompletionsActions
	private readonly inlineCompletionsActionsMenus;

	private readonly clearAvailableSuggestionCountLabelDebounced;

	private readonly disableButtonsDebounced;

	constructor(
		private readonly editor: ICodeEditor,
		private readonly withBorder: boolean,
		private readonly _position: IObservable<Position | null>,
		private readonly _currentSuggestionIdx: IObservable<number>,
		private readonly _suggestionCount: IObservable<number | undefined>,
		private readonly _extraCommands: IObservable<InlineCompletionCommand[]>,
		private readonly _warning: IObservable<InlineCompletionWarning | undefined>,
		private readonly _relayout: () => void,
		@ICommandService private readonly _commandService: ICommandService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IMenuService private readonly _menuService: IMenuService,
	) {
		super();
		this.id = `InlineSuggestionHintsContentWidget${InlineSuggestionHintsContentWidget.id++}`;
		this.allowEditorOverflow = true;
		this.suppressMouseDown = false;
		this._warningMessageContentNode = derived((reader) => {
			const warning = this._warning.read(reader);
			if (!warning) {
				return undefined;
			}
			if (typeof warning.message === 'string') {
				return warning.message;
			}
			const markdownElement = reader.store.add(renderMarkdown(warning.message));
			return markdownElement.element;
		});
		this._warningMessageNode = n.div({
			class: 'warningMessage',
			style: {
				maxWidth: 400,
				margin: 4,
				marginBottom: 4,
				display: derived(reader => this._warning.read(reader) ? 'block' : 'none'),
			}
		}, [
			this._warningMessageContentNode,
		]).keepUpdated(this._store);
		this.nodes = h('div.inlineSuggestionsHints', { className: this.withBorder ? 'monaco-hover monaco-hover-content' : '' }, [
			this._warningMessageNode.element,
			h('div@toolBar'),
		]);
		this.previousAction = this._register(this.createCommandAction(showPreviousInlineSuggestionActionId, localize('previous', 'Previous'), ThemeIcon.asClassName(inlineSuggestionHintsPreviousIcon)));
		this.availableSuggestionCountAction = this._register(new Action('inlineSuggestionHints.availableSuggestionCount', '', undefined, false));
		this.nextAction = this._register(this.createCommandAction(showNextInlineSuggestionActionId, localize('next', 'Next'), ThemeIcon.asClassName(inlineSuggestionHintsNextIcon)));
		this.inlineCompletionsActionsMenus = this._register(this._menuService.createMenu(
			MenuId.InlineCompletionsActions,
			this._contextKeyService
		));
		this.clearAvailableSuggestionCountLabelDebounced = this._register(new RunOnceScheduler(() => {
			this.availableSuggestionCountAction.label = '';
		}, 100));
		this.disableButtonsDebounced = this._register(new RunOnceScheduler(() => {
			this.previousAction.enabled = this.nextAction.enabled = false;
		}, 100));

		this._register(autorun(reader => {
			this._warningMessageContentNode.read(reader);
			this._warningMessageNode.readEffect(reader);
			// Only update after the warning message node has been rendered
			this._relayout();
		}));

		this.toolBar = this._register(instantiationService.createInstance(CustomizedMenuWorkbenchToolBar, this.nodes.toolBar, MenuId.InlineSuggestionToolbar, {
			menuOptions: { renderShortTitle: true },
			toolbarOptions: { primaryGroup: g => g.startsWith('primary') },
			actionViewItemProvider: (action, options) => {
				if (action instanceof MenuItemAction) {
					return instantiationService.createInstance(StatusBarViewItem, action, undefined);
				}
				if (action === this.availableSuggestionCountAction) {
					const a = new ActionViewItemWithClassName(undefined, action, { label: true, icon: false });
					a.setClass('availableSuggestionCount');
					return a;
				}
				return undefined;
			},
			telemetrySource: 'InlineSuggestionToolbar',
		}));

		this.toolBar.setPrependedPrimaryActions([
			this.previousAction,
			this.availableSuggestionCountAction,
			this.nextAction,
		]);

		this._register(this.toolBar.onDidChangeDropdownVisibility(e => {
			InlineSuggestionHintsContentWidget._dropDownVisible = e;
		}));

		this._register(autorun(reader => {
			/** @description update position */
			this._position.read(reader);
			this.editor.layoutContentWidget(this);
		}));

		this._register(autorun(reader => {
			/** @description counts */
			const suggestionCount = this._suggestionCount.read(reader);
			const currentSuggestionIdx = this._currentSuggestionIdx.read(reader);

			if (suggestionCount !== undefined) {
				this.clearAvailableSuggestionCountLabelDebounced.cancel();
				this.availableSuggestionCountAction.label = `${currentSuggestionIdx + 1}/${suggestionCount}`;
			} else {
				this.clearAvailableSuggestionCountLabelDebounced.schedule();
			}

			if (suggestionCount !== undefined && suggestionCount > 1) {
				this.disableButtonsDebounced.cancel();
				this.previousAction.enabled = this.nextAction.enabled = true;
			} else {
				this.disableButtonsDebounced.schedule();
			}
		}));

		this._register(autorun(reader => {
			/** @description extra commands */
			const extraCommands = this._extraCommands.read(reader);
			const extraActions = extraCommands.map<IAction>(c => ({
				class: undefined,
				id: c.command.id,
				enabled: true,
				tooltip: c.command.tooltip || '',
				label: c.command.title,
				run: (event) => {
					return this._commandService.executeCommand(c.command.id);
				},
			}));

			for (const [_, group] of this.inlineCompletionsActionsMenus.getActions()) {
				for (const action of group) {
					if (action instanceof MenuItemAction) {
						extraActions.push(action);
					}
				}
			}

			if (extraActions.length > 0) {
				extraActions.unshift(new Separator());
			}

			this.toolBar.setAdditionalSecondaryActions(extraActions);
		}));
	}

	getId(): string { return this.id; }

	getDomNode(): HTMLElement {
		return this.nodes.root;
	}

	getPosition(): IContentWidgetPosition | null {
		return {
			position: this._position.get(),
			preference: [ContentWidgetPositionPreference.ABOVE, ContentWidgetPositionPreference.BELOW],
			positionAffinity: PositionAffinity.LeftOfInjectedText,
		};
	}
}

class ActionViewItemWithClassName extends ActionViewItem {
	private _className: string | undefined = undefined;

	setClass(className: string | undefined): void {
		this._className = className;
	}

	override render(container: HTMLElement): void {
		super.render(container);
		if (this._className) {
			container.classList.add(this._className);
		}
	}

	protected override updateTooltip(): void {
		// NOOP, disable tooltip
	}
}

class StatusBarViewItem extends MenuEntryActionViewItem {
	protected override updateLabel() {
		const kb = this._keybindingService.lookupKeybinding(this._action.id, this._contextKeyService, true);
		if (!kb) {
			return super.updateLabel();
		}
		if (this.label) {
			const div = h('div.keybinding').root;

			const k = this._register(new KeybindingLabel(div, OS, { disableTitle: true, ...unthemedKeybindingLabelOptions }));
			k.set(kb);
			this.label.textContent = this._action.label;
			this.label.appendChild(div);
			this.label.classList.add('inlineSuggestionStatusBarItemLabel');
		}
	}

	protected override updateTooltip(): void {
		// NOOP, disable tooltip
	}
}

export class CustomizedMenuWorkbenchToolBar extends WorkbenchToolBar {
	private readonly menu;
	private additionalActions: IAction[];
	private prependedPrimaryActions: IAction[];
	private additionalPrimaryActions: IAction[];

	constructor(
		container: HTMLElement,
		private readonly menuId: MenuId,
		private readonly options2: IMenuWorkbenchToolBarOptions | undefined,
		@IMenuService private readonly menuService: IMenuService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super(container, { resetMenu: menuId, ...options2 }, menuService, contextKeyService, contextMenuService, keybindingService, commandService, telemetryService);
		this.menu = this._store.add(this.menuService.createMenu(this.menuId, this.contextKeyService, { emitEventsForSubmenuChanges: true }));
		this.additionalActions = [];
		this.prependedPrimaryActions = [];
		this.additionalPrimaryActions = [];

		this._store.add(this.menu.onDidChange(() => this.updateToolbar()));
		this.updateToolbar();
	}

	private updateToolbar(): void {
		const { primary, secondary } = getActionBarActions(
			this.menu.getActions(this.options2?.menuOptions),
			this.options2?.toolbarOptions?.primaryGroup, this.options2?.toolbarOptions?.shouldInlineSubmenu, this.options2?.toolbarOptions?.useSeparatorsInPrimaryActions
		);

		secondary.push(...this.additionalActions);
		primary.unshift(...this.prependedPrimaryActions);
		primary.push(...this.additionalPrimaryActions);
		this.setActions(primary, secondary);
	}

	setPrependedPrimaryActions(actions: IAction[]): void {
		if (equals(this.prependedPrimaryActions, actions, (a, b) => a === b)) {
			return;
		}

		this.prependedPrimaryActions = actions;
		this.updateToolbar();
	}

	setAdditionalPrimaryActions(actions: IAction[]): void {
		if (equals(this.additionalPrimaryActions, actions, (a, b) => a === b)) {
			return;
		}

		this.additionalPrimaryActions = actions;
		this.updateToolbar();
	}

	setAdditionalSecondaryActions(actions: IAction[]): void {
		if (equals(this.additionalActions, actions, (a, b) => a === b)) {
			return;
		}

		this.additionalActions = actions;
		this.updateToolbar();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/animation.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/animation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveWindow } from '../../../../../base/browser/dom.js';
import { ISettableObservable, observableValue, ITransaction, IReader, observableSignal } from '../../../../../base/common/observable.js';

export class AnimatedValue {
	public static const(value: number): AnimatedValue {
		return new AnimatedValue(value, value, 0);
	}

	public readonly startTimeMs = Date.now();

	constructor(
		public readonly startValue: number,
		public readonly endValue: number,
		public readonly durationMs: number,
		private readonly _interpolationFunction: InterpolationFunction = easeOutExpo,
	) {
		if (startValue === endValue) {
			this.durationMs = 0;
		}
	}

	isFinished(): boolean {
		return Date.now() >= this.startTimeMs + this.durationMs;
	}

	getValue(): number {
		const timePassed = Date.now() - this.startTimeMs;
		if (timePassed >= this.durationMs) {
			return this.endValue;
		}
		const value = this._interpolationFunction(timePassed, this.startValue, this.endValue - this.startValue, this.durationMs);
		return value;
	}
}

type InterpolationFunction = (passedTime: number, start: number, length: number, totalDuration: number) => number;

export function easeOutExpo(passedTime: number, start: number, length: number, totalDuration: number): number {
	return passedTime === totalDuration
		? start + length
		: length * (-Math.pow(2, -10 * passedTime / totalDuration) + 1) + start;
}

export function easeOutCubic(passedTime: number, start: number, length: number, totalDuration: number): number {
	return length * ((passedTime = passedTime / totalDuration - 1) * passedTime * passedTime + 1) + start;
}

export function linear(passedTime: number, start: number, length: number, totalDuration: number): number {
	return length * passedTime / totalDuration + start;
}

export class ObservableAnimatedValue {
	public static const(value: number): ObservableAnimatedValue {
		return new ObservableAnimatedValue(AnimatedValue.const(value));
	}

	private readonly _value: ISettableObservable<AnimatedValue>;

	constructor(
		initialValue: AnimatedValue,
	) {
		this._value = observableValue(this, initialValue);
	}

	setAnimation(value: AnimatedValue, tx: ITransaction | undefined): void {
		this._value.set(value, tx);
	}

	changeAnimation(fn: (prev: AnimatedValue) => AnimatedValue, tx: ITransaction | undefined): void {
		const value = fn(this._value.get());
		this._value.set(value, tx);
	}

	getValue(reader: IReader | undefined): number {
		const value = this._value.read(reader);
		if (!value.isFinished()) {
			AnimationFrameScheduler.instance.invalidateOnNextAnimationFrame(reader);
		}
		return value.getValue();
	}
}

export class AnimationFrameScheduler {
	public static instance = new AnimationFrameScheduler();

	private readonly _counter = observableSignal(this);

	private _isScheduled = false;

	public invalidateOnNextAnimationFrame(reader: IReader | undefined): void {
		this._counter.read(reader);
		if (!this._isScheduled) {
			this._isScheduled = true;
			getActiveWindow().requestAnimationFrame(() => {
				this._isScheduled = false;
				this._update();
			});
		}
	}

	private _update(): void {
		this._counter.trigger(undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/changeRecorder.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/changeRecorder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { autorun, observableFromEvent } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { canLog, ILoggerService, LogLevel } from '../../../../../platform/log/common/log.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { CodeEditorWidget } from '../../../../browser/widget/codeEditor/codeEditorWidget.js';
import { IDocumentEventDataSetChangeReason, IRecordableEditorLogEntry, StructuredLogger } from '../structuredLogger.js';

export interface ITextModelChangeRecorderMetadata {
	source?: string;
	extensionId?: string;
	nes?: boolean;
	type?: 'word' | 'line';
}

export class TextModelChangeRecorder extends Disposable {
	private readonly _structuredLogger;

	constructor(
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILoggerService private readonly _loggerService: ILoggerService,
	) {
		super();

		this._structuredLogger = this._register(this._instantiationService.createInstance(StructuredLogger.cast<IRecordableEditorLogEntry & IDocumentEventDataSetChangeReason>(),
			'editor.inlineSuggest.logChangeReason.commandId'
		));

		const logger = this._loggerService?.createLogger('textModelChanges', { hidden: false, name: 'Text Model Changes Reason' });

		const loggingLevel = observableFromEvent(this, logger.onDidChangeLogLevel, () => logger.getLevel());

		this._register(autorun(reader => {
			if (!canLog(loggingLevel.read(reader), LogLevel.Trace)) {
				return;
			}

			reader.store.add(this._editor.onDidChangeModelContent((e) => {
				if (this._editor.getModel()?.uri.scheme === 'output') {
					return;
				}
				logger.trace('onDidChangeModelContent: ' + e.detailedReasons.map(r => r.toKey(Number.MAX_VALUE)).join(', '));
			}));
		}));

		this._register(autorun(reader => {
			if (!(this._editor instanceof CodeEditorWidget)) { return; }
			if (!this._structuredLogger.isEnabled.read(reader)) { return; }

			reader.store.add(this._editor.onDidChangeModelContent(e => {
				const tm = this._editor.getModel();
				if (!tm) { return; }

				const reason = e.detailedReasons[0];

				const data: IRecordableEditorLogEntry & IDocumentEventDataSetChangeReason = {
					...reason.metadata,
					sourceId: 'TextModel.setChangeReason',
					source: reason.metadata.source,
					time: Date.now(),
					modelUri: tm.uri,
					modelVersion: tm.getVersionId(),
				};
				setTimeout(() => {
					// To ensure that this reaches the extension host after the content change event.
					// (Without the setTimeout, I observed this command being called before the content change event arrived)
					this._structuredLogger.log(data);
				}, 0);
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/computeGhostText.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/computeGhostText.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiffChange, LcsDiff } from '../../../../../base/common/diff/diff.js';
import { getLeadingWhitespace } from '../../../../../base/common/strings.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { ITextModel } from '../../../../common/model.js';
import { GhostText, GhostTextPart } from './ghostText.js';
import { singleTextRemoveCommonPrefix } from './singleTextEditHelpers.js';

/**
 * @param previewSuffixLength Sets where to split `inlineCompletion.text`.
 * 	If the text is `hello` and the suffix length is 2, the non-preview part is `hel` and the preview-part is `lo`.
*/
export function computeGhostText(
	edit: TextReplacement,
	model: ITextModel,
	mode: 'prefix' | 'subword' | 'subwordSmart',
	cursorPosition?: Position,
	previewSuffixLength = 0
): GhostText | undefined {
	let e = singleTextRemoveCommonPrefix(edit, model);

	if (e.range.endLineNumber !== e.range.startLineNumber) {
		// This edit might span multiple lines, but the first lines must be a common prefix.
		return undefined;
	}

	const sourceLine = model.getLineContent(e.range.startLineNumber);
	const sourceIndentationLength = getLeadingWhitespace(sourceLine).length;

	const suggestionTouchesIndentation = e.range.startColumn - 1 <= sourceIndentationLength;
	if (suggestionTouchesIndentation) {
		// source:      ··········[······abc]
		//                         ^^^^^^^^^ inlineCompletion.range
		//              ^^^^^^^^^^ ^^^^^^ sourceIndentationLength
		//                         ^^^^^^ replacedIndentation.length
		//                               ^^^ rangeThatDoesNotReplaceIndentation
		// inlineCompletion.text: '··foo'
		//                         ^^ suggestionAddedIndentationLength
		const suggestionAddedIndentationLength = getLeadingWhitespace(e.text).length;

		const replacedIndentation = sourceLine.substring(e.range.startColumn - 1, sourceIndentationLength);

		const [startPosition, endPosition] = [e.range.getStartPosition(), e.range.getEndPosition()];
		const newStartPosition = startPosition.column + replacedIndentation.length <= endPosition.column
			? startPosition.delta(0, replacedIndentation.length)
			: endPosition;
		const rangeThatDoesNotReplaceIndentation = Range.fromPositions(newStartPosition, endPosition);

		const suggestionWithoutIndentationChange = e.text.startsWith(replacedIndentation)
			// Adds more indentation without changing existing indentation: We can add ghost text for this
			? e.text.substring(replacedIndentation.length)
			// Changes or removes existing indentation. Only add ghost text for the non-indentation part.
			: e.text.substring(suggestionAddedIndentationLength);

		e = new TextReplacement(rangeThatDoesNotReplaceIndentation, suggestionWithoutIndentationChange);
	}

	// This is a single line string
	const valueToBeReplaced = model.getValueInRange(e.range);

	const changes = cachingDiff(valueToBeReplaced, e.text);

	if (!changes) {
		// No ghost text in case the diff would be too slow to compute
		return undefined;
	}

	const lineNumber = e.range.startLineNumber;

	const parts = new Array<GhostTextPart>();

	if (mode === 'prefix') {
		const filteredChanges = changes.filter(c => c.originalLength === 0);
		if (filteredChanges.length > 1 || filteredChanges.length === 1 && filteredChanges[0].originalStart !== valueToBeReplaced.length) {
			// Prefixes only have a single change.
			return undefined;
		}
	}

	const previewStartInCompletionText = e.text.length - previewSuffixLength;

	for (const c of changes) {
		const insertColumn = e.range.startColumn + c.originalStart + c.originalLength;

		if (mode === 'subwordSmart' && cursorPosition && cursorPosition.lineNumber === e.range.startLineNumber && insertColumn < cursorPosition.column) {
			// No ghost text before cursor
			return undefined;
		}

		if (c.originalLength > 0) {
			return undefined;
		}

		if (c.modifiedLength === 0) {
			continue;
		}

		const modifiedEnd = c.modifiedStart + c.modifiedLength;
		const nonPreviewTextEnd = Math.max(c.modifiedStart, Math.min(modifiedEnd, previewStartInCompletionText));
		const nonPreviewText = e.text.substring(c.modifiedStart, nonPreviewTextEnd);
		const italicText = e.text.substring(nonPreviewTextEnd, Math.max(c.modifiedStart, modifiedEnd));

		if (nonPreviewText.length > 0) {
			parts.push(new GhostTextPart(insertColumn, nonPreviewText, false));
		}
		if (italicText.length > 0) {
			parts.push(new GhostTextPart(insertColumn, italicText, true));
		}
	}

	return new GhostText(lineNumber, parts);
}

let lastRequest: { originalValue: string; newValue: string; changes: readonly IDiffChange[] | undefined } | undefined = undefined;
function cachingDiff(originalValue: string, newValue: string): readonly IDiffChange[] | undefined {
	if (lastRequest?.originalValue === originalValue && lastRequest?.newValue === newValue) {
		return lastRequest?.changes;
	} else {
		let changes = smartDiff(originalValue, newValue, true);
		if (changes) {
			const deletedChars = deletedCharacters(changes);
			if (deletedChars > 0) {
				// For performance reasons, don't compute diff if there is nothing to improve
				const newChanges = smartDiff(originalValue, newValue, false);
				if (newChanges && deletedCharacters(newChanges) < deletedChars) {
					// Disabling smartness seems to be better here
					changes = newChanges;
				}
			}
		}
		lastRequest = {
			originalValue,
			newValue,
			changes
		};
		return changes;
	}
}

function deletedCharacters(changes: readonly IDiffChange[]): number {
	let sum = 0;
	for (const c of changes) {
		sum += c.originalLength;
	}
	return sum;
}

/**
 * When matching `if ()` with `if (f() = 1) { g(); }`,
 * align it like this:        `if (       )`
 * Not like this:			  `if (  )`
 * Also not like this:		  `if (             )`.
 *
 * The parenthesis are preprocessed to ensure that they match correctly.
 */
export function smartDiff(originalValue: string, newValue: string, smartBracketMatching: boolean): (readonly IDiffChange[]) | undefined {
	if (originalValue.length > 5000 || newValue.length > 5000) {
		// We don't want to work on strings that are too big
		return undefined;
	}

	function getMaxCharCode(val: string): number {
		let maxCharCode = 0;
		for (let i = 0, len = val.length; i < len; i++) {
			const charCode = val.charCodeAt(i);
			if (charCode > maxCharCode) {
				maxCharCode = charCode;
			}
		}
		return maxCharCode;
	}

	const maxCharCode = Math.max(getMaxCharCode(originalValue), getMaxCharCode(newValue));
	function getUniqueCharCode(id: number): number {
		if (id < 0) {
			throw new Error('unexpected');
		}
		return maxCharCode + id + 1;
	}

	function getElements(source: string): Int32Array {
		let level = 0;
		let group = 0;
		const characters = new Int32Array(source.length);
		for (let i = 0, len = source.length; i < len; i++) {
			// TODO support more brackets
			if (smartBracketMatching && source[i] === '(') {
				const id = group * 100 + level;
				characters[i] = getUniqueCharCode(2 * id);
				level++;
			} else if (smartBracketMatching && source[i] === ')') {
				level = Math.max(level - 1, 0);
				const id = group * 100 + level;
				characters[i] = getUniqueCharCode(2 * id + 1);
				if (level === 0) {
					group++;
				}
			} else {
				characters[i] = source.charCodeAt(i);
			}
		}
		return characters;
	}

	const elements1 = getElements(originalValue);
	const elements2 = getElements(newValue);

	return new LcsDiff({ getElements: () => elements1 }, { getElements: () => elements2 }).ComputeDiff(false).changes;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/editKind.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/editKind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Position } from '../../../../common/core/position.js';
import { StringEdit, StringReplacement } from '../../../../common/core/edits/stringEdit.js';
import { ITextModel } from '../../../../common/model.js';

const syntacticalChars = new Set([';', ',', '=', '+', '-', '*', '/', '{', '}', '(', ')', '[', ']', '<', '>', ':', '.', '!', '?', '&', '|', '^', '%', '@', '#', '~', '`', '\\', '\'', '"', '$']);

function isSyntacticalChar(char: string): boolean {
	return syntacticalChars.has(char);
}

function isIdentifierChar(char: string): boolean {
	return /[a-zA-Z0-9_]/.test(char);
}

function isWhitespaceChar(char: string): boolean {
	return char === ' ' || char === '\t';
}

type SingleCharacterKind = 'syntactical' | 'identifier' | 'whitespace';

interface SingleLineTextShape {
	readonly kind: 'singleLine';
	readonly isSingleCharacter: boolean;
	readonly singleCharacterKind: SingleCharacterKind | undefined;
	readonly isWord: boolean;
	readonly isMultipleWords: boolean;
	readonly isMultipleWhitespace: boolean;
	readonly hasDuplicatedWhitespace: boolean;
}

interface MultiLineTextShape {
	readonly kind: 'multiLine';
	readonly lineCount: number;
}

type TextShape = SingleLineTextShape | MultiLineTextShape;

function analyzeTextShape(text: string): TextShape {
	const lines = text.split(/\r\n|\r|\n/);
	if (lines.length > 1) {
		return {
			kind: 'multiLine',
			lineCount: lines.length,
		};
	}

	const isSingleChar = text.length === 1;
	let singleCharKind: SingleCharacterKind | undefined;
	if (isSingleChar) {
		if (isSyntacticalChar(text)) {
			singleCharKind = 'syntactical';
		} else if (isIdentifierChar(text)) {
			singleCharKind = 'identifier';
		} else if (isWhitespaceChar(text)) {
			singleCharKind = 'whitespace';
		}
	}

	// Analyze whitespace patterns
	const whitespaceMatches = text.match(/[ \t]+/g) || [];
	const isMultipleWhitespace = whitespaceMatches.some(ws => ws.length > 1);
	const hasDuplicatedWhitespace = whitespaceMatches.some(ws =>
		(ws.includes('  ') || ws.includes('\t\t'))
	);

	// Analyze word patterns
	const words = text.split(/\s+/).filter(w => w.length > 0);
	const isWord = words.length === 1 && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(words[0]);
	const isMultipleWords = words.length > 1;

	return {
		kind: 'singleLine',
		isSingleCharacter: isSingleChar,
		singleCharacterKind: singleCharKind,
		isWord,
		isMultipleWords,
		isMultipleWhitespace,
		hasDuplicatedWhitespace,
	};
}

type InsertLocationShape = 'endOfLine' | 'emptyLine' | 'startOfLine' | 'middleOfLine';

interface InsertLocationRelativeToCursor {
	readonly atCursor: boolean;
	readonly beforeCursorOnSameLine: boolean;
	readonly afterCursorOnSameLine: boolean;
	readonly linesAbove: number | undefined;
	readonly linesBelow: number | undefined;
}

export interface InsertProperties {
	readonly textShape: TextShape;
	readonly locationShape: InsertLocationShape;
	readonly relativeToCursor: InsertLocationRelativeToCursor | undefined;
}

export interface DeleteProperties {
	readonly textShape: TextShape;
	readonly isAtEndOfLine: boolean;
	readonly deletesEntireLineContent: boolean;
}

export interface ReplaceProperties {
	readonly isWordToWordReplacement: boolean;
	readonly isAdditive: boolean;
	readonly isSubtractive: boolean;
	readonly isSingleLineToSingleLine: boolean;
	readonly isSingleLineToMultiLine: boolean;
	readonly isMultiLineToSingleLine: boolean;
}

type EditOperation = 'insert' | 'delete' | 'replace';

interface IInlineSuggestionEditKindEdit {
	readonly operation: EditOperation;
	readonly properties: InsertProperties | DeleteProperties | ReplaceProperties;
	readonly charactersInserted: number;
	readonly charactersDeleted: number;
	readonly linesInserted: number;
	readonly linesDeleted: number;
}
export class InlineSuggestionEditKind {
	constructor(readonly edits: IInlineSuggestionEditKindEdit[]) { }
	toString(): string {
		return JSON.stringify({ edits: this.edits });
	}
}

export function computeEditKind(edit: StringEdit, textModel: ITextModel, cursorPosition?: Position): InlineSuggestionEditKind | undefined {
	if (edit.replacements.length === 0) {
		// Empty edit - return undefined as there's no edit to classify
		return undefined;
	}

	return new InlineSuggestionEditKind(edit.replacements.map(rep => computeSingleEditKind(rep, textModel, cursorPosition)));
}

function countLines(text: string): number {
	if (text.length === 0) {
		return 0;
	}
	return text.split(/\r\n|\r|\n/).length - 1;
}

function computeSingleEditKind(replacement: StringReplacement, textModel: ITextModel, cursorPosition?: Position): IInlineSuggestionEditKindEdit {
	const replaceRange = replacement.replaceRange;
	const newText = replacement.newText;
	const deletedLength = replaceRange.length;
	const insertedLength = newText.length;
	const linesInserted = countLines(newText);

	const kind = replaceRange.isEmpty ? 'insert' : (newText.length === 0 ? 'delete' : 'replace');
	switch (kind) {
		case 'insert':
			return {
				operation: 'insert',
				properties: computeInsertProperties(replaceRange.start, newText, textModel, cursorPosition),
				charactersInserted: insertedLength,
				charactersDeleted: 0,
				linesInserted,
				linesDeleted: 0,
			};
		case 'delete': {
			const deletedText = textModel.getValue().substring(replaceRange.start, replaceRange.endExclusive);
			return {
				operation: 'delete',
				properties: computeDeleteProperties(replaceRange.start, replaceRange.endExclusive, textModel),
				charactersInserted: 0,
				charactersDeleted: deletedLength,
				linesInserted: 0,
				linesDeleted: countLines(deletedText),
			};
		}
		case 'replace': {
			const oldText = textModel.getValue().substring(replaceRange.start, replaceRange.endExclusive);
			return {
				operation: 'replace',
				properties: computeReplaceProperties(oldText, newText),
				charactersInserted: insertedLength,
				charactersDeleted: deletedLength,
				linesInserted,
				linesDeleted: countLines(oldText),
			};
		}
	}
}

function computeInsertProperties(offset: number, newText: string, textModel: ITextModel, cursorPosition?: Position): InsertProperties {
	const textShape = analyzeTextShape(newText);
	const insertPosition = textModel.getPositionAt(offset);
	const lineContent = textModel.getLineContent(insertPosition.lineNumber);
	const lineLength = lineContent.length;

	// Determine location shape
	let locationShape: InsertLocationShape;
	const isLineEmpty = lineContent.trim().length === 0;
	const isAtEndOfLine = insertPosition.column > lineLength;
	const isAtStartOfLine = insertPosition.column === 1;

	if (isLineEmpty) {
		locationShape = 'emptyLine';
	} else if (isAtEndOfLine) {
		locationShape = 'endOfLine';
	} else if (isAtStartOfLine) {
		locationShape = 'startOfLine';
	} else {
		locationShape = 'middleOfLine';
	}

	// Compute relative to cursor if cursor position is provided
	let relativeToCursor: InsertLocationRelativeToCursor | undefined;
	if (cursorPosition) {
		const cursorLine = cursorPosition.lineNumber;
		const insertLine = insertPosition.lineNumber;
		const cursorColumn = cursorPosition.column;
		const insertColumn = insertPosition.column;

		const atCursor = cursorLine === insertLine && cursorColumn === insertColumn;
		const beforeCursorOnSameLine = cursorLine === insertLine && insertColumn < cursorColumn;
		const afterCursorOnSameLine = cursorLine === insertLine && insertColumn > cursorColumn;
		const linesAbove = insertLine < cursorLine ? cursorLine - insertLine : undefined;
		const linesBelow = insertLine > cursorLine ? insertLine - cursorLine : undefined;

		relativeToCursor = {
			atCursor,
			beforeCursorOnSameLine,
			afterCursorOnSameLine,
			linesAbove,
			linesBelow,
		};
	}

	return {
		textShape,
		locationShape,
		relativeToCursor,
	};
}

function computeDeleteProperties(startOffset: number, endOffset: number, textModel: ITextModel): DeleteProperties {
	const deletedText = textModel.getValue().substring(startOffset, endOffset);
	const textShape = analyzeTextShape(deletedText);

	const startPosition = textModel.getPositionAt(startOffset);
	const endPosition = textModel.getPositionAt(endOffset);

	// Check if delete is at end of line
	const lineContent = textModel.getLineContent(endPosition.lineNumber);
	const isAtEndOfLine = endPosition.column > lineContent.length;

	// Check if entire line content is deleted
	const deletesEntireLineContent =
		startPosition.lineNumber === endPosition.lineNumber &&
		startPosition.column === 1 &&
		endPosition.column > lineContent.length;

	return {
		textShape,
		isAtEndOfLine,
		deletesEntireLineContent,
	};
}

function computeReplaceProperties(oldText: string, newText: string): ReplaceProperties {
	const oldShape = analyzeTextShape(oldText);
	const newShape = analyzeTextShape(newText);

	const oldIsWord = oldShape.kind === 'singleLine' && oldShape.isWord;
	const newIsWord = newShape.kind === 'singleLine' && newShape.isWord;
	const isWordToWordReplacement = oldIsWord && newIsWord;

	const isAdditive = newText.length > oldText.length;
	const isSubtractive = newText.length < oldText.length;

	const isSingleLineToSingleLine = oldShape.kind === 'singleLine' && newShape.kind === 'singleLine';
	const isSingleLineToMultiLine = oldShape.kind === 'singleLine' && newShape.kind === 'multiLine';
	const isMultiLineToSingleLine = oldShape.kind === 'multiLine' && newShape.kind === 'singleLine';

	return {
		isWordToWordReplacement,
		isAdditive,
		isSubtractive,
		isSingleLineToSingleLine,
		isSingleLineToMultiLine,
		isMultiLineToSingleLine,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/ghostText.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/ghostText.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../../base/common/arrays.js';
import { splitLines } from '../../../../../base/common/strings.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { TextReplacement, TextEdit } from '../../../../common/core/edits/textEdit.js';
import { LineDecoration } from '../../../../common/viewLayout/lineDecorations.js';
import { ColumnRange } from '../../../../common/core/ranges/columnRange.js';
import { assertFn, checkAdjacentItems } from '../../../../../base/common/assert.js';
import { InlineDecoration } from '../../../../common/viewModel/inlineDecorations.js';

export class GhostText {
	constructor(
		public readonly lineNumber: number,
		public readonly parts: GhostTextPart[],
	) {
		assertFn(() => checkAdjacentItems(parts, (p1, p2) => p1.column <= p2.column));
	}

	equals(other: GhostText): boolean {
		return this.lineNumber === other.lineNumber &&
			this.parts.length === other.parts.length &&
			this.parts.every((part, index) => part.equals(other.parts[index]));
	}

	/**
	 * Only used for testing/debugging.
	*/
	render(documentText: string, debug: boolean = false): string {
		return new TextEdit([
			...this.parts.map(p => new TextReplacement(
				Range.fromPositions(new Position(this.lineNumber, p.column)),
				debug ? `[${p.lines.map(line => line.line).join('\n')}]` : p.lines.map(line => line.line).join('\n')
			)),
		]).applyToString(documentText);
	}

	renderForScreenReader(lineText: string): string {
		if (this.parts.length === 0) {
			return '';
		}
		const lastPart = this.parts[this.parts.length - 1];

		const cappedLineText = lineText.substr(0, lastPart.column - 1);
		const text = new TextEdit([
			...this.parts.map(p => new TextReplacement(
				Range.fromPositions(new Position(1, p.column)),
				p.lines.map(line => line.line).join('\n')
			)),
		]).applyToString(cappedLineText);

		return text.substring(this.parts[0].column - 1);
	}

	isEmpty(): boolean {
		return this.parts.every(p => p.lines.length === 0);
	}

	get lineCount(): number {
		return 1 + this.parts.reduce((r, p) => r + p.lines.length - 1, 0);
	}
}

export interface IGhostTextLine {
	line: string;
	lineDecorations: LineDecoration[];
}


export class GhostTextPart {

	readonly lines: IGhostTextLine[];

	constructor(
		readonly column: number,
		readonly text: string,
		/**
		 * Indicates if this part is a preview of an inline suggestion when a suggestion is previewed.
		*/
		readonly preview: boolean,
		private _inlineDecorations: InlineDecoration[] = [],
	) {
		this.lines = splitLines(this.text).map((line, i) => ({
			line,
			lineDecorations: LineDecoration.filter(this._inlineDecorations, i + 1, 1, line.length + 1)
		}));
	}

	equals(other: GhostTextPart): boolean {
		return this.column === other.column &&
			this.lines.length === other.lines.length &&
			this.lines.every((line, index) =>
				line.line === other.lines[index].line &&
				LineDecoration.equalsArr(line.lineDecorations, other.lines[index].lineDecorations)
			);
	}
}

export class GhostTextReplacement {
	public readonly parts: ReadonlyArray<GhostTextPart>;
	readonly newLines: string[];

	constructor(
		readonly lineNumber: number,
		readonly columnRange: ColumnRange,
		readonly text: string,
		public readonly additionalReservedLineCount: number = 0,
	) {
		this.parts = [
			new GhostTextPart(
				this.columnRange.endColumnExclusive,
				this.text,
				false
			),
		];
		this.newLines = splitLines(this.text);
	}

	renderForScreenReader(_lineText: string): string {
		return this.newLines.join('\n');
	}

	render(documentText: string, debug: boolean = false): string {
		const replaceRange = this.columnRange.toRange(this.lineNumber);

		if (debug) {
			return new TextEdit([
				new TextReplacement(Range.fromPositions(replaceRange.getStartPosition()), '('),
				new TextReplacement(Range.fromPositions(replaceRange.getEndPosition()), `)[${this.newLines.join('\n')}]`),
			]).applyToString(documentText);
		} else {
			return new TextEdit([
				new TextReplacement(replaceRange, this.newLines.join('\n')),
			]).applyToString(documentText);
		}
	}

	get lineCount(): number {
		return this.newLines.length;
	}

	isEmpty(): boolean {
		return this.parts.every(p => p.lines.length === 0);
	}

	equals(other: GhostTextReplacement): boolean {
		return this.lineNumber === other.lineNumber &&
			this.columnRange.equals(other.columnRange) &&
			this.newLines.length === other.newLines.length &&
			this.newLines.every((line, index) => line === other.newLines[index]) &&
			this.additionalReservedLineCount === other.additionalReservedLineCount;
	}
}

export type GhostTextOrReplacement = GhostText | GhostTextReplacement;

export function ghostTextsOrReplacementsEqual(a: readonly GhostTextOrReplacement[] | undefined, b: readonly GhostTextOrReplacement[] | undefined): boolean {
	return equals(a, b, ghostTextOrReplacementEquals);
}

export function ghostTextOrReplacementEquals(a: GhostTextOrReplacement | undefined, b: GhostTextOrReplacement | undefined): boolean {
	if (a === b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	if (a instanceof GhostText && b instanceof GhostText) {
		return a.equals(b);
	}
	if (a instanceof GhostTextReplacement && b instanceof GhostTextReplacement) {
		return a.equals(b);
	}
	return false;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/graph.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/graph.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class DirectedGraph<T> {
	private readonly _nodes = new Set<T>();
	private readonly _outgoingEdges = new Map<T, Set<T>>();

	public static from<T>(nodes: readonly T[], getOutgoing: (node: T) => readonly T[]): DirectedGraph<T> {
		const graph = new DirectedGraph<T>();

		for (const node of nodes) {
			graph._nodes.add(node);
		}

		for (const node of nodes) {
			const outgoing = getOutgoing(node);
			if (outgoing.length > 0) {
				const outgoingSet = new Set<T>();
				for (const target of outgoing) {
					outgoingSet.add(target);
				}
				graph._outgoingEdges.set(node, outgoingSet);
			}
		}

		return graph;
	}

	/**
	 * After this, the graph is guaranteed to have no cycles.
	 */
	removeCycles(): { foundCycles: T[] } {
		const foundCycles: T[] = [];
		const visited = new Set<T>();
		const recursionStack = new Set<T>();
		const toRemove: Array<{ from: T; to: T }> = [];

		const dfs = (node: T): void => {
			visited.add(node);
			recursionStack.add(node);

			const outgoing = this._outgoingEdges.get(node);
			if (outgoing) {
				for (const neighbor of outgoing) {
					if (!visited.has(neighbor)) {
						dfs(neighbor);
					} else if (recursionStack.has(neighbor)) {
						// Found a cycle
						foundCycles.push(neighbor);
						toRemove.push({ from: node, to: neighbor });
					}
				}
			}

			recursionStack.delete(node);
		};

		// Run DFS from all unvisited nodes
		for (const node of this._nodes) {
			if (!visited.has(node)) {
				dfs(node);
			}
		}

		// Remove edges that cause cycles
		for (const { from, to } of toRemove) {
			const outgoingSet = this._outgoingEdges.get(from);
			if (outgoingSet) {
				outgoingSet.delete(to);
			}
		}

		return { foundCycles };
	}

	getOutgoing(node: T): readonly T[] {
		const outgoing = this._outgoingEdges.get(node);
		return outgoing ? Array.from(outgoing) : [];
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionIsVisible.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionIsVisible.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { matchesSubString } from '../../../../../base/common/filters.js';
import { TextReplacement } from '../../../../common/core/edits/textEdit.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { ITextModel, EndOfLinePreference } from '../../../../common/model.js';
import { singleTextRemoveCommonPrefix } from './singleTextEditHelpers.js';

export function inlineCompletionIsVisible(singleTextEdit: TextReplacement, originalRange: Range | undefined, model: ITextModel, cursorPosition: Position): boolean {
	const minimizedReplacement = singleTextRemoveCommonPrefix(singleTextEdit, model);
	const editRange = singleTextEdit.range;
	if (!editRange
		|| (originalRange && !originalRange.getStartPosition().equals(editRange.getStartPosition()))
		|| cursorPosition.lineNumber !== minimizedReplacement.range.startLineNumber
		|| minimizedReplacement.isEmpty // if the completion is empty after removing the common prefix of the completion and the model, the completion item would not be visible
	) {
		return false;
	}

	// We might consider comparing by .toLowerText, but this requires GhostTextReplacement
	const originalValue = model.getValueInRange(minimizedReplacement.range, EndOfLinePreference.LF);
	const filterText = minimizedReplacement.text;

	const cursorPosIndex = Math.max(0, cursorPosition.column - minimizedReplacement.range.startColumn);

	let filterTextBefore = filterText.substring(0, cursorPosIndex);
	let filterTextAfter = filterText.substring(cursorPosIndex);

	let originalValueBefore = originalValue.substring(0, cursorPosIndex);
	let originalValueAfter = originalValue.substring(cursorPosIndex);

	const originalValueIndent = model.getLineIndentColumn(minimizedReplacement.range.startLineNumber);
	if (minimizedReplacement.range.startColumn <= originalValueIndent) {
		// Remove indentation
		originalValueBefore = originalValueBefore.trimStart();
		if (originalValueBefore.length === 0) {
			originalValueAfter = originalValueAfter.trimStart();
		}
		filterTextBefore = filterTextBefore.trimStart();
		if (filterTextBefore.length === 0) {
			filterTextAfter = filterTextAfter.trimStart();
		}
	}

	return filterTextBefore.startsWith(originalValueBefore)
		&& !!matchesSubString(originalValueAfter, filterTextAfter);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsModel.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mapFindFirst } from '../../../../../base/common/arraysFind.js';
import { arrayEqualsC } from '../../../../../base/common/equals.js';
import { BugIndicatingError, onUnexpectedExternalError } from '../../../../../base/common/errors.js';
import { Emitter } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IObservable, IObservableWithChange, IReader, ITransaction, autorun, constObservable, derived, derivedHandleChanges, derivedOpts, mapObservableArrayCached, observableFromEvent, observableSignal, observableValue, recomputeInitiallyAndOnChange, subtransaction, transaction } from '../../../../../base/common/observable.js';
import { firstNonWhitespaceIndex } from '../../../../../base/common/strings.js';
import { isDefined } from '../../../../../base/common/types.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../../browser/observableCodeEditor.js';
import { EditorOption } from '../../../../common/config/editorOptions.js';
import { CursorColumns } from '../../../../common/core/cursorColumns.js';
import { LineRange } from '../../../../common/core/ranges/lineRange.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { TextReplacement, TextEdit } from '../../../../common/core/edits/textEdit.js';
import { TextLength } from '../../../../common/core/text/textLength.js';
import { ScrollType } from '../../../../common/editorCommon.js';
import { InlineCompletionEndOfLifeReasonKind, InlineCompletion, InlineCompletionTriggerKind, PartialAcceptTriggerKind, InlineCompletionsProvider, InlineCompletionCommand } from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { EndOfLinePreference, IModelDeltaDecoration, ITextModel } from '../../../../common/model.js';
import { TextModelText } from '../../../../common/model/textModelText.js';
import { IFeatureDebounceInformation } from '../../../../common/services/languageFeatureDebounce.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { IModelContentChangedEvent } from '../../../../common/textModelEvents.js';
import { SnippetController2 } from '../../../snippet/browser/snippetController2.js';
import { getEndPositionsAfterApplying, removeTextReplacementCommonSuffixPrefix } from '../utils.js';
import { AnimatedValue, easeOutCubic, ObservableAnimatedValue } from './animation.js';
import { computeGhostText } from './computeGhostText.js';
import { GhostText, GhostTextOrReplacement, ghostTextOrReplacementEquals, ghostTextsOrReplacementsEqual } from './ghostText.js';
import { InlineCompletionsSource } from './inlineCompletionsSource.js';
import { InlineCompletionItem, InlineEditItem, InlineSuggestionItem } from './inlineSuggestionItem.js';
import { InlineCompletionContextWithoutUuid, InlineCompletionEditorType, InlineSuggestRequestInfo, InlineSuggestSku } from './provideInlineCompletions.js';
import { singleTextEditAugments, singleTextRemoveCommonPrefix } from './singleTextEditHelpers.js';
import { SuggestItemInfo } from './suggestWidgetAdapter.js';
import { TextModelEditSource, EditSources } from '../../../../common/textModelEditSource.js';
import { ICodeEditorService } from '../../../../browser/services/codeEditorService.js';
import { InlineCompletionViewData, InlineCompletionViewKind } from '../view/inlineEdits/inlineEditsViewInterface.js';
import { IInlineCompletionsService } from '../../../../browser/services/inlineCompletionsService.js';
import { TypingInterval } from './typingSpeed.js';
import { StringReplacement } from '../../../../common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../../common/core/ranges/offsetRange.js';
import { URI } from '../../../../../base/common/uri.js';
import { IDefaultAccountService } from '../../../../../platform/defaultAccount/common/defaultAccount.js';
import { IDefaultAccount } from '../../../../../base/common/defaultAccount.js';

export class InlineCompletionsModel extends Disposable {
	private readonly _source;
	private readonly _isActive = observableValue<boolean>(this, false);
	private readonly _onlyRequestInlineEditsSignal = observableSignal(this);
	private readonly _forceUpdateExplicitlySignal = observableSignal(this);
	private readonly _noDelaySignal = observableSignal(this);

	private readonly _fetchSpecificProviderSignal = observableSignal<InlineCompletionsProvider | undefined>(this);

	// We use a semantic id to keep the same inline completion selected even if the provider reorders the completions.
	private readonly _selectedInlineCompletionId = observableValue<string | undefined>(this, undefined);
	public readonly primaryPosition = derived(this, reader => this._positions.read(reader)[0] ?? new Position(1, 1));
	public readonly allPositions = derived(this, reader => this._positions.read(reader));

	private readonly sku = observableValue<InlineSuggestSku | undefined>(this, undefined);

	private _isAcceptingPartially = false;
	private readonly _appearedInsideViewport = derived<boolean>(this, reader => {
		const state = this.state.read(reader);
		if (!state || !state.inlineSuggestion) {
			return false;
		}

		return isSuggestionInViewport(this._editor, state.inlineSuggestion);
	});
	public get isAcceptingPartially() { return this._isAcceptingPartially; }

	private readonly _onDidAccept = new Emitter<void>();
	public readonly onDidAccept = this._onDidAccept.event;

	private readonly _editorObs;

	private readonly _typing: TypingInterval;

	private readonly _suggestPreviewEnabled;
	private readonly _suggestPreviewMode;
	private readonly _inlineSuggestMode;
	private readonly _suppressedInlineCompletionGroupIds;
	private readonly _inlineEditsEnabled;
	private readonly _inlineEditsShowCollapsedEnabled;
	private readonly _triggerCommandOnProviderChange;
	private readonly _minShowDelay;
	private readonly _showOnSuggestConflict;
	private readonly _suppressInSnippetMode;
	private readonly _isInSnippetMode;

	get editor() {
		return this._editor;
	}

	constructor(
		public readonly textModel: ITextModel,
		private readonly _selectedSuggestItem: IObservable<SuggestItemInfo | undefined>,
		public readonly _textModelVersionId: IObservableWithChange<number | null, IModelContentChangedEvent | undefined>,
		private readonly _positions: IObservable<readonly Position[]>,
		private readonly _debounceValue: IFeatureDebounceInformation,
		private readonly _enabled: IObservable<boolean>,
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ICommandService private readonly _commandService: ICommandService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IInlineCompletionsService private readonly _inlineCompletionsService: IInlineCompletionsService,
		@IDefaultAccountService defaultAccountService: IDefaultAccountService,
	) {
		super();
		this._source = this._register(this._instantiationService.createInstance(InlineCompletionsSource, this.textModel, this._textModelVersionId, this._debounceValue, this.primaryPosition));
		this.lastTriggerKind = this._source.inlineCompletions.map(this, v => v?.request?.context.triggerKind);

		this._editorObs = observableCodeEditor(this._editor);

		const suggest = this._editorObs.getOption(EditorOption.suggest);
		this._suggestPreviewEnabled = suggest.map(v => v.preview);
		this._suggestPreviewMode = suggest.map(v => v.previewMode);

		const inlineSuggest = this._editorObs.getOption(EditorOption.inlineSuggest);
		this._inlineSuggestMode = inlineSuggest.map(v => v.mode);
		this._suppressedInlineCompletionGroupIds = inlineSuggest.map(v => new Set(v.experimental.suppressInlineSuggestions.split(',')));
		this._inlineEditsEnabled = inlineSuggest.map(v => !!v.edits.enabled);
		this._inlineEditsShowCollapsedEnabled = inlineSuggest.map(s => s.edits.showCollapsed);
		this._triggerCommandOnProviderChange = inlineSuggest.map(s => s.triggerCommandOnProviderChange);
		this._minShowDelay = inlineSuggest.map(s => s.minShowDelay);
		this._showOnSuggestConflict = inlineSuggest.map(s => s.experimental.showOnSuggestConflict);
		this._suppressInSnippetMode = inlineSuggest.map(s => s.suppressInSnippetMode);

		const snippetController = SnippetController2.get(this._editor);
		this._isInSnippetMode = snippetController?.isInSnippetObservable ?? constObservable(false);

		defaultAccountService.getDefaultAccount().then(createDisposableCb(account => this.sku.set(skuFromAccount(account), undefined), this._store));
		this._register(defaultAccountService.onDidChangeDefaultAccount(account => this.sku.set(skuFromAccount(account), undefined)));

		this._typing = this._register(new TypingInterval(this.textModel));

		this._register(this._inlineCompletionsService.onDidChangeIsSnoozing((isSnoozing) => {
			if (isSnoozing) {
				this.stop();
			}
		}));

		{ // Determine editor type
			const isNotebook = this.textModel.uri.scheme === 'vscode-notebook-cell';
			const [diffEditor] = this._codeEditorService.listDiffEditors()
				.filter(d =>
					d.getOriginalEditor().getId() === this._editor.getId() ||
					d.getModifiedEditor().getId() === this._editor.getId());

			this.isInDiffEditor = !!diffEditor;
			this.editorType = isNotebook ? InlineCompletionEditorType.Notebook
				: this.isInDiffEditor ? InlineCompletionEditorType.DiffEditor
					: InlineCompletionEditorType.TextEditor;
		}

		this._register(recomputeInitiallyAndOnChange(this.state, (s) => {
			if (s && s.inlineSuggestion) {
				this._inlineCompletionsService.reportNewCompletion(s.inlineSuggestion.requestUuid);
			}
		}));

		this._register(recomputeInitiallyAndOnChange(this._fetchInlineCompletionsPromise));

		this._register(autorun(reader => {
			this._editorObs.versionId.read(reader);
			this._inAcceptFlow.set(false, undefined);
		}));

		this._register(autorun(reader => {
			const jumpToReset = this.state.map((s, reader) => !s || s.kind === 'inlineEdit' && !s.cursorAtInlineEdit.read(reader)).read(reader);
			if (jumpToReset) {
				this._jumpedToId.set(undefined, undefined);
			}
		}));

		this._register(autorun(reader => {
			const inlineSuggestion = this.state.map(s => s?.inlineSuggestion).read(reader);
			if (inlineSuggestion) {
				inlineSuggestion.addPerformanceMarker('activeSuggestion');
			}
		}));

		const inlineEditSemanticId = this.inlineEditState.map(s => s?.inlineSuggestion.semanticId);

		this._register(autorun(reader => {
			const id = inlineEditSemanticId.read(reader);
			if (id) {
				this._editor.pushUndoStop();
				this._lastShownInlineCompletionInfo = {
					alternateTextModelVersionId: this.textModel.getAlternativeVersionId(),
					inlineCompletion: this.state.get()!.inlineSuggestion!,
				};
			}
		}));

		// TODO: should use getAvailableProviders and update on _suppressedInlineCompletionGroupIds change
		const inlineCompletionProviders = observableFromEvent(this._languageFeaturesService.inlineCompletionsProvider.onDidChange, () => this._languageFeaturesService.inlineCompletionsProvider.all(textModel));
		mapObservableArrayCached(this, inlineCompletionProviders, (provider, store) => {
			if (!provider.onDidChangeInlineCompletions) {
				return;
			}

			store.add(provider.onDidChangeInlineCompletions(() => {
				if (!this._enabled.get()) {
					return;
				}

				// Only update the active editor
				const activeEditor = this._codeEditorService.getFocusedCodeEditor() || this._codeEditorService.getActiveCodeEditor();
				if (activeEditor !== this._editor) {
					return;
				}

				if (this._triggerCommandOnProviderChange.get()) {
					// TODO@hediet remove this and always do the else branch.
					this.trigger(undefined, { onlyFetchInlineEdits: true });
					return;
				}


				// If there is an active suggestion from a different provider, we ignore the update
				const activeState = this.state.get();
				if (activeState && (activeState.inlineSuggestion || activeState.edits) && activeState.inlineSuggestion?.source.provider !== provider) {
					return;
				}

				transaction(tx => {
					this._fetchSpecificProviderSignal.trigger(tx, provider);
					this.trigger(tx);
				});

			}));
		}).recomputeInitiallyAndOnChange(this._store);

		this._didUndoInlineEdits.recomputeInitiallyAndOnChange(this._store);
	}

	private _lastShownInlineCompletionInfo: { alternateTextModelVersionId: number; /* already freed! */ inlineCompletion: InlineSuggestionItem } | undefined = undefined;
	private _lastAcceptedInlineCompletionInfo: { textModelVersionIdAfter: number; /* already freed! */ inlineCompletion: InlineSuggestionItem } | undefined = undefined;
	private readonly _didUndoInlineEdits = derivedHandleChanges({
		owner: this,
		changeTracker: {
			createChangeSummary: () => ({ didUndo: false }),
			handleChange: (ctx, changeSummary) => {
				changeSummary.didUndo = ctx.didChange(this._textModelVersionId) && !!ctx.change?.isUndoing;
				return true;
			}
		}
	}, (reader, changeSummary) => {
		const versionId = this._textModelVersionId.read(reader);
		if (versionId !== null
			&& this._lastAcceptedInlineCompletionInfo
			&& this._lastAcceptedInlineCompletionInfo.textModelVersionIdAfter === versionId - 1
			&& this._lastAcceptedInlineCompletionInfo.inlineCompletion.isInlineEdit
			&& changeSummary.didUndo
		) {
			this._lastAcceptedInlineCompletionInfo = undefined;
			return true;
		}
		return false;
	});

	public debugGetSelectedSuggestItem(): IObservable<SuggestItemInfo | undefined> {
		return this._selectedSuggestItem;
	}

	public getIndentationInfo(reader: IReader) {
		let startsWithIndentation = false;
		let startsWithIndentationLessThanTabSize = true;
		const ghostText = this?.primaryGhostText.read(reader);
		if (!!this?._selectedSuggestItem && ghostText && ghostText.parts.length > 0) {
			const { column, lines } = ghostText.parts[0];

			const firstLine = lines[0].line;

			const indentationEndColumn = this.textModel.getLineIndentColumn(ghostText.lineNumber);
			const inIndentation = column <= indentationEndColumn;

			if (inIndentation) {
				let firstNonWsIdx = firstNonWhitespaceIndex(firstLine);
				if (firstNonWsIdx === -1) {
					firstNonWsIdx = firstLine.length - 1;
				}
				startsWithIndentation = firstNonWsIdx > 0;

				const tabSize = this.textModel.getOptions().tabSize;
				const visibleColumnIndentation = CursorColumns.visibleColumnFromColumn(firstLine, firstNonWsIdx + 1, tabSize);
				startsWithIndentationLessThanTabSize = visibleColumnIndentation < tabSize;
			}
		}
		return {
			startsWithIndentation,
			startsWithIndentationLessThanTabSize,
		};
	}

	private readonly _preserveCurrentCompletionReasons = new Set([
		VersionIdChangeReason.Redo,
		VersionIdChangeReason.Undo,
		VersionIdChangeReason.AcceptWord,
	]);

	private _getReason(e: IModelContentChangedEvent | undefined): VersionIdChangeReason {
		if (e?.isUndoing) { return VersionIdChangeReason.Undo; }
		if (e?.isRedoing) { return VersionIdChangeReason.Redo; }
		if (this.isAcceptingPartially) { return VersionIdChangeReason.AcceptWord; }
		return VersionIdChangeReason.Other;
	}

	public readonly dontRefetchSignal = observableSignal(this);

	private readonly _fetchInlineCompletionsPromise = derivedHandleChanges({
		owner: this,
		changeTracker: {
			createChangeSummary: () => ({
				dontRefetch: false,
				preserveCurrentCompletion: false,
				inlineCompletionTriggerKind: InlineCompletionTriggerKind.Automatic,
				onlyRequestInlineEdits: false,
				shouldDebounce: true,
				provider: undefined as InlineCompletionsProvider | undefined,
				textChange: false,
				changeReason: '',
			}),
			handleChange: (ctx, changeSummary) => {
				/** @description fetch inline completions */
				if (ctx.didChange(this._textModelVersionId)) {
					if (this._preserveCurrentCompletionReasons.has(this._getReason(ctx.change))) {
						changeSummary.preserveCurrentCompletion = true;
					}
					const detailedReasons = ctx.change?.detailedReasons ?? [];
					changeSummary.changeReason = detailedReasons.length > 0 ? detailedReasons[0].getType() : '';
					changeSummary.textChange = true;
				} else if (ctx.didChange(this._forceUpdateExplicitlySignal)) {
					changeSummary.preserveCurrentCompletion = true;
					changeSummary.inlineCompletionTriggerKind = InlineCompletionTriggerKind.Explicit;
				} else if (ctx.didChange(this.dontRefetchSignal)) {
					changeSummary.dontRefetch = true;
				} else if (ctx.didChange(this._onlyRequestInlineEditsSignal)) {
					changeSummary.onlyRequestInlineEdits = true;
				} else if (ctx.didChange(this._fetchSpecificProviderSignal)) {
					changeSummary.provider = ctx.change;
				}
				return true;
			},
		},
	}, (reader, changeSummary) => {
		this._source.clearOperationOnTextModelChange.read(reader); // Make sure the clear operation runs before the fetch operation
		this._noDelaySignal.read(reader);
		this.dontRefetchSignal.read(reader);
		this._onlyRequestInlineEditsSignal.read(reader);
		this._forceUpdateExplicitlySignal.read(reader);
		this._fetchSpecificProviderSignal.read(reader);
		const shouldUpdate = ((this._enabled.read(reader) && this._selectedSuggestItem.read(reader)) || this._isActive.read(reader))
			&& (!this._inlineCompletionsService.isSnoozing() || changeSummary.inlineCompletionTriggerKind === InlineCompletionTriggerKind.Explicit);
		if (!shouldUpdate) {
			this._source.cancelUpdate();
			return undefined;
		}

		this._textModelVersionId.read(reader); // Refetch on text change

		const suggestWidgetInlineCompletions = this._source.suggestWidgetInlineCompletions.read(undefined);
		let suggestItem = this._selectedSuggestItem.read(reader);
		if (this._shouldShowOnSuggestConflict.read(undefined)) {
			suggestItem = undefined;
		}
		if (suggestWidgetInlineCompletions && !suggestItem) {
			this._source.seedInlineCompletionsWithSuggestWidget();
		}

		if (changeSummary.dontRefetch) {
			return Promise.resolve(true);
		}

		if (this._didUndoInlineEdits.read(reader) && changeSummary.inlineCompletionTriggerKind !== InlineCompletionTriggerKind.Explicit) {
			transaction(tx => {
				this._source.clear(tx);
			});
			return undefined;
		}

		let reason: string = '';
		if (changeSummary.provider) {
			reason += 'providerOnDidChange';
		} else if (changeSummary.inlineCompletionTriggerKind === InlineCompletionTriggerKind.Explicit) {
			reason += 'explicit';
		}
		if (changeSummary.changeReason) {
			reason += reason.length > 0 ? `:${changeSummary.changeReason}` : changeSummary.changeReason;
		}

		const typingInterval = this._typing.getTypingInterval();
		const requestInfo: InlineSuggestRequestInfo = {
			editorType: this.editorType,
			startTime: Date.now(),
			languageId: this.textModel.getLanguageId(),
			reason,
			typingInterval: typingInterval.averageInterval,
			typingIntervalCharacterCount: typingInterval.characterCount,
			availableProviders: [],
			sku: this.sku.read(undefined),
		};

		let context: InlineCompletionContextWithoutUuid = {
			triggerKind: changeSummary.inlineCompletionTriggerKind,
			selectedSuggestionInfo: suggestItem?.toSelectedSuggestionInfo(),
			includeInlineCompletions: !changeSummary.onlyRequestInlineEdits,
			includeInlineEdits: this._inlineEditsEnabled.read(reader),
			requestIssuedDateTime: requestInfo.startTime,
			earliestShownDateTime: requestInfo.startTime + (changeSummary.inlineCompletionTriggerKind === InlineCompletionTriggerKind.Explicit || this.inAcceptFlow.read(undefined) ? 0 : this._minShowDelay.read(undefined)),
		};

		if (context.triggerKind === InlineCompletionTriggerKind.Automatic && changeSummary.textChange) {
			if (this.textModel.getAlternativeVersionId() === this._lastShownInlineCompletionInfo?.alternateTextModelVersionId) {
				// When undoing back to a version where an inline edit/completion was shown,
				// we want to show an inline edit (or completion) again if it was originally an inline edit (or completion).
				context = {
					...context,
					includeInlineCompletions: !this._lastShownInlineCompletionInfo.inlineCompletion.isInlineEdit,
					includeInlineEdits: this._lastShownInlineCompletionInfo.inlineCompletion.isInlineEdit,
				};
			}
		}

		const itemToPreserveCandidate = this.selectedInlineCompletion.read(undefined) ?? this._inlineCompletionItems.read(undefined)?.inlineEdit;
		const itemToPreserve = changeSummary.preserveCurrentCompletion || itemToPreserveCandidate?.forwardStable
			? itemToPreserveCandidate : undefined;
		const userJumpedToActiveCompletion = this._jumpedToId.map(jumpedTo => !!jumpedTo && jumpedTo === this._inlineCompletionItems.read(undefined)?.inlineEdit?.semanticId);

		const providers = changeSummary.provider
			? { providers: [changeSummary.provider], label: 'single:' + changeSummary.provider.providerId?.toString() }
			: { providers: this._languageFeaturesService.inlineCompletionsProvider.all(this.textModel), label: undefined }; // TODO: should use inlineCompletionProviders
		const availableProviders = this.getAvailableProviders(providers.providers);
		requestInfo.availableProviders = availableProviders.map(p => p.providerId).filter(isDefined);

		return this._source.fetch(availableProviders, providers.label, context, itemToPreserve?.identity, changeSummary.shouldDebounce, userJumpedToActiveCompletion, requestInfo);
	});

	// TODO: This is not an ideal implementation of excludesGroupIds, however as this is currently still behind proposed API
	// and due to the time constraints, we are using a simplified approach
	private getAvailableProviders(providers: InlineCompletionsProvider[]): InlineCompletionsProvider[] {
		const suppressedProviderGroupIds = this._suppressedInlineCompletionGroupIds.get();
		const unsuppressedProviders = providers.filter(provider => !(provider.groupId && suppressedProviderGroupIds.has(provider.groupId)));

		const excludedGroupIds = new Set<string>();
		for (const provider of unsuppressedProviders) {
			provider.excludesGroupIds?.forEach(p => excludedGroupIds.add(p));
		}

		const availableProviders: InlineCompletionsProvider[] = [];
		for (const provider of unsuppressedProviders) {
			if (provider.groupId && excludedGroupIds.has(provider.groupId)) {
				continue;
			}
			availableProviders.push(provider);
		}

		return availableProviders;
	}

	public async trigger(tx?: ITransaction, options: { onlyFetchInlineEdits?: boolean; noDelay?: boolean; provider?: InlineCompletionsProvider; explicit?: boolean } = {}): Promise<void> {
		subtransaction(tx, tx => {
			if (options.onlyFetchInlineEdits) {
				this._onlyRequestInlineEditsSignal.trigger(tx);
			}
			if (options.noDelay) {
				this._noDelaySignal.trigger(tx);
			}
			this._isActive.set(true, tx);

			if (options.explicit) {
				this._inAcceptFlow.set(true, tx);
				this._forceUpdateExplicitlySignal.trigger(tx);
			}
			if (options.provider) {
				this._fetchSpecificProviderSignal.trigger(tx, options.provider);
			}
		});
		await this._fetchInlineCompletionsPromise.get();
	}

	public async triggerExplicitly(tx?: ITransaction, onlyFetchInlineEdits: boolean = false): Promise<void> {
		return this.trigger(tx, { onlyFetchInlineEdits, explicit: true });
	}

	public stop(stopReason: 'explicitCancel' | 'automatic' = 'automatic', tx?: ITransaction): void {
		subtransaction(tx, tx => {
			if (stopReason === 'explicitCancel') {
				const inlineCompletion = this.state.get()?.inlineSuggestion;
				if (inlineCompletion) {
					inlineCompletion.reportEndOfLife({ kind: InlineCompletionEndOfLifeReasonKind.Rejected });
				}
			}

			this._isActive.set(false, tx);
			this._source.clear(tx);
		});
	}

	private readonly _inlineCompletionItems = derivedOpts({ owner: this }, reader => {
		const c = this._source.inlineCompletions.read(reader);
		if (!c) { return undefined; }
		const cursorPosition = this.primaryPosition.read(reader);
		let inlineEdit: InlineEditItem | undefined = undefined;
		const visibleCompletions: InlineCompletionItem[] = [];
		for (const completion of c.inlineCompletions) {
			if (!completion.isInlineEdit) {
				if (completion.isVisible(this.textModel, cursorPosition)) {
					visibleCompletions.push(completion);
				}
			} else {
				inlineEdit = completion;
			}
		}

		if (visibleCompletions.length !== 0) {
			// Don't show the inline edit if there is a visible completion
			inlineEdit = undefined;
		}

		return {
			inlineCompletions: visibleCompletions,
			inlineEdit,
		};
	});

	private readonly _filteredInlineCompletionItems = derivedOpts({ owner: this, equalsFn: arrayEqualsC() }, reader => {
		const c = this._inlineCompletionItems.read(reader);
		return c?.inlineCompletions ?? [];
	});

	public readonly selectedInlineCompletionIndex = derived<number>(this, (reader) => {
		const selectedInlineCompletionId = this._selectedInlineCompletionId.read(reader);
		const filteredCompletions = this._filteredInlineCompletionItems.read(reader);
		const idx = this._selectedInlineCompletionId === undefined ? -1
			: filteredCompletions.findIndex(v => v.semanticId === selectedInlineCompletionId);
		if (idx === -1) {
			// Reset the selection so that the selection does not jump back when it appears again
			this._selectedInlineCompletionId.set(undefined, undefined);
			return 0;
		}
		return idx;
	});

	public readonly selectedInlineCompletion = derived<InlineCompletionItem | undefined>(this, (reader) => {
		const filteredCompletions = this._filteredInlineCompletionItems.read(reader);
		const idx = this.selectedInlineCompletionIndex.read(reader);
		return filteredCompletions[idx];
	});

	public readonly activeCommands = derivedOpts<InlineCompletionCommand[]>({ owner: this, equalsFn: arrayEqualsC() },
		r => this.selectedInlineCompletion.read(r)?.source.inlineSuggestions.commands ?? []
	);

	public readonly lastTriggerKind: IObservable<InlineCompletionTriggerKind | undefined>;

	public readonly inlineCompletionsCount = derived<number | undefined>(this, reader => {
		if (this.lastTriggerKind.read(reader) === InlineCompletionTriggerKind.Explicit) {
			return this._filteredInlineCompletionItems.read(reader).length;
		} else {
			return undefined;
		}
	});

	private readonly _hasVisiblePeekWidgets = derived(this, reader => this._editorObs.openedPeekWidgets.read(reader) > 0);

	private readonly _shouldShowOnSuggestConflict = derived(this, reader => {
		const showOnSuggestConflict = this._showOnSuggestConflict.read(reader);
		if (showOnSuggestConflict !== 'never') {
			const hasInlineCompletion = !!this.selectedInlineCompletion.read(reader);
			if (hasInlineCompletion) {
				const item = this._selectedSuggestItem.read(reader);
				if (!item) {
					return false;
				}
				if (showOnSuggestConflict === 'whenSuggestListIsIncomplete') {
					return item.listIncomplete;
				}
				return true;
			}
		}
		return false;
	});

	public readonly state = derivedOpts<{
		kind: 'ghostText';
		edits: readonly TextReplacement[];
		primaryGhostText: GhostTextOrReplacement;
		ghostTexts: readonly GhostTextOrReplacement[];
		suggestItem: SuggestItemInfo | undefined;
		inlineSuggestion: InlineCompletionItem | undefined;
	} | {
		kind: 'inlineEdit';
		edits: readonly TextReplacement[];
		inlineSuggestion: InlineEditItem;
		cursorAtInlineEdit: IObservable<boolean>;
		nextEditUri: URI | undefined;
	} | undefined>({
		owner: this,
		equalsFn: (a, b) => {
			if (!a || !b) { return a === b; }

			if (a.kind === 'ghostText' && b.kind === 'ghostText') {
				return ghostTextsOrReplacementsEqual(a.ghostTexts, b.ghostTexts)
					&& a.inlineSuggestion === b.inlineSuggestion
					&& a.suggestItem === b.suggestItem;
			} else if (a.kind === 'inlineEdit' && b.kind === 'inlineEdit') {
				return a.inlineSuggestion === b.inlineSuggestion;
			}
			return false;
		}
	}, (reader) => {
		const model = this.textModel;

		if (this._suppressInSnippetMode.read(reader) && this._isInSnippetMode.read(reader)) {
			return undefined;
		}

		const item = this._inlineCompletionItems.read(reader);
		const inlineEditResult = item?.inlineEdit;
		if (inlineEditResult) {
			if (this._hasVisiblePeekWidgets.read(reader)) {
				return undefined;
			}
			const cursorAtInlineEdit = this.primaryPosition.map(cursorPos => LineRange.fromRangeInclusive(inlineEditResult.targetRange).addMargin(1, 1).contains(cursorPos.lineNumber));
			const stringEdit = inlineEditResult.action?.kind === 'edit' ? inlineEditResult.action.stringEdit : undefined;
			const replacements = stringEdit ? TextEdit.fromStringEdit(stringEdit, new TextModelText(this.textModel)).replacements : [];

			const nextEditUri = (item.inlineEdit?.command?.id === 'vscode.open' || item.inlineEdit?.command?.id === '_workbench.open') &&
				// eslint-disable-next-line local/code-no-any-casts
				item.inlineEdit?.command.arguments?.length ? URI.from(<any>item.inlineEdit?.command.arguments[0]) : undefined;
			return { kind: 'inlineEdit', inlineSuggestion: inlineEditResult, edits: replacements, cursorAtInlineEdit, nextEditUri };
		}

		const suggestItem = this._selectedSuggestItem.read(reader);
		if (!this._shouldShowOnSuggestConflict.read(reader) && suggestItem) {
			const suggestCompletionEdit = singleTextRemoveCommonPrefix(suggestItem.getSingleTextEdit(), model);
			const augmentation = this._computeAugmentation(suggestCompletionEdit, reader);

			const isSuggestionPreviewEnabled = this._suggestPreviewEnabled.read(reader);
			if (!isSuggestionPreviewEnabled && !augmentation) { return undefined; }

			const fullEdit = augmentation?.edit ?? suggestCompletionEdit;
			const fullEditPreviewLength = augmentation ? augmentation.edit.text.length - suggestCompletionEdit.text.length : 0;

			const mode = this._suggestPreviewMode.read(reader);
			const positions = this._positions.read(reader);
			const allPotentialEdits = [fullEdit, ...getSecondaryEdits(this.textModel, positions, fullEdit)];
			const validEditsAndGhostTexts = allPotentialEdits
				.map((edit, idx) => ({ edit, ghostText: edit ? computeGhostText(edit, model, mode, positions[idx], fullEditPreviewLength) : undefined }))
				.filter(({ edit, ghostText }) => edit !== undefined && ghostText !== undefined);
			const edits = validEditsAndGhostTexts.map(({ edit }) => edit!);
			const ghostTexts = validEditsAndGhostTexts.map(({ ghostText }) => ghostText!);
			const primaryGhostText = ghostTexts[0] ?? new GhostText(fullEdit.range.endLineNumber, []);
			return { kind: 'ghostText', edits, primaryGhostText, ghostTexts, inlineSuggestion: augmentation?.completion, suggestItem };
		} else {
			if (!this._isActive.read(reader)) { return undefined; }
			const inlineSuggestion = this.selectedInlineCompletion.read(reader);
			if (!inlineSuggestion) { return undefined; }

			const replacement = inlineSuggestion.getSingleTextEdit();
			const mode = this._inlineSuggestMode.read(reader);
			const positions = this._positions.read(reader);
			const allPotentialEdits = [replacement, ...getSecondaryEdits(this.textModel, positions, replacement)];
			const validEditsAndGhostTexts = allPotentialEdits
				.map((edit, idx) => ({ edit, ghostText: edit ? computeGhostText(edit, model, mode, positions[idx], 0) : undefined }))
				.filter(({ edit, ghostText }) => edit !== undefined && ghostText !== undefined);
			const edits = validEditsAndGhostTexts.map(({ edit }) => edit!);
			const ghostTexts = validEditsAndGhostTexts.map(({ ghostText }) => ghostText!);
			if (!ghostTexts[0]) { return undefined; }
			return { kind: 'ghostText', edits, primaryGhostText: ghostTexts[0], ghostTexts, inlineSuggestion, suggestItem: undefined };
		}
	});

	public readonly status = derived(this, reader => {
		if (this._source.loading.read(reader)) { return 'loading'; }
		const s = this.state.read(reader);
		if (s?.kind === 'ghostText') { return 'ghostText'; }
		if (s?.kind === 'inlineEdit') { return 'inlineEdit'; }
		return 'noSuggestion';
	});

	public readonly inlineCompletionState = derived(this, reader => {
		const s = this.state.read(reader);
		if (!s || s.kind !== 'ghostText') {
			return undefined;
		}
		if (this._editorObs.inComposition.read(reader)) {
			return undefined;
		}
		return s;
	});

	public readonly inlineEditState = derived(this, reader => {
		const s = this.state.read(reader);
		if (!s || s.kind !== 'inlineEdit') {
			return undefined;
		}
		return s;
	});

	public readonly inlineEditAvailable = derived(this, reader => {
		const s = this.inlineEditState.read(reader);
		return !!s;
	});

	private _computeAugmentation(suggestCompletion: TextReplacement, reader: IReader | undefined) {
		const model = this.textModel;
		const suggestWidgetInlineCompletions = this._source.suggestWidgetInlineCompletions.read(reader);
		const candidateInlineCompletions = suggestWidgetInlineCompletions
			? suggestWidgetInlineCompletions.inlineCompletions.filter(c => !c.isInlineEdit)
			: [this.selectedInlineCompletion.read(reader)].filter(isDefined);

		const augmentedCompletion = mapFindFirst(candidateInlineCompletions, completion => {
			let r = completion.getSingleTextEdit();
			r = singleTextRemoveCommonPrefix(
				r,
				model,
				Range.fromPositions(r.range.getStartPosition(), suggestCompletion.range.getEndPosition())
			);
			return singleTextEditAugments(r, suggestCompletion) ? { completion, edit: r } : undefined;
		});

		return augmentedCompletion;
	}

	public readonly warning = derived(this, reader => {
		return this.inlineCompletionState.read(reader)?.inlineSuggestion?.warning;
	});

	public readonly ghostTexts = derivedOpts({ owner: this, equalsFn: ghostTextsOrReplacementsEqual }, reader => {
		const v = this.inlineCompletionState.read(reader);
		if (!v) {
			return undefined;
		}
		return v.ghostTexts;
	});

	public readonly primaryGhostText = derivedOpts({ owner: this, equalsFn: ghostTextOrReplacementEquals }, reader => {
		const v = this.inlineCompletionState.read(reader);
		if (!v) {
			return undefined;
		}
		return v?.primaryGhostText;
	});

	public readonly showCollapsed = derived<boolean>(this, reader => {
		const state = this.state.read(reader);
		if (!state || state.kind !== 'inlineEdit') {
			return false;
		}

		if (state.inlineSuggestion.hint || state.inlineSuggestion.action?.kind === 'jumpTo') {
			return false;
		}

		const isCurrentModelVersion = state.inlineSuggestion.updatedEditModelVersion === this._textModelVersionId.read(reader);
		return (this._inlineEditsShowCollapsedEnabled.read(reader) || !isCurrentModelVersion)
			&& this._jumpedToId.read(reader) !== state.inlineSuggestion.semanticId
			&& !this._inAcceptFlow.read(reader);
	});

	private readonly _tabShouldIndent = derived(this, reader => {
		if (this._inAcceptFlow.read(reader)) {
			return false;
		}

		function isMultiLine(range: Range): boolean {
			return range.startLineNumber !== range.endLineNumber;
		}

		function getNonIndentationRange(model: ITextModel, lineNumber: number): Range {
			const columnStart = model.getLineIndentColumn(lineNumber);
			const lastNonWsColumn = model.getLineLastNonWhitespaceColumn(lineNumber);
			const columnEnd = Math.max(lastNonWsColumn, columnStart);
			return new Range(lineNumber, columnStart, lineNumber, columnEnd);
		}

		const selections = this._editorObs.selections.read(reader);
		return selections?.some(s => {
			if (s.isEmpty()) {
				return this.textModel.getLineLength(s.startLineNumber) === 0;
			} else {
				return isMultiLine(s) || s.containsRange(getNonIndentationRange(this.textModel, s.startLineNumber));
			}
		});
	});

	public readonly tabShouldJumpToInlineEdit = derived(this, reader => {
		if (this._tabShouldIndent.read(reader)) {
			return false;
		}

		const s = this.inlineEditState.read(reader);
		if (!s) {
			return false;
		}


		if (s.inlineSuggestion.action?.kind === 'jumpTo') {
			return true;
		}

		if (this.showCollapsed.read(reader)) {
			return true;
		}

		if (this._inAcceptFlow.read(reader) && this._appearedInsideViewport.read(reader)) {
			return false;
		}

		return !s.cursorAtInlineEdit.read(reader);
	});

	public readonly tabShouldAcceptInlineEdit = derived(this, reader => {
		const s = this.inlineEditState.read(reader);
		if (!s) {
			return false;
		}
		if (s.inlineSuggestion.action?.kind === 'jumpTo') {
			return false;
		}
		if (this.showCollapsed.read(reader)) {
			return false;
		}
		if (this._tabShouldIndent.read(reader)) {
			return false;
		}
		if (this._inAcceptFlow.read(reader) && this._appearedInsideViewport.read(reader)) {
			return true;
		}
		if (s.inlineSuggestion.targetRange.startLineNumber === this._editorObs.cursorLineNumber.read(reader)) {
			return true;
		}
		if (this._jumpedToId.read(reader) === s.inlineSuggestion.semanticId) {
			return true;
		}

		return s.cursorAtInlineEdit.read(reader);
	});

	public readonly isInDiffEditor;

	public readonly editorType: InlineCompletionEditorType;

	private async _deltaSelectedInlineCompletionIndex(delta: 1 | -1): Promise<void> {
		await this.triggerExplicitly();

		const completions = this._filteredInlineCompletionItems.get() || [];
		if (completions.length > 0) {
			const newIdx = (this.selectedInlineCompletionIndex.get() + delta + completions.length) % completions.length;
			this._selectedInlineCompletionId.set(completions[newIdx].semanticId, undefined);
		} else {
			this._selectedInlineCompletionId.set(undefined, undefined);
		}
	}

	public async next(): Promise<void> { await this._deltaSelectedInlineCompletionIndex(1); }

	public async previous(): Promise<void> { await this._deltaSelectedInlineCompletionIndex(-1); }

	private _getMetadata(completion: InlineSuggestionItem, languageId: string, type: 'word' | 'line' | undefined = undefined): TextModelEditSource {
		if (type) {
			return EditSources.inlineCompletionPartialAccept({
				nes: completion.isInlineEdit,
				requestUuid: completion.requestUuid,
				providerId: completion.source.provider.providerId,
				languageId,
				type,
				correlationId: completion.getSourceCompletion().correlationId,
			});
		} else {
			return EditSources.inlineCompletionAccept({
				nes: completion.isInlineEdit,
				requestUuid: completion.requestUuid,
				correlationId: completion.getSourceCompletion().correlationId,
				providerId: completion.source.provider.providerId,
				languageId
			});
		}
	}

	public async accept(editor: ICodeEditor = this._editor, alternativeAction: boolean = false): Promise<void> {
		if (editor.getModel() !== this.textModel) {
			throw new BugIndicatingError();
		}

		let completion: InlineSuggestionItem;
		let isNextEditUri = false;
		const state = this.state.get();
		if (state?.kind === 'ghostText') {
			if (!state || state.primaryGhostText.isEmpty() || !state.inlineSuggestion) {
				return;
			}
			completion = state.inlineSuggestion;
		} else if (state?.kind === 'inlineEdit') {
			completion = state.inlineSuggestion;
			isNextEditUri = !!state.nextEditUri;
		} else {
			return;
		}

		// Make sure the completion list will not be disposed before the text change is sent.
		completion.addRef();

		try {
			let followUpTrigger = false;
			editor.pushUndoStop();
			if (isNextEditUri) {
				// Do nothing
			} else if (completion.action?.kind === 'edit') {
				const action = completion.action;
				if (alternativeAction && action.alternativeAction) {
					followUpTrigger = true;
					const altCommand = action.alternativeAction.command;
					await this._commandService
						.executeCommand(altCommand.id, ...(altCommand.arguments || []))
						.then(undefined, onUnexpectedExternalError);
				} else if (action.snippetInfo) {
					const mainEdit = TextReplacement.delete(action.textReplacement.range);
					const additionalEdits = completion.additionalTextEdits.map(e => new TextReplacement(Range.lift(e.range), e.text ?? ''));
					const edit = TextEdit.fromParallelReplacementsUnsorted([mainEdit, ...additionalEdits]);
					editor.edit(edit, this._getMetadata(completion, this.textModel.getLanguageId()));

					editor.setPosition(action.snippetInfo.range.getStartPosition(), 'inlineCompletionAccept');
					SnippetController2.get(editor)?.insert(action.snippetInfo.snippet, { undoStopBefore: false });
				} else {
					const edits = state.edits;

					// The cursor should move to the end of the edit, not the end of the range provided by the extension
					// Inline Edit diffs (human readable) the suggestion from the extension so it already removes common suffix/prefix
					// Inline Completions does diff the suggestion so it may contain common suffix
					let minimalEdits = edits;
					if (state.kind === 'ghostText') {
						minimalEdits = removeTextReplacementCommonSuffixPrefix(edits, this.textModel);
					}
					const selections = getEndPositionsAfterApplying(minimalEdits).map(p => Selection.fromPositions(p));

					const additionalEdits = completion.additionalTextEdits.map(e => new TextReplacement(Range.lift(e.range), e.text ?? ''));
					const edit = TextEdit.fromParallelReplacementsUnsorted([...edits, ...additionalEdits]);

					editor.edit(edit, this._getMetadata(completion, this.textModel.getLanguageId()));

					if (completion.hint === undefined) {
						// do not move the cursor when the completion is displayed in a different location
						editor.setSelections(state.kind === 'inlineEdit' ? selections.slice(-1) : selections, 'inlineCompletionAccept');
					}

					if (state.kind === 'inlineEdit' && !this._accessibilityService.isMotionReduced()) {
						const editRanges = edit.getNewRanges();
						const dec = this._store.add(new FadeoutDecoration(editor, editRanges, () => {
							this._store.delete(dec);
						}));
					}
				}
			}

			this._onDidAccept.fire();

			// Reset before invoking the command, as the command might cause a follow up trigger (which we don't want to reset).
			this.stop();

			if (completion.command) {
				await this._commandService
					.executeCommand(completion.command.id, ...(completion.command.arguments || []))
					.then(undefined, onUnexpectedExternalError);
			}

			// TODO: how can we make alternative actions to retrigger?
			if (followUpTrigger) {
				this.trigger(undefined);
			}

			completion.reportEndOfLife({ kind: InlineCompletionEndOfLifeReasonKind.Accepted, alternativeAction });
		} finally {
			completion.removeRef();
			this._inAcceptFlow.set(true, undefined);
			this._lastAcceptedInlineCompletionInfo = { textModelVersionIdAfter: this.textModel.getVersionId(), inlineCompletion: completion };
		}
	}

	public async acceptNextWord(): Promise<void> {
		await this._acceptNext(this._editor, 'word', (pos, text) => {
			const langId = this.textModel.getLanguageIdAtPosition(pos.lineNumber, pos.column);
			const config = this._languageConfigurationService.getLanguageConfiguration(langId);
			const wordRegExp = new RegExp(config.wordDefinition.source, config.wordDefinition.flags.replace('g', ''));

			const m1 = text.match(wordRegExp);
			let acceptUntilIndexExclusive = 0;
			if (m1 && m1.index !== undefined) {
				if (m1.index === 0) {
					acceptUntilIndexExclusive = m1[0].length;
				} else {
					acceptUntilIndexExclusive = m1.index;
				}
			} else {
				acceptUntilIndexExclusive = text.length;
			}

			const wsRegExp = /\s+/g;
			const m2 = wsRegExp.exec(text);
			if (m2 && m2.index !== undefined) {
				if (m2.index + m2[0].length < acceptUntilIndexExclusive) {
					acceptUntilIndexExclusive = m2.index + m2[0].length;
				}
			}
			return acceptUntilIndexExclusive;
		}, PartialAcceptTriggerKind.Word);
	}

	public async acceptNextLine(): Promise<void> {
		await this._acceptNext(this._editor, 'line', (pos, text) => {
			const m = text.match(/\n/);
			if (m && m.index !== undefined) {
				return m.index + 1;
			}
			return text.length;
		}, PartialAcceptTriggerKind.Line);
	}

	private async _acceptNext(editor: ICodeEditor, type: 'word' | 'line', getAcceptUntilIndex: (position: Position, text: string) => number, kind: PartialAcceptTriggerKind): Promise<void> {
		if (editor.getModel() !== this.textModel) {
			throw new BugIndicatingError();
		}

		const state = this.inlineCompletionState.get();
		if (!state || state.primaryGhostText.isEmpty() || !state.inlineSuggestion) {
			return;
		}
		const ghostText = state.primaryGhostText;
		const completion = state.inlineSuggestion;

		if (completion.snippetInfo) {
			// not in WYSIWYG mode, partial commit might change completion, thus it is not supported
			await this.accept(editor);
			return;
		}

		const firstPart = ghostText.parts[0];
		const ghostTextPos = new Position(ghostText.lineNumber, firstPart.column);
		const ghostTextVal = firstPart.text;
		const acceptUntilIndexExclusive = getAcceptUntilIndex(ghostTextPos, ghostTextVal);
		if (acceptUntilIndexExclusive === ghostTextVal.length && ghostText.parts.length === 1) {
			this.accept(editor);
			return;
		}
		const partialGhostTextVal = ghostTextVal.substring(0, acceptUntilIndexExclusive);

		const positions = this._positions.get();
		const cursorPosition = positions[0];

		// Executing the edit might free the completion, so we have to hold a reference on it.
		completion.addRef();
		try {
			this._isAcceptingPartially = true;
			try {
				editor.pushUndoStop();
				const replaceRange = Range.fromPositions(cursorPosition, ghostTextPos);
				const newText = editor.getModel()!.getValueInRange(replaceRange) + partialGhostTextVal;
				const primaryEdit = new TextReplacement(replaceRange, newText);
				const edits = [primaryEdit, ...getSecondaryEdits(this.textModel, positions, primaryEdit)].filter(isDefined);
				const selections = getEndPositionsAfterApplying(edits).map(p => Selection.fromPositions(p));

				editor.edit(TextEdit.fromParallelReplacementsUnsorted(edits), this._getMetadata(completion, type));
				editor.setSelections(selections, 'inlineCompletionPartialAccept');
				editor.revealPositionInCenterIfOutsideViewport(editor.getPosition()!, ScrollType.Smooth);
			} finally {
				this._isAcceptingPartially = false;
			}

			const acceptedRange = Range.fromPositions(completion.editRange.getStartPosition(), TextLength.ofText(partialGhostTextVal).addToPosition(ghostTextPos));
			// This assumes that the inline completion and the model use the same EOL style.
			const text = editor.getModel()!.getValueInRange(acceptedRange, EndOfLinePreference.LF);
			const acceptedLength = text.length;
			completion.reportPartialAccept(
				acceptedLength,
				{ kind, acceptedLength: acceptedLength },
				{ characters: acceptUntilIndexExclusive, ratio: acceptUntilIndexExclusive / ghostTextVal.length, count: 1 }
			);

		} finally {
			completion.removeRef();
		}
	}

	public handleSuggestAccepted(item: SuggestItemInfo) {
		const itemEdit = singleTextRemoveCommonPrefix(item.getSingleTextEdit(), this.textModel);
		const augmentedCompletion = this._computeAugmentation(itemEdit, undefined);
		if (!augmentedCompletion) { return; }

		// This assumes that the inline completion and the model use the same EOL style.
		const alreadyAcceptedLength = this.textModel.getValueInRange(augmentedCompletion.completion.editRange, EndOfLinePreference.LF).length;
		const acceptedLength = alreadyAcceptedLength + itemEdit.text.length;

		augmentedCompletion.completion.reportPartialAccept(itemEdit.text.length, {
			kind: PartialAcceptTriggerKind.Suggest,
			acceptedLength,
		}, {
			characters: itemEdit.text.length,
			count: 1,
			ratio: 1
		});
	}

	public extractReproSample(): Repro {
		const value = this.textModel.getValue();
		const item = this.state.get()?.inlineSuggestion;
		return {
			documentValue: value,
			inlineCompletion: item?.getSourceCompletion(),
		};
	}

	private readonly _jumpedToId = observableValue<undefined | string>(this, undefined);
	private readonly _inAcceptFlow = observableValue(this, false);
	public readonly inAcceptFlow: IObservable<boolean> = this._inAcceptFlow;

	public jump(): void {
		const s = this.inlineEditState.get();
		if (!s) { return; }

		const suggestion = s.inlineSuggestion;
		suggestion.addRef();
		try {
			transaction(tx => {
				if (suggestion.action?.kind === 'jumpTo') {
					this.stop(undefined, tx);
					suggestion.reportEndOfLife({ kind: InlineCompletionEndOfLifeReasonKind.Accepted, alternativeAction: false });
				}

				this._jumpedToId.set(s.inlineSuggestion.semanticId, tx);
				this.dontRefetchSignal.trigger(tx);
				const targetRange = s.inlineSuggestion.targetRange;
				const targetPosition = targetRange.getStartPosition();
				this._editor.setPosition(targetPosition, 'inlineCompletions.jump');

				// TODO: consider using view information to reveal it
				const isSingleLineChange = targetRange.isSingleLine() && (s.inlineSuggestion.hint || (s.inlineSuggestion.action?.kind === 'edit' && !s.inlineSuggestion.action.textReplacement.text.includes('\n')));
				if (isSingleLineChange || s.inlineSuggestion.action?.kind === 'jumpTo') {
					this._editor.revealPosition(targetPosition, ScrollType.Smooth);
				} else {
					const revealRange = new Range(targetRange.startLineNumber - 1, 1, targetRange.endLineNumber + 1, 1);
					this._editor.revealRange(revealRange, ScrollType.Smooth);
				}

				s.inlineSuggestion.identity.setJumpTo(tx);

				this._editor.focus();
			});
		} finally {
			suggestion.removeRef();
		}
	}

	public async handleInlineSuggestionShown(inlineCompletion: InlineSuggestionItem, viewKind: InlineCompletionViewKind, viewData: InlineCompletionViewData, timeWhenShown: number): Promise<void> {
		await inlineCompletion.reportInlineEditShown(this._commandService, viewKind, viewData, this.textModel, timeWhenShown);
	}
}

interface Repro {
	documentValue: string;
	inlineCompletion: InlineCompletion | undefined;
}

export enum VersionIdChangeReason {
	Undo,
	Redo,
	AcceptWord,
	Other,
}

export function getSecondaryEdits(textModel: ITextModel, positions: readonly Position[], primaryTextRepl: TextReplacement): (TextReplacement | undefined)[] {
	if (positions.length === 1) {
		// No secondary cursor positions
		return [];
	}
	const text = new TextModelText(textModel);
	const textTransformer = text.getTransformer();
	const primaryOffset = textTransformer.getOffset(positions[0]);
	const secondaryOffsets = positions.slice(1).map(pos => textTransformer.getOffset(pos));

	primaryTextRepl = primaryTextRepl.removeCommonPrefixAndSuffix(text);
	const primaryStringRepl = textTransformer.getStringReplacement(primaryTextRepl);

	const deltaFromOffsetToRangeStart = primaryStringRepl.replaceRange.start - primaryOffset;
	const primaryContextRange = primaryStringRepl.replaceRange.join(OffsetRange.emptyAt(primaryOffset));
	const primaryContextValue = text.getValueOfOffsetRange(primaryContextRange);

	const replacements = secondaryOffsets.map(secondaryOffset => {
		const newRangeStart = secondaryOffset + deltaFromOffsetToRangeStart;
		const newRangeEnd = newRangeStart + primaryStringRepl.replaceRange.length;
		const range = new OffsetRange(newRangeStart, newRangeEnd);

		const contextRange = range.join(OffsetRange.emptyAt(secondaryOffset));
		const contextValue = text.getValueOfOffsetRange(contextRange);
		if (contextValue !== primaryContextValue) {
			return undefined;
		}

		const stringRepl = new StringReplacement(range, primaryStringRepl.newText);
		const repl = textTransformer.getTextReplacement(stringRepl);
		return repl;
	}).filter(isDefined);

	return replacements;
}

class FadeoutDecoration extends Disposable {
	constructor(
		editor: ICodeEditor,
		ranges: Range[],
		onDispose?: () => void,
	) {
		super();

		if (onDispose) {
			this._register({ dispose: () => onDispose() });
		}

		this._register(observableCodeEditor(editor).setDecorations(constObservable(ranges.map<IModelDeltaDecoration>(range => ({
			range: range,
			options: {
				description: 'animation',
				className: 'edits-fadeout-decoration',
				zIndex: 1,
			}
		})))));

		const animation = new AnimatedValue(1, 0, 1000, easeOutCubic);
		const val = new ObservableAnimatedValue(animation);

		this._register(autorun(reader => {
			const opacity = val.getValue(reader);
			editor.getContainerDomNode().style.setProperty('--animation-opacity', opacity.toString());
			if (animation.isFinished()) {
				this.dispose();
			}
		}));
	}
}

export function isSuggestionInViewport(editor: ICodeEditor, suggestion: InlineSuggestionItem, reader: IReader | undefined = undefined): boolean {
	const targetRange = suggestion.targetRange;

	// TODO make getVisibleRanges reactive!
	observableCodeEditor(editor).scrollTop.read(reader);
	const visibleRanges = editor.getVisibleRanges();

	if (visibleRanges.length < 1) {
		return false;
	}

	const viewportRange = new Range(
		visibleRanges[0].startLineNumber,
		visibleRanges[0].startColumn,
		visibleRanges[visibleRanges.length - 1].endLineNumber,
		visibleRanges[visibleRanges.length - 1].endColumn
	);
	return viewportRange.containsRange(targetRange);
}

function skuFromAccount(account: IDefaultAccount | null): InlineSuggestSku | undefined {
	if (account?.access_type_sku && account?.copilot_plan) {
		return { type: account.access_type_sku, plan: account.copilot_plan };
	}
	return undefined;
}

class DisposableCallback<T> {
	private _cb: ((e: T) => void) | undefined;

	constructor(cb: (e: T) => void) {
		this._cb = cb;
	}

	dispose(): void {
		this._cb = undefined;
	}

	readonly handler = (val: T) => {
		return this._cb?.(val);
	};
}

function createDisposableCb<T>(cb: (e: T) => void, store: DisposableStore): (e: T) => void {
	const dcb = new DisposableCallback(cb);
	store.add(dcb);
	return dcb.handler;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsSource.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/inlineCompletionsSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { booleanComparator, compareBy, compareUndefinedSmallest, numberComparator } from '../../../../../base/common/arrays.js';
import { findLastMax } from '../../../../../base/common/arraysFind.js';
import { RunOnceScheduler } from '../../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { equalsIfDefined, thisEqualsC } from '../../../../../base/common/equals.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { cloneAndChange } from '../../../../../base/common/objects.js';
import { derived, IObservable, IObservableWithChange, ITransaction, observableValue, recordChangesLazy, transaction } from '../../../../../base/common/observable.js';
// eslint-disable-next-line local/code-no-deep-import-of-internal
import { observableReducerSettable } from '../../../../../base/common/observableInternal/experimental/reducer.js';
import { isDefined, isObject } from '../../../../../base/common/types.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { DataChannelForwardingTelemetryService, forwardToChannelIf, isCopilotLikeExtension } from '../../../../../platform/dataChannel/browser/forwardingTelemetryService.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import product from '../../../../../platform/product/common/product.js';
import { StringEdit } from '../../../../common/core/edits/stringEdit.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Command, InlineCompletionEndOfLifeReasonKind, InlineCompletionTriggerKind, InlineCompletionsProvider } from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../../common/model.js';
import { offsetEditFromContentChanges } from '../../../../common/model/textModelStringEdit.js';
import { IFeatureDebounceInformation } from '../../../../common/services/languageFeatureDebounce.js';
import { IModelContentChangedEvent } from '../../../../common/textModelEvents.js';
import { formatRecordableLogEntry, IRecordableEditorLogEntry, IRecordableLogEntry, StructuredLogger } from '../structuredLogger.js';
import { InlineCompletionEndOfLifeEvent, sendInlineCompletionsEndOfLifeTelemetry } from '../telemetry.js';
import { wait } from '../utils.js';
import { InlineSuggestionIdentity, InlineSuggestionItem } from './inlineSuggestionItem.js';
import { InlineCompletionContextWithoutUuid, InlineSuggestRequestInfo, provideInlineCompletions, runWhenCancelled } from './provideInlineCompletions.js';
import { RenameSymbolProcessor } from './renameSymbolProcessor.js';

export class InlineCompletionsSource extends Disposable {
	private static _requestId = 0;

	private readonly _updateOperation = this._register(new MutableDisposable<UpdateOperation>());

	private readonly _loggingEnabled;
	private readonly _sendRequestData;

	private readonly _structuredFetchLogger;

	private readonly _state = observableReducerSettable(this, {
		initial: () => ({
			inlineCompletions: InlineCompletionsState.createEmpty(),
			suggestWidgetInlineCompletions: InlineCompletionsState.createEmpty(),
		}),
		disposeFinal: (values) => {
			values.inlineCompletions.dispose();
			values.suggestWidgetInlineCompletions.dispose();
		},
		changeTracker: recordChangesLazy(() => ({ versionId: this._versionId })),
		update: (reader, previousValue, changes) => {
			const edit = StringEdit.compose(changes.changes.map(c => c.change ? offsetEditFromContentChanges(c.change.changes) : StringEdit.empty).filter(isDefined));

			if (edit.isEmpty()) {
				return previousValue;
			}
			try {
				return {
					inlineCompletions: previousValue.inlineCompletions.createStateWithAppliedEdit(edit, this._textModel),
					suggestWidgetInlineCompletions: previousValue.suggestWidgetInlineCompletions.createStateWithAppliedEdit(edit, this._textModel),
				};
			} finally {
				previousValue.inlineCompletions.dispose();
				previousValue.suggestWidgetInlineCompletions.dispose();
			}
		}
	});

	public readonly inlineCompletions = this._state.map(this, v => v.inlineCompletions);
	public readonly suggestWidgetInlineCompletions = this._state.map(this, v => v.suggestWidgetInlineCompletions);

	private readonly _renameProcessor: RenameSymbolProcessor;

	private _completionsEnabled: Record<string, boolean> | undefined = undefined;

	constructor(
		private readonly _textModel: ITextModel,
		private readonly _versionId: IObservableWithChange<number | null, IModelContentChangedEvent | undefined>,
		private readonly _debounceValue: IFeatureDebounceInformation,
		private readonly _cursorPosition: IObservable<Position>,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this._loggingEnabled = observableConfigValue('editor.inlineSuggest.logFetch', false, this._configurationService).recomputeInitiallyAndOnChange(this._store);
		this._sendRequestData = observableConfigValue('editor.inlineSuggest.emptyResponseInformation', true, this._configurationService).recomputeInitiallyAndOnChange(this._store);
		this._structuredFetchLogger = this._register(this._instantiationService.createInstance(StructuredLogger.cast<
			{ kind: 'start'; requestId: number; context: unknown } & IRecordableEditorLogEntry
			| { kind: 'end'; error: unknown; durationMs: number; result: unknown; requestId: number } & IRecordableLogEntry
		>(),
			'editor.inlineSuggest.logFetch.commandId'
		));

		this._renameProcessor = this._store.add(this._instantiationService.createInstance(RenameSymbolProcessor));

		this.clearOperationOnTextModelChange.recomputeInitiallyAndOnChange(this._store);

		const enablementSetting = product.defaultChatAgent?.completionsEnablementSetting ?? undefined;
		if (enablementSetting) {
			this._updateCompletionsEnablement(enablementSetting);
			this._register(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(enablementSetting)) {
					this._updateCompletionsEnablement(enablementSetting);
				}
			}));
		}

		this._state.recomputeInitiallyAndOnChange(this._store);
	}

	private _updateCompletionsEnablement(enalementSetting: string) {
		const result = this._configurationService.getValue<Record<string, boolean>>(enalementSetting);
		if (!isObject(result)) {
			this._completionsEnabled = undefined;
		} else {
			this._completionsEnabled = result;
		}
	}

	public readonly clearOperationOnTextModelChange = derived(this, reader => {
		this._versionId.read(reader);
		this._updateOperation.clear();
		return undefined; // always constant
	});

	private _log(entry:
		{ sourceId: string; kind: 'start'; requestId: number; context: unknown; provider: string | undefined } & IRecordableEditorLogEntry
		| { sourceId: string; kind: 'end'; error: unknown; durationMs: number; result: unknown; requestId: number; didAllProvidersReturn: boolean } & IRecordableLogEntry
	) {
		if (this._loggingEnabled.get()) {
			this._logService.info(formatRecordableLogEntry(entry));
		}
		this._structuredFetchLogger.log(entry);
	}

	private readonly _loadingCount = observableValue(this, 0);
	public readonly loading = this._loadingCount.map(this, v => v > 0);

	public fetch(
		providers: InlineCompletionsProvider[],
		providersLabel: string | undefined,
		context: InlineCompletionContextWithoutUuid,
		activeInlineCompletion: InlineSuggestionIdentity | undefined,
		withDebounce: boolean,
		userJumpedToActiveCompletion: IObservable<boolean>,
		requestInfo: InlineSuggestRequestInfo
	): Promise<boolean> {
		const position = this._cursorPosition.get();
		const request = new UpdateRequest(position, context, this._textModel.getVersionId(), new Set(providers));

		const target = context.selectedSuggestionInfo ? this.suggestWidgetInlineCompletions.get() : this.inlineCompletions.get();

		if (this._updateOperation.value?.request.satisfies(request)) {
			return this._updateOperation.value.promise;
		} else if (target?.request?.satisfies(request)) {
			return Promise.resolve(true);
		}

		const updateOngoing = !!this._updateOperation.value;
		this._updateOperation.clear();

		const source = new CancellationTokenSource();

		const promise = (async () => {
			const store = new DisposableStore();

			this._loadingCount.set(this._loadingCount.get() + 1, undefined);
			let didDecrease = false;
			const decreaseLoadingCount = () => {
				if (!didDecrease) {
					didDecrease = true;
					this._loadingCount.set(this._loadingCount.get() - 1, undefined);
				}
			};
			const loadingReset = store.add(new RunOnceScheduler(() => decreaseLoadingCount(), 10 * 1000));
			loadingReset.schedule();

			const inlineSuggestionsProviders = providers.filter(p => p.providerId);
			const requestResponseInfo = new RequestResponseData(context, requestInfo, inlineSuggestionsProviders);


			try {
				const recommendedDebounceValue = this._debounceValue.get(this._textModel);
				const debounceValue = findLastMax(
					providers.map(p => p.debounceDelayMs),
					compareUndefinedSmallest(numberComparator)
				) ?? recommendedDebounceValue;

				// Debounce in any case if update is ongoing
				const shouldDebounce = updateOngoing || (withDebounce && context.triggerKind === InlineCompletionTriggerKind.Automatic);
				if (shouldDebounce) {
					// This debounces the operation
					await wait(debounceValue, source.token);
				}

				if (source.token.isCancellationRequested || this._store.isDisposed || this._textModel.getVersionId() !== request.versionId) {
					requestResponseInfo.setNoSuggestionReasonIfNotSet('canceled:beforeFetch');
					return false;
				}

				const requestId = InlineCompletionsSource._requestId++;
				if (this._loggingEnabled.get() || this._structuredFetchLogger.isEnabled.get()) {
					this._log({
						sourceId: 'InlineCompletions.fetch',
						kind: 'start',
						requestId,
						modelUri: this._textModel.uri,
						modelVersion: this._textModel.getVersionId(),
						context: { triggerKind: context.triggerKind, suggestInfo: context.selectedSuggestionInfo ? true : undefined },
						time: Date.now(),
						provider: providersLabel,
					});
				}

				const startTime = new Date();
				const providerResult = provideInlineCompletions(providers, this._cursorPosition.get(), this._textModel, context, requestInfo, this._languageConfigurationService);

				runWhenCancelled(source.token, () => providerResult.cancelAndDispose({ kind: 'tokenCancellation' }));

				let shouldStopEarly = false;
				let producedSuggestion = false;

				const providerSuggestions: InlineSuggestionItem[] = [];
				for await (const list of providerResult.lists) {
					if (!list) {
						continue;
					}
					list.addRef();
					store.add(toDisposable(() => list.removeRef(list.inlineSuggestionsData.length === 0 ? { kind: 'empty' } : { kind: 'notTaken' })));

					for (const item of list.inlineSuggestionsData) {
						producedSuggestion = true;
						if (!context.includeInlineEdits && (item.isInlineEdit || item.showInlineEditMenu)) {
							item.setNotShownReason('notInlineEditRequested');
							continue;
						}
						if (!context.includeInlineCompletions && !(item.isInlineEdit || item.showInlineEditMenu)) {
							item.setNotShownReason('notInlineCompletionRequested');
							continue;
						}

						item.addPerformanceMarker('providerReturned');
						const i = InlineSuggestionItem.create(item, this._textModel);
						item.addPerformanceMarker('itemCreated');
						providerSuggestions.push(i);
						// Stop after first visible inline completion
						if (!i.isInlineEdit && !i.showInlineEditMenu && context.triggerKind === InlineCompletionTriggerKind.Automatic) {
							if (i.isVisible(this._textModel, this._cursorPosition.get())) {
								shouldStopEarly = true;
							}
						}
					}

					if (shouldStopEarly) {
						break;
					}
				}

				providerSuggestions.forEach(s => s.addPerformanceMarker('providersResolved'));

				const suggestions: InlineSuggestionItem[] = await Promise.all(providerSuggestions.map(async s => {
					return this._renameProcessor.proposeRenameRefactoring(this._textModel, s, context);
				}));

				suggestions.forEach(s => s.addPerformanceMarker('renameProcessed'));

				providerResult.cancelAndDispose({ kind: 'lostRace' });

				if (this._loggingEnabled.get() || this._structuredFetchLogger.isEnabled.get()) {
					const didAllProvidersReturn = providerResult.didAllProvidersReturn;
					let error: string | undefined = undefined;
					if (source.token.isCancellationRequested || this._store.isDisposed || this._textModel.getVersionId() !== request.versionId) {
						error = 'canceled';
					}
					const result = suggestions.map(c => {
						const comp = c.getSourceCompletion();
						if (comp.doNotLog) {
							return undefined;
						}
						const obj = {
							insertText: comp.insertText,
							range: comp.range,
							additionalTextEdits: comp.additionalTextEdits,
							uri: comp.uri,
							command: comp.command,
							gutterMenuLinkAction: comp.gutterMenuLinkAction,
							shownCommand: comp.shownCommand,
							completeBracketPairs: comp.completeBracketPairs,
							isInlineEdit: comp.isInlineEdit,
							showInlineEditMenu: comp.showInlineEditMenu,
							showRange: comp.showRange,
							warning: comp.warning,
							hint: comp.hint,
							supportsRename: comp.supportsRename,
							correlationId: comp.correlationId,
							jumpToPosition: comp.jumpToPosition,
						};
						return {
							...(cloneAndChange(obj, v => {
								if (Range.isIRange(v)) {
									return Range.lift(v).toString();
								}
								if (Position.isIPosition(v)) {
									return Position.lift(v).toString();
								}
								if (Command.is(v)) {
									return { $commandId: v.id };
								}
								return v;
							}) as object),
							$providerId: c.source.provider.providerId?.toString(),
						};
					}).filter(result => result !== undefined);

					this._log({ sourceId: 'InlineCompletions.fetch', kind: 'end', requestId, durationMs: (Date.now() - startTime.getTime()), error, result, time: Date.now(), didAllProvidersReturn });
				}

				requestResponseInfo.setRequestUuid(providerResult.contextWithUuid.requestUuid);
				if (producedSuggestion) {
					requestResponseInfo.setHasProducedSuggestion();
					if (suggestions.length > 0 && source.token.isCancellationRequested) {
						suggestions.forEach(s => s.setNotShownReasonIfNotSet('canceled:whileAwaitingOtherProviders'));
					}
				} else {
					if (source.token.isCancellationRequested) {
						requestResponseInfo.setNoSuggestionReasonIfNotSet('canceled:whileFetching');
					} else {
						const completionsQuotaExceeded = this._contextKeyService.getContextKeyValue<boolean>('completionsQuotaExceeded');
						requestResponseInfo.setNoSuggestionReasonIfNotSet(completionsQuotaExceeded ? 'completionsQuotaExceeded' : 'noSuggestion');
					}
				}

				const remainingTimeToWait = context.earliestShownDateTime - Date.now();
				if (remainingTimeToWait > 0) {
					await wait(remainingTimeToWait, source.token);
				}

				suggestions.forEach(s => s.addPerformanceMarker('minShowDelayPassed'));

				if (source.token.isCancellationRequested || this._store.isDisposed || this._textModel.getVersionId() !== request.versionId
					|| userJumpedToActiveCompletion.get()  /* In the meantime the user showed interest for the active completion so dont hide it */) {
					const notShownReason =
						source.token.isCancellationRequested ? 'canceled:afterMinShowDelay' :
							this._store.isDisposed ? 'canceled:disposed' :
								this._textModel.getVersionId() !== request.versionId ? 'canceled:documentChanged' :
									userJumpedToActiveCompletion.get() ? 'canceled:userJumped' :
										'unknown';
					suggestions.forEach(s => s.setNotShownReasonIfNotSet(notShownReason));
					return false;
				}

				const endTime = new Date();
				this._debounceValue.update(this._textModel, endTime.getTime() - startTime.getTime());

				const cursorPosition = this._cursorPosition.get();
				this._updateOperation.clear();
				transaction(tx => {
					/** @description Update completions with provider result */
					const v = this._state.get();

					if (context.selectedSuggestionInfo) {
						this._state.set({
							inlineCompletions: InlineCompletionsState.createEmpty(),
							suggestWidgetInlineCompletions: v.suggestWidgetInlineCompletions.createStateWithAppliedResults(suggestions, request, this._textModel, cursorPosition, activeInlineCompletion),
						}, tx);
					} else {
						this._state.set({
							inlineCompletions: v.inlineCompletions.createStateWithAppliedResults(suggestions, request, this._textModel, cursorPosition, activeInlineCompletion),
							suggestWidgetInlineCompletions: InlineCompletionsState.createEmpty(),
						}, tx);
					}

					v.inlineCompletions.dispose();
					v.suggestWidgetInlineCompletions.dispose();
				});
			} finally {
				store.dispose();
				decreaseLoadingCount();
				this.sendInlineCompletionsRequestTelemetry(requestResponseInfo);
			}

			return true;
		})();

		const updateOperation = new UpdateOperation(request, source, promise);
		this._updateOperation.value = updateOperation;

		return promise;
	}

	public clear(tx: ITransaction): void {
		this._updateOperation.clear();
		const v = this._state.get();
		this._state.set({
			inlineCompletions: InlineCompletionsState.createEmpty(),
			suggestWidgetInlineCompletions: InlineCompletionsState.createEmpty()
		}, tx);
		v.inlineCompletions.dispose();
		v.suggestWidgetInlineCompletions.dispose();
	}

	public seedInlineCompletionsWithSuggestWidget(): void {
		const inlineCompletions = this.inlineCompletions.get();
		const suggestWidgetInlineCompletions = this.suggestWidgetInlineCompletions.get();
		if (!suggestWidgetInlineCompletions) {
			return;
		}
		transaction(tx => {
			/** @description Seed inline completions with (newer) suggest widget inline completions */
			if (!inlineCompletions || (suggestWidgetInlineCompletions.request?.versionId ?? -1) > (inlineCompletions.request?.versionId ?? -1)) {
				inlineCompletions?.dispose();
				const s = this._state.get();
				this._state.set({
					inlineCompletions: suggestWidgetInlineCompletions.clone(),
					suggestWidgetInlineCompletions: InlineCompletionsState.createEmpty(),
				}, tx);
				s.inlineCompletions.dispose();
				s.suggestWidgetInlineCompletions.dispose();
			}
			this.clearSuggestWidgetInlineCompletions(tx);
		});
	}

	private sendInlineCompletionsRequestTelemetry(
		requestResponseInfo: RequestResponseData
	): void {
		if (!this._sendRequestData.get() && !this._contextKeyService.getContextKeyValue<boolean>('isRunningUnificationExperiment')) {
			return;
		}

		if (requestResponseInfo.requestUuid === undefined || requestResponseInfo.hasProducedSuggestion) {
			return;
		}


		if (!isCompletionsEnabled(this._completionsEnabled, this._textModel.getLanguageId())) {
			return;
		}

		if (!requestResponseInfo.providers.some(p => isCopilotLikeExtension(p.providerId?.extensionId))) {
			return;
		}

		const emptyEndOfLifeEvent: InlineCompletionEndOfLifeEvent = {
			opportunityId: requestResponseInfo.requestUuid,
			noSuggestionReason: requestResponseInfo.noSuggestionReason ?? 'unknown',
			extensionId: 'vscode-core',
			extensionVersion: '0.0.0',
			groupId: 'empty',
			shown: false,
			skuPlan: requestResponseInfo.requestInfo.sku?.plan,
			skuType: requestResponseInfo.requestInfo.sku?.type,
			editorType: requestResponseInfo.requestInfo.editorType,
			requestReason: requestResponseInfo.requestInfo.reason,
			typingInterval: requestResponseInfo.requestInfo.typingInterval,
			typingIntervalCharacterCount: requestResponseInfo.requestInfo.typingIntervalCharacterCount,
			languageId: requestResponseInfo.requestInfo.languageId,
			selectedSuggestionInfo: !!requestResponseInfo.context.selectedSuggestionInfo,
			availableProviders: requestResponseInfo.providers.map(p => p.providerId?.toString()).filter(isDefined).join(','),
			...forwardToChannelIf(requestResponseInfo.providers.some(p => isCopilotLikeExtension(p.providerId?.extensionId))),
			timeUntilProviderRequest: undefined,
			timeUntilProviderResponse: undefined,
			viewKind: undefined,
			preceeded: undefined,
			superseded: undefined,
			reason: undefined,
			acceptedAlternativeAction: undefined,
			correlationId: undefined,
			shownDuration: undefined,
			shownDurationUncollapsed: undefined,
			timeUntilShown: undefined,
			partiallyAccepted: undefined,
			partiallyAcceptedCountSinceOriginal: undefined,
			partiallyAcceptedRatioSinceOriginal: undefined,
			partiallyAcceptedCharactersSinceOriginal: undefined,
			cursorColumnDistance: undefined,
			cursorLineDistance: undefined,
			lineCountOriginal: undefined,
			lineCountModified: undefined,
			characterCountOriginal: undefined,
			characterCountModified: undefined,
			disjointReplacements: undefined,
			sameShapeReplacements: undefined,
			longDistanceHintVisible: undefined,
			longDistanceHintDistance: undefined,
			notShownReason: undefined,
			renameCreated: false,
			renameDuration: undefined,
			renameTimedOut: false,
			renameDroppedOtherEdits: undefined,
			renameDroppedRenameEdits: undefined,
			performanceMarkers: undefined,
			editKind: undefined,
		};

		const dataChannel = this._instantiationService.createInstance(DataChannelForwardingTelemetryService);
		sendInlineCompletionsEndOfLifeTelemetry(dataChannel, emptyEndOfLifeEvent);
	}

	public clearSuggestWidgetInlineCompletions(tx: ITransaction): void {
		if (this._updateOperation.value?.request.context.selectedSuggestionInfo) {
			this._updateOperation.clear();
		}
	}

	public cancelUpdate(): void {
		this._updateOperation.clear();
	}
}

class UpdateRequest {
	constructor(
		public readonly position: Position,
		public readonly context: InlineCompletionContextWithoutUuid,
		public readonly versionId: number,
		public readonly providers: Set<InlineCompletionsProvider>,
	) {
	}

	public satisfies(other: UpdateRequest): boolean {
		return this.position.equals(other.position)
			&& equalsIfDefined(this.context.selectedSuggestionInfo, other.context.selectedSuggestionInfo, thisEqualsC())
			&& (other.context.triggerKind === InlineCompletionTriggerKind.Automatic
				|| this.context.triggerKind === InlineCompletionTriggerKind.Explicit)
			&& this.versionId === other.versionId
			&& isSubset(other.providers, this.providers);
	}

	public get isExplicitRequest() {
		return this.context.triggerKind === InlineCompletionTriggerKind.Explicit;
	}
}

class RequestResponseData {
	public requestUuid: string | undefined;
	public noSuggestionReason: string | undefined;
	public hasProducedSuggestion = false;

	constructor(
		public readonly context: InlineCompletionContextWithoutUuid,
		public readonly requestInfo: InlineSuggestRequestInfo,
		public readonly providers: InlineCompletionsProvider[],
	) { }

	setRequestUuid(uuid: string) {
		this.requestUuid = uuid;
	}

	setNoSuggestionReasonIfNotSet(type: string) {
		this.noSuggestionReason ??= type;
	}

	setHasProducedSuggestion() {
		this.hasProducedSuggestion = true;
	}
}

function isSubset<T>(set1: Set<T>, set2: Set<T>): boolean {
	return [...set1].every(item => set2.has(item));
}

function isCompletionsEnabled(completionsEnablementObject: Record<string, boolean> | undefined, modeId: string = '*'): boolean {
	if (completionsEnablementObject === undefined) {
		return false; // default to disabled if setting is not available
	}

	if (typeof completionsEnablementObject[modeId] !== 'undefined') {
		return Boolean(completionsEnablementObject[modeId]); // go with setting if explicitly defined
	}

	return Boolean(completionsEnablementObject['*']); // fallback to global setting otherwise
}

class UpdateOperation implements IDisposable {
	constructor(
		public readonly request: UpdateRequest,
		public readonly cancellationTokenSource: CancellationTokenSource,
		public readonly promise: Promise<boolean>,
	) {
	}

	dispose() {
		this.cancellationTokenSource.cancel();
	}
}

class InlineCompletionsState extends Disposable {
	public static createEmpty(): InlineCompletionsState {
		return new InlineCompletionsState([], undefined);
	}

	constructor(
		public readonly inlineCompletions: readonly InlineSuggestionItem[],
		public readonly request: UpdateRequest | undefined,
	) {
		for (const inlineCompletion of inlineCompletions) {
			inlineCompletion.addRef();
		}

		super();

		this._register({
			dispose: () => {
				for (const inlineCompletion of this.inlineCompletions) {
					inlineCompletion.removeRef();
				}
			}
		});
	}

	private _findById(id: InlineSuggestionIdentity): InlineSuggestionItem | undefined {
		return this.inlineCompletions.find(i => i.identity === id);
	}

	private _findByHash(hash: string): InlineSuggestionItem | undefined {
		return this.inlineCompletions.find(i => i.hash === hash);
	}

	/**
	 * Applies the edit on the state.
	*/
	public createStateWithAppliedEdit(edit: StringEdit, textModel: ITextModel): InlineCompletionsState {
		const newInlineCompletions = this.inlineCompletions.map(i => i.withEdit(edit, textModel)).filter(isDefined);
		return new InlineCompletionsState(newInlineCompletions, this.request);
	}

	public createStateWithAppliedResults(updatedSuggestions: InlineSuggestionItem[], request: UpdateRequest, textModel: ITextModel, cursorPosition: Position, itemIdToPreserveAtTop: InlineSuggestionIdentity | undefined): InlineCompletionsState {
		let itemToPreserve: InlineSuggestionItem | undefined = undefined;
		if (itemIdToPreserveAtTop) {
			const itemToPreserveCandidate = this._findById(itemIdToPreserveAtTop);
			if (itemToPreserveCandidate && itemToPreserveCandidate.canBeReused(textModel, request.position)) {
				itemToPreserve = itemToPreserveCandidate;

				const updatedItemToPreserve = updatedSuggestions.find(i => i.hash === itemToPreserveCandidate.hash);
				if (updatedItemToPreserve) {
					updatedSuggestions = moveToFront(updatedItemToPreserve, updatedSuggestions);
				} else {
					updatedSuggestions = [itemToPreserveCandidate, ...updatedSuggestions];
				}
			}
		}

		const preferInlineCompletions = itemToPreserve
			// itemToPreserve has precedence
			? !itemToPreserve.isInlineEdit
			// Otherwise: prefer inline completion if there is a visible one
			: updatedSuggestions.some(i => !i.isInlineEdit && i.isVisible(textModel, cursorPosition));

		let updatedItems: InlineSuggestionItem[] = [];
		for (const i of updatedSuggestions) {
			const oldItem = this._findByHash(i.hash);
			let item;
			if (oldItem && oldItem !== i) {
				item = i.withIdentity(oldItem.identity);
				i.setIsPreceeded(oldItem);
				oldItem.setEndOfLifeReason({ kind: InlineCompletionEndOfLifeReasonKind.Ignored, userTypingDisagreed: false, supersededBy: i.getSourceCompletion() });
			} else {
				item = i;
			}
			if (preferInlineCompletions !== item.isInlineEdit) {
				updatedItems.push(item);
			}
		}

		updatedItems.sort(compareBy(i => i.showInlineEditMenu, booleanComparator));
		updatedItems = distinctByKey(updatedItems, i => i.semanticId);

		return new InlineCompletionsState(updatedItems, request);
	}

	public clone(): InlineCompletionsState {
		return new InlineCompletionsState(this.inlineCompletions, this.request);
	}
}

/** Keeps the first item in case of duplicates. */
function distinctByKey<T>(items: T[], key: (item: T) => unknown): T[] {
	const seen = new Set();
	return items.filter(item => {
		const k = key(item);
		if (seen.has(k)) {
			return false;
		}
		seen.add(k);
		return true;
	});
}

function moveToFront<T>(item: T, items: T[]): T[] {
	const index = items.indexOf(item);
	if (index > -1) {
		return [item, ...items.slice(0, index), ...items.slice(index + 1)];
	}
	return items;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineCompletions/browser/model/InlineSuggestAlternativeAction.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineCompletions/browser/model/InlineSuggestAlternativeAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { Command } from '../../../../common/languages.js';

export type InlineSuggestAlternativeAction = {
	label: string;
	icon: ThemeIcon;
	command: Command;
	count: Promise<number>;
};

export namespace InlineSuggestAlternativeAction {
	export function toString(action: InlineSuggestAlternativeAction | undefined): string | undefined {
		return action?.command.id ?? undefined;
	}
}
```

--------------------------------------------------------------------------------

````

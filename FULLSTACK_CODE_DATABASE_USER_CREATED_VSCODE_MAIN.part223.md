---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 223
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 223 of 552)

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

---[FILE: src/vs/editor/contrib/find/browser/findController.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Delayer } from '../../../../base/common/async.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorCommand, EditorContributionInstantiation, MultiEditorAction, registerEditorAction, registerEditorCommand, registerEditorContribution, registerMultiEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { overviewRulerRangeHighlight } from '../../../common/core/editorColorRegistry.js';
import { IRange } from '../../../common/core/range.js';
import { IEditorContribution } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { OverviewRulerLane } from '../../../common/model.js';
import { CONTEXT_FIND_INPUT_FOCUSED, CONTEXT_FIND_WIDGET_VISIBLE, CONTEXT_REPLACE_INPUT_FOCUSED, FindModelBoundToEditorModel, FIND_IDS, ToggleCaseSensitiveKeybinding, TogglePreserveCaseKeybinding, ToggleRegexKeybinding, ToggleSearchScopeKeybinding, ToggleWholeWordKeybinding } from './findModel.js';
import { FindOptionsWidget } from './findOptionsWidget.js';
import { FindReplaceState, FindReplaceStateChangedEvent, INewFindReplaceState } from './findState.js';
import { FindWidget, IFindController } from './findWidget.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { Selection } from '../../../common/core/selection.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { FindWidgetSearchHistory } from './findWidgetSearchHistory.js';
import { ReplaceWidgetHistory } from './replaceWidgetHistory.js';

const SEARCH_STRING_MAX_LENGTH = 524288;

export function getSelectionSearchString(editor: ICodeEditor, seedSearchStringFromSelection: 'single' | 'multiple' = 'single', seedSearchStringFromNonEmptySelection: boolean = false): string | null {
	if (!editor.hasModel()) {
		return null;
	}

	const selection = editor.getSelection();
	// if selection spans multiple lines, default search string to empty

	if ((seedSearchStringFromSelection === 'single' && selection.startLineNumber === selection.endLineNumber)
		|| seedSearchStringFromSelection === 'multiple') {
		if (selection.isEmpty()) {
			const wordAtPosition = editor.getConfiguredWordAtPosition(selection.getStartPosition());
			if (wordAtPosition && (false === seedSearchStringFromNonEmptySelection)) {
				return wordAtPosition.word;
			}
		} else {
			if (editor.getModel().getValueLengthInRange(selection) < SEARCH_STRING_MAX_LENGTH) {
				return editor.getModel().getValueInRange(selection);
			}
		}
	}

	return null;
}

export const enum FindStartFocusAction {
	NoFocusChange,
	FocusFindInput,
	FocusReplaceInput
}

export interface IFindStartOptions {
	forceRevealReplace: boolean;
	seedSearchStringFromSelection: 'none' | 'single' | 'multiple';
	seedSearchStringFromNonEmptySelection: boolean;
	seedSearchStringFromGlobalClipboard: boolean;
	shouldFocus: FindStartFocusAction;
	shouldAnimate: boolean;
	updateSearchScope: boolean;
	loop: boolean;
}

export interface IFindStartArguments {
	searchString?: string;
	replaceString?: string;
	isRegex?: boolean;
	matchWholeWord?: boolean;
	isCaseSensitive?: boolean;
	preserveCase?: boolean;
	findInSelection?: boolean;
}

export class CommonFindController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.findController';

	protected _editor: ICodeEditor;
	private readonly _findWidgetVisible: IContextKey<boolean>;
	protected _state: FindReplaceState;
	protected _updateHistoryDelayer: Delayer<void>;
	private _model: FindModelBoundToEditorModel | null;
	protected readonly _storageService: IStorageService;
	private readonly _clipboardService: IClipboardService;
	protected readonly _contextKeyService: IContextKeyService;
	protected readonly _notificationService: INotificationService;
	protected readonly _hoverService: IHoverService;

	get editor() {
		return this._editor;
	}

	public static get(editor: ICodeEditor): CommonFindController | null {
		return editor.getContribution<CommonFindController>(CommonFindController.ID);
	}

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService storageService: IStorageService,
		@IClipboardService clipboardService: IClipboardService,
		@INotificationService notificationService: INotificationService,
		@IHoverService hoverService: IHoverService
	) {
		super();
		this._editor = editor;
		this._findWidgetVisible = CONTEXT_FIND_WIDGET_VISIBLE.bindTo(contextKeyService);
		this._contextKeyService = contextKeyService;
		this._storageService = storageService;
		this._clipboardService = clipboardService;
		this._notificationService = notificationService;
		this._hoverService = hoverService;

		this._updateHistoryDelayer = new Delayer<void>(500);
		this._state = this._register(new FindReplaceState());
		this.loadQueryState();
		this._register(this._state.onFindReplaceStateChange((e) => this._onStateChanged(e)));

		this._model = null;

		this._register(this._editor.onDidChangeModel(() => {
			const shouldRestartFind = (this._editor.getModel() && this._state.isRevealed);

			this.disposeModel();

			this._state.change({
				searchScope: null,
				matchCase: this._storageService.getBoolean('editor.matchCase', StorageScope.WORKSPACE, false),
				wholeWord: this._storageService.getBoolean('editor.wholeWord', StorageScope.WORKSPACE, false),
				isRegex: this._storageService.getBoolean('editor.isRegex', StorageScope.WORKSPACE, false),
				preserveCase: this._storageService.getBoolean('editor.preserveCase', StorageScope.WORKSPACE, false)
			}, false);

			if (shouldRestartFind) {
				this._start({
					forceRevealReplace: false,
					seedSearchStringFromSelection: 'none',
					seedSearchStringFromNonEmptySelection: false,
					seedSearchStringFromGlobalClipboard: false,
					shouldFocus: FindStartFocusAction.NoFocusChange,
					shouldAnimate: false,
					updateSearchScope: false,
					loop: this._editor.getOption(EditorOption.find).loop
				});
			}
		}));
	}

	public override dispose(): void {
		this.disposeModel();
		super.dispose();
	}

	private disposeModel(): void {
		if (this._model) {
			this._model.dispose();
			this._model = null;
		}
	}

	private _onStateChanged(e: FindReplaceStateChangedEvent): void {
		this.saveQueryState(e);

		if (e.isRevealed) {
			if (this._state.isRevealed) {
				this._findWidgetVisible.set(true);
			} else {
				this._findWidgetVisible.reset();
				this.disposeModel();
			}
		}
		if (e.searchString) {
			this.setGlobalBufferTerm(this._state.searchString);
		}
	}

	private saveQueryState(e: FindReplaceStateChangedEvent) {
		if (e.isRegex) {
			this._storageService.store('editor.isRegex', this._state.actualIsRegex, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
		if (e.wholeWord) {
			this._storageService.store('editor.wholeWord', this._state.actualWholeWord, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
		if (e.matchCase) {
			this._storageService.store('editor.matchCase', this._state.actualMatchCase, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
		if (e.preserveCase) {
			this._storageService.store('editor.preserveCase', this._state.actualPreserveCase, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
	}

	private loadQueryState() {
		this._state.change({
			matchCase: this._storageService.getBoolean('editor.matchCase', StorageScope.WORKSPACE, this._state.matchCase),
			wholeWord: this._storageService.getBoolean('editor.wholeWord', StorageScope.WORKSPACE, this._state.wholeWord),
			isRegex: this._storageService.getBoolean('editor.isRegex', StorageScope.WORKSPACE, this._state.isRegex),
			preserveCase: this._storageService.getBoolean('editor.preserveCase', StorageScope.WORKSPACE, this._state.preserveCase)
		}, false);
	}

	public isFindInputFocused(): boolean {
		return !!CONTEXT_FIND_INPUT_FOCUSED.getValue(this._contextKeyService);
	}

	public getState(): FindReplaceState {
		return this._state;
	}

	public closeFindWidget(): void {
		this._state.change({
			isRevealed: false,
			searchScope: null
		}, false);
		this._editor.focus();
	}

	public toggleCaseSensitive(): void {
		this._state.change({ matchCase: !this._state.matchCase }, false);
		if (!this._state.isRevealed) {
			this.highlightFindOptions();
		}
	}

	public toggleWholeWords(): void {
		this._state.change({ wholeWord: !this._state.wholeWord }, false);
		if (!this._state.isRevealed) {
			this.highlightFindOptions();
		}
	}

	public toggleRegex(): void {
		this._state.change({ isRegex: !this._state.isRegex }, false);
		if (!this._state.isRevealed) {
			this.highlightFindOptions();
		}
	}

	public togglePreserveCase(): void {
		this._state.change({ preserveCase: !this._state.preserveCase }, false);
		if (!this._state.isRevealed) {
			this.highlightFindOptions();
		}
	}

	public toggleSearchScope(): void {
		if (this._state.searchScope) {
			this._state.change({ searchScope: null }, true);
		} else {
			if (this._editor.hasModel()) {
				let selections = this._editor.getSelections();
				selections = selections.map(selection => {
					if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
						selection = selection.setEndPosition(
							selection.endLineNumber - 1,
							this._editor.getModel()!.getLineMaxColumn(selection.endLineNumber - 1)
						);
					}
					if (!selection.isEmpty()) {
						return selection;
					}
					return null;
				}).filter((element): element is Selection => !!element);

				if (selections.length) {
					this._state.change({ searchScope: selections }, true);
				}
			}
		}
	}

	public setSearchString(searchString: string): void {
		if (this._state.isRegex) {
			searchString = strings.escapeRegExpCharacters(searchString);
		}
		this._state.change({ searchString: searchString }, false);
	}

	public highlightFindOptions(ignoreWhenVisible: boolean = false): void {
		// overwritten in subclass
	}

	protected async _start(opts: IFindStartOptions, newState?: INewFindReplaceState): Promise<void> {
		this.disposeModel();

		if (!this._editor.hasModel()) {
			// cannot do anything with an editor that doesn't have a model...
			return;
		}

		const stateChanges: INewFindReplaceState = {
			...newState,
			isRevealed: true
		};

		if (opts.seedSearchStringFromSelection === 'single') {
			const selectionSearchString = getSelectionSearchString(this._editor, opts.seedSearchStringFromSelection, opts.seedSearchStringFromNonEmptySelection);
			if (selectionSearchString) {
				if (this._state.isRegex) {
					stateChanges.searchString = strings.escapeRegExpCharacters(selectionSearchString);
				} else {
					stateChanges.searchString = selectionSearchString;
				}
			}
		} else if (opts.seedSearchStringFromSelection === 'multiple' && !opts.updateSearchScope) {
			const selectionSearchString = getSelectionSearchString(this._editor, opts.seedSearchStringFromSelection);
			if (selectionSearchString) {
				stateChanges.searchString = selectionSearchString;
			}
		}

		if (!stateChanges.searchString && opts.seedSearchStringFromGlobalClipboard) {
			const selectionSearchString = await this.getGlobalBufferTerm();

			if (!this._editor.hasModel()) {
				// the editor has lost its model in the meantime
				return;
			}

			if (selectionSearchString) {
				stateChanges.searchString = selectionSearchString;
			}
		}

		// Overwrite isReplaceRevealed
		if (opts.forceRevealReplace || stateChanges.isReplaceRevealed) {
			stateChanges.isReplaceRevealed = true;
		} else if (!this._findWidgetVisible.get()) {
			stateChanges.isReplaceRevealed = false;
		}

		if (opts.updateSearchScope) {
			const currentSelections = this._editor.getSelections();
			if (currentSelections.some(selection => !selection.isEmpty())) {
				stateChanges.searchScope = currentSelections;
			}
		}

		stateChanges.loop = opts.loop;

		this._state.change(stateChanges, false);

		if (!this._model) {
			this._model = new FindModelBoundToEditorModel(this._editor, this._state);
		}
	}

	public start(opts: IFindStartOptions, newState?: INewFindReplaceState): Promise<void> {
		return this._start(opts, newState);
	}

	public moveToNextMatch(): boolean {
		if (this._model) {
			this._model.moveToNextMatch();
			return true;
		}
		return false;
	}

	public moveToPrevMatch(): boolean {
		if (this._model) {
			this._model.moveToPrevMatch();
			return true;
		}
		return false;
	}

	public goToMatch(index: number): boolean {
		if (this._model) {
			this._model.moveToMatch(index);
			return true;
		}
		return false;
	}

	public replace(): boolean {
		if (this._model) {
			this._model.replace();
			return true;
		}
		return false;
	}

	public replaceAll(): boolean {
		if (this._model) {
			if (this._editor.getModel()?.isTooLargeForHeapOperation()) {
				this._notificationService.warn(nls.localize('too.large.for.replaceall', "The file is too large to perform a replace all operation."));
				return false;
			}
			this._model.replaceAll();
			return true;
		}
		return false;
	}

	public selectAllMatches(): boolean {
		if (this._model) {
			this._model.selectAllMatches();
			this._editor.focus();
			return true;
		}
		return false;
	}

	public async getGlobalBufferTerm(): Promise<string> {
		if (this._editor.getOption(EditorOption.find).globalFindClipboard
			&& this._editor.hasModel()
			&& !this._editor.getModel().isTooLargeForSyncing()
		) {
			return this._clipboardService.readFindText();
		}
		return '';
	}

	public setGlobalBufferTerm(text: string): void {
		if (this._editor.getOption(EditorOption.find).globalFindClipboard
			&& this._editor.hasModel()
			&& !this._editor.getModel().isTooLargeForSyncing()
		) {
			// intentionally not awaited
			this._clipboardService.writeFindText(text);
		}
	}
}

export class FindController extends CommonFindController implements IFindController {

	private _widget: FindWidget | null;
	private _findOptionsWidget: FindOptionsWidget | null;
	private _findWidgetSearchHistory: FindWidgetSearchHistory;
	private _replaceWidgetHistory: ReplaceWidgetHistory;

	constructor(
		editor: ICodeEditor,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@INotificationService notificationService: INotificationService,
		@IStorageService _storageService: IStorageService,
		@IClipboardService clipboardService: IClipboardService,
		@IHoverService hoverService: IHoverService,
	) {
		super(editor, _contextKeyService, _storageService, clipboardService, notificationService, hoverService);
		this._widget = null;
		this._findOptionsWidget = null;
		this._findWidgetSearchHistory = FindWidgetSearchHistory.getOrCreate(_storageService);
		this._replaceWidgetHistory = ReplaceWidgetHistory.getOrCreate(_storageService);
	}

	protected override async _start(opts: IFindStartOptions, newState?: INewFindReplaceState): Promise<void> {
		if (!this._widget) {
			this._createFindWidget();
		}

		const selection = this._editor.getSelection();
		let updateSearchScope = false;

		switch (this._editor.getOption(EditorOption.find).autoFindInSelection) {
			case 'always':
				updateSearchScope = true;
				break;
			case 'never':
				updateSearchScope = false;
				break;
			case 'multiline': {
				const isSelectionMultipleLine = !!selection && selection.startLineNumber !== selection.endLineNumber;
				updateSearchScope = isSelectionMultipleLine;
				break;
			}
			default:
				break;
		}

		opts.updateSearchScope = opts.updateSearchScope || updateSearchScope;

		await super._start(opts, newState);

		if (this._widget) {
			if (opts.shouldFocus === FindStartFocusAction.FocusReplaceInput) {
				this._widget.focusReplaceInput();
			} else if (opts.shouldFocus === FindStartFocusAction.FocusFindInput) {
				this._widget.focusFindInput();
			}
		}
	}

	public override highlightFindOptions(ignoreWhenVisible: boolean = false): void {
		if (!this._widget) {
			this._createFindWidget();
		}
		if (this._state.isRevealed && !ignoreWhenVisible) {
			this._widget!.highlightFindOptions();
		} else {
			this._findOptionsWidget!.highlightFindOptions();
		}
	}

	private _createFindWidget() {
		this._widget = this._register(new FindWidget(this._editor, this, this._state, this._contextViewService, this._keybindingService, this._contextKeyService, this._hoverService, this._findWidgetSearchHistory, this._replaceWidgetHistory));
		this._findOptionsWidget = this._register(new FindOptionsWidget(this._editor, this._state, this._keybindingService));
	}

	saveViewState(): any {
		return this._widget?.getViewState();
	}

	restoreViewState(state: any): void {
		this._widget?.setViewState(state);
	}
}

export const StartFindAction = registerMultiEditorAction(new MultiEditorAction({
	id: FIND_IDS.StartFindAction,
	label: nls.localize2('startFindAction', "Find"),
	precondition: ContextKeyExpr.or(EditorContextKeys.focus, ContextKeyExpr.has('editorIsOpen')),
	kbOpts: {
		kbExpr: null,
		primary: KeyMod.CtrlCmd | KeyCode.KeyF,
		weight: KeybindingWeight.EditorContrib
	},
	menuOpts: {
		menuId: MenuId.MenubarEditMenu,
		group: '3_find',
		title: nls.localize({ key: 'miFind', comment: ['&& denotes a mnemonic'] }, "&&Find"),
		order: 1
	}
}));

StartFindAction.addImplementation(0, (accessor: ServicesAccessor, editor: ICodeEditor, args: any): boolean | Promise<void> => {
	const controller = CommonFindController.get(editor);
	if (!controller) {
		return false;
	}
	return controller.start({
		forceRevealReplace: false,
		seedSearchStringFromSelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
		seedSearchStringFromNonEmptySelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
		seedSearchStringFromGlobalClipboard: editor.getOption(EditorOption.find).globalFindClipboard,
		shouldFocus: FindStartFocusAction.FocusFindInput,
		shouldAnimate: true,
		updateSearchScope: false,
		loop: editor.getOption(EditorOption.find).loop
	});
});

const findArgDescription = {
	description: 'Open a new In-Editor Find Widget.',
	args: [{
		name: 'Open a new In-Editor Find Widget args',
		schema: {
			properties: {
				searchString: { type: 'string' },
				replaceString: { type: 'string' },
				isRegex: { type: 'boolean' },
				matchWholeWord: { type: 'boolean' },
				isCaseSensitive: { type: 'boolean' },
				preserveCase: { type: 'boolean' },
				findInSelection: { type: 'boolean' },
			}
		}
	}]
} as const;

export class StartFindWithArgsAction extends EditorAction {

	constructor() {
		super({
			id: FIND_IDS.StartFindWithArgs,
			label: nls.localize2('startFindWithArgsAction', "Find with Arguments"),
			precondition: undefined,
			kbOpts: {
				kbExpr: null,
				primary: 0,
				weight: KeybindingWeight.EditorContrib
			},
			metadata: findArgDescription
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor, args?: IFindStartArguments): Promise<void> {
		const controller = CommonFindController.get(editor);
		if (controller) {
			const newState: INewFindReplaceState = args ? {
				searchString: args.searchString,
				replaceString: args.replaceString,
				isReplaceRevealed: args.replaceString !== undefined,
				isRegex: args.isRegex,
				// isRegexOverride: args.regexOverride,
				wholeWord: args.matchWholeWord,
				// wholeWordOverride: args.wholeWordOverride,
				matchCase: args.isCaseSensitive,
				// matchCaseOverride: args.matchCaseOverride,
				preserveCase: args.preserveCase,
				// preserveCaseOverride: args.preserveCaseOverride,
			} : {};

			await controller.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: (controller.getState().searchString.length === 0) && editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
				seedSearchStringFromNonEmptySelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
				seedSearchStringFromGlobalClipboard: true,
				shouldFocus: FindStartFocusAction.FocusFindInput,
				shouldAnimate: true,
				updateSearchScope: args?.findInSelection || false,
				loop: editor.getOption(EditorOption.find).loop
			}, newState);

			controller.setGlobalBufferTerm(controller.getState().searchString);
		}
	}
}

export class StartFindWithSelectionAction extends EditorAction {

	constructor() {
		super({
			id: FIND_IDS.StartFindWithSelection,
			label: nls.localize2('startFindWithSelectionAction', "Find with Selection"),
			precondition: undefined,
			kbOpts: {
				kbExpr: null,
				primary: 0,
				mac: {
					primary: KeyMod.CtrlCmd | KeyCode.KeyE,
				},
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = CommonFindController.get(editor);
		if (controller) {
			await controller.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'multiple',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: true,
				updateSearchScope: false,
				loop: editor.getOption(EditorOption.find).loop
			});

			controller.setGlobalBufferTerm(controller.getState().searchString);
		}
	}
}
export abstract class MatchFindAction extends EditorAction {
	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = CommonFindController.get(editor);
		if (controller && !this._run(controller)) {
			await controller.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: (controller.getState().searchString.length === 0) && editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
				seedSearchStringFromNonEmptySelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
				seedSearchStringFromGlobalClipboard: true,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: true,
				updateSearchScope: false,
				loop: editor.getOption(EditorOption.find).loop
			});
			this._run(controller);
		}
	}

	protected abstract _run(controller: CommonFindController): boolean;
}

async function matchFindAction(editor: ICodeEditor, next: boolean): Promise<void> {
	const controller = CommonFindController.get(editor);
	if (!controller) {
		return;
	}

	const runMatch = (): boolean => {
		const result = next ? controller.moveToNextMatch() : controller.moveToPrevMatch();
		if (result) {
			controller.editor.pushUndoStop();
			return true;
		}
		return false;
	};

	if (!runMatch()) {
		await controller.start({
			forceRevealReplace: false,
			seedSearchStringFromSelection: (controller.getState().searchString.length === 0) && editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never' ? 'single' : 'none',
			seedSearchStringFromNonEmptySelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
			seedSearchStringFromGlobalClipboard: true,
			shouldFocus: FindStartFocusAction.NoFocusChange,
			shouldAnimate: true,
			updateSearchScope: false,
			loop: editor.getOption(EditorOption.find).loop
		});
		runMatch();
	}
}

export const NextMatchFindAction = registerMultiEditorAction(new MultiEditorAction({
	id: FIND_IDS.NextMatchFindAction,
	label: nls.localize2('findNextMatchAction', "Find Next"),
	precondition: undefined,
	kbOpts: [{
		kbExpr: EditorContextKeys.focus,
		primary: KeyCode.F3,
		mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyG, secondary: [KeyCode.F3] },
		weight: KeybindingWeight.EditorContrib
	}, {
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, CONTEXT_FIND_INPUT_FOCUSED),
		primary: KeyCode.Enter,
		weight: KeybindingWeight.EditorContrib
	}]
}));

NextMatchFindAction.addImplementation(0, async (accessor: ServicesAccessor, editor: ICodeEditor, args: any): Promise<void> => {
	return matchFindAction(editor, true);
});


export const PreviousMatchFindAction = registerMultiEditorAction(new MultiEditorAction({
	id: FIND_IDS.PreviousMatchFindAction,
	label: nls.localize2('findPreviousMatchAction', "Find Previous"),
	precondition: undefined,
	kbOpts: [{
		kbExpr: EditorContextKeys.focus,
		primary: KeyMod.Shift | KeyCode.F3,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyG, secondary: [KeyMod.Shift | KeyCode.F3] },
		weight: KeybindingWeight.EditorContrib
	}, {
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, CONTEXT_FIND_INPUT_FOCUSED),
		primary: KeyMod.Shift | KeyCode.Enter,
		weight: KeybindingWeight.EditorContrib
	}]
}));

PreviousMatchFindAction.addImplementation(0, async (accessor: ServicesAccessor, editor: ICodeEditor, args: any): Promise<void> => {
	return matchFindAction(editor, false);
});

export class MoveToMatchFindAction extends EditorAction {

	private _highlightDecorations: string[] = [];
	constructor() {
		super({
			id: FIND_IDS.GoToMatchFindAction,
			label: nls.localize2('findMatchAction.goToMatch', "Go to Match..."),
			precondition: CONTEXT_FIND_WIDGET_VISIBLE
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void | Promise<void> {
		const controller = CommonFindController.get(editor);
		if (!controller) {
			return;
		}

		const matchesCount = controller.getState().matchesCount;
		if (matchesCount < 1) {
			const notificationService = accessor.get(INotificationService);
			notificationService.notify({
				severity: Severity.Warning,
				message: nls.localize('findMatchAction.noResults', "No matches. Try searching for something else.")
			});
			return;
		}

		const quickInputService = accessor.get(IQuickInputService);
		const disposables = new DisposableStore();
		const inputBox = disposables.add(quickInputService.createInputBox());
		inputBox.placeholder = nls.localize('findMatchAction.inputPlaceHolder', "Type a number to go to a specific match (between 1 and {0})", matchesCount);

		const toFindMatchIndex = (value: string): number | undefined => {
			const index = parseInt(value);
			if (isNaN(index)) {
				return undefined;
			}

			const matchCount = controller.getState().matchesCount;
			if (index > 0 && index <= matchCount) {
				return index - 1; // zero based
			} else if (index < 0 && index >= -matchCount) {
				return matchCount + index;
			}

			return undefined;
		};

		const updatePickerAndEditor = (value: string) => {
			const index = toFindMatchIndex(value);
			if (typeof index === 'number') {
				// valid
				inputBox.validationMessage = undefined;
				controller.goToMatch(index);
				const currentMatch = controller.getState().currentMatch;
				if (currentMatch) {
					this.addDecorations(editor, currentMatch);
				}
			} else {
				inputBox.validationMessage = nls.localize('findMatchAction.inputValidationMessage', "Please type a number between 1 and {0}", controller.getState().matchesCount);
				this.clearDecorations(editor);
			}
		};
		disposables.add(inputBox.onDidChangeValue(value => {
			updatePickerAndEditor(value);
		}));

		disposables.add(inputBox.onDidAccept(() => {
			const index = toFindMatchIndex(inputBox.value);
			if (typeof index === 'number') {
				controller.goToMatch(index);
				inputBox.hide();
			} else {
				inputBox.validationMessage = nls.localize('findMatchAction.inputValidationMessage', "Please type a number between 1 and {0}", controller.getState().matchesCount);
			}
		}));

		disposables.add(inputBox.onDidHide(() => {
			this.clearDecorations(editor);
			disposables.dispose();
		}));

		inputBox.show();
	}

	private clearDecorations(editor: ICodeEditor): void {
		editor.changeDecorations(changeAccessor => {
			this._highlightDecorations = changeAccessor.deltaDecorations(this._highlightDecorations, []);
		});
	}

	private addDecorations(editor: ICodeEditor, range: IRange): void {
		editor.changeDecorations(changeAccessor => {
			this._highlightDecorations = changeAccessor.deltaDecorations(this._highlightDecorations, [
				{
					range,
					options: {
						description: 'find-match-quick-access-range-highlight',
						className: 'rangeHighlight',
						isWholeLine: true
					}
				},
				{
					range,
					options: {
						description: 'find-match-quick-access-range-highlight-overview',
						overviewRuler: {
							color: themeColorFromId(overviewRulerRangeHighlight),
							position: OverviewRulerLane.Full
						}
					}
				}
			]);
		});
	}
}

export abstract class SelectionMatchFindAction extends EditorAction {
	public async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		const controller = CommonFindController.get(editor);
		if (!controller) {
			return;
		}

		const selectionSearchString = getSelectionSearchString(editor, 'single', false);
		if (selectionSearchString) {
			controller.setSearchString(selectionSearchString);
		}
		if (!this._run(controller)) {
			await controller.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: true,
				updateSearchScope: false,
				loop: editor.getOption(EditorOption.find).loop
			});
			this._run(controller);
		}
	}

	protected abstract _run(controller: CommonFindController): boolean;
}

export class NextSelectionMatchFindAction extends SelectionMatchFindAction {

	constructor() {
		super({
			id: FIND_IDS.NextSelectionMatchFindAction,
			label: nls.localize2('nextSelectionMatchFindAction', "Find Next Selection"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyCode.F3,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	protected _run(controller: CommonFindController): boolean {
		return controller.moveToNextMatch();
	}
}

export class PreviousSelectionMatchFindAction extends SelectionMatchFindAction {

	constructor() {
		super({
			id: FIND_IDS.PreviousSelectionMatchFindAction,
			label: nls.localize2('previousSelectionMatchFindAction', "Find Previous Selection"),
			precondition: undefined,
			kbOpts: {
				kbExpr: EditorContextKeys.focus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.F3,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	protected _run(controller: CommonFindController): boolean {
		return controller.moveToPrevMatch();
	}
}

export const StartFindReplaceAction = registerMultiEditorAction(new MultiEditorAction({
	id: FIND_IDS.StartFindReplaceAction,
	label: nls.localize2('startReplace', "Replace"),
	precondition: ContextKeyExpr.or(EditorContextKeys.focus, ContextKeyExpr.has('editorIsOpen')),
	kbOpts: {
		kbExpr: null,
		primary: KeyMod.CtrlCmd | KeyCode.KeyH,
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyF },
		weight: KeybindingWeight.EditorContrib
	},
	menuOpts: {
		menuId: MenuId.MenubarEditMenu,
		group: '3_find',
		title: nls.localize({ key: 'miReplace', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
		order: 2
	}
}));

StartFindReplaceAction.addImplementation(0, (accessor: ServicesAccessor, editor: ICodeEditor, args: any): boolean | Promise<void> => {
	if (!editor.hasModel() || editor.getOption(EditorOption.readOnly)) {
		return false;
	}
	const controller = CommonFindController.get(editor);
	if (!controller) {
		return false;
	}

	const currentSelection = editor.getSelection();
	const findInputFocused = controller.isFindInputFocused();
	// we only seed search string from selection when the current selection is single line and not empty,
	// + the find input is not focused
	const seedSearchStringFromSelection = !currentSelection.isEmpty()
		&& currentSelection.startLineNumber === currentSelection.endLineNumber
		&& (editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never')
		&& !findInputFocused;
	/*
	* if the existing search string in find widget is empty and we don't seed search string from selection, it means the Find Input is still empty, so we should focus the Find Input instead of Replace Input.

	* findInputFocused true -> seedSearchStringFromSelection false, FocusReplaceInput
	* findInputFocused false, seedSearchStringFromSelection true FocusReplaceInput
	* findInputFocused false seedSearchStringFromSelection false FocusFindInput
	*/
	const shouldFocus = (findInputFocused || seedSearchStringFromSelection) ?
		FindStartFocusAction.FocusReplaceInput : FindStartFocusAction.FocusFindInput;

	return controller.start({
		forceRevealReplace: true,
		seedSearchStringFromSelection: seedSearchStringFromSelection ? 'single' : 'none',
		seedSearchStringFromNonEmptySelection: editor.getOption(EditorOption.find).seedSearchStringFromSelection === 'selection',
		seedSearchStringFromGlobalClipboard: editor.getOption(EditorOption.find).seedSearchStringFromSelection !== 'never',
		shouldFocus: shouldFocus,
		shouldAnimate: true,
		updateSearchScope: false,
		loop: editor.getOption(EditorOption.find).loop
	});
});

registerEditorContribution(CommonFindController.ID, FindController, EditorContributionInstantiation.Eager); // eager because it uses `saveViewState`/`restoreViewState`

registerEditorAction(StartFindWithArgsAction);
registerEditorAction(StartFindWithSelectionAction);
registerEditorAction(MoveToMatchFindAction);
registerEditorAction(NextSelectionMatchFindAction);
registerEditorAction(PreviousSelectionMatchFindAction);

const FindCommand = EditorCommand.bindToContribution<CommonFindController>(CommonFindController.get);

registerEditorCommand(new FindCommand({
	id: FIND_IDS.CloseFindWidgetCommand,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.closeFindWidget(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, ContextKeyExpr.not('isComposing')),
		primary: KeyCode.Escape,
		secondary: [KeyMod.Shift | KeyCode.Escape]
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ToggleCaseSensitiveCommand,
	precondition: undefined,
	handler: x => x.toggleCaseSensitive(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: ToggleCaseSensitiveKeybinding.primary,
		mac: ToggleCaseSensitiveKeybinding.mac,
		win: ToggleCaseSensitiveKeybinding.win,
		linux: ToggleCaseSensitiveKeybinding.linux
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ToggleWholeWordCommand,
	precondition: undefined,
	handler: x => x.toggleWholeWords(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: ToggleWholeWordKeybinding.primary,
		mac: ToggleWholeWordKeybinding.mac,
		win: ToggleWholeWordKeybinding.win,
		linux: ToggleWholeWordKeybinding.linux
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ToggleRegexCommand,
	precondition: undefined,
	handler: x => x.toggleRegex(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: ToggleRegexKeybinding.primary,
		mac: ToggleRegexKeybinding.mac,
		win: ToggleRegexKeybinding.win,
		linux: ToggleRegexKeybinding.linux
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ToggleSearchScopeCommand,
	precondition: undefined,
	handler: x => x.toggleSearchScope(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: ToggleSearchScopeKeybinding.primary,
		mac: ToggleSearchScopeKeybinding.mac,
		win: ToggleSearchScopeKeybinding.win,
		linux: ToggleSearchScopeKeybinding.linux
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.TogglePreserveCaseCommand,
	precondition: undefined,
	handler: x => x.togglePreserveCase(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: TogglePreserveCaseKeybinding.primary,
		mac: TogglePreserveCaseKeybinding.mac,
		win: TogglePreserveCaseKeybinding.win,
		linux: TogglePreserveCaseKeybinding.linux
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ReplaceOneAction,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.replace(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit1
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ReplaceOneAction,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.replace(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, CONTEXT_REPLACE_INPUT_FOCUSED),
		primary: KeyCode.Enter
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ReplaceAllAction,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.replaceAll(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Enter
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.ReplaceAllAction,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.replaceAll(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: ContextKeyExpr.and(EditorContextKeys.focus, CONTEXT_REPLACE_INPUT_FOCUSED),
		primary: undefined,
		mac: {
			primary: KeyMod.CtrlCmd | KeyCode.Enter,
		}
	}
}));

registerEditorCommand(new FindCommand({
	id: FIND_IDS.SelectAllMatchesAction,
	precondition: CONTEXT_FIND_WIDGET_VISIBLE,
	handler: x => x.selectAllMatches(),
	kbOpts: {
		weight: KeybindingWeight.EditorContrib + 5,
		kbExpr: EditorContextKeys.focus,
		primary: KeyMod.Alt | KeyCode.Enter
	}
}));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findDecorations.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { FindMatch, IModelDecorationsChangeAccessor, IModelDeltaDecoration, MinimapPosition, OverviewRulerLane, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { minimapFindMatch, overviewRulerFindMatchForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';

export class FindDecorations implements IDisposable {

	private readonly _editor: IActiveCodeEditor;
	private _decorations: string[];
	private _overviewRulerApproximateDecorations: string[];
	private _findScopeDecorationIds: string[];
	private _rangeHighlightDecorationId: string | null;
	private _highlightedDecorationId: string | null;
	private _startPosition: Position;

	constructor(editor: IActiveCodeEditor) {
		this._editor = editor;
		this._decorations = [];
		this._overviewRulerApproximateDecorations = [];
		this._findScopeDecorationIds = [];
		this._rangeHighlightDecorationId = null;
		this._highlightedDecorationId = null;
		this._startPosition = this._editor.getPosition();
	}

	public dispose(): void {
		this._editor.removeDecorations(this._allDecorations());

		this._decorations = [];
		this._overviewRulerApproximateDecorations = [];
		this._findScopeDecorationIds = [];
		this._rangeHighlightDecorationId = null;
		this._highlightedDecorationId = null;
	}

	public reset(): void {
		this._decorations = [];
		this._overviewRulerApproximateDecorations = [];
		this._findScopeDecorationIds = [];
		this._rangeHighlightDecorationId = null;
		this._highlightedDecorationId = null;
	}

	public getCount(): number {
		return this._decorations.length;
	}

	/** @deprecated use getFindScopes to support multiple selections */
	public getFindScope(): Range | null {
		if (this._findScopeDecorationIds[0]) {
			return this._editor.getModel().getDecorationRange(this._findScopeDecorationIds[0]);
		}
		return null;
	}

	public getFindScopes(): Range[] | null {
		if (this._findScopeDecorationIds.length) {
			const scopes = this._findScopeDecorationIds.map(findScopeDecorationId =>
				this._editor.getModel().getDecorationRange(findScopeDecorationId)
			).filter(element => !!element);
			if (scopes.length) {
				return scopes;
			}
		}
		return null;
	}

	public getStartPosition(): Position {
		return this._startPosition;
	}

	public setStartPosition(newStartPosition: Position): void {
		this._startPosition = newStartPosition;
		this.setCurrentFindMatch(null);
	}

	private _getDecorationIndex(decorationId: string): number {
		const index = this._decorations.indexOf(decorationId);
		if (index >= 0) {
			return index + 1;
		}
		return 1;
	}

	public getDecorationRangeAt(index: number): Range | null {
		const decorationId = index < this._decorations.length ? this._decorations[index] : null;
		if (decorationId) {
			return this._editor.getModel().getDecorationRange(decorationId);
		}
		return null;
	}

	public getCurrentMatchesPosition(desiredRange: Range): number {
		const candidates = this._editor.getModel().getDecorationsInRange(desiredRange);
		for (const candidate of candidates) {
			const candidateOpts = candidate.options;
			if (candidateOpts === FindDecorations._FIND_MATCH_DECORATION || candidateOpts === FindDecorations._CURRENT_FIND_MATCH_DECORATION) {
				return this._getDecorationIndex(candidate.id);
			}
		}
		// We don't know the current match position, so returns zero to show '?' in find widget
		return 0;
	}

	public setCurrentFindMatch(nextMatch: Range | null): number {
		let newCurrentDecorationId: string | null = null;
		let matchPosition = 0;
		if (nextMatch) {
			for (let i = 0, len = this._decorations.length; i < len; i++) {
				const range = this._editor.getModel().getDecorationRange(this._decorations[i]);
				if (nextMatch.equalsRange(range)) {
					newCurrentDecorationId = this._decorations[i];
					matchPosition = (i + 1);
					break;
				}
			}
		}

		if (this._highlightedDecorationId !== null || newCurrentDecorationId !== null) {
			this._editor.changeDecorations((changeAccessor: IModelDecorationsChangeAccessor) => {
				if (this._highlightedDecorationId !== null) {
					changeAccessor.changeDecorationOptions(this._highlightedDecorationId, FindDecorations._FIND_MATCH_DECORATION);
					this._highlightedDecorationId = null;
				}
				if (newCurrentDecorationId !== null) {
					this._highlightedDecorationId = newCurrentDecorationId;
					changeAccessor.changeDecorationOptions(this._highlightedDecorationId, FindDecorations._CURRENT_FIND_MATCH_DECORATION);
				}
				if (this._rangeHighlightDecorationId !== null) {
					changeAccessor.removeDecoration(this._rangeHighlightDecorationId);
					this._rangeHighlightDecorationId = null;
				}
				if (newCurrentDecorationId !== null) {
					let rng = this._editor.getModel().getDecorationRange(newCurrentDecorationId)!;
					if (rng.startLineNumber !== rng.endLineNumber && rng.endColumn === 1) {
						const lineBeforeEnd = rng.endLineNumber - 1;
						const lineBeforeEndMaxColumn = this._editor.getModel().getLineMaxColumn(lineBeforeEnd);
						rng = new Range(rng.startLineNumber, rng.startColumn, lineBeforeEnd, lineBeforeEndMaxColumn);
					}
					this._rangeHighlightDecorationId = changeAccessor.addDecoration(rng, FindDecorations._RANGE_HIGHLIGHT_DECORATION);
				}
			});
		}

		return matchPosition;
	}

	public set(findMatches: FindMatch[], findScopes: Range[] | null): void {
		this._editor.changeDecorations((accessor) => {

			let findMatchesOptions: ModelDecorationOptions = FindDecorations._FIND_MATCH_DECORATION;
			const newOverviewRulerApproximateDecorations: IModelDeltaDecoration[] = [];

			if (findMatches.length > 1000) {
				// we go into a mode where the overview ruler gets "approximate" decorations
				// the reason is that the overview ruler paints all the decorations in the file and we don't want to cause freezes
				findMatchesOptions = FindDecorations._FIND_MATCH_NO_OVERVIEW_DECORATION;

				// approximate a distance in lines where matches should be merged
				const lineCount = this._editor.getModel().getLineCount();
				const height = this._editor.getLayoutInfo().height;
				const approxPixelsPerLine = height / lineCount;
				const mergeLinesDelta = Math.max(2, Math.ceil(3 / approxPixelsPerLine));

				// merge decorations as much as possible
				let prevStartLineNumber = findMatches[0].range.startLineNumber;
				let prevEndLineNumber = findMatches[0].range.endLineNumber;
				for (let i = 1, len = findMatches.length; i < len; i++) {
					const range = findMatches[i].range;
					if (prevEndLineNumber + mergeLinesDelta >= range.startLineNumber) {
						if (range.endLineNumber > prevEndLineNumber) {
							prevEndLineNumber = range.endLineNumber;
						}
					} else {
						newOverviewRulerApproximateDecorations.push({
							range: new Range(prevStartLineNumber, 1, prevEndLineNumber, 1),
							options: FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION
						});
						prevStartLineNumber = range.startLineNumber;
						prevEndLineNumber = range.endLineNumber;
					}
				}

				newOverviewRulerApproximateDecorations.push({
					range: new Range(prevStartLineNumber, 1, prevEndLineNumber, 1),
					options: FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION
				});
			}

			// Find matches
			const newFindMatchesDecorations: IModelDeltaDecoration[] = new Array<IModelDeltaDecoration>(findMatches.length);
			for (let i = 0, len = findMatches.length; i < len; i++) {
				newFindMatchesDecorations[i] = {
					range: findMatches[i].range,
					options: findMatchesOptions
				};
			}
			this._decorations = accessor.deltaDecorations(this._decorations, newFindMatchesDecorations);

			// Overview ruler approximate decorations
			this._overviewRulerApproximateDecorations = accessor.deltaDecorations(this._overviewRulerApproximateDecorations, newOverviewRulerApproximateDecorations);

			// Range highlight
			if (this._rangeHighlightDecorationId) {
				accessor.removeDecoration(this._rangeHighlightDecorationId);
				this._rangeHighlightDecorationId = null;
			}

			// Find scope
			if (this._findScopeDecorationIds.length) {
				this._findScopeDecorationIds.forEach(findScopeDecorationId => accessor.removeDecoration(findScopeDecorationId));
				this._findScopeDecorationIds = [];
			}
			if (findScopes?.length) {
				this._findScopeDecorationIds = findScopes.map(findScope => accessor.addDecoration(findScope, FindDecorations._FIND_SCOPE_DECORATION));
			}
		});
	}

	public matchBeforePosition(position: Position): Range | null {
		if (this._decorations.length === 0) {
			return null;
		}
		for (let i = this._decorations.length - 1; i >= 0; i--) {
			const decorationId = this._decorations[i];
			const r = this._editor.getModel().getDecorationRange(decorationId);
			if (!r || r.endLineNumber > position.lineNumber) {
				continue;
			}
			if (r.endLineNumber < position.lineNumber) {
				return r;
			}
			if (r.endColumn > position.column) {
				continue;
			}
			return r;
		}

		return this._editor.getModel().getDecorationRange(this._decorations[this._decorations.length - 1]);
	}

	public matchAfterPosition(position: Position): Range | null {
		if (this._decorations.length === 0) {
			return null;
		}
		for (let i = 0, len = this._decorations.length; i < len; i++) {
			const decorationId = this._decorations[i];
			const r = this._editor.getModel().getDecorationRange(decorationId);
			if (!r || r.startLineNumber < position.lineNumber) {
				continue;
			}
			if (r.startLineNumber > position.lineNumber) {
				return r;
			}
			if (r.startColumn < position.column) {
				continue;
			}
			return r;
		}

		return this._editor.getModel().getDecorationRange(this._decorations[0]);
	}

	private _allDecorations(): string[] {
		let result: string[] = [];
		result = result.concat(this._decorations);
		result = result.concat(this._overviewRulerApproximateDecorations);
		if (this._findScopeDecorationIds.length) {
			result.push(...this._findScopeDecorationIds);
		}
		if (this._rangeHighlightDecorationId) {
			result.push(this._rangeHighlightDecorationId);
		}
		return result;
	}

	public static readonly _CURRENT_FIND_MATCH_DECORATION = ModelDecorationOptions.register({
		description: 'current-find-match',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		zIndex: 13,
		className: 'currentFindMatch',
		inlineClassName: 'currentFindMatchInline',
		showIfCollapsed: true,
		overviewRuler: {
			color: themeColorFromId(overviewRulerFindMatchForeground),
			position: OverviewRulerLane.Center
		},
		minimap: {
			color: themeColorFromId(minimapFindMatch),
			position: MinimapPosition.Inline
		}
	});

	public static readonly _FIND_MATCH_DECORATION = ModelDecorationOptions.register({
		description: 'find-match',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		zIndex: 10,
		className: 'findMatch',
		inlineClassName: 'findMatchInline',
		showIfCollapsed: true,
		overviewRuler: {
			color: themeColorFromId(overviewRulerFindMatchForeground),
			position: OverviewRulerLane.Center
		},
		minimap: {
			color: themeColorFromId(minimapFindMatch),
			position: MinimapPosition.Inline
		}
	});

	public static readonly _FIND_MATCH_NO_OVERVIEW_DECORATION = ModelDecorationOptions.register({
		description: 'find-match-no-overview',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'findMatch',
		showIfCollapsed: true
	});

	private static readonly _FIND_MATCH_ONLY_OVERVIEW_DECORATION = ModelDecorationOptions.register({
		description: 'find-match-only-overview',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		overviewRuler: {
			color: themeColorFromId(overviewRulerFindMatchForeground),
			position: OverviewRulerLane.Center
		}
	});

	private static readonly _RANGE_HIGHLIGHT_DECORATION = ModelDecorationOptions.register({
		description: 'find-range-highlight',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'rangeHighlight',
		isWholeLine: true
	});

	private static readonly _FIND_SCOPE_DECORATION = ModelDecorationOptions.register({
		description: 'find-scope',
		className: 'findScope',
		isWholeLine: true
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findModel.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { findFirstIdxMonotonousOrArrLen } from '../../../../base/common/arraysFind.js';
import { RunOnceScheduler, TimeoutTimer } from '../../../../base/common/async.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore, dispose } from '../../../../base/common/lifecycle.js';
import { Constants } from '../../../../base/common/uint.js';
import { IActiveCodeEditor } from '../../../browser/editorBrowser.js';
import { ReplaceCommand, ReplaceCommandThatPreservesSelection } from '../../../common/commands/replaceCommand.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CursorChangeReason, ICursorPositionChangedEvent } from '../../../common/cursorEvents.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ScrollType } from '../../../common/editorCommon.js';
import { EndOfLinePreference, FindMatch, ITextModel } from '../../../common/model.js';
import { SearchParams } from '../../../common/model/textModelSearch.js';
import { FindDecorations } from './findDecorations.js';
import { FindReplaceState, FindReplaceStateChangedEvent } from './findState.js';
import { ReplaceAllCommand } from './replaceAllCommand.js';
import { parseReplaceString, ReplacePattern } from './replacePattern.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindings } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

export const CONTEXT_FIND_WIDGET_VISIBLE = new RawContextKey<boolean>('findWidgetVisible', false);
export const CONTEXT_FIND_WIDGET_NOT_VISIBLE = CONTEXT_FIND_WIDGET_VISIBLE.toNegated();
// Keep ContextKey use of 'Focussed' to not break when clauses
export const CONTEXT_FIND_INPUT_FOCUSED = new RawContextKey<boolean>('findInputFocussed', false);
export const CONTEXT_REPLACE_INPUT_FOCUSED = new RawContextKey<boolean>('replaceInputFocussed', false);

export const ToggleCaseSensitiveKeybinding: IKeybindings = {
	primary: KeyMod.Alt | KeyCode.KeyC,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC }
};
export const ToggleWholeWordKeybinding: IKeybindings = {
	primary: KeyMod.Alt | KeyCode.KeyW,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyW }
};
export const ToggleRegexKeybinding: IKeybindings = {
	primary: KeyMod.Alt | KeyCode.KeyR,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyR }
};
export const ToggleSearchScopeKeybinding: IKeybindings = {
	primary: KeyMod.Alt | KeyCode.KeyL,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyL }
};
export const TogglePreserveCaseKeybinding: IKeybindings = {
	primary: KeyMod.Alt | KeyCode.KeyP,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyP }
};

export const FIND_IDS = {
	StartFindAction: 'actions.find',
	StartFindWithSelection: 'actions.findWithSelection',
	StartFindWithArgs: 'editor.actions.findWithArgs',
	NextMatchFindAction: 'editor.action.nextMatchFindAction',
	PreviousMatchFindAction: 'editor.action.previousMatchFindAction',
	GoToMatchFindAction: 'editor.action.goToMatchFindAction',
	NextSelectionMatchFindAction: 'editor.action.nextSelectionMatchFindAction',
	PreviousSelectionMatchFindAction: 'editor.action.previousSelectionMatchFindAction',
	StartFindReplaceAction: 'editor.action.startFindReplaceAction',
	CloseFindWidgetCommand: 'closeFindWidget',
	ToggleCaseSensitiveCommand: 'toggleFindCaseSensitive',
	ToggleWholeWordCommand: 'toggleFindWholeWord',
	ToggleRegexCommand: 'toggleFindRegex',
	ToggleSearchScopeCommand: 'toggleFindInSelection',
	TogglePreserveCaseCommand: 'togglePreserveCase',
	ReplaceOneAction: 'editor.action.replaceOne',
	ReplaceAllAction: 'editor.action.replaceAll',
	SelectAllMatchesAction: 'editor.action.selectAllMatches'
};

export const MATCHES_LIMIT = 19999;
const RESEARCH_DELAY = 240;

export class FindModelBoundToEditorModel {

	private readonly _editor: IActiveCodeEditor;
	private readonly _state: FindReplaceState;
	private readonly _toDispose = new DisposableStore();
	private readonly _decorations: FindDecorations;
	private _ignoreModelContentChanged: boolean;
	private readonly _startSearchingTimer: TimeoutTimer;

	private readonly _updateDecorationsScheduler: RunOnceScheduler;
	private _isDisposed: boolean;

	constructor(editor: IActiveCodeEditor, state: FindReplaceState) {
		this._editor = editor;
		this._state = state;
		this._isDisposed = false;
		this._startSearchingTimer = new TimeoutTimer();

		this._decorations = new FindDecorations(editor);
		this._toDispose.add(this._decorations);

		this._updateDecorationsScheduler = new RunOnceScheduler(() => {
			if (!this._editor.hasModel()) {
				return;
			}
			return this.research(false);
		}, 100);
		this._toDispose.add(this._updateDecorationsScheduler);

		this._toDispose.add(this._editor.onDidChangeCursorPosition((e: ICursorPositionChangedEvent) => {
			if (
				e.reason === CursorChangeReason.Explicit
				|| e.reason === CursorChangeReason.Undo
				|| e.reason === CursorChangeReason.Redo
			) {
				this._decorations.setStartPosition(this._editor.getPosition());
			}
		}));

		this._ignoreModelContentChanged = false;
		this._toDispose.add(this._editor.onDidChangeModelContent((e) => {
			if (this._ignoreModelContentChanged) {
				return;
			}
			if (e.isFlush) {
				// a model.setValue() was called
				this._decorations.reset();
			}
			this._decorations.setStartPosition(this._editor.getPosition());
			this._updateDecorationsScheduler.schedule();
		}));

		this._toDispose.add(this._state.onFindReplaceStateChange((e) => this._onStateChanged(e)));

		this.research(false, this._state.searchScope);
	}

	public dispose(): void {
		this._isDisposed = true;
		dispose(this._startSearchingTimer);
		this._toDispose.dispose();
	}

	private _onStateChanged(e: FindReplaceStateChangedEvent): void {
		if (this._isDisposed) {
			// The find model is disposed during a find state changed event
			return;
		}
		if (!this._editor.hasModel()) {
			// The find model will be disposed momentarily
			return;
		}
		if (e.searchString || e.isReplaceRevealed || e.isRegex || e.wholeWord || e.matchCase || e.searchScope) {
			const model = this._editor.getModel();

			if (model.isTooLargeForSyncing()) {
				this._startSearchingTimer.cancel();

				this._startSearchingTimer.setIfNotSet(() => {
					if (e.searchScope) {
						this.research(e.moveCursor, this._state.searchScope);
					} else {
						this.research(e.moveCursor);
					}
				}, RESEARCH_DELAY);
			} else {
				if (e.searchScope) {
					this.research(e.moveCursor, this._state.searchScope);
				} else {
					this.research(e.moveCursor);
				}
			}
		}
	}

	private static _getSearchRange(model: ITextModel, findScope: Range | null): Range {
		// If we have set now or before a find scope, use it for computing the search range
		if (findScope) {
			return findScope;
		}

		return model.getFullModelRange();
	}

	private research(moveCursor: boolean, newFindScope?: Range | Range[] | null): void {
		let findScopes: Range[] | null = null;
		if (typeof newFindScope !== 'undefined') {
			if (newFindScope !== null) {
				if (!Array.isArray(newFindScope)) {
					findScopes = [newFindScope];
				} else {
					findScopes = newFindScope;
				}
			}
		} else {
			findScopes = this._decorations.getFindScopes();
		}
		if (findScopes !== null) {
			findScopes = findScopes.map(findScope => {
				if (findScope.startLineNumber !== findScope.endLineNumber) {
					let endLineNumber = findScope.endLineNumber;

					if (findScope.endColumn === 1) {
						endLineNumber = endLineNumber - 1;
					}

					return new Range(findScope.startLineNumber, 1, endLineNumber, this._editor.getModel().getLineMaxColumn(endLineNumber));
				}
				return findScope;
			});
		}

		const findMatches = this._findMatches(findScopes, false, MATCHES_LIMIT);
		this._decorations.set(findMatches, findScopes);

		const editorSelection = this._editor.getSelection();
		let currentMatchesPosition = this._decorations.getCurrentMatchesPosition(editorSelection);
		if (currentMatchesPosition === 0 && findMatches.length > 0) {
			// current selection is not on top of a match
			// try to find its nearest result from the top of the document
			const matchAfterSelection = findFirstIdxMonotonousOrArrLen(findMatches.map(match => match.range), range => Range.compareRangesUsingStarts(range, editorSelection) >= 0);
			currentMatchesPosition = matchAfterSelection > 0 ? matchAfterSelection - 1 + 1 /** match position is one based */ : currentMatchesPosition;
		}

		this._state.changeMatchInfo(
			currentMatchesPosition,
			this._decorations.getCount(),
			undefined
		);

		if (moveCursor && this._editor.getOption(EditorOption.find).cursorMoveOnType) {
			this._moveToNextMatch(this._decorations.getStartPosition());
		}
	}

	private _hasMatches(): boolean {
		return (this._state.matchesCount > 0);
	}

	private _cannotFind(): boolean {
		if (!this._hasMatches()) {
			const findScope = this._decorations.getFindScope();
			if (findScope) {
				// Reveal the selection so user is reminded that 'selection find' is on.
				this._editor.revealRangeInCenterIfOutsideViewport(findScope, ScrollType.Smooth);
			}
			return true;
		}
		return false;
	}

	private _setCurrentFindMatch(match: Range): void {
		const matchesPosition = this._decorations.setCurrentFindMatch(match);
		this._state.changeMatchInfo(
			matchesPosition,
			this._decorations.getCount(),
			match
		);

		this._editor.setSelection(match);
		this._editor.revealRangeInCenterIfOutsideViewport(match, ScrollType.Smooth);
	}

	private _prevSearchPosition(before: Position) {
		const isUsingLineStops = this._state.isRegex && (
			this._state.searchString.indexOf('^') >= 0
			|| this._state.searchString.indexOf('$') >= 0
		);
		let { lineNumber, column } = before;
		const model = this._editor.getModel();

		if (isUsingLineStops || column === 1) {
			if (lineNumber === 1) {
				lineNumber = model.getLineCount();
			} else {
				lineNumber--;
			}
			column = model.getLineMaxColumn(lineNumber);
		} else {
			column--;
		}

		return new Position(lineNumber, column);
	}

	private _moveToPrevMatch(before: Position, isRecursed: boolean = false): void {
		if (!this._state.canNavigateBack()) {
			// we are beyond the first matched find result
			// instead of doing nothing, we should refocus the first item
			const nextMatchRange = this._decorations.matchAfterPosition(before);

			if (nextMatchRange) {
				this._setCurrentFindMatch(nextMatchRange);
			}
			return;
		}
		if (this._decorations.getCount() < MATCHES_LIMIT) {
			let prevMatchRange = this._decorations.matchBeforePosition(before);

			if (prevMatchRange && prevMatchRange.isEmpty() && prevMatchRange.getStartPosition().equals(before)) {
				before = this._prevSearchPosition(before);
				prevMatchRange = this._decorations.matchBeforePosition(before);
			}

			if (prevMatchRange) {
				this._setCurrentFindMatch(prevMatchRange);
			}

			return;
		}

		if (this._cannotFind()) {
			return;
		}

		const findScope = this._decorations.getFindScope();
		const searchRange = FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), findScope);

		// ...(----)...|...
		if (searchRange.getEndPosition().isBefore(before)) {
			before = searchRange.getEndPosition();
		}

		// ...|...(----)...
		if (before.isBefore(searchRange.getStartPosition())) {
			before = searchRange.getEndPosition();
		}

		const { lineNumber, column } = before;
		const model = this._editor.getModel();

		let position = new Position(lineNumber, column);

		let prevMatch = model.findPreviousMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false);

		if (prevMatch && prevMatch.range.isEmpty() && prevMatch.range.getStartPosition().equals(position)) {
			// Looks like we're stuck at this position, unacceptable!
			position = this._prevSearchPosition(position);
			prevMatch = model.findPreviousMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, false);
		}

		if (!prevMatch) {
			// there is precisely one match and selection is on top of it
			return;
		}

		if (!isRecursed && !searchRange.containsRange(prevMatch.range)) {
			return this._moveToPrevMatch(prevMatch.range.getStartPosition(), true);
		}

		this._setCurrentFindMatch(prevMatch.range);
	}

	public moveToPrevMatch(): void {
		this._moveToPrevMatch(this._editor.getSelection().getStartPosition());
	}

	private _nextSearchPosition(after: Position) {
		const isUsingLineStops = this._state.isRegex && (
			this._state.searchString.indexOf('^') >= 0
			|| this._state.searchString.indexOf('$') >= 0
		);

		let { lineNumber, column } = after;
		const model = this._editor.getModel();

		if (isUsingLineStops || column === model.getLineMaxColumn(lineNumber)) {
			if (lineNumber === model.getLineCount()) {
				lineNumber = 1;
			} else {
				lineNumber++;
			}
			column = 1;
		} else {
			column++;
		}

		return new Position(lineNumber, column);
	}

	private _moveToNextMatch(after: Position): void {
		if (!this._state.canNavigateForward()) {
			// we are beyond the last matched find result
			// instead of doing nothing, we should refocus the last item
			const prevMatchRange = this._decorations.matchBeforePosition(after);

			if (prevMatchRange) {
				this._setCurrentFindMatch(prevMatchRange);
			}
			return;
		}
		if (this._decorations.getCount() < MATCHES_LIMIT) {
			let nextMatchRange = this._decorations.matchAfterPosition(after);

			if (nextMatchRange && nextMatchRange.isEmpty() && nextMatchRange.getStartPosition().equals(after)) {
				// Looks like we're stuck at this position, unacceptable!
				after = this._nextSearchPosition(after);
				nextMatchRange = this._decorations.matchAfterPosition(after);
			}
			if (nextMatchRange) {
				this._setCurrentFindMatch(nextMatchRange);
			}

			return;
		}

		const nextMatch = this._getNextMatch(after, false, true);
		if (nextMatch) {
			this._setCurrentFindMatch(nextMatch.range);
		}
	}

	private _getNextMatch(after: Position, captureMatches: boolean, forceMove: boolean, isRecursed: boolean = false): FindMatch | null {
		if (this._cannotFind()) {
			return null;
		}

		const findScope = this._decorations.getFindScope();
		const searchRange = FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), findScope);

		// ...(----)...|...
		if (searchRange.getEndPosition().isBefore(after)) {
			after = searchRange.getStartPosition();
		}

		// ...|...(----)...
		if (after.isBefore(searchRange.getStartPosition())) {
			after = searchRange.getStartPosition();
		}

		const { lineNumber, column } = after;
		const model = this._editor.getModel();

		let position = new Position(lineNumber, column);

		let nextMatch = model.findNextMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, captureMatches);

		if (forceMove && nextMatch && nextMatch.range.isEmpty() && nextMatch.range.getStartPosition().equals(position)) {
			// Looks like we're stuck at this position, unacceptable!
			position = this._nextSearchPosition(position);
			nextMatch = model.findNextMatch(this._state.searchString, position, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, captureMatches);
		}

		if (!nextMatch) {
			// there is precisely one match and selection is on top of it
			return null;
		}

		if (!isRecursed && !searchRange.containsRange(nextMatch.range)) {
			return this._getNextMatch(nextMatch.range.getEndPosition(), captureMatches, forceMove, true);
		}

		return nextMatch;
	}

	public moveToNextMatch(): void {
		this._moveToNextMatch(this._editor.getSelection().getEndPosition());
	}

	private _moveToMatch(index: number): void {
		const decorationRange = this._decorations.getDecorationRangeAt(index);
		if (decorationRange) {
			this._setCurrentFindMatch(decorationRange);
		}
	}

	public moveToMatch(index: number): void {
		this._moveToMatch(index);
	}

	private _getReplacePattern(): ReplacePattern {
		if (this._state.isRegex) {
			return parseReplaceString(this._state.replaceString);
		}
		return ReplacePattern.fromStaticValue(this._state.replaceString);
	}

	public replace(): void {
		if (!this._hasMatches()) {
			return;
		}

		const replacePattern = this._getReplacePattern();
		const selection = this._editor.getSelection();
		const nextMatch = this._getNextMatch(selection.getStartPosition(), true, false);
		if (nextMatch) {
			if (selection.equalsRange(nextMatch.range)) {
				// selection sits on a find match => replace it!
				const replaceString = replacePattern.buildReplaceString(nextMatch.matches, this._state.preserveCase);

				const command = new ReplaceCommand(selection, replaceString);

				this._executeEditorCommand('replace', command);

				this._decorations.setStartPosition(new Position(selection.startLineNumber, selection.startColumn + replaceString.length));
				this.research(true);
			} else {
				this._decorations.setStartPosition(this._editor.getPosition());
				this._setCurrentFindMatch(nextMatch.range);
			}
		}
	}

	private _findMatches(findScopes: Range[] | null, captureMatches: boolean, limitResultCount: number): FindMatch[] {
		const searchRanges = (findScopes as [] || [null]).map((scope: Range | null) =>
			FindModelBoundToEditorModel._getSearchRange(this._editor.getModel(), scope)
		);

		return this._editor.getModel().findMatches(this._state.searchString, searchRanges, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null, captureMatches, limitResultCount);
	}

	public replaceAll(): void {
		if (!this._hasMatches()) {
			return;
		}

		const findScopes = this._decorations.getFindScopes();

		if (findScopes === null && this._state.matchesCount >= MATCHES_LIMIT) {
			// Doing a replace on the entire file that is over ${MATCHES_LIMIT} matches
			this._largeReplaceAll();
		} else {
			this._regularReplaceAll(findScopes);
		}

		this.research(false);
	}

	private _largeReplaceAll(): void {
		const searchParams = new SearchParams(this._state.searchString, this._state.isRegex, this._state.matchCase, this._state.wholeWord ? this._editor.getOption(EditorOption.wordSeparators) : null);
		const searchData = searchParams.parseSearchRequest();
		if (!searchData) {
			return;
		}

		let searchRegex = searchData.regex;
		if (!searchRegex.multiline) {
			let mod = 'mu';
			if (searchRegex.ignoreCase) {
				mod += 'i';
			}
			if (searchRegex.global) {
				mod += 'g';
			}
			searchRegex = new RegExp(searchRegex.source, mod);
		}

		const model = this._editor.getModel();
		const modelText = model.getValue(EndOfLinePreference.LF);
		const fullModelRange = model.getFullModelRange();

		const replacePattern = this._getReplacePattern();
		let resultText: string;
		const preserveCase = this._state.preserveCase;

		if (replacePattern.hasReplacementPatterns || preserveCase) {
			resultText = modelText.replace(searchRegex, function () {
				// eslint-disable-next-line local/code-no-any-casts
				return replacePattern.buildReplaceString(<string[]><any>arguments, preserveCase);
			});
		} else {
			resultText = modelText.replace(searchRegex, replacePattern.buildReplaceString(null, preserveCase));
		}

		const command = new ReplaceCommandThatPreservesSelection(fullModelRange, resultText, this._editor.getSelection());
		this._executeEditorCommand('replaceAll', command);
	}

	private _regularReplaceAll(findScopes: Range[] | null): void {
		const replacePattern = this._getReplacePattern();
		// Get all the ranges (even more than the highlighted ones)
		const matches = this._findMatches(findScopes, replacePattern.hasReplacementPatterns || this._state.preserveCase, Constants.MAX_SAFE_SMALL_INTEGER);

		const replaceStrings: string[] = [];
		for (let i = 0, len = matches.length; i < len; i++) {
			replaceStrings[i] = replacePattern.buildReplaceString(matches[i].matches, this._state.preserveCase);
		}

		const command = new ReplaceAllCommand(this._editor.getSelection(), matches.map(m => m.range), replaceStrings);
		this._executeEditorCommand('replaceAll', command);
	}

	public selectAllMatches(): void {
		if (!this._hasMatches()) {
			return;
		}

		const findScopes = this._decorations.getFindScopes();

		// Get all the ranges (even more than the highlighted ones)
		const matches = this._findMatches(findScopes, false, Constants.MAX_SAFE_SMALL_INTEGER);
		let selections = matches.map(m => new Selection(m.range.startLineNumber, m.range.startColumn, m.range.endLineNumber, m.range.endColumn));

		// If one of the ranges is the editor selection, then maintain it as primary
		const editorSelection = this._editor.getSelection();
		for (let i = 0, len = selections.length; i < len; i++) {
			const sel = selections[i];
			if (sel.equalsRange(editorSelection)) {
				selections = [editorSelection].concat(selections.slice(0, i)).concat(selections.slice(i + 1));
				break;
			}
		}

		this._editor.setSelections(selections);
	}

	private _executeEditorCommand(source: string, command: ICommand): void {
		try {
			this._ignoreModelContentChanged = true;
			this._editor.pushUndoStop();
			this._editor.executeCommand(source, command);
			this._editor.pushUndoStop();
		} finally {
			this._ignoreModelContentChanged = false;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findOptionsWidget.css]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findOptionsWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .findOptionsWidget {
	background-color: var(--vscode-editorWidget-background);
	color: var(--vscode-editorWidget-foreground);
	box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
	border: 2px solid var(--vscode-contrastBorder);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findOptionsWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findOptionsWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import './findOptionsWidget.css';
import { CaseSensitiveToggle, RegexToggle, WholeWordsToggle } from '../../../../base/browser/ui/findinput/findInputToggles.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, OverlayWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { FIND_IDS } from './findModel.js';
import { FindReplaceState } from './findState.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { asCssVariable, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../../platform/theme/common/colorRegistry.js';
import type { IHoverLifecycleOptions } from '../../../../base/browser/ui/hover/hover.js';

export class FindOptionsWidget extends Widget implements IOverlayWidget {

	private static readonly ID = 'editor.contrib.findOptionsWidget';

	private readonly _editor: ICodeEditor;
	private readonly _state: FindReplaceState;
	private readonly _keybindingService: IKeybindingService;

	private readonly _domNode: HTMLElement;
	private readonly regex: RegexToggle;
	private readonly wholeWords: WholeWordsToggle;
	private readonly caseSensitive: CaseSensitiveToggle;

	constructor(
		editor: ICodeEditor,
		state: FindReplaceState,
		keybindingService: IKeybindingService
	) {
		super();

		this._editor = editor;
		this._state = state;
		this._keybindingService = keybindingService;

		this._domNode = document.createElement('div');
		this._domNode.className = 'findOptionsWidget';
		this._domNode.style.display = 'none';
		this._domNode.style.top = '10px';
		this._domNode.style.zIndex = '12';
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.setAttribute('aria-hidden', 'true');

		const toggleStyles = {
			inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
			inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
			inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground),
		};

		const hoverLifecycleOptions: IHoverLifecycleOptions = { groupId: 'find-options-widget' };

		this.caseSensitive = this._register(new CaseSensitiveToggle({
			appendTitle: this._keybindingLabelFor(FIND_IDS.ToggleCaseSensitiveCommand),
			isChecked: this._state.matchCase,
			hoverLifecycleOptions,
			...toggleStyles
		}));
		this._domNode.appendChild(this.caseSensitive.domNode);
		this._register(this.caseSensitive.onChange(() => {
			this._state.change({
				matchCase: this.caseSensitive.checked
			}, false);
		}));

		this.wholeWords = this._register(new WholeWordsToggle({
			appendTitle: this._keybindingLabelFor(FIND_IDS.ToggleWholeWordCommand),
			isChecked: this._state.wholeWord,
			hoverLifecycleOptions,
			...toggleStyles
		}));
		this._domNode.appendChild(this.wholeWords.domNode);
		this._register(this.wholeWords.onChange(() => {
			this._state.change({
				wholeWord: this.wholeWords.checked
			}, false);
		}));

		this.regex = this._register(new RegexToggle({
			appendTitle: this._keybindingLabelFor(FIND_IDS.ToggleRegexCommand),
			isChecked: this._state.isRegex,
			hoverLifecycleOptions,
			...toggleStyles
		}));
		this._domNode.appendChild(this.regex.domNode);
		this._register(this.regex.onChange(() => {
			this._state.change({
				isRegex: this.regex.checked
			}, false);
		}));

		this._editor.addOverlayWidget(this);

		this._register(this._state.onFindReplaceStateChange((e) => {
			let somethingChanged = false;
			if (e.isRegex) {
				this.regex.checked = this._state.isRegex;
				somethingChanged = true;
			}
			if (e.wholeWord) {
				this.wholeWords.checked = this._state.wholeWord;
				somethingChanged = true;
			}
			if (e.matchCase) {
				this.caseSensitive.checked = this._state.matchCase;
				somethingChanged = true;
			}
			if (!this._state.isRevealed && somethingChanged) {
				this._revealTemporarily();
			}
		}));

		this._register(dom.addDisposableListener(this._domNode, dom.EventType.MOUSE_LEAVE, (e) => this._onMouseLeave()));
		this._register(dom.addDisposableListener(this._domNode, 'mouseover', (e) => this._onMouseOver()));
	}

	private _keybindingLabelFor(actionId: string): string {
		const kb = this._keybindingService.lookupKeybinding(actionId);
		if (!kb) {
			return '';
		}
		return ` (${kb.getLabel()})`;
	}

	public override dispose(): void {
		this._editor.removeOverlayWidget(this);
		super.dispose();
	}

	// ----- IOverlayWidget API

	public getId(): string {
		return FindOptionsWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getPosition(): IOverlayWidgetPosition {
		return {
			preference: OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
		};
	}

	public highlightFindOptions(): void {
		this._revealTemporarily();
	}

	private _hideSoon = this._register(new RunOnceScheduler(() => this._hide(), 2000));

	private _revealTemporarily(): void {
		this._show();
		this._hideSoon.schedule();
	}

	private _onMouseLeave(): void {
		this._hideSoon.schedule();
	}

	private _onMouseOver(): void {
		this._hideSoon.cancel();
	}

	private _isVisible: boolean = false;

	private _show(): void {
		if (this._isVisible) {
			return;
		}
		this._isVisible = true;
		this._domNode.style.display = 'block';
	}

	private _hide(): void {
		if (!this._isVisible) {
			return;
		}
		this._isVisible = false;
		this._domNode.style.display = 'none';
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findState.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Range } from '../../../common/core/range.js';
import { MATCHES_LIMIT } from './findModel.js';

export interface FindReplaceStateChangedEvent {
	moveCursor: boolean;
	updateHistory: boolean;

	searchString: boolean;
	replaceString: boolean;
	isRevealed: boolean;
	isReplaceRevealed: boolean;
	isRegex: boolean;
	wholeWord: boolean;
	matchCase: boolean;
	preserveCase: boolean;
	searchScope: boolean;
	matchesPosition: boolean;
	matchesCount: boolean;
	currentMatch: boolean;
	loop: boolean;
	isSearching: boolean;
	filters: boolean;
}

export const enum FindOptionOverride {
	NotSet = 0,
	True = 1,
	False = 2
}

export interface INewFindReplaceState<T extends { update: (value: T) => void } = { update: () => {} }> {
	searchString?: string;
	replaceString?: string;
	isRevealed?: boolean;
	isReplaceRevealed?: boolean;
	isRegex?: boolean;
	isRegexOverride?: FindOptionOverride;
	wholeWord?: boolean;
	wholeWordOverride?: FindOptionOverride;
	matchCase?: boolean;
	matchCaseOverride?: FindOptionOverride;
	preserveCase?: boolean;
	preserveCaseOverride?: FindOptionOverride;
	searchScope?: Range[] | null;
	loop?: boolean;
	isSearching?: boolean;
	filters?: T;
}

function effectiveOptionValue(override: FindOptionOverride, value: boolean): boolean {
	if (override === FindOptionOverride.True) {
		return true;
	}
	if (override === FindOptionOverride.False) {
		return false;
	}
	return value;
}

export class FindReplaceState<T extends { update: (value: T) => void } = { update: () => {} }> extends Disposable {
	private _searchString: string;
	private _replaceString: string;
	private _isRevealed: boolean;
	private _isReplaceRevealed: boolean;
	private _isRegex: boolean;
	private _isRegexOverride: FindOptionOverride;
	private _wholeWord: boolean;
	private _wholeWordOverride: FindOptionOverride;
	private _matchCase: boolean;
	private _matchCaseOverride: FindOptionOverride;
	private _preserveCase: boolean;
	private _preserveCaseOverride: FindOptionOverride;
	private _searchScope: Range[] | null;
	private _matchesPosition: number;
	private _matchesCount: number;
	private _currentMatch: Range | null;
	private _loop: boolean;
	private _isSearching: boolean;
	private _filters: T | null;
	private readonly _onFindReplaceStateChange = this._register(new Emitter<FindReplaceStateChangedEvent>());

	public get searchString(): string { return this._searchString; }
	public get replaceString(): string { return this._replaceString; }
	public get isRevealed(): boolean { return this._isRevealed; }
	public get isReplaceRevealed(): boolean { return this._isReplaceRevealed; }
	public get isRegex(): boolean { return effectiveOptionValue(this._isRegexOverride, this._isRegex); }
	public get wholeWord(): boolean { return effectiveOptionValue(this._wholeWordOverride, this._wholeWord); }
	public get matchCase(): boolean { return effectiveOptionValue(this._matchCaseOverride, this._matchCase); }
	public get preserveCase(): boolean { return effectiveOptionValue(this._preserveCaseOverride, this._preserveCase); }

	public get actualIsRegex(): boolean { return this._isRegex; }
	public get actualWholeWord(): boolean { return this._wholeWord; }
	public get actualMatchCase(): boolean { return this._matchCase; }
	public get actualPreserveCase(): boolean { return this._preserveCase; }

	public get searchScope(): Range[] | null { return this._searchScope; }
	public get matchesPosition(): number { return this._matchesPosition; }
	public get matchesCount(): number { return this._matchesCount; }
	public get currentMatch(): Range | null { return this._currentMatch; }
	public get isSearching(): boolean { return this._isSearching; }
	public get filters(): T | null { return this._filters; }
	public readonly onFindReplaceStateChange: Event<FindReplaceStateChangedEvent> = this._onFindReplaceStateChange.event;

	constructor() {
		super();
		this._searchString = '';
		this._replaceString = '';
		this._isRevealed = false;
		this._isReplaceRevealed = false;
		this._isRegex = false;
		this._isRegexOverride = FindOptionOverride.NotSet;
		this._wholeWord = false;
		this._wholeWordOverride = FindOptionOverride.NotSet;
		this._matchCase = false;
		this._matchCaseOverride = FindOptionOverride.NotSet;
		this._preserveCase = false;
		this._preserveCaseOverride = FindOptionOverride.NotSet;
		this._searchScope = null;
		this._matchesPosition = 0;
		this._matchesCount = 0;
		this._currentMatch = null;
		this._loop = true;
		this._isSearching = false;
		this._filters = null;
	}

	public changeMatchInfo(matchesPosition: number, matchesCount: number, currentMatch: Range | undefined): void {
		const changeEvent: FindReplaceStateChangedEvent = {
			moveCursor: false,
			updateHistory: false,
			searchString: false,
			replaceString: false,
			isRevealed: false,
			isReplaceRevealed: false,
			isRegex: false,
			wholeWord: false,
			matchCase: false,
			preserveCase: false,
			searchScope: false,
			matchesPosition: false,
			matchesCount: false,
			currentMatch: false,
			loop: false,
			isSearching: false,
			filters: false
		};
		let somethingChanged = false;

		if (matchesCount === 0) {
			matchesPosition = 0;
		}
		if (matchesPosition > matchesCount) {
			matchesPosition = matchesCount;
		}

		if (this._matchesPosition !== matchesPosition) {
			this._matchesPosition = matchesPosition;
			changeEvent.matchesPosition = true;
			somethingChanged = true;
		}
		if (this._matchesCount !== matchesCount) {
			this._matchesCount = matchesCount;
			changeEvent.matchesCount = true;
			somethingChanged = true;
		}

		if (typeof currentMatch !== 'undefined') {
			if (!Range.equalsRange(this._currentMatch, currentMatch)) {
				this._currentMatch = currentMatch;
				changeEvent.currentMatch = true;
				somethingChanged = true;
			}
		}

		if (somethingChanged) {
			this._onFindReplaceStateChange.fire(changeEvent);
		}
	}

	public change(newState: INewFindReplaceState<T>, moveCursor: boolean, updateHistory: boolean = true): void {
		const changeEvent: FindReplaceStateChangedEvent = {
			moveCursor: moveCursor,
			updateHistory: updateHistory,
			searchString: false,
			replaceString: false,
			isRevealed: false,
			isReplaceRevealed: false,
			isRegex: false,
			wholeWord: false,
			matchCase: false,
			preserveCase: false,
			searchScope: false,
			matchesPosition: false,
			matchesCount: false,
			currentMatch: false,
			loop: false,
			isSearching: false,
			filters: false
		};
		let somethingChanged = false;

		const oldEffectiveIsRegex = this.isRegex;
		const oldEffectiveWholeWords = this.wholeWord;
		const oldEffectiveMatchCase = this.matchCase;
		const oldEffectivePreserveCase = this.preserveCase;

		if (typeof newState.searchString !== 'undefined') {
			if (this._searchString !== newState.searchString) {
				this._searchString = newState.searchString;
				changeEvent.searchString = true;
				somethingChanged = true;
			}
		}
		if (typeof newState.replaceString !== 'undefined') {
			if (this._replaceString !== newState.replaceString) {
				this._replaceString = newState.replaceString;
				changeEvent.replaceString = true;
				somethingChanged = true;
			}
		}
		if (typeof newState.isRevealed !== 'undefined') {
			if (this._isRevealed !== newState.isRevealed) {
				this._isRevealed = newState.isRevealed;
				changeEvent.isRevealed = true;
				somethingChanged = true;
			}
		}
		if (typeof newState.isReplaceRevealed !== 'undefined') {
			if (this._isReplaceRevealed !== newState.isReplaceRevealed) {
				this._isReplaceRevealed = newState.isReplaceRevealed;
				changeEvent.isReplaceRevealed = true;
				somethingChanged = true;
			}
		}
		if (typeof newState.isRegex !== 'undefined') {
			this._isRegex = newState.isRegex;
		}
		if (typeof newState.wholeWord !== 'undefined') {
			this._wholeWord = newState.wholeWord;
		}
		if (typeof newState.matchCase !== 'undefined') {
			this._matchCase = newState.matchCase;
		}
		if (typeof newState.preserveCase !== 'undefined') {
			this._preserveCase = newState.preserveCase;
		}
		if (typeof newState.searchScope !== 'undefined') {
			if (!newState.searchScope?.every((newSearchScope) => {
				return this._searchScope?.some(existingSearchScope => {
					return !Range.equalsRange(existingSearchScope, newSearchScope);
				});
			})) {
				this._searchScope = newState.searchScope;
				changeEvent.searchScope = true;
				somethingChanged = true;
			}
		}
		if (typeof newState.loop !== 'undefined') {
			if (this._loop !== newState.loop) {
				this._loop = newState.loop;
				changeEvent.loop = true;
				somethingChanged = true;
			}
		}

		if (typeof newState.isSearching !== 'undefined') {
			if (this._isSearching !== newState.isSearching) {
				this._isSearching = newState.isSearching;
				changeEvent.isSearching = true;
				somethingChanged = true;
			}
		}

		if (typeof newState.filters !== 'undefined') {
			if (this._filters) {
				this._filters.update(newState.filters);
			} else {
				this._filters = newState.filters;
			}

			changeEvent.filters = true;
			somethingChanged = true;
		}

		// Overrides get set when they explicitly come in and get reset anytime something else changes
		this._isRegexOverride = (typeof newState.isRegexOverride !== 'undefined' ? newState.isRegexOverride : FindOptionOverride.NotSet);
		this._wholeWordOverride = (typeof newState.wholeWordOverride !== 'undefined' ? newState.wholeWordOverride : FindOptionOverride.NotSet);
		this._matchCaseOverride = (typeof newState.matchCaseOverride !== 'undefined' ? newState.matchCaseOverride : FindOptionOverride.NotSet);
		this._preserveCaseOverride = (typeof newState.preserveCaseOverride !== 'undefined' ? newState.preserveCaseOverride : FindOptionOverride.NotSet);

		if (oldEffectiveIsRegex !== this.isRegex) {
			somethingChanged = true;
			changeEvent.isRegex = true;
		}
		if (oldEffectiveWholeWords !== this.wholeWord) {
			somethingChanged = true;
			changeEvent.wholeWord = true;
		}
		if (oldEffectiveMatchCase !== this.matchCase) {
			somethingChanged = true;
			changeEvent.matchCase = true;
		}

		if (oldEffectivePreserveCase !== this.preserveCase) {
			somethingChanged = true;
			changeEvent.preserveCase = true;
		}

		if (somethingChanged) {
			this._onFindReplaceStateChange.fire(changeEvent);
		}
	}

	public canNavigateBack(): boolean {
		return this.canNavigateInLoop() || (this.matchesPosition !== 1);
	}

	public canNavigateForward(): boolean {
		return this.canNavigateInLoop() || (this.matchesPosition < this.matchesCount);
	}

	private canNavigateInLoop(): boolean {
		return this._loop || (this.matchesCount >= MATCHES_LIMIT);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findWidget.css]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Find widget */
.monaco-editor .find-widget {
	position: absolute;
	z-index: 35;
	height: 33px;
	overflow: hidden;
	line-height: 19px;
	transition: transform 200ms linear;
	padding: 0 4px;
	box-sizing: border-box;
	transform: translateY(calc(-100% - 10px)); /* shadow (10px) */
	box-shadow: 0 0 8px 2px var(--vscode-widget-shadow);
	color: var(--vscode-editorWidget-foreground);
	border-left: 1px solid var(--vscode-widget-border);
	border-right: 1px solid var(--vscode-widget-border);
	border-bottom: 1px solid var(--vscode-widget-border);
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	background-color: var(--vscode-editorWidget-background);
}

.monaco-reduce-motion .monaco-editor .find-widget {
	transition: transform 0ms linear;
}

.monaco-editor .find-widget textarea {
	margin: 0px;
}

.monaco-editor .find-widget.hiddenEditor {
	display: none;
}

/* Find widget when replace is toggled on */
.monaco-editor .find-widget.replaceToggled > .replace-part {
	display: flex;
}

.monaco-editor .find-widget.visible {
	transform: translateY(0);
}

/* This outline-color rule is used to override the outline color for synthetic-focus find input. */
.monaco-editor .find-widget .monaco-inputbox.synthetic-focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
}

.monaco-editor .find-widget .monaco-inputbox .input {
	background-color: transparent;
	min-height: 0;
}

.monaco-editor .find-widget .monaco-findInput .input {
	font-size: 13px;
}

.monaco-editor .find-widget > .find-part,
.monaco-editor .find-widget > .replace-part {
	margin: 3px 25px 0 17px;
	font-size: 12px;
	display: flex;
}

.monaco-editor .find-widget > .find-part .monaco-inputbox,
.monaco-editor .find-widget > .replace-part .monaco-inputbox {
	min-height: 25px;
}


.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .mirror {
	padding-right: 22px;
}

.monaco-editor .find-widget > .find-part .monaco-inputbox > .ibwrapper > .input,
.monaco-editor .find-widget > .find-part .monaco-inputbox > .ibwrapper > .mirror,
.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .input,
.monaco-editor .find-widget > .replace-part .monaco-inputbox > .ibwrapper > .mirror {
	padding-top: 2px;
	padding-bottom: 2px;
}

.monaco-editor .find-widget > .find-part .find-actions {
	height: 25px;
	display: flex;
	align-items: center;
}

.monaco-editor .find-widget > .replace-part .replace-actions {
	height: 25px;
	display: flex;
	align-items: center;
}

.monaco-editor .find-widget .monaco-findInput {
	vertical-align: middle;
	display: flex;
	flex: 1;
}

.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element {
	/* Make sure textarea inherits the width correctly */
	width: 100%;
}

.monaco-editor .find-widget .monaco-findInput .monaco-scrollable-element .scrollbar.vertical {
	/* Hide vertical scrollbar */
	opacity: 0;
}

.monaco-editor .find-widget .matchesCount {
	display: flex;
	flex: initial;
	margin: 0 0 0 3px;
	padding: 2px 0 0 2px;
	height: 25px;
	vertical-align: middle;
	box-sizing: border-box;
	text-align: center;
	line-height: 23px;
}

.monaco-editor .find-widget .button {
	width: 16px;
	height: 16px;
	padding: 3px;
	border-radius: 5px;
	display: flex;
	flex: initial;
	margin-left: 3px;
	background-position: center center;
	background-repeat: no-repeat;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* find in selection button */
.monaco-editor .find-widget .codicon-find-selection {
	width: 22px;
	height: 22px;
	padding: 3px;
	border-radius: 5px;
}

.monaco-editor .find-widget .button.left {
	margin-left: 0;
	margin-right: 3px;
}

.monaco-editor .find-widget .button.wide {
	width: auto;
	padding: 1px 6px;
	top: -1px;
}

.monaco-editor .find-widget .button.toggle {
	position: absolute;
	top: 0;
	left: 3px;
	width: 18px;
	height: 100%;
	border-radius: 0;
	box-sizing: border-box;
}

.monaco-editor .find-widget .button.toggle.disabled {
	display: none;
}

.monaco-editor .find-widget .disabled {
	color: var(--vscode-disabledForeground);
	cursor: default;
}

.monaco-editor .find-widget > .replace-part {
	display: none;
}

.monaco-editor .find-widget > .replace-part > .monaco-findInput {
	position: relative;
	display: flex;
	vertical-align: middle;
	flex: auto;
	flex-grow: 0;
	flex-shrink: 0;
}

.monaco-editor .find-widget > .replace-part > .monaco-findInput > .controls {
	position: absolute;
	top: 3px;
	right: 2px;
}

/* REDUCED */
.monaco-editor .find-widget.reduced-find-widget .matchesCount {
	display: none;
}

/* NARROW (SMALLER THAN REDUCED) */
.monaco-editor .find-widget.narrow-find-widget {
	max-width: 257px !important;
}

/* COLLAPSED (SMALLER THAN NARROW) */
.monaco-editor .find-widget.collapsed-find-widget {
	max-width: 170px !important;
}

.monaco-editor .find-widget.collapsed-find-widget .button.previous,
.monaco-editor .find-widget.collapsed-find-widget .button.next,
.monaco-editor .find-widget.collapsed-find-widget .button.replace,
.monaco-editor .find-widget.collapsed-find-widget .button.replace-all,
.monaco-editor .find-widget.collapsed-find-widget > .find-part .monaco-findInput .controls {
	display: none;
}

.monaco-editor .find-widget.no-results .matchesCount {
	color: var(--vscode-errorForeground);
}

.monaco-editor .findMatch {
	animation-duration: 0;
	animation-name: inherit !important;
	background-color: var(--vscode-editor-findMatchHighlightBackground);
}

.monaco-editor .currentFindMatch {
	background-color: var(--vscode-editor-findMatchBackground);
	border: 2px solid var(--vscode-editor-findMatchBorder);
	padding: 1px;
	box-sizing: border-box;
}

.monaco-editor .findScope {
	background-color: var(--vscode-editor-findRangeHighlightBackground);
}

.monaco-editor .find-widget .monaco-sash {
	left: 0 !important;
	background-color: var(--vscode-editorWidget-resizeBorder, var(--vscode-editorWidget-border));
}

.monaco-editor.hc-black .find-widget .button:before {
	position: relative;
	top: 1px;
	left: 2px;
}

/* Action bars */
.monaco-editor .find-widget .button:not(.disabled):hover,
.monaco-editor .find-widget .codicon-find-selection:hover {
	background-color: var(--vscode-toolbar-hoverBackground) !important;
}

.monaco-editor.findMatch {
	background-color: var(--vscode-editor-findMatchHighlightBackground);
}

.monaco-editor.currentFindMatch {
	background-color: var(--vscode-editor-findMatchBackground);
}

.monaco-editor.findScope {
	background-color: var(--vscode-editor-findRangeHighlightBackground);
}

.monaco-editor.findMatch {
	background-color: var(--vscode-editorWidget-background);
}

/* Close button position. */
.monaco-editor .find-widget > .button.codicon-widget-close {
	position: absolute;
	top: 5px;
	right: 4px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { IMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { alert as alertFn } from '../../../../base/browser/ui/aria/aria.js';
import { Toggle } from '../../../../base/browser/ui/toggle/toggle.js';
import { IContextViewProvider } from '../../../../base/browser/ui/contextview/contextview.js';
import { FindInput } from '../../../../base/browser/ui/findinput/findInput.js';
import { ReplaceInput } from '../../../../base/browser/ui/findinput/replaceInput.js';
import { IMessage as InputBoxMessage } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { ISashEvent, IVerticalSashLayoutProvider, Orientation, Sash } from '../../../../base/browser/ui/sash/sash.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Delayer } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import * as platform from '../../../../base/common/platform.js';
import * as strings from '../../../../base/common/strings.js';
import './findWidget.css';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, IViewZone, OverlayWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { CONTEXT_FIND_INPUT_FOCUSED, CONTEXT_REPLACE_INPUT_FOCUSED, FIND_IDS, MATCHES_LIMIT } from './findModel.js';
import { FindReplaceState, FindReplaceStateChangedEvent } from './findState.js';
import * as nls from '../../../../nls.js';
import { AccessibilitySupport } from '../../../../platform/accessibility/common/accessibility.js';
import { ContextScopedFindInput, ContextScopedReplaceInput } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { showHistoryKeybindingHint } from '../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { asCssVariable, contrastBorder, editorFindMatchForeground, editorFindMatchHighlightBorder, editorFindMatchHighlightForeground, editorFindRangeHighlightBorder, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon, widgetClose } from '../../../../platform/theme/common/iconRegistry.js';
import { registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { defaultInputBoxStyles, defaultToggleStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { Selection } from '../../../common/core/selection.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IHistory } from '../../../../base/common/history.js';
import { HoverStyle, type IHoverLifecycleOptions } from '../../../../base/browser/ui/hover/hover.js';

const findCollapsedIcon = registerIcon('find-collapsed', Codicon.chevronRight, nls.localize('findCollapsedIcon', 'Icon to indicate that the editor find widget is collapsed.'));
const findExpandedIcon = registerIcon('find-expanded', Codicon.chevronDown, nls.localize('findExpandedIcon', 'Icon to indicate that the editor find widget is expanded.'));

export const findSelectionIcon = registerIcon('find-selection', Codicon.selection, nls.localize('findSelectionIcon', 'Icon for \'Find in Selection\' in the editor find widget.'));
export const findReplaceIcon = registerIcon('find-replace', Codicon.replace, nls.localize('findReplaceIcon', 'Icon for \'Replace\' in the editor find widget.'));
export const findReplaceAllIcon = registerIcon('find-replace-all', Codicon.replaceAll, nls.localize('findReplaceAllIcon', 'Icon for \'Replace All\' in the editor find widget.'));
export const findPreviousMatchIcon = registerIcon('find-previous-match', Codicon.arrowUp, nls.localize('findPreviousMatchIcon', 'Icon for \'Find Previous\' in the editor find widget.'));
export const findNextMatchIcon = registerIcon('find-next-match', Codicon.arrowDown, nls.localize('findNextMatchIcon', 'Icon for \'Find Next\' in the editor find widget.'));

export interface IFindController {
	replace(): void;
	replaceAll(): void;
	getGlobalBufferTerm(): Promise<string>;
}

const NLS_FIND_DIALOG_LABEL = nls.localize('label.findDialog', "Find / Replace");
const NLS_FIND_INPUT_LABEL = nls.localize('label.find', "Find");
const NLS_FIND_INPUT_PLACEHOLDER = nls.localize('placeholder.find', "Find");
const NLS_PREVIOUS_MATCH_BTN_LABEL = nls.localize('label.previousMatchButton', "Previous Match");
const NLS_NEXT_MATCH_BTN_LABEL = nls.localize('label.nextMatchButton', "Next Match");
const NLS_TOGGLE_SELECTION_FIND_TITLE = nls.localize('label.toggleSelectionFind', "Find in Selection");
const NLS_CLOSE_BTN_LABEL = nls.localize('label.closeButton', "Close");
const NLS_REPLACE_INPUT_LABEL = nls.localize('label.replace', "Replace");
const NLS_REPLACE_INPUT_PLACEHOLDER = nls.localize('placeholder.replace', "Replace");
const NLS_REPLACE_BTN_LABEL = nls.localize('label.replaceButton', "Replace");
const NLS_REPLACE_ALL_BTN_LABEL = nls.localize('label.replaceAllButton', "Replace All");
const NLS_TOGGLE_REPLACE_MODE_BTN_LABEL = nls.localize('label.toggleReplaceButton', "Toggle Replace");
const NLS_MATCHES_COUNT_LIMIT_TITLE = nls.localize('title.matchesCountLimit', "Only the first {0} results are highlighted, but all find operations work on the entire text.", MATCHES_LIMIT);
export const NLS_MATCHES_LOCATION = nls.localize('label.matchesLocation', "{0} of {1}");
export const NLS_NO_RESULTS = nls.localize('label.noResults', "No results");

const FIND_WIDGET_INITIAL_WIDTH = 419;
const PART_WIDTH = 275;
const FIND_INPUT_AREA_WIDTH = PART_WIDTH - 54;

let MAX_MATCHES_COUNT_WIDTH = 69;
// let FIND_ALL_CONTROLS_WIDTH = 17/** Find Input margin-left */ + (MAX_MATCHES_COUNT_WIDTH + 3 + 1) /** Match Results */ + 23 /** Button */ * 4 + 2/** sash */;

const FIND_INPUT_AREA_HEIGHT = 33; // The height of Find Widget when Replace Input is not visible.

const ctrlKeyMod = (platform.isMacintosh ? KeyMod.WinCtrl : KeyMod.CtrlCmd);
export class FindWidgetViewZone implements IViewZone {
	public readonly afterLineNumber: number;
	public heightInPx: number;
	public readonly suppressMouseDown: boolean;
	public readonly domNode: HTMLElement;

	constructor(afterLineNumber: number) {
		this.afterLineNumber = afterLineNumber;

		this.heightInPx = FIND_INPUT_AREA_HEIGHT;
		this.suppressMouseDown = false;
		this.domNode = document.createElement('div');
		this.domNode.className = 'dock-find-viewzone';
	}
}

function stopPropagationForMultiLineUpwards(event: IKeyboardEvent, value: string, textarea: HTMLTextAreaElement | null) {
	const isMultiline = !!value.match(/\n/);
	if (textarea && isMultiline && textarea.selectionStart > 0) {
		event.stopPropagation();
		return;
	}
}

function stopPropagationForMultiLineDownwards(event: IKeyboardEvent, value: string, textarea: HTMLTextAreaElement | null) {
	const isMultiline = !!value.match(/\n/);
	if (textarea && isMultiline && textarea.selectionEnd < textarea.value.length) {
		event.stopPropagation();
		return;
	}
}

export class FindWidget extends Widget implements IOverlayWidget, IVerticalSashLayoutProvider {
	private static readonly ID = 'editor.contrib.findWidget';
	private readonly _codeEditor: ICodeEditor;
	private readonly _state: FindReplaceState;
	private readonly _controller: IFindController;
	private readonly _contextViewProvider: IContextViewProvider;
	private readonly _keybindingService: IKeybindingService;
	private readonly _contextKeyService: IContextKeyService;

	private _domNode!: HTMLElement;
	private _cachedHeight: number | null = null;
	private _findInput!: FindInput;
	private _replaceInput!: ReplaceInput;

	private _toggleReplaceBtn!: SimpleButton;
	private _matchesCount!: HTMLElement;
	private _prevBtn!: SimpleButton;
	private _nextBtn!: SimpleButton;
	private _toggleSelectionFind!: Toggle;
	private _closeBtn!: SimpleButton;
	private _replaceBtn!: SimpleButton;
	private _replaceAllBtn!: SimpleButton;

	private _isVisible: boolean;
	private _isReplaceVisible: boolean;
	private _ignoreChangeEvent: boolean;

	private readonly _findFocusTracker: dom.IFocusTracker;
	private readonly _findInputFocused: IContextKey<boolean>;
	private readonly _replaceFocusTracker: dom.IFocusTracker;
	private readonly _replaceInputFocused: IContextKey<boolean>;
	private _viewZone?: FindWidgetViewZone;
	private _viewZoneId?: string;

	private _resizeSash!: Sash;
	private _resized!: boolean;
	private readonly _updateHistoryDelayer: Delayer<void>;

	constructor(
		codeEditor: ICodeEditor,
		controller: IFindController,
		state: FindReplaceState,
		contextViewProvider: IContextViewProvider,
		keybindingService: IKeybindingService,
		contextKeyService: IContextKeyService,
		private readonly _hoverService: IHoverService,
		private readonly _findWidgetSearchHistory: IHistory<string> | undefined,
		private readonly _replaceWidgetHistory: IHistory<string> | undefined,
	) {
		super();
		this._codeEditor = codeEditor;
		this._controller = controller;
		this._state = state;
		this._contextViewProvider = contextViewProvider;
		this._keybindingService = keybindingService;
		this._contextKeyService = contextKeyService;

		this._isVisible = false;
		this._isReplaceVisible = false;
		this._ignoreChangeEvent = false;

		this._updateHistoryDelayer = new Delayer<void>(500);
		this._register(toDisposable(() => this._updateHistoryDelayer.cancel()));
		this._register(this._state.onFindReplaceStateChange((e) => this._onStateChanged(e)));
		this._buildDomNode();
		this._updateButtons();
		this._tryUpdateWidgetWidth();
		this._findInput.inputBox.layout();

		this._register(this._codeEditor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.readOnly)) {
				if (this._codeEditor.getOption(EditorOption.readOnly)) {
					// Hide replace part if editor becomes read only
					this._state.change({ isReplaceRevealed: false }, false);
				}
				this._updateButtons();
			}
			if (e.hasChanged(EditorOption.layoutInfo)) {
				this._tryUpdateWidgetWidth();
			}

			if (e.hasChanged(EditorOption.accessibilitySupport)) {
				this.updateAccessibilitySupport();
			}

			if (e.hasChanged(EditorOption.find)) {
				const supportLoop = this._codeEditor.getOption(EditorOption.find).loop;
				this._state.change({ loop: supportLoop }, false);
				const addExtraSpaceOnTop = this._codeEditor.getOption(EditorOption.find).addExtraSpaceOnTop;
				if (addExtraSpaceOnTop && !this._viewZone) {
					this._viewZone = new FindWidgetViewZone(0);
					this._showViewZone();
				}
				if (!addExtraSpaceOnTop && this._viewZone) {
					this._removeViewZone();
				}
			}
		}));
		this.updateAccessibilitySupport();
		this._register(this._codeEditor.onDidChangeCursorSelection(() => {
			if (this._isVisible) {
				this._updateToggleSelectionFindButton();
			}
		}));
		this._register(this._codeEditor.onDidFocusEditorWidget(async () => {
			if (this._isVisible) {
				const globalBufferTerm = await this._controller.getGlobalBufferTerm();
				if (globalBufferTerm && globalBufferTerm !== this._state.searchString) {
					this._state.change({ searchString: globalBufferTerm }, false);
					this._findInput.select();
				}
			}
		}));
		this._findInputFocused = CONTEXT_FIND_INPUT_FOCUSED.bindTo(contextKeyService);
		this._findFocusTracker = this._register(dom.trackFocus(this._findInput.inputBox.inputElement));
		this._register(this._findFocusTracker.onDidFocus(() => {
			this._findInputFocused.set(true);
			this._updateSearchScope();
		}));
		this._register(this._findFocusTracker.onDidBlur(() => {
			this._findInputFocused.set(false);
		}));

		this._replaceInputFocused = CONTEXT_REPLACE_INPUT_FOCUSED.bindTo(contextKeyService);
		this._replaceFocusTracker = this._register(dom.trackFocus(this._replaceInput.inputBox.inputElement));
		this._register(this._replaceFocusTracker.onDidFocus(() => {
			this._replaceInputFocused.set(true);
			this._updateSearchScope();
		}));
		this._register(this._replaceFocusTracker.onDidBlur(() => {
			this._replaceInputFocused.set(false);
		}));

		this._codeEditor.addOverlayWidget(this);
		if (this._codeEditor.getOption(EditorOption.find).addExtraSpaceOnTop) {
			this._viewZone = new FindWidgetViewZone(0); // Put it before the first line then users can scroll beyond the first line.
		}

		this._register(this._codeEditor.onDidChangeModel(() => {
			if (!this._isVisible) {
				return;
			}
			this._viewZoneId = undefined;
		}));


		this._register(this._codeEditor.onDidScrollChange((e) => {
			if (e.scrollTopChanged) {
				this._layoutViewZone();
				return;
			}

			// for other scroll changes, layout the viewzone in next tick to avoid ruining current rendering.
			setTimeout(() => {
				this._layoutViewZone();
			}, 0);
		}));
	}

	// ----- IOverlayWidget API

	public getId(): string {
		return FindWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getPosition(): IOverlayWidgetPosition | null {
		if (this._isVisible) {
			return {
				preference: OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
			};
		}
		return null;
	}

	// ----- React to state changes

	private _onStateChanged(e: FindReplaceStateChangedEvent): void {
		if (e.searchString) {
			try {
				this._ignoreChangeEvent = true;
				this._findInput.setValue(this._state.searchString);
			} finally {
				this._ignoreChangeEvent = false;
			}
			this._updateButtons();
		}
		if (e.replaceString) {
			this._replaceInput.inputBox.value = this._state.replaceString;
		}
		if (e.isRevealed) {
			if (this._state.isRevealed) {
				this._reveal();
			} else {
				this._hide(true);
			}
		}
		if (e.isReplaceRevealed) {
			if (this._state.isReplaceRevealed) {
				if (!this._codeEditor.getOption(EditorOption.readOnly) && !this._isReplaceVisible) {
					this._isReplaceVisible = true;
					this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
					this._updateButtons();
					this._replaceInput.inputBox.layout();
				}
			} else {
				if (this._isReplaceVisible) {
					this._isReplaceVisible = false;
					this._updateButtons();
				}
			}
		}
		if ((e.isRevealed || e.isReplaceRevealed) && (this._state.isRevealed || this._state.isReplaceRevealed)) {
			if (this._tryUpdateHeight()) {
				this._showViewZone();
			}
		}

		if (e.isRegex) {
			this._findInput.setRegex(this._state.isRegex);
		}
		if (e.wholeWord) {
			this._findInput.setWholeWords(this._state.wholeWord);
		}
		if (e.matchCase) {
			this._findInput.setCaseSensitive(this._state.matchCase);
		}
		if (e.preserveCase) {
			this._replaceInput.setPreserveCase(this._state.preserveCase);
		}
		if (e.searchScope) {
			if (this._state.searchScope) {
				this._toggleSelectionFind.checked = true;
			} else {
				this._toggleSelectionFind.checked = false;
			}
			this._updateToggleSelectionFindButton();
		}
		if (e.searchString || e.matchesCount || e.matchesPosition) {
			const showRedOutline = (this._state.searchString.length > 0 && this._state.matchesCount === 0);
			this._domNode.classList.toggle('no-results', showRedOutline);

			this._updateMatchesCount();
			this._updateButtons();
		}
		if (e.searchString || e.currentMatch) {
			this._layoutViewZone();
		}
		if (e.updateHistory) {
			this._delayedUpdateHistory();
		}
		if (e.loop) {
			this._updateButtons();
		}
	}

	private _delayedUpdateHistory() {
		this._updateHistoryDelayer.trigger(this._updateHistory.bind(this)).then(undefined, onUnexpectedError);
	}

	private _updateHistory() {
		if (this._state.searchString) {
			this._findInput.inputBox.addToHistory();
		}
		if (this._state.replaceString) {
			this._replaceInput.inputBox.addToHistory();
		}
	}

	private _updateMatchesCount(): void {
		this._matchesCount.style.minWidth = MAX_MATCHES_COUNT_WIDTH + 'px';
		if (this._state.matchesCount >= MATCHES_LIMIT) {
			this._matchesCount.title = NLS_MATCHES_COUNT_LIMIT_TITLE;
		} else {
			this._matchesCount.title = '';
		}

		// remove previous content
		this._matchesCount.firstChild?.remove();

		let label: string;
		if (this._state.matchesCount > 0) {
			let matchesCount: string = String(this._state.matchesCount);
			if (this._state.matchesCount >= MATCHES_LIMIT) {
				matchesCount += '+';
			}
			let matchesPosition: string = String(this._state.matchesPosition);
			if (matchesPosition === '0') {
				matchesPosition = '?';
			}
			label = strings.format(NLS_MATCHES_LOCATION, matchesPosition, matchesCount);
		} else {
			label = NLS_NO_RESULTS;
		}

		this._matchesCount.appendChild(document.createTextNode(label));

		alertFn(this._getAriaLabel(label, this._state.currentMatch, this._state.searchString));
		MAX_MATCHES_COUNT_WIDTH = Math.max(MAX_MATCHES_COUNT_WIDTH, this._matchesCount.clientWidth);
	}

	// ----- actions

	private _getAriaLabel(label: string, currentMatch: Range | null, searchString: string): string {
		if (label === NLS_NO_RESULTS) {
			return searchString === ''
				? nls.localize('ariaSearchNoResultEmpty', "{0} found", label)
				: nls.localize('ariaSearchNoResult', "{0} found for '{1}'", label, searchString);
		}
		if (currentMatch) {
			const ariaLabel = nls.localize('ariaSearchNoResultWithLineNum', "{0} found for '{1}', at {2}", label, searchString, currentMatch.startLineNumber + ':' + currentMatch.startColumn);
			const model = this._codeEditor.getModel();
			if (model && (currentMatch.startLineNumber <= model.getLineCount()) && (currentMatch.startLineNumber >= 1)) {
				const lineContent = model.getLineContent(currentMatch.startLineNumber);
				return `${lineContent}, ${ariaLabel}`;
			}

			return ariaLabel;
		}

		return nls.localize('ariaSearchNoResultWithLineNumNoCurrentMatch', "{0} found for '{1}'", label, searchString);
	}

	/**
	 * If 'selection find' is ON we should not disable the button (its function is to cancel 'selection find').
	 * If 'selection find' is OFF we enable the button only if there is a selection.
	 */
	private _updateToggleSelectionFindButton(): void {
		const selection = this._codeEditor.getSelection();
		const isSelection = selection ? (selection.startLineNumber !== selection.endLineNumber || selection.startColumn !== selection.endColumn) : false;
		const isChecked = this._toggleSelectionFind.checked;

		if (this._isVisible && (isChecked || isSelection)) {
			this._toggleSelectionFind.enable();
		} else {
			this._toggleSelectionFind.disable();
		}
	}

	private _updateButtons(): void {
		this._findInput.setEnabled(this._isVisible);
		this._replaceInput.setEnabled(this._isVisible && this._isReplaceVisible);
		this._updateToggleSelectionFindButton();
		this._closeBtn.setEnabled(this._isVisible);

		const findInputIsNonEmpty = (this._state.searchString.length > 0);
		const matchesCount = this._state.matchesCount ? true : false;
		this._prevBtn.setEnabled(this._isVisible && findInputIsNonEmpty && matchesCount && this._state.canNavigateBack());
		this._nextBtn.setEnabled(this._isVisible && findInputIsNonEmpty && matchesCount && this._state.canNavigateForward());
		this._replaceBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);
		this._replaceAllBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);

		this._domNode.classList.toggle('replaceToggled', this._isReplaceVisible);
		this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);

		const canReplace = !this._codeEditor.getOption(EditorOption.readOnly);
		this._toggleReplaceBtn.setEnabled(this._isVisible && canReplace);
	}

	private _revealTimeouts: Timeout[] = [];

	private _reveal(): void {
		this._revealTimeouts.forEach(e => {
			clearTimeout(e);
		});

		this._revealTimeouts = [];

		if (!this._isVisible) {
			this._isVisible = true;

			const selection = this._codeEditor.getSelection();

			switch (this._codeEditor.getOption(EditorOption.find).autoFindInSelection) {
				case 'always':
					this._toggleSelectionFind.checked = true;
					break;
				case 'never':
					this._toggleSelectionFind.checked = false;
					break;
				case 'multiline': {
					const isSelectionMultipleLine = !!selection && selection.startLineNumber !== selection.endLineNumber;
					this._toggleSelectionFind.checked = isSelectionMultipleLine;
					break;
				}
				default:
					break;
			}

			this._tryUpdateWidgetWidth();
			this._updateButtons();

			this._revealTimeouts.push(setTimeout(() => {
				this._domNode.classList.add('visible');
				this._domNode.setAttribute('aria-hidden', 'false');
			}, 0));

			// validate query again as it's being dismissed when we hide the find widget.
			this._revealTimeouts.push(setTimeout(() => {
				this._findInput.validate();
			}, 200));

			this._codeEditor.layoutOverlayWidget(this);

			let adjustEditorScrollTop = true;
			if (this._codeEditor.getOption(EditorOption.find).seedSearchStringFromSelection && selection) {
				const domNode = this._codeEditor.getDomNode();
				if (domNode) {
					const editorCoords = dom.getDomNodePagePosition(domNode);
					const startCoords = this._codeEditor.getScrolledVisiblePosition(selection.getStartPosition());
					const startLeft = editorCoords.left + (startCoords ? startCoords.left : 0);
					const startTop = startCoords ? startCoords.top : 0;

					if (this._viewZone && startTop < this._viewZone.heightInPx) {
						if (selection.endLineNumber > selection.startLineNumber) {
							adjustEditorScrollTop = false;
						}

						const leftOfFindWidget = dom.getTopLeftOffset(this._domNode).left;
						if (startLeft > leftOfFindWidget) {
							adjustEditorScrollTop = false;
						}
						const endCoords = this._codeEditor.getScrolledVisiblePosition(selection.getEndPosition());
						const endLeft = editorCoords.left + (endCoords ? endCoords.left : 0);
						if (endLeft > leftOfFindWidget) {
							adjustEditorScrollTop = false;
						}
					}
				}
			}
			this._showViewZone(adjustEditorScrollTop);
		}
	}

	private _hide(focusTheEditor: boolean): void {
		this._revealTimeouts.forEach(e => {
			clearTimeout(e);
		});

		this._revealTimeouts = [];

		if (this._isVisible) {
			this._isVisible = false;

			this._updateButtons();

			this._domNode.classList.remove('visible');
			this._domNode.setAttribute('aria-hidden', 'true');
			this._findInput.clearMessage();
			if (focusTheEditor) {
				this._codeEditor.focus();
			}
			this._codeEditor.layoutOverlayWidget(this);
			this._removeViewZone();
		}
	}

	private _layoutViewZone(targetScrollTop?: number) {
		const addExtraSpaceOnTop = this._codeEditor.getOption(EditorOption.find).addExtraSpaceOnTop;

		if (!addExtraSpaceOnTop) {
			this._removeViewZone();
			return;
		}

		if (!this._isVisible) {
			return;
		}
		const viewZone = this._viewZone;
		if (this._viewZoneId !== undefined || !viewZone) {
			return;
		}

		this._codeEditor.changeViewZones((accessor) => {
			viewZone.heightInPx = this._getHeight();
			this._viewZoneId = accessor.addZone(viewZone);
			// scroll top adjust to make sure the editor doesn't scroll when adding viewzone at the beginning.
			this._codeEditor.setScrollTop(targetScrollTop || this._codeEditor.getScrollTop() + viewZone.heightInPx);
		});
	}

	private _showViewZone(adjustScroll: boolean = true) {
		if (!this._isVisible) {
			return;
		}

		const addExtraSpaceOnTop = this._codeEditor.getOption(EditorOption.find).addExtraSpaceOnTop;

		if (!addExtraSpaceOnTop) {
			return;
		}

		if (this._viewZone === undefined) {
			this._viewZone = new FindWidgetViewZone(0);
		}

		const viewZone = this._viewZone;

		this._codeEditor.changeViewZones((accessor) => {
			if (this._viewZoneId !== undefined) {
				// the view zone already exists, we need to update the height
				const newHeight = this._getHeight();
				if (newHeight === viewZone.heightInPx) {
					return;
				}

				const scrollAdjustment = newHeight - viewZone.heightInPx;
				viewZone.heightInPx = newHeight;
				accessor.layoutZone(this._viewZoneId);

				if (adjustScroll) {
					this._codeEditor.setScrollTop(this._codeEditor.getScrollTop() + scrollAdjustment);
				}

				return;
			} else {
				let scrollAdjustment = this._getHeight();

				// if the editor has top padding, factor that into the zone height
				scrollAdjustment -= this._codeEditor.getOption(EditorOption.padding).top;
				if (scrollAdjustment <= 0) {
					return;
				}

				viewZone.heightInPx = scrollAdjustment;
				this._viewZoneId = accessor.addZone(viewZone);

				if (adjustScroll) {
					this._codeEditor.setScrollTop(this._codeEditor.getScrollTop() + scrollAdjustment);
				}
			}
		});
	}

	private _removeViewZone() {
		this._codeEditor.changeViewZones((accessor) => {
			if (this._viewZoneId !== undefined) {
				accessor.removeZone(this._viewZoneId);
				this._viewZoneId = undefined;
				if (this._viewZone) {
					this._codeEditor.setScrollTop(this._codeEditor.getScrollTop() - this._viewZone.heightInPx);
					this._viewZone = undefined;
				}
			}
		});
	}

	private _tryUpdateWidgetWidth() {
		if (!this._isVisible) {
			return;
		}
		if (!this._domNode.isConnected) {
			// the widget is not in the DOM
			return;
		}

		const layoutInfo = this._codeEditor.getLayoutInfo();
		const editorContentWidth = layoutInfo.contentWidth;

		if (editorContentWidth <= 0) {
			// for example, diff view original editor
			this._domNode.classList.add('hiddenEditor');
			return;
		} else if (this._domNode.classList.contains('hiddenEditor')) {
			this._domNode.classList.remove('hiddenEditor');
		}

		const editorWidth = layoutInfo.width;
		const minimapWidth = layoutInfo.minimap.minimapWidth;
		let collapsedFindWidget = false;
		let reducedFindWidget = false;
		let narrowFindWidget = false;

		if (this._resized) {
			const widgetWidth = dom.getTotalWidth(this._domNode);

			if (widgetWidth > FIND_WIDGET_INITIAL_WIDTH) {
				// as the widget is resized by users, we may need to change the max width of the widget as the editor width changes.
				this._domNode.style.maxWidth = `${editorWidth - 28 - minimapWidth - 15}px`;
				this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
				return;
			}
		}

		if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth >= editorWidth) {
			reducedFindWidget = true;
		}
		if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth - MAX_MATCHES_COUNT_WIDTH >= editorWidth) {
			narrowFindWidget = true;
		}
		if (FIND_WIDGET_INITIAL_WIDTH + 28 + minimapWidth - MAX_MATCHES_COUNT_WIDTH >= editorWidth + 50) {
			collapsedFindWidget = true;
		}
		this._domNode.classList.toggle('collapsed-find-widget', collapsedFindWidget);
		this._domNode.classList.toggle('narrow-find-widget', narrowFindWidget);
		this._domNode.classList.toggle('reduced-find-widget', reducedFindWidget);

		if (!narrowFindWidget && !collapsedFindWidget) {
			// the minimal left offset of findwidget is 15px.
			this._domNode.style.maxWidth = `${editorWidth - 28 - minimapWidth - 15}px`;
		}

		this._findInput.layout({ collapsedFindWidget, narrowFindWidget, reducedFindWidget });
		if (this._resized) {
			const findInputWidth = this._findInput.inputBox.element.clientWidth;
			if (findInputWidth > 0) {
				this._replaceInput.width = findInputWidth;
			}
		} else if (this._isReplaceVisible) {
			this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
		}
	}

	private _getHeight(): number {
		let totalheight = 0;

		// find input margin top
		totalheight += 4;

		// find input height
		totalheight += this._findInput.inputBox.height + 2 /** input box border */;

		if (this._isReplaceVisible) {
			// replace input margin
			totalheight += 4;

			totalheight += this._replaceInput.inputBox.height + 2 /** input box border */;
		}

		// margin bottom
		totalheight += 4;
		return totalheight;
	}

	private _tryUpdateHeight(): boolean {
		const totalHeight = this._getHeight();
		if (this._cachedHeight !== null && this._cachedHeight === totalHeight) {
			return false;
		}

		this._cachedHeight = totalHeight;
		this._domNode.style.height = `${totalHeight}px`;

		return true;
	}

	// ----- Public

	public focusFindInput(): void {
		this._findInput.select();
		// Edge browser requires focus() in addition to select()
		this._findInput.focus();
	}

	public focusReplaceInput(): void {
		this._replaceInput.select();
		// Edge browser requires focus() in addition to select()
		this._replaceInput.focus();
	}

	public highlightFindOptions(): void {
		this._findInput.highlightFindOptions();
	}

	private _updateSearchScope(): void {
		if (!this._codeEditor.hasModel()) {
			return;
		}

		if (this._toggleSelectionFind.checked) {
			const selections = this._codeEditor.getSelections();

			selections.map(selection => {
				if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
					selection = selection.setEndPosition(
						selection.endLineNumber - 1,
						this._codeEditor.getModel()!.getLineMaxColumn(selection.endLineNumber - 1)
					);
				}
				const currentMatch = this._state.currentMatch;
				if (selection.startLineNumber !== selection.endLineNumber) {
					if (!Range.equalsRange(selection, currentMatch)) {
						return selection;
					}
				}
				return null;
			}).filter(element => !!element);

			if (selections.length) {
				this._state.change({ searchScope: selections as Range[] }, true);
			}
		}
	}

	private _onFindInputMouseDown(e: IMouseEvent): void {
		// on linux, middle key does pasting.
		if (e.middleButton) {
			e.stopPropagation();
		}
	}

	private _onFindInputKeyDown(e: IKeyboardEvent): void {
		if (e.equals(ctrlKeyMod | KeyCode.Enter)) {
			if (this._keybindingService.dispatchEvent(e, e.target)) {
				e.preventDefault();
				return;
			} else {
				this._findInput.inputBox.insertAtCursor('\n');
				e.preventDefault();
				return;
			}
		}

		if (e.equals(KeyCode.Tab)) {
			if (this._isReplaceVisible) {
				this._replaceInput.focus();
			} else {
				this._findInput.focusOnCaseSensitive();
			}
			e.preventDefault();
			return;
		}

		if (e.equals(KeyMod.CtrlCmd | KeyCode.DownArrow)) {
			this._codeEditor.focus();
			e.preventDefault();
			return;
		}

		if (e.equals(KeyCode.UpArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			return stopPropagationForMultiLineUpwards(e, this._findInput.getValue(), this._findInput.domNode.querySelector('textarea'));
		}

		if (e.equals(KeyCode.DownArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			return stopPropagationForMultiLineDownwards(e, this._findInput.getValue(), this._findInput.domNode.querySelector('textarea'));
		}
	}

	private _onReplaceInputKeyDown(e: IKeyboardEvent): void {
		if (e.equals(ctrlKeyMod | KeyCode.Enter)) {
			if (this._keybindingService.dispatchEvent(e, e.target)) {
				e.preventDefault();
				return;
			} else {
				this._replaceInput.inputBox.insertAtCursor('\n');
				e.preventDefault();
				return;
			}

		}

		if (e.equals(KeyCode.Tab)) {
			this._findInput.focusOnCaseSensitive();
			e.preventDefault();
			return;
		}

		if (e.equals(KeyMod.Shift | KeyCode.Tab)) {
			this._findInput.focus();
			e.preventDefault();
			return;
		}

		if (e.equals(KeyMod.CtrlCmd | KeyCode.DownArrow)) {
			this._codeEditor.focus();
			e.preventDefault();
			return;
		}

		if (e.equals(KeyCode.UpArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			return stopPropagationForMultiLineUpwards(e, this._replaceInput.inputBox.value, this._replaceInput.inputBox.element.querySelector('textarea'));
		}

		if (e.equals(KeyCode.DownArrow)) {
			// eslint-disable-next-line no-restricted-syntax
			return stopPropagationForMultiLineDownwards(e, this._replaceInput.inputBox.value, this._replaceInput.inputBox.element.querySelector('textarea'));
		}
	}

	// ----- sash
	public getVerticalSashLeft(_sash: Sash): number {
		return 0;
	}
	// ----- initialization

	private _keybindingLabelFor(actionId: string): string {
		const kb = this._keybindingService.lookupKeybinding(actionId);
		if (!kb) {
			return '';
		}
		return ` (${kb.getLabel()})`;
	}

	private _buildDomNode(): void {
		const flexibleHeight = true;
		const flexibleWidth = true;
		// Find input
		const findSearchHistoryConfig = this._codeEditor.getOption(EditorOption.find).history;
		const replaceHistoryConfig = this._codeEditor.getOption(EditorOption.find).replaceHistory;
		this._findInput = this._register(new ContextScopedFindInput(null, this._contextViewProvider, {
			width: FIND_INPUT_AREA_WIDTH,
			label: NLS_FIND_INPUT_LABEL,
			placeholder: NLS_FIND_INPUT_PLACEHOLDER,
			appendCaseSensitiveLabel: this._keybindingLabelFor(FIND_IDS.ToggleCaseSensitiveCommand),
			appendWholeWordsLabel: this._keybindingLabelFor(FIND_IDS.ToggleWholeWordCommand),
			appendRegexLabel: this._keybindingLabelFor(FIND_IDS.ToggleRegexCommand),
			validation: (value: string): InputBoxMessage | null => {
				if (value.length === 0 || !this._findInput.getRegex()) {
					return null;
				}
				try {
					// use `g` and `u` which are also used by the TextModel search
					new RegExp(value, 'gu');
					return null;
				} catch (e) {
					return { content: e.message };
				}
			},
			flexibleHeight,
			flexibleWidth,
			flexibleMaxHeight: 118,
			showCommonFindToggles: true,
			showHistoryHint: () => showHistoryKeybindingHint(this._keybindingService),
			inputBoxStyles: defaultInputBoxStyles,
			toggleStyles: defaultToggleStyles,
			history: findSearchHistoryConfig === 'workspace' ? this._findWidgetSearchHistory : new Set([]),
		}, this._contextKeyService));
		this._findInput.setRegex(!!this._state.isRegex);
		this._findInput.setCaseSensitive(!!this._state.matchCase);
		this._findInput.setWholeWords(!!this._state.wholeWord);
		this._register(this._findInput.onKeyDown((e) => {
			if (e.equals(KeyCode.Enter) && !this._codeEditor.getOption(EditorOption.find).findOnType) {
				this._state.change({ searchString: this._findInput.getValue() }, true);
			}
			this._onFindInputKeyDown(e);
		}));
		this._register(this._findInput.inputBox.onDidChange(() => {
			if (this._ignoreChangeEvent || !this._codeEditor.getOption(EditorOption.find).findOnType) {
				return;
			}
			this._state.change({ searchString: this._findInput.getValue() }, true);
		}));
		this._register(this._findInput.onDidOptionChange(() => {
			this._state.change({
				isRegex: this._findInput.getRegex(),
				wholeWord: this._findInput.getWholeWords(),
				matchCase: this._findInput.getCaseSensitive()
			}, true);
		}));
		this._register(this._findInput.onCaseSensitiveKeyDown((e) => {
			if (e.equals(KeyMod.Shift | KeyCode.Tab)) {
				if (this._isReplaceVisible) {
					this._replaceInput.focus();
					e.preventDefault();
				}
			}
		}));
		this._register(this._findInput.onRegexKeyDown((e) => {
			if (e.equals(KeyCode.Tab)) {
				if (this._isReplaceVisible) {
					this._replaceInput.focusOnPreserve();
					e.preventDefault();
				}
			}
		}));
		this._register(this._findInput.inputBox.onDidHeightChange((e) => {
			if (this._tryUpdateHeight()) {
				this._showViewZone();
			}
		}));
		if (platform.isLinux) {
			this._register(this._findInput.onMouseDown((e) => this._onFindInputMouseDown(e)));
		}

		this._matchesCount = document.createElement('div');
		this._matchesCount.className = 'matchesCount';
		this._updateMatchesCount();

		const hoverLifecycleOptions: IHoverLifecycleOptions = { groupId: 'find-widget' };

		// Previous button
		this._prevBtn = this._register(new SimpleButton({
			label: NLS_PREVIOUS_MATCH_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.PreviousMatchFindAction),
			icon: findPreviousMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				assertReturnsDefined(this._codeEditor.getAction(FIND_IDS.PreviousMatchFindAction)).run().then(undefined, onUnexpectedError);
			}
		}, this._hoverService));

		// Next button
		this._nextBtn = this._register(new SimpleButton({
			label: NLS_NEXT_MATCH_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.NextMatchFindAction),
			icon: findNextMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				assertReturnsDefined(this._codeEditor.getAction(FIND_IDS.NextMatchFindAction)).run().then(undefined, onUnexpectedError);
			}
		}, this._hoverService));

		const findPart = document.createElement('div');
		findPart.className = 'find-part';
		findPart.appendChild(this._findInput.domNode);
		const actionsContainer = document.createElement('div');
		actionsContainer.className = 'find-actions';
		findPart.appendChild(actionsContainer);
		actionsContainer.appendChild(this._matchesCount);
		actionsContainer.appendChild(this._prevBtn.domNode);
		actionsContainer.appendChild(this._nextBtn.domNode);

		// Toggle selection button
		this._toggleSelectionFind = this._register(new Toggle({
			icon: findSelectionIcon,
			title: NLS_TOGGLE_SELECTION_FIND_TITLE + this._keybindingLabelFor(FIND_IDS.ToggleSearchScopeCommand),
			isChecked: false,
			hoverLifecycleOptions,
			inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground),
			inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
			inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
		}));

		this._register(this._toggleSelectionFind.onChange(() => {
			if (this._toggleSelectionFind.checked) {
				if (this._codeEditor.hasModel()) {
					let selections = this._codeEditor.getSelections();
					selections = selections.map(selection => {
						if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
							selection = selection.setEndPosition(selection.endLineNumber - 1, this._codeEditor.getModel()!.getLineMaxColumn(selection.endLineNumber - 1));
						}
						if (!selection.isEmpty()) {
							return selection;
						}
						return null;
					}).filter((element): element is Selection => !!element);

					if (selections.length) {
						this._state.change({ searchScope: selections as Range[] }, true);
					}
				}
			} else {
				this._state.change({ searchScope: null }, true);
			}
		}));

		actionsContainer.appendChild(this._toggleSelectionFind.domNode);

		// Close button
		this._closeBtn = this._register(new SimpleButton({
			label: NLS_CLOSE_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.CloseFindWidgetCommand),
			icon: widgetClose,
			hoverLifecycleOptions,
			onTrigger: () => {
				this._state.change({ isRevealed: false, searchScope: null }, false);
			},
			onKeyDown: (e) => {
				if (e.equals(KeyCode.Tab)) {
					if (this._isReplaceVisible) {
						if (this._replaceBtn.isEnabled()) {
							this._replaceBtn.focus();
						} else {
							this._codeEditor.focus();
						}
						e.preventDefault();
					}
				}
			}
		}, this._hoverService));

		// Replace input
		this._replaceInput = this._register(new ContextScopedReplaceInput(null, undefined, {
			label: NLS_REPLACE_INPUT_LABEL,
			placeholder: NLS_REPLACE_INPUT_PLACEHOLDER,
			appendPreserveCaseLabel: this._keybindingLabelFor(FIND_IDS.TogglePreserveCaseCommand),
			history: replaceHistoryConfig === 'workspace' ? this._replaceWidgetHistory : new Set([]),
			flexibleHeight,
			flexibleWidth,
			flexibleMaxHeight: 118,
			showHistoryHint: () => showHistoryKeybindingHint(this._keybindingService),
			inputBoxStyles: defaultInputBoxStyles,
			toggleStyles: defaultToggleStyles,
			hoverLifecycleOptions,
		}, this._contextKeyService, true));
		this._replaceInput.setPreserveCase(!!this._state.preserveCase);
		this._register(this._replaceInput.onKeyDown((e) => this._onReplaceInputKeyDown(e)));
		this._register(this._replaceInput.inputBox.onDidChange(() => {
			this._state.change({ replaceString: this._replaceInput.inputBox.value }, false);
		}));
		this._register(this._replaceInput.inputBox.onDidHeightChange((e) => {
			if (this._isReplaceVisible && this._tryUpdateHeight()) {
				this._showViewZone();
			}
		}));
		this._register(this._replaceInput.onDidOptionChange(() => {
			this._state.change({
				preserveCase: this._replaceInput.getPreserveCase()
			}, true);
		}));
		this._register(this._replaceInput.onPreserveCaseKeyDown((e) => {
			if (e.equals(KeyCode.Tab)) {
				if (this._prevBtn.isEnabled()) {
					this._prevBtn.focus();
				} else if (this._nextBtn.isEnabled()) {
					this._nextBtn.focus();
				} else if (this._toggleSelectionFind.enabled) {
					this._toggleSelectionFind.focus();
				} else if (this._closeBtn.isEnabled()) {
					this._closeBtn.focus();
				}

				e.preventDefault();
			}
		}));

		// Replace one button
		this._replaceBtn = this._register(new SimpleButton({
			label: NLS_REPLACE_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.ReplaceOneAction),
			icon: findReplaceIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this._controller.replace();
			},
			onKeyDown: (e) => {
				if (e.equals(KeyMod.Shift | KeyCode.Tab)) {
					this._closeBtn.focus();
					e.preventDefault();
				}
			}
		}, this._hoverService));

		// Replace all button
		this._replaceAllBtn = this._register(new SimpleButton({
			label: NLS_REPLACE_ALL_BTN_LABEL + this._keybindingLabelFor(FIND_IDS.ReplaceAllAction),
			icon: findReplaceAllIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this._controller.replaceAll();
			}
		}, this._hoverService));

		const replacePart = document.createElement('div');
		replacePart.className = 'replace-part';
		replacePart.appendChild(this._replaceInput.domNode);

		const replaceActionsContainer = document.createElement('div');
		replaceActionsContainer.className = 'replace-actions';
		replacePart.appendChild(replaceActionsContainer);

		replaceActionsContainer.appendChild(this._replaceBtn.domNode);
		replaceActionsContainer.appendChild(this._replaceAllBtn.domNode);

		// Toggle replace button
		this._toggleReplaceBtn = this._register(new SimpleButton({
			label: NLS_TOGGLE_REPLACE_MODE_BTN_LABEL,
			className: 'codicon toggle left',
			onTrigger: () => {
				this._state.change({ isReplaceRevealed: !this._isReplaceVisible }, false);
				if (this._isReplaceVisible) {
					this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
					this._replaceInput.inputBox.layout();
				}
				this._showViewZone();
			}
		}, this._hoverService));
		this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);

		// Widget
		this._domNode = document.createElement('div');
		this._domNode.className = 'editor-widget find-widget';
		this._domNode.setAttribute('aria-hidden', 'true');
		this._domNode.ariaLabel = NLS_FIND_DIALOG_LABEL;
		this._domNode.role = 'dialog';

		// We need to set this explicitly, otherwise on IE11, the width inheritence of flex doesn't work.
		this._domNode.style.width = `${FIND_WIDGET_INITIAL_WIDTH}px`;

		this._domNode.appendChild(this._toggleReplaceBtn.domNode);
		this._domNode.appendChild(findPart);
		this._domNode.appendChild(this._closeBtn.domNode);
		this._domNode.appendChild(replacePart);

		this._resizeSash = this._register(new Sash(this._domNode, this, { orientation: Orientation.VERTICAL, size: 2 }));
		this._resized = false;
		let originalWidth = FIND_WIDGET_INITIAL_WIDTH;

		this._register(this._resizeSash.onDidStart(() => {
			originalWidth = dom.getTotalWidth(this._domNode);
		}));

		this._register(this._resizeSash.onDidChange((evt: ISashEvent) => {
			this._resized = true;
			const width = originalWidth + evt.startX - evt.currentX;

			if (width < FIND_WIDGET_INITIAL_WIDTH) {
				// narrow down the find widget should be handled by CSS.
				return;
			}

			const maxWidth = parseFloat(dom.getComputedStyle(this._domNode).maxWidth) || 0;
			if (width > maxWidth) {
				return;
			}
			this._domNode.style.width = `${width}px`;
			if (this._isReplaceVisible) {
				this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
			}

			this._findInput.inputBox.layout();
			this._tryUpdateHeight();
		}));

		this._register(this._resizeSash.onDidReset(() => {
			// users double click on the sash
			const currentWidth = dom.getTotalWidth(this._domNode);

			if (currentWidth < FIND_WIDGET_INITIAL_WIDTH) {
				// The editor is narrow and the width of the find widget is controlled fully by CSS.
				return;
			}

			let width = FIND_WIDGET_INITIAL_WIDTH;

			if (!this._resized || currentWidth === FIND_WIDGET_INITIAL_WIDTH) {
				// 1. never resized before, double click should maximizes it
				// 2. users resized it already but its width is the same as default
				const layoutInfo = this._codeEditor.getLayoutInfo();
				width = layoutInfo.width - 28 - layoutInfo.minimap.minimapWidth - 15;
				this._resized = true;
			} else {
				/**
				 * no op, the find widget should be shrinked to its default size.
				 */
			}


			this._domNode.style.width = `${width}px`;
			if (this._isReplaceVisible) {
				this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
			}

			this._findInput.inputBox.layout();
		}));
	}

	private updateAccessibilitySupport(): void {
		const value = this._codeEditor.getOption(EditorOption.accessibilitySupport);
		this._findInput.setFocusInputOnOptionClick(value !== AccessibilitySupport.Enabled);
	}

	getViewState() {
		let widgetViewZoneVisible = false;
		if (this._viewZone && this._viewZoneId) {
			widgetViewZoneVisible = this._viewZone.heightInPx > this._codeEditor.getScrollTop();
		}

		return {
			widgetViewZoneVisible,
			scrollTop: this._codeEditor.getScrollTop()
		};
	}

	setViewState(state?: { widgetViewZoneVisible: boolean; scrollTop: number }) {
		if (!state) {
			return;
		}

		if (state.widgetViewZoneVisible) {
			// we should add the view zone
			this._layoutViewZone(state.scrollTop);
		}
	}
}

export interface ISimpleButtonOpts {
	readonly label: string;
	readonly className?: string;
	readonly icon?: ThemeIcon;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;
	readonly onTrigger: () => void;
	readonly onKeyDown?: (e: IKeyboardEvent) => void;
}

export class SimpleButton extends Widget {

	private readonly _opts: ISimpleButtonOpts;
	private readonly _domNode: HTMLElement;

	constructor(
		opts: ISimpleButtonOpts,
		hoverService: IHoverService
	) {
		super();
		this._opts = opts;

		let className = 'button';
		if (this._opts.className) {
			className = className + ' ' + this._opts.className;
		}
		if (this._opts.icon) {
			className = className + ' ' + ThemeIcon.asClassName(this._opts.icon);
		}

		this._domNode = document.createElement('div');
		this._domNode.tabIndex = 0;
		this._domNode.className = className;
		this._domNode.setAttribute('role', 'button');
		this._domNode.setAttribute('aria-label', this._opts.label);
		this._register(hoverService.setupDelayedHover(this._domNode, {
			content: this._opts.label,
			style: HoverStyle.Pointer,
		}, opts.hoverLifecycleOptions));

		this.onclick(this._domNode, (e) => {
			this._opts.onTrigger();
			e.preventDefault();
		});

		this.onkeydown(this._domNode, (e) => {
			if (e.equals(KeyCode.Space) || e.equals(KeyCode.Enter)) {
				this._opts.onTrigger();
				e.preventDefault();
				return;
			}
			this._opts.onKeyDown?.(e);
		});
	}

	public get domNode(): HTMLElement {
		return this._domNode;
	}

	public isEnabled(): boolean {
		return (this._domNode.tabIndex >= 0);
	}

	public focus(): void {
		this._domNode.focus();
	}

	public setEnabled(enabled: boolean): void {
		this._domNode.classList.toggle('disabled', !enabled);
		this._domNode.setAttribute('aria-disabled', String(!enabled));
		this._domNode.tabIndex = enabled ? 0 : -1;
	}

	public setExpanded(expanded: boolean): void {
		this._domNode.setAttribute('aria-expanded', String(!!expanded));
		if (expanded) {
			this._domNode.classList.remove(...ThemeIcon.asClassNameArray(findCollapsedIcon));
			this._domNode.classList.add(...ThemeIcon.asClassNameArray(findExpandedIcon));
		} else {
			this._domNode.classList.remove(...ThemeIcon.asClassNameArray(findExpandedIcon));
			this._domNode.classList.add(...ThemeIcon.asClassNameArray(findCollapsedIcon));
		}
	}
}

// theming

registerThemingParticipant((theme, collector) => {
	const findMatchHighlightBorder = theme.getColor(editorFindMatchHighlightBorder);
	if (findMatchHighlightBorder) {
		collector.addRule(`.monaco-editor .findMatch { border: 1px ${isHighContrast(theme.type) ? 'dotted' : 'solid'} ${findMatchHighlightBorder}; box-sizing: border-box; }`);
	}

	const findRangeHighlightBorder = theme.getColor(editorFindRangeHighlightBorder);
	if (findRangeHighlightBorder) {
		collector.addRule(`.monaco-editor .findScope { border: 1px ${isHighContrast(theme.type) ? 'dashed' : 'solid'} ${findRangeHighlightBorder}; }`);
	}

	const hcBorder = theme.getColor(contrastBorder);
	if (hcBorder) {
		collector.addRule(`.monaco-editor .find-widget { border: 1px solid ${hcBorder}; }`);
	}
	const findMatchForeground = theme.getColor(editorFindMatchForeground);
	if (findMatchForeground) {
		collector.addRule(`.monaco-editor .findMatchInline { color: ${findMatchForeground}; }`);
	}
	const findMatchHighlightForeground = theme.getColor(editorFindMatchHighlightForeground);
	if (findMatchHighlightForeground) {
		collector.addRule(`.monaco-editor .currentFindMatchInline { color: ${findMatchHighlightForeground}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/findWidgetSearchHistory.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/findWidgetSearchHistory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IHistory } from '../../../../base/common/history.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export class FindWidgetSearchHistory implements IHistory<string> {
	public static readonly FIND_HISTORY_KEY = 'workbench.find.history';
	private inMemoryValues: Set<string> = new Set();
	public onDidChange?: Event<string[]>;
	private _onDidChangeEmitter: Emitter<string[]>;

	private static _instance: FindWidgetSearchHistory | null = null;

	static getOrCreate(
		storageService: IStorageService,
	): FindWidgetSearchHistory {
		if (!FindWidgetSearchHistory._instance) {
			FindWidgetSearchHistory._instance = new FindWidgetSearchHistory(storageService);
		}
		return FindWidgetSearchHistory._instance;
	}

	constructor(
		@IStorageService private readonly storageService: IStorageService,
	) {
		this._onDidChangeEmitter = new Emitter<string[]>();
		this.onDidChange = this._onDidChangeEmitter.event;
		this.load();
	}

	delete(t: string): boolean {
		const result = this.inMemoryValues.delete(t);
		this.save();
		return result;
	}

	add(t: string): this {
		this.inMemoryValues.add(t);
		this.save();
		return this;
	}

	has(t: string): boolean {
		return this.inMemoryValues.has(t);
	}

	clear(): void {
		this.inMemoryValues.clear();
		this.save();
	}

	forEach(callbackfn: (value: string, value2: string, set: Set<string>) => void, thisArg?: unknown): void {
		// fetch latest from storage
		this.load();
		return this.inMemoryValues.forEach(callbackfn);
	}
	replace?(t: string[]): void {
		this.inMemoryValues = new Set(t);
		this.save();
	}

	load() {
		let result: [] | undefined;
		const raw = this.storageService.get(
			FindWidgetSearchHistory.FIND_HISTORY_KEY,
			StorageScope.WORKSPACE
		);

		if (raw) {
			try {
				result = JSON.parse(raw);
			} catch (e) {
				// Invalid data
			}
		}

		this.inMemoryValues = new Set(result || []);
	}

	// Run saves async
	save(): Promise<void> {
		const elements: string[] = [];
		this.inMemoryValues.forEach(e => elements.push(e));
		return new Promise<void>(resolve => {
			this.storageService.store(
				FindWidgetSearchHistory.FIND_HISTORY_KEY,
				JSON.stringify(elements),
				StorageScope.WORKSPACE,
				StorageTarget.USER,
			);
			this._onDidChangeEmitter.fire(elements);
			resolve();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/replaceAllCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/replaceAllCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

interface IEditOperation {
	range: Range;
	text: string;
}

export class ReplaceAllCommand implements ICommand {

	private readonly _editorSelection: Selection;
	private _trackedEditorSelectionId: string | null;
	private readonly _ranges: Range[];
	private readonly _replaceStrings: string[];

	constructor(editorSelection: Selection, ranges: Range[], replaceStrings: string[]) {
		this._editorSelection = editorSelection;
		this._ranges = ranges;
		this._replaceStrings = replaceStrings;
		this._trackedEditorSelectionId = null;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		if (this._ranges.length > 0) {
			// Collect all edit operations
			const ops: IEditOperation[] = [];
			for (let i = 0; i < this._ranges.length; i++) {
				ops.push({
					range: this._ranges[i],
					text: this._replaceStrings[i]
				});
			}

			// Sort them in ascending order by range starts
			ops.sort((o1, o2) => {
				return Range.compareRangesUsingStarts(o1.range, o2.range);
			});

			// Merge operations that touch each other
			const resultOps: IEditOperation[] = [];
			let previousOp = ops[0];
			for (let i = 1; i < ops.length; i++) {
				if (previousOp.range.endLineNumber === ops[i].range.startLineNumber && previousOp.range.endColumn === ops[i].range.startColumn) {
					// These operations are one after another and can be merged
					previousOp.range = previousOp.range.plusRange(ops[i].range);
					previousOp.text = previousOp.text + ops[i].text;
				} else {
					resultOps.push(previousOp);
					previousOp = ops[i];
				}
			}
			resultOps.push(previousOp);

			for (const op of resultOps) {
				builder.addEditOperation(op.range, op.text);
			}
		}

		this._trackedEditorSelectionId = builder.trackSelection(this._editorSelection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this._trackedEditorSelectionId!);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/replacePattern.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/replacePattern.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';
import { buildReplaceStringWithCasePreserved } from '../../../../base/common/search.js';

const enum ReplacePatternKind {
	StaticValue = 0,
	DynamicPieces = 1
}

/**
 * Assigned when the replace pattern is entirely static.
 */
class StaticValueReplacePattern {
	public readonly kind = ReplacePatternKind.StaticValue;
	constructor(public readonly staticValue: string) { }
}

/**
 * Assigned when the replace pattern has replacement patterns.
 */
class DynamicPiecesReplacePattern {
	public readonly kind = ReplacePatternKind.DynamicPieces;
	constructor(public readonly pieces: ReplacePiece[]) { }
}

export class ReplacePattern {

	public static fromStaticValue(value: string): ReplacePattern {
		return new ReplacePattern([ReplacePiece.staticValue(value)]);
	}

	private readonly _state: StaticValueReplacePattern | DynamicPiecesReplacePattern;

	public get hasReplacementPatterns(): boolean {
		return (this._state.kind === ReplacePatternKind.DynamicPieces);
	}

	constructor(pieces: ReplacePiece[] | null) {
		if (!pieces || pieces.length === 0) {
			this._state = new StaticValueReplacePattern('');
		} else if (pieces.length === 1 && pieces[0].staticValue !== null) {
			this._state = new StaticValueReplacePattern(pieces[0].staticValue);
		} else {
			this._state = new DynamicPiecesReplacePattern(pieces);
		}
	}

	public buildReplaceString(matches: string[] | null, preserveCase?: boolean): string {
		if (this._state.kind === ReplacePatternKind.StaticValue) {
			if (preserveCase) {
				return buildReplaceStringWithCasePreserved(matches, this._state.staticValue);
			} else {
				return this._state.staticValue;
			}
		}

		let result = '';
		for (let i = 0, len = this._state.pieces.length; i < len; i++) {
			const piece = this._state.pieces[i];
			if (piece.staticValue !== null) {
				// static value ReplacePiece
				result += piece.staticValue;
				continue;
			}

			// match index ReplacePiece
			let match: string = ReplacePattern._substitute(piece.matchIndex, matches);
			if (piece.caseOps !== null && piece.caseOps.length > 0) {
				const repl: string[] = [];
				const lenOps: number = piece.caseOps.length;
				let opIdx: number = 0;
				for (let idx: number = 0, len: number = match.length; idx < len; idx++) {
					if (opIdx >= lenOps) {
						repl.push(match.slice(idx));
						break;
					}
					switch (piece.caseOps[opIdx]) {
						case 'U':
							repl.push(match[idx].toUpperCase());
							break;
						case 'u':
							repl.push(match[idx].toUpperCase());
							opIdx++;
							break;
						case 'L':
							repl.push(match[idx].toLowerCase());
							break;
						case 'l':
							repl.push(match[idx].toLowerCase());
							opIdx++;
							break;
						default:
							repl.push(match[idx]);
					}
				}
				match = repl.join('');
			}
			result += match;
		}

		return result;
	}

	private static _substitute(matchIndex: number, matches: string[] | null): string {
		if (matches === null) {
			return '';
		}
		if (matchIndex === 0) {
			return matches[0];
		}

		let remainder = '';
		while (matchIndex > 0) {
			if (matchIndex < matches.length) {
				// A match can be undefined
				const match = (matches[matchIndex] || '');
				return match + remainder;
			}
			remainder = String(matchIndex % 10) + remainder;
			matchIndex = Math.floor(matchIndex / 10);
		}
		return '$' + remainder;
	}
}

/**
 * A replace piece can either be a static string or an index to a specific match.
 */
export class ReplacePiece {

	public static staticValue(value: string): ReplacePiece {
		return new ReplacePiece(value, -1, null);
	}

	public static matchIndex(index: number): ReplacePiece {
		return new ReplacePiece(null, index, null);
	}

	public static caseOps(index: number, caseOps: string[]): ReplacePiece {
		return new ReplacePiece(null, index, caseOps);
	}

	public readonly staticValue: string | null;
	public readonly matchIndex: number;
	public readonly caseOps: string[] | null;

	private constructor(staticValue: string | null, matchIndex: number, caseOps: string[] | null) {
		this.staticValue = staticValue;
		this.matchIndex = matchIndex;
		if (!caseOps || caseOps.length === 0) {
			this.caseOps = null;
		} else {
			this.caseOps = caseOps.slice(0);
		}
	}
}

class ReplacePieceBuilder {

	private readonly _source: string;
	private _lastCharIndex: number;
	private readonly _result: ReplacePiece[];
	private _resultLen: number;
	private _currentStaticPiece: string;

	constructor(source: string) {
		this._source = source;
		this._lastCharIndex = 0;
		this._result = [];
		this._resultLen = 0;
		this._currentStaticPiece = '';
	}

	public emitUnchanged(toCharIndex: number): void {
		this._emitStatic(this._source.substring(this._lastCharIndex, toCharIndex));
		this._lastCharIndex = toCharIndex;
	}

	public emitStatic(value: string, toCharIndex: number): void {
		this._emitStatic(value);
		this._lastCharIndex = toCharIndex;
	}

	private _emitStatic(value: string): void {
		if (value.length === 0) {
			return;
		}
		this._currentStaticPiece += value;
	}

	public emitMatchIndex(index: number, toCharIndex: number, caseOps: string[]): void {
		if (this._currentStaticPiece.length !== 0) {
			this._result[this._resultLen++] = ReplacePiece.staticValue(this._currentStaticPiece);
			this._currentStaticPiece = '';
		}
		this._result[this._resultLen++] = ReplacePiece.caseOps(index, caseOps);
		this._lastCharIndex = toCharIndex;
	}


	public finalize(): ReplacePattern {
		this.emitUnchanged(this._source.length);
		if (this._currentStaticPiece.length !== 0) {
			this._result[this._resultLen++] = ReplacePiece.staticValue(this._currentStaticPiece);
			this._currentStaticPiece = '';
		}
		return new ReplacePattern(this._result);
	}
}

/**
 * \n			=> inserts a LF
 * \t			=> inserts a TAB
 * \\			=> inserts a "\".
 * \u			=> upper-cases one character in a match.
 * \U			=> upper-cases ALL remaining characters in a match.
 * \l			=> lower-cases one character in a match.
 * \L			=> lower-cases ALL remaining characters in a match.
 * $$			=> inserts a "$".
 * $& and $0	=> inserts the matched substring.
 * $n			=> Where n is a non-negative integer lesser than 100, inserts the nth parenthesized submatch string
 * everything else stays untouched
 *
 * Also see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
 */
export function parseReplaceString(replaceString: string): ReplacePattern {
	if (!replaceString || replaceString.length === 0) {
		return new ReplacePattern(null);
	}

	const caseOps: string[] = [];
	const result = new ReplacePieceBuilder(replaceString);

	for (let i = 0, len = replaceString.length; i < len; i++) {
		const chCode = replaceString.charCodeAt(i);

		if (chCode === CharCode.Backslash) {

			// move to next char
			i++;

			if (i >= len) {
				// string ends with a \
				break;
			}

			const nextChCode = replaceString.charCodeAt(i);
			// let replaceWithCharacter: string | null = null;

			switch (nextChCode) {
				case CharCode.Backslash:
					// \\ => inserts a "\"
					result.emitUnchanged(i - 1);
					result.emitStatic('\\', i + 1);
					break;
				case CharCode.n:
					// \n => inserts a LF
					result.emitUnchanged(i - 1);
					result.emitStatic('\n', i + 1);
					break;
				case CharCode.t:
					// \t => inserts a TAB
					result.emitUnchanged(i - 1);
					result.emitStatic('\t', i + 1);
					break;
				// Case modification of string replacements, patterned after Boost, but only applied
				// to the replacement text, not subsequent content.
				case CharCode.u:
				// \u => upper-cases one character.
				case CharCode.U:
				// \U => upper-cases ALL following characters.
				case CharCode.l:
				// \l => lower-cases one character.
				case CharCode.L:
					// \L => lower-cases ALL following characters.
					result.emitUnchanged(i - 1);
					result.emitStatic('', i + 1);
					caseOps.push(String.fromCharCode(nextChCode));
					break;
			}

			continue;
		}

		if (chCode === CharCode.DollarSign) {

			// move to next char
			i++;

			if (i >= len) {
				// string ends with a $
				break;
			}

			const nextChCode = replaceString.charCodeAt(i);

			if (nextChCode === CharCode.DollarSign) {
				// $$ => inserts a "$"
				result.emitUnchanged(i - 1);
				result.emitStatic('$', i + 1);
				continue;
			}

			if (nextChCode === CharCode.Digit0 || nextChCode === CharCode.Ampersand) {
				// $& and $0 => inserts the matched substring.
				result.emitUnchanged(i - 1);
				result.emitMatchIndex(0, i + 1, caseOps);
				caseOps.length = 0;
				continue;
			}

			if (CharCode.Digit1 <= nextChCode && nextChCode <= CharCode.Digit9) {
				// $n

				let matchIndex = nextChCode - CharCode.Digit0;

				// peek next char to probe for $nn
				if (i + 1 < len) {
					const nextNextChCode = replaceString.charCodeAt(i + 1);
					if (CharCode.Digit0 <= nextNextChCode && nextNextChCode <= CharCode.Digit9) {
						// $nn

						// move to next char
						i++;
						matchIndex = matchIndex * 10 + (nextNextChCode - CharCode.Digit0);

						result.emitUnchanged(i - 2);
						result.emitMatchIndex(matchIndex, i + 1, caseOps);
						caseOps.length = 0;
						continue;
					}
				}

				result.emitUnchanged(i - 1);
				result.emitMatchIndex(matchIndex, i + 1, caseOps);
				caseOps.length = 0;
				continue;
			}
		}
	}

	return result.finalize();
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/browser/replaceWidgetHistory.ts]---
Location: vscode-main/src/vs/editor/contrib/find/browser/replaceWidgetHistory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IHistory } from '../../../../base/common/history.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export class ReplaceWidgetHistory implements IHistory<string> {
	public static readonly FIND_HISTORY_KEY = 'workbench.replace.history';
	private inMemoryValues: Set<string> = new Set();
	public onDidChange?: Event<string[]>;
	private _onDidChangeEmitter: Emitter<string[]>;

	private static _instance: ReplaceWidgetHistory | null = null;

	static getOrCreate(
		storageService: IStorageService,
	): ReplaceWidgetHistory {
		if (!ReplaceWidgetHistory._instance) {
			ReplaceWidgetHistory._instance = new ReplaceWidgetHistory(storageService);
		}
		return ReplaceWidgetHistory._instance;
	}

	constructor(
		@IStorageService private readonly storageService: IStorageService,
	) {
		this._onDidChangeEmitter = new Emitter<string[]>();
		this.onDidChange = this._onDidChangeEmitter.event;
		this.load();
	}

	delete(t: string): boolean {
		const result = this.inMemoryValues.delete(t);
		this.save();
		return result;
	}

	add(t: string): this {
		this.inMemoryValues.add(t);
		this.save();
		return this;
	}

	has(t: string): boolean {
		return this.inMemoryValues.has(t);
	}

	clear(): void {
		this.inMemoryValues.clear();
		this.save();
	}

	forEach(callbackfn: (value: string, value2: string, set: Set<string>) => void, thisArg?: unknown): void {
		// fetch latest from storage
		this.load();
		return this.inMemoryValues.forEach(callbackfn);
	}
	replace?(t: string[]): void {
		this.inMemoryValues = new Set(t);
		this.save();
	}

	load() {
		let result: [] | undefined;
		const raw = this.storageService.get(
			ReplaceWidgetHistory.FIND_HISTORY_KEY,
			StorageScope.WORKSPACE
		);

		if (raw) {
			try {
				result = JSON.parse(raw);
			} catch (e) {
				// Invalid data
			}
		}

		this.inMemoryValues = new Set(result || []);
	}

	// Run saves async
	save(): Promise<void> {
		const elements: string[] = [];
		this.inMemoryValues.forEach(e => elements.push(e));
		return new Promise<void>(resolve => {
			this.storageService.store(
				ReplaceWidgetHistory.FIND_HISTORY_KEY,
				JSON.stringify(elements),
				StorageScope.WORKSPACE,
				StorageTarget.USER,
			);
			this._onDidChangeEmitter.fire(elements);
			resolve();
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/test/browser/find.test.ts]---
Location: vscode-main/src/vs/editor/contrib/find/test/browser/find.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { getSelectionSearchString } from '../../browser/findController.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';


suite('Find', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('search string at position', () => {
		withTestCodeEditor([
			'ABC DEF',
			'0123 456'
		], {}, (editor) => {

			// The cursor is at the very top, of the file, at the first ABC
			const searchStringAtTop = getSelectionSearchString(editor);
			assert.strictEqual(searchStringAtTop, 'ABC');

			// Move cursor to the end of ABC
			editor.setPosition(new Position(1, 3));
			const searchStringAfterABC = getSelectionSearchString(editor);
			assert.strictEqual(searchStringAfterABC, 'ABC');

			// Move cursor to DEF
			editor.setPosition(new Position(1, 5));
			const searchStringInsideDEF = getSelectionSearchString(editor);
			assert.strictEqual(searchStringInsideDEF, 'DEF');

		});
	});

	test('search string with selection', () => {
		withTestCodeEditor([
			'ABC DEF',
			'0123 456'
		], {}, (editor) => {

			// Select A of ABC
			editor.setSelection(new Range(1, 1, 1, 2));
			const searchStringSelectionA = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionA, 'A');

			// Select BC of ABC
			editor.setSelection(new Range(1, 2, 1, 4));
			const searchStringSelectionBC = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionBC, 'BC');

			// Select BC DE
			editor.setSelection(new Range(1, 2, 1, 7));
			const searchStringSelectionBCDE = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionBCDE, 'BC DE');

		});
	});

	test('search string with multiline selection', () => {
		withTestCodeEditor([
			'ABC DEF',
			'0123 456'
		], {}, (editor) => {

			// Select first line and newline
			editor.setSelection(new Range(1, 1, 2, 1));
			const searchStringSelectionWholeLine = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionWholeLine, null);

			// Select first line and chunk of second
			editor.setSelection(new Range(1, 1, 2, 4));
			const searchStringSelectionTwoLines = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionTwoLines, null);

			// Select end of first line newline and chunk of second
			editor.setSelection(new Range(1, 7, 2, 4));
			const searchStringSelectionSpanLines = getSelectionSearchString(editor);
			assert.strictEqual(searchStringSelectionSpanLines, null);

		});
	});

});
```

--------------------------------------------------------------------------------

````

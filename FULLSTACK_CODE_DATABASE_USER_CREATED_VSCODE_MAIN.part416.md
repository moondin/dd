---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 416
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 416 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindReplaceWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindReplaceWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../../../nls.js';
import * as dom from '../../../../../../base/browser/dom.js';
import './notebookFindReplaceWidget.css';
import { ActionBar } from '../../../../../../base/browser/ui/actionbar/actionbar.js';
import { IActionViewItemOptions } from '../../../../../../base/browser/ui/actionbar/actionViewItems.js';
import { AnchorAlignment, IContextViewProvider } from '../../../../../../base/browser/ui/contextview/contextview.js';
import { DropdownMenuActionViewItem } from '../../../../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { FindInput, IFindInputOptions } from '../../../../../../base/browser/ui/findinput/findInput.js';
import { ReplaceInput } from '../../../../../../base/browser/ui/findinput/replaceInput.js';
import { IMessage as InputBoxMessage } from '../../../../../../base/browser/ui/inputbox/inputBox.js';
import { ProgressBar } from '../../../../../../base/browser/ui/progressbar/progressbar.js';
import { ISashEvent, Orientation, Sash } from '../../../../../../base/browser/ui/sash/sash.js';
import { IToggleStyles, Toggle } from '../../../../../../base/browser/ui/toggle/toggle.js';
import { Widget } from '../../../../../../base/browser/ui/widget.js';
import { Action, ActionRunner, IAction, IActionRunner, Separator } from '../../../../../../base/common/actions.js';
import { Delayer } from '../../../../../../base/common/async.js';
import { Codicon } from '../../../../../../base/common/codicons.js';
import { Event } from '../../../../../../base/common/event.js';
import { KeyCode } from '../../../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { isSafari } from '../../../../../../base/common/platform.js';
import { IHistory } from '../../../../../../base/common/history.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { FindReplaceState, FindReplaceStateChangedEvent } from '../../../../../../editor/contrib/find/browser/findState.js';
import { findNextMatchIcon, findPreviousMatchIcon, findReplaceAllIcon, findReplaceIcon, findSelectionIcon, SimpleButton } from '../../../../../../editor/contrib/find/browser/findWidget.js';
import { parseReplaceString, ReplacePattern } from '../../../../../../editor/contrib/find/browser/replacePattern.js';
import { getActionBarActions } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../../../platform/contextview/browser/contextView.js';
import { ContextScopedReplaceInput, registerAndCreateHistoryNavigationContext } from '../../../../../../platform/history/browser/contextScopedHistoryWidget.js';

import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { defaultInputBoxStyles, defaultProgressBarStyles, defaultToggleStyles } from '../../../../../../platform/theme/browser/defaultStyles.js';
import { asCssVariable, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { registerIcon, widgetClose } from '../../../../../../platform/theme/common/iconRegistry.js';
import { registerThemingParticipant } from '../../../../../../platform/theme/common/themeService.js';
import { filterIcon } from '../../../../extensions/browser/extensionsIcons.js';
import { NotebookFindFilters } from './findFilters.js';
import { IShowNotebookFindWidgetOptions } from './notebookFindWidget.js';
import { ICellModelDecorations, ICellModelDeltaDecorations, ICellViewModel, INotebookDeltaDecoration, INotebookEditor } from '../../notebookBrowser.js';
import { NotebookFindScopeType, NotebookSetting } from '../../../common/notebookCommon.js';
import { ICellRange } from '../../../common/notebookRange.js';
import type { IHoverLifecycleOptions } from '../../../../../../base/browser/ui/hover/hover.js';


const NLS_FIND_INPUT_LABEL = nls.localize('label.find', "Find");
const NLS_FIND_INPUT_PLACEHOLDER = nls.localize('placeholder.find', "Find");
const NLS_PREVIOUS_MATCH_BTN_LABEL = nls.localize('label.previousMatchButton', "Previous Match");
const NLS_NEXT_MATCH_BTN_LABEL = nls.localize('label.nextMatchButton', "Next Match");
const NLS_TOGGLE_SELECTION_FIND_TITLE = nls.localize('label.toggleSelectionFind', "Find in Selection");
const NLS_CLOSE_BTN_LABEL = nls.localize('label.closeButton', "Close");
const NLS_TOGGLE_REPLACE_MODE_BTN_LABEL = nls.localize('label.toggleReplaceButton', "Toggle Replace");
const NLS_REPLACE_INPUT_LABEL = nls.localize('label.replace', "Replace");
const NLS_REPLACE_INPUT_PLACEHOLDER = nls.localize('placeholder.replace', "Replace");
const NLS_REPLACE_BTN_LABEL = nls.localize('label.replaceButton', "Replace");
const NLS_REPLACE_ALL_BTN_LABEL = nls.localize('label.replaceAllButton', "Replace All");

export const findFilterButton = registerIcon('find-filter', Codicon.filter, nls.localize('findFilterIcon', 'Icon for Find Filter in find widget.'));
const NOTEBOOK_FIND_FILTERS = nls.localize('notebook.find.filter.filterAction', "Find Filters");
const NOTEBOOK_FIND_IN_MARKUP_INPUT = nls.localize('notebook.find.filter.findInMarkupInput', "Markdown Source");
const NOTEBOOK_FIND_IN_MARKUP_PREVIEW = nls.localize('notebook.find.filter.findInMarkupPreview', "Rendered Markdown");
const NOTEBOOK_FIND_IN_CODE_INPUT = nls.localize('notebook.find.filter.findInCodeInput', "Code Cell Source");
const NOTEBOOK_FIND_IN_CODE_OUTPUT = nls.localize('notebook.find.filter.findInCodeOutput', "Code Cell Output");

const NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH = 419;
const NOTEBOOK_FIND_WIDGET_INITIAL_HORIZONTAL_PADDING = 4;
class NotebookFindFilterActionViewItem extends DropdownMenuActionViewItem {
	constructor(readonly filters: NotebookFindFilters, action: IAction, options: IActionViewItemOptions, actionRunner: IActionRunner, @IContextMenuService contextMenuService: IContextMenuService) {
		super(action,
			{ getActions: () => this.getActions() },
			contextMenuService,
			{
				...options,
				actionRunner,
				classNames: action.class,
				anchorAlignmentProvider: () => AnchorAlignment.RIGHT
			}
		);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		this.updateChecked();
	}

	private getActions(): IAction[] {
		const markdownInput: IAction = {
			checked: this.filters.markupInput,
			class: undefined,
			enabled: true,
			id: 'findInMarkdownInput',
			label: NOTEBOOK_FIND_IN_MARKUP_INPUT,
			run: async () => {
				this.filters.markupInput = !this.filters.markupInput;
			},
			tooltip: ''
		};

		const markdownPreview: IAction = {
			checked: this.filters.markupPreview,
			class: undefined,
			enabled: true,
			id: 'findInMarkdownInput',
			label: NOTEBOOK_FIND_IN_MARKUP_PREVIEW,
			run: async () => {
				this.filters.markupPreview = !this.filters.markupPreview;
			},
			tooltip: ''
		};

		const codeInput: IAction = {
			checked: this.filters.codeInput,
			class: undefined,
			enabled: true,
			id: 'findInCodeInput',
			label: NOTEBOOK_FIND_IN_CODE_INPUT,
			run: async () => {
				this.filters.codeInput = !this.filters.codeInput;
			},
			tooltip: ''
		};

		const codeOutput = {
			checked: this.filters.codeOutput,
			class: undefined,
			enabled: true,
			id: 'findInCodeOutput',
			label: NOTEBOOK_FIND_IN_CODE_OUTPUT,
			run: async () => {
				this.filters.codeOutput = !this.filters.codeOutput;
			},
			tooltip: '',
			dispose: () => null
		};

		if (isSafari) {
			return [
				markdownInput,
				codeInput
			];
		} else {
			return [
				markdownInput,
				markdownPreview,
				new Separator(),
				codeInput,
				codeOutput,
			];
		}

	}

	protected override updateChecked(): void {
		this.element!.classList.toggle('checked', this._action.checked);
	}
}

export class NotebookFindInputFilterButton extends Disposable {
	private _filterButtonContainer: HTMLElement;
	private _actionbar: ActionBar | null = null;
	private _filtersAction: IAction;
	private _toggleStyles: IToggleStyles;

	constructor(
		readonly filters: NotebookFindFilters,
		readonly contextMenuService: IContextMenuService,
		readonly instantiationService: IInstantiationService,
		options: IFindInputOptions,
		tooltip: string = NOTEBOOK_FIND_FILTERS,
	) {

		super();
		this._toggleStyles = options.toggleStyles;

		this._filtersAction = this._register(new Action('notebookFindFilterAction', tooltip, 'notebook-filters ' + ThemeIcon.asClassName(filterIcon)));
		this._filtersAction.checked = false;
		this._filterButtonContainer = dom.$('.find-filter-button');
		this._filterButtonContainer.classList.add('monaco-custom-toggle');
		this.createFilters(this._filterButtonContainer);
	}

	get container() {
		return this._filterButtonContainer;
	}

	width() {
		return 2 /*margin left*/ + 2 /*border*/ + 2 /*padding*/ + 16 /* icon width */;
	}

	enable(): void {
		this.container.setAttribute('aria-disabled', String(false));
	}

	disable(): void {
		this.container.setAttribute('aria-disabled', String(true));
	}

	set visible(visible: boolean) {
		this._filterButtonContainer.style.display = visible ? '' : 'none';
	}

	get visible() {
		return this._filterButtonContainer.style.display !== 'none';
	}

	applyStyles(filterChecked: boolean): void {
		const toggleStyles = this._toggleStyles;

		this._filterButtonContainer.style.border = '1px solid transparent';
		this._filterButtonContainer.style.borderRadius = '3px';
		this._filterButtonContainer.style.borderColor = (filterChecked && toggleStyles.inputActiveOptionBorder) || '';
		this._filterButtonContainer.style.color = (filterChecked && toggleStyles.inputActiveOptionForeground) || 'inherit';
		this._filterButtonContainer.style.backgroundColor = (filterChecked && toggleStyles.inputActiveOptionBackground) || '';
	}

	private createFilters(container: HTMLElement): void {
		this._actionbar = this._register(new ActionBar(container, {
			actionViewItemProvider: (action, options) => {
				if (action.id === this._filtersAction.id) {
					return this.instantiationService.createInstance(NotebookFindFilterActionViewItem, this.filters, action, options, this._register(new ActionRunner()));
				}
				return undefined;
			}
		}));
		this._actionbar.push(this._filtersAction, { icon: true, label: false });
	}
}

export class NotebookFindInput extends FindInput {
	private _findFilter: NotebookFindInputFilterButton;
	private _filterChecked: boolean = false;

	constructor(
		readonly filters: NotebookFindFilters,
		contextKeyService: IContextKeyService,
		readonly contextMenuService: IContextMenuService,
		readonly instantiationService: IInstantiationService,
		parent: HTMLElement | null,
		contextViewProvider: IContextViewProvider,
		options: IFindInputOptions,
	) {
		super(parent, contextViewProvider, options);

		this._register(registerAndCreateHistoryNavigationContext(contextKeyService, this.inputBox));
		this._findFilter = this._register(new NotebookFindInputFilterButton(filters, contextMenuService, instantiationService, options));

		this.inputBox.paddingRight = (this.caseSensitive?.width() ?? 0) + (this.wholeWords?.width() ?? 0) + (this.regex?.width() ?? 0) + this._findFilter.width();
		this.controls.appendChild(this._findFilter.container);
	}

	override setEnabled(enabled: boolean) {
		super.setEnabled(enabled);
		if (enabled && !this._filterChecked) {
			this.regex?.enable();
		} else {
			this.regex?.disable();
		}
	}

	updateFilterState(changed: boolean) {
		this._filterChecked = changed;
		if (this.regex) {
			if (this._filterChecked) {
				this.regex.disable();
				this.regex.domNode.tabIndex = -1;
				this.regex.domNode.classList.toggle('disabled', true);
			} else {
				this.regex.enable();
				this.regex.domNode.tabIndex = 0;
				this.regex.domNode.classList.toggle('disabled', false);
			}
		}
		this._findFilter.applyStyles(this._filterChecked);
	}

	getCellToolbarActions(menu: IMenu): { primary: IAction[]; secondary: IAction[] } {
		return getActionBarActions(menu.getActions({ shouldForwardArgs: true }), g => /^inline/.test(g));
	}
}

export abstract class SimpleFindReplaceWidget extends Widget {
	protected readonly _findInput: NotebookFindInput;
	private readonly _domNode: HTMLElement;
	private readonly _innerFindDomNode: HTMLElement;
	private readonly _focusTracker: dom.IFocusTracker;
	private readonly _findInputFocusTracker: dom.IFocusTracker;
	private readonly _updateFindHistoryDelayer: Delayer<void>;
	protected readonly _matchesCount!: HTMLElement;
	private readonly prevBtn: SimpleButton;
	private readonly nextBtn: SimpleButton;

	protected readonly _replaceInput!: ReplaceInput;
	private readonly _innerReplaceDomNode!: HTMLElement;
	private _toggleReplaceBtn!: SimpleButton;
	private readonly _replaceInputFocusTracker!: dom.IFocusTracker;
	private readonly _updateReplaceHistoryDelayer: Delayer<void>;
	protected _replaceBtn!: SimpleButton;
	protected _replaceAllBtn!: SimpleButton;

	private readonly _resizeSash: Sash;
	private _resizeOriginalWidth = NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH;

	private _isVisible: boolean = false;
	private _isReplaceVisible: boolean = false;
	private foundMatch: boolean = false;

	protected _progressBar!: ProgressBar;
	protected _scopedContextKeyService: IContextKeyService;

	private _filters: NotebookFindFilters;

	private readonly inSelectionToggle: Toggle;
	private cellSelectionDecorationIds: string[] = [];
	private textSelectionDecorationIds: ICellModelDecorations[] = [];

	constructor(
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService protected readonly _configurationService: IConfigurationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IHoverService hoverService: IHoverService,
		protected readonly _state: FindReplaceState<NotebookFindFilters> = new FindReplaceState<NotebookFindFilters>(),
		protected readonly _notebookEditor: INotebookEditor,
		private readonly _findWidgetSearchHistory: IHistory<string> | undefined,
		private readonly _replaceWidgetHistory: IHistory<string> | undefined,
	) {
		super();

		this._register(this._state);

		const findFilters = this._configurationService.getValue<{
			markupSource: boolean;
			markupPreview: boolean;
			codeSource: boolean;
			codeOutput: boolean;
		}>(NotebookSetting.findFilters) ?? { markupSource: true, markupPreview: true, codeSource: true, codeOutput: true };

		const findHistoryConfig = this._configurationService.getValue<'never' | 'workspace'>('editor.find.history');
		const replaceHistoryConfig = this._configurationService.getValue<'never' | 'workspace'>('editor.find.replaceHistory');

		this._filters = this._register(new NotebookFindFilters(findFilters.markupSource, findFilters.markupPreview, findFilters.codeSource, findFilters.codeOutput, { findScopeType: NotebookFindScopeType.None }));
		this._state.change({ filters: this._filters }, false);

		this._register(this._filters.onDidChange(() => {
			this._state.change({ filters: this._filters }, false);
		}));

		this._domNode = document.createElement('div');
		this._domNode.classList.add('simple-fr-find-part-wrapper');

		this._register(Event.runAndSubscribe(this._configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(NotebookSetting.globalToolbar)) {
				if (this._notebookEditor.notebookOptions.getLayoutConfiguration().globalToolbar) {
					this._domNode.style.top = '26px';
				} else {
					this._domNode.style.top = '0px';
				}
			}
		}));

		this._register(this._state.onFindReplaceStateChange((e) => this._onStateChanged(e)));
		this._scopedContextKeyService = this._register(contextKeyService.createScoped(this._domNode));

		const progressContainer = dom.$('.find-replace-progress');
		this._progressBar = this._register(new ProgressBar(progressContainer, defaultProgressBarStyles));
		this._domNode.appendChild(progressContainer);

		const isInteractiveWindow = contextKeyService.getContextKeyValue('notebookType') === 'interactive';

		const hoverLifecycleOptions: IHoverLifecycleOptions = { groupId: 'simple-find-widget' };

		// Toggle replace button
		this._toggleReplaceBtn = this._register(new SimpleButton({
			label: NLS_TOGGLE_REPLACE_MODE_BTN_LABEL,
			className: 'codicon toggle left',
			hoverLifecycleOptions,
			onTrigger: isInteractiveWindow ? () => { } :
				() => {
					this._isReplaceVisible = !this._isReplaceVisible;
					this._state.change({ isReplaceRevealed: this._isReplaceVisible }, false);
					this._updateReplaceViewDisplay();
				}
		}, hoverService));
		this._toggleReplaceBtn.setEnabled(!isInteractiveWindow);
		this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);
		this._domNode.appendChild(this._toggleReplaceBtn.domNode);



		this._innerFindDomNode = document.createElement('div');
		this._innerFindDomNode.classList.add('simple-fr-find-part');

		this._findInput = this._register(new NotebookFindInput(
			this._filters,
			this._scopedContextKeyService,
			this.contextMenuService,
			this.instantiationService,
			null,
			this._contextViewService,
			{
				// width:FIND_INPUT_AREA_WIDTH,
				label: NLS_FIND_INPUT_LABEL,
				placeholder: NLS_FIND_INPUT_PLACEHOLDER,
				validation: (value: string): InputBoxMessage | null => {
					if (value.length === 0 || !this._findInput.getRegex()) {
						return null;
					}
					try {
						new RegExp(value);
						return null;
					} catch (e) {
						this.foundMatch = false;
						this.updateButtons(this.foundMatch);
						return { content: e.message };
					}
				},
				flexibleWidth: true,
				showCommonFindToggles: true,
				inputBoxStyles: defaultInputBoxStyles,
				toggleStyles: defaultToggleStyles,
				history: findHistoryConfig === 'workspace' ? this._findWidgetSearchHistory : new Set([]),
			}
		));

		// Find History with update delayer
		this._updateFindHistoryDelayer = new Delayer<void>(500);

		this.oninput(this._findInput.domNode, (e) => {
			this.foundMatch = this.onInputChanged();
			this.updateButtons(this.foundMatch);
			this._delayedUpdateFindHistory();
		});

		this._register(this._findInput.inputBox.onDidChange(() => {
			this._state.change({ searchString: this._findInput.getValue() }, true);
		}));

		this._findInput.setRegex(!!this._state.isRegex);
		this._findInput.setCaseSensitive(!!this._state.matchCase);
		this._findInput.setWholeWords(!!this._state.wholeWord);

		this._register(this._findInput.onDidOptionChange(() => {
			this._state.change({
				isRegex: this._findInput.getRegex(),
				wholeWord: this._findInput.getWholeWords(),
				matchCase: this._findInput.getCaseSensitive()
			}, true);
		}));

		this._register(this._state.onFindReplaceStateChange(() => {
			this._findInput.setRegex(this._state.isRegex);
			this._findInput.setWholeWords(this._state.wholeWord);
			this._findInput.setCaseSensitive(this._state.matchCase);
			this._replaceInput.setPreserveCase(this._state.preserveCase);
		}));

		this._matchesCount = document.createElement('div');
		this._matchesCount.className = 'matchesCount';
		this._updateMatchesCount();

		this.prevBtn = this._register(new SimpleButton({
			label: NLS_PREVIOUS_MATCH_BTN_LABEL,
			icon: findPreviousMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.find(true);
			}
		}, hoverService));

		this.nextBtn = this._register(new SimpleButton({
			label: NLS_NEXT_MATCH_BTN_LABEL,
			icon: findNextMatchIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.find(false);
			}
		}, hoverService));

		this.inSelectionToggle = this._register(new Toggle({
			icon: findSelectionIcon,
			title: NLS_TOGGLE_SELECTION_FIND_TITLE,
			isChecked: false,
			hoverLifecycleOptions,
			inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground),
			inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
			inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
		}));
		this.inSelectionToggle.domNode.style.display = 'inline';

		this._register(this.inSelectionToggle.onChange(() => {
			const checked = this.inSelectionToggle.checked;
			if (checked) {
				// selection logic:
				// 1. if there are multiple cells, do that.
				// 2. if there is only one cell, do the following:
				// 		- if there is a multi-line range highlighted, textual in selection
				// 		- if there is no range, cell in selection for that cell

				const cellSelection: ICellRange[] = this._notebookEditor.getSelections();
				const textSelection: Range[] = this._notebookEditor.getSelectionViewModels()[0].getSelections();

				if (cellSelection.length > 1 || cellSelection.some(range => range.end - range.start > 1)) {
					this._filters.findScope = {
						findScopeType: NotebookFindScopeType.Cells,
						selectedCellRanges: cellSelection
					};
					this.setCellSelectionDecorations();

				} else if (textSelection.length > 1 || textSelection.some(range => range.endLineNumber - range.startLineNumber >= 1)) {
					this._filters.findScope = {
						findScopeType: NotebookFindScopeType.Text,
						selectedCellRanges: cellSelection,
						selectedTextRanges: textSelection
					};
					this.setTextSelectionDecorations(textSelection, this._notebookEditor.getSelectionViewModels()[0]);

				} else {
					this._filters.findScope = {
						findScopeType: NotebookFindScopeType.Cells,
						selectedCellRanges: cellSelection
					};
					this.setCellSelectionDecorations();
				}
			} else {
				this._filters.findScope = {
					findScopeType: NotebookFindScopeType.None
				};
				this.clearCellSelectionDecorations();
				this.clearTextSelectionDecorations();
			}
		}));

		const closeBtn = this._register(new SimpleButton({
			label: NLS_CLOSE_BTN_LABEL,
			icon: widgetClose,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.hide();
			}
		}, hoverService));

		this._innerFindDomNode.appendChild(this._findInput.domNode);
		this._innerFindDomNode.appendChild(this._matchesCount);
		this._innerFindDomNode.appendChild(this.prevBtn.domNode);
		this._innerFindDomNode.appendChild(this.nextBtn.domNode);
		this._innerFindDomNode.appendChild(this.inSelectionToggle.domNode);
		this._innerFindDomNode.appendChild(closeBtn.domNode);

		// _domNode wraps _innerDomNode, ensuring that
		this._domNode.appendChild(this._innerFindDomNode);

		this.onkeyup(this._innerFindDomNode, e => {
			if (e.equals(KeyCode.Escape)) {
				this.hide();
				e.preventDefault();
				return;
			}
		});

		this._focusTracker = this._register(dom.trackFocus(this._domNode));
		this._register(this._focusTracker.onDidFocus(this.onFocusTrackerFocus.bind(this)));
		this._register(this._focusTracker.onDidBlur(this.onFocusTrackerBlur.bind(this)));

		this._findInputFocusTracker = this._register(dom.trackFocus(this._findInput.domNode));
		this._register(this._findInputFocusTracker.onDidFocus(this.onFindInputFocusTrackerFocus.bind(this)));
		this._register(this._findInputFocusTracker.onDidBlur(this.onFindInputFocusTrackerBlur.bind(this)));

		this._register(dom.addDisposableListener(this._innerFindDomNode, 'click', (event) => {
			event.stopPropagation();
		}));

		// Replace
		this._innerReplaceDomNode = document.createElement('div');
		this._innerReplaceDomNode.classList.add('simple-fr-replace-part');

		this._replaceInput = this._register(new ContextScopedReplaceInput(null, undefined, {
			label: NLS_REPLACE_INPUT_LABEL,
			placeholder: NLS_REPLACE_INPUT_PLACEHOLDER,
			history: replaceHistoryConfig === 'workspace' ? this._replaceWidgetHistory : new Set([]),
			inputBoxStyles: defaultInputBoxStyles,
			toggleStyles: defaultToggleStyles,
			hoverLifecycleOptions,
		}, contextKeyService, false));
		this._innerReplaceDomNode.appendChild(this._replaceInput.domNode);
		this._replaceInputFocusTracker = this._register(dom.trackFocus(this._replaceInput.domNode));
		this._register(this._replaceInputFocusTracker.onDidFocus(this.onReplaceInputFocusTrackerFocus.bind(this)));
		this._register(this._replaceInputFocusTracker.onDidBlur(this.onReplaceInputFocusTrackerBlur.bind(this)));

		// Replace History with update delayer
		this._updateReplaceHistoryDelayer = new Delayer<void>(500);

		this.oninput(this._replaceInput.domNode, (e) => {
			this._delayedUpdateReplaceHistory();
		});

		this._register(this._replaceInput.inputBox.onDidChange(() => {
			this._state.change({ replaceString: this._replaceInput.getValue() }, true);
		}));

		this._domNode.appendChild(this._innerReplaceDomNode);

		this._updateReplaceViewDisplay();

		this._replaceBtn = this._register(new SimpleButton({
			label: NLS_REPLACE_BTN_LABEL,
			icon: findReplaceIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.replaceOne();
			}
		}, hoverService));

		// Replace all button
		this._replaceAllBtn = this._register(new SimpleButton({
			label: NLS_REPLACE_ALL_BTN_LABEL,
			icon: findReplaceAllIcon,
			hoverLifecycleOptions,
			onTrigger: () => {
				this.replaceAll();
			}
		}, hoverService));

		this._innerReplaceDomNode.appendChild(this._replaceBtn.domNode);
		this._innerReplaceDomNode.appendChild(this._replaceAllBtn.domNode);

		this._resizeSash = this._register(new Sash(this._domNode, { getVerticalSashLeft: () => 0 }, { orientation: Orientation.VERTICAL, size: 2 }));

		this._register(this._resizeSash.onDidStart(() => {
			this._resizeOriginalWidth = this._getDomWidth();
		}));

		this._register(this._resizeSash.onDidChange((evt: ISashEvent) => {
			let width = this._resizeOriginalWidth + evt.startX - evt.currentX;
			if (width < NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH) {
				width = NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH;
			}

			const maxWidth = this._getMaxWidth();
			if (width > maxWidth) {
				width = maxWidth;
			}

			this._domNode.style.width = `${width}px`;

			if (this._isReplaceVisible) {
				this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
			}

			this._findInput.inputBox.layout();
		}));

		this._register(this._resizeSash.onDidReset(() => {
			// users double click on the sash
			// try to emulate what happens with editor findWidget
			const currentWidth = this._getDomWidth();
			let width = NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH;

			if (currentWidth <= NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH) {
				width = this._getMaxWidth();
			}

			this._domNode.style.width = `${width}px`;
			if (this._isReplaceVisible) {
				this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
			}

			this._findInput.inputBox.layout();
		}));
	}

	private _getMaxWidth() {
		return this._notebookEditor.getLayoutInfo().width - 64;
	}

	private _getDomWidth() {
		return dom.getTotalWidth(this._domNode) - (NOTEBOOK_FIND_WIDGET_INITIAL_HORIZONTAL_PADDING * 2);
	}

	getCellToolbarActions(menu: IMenu): { primary: IAction[]; secondary: IAction[] } {
		return getActionBarActions(menu.getActions({ shouldForwardArgs: true }), g => /^inline/.test(g));
	}

	protected abstract onInputChanged(): boolean;
	protected abstract find(previous: boolean): void;
	protected abstract replaceOne(): void;
	protected abstract replaceAll(): void;
	protected abstract onFocusTrackerFocus(): void;
	protected abstract onFocusTrackerBlur(): void;
	protected abstract onFindInputFocusTrackerFocus(): void;
	protected abstract onFindInputFocusTrackerBlur(): void;
	protected abstract onReplaceInputFocusTrackerFocus(): void;
	protected abstract onReplaceInputFocusTrackerBlur(): void;

	protected get inputValue() {
		return this._findInput.getValue();
	}

	protected get replaceValue() {
		return this._replaceInput.getValue();
	}

	protected get replacePattern() {
		if (this._state.isRegex) {
			return parseReplaceString(this.replaceValue);
		}
		return ReplacePattern.fromStaticValue(this.replaceValue);
	}

	public get focusTracker(): dom.IFocusTracker {
		return this._focusTracker;
	}

	public get isVisible(): boolean {
		return this._isVisible;
	}

	private _onStateChanged(e: FindReplaceStateChangedEvent): void {
		this._updateButtons();
		this._updateMatchesCount();
	}

	private _updateButtons(): void {
		this._findInput.setEnabled(this._isVisible);
		this._replaceInput.setEnabled(this._isVisible && this._isReplaceVisible);
		const findInputIsNonEmpty = (this._state.searchString.length > 0);
		this._replaceBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);
		this._replaceAllBtn.setEnabled(this._isVisible && this._isReplaceVisible && findInputIsNonEmpty);

		this._domNode.classList.toggle('replaceToggled', this._isReplaceVisible);
		this._toggleReplaceBtn.setExpanded(this._isReplaceVisible);

		this.foundMatch = this._state.matchesCount > 0;
		this.updateButtons(this.foundMatch);
	}

	private setCellSelectionDecorations() {
		const cellHandles: number[] = [];
		this._notebookEditor.getSelectionViewModels().forEach(viewModel => {
			cellHandles.push(viewModel.handle);
		});

		const decorations: INotebookDeltaDecoration[] = [];
		for (const handle of cellHandles) {
			decorations.push({
				handle: handle,
				options: { className: 'nb-multiCellHighlight', outputClassName: 'nb-multiCellHighlight' }
			} satisfies INotebookDeltaDecoration);
		}
		this.cellSelectionDecorationIds = this._notebookEditor.deltaCellDecorations([], decorations);
	}

	private clearCellSelectionDecorations() {
		this._notebookEditor.deltaCellDecorations(this.cellSelectionDecorationIds, []);
	}

	private setTextSelectionDecorations(textRanges: Range[], cell: ICellViewModel) {
		this._notebookEditor.changeModelDecorations(changeAccessor => {
			const decorations: ICellModelDeltaDecorations[] = [];
			for (const range of textRanges) {
				decorations.push({
					ownerId: cell.handle,
					decorations: [{
						range: range,
						options: {
							description: 'text search range for notebook search scope',
							isWholeLine: true,
							className: 'nb-findScope'
						}
					}]
				});
			}
			this.textSelectionDecorationIds = changeAccessor.deltaDecorations([], decorations);
		});
	}

	private clearTextSelectionDecorations() {
		this._notebookEditor.changeModelDecorations(changeAccessor => {
			changeAccessor.deltaDecorations(this.textSelectionDecorationIds, []);
		});
	}

	protected _updateMatchesCount(): void {
	}

	override dispose() {
		super.dispose();

		this._domNode.remove();
	}

	public getDomNode() {
		return this._domNode;
	}

	public reveal(initialInput?: string): void {
		if (initialInput) {
			this._findInput.setValue(initialInput);
		}

		if (this._isVisible) {
			this._findInput.select();
			return;
		}

		this._isVisible = true;
		this.updateButtons(this.foundMatch);

		setTimeout(() => {
			this._domNode.classList.add('visible', 'visible-transition');
			this._domNode.setAttribute('aria-hidden', 'false');
			this._findInput.select();
		}, 0);
	}

	public focus(): void {
		this._findInput.focus();
	}

	public show(initialInput?: string, options?: IShowNotebookFindWidgetOptions): void {
		if (initialInput) {
			this._findInput.setValue(initialInput);
		}

		this._isVisible = true;

		setTimeout(() => {
			this._domNode.classList.add('visible', 'visible-transition');
			this._domNode.setAttribute('aria-hidden', 'false');

			if (options?.focus ?? true) {
				this.focus();
			}
		}, 0);
	}

	public showWithReplace(initialInput?: string, replaceInput?: string): void {
		if (initialInput) {
			this._findInput.setValue(initialInput);
		}

		if (replaceInput) {
			this._replaceInput.setValue(replaceInput);
		}

		this._isVisible = true;
		this._isReplaceVisible = true;
		this._state.change({ isReplaceRevealed: this._isReplaceVisible }, false);
		this._updateReplaceViewDisplay();

		setTimeout(() => {
			this._domNode.classList.add('visible', 'visible-transition');
			this._domNode.setAttribute('aria-hidden', 'false');
			this._updateButtons();

			this._replaceInput.focus();
		}, 0);
	}

	private _updateReplaceViewDisplay(): void {
		if (this._isReplaceVisible) {
			this._innerReplaceDomNode.style.display = 'flex';
		} else {
			this._innerReplaceDomNode.style.display = 'none';
		}

		this._replaceInput.width = dom.getTotalWidth(this._findInput.domNode);
	}

	public hide(): void {
		if (this._isVisible) {
			this.inSelectionToggle.checked = false;
			this._notebookEditor.deltaCellDecorations(this.cellSelectionDecorationIds, []);
			this._notebookEditor.changeModelDecorations(changeAccessor => {
				changeAccessor.deltaDecorations(this.textSelectionDecorationIds, []);
			});

			this._domNode.classList.remove('visible-transition');
			this._domNode.setAttribute('aria-hidden', 'true');
			// Need to delay toggling visibility until after Transition, then visibility hidden - removes from tabIndex list
			setTimeout(() => {
				this._isVisible = false;
				this.updateButtons(this.foundMatch);
				this._domNode.classList.remove('visible');
			}, 200);
		}
	}

	protected _delayedUpdateFindHistory() {
		this._updateFindHistoryDelayer.trigger(this._updateFindHistory.bind(this));
	}

	protected _updateFindHistory() {
		this._findInput.inputBox.addToHistory();
	}

	protected _delayedUpdateReplaceHistory() {
		this._updateReplaceHistoryDelayer.trigger(this._updateReplaceHistory.bind(this));
	}

	protected _updateReplaceHistory() {
		this._replaceInput.inputBox.addToHistory();
	}

	protected _getRegexValue(): boolean {
		return this._findInput.getRegex();
	}

	protected _getWholeWordValue(): boolean {
		return this._findInput.getWholeWords();
	}

	protected _getCaseSensitiveValue(): boolean {
		return this._findInput.getCaseSensitive();
	}

	protected updateButtons(foundMatch: boolean) {
		const hasInput = this.inputValue.length > 0;
		this.prevBtn.setEnabled(this._isVisible && hasInput && foundMatch);
		this.nextBtn.setEnabled(this._isVisible && hasInput && foundMatch);
	}
}

// theming
registerThemingParticipant((theme, collector) => {
	collector.addRule(`
	.notebook-editor {
		--notebook-find-width: ${NOTEBOOK_FIND_WIDGET_INITIAL_WIDTH}px;
		--notebook-find-horizontal-padding: ${NOTEBOOK_FIND_WIDGET_INITIAL_HORIZONTAL_PADDING}px;
	}
	`);
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/notebookFindWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../../../base/browser/keyboardEvent.js';
import { alert as alertFn } from '../../../../../../base/browser/ui/aria/aria.js';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { Lazy } from '../../../../../../base/common/lazy.js';
import { Disposable } from '../../../../../../base/common/lifecycle.js';
import * as strings from '../../../../../../base/common/strings.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { FindMatch } from '../../../../../../editor/common/model.js';
import { MATCHES_LIMIT, CONTEXT_FIND_WIDGET_VISIBLE } from '../../../../../../editor/contrib/find/browser/findModel.js';
import { FindReplaceState } from '../../../../../../editor/contrib/find/browser/findState.js';
import { NLS_MATCHES_LOCATION, NLS_NO_RESULTS } from '../../../../../../editor/contrib/find/browser/findWidget.js';
import { FindWidgetSearchHistory } from '../../../../../../editor/contrib/find/browser/findWidgetSearchHistory.js';
import { ReplaceWidgetHistory } from '../../../../../../editor/contrib/find/browser/replaceWidgetHistory.js';
import { localize } from '../../../../../../nls.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../../../platform/storage/common/storage.js';
import { NotebookFindFilters } from './findFilters.js';
import { FindModel } from './findModel.js';
import { SimpleFindReplaceWidget } from './notebookFindReplaceWidget.js';
import { CellEditState, ICellViewModel, INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { INotebookFindScope } from '../../../common/notebookCommon.js';
import { KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED } from '../../../common/notebookContextKeys.js';

const FIND_HIDE_TRANSITION = 'find-hide-transition';
const FIND_SHOW_TRANSITION = 'find-show-transition';
let MAX_MATCHES_COUNT_WIDTH = 69;
const PROGRESS_BAR_DELAY = 200; // show progress for at least 200ms

export interface IShowNotebookFindWidgetOptions {
	isRegex?: boolean;
	wholeWord?: boolean;
	matchCase?: boolean;
	matchIndex?: number;
	focus?: boolean;
	searchStringSeededFrom?: { cell: ICellViewModel; range: Range };
	findScope?: INotebookFindScope;
}

export class NotebookFindContrib extends Disposable implements INotebookEditorContribution {

	static readonly id: string = 'workbench.notebook.find';

	private readonly _widget: Lazy<NotebookFindWidget>;

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this._widget = new Lazy(() => this._register(this.instantiationService.createInstance(NotebookFindWidget, this.notebookEditor)));
	}

	get widget(): NotebookFindWidget {
		return this._widget.value;
	}

	show(initialInput?: string, options?: IShowNotebookFindWidgetOptions): Promise<void> {
		return this._widget.value.show(initialInput, options);
	}

	hide() {
		this._widget.rawValue?.hide();
	}

	replace(searchString: string | undefined) {
		return this._widget.value.replace(searchString);
	}

	isVisible(): boolean {
		return this._widget.rawValue?.isVisible ?? false;
	}

	findNext(): void {
		if (this._widget.rawValue) {
			this._widget.value.findNext();
		}
	}

	findPrevious(): void {
		if (this._widget.rawValue) {
			this._widget.value.findPrevious();
		}
	}
}

class NotebookFindWidget extends SimpleFindReplaceWidget implements INotebookEditorContribution {
	protected _findWidgetFocused: IContextKey<boolean>;
	protected _findWidgetVisible: IContextKey<boolean>;
	private _isFocused: boolean = false;
	private _showTimeout: number | null = null;
	private _hideTimeout: number | null = null;
	private _previousFocusElement?: HTMLElement;
	private _findModel: FindModel;

	constructor(
		_notebookEditor: INotebookEditor,
		@IContextViewService contextViewService: IContextViewService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
	) {
		const findSearchHistory = FindWidgetSearchHistory.getOrCreate(storageService);
		const replaceHistory = ReplaceWidgetHistory.getOrCreate(storageService);

		super(contextViewService, contextKeyService, configurationService, contextMenuService, instantiationService, hoverService, new FindReplaceState<NotebookFindFilters>(), _notebookEditor, findSearchHistory, replaceHistory);
		this._findModel = new FindModel(this._notebookEditor, this._state, this._configurationService);

		DOM.append(this._notebookEditor.getDomNode(), this.getDomNode());
		this._findWidgetFocused = KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED.bindTo(contextKeyService);
		this._findWidgetVisible = CONTEXT_FIND_WIDGET_VISIBLE.bindTo(contextKeyService);
		this._register(this._findInput.onKeyDown((e) => this._onFindInputKeyDown(e)));
		this._register(this._replaceInput.onKeyDown((e) => this._onReplaceInputKeyDown(e)));

		this._register(this._state.onFindReplaceStateChange((e) => {
			this.onInputChanged();

			if (e.isSearching) {
				if (this._state.isSearching) {
					this._progressBar.infinite().show(PROGRESS_BAR_DELAY);
				} else {
					this._progressBar.stop().hide();
				}
			}

			if (this._findModel.currentMatch >= 0) {
				const currentMatch = this._findModel.getCurrentMatch();
				this._replaceBtn.setEnabled(currentMatch.isModelMatch);
			}

			const matches = this._findModel.findMatches;
			this._replaceAllBtn.setEnabled(matches.length > 0 && matches.find(match => match.webviewMatches.length > 0) === undefined);

			if (e.filters) {
				this._findInput.updateFilterState(this._state.filters?.isModified() ?? false);
			}
		}));

		this._register(DOM.addDisposableListener(this.getDomNode(), DOM.EventType.FOCUS, e => {
			this._previousFocusElement = DOM.isHTMLElement(e.relatedTarget) ? e.relatedTarget : undefined;
		}, true));
	}

	get findModel(): FindModel {
		return this._findModel;
	}

	get isFocused(): boolean {
		return this._isFocused;
	}

	private _onFindInputKeyDown(e: IKeyboardEvent): void {
		if (e.equals(KeyCode.Enter)) {
			this.find(false);
			e.preventDefault();
			return;
		} else if (e.equals(KeyMod.Shift | KeyCode.Enter)) {
			this.find(true);
			e.preventDefault();
			return;
		}
	}

	private _onReplaceInputKeyDown(e: IKeyboardEvent): void {
		if (e.equals(KeyCode.Enter)) {
			this.replaceOne();
			e.preventDefault();
			return;
		}
	}

	protected onInputChanged(): boolean {
		this._state.change({ searchString: this.inputValue }, false);
		// this._findModel.research();
		const findMatches = this._findModel.findMatches;
		if (findMatches && findMatches.length) {
			return true;
		}

		return false;
	}

	private findIndex(index: number): void {
		this._findModel.find({ index });
	}

	protected find(previous: boolean): void {
		this._findModel.find({ previous });
	}

	public findNext(): void {
		this.find(false);
	}

	public findPrevious(): void {
		this.find(true);
	}

	protected replaceOne() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		if (!this._findModel.findMatches.length) {
			return;
		}

		this._findModel.ensureFindMatches();

		if (this._findModel.currentMatch < 0) {
			this._findModel.find({ previous: false });
		}

		const currentMatch = this._findModel.getCurrentMatch();
		const cell = currentMatch.cell;
		if (currentMatch.isModelMatch) {
			const match = currentMatch.match as FindMatch;

			this._progressBar.infinite().show(PROGRESS_BAR_DELAY);

			const replacePattern = this.replacePattern;
			const replaceString = replacePattern.buildReplaceString(match.matches, this._state.preserveCase);

			const viewModel = this._notebookEditor.getViewModel();
			viewModel.replaceOne(cell, match.range, replaceString).then(() => {
				this._progressBar.stop();
			});
		} else {
			// this should not work
			console.error('Replace does not work for output match');
		}
	}

	protected replaceAll() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		this._progressBar.infinite().show(PROGRESS_BAR_DELAY);

		const replacePattern = this.replacePattern;

		const cellFindMatches = this._findModel.findMatches;
		const replaceStrings: string[] = [];
		cellFindMatches.forEach(cellFindMatch => {
			cellFindMatch.contentMatches.forEach(match => {
				const matches = match.matches;
				replaceStrings.push(replacePattern.buildReplaceString(matches, this._state.preserveCase));
			});
		});

		const viewModel = this._notebookEditor.getViewModel();
		viewModel.replaceAll(this._findModel.findMatches, replaceStrings).then(() => {
			this._progressBar.stop();
		});
	}

	protected findFirst(): void { }

	protected onFocusTrackerFocus() {
		this._findWidgetFocused.set(true);
		this._isFocused = true;
	}

	protected onFocusTrackerBlur() {
		this._previousFocusElement = undefined;
		this._findWidgetFocused.reset();
		this._isFocused = false;
	}

	protected onReplaceInputFocusTrackerFocus(): void {
		// throw new Error('Method not implemented.');
	}
	protected onReplaceInputFocusTrackerBlur(): void {
		// throw new Error('Method not implemented.');
	}

	protected onFindInputFocusTrackerFocus(): void { }
	protected onFindInputFocusTrackerBlur(): void { }

	override async show(initialInput?: string, options?: IShowNotebookFindWidgetOptions): Promise<void> {
		const searchStringUpdate = this._state.searchString !== initialInput;
		super.show(initialInput, options);
		this._state.change({ searchString: initialInput ?? this._state.searchString, isRevealed: true }, false);
		this._findWidgetVisible.set(true);

		if (typeof options?.matchIndex === 'number') {
			if (!this._findModel.findMatches.length) {
				await this._findModel.research();
			}
			this.findIndex(options.matchIndex);
		} else if (options?.focus !== false) {
			this._findInput.select();
		}

		if (!searchStringUpdate && options?.searchStringSeededFrom) {
			this._findModel.refreshCurrentMatch(options.searchStringSeededFrom);
		}

		if (this._showTimeout === null) {
			if (this._hideTimeout !== null) {
				DOM.getWindow(this.getDomNode()).clearTimeout(this._hideTimeout);
				this._hideTimeout = null;
				this._notebookEditor.removeClassName(FIND_HIDE_TRANSITION);
			}

			this._notebookEditor.addClassName(FIND_SHOW_TRANSITION);
			this._showTimeout = DOM.getWindow(this.getDomNode()).setTimeout(() => {
				this._notebookEditor.removeClassName(FIND_SHOW_TRANSITION);
				this._showTimeout = null;
			}, 200);
		} else {
			// no op
		}
	}

	replace(initialFindInput?: string, initialReplaceInput?: string) {
		super.showWithReplace(initialFindInput, initialReplaceInput);
		this._state.change({ searchString: initialFindInput ?? '', replaceString: initialReplaceInput ?? '', isRevealed: true }, false);
		this._replaceInput.select();

		if (this._showTimeout === null) {
			if (this._hideTimeout !== null) {
				DOM.getWindow(this.getDomNode()).clearTimeout(this._hideTimeout);
				this._hideTimeout = null;
				this._notebookEditor.removeClassName(FIND_HIDE_TRANSITION);
			}

			this._notebookEditor.addClassName(FIND_SHOW_TRANSITION);
			this._showTimeout = DOM.getWindow(this.getDomNode()).setTimeout(() => {
				this._notebookEditor.removeClassName(FIND_SHOW_TRANSITION);
				this._showTimeout = null;
			}, 200);
		} else {
			// no op
		}
	}

	override hide() {
		super.hide();
		this._state.change({ isRevealed: false }, false);
		this._findWidgetVisible.set(false);
		this._findModel.clear();
		this._notebookEditor.findStop();
		this._progressBar.stop();

		if (this._hideTimeout === null) {
			if (this._showTimeout !== null) {
				DOM.getWindow(this.getDomNode()).clearTimeout(this._showTimeout);
				this._showTimeout = null;
				this._notebookEditor.removeClassName(FIND_SHOW_TRANSITION);
			}
			this._notebookEditor.addClassName(FIND_HIDE_TRANSITION);
			this._hideTimeout = DOM.getWindow(this.getDomNode()).setTimeout(() => {
				this._notebookEditor.removeClassName(FIND_HIDE_TRANSITION);
			}, 200);
		} else {
			// no op
		}

		if (this._previousFocusElement && this._previousFocusElement.offsetParent) {
			this._previousFocusElement.focus();
			this._previousFocusElement = undefined;
		}

		if (this._notebookEditor.hasModel()) {
			for (let i = 0; i < this._notebookEditor.getLength(); i++) {
				const cell = this._notebookEditor.cellAt(i);

				if (cell.getEditState() === CellEditState.Editing && cell.editStateSource === 'find') {
					cell.updateEditState(CellEditState.Preview, 'closeFind');
				}
			}
		}
	}

	protected override _updateMatchesCount(): void {
		if (!this._findModel || !this._findModel.findMatches) {
			return;
		}

		this._matchesCount.style.minWidth = MAX_MATCHES_COUNT_WIDTH + 'px';
		this._matchesCount.title = '';

		// remove previous content
		this._matchesCount.firstChild?.remove();

		let label: string;

		if (this._state.matchesCount > 0) {
			let matchesCount: string = String(this._state.matchesCount);
			if (this._state.matchesCount >= MATCHES_LIMIT) {
				matchesCount += '+';
			}
			const matchesPosition: string = this._findModel.currentMatch < 0 ? '?' : String((this._findModel.currentMatch + 1));
			label = strings.format(NLS_MATCHES_LOCATION, matchesPosition, matchesCount);
		} else {
			label = NLS_NO_RESULTS;
		}

		this._matchesCount.appendChild(document.createTextNode(label));

		alertFn(this._getAriaLabel(label, this._state.currentMatch, this._state.searchString));
		MAX_MATCHES_COUNT_WIDTH = Math.max(MAX_MATCHES_COUNT_WIDTH, this._matchesCount.clientWidth);
	}

	private _getAriaLabel(label: string, currentMatch: Range | null, searchString: string): string {
		if (label === NLS_NO_RESULTS) {
			return searchString === ''
				? localize('ariaSearchNoResultEmpty', "{0} found", label)
				: localize('ariaSearchNoResult', "{0} found for '{1}'", label, searchString);
		}

		// TODO@rebornix, aria for `cell ${index}, line {line}`
		return localize('ariaSearchNoResultWithLineNumNoCurrentMatch', "{0} found for '{1}'", label, searchString);
	}
	override dispose() {
		this._notebookEditor?.removeClassName(FIND_SHOW_TRANSITION);
		this._notebookEditor?.removeClassName(FIND_HIDE_TRANSITION);
		this._findModel.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/find/media/notebookFind.css]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/find/media/notebookFind.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .notebookOverlay.notebook-editor.find-hide-transition {
	overflow-y: hidden;
}

.monaco-workbench .notebookOverlay.notebook-editor.find-show-transition {
	overflow-y: hidden;
}

.monaco-workbench .notebookOverlay.notebook-editor .simple-fr-find-part-wrapper .matchesCount {
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	padding: 0 2px;
	box-sizing: border-box;
}

.monaco-workbench .nb-findScope {
	background-color: var(--vscode-editor-findRangeHighlightBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/format/formatting.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/format/formatting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../../nls.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { EditorAction, registerEditorAction } from '../../../../../../editor/browser/editorExtensions.js';
import { IBulkEditService, ResourceTextEdit } from '../../../../../../editor/browser/services/bulkEditService.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { IEditorWorkerService } from '../../../../../../editor/common/services/editorWorker.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { FormattingMode, formatDocumentWithSelectedProvider, getDocumentFormattingEditsWithSelectedProvider } from '../../../../../../editor/contrib/format/browser/format.js';
import { Action2, MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Progress } from '../../../../../../platform/progress/common/progress.js';
import { NOTEBOOK_ACTIONS_CATEGORY } from '../../controller/coreActions.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { NOTEBOOK_EDITOR_EDITABLE, NOTEBOOK_IS_ACTIVE_EDITOR } from '../../../common/notebookContextKeys.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { INotebookCellExecution } from '../../../common/notebookExecutionStateService.js';
import { ICellExecutionParticipant, INotebookExecutionService } from '../../../common/notebookExecutionService.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchContributionsExtensions } from '../../../../../common/contributions.js';
import { INotebookService } from '../../../common/notebookService.js';
import { CodeActionParticipantUtils } from '../saveParticipants/saveParticipants.js';

// format notebook
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.format',
			title: localize2('format.title', 'Format Notebook'),
			category: NOTEBOOK_ACTIONS_CATEGORY,
			precondition: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_EDITOR_EDITABLE),
			keybinding: {
				when: EditorContextKeys.editorTextFocus.toNegated(),
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI },
				weight: KeybindingWeight.WorkbenchContrib
			},
			f1: true,
			menu: {
				id: MenuId.EditorContext,
				when: ContextKeyExpr.and(EditorContextKeys.inCompositeEditor, EditorContextKeys.hasDocumentFormattingProvider),
				group: '1_modification',
				order: 1.3
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const textModelService = accessor.get(ITextModelService);
		const editorWorkerService = accessor.get(IEditorWorkerService);
		const languageFeaturesService = accessor.get(ILanguageFeaturesService);
		const bulkEditService = accessor.get(IBulkEditService);
		const instantiationService = accessor.get(IInstantiationService);

		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!editor || !editor.hasModel()) {
			return;
		}

		const notebook = editor.textModel;

		const formatApplied: boolean = await instantiationService.invokeFunction(CodeActionParticipantUtils.checkAndRunFormatCodeAction, notebook, Progress.None, CancellationToken.None);

		const disposable = new DisposableStore();
		try {
			if (!formatApplied) {
				const allCellEdits = await Promise.all(notebook.cells.map(async cell => {
					const ref = await textModelService.createModelReference(cell.uri);
					disposable.add(ref);

					const model = ref.object.textEditorModel;

					const formatEdits = await getDocumentFormattingEditsWithSelectedProvider(
						editorWorkerService,
						languageFeaturesService,
						model,
						FormattingMode.Explicit,
						CancellationToken.None
					);

					const edits: ResourceTextEdit[] = [];

					if (formatEdits) {
						for (const edit of formatEdits) {
							edits.push(new ResourceTextEdit(model.uri, edit, model.getVersionId()));
						}

						return edits;
					}

					return [];
				}));

				await bulkEditService.apply(/* edit */allCellEdits.flat(), { label: localize('label', "Format Notebook"), code: 'undoredo.formatNotebook', });
			}
		} finally {
			disposable.dispose();
		}
	}
});

// format cell
registerEditorAction(class FormatCellAction extends EditorAction {
	constructor() {
		super({
			id: 'notebook.formatCell',
			label: localize2('formatCell.label', "Format Cell"),
			precondition: ContextKeyExpr.and(NOTEBOOK_IS_ACTIVE_EDITOR, NOTEBOOK_EDITOR_EDITABLE, EditorContextKeys.inCompositeEditor, EditorContextKeys.writable, EditorContextKeys.hasDocumentFormattingProvider),
			kbOpts: {
				kbExpr: ContextKeyExpr.and(EditorContextKeys.editorTextFocus),
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyF,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI },
				weight: KeybindingWeight.EditorContrib
			},
			contextMenuOpts: {
				group: '1_modification',
				order: 1.301
			}
		});
	}

	async run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> {
		if (editor.hasModel()) {
			const instaService = accessor.get(IInstantiationService);
			await instaService.invokeFunction(formatDocumentWithSelectedProvider, editor, FormattingMode.Explicit, Progress.None, CancellationToken.None, true);
		}
	}
});

class FormatOnCellExecutionParticipant implements ICellExecutionParticipant {
	constructor(
		@IBulkEditService private readonly bulkEditService: IBulkEditService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotebookService private readonly _notebookService: INotebookService,
	) {
	}

	async onWillExecuteCell(executions: INotebookCellExecution[]): Promise<void> {

		const enabled = this.configurationService.getValue<boolean>(NotebookSetting.formatOnCellExecution);
		if (!enabled) {
			return;
		}

		const disposable = new DisposableStore();
		try {
			const allCellEdits = await Promise.all(executions.map(async cellExecution => {
				const nbModel = this._notebookService.getNotebookTextModel(cellExecution.notebook);
				if (!nbModel) {
					return [];
				}
				let activeCell;
				for (const cell of nbModel.cells) {
					if (cell.handle === cellExecution.cellHandle) {
						activeCell = cell;
						break;
					}
				}
				if (!activeCell) {
					return [];
				}

				const ref = await this.textModelService.createModelReference(activeCell.uri);
				disposable.add(ref);

				const model = ref.object.textEditorModel;

				const formatEdits = await getDocumentFormattingEditsWithSelectedProvider(
					this.editorWorkerService,
					this.languageFeaturesService,
					model,
					FormattingMode.Silent,
					CancellationToken.None
				);

				const edits: ResourceTextEdit[] = [];

				if (formatEdits) {
					edits.push(...formatEdits.map(edit => new ResourceTextEdit(model.uri, edit, model.getVersionId())));
					return edits;
				}

				return [];
			}));

			await this.bulkEditService.apply(/* edit */allCellEdits.flat(), { label: localize('formatCells.label', "Format Cells"), code: 'undoredo.notebooks.onWillExecuteFormat', });

		} finally {
			disposable.dispose();
		}
	}
}

export class CellExecutionParticipantsContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@INotebookExecutionService private readonly notebookExecutionService: INotebookExecutionService
	) {
		super();
		this.registerKernelExecutionParticipants();
	}

	private registerKernelExecutionParticipants(): void {
		this._register(this.notebookExecutionService.registerExecutionParticipant(this.instantiationService.createInstance(FormatOnCellExecutionParticipant)));
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchContributionsExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(CellExecutionParticipantsContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/gettingStarted/notebookGettingStarted.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/gettingStarted/notebookGettingStarted.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../../base/common/lifecycle.js';
import { localize2 } from '../../../../../../nls.js';
import { Categories } from '../../../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../../platform/storage/common/storage.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../../../common/contributions.js';
import { Memento } from '../../../../../common/memento.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';
import { HAS_OPENED_NOTEBOOK } from '../../../common/notebookContextKeys.js';
import { NotebookEditorInput } from '../../../common/notebookEditorInput.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';

const hasOpenedNotebookKey = 'hasOpenedNotebook';
const hasShownGettingStartedKey = 'hasShownNotebookGettingStarted';

interface INotebookGettingStartedMemento {
	hasOpenedNotebook?: boolean;
	hasShownNotebookGettingStarted?: boolean;
}

/**
 * Sets a context key when a notebook has ever been opened by the user
 */
export class NotebookGettingStarted extends Disposable implements IWorkbenchContribution {

	constructor(
		@IEditorService _editorService: IEditorService,
		@IStorageService _storageService: IStorageService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@ICommandService _commandService: ICommandService,
		@IConfigurationService _configurationService: IConfigurationService,
	) {
		super();

		const hasOpenedNotebook = HAS_OPENED_NOTEBOOK.bindTo(_contextKeyService);
		const memento = new Memento<INotebookGettingStartedMemento>('notebookGettingStarted2', _storageService);
		const storedValue = memento.getMemento(StorageScope.PROFILE, StorageTarget.USER);
		if (storedValue[hasOpenedNotebookKey]) {
			hasOpenedNotebook.set(true);
		}

		const needToShowGettingStarted = _configurationService.getValue(NotebookSetting.openGettingStarted) && !storedValue[hasShownGettingStartedKey];
		if (!storedValue[hasOpenedNotebookKey] || needToShowGettingStarted) {
			const onDidOpenNotebook = () => {
				hasOpenedNotebook.set(true);
				storedValue[hasOpenedNotebookKey] = true;

				if (needToShowGettingStarted) {
					_commandService.executeCommand('workbench.action.openWalkthrough', { category: 'notebooks', step: 'notebookProfile' }, true);
					storedValue[hasShownGettingStartedKey] = true;
				}

				memento.saveMemento();
			};

			if (_editorService.activeEditor?.typeId === NotebookEditorInput.ID) {
				// active editor is notebook
				onDidOpenNotebook();
				return;
			}

			const listener = this._register(_editorService.onDidActiveEditorChange(() => {
				if (_editorService.activeEditor?.typeId === NotebookEditorInput.ID) {
					listener.dispose();
					onDidOpenNotebook();
				}
			}));
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(NotebookGettingStarted, LifecyclePhase.Restored);

registerAction2(class NotebookClearNotebookLayoutAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.notebook.layout.gettingStarted',
			title: localize2('workbench.notebook.layout.gettingStarted.label', "Reset notebook getting started"),
			f1: true,
			precondition: ContextKeyExpr.equals(`config.${NotebookSetting.openGettingStarted}`, true),
			category: Categories.Developer,
		});
	}
	run(accessor: ServicesAccessor): void {
		const storageService = accessor.get(IStorageService);
		const memento = new Memento<INotebookGettingStartedMemento>('notebookGettingStarted', storageService);

		const storedValue = memento.getMemento(StorageScope.PROFILE, StorageTarget.USER);
		storedValue[hasOpenedNotebookKey] = undefined;
		memento.saveMemento();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/kernelDetection/notebookKernelDetection.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/kernelDetection/notebookKernelDetection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Disposable, DisposableStore, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../../../common/contributions.js';
import { INotebookKernelService } from '../../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../../common/notebookLoggingService.js';
import { IExtensionService } from '../../../../../services/extensions/common/extensions.js';
import { LifecyclePhase } from '../../../../../services/lifecycle/common/lifecycle.js';

class NotebookKernelDetection extends Disposable implements IWorkbenchContribution {
	private _detectionMap = new Map<string, IDisposable>();
	private readonly _localDisposableStore = this._register(new DisposableStore());

	constructor(
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@INotebookLoggingService private readonly _notebookLoggingService: INotebookLoggingService
	) {
		super();

		this._registerListeners();
	}

	private _registerListeners() {
		this._localDisposableStore.clear();

		this._localDisposableStore.add(this._extensionService.onWillActivateByEvent(e => {
			if (e.event.startsWith('onNotebook:')) {
				if (this._extensionService.activationEventIsDone(e.event)) {
					return;
				}

				// parse the event to get the notebook type
				const notebookType = e.event.substring('onNotebook:'.length);

				if (notebookType === '*') {
					// ignore
					return;
				}

				let shouldStartDetection = false;

				const extensionStatus = this._extensionService.getExtensionsStatus();
				this._extensionService.extensions.forEach(extension => {
					if (extensionStatus[extension.identifier.value].activationTimes) {
						// already activated
						return;
					}
					if (extension.activationEvents?.includes(e.event)) {
						shouldStartDetection = true;
					}
				});

				if (shouldStartDetection && !this._detectionMap.has(notebookType)) {
					this._notebookLoggingService.debug('KernelDetection', `start extension activation for ${notebookType}`);
					const task = this._notebookKernelService.registerNotebookKernelDetectionTask({
						notebookType: notebookType
					});

					this._detectionMap.set(notebookType, task);
				}
			}
		}));

		let timer: Timeout | null = null;

		this._localDisposableStore.add(this._extensionService.onDidChangeExtensionsStatus(() => {
			if (timer) {
				clearTimeout(timer);
			}

			// activation state might not be updated yet, postpone to next frame
			timer = setTimeout(() => {
				const taskToDelete: string[] = [];
				for (const [notebookType, task] of this._detectionMap) {
					if (this._extensionService.activationEventIsDone(`onNotebook:${notebookType}`)) {
						this._notebookLoggingService.debug('KernelDetection', `finish extension activation for ${notebookType}`);
						taskToDelete.push(notebookType);
						task.dispose();
					}
				}

				taskToDelete.forEach(notebookType => {
					this._detectionMap.delete(notebookType);
				});
			});
		}));

		this._localDisposableStore.add({
			dispose: () => {
				if (timer) {
					clearTimeout(timer);
				}
			}
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(NotebookKernelDetection, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/layout/layoutActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/layout/layoutActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { INotebookActionContext, NOTEBOOK_ACTIONS_CATEGORY } from '../../controller/coreActions.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';

const TOGGLE_CELL_TOOLBAR_POSITION = 'notebook.toggleCellToolbarPosition';

export class ToggleCellToolbarPositionAction extends Action2 {
	constructor() {
		super({
			id: TOGGLE_CELL_TOOLBAR_POSITION,
			title: localize2('notebook.toggleCellToolbarPosition', 'Toggle Cell Toolbar Position'),
			menu: [{
				id: MenuId.NotebookCellTitle,
				group: 'View',
				order: 1
			}],
			category: NOTEBOOK_ACTIONS_CATEGORY,
			f1: false
		});
	}

	async run(accessor: ServicesAccessor, context: any): Promise<void> {
		const editor = context && context.ui ? (context as INotebookActionContext).notebookEditor : undefined;
		if (editor && editor.hasModel()) {
			// from toolbar
			const viewType = editor.textModel.viewType;
			const configurationService = accessor.get(IConfigurationService);
			const toolbarPosition = configurationService.getValue<string | { [key: string]: string }>(NotebookSetting.cellToolbarLocation);
			const newConfig = this.togglePosition(viewType, toolbarPosition);
			await configurationService.updateValue(NotebookSetting.cellToolbarLocation, newConfig);
		}
	}

	togglePosition(viewType: string, toolbarPosition: string | { [key: string]: string }): { [key: string]: string } {
		if (typeof toolbarPosition === 'string') {
			// legacy
			if (['left', 'right', 'hidden'].indexOf(toolbarPosition) >= 0) {
				// valid position
				const newViewValue = toolbarPosition === 'right' ? 'left' : 'right';
				const config: { [key: string]: string } = {
					default: toolbarPosition
				};
				config[viewType] = newViewValue;
				return config;
			} else {
				// invalid position
				const config: { [key: string]: string } = {
					default: 'right',
				};
				config[viewType] = 'left';
				return config;
			}
		} else {
			const oldValue = toolbarPosition[viewType] ?? toolbarPosition['default'] ?? 'right';
			const newViewValue = oldValue === 'right' ? 'left' : 'right';
			const newConfig = {
				...toolbarPosition
			};
			newConfig[viewType] = newViewValue;
			return newConfig;
		}

	}
}
registerAction2(ToggleCellToolbarPositionAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/marker/markerProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/marker/markerProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../../../common/contributions.js';
import { IMarkerListProvider, MarkerList, IMarkerNavigationService } from '../../../../../../editor/contrib/gotoError/browser/markerNavigationService.js';
import { CellUri } from '../../../common/notebookCommon.js';
import { IMarkerService, MarkerSeverity } from '../../../../../../platform/markers/common/markers.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { INotebookDeltaDecoration, INotebookEditor, INotebookEditorContribution, NotebookOverviewRulerLane } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { throttle } from '../../../../../../base/common/decorators.js';
import { editorErrorForeground, editorWarningForeground } from '../../../../../../platform/theme/common/colorRegistry.js';
import { isEqual } from '../../../../../../base/common/resources.js';

class MarkerListProvider implements IMarkerListProvider {

	static readonly ID = 'workbench.contrib.markerListProvider';

	private readonly _dispoables: IDisposable;

	constructor(
		@IMarkerService private readonly _markerService: IMarkerService,
		@IMarkerNavigationService markerNavigation: IMarkerNavigationService,
		@IConfigurationService private readonly _configService: IConfigurationService
	) {
		this._dispoables = markerNavigation.registerProvider(this);
	}

	dispose() {
		this._dispoables.dispose();
	}

	getMarkerList(resource: URI | undefined): MarkerList | undefined {
		if (!resource) {
			return undefined;
		}
		const data = CellUri.parse(resource);
		if (!data) {
			return undefined;
		}
		return new MarkerList(uri => {
			const otherData = CellUri.parse(uri);
			return otherData?.notebook.toString() === data.notebook.toString();
		}, this._markerService, this._configService);
	}
}

class NotebookMarkerDecorationContribution extends Disposable implements INotebookEditorContribution {
	static id: string = 'workbench.notebook.markerDecoration';
	private _markersOverviewRulerDecorations: string[] = [];
	constructor(
		private readonly _notebookEditor: INotebookEditor,
		@IMarkerService private readonly _markerService: IMarkerService
	) {
		super();

		this._update();
		this._register(this._notebookEditor.onDidChangeModel(() => this._update()));
		this._register(this._markerService.onMarkerChanged(e => {
			if (e.some(uri => this._notebookEditor.getCellsInRange().some(cell => isEqual(cell.uri, uri)))) {
				this._update();
			}
		}));
	}

	@throttle(100)
	private _update() {
		if (!this._notebookEditor.hasModel()) {
			return;
		}

		const cellDecorations: INotebookDeltaDecoration[] = [];
		this._notebookEditor.getCellsInRange().forEach(cell => {
			const marker = this._markerService.read({ resource: cell.uri, severities: MarkerSeverity.Error | MarkerSeverity.Warning });
			marker.forEach(m => {
				const color = m.severity === MarkerSeverity.Error ? editorErrorForeground : editorWarningForeground;
				const range = { startLineNumber: m.startLineNumber, startColumn: m.startColumn, endLineNumber: m.endLineNumber, endColumn: m.endColumn };
				cellDecorations.push({
					handle: cell.handle,
					options: {
						overviewRuler: {
							color: color,
							modelRanges: [range],
							includeOutput: false,
							position: NotebookOverviewRulerLane.Right
						}
					}
				});
			});
		});

		this._markersOverviewRulerDecorations = this._notebookEditor.deltaCellDecorations(this._markersOverviewRulerDecorations, cellDecorations);
	}
}

registerWorkbenchContribution2(MarkerListProvider.ID, MarkerListProvider, WorkbenchPhase.BlockRestore);

registerNotebookContribution(NotebookMarkerDecorationContribution.id, NotebookMarkerDecorationContribution);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/multicursor/notebookMulticursor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/multicursor/notebookMulticursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../nls.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { URI } from '../../../../../../base/common/uri.js';
import { EditorConfiguration } from '../../../../../../editor/browser/config/editorConfiguration.js';
import { CoreEditingCommands } from '../../../../../../editor/browser/coreCommands.js';
import { ICodeEditor, PastePayload } from '../../../../../../editor/browser/editorBrowser.js';
import { RedoCommand, UndoCommand } from '../../../../../../editor/browser/editorExtensions.js';
import { CodeEditorWidget } from '../../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IEditorConfiguration } from '../../../../../../editor/common/config/editorConfiguration.js';
import { cursorBlinkingStyleFromString, cursorStyleFromString, TextEditorCursorBlinkingStyle, TextEditorCursorStyle } from '../../../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { Selection, SelectionDirection } from '../../../../../../editor/common/core/selection.js';
import { IWordAtPosition, USUAL_WORD_SEPARATORS } from '../../../../../../editor/common/core/wordHelper.js';
import { CommandExecutor, CursorsController } from '../../../../../../editor/common/cursor/cursor.js';
import { DeleteOperations } from '../../../../../../editor/common/cursor/cursorDeleteOperations.js';
import { CursorConfiguration, ICursorSimpleModel } from '../../../../../../editor/common/cursorCommon.js';
import { CursorChangeReason } from '../../../../../../editor/common/cursorEvents.js';
import { CompositionTypePayload, Handler, ITriggerEditorOperationEvent, ReplacePreviousCharPayload } from '../../../../../../editor/common/editorCommon.js';
import { ILanguageConfigurationService } from '../../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { IModelDeltaDecoration, ITextModel, PositionAffinity } from '../../../../../../editor/common/model.js';
import { indentOfLine } from '../../../../../../editor/common/model/textModel.js';
import { ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { ViewModelEventsCollector } from '../../../../../../editor/common/viewModelEventDispatcher.js';
import { IAccessibilityService } from '../../../../../../platform/accessibility/common/accessibility.js';
import { MenuId, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IPastFutureElements, IUndoRedoElement, IUndoRedoService, UndoRedoElementType } from '../../../../../../platform/undoRedo/common/undoRedo.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../../../common/contributions.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED, NOTEBOOK_CELL_EDITOR_FOCUSED, NOTEBOOK_IS_ACTIVE_EDITOR } from '../../../common/notebookContextKeys.js';
import { INotebookActionContext, NotebookAction } from '../../controller/coreActions.js';
import { CellFindMatchWithIndex, getNotebookEditorFromEditorPane, ICellViewModel, INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';
import { CellEditorOptions } from '../../view/cellParts/cellEditorOptions.js';
import { NotebookFindContrib } from '../find/notebookFindWidget.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { ICoordinatesConverter } from '../../../../../../editor/common/coordinatesConverter.js';

const NOTEBOOK_ADD_FIND_MATCH_TO_SELECTION_ID = 'notebook.addFindMatchToSelection';
const NOTEBOOK_SELECT_ALL_FIND_MATCHES_ID = 'notebook.selectAllFindMatches';

export enum NotebookMultiCursorState {
	Idle,
	Selecting,
	Editing,
}

interface NotebookCursorConfig {
	cursorStyle: TextEditorCursorStyle;
	cursorBlinking: TextEditorCursorBlinkingStyle;
	cursorSmoothCaretAnimation: 'off' | 'explicit' | 'on';
}

interface SelectionTranslation {
	deltaStartCol: number;
	deltaStartLine: number;
	deltaEndCol: number;
	deltaEndLine: number;
}

interface TrackedCell {
	cellViewModel: ICellViewModel;
	initialSelection: Selection;
	matchSelections: Selection[];
	editorConfig: IEditorConfiguration;
	cursorConfig: NotebookCursorConfig;
	decorationIds: string[];
	undoRedoHistory: IPastFutureElements;
}

export const NOTEBOOK_MULTI_CURSOR_CONTEXT = {
	IsNotebookMultiCursor: new RawContextKey<boolean>('isNotebookMultiSelect', false),
	NotebookMultiSelectCursorState: new RawContextKey<NotebookMultiCursorState>('notebookMultiSelectCursorState', NotebookMultiCursorState.Idle),
};

export class NotebookMultiCursorController extends Disposable implements INotebookEditorContribution {

	static readonly id: string = 'notebook.multiCursorController';

	private word: string;
	private startPosition: {
		cellIndex: number;
		position: Position;
	} | undefined;
	private trackedCells: TrackedCell[];
	private totalMatchesCount: number;

	private readonly _onDidChangeAnchorCell;
	readonly onDidChangeAnchorCell: Event<void>;
	private anchorCell: [ICellViewModel, ICodeEditor] | undefined;

	private readonly anchorDisposables;
	private readonly cursorsDisposables;
	private cursorsControllers: ResourceMap<CursorsController>;

	private state: NotebookMultiCursorState;
	public getState(): NotebookMultiCursorState {
		return this.state;
	}

	private _nbIsMultiSelectSession;
	private _nbMultiSelectState;

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ILanguageConfigurationService private readonly languageConfigurationService: ILanguageConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUndoRedoService private readonly undoRedoService: IUndoRedoService,
	) {
		super();
		this.word = '';
		this.trackedCells = [];
		this.totalMatchesCount = 0;
		this._onDidChangeAnchorCell = this._register(new Emitter<void>());
		this.onDidChangeAnchorCell = this._onDidChangeAnchorCell.event;
		this.anchorDisposables = this._register(new DisposableStore());
		this.cursorsDisposables = this._register(new DisposableStore());
		this.cursorsControllers = new ResourceMap<CursorsController>();
		this.state = NotebookMultiCursorState.Idle;
		this._nbIsMultiSelectSession = NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor.bindTo(this.contextKeyService);
		this._nbMultiSelectState = NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.bindTo(this.contextKeyService);

		this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;

		// anchor cell will catch and relay all type, cut, paste events to the cursors controllers
		// need to create new controllers when the anchor cell changes, then update their listeners
		// ** cursor controllers need to happen first, because anchor listeners relay to them
		this._register(this.onDidChangeAnchorCell(async () => {
			await this.syncCursorsControllers();
			this.syncAnchorListeners();
		}));
	}

	private syncAnchorListeners() {
		this.anchorDisposables.clear();

		if (!this.anchorCell) {
			throw new Error('Anchor cell is undefined');
		}

		// typing
		this.anchorDisposables.add(this.anchorCell[1].onWillType((input) => {
			const collector = new ViewModelEventsCollector();
			this.trackedCells.forEach(cell => {
				const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
				if (!controller) {
					// should not happen
					return;
				}
				if (cell.cellViewModel.handle !== this.anchorCell?.[0].handle) { // don't relay to active cell, already has a controller for typing
					controller.type(collector, input, 'keyboard');
				}
			});
		}));

		this.anchorDisposables.add(this.anchorCell[1].onDidType(() => {
			this.state = NotebookMultiCursorState.Editing; // typing will continue to work as normal across ranges, just preps for another cmd+d
			this._nbMultiSelectState.set(NotebookMultiCursorState.Editing);

			const anchorController = this.cursorsControllers.get(this.anchorCell![0].uri);
			if (!anchorController) {
				return;
			}
			const activeSelections = this.notebookEditor.activeCodeEditor?.getSelections();
			if (!activeSelections) {
				return;
			}

			// need to keep anchor cursor controller in sync manually (for delete usage), since we don't relay type event to it
			anchorController.setSelections(new ViewModelEventsCollector(), 'keyboard', activeSelections, CursorChangeReason.Explicit);

			this.trackedCells.forEach(cell => {
				const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
				if (!controller) {
					return;
				}

				// this is used upon exiting the multicursor session to set the selections back to the correct cursor state
				cell.initialSelection = controller.getSelection();
				// clear tracked selection data as it is invalid once typing begins
				cell.matchSelections = [];
			});

			this.updateLazyDecorations();
		}));

		// arrow key navigation
		this.anchorDisposables.add(this.anchorCell[1].onDidChangeCursorSelection((e) => {
			if (e.source === 'mouse') {
				this.resetToIdleState();
				return;
			}

			// ignore this event if it was caused by a typing event or a delete (NotSet and RecoverFromMarkers respectively)
			if (!e.oldSelections || e.reason === CursorChangeReason.NotSet || e.reason === CursorChangeReason.RecoverFromMarkers) {
				return;
			}

			const translation: SelectionTranslation = {
				deltaStartCol: e.selection.startColumn - e.oldSelections[0].startColumn,
				deltaStartLine: e.selection.startLineNumber - e.oldSelections[0].startLineNumber,
				deltaEndCol: e.selection.endColumn - e.oldSelections[0].endColumn,
				deltaEndLine: e.selection.endLineNumber - e.oldSelections[0].endLineNumber,
			};
			const translationDir = e.selection.getDirection();

			this.trackedCells.forEach(cell => {
				const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
				if (!controller) {
					return;
				}

				const newSelections = controller.getSelections().map(selection => {
					const newStartCol = selection.startColumn + translation.deltaStartCol;
					const newStartLine = selection.startLineNumber + translation.deltaStartLine;
					const newEndCol = selection.endColumn + translation.deltaEndCol;
					const newEndLine = selection.endLineNumber + translation.deltaEndLine;
					return Selection.createWithDirection(newStartLine, newStartCol, newEndLine, newEndCol, translationDir);
				});

				controller.setSelections(new ViewModelEventsCollector(), e.source, newSelections, CursorChangeReason.Explicit);
			});

			this.updateLazyDecorations();
		}));

		// core actions
		this.anchorDisposables.add(this.anchorCell[1].onWillTriggerEditorOperationEvent((e) => {
			this.handleEditorOperationEvent(e);
		}));

		// exit mode
		this.anchorDisposables.add(this.anchorCell[1].onDidBlurEditorWidget(() => {
			if (this.state === NotebookMultiCursorState.Selecting || this.state === NotebookMultiCursorState.Editing) {
				this.resetToIdleState();
			}
		}));
	}

	private async syncCursorsControllers() {
		this.cursorsDisposables.clear(); // TODO: dial this back for perf and just update the relevant controllers
		await Promise.all(this.trackedCells.map(async cell => {
			const controller = await this.createCursorController(cell);
			if (!controller) {
				return;
			}
			this.cursorsControllers.set(cell.cellViewModel.uri, controller);

			const selections = cell.matchSelections;
			controller.setSelections(new ViewModelEventsCollector(), undefined, selections, CursorChangeReason.Explicit);
		}));

		this.updateLazyDecorations();
	}

	private async createCursorController(cell: TrackedCell): Promise<CursorsController | undefined> {
		const textModelRef = await this.textModelService.createModelReference(cell.cellViewModel.uri);
		const textModel = textModelRef.object.textEditorModel;
		if (!textModel) {
			return undefined;
		}

		const cursorSimpleModel = this.constructCursorSimpleModel(cell.cellViewModel);
		const converter = this.constructCoordinatesConverter();
		const editorConfig = cell.editorConfig;

		const controller = this.cursorsDisposables.add(new CursorsController(
			textModel,
			cursorSimpleModel,
			converter,
			new CursorConfiguration(textModel.getLanguageId(), textModel.getOptions(), editorConfig, this.languageConfigurationService)
		));

		controller.setSelections(new ViewModelEventsCollector(), undefined, cell.matchSelections, CursorChangeReason.Explicit);
		return controller;
	}

	private constructCoordinatesConverter(): ICoordinatesConverter {
		return {
			convertViewPositionToModelPosition(viewPosition: Position): Position {
				return viewPosition;
			},
			convertViewRangeToModelRange(viewRange: Range): Range {
				return viewRange;
			},
			validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position {
				return viewPosition;
			},
			validateViewRange(viewRange: Range, expectedModelRange: Range): Range {
				return viewRange;
			},
			convertModelPositionToViewPosition(modelPosition: Position, affinity?: PositionAffinity, allowZeroLineNumber?: boolean, belowHiddenRanges?: boolean): Position {
				return modelPosition;
			},
			convertModelRangeToViewRange(modelRange: Range, affinity?: PositionAffinity): Range {
				return modelRange;
			},
			modelPositionIsVisible(modelPosition: Position): boolean {
				return true;
			},
			getModelLineViewLineCount(modelLineNumber: number): number {
				return 1;
			},
			getViewLineNumberOfModelPosition(modelLineNumber: number, modelColumn: number): number {
				return modelLineNumber;
			}
		};
	}

	private constructCursorSimpleModel(cell: ICellViewModel): ICursorSimpleModel {
		return {
			getLineCount(): number {
				return cell.textBuffer.getLineCount();
			},
			getLineContent(lineNumber: number): string {
				return cell.textBuffer.getLineContent(lineNumber);
			},
			getLineMinColumn(lineNumber: number): number {
				return cell.textBuffer.getLineMinColumn(lineNumber);
			},
			getLineMaxColumn(lineNumber: number): number {
				return cell.textBuffer.getLineMaxColumn(lineNumber);
			},
			getLineFirstNonWhitespaceColumn(lineNumber: number): number {
				return cell.textBuffer.getLineFirstNonWhitespaceColumn(lineNumber);
			},
			getLineLastNonWhitespaceColumn(lineNumber: number): number {
				return cell.textBuffer.getLineLastNonWhitespaceColumn(lineNumber);
			},
			normalizePosition(position: Position, affinity: PositionAffinity): Position {
				return position;
			},
			getLineIndentColumn(lineNumber: number): number {
				return indentOfLine(cell.textBuffer.getLineContent(lineNumber)) + 1;
			}
		};
	}

	private handleEditorOperationEvent(e: ITriggerEditorOperationEvent) {
		this.trackedCells.forEach(cell => {
			if (cell.cellViewModel.handle === this.anchorCell?.[0].handle) {
				return;
			}

			const eventsCollector = new ViewModelEventsCollector();
			const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
			if (!controller) {
				return;
			}
			this.executeEditorOperation(controller, eventsCollector, e);
		});
	}

	private executeEditorOperation(controller: CursorsController, eventsCollector: ViewModelEventsCollector, e: ITriggerEditorOperationEvent) {
		switch (e.handlerId) {
			case Handler.CompositionStart:
				controller.startComposition(eventsCollector);
				break;
			case Handler.CompositionEnd:
				controller.endComposition(eventsCollector, e.source);
				break;
			case Handler.ReplacePreviousChar: {
				const args = <Partial<ReplacePreviousCharPayload>>e.payload;
				controller.compositionType(eventsCollector, args.text || '', args.replaceCharCnt || 0, 0, 0, e.source);
				break;
			}
			case Handler.CompositionType: {
				const args = <Partial<CompositionTypePayload>>e.payload;
				controller.compositionType(eventsCollector, args.text || '', args.replacePrevCharCnt || 0, args.replaceNextCharCnt || 0, args.positionDelta || 0, e.source);
				break;
			}
			case Handler.Paste: {
				const args = <Partial<PastePayload>>e.payload;
				controller.paste(eventsCollector, args.text || '', args.pasteOnNewLine || false, args.multicursorText || null, e.source);
				break;
			}
			case Handler.Cut:
				controller.cut(eventsCollector, e.source);
				break;
		}
	}

	private updateViewModelSelections() {
		for (const cell of this.trackedCells) {
			const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
			if (!controller) {
				// should not happen
				return;
			}

			cell.cellViewModel.setSelections(controller.getSelections());
		}
	}

	private updateFinalUndoRedo() {
		const anchorCellModel = this.anchorCell?.[1].getModel();
		if (!anchorCellModel) {
			// should not happen
			return;
		}

		const newElementsMap: ResourceMap<IUndoRedoElement[]> = new ResourceMap<IUndoRedoElement[]>();
		const resources: URI[] = [];

		this.trackedCells.forEach(trackedMatch => {
			const undoRedoState = trackedMatch.undoRedoHistory;
			if (!undoRedoState) {
				return;
			}

			resources.push(trackedMatch.cellViewModel.uri);

			const currentPastElements = this.undoRedoService.getElements(trackedMatch.cellViewModel.uri).past.slice();
			const oldPastElements = trackedMatch.undoRedoHistory.past.slice();
			const newElements = currentPastElements.slice(oldPastElements.length);
			if (newElements.length === 0) {
				return;
			}

			newElementsMap.set(trackedMatch.cellViewModel.uri, newElements);

			this.undoRedoService.removeElements(trackedMatch.cellViewModel.uri);
			oldPastElements.forEach(element => {
				this.undoRedoService.pushElement(element);
			});
		});

		this.undoRedoService.pushElement({
			type: UndoRedoElementType.Workspace,
			resources: resources,
			label: 'Multi Cursor Edit',
			code: 'multiCursorEdit',
			confirmBeforeUndo: false,
			undo: async () => {
				newElementsMap.forEach(async value => {
					value.reverse().forEach(async element => {
						await element.undo();
					});
				});
			},
			redo: async () => {
				newElementsMap.forEach(async value => {
					value.forEach(async element => {
						await element.redo();
					});
				});
			}
		});
	}

	public resetToIdleState() {
		this.state = NotebookMultiCursorState.Idle;
		this._nbMultiSelectState.set(NotebookMultiCursorState.Idle);
		this._nbIsMultiSelectSession.set(false);
		this.updateFinalUndoRedo();

		this.trackedCells.forEach(cell => {
			this.clearDecorations(cell);
			cell.cellViewModel.setSelections([cell.initialSelection]); // correct cursor placement upon exiting cmd-d session
		});

		this.anchorDisposables.clear();
		this.anchorCell = undefined;
		this.cursorsDisposables.clear();
		this.cursorsControllers.clear();
		this.trackedCells = [];
		this.totalMatchesCount = 0;
		this.startPosition = undefined;
		this.word = '';
	}

	public async findAndTrackNextSelection(focusedCell: ICellViewModel): Promise<void> {
		if (this.state === NotebookMultiCursorState.Idle) { // move cursor to end of the symbol + track it, transition to selecting state
			const textModel = focusedCell.textModel;
			if (!textModel) {
				return;
			}

			const inputSelection = focusedCell.getSelections()[0];
			const word = this.getWord(inputSelection, textModel);
			if (!word) {
				return;
			}
			this.word = word.word;

			// Record the total number of matches at the beginning of the selection process for performance
			const notebookTextModel = this.notebookEditor.textModel;
			if (notebookTextModel) {
				const allMatches = notebookTextModel.findMatches(this.word, false, true, USUAL_WORD_SEPARATORS);
				this.totalMatchesCount = allMatches.reduce((sum, cellMatch) => sum + cellMatch.matches.length, 0);
			}

			const index = this.notebookEditor.getCellIndex(focusedCell);
			if (index === undefined) {
				return;
			}

			this.startPosition = {
				cellIndex: index,
				position: new Position(inputSelection.startLineNumber, word.startColumn),
			};

			const newSelection = new Selection(
				inputSelection.startLineNumber,
				word.startColumn,
				inputSelection.startLineNumber,
				word.endColumn
			);
			focusedCell.setSelections([newSelection]);

			this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;
			if (!this.anchorCell || this.anchorCell[0].handle !== focusedCell.handle) {
				throw new Error('Active cell is not the same as the cell passed as context');
			}
			if (!(this.anchorCell[1] instanceof CodeEditorWidget)) {
				throw new Error('Active cell is not an instance of CodeEditorWidget');
			}

			await this.updateTrackedCell(focusedCell, [newSelection]);

			this._nbIsMultiSelectSession.set(true);
			this.state = NotebookMultiCursorState.Selecting;
			this._nbMultiSelectState.set(NotebookMultiCursorState.Selecting);

			this._onDidChangeAnchorCell.fire();

		} else if (this.state === NotebookMultiCursorState.Selecting) { // use the word we stored from idle state transition to find next match, track it
			const notebookTextModel = this.notebookEditor.textModel;
			if (!notebookTextModel) {
				return; // should not happen
			}

			const index = this.notebookEditor.getCellIndex(focusedCell);
			if (index === undefined) {
				return; // should not happen
			}

			if (!this.startPosition) {
				return; // should not happen
			}

			// Check if all matches are already covered by selections to avoid infinite looping
			const totalSelections = this.trackedCells.reduce((sum, trackedCell) => sum + trackedCell.matchSelections.length, 0);

			if (totalSelections >= this.totalMatchesCount) {
				// All matches are already selected, make this a no-op like in regular editors
				return;
			}

			const findResult = notebookTextModel.findNextMatch(
				this.word,
				{ cellIndex: index, position: focusedCell.getSelections()[focusedCell.getSelections().length - 1].getEndPosition() },
				false,
				true,
				USUAL_WORD_SEPARATORS,
				this.startPosition,
			);
			if (!findResult) {
				return;
			}

			const findResultCellViewModel = this.notebookEditor.getCellByHandle(findResult.cell.handle);
			if (!findResultCellViewModel) {
				return;
			}

			if (findResult.cell.handle === focusedCell.handle) { // match is in the same cell, find tracked entry, update and set selections in viewmodel and cursorController
				const selections = [...focusedCell.getSelections(), Selection.fromRange(findResult.match.range, SelectionDirection.LTR)];
				const trackedCell = await this.updateTrackedCell(focusedCell, selections);
				findResultCellViewModel.setSelections(trackedCell.matchSelections);


			} else if (findResult.cell.handle !== focusedCell.handle) {	// result is in a different cell, move focus there and apply selection, then update anchor
				await this.notebookEditor.revealRangeInViewAsync(findResultCellViewModel, findResult.match.range);
				await this.notebookEditor.focusNotebookCell(findResultCellViewModel, 'editor');

				const trackedCell = await this.updateTrackedCell(findResultCellViewModel, [Selection.fromRange(findResult.match.range, SelectionDirection.LTR)]);
				findResultCellViewModel.setSelections(trackedCell.matchSelections);

				this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;
				if (!this.anchorCell || !(this.anchorCell[1] instanceof CodeEditorWidget)) {
					throw new Error('Active cell is not an instance of CodeEditorWidget');
				}

				this._onDidChangeAnchorCell.fire();

				// we set the decorations manually for the cell we have just departed, since it blurs
				// we can find the match with the handle that the find and track request originated
				this.initializeMultiSelectDecorations(this.trackedCells.find(trackedCell => trackedCell.cellViewModel.handle === focusedCell.handle));
			}
		}
	}

	public async selectAllMatches(focusedCell: ICellViewModel, matches?: CellFindMatchWithIndex[]): Promise<void> {
		const notebookTextModel = this.notebookEditor.textModel;
		if (!notebookTextModel) {
			return; // should not happen
		}

		if (matches) {
			await this.handleFindWidgetSelectAllMatches(matches);
		} else {
			await this.handleCellEditorSelectAllMatches(notebookTextModel, focusedCell);
		}

		await this.syncCursorsControllers();
		this.syncAnchorListeners();
		this.updateLazyDecorations();
	}

	private async handleFindWidgetSelectAllMatches(matches: CellFindMatchWithIndex[]) {
		// TODO: support selecting state maybe. UX could get confusing since selecting state could be hit via ctrl+d which would have different filters (case sensetive + whole word)
		if (this.state !== NotebookMultiCursorState.Idle) {
			return;
		}

		if (!matches.length) {
			return;
		}

		await this.notebookEditor.focusNotebookCell(matches[0].cell, 'editor');
		this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;

		this.trackedCells = [];
		for (const match of matches) {
			this.updateTrackedCell(match.cell, match.contentMatches.map(match => Selection.fromRange(match.range, SelectionDirection.LTR)));

			if (this.anchorCell && match.cell.handle === this.anchorCell[0].handle) {
				// only explicitly set the focused cell's selections, the rest are handled by cursor controllers + decorations
				match.cell.setSelections(match.contentMatches.map(match => Selection.fromRange(match.range, SelectionDirection.LTR)));
			}
		}

		this._nbIsMultiSelectSession.set(true);
		this.state = NotebookMultiCursorState.Selecting;
		this._nbMultiSelectState.set(NotebookMultiCursorState.Selecting);
	}

	private async handleCellEditorSelectAllMatches(notebookTextModel: NotebookTextModel, focusedCell: ICellViewModel) {
		// can be triggered mid multiselect session, or from idle state
		if (this.state === NotebookMultiCursorState.Idle) {
			// get word from current selection + rest of notebook objects
			const textModel = focusedCell.textModel;
			if (!textModel) {
				return;
			}
			const inputSelection = focusedCell.getSelections()[0];
			const word = this.getWord(inputSelection, textModel);
			if (!word) {
				return;
			}
			this.word = word.word;
			const index = this.notebookEditor.getCellIndex(focusedCell);
			if (index === undefined) {
				return;
			}
			this.startPosition = {
				cellIndex: index,
				position: new Position(inputSelection.startLineNumber, word.startColumn),
			};

			this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;
			if (!this.anchorCell || this.anchorCell[0].handle !== focusedCell.handle) {
				throw new Error('Active cell is not the same as the cell passed as context');
			}
			if (!(this.anchorCell[1] instanceof CodeEditorWidget)) {
				throw new Error('Active cell is not an instance of CodeEditorWidget');
			}

			// get all matches in the notebook
			const findResults = notebookTextModel.findMatches(this.word, false, true, USUAL_WORD_SEPARATORS);

			// create the tracked matches for every result, needed for cursor controllers
			this.trackedCells = [];
			for (const res of findResults) {
				await this.updateTrackedCell(res.cell, res.matches.map(match => Selection.fromRange(match.range, SelectionDirection.LTR)));

				if (res.cell.handle === focusedCell.handle) {
					const cellViewModel = this.notebookEditor.getCellByHandle(res.cell.handle);
					if (cellViewModel) {
						cellViewModel.setSelections(res.matches.map(match => Selection.fromRange(match.range, SelectionDirection.LTR)));
					}
				}
			}

			this._nbIsMultiSelectSession.set(true);
			this.state = NotebookMultiCursorState.Selecting;
			this._nbMultiSelectState.set(NotebookMultiCursorState.Selecting);

		} else if (this.state === NotebookMultiCursorState.Selecting) {
			// we will already have a word + some number of tracked matches, need to update them with the rest given findAllMatches result
			const findResults = notebookTextModel.findMatches(this.word, false, true, USUAL_WORD_SEPARATORS);

			// update existing tracked matches with new selections and create new tracked matches for cells that aren't tracked yet
			for (const res of findResults) {
				await this.updateTrackedCell(res.cell, res.matches.map(match => Selection.fromRange(match.range, SelectionDirection.LTR)));
			}
		}
	}

	private async updateTrackedCell(cell: ICellViewModel | NotebookCellTextModel, selections: Selection[]) {
		const cellViewModel = cell instanceof NotebookCellTextModel ? this.notebookEditor.getCellByHandle(cell.handle) : cell;
		if (!cellViewModel) {
			throw new Error('Cell not found');
		}

		let trackedMatch = this.trackedCells.find(trackedCell => trackedCell.cellViewModel.handle === cellViewModel.handle);

		if (trackedMatch) {
			this.clearDecorations(trackedMatch); // need this to avoid leaking decorations -- TODO: just optimize the lazy decorations fn
			trackedMatch.matchSelections = selections;
		} else {
			const initialSelection = cellViewModel.getSelections()[0];
			const textModel = await cellViewModel.resolveTextModel();
			textModel.pushStackElement();

			const editorConfig = this.constructCellEditorOptions(cellViewModel);
			const rawEditorOptions = editorConfig.getRawOptions();
			const cursorConfig: NotebookCursorConfig = {
				cursorStyle: cursorStyleFromString(rawEditorOptions.cursorStyle!),
				cursorBlinking: cursorBlinkingStyleFromString(rawEditorOptions.cursorBlinking!),
				cursorSmoothCaretAnimation: rawEditorOptions.cursorSmoothCaretAnimation!
			};

			trackedMatch = {
				cellViewModel: cellViewModel,
				initialSelection: initialSelection,
				matchSelections: selections,
				editorConfig: editorConfig,
				cursorConfig: cursorConfig,
				decorationIds: [],
				undoRedoHistory: this.undoRedoService.getElements(cellViewModel.uri)
			};
			this.trackedCells.push(trackedMatch);
		}
		return trackedMatch;
	}

	public async deleteLeft(): Promise<void> {
		this.trackedCells.forEach(cell => {
			const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
			if (!controller) {
				// should not happen
				return;
			}

			const [, commands] = DeleteOperations.deleteLeft(
				controller.getPrevEditOperationType(),
				controller.context.cursorConfig,
				controller.context.model,
				controller.getSelections(),
				controller.getAutoClosedCharacters(),
			);

			const delSelections = CommandExecutor.executeCommands(controller.context.model, controller.getSelections(), commands);
			if (!delSelections) {
				return;
			}
			controller.setSelections(new ViewModelEventsCollector(), undefined, delSelections, CursorChangeReason.Explicit);
		});
		this.updateLazyDecorations();
	}

	public async deleteRight(): Promise<void> {
		this.trackedCells.forEach(cell => {
			const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
			if (!controller) {
				// should not happen
				return;
			}

			const [, commands] = DeleteOperations.deleteRight(
				controller.getPrevEditOperationType(),
				controller.context.cursorConfig,
				controller.context.model,
				controller.getSelections(),
			);

			if (cell.cellViewModel.handle !== this.anchorCell?.[0].handle) {
				const delSelections = CommandExecutor.executeCommands(controller.context.model, controller.getSelections(), commands);
				if (!delSelections) {
					return;
				}
				controller.setSelections(new ViewModelEventsCollector(), undefined, delSelections, CursorChangeReason.Explicit);
			} else {
				// get the selections from the viewmodel since we run the command manually (for cursor decoration reasons)
				controller.setSelections(new ViewModelEventsCollector(), undefined, cell.cellViewModel.getSelections(), CursorChangeReason.Explicit);
			}

		});
		this.updateLazyDecorations();
	}

	async undo() {
		const models: ITextModel[] = [];
		for (const cell of this.trackedCells) {
			const model = await cell.cellViewModel.resolveTextModel();
			if (model) {
				models.push(model);
			}
		}

		await Promise.all(models.map(model => model.undo()));
		this.updateViewModelSelections();
		this.updateLazyDecorations();
	}

	async redo() {
		const models: ITextModel[] = [];
		for (const cell of this.trackedCells) {
			const model = await cell.cellViewModel.resolveTextModel();
			if (model) {
				models.push(model);
			}
		}

		await Promise.all(models.map(model => model.redo()));
		this.updateViewModelSelections();
		this.updateLazyDecorations();
	}

	private constructCellEditorOptions(cell: ICellViewModel): EditorConfiguration {
		const cellEditorOptions = new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(cell.language), this.notebookEditor.notebookOptions, this.configurationService);
		const options = cellEditorOptions.getUpdatedValue(cell.internalMetadata, cell.uri);
		cellEditorOptions.dispose();
		return new EditorConfiguration(false, MenuId.EditorContent, options, null, this.accessibilityService);
	}

	/**
	 * Updates the multicursor selection decorations for a specific matched cell
	 *
	 * @param cell -- match object containing the viewmodel + selections
	 */
	private initializeMultiSelectDecorations(cell: TrackedCell | undefined) {
		if (!cell) {
			return;
		}

		const decorations: IModelDeltaDecoration[] = [];
		cell.matchSelections.forEach(selection => {
			// mock cursor at the end of the selection
			decorations.push({
				range: Selection.fromPositions(selection.getEndPosition()),
				options: {
					description: '',
					className: this.getClassName(cell.cursorConfig, true),
				}
			});
		});

		cell.decorationIds = cell.cellViewModel.deltaModelDecorations(
			cell.decorationIds,
			decorations
		);
	}

	private updateLazyDecorations() {
		this.trackedCells.forEach(cell => {
			if (cell.cellViewModel.handle === this.anchorCell?.[0].handle) {
				return;
			}

			const controller = this.cursorsControllers.get(cell.cellViewModel.uri);
			if (!controller) {
				// should not happen
				return;
			}
			const selections = controller.getSelections();

			const newDecorations: IModelDeltaDecoration[] = [];
			selections?.map(selection => {
				const isEmpty = selection.isEmpty();

				if (!isEmpty) {
					// selection decoration (shift+arrow, etc)
					newDecorations.push({
						range: selection,
						options: {
							description: '',
							className: this.getClassName(cell.cursorConfig, false),
						}
					});
				}

				// mock cursor at the end of the selection
				newDecorations.push({
					range: Selection.fromPositions(selection.getPosition()),
					options: {
						description: '',
						zIndex: 10000,
						className: this.getClassName(cell.cursorConfig, true),
					}
				});
			});

			cell.decorationIds = cell.cellViewModel.deltaModelDecorations(
				cell.decorationIds,
				newDecorations
			);
		});
	}

	private clearDecorations(cell: TrackedCell) {
		cell.decorationIds = cell.cellViewModel.deltaModelDecorations(
			cell.decorationIds,
			[]
		);
	}

	private getWord(selection: Selection, model: ITextModel): IWordAtPosition | null {
		const lineNumber = selection.startLineNumber;
		const startColumn = selection.startColumn;

		if (model.isDisposed()) {
			return null;
		}

		return model.getWordAtPosition({
			lineNumber: lineNumber,
			column: startColumn
		});
	}

	private getClassName(cursorConfig: NotebookCursorConfig, isCursor?: boolean): string {
		let result = isCursor ? '.nb-multicursor-cursor' : '.nb-multicursor-selection';

		if (isCursor) {
			// handle base style
			switch (cursorConfig.cursorStyle) {
				case TextEditorCursorStyle.Line:
					break; // default style, no additional class needed (handled by base css style)
				case TextEditorCursorStyle.Block:
					result += '.nb-cursor-block-style';
					break;
				case TextEditorCursorStyle.Underline:
					result += '.nb-cursor-underline-style';
					break;
				case TextEditorCursorStyle.LineThin:
					result += '.nb-cursor-line-thin-style';
					break;
				case TextEditorCursorStyle.BlockOutline:
					result += '.nb-cursor-block-outline-style';
					break;
				case TextEditorCursorStyle.UnderlineThin:
					result += '.nb-cursor-underline-thin-style';
					break;
				default:
					break;
			}

			// handle animation style
			switch (cursorConfig.cursorBlinking) {
				case TextEditorCursorBlinkingStyle.Blink:
					result += '.nb-blink';
					break;
				case TextEditorCursorBlinkingStyle.Smooth:
					result += '.nb-smooth';
					break;
				case TextEditorCursorBlinkingStyle.Phase:
					result += '.nb-phase';
					break;
				case TextEditorCursorBlinkingStyle.Expand:
					result += '.nb-expand';
					break;
				case TextEditorCursorBlinkingStyle.Solid:
					result += '.nb-solid';
					break;
				default:
					result += '.nb-solid';
					break;
			}

			// handle caret animation style
			if (cursorConfig.cursorSmoothCaretAnimation === 'on' || cursorConfig.cursorSmoothCaretAnimation === 'explicit') {
				result += '.nb-smooth-caret-animation';
			}

		}
		return result;
	}

	override dispose(): void {
		super.dispose();
		this.anchorDisposables.dispose();
		this.cursorsDisposables.dispose();

		this.trackedCells.forEach(cell => {
			this.clearDecorations(cell);
		});
		this.trackedCells = [];
	}

}

class NotebookSelectAllFindMatches extends NotebookAction {
	constructor() {
		super({
			id: NOTEBOOK_SELECT_ALL_FIND_MATCHES_ID,
			title: localize('selectAllFindMatches', "Select All Occurrences of Find Match"),
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
			),
			keybinding: {
				when: ContextKeyExpr.or(
					ContextKeyExpr.and(
						ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
						NOTEBOOK_IS_ACTIVE_EDITOR,
						NOTEBOOK_CELL_EDITOR_FOCUSED,
					),
					ContextKeyExpr.and(
						ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
						KEYBINDING_CONTEXT_NOTEBOOK_FIND_WIDGET_FOCUSED
					),
				),
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editorService = accessor.get(IEditorService);

		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!editor) {
			return;
		}

		if (!context.cell) {
			return;
		}

		const cursorController = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		const findController = editor.getContribution<NotebookFindContrib>(NotebookFindContrib.id);

		if (findController.widget.isFocused) {
			const findModel = findController.widget.findModel;
			cursorController.selectAllMatches(context.cell, findModel.findMatches);
		} else {
			cursorController.selectAllMatches(context.cell);
		}

	}
}

class NotebookAddMatchToMultiSelectionAction extends NotebookAction {
	constructor() {
		super({
			id: NOTEBOOK_ADD_FIND_MATCH_TO_SELECTION_ID,
			title: localize('addFindMatchToSelection', "Add Selection to Next Find Match"),
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
				NOTEBOOK_IS_ACTIVE_EDITOR,
				NOTEBOOK_CELL_EDITOR_FOCUSED,
			),
			keybinding: {
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
					NOTEBOOK_IS_ACTIVE_EDITOR,
					NOTEBOOK_CELL_EDITOR_FOCUSED,
				),
				primary: KeyMod.CtrlCmd | KeyCode.KeyD,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		if (!context.cell) {
			return;
		}

		const controller = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		controller.findAndTrackNextSelection(context.cell);
	}
}

class NotebookExitMultiSelectionAction extends NotebookAction {
	constructor() {
		super({
			id: 'noteMultiCursor.exit',
			title: localize('exitMultiSelection', "Exit Multi Cursor Mode"),
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
				NOTEBOOK_IS_ACTIVE_EDITOR,
				NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
			),
			keybinding: {
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
					NOTEBOOK_IS_ACTIVE_EDITOR,
					NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
				),
				primary: KeyCode.Escape,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		const controller = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		controller.resetToIdleState();
	}
}

class NotebookDeleteLeftMultiSelectionAction extends NotebookAction {
	constructor() {
		super({
			id: 'noteMultiCursor.deleteLeft',
			title: localize('deleteLeftMultiSelection', "Delete Left"),
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
				NOTEBOOK_IS_ACTIVE_EDITOR,
				NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
				ContextKeyExpr.or(
					NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Selecting),
					NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Editing)
				)
			),
			keybinding: {
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
					NOTEBOOK_IS_ACTIVE_EDITOR,
					NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
					ContextKeyExpr.or(
						NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Selecting),
						NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Editing)
					)
				),
				primary: KeyCode.Backspace,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);

		if (!editor) {
			return;
		}

		const controller = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		controller.deleteLeft();
	}
}

class NotebookDeleteRightMultiSelectionAction extends NotebookAction {
	constructor() {
		super({
			id: 'noteMultiCursor.deleteRight',
			title: localize('deleteRightMultiSelection', "Delete Right"),
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
				NOTEBOOK_IS_ACTIVE_EDITOR,
				NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
				ContextKeyExpr.or(
					NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Selecting),
					NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Editing)
				)
			),
			keybinding: {
				when: ContextKeyExpr.and(
					ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
					NOTEBOOK_IS_ACTIVE_EDITOR,
					NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
					ContextKeyExpr.or(
						NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Selecting),
						NOTEBOOK_MULTI_CURSOR_CONTEXT.NotebookMultiSelectCursorState.isEqualTo(NotebookMultiCursorState.Editing)
					)
				),
				primary: KeyCode.Delete,
				weight: KeybindingWeight.WorkbenchContrib
			}
		});
	}

	override async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const nbEditor = getNotebookEditorFromEditorPane(editorService.activeEditorPane);
		if (!nbEditor) {
			return;
		}
		const cellEditor = nbEditor.activeCodeEditor;
		if (!cellEditor) {
			return;
		}

		// need to run the command manually since we are overriding the command, this ensures proper cursor animation behavior
		CoreEditingCommands.DeleteRight.runEditorCommand(accessor, cellEditor, null);

		const controller = nbEditor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
		controller.deleteRight();
	}
}

class NotebookMultiCursorUndoRedoContribution extends Disposable {

	static readonly ID = 'workbench.contrib.notebook.multiCursorUndoRedo';

	constructor(@IEditorService private readonly _editorService: IEditorService, @IConfigurationService private readonly configurationService: IConfigurationService) {
		super();

		if (!this.configurationService.getValue<boolean>('notebook.multiCursor.enabled')) {
			return;
		}

		const PRIORITY = 10005;
		this._register(UndoCommand.addImplementation(PRIORITY, 'notebook-multicursor-undo-redo', () => {
			const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
			if (!editor) {
				return false;
			}

			if (!editor.hasModel()) {
				return false;
			}

			const controller = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);

			return controller.undo();
		}, ContextKeyExpr.and(
			ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
			NOTEBOOK_IS_ACTIVE_EDITOR,
			NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
		)));

		this._register(RedoCommand.addImplementation(PRIORITY, 'notebook-multicursor-undo-redo', () => {
			const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
			if (!editor) {
				return false;
			}

			if (!editor.hasModel()) {
				return false;
			}

			const controller = editor.getContribution<NotebookMultiCursorController>(NotebookMultiCursorController.id);
			return controller.redo();
		}, ContextKeyExpr.and(
			ContextKeyExpr.equals('config.notebook.multiCursor.enabled', true),
			NOTEBOOK_IS_ACTIVE_EDITOR,
			NOTEBOOK_MULTI_CURSOR_CONTEXT.IsNotebookMultiCursor,
		)));
	}
}

registerNotebookContribution(NotebookMultiCursorController.id, NotebookMultiCursorController);
registerWorkbenchContribution2(NotebookMultiCursorUndoRedoContribution.ID, NotebookMultiCursorUndoRedoContribution, WorkbenchPhase.BlockRestore);

registerAction2(NotebookSelectAllFindMatches);
registerAction2(NotebookAddMatchToMultiSelectionAction);
registerAction2(NotebookExitMultiSelectionAction);
registerAction2(NotebookDeleteLeftMultiSelectionAction);
registerAction2(NotebookDeleteRightMultiSelectionAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/multicursor/notebookSelectionHighlight.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/multicursor/notebookSelectionHighlight.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { Selection, SelectionDirection } from '../../../../../../editor/common/core/selection.js';
import { CursorChangeReason } from '../../../../../../editor/common/cursorEvents.js';
import { FindMatch, IModelDeltaDecoration, ITextModel } from '../../../../../../editor/common/model.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IActiveNotebookEditor, ICellViewModel, INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';

class NotebookSelectionHighlighter extends Disposable implements INotebookEditorContribution {

	static readonly id: string = 'notebook.selectionHighlighter';
	private isEnabled: boolean = false;

	private cellDecorationIds = new Map<ICellViewModel, string[]>();
	private anchorCell: [ICellViewModel, ICodeEditor] | undefined;
	private readonly anchorDisposables = new DisposableStore();

	// right now this lets us mimic the more performant cache implementation of the text editor (doesn't need to be a delayer)
	// todo: in the future, implement caching and change to a 250ms delay upon recompute
	// private readonly runDelayer: Delayer<void> = this._register(new Delayer<void>(0));

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this.isEnabled = this.configurationService.getValue<boolean>('editor.selectionHighlight');
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.selectionHighlight')) {
				this.isEnabled = this.configurationService.getValue<boolean>('editor.selectionHighlight');
			}
		}));

		this._register(this.notebookEditor.onDidChangeActiveCell(async () => {
			if (!this.isEnabled) {
				return;
			}

			this.anchorCell = this.notebookEditor.activeCellAndCodeEditor;
			if (!this.anchorCell) {
				return;
			}

			const activeCell = this.notebookEditor.getActiveCell();
			if (!activeCell) {
				return;
			}

			if (!activeCell.editorAttached) {
				await Event.toPromise(activeCell.onDidChangeEditorAttachState);
			}

			this.clearNotebookSelectionDecorations();

			this.anchorDisposables.clear();
			this.anchorDisposables.add(this.anchorCell[1].onDidChangeCursorPosition((e) => {
				if (e.reason !== CursorChangeReason.Explicit) {
					this.clearNotebookSelectionDecorations();
					return;
				}

				if (!this.anchorCell) {
					return;
				}

				if (this.notebookEditor.hasModel()) {
					this.clearNotebookSelectionDecorations();
					this._update(this.notebookEditor);
				}
			}));

			if (this.notebookEditor.getEditorViewState().editorFocused && this.notebookEditor.hasModel()) {
				this._update(this.notebookEditor);
			}
		}));
	}

	private _update(editor: IActiveNotebookEditor) {
		if (!this.anchorCell || !this.isEnabled) {
			return;
		}

		// TODO: isTooLargeForTokenization check, notebook equivalent?
		// unlikely that any one cell's textmodel would be too large

		// get the word
		const textModel = this.anchorCell[0].textModel;
		if (!textModel || textModel.isTooLargeForTokenization()) {
			return;
		}
		const s = this.anchorCell[0].getSelections()[0];
		if (s.startLineNumber !== s.endLineNumber || s.isEmpty()) {
			// empty selections do nothing
			// multiline forbidden for perf reasons
			return;
		}
		const searchText = this.getSearchText(s, textModel);
		if (!searchText) {
			return;
		}

		const results = editor.textModel.findMatches(
			searchText,
			false,
			true,
			null,
		);

		for (const res of results) {
			const cell = editor.getCellByHandle(res.cell.handle);
			if (!cell) {
				continue;
			}

			this.updateCellDecorations(cell, res.matches);
		}
	}

	private updateCellDecorations(cell: ICellViewModel, matches: FindMatch[]) {
		const selections: Selection[] = matches.map(m => {
			return Selection.fromRange(m.range, SelectionDirection.LTR);
		});

		const newDecorations: IModelDeltaDecoration[] = [];
		selections?.map(selection => {
			const isEmpty = selection.isEmpty();

			if (!isEmpty) {
				newDecorations.push({
					range: selection,
					options: {
						description: '',
						className: '.nb-selection-highlight',
					}
				});
			}
		});

		const oldDecorations = this.cellDecorationIds.get(cell) ?? [];
		this.cellDecorationIds.set(cell, cell.deltaModelDecorations(
			oldDecorations,
			newDecorations
		));
	}

	private clearNotebookSelectionDecorations() {
		this.cellDecorationIds.forEach((_, cell) => {
			const cellDecorations = this.cellDecorationIds.get(cell) ?? [];
			if (cellDecorations) {
				cell.deltaModelDecorations(cellDecorations, []);
				this.cellDecorationIds.delete(cell);
			}
		});
	}

	private getSearchText(selection: Selection, model: ITextModel): string {
		return model.getValueInRange(selection).replace(/\r\n/g, '\n');
	}

	override dispose(): void {
		super.dispose();
		this.anchorDisposables.dispose();
	}
}

registerNotebookContribution(NotebookSelectionHighlighter.id, NotebookSelectionHighlighter);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/navigation/arrow.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/navigation/arrow.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../../../base/common/async.js';
import { KeyCode, KeyMod } from '../../../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { EditorExtensionsRegistry } from '../../../../../../editor/browser/editorExtensions.js';
import { EditorContextKeys } from '../../../../../../editor/common/editorContextKeys.js';
import { localize, localize2 } from '../../../../../../nls.js';
import { CONTEXT_ACCESSIBILITY_MODE_ENABLED } from '../../../../../../platform/accessibility/common/accessibility.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr } from '../../../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContextKey, IsWindowsContext } from '../../../../../../platform/contextkey/common/contextkeys.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { InlineChatController } from '../../../../inlineChat/browser/inlineChatController.js';
import { INotebookActionContext, INotebookCellActionContext, NotebookAction, NotebookCellAction, NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, findTargetCellEditor } from '../../controller/coreActions.js';
import { CellEditState } from '../../notebookBrowser.js';
import { CellKind, NOTEBOOK_EDITOR_CURSOR_BOUNDARY, NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY } from '../../../common/notebookCommon.js';
import { NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, NOTEBOOK_CELL_TYPE, NOTEBOOK_CURSOR_NAVIGATION_MODE, NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_OUTPUT_INPUT_FOCUSED, NOTEBOOK_OUTPUT_FOCUSED, NOTEBOOK_CELL_EDITOR_FOCUSED, IS_COMPOSITE_NOTEBOOK, NOTEBOOK_OR_COMPOSITE_IS_ACTIVE_EDITOR } from '../../../common/notebookContextKeys.js';

const NOTEBOOK_FOCUS_TOP = 'notebook.focusTop';
const NOTEBOOK_FOCUS_BOTTOM = 'notebook.focusBottom';
const NOTEBOOK_FOCUS_PREVIOUS_EDITOR = 'notebook.focusPreviousEditor';
const NOTEBOOK_FOCUS_NEXT_EDITOR = 'notebook.focusNextEditor';
const FOCUS_IN_OUTPUT_COMMAND_ID = 'notebook.cell.focusInOutput';
const FOCUS_OUT_OUTPUT_COMMAND_ID = 'notebook.cell.focusOutOutput';
export const CENTER_ACTIVE_CELL = 'notebook.centerActiveCell';
const NOTEBOOK_CURSOR_PAGEUP_COMMAND_ID = 'notebook.cell.cursorPageUp';
const NOTEBOOK_CURSOR_PAGEUP_SELECT_COMMAND_ID = 'notebook.cell.cursorPageUpSelect';
const NOTEBOOK_CURSOR_PAGEDOWN_COMMAND_ID = 'notebook.cell.cursorPageDown';
const NOTEBOOK_CURSOR_PAGEDOWN_SELECT_COMMAND_ID = 'notebook.cell.cursorPageDownSelect';

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'notebook.cell.nullAction',
			title: localize('notebook.cell.webviewHandledEvents', "Keypresses that should be handled by the focused element in the cell output."),
			keybinding: [{
				when: NOTEBOOK_OUTPUT_INPUT_FOCUSED,
				primary: KeyCode.DownArrow,
				weight: KeybindingWeight.WorkbenchContrib + 1
			}, {
				when: NOTEBOOK_OUTPUT_INPUT_FOCUSED,
				primary: KeyCode.UpArrow,
				weight: KeybindingWeight.WorkbenchContrib + 1
			}],
			f1: false
		});
	}

	run() {
		// noop, these are handled by the output webview
		return;
	}

});

registerAction2(class FocusNextCellAction extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_FOCUS_NEXT_EDITOR,
			title: localize('cursorMoveDown', 'Focus Next Cell Editor'),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate(),
						ContextKeyExpr.equals('config.notebook.navigation.allowNavigateToSurroundingCells', true),
						ContextKeyExpr.and(
							ContextKeyExpr.has(InputFocusedContextKey),
							EditorContextKeys.editorTextFocus,
							NOTEBOOK_EDITOR_CURSOR_BOUNDARY.notEqualsTo('top'),
							NOTEBOOK_EDITOR_CURSOR_BOUNDARY.notEqualsTo('none'),
							ContextKeyExpr.or(
								NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY.isEqualTo('end'),
								NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY.isEqualTo('both')
							)
						),
						EditorContextKeys.isEmbeddedDiffEditor.negate()
					),
					primary: KeyCode.DownArrow,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, // code cell keybinding, focus inside editor: lower weight to not override suggest widget
				},
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate(),
						ContextKeyExpr.equals('config.notebook.navigation.allowNavigateToSurroundingCells', true),
						ContextKeyExpr.and(
							NOTEBOOK_CELL_TYPE.isEqualTo('markup'),
							NOTEBOOK_CELL_MARKDOWN_EDIT_MODE.isEqualTo(false),
							NOTEBOOK_CURSOR_NAVIGATION_MODE),
						EditorContextKeys.isEmbeddedDiffEditor.negate()
					),
					primary: KeyCode.DownArrow,
					weight: KeybindingWeight.WorkbenchContrib, // markdown keybinding, focus on list: higher weight to override list.focusDown
				},
				{
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_OUTPUT_FOCUSED),
					primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
					mac: { primary: KeyMod.WinCtrl | KeyMod.CtrlCmd | KeyCode.DownArrow, },
					weight: KeybindingWeight.WorkbenchContrib
				},
				{
					when: ContextKeyExpr.and(NOTEBOOK_CELL_EDITOR_FOCUSED, CONTEXT_ACCESSIBILITY_MODE_ENABLED),
					primary: KeyMod.CtrlCmd | KeyCode.PageDown,
					mac: { primary: KeyMod.WinCtrl | KeyCode.PageUp, },
					weight: KeybindingWeight.WorkbenchContrib + 1
				},
			]
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editor = context.notebookEditor;
		const activeCell = context.cell;

		const idx = editor.getCellIndex(activeCell);
		if (typeof idx !== 'number') {
			return;
		}

		if (idx >= editor.getLength() - 1) {
			// last one
			return;
		}

		const focusEditorLine = activeCell.textBuffer.getLineCount();
		const targetCell = (context.cell ?? context.selectedCells?.[0]);
		const foundEditor: ICodeEditor | undefined = targetCell ? findTargetCellEditor(context, targetCell) : undefined;

		if (foundEditor && foundEditor.hasTextFocus() && InlineChatController.get(foundEditor)?.getWidgetPosition()?.lineNumber === focusEditorLine) {
			InlineChatController.get(foundEditor)?.focus();
		} else {
			const newCell = editor.cellAt(idx + 1);
			const newFocusMode = newCell.cellKind === CellKind.Markup && newCell.getEditState() === CellEditState.Preview ? 'container' : 'editor';
			await editor.focusNotebookCell(newCell, newFocusMode, { focusEditorLine: 1 });
		}
	}
});


registerAction2(class FocusPreviousCellAction extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_FOCUS_PREVIOUS_EDITOR,
			title: localize('cursorMoveUp', 'Focus Previous Cell Editor'),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate(),
						ContextKeyExpr.equals('config.notebook.navigation.allowNavigateToSurroundingCells', true),
						ContextKeyExpr.and(
							ContextKeyExpr.has(InputFocusedContextKey),
							EditorContextKeys.editorTextFocus,
							NOTEBOOK_EDITOR_CURSOR_BOUNDARY.notEqualsTo('bottom'),
							NOTEBOOK_EDITOR_CURSOR_BOUNDARY.notEqualsTo('none'),
							ContextKeyExpr.or(
								NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY.isEqualTo('start'),
								NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY.isEqualTo('both')
							)
						),
						EditorContextKeys.isEmbeddedDiffEditor.negate()
					),
					primary: KeyCode.UpArrow,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT, // code cell keybinding, focus inside editor: lower weight to not override suggest widget
				},
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						CONTEXT_ACCESSIBILITY_MODE_ENABLED.negate(),
						ContextKeyExpr.equals('config.notebook.navigation.allowNavigateToSurroundingCells', true),
						ContextKeyExpr.and(
							NOTEBOOK_CELL_TYPE.isEqualTo('markup'),
							NOTEBOOK_CELL_MARKDOWN_EDIT_MODE.isEqualTo(false),
							NOTEBOOK_CURSOR_NAVIGATION_MODE
						),
						EditorContextKeys.isEmbeddedDiffEditor.negate()
					),
					primary: KeyCode.UpArrow,
					weight: KeybindingWeight.WorkbenchContrib, // markdown keybinding, focus on list: higher weight to override list.focusDown
				},
				{
					when: ContextKeyExpr.and(NOTEBOOK_CELL_EDITOR_FOCUSED, CONTEXT_ACCESSIBILITY_MODE_ENABLED),
					primary: KeyMod.CtrlCmd | KeyCode.PageUp,
					mac: { primary: KeyMod.WinCtrl | KeyCode.PageUp, },
					weight: KeybindingWeight.WorkbenchContrib + 1
				},
			],
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editor = context.notebookEditor;
		const activeCell = context.cell;

		const idx = editor.getCellIndex(activeCell);
		if (typeof idx !== 'number') {
			return;
		}

		if (idx < 1 || editor.getLength() === 0) {
			// we don't do loop
			return;
		}

		const newCell = editor.cellAt(idx - 1);
		const newFocusMode = newCell.cellKind === CellKind.Markup && newCell.getEditState() === CellEditState.Preview ? 'container' : 'editor';
		const focusEditorLine = newCell.textBuffer.getLineCount();
		await editor.focusNotebookCell(newCell, newFocusMode, { focusEditorLine: focusEditorLine });

		const foundEditor: ICodeEditor | undefined = findTargetCellEditor(context, newCell);

		if (foundEditor && InlineChatController.get(foundEditor)?.getWidgetPosition()?.lineNumber === focusEditorLine) {
			InlineChatController.get(foundEditor)?.focus();
		}
	}
});


registerAction2(class extends NotebookAction {
	constructor() {
		super({
			id: NOTEBOOK_FOCUS_TOP,
			title: localize('focusFirstCell', 'Focus First Cell'),
			keybinding: [
				{
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					primary: KeyMod.CtrlCmd | KeyCode.Home,
					weight: KeybindingWeight.WorkbenchContrib
				},
				{
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					mac: { primary: KeyMod.CtrlCmd | KeyCode.UpArrow },
					weight: KeybindingWeight.WorkbenchContrib
				}
			],
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editor = context.notebookEditor;
		if (editor.getLength() === 0) {
			return;
		}

		const firstCell = editor.cellAt(0);
		await editor.focusNotebookCell(firstCell, 'container');
	}
});

registerAction2(class extends NotebookAction {
	constructor() {
		super({
			id: NOTEBOOK_FOCUS_BOTTOM,
			title: localize('focusLastCell', 'Focus Last Cell'),
			keybinding: [
				{
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					primary: KeyMod.CtrlCmd | KeyCode.End,
					mac: undefined,
					weight: KeybindingWeight.WorkbenchContrib
				},
				{
					when: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, ContextKeyExpr.not(InputFocusedContextKey)),
					mac: { primary: KeyMod.CtrlCmd | KeyCode.DownArrow },
					weight: KeybindingWeight.WorkbenchContrib
				}
			],
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editor = context.notebookEditor;
		if (!editor.hasModel() || editor.getLength() === 0) {
			return;
		}

		const lastIdx = editor.getLength() - 1;
		const lastVisibleIdx = editor.getPreviousVisibleCellIndex(lastIdx);
		if (lastVisibleIdx) {
			const cell = editor.cellAt(lastVisibleIdx);
			await editor.focusNotebookCell(cell, 'container');
		}
	}
});


registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: FOCUS_IN_OUTPUT_COMMAND_ID,
			title: localize2('focusOutput', 'Focus In Active Cell Output'),
			f1: true,
			keybinding: [{
				when: ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK.negate(), IsWindowsContext, NOTEBOOK_CELL_HAS_OUTPUTS),
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
				weight: KeybindingWeight.WorkbenchContrib
			}, {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.DownArrow,
				mac: { primary: KeyMod.WinCtrl | KeyMod.CtrlCmd | KeyCode.DownArrow, },
				weight: KeybindingWeight.WorkbenchContrib
			}],
			precondition: NOTEBOOK_OR_COMPOSITE_IS_ACTIVE_EDITOR
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editor = context.notebookEditor;
		const activeCell = context.cell;
		return timeout(0).then(() => editor.focusNotebookCell(activeCell, 'output'));
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: FOCUS_OUT_OUTPUT_COMMAND_ID,
			title: localize('focusOutputOut', 'Focus Out Active Cell Output'),
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow,
				mac: { primary: KeyMod.WinCtrl | KeyMod.CtrlCmd | KeyCode.UpArrow, },
				weight: KeybindingWeight.WorkbenchContrib
			},
			precondition: ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, NOTEBOOK_OUTPUT_FOCUSED),
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		const editor = context.notebookEditor;
		const activeCell = context.cell;
		await editor.focusNotebookCell(activeCell, 'editor');
	}
});

registerAction2(class CenterActiveCellAction extends NotebookCellAction {
	constructor() {
		super({
			id: CENTER_ACTIVE_CELL,
			title: localize('notebookActions.centerActiveCell', "Center Active Cell"),
			keybinding: {
				when: NOTEBOOK_EDITOR_FOCUSED,
				primary: KeyMod.CtrlCmd | KeyCode.KeyL,
				mac: {
					primary: KeyMod.WinCtrl | KeyCode.KeyL,
				},
				weight: KeybindingWeight.WorkbenchContrib
			},
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		return context.notebookEditor.revealInCenter(context.cell);
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_CURSOR_PAGEUP_COMMAND_ID,
			title: localize('cursorPageUp', "Cell Cursor Page Up"),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						ContextKeyExpr.has(InputFocusedContextKey),
						EditorContextKeys.editorTextFocus,
					),
					primary: KeyCode.PageUp,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
				}
			]
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		EditorExtensionsRegistry.getEditorCommand('cursorPageUp').runCommand(accessor, { pageSize: getPageSize(context) });
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_CURSOR_PAGEUP_SELECT_COMMAND_ID,
			title: localize('cursorPageUpSelect', "Cell Cursor Page Up Select"),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						ContextKeyExpr.has(InputFocusedContextKey),
						EditorContextKeys.editorTextFocus,
						NOTEBOOK_OUTPUT_FOCUSED.negate(), // Webview handles Shift+PageUp for selection of output contents
					),
					primary: KeyMod.Shift | KeyCode.PageUp,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
				}
			]
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		EditorExtensionsRegistry.getEditorCommand('cursorPageUpSelect').runCommand(accessor, { pageSize: getPageSize(context) });
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_CURSOR_PAGEDOWN_COMMAND_ID,
			title: localize('cursorPageDown', "Cell Cursor Page Down"),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						ContextKeyExpr.has(InputFocusedContextKey),
						EditorContextKeys.editorTextFocus,
					),
					primary: KeyCode.PageDown,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
				}
			]
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		EditorExtensionsRegistry.getEditorCommand('cursorPageDown').runCommand(accessor, { pageSize: getPageSize(context) });
	}
});

registerAction2(class extends NotebookCellAction {
	constructor() {
		super({
			id: NOTEBOOK_CURSOR_PAGEDOWN_SELECT_COMMAND_ID,
			title: localize('cursorPageDownSelect', "Cell Cursor Page Down Select"),
			keybinding: [
				{
					when: ContextKeyExpr.and(
						NOTEBOOK_EDITOR_FOCUSED,
						ContextKeyExpr.has(InputFocusedContextKey),
						EditorContextKeys.editorTextFocus,
						NOTEBOOK_OUTPUT_FOCUSED.negate(), // Webview handles Shift+PageDown for selection of output contents
					),
					primary: KeyMod.Shift | KeyCode.PageDown,
					weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
				}
			]
		});
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookCellActionContext): Promise<void> {
		EditorExtensionsRegistry.getEditorCommand('cursorPageDownSelect').runCommand(accessor, { pageSize: getPageSize(context) });
	}
});


function getPageSize(context: INotebookCellActionContext) {
	const editor = context.notebookEditor;
	const layoutInfo = editor.getViewModel().layoutInfo;
	const lineHeight = layoutInfo?.fontInfo.lineHeight || 17;
	return Math.max(1, Math.floor((layoutInfo?.height || 0) / lineHeight) - 2);
}


Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'notebook',
	order: 100,
	type: 'object',
	'properties': {
		'notebook.navigation.allowNavigateToSurroundingCells': {
			type: 'boolean',
			default: true,
			markdownDescription: localize('notebook.navigation.allowNavigateToSurroundingCells', "When enabled cursor can navigate to the next/previous cell when the current cursor in the cell editor is at the first/last line.")
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookInlineVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookInlineVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../../../../base/common/errors.js';
import { Event } from '../../../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { isEqual } from '../../../../../../base/common/resources.js';
import { format } from '../../../../../../base/common/strings.js';
import { Position } from '../../../../../../editor/common/core/position.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { StandardTokenType } from '../../../../../../editor/common/encodedTokenAttributes.js';
import { InlineValueContext, InlineValueText, InlineValueVariableLookup } from '../../../../../../editor/common/languages.js';
import { IModelDeltaDecoration, ITextModel } from '../../../../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { localize } from '../../../../../../nls.js';
import { registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { createInlineValueDecoration } from '../../../../debug/browser/debugEditorContribution.js';
import { IDebugService, State } from '../../../../debug/common/debug.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';
import { ICellExecutionStateChangedEvent, INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';
import { INotebookKernelService, VariablesResult } from '../../../common/notebookKernelService.js';
import { INotebookActionContext, NotebookAction } from '../../controller/coreActions.js';
import { ICellViewModel, INotebookEditor, INotebookEditorContribution } from '../../notebookBrowser.js';
import { registerNotebookContribution } from '../../notebookEditorExtensions.js';

class InlineSegment {
	constructor(public column: number, public text: string) {
	}
}

export class NotebookInlineVariablesController extends Disposable implements INotebookEditorContribution {

	static readonly id: string = 'notebook.inlineVariablesController';

	private cellDecorationIds = new Map<ICellViewModel, string[]>();
	private cellContentListeners = new ResourceMap<IDisposable>();

	private currentCancellationTokenSources = new ResourceMap<CancellationTokenSource>();

	private static readonly MAX_CELL_LINES = 5000; // Skip extremely large cells

	constructor(
		private readonly notebookEditor: INotebookEditor,
		@INotebookKernelService private readonly notebookKernelService: INotebookKernelService,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IDebugService private readonly debugService: IDebugService,
	) {
		super();

		this._register(this.notebookExecutionStateService.onDidChangeExecution(async e => {
			const inlineValuesSetting = this.configurationService.getValue<'on' | 'auto' | 'off'>(NotebookSetting.notebookInlineValues);
			if (inlineValuesSetting === 'off') {
				return;
			}

			if (e.type === NotebookExecutionType.cell) {
				await this.updateInlineVariables(e);
			}
		}));

		this._register(Event.runAndSubscribe(this.configurationService.onDidChangeConfiguration, e => {
			if (!e || e.affectsConfiguration(NotebookSetting.notebookInlineValues)) {
				if (this.configurationService.getValue<'on' | 'auto' | 'off'>(NotebookSetting.notebookInlineValues) === 'off') {
					this.clearNotebookInlineDecorations();
				}
			}
		}));
	}

	private async updateInlineVariables(event: ICellExecutionStateChangedEvent): Promise<void> {
		if (event.changed) { // undefined -> execution was completed, so return on all else. no code should execute until we know it's an execution completion
			return;
		}

		const cell = this.notebookEditor.getCellByHandle(event.cellHandle);
		if (!cell) {
			return;
		}

		// Cancel any ongoing request in this cell
		const existingSource = this.currentCancellationTokenSources.get(cell.uri);
		if (existingSource) {
			existingSource.cancel();
		}

		// Create a new CancellationTokenSource for the new request per cell
		this.currentCancellationTokenSources.set(cell.uri, new CancellationTokenSource());
		const token = this.currentCancellationTokenSources.get(cell.uri)!.token;

		if (this.debugService.state !== State.Inactive) {
			this._clearNotebookInlineDecorations();
			return;
		}

		if (!this.notebookEditor.textModel?.uri || !isEqual(this.notebookEditor.textModel.uri, event.notebook)) {
			return;
		}

		const model = await cell.resolveTextModel();
		if (!model) {
			return;
		}

		const inlineValuesSetting = this.configurationService.getValue<'on' | 'auto' | 'off'>(NotebookSetting.notebookInlineValues);
		const hasInlineValueProvider = this.languageFeaturesService.inlineValuesProvider.has(model);

		// Skip if setting is off or if auto and no provider is registered
		if (inlineValuesSetting === 'off' || (inlineValuesSetting === 'auto' && !hasInlineValueProvider)) {
			return;
		}

		this.clearCellInlineDecorations(cell);

		const inlineDecorations: IModelDeltaDecoration[] = [];

		if (hasInlineValueProvider) {
			// use extension based provider, borrowed from https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/debug/browser/debugEditorContribution.ts#L679
			const lastLine = model.getLineCount();
			const lastColumn = model.getLineMaxColumn(lastLine);
			const ctx: InlineValueContext = {
				frameId: 0, // ignored, we won't have a stack from since not in a debug session
				stoppedLocation: new Range(lastLine, lastColumn, lastLine, lastColumn) // executing cell by cell, so "stopped" location would just be the end of document
			};

			const providers = this.languageFeaturesService.inlineValuesProvider.ordered(model).reverse();
			const lineDecorations = new Map<number, InlineSegment[]>();

			const fullCellRange = new Range(1, 1, lastLine, lastColumn);

			const promises = providers.flatMap(provider => Promise.resolve(provider.provideInlineValues(model, fullCellRange, ctx, token)).then(async (result) => {
				if (!result) {
					return;
				}

				const notebook = this.notebookEditor.textModel;
				if (!notebook) {
					return;
				}

				const kernel = this.notebookKernelService.getMatchingKernel(notebook);
				const kernelVars: VariablesResult[] = [];
				if (result.some(iv => iv.type === 'variable')) { // if anyone will need a lookup, get vars now to avoid needing to do it multiple times
					if (!this.notebookEditor.hasModel()) {
						return; // should not happen, a cell will be executed
					}
					const variables = kernel.selected?.provideVariables(event.notebook, undefined, 'named', 0, token);
					if (variables) {
						for await (const v of variables) {
							kernelVars.push(v);
						}
					}
				}

				for (const iv of result) {
					let text: string | undefined = undefined;
					switch (iv.type) {
						case 'text':
							text = (iv as InlineValueText).text;
							break;
						case 'variable': {
							const name = (iv as InlineValueVariableLookup).variableName;
							if (!name) {
								continue; // skip to next var, no valid name to lookup with
							}
							const value = kernelVars.find(v => v.name === name)?.value;
							if (!value) {
								continue;
							}
							text = format('{0} = {1}', name, value);
							break;
						}
						case 'expression': {
							continue; // no active debug session, so evaluate would break
						}
					}

					if (text) {
						const line = iv.range.startLineNumber;
						let lineSegments = lineDecorations.get(line);
						if (!lineSegments) {
							lineSegments = [];
							lineDecorations.set(line, lineSegments);
						}
						if (!lineSegments.some(iv => iv.text === text)) { // de-dupe
							lineSegments.push(new InlineSegment(iv.range.startColumn, text));
						}
					}
				}
			}, err => {
				onUnexpectedExternalError(err);
			}));

			await Promise.all(promises);

			// sort line segments and concatenate them into a decoration
			lineDecorations.forEach((segments, line) => {
				if (segments.length > 0) {
					segments.sort((a, b) => a.column - b.column);
					const text = segments.map(s => s.text).join(', ');
					const editorWidth = cell.layoutInfo.editorWidth;
					const fontInfo = cell.layoutInfo.fontInfo;
					if (fontInfo && cell.textModel) {
						const base = Math.floor((editorWidth - 50) / fontInfo.typicalHalfwidthCharacterWidth);
						const lineLength = cell.textModel.getLineLength(line);
						const available = Math.max(0, base - lineLength);
						inlineDecorations.push(...createInlineValueDecoration(line, text, 'nb', undefined, available));
					} else {
						inlineDecorations.push(...createInlineValueDecoration(line, text, 'nb'));
					}
				}
			});

		} else if (inlineValuesSetting === 'on') { // fallback approach only when setting is 'on'
			if (!this.notebookEditor.hasModel()) {
				return; // should not happen, a cell will be executed
			}
			const kernel = this.notebookKernelService.getMatchingKernel(this.notebookEditor.textModel);
			const variables = kernel?.selected?.provideVariables(event.notebook, undefined, 'named', 0, token);
			if (!variables) {
				return;
			}

			const vars: VariablesResult[] = [];
			for await (const v of variables) {
				vars.push(v);
			}
			const varNames: string[] = vars.map(v => v.name);

			const document = cell.textModel;
			if (!document) {
				return;
			}

			// Skip processing for extremely large cells
			if (document.getLineCount() > NotebookInlineVariablesController.MAX_CELL_LINES) {
				return;
			}

			const processedVars = new Set<string>();

			// Get both function ranges and comment ranges
			const functionRanges = this.getFunctionRanges(document);
			const commentedRanges = this.getCommentedRanges(document);
			const ignoredRanges = [...functionRanges, ...commentedRanges];
			const lineDecorations = new Map<number, InlineSegment[]>();

			// For each variable name found in the kernel results
			for (const varName of varNames) {
				if (processedVars.has(varName)) {
					continue;
				}

				// Look for variable usage globally - using word boundaries to ensure exact matches
				const regex = new RegExp(`\\b${varName}\\b(?!\\w)`, 'g');
				let lastMatchOutsideIgnored: { line: number; column: number } | null = null;
				let foundMatch = false;

				// Scan lines in reverse to find last occurrence first
				const lines = document.getValue().split('\n');
				for (let lineNumber = lines.length - 1; lineNumber >= 0; lineNumber--) {
					const line = lines[lineNumber];
					let match: RegExpExecArray | null;

					while ((match = regex.exec(line)) !== null) {
						const startIndex = match.index;
						const pos = new Position(lineNumber + 1, startIndex + 1);

						// Check if this position is in any ignored range (function or comment)
						if (!this.isPositionInRanges(pos, ignoredRanges)) {
							lastMatchOutsideIgnored = {
								line: lineNumber + 1,
								column: startIndex + 1
							};
							foundMatch = true;
							break; // Take first match in reverse order (which is last chronologically)
						}
					}

					if (foundMatch) {
						break; // We found our last valid occurrence, no need to check earlier lines
					}
				}

				if (lastMatchOutsideIgnored) {
					const inlineVal = varName + ' = ' + vars.find(v => v.name === varName)?.value;

					let lineSegments = lineDecorations.get(lastMatchOutsideIgnored.line);
					if (!lineSegments) {
						lineSegments = [];
						lineDecorations.set(lastMatchOutsideIgnored.line, lineSegments);
					}
					if (!lineSegments.some(iv => iv.text === inlineVal)) { // de-dupe
						lineSegments.push(new InlineSegment(lastMatchOutsideIgnored.column, inlineVal));
					}
				}

				processedVars.add(varName);
			}

			// sort line segments and concatenate them into a decoration
			lineDecorations.forEach((segments, line) => {
				if (segments.length > 0) {
					segments.sort((a, b) => a.column - b.column);
					const text = segments.map(s => s.text).join(', ');
					const editorWidth = cell.layoutInfo.editorWidth;
					const fontInfo = cell.layoutInfo.fontInfo;
					if (fontInfo && cell.textModel) {
						const base = Math.floor((editorWidth - 50) / fontInfo.typicalHalfwidthCharacterWidth);
						const lineLength = cell.textModel.getLineLength(line);
						const available = Math.max(0, base - lineLength);
						inlineDecorations.push(...createInlineValueDecoration(line, text, 'nb', undefined, available));
					} else {
						inlineDecorations.push(...createInlineValueDecoration(line, text, 'nb'));
					}
				}
			});
		}

		if (inlineDecorations.length > 0) {
			this.updateCellInlineDecorations(cell, inlineDecorations);
			this.initCellContentListener(cell);
		}
	}

	private getFunctionRanges(document: ITextModel): Range[] {
		return document.getLanguageId() === 'python'
			? this.getPythonFunctionRanges(document.getValue())
			: this.getBracedFunctionRanges(document.getValue());
	}

	private getPythonFunctionRanges(code: string): Range[] {
		const functionRanges: Range[] = [];
		const lines = code.split('\n');
		let functionStartLine = -1;
		let inFunction = false;
		let pythonIndentLevel = -1;
		const pythonFunctionDeclRegex = /^(\s*)(async\s+)?(?:def\s+\w+|class\s+\w+)\s*\([^)]*\)\s*:/;

		for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
			const line = lines[lineNumber];

			// Check for Python function/class declarations
			const pythonMatch = line.match(pythonFunctionDeclRegex);
			if (pythonMatch) {
				if (inFunction) {
					// If we're already in a function and find another at the same or lower indent, close the current one
					const currentIndent = pythonMatch[1].length;
					if (currentIndent <= pythonIndentLevel) {
						functionRanges.push(new Range(functionStartLine + 1, 1, lineNumber, line.length + 1));
						inFunction = false;
					}
				}

				if (!inFunction) {
					inFunction = true;
					functionStartLine = lineNumber;
					pythonIndentLevel = pythonMatch[1].length;
				}
				continue;
			}

			// Check indentation for Python functions
			if (inFunction) {
				// Skip empty lines
				if (line.trim() === '') {
					continue;
				}

				// Get the indentation of the current line
				const currentIndent = line.match(/^\s*/)?.[0].length ?? 0;

				// If we hit a line with same or lower indentation than where the function started,
				// we've exited the function
				if (currentIndent <= pythonIndentLevel) {
					functionRanges.push(new Range(functionStartLine + 1, 1, lineNumber, line.length + 1));
					inFunction = false;
					pythonIndentLevel = -1;
				}
			}
		}

		// Handle case where Python function is at the end of the document
		if (inFunction) {
			functionRanges.push(new Range(functionStartLine + 1, 1, lines.length, lines[lines.length - 1].length + 1));
		}

		return functionRanges;
	}

	private getBracedFunctionRanges(code: string): Range[] {
		const functionRanges: Range[] = [];
		const lines = code.split('\n');
		let braceDepth = 0;
		let functionStartLine = -1;
		let inFunction = false;
		const functionDeclRegex = /\b(?:function\s+\w+|(?:async\s+)?(?:\w+\s*=\s*)?\([^)]*\)\s*=>|class\s+\w+|(?:public|private|protected|static)?\s*\w+\s*\([^)]*\)\s*{)/;

		for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
			const line = lines[lineNumber];
			for (const char of line) {
				if (char === '{') {
					if (!inFunction && functionDeclRegex.test(line)) {
						inFunction = true;
						functionStartLine = lineNumber;
					}
					braceDepth++;
				} else if (char === '}') {
					braceDepth--;
					if (braceDepth === 0 && inFunction) {
						functionRanges.push(new Range(functionStartLine + 1, 1, lineNumber + 1, line.length + 1));
						inFunction = false;
					}
				}
			}
		}

		return functionRanges;
	}

	private getCommentedRanges(document: ITextModel): Range[] {
		return this._getCommentedRanges(document);
	}

	private _getCommentedRanges(document: ITextModel): Range[] {
		try {
			return this.getCommentedRangesByAccurateTokenization(document);
		} catch (e) {
			// Fall back to manual parsing if tokenization fails
			return this.getCommentedRangesByManualParsing(document);
		}
	}

	private getCommentedRangesByAccurateTokenization(document: ITextModel): Range[] {
		const commentRanges: Range[] = [];
		const lineCount = document.getLineCount();

		// Skip processing for extremely large documents
		if (lineCount > NotebookInlineVariablesController.MAX_CELL_LINES) {
			return commentRanges;
		}

		// Process each line - force tokenization if needed and process tokens in a single pass
		for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
			// Force tokenization if needed
			if (!document.tokenization.hasAccurateTokensForLine(lineNumber)) {
				document.tokenization.forceTokenization(lineNumber);
			}

			const lineTokens = document.tokenization.getLineTokens(lineNumber);

			// Skip lines with no tokens
			if (lineTokens.getCount() === 0) {
				continue;
			}

			let startCharacter: number | undefined;

			// Check each token in the line
			for (let tokenIndex = 0; tokenIndex < lineTokens.getCount(); tokenIndex++) {
				const tokenType = lineTokens.getStandardTokenType(tokenIndex);

				if (tokenType === StandardTokenType.Comment || tokenType === StandardTokenType.String || tokenType === StandardTokenType.RegEx) {
					if (startCharacter === undefined) {
						// Start of a comment or string
						startCharacter = lineTokens.getStartOffset(tokenIndex);
					}

					const endCharacter = lineTokens.getEndOffset(tokenIndex);

					// Check if this is the end of the comment/string section (either end of line or different token type follows)
					const isLastToken = tokenIndex === lineTokens.getCount() - 1;
					const nextTokenDifferent = !isLastToken &&
						lineTokens.getStandardTokenType(tokenIndex + 1) !== tokenType;

					if (isLastToken || nextTokenDifferent) {
						// End of comment/string section
						commentRanges.push(new Range(lineNumber, startCharacter + 1, lineNumber, endCharacter + 1));
						startCharacter = undefined;
					}
				} else {
					// Reset when we hit a non-comment, non-string token
					startCharacter = undefined;
				}
			}
		}

		return commentRanges;
	}

	private getCommentedRangesByManualParsing(document: ITextModel): Range[] {
		const commentRanges: Range[] = [];
		const lines = document.getValue().split('\n');
		const languageId = document.getLanguageId();

		// Different comment patterns by language
		const lineCommentToken =
			languageId === 'python' ? '#' :
				languageId === 'javascript' || languageId === 'typescript' ? '//' :
					null;

		const blockComments =
			(languageId === 'javascript' || languageId === 'typescript') ? { start: '/*', end: '*/' } :
				null;

		let inBlockComment = false;
		let blockCommentStartLine = -1;
		let blockCommentStartCol = -1;

		for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
			const line = lines[lineNumber];
			const trimmedLine = line.trim();

			// Skip empty lines
			if (trimmedLine.length === 0) {
				continue;
			}

			if (blockComments) {
				if (!inBlockComment) {
					const startIndex = line.indexOf(blockComments.start);
					if (startIndex !== -1) {
						inBlockComment = true;
						blockCommentStartLine = lineNumber;
						blockCommentStartCol = startIndex;
					}
				}

				if (inBlockComment) {
					const endIndex = line.indexOf(blockComments.end);
					if (endIndex !== -1) {
						commentRanges.push(new Range(
							blockCommentStartLine + 1,
							blockCommentStartCol + 1,
							lineNumber + 1,
							endIndex + blockComments.end.length + 1
						));
						inBlockComment = false;
					}
					continue;
				}
			}

			if (!inBlockComment && lineCommentToken && line.trimLeft().startsWith(lineCommentToken)) {
				const startCol = line.indexOf(lineCommentToken);
				commentRanges.push(new Range(
					lineNumber + 1,
					startCol + 1,
					lineNumber + 1,
					line.length + 1
				));
			}
		}

		// Handle block comment at end of file
		if (inBlockComment) {
			commentRanges.push(new Range(
				blockCommentStartLine + 1,
				blockCommentStartCol + 1,
				lines.length,
				lines[lines.length - 1].length + 1
			));
		}

		return commentRanges;
	}

	private isPositionInRanges(position: Position, ranges: Range[]): boolean {
		return ranges.some(range => range.containsPosition(position));
	}

	private updateCellInlineDecorations(cell: ICellViewModel, decorations: IModelDeltaDecoration[]) {
		const oldDecorations = this.cellDecorationIds.get(cell) ?? [];
		this.cellDecorationIds.set(cell, cell.deltaModelDecorations(
			oldDecorations,
			decorations
		));
	}

	private initCellContentListener(cell: ICellViewModel) {
		const cellModel = cell.textModel;
		if (!cellModel) {
			return; // should not happen
		}

		// Clear decorations on content change
		this.cellContentListeners.set(cell.uri, cellModel.onDidChangeContent(() => {
			this.clearCellInlineDecorations(cell);
		}));
	}

	private clearCellInlineDecorations(cell: ICellViewModel) {
		const cellDecorations = this.cellDecorationIds.get(cell) ?? [];
		if (cellDecorations) {
			cell.deltaModelDecorations(cellDecorations, []);
			this.cellDecorationIds.delete(cell);
		}

		const listener = this.cellContentListeners.get(cell.uri);
		if (listener) {
			listener.dispose();
			this.cellContentListeners.delete(cell.uri);
		}
	}

	private _clearNotebookInlineDecorations() {
		this.cellDecorationIds.forEach((_, cell) => {
			this.clearCellInlineDecorations(cell);
		});
	}

	public clearNotebookInlineDecorations() {
		this._clearNotebookInlineDecorations();
	}

	override dispose(): void {
		super.dispose();
		this._clearNotebookInlineDecorations();
		this.currentCancellationTokenSources.forEach(source => source.cancel());
		this.currentCancellationTokenSources.clear();
		this.cellContentListeners.forEach(listener => listener.dispose());
		this.cellContentListeners.clear();
	}
}

registerNotebookContribution(NotebookInlineVariablesController.id, NotebookInlineVariablesController);

registerAction2(class ClearNotebookInlineValues extends NotebookAction {
	constructor() {
		super({
			id: 'notebook.clearAllInlineValues',
			title: localize('clearAllInlineValues', 'Clear All Inline Values'),
		});
	}

	override runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const editor = context.notebookEditor;
		const controller = editor.getContribution<NotebookInlineVariablesController>(NotebookInlineVariablesController.id);
		controller.clearNotebookInlineDecorations();
		return Promise.resolve();
	}

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariableCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariableCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { URI, UriComponents } from '../../../../../../base/common/uri.js';
import { localize } from '../../../../../../nls.js';
import { Action2, registerAction2 } from '../../../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { ServicesAccessor } from '../../../../../../platform/instantiation/common/instantiation.js';
import { contextMenuArg } from './notebookVariablesView.js';
import { INotebookKernelService, VariablesResult } from '../../../common/notebookKernelService.js';
import { INotebookService } from '../../../common/notebookService.js';

export const COPY_NOTEBOOK_VARIABLE_VALUE_ID = 'workbench.debug.viewlet.action.copyWorkspaceVariableValue';
export const COPY_NOTEBOOK_VARIABLE_VALUE_LABEL = localize('copyWorkspaceVariableValue', "Copy Value");
registerAction2(class extends Action2 {
	constructor() {
		super({
			id: COPY_NOTEBOOK_VARIABLE_VALUE_ID,
			title: COPY_NOTEBOOK_VARIABLE_VALUE_LABEL,
			f1: false,
		});
	}

	run(accessor: ServicesAccessor, context: contextMenuArg): void {
		const clipboardService = accessor.get(IClipboardService);

		if (context.value) {
			clipboardService.writeText(context.value);
		}
	}
});


registerAction2(class extends Action2 {
	constructor() {
		super({
			id: '_executeNotebookVariableProvider',
			title: localize('executeNotebookVariableProvider', "Execute Notebook Variable Provider"),
			f1: false,
		});
	}

	async run(accessor: ServicesAccessor, resource: UriComponents | undefined): Promise<VariablesResult[]> {
		if (!resource) {
			return [];
		}

		const uri = URI.revive(resource);
		const notebookKernelService = accessor.get(INotebookKernelService);
		const notebookService = accessor.get(INotebookService);
		const notebookTextModel = notebookService.getNotebookTextModel(uri);

		if (!notebookTextModel) {
			return [];
		}

		const selectedKernel = notebookKernelService.getMatchingKernel(notebookTextModel).selected;
		if (selectedKernel && selectedKernel.hasVariableProvider) {
			const variableIterable = selectedKernel.provideVariables(notebookTextModel.uri, undefined, 'named', 0, CancellationToken.None);
			const collected: VariablesResult[] = [];
			for await (const variable of variableIterable) {
				collected.push(variable);
			}
			return collected;
		}

		return [];
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariableContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariableContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../../../platform/contextkey/common/contextkey.js';

export const NOTEBOOK_VARIABLE_VIEW_ENABLED = new RawContextKey<boolean>('notebookVariableViewEnabled', false);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariables.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariables.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../base/common/uri.js';
import * as nls from '../../../../../../nls.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution } from '../../../../../common/contributions.js';
import { Extensions, IViewDescriptorService, IViewsRegistry } from '../../../../../common/views.js';
import { VIEWLET_ID as debugContainerId } from '../../../../debug/common/debug.js';
import { NOTEBOOK_VARIABLE_VIEW_ENABLED } from './notebookVariableContextKeys.js';
import { NotebookVariablesView } from './notebookVariablesView.js';
import { getNotebookEditorFromEditorPane } from '../../notebookBrowser.js';
import { variablesViewIcon } from '../../notebookIcons.js';
import { NotebookSetting } from '../../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { INotebookKernelService } from '../../../common/notebookKernelService.js';
import { INotebookService } from '../../../common/notebookService.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';

export class NotebookVariables extends Disposable implements IWorkbenchContribution {
	private listeners: IDisposable[] = [];
	private configListener: IDisposable;
	private initialized = false;

	private viewEnabled: IContextKey<boolean>;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IEditorService private readonly editorService: IEditorService,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
		@INotebookKernelService private readonly notebookKernelService: INotebookKernelService,
		@INotebookService private readonly notebookDocumentService: INotebookService,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService
	) {
		super();

		this.viewEnabled = NOTEBOOK_VARIABLE_VIEW_ENABLED.bindTo(contextKeyService);

		this.listeners.push(this.editorService.onDidActiveEditorChange(() => this.handleInitEvent()));
		this.listeners.push(this.notebookExecutionStateService.onDidChangeExecution((e) => this.handleInitEvent(e.notebook)));

		this.configListener = configurationService.onDidChangeConfiguration((e) => this.handleConfigChange(e));
	}

	private handleConfigChange(e: IConfigurationChangeEvent) {
		if (e.affectsConfiguration(NotebookSetting.notebookVariablesView)) {
			this.handleInitEvent();
		}
	}

	private handleInitEvent(notebook?: URI) {
		const enabled =
			this.editorService.activeEditorPane?.getId() === 'workbench.editor.repl' ||
			this.configurationService.getValue(NotebookSetting.notebookVariablesView) ||
			// old setting key
			this.configurationService.getValue('notebook.experimental.variablesView');
		if (enabled && (!!notebook || this.editorService.activeEditorPane?.getId() === 'workbench.editor.notebook')) {
			if (this.hasVariableProvider(notebook) && !this.initialized && this.initializeView()) {
				this.viewEnabled.set(true);
				this.initialized = true;
				this.listeners.forEach(listener => listener.dispose());
			}
		}
	}

	private hasVariableProvider(notebookUri?: URI) {
		const notebook = notebookUri ?
			this.notebookDocumentService.getNotebookTextModel(notebookUri) :
			getNotebookEditorFromEditorPane(this.editorService.activeEditorPane)?.getViewModel()?.notebookDocument;
		return notebook && this.notebookKernelService.getMatchingKernel(notebook).selected?.hasVariableProvider;
	}

	private initializeView() {
		const debugViewContainer = this.viewDescriptorService.getViewContainerById(debugContainerId);

		if (debugViewContainer) {
			const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
			const viewDescriptor = {
				id: 'workbench.notebook.variables', name: nls.localize2('notebookVariables', "Notebook Variables"),
				containerIcon: variablesViewIcon, ctorDescriptor: new SyncDescriptor(NotebookVariablesView),
				order: 50, weight: 5, canToggleVisibility: true, canMoveView: true, collapsed: false, when: NOTEBOOK_VARIABLE_VIEW_ENABLED
			};

			viewsRegistry.registerViews([viewDescriptor], debugViewContainer);
			return true;
		}

		return false;
	}

	override dispose(): void {
		super.dispose();
		this.listeners.forEach(listener => listener.dispose());
		this.configListener.dispose();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesDataSource.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/contrib/notebookVariables/notebookVariablesDataSource.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAsyncDataSource } from '../../../../../../base/browser/ui/tree/tree.js';
import { CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { localize } from '../../../../../../nls.js';
import { NotebookTextModel } from '../../../common/model/notebookTextModel.js';
import { INotebookKernel, INotebookKernelService, VariablesResult, variablePageSize } from '../../../common/notebookKernelService.js';

export interface IEmptyScope {
	kind: 'empty';
}

export interface INotebookScope {
	kind: 'root';
	readonly notebook: NotebookTextModel;
}

export interface INotebookVariableElement {
	kind: 'variable';
	readonly id: string;
	readonly extHostId: number;
	readonly name: string;
	readonly value: string;
	readonly type?: string;
	readonly interfaces?: string[];
	readonly expression?: string;
	readonly language?: string;
	readonly indexedChildrenCount: number;
	readonly indexStart?: number;
	readonly hasNamedChildren: boolean;
	readonly notebook: NotebookTextModel;
	readonly extensionId?: string;
}

export class NotebookVariableDataSource implements IAsyncDataSource<INotebookScope, INotebookVariableElement> {

	private cancellationTokenSource: CancellationTokenSource;

	constructor(private readonly notebookKernelService: INotebookKernelService) {
		this.cancellationTokenSource = new CancellationTokenSource();
	}

	hasChildren(element: INotebookScope | INotebookVariableElement): boolean {
		return element.kind === 'root' || element.hasNamedChildren || element.indexedChildrenCount > 0;
	}

	public cancel(): void {
		this.cancellationTokenSource.cancel();
		this.cancellationTokenSource.dispose();
		this.cancellationTokenSource = new CancellationTokenSource();
	}

	async getChildren(element: INotebookScope | INotebookVariableElement | IEmptyScope): Promise<Array<INotebookVariableElement>> {
		if (element.kind === 'empty') {
			return [];
		} else if (element.kind === 'root') {
			return this.getRootVariables(element.notebook);
		} else {
			return this.getVariables(element);
		}
	}

	private async getVariables(parent: INotebookVariableElement): Promise<INotebookVariableElement[]> {
		const selectedKernel = this.notebookKernelService.getMatchingKernel(parent.notebook).selected;
		if (selectedKernel && selectedKernel.hasVariableProvider) {

			let children: INotebookVariableElement[] = [];
			if (parent.hasNamedChildren) {
				const variables = selectedKernel.provideVariables(parent.notebook.uri, parent.extHostId, 'named', 0, this.cancellationTokenSource.token);
				for await (const variable of variables) {
					children.push(this.createVariableElement(variable, parent.notebook));
				}
			}
			if (parent.indexedChildrenCount > 0) {
				const childNodes = await this.getIndexedChildren(parent, selectedKernel);
				children = children.concat(childNodes);
			}

			return children;
		}
		return [];
	}

	private async getIndexedChildren(parent: INotebookVariableElement, kernel: INotebookKernel) {
		const childNodes: INotebookVariableElement[] = [];

		if (parent.indexedChildrenCount > variablePageSize) {

			const nestedPageSize = Math.floor(Math.max(parent.indexedChildrenCount / variablePageSize, 100));

			const indexedChildCountLimit = 1_000_000;
			let start = parent.indexStart ?? 0;
			const last = start + Math.min(parent.indexedChildrenCount, indexedChildCountLimit);
			for (; start < last; start += nestedPageSize) {
				let end = start + nestedPageSize;
				if (end > last) {
					end = last;
				}

				childNodes.push({
					kind: 'variable',
					notebook: parent.notebook,
					id: parent.id + `${start}`,
					extHostId: parent.extHostId,
					name: `[${start}..${end - 1}]`,
					value: '',
					indexedChildrenCount: end - start,
					indexStart: start,
					hasNamedChildren: false
				});
			}

			if (parent.indexedChildrenCount > indexedChildCountLimit) {
				childNodes.push({
					kind: 'variable',
					notebook: parent.notebook,
					id: parent.id + `${last + 1}`,
					extHostId: parent.extHostId,
					name: localize('notebook.indexedChildrenLimitReached', "Display limit reached"),
					value: '',
					indexedChildrenCount: 0,
					hasNamedChildren: false
				});
			}
		}
		else if (parent.indexedChildrenCount > 0) {
			const variables = kernel.provideVariables(parent.notebook.uri, parent.extHostId, 'indexed', parent.indexStart ?? 0, this.cancellationTokenSource.token);

			for await (const variable of variables) {
				childNodes.push(this.createVariableElement(variable, parent.notebook));
				if (childNodes.length >= variablePageSize) {
					break;
				}
			}

		}
		return childNodes;
	}

	private async getRootVariables(notebook: NotebookTextModel): Promise<INotebookVariableElement[]> {
		const selectedKernel = this.notebookKernelService.getMatchingKernel(notebook).selected;
		if (selectedKernel && selectedKernel.hasVariableProvider) {
			const variables = selectedKernel.provideVariables(notebook.uri, undefined, 'named', 0, this.cancellationTokenSource.token);
			const varElements: INotebookVariableElement[] = [];
			for await (const variable of variables) {
				varElements.push(this.createVariableElement(variable, notebook));
			}
			return varElements;
		}

		return [];
	}

	private createVariableElement(variable: VariablesResult, notebook: NotebookTextModel): INotebookVariableElement {
		return {
			...variable,
			kind: 'variable',
			notebook,
			extHostId: variable.id,
			id: `${variable.id}`
		};
	}
}
```

--------------------------------------------------------------------------------

````

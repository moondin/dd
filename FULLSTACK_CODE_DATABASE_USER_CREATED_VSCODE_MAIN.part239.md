---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 239
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 239 of 552)

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

---[FILE: src/vs/editor/contrib/suggest/browser/suggestWidget.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import '../../../../base/browser/ui/codicons/codiconStyles.js'; // The codicon symbol styles are defined here and must be loaded
import { IListEvent, IListGestureEvent, IListMouseEvent } from '../../../../base/browser/ui/list/list.js';
import { List } from '../../../../base/browser/ui/list/listWidget.js';
import { CancelablePromise, createCancelablePromise, disposableTimeout, TimeoutTimer } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event, PauseableEmitter } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import * as strings from '../../../../base/common/strings.js';
import './media/suggest.css';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition, IEditorMouseEvent } from '../../../browser/editorBrowser.js';
import { EmbeddedCodeEditorWidget } from '../../../browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { SuggestWidgetStatus } from './suggestWidgetStatus.js';
import '../../symbolIcons/browser/symbolIcons.js'; // The codicon symbol colors are defined here and must be loaded to get colors
import * as nls from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { activeContrastBorder, editorForeground, editorWidgetBackground, editorWidgetBorder, listFocusHighlightForeground, listHighlightForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { CompletionModel } from './completionModel.js';
import { ResizableHTMLElement } from '../../../../base/browser/ui/resizable/resizable.js';
import { CompletionItem, Context as SuggestContext, suggestWidgetStatusbarMenu } from './suggest.js';
import { canExpandCompletionItem, SuggestDetailsOverlay, SuggestDetailsWidget } from './suggestWidgetDetails.js';
import { ItemRenderer } from './suggestWidgetRenderer.js';
import { getListStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';
import { CompletionItemKinds } from '../../../common/languages.js';
import { isWindows } from '../../../../base/common/platform.js';

/**
 * Suggest widget colors
 */
registerColor('editorSuggestWidget.background', editorWidgetBackground, nls.localize('editorSuggestWidgetBackground', 'Background color of the suggest widget.'));
registerColor('editorSuggestWidget.border', editorWidgetBorder, nls.localize('editorSuggestWidgetBorder', 'Border color of the suggest widget.'));
export const editorSuggestWidgetForeground = registerColor('editorSuggestWidget.foreground', editorForeground, nls.localize('editorSuggestWidgetForeground', 'Foreground color of the suggest widget.'));
registerColor('editorSuggestWidget.selectedForeground', quickInputListFocusForeground, nls.localize('editorSuggestWidgetSelectedForeground', 'Foreground color of the selected entry in the suggest widget.'));
registerColor('editorSuggestWidget.selectedIconForeground', quickInputListFocusIconForeground, nls.localize('editorSuggestWidgetSelectedIconForeground', 'Icon foreground color of the selected entry in the suggest widget.'));
export const editorSuggestWidgetSelectedBackground = registerColor('editorSuggestWidget.selectedBackground', quickInputListFocusBackground, nls.localize('editorSuggestWidgetSelectedBackground', 'Background color of the selected entry in the suggest widget.'));
registerColor('editorSuggestWidget.highlightForeground', listHighlightForeground, nls.localize('editorSuggestWidgetHighlightForeground', 'Color of the match highlights in the suggest widget.'));
registerColor('editorSuggestWidget.focusHighlightForeground', listFocusHighlightForeground, nls.localize('editorSuggestWidgetFocusHighlightForeground', 'Color of the match highlights in the suggest widget when an item is focused.'));
registerColor('editorSuggestWidgetStatus.foreground', transparent(editorSuggestWidgetForeground, .5), nls.localize('editorSuggestWidgetStatusForeground', 'Foreground color of the suggest widget status.'));

const enum State {
	Hidden,
	Loading,
	Empty,
	Open,
	Frozen,
	Details,
	onDetailsKeyDown
}

export interface ISelectedSuggestion {
	item: CompletionItem;
	index: number;
	model: CompletionModel;
}

class PersistedWidgetSize {

	private readonly _key: string;

	constructor(
		private readonly _service: IStorageService,
		editor: ICodeEditor
	) {
		this._key = `suggestWidget.size/${editor.getEditorType()}/${editor instanceof EmbeddedCodeEditorWidget}`;
	}

	restore(): dom.Dimension | undefined {
		const raw = this._service.get(this._key, StorageScope.PROFILE) ?? '';
		try {
			const obj = JSON.parse(raw);
			if (dom.Dimension.is(obj)) {
				return dom.Dimension.lift(obj);
			}
		} catch {
			// ignore
		}
		return undefined;
	}

	store(size: dom.Dimension) {
		this._service.store(this._key, JSON.stringify(size), StorageScope.PROFILE, StorageTarget.MACHINE);
	}

	reset(): void {
		this._service.remove(this._key, StorageScope.PROFILE);
	}
}

export class SuggestWidget implements IDisposable {

	private static LOADING_MESSAGE: string = nls.localize('suggestWidget.loading', "Loading...");
	private static NO_SUGGESTIONS_MESSAGE: string = nls.localize('suggestWidget.noSuggestions', "No suggestions.");

	private _state: State = State.Hidden;
	private _isAuto: boolean = false;
	private _loadingTimeout?: IDisposable;
	private readonly _pendingLayout = new MutableDisposable();
	private readonly _pendingShowDetails = new MutableDisposable();
	private _currentSuggestionDetails?: CancelablePromise<void>;
	private _focusedItem?: CompletionItem;
	private _ignoreFocusEvents: boolean = false;
	private _completionModel?: CompletionModel;
	private _cappedHeight?: { wanted: number; capped: number };
	private _forceRenderingAbove: boolean = false;
	private _explainMode: boolean = false;

	readonly element: ResizableHTMLElement;
	private readonly _messageElement: HTMLElement;
	private readonly _listElement: HTMLElement;
	private readonly _list: List<CompletionItem>;
	private readonly _status: SuggestWidgetStatus;
	private readonly _details: SuggestDetailsOverlay;
	private readonly _contentWidget: SuggestContentWidget;
	private readonly _persistedSize: PersistedWidgetSize;

	private readonly _ctxSuggestWidgetVisible: IContextKey<boolean>;
	private readonly _ctxSuggestWidgetDetailsVisible: IContextKey<boolean>;
	private readonly _ctxSuggestWidgetMultipleSuggestions: IContextKey<boolean>;
	private readonly _ctxSuggestWidgetHasFocusedSuggestion: IContextKey<boolean>;
	private readonly _ctxSuggestWidgetDetailsFocused: IContextKey<boolean>;

	private readonly _showTimeout = new TimeoutTimer();
	private readonly _disposables = new DisposableStore();


	private readonly _onDidSelect = new PauseableEmitter<ISelectedSuggestion>();
	private readonly _onDidFocus = new PauseableEmitter<ISelectedSuggestion>();
	private readonly _onDidHide = new Emitter<this>();
	private readonly _onDidShow = new Emitter<this>();

	readonly onDidSelect: Event<ISelectedSuggestion> = this._onDidSelect.event;
	readonly onDidFocus: Event<ISelectedSuggestion> = this._onDidFocus.event;
	readonly onDidHide: Event<this> = this._onDidHide.event;
	readonly onDidShow: Event<this> = this._onDidShow.event;

	private readonly _onDetailsKeydown = new Emitter<IKeyboardEvent>();
	readonly onDetailsKeyDown: Event<IKeyboardEvent> = this._onDetailsKeydown.event;

	constructor(
		private readonly editor: ICodeEditor,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService _contextKeyService: IContextKeyService,
		@IThemeService _themeService: IThemeService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		this.element = new ResizableHTMLElement();
		this.element.domNode.classList.add('editor-widget', 'suggest-widget');

		this._contentWidget = new SuggestContentWidget(this, editor);
		this._persistedSize = new PersistedWidgetSize(_storageService, editor);

		class ResizeState {
			constructor(
				readonly persistedSize: dom.Dimension | undefined,
				readonly currentSize: dom.Dimension,
				public persistHeight = false,
				public persistWidth = false,
			) { }
		}

		let state: ResizeState | undefined;
		this._disposables.add(this.element.onDidWillResize(() => {
			this._contentWidget.lockPreference();
			state = new ResizeState(this._persistedSize.restore(), this.element.size);
		}));
		this._disposables.add(this.element.onDidResize(e => {

			this._resize(e.dimension.width, e.dimension.height);

			if (state) {
				state.persistHeight = state.persistHeight || !!e.north || !!e.south;
				state.persistWidth = state.persistWidth || !!e.east || !!e.west;
			}

			if (!e.done) {
				return;
			}

			if (state) {
				// only store width or height value that have changed and also
				// only store changes that are above a certain threshold
				const { itemHeight, defaultSize } = this.getLayoutInfo();
				const threshold = Math.round(itemHeight / 2);
				let { width, height } = this.element.size;
				if (!state.persistHeight || Math.abs(state.currentSize.height - height) <= threshold) {
					height = state.persistedSize?.height ?? defaultSize.height;
				}
				if (!state.persistWidth || Math.abs(state.currentSize.width - width) <= threshold) {
					width = state.persistedSize?.width ?? defaultSize.width;
				}
				this._persistedSize.store(new dom.Dimension(width, height));
			}

			// reset working state
			this._contentWidget.unlockPreference();
			state = undefined;
		}));

		this._messageElement = dom.append(this.element.domNode, dom.$('.message'));
		this._listElement = dom.append(this.element.domNode, dom.$('.tree'));

		const details = this._disposables.add(instantiationService.createInstance(SuggestDetailsWidget, this.editor));
		details.onDidClose(() => this.toggleDetails(), this, this._disposables);
		this._details = new SuggestDetailsOverlay(details, this.editor);

		const applyIconStyle = () => this.element.domNode.classList.toggle('no-icons', !this.editor.getOption(EditorOption.suggest).showIcons);
		applyIconStyle();

		const renderer = instantiationService.createInstance(ItemRenderer, this.editor);
		this._disposables.add(renderer);
		this._disposables.add(renderer.onDidToggleDetails(() => this.toggleDetails()));

		this._list = new List('SuggestWidget', this._listElement, {
			getHeight: (_element: CompletionItem): number => this.getLayoutInfo().itemHeight,
			getTemplateId: (_element: CompletionItem): string => 'suggestion'
		}, [renderer], {
			alwaysConsumeMouseWheel: true,
			useShadows: false,
			mouseSupport: false,
			multipleSelectionSupport: false,
			accessibilityProvider: {
				getRole: () => isWindows ? 'listitem' : 'option',
				getWidgetAriaLabel: () => nls.localize('suggest', "Suggest"),
				getWidgetRole: () => 'listbox',
				getAriaLabel: (item: CompletionItem) => {

					let label = item.textLabel;
					const kindLabel = CompletionItemKinds.toLabel(item.completion.kind);
					if (typeof item.completion.label !== 'string') {
						const { detail, description } = item.completion.label;
						if (detail && description) {
							label = nls.localize('label.full', '{0} {1}, {2}, {3}', label, detail, description, kindLabel);
						} else if (detail) {
							label = nls.localize('label.detail', '{0} {1}, {2}', label, detail, kindLabel);
						} else if (description) {
							label = nls.localize('label.desc', '{0}, {1}, {2}', label, description, kindLabel);
						}
					} else {
						label = nls.localize('label', '{0}, {1}', label, kindLabel);
					}
					if (!item.isResolved || !this._isDetailsVisible()) {
						return label;
					}

					const { documentation, detail } = item.completion;
					const docs = strings.format(
						'{0}{1}',
						detail || '',
						documentation ? (typeof documentation === 'string' ? documentation : documentation.value) : '');

					return nls.localize('ariaCurrenttSuggestionReadDetails', "{0}, docs: {1}", label, docs);
				},
			}
		});
		this._list.style(getListStyles({
			listInactiveFocusBackground: editorSuggestWidgetSelectedBackground,
			listInactiveFocusOutline: activeContrastBorder
		}));

		this._status = instantiationService.createInstance(SuggestWidgetStatus, this.element.domNode, suggestWidgetStatusbarMenu);
		const applyStatusBarStyle = () => this.element.domNode.classList.toggle('with-status-bar', this.editor.getOption(EditorOption.suggest).showStatusBar);
		applyStatusBarStyle();

		this._disposables.add(this._list.onMouseDown(e => this._onListMouseDownOrTap(e)));
		this._disposables.add(this._list.onTap(e => this._onListMouseDownOrTap(e)));
		this._disposables.add(this._list.onDidChangeSelection(e => this._onListSelection(e)));
		this._disposables.add(this._list.onDidChangeFocus(e => this._onListFocus(e)));
		this._disposables.add(this.editor.onDidChangeCursorSelection(() => this._onCursorSelectionChanged()));
		this._disposables.add(this.editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.suggest)) {
				applyStatusBarStyle();
				applyIconStyle();
			}
			if (this._completionModel && (e.hasChanged(EditorOption.fontInfo) || e.hasChanged(EditorOption.suggestFontSize) || e.hasChanged(EditorOption.suggestLineHeight))) {
				this._list.splice(0, this._list.length, this._completionModel.items);
			}
		}));

		this._ctxSuggestWidgetVisible = SuggestContext.Visible.bindTo(_contextKeyService);
		this._ctxSuggestWidgetDetailsVisible = SuggestContext.DetailsVisible.bindTo(_contextKeyService);
		this._ctxSuggestWidgetMultipleSuggestions = SuggestContext.MultipleSuggestions.bindTo(_contextKeyService);
		this._ctxSuggestWidgetHasFocusedSuggestion = SuggestContext.HasFocusedSuggestion.bindTo(_contextKeyService);
		this._ctxSuggestWidgetDetailsFocused = SuggestContext.DetailsFocused.bindTo(_contextKeyService);

		const detailsFocusTracker = dom.trackFocus(this._details.widget.domNode);
		this._disposables.add(detailsFocusTracker);
		this._disposables.add(detailsFocusTracker.onDidFocus(() => this._ctxSuggestWidgetDetailsFocused.set(true)));
		this._disposables.add(detailsFocusTracker.onDidBlur(() => this._ctxSuggestWidgetDetailsFocused.set(false)));

		this._disposables.add(dom.addStandardDisposableListener(this._details.widget.domNode, 'keydown', e => {
			this._onDetailsKeydown.fire(e);
		}));

		this._disposables.add(this.editor.onMouseDown((e: IEditorMouseEvent) => this._onEditorMouseDown(e)));
	}

	dispose(): void {
		this._details.widget.dispose();
		this._details.dispose();
		this._list.dispose();
		this._status.dispose();
		this._disposables.dispose();
		this._loadingTimeout?.dispose();
		this._pendingLayout.dispose();
		this._pendingShowDetails.dispose();
		this._showTimeout.dispose();
		this._contentWidget.dispose();
		this.element.dispose();
	}

	private _onEditorMouseDown(mouseEvent: IEditorMouseEvent): void {
		if (this._details.widget.domNode.contains(mouseEvent.target.element)) {
			// Clicking inside details
			this._details.widget.domNode.focus();
		} else {
			// Clicking outside details and inside suggest
			if (this.element.domNode.contains(mouseEvent.target.element)) {
				this.editor.focus();
			}
		}
	}

	private _onCursorSelectionChanged(): void {
		if (this._state !== State.Hidden) {
			this._contentWidget.layout();
		}
	}

	private _onListMouseDownOrTap(e: IListMouseEvent<CompletionItem> | IListGestureEvent<CompletionItem>): void {
		if (typeof e.element === 'undefined' || typeof e.index === 'undefined') {
			return;
		}

		// prevent stealing browser focus from the editor
		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();

		this._select(e.element, e.index);
	}

	private _onListSelection(e: IListEvent<CompletionItem>): void {
		if (e.elements.length) {
			this._select(e.elements[0], e.indexes[0]);
		}
	}

	private _select(item: CompletionItem, index: number): void {
		const completionModel = this._completionModel;
		if (completionModel) {
			this._onDidSelect.fire({ item, index, model: completionModel });
			this.editor.focus();
		}
	}

	private _onListFocus(e: IListEvent<CompletionItem>): void {
		if (this._ignoreFocusEvents) {
			return;
		}

		if (this._state === State.Details) {
			// This can happen when focus is in the details-panel and when
			// arrow keys are pressed to select next/prev items
			this._setState(State.Open);
		}

		if (!e.elements.length) {
			if (this._currentSuggestionDetails) {
				this._currentSuggestionDetails.cancel();
				this._currentSuggestionDetails = undefined;
				this._focusedItem = undefined;
			}

			this.editor.setAriaOptions({ activeDescendant: undefined });
			this._ctxSuggestWidgetHasFocusedSuggestion.set(false);
			return;
		}

		if (!this._completionModel) {
			return;
		}

		this._ctxSuggestWidgetHasFocusedSuggestion.set(true);
		const item = e.elements[0];
		const index = e.indexes[0];

		if (item !== this._focusedItem) {

			this._currentSuggestionDetails?.cancel();
			this._currentSuggestionDetails = undefined;

			this._focusedItem = item;

			this._list.reveal(index);

			this._currentSuggestionDetails = createCancelablePromise(async token => {
				const loading = disposableTimeout(() => {
					if (this._isDetailsVisible()) {
						this._showDetails(true, false);
					}
				}, 250);
				const sub = token.onCancellationRequested(() => loading.dispose());
				try {
					return await item.resolve(token);
				} finally {
					loading.dispose();
					sub.dispose();
				}
			});

			this._currentSuggestionDetails.then(() => {
				if (index >= this._list.length || item !== this._list.element(index)) {
					return;
				}

				// item can have extra information, so re-render
				this._ignoreFocusEvents = true;
				this._list.splice(index, 1, [item]);
				this._list.setFocus([index]);
				this._ignoreFocusEvents = false;

				if (this._isDetailsVisible()) {
					this._showDetails(false, false);
				} else {
					this.element.domNode.classList.remove('docs-side');
				}

				this.editor.setAriaOptions({ activeDescendant: this._list.getElementID(index) });
			}).catch(onUnexpectedError);
		}

		// emit an event
		this._onDidFocus.fire({ item, index, model: this._completionModel });
	}

	private _setState(state: State): void {

		if (this._state === state) {
			return;
		}
		this._state = state;

		this.element.domNode.classList.toggle('frozen', state === State.Frozen);
		this.element.domNode.classList.remove('message');

		switch (state) {
			case State.Hidden:
				dom.hide(this._messageElement, this._listElement, this._status.element);
				this._details.hide(true);
				this._status.hide();
				this._contentWidget.hide();
				this._ctxSuggestWidgetVisible.reset();
				this._ctxSuggestWidgetMultipleSuggestions.reset();
				this._ctxSuggestWidgetHasFocusedSuggestion.reset();
				this._showTimeout.cancel();
				this.element.domNode.classList.remove('visible');
				this._list.splice(0, this._list.length);
				this._focusedItem = undefined;
				this._cappedHeight = undefined;
				this._explainMode = false;
				break;
			case State.Loading:
				this.element.domNode.classList.add('message');
				this._messageElement.textContent = SuggestWidget.LOADING_MESSAGE;
				dom.hide(this._listElement, this._status.element);
				dom.show(this._messageElement);
				this._details.hide();
				this._show();
				this._focusedItem = undefined;
				status(SuggestWidget.LOADING_MESSAGE);
				break;
			case State.Empty:
				this.element.domNode.classList.add('message');
				this._messageElement.textContent = SuggestWidget.NO_SUGGESTIONS_MESSAGE;
				dom.hide(this._listElement, this._status.element);
				dom.show(this._messageElement);
				this._details.hide();
				this._show();
				this._focusedItem = undefined;
				status(SuggestWidget.NO_SUGGESTIONS_MESSAGE);
				break;
			case State.Open:
				dom.hide(this._messageElement);
				dom.show(this._listElement, this._status.element);
				this._show();
				break;
			case State.Frozen:
				dom.hide(this._messageElement);
				dom.show(this._listElement, this._status.element);
				this._show();
				break;
			case State.Details:
				dom.hide(this._messageElement);
				dom.show(this._listElement, this._status.element);
				this._details.show();
				this._show();
				this._details.widget.focus();
				break;
		}
	}

	private _show(): void {
		this._status.show();
		this._contentWidget.show();
		this._layout(this._persistedSize.restore());
		this._ctxSuggestWidgetVisible.set(true);

		this._showTimeout.cancelAndSet(() => {
			this.element.domNode.classList.add('visible');
			this._onDidShow.fire(this);
		}, 100);
	}

	showTriggered(auto: boolean, delay: number) {
		if (this._state !== State.Hidden) {
			return;
		}
		this._contentWidget.setPosition(this.editor.getPosition());
		this._isAuto = !!auto;

		if (!this._isAuto) {
			this._loadingTimeout = disposableTimeout(() => this._setState(State.Loading), delay);
		}
	}

	showSuggestions(completionModel: CompletionModel, selectionIndex: number, isFrozen: boolean, isAuto: boolean, noFocus: boolean): void {

		this._contentWidget.setPosition(this.editor.getPosition());
		this._loadingTimeout?.dispose();

		this._currentSuggestionDetails?.cancel();
		this._currentSuggestionDetails = undefined;

		if (this._completionModel !== completionModel) {
			this._completionModel = completionModel;
		}

		if (isFrozen && this._state !== State.Empty && this._state !== State.Hidden) {
			this._setState(State.Frozen);
			return;
		}

		const visibleCount = this._completionModel.items.length;
		const isEmpty = visibleCount === 0;
		this._ctxSuggestWidgetMultipleSuggestions.set(visibleCount > 1);

		if (isEmpty) {
			this._setState(isAuto ? State.Hidden : State.Empty);
			this._completionModel = undefined;
			return;
		}

		this._focusedItem = undefined;

		// calling list.splice triggers focus event which this widget forwards. That can lead to
		// suggestions being cancelled and the widget being cleared (and hidden). All this happens
		// before revealing and focusing is done which means revealing and focusing will fail when
		// they get run.
		this._onDidFocus.pause();
		this._onDidSelect.pause();
		try {
			this._list.splice(0, this._list.length, this._completionModel.items);
			this._setState(isFrozen ? State.Frozen : State.Open);
			this._list.reveal(selectionIndex, 0, selectionIndex === 0 ? 0 : this.getLayoutInfo().itemHeight * 0.33);
			this._list.setFocus(noFocus ? [] : [selectionIndex]);
		} finally {
			this._onDidFocus.resume();
			this._onDidSelect.resume();
		}

		this._pendingLayout.value = dom.runAtThisOrScheduleAtNextAnimationFrame(dom.getWindow(this.element.domNode), () => {
			this._pendingLayout.clear();
			this._layout(this.element.size);
			// Reset focus border
			this._details.widget.domNode.classList.remove('focused');
		});
	}

	focusSelected(): void {
		if (this._list.length > 0) {
			this._list.setFocus([0]);
		}
	}

	selectNextPage(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Details:
				this._details.widget.pageDown();
				return true;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusNextPage();
				return true;
		}
	}

	selectNext(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusNext(1, true);
				return true;
		}
	}

	selectLast(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Details:
				this._details.widget.scrollBottom();
				return true;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusLast();
				return true;
		}
	}

	selectPreviousPage(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Details:
				this._details.widget.pageUp();
				return true;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusPreviousPage();
				return true;
		}
	}

	selectPrevious(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusPrevious(1, true);
				return false;
		}
	}

	selectFirst(): boolean {
		switch (this._state) {
			case State.Hidden:
				return false;
			case State.Details:
				this._details.widget.scrollTop();
				return true;
			case State.Loading:
				return !this._isAuto;
			default:
				this._list.focusFirst();
				return true;
		}
	}

	getFocusedItem(): ISelectedSuggestion | undefined {
		if (this._state !== State.Hidden
			&& this._state !== State.Empty
			&& this._state !== State.Loading
			&& this._completionModel
			&& this._list.getFocus().length > 0
		) {

			return {
				item: this._list.getFocusedElements()[0],
				index: this._list.getFocus()[0],
				model: this._completionModel
			};
		}
		return undefined;
	}

	toggleDetailsFocus(): void {
		if (this._state === State.Details) {
			// Should return the focus to the list item.
			this._list.setFocus(this._list.getFocus());
			this._setState(State.Open);
		} else if (this._state === State.Open) {
			this._setState(State.Details);
			if (!this._isDetailsVisible()) {
				this.toggleDetails(true);
			} else {
				this._details.widget.focus();
			}
		}
	}

	toggleDetails(focused: boolean = false): void {
		if (this._isDetailsVisible()) {
			// hide details widget
			this._pendingShowDetails.clear();
			this._ctxSuggestWidgetDetailsVisible.set(false);
			this._setDetailsVisible(false);
			this._details.hide();
			this.element.domNode.classList.remove('shows-details');

		} else if ((canExpandCompletionItem(this._list.getFocusedElements()[0]) || this._explainMode) && (this._state === State.Open || this._state === State.Details || this._state === State.Frozen)) {
			// show details widget (iff possible)
			this._ctxSuggestWidgetDetailsVisible.set(true);
			this._setDetailsVisible(true);
			this._showDetails(false, focused);
		}
	}

	private _showDetails(loading: boolean, focused: boolean): void {
		this._pendingShowDetails.value = dom.runAtThisOrScheduleAtNextAnimationFrame(dom.getWindow(this.element.domNode), () => {
			this._pendingShowDetails.clear();
			this._details.show();
			let didFocusDetails = false;
			if (loading) {
				this._details.widget.renderLoading();
			} else {
				this._details.widget.renderItem(this._list.getFocusedElements()[0], this._explainMode);
			}
			if (!this._details.widget.isEmpty) {
				this._positionDetails();
				this.element.domNode.classList.add('shows-details');
				if (focused) {
					this._details.widget.focus();
					didFocusDetails = true;
				}
			} else {
				this._details.hide();
			}
			if (!didFocusDetails) {
				this.editor.focus();
			}
		});
	}

	toggleExplainMode(): void {
		if (this._list.getFocusedElements()[0]) {
			this._explainMode = !this._explainMode;
			if (!this._isDetailsVisible()) {
				this.toggleDetails();
			} else {
				this._showDetails(false, false);
			}
		}
	}

	resetPersistedSize(): void {
		this._persistedSize.reset();
	}

	hideWidget(): void {
		this._pendingLayout.clear();
		this._pendingShowDetails.clear();
		this._loadingTimeout?.dispose();

		this._setState(State.Hidden);
		this._onDidHide.fire(this);
		this.element.clearSashHoverState();

		// ensure that a reasonable widget height is persisted so that
		// accidential "resize-to-single-items" cases aren't happening
		const dim = this._persistedSize.restore();
		const minPersistedHeight = Math.ceil(this.getLayoutInfo().itemHeight * 4.3);
		if (dim && dim.height < minPersistedHeight) {
			this._persistedSize.store(dim.with(undefined, minPersistedHeight));
		}
	}

	isFrozen(): boolean {
		return this._state === State.Frozen;
	}

	_afterRender(position: ContentWidgetPositionPreference | null) {
		if (position === null) {
			if (this._isDetailsVisible()) {
				this._details.hide(); //todo@jrieken soft-hide
			}
			return;
		}
		if (this._state === State.Empty || this._state === State.Loading) {
			// no special positioning when widget isn't showing list
			return;
		}
		if (this._isDetailsVisible() && !this._details.widget.isEmpty) {
			this._details.show();
		}
		this._positionDetails();
	}

	private _layout(size: dom.Dimension | undefined): void {
		if (!this.editor.hasModel()) {
			return;
		}
		if (!this.editor.getDomNode()) {
			// happens when running tests
			return;
		}

		const bodyBox = dom.getClientArea(this.element.domNode.ownerDocument.body);
		const info = this.getLayoutInfo();

		if (!size) {
			size = info.defaultSize;
		}

		let height = size.height;
		let width = size.width;

		// status bar
		this._status.element.style.height = `${info.itemHeight}px`;

		if (this._state === State.Empty || this._state === State.Loading) {
			// showing a message only
			height = info.itemHeight + info.borderHeight;
			width = info.defaultSize.width / 2;
			this.element.enableSashes(false, false, false, false);
			this.element.minSize = this.element.maxSize = new dom.Dimension(width, height);
			this._contentWidget.setPreference(ContentWidgetPositionPreference.BELOW);

		} else {
			// showing items

			// width math
			const maxWidth = bodyBox.width - info.borderHeight - 2 * info.horizontalPadding;
			if (width > maxWidth) {
				width = maxWidth;
			}
			const preferredWidth = this._completionModel ? this._completionModel.stats.pLabelLen * info.typicalHalfwidthCharacterWidth : width;

			// height math
			const fullHeight = info.statusBarHeight + this._list.contentHeight + info.borderHeight;
			const minHeight = info.itemHeight + info.statusBarHeight;
			const editorBox = dom.getDomNodePagePosition(this.editor.getDomNode());
			const cursorBox = this.editor.getScrolledVisiblePosition(this.editor.getPosition());
			const cursorBottom = editorBox.top + cursorBox.top + cursorBox.height;
			const maxHeightBelow = Math.min(bodyBox.height - cursorBottom - info.verticalPadding, fullHeight);
			const availableSpaceAbove = editorBox.top + cursorBox.top - info.verticalPadding;
			const maxHeightAbove = Math.min(availableSpaceAbove, fullHeight);
			let maxHeight = Math.min(Math.max(maxHeightAbove, maxHeightBelow) + info.borderHeight, fullHeight);

			if (height === this._cappedHeight?.capped) {
				// Restore the old (wanted) height when the current
				// height is capped to fit
				height = this._cappedHeight.wanted;
			}

			if (height < minHeight) {
				height = minHeight;
			}
			if (height > maxHeight) {
				height = maxHeight;
			}

			const forceRenderingAboveRequiredSpace = 150;
			if ((height > maxHeightBelow && maxHeightAbove > maxHeightBelow) || (this._forceRenderingAbove && availableSpaceAbove > forceRenderingAboveRequiredSpace)) {
				this._contentWidget.setPreference(ContentWidgetPositionPreference.ABOVE);
				this.element.enableSashes(true, true, false, false);
				maxHeight = maxHeightAbove;
			} else {
				this._contentWidget.setPreference(ContentWidgetPositionPreference.BELOW);
				this.element.enableSashes(false, true, true, false);
				maxHeight = maxHeightBelow;
			}
			this.element.preferredSize = new dom.Dimension(preferredWidth, info.defaultSize.height);
			this.element.maxSize = new dom.Dimension(maxWidth, maxHeight);
			this.element.minSize = new dom.Dimension(220, minHeight);

			// Know when the height was capped to fit and remember
			// the wanted height for later. This is required when going
			// left to widen suggestions.
			this._cappedHeight = height === fullHeight
				? { wanted: this._cappedHeight?.wanted ?? size.height, capped: height }
				: undefined;
		}
		this._resize(width, height);
	}

	private _resize(width: number, height: number): void {

		const { width: maxWidth, height: maxHeight } = this.element.maxSize;
		width = Math.min(maxWidth, width);
		height = Math.min(maxHeight, height);

		const { statusBarHeight } = this.getLayoutInfo();
		this._list.layout(height - statusBarHeight, width);
		this._listElement.style.height = `${height - statusBarHeight}px`;
		this.element.layout(height, width);
		this._contentWidget.layout();

		this._positionDetails();
	}

	private _positionDetails(): void {
		if (this._isDetailsVisible()) {
			this._details.placeAtAnchor(this.element.domNode, this._contentWidget.getPosition()?.preference[0] === ContentWidgetPositionPreference.BELOW);
		}
	}

	getLayoutInfo() {
		const fontInfo = this.editor.getOption(EditorOption.fontInfo);
		const itemHeight = clamp(this.editor.getOption(EditorOption.suggestLineHeight) || fontInfo.lineHeight, 8, 1000);
		const statusBarHeight = !this.editor.getOption(EditorOption.suggest).showStatusBar || this._state === State.Empty || this._state === State.Loading ? 0 : itemHeight;
		const borderWidth = this._details.widget.getLayoutInfo().borderWidth;
		const borderHeight = 2 * borderWidth;

		return {
			itemHeight,
			statusBarHeight,
			borderWidth,
			borderHeight,
			typicalHalfwidthCharacterWidth: fontInfo.typicalHalfwidthCharacterWidth,
			verticalPadding: 22,
			horizontalPadding: 14,
			defaultSize: new dom.Dimension(430, statusBarHeight + 12 * itemHeight)
		};
	}

	private _isDetailsVisible(): boolean {
		return this._storageService.getBoolean('expandSuggestionDocs', StorageScope.PROFILE, false);
	}

	private _setDetailsVisible(value: boolean) {
		this._storageService.store('expandSuggestionDocs', value, StorageScope.PROFILE, StorageTarget.USER);
	}

	forceRenderingAbove() {
		if (!this._forceRenderingAbove) {
			this._forceRenderingAbove = true;
			this._layout(this._persistedSize.restore());
		}
	}

	stopForceRenderingAbove() {
		this._forceRenderingAbove = false;
	}
}

export class SuggestContentWidget implements IContentWidget {

	readonly allowEditorOverflow = true;
	readonly suppressMouseDown = false;

	private _position?: IPosition | null;
	private _preference?: ContentWidgetPositionPreference;
	private _preferenceLocked = false;

	private _added: boolean = false;
	private _hidden: boolean = false;

	constructor(
		private readonly _widget: SuggestWidget,
		private readonly _editor: ICodeEditor
	) { }

	dispose(): void {
		if (this._added) {
			this._added = false;
			this._editor.removeContentWidget(this);
		}
	}

	getId(): string {
		return 'editor.widget.suggestWidget';
	}

	getDomNode(): HTMLElement {
		return this._widget.element.domNode;
	}

	show(): void {
		this._hidden = false;
		if (!this._added) {
			this._added = true;
			this._editor.addContentWidget(this);
		}
	}

	hide(): void {
		if (!this._hidden) {
			this._hidden = true;
			this.layout();
		}
	}

	layout(): void {
		this._editor.layoutContentWidget(this);
	}

	getPosition(): IContentWidgetPosition | null {
		if (this._hidden || !this._position || !this._preference) {
			return null;
		}
		return {
			position: this._position,
			preference: [this._preference]
		};
	}

	beforeRender() {
		const { height, width } = this._widget.element.size;
		const { borderWidth, horizontalPadding } = this._widget.getLayoutInfo();
		return new dom.Dimension(width + 2 * borderWidth + horizontalPadding, height + 2 * borderWidth);
	}

	afterRender(position: ContentWidgetPositionPreference | null) {
		this._widget._afterRender(position);
	}

	setPreference(preference: ContentWidgetPositionPreference) {
		if (!this._preferenceLocked) {
			this._preference = preference;
		}
	}

	lockPreference() {
		this._preferenceLocked = true;
	}

	unlockPreference() {
		this._preferenceLocked = false;
	}

	setPosition(position: IPosition | null): void {
		this._position = position;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestWidgetDetails.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestWidgetDetails.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ResizableHTMLElement } from '../../../../base/browser/ui/resizable/resizable.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import * as nls from '../../../../nls.js';
import { isHighContrast } from '../../../../platform/theme/common/theme.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition } from '../../../browser/editorBrowser.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CompletionItem } from './suggest.js';

export function canExpandCompletionItem(item: CompletionItem | undefined): boolean {
	return !!item && Boolean(item.completion.documentation || item.completion.detail && item.completion.detail !== item.completion.label);
}

export class SuggestDetailsWidget {

	readonly domNode: HTMLDivElement;

	private readonly _onDidClose = new Emitter<void>();
	readonly onDidClose: Event<void> = this._onDidClose.event;

	private readonly _onDidChangeContents = new Emitter<this>();
	readonly onDidChangeContents: Event<this> = this._onDidChangeContents.event;

	private readonly _close: HTMLElement;
	private readonly _scrollbar: DomScrollableElement;
	private readonly _body: HTMLElement;
	private readonly _header: HTMLElement;
	private readonly _type: HTMLElement;
	private readonly _docs: HTMLElement;
	private readonly _disposables = new DisposableStore();

	private readonly _renderDisposeable = new DisposableStore();
	private _size = new dom.Dimension(330, 0);

	constructor(
		private readonly _editor: ICodeEditor,
		@IThemeService private readonly _themeService: IThemeService,
		@IMarkdownRendererService private readonly _markdownRendererService: IMarkdownRendererService,
	) {
		this.domNode = dom.$('.suggest-details');
		this.domNode.classList.add('no-docs');


		this._body = dom.$('.body');

		this._scrollbar = new DomScrollableElement(this._body, {
			alwaysConsumeMouseWheel: true,
		});
		dom.append(this.domNode, this._scrollbar.getDomNode());
		this._disposables.add(this._scrollbar);

		this._header = dom.append(this._body, dom.$('.header'));
		this._close = dom.append(this._header, dom.$('span' + ThemeIcon.asCSSSelector(Codicon.close)));
		this._close.title = nls.localize('details.close', "Close");
		this._close.role = 'button';
		this._close.tabIndex = -1;
		this._type = dom.append(this._header, dom.$('p.type'));

		this._docs = dom.append(this._body, dom.$('p.docs'));

		this._configureFont();

		this._disposables.add(this._editor.onDidChangeConfiguration(e => {
			if (e.hasChanged(EditorOption.fontInfo)) {
				this._configureFont();
			}
		}));
	}

	dispose(): void {
		this._disposables.dispose();
		this._renderDisposeable.dispose();
	}

	private _configureFont(): void {
		const options = this._editor.getOptions();
		const fontInfo = options.get(EditorOption.fontInfo);
		const fontFamily = fontInfo.getMassagedFontFamily();
		const fontSize = options.get(EditorOption.suggestFontSize) || fontInfo.fontSize;
		const lineHeight = options.get(EditorOption.suggestLineHeight) || fontInfo.lineHeight;
		const fontWeight = fontInfo.fontWeight;
		const fontSizePx = `${fontSize}px`;
		const lineHeightPx = `${lineHeight}px`;

		this.domNode.style.fontSize = fontSizePx;
		this.domNode.style.lineHeight = `${lineHeight / fontSize}`;
		this.domNode.style.fontWeight = fontWeight;
		this.domNode.style.fontFeatureSettings = fontInfo.fontFeatureSettings;
		this._type.style.fontFamily = fontFamily;
		this._close.style.height = lineHeightPx;
		this._close.style.width = lineHeightPx;
	}

	getLayoutInfo() {
		const lineHeight = this._editor.getOption(EditorOption.suggestLineHeight) || this._editor.getOption(EditorOption.fontInfo).lineHeight;
		const borderWidth = isHighContrast(this._themeService.getColorTheme().type) ? 2 : 1;
		const borderHeight = borderWidth * 2;
		return {
			lineHeight,
			borderWidth,
			borderHeight,
			verticalPadding: 22,
			horizontalPadding: 14
		};
	}


	renderLoading(): void {
		this._type.textContent = nls.localize('loading', "Loading...");
		this._docs.textContent = '';
		this.domNode.classList.remove('no-docs', 'no-type');
		this.layout(this.size.width, this.getLayoutInfo().lineHeight * 2);
		this._onDidChangeContents.fire(this);
	}

	renderItem(item: CompletionItem, explainMode: boolean): void {
		this._renderDisposeable.clear();

		let { detail, documentation } = item.completion;

		if (explainMode) {
			let md = '';
			md += `score: ${item.score[0]}\n`;
			md += `prefix: ${item.word ?? '(no prefix)'}\n`;
			md += `word: ${item.completion.filterText ? item.completion.filterText + ' (filterText)' : item.textLabel}\n`;
			md += `distance: ${item.distance} (localityBonus-setting)\n`;
			md += `index: ${item.idx}, based on ${item.completion.sortText && `sortText: "${item.completion.sortText}"` || 'label'}\n`;
			md += `commit_chars: ${item.completion.commitCharacters?.join('')}\n`;
			documentation = new MarkdownString().appendCodeblock('empty', md);
			detail = `Provider: ${item.provider._debugDisplayName}`;
		}

		if (!explainMode && !canExpandCompletionItem(item)) {
			this.clearContents();
			return;
		}

		this.domNode.classList.remove('no-docs', 'no-type');

		// --- details

		if (detail) {
			const cappedDetail = detail.length > 100000 ? `${detail.substr(0, 100000)}…` : detail;
			this._type.textContent = cappedDetail;
			this._type.title = cappedDetail;
			dom.show(this._type);
			this._type.classList.toggle('auto-wrap', !/\r?\n^\s+/gmi.test(cappedDetail));
		} else {
			dom.clearNode(this._type);
			this._type.title = '';
			dom.hide(this._type);
			this.domNode.classList.add('no-type');
		}

		// --- documentation
		dom.clearNode(this._docs);
		if (typeof documentation === 'string') {
			this._docs.classList.remove('markdown-docs');
			this._docs.textContent = documentation;

		} else if (documentation) {
			this._docs.classList.add('markdown-docs');
			dom.clearNode(this._docs);
			const renderedContents = this._markdownRendererService.render(documentation, {
				context: this._editor,
				asyncRenderCallback: () => {
					this.layout(this._size.width, this._type.clientHeight + this._docs.clientHeight);
					this._onDidChangeContents.fire(this);
				}
			});
			this._docs.appendChild(renderedContents.element);
			this._renderDisposeable.add(renderedContents);
		}

		this.domNode.classList.toggle('detail-and-doc', !!detail && !!documentation);

		this.domNode.style.userSelect = 'text';
		this.domNode.tabIndex = -1;

		this._close.onmousedown = e => {
			e.preventDefault();
			e.stopPropagation();
		};
		this._close.onclick = e => {
			e.preventDefault();
			e.stopPropagation();
			this._onDidClose.fire();
		};

		this._body.scrollTop = 0;

		this.layout(this._size.width, this._type.clientHeight + this._docs.clientHeight);
		this._onDidChangeContents.fire(this);
	}

	clearContents() {
		this.domNode.classList.add('no-docs');
		this._type.textContent = '';
		this._docs.textContent = '';
	}

	get isEmpty(): boolean {
		return this.domNode.classList.contains('no-docs');
	}

	get size() {
		return this._size;
	}

	layout(width: number, height: number): void {
		const newSize = new dom.Dimension(width, height);
		if (!dom.Dimension.equals(newSize, this._size)) {
			this._size = newSize;
			dom.size(this.domNode, width, height);
		}
		this._scrollbar.scanDomNode();
	}

	scrollDown(much = 8): void {
		this._body.scrollTop += much;
	}

	scrollUp(much = 8): void {
		this._body.scrollTop -= much;
	}

	scrollTop(): void {
		this._body.scrollTop = 0;
	}

	scrollBottom(): void {
		this._body.scrollTop = this._body.scrollHeight;
	}

	pageDown(): void {
		this.scrollDown(80);
	}

	pageUp(): void {
		this.scrollUp(80);
	}

	focus() {
		this.domNode.focus();
	}
}

interface TopLeftPosition {
	top: number;
	left: number;
}

export class SuggestDetailsOverlay implements IOverlayWidget {

	readonly allowEditorOverflow = true;

	private readonly _disposables = new DisposableStore();
	private readonly _resizable: ResizableHTMLElement;

	private _added: boolean = false;
	private _anchorBox?: dom.IDomNodePagePosition;
	private _preferAlignAtTop: boolean = true;
	private _userSize?: dom.Dimension;
	private _topLeft?: TopLeftPosition;

	constructor(
		readonly widget: SuggestDetailsWidget,
		private readonly _editor: ICodeEditor
	) {

		this._resizable = new ResizableHTMLElement();
		this._resizable.domNode.classList.add('suggest-details-container');
		this._resizable.domNode.appendChild(widget.domNode);
		this._resizable.enableSashes(false, true, true, false);

		let topLeftNow: TopLeftPosition | undefined;
		let sizeNow: dom.Dimension | undefined;
		let deltaTop: number = 0;
		let deltaLeft: number = 0;
		this._disposables.add(this._resizable.onDidWillResize(() => {
			topLeftNow = this._topLeft;
			sizeNow = this._resizable.size;
		}));

		this._disposables.add(this._resizable.onDidResize(e => {
			if (topLeftNow && sizeNow) {
				this.widget.layout(e.dimension.width, e.dimension.height);

				let updateTopLeft = false;
				if (e.west) {
					deltaLeft = sizeNow.width - e.dimension.width;
					updateTopLeft = true;
				}
				if (e.north) {
					deltaTop = sizeNow.height - e.dimension.height;
					updateTopLeft = true;
				}
				if (updateTopLeft) {
					this._applyTopLeft({
						top: topLeftNow.top + deltaTop,
						left: topLeftNow.left + deltaLeft,
					});
				}
			}
			if (e.done) {
				topLeftNow = undefined;
				sizeNow = undefined;
				deltaTop = 0;
				deltaLeft = 0;
				this._userSize = e.dimension;
			}
		}));

		this._disposables.add(this.widget.onDidChangeContents(() => {
			if (this._anchorBox) {
				this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size, this._preferAlignAtTop);
			}
		}));
	}

	dispose(): void {
		this._resizable.dispose();
		this._disposables.dispose();
		this.hide();
	}

	getId(): string {
		return 'suggest.details';
	}

	getDomNode(): HTMLElement {
		return this._resizable.domNode;
	}

	getPosition(): IOverlayWidgetPosition | null {
		return this._topLeft ? { preference: this._topLeft } : null;
	}

	show(): void {
		if (!this._added) {
			this._editor.addOverlayWidget(this);
			this._added = true;
		}
	}

	hide(sessionEnded: boolean = false): void {
		this._resizable.clearSashHoverState();

		if (this._added) {
			this._editor.removeOverlayWidget(this);
			this._added = false;
			this._anchorBox = undefined;
			this._topLeft = undefined;
		}
		if (sessionEnded) {
			this._userSize = undefined;
			this.widget.clearContents();
		}
	}

	placeAtAnchor(anchor: HTMLElement, preferAlignAtTop: boolean) {
		const anchorBox = anchor.getBoundingClientRect();
		this._anchorBox = anchorBox;
		this._preferAlignAtTop = preferAlignAtTop;
		this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size, preferAlignAtTop);
	}

	_placeAtAnchor(anchorBox: dom.IDomNodePagePosition, size: dom.Dimension, preferAlignAtTop: boolean) {
		const bodyBox = dom.getClientArea(this.getDomNode().ownerDocument.body);

		const info = this.widget.getLayoutInfo();

		const defaultMinSize = new dom.Dimension(220, 2 * info.lineHeight);
		const defaultTop = anchorBox.top;

		type Placement = { top: number; left: number; fit: number; maxSizeTop: dom.Dimension; maxSizeBottom: dom.Dimension; minSize: dom.Dimension };

		// EAST
		const eastPlacement: Placement = (function () {
			const width = bodyBox.width - (anchorBox.left + anchorBox.width + info.borderWidth + info.horizontalPadding);
			const left = -info.borderWidth + anchorBox.left + anchorBox.width;
			const maxSizeTop = new dom.Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
			const maxSizeBottom = maxSizeTop.with(undefined, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
			return { top: defaultTop, left, fit: width - size.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
		})();

		// WEST
		const westPlacement: Placement = (function () {
			const width = anchorBox.left - info.borderWidth - info.horizontalPadding;
			const left = Math.max(info.horizontalPadding, anchorBox.left - size.width - info.borderWidth);
			const maxSizeTop = new dom.Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
			const maxSizeBottom = maxSizeTop.with(undefined, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
			return { top: defaultTop, left, fit: width - size.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
		})();

		// SOUTH
		const southPlacement: Placement = (function () {
			const left = anchorBox.left;
			const top = -info.borderWidth + anchorBox.top + anchorBox.height;
			const maxSizeBottom = new dom.Dimension(anchorBox.width - info.borderHeight, bodyBox.height - anchorBox.top - anchorBox.height - info.verticalPadding);
			return { top, left, fit: maxSizeBottom.height - size.height, maxSizeBottom, maxSizeTop: maxSizeBottom, minSize: defaultMinSize.with(maxSizeBottom.width) };
		})();

		// NORTH
		const northPlacement: Placement = (function () {
			const left = anchorBox.left;
			const maxSizeTop = new dom.Dimension(anchorBox.width - info.borderHeight, anchorBox.top - info.verticalPadding);
			const top = Math.max(info.verticalPadding, anchorBox.top - size.height);
			return { top, left, fit: maxSizeTop.height - size.height, maxSizeTop, maxSizeBottom: maxSizeTop, minSize: defaultMinSize.with(maxSizeTop.width) };
		})();

		// take first placement that fits or the first with "least bad" fit
		// when the suggest widget is rendering above the cursor (preferAlignAtTop=false), prefer NORTH over SOUTH
		const verticalPlacement = preferAlignAtTop ? southPlacement : northPlacement;
		const placements = [eastPlacement, westPlacement, verticalPlacement];
		const placement = placements.find(p => p.fit >= 0) ?? placements.sort((a, b) => b.fit - a.fit)[0];

		// top/bottom placement
		const bottom = anchorBox.top + anchorBox.height - info.borderHeight;
		let alignAtTop: boolean;
		let height = size.height;
		const maxHeight = Math.max(placement.maxSizeTop.height, placement.maxSizeBottom.height);
		if (height > maxHeight) {
			height = maxHeight;
		}
		let maxSize: dom.Dimension;
		if (preferAlignAtTop) {
			if (height <= placement.maxSizeTop.height) {
				alignAtTop = true;
				maxSize = placement.maxSizeTop;
			} else {
				alignAtTop = false;
				maxSize = placement.maxSizeBottom;
			}
		} else {
			if (height <= placement.maxSizeBottom.height) {
				alignAtTop = false;
				maxSize = placement.maxSizeBottom;
			} else {
				alignAtTop = true;
				maxSize = placement.maxSizeTop;
			}
		}

		let { top, left } = placement;
		if (placement === northPlacement) {
			// For NORTH placement, position the details above the anchor
			top = anchorBox.top - height + info.borderWidth;
		} else if (!alignAtTop && height > anchorBox.height) {
			top = bottom - height;
		}
		const editorDomNode = this._editor.getDomNode();
		if (editorDomNode) {
			// get bounding rectangle of the suggest widget relative to the editor
			const editorBoundingBox = editorDomNode.getBoundingClientRect();
			top -= editorBoundingBox.top;
			left -= editorBoundingBox.left;
		}
		this._applyTopLeft({ left, top });

		// enableSashes(north, east, south, west)
		// For NORTH placement: enable north sash (resize upward from top), disable south (can't resize into the anchor)
		// Also enable west sash for horizontal resizing, consistent with SOUTH placement
		// For SOUTH placement and EAST/WEST placements: use existing logic based on alignAtTop
		if (placement === northPlacement) {
			this._resizable.enableSashes(true, false, false, true);
		} else {
			this._resizable.enableSashes(!alignAtTop, placement === eastPlacement, alignAtTop, placement !== eastPlacement);
		}

		this._resizable.minSize = placement.minSize;
		this._resizable.maxSize = maxSize;
		this._resizable.layout(height, Math.min(maxSize.width, size.width));
		this.widget.layout(this._resizable.size.width, this._resizable.size.height);
	}

	private _applyTopLeft(topLeft: TopLeftPosition): void {
		this._topLeft = topLeft;
		this._editor.layoutOverlayWidget(this);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestWidgetRenderer.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestWidgetRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, hide, show } from '../../../../base/browser/dom.js';
import { IconLabel, IIconLabelValueOptions } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IListRenderer } from '../../../../base/browser/ui/list/list.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMatches } from '../../../../base/common/filters.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { CompletionItemKind, CompletionItemKinds, CompletionItemTag } from '../../../common/languages.js';
import { getIconClasses } from '../../../common/services/getIconClasses.js';
import { IModelService } from '../../../common/services/model.js';
import { ILanguageService } from '../../../common/languages/language.js';
import * as nls from '../../../../nls.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { CompletionItem } from './suggest.js';
import { canExpandCompletionItem } from './suggestWidgetDetails.js';

const suggestMoreInfoIcon = registerIcon('suggest-more-info', Codicon.chevronRight, nls.localize('suggestMoreInfoIcon', 'Icon for more information in the suggest widget.'));

const _completionItemColor = new class ColorExtractor {

	private static _regexRelaxed = /(#([\da-fA-F]{3}){1,2}|(rgb|hsl)a\(\s*(\d{1,3}%?\s*,\s*){3}(1|0?\.\d+)\)|(rgb|hsl)\(\s*\d{1,3}%?(\s*,\s*\d{1,3}%?){2}\s*\))/;
	private static _regexStrict = new RegExp(`^${ColorExtractor._regexRelaxed.source}$`, 'i');

	extract(item: CompletionItem, out: string[]): boolean {
		if (item.textLabel.match(ColorExtractor._regexStrict)) {
			out[0] = item.textLabel;
			return true;
		}
		if (item.completion.detail && item.completion.detail.match(ColorExtractor._regexStrict)) {
			out[0] = item.completion.detail;
			return true;
		}

		if (item.completion.documentation) {
			const value = typeof item.completion.documentation === 'string'
				? item.completion.documentation
				: item.completion.documentation.value;

			const match = ColorExtractor._regexRelaxed.exec(value);
			if (match && (match.index === 0 || match.index + match[0].length === value.length)) {
				out[0] = match[0];
				return true;
			}
		}
		return false;
	}
};


export interface ISuggestionTemplateData {
	readonly root: HTMLElement;

	/**
	 * Flexbox
	 * < ------------- left ------------ >     < --- right -- >
	 * <icon><label><signature><qualifier>     <type><readmore>
	 */
	readonly left: HTMLElement;
	readonly right: HTMLElement;

	readonly icon: HTMLElement;
	readonly colorspan: HTMLElement;
	readonly iconLabel: IconLabel;
	readonly iconContainer: HTMLElement;
	readonly parametersLabel: HTMLElement;
	readonly qualifierLabel: HTMLElement;
	/**
	 * Showing either `CompletionItem#details` or `CompletionItemLabel#type`
	 */
	readonly detailsLabel: HTMLElement;
	readonly readMore: HTMLElement;
	readonly disposables: DisposableStore;

	readonly configureFont: () => void;
}

export class ItemRenderer implements IListRenderer<CompletionItem, ISuggestionTemplateData> {

	private readonly _onDidToggleDetails = new Emitter<void>();
	readonly onDidToggleDetails: Event<void> = this._onDidToggleDetails.event;

	readonly templateId = 'suggestion';

	constructor(
		private readonly _editor: ICodeEditor,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IThemeService private readonly _themeService: IThemeService
	) { }

	dispose(): void {
		this._onDidToggleDetails.dispose();
	}

	renderTemplate(container: HTMLElement): ISuggestionTemplateData {
		const disposables = new DisposableStore();

		const root = container;
		root.classList.add('show-file-icons');

		const icon = append(container, $('.icon'));
		const colorspan = append(icon, $('span.colorspan'));

		const text = append(container, $('.contents'));
		const main = append(text, $('.main'));

		const iconContainer = append(main, $('.icon-label.codicon'));
		const left = append(main, $('span.left'));
		const right = append(main, $('span.right'));

		const iconLabel = new IconLabel(left, { supportHighlights: true, supportIcons: true });
		disposables.add(iconLabel);

		const parametersLabel = append(left, $('span.signature-label'));
		const qualifierLabel = append(left, $('span.qualifier-label'));
		const detailsLabel = append(right, $('span.details-label'));

		const readMore = append(right, $('span.readMore' + ThemeIcon.asCSSSelector(suggestMoreInfoIcon)));
		readMore.title = nls.localize('readMore', "Read More");

		const configureFont = () => {
			const options = this._editor.getOptions();
			const fontInfo = options.get(EditorOption.fontInfo);
			const fontFamily = fontInfo.getMassagedFontFamily();
			const fontFeatureSettings = fontInfo.fontFeatureSettings;
			const fontVariationSettings = fontInfo.fontVariationSettings;
			const fontSize = options.get(EditorOption.suggestFontSize) || fontInfo.fontSize;
			const lineHeight = options.get(EditorOption.suggestLineHeight) || fontInfo.lineHeight;
			const fontWeight = fontInfo.fontWeight;
			const letterSpacing = fontInfo.letterSpacing;
			const fontSizePx = `${fontSize}px`;
			const lineHeightPx = `${lineHeight}px`;
			const letterSpacingPx = `${letterSpacing}px`;

			root.style.fontSize = fontSizePx;
			root.style.fontWeight = fontWeight;
			root.style.letterSpacing = letterSpacingPx;
			main.style.fontFamily = fontFamily;
			main.style.fontFeatureSettings = fontFeatureSettings;
			main.style.fontVariationSettings = fontVariationSettings;
			main.style.lineHeight = lineHeightPx;
			icon.style.height = lineHeightPx;
			icon.style.width = lineHeightPx;
			readMore.style.height = lineHeightPx;
			readMore.style.width = lineHeightPx;
		};

		return { root, left, right, icon, colorspan, iconLabel, iconContainer, parametersLabel, qualifierLabel, detailsLabel, readMore, disposables, configureFont };
	}

	renderElement(element: CompletionItem, index: number, data: ISuggestionTemplateData): void {


		data.configureFont();

		const { completion } = element;
		data.colorspan.style.backgroundColor = '';

		const labelOptions: IIconLabelValueOptions = {
			labelEscapeNewLines: true,
			matches: createMatches(element.score)
		};

		const color: string[] = [];
		if (completion.kind === CompletionItemKind.Color && _completionItemColor.extract(element, color)) {
			// special logic for 'color' completion items
			data.icon.className = 'icon customcolor';
			data.iconContainer.className = 'icon hide';
			data.colorspan.style.backgroundColor = color[0];

		} else if (completion.kind === CompletionItemKind.File && this._themeService.getFileIconTheme().hasFileIcons) {
			// special logic for 'file' completion items
			data.icon.className = 'icon hide';
			data.iconContainer.className = 'icon hide';
			const labelClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: element.textLabel }), FileKind.FILE);
			const detailClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: completion.detail }), FileKind.FILE);
			labelOptions.extraClasses = labelClasses.length > detailClasses.length ? labelClasses : detailClasses;

		} else if (completion.kind === CompletionItemKind.Folder && this._themeService.getFileIconTheme().hasFolderIcons) {
			// special logic for 'folder' completion items
			data.icon.className = 'icon hide';
			data.iconContainer.className = 'icon hide';
			labelOptions.extraClasses = [
				getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: element.textLabel }), FileKind.FOLDER),
				getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: completion.detail }), FileKind.FOLDER)
			].flat();
		} else {
			// normal icon
			data.icon.className = 'icon hide';
			data.iconContainer.className = '';
			data.iconContainer.classList.add('suggest-icon', ...ThemeIcon.asClassNameArray(CompletionItemKinds.toIcon(completion.kind)));
		}

		if (completion.tags && completion.tags.indexOf(CompletionItemTag.Deprecated) >= 0) {
			labelOptions.extraClasses = (labelOptions.extraClasses || []).concat(['deprecated']);
			labelOptions.matches = [];
		}

		data.iconLabel.setLabel(element.textLabel, undefined, labelOptions);
		if (typeof completion.label === 'string') {
			data.parametersLabel.textContent = '';
			data.detailsLabel.textContent = stripNewLines(completion.detail || '');
			data.root.classList.add('string-label');
		} else {
			data.parametersLabel.textContent = stripNewLines(completion.label.detail || '');
			data.detailsLabel.textContent = stripNewLines(completion.label.description || '');
			data.root.classList.remove('string-label');
		}

		if (this._editor.getOption(EditorOption.suggest).showInlineDetails) {
			show(data.detailsLabel);
		} else {
			hide(data.detailsLabel);
		}

		if (canExpandCompletionItem(element)) {
			data.right.classList.add('can-expand-details');
			show(data.readMore);
			data.readMore.onmousedown = e => {
				e.stopPropagation();
				e.preventDefault();
			};
			data.readMore.onclick = e => {
				e.stopPropagation();
				e.preventDefault();
				this._onDidToggleDetails.fire();
			};
		} else {
			data.right.classList.remove('can-expand-details');
			hide(data.readMore);
			data.readMore.onmousedown = null;
			data.readMore.onclick = null;
		}
	}

	disposeTemplate(templateData: ISuggestionTemplateData): void {
		templateData.disposables.dispose();
	}
}

function stripNewLines(str: string): string {
	return str.replace(/\r\n|\r|\n/g, '');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/suggestWidgetStatus.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/suggestWidgetStatus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { ActionBar, IActionViewItemProvider } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IAction } from '../../../../base/common/actions.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { TextOnlyMenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export class SuggestWidgetStatus {

	readonly element: HTMLElement;

	private readonly _leftActions: ActionBar;
	private readonly _rightActions: ActionBar;
	private readonly _menuDisposables = new DisposableStore();

	constructor(
		container: HTMLElement,
		private readonly _menuId: MenuId,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMenuService private _menuService: IMenuService,
		@IContextKeyService private _contextKeyService: IContextKeyService,
	) {
		this.element = dom.append(container, dom.$('.suggest-status-bar'));

		const actionViewItemProvider = <IActionViewItemProvider>(action => {
			return action instanceof MenuItemAction ? instantiationService.createInstance(TextOnlyMenuEntryActionViewItem, action, { useComma: false }) : undefined;
		});
		this._leftActions = new ActionBar(this.element, { actionViewItemProvider });
		this._rightActions = new ActionBar(this.element, { actionViewItemProvider });

		this._leftActions.domNode.classList.add('left');
		this._rightActions.domNode.classList.add('right');
	}

	dispose(): void {
		this._menuDisposables.dispose();
		this._leftActions.dispose();
		this._rightActions.dispose();
		this.element.remove();
	}

	show(): void {
		const menu = this._menuService.createMenu(this._menuId, this._contextKeyService);
		const renderMenu = () => {
			const left: IAction[] = [];
			const right: IAction[] = [];
			for (const [group, actions] of menu.getActions()) {
				if (group === 'left') {
					left.push(...actions);
				} else {
					right.push(...actions);
				}
			}
			this._leftActions.clear();
			this._leftActions.push(left);
			this._rightActions.clear();
			this._rightActions.push(right);
		};
		this._menuDisposables.add(menu.onDidChange(() => renderMenu()));
		this._menuDisposables.add(menu);
	}

	hide(): void {
		this._menuDisposables.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/wordContextKey.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/wordContextKey.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { localize } from '../../../../nls.js';

export class WordContextKey {

	static readonly AtEnd = new RawContextKey<boolean>('atEndOfWord', false, { type: 'boolean', description: localize('desc', "A context key that is true when at the end of a word. Note that this is only defined when tab-completions are enabled") });

	private readonly _ckAtEnd: IContextKey<boolean>;
	private readonly _configListener: IDisposable;

	private _enabled: boolean = false;
	private _selectionListener?: IDisposable;

	constructor(
		private readonly _editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {

		this._ckAtEnd = WordContextKey.AtEnd.bindTo(contextKeyService);
		this._configListener = this._editor.onDidChangeConfiguration(e => e.hasChanged(EditorOption.tabCompletion) && this._update());
		this._update();
	}

	dispose(): void {
		this._configListener.dispose();
		this._selectionListener?.dispose();
		this._ckAtEnd.reset();
	}

	private _update(): void {
		// only update this when tab completions are enabled
		const enabled = this._editor.getOption(EditorOption.tabCompletion) === 'on';
		if (this._enabled === enabled) {
			return;
		}
		this._enabled = enabled;

		if (this._enabled) {
			const checkForWordEnd = () => {
				if (!this._editor.hasModel()) {
					this._ckAtEnd.set(false);
					return;
				}
				const model = this._editor.getModel();
				const selection = this._editor.getSelection();
				const word = model.getWordAtPosition(selection.getStartPosition());
				if (!word) {
					this._ckAtEnd.set(false);
					return;
				}
				this._ckAtEnd.set(word.endColumn === selection.getStartPosition().column && selection.getStartPosition().lineNumber === selection.getEndPosition().lineNumber);
			};
			this._selectionListener = this._editor.onDidChangeCursorSelection(checkForWordEnd);
			checkForWordEnd();

		} else if (this._selectionListener) {
			this._ckAtEnd.reset();
			this._selectionListener.dispose();
			this._selectionListener = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/wordDistance.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/wordDistance.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch, isFalsyOrEmpty } from '../../../../base/common/arrays.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { CompletionItem, CompletionItemKind } from '../../../common/languages.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import { BracketSelectionRangeProvider } from '../../smartSelect/browser/bracketSelections.js';

export abstract class WordDistance {

	static readonly None = new class extends WordDistance {
		distance() { return 0; }
	};

	static async create(service: IEditorWorkerService, editor: ICodeEditor): Promise<WordDistance> {

		if (!editor.getOption(EditorOption.suggest).localityBonus) {
			return WordDistance.None;
		}

		if (!editor.hasModel()) {
			return WordDistance.None;
		}

		const model = editor.getModel();
		const position = editor.getPosition();

		if (!service.canComputeWordRanges(model.uri)) {
			return WordDistance.None;
		}

		const [ranges] = await new BracketSelectionRangeProvider().provideSelectionRanges(model, [position]);
		if (ranges.length === 0) {
			return WordDistance.None;
		}

		const wordRanges = await service.computeWordRanges(model.uri, ranges[0].range);
		if (!wordRanges) {
			return WordDistance.None;
		}

		// remove current word
		const wordUntilPos = model.getWordUntilPosition(position);
		delete wordRanges[wordUntilPos.word];

		return new class extends WordDistance {
			distance(anchor: IPosition, item: CompletionItem) {
				if (!position.equals(editor.getPosition())) {
					return 0;
				}
				if (item.kind === CompletionItemKind.Keyword) {
					return 2 << 20;
				}
				const word = typeof item.label === 'string' ? item.label : item.label.label;
				const wordLines = wordRanges[word];
				if (isFalsyOrEmpty(wordLines)) {
					return 2 << 20;
				}
				const idx = binarySearch(wordLines, Range.fromPositions(anchor), Range.compareRangesUsingStarts);
				const bestWordRange = idx >= 0 ? wordLines[idx] : wordLines[Math.max(0, ~idx - 1)];
				let blockDistance = ranges.length;
				for (const range of ranges) {
					if (!Range.containsRange(range.range, bestWordRange)) {
						break;
					}
					blockDistance -= 1;
				}
				return blockDistance;
			}
		};
	}

	abstract distance(anchor: IPosition, suggestion: CompletionItem): number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/browser/media/suggest.css]---
Location: vscode-main/src/vs/editor/contrib/suggest/browser/media/suggest.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Suggest widget*/

.monaco-editor .suggest-widget {
	width: 430px;
	z-index: 40;
	display: flex;
	flex-direction: column;
	border-radius: 3px;
}

.monaco-editor .suggest-widget.message {
	flex-direction: row;
	align-items: center;
}

.monaco-editor .suggest-widget,
.monaco-editor .suggest-details {
	flex: 0 1 auto;
	width: 100%;
	border-style: solid;
	border-width: 1px;
	border-color: var(--vscode-editorSuggestWidget-border);
	background-color: var(--vscode-editorSuggestWidget-background);
}

.monaco-editor.hc-black .suggest-widget,
.monaco-editor.hc-black .suggest-details,
.monaco-editor.hc-light .suggest-widget,
.monaco-editor.hc-light .suggest-details {
	border-width: 2px;
}

/* Styles for status bar part */


.monaco-editor .suggest-widget .suggest-status-bar {
	box-sizing: border-box;
	display: none;
	flex-flow: row nowrap;
	justify-content: space-between;
	width: 100%;
	font-size: 80%;
	padding: 0 4px 0 4px;
	border-top: 1px solid var(--vscode-editorSuggestWidget-border);
	overflow: hidden;
}

.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar {
	display: flex;
}

.monaco-editor .suggest-widget .suggest-status-bar .left {
	padding-right: 8px;
}

.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-label {
	color: var(--vscode-editorSuggestWidgetStatus-foreground);
}

.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label {
	margin-right: 0;
}

.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label::after {
	content: ', ';
	margin-right: 0.3em;
}

.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row > .contents > .main > .right > .readMore,
.monaco-editor .suggest-widget.with-status-bar .monaco-list .monaco-list-row.focused.string-label > .contents > .main > .right > .readMore {
	display: none;
}

.monaco-editor .suggest-widget.with-status-bar:not(.docs-side) .monaco-list .monaco-list-row:hover > .contents > .main > .right.can-expand-details > .details-label {
	width: 100%;
}

/* Styles for Message element for when widget is loading or is empty */

.monaco-editor .suggest-widget > .message {
	padding-left: 22px;
}

/** Styles for the list element **/

.monaco-editor .suggest-widget > .tree {
	height: 100%;
	width: 100%;
}

.monaco-editor .suggest-widget .monaco-list {
	user-select: none;
	-webkit-user-select: none;
}

/** Styles for each row in the list element **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row {
	display: flex;
	-mox-box-sizing: border-box;
	box-sizing: border-box;
	padding-right: 10px;
	background-repeat: no-repeat;
	background-position: 2px 2px;
	white-space: nowrap;
	cursor: pointer;
	touch-action: none;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused {
	color: var(--vscode-editorSuggestWidget-selectedForeground);
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .codicon {
	color: var(--vscode-editorSuggestWidget-selectedIconForeground);
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents {
	flex: 1;
	height: 100%;
	overflow: hidden;
	padding-left: 2px;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main {
	display: flex;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: pre;
	justify-content: space-between;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left,
.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
	display: flex;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.focused) > .contents > .main .monaco-icon-label {
	color: var(--vscode-editorSuggestWidget-foreground);
}

.monaco-editor .suggest-widget:not(.frozen) .monaco-highlighted-label .highlight {
	font-weight: bold;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main .monaco-highlighted-label .highlight {
	color: var(--vscode-editorSuggestWidget-highlightForeground);
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused > .contents > .main .monaco-highlighted-label .highlight {
	color: var(--vscode-editorSuggestWidget-focusHighlightForeground);
}

/** ReadMore Icon styles **/

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close,
.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore::before {
	color: inherit;
	opacity: 1;
	font-size: 14px;
	cursor: pointer;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close {
	position: absolute;
	top: 6px;
	right: 2px;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close:hover,
.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore:hover {
	opacity: 1;
}

/** signature, qualifier, type/details opacity **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	opacity: 0.7;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .signature-label {
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.6;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .qualifier-label {
	margin-left: 12px;
	opacity: 0.4;
	font-size: 85%;
	line-height: initial;
	text-overflow: ellipsis;
	overflow: hidden;
	align-self: center;
}

/** Type Info and icon next to the label in the focused completion item **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	font-size: 85%;
	margin-left: 1.1em;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label > .monaco-tokenized-source {
	display: inline;
}

/** Details: if using CompletionItem#details, show on focus **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	display: none;
}

.monaco-editor .suggest-widget:not(.shows-details) .monaco-list .monaco-list-row.focused > .contents > .main > .right > .details-label {
	display: inline;
}

/** Details: if using CompletionItemLabel#details, always show **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label) > .contents > .main > .right > .details-label,
.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row.focused:not(.string-label) > .contents > .main > .right > .details-label {
	display: inline;
}

/** Ellipsis on hover **/

.monaco-editor .suggest-widget:not(.docs-side) .monaco-list .monaco-list-row.focused:hover > .contents > .main > .right.can-expand-details > .details-label {
	width: calc(100% - 26px);
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left {
	flex-shrink: 1;
	flex-grow: 1;
	overflow: hidden;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .monaco-icon-label {
	flex-shrink: 0;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.string-label) > .contents > .main > .left > .monaco-icon-label {
	max-width: 100%;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label > .contents > .main > .left > .monaco-icon-label {
	flex-shrink: 1;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
	overflow: hidden;
	flex-shrink: 4;
	max-width: 70%;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore {
	display: inline-block;
	position: absolute;
	right: 10px;
	width: 18px;
	height: 18px;
	visibility: hidden;
}

/** Do NOT display ReadMore when docs is side/below **/

.monaco-editor .suggest-widget.docs-side .monaco-list .monaco-list-row > .contents > .main > .right > .readMore {
	display: none !important;
}

/** Do NOT display ReadMore when using plain CompletionItemLabel (details/documentation might not be resolved) **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.string-label > .contents > .main > .right > .readMore {
	display: none;
}

/** Focused item can show ReadMore, but can't when docs is side/below **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused.string-label > .contents > .main > .right > .readMore {
	display: inline-block;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused:hover > .contents > .main > .right > .readMore {
	visibility: visible;
}

/** Styles for each row in the list **/

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated {
	opacity: 0.66;
	text-decoration: unset;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated > .monaco-icon-label-container > .monaco-icon-name-container {
	text-decoration: line-through;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-icon-label::before {
	height: 100%;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon {
	display: block;
	height: 16px;
	width: 16px;
	margin-left: 2px;
	background-repeat: no-repeat;
	background-size: 80%;
	background-position: center;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.hide {
	display: none;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .suggest-icon {
	display: flex;
	align-items: center;
	margin-right: 4px;
}

.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .icon,
.monaco-editor .suggest-widget.no-icons .monaco-list .monaco-list-row .suggest-icon::before {
	display: none;
}

.monaco-editor .suggest-widget .monaco-list .monaco-list-row .icon.customcolor .colorspan {
	margin: 0 0 0 0.3em;
	border: 0.1em solid #000;
	width: 0.7em;
	height: 0.7em;
	display: inline-block;
}

/** Styles for the docs of the completion item in focus **/

.monaco-editor .suggest-details-container {
	z-index: 41;
}

.monaco-editor .suggest-details {
	display: flex;
	flex-direction: column;
	cursor: default;
	color: var(--vscode-editorSuggestWidget-foreground);
}

.monaco-editor .suggest-details:focus {
	border-color: var(--vscode-focusBorder);
}

.monaco-editor .suggest-details a {
	color: var(--vscode-textLink-foreground);
}

.monaco-editor .suggest-details a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.monaco-editor .suggest-details code {
	background-color: var(--vscode-textCodeBlock-background);
}

.monaco-editor .suggest-details.no-docs {
	display: none;
}

.monaco-editor .suggest-details > .monaco-scrollable-element {
	flex: 1;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body {
	box-sizing: border-box;
	height: 100%;
	width: 100%;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .type {
	flex: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.7;
	white-space: pre;
	margin: 0 24px 0 0;
	padding: 4px 0 4px 5px;
}

.monaco-editor .suggest-details.detail-and-doc > .monaco-scrollable-element > .body > .header > .type {
	padding-bottom: 12px;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .header > .type.auto-wrap {
	white-space: normal;
	word-break: break-all;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs {
	margin: 0;
	padding: 4px 5px;
	white-space: pre-wrap;
}

.monaco-editor .suggest-details.no-type > .monaco-scrollable-element > .body > .docs {
	margin-right: 24px;
	overflow: hidden;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs {
	padding: 0;
	white-space: initial;
	min-height: calc(1rem + 8px);
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div,
.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > span:not(:empty) {
	padding: 4px 5px;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:first-child {
	margin-top: 0;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:last-child {
	margin-bottom: 0;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .monaco-tokenized-source {
	white-space: pre;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs .code {
	white-space: pre-wrap;
	word-wrap: break-word;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .codicon {
	vertical-align: sub;
}

.monaco-editor .suggest-details > .monaco-scrollable-element > .body > p:empty {
	display: none;
}

.monaco-editor .suggest-details code {
	border-radius: 3px;
	padding: 0 0.4em;
}

.monaco-editor .suggest-details ul {
	padding-left: 20px;
}

.monaco-editor .suggest-details ol {
	padding-left: 20px;
}

.monaco-editor .suggest-details p code {
	font-family: var(--monaco-monospace-font);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/completionModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/completionModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditorOptions, InternalSuggestOptions } from '../../../../common/config/editorOptions.js';
import { IPosition } from '../../../../common/core/position.js';
import * as languages from '../../../../common/languages.js';
import { CompletionModel } from '../../browser/completionModel.js';
import { CompletionItem, getSuggestionComparator, SnippetSortOrder } from '../../browser/suggest.js';
import { WordDistance } from '../../browser/wordDistance.js';

export function createSuggestItem(label: string | languages.CompletionItemLabel, overwriteBefore: number, kind = languages.CompletionItemKind.Property, incomplete: boolean = false, position: IPosition = { lineNumber: 1, column: 1 }, sortText?: string, filterText?: string): CompletionItem {
	const suggestion: languages.CompletionItem = {
		label,
		sortText,
		filterText,
		range: { startLineNumber: position.lineNumber, startColumn: position.column - overwriteBefore, endLineNumber: position.lineNumber, endColumn: position.column },
		insertText: typeof label === 'string' ? label : label.label,
		kind
	};
	const container: languages.CompletionList = {
		incomplete,
		suggestions: [suggestion]
	};
	const provider: languages.CompletionItemProvider = {
		_debugDisplayName: 'test',
		provideCompletionItems(): any {
			return;
		}
	};

	return new CompletionItem(position, suggestion, container, provider);
}
suite('CompletionModel', function () {

	const defaultOptions = <InternalSuggestOptions>{
		insertMode: 'insert',
		snippetsPreventQuickSuggestions: true,
		filterGraceful: true,
		localityBonus: false,
		shareSuggestSelections: false,
		showIcons: true,
		showMethods: true,
		showFunctions: true,
		showConstructors: true,
		showDeprecated: true,
		showFields: true,
		showVariables: true,
		showClasses: true,
		showStructs: true,
		showInterfaces: true,
		showModules: true,
		showProperties: true,
		showEvents: true,
		showOperators: true,
		showUnits: true,
		showValues: true,
		showConstants: true,
		showEnums: true,
		showEnumMembers: true,
		showKeywords: true,
		showWords: true,
		showColors: true,
		showFiles: true,
		showReferences: true,
		showFolders: true,
		showTypeParameters: true,
		showSnippets: true,
	};

	let model: CompletionModel;

	setup(function () {

		model = new CompletionModel([
			createSuggestItem('foo', 3),
			createSuggestItem('Foo', 3),
			createSuggestItem('foo', 2),
		], 1, {
			leadingLineContent: 'foo',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('filtering - cached', function () {

		const itemsNow = model.items;
		let itemsThen = model.items;
		assert.ok(itemsNow === itemsThen);

		// still the same context
		model.lineContext = { leadingLineContent: 'foo', characterCountDelta: 0 };
		itemsThen = model.items;
		assert.ok(itemsNow === itemsThen);

		// different context, refilter
		model.lineContext = { leadingLineContent: 'foo1', characterCountDelta: 1 };
		itemsThen = model.items;
		assert.ok(itemsNow !== itemsThen);
	});


	test('complete/incomplete', () => {

		assert.strictEqual(model.getIncompleteProvider().size, 0);

		const incompleteModel = new CompletionModel([
			createSuggestItem('foo', 3, undefined, true),
			createSuggestItem('foo', 2),
		], 1, {
			leadingLineContent: 'foo',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);
		assert.strictEqual(incompleteModel.getIncompleteProvider().size, 1);
	});

	test('Fuzzy matching of snippets stopped working with inline snippet suggestions #49895', function () {
		const completeItem1 = createSuggestItem('foobar1', 1, undefined, false, { lineNumber: 1, column: 2 });
		const completeItem2 = createSuggestItem('foobar2', 1, undefined, false, { lineNumber: 1, column: 2 });
		const completeItem3 = createSuggestItem('foobar3', 1, undefined, false, { lineNumber: 1, column: 2 });
		const completeItem4 = createSuggestItem('foobar4', 1, undefined, false, { lineNumber: 1, column: 2 });
		const completeItem5 = createSuggestItem('foobar5', 1, undefined, false, { lineNumber: 1, column: 2 });
		const incompleteItem1 = createSuggestItem('foofoo1', 1, undefined, true, { lineNumber: 1, column: 2 });

		const model = new CompletionModel(
			[
				completeItem1,
				completeItem2,
				completeItem3,
				completeItem4,
				completeItem5,
				incompleteItem1,
			], 2, { leadingLineContent: 'f', characterCountDelta: 0 }, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined
		);
		assert.strictEqual(model.getIncompleteProvider().size, 1);
		assert.strictEqual(model.items.length, 6);
	});

	test('proper current word when length=0, #16380', function () {

		model = new CompletionModel([
			createSuggestItem('    </div', 4),
			createSuggestItem('a', 0),
			createSuggestItem('p', 0),
			createSuggestItem('    </tag', 4),
			createSuggestItem('    XYZ', 4),
		], 1, {
			leadingLineContent: '   <',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		assert.strictEqual(model.items.length, 4);

		const [a, b, c, d] = model.items;
		assert.strictEqual(a.completion.label, '    </div');
		assert.strictEqual(b.completion.label, '    </tag');
		assert.strictEqual(c.completion.label, 'a');
		assert.strictEqual(d.completion.label, 'p');
	});

	test('keep snippet sorting with prefix: top, #25495', function () {

		model = new CompletionModel([
			createSuggestItem('Snippet1', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('tnippet2', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('semver', 1, languages.CompletionItemKind.Property),
		], 1, {
			leadingLineContent: 's',
			characterCountDelta: 0
		}, WordDistance.None, defaultOptions, 'top', undefined);

		assert.strictEqual(model.items.length, 2);
		const [a, b] = model.items;
		assert.strictEqual(a.completion.label, 'Snippet1');
		assert.strictEqual(b.completion.label, 'semver');
		assert.ok(a.score < b.score); // snippet really promoted

	});

	test('keep snippet sorting with prefix: bottom, #25495', function () {

		model = new CompletionModel([
			createSuggestItem('snippet1', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('tnippet2', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('Semver', 1, languages.CompletionItemKind.Property),
		], 1, {
			leadingLineContent: 's',
			characterCountDelta: 0
		}, WordDistance.None, defaultOptions, 'bottom', undefined);

		assert.strictEqual(model.items.length, 2);
		const [a, b] = model.items;
		assert.strictEqual(a.completion.label, 'Semver');
		assert.strictEqual(b.completion.label, 'snippet1');
		assert.ok(a.score < b.score); // snippet really demoted
	});

	test('keep snippet sorting with prefix: inline, #25495', function () {

		model = new CompletionModel([
			createSuggestItem('snippet1', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('tnippet2', 1, languages.CompletionItemKind.Snippet),
			createSuggestItem('Semver', 1),
		], 1, {
			leadingLineContent: 's',
			characterCountDelta: 0
		}, WordDistance.None, defaultOptions, 'inline', undefined);

		assert.strictEqual(model.items.length, 2);
		const [a, b] = model.items;
		assert.strictEqual(a.completion.label, 'snippet1');
		assert.strictEqual(b.completion.label, 'Semver');
		assert.ok(a.score > b.score); // snippet really demoted
	});

	test('filterText seems ignored in autocompletion, #26874', function () {

		const item1 = createSuggestItem('Map - java.util', 1, undefined, undefined, undefined, undefined, 'Map');
		const item2 = createSuggestItem('Map - java.util', 1);

		model = new CompletionModel([item1, item2], 1, {
			leadingLineContent: 'M',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		assert.strictEqual(model.items.length, 2);

		model.lineContext = {
			leadingLineContent: 'Map ',
			characterCountDelta: 3
		};
		assert.strictEqual(model.items.length, 1);
	});

	test('Vscode 1.12 no longer obeys \'sortText\' in completion items (from language server), #26096', function () {

		const item1 = createSuggestItem('<- groups', 2, languages.CompletionItemKind.Property, false, { lineNumber: 1, column: 3 }, '00002', '  groups');
		const item2 = createSuggestItem('source', 0, languages.CompletionItemKind.Property, false, { lineNumber: 1, column: 3 }, '00001', 'source');
		const items = [item1, item2].sort(getSuggestionComparator(SnippetSortOrder.Inline));

		model = new CompletionModel(items, 3, {
			leadingLineContent: '  ',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		assert.strictEqual(model.items.length, 2);

		const [first, second] = model.items;
		assert.strictEqual(first.completion.label, 'source');
		assert.strictEqual(second.completion.label, '<- groups');
	});

	test('Completion item sorting broken when using label details #153026', function () {
		const itemZZZ = createSuggestItem({ label: 'ZZZ' }, 0, languages.CompletionItemKind.Operator, false);
		const itemAAA = createSuggestItem({ label: 'AAA' }, 0, languages.CompletionItemKind.Operator, false);
		const itemIII = createSuggestItem('III', 0, languages.CompletionItemKind.Operator, false);

		const cmp = getSuggestionComparator(SnippetSortOrder.Inline);
		const actual = [itemZZZ, itemAAA, itemIII].sort(cmp);

		assert.deepStrictEqual(actual, [itemAAA, itemIII, itemZZZ]);
	});

	test('Score only filtered items when typing more, score all when typing less', function () {
		model = new CompletionModel([
			createSuggestItem('console', 0),
			createSuggestItem('co_new', 0),
			createSuggestItem('bar', 0),
			createSuggestItem('car', 0),
			createSuggestItem('foo', 0),
		], 1, {
			leadingLineContent: '',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		assert.strictEqual(model.items.length, 5);

		// narrow down once
		model.lineContext = { leadingLineContent: 'c', characterCountDelta: 1 };
		assert.strictEqual(model.items.length, 3);

		// query gets longer, narrow down the narrow-down'ed-set from before
		model.lineContext = { leadingLineContent: 'cn', characterCountDelta: 2 };
		assert.strictEqual(model.items.length, 2);

		// query gets shorter, refilter everything
		model.lineContext = { leadingLineContent: '', characterCountDelta: 0 };
		assert.strictEqual(model.items.length, 5);
	});

	test('Have more relaxed suggest matching algorithm #15419', function () {
		model = new CompletionModel([
			createSuggestItem('result', 0),
			createSuggestItem('replyToUser', 0),
			createSuggestItem('randomLolut', 0),
			createSuggestItem('car', 0),
			createSuggestItem('foo', 0),
		], 1, {
			leadingLineContent: '',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		// query gets longer, narrow down the narrow-down'ed-set from before
		model.lineContext = { leadingLineContent: 'rlut', characterCountDelta: 4 };
		assert.strictEqual(model.items.length, 3);

		const [first, second, third] = model.items;
		assert.strictEqual(first.completion.label, 'result'); // best with `rult`
		assert.strictEqual(second.completion.label, 'replyToUser');  // best with `rltu`
		assert.strictEqual(third.completion.label, 'randomLolut');  // best with `rlut`
	});

	test('Emmet suggestion not appearing at the top of the list in jsx files, #39518', function () {
		model = new CompletionModel([
			createSuggestItem('from', 0),
			createSuggestItem('form', 0),
			createSuggestItem('form:get', 0),
			createSuggestItem('testForeignMeasure', 0),
			createSuggestItem('fooRoom', 0),
		], 1, {
			leadingLineContent: '',
			characterCountDelta: 0
		}, WordDistance.None, EditorOptions.suggest.defaultValue, EditorOptions.snippetSuggestions.defaultValue, undefined);

		model.lineContext = { leadingLineContent: 'form', characterCountDelta: 4 };
		assert.strictEqual(model.items.length, 5);
		const [first, second, third] = model.items;
		assert.strictEqual(first.completion.label, 'form'); // best with `form`
		assert.strictEqual(second.completion.label, 'form:get');  // best with `form`
		assert.strictEqual(third.completion.label, 'from');  // best with `from`
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/suggest.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/suggest.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { CompletionItemKind, CompletionItemProvider } from '../../../../common/languages.js';
import { CompletionOptions, provideSuggestionItems, SnippetSortOrder } from '../../browser/suggest.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { LanguageFeatureRegistry } from '../../../../common/languageFeatureRegistry.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';


suite('Suggest', function () {
	let model: TextModel;
	let registration: IDisposable;
	let registry: LanguageFeatureRegistry<CompletionItemProvider>;

	setup(function () {
		registry = new LanguageFeatureRegistry();
		model = createTextModel('FOO\nbar\BAR\nfoo', undefined, undefined, URI.parse('foo:bar/path'));
		registration = registry.register({ pattern: 'bar/path', scheme: 'foo' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(_doc, pos) {
				return {
					incomplete: false,
					suggestions: [{
						label: 'aaa',
						kind: CompletionItemKind.Snippet,
						insertText: 'aaa',
						range: Range.fromPositions(pos)
					}, {
						label: 'zzz',
						kind: CompletionItemKind.Snippet,
						insertText: 'zzz',
						range: Range.fromPositions(pos)
					}, {
						label: 'fff',
						kind: CompletionItemKind.Property,
						insertText: 'fff',
						range: Range.fromPositions(pos)
					}]
				};
			}
		});
	});

	teardown(() => {
		registration.dispose();
		model.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('sort - snippet inline', async function () {
		const { items, disposable } = await provideSuggestionItems(registry, model, new Position(1, 1), new CompletionOptions(SnippetSortOrder.Inline));
		assert.strictEqual(items.length, 3);
		assert.strictEqual(items[0].completion.label, 'aaa');
		assert.strictEqual(items[1].completion.label, 'fff');
		assert.strictEqual(items[2].completion.label, 'zzz');
		disposable.dispose();
	});

	test('sort - snippet top', async function () {
		const { items, disposable } = await provideSuggestionItems(registry, model, new Position(1, 1), new CompletionOptions(SnippetSortOrder.Top));
		assert.strictEqual(items.length, 3);
		assert.strictEqual(items[0].completion.label, 'aaa');
		assert.strictEqual(items[1].completion.label, 'zzz');
		assert.strictEqual(items[2].completion.label, 'fff');
		disposable.dispose();
	});

	test('sort - snippet bottom', async function () {
		const { items, disposable } = await provideSuggestionItems(registry, model, new Position(1, 1), new CompletionOptions(SnippetSortOrder.Bottom));
		assert.strictEqual(items.length, 3);
		assert.strictEqual(items[0].completion.label, 'fff');
		assert.strictEqual(items[1].completion.label, 'aaa');
		assert.strictEqual(items[2].completion.label, 'zzz');
		disposable.dispose();
	});

	test('sort - snippet none', async function () {
		const { items, disposable } = await provideSuggestionItems(registry, model, new Position(1, 1), new CompletionOptions(undefined, new Set<CompletionItemKind>().add(CompletionItemKind.Snippet)));
		assert.strictEqual(items.length, 1);
		assert.strictEqual(items[0].completion.label, 'fff');
		disposable.dispose();
	});

	test('only from', function (callback) {

		const foo: any = {
			triggerCharacters: [],
			provideCompletionItems() {
				return {
					currentWord: '',
					incomplete: false,
					suggestions: [{
						label: 'jjj',
						type: 'property',
						insertText: 'jjj'
					}]
				};
			}
		};
		const registration = registry.register({ pattern: 'bar/path', scheme: 'foo' }, foo);

		provideSuggestionItems(registry, model, new Position(1, 1), new CompletionOptions(undefined, undefined, new Set<CompletionItemProvider>().add(foo))).then(({ items, disposable }) => {
			registration.dispose();

			assert.strictEqual(items.length, 1);
			assert.ok(items[0].provider === foo);
			disposable.dispose();
			callback();
		});
	});

	test('Ctrl+space completions stopped working with the latest Insiders, #97650', async function () {


		const foo = new class implements CompletionItemProvider {

			_debugDisplayName = 'test';
			triggerCharacters = [];

			provideCompletionItems() {
				return {
					suggestions: [{
						label: 'one',
						kind: CompletionItemKind.Class,
						insertText: 'one',
						range: {
							insert: new Range(0, 0, 0, 0),
							replace: new Range(0, 0, 0, 10)
						}
					}, {
						label: 'two',
						kind: CompletionItemKind.Class,
						insertText: 'two',
						range: {
							insert: new Range(0, 0, 0, 0),
							replace: new Range(0, 1, 0, 10)
						}
					}]
				};
			}
		};

		const registration = registry.register({ pattern: 'bar/path', scheme: 'foo' }, foo);
		const { items, disposable } = await provideSuggestionItems(registry, model, new Position(0, 0), new CompletionOptions(undefined, undefined, new Set<CompletionItemProvider>().add(foo)));
		registration.dispose();

		assert.strictEqual(items.length, 2);
		const [a, b] = items;

		assert.strictEqual(a.completion.label, 'one');
		assert.strictEqual(a.isInvalid, false);
		assert.strictEqual(b.completion.label, 'two');
		assert.strictEqual(b.isInvalid, true);
		disposable.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/suggestController.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/suggestController.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { CompletionItemInsertTextRule, CompletionItemKind } from '../../../../common/languages.js';
import { IEditorWorkerService } from '../../../../common/services/editorWorker.js';
import { SnippetController2 } from '../../../snippet/browser/snippetController2.js';
import { SuggestController } from '../../browser/suggestController.js';
import { ISuggestMemoryService } from '../../browser/suggestMemory.js';
import { createTestCodeEditor, ITestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { MockKeybindingService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { InMemoryStorageService, IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { DeleteLinesAction } from '../../../linesOperations/browser/linesOperations.js';

suite('SuggestController', function () {

	const disposables = new DisposableStore();

	let controller: SuggestController;
	let editor: ITestCodeEditor;
	let model: TextModel;
	const languageFeaturesService = new LanguageFeaturesService();

	teardown(function () {

		disposables.clear();
	});

	// ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {

		const serviceCollection = new ServiceCollection(
			[ILanguageFeaturesService, languageFeaturesService],
			[ITelemetryService, NullTelemetryService],
			[ILogService, new NullLogService()],
			[IStorageService, disposables.add(new InMemoryStorageService())],
			[IKeybindingService, new MockKeybindingService()],
			[IEditorWorkerService, new class extends mock<IEditorWorkerService>() {
				override computeWordRanges() {
					return Promise.resolve({});
				}
			}],
			[ISuggestMemoryService, new class extends mock<ISuggestMemoryService>() {
				override memorize(): void { }
				override select(): number { return 0; }
			}],
			[IMenuService, new class extends mock<IMenuService>() {
				override createMenu() {
					return new class extends mock<IMenu>() {
						override onDidChange = Event.None;
						override dispose() { }
					};
				}
			}],
			[ILabelService, new class extends mock<ILabelService>() { }],
			[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() { }],
			[IEnvironmentService, new class extends mock<IEnvironmentService>() {
				override isBuilt: boolean = true;
				override isExtensionDevelopment: boolean = false;
			}],
		);

		model = disposables.add(createTextModel('', undefined, undefined, URI.from({ scheme: 'test-ctrl', path: '/path.tst' })));
		editor = disposables.add(createTestCodeEditor(model, { serviceCollection }));

		editor.registerAndInstantiateContribution(SnippetController2.ID, SnippetController2);
		controller = editor.registerAndInstantiateContribution(SuggestController.ID, SuggestController);
	});

	test('postfix completion reports incorrect position #86984', async function () {
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'let ${1:name} = foo$0',
						insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
						range: { startLineNumber: 1, startColumn: 9, endLineNumber: 1, endColumn: 11 },
						additionalTextEdits: [{
							text: '',
							range: { startLineNumber: 1, startColumn: 5, endLineNumber: 1, endColumn: 9 }
						}]
					}]
				};
			}
		}));

		editor.setValue('    foo.le');
		editor.setSelection(new Selection(1, 11, 1, 11));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		assert.strictEqual(editor.getValue(), '    let name = foo');
	});

	test('use additionalTextEdits sync when possible', async function () {

		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos),
						additionalTextEdits: [{
							text: 'I came sync',
							range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
						}]
					}]
				};
			},
			async resolveCompletionItem(item) {
				return item;
			}
		}));

		editor.setValue('hello\nhallo');
		editor.setSelection(new Selection(2, 6, 2, 6));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'I came synchello\nhallohello');
	});

	test('resolve additionalTextEdits async when needed', async function () {

		let resolveCallCount = 0;

		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos)
					}]
				};
			},
			async resolveCompletionItem(item) {
				resolveCallCount += 1;
				await timeout(10);
				item.additionalTextEdits = [{
					text: 'I came late',
					range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
				}];
				return item;
			}
		}));

		editor.setValue('hello\nhallo');
		editor.setSelection(new Selection(2, 6, 2, 6));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'hello\nhallohello');
		assert.strictEqual(resolveCallCount, 1);

		// additional edits happened after a litte wait
		await timeout(20);
		assert.strictEqual(editor.getValue(), 'I came latehello\nhallohello');

		// single undo stop
		editor.getModel()?.undo();
		assert.strictEqual(editor.getValue(), 'hello\nhallo');
	});

	test('resolve additionalTextEdits async when needed (typing)', async function () {

		let resolveCallCount = 0;
		let resolve: Function = () => { };
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos)
					}]
				};
			},
			async resolveCompletionItem(item) {
				resolveCallCount += 1;
				await new Promise(_resolve => resolve = _resolve);
				item.additionalTextEdits = [{
					text: 'I came late',
					range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
				}];
				return item;
			}
		}));

		editor.setValue('hello\nhallo');
		editor.setSelection(new Selection(2, 6, 2, 6));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'hello\nhallohello');
		assert.strictEqual(resolveCallCount, 1);

		// additional edits happened after a litte wait
		assert.ok(editor.getSelection()?.equalsSelection(new Selection(2, 11, 2, 11)));
		editor.trigger('test', 'type', { text: 'TYPING' });

		assert.strictEqual(editor.getValue(), 'hello\nhallohelloTYPING');

		resolve();
		await timeout(10);
		assert.strictEqual(editor.getValue(), 'I came latehello\nhallohelloTYPING');
		assert.ok(editor.getSelection()?.equalsSelection(new Selection(2, 17, 2, 17)));
	});

	// additional edit come late and are AFTER the selection -> cancel
	test('resolve additionalTextEdits async when needed (simple conflict)', async function () {

		let resolveCallCount = 0;
		let resolve: Function = () => { };
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos)
					}]
				};
			},
			async resolveCompletionItem(item) {
				resolveCallCount += 1;
				await new Promise(_resolve => resolve = _resolve);
				item.additionalTextEdits = [{
					text: 'I came late',
					range: { startLineNumber: 1, startColumn: 6, endLineNumber: 1, endColumn: 6 }
				}];
				return item;
			}
		}));

		editor.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'hello');
		assert.strictEqual(resolveCallCount, 1);

		resolve();
		await timeout(10);
		assert.strictEqual(editor.getValue(), 'hello');
	});

	// additional edit come late and are AFTER the position at which the user typed -> cancelled
	test('resolve additionalTextEdits async when needed (conflict)', async function () {

		let resolveCallCount = 0;
		let resolve: Function = () => { };
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos)
					}]
				};
			},
			async resolveCompletionItem(item) {
				resolveCallCount += 1;
				await new Promise(_resolve => resolve = _resolve);
				item.additionalTextEdits = [{
					text: 'I came late',
					range: { startLineNumber: 1, startColumn: 2, endLineNumber: 1, endColumn: 2 }
				}];
				return item;
			}
		}));

		editor.setValue('hello\nhallo');
		editor.setSelection(new Selection(2, 6, 2, 6));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(false, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'hello\nhallohello');
		assert.strictEqual(resolveCallCount, 1);

		// additional edits happened after a litte wait
		editor.setSelection(new Selection(1, 1, 1, 1));
		editor.trigger('test', 'type', { text: 'TYPING' });

		assert.strictEqual(editor.getValue(), 'TYPINGhello\nhallohello');

		resolve();
		await timeout(10);
		assert.strictEqual(editor.getValue(), 'TYPINGhello\nhallohello');
		assert.ok(editor.getSelection()?.equalsSelection(new Selection(1, 7, 1, 7)));
	});

	test('resolve additionalTextEdits async when needed (cancel)', async function () {

		const resolve: Function[] = [];
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hello',
						range: Range.fromPositions(pos)
					}, {
						kind: CompletionItemKind.Snippet,
						label: 'let',
						insertText: 'hallo',
						range: Range.fromPositions(pos)
					}]
				};
			},
			async resolveCompletionItem(item) {
				await new Promise(_resolve => resolve.push(_resolve));
				item.additionalTextEdits = [{
					text: 'additionalTextEdits',
					range: { startLineNumber: 1, startColumn: 2, endLineNumber: 1, endColumn: 2 }
				}];
				return item;
			}
		}));

		editor.setValue('abc');
		editor.setSelection(new Selection(1, 1, 1, 1));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(true, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'helloabc');

		// next
		controller.acceptNextSuggestion();

		// resolve additional edits (MUST be cancelled)
		resolve.forEach(fn => fn);
		resolve.length = 0;
		await timeout(10);

		// next suggestion used
		assert.strictEqual(editor.getValue(), 'halloabc');
	});

	test('Completion edits are applied inconsistently when additionalTextEdits and textEdit start at the same offset #143888', async function () {


		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'MyClassName',
						insertText: 'MyClassName',
						range: Range.fromPositions(pos),
						additionalTextEdits: [{
							range: Range.fromPositions(pos),
							text: 'import "my_class.txt";\n'
						}]
					}]
				};
			}
		}));

		editor.setValue('');
		editor.setSelection(new Selection(1, 1, 1, 1));

		// trigger
		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();
		await p1;

		//
		const p2 = Event.toPromise(controller.model.onDidCancel);
		controller.acceptSelectedSuggestion(true, false);
		await p2;

		// insertText happens sync!
		assert.strictEqual(editor.getValue(), 'import "my_class.txt";\nMyClassName');

	});

	test('Pressing enter on autocomplete should always apply the selected dropdown completion, not a different, hidden one #161883', async function () {
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {

				const word = doc.getWordUntilPosition(pos);
				const range = new Range(pos.lineNumber, word.startColumn, pos.lineNumber, word.endColumn);

				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'filterBankSize',
						insertText: 'filterBankSize',
						sortText: 'a',
						range
					}, {
						kind: CompletionItemKind.Text,
						label: 'filter',
						insertText: 'filter',
						sortText: 'b',
						range
					}]
				};
			}
		}));

		editor.setValue('filte');
		editor.setSelection(new Selection(1, 6, 1, 6));

		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();

		const { completionModel } = await p1;
		assert.strictEqual(completionModel.items.length, 2);

		const [first, second] = completionModel.items;
		assert.strictEqual(first.textLabel, 'filterBankSize');
		assert.strictEqual(second.textLabel, 'filter');

		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 6, 1, 6));
		editor.trigger('keyboard', 'type', { text: 'r' }); // now filter "overtakes" filterBankSize because it is fully matched
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 7, 1, 7));

		controller.acceptSelectedSuggestion(false, false);
		assert.strictEqual(editor.getValue(), 'filter');
	});

	test('Fast autocomple typing selects the previous autocomplete suggestion, #71795', async function () {
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {

				const word = doc.getWordUntilPosition(pos);
				const range = new Range(pos.lineNumber, word.startColumn, pos.lineNumber, word.endColumn);

				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'false',
						insertText: 'false',
						range
					}, {
						kind: CompletionItemKind.Text,
						label: 'float',
						insertText: 'float',
						range
					}, {
						kind: CompletionItemKind.Text,
						label: 'for',
						insertText: 'for',
						range
					}, {
						kind: CompletionItemKind.Text,
						label: 'foreach',
						insertText: 'foreach',
						range
					}]
				};
			}
		}));

		editor.setValue('f');
		editor.setSelection(new Selection(1, 2, 1, 2));

		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();

		const { completionModel } = await p1;
		assert.strictEqual(completionModel.items.length, 4);

		const [first, second, third, fourth] = completionModel.items;
		assert.strictEqual(first.textLabel, 'false');
		assert.strictEqual(second.textLabel, 'float');
		assert.strictEqual(third.textLabel, 'for');
		assert.strictEqual(fourth.textLabel, 'foreach');

		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 2, 1, 2));
		editor.trigger('keyboard', 'type', { text: 'o' }); // filters`false` and `float`
		assert.deepStrictEqual(editor.getSelection(), new Selection(1, 3, 1, 3));

		controller.acceptSelectedSuggestion(false, false);
		assert.strictEqual(editor.getValue(), 'for');
	});

	test.skip('Suggest widget gets orphaned in editor #187779', async function () {

		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {

				const word = doc.getLineContent(pos.lineNumber);
				const range = new Range(pos.lineNumber, 1, pos.lineNumber, pos.column);

				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: word,
						insertText: word,
						range
					}]
				};
			}
		}));

		editor.setValue(`console.log(example.)\nconsole.log(EXAMPLE.not)`);
		editor.setSelection(new Selection(1, 21, 1, 21));

		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();

		await p1;

		const p2 = Event.toPromise(controller.model.onDidCancel);
		new DeleteLinesAction().run(null!, editor);

		await p2;
	});

	test('Ranges where additionalTextEdits are applied are not appropriate when characters are typed #177591', async function () {
		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Snippet,
						label: 'aaa',
						insertText: 'aaa',
						range: Range.fromPositions(pos),
						additionalTextEdits: [{
							range: Range.fromPositions(pos.delta(0, 10)),
							text: 'aaa'
						}]
					}]
				};
			}
		}));

		{ // PART1 - no typing
			editor.setValue(`123456789123456789`);
			editor.setSelection(new Selection(1, 1, 1, 1));
			const p1 = Event.toPromise(controller.model.onDidSuggest);
			controller.triggerSuggest();

			const e = await p1;
			assert.strictEqual(e.completionModel.items.length, 1);
			assert.strictEqual(e.completionModel.items[0].textLabel, 'aaa');

			controller.acceptSelectedSuggestion(false, false);

			assert.strictEqual(editor.getValue(), 'aaa1234567891aaa23456789');
		}

		{ // PART2 - typing
			editor.setValue(`123456789123456789`);
			editor.setSelection(new Selection(1, 1, 1, 1));
			const p1 = Event.toPromise(controller.model.onDidSuggest);
			controller.triggerSuggest();

			const e = await p1;
			assert.strictEqual(e.completionModel.items.length, 1);
			assert.strictEqual(e.completionModel.items[0].textLabel, 'aaa');

			editor.trigger('keyboard', 'type', { text: 'aa' });

			controller.acceptSelectedSuggestion(false, false);

			assert.strictEqual(editor.getValue(), 'aaa1234567891aaa23456789');
		}
	});

	test.skip('[Bug] "No suggestions" persists while typing if the completion helper is set to return an empty list for empty content#3557', async function () {
		let requestCount = 0;

		disposables.add(languageFeaturesService.completionProvider.register({ scheme: 'test-ctrl' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				requestCount += 1;

				if (requestCount === 1) {
					return undefined;
				}

				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'foo',
						insertText: 'foo',
						range: new Range(pos.lineNumber, 1, pos.lineNumber, pos.column)
					}],
				};
			}
		}));

		const p1 = Event.toPromise(controller.model.onDidSuggest);
		controller.triggerSuggest();

		const e1 = await p1;
		assert.strictEqual(e1.completionModel.items.length, 0);
		assert.strictEqual(requestCount, 1);

		const p2 = Event.toPromise(controller.model.onDidSuggest);
		editor.trigger('keyboard', 'type', { text: 'f' });

		const e2 = await p2;
		assert.strictEqual(e2.completionModel.items.length, 1);
		assert.strictEqual(requestCount, 2);

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/suggestInlineCompletions.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/suggestInlineCompletions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { CompletionContext, CompletionItem, CompletionItemKind, CompletionItemProvider, CompletionList, InlineCompletionContext, InlineCompletionTriggerKind, ProviderResult } from '../../../../common/languages.js';
import { ITextModel } from '../../../../common/model.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { SuggestInlineCompletions } from '../../browser/suggestInlineCompletions.js';
import { ISuggestMemoryService } from '../../browser/suggestMemory.js';
import { createCodeEditorServices, instantiateTestCodeEditor, ITestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { generateUuid } from '../../../../../base/common/uuid.js';


suite('Suggest Inline Completions', function () {

	const disposables = new DisposableStore();
	const services = new ServiceCollection([ISuggestMemoryService, new class extends mock<ISuggestMemoryService>() {
		override select(): number {
			return 0;
		}
	}]);

	let insta: TestInstantiationService;
	let model: TextModel;
	let editor: ITestCodeEditor;

	setup(function () {

		insta = createCodeEditorServices(disposables, services);
		model = createTextModel('he', undefined, undefined, URI.from({ scheme: 'foo', path: 'foo.bar' }));
		editor = instantiateTestCodeEditor(insta, model);
		editor.updateOptions({ quickSuggestions: { comments: 'inline', strings: 'inline', other: 'inline' } });

		insta.invokeFunction(accessor => {
			disposables.add(accessor.get(ILanguageFeaturesService).completionProvider.register({ pattern: '*.bar', scheme: 'foo' }, new class implements CompletionItemProvider {
				_debugDisplayName = 'test';

				triggerCharacters?: string[] | undefined;

				provideCompletionItems(model: ITextModel, position: Position, context: CompletionContext, token: CancellationToken): ProviderResult<CompletionList> {

					const word = model.getWordUntilPosition(position);
					const range = new Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);

					const suggestions: CompletionItem[] = [];
					suggestions.push({ insertText: 'hello', label: 'hello', range, kind: CompletionItemKind.Class });
					suggestions.push({ insertText: 'hell', label: 'hell', range, kind: CompletionItemKind.Class });
					suggestions.push({ insertText: 'hey', label: 'hey', range, kind: CompletionItemKind.Snippet });
					return { suggestions };
				}

			}));
		});
	});

	teardown(function () {
		disposables.clear();
		model.dispose();
		editor.dispose();
	});


	ensureNoDisposablesAreLeakedInTestSuite();

	const context: InlineCompletionContext = { triggerKind: InlineCompletionTriggerKind.Explicit, selectedSuggestionInfo: undefined, includeInlineCompletions: true, includeInlineEdits: false, requestUuid: generateUuid(), requestIssuedDateTime: 0, earliestShownDateTime: 0 };

	test('Aggressive inline completions when typing within line #146948', async function () {

		const completions: SuggestInlineCompletions = disposables.add(insta.createInstance(SuggestInlineCompletions));

		{
			// (1,3), end of word -> suggestions
			const result = await completions.provideInlineCompletions(model, new Position(1, 3), context, CancellationToken.None);
			assert.strictEqual(result?.items.length, 3);
			completions.disposeInlineCompletions(result);
		}
		{
			// (1,2), middle of word -> NO suggestions
			const result = await completions.provideInlineCompletions(model, new Position(1, 2), context, CancellationToken.None);
			assert.ok(result === undefined);
		}
	});

	test('Snippets show in inline suggestions even though they are turned off #175190', async function () {
		const completions: SuggestInlineCompletions = disposables.add(insta.createInstance(SuggestInlineCompletions));

		{
			// unfiltered
			const result = await completions.provideInlineCompletions(model, new Position(1, 3), context, CancellationToken.None);
			assert.strictEqual(result?.items.length, 3);
			completions.disposeInlineCompletions(result);
		}

		{
			// filtered
			editor.updateOptions({ suggest: { showSnippets: false } });
			const result = await completions.provideInlineCompletions(model, new Position(1, 3), context, CancellationToken.None);
			assert.strictEqual(result?.items.length, 2);
			completions.disposeInlineCompletions(result);
		}

	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/suggestMemory.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/suggestMemory.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IPosition } from '../../../../common/core/position.js';
import { ITextModel } from '../../../../common/model.js';
import { CompletionItem } from '../../browser/suggest.js';
import { LRUMemory, Memory, NoMemory, PrefixMemory } from '../../browser/suggestMemory.js';
import { createSuggestItem } from './completionModel.test.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

suite('SuggestMemories', function () {

	let pos: IPosition;
	let buffer: ITextModel;
	let items: CompletionItem[];

	setup(function () {
		pos = { lineNumber: 1, column: 1 };
		buffer = createTextModel('This is some text.\nthis.\nfoo: ,');
		items = [
			createSuggestItem('foo', 0),
			createSuggestItem('bar', 0)
		];
	});

	teardown(() => {
		buffer.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('AbstractMemory, select', function () {

		const mem = new class extends Memory {
			constructor() {
				super('first');
			}
			memorize(model: ITextModel, pos: IPosition, item: CompletionItem): void {
				throw new Error('Method not implemented.');
			} toJSON(): object {
				throw new Error('Method not implemented.');
			}
			fromJSON(data: object): void {
				throw new Error('Method not implemented.');
			}
		};

		const item1 = createSuggestItem('fazz', 0);
		const item2 = createSuggestItem('bazz', 0);
		const item3 = createSuggestItem('bazz', 0);
		const item4 = createSuggestItem('bazz', 0);
		item1.completion.preselect = false;
		item2.completion.preselect = true;
		item3.completion.preselect = true;

		assert.strictEqual(mem.select(buffer, pos, [item1, item2, item3, item4]), 1);
	});

	test('[No|Prefix|LRU]Memory honor selection boost', function () {
		const item1 = createSuggestItem('fazz', 0);
		const item2 = createSuggestItem('bazz', 0);
		const item3 = createSuggestItem('bazz', 0);
		const item4 = createSuggestItem('bazz', 0);
		item1.completion.preselect = false;
		item2.completion.preselect = true;
		item3.completion.preselect = true;
		const items = [item1, item2, item3, item4];


		assert.strictEqual(new NoMemory().select(buffer, pos, items), 1);
		assert.strictEqual(new LRUMemory().select(buffer, pos, items), 1);
		assert.strictEqual(new PrefixMemory().select(buffer, pos, items), 1);
	});

	test('NoMemory', () => {

		const mem = new NoMemory();

		assert.strictEqual(mem.select(buffer, pos, items), 0);
		assert.strictEqual(mem.select(buffer, pos, []), 0);

		mem.memorize(buffer, pos, items[0]);
		mem.memorize(buffer, pos, null!);
	});

	test('LRUMemory', () => {

		pos = { lineNumber: 2, column: 6 };

		const mem = new LRUMemory();
		mem.memorize(buffer, pos, items[1]);

		assert.strictEqual(mem.select(buffer, pos, items), 1);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 3 }, items), 0);

		mem.memorize(buffer, pos, items[0]);
		assert.strictEqual(mem.select(buffer, pos, items), 0);

		assert.strictEqual(mem.select(buffer, pos, [
			createSuggestItem('new', 0),
			createSuggestItem('bar', 0)
		]), 1);

		assert.strictEqual(mem.select(buffer, pos, [
			createSuggestItem('new1', 0),
			createSuggestItem('new2', 0)
		]), 0);
	});

	test('`"editor.suggestSelection": "recentlyUsed"` should be a little more sticky #78571', function () {

		const item1 = createSuggestItem('gamma', 0);
		const item2 = createSuggestItem('game', 0);
		items = [item1, item2];

		const mem = new LRUMemory();
		buffer.setValue('    foo.');
		mem.memorize(buffer, { lineNumber: 1, column: 1 }, item2);

		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 2 }, items), 0); // leading whitespace -> ignore recent items

		mem.memorize(buffer, { lineNumber: 1, column: 9 }, item2);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 9 }, items), 1); // foo.

		buffer.setValue('    foo.g');
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 10 }, items), 1); // foo.g, 'gamma' and 'game' have the same score

		item1.score = [10, 0, 0];
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 10 }, items), 0); // foo.g, 'gamma' has higher score

	});

	test('intellisense is not showing top options first #43429', function () {
		// ensure we don't memorize for whitespace prefixes

		pos = { lineNumber: 2, column: 6 };
		const mem = new LRUMemory();

		mem.memorize(buffer, pos, items[1]);
		assert.strictEqual(mem.select(buffer, pos, items), 1);

		assert.strictEqual(mem.select(buffer, { lineNumber: 3, column: 5 }, items), 0); // foo: |,
		assert.strictEqual(mem.select(buffer, { lineNumber: 3, column: 6 }, items), 1); // foo: ,|
	});

	test('PrefixMemory', () => {

		const mem = new PrefixMemory();
		buffer.setValue('constructor');
		const item0 = createSuggestItem('console', 0);
		const item1 = createSuggestItem('const', 0);
		const item2 = createSuggestItem('constructor', 0);
		const item3 = createSuggestItem('constant', 0);
		const items = [item0, item1, item2, item3];

		mem.memorize(buffer, { lineNumber: 1, column: 2 }, item1); // c -> const
		mem.memorize(buffer, { lineNumber: 1, column: 3 }, item0); // co -> console
		mem.memorize(buffer, { lineNumber: 1, column: 4 }, item2); // con -> constructor

		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 1 }, items), 0);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 2 }, items), 1);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 3 }, items), 0);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 4 }, items), 2);
		assert.strictEqual(mem.select(buffer, { lineNumber: 1, column: 7 }, items), 2); // find substr
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/suggestModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/suggestModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import { EditOperation } from '../../../../common/core/editOperation.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { Handler } from '../../../../common/editorCommon.js';
import { ITextModel } from '../../../../common/model.js';
import { TextModel } from '../../../../common/model/textModel.js';
import { CompletionItemKind, CompletionItemProvider, CompletionList, CompletionTriggerKind, EncodedTokenizationResult, IState, TokenizationRegistry } from '../../../../common/languages.js';
import { MetadataConsts } from '../../../../common/encodedTokenAttributes.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { NullState } from '../../../../common/languages/nullTokenize.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { SnippetController2 } from '../../../snippet/browser/snippetController2.js';
import { SuggestController } from '../../browser/suggestController.js';
import { ISuggestMemoryService } from '../../browser/suggestMemory.js';
import { LineContext, SuggestModel } from '../../browser/suggestModel.js';
import { ISelectedSuggestion } from '../../browser/suggestWidget.js';
import { createTestCodeEditor, ITestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createModelServices, createTextModel, instantiateTextModel } from '../../../../test/common/testTextModel.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { MockKeybindingService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { InMemoryStorageService, IStorageService } from '../../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { ILanguageFeaturesService } from '../../../../common/services/languageFeatures.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { getSnippetSuggestSupport, setSnippetSuggestSupport } from '../../browser/suggest.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';


function createMockEditor(model: TextModel, languageFeaturesService: ILanguageFeaturesService): ITestCodeEditor {

	const storeService = new InMemoryStorageService();
	const editor = createTestCodeEditor(model, {
		serviceCollection: new ServiceCollection(
			[ILanguageFeaturesService, languageFeaturesService],
			[ITelemetryService, NullTelemetryService],
			[IStorageService, storeService],
			[IKeybindingService, new MockKeybindingService()],
			[ISuggestMemoryService, new class implements ISuggestMemoryService {
				declare readonly _serviceBrand: undefined;
				memorize(): void {
				}
				select(): number {
					return -1;
				}
			}],
			[ILabelService, new class extends mock<ILabelService>() { }],
			[IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() { }],
			[IEnvironmentService, new class extends mock<IEnvironmentService>() {
				override isBuilt: boolean = true;
				override isExtensionDevelopment: boolean = false;
			}],
		),
	});
	const ctrl = editor.registerAndInstantiateContribution(SnippetController2.ID, SnippetController2);
	editor.hasWidgetFocus = () => true;

	editor.registerDisposable(ctrl);
	editor.registerDisposable(storeService);
	return editor;
}

suite('SuggestModel - Context', function () {
	const OUTER_LANGUAGE_ID = 'outerMode';
	const INNER_LANGUAGE_ID = 'innerMode';

	class OuterMode extends Disposable {
		public readonly languageId = OUTER_LANGUAGE_ID;
		constructor(
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService,
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {}));

			this._register(TokenizationRegistry.register(this.languageId, {
				getInitialState: (): IState => NullState,
				tokenize: undefined!,
				tokenizeEncoded: (line: string, hasEOL: boolean, state: IState): EncodedTokenizationResult => {
					const tokensArr: number[] = [];
					let prevLanguageId: string | undefined = undefined;
					for (let i = 0; i < line.length; i++) {
						const languageId = (line.charAt(i) === 'x' ? INNER_LANGUAGE_ID : OUTER_LANGUAGE_ID);
						const encodedLanguageId = languageService.languageIdCodec.encodeLanguageId(languageId);
						if (prevLanguageId !== languageId) {
							tokensArr.push(i);
							tokensArr.push((encodedLanguageId << MetadataConsts.LANGUAGEID_OFFSET));
						}
						prevLanguageId = languageId;
					}

					const tokens = new Uint32Array(tokensArr.length);
					for (let i = 0; i < tokens.length; i++) {
						tokens[i] = tokensArr[i];
					}
					return new EncodedTokenizationResult(tokens, [], state);
				}
			}));
		}
	}

	class InnerMode extends Disposable {
		public readonly languageId = INNER_LANGUAGE_ID;
		constructor(
			@ILanguageService languageService: ILanguageService,
			@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
		) {
			super();
			this._register(languageService.registerLanguage({ id: this.languageId }));
			this._register(languageConfigurationService.register(this.languageId, {}));
		}
	}

	const assertAutoTrigger = (model: TextModel, offset: number, expected: boolean, message?: string): void => {
		const pos = model.getPositionAt(offset);
		const editor = createMockEditor(model, new LanguageFeaturesService());
		editor.setPosition(pos);
		assert.strictEqual(LineContext.shouldAutoTrigger(editor), expected, message);
		editor.dispose();
	};

	let disposables: DisposableStore;

	setup(() => {
		disposables = new DisposableStore();
	});

	teardown(function () {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Context - shouldAutoTrigger', function () {
		const model = createTextModel('Das Pferd frisst keinen Gurkensalat - Philipp Reis 1861.\nWer hat\'s erfunden?');
		disposables.add(model);

		assertAutoTrigger(model, 3, true, 'end of word, Das|');
		assertAutoTrigger(model, 4, false, 'no word Das |');
		assertAutoTrigger(model, 1, true, 'typing a single character before a word: D|as');
		assertAutoTrigger(model, 55, false, 'number, 1861|');
		model.dispose();
	});

	test('shouldAutoTrigger at embedded language boundaries', () => {
		const disposables = new DisposableStore();
		const instantiationService = createModelServices(disposables);
		const outerMode = disposables.add(instantiationService.createInstance(OuterMode));
		disposables.add(instantiationService.createInstance(InnerMode));

		const model = disposables.add(instantiateTextModel(instantiationService, 'a<xx>a<x>', outerMode.languageId));

		assertAutoTrigger(model, 1, true, 'a|<x — should trigger at end of word');
		assertAutoTrigger(model, 2, false, 'a<|x — should NOT trigger at start of word');
		assertAutoTrigger(model, 3, true, 'a<x|x —  should trigger after typing a single character before a word');
		assertAutoTrigger(model, 4, true, 'a<xx|> — should trigger at boundary between languages');
		assertAutoTrigger(model, 5, false, 'a<xx>|a — should NOT trigger at start of word');
		assertAutoTrigger(model, 6, true, 'a<xx>a|< — should trigger at end of word');
		assertAutoTrigger(model, 8, true, 'a<xx>a<x|> — should trigger at end of word at boundary');

		disposables.dispose();
	});
});

suite('SuggestModel - TriggerAndCancelOracle', function () {


	function getDefaultSuggestRange(model: ITextModel, position: Position) {
		const wordUntil = model.getWordUntilPosition(position);
		return new Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
	}

	const alwaysEmptySupport: CompletionItemProvider = {
		_debugDisplayName: 'test',
		provideCompletionItems(doc, pos): CompletionList {
			return {
				incomplete: false,
				suggestions: []
			};
		}
	};

	const alwaysSomethingSupport: CompletionItemProvider = {
		_debugDisplayName: 'test',
		provideCompletionItems(doc, pos): CompletionList {
			return {
				incomplete: false,
				suggestions: [{
					label: doc.getWordUntilPosition(pos).word,
					kind: CompletionItemKind.Property,
					insertText: 'foofoo',
					range: getDefaultSuggestRange(doc, pos)
				}]
			};
		}
	};

	let disposables: DisposableStore;
	let model: TextModel;
	const languageFeaturesService = new LanguageFeaturesService();
	const registry = languageFeaturesService.completionProvider;

	setup(function () {
		disposables = new DisposableStore();
		model = createTextModel('abc def', undefined, undefined, URI.parse('test:somefile.ttt'));
		disposables.add(model);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function withOracle(callback: (model: SuggestModel, editor: ITestCodeEditor) => any): Promise<any> {

		return new Promise((resolve, reject) => {
			const editor = createMockEditor(model, languageFeaturesService);
			const oracle = editor.invokeWithinContext(accessor => accessor.get(IInstantiationService).createInstance(SuggestModel, editor));
			disposables.add(oracle);
			disposables.add(editor);

			try {
				resolve(callback(oracle, editor));
			} catch (err) {
				reject(err);
			}
		});
	}

	function assertEvent<E>(event: Event<E>, action: () => any, assert: (e: E) => any) {
		return new Promise((resolve, reject) => {
			const sub = event(e => {
				sub.dispose();
				try {
					resolve(assert(e));
				} catch (err) {
					reject(err);
				}
			});
			try {
				action();
			} catch (err) {
				sub.dispose();
				reject(err);
			}
		});
	}

	test('events - cancel/trigger', function () {
		return withOracle(model => {

			return Promise.all([

				assertEvent(model.onDidTrigger, function () {
					model.trigger({ auto: true });
				}, function (event) {
					assert.strictEqual(event.auto, true);

					return assertEvent(model.onDidCancel, function () {
						model.cancel();
					}, function (event) {
						assert.strictEqual(event.retrigger, false);
					});
				}),

				assertEvent(model.onDidTrigger, function () {
					model.trigger({ auto: true });
				}, function (event) {
					assert.strictEqual(event.auto, true);
				}),

				assertEvent(model.onDidTrigger, function () {
					model.trigger({ auto: false });
				}, function (event) {
					assert.strictEqual(event.auto, false);
				})
			]);
		});
	});


	test('events - suggest/empty', function () {

		disposables.add(registry.register({ scheme: 'test' }, alwaysEmptySupport));

		return withOracle(model => {
			return Promise.all([
				assertEvent(model.onDidCancel, function () {
					model.trigger({ auto: true });
				}, function (event) {
					assert.strictEqual(event.retrigger, false);
				}),
				assertEvent(model.onDidSuggest, function () {
					model.trigger({ auto: false });
				}, function (event) {
					assert.strictEqual(event.triggerOptions.auto, false);
					assert.strictEqual(event.isFrozen, false);
					assert.strictEqual(event.completionModel.items.length, 0);
				})
			]);
		});
	});

	test('trigger - on type', function () {

		disposables.add(registry.register({ scheme: 'test' }, alwaysSomethingSupport));

		return withOracle((model, editor) => {
			return assertEvent(model.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 4 });
				editor.trigger('keyboard', Handler.Type, { text: 'd' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;

				assert.strictEqual(first.provider, alwaysSomethingSupport);
			});
		});
	});

	test('#17400: Keep filtering suggestModel.ts after space', function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: false,
					suggestions: [{
						label: 'My Table',
						kind: CompletionItemKind.Property,
						insertText: 'My Table',
						range: getDefaultSuggestRange(doc, pos)
					}]
				};
			}
		}));

		model.setValue('');

		return withOracle((model, editor) => {

			return assertEvent(model.onDidSuggest, () => {
				// make sure completionModel starts here!
				model.trigger({ auto: true });
			}, event => {

				return assertEvent(model.onDidSuggest, () => {
					editor.setPosition({ lineNumber: 1, column: 1 });
					editor.trigger('keyboard', Handler.Type, { text: 'My' });

				}, event => {
					assert.strictEqual(event.triggerOptions.auto, true);
					assert.strictEqual(event.completionModel.items.length, 1);
					const [first] = event.completionModel.items;
					assert.strictEqual(first.completion.label, 'My Table');

					return assertEvent(model.onDidSuggest, () => {
						editor.setPosition({ lineNumber: 1, column: 3 });
						editor.trigger('keyboard', Handler.Type, { text: ' ' });

					}, event => {
						assert.strictEqual(event.triggerOptions.auto, true);
						assert.strictEqual(event.completionModel.items.length, 1);
						const [first] = event.completionModel.items;
						assert.strictEqual(first.completion.label, 'My Table');
					});
				});
			});
		});
	});

	test('#21484: Trigger character always force a new completion session', function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: false,
					suggestions: [{
						label: 'foo.bar',
						kind: CompletionItemKind.Property,
						insertText: 'foo.bar',
						range: Range.fromPositions(pos.with(undefined, 1), pos)
					}]
				};
			}
		}));

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['.'],
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: false,
					suggestions: [{
						label: 'boom',
						kind: CompletionItemKind.Property,
						insertText: 'boom',
						range: Range.fromPositions(
							pos.delta(0, doc.getLineContent(pos.lineNumber)[pos.column - 2] === '.' ? 0 : -1),
							pos
						)
					}]
				};
			}
		}));

		model.setValue('');

		return withOracle(async (model, editor) => {

			await assertEvent(model.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 1 });
				editor.trigger('keyboard', Handler.Type, { text: 'foo' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;
				assert.strictEqual(first.completion.label, 'foo.bar');

			});

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: '.' });

			}, event => {
				// SYNC
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;
				assert.strictEqual(first.completion.label, 'foo.bar');
			});

			await assertEvent(model.onDidSuggest, () => {
				// nothing -> triggered by the trigger character typing (see above)

			}, event => {
				// ASYNC
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
				const [first, second] = event.completionModel.items;
				assert.strictEqual(first.completion.label, 'foo.bar');
				assert.strictEqual(second.completion.label, 'boom');
			});
		});
	});

	test('Intellisense Completion doesn\'t respect space after equal sign (.html file), #29353 [1/2]', function () {

		disposables.add(registry.register({ scheme: 'test' }, alwaysSomethingSupport));

		return withOracle((model, editor) => {

			editor.getModel()!.setValue('fo');
			editor.setPosition({ lineNumber: 1, column: 3 });

			return assertEvent(model.onDidSuggest, () => {
				model.trigger({ auto: false });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, false);
				assert.strictEqual(event.isFrozen, false);
				assert.strictEqual(event.completionModel.items.length, 1);

				return assertEvent(model.onDidCancel, () => {
					editor.trigger('keyboard', Handler.Type, { text: '+' });
				}, event => {
					assert.strictEqual(event.retrigger, false);
				});
			});
		});
	});

	test('Intellisense Completion doesn\'t respect space after equal sign (.html file), #29353 [2/2]', function () {

		disposables.add(registry.register({ scheme: 'test' }, alwaysSomethingSupport));

		return withOracle((model, editor) => {

			editor.getModel()!.setValue('fo');
			editor.setPosition({ lineNumber: 1, column: 3 });

			return assertEvent(model.onDidSuggest, () => {
				model.trigger({ auto: false });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, false);
				assert.strictEqual(event.isFrozen, false);
				assert.strictEqual(event.completionModel.items.length, 1);

				return assertEvent(model.onDidCancel, () => {
					editor.trigger('keyboard', Handler.Type, { text: ' ' });
				}, event => {
					assert.strictEqual(event.retrigger, false);
				});
			});
		});
	});

	test('Incomplete suggestion results cause re-triggering when typing w/o further context, #28400 (1/2)', function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: true,
					suggestions: [{
						label: 'foo',
						kind: CompletionItemKind.Property,
						insertText: 'foo',
						range: Range.fromPositions(pos.with(undefined, 1), pos)
					}]
				};
			}
		}));

		return withOracle((model, editor) => {

			editor.getModel()!.setValue('foo');
			editor.setPosition({ lineNumber: 1, column: 4 });

			return assertEvent(model.onDidSuggest, () => {
				model.trigger({ auto: false });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, false);
				assert.strictEqual(event.completionModel.getIncompleteProvider().size, 1);
				assert.strictEqual(event.completionModel.items.length, 1);

				return assertEvent(model.onDidCancel, () => {
					editor.trigger('keyboard', Handler.Type, { text: ';' });
				}, event => {
					assert.strictEqual(event.retrigger, false);
				});
			});
		});
	});

	test('Incomplete suggestion results cause re-triggering when typing w/o further context, #28400 (2/2)', function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: true,
					suggestions: [{
						label: 'foo;',
						kind: CompletionItemKind.Property,
						insertText: 'foo',
						range: Range.fromPositions(pos.with(undefined, 1), pos)
					}]
				};
			}
		}));

		return withOracle((model, editor) => {

			editor.getModel()!.setValue('foo');
			editor.setPosition({ lineNumber: 1, column: 4 });

			return assertEvent(model.onDidSuggest, () => {
				model.trigger({ auto: false });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, false);
				assert.strictEqual(event.completionModel.getIncompleteProvider().size, 1);
				assert.strictEqual(event.completionModel.items.length, 1);

				return assertEvent(model.onDidSuggest, () => {
					// while we cancel incrementally enriching the set of
					// completions we still filter against those that we have
					// until now
					editor.trigger('keyboard', Handler.Type, { text: ';' });
				}, event => {
					assert.strictEqual(event.triggerOptions.auto, false);
					assert.strictEqual(event.completionModel.getIncompleteProvider().size, 1);
					assert.strictEqual(event.completionModel.items.length, 1);

				});
			});
		});
	});

	test('Trigger character is provided in suggest context', function () {
		let triggerCharacter = '';
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['.'],
			provideCompletionItems(doc, pos, context): CompletionList {
				assert.strictEqual(context.triggerKind, CompletionTriggerKind.TriggerCharacter);
				triggerCharacter = context.triggerCharacter!;
				return {
					incomplete: false,
					suggestions: [
						{
							label: 'foo.bar',
							kind: CompletionItemKind.Property,
							insertText: 'foo.bar',
							range: Range.fromPositions(pos.with(undefined, 1), pos)
						}
					]
				};
			}
		}));

		model.setValue('');

		return withOracle((model, editor) => {

			return assertEvent(model.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 1 });
				editor.trigger('keyboard', Handler.Type, { text: 'foo.' });
			}, event => {
				assert.strictEqual(triggerCharacter, '.');
			});
		});
	});

	test('Mac press and hold accent character insertion does not update suggestions, #35269', function () {
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: true,
					suggestions: [{
						label: 'abc',
						kind: CompletionItemKind.Property,
						insertText: 'abc',
						range: Range.fromPositions(pos.with(undefined, 1), pos)
					}, {
						label: 'äbc',
						kind: CompletionItemKind.Property,
						insertText: 'äbc',
						range: Range.fromPositions(pos.with(undefined, 1), pos)
					}]
				};
			}
		}));

		model.setValue('');
		return withOracle((model, editor) => {

			return assertEvent(model.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 1 });
				editor.trigger('keyboard', Handler.Type, { text: 'a' });
			}, event => {
				assert.strictEqual(event.completionModel.items.length, 1);
				assert.strictEqual(event.completionModel.items[0].completion.label, 'abc');

				return assertEvent(model.onDidSuggest, () => {
					editor.executeEdits('test', [EditOperation.replace(new Range(1, 1, 1, 2), 'ä')]);

				}, event => {
					// suggest model changed to äbc
					assert.strictEqual(event.completionModel.items.length, 1);
					assert.strictEqual(event.completionModel.items[0].completion.label, 'äbc');

				});
			});
		});
	});

	test('Backspace should not always cancel code completion, #36491', function () {
		disposables.add(registry.register({ scheme: 'test' }, alwaysSomethingSupport));

		return withOracle(async (model, editor) => {
			await assertEvent(model.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 4 });
				editor.trigger('keyboard', Handler.Type, { text: 'd' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;

				assert.strictEqual(first.provider, alwaysSomethingSupport);
			});

			await assertEvent(model.onDidSuggest, () => {
				editor.runCommand(CoreEditingCommands.DeleteLeft, null);

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;

				assert.strictEqual(first.provider, alwaysSomethingSupport);
			});
		});
	});

	test('Text changes for completion CodeAction are affected by the completion #39893', function () {
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos): CompletionList {
				return {
					incomplete: true,
					suggestions: [{
						label: 'bar',
						kind: CompletionItemKind.Property,
						insertText: 'bar',
						range: Range.fromPositions(pos.delta(0, -2), pos),
						additionalTextEdits: [{
							text: ', bar',
							range: { startLineNumber: 1, endLineNumber: 1, startColumn: 17, endColumn: 17 }
						}]
					}]
				};
			}
		}));

		model.setValue('ba; import { foo } from "./b"');

		return withOracle(async (sugget, editor) => {
			class TestCtrl extends SuggestController {
				_insertSuggestion_publicForTest(item: ISelectedSuggestion, flags: number = 0) {
					super._insertSuggestion(item, flags);
				}
			}
			const ctrl = <TestCtrl>editor.registerAndInstantiateContribution(TestCtrl.ID, TestCtrl);
			editor.registerAndInstantiateContribution(SnippetController2.ID, SnippetController2);

			await assertEvent(sugget.onDidSuggest, () => {
				editor.setPosition({ lineNumber: 1, column: 3 });
				sugget.trigger({ auto: false });
			}, event => {

				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;
				assert.strictEqual(first.completion.label, 'bar');

				ctrl._insertSuggestion_publicForTest({ item: first, index: 0, model: event.completionModel });
			});

			assert.strictEqual(
				model.getValue(),
				'bar; import { foo, bar } from "./b"'
			);
		});
	});

	test('Completion unexpectedly triggers on second keypress of an edit group in a snippet #43523', function () {

		disposables.add(registry.register({ scheme: 'test' }, alwaysSomethingSupport));

		return withOracle((model, editor) => {
			return assertEvent(model.onDidSuggest, () => {
				editor.setValue('d');
				editor.setSelection(new Selection(1, 1, 1, 2));
				editor.trigger('keyboard', Handler.Type, { text: 'e' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				const [first] = event.completionModel.items;

				assert.strictEqual(first.provider, alwaysSomethingSupport);
			});
		});
	});


	test('Fails to render completion details #47988', function () {

		let disposeA = 0;
		let disposeB = 0;

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					incomplete: true,
					suggestions: [{
						kind: CompletionItemKind.Folder,
						label: 'CompleteNot',
						insertText: 'Incomplete',
						sortText: 'a',
						range: getDefaultSuggestRange(doc, pos)
					}],
					dispose() { disposeA += 1; }
				};
			}
		}));
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					incomplete: false,
					suggestions: [{
						kind: CompletionItemKind.Folder,
						label: 'Complete',
						insertText: 'Complete',
						sortText: 'z',
						range: getDefaultSuggestRange(doc, pos)
					}],
					dispose() { disposeB += 1; }
				};
			},
			resolveCompletionItem(item) {
				return item;
			},
		}));

		return withOracle(async (model, editor) => {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('');
				editor.setSelection(new Selection(1, 1, 1, 1));
				editor.trigger('keyboard', Handler.Type, { text: 'c' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(disposeA, 0);
				assert.strictEqual(disposeB, 0);
			});

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: 'o' });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);

				// clean up
				model.clear();
				assert.strictEqual(disposeA, 2); // provide got called two times!
				assert.strictEqual(disposeB, 1);
			});

		});
	});


	test('Trigger (full) completions when (incomplete) completions are already active #99504', function () {

		let countA = 0;
		let countB = 0;

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				countA += 1;
				return {
					incomplete: false, // doesn't matter if incomplete or not
					suggestions: [{
						kind: CompletionItemKind.Class,
						label: 'Z aaa',
						insertText: 'Z aaa',
						range: new Range(1, 1, pos.lineNumber, pos.column)
					}],
				};
			}
		}));
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				countB += 1;
				if (!doc.getWordUntilPosition(pos).word.startsWith('a')) {
					return;
				}
				return {
					incomplete: false,
					suggestions: [{
						kind: CompletionItemKind.Folder,
						label: 'aaa',
						insertText: 'aaa',
						range: getDefaultSuggestRange(doc, pos)
					}],
				};
			},
		}));

		return withOracle(async (model, editor) => {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('');
				editor.setSelection(new Selection(1, 1, 1, 1));
				editor.trigger('keyboard', Handler.Type, { text: 'Z' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'Z aaa');
			});

			await assertEvent(model.onDidSuggest, () => {
				// started another word: Z a|
				// item should be: Z aaa, aaa
				editor.trigger('keyboard', Handler.Type, { text: ' a' });
			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'Z aaa');
				assert.strictEqual(event.completionModel.items[1].textLabel, 'aaa');

				assert.strictEqual(countA, 1); // should we keep the suggestions from the "active" provider?, Yes! See: #106573
				assert.strictEqual(countB, 2);
			});
		});
	});

	test('registerCompletionItemProvider with letters as trigger characters block other completion items to show up #127815', async function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Class,
						label: 'AAAA',
						insertText: 'WordTriggerA',
						range: new Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column)
					}],
				};
			}
		}));
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['a', '.'],
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Class,
						label: 'AAAA',
						insertText: 'AutoTriggerA',
						range: new Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column)
					}],
				};
			},
		}));

		return withOracle(async (model, editor) => {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('');
				editor.setSelection(new Selection(1, 1, 1, 1));
				editor.trigger('keyboard', Handler.Type, { text: '.' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
			});


			editor.getModel().setValue('');

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('');
				editor.setSelection(new Selection(1, 1, 1, 1));
				editor.trigger('keyboard', Handler.Type, { text: 'a' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
			});
		});
	});

	test('Unexpected suggest scoring #167242', async function () {
		disposables.add(registry.register('*', {
			// word-based
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				const word = doc.getWordUntilPosition(pos);
				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'pull',
						insertText: 'pull',
						range: new Range(pos.lineNumber, word.startColumn, pos.lineNumber, word.endColumn)
					}],
				};
			}
		}));
		disposables.add(registry.register({ scheme: 'test' }, {
			// JSON-based
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos) {
				return {
					suggestions: [{
						kind: CompletionItemKind.Class,
						label: 'git.pull',
						insertText: 'git.pull',
						range: new Range(pos.lineNumber, 1, pos.lineNumber, pos.column)
					}],
				};
			},
		}));

		return withOracle(async function (model, editor) {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('gi');
				editor.setSelection(new Selection(1, 3, 1, 3));
				editor.trigger('keyboard', Handler.Type, { text: 't' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'git.pull');
			});

			editor.trigger('keyboard', Handler.Type, { text: '.' });

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: 'p' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 1);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'git.pull');
			});
		});
	});

	test('Completion list closes unexpectedly when typing a digit after a word separator #169390', function () {

		const requestCounts = [0, 0];

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',

			provideCompletionItems(doc, pos) {
				requestCounts[0] += 1;
				return {
					suggestions: [{
						kind: CompletionItemKind.Text,
						label: 'foo-20',
						insertText: 'foo-20',
						range: new Range(pos.lineNumber, 1, pos.lineNumber, pos.column)
					}, {
						kind: CompletionItemKind.Text,
						label: 'foo-hello',
						insertText: 'foo-hello',
						range: new Range(pos.lineNumber, 1, pos.lineNumber, pos.column)
					}],
				};
			}
		}));
		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['2'],
			provideCompletionItems(doc, pos, ctx) {
				requestCounts[1] += 1;
				if (ctx.triggerKind !== CompletionTriggerKind.TriggerCharacter) {
					return;
				}
				return {
					suggestions: [{
						kind: CompletionItemKind.Class,
						label: 'foo-210',
						insertText: 'foo-210',
						range: new Range(pos.lineNumber, 1, pos.lineNumber, pos.column)
					}],
				};
			},
		}));

		return withOracle(async function (model, editor) {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('foo');
				editor.setSelection(new Selection(1, 4, 1, 4));
				model.trigger({ auto: false });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, false);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'foo-20');
				assert.strictEqual(event.completionModel.items[1].textLabel, 'foo-hello');
			});

			editor.trigger('keyboard', Handler.Type, { text: '-' });


			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: '2' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'foo-20');
				assert.strictEqual(event.completionModel.items[1].textLabel, 'foo-210');
				assert.deepStrictEqual(requestCounts, [1, 2]);
			});
		});
	});

	test('Set refilter-flag, keep triggerKind', function () {

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['.'],
			provideCompletionItems(doc, pos, ctx) {
				return {
					suggestions: [{
						label: doc.getWordUntilPosition(pos).word || 'hello',
						kind: CompletionItemKind.Property,
						insertText: 'foofoo',
						range: getDefaultSuggestRange(doc, pos)
					}]
				};
			},
		}));

		return withOracle(async function (model, editor) {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('foo');
				editor.setSelection(new Selection(1, 4, 1, 4));
				editor.trigger('keyboard', Handler.Type, { text: 'o' });


			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.triggerOptions.triggerCharacter, undefined);
				assert.strictEqual(event.triggerOptions.triggerKind, undefined);
				assert.strictEqual(event.completionModel.items.length, 1);
			});

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: '.' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.triggerOptions.refilter, undefined);
				assert.strictEqual(event.triggerOptions.triggerCharacter, '.');
				assert.strictEqual(event.triggerOptions.triggerKind, CompletionTriggerKind.TriggerCharacter);
				assert.strictEqual(event.completionModel.items.length, 1);
			});

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: 'h' });

			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.triggerOptions.refilter, true);
				assert.strictEqual(event.triggerOptions.triggerCharacter, '.');
				assert.strictEqual(event.triggerOptions.triggerKind, CompletionTriggerKind.TriggerCharacter);
				assert.strictEqual(event.completionModel.items.length, 1);
			});
		});
	});

	test('Snippets gone from IntelliSense #173244', function () {

		const snippetProvider: CompletionItemProvider = {
			_debugDisplayName: 'test',
			provideCompletionItems(doc, pos, ctx) {
				return {
					suggestions: [{
						label: 'log',
						kind: CompletionItemKind.Snippet,
						insertText: 'log',
						range: getDefaultSuggestRange(doc, pos)
					}]
				};
			}
		};
		const old = setSnippetSuggestSupport(snippetProvider);

		disposables.add(toDisposable(() => {
			if (getSnippetSuggestSupport() === snippetProvider) {
				setSnippetSuggestSupport(old);
			}
		}));

		disposables.add(registry.register({ scheme: 'test' }, {
			_debugDisplayName: 'test',
			triggerCharacters: ['.'],
			provideCompletionItems(doc, pos, ctx) {
				return {
					suggestions: [{
						label: 'locals',
						kind: CompletionItemKind.Property,
						insertText: 'locals',
						range: getDefaultSuggestRange(doc, pos)
					}],
					incomplete: true
				};
			},
		}));

		return withOracle(async function (model, editor) {

			await assertEvent(model.onDidSuggest, () => {
				editor.setValue('');
				editor.setSelection(new Selection(1, 1, 1, 1));
				editor.trigger('keyboard', Handler.Type, { text: 'l' });


			}, event => {
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.triggerOptions.triggerCharacter, undefined);
				assert.strictEqual(event.triggerOptions.triggerKind, undefined);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'locals');
				assert.strictEqual(event.completionModel.items[1].textLabel, 'log');
			});

			await assertEvent(model.onDidSuggest, () => {
				editor.trigger('keyboard', Handler.Type, { text: 'o' });

			}, event => {
				assert.strictEqual(event.triggerOptions.triggerKind, CompletionTriggerKind.TriggerForIncompleteCompletions);
				assert.strictEqual(event.triggerOptions.auto, true);
				assert.strictEqual(event.completionModel.items.length, 2);
				assert.strictEqual(event.completionModel.items[0].textLabel, 'locals');
				assert.strictEqual(event.completionModel.items[1].textLabel, 'log');
			});

		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/suggest/test/browser/wordDistance.test.ts]---
Location: vscode-main/src/vs/editor/contrib/suggest/test/browser/wordDistance.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { IPosition } from '../../../../common/core/position.js';
import { IRange } from '../../../../common/core/range.js';
import { DEFAULT_WORD_REGEXP } from '../../../../common/core/wordHelper.js';
import * as languages from '../../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { EditorWorker } from '../../../../common/services/editorWebWorker.js';
import { EditorWorkerService } from '../../../../browser/services/editorWorkerService.js';
import { IModelService } from '../../../../common/services/model.js';
import { ITextResourceConfigurationService } from '../../../../common/services/textResourceConfiguration.js';
import { CompletionItem } from '../../browser/suggest.js';
import { WordDistance } from '../../browser/wordDistance.js';
import { createCodeEditorServices, instantiateTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { instantiateTextModel } from '../../../../test/common/testTextModel.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { LanguageFeaturesService } from '../../../../common/services/languageFeaturesService.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('suggest, word distance', function () {

	let distance: WordDistance;
	const disposables = new DisposableStore();

	setup(async function () {
		const languageId = 'bracketMode';

		disposables.clear();
		const instantiationService = createCodeEditorServices(disposables);
		const languageConfigurationService = instantiationService.get(ILanguageConfigurationService);
		const languageService = instantiationService.get(ILanguageService);
		disposables.add(languageService.registerLanguage({ id: languageId }));
		disposables.add(languageConfigurationService.register(languageId, {
			brackets: [
				['{', '}'],
				['[', ']'],
				['(', ')'],
			]
		}));

		const model = disposables.add(instantiateTextModel(instantiationService, 'function abc(aa, ab){\na\n}', languageId, undefined, URI.parse('test:///some.path')));
		const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model));
		editor.updateOptions({ suggest: { localityBonus: true } });
		editor.setPosition({ lineNumber: 2, column: 2 });

		const modelService = new class extends mock<IModelService>() {
			override onModelRemoved = Event.None;
			override getModel(uri: URI) {
				return uri.toString() === model.uri.toString() ? model : null;
			}
		};

		const service = new class extends EditorWorkerService {

			private _worker = new EditorWorker();

			constructor() {
				super(modelService, new class extends mock<ITextResourceConfigurationService>() { }, new NullLogService(), new TestLanguageConfigurationService(), new LanguageFeaturesService(), null!);
				this._worker.$acceptNewModel({
					url: model.uri.toString(),
					lines: model.getLinesContent(),
					EOL: model.getEOL(),
					versionId: model.getVersionId()
				});
				model.onDidChangeContent(e => this._worker.$acceptModelChanged(model.uri.toString(), e));
			}
			override computeWordRanges(resource: URI, range: IRange): Promise<{ [word: string]: IRange[] } | null> {
				return this._worker.$computeWordRanges(resource.toString(), range, DEFAULT_WORD_REGEXP.source, DEFAULT_WORD_REGEXP.flags);
			}
		};

		distance = await WordDistance.create(service, editor);

		disposables.add(service);
	});

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function createSuggestItem(label: string, overwriteBefore: number, position: IPosition): CompletionItem {
		const suggestion: languages.CompletionItem = {
			label,
			range: { startLineNumber: position.lineNumber, startColumn: position.column - overwriteBefore, endLineNumber: position.lineNumber, endColumn: position.column },
			insertText: label,
			kind: 0
		};
		const container: languages.CompletionList = {
			suggestions: [suggestion]
		};
		const provider: languages.CompletionItemProvider = {
			_debugDisplayName: 'test',
			provideCompletionItems(): any {
				return;
			}
		};
		return new CompletionItem(position, suggestion, container, provider);
	}

	test('Suggest locality bonus can boost current word #90515', function () {
		const pos = { lineNumber: 2, column: 2 };
		const d1 = distance.distance(pos, createSuggestItem('a', 1, pos).completion);
		const d2 = distance.distance(pos, createSuggestItem('aa', 1, pos).completion);
		const d3 = distance.distance(pos, createSuggestItem('ab', 1, pos).completion);

		assert.ok(d1 > d2);
		assert.ok(d2 === d3);
	});
});
```

--------------------------------------------------------------------------------

````

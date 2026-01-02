---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 169
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 169 of 552)

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

---[FILE: src/vs/base/browser/ui/scrollbar/verticalScrollbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/verticalScrollbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StandardWheelEvent } from '../../mouseEvent.js';
import { AbstractScrollbar, ISimplifiedPointerEvent, ScrollbarHost } from './abstractScrollbar.js';
import { ScrollableElementResolvedOptions } from './scrollableElementOptions.js';
import { ARROW_IMG_SIZE } from './scrollbarArrow.js';
import { ScrollbarState } from './scrollbarState.js';
import { Codicon } from '../../../common/codicons.js';
import { INewScrollPosition, Scrollable, ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';



export class VerticalScrollbar extends AbstractScrollbar {

	constructor(scrollable: Scrollable, options: ScrollableElementResolvedOptions, host: ScrollbarHost) {
		const scrollDimensions = scrollable.getScrollDimensions();
		const scrollPosition = scrollable.getCurrentScrollPosition();
		super({
			lazyRender: options.lazyRender,
			host: host,
			scrollbarState: new ScrollbarState(
				(options.verticalHasArrows ? options.arrowSize : 0),
				(options.vertical === ScrollbarVisibility.Hidden ? 0 : options.verticalScrollbarSize),
				// give priority to vertical scroll bar over horizontal and let it scroll all the way to the bottom
				0,
				scrollDimensions.height,
				scrollDimensions.scrollHeight,
				scrollPosition.scrollTop
			),
			visibility: options.vertical,
			extraScrollbarClassName: 'vertical',
			scrollable: scrollable,
			scrollByPage: options.scrollByPage
		});

		if (options.verticalHasArrows) {
			const arrowDelta = (options.arrowSize - ARROW_IMG_SIZE) / 2;
			const scrollbarDelta = (options.verticalScrollbarSize - ARROW_IMG_SIZE) / 2;

			this._createArrow({
				className: 'scra',
				icon: Codicon.scrollbarButtonUp,
				top: arrowDelta,
				left: scrollbarDelta,
				bottom: undefined,
				right: undefined,
				bgWidth: options.verticalScrollbarSize,
				bgHeight: options.arrowSize,
				onActivate: () => this._host.onMouseWheel(new StandardWheelEvent(null, 0, 1)),
			});

			this._createArrow({
				className: 'scra',
				icon: Codicon.scrollbarButtonDown,
				top: undefined,
				left: scrollbarDelta,
				bottom: arrowDelta,
				right: undefined,
				bgWidth: options.verticalScrollbarSize,
				bgHeight: options.arrowSize,
				onActivate: () => this._host.onMouseWheel(new StandardWheelEvent(null, 0, -1)),
			});
		}

		this._createSlider(0, Math.floor((options.verticalScrollbarSize - options.verticalSliderSize) / 2), options.verticalSliderSize, undefined);
	}

	protected _updateSlider(sliderSize: number, sliderPosition: number): void {
		this.slider.setHeight(sliderSize);
		this.slider.setTop(sliderPosition);
	}

	protected _renderDomNode(largeSize: number, smallSize: number): void {
		this.domNode.setWidth(smallSize);
		this.domNode.setHeight(largeSize);
		this.domNode.setRight(0);
		this.domNode.setTop(0);
	}

	public onDidScroll(e: ScrollEvent): boolean {
		this._shouldRender = this._onElementScrollSize(e.scrollHeight) || this._shouldRender;
		this._shouldRender = this._onElementScrollPosition(e.scrollTop) || this._shouldRender;
		this._shouldRender = this._onElementSize(e.height) || this._shouldRender;
		return this._shouldRender;
	}

	protected _pointerDownRelativePosition(offsetX: number, offsetY: number): number {
		return offsetY;
	}

	protected _sliderPointerPosition(e: ISimplifiedPointerEvent): number {
		return e.pageY;
	}

	protected _sliderOrthogonalPointerPosition(e: ISimplifiedPointerEvent): number {
		return e.pageX;
	}

	protected _updateScrollbarSize(size: number): void {
		this.slider.setWidth(size);
	}

	public writeScrollPosition(target: INewScrollPosition, scrollPosition: number): void {
		target.scrollTop = scrollPosition;
	}

	public updateOptions(options: ScrollableElementResolvedOptions): void {
		this.updateScrollbarSize(options.vertical === ScrollbarVisibility.Hidden ? 0 : options.verticalScrollbarSize);
		// give priority to vertical scroll bar over horizontal and let it scroll all the way to the bottom
		this._scrollbarState.setOppositeScrollbarSize(0);
		this._visibilityController.setVisibility(options.vertical);
		this._scrollByPage = options.scrollByPage;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/media/scrollbars.css]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/media/scrollbars.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Arrows */
.monaco-scrollable-element > .scrollbar > .scra {
	cursor: pointer;
	font-size: 11px !important;
}

.monaco-scrollable-element > .visible {
	opacity: 1;

	/* Background rule added for IE9 - to allow clicks on dom node */
	background:rgba(0,0,0,0);

	transition: opacity 100ms linear;
	/* In front of peek view */
	z-index: 11;
}
.monaco-scrollable-element > .invisible {
	opacity: 0;
	pointer-events: none;
}
.monaco-scrollable-element > .invisible.fade {
	transition: opacity 800ms linear;
}

/* Scrollable Content Inset Shadow */
.monaco-scrollable-element > .shadow {
	position: absolute;
	display: none;
}
.monaco-scrollable-element > .shadow.top {
	display: block;
	top: 0;
	left: 3px;
	height: 3px;
	width: 100%;
	box-shadow: var(--vscode-scrollbar-shadow) 0 6px 6px -6px inset;
}
.monaco-scrollable-element > .shadow.left {
	display: block;
	top: 3px;
	left: 0;
	height: 100%;
	width: 3px;
	box-shadow: var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset;
}
.monaco-scrollable-element > .shadow.top-left-corner {
	display: block;
	top: 0;
	left: 0;
	height: 3px;
	width: 3px;
}
.monaco-scrollable-element > .shadow.top.left {
	box-shadow: var(--vscode-scrollbar-shadow) 6px 0 6px -6px inset;
}

.monaco-scrollable-element > .scrollbar {
	background: var(--vscode-scrollbar-background);
}

.monaco-scrollable-element > .scrollbar > .slider {
	background: var(--vscode-scrollbarSlider-background);
}

.monaco-scrollable-element > .scrollbar > .slider:hover {
	background: var(--vscode-scrollbarSlider-hoverBackground);
}

.monaco-scrollable-element > .scrollbar > .slider.active {
	background: var(--vscode-scrollbarSlider-activeBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/selectBox/selectBox.css]---
Location: vscode-main/src/vs/base/browser/ui/selectBox/selectBox.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-select-box {
	width: 100%;
	cursor: pointer;
	border-radius: 2px;
}

.monaco-select-box-dropdown-container {
	font-size: 13px;
	font-weight: normal;
	text-transform: none;
}

/** Actions */

.monaco-action-bar .action-item.select-container {
	cursor: default;
}

.monaco-action-bar .action-item .monaco-select-box {
	cursor: pointer;
	min-width: 100px;
	min-height: 18px;
	padding: 2px 23px 2px 8px;
}

.mac .monaco-action-bar .action-item .monaco-select-box {
	font-size: 11px;
	border-radius: 3px;
	min-height: 24px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/selectBox/selectBox.ts]---
Location: vscode-main/src/vs/base/browser/ui/selectBox/selectBox.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../common/event.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import { MarkdownActionHandler } from '../../markdownRenderer.js';
import { IContextViewProvider } from '../contextview/contextview.js';
import { IListStyles, unthemedListStyles } from '../list/listWidget.js';
import { Widget } from '../widget.js';
import './selectBox.css';
import { SelectBoxList } from './selectBoxCustom.js';
import { SelectBoxNative } from './selectBoxNative.js';



// Public SelectBox interface - Calls routed to appropriate select implementation class

export interface ISelectBoxDelegate extends IDisposable {

	// Public SelectBox Interface
	readonly onDidSelect: Event<ISelectData>;
	setOptions(options: ISelectOptionItem[], selected?: number): void;
	select(index: number): void;
	setAriaLabel(label: string): void;
	focus(): void;
	blur(): void;
	setFocusable(focus: boolean): void;
	setEnabled(enabled: boolean): void;

	// Delegated Widget interface
	render(container: HTMLElement): void;
}

export interface ISelectBoxOptions {
	useCustomDrawn?: boolean;
	ariaLabel?: string;
	ariaDescription?: string;
	minBottomMargin?: number;
	optionsAsChildren?: boolean;
}

// Utilize optionItem interface to capture all option parameters
export interface ISelectOptionItem {
	text: string;
	detail?: string;
	decoratorRight?: string;
	description?: string;
	descriptionIsMarkdown?: boolean;
	readonly descriptionMarkdownActionHandler?: MarkdownActionHandler;
	isDisabled?: boolean;
}

export const SeparatorSelectOption: Readonly<ISelectOptionItem> = Object.freeze({
	text: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
	isDisabled: true,
});

export interface ISelectBoxStyles extends IListStyles {
	readonly selectBackground: string | undefined;
	readonly selectListBackground: string | undefined;
	readonly selectForeground: string | undefined;
	readonly decoratorRightForeground: string | undefined;
	readonly selectBorder: string | undefined;
	readonly selectListBorder: string | undefined;
	readonly focusBorder: string | undefined;
}

export const unthemedSelectBoxStyles: ISelectBoxStyles = {
	...unthemedListStyles,
	selectBackground: '#3C3C3C',
	selectForeground: '#F0F0F0',
	selectBorder: '#3C3C3C',
	decoratorRightForeground: undefined,
	selectListBackground: undefined,
	selectListBorder: undefined,
	focusBorder: undefined,
};

export interface ISelectData {
	selected: string;
	index: number;
}

export class SelectBox extends Widget implements ISelectBoxDelegate {
	private selectBoxDelegate: ISelectBoxDelegate;

	constructor(options: ISelectOptionItem[], selected: number, contextViewProvider: IContextViewProvider, styles: ISelectBoxStyles, selectBoxOptions?: ISelectBoxOptions) {
		super();

		// Default to native SelectBox for OSX unless overridden
		if (isMacintosh && !selectBoxOptions?.useCustomDrawn) {
			this.selectBoxDelegate = new SelectBoxNative(options, selected, styles, selectBoxOptions);
		} else {
			this.selectBoxDelegate = new SelectBoxList(options, selected, contextViewProvider, styles, selectBoxOptions);
		}

		this._register(this.selectBoxDelegate);
	}

	// Public SelectBox Methods - routed through delegate interface

	get onDidSelect(): Event<ISelectData> {
		return this.selectBoxDelegate.onDidSelect;
	}

	setOptions(options: ISelectOptionItem[], selected?: number): void {
		this.selectBoxDelegate.setOptions(options, selected);
	}

	select(index: number): void {
		this.selectBoxDelegate.select(index);
	}

	setAriaLabel(label: string): void {
		this.selectBoxDelegate.setAriaLabel(label);
	}

	focus(): void {
		this.selectBoxDelegate.focus();
	}

	blur(): void {
		this.selectBoxDelegate.blur();
	}

	setFocusable(focusable: boolean): void {
		this.selectBoxDelegate.setFocusable(focusable);
	}

	setEnabled(enabled: boolean): void {
		this.selectBoxDelegate.setEnabled(enabled);
	}

	render(container: HTMLElement): void {
		this.selectBoxDelegate.render(container);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/selectBox/selectBoxCustom.css]---
Location: vscode-main/src/vs/base/browser/ui/selectBox/selectBoxCustom.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-select-box-dropdown-container {
	display: none;
	box-sizing: border-box;
	border-radius: 5px;
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown * {
	margin: 0;
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown a:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

.monaco-select-box-dropdown-container > .select-box-details-pane > .select-box-description-markdown code {
	line-height: 15px; /** For some reason, this is needed, otherwise <code> will take up 20px height */
	font-family: var(--monaco-monospace-font);
}


.monaco-select-box-dropdown-container.visible {
	display: flex;
	flex-direction: column;
	text-align: left;
	width: 1px;
	overflow: hidden;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container {
	flex: 0 0 auto;
	align-self: flex-start;
	width: 100%;
	overflow: hidden;
	box-sizing: border-box;
}

.monaco-select-box-dropdown-container > .select-box-details-pane {
	padding: 5px 6px;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row {
	cursor: pointer;
	padding-left: 2px;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row > .option-text {
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 3.5px;
	white-space: nowrap;
	float: left;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row > .option-detail {
	text-overflow: ellipsis;
	overflow: hidden;
	padding-left: 3.5px;
	white-space: nowrap;
	float: left;
	opacity: 0.7;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row > .option-decorator-right {
	text-overflow: ellipsis;
	overflow: hidden;
	padding-right: 10px;
	white-space: nowrap;
	float: right;
}


/* Accepted CSS hiding technique for accessibility reader text  */
/* https://webaim.org/techniques/css/invisiblecontent/ */

.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row > .visually-hidden {
	position: absolute;
	left: -10000px;
	top: auto;
	width: 1px;
	height: 1px;
	overflow: hidden;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-container-width-control {
	flex: 1 1 auto;
	align-self: flex-start;
	opacity: 0;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-container-width-control > .width-control-div {
	overflow: hidden;
	max-height: 0px;
}

.monaco-select-box-dropdown-container > .select-box-dropdown-container-width-control > .width-control-div > .option-text-width-control {
	padding-left: 4px;
	padding-right: 8px;
	white-space: nowrap;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/selectBox/selectBoxCustom.ts]---
Location: vscode-main/src/vs/base/browser/ui/selectBox/selectBoxCustom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import * as arrays from '../../../common/arrays.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode, KeyCodeUtils } from '../../../common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import * as cssJs from '../../cssValue.js';
import * as dom from '../../dom.js';
import * as domStylesheetsJs from '../../domStylesheets.js';
import { DomEmitter } from '../../event.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { IRenderedMarkdown, MarkdownActionHandler, renderMarkdown } from '../../markdownRenderer.js';
import { AnchorPosition, IContextViewProvider } from '../contextview/contextview.js';
import type { IManagedHover } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IListEvent, IListRenderer, IListVirtualDelegate } from '../list/list.js';
import { List } from '../list/listWidget.js';
import { ISelectBoxDelegate, ISelectBoxOptions, ISelectBoxStyles, ISelectData, ISelectOptionItem } from './selectBox.js';
import './selectBoxCustom.css';


const $ = dom.$;

const SELECT_OPTION_ENTRY_TEMPLATE_ID = 'selectOption.entry.template';

interface ISelectListTemplateData {
	root: HTMLElement;
	text: HTMLElement;
	detail: HTMLElement;
	decoratorRight: HTMLElement;
}

class SelectListRenderer implements IListRenderer<ISelectOptionItem, ISelectListTemplateData> {

	get templateId(): string { return SELECT_OPTION_ENTRY_TEMPLATE_ID; }

	renderTemplate(container: HTMLElement): ISelectListTemplateData {
		const data: ISelectListTemplateData = Object.create(null);
		data.root = container;
		data.text = dom.append(container, $('.option-text'));
		data.detail = dom.append(container, $('.option-detail'));
		data.decoratorRight = dom.append(container, $('.option-decorator-right'));

		return data;
	}

	renderElement(element: ISelectOptionItem, index: number, templateData: ISelectListTemplateData): void {
		const data: ISelectListTemplateData = templateData;

		const text = element.text;
		const detail = element.detail;
		const decoratorRight = element.decoratorRight;

		const isDisabled = element.isDisabled;

		data.text.textContent = text;
		data.detail.textContent = !!detail ? detail : '';
		data.decoratorRight.textContent = !!decoratorRight ? decoratorRight : '';

		// pseudo-select disabled option
		if (isDisabled) {
			data.root.classList.add('option-disabled');
		} else {
			// Make sure we do class removal from prior template rendering
			data.root.classList.remove('option-disabled');
		}
	}

	disposeTemplate(_templateData: ISelectListTemplateData): void {
		// noop
	}
}

export class SelectBoxList extends Disposable implements ISelectBoxDelegate, IListVirtualDelegate<ISelectOptionItem> {

	private static readonly DEFAULT_DROPDOWN_MINIMUM_BOTTOM_MARGIN = 32;
	private static readonly DEFAULT_DROPDOWN_MINIMUM_TOP_MARGIN = 2;
	private static readonly DEFAULT_MINIMUM_VISIBLE_OPTIONS = 3;

	private _isVisible: boolean;
	private selectBoxOptions: ISelectBoxOptions;
	private selectElement: HTMLSelectElement;
	private container?: HTMLElement;
	private options: ISelectOptionItem[] = [];
	private selected: number;
	private readonly _onDidSelect: Emitter<ISelectData>;
	private readonly styles: ISelectBoxStyles;
	private listRenderer!: SelectListRenderer;
	private contextViewProvider!: IContextViewProvider;
	private selectDropDownContainer!: HTMLElement;
	private styleElement!: HTMLStyleElement;
	private selectList!: List<ISelectOptionItem>;
	private selectDropDownListContainer!: HTMLElement;
	private widthControlElement!: HTMLElement;
	private _currentSelection = 0;
	private _dropDownPosition!: AnchorPosition;
	private _hasDetails: boolean = false;
	private selectionDetailsPane!: HTMLElement;
	private readonly _selectionDetailsDisposables = this._register(new DisposableStore());
	private _skipLayout: boolean = false;
	private _cachedMaxDetailsHeight?: number;
	private _hover?: IManagedHover;

	private _sticky: boolean = false; // for dev purposes only

	constructor(options: ISelectOptionItem[], selected: number, contextViewProvider: IContextViewProvider, styles: ISelectBoxStyles, selectBoxOptions?: ISelectBoxOptions) {

		super();
		this._isVisible = false;
		this.styles = styles;

		this.selectBoxOptions = selectBoxOptions || Object.create(null);

		if (typeof this.selectBoxOptions.minBottomMargin !== 'number') {
			this.selectBoxOptions.minBottomMargin = SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_BOTTOM_MARGIN;
		} else if (this.selectBoxOptions.minBottomMargin < 0) {
			this.selectBoxOptions.minBottomMargin = 0;
		}

		this.selectElement = document.createElement('select');
		this.selectElement.className = 'monaco-select-box';

		if (typeof this.selectBoxOptions.ariaLabel === 'string') {
			this.selectElement.setAttribute('aria-label', this.selectBoxOptions.ariaLabel);
		}

		if (typeof this.selectBoxOptions.ariaDescription === 'string') {
			this.selectElement.setAttribute('aria-description', this.selectBoxOptions.ariaDescription);
		}

		this._onDidSelect = new Emitter<ISelectData>();
		this._register(this._onDidSelect);

		this.registerListeners();
		this.constructSelectDropDown(contextViewProvider);

		this.selected = selected || 0;

		if (options) {
			this.setOptions(options, selected);
		}

		this.initStyleSheet();

	}

	private setTitle(title: string): void {
		if (!this._hover && title) {
			this._hover = this._register(getBaseLayerHoverDelegate().setupManagedHover(getDefaultHoverDelegate('mouse'), this.selectElement, title));
		} else if (this._hover) {
			this._hover.update(title);
		}
	}

	// IDelegate - List renderer

	getHeight(): number {
		return 22;
	}

	getTemplateId(): string {
		return SELECT_OPTION_ENTRY_TEMPLATE_ID;
	}

	private constructSelectDropDown(contextViewProvider: IContextViewProvider) {

		// SetUp ContextView container to hold select Dropdown
		this.contextViewProvider = contextViewProvider;
		this.selectDropDownContainer = dom.$('.monaco-select-box-dropdown-container');

		// Setup container for select option details
		this.selectionDetailsPane = dom.append(this.selectDropDownContainer, $('.select-box-details-pane'));

		// Create span flex box item/div we can measure and control
		const widthControlOuterDiv = dom.append(this.selectDropDownContainer, $('.select-box-dropdown-container-width-control'));
		const widthControlInnerDiv = dom.append(widthControlOuterDiv, $('.width-control-div'));
		this.widthControlElement = document.createElement('span');
		this.widthControlElement.className = 'option-text-width-control';
		dom.append(widthControlInnerDiv, this.widthControlElement);

		// Always default to below position
		this._dropDownPosition = AnchorPosition.BELOW;

		// Inline stylesheet for themes
		this.styleElement = domStylesheetsJs.createStyleSheet(this.selectDropDownContainer);

		// Prevent dragging of dropdown #114329
		this.selectDropDownContainer.setAttribute('draggable', 'true');
		this._register(dom.addDisposableListener(this.selectDropDownContainer, dom.EventType.DRAG_START, (e) => {
			dom.EventHelper.stop(e, true);
		}));
	}

	private registerListeners() {

		// Parent native select keyboard listeners

		this._register(dom.addStandardDisposableListener(this.selectElement, 'change', (e) => {
			this.selected = e.target.selectedIndex;
			this._onDidSelect.fire({
				index: e.target.selectedIndex,
				selected: e.target.value
			});
			if (!!this.options[this.selected] && !!this.options[this.selected].text) {
				this.setTitle(this.options[this.selected].text);
			}
		}));

		// Have to implement both keyboard and mouse controllers to handle disabled options
		// Intercept mouse events to override normal select actions on parents

		this._register(dom.addDisposableListener(this.selectElement, dom.EventType.CLICK, (e) => {
			dom.EventHelper.stop(e);

			if (this._isVisible) {
				this.hideSelectDropDown(true);
			} else {
				this.showSelectDropDown();
			}
		}));

		this._register(dom.addDisposableListener(this.selectElement, dom.EventType.MOUSE_DOWN, (e) => {
			dom.EventHelper.stop(e);
		}));

		// Intercept touch events
		// The following implementation is slightly different from the mouse event handlers above.
		// Use the following helper variable, otherwise the list flickers.
		let listIsVisibleOnTouchStart: boolean;
		this._register(dom.addDisposableListener(this.selectElement, 'touchstart', (e) => {
			listIsVisibleOnTouchStart = this._isVisible;
		}));
		this._register(dom.addDisposableListener(this.selectElement, 'touchend', (e) => {
			dom.EventHelper.stop(e);

			if (listIsVisibleOnTouchStart) {
				this.hideSelectDropDown(true);
			} else {
				this.showSelectDropDown();
			}
		}));

		// Intercept keyboard handling

		this._register(dom.addDisposableListener(this.selectElement, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			let showDropDown = false;

			// Create and drop down select list on keyboard select
			if (isMacintosh) {
				if (event.keyCode === KeyCode.DownArrow || event.keyCode === KeyCode.UpArrow || event.keyCode === KeyCode.Space || event.keyCode === KeyCode.Enter) {
					showDropDown = true;
				}
			} else {
				if (event.keyCode === KeyCode.DownArrow && event.altKey || event.keyCode === KeyCode.UpArrow && event.altKey || event.keyCode === KeyCode.Space || event.keyCode === KeyCode.Enter) {
					showDropDown = true;
				}
			}

			if (showDropDown) {
				this.showSelectDropDown();
				dom.EventHelper.stop(e, true);
			}
		}));
	}

	public get onDidSelect(): Event<ISelectData> {
		return this._onDidSelect.event;
	}

	public setOptions(options: ISelectOptionItem[], selected?: number): void {
		if (!arrays.equals(this.options, options)) {
			this.options = options;
			this.selectElement.options.length = 0;
			this._hasDetails = false;
			this._cachedMaxDetailsHeight = undefined;

			this.options.forEach((option, index) => {
				this.selectElement.add(this.createOption(option.text, index, option.isDisabled));
				if (typeof option.description === 'string') {
					this._hasDetails = true;
				}
			});
		}

		if (selected !== undefined) {
			this.select(selected);
			// Set current = selected since this is not necessarily a user exit
			this._currentSelection = this.selected;
		}
	}

	public setEnabled(enable: boolean): void {
		this.selectElement.disabled = !enable;
	}

	private setOptionsList() {

		// Mirror options in drop-down
		// Populate select list for non-native select mode
		this.selectList?.splice(0, this.selectList.length, this.options);
	}

	public select(index: number): void {

		if (index >= 0 && index < this.options.length) {
			this.selected = index;
		} else if (index > this.options.length - 1) {
			// Adjust index to end of list
			// This could make client out of sync with the select
			this.select(this.options.length - 1);
		} else if (this.selected < 0) {
			this.selected = 0;
		}

		this.selectElement.selectedIndex = this.selected;
		if (!!this.options[this.selected] && !!this.options[this.selected].text) {
			this.setTitle(this.options[this.selected].text);
		}
	}

	public setAriaLabel(label: string): void {
		this.selectBoxOptions.ariaLabel = label;
		this.selectElement.setAttribute('aria-label', this.selectBoxOptions.ariaLabel);
	}

	public focus(): void {
		if (this.selectElement) {
			this.selectElement.tabIndex = 0;
			this.selectElement.focus();
		}
	}

	public blur(): void {
		if (this.selectElement) {
			this.selectElement.tabIndex = -1;
			this.selectElement.blur();
		}
	}

	public setFocusable(focusable: boolean): void {
		this.selectElement.tabIndex = focusable ? 0 : -1;
	}

	public render(container: HTMLElement): void {
		this.container = container;
		container.classList.add('select-container');
		container.appendChild(this.selectElement);
		this.styleSelectElement();
	}

	private initStyleSheet(): void {

		const content: string[] = [];

		// Style non-native select mode

		if (this.styles.listFocusBackground) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused { background-color: ${this.styles.listFocusBackground} !important; }`);
		}

		if (this.styles.listFocusForeground) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused { color: ${this.styles.listFocusForeground} !important; }`);
		}

		if (this.styles.decoratorRightForeground) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:not(.focused) .option-decorator-right { color: ${this.styles.decoratorRightForeground}; }`);
		}

		if (this.styles.selectBackground && this.styles.selectBorder && this.styles.selectBorder !== this.styles.selectBackground) {
			content.push(`.monaco-select-box-dropdown-container { border: 1px solid ${this.styles.selectBorder} } `);
			content.push(`.monaco-select-box-dropdown-container > .select-box-details-pane.border-top { border-top: 1px solid ${this.styles.selectBorder} } `);
			content.push(`.monaco-select-box-dropdown-container > .select-box-details-pane.border-bottom { border-bottom: 1px solid ${this.styles.selectBorder} } `);

		}
		else if (this.styles.selectListBorder) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-details-pane.border-top { border-top: 1px solid ${this.styles.selectListBorder} } `);
			content.push(`.monaco-select-box-dropdown-container > .select-box-details-pane.border-bottom { border-bottom: 1px solid ${this.styles.selectListBorder} } `);
		}

		// Hover foreground - ignore for disabled options
		if (this.styles.listHoverForeground) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:not(.option-disabled):not(.focused):hover { color: ${this.styles.listHoverForeground} !important; }`);
		}

		// Hover background - ignore for disabled options
		if (this.styles.listHoverBackground) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:not(.option-disabled):not(.focused):hover { background-color: ${this.styles.listHoverBackground} !important; }`);
		}

		// Match quick input outline styles - ignore for disabled options
		if (this.styles.listFocusOutline) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.focused { outline: 1.6px dotted ${this.styles.listFocusOutline} !important; outline-offset: -1.6px !important; }`);
		}

		if (this.styles.listHoverOutline) {
			content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row:not(.option-disabled):not(.focused):hover { outline: 1.6px dashed ${this.styles.listHoverOutline} !important; outline-offset: -1.6px !important; }`);
		}

		// Clear list styles on focus and on hover for disabled options
		content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.option-disabled.focused { background-color: transparent !important; color: inherit !important; outline: none !important; }`);
		content.push(`.monaco-select-box-dropdown-container > .select-box-dropdown-list-container .monaco-list .monaco-list-row.option-disabled:hover { background-color: transparent !important; color: inherit !important; outline: none !important; }`);

		this.styleElement.textContent = content.join('\n');
	}

	private styleSelectElement(): void {
		const background = this.styles.selectBackground ?? '';
		const foreground = this.styles.selectForeground ?? '';
		const border = this.styles.selectBorder ?? '';

		this.selectElement.style.backgroundColor = background;
		this.selectElement.style.color = foreground;
		this.selectElement.style.borderColor = border;
	}

	private styleList() {
		const background = this.styles.selectBackground ?? '';

		const listBackground = cssJs.asCssValueWithDefault(this.styles.selectListBackground, background);
		this.selectDropDownListContainer.style.backgroundColor = listBackground;
		this.selectionDetailsPane.style.backgroundColor = listBackground;
		const optionsBorder = this.styles.focusBorder ?? '';
		this.selectDropDownContainer.style.outlineColor = optionsBorder;
		this.selectDropDownContainer.style.outlineOffset = '-1px';

		this.selectList.style(this.styles);
	}

	private createOption(value: string, index: number, disabled?: boolean): HTMLOptionElement {
		const option = document.createElement('option');
		option.value = value;
		option.text = value;
		option.disabled = !!disabled;

		return option;
	}

	// ContextView dropdown methods

	private showSelectDropDown() {
		this.selectionDetailsPane.textContent = '';

		if (!this.contextViewProvider || this._isVisible) {
			return;
		}

		// Lazily create and populate list only at open, moved from constructor
		this.createSelectList(this.selectDropDownContainer);
		this.setOptionsList();

		// This allows us to flip the position based on measurement
		// Set drop-down position above/below from required height and margins
		// If pre-layout cannot fit at least one option do not show drop-down

		this.contextViewProvider.showContextView({
			getAnchor: () => this.selectElement,
			render: (container: HTMLElement) => this.renderSelectDropDown(container, true),
			layout: () => {
				this.layoutSelectDropDown();
			},
			onHide: () => {
				this.selectDropDownContainer.classList.remove('visible');
			},
			anchorPosition: this._dropDownPosition
		}, this.selectBoxOptions.optionsAsChildren ? this.container : undefined);

		// Hide so we can relay out
		this._isVisible = true;
		this.hideSelectDropDown(false);

		this.contextViewProvider.showContextView({
			getAnchor: () => this.selectElement,
			render: (container: HTMLElement) => this.renderSelectDropDown(container),
			layout: () => this.layoutSelectDropDown(),
			onHide: () => {
				this.selectDropDownContainer.classList.remove('visible');
			},
			anchorPosition: this._dropDownPosition
		}, this.selectBoxOptions.optionsAsChildren ? this.container : undefined);

		// Track initial selection the case user escape, blur
		this._currentSelection = this.selected;
		this._isVisible = true;
		this.selectElement.setAttribute('aria-expanded', 'true');
	}

	private hideSelectDropDown(focusSelect: boolean) {
		if (!this.contextViewProvider || !this._isVisible) {
			return;
		}

		this._isVisible = false;
		this.selectElement.setAttribute('aria-expanded', 'false');

		if (focusSelect) {
			this.selectElement.focus();
		}

		this.contextViewProvider.hideContextView();
	}

	private renderSelectDropDown(container: HTMLElement, preLayoutPosition?: boolean): IDisposable {
		container.appendChild(this.selectDropDownContainer);

		// Pre-Layout allows us to change position
		this.layoutSelectDropDown(preLayoutPosition);

		return {
			dispose: () => {
				// contextView will dispose itself if moving from one View to another
				this.selectDropDownContainer.remove(); // remove to take out the CSS rules we add
			}
		};
	}

	// Iterate over detailed descriptions, find max height
	private measureMaxDetailsHeight(): number {
		let maxDetailsPaneHeight = 0;
		this.options.forEach((_option, index) => {
			this.updateDetail(index);

			if (this.selectionDetailsPane.offsetHeight > maxDetailsPaneHeight) {
				maxDetailsPaneHeight = this.selectionDetailsPane.offsetHeight;
			}
		});

		return maxDetailsPaneHeight;
	}

	private layoutSelectDropDown(preLayoutPosition?: boolean): boolean {

		// Avoid recursion from layout called in onListFocus
		if (this._skipLayout) {
			return false;
		}

		// Layout ContextView drop down select list and container
		// Have to manage our vertical overflow, sizing, position below or above
		// Position has to be determined and set prior to contextView instantiation

		if (this.selectList) {

			// Make visible to enable measurements
			this.selectDropDownContainer.classList.add('visible');

			const window = dom.getWindow(this.selectElement);
			const selectPosition = dom.getDomNodePagePosition(this.selectElement);
			const maxSelectDropDownHeightBelow = (window.innerHeight - selectPosition.top - selectPosition.height - (this.selectBoxOptions.minBottomMargin || 0));
			const maxSelectDropDownHeightAbove = (selectPosition.top - SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_TOP_MARGIN);

			// Determine optimal width - min(longest option), opt(parent select, excluding margins), max(ContextView controlled)
			const selectWidth = this.selectElement.offsetWidth;
			const selectMinWidth = this.setWidthControlElement(this.widthControlElement);
			const selectOptimalWidth = `${Math.max(selectMinWidth, Math.round(selectWidth))}px`;

			this.selectDropDownContainer.style.width = selectOptimalWidth;

			// Get initial list height and determine space above and below
			this.selectList.getHTMLElement().style.height = '';
			this.selectList.layout();
			let listHeight = this.selectList.contentHeight;

			if (this._hasDetails && this._cachedMaxDetailsHeight === undefined) {
				this._cachedMaxDetailsHeight = this.measureMaxDetailsHeight();
			}
			const maxDetailsPaneHeight = this._hasDetails ? this._cachedMaxDetailsHeight! : 0;

			const minRequiredDropDownHeight = listHeight + maxDetailsPaneHeight;
			const maxVisibleOptionsBelow = ((Math.floor((maxSelectDropDownHeightBelow - maxDetailsPaneHeight) / this.getHeight())));
			const maxVisibleOptionsAbove = ((Math.floor((maxSelectDropDownHeightAbove - maxDetailsPaneHeight) / this.getHeight())));

			// If we are only doing pre-layout check/adjust position only
			// Calculate vertical space available, flip up if insufficient
			// Use reflected padding on parent select, ContextView style
			// properties not available before DOM attachment

			if (preLayoutPosition) {

				// Check if select moved out of viewport , do not open
				// If at least one option cannot be shown, don't open the drop-down or hide/remove if open

				if ((selectPosition.top + selectPosition.height) > (window.innerHeight - 22)
					|| selectPosition.top < SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_TOP_MARGIN
					|| ((maxVisibleOptionsBelow < 1) && (maxVisibleOptionsAbove < 1))) {
					// Indicate we cannot open
					return false;
				}

				// Determine if we have to flip up
				// Always show complete list items - never more than Max available vertical height
				if (maxVisibleOptionsBelow < SelectBoxList.DEFAULT_MINIMUM_VISIBLE_OPTIONS
					&& maxVisibleOptionsAbove > maxVisibleOptionsBelow
					&& this.options.length > maxVisibleOptionsBelow
				) {
					this._dropDownPosition = AnchorPosition.ABOVE;
					this.selectDropDownListContainer.remove();
					this.selectionDetailsPane.remove();
					this.selectDropDownContainer.appendChild(this.selectionDetailsPane);
					this.selectDropDownContainer.appendChild(this.selectDropDownListContainer);

					this.selectionDetailsPane.classList.remove('border-top');
					this.selectionDetailsPane.classList.add('border-bottom');

				} else {
					this._dropDownPosition = AnchorPosition.BELOW;
					this.selectDropDownListContainer.remove();
					this.selectionDetailsPane.remove();
					this.selectDropDownContainer.appendChild(this.selectDropDownListContainer);
					this.selectDropDownContainer.appendChild(this.selectionDetailsPane);

					this.selectionDetailsPane.classList.remove('border-bottom');
					this.selectionDetailsPane.classList.add('border-top');
				}
				// Do full layout on showSelectDropDown only
				return true;
			}

			// Check if select out of viewport or cutting into status bar
			if ((selectPosition.top + selectPosition.height) > (window.innerHeight - 22)
				|| selectPosition.top < SelectBoxList.DEFAULT_DROPDOWN_MINIMUM_TOP_MARGIN
				|| (this._dropDownPosition === AnchorPosition.BELOW && maxVisibleOptionsBelow < 1)
				|| (this._dropDownPosition === AnchorPosition.ABOVE && maxVisibleOptionsAbove < 1)) {
				// Cannot properly layout, close and hide
				this.hideSelectDropDown(true);
				return false;
			}

			// SetUp list dimensions and layout - account for container padding
			// Use position to check above or below available space
			if (this._dropDownPosition === AnchorPosition.BELOW) {
				if (this._isVisible && maxVisibleOptionsBelow + maxVisibleOptionsAbove < 1) {
					// If drop-down is visible, must be doing a DOM re-layout, hide since we don't fit
					// Hide drop-down, hide contextview, focus on parent select
					this.hideSelectDropDown(true);
					return false;
				}

				// Adjust list height to max from select bottom to margin (default/minBottomMargin)
				if (minRequiredDropDownHeight > maxSelectDropDownHeightBelow) {
					listHeight = (maxVisibleOptionsBelow * this.getHeight());
				}
			} else {
				if (minRequiredDropDownHeight > maxSelectDropDownHeightAbove) {
					listHeight = (maxVisibleOptionsAbove * this.getHeight());
				}
			}

			// Set adjusted list height and relayout
			this.selectList.layout(listHeight);
			this.selectList.domFocus();

			// Finally set focus on selected item
			if (this.selectList.length > 0) {
				this.selectList.setFocus([this.selected || 0]);
				this.selectList.reveal(this.selectList.getFocus()[0] || 0);
			}

			if (this._hasDetails) {
				// Leave the selectDropDownContainer to size itself according to children (list + details) - #57447
				this.selectList.getHTMLElement().style.height = `${listHeight}px`;
				this.selectDropDownContainer.style.height = '';
			} else {
				this.selectDropDownContainer.style.height = `${listHeight}px`;
			}

			this.updateDetail(this.selected);

			this.selectDropDownContainer.style.width = selectOptimalWidth;
			this.selectDropDownListContainer.setAttribute('tabindex', '0');

			return true;
		} else {
			return false;
		}
	}

	private setWidthControlElement(container: HTMLElement): number {
		let elementWidth = 0;

		if (container) {
			let longest = 0;
			let longestLength = 0;

			this.options.forEach((option, index) => {
				const detailLength = !!option.detail ? option.detail.length : 0;
				const rightDecoratorLength = !!option.decoratorRight ? option.decoratorRight.length : 0;

				const len = option.text.length + detailLength + rightDecoratorLength;
				if (len > longestLength) {
					longest = index;
					longestLength = len;
				}
			});


			container.textContent = this.options[longest].text + (!!this.options[longest].decoratorRight ? `${this.options[longest].decoratorRight} ` : '');
			elementWidth = dom.getTotalWidth(container);
		}

		return elementWidth;
	}

	private createSelectList(parent: HTMLElement): void {

		// If we have already constructive list on open, skip
		if (this.selectList) {
			return;
		}

		// SetUp container for list
		this.selectDropDownListContainer = dom.append(parent, $('.select-box-dropdown-list-container'));

		this.listRenderer = new SelectListRenderer();

		this.selectList = this._register(new List('SelectBoxCustom', this.selectDropDownListContainer, this, [this.listRenderer], {
			useShadows: false,
			verticalScrollMode: ScrollbarVisibility.Visible,
			keyboardSupport: false,
			mouseSupport: false,
			accessibilityProvider: {
				getAriaLabel: element => {
					let label = element.text;
					if (element.detail) {
						label += `. ${element.detail}`;
					}

					if (element.decoratorRight) {
						label += `. ${element.decoratorRight}`;
					}

					if (element.description) {
						label += `. ${element.description}`;
					}

					return label;
				},
				getWidgetAriaLabel: () => localize({ key: 'selectBox', comment: ['Behave like native select dropdown element.'] }, "Select Box"),
				getRole: () => isMacintosh ? '' : 'option',
				getWidgetRole: () => 'listbox'
			}
		}));
		if (this.selectBoxOptions.ariaLabel) {
			this.selectList.ariaLabel = this.selectBoxOptions.ariaLabel;
		}

		// SetUp list keyboard controller - control navigation, disabled items, focus
		const onKeyDown = this._register(new DomEmitter(this.selectDropDownListContainer, 'keydown'));
		const onSelectDropDownKeyDown = Event.chain(onKeyDown.event, $ =>
			$.filter(() => this.selectList.length > 0)
				.map(e => new StandardKeyboardEvent(e))
		);

		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Enter))(this.onEnter, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Tab))(this.onEnter, this)); // Tab should behave the same as enter, #79339
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Escape))(this.onEscape, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.UpArrow))(this.onUpArrow, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.DownArrow))(this.onDownArrow, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.PageDown))(this.onPageDown, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.PageUp))(this.onPageUp, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Home))(this.onHome, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => e.keyCode === KeyCode.End))(this.onEnd, this));
		this._register(Event.chain(onSelectDropDownKeyDown, $ => $.filter(e => (e.keyCode >= KeyCode.Digit0 && e.keyCode <= KeyCode.KeyZ) || (e.keyCode >= KeyCode.Semicolon && e.keyCode <= KeyCode.NumpadDivide)))(this.onCharacter, this));

		// SetUp list mouse controller - control navigation, disabled items, focus
		this._register(dom.addDisposableListener(this.selectList.getHTMLElement(), dom.EventType.POINTER_UP, e => this.onPointerUp(e)));

		this._register(this.selectList.onMouseOver(e => typeof e.index !== 'undefined' && this.selectList.setFocus([e.index])));
		this._register(this.selectList.onDidChangeFocus(e => this.onListFocus(e)));

		this._register(dom.addDisposableListener(this.selectDropDownContainer, dom.EventType.FOCUS_OUT, e => {
			if (!this._isVisible || dom.isAncestor(e.relatedTarget as HTMLElement, this.selectDropDownContainer)) {
				return;
			}
			this.onListBlur();
		}));

		this.selectList.getHTMLElement().setAttribute('aria-label', this.selectBoxOptions.ariaLabel || '');
		this.selectList.getHTMLElement().setAttribute('aria-expanded', 'true');

		this.styleList();
	}

	// List methods

	// List mouse controller - active exit, select option, fire onDidSelect if change, return focus to parent select
	// Also takes in touchend events
	private onPointerUp(e: PointerEvent): void {

		if (!this.selectList.length) {
			return;
		}

		dom.EventHelper.stop(e);

		const target = <Element>e.target;
		if (!target) {
			return;
		}

		// Check our mouse event is on an option (not scrollbar)
		if (target.classList.contains('slider')) {
			return;
		}

		const listRowElement = target.closest('.monaco-list-row');

		if (!listRowElement) {
			return;
		}
		const index = Number(listRowElement.getAttribute('data-index'));
		const disabled = listRowElement.classList.contains('option-disabled');

		// Ignore mouse selection of disabled options
		if (index >= 0 && index < this.options.length && !disabled) {
			this.selected = index;
			this.select(this.selected);

			this.selectList.setFocus([this.selected]);
			this.selectList.reveal(this.selectList.getFocus()[0]);

			// Only fire if selection change
			if (this.selected !== this._currentSelection) {
				// Set current = selected
				this._currentSelection = this.selected;

				this._onDidSelect.fire({
					index: this.selectElement.selectedIndex,
					selected: this.options[this.selected].text

				});
				if (!!this.options[this.selected] && !!this.options[this.selected].text) {
					this.setTitle(this.options[this.selected].text);
				}
			}

			this.hideSelectDropDown(true);
		}
	}

	// List Exit - passive - implicit no selection change, hide drop-down
	private onListBlur(): void {
		if (this._sticky) { return; }
		if (this.selected !== this._currentSelection) {
			// Reset selected to current if no change
			this.select(this._currentSelection);
		}

		this.hideSelectDropDown(false);
	}


	private renderDescriptionMarkdown(text: string, actionHandler?: MarkdownActionHandler): IRenderedMarkdown {
		const cleanRenderedMarkdown = (element: Node) => {
			for (let i = 0; i < element.childNodes.length; i++) {
				const child = <Element>element.childNodes.item(i);

				const tagName = child.tagName && child.tagName.toLowerCase();
				if (tagName === 'img') {
					child.remove();
				} else {
					cleanRenderedMarkdown(child);
				}
			}
		};

		const rendered = renderMarkdown({ value: text, supportThemeIcons: true }, { actionHandler });

		rendered.element.classList.add('select-box-description-markdown');
		cleanRenderedMarkdown(rendered.element);

		return rendered;
	}

	// List Focus Change - passive - update details pane with newly focused element's data
	private onListFocus(e: IListEvent<ISelectOptionItem>) {
		// Skip during initial layout
		if (!this._isVisible || !this._hasDetails) {
			return;
		}

		this.updateDetail(e.indexes[0]);
	}

	private updateDetail(selectedIndex: number): void {
		// Reset
		this._selectionDetailsDisposables.clear();
		this.selectionDetailsPane.textContent = '';

		const option = this.options[selectedIndex];
		const description = option?.description ?? '';
		const descriptionIsMarkdown = option?.descriptionIsMarkdown ?? false;

		if (description) {
			if (descriptionIsMarkdown) {
				const actionHandler = option.descriptionMarkdownActionHandler;
				const result = this._selectionDetailsDisposables.add(this.renderDescriptionMarkdown(description, actionHandler));
				this.selectionDetailsPane.appendChild(result.element);
			} else {
				this.selectionDetailsPane.textContent = description;
			}
			this.selectionDetailsPane.style.display = 'block';
		} else {
			this.selectionDetailsPane.style.display = 'none';
		}

		// Avoid recursion
		this._skipLayout = true;
		this.contextViewProvider.layout();
		this._skipLayout = false;
	}

	// List keyboard controller

	// List exit - active - hide ContextView dropdown, reset selection, return focus to parent select
	private onEscape(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		// Reset selection to value when opened
		this.select(this._currentSelection);
		this.hideSelectDropDown(true);
	}

	// List exit - active - hide ContextView dropdown, return focus to parent select, fire onDidSelect if change
	private onEnter(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		// Only fire if selection change
		if (this.selected !== this._currentSelection) {
			this._currentSelection = this.selected;
			this._onDidSelect.fire({
				index: this.selectElement.selectedIndex,
				selected: this.options[this.selected].text
			});
			if (!!this.options[this.selected] && !!this.options[this.selected].text) {
				this.setTitle(this.options[this.selected].text);
			}
		}

		this.hideSelectDropDown(true);
	}

	// List navigation - have to handle a disabled option (jump over)
	private onDownArrow(e: StandardKeyboardEvent): void {
		if (this.selected < this.options.length - 1) {
			dom.EventHelper.stop(e, true);

			// Skip disabled options
			const nextOptionDisabled = this.options[this.selected + 1].isDisabled;

			if (nextOptionDisabled && this.options.length > this.selected + 2) {
				this.selected += 2;
			} else if (nextOptionDisabled) {
				return;
			} else {
				this.selected++;
			}

			// Set focus/selection - only fire event when closing drop-down or on blur
			this.select(this.selected);
			this.selectList.setFocus([this.selected]);
			this.selectList.reveal(this.selectList.getFocus()[0]);
		}
	}

	private onUpArrow(e: StandardKeyboardEvent): void {
		if (this.selected > 0) {
			dom.EventHelper.stop(e, true);
			// Skip disabled options
			const previousOptionDisabled = this.options[this.selected - 1].isDisabled;
			if (previousOptionDisabled && this.selected > 1) {
				this.selected -= 2;
			} else {
				this.selected--;
			}
			// Set focus/selection - only fire event when closing drop-down or on blur
			this.select(this.selected);
			this.selectList.setFocus([this.selected]);
			this.selectList.reveal(this.selectList.getFocus()[0]);
		}
	}

	private onPageUp(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		this.selectList.focusPreviousPage();

		// Allow scrolling to settle
		setTimeout(() => {
			this.selected = this.selectList.getFocus()[0];

			// Shift selection down if we land on a disabled option
			if (this.options[this.selected].isDisabled && this.selected < this.options.length - 1) {
				this.selected++;
				this.selectList.setFocus([this.selected]);
			}
			this.selectList.reveal(this.selected);
			this.select(this.selected);
		}, 1);
	}

	private onPageDown(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		this.selectList.focusNextPage();

		// Allow scrolling to settle
		setTimeout(() => {
			this.selected = this.selectList.getFocus()[0];

			// Shift selection up if we land on a disabled option
			if (this.options[this.selected].isDisabled && this.selected > 0) {
				this.selected--;
				this.selectList.setFocus([this.selected]);
			}
			this.selectList.reveal(this.selected);
			this.select(this.selected);
		}, 1);
	}

	private onHome(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		if (this.options.length < 2) {
			return;
		}
		this.selected = 0;
		if (this.options[this.selected].isDisabled && this.selected > 1) {
			this.selected++;
		}
		this.selectList.setFocus([this.selected]);
		this.selectList.reveal(this.selected);
		this.select(this.selected);
	}

	private onEnd(e: StandardKeyboardEvent): void {
		dom.EventHelper.stop(e);

		if (this.options.length < 2) {
			return;
		}
		this.selected = this.options.length - 1;
		if (this.options[this.selected].isDisabled && this.selected > 1) {
			this.selected--;
		}
		this.selectList.setFocus([this.selected]);
		this.selectList.reveal(this.selected);
		this.select(this.selected);
	}

	// Mimic option first character navigation of native select
	private onCharacter(e: StandardKeyboardEvent): void {
		const ch = KeyCodeUtils.toString(e.keyCode);
		let optionIndex = -1;

		for (let i = 0; i < this.options.length - 1; i++) {
			optionIndex = (i + this.selected + 1) % this.options.length;
			if (this.options[optionIndex].text.charAt(0).toUpperCase() === ch && !this.options[optionIndex].isDisabled) {
				this.select(optionIndex);
				this.selectList.setFocus([optionIndex]);
				this.selectList.reveal(this.selectList.getFocus()[0]);
				dom.EventHelper.stop(e);
				break;
			}
		}
	}

	public override dispose(): void {
		this.hideSelectDropDown(false);
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/selectBox/selectBoxNative.ts]---
Location: vscode-main/src/vs/base/browser/ui/selectBox/selectBoxNative.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { EventType, Gesture } from '../../touch.js';
import { ISelectBoxDelegate, ISelectBoxOptions, ISelectBoxStyles, ISelectData, ISelectOptionItem } from './selectBox.js';
import * as arrays from '../../../common/arrays.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { Disposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';

export class SelectBoxNative extends Disposable implements ISelectBoxDelegate {

	private selectElement: HTMLSelectElement;
	private selectBoxOptions: ISelectBoxOptions;
	private options: ISelectOptionItem[];
	private selected = 0;
	private readonly _onDidSelect: Emitter<ISelectData>;
	private styles: ISelectBoxStyles;

	constructor(options: ISelectOptionItem[], selected: number, styles: ISelectBoxStyles, selectBoxOptions?: ISelectBoxOptions) {
		super();
		this.selectBoxOptions = selectBoxOptions || Object.create(null);

		this.options = [];

		this.selectElement = document.createElement('select');

		this.selectElement.className = 'monaco-select-box';

		if (typeof this.selectBoxOptions.ariaLabel === 'string') {
			this.selectElement.setAttribute('aria-label', this.selectBoxOptions.ariaLabel);
		}

		if (typeof this.selectBoxOptions.ariaDescription === 'string') {
			this.selectElement.setAttribute('aria-description', this.selectBoxOptions.ariaDescription);
		}

		this._onDidSelect = this._register(new Emitter<ISelectData>());

		this.styles = styles;

		this.registerListeners();
		this.setOptions(options, selected);
	}

	private registerListeners() {
		this._register(Gesture.addTarget(this.selectElement));
		[EventType.Tap].forEach(eventType => {
			this._register(dom.addDisposableListener(this.selectElement, eventType, (e) => {
				this.selectElement.focus();
			}));
		});

		this._register(dom.addStandardDisposableListener(this.selectElement, 'click', (e) => {
			dom.EventHelper.stop(e, true);
		}));

		this._register(dom.addStandardDisposableListener(this.selectElement, 'change', (e) => {
			this.selectElement.title = e.target.value;
			this._onDidSelect.fire({
				index: e.target.selectedIndex,
				selected: e.target.value
			});
		}));

		this._register(dom.addStandardDisposableListener(this.selectElement, 'keydown', (e) => {
			let showSelect = false;

			if (isMacintosh) {
				if (e.keyCode === KeyCode.DownArrow || e.keyCode === KeyCode.UpArrow || e.keyCode === KeyCode.Space) {
					showSelect = true;
				}
			} else {
				if (e.keyCode === KeyCode.DownArrow && e.altKey || e.keyCode === KeyCode.Space || e.keyCode === KeyCode.Enter) {
					showSelect = true;
				}
			}

			if (showSelect) {
				// Space, Enter, is used to expand select box, do not propagate it (prevent action bar action run)
				e.stopPropagation();
			}
		}));
	}

	public get onDidSelect(): Event<ISelectData> {
		return this._onDidSelect.event;
	}

	public setOptions(options: ISelectOptionItem[], selected?: number): void {

		if (!this.options || !arrays.equals(this.options, options)) {
			this.options = options;
			this.selectElement.options.length = 0;

			this.options.forEach((option, index) => {
				this.selectElement.add(this.createOption(option.text, index, option.isDisabled));
			});

		}

		if (selected !== undefined) {
			this.select(selected);
		}
	}

	public select(index: number): void {
		if (this.options.length === 0) {
			this.selected = 0;
		} else if (index >= 0 && index < this.options.length) {
			this.selected = index;
		} else if (index > this.options.length - 1) {
			// Adjust index to end of list
			// This could make client out of sync with the select
			this.select(this.options.length - 1);
		} else if (this.selected < 0) {
			this.selected = 0;
		}

		this.selectElement.selectedIndex = this.selected;
		if ((this.selected < this.options.length) && typeof this.options[this.selected].text === 'string') {
			this.selectElement.title = this.options[this.selected].text;
		} else {
			this.selectElement.title = '';
		}
	}

	public setAriaLabel(label: string): void {
		this.selectBoxOptions.ariaLabel = label;
		this.selectElement.setAttribute('aria-label', label);
	}

	public focus(): void {
		if (this.selectElement) {
			this.selectElement.tabIndex = 0;
			this.selectElement.focus();
		}
	}

	public blur(): void {
		if (this.selectElement) {
			this.selectElement.tabIndex = -1;
			this.selectElement.blur();
		}
	}

	public setEnabled(enable: boolean): void {
		this.selectElement.disabled = !enable;
	}

	public setFocusable(focusable: boolean): void {
		this.selectElement.tabIndex = focusable ? 0 : -1;
	}

	public render(container: HTMLElement): void {
		container.classList.add('select-container');
		container.appendChild(this.selectElement);
		this.setOptions(this.options, this.selected);
		this.applyStyles();
	}

	public style(styles: ISelectBoxStyles): void {
		this.styles = styles;
		this.applyStyles();
	}

	public applyStyles(): void {

		// Style native select
		if (this.selectElement) {
			this.selectElement.style.backgroundColor = this.styles.selectBackground ?? '';
			this.selectElement.style.color = this.styles.selectForeground ?? '';
			this.selectElement.style.borderColor = this.styles.selectBorder ?? '';
		}

	}

	private createOption(value: string, index: number, disabled?: boolean): HTMLOptionElement {
		const option = document.createElement('option');
		option.value = value;
		option.text = value;
		option.disabled = !!disabled;

		return option;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/severityIcon/severityIcon.ts]---
Location: vscode-main/src/vs/base/browser/ui/severityIcon/severityIcon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/severityIcon.css';
import { Codicon } from '../../../common/codicons.js';
import { ThemeIcon } from '../../../common/themables.js';
import Severity from '../../../common/severity.js';

export namespace SeverityIcon {

	export function className(severity: Severity): string {
		switch (severity) {
			case Severity.Ignore:
				return 'severity-ignore ' + ThemeIcon.asClassName(Codicon.info);
			case Severity.Info:
				return ThemeIcon.asClassName(Codicon.info);
			case Severity.Warning:
				return ThemeIcon.asClassName(Codicon.warning);
			case Severity.Error:
				return ThemeIcon.asClassName(Codicon.error);
			default:
				return '';
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/severityIcon/media/severityIcon.css]---
Location: vscode-main/src/vs/base/browser/ui/severityIcon/media/severityIcon.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .zone-widget .codicon.codicon-error,
.markers-panel .marker-icon.error, .markers-panel .marker-icon .codicon.codicon-error,
.text-search-provider-messages .providerMessage .codicon.codicon-error,
.extensions-viewlet > .extensions .codicon.codicon-error,
.extension-editor .codicon.codicon-error,
.chat-attached-context-attachment .codicon.codicon-error {
	color: var(--vscode-problemsErrorIcon-foreground);
}

.monaco-editor .zone-widget .codicon.codicon-warning,
.markers-panel .marker-icon.warning, .markers-panel .marker-icon .codicon.codicon-warning,
.text-search-provider-messages .providerMessage .codicon.codicon-warning,
.extensions-viewlet > .extensions .codicon.codicon-warning,
.extension-editor .codicon.codicon-warning,
.preferences-editor .codicon.codicon-warning {
	color: var(--vscode-problemsWarningIcon-foreground);
}

.monaco-editor .zone-widget .codicon.codicon-info,
.markers-panel .marker-icon.info, .markers-panel .marker-icon .codicon.codicon-info,
.text-search-provider-messages .providerMessage .codicon.codicon-info,
.extensions-viewlet > .extensions .codicon.codicon-info,
.extension-editor .codicon.codicon-info {
	color: var(--vscode-problemsInfoIcon-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/splitview/paneview.css]---
Location: vscode-main/src/vs/base/browser/ui/splitview/paneview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-pane-view {
	width: 100%;
	height: 100%;
}

.monaco-pane-view .pane {
	overflow: hidden;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.monaco-pane-view .pane.horizontal:not(.expanded) {
	flex-direction: row;
}

.monaco-pane-view .pane > .pane-header {
	height: 22px;
	font-size: 11px;
	font-weight: bold;
	overflow: hidden;
	display: flex;
	cursor: pointer;
	align-items: center;
	box-sizing: border-box;
}

.monaco-pane-view .pane > .pane-header.not-collapsible {
	cursor: default;
}

.monaco-pane-view .pane > .pane-header > .title {
	text-transform: uppercase;
}

.monaco-pane-view .pane.horizontal:not(.expanded) > .pane-header {
	flex-direction: column;
	height: 100%;
	width: 22px;
}

.monaco-pane-view .pane > .pane-header > .codicon:first-of-type {
	margin: 0 2px;
}

.monaco-pane-view .pane.horizontal:not(.expanded) > .pane-header > .codicon:first-of-type {
	margin: 2px;
}

/* TODO: actions should be part of the pane, but they aren't yet */
.monaco-pane-view .pane > .pane-header > .actions {
	display: none;
	margin-left: auto;
	margin-right: 8px;
}

.monaco-pane-view .pane > .pane-header > .actions .action-item {
	margin-right: 4px;
}

.monaco-pane-view .pane > .pane-header > .actions .action-label {
	padding: 2px;
}

/* TODO: actions should be part of the pane, but they aren't yet */
.monaco-pane-view .pane:hover > .pane-header.expanded > .actions,
.monaco-pane-view .pane:focus-within > .pane-header.expanded > .actions,
.monaco-pane-view .pane > .pane-header.actions-always-visible.expanded > .actions,
.monaco-pane-view .pane > .pane-header.focused.expanded > .actions {
	display: initial;
}

.monaco-pane-view .pane > .pane-header .monaco-action-bar .action-item.select-container {
	cursor: default;
}

.monaco-pane-view .pane > .pane-header .action-item .monaco-select-box {
	cursor: pointer;
	min-width: 110px;
	min-height: 18px;
	padding: 2px 23px 2px 8px;
}

.linux .monaco-pane-view .pane > .pane-header .action-item .monaco-select-box,
.windows .monaco-pane-view .pane > .pane-header .action-item .monaco-select-box {
	padding: 0px 23px 0px 8px;
}

/* Bold font style does not go well with CJK fonts */
.monaco-pane-view:lang(zh-Hans) .pane > .pane-header,
.monaco-pane-view:lang(zh-Hant) .pane > .pane-header,
.monaco-pane-view:lang(ja) .pane > .pane-header,
.monaco-pane-view:lang(ko) .pane > .pane-header {
	font-weight: normal;
}

.monaco-pane-view .pane > .pane-header.hidden {
	display: none;
}

.monaco-pane-view .pane > .pane-body {
	overflow: hidden;
	flex: 1;
}

/* Animation */

.monaco-pane-view.animated .split-view-view {
	transition-duration: 0.15s;
	transition-timing-function: ease-out;
}

.monaco-reduce-motion .monaco-pane-view .split-view-view {
	transition-duration: 0s !important;
}

.monaco-pane-view.animated.vertical .split-view-view {
	transition-property: height;
}

.monaco-pane-view.animated.horizontal .split-view-view {
	transition-property: width;
}

#monaco-pane-drop-overlay {
	position: absolute;
	z-index: 10000;
	width: 100%;
	height: 100%;
	left: 0;
	box-sizing: border-box;
}

#monaco-pane-drop-overlay > .pane-overlay-indicator {
	position: absolute;
	width: 100%;
	height: 100%;
	min-height: 22px;
	min-width: 19px;

	pointer-events: none; /* very important to not take events away from the parent */
	transition: opacity 150ms ease-out;
}

#monaco-pane-drop-overlay > .pane-overlay-indicator.overlay-move-transition {
	transition: top 70ms ease-out, left 70ms ease-out, width 70ms ease-out, height 70ms ease-out, opacity 150ms ease-out;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/splitview/paneview.ts]---
Location: vscode-main/src/vs/base/browser/ui/splitview/paneview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFirefox } from '../../browser.js';
import { DataTransfers } from '../../dnd.js';
import { $, addDisposableListener, append, clearNode, EventHelper, EventType, getWindow, isHTMLElement, trackFocus } from '../../dom.js';
import { DomEmitter } from '../../event.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { Gesture, EventType as TouchEventType } from '../../touch.js';
import { IBoundarySashes, Orientation } from '../sash/sash.js';
import { Color, RGBA } from '../../../common/color.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { ScrollEvent } from '../../../common/scrollable.js';
import './paneview.css';
import { localize } from '../../../../nls.js';
import { IView, Sizing, SplitView } from './splitview.js';
import { applyDragImage } from '../dnd/dnd.js';

export interface IPaneOptions {
	minimumBodySize?: number;
	maximumBodySize?: number;
	expanded?: boolean;
	orientation?: Orientation;
	title: string;
	titleDescription?: string;
}

export interface IPaneStyles {
	readonly dropBackground: string | undefined;
	readonly headerForeground: string | undefined;
	readonly headerBackground: string | undefined;
	readonly headerBorder: string | undefined;
	readonly leftBorder: string | undefined;
}

/**
 * A Pane is a structured SplitView view.
 *
 * WARNING: You must call `render()` after you construct it.
 * It can't be done automatically at the end of the ctor
 * because of the order of property initialization in TypeScript.
 * Subclasses wouldn't be able to set own properties
 * before the `render()` call, thus forbidding their use.
 */
export abstract class Pane extends Disposable implements IView {

	private static readonly HEADER_SIZE = 22;

	readonly element: HTMLElement;
	private header: HTMLElement | undefined;
	private body!: HTMLElement;

	protected _expanded: boolean;
	protected _orientation: Orientation;

	private expandedSize: number | undefined = undefined;
	private _headerVisible = true;
	private _collapsible = true;
	private _bodyRendered = false;
	private _minimumBodySize: number;
	private _maximumBodySize: number;
	private _ariaHeaderLabel: string;
	private styles: IPaneStyles = {
		dropBackground: undefined,
		headerBackground: undefined,
		headerBorder: undefined,
		headerForeground: undefined,
		leftBorder: undefined
	};
	private animationTimer: number | undefined = undefined;

	private readonly _onDidChange = this._register(new Emitter<number | undefined>());
	readonly onDidChange: Event<number | undefined> = this._onDidChange.event;

	private readonly _onDidChangeExpansionState = this._register(new Emitter<boolean>());
	readonly onDidChangeExpansionState: Event<boolean> = this._onDidChangeExpansionState.event;

	get ariaHeaderLabel(): string {
		return this._ariaHeaderLabel;
	}

	set ariaHeaderLabel(newLabel: string) {
		this._ariaHeaderLabel = newLabel;
		this.header?.setAttribute('aria-label', this.ariaHeaderLabel);
	}

	get draggableElement(): HTMLElement | undefined {
		return this.header;
	}

	get dropTargetElement(): HTMLElement {
		return this.element;
	}

	get dropBackground(): string | undefined {
		return this.styles.dropBackground;
	}

	get minimumBodySize(): number {
		return this._minimumBodySize;
	}

	set minimumBodySize(size: number) {
		this._minimumBodySize = size;
		this._onDidChange.fire(undefined);
	}

	get maximumBodySize(): number {
		return this._maximumBodySize;
	}

	set maximumBodySize(size: number) {
		this._maximumBodySize = size;
		this._onDidChange.fire(undefined);
	}

	private get headerSize(): number {
		return this.headerVisible ? Pane.HEADER_SIZE : 0;
	}

	get minimumSize(): number {
		const headerSize = this.headerSize;
		const expanded = !this.headerVisible || this.isExpanded();
		const minimumBodySize = expanded ? this.minimumBodySize : 0;

		return headerSize + minimumBodySize;
	}

	get maximumSize(): number {
		const headerSize = this.headerSize;
		const expanded = !this.headerVisible || this.isExpanded();
		const maximumBodySize = expanded ? this.maximumBodySize : 0;

		return headerSize + maximumBodySize;
	}

	orthogonalSize: number = 0;

	protected getAriaHeaderLabel(title: string): string {
		return localize('viewSection', "{0} Section", title);
	}

	constructor(options: IPaneOptions) {
		super();
		this._expanded = typeof options.expanded === 'undefined' ? true : !!options.expanded;
		this._orientation = typeof options.orientation === 'undefined' ? Orientation.VERTICAL : options.orientation;
		this._ariaHeaderLabel = this.getAriaHeaderLabel(options.title);
		this._minimumBodySize = typeof options.minimumBodySize === 'number' ? options.minimumBodySize : this._orientation === Orientation.HORIZONTAL ? 200 : 120;
		this._maximumBodySize = typeof options.maximumBodySize === 'number' ? options.maximumBodySize : Number.POSITIVE_INFINITY;

		this.element = $('.pane');
	}

	isExpanded(): boolean {
		return this._expanded;
	}

	setExpanded(expanded: boolean): boolean {
		if (!expanded && !this.collapsible) {
			return false;
		}

		if (this._expanded === !!expanded) {
			return false;
		}

		this.element?.classList.toggle('expanded', expanded);

		this._expanded = !!expanded;
		this.updateHeader();

		if (expanded) {
			if (!this._bodyRendered) {
				this.renderBody(this.body);
				this._bodyRendered = true;
			}

			if (typeof this.animationTimer === 'number') {
				getWindow(this.element).clearTimeout(this.animationTimer);
			}
			append(this.element, this.body);
		} else {
			this.animationTimer = getWindow(this.element).setTimeout(() => {
				this.body.remove();
			}, 200);
		}

		this._onDidChangeExpansionState.fire(expanded);
		this._onDidChange.fire(expanded ? this.expandedSize : undefined);
		return true;
	}

	get headerVisible(): boolean {
		return this._headerVisible;
	}

	set headerVisible(visible: boolean) {
		if (this._headerVisible === !!visible) {
			return;
		}

		this._headerVisible = !!visible;
		this.updateHeader();
		this._onDidChange.fire(undefined);
	}

	get collapsible(): boolean {
		return this._collapsible;
	}

	set collapsible(collapsible: boolean) {
		if (this._collapsible === !!collapsible) {
			return;
		}

		this._collapsible = !!collapsible;
		this.updateHeader();
	}

	get orientation(): Orientation {
		return this._orientation;
	}

	set orientation(orientation: Orientation) {
		if (this._orientation === orientation) {
			return;
		}

		this._orientation = orientation;

		if (this.element) {
			this.element.classList.toggle('horizontal', this.orientation === Orientation.HORIZONTAL);
			this.element.classList.toggle('vertical', this.orientation === Orientation.VERTICAL);
		}

		if (this.header) {
			this.updateHeader();
		}
	}

	render(): void {
		this.element.classList.toggle('expanded', this.isExpanded());
		this.element.classList.toggle('horizontal', this.orientation === Orientation.HORIZONTAL);
		this.element.classList.toggle('vertical', this.orientation === Orientation.VERTICAL);

		this.header = $('.pane-header');
		append(this.element, this.header);
		this.header.setAttribute('tabindex', '0');
		// Use role button so the aria-expanded state gets read https://github.com/microsoft/vscode/issues/95996
		this.header.setAttribute('role', 'button');
		this.header.setAttribute('aria-label', this.ariaHeaderLabel);
		this.renderHeader(this.header);

		const focusTracker = trackFocus(this.header);
		this._register(focusTracker);
		this._register(focusTracker.onDidFocus(() => this.header?.classList.add('focused'), null));
		this._register(focusTracker.onDidBlur(() => this.header?.classList.remove('focused'), null));

		this.updateHeader();

		const eventDisposables = this._register(new DisposableStore());
		const onKeyDown = this._register(new DomEmitter(this.header, 'keydown'));
		const onHeaderKeyDown = Event.map(onKeyDown.event, e => new StandardKeyboardEvent(e), eventDisposables);

		this._register(Event.filter(onHeaderKeyDown, e => e.keyCode === KeyCode.Enter || e.keyCode === KeyCode.Space, eventDisposables)(() => this.setExpanded(!this.isExpanded()), null));

		this._register(Event.filter(onHeaderKeyDown, e => e.keyCode === KeyCode.LeftArrow, eventDisposables)(() => this.setExpanded(false), null));

		this._register(Event.filter(onHeaderKeyDown, e => e.keyCode === KeyCode.RightArrow, eventDisposables)(() => this.setExpanded(true), null));

		this._register(Gesture.addTarget(this.header));

		const header = this.header;
		[EventType.CLICK, TouchEventType.Tap].forEach(eventType => {
			this._register(addDisposableListener(header, eventType, e => {
				if (!e.defaultPrevented) {
					this.setExpanded(!this.isExpanded());
				}
			}));
		});

		this.body = append(this.element, $('.pane-body'));

		// Only render the body if it will be visible
		// Otherwise, render it when the pane is expanded
		if (!this._bodyRendered && this.isExpanded()) {
			this.renderBody(this.body);
			this._bodyRendered = true;
		}

		if (!this.isExpanded()) {
			this.body.remove();
		}
	}

	layout(size: number): void {
		const headerSize = this.headerVisible ? Pane.HEADER_SIZE : 0;

		const width = this._orientation === Orientation.VERTICAL ? this.orthogonalSize : size;
		const height = this._orientation === Orientation.VERTICAL ? size - headerSize : this.orthogonalSize - headerSize;

		if (this.isExpanded()) {
			this.body.classList.toggle('wide', width >= 600);
			this.layoutBody(height, width);
			this.expandedSize = size;
		}
	}

	style(styles: IPaneStyles): void {
		this.styles = styles;

		if (!this.header) {
			return;
		}

		this.updateHeader();
	}

	protected updateHeader(): void {
		if (!this.header) {
			return;
		}
		const expanded = !this.headerVisible || this.isExpanded();

		if (this.collapsible) {
			this.header.setAttribute('tabindex', '0');
			this.header.setAttribute('role', 'button');
		} else {
			this.header.removeAttribute('tabindex');
			this.header.removeAttribute('role');
		}

		this.header.style.lineHeight = `${this.headerSize}px`;
		this.header.classList.toggle('hidden', !this.headerVisible);
		this.header.classList.toggle('expanded', expanded);
		this.header.classList.toggle('not-collapsible', !this.collapsible);
		this.header.setAttribute('aria-expanded', String(expanded));

		this.header.style.color = this.collapsible ? this.styles.headerForeground ?? '' : '';
		this.header.style.backgroundColor = (this.collapsible ? this.styles.headerBackground : 'transparent') ?? '';
		this.header.style.borderTop = this.styles.headerBorder && this.orientation === Orientation.VERTICAL ? `1px solid ${this.styles.headerBorder}` : '';
		this.element.style.borderLeft = this.styles.leftBorder && this.orientation === Orientation.HORIZONTAL ? `1px solid ${this.styles.leftBorder}` : '';
	}

	protected abstract renderHeader(container: HTMLElement): void;
	protected abstract renderBody(container: HTMLElement): void;
	protected abstract layoutBody(height: number, width: number): void;
}

interface IDndContext {
	draggable: PaneDraggable | null;
}

class PaneDraggable extends Disposable {

	private static readonly DefaultDragOverBackgroundColor = new Color(new RGBA(128, 128, 128, 0.5));

	private dragOverCounter = 0; // see https://github.com/microsoft/vscode/issues/14470

	private _onDidDrop = this._register(new Emitter<{ from: Pane; to: Pane }>());
	readonly onDidDrop = this._onDidDrop.event;

	constructor(private pane: Pane, private dnd: IPaneDndController, private context: IDndContext) {
		super();

		pane.draggableElement!.draggable = true;
		this._register(addDisposableListener(pane.draggableElement!, 'dragstart', e => this.onDragStart(e)));
		this._register(addDisposableListener(pane.dropTargetElement, 'dragenter', e => this.onDragEnter(e)));
		this._register(addDisposableListener(pane.dropTargetElement, 'dragleave', e => this.onDragLeave(e)));
		this._register(addDisposableListener(pane.dropTargetElement, 'dragend', e => this.onDragEnd(e)));
		this._register(addDisposableListener(pane.dropTargetElement, 'drop', e => this.onDrop(e)));
	}

	private onDragStart(e: DragEvent): void {
		if (!this.dnd.canDrag(this.pane) || !e.dataTransfer) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		const label = this.pane.draggableElement?.textContent || '';

		e.dataTransfer.effectAllowed = 'move';

		if (isFirefox) {
			// Firefox: requires to set a text data transfer to get going
			e.dataTransfer?.setData(DataTransfers.TEXT, label);
		}

		applyDragImage(e, this.pane.element, label);

		this.context.draggable = this;
	}

	private onDragEnter(e: DragEvent): void {
		if (!this.context.draggable || this.context.draggable === this) {
			return;
		}

		if (!this.dnd.canDrop(this.context.draggable.pane, this.pane)) {
			return;
		}

		this.dragOverCounter++;
		this.render();
	}

	private onDragLeave(e: DragEvent): void {
		if (!this.context.draggable || this.context.draggable === this) {
			return;
		}

		if (!this.dnd.canDrop(this.context.draggable.pane, this.pane)) {
			return;
		}

		this.dragOverCounter--;

		if (this.dragOverCounter === 0) {
			this.render();
		}
	}

	private onDragEnd(e: DragEvent): void {
		if (!this.context.draggable) {
			return;
		}

		this.dragOverCounter = 0;
		this.render();
		this.context.draggable = null;
	}

	private onDrop(e: DragEvent): void {
		if (!this.context.draggable) {
			return;
		}

		EventHelper.stop(e);

		this.dragOverCounter = 0;
		this.render();

		if (this.dnd.canDrop(this.context.draggable.pane, this.pane) && this.context.draggable !== this) {
			this._onDidDrop.fire({ from: this.context.draggable.pane, to: this.pane });
		}

		this.context.draggable = null;
	}

	private render(): void {
		let backgroundColor: string | null = null;

		if (this.dragOverCounter > 0) {
			backgroundColor = this.pane.dropBackground ?? PaneDraggable.DefaultDragOverBackgroundColor.toString();
		}

		this.pane.dropTargetElement.style.backgroundColor = backgroundColor || '';
	}
}

export interface IPaneDndController {
	canDrag(pane: Pane): boolean;
	canDrop(pane: Pane, overPane: Pane): boolean;
}

export class DefaultPaneDndController implements IPaneDndController {

	canDrag(pane: Pane): boolean {
		return true;
	}

	canDrop(pane: Pane, overPane: Pane): boolean {
		return true;
	}
}

export interface IPaneViewOptions {
	dnd?: IPaneDndController;
	orientation?: Orientation;
}

interface IPaneItem {
	pane: Pane;
	disposable: IDisposable;
}

export class PaneView extends Disposable {

	private dnd: IPaneDndController | undefined;
	private dndContext: IDndContext = { draggable: null };
	readonly element: HTMLElement;
	private paneItems: IPaneItem[] = [];
	private orthogonalSize: number = 0;
	private size: number = 0;
	private splitview: SplitView;
	private animationTimer: number | undefined = undefined;

	private _onDidDrop = this._register(new Emitter<{ from: Pane; to: Pane }>());
	readonly onDidDrop: Event<{ from: Pane; to: Pane }> = this._onDidDrop.event;

	orientation: Orientation;
	private boundarySashes: IBoundarySashes | undefined;
	readonly onDidSashChange: Event<number>;
	readonly onDidSashReset: Event<number>;
	readonly onDidScroll: Event<ScrollEvent>;

	constructor(container: HTMLElement, options: IPaneViewOptions = {}) {
		super();

		this.dnd = options.dnd;
		this.orientation = options.orientation ?? Orientation.VERTICAL;
		this.element = append(container, $('.monaco-pane-view'));
		this.splitview = this._register(new SplitView(this.element, { orientation: this.orientation }));
		this.onDidSashReset = this.splitview.onDidSashReset;
		this.onDidSashChange = this.splitview.onDidSashChange;
		this.onDidScroll = this.splitview.onDidScroll;

		const eventDisposables = this._register(new DisposableStore());
		const onKeyDown = this._register(new DomEmitter(this.element, 'keydown'));
		const onHeaderKeyDown = Event.map(Event.filter(onKeyDown.event, e => isHTMLElement(e.target) && e.target.classList.contains('pane-header'), eventDisposables), e => new StandardKeyboardEvent(e), eventDisposables);

		this._register(Event.filter(onHeaderKeyDown, e => e.keyCode === KeyCode.UpArrow, eventDisposables)(() => this.focusPrevious()));
		this._register(Event.filter(onHeaderKeyDown, e => e.keyCode === KeyCode.DownArrow, eventDisposables)(() => this.focusNext()));
	}

	addPane(pane: Pane, size: number, index = this.splitview.length): void {
		const disposables = new DisposableStore();
		pane.onDidChangeExpansionState(this.setupAnimation, this, disposables);

		const paneItem = { pane: pane, disposable: disposables };
		this.paneItems.splice(index, 0, paneItem);
		pane.orientation = this.orientation;
		pane.orthogonalSize = this.orthogonalSize;
		this.splitview.addView(pane, size, index);

		if (this.dnd) {
			const draggable = new PaneDraggable(pane, this.dnd, this.dndContext);
			disposables.add(draggable);
			disposables.add(draggable.onDidDrop(this._onDidDrop.fire, this._onDidDrop));
		}
	}

	removePane(pane: Pane): void {
		const index = this.paneItems.findIndex(item => item.pane === pane);

		if (index === -1) {
			return;
		}

		this.splitview.removeView(index, pane.isExpanded() ? Sizing.Distribute : undefined);
		const paneItem = this.paneItems.splice(index, 1)[0];
		paneItem.disposable.dispose();
	}

	movePane(from: Pane, to: Pane): void {
		const fromIndex = this.paneItems.findIndex(item => item.pane === from);
		const toIndex = this.paneItems.findIndex(item => item.pane === to);

		if (fromIndex === -1 || toIndex === -1) {
			return;
		}

		const [paneItem] = this.paneItems.splice(fromIndex, 1);
		this.paneItems.splice(toIndex, 0, paneItem);

		this.splitview.moveView(fromIndex, toIndex);
	}

	resizePane(pane: Pane, size: number): void {
		const index = this.paneItems.findIndex(item => item.pane === pane);

		if (index === -1) {
			return;
		}

		this.splitview.resizeView(index, size);
	}

	getPaneSize(pane: Pane): number {
		const index = this.paneItems.findIndex(item => item.pane === pane);

		if (index === -1) {
			return -1;
		}

		return this.splitview.getViewSize(index);
	}

	layout(height: number, width: number): void {
		this.orthogonalSize = this.orientation === Orientation.VERTICAL ? width : height;
		this.size = this.orientation === Orientation.HORIZONTAL ? width : height;

		for (const paneItem of this.paneItems) {
			paneItem.pane.orthogonalSize = this.orthogonalSize;
		}

		this.splitview.layout(this.size);
	}

	setBoundarySashes(sashes: IBoundarySashes) {
		this.boundarySashes = sashes;
		this.updateSplitviewOrthogonalSashes(sashes);
	}

	private updateSplitviewOrthogonalSashes(sashes: IBoundarySashes | undefined) {
		if (this.orientation === Orientation.VERTICAL) {
			this.splitview.orthogonalStartSash = sashes?.left;
			this.splitview.orthogonalEndSash = sashes?.right;
		} else {
			this.splitview.orthogonalEndSash = sashes?.bottom;
		}
	}

	flipOrientation(height: number, width: number): void {
		this.orientation = this.orientation === Orientation.VERTICAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
		const paneSizes = this.paneItems.map(pane => this.getPaneSize(pane.pane));

		this.splitview.dispose();
		clearNode(this.element);

		this.splitview = this._register(new SplitView(this.element, { orientation: this.orientation }));
		this.updateSplitviewOrthogonalSashes(this.boundarySashes);

		const newOrthogonalSize = this.orientation === Orientation.VERTICAL ? width : height;
		const newSize = this.orientation === Orientation.HORIZONTAL ? width : height;

		this.paneItems.forEach((pane, index) => {
			pane.pane.orthogonalSize = newOrthogonalSize;
			pane.pane.orientation = this.orientation;

			const viewSize = this.size === 0 ? 0 : (newSize * paneSizes[index]) / this.size;
			this.splitview.addView(pane.pane, viewSize, index);
		});

		this.size = newSize;
		this.orthogonalSize = newOrthogonalSize;

		this.splitview.layout(this.size);
	}

	private setupAnimation(): void {
		if (typeof this.animationTimer === 'number') {
			getWindow(this.element).clearTimeout(this.animationTimer);
		}

		this.element.classList.add('animated');

		this.animationTimer = getWindow(this.element).setTimeout(() => {
			this.animationTimer = undefined;
			this.element.classList.remove('animated');
		}, 200);
	}

	private getPaneHeaderElements(): HTMLElement[] {
		// eslint-disable-next-line no-restricted-syntax
		return [...this.element.querySelectorAll('.pane-header')] as HTMLElement[];
	}

	private focusPrevious(): void {
		const headers = this.getPaneHeaderElements();
		const index = headers.indexOf(this.element.ownerDocument.activeElement as HTMLElement);

		if (index === -1) {
			return;
		}

		headers[Math.max(index - 1, 0)].focus();
	}

	private focusNext(): void {
		const headers = this.getPaneHeaderElements();
		const index = headers.indexOf(this.element.ownerDocument.activeElement as HTMLElement);

		if (index === -1) {
			return;
		}

		headers[Math.min(index + 1, headers.length - 1)].focus();
	}

	override dispose(): void {
		super.dispose();

		this.paneItems.forEach(i => i.disposable.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/splitview/splitview.css]---
Location: vscode-main/src/vs/base/browser/ui/splitview/splitview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-split-view2 {
	position: relative;
	width: 100%;
	height: 100%;
}

.monaco-split-view2 > .sash-container {
	position: absolute;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.monaco-split-view2 > .sash-container > .monaco-sash {
	pointer-events: initial;
}

.monaco-split-view2 > .monaco-scrollable-element {
	width: 100%;
	height: 100%;
}

.monaco-split-view2 > .monaco-scrollable-element > .split-view-container {
	width: 100%;
	height: 100%;
	white-space: nowrap;
	position: relative;
}

.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view {
	white-space: initial;
	position: absolute;
}

.monaco-split-view2 > .monaco-scrollable-element > .split-view-container > .split-view-view:not(.visible) {
	display: none;
}

.monaco-split-view2.vertical > .monaco-scrollable-element > .split-view-container > .split-view-view {
	width: 100%;
}

.monaco-split-view2.horizontal > .monaco-scrollable-element > .split-view-container > .split-view-view {
	height: 100%;
}

.monaco-split-view2.separator-border > .monaco-scrollable-element > .split-view-container > .split-view-view:not(:first-child)::before {
	content: ' ';
	position: absolute;
	top: 0;
	left: 0;
	z-index: 5;
	pointer-events: none;
	background-color: var(--separator-border);
}

.monaco-split-view2.separator-border.horizontal > .monaco-scrollable-element > .split-view-container > .split-view-view:not(:first-child)::before {
	height: 100%;
	width: 1px;
}

.monaco-split-view2.separator-border.vertical > .monaco-scrollable-element > .split-view-container > .split-view-view:not(:first-child)::before {
	height: 1px;
	width: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/splitview/splitview.ts]---
Location: vscode-main/src/vs/base/browser/ui/splitview/splitview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, append, getWindow, scheduleAtNextAnimationFrame } from '../../dom.js';
import { DomEmitter } from '../../event.js';
import { ISashEvent as IBaseSashEvent, Orientation, Sash, SashState } from '../sash/sash.js';
import { SmoothScrollableElement } from '../scrollbar/scrollableElement.js';
import { pushToEnd, pushToStart, range } from '../../../common/arrays.js';
import { Color } from '../../../common/color.js';
import { Emitter, Event } from '../../../common/event.js';
import { combinedDisposable, Disposable, dispose, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { clamp } from '../../../common/numbers.js';
import { Scrollable, ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import * as types from '../../../common/types.js';
import './splitview.css';
export { Orientation } from '../sash/sash.js';

export interface ISplitViewStyles {
	readonly separatorBorder: Color;
}

const defaultStyles: ISplitViewStyles = {
	separatorBorder: Color.transparent
};

export const enum LayoutPriority {
	Normal,
	Low,
	High
}

/**
 * The interface to implement for views within a {@link SplitView}.
 *
 * An optional {@link TLayoutContext layout context type} may be used in order to
 * pass along layout contextual data from the {@link SplitView.layout} method down
 * to each view's {@link IView.layout} calls.
 */
export interface IView<TLayoutContext = undefined> {

	/**
	 * The DOM element for this view.
	 */
	readonly element: HTMLElement;

	/**
	 * A minimum size for this view.
	 *
	 * @remarks If none, set it to `0`.
	 */
	readonly minimumSize: number;

	/**
	 * A maximum size for this view.
	 *
	 * @remarks If none, set it to `Number.POSITIVE_INFINITY`.
	 */
	readonly maximumSize: number;

	/**
	 * The priority of the view when the {@link SplitView.resize layout} algorithm
	 * runs. Views with higher priority will be resized first.
	 *
	 * @remarks Only used when `proportionalLayout` is false.
	 */
	readonly priority?: LayoutPriority;

	/**
	 * If the {@link SplitView} supports {@link ISplitViewOptions.proportionalLayout proportional layout},
	 * this property allows for finer control over the proportional layout algorithm, per view.
	 *
	 * @defaultValue `true`
	 */
	readonly proportionalLayout?: boolean;

	/**
	 * Whether the view will snap whenever the user reaches its minimum size or
	 * attempts to grow it beyond the minimum size.
	 *
	 * @defaultValue `false`
	 */
	readonly snap?: boolean;

	/**
	 * View instances are supposed to fire the {@link IView.onDidChange} event whenever
	 * any of the constraint properties have changed:
	 *
	 * - {@link IView.minimumSize}
	 * - {@link IView.maximumSize}
	 * - {@link IView.priority}
	 * - {@link IView.snap}
	 *
	 * The SplitView will relayout whenever that happens. The event can optionally emit
	 * the view's preferred size for that relayout.
	 */
	readonly onDidChange: Event<number | undefined>;

	/**
	 * This will be called by the {@link SplitView} during layout. A view meant to
	 * pass along the layout information down to its descendants.
	 *
	 * @param size The size of this view, in pixels.
	 * @param offset The offset of this view, relative to the start of the {@link SplitView}.
	 * @param context The optional {@link IView layout context} passed to {@link SplitView.layout}.
	 */
	layout(size: number, offset: number, context: TLayoutContext | undefined): void;

	/**
	 * This will be called by the {@link SplitView} whenever this view is made
	 * visible or hidden.
	 *
	 * @param visible Whether the view becomes visible.
	 */
	setVisible?(visible: boolean): void;
}

/**
 * A descriptor for a {@link SplitView} instance.
 */
export interface ISplitViewDescriptor<TLayoutContext = undefined, TView extends IView<TLayoutContext> = IView<TLayoutContext>> {

	/**
	 * The layout size of the {@link SplitView}.
	 */
	readonly size: number;

	/**
	 * Descriptors for each {@link IView view}.
	 */
	readonly views: {

		/**
		 * Whether the {@link IView view} is visible.
		 *
		 * @defaultValue `true`
		 */
		readonly visible?: boolean;

		/**
		 * The size of the {@link IView view}.
		 *
		 * @defaultValue `true`
		 */
		readonly size: number;

		/**
		 * The size of the {@link IView view}.
		 *
		 * @defaultValue `true`
		 */
		readonly view: TView;
	}[];
}

export interface ISplitViewOptions<TLayoutContext = undefined, TView extends IView<TLayoutContext> = IView<TLayoutContext>> {

	/**
	 * Which axis the views align on.
	 *
	 * @defaultValue `Orientation.VERTICAL`
	 */
	readonly orientation?: Orientation;

	/**
	 * Styles overriding the {@link defaultStyles default ones}.
	 */
	readonly styles?: ISplitViewStyles;

	/**
	 * Make Alt-drag the default drag operation.
	 */
	readonly inverseAltBehavior?: boolean;

	/**
	 * Resize each view proportionally when resizing the SplitView.
	 *
	 * @defaultValue `true`
	 */
	readonly proportionalLayout?: boolean;

	/**
	 * An initial description of this {@link SplitView} instance, allowing
	 * to initialze all views within the ctor.
	 */
	readonly descriptor?: ISplitViewDescriptor<TLayoutContext, TView>;

	/**
	 * The scrollbar visibility setting for whenever the views within
	 * the {@link SplitView} overflow.
	 */
	readonly scrollbarVisibility?: ScrollbarVisibility;

	/**
	 * Override the orthogonal size of sashes.
	 */
	readonly getSashOrthogonalSize?: () => number;
}

interface ISashEvent {
	readonly sash: Sash;
	readonly start: number;
	readonly current: number;
	readonly alt: boolean;
}

type ViewItemSize = number | { cachedVisibleSize: number };

abstract class ViewItem<TLayoutContext, TView extends IView<TLayoutContext>> {

	private _size: number;
	set size(size: number) {
		this._size = size;
	}

	get size(): number {
		return this._size;
	}

	private _cachedVisibleSize: number | undefined = undefined;
	get cachedVisibleSize(): number | undefined { return this._cachedVisibleSize; }

	get visible(): boolean {
		return typeof this._cachedVisibleSize === 'undefined';
	}

	setVisible(visible: boolean, size?: number): void {
		if (visible === this.visible) {
			return;
		}

		if (visible) {
			this.size = clamp(this._cachedVisibleSize!, this.viewMinimumSize, this.viewMaximumSize);
			this._cachedVisibleSize = undefined;
		} else {
			this._cachedVisibleSize = typeof size === 'number' ? size : this.size;
			this.size = 0;
		}

		this.container.classList.toggle('visible', visible);

		try {
			this.view.setVisible?.(visible);
		} catch (e) {
			console.error('Splitview: Failed to set visible view');
			console.error(e);
		}
	}

	get minimumSize(): number { return this.visible ? this.view.minimumSize : 0; }
	get viewMinimumSize(): number { return this.view.minimumSize; }

	get maximumSize(): number { return this.visible ? this.view.maximumSize : 0; }
	get viewMaximumSize(): number { return this.view.maximumSize; }

	get priority(): LayoutPriority | undefined { return this.view.priority; }
	get proportionalLayout(): boolean { return this.view.proportionalLayout ?? true; }
	get snap(): boolean { return !!this.view.snap; }

	set enabled(enabled: boolean) {
		this.container.style.pointerEvents = enabled ? '' : 'none';
	}

	constructor(
		protected container: HTMLElement,
		readonly view: TView,
		size: ViewItemSize,
		private disposable: IDisposable
	) {
		if (typeof size === 'number') {
			this._size = size;
			this._cachedVisibleSize = undefined;
			container.classList.add('visible');
		} else {
			this._size = 0;
			this._cachedVisibleSize = size.cachedVisibleSize;
		}
	}

	layout(offset: number, layoutContext: TLayoutContext | undefined): void {
		this.layoutContainer(offset);

		try {
			this.view.layout(this.size, offset, layoutContext);
		} catch (e) {
			console.error('Splitview: Failed to layout view');
			console.error(e);
		}
	}

	abstract layoutContainer(offset: number): void;

	dispose(): void {
		this.disposable.dispose();
	}
}

class VerticalViewItem<TLayoutContext, TView extends IView<TLayoutContext>> extends ViewItem<TLayoutContext, TView> {

	layoutContainer(offset: number): void {
		this.container.style.top = `${offset}px`;
		this.container.style.height = `${this.size}px`;
	}
}

class HorizontalViewItem<TLayoutContext, TView extends IView<TLayoutContext>> extends ViewItem<TLayoutContext, TView> {

	layoutContainer(offset: number): void {
		this.container.style.left = `${offset}px`;
		this.container.style.width = `${this.size}px`;
	}
}

interface ISashItem {
	sash: Sash;
	disposable: IDisposable;
}

interface ISashDragSnapState {
	readonly index: number;
	readonly limitDelta: number;
	readonly size: number;
}

interface ISashDragState {
	index: number;
	start: number;
	current: number;
	sizes: number[];
	minDelta: number;
	maxDelta: number;
	alt: boolean;
	snapBefore: ISashDragSnapState | undefined;
	snapAfter: ISashDragSnapState | undefined;
	disposable: IDisposable;
}

enum State {
	Idle,
	Busy
}

/**
 * When adding or removing views, uniformly distribute the entire split view space among
 * all views.
 */
export type DistributeSizing = { type: 'distribute' };

/**
 * When adding a view, make space for it by reducing the size of another view,
 * indexed by the provided `index`.
 */
export type SplitSizing = { type: 'split'; index: number };

/**
 * When adding a view, use DistributeSizing when all pre-existing views are
 * distributed evenly, otherwise use SplitSizing.
 */
export type AutoSizing = { type: 'auto'; index: number };

/**
 * When adding or removing views, assume the view is invisible.
 */
export type InvisibleSizing = { type: 'invisible'; cachedVisibleSize: number };

/**
 * When adding or removing views, the sizing provides fine grained
 * control over how other views get resized.
 */
export type Sizing = DistributeSizing | SplitSizing | AutoSizing | InvisibleSizing;

export namespace Sizing {

	/**
	 * When adding or removing views, distribute the delta space among
	 * all other views.
	 */
	export const Distribute: DistributeSizing = { type: 'distribute' };

	/**
	 * When adding or removing views, split the delta space with another
	 * specific view, indexed by the provided `index`.
	 */
	export function Split(index: number): SplitSizing { return { type: 'split', index }; }

	/**
	 * When adding a view, use DistributeSizing when all pre-existing views are
	 * distributed evenly, otherwise use SplitSizing.
	 */
	export function Auto(index: number): AutoSizing { return { type: 'auto', index }; }

	/**
	 * When adding or removing views, assume the view is invisible.
	 */
	export function Invisible(cachedVisibleSize: number): InvisibleSizing { return { type: 'invisible', cachedVisibleSize }; }
}

/**
 * The {@link SplitView} is the UI component which implements a one dimensional
 * flex-like layout algorithm for a collection of {@link IView} instances, which
 * are essentially HTMLElement instances with the following size constraints:
 *
 * - {@link IView.minimumSize}
 * - {@link IView.maximumSize}
 * - {@link IView.priority}
 * - {@link IView.snap}
 *
 * In case the SplitView doesn't have enough size to fit all views, it will overflow
 * its content with a scrollbar.
 *
 * In between each pair of views there will be a {@link Sash} allowing the user
 * to resize the views, making sure the constraints are respected.
 *
 * An optional {@link TLayoutContext layout context type} may be used in order to
 * pass along layout contextual data from the {@link SplitView.layout} method down
 * to each view's {@link IView.layout} calls.
 *
 * Features:
 * - Flex-like layout algorithm
 * - Snap support
 * - Orthogonal sash support, for corner sashes
 * - View hide/show support
 * - View swap/move support
 * - Alt key modifier behavior, macOS style
 */
export class SplitView<TLayoutContext = undefined, TView extends IView<TLayoutContext> = IView<TLayoutContext>> extends Disposable {

	/**
	 * This {@link SplitView}'s orientation.
	 */
	readonly orientation: Orientation;

	/**
	 * The DOM element representing this {@link SplitView}.
	 */
	readonly el: HTMLElement;

	private sashContainer: HTMLElement;
	private viewContainer: HTMLElement;
	private scrollable: Scrollable;
	private scrollableElement: SmoothScrollableElement;
	private size = 0;
	private layoutContext: TLayoutContext | undefined;
	private _contentSize = 0;
	private proportions: (number | undefined)[] | undefined = undefined;
	private viewItems: ViewItem<TLayoutContext, TView>[] = [];
	sashItems: ISashItem[] = []; // used in tests
	private sashDragState: ISashDragState | undefined;
	private state: State = State.Idle;
	private inverseAltBehavior: boolean;
	private proportionalLayout: boolean;
	private readonly getSashOrthogonalSize: { (): number } | undefined;

	private _onDidSashChange = this._register(new Emitter<number>());
	private _onDidSashReset = this._register(new Emitter<number>());
	private _orthogonalStartSash: Sash | undefined;
	private _orthogonalEndSash: Sash | undefined;
	private _startSnappingEnabled = true;
	private _endSnappingEnabled = true;

	/**
	 * The sum of all views' sizes.
	 */
	get contentSize(): number { return this._contentSize; }

	/**
	 * Fires whenever the user resizes a {@link Sash sash}.
	 */
	readonly onDidSashChange = this._onDidSashChange.event;

	/**
	 * Fires whenever the user double clicks a {@link Sash sash}.
	 */
	readonly onDidSashReset = this._onDidSashReset.event;

	/**
	 * Fires whenever the split view is scrolled.
	 */
	readonly onDidScroll: Event<ScrollEvent>;

	/**
	 * The amount of views in this {@link SplitView}.
	 */
	get length(): number {
		return this.viewItems.length;
	}

	/**
	 * The minimum size of this {@link SplitView}.
	 */
	get minimumSize(): number {
		return this.viewItems.reduce((r, item) => r + item.minimumSize, 0);
	}

	/**
	 * The maximum size of this {@link SplitView}.
	 */
	get maximumSize(): number {
		return this.length === 0 ? Number.POSITIVE_INFINITY : this.viewItems.reduce((r, item) => r + item.maximumSize, 0);
	}

	get orthogonalStartSash(): Sash | undefined { return this._orthogonalStartSash; }
	get orthogonalEndSash(): Sash | undefined { return this._orthogonalEndSash; }
	get startSnappingEnabled(): boolean { return this._startSnappingEnabled; }
	get endSnappingEnabled(): boolean { return this._endSnappingEnabled; }

	/**
	 * A reference to a sash, perpendicular to all sashes in this {@link SplitView},
	 * located at the left- or top-most side of the SplitView.
	 * Corner sashes will be created automatically at the intersections.
	 */
	set orthogonalStartSash(sash: Sash | undefined) {
		for (const sashItem of this.sashItems) {
			sashItem.sash.orthogonalStartSash = sash;
		}

		this._orthogonalStartSash = sash;
	}

	/**
	 * A reference to a sash, perpendicular to all sashes in this {@link SplitView},
	 * located at the right- or bottom-most side of the SplitView.
	 * Corner sashes will be created automatically at the intersections.
	 */
	set orthogonalEndSash(sash: Sash | undefined) {
		for (const sashItem of this.sashItems) {
			sashItem.sash.orthogonalEndSash = sash;
		}

		this._orthogonalEndSash = sash;
	}

	/**
	 * The internal sashes within this {@link SplitView}.
	 */
	get sashes(): readonly Sash[] {
		return this.sashItems.map(s => s.sash);
	}

	/**
	 * Enable/disable snapping at the beginning of this {@link SplitView}.
	 */
	set startSnappingEnabled(startSnappingEnabled: boolean) {
		if (this._startSnappingEnabled === startSnappingEnabled) {
			return;
		}

		this._startSnappingEnabled = startSnappingEnabled;
		this.updateSashEnablement();
	}

	/**
	 * Enable/disable snapping at the end of this {@link SplitView}.
	 */
	set endSnappingEnabled(endSnappingEnabled: boolean) {
		if (this._endSnappingEnabled === endSnappingEnabled) {
			return;
		}

		this._endSnappingEnabled = endSnappingEnabled;
		this.updateSashEnablement();
	}

	/**
	 * Create a new {@link SplitView} instance.
	 */
	constructor(container: HTMLElement, options: ISplitViewOptions<TLayoutContext, TView> = {}) {
		super();

		this.orientation = options.orientation ?? Orientation.VERTICAL;
		this.inverseAltBehavior = options.inverseAltBehavior ?? false;
		this.proportionalLayout = options.proportionalLayout ?? true;
		this.getSashOrthogonalSize = options.getSashOrthogonalSize;

		this.el = document.createElement('div');
		this.el.classList.add('monaco-split-view2');
		this.el.classList.add(this.orientation === Orientation.VERTICAL ? 'vertical' : 'horizontal');
		container.appendChild(this.el);

		this.sashContainer = append(this.el, $('.sash-container'));
		this.viewContainer = $('.split-view-container');

		this.scrollable = this._register(new Scrollable({
			forceIntegerValues: true,
			smoothScrollDuration: 125,
			scheduleAtNextAnimationFrame: callback => scheduleAtNextAnimationFrame(getWindow(this.el), callback),
		}));
		this.scrollableElement = this._register(new SmoothScrollableElement(this.viewContainer, {
			vertical: this.orientation === Orientation.VERTICAL ? (options.scrollbarVisibility ?? ScrollbarVisibility.Auto) : ScrollbarVisibility.Hidden,
			horizontal: this.orientation === Orientation.HORIZONTAL ? (options.scrollbarVisibility ?? ScrollbarVisibility.Auto) : ScrollbarVisibility.Hidden
		}, this.scrollable));

		// https://github.com/microsoft/vscode/issues/157737
		const onDidScrollViewContainer = this._register(new DomEmitter(this.viewContainer, 'scroll')).event;
		this._register(onDidScrollViewContainer(_ => {
			const position = this.scrollableElement.getScrollPosition();
			const scrollLeft = Math.abs(this.viewContainer.scrollLeft - position.scrollLeft) <= 1 ? undefined : this.viewContainer.scrollLeft;
			const scrollTop = Math.abs(this.viewContainer.scrollTop - position.scrollTop) <= 1 ? undefined : this.viewContainer.scrollTop;

			if (scrollLeft !== undefined || scrollTop !== undefined) {
				this.scrollableElement.setScrollPosition({ scrollLeft, scrollTop });
			}
		}));

		this.onDidScroll = this.scrollableElement.onScroll;
		this._register(this.onDidScroll(e => {
			if (e.scrollTopChanged) {
				this.viewContainer.scrollTop = e.scrollTop;
			}

			if (e.scrollLeftChanged) {
				this.viewContainer.scrollLeft = e.scrollLeft;
			}
		}));

		append(this.el, this.scrollableElement.getDomNode());

		this.style(options.styles || defaultStyles);

		// We have an existing set of view, add them now
		if (options.descriptor) {
			this.size = options.descriptor.size;
			options.descriptor.views.forEach((viewDescriptor, index) => {
				const sizing = types.isUndefined(viewDescriptor.visible) || viewDescriptor.visible ? viewDescriptor.size : { type: 'invisible', cachedVisibleSize: viewDescriptor.size } satisfies InvisibleSizing;

				const view = viewDescriptor.view;
				this.doAddView(view, sizing, index, true);
			});

			// Initialize content size and proportions for first layout
			this._contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
			this.saveProportions();
		}
	}

	style(styles: ISplitViewStyles): void {
		if (styles.separatorBorder.isTransparent()) {
			this.el.classList.remove('separator-border');
			this.el.style.removeProperty('--separator-border');
		} else {
			this.el.classList.add('separator-border');
			this.el.style.setProperty('--separator-border', styles.separatorBorder.toString());
		}
	}

	/**
	 * Add a {@link IView view} to this {@link SplitView}.
	 *
	 * @param view The view to add.
	 * @param size Either a fixed size, or a dynamic {@link Sizing} strategy.
	 * @param index The index to insert the view on.
	 * @param skipLayout Whether layout should be skipped.
	 */
	addView(view: TView, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {
		this.doAddView(view, size, index, skipLayout);
	}

	/**
	 * Remove a {@link IView view} from this {@link SplitView}.
	 *
	 * @param index The index where the {@link IView view} is located.
	 * @param sizing Whether to distribute other {@link IView view}'s sizes.
	 */
	removeView(index: number, sizing?: Sizing): TView {
		if (index < 0 || index >= this.viewItems.length) {
			throw new Error('Index out of bounds');
		}

		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		try {
			if (sizing?.type === 'auto') {
				if (this.areViewsDistributed()) {
					sizing = { type: 'distribute' };
				} else {
					sizing = { type: 'split', index: sizing.index };
				}
			}

			// Save referene view, in case of `split` sizing
			const referenceViewItem = sizing?.type === 'split' ? this.viewItems[sizing.index] : undefined;

			// Remove view
			const viewItemToRemove = this.viewItems.splice(index, 1)[0];

			// Resize reference view, in case of `split` sizing
			if (referenceViewItem) {
				referenceViewItem.size += viewItemToRemove.size;
			}

			// Remove sash
			if (this.viewItems.length >= 1) {
				const sashIndex = Math.max(index - 1, 0);
				const sashItem = this.sashItems.splice(sashIndex, 1)[0];
				sashItem.disposable.dispose();
			}

			this.relayout();

			if (sizing?.type === 'distribute') {
				this.distributeViewSizes();
			}

			const result = viewItemToRemove.view;
			viewItemToRemove.dispose();
			return result;

		} finally {
			this.state = State.Idle;
		}
	}

	removeAllViews(): TView[] {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		try {
			const viewItems = this.viewItems.splice(0, this.viewItems.length);

			for (const viewItem of viewItems) {
				viewItem.dispose();
			}

			const sashItems = this.sashItems.splice(0, this.sashItems.length);

			for (const sashItem of sashItems) {
				sashItem.disposable.dispose();
			}

			this.relayout();
			return viewItems.map(i => i.view);

		} finally {
			this.state = State.Idle;
		}
	}

	/**
	 * Move a {@link IView view} to a different index.
	 *
	 * @param from The source index.
	 * @param to The target index.
	 */
	moveView(from: number, to: number): void {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		const cachedVisibleSize = this.getViewCachedVisibleSize(from);
		const sizing = typeof cachedVisibleSize === 'undefined' ? this.getViewSize(from) : Sizing.Invisible(cachedVisibleSize);
		const view = this.removeView(from);
		this.addView(view, sizing, to);
	}


	/**
	 * Swap two {@link IView views}.
	 *
	 * @param from The source index.
	 * @param to The target index.
	 */
	swapViews(from: number, to: number): void {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		if (from > to) {
			return this.swapViews(to, from);
		}

		const fromSize = this.getViewSize(from);
		const toSize = this.getViewSize(to);
		const toView = this.removeView(to);
		const fromView = this.removeView(from);

		this.addView(toView, fromSize, from);
		this.addView(fromView, toSize, to);
	}

	/**
	 * Returns whether the {@link IView view} is visible.
	 *
	 * @param index The {@link IView view} index.
	 */
	isViewVisible(index: number): boolean {
		if (index < 0 || index >= this.viewItems.length) {
			throw new Error('Index out of bounds');
		}

		const viewItem = this.viewItems[index];
		return viewItem.visible;
	}

	/**
	 * Set a {@link IView view}'s visibility.
	 *
	 * @param index The {@link IView view} index.
	 * @param visible Whether the {@link IView view} should be visible.
	 */
	setViewVisible(index: number, visible: boolean): void {
		if (index < 0 || index >= this.viewItems.length) {
			throw new Error('Index out of bounds');
		}

		const viewItem = this.viewItems[index];
		viewItem.setVisible(visible);

		this.distributeEmptySpace(index);
		this.layoutViews();
		this.saveProportions();
	}

	/**
	 * Returns the {@link IView view}'s size previously to being hidden.
	 *
	 * @param index The {@link IView view} index.
	 */
	getViewCachedVisibleSize(index: number): number | undefined {
		if (index < 0 || index >= this.viewItems.length) {
			throw new Error('Index out of bounds');
		}

		const viewItem = this.viewItems[index];
		return viewItem.cachedVisibleSize;
	}

	/**
	 * Layout the {@link SplitView}.
	 *
	 * @param size The entire size of the {@link SplitView}.
	 * @param layoutContext An optional layout context to pass along to {@link IView views}.
	 */
	layout(size: number, layoutContext?: TLayoutContext): void {
		const previousSize = Math.max(this.size, this._contentSize);
		this.size = size;
		this.layoutContext = layoutContext;

		if (!this.proportions) {
			const indexes = range(this.viewItems.length);
			const lowPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.Low);
			const highPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.High);

			this.resize(this.viewItems.length - 1, size - previousSize, undefined, lowPriorityIndexes, highPriorityIndexes);
		} else {
			let total = 0;

			for (let i = 0; i < this.viewItems.length; i++) {
				const item = this.viewItems[i];
				const proportion = this.proportions[i];

				if (typeof proportion === 'number') {
					total += proportion;
				} else {
					size -= item.size;
				}
			}

			for (let i = 0; i < this.viewItems.length; i++) {
				const item = this.viewItems[i];
				const proportion = this.proportions[i];

				if (typeof proportion === 'number' && total > 0) {
					item.size = clamp(Math.round(proportion * size / total), item.minimumSize, item.maximumSize);
				}
			}
		}

		this.distributeEmptySpace();
		this.layoutViews();
	}

	private saveProportions(): void {
		if (this.proportionalLayout && this._contentSize > 0) {
			this.proportions = this.viewItems.map(v => v.proportionalLayout && v.visible ? v.size / this._contentSize : undefined);
		}
	}

	private onSashStart({ sash, start, alt }: ISashEvent): void {
		for (const item of this.viewItems) {
			item.enabled = false;
		}

		const index = this.sashItems.findIndex(item => item.sash === sash);

		// This way, we can press Alt while we resize a sash, macOS style!
		const disposable = combinedDisposable(
			addDisposableListener(this.el.ownerDocument.body, 'keydown', e => resetSashDragState(this.sashDragState!.current, e.altKey)),
			addDisposableListener(this.el.ownerDocument.body, 'keyup', () => resetSashDragState(this.sashDragState!.current, false))
		);

		const resetSashDragState = (start: number, alt: boolean) => {
			const sizes = this.viewItems.map(i => i.size);
			let minDelta = Number.NEGATIVE_INFINITY;
			let maxDelta = Number.POSITIVE_INFINITY;

			if (this.inverseAltBehavior) {
				alt = !alt;
			}

			if (alt) {
				// When we're using the last sash with Alt, we're resizing
				// the view to the left/up, instead of right/down as usual
				// Thus, we must do the inverse of the usual
				const isLastSash = index === this.sashItems.length - 1;

				if (isLastSash) {
					const viewItem = this.viewItems[index];
					minDelta = (viewItem.minimumSize - viewItem.size) / 2;
					maxDelta = (viewItem.maximumSize - viewItem.size) / 2;
				} else {
					const viewItem = this.viewItems[index + 1];
					minDelta = (viewItem.size - viewItem.maximumSize) / 2;
					maxDelta = (viewItem.size - viewItem.minimumSize) / 2;
				}
			}

			let snapBefore: ISashDragSnapState | undefined;
			let snapAfter: ISashDragSnapState | undefined;

			if (!alt) {
				const upIndexes = range(index, -1);
				const downIndexes = range(index + 1, this.viewItems.length);
				const minDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].minimumSize - sizes[i]), 0);
				const maxDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].viewMaximumSize - sizes[i]), 0);
				const maxDeltaDown = downIndexes.length === 0 ? Number.POSITIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].minimumSize), 0);
				const minDeltaDown = downIndexes.length === 0 ? Number.NEGATIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].viewMaximumSize), 0);
				const minDelta = Math.max(minDeltaUp, minDeltaDown);
				const maxDelta = Math.min(maxDeltaDown, maxDeltaUp);
				const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
				const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

				if (typeof snapBeforeIndex === 'number') {
					const viewItem = this.viewItems[snapBeforeIndex];
					const halfSize = Math.floor(viewItem.viewMinimumSize / 2);

					snapBefore = {
						index: snapBeforeIndex,
						limitDelta: viewItem.visible ? minDelta - halfSize : minDelta + halfSize,
						size: viewItem.size
					};
				}

				if (typeof snapAfterIndex === 'number') {
					const viewItem = this.viewItems[snapAfterIndex];
					const halfSize = Math.floor(viewItem.viewMinimumSize / 2);

					snapAfter = {
						index: snapAfterIndex,
						limitDelta: viewItem.visible ? maxDelta + halfSize : maxDelta - halfSize,
						size: viewItem.size
					};
				}
			}

			this.sashDragState = { start, current: start, index, sizes, minDelta, maxDelta, alt, snapBefore, snapAfter, disposable };
		};

		resetSashDragState(start, alt);
	}

	private onSashChange({ current }: ISashEvent): void {
		const { index, start, sizes, alt, minDelta, maxDelta, snapBefore, snapAfter } = this.sashDragState!;
		this.sashDragState!.current = current;

		const delta = current - start;
		const newDelta = this.resize(index, delta, sizes, undefined, undefined, minDelta, maxDelta, snapBefore, snapAfter);

		if (alt) {
			const isLastSash = index === this.sashItems.length - 1;
			const newSizes = this.viewItems.map(i => i.size);
			const viewItemIndex = isLastSash ? index : index + 1;
			const viewItem = this.viewItems[viewItemIndex];
			const newMinDelta = viewItem.size - viewItem.maximumSize;
			const newMaxDelta = viewItem.size - viewItem.minimumSize;
			const resizeIndex = isLastSash ? index - 1 : index + 1;

			this.resize(resizeIndex, -newDelta, newSizes, undefined, undefined, newMinDelta, newMaxDelta);
		}

		this.distributeEmptySpace();
		this.layoutViews();
	}

	private onSashEnd(index: number): void {
		this._onDidSashChange.fire(index);
		this.sashDragState!.disposable.dispose();
		this.saveProportions();

		for (const item of this.viewItems) {
			item.enabled = true;
		}
	}

	private onViewChange(item: ViewItem<TLayoutContext, TView>, size: number | undefined): void {
		const index = this.viewItems.indexOf(item);

		if (index < 0 || index >= this.viewItems.length) {
			return;
		}

		size = typeof size === 'number' ? size : item.size;
		size = clamp(size, item.minimumSize, item.maximumSize);

		if (this.inverseAltBehavior && index > 0) {
			// In this case, we want the view to grow or shrink both sides equally
			// so we just resize the "left" side by half and let `resize` do the clamping magic
			this.resize(index - 1, Math.floor((item.size - size) / 2));
			this.distributeEmptySpace();
			this.layoutViews();
		} else {
			item.size = size;
			this.relayout([index], undefined);
		}
	}

	/**
	 * Resize a {@link IView view} within the {@link SplitView}.
	 *
	 * @param index The {@link IView view} index.
	 * @param size The {@link IView view} size.
	 */
	resizeView(index: number, size: number): void {
		if (index < 0 || index >= this.viewItems.length) {
			return;
		}

		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		try {
			const indexes = range(this.viewItems.length).filter(i => i !== index);
			const lowPriorityIndexes = [...indexes.filter(i => this.viewItems[i].priority === LayoutPriority.Low), index];
			const highPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.High);

			const item = this.viewItems[index];
			size = Math.round(size);
			size = clamp(size, item.minimumSize, Math.min(item.maximumSize, this.size));

			item.size = size;
			this.relayout(lowPriorityIndexes, highPriorityIndexes);
		} finally {
			this.state = State.Idle;
		}
	}

	/**
	 * Returns whether all other {@link IView views} are at their minimum size.
	 */
	isViewExpanded(index: number): boolean {
		if (index < 0 || index >= this.viewItems.length) {
			return false;
		}

		for (const item of this.viewItems) {
			if (item !== this.viewItems[index] && item.size > item.minimumSize) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Distribute the entire {@link SplitView} size among all {@link IView views}.
	 */
	distributeViewSizes(): void {
		const flexibleViewItems: ViewItem<TLayoutContext, TView>[] = [];
		let flexibleSize = 0;

		for (const item of this.viewItems) {
			if (item.maximumSize - item.minimumSize > 0) {
				flexibleViewItems.push(item);
				flexibleSize += item.size;
			}
		}

		const size = Math.floor(flexibleSize / flexibleViewItems.length);

		for (const item of flexibleViewItems) {
			item.size = clamp(size, item.minimumSize, item.maximumSize);
		}

		const indexes = range(this.viewItems.length);
		const lowPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.Low);
		const highPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.High);

		this.relayout(lowPriorityIndexes, highPriorityIndexes);
	}

	/**
	 * Returns the size of a {@link IView view}.
	 */
	getViewSize(index: number): number {
		if (index < 0 || index >= this.viewItems.length) {
			return -1;
		}

		return this.viewItems[index].size;
	}

	private doAddView(view: TView, size: number | Sizing, index = this.viewItems.length, skipLayout?: boolean): void {
		if (this.state !== State.Idle) {
			throw new Error('Cant modify splitview');
		}

		this.state = State.Busy;

		try {
			// Add view
			const container = $('.split-view-view');

			if (index === this.viewItems.length) {
				this.viewContainer.appendChild(container);
			} else {
				this.viewContainer.insertBefore(container, this.viewContainer.children.item(index));
			}

			const onChangeDisposable = view.onDidChange(size => this.onViewChange(item, size));
			const containerDisposable = toDisposable(() => container.remove());
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

			// Add sash
			if (this.viewItems.length > 1) {
				const opts = { orthogonalStartSash: this.orthogonalStartSash, orthogonalEndSash: this.orthogonalEndSash };

				const sash = this.orientation === Orientation.VERTICAL
					? new Sash(this.sashContainer, { getHorizontalSashTop: s => this.getSashPosition(s), getHorizontalSashWidth: this.getSashOrthogonalSize }, { ...opts, orientation: Orientation.HORIZONTAL })
					: new Sash(this.sashContainer, { getVerticalSashLeft: s => this.getSashPosition(s), getVerticalSashHeight: this.getSashOrthogonalSize }, { ...opts, orientation: Orientation.VERTICAL });

				const sashEventMapper = this.orientation === Orientation.VERTICAL
					? (e: IBaseSashEvent) => ({ sash, start: e.startY, current: e.currentY, alt: e.altKey })
					: (e: IBaseSashEvent) => ({ sash, start: e.startX, current: e.currentX, alt: e.altKey });

				const onStart = Event.map(sash.onDidStart, sashEventMapper);
				const onStartDisposable = onStart(this.onSashStart, this);
				const onChange = Event.map(sash.onDidChange, sashEventMapper);
				const onChangeDisposable = onChange(this.onSashChange, this);
				const onEnd = Event.map(sash.onDidEnd, () => this.sashItems.findIndex(item => item.sash === sash));
				const onEndDisposable = onEnd(this.onSashEnd, this);

				const onDidResetDisposable = sash.onDidReset(() => {
					const index = this.sashItems.findIndex(item => item.sash === sash);
					const upIndexes = range(index, -1);
					const downIndexes = range(index + 1, this.viewItems.length);
					const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
					const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

					if (typeof snapBeforeIndex === 'number' && !this.viewItems[snapBeforeIndex].visible) {
						return;
					}

					if (typeof snapAfterIndex === 'number' && !this.viewItems[snapAfterIndex].visible) {
						return;
					}

					this._onDidSashReset.fire(index);
				});

				const disposable = combinedDisposable(onStartDisposable, onChangeDisposable, onEndDisposable, onDidResetDisposable, sash);
				const sashItem: ISashItem = { sash, disposable };

				this.sashItems.splice(index - 1, 0, sashItem);
			}

			container.appendChild(view.element);

			let highPriorityIndexes: number[] | undefined;

			if (typeof size !== 'number' && size.type === 'split') {
				highPriorityIndexes = [size.index];
			}

			if (!skipLayout) {
				this.relayout([index], highPriorityIndexes);
			}


			if (!skipLayout && typeof size !== 'number' && size.type === 'distribute') {
				this.distributeViewSizes();
			}

		} finally {
			this.state = State.Idle;
		}
	}

	private relayout(lowPriorityIndexes?: number[], highPriorityIndexes?: number[]): void {
		const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);

		this.resize(this.viewItems.length - 1, this.size - contentSize, undefined, lowPriorityIndexes, highPriorityIndexes);
		this.distributeEmptySpace();
		this.layoutViews();
		this.saveProportions();
	}

	private resize(
		index: number,
		delta: number,
		sizes = this.viewItems.map(i => i.size),
		lowPriorityIndexes?: number[],
		highPriorityIndexes?: number[],
		overloadMinDelta: number = Number.NEGATIVE_INFINITY,
		overloadMaxDelta: number = Number.POSITIVE_INFINITY,
		snapBefore?: ISashDragSnapState,
		snapAfter?: ISashDragSnapState
	): number {
		if (index < 0 || index >= this.viewItems.length) {
			return 0;
		}

		const upIndexes = range(index, -1);
		const downIndexes = range(index + 1, this.viewItems.length);

		if (highPriorityIndexes) {
			for (const index of highPriorityIndexes) {
				pushToStart(upIndexes, index);
				pushToStart(downIndexes, index);
			}
		}

		if (lowPriorityIndexes) {
			for (const index of lowPriorityIndexes) {
				pushToEnd(upIndexes, index);
				pushToEnd(downIndexes, index);
			}
		}

		const upItems = upIndexes.map(i => this.viewItems[i]);
		const upSizes = upIndexes.map(i => sizes[i]);

		const downItems = downIndexes.map(i => this.viewItems[i]);
		const downSizes = downIndexes.map(i => sizes[i]);

		const minDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].minimumSize - sizes[i]), 0);
		const maxDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].maximumSize - sizes[i]), 0);
		const maxDeltaDown = downIndexes.length === 0 ? Number.POSITIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].minimumSize), 0);
		const minDeltaDown = downIndexes.length === 0 ? Number.NEGATIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].maximumSize), 0);
		const minDelta = Math.max(minDeltaUp, minDeltaDown, overloadMinDelta);
		const maxDelta = Math.min(maxDeltaDown, maxDeltaUp, overloadMaxDelta);

		let snapped = false;

		if (snapBefore) {
			const snapView = this.viewItems[snapBefore.index];
			const visible = delta >= snapBefore.limitDelta;
			snapped = visible !== snapView.visible;
			snapView.setVisible(visible, snapBefore.size);
		}

		if (!snapped && snapAfter) {
			const snapView = this.viewItems[snapAfter.index];
			const visible = delta < snapAfter.limitDelta;
			snapped = visible !== snapView.visible;
			snapView.setVisible(visible, snapAfter.size);
		}

		if (snapped) {
			return this.resize(index, delta, sizes, lowPriorityIndexes, highPriorityIndexes, overloadMinDelta, overloadMaxDelta);
		}

		delta = clamp(delta, minDelta, maxDelta);

		for (let i = 0, deltaUp = delta; i < upItems.length; i++) {
			const item = upItems[i];
			const size = clamp(upSizes[i] + deltaUp, item.minimumSize, item.maximumSize);
			const viewDelta = size - upSizes[i];

			deltaUp -= viewDelta;
			item.size = size;
		}

		for (let i = 0, deltaDown = delta; i < downItems.length; i++) {
			const item = downItems[i];
			const size = clamp(downSizes[i] - deltaDown, item.minimumSize, item.maximumSize);
			const viewDelta = size - downSizes[i];

			deltaDown += viewDelta;
			item.size = size;
		}

		return delta;
	}

	private distributeEmptySpace(lowPriorityIndex?: number): void {
		const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
		let emptyDelta = this.size - contentSize;

		const indexes = range(this.viewItems.length - 1, -1);
		const lowPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.Low);
		const highPriorityIndexes = indexes.filter(i => this.viewItems[i].priority === LayoutPriority.High);

		for (const index of highPriorityIndexes) {
			pushToStart(indexes, index);
		}

		for (const index of lowPriorityIndexes) {
			pushToEnd(indexes, index);
		}

		if (typeof lowPriorityIndex === 'number') {
			pushToEnd(indexes, lowPriorityIndex);
		}

		for (let i = 0; emptyDelta !== 0 && i < indexes.length; i++) {
			const item = this.viewItems[indexes[i]];
			const size = clamp(item.size + emptyDelta, item.minimumSize, item.maximumSize);
			const viewDelta = size - item.size;

			emptyDelta -= viewDelta;
			item.size = size;
		}
	}

	private layoutViews(): void {
		// Save new content size
		this._contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);

		// Layout views
		let offset = 0;

		for (const viewItem of this.viewItems) {
			viewItem.layout(offset, this.layoutContext);
			offset += viewItem.size;
		}

		// Layout sashes
		this.sashItems.forEach(item => item.sash.layout());
		this.updateSashEnablement();
		this.updateScrollableElement();
	}

	private updateScrollableElement(): void {
		if (this.orientation === Orientation.VERTICAL) {
			this.scrollableElement.setScrollDimensions({
				height: this.size,
				scrollHeight: this._contentSize
			});
		} else {
			this.scrollableElement.setScrollDimensions({
				width: this.size,
				scrollWidth: this._contentSize
			});
		}
	}

	private updateSashEnablement(): void {
		let previous = false;
		const collapsesDown = this.viewItems.map(i => previous = (i.size - i.minimumSize > 0) || previous);

		previous = false;
		const expandsDown = this.viewItems.map(i => previous = (i.maximumSize - i.size > 0) || previous);

		const reverseViews = [...this.viewItems].reverse();
		previous = false;
		const collapsesUp = reverseViews.map(i => previous = (i.size - i.minimumSize > 0) || previous).reverse();

		previous = false;
		const expandsUp = reverseViews.map(i => previous = (i.maximumSize - i.size > 0) || previous).reverse();

		let position = 0;
		for (let index = 0; index < this.sashItems.length; index++) {
			const { sash } = this.sashItems[index];
			const viewItem = this.viewItems[index];
			position += viewItem.size;

			const min = !(collapsesDown[index] && expandsUp[index + 1]);
			const max = !(expandsDown[index] && collapsesUp[index + 1]);

			if (min && max) {
				const upIndexes = range(index, -1);
				const downIndexes = range(index + 1, this.viewItems.length);
				const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
				const snapAfterIndex = this.findFirstSnapIndex(downIndexes);

				const snappedBefore = typeof snapBeforeIndex === 'number' && !this.viewItems[snapBeforeIndex].visible;
				const snappedAfter = typeof snapAfterIndex === 'number' && !this.viewItems[snapAfterIndex].visible;

				if (snappedBefore && collapsesUp[index] && (position > 0 || this.startSnappingEnabled)) {
					sash.state = SashState.AtMinimum;
				} else if (snappedAfter && collapsesDown[index] && (position < this._contentSize || this.endSnappingEnabled)) {
					sash.state = SashState.AtMaximum;
				} else {
					sash.state = SashState.Disabled;
				}
			} else if (min && !max) {
				sash.state = SashState.AtMinimum;
			} else if (!min && max) {
				sash.state = SashState.AtMaximum;
			} else {
				sash.state = SashState.Enabled;
			}
		}
	}

	private getSashPosition(sash: Sash): number {
		let position = 0;

		for (let i = 0; i < this.sashItems.length; i++) {
			position += this.viewItems[i].size;

			if (this.sashItems[i].sash === sash) {
				return position;
			}
		}

		return 0;
	}

	private findFirstSnapIndex(indexes: number[]): number | undefined {
		// visible views first
		for (const index of indexes) {
			const viewItem = this.viewItems[index];

			if (!viewItem.visible) {
				continue;
			}

			if (viewItem.snap) {
				return index;
			}
		}

		// then, hidden views
		for (const index of indexes) {
			const viewItem = this.viewItems[index];

			if (viewItem.visible && viewItem.maximumSize - viewItem.minimumSize > 0) {
				return undefined;
			}

			if (!viewItem.visible && viewItem.snap) {
				return index;
			}
		}

		return undefined;
	}

	private areViewsDistributed() {
		let min = undefined, max = undefined;

		for (const view of this.viewItems) {
			min = min === undefined ? view.size : Math.min(min, view.size);
			max = max === undefined ? view.size : Math.max(max, view.size);

			if (max - min > 2) {
				return false;
			}
		}

		return true;
	}

	override dispose(): void {
		this.sashDragState?.disposable.dispose();

		dispose(this.viewItems);
		this.viewItems = [];

		this.sashItems.forEach(i => i.disposable.dispose());
		this.sashItems = [];

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/table/table.css]---
Location: vscode-main/src/vs/base/browser/ui/table/table.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-table {
	display: flex;
	flex-direction: column;
	position: relative;
	height: 100%;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
}

.monaco-table > .monaco-split-view2 {
	border-bottom: 1px solid transparent;
}

.monaco-table > .monaco-list {
	flex: 1;
}

.monaco-table-tr {
	display: flex;
	height: 100%;
}

.monaco-table-th {
	width: 100%;
	height: 100%;
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-table-th,
.monaco-table-td {
	box-sizing: border-box;
	flex-shrink: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.monaco-table > .monaco-split-view2 .monaco-sash.vertical::before {
	content: "";
	position: absolute;
	left: calc(var(--vscode-sash-size) / 2);
	width: 0;
	border-left: 1px solid transparent;
}

.monaco-enable-motion .monaco-table > .monaco-split-view2,
.monaco-enable-motion .monaco-table > .monaco-split-view2 .monaco-sash.vertical::before {
	transition: border-color 0.2s ease-out;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/table/table.ts]---
Location: vscode-main/src/vs/base/browser/ui/table/table.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListContextMenuEvent, IListEvent, IListGestureEvent, IListMouseEvent, IListRenderer, IListTouchEvent } from '../list/list.js';
import { Event } from '../../../common/event.js';

export interface ITableColumn<TRow, TCell> {
	readonly label: string;
	readonly tooltip?: string;
	readonly weight: number;
	readonly templateId: string;

	readonly minimumWidth?: number;
	readonly maximumWidth?: number;
	readonly onDidChangeWidthConstraints?: Event<void>;

	project(row: TRow): TCell;
}

export interface ITableVirtualDelegate<TRow> {
	readonly headerRowHeight: number;
	getHeight(row: TRow): number;
}

export interface ITableRenderer<TCell, TTemplateData> extends IListRenderer<TCell, TTemplateData> { }

export interface ITableEvent<TRow> extends IListEvent<TRow> { }
export interface ITableMouseEvent<TRow> extends IListMouseEvent<TRow> { }
export interface ITableTouchEvent<TRow> extends IListTouchEvent<TRow> { }
export interface ITableGestureEvent<TRow> extends IListGestureEvent<TRow> { }
export interface ITableContextMenuEvent<TRow> extends IListContextMenuEvent<TRow> { }

export class TableError extends Error {

	constructor(user: string, message: string) {
		super(`TableError [${user}] ${message}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/table/tableWidget.ts]---
Location: vscode-main/src/vs/base/browser/ui/table/tableWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, clearNode, getContentHeight, getContentWidth } from '../../dom.js';
import { createStyleSheet } from '../../domStylesheets.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IListElementRenderDetails, IListRenderer, IListVirtualDelegate } from '../list/list.js';
import { IListOptions, IListOptionsUpdate, IListStyles, List, unthemedListStyles } from '../list/listWidget.js';
import { ISplitViewDescriptor, IView, Orientation, SplitView } from '../splitview/splitview.js';
import { ITableColumn, ITableContextMenuEvent, ITableEvent, ITableGestureEvent, ITableMouseEvent, ITableRenderer, ITableTouchEvent, ITableVirtualDelegate } from './table.js';
import { Emitter, Event } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import { ISpliceable } from '../../../common/sequence.js';
import './table.css';

// TODO@joao
type TCell = any;

interface RowTemplateData {
	readonly container: HTMLElement;
	readonly cellContainers: HTMLElement[];
	readonly cellTemplateData: unknown[];
}

class TableListRenderer<TRow> implements IListRenderer<TRow, RowTemplateData> {

	static TemplateId = 'row';
	readonly templateId = TableListRenderer.TemplateId;
	private renderers: ITableRenderer<TCell, unknown>[];
	private renderedTemplates = new Set<RowTemplateData>();

	constructor(
		private columns: ITableColumn<TRow, TCell>[],
		renderers: ITableRenderer<TCell, unknown>[],
		private getColumnSize: (index: number) => number
	) {
		const rendererMap = new Map(renderers.map(r => [r.templateId, r]));
		this.renderers = [];

		for (const column of columns) {
			const renderer = rendererMap.get(column.templateId);

			if (!renderer) {
				throw new Error(`Table cell renderer for template id ${column.templateId} not found.`);
			}

			this.renderers.push(renderer);
		}
	}

	renderTemplate(container: HTMLElement) {
		const rowContainer = append(container, $('.monaco-table-tr'));
		const cellContainers: HTMLElement[] = [];
		const cellTemplateData: unknown[] = [];

		for (let i = 0; i < this.columns.length; i++) {
			const renderer = this.renderers[i];
			const cellContainer = append(rowContainer, $('.monaco-table-td', { 'data-col-index': i }));

			cellContainer.style.width = `${this.getColumnSize(i)}px`;
			cellContainers.push(cellContainer);
			cellTemplateData.push(renderer.renderTemplate(cellContainer));
		}

		const result = { container, cellContainers, cellTemplateData };
		this.renderedTemplates.add(result);

		return result;
	}

	renderElement(element: TRow, index: number, templateData: RowTemplateData, renderDetails?: IListElementRenderDetails): void {
		for (let i = 0; i < this.columns.length; i++) {
			const column = this.columns[i];
			const cell = column.project(element);
			const renderer = this.renderers[i];
			renderer.renderElement(cell, index, templateData.cellTemplateData[i], renderDetails);
		}
	}

	disposeElement(element: TRow, index: number, templateData: RowTemplateData, renderDetails?: IListElementRenderDetails): void {
		for (let i = 0; i < this.columns.length; i++) {
			const renderer = this.renderers[i];

			if (renderer.disposeElement) {
				const column = this.columns[i];
				const cell = column.project(element);

				renderer.disposeElement(cell, index, templateData.cellTemplateData[i], renderDetails);
			}
		}
	}

	disposeTemplate(templateData: RowTemplateData): void {
		for (let i = 0; i < this.columns.length; i++) {
			const renderer = this.renderers[i];
			renderer.disposeTemplate(templateData.cellTemplateData[i]);
		}

		clearNode(templateData.container);
		this.renderedTemplates.delete(templateData);
	}

	layoutColumn(index: number, size: number): void {
		for (const { cellContainers } of this.renderedTemplates) {
			cellContainers[index].style.width = `${size}px`;
		}
	}
}

function asListVirtualDelegate<TRow>(delegate: ITableVirtualDelegate<TRow>): IListVirtualDelegate<TRow> {
	return {
		getHeight(row) { return delegate.getHeight(row); },
		getTemplateId() { return TableListRenderer.TemplateId; },
	};
}

class ColumnHeader<TRow, TCell> extends Disposable implements IView {

	readonly element: HTMLElement;

	get minimumSize() { return this.column.minimumWidth ?? 120; }
	get maximumSize() { return this.column.maximumWidth ?? Number.POSITIVE_INFINITY; }
	get onDidChange() { return this.column.onDidChangeWidthConstraints ?? Event.None; }

	private _onDidLayout = new Emitter<[number, number]>();
	readonly onDidLayout = this._onDidLayout.event;

	constructor(readonly column: ITableColumn<TRow, TCell>, private index: number) {
		super();

		this.element = $('.monaco-table-th', { 'data-col-index': index }, column.label);

		if (column.tooltip) {
			this._register(getBaseLayerHoverDelegate().setupManagedHover(getDefaultHoverDelegate('mouse'), this.element, column.tooltip));
		}
	}

	layout(size: number): void {
		this._onDidLayout.fire([this.index, size]);
	}
}

export interface ITableOptions<TRow> extends IListOptions<TRow> { }
export interface ITableOptionsUpdate extends IListOptionsUpdate { }
export interface ITableStyles extends IListStyles { }

export class Table<TRow> implements ISpliceable<TRow>, IDisposable {

	private static InstanceCount = 0;
	readonly domId = `table_id_${++Table.InstanceCount}`;

	readonly domNode: HTMLElement;
	private splitview: SplitView;
	private list: List<TRow>;
	private styleElement: HTMLStyleElement;
	protected readonly disposables = new DisposableStore();

	private cachedWidth: number = 0;
	private cachedHeight: number = 0;

	get onDidChangeFocus(): Event<ITableEvent<TRow>> { return this.list.onDidChangeFocus; }
	get onDidChangeSelection(): Event<ITableEvent<TRow>> { return this.list.onDidChangeSelection; }

	get onDidScroll(): Event<ScrollEvent> { return this.list.onDidScroll; }
	get onMouseClick(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseClick; }
	get onMouseDblClick(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseDblClick; }
	get onMouseMiddleClick(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseMiddleClick; }
	get onPointer(): Event<ITableMouseEvent<TRow>> { return this.list.onPointer; }
	get onMouseUp(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseUp; }
	get onMouseDown(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseDown; }
	get onMouseOver(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseOver; }
	get onMouseMove(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseMove; }
	get onMouseOut(): Event<ITableMouseEvent<TRow>> { return this.list.onMouseOut; }
	get onTouchStart(): Event<ITableTouchEvent<TRow>> { return this.list.onTouchStart; }
	get onTap(): Event<ITableGestureEvent<TRow>> { return this.list.onTap; }
	get onContextMenu(): Event<ITableContextMenuEvent<TRow>> { return this.list.onContextMenu; }

	get onDidFocus(): Event<void> { return this.list.onDidFocus; }
	get onDidBlur(): Event<void> { return this.list.onDidBlur; }

	get scrollTop(): number { return this.list.scrollTop; }
	set scrollTop(scrollTop: number) { this.list.scrollTop = scrollTop; }
	get scrollLeft(): number { return this.list.scrollLeft; }
	set scrollLeft(scrollLeft: number) { this.list.scrollLeft = scrollLeft; }
	get scrollHeight(): number { return this.list.scrollHeight; }
	get renderHeight(): number { return this.list.renderHeight; }
	get onDidDispose(): Event<void> { return this.list.onDidDispose; }

	constructor(
		user: string,
		container: HTMLElement,
		private virtualDelegate: ITableVirtualDelegate<TRow>,
		private columns: ITableColumn<TRow, TCell>[],
		renderers: ITableRenderer<TCell, unknown>[],
		_options?: ITableOptions<TRow>
	) {
		this.domNode = append(container, $(`.monaco-table.${this.domId}`));

		const headers = columns.map((c, i) => this.disposables.add(new ColumnHeader(c, i)));
		const descriptor: ISplitViewDescriptor = {
			size: headers.reduce((a, b) => a + b.column.weight, 0),
			views: headers.map(view => ({ size: view.column.weight, view }))
		};

		this.splitview = this.disposables.add(new SplitView(this.domNode, {
			orientation: Orientation.HORIZONTAL,
			scrollbarVisibility: ScrollbarVisibility.Hidden,
			getSashOrthogonalSize: () => this.cachedHeight,
			descriptor
		}));

		this.splitview.el.style.height = `${virtualDelegate.headerRowHeight}px`;
		this.splitview.el.style.lineHeight = `${virtualDelegate.headerRowHeight}px`;

		const renderer = new TableListRenderer(columns, renderers, i => this.splitview.getViewSize(i));
		this.list = this.disposables.add(new List(user, this.domNode, asListVirtualDelegate(virtualDelegate), [renderer], _options));

		Event.any(...headers.map(h => h.onDidLayout))
			(([index, size]) => renderer.layoutColumn(index, size), null, this.disposables);

		this.splitview.onDidSashReset(index => {
			const totalWeight = columns.reduce((r, c) => r + c.weight, 0);
			const size = columns[index].weight / totalWeight * this.cachedWidth;
			this.splitview.resizeView(index, size);
		}, null, this.disposables);

		this.styleElement = createStyleSheet(this.domNode);
		this.style(unthemedListStyles);
	}

	getColumnLabels(): string[] {
		return this.columns.map(c => c.label);
	}

	resizeColumn(index: number, percentage: number): void {
		const size = Math.round((percentage / 100.00) * this.cachedWidth);
		this.splitview.resizeView(index, size);
	}

	updateOptions(options: ITableOptionsUpdate): void {
		this.list.updateOptions(options);
	}

	splice(start: number, deleteCount: number, elements: readonly TRow[] = []): void {
		this.list.splice(start, deleteCount, elements);
	}

	rerender(): void {
		this.list.rerender();
	}

	row(index: number): TRow {
		return this.list.element(index);
	}

	indexOf(element: TRow): number {
		return this.list.indexOf(element);
	}

	get length(): number {
		return this.list.length;
	}

	getHTMLElement(): HTMLElement {
		return this.domNode;
	}

	layout(height?: number, width?: number): void {
		height = height ?? getContentHeight(this.domNode);
		width = width ?? getContentWidth(this.domNode);

		this.cachedWidth = width;
		this.cachedHeight = height;
		this.splitview.layout(width);

		const listHeight = height - this.virtualDelegate.headerRowHeight;
		this.list.getHTMLElement().style.height = `${listHeight}px`;
		this.list.layout(listHeight, width);
	}

	triggerTypeNavigation(): void {
		this.list.triggerTypeNavigation();
	}

	style(styles: ITableStyles): void {
		const content: string[] = [];

		content.push(`.monaco-table.${this.domId} > .monaco-split-view2 .monaco-sash.vertical::before {
			top: ${this.virtualDelegate.headerRowHeight + 1}px;
			height: calc(100% - ${this.virtualDelegate.headerRowHeight}px);
		}`);

		this.styleElement.textContent = content.join('\n');
		this.list.style(styles);
	}

	domFocus(): void {
		this.list.domFocus();
	}

	setAnchor(index: number | undefined): void {
		this.list.setAnchor(index);
	}

	getAnchor(): number | undefined {
		return this.list.getAnchor();
	}

	getSelectedElements(): TRow[] {
		return this.list.getSelectedElements();
	}

	setSelection(indexes: number[], browserEvent?: UIEvent): void {
		this.list.setSelection(indexes, browserEvent);
	}

	getSelection(): number[] {
		return this.list.getSelection();
	}

	setFocus(indexes: number[], browserEvent?: UIEvent): void {
		this.list.setFocus(indexes, browserEvent);
	}

	focusNext(n = 1, loop = false, browserEvent?: UIEvent): void {
		this.list.focusNext(n, loop, browserEvent);
	}

	focusPrevious(n = 1, loop = false, browserEvent?: UIEvent): void {
		this.list.focusPrevious(n, loop, browserEvent);
	}

	focusNextPage(browserEvent?: UIEvent): Promise<void> {
		return this.list.focusNextPage(browserEvent);
	}

	focusPreviousPage(browserEvent?: UIEvent): Promise<void> {
		return this.list.focusPreviousPage(browserEvent);
	}

	focusFirst(browserEvent?: UIEvent): void {
		this.list.focusFirst(browserEvent);
	}

	focusLast(browserEvent?: UIEvent): void {
		this.list.focusLast(browserEvent);
	}

	getFocus(): number[] {
		return this.list.getFocus();
	}

	getFocusedElements(): TRow[] {
		return this.list.getFocusedElements();
	}

	getRelativeTop(index: number): number | null {
		return this.list.getRelativeTop(index);
	}

	reveal(index: number, relativeTop?: number): void {
		this.list.reveal(index, relativeTop);
	}

	dispose(): void {
		this.disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/toggle/toggle.css]---
Location: vscode-main/src/vs/base/browser/ui/toggle/toggle.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-custom-toggle {
	margin-left: 2px;
	float: left;
	cursor: pointer;
	overflow: hidden;
	width: 20px;
	height: 20px;
	border-radius: 3px;
	border: 1px solid transparent;
	padding: 1px;
	box-sizing:	border-box;
	user-select: none;
	-webkit-user-select: none;
}

.monaco-custom-toggle:hover {
	background-color: var(--vscode-inputOption-hoverBackground);
}

.hc-black .monaco-custom-toggle:hover,
.hc-light .monaco-custom-toggle:hover {
	border: 1px dashed var(--vscode-focusBorder);
}

.hc-black .monaco-custom-toggle,
.hc-light .monaco-custom-toggle {
	background: none;
}

.hc-black .monaco-custom-toggle:hover,
.hc-light .monaco-custom-toggle:hover {
	background: none;
}

.monaco-custom-toggle.monaco-checkbox {
	height: 18px;
	width: 18px;
	border: 1px solid transparent;
	border-radius: 3px;
	margin-right: 9px;
	margin-left: 0px;
	padding: 0px;
	opacity: 1;
	background-size: 16px !important;
}

.monaco-action-bar .checkbox-action-item {
	display: flex;
	align-items: center;
	border-radius: 2px;
	padding-right: 2px;
}

.monaco-action-bar .checkbox-action-item:hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-action-bar .checkbox-action-item > .monaco-custom-toggle.monaco-checkbox {
	margin-right: 4px;
}

.monaco-action-bar .checkbox-action-item > .checkbox-label {
	font-size: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/toggle/toggle.ts]---
Location: vscode-main/src/vs/base/browser/ui/toggle/toggle.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../common/actions.js';
import { Codicon } from '../../../common/codicons.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { ThemeIcon } from '../../../common/themables.js';
import { $, addDisposableListener, EventType, isActiveElement } from '../../dom.js';
import { IKeyboardEvent } from '../../keyboardEvent.js';
import { BaseActionViewItem, IActionViewItemOptions } from '../actionbar/actionViewItems.js';
import { IActionViewItemProvider } from '../actionbar/actionbar.js';
import { HoverStyle, IHoverLifecycleOptions } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { Widget } from '../widget.js';
import './toggle.css';

export interface IToggleOpts extends IToggleStyles {
	readonly actionClassName?: string;
	readonly icon?: ThemeIcon;
	readonly title: string;
	readonly isChecked: boolean;
	readonly notFocusable?: boolean;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;
}

export interface IToggleStyles {
	readonly inputActiveOptionBorder: string | undefined;
	readonly inputActiveOptionForeground: string | undefined;
	readonly inputActiveOptionBackground: string | undefined;
}

export interface ICheckboxStyles {
	readonly checkboxBackground: string | undefined;
	readonly checkboxBorder: string | undefined;
	readonly checkboxForeground: string | undefined;
	readonly checkboxDisabledBackground: string | undefined;
	readonly checkboxDisabledForeground: string | undefined;
	readonly size?: number;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;
}

export const unthemedToggleStyles = {
	inputActiveOptionBorder: '#007ACC00',
	inputActiveOptionForeground: '#FFFFFF',
	inputActiveOptionBackground: '#0E639C50'
};

export class ToggleActionViewItem extends BaseActionViewItem {

	protected readonly toggle: Toggle;

	constructor(context: unknown, action: IAction, options: IActionViewItemOptions) {
		super(context, action, options);

		const title = (<IActionViewItemOptions>this.options).keybinding ?
			`${this._action.label} (${(<IActionViewItemOptions>this.options).keybinding})` : this._action.label;
		this.toggle = this._register(new Toggle({
			actionClassName: this._action.class,
			isChecked: !!this._action.checked,
			title,
			notFocusable: true,
			inputActiveOptionBackground: options.toggleStyles?.inputActiveOptionBackground,
			inputActiveOptionBorder: options.toggleStyles?.inputActiveOptionBorder,
			inputActiveOptionForeground: options.toggleStyles?.inputActiveOptionForeground,
		}));
		this._register(this.toggle.onChange(() => {
			this._action.checked = !!this.toggle && this.toggle.checked;
		}));
	}

	override render(container: HTMLElement): void {
		this.element = container;
		this.element.appendChild(this.toggle.domNode);

		this.updateChecked();
		this.updateEnabled();
	}

	protected override updateEnabled(): void {
		if (this.toggle) {
			if (this.isEnabled()) {
				this.toggle.enable();
				this.element?.classList.remove('disabled');
			} else {
				this.toggle.disable();
				this.element?.classList.add('disabled');
			}
		}
	}

	protected override updateChecked(): void {
		this.toggle.checked = !!this._action.checked;
	}

	protected override updateLabel(): void {
		const title = (<IActionViewItemOptions>this.options).keybinding ?
			`${this._action.label} (${(<IActionViewItemOptions>this.options).keybinding})` : this._action.label;
		this.toggle.setTitle(title);
	}

	override focus(): void {
		this.toggle.domNode.tabIndex = 0;
		this.toggle.focus();
	}

	override blur(): void {
		this.toggle.domNode.tabIndex = -1;
		this.toggle.domNode.blur();
	}

	override setFocusable(focusable: boolean): void {
		this.toggle.domNode.tabIndex = focusable ? 0 : -1;
	}

}

export class Toggle extends Widget {

	private readonly _onChange = this._register(new Emitter<boolean>());
	get onChange(): Event<boolean /* via keyboard */> { return this._onChange.event; }

	private readonly _onKeyDown = this._register(new Emitter<IKeyboardEvent>());
	get onKeyDown(): Event<IKeyboardEvent> { return this._onKeyDown.event; }

	private readonly _opts: IToggleOpts;
	private _title: string;
	private _icon: ThemeIcon | undefined;
	readonly domNode: HTMLElement;

	private _checked: boolean;

	constructor(opts: IToggleOpts) {
		super();

		this._opts = opts;
		this._title = this._opts.title;
		this._checked = this._opts.isChecked;

		const classes = ['monaco-custom-toggle'];
		if (this._opts.icon) {
			this._icon = this._opts.icon;
			classes.push(...ThemeIcon.asClassNameArray(this._icon));
		}
		if (this._opts.actionClassName) {
			classes.push(...this._opts.actionClassName.split(' '));
		}
		if (this._checked) {
			classes.push('checked');
		}

		this.domNode = document.createElement('div');
		this._register(getBaseLayerHoverDelegate().setupDelayedHover(this.domNode, () => ({
			content: this._title,
			style: HoverStyle.Pointer,
		}), this._opts.hoverLifecycleOptions));
		this.domNode.classList.add(...classes);
		if (!this._opts.notFocusable) {
			this.domNode.tabIndex = 0;
		}
		this.domNode.setAttribute('role', 'checkbox');
		this.domNode.setAttribute('aria-checked', String(this._checked));

		this.setTitle(this._opts.title);
		this.applyStyles();

		this.onclick(this.domNode, (ev) => {
			if (this.enabled) {
				this.checked = !this._checked;
				this._onChange.fire(false);
				ev.preventDefault();
			}
		});

		this._register(this.ignoreGesture(this.domNode));

		this.onkeydown(this.domNode, (keyboardEvent) => {
			if (!this.enabled) {
				return;
			}

			if (keyboardEvent.keyCode === KeyCode.Space || keyboardEvent.keyCode === KeyCode.Enter) {
				this.checked = !this._checked;
				this._onChange.fire(true);
				keyboardEvent.preventDefault();
				keyboardEvent.stopPropagation();
				return;
			}

			this._onKeyDown.fire(keyboardEvent);
		});
	}

	get enabled(): boolean {
		return this.domNode.getAttribute('aria-disabled') !== 'true';
	}

	focus(): void {
		this.domNode.focus();
	}

	get checked(): boolean {
		return this._checked;
	}

	set checked(newIsChecked: boolean) {
		this._checked = newIsChecked;

		this.domNode.setAttribute('aria-checked', String(this._checked));
		this.domNode.classList.toggle('checked', this._checked);

		this.applyStyles();
	}

	setIcon(icon: ThemeIcon | undefined): void {
		if (this._icon) {
			this.domNode.classList.remove(...ThemeIcon.asClassNameArray(this._icon));
		}
		this._icon = icon;
		if (this._icon) {
			this.domNode.classList.add(...ThemeIcon.asClassNameArray(this._icon));
		}
	}

	width(): number {
		return 2 /*margin left*/ + 2 /*border*/ + 2 /*padding*/ + 16 /* icon width */;
	}

	protected applyStyles(): void {
		if (this.domNode) {
			this.domNode.style.borderColor = (this._checked && this._opts.inputActiveOptionBorder) || '';
			this.domNode.style.color = (this._checked && this._opts.inputActiveOptionForeground) || 'inherit';
			this.domNode.style.backgroundColor = (this._checked && this._opts.inputActiveOptionBackground) || '';
		}
	}

	enable(): void {
		this.domNode.setAttribute('aria-disabled', String(false));
		this.domNode.classList.remove('disabled');
	}

	disable(): void {
		this.domNode.setAttribute('aria-disabled', String(true));
		this.domNode.classList.add('disabled');
	}

	setTitle(newTitle: string): void {
		this._title = newTitle;
		this.domNode.setAttribute('aria-label', newTitle);
	}

	set visible(visible: boolean) {
		this.domNode.style.display = visible ? '' : 'none';
	}

	get visible() {
		return this.domNode.style.display !== 'none';
	}
}


abstract class BaseCheckbox extends Widget {
	static readonly CLASS_NAME = 'monaco-checkbox';

	protected readonly _onChange = this._register(new Emitter<boolean>());
	readonly onChange: Event<boolean /* via keyboard */> = this._onChange.event;

	constructor(
		protected readonly checkbox: Toggle,
		readonly domNode: HTMLElement,
		protected readonly styles: ICheckboxStyles
	) {
		super();

		this.applyStyles();
	}

	get enabled(): boolean {
		return this.checkbox.enabled;
	}

	focus(): void {
		this.domNode.focus();
	}

	hasFocus(): boolean {
		return isActiveElement(this.domNode);
	}

	enable(): void {
		this.checkbox.enable();
		this.applyStyles(true);
	}

	disable(): void {
		this.checkbox.disable();
		this.applyStyles(false);
	}

	setTitle(newTitle: string): void {
		this.checkbox.setTitle(newTitle);
	}

	protected applyStyles(enabled = this.enabled): void {
		this.domNode.style.color = (enabled ? this.styles.checkboxForeground : this.styles.checkboxDisabledForeground) || '';
		this.domNode.style.backgroundColor = (enabled ? this.styles.checkboxBackground : this.styles.checkboxDisabledBackground) || '';
		this.domNode.style.borderColor = (enabled ? this.styles.checkboxBorder : this.styles.checkboxDisabledBackground) || '';

		const size = this.styles.size || 18;
		this.domNode.style.width =
			this.domNode.style.height =
			this.domNode.style.fontSize = `${size}px`;
		this.domNode.style.fontSize = `${size - 2}px`;
	}
}

export class Checkbox extends BaseCheckbox {
	constructor(title: string, isChecked: boolean, styles: ICheckboxStyles) {
		const toggle = new Toggle({ title, isChecked, icon: Codicon.check, actionClassName: BaseCheckbox.CLASS_NAME, hoverLifecycleOptions: styles.hoverLifecycleOptions, ...unthemedToggleStyles });
		super(toggle, toggle.domNode, styles);

		this._register(toggle);
		this._register(this.checkbox.onChange(keyboard => {
			this.applyStyles();
			this._onChange.fire(keyboard);
		}));
	}

	get checked(): boolean {
		return this.checkbox.checked;
	}

	set checked(newIsChecked: boolean) {
		this.checkbox.checked = newIsChecked;
		this.applyStyles();
	}

	protected override applyStyles(enabled?: boolean): void {
		if (this.checkbox.checked) {
			this.checkbox.setIcon(Codicon.check);
		} else {
			this.checkbox.setIcon(undefined);
		}
		super.applyStyles(enabled);
	}
}

export class TriStateCheckbox extends BaseCheckbox {
	constructor(
		title: string,
		private _state: boolean | 'mixed',
		styles: ICheckboxStyles
	) {
		let icon: ThemeIcon | undefined;
		switch (_state) {
			case true:
				icon = Codicon.check;
				break;
			case 'mixed':
				icon = Codicon.dash;
				break;
			case false:
				icon = undefined;
				break;
		}
		const checkbox = new Toggle({
			title,
			isChecked: _state === true,
			icon,
			actionClassName: Checkbox.CLASS_NAME,
			hoverLifecycleOptions: styles.hoverLifecycleOptions,
			...unthemedToggleStyles
		});
		super(
			checkbox,
			checkbox.domNode,
			styles
		);

		this._register(checkbox);
		this._register(this.checkbox.onChange(keyboard => {
			this._state = this.checkbox.checked;
			this.applyStyles();
			this._onChange.fire(keyboard);
		}));
	}

	get checked(): boolean | 'mixed' {
		return this._state;
	}

	set checked(newState: boolean | 'mixed') {
		if (this._state !== newState) {
			this._state = newState;
			this.checkbox.checked = newState === true;
			this.applyStyles();
		}
	}

	protected override applyStyles(enabled?: boolean): void {
		switch (this._state) {
			case true:
				this.checkbox.setIcon(Codicon.check);
				break;
			case 'mixed':
				this.checkbox.setIcon(Codicon.dash);
				break;
			case false:
				this.checkbox.setIcon(undefined);
				break;
		}
		super.applyStyles(enabled);
	}
}

export interface ICheckboxActionViewItemOptions extends IActionViewItemOptions {
	checkboxStyles: ICheckboxStyles;
}

export class CheckboxActionViewItem extends BaseActionViewItem {

	protected readonly toggle: Checkbox;
	private cssClass?: string;

	constructor(context: unknown, action: IAction, options: ICheckboxActionViewItemOptions) {
		super(context, action, options);

		this.toggle = this._register(new Checkbox(this._action.label, !!this._action.checked, options.checkboxStyles));
		this._register(this.toggle.onChange(() => this.onChange()));
	}

	override render(container: HTMLElement): void {
		this.element = container;
		this.element.classList.add('checkbox-action-item');
		this.element.appendChild(this.toggle.domNode);
		if ((<IActionViewItemOptions>this.options).label && this._action.label) {
			const label = this.element.appendChild($('span.checkbox-label', undefined, this._action.label));
			this._register(addDisposableListener(label, EventType.CLICK, (e: MouseEvent) => {
				this.toggle.checked = !this.toggle.checked;
				e.stopPropagation();
				e.preventDefault();
				this.onChange();
			}));
		}

		this.updateEnabled();
		this.updateClass();
		this.updateChecked();
	}

	private onChange(): void {
		this._action.checked = !!this.toggle && this.toggle.checked;
		this.actionRunner.run(this._action, this._context);
	}

	protected override updateEnabled(): void {
		if (this.isEnabled()) {
			this.toggle.enable();
		} else {
			this.toggle.disable();
		}
		if (this.action.enabled) {
			this.element?.classList.remove('disabled');
		} else {
			this.element?.classList.add('disabled');
		}
	}

	protected override updateChecked(): void {
		this.toggle.checked = !!this._action.checked;
	}

	protected override updateClass(): void {
		if (this.cssClass) {
			this.toggle.domNode.classList.remove(...this.cssClass.split(' '));
		}
		this.cssClass = this.getClass();
		if (this.cssClass) {
			this.toggle.domNode.classList.add(...this.cssClass.split(' '));
		}
	}

	override focus(): void {
		this.toggle.domNode.tabIndex = 0;
		this.toggle.focus();
	}

	override blur(): void {
		this.toggle.domNode.tabIndex = -1;
		this.toggle.domNode.blur();
	}

	override setFocusable(focusable: boolean): void {
		this.toggle.domNode.tabIndex = focusable ? 0 : -1;
	}

}

/**
 * Creates an action view item provider that renders toggles for actions with a checked state
 * and falls back to default button rendering for regular actions.
 *
 * @param toggleStyles - Optional styles to apply to toggle items
 * @returns An IActionViewItemProvider that can be used with ActionBar
 */
export function createToggleActionViewItemProvider(toggleStyles?: IToggleStyles): IActionViewItemProvider {
	return (action: IAction, options: IActionViewItemOptions) => {
		// Only render as a toggle if the action has a checked property
		if (action.checked !== undefined) {
			return new ToggleActionViewItem(null, action, { ...options, toggleStyles });
		}
		// Return undefined to fall back to default button rendering
		return undefined;
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/toolbar/toolbar.css]---
Location: vscode-main/src/vs/base/browser/ui/toolbar/toolbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-toolbar {
	height: 100%;
}

.monaco-toolbar .toolbar-toggle-more {
	display: inline-block;
	padding: 0;
}

.monaco-toolbar.responsive {
	.monaco-action-bar > .actions-container > .action-item {
		flex-shrink: 1;
		min-width: 20px;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/toolbar/toolbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/toolbar/toolbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuProvider } from '../../contextmenu.js';
import { ActionBar, ActionsOrientation, IActionViewItemProvider } from '../actionbar/actionbar.js';
import { AnchorAlignment } from '../contextview/contextview.js';
import { DropdownMenuActionViewItem } from '../dropdown/dropdownActionViewItem.js';
import { Action, IAction, IActionRunner, Separator, SubmenuAction } from '../../../common/actions.js';
import { Codicon } from '../../../common/codicons.js';
import { ThemeIcon } from '../../../common/themables.js';
import { EventMultiplexer } from '../../../common/event.js';
import { ResolvedKeybinding } from '../../../common/keybindings.js';
import { Disposable, DisposableStore, toDisposable } from '../../../common/lifecycle.js';
import './toolbar.css';
import * as nls from '../../../../nls.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { createInstantHoverDelegate } from '../hover/hoverDelegateFactory.js';

const ACTION_MIN_WIDTH = 24; /* 20px codicon + 4px left padding*/

export interface IToolBarOptions {
	orientation?: ActionsOrientation;
	actionViewItemProvider?: IActionViewItemProvider;
	ariaLabel?: string;
	getKeyBinding?: (action: IAction) => ResolvedKeybinding | undefined;
	actionRunner?: IActionRunner;
	toggleMenuTitle?: string;
	anchorAlignmentProvider?: () => AnchorAlignment;
	renderDropdownAsChildElement?: boolean;
	moreIcon?: ThemeIcon;
	allowContextMenu?: boolean;
	skipTelemetry?: boolean;
	hoverDelegate?: IHoverDelegate;
	trailingSeparator?: boolean;

	/**
	 * If true, toggled primary items are highlighted with a background color.
	 */
	highlightToggledItems?: boolean;

	/**
	 * Render action with icons (default: `true`)
	 */
	icon?: boolean;

	/**
	 * Render action with label (default: `false`)
	 */
	label?: boolean;

	/**
	 * Controls the responsive behavior of the primary group of the toolbar.
	 * - `enabled`: Whether the responsive behavior is enabled.
	 * - `minItems`: The minimum number of items that should always be visible.
	 */
	responsiveBehavior?: { enabled: boolean; minItems?: number };
}

/**
 * A widget that combines an action bar for primary actions and a dropdown for secondary actions.
 */
export class ToolBar extends Disposable {
	private options: IToolBarOptions;
	protected readonly actionBar: ActionBar;
	private toggleMenuAction: ToggleMenuAction;
	private toggleMenuActionViewItem: DropdownMenuActionViewItem | undefined;
	private submenuActionViewItems: DropdownMenuActionViewItem[] = [];
	private hasSecondaryActions: boolean = false;
	private readonly element: HTMLElement;

	private _onDidChangeDropdownVisibility = this._register(new EventMultiplexer<boolean>());
	get onDidChangeDropdownVisibility() { return this._onDidChangeDropdownVisibility.event; }
	private originalPrimaryActions: ReadonlyArray<IAction> = [];
	private originalSecondaryActions: ReadonlyArray<IAction> = [];
	private hiddenActions: { action: IAction; size: number }[] = [];
	private readonly disposables = this._register(new DisposableStore());

	constructor(private readonly container: HTMLElement, contextMenuProvider: IContextMenuProvider, options: IToolBarOptions = { orientation: ActionsOrientation.HORIZONTAL }) {
		super();

		options.hoverDelegate = options.hoverDelegate ?? this._register(createInstantHoverDelegate());
		this.options = options;

		this.toggleMenuAction = this._register(new ToggleMenuAction(() => this.toggleMenuActionViewItem?.show(), options.toggleMenuTitle));

		this.element = document.createElement('div');
		this.element.className = 'monaco-toolbar';
		container.appendChild(this.element);

		this.actionBar = this._register(new ActionBar(this.element, {
			orientation: options.orientation,
			ariaLabel: options.ariaLabel,
			actionRunner: options.actionRunner,
			allowContextMenu: options.allowContextMenu,
			highlightToggledItems: options.highlightToggledItems,
			hoverDelegate: options.hoverDelegate,
			actionViewItemProvider: (action, viewItemOptions) => {
				if (action.id === ToggleMenuAction.ID) {
					this.toggleMenuActionViewItem = new DropdownMenuActionViewItem(
						action,
						{ getActions: () => this.toggleMenuAction.menuActions },
						contextMenuProvider,
						{
							actionViewItemProvider: this.options.actionViewItemProvider,
							actionRunner: this.actionRunner,
							keybindingProvider: this.options.getKeyBinding,
							classNames: ThemeIcon.asClassNameArray(options.moreIcon ?? Codicon.toolBarMore),
							anchorAlignmentProvider: this.options.anchorAlignmentProvider,
							menuAsChild: !!this.options.renderDropdownAsChildElement,
							skipTelemetry: this.options.skipTelemetry,
							isMenu: true,
							hoverDelegate: this.options.hoverDelegate
						}
					);
					this.toggleMenuActionViewItem.setActionContext(this.actionBar.context);
					this.disposables.add(this._onDidChangeDropdownVisibility.add(this.toggleMenuActionViewItem.onDidChangeVisibility));

					return this.toggleMenuActionViewItem;
				}

				if (options.actionViewItemProvider) {
					const result = options.actionViewItemProvider(action, viewItemOptions);

					if (result) {
						return result;
					}
				}

				if (action instanceof SubmenuAction) {
					const result = new DropdownMenuActionViewItem(
						action,
						action.actions,
						contextMenuProvider,
						{
							actionViewItemProvider: this.options.actionViewItemProvider,
							actionRunner: this.actionRunner,
							keybindingProvider: this.options.getKeyBinding,
							classNames: action.class,
							anchorAlignmentProvider: this.options.anchorAlignmentProvider,
							menuAsChild: !!this.options.renderDropdownAsChildElement,
							skipTelemetry: this.options.skipTelemetry,
							hoverDelegate: this.options.hoverDelegate
						}
					);
					result.setActionContext(this.actionBar.context);
					this.submenuActionViewItems.push(result);
					this.disposables.add(this._onDidChangeDropdownVisibility.add(result.onDidChangeVisibility));

					return result;
				}

				return undefined;
			}
		}));

		// Responsive support
		if (this.options.responsiveBehavior?.enabled) {
			this.element.classList.add('responsive');

			const observer = new ResizeObserver(() => {
				this.updateActions(this.element.getBoundingClientRect().width);
			});
			observer.observe(this.element);
			this._store.add(toDisposable(() => observer.disconnect()));
		}
	}

	set actionRunner(actionRunner: IActionRunner) {
		this.actionBar.actionRunner = actionRunner;
	}

	get actionRunner(): IActionRunner {
		return this.actionBar.actionRunner;
	}

	set context(context: unknown) {
		this.actionBar.context = context;
		this.toggleMenuActionViewItem?.setActionContext(context);
		for (const actionViewItem of this.submenuActionViewItems) {
			actionViewItem.setActionContext(context);
		}
	}

	getElement(): HTMLElement {
		return this.element;
	}

	focus(): void {
		this.actionBar.focus();
	}

	getItemsWidth(): number {
		let itemsWidth = 0;
		for (let i = 0; i < this.actionBar.length(); i++) {
			itemsWidth += this.actionBar.getWidth(i);
		}
		return itemsWidth;
	}

	getItemAction(indexOrElement: number | HTMLElement) {
		return this.actionBar.getAction(indexOrElement);
	}

	getItemWidth(index: number): number {
		return this.actionBar.getWidth(index);
	}

	getItemsLength(): number {
		return this.actionBar.length();
	}

	setAriaLabel(label: string): void {
		this.actionBar.setAriaLabel(label);
	}

	setActions(primaryActions: ReadonlyArray<IAction>, secondaryActions?: ReadonlyArray<IAction>): void {
		this.clear();

		// Store primary and secondary actions as rendered initially
		this.originalPrimaryActions = primaryActions ? primaryActions.slice(0) : [];
		this.originalSecondaryActions = secondaryActions ? secondaryActions.slice(0) : [];

		const primaryActionsToSet = primaryActions ? primaryActions.slice(0) : [];

		// Inject additional action to open secondary actions if present
		this.hasSecondaryActions = !!(secondaryActions && secondaryActions.length > 0);
		if (this.hasSecondaryActions && secondaryActions) {
			this.toggleMenuAction.menuActions = secondaryActions.slice(0);
			primaryActionsToSet.push(this.toggleMenuAction);
		}

		if (primaryActionsToSet.length > 0 && this.options.trailingSeparator) {
			primaryActionsToSet.push(new Separator());
		}

		primaryActionsToSet.forEach(action => {
			this.actionBar.push(action, { icon: this.options.icon ?? true, label: this.options.label ?? false, keybinding: this.getKeybindingLabel(action) });
		});

		if (this.options.responsiveBehavior?.enabled) {
			// Reset hidden actions
			this.hiddenActions.length = 0;

			// Set the minimum width
			if (this.options.responsiveBehavior?.minItems !== undefined) {
				let itemCount = this.options.responsiveBehavior.minItems;

				// Account for overflow menu
				if (
					this.originalSecondaryActions.length > 0 ||
					itemCount < this.originalPrimaryActions.length
				) {
					itemCount += 1;
				}

				this.container.style.minWidth = `${itemCount * ACTION_MIN_WIDTH}px`;
				this.element.style.minWidth = `${itemCount * ACTION_MIN_WIDTH}px`;
			} else {
				this.container.style.minWidth = `${ACTION_MIN_WIDTH}px`;
				this.element.style.minWidth = `${ACTION_MIN_WIDTH}px`;
			}

			// Update toolbar actions to fit with container width
			this.updateActions(this.element.getBoundingClientRect().width);
		}
	}

	isEmpty(): boolean {
		return this.actionBar.isEmpty();
	}

	private getKeybindingLabel(action: IAction): string | undefined {
		const key = this.options.getKeyBinding?.(action);

		return key?.getLabel() ?? undefined;
	}

	private updateActions(containerWidth: number) {
		// Actions bar is empty
		if (this.actionBar.isEmpty()) {
			return;
		}

		// Ensure that the container width respects the minimum width of the
		// element which is set based on the `responsiveBehavior.minItems` option
		containerWidth = Math.max(containerWidth, parseInt(this.element.style.minWidth));

		// Each action is assumed to have a minimum width so that actions with a label
		// can shrink to the action's minimum width. We do this so that action visibility
		// takes precedence over the action label.
		const actionBarWidth = () => this.actionBar.length() * ACTION_MIN_WIDTH;

		// Action bar fits and there are no hidden actions to show
		if (actionBarWidth() <= containerWidth && this.hiddenActions.length === 0) {
			return;
		}

		if (actionBarWidth() > containerWidth) {
			// Check for max items limit
			if (this.options.responsiveBehavior?.minItems !== undefined) {
				const primaryActionsCount = this.actionBar.hasAction(this.toggleMenuAction)
					? this.actionBar.length() - 1
					: this.actionBar.length();

				if (primaryActionsCount <= this.options.responsiveBehavior.minItems) {
					return;
				}
			}

			// Hide actions from the right
			while (actionBarWidth() > containerWidth && this.actionBar.length() > 0) {
				const index = this.originalPrimaryActions.length - this.hiddenActions.length - 1;
				if (index < 0) {
					break;
				}

				// Store the action and its size
				const size = Math.min(ACTION_MIN_WIDTH, this.getItemWidth(index));
				const action = this.originalPrimaryActions[index];
				this.hiddenActions.unshift({ action, size });

				// Remove the action
				this.actionBar.pull(index);

				// There are no secondary actions, but we have actions that we need to hide so we
				// create the overflow menu. This will ensure that another primary action will be
				// removed making space for the overflow menu.
				if (this.originalSecondaryActions.length === 0 && this.hiddenActions.length === 1) {
					this.actionBar.push(this.toggleMenuAction, {
						icon: this.options.icon ?? true,
						label: this.options.label ?? false,
						keybinding: this.getKeybindingLabel(this.toggleMenuAction),
					});
				}
			}
		} else {
			// Show actions from the top of the toggle menu
			while (this.hiddenActions.length > 0) {
				const entry = this.hiddenActions.shift()!;
				if (actionBarWidth() + entry.size > containerWidth) {
					// Not enough space to show the action
					this.hiddenActions.unshift(entry);
					break;
				}

				// Add the action
				this.actionBar.push(entry.action, {
					icon: this.options.icon ?? true,
					label: this.options.label ?? false,
					keybinding: this.getKeybindingLabel(entry.action),
					index: this.originalPrimaryActions.length - this.hiddenActions.length - 1
				});

				// There are no secondary actions, and there is only one hidden item left so we
				// remove the overflow menu making space for the last hidden action to be shown.
				if (this.originalSecondaryActions.length === 0 && this.hiddenActions.length === 1) {
					this.toggleMenuAction.menuActions = [];
					this.actionBar.pull(this.actionBar.length() - 1);
				}
			}
		}

		// Update overflow menu
		const hiddenActions = this.hiddenActions.map(entry => entry.action);
		if (this.originalSecondaryActions.length > 0 || hiddenActions.length > 0) {
			const secondaryActions = this.originalSecondaryActions.slice(0);
			this.toggleMenuAction.menuActions = Separator.join(hiddenActions, secondaryActions);
		}
	}

	private clear(): void {
		this.submenuActionViewItems = [];
		this.disposables.clear();
		this.actionBar.clear();
	}

	override dispose(): void {
		this.clear();
		this.disposables.dispose();
		super.dispose();
	}
}

export class ToggleMenuAction extends Action {

	static readonly ID = 'toolbar.toggle.more';

	private _menuActions: ReadonlyArray<IAction>;
	private toggleDropdownMenu: () => void;

	constructor(toggleDropdownMenu: () => void, title?: string) {
		title = title || nls.localize('moreActions', "More Actions...");
		super(ToggleMenuAction.ID, title, undefined, true);

		this._menuActions = [];
		this.toggleDropdownMenu = toggleDropdownMenu;
	}

	override async run(): Promise<void> {
		this.toggleDropdownMenu();
	}

	get menuActions(): ReadonlyArray<IAction> {
		return this._menuActions;
	}

	set menuActions(actions: ReadonlyArray<IAction>) {
		this._menuActions = actions;
	}
}
```

--------------------------------------------------------------------------------

````

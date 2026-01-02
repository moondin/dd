---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 167
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 167 of 552)

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

---[FILE: src/vs/base/browser/ui/list/list.css]---
Location: vscode-main/src/vs/base/browser/ui/list/list.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-list {
	position: relative;
	height: 100%;
	width: 100%;
	white-space: nowrap;
	overflow: hidden;
}

.monaco-list.mouse-support {
	user-select: none;
	-webkit-user-select: none;
}

.monaco-list > .monaco-scrollable-element {
	height: 100%;
}

.monaco-list-rows {
	position: relative;
	width: 100%;
	height: 100%;
}

.monaco-list.horizontal-scrolling .monaco-list-rows {
	width: auto;
	min-width: 100%;
}

.monaco-list-row {
	position: absolute;
	box-sizing: border-box;
	overflow: hidden;
	width: 100%;
}

.monaco-list.mouse-support .monaco-list-row {
	cursor: pointer;
	touch-action: none;
}

/* Make sure the scrollbar renders above overlays (sticky scroll) */
.monaco-list .monaco-scrollable-element > .scrollbar.vertical,
.monaco-pane-view > .monaco-split-view2.vertical > .monaco-scrollable-element > .scrollbar.vertical {
	z-index: 14;
}

/* for OS X ballistic scrolling */
.monaco-list-row.scrolling {
	display: none !important;
}

/* Focus */
.monaco-list.element-focused,
.monaco-list.selection-single,
.monaco-list.selection-multiple {
	outline: 0 !important;
}

/* Filter */

.monaco-list-type-filter-message {
	position: absolute;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	padding: 40px 1em 1em 1em;
	text-align: center;
	white-space: normal;
	opacity: 0.7;
	pointer-events: none;
}

.monaco-list-type-filter-message:empty {
	display: none;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/list.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/list.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDragAndDropData } from '../../dnd.js';
import { IKeyboardEvent } from '../../keyboardEvent.js';
import { IMouseEvent } from '../../mouseEvent.js';
import { GestureEvent } from '../../touch.js';
import { ListViewTargetSector } from './listView.js';
import { IDisposable } from '../../../common/lifecycle.js';

export interface IListVirtualDelegate<T> {
	getHeight(element: T): number;
	getTemplateId(element: T): string;
	hasDynamicHeight?(element: T): boolean;
	getDynamicHeight?(element: T): number | null;
	setDynamicHeight?(element: T, height: number): void;
}

export interface IListElementRenderDetails {
	readonly height?: number;
	readonly onScroll?: boolean;
}

export interface IListRenderer<T, TTemplateData> {
	readonly templateId: string;
	renderTemplate(container: HTMLElement): TTemplateData;
	renderElement(element: T, index: number, templateData: TTemplateData, details?: IListElementRenderDetails): void;
	disposeElement?(element: T, index: number, templateData: TTemplateData, details?: IListElementRenderDetails): void;
	disposeTemplate(templateData: TTemplateData): void;
}

export interface IListEvent<T> {
	readonly elements: readonly T[];
	readonly indexes: readonly number[];
	readonly browserEvent?: UIEvent;
}

export interface IListBrowserMouseEvent extends MouseEvent {
	isHandledByList?: boolean;
}

export interface IListMouseEvent<T> {
	readonly browserEvent: IListBrowserMouseEvent;
	readonly element: T | undefined;
	readonly index: number | undefined;
}

export interface IListTouchEvent<T> {
	readonly browserEvent: TouchEvent;
	readonly element: T | undefined;
	readonly index: number | undefined;
}

export interface IListGestureEvent<T> {
	readonly browserEvent: GestureEvent;
	readonly element: T | undefined;
	readonly index: number | undefined;
}

export interface IListDragEvent<T> {
	readonly browserEvent: DragEvent;
	readonly element: T | undefined;
	readonly index: number | undefined;
	readonly sector: ListViewTargetSector | undefined;
}

export interface IListContextMenuEvent<T> {
	readonly browserEvent: UIEvent;
	readonly element: T | undefined;
	readonly index: number | undefined;
	readonly anchor: HTMLElement | IMouseEvent;
}

export interface IIdentityProvider<T> {
	getId(element: T): { toString(): string };
}

export interface IKeyboardNavigationLabelProvider<T> {

	/**
	 * Return a keyboard navigation label(s) which will be used by
	 * the list for filtering/navigating. Return `undefined` to make
	 * an element always match.
	 */
	getKeyboardNavigationLabel(element: T): { toString(): string | undefined } | { toString(): string | undefined }[] | undefined;
}

export interface IKeyboardNavigationDelegate {
	mightProducePrintableCharacter(event: IKeyboardEvent): boolean;
}

export const enum ListDragOverEffectType {
	Copy,
	Move
}

export const enum ListDragOverEffectPosition {
	Over = 'drop-target',
	Before = 'drop-target-before',
	After = 'drop-target-after'
}

export interface ListDragOverEffect {
	type: ListDragOverEffectType;
	position?: ListDragOverEffectPosition;
}

export interface IListDragOverReaction {
	accept: boolean;
	effect?: ListDragOverEffect;
	feedback?: number[]; // use -1 for entire list
}

export const ListDragOverReactions = {
	reject(): IListDragOverReaction { return { accept: false }; },
	accept(): IListDragOverReaction { return { accept: true }; },
};

/**
 * Warning: Once passed to a list, that list takes up
 * the responsibility of disposing it.
 */
export interface IListDragAndDrop<T> extends IDisposable {
	getDragURI(element: T): string | null;
	getDragLabel?(elements: T[], originalEvent: DragEvent): string | undefined;
	onDragStart?(data: IDragAndDropData, originalEvent: DragEvent): void;
	onDragOver(data: IDragAndDropData, targetElement: T | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | IListDragOverReaction;
	onDragLeave?(data: IDragAndDropData, targetElement: T | undefined, targetIndex: number | undefined, originalEvent: DragEvent): void;
	drop(data: IDragAndDropData, targetElement: T | undefined, targetIndex: number | undefined, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void;
	onDragEnd?(originalEvent: DragEvent): void;
}

export class ListError extends Error {

	constructor(user: string, message: string) {
		super(`ListError [${user}] ${message}`);
	}
}

export abstract class CachedListVirtualDelegate<T extends object> implements IListVirtualDelegate<T> {

	private cache = new WeakMap<T, number>();

	getHeight(element: T): number {
		return this.cache.get(element) ?? this.estimateHeight(element);
	}

	protected abstract estimateHeight(element: T): number;
	abstract getTemplateId(element: T): string;

	setDynamicHeight(element: T, height: number): void {
		if (height > 0) {
			this.cache.set(element, height);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/listPaging.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/listPaging.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { range } from '../../../common/arrays.js';
import { CancellationTokenSource } from '../../../common/cancellation.js';
import { Event } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { IPagedModel } from '../../../common/paging.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import './list.css';
import { IListContextMenuEvent, IListElementRenderDetails, IListEvent, IListMouseEvent, IListRenderer, IListVirtualDelegate } from './list.js';
import { IListAccessibilityProvider, IListOptions, IListOptionsUpdate, IListStyles, List, TypeNavigationMode } from './listWidget.js';
import { isActiveElement } from '../../dom.js';

export interface IPagedRenderer<TElement, TTemplateData> extends IListRenderer<TElement, TTemplateData> {
	renderPlaceholder(index: number, templateData: TTemplateData): void;
}

export interface ITemplateData<T> {
	data?: T;
	disposable?: IDisposable;
}

class PagedRenderer<TElement, TTemplateData> implements IListRenderer<number, ITemplateData<TTemplateData>> {

	get templateId(): string { return this.renderer.templateId; }

	constructor(
		private renderer: IPagedRenderer<TElement, TTemplateData>,
		private modelProvider: () => IPagedModel<TElement>
	) { }

	renderTemplate(container: HTMLElement): ITemplateData<TTemplateData> {
		const data = this.renderer.renderTemplate(container);
		return { data, disposable: Disposable.None };
	}

	renderElement(index: number, _: number, data: ITemplateData<TTemplateData>, details?: IListElementRenderDetails): void {
		data.disposable?.dispose();

		if (!data.data) {
			return;
		}

		const model = this.modelProvider();

		if (model.isResolved(index)) {
			return this.renderer.renderElement(model.get(index), index, data.data, details);
		}

		const cts = new CancellationTokenSource();
		const promise = model.resolve(index, cts.token);
		data.disposable = { dispose: () => cts.cancel() };

		this.renderer.renderPlaceholder(index, data.data);
		promise.then(entry => this.renderer.renderElement(entry, index, data.data!, details));
	}

	disposeTemplate(data: ITemplateData<TTemplateData>): void {
		if (data.disposable) {
			data.disposable.dispose();
			data.disposable = undefined;
		}
		if (data.data) {
			this.renderer.disposeTemplate(data.data);
			data.data = undefined;
		}
	}
}

class PagedAccessibilityProvider<T> implements IListAccessibilityProvider<number> {

	constructor(
		private modelProvider: () => IPagedModel<T>,
		private accessibilityProvider: IListAccessibilityProvider<T>
	) { }

	getWidgetAriaLabel() {
		return this.accessibilityProvider.getWidgetAriaLabel();
	}

	getAriaLabel(index: number) {
		const model = this.modelProvider();

		if (!model.isResolved(index)) {
			return null;
		}

		return this.accessibilityProvider.getAriaLabel(model.get(index));
	}
}

export interface IPagedListOptions<T> {
	readonly typeNavigationEnabled?: boolean;
	readonly typeNavigationMode?: TypeNavigationMode;
	readonly ariaLabel?: string;
	readonly keyboardSupport?: boolean;
	readonly multipleSelectionSupport?: boolean;
	readonly accessibilityProvider?: IListAccessibilityProvider<T>;

	// list view options
	readonly useShadows?: boolean;
	readonly verticalScrollMode?: ScrollbarVisibility;
	readonly setRowLineHeight?: boolean;
	readonly setRowHeight?: boolean;
	readonly supportDynamicHeights?: boolean;
	readonly mouseSupport?: boolean;
	readonly horizontalScrolling?: boolean;
	readonly scrollByPage?: boolean;
	readonly paddingBottom?: number;
	readonly alwaysConsumeMouseWheel?: boolean;
}

function fromPagedListOptions<T>(modelProvider: () => IPagedModel<T>, options: IPagedListOptions<T>): IListOptions<number> {
	return {
		...options,
		accessibilityProvider: options.accessibilityProvider && new PagedAccessibilityProvider(modelProvider, options.accessibilityProvider)
	};
}

export class PagedList<T> implements IDisposable {

	private readonly list: List<number>;
	private _model!: IPagedModel<T>;
	private readonly modelDisposables = new DisposableStore();

	constructor(
		user: string,
		container: HTMLElement,
		virtualDelegate: IListVirtualDelegate<number>,
		renderers: IPagedRenderer<T, any>[],
		options: IPagedListOptions<T> = {}
	) {
		const modelProvider = () => this.model;
		const pagedRenderers = renderers.map(r => new PagedRenderer<T, ITemplateData<T>>(r, modelProvider));
		this.list = new List(user, container, virtualDelegate, pagedRenderers, fromPagedListOptions(modelProvider, options));
	}

	updateOptions(options: IListOptionsUpdate) {
		this.list.updateOptions(options);
	}

	getHTMLElement(): HTMLElement {
		return this.list.getHTMLElement();
	}

	isDOMFocused(): boolean {
		return isActiveElement(this.getHTMLElement());
	}

	domFocus(): void {
		this.list.domFocus();
	}

	get onDidFocus(): Event<void> {
		return this.list.onDidFocus;
	}

	get onDidBlur(): Event<void> {
		return this.list.onDidBlur;
	}

	get widget(): List<number> {
		return this.list;
	}

	get onDidDispose(): Event<void> {
		return this.list.onDidDispose;
	}

	get onMouseClick(): Event<IListMouseEvent<T>> {
		return Event.map(this.list.onMouseClick, ({ element, index, browserEvent }) => ({ element: element === undefined ? undefined : this._model.get(element), index, browserEvent }));
	}

	get onMouseDblClick(): Event<IListMouseEvent<T>> {
		return Event.map(this.list.onMouseDblClick, ({ element, index, browserEvent }) => ({ element: element === undefined ? undefined : this._model.get(element), index, browserEvent }));
	}

	get onTap(): Event<IListMouseEvent<T>> {
		return Event.map(this.list.onTap, ({ element, index, browserEvent }) => ({ element: element === undefined ? undefined : this._model.get(element), index, browserEvent }));
	}

	get onPointer(): Event<IListMouseEvent<T>> {
		return Event.map(this.list.onPointer, ({ element, index, browserEvent }) => ({ element: element === undefined ? undefined : this._model.get(element), index, browserEvent }));
	}

	get onDidChangeFocus(): Event<IListEvent<T>> {
		return Event.map(this.list.onDidChangeFocus, ({ elements, indexes, browserEvent }) => ({ elements: elements.map(e => this._model.get(e)), indexes, browserEvent }));
	}

	get onDidChangeSelection(): Event<IListEvent<T>> {
		return Event.map(this.list.onDidChangeSelection, ({ elements, indexes, browserEvent }) => ({ elements: elements.map(e => this._model.get(e)), indexes, browserEvent }));
	}

	get onContextMenu(): Event<IListContextMenuEvent<T>> {
		return Event.map(this.list.onContextMenu, ({ element, index, anchor, browserEvent }) => (typeof element === 'undefined' ? { element, index, anchor, browserEvent } : { element: this._model.get(element), index, anchor, browserEvent }));
	}

	get model(): IPagedModel<T> {
		return this._model;
	}

	set model(model: IPagedModel<T>) {
		this.modelDisposables.clear();
		this._model = model;
		this.list.splice(0, this.list.length, range(model.length));
		this.modelDisposables.add(model.onDidIncrementLength(newLength => this.list.splice(this.list.length, 0, range(this.list.length, newLength))));
	}

	get length(): number {
		return this.list.length;
	}

	get scrollTop(): number {
		return this.list.scrollTop;
	}

	set scrollTop(scrollTop: number) {
		this.list.scrollTop = scrollTop;
	}

	get scrollLeft(): number {
		return this.list.scrollLeft;
	}

	set scrollLeft(scrollLeft: number) {
		this.list.scrollLeft = scrollLeft;
	}

	setAnchor(index: number | undefined): void {
		this.list.setAnchor(index);
	}

	getAnchor(): number | undefined {
		return this.list.getAnchor();
	}

	setFocus(indexes: number[]): void {
		this.list.setFocus(indexes);
	}

	focusNext(n?: number, loop?: boolean): void {
		this.list.focusNext(n, loop);
	}

	focusPrevious(n?: number, loop?: boolean): void {
		this.list.focusPrevious(n, loop);
	}

	focusNextPage(): Promise<void> {
		return this.list.focusNextPage();
	}

	focusPreviousPage(): Promise<void> {
		return this.list.focusPreviousPage();
	}

	focusLast(): void {
		this.list.focusLast();
	}

	focusFirst(): void {
		this.list.focusFirst();
	}

	getFocus(): number[] {
		return this.list.getFocus();
	}

	setSelection(indexes: number[], browserEvent?: UIEvent): void {
		this.list.setSelection(indexes, browserEvent);
	}

	getSelection(): number[] {
		return this.list.getSelection();
	}

	getSelectedElements(): T[] {
		return this.getSelection().map(i => this.model.get(i));
	}

	layout(height?: number, width?: number): void {
		this.list.layout(height, width);
	}

	triggerTypeNavigation(): void {
		this.list.triggerTypeNavigation();
	}

	reveal(index: number, relativeTop?: number): void {
		this.list.reveal(index, relativeTop);
	}

	style(styles: IListStyles): void {
		this.list.style(styles);
	}

	dispose(): void {
		this.list.dispose();
		this.modelDisposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/listView.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/listView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers, IDragAndDropData } from '../../dnd.js';
import { addDisposableListener, animate, Dimension, getActiveElement, getContentHeight, getContentWidth, getDocument, getTopLeftOffset, getWindow, isAncestor, isHTMLElement, isSVGElement, scheduleAtNextAnimationFrame } from '../../dom.js';
import { DomEmitter } from '../../event.js';
import { IMouseWheelEvent } from '../../mouseEvent.js';
import { EventType as TouchEventType, Gesture, GestureEvent } from '../../touch.js';
import { SmoothScrollableElement } from '../scrollbar/scrollableElement.js';
import { distinct, equals, splice } from '../../../common/arrays.js';
import { Delayer, disposableTimeout } from '../../../common/async.js';
import { memoize } from '../../../common/decorators.js';
import { Emitter, Event, IValueWithChangeEvent } from '../../../common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import { IRange, Range } from '../../../common/range.js';
import { INewScrollDimensions, Scrollable, ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import { ISpliceable } from '../../../common/sequence.js';
import { IListDragAndDrop, IListDragEvent, IListGestureEvent, IListMouseEvent, IListRenderer, IListTouchEvent, IListVirtualDelegate, ListDragOverEffectPosition, ListDragOverEffectType } from './list.js';
import { IRangeMap, RangeMap, shift } from './rangeMap.js';
import { IRow, RowCache } from './rowCache.js';
import { BugIndicatingError } from '../../../common/errors.js';
import { AriaRole } from '../aria/aria.js';
import { ScrollableElementChangeOptions } from '../scrollbar/scrollableElementOptions.js';
import { clamp } from '../../../common/numbers.js';
import { applyDragImage } from '../dnd/dnd.js';

interface IItem<T> {
	readonly id: string;
	readonly element: T;
	readonly templateId: string;
	row: IRow | null;
	size: number;
	width: number | undefined;
	hasDynamicHeight: boolean;
	lastDynamicHeightWidth: number | undefined;
	uri: string | undefined;
	dropTarget: boolean;
	dragStartDisposable: IDisposable;
	checkedDisposable: IDisposable;
	stale: boolean;
}

const StaticDND = {
	CurrentDragAndDropData: undefined as IDragAndDropData | undefined
};

export interface IListViewDragAndDrop<T> extends IListDragAndDrop<T> {
	getDragElements(element: T): T[];
}

export const enum ListViewTargetSector {
	// drop position relative to the top of the item
	TOP = 0, 				// [0%-25%)
	CENTER_TOP = 1, 		// [25%-50%)
	CENTER_BOTTOM = 2, 		// [50%-75%)
	BOTTOM = 3				// [75%-100%)
}

export type CheckBoxAccessibleState = boolean | 'mixed';

export interface IListViewAccessibilityProvider<T> {
	getSetSize?(element: T, index: number, listLength: number): number;
	getPosInSet?(element: T, index: number): number;
	getRole?(element: T): AriaRole | undefined;
	isChecked?(element: T): CheckBoxAccessibleState | IValueWithChangeEvent<CheckBoxAccessibleState> | undefined;
}

export interface IListViewOptionsUpdate {
	readonly smoothScrolling?: boolean;
	readonly horizontalScrolling?: boolean;
	readonly scrollByPage?: boolean;
	readonly mouseWheelScrollSensitivity?: number;
	readonly fastScrollSensitivity?: number;
	readonly paddingTop?: number;
	readonly paddingBottom?: number;
}

export interface IListViewOptions<T> extends IListViewOptionsUpdate {
	readonly dnd?: IListViewDragAndDrop<T>;
	readonly useShadows?: boolean;
	readonly verticalScrollMode?: ScrollbarVisibility;
	readonly setRowLineHeight?: boolean;
	readonly setRowHeight?: boolean;
	readonly supportDynamicHeights?: boolean;
	readonly mouseSupport?: boolean;
	readonly userSelection?: boolean;
	readonly accessibilityProvider?: IListViewAccessibilityProvider<T>;
	readonly transformOptimization?: boolean;
	readonly alwaysConsumeMouseWheel?: boolean;
	readonly initialSize?: Dimension;
	readonly scrollToActiveElement?: boolean;
}

const DefaultOptions = {
	useShadows: true,
	verticalScrollMode: ScrollbarVisibility.Auto,
	setRowLineHeight: true,
	setRowHeight: true,
	supportDynamicHeights: false,
	dnd: {
		getDragElements<T>(e: T) { return [e]; },
		getDragURI() { return null; },
		onDragStart(): void { },
		onDragOver() { return false; },
		drop() { },
		dispose() { }
	},
	horizontalScrolling: false,
	transformOptimization: true,
	alwaysConsumeMouseWheel: true,
} satisfies IListViewOptions<any>;

export class ElementsDragAndDropData<T, TContext = void> implements IDragAndDropData {

	readonly elements: T[];

	private _context: TContext | undefined;
	public get context(): TContext | undefined {
		return this._context;
	}
	public set context(value: TContext | undefined) {
		this._context = value;
	}

	constructor(elements: T[]) {
		this.elements = elements;
	}

	update(): void { }

	getData(): T[] {
		return this.elements;
	}
}

export class ExternalElementsDragAndDropData<T> implements IDragAndDropData {

	readonly elements: T[];

	constructor(elements: T[]) {
		this.elements = elements;
	}

	update(): void { }

	getData(): T[] {
		return this.elements;
	}
}

export class NativeDragAndDropData implements IDragAndDropData {

	readonly types: any[];
	readonly files: any[];

	constructor() {
		this.types = [];
		this.files = [];
	}

	update(dataTransfer: DataTransfer): void {
		if (dataTransfer.types) {
			this.types.splice(0, this.types.length, ...dataTransfer.types);
		}

		if (dataTransfer.files) {
			this.files.splice(0, this.files.length);

			for (let i = 0; i < dataTransfer.files.length; i++) {
				const file = dataTransfer.files.item(i);

				if (file && (file.size || file.type)) {
					this.files.push(file);
				}
			}
		}
	}

	getData() {
		return {
			types: this.types,
			files: this.files
		};
	}
}

function equalsDragFeedback(f1: number[] | undefined, f2: number[] | undefined): boolean {
	if (Array.isArray(f1) && Array.isArray(f2)) {
		return equals(f1, f2);
	}

	return f1 === f2;
}

class ListViewAccessibilityProvider<T> implements Required<IListViewAccessibilityProvider<T>> {

	readonly getSetSize: (element: T, index: number, listLength: number) => number;
	readonly getPosInSet: (element: T, index: number) => number;
	readonly getRole: (element: T) => AriaRole | undefined;
	readonly isChecked: (element: T) => CheckBoxAccessibleState | IValueWithChangeEvent<CheckBoxAccessibleState> | undefined;

	constructor(accessibilityProvider?: IListViewAccessibilityProvider<T>) {
		if (accessibilityProvider?.getSetSize) {
			this.getSetSize = accessibilityProvider.getSetSize.bind(accessibilityProvider);
		} else {
			this.getSetSize = (e, i, l) => l;
		}

		if (accessibilityProvider?.getPosInSet) {
			this.getPosInSet = accessibilityProvider.getPosInSet.bind(accessibilityProvider);
		} else {
			this.getPosInSet = (e, i) => i + 1;
		}

		if (accessibilityProvider?.getRole) {
			this.getRole = accessibilityProvider.getRole.bind(accessibilityProvider);
		} else {
			this.getRole = _ => 'listitem';
		}

		if (accessibilityProvider?.isChecked) {
			this.isChecked = accessibilityProvider.isChecked.bind(accessibilityProvider);
		} else {
			this.isChecked = _ => undefined;
		}
	}
}

export interface IListView<T> extends ISpliceable<T>, IDisposable {
	readonly domId: string;
	readonly domNode: HTMLElement;
	readonly containerDomNode: HTMLElement;
	readonly scrollableElementDomNode: HTMLElement;
	readonly length: number;
	readonly contentHeight: number;
	readonly contentWidth: number;
	readonly onDidChangeContentHeight: Event<number>;
	readonly onDidChangeContentWidth: Event<number>;
	readonly renderHeight: number;
	readonly scrollHeight: number;
	readonly firstVisibleIndex: number;
	readonly firstMostlyVisibleIndex: number;
	readonly lastVisibleIndex: number;
	onDidScroll: Event<ScrollEvent>;
	onWillScroll: Event<ScrollEvent>;
	onMouseClick: Event<IListMouseEvent<T>>;
	onMouseDblClick: Event<IListMouseEvent<T>>;
	onMouseMiddleClick: Event<IListMouseEvent<T>>;
	onMouseUp: Event<IListMouseEvent<T>>;
	onMouseDown: Event<IListMouseEvent<T>>;
	onMouseOver: Event<IListMouseEvent<T>>;
	onMouseMove: Event<IListMouseEvent<T>>;
	onMouseOut: Event<IListMouseEvent<T>>;
	onContextMenu: Event<IListMouseEvent<T>>;
	onTouchStart: Event<IListTouchEvent<T>>;
	onTap: Event<IListGestureEvent<T>>;
	element(index: number): T;
	domElement(index: number): HTMLElement | null;
	getElementDomId(index: number): string;
	elementHeight(index: number): number;
	elementTop(index: number): number;
	indexOf(element: T): number;
	indexAt(position: number): number;
	indexAfter(position: number): number;
	updateOptions(options: IListViewOptionsUpdate): void;
	getScrollTop(): number;
	setScrollTop(scrollTop: number, reuseAnimation?: boolean): void;
	getScrollLeft(): number;
	setScrollLeft(scrollLeft: number): void;
	delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent): void;
	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void;
	updateWidth(index: number): void;
	updateElementHeight(index: number, size: number | undefined, anchorIndex: number | null): void;
	rerender(): void;
	layout(height?: number, width?: number): void;
}

/**
 * The {@link ListView} is a virtual scrolling engine.
 *
 * Given that it only renders elements within its viewport, it can hold large
 * collections of elements and stay very performant. The performance bottleneck
 * usually lies within the user's rendering code for each element.
 *
 * @remarks It is a low-level widget, not meant to be used directly. Refer to the
 * List widget instead.
 */
export class ListView<T> implements IListView<T> {

	private static InstanceCount = 0;
	readonly domId = `list_id_${++ListView.InstanceCount}`;

	readonly domNode: HTMLElement;

	private items: IItem<T>[];
	private itemId: number;
	protected rangeMap: IRangeMap;
	private cache: RowCache<T>;
	private renderers = new Map<string, IListRenderer<any /* TODO@joao */, any>>();
	protected lastRenderTop: number;
	protected lastRenderHeight: number;
	private renderWidth = 0;
	private rowsContainer: HTMLElement;
	private scrollable: Scrollable;
	private scrollableElement: SmoothScrollableElement;
	private _scrollHeight: number = 0;
	private scrollableElementUpdateDisposable: IDisposable | null = null;
	private scrollableElementWidthDelayer = new Delayer<void>(50);
	private splicing = false;
	private dragOverAnimationDisposable: IDisposable | undefined;
	private dragOverAnimationStopDisposable: IDisposable = Disposable.None;
	private dragOverMouseY: number = 0;
	private setRowLineHeight: boolean;
	private setRowHeight: boolean;
	private supportDynamicHeights: boolean;
	private paddingBottom: number;
	private accessibilityProvider: ListViewAccessibilityProvider<T>;
	private scrollWidth: number | undefined;

	private dnd: IListViewDragAndDrop<T>;
	private canDrop: boolean = false;
	private currentDragData: IDragAndDropData | undefined;
	private currentDragFeedback: number[] | undefined;
	private currentDragFeedbackPosition: ListDragOverEffectPosition | undefined;
	private currentDragFeedbackDisposable: IDisposable = Disposable.None;
	private onDragLeaveTimeout: IDisposable = Disposable.None;
	private currentSelectionDisposable: IDisposable = Disposable.None;
	private currentSelectionBounds: IRange | undefined;
	private activeElement: HTMLElement | undefined;

	private readonly disposables: DisposableStore = new DisposableStore();

	private readonly _onDidChangeContentHeight = new Emitter<number>();
	private readonly _onDidChangeContentWidth = new Emitter<number>();
	readonly onDidChangeContentHeight: Event<number> = Event.latch(this._onDidChangeContentHeight.event, undefined, this.disposables);
	readonly onDidChangeContentWidth: Event<number> = Event.latch(this._onDidChangeContentWidth.event, undefined, this.disposables);
	get contentHeight(): number { return this.rangeMap.size; }
	get contentWidth(): number { return this.scrollWidth ?? 0; }

	get onDidScroll(): Event<ScrollEvent> { return this.scrollableElement.onScroll; }
	get onWillScroll(): Event<ScrollEvent> { return this.scrollableElement.onWillScroll; }
	get containerDomNode(): HTMLElement { return this.rowsContainer; }
	get scrollableElementDomNode(): HTMLElement { return this.scrollableElement.getDomNode(); }

	private _horizontalScrolling: boolean = false;
	private get horizontalScrolling(): boolean { return this._horizontalScrolling; }
	private set horizontalScrolling(value: boolean) {
		if (value === this._horizontalScrolling) {
			return;
		}

		if (value && this.supportDynamicHeights) {
			throw new Error('Horizontal scrolling and dynamic heights not supported simultaneously');
		}

		this._horizontalScrolling = value;
		this.domNode.classList.toggle('horizontal-scrolling', this._horizontalScrolling);

		if (this._horizontalScrolling) {
			for (const item of this.items) {
				this.measureItemWidth(item);
			}

			this.updateScrollWidth();
			this.scrollableElement.setScrollDimensions({ width: getContentWidth(this.domNode) });
			this.rowsContainer.style.width = `${Math.max(this.scrollWidth || 0, this.renderWidth)}px`;
		} else {
			this.scrollableElementWidthDelayer.cancel();
			this.scrollableElement.setScrollDimensions({ width: this.renderWidth, scrollWidth: this.renderWidth });
			this.rowsContainer.style.width = '';
		}
	}

	constructor(
		container: HTMLElement,
		private virtualDelegate: IListVirtualDelegate<T>,
		renderers: IListRenderer<any /* TODO@joao */, any>[],
		options: IListViewOptions<T> = DefaultOptions
	) {
		if (options.horizontalScrolling && options.supportDynamicHeights) {
			throw new Error('Horizontal scrolling and dynamic heights not supported simultaneously');
		}

		this.items = [];
		this.itemId = 0;
		this.rangeMap = this.createRangeMap(options.paddingTop ?? 0);

		for (const renderer of renderers) {
			this.renderers.set(renderer.templateId, renderer);
		}

		this.cache = this.disposables.add(new RowCache(this.renderers));

		this.lastRenderTop = 0;
		this.lastRenderHeight = 0;

		this.domNode = document.createElement('div');
		this.domNode.className = 'monaco-list';

		this.domNode.classList.add(this.domId);
		this.domNode.tabIndex = 0;

		this.domNode.classList.toggle('mouse-support', typeof options.mouseSupport === 'boolean' ? options.mouseSupport : true);

		this._horizontalScrolling = options.horizontalScrolling ?? DefaultOptions.horizontalScrolling;
		this.domNode.classList.toggle('horizontal-scrolling', this._horizontalScrolling);

		this.paddingBottom = typeof options.paddingBottom === 'undefined' ? 0 : options.paddingBottom;

		this.accessibilityProvider = new ListViewAccessibilityProvider(options.accessibilityProvider);

		this.rowsContainer = document.createElement('div');
		this.rowsContainer.className = 'monaco-list-rows';

		const transformOptimization = options.transformOptimization ?? DefaultOptions.transformOptimization;
		if (transformOptimization) {
			this.rowsContainer.style.transform = 'translate3d(0px, 0px, 0px)';
			this.rowsContainer.style.overflow = 'hidden';
			this.rowsContainer.style.contain = 'strict';
		}

		this.disposables.add(Gesture.addTarget(this.rowsContainer));

		this.scrollable = this.disposables.add(new Scrollable({
			forceIntegerValues: true,
			smoothScrollDuration: (options.smoothScrolling ?? false) ? 125 : 0,
			scheduleAtNextAnimationFrame: cb => scheduleAtNextAnimationFrame(getWindow(this.domNode), cb)
		}));
		this.scrollableElement = this.disposables.add(new SmoothScrollableElement(this.rowsContainer, {
			alwaysConsumeMouseWheel: options.alwaysConsumeMouseWheel ?? DefaultOptions.alwaysConsumeMouseWheel,
			horizontal: ScrollbarVisibility.Auto,
			vertical: options.verticalScrollMode ?? DefaultOptions.verticalScrollMode,
			useShadows: options.useShadows ?? DefaultOptions.useShadows,
			mouseWheelScrollSensitivity: options.mouseWheelScrollSensitivity,
			fastScrollSensitivity: options.fastScrollSensitivity,
			scrollByPage: options.scrollByPage
		}, this.scrollable));

		this.domNode.appendChild(this.scrollableElement.getDomNode());
		container.appendChild(this.domNode);

		this.scrollableElement.onScroll(this.onScroll, this, this.disposables);
		this.disposables.add(addDisposableListener(this.rowsContainer, TouchEventType.Change, e => this.onTouchChange(e as GestureEvent)));

		this.disposables.add(addDisposableListener(this.scrollableElement.getDomNode(), 'scroll', e => {
			// Make sure the active element is scrolled into view
			const element = (e.target as HTMLElement);
			const scrollValue = element.scrollTop;
			element.scrollTop = 0;
			if (options.scrollToActiveElement) {
				this.setScrollTop(this.scrollTop + scrollValue);
			}
		}));

		this.disposables.add(addDisposableListener(this.domNode, 'dragover', e => this.onDragOver(this.toDragEvent(e))));
		this.disposables.add(addDisposableListener(this.domNode, 'drop', e => this.onDrop(this.toDragEvent(e))));
		this.disposables.add(addDisposableListener(this.domNode, 'dragleave', e => this.onDragLeave(this.toDragEvent(e))));
		this.disposables.add(addDisposableListener(this.domNode, 'dragend', e => this.onDragEnd(e)));
		if (options.userSelection) {
			if (options.dnd) {
				throw new Error('DND and user selection cannot be used simultaneously');
			}
			this.disposables.add(addDisposableListener(this.domNode, 'mousedown', e => this.onPotentialSelectionStart(e)));
		}

		this.setRowLineHeight = options.setRowLineHeight ?? DefaultOptions.setRowLineHeight;
		this.setRowHeight = options.setRowHeight ?? DefaultOptions.setRowHeight;
		this.supportDynamicHeights = options.supportDynamicHeights ?? DefaultOptions.supportDynamicHeights;
		this.dnd = options.dnd ?? this.disposables.add(DefaultOptions.dnd);

		this.layout(options.initialSize?.height, options.initialSize?.width);
		if (options.scrollToActiveElement) {
			this._setupFocusObserver(container);
		}
	}

	private _setupFocusObserver(container: HTMLElement): void {
		this.disposables.add(addDisposableListener(container, 'focus', () => {
			const element = getActiveElement() as HTMLElement | null;
			if (this.activeElement !== element && element !== null) {
				this.activeElement = element;
				this._scrollToActiveElement(this.activeElement, container);
			}
		}, true));
	}

	private _scrollToActiveElement(element: HTMLElement, container: HTMLElement) {
		// The scroll event on the list only fires when scrolling down.
		// If the active element is above the viewport, we need to scroll up.
		const containerRect = container.getBoundingClientRect();
		const elementRect = element.getBoundingClientRect();

		const topOffset = elementRect.top - containerRect.top;

		if (topOffset < 0) {
			// Scroll up
			this.setScrollTop(this.scrollTop + topOffset);
		}
	}

	updateOptions(options: IListViewOptionsUpdate) {
		if (options.paddingBottom !== undefined) {
			this.paddingBottom = options.paddingBottom;
			this.scrollableElement.setScrollDimensions({ scrollHeight: this.scrollHeight });
		}

		if (options.smoothScrolling !== undefined) {
			this.scrollable.setSmoothScrollDuration(options.smoothScrolling ? 125 : 0);
		}

		if (options.horizontalScrolling !== undefined) {
			this.horizontalScrolling = options.horizontalScrolling;
		}

		let scrollableOptions: ScrollableElementChangeOptions | undefined;

		if (options.scrollByPage !== undefined) {
			scrollableOptions = { ...(scrollableOptions ?? {}), scrollByPage: options.scrollByPage };
		}

		if (options.mouseWheelScrollSensitivity !== undefined) {
			scrollableOptions = { ...(scrollableOptions ?? {}), mouseWheelScrollSensitivity: options.mouseWheelScrollSensitivity };
		}

		if (options.fastScrollSensitivity !== undefined) {
			scrollableOptions = { ...(scrollableOptions ?? {}), fastScrollSensitivity: options.fastScrollSensitivity };
		}

		if (scrollableOptions) {
			this.scrollableElement.updateOptions(scrollableOptions);
		}

		if (options.paddingTop !== undefined && options.paddingTop !== this.rangeMap.paddingTop) {
			// trigger a rerender
			const lastRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
			const offset = options.paddingTop - this.rangeMap.paddingTop;
			this.rangeMap.paddingTop = options.paddingTop;

			this.render(lastRenderRange, Math.max(0, this.lastRenderTop + offset), this.lastRenderHeight, undefined, undefined, true);
			this.setScrollTop(this.lastRenderTop);

			this.eventuallyUpdateScrollDimensions();

			if (this.supportDynamicHeights) {
				this._rerender(this.lastRenderTop, this.lastRenderHeight);
			}
		}
	}

	delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this.scrollableElement.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent) {
		this.scrollableElement.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	updateElementHeight(index: number, size: number | undefined, anchorIndex: number | null): void {
		if (index < 0 || index >= this.items.length) {
			return;
		}

		const originalSize = this.items[index].size;

		if (typeof size === 'undefined') {
			if (!this.supportDynamicHeights) {
				console.warn('Dynamic heights not supported', new Error().stack);
				return;
			}

			this.items[index].lastDynamicHeightWidth = undefined;
			size = originalSize + this.probeDynamicHeight(index);
		}

		if (originalSize === size) {
			return;
		}

		const lastRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);

		let heightDiff = 0;

		if (index < lastRenderRange.start) {
			// do not scroll the viewport if resized element is out of viewport
			heightDiff = size - originalSize;
		} else {
			if (anchorIndex !== null && anchorIndex > index && anchorIndex < lastRenderRange.end) {
				// anchor in viewport
				// resized element in viewport and above the anchor
				heightDiff = size - originalSize;
			} else {
				heightDiff = 0;
			}
		}

		this.rangeMap.splice(index, 1, [{ size: size }]);
		this.items[index].size = size;

		this.render(lastRenderRange, Math.max(0, this.lastRenderTop + heightDiff), this.lastRenderHeight, undefined, undefined, true);
		this.setScrollTop(this.lastRenderTop);

		this.eventuallyUpdateScrollDimensions();

		if (this.supportDynamicHeights) {
			this._rerender(this.lastRenderTop, this.lastRenderHeight);
		} else {
			this._onDidChangeContentHeight.fire(this.contentHeight); // otherwise fired in _rerender()
		}
	}

	protected createRangeMap(paddingTop: number): IRangeMap {
		return new RangeMap(paddingTop);
	}

	splice(start: number, deleteCount: number, elements: readonly T[] = []): T[] {
		if (this.splicing) {
			throw new Error('Can\'t run recursive splices.');
		}

		this.splicing = true;

		try {
			return this._splice(start, deleteCount, elements);
		} finally {
			this.splicing = false;
			this._onDidChangeContentHeight.fire(this.contentHeight);
		}
	}

	private _splice(start: number, deleteCount: number, elements: readonly T[] = []): T[] {
		const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
		const deleteRange = { start, end: start + deleteCount };
		const removeRange = Range.intersect(previousRenderRange, deleteRange);

		// try to reuse rows, avoid removing them from DOM
		const rowsToDispose = new Map<string, IRow[]>();
		for (let i = removeRange.end - 1; i >= removeRange.start; i--) {
			const item = this.items[i];
			item.dragStartDisposable.dispose();
			item.checkedDisposable.dispose();

			if (item.row) {
				let rows = rowsToDispose.get(item.templateId);

				if (!rows) {
					rows = [];
					rowsToDispose.set(item.templateId, rows);
				}

				const renderer = this.renderers.get(item.templateId);

				if (renderer && renderer.disposeElement) {
					renderer.disposeElement(item.element, i, item.row.templateData, { height: item.size });
				}

				rows.unshift(item.row);
			}

			item.row = null;
			item.stale = true;
		}

		const previousRestRange: IRange = { start: start + deleteCount, end: this.items.length };
		const previousRenderedRestRange = Range.intersect(previousRestRange, previousRenderRange);
		const previousUnrenderedRestRanges = Range.relativeComplement(previousRestRange, previousRenderRange);

		const inserted = elements.map<IItem<T>>(element => ({
			id: String(this.itemId++),
			element,
			templateId: this.virtualDelegate.getTemplateId(element),
			size: this.virtualDelegate.getHeight(element),
			width: undefined,
			hasDynamicHeight: !!this.virtualDelegate.hasDynamicHeight && this.virtualDelegate.hasDynamicHeight(element),
			lastDynamicHeightWidth: undefined,
			row: null,
			uri: undefined,
			dropTarget: false,
			dragStartDisposable: Disposable.None,
			checkedDisposable: Disposable.None,
			stale: false
		}));

		let deleted: IItem<T>[];

		// TODO@joao: improve this optimization to catch even more cases
		if (start === 0 && deleteCount >= this.items.length) {
			this.rangeMap = this.createRangeMap(this.rangeMap.paddingTop);
			this.rangeMap.splice(0, 0, inserted);
			deleted = this.items;
			this.items = inserted;
		} else {
			this.rangeMap.splice(start, deleteCount, inserted);
			deleted = splice(this.items, start, deleteCount, inserted);
		}

		const delta = elements.length - deleteCount;
		const renderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
		const renderedRestRange = shift(previousRenderedRestRange, delta);
		const updateRange = Range.intersect(renderRange, renderedRestRange);

		for (let i = updateRange.start; i < updateRange.end; i++) {
			this.updateItemInDOM(this.items[i], i);
		}

		const removeRanges = Range.relativeComplement(renderedRestRange, renderRange);

		for (const range of removeRanges) {
			for (let i = range.start; i < range.end; i++) {
				this.removeItemFromDOM(i);
			}
		}

		const unrenderedRestRanges = previousUnrenderedRestRanges.map(r => shift(r, delta));
		const elementsRange = { start, end: start + elements.length };
		const insertRanges = [elementsRange, ...unrenderedRestRanges].map(r => Range.intersect(renderRange, r)).reverse();

		for (const range of insertRanges) {
			for (let i = range.end - 1; i >= range.start; i--) {
				const item = this.items[i];
				const rows = rowsToDispose.get(item.templateId);
				const row = rows?.pop();
				this.insertItemInDOM(i, row);
			}
		}

		for (const rows of rowsToDispose.values()) {
			for (const row of rows) {
				this.cache.release(row);
			}
		}

		this.eventuallyUpdateScrollDimensions();

		if (this.supportDynamicHeights) {
			this._rerender(this.scrollTop, this.renderHeight);
		}

		return deleted.map(i => i.element);
	}

	protected eventuallyUpdateScrollDimensions(): void {
		this._scrollHeight = this.contentHeight;
		this.rowsContainer.style.height = `${this._scrollHeight}px`;

		if (!this.scrollableElementUpdateDisposable) {
			this.scrollableElementUpdateDisposable = scheduleAtNextAnimationFrame(getWindow(this.domNode), () => {
				this.scrollableElement.setScrollDimensions({ scrollHeight: this.scrollHeight });
				this.updateScrollWidth();
				this.scrollableElementUpdateDisposable = null;
			});
		}
	}

	private eventuallyUpdateScrollWidth(): void {
		if (!this.horizontalScrolling) {
			this.scrollableElementWidthDelayer.cancel();
			return;
		}

		this.scrollableElementWidthDelayer.trigger(() => this.updateScrollWidth());
	}

	private updateScrollWidth(): void {
		if (!this.horizontalScrolling) {
			return;
		}

		let scrollWidth = 0;

		for (const item of this.items) {
			if (typeof item.width !== 'undefined') {
				scrollWidth = Math.max(scrollWidth, item.width);
			}
		}

		this.scrollWidth = scrollWidth;
		this.scrollableElement.setScrollDimensions({ scrollWidth: scrollWidth === 0 ? 0 : (scrollWidth + 10) });
		this._onDidChangeContentWidth.fire(this.scrollWidth);
	}

	updateWidth(index: number): void {
		if (!this.horizontalScrolling || typeof this.scrollWidth === 'undefined') {
			return;
		}

		const item = this.items[index];
		this.measureItemWidth(item);

		if (typeof item.width !== 'undefined' && item.width > this.scrollWidth) {
			this.scrollWidth = item.width;
			this.scrollableElement.setScrollDimensions({ scrollWidth: this.scrollWidth + 10 });
			this._onDidChangeContentWidth.fire(this.scrollWidth);
		}
	}

	rerender(): void {
		if (!this.supportDynamicHeights) {
			return;
		}

		for (const item of this.items) {
			item.lastDynamicHeightWidth = undefined;
		}

		this._rerender(this.lastRenderTop, this.lastRenderHeight);
	}

	get length(): number {
		return this.items.length;
	}

	get renderHeight(): number {
		const scrollDimensions = this.scrollableElement.getScrollDimensions();
		return scrollDimensions.height;
	}

	get firstVisibleIndex(): number {
		const range = this.getVisibleRange(this.lastRenderTop, this.lastRenderHeight);
		return range.start;
	}

	get firstMostlyVisibleIndex(): number {
		const firstVisibleIndex = this.firstVisibleIndex;
		const firstElTop = this.rangeMap.positionAt(firstVisibleIndex);
		const nextElTop = this.rangeMap.positionAt(firstVisibleIndex + 1);
		if (nextElTop !== -1) {
			const firstElMidpoint = (nextElTop - firstElTop) / 2 + firstElTop;
			if (firstElMidpoint < this.scrollTop) {
				return firstVisibleIndex + 1;
			}
		}

		return firstVisibleIndex;
	}

	get lastVisibleIndex(): number {
		const range = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
		return range.end - 1;
	}

	element(index: number): T {
		return this.items[index].element;
	}

	indexOf(element: T): number {
		return this.items.findIndex(item => item.element === element);
	}

	domElement(index: number): HTMLElement | null {
		const row = this.items[index].row;
		return row && row.domNode;
	}

	elementHeight(index: number): number {
		return this.items[index].size;
	}

	elementTop(index: number): number {
		return this.rangeMap.positionAt(index);
	}

	indexAt(position: number): number {
		return this.rangeMap.indexAt(position);
	}

	indexAfter(position: number): number {
		return this.rangeMap.indexAfter(position);
	}

	layout(height?: number, width?: number): void {
		const scrollDimensions: INewScrollDimensions = {
			height: typeof height === 'number' ? height : getContentHeight(this.domNode)
		};

		if (this.scrollableElementUpdateDisposable) {
			this.scrollableElementUpdateDisposable.dispose();
			this.scrollableElementUpdateDisposable = null;
			scrollDimensions.scrollHeight = this.scrollHeight;
		}

		this.scrollableElement.setScrollDimensions(scrollDimensions);

		if (typeof width !== 'undefined') {
			this.renderWidth = width;

			if (this.supportDynamicHeights) {
				this._rerender(this.scrollTop, this.renderHeight);
			}
		}

		if (this.horizontalScrolling) {
			this.scrollableElement.setScrollDimensions({
				width: typeof width === 'number' ? width : getContentWidth(this.domNode)
			});
		}
	}

	// Render

	protected render(previousRenderRange: IRange, renderTop: number, renderHeight: number, renderLeft: number | undefined, scrollWidth: number | undefined, updateItemsInDOM: boolean = false, onScroll: boolean = false): void {
		const renderRange = this.getRenderRange(renderTop, renderHeight);

		const rangesToInsert = Range.relativeComplement(renderRange, previousRenderRange).reverse();
		const rangesToRemove = Range.relativeComplement(previousRenderRange, renderRange);

		if (updateItemsInDOM) {
			const rangesToUpdate = Range.intersect(previousRenderRange, renderRange);

			for (let i = rangesToUpdate.start; i < rangesToUpdate.end; i++) {
				this.updateItemInDOM(this.items[i], i);
			}
		}

		this.cache.transact(() => {
			for (const range of rangesToRemove) {
				for (let i = range.start; i < range.end; i++) {
					this.removeItemFromDOM(i, onScroll);
				}
			}

			for (const range of rangesToInsert) {
				for (let i = range.end - 1; i >= range.start; i--) {
					this.insertItemInDOM(i);
				}
			}
		});

		if (renderLeft !== undefined) {
			this.rowsContainer.style.left = `-${renderLeft}px`;
		}

		this.rowsContainer.style.top = `-${renderTop}px`;

		if (this.horizontalScrolling && scrollWidth !== undefined) {
			this.rowsContainer.style.width = `${Math.max(scrollWidth, this.renderWidth)}px`;
		}

		this.lastRenderTop = renderTop;
		this.lastRenderHeight = renderHeight;
	}

	// DOM operations

	private insertItemInDOM(index: number, row?: IRow): void {
		const item = this.items[index];

		if (!item.row) {
			if (row) {
				item.row = row;
				item.stale = true;
			} else {
				const result = this.cache.alloc(item.templateId);
				item.row = result.row;
				item.stale ||= result.isReusingConnectedDomNode;
			}
		}

		const role = this.accessibilityProvider.getRole(item.element) || 'listitem';
		item.row.domNode.setAttribute('role', role);

		const checked = this.accessibilityProvider.isChecked(item.element);
		const toAriaState = (value: CheckBoxAccessibleState) => value === 'mixed' ? 'mixed' : String(!!value);

		if (typeof checked === 'boolean' || checked === 'mixed') {
			item.row.domNode.setAttribute('aria-checked', toAriaState(checked));
		} else if (checked) {
			const update = (value: CheckBoxAccessibleState) => item.row!.domNode.setAttribute('aria-checked', toAriaState(value));
			update(checked.value);
			item.checkedDisposable = checked.onDidChange(() => update(checked.value));
		}

		if (item.stale || !item.row.domNode.parentElement) {
			const referenceNode = this.items.at(index + 1)?.row?.domNode ?? null;
			if (item.row.domNode.parentElement !== this.rowsContainer || item.row.domNode.nextElementSibling !== referenceNode) {
				this.rowsContainer.insertBefore(item.row.domNode, referenceNode);
			}
			item.stale = false;
		}

		this.updateItemInDOM(item, index);

		const renderer = this.renderers.get(item.templateId);

		if (!renderer) {
			throw new Error(`No renderer found for template id ${item.templateId}`);
		}

		renderer?.renderElement(item.element, index, item.row.templateData, { height: item.size });

		const uri = this.dnd.getDragURI(item.element);
		item.dragStartDisposable.dispose();
		item.row.domNode.draggable = !!uri;

		if (uri) {
			item.dragStartDisposable = addDisposableListener(item.row.domNode, 'dragstart', event => this.onDragStart(item.element, uri, event));
		}

		if (this.horizontalScrolling) {
			this.measureItemWidth(item);
			this.eventuallyUpdateScrollWidth();
		}
	}

	private measureItemWidth(item: IItem<T>): void {
		if (!item.row || !item.row.domNode) {
			return;
		}

		item.row.domNode.style.width = 'fit-content';
		item.width = getContentWidth(item.row.domNode);
		const style = getWindow(item.row.domNode).getComputedStyle(item.row.domNode);

		if (style.paddingLeft) {
			item.width += parseFloat(style.paddingLeft);
		}

		if (style.paddingRight) {
			item.width += parseFloat(style.paddingRight);
		}

		item.row.domNode.style.width = '';
	}

	private updateItemInDOM(item: IItem<T>, index: number): void {
		item.row!.domNode.style.top = `${this.elementTop(index)}px`;

		if (this.setRowHeight) {
			item.row!.domNode.style.height = `${item.size}px`;
		}

		if (this.setRowLineHeight) {
			item.row!.domNode.style.lineHeight = `${item.size}px`;
		}

		item.row!.domNode.setAttribute('data-index', `${index}`);
		item.row!.domNode.setAttribute('data-last-element', index === this.length - 1 ? 'true' : 'false');
		item.row!.domNode.setAttribute('data-parity', index % 2 === 0 ? 'even' : 'odd');
		item.row!.domNode.setAttribute('aria-setsize', String(this.accessibilityProvider.getSetSize(item.element, index, this.length)));
		item.row!.domNode.setAttribute('aria-posinset', String(this.accessibilityProvider.getPosInSet(item.element, index)));
		item.row!.domNode.setAttribute('id', this.getElementDomId(index));

		item.row!.domNode.classList.toggle('drop-target', item.dropTarget);
	}

	private removeItemFromDOM(index: number, onScroll?: boolean): void {
		const item = this.items[index];
		item.dragStartDisposable.dispose();
		item.checkedDisposable.dispose();

		if (item.row) {
			const renderer = this.renderers.get(item.templateId);

			if (renderer && renderer.disposeElement) {
				renderer.disposeElement(item.element, index, item.row.templateData, { height: item.size, onScroll });
			}

			this.cache.release(item.row);
			item.row = null;
		}

		if (this.horizontalScrolling) {
			this.eventuallyUpdateScrollWidth();
		}
	}

	getScrollTop(): number {
		const scrollPosition = this.scrollableElement.getScrollPosition();
		return scrollPosition.scrollTop;
	}

	setScrollTop(scrollTop: number, reuseAnimation?: boolean): void {
		if (this.scrollableElementUpdateDisposable) {
			this.scrollableElementUpdateDisposable.dispose();
			this.scrollableElementUpdateDisposable = null;
			this.scrollableElement.setScrollDimensions({ scrollHeight: this.scrollHeight });
		}

		this.scrollableElement.setScrollPosition({ scrollTop, reuseAnimation });
	}

	getScrollLeft(): number {
		const scrollPosition = this.scrollableElement.getScrollPosition();
		return scrollPosition.scrollLeft;
	}

	setScrollLeft(scrollLeft: number): void {
		if (this.scrollableElementUpdateDisposable) {
			this.scrollableElementUpdateDisposable.dispose();
			this.scrollableElementUpdateDisposable = null;
			this.scrollableElement.setScrollDimensions({ scrollWidth: this.scrollWidth });
		}

		this.scrollableElement.setScrollPosition({ scrollLeft });
	}


	get scrollTop(): number {
		return this.getScrollTop();
	}

	set scrollTop(scrollTop: number) {
		this.setScrollTop(scrollTop);
	}

	get scrollHeight(): number {
		return this._scrollHeight + (this.horizontalScrolling ? 10 : 0) + this.paddingBottom;
	}

	// Events

	@memoize get onMouseClick(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'click')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseDblClick(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'dblclick')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseMiddleClick(): Event<IListMouseEvent<T>> { return Event.filter(Event.map(this.disposables.add(new DomEmitter(this.domNode, 'auxclick')).event, e => this.toMouseEvent(e as MouseEvent), this.disposables), e => e.browserEvent.button === 1, this.disposables); }
	@memoize get onMouseUp(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'mouseup')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseDown(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'mousedown')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseOver(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'mouseover')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseMove(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'mousemove')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onMouseOut(): Event<IListMouseEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'mouseout')).event, e => this.toMouseEvent(e), this.disposables); }
	@memoize get onContextMenu(): Event<IListMouseEvent<T> | IListGestureEvent<T>> { return Event.any<IListMouseEvent<any> | IListGestureEvent<any>>(Event.map(this.disposables.add(new DomEmitter(this.domNode, 'contextmenu')).event, e => this.toMouseEvent(e), this.disposables), Event.map(this.disposables.add(new DomEmitter(this.domNode, TouchEventType.Contextmenu)).event, e => this.toGestureEvent(e), this.disposables)); }
	@memoize get onTouchStart(): Event<IListTouchEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.domNode, 'touchstart')).event, e => this.toTouchEvent(e), this.disposables); }
	@memoize get onTap(): Event<IListGestureEvent<T>> { return Event.map(this.disposables.add(new DomEmitter(this.rowsContainer, TouchEventType.Tap)).event, e => this.toGestureEvent(e), this.disposables); }

	private toMouseEvent(browserEvent: MouseEvent): IListMouseEvent<T> {
		const index = this.getItemIndexFromEventTarget(browserEvent.target || null);
		const item = typeof index === 'undefined' ? undefined : this.items[index];
		const element = item && item.element;
		return { browserEvent, index, element };
	}

	private toTouchEvent(browserEvent: TouchEvent): IListTouchEvent<T> {
		const index = this.getItemIndexFromEventTarget(browserEvent.target || null);
		const item = typeof index === 'undefined' ? undefined : this.items[index];
		const element = item && item.element;
		return { browserEvent, index, element };
	}

	private toGestureEvent(browserEvent: GestureEvent): IListGestureEvent<T> {
		const index = this.getItemIndexFromEventTarget(browserEvent.initialTarget || null);
		const item = typeof index === 'undefined' ? undefined : this.items[index];
		const element = item && item.element;
		return { browserEvent, index, element };
	}

	private toDragEvent(browserEvent: DragEvent): IListDragEvent<T> {
		const index = this.getItemIndexFromEventTarget(browserEvent.target || null);
		const item = typeof index === 'undefined' ? undefined : this.items[index];
		const element = item && item.element;
		const sector = this.getTargetSector(browserEvent, index);
		return { browserEvent, index, element, sector };
	}

	private onScroll(e: ScrollEvent): void {
		try {
			const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
			this.render(previousRenderRange, e.scrollTop, e.height, e.scrollLeft, e.scrollWidth, undefined, true);

			if (this.supportDynamicHeights) {
				this._rerender(e.scrollTop, e.height, e.inSmoothScrolling);
			}
		} catch (err) {
			console.error('Got bad scroll event:', e);
			throw err;
		}
	}

	private onTouchChange(event: GestureEvent): void {
		event.preventDefault();
		event.stopPropagation();

		this.scrollTop -= event.translationY;
	}

	// DND

	private onDragStart(element: T, uri: string, event: DragEvent): void {
		if (!event.dataTransfer) {
			return;
		}

		const elements = this.dnd.getDragElements(element);

		event.dataTransfer.effectAllowed = 'copyMove';
		event.dataTransfer.setData(DataTransfers.TEXT, uri);

		let label: string | undefined;
		if (this.dnd.getDragLabel) {
			label = this.dnd.getDragLabel(elements, event);
		}
		if (typeof label === 'undefined') {
			label = String(elements.length);
		}

		applyDragImage(event, this.domNode, label, [this.domId /* add domId to get list specific styling */]);

		this.domNode.classList.add('dragging');
		this.currentDragData = new ElementsDragAndDropData(elements);
		StaticDND.CurrentDragAndDropData = new ExternalElementsDragAndDropData(elements);

		this.dnd.onDragStart?.(this.currentDragData, event);
	}

	private onPotentialSelectionStart(e: MouseEvent) {
		this.currentSelectionDisposable.dispose();
		const doc = getDocument(this.domNode);

		// Set up both the 'movement store' for watching the mouse, and the
		// 'selection store' which lasts as long as there's a selection, even
		// after the usr has stopped modifying it.
		const selectionStore = this.currentSelectionDisposable = new DisposableStore();
		const movementStore = selectionStore.add(new DisposableStore());

		// The selection events we get from the DOM are fairly limited and we lack a 'selection end' event.
		// Selection events also don't tell us where the input doing the selection is. So, make a poor
		// assumption that a user is using the mouse, and base our events on that.
		movementStore.add(addDisposableListener(this.domNode, 'selectstart', () => {
			movementStore.add(addDisposableListener(doc, 'mousemove', e => {
				if (doc.getSelection()?.isCollapsed === false) {
					this.setupDragAndDropScrollTopAnimation(e);
				}
			}));

			// The selection is cleared either on mouseup if there's no selection, or on next mousedown
			// when `this.currentSelectionDisposable` is reset.
			selectionStore.add(toDisposable(() => {
				const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
				this.currentSelectionBounds = undefined;
				this.render(previousRenderRange, this.lastRenderTop, this.lastRenderHeight, undefined, undefined);
			}));
			selectionStore.add(addDisposableListener(doc, 'selectionchange', () => {
				const selection = doc.getSelection();
				// if the selection changed _after_ mouseup, it's from clearing the list or similar, so teardown
				if (!selection || selection.isCollapsed) {
					if (movementStore.isDisposed) {
						selectionStore.dispose();
					}
					return;
				}

				let start = this.getIndexOfListElement(selection.anchorNode as HTMLElement);
				let end = this.getIndexOfListElement(selection.focusNode as HTMLElement);
				if (start !== undefined && end !== undefined) {
					if (end < start) {
						[start, end] = [end, start];
					}
					this.currentSelectionBounds = { start, end };
				}
			}));
		}));

		movementStore.add(addDisposableListener(doc, 'mouseup', () => {
			movementStore.dispose();
			this.teardownDragAndDropScrollTopAnimation();

			if (doc.getSelection()?.isCollapsed !== false) {
				selectionStore.dispose();
			}
		}));
	}

	private getIndexOfListElement(element: HTMLElement | null): number | undefined {
		if (!element || !this.domNode.contains(element)) {
			return undefined;
		}

		while (element && element !== this.domNode) {
			if (element.dataset?.index) {
				return Number(element.dataset.index);
			}

			element = element.parentElement;
		}

		return undefined;
	}

	private onDragOver(event: IListDragEvent<T>): boolean {
		event.browserEvent.preventDefault(); // needed so that the drop event fires (https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome)

		this.onDragLeaveTimeout.dispose();

		if (StaticDND.CurrentDragAndDropData && StaticDND.CurrentDragAndDropData.getData() === 'vscode-ui') {
			return false;
		}

		this.setupDragAndDropScrollTopAnimation(event.browserEvent);

		if (!event.browserEvent.dataTransfer) {
			return false;
		}

		// Drag over from outside
		if (!this.currentDragData) {
			if (StaticDND.CurrentDragAndDropData) {
				// Drag over from another list
				this.currentDragData = StaticDND.CurrentDragAndDropData;

			} else {
				// Drag over from the desktop
				if (!event.browserEvent.dataTransfer.types) {
					return false;
				}

				this.currentDragData = new NativeDragAndDropData();
			}
		}

		const result = this.dnd.onDragOver(this.currentDragData, event.element, event.index, event.sector, event.browserEvent);
		this.canDrop = typeof result === 'boolean' ? result : result.accept;

		if (!this.canDrop) {
			this.currentDragFeedback = undefined;
			this.currentDragFeedbackDisposable.dispose();
			return false;
		}

		event.browserEvent.dataTransfer.dropEffect = (typeof result !== 'boolean' && result.effect?.type === ListDragOverEffectType.Copy) ? 'copy' : 'move';

		let feedback: number[];

		if (typeof result !== 'boolean' && result.feedback) {
			feedback = result.feedback;
		} else {
			if (typeof event.index === 'undefined') {
				feedback = [-1];
			} else {
				feedback = [event.index];
			}
		}

		// sanitize feedback list
		feedback = distinct(feedback).filter(i => i >= -1 && i < this.length).sort((a, b) => a - b);
		feedback = feedback[0] === -1 ? [-1] : feedback;

		let dragOverEffectPosition = typeof result !== 'boolean' && result.effect && result.effect.position ? result.effect.position : ListDragOverEffectPosition.Over;

		if (equalsDragFeedback(this.currentDragFeedback, feedback) && this.currentDragFeedbackPosition === dragOverEffectPosition) {
			return true;
		}

		this.currentDragFeedback = feedback;
		this.currentDragFeedbackPosition = dragOverEffectPosition;
		this.currentDragFeedbackDisposable.dispose();

		if (feedback[0] === -1) { // entire list feedback
			this.domNode.classList.add(dragOverEffectPosition);
			this.rowsContainer.classList.add(dragOverEffectPosition);
			this.currentDragFeedbackDisposable = toDisposable(() => {
				this.domNode.classList.remove(dragOverEffectPosition);
				this.rowsContainer.classList.remove(dragOverEffectPosition);
			});
		} else {

			if (feedback.length > 1 && dragOverEffectPosition !== ListDragOverEffectPosition.Over) {
				throw new Error('Can\'t use multiple feedbacks with position different than \'over\'');
			}

			// Make sure there is no flicker when moving between two items
			// Always use the before feedback if possible
			if (dragOverEffectPosition === ListDragOverEffectPosition.After) {
				if (feedback[0] < this.length - 1) {
					feedback[0] += 1;
					dragOverEffectPosition = ListDragOverEffectPosition.Before;
				}
			}

			for (const index of feedback) {
				const item = this.items[index];
				item.dropTarget = true;

				item.row?.domNode.classList.add(dragOverEffectPosition);
			}

			this.currentDragFeedbackDisposable = toDisposable(() => {
				for (const index of feedback) {
					const item = this.items[index];
					item.dropTarget = false;

					item.row?.domNode.classList.remove(dragOverEffectPosition);
				}
			});
		}

		return true;
	}

	private onDragLeave(event: IListDragEvent<T>): void {
		this.onDragLeaveTimeout.dispose();
		this.onDragLeaveTimeout = disposableTimeout(() => this.clearDragOverFeedback(), 100, this.disposables);
		if (this.currentDragData) {
			this.dnd.onDragLeave?.(this.currentDragData, event.element, event.index, event.browserEvent);
		}
	}

	private onDrop(event: IListDragEvent<T>): void {
		if (!this.canDrop) {
			return;
		}

		const dragData = this.currentDragData;
		this.teardownDragAndDropScrollTopAnimation();
		this.clearDragOverFeedback();
		this.domNode.classList.remove('dragging');
		this.currentDragData = undefined;
		StaticDND.CurrentDragAndDropData = undefined;

		if (!dragData || !event.browserEvent.dataTransfer) {
			return;
		}

		event.browserEvent.preventDefault();
		dragData.update(event.browserEvent.dataTransfer);
		this.dnd.drop(dragData, event.element, event.index, event.sector, event.browserEvent);
	}

	private onDragEnd(event: DragEvent): void {
		this.canDrop = false;
		this.teardownDragAndDropScrollTopAnimation();
		this.clearDragOverFeedback();
		this.domNode.classList.remove('dragging');
		this.currentDragData = undefined;
		StaticDND.CurrentDragAndDropData = undefined;

		this.dnd.onDragEnd?.(event);
	}

	private clearDragOverFeedback(): void {
		this.currentDragFeedback = undefined;
		this.currentDragFeedbackPosition = undefined;
		this.currentDragFeedbackDisposable.dispose();
		this.currentDragFeedbackDisposable = Disposable.None;
	}

	// DND scroll top animation

	private setupDragAndDropScrollTopAnimation(event: DragEvent | MouseEvent): void {
		if (!this.dragOverAnimationDisposable) {
			const viewTop = getTopLeftOffset(this.domNode).top;
			this.dragOverAnimationDisposable = animate(getWindow(this.domNode), this.animateDragAndDropScrollTop.bind(this, viewTop));
		}

		this.dragOverAnimationStopDisposable.dispose();
		this.dragOverAnimationStopDisposable = disposableTimeout(() => {
			if (this.dragOverAnimationDisposable) {
				this.dragOverAnimationDisposable.dispose();
				this.dragOverAnimationDisposable = undefined;
			}
		}, 1000, this.disposables);

		this.dragOverMouseY = event.pageY;
	}

	private animateDragAndDropScrollTop(viewTop: number): void {
		if (this.dragOverMouseY === undefined) {
			return;
		}

		const diff = this.dragOverMouseY - viewTop;
		const upperLimit = this.renderHeight - 35;

		if (diff < 35) {
			this.scrollTop += Math.max(-14, Math.floor(0.3 * (diff - 35)));
		} else if (diff > upperLimit) {
			this.scrollTop += Math.min(14, Math.floor(0.3 * (diff - upperLimit)));
		}
	}

	private teardownDragAndDropScrollTopAnimation(): void {
		this.dragOverAnimationStopDisposable.dispose();

		if (this.dragOverAnimationDisposable) {
			this.dragOverAnimationDisposable.dispose();
			this.dragOverAnimationDisposable = undefined;
		}
	}

	// Util

	private getTargetSector(browserEvent: DragEvent, targetIndex: number | undefined): ListViewTargetSector | undefined {
		if (targetIndex === undefined) {
			return undefined;
		}

		const relativePosition = browserEvent.offsetY / this.items[targetIndex].size;
		const sector = Math.floor(relativePosition / 0.25);
		return clamp(sector, 0, 3);
	}

	private getItemIndexFromEventTarget(target: EventTarget | null): number | undefined {
		const scrollableElement = this.scrollableElement.getDomNode();
		let element: HTMLElement | SVGElement | null = target as (HTMLElement | SVGElement | null);

		while ((isHTMLElement(element) || isSVGElement(element)) && element !== this.rowsContainer && scrollableElement.contains(element)) {
			const rawIndex = element.getAttribute('data-index');

			if (rawIndex) {
				const index = Number(rawIndex);

				if (!isNaN(index)) {
					return index;
				}
			}

			element = element.parentElement;
		}

		return undefined;
	}

	private getVisibleRange(renderTop: number, renderHeight: number): IRange {
		return {
			start: this.rangeMap.indexAt(renderTop),
			end: this.rangeMap.indexAfter(renderTop + renderHeight - 1)
		};
	}

	protected getRenderRange(renderTop: number, renderHeight: number): IRange {
		const range = this.getVisibleRange(renderTop, renderHeight);
		if (this.currentSelectionBounds) {
			const max = this.rangeMap.count;
			range.start = Math.min(range.start, this.currentSelectionBounds.start, max);
			range.end = Math.min(Math.max(range.end, this.currentSelectionBounds.end + 1), max);
		}

		return range;
	}

	/**
	 * Given a stable rendered state, checks every rendered element whether it needs
	 * to be probed for dynamic height. Adjusts scroll height and top if necessary.
	 */
	protected _rerender(renderTop: number, renderHeight: number, inSmoothScrolling?: boolean): void {
		const previousRenderRange = this.getRenderRange(renderTop, renderHeight);

		// Let's remember the second element's position, this helps in scrolling up
		// and preserving a linear upwards scroll movement
		let anchorElementIndex: number | undefined;
		let anchorElementTopDelta: number | undefined;

		if (renderTop === this.elementTop(previousRenderRange.start)) {
			anchorElementIndex = previousRenderRange.start;
			anchorElementTopDelta = 0;
		} else if (previousRenderRange.end - previousRenderRange.start > 1) {
			anchorElementIndex = previousRenderRange.start + 1;
			anchorElementTopDelta = this.elementTop(anchorElementIndex) - renderTop;
		}

		let heightDiff = 0;

		while (true) {
			const renderRange = this.getRenderRange(renderTop, renderHeight);

			let didChange = false;

			for (let i = renderRange.start; i < renderRange.end; i++) {
				const diff = this.probeDynamicHeight(i);

				if (diff !== 0) {
					this.rangeMap.splice(i, 1, [this.items[i]]);
				}

				heightDiff += diff;
				didChange = didChange || diff !== 0;
			}

			if (!didChange) {
				if (heightDiff !== 0) {
					this.eventuallyUpdateScrollDimensions();
				}

				const unrenderRanges = Range.relativeComplement(previousRenderRange, renderRange);

				for (const range of unrenderRanges) {
					for (let i = range.start; i < range.end; i++) {
						if (this.items[i].row) {
							this.removeItemFromDOM(i);
						}
					}
				}

				const renderRanges = Range.relativeComplement(renderRange, previousRenderRange).reverse();

				for (const range of renderRanges) {
					for (let i = range.end - 1; i >= range.start; i--) {
						this.insertItemInDOM(i);
					}
				}

				for (let i = renderRange.start; i < renderRange.end; i++) {
					if (this.items[i].row) {
						this.updateItemInDOM(this.items[i], i);
					}
				}

				if (typeof anchorElementIndex === 'number') {
					// To compute a destination scroll top, we need to take into account the current smooth scrolling
					// animation, and then reuse it with a new target (to avoid prolonging the scroll)
					// See https://github.com/microsoft/vscode/issues/104144
					// See https://github.com/microsoft/vscode/pull/104284
					// See https://github.com/microsoft/vscode/issues/107704
					const deltaScrollTop = this.scrollable.getFutureScrollPosition().scrollTop - renderTop;
					const newScrollTop = this.elementTop(anchorElementIndex) - anchorElementTopDelta! + deltaScrollTop;
					this.setScrollTop(newScrollTop, inSmoothScrolling);
				}

				this._onDidChangeContentHeight.fire(this.contentHeight);
				return;
			}
		}
	}

	private probeDynamicHeight(index: number): number {
		const item = this.items[index];

		if (!!this.virtualDelegate.getDynamicHeight) {
			const newSize = this.virtualDelegate.getDynamicHeight(item.element);
			if (newSize !== null) {
				const size = item.size;
				item.size = newSize;
				item.lastDynamicHeightWidth = this.renderWidth;
				return newSize - size;
			}
		}

		if (!item.hasDynamicHeight || item.lastDynamicHeightWidth === this.renderWidth) {
			return 0;
		}

		if (!!this.virtualDelegate.hasDynamicHeight && !this.virtualDelegate.hasDynamicHeight(item.element)) {
			return 0;
		}

		const size = item.size;

		if (item.row) {
			item.row.domNode.style.height = '';
			item.size = item.row.domNode.offsetHeight;
			if (item.size === 0) {
				if (!isAncestor(item.row.domNode, getWindow(item.row.domNode).document.body)) {
					console.warn('Measuring item node that is not in DOM! Add ListView to the DOM before measuring row height!', new Error().stack);
				} else {
					console.warn('Measured item node at 0px- ensure that ListView is not display:none before measuring row height!', new Error().stack);
				}
			}
			item.lastDynamicHeightWidth = this.renderWidth;
			return item.size - size;
		}

		const { row } = this.cache.alloc(item.templateId);
		row.domNode.style.height = '';
		this.rowsContainer.appendChild(row.domNode);

		const renderer = this.renderers.get(item.templateId);

		if (!renderer) {
			throw new BugIndicatingError('Missing renderer for templateId: ' + item.templateId);
		}

		renderer.renderElement(item.element, index, row.templateData);
		item.size = row.domNode.offsetHeight;
		renderer.disposeElement?.(item.element, index, row.templateData);

		this.virtualDelegate.setDynamicHeight?.(item.element, item.size);

		item.lastDynamicHeightWidth = this.renderWidth;
		row.domNode.remove();
		this.cache.release(row);

		return item.size - size;
	}

	getElementDomId(index: number): string {
		return `${this.domId}_${index}`;
	}

	// Dispose

	dispose() {
		for (const item of this.items) {
			item.dragStartDisposable.dispose();
			item.checkedDisposable.dispose();

			if (item.row) {
				const renderer = this.renderers.get(item.row.templateId);
				if (renderer) {
					renderer.disposeElement?.(item.element, -1, item.row.templateData, undefined);
					renderer.disposeTemplate(item.row.templateData);
				}
			}
		}

		this.items = [];

		this.domNode?.remove();

		this.dragOverAnimationDisposable?.dispose();
		this.disposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/listWidget.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/listWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDragAndDropData } from '../../dnd.js';
import { Dimension, EventHelper, getActiveElement, getWindow, isActiveElement, isEditableElement, isHTMLElement, isMouseEvent } from '../../dom.js';
import { createStyleSheet } from '../../domStylesheets.js';
import { asCssValueWithDefault } from '../../cssValue.js';
import { DomEmitter } from '../../event.js';
import { IKeyboardEvent, StandardKeyboardEvent } from '../../keyboardEvent.js';
import { Gesture } from '../../touch.js';
import { alert, AriaRole } from '../aria/aria.js';
import { CombinedSpliceable } from './splice.js';
import { ScrollableElementChangeOptions } from '../scrollbar/scrollableElementOptions.js';
import { binarySearch, range } from '../../../common/arrays.js';
import { timeout } from '../../../common/async.js';
import { Color } from '../../../common/color.js';
import { memoize } from '../../../common/decorators.js';
import { Emitter, Event, EventBufferer } from '../../../common/event.js';
import { matchesFuzzy2, matchesPrefix } from '../../../common/filters.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { DisposableStore, dispose, IDisposable } from '../../../common/lifecycle.js';
import { clamp } from '../../../common/numbers.js';
import * as platform from '../../../common/platform.js';
import { ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import { ISpliceable } from '../../../common/sequence.js';
import { isNumber } from '../../../common/types.js';
import './list.css';
import { IIdentityProvider, IKeyboardNavigationDelegate, IKeyboardNavigationLabelProvider, IListContextMenuEvent, IListDragAndDrop, IListDragOverReaction, IListEvent, IListGestureEvent, IListMouseEvent, IListElementRenderDetails, IListRenderer, IListTouchEvent, IListVirtualDelegate, ListError } from './list.js';
import { IListView, IListViewAccessibilityProvider, IListViewDragAndDrop, IListViewOptions, IListViewOptionsUpdate, ListViewTargetSector, ListView } from './listView.js';
import { IMouseWheelEvent, StandardMouseEvent } from '../../mouseEvent.js';
import { autorun, constObservable, IObservable } from '../../../common/observable.js';

interface ITraitChangeEvent {
	indexes: number[];
	browserEvent?: UIEvent;
}

type ITraitTemplateData = HTMLElement;

type IAccessibilityTemplateData = {
	container: HTMLElement;
	disposables: DisposableStore;
};

interface IRenderedContainer {
	templateData: ITraitTemplateData;
	index: number;
}

class TraitRenderer<T> implements IListRenderer<T, ITraitTemplateData> {
	private renderedElements: IRenderedContainer[] = [];

	constructor(private trait: Trait<T>) { }

	get templateId(): string {
		return `template:${this.trait.name}`;
	}

	renderTemplate(container: HTMLElement): ITraitTemplateData {
		return container;
	}

	renderElement(element: T, index: number, templateData: ITraitTemplateData): void {
		const renderedElementIndex = this.renderedElements.findIndex(el => el.templateData === templateData);

		if (renderedElementIndex >= 0) {
			const rendered = this.renderedElements[renderedElementIndex];
			this.trait.unrender(templateData);
			rendered.index = index;
		} else {
			const rendered = { index, templateData };
			this.renderedElements.push(rendered);
		}

		this.trait.renderIndex(index, templateData);
	}

	splice(start: number, deleteCount: number, insertCount: number): void {
		const rendered: IRenderedContainer[] = [];

		for (const renderedElement of this.renderedElements) {

			if (renderedElement.index < start) {
				rendered.push(renderedElement);
			} else if (renderedElement.index >= start + deleteCount) {
				rendered.push({
					index: renderedElement.index + insertCount - deleteCount,
					templateData: renderedElement.templateData
				});
			}
		}

		this.renderedElements = rendered;
	}

	renderIndexes(indexes: number[]): void {
		for (const { index, templateData } of this.renderedElements) {
			if (indexes.indexOf(index) > -1) {
				this.trait.renderIndex(index, templateData);
			}
		}
	}

	disposeTemplate(templateData: ITraitTemplateData): void {
		const index = this.renderedElements.findIndex(el => el.templateData === templateData);

		if (index < 0) {
			return;
		}

		this.renderedElements.splice(index, 1);
	}
}

class Trait<T> implements ISpliceable<boolean>, IDisposable {

	protected indexes: number[] = [];
	protected sortedIndexes: number[] = [];

	private readonly _onChange = new Emitter<ITraitChangeEvent>();
	get onChange(): Event<ITraitChangeEvent> { return this._onChange.event; }

	get name(): string { return this._trait; }

	@memoize
	get renderer(): TraitRenderer<T> {
		return new TraitRenderer<T>(this);
	}

	constructor(private _trait: string) { }

	splice(start: number, deleteCount: number, elements: boolean[]): void {
		const diff = elements.length - deleteCount;
		const end = start + deleteCount;
		const sortedIndexes: number[] = [];
		let i = 0;

		while (i < this.sortedIndexes.length && this.sortedIndexes[i] < start) {
			sortedIndexes.push(this.sortedIndexes[i++]);
		}

		for (let j = 0; j < elements.length; j++) {
			if (elements[j]) {
				sortedIndexes.push(j + start);
			}
		}

		while (i < this.sortedIndexes.length && this.sortedIndexes[i] >= end) {
			sortedIndexes.push(this.sortedIndexes[i++] + diff);
		}

		this.renderer.splice(start, deleteCount, elements.length);
		this._set(sortedIndexes, sortedIndexes);
	}

	renderIndex(index: number, container: HTMLElement): void {
		container.classList.toggle(this._trait, this.contains(index));
	}

	unrender(container: HTMLElement): void {
		container.classList.remove(this._trait);
	}

	/**
	 * Sets the indexes which should have this trait.
	 *
	 * @param indexes Indexes which should have this trait.
	 * @return The old indexes which had this trait.
	 */
	set(indexes: number[], browserEvent?: UIEvent): number[] {
		return this._set(indexes, [...indexes].sort(numericSort), browserEvent);
	}

	private _set(indexes: number[], sortedIndexes: number[], browserEvent?: UIEvent): number[] {
		const result = this.indexes;
		const sortedResult = this.sortedIndexes;

		this.indexes = indexes;
		this.sortedIndexes = sortedIndexes;

		const toRender = disjunction(sortedResult, indexes);
		this.renderer.renderIndexes(toRender);

		this._onChange.fire({ indexes, browserEvent });
		return result;
	}

	get(): number[] {
		return this.indexes;
	}

	contains(index: number): boolean {
		return binarySearch(this.sortedIndexes, index, numericSort) >= 0;
	}

	dispose() {
		dispose(this._onChange);
	}
}

class SelectionTrait<T> extends Trait<T> {

	constructor(private setAriaSelected: boolean) {
		super('selected');
	}

	override renderIndex(index: number, container: HTMLElement): void {
		super.renderIndex(index, container);

		if (this.setAriaSelected) {
			if (this.contains(index)) {
				container.setAttribute('aria-selected', 'true');
			} else {
				container.setAttribute('aria-selected', 'false');
			}
		}
	}
}

/**
 * The TraitSpliceable is used as a util class to be able
 * to preserve traits across splice calls, given an identity
 * provider.
 */
class TraitSpliceable<T> implements ISpliceable<T> {

	constructor(
		private trait: Trait<T>,
		private view: IListView<T>,
		private identityProvider?: IIdentityProvider<T>
	) { }

	splice(start: number, deleteCount: number, elements: T[]): void {
		if (!this.identityProvider) {
			return this.trait.splice(start, deleteCount, new Array(elements.length).fill(false));
		}

		const pastElementsWithTrait = this.trait.get().map(i => this.identityProvider!.getId(this.view.element(i)).toString());
		if (pastElementsWithTrait.length === 0) {
			return this.trait.splice(start, deleteCount, new Array(elements.length).fill(false));
		}

		const pastElementsWithTraitSet = new Set(pastElementsWithTrait);
		const elementsWithTrait = elements.map(e => pastElementsWithTraitSet.has(this.identityProvider!.getId(e).toString()));
		this.trait.splice(start, deleteCount, elementsWithTrait);
	}
}

function isListElementDescendantOfClass(e: HTMLElement, className: string): boolean {
	if (e.classList.contains(className)) {
		return true;
	}

	if (e.classList.contains('monaco-list')) {
		return false;
	}

	if (!e.parentElement) {
		return false;
	}

	return isListElementDescendantOfClass(e.parentElement, className);
}

export function isMonacoEditor(e: HTMLElement): boolean {
	return isListElementDescendantOfClass(e, 'monaco-editor');
}

export function isMonacoCustomToggle(e: HTMLElement): boolean {
	return isListElementDescendantOfClass(e, 'monaco-custom-toggle');
}

export function isActionItem(e: HTMLElement): boolean {
	return isListElementDescendantOfClass(e, 'action-item');
}

export function isMonacoTwistie(e: HTMLElement): boolean {
	return isListElementDescendantOfClass(e, 'monaco-tl-twistie');
}

export function isStickyScrollElement(e: HTMLElement): boolean {
	return isListElementDescendantOfClass(e, 'monaco-tree-sticky-row');
}

export function isStickyScrollContainer(e: HTMLElement): boolean {
	return e.classList.contains('monaco-tree-sticky-container');
}

export function isButton(e: HTMLElement): boolean {
	if ((e.tagName === 'A' && e.classList.contains('monaco-button')) ||
		(e.tagName === 'DIV' && e.classList.contains('monaco-button-dropdown'))) {
		return true;
	}

	if (e.classList.contains('monaco-list')) {
		return false;
	}

	if (!e.parentElement) {
		return false;
	}

	return isButton(e.parentElement);
}

class KeyboardController<T> implements IDisposable {

	private readonly disposables = new DisposableStore();
	private readonly multipleSelectionDisposables = new DisposableStore();
	private multipleSelectionSupport: boolean | undefined;

	@memoize
	private get onKeyDown(): Event<StandardKeyboardEvent> {
		return Event.chain(
			this.disposables.add(new DomEmitter(this.view.domNode, 'keydown')).event, $ =>
			$.filter(e => !isEditableElement(e.target as HTMLElement))
				.map(e => new StandardKeyboardEvent(e))
		);
	}

	constructor(
		private list: List<T>,
		private view: IListView<T>,
		options: IListOptions<T>
	) {
		this.multipleSelectionSupport = options.multipleSelectionSupport;
		this.disposables.add(this.onKeyDown(e => {
			switch (e.keyCode) {
				case KeyCode.Enter:
					return this.onEnter(e);
				case KeyCode.UpArrow:
					return this.onUpArrow(e);
				case KeyCode.DownArrow:
					return this.onDownArrow(e);
				case KeyCode.PageUp:
					return this.onPageUpArrow(e);
				case KeyCode.PageDown:
					return this.onPageDownArrow(e);
				case KeyCode.Escape:
					return this.onEscape(e);
				case KeyCode.KeyA:
					if (this.multipleSelectionSupport && (platform.isMacintosh ? e.metaKey : e.ctrlKey)) {
						this.onCtrlA(e);
					}
			}
		}));
	}

	updateOptions(optionsUpdate: IListOptionsUpdate): void {
		if (optionsUpdate.multipleSelectionSupport !== undefined) {
			this.multipleSelectionSupport = optionsUpdate.multipleSelectionSupport;
		}
	}

	private onEnter(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.setSelection(this.list.getFocus(), e.browserEvent);
	}

	private onUpArrow(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.focusPrevious(1, false, e.browserEvent);
		const el = this.list.getFocus()[0];
		this.list.setAnchor(el);
		this.list.reveal(el);
		this.view.domNode.focus();
	}

	private onDownArrow(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.focusNext(1, false, e.browserEvent);
		const el = this.list.getFocus()[0];
		this.list.setAnchor(el);
		this.list.reveal(el);
		this.view.domNode.focus();
	}

	private onPageUpArrow(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.focusPreviousPage(e.browserEvent);
		const el = this.list.getFocus()[0];
		this.list.setAnchor(el);
		this.list.reveal(el);
		this.view.domNode.focus();
	}

	private onPageDownArrow(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.focusNextPage(e.browserEvent);
		const el = this.list.getFocus()[0];
		this.list.setAnchor(el);
		this.list.reveal(el);
		this.view.domNode.focus();
	}

	private onCtrlA(e: StandardKeyboardEvent): void {
		e.preventDefault();
		e.stopPropagation();
		this.list.setSelection(range(this.list.length), e.browserEvent);
		this.list.setAnchor(undefined);
		this.view.domNode.focus();
	}

	private onEscape(e: StandardKeyboardEvent): void {
		if (this.list.getSelection().length) {
			e.preventDefault();
			e.stopPropagation();
			this.list.setSelection([], e.browserEvent);
			this.list.setAnchor(undefined);
			this.view.domNode.focus();
		}
	}

	dispose() {
		this.disposables.dispose();
		this.multipleSelectionDisposables.dispose();
	}
}

export enum TypeNavigationMode {
	Automatic,
	Trigger
}

enum TypeNavigationControllerState {
	Idle,
	Typing
}

export const DefaultKeyboardNavigationDelegate = new class implements IKeyboardNavigationDelegate {
	mightProducePrintableCharacter(event: IKeyboardEvent): boolean {
		if (event.ctrlKey || event.metaKey || event.altKey) {
			return false;
		}

		return (event.keyCode >= KeyCode.KeyA && event.keyCode <= KeyCode.KeyZ)
			|| (event.keyCode >= KeyCode.Digit0 && event.keyCode <= KeyCode.Digit9)
			|| (event.keyCode >= KeyCode.Numpad0 && event.keyCode <= KeyCode.Numpad9)
			|| (event.keyCode >= KeyCode.Semicolon && event.keyCode <= KeyCode.Quote);
	}
};

class TypeNavigationController<T> implements IDisposable {

	private enabled = false;
	private state: TypeNavigationControllerState = TypeNavigationControllerState.Idle;

	private mode = TypeNavigationMode.Automatic;
	private triggered = false;
	private previouslyFocused = -1;

	private readonly enabledDisposables = new DisposableStore();
	private readonly disposables = new DisposableStore();

	constructor(
		private list: List<T>,
		private view: IListView<T>,
		private keyboardNavigationLabelProvider: IKeyboardNavigationLabelProvider<T>,
		private keyboardNavigationEventFilter: IKeyboardNavigationEventFilter,
		private delegate: IKeyboardNavigationDelegate
	) {
		this.updateOptions(list.options);
	}

	updateOptions(options: IListOptions<T>): void {
		if (options.typeNavigationEnabled ?? true) {
			this.enable();
		} else {
			this.disable();
		}

		this.mode = options.typeNavigationMode ?? TypeNavigationMode.Automatic;
	}

	trigger(): void {
		this.triggered = !this.triggered;
	}

	private enable(): void {
		if (this.enabled) {
			return;
		}

		let typing = false;

		const onChar = Event.chain(this.enabledDisposables.add(new DomEmitter(this.view.domNode, 'keydown')).event, $ =>
			$.filter(e => !isEditableElement(e.target as HTMLElement))
				.filter(() => this.mode === TypeNavigationMode.Automatic || this.triggered)
				.map(event => new StandardKeyboardEvent(event))
				.filter(e => typing || this.keyboardNavigationEventFilter(e))
				.filter(e => this.delegate.mightProducePrintableCharacter(e))
				.forEach(e => EventHelper.stop(e, true))
				.map(event => event.browserEvent.key)
		);

		const onClear = Event.debounce<string, null>(onChar, () => null, 800, undefined, undefined, undefined, this.enabledDisposables);
		const onInput = Event.reduce<string | null, string | null>(Event.any(onChar, onClear), (r, i) => i === null ? null : ((r || '') + i), undefined, this.enabledDisposables);

		onInput(this.onInput, this, this.enabledDisposables);
		onClear(this.onClear, this, this.enabledDisposables);

		onChar(() => typing = true, undefined, this.enabledDisposables);
		onClear(() => typing = false, undefined, this.enabledDisposables);

		this.enabled = true;
		this.triggered = false;
	}

	private disable(): void {
		if (!this.enabled) {
			return;
		}

		this.enabledDisposables.clear();
		this.enabled = false;
		this.triggered = false;
	}

	private onClear(): void {
		const focus = this.list.getFocus();
		if (focus.length > 0 && focus[0] === this.previouslyFocused) {
			// List: re-announce element on typing end since typed keys will interrupt aria label of focused element
			// Do not announce if there was a focus change at the end to prevent duplication https://github.com/microsoft/vscode/issues/95961
			const ariaLabel = this.list.options.accessibilityProvider?.getAriaLabel(this.list.element(focus[0]));

			if (typeof ariaLabel === 'string') {
				alert(ariaLabel);
			} else if (ariaLabel) {
				alert(ariaLabel.get());
			}
		}
		this.previouslyFocused = -1;
	}

	private onInput(word: string | null): void {
		if (!word) {
			this.state = TypeNavigationControllerState.Idle;
			this.triggered = false;
			return;
		}

		const focus = this.list.getFocus();
		const start = focus.length > 0 ? focus[0] : 0;
		const delta = this.state === TypeNavigationControllerState.Idle ? 1 : 0;
		this.state = TypeNavigationControllerState.Typing;

		for (let i = 0; i < this.list.length; i++) {
			const index = (start + i + delta) % this.list.length;
			const label = this.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(this.view.element(index));
			const labelStr = label && label.toString();

			if (this.list.options.typeNavigationEnabled) {
				if (typeof labelStr !== 'undefined') {

					// If prefix is found, focus and return early
					if (matchesPrefix(word, labelStr)) {
						this.previouslyFocused = start;
						this.list.setFocus([index]);
						this.list.reveal(index);
						return;
					}

					const fuzzy = matchesFuzzy2(word, labelStr);

					if (fuzzy) {
						const fuzzyScore = fuzzy[0].end - fuzzy[0].start;
						// ensures that when fuzzy matching, doesn't clash with prefix matching (1 input vs 1+ should be prefix and fuzzy respecitvely). Also makes sure that exact matches are prioritized.
						if (fuzzyScore > 1 && fuzzy.length === 1) {
							this.previouslyFocused = start;
							this.list.setFocus([index]);
							this.list.reveal(index);
							return;
						}
					}
				}
			} else if (typeof labelStr === 'undefined' || matchesPrefix(word, labelStr)) {
				this.previouslyFocused = start;
				this.list.setFocus([index]);
				this.list.reveal(index);
				return;
			}
		}
	}

	dispose() {
		this.disable();
		this.enabledDisposables.dispose();
		this.disposables.dispose();
	}
}

class DOMFocusController<T> implements IDisposable {

	private readonly disposables = new DisposableStore();

	constructor(
		private list: List<T>,
		private view: IListView<T>
	) {
		const onKeyDown = Event.chain(this.disposables.add(new DomEmitter(view.domNode, 'keydown')).event, $ => $
			.filter(e => !isEditableElement(e.target as HTMLElement))
			.map(e => new StandardKeyboardEvent(e))
		);

		const onTab = Event.chain(onKeyDown, $ => $.filter(e => e.keyCode === KeyCode.Tab && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey));

		onTab(this.onTab, this, this.disposables);
	}

	private onTab(e: StandardKeyboardEvent): void {
		if (e.target !== this.view.domNode) {
			return;
		}

		const focus = this.list.getFocus();

		if (focus.length === 0) {
			return;
		}

		const focusedDomElement = this.view.domElement(focus[0]);

		if (!focusedDomElement) {
			return;
		}

		// eslint-disable-next-line no-restricted-syntax
		const tabIndexElement = focusedDomElement.querySelector('[tabIndex]');

		if (!tabIndexElement || !(isHTMLElement(tabIndexElement)) || tabIndexElement.tabIndex === -1) {
			return;
		}

		const style = getWindow(tabIndexElement).getComputedStyle(tabIndexElement);
		if (style.visibility === 'hidden' || style.display === 'none') {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		tabIndexElement.focus();
	}

	dispose() {
		this.disposables.dispose();
	}
}

export function isSelectionSingleChangeEvent(event: IListMouseEvent<any> | IListTouchEvent<any>): boolean {
	return platform.isMacintosh ? event.browserEvent.metaKey : event.browserEvent.ctrlKey;
}

export function isSelectionRangeChangeEvent(event: IListMouseEvent<any> | IListTouchEvent<any>): boolean {
	return event.browserEvent.shiftKey;
}

function isMouseRightClick(event: UIEvent): boolean {
	return isMouseEvent(event) && event.button === 2;
}

const DefaultMultipleSelectionController = {
	isSelectionSingleChangeEvent,
	isSelectionRangeChangeEvent
};

export class MouseController<T> implements IDisposable {

	private multipleSelectionController: IMultipleSelectionController<T> | undefined;
	private readonly mouseSupport: boolean;
	private readonly disposables = new DisposableStore();

	private readonly _onPointer = this.disposables.add(new Emitter<IListMouseEvent<T>>());
	get onPointer() { return this._onPointer.event; }

	constructor(protected list: List<T>) {
		if (list.options.multipleSelectionSupport !== false) {
			this.multipleSelectionController = this.list.options.multipleSelectionController || DefaultMultipleSelectionController;
		}

		this.mouseSupport = typeof list.options.mouseSupport === 'undefined' || !!list.options.mouseSupport;

		if (this.mouseSupport) {
			list.onMouseDown(this.onMouseDown, this, this.disposables);
			list.onContextMenu(this.onContextMenu, this, this.disposables);
			list.onMouseDblClick(this.onDoubleClick, this, this.disposables);
			list.onTouchStart(this.onMouseDown, this, this.disposables);
			this.disposables.add(Gesture.addTarget(list.getHTMLElement()));
		}

		Event.any<IListMouseEvent<any> | IListGestureEvent<any>>(list.onMouseClick, list.onMouseMiddleClick, list.onTap)(this.onViewPointer, this, this.disposables);
	}

	updateOptions(optionsUpdate: IListOptionsUpdate): void {
		if (optionsUpdate.multipleSelectionSupport !== undefined) {
			this.multipleSelectionController = undefined;

			if (optionsUpdate.multipleSelectionSupport) {
				this.multipleSelectionController = this.list.options.multipleSelectionController || DefaultMultipleSelectionController;
			}
		}
	}

	protected isSelectionSingleChangeEvent(event: IListMouseEvent<any> | IListTouchEvent<any>): boolean {
		if (!this.multipleSelectionController) {
			return false;
		}

		return this.multipleSelectionController.isSelectionSingleChangeEvent(event);
	}

	protected isSelectionRangeChangeEvent(event: IListMouseEvent<any> | IListTouchEvent<any>): boolean {
		if (!this.multipleSelectionController) {
			return false;
		}

		return this.multipleSelectionController.isSelectionRangeChangeEvent(event);
	}

	private isSelectionChangeEvent(event: IListMouseEvent<any> | IListTouchEvent<any>): boolean {
		return this.isSelectionSingleChangeEvent(event) || this.isSelectionRangeChangeEvent(event);
	}

	protected onMouseDown(e: IListMouseEvent<T> | IListTouchEvent<T>): void {
		if (isMonacoEditor(e.browserEvent.target as HTMLElement)) {
			return;
		}

		if (getActiveElement() !== e.browserEvent.target) {
			this.list.domFocus();
		}
	}

	protected onContextMenu(e: IListContextMenuEvent<T>): void {
		if (isEditableElement(e.browserEvent.target as HTMLElement) || isMonacoEditor(e.browserEvent.target as HTMLElement)) {
			return;
		}

		const focus = typeof e.index === 'undefined' ? [] : [e.index];
		this.list.setFocus(focus, e.browserEvent);
	}

	protected onViewPointer(e: IListMouseEvent<T>): void {
		if (!this.mouseSupport) {
			return;
		}

		if (isEditableElement(e.browserEvent.target as HTMLElement) || isMonacoEditor(e.browserEvent.target as HTMLElement)) {
			return;
		}

		if (e.browserEvent.isHandledByList) {
			return;
		}

		e.browserEvent.isHandledByList = true;
		const focus = e.index;

		if (typeof focus === 'undefined') {
			this.list.setFocus([], e.browserEvent);
			this.list.setSelection([], e.browserEvent);
			this.list.setAnchor(undefined);
			return;
		}

		if (this.isSelectionChangeEvent(e)) {
			return this.changeSelection(e);
		}

		this.list.setFocus([focus], e.browserEvent);
		this.list.setAnchor(focus);

		if (!isMouseRightClick(e.browserEvent)) {
			this.list.setSelection([focus], e.browserEvent);
		}

		this._onPointer.fire(e);
	}

	protected onDoubleClick(e: IListMouseEvent<T>): void {
		if (isEditableElement(e.browserEvent.target as HTMLElement) || isMonacoEditor(e.browserEvent.target as HTMLElement)) {
			return;
		}

		if (this.isSelectionChangeEvent(e)) {
			return;
		}

		if (e.browserEvent.isHandledByList) {
			return;
		}

		e.browserEvent.isHandledByList = true;
		const focus = this.list.getFocus();
		this.list.setSelection(focus, e.browserEvent);
	}

	private changeSelection(e: IListMouseEvent<T> | IListTouchEvent<T>): void {
		const focus = e.index!;
		let anchor = this.list.getAnchor();

		if (this.isSelectionRangeChangeEvent(e)) {
			if (typeof anchor === 'undefined') {
				const currentFocus = this.list.getFocus()[0];
				anchor = currentFocus ?? focus;
				this.list.setAnchor(anchor);
			}

			const min = Math.min(anchor, focus);
			const max = Math.max(anchor, focus);
			const rangeSelection = range(min, max + 1);
			const selection = this.list.getSelection();
			const contiguousRange = getContiguousRangeContaining(disjunction(selection, [anchor]), anchor);

			if (contiguousRange.length === 0) {
				return;
			}

			const newSelection = disjunction(rangeSelection, relativeComplement(selection, contiguousRange));
			this.list.setSelection(newSelection, e.browserEvent);
			this.list.setFocus([focus], e.browserEvent);

		} else if (this.isSelectionSingleChangeEvent(e)) {
			const selection = this.list.getSelection();
			const newSelection = selection.filter(i => i !== focus);

			this.list.setFocus([focus]);
			this.list.setAnchor(focus);

			if (selection.length === newSelection.length) {
				this.list.setSelection([...newSelection, focus], e.browserEvent);
			} else {
				this.list.setSelection(newSelection, e.browserEvent);
			}
		}
	}

	dispose() {
		this.disposables.dispose();
	}
}

export interface IMultipleSelectionController<T> {
	isSelectionSingleChangeEvent(event: IListMouseEvent<T> | IListTouchEvent<T>): boolean;
	isSelectionRangeChangeEvent(event: IListMouseEvent<T> | IListTouchEvent<T>): boolean;
}

export interface IStyleController {
	style(styles: IListStyles): void;
}

export interface IListAccessibilityProvider<T> extends IListViewAccessibilityProvider<T> {
	getAriaLabel(element: T): string | IObservable<string> | null;
	getWidgetAriaLabel(): string | IObservable<string>;
	getWidgetRole?(): AriaRole;
	getAriaLevel?(element: T): number | undefined;
	readonly onDidChangeActiveDescendant?: Event<void>;
	getActiveDescendantId?(element: T): string | undefined;
}

export class DefaultStyleController implements IStyleController {

	constructor(private styleElement: HTMLStyleElement, private selectorSuffix: string) { }

	style(styles: IListStyles): void {
		const suffix = this.selectorSuffix && `.${this.selectorSuffix}`;
		const content: string[] = [];

		if (styles.listBackground) {
			content.push(`.monaco-list${suffix} .monaco-list-rows { background: ${styles.listBackground}; }`);
		}

		if (styles.listFocusBackground) {
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.focused { background-color: ${styles.listFocusBackground}; }`);
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.focused:hover { background-color: ${styles.listFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listFocusForeground) {
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.focused { color: ${styles.listFocusForeground}; }`);
		}

		if (styles.listActiveSelectionBackground) {
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.selected { background-color: ${styles.listActiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.selected:hover { background-color: ${styles.listActiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listActiveSelectionForeground) {
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.selected { color: ${styles.listActiveSelectionForeground}; }`);
		}

		if (styles.listActiveSelectionIconForeground) {
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.selected .codicon { color: ${styles.listActiveSelectionIconForeground}; }`);
		}

		if (styles.listFocusAndSelectionBackground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus .monaco-list-row.selected.focused { background-color: ${styles.listFocusAndSelectionBackground}; }
			`);
		}

		if (styles.listFocusAndSelectionForeground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus .monaco-list-row.selected.focused { color: ${styles.listFocusAndSelectionForeground}; }
			`);
		}

		if (styles.listInactiveFocusForeground) {
			content.push(`.monaco-list${suffix} .monaco-list-row.focused { color:  ${styles.listInactiveFocusForeground}; }`);
			content.push(`.monaco-list${suffix} .monaco-list-row.focused:hover { color:  ${styles.listInactiveFocusForeground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionIconForeground) {
			content.push(`.monaco-list${suffix} .monaco-list-row.focused .codicon { color:  ${styles.listInactiveSelectionIconForeground}; }`);
		}

		if (styles.listInactiveFocusBackground) {
			content.push(`.monaco-list${suffix} .monaco-list-row.focused { background-color:  ${styles.listInactiveFocusBackground}; }`);
			content.push(`.monaco-list${suffix} .monaco-list-row.focused:hover { background-color:  ${styles.listInactiveFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionBackground) {
			content.push(`.monaco-list${suffix} .monaco-list-row.selected { background-color:  ${styles.listInactiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix} .monaco-list-row.selected:hover { background-color:  ${styles.listInactiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionForeground) {
			content.push(`.monaco-list${suffix} .monaco-list-row.selected { color: ${styles.listInactiveSelectionForeground}; }`);
		}

		if (styles.listHoverBackground) {
			content.push(`.monaco-list${suffix}:not(.drop-target):not(.dragging) .monaco-list-row:hover:not(.selected):not(.focused) { background-color: ${styles.listHoverBackground}; }`);
		}

		if (styles.listHoverForeground) {
			content.push(`.monaco-list${suffix}:not(.drop-target):not(.dragging) .monaco-list-row:hover:not(.selected):not(.focused) { color:  ${styles.listHoverForeground}; }`);
		}

		/**
		 * Outlines
		 */
		const focusAndSelectionOutline = asCssValueWithDefault(styles.listFocusAndSelectionOutline, asCssValueWithDefault(styles.listSelectionOutline, styles.listFocusOutline ?? ''));
		if (focusAndSelectionOutline) { // default: listFocusOutline
			content.push(`.monaco-list${suffix}:focus .monaco-list-row.focused.selected { outline: 1px solid ${focusAndSelectionOutline}; outline-offset: -1px;}`);
		}

		if (styles.listFocusOutline) { // default: set
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus .monaco-list-row.focused,
				.context-menu-visible .monaco-list${suffix}.last-focused .monaco-list-row.focused { outline: 1px solid ${styles.listFocusOutline}; outline-offset: -1px; }
			`);
		}

		const inactiveFocusAndSelectionOutline = asCssValueWithDefault(styles.listSelectionOutline, styles.listInactiveFocusOutline ?? '');
		if (inactiveFocusAndSelectionOutline) {
			content.push(`.monaco-list${suffix} .monaco-list-row.focused.selected { outline: 1px dotted ${inactiveFocusAndSelectionOutline}; outline-offset: -1px; }`);
		}

		if (styles.listSelectionOutline) { // default: activeContrastBorder
			content.push(`.monaco-list${suffix} .monaco-list-row.selected { outline: 1px dotted ${styles.listSelectionOutline}; outline-offset: -1px; }`);
		}

		if (styles.listInactiveFocusOutline) { // default: null
			content.push(`.monaco-list${suffix} .monaco-list-row.focused { outline: 1px dotted ${styles.listInactiveFocusOutline}; outline-offset: -1px; }`);
		}

		if (styles.listHoverOutline) {  // default: activeContrastBorder
			content.push(`.monaco-list${suffix} .monaco-list-row:hover { outline: 1px dashed ${styles.listHoverOutline}; outline-offset: -1px; }`);
		}

		if (styles.listDropOverBackground) {
			content.push(`
				.monaco-list${suffix}.drop-target,
				.monaco-list${suffix} .monaco-list-rows.drop-target,
				.monaco-list${suffix} .monaco-list-row.drop-target { background-color: ${styles.listDropOverBackground} !important; color: inherit !important; }
			`);
		}

		if (styles.listDropBetweenBackground) {
			content.push(`
			.monaco-list${suffix} .monaco-list-rows.drop-target-before .monaco-list-row:first-child::before,
			.monaco-list${suffix} .monaco-list-row.drop-target-before::before {
				content: ""; position: absolute; top: 0px; left: 0px; width: 100%; height: 1px;
				background-color: ${styles.listDropBetweenBackground};
			}`);
			content.push(`
			.monaco-list${suffix} .monaco-list-rows.drop-target-after .monaco-list-row:last-child::after,
			.monaco-list${suffix} .monaco-list-row.drop-target-after::after {
				content: ""; position: absolute; bottom: 0px; left: 0px; width: 100%; height: 1px;
				background-color: ${styles.listDropBetweenBackground};
			}`);
		}

		if (styles.tableColumnsBorder) {
			content.push(`
				.monaco-table > .monaco-split-view2,
				.monaco-table > .monaco-split-view2 .monaco-sash.vertical::before,
				.monaco-enable-motion .monaco-table:hover > .monaco-split-view2,
				.monaco-enable-motion .monaco-table:hover > .monaco-split-view2 .monaco-sash.vertical::before {
					border-color: ${styles.tableColumnsBorder};
				}

				.monaco-enable-motion .monaco-table > .monaco-split-view2,
				.monaco-enable-motion .monaco-table > .monaco-split-view2 .monaco-sash.vertical::before {
					border-color: transparent;
				}
			`);
		}

		if (styles.tableOddRowsBackgroundColor) {
			content.push(`
				.monaco-table .monaco-list-row[data-parity=odd]:not(.focused):not(.selected):not(:hover) .monaco-table-tr,
				.monaco-table .monaco-list:not(:focus) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr,
				.monaco-table .monaco-list:not(.focused) .monaco-list-row[data-parity=odd].focused:not(.selected):not(:hover) .monaco-table-tr {
					background-color: ${styles.tableOddRowsBackgroundColor};
				}
			`);
		}

		this.styleElement.textContent = content.join('\n');
	}
}

export interface IKeyboardNavigationEventFilter {
	(e: StandardKeyboardEvent): boolean;
}

export interface IListOptionsUpdate extends IListViewOptionsUpdate {
	readonly typeNavigationEnabled?: boolean;
	readonly typeNavigationMode?: TypeNavigationMode;
	readonly multipleSelectionSupport?: boolean;
}

export interface IListOptions<T> extends IListOptionsUpdate {
	readonly identityProvider?: IIdentityProvider<T>;
	readonly dnd?: IListDragAndDrop<T>;
	readonly keyboardNavigationLabelProvider?: IKeyboardNavigationLabelProvider<T>;
	readonly keyboardNavigationDelegate?: IKeyboardNavigationDelegate;
	readonly keyboardSupport?: boolean;
	readonly multipleSelectionController?: IMultipleSelectionController<T>;
	readonly styleController?: (suffix: string) => IStyleController;
	readonly accessibilityProvider?: IListAccessibilityProvider<T>;
	readonly keyboardNavigationEventFilter?: IKeyboardNavigationEventFilter;

	// list view options
	readonly useShadows?: boolean;
	readonly verticalScrollMode?: ScrollbarVisibility;
	readonly setRowLineHeight?: boolean;
	readonly setRowHeight?: boolean;
	readonly supportDynamicHeights?: boolean;
	readonly mouseSupport?: boolean;
	readonly userSelection?: boolean;
	readonly horizontalScrolling?: boolean;
	readonly scrollByPage?: boolean;
	readonly transformOptimization?: boolean;
	readonly smoothScrolling?: boolean;
	readonly scrollableElementChangeOptions?: ScrollableElementChangeOptions;
	readonly alwaysConsumeMouseWheel?: boolean;
	readonly initialSize?: Dimension;
	readonly paddingTop?: number;
	readonly paddingBottom?: number;
}

export interface IListStyles {
	listBackground: string | undefined;
	listFocusBackground: string | undefined;
	listFocusForeground: string | undefined;
	listActiveSelectionBackground: string | undefined;
	listActiveSelectionForeground: string | undefined;
	listActiveSelectionIconForeground: string | undefined;
	listFocusAndSelectionOutline: string | undefined;
	listFocusAndSelectionBackground: string | undefined;
	listFocusAndSelectionForeground: string | undefined;
	listInactiveSelectionBackground: string | undefined;
	listInactiveSelectionIconForeground: string | undefined;
	listInactiveSelectionForeground: string | undefined;
	listInactiveFocusForeground: string | undefined;
	listInactiveFocusBackground: string | undefined;
	listHoverBackground: string | undefined;
	listHoverForeground: string | undefined;
	listDropOverBackground: string | undefined;
	listDropBetweenBackground: string | undefined;
	listFocusOutline: string | undefined;
	listInactiveFocusOutline: string | undefined;
	listSelectionOutline: string | undefined;
	listHoverOutline: string | undefined;
	treeIndentGuidesStroke: string | undefined;
	treeInactiveIndentGuidesStroke: string | undefined;
	treeStickyScrollBackground: string | undefined;
	treeStickyScrollBorder: string | undefined;
	treeStickyScrollShadow: string | undefined;
	tableColumnsBorder: string | undefined;
	tableOddRowsBackgroundColor: string | undefined;
}

export const unthemedListStyles: IListStyles = {
	listFocusBackground: '#7FB0D0',
	listActiveSelectionBackground: '#0E639C',
	listActiveSelectionForeground: '#FFFFFF',
	listActiveSelectionIconForeground: '#FFFFFF',
	listFocusAndSelectionOutline: '#90C2F9',
	listFocusAndSelectionBackground: '#094771',
	listFocusAndSelectionForeground: '#FFFFFF',
	listInactiveSelectionBackground: '#3F3F46',
	listInactiveSelectionIconForeground: '#FFFFFF',
	listHoverBackground: '#2A2D2E',
	listDropOverBackground: '#383B3D',
	listDropBetweenBackground: '#EEEEEE',
	treeIndentGuidesStroke: '#a9a9a9',
	treeInactiveIndentGuidesStroke: Color.fromHex('#a9a9a9').transparent(0.4).toString(),
	tableColumnsBorder: Color.fromHex('#cccccc').transparent(0.2).toString(),
	tableOddRowsBackgroundColor: Color.fromHex('#cccccc').transparent(0.04).toString(),
	listBackground: undefined,
	listFocusForeground: undefined,
	listInactiveSelectionForeground: undefined,
	listInactiveFocusForeground: undefined,
	listInactiveFocusBackground: undefined,
	listHoverForeground: undefined,
	listFocusOutline: undefined,
	listInactiveFocusOutline: undefined,
	listSelectionOutline: undefined,
	listHoverOutline: undefined,
	treeStickyScrollBackground: undefined,
	treeStickyScrollBorder: undefined,
	treeStickyScrollShadow: undefined
};

const DefaultOptions: IListOptions<any> = {
	keyboardSupport: true,
	mouseSupport: true,
	multipleSelectionSupport: true,
	dnd: {
		getDragURI() { return null; },
		onDragStart(): void { },
		onDragOver() { return false; },
		drop() { },
		dispose() { }
	}
};

// TODO@Joao: move these utils into a SortedArray class

function getContiguousRangeContaining(range: number[], value: number): number[] {
	const index = range.indexOf(value);

	if (index === -1) {
		return [];
	}

	const result: number[] = [];
	let i = index - 1;
	while (i >= 0 && range[i] === value - (index - i)) {
		result.push(range[i--]);
	}

	result.reverse();
	i = index;
	while (i < range.length && range[i] === value + (i - index)) {
		result.push(range[i++]);
	}

	return result;
}

/**
 * Given two sorted collections of numbers, returns the intersection
 * between them (OR).
 */
function disjunction(one: number[], other: number[]): number[] {
	const result: number[] = [];
	let i = 0, j = 0;

	while (i < one.length || j < other.length) {
		if (i >= one.length) {
			result.push(other[j++]);
		} else if (j >= other.length) {
			result.push(one[i++]);
		} else if (one[i] === other[j]) {
			result.push(one[i]);
			i++;
			j++;
			continue;
		} else if (one[i] < other[j]) {
			result.push(one[i++]);
		} else {
			result.push(other[j++]);
		}
	}

	return result;
}

/**
 * Given two sorted collections of numbers, returns the relative
 * complement between them (XOR).
 */
function relativeComplement(one: number[], other: number[]): number[] {
	const result: number[] = [];
	let i = 0, j = 0;

	while (i < one.length || j < other.length) {
		if (i >= one.length) {
			result.push(other[j++]);
		} else if (j >= other.length) {
			result.push(one[i++]);
		} else if (one[i] === other[j]) {
			i++;
			j++;
			continue;
		} else if (one[i] < other[j]) {
			result.push(one[i++]);
		} else {
			j++;
		}
	}

	return result;
}

const numericSort = (a: number, b: number) => a - b;

class PipelineRenderer<T> implements IListRenderer<T, any> {

	constructor(
		private _templateId: string,
		private renderers: IListRenderer<any /* TODO@joao */, any>[]
	) { }

	get templateId(): string {
		return this._templateId;
	}

	renderTemplate(container: HTMLElement): any[] {
		return this.renderers.map(r => r.renderTemplate(container));
	}

	renderElement(element: T, index: number, templateData: any[], renderDetails?: IListElementRenderDetails): void {
		let i = 0;

		for (const renderer of this.renderers) {
			renderer.renderElement(element, index, templateData[i++], renderDetails);
		}
	}

	disposeElement(element: T, index: number, templateData: any[], renderDetails?: IListElementRenderDetails): void {
		let i = 0;

		for (const renderer of this.renderers) {
			renderer.disposeElement?.(element, index, templateData[i], renderDetails);

			i += 1;
		}
	}

	disposeTemplate(templateData: unknown[]): void {
		let i = 0;

		for (const renderer of this.renderers) {
			renderer.disposeTemplate(templateData[i++]);
		}
	}
}

class AccessibiltyRenderer<T> implements IListRenderer<T, IAccessibilityTemplateData> {

	templateId: string = 'a18n';

	constructor(private accessibilityProvider: IListAccessibilityProvider<T>) { }

	renderTemplate(container: HTMLElement): IAccessibilityTemplateData {
		return { container, disposables: new DisposableStore() };
	}

	renderElement(element: T, index: number, data: IAccessibilityTemplateData): void {
		const ariaLabel = this.accessibilityProvider.getAriaLabel(element);
		const observable = (ariaLabel && typeof ariaLabel !== 'string') ? ariaLabel : constObservable(ariaLabel);

		data.disposables.add(autorun(reader => {
			this.setAriaLabel(reader.readObservable(observable), data.container);
		}));

		const ariaLevel = this.accessibilityProvider.getAriaLevel && this.accessibilityProvider.getAriaLevel(element);

		if (typeof ariaLevel === 'number') {
			data.container.setAttribute('aria-level', `${ariaLevel}`);
		} else {
			data.container.removeAttribute('aria-level');
		}
	}

	private setAriaLabel(ariaLabel: string | null, element: HTMLElement): void {
		if (ariaLabel) {
			element.setAttribute('aria-label', ariaLabel);
		} else {
			element.removeAttribute('aria-label');
		}
	}

	disposeElement(element: T, index: number, templateData: IAccessibilityTemplateData): void {
		templateData.disposables.clear();
	}

	disposeTemplate(templateData: IAccessibilityTemplateData): void {
		templateData.disposables.dispose();
	}
}

class ListViewDragAndDrop<T> implements IListViewDragAndDrop<T> {

	constructor(private list: List<T>, private dnd: IListDragAndDrop<T>) { }

	getDragElements(element: T): T[] {
		const selection = this.list.getSelectedElements();
		const elements = selection.indexOf(element) > -1 ? selection : [element];
		return elements;
	}

	getDragURI(element: T): string | null {
		return this.dnd.getDragURI(element);
	}

	getDragLabel?(elements: T[], originalEvent: DragEvent): string | undefined {
		if (this.dnd.getDragLabel) {
			return this.dnd.getDragLabel(elements, originalEvent);
		}

		return undefined;
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		this.dnd.onDragStart?.(data, originalEvent);
	}

	onDragOver(data: IDragAndDropData, targetElement: T, targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | IListDragOverReaction {
		return this.dnd.onDragOver(data, targetElement, targetIndex, targetSector, originalEvent);
	}

	onDragLeave(data: IDragAndDropData, targetElement: T, targetIndex: number, originalEvent: DragEvent): void {
		this.dnd.onDragLeave?.(data, targetElement, targetIndex, originalEvent);
	}

	onDragEnd(originalEvent: DragEvent): void {
		this.dnd.onDragEnd?.(originalEvent);
	}

	drop(data: IDragAndDropData, targetElement: T, targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void {
		this.dnd.drop(data, targetElement, targetIndex, targetSector, originalEvent);
	}

	dispose(): void {
		this.dnd.dispose();
	}
}

/**
 * The {@link List} is a virtual scrolling widget, built on top of the {@link ListView}
 * widget.
 *
 * Features:
 * - Customizable keyboard and mouse support
 * - Element traits: focus, selection, achor
 * - Accessibility support
 * - Touch support
 * - Performant template-based rendering
 * - Horizontal scrolling
 * - Variable element height support
 * - Dynamic element height support
 * - Drag-and-drop support
 */
export class List<T> implements ISpliceable<T>, IDisposable {

	private focus = new Trait<T>('focused');
	private selection: Trait<T>;
	private anchor = new Trait<T>('anchor');
	private eventBufferer = new EventBufferer();
	protected view: IListView<T>;
	private spliceable: ISpliceable<T>;
	private styleController: IStyleController;
	private typeNavigationController?: TypeNavigationController<T>;
	private accessibilityProvider?: IListAccessibilityProvider<T>;
	private keyboardController: KeyboardController<T> | undefined;
	private mouseController: MouseController<T>;
	private _ariaLabel: string = '';

	protected readonly disposables = new DisposableStore();

	@memoize get onDidChangeFocus(): Event<IListEvent<T>> {
		return Event.map(this.eventBufferer.wrapEvent(this.focus.onChange), e => this.toListEvent(e), this.disposables);
	}

	@memoize get onDidChangeSelection(): Event<IListEvent<T>> {
		return Event.map(this.eventBufferer.wrapEvent(this.selection.onChange), e => this.toListEvent(e), this.disposables);
	}

	get domId(): string { return this.view.domId; }
	get onDidScroll(): Event<ScrollEvent> { return this.view.onDidScroll; }
	get onMouseClick(): Event<IListMouseEvent<T>> { return this.view.onMouseClick; }
	get onMouseDblClick(): Event<IListMouseEvent<T>> { return this.view.onMouseDblClick; }
	get onMouseMiddleClick(): Event<IListMouseEvent<T>> { return this.view.onMouseMiddleClick; }
	get onPointer(): Event<IListMouseEvent<T>> { return this.mouseController.onPointer; }
	get onMouseUp(): Event<IListMouseEvent<T>> { return this.view.onMouseUp; }
	get onMouseDown(): Event<IListMouseEvent<T>> { return this.view.onMouseDown; }
	get onMouseOver(): Event<IListMouseEvent<T>> { return this.view.onMouseOver; }
	get onMouseMove(): Event<IListMouseEvent<T>> { return this.view.onMouseMove; }
	get onMouseOut(): Event<IListMouseEvent<T>> { return this.view.onMouseOut; }
	get onTouchStart(): Event<IListTouchEvent<T>> { return this.view.onTouchStart; }
	get onTap(): Event<IListGestureEvent<T>> { return this.view.onTap; }

	/**
	 * Possible context menu trigger events:
	 * - ContextMenu key
	 * - Shift F10
	 * - Ctrl Option Shift M (macOS with VoiceOver)
	 * - Mouse right click
	 */
	@memoize get onContextMenu(): Event<IListContextMenuEvent<T>> {
		let didJustPressContextMenuKey = false;

		const fromKeyDown: Event<any> = Event.chain(this.disposables.add(new DomEmitter(this.view.domNode, 'keydown')).event, $ =>
			$.map(e => new StandardKeyboardEvent(e))
				.filter(e => didJustPressContextMenuKey = e.keyCode === KeyCode.ContextMenu || (e.shiftKey && e.keyCode === KeyCode.F10))
				.map(e => EventHelper.stop(e, true))
				.filter(() => false));

		const fromKeyUp = Event.chain(this.disposables.add(new DomEmitter(this.view.domNode, 'keyup')).event, $ =>
			$.forEach(() => didJustPressContextMenuKey = false)
				.map(e => new StandardKeyboardEvent(e))
				.filter(e => e.keyCode === KeyCode.ContextMenu || (e.shiftKey && e.keyCode === KeyCode.F10))
				.map(e => EventHelper.stop(e, true))
				.map(({ browserEvent }) => {
					const focus = this.getFocus();
					const index = focus.length ? focus[0] : undefined;
					const element = typeof index !== 'undefined' ? this.view.element(index) : undefined;
					const anchor = typeof index !== 'undefined' ? this.view.domElement(index) as HTMLElement : this.view.domNode;
					return { index, element, anchor, browserEvent };
				}));

		const fromMouse = Event.chain(this.view.onContextMenu, $ =>
			$.filter(_ => !didJustPressContextMenuKey)
				.map(({ element, index, browserEvent }) => ({ element, index, anchor: new StandardMouseEvent(getWindow(this.view.domNode), browserEvent), browserEvent }))
		);

		return Event.any<IListContextMenuEvent<T>>(fromKeyDown, fromKeyUp, fromMouse);
	}

	@memoize get onKeyDown(): Event<KeyboardEvent> { return this.disposables.add(new DomEmitter(this.view.domNode, 'keydown')).event; }
	@memoize get onKeyUp(): Event<KeyboardEvent> { return this.disposables.add(new DomEmitter(this.view.domNode, 'keyup')).event; }
	@memoize get onKeyPress(): Event<KeyboardEvent> { return this.disposables.add(new DomEmitter(this.view.domNode, 'keypress')).event; }

	@memoize get onDidFocus(): Event<void> { return Event.signal(this.disposables.add(new DomEmitter(this.view.domNode, 'focus', true)).event); }
	@memoize get onDidBlur(): Event<void> { return Event.signal(this.disposables.add(new DomEmitter(this.view.domNode, 'blur', true)).event); }

	private readonly _onDidDispose = new Emitter<void>();
	readonly onDidDispose: Event<void> = this._onDidDispose.event;

	constructor(
		private user: string,
		container: HTMLElement,
		virtualDelegate: IListVirtualDelegate<T>,
		renderers: IListRenderer<any /* TODO@joao */, any>[],
		private _options: IListOptions<T> = DefaultOptions
	) {
		const role = this._options.accessibilityProvider && this._options.accessibilityProvider.getWidgetRole ? this._options.accessibilityProvider?.getWidgetRole() : 'list';
		this.selection = new SelectionTrait(role !== 'listbox');

		const baseRenderers: IListRenderer<T, unknown>[] = [this.focus.renderer, this.selection.renderer];

		this.accessibilityProvider = _options.accessibilityProvider;

		if (this.accessibilityProvider) {
			baseRenderers.push(new AccessibiltyRenderer<T>(this.accessibilityProvider));

			this.accessibilityProvider.onDidChangeActiveDescendant?.(this.onDidChangeActiveDescendant, this, this.disposables);
		}

		renderers = renderers.map(r => new PipelineRenderer(r.templateId, [...baseRenderers, r]));

		const viewOptions: IListViewOptions<T> = {
			..._options,
			dnd: _options.dnd && new ListViewDragAndDrop(this, _options.dnd)
		};

		this.view = this.createListView(container, virtualDelegate, renderers, viewOptions);
		this.view.domNode.setAttribute('role', role);

		if (_options.styleController) {
			this.styleController = _options.styleController(this.view.domId);
		} else {
			const styleElement = createStyleSheet(this.view.domNode);
			this.styleController = new DefaultStyleController(styleElement, this.view.domId);
		}

		this.spliceable = new CombinedSpliceable([
			new TraitSpliceable(this.focus, this.view, _options.identityProvider),
			new TraitSpliceable(this.selection, this.view, _options.identityProvider),
			new TraitSpliceable(this.anchor, this.view, _options.identityProvider),
			this.view
		]);

		this.disposables.add(this.focus);
		this.disposables.add(this.selection);
		this.disposables.add(this.anchor);
		this.disposables.add(this.view);
		this.disposables.add(this._onDidDispose);

		this.disposables.add(new DOMFocusController(this, this.view));

		if (typeof _options.keyboardSupport !== 'boolean' || _options.keyboardSupport) {
			this.keyboardController = new KeyboardController(this, this.view, _options);
			this.disposables.add(this.keyboardController);
		}

		if (_options.keyboardNavigationLabelProvider) {
			const delegate = _options.keyboardNavigationDelegate || DefaultKeyboardNavigationDelegate;
			this.typeNavigationController = new TypeNavigationController(this, this.view, _options.keyboardNavigationLabelProvider, _options.keyboardNavigationEventFilter ?? (() => true), delegate);
			this.disposables.add(this.typeNavigationController);
		}

		this.mouseController = this.createMouseController(_options);
		this.disposables.add(this.mouseController);

		this.onDidChangeFocus(this._onFocusChange, this, this.disposables);
		this.onDidChangeSelection(this._onSelectionChange, this, this.disposables);

		if (this.accessibilityProvider) {
			const ariaLabel = this.accessibilityProvider.getWidgetAriaLabel();
			const observable = (ariaLabel && typeof ariaLabel !== 'string') ? ariaLabel : constObservable(ariaLabel);

			this.disposables.add(autorun(reader => {
				this.ariaLabel = reader.readObservable(observable);
			}));
		}

		if (this._options.multipleSelectionSupport !== false) {
			this.view.domNode.setAttribute('aria-multiselectable', 'true');
		}
	}

	protected createListView(container: HTMLElement, virtualDelegate: IListVirtualDelegate<T>, renderers: IListRenderer<any, any>[], viewOptions: IListViewOptions<T>): IListView<T> {
		return new ListView(container, virtualDelegate, renderers, viewOptions);
	}

	protected createMouseController(options: IListOptions<T>): MouseController<T> {
		return new MouseController(this);
	}

	updateOptions(optionsUpdate: IListOptionsUpdate = {}): void {
		this._options = { ...this._options, ...optionsUpdate };

		this.typeNavigationController?.updateOptions(this._options);

		if (this._options.multipleSelectionController !== undefined) {
			if (this._options.multipleSelectionSupport) {
				this.view.domNode.setAttribute('aria-multiselectable', 'true');
			} else {
				this.view.domNode.removeAttribute('aria-multiselectable');
			}
		}

		this.mouseController.updateOptions(optionsUpdate);
		this.keyboardController?.updateOptions(optionsUpdate);
		this.view.updateOptions(optionsUpdate);
	}

	get options(): IListOptions<T> {
		return this._options;
	}

	splice(start: number, deleteCount: number, elements: readonly T[] = []): void {
		if (start < 0 || start > this.view.length) {
			throw new ListError(this.user, `Invalid start index: ${start}`);
		}

		if (deleteCount < 0) {
			throw new ListError(this.user, `Invalid delete count: ${deleteCount}`);
		}

		if (deleteCount === 0 && elements.length === 0) {
			return;
		}

		this.eventBufferer.bufferEvents(() => this.spliceable.splice(start, deleteCount, elements));
	}

	updateWidth(index: number): void {
		this.view.updateWidth(index);
	}

	updateElementHeight(index: number, size: number | undefined): void {
		this.view.updateElementHeight(index, size, null);
	}

	rerender(): void {
		this.view.rerender();
	}

	element(index: number): T {
		return this.view.element(index);
	}

	indexOf(element: T): number {
		return this.view.indexOf(element);
	}

	indexAt(position: number): number {
		return this.view.indexAt(position);
	}

	get length(): number {
		return this.view.length;
	}

	get contentHeight(): number {
		return this.view.contentHeight;
	}

	get contentWidth(): number {
		return this.view.contentWidth;
	}

	get onDidChangeContentHeight(): Event<number> {
		return this.view.onDidChangeContentHeight;
	}

	get onDidChangeContentWidth(): Event<number> {
		return this.view.onDidChangeContentWidth;
	}

	get scrollTop(): number {
		return this.view.getScrollTop();
	}

	set scrollTop(scrollTop: number) {
		this.view.setScrollTop(scrollTop);
	}

	get scrollLeft(): number {
		return this.view.getScrollLeft();
	}

	set scrollLeft(scrollLeft: number) {
		this.view.setScrollLeft(scrollLeft);
	}

	get scrollHeight(): number {
		return this.view.scrollHeight;
	}

	get renderHeight(): number {
		return this.view.renderHeight;
	}

	get firstVisibleIndex(): number {
		return this.view.firstVisibleIndex;
	}

	get firstMostlyVisibleIndex(): number {
		return this.view.firstMostlyVisibleIndex;
	}

	get lastVisibleIndex(): number {
		return this.view.lastVisibleIndex;
	}

	get ariaLabel(): string {
		return this._ariaLabel;
	}

	set ariaLabel(value: string) {
		this._ariaLabel = value;
		this.view.domNode.setAttribute('aria-label', value);
	}

	domFocus(): void {
		this.view.domNode.focus({ preventScroll: true });
	}

	layout(height?: number, width?: number): void {
		this.view.layout(height, width);
	}

	triggerTypeNavigation(): void {
		this.typeNavigationController?.trigger();
	}

	setSelection(indexes: number[], browserEvent?: UIEvent): void {
		for (const index of indexes) {
			if (index < 0 || index >= this.length) {
				throw new ListError(this.user, `Invalid index ${index}`);
			}
		}

		this.selection.set(indexes, browserEvent);
	}

	getSelection(): number[] {
		return this.selection.get();
	}

	getSelectedElements(): T[] {
		return this.getSelection().map(i => this.view.element(i));
	}

	setAnchor(index: number | undefined): void {
		if (typeof index === 'undefined') {
			this.anchor.set([]);
			return;
		}

		if (index < 0 || index >= this.length) {
			throw new ListError(this.user, `Invalid index ${index}`);
		}

		this.anchor.set([index]);
	}

	getAnchor(): number | undefined {
		return this.anchor.get().at(0);
	}

	getAnchorElement(): T | undefined {
		const anchor = this.getAnchor();
		return typeof anchor === 'undefined' ? undefined : this.element(anchor);
	}

	setFocus(indexes: number[], browserEvent?: UIEvent): void {
		for (const index of indexes) {
			if (index < 0 || index >= this.length) {
				throw new ListError(this.user, `Invalid index ${index}`);
			}
		}

		this.focus.set(indexes, browserEvent);
	}

	focusNext(n = 1, loop = false, browserEvent?: UIEvent, filter?: (element: T) => boolean): void {
		if (this.length === 0) { return; }

		const focus = this.focus.get();
		const index = this.findNextIndex(focus.length > 0 ? focus[0] + n : 0, loop, filter);

		if (index > -1) {
			this.setFocus([index], browserEvent);
		}
	}

	focusPrevious(n = 1, loop = false, browserEvent?: UIEvent, filter?: (element: T) => boolean): void {
		if (this.length === 0) { return; }

		const focus = this.focus.get();
		const index = this.findPreviousIndex(focus.length > 0 ? focus[0] - n : 0, loop, filter);

		if (index > -1) {
			this.setFocus([index], browserEvent);
		}
	}

	async focusNextPage(browserEvent?: UIEvent, filter?: (element: T) => boolean): Promise<void> {
		let lastPageIndex = this.view.indexAt(this.view.getScrollTop() + this.view.renderHeight);
		lastPageIndex = lastPageIndex === 0 ? 0 : lastPageIndex - 1;
		const currentlyFocusedElementIndex = this.getFocus()[0];

		if (currentlyFocusedElementIndex !== lastPageIndex && (currentlyFocusedElementIndex === undefined || lastPageIndex > currentlyFocusedElementIndex)) {
			const lastGoodPageIndex = this.findPreviousIndex(lastPageIndex, false, filter);

			if (lastGoodPageIndex > -1 && currentlyFocusedElementIndex !== lastGoodPageIndex) {
				this.setFocus([lastGoodPageIndex], browserEvent);
			} else {
				this.setFocus([lastPageIndex], browserEvent);
			}
		} else {
			const previousScrollTop = this.view.getScrollTop();
			let nextpageScrollTop = previousScrollTop + this.view.renderHeight;
			if (lastPageIndex > currentlyFocusedElementIndex) {
				// scroll last page element to the top only if the last page element is below the focused element
				nextpageScrollTop -= this.view.elementHeight(lastPageIndex);
			}

			this.view.setScrollTop(nextpageScrollTop);

			if (this.view.getScrollTop() !== previousScrollTop) {
				this.setFocus([]);

				// Let the scroll event listener run
				await timeout(0);
				await this.focusNextPage(browserEvent, filter);
			}
		}
	}

	async focusPreviousPage(browserEvent?: UIEvent, filter?: (element: T) => boolean, getPaddingTop: () => number = () => 0): Promise<void> {
		let firstPageIndex: number;
		const paddingTop = getPaddingTop();
		const scrollTop = this.view.getScrollTop() + paddingTop;

		if (scrollTop === 0) {
			firstPageIndex = this.view.indexAt(scrollTop);
		} else {
			firstPageIndex = this.view.indexAfter(scrollTop - 1);
		}

		const currentlyFocusedElementIndex = this.getFocus()[0];

		if (currentlyFocusedElementIndex !== firstPageIndex && (currentlyFocusedElementIndex === undefined || currentlyFocusedElementIndex >= firstPageIndex)) {
			const firstGoodPageIndex = this.findNextIndex(firstPageIndex, false, filter);

			if (firstGoodPageIndex > -1 && currentlyFocusedElementIndex !== firstGoodPageIndex) {
				this.setFocus([firstGoodPageIndex], browserEvent);
			} else {
				this.setFocus([firstPageIndex], browserEvent);
			}
		} else {
			const previousScrollTop = scrollTop;
			this.view.setScrollTop(scrollTop - this.view.renderHeight - paddingTop);

			if (this.view.getScrollTop() + getPaddingTop() !== previousScrollTop) {
				this.setFocus([]);

				// Let the scroll event listener run
				await timeout(0);
				await this.focusPreviousPage(browserEvent, filter, getPaddingTop);
			}
		}
	}

	focusLast(browserEvent?: UIEvent, filter?: (element: T) => boolean): void {
		if (this.length === 0) { return; }

		const index = this.findPreviousIndex(this.length - 1, false, filter);

		if (index > -1) {
			this.setFocus([index], browserEvent);
		}
	}

	focusFirst(browserEvent?: UIEvent, filter?: (element: T) => boolean): void {
		this.focusNth(0, browserEvent, filter);
	}

	focusNth(n: number, browserEvent?: UIEvent, filter?: (element: T) => boolean): void {
		if (this.length === 0) { return; }

		const index = this.findNextIndex(n, false, filter);

		if (index > -1) {
			this.setFocus([index], browserEvent);
		}
	}

	private findNextIndex(index: number, loop = false, filter?: (element: T) => boolean): number {
		for (let i = 0; i < this.length; i++) {
			if (index >= this.length && !loop) {
				return -1;
			}

			index = index % this.length;

			if (!filter || filter(this.element(index))) {
				return index;
			}

			index++;
		}

		return -1;
	}

	private findPreviousIndex(index: number, loop = false, filter?: (element: T) => boolean): number {
		for (let i = 0; i < this.length; i++) {
			if (index < 0 && !loop) {
				return -1;
			}

			index = (this.length + (index % this.length)) % this.length;

			if (!filter || filter(this.element(index))) {
				return index;
			}

			index--;
		}

		return -1;
	}

	getFocus(): number[] {
		return this.focus.get();
	}

	getFocusedElements(): T[] {
		return this.getFocus().map(i => this.view.element(i));
	}

	reveal(index: number, relativeTop?: number, paddingTop: number = 0): void {
		if (index < 0 || index >= this.length) {
			throw new ListError(this.user, `Invalid index ${index}`);
		}

		const scrollTop = this.view.getScrollTop();
		const elementTop = this.view.elementTop(index);
		const elementHeight = this.view.elementHeight(index);

		if (isNumber(relativeTop)) {
			// y = mx + b
			const m = elementHeight - this.view.renderHeight + paddingTop;
			this.view.setScrollTop(m * clamp(relativeTop, 0, 1) + elementTop - paddingTop);
		} else {
			const viewItemBottom = elementTop + elementHeight;
			const scrollBottom = scrollTop + this.view.renderHeight;

			if (elementTop < scrollTop + paddingTop && viewItemBottom >= scrollBottom) {
				// The element is already overflowing the viewport, no-op
			} else if (elementTop < scrollTop + paddingTop || (viewItemBottom >= scrollBottom && elementHeight >= this.view.renderHeight)) {
				this.view.setScrollTop(elementTop - paddingTop);
			} else if (viewItemBottom >= scrollBottom) {
				this.view.setScrollTop(viewItemBottom - this.view.renderHeight);
			}
		}
	}

	/**
	 * Returns the relative position of an element rendered in the list.
	 * Returns `null` if the element isn't *entirely* in the visible viewport.
	 */
	getRelativeTop(index: number, paddingTop: number = 0): number | null {
		if (index < 0 || index >= this.length) {
			throw new ListError(this.user, `Invalid index ${index}`);
		}

		const scrollTop = this.view.getScrollTop();
		const elementTop = this.view.elementTop(index);
		const elementHeight = this.view.elementHeight(index);

		if (elementTop < scrollTop + paddingTop || elementTop + elementHeight > scrollTop + this.view.renderHeight) {
			return null;
		}

		// y = mx + b
		const m = elementHeight - this.view.renderHeight + paddingTop;
		return Math.abs((scrollTop + paddingTop - elementTop) / m);
	}

	isDOMFocused(): boolean {
		return isActiveElement(this.view.domNode);
	}

	getHTMLElement(): HTMLElement {
		return this.view.domNode;
	}

	getScrollableElement(): HTMLElement {
		return this.view.scrollableElementDomNode;
	}

	getElementID(index: number): string {
		return this.view.getElementDomId(index);
	}

	getElementTop(index: number): number {
		return this.view.elementTop(index);
	}

	style(styles: IListStyles): void {
		this.styleController.style(styles);
	}

	delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this.view.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	private toListEvent({ indexes, browserEvent }: ITraitChangeEvent) {
		return { indexes, elements: indexes.map(i => this.view.element(i)), browserEvent };
	}

	private _onFocusChange(): void {
		const focus = this.focus.get();
		this.view.domNode.classList.toggle('element-focused', focus.length > 0);
		this.onDidChangeActiveDescendant();
	}

	private onDidChangeActiveDescendant(): void {
		const focus = this.focus.get();

		if (focus.length > 0) {
			let id: string | undefined;

			if (this.accessibilityProvider?.getActiveDescendantId) {
				id = this.accessibilityProvider.getActiveDescendantId(this.view.element(focus[0]));
			}

			this.view.domNode.setAttribute('aria-activedescendant', id || this.view.getElementDomId(focus[0]));
		} else {
			this.view.domNode.removeAttribute('aria-activedescendant');
		}
	}

	private _onSelectionChange(): void {
		const selection = this.selection.get();

		this.view.domNode.classList.toggle('selection-none', selection.length === 0);
		this.view.domNode.classList.toggle('selection-single', selection.length === 1);
		this.view.domNode.classList.toggle('selection-multiple', selection.length > 1);
	}

	dispose(): void {
		this._onDidDispose.fire();
		this.disposables.dispose();

		this._onDidDispose.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/rangeMap.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/rangeMap.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange, Range } from '../../../common/range.js';

export interface IItem {
	size: number;
}

export interface IRangedGroup {
	range: IRange;
	size: number;
}

/**
 * Returns the intersection between a ranged group and a range.
 * Returns `[]` if the intersection is empty.
 */
export function groupIntersect(range: IRange, groups: IRangedGroup[]): IRangedGroup[] {
	const result: IRangedGroup[] = [];

	for (const r of groups) {
		if (range.start >= r.range.end) {
			continue;
		}

		if (range.end < r.range.start) {
			break;
		}

		const intersection = Range.intersect(range, r.range);

		if (Range.isEmpty(intersection)) {
			continue;
		}

		result.push({
			range: intersection,
			size: r.size
		});
	}

	return result;
}

/**
 * Shifts a range by that `much`.
 */
export function shift({ start, end }: IRange, much: number): IRange {
	return { start: start + much, end: end + much };
}

/**
 * Consolidates a collection of ranged groups.
 *
 * Consolidation is the process of merging consecutive ranged groups
 * that share the same `size`.
 */
export function consolidate(groups: IRangedGroup[]): IRangedGroup[] {
	const result: IRangedGroup[] = [];
	let previousGroup: IRangedGroup | null = null;

	for (const group of groups) {
		const start = group.range.start;
		const end = group.range.end;
		const size = group.size;

		if (previousGroup && size === previousGroup.size) {
			previousGroup.range.end = end;
			continue;
		}

		previousGroup = { range: { start, end }, size };
		result.push(previousGroup);
	}

	return result;
}

/**
 * Concatenates several collections of ranged groups into a single
 * collection.
 */
function concat(...groups: IRangedGroup[][]): IRangedGroup[] {
	return consolidate(groups.reduce((r, g) => r.concat(g), []));
}

export interface IRangeMap {
	readonly size: number;
	readonly count: number;
	paddingTop: number;
	splice(index: number, deleteCount: number, items?: IItem[]): void;
	indexAt(position: number): number;
	indexAfter(position: number): number;
	positionAt(index: number): number;
}

export class RangeMap implements IRangeMap {

	private groups: IRangedGroup[] = [];
	private _size = 0;
	private _paddingTop = 0;

	get paddingTop() {
		return this._paddingTop;
	}

	set paddingTop(paddingTop: number) {
		this._size = this._size + paddingTop - this._paddingTop;
		this._paddingTop = paddingTop;
	}

	constructor(topPadding?: number) {
		this._paddingTop = topPadding ?? 0;
		this._size = this._paddingTop;
	}

	splice(index: number, deleteCount: number, items: IItem[] = []): void {
		const diff = items.length - deleteCount;
		const before = groupIntersect({ start: 0, end: index }, this.groups);
		const after = groupIntersect({ start: index + deleteCount, end: Number.POSITIVE_INFINITY }, this.groups)
			.map<IRangedGroup>(g => ({ range: shift(g.range, diff), size: g.size }));

		const middle = items.map<IRangedGroup>((item, i) => ({
			range: { start: index + i, end: index + i + 1 },
			size: item.size
		}));

		this.groups = concat(before, middle, after);
		this._size = this._paddingTop + this.groups.reduce((t, g) => t + (g.size * (g.range.end - g.range.start)), 0);
	}

	/**
	 * Returns the number of items in the range map.
	 */
	get count(): number {
		const len = this.groups.length;

		if (!len) {
			return 0;
		}

		return this.groups[len - 1].range.end;
	}

	/**
	 * Returns the sum of the sizes of all items in the range map.
	 */
	get size(): number {
		return this._size;
	}

	/**
	 * Returns the index of the item at the given position.
	 */
	indexAt(position: number): number {
		if (position < 0) {
			return -1;
		}

		if (position < this._paddingTop) {
			return 0;
		}

		let index = 0;
		let size = this._paddingTop;

		for (const group of this.groups) {
			const count = group.range.end - group.range.start;
			const newSize = size + (count * group.size);

			if (position < newSize) {
				return index + Math.floor((position - size) / group.size);
			}

			index += count;
			size = newSize;
		}

		return index;
	}

	/**
	 * Returns the index of the item right after the item at the
	 * index of the given position.
	 */
	indexAfter(position: number): number {
		return Math.min(this.indexAt(position) + 1, this.count);
	}

	/**
	 * Returns the start position of the item at the given index.
	 */
	positionAt(index: number): number {
		if (index < 0) {
			return -1;
		}

		let position = 0;
		let count = 0;

		for (const group of this.groups) {
			const groupCount = group.range.end - group.range.start;
			const newCount = count + groupCount;

			if (index < newCount) {
				return this._paddingTop + position + ((index - count) * group.size);
			}

			position += groupCount * group.size;
			count = newCount;
		}

		return -1;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/rowCache.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/rowCache.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../dom.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { IListRenderer } from './list.js';

export interface IRow {
	domNode: HTMLElement;
	templateId: string;
	templateData: any;
}

export class RowCache<T> implements IDisposable {

	private cache = new Map<string, IRow[]>();

	private readonly transactionNodesPendingRemoval = new Set<HTMLElement>();
	private inTransaction = false;

	constructor(private renderers: Map<string, IListRenderer<T, any>>) { }

	/**
	 * Returns a row either by creating a new one or reusing
	 * a previously released row which shares the same templateId.
	 *
	 * @returns A row and `isReusingConnectedDomNode` if the row's node is already in the dom in a stale position.
	 */
	alloc(templateId: string): { row: IRow; isReusingConnectedDomNode: boolean } {
		let result = this.getTemplateCache(templateId).pop();

		let isStale = false;
		if (result) {
			isStale = this.transactionNodesPendingRemoval.delete(result.domNode);
		} else {
			const domNode = $('.monaco-list-row');
			const renderer = this.getRenderer(templateId);
			const templateData = renderer.renderTemplate(domNode);
			result = { domNode, templateId, templateData };
		}

		return { row: result, isReusingConnectedDomNode: isStale };
	}

	/**
	 * Releases the row for eventual reuse.
	 */
	release(row: IRow): void {
		if (!row) {
			return;
		}

		this.releaseRow(row);
	}

	/**
	 * Begin a set of changes that use the cache. This lets us skip work when a row is removed and then inserted again.
	 */
	transact(makeChanges: () => void) {
		if (this.inTransaction) {
			throw new Error('Already in transaction');
		}

		this.inTransaction = true;

		try {
			makeChanges();
		} finally {
			for (const domNode of this.transactionNodesPendingRemoval) {
				this.doRemoveNode(domNode);
			}

			this.transactionNodesPendingRemoval.clear();
			this.inTransaction = false;
		}
	}

	private releaseRow(row: IRow): void {
		const { domNode, templateId } = row;
		if (domNode) {
			if (this.inTransaction) {
				this.transactionNodesPendingRemoval.add(domNode);
			} else {
				this.doRemoveNode(domNode);
			}
		}

		const cache = this.getTemplateCache(templateId);
		cache.push(row);
	}

	private doRemoveNode(domNode: HTMLElement) {
		domNode.classList.remove('scrolling');
		domNode.remove();
	}

	private getTemplateCache(templateId: string): IRow[] {
		let result = this.cache.get(templateId);

		if (!result) {
			result = [];
			this.cache.set(templateId, result);
		}

		return result;
	}

	dispose(): void {
		this.cache.forEach((cachedRows, templateId) => {
			for (const cachedRow of cachedRows) {
				const renderer = this.getRenderer(templateId);
				renderer.disposeTemplate(cachedRow.templateData);
				cachedRow.templateData = null;
			}
		});

		this.cache.clear();
		this.transactionNodesPendingRemoval.clear();
	}

	private getRenderer(templateId: string): IListRenderer<T, any> {
		const renderer = this.renderers.get(templateId);
		if (!renderer) {
			throw new Error(`No renderer found for ${templateId}`);
		}
		return renderer;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/list/splice.ts]---
Location: vscode-main/src/vs/base/browser/ui/list/splice.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISpliceable } from '../../../common/sequence.js';

export interface ISpreadSpliceable<T> {
	splice(start: number, deleteCount: number, ...elements: T[]): void;
}

export class CombinedSpliceable<T> implements ISpliceable<T> {

	constructor(private spliceables: ISpliceable<T>[]) { }

	splice(start: number, deleteCount: number, elements: T[]): void {
		this.spliceables.forEach(s => s.splice(start, deleteCount, elements));
	}
}
```

--------------------------------------------------------------------------------

````

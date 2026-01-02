---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 165
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 165 of 552)

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

---[FILE: src/vs/base/browser/ui/actionbar/actionViewItems.ts]---
Location: vscode-main/src/vs/base/browser/ui/actionbar/actionViewItems.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFirefox } from '../../browser.js';
import { DataTransfers } from '../../dnd.js';
import { addDisposableListener, EventHelper, EventLike, EventType } from '../../dom.js';
import { EventType as TouchEventType, Gesture } from '../../touch.js';
import { IActionViewItem } from './actionbar.js';
import { IContextViewProvider } from '../contextview/contextview.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { ISelectBoxOptions, ISelectBoxStyles, ISelectOptionItem, SelectBox } from '../selectBox/selectBox.js';
import { IToggleStyles } from '../toggle/toggle.js';
import { Action, ActionRunner, IAction, IActionChangeEvent, IActionRunner, Separator } from '../../../common/actions.js';
import { Disposable } from '../../../common/lifecycle.js';
import * as platform from '../../../common/platform.js';
import * as types from '../../../common/types.js';
import './actionbar.css';
import * as nls from '../../../../nls.js';
import type { IManagedHover, IManagedHoverContent } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';

export interface IBaseActionViewItemOptions {
	readonly draggable?: boolean;
	readonly isMenu?: boolean;
	readonly isTabList?: boolean;
	readonly useEventAsContext?: boolean;
	readonly hoverDelegate?: IHoverDelegate;
}

export class BaseActionViewItem extends Disposable implements IActionViewItem {

	element: HTMLElement | undefined;

	_context: unknown;
	readonly _action: IAction;

	private customHover?: IManagedHover;

	get action() {
		return this._action;
	}

	private _actionRunner: IActionRunner | undefined;

	constructor(
		context: unknown,
		action: IAction,
		protected readonly options: IBaseActionViewItemOptions = {}
	) {
		super();

		this._context = context || this;
		this._action = action;

		if (action instanceof Action) {
			this._register(action.onDidChange(event => {
				if (!this.element) {
					// we have not been rendered yet, so there
					// is no point in updating the UI
					return;
				}

				this.handleActionChangeEvent(event);
			}));
		}
	}

	private handleActionChangeEvent(event: IActionChangeEvent): void {
		if (event.enabled !== undefined) {
			this.updateEnabled();
		}

		if (event.checked !== undefined) {
			this.updateChecked();
		}

		if (event.class !== undefined) {
			this.updateClass();
		}

		if (event.label !== undefined) {
			this.updateLabel();
			this.updateTooltip();
		}

		if (event.tooltip !== undefined) {
			this.updateTooltip();
		}
	}

	get actionRunner(): IActionRunner {
		if (!this._actionRunner) {
			this._actionRunner = this._register(new ActionRunner());
		}

		return this._actionRunner;
	}

	set actionRunner(actionRunner: IActionRunner) {
		this._actionRunner = actionRunner;
	}

	isEnabled(): boolean {
		return this._action.enabled;
	}

	setActionContext(newContext: unknown): void {
		this._context = newContext;
	}

	render(container: HTMLElement): void {
		const element = this.element = container;
		this._register(Gesture.addTarget(container));

		const enableDragging = this.options && this.options.draggable;
		if (enableDragging) {
			container.draggable = true;

			if (isFirefox) {
				// Firefox: requires to set a text data transfer to get going
				this._register(addDisposableListener(container, EventType.DRAG_START, e => e.dataTransfer?.setData(DataTransfers.TEXT, this._action.label)));
			}
		}

		this._register(addDisposableListener(element, TouchEventType.Tap, e => this.onClick(e, true))); // Preserve focus on tap #125470

		this._register(addDisposableListener(element, EventType.MOUSE_DOWN, e => {
			if (!enableDragging) {
				EventHelper.stop(e, true); // do not run when dragging is on because that would disable it
			}

			if (this._action.enabled && e.button === 0) {
				element.classList.add('active');
			}
		}));

		if (platform.isMacintosh) {
			// macOS: allow to trigger the button when holding Ctrl+key and pressing the
			// main mouse button. This is for scenarios where e.g. some interaction forces
			// the Ctrl+key to be pressed and hold but the user still wants to interact
			// with the actions (for example quick access in quick navigation mode).
			this._register(addDisposableListener(element, EventType.CONTEXT_MENU, e => {
				if (e.button === 0 && e.ctrlKey === true) {
					this.onClick(e);
				}
			}));
		}

		this._register(addDisposableListener(element, EventType.CLICK, e => {
			EventHelper.stop(e, true);

			// menus do not use the click event
			if (!(this.options && this.options.isMenu)) {
				this.onClick(e);
			}
		}));

		this._register(addDisposableListener(element, EventType.DBLCLICK, e => {
			EventHelper.stop(e, true);
		}));

		[EventType.MOUSE_UP, EventType.MOUSE_OUT].forEach(event => {
			this._register(addDisposableListener(element, event, e => {
				EventHelper.stop(e);
				element.classList.remove('active');
			}));
		});
	}

	onClick(event: EventLike, preserveFocus = false): void {
		EventHelper.stop(event, true);

		const context = types.isUndefinedOrNull(this._context) ? this.options?.useEventAsContext ? event : { preserveFocus } : this._context;
		this.actionRunner.run(this._action, context);
	}

	// Only set the tabIndex on the element once it is about to get focused
	// That way this element wont be a tab stop when it is not needed #106441
	focus(): void {
		if (this.element) {
			this.element.tabIndex = 0;
			this.element.focus();
			this.element.classList.add('focused');
		}
	}

	isFocused(): boolean {
		return !!this.element?.classList.contains('focused');
	}

	blur(): void {
		if (this.element) {
			this.element.blur();
			this.element.tabIndex = -1;
			this.element.classList.remove('focused');
		}
	}

	setFocusable(focusable: boolean): void {
		if (this.element) {
			this.element.tabIndex = focusable ? 0 : -1;
		}
	}

	get trapsArrowNavigation(): boolean {
		return false;
	}

	protected updateEnabled(): void {
		// implement in subclass
	}

	protected updateLabel(): void {
		// implement in subclass
	}

	protected getClass(): string | undefined {
		return this.action.class;
	}

	protected getTooltip(): string | undefined {
		return this.action.tooltip;
	}

	protected getHoverContents(): IManagedHoverContent | undefined {
		return this.getTooltip();
	}

	protected updateTooltip(): void {
		if (!this.element) {
			return;
		}
		const title = this.getHoverContents() ?? '';
		this.updateAriaLabel();

		if (!this.customHover && title !== '') {
			const hoverDelegate = this.options.hoverDelegate ?? getDefaultHoverDelegate('element');
			this.customHover = this._store.add(getBaseLayerHoverDelegate().setupManagedHover(hoverDelegate, this.element, title));
		} else if (this.customHover) {
			this.customHover.update(title);
		}
	}

	protected updateAriaLabel(): void {
		if (this.element) {
			const title = this.getTooltip() ?? '';
			this.element.setAttribute('aria-label', title);
		}
	}

	protected updateClass(): void {
		// implement in subclass
	}

	protected updateChecked(): void {
		// implement in subclass
	}

	override dispose(): void {
		if (this.element) {
			this.element.remove();
			this.element = undefined;
		}
		this._context = undefined;
		super.dispose();
	}
}

export interface IActionViewItemOptions extends IBaseActionViewItemOptions {
	icon?: boolean;
	label?: boolean;
	readonly keybinding?: string | null;
	readonly keybindingNotRenderedWithLabel?: boolean;
	readonly toggleStyles?: IToggleStyles;
}

export class ActionViewItem extends BaseActionViewItem {

	protected label: HTMLElement | undefined;
	protected override readonly options: IActionViewItemOptions;

	private cssClass?: string;

	constructor(context: unknown, action: IAction, options: IActionViewItemOptions) {
		options = {
			...options,
			icon: options.icon !== undefined ? options.icon : false,
			label: options.label !== undefined ? options.label : true,
		};
		super(context, action, options);

		this.options = options;
		this.cssClass = '';
	}

	override render(container: HTMLElement): void {
		super.render(container);
		types.assertType(this.element);

		const label = document.createElement('a');
		label.classList.add('action-label');
		label.setAttribute('role', this.getDefaultAriaRole());

		this.label = label;
		this.element.appendChild(label);

		if (this.options.label && this.options.keybinding && !this.options.keybindingNotRenderedWithLabel) {
			const kbLabel = document.createElement('span');
			kbLabel.classList.add('keybinding');
			kbLabel.textContent = this.options.keybinding;
			this.element.appendChild(kbLabel);
		}

		this.updateClass();
		this.updateLabel();
		this.updateTooltip();
		this.updateEnabled();
		this.updateChecked();
	}

	private getDefaultAriaRole(): 'presentation' | 'menuitem' | 'tab' | 'button' {
		if (this._action.id === Separator.ID) {
			return 'presentation'; // A separator is a presentation item
		} else {
			if (this.options.isMenu) {
				return 'menuitem';
			} else if (this.options.isTabList) {
				return 'tab';
			} else {
				return 'button';
			}
		}
	}

	// Only set the tabIndex on the element once it is about to get focused
	// That way this element wont be a tab stop when it is not needed #106441
	override focus(): void {
		if (this.label) {
			this.label.tabIndex = 0;
			this.label.focus();
		}
	}

	override isFocused(): boolean {
		return !!this.label && this.label?.tabIndex === 0;
	}

	override blur(): void {
		if (this.label) {
			this.label.tabIndex = -1;
		}
	}

	override setFocusable(focusable: boolean): void {
		if (this.label) {
			this.label.tabIndex = focusable ? 0 : -1;
		}
	}

	protected override updateLabel(): void {
		if (this.options.label && this.label) {
			this.label.textContent = this.action.label;
		}
	}

	protected override getTooltip() {
		let title: string | null = null;

		if (this.action.tooltip) {
			title = this.action.tooltip;

		} else if (this.action.label) {
			title = this.action.label;
			if (this.options.keybinding) {
				title = nls.localize({ key: 'titleLabel', comment: ['action title', 'action keybinding'] }, "{0} ({1})", title, this.options.keybinding);
			}
		}
		return title ?? undefined;
	}

	protected override updateClass(): void {
		if (this.cssClass && this.label) {
			this.label.classList.remove(...this.cssClass.split(' '));
		}
		if (this.options.icon) {
			this.cssClass = this.getClass();

			if (this.label) {
				this.label.classList.add('codicon');
				if (this.cssClass) {
					this.label.classList.add(...this.cssClass.split(' '));
				}
			}

			this.updateEnabled();
		} else {
			this.label?.classList.remove('codicon');
		}
	}

	protected override updateEnabled(): void {
		if (this.action.enabled) {
			if (this.label) {
				this.label.removeAttribute('aria-disabled');
				this.label.classList.remove('disabled');
			}

			this.element?.classList.remove('disabled');
		} else {
			if (this.label) {
				this.label.setAttribute('aria-disabled', 'true');
				this.label.classList.add('disabled');
			}

			this.element?.classList.add('disabled');
		}
	}

	protected override updateAriaLabel(): void {
		if (this.label) {
			const title = this.getTooltip() ?? '';
			this.label.setAttribute('aria-label', title);
		}
	}

	protected override updateChecked(): void {
		if (this.label) {
			if (this.action.checked !== undefined) {
				this.label.classList.toggle('checked', this.action.checked);
				if (this.options.isTabList) {
					this.label.setAttribute('aria-selected', this.action.checked ? 'true' : 'false');
				} else {
					this.label.setAttribute('aria-checked', this.action.checked ? 'true' : 'false');
					this.label.setAttribute('role', 'checkbox');
				}
			} else {
				this.label.classList.remove('checked');
				this.label.removeAttribute(this.options.isTabList ? 'aria-selected' : 'aria-checked');
				this.label.setAttribute('role', this.getDefaultAriaRole());
			}
		}
	}
}

export class SelectActionViewItem<T = string> extends BaseActionViewItem {
	protected selectBox: SelectBox;

	constructor(ctx: unknown, action: IAction, options: ISelectOptionItem[], selected: number, contextViewProvider: IContextViewProvider, styles: ISelectBoxStyles, selectBoxOptions?: ISelectBoxOptions) {
		super(ctx, action);

		this.selectBox = new SelectBox(options, selected, contextViewProvider, styles, selectBoxOptions);
		this.selectBox.setFocusable(false);

		this._register(this.selectBox);
		this.registerListeners();
	}

	setOptions(options: ISelectOptionItem[], selected?: number): void {
		this.selectBox.setOptions(options, selected);
	}

	select(index: number): void {
		this.selectBox.select(index);
	}

	private registerListeners(): void {
		this._register(this.selectBox.onDidSelect(e => this.runAction(e.selected, e.index)));
	}

	protected runAction(option: string, index: number): void {
		this.actionRunner.run(this._action, this.getActionContext(option, index));
	}

	protected getActionContext(option: string, index: number): T | string {
		return option;
	}

	override setFocusable(focusable: boolean): void {
		this.selectBox.setFocusable(focusable);
	}

	override focus(): void {
		this.selectBox?.focus();
	}

	override blur(): void {
		this.selectBox?.blur();
	}

	override render(container: HTMLElement): void {
		this.selectBox.render(container);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/aria/aria.css]---
Location: vscode-main/src/vs/base/browser/ui/aria/aria.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-aria-container {
	position: absolute; /* try to hide from window but not from screen readers */
	left:-999em;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/aria/aria.ts]---
Location: vscode-main/src/vs/base/browser/ui/aria/aria.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import './aria.css';

// Use a max length since we are inserting the whole msg in the DOM and that can cause browsers to freeze for long messages #94233
const MAX_MESSAGE_LENGTH = 20000;
let ariaContainer: HTMLElement;
let alertContainer: HTMLElement;
let alertContainer2: HTMLElement;
let statusContainer: HTMLElement;
let statusContainer2: HTMLElement;
export function setARIAContainer(parent: HTMLElement) {
	ariaContainer = document.createElement('div');
	ariaContainer.className = 'monaco-aria-container';

	const createAlertContainer = () => {
		const element = document.createElement('div');
		element.className = 'monaco-alert';
		element.setAttribute('role', 'alert');
		element.setAttribute('aria-atomic', 'true');
		ariaContainer.appendChild(element);
		return element;
	};
	alertContainer = createAlertContainer();
	alertContainer2 = createAlertContainer();

	const createStatusContainer = () => {
		const element = document.createElement('div');
		element.className = 'monaco-status';
		element.setAttribute('aria-live', 'polite');
		element.setAttribute('aria-atomic', 'true');
		ariaContainer.appendChild(element);
		return element;
	};
	statusContainer = createStatusContainer();
	statusContainer2 = createStatusContainer();

	parent.appendChild(ariaContainer);
}
/**
 * Given the provided message, will make sure that it is read as alert to screen readers.
 */
export function alert(msg: string): void {
	if (!ariaContainer) {
		return;
	}

	// Use alternate containers such that duplicated messages get read out by screen readers #99466
	if (alertContainer.textContent !== msg) {
		dom.clearNode(alertContainer2);
		insertMessage(alertContainer, msg);
	} else {
		dom.clearNode(alertContainer);
		insertMessage(alertContainer2, msg);
	}
}

/**
 * Given the provided message, will make sure that it is read as status to screen readers.
 */
export function status(msg: string): void {
	if (!ariaContainer) {
		return;
	}

	if (statusContainer.textContent !== msg) {
		dom.clearNode(statusContainer2);
		insertMessage(statusContainer, msg);
	} else {
		dom.clearNode(statusContainer);
		insertMessage(statusContainer2, msg);
	}
}

function insertMessage(target: HTMLElement, msg: string): void {
	dom.clearNode(target);
	if (msg.length > MAX_MESSAGE_LENGTH) {
		msg = msg.substr(0, MAX_MESSAGE_LENGTH);
	}
	target.textContent = msg;

	// See https://www.paciellogroup.com/blog/2012/06/html5-accessibility-chops-aria-rolealert-browser-support/
	target.style.visibility = 'hidden';
	target.style.visibility = 'visible';
}

// Copied from @types/react which original came from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
export type AriaRole =
	| 'alert'
	| 'alertdialog'
	| 'application'
	| 'article'
	| 'banner'
	| 'button'
	| 'cell'
	| 'checkbox'
	| 'columnheader'
	| 'combobox'
	| 'complementary'
	| 'contentinfo'
	| 'definition'
	| 'dialog'
	| 'directory'
	| 'document'
	| 'feed'
	| 'figure'
	| 'form'
	| 'grid'
	| 'gridcell'
	| 'group'
	| 'heading'
	| 'img'
	| 'link'
	| 'list'
	| 'listbox'
	| 'listitem'
	| 'log'
	| 'main'
	| 'marquee'
	| 'math'
	| 'menu'
	| 'menubar'
	| 'menuitem'
	| 'menuitemcheckbox'
	| 'menuitemradio'
	| 'navigation'
	| 'none'
	| 'note'
	| 'option'
	| 'presentation'
	| 'progressbar'
	| 'radio'
	| 'radiogroup'
	| 'region'
	| 'row'
	| 'rowgroup'
	| 'rowheader'
	| 'scrollbar'
	| 'search'
	| 'searchbox'
	| 'separator'
	| 'slider'
	| 'spinbutton'
	| 'status'
	| 'switch'
	| 'tab'
	| 'table'
	| 'tablist'
	| 'tabpanel'
	| 'term'
	| 'textbox'
	| 'timer'
	| 'toolbar'
	| 'tooltip'
	| 'tree'
	| 'treegrid'
	| 'treeitem'
	| (string & {}) // Prevent type collapsing to `string`
	;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.css]---
Location: vscode-main/src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-breadcrumbs {
	user-select: none;
	-webkit-user-select: none;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: flex-start;
	outline-style: none;
}

.monaco-breadcrumbs .monaco-breadcrumb-item {
	display: flex;
	align-items: center;
	flex: 0 1 auto;
	white-space: nowrap;
	cursor: pointer;
	align-self: center;
	height: 100%;
	outline: none;
}
.monaco-breadcrumbs.disabled .monaco-breadcrumb-item {
	cursor: default;
}

.monaco-breadcrumbs .monaco-breadcrumb-item .codicon-breadcrumb-separator {
	color: inherit;
}

.monaco-breadcrumbs .monaco-breadcrumb-item:first-of-type::before {
	content: ' ';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.ts]---
Location: vscode-main/src/vs/base/browser/ui/breadcrumbs/breadcrumbsWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import * as domStylesheetsJs from '../../domStylesheets.js';
import { IMouseEvent } from '../../mouseEvent.js';
import { DomScrollableElement } from '../scrollbar/scrollableElement.js';
import { commonPrefixLength } from '../../../common/arrays.js';
import { ThemeIcon } from '../../../common/themables.js';
import { Emitter, Event } from '../../../common/event.js';
import { DisposableStore, dispose, IDisposable } from '../../../common/lifecycle.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';
import './breadcrumbsWidget.css';

export abstract class BreadcrumbsItem {
	abstract dispose(): void;
	abstract equals(other: BreadcrumbsItem): boolean;
	abstract render(container: HTMLElement): void;
}

export interface IBreadcrumbsWidgetStyles {
	readonly breadcrumbsBackground: string | undefined;
	readonly breadcrumbsForeground: string | undefined;
	readonly breadcrumbsHoverForeground: string | undefined;
	readonly breadcrumbsFocusForeground: string | undefined;
	readonly breadcrumbsFocusAndSelectionForeground: string | undefined;
}

export interface IBreadcrumbsItemEvent {
	type: 'select' | 'focus';
	item: BreadcrumbsItem;
	node: HTMLElement;
	payload: unknown;
}

export class BreadcrumbsWidget {

	private readonly _disposables = new DisposableStore();
	private readonly _domNode: HTMLDivElement;
	private readonly _scrollable: DomScrollableElement;

	private readonly _onDidSelectItem = new Emitter<IBreadcrumbsItemEvent>();
	private readonly _onDidFocusItem = new Emitter<IBreadcrumbsItemEvent>();
	private readonly _onDidChangeFocus = new Emitter<boolean>();

	readonly onDidSelectItem: Event<IBreadcrumbsItemEvent> = this._onDidSelectItem.event;
	readonly onDidFocusItem: Event<IBreadcrumbsItemEvent> = this._onDidFocusItem.event;
	readonly onDidChangeFocus: Event<boolean> = this._onDidChangeFocus.event;

	private readonly _items = new Array<BreadcrumbsItem>();
	private readonly _nodes = new Array<HTMLDivElement>();
	private readonly _freeNodes = new Array<HTMLDivElement>();
	private readonly _separatorIcon: ThemeIcon;

	private _enabled: boolean = true;
	private _focusedItemIdx: number = -1;
	private _selectedItemIdx: number = -1;

	private _pendingDimLayout: IDisposable | undefined;
	private _pendingLayout: IDisposable | undefined;
	private _dimension: dom.Dimension | undefined;

	constructor(
		container: HTMLElement,
		horizontalScrollbarSize: number,
		horizontalScrollbarVisibility: ScrollbarVisibility = ScrollbarVisibility.Auto,
		separatorIcon: ThemeIcon,
		styles: IBreadcrumbsWidgetStyles
	) {
		this._domNode = document.createElement('div');
		this._domNode.className = 'monaco-breadcrumbs';
		this._domNode.tabIndex = 0;
		this._domNode.setAttribute('role', 'list');
		this._scrollable = new DomScrollableElement(this._domNode, {
			vertical: ScrollbarVisibility.Hidden,
			horizontal: horizontalScrollbarVisibility,
			horizontalScrollbarSize,
			useShadows: false,
			scrollYToX: true
		});
		this._separatorIcon = separatorIcon;
		this._disposables.add(this._scrollable);
		this._disposables.add(dom.addStandardDisposableListener(this._domNode, 'click', e => this._onClick(e)));
		container.appendChild(this._scrollable.getDomNode());

		const styleElement = domStylesheetsJs.createStyleSheet(this._domNode);
		this._style(styleElement, styles);

		const focusTracker = dom.trackFocus(this._domNode);
		this._disposables.add(focusTracker);
		this._disposables.add(focusTracker.onDidBlur(_ => this._onDidChangeFocus.fire(false)));
		this._disposables.add(focusTracker.onDidFocus(_ => this._onDidChangeFocus.fire(true)));
	}

	setHorizontalScrollbarSize(size: number) {
		this._scrollable.updateOptions({
			horizontalScrollbarSize: size
		});
	}

	setHorizontalScrollbarVisibility(visibility: ScrollbarVisibility) {
		this._scrollable.updateOptions({
			horizontal: visibility
		});
	}

	dispose(): void {
		this._disposables.dispose();
		this._pendingLayout?.dispose();
		this._pendingDimLayout?.dispose();
		this._onDidSelectItem.dispose();
		this._onDidFocusItem.dispose();
		this._onDidChangeFocus.dispose();
		this._domNode.remove();
		this._nodes.length = 0;
		this._freeNodes.length = 0;
	}

	layout(dim: dom.Dimension | undefined): void {
		if (dim && dom.Dimension.equals(dim, this._dimension)) {
			return;
		}
		if (dim) {
			// only measure
			this._pendingDimLayout?.dispose();
			this._pendingDimLayout = this._updateDimensions(dim);
		} else {
			this._pendingLayout?.dispose();
			this._pendingLayout = this._updateScrollbar();
		}
	}

	private _updateDimensions(dim: dom.Dimension): IDisposable {
		const disposables = new DisposableStore();
		disposables.add(dom.modify(dom.getWindow(this._domNode), () => {
			this._dimension = dim;
			this._domNode.style.width = `${dim.width}px`;
			this._domNode.style.height = `${dim.height}px`;
			disposables.add(this._updateScrollbar());
		}));
		return disposables;
	}

	private _updateScrollbar(): IDisposable {
		return dom.measure(dom.getWindow(this._domNode), () => {
			dom.measure(dom.getWindow(this._domNode), () => { // double RAF
				this._scrollable.setRevealOnScroll(false);
				this._scrollable.scanDomNode();
				this._scrollable.setRevealOnScroll(true);
			});
		});
	}

	private _style(styleElement: HTMLStyleElement, style: IBreadcrumbsWidgetStyles): void {
		let content = '';
		if (style.breadcrumbsBackground) {
			content += `.monaco-breadcrumbs { background-color: ${style.breadcrumbsBackground}}`;
		}
		if (style.breadcrumbsForeground) {
			content += `.monaco-breadcrumbs .monaco-breadcrumb-item { color: ${style.breadcrumbsForeground}}\n`;
		}
		if (style.breadcrumbsFocusForeground) {
			content += `.monaco-breadcrumbs .monaco-breadcrumb-item.focused { color: ${style.breadcrumbsFocusForeground}}\n`;
		}
		if (style.breadcrumbsFocusAndSelectionForeground) {
			content += `.monaco-breadcrumbs .monaco-breadcrumb-item.focused.selected { color: ${style.breadcrumbsFocusAndSelectionForeground}}\n`;
		}
		if (style.breadcrumbsHoverForeground) {
			content += `.monaco-breadcrumbs:not(.disabled	) .monaco-breadcrumb-item:hover:not(.focused):not(.selected) { color: ${style.breadcrumbsHoverForeground}}\n`;
		}
		styleElement.textContent = content;
	}

	setEnabled(value: boolean) {
		this._enabled = value;
		this._domNode.classList.toggle('disabled', !this._enabled);
	}

	domFocus(): void {
		const idx = this._focusedItemIdx >= 0 ? this._focusedItemIdx : this._items.length - 1;
		if (idx >= 0 && idx < this._items.length) {
			this._focus(idx, undefined);
		} else {
			this._domNode.focus();
		}
	}

	isDOMFocused(): boolean {
		return dom.isAncestorOfActiveElement(this._domNode);
	}

	getFocused(): BreadcrumbsItem {
		return this._items[this._focusedItemIdx];
	}

	setFocused(item: BreadcrumbsItem | undefined, payload?: any): void {
		this._focus(this._items.indexOf(item!), payload);
	}

	focusPrev(payload?: any): void {
		if (this._focusedItemIdx > 0) {
			this._focus(this._focusedItemIdx - 1, payload);
		}
	}

	focusNext(payload?: any): void {
		if (this._focusedItemIdx + 1 < this._nodes.length) {
			this._focus(this._focusedItemIdx + 1, payload);
		}
	}

	private _focus(nth: number, payload: any): void {
		this._focusedItemIdx = -1;
		for (let i = 0; i < this._nodes.length; i++) {
			const node = this._nodes[i];
			if (i !== nth) {
				node.classList.remove('focused');
			} else {
				this._focusedItemIdx = i;
				node.classList.add('focused');
				node.focus();
			}
		}
		this._reveal(this._focusedItemIdx, true);
		this._onDidFocusItem.fire({ type: 'focus', item: this._items[this._focusedItemIdx], node: this._nodes[this._focusedItemIdx], payload });
	}

	reveal(item: BreadcrumbsItem): void {
		const idx = this._items.indexOf(item);
		if (idx >= 0) {
			this._reveal(idx, false);
		}
	}

	revealLast(): void {
		this._reveal(this._items.length - 1, false);
	}

	private _reveal(nth: number, minimal: boolean): void {
		if (nth < 0 || nth >= this._nodes.length) {
			return;
		}
		const node = this._nodes[nth];
		if (!node) {
			return;
		}
		const { width } = this._scrollable.getScrollDimensions();
		const { scrollLeft } = this._scrollable.getScrollPosition();
		if (!minimal || node.offsetLeft > scrollLeft + width || node.offsetLeft < scrollLeft) {
			this._scrollable.setRevealOnScroll(false);
			this._scrollable.setScrollPosition({ scrollLeft: node.offsetLeft });
			this._scrollable.setRevealOnScroll(true);
		}
	}

	getSelection(): BreadcrumbsItem {
		return this._items[this._selectedItemIdx];
	}

	setSelection(item: BreadcrumbsItem | undefined, payload?: any): void {
		this._select(this._items.indexOf(item!), payload);
	}

	private _select(nth: number, payload: any): void {
		this._selectedItemIdx = -1;
		for (let i = 0; i < this._nodes.length; i++) {
			const node = this._nodes[i];
			if (i !== nth) {
				node.classList.remove('selected');
			} else {
				this._selectedItemIdx = i;
				node.classList.add('selected');
			}
		}
		this._onDidSelectItem.fire({ type: 'select', item: this._items[this._selectedItemIdx], node: this._nodes[this._selectedItemIdx], payload });
	}

	getItems(): readonly BreadcrumbsItem[] {
		return this._items;
	}

	setItems(items: BreadcrumbsItem[]): void {
		let prefix: number | undefined;
		let removed: BreadcrumbsItem[] = [];
		try {
			prefix = commonPrefixLength(this._items, items, (a, b) => a.equals(b));
			removed = this._items.splice(prefix, this._items.length - prefix, ...items.slice(prefix));
			this._render(prefix);
			dispose(removed);
			dispose(items.slice(0, prefix));
			this._focus(-1, undefined);
		} catch (e) {
			const newError = new Error(`BreadcrumbsItem#setItems: newItems: ${items.length}, prefix: ${prefix}, removed: ${removed.length}`);
			newError.name = e.name;
			newError.stack = e.stack;
			throw newError;
		}
	}

	private _render(start: number): void {
		let didChange = false;
		for (; start < this._items.length && start < this._nodes.length; start++) {
			const item = this._items[start];
			const node = this._nodes[start];
			this._renderItem(item, node);
			didChange = true;
		}
		// case a: more nodes -> remove them
		while (start < this._nodes.length) {
			const free = this._nodes.pop();
			if (free) {
				this._freeNodes.push(free);
				free.remove();
				didChange = true;
			}
		}

		// case b: more items -> render them
		for (; start < this._items.length; start++) {
			const item = this._items[start];
			const node = this._freeNodes.length > 0 ? this._freeNodes.pop() : document.createElement('div');
			if (node) {
				this._renderItem(item, node);
				this._domNode.appendChild(node);
				this._nodes.push(node);
				didChange = true;
			}
		}
		if (didChange) {
			this.layout(undefined);
		}
	}

	private _renderItem(item: BreadcrumbsItem, container: HTMLDivElement): void {
		dom.clearNode(container);
		container.className = '';
		try {
			item.render(container);
		} catch (err) {
			container.textContent = '<<RENDER ERROR>>';
			console.error(err);
		}
		container.tabIndex = -1;
		container.setAttribute('role', 'listitem');
		container.classList.add('monaco-breadcrumb-item');
		const iconContainer = dom.$(ThemeIcon.asCSSSelector(this._separatorIcon));
		container.appendChild(iconContainer);
	}

	private _onClick(event: IMouseEvent): void {
		if (!this._enabled) {
			return;
		}
		for (let el: HTMLElement | null = event.target; el; el = el.parentElement) {
			const idx = this._nodes.indexOf(el as HTMLDivElement);
			if (idx >= 0) {
				this._focus(idx, event);
				this._select(idx, event);
				break;
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/button/button.css]---
Location: vscode-main/src/vs/base/browser/ui/button/button.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-text-button {
	box-sizing: border-box;
	display: flex;
	width: 100%;
	padding: 4px;
	border-radius: 2px;
	text-align: center;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	border: 1px solid var(--vscode-button-border, transparent);
	line-height: 18px;
}

.monaco-text-button:focus {
	outline-offset: 2px !important;
}

.monaco-text-button:hover {
	text-decoration: none !important;
}

.monaco-button.disabled:focus,
.monaco-button.disabled {
	opacity: 0.4 !important;
	cursor: default;
}

.monaco-text-button .codicon {
	margin: 0 0.2em;
	color: inherit !important;
}

.monaco-text-button.monaco-text-button-with-short-label {
	flex-direction: row;
	flex-wrap: wrap;
	padding: 0 4px;
	overflow: hidden;
	height: 28px;
}

.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label {
	flex-basis: 100%;
}

.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label-short {
	flex-grow: 1;
	width: 0;
	overflow: hidden;
}

.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label,
.monaco-text-button.monaco-text-button-with-short-label > .monaco-button-label-short {
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: normal;
	font-style: inherit;
	padding: 4px 0;
}

.monaco-button-dropdown {
	display: flex;
	cursor: pointer;
}

.monaco-button-dropdown.disabled {
	cursor: default;
}

.monaco-button-dropdown > .monaco-button:focus {
	outline-offset: -1px !important;
}

.monaco-button-dropdown.disabled > .monaco-button.disabled,
.monaco-button-dropdown.disabled > .monaco-button.disabled:focus,
.monaco-button-dropdown.disabled > .monaco-button-dropdown-separator {
	opacity: 0.4 !important;
}

.monaco-button-dropdown > .monaco-button.monaco-text-button {
	border-right-width: 0 !important;
}

.monaco-button-dropdown .monaco-button-dropdown-separator {
	padding: 4px 0;
	cursor: default;
}

.monaco-button-dropdown .monaco-button-dropdown-separator > div {
	height: 100%;
	width: 1px;
}

.monaco-button-dropdown > .monaco-button.monaco-dropdown-button {
	border: 1px solid var(--vscode-button-border, transparent);
	border-left-width: 0 !important;
	border-radius: 0 2px 2px 0;
	display: flex;
	align-items: center;
}

.monaco-button-dropdown > .monaco-button.monaco-text-button {
	border-radius: 2px 0 0 2px;
}

.monaco-description-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 4px 5px; /* allows button focus outline to be visible */
}

.monaco-description-button .monaco-button-description {
	font-style: italic;
	font-size: 11px;
	padding: 4px 20px;
}

.monaco-description-button .monaco-button-label,
.monaco-description-button .monaco-button-description {
	display: flex;
	justify-content: center;
	align-items: center;
}

.monaco-description-button .monaco-button-label > .codicon,
.monaco-description-button .monaco-button-description > .codicon {
	margin: 0 0.2em;
	color: inherit !important;
}

/* default color styles - based on CSS variables */

.monaco-button.default-colors,
.monaco-button-dropdown.default-colors > .monaco-button{
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
}

.monaco-button.default-colors:hover,
.monaco-button-dropdown.default-colors > .monaco-button:hover {
	background-color: var(--vscode-button-hoverBackground);
}

.monaco-button.default-colors.secondary,
.monaco-button-dropdown.default-colors > .monaco-button.secondary {
	color: var(--vscode-button-secondaryForeground);
	background-color: var(--vscode-button-secondaryBackground);
}

.monaco-button.default-colors.secondary:hover,
.monaco-button-dropdown.default-colors > .monaco-button.secondary:hover {
	background-color: var(--vscode-button-secondaryHoverBackground);
}

.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator {
	background-color: var(--vscode-button-background);
	border-top: 1px solid var(--vscode-button-border);
	border-bottom: 1px solid var(--vscode-button-border);
}

.monaco-button-dropdown.default-colors .monaco-button.secondary + .monaco-button-dropdown-separator {
	background-color: var(--vscode-button-secondaryBackground);
}

.monaco-button-dropdown.default-colors .monaco-button-dropdown-separator > div {
	background-color: var(--vscode-button-separator);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/button/button.ts]---
Location: vscode-main/src/vs/base/browser/ui/button/button.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuProvider } from '../../contextmenu.js';
import { addDisposableListener, EventHelper, EventType, IFocusTracker, isActiveElement, reset, trackFocus, $ } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { renderMarkdown, renderAsPlaintext } from '../../markdownRenderer.js';
import { Gesture, EventType as TouchEventType } from '../../touch.js';
import { createInstantHoverDelegate, getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { renderLabelWithIcons } from '../iconLabel/iconLabels.js';
import { IAction, IActionRunner, toAction } from '../../../common/actions.js';
import { Codicon } from '../../../common/codicons.js';
import { Color } from '../../../common/color.js';
import { Event as BaseEvent, Emitter } from '../../../common/event.js';
import { IMarkdownString, isMarkdownString, markdownStringEqual } from '../../../common/htmlContent.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../common/lifecycle.js';
import { ThemeIcon } from '../../../common/themables.js';
import './button.css';
import { localize } from '../../../../nls.js';
import type { IManagedHover } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { IActionProvider } from '../dropdown/dropdown.js';
import { safeSetInnerHtml, DomSanitizerConfig } from '../../domSanitize.js';

export interface IButtonOptions extends Partial<IButtonStyles> {
	readonly title?: boolean | string;
	/**
	 * Will fallback to `title` if not set.
	 */
	readonly ariaLabel?: string;
	readonly supportIcons?: boolean;
	readonly supportShortLabel?: boolean;
	readonly secondary?: boolean;
	readonly hoverDelegate?: IHoverDelegate;
	readonly disabled?: boolean;
}

export interface IButtonStyles {
	readonly buttonBackground: string | undefined;
	readonly buttonHoverBackground: string | undefined;
	readonly buttonForeground: string | undefined;
	readonly buttonSeparator: string | undefined;
	readonly buttonSecondaryBackground: string | undefined;
	readonly buttonSecondaryHoverBackground: string | undefined;
	readonly buttonSecondaryForeground: string | undefined;
	readonly buttonBorder: string | undefined;
}

export const unthemedButtonStyles: IButtonStyles = {
	buttonBackground: '#0E639C',
	buttonHoverBackground: '#006BB3',
	buttonSeparator: Color.white.toString(),
	buttonForeground: Color.white.toString(),
	buttonBorder: undefined,
	buttonSecondaryBackground: undefined,
	buttonSecondaryForeground: undefined,
	buttonSecondaryHoverBackground: undefined
};

export interface IButton extends IDisposable {
	readonly element: HTMLElement;
	readonly onDidClick: BaseEvent<Event | undefined>;

	set label(value: string | IMarkdownString);
	set icon(value: ThemeIcon);
	set enabled(value: boolean);
	set checked(value: boolean);

	focus(): void;
	hasFocus(): boolean;
}

export interface IButtonWithDescription extends IButton {
	description: string;
}

// Only allow a very limited set of inline html tags
const buttonSanitizerConfig = Object.freeze<DomSanitizerConfig>({
	allowedTags: {
		override: ['b', 'i', 'u', 'code', 'span'],
	},
	allowedAttributes: {
		override: ['class'],
	},
});

export class Button extends Disposable implements IButton {

	protected options: IButtonOptions;
	protected _element: HTMLElement;
	protected _label: string | IMarkdownString = '';
	protected _labelElement: HTMLElement | undefined;
	protected _labelShortElement: HTMLElement | undefined;
	private _hover: IManagedHover | undefined;

	private _onDidClick = this._register(new Emitter<Event>());
	get onDidClick(): BaseEvent<Event> { return this._onDidClick.event; }

	private _onDidEscape = this._register(new Emitter<Event>());
	get onDidEscape(): BaseEvent<Event> { return this._onDidEscape.event; }

	private focusTracker: IFocusTracker;

	constructor(container: HTMLElement, options: IButtonOptions) {
		super();

		this.options = options;

		this._element = document.createElement('a');
		this._element.classList.add('monaco-button');
		this._element.tabIndex = 0;
		this._element.setAttribute('role', 'button');

		this._element.classList.toggle('secondary', !!options.secondary);
		const background = options.secondary ? options.buttonSecondaryBackground : options.buttonBackground;
		const foreground = options.secondary ? options.buttonSecondaryForeground : options.buttonForeground;

		this._element.style.color = foreground || '';
		this._element.style.backgroundColor = background || '';

		if (options.supportShortLabel) {
			this._labelShortElement = document.createElement('div');
			this._labelShortElement.classList.add('monaco-button-label-short');
			this._element.appendChild(this._labelShortElement);

			this._labelElement = document.createElement('div');
			this._labelElement.classList.add('monaco-button-label');
			this._element.appendChild(this._labelElement);

			this._element.classList.add('monaco-text-button-with-short-label');
		}

		if (typeof options.title === 'string') {
			this.setTitle(options.title);
		}

		if (typeof options.ariaLabel === 'string') {
			this._element.setAttribute('aria-label', options.ariaLabel);
		}
		container.appendChild(this._element);
		this.enabled = !options.disabled;

		this._register(Gesture.addTarget(this._element));

		[EventType.CLICK, TouchEventType.Tap].forEach(eventType => {
			this._register(addDisposableListener(this._element, eventType, e => {
				if (!this.enabled) {
					EventHelper.stop(e);
					return;
				}

				this._onDidClick.fire(e);
			}));
		});

		this._register(addDisposableListener(this._element, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			let eventHandled = false;
			if (this.enabled && (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space))) {
				this._onDidClick.fire(e);
				eventHandled = true;
			} else if (event.equals(KeyCode.Escape)) {
				this._onDidEscape.fire(e);
				this._element.blur();
				eventHandled = true;
			}

			if (eventHandled) {
				EventHelper.stop(event, true);
			}
		}));

		this._register(addDisposableListener(this._element, EventType.MOUSE_OVER, e => {
			if (!this._element.classList.contains('disabled')) {
				this.updateStyles(true);
			}
		}));

		this._register(addDisposableListener(this._element, EventType.MOUSE_OUT, e => {
			this.updateStyles(false); // restore standard styles
		}));

		// Also set hover background when button is focused for feedback
		this.focusTracker = this._register(trackFocus(this._element));
		this._register(this.focusTracker.onDidFocus(() => { if (this.enabled) { this.updateStyles(true); } }));
		this._register(this.focusTracker.onDidBlur(() => { if (this.enabled) { this.updateStyles(false); } }));
	}

	public override dispose(): void {
		super.dispose();
		this._element.remove();
	}

	protected getContentElements(content: string): HTMLElement[] {
		const elements: HTMLSpanElement[] = [];
		for (let segment of renderLabelWithIcons(content)) {
			if (typeof (segment) === 'string') {
				segment = segment.trim();

				// Ignore empty segment
				if (segment === '') {
					continue;
				}

				// Convert string segments to <span> nodes
				const node = document.createElement('span');
				node.textContent = segment;
				elements.push(node);
			} else {
				elements.push(segment);
			}
		}

		return elements;
	}

	private updateStyles(hover: boolean): void {
		let background;
		let foreground;
		if (this.options.secondary) {
			background = hover ? this.options.buttonSecondaryHoverBackground : this.options.buttonSecondaryBackground;
			foreground = this.options.buttonSecondaryForeground;
		} else {
			background = hover ? this.options.buttonHoverBackground : this.options.buttonBackground;
			foreground = this.options.buttonForeground;
		}

		this._element.style.backgroundColor = background || '';
		this._element.style.color = foreground || '';
	}

	get element(): HTMLElement {
		return this._element;
	}

	set label(value: string | IMarkdownString) {
		if (this._label === value) {
			return;
		}

		if (isMarkdownString(this._label) && isMarkdownString(value) && markdownStringEqual(this._label, value)) {
			return;
		}

		this._element.classList.add('monaco-text-button');
		const labelElement = this.options.supportShortLabel ? this._labelElement! : this._element;

		if (isMarkdownString(value)) {
			const rendered = renderMarkdown(value, undefined, document.createElement('span'));
			rendered.dispose();

			// Don't include outer `<p>`
			// eslint-disable-next-line no-restricted-syntax
			const root = rendered.element.querySelector('p')?.innerHTML;
			if (root) {
				safeSetInnerHtml(labelElement, root, buttonSanitizerConfig);
			} else {
				reset(labelElement);
			}
		} else {
			if (this.options.supportIcons) {
				reset(labelElement, ...this.getContentElements(value));
			} else {
				labelElement.textContent = value;
			}
		}

		let title: string = '';
		if (typeof this.options.title === 'string') {
			title = this.options.title;
		} else if (this.options.title) {
			title = renderAsPlaintext(value);
		}

		this.setTitle(title);

		this._setAriaLabel();

		this._label = value;
	}

	get label(): string | IMarkdownString {
		return this._label;
	}

	set labelShort(value: string) {
		if (!this.options.supportShortLabel || !this._labelShortElement) {
			return;
		}

		if (this.options.supportIcons) {
			reset(this._labelShortElement, ...this.getContentElements(value));
		} else {
			this._labelShortElement.textContent = value;
		}
	}

	protected _setAriaLabel(): void {
		if (typeof this.options.ariaLabel === 'string') {
			this._element.setAttribute('aria-label', this.options.ariaLabel);
		} else if (typeof this.options.title === 'string') {
			this._element.setAttribute('aria-label', this.options.title);
		}
	}

	set icon(icon: ThemeIcon) {
		this._setAriaLabel();

		const oldIcons = Array.from(this._element.classList).filter(item => item.startsWith('codicon-'));
		this._element.classList.remove(...oldIcons);
		this._element.classList.add(...ThemeIcon.asClassNameArray(icon));
	}

	set enabled(value: boolean) {
		if (value) {
			this._element.classList.remove('disabled');
			this._element.setAttribute('aria-disabled', String(false));
			this._element.tabIndex = 0;
		} else {
			this._element.classList.add('disabled');
			this._element.setAttribute('aria-disabled', String(true));
		}
	}

	get enabled() {
		return !this._element.classList.contains('disabled');
	}

	set secondary(value: boolean) {
		this._element.classList.toggle('secondary', value);
		(this.options as { secondary?: boolean }).secondary = value;
		this.updateStyles(false);
	}

	set checked(value: boolean) {
		if (value) {
			this._element.classList.add('checked');
			this._element.setAttribute('aria-checked', 'true');
		} else {
			this._element.classList.remove('checked');
			this._element.setAttribute('aria-checked', 'false');
		}
	}

	get checked() {
		return this._element.classList.contains('checked');
	}

	setTitle(title: string) {
		if (!this._hover && title !== '') {
			this._hover = this._register(getBaseLayerHoverDelegate().setupManagedHover(this.options.hoverDelegate ?? getDefaultHoverDelegate('element'), this._element, title));
		} else if (this._hover) {
			this._hover.update(title);
		}
	}

	focus(): void {
		this._element.focus();
	}

	hasFocus(): boolean {
		return isActiveElement(this._element);
	}
}

export interface IButtonWithDropdownOptions extends IButtonOptions {
	readonly contextMenuProvider: IContextMenuProvider;
	readonly actions: readonly IAction[] | IActionProvider;
	readonly actionRunner?: IActionRunner;
	readonly addPrimaryActionToDropdown?: boolean;
	/**
	 * dropdown menus with higher layers are rendered higher in z-index order
	 */
	readonly dropdownLayer?: number;
}

export class ButtonWithDropdown extends Disposable implements IButton {

	readonly primaryButton: Button;
	private readonly action: IAction;
	readonly dropdownButton: Button;
	private readonly separatorContainer: HTMLDivElement;
	private readonly separator: HTMLDivElement;

	readonly element: HTMLElement;
	private readonly _onDidClick = this._register(new Emitter<Event | undefined>());
	readonly onDidClick = this._onDidClick.event;

	constructor(container: HTMLElement, options: IButtonWithDropdownOptions) {
		super();

		this.element = document.createElement('div');
		this.element.classList.add('monaco-button-dropdown');
		container.appendChild(this.element);

		if (!options.hoverDelegate) {
			options = { ...options, hoverDelegate: this._register(createInstantHoverDelegate()) };
		}

		this.primaryButton = this._register(new Button(this.element, options));
		this._register(this.primaryButton.onDidClick(e => this._onDidClick.fire(e)));
		this.action = toAction({ id: 'primaryAction', label: renderAsPlaintext(this.primaryButton.label), run: async () => this._onDidClick.fire(undefined) });

		this.separatorContainer = document.createElement('div');
		this.separatorContainer.classList.add('monaco-button-dropdown-separator');

		this.separator = document.createElement('div');
		this.separatorContainer.appendChild(this.separator);
		this.element.appendChild(this.separatorContainer);

		// Separator styles
		const border = options.buttonBorder;
		if (border) {
			this.separatorContainer.style.borderTop = '1px solid ' + border;
			this.separatorContainer.style.borderBottom = '1px solid ' + border;
		}

		const buttonBackground = options.secondary ? options.buttonSecondaryBackground : options.buttonBackground;
		this.separatorContainer.style.backgroundColor = buttonBackground ?? '';
		this.separator.style.backgroundColor = options.buttonSeparator ?? '';

		this.dropdownButton = this._register(new Button(this.element, { ...options, title: localize("button dropdown more actions", 'More Actions...'), supportIcons: true }));
		this.dropdownButton.element.setAttribute('aria-haspopup', 'true');
		this.dropdownButton.element.setAttribute('aria-expanded', 'false');
		this.dropdownButton.element.classList.add('monaco-dropdown-button');
		this.dropdownButton.icon = Codicon.dropDownButton;
		this._register(this.dropdownButton.onDidClick(e => {
			const actions = Array.isArray(options.actions) ? options.actions : (options.actions as IActionProvider).getActions();
			options.contextMenuProvider.showContextMenu({
				getAnchor: () => this.dropdownButton.element,
				getActions: () => options.addPrimaryActionToDropdown === false ? [...actions] : [this.action, ...actions],
				actionRunner: options.actionRunner,
				onHide: () => this.dropdownButton.element.setAttribute('aria-expanded', 'false'),
				layer: options.dropdownLayer
			});
			this.dropdownButton.element.setAttribute('aria-expanded', 'true');
		}));
	}

	override dispose() {
		super.dispose();
		this.element.remove();
	}

	set label(value: string) {
		this.primaryButton.label = value;
		this.action.label = value;
	}

	set icon(icon: ThemeIcon) {
		this.primaryButton.icon = icon;
	}

	set enabled(enabled: boolean) {
		this.primaryButton.enabled = enabled;
		this.dropdownButton.enabled = enabled;

		this.element.classList.toggle('disabled', !enabled);
	}

	get enabled(): boolean {
		return this.primaryButton.enabled;
	}

	set checked(value: boolean) {
		this.primaryButton.checked = value;
	}

	get checked() {
		return this.primaryButton.checked;
	}

	focus(): void {
		this.primaryButton.focus();
	}

	hasFocus(): boolean {
		return this.primaryButton.hasFocus() || this.dropdownButton.hasFocus();
	}
}

export class ButtonWithDescription implements IButtonWithDescription {

	private _button: Button;
	private _element: HTMLElement;
	private _descriptionElement: HTMLElement;

	constructor(container: HTMLElement, private readonly options: IButtonOptions) {
		this._element = document.createElement('div');
		this._element.classList.add('monaco-description-button');
		this._button = new Button(this._element, options);

		this._descriptionElement = document.createElement('div');
		this._descriptionElement.classList.add('monaco-button-description');
		this._element.appendChild(this._descriptionElement);

		container.appendChild(this._element);
	}

	get onDidClick(): BaseEvent<Event | undefined> {
		return this._button.onDidClick;
	}

	get element(): HTMLElement {
		return this._element;
	}

	set label(value: string) {
		this._button.label = value;
	}

	set icon(icon: ThemeIcon) {
		this._button.icon = icon;
	}

	get enabled(): boolean {
		return this._button.enabled;
	}

	set enabled(enabled: boolean) {
		this._button.enabled = enabled;
	}

	set checked(value: boolean) {
		this._button.checked = value;
	}

	get checked(): boolean {
		return this._button.checked;
	}

	focus(): void {
		this._button.focus();
	}
	hasFocus(): boolean {
		return this._button.hasFocus();
	}
	dispose(): void {
		this._button.dispose();
	}

	set description(value: string) {
		if (this.options.supportIcons) {
			reset(this._descriptionElement, ...renderLabelWithIcons(value));
		} else {
			this._descriptionElement.textContent = value;
		}
	}
}

export enum ButtonBarAlignment {
	Horizontal = 0,
	Vertical
}

export class ButtonBar {

	private readonly _buttons: IButton[] = [];
	private readonly _buttonStore = new DisposableStore();

	constructor(private readonly container: HTMLElement, private readonly options?: { alignment?: ButtonBarAlignment }) { }

	dispose(): void {
		this._buttonStore.dispose();
	}

	get buttons(): IButton[] {
		return this._buttons;
	}

	clear(): void {
		this._buttonStore.clear();
		this._buttons.length = 0;
	}

	addButton(options: IButtonOptions): IButton {
		const button = this._buttonStore.add(new Button(this.container, options));
		this.pushButton(button);
		return button;
	}

	addButtonWithDescription(options: IButtonOptions): IButtonWithDescription {
		const button = this._buttonStore.add(new ButtonWithDescription(this.container, options));
		this.pushButton(button);
		return button;
	}

	addButtonWithDropdown(options: IButtonWithDropdownOptions): IButton {
		const button = this._buttonStore.add(new ButtonWithDropdown(this.container, options));
		this.pushButton(button);
		return button;
	}

	private pushButton(button: IButton): void {
		this._buttons.push(button);

		const index = this._buttons.length - 1;
		this._buttonStore.add(addDisposableListener(button.element, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			let eventHandled = true;

			// Next / Previous Button
			let buttonIndexToFocus: number | undefined;
			if (event.equals(this.options?.alignment === ButtonBarAlignment.Vertical ? KeyCode.UpArrow : KeyCode.LeftArrow)) {
				buttonIndexToFocus = index > 0 ? index - 1 : this._buttons.length - 1;
			} else if (event.equals(this.options?.alignment === ButtonBarAlignment.Vertical ? KeyCode.DownArrow : KeyCode.RightArrow)) {
				buttonIndexToFocus = index === this._buttons.length - 1 ? 0 : index + 1;
			} else {
				eventHandled = false;
			}

			if (eventHandled && typeof buttonIndexToFocus === 'number') {
				this._buttons[buttonIndexToFocus].focus();
				EventHelper.stop(e, true);
			}

		}));
	}
}

/**
 * This is a Button that supports an icon to the left, and markdown to the right, with proper separation and wrapping the markdown label, which Button doesn't do.
 */
export class ButtonWithIcon extends Button {
	private readonly _iconElement: HTMLElement;
	private readonly _mdlabelElement: HTMLElement;

	public get labelElement() { return this._mdlabelElement; }

	constructor(container: HTMLElement, options: IButtonOptions) {
		super(container, options);

		if (options.supportShortLabel) {
			throw new Error('ButtonWithIcon does not support short labels');
		}

		this._element.classList.add('monaco-icon-button');
		this._iconElement = $('');
		this._mdlabelElement = $('.monaco-button-mdlabel');
		this._element.append(this._iconElement, this._mdlabelElement);
	}

	override get label(): IMarkdownString | string {
		return super.label;
	}

	override set label(value: IMarkdownString | string) {
		if (this._label === value) {
			return;
		}

		if (isMarkdownString(this._label) && isMarkdownString(value) && markdownStringEqual(this._label, value)) {
			return;
		}

		this._element.classList.add('monaco-text-button');
		if (isMarkdownString(value)) {
			const rendered = renderMarkdown(value, undefined, document.createElement('span'));
			rendered.dispose();

			// eslint-disable-next-line no-restricted-syntax
			const root = rendered.element.querySelector('p')?.innerHTML;
			if (root) {
				safeSetInnerHtml(this._mdlabelElement, root, buttonSanitizerConfig);
			} else {
				reset(this._mdlabelElement);
			}
		} else {
			if (this.options.supportIcons) {
				reset(this._mdlabelElement, ...this.getContentElements(value));
			} else {
				this._mdlabelElement.textContent = value;
			}
		}

		let title: string = '';
		if (typeof this.options.title === 'string') {
			title = this.options.title;
		} else if (this.options.title) {
			title = renderAsPlaintext(value);
		}

		this.setTitle(title);
		this._setAriaLabel();
		this._label = value;
	}

	override get icon(): ThemeIcon {
		return super.icon;
	}

	override set icon(icon: ThemeIcon) {
		this._iconElement.classList.value = '';
		this._iconElement.classList.add(...ThemeIcon.asClassNameArray(icon));
		this._setAriaLabel();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/centered/centeredViewLayout.ts]---
Location: vscode-main/src/vs/base/browser/ui/centered/centeredViewLayout.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, IDomNodePagePosition } from '../../dom.js';
import { IView, IViewSize } from '../grid/grid.js';
import { IBoundarySashes } from '../sash/sash.js';
import { DistributeSizing, ISplitViewStyles, IView as ISplitViewView, Orientation, SplitView } from '../splitview/splitview.js';
import { Color } from '../../../common/color.js';
import { Event } from '../../../common/event.js';
import { DisposableStore, IDisposable } from '../../../common/lifecycle.js';

export interface CenteredViewState {
	// width of the fixed centered layout
	targetWidth: number;
	// proportional size of left margin
	leftMarginRatio: number;
	// proportional size of right margin
	rightMarginRatio: number;
}

const defaultState: CenteredViewState = {
	targetWidth: 900,
	leftMarginRatio: 0.1909,
	rightMarginRatio: 0.1909,
};

const distributeSizing: DistributeSizing = { type: 'distribute' };

function createEmptyView(background: Color | undefined): ISplitViewView<{ top: number; left: number }> {
	const element = $('.centered-layout-margin');
	element.style.height = '100%';
	if (background) {
		element.style.backgroundColor = background.toString();
	}

	return {
		element,
		layout: () => undefined,
		minimumSize: 60,
		maximumSize: Number.POSITIVE_INFINITY,
		onDidChange: Event.None
	};
}

function toSplitViewView(view: IView, getHeight: () => number): ISplitViewView<{ top: number; left: number }> {
	return {
		element: view.element,
		get maximumSize() { return view.maximumWidth; },
		get minimumSize() { return view.minimumWidth; },
		onDidChange: Event.map(view.onDidChange, e => e && e.width),
		layout: (size, offset, ctx) => view.layout(size, getHeight(), ctx?.top ?? 0, (ctx?.left ?? 0) + offset)
	};
}

export interface ICenteredViewStyles extends ISplitViewStyles {
	background: Color;
}

export class CenteredViewLayout implements IDisposable {

	private splitView?: SplitView<{ top: number; left: number }>;
	private lastLayoutPosition: IDomNodePagePosition = { width: 0, height: 0, left: 0, top: 0 };
	private style!: ICenteredViewStyles;
	private didLayout = false;
	private emptyViews: ISplitViewView<{ top: number; left: number }>[] | undefined;
	private readonly splitViewDisposables = new DisposableStore();

	constructor(
		private container: HTMLElement,
		private view: IView,
		public state: CenteredViewState = { ...defaultState },
		private centeredLayoutFixedWidth: boolean = false
	) {
		this.container.appendChild(this.view.element);
		// Make sure to hide the split view overflow like sashes #52892
		this.container.style.overflow = 'hidden';
	}

	get minimumWidth(): number { return this.splitView ? this.splitView.minimumSize : this.view.minimumWidth; }
	get maximumWidth(): number { return this.splitView ? this.splitView.maximumSize : this.view.maximumWidth; }
	get minimumHeight(): number { return this.view.minimumHeight; }
	get maximumHeight(): number { return this.view.maximumHeight; }
	get onDidChange(): Event<IViewSize | undefined> { return this.view.onDidChange; }

	private _boundarySashes: IBoundarySashes = {};
	get boundarySashes(): IBoundarySashes { return this._boundarySashes; }
	set boundarySashes(boundarySashes: IBoundarySashes) {
		this._boundarySashes = boundarySashes;

		if (!this.splitView) {
			return;
		}

		this.splitView.orthogonalStartSash = boundarySashes.top;
		this.splitView.orthogonalEndSash = boundarySashes.bottom;
	}

	layout(width: number, height: number, top: number, left: number): void {
		this.lastLayoutPosition = { width, height, top, left };
		if (this.splitView) {
			this.splitView.layout(width, this.lastLayoutPosition);
			if (!this.didLayout || this.centeredLayoutFixedWidth) {
				this.resizeSplitViews();
			}
		} else {
			this.view.layout(width, height, top, left);
		}

		this.didLayout = true;
	}

	private resizeSplitViews(): void {
		if (!this.splitView) {
			return;
		}
		if (this.centeredLayoutFixedWidth) {
			const centerViewWidth = Math.min(this.lastLayoutPosition.width, this.state.targetWidth);
			const marginWidthFloat = (this.lastLayoutPosition.width - centerViewWidth) / 2;
			this.splitView.resizeView(0, Math.floor(marginWidthFloat));
			this.splitView.resizeView(1, centerViewWidth);
			this.splitView.resizeView(2, Math.ceil(marginWidthFloat));
		} else {
			const leftMargin = this.state.leftMarginRatio * this.lastLayoutPosition.width;
			const rightMargin = this.state.rightMarginRatio * this.lastLayoutPosition.width;
			const center = this.lastLayoutPosition.width - leftMargin - rightMargin;
			this.splitView.resizeView(0, leftMargin);
			this.splitView.resizeView(1, center);
			this.splitView.resizeView(2, rightMargin);
		}
	}

	setFixedWidth(option: boolean) {
		this.centeredLayoutFixedWidth = option;
		if (!!this.splitView) {
			this.updateState();
			this.resizeSplitViews();
		}
	}

	private updateState() {
		if (!!this.splitView) {
			this.state.targetWidth = this.splitView.getViewSize(1);
			this.state.leftMarginRatio = this.splitView.getViewSize(0) / this.lastLayoutPosition.width;
			this.state.rightMarginRatio = this.splitView.getViewSize(2) / this.lastLayoutPosition.width;
		}
	}

	isActive(): boolean {
		return !!this.splitView;
	}

	styles(style: ICenteredViewStyles): void {
		this.style = style;
		if (this.splitView && this.emptyViews) {
			this.splitView.style(this.style);
			this.emptyViews[0].element.style.backgroundColor = this.style.background.toString();
			this.emptyViews[1].element.style.backgroundColor = this.style.background.toString();
		}
	}

	activate(active: boolean): void {
		if (active === this.isActive()) {
			return;
		}

		if (active) {
			this.view.element.remove();
			this.splitView = new SplitView(this.container, {
				inverseAltBehavior: true,
				orientation: Orientation.HORIZONTAL,
				styles: this.style
			});
			this.splitView.orthogonalStartSash = this.boundarySashes.top;
			this.splitView.orthogonalEndSash = this.boundarySashes.bottom;

			this.splitViewDisposables.add(this.splitView.onDidSashChange(() => {
				if (!!this.splitView) {
					this.updateState();
				}
			}));
			this.splitViewDisposables.add(this.splitView.onDidSashReset(() => {
				this.state = { ...defaultState };
				this.resizeSplitViews();
			}));

			this.splitView.layout(this.lastLayoutPosition.width, this.lastLayoutPosition);
			const backgroundColor = this.style ? this.style.background : undefined;
			this.emptyViews = [createEmptyView(backgroundColor), createEmptyView(backgroundColor)];

			this.splitView.addView(this.emptyViews[0], distributeSizing, 0);
			this.splitView.addView(toSplitViewView(this.view, () => this.lastLayoutPosition.height), distributeSizing, 1);
			this.splitView.addView(this.emptyViews[1], distributeSizing, 2);

			this.resizeSplitViews();
		} else {
			this.splitView?.el.remove();
			this.splitViewDisposables.clear();
			this.splitView?.dispose();
			this.splitView = undefined;
			this.emptyViews = undefined;
			this.container.appendChild(this.view.element);
			this.view.layout(this.lastLayoutPosition.width, this.lastLayoutPosition.height, this.lastLayoutPosition.top, this.lastLayoutPosition.left);
		}
	}

	isDefault(state: CenteredViewState): boolean {
		if (this.centeredLayoutFixedWidth) {
			return state.targetWidth === defaultState.targetWidth;
		} else {
			return state.leftMarginRatio === defaultState.leftMarginRatio
				&& state.rightMarginRatio === defaultState.rightMarginRatio;
		}
	}

	dispose(): void {
		this.splitViewDisposables.dispose();

		if (this.splitView) {
			this.splitView.dispose();
			this.splitView = undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/codicons/codiconStyles.ts]---
Location: vscode-main/src/vs/base/browser/ui/codicons/codiconStyles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './codicon/codicon.css';
import './codicon/codicon-modifiers.css';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/codicons/codicon/codicon-modifiers.css]---
Location: vscode-main/src/vs/base/browser/ui/codicons/codicon/codicon-modifiers.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.codicon-wrench-subaction {
	opacity: 0.5;
}

@keyframes codicon-spin {
	100% {
		transform:rotate(360deg);
	}
}

.codicon-sync.codicon-modifier-spin,
.codicon-loading.codicon-modifier-spin,
.codicon-gear.codicon-modifier-spin,
.codicon-notebook-state-executing.codicon-modifier-spin,
.codicon-loading,
.codicon-tree-item-loading::before {
	/* Use steps to throttle FPS to reduce CPU usage */
	animation: codicon-spin 1.5s steps(30) infinite;
}

.codicon-modifier-disabled {
	opacity: 0.4;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/codicons/codicon/codicon.css]---
Location: vscode-main/src/vs/base/browser/ui/codicons/codicon/codicon.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

@font-face {
	font-family: "codicon";
	font-display: block;
	src: url("./codicon.ttf?5d4d76ab2ce5108968ad644d591a16a6") format("truetype");
}

.codicon[class*='codicon-'] {
	font: normal normal normal 16px/1 codicon;
	display: inline-block;
	text-decoration: none;
	text-rendering: auto;
	text-align: center;
	text-transform: none;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	user-select: none;
	-webkit-user-select: none;
}

/* icon rules are dynamically created by the platform theme service (see iconsStyleSheet.ts) */
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/contextview/contextview.css]---
Location: vscode-main/src/vs/base/browser/ui/contextview/contextview.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.context-view {
	position: absolute;
}

.context-view.fixed {
	all: initial;
	font-family: inherit;
	font-size: 13px;
	position: fixed;
	color: inherit;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/contextview/contextview.ts]---
Location: vscode-main/src/vs/base/browser/ui/contextview/contextview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserFeatures } from '../../canIUse.js';
import * as DOM from '../../dom.js';
import { StandardMouseEvent } from '../../mouseEvent.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../common/lifecycle.js';
import * as platform from '../../../common/platform.js';
import { Range } from '../../../common/range.js';
import { OmitOptional } from '../../../common/types.js';
import './contextview.css';

export const enum ContextViewDOMPosition {
	ABSOLUTE = 1,
	FIXED,
	FIXED_SHADOW
}

export interface IAnchor {
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export function isAnchor(obj: unknown): obj is IAnchor | OmitOptional<IAnchor> {
	const anchor = obj as IAnchor | OmitOptional<IAnchor> | undefined;

	return !!anchor && typeof anchor.x === 'number' && typeof anchor.y === 'number';
}

export const enum AnchorAlignment {
	LEFT, RIGHT
}

export const enum AnchorPosition {
	BELOW, ABOVE
}

export const enum AnchorAxisAlignment {
	VERTICAL, HORIZONTAL
}

export interface IDelegate {
	/**
	 * The anchor where to position the context view.
	 * Use a `HTMLElement` to position the view at the element,
	 * a `StandardMouseEvent` to position it at the mouse position
	 * or an `IAnchor` to position it at a specific location.
	 */
	getAnchor(): HTMLElement | StandardMouseEvent | IAnchor;
	render(container: HTMLElement): IDisposable | null;
	focus?(): void;
	layout?(): void;
	anchorAlignment?: AnchorAlignment; // default: left
	anchorPosition?: AnchorPosition; // default: below
	anchorAxisAlignment?: AnchorAxisAlignment; // default: vertical
	canRelayout?: boolean; // default: true
	onDOMEvent?(e: Event, activeElement: HTMLElement): void;
	onHide?(data?: unknown): void;

	/**
	 * context views with higher layers are rendered higher in z-index order
	 */
	layer?: number; // Default: 0
}

export interface IContextViewProvider {
	showContextView(delegate: IDelegate, container?: HTMLElement): void;
	hideContextView(): void;
	layout(): void;
}

export interface IPosition {
	top: number;
	left: number;
}

export interface ISize {
	width: number;
	height: number;
}

export interface IView extends IPosition, ISize { }

export const enum LayoutAnchorPosition {
	Before,
	After
}

export enum LayoutAnchorMode {
	AVOID,
	ALIGN
}

export interface ILayoutAnchor {
	offset: number;
	size: number;
	mode?: LayoutAnchorMode; // default: AVOID
	position: LayoutAnchorPosition;
}

/**
 * Lays out a one dimensional view next to an anchor in a viewport.
 *
 * @returns The view offset within the viewport.
 */
export function layout(viewportSize: number, viewSize: number, anchor: ILayoutAnchor): number {
	const layoutAfterAnchorBoundary = anchor.mode === LayoutAnchorMode.ALIGN ? anchor.offset : anchor.offset + anchor.size;
	const layoutBeforeAnchorBoundary = anchor.mode === LayoutAnchorMode.ALIGN ? anchor.offset + anchor.size : anchor.offset;

	if (anchor.position === LayoutAnchorPosition.Before) {
		if (viewSize <= viewportSize - layoutAfterAnchorBoundary) {
			return layoutAfterAnchorBoundary; // happy case, lay it out after the anchor
		}

		if (viewSize <= layoutBeforeAnchorBoundary) {
			return layoutBeforeAnchorBoundary - viewSize; // ok case, lay it out before the anchor
		}

		return Math.max(viewportSize - viewSize, 0); // sad case, lay it over the anchor
	} else {
		if (viewSize <= layoutBeforeAnchorBoundary) {
			return layoutBeforeAnchorBoundary - viewSize; // happy case, lay it out before the anchor
		}

		if (viewSize <= viewportSize - layoutAfterAnchorBoundary) {
			return layoutAfterAnchorBoundary; // ok case, lay it out after the anchor
		}

		return 0; // sad case, lay it over the anchor
	}
}

export class ContextView extends Disposable {

	private static readonly BUBBLE_UP_EVENTS = ['click', 'keydown', 'focus', 'blur'];
	private static readonly BUBBLE_DOWN_EVENTS = ['click'];

	private container: HTMLElement | null = null;
	private view: HTMLElement;
	private useFixedPosition = false;
	private useShadowDOM = false;
	private delegate: IDelegate | null = null;
	private toDisposeOnClean: IDisposable = Disposable.None;
	private toDisposeOnSetContainer: IDisposable = Disposable.None;
	private shadowRoot: ShadowRoot | null = null;
	private shadowRootHostElement: HTMLElement | null = null;

	constructor(container: HTMLElement, domPosition: ContextViewDOMPosition) {
		super();

		this.view = DOM.$('.context-view');
		DOM.hide(this.view);

		this.setContainer(container, domPosition);
		this._register(toDisposable(() => this.setContainer(null, ContextViewDOMPosition.ABSOLUTE)));
	}

	setContainer(container: HTMLElement | null, domPosition: ContextViewDOMPosition): void {
		this.useFixedPosition = domPosition !== ContextViewDOMPosition.ABSOLUTE;
		const usedShadowDOM = this.useShadowDOM;
		this.useShadowDOM = domPosition === ContextViewDOMPosition.FIXED_SHADOW;

		if (container === this.container && usedShadowDOM === this.useShadowDOM) {
			return; // container is the same and no shadow DOM usage has changed
		}

		if (this.container) {
			this.toDisposeOnSetContainer.dispose();

			this.view.remove();
			if (this.shadowRoot) {
				this.shadowRoot = null;
				this.shadowRootHostElement?.remove();
				this.shadowRootHostElement = null;
			}

			this.container = null;
		}

		if (container) {
			this.container = container;

			if (this.useShadowDOM) {
				this.shadowRootHostElement = DOM.$('.shadow-root-host');
				this.container.appendChild(this.shadowRootHostElement);
				this.shadowRoot = this.shadowRootHostElement.attachShadow({ mode: 'open' });
				const style = document.createElement('style');
				style.textContent = SHADOW_ROOT_CSS;
				this.shadowRoot.appendChild(style);
				this.shadowRoot.appendChild(this.view);
				this.shadowRoot.appendChild(DOM.$('slot'));
			} else {
				this.container.appendChild(this.view);
			}

			const toDisposeOnSetContainer = new DisposableStore();

			ContextView.BUBBLE_UP_EVENTS.forEach(event => {
				toDisposeOnSetContainer.add(DOM.addStandardDisposableListener(this.container!, event, e => {
					this.onDOMEvent(e, false);
				}));
			});

			ContextView.BUBBLE_DOWN_EVENTS.forEach(event => {
				toDisposeOnSetContainer.add(DOM.addStandardDisposableListener(this.container!, event, e => {
					this.onDOMEvent(e, true);
				}, true));
			});

			this.toDisposeOnSetContainer = toDisposeOnSetContainer;
		}
	}

	show(delegate: IDelegate): void {
		if (this.isVisible()) {
			this.hide();
		}

		// Show static box
		DOM.clearNode(this.view);
		this.view.className = 'context-view monaco-component';
		this.view.style.top = '0px';
		this.view.style.left = '0px';
		this.view.style.zIndex = `${2575 + (delegate.layer ?? 0)}`;
		this.view.style.position = this.useFixedPosition ? 'fixed' : 'absolute';
		DOM.show(this.view);

		// Render content
		this.toDisposeOnClean = delegate.render(this.view) || Disposable.None;

		// Set active delegate
		this.delegate = delegate;

		// Layout
		this.doLayout();

		// Focus
		this.delegate.focus?.();
	}

	getViewElement(): HTMLElement {
		return this.view;
	}

	layout(): void {
		if (!this.isVisible()) {
			return;
		}

		if (this.delegate!.canRelayout === false && !(platform.isIOS && BrowserFeatures.pointerEvents)) {
			this.hide();
			return;
		}

		this.delegate?.layout?.();

		this.doLayout();
	}

	private doLayout(): void {
		// Check that we still have a delegate - this.delegate.layout may have hidden
		if (!this.isVisible()) {
			return;
		}

		// Get anchor
		const anchor = this.delegate!.getAnchor();

		// Compute around
		let around: IView;

		// Get the element's position and size (to anchor the view)
		if (DOM.isHTMLElement(anchor)) {
			const elementPosition = DOM.getDomNodePagePosition(anchor);

			// In areas where zoom is applied to the element or its ancestors, we need to adjust the size of the element
			// e.g. The title bar has counter zoom behavior meaning it applies the inverse of zoom level.
			// Window Zoom Level: 1.5, Title Bar Zoom: 1/1.5, Size Multiplier: 1.5
			const zoom = DOM.getDomNodeZoomLevel(anchor);

			around = {
				top: elementPosition.top * zoom,
				left: elementPosition.left * zoom,
				width: elementPosition.width * zoom,
				height: elementPosition.height * zoom
			};
		} else if (isAnchor(anchor)) {
			around = {
				top: anchor.y,
				left: anchor.x,
				width: anchor.width || 1,
				height: anchor.height || 2
			};
		} else {
			around = {
				top: anchor.posy,
				left: anchor.posx,
				// We are about to position the context view where the mouse
				// cursor is. To prevent the view being exactly under the mouse
				// when showing and thus potentially triggering an action within,
				// we treat the mouse location like a small sized block element.
				width: 2,
				height: 2
			};
		}

		const viewSizeWidth = DOM.getTotalWidth(this.view);
		const viewSizeHeight = DOM.getTotalHeight(this.view);

		const anchorPosition = this.delegate!.anchorPosition ?? AnchorPosition.BELOW;
		const anchorAlignment = this.delegate!.anchorAlignment ?? AnchorAlignment.LEFT;
		const anchorAxisAlignment = this.delegate!.anchorAxisAlignment ?? AnchorAxisAlignment.VERTICAL;

		let top: number;
		let left: number;

		const activeWindow = DOM.getActiveWindow();
		if (anchorAxisAlignment === AnchorAxisAlignment.VERTICAL) {
			const verticalAnchor: ILayoutAnchor = { offset: around.top - activeWindow.pageYOffset, size: around.height, position: anchorPosition === AnchorPosition.BELOW ? LayoutAnchorPosition.Before : LayoutAnchorPosition.After };
			const horizontalAnchor: ILayoutAnchor = { offset: around.left, size: around.width, position: anchorAlignment === AnchorAlignment.LEFT ? LayoutAnchorPosition.Before : LayoutAnchorPosition.After, mode: LayoutAnchorMode.ALIGN };

			top = layout(activeWindow.innerHeight, viewSizeHeight, verticalAnchor) + activeWindow.pageYOffset;

			// if view intersects vertically with anchor,  we must avoid the anchor
			if (Range.intersects({ start: top, end: top + viewSizeHeight }, { start: verticalAnchor.offset, end: verticalAnchor.offset + verticalAnchor.size })) {
				horizontalAnchor.mode = LayoutAnchorMode.AVOID;
			}

			left = layout(activeWindow.innerWidth, viewSizeWidth, horizontalAnchor);
		} else {
			const horizontalAnchor: ILayoutAnchor = { offset: around.left, size: around.width, position: anchorAlignment === AnchorAlignment.LEFT ? LayoutAnchorPosition.Before : LayoutAnchorPosition.After };
			const verticalAnchor: ILayoutAnchor = { offset: around.top, size: around.height, position: anchorPosition === AnchorPosition.BELOW ? LayoutAnchorPosition.Before : LayoutAnchorPosition.After, mode: LayoutAnchorMode.ALIGN };

			left = layout(activeWindow.innerWidth, viewSizeWidth, horizontalAnchor);

			// if view intersects horizontally with anchor, we must avoid the anchor
			if (Range.intersects({ start: left, end: left + viewSizeWidth }, { start: horizontalAnchor.offset, end: horizontalAnchor.offset + horizontalAnchor.size })) {
				verticalAnchor.mode = LayoutAnchorMode.AVOID;
			}

			top = layout(activeWindow.innerHeight, viewSizeHeight, verticalAnchor) + activeWindow.pageYOffset;
		}

		this.view.classList.remove('top', 'bottom', 'left', 'right');
		this.view.classList.add(anchorPosition === AnchorPosition.BELOW ? 'bottom' : 'top');
		this.view.classList.add(anchorAlignment === AnchorAlignment.LEFT ? 'left' : 'right');
		this.view.classList.toggle('fixed', this.useFixedPosition);

		const containerPosition = DOM.getDomNodePagePosition(this.container!);

		// Account for container scroll when positioning the context view
		const containerScrollTop = this.container!.scrollTop || 0;
		const containerScrollLeft = this.container!.scrollLeft || 0;

		this.view.style.top = `${top - (this.useFixedPosition ? DOM.getDomNodePagePosition(this.view).top : containerPosition.top) + containerScrollTop}px`;
		this.view.style.left = `${left - (this.useFixedPosition ? DOM.getDomNodePagePosition(this.view).left : containerPosition.left) + containerScrollLeft}px`;
		this.view.style.width = 'initial';
	}

	hide(data?: unknown): void {
		const delegate = this.delegate;
		this.delegate = null;

		if (delegate?.onHide) {
			delegate.onHide(data);
		}

		this.toDisposeOnClean.dispose();

		DOM.hide(this.view);
	}

	private isVisible(): boolean {
		return !!this.delegate;
	}

	private onDOMEvent(e: UIEvent, onCapture: boolean): void {
		if (this.delegate) {
			if (this.delegate.onDOMEvent) {
				this.delegate.onDOMEvent(e, <HTMLElement>DOM.getWindow(e).document.activeElement);
			} else if (onCapture && !DOM.isAncestor(<HTMLElement>e.target, this.container)) {
				this.hide();
			}
		}
	}

	override dispose(): void {
		this.hide();

		super.dispose();
	}
}

const SHADOW_ROOT_CSS = /* css */ `
	:host {
		all: initial; /* 1st rule so subsequent properties are reset. */
	}

	.codicon[class*='codicon-'] {
		font: normal normal normal 16px/1 codicon;
		display: inline-block;
		text-decoration: none;
		text-rendering: auto;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	:host {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;
	}

	:host-context(.mac) { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
	:host-context(.mac:lang(zh-Hans)) { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif; }
	:host-context(.mac:lang(zh-Hant)) { font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif; }
	:host-context(.mac:lang(ja)) { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic Pro", sans-serif; }
	:host-context(.mac:lang(ko)) { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Nanum Gothic", "AppleGothic", sans-serif; }

	:host-context(.windows) { font-family: "Segoe WPC", "Segoe UI", sans-serif; }
	:host-context(.windows:lang(zh-Hans)) { font-family: "Segoe WPC", "Segoe UI", "Microsoft YaHei", sans-serif; }
	:host-context(.windows:lang(zh-Hant)) { font-family: "Segoe WPC", "Segoe UI", "Microsoft Jhenghei", sans-serif; }
	:host-context(.windows:lang(ja)) { font-family: "Segoe WPC", "Segoe UI", "Yu Gothic UI", "Meiryo UI", sans-serif; }
	:host-context(.windows:lang(ko)) { font-family: "Segoe WPC", "Segoe UI", "Malgun Gothic", "Dotom", sans-serif; }

	:host-context(.linux) { font-family: system-ui, "Ubuntu", "Droid Sans", sans-serif; }
	:host-context(.linux:lang(zh-Hans)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans SC", "Source Han Sans CN", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(zh-Hant)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans TC", "Source Han Sans TW", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(ja)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans J", "Source Han Sans JP", "Source Han Sans", sans-serif; }
	:host-context(.linux:lang(ko)) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans K", "Source Han Sans JR", "Source Han Sans", "UnDotum", "FBaekmuk Gulim", sans-serif; }
`;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/countBadge/countBadge.css]---
Location: vscode-main/src/vs/base/browser/ui/countBadge/countBadge.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-count-badge {
	padding: 3px 5px;
	border-radius: 11px;
	font-size: 11px;
	min-width: 18px;
	min-height: 18px;
	line-height: 11px;
	font-weight: normal;
	text-align: center;
	display: inline-block;
	box-sizing: border-box;
}

.monaco-count-badge.long {
	padding: 2px 3px;
	border-radius: 2px;
	min-height: auto;
	line-height: normal;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/countBadge/countBadge.ts]---
Location: vscode-main/src/vs/base/browser/ui/countBadge/countBadge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append } from '../../dom.js';
import { format } from '../../../common/strings.js';
import './countBadge.css';
import { Disposable, IDisposable, MutableDisposable, toDisposable } from '../../../common/lifecycle.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';

export interface ICountBadgeOptions {
	readonly count?: number;
	readonly countFormat?: string;
	readonly titleFormat?: string;
}

export interface ICountBadgeStyles {
	readonly badgeBackground: string | undefined;
	readonly badgeForeground: string | undefined;
	readonly badgeBorder: string | undefined;
}

export const unthemedCountStyles: ICountBadgeStyles = {
	badgeBackground: '#4D4D4D',
	badgeForeground: '#FFFFFF',
	badgeBorder: undefined
};

export class CountBadge extends Disposable {

	private element: HTMLElement;
	private count: number = 0;
	private countFormat: string;
	private titleFormat: string;
	private readonly hover = this._register(new MutableDisposable<IDisposable>());

	constructor(container: HTMLElement, private readonly options: ICountBadgeOptions, private readonly styles: ICountBadgeStyles) {

		super();
		this.element = append(container, $('.monaco-count-badge'));
		this._register(toDisposable(() => container.removeChild(this.element)));
		this.countFormat = this.options.countFormat || '{0}';
		this.titleFormat = this.options.titleFormat || '';
		this.setCount(this.options.count || 0);
		this.updateHover();
	}

	setCount(count: number) {
		this.count = count;
		this.render();
	}

	setCountFormat(countFormat: string) {
		this.countFormat = countFormat;
		this.render();
	}

	setTitleFormat(titleFormat: string) {
		this.titleFormat = titleFormat;
		this.updateHover();
		this.render();
	}

	private updateHover(): void {
		if (this.titleFormat !== '' && !this.hover.value) {
			this.hover.value = getBaseLayerHoverDelegate().setupDelayedHoverAtMouse(this.element, () => ({ content: format(this.titleFormat, this.count), appearance: { compact: true } }));
		} else if (this.titleFormat === '' && this.hover.value) {
			this.hover.value = undefined;
		}
	}

	private render() {
		this.element.textContent = format(this.countFormat, this.count);

		this.element.style.backgroundColor = this.styles.badgeBackground ?? '';
		this.element.style.color = this.styles.badgeForeground ?? '';

		if (this.styles.badgeBorder) {
			this.element.style.border = `1px solid ${this.styles.badgeBorder}`;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dialog/dialog.css]---
Location: vscode-main/src/vs/base/browser/ui/dialog/dialog.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/** Dialog: Modal Block */
.monaco-dialog-modal-block {
	position: fixed;
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	z-index: 2575; /* Above Context Views, Below Workbench Hover */
	display: flex;
	justify-content: center;
	align-items: center;
}

.monaco-dialog-modal-block.dimmed {
	background: rgba(0, 0, 0, 0.3);
}

/** Dialog: Container */
.monaco-dialog-box {
	display: flex;
	flex-direction: column-reverse;
	width: min-content;
	min-width: 500px;
	max-width: 90vw;
	min-height: 75px;
	padding: 10px;
	transform: translate3d(0px, 0px, 0px);
	border-radius: 3px;
}

.monaco-dialog-box.align-vertical {
	min-width: 350px; /* more narrow when aligned vertically */
}

/** Dialog: Title Actions Row */
.monaco-dialog-box .dialog-toolbar-row {
	height: 22px;
	padding-bottom: 4px;
}

.monaco-dialog-box .dialog-toolbar-row .actions-container {
	justify-content: flex-end;
}

/** Dialog: Message/Footer Row */
.monaco-dialog-box .dialog-message-row,
.monaco-dialog-box .dialog-footer-row {
	display: flex;
	flex-grow: 1;
	align-items: center;
	padding: 0 10px;
}

.monaco-dialog-box.align-vertical .dialog-message-row {
	flex-direction: column;
}

.monaco-dialog-box .dialog-message-row > .dialog-icon.codicon {
	flex: 0 0 48px;
	height: 48px;
	font-size: 48px;
}

.monaco-dialog-box.align-vertical .dialog-message-row > .dialog-icon.codicon {
	flex: 0 0 64px;
	height: 64px;
	font-size: 64px;
}

.monaco-dialog-box:not(.align-vertical) .dialog-message-row > .dialog-icon.codicon {
	align-self: baseline;
}

/** Dialog: Message/Footer Container */
.monaco-dialog-box .dialog-message-row .dialog-message-container,
.monaco-dialog-box .dialog-footer-row {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	text-overflow: ellipsis;
	user-select: text;
	-webkit-user-select: text;
	word-wrap: break-word; /* never overflow long words, but break to next line */
	white-space: normal;
}

.monaco-dialog-box .dialog-footer-row {
	margin-top: 20px;
}

.monaco-dialog-box:not(.align-vertical) .dialog-message-row .dialog-message-container,
.monaco-dialog-box:not(.align-vertical) .dialog-footer-row {
	padding-left: 24px;
}

.monaco-dialog-box.align-vertical .dialog-message-row .dialog-message-container,
.monaco-dialog-box.align-vertical .dialog-footer-row {
	align-items: center;
	text-align: center;
}

.monaco-dialog-box .dialog-message-row .dialog-message-container ul,
.monaco-dialog-box .dialog-footer-row ul {
	padding-inline-start: 20px; /* reduce excessive indent of list items in the dialog */
}

/** Dialog: Message */
.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-message {
	line-height: 22px;
	font-size: 18px;
	flex: 1; /* let the message always grow */
	white-space: normal;
	word-wrap: break-word; /* never overflow long words, but break to next line */
	min-height: 48px; /* matches icon height */
	margin-bottom: 8px;
	display: flex;
	align-items: center;
}

/** Dialog: Details */
.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-message-detail {
	line-height: 22px;
	flex: 1; /* let the message always grow */
}

.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-message a:focus {
	outline-width: 1px;
	outline-style: solid;
}

/** Dialog: Checkbox */
.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-checkbox-row {
	padding: 15px 0px 0px;
	display: flex;
}

.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-checkbox-row .dialog-checkbox-message {
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
	flex: 1;
}

/** Dialog: Input */
.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-message-input {
	padding: 15px 0px 0px;
	display: flex;
}

.monaco-dialog-box .dialog-message-row .dialog-message-container .dialog-message-input .monaco-inputbox {
	flex: 1;
}

/** Dialog: File Path */
.monaco-dialog-box code {
	font-family: var(--monaco-monospace-font);
}

/** Dialog: Buttons Row */
.monaco-dialog-box > .dialog-buttons-row {
	display: flex;
	align-items: center;
	padding-right: 1px;
	overflow: hidden; /* buttons row should never overflow */
}

.monaco-dialog-box > .dialog-buttons-row {
	display: flex;
	white-space: nowrap;
	padding: 20px 10px 10px;
}

/** Dialog: Buttons */
.monaco-dialog-box > .dialog-buttons-row > .dialog-buttons {
	display: flex;
	width: 100%;
}

.monaco-dialog-box:not(.align-vertical) > .dialog-buttons-row > .dialog-buttons {
	overflow: hidden;
	justify-content: flex-end;
	margin-left: 67px; /* for long buttons, force align with text */
}

.monaco-dialog-box.align-vertical > .dialog-buttons-row > .dialog-buttons {
	margin-left: 5px;
	margin-right: 5px;
	flex-direction: column;
}

.monaco-dialog-box > .dialog-buttons-row > .dialog-buttons > .monaco-button {
	padding: 4px 10px;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 4px 5px; /* allows button focus outline to be visible */
	outline-offset: 2px !important;
}

.monaco-dialog-box.align-vertical > .dialog-buttons-row > .dialog-buttons > .monaco-button {
	margin: 4px 0; /* allows button focus outline to be visible */
}

.monaco-dialog-box:not(.align-vertical) > .dialog-buttons-row > .dialog-buttons > .monaco-button {
	width: fit-content;
}

/** Dialog: Dropdown */
.monaco-dialog-box:not(.align-vertical) > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown {
	margin: 4px 5px;
}

.monaco-dialog-box.align-vertical > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown {
	width: 100%;
}

.monaco-dialog-box > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown:focus-within {
	/**
	 * This is a trick to make the focus outline appear on the entire
	 * container of the dropdown button to ensure the dialog box looks
	 * consistent to dialogs without dropdown buttons.
	 */
	outline-offset: 2px !important;
	outline-width: 1px;
	outline-style: solid;
	outline-color: var(--vscode-focusBorder);
	border-radius: 2px;
}

.monaco-dialog-box > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown > .monaco-text-button {
	padding-left: 10px;
	padding-right: 10px;
}

.monaco-dialog-box.align-vertical > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown > .monaco-text-button {
	width: 100%;
}

.monaco-dialog-box > .dialog-buttons-row > .dialog-buttons > .monaco-button-dropdown > .monaco-dropdown-button {
	padding-left: 5px;
	padding-right: 5px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dialog/dialog.ts]---
Location: vscode-main/src/vs/base/browser/ui/dialog/dialog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './dialog.css';
import { localize } from '../../../../nls.js';
import { $, addDisposableListener, addStandardDisposableListener, clearNode, EventHelper, EventType, getWindow, hide, isActiveElement, isAncestor, show } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { ActionBar } from '../actionbar/actionbar.js';
import { ButtonBar, ButtonBarAlignment, ButtonWithDescription, ButtonWithDropdown, IButton, IButtonStyles, IButtonWithDropdownOptions } from '../button/button.js';
import { ICheckboxStyles, Checkbox } from '../toggle/toggle.js';
import { IInputBoxStyles, InputBox } from '../inputbox/inputBox.js';
import { Action, toAction } from '../../../common/actions.js';
import { Codicon } from '../../../common/codicons.js';
import { ThemeIcon } from '../../../common/themables.js';
import { KeyCode, KeyMod } from '../../../common/keyCodes.js';
import { mnemonicButtonLabel } from '../../../common/labels.js';
import { Disposable, toDisposable } from '../../../common/lifecycle.js';
import { isLinux, isMacintosh, isWindows } from '../../../common/platform.js';
import { isActionProvider } from '../dropdown/dropdown.js';

export interface IDialogInputOptions {
	readonly placeholder?: string;
	readonly type?: 'text' | 'password';
	readonly value?: string;
}

export enum DialogContentsAlignment {
	/**
	 * Dialog contents align from left to right (icon, message, buttons on a separate row).
	 *
	 * Note: this is the default alignment for dialogs.
	 */
	Horizontal = 0,

	/**
	 * Dialog contents align from top to bottom (icon, message, buttons stack on top of each other)
	 */
	Vertical
}

export interface IDialogOptions {
	readonly cancelId?: number;
	readonly detail?: string;
	readonly alignment?: DialogContentsAlignment;
	readonly checkboxLabel?: string;
	readonly checkboxChecked?: boolean;
	readonly type?: 'none' | 'info' | 'error' | 'question' | 'warning' | 'pending';
	readonly extraClasses?: string[];
	readonly inputs?: IDialogInputOptions[];
	readonly keyEventProcessor?: (event: StandardKeyboardEvent) => void;
	readonly renderBody?: (container: HTMLElement) => void;
	readonly renderFooter?: (container: HTMLElement) => void;
	readonly icon?: ThemeIcon;
	readonly buttonOptions?: Array<undefined | { sublabel?: string; styleButton?: (button: IButton) => void }>;
	readonly primaryButtonDropdown?: IButtonWithDropdownOptions;
	readonly disableCloseAction?: boolean;
	readonly disableCloseButton?: boolean;
	readonly disableDefaultAction?: boolean;
	readonly buttonStyles: IButtonStyles;
	readonly checkboxStyles: ICheckboxStyles;
	readonly inputBoxStyles: IInputBoxStyles;
	readonly dialogStyles: IDialogStyles;
}

export interface IDialogResult {
	readonly button: number;
	readonly checkboxChecked?: boolean;
	readonly values?: string[];
}

export interface IDialogStyles {
	readonly dialogForeground: string | undefined;
	readonly dialogBackground: string | undefined;
	readonly dialogShadow: string | undefined;
	readonly dialogBorder: string | undefined;
	readonly errorIconForeground: string | undefined;
	readonly warningIconForeground: string | undefined;
	readonly infoIconForeground: string | undefined;
	readonly textLinkForeground: string | undefined;
}

interface ButtonMapEntry {
	readonly label: string;
	readonly index: number;
}

export class Dialog extends Disposable {

	private readonly element: HTMLElement;

	private readonly shadowElement: HTMLElement;
	private modalElement: HTMLElement | undefined;
	private readonly buttonsContainer: HTMLElement;
	private readonly messageDetailElement: HTMLElement;
	private readonly messageContainer: HTMLElement;
	private readonly footerContainer: HTMLElement | undefined;
	private readonly iconElement: HTMLElement;
	private readonly checkbox: Checkbox | undefined;
	private readonly toolbarContainer: HTMLElement;
	private buttonBar: ButtonBar | undefined;
	private focusToReturn: HTMLElement | undefined;
	private readonly inputs: InputBox[];
	private readonly buttons: string[];
	private readonly buttonStyles: IButtonStyles;

	constructor(private container: HTMLElement, private message: string, buttons: string[] | undefined, private readonly options: IDialogOptions) {
		super();

		// Modal background blocker
		this.modalElement = this.container.appendChild($(`.monaco-dialog-modal-block.dimmed`));
		this._register(addStandardDisposableListener(this.modalElement, EventType.CLICK, e => {
			if (e.target === this.modalElement) {
				this.element.focus(); // guide users back into the dialog if clicked elsewhere
			}
		}));

		// Dialog Box
		this.shadowElement = this.modalElement.appendChild($('.dialog-shadow'));
		this.element = this.shadowElement.appendChild($('.monaco-dialog-box'));
		if (options.alignment === DialogContentsAlignment.Vertical) {
			this.element.classList.add('align-vertical');
		}
		if (options.extraClasses) {
			this.element.classList.add(...options.extraClasses);
		}
		this.element.setAttribute('role', 'dialog');
		this.element.tabIndex = -1;
		hide(this.element);

		// Footer
		if (this.options.renderFooter) {
			this.footerContainer = this.element.appendChild($('.dialog-footer-row'));

			const customFooter = this.footerContainer.appendChild($('#monaco-dialog-footer.dialog-footer'));
			this.options.renderFooter(customFooter);

			// eslint-disable-next-line no-restricted-syntax
			for (const el of this.footerContainer.querySelectorAll('a')) {
				el.tabIndex = 0;
			}
		}

		// Buttons
		this.buttonStyles = options.buttonStyles;

		if (Array.isArray(buttons) && buttons.length > 0) {
			this.buttons = buttons;
		} else if (!this.options.disableDefaultAction) {
			this.buttons = [localize('ok', "OK")];
		} else {
			this.buttons = [];
		}
		const buttonsRowElement = this.element.appendChild($('.dialog-buttons-row'));
		this.buttonsContainer = buttonsRowElement.appendChild($('.dialog-buttons'));

		// Message
		const messageRowElement = this.element.appendChild($('.dialog-message-row'));
		this.iconElement = messageRowElement.appendChild($('#monaco-dialog-icon.dialog-icon'));
		this.iconElement.setAttribute('aria-label', this.getIconAriaLabel());
		this.messageContainer = messageRowElement.appendChild($('.dialog-message-container'));

		if (this.options.detail || this.options.renderBody) {
			const messageElement = this.messageContainer.appendChild($('.dialog-message'));
			const messageTextElement = messageElement.appendChild($('#monaco-dialog-message-text.dialog-message-text'));
			messageTextElement.innerText = this.message;
		}

		this.messageDetailElement = this.messageContainer.appendChild($('#monaco-dialog-message-detail.dialog-message-detail'));
		if (this.options.detail || !this.options.renderBody) {
			this.messageDetailElement.innerText = this.options.detail ? this.options.detail : message;
		} else {
			this.messageDetailElement.style.display = 'none';
		}

		if (this.options.renderBody) {
			const customBody = this.messageContainer.appendChild($('#monaco-dialog-message-body.dialog-message-body'));
			this.options.renderBody(customBody);

			// eslint-disable-next-line no-restricted-syntax
			for (const el of this.messageContainer.querySelectorAll('a')) {
				el.tabIndex = 0;
			}
		}

		// Inputs
		if (this.options.inputs) {
			this.inputs = this.options.inputs.map(input => {
				const inputRowElement = this.messageContainer.appendChild($('.dialog-message-input'));

				const inputBox = this._register(new InputBox(inputRowElement, undefined, {
					placeholder: input.placeholder,
					type: input.type ?? 'text',
					inputBoxStyles: options.inputBoxStyles
				}));

				if (input.value) {
					inputBox.value = input.value;
				}

				return inputBox;
			});
		} else {
			this.inputs = [];
		}

		// Checkbox
		if (this.options.checkboxLabel) {
			const checkboxRowElement = this.messageContainer.appendChild($('.dialog-checkbox-row'));

			const checkbox = this.checkbox = this._register(
				new Checkbox(this.options.checkboxLabel, !!this.options.checkboxChecked, options.checkboxStyles)
			);

			checkboxRowElement.appendChild(checkbox.domNode);

			const checkboxMessageElement = checkboxRowElement.appendChild($('.dialog-checkbox-message'));
			checkboxMessageElement.innerText = this.options.checkboxLabel;
			this._register(addDisposableListener(checkboxMessageElement, EventType.CLICK, () => checkbox.checked = !checkbox.checked));
		}

		// Toolbar
		const toolbarRowElement = this.element.appendChild($('.dialog-toolbar-row'));
		this.toolbarContainer = toolbarRowElement.appendChild($('.dialog-toolbar'));

		this.applyStyles();
	}

	private getIconAriaLabel(): string {
		let typeLabel = localize('dialogInfoMessage', 'Info');
		switch (this.options.type) {
			case 'error':
				typeLabel = localize('dialogErrorMessage', 'Error');
				break;
			case 'warning':
				typeLabel = localize('dialogWarningMessage', 'Warning');
				break;
			case 'pending':
				typeLabel = localize('dialogPendingMessage', 'In Progress');
				break;
			case 'none':
			case 'info':
			case 'question':
			default:
				break;
		}

		return typeLabel;
	}

	updateMessage(message: string): void {
		this.messageDetailElement.innerText = message;
	}

	async show(): Promise<IDialogResult> {
		this.focusToReturn = this.container.ownerDocument.activeElement as HTMLElement;

		return new Promise<IDialogResult>(resolve => {
			clearNode(this.buttonsContainer);

			const close = () => {
				resolve({
					button: this.options.cancelId || 0,
					checkboxChecked: this.checkbox ? this.checkbox.checked : undefined
				});
				return;
			};
			this._register(toDisposable(close));

			const buttonBar = this.buttonBar = this._register(new ButtonBar(this.buttonsContainer, { alignment: this.options?.alignment === DialogContentsAlignment.Vertical ? ButtonBarAlignment.Vertical : ButtonBarAlignment.Horizontal }));
			const buttonMap = this.rearrangeButtons(this.buttons, this.options.cancelId);

			const onButtonClick = (index: number) => {
				resolve({
					button: buttonMap[index].index,
					checkboxChecked: this.checkbox ? this.checkbox.checked : undefined,
					values: this.inputs.length > 0 ? this.inputs.map(input => input.value) : undefined
				});
			};

			// Buttons
			buttonMap.forEach((_, index) => {
				const primary = buttonMap[index].index === 0;

				let button: IButton;
				const buttonOptions = this.options.buttonOptions?.[buttonMap[index]?.index];
				if (primary && this.options?.primaryButtonDropdown) {
					const actions = isActionProvider(this.options.primaryButtonDropdown.actions) ? this.options.primaryButtonDropdown.actions.getActions() : this.options.primaryButtonDropdown.actions;
					button = this._register(buttonBar.addButtonWithDropdown({
						...this.options.primaryButtonDropdown,
						...this.buttonStyles,
						dropdownLayer: 2600, // ensure the dropdown is above the dialog
						actions: actions.map(action => toAction({
							...action,
							run: async () => {
								await action.run();

								onButtonClick(index);
							}
						}))
					}));
				} else if (buttonOptions?.sublabel) {
					button = this._register(buttonBar.addButtonWithDescription({ secondary: !primary, ...this.buttonStyles }));
				} else {
					button = this._register(buttonBar.addButton({ secondary: !primary, ...this.buttonStyles }));
				}

				if (buttonOptions?.styleButton) {
					buttonOptions.styleButton(button);
				}

				button.label = mnemonicButtonLabel(buttonMap[index].label, true);
				if (button instanceof ButtonWithDescription) {
					if (buttonOptions?.sublabel) {
						button.description = buttonOptions?.sublabel;
					}
				}
				this._register(button.onDidClick(e => {
					if (e) {
						EventHelper.stop(e);
					}

					onButtonClick(index);
				}));
			});

			// Handle keyboard events globally: Tab, Arrow-Left/Right
			const window = getWindow(this.container);
			this._register(addDisposableListener(window, 'keydown', e => {
				const evt = new StandardKeyboardEvent(e);

				if (evt.equals(KeyMod.Alt)) {
					evt.preventDefault();
				}

				if (evt.equals(KeyCode.Enter)) {

					// Enter in input field should OK the dialog
					if (this.inputs.some(input => input.hasFocus())) {
						EventHelper.stop(e);

						resolve({
							button: buttonMap.find(button => button.index !== this.options.cancelId)?.index ?? 0,
							checkboxChecked: this.checkbox ? this.checkbox.checked : undefined,
							values: this.inputs.length > 0 ? this.inputs.map(input => input.value) : undefined
						});
					}

					return; // leave default handling
				}

				// Cmd+D (trigger the "no"/"do not save"-button) (macOS only)
				if (isMacintosh && evt.equals(KeyMod.CtrlCmd | KeyCode.KeyD)) {
					EventHelper.stop(e);

					const noButton = buttonMap.find(button => button.index === 1 && button.index !== this.options.cancelId);
					if (noButton) {
						resolve({
							button: noButton.index,
							checkboxChecked: this.checkbox ? this.checkbox.checked : undefined,
							values: this.inputs.length > 0 ? this.inputs.map(input => input.value) : undefined
						});
					}

					return; // leave default handling
				}

				if (evt.equals(KeyCode.Space)) {
					return; // leave default handling
				}

				let eventHandled = false;

				// Focus: Next / Previous
				if (evt.equals(KeyCode.Tab) || evt.equals(KeyCode.RightArrow) || evt.equals(KeyMod.Shift | KeyCode.Tab) || evt.equals(KeyCode.LeftArrow)) {

					// Build a list of focusable elements in their visual order
					const focusableElements: { focus: () => void }[] = [];
					let focusedIndex = -1;

					if (this.messageContainer) {
						// eslint-disable-next-line no-restricted-syntax
						const links = this.messageContainer.querySelectorAll('a');
						for (const link of links) {
							focusableElements.push(link);
							if (isActiveElement(link)) {
								focusedIndex = focusableElements.length - 1;
							}
						}
					}

					for (const input of this.inputs) {
						focusableElements.push(input);
						if (input.hasFocus()) {
							focusedIndex = focusableElements.length - 1;
						}
					}

					if (this.checkbox) {
						focusableElements.push(this.checkbox);
						if (this.checkbox.hasFocus()) {
							focusedIndex = focusableElements.length - 1;
						}
					}

					if (this.buttonBar) {
						for (const button of this.buttonBar.buttons) {
							if (button instanceof ButtonWithDropdown) {
								focusableElements.push(button.primaryButton);
								if (button.primaryButton.hasFocus()) {
									focusedIndex = focusableElements.length - 1;
								}
								focusableElements.push(button.dropdownButton);
								if (button.dropdownButton.hasFocus()) {
									focusedIndex = focusableElements.length - 1;
								}
							} else {
								focusableElements.push(button);
								if (button.hasFocus()) {
									focusedIndex = focusableElements.length - 1;
								}
							}
						}
					}

					if (this.footerContainer) {
						// eslint-disable-next-line no-restricted-syntax
						const links = this.footerContainer.querySelectorAll('a');
						for (const link of links) {
							focusableElements.push(link);
							if (isActiveElement(link)) {
								focusedIndex = focusableElements.length - 1;
							}
						}
					}

					// Focus next element (with wrapping)
					if (evt.equals(KeyCode.Tab) || evt.equals(KeyCode.RightArrow)) {
						const newFocusedIndex = (focusedIndex + 1) % focusableElements.length;
						focusableElements[newFocusedIndex].focus();
					}

					// Focus previous element (with wrapping)
					else {
						if (focusedIndex === -1) {
							focusedIndex = focusableElements.length; // default to focus last element if none have focus
						}

						let newFocusedIndex = focusedIndex - 1;
						if (newFocusedIndex === -1) {
							newFocusedIndex = focusableElements.length - 1;
						}

						focusableElements[newFocusedIndex].focus();
					}

					eventHandled = true;
				}

				if (eventHandled) {
					EventHelper.stop(e, true);
				} else if (this.options.keyEventProcessor) {
					this.options.keyEventProcessor(evt);
				}
			}, true));

			this._register(addDisposableListener(window, 'keyup', e => {
				EventHelper.stop(e, true);
				const evt = new StandardKeyboardEvent(e);

				if (!this.options.disableCloseAction && evt.equals(KeyCode.Escape)) {
					close();
				}
			}, true));

			// Detect focus out
			this._register(addDisposableListener(this.element, 'focusout', e => {
				if (!!e.relatedTarget && !!this.element) {
					if (!isAncestor(e.relatedTarget as HTMLElement, this.element)) {
						this.focusToReturn = e.relatedTarget as HTMLElement;

						if (e.target) {
							(e.target as HTMLElement).focus();
							EventHelper.stop(e, true);
						}
					}
				}
			}, false));

			const spinModifierClassName = 'codicon-modifier-spin';

			this.iconElement.classList.remove(...ThemeIcon.asClassNameArray(Codicon.dialogError), ...ThemeIcon.asClassNameArray(Codicon.dialogWarning), ...ThemeIcon.asClassNameArray(Codicon.dialogInfo), ...ThemeIcon.asClassNameArray(Codicon.loading), spinModifierClassName);

			if (this.options.icon) {
				this.iconElement.classList.add(...ThemeIcon.asClassNameArray(this.options.icon));
			} else {
				switch (this.options.type) {
					case 'error':
						this.iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.dialogError));
						break;
					case 'warning':
						this.iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.dialogWarning));
						break;
					case 'pending':
						this.iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.loading), spinModifierClassName);
						break;
					case 'none':
						this.iconElement.classList.add('no-codicon');
						break;
					case 'info':
					case 'question':
					default:
						this.iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.dialogInfo));
						break;
				}
			}

			if (!this.options.disableCloseAction && !this.options.disableCloseButton) {
				const actionBar = this._register(new ActionBar(this.toolbarContainer, {}));

				const action = this._register(new Action('dialog.close', localize('dialogClose', "Close Dialog"), ThemeIcon.asClassName(Codicon.dialogClose), true, async () => {
					resolve({
						button: this.options.cancelId || 0,
						checkboxChecked: this.checkbox ? this.checkbox.checked : undefined
					});
				}));

				actionBar.push(action, { icon: true, label: false });
			}

			this.applyStyles();

			this.element.setAttribute('aria-modal', 'true');
			this.element.setAttribute('aria-labelledby', 'monaco-dialog-icon monaco-dialog-message-text');
			this.element.setAttribute('aria-describedby', 'monaco-dialog-icon monaco-dialog-message-text monaco-dialog-message-detail monaco-dialog-message-body monaco-dialog-footer');
			show(this.element);

			// Focus first element (input or button)
			if (this.inputs.length > 0) {
				this.inputs[0].focus();
				this.inputs[0].select();
			} else {
				buttonMap.forEach((value, index) => {
					if (value.index === 0) {
						buttonBar.buttons[index].focus();
					}
				});
			}
		});
	}

	private applyStyles() {
		const style = this.options.dialogStyles;

		const fgColor = style.dialogForeground;
		const bgColor = style.dialogBackground;
		const shadowColor = style.dialogShadow ? `0 0px 8px ${style.dialogShadow}` : '';
		const border = style.dialogBorder ? `1px solid ${style.dialogBorder}` : '';
		const linkFgColor = style.textLinkForeground;

		this.shadowElement.style.boxShadow = shadowColor;

		this.element.style.color = fgColor ?? '';
		this.element.style.backgroundColor = bgColor ?? '';
		this.element.style.border = border;

		if (linkFgColor) {
			// eslint-disable-next-line no-restricted-syntax
			for (const el of [...this.messageContainer.getElementsByTagName('a'), ...this.footerContainer?.getElementsByTagName('a') ?? []]) {
				el.style.color = linkFgColor;
			}
		}

		let color;
		switch (this.options.type) {
			case 'none':
				break;
			case 'error':
				color = style.errorIconForeground;
				break;
			case 'warning':
				color = style.warningIconForeground;
				break;
			default:
				color = style.infoIconForeground;
				break;
		}
		if (color) {
			this.iconElement.style.color = color;
		}
	}

	override dispose(): void {
		super.dispose();

		if (this.modalElement) {
			this.modalElement.remove();
			this.modalElement = undefined;
		}

		if (this.focusToReturn && isAncestor(this.focusToReturn, this.container.ownerDocument.body)) {
			this.focusToReturn.focus();
			this.focusToReturn = undefined;
		}
	}

	private rearrangeButtons(buttons: Array<string>, cancelId: number | undefined): ButtonMapEntry[] {

		// Maps each button to its current label and old index
		// so that when we move them around it's not a problem
		const buttonMap: ButtonMapEntry[] = buttons.map((label, index) => ({ label, index }));

		if (buttons.length < 2 || this.options.alignment === DialogContentsAlignment.Vertical) {
			return buttonMap; // only need to rearrange if there are 2+ buttons and the alignment is left-to-right
		}

		if (isMacintosh || isLinux) {

			// Linux: the GNOME HIG (https://developer.gnome.org/hig/patterns/feedback/dialogs.html?highlight=dialog)
			// recommend the following:
			// "Always ensure that the cancel button appears first, before the affirmative button. In left-to-right
			//  locales, this is on the left. This button order ensures that users become aware of, and are reminded
			//  of, the ability to cancel prior to encountering the affirmative button."

			// macOS: the HIG (https://developer.apple.com/design/human-interface-guidelines/components/presentation/alerts)
			// recommend the following:
			// "Place buttons where people expect. In general, place the button people are most likely to choose on the trailing side in a
			//  row of buttons or at the top in a stack of buttons. Always place the default button on the trailing side of a row or at the
			//  top of a stack. Cancel buttons are typically on the leading side of a row or at the bottom of a stack."

			if (typeof cancelId === 'number' && buttonMap[cancelId]) {
				const cancelButton = buttonMap.splice(cancelId, 1)[0];
				buttonMap.splice(1, 0, cancelButton);
			}

			buttonMap.reverse();
		} else if (isWindows) {

			// Windows: the HIG (https://learn.microsoft.com/en-us/windows/win32/uxguide/win-dialog-box)
			// recommend the following:
			// "One of the following sets of concise commands: Yes/No, Yes/No/Cancel, [Do it]/Cancel,
			//  [Do it]/[Don't do it], [Do it]/[Don't do it]/Cancel."

			if (typeof cancelId === 'number' && buttonMap[cancelId]) {
				const cancelButton = buttonMap.splice(cancelId, 1)[0];
				buttonMap.push(cancelButton);
			}
		}

		return buttonMap;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dnd/dnd.css]---
Location: vscode-main/src/vs/base/browser/ui/dnd/dnd.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-drag-image {
	display: inline-block;
	padding: 1px 7px;
	border-radius: 10px;
	font-size: 12px;
	position: absolute;
	z-index: 1000;

	/* Default styles */
	background-color: var(--vscode-list-activeSelectionBackground);
	color: var(--vscode-list-activeSelectionForeground);
	outline: 1px solid var(--vscode-list-focusOutline);
	outline-offset: -1px;

	/*
	 * Browsers apply an effect to the drag image when the div becomes too
	 * large which makes them unreadable. Use max width so it does not happen
	 */
	max-width: 120px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dnd/dnd.ts]---
Location: vscode-main/src/vs/base/browser/ui/dnd/dnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $ } from '../../dom.js';
import './dnd.css';

export function applyDragImage(event: DragEvent, container: HTMLElement, label: string, extraClasses: string[] = []): void {
	if (!event.dataTransfer) {
		return;
	}

	const dragImage = $('.monaco-drag-image');
	dragImage.textContent = label;
	dragImage.classList.add(...extraClasses);

	const getDragImageContainer = (e: HTMLElement | null) => {
		while (e && !e.classList.contains('monaco-workbench')) {
			e = e.parentElement;
		}
		return e || container.ownerDocument.body;
	};

	const dragContainer = getDragImageContainer(container);
	dragContainer.appendChild(dragImage);
	event.dataTransfer.setDragImage(dragImage, -10, -10);

	// Removes the element when the DND operation is done
	setTimeout(() => dragImage.remove(), 0);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dropdown/dropdown.css]---
Location: vscode-main/src/vs/base/browser/ui/dropdown/dropdown.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-dropdown {
	height: 100%;
	padding: 0;
}

.monaco-dropdown > .dropdown-label {
	cursor: pointer;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.monaco-dropdown > .dropdown-label > .action-label.disabled {
	cursor: default;
}

.monaco-dropdown-with-primary {
	display: flex !important;
	flex-direction: row;
	border-radius: 5px;
}

.monaco-dropdown-with-primary > .action-container > .action-label {
	margin-right: 0;
}

.monaco-dropdown-with-primary > .dropdown-action-container > .monaco-dropdown > .dropdown-label .codicon[class*='codicon-'] {
	font-size: 12px;
	padding-left: 0px;
	padding-right: 0px;
	line-height: 16px;
	margin-left: -3px;
}

.monaco-dropdown-with-primary > .dropdown-action-container > .monaco-dropdown > .dropdown-label > .action-label {
	display: block;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dropdown/dropdown.ts]---
Location: vscode-main/src/vs/base/browser/ui/dropdown/dropdown.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IContextMenuProvider } from '../../contextmenu.js';
import { $, addDisposableListener, append, EventHelper, EventType, isMouseEvent } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { EventType as GestureEventType, Gesture } from '../../touch.js';
import { AnchorAlignment } from '../contextview/contextview.js';
import type { IManagedHover } from '../hover/hover.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import { IMenuOptions } from '../menu/menu.js';
import { ActionRunner, IAction } from '../../../common/actions.js';
import { Emitter } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { IDisposable } from '../../../common/lifecycle.js';
import './dropdown.css';

export interface ILabelRenderer {
	(container: HTMLElement): IDisposable | null;
}

export interface IBaseDropdownOptions {
	label?: string;
	labelRenderer?: ILabelRenderer;
}

export class BaseDropdown extends ActionRunner {
	private _element: HTMLElement;
	private boxContainer?: HTMLElement;
	private _label?: HTMLElement;
	private contents?: HTMLElement;

	private visible: boolean | undefined;
	private _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;

	private hover: IManagedHover | undefined;

	constructor(container: HTMLElement, options: IBaseDropdownOptions) {
		super();

		this._element = append(container, $('.monaco-dropdown'));

		this._label = append(this._element, $('.dropdown-label'));

		let labelRenderer = options.labelRenderer;
		if (!labelRenderer) {
			labelRenderer = (container: HTMLElement): IDisposable | null => {
				container.textContent = options.label || '';

				return null;
			};
		}

		for (const event of [EventType.CLICK, EventType.MOUSE_DOWN, GestureEventType.Tap]) {
			this._register(addDisposableListener(this.element, event, e => EventHelper.stop(e, true))); // prevent default click behaviour to trigger
		}

		for (const event of [EventType.MOUSE_DOWN, GestureEventType.Tap]) {
			this._register(addDisposableListener(this._label, event, e => {
				if (isMouseEvent(e) && e.button !== 0) {
					// prevent right click trigger to allow separate context menu (https://github.com/microsoft/vscode/issues/151064)
					return;
				}

				if (this.visible) {
					this.hide();
				} else {
					this.show();
				}
			}));
		}

		this._register(addDisposableListener(this._label, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				EventHelper.stop(e, true); // https://github.com/microsoft/vscode/issues/57997

				if (this.visible) {
					this.hide();
				} else {
					this.show();
				}
			}
		}));

		const cleanupFn = labelRenderer(this._label);
		if (cleanupFn) {
			this._register(cleanupFn);
		}

		this._register(Gesture.addTarget(this._label));
	}

	get element(): HTMLElement {
		return this._element;
	}

	get label() {
		return this._label;
	}

	set tooltip(tooltip: string) {
		if (this._label) {
			if (!this.hover && tooltip !== '') {
				this.hover = this._register(getBaseLayerHoverDelegate().setupManagedHover(getDefaultHoverDelegate('mouse'), this._label, tooltip));
			} else if (this.hover) {
				this.hover.update(tooltip);
			}
		}
	}

	show(): void {
		if (!this.visible) {
			this.visible = true;
			this._onDidChangeVisibility.fire(true);
		}
	}

	hide(): void {
		if (this.visible) {
			this.visible = false;
			this._onDidChangeVisibility.fire(false);
		}
	}

	isVisible(): boolean {
		return !!this.visible;
	}

	protected onEvent(_e: Event, activeElement: HTMLElement): void {
		this.hide();
	}

	override dispose(): void {
		super.dispose();
		this.hide();

		if (this.boxContainer) {
			this.boxContainer.remove();
			this.boxContainer = undefined;
		}

		if (this.contents) {
			this.contents.remove();
			this.contents = undefined;
		}

		if (this._label) {
			this._label.remove();
			this._label = undefined;
		}
	}
}

export interface IActionProvider {
	getActions(): readonly IAction[];
}

export function isActionProvider(obj: unknown): obj is IActionProvider {
	const candidate = obj as IActionProvider | undefined;

	return typeof candidate?.getActions === 'function';
}

export interface IDropdownMenuOptions extends IBaseDropdownOptions {
	contextMenuProvider: IContextMenuProvider;
	readonly actions?: IAction[];
	readonly actionProvider?: IActionProvider;
	menuClassName?: string;
	menuAsChild?: boolean; // scope down for #99448
	readonly skipTelemetry?: boolean;
}

export class DropdownMenu extends BaseDropdown {
	private _menuOptions: IMenuOptions | undefined;
	private _actions: readonly IAction[] = [];

	constructor(container: HTMLElement, private readonly _options: IDropdownMenuOptions) {
		super(container, _options);

		this.actions = _options.actions || [];
	}

	set menuOptions(options: IMenuOptions | undefined) {
		this._menuOptions = options;
	}

	get menuOptions(): IMenuOptions | undefined {
		return this._menuOptions;
	}

	private get actions(): readonly IAction[] {
		if (this._options.actionProvider) {
			return this._options.actionProvider.getActions();
		}

		return this._actions;
	}

	private set actions(actions: readonly IAction[]) {
		this._actions = actions;
	}

	override show(): void {
		super.show();

		this.element.classList.add('active');

		this._options.contextMenuProvider.showContextMenu({
			getAnchor: () => this.element,
			getActions: () => this.actions,
			getActionsContext: () => this.menuOptions ? this.menuOptions.context : null,
			getActionViewItem: (action, options) => this.menuOptions && this.menuOptions.actionViewItemProvider ? this.menuOptions.actionViewItemProvider(action, options) : undefined,
			getKeyBinding: action => this.menuOptions && this.menuOptions.getKeyBinding ? this.menuOptions.getKeyBinding(action) : undefined,
			getMenuClassName: () => this._options.menuClassName || '',
			onHide: () => this.onHide(),
			actionRunner: this.menuOptions ? this.menuOptions.actionRunner : undefined,
			anchorAlignment: this.menuOptions ? this.menuOptions.anchorAlignment : AnchorAlignment.LEFT,
			domForShadowRoot: this._options.menuAsChild ? this.element : undefined,
			skipTelemetry: this._options.skipTelemetry
		});
	}

	override hide(): void {
		super.hide();
	}

	private onHide(): void {
		this.hide();
		this.element.classList.remove('active');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/dropdown/dropdownActionViewItem.ts]---
Location: vscode-main/src/vs/base/browser/ui/dropdown/dropdownActionViewItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Action, IAction, IActionRunner } from '../../../common/actions.js';
import { Codicon } from '../../../common/codicons.js';
import { Emitter } from '../../../common/event.js';
import { ResolvedKeybinding } from '../../../common/keybindings.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { IDisposable } from '../../../common/lifecycle.js';
import { ThemeIcon } from '../../../common/themables.js';
import { IContextMenuProvider } from '../../contextmenu.js';
import { $, addDisposableListener, append, EventType, h } from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { IActionViewItemProvider } from '../actionbar/actionbar.js';
import { ActionViewItem, BaseActionViewItem, IActionViewItemOptions, IBaseActionViewItemOptions } from '../actionbar/actionViewItems.js';
import { AnchorAlignment } from '../contextview/contextview.js';
import { getBaseLayerHoverDelegate } from '../hover/hoverDelegate2.js';
import { getDefaultHoverDelegate } from '../hover/hoverDelegateFactory.js';
import './dropdown.css';
import { DropdownMenu, IActionProvider, IDropdownMenuOptions, ILabelRenderer } from './dropdown.js';

export interface IKeybindingProvider {
	(action: IAction): ResolvedKeybinding | undefined;
}

export interface IAnchorAlignmentProvider {
	(): AnchorAlignment;
}

export interface IDropdownMenuActionViewItemOptions extends IBaseActionViewItemOptions {
	readonly actionViewItemProvider?: IActionViewItemProvider;
	readonly keybindingProvider?: IKeybindingProvider;
	readonly actionRunner?: IActionRunner;
	readonly classNames?: string[] | string;
	readonly anchorAlignmentProvider?: IAnchorAlignmentProvider;
	readonly menuAsChild?: boolean;
	readonly skipTelemetry?: boolean;
}

export class DropdownMenuActionViewItem extends BaseActionViewItem {
	private menuActionsOrProvider: readonly IAction[] | IActionProvider;
	private dropdownMenu: DropdownMenu | undefined;
	private contextMenuProvider: IContextMenuProvider;
	private actionItem: HTMLElement | null = null;

	private _onDidChangeVisibility = this._register(new Emitter<boolean>());
	get onDidChangeVisibility() { return this._onDidChangeVisibility.event; }

	protected override readonly options: IDropdownMenuActionViewItemOptions;

	constructor(
		action: IAction,
		menuActionsOrProvider: readonly IAction[] | IActionProvider,
		contextMenuProvider: IContextMenuProvider,
		options: IDropdownMenuActionViewItemOptions = Object.create(null)
	) {
		super(null, action, options);

		this.menuActionsOrProvider = menuActionsOrProvider;
		this.contextMenuProvider = contextMenuProvider;
		this.options = options;

		if (this.options.actionRunner) {
			this.actionRunner = this.options.actionRunner;
		}
	}

	override render(container: HTMLElement): void {
		this.actionItem = container;

		const labelRenderer: ILabelRenderer = (el: HTMLElement): IDisposable | null => {
			this.element = append(el, $('a.action-label'));
			this.setAriaLabelAttributes(this.element);
			return this.renderLabel(this.element);
		};

		const isActionsArray = Array.isArray(this.menuActionsOrProvider);
		const options: IDropdownMenuOptions = {
			contextMenuProvider: this.contextMenuProvider,
			labelRenderer: labelRenderer,
			menuAsChild: this.options.menuAsChild,
			actions: isActionsArray ? this.menuActionsOrProvider as IAction[] : undefined,
			actionProvider: isActionsArray ? undefined : this.menuActionsOrProvider as IActionProvider,
			skipTelemetry: this.options.skipTelemetry
		};

		this.dropdownMenu = this._register(new DropdownMenu(container, options));
		this._register(this.dropdownMenu.onDidChangeVisibility(visible => {
			this.element?.setAttribute('aria-expanded', `${visible}`);
			this._onDidChangeVisibility.fire(visible);
		}));

		this.dropdownMenu.menuOptions = {
			actionViewItemProvider: this.options.actionViewItemProvider,
			actionRunner: this.actionRunner,
			getKeyBinding: this.options.keybindingProvider,
			context: this._context
		};

		if (this.options.anchorAlignmentProvider) {
			const that = this;

			this.dropdownMenu.menuOptions = {
				...this.dropdownMenu.menuOptions,
				get anchorAlignment(): AnchorAlignment {
					return that.options.anchorAlignmentProvider!();
				}
			};
		}

		this.updateTooltip();
		this.updateEnabled();
	}

	protected renderLabel(element: HTMLElement): IDisposable | null {
		let classNames: string[] = [];

		if (typeof this.options.classNames === 'string') {
			classNames = this.options.classNames.split(/\s+/g).filter(s => !!s);
		} else if (this.options.classNames) {
			classNames = this.options.classNames;
		}

		// todo@aeschli: remove codicon, should come through `this.options.classNames`
		if (!classNames.find(c => c === 'icon')) {
			classNames.push('codicon');
		}

		element.classList.add(...classNames);

		if (this._action.label) {
			this._register(getBaseLayerHoverDelegate().setupManagedHover(this.options.hoverDelegate ?? getDefaultHoverDelegate('mouse'), element, this._action.label));
		}

		return null;
	}

	protected setAriaLabelAttributes(element: HTMLElement): void {
		element.setAttribute('role', 'button');
		element.setAttribute('aria-haspopup', 'true');
		element.setAttribute('aria-expanded', 'false');
		element.ariaLabel = this._action.label || '';
	}

	protected override getTooltip(): string | undefined {
		let title: string | null = null;

		if (this.action.tooltip) {
			title = this.action.tooltip;
		} else if (this.action.label) {
			title = this.action.label;
		}

		return title ?? undefined;
	}

	override setActionContext(newContext: unknown): void {
		super.setActionContext(newContext);

		if (this.dropdownMenu) {
			if (this.dropdownMenu.menuOptions) {
				this.dropdownMenu.menuOptions.context = newContext;
			} else {
				this.dropdownMenu.menuOptions = { context: newContext };
			}
		}
	}

	show(): void {
		this.dropdownMenu?.show();
	}

	protected override updateEnabled(): void {
		const disabled = !this.action.enabled;
		this.actionItem?.classList.toggle('disabled', disabled);
		this.element?.classList.toggle('disabled', disabled);
	}
}

export interface IActionWithDropdownActionViewItemOptions extends IActionViewItemOptions {
	readonly menuActionsOrProvider: readonly IAction[] | IActionProvider;
	readonly menuActionClassNames?: string[];
}

export class ActionWithDropdownActionViewItem extends ActionViewItem {

	protected dropdownMenuActionViewItem: DropdownMenuActionViewItem | undefined;

	constructor(
		context: unknown,
		action: IAction,
		options: IActionWithDropdownActionViewItemOptions,
		private readonly contextMenuProvider: IContextMenuProvider
	) {
		super(context, action, options);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		if (this.element) {
			this.element.classList.add('action-dropdown-item');
			const menuActionsProvider = {
				getActions: () => {
					const actionsProvider = (<IActionWithDropdownActionViewItemOptions>this.options).menuActionsOrProvider;
					return Array.isArray(actionsProvider) ? actionsProvider : (actionsProvider as IActionProvider).getActions(); // TODO: microsoft/TypeScript#42768
				}
			};

			const menuActionClassNames = (<IActionWithDropdownActionViewItemOptions>this.options).menuActionClassNames || [];
			const separator = h('div.action-dropdown-item-separator', [h('div', {})]).root;
			separator.classList.toggle('prominent', menuActionClassNames.includes('prominent'));
			append(this.element, separator);

			this.dropdownMenuActionViewItem = this._register(new DropdownMenuActionViewItem(this._register(new Action('dropdownAction', nls.localize('moreActions', "More Actions..."))), menuActionsProvider, this.contextMenuProvider, { classNames: ['dropdown', ...ThemeIcon.asClassNameArray(Codicon.dropDownButton), ...menuActionClassNames], hoverDelegate: this.options.hoverDelegate }));
			this.dropdownMenuActionViewItem.render(this.element);

			this._register(addDisposableListener(this.element, EventType.KEY_DOWN, e => {
				// If we don't have any actions then the dropdown is hidden so don't try to focus it #164050
				if (menuActionsProvider.getActions().length === 0) {
					return;
				}
				const event = new StandardKeyboardEvent(e);
				let handled: boolean = false;
				if (this.dropdownMenuActionViewItem?.isFocused() && event.equals(KeyCode.LeftArrow)) {
					handled = true;
					this.dropdownMenuActionViewItem?.blur();
					this.focus();
				} else if (this.isFocused() && event.equals(KeyCode.RightArrow)) {
					handled = true;
					this.blur();
					this.dropdownMenuActionViewItem?.focus();
				}
				if (handled) {
					event.preventDefault();
					event.stopPropagation();
				}
			}));
		}
	}

	override blur(): void {
		super.blur();
		this.dropdownMenuActionViewItem?.blur();
	}

	override setFocusable(focusable: boolean): void {
		super.setFocusable(focusable);
		this.dropdownMenuActionViewItem?.setFocusable(focusable);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/findinput/findInput.css]---
Location: vscode-main/src/vs/base/browser/ui/findinput/findInput.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* ---------- Find input ---------- */

.monaco-findInput {
	position: relative;
}

.monaco-findInput .monaco-inputbox {
	font-size: 13px;
	width: 100%;
}

.monaco-findInput > .controls {
	position: absolute;
	top: 3px;
	right: 2px;
}

.vs .monaco-findInput.disabled {
	background-color: #E1E1E1;
}

/* Theming */
.vs-dark .monaco-findInput.disabled {
	background-color: #333;
}

/* Highlighting */
.monaco-findInput.highlight-0 .controls,
.hc-light .monaco-findInput.highlight-0 .controls {
	animation: monaco-findInput-highlight-0 100ms linear 0s;
}

.monaco-findInput.highlight-1 .controls,
.hc-light .monaco-findInput.highlight-1 .controls {
	animation: monaco-findInput-highlight-1 100ms linear 0s;
}

.hc-black .monaco-findInput.highlight-0 .controls,
.vs-dark  .monaco-findInput.highlight-0 .controls {
	animation: monaco-findInput-highlight-dark-0 100ms linear 0s;
}

.hc-black .monaco-findInput.highlight-1 .controls,
.vs-dark  .monaco-findInput.highlight-1 .controls {
	animation: monaco-findInput-highlight-dark-1 100ms linear 0s;
}

@keyframes monaco-findInput-highlight-0 {
	0% { background: rgba(253, 255, 0, 0.8); }
	100% { background: transparent; }
}
@keyframes monaco-findInput-highlight-1 {
	0% { background: rgba(253, 255, 0, 0.8); }
	/* Made intentionally different such that the CSS minifier does not collapse the two animations into a single one*/
	99% { background: transparent; }
}

@keyframes monaco-findInput-highlight-dark-0 {
	0% { background: rgba(255, 255, 255, 0.44); }
	100% { background: transparent; }
}
@keyframes monaco-findInput-highlight-dark-1 {
	0% { background: rgba(255, 255, 255, 0.44); }
	/* Made intentionally different such that the CSS minifier does not collapse the two animations into a single one*/
	99% { background: transparent; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/findinput/findInput.ts]---
Location: vscode-main/src/vs/base/browser/ui/findinput/findInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { IKeyboardEvent } from '../../keyboardEvent.js';
import { IMouseEvent } from '../../mouseEvent.js';
import { IToggleStyles, Toggle } from '../toggle/toggle.js';
import { IContextViewProvider } from '../contextview/contextview.js';
import { CaseSensitiveToggle, RegexToggle, WholeWordsToggle } from './findInputToggles.js';
import { HistoryInputBox, IInputBoxStyles, IInputValidator, IMessage as InputBoxMessage } from '../inputbox/inputBox.js';
import { Widget } from '../widget.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { IAction } from '../../../common/actions.js';
import type { IActionViewItemProvider } from '../actionbar/actionbar.js';
import './findInput.css';
import * as nls from '../../../../nls.js';
import { DisposableStore, MutableDisposable } from '../../../common/lifecycle.js';
import { IHistory } from '../../../common/history.js';
import type { IHoverLifecycleOptions } from '../hover/hover.js';


export interface IFindInputOptions {
	readonly placeholder?: string;
	readonly width?: number;
	readonly validation?: IInputValidator;
	readonly label: string;
	readonly flexibleHeight?: boolean;
	readonly flexibleWidth?: boolean;
	readonly flexibleMaxHeight?: number;

	readonly showCommonFindToggles?: boolean;
	readonly appendCaseSensitiveLabel?: string;
	readonly appendWholeWordsLabel?: string;
	readonly appendRegexLabel?: string;
	readonly additionalToggles?: Toggle[];
	readonly actions?: ReadonlyArray<IAction>;
	readonly actionViewItemProvider?: IActionViewItemProvider;
	readonly showHistoryHint?: () => boolean;
	readonly toggleStyles: IToggleStyles;
	readonly inputBoxStyles: IInputBoxStyles;
	readonly history?: IHistory<string>;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;
}

const NLS_DEFAULT_LABEL = nls.localize('defaultLabel', "input");

export class FindInput extends Widget {

	static readonly OPTION_CHANGE: string = 'optionChange';

	private placeholder: string;
	private validation?: IInputValidator;
	private label: string;
	private readonly showCommonFindToggles: boolean;
	private fixFocusOnOptionClickEnabled = true;
	private imeSessionInProgress = false;
	private readonly additionalTogglesDisposables: MutableDisposable<DisposableStore> = this._register(new MutableDisposable());

	protected readonly controls: HTMLDivElement;
	protected readonly regex?: RegexToggle;
	protected readonly wholeWords?: WholeWordsToggle;
	protected readonly caseSensitive?: CaseSensitiveToggle;
	protected additionalToggles: Toggle[] = [];
	public readonly domNode: HTMLElement;
	public readonly inputBox: HistoryInputBox;

	private readonly _onDidOptionChange = this._register(new Emitter<boolean>());
	public get onDidOptionChange(): Event<boolean /* via keyboard */> { return this._onDidOptionChange.event; }

	private readonly _onKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public get onKeyDown(): Event<IKeyboardEvent> { return this._onKeyDown.event; }

	private readonly _onMouseDown = this._register(new Emitter<IMouseEvent>());
	public get onMouseDown(): Event<IMouseEvent> { return this._onMouseDown.event; }

	private readonly _onInput = this._register(new Emitter<void>());
	public get onInput(): Event<void> { return this._onInput.event; }

	private readonly _onKeyUp = this._register(new Emitter<IKeyboardEvent>());
	public get onKeyUp(): Event<IKeyboardEvent> { return this._onKeyUp.event; }

	private _onCaseSensitiveKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public get onCaseSensitiveKeyDown(): Event<IKeyboardEvent> { return this._onCaseSensitiveKeyDown.event; }

	private _onRegexKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public get onRegexKeyDown(): Event<IKeyboardEvent> { return this._onRegexKeyDown.event; }

	constructor(parent: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, options: IFindInputOptions) {
		super();
		this.placeholder = options.placeholder || '';
		this.validation = options.validation;
		this.label = options.label || NLS_DEFAULT_LABEL;
		this.showCommonFindToggles = !!options.showCommonFindToggles;

		const appendCaseSensitiveLabel = options.appendCaseSensitiveLabel || '';
		const appendWholeWordsLabel = options.appendWholeWordsLabel || '';
		const appendRegexLabel = options.appendRegexLabel || '';
		const flexibleHeight = !!options.flexibleHeight;
		const flexibleWidth = !!options.flexibleWidth;
		const flexibleMaxHeight = options.flexibleMaxHeight;

		this.domNode = document.createElement('div');
		this.domNode.classList.add('monaco-findInput');

		this.inputBox = this._register(new HistoryInputBox(this.domNode, contextViewProvider, {
			placeholder: this.placeholder || '',
			ariaLabel: this.label || '',
			validationOptions: {
				validation: this.validation
			},
			showHistoryHint: options.showHistoryHint,
			flexibleHeight,
			flexibleWidth,
			flexibleMaxHeight,
			inputBoxStyles: options.inputBoxStyles,
			history: options.history,
			actions: options.actions,
			actionViewItemProvider: options.actionViewItemProvider
		}));

		if (this.showCommonFindToggles) {
			const hoverLifecycleOptions: IHoverLifecycleOptions = options?.hoverLifecycleOptions || { groupId: 'find-input' };
			this.regex = this._register(new RegexToggle({
				appendTitle: appendRegexLabel,
				isChecked: false,
				hoverLifecycleOptions,
				...options.toggleStyles
			}));
			this._register(this.regex.onChange(viaKeyboard => {
				this._onDidOptionChange.fire(viaKeyboard);
				if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
					this.inputBox.focus();
				}
				this.validate();
			}));
			this._register(this.regex.onKeyDown(e => {
				this._onRegexKeyDown.fire(e);
			}));

			this.wholeWords = this._register(new WholeWordsToggle({
				appendTitle: appendWholeWordsLabel,
				isChecked: false,
				hoverLifecycleOptions,
				...options.toggleStyles
			}));
			this._register(this.wholeWords.onChange(viaKeyboard => {
				this._onDidOptionChange.fire(viaKeyboard);
				if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
					this.inputBox.focus();
				}
				this.validate();
			}));

			this.caseSensitive = this._register(new CaseSensitiveToggle({
				appendTitle: appendCaseSensitiveLabel,
				isChecked: false,
				hoverLifecycleOptions,
				...options.toggleStyles
			}));
			this._register(this.caseSensitive.onChange(viaKeyboard => {
				this._onDidOptionChange.fire(viaKeyboard);
				if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
					this.inputBox.focus();
				}
				this.validate();
			}));
			this._register(this.caseSensitive.onKeyDown(e => {
				this._onCaseSensitiveKeyDown.fire(e);
			}));

			// Arrow-Key support to navigate between options
			const indexes = [this.caseSensitive.domNode, this.wholeWords.domNode, this.regex.domNode];
			this.onkeydown(this.domNode, (event: IKeyboardEvent) => {
				if (event.equals(KeyCode.LeftArrow) || event.equals(KeyCode.RightArrow) || event.equals(KeyCode.Escape)) {
					const index = indexes.indexOf(<HTMLElement>this.domNode.ownerDocument.activeElement);
					if (index >= 0) {
						let newIndex: number = -1;
						if (event.equals(KeyCode.RightArrow)) {
							newIndex = (index + 1) % indexes.length;
						} else if (event.equals(KeyCode.LeftArrow)) {
							if (index === 0) {
								newIndex = indexes.length - 1;
							} else {
								newIndex = index - 1;
							}
						}

						if (event.equals(KeyCode.Escape)) {
							indexes[index].blur();
							this.inputBox.focus();
						} else if (newIndex >= 0) {
							indexes[newIndex].focus();
						}

						dom.EventHelper.stop(event, true);
					}
				}
			});
		}

		this.controls = document.createElement('div');
		this.controls.className = 'controls';
		this.controls.style.display = this.showCommonFindToggles ? '' : 'none';
		if (this.caseSensitive) {
			this.controls.append(this.caseSensitive.domNode);
		}
		if (this.wholeWords) {
			this.controls.appendChild(this.wholeWords.domNode);
		}
		if (this.regex) {
			this.controls.appendChild(this.regex.domNode);
		}

		this.setAdditionalToggles(options?.additionalToggles);

		if (this.controls) {
			this.domNode.appendChild(this.controls);
		}

		parent?.appendChild(this.domNode);

		this._register(dom.addDisposableListener(this.inputBox.inputElement, 'compositionstart', (e: CompositionEvent) => {
			this.imeSessionInProgress = true;
		}));
		this._register(dom.addDisposableListener(this.inputBox.inputElement, 'compositionend', (e: CompositionEvent) => {
			this.imeSessionInProgress = false;
			this._onInput.fire();
		}));

		this.onkeydown(this.inputBox.inputElement, (e) => this._onKeyDown.fire(e));
		this.onkeyup(this.inputBox.inputElement, (e) => this._onKeyUp.fire(e));
		this.oninput(this.inputBox.inputElement, (e) => this._onInput.fire());
		this.onmousedown(this.inputBox.inputElement, (e) => this._onMouseDown.fire(e));
	}

	public get isImeSessionInProgress(): boolean {
		return this.imeSessionInProgress;
	}

	public get onDidChange(): Event<string> {
		return this.inputBox.onDidChange;
	}

	public layout(style: { collapsedFindWidget: boolean; narrowFindWidget: boolean; reducedFindWidget: boolean }) {
		this.inputBox.layout();
		this.updateInputBoxPadding(style.collapsedFindWidget);
	}

	public enable(): void {
		this.domNode.classList.remove('disabled');
		this.inputBox.enable();
		this.regex?.enable();
		this.wholeWords?.enable();
		this.caseSensitive?.enable();

		for (const toggle of this.additionalToggles) {
			toggle.enable();
		}
	}

	public disable(): void {
		this.domNode.classList.add('disabled');
		this.inputBox.disable();
		this.regex?.disable();
		this.wholeWords?.disable();
		this.caseSensitive?.disable();

		for (const toggle of this.additionalToggles) {
			toggle.disable();
		}
	}

	public setFocusInputOnOptionClick(value: boolean): void {
		this.fixFocusOnOptionClickEnabled = value;
	}

	public setEnabled(enabled: boolean): void {
		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	public setAdditionalToggles(toggles: Toggle[] | undefined): void {
		for (const currentToggle of this.additionalToggles) {
			currentToggle.domNode.remove();
		}
		this.additionalToggles = [];
		this.additionalTogglesDisposables.value = new DisposableStore();

		for (const toggle of toggles ?? []) {
			this.additionalTogglesDisposables.value.add(toggle);
			this.controls.appendChild(toggle.domNode);

			this.additionalTogglesDisposables.value.add(toggle.onChange(viaKeyboard => {
				this._onDidOptionChange.fire(viaKeyboard);
				if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
					this.inputBox.focus();
				}
			}));

			this.additionalToggles.push(toggle);
		}

		if (this.additionalToggles.length > 0) {
			this.controls.style.display = '';
		}

		this.updateInputBoxPadding();
	}

	public setActions(actions: ReadonlyArray<IAction> | undefined, actionViewItemProvider?: IActionViewItemProvider): void {
		this.inputBox.setActions(actions, actionViewItemProvider);
	}

	private updateInputBoxPadding(controlsHidden = false) {
		if (controlsHidden) {
			this.inputBox.paddingRight = 0;
		} else {
			this.inputBox.paddingRight =
				((this.caseSensitive?.width() ?? 0) + (this.wholeWords?.width() ?? 0) + (this.regex?.width() ?? 0))
				+ this.additionalToggles.reduce((r, t) => r + t.width(), 0);
		}
	}

	public clear(): void {
		this.clearValidation();
		this.setValue('');
		this.focus();
	}

	public getValue(): string {
		return this.inputBox.value;
	}

	public setValue(value: string): void {
		if (this.inputBox.value !== value) {
			this.inputBox.value = value;
		}
	}

	public onSearchSubmit(): void {
		this.inputBox.addToHistory();
	}

	public select(): void {
		this.inputBox.select();
	}

	public focus(): void {
		this.inputBox.focus();
	}

	public getCaseSensitive(): boolean {
		return this.caseSensitive?.checked ?? false;
	}

	public setCaseSensitive(value: boolean): void {
		if (this.caseSensitive) {
			this.caseSensitive.checked = value;
		}
	}

	public getWholeWords(): boolean {
		return this.wholeWords?.checked ?? false;
	}

	public setWholeWords(value: boolean): void {
		if (this.wholeWords) {
			this.wholeWords.checked = value;
		}
	}

	public getRegex(): boolean {
		return this.regex?.checked ?? false;
	}

	public setRegex(value: boolean): void {
		if (this.regex) {
			this.regex.checked = value;
			this.validate();
		}
	}

	public focusOnCaseSensitive(): void {
		this.caseSensitive?.focus();
	}

	public focusOnRegex(): void {
		this.regex?.focus();
	}

	private _lastHighlightFindOptions: number = 0;
	public highlightFindOptions(): void {
		this.domNode.classList.remove('highlight-' + (this._lastHighlightFindOptions));
		this._lastHighlightFindOptions = 1 - this._lastHighlightFindOptions;
		this.domNode.classList.add('highlight-' + (this._lastHighlightFindOptions));
	}

	public validate(): void {
		this.inputBox.validate();
	}

	public showMessage(message: InputBoxMessage): void {
		this.inputBox.showMessage(message);
	}

	public clearMessage(): void {
		this.inputBox.hideMessage();
	}

	private clearValidation(): void {
		this.inputBox.hideMessage();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/findinput/findInputToggles.ts]---
Location: vscode-main/src/vs/base/browser/ui/findinput/findInputToggles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Toggle } from '../toggle/toggle.js';
import { Codicon } from '../../../common/codicons.js';
import * as nls from '../../../../nls.js';
import { type IHoverLifecycleOptions } from '../hover/hover.js';

export interface IFindInputToggleOpts {
	readonly appendTitle: string;
	readonly isChecked: boolean;
	readonly inputActiveOptionBorder: string | undefined;
	readonly inputActiveOptionForeground: string | undefined;
	readonly inputActiveOptionBackground: string | undefined;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;
}

const NLS_CASE_SENSITIVE_TOGGLE_LABEL = nls.localize('caseDescription', "Match Case");
const NLS_WHOLE_WORD_TOGGLE_LABEL = nls.localize('wordsDescription', "Match Whole Word");
const NLS_REGEX_TOGGLE_LABEL = nls.localize('regexDescription', "Use Regular Expression");

export class CaseSensitiveToggle extends Toggle {
	constructor(opts: IFindInputToggleOpts) {
		super({
			icon: Codicon.caseSensitive,
			title: NLS_CASE_SENSITIVE_TOGGLE_LABEL + opts.appendTitle,
			isChecked: opts.isChecked,
			hoverLifecycleOptions: opts.hoverLifecycleOptions,
			inputActiveOptionBorder: opts.inputActiveOptionBorder,
			inputActiveOptionForeground: opts.inputActiveOptionForeground,
			inputActiveOptionBackground: opts.inputActiveOptionBackground
		});
	}
}

export class WholeWordsToggle extends Toggle {
	constructor(opts: IFindInputToggleOpts) {
		super({
			icon: Codicon.wholeWord,
			title: NLS_WHOLE_WORD_TOGGLE_LABEL + opts.appendTitle,
			isChecked: opts.isChecked,
			hoverLifecycleOptions: opts.hoverLifecycleOptions,
			inputActiveOptionBorder: opts.inputActiveOptionBorder,
			inputActiveOptionForeground: opts.inputActiveOptionForeground,
			inputActiveOptionBackground: opts.inputActiveOptionBackground
		});
	}
}

export class RegexToggle extends Toggle {
	constructor(opts: IFindInputToggleOpts) {
		super({
			icon: Codicon.regex,
			title: NLS_REGEX_TOGGLE_LABEL + opts.appendTitle,
			isChecked: opts.isChecked,
			hoverLifecycleOptions: opts.hoverLifecycleOptions,
			inputActiveOptionBorder: opts.inputActiveOptionBorder,
			inputActiveOptionForeground: opts.inputActiveOptionForeground,
			inputActiveOptionBackground: opts.inputActiveOptionBackground
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/findinput/replaceInput.ts]---
Location: vscode-main/src/vs/base/browser/ui/findinput/replaceInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { IKeyboardEvent } from '../../keyboardEvent.js';
import { IMouseEvent } from '../../mouseEvent.js';
import { IToggleStyles, Toggle } from '../toggle/toggle.js';
import { IContextViewProvider } from '../contextview/contextview.js';
import { IFindInputToggleOpts } from './findInputToggles.js';
import { HistoryInputBox, IInputBoxStyles, IInputValidator, IMessage as InputBoxMessage } from '../inputbox/inputBox.js';
import { Widget } from '../widget.js';
import { Codicon } from '../../../common/codicons.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode } from '../../../common/keyCodes.js';
import './findInput.css';
import * as nls from '../../../../nls.js';
import { IHistory } from '../../../common/history.js';
import { type IHoverLifecycleOptions } from '../hover/hover.js';


export interface IReplaceInputOptions {
	readonly placeholder?: string;
	readonly width?: number;
	readonly validation?: IInputValidator;
	readonly label: string;
	readonly flexibleHeight?: boolean;
	readonly flexibleWidth?: boolean;
	readonly flexibleMaxHeight?: number;
	readonly hoverLifecycleOptions?: IHoverLifecycleOptions;

	readonly appendPreserveCaseLabel?: string;
	readonly history?: IHistory<string>;
	readonly showHistoryHint?: () => boolean;
	readonly inputBoxStyles: IInputBoxStyles;
	readonly toggleStyles: IToggleStyles;
}

const NLS_DEFAULT_LABEL = nls.localize('defaultLabel', "input");
const NLS_PRESERVE_CASE_LABEL = nls.localize('label.preserveCaseToggle', "Preserve Case");

class PreserveCaseToggle extends Toggle {
	constructor(opts: IFindInputToggleOpts) {
		super({
			// TODO: does this need its own icon?
			icon: Codicon.preserveCase,
			title: NLS_PRESERVE_CASE_LABEL + opts.appendTitle,
			isChecked: opts.isChecked,
			hoverLifecycleOptions: opts.hoverLifecycleOptions,
			inputActiveOptionBorder: opts.inputActiveOptionBorder,
			inputActiveOptionForeground: opts.inputActiveOptionForeground,
			inputActiveOptionBackground: opts.inputActiveOptionBackground,
		});
	}
}

export class ReplaceInput extends Widget {

	static readonly OPTION_CHANGE: string = 'optionChange';

	private contextViewProvider: IContextViewProvider | undefined;
	private placeholder: string;
	private validation?: IInputValidator;
	private label: string;
	private fixFocusOnOptionClickEnabled = true;

	private preserveCase: PreserveCaseToggle;
	private cachedOptionsWidth: number = 0;
	public domNode: HTMLElement;
	public inputBox: HistoryInputBox;

	private readonly _onDidOptionChange = this._register(new Emitter<boolean>());
	public get onDidOptionChange(): Event<boolean /* via keyboard */> { return this._onDidOptionChange.event; }

	private readonly _onKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public get onKeyDown(): Event<IKeyboardEvent> { return this._onKeyDown.event; }

	private readonly _onMouseDown = this._register(new Emitter<IMouseEvent>());
	public get onMouseDown(): Event<IMouseEvent> { return this._onMouseDown.event; }

	private readonly _onInput = this._register(new Emitter<void>());
	public get onInput(): Event<void> { return this._onInput.event; }

	private readonly _onKeyUp = this._register(new Emitter<IKeyboardEvent>());
	public get onKeyUp(): Event<IKeyboardEvent> { return this._onKeyUp.event; }

	private _onPreserveCaseKeyDown = this._register(new Emitter<IKeyboardEvent>());
	public get onPreserveCaseKeyDown(): Event<IKeyboardEvent> { return this._onPreserveCaseKeyDown.event; }

	constructor(parent: HTMLElement | null, contextViewProvider: IContextViewProvider | undefined, private readonly _showOptionButtons: boolean, options: IReplaceInputOptions) {
		super();
		this.contextViewProvider = contextViewProvider;
		this.placeholder = options.placeholder || '';
		this.validation = options.validation;
		this.label = options.label || NLS_DEFAULT_LABEL;

		const appendPreserveCaseLabel = options.appendPreserveCaseLabel || '';
		const history = options.history || new Set([]);
		const flexibleHeight = !!options.flexibleHeight;
		const flexibleWidth = !!options.flexibleWidth;
		const flexibleMaxHeight = options.flexibleMaxHeight;

		this.domNode = document.createElement('div');
		this.domNode.classList.add('monaco-findInput');

		this.inputBox = this._register(new HistoryInputBox(this.domNode, this.contextViewProvider, {
			ariaLabel: this.label || '',
			placeholder: this.placeholder || '',
			validationOptions: {
				validation: this.validation
			},
			history,
			showHistoryHint: options.showHistoryHint,
			flexibleHeight,
			flexibleWidth,
			flexibleMaxHeight,
			inputBoxStyles: options.inputBoxStyles
		}));

		this.preserveCase = this._register(new PreserveCaseToggle({
			appendTitle: appendPreserveCaseLabel,
			isChecked: false,
			hoverLifecycleOptions: options.hoverLifecycleOptions,
			...options.toggleStyles
		}));
		this._register(this.preserveCase.onChange(viaKeyboard => {
			this._onDidOptionChange.fire(viaKeyboard);
			if (!viaKeyboard && this.fixFocusOnOptionClickEnabled) {
				this.inputBox.focus();
			}
			this.validate();
		}));
		this._register(this.preserveCase.onKeyDown(e => {
			this._onPreserveCaseKeyDown.fire(e);
		}));

		if (this._showOptionButtons) {
			this.cachedOptionsWidth = this.preserveCase.width();
		} else {
			this.cachedOptionsWidth = 0;
		}

		// Arrow-Key support to navigate between options
		const indexes = [this.preserveCase.domNode];
		this.onkeydown(this.domNode, (event: IKeyboardEvent) => {
			if (event.equals(KeyCode.LeftArrow) || event.equals(KeyCode.RightArrow) || event.equals(KeyCode.Escape)) {
				const index = indexes.indexOf(<HTMLElement>this.domNode.ownerDocument.activeElement);
				if (index >= 0) {
					let newIndex: number = -1;
					if (event.equals(KeyCode.RightArrow)) {
						newIndex = (index + 1) % indexes.length;
					} else if (event.equals(KeyCode.LeftArrow)) {
						if (index === 0) {
							newIndex = indexes.length - 1;
						} else {
							newIndex = index - 1;
						}
					}

					if (event.equals(KeyCode.Escape)) {
						indexes[index].blur();
						this.inputBox.focus();
					} else if (newIndex >= 0) {
						indexes[newIndex].focus();
					}

					dom.EventHelper.stop(event, true);
				}
			}
		});


		const controls = document.createElement('div');
		controls.className = 'controls';
		controls.style.display = this._showOptionButtons ? 'block' : 'none';
		controls.appendChild(this.preserveCase.domNode);

		this.domNode.appendChild(controls);

		parent?.appendChild(this.domNode);

		this.onkeydown(this.inputBox.inputElement, (e) => this._onKeyDown.fire(e));
		this.onkeyup(this.inputBox.inputElement, (e) => this._onKeyUp.fire(e));
		this.oninput(this.inputBox.inputElement, (e) => this._onInput.fire());
		this.onmousedown(this.inputBox.inputElement, (e) => this._onMouseDown.fire(e));
	}

	public enable(): void {
		this.domNode.classList.remove('disabled');
		this.inputBox.enable();
		this.preserveCase.enable();
	}

	public disable(): void {
		this.domNode.classList.add('disabled');
		this.inputBox.disable();
		this.preserveCase.disable();
	}

	public setFocusInputOnOptionClick(value: boolean): void {
		this.fixFocusOnOptionClickEnabled = value;
	}

	public setEnabled(enabled: boolean): void {
		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	public clear(): void {
		this.clearValidation();
		this.setValue('');
		this.focus();
	}

	public getValue(): string {
		return this.inputBox.value;
	}

	public setValue(value: string): void {
		if (this.inputBox.value !== value) {
			this.inputBox.value = value;
		}
	}

	public onSearchSubmit(): void {
		this.inputBox.addToHistory();
	}

	protected applyStyles(): void {
	}

	public select(): void {
		this.inputBox.select();
	}

	public focus(): void {
		this.inputBox.focus();
	}

	public getPreserveCase(): boolean {
		return this.preserveCase.checked;
	}

	public setPreserveCase(value: boolean): void {
		this.preserveCase.checked = value;
	}

	public focusOnPreserve(): void {
		this.preserveCase.focus();
	}

	private _lastHighlightFindOptions: number = 0;
	public highlightFindOptions(): void {
		this.domNode.classList.remove('highlight-' + (this._lastHighlightFindOptions));
		this._lastHighlightFindOptions = 1 - this._lastHighlightFindOptions;
		this.domNode.classList.add('highlight-' + (this._lastHighlightFindOptions));
	}

	public validate(): void {
		this.inputBox?.validate();
	}

	public showMessage(message: InputBoxMessage): void {
		this.inputBox?.showMessage(message);
	}

	public clearMessage(): void {
		this.inputBox?.hideMessage();
	}

	private clearValidation(): void {
		this.inputBox?.hideMessage();
	}

	public set width(newWidth: number) {
		this.inputBox.paddingRight = this.cachedOptionsWidth;
		this.domNode.style.width = newWidth + 'px';
	}

	public override dispose(): void {
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

````

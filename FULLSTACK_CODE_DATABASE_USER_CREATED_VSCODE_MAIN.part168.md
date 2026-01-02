---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 168
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 168 of 552)

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

---[FILE: src/vs/base/browser/ui/menu/menu.ts]---
Location: vscode-main/src/vs/base/browser/ui/menu/menu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFirefox } from '../../browser.js';
import { EventType as TouchEventType, Gesture } from '../../touch.js';
import { $, addDisposableListener, append, clearNode, Dimension, EventHelper, EventLike, EventType, getActiveElement, getWindow, IDomNodePagePosition, isAncestor, isInShadowDOM } from '../../dom.js';
import { createStyleSheet } from '../../domStylesheets.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { StandardMouseEvent } from '../../mouseEvent.js';
import { ActionBar, ActionsOrientation, IActionViewItemProvider } from '../actionbar/actionbar.js';
import { ActionViewItem, BaseActionViewItem, IActionViewItemOptions } from '../actionbar/actionViewItems.js';
import { AnchorAlignment, layout, LayoutAnchorPosition } from '../contextview/contextview.js';
import { DomScrollableElement } from '../scrollbar/scrollableElement.js';
import { EmptySubmenuAction, IAction, IActionRunner, Separator, SubmenuAction } from '../../../common/actions.js';
import { RunOnceScheduler } from '../../../common/async.js';
import { Codicon } from '../../../common/codicons.js';
import { getCodiconFontCharacters } from '../../../common/codiconsUtil.js';
import { ThemeIcon } from '../../../common/themables.js';
import { Event } from '../../../common/event.js';
import { stripIcons } from '../../../common/iconLabels.js';
import { KeyCode } from '../../../common/keyCodes.js';
import { ResolvedKeybinding } from '../../../common/keybindings.js';
import { DisposableStore } from '../../../common/lifecycle.js';
import { isLinux, isMacintosh } from '../../../common/platform.js';
import { ScrollbarVisibility, ScrollEvent } from '../../../common/scrollable.js';
import * as strings from '../../../common/strings.js';

export const MENU_MNEMONIC_REGEX = /\(&([^\s&])\)|(^|[^&])&([^\s&])/;
export const MENU_ESCAPED_MNEMONIC_REGEX = /(&amp;)?(&amp;)([^\s&])/g;



export enum HorizontalDirection {
	Right,
	Left
}

export enum VerticalDirection {
	Above,
	Below
}

export interface IMenuDirection {
	horizontal: HorizontalDirection;
	vertical: VerticalDirection;
}

export interface IMenuOptions {
	context?: unknown;
	actionViewItemProvider?: IActionViewItemProvider;
	actionRunner?: IActionRunner;
	getKeyBinding?: (action: IAction) => ResolvedKeybinding | undefined;
	ariaLabel?: string;
	enableMnemonics?: boolean;
	anchorAlignment?: AnchorAlignment;
	expandDirection?: IMenuDirection;
	useEventAsContext?: boolean;
	submenuIds?: Set<string>;
}

export interface IMenuStyles {
	shadowColor: string | undefined;
	borderColor: string | undefined;
	foregroundColor: string | undefined;
	backgroundColor: string | undefined;
	selectionForegroundColor: string | undefined;
	selectionBackgroundColor: string | undefined;
	selectionBorderColor: string | undefined;
	separatorColor: string | undefined;
	scrollbarShadow: string | undefined;
	scrollbarSliderBackground: string | undefined;
	scrollbarSliderHoverBackground: string | undefined;
	scrollbarSliderActiveBackground: string | undefined;
}

export const unthemedMenuStyles: IMenuStyles = {
	shadowColor: undefined,
	borderColor: undefined,
	foregroundColor: undefined,
	backgroundColor: undefined,
	selectionForegroundColor: undefined,
	selectionBackgroundColor: undefined,
	selectionBorderColor: undefined,
	separatorColor: undefined,
	scrollbarShadow: undefined,
	scrollbarSliderBackground: undefined,
	scrollbarSliderHoverBackground: undefined,
	scrollbarSliderActiveBackground: undefined
};

interface ISubMenuData {
	parent: Menu;
	submenu?: Menu;
}

export class Menu extends ActionBar {
	private mnemonics: Map<string, Array<BaseMenuActionViewItem>>;
	private scrollableElement: DomScrollableElement;
	private menuElement: HTMLElement;
	static globalStyleSheet: HTMLStyleElement;
	protected styleSheet: HTMLStyleElement | undefined;

	constructor(container: HTMLElement, actions: ReadonlyArray<IAction>, options: IMenuOptions, private readonly menuStyles: IMenuStyles) {
		container.classList.add('monaco-menu-container');
		container.setAttribute('role', 'presentation');
		const menuElement = document.createElement('div');
		menuElement.classList.add('monaco-menu');
		menuElement.setAttribute('role', 'presentation');

		super(menuElement, {
			orientation: ActionsOrientation.VERTICAL,
			actionViewItemProvider: action => this.doGetActionViewItem(action, options, parentData),
			context: options.context,
			actionRunner: options.actionRunner,
			ariaLabel: options.ariaLabel,
			ariaRole: 'menu',
			focusOnlyEnabledItems: true,
			triggerKeys: { keys: [KeyCode.Enter, ...(isMacintosh || isLinux ? [KeyCode.Space] : [])], keyDown: true }
		});

		this.menuElement = menuElement;

		this.actionsList.tabIndex = 0;

		this.initializeOrUpdateStyleSheet(container, menuStyles);

		this._register(Gesture.addTarget(menuElement));

		this._register(addDisposableListener(menuElement, EventType.KEY_DOWN, (e) => {
			const event = new StandardKeyboardEvent(e);

			// Stop tab navigation of menus
			if (event.equals(KeyCode.Tab)) {
				e.preventDefault();
			}
		}));

		if (options.enableMnemonics) {
			this._register(addDisposableListener(menuElement, EventType.KEY_DOWN, (e) => {
				const key = e.key.toLocaleLowerCase();
				const actions = this.mnemonics.get(key);
				if (actions !== undefined) {
					EventHelper.stop(e, true);

					if (actions.length === 1) {
						if (actions[0] instanceof SubmenuMenuActionViewItem && actions[0].container) {
							this.focusItemByElement(actions[0].container);
						}

						actions[0].onClick(e);
					}

					if (actions.length > 1) {
						const action = actions.shift();
						if (action && action.container) {
							this.focusItemByElement(action.container);
							actions.push(action);
						}

						this.mnemonics.set(key, actions);
					}
				}
			}));
		}

		if (isLinux) {
			this._register(addDisposableListener(menuElement, EventType.KEY_DOWN, e => {
				const event = new StandardKeyboardEvent(e);

				if (event.equals(KeyCode.Home) || event.equals(KeyCode.PageUp)) {
					this.focusedItem = this.viewItems.length - 1;
					this.focusNext();
					EventHelper.stop(e, true);
				} else if (event.equals(KeyCode.End) || event.equals(KeyCode.PageDown)) {
					this.focusedItem = 0;
					this.focusPrevious();
					EventHelper.stop(e, true);
				}
			}));
		}

		this._register(addDisposableListener(this.domNode, EventType.MOUSE_OUT, e => {
			const relatedTarget = e.relatedTarget as HTMLElement;
			if (!isAncestor(relatedTarget, this.domNode)) {
				this.focusedItem = undefined;
				this.updateFocus();
				e.stopPropagation();
			}
		}));

		this._register(addDisposableListener(this.actionsList, EventType.MOUSE_OVER, e => {
			let target = e.target as HTMLElement;
			if (!target || !isAncestor(target, this.actionsList) || target === this.actionsList) {
				return;
			}

			while (target.parentElement !== this.actionsList && target.parentElement !== null) {
				target = target.parentElement;
			}

			if (target.classList.contains('action-item')) {
				const lastFocusedItem = this.focusedItem;
				this.setFocusedItem(target);

				if (lastFocusedItem !== this.focusedItem) {
					this.updateFocus();
				}
			}
		}));

		// Support touch on actions list to focus items (needed for submenus)
		this._register(Gesture.addTarget(this.actionsList));
		this._register(addDisposableListener(this.actionsList, TouchEventType.Tap, e => {
			let target = e.initialTarget as HTMLElement;
			if (!target || !isAncestor(target, this.actionsList) || target === this.actionsList) {
				return;
			}

			while (target.parentElement !== this.actionsList && target.parentElement !== null) {
				target = target.parentElement;
			}

			if (target.classList.contains('action-item')) {
				const lastFocusedItem = this.focusedItem;
				this.setFocusedItem(target);

				if (lastFocusedItem !== this.focusedItem) {
					this.updateFocus();
				}
			}
		}));


		const parentData: ISubMenuData = {
			parent: this
		};

		this.mnemonics = new Map<string, Array<BaseMenuActionViewItem>>();

		// Scroll Logic
		this.scrollableElement = this._register(new DomScrollableElement(menuElement, {
			alwaysConsumeMouseWheel: true,
			horizontal: ScrollbarVisibility.Hidden,
			vertical: ScrollbarVisibility.Visible,
			verticalScrollbarSize: 7,
			handleMouseWheel: true,
			useShadows: true
		}));

		const scrollElement = this.scrollableElement.getDomNode();
		scrollElement.style.position = '';

		this.styleScrollElement(scrollElement, menuStyles);

		// Support scroll on menu drag
		this._register(addDisposableListener(menuElement, TouchEventType.Change, e => {
			EventHelper.stop(e, true);

			const scrollTop = this.scrollableElement.getScrollPosition().scrollTop;
			this.scrollableElement.setScrollPosition({ scrollTop: scrollTop - e.translationY });
		}));

		this._register(addDisposableListener(scrollElement, EventType.MOUSE_UP, e => {
			// Absorb clicks in menu dead space https://github.com/microsoft/vscode/issues/63575
			// We do this on the scroll element so the scroll bar doesn't dismiss the menu either
			e.preventDefault();
		}));

		const window = getWindow(container);
		menuElement.style.maxHeight = `${Math.max(10, window.innerHeight - container.getBoundingClientRect().top - 35)}px`;

		actions = actions.filter((a, idx) => {
			if (options.submenuIds?.has(a.id)) {
				console.warn(`Found submenu cycle: ${a.id}`);
				return false;
			}

			// Filter out consecutive or useless separators
			if (a instanceof Separator) {
				if (idx === actions.length - 1 || idx === 0) {
					return false;
				}

				const prevAction = actions[idx - 1];
				if (prevAction instanceof Separator) {
					return false;
				}
			}

			return true;
		});

		this.push(actions, { icon: true, label: true, isMenu: true });

		container.appendChild(this.scrollableElement.getDomNode());
		this.scrollableElement.scanDomNode();

		this.viewItems.filter(item => !(item instanceof MenuSeparatorActionViewItem)).forEach((item, index, array) => {
			(item as BaseMenuActionViewItem).updatePositionInSet(index + 1, array.length);
		});
	}

	private initializeOrUpdateStyleSheet(container: HTMLElement, style: IMenuStyles): void {
		if (!this.styleSheet) {
			if (isInShadowDOM(container)) {
				this.styleSheet = createStyleSheet(container);
			} else {
				if (!Menu.globalStyleSheet) {
					Menu.globalStyleSheet = createStyleSheet();
				}
				this.styleSheet = Menu.globalStyleSheet;
			}
		}
		this.styleSheet.textContent = getMenuWidgetCSS(style, isInShadowDOM(container));
	}

	private styleScrollElement(scrollElement: HTMLElement, style: IMenuStyles): void {

		const fgColor = style.foregroundColor ?? '';
		const bgColor = style.backgroundColor ?? '';
		const border = style.borderColor ? `1px solid ${style.borderColor}` : '';
		const borderRadius = '5px';
		const shadow = style.shadowColor ? `0 2px 8px ${style.shadowColor}` : '';

		scrollElement.style.outline = border;
		scrollElement.style.borderRadius = borderRadius;
		scrollElement.style.color = fgColor;
		scrollElement.style.backgroundColor = bgColor;
		scrollElement.style.boxShadow = shadow;
	}

	override getContainer(): HTMLElement {
		return this.scrollableElement.getDomNode();
	}

	get onScroll(): Event<ScrollEvent> {
		return this.scrollableElement.onScroll;
	}

	get scrollOffset(): number {
		return this.menuElement.scrollTop;
	}

	trigger(index: number): void {
		if (index <= this.viewItems.length && index >= 0) {
			const item = this.viewItems[index];
			if (item instanceof SubmenuMenuActionViewItem) {
				super.focus(index);
				item.open(true);
			} else if (item instanceof BaseMenuActionViewItem) {
				super.run(item._action, item._context);
			} else {
				return;
			}
		}
	}

	private focusItemByElement(element: HTMLElement) {
		const lastFocusedItem = this.focusedItem;
		this.setFocusedItem(element);

		if (lastFocusedItem !== this.focusedItem) {
			this.updateFocus();
		}
	}

	private setFocusedItem(element: HTMLElement): void {
		for (let i = 0; i < this.actionsList.children.length; i++) {
			const elem = this.actionsList.children[i];
			if (element === elem) {
				this.focusedItem = i;
				break;
			}
		}
	}

	protected override updateFocus(fromRight?: boolean): void {
		super.updateFocus(fromRight, true, true);

		if (typeof this.focusedItem !== 'undefined') {
			// Workaround for #80047 caused by an issue in chromium
			// https://bugs.chromium.org/p/chromium/issues/detail?id=414283
			// When that's fixed, just call this.scrollableElement.scanDomNode()
			this.scrollableElement.setScrollPosition({
				scrollTop: Math.round(this.menuElement.scrollTop)
			});
		}
	}

	private doGetActionViewItem(action: IAction, options: IMenuOptions, parentData: ISubMenuData): BaseActionViewItem {
		if (action instanceof Separator) {
			return new MenuSeparatorActionViewItem(options.context, action, { icon: true }, this.menuStyles);
		} else if (action instanceof SubmenuAction) {
			const menuActionViewItem = new SubmenuMenuActionViewItem(action, action.actions, parentData, { ...options, submenuIds: new Set([...(options.submenuIds || []), action.id]) }, this.menuStyles);

			if (options.enableMnemonics) {
				const mnemonic = menuActionViewItem.getMnemonic();
				if (mnemonic && menuActionViewItem.isEnabled()) {
					const actionViewItems = this.mnemonics.get(mnemonic);
					if (actionViewItems !== undefined) {
						actionViewItems.push(menuActionViewItem);
					} else {
						this.mnemonics.set(mnemonic, [menuActionViewItem]);
					}
				}
			}

			return menuActionViewItem;
		} else {
			const keybindingLabel = options.getKeyBinding?.(action)?.getLabel();
			const menuItemOptions: IMenuItemOptions = {
				enableMnemonics: options.enableMnemonics,
				useEventAsContext: options.useEventAsContext,
				keybinding: keybindingLabel,
			};

			const menuActionViewItem = new BaseMenuActionViewItem(options.context, action, menuItemOptions, this.menuStyles);

			if (options.enableMnemonics) {
				const mnemonic = menuActionViewItem.getMnemonic();
				if (mnemonic && menuActionViewItem.isEnabled()) {
					const actionViewItems = this.mnemonics.get(mnemonic);
					if (actionViewItems !== undefined) {
						actionViewItems.push(menuActionViewItem);
					} else {
						this.mnemonics.set(mnemonic, [menuActionViewItem]);
					}
				}
			}

			return menuActionViewItem;
		}
	}
}

interface IMenuItemOptions extends IActionViewItemOptions {
	readonly enableMnemonics?: boolean;
}

class BaseMenuActionViewItem extends BaseActionViewItem {

	public container: HTMLElement | undefined;

	protected override options: IMenuItemOptions;
	protected item: HTMLElement | undefined;

	private runOnceToEnableMouseUp: RunOnceScheduler;
	private label: HTMLElement | undefined;
	private check: HTMLElement | undefined;
	private mnemonic: string | undefined;
	private cssClass: string;

	constructor(ctx: unknown, action: IAction, options: IMenuItemOptions, protected readonly menuStyle: IMenuStyles) {
		options = {
			...options,
			isMenu: true,
			icon: options.icon !== undefined ? options.icon : false,
			label: options.label !== undefined ? options.label : true,
		};
		super(action, action, options);

		this.options = options;
		this.cssClass = '';

		// Set mnemonic
		if (this.options.label && options.enableMnemonics) {
			const label = this.action.label;
			if (label) {
				const matches = MENU_MNEMONIC_REGEX.exec(label);
				if (matches) {
					this.mnemonic = (!!matches[1] ? matches[1] : matches[3]).toLocaleLowerCase();
				}
			}
		}

		// Add mouse up listener later to avoid accidental clicks
		this.runOnceToEnableMouseUp = new RunOnceScheduler(() => {
			if (!this.element) {
				return;
			}

			this._register(addDisposableListener(this.element, EventType.MOUSE_UP, e => {
				// removed default prevention as it conflicts
				// with BaseActionViewItem #101537
				// add back if issues arise and link new issue
				EventHelper.stop(e, true);

				// See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Interact_with_the_clipboard
				// > Writing to the clipboard
				// > You can use the "cut" and "copy" commands without any special
				// permission if you are using them in a short-lived event handler
				// for a user action (for example, a click handler).

				// => to get the Copy and Paste context menu actions working on Firefox,
				// there should be no timeout here
				if (isFirefox) {
					const mouseEvent = new StandardMouseEvent(getWindow(this.element), e);

					// Allowing right click to trigger the event causes the issue described below,
					// but since the solution below does not work in FF, we must disable right click
					if (mouseEvent.rightButton) {
						return;
					}

					this.onClick(e);
				}

				// In all other cases, set timeout to allow context menu cancellation to trigger
				// otherwise the action will destroy the menu and a second context menu
				// will still trigger for right click.
				else {
					setTimeout(() => {
						this.onClick(e);
					}, 0);
				}
			}));

			this._register(addDisposableListener(this.element, EventType.CONTEXT_MENU, e => {
				EventHelper.stop(e, true);
			}));
		}, 100);

		this._register(this.runOnceToEnableMouseUp);
	}

	override render(container: HTMLElement): void {
		super.render(container);

		if (!this.element) {
			return;
		}

		this.container = container;

		this.item = append(this.element, $('a.action-menu-item'));
		if (this._action.id === Separator.ID) {
			// A separator is a presentation item
			this.item.setAttribute('role', 'presentation');
		} else {
			this.item.setAttribute('role', 'menuitem');
			if (this.mnemonic) {
				this.item.setAttribute('aria-keyshortcuts', `${this.mnemonic}`);
			}
		}

		this.check = append(this.item, $('span.menu-item-check' + ThemeIcon.asCSSSelector(Codicon.menuSelection)));
		this.check.setAttribute('role', 'none');

		this.label = append(this.item, $('span.action-label'));

		if (this.options.label && this.options.keybinding) {
			append(this.item, $('span.keybinding')).textContent = this.options.keybinding;
		}

		// Adds mouse up listener to actually run the action
		this.runOnceToEnableMouseUp.schedule();

		this.updateClass();
		this.updateLabel();
		this.updateTooltip();
		this.updateEnabled();
		this.updateChecked();

		this.applyStyle();
	}

	override blur(): void {
		super.blur();
		this.applyStyle();
	}

	override focus(): void {
		super.focus();

		this.item?.focus();

		this.applyStyle();
	}

	updatePositionInSet(pos: number, setSize: number): void {
		if (this.item) {
			this.item.setAttribute('aria-posinset', `${pos}`);
			this.item.setAttribute('aria-setsize', `${setSize}`);
		}
	}

	protected override updateLabel(): void {
		if (!this.label) {
			return;
		}

		if (this.options.label) {
			clearNode(this.label);

			let label = stripIcons(this.action.label);
			if (label) {
				const cleanLabel = cleanMnemonic(label);
				if (!this.options.enableMnemonics) {
					label = cleanLabel;
				}

				this.label.setAttribute('aria-label', cleanLabel.replace(/&&/g, '&'));

				const matches = MENU_MNEMONIC_REGEX.exec(label);

				if (matches) {
					label = strings.escape(label);

					// This is global, reset it
					MENU_ESCAPED_MNEMONIC_REGEX.lastIndex = 0;
					let escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);

					// We can't use negative lookbehind so if we match our negative and skip
					while (escMatch && escMatch[1]) {
						escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);
					}

					const replaceDoubleEscapes = (str: string) => str.replace(/&amp;&amp;/g, '&amp;');

					if (escMatch) {
						this.label.append(
							strings.ltrim(replaceDoubleEscapes(label.substr(0, escMatch.index)), ' '),
							$('u', { 'aria-hidden': 'true' },
								escMatch[3]),
							strings.rtrim(replaceDoubleEscapes(label.substr(escMatch.index + escMatch[0].length)), ' '));
					} else {
						this.label.textContent = replaceDoubleEscapes(label).trim();
					}

					this.item?.setAttribute('aria-keyshortcuts', (!!matches[1] ? matches[1] : matches[3]).toLocaleLowerCase());
				} else {
					this.label.textContent = label.replace(/&&/g, '&').trim();
				}
			}
		}
	}

	protected override updateTooltip(): void {
		// menus should function like native menus and they do not have tooltips
	}

	protected override updateClass(): void {
		if (this.cssClass && this.item) {
			this.item.classList.remove(...this.cssClass.split(' '));
		}
		if (this.options.icon && this.label) {
			this.cssClass = this.action.class || '';
			this.label.classList.add('icon');
			if (this.cssClass) {
				this.label.classList.add(...this.cssClass.split(' '));
			}
			this.updateEnabled();
		} else if (this.label) {
			this.label.classList.remove('icon');
		}
	}

	protected override updateEnabled(): void {
		if (this.action.enabled) {
			if (this.element) {
				this.element.classList.remove('disabled');
				this.element.removeAttribute('aria-disabled');
			}

			if (this.item) {
				this.item.classList.remove('disabled');
				this.item.removeAttribute('aria-disabled');
				this.item.tabIndex = 0;
			}
		} else {
			if (this.element) {
				this.element.classList.add('disabled');
				this.element.setAttribute('aria-disabled', 'true');
			}

			if (this.item) {
				this.item.classList.add('disabled');
				this.item.setAttribute('aria-disabled', 'true');
			}
		}
	}

	protected override updateChecked(): void {
		if (!this.item) {
			return;
		}

		const checked = this.action.checked;
		this.item.classList.toggle('checked', !!checked);
		if (checked !== undefined) {
			this.item.setAttribute('role', 'menuitemcheckbox');
			this.item.setAttribute('aria-checked', checked ? 'true' : 'false');
		} else {
			this.item.setAttribute('role', 'menuitem');
			this.item.setAttribute('aria-checked', '');
		}
	}

	getMnemonic(): string | undefined {
		return this.mnemonic;
	}

	protected applyStyle(): void {
		const isSelected = this.element && this.element.classList.contains('focused');
		const fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
		const bgColor = isSelected && this.menuStyle.selectionBackgroundColor ? this.menuStyle.selectionBackgroundColor : undefined;
		const outline = isSelected && this.menuStyle.selectionBorderColor ? `1px solid ${this.menuStyle.selectionBorderColor}` : '';
		const outlineOffset = isSelected && this.menuStyle.selectionBorderColor ? `-1px` : '';

		if (this.item) {
			this.item.style.color = fgColor ?? '';
			this.item.style.backgroundColor = bgColor ?? '';
			this.item.style.outline = outline;
			this.item.style.outlineOffset = outlineOffset;
		}

		if (this.check) {
			this.check.style.color = fgColor ?? '';
		}
	}
}

class SubmenuMenuActionViewItem extends BaseMenuActionViewItem {
	private mysubmenu: Menu | null = null;
	private submenuContainer: HTMLElement | undefined;
	private submenuIndicator: HTMLElement | undefined;
	private readonly submenuDisposables = this._register(new DisposableStore());
	private mouseOver: boolean = false;
	private showScheduler: RunOnceScheduler;
	private hideScheduler: RunOnceScheduler;
	private expandDirection: IMenuDirection;

	constructor(
		action: IAction,
		private submenuActions: ReadonlyArray<IAction>,
		private parentData: ISubMenuData,
		private submenuOptions: IMenuOptions,
		menuStyles: IMenuStyles
	) {
		super(action, action, submenuOptions, menuStyles);

		this.expandDirection = submenuOptions && submenuOptions.expandDirection !== undefined ? submenuOptions.expandDirection : { horizontal: HorizontalDirection.Right, vertical: VerticalDirection.Below };

		this.showScheduler = new RunOnceScheduler(() => {
			if (this.mouseOver) {
				this.cleanupExistingSubmenu(false);
				this.createSubmenu(false);
			}
		}, 250);

		this.hideScheduler = new RunOnceScheduler(() => {
			if (this.element && (!isAncestor(getActiveElement(), this.element) && this.parentData.submenu === this.mysubmenu)) {
				this.parentData.parent.focus(false);
				this.cleanupExistingSubmenu(true);
			}
		}, 750);
	}

	override render(container: HTMLElement): void {
		super.render(container);

		if (!this.element) {
			return;
		}

		if (this.item) {
			this.item.classList.add('monaco-submenu-item');
			this.item.tabIndex = 0;
			this.item.setAttribute('aria-haspopup', 'true');
			this.updateAriaExpanded('false');
			this.submenuIndicator = append(this.item, $('span.submenu-indicator' + ThemeIcon.asCSSSelector(Codicon.menuSubmenu)));
			this.submenuIndicator.setAttribute('aria-hidden', 'true');
		}

		this._register(addDisposableListener(this.element, EventType.KEY_UP, e => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.RightArrow) || event.equals(KeyCode.Enter)) {
				EventHelper.stop(e, true);

				this.createSubmenu(true);
			}
		}));

		this._register(addDisposableListener(this.element, EventType.KEY_DOWN, e => {
			const event = new StandardKeyboardEvent(e);

			if (getActiveElement() === this.item) {
				if (event.equals(KeyCode.RightArrow) || event.equals(KeyCode.Enter)) {
					EventHelper.stop(e, true);
				}
			}
		}));

		this._register(addDisposableListener(this.element, EventType.MOUSE_OVER, e => {
			if (!this.mouseOver) {
				this.mouseOver = true;

				this.showScheduler.schedule();
			}
		}));

		this._register(addDisposableListener(this.element, EventType.MOUSE_LEAVE, e => {
			this.mouseOver = false;
		}));

		this._register(addDisposableListener(this.element, EventType.FOCUS_OUT, e => {
			if (this.element && !isAncestor(getActiveElement(), this.element)) {
				this.hideScheduler.schedule();
			}
		}));

		this._register(this.parentData.parent.onScroll(() => {
			if (this.parentData.submenu === this.mysubmenu) {
				this.parentData.parent.focus(false);
				this.cleanupExistingSubmenu(true);
			}
		}));
	}

	protected override updateEnabled(): void {
		// override on submenu entry
		// native menus do not observe enablement on sumbenus
		// we mimic that behavior
	}

	open(selectFirst?: boolean): void {
		this.cleanupExistingSubmenu(false);
		this.createSubmenu(selectFirst);
	}

	override onClick(e: EventLike): void {
		// stop clicking from trying to run an action
		EventHelper.stop(e, true);

		this.cleanupExistingSubmenu(false);
		this.createSubmenu(true);
	}

	private cleanupExistingSubmenu(force: boolean): void {
		if (this.parentData.submenu && (force || (this.parentData.submenu !== this.mysubmenu))) {

			// disposal may throw if the submenu has already been removed
			try {
				this.parentData.submenu.dispose();
			} catch { }

			this.parentData.submenu = undefined;
			this.updateAriaExpanded('false');
			if (this.submenuContainer) {
				this.submenuDisposables.clear();
				this.submenuContainer = undefined;
			}
		}
	}

	private calculateSubmenuMenuLayout(windowDimensions: Dimension, submenu: Dimension, entry: IDomNodePagePosition, expandDirection: IMenuDirection): { top: number; left: number } {
		const ret = { top: 0, left: 0 };

		// Start with horizontal
		ret.left = layout(windowDimensions.width, submenu.width, { position: expandDirection.horizontal === HorizontalDirection.Right ? LayoutAnchorPosition.Before : LayoutAnchorPosition.After, offset: entry.left, size: entry.width });

		// We don't have enough room to layout the menu fully, so we are overlapping the menu
		if (ret.left >= entry.left && ret.left < entry.left + entry.width) {
			if (entry.left + 10 + submenu.width <= windowDimensions.width) {
				ret.left = entry.left + 10;
			}

			entry.top += 10;
			entry.height = 0;
		}

		// Now that we have a horizontal position, try layout vertically
		ret.top = layout(windowDimensions.height, submenu.height, { position: LayoutAnchorPosition.Before, offset: entry.top, size: 0 });

		// We didn't have enough room below, but we did above, so we shift down to align the menu
		if (ret.top + submenu.height === entry.top && ret.top + entry.height + submenu.height <= windowDimensions.height) {
			ret.top += entry.height;
		}

		return ret;
	}

	private createSubmenu(selectFirstItem = true): void {
		if (!this.element) {
			return;
		}

		if (!this.parentData.submenu) {
			this.updateAriaExpanded('true');
			this.submenuContainer = append(this.element, $('div.monaco-submenu'));
			this.submenuContainer.classList.add('menubar-menu-items-holder', 'context-view');

			// Set the top value of the menu container before construction
			// This allows the menu constructor to calculate the proper max height
			const computedStyles = getWindow(this.parentData.parent.domNode).getComputedStyle(this.parentData.parent.domNode);
			const paddingTop = parseFloat(computedStyles.paddingTop || '0') || 0;
			this.submenuContainer.style.position = 'fixed';
			this.submenuContainer.style.top = '0';
			this.submenuContainer.style.left = '0';
			// Fix to #263546, for submenu of treeView view/item/context z-index issue - ensure submenu appears above other elements
			this.submenuContainer.style.zIndex = '1';

			this.parentData.submenu = new Menu(this.submenuContainer, this.submenuActions.length ? this.submenuActions : [new EmptySubmenuAction()], this.submenuOptions, this.menuStyle);

			// layout submenu
			const entryBox = this.element.getBoundingClientRect();
			const entryBoxUpdated = {
				top: entryBox.top - paddingTop,
				left: entryBox.left,
				height: entryBox.height + 2 * paddingTop,
				width: entryBox.width
			};

			const viewBox = this.submenuContainer.getBoundingClientRect();

			const window = getWindow(this.element);
			const { top, left } = this.calculateSubmenuMenuLayout(new Dimension(window.innerWidth, window.innerHeight), Dimension.lift(viewBox), entryBoxUpdated, this.expandDirection);
			// subtract offsets caused by transform parent
			this.submenuContainer.style.left = `${left - viewBox.left}px`;
			this.submenuContainer.style.top = `${top - viewBox.top}px`;

			this.submenuDisposables.add(addDisposableListener(this.submenuContainer, EventType.KEY_UP, e => {
				const event = new StandardKeyboardEvent(e);
				if (event.equals(KeyCode.LeftArrow)) {
					EventHelper.stop(e, true);

					this.parentData.parent.focus();

					this.cleanupExistingSubmenu(true);
				}
			}));

			this.submenuDisposables.add(addDisposableListener(this.submenuContainer, EventType.KEY_DOWN, e => {
				const event = new StandardKeyboardEvent(e);
				if (event.equals(KeyCode.LeftArrow)) {
					EventHelper.stop(e, true);
				}
			}));


			this.submenuDisposables.add(this.parentData.submenu.onDidCancel(() => {
				this.parentData.parent.focus();

				this.cleanupExistingSubmenu(true);
			}));

			this.parentData.submenu.focus(selectFirstItem);

			this.mysubmenu = this.parentData.submenu;
		} else {
			this.parentData.submenu.focus(false);
		}
	}

	private updateAriaExpanded(value: string): void {
		if (this.item) {
			this.item?.setAttribute('aria-expanded', value);
		}
	}

	protected override applyStyle(): void {
		super.applyStyle();

		const isSelected = this.element && this.element.classList.contains('focused');
		const fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;

		if (this.submenuIndicator) {
			this.submenuIndicator.style.color = fgColor ?? '';
		}
	}

	override dispose(): void {
		super.dispose();

		this.hideScheduler.dispose();

		if (this.mysubmenu) {
			this.mysubmenu.dispose();
			this.mysubmenu = null;
		}

		if (this.submenuContainer) {
			this.submenuContainer = undefined;
		}
	}
}

class MenuSeparatorActionViewItem extends ActionViewItem {
	constructor(context: unknown, action: IAction, options: IActionViewItemOptions, private readonly menuStyles: IMenuStyles) {
		super(context, action, options);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		if (this.label) {
			this.label.style.borderBottomColor = this.menuStyles.separatorColor ? `${this.menuStyles.separatorColor}` : '';
		}
	}
}

export function cleanMnemonic(label: string): string {
	const regex = MENU_MNEMONIC_REGEX;

	const matches = regex.exec(label);
	if (!matches) {
		return label;
	}

	const mnemonicInText = !matches[1];

	return label.replace(regex, mnemonicInText ? '$2$3' : '').trim();
}

export function formatRule(c: ThemeIcon) {
	const fontCharacter = getCodiconFontCharacters()[c.id];
	return `.codicon-${c.id}:before { content: '\\${fontCharacter.toString(16)}'; }`;
}

export function getMenuWidgetCSS(style: IMenuStyles, isForShadowDom: boolean): string {
	let result = /* css */`
.monaco-menu {
	font-size: 13px;
	border-radius: 5px;
	min-width: 160px;
}

${formatRule(Codicon.menuSelection)}
${formatRule(Codicon.menuSubmenu)}

.monaco-menu .monaco-action-bar {
	text-align: right;
	overflow: hidden;
	white-space: nowrap;
}

.monaco-menu .monaco-action-bar .actions-container {
	display: flex;
	margin: 0 auto;
	padding: 0;
	width: 100%;
	justify-content: flex-end;
}

.monaco-menu .monaco-action-bar.vertical .actions-container {
	display: inline-block;
}

.monaco-menu .monaco-action-bar.reverse .actions-container {
	flex-direction: row-reverse;
}

.monaco-menu .monaco-action-bar .action-item {
	cursor: pointer;
	display: inline-block;
	transition: transform 50ms ease;
	position: relative;  /* DO NOT REMOVE - this is the key to preventing the ghosting icon bug in Chrome 42 */
}

.monaco-menu .monaco-action-bar .action-item.disabled {
	cursor: default;
}

.monaco-menu .monaco-action-bar .action-item .icon,
.monaco-menu .monaco-action-bar .action-item .codicon {
	display: inline-block;
}

.monaco-menu .monaco-action-bar .action-item .codicon {
	display: flex;
	align-items: center;
}

.monaco-menu .monaco-action-bar .action-label {
	font-size: 11px;
	margin-right: 4px;
}

.monaco-menu .monaco-action-bar .action-item.disabled .action-label,
.monaco-menu .monaco-action-bar .action-item.disabled .action-label:hover {
	color: var(--vscode-disabledForeground);
}

/* Vertical actions */

.monaco-menu .monaco-action-bar.vertical {
	text-align: left;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	display: block;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	display: block;
	border-bottom: 1px solid var(--vscode-menu-separatorBackground);
	padding-top: 1px;
	padding: 30px;
}

.monaco-menu .secondary-actions .monaco-action-bar .action-label {
	margin-left: 6px;
}

/* Action Items */
.monaco-menu .monaco-action-bar .action-item.select-container {
	overflow: hidden; /* somehow the dropdown overflows its container, we prevent it here to not push */
	flex: 1;
	max-width: 170px;
	min-width: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}

.monaco-menu .monaco-action-bar.vertical {
	margin-left: 0;
	overflow: visible;
}

.monaco-menu .monaco-action-bar.vertical .actions-container {
	display: block;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	padding: 0;
	transform: none;
	display: flex;
}

.monaco-menu .monaco-action-bar.vertical .action-item.active {
	transform: none;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item {
	flex: 1 1 auto;
	display: flex;
	height: 2em;
	align-items: center;
	position: relative;
	margin: 0 4px;
	border-radius: 4px;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item:hover .keybinding,
.monaco-menu .monaco-action-bar.vertical .action-menu-item:focus .keybinding {
	opacity: unset;
}

.monaco-menu .monaco-action-bar.vertical .action-label {
	flex: 1 1 auto;
	text-decoration: none;
	padding: 0 1em;
	background: none;
	font-size: 12px;
	line-height: 1;
}

.monaco-menu .monaco-action-bar.vertical .keybinding,
.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	display: inline-block;
	flex: 2 1 auto;
	padding: 0 1em;
	text-align: right;
	font-size: 12px;
	line-height: 1;
	opacity: 0.7;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon {
	font-size: 16px !important;
	display: flex;
	align-items: center;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon::before {
	margin-left: auto;
	margin-right: -20px;
}

.monaco-menu .monaco-action-bar.vertical .action-item.disabled .keybinding,
.monaco-menu .monaco-action-bar.vertical .action-item.disabled .submenu-indicator {
	opacity: 0.4;
}

.monaco-menu .monaco-action-bar.vertical .action-label:not(.separator) {
	display: inline-block;
	box-sizing: border-box;
	margin: 0;
}

.monaco-menu .monaco-action-bar.vertical .action-item {
	position: static;
	overflow: visible;
}

.monaco-menu .monaco-action-bar.vertical .action-item .monaco-submenu {
	position: absolute;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	width: 100%;
	height: 0px !important;
	opacity: 1;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator.text {
	padding: 0.7em 1em 0.1em 1em;
	font-weight: bold;
	opacity: 1;
}

.monaco-menu .monaco-action-bar.vertical .action-label:hover {
	color: inherit;
}

.monaco-menu .monaco-action-bar.vertical .menu-item-check {
	position: absolute;
	visibility: hidden;
	width: 1em;
	height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item.checked .menu-item-check {
	visibility: visible;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Context Menu */

.context-view.monaco-menu-container {
	outline: 0;
	border: none;
	animation: fadeIn 0.083s linear;
	-webkit-app-region: no-drag;
}

.context-view.monaco-menu-container :focus,
.context-view.monaco-menu-container .monaco-action-bar.vertical:focus,
.context-view.monaco-menu-container .monaco-action-bar.vertical :focus {
	outline: 0;
}

.hc-black .context-view.monaco-menu-container,
.hc-light .context-view.monaco-menu-container,
:host-context(.hc-black) .context-view.monaco-menu-container,
:host-context(.hc-light) .context-view.monaco-menu-container {
	box-shadow: none;
}

.hc-black .monaco-menu .monaco-action-bar.vertical .action-item.focused,
.hc-light .monaco-menu .monaco-action-bar.vertical .action-item.focused,
:host-context(.hc-black) .monaco-menu .monaco-action-bar.vertical .action-item.focused,
:host-context(.hc-light) .monaco-menu .monaco-action-bar.vertical .action-item.focused {
	background: none;
}

/* Vertical Action Bar Styles */

.monaco-menu .monaco-action-bar.vertical {
	padding: 4px 0;
}

.monaco-menu .monaco-action-bar.vertical .action-menu-item {
	height: 2em;
}

.monaco-menu .monaco-action-bar.vertical .action-label:not(.separator),
.monaco-menu .monaco-action-bar.vertical .keybinding {
	font-size: inherit;
	padding: 0 2em;
	max-height: 100%;
}

.monaco-menu .monaco-action-bar.vertical .menu-item-check {
	font-size: inherit;
	width: 2em;
}

.monaco-menu .monaco-action-bar.vertical .action-label.separator {
	font-size: inherit;
	margin: 5px 0 !important;
	padding: 0;
	border-radius: 0;
}

.linux .monaco-menu .monaco-action-bar.vertical .action-label.separator,
:host-context(.linux) .monaco-menu .monaco-action-bar.vertical .action-label.separator {
	margin-left: 0;
	margin-right: 0;
}

.monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	font-size: 60%;
	padding: 0 1.8em;
}

.linux .monaco-menu .monaco-action-bar.vertical .submenu-indicator,
:host-context(.linux) .monaco-menu .monaco-action-bar.vertical .submenu-indicator {
	height: 100%;
	mask-size: 10px 10px;
	-webkit-mask-size: 10px 10px;
}

.monaco-menu .action-item {
	cursor: default;
}`;

	if (isForShadowDom) {
		// Only define scrollbar styles when used inside shadow dom,
		// otherwise leave their styling to the global workbench styling.
		result += `
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
			}
			.monaco-scrollable-element > .shadow.left {
				display: block;
				top: 3px;
				left: 0;
				height: 100%;
				width: 3px;
			}
			.monaco-scrollable-element > .shadow.top-left-corner {
				display: block;
				top: 0;
				left: 0;
				height: 3px;
				width: 3px;
			}
			/* Fix for https://github.com/microsoft/vscode/issues/103170 */
			.monaco-menu .action-item .monaco-submenu {
				z-index: 1;
			}
		`;

		// Scrollbars
		const scrollbarShadowColor = style.scrollbarShadow;
		if (scrollbarShadowColor) {
			result += `
				.monaco-scrollable-element > .shadow.top {
					box-shadow: ${scrollbarShadowColor} 0 6px 6px -6px inset;
				}

				.monaco-scrollable-element > .shadow.left {
					box-shadow: ${scrollbarShadowColor} 6px 0 6px -6px inset;
				}

				.monaco-scrollable-element > .shadow.top.left {
					box-shadow: ${scrollbarShadowColor} 6px 6px 6px -6px inset;
				}
			`;
		}

		const scrollbarSliderBackgroundColor = style.scrollbarSliderBackground;
		if (scrollbarSliderBackgroundColor) {
			result += `
				.monaco-scrollable-element > .scrollbar > .slider {
					background: ${scrollbarSliderBackgroundColor};
				}
			`;
		}

		const scrollbarSliderHoverBackgroundColor = style.scrollbarSliderHoverBackground;
		if (scrollbarSliderHoverBackgroundColor) {
			result += `
				.monaco-scrollable-element > .scrollbar > .slider:hover {
					background: ${scrollbarSliderHoverBackgroundColor};
				}
			`;
		}

		const scrollbarSliderActiveBackgroundColor = style.scrollbarSliderActiveBackground;
		if (scrollbarSliderActiveBackgroundColor) {
			result += `
				.monaco-scrollable-element > .scrollbar > .slider.active {
					background: ${scrollbarSliderActiveBackgroundColor};
				}
			`;
		}
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/menu/menubar.css]---
Location: vscode-main/src/vs/base/browser/ui/menu/menubar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Menubar styles */

.menubar {
	display: flex;
	flex-shrink: 1;
	box-sizing: border-box;
	height: 100%;
	overflow: hidden;
}

.menubar.overflow-menu-only {
	width: 38px;
}

.fullscreen .menubar:not(.compact) {
	margin: 0px;
	padding: 4px 5px;
}

.menubar > .menubar-menu-button {
	display: flex;
	align-items: center;
	box-sizing: border-box;
	cursor: default;
	-webkit-app-region: no-drag;
	zoom: 1;
	white-space: nowrap;
	outline: 0 !important;
}

.menubar:not(.compact) > .menubar-menu-button:focus .menubar-menu-title {
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
}

.menubar.compact {
	flex-shrink: 0;
	overflow: visible; /* to avoid the compact menu to be repositioned when clicking */
}

.menubar.compact > .menubar-menu-button {
	width: 100%;
	height: 100%;
	padding: 0px;
}

.menubar-menu-title {
	padding: 0px 8px;
	border-radius: 5px;
}

.menubar .menubar-menu-items-holder {
	position: fixed;
	left: 0px;
	opacity: 1;
	z-index: 2000;
}

.menubar.compact .menubar-menu-items-holder {
	position: fixed;
}

.menubar .menubar-menu-items-holder.monaco-menu-container {
	outline: 0;
	border: none;
}

.menubar .menubar-menu-items-holder.monaco-menu-container :focus {
	outline: 0;
}

.menubar .toolbar-toggle-more {
	width: 22px;
	height: 22px;
	padding: 0 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	vertical-align: sub;
}

.menubar.compact .toolbar-toggle-more {
	position: relative;
	left: 0px;
	top: 0px;
	cursor: pointer;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.menubar:not(.compact) .menubar-menu-button:first-child .toolbar-toggle-more::before,
.menubar.compact .toolbar-toggle-more::before {
	content: var(--vscode-icon-menu-content) !important;
	font-family: var(--vscode-icon-menu-font-family) !important;
}

/* Match behavior of outline for activity bar icons */
.menubar.compact > .menubar-menu-button.open .menubar-menu-title,
.menubar.compact > .menubar-menu-button:focus .menubar-menu-title,
.menubar.compact > .menubar-menu-button:hover .menubar-menu-title{
	outline-width: 1px !important;
	outline-offset: -8px !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/menu/menubar.ts]---
Location: vscode-main/src/vs/base/browser/ui/menu/menubar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as browser from '../../browser.js';
import * as DOM from '../../dom.js';
import { StandardKeyboardEvent } from '../../keyboardEvent.js';
import { StandardMouseEvent } from '../../mouseEvent.js';
import { EventType, Gesture, GestureEvent } from '../../touch.js';
import { cleanMnemonic, HorizontalDirection, IMenuDirection, IMenuOptions, IMenuStyles, Menu, MENU_ESCAPED_MNEMONIC_REGEX, MENU_MNEMONIC_REGEX, VerticalDirection } from './menu.js';
import { ActionRunner, IAction, IActionRunner, Separator, SubmenuAction } from '../../../common/actions.js';
import { asArray } from '../../../common/arrays.js';
import { RunOnceScheduler } from '../../../common/async.js';
import { Codicon } from '../../../common/codicons.js';
import { ThemeIcon } from '../../../common/themables.js';
import { Emitter, Event } from '../../../common/event.js';
import { KeyCode, KeyMod, ScanCode, ScanCodeUtils } from '../../../common/keyCodes.js';
import { ResolvedKeybinding } from '../../../common/keybindings.js';
import { Disposable, DisposableStore, dispose, IDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import * as strings from '../../../common/strings.js';
import './menubar.css';
import * as nls from '../../../../nls.js';
import { mainWindow } from '../../window.js';

const $ = DOM.$;

export interface IMenuBarOptions {
	enableMnemonics?: boolean;
	disableAltFocus?: boolean;
	visibility?: string;
	getKeybinding?: (action: IAction) => ResolvedKeybinding | undefined;
	alwaysOnMnemonics?: boolean;
	compactMode?: IMenuDirection;
	actionRunner?: IActionRunner;
	getCompactMenuActions?: () => IAction[];
}

export interface MenuBarMenu {
	actions: IAction[];
	label: string;
}

interface MenuBarMenuWithElements extends MenuBarMenu {
	titleElement?: HTMLElement;
	buttonElement?: HTMLElement;
}

enum MenubarState {
	HIDDEN,
	VISIBLE,
	FOCUSED,
	OPEN
}

export class MenuBar extends Disposable {

	static readonly OVERFLOW_INDEX: number = -1;

	private menus: MenuBarMenuWithElements[];

	private overflowMenu!: MenuBarMenuWithElements & { titleElement: HTMLElement; buttonElement: HTMLElement };

	private focusedMenu: {
		index: number;
		holder?: HTMLElement;
		widget?: Menu;
	} | undefined;

	private focusToReturn: HTMLElement | undefined;
	private menuUpdater: RunOnceScheduler;

	// Input-related
	private _mnemonicsInUse: boolean = false;
	private openedViaKeyboard: boolean = false;
	private awaitingAltRelease: boolean = false;
	private ignoreNextMouseUp: boolean = false;
	private mnemonics: Map<string, number>;

	private updatePending: boolean = false;
	private _focusState: MenubarState;
	private actionRunner: IActionRunner;

	private readonly _onVisibilityChange: Emitter<boolean>;
	private readonly _onFocusStateChange: Emitter<boolean>;

	private numMenusShown: number = 0;
	private overflowLayoutScheduled: IDisposable | undefined = undefined;

	private readonly menuDisposables = this._register(new DisposableStore());

	constructor(private container: HTMLElement, private options: IMenuBarOptions, private menuStyle: IMenuStyles) {
		super();

		this.container.setAttribute('role', 'menubar');
		if (this.isCompact) {
			this.container.classList.add('compact');
		}

		this.menus = [];
		this.mnemonics = new Map<string, number>();

		this._focusState = MenubarState.VISIBLE;

		this._onVisibilityChange = this._register(new Emitter<boolean>());
		this._onFocusStateChange = this._register(new Emitter<boolean>());

		this.createOverflowMenu();

		this.menuUpdater = this._register(new RunOnceScheduler(() => this.update(), 200));

		this.actionRunner = this.options.actionRunner ?? this._register(new ActionRunner());
		this._register(this.actionRunner.onWillRun(() => {
			this.setUnfocusedState();
		}));

		this._register(DOM.ModifierKeyEmitter.getInstance().event(this.onModifierKeyToggled, this));

		this._register(DOM.addDisposableListener(this.container, DOM.EventType.KEY_DOWN, (e) => {
			const event = new StandardKeyboardEvent(e);
			let eventHandled = true;
			const key = !!e.key ? e.key.toLocaleLowerCase() : '';

			const tabNav = isMacintosh && !this.isCompact;

			if (event.equals(KeyCode.LeftArrow) || (tabNav && event.equals(KeyCode.Tab | KeyMod.Shift))) {
				this.focusPrevious();
			} else if (event.equals(KeyCode.RightArrow) || (tabNav && event.equals(KeyCode.Tab))) {
				this.focusNext();
			} else if (event.equals(KeyCode.Escape) && this.isFocused && !this.isOpen) {
				this.setUnfocusedState();
			} else if (!this.isOpen && !event.ctrlKey && this.options.enableMnemonics && this.mnemonicsInUse && this.mnemonics.has(key)) {
				const menuIndex = this.mnemonics.get(key)!;
				this.onMenuTriggered(menuIndex, false);
			} else {
				eventHandled = false;
			}

			// Never allow default tab behavior when not compact
			if (!this.isCompact && (event.equals(KeyCode.Tab | KeyMod.Shift) || event.equals(KeyCode.Tab))) {
				event.preventDefault();
			}

			if (eventHandled) {
				event.preventDefault();
				event.stopPropagation();
			}
		}));

		const window = DOM.getWindow(this.container);
		this._register(DOM.addDisposableListener(window, DOM.EventType.MOUSE_DOWN, () => {
			// This mouse event is outside the menubar so it counts as a focus out
			if (this.isFocused) {
				this.setUnfocusedState();
			}
		}));

		this._register(DOM.addDisposableListener(this.container, DOM.EventType.FOCUS_IN, (e) => {
			const event = e;

			if (event.relatedTarget) {
				if (!this.container.contains(event.relatedTarget as HTMLElement)) {
					this.focusToReturn = event.relatedTarget as HTMLElement;
				}
			}
		}));

		this._register(DOM.addDisposableListener(this.container, DOM.EventType.FOCUS_OUT, (e) => {
			const event = e;

			// We are losing focus and there is no related target, e.g. webview case
			if (!event.relatedTarget) {
				this.setUnfocusedState();
			}
			// We are losing focus and there is a target, reset focusToReturn value as not to redirect
			else if (event.relatedTarget && !this.container.contains(event.relatedTarget as HTMLElement)) {
				this.focusToReturn = undefined;
				this.setUnfocusedState();
			}
		}));

		this._register(DOM.addDisposableListener(window, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (!this.options.enableMnemonics || !e.altKey || e.ctrlKey || e.defaultPrevented) {
				return;
			}

			const key = e.key.toLocaleLowerCase();
			if (!this.mnemonics.has(key)) {
				return;
			}

			this.mnemonicsInUse = true;
			this.updateMnemonicVisibility(true);

			const menuIndex = this.mnemonics.get(key)!;
			this.onMenuTriggered(menuIndex, false);
		}));

		this.setUnfocusedState();
	}

	push(arg: MenuBarMenu | MenuBarMenu[]): void {
		const menus: MenuBarMenu[] = asArray(arg);

		menus.forEach((menuBarMenu) => {
			const menuIndex = this.menus.length;
			const cleanMenuLabel = cleanMnemonic(menuBarMenu.label);

			const mnemonicMatches = MENU_MNEMONIC_REGEX.exec(menuBarMenu.label);

			// Register mnemonics
			if (mnemonicMatches) {
				const mnemonic = !!mnemonicMatches[1] ? mnemonicMatches[1] : mnemonicMatches[3];

				this.registerMnemonic(this.menus.length, mnemonic);
			}

			if (this.isCompact) {
				this.menus.push(menuBarMenu);
			} else {
				const buttonElement = $('div.menubar-menu-button', { 'role': 'menuitem', 'tabindex': -1, 'aria-label': cleanMenuLabel, 'aria-haspopup': true });
				const titleElement = $('div.menubar-menu-title', { 'role': 'none', 'aria-hidden': true });

				buttonElement.appendChild(titleElement);
				this.container.insertBefore(buttonElement, this.overflowMenu.buttonElement);

				this.updateLabels(titleElement, buttonElement, menuBarMenu.label);

				this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.KEY_UP, (e) => {
					const event = new StandardKeyboardEvent(e);
					let eventHandled = true;

					if ((event.equals(KeyCode.DownArrow) || event.equals(KeyCode.Enter)) && !this.isOpen) {
						this.focusedMenu = { index: menuIndex };
						this.openedViaKeyboard = true;
						this.focusState = MenubarState.OPEN;
					} else {
						eventHandled = false;
					}

					if (eventHandled) {
						event.preventDefault();
						event.stopPropagation();
					}
				}));

				this._register(Gesture.addTarget(buttonElement));
				this._register(DOM.addDisposableListener(buttonElement, EventType.Tap, (e: GestureEvent) => {
					// Ignore this touch if the menu is touched
					if (this.isOpen && this.focusedMenu && this.focusedMenu.holder && DOM.isAncestor(e.initialTarget as HTMLElement, this.focusedMenu.holder)) {
						return;
					}

					this.ignoreNextMouseUp = false;
					this.onMenuTriggered(menuIndex, true);

					e.preventDefault();
					e.stopPropagation();
				}));

				this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_DOWN, (e: MouseEvent) => {
					// Ignore non-left-click
					const mouseEvent = new StandardMouseEvent(DOM.getWindow(buttonElement), e);
					if (!mouseEvent.leftButton) {
						e.preventDefault();
						return;
					}

					if (!this.isOpen) {
						// Open the menu with mouse down and ignore the following mouse up event
						this.ignoreNextMouseUp = true;
						this.onMenuTriggered(menuIndex, true);
					} else {
						this.ignoreNextMouseUp = false;
					}

					e.preventDefault();
					e.stopPropagation();
				}));

				this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_UP, (e) => {
					if (e.defaultPrevented) {
						return;
					}

					if (!this.ignoreNextMouseUp) {
						if (this.isFocused) {
							this.onMenuTriggered(menuIndex, true);
						}
					} else {
						this.ignoreNextMouseUp = false;
					}
				}));

				this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_ENTER, () => {
					if (this.isOpen && !this.isCurrentMenu(menuIndex)) {
						buttonElement.focus();
						this.cleanupCustomMenu();
						this.showCustomMenu(menuIndex, false);
					} else if (this.isFocused && !this.isOpen) {
						this.focusedMenu = { index: menuIndex };
						buttonElement.focus();
					}
				}));

				this.menus.push({
					label: menuBarMenu.label,
					actions: menuBarMenu.actions,
					buttonElement: buttonElement,
					titleElement: titleElement
				});
			}
		});
	}

	createOverflowMenu(): void {
		const label = this.isCompact ? nls.localize('mAppMenu', 'Application Menu') : nls.localize('mMore', 'More');
		const buttonElement = $('div.menubar-menu-button', { 'role': 'menuitem', 'tabindex': this.isCompact ? 0 : -1, 'aria-label': label, 'aria-haspopup': true });
		const titleElement = $('div.menubar-menu-title.toolbar-toggle-more' + ThemeIcon.asCSSSelector(Codicon.menuBarMore), { 'role': 'none', 'aria-hidden': true });

		buttonElement.appendChild(titleElement);
		this.container.appendChild(buttonElement);
		buttonElement.style.visibility = 'hidden';

		this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.KEY_UP, (e) => {
			const event = new StandardKeyboardEvent(e);
			let eventHandled = true;

			const triggerKeys = [KeyCode.Enter];
			if (!this.isCompact) {
				triggerKeys.push(KeyCode.DownArrow);
			} else {
				triggerKeys.push(KeyCode.Space);

				if (this.options.compactMode?.horizontal === HorizontalDirection.Right) {
					triggerKeys.push(KeyCode.RightArrow);
				} else if (this.options.compactMode?.horizontal === HorizontalDirection.Left) {
					triggerKeys.push(KeyCode.LeftArrow);
				}
			}

			if ((triggerKeys.some(k => event.equals(k)) && !this.isOpen)) {
				this.focusedMenu = { index: MenuBar.OVERFLOW_INDEX };
				this.openedViaKeyboard = true;
				this.focusState = MenubarState.OPEN;
			} else {
				eventHandled = false;
			}

			if (eventHandled) {
				event.preventDefault();
				event.stopPropagation();
			}
		}));

		this._register(Gesture.addTarget(buttonElement));
		this._register(DOM.addDisposableListener(buttonElement, EventType.Tap, (e: GestureEvent) => {
			// Ignore this touch if the menu is touched
			if (this.isOpen && this.focusedMenu && this.focusedMenu.holder && DOM.isAncestor(e.initialTarget as HTMLElement, this.focusedMenu.holder)) {
				return;
			}

			this.ignoreNextMouseUp = false;
			this.onMenuTriggered(MenuBar.OVERFLOW_INDEX, true);

			e.preventDefault();
			e.stopPropagation();
		}));

		this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_DOWN, (e) => {
			// Ignore non-left-click
			const mouseEvent = new StandardMouseEvent(DOM.getWindow(buttonElement), e);
			if (!mouseEvent.leftButton) {
				e.preventDefault();
				return;
			}

			if (!this.isOpen) {
				// Open the menu with mouse down and ignore the following mouse up event
				this.ignoreNextMouseUp = true;
				this.onMenuTriggered(MenuBar.OVERFLOW_INDEX, true);
			} else {
				this.ignoreNextMouseUp = false;
			}

			e.preventDefault();
			e.stopPropagation();
		}));

		this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_UP, (e) => {
			if (e.defaultPrevented) {
				return;
			}

			if (!this.ignoreNextMouseUp) {
				if (this.isFocused) {
					this.onMenuTriggered(MenuBar.OVERFLOW_INDEX, true);
				}
			} else {
				this.ignoreNextMouseUp = false;
			}
		}));

		this._register(DOM.addDisposableListener(buttonElement, DOM.EventType.MOUSE_ENTER, () => {
			if (this.isOpen && !this.isCurrentMenu(MenuBar.OVERFLOW_INDEX)) {
				this.overflowMenu.buttonElement.focus();
				this.cleanupCustomMenu();
				this.showCustomMenu(MenuBar.OVERFLOW_INDEX, false);
			} else if (this.isFocused && !this.isOpen) {
				this.focusedMenu = { index: MenuBar.OVERFLOW_INDEX };
				buttonElement.focus();
			}
		}));

		this.overflowMenu = {
			buttonElement: buttonElement,
			titleElement: titleElement,
			label: 'More',
			actions: []
		};
	}

	updateMenu(menu: MenuBarMenu): void {
		const menuToUpdate = this.menus.filter(menuBarMenu => menuBarMenu.label === menu.label);
		if (menuToUpdate && menuToUpdate.length) {
			menuToUpdate[0].actions = menu.actions;
		}
	}

	override dispose(): void {
		super.dispose();

		this.menus.forEach(menuBarMenu => {
			menuBarMenu.titleElement?.remove();
			menuBarMenu.buttonElement?.remove();
		});

		this.overflowMenu.titleElement.remove();
		this.overflowMenu.buttonElement.remove();

		dispose(this.overflowLayoutScheduled);
		this.overflowLayoutScheduled = undefined;
	}

	blur(): void {
		this.setUnfocusedState();
	}

	getWidth(): number {
		if (!this.isCompact && this.menus) {
			const left = this.menus[0].buttonElement!.getBoundingClientRect().left;
			const right = this.hasOverflow ? this.overflowMenu.buttonElement.getBoundingClientRect().right : this.menus[this.menus.length - 1].buttonElement!.getBoundingClientRect().right;
			return right - left;
		}

		return 0;
	}

	getHeight(): number {
		return this.container.clientHeight;
	}

	toggleFocus(): void {
		if (!this.isFocused && this.options.visibility !== 'hidden') {
			this.mnemonicsInUse = true;
			this.focusedMenu = { index: this.numMenusShown > 0 ? 0 : MenuBar.OVERFLOW_INDEX };
			this.focusState = MenubarState.FOCUSED;
		} else if (!this.isOpen) {
			this.setUnfocusedState();
		}
	}

	private updateOverflowAction(): void {
		if (!this.menus || !this.menus.length) {
			return;
		}

		const overflowMenuOnlyClass = 'overflow-menu-only';

		// Remove overflow only restriction to allow the most space
		this.container.classList.toggle(overflowMenuOnlyClass, false);

		const sizeAvailable = this.container.offsetWidth;
		let currentSize = 0;
		let full = this.isCompact;
		const prevNumMenusShown = this.numMenusShown;
		this.numMenusShown = 0;

		const showableMenus = this.menus.filter(menu => menu.buttonElement !== undefined && menu.titleElement !== undefined) as (MenuBarMenuWithElements & { titleElement: HTMLElement; buttonElement: HTMLElement })[];
		for (const menuBarMenu of showableMenus) {
			if (!full) {
				const size = menuBarMenu.buttonElement.offsetWidth;
				if (currentSize + size > sizeAvailable) {
					full = true;
				} else {
					currentSize += size;
					this.numMenusShown++;
					if (this.numMenusShown > prevNumMenusShown) {
						menuBarMenu.buttonElement.style.visibility = 'visible';
					}
				}
			}

			if (full) {
				menuBarMenu.buttonElement.style.visibility = 'hidden';
			}
		}


		// If below minimium menu threshold, show the overflow menu only as hamburger menu
		if (this.numMenusShown - 1 <= showableMenus.length / 4) {
			for (const menuBarMenu of showableMenus) {
				menuBarMenu.buttonElement.style.visibility = 'hidden';
			}

			full = true;
			this.numMenusShown = 0;
			currentSize = 0;
		}

		// Overflow
		if (this.isCompact) {
			this.overflowMenu.actions = [];
			for (let idx = this.numMenusShown; idx < this.menus.length; idx++) {
				this.overflowMenu.actions.push(new SubmenuAction(`menubar.submenu.${this.menus[idx].label}`, this.menus[idx].label, this.menus[idx].actions || []));
			}

			const compactMenuActions = this.options.getCompactMenuActions?.();
			if (compactMenuActions && compactMenuActions.length) {
				this.overflowMenu.actions.push(new Separator());
				this.overflowMenu.actions.push(...compactMenuActions);
			}

			this.overflowMenu.buttonElement.style.visibility = 'visible';
		} else if (full) {
			// Can't fit the more button, need to remove more menus
			while (currentSize + this.overflowMenu.buttonElement.offsetWidth > sizeAvailable && this.numMenusShown > 0) {
				this.numMenusShown--;
				const size = showableMenus[this.numMenusShown].buttonElement.offsetWidth;
				showableMenus[this.numMenusShown].buttonElement.style.visibility = 'hidden';
				currentSize -= size;
			}

			this.overflowMenu.actions = [];
			for (let idx = this.numMenusShown; idx < showableMenus.length; idx++) {
				this.overflowMenu.actions.push(new SubmenuAction(`menubar.submenu.${showableMenus[idx].label}`, showableMenus[idx].label, showableMenus[idx].actions || []));
			}

			if (this.overflowMenu.buttonElement.nextElementSibling !== showableMenus[this.numMenusShown].buttonElement) {
				this.overflowMenu.buttonElement.remove();
				this.container.insertBefore(this.overflowMenu.buttonElement, showableMenus[this.numMenusShown].buttonElement);
			}

			this.overflowMenu.buttonElement.style.visibility = 'visible';
		} else {
			this.overflowMenu.buttonElement.remove();
			this.container.appendChild(this.overflowMenu.buttonElement);
			this.overflowMenu.buttonElement.style.visibility = 'hidden';
		}

		// If we are only showing the overflow, add this class to avoid taking up space
		this.container.classList.toggle(overflowMenuOnlyClass, this.numMenusShown === 0);
	}

	private updateLabels(titleElement: HTMLElement, buttonElement: HTMLElement, label: string): void {
		const cleanMenuLabel = cleanMnemonic(label);

		// Update the button label to reflect mnemonics

		if (this.options.enableMnemonics) {
			const cleanLabel = strings.escape(label);

			// This is global so reset it
			MENU_ESCAPED_MNEMONIC_REGEX.lastIndex = 0;
			let escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(cleanLabel);

			// We can't use negative lookbehind so we match our negative and skip
			while (escMatch && escMatch[1]) {
				escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(cleanLabel);
			}

			const replaceDoubleEscapes = (str: string) => str.replace(/&amp;&amp;/g, '&amp;');

			if (escMatch) {
				titleElement.textContent = '';
				titleElement.append(
					strings.ltrim(replaceDoubleEscapes(cleanLabel.substr(0, escMatch.index)), ' '),
					$('mnemonic', { 'aria-hidden': 'true' }, escMatch[3]),
					strings.rtrim(replaceDoubleEscapes(cleanLabel.substr(escMatch.index + escMatch[0].length)), ' ')
				);
			} else {
				titleElement.textContent = replaceDoubleEscapes(cleanLabel).trim();
			}
		} else {
			titleElement.textContent = cleanMenuLabel.replace(/&&/g, '&');
		}

		const mnemonicMatches = MENU_MNEMONIC_REGEX.exec(label);

		// Register mnemonics
		if (mnemonicMatches) {
			const mnemonic = !!mnemonicMatches[1] ? mnemonicMatches[1] : mnemonicMatches[3];

			if (this.options.enableMnemonics) {
				buttonElement.setAttribute('aria-keyshortcuts', 'Alt+' + mnemonic.toLocaleLowerCase());
			} else {
				buttonElement.removeAttribute('aria-keyshortcuts');
			}
		}
	}

	update(options?: IMenuBarOptions): void {
		if (options) {
			this.options = options;
		}

		// Don't update while using the menu
		if (this.isFocused) {
			this.updatePending = true;
			return;
		}

		this.menus.forEach(menuBarMenu => {
			if (!menuBarMenu.buttonElement || !menuBarMenu.titleElement) {
				return;
			}

			this.updateLabels(menuBarMenu.titleElement, menuBarMenu.buttonElement, menuBarMenu.label);
		});

		if (!this.overflowLayoutScheduled) {
			this.overflowLayoutScheduled = DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this.container), () => {
				this.updateOverflowAction();
				this.overflowLayoutScheduled = undefined;
			});
		}

		this.setUnfocusedState();
	}

	private registerMnemonic(menuIndex: number, mnemonic: string): void {
		this.mnemonics.set(mnemonic.toLocaleLowerCase(), menuIndex);
	}

	private hideMenubar(): void {
		if (this.container.style.display !== 'none') {
			this.container.style.display = 'none';
			this._onVisibilityChange.fire(false);
		}
	}

	private showMenubar(): void {
		if (this.container.style.display !== 'flex') {
			this.container.style.display = 'flex';
			this._onVisibilityChange.fire(true);

			this.updateOverflowAction();
		}
	}

	private get focusState(): MenubarState {
		return this._focusState;
	}

	private set focusState(value: MenubarState) {
		if (this._focusState >= MenubarState.FOCUSED && value < MenubarState.FOCUSED) {
			// Losing focus, update the menu if needed

			if (this.updatePending) {
				this.menuUpdater.schedule();
				this.updatePending = false;
			}
		}

		if (value === this._focusState) {
			return;
		}

		const isVisible = this.isVisible;
		const isOpen = this.isOpen;
		const isFocused = this.isFocused;

		this._focusState = value;

		switch (value) {
			case MenubarState.HIDDEN:
				if (isVisible) {
					this.hideMenubar();
				}

				if (isOpen) {
					this.cleanupCustomMenu();
				}

				if (isFocused) {
					this.focusedMenu = undefined;

					if (this.focusToReturn) {
						this.focusToReturn.focus();
						this.focusToReturn = undefined;
					}
				}


				break;
			case MenubarState.VISIBLE:
				if (!isVisible) {
					this.showMenubar();
				}

				if (isOpen) {
					this.cleanupCustomMenu();
				}

				if (isFocused) {
					if (this.focusedMenu) {
						if (this.focusedMenu.index === MenuBar.OVERFLOW_INDEX) {
							this.overflowMenu.buttonElement.blur();
						} else {
							this.menus[this.focusedMenu.index].buttonElement?.blur();
						}
					}

					this.focusedMenu = undefined;

					if (this.focusToReturn) {
						this.focusToReturn.focus();
						this.focusToReturn = undefined;
					}
				}

				break;
			case MenubarState.FOCUSED:
				if (!isVisible) {
					this.showMenubar();
				}

				if (isOpen) {
					this.cleanupCustomMenu();
				}

				if (this.focusedMenu) {
					// When the menu is toggled on, it may be in compact state and trying to
					// focus the first menu. In this case we should focus the overflow instead.
					if (this.focusedMenu.index === 0 && this.numMenusShown === 0) {
						this.focusedMenu.index = MenuBar.OVERFLOW_INDEX;
					}

					if (this.focusedMenu.index === MenuBar.OVERFLOW_INDEX) {
						this.overflowMenu.buttonElement.focus();
					} else {
						this.menus[this.focusedMenu.index].buttonElement?.focus();
					}
				}
				break;
			case MenubarState.OPEN:
				if (!isVisible) {
					this.showMenubar();
				}

				if (this.focusedMenu) {
					this.cleanupCustomMenu();
					this.showCustomMenu(this.focusedMenu.index, this.openedViaKeyboard);
				}
				break;
		}

		this._focusState = value;
		this._onFocusStateChange.fire(this.focusState >= MenubarState.FOCUSED);
	}

	get isVisible(): boolean {
		return this.focusState >= MenubarState.VISIBLE;
	}

	private get isFocused(): boolean {
		return this.focusState >= MenubarState.FOCUSED;
	}

	private get isOpen(): boolean {
		return this.focusState >= MenubarState.OPEN;
	}

	private get hasOverflow(): boolean {
		return this.isCompact || this.numMenusShown < this.menus.length;
	}

	private get isCompact(): boolean {
		return this.options.compactMode !== undefined;
	}

	private setUnfocusedState(): void {
		if (this.options.visibility === 'toggle' || this.options.visibility === 'hidden') {
			this.focusState = MenubarState.HIDDEN;
		} else if (this.options.visibility === 'classic' && browser.isFullscreen(mainWindow)) {
			this.focusState = MenubarState.HIDDEN;
		} else {
			this.focusState = MenubarState.VISIBLE;
		}

		this.ignoreNextMouseUp = false;
		this.mnemonicsInUse = false;
		this.updateMnemonicVisibility(false);
	}

	private focusPrevious(): void {

		if (!this.focusedMenu || this.numMenusShown === 0) {
			return;
		}


		let newFocusedIndex = (this.focusedMenu.index - 1 + this.numMenusShown) % this.numMenusShown;
		if (this.focusedMenu.index === MenuBar.OVERFLOW_INDEX) {
			newFocusedIndex = this.numMenusShown - 1;
		} else if (this.focusedMenu.index === 0 && this.hasOverflow) {
			newFocusedIndex = MenuBar.OVERFLOW_INDEX;
		}

		if (newFocusedIndex === this.focusedMenu.index) {
			return;
		}

		if (this.isOpen) {
			this.cleanupCustomMenu();
			this.showCustomMenu(newFocusedIndex);
		} else if (this.isFocused) {
			this.focusedMenu.index = newFocusedIndex;
			if (newFocusedIndex === MenuBar.OVERFLOW_INDEX) {
				this.overflowMenu.buttonElement.focus();
			} else {
				this.menus[newFocusedIndex].buttonElement?.focus();
			}
		}
	}

	private focusNext(): void {
		if (!this.focusedMenu || this.numMenusShown === 0) {
			return;
		}

		let newFocusedIndex = (this.focusedMenu.index + 1) % this.numMenusShown;
		if (this.focusedMenu.index === MenuBar.OVERFLOW_INDEX) {
			newFocusedIndex = 0;
		} else if (this.focusedMenu.index === this.numMenusShown - 1) {
			newFocusedIndex = MenuBar.OVERFLOW_INDEX;
		}

		if (newFocusedIndex === this.focusedMenu.index) {
			return;
		}

		if (this.isOpen) {
			this.cleanupCustomMenu();
			this.showCustomMenu(newFocusedIndex);
		} else if (this.isFocused) {
			this.focusedMenu.index = newFocusedIndex;
			if (newFocusedIndex === MenuBar.OVERFLOW_INDEX) {
				this.overflowMenu.buttonElement.focus();
			} else {
				this.menus[newFocusedIndex].buttonElement?.focus();
			}
		}
	}

	private updateMnemonicVisibility(visible: boolean): void {
		if (this.menus) {
			this.menus.forEach(menuBarMenu => {
				if (menuBarMenu.titleElement && menuBarMenu.titleElement.children.length) {
					const child = menuBarMenu.titleElement.children.item(0) as HTMLElement;
					if (child) {
						child.style.textDecoration = (this.options.alwaysOnMnemonics || visible) ? 'underline' : '';
					}
				}
			});
		}
	}

	private get mnemonicsInUse(): boolean {
		return this._mnemonicsInUse;
	}

	private set mnemonicsInUse(value: boolean) {
		this._mnemonicsInUse = value;
	}

	private get shouldAltKeyFocus(): boolean {
		if (isMacintosh) {
			return false;
		}

		if (!this.options.disableAltFocus) {
			return true;
		}

		if (this.options.visibility === 'toggle') {
			return true;
		}

		return false;
	}

	public get onVisibilityChange(): Event<boolean> {
		return this._onVisibilityChange.event;
	}

	public get onFocusStateChange(): Event<boolean> {
		return this._onFocusStateChange.event;
	}

	private onMenuTriggered(menuIndex: number, clicked: boolean) {
		if (this.isOpen) {
			if (this.isCurrentMenu(menuIndex)) {
				this.setUnfocusedState();
			} else {
				this.cleanupCustomMenu();
				this.showCustomMenu(menuIndex, this.openedViaKeyboard);
			}
		} else {
			this.focusedMenu = { index: menuIndex };
			this.openedViaKeyboard = !clicked;
			this.focusState = MenubarState.OPEN;
		}
	}

	private onModifierKeyToggled(modifierKeyStatus: DOM.IModifierKeyStatus): void {
		const allModifiersReleased = !modifierKeyStatus.altKey && !modifierKeyStatus.ctrlKey && !modifierKeyStatus.shiftKey && !modifierKeyStatus.metaKey;

		if (this.options.visibility === 'hidden') {
			return;
		}

		// Prevent alt-key default if the menu is not hidden and we use alt to focus
		if (modifierKeyStatus.event && this.shouldAltKeyFocus) {
			if (ScanCodeUtils.toEnum(modifierKeyStatus.event.code) === ScanCode.AltLeft) {
				modifierKeyStatus.event.preventDefault();
			}
		}

		// Alt key pressed while menu is focused. This should return focus away from the menubar
		if (this.isFocused && modifierKeyStatus.lastKeyPressed === 'alt' && modifierKeyStatus.altKey) {
			this.setUnfocusedState();
			this.mnemonicsInUse = false;
			this.awaitingAltRelease = true;
		}

		// Clean alt key press and release
		if (allModifiersReleased && modifierKeyStatus.lastKeyPressed === 'alt' && modifierKeyStatus.lastKeyReleased === 'alt') {
			if (!this.awaitingAltRelease) {
				if (!this.isFocused && this.shouldAltKeyFocus) {
					this.mnemonicsInUse = true;
					this.focusedMenu = { index: this.numMenusShown > 0 ? 0 : MenuBar.OVERFLOW_INDEX };
					this.focusState = MenubarState.FOCUSED;
				} else if (!this.isOpen) {
					this.setUnfocusedState();
				}
			}
		}

		// Alt key released
		if (!modifierKeyStatus.altKey && modifierKeyStatus.lastKeyReleased === 'alt') {
			this.awaitingAltRelease = false;
		}

		if (this.options.enableMnemonics && this.menus && !this.isOpen) {
			this.updateMnemonicVisibility((!this.awaitingAltRelease && modifierKeyStatus.altKey) || this.mnemonicsInUse);
		}
	}

	private isCurrentMenu(menuIndex: number): boolean {
		if (!this.focusedMenu) {
			return false;
		}

		return this.focusedMenu.index === menuIndex;
	}

	private cleanupCustomMenu(): void {
		if (this.focusedMenu) {
			// Remove focus from the menus first
			if (this.focusedMenu.index === MenuBar.OVERFLOW_INDEX) {
				this.overflowMenu.buttonElement.focus();
			} else {
				this.menus[this.focusedMenu.index].buttonElement?.focus();
			}

			if (this.focusedMenu.holder) {
				this.focusedMenu.holder.parentElement?.classList.remove('open');

				this.focusedMenu.holder.remove();
			}

			this.focusedMenu.widget?.dispose();

			this.focusedMenu = { index: this.focusedMenu.index };
		}
		this.menuDisposables.clear();
	}

	private showCustomMenu(menuIndex: number, selectFirst = true): void {
		const actualMenuIndex = menuIndex >= this.numMenusShown ? MenuBar.OVERFLOW_INDEX : menuIndex;
		const customMenu = actualMenuIndex === MenuBar.OVERFLOW_INDEX ? this.overflowMenu : this.menus[actualMenuIndex];

		if (!customMenu.actions || !customMenu.buttonElement || !customMenu.titleElement) {
			return;
		}

		const menuHolder = $('div.menubar-menu-items-holder', { 'title': '' });

		customMenu.buttonElement.classList.add('open');

		const titleBoundingRect = customMenu.titleElement.getBoundingClientRect();
		const titleBoundingRectZoom = DOM.getDomNodeZoomLevel(customMenu.titleElement);

		if (this.options.compactMode?.horizontal === HorizontalDirection.Right) {
			menuHolder.style.left = `${titleBoundingRect.left + this.container.clientWidth}px`;
		} else if (this.options.compactMode?.horizontal === HorizontalDirection.Left) {
			const windowWidth = DOM.getWindow(this.container).innerWidth;
			menuHolder.style.right = `${windowWidth - titleBoundingRect.left}px`;
			menuHolder.style.left = 'auto';
		} else {
			menuHolder.style.left = `${titleBoundingRect.left * titleBoundingRectZoom}px`;
		}

		if (this.options.compactMode?.vertical === VerticalDirection.Above) {
			// TODO@benibenj Do not hardcode the height of the menu holder
			menuHolder.style.top = `${titleBoundingRect.top - this.menus.length * 30 + this.container.clientHeight}px`;
		} else if (this.options.compactMode?.vertical === VerticalDirection.Below) {
			menuHolder.style.top = `${titleBoundingRect.top}px`;
		} else {
			menuHolder.style.top = `${titleBoundingRect.bottom * titleBoundingRectZoom}px`;
		}

		customMenu.buttonElement.appendChild(menuHolder);

		const menuOptions: IMenuOptions = {
			getKeyBinding: this.options.getKeybinding,
			actionRunner: this.actionRunner,
			enableMnemonics: this.options.alwaysOnMnemonics || (this.mnemonicsInUse && this.options.enableMnemonics),
			ariaLabel: customMenu.buttonElement.getAttribute('aria-label') ?? undefined,
			expandDirection: this.isCompact ? this.options.compactMode : { horizontal: HorizontalDirection.Right, vertical: VerticalDirection.Below },
			useEventAsContext: true
		};

		const menuWidget = this.menuDisposables.add(new Menu(menuHolder, customMenu.actions, menuOptions, this.menuStyle));
		this.menuDisposables.add(menuWidget.onDidCancel(() => {
			this.focusState = MenubarState.FOCUSED;
		}));

		if (actualMenuIndex !== menuIndex) {
			menuWidget.trigger(menuIndex - this.numMenusShown);
		} else {
			menuWidget.focus(selectFirst);
		}

		this.focusedMenu = {
			index: actualMenuIndex,
			holder: menuHolder,
			widget: menuWidget
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/mouseCursor/mouseCursor.css]---
Location: vscode-main/src/vs/base/browser/ui/mouseCursor/mouseCursor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-mouse-cursor-text {
	cursor: text;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/mouseCursor/mouseCursor.ts]---
Location: vscode-main/src/vs/base/browser/ui/mouseCursor/mouseCursor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './mouseCursor.css';

export const MOUSE_CURSOR_TEXT_CSS_CLASS_NAME = `monaco-mouse-cursor-text`;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/progressbar/progressAccessibilitySignal.ts]---
Location: vscode-main/src/vs/base/browser/ui/progressbar/progressAccessibilitySignal.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../common/lifecycle.js';

export interface IScopedAccessibilityProgressSignalDelegate extends IDisposable { }

const nullScopedAccessibilityProgressSignalFactory = () => ({
	msLoopTime: -1,
	msDelayTime: -1,
	dispose: () => { },
});
let progressAccessibilitySignalSchedulerFactory: (msDelayTime: number, msLoopTime?: number) => IScopedAccessibilityProgressSignalDelegate = nullScopedAccessibilityProgressSignalFactory;

export function setProgressAccessibilitySignalScheduler(progressAccessibilitySignalScheduler: (msDelayTime: number, msLoopTime?: number) => IScopedAccessibilityProgressSignalDelegate) {
	progressAccessibilitySignalSchedulerFactory = progressAccessibilitySignalScheduler;
}

export function getProgressAccessibilitySignalScheduler(msDelayTime: number, msLoopTime?: number): IScopedAccessibilityProgressSignalDelegate {
	return progressAccessibilitySignalSchedulerFactory(msDelayTime, msLoopTime);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/progressbar/progressbar.css]---
Location: vscode-main/src/vs/base/browser/ui/progressbar/progressbar.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-progress-container {
	width: 100%;
	height: 2px;
	overflow: hidden; /* keep progress bit in bounds */
}

.monaco-progress-container .progress-bit {
	width: 2%;
	height: 2px;
	position: absolute;
	left: 0;
	display: none;
}

.monaco-progress-container.active .progress-bit {
	display: inherit;
}

.monaco-progress-container.discrete .progress-bit {
	left: 0;
	transition: width 100ms linear;
}

.monaco-progress-container.discrete.done .progress-bit {
	width: 100%;
}

.monaco-progress-container.infinite .progress-bit {
	animation-name: progress;
	animation-duration: 4s;
	animation-iteration-count: infinite;
	transform: translate3d(0px, 0px, 0px);
	animation-timing-function: linear;
}

.monaco-progress-container.infinite.infinite-long-running .progress-bit {
	/*
		The more smooth `linear` timing function can cause
		higher GPU consumption as indicated in
		https://github.com/microsoft/vscode/issues/97900 &
		https://github.com/microsoft/vscode/issues/138396
	*/
	animation-timing-function: steps(100);
}

/**
 * The progress bit has a width: 2% (1/50) of the parent container. The animation moves it from 0% to 100% of
 * that container. Since translateX is relative to the progress bit size, we have to multiple it with
 * its relative size to the parent container:
 * parent width: 5000%
 *    bit width: 100%
 * translateX should be as follow:
 *  50%: 5000% * 50% - 50% (set to center) = 2450%
 * 100%: 5000% * 100% - 100% (do not overflow) = 4900%
 */
@keyframes progress { from { transform: translateX(0%) scaleX(1) } 50% { transform: translateX(2500%) scaleX(3) } to { transform: translateX(4900%) scaleX(1) } }
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/progressbar/progressbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/progressbar/progressbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { hide, show } from '../../dom.js';
import { getProgressAccessibilitySignalScheduler } from './progressAccessibilitySignal.js';
import { RunOnceScheduler } from '../../../common/async.js';
import { Disposable, IDisposable, MutableDisposable } from '../../../common/lifecycle.js';
import { isNumber } from '../../../common/types.js';
import './progressbar.css';

const CSS_DONE = 'done';
const CSS_ACTIVE = 'active';
const CSS_INFINITE = 'infinite';
const CSS_INFINITE_LONG_RUNNING = 'infinite-long-running';
const CSS_DISCRETE = 'discrete';

export interface IProgressBarOptions extends IProgressBarStyles {
}

export interface IProgressBarStyles {
	progressBarBackground: string | undefined;
}

export const unthemedProgressBarOptions: IProgressBarOptions = {
	progressBarBackground: undefined
};

/**
 * A progress bar with support for infinite or discrete progress.
 */
export class ProgressBar extends Disposable {

	/**
	 * After a certain time of showing the progress bar, switch
	 * to long-running mode and throttle animations to reduce
	 * the pressure on the GPU process.
	 *
	 * https://github.com/microsoft/vscode/issues/97900
	 * https://github.com/microsoft/vscode/issues/138396
	 */
	private static readonly LONG_RUNNING_INFINITE_THRESHOLD = 10000;

	private static readonly PROGRESS_SIGNAL_DEFAULT_DELAY = 3000;

	private workedVal: number;
	private element!: HTMLElement;
	private bit!: HTMLElement;
	private totalWork: number | undefined;
	private showDelayedScheduler: RunOnceScheduler;
	private longRunningScheduler: RunOnceScheduler;
	private readonly progressSignal = this._register(new MutableDisposable<IDisposable>());

	constructor(container: HTMLElement, options?: IProgressBarOptions) {
		super();

		this.workedVal = 0;

		this.showDelayedScheduler = this._register(new RunOnceScheduler(() => show(this.element), 0));
		this.longRunningScheduler = this._register(new RunOnceScheduler(() => this.infiniteLongRunning(), ProgressBar.LONG_RUNNING_INFINITE_THRESHOLD));

		this.create(container, options);
	}

	private create(container: HTMLElement, options?: IProgressBarOptions): void {
		this.element = document.createElement('div');
		this.element.classList.add('monaco-progress-container');
		this.element.setAttribute('role', 'progressbar');
		this.element.setAttribute('aria-valuemin', '0');
		container.appendChild(this.element);

		this.bit = document.createElement('div');
		this.bit.classList.add('progress-bit');
		this.bit.style.backgroundColor = options?.progressBarBackground || '#0E70C0';
		this.element.appendChild(this.bit);
	}

	private off(): void {
		this.bit.style.width = 'inherit';
		this.bit.style.opacity = '1';
		this.element.classList.remove(CSS_ACTIVE, CSS_INFINITE, CSS_INFINITE_LONG_RUNNING, CSS_DISCRETE);

		this.workedVal = 0;
		this.totalWork = undefined;

		this.longRunningScheduler.cancel();
		this.progressSignal.clear();
	}

	/**
	 * Indicates to the progress bar that all work is done.
	 */
	done(): ProgressBar {
		return this.doDone(true);
	}

	/**
	 * Stops the progressbar from showing any progress instantly without fading out.
	 */
	stop(): ProgressBar {
		return this.doDone(false);
	}

	private doDone(delayed: boolean): ProgressBar {
		this.element.classList.add(CSS_DONE);

		// discrete: let it grow to 100% width and hide afterwards
		if (!this.element.classList.contains(CSS_INFINITE)) {
			this.bit.style.width = 'inherit';

			if (delayed) {
				setTimeout(() => this.off(), 200);
			} else {
				this.off();
			}
		}

		// infinite: let it fade out and hide afterwards
		else {
			this.bit.style.opacity = '0';
			if (delayed) {
				setTimeout(() => this.off(), 200);
			} else {
				this.off();
			}
		}

		return this;
	}

	/**
	 * Use this mode to indicate progress that has no total number of work units.
	 */
	infinite(): ProgressBar {
		this.bit.style.width = '2%';
		this.bit.style.opacity = '1';

		this.element.classList.remove(CSS_DISCRETE, CSS_DONE, CSS_INFINITE_LONG_RUNNING);
		this.element.classList.add(CSS_ACTIVE, CSS_INFINITE);

		this.longRunningScheduler.schedule();

		return this;
	}

	private infiniteLongRunning(): void {
		this.element.classList.add(CSS_INFINITE_LONG_RUNNING);
	}

	/**
	 * Tells the progress bar the total number of work. Use in combination with workedVal() to let
	 * the progress bar show the actual progress based on the work that is done.
	 */
	total(value: number): ProgressBar {
		this.workedVal = 0;
		this.totalWork = value;
		this.element.setAttribute('aria-valuemax', value.toString());

		return this;
	}

	/**
	 * Finds out if this progress bar is configured with total work
	 */
	hasTotal(): boolean {
		return isNumber(this.totalWork);
	}

	/**
	 * Tells the progress bar that an increment of work has been completed.
	 */
	worked(value: number): ProgressBar {
		value = Math.max(1, Number(value));

		return this.doSetWorked(this.workedVal + value);
	}

	/**
	 * Tells the progress bar the total amount of work (0 to 100) that has been completed.
	 */
	setWorked(value: number): ProgressBar {
		value = Math.max(1, Number(value));

		return this.doSetWorked(value);
	}

	private doSetWorked(value: number): ProgressBar {
		const totalWork = this.totalWork || 100;

		this.workedVal = value;
		this.workedVal = Math.min(totalWork, this.workedVal);

		this.element.classList.remove(CSS_INFINITE, CSS_INFINITE_LONG_RUNNING, CSS_DONE);
		this.element.classList.add(CSS_ACTIVE, CSS_DISCRETE);
		this.element.setAttribute('aria-valuenow', value.toString());

		this.bit.style.width = 100 * (this.workedVal / (totalWork)) + '%';

		return this;
	}

	getContainer(): HTMLElement {
		return this.element;
	}

	show(delay?: number): void {
		this.showDelayedScheduler.cancel();
		this.progressSignal.value = getProgressAccessibilitySignalScheduler(ProgressBar.PROGRESS_SIGNAL_DEFAULT_DELAY);

		if (typeof delay === 'number') {
			this.showDelayedScheduler.schedule(delay);
		} else {
			show(this.element);
		}
	}

	hide(): void {
		hide(this.element);

		this.showDelayedScheduler.cancel();
		this.progressSignal.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/radio/radio.css]---
Location: vscode-main/src/vs/base/browser/ui/radio/radio.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-custom-radio {
	display: flex;
}

.monaco-custom-radio > .monaco-button {
	border-radius: 0;
	font-size: 0.9em;
	line-height: 1em;
	padding-left: 0.5em;
	padding-right: 0.5em;
}

.monaco-custom-radio > .monaco-button:first-child {
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
}

.monaco-custom-radio > .monaco-button:last-child {
	border-top-right-radius: 3px;
	border-bottom-right-radius: 3px;
}

.monaco-custom-radio > .monaco-button:not(.active):not(:last-child) {
	border-right: none;
}

.monaco-custom-radio > .monaco-button.previous-active {
	border-left: none;
}

/* default color styles - based on CSS variables */

.monaco-custom-radio > .monaco-button {
	color: var(--vscode-radio-inactiveForeground);
	background-color: var(--vscode-radio-inactiveBackground);
	border-color: var(--vscode-radio-inactiveBorder, transparent);
}

.monaco-custom-radio > .monaco-button.active:hover,
.monaco-custom-radio > .monaco-button.active {
	color: var(--vscode-radio-activeForeground);
	background-color: var(--vscode-radio-activeBackground);
	border-color: var(--vscode-radio-activeBorder, transparent);
}

.hc-black .monaco-custom-radio > .monaco-button.active,
.hc-light .monaco-custom-radio > .monaco-button.active {
	border-color: var(--vscode-radio-activeBorder, transparent);
}

.hc-black .monaco-custom-radio > .monaco-button:not(.active),
.hc-light .monaco-custom-radio > .monaco-button:not(.active) {
	border-color: var(--vscode-radio-inactiveBorder, transparent);
}

.hc-black .monaco-custom-radio > .monaco-button:not(.active):hover,
.hc-light .monaco-custom-radio > .monaco-button:not(.active):hover {
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
	outline-offset: -1px
}

.monaco-custom-radio > .monaco-button:hover:not(.active) {
	background-color: var(--vscode-radio-inactiveHoverBackground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/radio/radio.ts]---
Location: vscode-main/src/vs/base/browser/ui/radio/radio.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Widget } from '../widget.js';
import { ThemeIcon } from '../../../common/themables.js';
import { Emitter } from '../../../common/event.js';
import './radio.css';
import { $ } from '../../dom.js';
import { IHoverDelegate } from '../hover/hoverDelegate.js';
import { Button } from '../button/button.js';
import { DisposableMap, DisposableStore } from '../../../common/lifecycle.js';
import { createInstantHoverDelegate } from '../hover/hoverDelegateFactory.js';

export interface IRadioStyles {
	readonly activeForeground?: string;
	readonly activeBackground?: string;
	readonly activeBorder?: string;
	readonly inactiveForeground?: string;
	readonly inactiveBackground?: string;
	readonly inactiveHoverBackground?: string;
	readonly inactiveBorder?: string;
}

export interface IRadioOptionItem {
	readonly text: string;
	readonly tooltip?: string;
	readonly isActive?: boolean;
	readonly disabled?: boolean;
}

export interface IRadioOptions {
	readonly items: ReadonlyArray<IRadioOptionItem>;
	readonly activeIcon?: ThemeIcon;
	readonly hoverDelegate?: IHoverDelegate;
}

export class Radio extends Widget {

	private readonly _onDidSelect = this._register(new Emitter<number>());
	readonly onDidSelect = this._onDidSelect.event;

	readonly domNode: HTMLElement;

	private readonly hoverDelegate: IHoverDelegate;

	private items: ReadonlyArray<IRadioOptionItem> = [];
	private activeItem: IRadioOptionItem | undefined;

	private readonly buttons = this._register(new DisposableMap<Button, { item: IRadioOptionItem; dispose(): void }>());

	constructor(opts: IRadioOptions) {
		super();

		this.hoverDelegate = opts.hoverDelegate ?? this._register(createInstantHoverDelegate());

		this.domNode = $('.monaco-custom-radio');
		this.domNode.setAttribute('role', 'radio');

		this.setItems(opts.items);
	}

	setItems(items: ReadonlyArray<IRadioOptionItem>): void {
		this.buttons.clearAndDisposeAll();
		this.items = items;
		this.activeItem = this.items.find(item => item.isActive) ?? this.items[0];
		for (let index = 0; index < this.items.length; index++) {
			const item = this.items[index];
			const disposables = new DisposableStore();
			const button = disposables.add(new Button(this.domNode, {
				hoverDelegate: this.hoverDelegate,
				title: item.tooltip,
				supportIcons: true,
			}));
			button.enabled = !item.disabled;
			disposables.add(button.onDidClick(() => {
				if (this.activeItem !== item) {
					this.activeItem = item;
					this.updateButtons();
					this._onDidSelect.fire(index);
				}
			}));
			this.buttons.set(button, { item, dispose: () => disposables.dispose() });
		}
		this.updateButtons();
	}

	setActiveItem(index: number): void {
		if (index < 0 || index >= this.items.length) {
			throw new Error('Invalid Index');
		}
		this.activeItem = this.items[index];
		this.updateButtons();
	}

	setEnabled(enabled: boolean): void {
		for (const [button] of this.buttons) {
			button.enabled = enabled;
		}
	}

	private updateButtons(): void {
		let isActive = false;
		for (const [button, { item }] of this.buttons) {
			const isPreviousActive = isActive;
			isActive = item === this.activeItem;
			button.element.classList.toggle('active', isActive);
			button.element.classList.toggle('previous-active', isPreviousActive);
			button.label = item.text;
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/resizable/resizable.ts]---
Location: vscode-main/src/vs/base/browser/ui/resizable/resizable.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../dom.js';
import { Orientation, OrthogonalEdge, Sash, SashState } from '../sash/sash.js';
import { Emitter, Event } from '../../../common/event.js';
import { DisposableStore } from '../../../common/lifecycle.js';


export interface IResizeEvent {
	dimension: Dimension;
	done: boolean;
	north?: boolean;
	east?: boolean;
	south?: boolean;
	west?: boolean;
}

export class ResizableHTMLElement {

	readonly domNode: HTMLElement;

	private readonly _onDidWillResize = new Emitter<void>();
	get onDidWillResize() { return this._onDidWillResize.event; }

	private readonly _onDidResize = new Emitter<IResizeEvent>();
	get onDidResize() { return this._onDidResize.event; }

	private readonly _northSash: Sash;
	private readonly _eastSash: Sash;
	private readonly _southSash: Sash;
	private readonly _westSash: Sash;
	private readonly _sashListener = new DisposableStore();

	private _size = new Dimension(0, 0);
	private _minSize = new Dimension(0, 0);
	private _maxSize = new Dimension(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
	private _preferredSize?: Dimension;

	constructor() {
		this.domNode = document.createElement('div');
		this._eastSash = new Sash(this.domNode, { getVerticalSashLeft: () => this._size.width }, { orientation: Orientation.VERTICAL });
		this._westSash = new Sash(this.domNode, { getVerticalSashLeft: () => 0 }, { orientation: Orientation.VERTICAL });
		this._northSash = new Sash(this.domNode, { getHorizontalSashTop: () => 0 }, { orientation: Orientation.HORIZONTAL, orthogonalEdge: OrthogonalEdge.North });
		this._southSash = new Sash(this.domNode, { getHorizontalSashTop: () => this._size.height }, { orientation: Orientation.HORIZONTAL, orthogonalEdge: OrthogonalEdge.South });

		this._northSash.orthogonalStartSash = this._westSash;
		this._northSash.orthogonalEndSash = this._eastSash;
		this._southSash.orthogonalStartSash = this._westSash;
		this._southSash.orthogonalEndSash = this._eastSash;

		let currentSize: Dimension | undefined;
		let deltaY = 0;
		let deltaX = 0;

		this._sashListener.add(Event.any(this._northSash.onDidStart, this._eastSash.onDidStart, this._southSash.onDidStart, this._westSash.onDidStart)(() => {
			if (currentSize === undefined) {
				this._onDidWillResize.fire();
				currentSize = this._size;
				deltaY = 0;
				deltaX = 0;
			}
		}));
		this._sashListener.add(Event.any(this._northSash.onDidEnd, this._eastSash.onDidEnd, this._southSash.onDidEnd, this._westSash.onDidEnd)(() => {
			if (currentSize !== undefined) {
				currentSize = undefined;
				deltaY = 0;
				deltaX = 0;
				this._onDidResize.fire({ dimension: this._size, done: true });
			}
		}));

		this._sashListener.add(this._eastSash.onDidChange(e => {
			if (currentSize) {
				deltaX = e.currentX - e.startX;
				this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
				this._onDidResize.fire({ dimension: this._size, done: false, east: true });
			}
		}));
		this._sashListener.add(this._westSash.onDidChange(e => {
			if (currentSize) {
				deltaX = -(e.currentX - e.startX);
				this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
				this._onDidResize.fire({ dimension: this._size, done: false, west: true });
			}
		}));
		this._sashListener.add(this._northSash.onDidChange(e => {
			if (currentSize) {
				deltaY = -(e.currentY - e.startY);
				this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
				this._onDidResize.fire({ dimension: this._size, done: false, north: true });
			}
		}));
		this._sashListener.add(this._southSash.onDidChange(e => {
			if (currentSize) {
				deltaY = e.currentY - e.startY;
				this.layout(currentSize.height + deltaY, currentSize.width + deltaX);
				this._onDidResize.fire({ dimension: this._size, done: false, south: true });
			}
		}));

		this._sashListener.add(Event.any(this._eastSash.onDidReset, this._westSash.onDidReset)(e => {
			if (this._preferredSize) {
				this.layout(this._size.height, this._preferredSize.width);
				this._onDidResize.fire({ dimension: this._size, done: true });
			}
		}));
		this._sashListener.add(Event.any(this._northSash.onDidReset, this._southSash.onDidReset)(e => {
			if (this._preferredSize) {
				this.layout(this._preferredSize.height, this._size.width);
				this._onDidResize.fire({ dimension: this._size, done: true });
			}
		}));
	}

	dispose(): void {
		this._northSash.dispose();
		this._southSash.dispose();
		this._eastSash.dispose();
		this._westSash.dispose();
		this._sashListener.dispose();
		this._onDidResize.dispose();
		this._onDidWillResize.dispose();
		this.domNode.remove();
	}

	enableSashes(north: boolean, east: boolean, south: boolean, west: boolean): void {
		this._northSash.state = north ? SashState.Enabled : SashState.Disabled;
		this._eastSash.state = east ? SashState.Enabled : SashState.Disabled;
		this._southSash.state = south ? SashState.Enabled : SashState.Disabled;
		this._westSash.state = west ? SashState.Enabled : SashState.Disabled;
	}

	layout(height: number = this.size.height, width: number = this.size.width): void {

		const { height: minHeight, width: minWidth } = this._minSize;
		const { height: maxHeight, width: maxWidth } = this._maxSize;

		height = Math.max(minHeight, Math.min(maxHeight, height));
		width = Math.max(minWidth, Math.min(maxWidth, width));

		const newSize = new Dimension(width, height);
		if (!Dimension.equals(newSize, this._size)) {
			this.domNode.style.height = height + 'px';
			this.domNode.style.width = width + 'px';
			this._size = newSize;
			this._northSash.layout();
			this._eastSash.layout();
			this._southSash.layout();
			this._westSash.layout();
		}
	}

	clearSashHoverState(): void {
		this._eastSash.clearSashHoverState();
		this._westSash.clearSashHoverState();
		this._northSash.clearSashHoverState();
		this._southSash.clearSashHoverState();
	}

	get size() {
		return this._size;
	}

	set maxSize(value: Dimension) {
		this._maxSize = value;
	}

	get maxSize() {
		return this._maxSize;
	}

	set minSize(value: Dimension) {
		this._minSize = value;
	}

	get minSize() {
		return this._minSize;
	}

	set preferredSize(value: Dimension | undefined) {
		this._preferredSize = value;
	}

	get preferredSize() {
		return this._preferredSize;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/sash/sash.css]---
Location: vscode-main/src/vs/base/browser/ui/sash/sash.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

:root {
	--vscode-sash-size: 4px;
	--vscode-sash-hover-size: 4px;
}

.monaco-sash {
	position: absolute;
	z-index: 35;
	touch-action: none;
}

.monaco-sash.disabled {
	pointer-events: none;
}

.monaco-sash.mac.vertical {
	cursor: col-resize;
}

.monaco-sash.vertical.minimum {
	cursor: e-resize;
}

.monaco-sash.vertical.maximum {
	cursor: w-resize;
}

.monaco-sash.mac.horizontal {
	cursor: row-resize;
}

.monaco-sash.horizontal.minimum {
	cursor: s-resize;
}

.monaco-sash.horizontal.maximum {
	cursor: n-resize;
}

.monaco-sash.disabled {
	cursor: default !important;
	pointer-events: none !important;
}

.monaco-sash.vertical {
	cursor: ew-resize;
	top: 0;
	width: var(--vscode-sash-size);
	height: 100%;
}

.monaco-sash.horizontal {
	cursor: ns-resize;
	left: 0;
	width: 100%;
	height: var(--vscode-sash-size);
}

.monaco-sash:not(.disabled) > .orthogonal-drag-handle {
	content: " ";
	height: calc(var(--vscode-sash-size) * 2);
	width: calc(var(--vscode-sash-size) * 2);
	z-index: 100;
	display: block;
	cursor: all-scroll;
	position: absolute;
}

.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)
	> .orthogonal-drag-handle.start,
.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)
	> .orthogonal-drag-handle.end {
	cursor: nwse-resize;
}

.monaco-sash.horizontal.orthogonal-edge-north:not(.disabled)
	> .orthogonal-drag-handle.end,
.monaco-sash.horizontal.orthogonal-edge-south:not(.disabled)
	> .orthogonal-drag-handle.start {
	cursor: nesw-resize;
}

.monaco-sash.vertical > .orthogonal-drag-handle.start {
	left: calc(var(--vscode-sash-size) * -0.5);
	top: calc(var(--vscode-sash-size) * -1);
}
.monaco-sash.vertical > .orthogonal-drag-handle.end {
	left: calc(var(--vscode-sash-size) * -0.5);
	bottom: calc(var(--vscode-sash-size) * -1);
}
.monaco-sash.horizontal > .orthogonal-drag-handle.start {
	top: calc(var(--vscode-sash-size) * -0.5);
	left: calc(var(--vscode-sash-size) * -1);
}
.monaco-sash.horizontal > .orthogonal-drag-handle.end {
	top: calc(var(--vscode-sash-size) * -0.5);
	right: calc(var(--vscode-sash-size) * -1);
}

.monaco-sash:before {
	content: '';
	pointer-events: none;
	position: absolute;
	width: 100%;
	height: 100%;
	background: transparent;
}

.monaco-enable-motion .monaco-sash:before {
	transition: background-color 0.1s ease-out;
}

.monaco-sash.hover:before,
.monaco-sash.active:before {
	background: var(--vscode-sash-hoverBorder);
}

.monaco-sash.vertical:before {
	width: var(--vscode-sash-hover-size);
	left: calc(50% - (var(--vscode-sash-hover-size) / 2));
}

.monaco-sash.horizontal:before {
	height: var(--vscode-sash-hover-size);
	top: calc(50% - (var(--vscode-sash-hover-size) / 2));
}

.pointer-events-disabled {
	pointer-events: none !important;
}

/** Debug **/

.monaco-sash.debug {
	background: cyan;
}

.monaco-sash.debug.disabled {
	background: rgba(0, 255, 255, 0.2);
}

.monaco-sash.debug:not(.disabled) > .orthogonal-drag-handle {
	background: red;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/sash/sash.ts]---
Location: vscode-main/src/vs/base/browser/ui/sash/sash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, append, EventHelper, EventLike, getWindow, isHTMLElement } from '../../dom.js';
import { createStyleSheet } from '../../domStylesheets.js';
import { DomEmitter } from '../../event.js';
import { EventType, Gesture } from '../../touch.js';
import { Delayer } from '../../../common/async.js';
import { memoize } from '../../../common/decorators.js';
import { Emitter, Event } from '../../../common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../common/lifecycle.js';
import { isMacintosh } from '../../../common/platform.js';
import './sash.css';

/**
 * Allow the sashes to be visible at runtime.
 * @remark Use for development purposes only.
 */
const DEBUG = false;
// DEBUG = Boolean("true"); // done "weirdly" so that a lint warning prevents you from pushing this

/**
 * A vertical sash layout provider provides position and height for a sash.
 */
export interface IVerticalSashLayoutProvider {
	getVerticalSashLeft(sash: Sash): number;
	getVerticalSashTop?(sash: Sash): number;
	getVerticalSashHeight?(sash: Sash): number;
}

/**
 * A vertical sash layout provider provides position and width for a sash.
 */
export interface IHorizontalSashLayoutProvider {
	getHorizontalSashTop(sash: Sash): number;
	getHorizontalSashLeft?(sash: Sash): number;
	getHorizontalSashWidth?(sash: Sash): number;
}

type ISashLayoutProvider = IVerticalSashLayoutProvider | IHorizontalSashLayoutProvider;

export interface ISashEvent {
	readonly startX: number;
	readonly currentX: number;
	readonly startY: number;
	readonly currentY: number;
	readonly altKey: boolean;
}

export enum OrthogonalEdge {
	North = 'north',
	South = 'south',
	East = 'east',
	West = 'west'
}

export interface IBoundarySashes {
	readonly top?: Sash;
	readonly right?: Sash;
	readonly bottom?: Sash;
	readonly left?: Sash;
}

export interface ISashOptions {

	/**
	 * Whether a sash is horizontal or vertical.
	 */
	readonly orientation: Orientation;

	/**
	 * The width or height of a vertical or horizontal sash, respectively.
	 */
	readonly size?: number;

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the start of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The start of a horizontal sash is its left-most position.
	 * The start of a vertical sash is its top-most position.
	 */
	readonly orthogonalStartSash?: Sash;

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the end of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The end of a horizontal sash is its right-most position.
	 * The end of a vertical sash is its bottom-most position.
	 */
	readonly orthogonalEndSash?: Sash;

	/**
	 * Provides a hint as to what mouse cursor to use whenever the user
	 * hovers over a corner sash provided by this and an orthogonal sash.
	 */
	readonly orthogonalEdge?: OrthogonalEdge;
}

export interface IVerticalSashOptions extends ISashOptions {
	readonly orientation: Orientation.VERTICAL;
}

export interface IHorizontalSashOptions extends ISashOptions {
	readonly orientation: Orientation.HORIZONTAL;
}

export const enum Orientation {
	VERTICAL,
	HORIZONTAL
}

export const enum SashState {

	/**
	 * Disable any UI interaction.
	 */
	Disabled,

	/**
	 * Allow dragging down or to the right, depending on the sash orientation.
	 *
	 * Some OSs allow customizing the mouse cursor differently whenever
	 * some resizable component can't be any smaller, but can be larger.
	 */
	AtMinimum,

	/**
	 * Allow dragging up or to the left, depending on the sash orientation.
	 *
	 * Some OSs allow customizing the mouse cursor differently whenever
	 * some resizable component can't be any larger, but can be smaller.
	 */
	AtMaximum,

	/**
	 * Enable dragging.
	 */
	Enabled
}

let globalSize = 4;
const onDidChangeGlobalSize = new Emitter<number>();
export function setGlobalSashSize(size: number): void {
	globalSize = size;
	onDidChangeGlobalSize.fire(size);
}

let globalHoverDelay = 300;
const onDidChangeHoverDelay = new Emitter<number>();
export function setGlobalHoverDelay(size: number): void {
	globalHoverDelay = size;
	onDidChangeHoverDelay.fire(size);
}

interface PointerEvent extends EventLike {
	readonly pageX: number;
	readonly pageY: number;
	readonly altKey: boolean;
	readonly target: EventTarget | null;
	readonly initialTarget?: EventTarget | undefined;
}

interface IPointerEventFactory {
	readonly onPointerMove: Event<PointerEvent>;
	readonly onPointerUp: Event<PointerEvent>;
	dispose(): void;
}

class MouseEventFactory implements IPointerEventFactory {

	private readonly disposables = new DisposableStore();

	constructor(private el: HTMLElement) { }

	@memoize
	get onPointerMove(): Event<PointerEvent> {
		return this.disposables.add(new DomEmitter(getWindow(this.el), 'mousemove')).event;
	}

	@memoize
	get onPointerUp(): Event<PointerEvent> {
		return this.disposables.add(new DomEmitter(getWindow(this.el), 'mouseup')).event;
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

class GestureEventFactory implements IPointerEventFactory {

	private readonly disposables = new DisposableStore();

	@memoize
	get onPointerMove(): Event<PointerEvent> {
		return this.disposables.add(new DomEmitter(this.el, EventType.Change)).event;
	}

	@memoize
	get onPointerUp(): Event<PointerEvent> {
		return this.disposables.add(new DomEmitter(this.el, EventType.End)).event;
	}

	constructor(private el: HTMLElement) { }

	dispose(): void {
		this.disposables.dispose();
	}
}

class OrthogonalPointerEventFactory implements IPointerEventFactory {

	@memoize
	get onPointerMove(): Event<PointerEvent> {
		return this.factory.onPointerMove;
	}

	@memoize
	get onPointerUp(): Event<PointerEvent> {
		return this.factory.onPointerUp;
	}

	constructor(private factory: IPointerEventFactory) { }

	dispose(): void {
		// noop
	}
}

const PointerEventsDisabledCssClass = 'pointer-events-disabled';

/**
 * The {@link Sash} is the UI component which allows the user to resize other
 * components. It's usually an invisible horizontal or vertical line which, when
 * hovered, becomes highlighted and can be dragged along the perpendicular dimension
 * to its direction.
 *
 * Features:
 * - Touch event handling
 * - Corner sash support
 * - Hover with different mouse cursor support
 * - Configurable hover size
 * - Linked sash support, for 2x2 corner sashes
 */
export class Sash extends Disposable {

	private el: HTMLElement;
	private layoutProvider: ISashLayoutProvider;
	private orientation: Orientation;
	private size: number;
	private hoverDelay = globalHoverDelay;
	private hoverDelayer = this._register(new Delayer(this.hoverDelay));

	private _state: SashState = SashState.Enabled;
	private readonly onDidEnablementChange = this._register(new Emitter<SashState>());
	private readonly _onDidStart = this._register(new Emitter<ISashEvent>());
	private readonly _onDidChange = this._register(new Emitter<ISashEvent>());
	private readonly _onDidReset = this._register(new Emitter<void>());
	private readonly _onDidEnd = this._register(new Emitter<void>());
	private readonly orthogonalStartSashDisposables = this._register(new DisposableStore());
	private _orthogonalStartSash: Sash | undefined;
	private readonly orthogonalStartDragHandleDisposables = this._register(new DisposableStore());
	private _orthogonalStartDragHandle: HTMLElement | undefined;
	private readonly orthogonalEndSashDisposables = this._register(new DisposableStore());
	private _orthogonalEndSash: Sash | undefined;
	private readonly orthogonalEndDragHandleDisposables = this._register(new DisposableStore());
	private _orthogonalEndDragHandle: HTMLElement | undefined;

	get state(): SashState { return this._state; }
	get orthogonalStartSash(): Sash | undefined { return this._orthogonalStartSash; }
	get orthogonalEndSash(): Sash | undefined { return this._orthogonalEndSash; }

	/**
	 * The state of a sash defines whether it can be interacted with by the user
	 * as well as what mouse cursor to use, when hovered.
	 */
	set state(state: SashState) {
		if (this._state === state) {
			return;
		}

		this.el.classList.toggle('disabled', state === SashState.Disabled);
		this.el.classList.toggle('minimum', state === SashState.AtMinimum);
		this.el.classList.toggle('maximum', state === SashState.AtMaximum);

		this._state = state;
		this.onDidEnablementChange.fire(state);
	}

	/**
	 * An event which fires whenever the user starts dragging this sash.
	 */
	get onDidStart() { return this._onDidStart.event; }

	/**
	 * An event which fires whenever the user moves the mouse while
	 * dragging this sash.
	 */
	get onDidChange() { return this._onDidChange.event; }

	/**
	 * An event which fires whenever the user double clicks this sash.
	 */
	get onDidReset() { return this._onDidReset.event; }

	/**
	 * An event which fires whenever the user stops dragging this sash.
	 */
	get onDidEnd() { return this._onDidEnd.event; }

	/**
	 * A linked sash will be forwarded the same user interactions and events
	 * so it moves exactly the same way as this sash.
	 *
	 * Useful in 2x2 grids. Not meant for widespread usage.
	 */
	linkedSash: Sash | undefined = undefined;

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the start of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The start of a horizontal sash is its left-most position.
	 * The start of a vertical sash is its top-most position.
	 */
	set orthogonalStartSash(sash: Sash | undefined) {
		if (this._orthogonalStartSash === sash) {
			return;
		}

		this.orthogonalStartDragHandleDisposables.clear();
		this.orthogonalStartSashDisposables.clear();

		if (sash) {
			const onChange = (state: SashState) => {
				this.orthogonalStartDragHandleDisposables.clear();

				if (state !== SashState.Disabled) {
					this._orthogonalStartDragHandle = append(this.el, $('.orthogonal-drag-handle.start'));
					this.orthogonalStartDragHandleDisposables.add(toDisposable(() => this._orthogonalStartDragHandle!.remove()));
					this.orthogonalStartDragHandleDisposables.add(addDisposableListener(this._orthogonalStartDragHandle, 'mouseenter', () => Sash.onMouseEnter(sash)));
					this.orthogonalStartDragHandleDisposables.add(addDisposableListener(this._orthogonalStartDragHandle, 'mouseleave', () => Sash.onMouseLeave(sash)));
				}
			};

			this.orthogonalStartSashDisposables.add(sash.onDidEnablementChange.event(onChange, this));
			onChange(sash.state);
		}

		this._orthogonalStartSash = sash;
	}

	/**
	 * A reference to another sash, perpendicular to this one, which
	 * aligns at the end of this one. A corner sash will be created
	 * automatically at that location.
	 *
	 * The end of a horizontal sash is its right-most position.
	 * The end of a vertical sash is its bottom-most position.
	 */

	set orthogonalEndSash(sash: Sash | undefined) {
		if (this._orthogonalEndSash === sash) {
			return;
		}

		this.orthogonalEndDragHandleDisposables.clear();
		this.orthogonalEndSashDisposables.clear();

		if (sash) {
			const onChange = (state: SashState) => {
				this.orthogonalEndDragHandleDisposables.clear();

				if (state !== SashState.Disabled) {
					this._orthogonalEndDragHandle = append(this.el, $('.orthogonal-drag-handle.end'));
					this.orthogonalEndDragHandleDisposables.add(toDisposable(() => this._orthogonalEndDragHandle!.remove()));
					this.orthogonalEndDragHandleDisposables.add(addDisposableListener(this._orthogonalEndDragHandle, 'mouseenter', () => Sash.onMouseEnter(sash)));
					this.orthogonalEndDragHandleDisposables.add(addDisposableListener(this._orthogonalEndDragHandle, 'mouseleave', () => Sash.onMouseLeave(sash)));
				}
			};

			this.orthogonalEndSashDisposables.add(sash.onDidEnablementChange.event(onChange, this));
			onChange(sash.state);
		}

		this._orthogonalEndSash = sash;
	}

	/**
	 * Create a new vertical sash.
	 *
	 * @param container A DOM node to append the sash to.
	 * @param verticalLayoutProvider A vertical layout provider.
	 * @param options The options.
	 */
	constructor(container: HTMLElement, verticalLayoutProvider: IVerticalSashLayoutProvider, options: IVerticalSashOptions);

	/**
	 * Create a new horizontal sash.
	 *
	 * @param container A DOM node to append the sash to.
	 * @param horizontalLayoutProvider A horizontal layout provider.
	 * @param options The options.
	 */
	constructor(container: HTMLElement, horizontalLayoutProvider: IHorizontalSashLayoutProvider, options: IHorizontalSashOptions);
	constructor(container: HTMLElement, layoutProvider: ISashLayoutProvider, options: ISashOptions) {
		super();

		this.el = append(container, $('.monaco-sash'));

		if (options.orthogonalEdge) {
			this.el.classList.add(`orthogonal-edge-${options.orthogonalEdge}`);
		}

		if (isMacintosh) {
			this.el.classList.add('mac');
		}

		this._register(addDisposableListener(this.el, 'mousedown', e => this.onPointerStart(e, new MouseEventFactory(container))));
		this._register(addDisposableListener(this.el, 'dblclick', e => this.onPointerDoublePress(e)));
		this._register(addDisposableListener(this.el, 'mouseenter', () => Sash.onMouseEnter(this)));
		this._register(addDisposableListener(this.el, 'mouseleave', () => Sash.onMouseLeave(this)));

		this._register(Gesture.addTarget(this.el));

		this._register(addDisposableListener(this.el, EventType.Start, e => this.onPointerStart(e, new GestureEventFactory(this.el))));

		let doubleTapTimeout: Timeout | undefined = undefined;
		this._register(addDisposableListener(this.el, EventType.Tap, event => {
			if (doubleTapTimeout) {
				clearTimeout(doubleTapTimeout);
				doubleTapTimeout = undefined;
				this.onPointerDoublePress(event);
				return;
			}

			clearTimeout(doubleTapTimeout);
			doubleTapTimeout = setTimeout(() => doubleTapTimeout = undefined, 250);
		}));

		if (typeof options.size === 'number') {
			this.size = options.size;

			if (options.orientation === Orientation.VERTICAL) {
				this.el.style.width = `${this.size}px`;
			} else {
				this.el.style.height = `${this.size}px`;
			}
		} else {
			this.size = globalSize;
			this._register(onDidChangeGlobalSize.event(size => {
				this.size = size;
				this.layout();
			}));
		}

		this._register(onDidChangeHoverDelay.event(delay => this.hoverDelay = delay));

		this.layoutProvider = layoutProvider;

		this.orthogonalStartSash = options.orthogonalStartSash;
		this.orthogonalEndSash = options.orthogonalEndSash;

		this.orientation = options.orientation || Orientation.VERTICAL;

		if (this.orientation === Orientation.HORIZONTAL) {
			this.el.classList.add('horizontal');
			this.el.classList.remove('vertical');
		} else {
			this.el.classList.remove('horizontal');
			this.el.classList.add('vertical');
		}

		this.el.classList.toggle('debug', DEBUG);

		this.layout();
	}

	private onPointerStart(event: PointerEvent, pointerEventFactory: IPointerEventFactory): void {
		EventHelper.stop(event);

		let isMultisashResize = false;

		// eslint-disable-next-line local/code-no-any-casts
		if (!(event as any).__orthogonalSashEvent) {
			const orthogonalSash = this.getOrthogonalSash(event);

			if (orthogonalSash) {
				isMultisashResize = true;
				// eslint-disable-next-line local/code-no-any-casts
				(event as any).__orthogonalSashEvent = true;
				orthogonalSash.onPointerStart(event, new OrthogonalPointerEventFactory(pointerEventFactory));
			}
		}

		// eslint-disable-next-line local/code-no-any-casts
		if (this.linkedSash && !(event as any).__linkedSashEvent) {
			// eslint-disable-next-line local/code-no-any-casts
			(event as any).__linkedSashEvent = true;
			this.linkedSash.onPointerStart(event, new OrthogonalPointerEventFactory(pointerEventFactory));
		}

		if (!this.state) {
			return;
		}

		// eslint-disable-next-line no-restricted-syntax
		const iframes = this.el.ownerDocument.getElementsByTagName('iframe');
		for (const iframe of iframes) {
			iframe.classList.add(PointerEventsDisabledCssClass); // disable mouse events on iframes as long as we drag the sash
		}

		const startX = event.pageX;
		const startY = event.pageY;
		const altKey = event.altKey;
		const startEvent: ISashEvent = { startX, currentX: startX, startY, currentY: startY, altKey };

		this.el.classList.add('active');
		this._onDidStart.fire(startEvent);

		// fix https://github.com/microsoft/vscode/issues/21675
		const style = createStyleSheet(this.el);
		const updateStyle = () => {
			let cursor = '';

			if (isMultisashResize) {
				cursor = 'all-scroll';
			} else if (this.orientation === Orientation.HORIZONTAL) {
				if (this.state === SashState.AtMinimum) {
					cursor = 's-resize';
				} else if (this.state === SashState.AtMaximum) {
					cursor = 'n-resize';
				} else {
					cursor = isMacintosh ? 'row-resize' : 'ns-resize';
				}
			} else {
				if (this.state === SashState.AtMinimum) {
					cursor = 'e-resize';
				} else if (this.state === SashState.AtMaximum) {
					cursor = 'w-resize';
				} else {
					cursor = isMacintosh ? 'col-resize' : 'ew-resize';
				}
			}

			style.textContent = `* { cursor: ${cursor} !important; }`;
		};

		const disposables = new DisposableStore();

		updateStyle();

		if (!isMultisashResize) {
			this.onDidEnablementChange.event(updateStyle, null, disposables);
		}

		const onPointerMove = (e: PointerEvent) => {
			EventHelper.stop(e, false);
			const event: ISashEvent = { startX, currentX: e.pageX, startY, currentY: e.pageY, altKey };

			this._onDidChange.fire(event);
		};

		const onPointerUp = (e: PointerEvent) => {
			EventHelper.stop(e, false);

			style.remove();

			this.el.classList.remove('active');
			this._onDidEnd.fire();

			disposables.dispose();

			for (const iframe of iframes) {
				iframe.classList.remove(PointerEventsDisabledCssClass);
			}
		};

		pointerEventFactory.onPointerMove(onPointerMove, null, disposables);
		pointerEventFactory.onPointerUp(onPointerUp, null, disposables);
		disposables.add(pointerEventFactory);
	}

	private onPointerDoublePress(e: MouseEvent): void {
		const orthogonalSash = this.getOrthogonalSash(e);

		if (orthogonalSash) {
			orthogonalSash._onDidReset.fire();
		}

		if (this.linkedSash) {
			this.linkedSash._onDidReset.fire();
		}

		this._onDidReset.fire();
	}

	private static onMouseEnter(sash: Sash, fromLinkedSash: boolean = false): void {
		if (sash.el.classList.contains('active')) {
			sash.hoverDelayer.cancel();
			sash.el.classList.add('hover');
		} else {
			sash.hoverDelayer.trigger(() => sash.el.classList.add('hover'), sash.hoverDelay).then(undefined, () => { });
		}

		if (!fromLinkedSash && sash.linkedSash) {
			Sash.onMouseEnter(sash.linkedSash, true);
		}
	}

	private static onMouseLeave(sash: Sash, fromLinkedSash: boolean = false): void {
		sash.hoverDelayer.cancel();
		sash.el.classList.remove('hover');

		if (!fromLinkedSash && sash.linkedSash) {
			Sash.onMouseLeave(sash.linkedSash, true);
		}
	}

	/**
	 * Forcefully stop any user interactions with this sash.
	 * Useful when hiding a parent component, while the user is still
	 * interacting with the sash.
	 */
	clearSashHoverState(): void {
		Sash.onMouseLeave(this);
	}

	/**
	 * Layout the sash. The sash will size and position itself
	 * based on its provided {@link ISashLayoutProvider layout provider}.
	 */
	layout(): void {
		if (this.orientation === Orientation.VERTICAL) {
			const verticalProvider = (<IVerticalSashLayoutProvider>this.layoutProvider);
			this.el.style.left = verticalProvider.getVerticalSashLeft(this) - (this.size / 2) + 'px';

			if (verticalProvider.getVerticalSashTop) {
				this.el.style.top = verticalProvider.getVerticalSashTop(this) + 'px';
			}

			if (verticalProvider.getVerticalSashHeight) {
				this.el.style.height = verticalProvider.getVerticalSashHeight(this) + 'px';
			}
		} else {
			const horizontalProvider = (<IHorizontalSashLayoutProvider>this.layoutProvider);
			this.el.style.top = horizontalProvider.getHorizontalSashTop(this) - (this.size / 2) + 'px';

			if (horizontalProvider.getHorizontalSashLeft) {
				this.el.style.left = horizontalProvider.getHorizontalSashLeft(this) + 'px';
			}

			if (horizontalProvider.getHorizontalSashWidth) {
				this.el.style.width = horizontalProvider.getHorizontalSashWidth(this) + 'px';
			}
		}
	}

	private getOrthogonalSash(e: PointerEvent): Sash | undefined {
		const target = e.initialTarget ?? e.target;

		if (!target || !(isHTMLElement(target))) {
			return undefined;
		}

		if (target.classList.contains('orthogonal-drag-handle')) {
			return target.classList.contains('start') ? this.orthogonalStartSash : this.orthogonalEndSash;
		}

		return undefined;
	}

	override dispose(): void {
		super.dispose();
		this.el.remove();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/abstractScrollbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/abstractScrollbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../dom.js';
import { createFastDomNode, FastDomNode } from '../../fastDomNode.js';
import { GlobalPointerMoveMonitor } from '../../globalPointerMoveMonitor.js';
import { StandardWheelEvent } from '../../mouseEvent.js';
import { ScrollbarArrow, ScrollbarArrowOptions } from './scrollbarArrow.js';
import { ScrollbarState } from './scrollbarState.js';
import { ScrollbarVisibilityController } from './scrollbarVisibilityController.js';
import { Widget } from '../widget.js';
import * as platform from '../../../common/platform.js';
import { INewScrollPosition, Scrollable, ScrollbarVisibility } from '../../../common/scrollable.js';

/**
 * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
 */
const POINTER_DRAG_RESET_DISTANCE = 140;

export interface ISimplifiedPointerEvent {
	buttons: number;
	pageX: number;
	pageY: number;
}

export interface ScrollbarHost {
	onMouseWheel(mouseWheelEvent: StandardWheelEvent): void;
	onDragStart(): void;
	onDragEnd(): void;
}

export interface AbstractScrollbarOptions {
	lazyRender: boolean;
	host: ScrollbarHost;
	scrollbarState: ScrollbarState;
	visibility: ScrollbarVisibility;
	extraScrollbarClassName: string;
	scrollable: Scrollable;
	scrollByPage: boolean;
}

export abstract class AbstractScrollbar extends Widget {

	protected _host: ScrollbarHost;
	protected _scrollable: Scrollable;
	protected _scrollByPage: boolean;
	private _lazyRender: boolean;
	protected _scrollbarState: ScrollbarState;
	protected _visibilityController: ScrollbarVisibilityController;
	private _pointerMoveMonitor: GlobalPointerMoveMonitor;

	public domNode: FastDomNode<HTMLElement>;
	public slider!: FastDomNode<HTMLElement>;

	protected _shouldRender: boolean;

	constructor(opts: AbstractScrollbarOptions) {
		super();
		this._lazyRender = opts.lazyRender;
		this._host = opts.host;
		this._scrollable = opts.scrollable;
		this._scrollByPage = opts.scrollByPage;
		this._scrollbarState = opts.scrollbarState;
		this._visibilityController = this._register(new ScrollbarVisibilityController(opts.visibility, 'visible scrollbar ' + opts.extraScrollbarClassName, 'invisible scrollbar ' + opts.extraScrollbarClassName));
		this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
		this._pointerMoveMonitor = this._register(new GlobalPointerMoveMonitor());
		this._shouldRender = true;
		this.domNode = createFastDomNode(document.createElement('div'));
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');

		this._visibilityController.setDomNode(this.domNode);
		this.domNode.setPosition('absolute');

		this._register(dom.addDisposableListener(this.domNode.domNode, dom.EventType.POINTER_DOWN, (e: PointerEvent) => this._domNodePointerDown(e)));
	}

	// ----------------- creation

	/**
	 * Creates the dom node for an arrow & adds it to the container
	 */
	protected _createArrow(opts: ScrollbarArrowOptions): void {
		const arrow = this._register(new ScrollbarArrow(opts));
		this.domNode.domNode.appendChild(arrow.bgDomNode);
		this.domNode.domNode.appendChild(arrow.domNode);
	}

	/**
	 * Creates the slider dom node, adds it to the container & hooks up the events
	 */
	protected _createSlider(top: number, left: number, width: number | undefined, height: number | undefined): void {
		this.slider = createFastDomNode(document.createElement('div'));
		this.slider.setClassName('slider');
		this.slider.setPosition('absolute');
		this.slider.setTop(top);
		this.slider.setLeft(left);
		if (typeof width === 'number') {
			this.slider.setWidth(width);
		}
		if (typeof height === 'number') {
			this.slider.setHeight(height);
		}
		this.slider.setLayerHinting(true);
		this.slider.setContain('strict');

		this.domNode.domNode.appendChild(this.slider.domNode);

		this._register(dom.addDisposableListener(
			this.slider.domNode,
			dom.EventType.POINTER_DOWN,
			(e: PointerEvent) => {
				if (e.button === 0) {
					e.preventDefault();
					this._sliderPointerDown(e);
				}
			}
		));

		this.onclick(this.slider.domNode, e => {
			if (e.leftButton) {
				e.stopPropagation();
			}
		});
	}

	// ----------------- Update state

	protected _onElementSize(visibleSize: number): boolean {
		if (this._scrollbarState.setVisibleSize(visibleSize)) {
			this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
			this._shouldRender = true;
			if (!this._lazyRender) {
				this.render();
			}
		}
		return this._shouldRender;
	}

	protected _onElementScrollSize(elementScrollSize: number): boolean {
		if (this._scrollbarState.setScrollSize(elementScrollSize)) {
			this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
			this._shouldRender = true;
			if (!this._lazyRender) {
				this.render();
			}
		}
		return this._shouldRender;
	}

	protected _onElementScrollPosition(elementScrollPosition: number): boolean {
		if (this._scrollbarState.setScrollPosition(elementScrollPosition)) {
			this._visibilityController.setIsNeeded(this._scrollbarState.isNeeded());
			this._shouldRender = true;
			if (!this._lazyRender) {
				this.render();
			}
		}
		return this._shouldRender;
	}

	// ----------------- rendering

	public beginReveal(): void {
		this._visibilityController.setShouldBeVisible(true);
	}

	public beginHide(): void {
		this._visibilityController.setShouldBeVisible(false);
	}

	public render(): void {
		if (!this._shouldRender) {
			return;
		}
		this._shouldRender = false;

		this._renderDomNode(this._scrollbarState.getRectangleLargeSize(), this._scrollbarState.getRectangleSmallSize());
		this._updateSlider(this._scrollbarState.getSliderSize(), this._scrollbarState.getArrowSize() + this._scrollbarState.getSliderPosition());
	}
	// ----------------- DOM events

	private _domNodePointerDown(e: PointerEvent): void {
		if (e.target !== this.domNode.domNode) {
			return;
		}
		this._onPointerDown(e);
	}

	public delegatePointerDown(e: PointerEvent): void {
		const domTop = this.domNode.domNode.getClientRects()[0].top;
		const sliderStart = domTop + this._scrollbarState.getSliderPosition();
		const sliderStop = domTop + this._scrollbarState.getSliderPosition() + this._scrollbarState.getSliderSize();
		const pointerPos = this._sliderPointerPosition(e);
		if (sliderStart <= pointerPos && pointerPos <= sliderStop) {
			// Act as if it was a pointer down on the slider
			if (e.button === 0) {
				e.preventDefault();
				this._sliderPointerDown(e);
			}
		} else {
			// Act as if it was a pointer down on the scrollbar
			this._onPointerDown(e);
		}
	}

	private _onPointerDown(e: PointerEvent): void {
		let offsetX: number;
		let offsetY: number;
		if (e.target === this.domNode.domNode && typeof e.offsetX === 'number' && typeof e.offsetY === 'number') {
			offsetX = e.offsetX;
			offsetY = e.offsetY;
		} else {
			const domNodePosition = dom.getDomNodePagePosition(this.domNode.domNode);
			offsetX = e.pageX - domNodePosition.left;
			offsetY = e.pageY - domNodePosition.top;
		}

		const isMouse = (e.pointerType === 'mouse');
		const isLeftClick = (e.button === 0);

		if (isLeftClick || !isMouse) {
			const offset = this._pointerDownRelativePosition(offsetX, offsetY);
			this._setDesiredScrollPositionNow(
				this._scrollByPage
					? this._scrollbarState.getDesiredScrollPositionFromOffsetPaged(offset)
					: this._scrollbarState.getDesiredScrollPositionFromOffset(offset)
			);
		}

		if (isLeftClick) {
			// left button
			e.preventDefault();
			this._sliderPointerDown(e);
		}
	}

	private _sliderPointerDown(e: PointerEvent): void {
		if (!e.target || !(e.target instanceof Element)) {
			return;
		}
		const initialPointerPosition = this._sliderPointerPosition(e);
		const initialPointerOrthogonalPosition = this._sliderOrthogonalPointerPosition(e);
		const initialScrollbarState = this._scrollbarState.clone();
		this.slider.toggleClassName('active', true);

		this._pointerMoveMonitor.startMonitoring(
			e.target,
			e.pointerId,
			e.buttons,
			(pointerMoveData: PointerEvent) => {
				const pointerOrthogonalPosition = this._sliderOrthogonalPointerPosition(pointerMoveData);
				const pointerOrthogonalDelta = Math.abs(pointerOrthogonalPosition - initialPointerOrthogonalPosition);

				if (platform.isWindows && pointerOrthogonalDelta > POINTER_DRAG_RESET_DISTANCE) {
					// The pointer has wondered away from the scrollbar => reset dragging
					this._setDesiredScrollPositionNow(initialScrollbarState.getScrollPosition());
					return;
				}

				const pointerPosition = this._sliderPointerPosition(pointerMoveData);
				const pointerDelta = pointerPosition - initialPointerPosition;
				this._setDesiredScrollPositionNow(initialScrollbarState.getDesiredScrollPositionFromDelta(pointerDelta));
			},
			() => {
				this.slider.toggleClassName('active', false);
				this._host.onDragEnd();
			}
		);

		this._host.onDragStart();
	}

	private _setDesiredScrollPositionNow(_desiredScrollPosition: number): void {

		const desiredScrollPosition: INewScrollPosition = {};
		this.writeScrollPosition(desiredScrollPosition, _desiredScrollPosition);

		this._scrollable.setScrollPositionNow(desiredScrollPosition);
	}

	public updateScrollbarSize(scrollbarSize: number): void {
		this._updateScrollbarSize(scrollbarSize);
		this._scrollbarState.setScrollbarSize(scrollbarSize);
		this._shouldRender = true;
		if (!this._lazyRender) {
			this.render();
		}
	}

	public isNeeded(): boolean {
		return this._scrollbarState.isNeeded();
	}

	// ----------------- Overwrite these

	protected abstract _renderDomNode(largeSize: number, smallSize: number): void;
	protected abstract _updateSlider(sliderSize: number, sliderPosition: number): void;

	protected abstract _pointerDownRelativePosition(offsetX: number, offsetY: number): number;
	protected abstract _sliderPointerPosition(e: ISimplifiedPointerEvent): number;
	protected abstract _sliderOrthogonalPointerPosition(e: ISimplifiedPointerEvent): number;
	protected abstract _updateScrollbarSize(size: number): void;

	public abstract writeScrollPosition(target: INewScrollPosition, scrollPosition: number): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/horizontalScrollbar.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/horizontalScrollbar.ts

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




export class HorizontalScrollbar extends AbstractScrollbar {

	constructor(scrollable: Scrollable, options: ScrollableElementResolvedOptions, host: ScrollbarHost) {
		const scrollDimensions = scrollable.getScrollDimensions();
		const scrollPosition = scrollable.getCurrentScrollPosition();
		super({
			lazyRender: options.lazyRender,
			host: host,
			scrollbarState: new ScrollbarState(
				(options.horizontalHasArrows ? options.arrowSize : 0),
				(options.horizontal === ScrollbarVisibility.Hidden ? 0 : options.horizontalScrollbarSize),
				(options.vertical === ScrollbarVisibility.Hidden ? 0 : options.verticalScrollbarSize),
				scrollDimensions.width,
				scrollDimensions.scrollWidth,
				scrollPosition.scrollLeft
			),
			visibility: options.horizontal,
			extraScrollbarClassName: 'horizontal',
			scrollable: scrollable,
			scrollByPage: options.scrollByPage
		});

		if (options.horizontalHasArrows) {
			const arrowDelta = (options.arrowSize - ARROW_IMG_SIZE) / 2;
			const scrollbarDelta = (options.horizontalScrollbarSize - ARROW_IMG_SIZE) / 2;

			this._createArrow({
				className: 'scra',
				icon: Codicon.scrollbarButtonLeft,
				top: scrollbarDelta,
				left: arrowDelta,
				bottom: undefined,
				right: undefined,
				bgWidth: options.arrowSize,
				bgHeight: options.horizontalScrollbarSize,
				onActivate: () => this._host.onMouseWheel(new StandardWheelEvent(null, 1, 0)),
			});

			this._createArrow({
				className: 'scra',
				icon: Codicon.scrollbarButtonRight,
				top: scrollbarDelta,
				left: undefined,
				bottom: undefined,
				right: arrowDelta,
				bgWidth: options.arrowSize,
				bgHeight: options.horizontalScrollbarSize,
				onActivate: () => this._host.onMouseWheel(new StandardWheelEvent(null, -1, 0)),
			});
		}

		this._createSlider(Math.floor((options.horizontalScrollbarSize - options.horizontalSliderSize) / 2), 0, undefined, options.horizontalSliderSize);
	}

	protected _updateSlider(sliderSize: number, sliderPosition: number): void {
		this.slider.setWidth(sliderSize);
		this.slider.setLeft(sliderPosition);
	}

	protected _renderDomNode(largeSize: number, smallSize: number): void {
		this.domNode.setWidth(largeSize);
		this.domNode.setHeight(smallSize);
		this.domNode.setLeft(0);
		this.domNode.setBottom(0);
	}

	public onDidScroll(e: ScrollEvent): boolean {
		this._shouldRender = this._onElementScrollSize(e.scrollWidth) || this._shouldRender;
		this._shouldRender = this._onElementScrollPosition(e.scrollLeft) || this._shouldRender;
		this._shouldRender = this._onElementSize(e.width) || this._shouldRender;
		return this._shouldRender;
	}

	protected _pointerDownRelativePosition(offsetX: number, offsetY: number): number {
		return offsetX;
	}

	protected _sliderPointerPosition(e: ISimplifiedPointerEvent): number {
		return e.pageX;
	}

	protected _sliderOrthogonalPointerPosition(e: ISimplifiedPointerEvent): number {
		return e.pageY;
	}

	protected _updateScrollbarSize(size: number): void {
		this.slider.setHeight(size);
	}

	public writeScrollPosition(target: INewScrollPosition, scrollPosition: number): void {
		target.scrollLeft = scrollPosition;
	}

	public updateOptions(options: ScrollableElementResolvedOptions): void {
		this.updateScrollbarSize(options.horizontal === ScrollbarVisibility.Hidden ? 0 : options.horizontalScrollbarSize);
		this._scrollbarState.setOppositeScrollbarSize(options.vertical === ScrollbarVisibility.Hidden ? 0 : options.verticalScrollbarSize);
		this._visibilityController.setVisibility(options.horizontal);
		this._scrollByPage = options.scrollByPage;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/scrollableElement.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/scrollableElement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getZoomFactor, isChrome } from '../../browser.js';
import * as dom from '../../dom.js';
import { FastDomNode, createFastDomNode } from '../../fastDomNode.js';
import { IMouseEvent, IMouseWheelEvent, StandardWheelEvent } from '../../mouseEvent.js';
import { ScrollbarHost } from './abstractScrollbar.js';
import { HorizontalScrollbar } from './horizontalScrollbar.js';
import { ScrollableElementChangeOptions, ScrollableElementCreationOptions, ScrollableElementResolvedOptions } from './scrollableElementOptions.js';
import { VerticalScrollbar } from './verticalScrollbar.js';
import { Widget } from '../widget.js';
import { TimeoutTimer } from '../../../common/async.js';
import { Emitter, Event } from '../../../common/event.js';
import { IDisposable, dispose } from '../../../common/lifecycle.js';
import * as platform from '../../../common/platform.js';
import { INewScrollDimensions, INewScrollPosition, IScrollDimensions, IScrollPosition, ScrollEvent, Scrollable, ScrollbarVisibility } from '../../../common/scrollable.js';
import './media/scrollbars.css';

const HIDE_TIMEOUT = 500;
const SCROLL_WHEEL_SENSITIVITY = 50;
const SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED = true;

export interface IOverviewRulerLayoutInfo {
	parent: HTMLElement;
	insertBefore: HTMLElement;
}

class MouseWheelClassifierItem {
	public timestamp: number;
	public deltaX: number;
	public deltaY: number;
	public score: number;

	constructor(timestamp: number, deltaX: number, deltaY: number) {
		this.timestamp = timestamp;
		this.deltaX = deltaX;
		this.deltaY = deltaY;
		this.score = 0;
	}
}

export class MouseWheelClassifier {

	public static readonly INSTANCE = new MouseWheelClassifier();

	private readonly _capacity: number;
	private _memory: MouseWheelClassifierItem[];
	private _front: number;
	private _rear: number;

	constructor() {
		this._capacity = 5;
		this._memory = [];
		this._front = -1;
		this._rear = -1;
	}

	public isPhysicalMouseWheel(): boolean {
		if (this._front === -1 && this._rear === -1) {
			// no elements
			return false;
		}

		// 0.5 * last + 0.25 * 2nd last + 0.125 * 3rd last + ...
		let remainingInfluence = 1;
		let score = 0;
		let iteration = 1;

		let index = this._rear;
		do {
			const influence = (index === this._front ? remainingInfluence : Math.pow(2, -iteration));
			remainingInfluence -= influence;
			score += this._memory[index].score * influence;

			if (index === this._front) {
				break;
			}

			index = (this._capacity + index - 1) % this._capacity;
			iteration++;
		} while (true);

		return (score <= 0.5);
	}

	public acceptStandardWheelEvent(e: StandardWheelEvent): void {
		if (isChrome) {
			const targetWindow = dom.getWindow(e.browserEvent);
			const pageZoomFactor = getZoomFactor(targetWindow);
			// On Chrome, the incoming delta events are multiplied with the OS zoom factor.
			// The OS zoom factor can be reverse engineered by using the device pixel ratio and the configured zoom factor into account.
			this.accept(Date.now(), e.deltaX * pageZoomFactor, e.deltaY * pageZoomFactor);
		} else {
			this.accept(Date.now(), e.deltaX, e.deltaY);
		}
	}

	public accept(timestamp: number, deltaX: number, deltaY: number): void {
		let previousItem = null;
		const item = new MouseWheelClassifierItem(timestamp, deltaX, deltaY);

		if (this._front === -1 && this._rear === -1) {
			this._memory[0] = item;
			this._front = 0;
			this._rear = 0;
		} else {
			previousItem = this._memory[this._rear];

			this._rear = (this._rear + 1) % this._capacity;
			if (this._rear === this._front) {
				// Drop oldest
				this._front = (this._front + 1) % this._capacity;
			}
			this._memory[this._rear] = item;
		}

		item.score = this._computeScore(item, previousItem);
	}

	/**
	 * A score between 0 and 1 for `item`.
	 *  - a score towards 0 indicates that the source appears to be a physical mouse wheel
	 *  - a score towards 1 indicates that the source appears to be a touchpad or magic mouse, etc.
	 */
	private _computeScore(item: MouseWheelClassifierItem, previousItem: MouseWheelClassifierItem | null): number {

		if (Math.abs(item.deltaX) > 0 && Math.abs(item.deltaY) > 0) {
			// both axes exercised => definitely not a physical mouse wheel
			return 1;
		}

		let score: number = 0.5;

		if (!this._isAlmostInt(item.deltaX) || !this._isAlmostInt(item.deltaY)) {
			// non-integer deltas => indicator that this is not a physical mouse wheel
			score += 0.25;
		}

		// Non-accelerating scroll => indicator that this is a physical mouse wheel
		// These can be identified by seeing whether they are the module of one another.
		if (previousItem) {
			const absDeltaX = Math.abs(item.deltaX);
			const absDeltaY = Math.abs(item.deltaY);

			const absPreviousDeltaX = Math.abs(previousItem.deltaX);
			const absPreviousDeltaY = Math.abs(previousItem.deltaY);

			// Min 1 to avoid division by zero, module 1 will still be 0.
			const minDeltaX = Math.max(Math.min(absDeltaX, absPreviousDeltaX), 1);
			const minDeltaY = Math.max(Math.min(absDeltaY, absPreviousDeltaY), 1);

			const maxDeltaX = Math.max(absDeltaX, absPreviousDeltaX);
			const maxDeltaY = Math.max(absDeltaY, absPreviousDeltaY);

			const isSameModulo = (maxDeltaX % minDeltaX === 0 && maxDeltaY % minDeltaY === 0);
			if (isSameModulo) {
				score -= 0.5;
			}
		}

		return Math.min(Math.max(score, 0), 1);
	}

	private _isAlmostInt(value: number): boolean {
		const epsilon = Number.EPSILON * 100; // Use a small tolerance factor for floating-point errors
		const delta = Math.abs(Math.round(value) - value);
		return (delta < 0.01 + epsilon);
	}
}

export abstract class AbstractScrollableElement extends Widget {

	private readonly _options: ScrollableElementResolvedOptions;
	protected readonly _scrollable: Scrollable;
	private readonly _verticalScrollbar: VerticalScrollbar;
	private readonly _horizontalScrollbar: HorizontalScrollbar;
	private readonly _domNode: HTMLElement;

	private readonly _leftShadowDomNode: FastDomNode<HTMLElement> | null;
	private readonly _topShadowDomNode: FastDomNode<HTMLElement> | null;
	private readonly _topLeftShadowDomNode: FastDomNode<HTMLElement> | null;

	private readonly _listenOnDomNode: HTMLElement;

	private _mouseWheelToDispose: IDisposable[];

	private _isDragging: boolean;
	private _mouseIsOver: boolean;

	private readonly _hideTimeout: TimeoutTimer;
	private _shouldRender: boolean;

	private _revealOnScroll: boolean;

	private _inertialTimeout: TimeoutTimer | null = null;
	private _inertialSpeed: { X: number; Y: number } = { X: 0, Y: 0 };

	private readonly _onScroll = this._register(new Emitter<ScrollEvent>());
	public get onScroll(): Event<ScrollEvent> { return this._onScroll.event; }

	private readonly _onWillScroll = this._register(new Emitter<ScrollEvent>());
	public get onWillScroll(): Event<ScrollEvent> { return this._onWillScroll.event; }

	public get options(): Readonly<ScrollableElementResolvedOptions> {
		return this._options;
	}

	protected constructor(element: HTMLElement, options: ScrollableElementCreationOptions, scrollable: Scrollable) {
		super();
		element.style.overflow = 'hidden';
		this._options = resolveOptions(options);
		this._scrollable = scrollable;

		this._register(this._scrollable.onScroll((e) => {
			this._onWillScroll.fire(e);
			this._onDidScroll(e);
			this._onScroll.fire(e);
		}));

		const scrollbarHost: ScrollbarHost = {
			onMouseWheel: (mouseWheelEvent: StandardWheelEvent) => this._onMouseWheel(mouseWheelEvent),
			onDragStart: () => this._onDragStart(),
			onDragEnd: () => this._onDragEnd(),
		};
		this._verticalScrollbar = this._register(new VerticalScrollbar(this._scrollable, this._options, scrollbarHost));
		this._horizontalScrollbar = this._register(new HorizontalScrollbar(this._scrollable, this._options, scrollbarHost));

		this._domNode = document.createElement('div');
		this._domNode.className = 'monaco-scrollable-element ' + this._options.className;
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.style.position = 'relative';
		this._domNode.style.overflow = 'hidden';
		this._domNode.appendChild(element);
		this._domNode.appendChild(this._horizontalScrollbar.domNode.domNode);
		this._domNode.appendChild(this._verticalScrollbar.domNode.domNode);

		if (this._options.useShadows) {
			this._leftShadowDomNode = createFastDomNode(document.createElement('div'));
			this._leftShadowDomNode.setClassName('shadow');
			this._domNode.appendChild(this._leftShadowDomNode.domNode);

			this._topShadowDomNode = createFastDomNode(document.createElement('div'));
			this._topShadowDomNode.setClassName('shadow');
			this._domNode.appendChild(this._topShadowDomNode.domNode);

			this._topLeftShadowDomNode = createFastDomNode(document.createElement('div'));
			this._topLeftShadowDomNode.setClassName('shadow');
			this._domNode.appendChild(this._topLeftShadowDomNode.domNode);
		} else {
			this._leftShadowDomNode = null;
			this._topShadowDomNode = null;
			this._topLeftShadowDomNode = null;
		}

		this._listenOnDomNode = this._options.listenOnDomNode || this._domNode;

		this._mouseWheelToDispose = [];
		this._setListeningToMouseWheel(this._options.handleMouseWheel);

		this.onmouseover(this._listenOnDomNode, (e) => this._onMouseOver(e));
		this.onmouseleave(this._listenOnDomNode, (e) => this._onMouseLeave(e));

		this._hideTimeout = this._register(new TimeoutTimer());
		this._isDragging = false;
		this._mouseIsOver = false;

		this._shouldRender = true;

		this._revealOnScroll = true;
	}

	public override dispose(): void {
		this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);
		if (this._inertialTimeout) {
			this._inertialTimeout.dispose();
			this._inertialTimeout = null;
		}
		super.dispose();
	}

	/**
	 * Get the generated 'scrollable' dom node
	 */
	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getOverviewRulerLayoutInfo(): IOverviewRulerLayoutInfo {
		return {
			parent: this._domNode,
			insertBefore: this._verticalScrollbar.domNode.domNode,
		};
	}

	/**
	 * Delegate a pointer down event to the vertical scrollbar.
	 * This is to help with clicking somewhere else and having the scrollbar react.
	 */
	public delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent): void {
		this._verticalScrollbar.delegatePointerDown(browserEvent);
	}

	public getScrollDimensions(): IScrollDimensions {
		return this._scrollable.getScrollDimensions();
	}

	public setScrollDimensions(dimensions: INewScrollDimensions): void {
		this._scrollable.setScrollDimensions(dimensions, false);
	}

	/**
	 * Update the class name of the scrollable element.
	 */
	public updateClassName(newClassName: string): void {
		this._options.className = newClassName;
		// Defaults are different on Macs
		if (platform.isMacintosh) {
			this._options.className += ' mac';
		}
		this._domNode.className = 'monaco-scrollable-element ' + this._options.className;
	}

	/**
	 * Update configuration options for the scrollbar.
	 */
	public updateOptions(newOptions: ScrollableElementChangeOptions): void {
		if (typeof newOptions.handleMouseWheel !== 'undefined') {
			this._options.handleMouseWheel = newOptions.handleMouseWheel;
			this._setListeningToMouseWheel(this._options.handleMouseWheel);
		}
		if (typeof newOptions.mouseWheelScrollSensitivity !== 'undefined') {
			this._options.mouseWheelScrollSensitivity = newOptions.mouseWheelScrollSensitivity;
		}
		if (typeof newOptions.fastScrollSensitivity !== 'undefined') {
			this._options.fastScrollSensitivity = newOptions.fastScrollSensitivity;
		}
		if (typeof newOptions.scrollPredominantAxis !== 'undefined') {
			this._options.scrollPredominantAxis = newOptions.scrollPredominantAxis;
		}
		if (typeof newOptions.horizontal !== 'undefined') {
			this._options.horizontal = newOptions.horizontal;
		}
		if (typeof newOptions.vertical !== 'undefined') {
			this._options.vertical = newOptions.vertical;
		}
		if (typeof newOptions.horizontalScrollbarSize !== 'undefined') {
			this._options.horizontalScrollbarSize = newOptions.horizontalScrollbarSize;
		}
		if (typeof newOptions.verticalScrollbarSize !== 'undefined') {
			this._options.verticalScrollbarSize = newOptions.verticalScrollbarSize;
		}
		if (typeof newOptions.scrollByPage !== 'undefined') {
			this._options.scrollByPage = newOptions.scrollByPage;
		}
		this._horizontalScrollbar.updateOptions(this._options);
		this._verticalScrollbar.updateOptions(this._options);

		if (!this._options.lazyRender) {
			this._render();
		}
	}

	public setRevealOnScroll(value: boolean) {
		this._revealOnScroll = value;
	}

	public delegateScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this._onMouseWheel(new StandardWheelEvent(browserEvent));
	}

	private async _periodicSync(): Promise<void> {
		let scheduleAgain = false;

		if (this._inertialSpeed.X !== 0 || this._inertialSpeed.Y !== 0) {
			this._scrollable.setScrollPositionNow({
				scrollTop: this._scrollable.getCurrentScrollPosition().scrollTop - this._inertialSpeed.Y * 100,
				scrollLeft: this._scrollable.getCurrentScrollPosition().scrollLeft - this._inertialSpeed.X * 100
			});
			this._inertialSpeed.X *= 0.9;
			this._inertialSpeed.Y *= 0.9;
			if (Math.abs(this._inertialSpeed.X) < 0.01) {
				this._inertialSpeed.X = 0;
			}
			if (Math.abs(this._inertialSpeed.Y) < 0.01) {
				this._inertialSpeed.Y = 0;
			}

			scheduleAgain = (this._inertialSpeed.X !== 0 || this._inertialSpeed.Y !== 0);
		}

		if (scheduleAgain) {
			if (!this._inertialTimeout) {
				this._inertialTimeout = new TimeoutTimer();
			}
			this._inertialTimeout.cancelAndSet(() => this._periodicSync(), 1000 / 60);
		} else {
			this._inertialTimeout?.dispose();
			this._inertialTimeout = null;
		}
	}

	// -------------------- mouse wheel scrolling --------------------

	private _setListeningToMouseWheel(shouldListen: boolean): void {
		const isListening = (this._mouseWheelToDispose.length > 0);

		if (isListening === shouldListen) {
			// No change
			return;
		}

		// Stop listening (if necessary)
		this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);

		// Start listening (if necessary)
		if (shouldListen) {
			const onMouseWheel = (browserEvent: IMouseWheelEvent) => {
				this._onMouseWheel(new StandardWheelEvent(browserEvent));
			};

			this._mouseWheelToDispose.push(dom.addDisposableListener(this._listenOnDomNode, dom.EventType.MOUSE_WHEEL, onMouseWheel, { passive: false }));
		}
	}

	private _onMouseWheel(e: StandardWheelEvent): void {
		if (e.browserEvent?.defaultPrevented) {
			return;
		}

		const classifier = MouseWheelClassifier.INSTANCE;
		if (SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED) {
			classifier.acceptStandardWheelEvent(e);
		}

		// useful for creating unit tests:
		// console.log(`${Date.now()}, ${e.deltaY}, ${e.deltaX}`);

		let didScroll = false;

		if (e.deltaY || e.deltaX) {
			let deltaY = e.deltaY * this._options.mouseWheelScrollSensitivity;
			let deltaX = e.deltaX * this._options.mouseWheelScrollSensitivity;

			if (this._options.scrollPredominantAxis) {
				if (this._options.scrollYToX && deltaX + deltaY === 0) {
					// when configured to map Y to X and we both see
					// no dominant axis and X and Y are competing with
					// identical values into opposite directions, we
					// ignore the delta as we cannot make a decision then
					deltaX = deltaY = 0;
				} else if (Math.abs(deltaY) >= Math.abs(deltaX)) {
					deltaX = 0;
				} else {
					deltaY = 0;
				}
			}

			if (this._options.flipAxes) {
				[deltaY, deltaX] = [deltaX, deltaY];
			}

			// Convert vertical scrolling to horizontal if shift is held, this
			// is handled at a higher level on Mac
			const shiftConvert = !platform.isMacintosh && e.browserEvent && e.browserEvent.shiftKey;
			if ((this._options.scrollYToX || shiftConvert) && !deltaX) {
				deltaX = deltaY;
				deltaY = 0;
			}

			if (e.browserEvent && e.browserEvent.altKey) {
				// fastScrolling
				deltaX = deltaX * this._options.fastScrollSensitivity;
				deltaY = deltaY * this._options.fastScrollSensitivity;
			}

			const futureScrollPosition = this._scrollable.getFutureScrollPosition();

			let desiredScrollPosition: INewScrollPosition = {};
			if (deltaY) {
				const deltaScrollTop = SCROLL_WHEEL_SENSITIVITY * deltaY;
				// Here we convert values such as -0.3 to -1 or 0.3 to 1, otherwise low speed scrolling will never scroll
				const desiredScrollTop = futureScrollPosition.scrollTop - (deltaScrollTop < 0 ? Math.floor(deltaScrollTop) : Math.ceil(deltaScrollTop));
				this._verticalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollTop);
			}
			if (deltaX) {
				const deltaScrollLeft = SCROLL_WHEEL_SENSITIVITY * deltaX;
				// Here we convert values such as -0.3 to -1 or 0.3 to 1, otherwise low speed scrolling will never scroll
				const desiredScrollLeft = futureScrollPosition.scrollLeft - (deltaScrollLeft < 0 ? Math.floor(deltaScrollLeft) : Math.ceil(deltaScrollLeft));
				this._horizontalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollLeft);
			}

			// Check that we are scrolling towards a location which is valid
			desiredScrollPosition = this._scrollable.validateScrollPosition(desiredScrollPosition);

			if (this._options.inertialScroll && (deltaX || deltaY) && !classifier.isPhysicalMouseWheel()) {
				let startPeriodic = false;
				// Only start periodic if it's not running
				if (this._inertialSpeed.X === 0 && this._inertialSpeed.Y === 0) {
					startPeriodic = true;
				}
				this._inertialSpeed.Y = (deltaY < 0 ? -1 : 1) * (Math.abs(deltaY) ** 1.02);
				this._inertialSpeed.X = (deltaX < 0 ? -1 : 1) * (Math.abs(deltaX) ** 1.02);
				if (startPeriodic) {
					this._periodicSync();
				}
			}

			if (futureScrollPosition.scrollLeft !== desiredScrollPosition.scrollLeft || futureScrollPosition.scrollTop !== desiredScrollPosition.scrollTop) {

				const canPerformSmoothScroll = (
					SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED
					&& this._options.mouseWheelSmoothScroll
					&& classifier.isPhysicalMouseWheel()
				);

				if (canPerformSmoothScroll) {
					this._scrollable.setScrollPositionSmooth(desiredScrollPosition);
				} else {
					this._scrollable.setScrollPositionNow(desiredScrollPosition);
				}

				didScroll = true;
			}
		}

		let consumeMouseWheel = didScroll;
		if (!consumeMouseWheel && this._options.alwaysConsumeMouseWheel) {
			consumeMouseWheel = true;
		}
		if (!consumeMouseWheel && this._options.consumeMouseWheelIfScrollbarIsNeeded && (this._verticalScrollbar.isNeeded() || this._horizontalScrollbar.isNeeded())) {
			consumeMouseWheel = true;
		}

		if (consumeMouseWheel) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	private _onDidScroll(e: ScrollEvent): void {
		this._shouldRender = this._horizontalScrollbar.onDidScroll(e) || this._shouldRender;
		this._shouldRender = this._verticalScrollbar.onDidScroll(e) || this._shouldRender;

		if (this._options.useShadows) {
			this._shouldRender = true;
		}

		if (this._revealOnScroll) {
			this._reveal();
		}

		if (!this._options.lazyRender) {
			this._render();
		}
	}

	/**
	 * Render / mutate the DOM now.
	 * Should be used together with the ctor option `lazyRender`.
	 */
	public renderNow(): void {
		if (!this._options.lazyRender) {
			throw new Error('Please use `lazyRender` together with `renderNow`!');
		}

		this._render();
	}

	private _render(): void {
		if (!this._shouldRender) {
			return;
		}

		this._shouldRender = false;

		this._horizontalScrollbar.render();
		this._verticalScrollbar.render();

		if (this._options.useShadows) {
			const scrollState = this._scrollable.getCurrentScrollPosition();
			const enableTop = scrollState.scrollTop > 0;
			const enableLeft = scrollState.scrollLeft > 0;

			const leftClassName = (enableLeft ? ' left' : '');
			const topClassName = (enableTop ? ' top' : '');
			const topLeftClassName = (enableLeft || enableTop ? ' top-left-corner' : '');
			this._leftShadowDomNode!.setClassName(`shadow${leftClassName}`);
			this._topShadowDomNode!.setClassName(`shadow${topClassName}`);
			this._topLeftShadowDomNode!.setClassName(`shadow${topLeftClassName}${topClassName}${leftClassName}`);
		}
	}

	// -------------------- fade in / fade out --------------------

	private _onDragStart(): void {
		this._isDragging = true;
		this._reveal();
	}

	private _onDragEnd(): void {
		this._isDragging = false;
		this._hide();
	}

	private _onMouseLeave(e: IMouseEvent): void {
		this._mouseIsOver = false;
		this._hide();
	}

	private _onMouseOver(e: IMouseEvent): void {
		this._mouseIsOver = true;
		this._reveal();
	}

	private _reveal(): void {
		this._verticalScrollbar.beginReveal();
		this._horizontalScrollbar.beginReveal();
		this._scheduleHide();
	}

	private _hide(): void {
		if (!this._mouseIsOver && !this._isDragging) {
			this._verticalScrollbar.beginHide();
			this._horizontalScrollbar.beginHide();
		}
	}

	private _scheduleHide(): void {
		if (!this._mouseIsOver && !this._isDragging) {
			this._hideTimeout.cancelAndSet(() => this._hide(), HIDE_TIMEOUT);
		}
	}
}

export class ScrollableElement extends AbstractScrollableElement {

	constructor(element: HTMLElement, options: ScrollableElementCreationOptions) {
		options = options || {};
		options.mouseWheelSmoothScroll = false;
		const scrollable = new Scrollable({
			forceIntegerValues: true,
			smoothScrollDuration: 0,
			scheduleAtNextAnimationFrame: (callback) => dom.scheduleAtNextAnimationFrame(dom.getWindow(element), callback)
		});
		super(element, options, scrollable);
		this._register(scrollable);
	}

	public setScrollPosition(update: INewScrollPosition): void {
		this._scrollable.setScrollPositionNow(update);
	}

	public getScrollPosition(): IScrollPosition {
		return this._scrollable.getCurrentScrollPosition();
	}
}

export class SmoothScrollableElement extends AbstractScrollableElement {

	constructor(element: HTMLElement, options: ScrollableElementCreationOptions, scrollable: Scrollable) {
		super(element, options, scrollable);
	}

	public setScrollPosition(update: INewScrollPosition & { reuseAnimation?: boolean }): void {
		if (update.reuseAnimation) {
			this._scrollable.setScrollPositionSmooth(update, update.reuseAnimation);
		} else {
			this._scrollable.setScrollPositionNow(update);
		}
	}

	public getScrollPosition(): IScrollPosition {
		return this._scrollable.getCurrentScrollPosition();
	}

}

export class DomScrollableElement extends AbstractScrollableElement {

	private _element: HTMLElement;

	constructor(element: HTMLElement, options: ScrollableElementCreationOptions) {
		options = options || {};
		options.mouseWheelSmoothScroll = false;
		const scrollable = new Scrollable({
			forceIntegerValues: false, // See https://github.com/microsoft/vscode/issues/139877
			smoothScrollDuration: 0,
			scheduleAtNextAnimationFrame: (callback) => dom.scheduleAtNextAnimationFrame(dom.getWindow(element), callback)
		});
		super(element, options, scrollable);
		this._register(scrollable);
		this._element = element;
		this._register(this.onScroll((e) => {
			if (e.scrollTopChanged) {
				this._element.scrollTop = e.scrollTop;
			}
			if (e.scrollLeftChanged) {
				this._element.scrollLeft = e.scrollLeft;
			}
		}));
		this.scanDomNode();
	}

	public setScrollPosition(update: INewScrollPosition): void {
		this._scrollable.setScrollPositionNow(update);
	}

	public getScrollPosition(): IScrollPosition {
		return this._scrollable.getCurrentScrollPosition();
	}

	public scanDomNode(): void {
		// width, scrollLeft, scrollWidth, height, scrollTop, scrollHeight
		this.setScrollDimensions({
			width: this._element.clientWidth,
			scrollWidth: this._element.scrollWidth,
			height: this._element.clientHeight,
			scrollHeight: this._element.scrollHeight
		});
		this.setScrollPosition({
			scrollLeft: this._element.scrollLeft,
			scrollTop: this._element.scrollTop,
		});
	}
}

function resolveOptions(opts: ScrollableElementCreationOptions): ScrollableElementResolvedOptions {
	const result: ScrollableElementResolvedOptions = {
		lazyRender: (typeof opts.lazyRender !== 'undefined' ? opts.lazyRender : false),
		className: (typeof opts.className !== 'undefined' ? opts.className : ''),
		useShadows: (typeof opts.useShadows !== 'undefined' ? opts.useShadows : true),
		handleMouseWheel: (typeof opts.handleMouseWheel !== 'undefined' ? opts.handleMouseWheel : true),
		flipAxes: (typeof opts.flipAxes !== 'undefined' ? opts.flipAxes : false),
		consumeMouseWheelIfScrollbarIsNeeded: (typeof opts.consumeMouseWheelIfScrollbarIsNeeded !== 'undefined' ? opts.consumeMouseWheelIfScrollbarIsNeeded : false),
		alwaysConsumeMouseWheel: (typeof opts.alwaysConsumeMouseWheel !== 'undefined' ? opts.alwaysConsumeMouseWheel : false),
		scrollYToX: (typeof opts.scrollYToX !== 'undefined' ? opts.scrollYToX : false),
		mouseWheelScrollSensitivity: (typeof opts.mouseWheelScrollSensitivity !== 'undefined' ? opts.mouseWheelScrollSensitivity : 1),
		fastScrollSensitivity: (typeof opts.fastScrollSensitivity !== 'undefined' ? opts.fastScrollSensitivity : 5),
		scrollPredominantAxis: (typeof opts.scrollPredominantAxis !== 'undefined' ? opts.scrollPredominantAxis : true),
		mouseWheelSmoothScroll: (typeof opts.mouseWheelSmoothScroll !== 'undefined' ? opts.mouseWheelSmoothScroll : true),
		inertialScroll: (typeof opts.inertialScroll !== 'undefined' ? opts.inertialScroll : false),
		arrowSize: (typeof opts.arrowSize !== 'undefined' ? opts.arrowSize : 11),

		listenOnDomNode: (typeof opts.listenOnDomNode !== 'undefined' ? opts.listenOnDomNode : null),

		horizontal: (typeof opts.horizontal !== 'undefined' ? opts.horizontal : ScrollbarVisibility.Auto),
		horizontalScrollbarSize: (typeof opts.horizontalScrollbarSize !== 'undefined' ? opts.horizontalScrollbarSize : 10),
		horizontalSliderSize: (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : 0),
		horizontalHasArrows: (typeof opts.horizontalHasArrows !== 'undefined' ? opts.horizontalHasArrows : false),

		vertical: (typeof opts.vertical !== 'undefined' ? opts.vertical : ScrollbarVisibility.Auto),
		verticalScrollbarSize: (typeof opts.verticalScrollbarSize !== 'undefined' ? opts.verticalScrollbarSize : 10),
		verticalHasArrows: (typeof opts.verticalHasArrows !== 'undefined' ? opts.verticalHasArrows : false),
		verticalSliderSize: (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : 0),

		scrollByPage: (typeof opts.scrollByPage !== 'undefined' ? opts.scrollByPage : false)
	};

	result.horizontalSliderSize = (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : result.horizontalScrollbarSize);
	result.verticalSliderSize = (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : result.verticalScrollbarSize);

	// Defaults are different on Macs
	if (platform.isMacintosh) {
		result.className += ' mac';
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/scrollableElementOptions.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/scrollableElementOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ScrollbarVisibility } from '../../../common/scrollable.js';

export interface ScrollableElementCreationOptions {
	/**
	 * The scrollable element should not do any DOM mutations until renderNow() is called.
	 * Defaults to false.
	 */
	lazyRender?: boolean;
	/**
	 * CSS Class name for the scrollable element.
	 */
	className?: string;
	/**
	 * Drop subtle horizontal and vertical shadows.
	 * Defaults to false.
	 */
	useShadows?: boolean;
	/**
	 * Handle mouse wheel (listen to mouse wheel scrolling).
	 * Defaults to true
	 */
	handleMouseWheel?: boolean;
	/**
	 * If mouse wheel is handled, make mouse wheel scrolling smooth.
	 * Defaults to true.
	 */
	mouseWheelSmoothScroll?: boolean;
	/**
	 * Make scrolling inertial - mostly useful with touchpad on linux.
	 */
	inertialScroll?: boolean;
	/**
	 * Flip axes. Treat vertical scrolling like horizontal and vice-versa.
	 * Defaults to false.
	 */
	flipAxes?: boolean;
	/**
	 * If enabled, will scroll horizontally when scrolling vertical.
	 * Defaults to false.
	 */
	scrollYToX?: boolean;
	/**
	 * Consume all mouse wheel events if a scrollbar is needed (i.e. scrollSize > size).
	 * Defaults to false.
	 */
	consumeMouseWheelIfScrollbarIsNeeded?: boolean;
	/**
	 * Always consume mouse wheel events, even when scrolling is no longer possible.
	 * Defaults to false.
	 */
	alwaysConsumeMouseWheel?: boolean;
	/**
	 * A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.
	 * Defaults to 1.
	 */
	mouseWheelScrollSensitivity?: number;
	/**
	 * FastScrolling mulitplier speed when pressing `Alt`
	 * Defaults to 5.
	 */
	fastScrollSensitivity?: number;
	/**
	 * Whether the scrollable will only scroll along the predominant axis when scrolling both
	 * vertically and horizontally at the same time.
	 * Prevents horizontal drift when scrolling vertically on a trackpad.
	 * Defaults to true.
	 */
	scrollPredominantAxis?: boolean;
	/**
	 * Height for vertical arrows (top/bottom) and width for horizontal arrows (left/right).
	 * Defaults to 11.
	 */
	arrowSize?: number;
	/**
	 * The dom node events should be bound to.
	 * If no listenOnDomNode is provided, the dom node passed to the constructor will be used for event listening.
	 */
	listenOnDomNode?: HTMLElement;
	/**
	 * Control the visibility of the horizontal scrollbar.
	 * Accepted values: 'auto' (on mouse over), 'visible' (always visible), 'hidden' (never visible)
	 * Defaults to 'auto'.
	 */
	horizontal?: ScrollbarVisibility;
	/**
	 * Height (in px) of the horizontal scrollbar.
	 * Defaults to 10.
	 */
	horizontalScrollbarSize?: number;
	/**
	 * Height (in px) of the horizontal scrollbar slider.
	 * Defaults to `horizontalScrollbarSize`
	 */
	horizontalSliderSize?: number;
	/**
	 * Render arrows (left/right) for the horizontal scrollbar.
	 * Defaults to false.
	 */
	horizontalHasArrows?: boolean;
	/**
	 * Control the visibility of the vertical scrollbar.
	 * Accepted values: 'auto' (on mouse over), 'visible' (always visible), 'hidden' (never visible)
	 * Defaults to 'auto'.
	 */
	vertical?: ScrollbarVisibility;
	/**
	 * Width (in px) of the vertical scrollbar.
	 * Defaults to 10.
	 */
	verticalScrollbarSize?: number;
	/**
	 * Width (in px) of the vertical scrollbar slider.
	 * Defaults to `verticalScrollbarSize`
	 */
	verticalSliderSize?: number;
	/**
	 * Render arrows (top/bottom) for the vertical scrollbar.
	 * Defaults to false.
	 */
	verticalHasArrows?: boolean;
	/**
	 * Scroll gutter clicks move by page vs. jump to position.
	 * Defaults to false.
	 */
	scrollByPage?: boolean;
}

export interface ScrollableElementChangeOptions {
	handleMouseWheel?: boolean;
	mouseWheelScrollSensitivity?: number;
	fastScrollSensitivity?: number;
	scrollPredominantAxis?: boolean;
	horizontal?: ScrollbarVisibility;
	horizontalScrollbarSize?: number;
	vertical?: ScrollbarVisibility;
	verticalScrollbarSize?: number;
	scrollByPage?: boolean;
}

export interface ScrollableElementResolvedOptions {
	lazyRender: boolean;
	className: string;
	useShadows: boolean;
	handleMouseWheel: boolean;
	flipAxes: boolean;
	scrollYToX: boolean;
	consumeMouseWheelIfScrollbarIsNeeded: boolean;
	alwaysConsumeMouseWheel: boolean;
	mouseWheelScrollSensitivity: number;
	fastScrollSensitivity: number;
	scrollPredominantAxis: boolean;
	mouseWheelSmoothScroll: boolean;
	inertialScroll: boolean;
	arrowSize: number;
	listenOnDomNode: HTMLElement | null;
	horizontal: ScrollbarVisibility;
	horizontalScrollbarSize: number;
	horizontalSliderSize: number;
	horizontalHasArrows: boolean;
	vertical: ScrollbarVisibility;
	verticalScrollbarSize: number;
	verticalSliderSize: number;
	verticalHasArrows: boolean;
	scrollByPage: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/scrollbarArrow.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/scrollbarArrow.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GlobalPointerMoveMonitor } from '../../globalPointerMoveMonitor.js';
import { Widget } from '../widget.js';
import { TimeoutTimer } from '../../../common/async.js';
import { ThemeIcon } from '../../../common/themables.js';
import * as dom from '../../dom.js';

/**
 * The arrow image size.
 */
export const ARROW_IMG_SIZE = 11;

export interface ScrollbarArrowOptions {
	onActivate: () => void;
	className: string;
	icon: ThemeIcon;

	bgWidth: number;
	bgHeight: number;

	top?: number;
	left?: number;
	bottom?: number;
	right?: number;
}

export class ScrollbarArrow extends Widget {

	private _onActivate: () => void;
	public bgDomNode: HTMLElement;
	public domNode: HTMLElement;
	private _pointerdownRepeatTimer: dom.WindowIntervalTimer;
	private _pointerdownScheduleRepeatTimer: TimeoutTimer;
	private _pointerMoveMonitor: GlobalPointerMoveMonitor;

	constructor(opts: ScrollbarArrowOptions) {
		super();
		this._onActivate = opts.onActivate;

		this.bgDomNode = document.createElement('div');
		this.bgDomNode.className = 'arrow-background';
		this.bgDomNode.style.position = 'absolute';
		this.bgDomNode.style.width = opts.bgWidth + 'px';
		this.bgDomNode.style.height = opts.bgHeight + 'px';
		if (typeof opts.top !== 'undefined') {
			this.bgDomNode.style.top = '0px';
		}
		if (typeof opts.left !== 'undefined') {
			this.bgDomNode.style.left = '0px';
		}
		if (typeof opts.bottom !== 'undefined') {
			this.bgDomNode.style.bottom = '0px';
		}
		if (typeof opts.right !== 'undefined') {
			this.bgDomNode.style.right = '0px';
		}

		this.domNode = document.createElement('div');
		this.domNode.className = opts.className;
		this.domNode.classList.add(...ThemeIcon.asClassNameArray(opts.icon));

		this.domNode.style.position = 'absolute';
		this.domNode.style.width = ARROW_IMG_SIZE + 'px';
		this.domNode.style.height = ARROW_IMG_SIZE + 'px';
		if (typeof opts.top !== 'undefined') {
			this.domNode.style.top = opts.top + 'px';
		}
		if (typeof opts.left !== 'undefined') {
			this.domNode.style.left = opts.left + 'px';
		}
		if (typeof opts.bottom !== 'undefined') {
			this.domNode.style.bottom = opts.bottom + 'px';
		}
		if (typeof opts.right !== 'undefined') {
			this.domNode.style.right = opts.right + 'px';
		}

		this._pointerMoveMonitor = this._register(new GlobalPointerMoveMonitor());
		this._register(dom.addStandardDisposableListener(this.bgDomNode, dom.EventType.POINTER_DOWN, (e) => this._arrowPointerDown(e)));
		this._register(dom.addStandardDisposableListener(this.domNode, dom.EventType.POINTER_DOWN, (e) => this._arrowPointerDown(e)));

		this._pointerdownRepeatTimer = this._register(new dom.WindowIntervalTimer());
		this._pointerdownScheduleRepeatTimer = this._register(new TimeoutTimer());
	}

	private _arrowPointerDown(e: PointerEvent): void {
		if (!e.target || !(e.target instanceof Element)) {
			return;
		}
		const scheduleRepeater = () => {
			this._pointerdownRepeatTimer.cancelAndSet(() => this._onActivate(), 1000 / 24, dom.getWindow(e));
		};

		this._onActivate();
		this._pointerdownRepeatTimer.cancel();
		this._pointerdownScheduleRepeatTimer.cancelAndSet(scheduleRepeater, 200);

		this._pointerMoveMonitor.startMonitoring(
			e.target,
			e.pointerId,
			e.buttons,
			(pointerMoveData) => { /* Intentional empty */ },
			() => {
				this._pointerdownRepeatTimer.cancel();
				this._pointerdownScheduleRepeatTimer.cancel();
			}
		);

		e.preventDefault();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/scrollbarState.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/scrollbarState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * The minimal size of the slider (such that it can still be clickable) -- it is artificially enlarged.
 */
const MINIMUM_SLIDER_SIZE = 20;

export class ScrollbarState {

	/**
	 * For the vertical scrollbar: the width.
	 * For the horizontal scrollbar: the height.
	 */
	private _scrollbarSize: number;

	/**
	 * For the vertical scrollbar: the height of the pair horizontal scrollbar.
	 * For the horizontal scrollbar: the width of the pair vertical scrollbar.
	 */
	private _oppositeScrollbarSize: number;

	/**
	 * For the vertical scrollbar: the height of the scrollbar's arrows.
	 * For the horizontal scrollbar: the width of the scrollbar's arrows.
	 */
	private readonly _arrowSize: number;

	// --- variables
	/**
	 * For the vertical scrollbar: the viewport height.
	 * For the horizontal scrollbar: the viewport width.
	 */
	private _visibleSize: number;

	/**
	 * For the vertical scrollbar: the scroll height.
	 * For the horizontal scrollbar: the scroll width.
	 */
	private _scrollSize: number;

	/**
	 * For the vertical scrollbar: the scroll top.
	 * For the horizontal scrollbar: the scroll left.
	 */
	private _scrollPosition: number;

	// --- computed variables

	/**
	 * `visibleSize` - `oppositeScrollbarSize`
	 */
	private _computedAvailableSize: number;
	/**
	 * (`scrollSize` > 0 && `scrollSize` > `visibleSize`)
	 */
	private _computedIsNeeded: boolean;

	private _computedSliderSize: number;
	private _computedSliderRatio: number;
	private _computedSliderPosition: number;

	constructor(arrowSize: number, scrollbarSize: number, oppositeScrollbarSize: number, visibleSize: number, scrollSize: number, scrollPosition: number) {
		this._scrollbarSize = Math.round(scrollbarSize);
		this._oppositeScrollbarSize = Math.round(oppositeScrollbarSize);
		this._arrowSize = Math.round(arrowSize);

		this._visibleSize = visibleSize;
		this._scrollSize = scrollSize;
		this._scrollPosition = scrollPosition;

		this._computedAvailableSize = 0;
		this._computedIsNeeded = false;
		this._computedSliderSize = 0;
		this._computedSliderRatio = 0;
		this._computedSliderPosition = 0;

		this._refreshComputedValues();
	}

	public clone(): ScrollbarState {
		return new ScrollbarState(this._arrowSize, this._scrollbarSize, this._oppositeScrollbarSize, this._visibleSize, this._scrollSize, this._scrollPosition);
	}

	public setVisibleSize(visibleSize: number): boolean {
		const iVisibleSize = Math.round(visibleSize);
		if (this._visibleSize !== iVisibleSize) {
			this._visibleSize = iVisibleSize;
			this._refreshComputedValues();
			return true;
		}
		return false;
	}

	public setScrollSize(scrollSize: number): boolean {
		const iScrollSize = Math.round(scrollSize);
		if (this._scrollSize !== iScrollSize) {
			this._scrollSize = iScrollSize;
			this._refreshComputedValues();
			return true;
		}
		return false;
	}

	public setScrollPosition(scrollPosition: number): boolean {
		const iScrollPosition = Math.round(scrollPosition);
		if (this._scrollPosition !== iScrollPosition) {
			this._scrollPosition = iScrollPosition;
			this._refreshComputedValues();
			return true;
		}
		return false;
	}

	public setScrollbarSize(scrollbarSize: number): void {
		this._scrollbarSize = Math.round(scrollbarSize);
	}

	public setOppositeScrollbarSize(oppositeScrollbarSize: number): void {
		this._oppositeScrollbarSize = Math.round(oppositeScrollbarSize);
	}

	private static _computeValues(oppositeScrollbarSize: number, arrowSize: number, visibleSize: number, scrollSize: number, scrollPosition: number) {
		const computedAvailableSize = Math.max(0, visibleSize - oppositeScrollbarSize);
		const computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * arrowSize);
		const computedIsNeeded = (scrollSize > 0 && scrollSize > visibleSize);

		if (!computedIsNeeded) {
			// There is no need for a slider
			return {
				computedAvailableSize: Math.round(computedAvailableSize),
				computedIsNeeded: computedIsNeeded,
				computedSliderSize: Math.round(computedRepresentableSize),
				computedSliderRatio: 0,
				computedSliderPosition: 0,
			};
		}

		// We must artificially increase the size of the slider if needed, since the slider would be too small to grab with the mouse otherwise
		const computedSliderSize = Math.round(Math.max(MINIMUM_SLIDER_SIZE, Math.floor(visibleSize * computedRepresentableSize / scrollSize)));

		// The slider can move from 0 to `computedRepresentableSize` - `computedSliderSize`
		// in the same way `scrollPosition` can move from 0 to `scrollSize` - `visibleSize`.
		const computedSliderRatio = (computedRepresentableSize - computedSliderSize) / (scrollSize - visibleSize);
		const computedSliderPosition = (scrollPosition * computedSliderRatio);

		return {
			computedAvailableSize: Math.round(computedAvailableSize),
			computedIsNeeded: computedIsNeeded,
			computedSliderSize: Math.round(computedSliderSize),
			computedSliderRatio: computedSliderRatio,
			computedSliderPosition: Math.round(computedSliderPosition),
		};
	}

	private _refreshComputedValues(): void {
		const r = ScrollbarState._computeValues(this._oppositeScrollbarSize, this._arrowSize, this._visibleSize, this._scrollSize, this._scrollPosition);
		this._computedAvailableSize = r.computedAvailableSize;
		this._computedIsNeeded = r.computedIsNeeded;
		this._computedSliderSize = r.computedSliderSize;
		this._computedSliderRatio = r.computedSliderRatio;
		this._computedSliderPosition = r.computedSliderPosition;
	}

	public getArrowSize(): number {
		return this._arrowSize;
	}

	public getScrollPosition(): number {
		return this._scrollPosition;
	}

	public getRectangleLargeSize(): number {
		return this._computedAvailableSize;
	}

	public getRectangleSmallSize(): number {
		return this._scrollbarSize;
	}

	public isNeeded(): boolean {
		return this._computedIsNeeded;
	}

	public getSliderSize(): number {
		return this._computedSliderSize;
	}

	public getSliderPosition(): number {
		return this._computedSliderPosition;
	}

	/**
	 * Compute a desired `scrollPosition` such that `offset` ends up in the center of the slider.
	 * `offset` is based on the same coordinate system as the `sliderPosition`.
	 */
	public getDesiredScrollPositionFromOffset(offset: number): number {
		if (!this._computedIsNeeded) {
			// no need for a slider
			return 0;
		}

		const desiredSliderPosition = offset - this._arrowSize - this._computedSliderSize / 2;
		return Math.round(desiredSliderPosition / this._computedSliderRatio);
	}

	/**
	 * Compute a desired `scrollPosition` from if offset is before or after the slider position.
	 * If offset is before slider, treat as a page up (or left).  If after, page down (or right).
	 * `offset` and `_computedSliderPosition` are based on the same coordinate system.
	 * `_visibleSize` corresponds to a "page" of lines in the returned coordinate system.
	 */
	public getDesiredScrollPositionFromOffsetPaged(offset: number): number {
		if (!this._computedIsNeeded) {
			// no need for a slider
			return 0;
		}

		const correctedOffset = offset - this._arrowSize;  // compensate if has arrows
		let desiredScrollPosition = this._scrollPosition;
		if (correctedOffset < this._computedSliderPosition) {
			desiredScrollPosition -= this._visibleSize;  // page up/left
		} else {
			desiredScrollPosition += this._visibleSize;  // page down/right
		}
		return desiredScrollPosition;
	}

	/**
	 * Compute a desired `scrollPosition` such that the slider moves by `delta`.
	 */
	public getDesiredScrollPositionFromDelta(delta: number): number {
		if (!this._computedIsNeeded) {
			// no need for a slider
			return 0;
		}

		const desiredSliderPosition = this._computedSliderPosition + delta;
		return Math.round(desiredSliderPosition / this._computedSliderRatio);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/base/browser/ui/scrollbar/scrollbarVisibilityController.ts]---
Location: vscode-main/src/vs/base/browser/ui/scrollbar/scrollbarVisibilityController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../fastDomNode.js';
import { TimeoutTimer } from '../../../common/async.js';
import { Disposable } from '../../../common/lifecycle.js';
import { ScrollbarVisibility } from '../../../common/scrollable.js';

export class ScrollbarVisibilityController extends Disposable {
	private _visibility: ScrollbarVisibility;
	private _visibleClassName: string;
	private _invisibleClassName: string;
	private _domNode: FastDomNode<HTMLElement> | null;
	private _rawShouldBeVisible: boolean;
	private _shouldBeVisible: boolean;
	private _isNeeded: boolean;
	private _isVisible: boolean;
	private _revealTimer: TimeoutTimer;

	constructor(visibility: ScrollbarVisibility, visibleClassName: string, invisibleClassName: string) {
		super();
		this._visibility = visibility;
		this._visibleClassName = visibleClassName;
		this._invisibleClassName = invisibleClassName;
		this._domNode = null;
		this._isVisible = false;
		this._isNeeded = false;
		this._rawShouldBeVisible = false;
		this._shouldBeVisible = false;
		this._revealTimer = this._register(new TimeoutTimer());
	}

	public setVisibility(visibility: ScrollbarVisibility): void {
		if (this._visibility !== visibility) {
			this._visibility = visibility;
			this._updateShouldBeVisible();
		}
	}

	// ----------------- Hide / Reveal

	public setShouldBeVisible(rawShouldBeVisible: boolean): void {
		this._rawShouldBeVisible = rawShouldBeVisible;
		this._updateShouldBeVisible();
	}

	private _applyVisibilitySetting(): boolean {
		if (this._visibility === ScrollbarVisibility.Hidden) {
			return false;
		}
		if (this._visibility === ScrollbarVisibility.Visible) {
			return true;
		}
		return this._rawShouldBeVisible;
	}

	private _updateShouldBeVisible(): void {
		const shouldBeVisible = this._applyVisibilitySetting();

		if (this._shouldBeVisible !== shouldBeVisible) {
			this._shouldBeVisible = shouldBeVisible;
			this.ensureVisibility();
		}
	}

	public setIsNeeded(isNeeded: boolean): void {
		if (this._isNeeded !== isNeeded) {
			this._isNeeded = isNeeded;
			this.ensureVisibility();
		}
	}

	public setDomNode(domNode: FastDomNode<HTMLElement>): void {
		this._domNode = domNode;
		this._domNode.setClassName(this._invisibleClassName);

		// Now that the flags & the dom node are in a consistent state, ensure the Hidden/Visible configuration
		this.setShouldBeVisible(false);
	}

	public ensureVisibility(): void {

		if (!this._isNeeded) {
			// Nothing to be rendered
			this._hide(false);
			return;
		}

		if (this._shouldBeVisible) {
			this._reveal();
		} else {
			this._hide(true);
		}
	}

	private _reveal(): void {
		if (this._isVisible) {
			return;
		}
		this._isVisible = true;

		// The CSS animation doesn't play otherwise
		this._revealTimer.setIfNotSet(() => {
			this._domNode?.setClassName(this._visibleClassName);
		}, 0);
	}

	private _hide(withFadeAway: boolean): void {
		this._revealTimer.cancel();
		if (!this._isVisible) {
			return;
		}
		this._isVisible = false;
		this._domNode?.setClassName(this._invisibleClassName + (withFadeAway ? ' fade' : ''));
	}
}
```

--------------------------------------------------------------------------------

````

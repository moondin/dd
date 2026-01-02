---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 260
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 260 of 552)

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

---[FILE: src/vs/platform/actions/browser/menuEntryActionViewItem.ts]---
Location: vscode-main/src/vs/platform/actions/browser/menuEntryActionViewItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { asCSSUrl } from '../../../base/browser/cssValue.js';
import { $, addDisposableListener, append, EventType, ModifierKeyEmitter, prepend } from '../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { ActionViewItem, BaseActionViewItem, SelectActionViewItem } from '../../../base/browser/ui/actionbar/actionViewItems.js';
import { DropdownMenuActionViewItem, IDropdownMenuActionViewItemOptions } from '../../../base/browser/ui/dropdown/dropdownActionViewItem.js';
import { IHoverDelegate } from '../../../base/browser/ui/hover/hoverDelegate.js';
import { SeparatorSelectOption } from '../../../base/browser/ui/selectBox/selectBox.js';
import { ActionRunner, IAction, IActionRunner, IRunEvent, Separator, SubmenuAction } from '../../../base/common/actions.js';
import { Event } from '../../../base/common/event.js';
import { UILabelProvider } from '../../../base/common/keybindingLabels.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { combinedDisposable, DisposableStore, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { isLinux, isWindows, OS } from '../../../base/common/platform.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { assertType } from '../../../base/common/types.js';
import { localize } from '../../../nls.js';
import { IAccessibilityService } from '../../accessibility/common/accessibility.js';
import { ICommandAction, isICommandActionToggleInfo } from '../../action/common/action.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../contextview/browser/contextView.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { INotificationService } from '../../notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { defaultSelectBoxStyles } from '../../theme/browser/defaultStyles.js';
import { asCssVariable, selectBorder } from '../../theme/common/colorRegistry.js';
import { isDark } from '../../theme/common/theme.js';
import { IThemeService } from '../../theme/common/themeService.js';
import { hasNativeContextMenu } from '../../window/common/window.js';
import { IMenuService, MenuItemAction, SubmenuItemAction } from '../common/actions.js';
import './menuEntryActionViewItem.css';

export interface PrimaryAndSecondaryActions {
	primary: IAction[];
	secondary: IAction[];
}

export function getContextMenuActions(
	groups: ReadonlyArray<[string, ReadonlyArray<MenuItemAction | SubmenuItemAction>]>,
	primaryGroup?: string
): PrimaryAndSecondaryActions {
	const target: PrimaryAndSecondaryActions = { primary: [], secondary: [] };
	getContextMenuActionsImpl(groups, target, primaryGroup);
	return target;
}

export function getFlatContextMenuActions(
	groups: ReadonlyArray<[string, ReadonlyArray<MenuItemAction | SubmenuItemAction>]>,
	primaryGroup?: string
): IAction[] {
	const target: IAction[] = [];
	getContextMenuActionsImpl(groups, target, primaryGroup);
	return target;
}

function getContextMenuActionsImpl(
	groups: ReadonlyArray<[string, ReadonlyArray<MenuItemAction | SubmenuItemAction>]>,
	target: IAction[] | PrimaryAndSecondaryActions,
	primaryGroup?: string
) {
	const modifierKeyEmitter = ModifierKeyEmitter.getInstance();
	const useAlternativeActions = modifierKeyEmitter.keyStatus.altKey || ((isWindows || isLinux) && modifierKeyEmitter.keyStatus.shiftKey);
	fillInActions(groups, target, useAlternativeActions, primaryGroup ? actionGroup => actionGroup === primaryGroup : actionGroup => actionGroup === 'navigation');
}


export function getActionBarActions(
	groups: [string, Array<MenuItemAction | SubmenuItemAction>][],
	primaryGroup?: string | ((actionGroup: string) => boolean),
	shouldInlineSubmenu?: (action: SubmenuAction, group: string, groupSize: number) => boolean,
	useSeparatorsInPrimaryActions?: boolean
): PrimaryAndSecondaryActions {
	const target: PrimaryAndSecondaryActions = { primary: [], secondary: [] };
	fillInActionBarActions(groups, target, primaryGroup, shouldInlineSubmenu, useSeparatorsInPrimaryActions);
	return target;
}

export function getFlatActionBarActions(
	groups: [string, Array<MenuItemAction | SubmenuItemAction>][],
	primaryGroup?: string | ((actionGroup: string) => boolean),
	shouldInlineSubmenu?: (action: SubmenuAction, group: string, groupSize: number) => boolean,
	useSeparatorsInPrimaryActions?: boolean
): IAction[] {
	const target: IAction[] = [];
	fillInActionBarActions(groups, target, primaryGroup, shouldInlineSubmenu, useSeparatorsInPrimaryActions);
	return target;
}

export function fillInActionBarActions(
	groups: [string, Array<MenuItemAction | SubmenuItemAction>][],
	target: IAction[] | PrimaryAndSecondaryActions,
	primaryGroup?: string | ((actionGroup: string) => boolean),
	shouldInlineSubmenu?: (action: SubmenuAction, group: string, groupSize: number) => boolean,
	useSeparatorsInPrimaryActions?: boolean
): void {
	const isPrimaryAction = typeof primaryGroup === 'string' ? (actionGroup: string) => actionGroup === primaryGroup : primaryGroup;

	// Action bars handle alternative actions on their own so the alternative actions should be ignored
	fillInActions(groups, target, false, isPrimaryAction, shouldInlineSubmenu, useSeparatorsInPrimaryActions);
}

function fillInActions(
	groups: ReadonlyArray<[string, ReadonlyArray<MenuItemAction | SubmenuItemAction>]>,
	target: IAction[] | PrimaryAndSecondaryActions,
	useAlternativeActions: boolean,
	isPrimaryAction: (actionGroup: string) => boolean = actionGroup => actionGroup === 'navigation',
	shouldInlineSubmenu: (action: SubmenuAction, group: string, groupSize: number) => boolean = () => false,
	useSeparatorsInPrimaryActions: boolean = false
): void {

	let primaryBucket: IAction[];
	let secondaryBucket: IAction[];
	if (Array.isArray(target)) {
		primaryBucket = target;
		secondaryBucket = target;
	} else {
		primaryBucket = target.primary;
		secondaryBucket = target.secondary;
	}

	const submenuInfo = new Set<{ group: string; action: SubmenuAction; index: number }>();

	for (const [group, actions] of groups) {

		let target: IAction[];
		if (isPrimaryAction(group)) {
			target = primaryBucket;
			if (target.length > 0 && useSeparatorsInPrimaryActions) {
				target.push(new Separator());
			}
		} else {
			target = secondaryBucket;
			if (target.length > 0) {
				target.push(new Separator());
			}
		}

		for (let action of actions) {
			if (useAlternativeActions) {
				action = action instanceof MenuItemAction && action.alt ? action.alt : action;
			}
			const newLen = target.push(action);
			// keep submenu info for later inlining
			if (action instanceof SubmenuAction) {
				submenuInfo.add({ group, action, index: newLen - 1 });
			}
		}
	}

	// ask the outside if submenu should be inlined or not. only ask when
	// there would be enough space
	for (const { group, action, index } of submenuInfo) {
		const target = isPrimaryAction(group) ? primaryBucket : secondaryBucket;

		// inlining submenus with length 0 or 1 is easy,
		// larger submenus need to be checked with the overall limit
		const submenuActions = action.actions;
		if (shouldInlineSubmenu(action, group, target.length)) {
			target.splice(index, 1, ...submenuActions);
		}
	}
}

export interface IMenuEntryActionViewItemOptions {
	readonly draggable?: boolean;
	readonly keybinding?: string | null;
	readonly hoverDelegate?: IHoverDelegate;
	readonly keybindingNotRenderedWithLabel?: boolean;
}

export class MenuEntryActionViewItem<T extends IMenuEntryActionViewItemOptions = IMenuEntryActionViewItemOptions> extends ActionViewItem {

	private _wantsAltCommand: boolean = false;
	private readonly _itemClassDispose = this._register(new MutableDisposable());
	private readonly _altKey: ModifierKeyEmitter;

	constructor(
		action: MenuItemAction,
		protected readonly _options: T | undefined,
		@IKeybindingService protected readonly _keybindingService: IKeybindingService,
		@INotificationService protected readonly _notificationService: INotificationService,
		@IContextKeyService protected readonly _contextKeyService: IContextKeyService,
		@IThemeService protected readonly _themeService: IThemeService,
		@IContextMenuService protected readonly _contextMenuService: IContextMenuService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super(undefined, action, { icon: !!(action.class || action.item.icon), label: !action.class && !action.item.icon, draggable: _options?.draggable, keybinding: _options?.keybinding, hoverDelegate: _options?.hoverDelegate, keybindingNotRenderedWithLabel: _options?.keybindingNotRenderedWithLabel });
		this._altKey = ModifierKeyEmitter.getInstance();
	}

	protected get _menuItemAction(): MenuItemAction {
		return <MenuItemAction>this._action;
	}

	protected get _commandAction(): MenuItemAction {
		return this._wantsAltCommand && this._menuItemAction.alt || this._menuItemAction;
	}

	override async onClick(event: MouseEvent): Promise<void> {
		event.preventDefault();
		event.stopPropagation();

		try {
			await this.actionRunner.run(this._commandAction, this._context);
		} catch (err) {
			this._notificationService.error(err);
		}
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('menu-entry');

		if (this.options.icon) {
			this._updateItemClass(this._menuItemAction.item);
		}

		if (this._menuItemAction.alt) {
			let isMouseOver = false;

			const updateAltState = () => {
				const wantsAltCommand = !!this._menuItemAction.alt?.enabled &&
					(!this._accessibilityService.isMotionReduced() || isMouseOver) && (
						this._altKey.keyStatus.altKey ||
						(this._altKey.keyStatus.shiftKey && isMouseOver)
					);

				if (wantsAltCommand !== this._wantsAltCommand) {
					this._wantsAltCommand = wantsAltCommand;
					this.updateLabel();
					this.updateTooltip();
					this.updateClass();
				}
			};

			this._register(this._altKey.event(updateAltState));

			this._register(addDisposableListener(container, 'mouseleave', _ => {
				isMouseOver = false;
				updateAltState();
			}));

			this._register(addDisposableListener(container, 'mouseenter', _ => {
				isMouseOver = true;
				updateAltState();
			}));

			updateAltState();
		}
	}

	protected override updateLabel(): void {
		if (this.options.label && this.label) {
			this.label.textContent = this._commandAction.label;
		}
	}

	protected override getTooltip() {
		const keybinding = this._keybindingService.lookupKeybinding(this._commandAction.id, this._contextKeyService);
		const keybindingLabel = keybinding && keybinding.getLabel();

		const tooltip = this._commandAction.tooltip || this._commandAction.label;
		let title = keybindingLabel
			? localize('titleAndKb', "{0} ({1})", tooltip, keybindingLabel)
			: tooltip;
		if (!this._wantsAltCommand && this._menuItemAction.alt?.enabled) {
			const altTooltip = this._menuItemAction.alt.tooltip || this._menuItemAction.alt.label;
			const altKeybinding = this._keybindingService.lookupKeybinding(this._menuItemAction.alt.id, this._contextKeyService);
			const altKeybindingLabel = altKeybinding && altKeybinding.getLabel();
			const altTitleSection = altKeybindingLabel
				? localize('titleAndKb', "{0} ({1})", altTooltip, altKeybindingLabel)
				: altTooltip;

			title = localize('titleAndKbAndAlt', "{0}\n[{1}] {2}", title, UILabelProvider.modifierLabels[OS].altKey, altTitleSection);
		}
		return title;
	}

	protected override updateClass(): void {
		if (this.options.icon) {
			if (this._commandAction !== this._menuItemAction) {
				if (this._menuItemAction.alt) {
					this._updateItemClass(this._menuItemAction.alt.item);
				}
			} else {
				this._updateItemClass(this._menuItemAction.item);
			}
		}
	}

	private _updateItemClass(item: ICommandAction): void {
		this._itemClassDispose.value = undefined;

		const { element, label } = this;
		if (!element || !label) {
			return;
		}

		const icon = this._commandAction.checked && isICommandActionToggleInfo(item.toggled) && item.toggled.icon ? item.toggled.icon : item.icon;

		if (!icon) {
			return;
		}

		if (ThemeIcon.isThemeIcon(icon)) {
			// theme icons
			const iconClasses = ThemeIcon.asClassNameArray(icon);
			label.classList.add(...iconClasses);
			this._itemClassDispose.value = toDisposable(() => {
				label.classList.remove(...iconClasses);
			});

		} else {
			// icon path/url
			label.style.backgroundImage = (
				isDark(this._themeService.getColorTheme().type)
					? asCSSUrl(icon.dark)
					: asCSSUrl(icon.light)
			);
			label.classList.add('icon');
			this._itemClassDispose.value = combinedDisposable(
				toDisposable(() => {
					label.style.backgroundImage = '';
					label.classList.remove('icon');
				}),
				this._themeService.onDidColorThemeChange(() => {
					// refresh when the theme changes in case we go between dark <-> light
					this.updateClass();
				})
			);
		}
	}
}

export interface ITextOnlyMenuEntryActionViewItemOptions extends IMenuEntryActionViewItemOptions {
	readonly conversational?: boolean;
	readonly useComma?: boolean;
}

export class TextOnlyMenuEntryActionViewItem extends MenuEntryActionViewItem<ITextOnlyMenuEntryActionViewItemOptions> {

	override render(container: HTMLElement): void {
		this.options.label = true;
		this.options.icon = false;
		super.render(container);
		container.classList.add('text-only');
		container.classList.toggle('use-comma', this._options?.useComma ?? false);
	}

	protected override updateLabel() {
		const kb = this._keybindingService.lookupKeybinding(this._action.id, this._contextKeyService);
		if (!kb) {
			return super.updateLabel();
		}
		if (this.label) {
			const kb2 = TextOnlyMenuEntryActionViewItem._symbolPrintEnter(kb);

			if (this._options?.conversational) {
				this.label.textContent = localize({ key: 'content2', comment: ['A label with keybindg like "ESC to dismiss"'] }, '{1} to {0}', this._action.label, kb2);

			} else {
				this.label.textContent = localize({ key: 'content', comment: ['A label', 'A keybinding'] }, '{0} ({1})', this._action.label, kb2);
			}
		}
	}

	private static _symbolPrintEnter(kb: ResolvedKeybinding) {
		return kb.getLabel()
			?.replace(/\benter\b/gi, '\u23CE')
			.replace(/\bEscape\b/gi, 'Esc');
	}
}

export class SubmenuEntryActionViewItem extends DropdownMenuActionViewItem {

	constructor(
		action: SubmenuItemAction,
		options: IDropdownMenuActionViewItemOptions | undefined,
		@IKeybindingService protected _keybindingService: IKeybindingService,
		@IContextMenuService protected _contextMenuService: IContextMenuService,
		@IThemeService protected _themeService: IThemeService
	) {
		const dropdownOptions: IDropdownMenuActionViewItemOptions = {
			...options,
			menuAsChild: options?.menuAsChild ?? false,
			classNames: options?.classNames ?? (ThemeIcon.isThemeIcon(action.item.icon) ? ThemeIcon.asClassName(action.item.icon) : undefined),
			keybindingProvider: options?.keybindingProvider ?? (action => _keybindingService.lookupKeybinding(action.id))
		};

		super(action, { getActions: () => action.actions }, _contextMenuService, dropdownOptions);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		assertType(this.element);

		container.classList.add('menu-entry');
		const action = <SubmenuItemAction>this._action;
		const { icon } = action.item;
		if (icon && !ThemeIcon.isThemeIcon(icon)) {
			this.element.classList.add('icon');
			const setBackgroundImage = () => {
				if (this.element) {
					this.element.style.backgroundImage = (
						isDark(this._themeService.getColorTheme().type)
							? asCSSUrl(icon.dark)
							: asCSSUrl(icon.light)
					);
				}
			};
			setBackgroundImage();
			this._register(this._themeService.onDidColorThemeChange(() => {
				// refresh when the theme changes in case we go between dark <-> light
				setBackgroundImage();
			}));
		}
	}
}

export interface IDropdownWithDefaultActionViewItemOptions extends IDropdownMenuActionViewItemOptions {
	renderKeybindingWithDefaultActionLabel?: boolean;
	togglePrimaryAction?: boolean;
}

export class DropdownWithDefaultActionViewItem extends BaseActionViewItem {
	private readonly _options: IDropdownWithDefaultActionViewItemOptions | undefined;
	private _defaultAction: ActionViewItem;
	private readonly _defaultActionDisposables = this._register(new DisposableStore());
	private readonly _dropdown: DropdownMenuActionViewItem;
	private _container: HTMLElement | null = null;
	private readonly _storageKey: string;

	get onDidChangeDropdownVisibility(): Event<boolean> {
		return this._dropdown.onDidChangeVisibility;
	}

	constructor(
		submenuAction: SubmenuItemAction,
		options: IDropdownWithDefaultActionViewItemOptions | undefined,
		@IKeybindingService protected readonly _keybindingService: IKeybindingService,
		@INotificationService protected _notificationService: INotificationService,
		@IContextMenuService protected _contextMenuService: IContextMenuService,
		@IMenuService protected _menuService: IMenuService,
		@IInstantiationService protected _instaService: IInstantiationService,
		@IStorageService protected _storageService: IStorageService
	) {
		super(null, submenuAction);
		this._options = options;
		this._storageKey = `${submenuAction.item.submenu.id}_lastActionId`;

		// determine default action
		let defaultAction: IAction | undefined;
		const defaultActionId = options?.togglePrimaryAction ? _storageService.get(this._storageKey, StorageScope.WORKSPACE) : undefined;
		if (defaultActionId) {
			defaultAction = submenuAction.actions.find(a => defaultActionId === a.id);
		}
		if (!defaultAction) {
			defaultAction = submenuAction.actions[0];
		}

		this._defaultAction = this._defaultActionDisposables.add(this._instaService.createInstance(MenuEntryActionViewItem, <MenuItemAction>defaultAction, { keybinding: this._getDefaultActionKeybindingLabel(defaultAction) }));

		const dropdownOptions: IDropdownMenuActionViewItemOptions = {
			keybindingProvider: action => this._keybindingService.lookupKeybinding(action.id),
			...options,
			menuAsChild: options?.menuAsChild ?? true,
			classNames: options?.classNames ?? ['codicon', 'codicon-chevron-down'],
			actionRunner: options?.actionRunner ?? this._register(new ActionRunner()),
		};

		this._dropdown = this._register(new DropdownMenuActionViewItem(submenuAction, submenuAction.actions, this._contextMenuService, dropdownOptions));
		if (options?.togglePrimaryAction) {
			this._register(this._dropdown.actionRunner.onDidRun((e: IRunEvent) => {
				if (e.action instanceof MenuItemAction) {
					this.update(e.action);
				}
			}));
		}
	}

	private update(lastAction: MenuItemAction): void {
		if (this._options?.togglePrimaryAction) {
			this._storageService.store(this._storageKey, lastAction.id, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}

		this._defaultActionDisposables.clear();
		this._defaultAction = this._defaultActionDisposables.add(this._instaService.createInstance(MenuEntryActionViewItem, lastAction, { keybinding: this._getDefaultActionKeybindingLabel(lastAction) }));
		this._defaultAction.actionRunner = this._defaultActionDisposables.add(new class extends ActionRunner {
			protected override async runAction(action: IAction, context?: unknown): Promise<void> {
				await action.run(undefined);
			}
		}());

		if (this._container) {
			this._defaultAction.render(prepend(this._container, $('.action-container')));
		}
	}

	private _getDefaultActionKeybindingLabel(defaultAction: IAction) {
		let defaultActionKeybinding: string | undefined;
		if (this._options?.renderKeybindingWithDefaultActionLabel) {
			const kb = this._keybindingService.lookupKeybinding(defaultAction.id);
			if (kb) {
				defaultActionKeybinding = `(${kb.getLabel()})`;
			}
		}
		return defaultActionKeybinding;
	}

	override setActionContext(newContext: unknown): void {
		super.setActionContext(newContext);
		this._defaultAction.setActionContext(newContext);
		this._dropdown.setActionContext(newContext);
	}

	override set actionRunner(actionRunner: IActionRunner) {
		super.actionRunner = actionRunner;

		this._defaultAction.actionRunner = actionRunner;
		this._dropdown.actionRunner = actionRunner;
	}

	override get actionRunner(): IActionRunner {
		return super.actionRunner;
	}

	override render(container: HTMLElement): void {
		this._container = container;
		super.render(this._container);

		this._container.classList.add('monaco-dropdown-with-default');

		const primaryContainer = $('.action-container');
		this._defaultAction.render(append(this._container, primaryContainer));
		this._register(addDisposableListener(primaryContainer, EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.RightArrow)) {
				this._defaultAction.element!.tabIndex = -1;
				this._dropdown.focus();
				event.stopPropagation();
			}
		}));

		const dropdownContainer = $('.dropdown-action-container');
		this._dropdown.render(append(this._container, dropdownContainer));
		this._register(addDisposableListener(dropdownContainer, EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.LeftArrow)) {
				this._defaultAction.element!.tabIndex = 0;
				this._dropdown.setFocusable(false);
				this._defaultAction.element?.focus();
				event.stopPropagation();
			}
		}));
	}

	override focus(fromRight?: boolean): void {
		if (fromRight) {
			this._dropdown.focus();
		} else {
			this._defaultAction.element!.tabIndex = 0;
			this._defaultAction.element!.focus();
		}
	}

	override blur(): void {
		this._defaultAction.element!.tabIndex = -1;
		this._dropdown.blur();
		this._container!.blur();
	}

	override setFocusable(focusable: boolean): void {
		if (focusable) {
			this._defaultAction.element!.tabIndex = 0;
		} else {
			this._defaultAction.element!.tabIndex = -1;
			this._dropdown.setFocusable(false);
		}
	}
}

class SubmenuEntrySelectActionViewItem extends SelectActionViewItem {

	constructor(
		action: SubmenuItemAction,
		@IContextViewService contextViewService: IContextViewService,
		@IConfigurationService configurationService: IConfigurationService,
	) {
		super(null, action, action.actions.map(a => (a.id === Separator.ID ? SeparatorSelectOption : { text: a.label, isDisabled: !a.enabled, })), 0, contextViewService, defaultSelectBoxStyles, { ariaLabel: action.tooltip, optionsAsChildren: true, useCustomDrawn: !hasNativeContextMenu(configurationService) });
		this.select(Math.max(0, action.actions.findIndex(a => a.checked)));
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.style.borderColor = asCssVariable(selectBorder);
	}

	protected override runAction(option: string, index: number): void {
		const action = (this.action as SubmenuItemAction).actions[index];
		if (action) {
			this.actionRunner.run(action);
		}
	}

}

/**
 * Creates action view items for menu actions or submenu actions.
 */
export function createActionViewItem(instaService: IInstantiationService, action: IAction, options: IDropdownMenuActionViewItemOptions | IMenuEntryActionViewItemOptions | undefined): undefined | MenuEntryActionViewItem | SubmenuEntryActionViewItem | BaseActionViewItem {
	if (action instanceof MenuItemAction) {
		return instaService.createInstance(MenuEntryActionViewItem, action, options);
	} else if (action instanceof SubmenuItemAction) {
		if (action.item.isSelection) {
			return instaService.createInstance(SubmenuEntrySelectActionViewItem, action);
		} else if (action.item.isSplitButton) {
			return instaService.createInstance(DropdownWithDefaultActionViewItem, action, {
				...options,
				togglePrimaryAction: typeof action.item.isSplitButton !== 'boolean' ? action.item.isSplitButton.togglePrimaryAction : false,
			});
		} else {
			return instaService.createInstance(SubmenuEntryActionViewItem, action, options);
		}
	} else {
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/browser/toolbar.ts]---
Location: vscode-main/src/vs/platform/actions/browser/toolbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { addDisposableListener, getWindow } from '../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IToolBarOptions, ToggleMenuAction, ToolBar } from '../../../base/browser/ui/toolbar/toolbar.js';
import { IAction, Separator, SubmenuAction, toAction, WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../base/common/actions.js';
import { coalesceInPlace } from '../../../base/common/arrays.js';
import { intersection } from '../../../base/common/collections.js';
import { BugIndicatingError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';
import { createActionViewItem, getActionBarActions } from './menuEntryActionViewItem.js';
import { IMenuActionOptions, IMenuService, MenuId, MenuItemAction, SubmenuItemAction } from '../common/actions.js';
import { createConfigureKeybindingAction } from '../common/menuService.js';
import { ICommandService } from '../../commands/common/commands.js';
import { IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IContextMenuService } from '../../contextview/browser/contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IActionViewItemService } from './actionViewItemService.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';

export const enum HiddenItemStrategy {
	/** This toolbar doesn't support hiding*/
	NoHide = -1,
	/** Hidden items aren't shown anywhere */
	Ignore = 0,
	/** Hidden items move into the secondary group */
	RenderInSecondaryGroup = 1,
}

export type IWorkbenchToolBarOptions = IToolBarOptions & {

	/**
	 * Items of the primary group can be hidden. When this happens the item can
	 * - move into the secondary popup-menu, or
	 * - not be shown at all
	 */
	hiddenItemStrategy?: HiddenItemStrategy;

	/**
	 * Optional menu id which is used for a "Reset Menu" command. This should be the
	 * menu id that defines the contents of this workbench menu
	 */
	resetMenu?: MenuId;

	/**
	 * Optional menu id which items are used for the context menu of the toolbar.
	 */
	contextMenu?: MenuId;

	/**
	 * Optional options how menu actions are created and invoked
	 */
	menuOptions?: IMenuActionOptions;

	/**
	 * When set the `workbenchActionExecuted` is automatically send for each invoked action. The `from` property
	 * of the event will the passed `telemetrySource`-value
	 */
	telemetrySource?: string;

	/** This is controlled by the WorkbenchToolBar */
	allowContextMenu?: never;

	/**
	 * Controls the overflow behavior of the primary group of toolbar. This isthe maximum number of items and id of
	 * items that should never overflow
	 *
	 */
	overflowBehavior?: { maxItems: number; exempted?: string[] };
};

/**
 * The `WorkbenchToolBar` does
 * - support hiding of menu items
 * - lookup keybindings for each actions automatically
 * - send `workbenchActionExecuted`-events for each action
 *
 * See {@link MenuWorkbenchToolBar} for a toolbar that is backed by a menu.
 */
export class WorkbenchToolBar extends ToolBar {

	private readonly _sessionDisposables = this._store.add(new DisposableStore());

	constructor(
		container: HTMLElement,
		private _options: IWorkbenchToolBarOptions | undefined,
		@IMenuService private readonly _menuService: IMenuService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ICommandService private readonly _commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super(container, _contextMenuService, {
			// defaults
			getKeyBinding: (action) => _keybindingService.lookupKeybinding(action.id) ?? undefined,
			// options (override defaults)
			..._options,
			// mandatory (overide options)
			allowContextMenu: true,
			skipTelemetry: typeof _options?.telemetrySource === 'string',
		});

		// telemetry logic
		const telemetrySource = _options?.telemetrySource;
		if (telemetrySource) {
			this._store.add(this.actionBar.onDidRun(e => telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>(
				'workbenchActionExecuted',
				{ id: e.action.id, from: telemetrySource })
			));
		}
	}

	override setActions(_primary: readonly IAction[], _secondary: readonly IAction[] = [], menuIds?: readonly MenuId[]): void {

		this._sessionDisposables.clear();
		const primary: Array<IAction | undefined> = _primary.slice(); // for hiding and overflow we set some items to undefined
		const secondary = _secondary.slice();
		const toggleActions: IAction[] = [];
		let toggleActionsCheckedCount: number = 0;

		const extraSecondary: Array<IAction | undefined> = [];

		let someAreHidden = false;
		// unless disabled, move all hidden items to secondary group or ignore them
		if (this._options?.hiddenItemStrategy !== HiddenItemStrategy.NoHide) {
			for (let i = 0; i < primary.length; i++) {
				const action = primary[i];
				if (!(action instanceof MenuItemAction) && !(action instanceof SubmenuItemAction)) {
					// console.warn(`Action ${action.id}/${action.label} is not a MenuItemAction`);
					continue;
				}
				if (!action.hideActions) {
					continue;
				}

				// collect all toggle actions
				toggleActions.push(action.hideActions.toggle);
				if (action.hideActions.toggle.checked) {
					toggleActionsCheckedCount++;
				}

				// hidden items move into overflow or ignore
				if (action.hideActions.isHidden) {
					someAreHidden = true;
					primary[i] = undefined;
					if (this._options?.hiddenItemStrategy !== HiddenItemStrategy.Ignore) {
						extraSecondary[i] = action;
					}
				}
			}
		}

		// count for max
		if (this._options?.overflowBehavior !== undefined) {

			const exemptedIds = intersection(new Set(this._options.overflowBehavior.exempted), Iterable.map(primary, a => a?.id));
			const maxItems = this._options.overflowBehavior.maxItems - exemptedIds.size;

			let count = 0;
			for (let i = 0; i < primary.length; i++) {
				const action = primary[i];
				if (!action) {
					continue;
				}
				count++;
				if (exemptedIds.has(action.id)) {
					continue;
				}
				if (count >= maxItems) {
					primary[i] = undefined;
					extraSecondary[i] = action;
				}
			}
		}

		// coalesce turns Array<IAction|undefined> into IAction[]
		coalesceInPlace(primary);
		coalesceInPlace(extraSecondary);
		super.setActions(primary, Separator.join(extraSecondary, secondary));

		// add context menu for toggle and configure keybinding actions
		if (toggleActions.length > 0 || primary.length > 0) {
			this._sessionDisposables.add(addDisposableListener(this.getElement(), 'contextmenu', e => {
				const event = new StandardMouseEvent(getWindow(this.getElement()), e);

				const action = this.getItemAction(event.target);
				if (!(action)) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();

				const primaryActions = [];

				// -- Configure Keybinding Action --
				if (action instanceof MenuItemAction && action.menuKeybinding) {
					primaryActions.push(action.menuKeybinding);
				} else if (!(action instanceof SubmenuItemAction || action instanceof ToggleMenuAction)) {
					// only enable the configure keybinding action for actions that support keybindings
					const supportsKeybindings = !!this._keybindingService.lookupKeybinding(action.id);
					primaryActions.push(createConfigureKeybindingAction(this._commandService, this._keybindingService, action.id, undefined, supportsKeybindings));
				}

				// -- Hide Actions --
				if (toggleActions.length > 0) {
					let noHide = false;

					// last item cannot be hidden when using ignore strategy
					if (toggleActionsCheckedCount === 1 && this._options?.hiddenItemStrategy === HiddenItemStrategy.Ignore) {
						noHide = true;
						for (let i = 0; i < toggleActions.length; i++) {
							if (toggleActions[i].checked) {
								toggleActions[i] = toAction({
									id: action.id,
									label: action.label,
									checked: true,
									enabled: false,
									run() { }
								});
								break; // there is only one
							}
						}
					}

					// add "hide foo" actions
					if (!noHide && (action instanceof MenuItemAction || action instanceof SubmenuItemAction)) {
						if (!action.hideActions) {
							// no context menu for MenuItemAction instances that support no hiding
							// those are fake actions and need to be cleaned up
							return;
						}
						primaryActions.push(action.hideActions.hide);

					} else {
						primaryActions.push(toAction({
							id: 'label',
							label: localize('hide', "Hide"),
							enabled: false,
							run() { }
						}));
					}
				}

				const actions = Separator.join(primaryActions, toggleActions);

				// add "Reset Menu" action
				if (this._options?.resetMenu && !menuIds) {
					menuIds = [this._options.resetMenu];
				}
				if (someAreHidden && menuIds) {
					actions.push(new Separator());
					actions.push(toAction({
						id: 'resetThisMenu',
						label: localize('resetThisMenu', "Reset Menu"),
						run: () => this._menuService.resetHiddenStates(menuIds)
					}));
				}

				if (actions.length === 0) {
					return;
				}

				this._contextMenuService.showContextMenu({
					getAnchor: () => event,
					getActions: () => actions,
					// add context menu actions (iff appicable)
					menuId: this._options?.contextMenu,
					menuActionOptions: { renderShortTitle: true, ...this._options?.menuOptions },
					skipTelemetry: typeof this._options?.telemetrySource === 'string',
					contextKeyService: this._contextKeyService,
				});
			}));
		}
	}
}

// ---- MenuWorkbenchToolBar -------------------------------------------------


export interface IToolBarRenderOptions {
	/**
	 * Determines what groups are considered primary. Defaults to `navigation`. Items of the primary
	 * group are rendered with buttons and the rest is rendered in the secondary popup-menu.
	 */
	primaryGroup?: string | ((actionGroup: string) => boolean);

	/**
	 * Inlinse submenus with just a single item
	 */
	shouldInlineSubmenu?: (action: SubmenuAction, group: string, groupSize: number) => boolean;

	/**
	 * Should the primary group allow for separators.
	 */
	useSeparatorsInPrimaryActions?: boolean;
}

export interface IMenuWorkbenchToolBarOptions extends IWorkbenchToolBarOptions {

	/**
	 * Optional options to configure how the toolbar renderes items.
	 */
	toolbarOptions?: IToolBarRenderOptions;

	/**
	 * Only `undefined` to disable the reset command is allowed, otherwise the menus
	 * id is used.
	 */
	resetMenu?: undefined;

	/**
	 * Customize the debounce delay for menu updates
	 */
	eventDebounceDelay?: number;
}

/**
 * A {@link WorkbenchToolBar workbench toolbar} that is purely driven from a {@link MenuId menu}-identifier.
 *
 * *Note* that Manual updates via `setActions` are NOT supported.
 */
export class MenuWorkbenchToolBar extends WorkbenchToolBar {

	private readonly _onDidChangeMenuItems = this._store.add(new Emitter<this>());
	get onDidChangeMenuItems() { return this._onDidChangeMenuItems.event; }

	constructor(
		container: HTMLElement,
		menuId: MenuId,
		options: IMenuWorkbenchToolBarOptions | undefined,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IKeybindingService keybindingService: IKeybindingService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IActionViewItemService actionViewService: IActionViewItemService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super(container, {
			resetMenu: menuId,
			...options,
			actionViewItemProvider: (action, opts) => {
				let provider = actionViewService.lookUp(menuId, action instanceof SubmenuItemAction ? action.item.submenu.id : action.id);
				if (!provider) {
					provider = options?.actionViewItemProvider;
				}
				const viewItem = provider?.(action, opts, instantiationService, getWindow(container).vscodeWindowId);
				if (viewItem) {
					return viewItem;
				}
				return createActionViewItem(instantiationService, action, opts);
			}
		}, menuService, contextKeyService, contextMenuService, keybindingService, commandService, telemetryService);

		// update logic
		const menu = this._store.add(menuService.createMenu(menuId, contextKeyService, { emitEventsForSubmenuChanges: true, eventDebounceDelay: options?.eventDebounceDelay }));
		const updateToolbar = () => {
			const { primary, secondary } = getActionBarActions(
				menu.getActions(options?.menuOptions),
				options?.toolbarOptions?.primaryGroup,
				options?.toolbarOptions?.shouldInlineSubmenu,
				options?.toolbarOptions?.useSeparatorsInPrimaryActions
			);
			container.classList.toggle('has-no-actions', primary.length === 0 && secondary.length === 0);
			super.setActions(primary, secondary);
		};

		this._store.add(menu.onDidChange(() => {
			updateToolbar();
			this._onDidChangeMenuItems.fire(this);
		}));

		this._store.add(actionViewService.onDidChange(e => {
			if (e === menuId) {
				updateToolbar();
			}
		}));
		updateToolbar();
	}

	/**
	 * @deprecated The WorkbenchToolBar does not support this method because it works with menus.
	 */
	override setActions(): void {
		throw new BugIndicatingError('This toolbar is populated from a menu.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/common/actions.contribution.ts]---
Location: vscode-main/src/vs/platform/actions/common/actions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMenuService, registerAction2 } from './actions.js';
import { MenuHiddenStatesReset } from './menuResetAction.js';
import { MenuService } from './menuService.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';

registerSingleton(IMenuService, MenuService, InstantiationType.Delayed);

registerAction2(MenuHiddenStatesReset);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/common/actions.ts]---
Location: vscode-main/src/vs/platform/actions/common/actions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, SubmenuAction } from '../../../base/common/actions.js';
import { Event, MicrotaskEmitter } from '../../../base/common/event.js';
import { DisposableStore, dispose, IDisposable, markAsSingleton, toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { ICommandAction, ICommandActionTitle, Icon, ILocalizedString } from '../../action/common/action.js';
import { Categories } from '../../action/common/actionCommonCategories.js';
import { CommandsRegistry, ICommandService } from '../../commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../contextkey/common/contextkey.js';
import { createDecorator, ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { IKeybindingRule, KeybindingsRegistry } from '../../keybinding/common/keybindingsRegistry.js';

export interface IMenuItem {
	command: ICommandAction;
	alt?: ICommandAction;
	/**
	 * Menu item is hidden if this expression returns false.
	 */
	when?: ContextKeyExpression;
	group?: 'navigation' | string;
	order?: number;
	isHiddenByDefault?: boolean;
}

export interface ISubmenuItem {
	title: string | ICommandActionTitle;
	submenu: MenuId;
	icon?: Icon;
	when?: ContextKeyExpression;
	group?: 'navigation' | string;
	order?: number;
	isSelection?: boolean;
	/**
	 * A split button shows the first action
	 * as primary action and the rest of the
	 * actions in a dropdown.
	 *
	 * Use `togglePrimaryAction` to promote
	 * the action that was last used to be
	 * the primary action and remember that
	 * choice.
	 */
	isSplitButton?: boolean | {
		/**
		 * Will update the primary action based
		 * on the action that was last run.
		 */
		togglePrimaryAction: true;
	};
}

export function isIMenuItem(item: unknown): item is IMenuItem {
	return (item as IMenuItem).command !== undefined;
}

export function isISubmenuItem(item: unknown): item is ISubmenuItem {
	return (item as ISubmenuItem).submenu !== undefined;
}

export class MenuId {

	private static readonly _instances = new Map<string, MenuId>();

	static readonly CommandPalette = new MenuId('CommandPalette');
	static readonly DebugBreakpointsContext = new MenuId('DebugBreakpointsContext');
	static readonly DebugCallStackContext = new MenuId('DebugCallStackContext');
	static readonly DebugConsoleContext = new MenuId('DebugConsoleContext');
	static readonly DebugVariablesContext = new MenuId('DebugVariablesContext');
	static readonly NotebookVariablesContext = new MenuId('NotebookVariablesContext');
	static readonly DebugHoverContext = new MenuId('DebugHoverContext');
	static readonly DebugWatchContext = new MenuId('DebugWatchContext');
	static readonly DebugToolBar = new MenuId('DebugToolBar');
	static readonly DebugToolBarStop = new MenuId('DebugToolBarStop');
	static readonly DebugDisassemblyContext = new MenuId('DebugDisassemblyContext');
	static readonly DebugCallStackToolbar = new MenuId('DebugCallStackToolbar');
	static readonly DebugCreateConfiguration = new MenuId('DebugCreateConfiguration');
	static readonly DebugScopesContext = new MenuId('DebugScopesContext');
	static readonly EditorContext = new MenuId('EditorContext');
	static readonly SimpleEditorContext = new MenuId('SimpleEditorContext');
	static readonly EditorContent = new MenuId('EditorContent');
	static readonly EditorLineNumberContext = new MenuId('EditorLineNumberContext');
	static readonly EditorContextCopy = new MenuId('EditorContextCopy');
	static readonly EditorContextPeek = new MenuId('EditorContextPeek');
	static readonly EditorContextShare = new MenuId('EditorContextShare');
	static readonly EditorTitle = new MenuId('EditorTitle');
	static readonly CompactWindowEditorTitle = new MenuId('CompactWindowEditorTitle');
	static readonly EditorTitleRun = new MenuId('EditorTitleRun');
	static readonly EditorTitleContext = new MenuId('EditorTitleContext');
	static readonly EditorTitleContextShare = new MenuId('EditorTitleContextShare');
	static readonly EmptyEditorGroup = new MenuId('EmptyEditorGroup');
	static readonly EmptyEditorGroupContext = new MenuId('EmptyEditorGroupContext');
	static readonly EditorTabsBarContext = new MenuId('EditorTabsBarContext');
	static readonly EditorTabsBarShowTabsSubmenu = new MenuId('EditorTabsBarShowTabsSubmenu');
	static readonly EditorTabsBarShowTabsZenModeSubmenu = new MenuId('EditorTabsBarShowTabsZenModeSubmenu');
	static readonly EditorActionsPositionSubmenu = new MenuId('EditorActionsPositionSubmenu');
	static readonly EditorSplitMoveSubmenu = new MenuId('EditorSplitMoveSubmenu');
	static readonly ExplorerContext = new MenuId('ExplorerContext');
	static readonly ExplorerContextShare = new MenuId('ExplorerContextShare');
	static readonly ExtensionContext = new MenuId('ExtensionContext');
	static readonly ExtensionEditorContextMenu = new MenuId('ExtensionEditorContextMenu');
	static readonly GlobalActivity = new MenuId('GlobalActivity');
	static readonly CommandCenter = new MenuId('CommandCenter');
	static readonly CommandCenterCenter = new MenuId('CommandCenterCenter');
	static readonly LayoutControlMenuSubmenu = new MenuId('LayoutControlMenuSubmenu');
	static readonly LayoutControlMenu = new MenuId('LayoutControlMenu');
	static readonly MenubarMainMenu = new MenuId('MenubarMainMenu');
	static readonly MenubarAppearanceMenu = new MenuId('MenubarAppearanceMenu');
	static readonly MenubarDebugMenu = new MenuId('MenubarDebugMenu');
	static readonly MenubarEditMenu = new MenuId('MenubarEditMenu');
	static readonly MenubarCopy = new MenuId('MenubarCopy');
	static readonly MenubarFileMenu = new MenuId('MenubarFileMenu');
	static readonly MenubarGoMenu = new MenuId('MenubarGoMenu');
	static readonly MenubarHelpMenu = new MenuId('MenubarHelpMenu');
	static readonly MenubarLayoutMenu = new MenuId('MenubarLayoutMenu');
	static readonly MenubarNewBreakpointMenu = new MenuId('MenubarNewBreakpointMenu');
	static readonly PanelAlignmentMenu = new MenuId('PanelAlignmentMenu');
	static readonly PanelPositionMenu = new MenuId('PanelPositionMenu');
	static readonly ActivityBarPositionMenu = new MenuId('ActivityBarPositionMenu');
	static readonly MenubarPreferencesMenu = new MenuId('MenubarPreferencesMenu');
	static readonly MenubarRecentMenu = new MenuId('MenubarRecentMenu');
	static readonly MenubarSelectionMenu = new MenuId('MenubarSelectionMenu');
	static readonly MenubarShare = new MenuId('MenubarShare');
	static readonly MenubarSwitchEditorMenu = new MenuId('MenubarSwitchEditorMenu');
	static readonly MenubarSwitchGroupMenu = new MenuId('MenubarSwitchGroupMenu');
	static readonly MenubarTerminalMenu = new MenuId('MenubarTerminalMenu');
	static readonly MenubarTerminalSuggestStatusMenu = new MenuId('MenubarTerminalSuggestStatusMenu');
	static readonly MenubarViewMenu = new MenuId('MenubarViewMenu');
	static readonly MenubarHomeMenu = new MenuId('MenubarHomeMenu');
	static readonly OpenEditorsContext = new MenuId('OpenEditorsContext');
	static readonly OpenEditorsContextShare = new MenuId('OpenEditorsContextShare');
	static readonly ProblemsPanelContext = new MenuId('ProblemsPanelContext');
	static readonly SCMInputBox = new MenuId('SCMInputBox');
	static readonly SCMChangeContext = new MenuId('SCMChangeContext');
	static readonly SCMResourceContext = new MenuId('SCMResourceContext');
	static readonly SCMResourceContextShare = new MenuId('SCMResourceContextShare');
	static readonly SCMResourceFolderContext = new MenuId('SCMResourceFolderContext');
	static readonly SCMResourceGroupContext = new MenuId('SCMResourceGroupContext');
	static readonly SCMSourceControl = new MenuId('SCMSourceControl');
	static readonly SCMSourceControlInline = new MenuId('SCMSourceControlInline');
	static readonly SCMSourceControlTitle = new MenuId('SCMSourceControlTitle');
	static readonly SCMHistoryTitle = new MenuId('SCMHistoryTitle');
	static readonly SCMHistoryItemContext = new MenuId('SCMHistoryItemContext');
	static readonly SCMHistoryItemChangeContext = new MenuId('SCMHistoryItemChangeContext');
	static readonly SCMHistoryItemRefContext = new MenuId('SCMHistoryItemRefContext');
	static readonly SCMArtifactGroupContext = new MenuId('SCMArtifactGroupContext');
	static readonly SCMArtifactContext = new MenuId('SCMArtifactContext');
	static readonly SCMQuickDiffDecorations = new MenuId('SCMQuickDiffDecorations');
	static readonly SCMTitle = new MenuId('SCMTitle');
	static readonly SearchContext = new MenuId('SearchContext');
	static readonly SearchActionMenu = new MenuId('SearchActionContext');
	static readonly StatusBarWindowIndicatorMenu = new MenuId('StatusBarWindowIndicatorMenu');
	static readonly StatusBarRemoteIndicatorMenu = new MenuId('StatusBarRemoteIndicatorMenu');
	static readonly StickyScrollContext = new MenuId('StickyScrollContext');
	static readonly TestItem = new MenuId('TestItem');
	static readonly TestItemGutter = new MenuId('TestItemGutter');
	static readonly TestProfilesContext = new MenuId('TestProfilesContext');
	static readonly TestMessageContext = new MenuId('TestMessageContext');
	static readonly TestMessageContent = new MenuId('TestMessageContent');
	static readonly TestPeekElement = new MenuId('TestPeekElement');
	static readonly TestPeekTitle = new MenuId('TestPeekTitle');
	static readonly TestCallStack = new MenuId('TestCallStack');
	static readonly TestCoverageFilterItem = new MenuId('TestCoverageFilterItem');
	static readonly TouchBarContext = new MenuId('TouchBarContext');
	static readonly TitleBar = new MenuId('TitleBar');
	static readonly TitleBarContext = new MenuId('TitleBarContext');
	static readonly TitleBarTitleContext = new MenuId('TitleBarTitleContext');
	static readonly TunnelContext = new MenuId('TunnelContext');
	static readonly TunnelPrivacy = new MenuId('TunnelPrivacy');
	static readonly TunnelProtocol = new MenuId('TunnelProtocol');
	static readonly TunnelPortInline = new MenuId('TunnelInline');
	static readonly TunnelTitle = new MenuId('TunnelTitle');
	static readonly TunnelLocalAddressInline = new MenuId('TunnelLocalAddressInline');
	static readonly TunnelOriginInline = new MenuId('TunnelOriginInline');
	static readonly ViewItemContext = new MenuId('ViewItemContext');
	static readonly ViewContainerTitle = new MenuId('ViewContainerTitle');
	static readonly ViewContainerTitleContext = new MenuId('ViewContainerTitleContext');
	static readonly ViewTitle = new MenuId('ViewTitle');
	static readonly ViewTitleContext = new MenuId('ViewTitleContext');
	static readonly CommentEditorActions = new MenuId('CommentEditorActions');
	static readonly CommentThreadTitle = new MenuId('CommentThreadTitle');
	static readonly CommentThreadActions = new MenuId('CommentThreadActions');
	static readonly CommentThreadAdditionalActions = new MenuId('CommentThreadAdditionalActions');
	static readonly CommentThreadTitleContext = new MenuId('CommentThreadTitleContext');
	static readonly CommentThreadCommentContext = new MenuId('CommentThreadCommentContext');
	static readonly CommentTitle = new MenuId('CommentTitle');
	static readonly CommentActions = new MenuId('CommentActions');
	static readonly CommentsViewThreadActions = new MenuId('CommentsViewThreadActions');
	static readonly InteractiveToolbar = new MenuId('InteractiveToolbar');
	static readonly InteractiveCellTitle = new MenuId('InteractiveCellTitle');
	static readonly InteractiveCellDelete = new MenuId('InteractiveCellDelete');
	static readonly InteractiveCellExecute = new MenuId('InteractiveCellExecute');
	static readonly InteractiveInputExecute = new MenuId('InteractiveInputExecute');
	static readonly InteractiveInputConfig = new MenuId('InteractiveInputConfig');
	static readonly ReplInputExecute = new MenuId('ReplInputExecute');
	static readonly IssueReporter = new MenuId('IssueReporter');
	static readonly NotebookToolbar = new MenuId('NotebookToolbar');
	static readonly NotebookToolbarContext = new MenuId('NotebookToolbarContext');
	static readonly NotebookStickyScrollContext = new MenuId('NotebookStickyScrollContext');
	static readonly NotebookCellTitle = new MenuId('NotebookCellTitle');
	static readonly NotebookCellDelete = new MenuId('NotebookCellDelete');
	static readonly NotebookCellInsert = new MenuId('NotebookCellInsert');
	static readonly NotebookCellBetween = new MenuId('NotebookCellBetween');
	static readonly NotebookCellListTop = new MenuId('NotebookCellTop');
	static readonly NotebookCellExecute = new MenuId('NotebookCellExecute');
	static readonly NotebookCellExecuteGoTo = new MenuId('NotebookCellExecuteGoTo');
	static readonly NotebookCellExecutePrimary = new MenuId('NotebookCellExecutePrimary');
	static readonly NotebookDiffCellInputTitle = new MenuId('NotebookDiffCellInputTitle');
	static readonly NotebookDiffDocumentMetadata = new MenuId('NotebookDiffDocumentMetadata');
	static readonly NotebookDiffCellMetadataTitle = new MenuId('NotebookDiffCellMetadataTitle');
	static readonly NotebookDiffCellOutputsTitle = new MenuId('NotebookDiffCellOutputsTitle');
	static readonly NotebookOutputToolbar = new MenuId('NotebookOutputToolbar');
	static readonly NotebookOutlineFilter = new MenuId('NotebookOutlineFilter');
	static readonly NotebookOutlineActionMenu = new MenuId('NotebookOutlineActionMenu');
	static readonly NotebookEditorLayoutConfigure = new MenuId('NotebookEditorLayoutConfigure');
	static readonly NotebookKernelSource = new MenuId('NotebookKernelSource');
	static readonly BulkEditTitle = new MenuId('BulkEditTitle');
	static readonly BulkEditContext = new MenuId('BulkEditContext');
	static readonly TimelineItemContext = new MenuId('TimelineItemContext');
	static readonly TimelineTitle = new MenuId('TimelineTitle');
	static readonly TimelineTitleContext = new MenuId('TimelineTitleContext');
	static readonly TimelineFilterSubMenu = new MenuId('TimelineFilterSubMenu');
	static readonly AccountsContext = new MenuId('AccountsContext');
	static readonly SidebarTitle = new MenuId('SidebarTitle');
	static readonly PanelTitle = new MenuId('PanelTitle');
	static readonly AuxiliaryBarTitle = new MenuId('AuxiliaryBarTitle');
	static readonly TerminalInstanceContext = new MenuId('TerminalInstanceContext');
	static readonly TerminalEditorInstanceContext = new MenuId('TerminalEditorInstanceContext');
	static readonly TerminalNewDropdownContext = new MenuId('TerminalNewDropdownContext');
	static readonly TerminalTabContext = new MenuId('TerminalTabContext');
	static readonly TerminalTabEmptyAreaContext = new MenuId('TerminalTabEmptyAreaContext');
	static readonly TerminalStickyScrollContext = new MenuId('TerminalStickyScrollContext');
	static readonly WebviewContext = new MenuId('WebviewContext');
	static readonly InlineCompletionsActions = new MenuId('InlineCompletionsActions');
	static readonly InlineEditsActions = new MenuId('InlineEditsActions');
	static readonly NewFile = new MenuId('NewFile');
	static readonly MergeInput1Toolbar = new MenuId('MergeToolbar1Toolbar');
	static readonly MergeInput2Toolbar = new MenuId('MergeToolbar2Toolbar');
	static readonly MergeBaseToolbar = new MenuId('MergeBaseToolbar');
	static readonly MergeInputResultToolbar = new MenuId('MergeToolbarResultToolbar');
	static readonly InlineSuggestionToolbar = new MenuId('InlineSuggestionToolbar');
	static readonly InlineEditToolbar = new MenuId('InlineEditToolbar');
	static readonly ChatContext = new MenuId('ChatContext');
	static readonly ChatCodeBlock = new MenuId('ChatCodeblock');
	static readonly ChatCompareBlock = new MenuId('ChatCompareBlock');
	static readonly ChatMessageTitle = new MenuId('ChatMessageTitle');
	static readonly ChatWelcomeContext = new MenuId('ChatWelcomeContext');
	static readonly ChatMessageFooter = new MenuId('ChatMessageFooter');
	static readonly ChatExecute = new MenuId('ChatExecute');
	static readonly ChatInput = new MenuId('ChatInput');
	static readonly ChatInputSide = new MenuId('ChatInputSide');
	static readonly ChatModePicker = new MenuId('ChatModePicker');
	static readonly ChatEditingWidgetToolbar = new MenuId('ChatEditingWidgetToolbar');
	static readonly ChatEditingSessionChangesToolbar = new MenuId('ChatEditingSessionChangesToolbar');
	static readonly ChatEditingEditorContent = new MenuId('ChatEditingEditorContent');
	static readonly ChatEditingEditorHunk = new MenuId('ChatEditingEditorHunk');
	static readonly ChatEditingDeletedNotebookCell = new MenuId('ChatEditingDeletedNotebookCell');
	static readonly ChatInputAttachmentToolbar = new MenuId('ChatInputAttachmentToolbar');
	static readonly ChatEditingWidgetModifiedFilesToolbar = new MenuId('ChatEditingWidgetModifiedFilesToolbar');
	static readonly ChatInputResourceAttachmentContext = new MenuId('ChatInputResourceAttachmentContext');
	static readonly ChatInputSymbolAttachmentContext = new MenuId('ChatInputSymbolAttachmentContext');
	static readonly ChatInlineResourceAnchorContext = new MenuId('ChatInlineResourceAnchorContext');
	static readonly ChatInlineSymbolAnchorContext = new MenuId('ChatInlineSymbolAnchorContext');
	static readonly ChatMessageCheckpoint: MenuId = new MenuId('ChatMessageCheckpoint');
	static readonly ChatMessageRestoreCheckpoint: MenuId = new MenuId('ChatMessageRestoreCheckpoint');
	static readonly ChatNewMenu = new MenuId('ChatNewMenu');
	static readonly ChatEditingCodeBlockContext = new MenuId('ChatEditingCodeBlockContext');
	static readonly ChatTitleBarMenu = new MenuId('ChatTitleBarMenu');
	static readonly ChatAttachmentsContext = new MenuId('ChatAttachmentsContext');
	static readonly ChatToolOutputResourceToolbar = new MenuId('ChatToolOutputResourceToolbar');
	static readonly ChatTextEditorMenu = new MenuId('ChatTextEditorMenu');
	static readonly ChatToolOutputResourceContext = new MenuId('ChatToolOutputResourceContext');
	static readonly ChatMultiDiffContext = new MenuId('ChatMultiDiffContext');
	static readonly ChatConfirmationMenu = new MenuId('ChatConfirmationMenu');
	static readonly ChatEditorInlineExecute = new MenuId('ChatEditorInputExecute');
	static readonly ChatEditorInlineInputSide = new MenuId('ChatEditorInputSide');
	static readonly AccessibleView = new MenuId('AccessibleView');
	static readonly MultiDiffEditorContent = new MenuId('MultiDiffEditorContent');
	static readonly MultiDiffEditorFileToolbar = new MenuId('MultiDiffEditorFileToolbar');
	static readonly DiffEditorHunkToolbar = new MenuId('DiffEditorHunkToolbar');
	static readonly DiffEditorSelectionToolbar = new MenuId('DiffEditorSelectionToolbar');
	static readonly AgentSessionsViewerFilterSubMenu = new MenuId('AgentSessionsViewerFilterSubMenu');
	static readonly AgentSessionsContext = new MenuId('AgentSessionsContext');
	static readonly AgentSessionsCreateSubMenu = new MenuId('AgentSessionsCreateSubMenu');
	static readonly AgentSessionsToolbar = new MenuId('AgentSessionsToolbar');
	static readonly AgentSessionItemToolbar = new MenuId('AgentSessionItemToolbar');
	static readonly AgentSessionSectionToolbar = new MenuId('AgentSessionSectionToolbar');
	static readonly ChatViewSessionTitleNavigationToolbar = new MenuId('ChatViewSessionTitleNavigationToolbar');
	static readonly ChatViewSessionTitleToolbar = new MenuId('ChatViewSessionTitleToolbar');

	/**
	 * Create or reuse a `MenuId` with the given identifier
	 */
	static for(identifier: string): MenuId {
		return MenuId._instances.get(identifier) ?? new MenuId(identifier);
	}

	readonly id: string;

	/**
	 * Create a new `MenuId` with the unique identifier. Will throw if a menu
	 * with the identifier already exists, use `MenuId.for(ident)` or a unique
	 * identifier
	 */
	constructor(identifier: string) {
		if (MenuId._instances.has(identifier)) {
			throw new TypeError(`MenuId with identifier '${identifier}' already exists. Use MenuId.for(ident) or a unique identifier`);
		}
		MenuId._instances.set(identifier, this);
		this.id = identifier;
	}
}

export interface IMenuActionOptions {
	arg?: unknown;
	shouldForwardArgs?: boolean;
	renderShortTitle?: boolean;
}

export interface IMenuChangeEvent {
	readonly menu: IMenu;
	readonly isStructuralChange: boolean;
	readonly isToggleChange: boolean;
	readonly isEnablementChange: boolean;
}

export interface IMenu extends IDisposable {
	readonly onDidChange: Event<IMenuChangeEvent>;
	getActions(options?: IMenuActionOptions): [string, Array<MenuItemAction | SubmenuItemAction>][];
}

export interface IMenuData {
	contexts: ReadonlySet<string>;
	actions: [string, Array<MenuItemAction | SubmenuItemAction>][];
}

export const IMenuService = createDecorator<IMenuService>('menuService');

export interface IMenuCreateOptions {
	emitEventsForSubmenuChanges?: boolean;
	eventDebounceDelay?: number;
}

export interface IMenuService {

	readonly _serviceBrand: undefined;

	/**
	 * Consider using getMenuActions if you don't need to listen to events.
	 *
	 * Create a new menu for the given menu identifier. A menu sends events when it's entries
	 * have changed (placement, enablement, checked-state). By default it does not send events for
	 * submenu entries. That is more expensive and must be explicitly enabled with the
	 * `emitEventsForSubmenuChanges` flag.
	 */
	createMenu(id: MenuId, contextKeyService: IContextKeyService, options?: IMenuCreateOptions): IMenu;

	/**
	 * Creates a new menu, gets the actions, and then disposes of the menu.
	 */
	getMenuActions(id: MenuId, contextKeyService: IContextKeyService, options?: IMenuActionOptions): [string, Array<MenuItemAction | SubmenuItemAction>][];

	/**
	 * Gets the names of the contexts that this menu listens on.
	 */
	getMenuContexts(id: MenuId): ReadonlySet<string>;

	/**
	 * Reset **all** menu item hidden states.
	 */
	resetHiddenStates(): void;

	/**
	 * Reset the menu's hidden states.
	 */
	resetHiddenStates(menuIds: readonly MenuId[] | undefined): void;
}

type ICommandsMap = Map<string, ICommandAction>;

export interface IMenuRegistryChangeEvent {
	has(id: MenuId): boolean;
}

class MenuRegistryChangeEvent {

	private static _all = new Map<MenuId, MenuRegistryChangeEvent>();

	static for(id: MenuId): MenuRegistryChangeEvent {
		let value = this._all.get(id);
		if (!value) {
			value = new MenuRegistryChangeEvent(id);
			this._all.set(id, value);
		}
		return value;
	}

	static merge(events: IMenuRegistryChangeEvent[]): IMenuRegistryChangeEvent {
		const ids = new Set<MenuId>();
		for (const item of events) {
			if (item instanceof MenuRegistryChangeEvent) {
				ids.add(item.id);
			}
		}
		return ids;
	}

	readonly has: (id: MenuId) => boolean;

	private constructor(private readonly id: MenuId) {
		this.has = candidate => candidate === id;
	}
}

export interface IMenuRegistry {
	readonly onDidChangeMenu: Event<IMenuRegistryChangeEvent>;
	addCommand(userCommand: ICommandAction): IDisposable;
	getCommand(id: string): ICommandAction | undefined;
	getCommands(): ICommandsMap;

	/**
	 * @deprecated Use `appendMenuItem` or most likely use `registerAction2` instead. There should be no strong
	 * reason to use this directly.
	 */
	appendMenuItems(items: Iterable<{ id: MenuId; item: IMenuItem | ISubmenuItem }>): IDisposable;
	appendMenuItem(menu: MenuId, item: IMenuItem | ISubmenuItem): IDisposable;
	getMenuItems(loc: MenuId): Array<IMenuItem | ISubmenuItem>;
}

export const MenuRegistry: IMenuRegistry = new class implements IMenuRegistry {

	private readonly _commands = new Map<string, ICommandAction>();
	private readonly _menuItems = new Map<MenuId, LinkedList<IMenuItem | ISubmenuItem>>();
	private readonly _onDidChangeMenu = new MicrotaskEmitter<IMenuRegistryChangeEvent>({
		merge: MenuRegistryChangeEvent.merge
	});

	readonly onDidChangeMenu: Event<IMenuRegistryChangeEvent> = this._onDidChangeMenu.event;

	addCommand(command: ICommandAction): IDisposable {
		this._commands.set(command.id, command);
		this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(MenuId.CommandPalette));

		return markAsSingleton(toDisposable(() => {
			if (this._commands.delete(command.id)) {
				this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(MenuId.CommandPalette));
			}
		}));
	}

	getCommand(id: string): ICommandAction | undefined {
		return this._commands.get(id);
	}

	getCommands(): ICommandsMap {
		const map = new Map<string, ICommandAction>();
		this._commands.forEach((value, key) => map.set(key, value));
		return map;
	}

	appendMenuItem(id: MenuId, item: IMenuItem | ISubmenuItem): IDisposable {
		let list = this._menuItems.get(id);
		if (!list) {
			list = new LinkedList();
			this._menuItems.set(id, list);
		}
		const rm = list.push(item);
		this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(id));
		return markAsSingleton(toDisposable(() => {
			rm();
			this._onDidChangeMenu.fire(MenuRegistryChangeEvent.for(id));
		}));
	}

	appendMenuItems(items: Iterable<{ id: MenuId; item: IMenuItem | ISubmenuItem }>): IDisposable {
		const result = new DisposableStore();
		for (const { id, item } of items) {
			result.add(this.appendMenuItem(id, item));
		}
		return result;
	}

	getMenuItems(id: MenuId): Array<IMenuItem | ISubmenuItem> {
		let result: Array<IMenuItem | ISubmenuItem>;
		if (this._menuItems.has(id)) {
			result = [...this._menuItems.get(id)!];
		} else {
			result = [];
		}
		if (id === MenuId.CommandPalette) {
			// CommandPalette is special because it shows
			// all commands by default
			this._appendImplicitItems(result);
		}
		return result;
	}

	private _appendImplicitItems(result: Array<IMenuItem | ISubmenuItem>) {
		const set = new Set<string>();

		for (const item of result) {
			if (isIMenuItem(item)) {
				set.add(item.command.id);
				if (item.alt) {
					set.add(item.alt.id);
				}
			}
		}
		this._commands.forEach((command, id) => {
			if (!set.has(id)) {
				result.push({ command });
			}
		});
	}
};

export class SubmenuItemAction extends SubmenuAction {

	constructor(
		readonly item: ISubmenuItem,
		readonly hideActions: IMenuItemHide | undefined,
		actions: readonly IAction[],
	) {
		super(`submenuitem.${item.submenu.id}`, typeof item.title === 'string' ? item.title : item.title.value, actions, 'submenu');
	}
}

export interface IMenuItemHide {
	readonly isHidden: boolean;
	readonly hide: IAction;
	readonly toggle: IAction;
}

// implements IAction, does NOT extend Action, so that no one
// subscribes to events of Action or modified properties
export class MenuItemAction implements IAction {

	static label(action: ICommandAction, options?: IMenuActionOptions): string {
		return options?.renderShortTitle && action.shortTitle
			? (typeof action.shortTitle === 'string' ? action.shortTitle : action.shortTitle.value)
			: (typeof action.title === 'string' ? action.title : action.title.value);
	}

	readonly item: ICommandAction;
	readonly alt: MenuItemAction | undefined;

	private readonly _options: IMenuActionOptions | undefined;

	readonly id: string;
	readonly label: string;
	readonly tooltip: string;
	readonly class: string | undefined;
	readonly enabled: boolean;
	readonly checked?: boolean;

	constructor(
		item: ICommandAction,
		alt: ICommandAction | undefined,
		options: IMenuActionOptions | undefined,
		readonly hideActions: IMenuItemHide | undefined,
		readonly menuKeybinding: IAction | undefined,
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICommandService private _commandService: ICommandService
	) {
		this.id = item.id;
		this.label = MenuItemAction.label(item, options);
		this.tooltip = (typeof item.tooltip === 'string' ? item.tooltip : item.tooltip?.value) ?? '';
		this.enabled = !item.precondition || contextKeyService.contextMatchesRules(item.precondition);
		this.checked = undefined;

		let icon: ThemeIcon | undefined;

		if (item.toggled) {
			const toggled = ((item.toggled as { condition: ContextKeyExpression }).condition ? item.toggled : { condition: item.toggled }) as {
				condition: ContextKeyExpression; icon?: Icon; tooltip?: string | ILocalizedString; title?: string | ILocalizedString;
			};
			this.checked = contextKeyService.contextMatchesRules(toggled.condition);
			if (this.checked && toggled.tooltip) {
				this.tooltip = typeof toggled.tooltip === 'string' ? toggled.tooltip : toggled.tooltip.value;
			}

			if (this.checked && ThemeIcon.isThemeIcon(toggled.icon)) {
				icon = toggled.icon;
			}

			if (this.checked && toggled.title) {
				this.label = typeof toggled.title === 'string' ? toggled.title : toggled.title.value;
			}
		}

		if (!icon) {
			icon = ThemeIcon.isThemeIcon(item.icon) ? item.icon : undefined;
		}

		this.item = item;
		this.alt = alt ? new MenuItemAction(alt, undefined, options, hideActions, undefined, contextKeyService, _commandService) : undefined;
		this._options = options;
		this.class = icon && ThemeIcon.asClassName(icon);

	}

	run(...args: unknown[]): Promise<void> {
		let runArgs: unknown[] = [];

		if (this._options?.arg) {
			runArgs = [...runArgs, this._options.arg];
		}

		if (this._options?.shouldForwardArgs) {
			runArgs = [...runArgs, ...args];
		}

		return this._commandService.executeCommand(this.id, ...runArgs);
	}
}

//#region --- IAction2

type OneOrN<T> = T | T[];

interface IAction2CommonOptions extends ICommandAction {
	/**
	 * One or many menu items.
	 */
	menu?: OneOrN<{ id: MenuId; precondition?: null } & Omit<IMenuItem, 'command'>>;

	/**
	 * One keybinding.
	 */
	keybinding?: OneOrN<Omit<IKeybindingRule, 'id'>>;
}

interface IBaseAction2Options extends IAction2CommonOptions {

	/**
	 * This type is used when an action is not going to show up in the command palette.
	 * In that case, it's able to use a string for the `title` and `category` properties.
	 */
	f1?: false;
}

export interface ICommandPaletteOptions extends IAction2CommonOptions {

	/**
	 * The title of the command that will be displayed in the command palette after the category.
	 *  This overrides {@link ICommandAction.title} to ensure a string isn't used so that the title
	 *  includes the localized value and the original value for users using language packs.
	 */
	title: ICommandActionTitle;

	/**
	 * The category of the command that will be displayed in the command palette before the title suffixed.
	 * with a colon This overrides {@link ICommandAction.title} to ensure a string isn't used so that
	 * the title includes the localized value and the original value for users using language packs.
	 */
	category?: keyof typeof Categories | ILocalizedString;

	/**
	 * Shorthand to add this command to the command palette. Note: this is not the only way to declare that
	 * a command should be in the command palette... however, enforcing ILocalizedString in the other scenarios
	 * is much more challenging and this gets us most of the way there.
	 */
	f1: true;
}

export type IAction2Options = ICommandPaletteOptions | IBaseAction2Options;

export interface IAction2F1RequiredOptions {
	title: ICommandActionTitle;
	category?: keyof typeof Categories | ILocalizedString;
}

export abstract class Action2 {
	constructor(readonly desc: Readonly<IAction2Options>) { }
	abstract run(accessor: ServicesAccessor, ...args: unknown[]): void;
}

export function registerAction2(ctor: { new(): Action2 }): IDisposable {
	const disposables: IDisposable[] = []; // not using `DisposableStore` to reduce startup perf cost
	const action = new ctor();

	const { f1, menu, keybinding, ...command } = action.desc;

	if (CommandsRegistry.getCommand(command.id)) {
		throw new Error(`Cannot register two commands with the same id: ${command.id}`);
	}

	// command
	disposables.push(CommandsRegistry.registerCommand({
		id: command.id,
		handler: (accessor, ...args) => action.run(accessor, ...args),
		metadata: command.metadata ?? { description: action.desc.title }
	}));

	// menu
	if (Array.isArray(menu)) {
		for (const item of menu) {
			disposables.push(MenuRegistry.appendMenuItem(item.id, { command: { ...command, precondition: item.precondition === null ? undefined : command.precondition }, ...item }));
		}

	} else if (menu) {
		disposables.push(MenuRegistry.appendMenuItem(menu.id, { command: { ...command, precondition: menu.precondition === null ? undefined : command.precondition }, ...menu }));
	}
	if (f1) {
		disposables.push(MenuRegistry.appendMenuItem(MenuId.CommandPalette, { command, when: command.precondition }));
		disposables.push(MenuRegistry.addCommand(command));
	}

	// keybinding
	if (Array.isArray(keybinding)) {
		for (const item of keybinding) {
			disposables.push(KeybindingsRegistry.registerKeybindingRule({
				...item,
				id: command.id,
				when: command.precondition ? ContextKeyExpr.and(command.precondition, item.when) : item.when
			}));
		}
	} else if (keybinding) {
		disposables.push(KeybindingsRegistry.registerKeybindingRule({
			...keybinding,
			id: command.id,
			when: command.precondition ? ContextKeyExpr.and(command.precondition, keybinding.when) : keybinding.when
		}));
	}

	return {
		dispose() {
			dispose(disposables);
		}
	};
}
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/common/menuResetAction.ts]---
Location: vscode-main/src/vs/platform/actions/common/menuResetAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../nls.js';
import { Categories } from '../../action/common/actionCommonCategories.js';
import { Action2, IMenuService } from './actions.js';
import { ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';

export class MenuHiddenStatesReset extends Action2 {

	constructor() {
		super({
			id: 'menu.resetHiddenStates',
			title: localize2('title', "Reset All Menus"),
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IMenuService).resetHiddenStates();
		accessor.get(ILogService).info('did RESET all menu hidden states');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/common/menuService.ts]---
Location: vscode-main/src/vs/platform/actions/common/menuService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../base/common/async.js';
import { DebounceEmitter, Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IMenu, IMenuActionOptions, IMenuChangeEvent, IMenuCreateOptions, IMenuItem, IMenuItemHide, IMenuService, isIMenuItem, isISubmenuItem, ISubmenuItem, MenuId, MenuItemAction, MenuRegistry, SubmenuItemAction } from './actions.js';
import { ICommandAction, ILocalizedString } from '../../action/common/action.js';
import { ICommandService } from '../../commands/common/commands.js';
import { ContextKeyExpression, IContextKeyService } from '../../contextkey/common/contextkey.js';
import { IAction, Separator, toAction } from '../../../base/common/actions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { removeFastWithoutKeepingOrder } from '../../../base/common/arrays.js';
import { localize } from '../../../nls.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';

export class MenuService implements IMenuService {

	declare readonly _serviceBrand: undefined;

	private readonly _hiddenStates: PersistedMenuHideState;

	constructor(
		@ICommandService private readonly _commandService: ICommandService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IStorageService storageService: IStorageService,
	) {
		this._hiddenStates = new PersistedMenuHideState(storageService);
	}

	createMenu(id: MenuId, contextKeyService: IContextKeyService, options?: IMenuCreateOptions): IMenu {
		return new MenuImpl(id, this._hiddenStates, { emitEventsForSubmenuChanges: false, eventDebounceDelay: 50, ...options }, this._commandService, this._keybindingService, contextKeyService);
	}

	getMenuActions(id: MenuId, contextKeyService: IContextKeyService, options?: IMenuActionOptions): [string, Array<MenuItemAction | SubmenuItemAction>][] {
		const menu = new MenuImpl(id, this._hiddenStates, { emitEventsForSubmenuChanges: false, eventDebounceDelay: 50, ...options }, this._commandService, this._keybindingService, contextKeyService);
		const actions = menu.getActions(options);
		menu.dispose();
		return actions;
	}

	getMenuContexts(id: MenuId): ReadonlySet<string> {
		const menuInfo = new MenuInfoSnapshot(id, false);
		return new Set<string>([...menuInfo.structureContextKeys, ...menuInfo.preconditionContextKeys, ...menuInfo.toggledContextKeys]);
	}

	resetHiddenStates(ids?: MenuId[]): void {
		this._hiddenStates.reset(ids);
	}
}

class PersistedMenuHideState {

	private static readonly _key = 'menu.hiddenCommands';

	private readonly _disposables = new DisposableStore();
	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _ignoreChangeEvent: boolean = false;
	private _data: Record<string, string[] | undefined>;

	private _hiddenByDefaultCache = new Map<string, boolean>();

	constructor(@IStorageService private readonly _storageService: IStorageService) {
		try {
			const raw = _storageService.get(PersistedMenuHideState._key, StorageScope.PROFILE, '{}');
			this._data = JSON.parse(raw);
		} catch (err) {
			this._data = Object.create(null);
		}

		this._disposables.add(_storageService.onDidChangeValue(StorageScope.PROFILE, PersistedMenuHideState._key, this._disposables)(() => {
			if (!this._ignoreChangeEvent) {
				try {
					const raw = _storageService.get(PersistedMenuHideState._key, StorageScope.PROFILE, '{}');
					this._data = JSON.parse(raw);
				} catch (err) {
					console.log('FAILED to read storage after UPDATE', err);
				}
			}
			this._onDidChange.fire();
		}));
	}

	dispose() {
		this._onDidChange.dispose();
		this._disposables.dispose();
	}

	private _isHiddenByDefault(menu: MenuId, commandId: string) {
		return this._hiddenByDefaultCache.get(`${menu.id}/${commandId}`) ?? false;
	}

	setDefaultState(menu: MenuId, commandId: string, hidden: boolean): void {
		this._hiddenByDefaultCache.set(`${menu.id}/${commandId}`, hidden);
	}

	isHidden(menu: MenuId, commandId: string): boolean {
		const hiddenByDefault = this._isHiddenByDefault(menu, commandId);
		const state = this._data[menu.id]?.includes(commandId) ?? false;
		return hiddenByDefault ? !state : state;
	}

	updateHidden(menu: MenuId, commandId: string, hidden: boolean): void {
		const hiddenByDefault = this._isHiddenByDefault(menu, commandId);
		if (hiddenByDefault) {
			hidden = !hidden;
		}
		const entries = this._data[menu.id];
		if (!hidden) {
			// remove and cleanup
			if (entries) {
				const idx = entries.indexOf(commandId);
				if (idx >= 0) {
					removeFastWithoutKeepingOrder(entries, idx);
				}
				if (entries.length === 0) {
					delete this._data[menu.id];
				}
			}
		} else {
			// add unless already added
			if (!entries) {
				this._data[menu.id] = [commandId];
			} else {
				const idx = entries.indexOf(commandId);
				if (idx < 0) {
					entries.push(commandId);
				}
			}
		}
		this._persist();
	}

	reset(menus?: MenuId[]): void {
		if (menus === undefined) {
			// reset all
			this._data = Object.create(null);
			this._persist();
		} else {
			// reset only for a specific menu
			for (const { id } of menus) {
				if (this._data[id]) {
					delete this._data[id];
				}
			}
			this._persist();
		}
	}

	private _persist(): void {
		try {
			this._ignoreChangeEvent = true;
			const raw = JSON.stringify(this._data);
			this._storageService.store(PersistedMenuHideState._key, raw, StorageScope.PROFILE, StorageTarget.USER);
		} finally {
			this._ignoreChangeEvent = false;
		}
	}
}

type MenuItemGroup = [string, Array<IMenuItem | ISubmenuItem>];

class MenuInfoSnapshot {
	protected _menuGroups: MenuItemGroup[] = [];
	private _allMenuIds: Set<MenuId> = new Set();
	private _structureContextKeys: Set<string> = new Set();
	private _preconditionContextKeys: Set<string> = new Set();
	private _toggledContextKeys: Set<string> = new Set();

	constructor(
		protected readonly _id: MenuId,
		protected readonly _collectContextKeysForSubmenus: boolean,
	) {
		this.refresh();
	}

	get allMenuIds(): ReadonlySet<MenuId> {
		return this._allMenuIds;
	}

	get structureContextKeys(): ReadonlySet<string> {
		return this._structureContextKeys;
	}

	get preconditionContextKeys(): ReadonlySet<string> {
		return this._preconditionContextKeys;
	}

	get toggledContextKeys(): ReadonlySet<string> {
		return this._toggledContextKeys;
	}

	refresh(): void {

		// reset
		this._menuGroups.length = 0;
		this._allMenuIds.clear();
		this._structureContextKeys.clear();
		this._preconditionContextKeys.clear();
		this._toggledContextKeys.clear();

		const menuItems = this._sort(MenuRegistry.getMenuItems(this._id));
		let group: MenuItemGroup | undefined;

		for (const item of menuItems) {
			// group by groupId
			const groupName = item.group || '';
			if (!group || group[0] !== groupName) {
				group = [groupName, []];
				this._menuGroups.push(group);
			}
			group[1].push(item);

			// keep keys and submenu ids for eventing
			this._collectContextKeysAndSubmenuIds(item);
		}
		this._allMenuIds.add(this._id);
	}

	protected _sort(menuItems: (IMenuItem | ISubmenuItem)[]) {
		// no sorting needed in snapshot
		return menuItems;
	}

	private _collectContextKeysAndSubmenuIds(item: IMenuItem | ISubmenuItem): void {

		MenuInfoSnapshot._fillInKbExprKeys(item.when, this._structureContextKeys);

		if (isIMenuItem(item)) {
			// keep precondition keys for event if applicable
			if (item.command.precondition) {
				MenuInfoSnapshot._fillInKbExprKeys(item.command.precondition, this._preconditionContextKeys);
			}
			// keep toggled keys for event if applicable
			if (item.command.toggled) {
				const toggledExpression: ContextKeyExpression = (item.command.toggled as { condition: ContextKeyExpression }).condition || item.command.toggled;
				MenuInfoSnapshot._fillInKbExprKeys(toggledExpression, this._toggledContextKeys);
			}

		} else if (this._collectContextKeysForSubmenus) {
			// recursively collect context keys from submenus so that this
			// menu fires events when context key changes affect submenus
			MenuRegistry.getMenuItems(item.submenu).forEach(this._collectContextKeysAndSubmenuIds, this);

			this._allMenuIds.add(item.submenu);
		}
	}

	private static _fillInKbExprKeys(exp: ContextKeyExpression | undefined, set: Set<string>): void {
		if (exp) {
			for (const key of exp.keys()) {
				set.add(key);
			}
		}
	}

}

class MenuInfo extends MenuInfoSnapshot {

	constructor(
		_id: MenuId,
		private readonly _hiddenStates: PersistedMenuHideState,
		_collectContextKeysForSubmenus: boolean,
		@ICommandService private readonly _commandService: ICommandService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super(_id, _collectContextKeysForSubmenus);
		this.refresh();
	}

	createActionGroups(options: IMenuActionOptions | undefined): [string, Array<MenuItemAction | SubmenuItemAction>][] {
		const result: [string, Array<MenuItemAction | SubmenuItemAction>][] = [];

		for (const group of this._menuGroups) {
			const [id, items] = group;

			let activeActions: Array<MenuItemAction | SubmenuItemAction> | undefined;
			for (const item of items) {
				if (this._contextKeyService.contextMatchesRules(item.when)) {
					const isMenuItem = isIMenuItem(item);
					if (isMenuItem) {
						this._hiddenStates.setDefaultState(this._id, item.command.id, !!item.isHiddenByDefault);
					}

					const menuHide = createMenuHide(this._id, isMenuItem ? item.command : item, this._hiddenStates);
					if (isMenuItem) {
						// MenuItemAction
						const menuKeybinding = createConfigureKeybindingAction(this._commandService, this._keybindingService, item.command.id, item.when);
						(activeActions ??= []).push(new MenuItemAction(item.command, item.alt, options, menuHide, menuKeybinding, this._contextKeyService, this._commandService));
					} else {
						// SubmenuItemAction
						const groups = new MenuInfo(item.submenu, this._hiddenStates, this._collectContextKeysForSubmenus, this._commandService, this._keybindingService, this._contextKeyService).createActionGroups(options);
						const submenuActions = Separator.join(...groups.map(g => g[1]));
						if (submenuActions.length > 0) {
							(activeActions ??= []).push(new SubmenuItemAction(item, menuHide, submenuActions));
						}
					}
				}
			}
			if (activeActions && activeActions.length > 0) {
				result.push([id, activeActions]);
			}
		}
		return result;
	}

	protected override _sort(menuItems: (IMenuItem | ISubmenuItem)[]): (IMenuItem | ISubmenuItem)[] {
		return menuItems.sort(MenuInfo._compareMenuItems);
	}

	private static _compareMenuItems(a: IMenuItem | ISubmenuItem, b: IMenuItem | ISubmenuItem): number {

		const aGroup = a.group;
		const bGroup = b.group;

		if (aGroup !== bGroup) {

			// Falsy groups come last
			if (!aGroup) {
				return 1;
			} else if (!bGroup) {
				return -1;
			}

			// 'navigation' group comes first
			if (aGroup === 'navigation') {
				return -1;
			} else if (bGroup === 'navigation') {
				return 1;
			}

			// lexical sort for groups
			const value = aGroup.localeCompare(bGroup);
			if (value !== 0) {
				return value;
			}
		}

		// sort on priority - default is 0
		const aPrio = a.order || 0;
		const bPrio = b.order || 0;
		if (aPrio < bPrio) {
			return -1;
		} else if (aPrio > bPrio) {
			return 1;
		}

		// sort on titles
		return MenuInfo._compareTitles(
			isIMenuItem(a) ? a.command.title : a.title,
			isIMenuItem(b) ? b.command.title : b.title
		);
	}

	private static _compareTitles(a: string | ILocalizedString, b: string | ILocalizedString) {
		const aStr = typeof a === 'string' ? a : a.original;
		const bStr = typeof b === 'string' ? b : b.original;
		return aStr.localeCompare(bStr);
	}
}

class MenuImpl implements IMenu {

	private readonly _menuInfo: MenuInfo;
	private readonly _disposables = new DisposableStore();

	private readonly _onDidChange: Emitter<IMenuChangeEvent>;
	readonly onDidChange: Event<IMenuChangeEvent>;

	constructor(
		id: MenuId,
		hiddenStates: PersistedMenuHideState,
		options: Required<IMenuCreateOptions>,
		@ICommandService commandService: ICommandService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		this._menuInfo = new MenuInfo(id, hiddenStates, options.emitEventsForSubmenuChanges, commandService, keybindingService, contextKeyService);

		// Rebuild this menu whenever the menu registry reports an event for this MenuId.
		// This usually happen while code and extensions are loaded and affects the over
		// structure of the menu
		const rebuildMenuSoon = new RunOnceScheduler(() => {
			this._menuInfo.refresh();
			this._onDidChange.fire({ menu: this, isStructuralChange: true, isEnablementChange: true, isToggleChange: true });
		}, options.eventDebounceDelay);
		this._disposables.add(rebuildMenuSoon);
		this._disposables.add(MenuRegistry.onDidChangeMenu(e => {
			for (const id of this._menuInfo.allMenuIds) {
				if (e.has(id)) {
					rebuildMenuSoon.schedule();
					break;
				}
			}
		}));

		// When context keys or storage state changes we need to check if the menu also has changed. However,
		// we only do that when someone listens on this menu because (1) these events are
		// firing often and (2) menu are often leaked
		const lazyListener = this._disposables.add(new DisposableStore());

		const merge = (events: IMenuChangeEvent[]): IMenuChangeEvent => {

			let isStructuralChange = false;
			let isEnablementChange = false;
			let isToggleChange = false;

			for (const item of events) {
				isStructuralChange = isStructuralChange || item.isStructuralChange;
				isEnablementChange = isEnablementChange || item.isEnablementChange;
				isToggleChange = isToggleChange || item.isToggleChange;
				if (isStructuralChange && isEnablementChange && isToggleChange) {
					// everything is TRUE, no need to continue iterating
					break;
				}
			}

			return { menu: this, isStructuralChange, isEnablementChange, isToggleChange };
		};

		const startLazyListener = () => {

			lazyListener.add(contextKeyService.onDidChangeContext(e => {
				const isStructuralChange = e.affectsSome(this._menuInfo.structureContextKeys);
				const isEnablementChange = e.affectsSome(this._menuInfo.preconditionContextKeys);
				const isToggleChange = e.affectsSome(this._menuInfo.toggledContextKeys);
				if (isStructuralChange || isEnablementChange || isToggleChange) {
					this._onDidChange.fire({ menu: this, isStructuralChange, isEnablementChange, isToggleChange });
				}
			}));
			lazyListener.add(hiddenStates.onDidChange(e => {
				this._onDidChange.fire({ menu: this, isStructuralChange: true, isEnablementChange: false, isToggleChange: false });
			}));
		};

		this._onDidChange = new DebounceEmitter({
			// start/stop context key listener
			onWillAddFirstListener: startLazyListener,
			onDidRemoveLastListener: lazyListener.clear.bind(lazyListener),
			delay: options.eventDebounceDelay,
			merge
		});
		this.onDidChange = this._onDidChange.event;
	}

	getActions(options?: IMenuActionOptions | undefined): [string, (MenuItemAction | SubmenuItemAction)[]][] {
		return this._menuInfo.createActionGroups(options);
	}

	dispose(): void {
		this._disposables.dispose();
		this._onDidChange.dispose();
	}
}

function createMenuHide(menu: MenuId, command: ICommandAction | ISubmenuItem, states: PersistedMenuHideState): IMenuItemHide {

	const id = isISubmenuItem(command) ? command.submenu.id : command.id;
	const title = typeof command.title === 'string' ? command.title : command.title.value;

	const hide = toAction({
		id: `hide/${menu.id}/${id}`,
		label: localize('hide.label', 'Hide \'{0}\'', title),
		run() { states.updateHidden(menu, id, true); }
	});

	const toggle = toAction({
		id: `toggle/${menu.id}/${id}`,
		label: title,
		get checked() { return !states.isHidden(menu, id); },
		run() { states.updateHidden(menu, id, !!this.checked); }
	});

	return {
		hide,
		toggle,
		get isHidden() { return !toggle.checked; },
	};
}

export function createConfigureKeybindingAction(commandService: ICommandService, keybindingService: IKeybindingService, commandId: string, when: ContextKeyExpression | undefined = undefined, enabled = true): IAction {
	return toAction({
		id: `configureKeybinding/${commandId}`,
		label: localize('configure keybinding', "Configure Keybinding"),
		enabled,
		run() {
			// Only set the when clause when there is no keybinding
			// It is possible that the action and the keybinding have different when clauses
			const hasKeybinding = !!keybindingService.lookupKeybinding(commandId); // This may only be called inside the `run()` method as it can be expensive on startup. #210529
			const whenValue = !hasKeybinding && when ? when.serialize() : undefined;
			commandService.executeCommand('workbench.action.openGlobalKeybindings', `@command:${commandId}` + (whenValue ? ` +when:${whenValue}` : ''));
		}
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actions/test/common/menuService.test.ts]---
Location: vscode-main/src/vs/platform/actions/test/common/menuService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { isIMenuItem, MenuId, MenuRegistry } from '../../common/actions.js';
import { MenuService } from '../../common/menuService.js';
import { NullCommandService } from '../../../commands/test/common/nullCommandService.js';
import { MockContextKeyService, MockKeybindingService } from '../../../keybinding/test/common/mockKeybindingService.js';
import { InMemoryStorageService } from '../../../storage/common/storage.js';

// --- service instances

const contextKeyService = new class extends MockContextKeyService {
	override contextMatchesRules() {
		return true;
	}
};

// --- tests

suite('MenuService', function () {

	let menuService: MenuService;
	const disposables = new DisposableStore();
	let testMenuId: MenuId;

	setup(function () {
		menuService = new MenuService(NullCommandService, new MockKeybindingService(), new InMemoryStorageService());
		testMenuId = new MenuId(`testo/${generateUuid()}`);
		disposables.clear();
	});

	teardown(function () {
		disposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('group sorting', function () {

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'one', title: 'FOO' },
			group: '0_hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'two', title: 'FOO' },
			group: 'hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'three', title: 'FOO' },
			group: 'Hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'four', title: 'FOO' },
			group: ''
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'five', title: 'FOO' },
			group: 'navigation'
		}));

		const groups = disposables.add(menuService.createMenu(testMenuId, contextKeyService)).getActions();

		assert.strictEqual(groups.length, 5);
		const [one, two, three, four, five] = groups;

		assert.strictEqual(one[0], 'navigation');
		assert.strictEqual(two[0], '0_hello');
		assert.strictEqual(three[0], 'hello');
		assert.strictEqual(four[0], 'Hello');
		assert.strictEqual(five[0], '');
	});

	test('in group sorting, by title', function () {

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'a', title: 'aaa' },
			group: 'Hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'b', title: 'fff' },
			group: 'Hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'c', title: 'zzz' },
			group: 'Hello'
		}));

		const groups = disposables.add(menuService.createMenu(testMenuId, contextKeyService)).getActions();

		assert.strictEqual(groups.length, 1);
		const [, actions] = groups[0];

		assert.strictEqual(actions.length, 3);
		const [one, two, three] = actions;
		assert.strictEqual(one.id, 'a');
		assert.strictEqual(two.id, 'b');
		assert.strictEqual(three.id, 'c');
	});

	test('in group sorting, by title and order', function () {

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'a', title: 'aaa' },
			group: 'Hello',
			order: 10
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'b', title: 'fff' },
			group: 'Hello'
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'c', title: 'zzz' },
			group: 'Hello',
			order: -1
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'd', title: 'yyy' },
			group: 'Hello',
			order: -1
		}));

		const groups = disposables.add(menuService.createMenu(testMenuId, contextKeyService)).getActions();

		assert.strictEqual(groups.length, 1);
		const [, actions] = groups[0];

		assert.strictEqual(actions.length, 4);
		const [one, two, three, four] = actions;
		assert.strictEqual(one.id, 'd');
		assert.strictEqual(two.id, 'c');
		assert.strictEqual(three.id, 'b');
		assert.strictEqual(four.id, 'a');
	});


	test('in group sorting, special: navigation', function () {

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'a', title: 'aaa' },
			group: 'navigation',
			order: 1.3
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'b', title: 'fff' },
			group: 'navigation',
			order: 1.2
		}));

		disposables.add(MenuRegistry.appendMenuItem(testMenuId, {
			command: { id: 'c', title: 'zzz' },
			group: 'navigation',
			order: 1.1
		}));

		const groups = disposables.add(menuService.createMenu(testMenuId, contextKeyService)).getActions();

		assert.strictEqual(groups.length, 1);
		const [[, actions]] = groups;

		assert.strictEqual(actions.length, 3);
		const [one, two, three] = actions;
		assert.strictEqual(one.id, 'c');
		assert.strictEqual(two.id, 'b');
		assert.strictEqual(three.id, 'a');
	});

	test('special MenuId palette', function () {

		disposables.add(MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
			command: { id: 'a', title: 'Explicit' }
		}));

		disposables.add(MenuRegistry.addCommand({ id: 'b', title: 'Implicit' }));

		let foundA = false;
		let foundB = false;
		for (const item of MenuRegistry.getMenuItems(MenuId.CommandPalette)) {
			if (isIMenuItem(item)) {
				if (item.command.id === 'a') {
					assert.strictEqual(item.command.title, 'Explicit');
					foundA = true;
				}
				if (item.command.id === 'b') {
					assert.strictEqual(item.command.title, 'Implicit');
					foundB = true;
				}
			}
		}
		assert.strictEqual(foundA, true);
		assert.strictEqual(foundB, true);
	});

	test('Extension contributed submenus missing with errors in output #155030', function () {

		const id = generateUuid();
		const menu = new MenuId(id);

		assert.throws(() => new MenuId(id));
		assert.ok(menu === MenuId.for(id));
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actionWidget/browser/actionList.ts]---
Location: vscode-main/src/vs/platform/actionWidget/browser/actionList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../base/browser/dom.js';
import { KeybindingLabel } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { IListEvent, IListMouseEvent, IListRenderer, IListVirtualDelegate } from '../../../base/browser/ui/list/list.js';
import { IListAccessibilityProvider, List } from '../../../base/browser/ui/list/listWidget.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { OS } from '../../../base/common/platform.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import './actionWidget.css';
import { localize } from '../../../nls.js';
import { IContextViewService } from '../../contextview/browser/contextView.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { defaultListStyles } from '../../theme/browser/defaultStyles.js';
import { asCssVariable } from '../../theme/common/colorRegistry.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';

export const acceptSelectedActionCommand = 'acceptSelectedCodeAction';
export const previewSelectedActionCommand = 'previewSelectedCodeAction';

export interface IActionListDelegate<T> {
	onHide(didCancel?: boolean): void;
	onSelect(action: T, preview?: boolean): void;
	onHover?(action: T, cancellationToken: CancellationToken): Promise<{ canPreview: boolean } | void>;
	onFocus?(action: T | undefined): void;
}

export interface IActionListItem<T> {
	readonly item?: T;
	readonly kind: ActionListItemKind;
	readonly group?: { kind?: unknown; icon?: ThemeIcon; title: string };
	readonly disabled?: boolean;
	readonly label?: string;
	readonly description?: string;
	readonly keybinding?: ResolvedKeybinding;
	canPreview?: boolean | undefined;
	readonly hideIcon?: boolean;
	readonly tooltip?: string;
}

interface IActionMenuTemplateData {
	readonly container: HTMLElement;
	readonly icon: HTMLElement;
	readonly text: HTMLElement;
	readonly description?: HTMLElement;
	readonly keybinding: KeybindingLabel;
}

export const enum ActionListItemKind {
	Action = 'action',
	Header = 'header',
	Separator = 'separator'
}

interface IHeaderTemplateData {
	readonly container: HTMLElement;
	readonly text: HTMLElement;
}

class HeaderRenderer<T> implements IListRenderer<IActionListItem<T>, IHeaderTemplateData> {

	get templateId(): string { return ActionListItemKind.Header; }

	renderTemplate(container: HTMLElement): IHeaderTemplateData {
		container.classList.add('group-header');

		const text = document.createElement('span');
		container.append(text);

		return { container, text };
	}

	renderElement(element: IActionListItem<T>, _index: number, templateData: IHeaderTemplateData): void {
		templateData.text.textContent = element.group?.title ?? element.label ?? '';
	}

	disposeTemplate(_templateData: IHeaderTemplateData): void {
		// noop
	}
}

interface ISeparatorTemplateData {
	readonly container: HTMLElement;
	readonly text: HTMLElement;
}

class SeparatorRenderer<T> implements IListRenderer<IActionListItem<T>, ISeparatorTemplateData> {

	get templateId(): string { return ActionListItemKind.Separator; }

	renderTemplate(container: HTMLElement): ISeparatorTemplateData {
		container.classList.add('separator');

		const text = document.createElement('span');
		container.append(text);

		return { container, text };
	}

	renderElement(element: IActionListItem<T>, _index: number, templateData: ISeparatorTemplateData): void {
		templateData.text.textContent = element.label ?? '';
	}

	disposeTemplate(_templateData: ISeparatorTemplateData): void {
		// noop
	}
}

class ActionItemRenderer<T> implements IListRenderer<IActionListItem<T>, IActionMenuTemplateData> {

	get templateId(): string { return ActionListItemKind.Action; }

	constructor(
		private readonly _supportsPreview: boolean,
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) { }

	renderTemplate(container: HTMLElement): IActionMenuTemplateData {
		container.classList.add(this.templateId);

		const icon = document.createElement('div');
		icon.className = 'icon';
		container.append(icon);

		const text = document.createElement('span');
		text.className = 'title';
		container.append(text);

		const description = document.createElement('span');
		description.className = 'description';
		container.append(description);

		const keybinding = new KeybindingLabel(container, OS);

		return { container, icon, text, description, keybinding };
	}

	renderElement(element: IActionListItem<T>, _index: number, data: IActionMenuTemplateData): void {
		if (element.group?.icon) {
			data.icon.className = ThemeIcon.asClassName(element.group.icon);
			if (element.group.icon.color) {
				data.icon.style.color = asCssVariable(element.group.icon.color.id);
			}
		} else {
			data.icon.className = ThemeIcon.asClassName(Codicon.lightBulb);
			data.icon.style.color = 'var(--vscode-editorLightBulb-foreground)';
		}

		if (!element.item || !element.label) {
			return;
		}

		dom.setVisibility(!element.hideIcon, data.icon);

		data.text.textContent = stripNewlines(element.label);

		// if there is a keybinding, prioritize over description for now
		if (element.keybinding) {
			data.description!.textContent = element.keybinding.getLabel();
			data.description!.style.display = 'inline';
			data.description!.style.letterSpacing = '0.5px';
		} else if (element.description) {
			data.description!.textContent = stripNewlines(element.description);
			data.description!.style.display = 'inline';
		} else {
			data.description!.textContent = '';
			data.description!.style.display = 'none';
		}

		const actionTitle = this._keybindingService.lookupKeybinding(acceptSelectedActionCommand)?.getLabel();
		const previewTitle = this._keybindingService.lookupKeybinding(previewSelectedActionCommand)?.getLabel();
		data.container.classList.toggle('option-disabled', element.disabled);
		if (element.tooltip) {
			data.container.title = element.tooltip;
		} else if (element.disabled) {
			data.container.title = element.label;
		} else if (actionTitle && previewTitle) {
			if (this._supportsPreview && element.canPreview) {
				data.container.title = localize({ key: 'label-preview', comment: ['placeholders are keybindings, e.g "F2 to Apply, Shift+F2 to Preview"'] }, "{0} to Apply, {1} to Preview", actionTitle, previewTitle);
			} else {
				data.container.title = localize({ key: 'label', comment: ['placeholder is a keybinding, e.g "F2 to Apply"'] }, "{0} to Apply", actionTitle);
			}
		} else {
			data.container.title = '';
		}
	}

	disposeTemplate(templateData: IActionMenuTemplateData): void {
		templateData.keybinding.dispose();
	}
}

class AcceptSelectedEvent extends UIEvent {
	constructor() { super('acceptSelectedAction'); }
}

class PreviewSelectedEvent extends UIEvent {
	constructor() { super('previewSelectedAction'); }
}

function getKeyboardNavigationLabel<T>(item: IActionListItem<T>): string | undefined {
	// Filter out header vs. action vs. separator
	if (item.kind === 'action') {
		return item.label;
	}
	return undefined;
}

export class ActionList<T> extends Disposable {

	public readonly domNode: HTMLElement;

	private readonly _list: List<IActionListItem<T>>;

	private readonly _actionLineHeight = 28;
	private readonly _headerLineHeight = 28;
	private readonly _separatorLineHeight = 8;

	private readonly _allMenuItems: readonly IActionListItem<T>[];

	private readonly cts = this._register(new CancellationTokenSource());

	constructor(
		user: string,
		preview: boolean,
		items: readonly IActionListItem<T>[],
		private readonly _delegate: IActionListDelegate<T>,
		accessibilityProvider: Partial<IListAccessibilityProvider<IActionListItem<T>>> | undefined,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IKeybindingService private readonly _keybindingService: IKeybindingService,
		@ILayoutService private readonly _layoutService: ILayoutService,
	) {
		super();
		this.domNode = document.createElement('div');
		this.domNode.classList.add('actionList');
		const virtualDelegate: IListVirtualDelegate<IActionListItem<T>> = {
			getHeight: element => {
				switch (element.kind) {
					case ActionListItemKind.Header:
						return this._headerLineHeight;
					case ActionListItemKind.Separator:
						return this._separatorLineHeight;
					default:
						return this._actionLineHeight;
				}
			},
			getTemplateId: element => element.kind
		};


		this._list = this._register(new List(user, this.domNode, virtualDelegate, [
			new ActionItemRenderer<IActionListItem<T>>(preview, this._keybindingService),
			new HeaderRenderer(),
			new SeparatorRenderer(),
		], {
			keyboardSupport: false,
			typeNavigationEnabled: true,
			keyboardNavigationLabelProvider: { getKeyboardNavigationLabel },
			accessibilityProvider: {
				getAriaLabel: element => {
					if (element.kind === ActionListItemKind.Action) {
						let label = element.label ? stripNewlines(element?.label) : '';
						if (element.description) {
							label = label + ', ' + stripNewlines(element.description);
						}
						if (element.disabled) {
							label = localize({ key: 'customQuickFixWidget.labels', comment: [`Action widget labels for accessibility.`] }, "{0}, Disabled Reason: {1}", label, element.disabled);
						}
						return label;
					}
					return null;
				},
				getWidgetAriaLabel: () => localize({ key: 'customQuickFixWidget', comment: [`An action widget option`] }, "Action Widget"),
				getRole: (e) => {
					switch (e.kind) {
						case ActionListItemKind.Action:
							return 'option';
						case ActionListItemKind.Separator:
							return 'separator';
						default:
							return 'separator';
					}
				},
				getWidgetRole: () => 'listbox',
				...accessibilityProvider
			},
		}));

		this._list.style(defaultListStyles);

		this._register(this._list.onMouseClick(e => this.onListClick(e)));
		this._register(this._list.onMouseOver(e => this.onListHover(e)));
		this._register(this._list.onDidChangeFocus(() => this.onFocus()));
		this._register(this._list.onDidChangeSelection(e => this.onListSelection(e)));

		this._allMenuItems = items;
		this._list.splice(0, this._list.length, this._allMenuItems);

		if (this._list.length) {
			this.focusNext();
		}
	}

	private focusCondition(element: IActionListItem<unknown>): boolean {
		return !element.disabled && element.kind === ActionListItemKind.Action;
	}

	hide(didCancel?: boolean): void {
		this._delegate.onHide(didCancel);
		this.cts.cancel();
		this._contextViewService.hideContextView();
	}

	layout(minWidth: number): number {
		// Updating list height, depending on how many separators and headers there are.
		const numHeaders = this._allMenuItems.filter(item => item.kind === 'header').length;
		const numSeparators = this._allMenuItems.filter(item => item.kind === 'separator').length;
		const itemsHeight = this._allMenuItems.length * this._actionLineHeight;
		const heightWithHeaders = itemsHeight + numHeaders * this._headerLineHeight - numHeaders * this._actionLineHeight;
		const heightWithSeparators = heightWithHeaders + numSeparators * this._separatorLineHeight - numSeparators * this._actionLineHeight;
		this._list.layout(heightWithSeparators);
		let maxWidth = minWidth;

		if (this._allMenuItems.length >= 50) {
			maxWidth = 380;
		} else {
			// For finding width dynamically (not using resize observer)
			const itemWidths: number[] = this._allMenuItems.map((_, index): number => {
				// eslint-disable-next-line no-restricted-syntax
				const element = this.domNode.ownerDocument.getElementById(this._list.getElementID(index));
				if (element) {
					element.style.width = 'auto';
					const width = element.getBoundingClientRect().width;
					element.style.width = '';
					return width;
				}
				return 0;
			});

			// resize observer - can be used in the future since list widget supports dynamic height but not width
			maxWidth = Math.max(...itemWidths, minWidth);
		}

		const maxVhPrecentage = 0.7;
		const height = Math.min(heightWithSeparators, this._layoutService.getContainer(dom.getWindow(this.domNode)).clientHeight * maxVhPrecentage);
		this._list.layout(height, maxWidth);

		this.domNode.style.height = `${height}px`;

		this._list.domFocus();
		return maxWidth;
	}

	focusPrevious() {
		this._list.focusPrevious(1, true, undefined, this.focusCondition);
	}

	focusNext() {
		this._list.focusNext(1, true, undefined, this.focusCondition);
	}

	acceptSelected(preview?: boolean) {
		const focused = this._list.getFocus();
		if (focused.length === 0) {
			return;
		}

		const focusIndex = focused[0];
		const element = this._list.element(focusIndex);
		if (!this.focusCondition(element)) {
			return;
		}

		const event = preview ? new PreviewSelectedEvent() : new AcceptSelectedEvent();
		this._list.setSelection([focusIndex], event);
	}

	private onListSelection(e: IListEvent<IActionListItem<T>>): void {
		if (!e.elements.length) {
			return;
		}

		const element = e.elements[0];
		if (element.item && this.focusCondition(element)) {
			this._delegate.onSelect(element.item, e.browserEvent instanceof PreviewSelectedEvent);
		} else {
			this._list.setSelection([]);
		}
	}

	private onFocus() {
		const focused = this._list.getFocus();
		if (focused.length === 0) {
			return;
		}
		const focusIndex = focused[0];
		const element = this._list.element(focusIndex);
		this._delegate.onFocus?.(element.item);
	}

	private async onListHover(e: IListMouseEvent<IActionListItem<T>>) {
		const element = e.element;
		if (element && element.item && this.focusCondition(element)) {
			if (this._delegate.onHover && !element.disabled && element.kind === ActionListItemKind.Action) {
				const result = await this._delegate.onHover(element.item, this.cts.token);
				element.canPreview = result ? result.canPreview : undefined;
			}
			if (e.index) {
				this._list.splice(e.index, 1, [element]);
			}
		}

		this._list.setFocus(typeof e.index === 'number' ? [e.index] : []);
	}

	private onListClick(e: IListMouseEvent<IActionListItem<T>>): void {
		if (e.element && this.focusCondition(e.element)) {
			this._list.setFocus([]);
		}
	}
}

function stripNewlines(str: string): string {
	return str.replace(/\r\n|\r|\n/g, ' ');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actionWidget/browser/actionWidget.css]---
Location: vscode-main/src/vs/platform/actionWidget/browser/actionWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.action-widget {
	font-size: 13px;
	border-radius: 0;
	min-width: 100px;
	max-width: 80vw;
	z-index: 40;
	display: block;
	width: 100%;
	border: 1px solid var(--vscode-editorHoverWidget-border) !important;
	border-radius: 5px;
	background-color: var(--vscode-menu-background);
	color: var(--vscode-menu-foreground);
	padding: 4px 0;
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
}

.context-view-block {
	position: fixed;
	cursor: initial;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
}

.context-view-pointerBlock {
	position: fixed;
	cursor: initial;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
}

.action-widget .monaco-list {
	user-select: none;
	-webkit-user-select: none;
	border: none !important;
	border-width: 0 !important;
}

.action-widget .monaco-list:focus:before {
	outline: 0 !important;
}

.action-widget .monaco-list .monaco-scrollable-element {
	overflow: visible;
}

/** Styles for each row in the list element **/
.action-widget .monaco-list .monaco-list-row {
	padding: 0 4px 0 4px;
	margin: 0 4px 0 4px;
	white-space: nowrap;
	cursor: pointer;
	touch-action: none;
	width: calc(100% - 8px);
	border-radius: 3px;
}

.action-widget .monaco-list .monaco-list-row.action.focused:not(.option-disabled) {
	background-color: var(--vscode-list-activeSelectionBackground) !important;
	color: var(--vscode-list-activeSelectionForeground);
	outline: 1px solid var(--vscode-menu-selectionBorder, transparent);
	outline-offset: -1px;
}

.action-widget .monaco-list-row.group-header {
	color: var(--vscode-descriptionForeground) !important;
	font-weight: 600;
	font-size: 13px;
}

.action-widget .monaco-list-row.group-header:not(:first-of-type) {
	margin-top: 2px;
}

.action-widget .monaco-scrollable-element .monaco-list-rows .monaco-list-row.separator {
	border-top: 1px solid var(--vscode-editorHoverWidget-border);
	color: var(--vscode-descriptionForeground);
	font-size: 12px;
	margin: 4px 0px;
	width: 100%;
	cursor: default;
	-webkit-user-select: none;
	user-select: none;
	border-radius: 0;
}

.action-widget .monaco-scrollable-element .monaco-list-rows .monaco-list-row.separator.focused {
	outline: 0 solid;
	background-color: transparent;
	border-radius: 0;
}

.action-widget .monaco-list-row.separator:first-of-type {
	border-top: none;
	margin-top: 0;
}

.action-widget .monaco-list .group-header,
.action-widget .monaco-list .option-disabled,
.action-widget .monaco-list .option-disabled:before,
.action-widget .monaco-list .option-disabled .focused,
.action-widget .monaco-list .option-disabled .focused:before {
	cursor: default !important;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	user-select: none;
	background-color: transparent !important;
	outline: 0 solid !important;
}

.action-widget .monaco-list-row.action {
	display: flex;
	gap: 4px;
	align-items: center;
}

.action-widget .monaco-list-row.action.option-disabled,
.action-widget .monaco-list:focus .monaco-list-row.focused.action.option-disabled,
.action-widget .monaco-list-row.action.option-disabled .codicon,
.action-widget .monaco-list:not(.drop-target):not(.dragging) .monaco-list-row:hover:not(.selected):not(.focused).option-disabled {
	color: var(--vscode-disabledForeground);
}


.action-widget .monaco-list-row.action:not(.option-disabled) .codicon {
	color: inherit;
}

.action-widget .monaco-list-row.action .title {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.action-widget .monaco-list-row.action .monaco-keybinding > .monaco-keybinding-key {
		background-color: var(--vscode-keybindingLabel-background);
		color: var(--vscode-keybindingLabel-foreground);
		border-style: solid;
		border-width: 1px;
		border-radius: 3px;
		border-color: var(--vscode-keybindingLabel-border);
		border-bottom-color: var(--vscode-keybindingLabel-bottomBorder);
		box-shadow: inset 0 -1px 0 var(--vscode-widget-shadow);
}

/* Action bar */

.action-widget .action-widget-action-bar {
	background-color: var(--vscode-menu-background);
	border-top: 1px solid var(--vscode-editorHoverWidget-border);
	margin-top: 4px;
}

.action-widget .action-widget-action-bar::before {
	display: block;
	content: "";
	width: 100%;
}

.action-widget .action-widget-action-bar .actions-container {
	padding: 4px 8px 2px 28px;
	width: auto;
}

.action-widget-action-bar .action-label {
	color: var(--vscode-textLink-activeForeground);
	font-size: 13px;
	line-height: 22px;
	padding: 0;
	pointer-events: all;
}

.action-widget-action-bar .action-item {
	margin-right: 16px;
	pointer-events: none;
}

.action-widget-action-bar .action-label:hover {
	background-color: transparent !important;
}

.monaco-action-bar .actions-container.highlight-toggled .action-label.checked {
	/* The important gives this rule precedence over the hover rule. */
	background: var(--vscode-actionBar-toggledBackground) !important;
}

.action-widget .monaco-list .monaco-list-row .description {
	opacity: 0.7;
	margin-left: 0.5em;
}

.action-widget-delegate-label {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actionWidget/browser/actionWidget.ts]---
Location: vscode-main/src/vs/platform/actionWidget/browser/actionWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as dom from '../../../base/browser/dom.js';
import { ActionBar } from '../../../base/browser/ui/actionbar/actionbar.js';
import { IAnchor } from '../../../base/browser/ui/contextview/contextview.js';
import { IAction } from '../../../base/common/actions.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../base/common/lifecycle.js';
import './actionWidget.css';
import { localize, localize2 } from '../../../nls.js';
import { acceptSelectedActionCommand, ActionList, IActionListDelegate, IActionListItem, previewSelectedActionCommand } from './actionList.js';
import { Action2, registerAction2 } from '../../actions/common/actions.js';
import { IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';
import { IContextViewService } from '../../contextview/browser/contextView.js';
import { InstantiationType, registerSingleton } from '../../instantiation/common/extensions.js';
import { createDecorator, IInstantiationService, ServicesAccessor } from '../../instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../keybinding/common/keybindingsRegistry.js';
import { inputActiveOptionBackground, registerColor } from '../../theme/common/colorRegistry.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { IListAccessibilityProvider } from '../../../base/browser/ui/list/listWidget.js';

registerColor(
	'actionBar.toggledBackground',
	inputActiveOptionBackground,
	localize('actionBar.toggledBackground', 'Background color for toggled action items in action bar.')
);

const ActionWidgetContextKeys = {
	Visible: new RawContextKey<boolean>('codeActionMenuVisible', false, localize('codeActionMenuVisible', "Whether the action widget list is visible"))
};

export const IActionWidgetService = createDecorator<IActionWidgetService>('actionWidgetService');

export interface IActionWidgetService {
	readonly _serviceBrand: undefined;

	show<T>(user: string, supportsPreview: boolean, items: readonly IActionListItem<T>[], delegate: IActionListDelegate<T>, anchor: HTMLElement | StandardMouseEvent | IAnchor, container: HTMLElement | undefined, actionBarActions?: readonly IAction[], accessibilityProvider?: Partial<IListAccessibilityProvider<IActionListItem<T>>>): void;

	hide(didCancel?: boolean): void;

	readonly isVisible: boolean;
}

class ActionWidgetService extends Disposable implements IActionWidgetService {
	declare readonly _serviceBrand: undefined;

	get isVisible() {
		return ActionWidgetContextKeys.Visible.getValue(this._contextKeyService) || false;
	}

	private readonly _list = this._register(new MutableDisposable<ActionList<unknown>>());

	constructor(
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();
	}

	show<T>(user: string, supportsPreview: boolean, items: readonly IActionListItem<T>[], delegate: IActionListDelegate<T>, anchor: HTMLElement | StandardMouseEvent | IAnchor, container: HTMLElement | undefined, actionBarActions?: readonly IAction[], accessibilityProvider?: Partial<IListAccessibilityProvider<IActionListItem<T>>>): void {
		const visibleContext = ActionWidgetContextKeys.Visible.bindTo(this._contextKeyService);

		const list = this._instantiationService.createInstance(ActionList, user, supportsPreview, items, delegate, accessibilityProvider);
		this._contextViewService.showContextView({
			getAnchor: () => anchor,
			render: (container: HTMLElement) => {
				visibleContext.set(true);
				return this._renderWidget(container, list, actionBarActions ?? []);
			},
			onHide: (didCancel) => {
				visibleContext.reset();
				this._onWidgetClosed(didCancel);
			},
		}, container, false);
	}

	acceptSelected(preview?: boolean) {
		this._list.value?.acceptSelected(preview);
	}

	focusPrevious() {
		this._list?.value?.focusPrevious();
	}

	focusNext() {
		this._list?.value?.focusNext();
	}

	hide(didCancel?: boolean) {
		this._list.value?.hide(didCancel);
		this._list.clear();
	}

	clear() {
		this._list.clear();
	}

	private _renderWidget(element: HTMLElement, list: ActionList<unknown>, actionBarActions: readonly IAction[]): IDisposable {
		const widget = document.createElement('div');
		widget.classList.add('action-widget');
		element.appendChild(widget);

		this._list.value = list;
		if (this._list.value) {
			widget.appendChild(this._list.value.domNode);
		} else {
			throw new Error('List has no value');
		}
		const renderDisposables = new DisposableStore();

		// Invisible div to block mouse interaction in the rest of the UI
		const menuBlock = document.createElement('div');
		const block = element.appendChild(menuBlock);
		block.classList.add('context-view-block');
		renderDisposables.add(dom.addDisposableListener(block, dom.EventType.MOUSE_DOWN, e => e.stopPropagation()));

		// Invisible div to block mouse interaction with the menu
		const pointerBlockDiv = document.createElement('div');
		const pointerBlock = element.appendChild(pointerBlockDiv);
		pointerBlock.classList.add('context-view-pointerBlock');

		// Removes block on click INSIDE widget or ANY mouse movement
		renderDisposables.add(dom.addDisposableListener(pointerBlock, dom.EventType.POINTER_MOVE, () => pointerBlock.remove()));
		renderDisposables.add(dom.addDisposableListener(pointerBlock, dom.EventType.MOUSE_DOWN, () => pointerBlock.remove()));

		// Action bar
		let actionBarWidth = 0;
		if (actionBarActions.length) {
			const actionBar = this._createActionBar('.action-widget-action-bar', actionBarActions);
			if (actionBar) {
				widget.appendChild(actionBar.getContainer().parentElement!);
				renderDisposables.add(actionBar);
				actionBarWidth = actionBar.getContainer().offsetWidth;
			}
		}

		const width = this._list.value?.layout(actionBarWidth);
		widget.style.width = `${width}px`;

		const focusTracker = renderDisposables.add(dom.trackFocus(element));
		renderDisposables.add(focusTracker.onDidBlur(() => this.hide(true)));

		return renderDisposables;
	}

	private _createActionBar(className: string, actions: readonly IAction[]): ActionBar | undefined {
		if (!actions.length) {
			return undefined;
		}

		const container = dom.$(className);
		const actionBar = new ActionBar(container);
		actionBar.push(actions, { icon: false, label: true });
		return actionBar;
	}

	private _onWidgetClosed(didCancel?: boolean): void {
		this._list.value?.hide(didCancel);
	}
}

registerSingleton(IActionWidgetService, ActionWidgetService, InstantiationType.Delayed);

const weight = KeybindingWeight.EditorContrib + 1000;

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'hideCodeActionWidget',
			title: localize2('hideCodeActionWidget.title', "Hide action widget"),
			precondition: ActionWidgetContextKeys.Visible,
			keybinding: {
				weight,
				primary: KeyCode.Escape,
				secondary: [KeyMod.Shift | KeyCode.Escape]
			},
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IActionWidgetService).hide(true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'selectPrevCodeAction',
			title: localize2('selectPrevCodeAction.title', "Select previous action"),
			precondition: ActionWidgetContextKeys.Visible,
			keybinding: {
				weight,
				primary: KeyCode.UpArrow,
				secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow],
				mac: { primary: KeyCode.UpArrow, secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow, KeyMod.WinCtrl | KeyCode.KeyP] },
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const widgetService = accessor.get(IActionWidgetService);
		if (widgetService instanceof ActionWidgetService) {
			widgetService.focusPrevious();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'selectNextCodeAction',
			title: localize2('selectNextCodeAction.title', "Select next action"),
			precondition: ActionWidgetContextKeys.Visible,
			keybinding: {
				weight,
				primary: KeyCode.DownArrow,
				secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow],
				mac: { primary: KeyCode.DownArrow, secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow, KeyMod.WinCtrl | KeyCode.KeyN] }
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const widgetService = accessor.get(IActionWidgetService);
		if (widgetService instanceof ActionWidgetService) {
			widgetService.focusNext();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: acceptSelectedActionCommand,
			title: localize2('acceptSelected.title', "Accept selected action"),
			precondition: ActionWidgetContextKeys.Visible,
			keybinding: {
				weight,
				primary: KeyCode.Enter,
				secondary: [KeyMod.CtrlCmd | KeyCode.Period],
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const widgetService = accessor.get(IActionWidgetService);
		if (widgetService instanceof ActionWidgetService) {
			widgetService.acceptSelected();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: previewSelectedActionCommand,
			title: localize2('previewSelected.title', "Preview selected action"),
			precondition: ActionWidgetContextKeys.Visible,
			keybinding: {
				weight,
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const widgetService = accessor.get(IActionWidgetService);
		if (widgetService instanceof ActionWidgetService) {
			widgetService.acceptSelected(true);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actionWidget/browser/actionWidgetDropdown.ts]---
Location: vscode-main/src/vs/platform/actionWidget/browser/actionWidgetDropdown.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionWidgetService } from './actionWidget.js';
import { IAction } from '../../../base/common/actions.js';
import { BaseDropdown, IActionProvider, IBaseDropdownOptions } from '../../../base/browser/ui/dropdown/dropdown.js';
import { ActionListItemKind, IActionListDelegate, IActionListItem } from './actionList.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { Codicon } from '../../../base/common/codicons.js';
import { getActiveElement, isHTMLElement } from '../../../base/browser/dom.js';
import { IKeybindingService } from '../../keybinding/common/keybinding.js';
import { IListAccessibilityProvider } from '../../../base/browser/ui/list/listWidget.js';

export interface IActionWidgetDropdownAction extends IAction {
	category?: { label: string; order: number; showHeader?: boolean };
	icon?: ThemeIcon;
	description?: string;
}

// TODO @lramos15 - Should we just make IActionProvider templated?
export interface IActionWidgetDropdownActionProvider {
	getActions(): IActionWidgetDropdownAction[];
}

export interface IActionWidgetDropdownOptions extends IBaseDropdownOptions {
	// These are the actions that are shown in the action widget split up by category
	readonly actions?: IActionWidgetDropdownAction[];
	readonly actionProvider?: IActionWidgetDropdownActionProvider;

	// These actions are those shown at the bottom of the action widget
	readonly actionBarActions?: IAction[];
	readonly actionBarActionProvider?: IActionProvider;
	readonly showItemKeybindings?: boolean;
}

/**
 * Action widget dropdown is a dropdown that uses the action widget under the hood to simulate a native dropdown menu
 * The benefits of this include non native features such as headers, descriptions, icons, and button bar
 */
export class ActionWidgetDropdown extends BaseDropdown {

	private enabled: boolean = true;

	constructor(
		container: HTMLElement,
		private readonly _options: IActionWidgetDropdownOptions,
		@IActionWidgetService private readonly actionWidgetService: IActionWidgetService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
	) {
		super(container, _options);
	}

	override show(): void {
		if (!this.enabled) {
			return;
		}

		let actionBarActions = this._options.actionBarActions ?? this._options.actionBarActionProvider?.getActions() ?? [];
		const actions = this._options.actions ?? this._options.actionProvider?.getActions() ?? [];
		const actionWidgetItems: IActionListItem<IActionWidgetDropdownAction>[] = [];

		const actionsByCategory = new Map<string, IActionWidgetDropdownAction[]>();
		for (const action of actions) {
			let category = action.category;
			if (!category) {
				category = { label: '', order: Number.MIN_SAFE_INTEGER };
			}
			if (!actionsByCategory.has(category.label)) {
				actionsByCategory.set(category.label, []);
			}
			actionsByCategory.get(category.label)!.push(action);
		}

		// Sort categories by order
		const sortedCategories = Array.from(actionsByCategory.entries())
			.sort((a, b) => {
				const aOrder = a[1][0]?.category?.order ?? Number.MAX_SAFE_INTEGER;
				const bOrder = b[1][0]?.category?.order ?? Number.MAX_SAFE_INTEGER;
				return aOrder - bOrder;
			});

		for (let i = 0; i < sortedCategories.length; i++) {
			const [categoryLabel, categoryActions] = sortedCategories[i];
			const showHeader = categoryActions[0]?.category?.showHeader ?? false;
			if (showHeader && categoryLabel) {
				actionWidgetItems.push({
					kind: ActionListItemKind.Header,
					label: categoryLabel,
					canPreview: false,
					disabled: false,
					hideIcon: false,
				});
			}

			// Push actions for each category
			for (const action of categoryActions) {
				actionWidgetItems.push({
					item: action,
					tooltip: action.tooltip,
					description: action.description,
					kind: ActionListItemKind.Action,
					canPreview: false,
					group: { title: '', icon: action.icon ?? ThemeIcon.fromId(action.checked ? Codicon.check.id : Codicon.blank.id) },
					disabled: !action.enabled,
					hideIcon: false,
					label: action.label,
					keybinding: this._options.showItemKeybindings ?
						this.keybindingService.lookupKeybinding(action.id) :
						undefined,
				});
			}

			// Add separator after each category except the last one
			if (i < sortedCategories.length - 1) {
				actionWidgetItems.push({
					label: '',
					kind: ActionListItemKind.Separator,
					canPreview: false,
					disabled: false,
					hideIcon: false,
				});
			}
		}

		const previouslyFocusedElement = getActiveElement();


		const actionWidgetDelegate: IActionListDelegate<IActionWidgetDropdownAction> = {
			onSelect: (action, preview) => {
				this.actionWidgetService.hide();
				action.run();
			},
			onHide: () => {
				if (isHTMLElement(previouslyFocusedElement)) {
					previouslyFocusedElement.focus();
				}
			}
		};

		actionBarActions = actionBarActions.map(action => ({
			...action,
			run: async (...args: unknown[]) => {
				this.actionWidgetService.hide();
				return action.run(...args);
			}
		}));

		const accessibilityProvider: Partial<IListAccessibilityProvider<IActionListItem<IActionWidgetDropdownAction>>> = {
			isChecked(element) {
				return element.kind === ActionListItemKind.Action && !!element?.item?.checked;
			},
			getRole: (e) => {
				switch (e.kind) {
					case ActionListItemKind.Action:
						return 'menuitemcheckbox';
					case ActionListItemKind.Separator:
						return 'separator';
					default:
						return 'separator';
				}
			},
			getWidgetRole: () => 'menu',
		};

		this.actionWidgetService.show<IActionWidgetDropdownAction>(
			this._options.label ?? '',
			false,
			actionWidgetItems,
			actionWidgetDelegate,
			this.element,
			undefined,
			actionBarActions,
			accessibilityProvider
		);
	}

	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/actionWidget/common/actionWidget.ts]---
Location: vscode-main/src/vs/platform/actionWidget/common/actionWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';

export interface ActionSet<T> extends IDisposable {
	readonly validActions: readonly T[];
	readonly allActions: readonly T[];
	readonly hasAutoFix: boolean;
	readonly hasAIFix: boolean;
	readonly allAIFixes: boolean;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/assignment/common/assignment.ts]---
Location: vscode-main/src/vs/platform/assignment/common/assignment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import * as platform from '../../../base/common/platform.js';
import type { IExperimentationFilterProvider } from 'tas-client';

export const ASSIGNMENT_STORAGE_KEY = 'VSCode.ABExp.FeatureData';
export const ASSIGNMENT_REFETCH_INTERVAL = 60 * 60 * 1000; // 1 hour

export interface IAssignmentService {
	readonly _serviceBrand: undefined;

	readonly onDidRefetchAssignments: Event<void>;
	getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined>;
}

export enum TargetPopulation {
	Insiders = 'insider',
	Public = 'public',
	Exploration = 'exploration'
}

/*
Based upon the official VSCode currently existing filters in the
ExP backend for the VSCode cluster.
https://experimentation.visualstudio.com/Analysis%20and%20Experimentation/_git/AnE.ExP.TAS.TachyonHost.Configuration?path=%2FConfigurations%2Fvscode%2Fvscode.json&version=GBmaster
"X-MSEdge-Market": "detection.market",
"X-FD-Corpnet": "detection.corpnet",
"X-VSCode-AppVersion": "appversion",
"X-VSCode-Build": "build",
"X-MSEdge-ClientId": "clientid",
"X-VSCode-ExtensionName": "extensionname",
"X-VSCode-ExtensionVersion": "extensionversion",
"X-VSCode-TargetPopulation": "targetpopulation",
"X-VSCode-Language": "language",
"X-VSCode-Platform": "platform",
"X-VSCode-ReleaseDate": "releasedate"
*/
export enum Filters {
	/**
	 * The market in which the extension is distributed.
	 */
	Market = 'X-MSEdge-Market',

	/**
	 * The corporation network.
	 */
	CorpNet = 'X-FD-Corpnet',

	/**
	 * Version of the application which uses experimentation service.
	 */
	ApplicationVersion = 'X-VSCode-AppVersion',

	/**
	 * Insiders vs Stable.
	 */
	Build = 'X-VSCode-Build',

	/**
	 * Client Id which is used as primary unit for the experimentation.
	 */
	ClientId = 'X-MSEdge-ClientId',

	/**
	 * Developer Device Id which can be used as an alternate unit for experimentation.
	 */
	DeveloperDeviceId = 'X-VSCode-DevDeviceId',

	/**
	 * Extension header.
	 */
	ExtensionName = 'X-VSCode-ExtensionName',

	/**
	 * The version of the extension.
	 */
	ExtensionVersion = 'X-VSCode-ExtensionVersion',

	/**
	 * The language in use by VS Code
	 */
	Language = 'X-VSCode-Language',

	/**
	 * The target population.
	 * This is used to separate internal, early preview, GA, etc.
	 */
	TargetPopulation = 'X-VSCode-TargetPopulation',

	/**
	 * The platform (OS) on which VS Code is running.
	 */
	Platform = 'X-VSCode-Platform',

	/**
	 * The release/build date of VS Code (UTC) in the format yyyymmddHH.
	 */
	ReleaseDate = 'X-VSCode-ReleaseDate',
}

export class AssignmentFilterProvider implements IExperimentationFilterProvider {
	constructor(
		private version: string,
		private appName: string,
		private machineId: string,
		private devDeviceId: string,
		private targetPopulation: TargetPopulation,
		private releaseDate: string
	) { }

	/**
	 * Returns a version string that can be parsed by the TAS client.
	 * The tas client cannot handle suffixes lke "-insider"
	 * Ref: https://github.com/microsoft/tas-client/blob/30340d5e1da37c2789049fcf45928b954680606f/vscode-tas-client/src/vscode-tas-client/VSCodeFilterProvider.ts#L35
	 *
	 * @param version Version string to be trimmed.
	*/
	private static trimVersionSuffix(version: string): string {
		const regex = /\-[a-zA-Z0-9]+$/;
		const result = version.split(regex);

		return result[0];
	}

	getFilterValue(filter: string): string | null {
		switch (filter) {
			case Filters.ApplicationVersion:
				return AssignmentFilterProvider.trimVersionSuffix(this.version); // productService.version
			case Filters.Build:
				return this.appName; // productService.nameLong
			case Filters.ClientId:
				return this.machineId;
			case Filters.DeveloperDeviceId:
				return this.devDeviceId;
			case Filters.Language:
				return platform.language;
			case Filters.ExtensionName:
				return 'vscode-core'; // always return vscode-core for exp service
			case Filters.ExtensionVersion:
				return '999999.0'; // always return a very large number for cross-extension experimentation
			case Filters.TargetPopulation:
				return this.targetPopulation;
			case Filters.Platform:
				return platform.PlatformToString(platform.platform);
			case Filters.ReleaseDate:
				return AssignmentFilterProvider.formatReleaseDate(this.releaseDate);
			default:
				return '';
		}
	}

	private static formatReleaseDate(iso: string): string {
		// Expect ISO format, fall back to empty string if not provided
		if (!iso) {
			return '';
		}
		// Remove separators and milliseconds: YYYY-MM-DDTHH:MM:SS.sssZ -> YYYYMMDDHH
		// Trimmed to 10 digits to fit within int32 bounds (ExP requirement)
		const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2})/.exec(iso);
		if (!match) {
			return '';
		}
		return match.slice(1, 5).join('');
	}

	getFilters(): Map<string, unknown> {
		const filters: Map<string, unknown> = new Map<string, unknown>();
		const filterValues = Object.values(Filters);
		for (const value of filterValues) {
			filters.set(value, this.getFilterValue(value));
		}

		return filters;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindow.ts]---
Location: vscode-main/src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindow.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, BrowserWindowConstructorOptions, WebContents } from 'electron';
import { isLinux, isWindows } from '../../../base/common/platform.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { ILifecycleMainService } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { IStateService } from '../../state/node/state.js';
import { hasNativeTitlebar, TitlebarStyle } from '../../window/common/window.js';
import { IBaseWindow, WindowMode } from '../../window/electron-main/window.js';
import { BaseWindow } from '../../windows/electron-main/windowImpl.js';

export interface IAuxiliaryWindow extends IBaseWindow {
	readonly parentId: number;
}

export class AuxiliaryWindow extends BaseWindow implements IAuxiliaryWindow {

	readonly id: number;
	parentId = -1;

	override get win() {
		if (!super.win) {
			this.tryClaimWindow();
		}

		return super.win;
	}

	private stateApplied = false;

	constructor(
		private readonly webContents: WebContents,
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@ILogService logService: ILogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStateService stateService: IStateService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService
	) {
		super(configurationService, stateService, environmentMainService, logService);

		this.id = this.webContents.id;

		// Try to claim window
		this.tryClaimWindow();
	}

	tryClaimWindow(options?: BrowserWindowConstructorOptions): void {
		if (this._store.isDisposed || this.webContents.isDestroyed()) {
			return; // already disposed
		}

		this.doTryClaimWindow(options);

		if (options && !this.stateApplied) {
			this.stateApplied = true;

			this.applyState({
				x: options.x,
				y: options.y,
				width: options.width,
				height: options.height,
				// We currently do not support restoring fullscreen state for auxiliary
				// windows because we do not get hold of the original `features` string
				// that contains that info in `window-fullscreen`. However, we can
				// probe the `options.show` value for whether the window should be maximized
				// or not because we never show maximized windows initially to reduce flicker.
				mode: options.show === false ? WindowMode.Maximized : WindowMode.Normal
			});
		}
	}

	private doTryClaimWindow(options?: BrowserWindowConstructorOptions): void {
		if (this._win) {
			return; // already claimed
		}

		const window = BrowserWindow.fromWebContents(this.webContents);
		if (window) {
			this.logService.trace('[aux window] Claimed browser window instance');

			// Remember
			this.setWin(window, options);

			// Disable Menu
			window.setMenu(null);
			if ((isWindows || isLinux) && hasNativeTitlebar(this.configurationService, options?.titleBarStyle === 'hidden' ? TitlebarStyle.CUSTOM : undefined /* unknown */)) {
				window.setAutoHideMenuBar(true); // Fix for https://github.com/microsoft/vscode/issues/200615
			}

			// Lifecycle
			this.lifecycleMainService.registerAuxWindow(this);
		}
	}

	matches(webContents: WebContents): boolean {
		return this.webContents.id === webContents.id;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindows.ts]---
Location: vscode-main/src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindows.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindowConstructorOptions, HandlerDetails, WebContents } from 'electron';
import { Event } from '../../../base/common/event.js';
import { IAuxiliaryWindow } from './auxiliaryWindow.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IAuxiliaryWindowsMainService = createDecorator<IAuxiliaryWindowsMainService>('auxiliaryWindowsMainService');

export interface IAuxiliaryWindowsMainService {

	readonly _serviceBrand: undefined;

	readonly onDidMaximizeWindow: Event<IAuxiliaryWindow>;
	readonly onDidUnmaximizeWindow: Event<IAuxiliaryWindow>;
	readonly onDidChangeFullScreen: Event<{ window: IAuxiliaryWindow; fullscreen: boolean }>;
	readonly onDidChangeAlwaysOnTop: Event<{ window: IAuxiliaryWindow; alwaysOnTop: boolean }>;
	readonly onDidTriggerSystemContextMenu: Event<{ readonly window: IAuxiliaryWindow; readonly x: number; readonly y: number }>;

	createWindow(details: HandlerDetails): BrowserWindowConstructorOptions;
	registerWindow(webContents: WebContents): void;

	getWindowByWebContents(webContents: WebContents): IAuxiliaryWindow | undefined;

	getFocusedWindow(): IAuxiliaryWindow | undefined;
	getLastActiveWindow(): IAuxiliaryWindow | undefined;

	getWindows(): readonly IAuxiliaryWindow[];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindowsMainService.ts]---
Location: vscode-main/src/vs/platform/auxiliaryWindow/electron-main/auxiliaryWindowsMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BrowserWindow, BrowserWindowConstructorOptions, HandlerDetails, WebContents, app } from 'electron';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { FileAccess } from '../../../base/common/network.js';
import { validatedIpcMain } from '../../../base/parts/ipc/electron-main/ipcMain.js';
import { AuxiliaryWindow, IAuxiliaryWindow } from './auxiliaryWindow.js';
import { IAuxiliaryWindowsMainService } from './auxiliaryWindows.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILogService } from '../../log/common/log.js';
import { IWindowState, WindowMode, defaultAuxWindowState } from '../../window/electron-main/window.js';
import { IDefaultBrowserWindowOptionsOverrides, WindowStateValidator, defaultBrowserWindowOptions, getLastFocused } from '../../windows/electron-main/windows.js';

export class AuxiliaryWindowsMainService extends Disposable implements IAuxiliaryWindowsMainService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidMaximizeWindow = this._register(new Emitter<IAuxiliaryWindow>());
	readonly onDidMaximizeWindow = this._onDidMaximizeWindow.event;

	private readonly _onDidUnmaximizeWindow = this._register(new Emitter<IAuxiliaryWindow>());
	readonly onDidUnmaximizeWindow = this._onDidUnmaximizeWindow.event;

	private readonly _onDidChangeFullScreen = this._register(new Emitter<{ window: IAuxiliaryWindow; fullscreen: boolean }>());
	readonly onDidChangeFullScreen = this._onDidChangeFullScreen.event;

	private readonly _onDidChangeAlwaysOnTop = this._register(new Emitter<{ window: IAuxiliaryWindow; alwaysOnTop: boolean }>());
	readonly onDidChangeAlwaysOnTop = this._onDidChangeAlwaysOnTop.event;

	private readonly _onDidTriggerSystemContextMenu = this._register(new Emitter<{ window: IAuxiliaryWindow; x: number; y: number }>());
	readonly onDidTriggerSystemContextMenu = this._onDidTriggerSystemContextMenu.event;

	private readonly windows = new Map<number /* webContents ID */, AuxiliaryWindow>();

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// We have to ensure that an auxiliary window gets to know its
		// containing `BrowserWindow` so that it can apply listeners to it
		// Unfortunately we cannot rely on static `BrowserWindow` methods
		// because we might call the methods too early before the window
		// is created.

		app.on('browser-window-created', (_event, browserWindow) => {

			// This is an auxiliary window, try to claim it
			const auxiliaryWindow = this.getWindowByWebContents(browserWindow.webContents);
			if (auxiliaryWindow) {
				this.logService.trace('[aux window] app.on("browser-window-created"): Trying to claim auxiliary window');

				auxiliaryWindow.tryClaimWindow();
			}

			// This is a main window, listen to child windows getting created to claim it
			else {
				const disposables = new DisposableStore();
				disposables.add(Event.fromNodeEventEmitter(browserWindow.webContents, 'did-create-window', (browserWindow, details) => ({ browserWindow, details }))(({ browserWindow, details }) => {
					const auxiliaryWindow = this.getWindowByWebContents(browserWindow.webContents);
					if (auxiliaryWindow) {
						this.logService.trace('[aux window] window.on("did-create-window"): Trying to claim auxiliary window');

						auxiliaryWindow.tryClaimWindow(details.options);
					}
				}));
				disposables.add(Event.fromNodeEventEmitter(browserWindow, 'closed')(() => disposables.dispose()));
			}
		});

		validatedIpcMain.handle('vscode:registerAuxiliaryWindow', async (event, mainWindowId: number) => {
			const auxiliaryWindow = this.getWindowByWebContents(event.sender);
			if (auxiliaryWindow) {
				this.logService.trace('[aux window] vscode:registerAuxiliaryWindow: Registering auxiliary window to main window');

				auxiliaryWindow.parentId = mainWindowId;
			}

			return event.sender.id;
		});
	}

	createWindow(details: HandlerDetails): BrowserWindowConstructorOptions {
		const { state, overrides } = this.computeWindowStateAndOverrides(details);
		return this.instantiationService.invokeFunction(defaultBrowserWindowOptions, state, overrides, {
			preload: FileAccess.asFileUri('vs/base/parts/sandbox/electron-browser/preload-aux.js').fsPath
		});
	}

	private computeWindowStateAndOverrides(details: HandlerDetails): { readonly state: IWindowState; readonly overrides: IDefaultBrowserWindowOptionsOverrides } {
		const windowState: IWindowState = {};
		const overrides: IDefaultBrowserWindowOptionsOverrides = {};

		const features = details.features.split(','); // for example: popup=yes,left=270,top=14.5,width=1024,height=768
		for (const feature of features) {
			const [key, value] = feature.split('=');
			switch (key) {
				case 'width':
					windowState.width = parseInt(value, 10);
					break;
				case 'height':
					windowState.height = parseInt(value, 10);
					break;
				case 'left':
					windowState.x = parseInt(value, 10);
					break;
				case 'top':
					windowState.y = parseInt(value, 10);
					break;
				case 'window-maximized':
					windowState.mode = WindowMode.Maximized;
					break;
				case 'window-fullscreen':
					windowState.mode = WindowMode.Fullscreen;
					break;
				case 'window-disable-fullscreen':
					overrides.disableFullscreen = true;
					break;
				case 'window-native-titlebar':
					overrides.forceNativeTitlebar = true;
					break;
				case 'window-always-on-top':
					overrides.alwaysOnTop = true;
					break;
			}
		}

		const state = WindowStateValidator.validateWindowState(this.logService, windowState) ?? defaultAuxWindowState();

		this.logService.trace('[aux window] using window state', state);

		return { state, overrides };
	}

	registerWindow(webContents: WebContents): void {
		const disposables = new DisposableStore();

		const auxiliaryWindow = this.instantiationService.createInstance(AuxiliaryWindow, webContents);

		this.windows.set(auxiliaryWindow.id, auxiliaryWindow);
		disposables.add(toDisposable(() => this.windows.delete(auxiliaryWindow.id)));

		disposables.add(auxiliaryWindow.onDidMaximize(() => this._onDidMaximizeWindow.fire(auxiliaryWindow)));
		disposables.add(auxiliaryWindow.onDidUnmaximize(() => this._onDidUnmaximizeWindow.fire(auxiliaryWindow)));
		disposables.add(auxiliaryWindow.onDidEnterFullScreen(() => this._onDidChangeFullScreen.fire({ window: auxiliaryWindow, fullscreen: true })));
		disposables.add(auxiliaryWindow.onDidLeaveFullScreen(() => this._onDidChangeFullScreen.fire({ window: auxiliaryWindow, fullscreen: false })));
		disposables.add(auxiliaryWindow.onDidChangeAlwaysOnTop(alwaysOnTop => this._onDidChangeAlwaysOnTop.fire({ window: auxiliaryWindow, alwaysOnTop })));
		disposables.add(auxiliaryWindow.onDidTriggerSystemContextMenu(({ x, y }) => this._onDidTriggerSystemContextMenu.fire({ window: auxiliaryWindow, x, y })));

		Event.once(auxiliaryWindow.onDidClose)(() => disposables.dispose());
	}

	getWindowByWebContents(webContents: WebContents): AuxiliaryWindow | undefined {
		const window = this.windows.get(webContents.id);

		return window?.matches(webContents) ? window : undefined;
	}

	getFocusedWindow(): IAuxiliaryWindow | undefined {
		const window = BrowserWindow.getFocusedWindow();
		if (window) {
			return this.getWindowByWebContents(window.webContents);
		}

		return undefined;
	}

	getLastActiveWindow(): IAuxiliaryWindow | undefined {
		return getLastFocused(Array.from(this.windows.values()));
	}

	getWindows(): readonly IAuxiliaryWindow[] {
		return Array.from(this.windows.values());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/backup/common/backup.ts]---
Location: vscode-main/src/vs/platform/backup/common/backup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export interface IBaseBackupInfo {
	remoteAuthority?: string;
}

export interface IWorkspaceBackupInfo extends IBaseBackupInfo {
	readonly workspace: IWorkspaceIdentifier;
}

export interface IFolderBackupInfo extends IBaseBackupInfo {
	readonly folderUri: URI;
}

export function isFolderBackupInfo(curr: IWorkspaceBackupInfo | IFolderBackupInfo): curr is IFolderBackupInfo {
	return curr?.hasOwnProperty('folderUri');
}

export function isWorkspaceBackupInfo(curr: IWorkspaceBackupInfo | IFolderBackupInfo): curr is IWorkspaceBackupInfo {
	return curr?.hasOwnProperty('workspace');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/backup/electron-main/backup.ts]---
Location: vscode-main/src/vs/platform/backup/electron-main/backup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEmptyWindowBackupInfo } from '../node/backup.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IFolderBackupInfo, IWorkspaceBackupInfo } from '../common/backup.js';

export const IBackupMainService = createDecorator<IBackupMainService>('backupMainService');

export interface IBackupMainService {

	readonly _serviceBrand: undefined;

	isHotExitEnabled(): boolean;

	getEmptyWindowBackups(): IEmptyWindowBackupInfo[];

	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo): string;
	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom: string): Promise<string>;
	registerFolderBackup(folderInfo: IFolderBackupInfo): string;
	registerEmptyWindowBackup(emptyWindowInfo: IEmptyWindowBackupInfo): string;

	/**
	 * All folders or workspaces that are known to have
	 * backups stored. This call is long running because
	 * it checks for each backup location if any backups
	 * are stored.
	 */
	getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/backup/electron-main/backupMainService.ts]---
Location: vscode-main/src/vs/platform/backup/electron-main/backupMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createHash } from 'crypto';
import { isEqual } from '../../../base/common/extpath.js';
import { Schemas } from '../../../base/common/network.js';
import { join } from '../../../base/common/path.js';
import { isLinux } from '../../../base/common/platform.js';
import { extUriBiasedIgnorePathCase } from '../../../base/common/resources.js';
import { Promises, RimRafMode } from '../../../base/node/pfs.js';
import { IBackupMainService } from './backup.js';
import { ISerializedBackupWorkspaces, IEmptyWindowBackupInfo, isEmptyWindowBackupInfo, deserializeWorkspaceInfos, deserializeFolderInfos, ISerializedWorkspaceBackupInfo, ISerializedFolderBackupInfo, ISerializedEmptyWindowBackupInfo } from '../node/backup.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentMainService } from '../../environment/electron-main/environmentMainService.js';
import { IStateService } from '../../state/node/state.js';
import { HotExitConfiguration, IFilesConfiguration } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IFolderBackupInfo, isFolderBackupInfo, IWorkspaceBackupInfo } from '../common/backup.js';
import { isWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { createEmptyWorkspaceIdentifier } from '../../workspaces/node/workspaces.js';

export class BackupMainService implements IBackupMainService {

	declare readonly _serviceBrand: undefined;

	private static readonly backupWorkspacesMetadataStorageKey = 'backupWorkspaces';

	protected backupHome: string;

	private workspaces: IWorkspaceBackupInfo[] = [];
	private folders: IFolderBackupInfo[] = [];
	private emptyWindows: IEmptyWindowBackupInfo[] = [];

	// Comparers for paths and resources that will
	// - ignore path casing on Windows/macOS
	// - respect path casing on Linux
	private readonly backupUriComparer = extUriBiasedIgnorePathCase;
	private readonly backupPathComparer = { isEqual: (pathA: string, pathB: string) => isEqual(pathA, pathB, !isLinux) };

	constructor(
		@IEnvironmentMainService environmentMainService: IEnvironmentMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ILogService private readonly logService: ILogService,
		@IStateService private readonly stateService: IStateService
	) {
		this.backupHome = environmentMainService.backupHome;
	}

	async initialize(): Promise<void> {

		// read backup workspaces
		const serializedBackupWorkspaces = this.stateService.getItem<ISerializedBackupWorkspaces>(BackupMainService.backupWorkspacesMetadataStorageKey) ?? { workspaces: [], folders: [], emptyWindows: [] };

		// validate empty workspaces backups first
		this.emptyWindows = await this.validateEmptyWorkspaces(serializedBackupWorkspaces.emptyWindows);

		// validate workspace backups
		this.workspaces = await this.validateWorkspaces(deserializeWorkspaceInfos(serializedBackupWorkspaces));

		// validate folder backups
		this.folders = await this.validateFolders(deserializeFolderInfos(serializedBackupWorkspaces));

		// store metadata in case some workspaces or folders have been removed
		this.storeWorkspacesMetadata();
	}

	protected getWorkspaceBackups(): IWorkspaceBackupInfo[] {
		if (this.isHotExitOnExitAndWindowClose()) {
			// Only non-folder windows are restored on main process launch when
			// hot exit is configured as onExitAndWindowClose.
			return [];
		}

		return this.workspaces.slice(0); // return a copy
	}

	protected getFolderBackups(): IFolderBackupInfo[] {
		if (this.isHotExitOnExitAndWindowClose()) {
			// Only non-folder windows are restored on main process launch when
			// hot exit is configured as onExitAndWindowClose.
			return [];
		}

		return this.folders.slice(0); // return a copy
	}

	isHotExitEnabled(): boolean {
		return this.getHotExitConfig() !== HotExitConfiguration.OFF;
	}

	private isHotExitOnExitAndWindowClose(): boolean {
		return this.getHotExitConfig() === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE;
	}

	private getHotExitConfig(): string {
		const config = this.configurationService.getValue<IFilesConfiguration>();

		return config?.files?.hotExit || HotExitConfiguration.ON_EXIT;
	}

	getEmptyWindowBackups(): IEmptyWindowBackupInfo[] {
		return this.emptyWindows.slice(0); // return a copy
	}

	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo): string;
	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom: string): Promise<string>;
	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom?: string): string | Promise<string> {
		if (!this.workspaces.some(workspace => workspaceInfo.workspace.id === workspace.workspace.id)) {
			this.workspaces.push(workspaceInfo);
			this.storeWorkspacesMetadata();
		}

		const backupPath = join(this.backupHome, workspaceInfo.workspace.id);

		if (migrateFrom) {
			return this.moveBackupFolder(backupPath, migrateFrom).then(() => backupPath);
		}

		return backupPath;
	}

	private async moveBackupFolder(backupPath: string, moveFromPath: string): Promise<void> {

		// Target exists: make sure to convert existing backups to empty window backups
		if (await Promises.exists(backupPath)) {
			await this.convertToEmptyWindowBackup(backupPath);
		}

		// When we have data to migrate from, move it over to the target location
		if (await Promises.exists(moveFromPath)) {
			try {
				await Promises.rename(moveFromPath, backupPath, false /* no retry */);
			} catch (error) {
				this.logService.error(`Backup: Could not move backup folder to new location: ${error.toString()}`);
			}
		}
	}

	registerFolderBackup(folderInfo: IFolderBackupInfo): string {
		if (!this.folders.some(folder => this.backupUriComparer.isEqual(folderInfo.folderUri, folder.folderUri))) {
			this.folders.push(folderInfo);
			this.storeWorkspacesMetadata();
		}

		return join(this.backupHome, this.getFolderHash(folderInfo));
	}

	registerEmptyWindowBackup(emptyWindowInfo: IEmptyWindowBackupInfo): string {
		if (!this.emptyWindows.some(emptyWindow => !!emptyWindow.backupFolder && this.backupPathComparer.isEqual(emptyWindow.backupFolder, emptyWindowInfo.backupFolder))) {
			this.emptyWindows.push(emptyWindowInfo);
			this.storeWorkspacesMetadata();
		}

		return join(this.backupHome, emptyWindowInfo.backupFolder);
	}

	private async validateWorkspaces(rootWorkspaces: IWorkspaceBackupInfo[]): Promise<IWorkspaceBackupInfo[]> {
		if (!Array.isArray(rootWorkspaces)) {
			return [];
		}

		const seenIds: Set<string> = new Set();
		const result: IWorkspaceBackupInfo[] = [];

		// Validate Workspaces
		for (const workspaceInfo of rootWorkspaces) {
			const workspace = workspaceInfo.workspace;
			if (!isWorkspaceIdentifier(workspace)) {
				return []; // wrong format, skip all entries
			}

			if (!seenIds.has(workspace.id)) {
				seenIds.add(workspace.id);

				const backupPath = join(this.backupHome, workspace.id);
				const hasBackups = await this.doHasBackups(backupPath);

				// If the workspace has no backups, ignore it
				if (hasBackups) {
					if (workspace.configPath.scheme !== Schemas.file || await Promises.exists(workspace.configPath.fsPath)) {
						result.push(workspaceInfo);
					} else {
						// If the workspace has backups, but the target workspace is missing, convert backups to empty ones
						await this.convertToEmptyWindowBackup(backupPath);
					}
				} else {
					await this.deleteStaleBackup(backupPath);
				}
			}
		}

		return result;
	}

	private async validateFolders(folderWorkspaces: IFolderBackupInfo[]): Promise<IFolderBackupInfo[]> {
		if (!Array.isArray(folderWorkspaces)) {
			return [];
		}

		const result: IFolderBackupInfo[] = [];
		const seenIds: Set<string> = new Set();
		for (const folderInfo of folderWorkspaces) {
			const folderURI = folderInfo.folderUri;
			const key = this.backupUriComparer.getComparisonKey(folderURI);
			if (!seenIds.has(key)) {
				seenIds.add(key);

				const backupPath = join(this.backupHome, this.getFolderHash(folderInfo));
				const hasBackups = await this.doHasBackups(backupPath);

				// If the folder has no backups, ignore it
				if (hasBackups) {
					if (folderURI.scheme !== Schemas.file || await Promises.exists(folderURI.fsPath)) {
						result.push(folderInfo);
					} else {
						// If the folder has backups, but the target workspace is missing, convert backups to empty ones
						await this.convertToEmptyWindowBackup(backupPath);
					}
				} else {
					await this.deleteStaleBackup(backupPath);
				}
			}
		}

		return result;
	}

	private async validateEmptyWorkspaces(emptyWorkspaces: IEmptyWindowBackupInfo[]): Promise<IEmptyWindowBackupInfo[]> {
		if (!Array.isArray(emptyWorkspaces)) {
			return [];
		}

		const result: IEmptyWindowBackupInfo[] = [];
		const seenIds: Set<string> = new Set();

		// Validate Empty Windows
		for (const backupInfo of emptyWorkspaces) {
			const backupFolder = backupInfo.backupFolder;
			if (typeof backupFolder !== 'string') {
				return [];
			}

			if (!seenIds.has(backupFolder)) {
				seenIds.add(backupFolder);

				const backupPath = join(this.backupHome, backupFolder);
				if (await this.doHasBackups(backupPath)) {
					result.push(backupInfo);
				} else {
					await this.deleteStaleBackup(backupPath);
				}
			}
		}

		return result;
	}

	private async deleteStaleBackup(backupPath: string): Promise<void> {
		try {
			await Promises.rm(backupPath, RimRafMode.MOVE);
		} catch (error) {
			this.logService.error(`Backup: Could not delete stale backup: ${error.toString()}`);
		}
	}

	private prepareNewEmptyWindowBackup(): IEmptyWindowBackupInfo {

		// We are asked to prepare a new empty window backup folder.
		// Empty windows backup folders are derived from a workspace
		// identifier, so we generate a new empty workspace identifier
		// until we found a unique one.

		let emptyWorkspaceIdentifier = createEmptyWorkspaceIdentifier();
		while (this.emptyWindows.some(emptyWindow => !!emptyWindow.backupFolder && this.backupPathComparer.isEqual(emptyWindow.backupFolder, emptyWorkspaceIdentifier.id))) {
			emptyWorkspaceIdentifier = createEmptyWorkspaceIdentifier();
		}

		return { backupFolder: emptyWorkspaceIdentifier.id };
	}

	private async convertToEmptyWindowBackup(backupPath: string): Promise<boolean> {
		const newEmptyWindowBackupInfo = this.prepareNewEmptyWindowBackup();

		// Rename backupPath to new empty window backup path
		const newEmptyWindowBackupPath = join(this.backupHome, newEmptyWindowBackupInfo.backupFolder);
		try {
			await Promises.rename(backupPath, newEmptyWindowBackupPath, false /* no retry */);
		} catch (error) {
			this.logService.error(`Backup: Could not rename backup folder: ${error.toString()}`);
			return false;
		}
		this.emptyWindows.push(newEmptyWindowBackupInfo);

		return true;
	}

	async getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>> {
		const dirtyWorkspaces: Array<IWorkspaceBackupInfo | IFolderBackupInfo> = [];

		// Workspaces with backups
		for (const workspace of this.workspaces) {
			if ((await this.hasBackups(workspace))) {
				dirtyWorkspaces.push(workspace);
			}
		}

		// Folders with backups
		for (const folder of this.folders) {
			if ((await this.hasBackups(folder))) {
				dirtyWorkspaces.push(folder);
			}
		}

		return dirtyWorkspaces;
	}

	private hasBackups(backupLocation: IWorkspaceBackupInfo | IEmptyWindowBackupInfo | IFolderBackupInfo): Promise<boolean> {
		let backupPath: string;

		// Empty
		if (isEmptyWindowBackupInfo(backupLocation)) {
			backupPath = join(this.backupHome, backupLocation.backupFolder);
		}

		// Folder
		else if (isFolderBackupInfo(backupLocation)) {
			backupPath = join(this.backupHome, this.getFolderHash(backupLocation));
		}

		// Workspace
		else {
			backupPath = join(this.backupHome, backupLocation.workspace.id);
		}

		return this.doHasBackups(backupPath);
	}

	private async doHasBackups(backupPath: string): Promise<boolean> {
		try {
			const backupSchemas = await Promises.readdir(backupPath);

			for (const backupSchema of backupSchemas) {
				try {
					const backupSchemaChildren = await Promises.readdir(join(backupPath, backupSchema));
					if (backupSchemaChildren.length > 0) {
						return true;
					}
				} catch {
					// invalid folder
				}
			}
		} catch {
			// backup path does not exist
		}

		return false;
	}


	private storeWorkspacesMetadata(): void {
		const serializedBackupWorkspaces: ISerializedBackupWorkspaces = {
			workspaces: this.workspaces.map(({ workspace, remoteAuthority }) => {
				const serializedWorkspaceBackupInfo: ISerializedWorkspaceBackupInfo = {
					id: workspace.id,
					configURIPath: workspace.configPath.toString()
				};

				if (remoteAuthority) {
					serializedWorkspaceBackupInfo.remoteAuthority = remoteAuthority;
				}

				return serializedWorkspaceBackupInfo;
			}),
			folders: this.folders.map(({ folderUri, remoteAuthority }) => {
				const serializedFolderBackupInfo: ISerializedFolderBackupInfo =
				{
					folderUri: folderUri.toString()
				};

				if (remoteAuthority) {
					serializedFolderBackupInfo.remoteAuthority = remoteAuthority;
				}

				return serializedFolderBackupInfo;
			}),
			emptyWindows: this.emptyWindows.map(({ backupFolder, remoteAuthority }) => {
				const serializedEmptyWindowBackupInfo: ISerializedEmptyWindowBackupInfo = {
					backupFolder
				};

				if (remoteAuthority) {
					serializedEmptyWindowBackupInfo.remoteAuthority = remoteAuthority;
				}

				return serializedEmptyWindowBackupInfo;
			})
		};

		this.stateService.setItem(BackupMainService.backupWorkspacesMetadataStorageKey, serializedBackupWorkspaces);
	}

	protected getFolderHash(folder: IFolderBackupInfo): string {
		const folderUri = folder.folderUri;

		let key: string;
		if (folderUri.scheme === Schemas.file) {
			key = isLinux ? folderUri.fsPath : folderUri.fsPath.toLowerCase(); // for backward compatibility, use the fspath as key
		} else {
			key = folderUri.toString().toLowerCase();
		}

		return createHash('md5').update(key).digest('hex'); // CodeQL [SM04514] Using MD5 to convert a file path to a fixed length
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/backup/node/backup.ts]---
Location: vscode-main/src/vs/platform/backup/node/backup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { IBaseBackupInfo, IFolderBackupInfo, IWorkspaceBackupInfo } from '../common/backup.js';

export interface IEmptyWindowBackupInfo extends IBaseBackupInfo {
	readonly backupFolder: string;
}

export function isEmptyWindowBackupInfo(obj: unknown): obj is IEmptyWindowBackupInfo {
	const candidate = obj as IEmptyWindowBackupInfo | undefined;

	return typeof candidate?.backupFolder === 'string';
}

export interface ISerializedWorkspaceBackupInfo {
	readonly id: string;
	readonly configURIPath: string;
	remoteAuthority?: string;
}

export function deserializeWorkspaceInfos(serializedBackupWorkspaces: ISerializedBackupWorkspaces): IWorkspaceBackupInfo[] {
	let workspaceBackupInfos: IWorkspaceBackupInfo[] = [];
	try {
		if (Array.isArray(serializedBackupWorkspaces.workspaces)) {
			workspaceBackupInfos = serializedBackupWorkspaces.workspaces.map(workspace => (
				{
					workspace: {
						id: workspace.id,
						configPath: URI.parse(workspace.configURIPath)
					},
					remoteAuthority: workspace.remoteAuthority
				}
			));
		}
	} catch {
		// ignore URI parsing exceptions
	}

	return workspaceBackupInfos;
}

export interface ISerializedFolderBackupInfo {
	readonly folderUri: string;
	remoteAuthority?: string;
}

export function deserializeFolderInfos(serializedBackupWorkspaces: ISerializedBackupWorkspaces): IFolderBackupInfo[] {
	let folderBackupInfos: IFolderBackupInfo[] = [];
	try {
		if (Array.isArray(serializedBackupWorkspaces.folders)) {
			folderBackupInfos = serializedBackupWorkspaces.folders.map(folder => (
				{
					folderUri: URI.parse(folder.folderUri),
					remoteAuthority: folder.remoteAuthority
				}
			));
		}
	} catch {
		// ignore URI parsing exceptions
	}

	return folderBackupInfos;
}

export interface ISerializedEmptyWindowBackupInfo extends IEmptyWindowBackupInfo { }

export interface ISerializedBackupWorkspaces {
	readonly workspaces: ISerializedWorkspaceBackupInfo[];
	readonly folders: ISerializedFolderBackupInfo[];
	readonly emptyWindows: ISerializedEmptyWindowBackupInfo[];
}
```

--------------------------------------------------------------------------------

````

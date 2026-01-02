---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 282
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 282 of 552)

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

---[FILE: src/vs/platform/quickinput/browser/quickInputService.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../contextkey/common/contextkey.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILayoutService } from '../../layout/browser/layoutService.js';
import { IOpenerService } from '../../opener/common/opener.js';
import { QuickAccessController } from './quickAccess.js';
import { IQuickAccessController } from '../common/quickAccess.js';
import { IInputBox, IInputOptions, IKeyMods, IPickOptions, IQuickInputButton, IQuickInputService, IQuickNavigateConfiguration, IQuickPick, IQuickPickItem, IQuickTree, IQuickTreeItem, IQuickWidget, QuickInputHideReason, QuickPickInput } from '../common/quickInput.js';
import { defaultButtonStyles, defaultCountBadgeStyles, defaultInputBoxStyles, defaultKeybindingLabelStyles, defaultProgressBarStyles, defaultToggleStyles, getListStyles } from '../../theme/browser/defaultStyles.js';
import { activeContrastBorder, asCssVariable, pickerGroupBorder, pickerGroupForeground, quickInputBackground, quickInputForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, quickInputTitleBackground, widgetBorder, widgetShadow } from '../../theme/common/colorRegistry.js';
import { IThemeService, Themable } from '../../theme/common/themeService.js';
import { IQuickInputOptions, IQuickInputStyles, QuickInputHoverDelegate } from './quickInput.js';
import { QuickInputController, IQuickInputControllerHost } from './quickInputController.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { getWindow } from '../../../base/browser/dom.js';

export class QuickInputService extends Themable implements IQuickInputService {

	declare readonly _serviceBrand: undefined;

	get backButton(): IQuickInputButton { return this.controller.backButton; }

	private readonly _onShow = this._register(new Emitter<void>());
	readonly onShow = this._onShow.event;

	private readonly _onHide = this._register(new Emitter<void>());
	readonly onHide = this._onHide.event;

	private _controller: QuickInputController | undefined;
	private get controller(): QuickInputController {
		if (!this._controller) {
			this._controller = this._register(this.createController());
		}

		return this._controller;
	}

	private get hasController() { return !!this._controller; }
	get currentQuickInput() { return this.controller.currentQuickInput; }

	private _quickAccess: IQuickAccessController | undefined;
	get quickAccess(): IQuickAccessController {
		if (!this._quickAccess) {
			this._quickAccess = this._register(this.instantiationService.createInstance(QuickAccessController));
		}

		return this._quickAccess;
	}

	private readonly contexts = new Map<string, IContextKey<boolean>>();

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService protected readonly contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@ILayoutService protected readonly layoutService: ILayoutService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
	) {
		super(themeService);
	}

	protected createController(host: IQuickInputControllerHost = this.layoutService, options?: Partial<IQuickInputOptions>): QuickInputController {
		const defaultOptions: IQuickInputOptions = {
			idPrefix: 'quickInput_',
			container: host.activeContainer,
			ignoreFocusOut: () => false,
			backKeybindingLabel: () => undefined,
			setContextKey: (id?: string) => this.setContextKey(id),
			linkOpenerDelegate: (content) => {
				// HACK: https://github.com/microsoft/vscode/issues/173691
				this.instantiationService.invokeFunction(accessor => {
					const openerService = accessor.get(IOpenerService);
					openerService.open(content, { allowCommands: true, fromUserGesture: true });
				});
			},
			returnFocus: () => host.focus(),
			styles: this.computeStyles(),
			hoverDelegate: this._register(this.instantiationService.createInstance(QuickInputHoverDelegate))
		};

		const controller = this._register(this.instantiationService.createInstance(
			QuickInputController,
			{
				...defaultOptions,
				...options
			}
		));

		controller.layout(host.activeContainerDimension, host.activeContainerOffset.quickPickTop);

		// Layout changes
		this._register(host.onDidLayoutActiveContainer(dimension => {
			if (getWindow(host.activeContainer) === getWindow(controller.container)) {
				controller.layout(dimension, host.activeContainerOffset.quickPickTop);
			}
		}));
		this._register(host.onDidChangeActiveContainer(() => {
			if (controller.isVisible()) {
				return;
			}

			controller.layout(host.activeContainerDimension, host.activeContainerOffset.quickPickTop);
		}));

		// Context keys
		this._register(controller.onShow(() => {
			this.resetContextKeys();
			this._onShow.fire();
		}));
		this._register(controller.onHide(() => {
			this.resetContextKeys();
			this._onHide.fire();
		}));

		return controller;
	}

	private setContextKey(id?: string) {
		let key: IContextKey<boolean> | undefined;
		if (id) {
			key = this.contexts.get(id);
			if (!key) {
				key = new RawContextKey<boolean>(id, false)
					.bindTo(this.contextKeyService);
				this.contexts.set(id, key);
			}
		}

		if (key && key.get()) {
			return; // already active context
		}

		this.resetContextKeys();

		key?.set(true);
	}

	private resetContextKeys() {
		this.contexts.forEach(context => {
			if (context.get()) {
				context.reset();
			}
		});
	}

	pick<T extends IQuickPickItem, O extends IPickOptions<T>>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: O, token: CancellationToken = CancellationToken.None): Promise<(O extends { canPickMany: true } ? T[] : T) | undefined> {
		return this.controller.pick(picks, options, token);
	}

	input(options: IInputOptions = {}, token: CancellationToken = CancellationToken.None): Promise<string | undefined> {
		return this.controller.input(options, token);
	}

	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: true }): IQuickPick<T, { useSeparators: true }>;
	createQuickPick<T extends IQuickPickItem>(options?: { useSeparators: boolean }): IQuickPick<T, { useSeparators: false }>;
	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: boolean } = { useSeparators: false }): IQuickPick<T, { useSeparators: boolean }> {
		return this.controller.createQuickPick(options);
	}

	createInputBox(): IInputBox {
		return this.controller.createInputBox();
	}

	createQuickWidget(): IQuickWidget {
		return this.controller.createQuickWidget();
	}

	createQuickTree<T extends IQuickTreeItem>(): IQuickTree<T> {
		return this.controller.createQuickTree();
	}

	focus() {
		this.controller.focus();
	}

	toggle() {
		this.controller.toggle();
	}

	navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration) {
		this.controller.navigate(next, quickNavigate);
	}

	accept(keyMods?: IKeyMods) {
		return this.controller.accept(keyMods);
	}

	back() {
		return this.controller.back();
	}

	cancel(reason?: QuickInputHideReason): Promise<void> {
		return this.controller.cancel(reason);
	}

	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }): void {
		this.controller.setAlignment(alignment);
	}

	toggleHover(): void {
		if (this.hasController) {
			this.controller.toggleHover();
		}
	}

	override updateStyles() {
		if (this.hasController) {
			this.controller.applyStyles(this.computeStyles());
		}
	}

	private computeStyles(): IQuickInputStyles {
		return {
			widget: {
				quickInputBackground: asCssVariable(quickInputBackground),
				quickInputForeground: asCssVariable(quickInputForeground),
				quickInputTitleBackground: asCssVariable(quickInputTitleBackground),
				widgetBorder: asCssVariable(widgetBorder),
				widgetShadow: asCssVariable(widgetShadow),
			},
			inputBox: defaultInputBoxStyles,
			toggle: defaultToggleStyles,
			countBadge: defaultCountBadgeStyles,
			button: defaultButtonStyles,
			progressBar: defaultProgressBarStyles,
			keybindingLabel: defaultKeybindingLabelStyles,
			list: getListStyles({
				listBackground: quickInputBackground,
				listFocusBackground: quickInputListFocusBackground,
				listFocusForeground: quickInputListFocusForeground,
				// Look like focused when inactive.
				listInactiveFocusForeground: quickInputListFocusForeground,
				listInactiveSelectionIconForeground: quickInputListFocusIconForeground,
				listInactiveFocusBackground: quickInputListFocusBackground,
				listFocusOutline: activeContrastBorder,
				listInactiveFocusOutline: activeContrastBorder,
				treeStickyScrollBackground: quickInputBackground,
			}),
			pickerGroup: {
				pickerGroupBorder: asCssVariable(pickerGroupBorder),
				pickerGroupForeground: asCssVariable(pickerGroupForeground),
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickInputUtils.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickInputUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../base/browser/domStylesheets.js';
import * as cssJs from '../../../base/browser/cssValue.js';
import { DomEmitter } from '../../../base/browser/event.js';
import { Event } from '../../../base/common/event.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { Gesture, EventType as GestureEventType } from '../../../base/browser/touch.js';
import { renderLabelWithIcons } from '../../../base/browser/ui/iconLabel/iconLabels.js';
import { IdGenerator } from '../../../base/common/idGenerator.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { parseLinkedText } from '../../../base/common/linkedText.js';
import { URI } from '../../../base/common/uri.js';
import './media/quickInput.css';
import { localize } from '../../../nls.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IQuickInputButton } from '../common/quickInput.js';
import { IAction } from '../../../base/common/actions.js';

const iconPathToClass: Record<string, string> = {};
const iconClassGenerator = new IdGenerator('quick-input-button-icon-');

function getIconClass(iconPath: { dark: URI; light?: URI } | undefined): string | undefined {
	if (!iconPath) {
		return undefined;
	}
	let iconClass: string;

	const key = iconPath.dark.toString();
	if (iconPathToClass[key]) {
		iconClass = iconPathToClass[key];
	} else {
		iconClass = iconClassGenerator.nextId();
		domStylesheetsJs.createCSSRule(`.${iconClass}, .hc-light .${iconClass}`, `background-image: ${cssJs.asCSSUrl(iconPath.light || iconPath.dark)}`);
		domStylesheetsJs.createCSSRule(`.vs-dark .${iconClass}, .hc-black .${iconClass}`, `background-image: ${cssJs.asCSSUrl(iconPath.dark)}`);
		iconPathToClass[key] = iconClass;
	}

	return iconClass;
}

class QuickInputToggleButtonAction implements IAction {
	class: string | undefined;

	constructor(
		public readonly id: string,
		public label: string,
		public tooltip: string,
		className: string | undefined,
		public enabled: boolean,
		private _checked: boolean,
		public run: () => unknown
	) {
		this.class = className;
	}

	get checked(): boolean {
		return this._checked;
	}

	set checked(value: boolean) {
		this._checked = value;
		// Toggles behave like buttons. When clicked, they run... the only difference is that their checked state also changes.
		this.run();
	}
}

export function quickInputButtonToAction(button: IQuickInputButton, id: string, run: () => unknown): IAction {
	let cssClasses = button.iconClass || getIconClass(button.iconPath);
	if (button.alwaysVisible) {
		cssClasses = cssClasses ? `${cssClasses} always-visible` : 'always-visible';
	}

	const handler = () => {
		if (button.toggle) {
			button.toggle.checked = !button.toggle.checked;
		}
		return run();
	};

	const action = button.toggle
		? new QuickInputToggleButtonAction(
			id,
			'',
			button.tooltip || '',
			cssClasses,
			true,
			button.toggle.checked,
			handler
		)
		: {
			id,
			label: '',
			tooltip: button.tooltip || '',
			class: cssClasses,
			enabled: true,
			run: handler,
		};

	return action;
}

export function renderQuickInputDescription(description: string, container: HTMLElement, actionHandler: { callback: (content: string) => void; disposables: DisposableStore }) {
	dom.reset(container);
	const parsed = parseLinkedText(description);
	let tabIndex = 0;
	for (const node of parsed.nodes) {
		if (typeof node === 'string') {
			container.append(...renderLabelWithIcons(node));
		} else {
			let title = node.title;

			if (!title && node.href.startsWith('command:')) {
				title = localize('executeCommand', "Click to execute command '{0}'", node.href.substring('command:'.length));
			} else if (!title) {
				title = node.href;
			}

			const anchor = dom.$('a', { href: node.href, title, tabIndex: tabIndex++ }, node.label);
			anchor.style.textDecoration = 'underline';
			const handleOpen = (e: unknown) => {
				if (dom.isEventLike(e)) {
					dom.EventHelper.stop(e, true);
				}

				actionHandler.callback(node.href);
			};

			const onClick = actionHandler.disposables.add(new DomEmitter(anchor, dom.EventType.CLICK)).event;
			const onKeydown = actionHandler.disposables.add(new DomEmitter(anchor, dom.EventType.KEY_DOWN)).event;
			const onSpaceOrEnter = Event.chain(onKeydown, $ => $.filter(e => {
				const event = new StandardKeyboardEvent(e);

				return event.equals(KeyCode.Space) || event.equals(KeyCode.Enter);
			}));

			actionHandler.disposables.add(Gesture.addTarget(anchor));
			const onTap = actionHandler.disposables.add(new DomEmitter(anchor, GestureEventType.Tap)).event;

			Event.any(onClick, onTap, onSpaceOrEnter)(handleOpen, null, actionHandler.disposables);
			container.appendChild(anchor);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/quickPickPin.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/quickPickPin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../base/common/codicons.js';
import { localize } from '../../../nls.js';
import { IQuickPick, IQuickPickItem, QuickPickItem } from '../common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';

const pinButtonClass = ThemeIcon.asClassName(Codicon.pin);
const pinnedButtonClass = ThemeIcon.asClassName(Codicon.pinned);
const buttonClasses = [pinButtonClass, pinnedButtonClass];
/**
 * Initially, adds pin buttons to all @param quickPick items.
 * When pinned, a copy of the item will be moved to the end of the pinned list and any duplicate within the pinned list will
 * be removed if @param filterDupliates has been provided. Pin and pinned button events trigger updates to the underlying storage.
 * Shows the quickpick once formatted.
 */
export function showWithPinnedItems(storageService: IStorageService, storageKey: string, quickPick: IQuickPick<IQuickPickItem, { useSeparators: true }>, filterDuplicates?: boolean): IDisposable {
	const itemsWithoutPinned = quickPick.items;
	let itemsWithPinned = _formatPinnedItems(storageKey, quickPick, storageService, undefined, filterDuplicates);
	const disposables = new DisposableStore();
	disposables.add(quickPick.onDidTriggerItemButton(async buttonEvent => {
		const expectedButton = buttonEvent.button.iconClass && buttonClasses.includes(buttonEvent.button.iconClass);
		if (expectedButton) {
			quickPick.items = itemsWithoutPinned;
			itemsWithPinned = _formatPinnedItems(storageKey, quickPick, storageService, buttonEvent.item, filterDuplicates);
			quickPick.items = quickPick.value ? itemsWithoutPinned : itemsWithPinned;
		}
	}));
	disposables.add(quickPick.onDidChangeValue(async value => {
		if (quickPick.items === itemsWithPinned && value) {
			quickPick.items = itemsWithoutPinned;
		} else if (quickPick.items === itemsWithoutPinned && !value) {
			quickPick.items = itemsWithPinned;
		}
	}));

	quickPick.items = quickPick.value ? itemsWithoutPinned : itemsWithPinned;
	quickPick.show();
	return disposables;
}

function _formatPinnedItems(storageKey: string, quickPick: IQuickPick<IQuickPickItem, { useSeparators: true }>, storageService: IStorageService, changedItem?: IQuickPickItem, filterDuplicates?: boolean): QuickPickItem[] {
	const formattedItems: QuickPickItem[] = [];
	let pinnedItems;
	if (changedItem) {
		pinnedItems = updatePinnedItems(storageKey, changedItem, storageService);
	} else {
		pinnedItems = getPinnedItems(storageKey, storageService);
	}
	if (pinnedItems.length) {
		formattedItems.push({ type: 'separator', label: localize("terminal.commands.pinned", 'pinned') });
	}
	const pinnedIds = new Set();
	for (const itemToFind of pinnedItems) {
		const itemToPin = quickPick.items.find(item => itemsMatch(item, itemToFind));
		if (itemToPin) {
			const pinnedItemId = getItemIdentifier(itemToPin);
			const pinnedItem: IQuickPickItem = { ...(itemToPin as IQuickPickItem) };
			if (!filterDuplicates || !pinnedIds.has(pinnedItemId)) {
				pinnedIds.add(pinnedItemId);
				updateButtons(pinnedItem, false);
				formattedItems.push(pinnedItem);
			}
		}
	}

	for (const item of quickPick.items) {
		updateButtons(item, true);
		formattedItems.push(item);
	}
	return formattedItems;
}

function getItemIdentifier(item: QuickPickItem): string {
	return item.type === 'separator' ? '' : item.id || `${item.label}${item.description}${item.detail}`;
}

function updateButtons(item: QuickPickItem, removePin: boolean): void {
	if (item.type === 'separator') {
		return;
	}

	// remove button classes before adding the new one
	const newButtons = item.buttons?.filter(button => button.iconClass && !buttonClasses.includes(button.iconClass)) ?? [];
	newButtons.unshift({
		iconClass: removePin ? pinButtonClass : pinnedButtonClass,
		tooltip: removePin ? localize('pinCommand', "Pin command") : localize('pinnedCommand', "Pinned command"),
		alwaysVisible: false
	});
	item.buttons = newButtons;
}

function itemsMatch(itemA: QuickPickItem, itemB: QuickPickItem): boolean {
	return getItemIdentifier(itemA) === getItemIdentifier(itemB);
}

function updatePinnedItems(storageKey: string, changedItem: IQuickPickItem, storageService: IStorageService): IQuickPickItem[] {
	const removePin = changedItem.buttons?.find(b => b.iconClass === pinnedButtonClass);
	let items = getPinnedItems(storageKey, storageService);
	if (removePin) {
		items = items.filter(item => getItemIdentifier(item) !== getItemIdentifier(changedItem));
	} else {
		items.push(changedItem);
	}
	storageService.store(storageKey, JSON.stringify(items.map(formatPinnedItemForStorage)), StorageScope.WORKSPACE, StorageTarget.MACHINE);
	return items;
}

function getPinnedItems(storageKey: string, storageService: IStorageService): IQuickPickItem[] {
	const items = storageService.get(storageKey, StorageScope.WORKSPACE);
	return items ? JSON.parse(items) : [];
}

function formatPinnedItemForStorage(item: IQuickPickItem): IQuickPickItem {
	return {
		label: item.label,
		description: item.description,
		detail: item.detail,
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/media/quickInput.css]---
Location: vscode-main/src/vs/platform/quickinput/browser/media/quickInput.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.quick-input-widget {
	position: absolute;
	width: 600px;
	z-index: 2550;
	left: 50%;
	-webkit-app-region: no-drag;
	border-radius: 6px;
}

.quick-input-titlebar {
	cursor: grab;
	display: flex;
	align-items: center;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
}

.quick-input-widget .monaco-inputbox .monaco-action-bar {
	top: 0;
}

.quick-input-widget .monaco-action-bar .monaco-custom-toggle {
	margin-left: 0;
	border-radius: 5px;
	box-sizing: content-box;
}

.quick-input-left-action-bar {
	display: flex;
	margin-left: 4px;
}

/* give some space between input and action bar */
.quick-input-inline-action-bar > .actions-container > .action-item:first-child {
	margin-left: 5px;
}

/* center horizontally */
.quick-input-inline-action-bar > .actions-container > .action-item {
	margin-top: 2px;
}

.quick-input-title {
	cursor: grab;
	padding: 3px 0px;
	text-align: center;
	text-overflow: ellipsis;
	overflow: hidden;
	flex: 1;
}

.quick-input-right-action-bar {
	display: flex;
	margin-right: 4px;
}

.quick-input-right-action-bar > .actions-container {
	justify-content: flex-end;
}

.quick-input-right-action-bar > .actions-container > .action-item {
	margin-left: 4px;
}

.quick-input-inline-action-bar > .actions-container > .action-item {
	margin-left: 4px;
}

.quick-input-titlebar .monaco-action-bar .action-label.codicon {
	background-position: center;
	background-repeat: no-repeat;
	padding: 2px;
}

.quick-input-description {
	margin: 6px 6px 6px 11px;
}

.quick-input-header .quick-input-description {
	margin: 4px 2px;
	flex: 1;
}

.quick-input-header {
	cursor: grab;
	display: flex;
	padding: 6px 6px 2px 6px;
}

.quick-input-widget.hidden-input .quick-input-header {
	/* reduce margins and paddings when input box hidden */
	padding: 0;
	margin-bottom: 0;
}

.quick-input-and-message {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	min-width: 0;
	position: relative;
}

.quick-input-check-all {
	align-self: center;
	margin: 0;
}

.quick-input-widget .quick-input-header .monaco-checkbox {
	margin-top: 6px;
}

.quick-input-filter {
	flex-grow: 1;
	display: flex;
	position: relative;
}

.quick-input-box {
	flex-grow: 1;
}

.quick-input-widget.show-checkboxes .quick-input-box,
.quick-input-widget.show-checkboxes .quick-input-message {
	margin-left: 5px;
}

.quick-input-visible-count {
	position: absolute;
	left: -10000px;
}

.quick-input-count {
	align-self: center;
	position: absolute;
	right: 4px;
	display: flex;
	align-items: center;
}

.quick-input-count .monaco-count-badge {
	vertical-align: middle;
	padding: 2px 4px;
	border-radius: 2px;
	min-height: auto;
	line-height: normal;
}

.quick-input-action {
	margin-left: 6px;
}

.quick-input-action .monaco-text-button {
	font-size: 11px;
	padding: 0 6px;
	display: flex;
	height: 25px;
	align-items: center;
}

.quick-input-message {
	margin-top: -1px;
	padding: 5px;
	overflow-wrap: break-word;
}

.quick-input-message > .codicon {
	margin: 0 0.2em;
	vertical-align: text-bottom;
}

/* Links in descriptions & validations */
.quick-input-message a {
	color: inherit;
}

.quick-input-progress.monaco-progress-container {
	position: relative;
}

.quick-input-list {
	line-height: 22px;
}

.quick-input-widget.hidden-input .quick-input-list {
	margin-top: 4px;
	/* reduce margins when input box hidden */
	padding-bottom: 4px;
}

.quick-input-list .monaco-list {
	overflow: hidden;
	max-height: calc(20 * 22px);
	padding-bottom: 5px;
}

.quick-input-list .monaco-scrollable-element {
	padding: 0px 6px;
}

.quick-input-list .quick-input-list-entry {
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	padding: 0 6px;
}

.quick-input-list .quick-input-list-entry.quick-input-list-separator-border {
	border-top-width: 1px;
	border-top-style: solid;
}

.quick-input-list .monaco-list-row {
	border-radius: 3px;
}

.quick-input-list .monaco-list-row[data-index="0"] .quick-input-list-entry.quick-input-list-separator-border {
	border-top-style: none;
}

.quick-input-list .quick-input-list-label {
	overflow: hidden;
	display: flex;
	height: 100%;
	flex: 1;
}

.quick-input-widget .monaco-checkbox {
	margin-right: 0;
}

.quick-input-widget .quick-input-list .monaco-checkbox,
.quick-input-widget .quick-input-tree .monaco-checkbox {
	margin-top: 4px;
}

.quick-input-list .quick-input-list-icon {
	background-size: 16px;
	background-position: left center;
	background-repeat: no-repeat;
	padding-right: 6px;
	width: 16px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.quick-input-list .quick-input-list-rows {
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	flex-direction: column;
	height: 100%;
	flex: 1;
	margin-left: 5px;
}

.quick-input-list .quick-input-list-rows > .quick-input-list-row {
	display: flex;
	align-items: center;
}

.quick-input-list .quick-input-list-rows > .quick-input-list-row .monaco-icon-label,
.quick-input-list .quick-input-list-rows > .quick-input-list-row .monaco-icon-label .monaco-icon-label-container > .monaco-icon-name-container {
	flex: 1;
	/* make sure the icon label grows within the row */
}

.quick-input-list .quick-input-list-rows > .quick-input-list-row .codicon[class*='codicon-'] {
	vertical-align: text-bottom;
}

.quick-input-list .quick-input-list-rows .monaco-highlighted-label > span {
	opacity: 1;
}

.quick-input-list .quick-input-list-entry .quick-input-list-entry-keybinding {
	margin-right: 8px;
	/* separate from the separator label or scrollbar if any */
}

.quick-input-list .quick-input-list-label-meta {
	opacity: 0.7;
	line-height: normal;
	text-overflow: ellipsis;
	overflow: hidden;
}

/* preserve list-like styling instead of tree-like styling */
.quick-input-list .monaco-list .monaco-list-row .monaco-highlighted-label .highlight {
	font-weight: bold;
	background-color: unset;
	color: var(--vscode-list-highlightForeground) !important;
}

/* preserve list-like styling instead of tree-like styling */
.quick-input-list .monaco-list .monaco-list-row.focused .monaco-highlighted-label .highlight {
	color: var(--vscode-list-focusHighlightForeground) !important;
}

.quick-input-list .quick-input-list-entry .quick-input-list-separator {
	margin-right: 4px;
	/* separate from keybindings or actions */
}

.quick-input-list .quick-input-list-entry-action-bar {
	display: flex;
	flex: 0;
	overflow: visible;
}

.quick-input-list .quick-input-list-entry-action-bar .action-label,
.quick-input-list .quick-input-list-entry-action-bar .monaco-custom-toggle {
	/*
	 * By default, actions in the quick input action bar are hidden
	 * until hovered over them or selected.
	 */
	display: none;
}

.quick-input-list .quick-input-list-entry-action-bar .action-label.codicon {
	margin-right: 4px;
	padding: 2px;
}

.quick-input-list .quick-input-list-entry-action-bar .monaco-custom-toggle.codicon {
	margin-right: 4px;
}

.quick-input-list .quick-input-list-entry-action-bar {
	margin-top: 1px;
}

.quick-input-list .quick-input-list-entry-action-bar {
	margin-right: 4px;
	/* separate from scrollbar */
}

.quick-input-list .quick-input-list-entry .quick-input-list-entry-action-bar .action-label.always-visible,
.quick-input-list .quick-input-list-entry:hover .quick-input-list-entry-action-bar .action-label,
.quick-input-list .quick-input-list-entry.focus-inside .quick-input-list-entry-action-bar .action-label,
.quick-input-list .monaco-list-row.focused .quick-input-list-entry-action-bar .action-label,
.quick-input-list .monaco-list-row.passive-focused .quick-input-list-entry-action-bar .action-label,
.quick-input-list .quick-input-list-entry .quick-input-list-entry-action-bar .monaco-custom-toggle.always-visible,
.quick-input-list .quick-input-list-entry:hover .quick-input-list-entry-action-bar .monaco-custom-toggle,
.quick-input-list .quick-input-list-entry.focus-inside .quick-input-list-entry-action-bar .monaco-custom-toggle,
.quick-input-list .monaco-list-row.focused .quick-input-list-entry-action-bar .monaco-custom-toggle,
.quick-input-list .monaco-list-row.passive-focused .quick-input-list-entry-action-bar .monaco-custom-toggle {
	display: flex;
}

.quick-input-list > .monaco-list:focus .monaco-list-row.focused {
	outline: 1px solid var(--vscode-list-focusOutline) !important;
	outline-offset: -1px;
}

.quick-input-list > .monaco-list:focus .monaco-list-row.focused .quick-input-list-entry.quick-input-list-separator-border {
	border-color: transparent;
}

/* focused items in quick pick */
.quick-input-list .monaco-list-row.focused .monaco-keybinding-key,
.quick-input-list .monaco-list-row.focused .quick-input-list-entry .quick-input-list-separator {
	color: inherit
}

.quick-input-list .monaco-list-row.focused .monaco-keybinding-key,
.quick-input-list .monaco-list-row:hover .monaco-keybinding-key {
	background: none;
	border-color: var(--vscode-widget-shadow);
}

.quick-input-list .quick-input-list-separator-as-item {
	padding: 4px 6px;
	font-size: 12px;
}

/* Quick input separators as full-row item */
.quick-input-list .quick-input-list-separator-as-item .label-name {
	font-weight: 600;
}

.quick-input-list .quick-input-list-separator-as-item .label-description {
	/* Override default description opacity so we don't have a contrast ratio issue. */
	opacity: 1 !important;
}

/* Hide border when the item becomes the sticky one */
.quick-input-list .monaco-tree-sticky-row .quick-input-list-entry.quick-input-list-separator-as-item.quick-input-list-separator-border {
	border-top-style: none;
}

/* Give sticky row the same padding as the scrollable list */
.quick-input-list .monaco-tree-sticky-row {
	padding: 0 5px;
}

/* Hide the twistie containers so that there isn't blank indent */
.quick-input-list .monaco-tl-twistie {
	display: none !important;
}

/* Tree */

.quick-input-tree .monaco-list {
	overflow: hidden;
	max-height: calc(20 * 22px);
	padding-bottom: 5px;
}

.quick-input-tree.quick-input-tree-flat .monaco-tl-indent,
.quick-input-tree.quick-input-tree-flat .monaco-tl-twistie {
	display: none !important;
}

.quick-input-tree.quick-input-tree-flat .monaco-checkbox {
	margin-left: 6px;
}

.quick-input-tree .quick-input-tree-entry {
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	padding-right: 6px;
}

.quick-input-tree .quick-input-tree-label {
	overflow: hidden;
	display: flex;
	height: 100%;
	flex: 1;
}

.quick-input-tree .quick-input-tree-icon {
	background-size: 16px;
	background-position: left center;
	background-repeat: no-repeat;
	padding-right: 6px;
	width: 16px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.quick-input-tree .quick-input-tree-rows {
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	flex-direction: column;
	height: 100%;
	flex: 1;
	margin-left: 5px;
}

.quick-input-tree .quick-input-tree-rows > .quick-input-tree-row {
	display: flex;
	align-items: center;
}

.quick-input-tree .quick-input-tree-rows > .quick-input-tree-row .monaco-icon-label,
.quick-input-tree .quick-input-tree-rows > .quick-input-tree-row .monaco-icon-label .monaco-icon-label-container > .monaco-icon-name-container {
	flex: 1;
	/* make sure the icon label grows within the row */
}

.quick-input-tree .quick-input-tree-rows > .quick-input-tree-row .codicon[class*='codicon-'] {
	vertical-align: text-bottom;
}

.quick-input-tree .quick-input-tree-rows .monaco-highlighted-label > span {
	opacity: 1;
}

.quick-input-tree .quick-input-tree-entry-action-bar {
	display: flex;
	flex: 0;
	overflow: visible;
}

.quick-input-tree .quick-input-tree-entry-action-bar .action-label,
.quick-input-tree .quick-input-tree-entry-action-bar .monaco-custom-toggle {
	/*
	 * By default, actions in the quick input action bar are hidden
	 * until hovered over them or selected.
	 */
	display: none;
}

.quick-input-tree .quick-input-tree-entry-action-bar .action-label.codicon {
	margin-right: 4px;
	padding: 2px;
}

.quick-input-tree .quick-input-tree-entry-action-bar .monaco-custom-toggle.codicon {
	margin-right: 4px;
}

.quick-input-tree .quick-input-tree-entry-action-bar {
	margin-top: 1px;
}

.quick-input-tree .quick-input-tree-entry-action-bar {
	margin-right: 4px;
	/* separate from scrollbar */
}

.quick-input-tree .quick-input-tree-entry .quick-input-tree-entry-action-bar .action-label.always-visible,
.quick-input-tree .quick-input-tree-entry:hover .quick-input-tree-entry-action-bar .action-label,
.quick-input-tree .quick-input-tree-entry.focus-inside .quick-input-tree-entry-action-bar .action-label,
.quick-input-tree .monaco-list-row.focused .quick-input-tree-entry-action-bar .action-label,
.quick-input-tree .monaco-list-row.passive-focused .quick-input-tree-entry-action-bar .action-label,
.quick-input-tree .quick-input-tree-entry .quick-input-tree-entry-action-bar .monaco-custom-toggle.always-visible,
.quick-input-tree .quick-input-tree-entry:hover .quick-input-tree-entry-action-bar .monaco-custom-toggle,
.quick-input-tree .quick-input-tree-entry.focus-inside .quick-input-tree-entry-action-bar .monaco-custom-toggle,
.quick-input-tree .monaco-list-row.focused .quick-input-tree-entry-action-bar .monaco-custom-toggle,
.quick-input-tree .monaco-list-row.passive-focused .quick-input-tree-entry-action-bar .monaco-custom-toggle {
	display: flex;
}

.quick-input-tree > .monaco-list:focus .monaco-list-row.focused {
	outline: 1px solid var(--vscode-list-focusOutline) !important;
	outline-offset: -1px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputDelegate.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputDelegate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListVirtualDelegate } from '../../../../base/browser/ui/list/list.js';
import { IQuickTreeItem } from '../../common/quickInput.js';
import { QuickInputTreeRenderer } from './quickInputTreeRenderer.js';

/**
 * Delegate for QuickInputTree that provides height and template information.
 */
export class QuickInputTreeDelegate<T extends IQuickTreeItem> implements IListVirtualDelegate<T> {
	getHeight(_element: T): number {
		return 22;
	}

	getTemplateId(_element: T): string {
		return QuickInputTreeRenderer.ID;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTree.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMatch } from '../../../../base/common/filters.js';
import { IQuickTreeItem } from '../../common/quickInput.js';
import { IObjectTreeElement, ITreeNode } from '../../../../base/browser/ui/tree/tree.js';

export interface IQuickTreeFilterData {
	readonly labelHighlights?: IMatch[];
	readonly descriptionHighlights?: IMatch[];
}

export function getParentNodeState(parentChildren: ITreeNode<IQuickTreeItem | null, IQuickTreeFilterData>[] | IObjectTreeElement<IQuickTreeItem>[]): boolean | 'mixed' {
	let containsChecks = false;
	let containsUnchecks = false;
	let containsMixed = false;

	for (const element of parentChildren) {
		switch (element.element?.checked) {
			case 'mixed':
				containsMixed = true;
				break;
			case true:
				containsChecks = true;
				break;
			default:
				containsUnchecks = true;
				break;
		}
		if (containsChecks && containsUnchecks && containsMixed) {
			break;
		}
	}
	const newState = containsUnchecks
		? containsMixed
			? 'mixed'
			: containsChecks
				? 'mixed'
				: false
		: containsMixed
			? 'mixed'
			: containsChecks;
	return newState;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTreeAccessibilityProvider.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTreeAccessibilityProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AriaRole } from '../../../../base/browser/ui/aria/aria.js';
import { CheckBoxAccessibleState } from '../../../../base/browser/ui/list/listView.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { Event, IValueWithChangeEvent } from '../../../../base/common/event.js';
import { getCodiconAriaLabel } from '../../../../base/common/iconLabels.js';
import { localize } from '../../../../nls.js';
import { IQuickTreeCheckboxEvent, IQuickTreeItem } from '../../common/quickInput.js';
/**
 * Accessibility provider for QuickTree.
 */
export class QuickTreeAccessibilityProvider<T extends IQuickTreeItem> implements IListAccessibilityProvider<T> {
	constructor(private readonly onCheckedEvent: Event<IQuickTreeCheckboxEvent<T>>) { }

	getWidgetAriaLabel(): string {
		return localize('quickTree', "Quick Tree");
	}

	getAriaLabel(element: T): string {
		return element.ariaLabel || [element.label, element.description]
			.map(s => getCodiconAriaLabel(s))
			.filter(s => !!s)
			.join(', ');
	}

	getWidgetRole(): AriaRole {
		return 'tree';
	}

	getRole(_element: T): AriaRole {
		return 'checkbox';
	}

	isChecked(element: T): IValueWithChangeEvent<CheckBoxAccessibleState> | undefined {
		return {
			get value() { return element.checked === 'mixed' ? 'mixed' : !!element.checked; },
			onDidChange: e => Event.filter(this.onCheckedEvent, e => e.item === element)(_ => e()),
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTreeController.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTreeController.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { RenderIndentGuides } from '../../../../base/browser/ui/tree/abstractTree.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IObjectTreeElement, ObjectTreeElementCollapseState } from '../../../../base/browser/ui/tree/tree.js';
import { IIdentityProvider } from '../../../../base/browser/ui/list/list.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../instantiation/common/instantiation.js';
import { WorkbenchObjectTree } from '../../../list/browser/listService.js';
import { IQuickTreeCheckboxEvent, IQuickTreeItem, IQuickTreeItemButtonEvent, QuickPickFocus } from '../../common/quickInput.js';
import { QuickInputTreeDelegate } from './quickInputDelegate.js';
import { getParentNodeState, IQuickTreeFilterData } from './quickInputTree.js';
import { QuickTreeAccessibilityProvider } from './quickInputTreeAccessibilityProvider.js';
import { QuickInputTreeFilter } from './quickInputTreeFilter.js';
import { QuickInputCheckboxStateHandler, QuickInputTreeRenderer } from './quickInputTreeRenderer.js';
import { QuickInputTreeSorter } from './quickInputTreeSorter.js';
import { Checkbox } from '../../../../base/browser/ui/toggle/toggle.js';
import { IQuickInputStyles } from '../quickInput.js';

const $ = dom.$;
const flatHierarchyClass = 'quick-input-tree-flat';

class QuickInputTreeIdentityProvider implements IIdentityProvider<IQuickTreeItem> {
	private readonly _elementIds = new WeakMap<IQuickTreeItem, string>();
	private _counter = 0;

	getId(element: IQuickTreeItem): { toString(): string } {
		let id = element.id;
		if (id !== undefined) {
			return id;
		}

		id = this._elementIds.get(element);
		if (id !== undefined) {
			return id;
		}

		id = `__generated_${this._counter++}`;
		this._elementIds.set(element, id);
		return id;
	}
}

export class QuickInputTreeController extends Disposable {
	private readonly _renderer: QuickInputTreeRenderer<IQuickTreeItem>;
	private readonly _checkboxStateHandler: QuickInputCheckboxStateHandler<IQuickTreeItem>;
	private readonly _filter: QuickInputTreeFilter;
	private readonly _sorter: QuickInputTreeSorter;
	private readonly _tree: WorkbenchObjectTree<IQuickTreeItem, IQuickTreeFilterData>;

	private readonly _onDidTriggerButton = this._register(new Emitter<IQuickTreeItemButtonEvent<IQuickTreeItem>>());
	readonly onDidTriggerButton = this._onDidTriggerButton.event;

	private readonly _onDidChangeCheckboxState = this._register(new Emitter<IQuickTreeCheckboxEvent<IQuickTreeItem>>());
	readonly onDidChangeCheckboxState = this._onDidChangeCheckboxState.event;

	private readonly _onDidCheckedLeafItemsChange = this._register(new Emitter<ReadonlyArray<IQuickTreeItem>>());
	readonly onDidChangeCheckedLeafItems = this._onDidCheckedLeafItemsChange.event;

	private readonly _onLeave = new Emitter<void>();
	/**
	 * Event that is fired when the tree would no longer have focus.
	*/
	readonly onLeave: Event<void> = this._onLeave.event;

	private readonly _onDidAccept = this._register(new Emitter<void>());
	/**
	 * Event that is fired when a non-pickable item is clicked, indicating acceptance.
	 */
	readonly onDidAccept: Event<void> = this._onDidAccept.event;

	private readonly _container: HTMLElement;

	constructor(
		container: HTMLElement,
		hoverDelegate: IHoverDelegate | undefined,
		styles: IQuickInputStyles,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this._container = dom.append(container, $('.quick-input-tree'));
		this._checkboxStateHandler = this._register(new QuickInputCheckboxStateHandler<IQuickTreeItem>());
		this._renderer = this._register(this.instantiationService.createInstance(
			QuickInputTreeRenderer,
			hoverDelegate,
			this._onDidTriggerButton,
			this.onDidChangeCheckboxState,
			this._checkboxStateHandler,
			styles.toggle
		));
		this._filter = this.instantiationService.createInstance(QuickInputTreeFilter);
		this._sorter = this._register(new QuickInputTreeSorter());
		this._tree = this._register(this.instantiationService.createInstance(
			WorkbenchObjectTree<IQuickTreeItem, IQuickTreeFilterData>,
			'QuickInputTree',
			this._container,
			new QuickInputTreeDelegate(),
			[this._renderer],
			{
				accessibilityProvider: new QuickTreeAccessibilityProvider(this.onDidChangeCheckboxState),
				horizontalScrolling: false,
				multipleSelectionSupport: false,
				findWidgetEnabled: false,
				alwaysConsumeMouseWheel: true,
				hideTwistiesOfChildlessElements: true,
				renderIndentGuides: RenderIndentGuides.None,
				expandOnDoubleClick: true,
				expandOnlyOnTwistieClick: true,
				disableExpandOnSpacebar: true,
				sorter: this._sorter,
				filter: this._filter,
				identityProvider: new QuickInputTreeIdentityProvider()
			}
		));
		this.registerCheckboxStateListeners();
		this.registerOnDidChangeFocus();
	}

	get tree(): WorkbenchObjectTree<IQuickTreeItem, IQuickTreeFilterData> {
		return this._tree;
	}

	get renderer(): QuickInputTreeRenderer<IQuickTreeItem> {
		return this._renderer;
	}

	get displayed() {
		return this._container.style.display !== 'none';
	}

	set displayed(value: boolean) {
		this._container.style.display = value ? '' : 'none';
	}

	get sortByLabel() {
		return this._sorter.sortByLabel;
	}

	set sortByLabel(value: boolean) {
		this._sorter.sortByLabel = value;
		this._tree.resort(null, true);
	}

	getActiveDescendant() {
		return this._tree.getHTMLElement().getAttribute('aria-activedescendant');
	}

	filter(input: string): void {
		this._filter.filterValue = input;
		this._tree.refilter();
	}

	updateFilterOptions(options: {
		matchOnLabel?: boolean;
		matchOnDescription?: boolean;
	}): void {
		if (options.matchOnLabel !== undefined) {
			this._filter.matchOnLabel = options.matchOnLabel;
		}
		if (options.matchOnDescription !== undefined) {
			this._filter.matchOnDescription = options.matchOnDescription;
		}
		this._tree.refilter();
	}

	setTreeData(treeData: readonly IQuickTreeItem[]): void {
		let hasNestedItems = false;
		const createTreeElement = (item: IQuickTreeItem): IObjectTreeElement<IQuickTreeItem> => {
			let children: IObjectTreeElement<IQuickTreeItem>[] | undefined;
			if (item.children && item.children.length > 0) {
				hasNestedItems = true;
				children = item.children.map(child => createTreeElement(child));
				item.checked = getParentNodeState(children);
			}
			return {
				element: item,
				children,
				collapsible: !!children,
				collapsed: item.collapsed ?
					ObjectTreeElementCollapseState.PreserveOrCollapsed :
					ObjectTreeElementCollapseState.PreserveOrExpanded
			};
		};

		const treeElements = treeData.map(item => createTreeElement(item));
		this._tree.setChildren(null, treeElements);
		this._container.classList.toggle(flatHierarchyClass, !hasNestedItems);
	}

	layout(maxHeight?: number): void {
		this._tree.getHTMLElement().style.maxHeight = maxHeight ? `${
			// Make sure height aligns with list item heights
			Math.floor(maxHeight / 44) * 44
			// Add some extra height so that it's clear there's more to scroll
			+ 6
			}px` : '';
		this._tree.layout();
	}

	focus(what: QuickPickFocus): void {
		switch (what) {
			case QuickPickFocus.First:
				this._tree.scrollTop = 0;
				this._tree.focusFirst();
				break;
			case QuickPickFocus.Second: {
				this._tree.scrollTop = 0;
				let isSecondItem = false;
				this._tree.focusFirst(undefined, (e) => {
					if (isSecondItem) {
						return true;
					}
					isSecondItem = !isSecondItem;
					return false;
				});
				break;
			}
			case QuickPickFocus.Last:
				this._tree.scrollTop = this._tree.scrollHeight;
				this._tree.focusLast();
				break;
			case QuickPickFocus.Next: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusNext(undefined, false, undefined, (e) => {
					this._tree.reveal(e.element);
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0]) {
					this._onLeave.fire();
				}
				break;
			}
			case QuickPickFocus.Previous: {
				const prevFocus = this._tree.getFocus();
				this._tree.focusPrevious(undefined, false, undefined, (e) => {
					// do we want to reveal the parent?
					this._tree.reveal(e.element);
					return true;
				});
				const currentFocus = this._tree.getFocus();
				if (prevFocus.length && prevFocus[0] === currentFocus[0]) {
					this._onLeave.fire();
				}
				break;
			}
			case QuickPickFocus.NextPage:
				this._tree.focusNextPage(undefined, (e) => {
					this._tree.reveal(e.element);
					return true;
				});
				break;
			case QuickPickFocus.PreviousPage:
				this._tree.focusPreviousPage(undefined, (e) => {
					// do we want to reveal the parent?
					this._tree.reveal(e.element);
					return true;
				});
				break;
			case QuickPickFocus.NextSeparator:
			case QuickPickFocus.PreviousSeparator:
				// These don't make sense for the tree
				return;
		}
	}

	registerCheckboxStateListeners() {
		this._register(this._tree.onDidOpen(e => {
			const item = e.element;
			if (!item) {
				return;
			}

			if (item.disabled) {
				return;
			}

			// Check if the item is pickable (defaults to true if not specified)
			if (item.pickable === false) {
				// For non-pickable items, set it as the active item and fire the accept event
				this._tree.setFocus([item]);
				this._onDidAccept.fire();
				return;
			}

			const target = e.browserEvent?.target as HTMLElement | undefined;
			if (target && target.classList.contains(Checkbox.CLASS_NAME)) {
				return;
			}

			this.updateCheckboxState(item, item.checked === true);
		}));

		this._register(this._checkboxStateHandler.onDidChangeCheckboxState(e => {
			this.updateCheckboxState(e.item, e.checked === true);
		}));
	}

	private updateCheckboxState(item: IQuickTreeItem, newState: boolean): void {
		if ((item.checked ?? false) === newState) {
			return; // No change
		}

		// Handle checked item
		item.checked = newState;
		this._tree.rerender(item);

		// Handle children of the checked item
		const updateSet = new Set<IQuickTreeItem>();
		const toUpdate = [...this._tree.getNode(item).children];
		while (toUpdate.length) {
			const pop = toUpdate.shift();
			if (pop?.element && !updateSet.has(pop.element)) {
				updateSet.add(pop.element);
				if ((pop.element.checked ?? false) !== item.checked) {
					pop.element.checked = item.checked;
					this._tree.rerender(pop.element);
				}
				toUpdate.push(...pop.children);
			}
		}

		// Handle parents of the checked item
		let parent = this._tree.getParentElement(item);
		while (parent) {
			const parentChildren = [...this._tree.getNode(parent).children];
			const newState = getParentNodeState(parentChildren);

			if ((parent.checked ?? false) !== newState) {
				parent.checked = newState;
				this._tree.rerender(parent);
			}
			parent = this._tree.getParentElement(parent);
		}

		this._onDidChangeCheckboxState.fire({
			item,
			checked: item.checked ?? false
		});
		this._onDidCheckedLeafItemsChange.fire(this.getCheckedLeafItems());
	}

	registerOnDidChangeFocus() {
		// Ensure that selection follows focus
		this._register(this._tree.onDidChangeFocus(e => {
			const item = this._tree.getFocus().findLast(item => item !== null);
			this._tree.setSelection(item ? [item] : [], e.browserEvent);
		}));
	}

	getCheckedLeafItems() {
		const lookedAt = new Set<IQuickTreeItem>();
		const toLookAt = [...this._tree.getNode().children];
		const checkedItems = new Array<IQuickTreeItem>();
		while (toLookAt.length) {
			const lookAt = toLookAt.shift();
			if (!lookAt?.element || lookedAt.has(lookAt.element)) {
				continue;
			}
			if (lookAt.element.checked) {
				lookedAt.add(lookAt.element);
				toLookAt.push(...lookAt.children);
				if (!lookAt.element.children) {
					checkedItems.push(lookAt.element);
				}
			}
		}
		return checkedItems;
	}

	getActiveItems(): readonly IQuickTreeItem[] {
		return this._tree.getFocus().filter((item): item is IQuickTreeItem => item !== null);
	}

	check(element: IQuickTreeItem, checked: boolean | 'mixed') {
		if (element.checked === checked) {
			return;
		}
		element.checked = checked;
		this._onDidCheckedLeafItemsChange.fire(this.getCheckedLeafItems());
	}

	checkAll(checked: boolean | 'mixed') {
		const updated = new Set<IQuickTreeItem>();
		const toUpdate = [...this._tree.getNode().children];
		let fireCheckedChangeEvent = false;
		while (toUpdate.length) {
			const update = toUpdate.shift();
			if (!update?.element || updated.has(update.element)) {
				continue;
			}
			if (update.element.checked !== checked) {
				fireCheckedChangeEvent = true;
				update.element.checked = checked;
				toUpdate.push(...update.children);
				updated.add(update.element);
				this._tree.rerender(update.element);
				this._onDidChangeCheckboxState.fire({
					item: update.element,
					checked: update.element.checked
				});
			}
		}
		if (fireCheckedChangeEvent) {
			this._onDidCheckedLeafItemsChange.fire(this.getCheckedLeafItems());
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTreeFilter.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTreeFilter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeFilter, ITreeFilterDataResult, TreeVisibility } from '../../../../base/browser/ui/tree/tree.js';
import { matchesFuzzyIconAware, parseLabelWithIcons } from '../../../../base/common/iconLabels.js';
import { IQuickTreeItem } from '../../common/quickInput.js';
import { IQuickTreeFilterData } from './quickInputTree.js';

export class QuickInputTreeFilter implements ITreeFilter<IQuickTreeItem, IQuickTreeFilterData> {
	filterValue: string = '';
	matchOnLabel: boolean = true;
	matchOnDescription: boolean = false;

	filter(element: IQuickTreeItem, parentVisibility: TreeVisibility): ITreeFilterDataResult<IQuickTreeFilterData> {
		if (!this.filterValue || !(this.matchOnLabel || this.matchOnDescription)) {
			return element.children
				? { visibility: TreeVisibility.Recurse, data: {} }
				: { visibility: TreeVisibility.Visible, data: {} };
		}

		const labelHighlights = this.matchOnLabel ? matchesFuzzyIconAware(this.filterValue, parseLabelWithIcons(element.label)) ?? undefined : undefined;
		const descriptionHighlights = this.matchOnDescription ? matchesFuzzyIconAware(this.filterValue, parseLabelWithIcons(element.description || '')) ?? undefined : undefined;

		const visibility = parentVisibility === TreeVisibility.Visible
			// Parent is visible because it had matches, so we show all children
			? TreeVisibility.Visible
			// This would only happen on Parent is recurse so...
			: (labelHighlights || descriptionHighlights)
				// If we have any highlights, we are visible
				? TreeVisibility.Visible
				// Otherwise, we defer to the children or if no children, we are hidden
				: element.children
					? TreeVisibility.Recurse
					: TreeVisibility.Hidden;

		return {
			visibility,
			data: {
				labelHighlights,
				descriptionHighlights
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTreeRenderer.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTreeRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cssJs from '../../../../base/browser/cssValue.js';
import * as dom from '../../../../base/browser/dom.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IManagedHoverTooltipMarkdownString } from '../../../../base/browser/ui/hover/hover.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { createToggleActionViewItemProvider, IToggleStyles, TriStateCheckbox } from '../../../../base/browser/ui/toggle/toggle.js';
import { ITreeElementRenderDetails, ITreeNode, ITreeRenderer } from '../../../../base/browser/ui/tree/tree.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { defaultCheckboxStyles } from '../../../theme/browser/defaultStyles.js';
import { isDark } from '../../../theme/common/theme.js';
import { escape } from '../../../../base/common/strings.js';
import { IThemeService } from '../../../theme/common/themeService.js';
import { IQuickTreeCheckboxEvent, IQuickTreeItem, IQuickTreeItemButtonEvent } from '../../common/quickInput.js';
import { quickInputButtonToAction } from '../quickInputUtils.js';
import { IQuickTreeFilterData } from './quickInputTree.js';

const $ = dom.$;

export interface IQuickTreeTemplateData {
	entry: HTMLElement;
	checkbox: TriStateCheckbox;
	icon: HTMLElement;
	label: IconLabel;
	actionBar: ActionBar;
	toDisposeElement: DisposableStore;
	toDisposeTemplate: DisposableStore;
}

export class QuickInputCheckboxStateHandler<T> extends Disposable {
	private readonly _onDidChangeCheckboxState = this._register(new Emitter<{ item: T; checked: boolean | 'mixed' }>());
	public readonly onDidChangeCheckboxState = this._onDidChangeCheckboxState.event;

	public setCheckboxState(node: T, checked: boolean | 'mixed') {
		this._onDidChangeCheckboxState.fire({ item: node, checked });
	}
}

export class QuickInputTreeRenderer<T extends IQuickTreeItem> extends Disposable implements ITreeRenderer<T, IQuickTreeFilterData, IQuickTreeTemplateData> {
	static readonly ID = 'quickInputTreeElement';
	templateId = QuickInputTreeRenderer.ID;

	constructor(
		private readonly _hoverDelegate: IHoverDelegate | undefined,
		private readonly _buttonTriggeredEmitter: Emitter<IQuickTreeItemButtonEvent<T>>,
		private readonly onCheckedEvent: Event<IQuickTreeCheckboxEvent<T>>,
		private readonly _checkboxStateHandler: QuickInputCheckboxStateHandler<T>,
		private readonly _toggleStyles: IToggleStyles,
		@IThemeService private readonly _themeService: IThemeService,
	) {
		super();
	}

	renderTemplate(container: HTMLElement): IQuickTreeTemplateData {
		const store = new DisposableStore();

		// Main entry container
		const entry = dom.append(container, $('.quick-input-tree-entry'));

		const checkbox = store.add(new TriStateCheckbox('', false, { ...defaultCheckboxStyles, size: 15 }));
		entry.appendChild(checkbox.domNode);

		const checkboxLabel = dom.append(entry, $('label.quick-input-tree-label'));
		const rows = dom.append(checkboxLabel, $('.quick-input-tree-rows'));
		const row1 = dom.append(rows, $('.quick-input-tree-row'));
		const icon = dom.prepend(row1, $('.quick-input-tree-icon'));
		const label = store.add(new IconLabel(row1, {
			supportHighlights: true,
			supportDescriptionHighlights: true,
			supportIcons: true,
			hoverDelegate: this._hoverDelegate
		}));
		const actionBar = store.add(new ActionBar(entry, {
			actionViewItemProvider: createToggleActionViewItemProvider(this._toggleStyles),
			hoverDelegate: this._hoverDelegate
		}));
		actionBar.domNode.classList.add('quick-input-tree-entry-action-bar');
		return {
			toDisposeTemplate: store,
			entry,
			checkbox,
			icon,
			label,
			actionBar,
			toDisposeElement: new DisposableStore(),
		};
	}

	renderElement(node: ITreeNode<T, IQuickTreeFilterData>, _index: number, templateData: IQuickTreeTemplateData, _details?: ITreeElementRenderDetails): void {
		const store = templateData.toDisposeElement;
		const quickTreeItem = node.element;

		// Checkbox
		if (quickTreeItem.pickable === false) {
			// Hide checkbox for non-pickable items
			templateData.checkbox.domNode.style.display = 'none';
		} else {
			const checkbox = templateData.checkbox;
			checkbox.domNode.style.display = '';
			checkbox.checked = quickTreeItem.checked ?? false;
			store.add(Event.filter(this.onCheckedEvent, e => e.item === quickTreeItem)(e => checkbox.checked = e.checked));
			if (quickTreeItem.disabled) {
				checkbox.disable();
			}
			store.add(checkbox.onChange((e) => this._checkboxStateHandler.setCheckboxState(quickTreeItem, checkbox.checked)));
		}

		// Icon
		if (quickTreeItem.iconPath) {
			const icon = isDark(this._themeService.getColorTheme().type) ? quickTreeItem.iconPath.dark : (quickTreeItem.iconPath.light ?? quickTreeItem.iconPath.dark);
			const iconUrl = URI.revive(icon);
			templateData.icon.className = 'quick-input-tree-icon';
			templateData.icon.style.backgroundImage = cssJs.asCSSUrl(iconUrl);
		} else {
			templateData.icon.style.backgroundImage = '';
			templateData.icon.className = quickTreeItem.iconClass ? `quick-input-tree-icon ${quickTreeItem.iconClass}` : '';
		}

		const { labelHighlights: matches, descriptionHighlights: descriptionMatches } = node.filterData || {};

		// Label and Description
		let descriptionTitle: IManagedHoverTooltipMarkdownString | undefined;
		// NOTE: If we bring back quick tool tips, we need to check that here like we do in the QuickInputListRenderer
		if (quickTreeItem.description) {
			descriptionTitle = {
				markdown: {
					value: escape(quickTreeItem.description),
					supportThemeIcons: true
				},
				markdownNotSupportedFallback: quickTreeItem.description
			};
		}
		templateData.label.setLabel(
			quickTreeItem.label,
			quickTreeItem.description,
			{
				matches,
				descriptionMatches,
				extraClasses: quickTreeItem.iconClasses,
				italic: quickTreeItem.italic,
				strikethrough: quickTreeItem.strikethrough,
				labelEscapeNewLines: true,
				descriptionTitle
			}
		);

		// Action Bar
		const buttons = quickTreeItem.buttons;
		if (buttons && buttons.length) {
			templateData.actionBar.push(buttons.map((button, index) => quickInputButtonToAction(
				button,
				`tree-${index}`,
				() => this._buttonTriggeredEmitter.fire({ item: quickTreeItem, button })
			)), { icon: true, label: false });
			templateData.entry.classList.add('has-actions');
		} else {
			templateData.entry.classList.remove('has-actions');
		}
	}

	disposeElement(_element: ITreeNode<T, IQuickTreeFilterData>, _index: number, templateData: IQuickTreeTemplateData, _details?: ITreeElementRenderDetails): void {
		templateData.toDisposeElement.clear();
		templateData.actionBar.clear();
	}

	disposeTemplate(templateData: IQuickTreeTemplateData): void {
		templateData.toDisposeElement.dispose();
		templateData.toDisposeTemplate.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickInputTreeSorter.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickInputTreeSorter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { IQuickTreeItem } from '../../common/quickInput.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export class QuickInputTreeSorter extends Disposable implements ITreeSorter<IQuickTreeItem> {
	private _sortByLabel: boolean = true;

	get sortByLabel(): boolean {
		return this._sortByLabel;
	}

	set sortByLabel(value: boolean) {
		this._sortByLabel = value;
	}

	compare(a: IQuickTreeItem, b: IQuickTreeItem): number {
		// No-op
		if (!this._sortByLabel) {
			return 0;
		}

		if (a.label < b.label) {
			return -1;
		} else if (a.label > b.label) {
			return 1;
		}
		// use description to break ties
		if (a.description && b.description) {
			if (a.description < b.description) {
				return -1;
			} else if (a.description > b.description) {
				return 1;
			}
		} else if (a.description) {
			return -1;
		} else if (b.description) {
			return 1;
		}
		return 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/browser/tree/quickTree.ts]---
Location: vscode-main/src/vs/platform/quickinput/browser/tree/quickTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { autorun, IReader, observableValue } from '../../../../base/common/observable.js';
import { setTimeout0 } from '../../../../base/common/platform.js';
import { localize } from '../../../../nls.js';
import { IQuickTree, IQuickTreeItem, IQuickTreeItemButtonEvent, QuickInputType, QuickPickFocus } from '../../common/quickInput.js';
import { QuickInput, QuickInputUI, Visibilities } from '../quickInput.js';
import { getParentNodeState } from './quickInputTree.js';

// Contains the API

export class QuickTree<T extends IQuickTreeItem> extends QuickInput implements IQuickTree<T> {
	private static readonly DEFAULT_ARIA_LABEL = localize('quickInputBox.ariaLabel', "Type to narrow down results.");

	readonly type = QuickInputType.QuickTree;

	private readonly _value = observableValue('value', '');
	private readonly _ariaLabel = observableValue<string | undefined>('ariaLabel', undefined);
	private readonly _placeholder = observableValue<string | undefined>('placeholder', undefined);
	private readonly _matchOnDescription = observableValue('matchOnDescription', false);
	private readonly _matchOnLabel = observableValue('matchOnLabel', true);
	private readonly _sortByLabel = observableValue('sortByLabel', true);
	private readonly _activeItems = observableValue<readonly T[]>('activeItems', []);
	private readonly _itemTree = observableValue<ReadonlyArray<T>>('itemTree', []);

	readonly onDidChangeValue = Event.fromObservable(this._value, this._store);
	readonly onDidChangeActive = Event.fromObservable(this._activeItems, this._store);

	private readonly _onDidChangeCheckedLeafItems = this._register(new Emitter<T[]>());
	readonly onDidChangeCheckedLeafItems: Event<T[]> = this._onDidChangeCheckedLeafItems.event;

	private readonly _onDidChangeCheckboxState = this._register(new Emitter<T>());
	readonly onDidChangeCheckboxState: Event<T> = this._onDidChangeCheckboxState.event;

	readonly onDidAccept: Event<void>;

	constructor(ui: QuickInputUI) {
		super(ui);
		this.onDidAccept = ui.onDidAccept;
		this._registerAutoruns();
		this._register(ui.tree.onDidChangeCheckedLeafItems(e => this._onDidChangeCheckedLeafItems.fire(e as T[])));
		this._register(ui.tree.onDidChangeCheckboxState(e => this._onDidChangeCheckboxState.fire(e.item as T)));
		// Sync active items with tree focus changes
		this._register(ui.tree.tree.onDidChangeFocus(e => {
			this._activeItems.set(ui.tree.getActiveItems() as T[], undefined);
		}));
	}

	get value(): string { return this._value.get(); }
	set value(value: string) { this._value.set(value, undefined); }

	get ariaLabel(): string | undefined { return this._ariaLabel.get(); }
	set ariaLabel(ariaLabel: string | undefined) { this._ariaLabel.set(ariaLabel, undefined); }

	get placeholder(): string | undefined { return this._placeholder.get(); }
	set placeholder(placeholder: string | undefined) { this._placeholder.set(placeholder, undefined); }

	get matchOnDescription(): boolean { return this._matchOnDescription.get(); }
	set matchOnDescription(matchOnDescription: boolean) { this._matchOnDescription.set(matchOnDescription, undefined); }

	get matchOnLabel(): boolean { return this._matchOnLabel.get(); }
	set matchOnLabel(matchOnLabel: boolean) { this._matchOnLabel.set(matchOnLabel, undefined); }

	get sortByLabel(): boolean { return this._sortByLabel.get(); }
	set sortByLabel(sortByLabel: boolean) { this._sortByLabel.set(sortByLabel, undefined); }

	get activeItems(): readonly T[] { return this._activeItems.get(); }
	set activeItems(activeItems: readonly T[]) { this._activeItems.set(activeItems, undefined); }

	get itemTree(): ReadonlyArray<Readonly<T>> { return this._itemTree.get(); }

	get onDidTriggerItemButton(): Event<IQuickTreeItemButtonEvent<T>> {
		// Is there a cleaner way to avoid the `as` cast here?
		return this.ui.tree.onDidTriggerButton as Event<IQuickTreeItemButtonEvent<T>>;
	}

	// TODO: Fix the any casting
	// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
	get checkedLeafItems(): readonly T[] { return this.ui.tree.getCheckedLeafItems() as any as readonly T[]; }

	setItemTree(itemTree: T[]): void {
		this._itemTree.set(itemTree, undefined);
	}

	getParent(element: T): T | undefined {
		return this.ui.tree.tree.getParentElement(element) as T ?? undefined;
	}

	setCheckboxState(element: T, checked: boolean | 'mixed'): void {
		this.ui.tree.check(element, checked);
	}
	expand(element: T): void {
		this.ui.tree.tree.expand(element);
	}
	collapse(element: T): void {
		this.ui.tree.tree.collapse(element);
	}
	isCollapsed(element: T): boolean {
		return this.ui.tree.tree.isCollapsed(element);
	}
	focusOnInput(): void {
		this.ui.inputBox.setFocus();
	}

	override show() {
		if (!this.visible) {
			const visibilities: Visibilities = {
				title: !!this.title || !!this.step || !!this.titleButtons.length,
				description: !!this.description,
				checkAll: true,
				checkBox: true,
				inputBox: true,
				progressBar: true,
				visibleCount: true,
				count: true,
				ok: true,
				list: false,
				tree: true,
				message: !!this.validationMessage,
				customButton: false
			};
			this.ui.setVisibilities(visibilities);
			this.visibleDisposables.add(this.ui.inputBox.onDidChange(value => {
				this._value.set(value, undefined);
			}));
			this.visibleDisposables.add(this.ui.tree.onDidChangeCheckboxState((e) => {
				const checkAllState = getParentNodeState([...this.ui.tree.tree.getNode().children]);
				if (this.ui.checkAll.checked !== checkAllState) {
					this.ui.checkAll.checked = checkAllState;
				}
			}));
			this.visibleDisposables.add(this.ui.checkAll.onChange(_e => {
				const checked = this.ui.checkAll.checked;
				this.ui.tree.checkAll(checked);
			}));
			this.visibleDisposables.add(this.ui.tree.onDidChangeCheckedLeafItems(e => {
				this.ui.count.setCount(e.length);
			}));
		}
		super.show(); // TODO: Why have show() bubble up while update() trickles down?

		// Initial state
		// TODO@TylerLeonhardt: Without this setTimeout, the screen reader will not read out
		// the final count of checked items correctly. Investigate a better way
		// to do this. ref https://github.com/microsoft/vscode/issues/258617
		setTimeout0(() => this.ui.count.setCount(this.ui.tree.getCheckedLeafItems().length));
		const checkAllState = getParentNodeState([...this.ui.tree.tree.getNode().children]);
		if (this.ui.checkAll.checked !== checkAllState) {
			this.ui.checkAll.checked = checkAllState;
		}
	}

	protected override update() {
		if (!this.visible) {
			return;
		}

		const visibilities: Visibilities = {
			title: !!this.title || !!this.step || !!this.titleButtons.length,
			description: !!this.description,
			checkAll: true,
			checkBox: true,
			inputBox: true,
			progressBar: true,
			visibleCount: true,
			count: true,
			ok: true,
			tree: true,
			message: !!this.validationMessage
		};
		this.ui.setVisibilities(visibilities);
		super.update();
	}

	_registerListeners(): void {

	}

	// TODO: Move to using autoruns instead of update function
	_registerAutoruns(): void {
		this.registerVisibleAutorun(reader => {
			const value = this._value.read(reader);
			this.ui.inputBox.value = value;
			this.ui.tree.filter(value);
		});
		this.registerVisibleAutorun(reader => {
			let ariaLabel = this._ariaLabel.read(reader);
			if (!ariaLabel) {
				ariaLabel = this.placeholder || QuickTree.DEFAULT_ARIA_LABEL;
				// If we have a title, include it in the aria label.
				if (this.title) {
					ariaLabel += ` - ${this.title}`;
				}
			}
			if (this.ui.list.ariaLabel !== ariaLabel) {
				this.ui.list.ariaLabel = ariaLabel ?? null;
			}
			if (this.ui.inputBox.ariaLabel !== ariaLabel) {
				this.ui.inputBox.ariaLabel = ariaLabel ?? 'input';
			}
		});
		this.registerVisibleAutorun(reader => {
			const placeholder = this._placeholder.read(reader);
			if (this.ui.inputBox.placeholder !== placeholder) {
				this.ui.inputBox.placeholder = placeholder ?? '';
			}
		});
		this.registerVisibleAutorun((reader) => {
			const matchOnLabel = this._matchOnLabel.read(reader);
			const matchOnDescription = this._matchOnDescription.read(reader);
			this.ui.tree.updateFilterOptions({ matchOnLabel, matchOnDescription });
		});
		this.registerVisibleAutorun((reader) => {
			const sortByLabel = this._sortByLabel.read(reader);
			this.ui.tree.sortByLabel = sortByLabel;
		});
		this.registerVisibleAutorun((reader) => {
			const itemTree = this._itemTree.read(reader);
			this.ui.tree.setTreeData(itemTree);
		});
	}

	registerVisibleAutorun(fn: (reader: IReader) => void): void {
		this._register(autorun((reader) => {
			if (this._visible.read(reader)) {
				fn(reader);
			}
		}));
	}

	focus(focus: QuickPickFocus): void {
		this.ui.tree.focus(focus);
		// To allow things like space to check/uncheck items
		this.ui.tree.tree.domFocus();
	}

	/**
	 * Programmatically accepts an item. Used internally for keyboard navigation.
	 * @param inBackground Whether you are accepting an item in the background and keeping the picker open.
	 */
	accept(_inBackground?: boolean): void {
		// No-op for now since we expect only multi-select quick trees which don't need
		// the speed of accept.
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/common/quickAccess.ts]---
Location: vscode-main/src/vs/platform/quickinput/common/quickAccess.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ItemActivation, IQuickNavigateConfiguration, IQuickPick, IQuickPickItem, QuickPickItem, IQuickPickSeparator } from './quickInput.js';
import { Registry } from '../../registry/common/platform.js';

/**
 * Provider specific options for this particular showing of the
 * quick access.
 */
export interface IQuickAccessProviderRunOptions {
	readonly from?: string;
	readonly placeholder?: string;
	/**
	 * A handler to invoke when an item is accepted for
	 * this particular showing of the quick access.
	 * @param item The item that was accepted.
	 */
	readonly handleAccept?: (item: IQuickPickItem, isBackgroundAccept: boolean) => void;
}

/**
 * The specific options for the AnythingQuickAccessProvider. Put here to share between layers.
 */
export interface AnythingQuickAccessProviderRunOptions extends IQuickAccessProviderRunOptions {
	readonly includeHelp?: boolean;
	readonly filter?: (item: IQuickPickItem | IQuickPickSeparator) => boolean;
	/**
	 * @deprecated - temporary for Dynamic Chat Variables (see usage) until it has built-in UX for file picking
	 * Useful for adding items to the top of the list that might contain actions.
	 */
	readonly additionPicks?: QuickPickItem[];
}

export interface IQuickAccessOptions {

	/**
	 * Allows to enable quick navigate support in quick input.
	 */
	readonly quickNavigateConfiguration?: IQuickNavigateConfiguration;

	/**
	 * Allows to configure a different item activation strategy.
	 * By default the first item in the list will get activated.
	 */
	readonly itemActivation?: ItemActivation;

	/**
	 * Whether to take the input value as is and not restore it
	 * from any existing value if quick access is visible.
	 */
	readonly preserveValue?: boolean;

	/**
	 * Provider specific options for this particular showing of the
	 * quick access.
	 */
	readonly providerOptions?: IQuickAccessProviderRunOptions;

	/**
	 * An array of provider prefixes to enable for this
	 * particular showing of the quick access.
	 */
	readonly enabledProviderPrefixes?: string[];

	/**
	 * A placeholder to use for this particular showing of the quick access.
	*/
	readonly placeholder?: string;
}

export interface IQuickAccessController {

	/**
	 * Open the quick access picker with the optional value prefilled.
	 */
	show(value?: string, options?: IQuickAccessOptions): void;

	/**
	 * Same as `show()` but instead of executing the selected pick item,
	 * it will be returned. May return `undefined` in case no item was
	 * picked by the user.
	 */
	pick(value?: string, options?: IQuickAccessOptions): Promise<IQuickPickItem[] | undefined>;
}

export enum DefaultQuickAccessFilterValue {

	/**
	 * Keep the value as it is given to quick access.
	 */
	PRESERVE = 0,

	/**
	 * Use the value that was used last time something was accepted from the picker.
	 */
	LAST = 1
}

export interface IQuickAccessProvider {

	/**
	 * Allows to set a default filter value when the provider opens. This can be:
	 * - `undefined` to not specify any default value
	 * - `DefaultFilterValues.PRESERVE` to use the value that was last typed
	 * - `string` for the actual value to use
	 *
	 * Note: the default filter will only be used if quick access was opened with
	 * the exact prefix of the provider. Otherwise the filter value is preserved.
	 */
	readonly defaultFilterValue?: string | DefaultQuickAccessFilterValue;

	/**
	 * Called whenever a prefix was typed into quick pick that matches the provider.
	 *
	 * @param picker the picker to use for showing provider results. The picker is
	 * automatically shown after the method returns, no need to call `show()`.
	 * @param token providers have to check the cancellation token everytime after
	 * a long running operation or from event handlers because it could be that the
	 * picker has been closed or changed meanwhile. The token can be used to find out
	 * that the picker was closed without picking an entry (e.g. was canceled by the user).
	 * @param options additional configuration specific for this provider that will
	 * influence what picks will be shown.
	 * @return a disposable that will automatically be disposed when the picker
	 * closes or is replaced by another picker.
	 */
	provide(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>, token: CancellationToken, options?: IQuickAccessProviderRunOptions): IDisposable;
}

export interface IQuickAccessProviderHelp {

	/**
	 * The prefix to show for the help entry. If not provided,
	 * the prefix used for registration will be taken.
	 */
	readonly prefix?: string;

	/**
	 * A description text to help understand the intent of the provider.
	 */
	readonly description: string;

	/**
	 * The command to bring up this quick access provider.
	 */
	readonly commandId?: string;

	/**
	 * The order of help entries in the Command Center.
	 * Lower values will be placed above higher values.
	 * No value will hide this help entry from the Command Center.
	 */
	readonly commandCenterOrder?: number;

	/**
	 * An optional label to use for the Command Center entry. If not set
	 * the description will be used instead.
	 */
	readonly commandCenterLabel?: string;
}

export interface IQuickAccessProviderDescriptor {

	/**
	 * The actual provider that will be instantiated as needed.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly ctor: { new(...services: any /* TS BrandedService but no clue how to type this properly */[]): IQuickAccessProvider };

	/**
	 * The prefix for quick access picker to use the provider for.
	 */
	readonly prefix: string;

	/**
	 * A placeholder to use for the input field when the provider is active.
	 * This will also be read out by screen readers and thus helps for
	 * accessibility.
	 */
	readonly placeholder?: string;

	/**
	 * Documentation for the provider in the quick access help.
	 */
	readonly helpEntries: IQuickAccessProviderHelp[];

	/**
	 * A context key that will be set automatically when the
	 * picker for the provider is showing.
	 */
	readonly contextKey?: string;
}

export const Extensions = {
	Quickaccess: 'workbench.contributions.quickaccess'
};

export interface IQuickAccessRegistry {

	/**
	 * Registers a quick access provider to the platform.
	 */
	registerQuickAccessProvider(provider: IQuickAccessProviderDescriptor): IDisposable;

	/**
	 * Get all registered quick access providers.
	 */
	getQuickAccessProviders(): IQuickAccessProviderDescriptor[];

	/**
	 * Get a specific quick access provider for a given prefix.
	 */
	getQuickAccessProvider(prefix: string): IQuickAccessProviderDescriptor | undefined;
}

export class QuickAccessRegistry implements IQuickAccessRegistry {

	private providers: IQuickAccessProviderDescriptor[] = [];
	private defaultProvider: IQuickAccessProviderDescriptor | undefined = undefined;

	registerQuickAccessProvider(provider: IQuickAccessProviderDescriptor): IDisposable {

		// Extract the default provider when no prefix is present
		if (provider.prefix.length === 0) {
			this.defaultProvider = provider;
		} else {
			this.providers.push(provider);
		}

		// sort the providers by decreasing prefix length, such that longer
		// prefixes take priority: 'ext' vs 'ext install' - the latter should win
		this.providers.sort((providerA, providerB) => providerB.prefix.length - providerA.prefix.length);

		return toDisposable(() => {
			this.providers.splice(this.providers.indexOf(provider), 1);

			if (this.defaultProvider === provider) {
				this.defaultProvider = undefined;
			}
		});
	}

	getQuickAccessProviders(): IQuickAccessProviderDescriptor[] {
		return coalesce([this.defaultProvider, ...this.providers]);
	}

	getQuickAccessProvider(prefix: string): IQuickAccessProviderDescriptor | undefined {
		const result = prefix ? (this.providers.find(provider => prefix.startsWith(provider.prefix)) || undefined) : undefined;

		return result || this.defaultProvider;
	}

	clear(): Function {
		const providers = [...this.providers];
		const defaultProvider = this.defaultProvider;

		this.providers = [];
		this.defaultProvider = undefined;

		return () => {
			this.providers = providers;
			this.defaultProvider = defaultProvider;
		};
	}
}

Registry.add(Extensions.Quickaccess, new QuickAccessRegistry());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/common/quickInput.ts]---
Location: vscode-main/src/vs/platform/quickinput/common/quickInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IQuickAccessController } from './quickAccess.js';
import { IMatch } from '../../../base/common/filters.js';
import { IItemAccessor } from '../../../base/common/fuzzyScorer.js';
import { ResolvedKeybinding } from '../../../base/common/keybindings.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';

export interface IQuickItemHighlights {
	label?: IMatch[];
	description?: IMatch[];
}

export interface IQuickPickItemHighlights extends IQuickItemHighlights {
	detail?: IMatch[];
}

export type QuickPickItem = IQuickPickSeparator | IQuickPickItem;

/**
 * Base properties for a quick pick and quick tree item.
 */
export interface IQuickItem {
	id?: string;
	label: string;
	ariaLabel?: string;
	description?: string;
	/**
	 * Whether the item is displayed in italics.
	 */
	italic?: boolean;
	/**
	 * Whether the item is displayed with a strikethrough.
	 */
	strikethrough?: boolean;
	/**
	 * Icon classes to be passed on as `IIconLabelValueOptions`
	 * to the underlying `IconLabel` widget.
	 */
	iconClasses?: readonly string[];
	iconPath?: { dark: URI; light?: URI };
	/**
	 * Icon class to be assigned to the quick item container
	 * directly.
	 */
	iconClass?: string;
	highlights?: IQuickItemHighlights;
	buttons?: readonly IQuickInputButton[];
	/**
	 * Used when we're in multi-select mode. Renders a disabled checkbox.
	 */
	disabled?: boolean;
}

/**
 * Represents a quick pick item used in the quick pick UI.
 */
export interface IQuickPickItem extends IQuickItem {
	/**
	 * The type of the quick pick item. Used to distinguish between 'item' and 'separator'
	 */
	type?: 'item';
	/**
	 * The detail text of the quick pick item. Shown as the second line.
	 */
	detail?: string;
	/**
	 * The tooltip for the quick pick item.
	 */
	tooltip?: string | IMarkdownString;
	highlights?: IQuickPickItemHighlights;
	/**
	 * Allows to show a keybinding next to the item to indicate
	 * how the item can be triggered outside of the picker using
	 * keyboard shortcut.
	 */
	keybinding?: ResolvedKeybinding;
	/**
	 * Whether the item is picked by default when the Quick Pick is shown.
	 */
	picked?: boolean;
	/**
	 * Whether the item is always shown in the Quick Pick regardless of filtering.
	 */
	alwaysShow?: boolean;
	/**
	 * Defaults to true with `IQuickPick.canSelectMany`, can be false to disable picks for a single item
	 */
	pickable?: boolean;
}

export interface IQuickPickSeparator {
	/**
	 * The type of the quick pick item. Used to distinguish between 'item' and 'separator'
	 */
	type: 'separator';
	id?: string;
	label?: string;
	description?: string;
	ariaLabel?: string;
	buttons?: readonly IQuickInputButton[];
	tooltip?: string | IMarkdownString;
}

export interface IKeyMods {
	readonly ctrlCmd: boolean;
	readonly alt: boolean;
}

export const NO_KEY_MODS: IKeyMods = { ctrlCmd: false, alt: false };

export interface IQuickNavigateConfiguration {
	keybindings: readonly ResolvedKeybinding[];
}

export interface IPickOptions<T extends IQuickPickItem> {

	/**
	 * an optional string to show as the title of the quick input
	 */
	title?: string;

	/**
	 * the value to prefill in the input box
	 */
	value?: string;

	/**
	 * an optional string to show as placeholder in the input box to guide the user what she picks on
	 */
	placeHolder?: string;

	/**
	 * the text to display underneath the input box
	 */
	prompt?: string;

	/**
	 * an optional flag to include the description when filtering the picks
	 */
	matchOnDescription?: boolean;

	/**
	 * an optional flag to include the detail when filtering the picks
	 */
	matchOnDetail?: boolean;

	/**
	 * an optional flag to filter the picks based on label. Defaults to true.
	 */
	matchOnLabel?: boolean;

	/**
	 * an optional flag to sort the picks based by the label.
	 */
	sortByLabel?: boolean;

	/**
	 * an optional flag to not close the picker on focus lost
	 */
	ignoreFocusLost?: boolean;

	/**
	 * an optional flag to make this picker multi-select
	 */
	canPickMany?: boolean;

	/**
	 * enables quick navigate in the picker to open an element without typing
	 */
	quickNavigate?: IQuickNavigateConfiguration;

	/**
	 * Hides the input box from the picker UI. This is typically used
	 * in combination with quick-navigation where no search UI should
	 * be presented.
	 */
	hideInput?: boolean;

	/**
	 * a context key to set when this picker is active
	 */
	contextKey?: string;

	/**
	 * an optional property for the item to focus initially.
	 */
	activeItem?: Promise<T> | T;

	onKeyMods?: (keyMods: IKeyMods) => void;
	onDidFocus?: (entry: T) => void;
	onDidTriggerItemButton?: (context: IQuickPickItemButtonContext<T>) => void;
	onDidTriggerSeparatorButton?: (context: IQuickPickSeparatorButtonEvent) => void;
}

export interface IInputOptions {

	/**
	 * an optional string to show as the title of the quick input
	 */
	title?: string;

	/**
	 * the value to prefill in the input box
	 */
	value?: string;

	/**
	 * the selection of value, default to the whole prefilled value
	 */
	valueSelection?: readonly [number, number];

	/**
	 * the text to display underneath the input box
	 */
	prompt?: string;

	/**
	 * an optional string to show as placeholder in the input box to guide the user what to type
	 */
	placeHolder?: string;

	/**
	 * Controls if a password input is shown. Password input hides the typed text.
	 */
	password?: boolean;

	/**
	 * an optional flag to not close the input on focus lost
	 */
	ignoreFocusLost?: boolean;

	/**
	 * an optional function that is used to validate user input.
	 */
	validateInput?: (input: string) => Promise<string | null | undefined | { content: string; severity: Severity }>;
}

export enum QuickInputHideReason {

	/**
	 * Focus moved away from the quick input.
	 */
	Blur = 1,

	/**
	 * An explicit user gesture, e.g. pressing Escape key.
	 */
	Gesture,

	/**
	 * Anything else.
	 */
	Other
}

export interface IQuickInputHideEvent {
	reason: QuickInputHideReason;
}

/**
 * A collection of the different types of QuickInput
 */
export const enum QuickInputType {
	QuickPick = 'quickPick',
	InputBox = 'inputBox',
	QuickWidget = 'quickWidget',
	QuickTree = 'quickTree'
}

/**
 * Represents a quick input control that allows users to make selections or provide input quickly.
 */
export interface IQuickInput extends IDisposable {

	/**
	 * The type of the quick input.
	 */
	readonly type: QuickInputType;

	/**
	 * An event that is fired when the quick input is hidden.
	 */
	readonly onDidHide: Event<IQuickInputHideEvent>;

	/**
	 * An event that is fired when the quick input will be hidden.
	 */
	readonly onWillHide: Event<IQuickInputHideEvent>;

	/**
	 * An event that is fired when the quick input is disposed.
	 */
	readonly onDispose: Event<void>;

	/**
	 * The title of the quick input.
	 */
	title: string | undefined;

	/**
	 * The description of the quick input. This is rendered right below the input box.
	 */
	description: string | undefined;

	/**
	 * An HTML widget rendered below the input.
	 * @deprecated Use an IQuickWidget instead.
	 */
	widget: any | undefined;

	/**
	 * The current step of the quick input rendered in the titlebar.
	 */
	step: number | undefined;

	/**
	 * The total number of steps in the quick input rendered in the titlebar.
	 */
	totalSteps: number | undefined;

	/**
	 * The buttons displayed in the quick input titlebar.
	 */
	buttons: ReadonlyArray<IQuickInputButton>;

	/**
	 * An event that is fired when a button in the quick input is triggered.
	 */
	readonly onDidTriggerButton: Event<IQuickInputButton>;

	/**
	 * Indicates whether the input is enabled.
	 */
	enabled: boolean;

	/**
	 * The context key associated with the quick input.
	 */
	contextKey: string | undefined;

	/**
	 * Indicates whether the quick input is busy. Renders a progress bar if true.
	 */
	busy: boolean;

	/**
	 * Indicates whether the quick input should be hidden when it loses focus.
	 */
	ignoreFocusOut: boolean;

	/**
	 * The toggle buttons to be added to the input box.
	 */
	toggles: IQuickInputToggle[] | undefined;

	/**
	 * Shows the quick input.
	 */
	show(): void;

	/**
	 * Hides the quick input.
	 */
	hide(): void;

	/**
	 * Notifies that the quick input has been hidden.
	 * @param reason The reason why the quick input was hidden.
	 */
	didHide(reason?: QuickInputHideReason): void;

	/**
	 * Notifies that the quick input will be hidden.
	 * @param reason The reason why the quick input will be hidden.
	 */
	willHide(reason?: QuickInputHideReason): void;
}

export interface IQuickWidget extends IQuickInput {

	/**
	 * The type of the quick input.
	 */
	readonly type: QuickInputType.QuickWidget;

	/**
	 * Should be an HTMLElement (TODO: move this entire file into browser)
	 * @override
	 */
	widget: any | undefined;
}

export interface IQuickPickWillAcceptEvent {

	/**
	 * Allows to disable the default accept handling
	 * of the picker. If `veto` is called, the picker
	 * will not trigger the `onDidAccept` event.
	 */
	veto(): void;
}

export interface IQuickPickDidAcceptEvent {

	/**
	 * Signals if the picker item is to be accepted
	 * in the background while keeping the picker open.
	 */
	inBackground: boolean;
}

/**
 * Represents the activation behavior for items in a quick input. This means which item will be
 * "active" (aka focused).
 */
export enum ItemActivation {
	/**
	 * No item will be active.
	 */
	NONE,
	/**
	 * First item will be active.
	 */
	FIRST,
	/**
	 * Second item will be active.
	 */
	SECOND,
	/**
	 * Last item will be active.
	 */
	LAST
}

/**
 * Represents the focus options for a quick pick.
 */
export enum QuickPickFocus {
	/**
	 * Focus the first item in the list.
	 */
	First = 1,
	/**
	 * Focus the second item in the list.
	 */
	Second,
	/**
	 * Focus the last item in the list.
	 */
	Last,
	/**
	 * Focus the next item in the list.
	 */
	Next,
	/**
	 * Focus the previous item in the list.
	 */
	Previous,
	/**
	 * Focus the next page in the list.
	 */
	NextPage,
	/**
	 * Focus the previous page in the list.
	 */
	PreviousPage,
	/**
	 * Focus the first item under the next separator.
	 */
	NextSeparator,
	/**
	 * Focus the first item under the current separator.
	 */
	PreviousSeparator
}

/**
 * Represents a quick pick control that allows the user to select an item from a list of options.
 */
export interface IQuickPick<T extends IQuickPickItem, O extends { useSeparators: boolean } = { useSeparators: false }> extends IQuickInput {

	/**
	 * The type of the quick input.
	 */
	readonly type: QuickInputType.QuickPick;

	/**
	 * The current value of the quick pick input.
	 */
	value: string;

	/**
	 * A method that allows to massage the value used for filtering, e.g, to remove certain parts.
	 * @param value The value to be filtered.
	 * @returns The filtered value.
	 */
	filterValue: (value: string) => string;

	/**
	 * The ARIA label for the quick pick input.
	 */
	ariaLabel: string | undefined;

	/**
	 * The placeholder text for the quick pick input.
	 */
	placeholder: string | undefined;

	/**
	 * Text shown below the quick pick input.
	 */
	prompt: string | undefined;

	/**
	 * An event that is fired when the value of the quick pick input changes.
	 */
	readonly onDidChangeValue: Event<string>;

	/**
	 * An event that is fired when the quick pick is about to accept the selected item.
	 */
	readonly onWillAccept: Event<IQuickPickWillAcceptEvent>;

	/**
	 * An event that is fired when the quick pick has accepted the selected item.
	 */
	readonly onDidAccept: Event<IQuickPickDidAcceptEvent>;

	/**
	 * If enabled, the `onDidAccept` event will be fired when pressing the arrow-right key to accept the selected item without closing the picker.
	 */
	canAcceptInBackground: boolean;

	/**
	 * The OK button state. It can be a boolean value or the string 'default'.
	 */
	ok: boolean | 'default';

	/**
	 * The OK button label.
	 */
	okLabel: string | undefined;

	/**
	 * An event that is fired when the custom button is triggered. The custom button is a button with text rendered to the right of the input.
	 */
	readonly onDidCustom: Event<void>;

	/**
	 * Whether to show the custom button. The custom button is a button with text rendered to the right of the input.
	 */
	customButton: boolean;

	/**
	 * The label for the custom button. The custom button is a button with text rendered to the right of the input.
	 */
	customLabel: string | undefined;

	/**
	 * The hover text for the custom button. The custom button is a button with text rendered to the right of the input.
	 */
	customHover: string | undefined;

	/**
	 * Whether the custom button should be rendered as a secondary button.
	 */
	customButtonSecondary?: boolean;

	/**
	 * An event that is fired when an item button is triggered.
	 */
	readonly onDidTriggerItemButton: Event<IQuickPickItemButtonEvent<T>>;

	/**
	 * An event that is fired when a separator button is triggered.
	 */
	readonly onDidTriggerSeparatorButton: Event<IQuickPickSeparatorButtonEvent>;

	/**
	 * The items to be displayed in the quick pick.
	 */
	items: O extends { useSeparators: true } ? ReadonlyArray<T | IQuickPickSeparator> : ReadonlyArray<T>;

	/**
	 * Whether multiple items can be selected. If so, checkboxes will be rendered.
	 */
	canSelectMany: boolean;

	/**
	 * Whether to match on the description of the items.
	 */
	matchOnDescription: boolean;

	/**
	 * Whether to match on the detail of the items.
	 */
	matchOnDetail: boolean;

	/**
	 * Whether to match on the label of the items.
	 */
	matchOnLabel: boolean;

	/**
	 * The mode to filter the label with. It can be 'fuzzy' or 'contiguous'. Defaults to 'fuzzy'.
	 */
	matchOnLabelMode: 'fuzzy' | 'contiguous';

	/**
	 * Whether to sort the items by label.
	 */
	sortByLabel: boolean;

	/**
	 * Whether to keep the scroll position when the quick pick input is updated.
	 */
	keepScrollPosition: boolean;

	/**
	 * The configuration for quick navigation.
	 */
	quickNavigate: IQuickNavigateConfiguration | undefined;

	/**
	 * The currently active items.
	 */
	activeItems: ReadonlyArray<T>;

	/**
	 * An event that is fired when the active items change.
	 */
	readonly onDidChangeActive: Event<T[]>;

	/**
	 * The item activation behavior for the next time `items` is set. Item activation means which
	 * item is "active" (aka focused) when the quick pick is opened or when `items` is set.
	 */
	itemActivation: ItemActivation;

	/**
	 * The currently selected items.
	 */
	selectedItems: ReadonlyArray<T>;

	/**
	 * An event that is fired when the selected items change.
	 */
	readonly onDidChangeSelection: Event<T[]>;

	/**
	 * The key modifiers.
	 */
	readonly keyMods: IKeyMods;

	/**
	 * The selection range for the value in the input.
	 */
	valueSelection: Readonly<[number, number]> | undefined;

	/**
	 * The validation message for the quick pick. This is rendered below the input.
	 */
	validationMessage: string | undefined;

	/**
	 * The severity of the validation message.
	 */
	severity: Severity;

	/**
	 * Checks if the quick pick input has focus.
	 * @returns `true` if the quick pick input has focus, `false` otherwise.
	 */
	inputHasFocus(): boolean;

	/**
	 * Focuses on the quick pick input.
	 */
	focusOnInput(): void;

	/**
	 * Hides the input box from the picker UI. This is typically used in combination with quick-navigation where no search UI should be presented.
	 */
	hideInput: boolean;

	/**
	 * Controls whether the count for the items should be shown.
	 */
	hideCountBadge: boolean;

	/**
	 * Whether to hide the "Check All" checkbox.
	 */
	hideCheckAll: boolean;

	/**
	 * Focus a particular item in the list. Used internally for keyboard navigation.
	 * @param focus The focus behavior.
	 */
	focus(focus: QuickPickFocus): void;

	/**
	 * Programmatically accepts an item. Used internally for keyboard navigation.
	 * @param inBackground Whether you are accepting an item in the background and keeping the picker open.
	 */
	accept(inBackground?: boolean): void;
}

/**
 * Represents a toggle for quick input.
 */
export interface IQuickInputToggle {
	/**
	 * Event that is fired when the toggle value changes.
	 * The boolean value indicates whether the change was triggered via keyboard.
	 */
	readonly onChange: Event<boolean>;
}

/**
 * Represents an input box in a quick input dialog.
 */
export interface IInputBox extends IQuickInput {

	/**
	 * The type of the quick input.
	 */
	readonly type: QuickInputType.InputBox;

	/**
	 * Value shown in the input box.
	 */
	value: string;

	/**
	 * Provide start and end values to be selected in the input box.
	 */
	valueSelection: Readonly<[number, number]> | undefined;

	/**
	 * Value shown as example for input.
	 */
	placeholder: string | undefined;

	/**
	 * Determines if the input value should be hidden while typing.
	 */
	password: boolean;

	/**
	 * Event called when the input value changes.
	 */
	readonly onDidChangeValue: Event<string>;

	/**
	 * Event called when the user submits the input.
	 */
	readonly onDidAccept: Event<void>;

	/**
	 * Text show below the input box.
	 */
	prompt: string | undefined;

	/**
	 * An optional validation message indicating a problem with the current input value.
	 * Returning undefined clears the validation message.
	 */
	validationMessage: string | undefined;

	/**
	 * Severity of the input validation message.
	 */
	severity: Severity;

	/**
	 * Programmatically accepts an item. Used internally for keyboard navigation.
	 */
	accept(): void;
}

export enum QuickInputButtonLocation {
	/**
	 * In the title bar.
	 */
	Title = 1,

	/**
	 * To the right of the input box.
	 */
	Inline = 2,

	/**
	 * At the far end inside the input box.
	 * Used by the public API to create toggles.
	 */
	Input = 3,
}

/**
 * Represents a button in the quick input UI.
 */
export interface IQuickInputButton {
	/**
	 * The path to the icon for the button.
	 * Either `iconPath` or `iconClass` is required.
	 */
	iconPath?: { dark: URI; light?: URI };
	/**
	 * The CSS class for the icon of the button.
	 * Either `iconPath` or `iconClass` is required.
	 */
	iconClass?: string;
	/**
	 * The tooltip text for the button.
	 */
	tooltip?: string;
	/**
	 * Whether to always show the button.
	 * By default, buttons are only visible when hovering over them with the mouse.
	 */
	alwaysVisible?: boolean;
	/**
	 * Where the button should be rendered. The default is {@link QuickInputButtonLocation.Title}.
	 * @note This property is ignored if the button was added to a QuickPickItem.
	 */
	location?: QuickInputButtonLocation;
	/**
	 * When present, indicates that the button is a toggle button that can be checked or unchecked.
	 * The `checked` property indicates the current state of the toggle and will be updated
	 * when the button is clicked.
	 */
	readonly toggle?: { checked: boolean };
}

/**
 * Represents an event that occurs when a button associated with a quick pick item is clicked.
 * @template T - The type of the quick pick item.
 */
export interface IQuickPickItemButtonEvent<T extends IQuickPickItem> {
	/**
	 * The button that was clicked.
	 */
	button: IQuickInputButton;
	/**
	 * The quick pick item associated with the button.
	 */
	item: T;
}

/**
 * Represents an event that occurs when a separator button is clicked in a quick pick.
 */
export interface IQuickPickSeparatorButtonEvent {
	/**
	 * The button that was clicked.
	 */
	button: IQuickInputButton;
	/**
	 * The separator associated with the button.
	 */
	separator: IQuickPickSeparator;
}

/**
 * Represents a context for a button associated with a quick pick item.
 * @template T - The type of the quick pick item.
 */
export interface IQuickPickItemButtonContext<T extends IQuickPickItem> extends IQuickPickItemButtonEvent<T> {
	/**
	 * Removes the associated item from the quick pick.
	 */
	removeItem(): void;
}

export type QuickPickInput<T = IQuickPickItem> = T | IQuickPickSeparator;


//#region Fuzzy Scorer Support

export type IQuickPickItemWithResource = IQuickPickItem & { resource?: URI };

export class QuickPickItemScorerAccessor implements IItemAccessor<IQuickPickItemWithResource> {

	constructor(private options?: { skipDescription?: boolean; skipPath?: boolean }) { }

	getItemLabel(entry: IQuickPickItemWithResource): string {
		return entry.label;
	}

	getItemDescription(entry: IQuickPickItemWithResource): string | undefined {
		if (this.options?.skipDescription) {
			return undefined;
		}

		return entry.description;
	}

	getItemPath(entry: IQuickPickItemWithResource): string | undefined {
		if (this.options?.skipPath) {
			return undefined;
		}

		if (entry.resource?.scheme === Schemas.file) {
			return entry.resource.fsPath;
		}

		return entry.resource?.path;
	}
}

export const quickPickItemScorerAccessor = new QuickPickItemScorerAccessor();

//#endregion

export const IQuickInputService = createDecorator<IQuickInputService>('quickInputService');

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IQuickInputService {

	readonly _serviceBrand: undefined;

	/**
	 * Provides access to the back button in quick input.
	 */
	readonly backButton: IQuickInputButton;

	/**
	 * Provides access to the quick access providers.
	 */
	readonly quickAccess: IQuickAccessController;

	/**
	 * Allows to register on the event that quick input is showing.
	 */
	readonly onShow: Event<void>;

	/**
	 * Allows to register on the event that quick input is hiding.
	 */
	readonly onHide: Event<void>;

	/**
	 * Opens the quick input box for selecting items and returns a promise
	 * with the user selected item(s) if any.
	 */
	pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: true }, token?: CancellationToken): Promise<T[] | undefined>;
	pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: IPickOptions<T> & { canPickMany: false }, token?: CancellationToken): Promise<T | undefined>;
	pick<T extends IQuickPickItem>(picks: Promise<QuickPickInput<T>[]> | QuickPickInput<T>[], options?: Omit<IPickOptions<T>, 'canPickMany'>, token?: CancellationToken): Promise<T | undefined>;

	/**
	 * Opens the quick input box for text input and returns a promise with the user typed value if any.
	 */
	input(options?: IInputOptions, token?: CancellationToken): Promise<string | undefined>;

	/**
	 * Provides raw access to the quick pick controller.
	 */
	createQuickPick<T extends IQuickPickItem>(options: { useSeparators: true }): IQuickPick<T, { useSeparators: true }>;
	createQuickPick<T extends IQuickPickItem>(options?: { useSeparators: boolean }): IQuickPick<T, { useSeparators: false }>;

	/**
	 * Provides raw access to the input box controller.
	 */
	createInputBox(): IInputBox;

	/**
	 * Provides raw access to the quick widget controller.
	 */
	createQuickWidget(): IQuickWidget;

	/**
	 * Provides raw access to the quick tree controller.
	 * @template T The type of items in the quick tree.
	 */
	createQuickTree<T extends IQuickTreeItem>(): IQuickTree<T>;

	/**
	 * Moves focus into quick input.
	 */
	focus(): void;

	/**
	 * Toggle the checked state of the selected item.
	 */
	toggle(): void;

	/**
	 * Navigate inside the opened quick input list.
	 */
	navigate(next: boolean, quickNavigate?: IQuickNavigateConfiguration): void;

	/**
	 * Navigate back in a multi-step quick input.
	 */
	back(): Promise<void>;

	/**
	 * Accept the selected item.
	 *
	 * @param keyMods allows to override the state of key
	 * modifiers that should be present when invoking.
	 */
	accept(keyMods?: IKeyMods): Promise<void>;

	/**
	 * Cancels quick input and closes it.
	 */
	cancel(reason?: QuickInputHideReason): Promise<void>;

	/**
	 * Toggles hover for the current quick input item
	 */
	toggleHover(): void;

	/**
	 * The current quick pick that is visible. Undefined if none is open.
	 */
	currentQuickInput: IQuickInput | undefined;

	/**
	 * Set the alignment of the quick input.
	 * @param alignment either a preset or a custom alignment
	 */
	setAlignment(alignment: 'top' | 'center' | { top: number; left: number }): void;
}

//#region Quick Tree

/**
 * Represents a quick tree control that displays hierarchical data with checkboxes.
 */
export interface IQuickTree<T extends IQuickTreeItem> extends IQuickInput {

	/**
	 * The type of the quick input.
	 */
	readonly type: QuickInputType.QuickTree;

	/**
	 * The current value of the quick tree filter input.
	 */
	value: string;

	/**
	 * The ARIA label for the quick tree input.
	 */
	ariaLabel: string | undefined;

	/**
	 * The placeholder text for the quick tree filter input.
	 */
	placeholder: string | undefined;

	/**
	 * An event that is fired when the filter value changes.
	 */
	readonly onDidChangeValue: Event<string>;

	/**
	 * An event that is fired when the quick tree has accepted the selected items.
	 */
	readonly onDidAccept: Event<void>;

	/**
	 * Whether to match on the description of the items.
	 */
	matchOnDescription: boolean;

	/**
	 * Whether to match on the label of the items.
	 */
	matchOnLabel: boolean;

	/**
	 * Whether to sort the items by label. Defaults to true.
	 */
	sortByLabel: boolean;

	/**
	 * The currently active items.
	 */
	activeItems: ReadonlyArray<T>;

	/**
	 * The validation message for the quick pick. This is rendered below the input.
	 */
	validationMessage: string | undefined;

	/**
	 * The severity of the validation message.
	 */
	severity: Severity;

	/**
	 * The items currently displayed in the quick tree.
	 * @note modifications to this array directly will not cause updates.
	 */
	readonly itemTree: ReadonlyArray<Readonly<T>>;

	/**
	 * The currently selected leaf items.
	 */
	readonly checkedLeafItems: ReadonlyArray<T>;

	/**
	 * Get the parent element of the element passed in
	 * @param element
	 */
	getParent(element: T): T | undefined;

	/**
	 * An event that is fired when the active items change.
	 */
	readonly onDidChangeActive: Event<ReadonlyArray<T>>;

	/**
	 * An event that is fired when the selected items change.
	 */
	readonly onDidChangeCheckedLeafItems: Event<ReadonlyArray<T>>;

	/**
	 * An event that is fired when the checkbox state of an item changes.
	 */
	readonly onDidChangeCheckboxState: Event<T>;

	/**
	 * An event that is fired when an item button is triggered.
	 */
	readonly onDidTriggerItemButton: Event<IQuickTreeItemButtonEvent<T>>;

	/**
	 * Sets the items to be displayed in the quick tree.
	 * @param itemTree The items to display.
	 */
	setItemTree(itemTree: T[]): void;

	/**
	 * Sets the checkbox state of an item.
	 * @param element The item to update.
	 * @param checked The new checkbox state.
	 */
	setCheckboxState(element: T, checked: boolean | 'mixed'): void;

	/**
	 * Expands an item.
	 * @param element The item to expand.
	 */
	expand(element: T): void;

	/**
	 * Collapses an item.
	 * @param element The item to collapse.
	 */
	collapse(element: T): void;

	/**
	 * Checks if an item is collapsed.
	 * @param element The item to check.
	 * @returns True if the item is collapsed.
	 */
	isCollapsed(element: T): boolean;

	/**
	 * Focuses on the tree input.
	 */
	focusOnInput(): void;

	/**
	 * Focus a particular item in the list. Used internally for keyboard navigation.
	 * @param focus The focus behavior.
	 */
	focus(focus: QuickPickFocus): void;

	/**
	 * Programmatically accepts an item. Used internally for keyboard navigation.
	 * @param inBackground Whether you are accepting an item in the background and keeping the picker open.
	 */
	accept(inBackground?: boolean): void;
}

/**
 * Represents a tree item in the quick tree.
 */
export interface IQuickTreeItem extends IQuickItem {
	/**
	 * The checked state of the item. Can be true, false, or 'mixed' for tri-state.
	 * When canSelectMany is false, this is ignored and the item is treated as a single selection.
	 * When canSelectMany is true, this indicates the checkbox state of the item.
	 * If undefined, the item is unchecked by default.
	 */
	checked?: boolean | 'mixed';

	/**
	 * The collapsible state of the tree item. Defaults to 'Expanded' if children are present.
	 */
	collapsed?: boolean;

	/**
	 * The children of this tree item.
	 */
	children?: readonly IQuickTreeItem[];

	/**
	 * Defaults to true, can be false to disable picks for a single item.
	 * When false, the item is not selectable and does not respond to mouse/keyboard activation.
	 */
	pickable?: boolean;
}

/**
 * Represents an event that occurs when the checkbox state of a tree item changes.
 * @template T - The type of the tree item.
 */
export interface IQuickTreeCheckboxEvent<T extends IQuickTreeItem> {
	/**
	 * The tree item whose checkbox state changed.
	 */
	item: T;

	/**
	 * The new checked state.
	 */
	checked: boolean | 'mixed';
}

/**
 * Represents an event that occurs when a button associated with a quick tree item is clicked.
 * @template T - The type of the quick tree item.
 */
export interface IQuickTreeItemButtonEvent<T extends IQuickTreeItem> {
	/**
	 * The button that was clicked.
	 */
	button: IQuickInputButton;
	/**
	 * The quick tree item associated with the button.
	 */
	item: T;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/test/browser/quickinput.test.ts]---
Location: vscode-main/src/vs/platform/quickinput/test/browser/quickinput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { unthemedInboxStyles } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { unthemedButtonStyles } from '../../../../base/browser/ui/button/button.js';
import { unthemedListStyles } from '../../../../base/browser/ui/list/listWidget.js';
import { unthemedToggleStyles } from '../../../../base/browser/ui/toggle/toggle.js';
import { Event } from '../../../../base/common/event.js';
import { raceTimeout } from '../../../../base/common/async.js';
import { unthemedCountStyles } from '../../../../base/browser/ui/countBadge/countBadge.js';
import { unthemedKeybindingLabelOptions } from '../../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { unthemedProgressBarOptions } from '../../../../base/browser/ui/progressbar/progressbar.js';
import { QuickInputController } from '../../browser/quickInputController.js';
import { TestThemeService } from '../../../theme/test/common/testThemeService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { toDisposable } from '../../../../base/common/lifecycle.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { QuickPick } from '../../browser/quickInput.js';
import { IQuickPickItem, ItemActivation } from '../../common/quickInput.js';
import { TestInstantiationService } from '../../../instantiation/test/common/instantiationServiceMock.js';
import { IThemeService } from '../../../theme/common/themeService.js';
import { IConfigurationService } from '../../../configuration/common/configuration.js';
import { TestConfigurationService } from '../../../configuration/test/common/testConfigurationService.js';
import { ILayoutService } from '../../../layout/browser/layoutService.js';
import { IContextViewService } from '../../../contextview/browser/contextView.js';
import { IListService, ListService } from '../../../list/browser/listService.js';
import { IContextKeyService } from '../../../contextkey/common/contextkey.js';
import { ContextKeyService } from '../../../contextkey/browser/contextKeyService.js';
import { NoMatchingKb } from '../../../keybinding/common/keybindingResolver.js';
import { IKeybindingService } from '../../../keybinding/common/keybinding.js';
import { ContextViewService } from '../../../contextview/browser/contextViewService.js';
import { IAccessibilityService } from '../../../accessibility/common/accessibility.js';
import { TestAccessibilityService } from '../../../accessibility/test/common/testAccessibilityService.js';

// Sets up an `onShow` listener to allow us to wait until the quick pick is shown (useful when triggering an `accept()` right after launching a quick pick)
// kick this off before you launch the picker and then await the promise returned after you launch the picker.
async function setupWaitTilShownListener(controller: QuickInputController): Promise<void> {
	const result = await raceTimeout(new Promise<boolean>(resolve => {
		const event = controller.onShow(_ => {
			event.dispose();
			resolve(true);
		});
	}), 2000);

	if (!result) {
		throw new Error('Cancelled');
	}
}

suite('QuickInput', () => { // https://github.com/microsoft/vscode/issues/147543
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let controller: QuickInputController;

	setup(() => {
		const fixture = document.createElement('div');
		mainWindow.document.body.appendChild(fixture);
		store.add(toDisposable(() => fixture.remove()));

		const instantiationService = new TestInstantiationService();

		// Stub the services the quick input controller needs to function
		instantiationService.stub(IThemeService, new TestThemeService());
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IAccessibilityService, new TestAccessibilityService());
		instantiationService.stub(IListService, store.add(new ListService()));
		// eslint-disable-next-line local/code-no-any-casts
		instantiationService.stub(ILayoutService, { activeContainer: fixture, onDidLayoutContainer: Event.None } as any);
		instantiationService.stub(IContextViewService, store.add(instantiationService.createInstance(ContextViewService)));
		instantiationService.stub(IContextKeyService, store.add(instantiationService.createInstance(ContextKeyService)));
		instantiationService.stub(IKeybindingService, {
			mightProducePrintableCharacter() { return false; },
			softDispatch() { return NoMatchingKb; },
		});

		controller = store.add(instantiationService.createInstance(
			QuickInputController,
			{
				container: fixture,
				idPrefix: 'testQuickInput',
				ignoreFocusOut() { return true; },
				returnFocus() { },
				backKeybindingLabel() { return undefined; },
				setContextKey() { return undefined; },
				linkOpenerDelegate(content) { },
				hoverDelegate: {
					showHover(options, focus) {
						return undefined;
					},
					delay: 200
				},
				styles: {
					button: unthemedButtonStyles,
					countBadge: unthemedCountStyles,
					inputBox: unthemedInboxStyles,
					toggle: unthemedToggleStyles,
					keybindingLabel: unthemedKeybindingLabelOptions,
					list: unthemedListStyles,
					progressBar: unthemedProgressBarOptions,
					widget: {
						quickInputBackground: undefined,
						quickInputForeground: undefined,
						quickInputTitleBackground: undefined,
						widgetBorder: undefined,
						widgetShadow: undefined,
					},
					pickerGroup: {
						pickerGroupBorder: undefined,
						pickerGroupForeground: undefined,
					}
				}
			}
		));

		// initial layout
		controller.layout({ height: 20, width: 40 }, 0);
	});

	test('pick - basecase', async () => {
		const item = { label: 'foo' };

		const wait = setupWaitTilShownListener(controller);
		const pickPromise = controller.pick([item, { label: 'bar' }]);
		await wait;

		controller.accept();
		const pick = await raceTimeout(pickPromise, 2000);

		assert.strictEqual(pick, item);
	});

	test('pick - activeItem is honored', async () => {
		const item = { label: 'foo' };

		const wait = setupWaitTilShownListener(controller);
		const pickPromise = controller.pick([{ label: 'bar' }, item], { activeItem: item });
		await wait;

		controller.accept();
		const pick = await pickPromise;

		assert.strictEqual(pick, item);
	});

	test('input - basecase', async () => {
		const wait = setupWaitTilShownListener(controller);
		const inputPromise = controller.input({ value: 'foo' });
		await wait;

		controller.accept();
		const value = await raceTimeout(inputPromise, 2000);

		assert.strictEqual(value, 'foo');
	});

	test('onDidChangeValue - gets triggered when .value is set', async () => {
		const quickpick = store.add(controller.createQuickPick());

		let value: string | undefined = undefined;
		store.add(quickpick.onDidChangeValue((e) => value = e));

		// Trigger a change
		quickpick.value = 'changed';

		try {
			assert.strictEqual(value, quickpick.value);
		} finally {
			quickpick.dispose();
		}
	});

	test('keepScrollPosition - works with activeItems', async () => {
		const quickpick = store.add(controller.createQuickPick() as QuickPick<IQuickPickItem>);

		const items = [];
		for (let i = 0; i < 1000; i++) {
			items.push({ label: `item ${i}` });
		}
		quickpick.items = items;
		// setting the active item should cause the quick pick to scroll to the bottom
		quickpick.activeItems = [items[items.length - 1]];
		quickpick.show();

		const cursorTop = quickpick.scrollTop;

		assert.notStrictEqual(cursorTop, 0);

		quickpick.keepScrollPosition = true;
		quickpick.activeItems = [items[0]];
		assert.strictEqual(cursorTop, quickpick.scrollTop);

		quickpick.keepScrollPosition = false;
		quickpick.activeItems = [items[0]];
		assert.strictEqual(quickpick.scrollTop, 0);
	});

	test('keepScrollPosition - works with items', async () => {
		const quickpick = store.add(controller.createQuickPick() as QuickPick<IQuickPickItem>);

		const items = [];
		for (let i = 0; i < 1000; i++) {
			items.push({ label: `item ${i}` });
		}
		quickpick.items = items;
		// setting the active item should cause the quick pick to scroll to the bottom
		quickpick.activeItems = [items[items.length - 1]];
		quickpick.show();

		const cursorTop = quickpick.scrollTop;
		assert.notStrictEqual(cursorTop, 0);

		quickpick.keepScrollPosition = true;
		quickpick.items = items;
		assert.strictEqual(cursorTop, quickpick.scrollTop);

		quickpick.keepScrollPosition = false;
		quickpick.items = items;
		assert.strictEqual(quickpick.scrollTop, 0);
	});

	test('selectedItems - verify previous selectedItems does not hang over to next set of items', async () => {
		const quickpick = store.add(controller.createQuickPick());
		quickpick.items = [{ label: 'step 1' }];
		quickpick.show();

		void (await new Promise<void>(resolve => {
			store.add(quickpick.onDidAccept(() => {
				quickpick.canSelectMany = true;
				quickpick.items = [{ label: 'a' }, { label: 'b' }, { label: 'c' }];
				resolve();
			}));

			// accept 'step 1'
			controller.accept();
		}));

		// accept in multi-select
		controller.accept();

		// Since we don't select any items, the selected items should be empty
		assert.strictEqual(quickpick.selectedItems.length, 0);
	});

	test('activeItems - verify onDidChangeActive is triggered after setting items', async () => {
		const quickpick = store.add(controller.createQuickPick());

		// Setup listener for verification
		const activeItemsFromEvent: IQuickPickItem[] = [];
		store.add(quickpick.onDidChangeActive(items => activeItemsFromEvent.push(...items)));

		quickpick.show();

		const item = { label: 'step 1' };
		quickpick.items = [item];

		assert.strictEqual(activeItemsFromEvent.length, 1);
		assert.strictEqual(activeItemsFromEvent[0], item);
		assert.strictEqual(quickpick.activeItems.length, 1);
		assert.strictEqual(quickpick.activeItems[0], item);
	});

	test('activeItems - verify setting itemActivation to None still triggers onDidChangeActive after selection #207832', async () => {
		const quickpick = store.add(controller.createQuickPick());
		const item = { label: 'step 1' };
		quickpick.items = [item];
		quickpick.show();
		assert.strictEqual(quickpick.activeItems[0], item);

		// Setup listener for verification
		const activeItemsFromEvent: IQuickPickItem[] = [];
		store.add(quickpick.onDidChangeActive(items => activeItemsFromEvent.push(...items)));

		// Trigger a change
		quickpick.itemActivation = ItemActivation.NONE;
		quickpick.items = [item];

		assert.strictEqual(activeItemsFromEvent.length, 0);
		assert.strictEqual(quickpick.activeItems.length, 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/quickinput/test/browser/tree/quickInputTreeSorter.test.ts]---
Location: vscode-main/src/vs/platform/quickinput/test/browser/tree/quickInputTreeSorter.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { QuickInputTreeSorter } from '../../../browser/tree/quickInputTreeSorter.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IQuickTreeItem } from '../../../common/quickInput.js';

suite('QuickInputTreeSorter', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('sortByLabel property defaults to true', () => {
		const sorter = store.add(new QuickInputTreeSorter());
		assert.strictEqual(sorter.sortByLabel, true);
	});

	test('sortByLabel property can be set to false', () => {
		const sorter = store.add(new QuickInputTreeSorter());
		sorter.sortByLabel = false;
		assert.strictEqual(sorter.sortByLabel, false);
	});

	test('compare returns 0 when sortByLabel is false', () => {
		const sorter = store.add(new QuickInputTreeSorter());
		sorter.sortByLabel = false;

		const item1: IQuickTreeItem = { label: 'a' };
		const item2: IQuickTreeItem = { label: 'b' };

		assert.strictEqual(sorter.compare(item1, item2), 0);
		assert.strictEqual(sorter.compare(item2, item1), 0);
		assert.strictEqual(sorter.compare(item1, item1), 0);
	});

	test('compare sorts by label alphabetically', () => {
		const sorter = store.add(new QuickInputTreeSorter());

		const item1: IQuickTreeItem = { label: 'a' };
		const item2: IQuickTreeItem = { label: 'b' };
		const item3: IQuickTreeItem = { label: 'c' };

		assert.strictEqual(sorter.compare(item1, item2), -1);
		assert.strictEqual(sorter.compare(item2, item1), 1);
		assert.strictEqual(sorter.compare(item1, item1), 0);
		assert.strictEqual(sorter.compare(item2, item3), -1);
		assert.strictEqual(sorter.compare(item3, item2), 1);
	});

	test('compare sorts by description when labels are equal', () => {
		const sorter = store.add(new QuickInputTreeSorter());

		const item1: IQuickTreeItem = { label: 'a', description: 'x' };
		const item2: IQuickTreeItem = { label: 'a', description: 'y' };
		const item3: IQuickTreeItem = { label: 'a', description: 'z' };
		const item4: IQuickTreeItem = { label: 'a' };

		assert.strictEqual(sorter.compare(item1, item2), -1);
		assert.strictEqual(sorter.compare(item2, item1), 1);
		assert.strictEqual(sorter.compare(item2, item3), -1);
		assert.strictEqual(sorter.compare(item3, item2), 1);
		assert.strictEqual(sorter.compare(item1, item4), -1);
		assert.strictEqual(sorter.compare(item4, item1), 1);
		assert.strictEqual(sorter.compare(item4, item4), 0);
	});

	test('compare handles items with no description', () => {
		const sorter = store.add(new QuickInputTreeSorter());

		const item1: IQuickTreeItem = { label: 'a', description: 'desc' };
		const item2: IQuickTreeItem = { label: 'b' };

		assert.strictEqual(sorter.compare(item1, item2), -1);
		assert.strictEqual(sorter.compare(item2, item1), 1);
	});

	test('compare handles empty labels', () => {
		const sorter = store.add(new QuickInputTreeSorter());

		const item1: IQuickTreeItem = { label: '' };
		const item2: IQuickTreeItem = { label: 'a' };
		const item3: IQuickTreeItem = { label: '' };

		assert.strictEqual(sorter.compare(item1, item2), -1);
		assert.strictEqual(sorter.compare(item2, item1), 1);
		assert.strictEqual(sorter.compare(item1, item3), 0);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/registry/common/platform.ts]---
Location: vscode-main/src/vs/platform/registry/common/platform.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Assert from '../../../base/common/assert.js';
import * as Types from '../../../base/common/types.js';

export interface IRegistry {

	/**
	 * Adds the extension functions and properties defined by data to the
	 * platform. The provided id must be unique.
	 * @param id a unique identifier
	 * @param data a contribution
	 */
	add(id: string, data: any): void;

	/**
	 * Returns true iff there is an extension with the provided id.
	 * @param id an extension identifier
	 */
	knows(id: string): boolean;

	/**
	 * Returns the extension functions and properties defined by the specified key or null.
	 * @param id an extension identifier
	 */
	as<T>(id: string): T;
}

class RegistryImpl implements IRegistry {

	private readonly data = new Map<string, any>();

	public add(id: string, data: any): void {
		Assert.ok(Types.isString(id));
		Assert.ok(Types.isObject(data));
		Assert.ok(!this.data.has(id), 'There is already an extension with this id');

		this.data.set(id, data);
	}

	public knows(id: string): boolean {
		return this.data.has(id);
	}

	public as(id: string): any {
		return this.data.get(id) || null;
	}

	public dispose() {
		this.data.forEach((value) => {
			if (Types.isFunction(value.dispose)) {
				value.dispose();
			}
		});
		this.data.clear();
	}

}

export const Registry: IRegistry = new RegistryImpl();
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/registry/test/common/platform.test.ts]---
Location: vscode-main/src/vs/platform/registry/test/common/platform.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { isFunction } from '../../../../base/common/types.js';
import { Registry } from '../../common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

suite('Platform / Registry', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('registry - api', function () {
		assert.ok(isFunction(Registry.add));
		assert.ok(isFunction(Registry.as));
		assert.ok(isFunction(Registry.knows));
	});

	test('registry - mixin', function () {

		Registry.add('foo', { bar: true });

		assert.ok(Registry.knows('foo'));
		assert.ok(Registry.as<any>('foo').bar);
		assert.strictEqual(Registry.as<any>('foo').bar, true);
	});

	test('registry - knows, as', function () {

		const ext = {};

		Registry.add('knows,as', ext);

		assert.ok(Registry.knows('knows,as'));
		assert.ok(!Registry.knows('knows,as1234'));

		assert.ok(Registry.as('knows,as') === ext);
		assert.ok(Registry.as('knows,as1234') === null);
	});

	test('registry - mixin, fails on duplicate ids', function () {

		Registry.add('foo-dup', { bar: true });

		try {
			Registry.add('foo-dup', { bar: false });
			assert.ok(false);
		} catch (e) {
			assert.ok(true);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/browser/browserSocketFactory.ts]---
Location: vscode-main/src/vs/platform/remote/browser/browserSocketFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../base/browser/dom.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ISocket, SocketCloseEvent, SocketCloseEventType, SocketDiagnostics, SocketDiagnosticsEventType } from '../../../base/parts/ipc/common/ipc.net.js';
import { ISocketFactory } from '../common/remoteSocketFactoryService.js';
import { RemoteAuthorityResolverError, RemoteAuthorityResolverErrorCode, RemoteConnectionType, WebSocketRemoteConnection } from '../common/remoteAuthorityResolver.js';
import { mainWindow } from '../../../base/browser/window.js';

export interface IWebSocketFactory {
	create(url: string, debugLabel: string): IWebSocket;
}

export interface IWebSocketCloseEvent {
	/**
	 * Returns the WebSocket connection close code provided by the server.
	 */
	readonly code: number;
	/**
	 * Returns the WebSocket connection close reason provided by the server.
	 */
	readonly reason: string;
	/**
	 * Returns true if the connection closed cleanly; false otherwise.
	 */
	readonly wasClean: boolean;
	/**
	 * Underlying event.
	 */
	readonly event: unknown | undefined;
}

export interface IWebSocket {
	readonly onData: Event<ArrayBuffer>;
	readonly onOpen: Event<void>;
	readonly onClose: Event<IWebSocketCloseEvent | void>;
	readonly onError: Event<unknown>;

	traceSocketEvent?(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | unknown): void;
	send(data: ArrayBuffer | ArrayBufferView): void;
	close(): void;
}

class BrowserWebSocket extends Disposable implements IWebSocket {

	private readonly _onData = new Emitter<ArrayBuffer>();
	public readonly onData = this._onData.event;

	private readonly _onOpen = this._register(new Emitter<void>());
	public readonly onOpen = this._onOpen.event;

	private readonly _onClose = this._register(new Emitter<IWebSocketCloseEvent>());
	public readonly onClose = this._onClose.event;

	private readonly _onError = this._register(new Emitter<unknown>());
	public readonly onError = this._onError.event;

	private readonly _debugLabel: string;
	private readonly _socket: WebSocket;
	private readonly _fileReader: FileReader;
	private readonly _queue: Blob[];
	private _isReading: boolean;
	private _isClosed: boolean;

	private readonly _socketMessageListener: (ev: MessageEvent) => void;

	public traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | any): void {
		SocketDiagnostics.traceSocketEvent(this._socket, this._debugLabel, type, data);
	}

	constructor(url: string, debugLabel: string) {
		super();
		this._debugLabel = debugLabel;
		this._socket = new WebSocket(url);
		this.traceSocketEvent(SocketDiagnosticsEventType.Created, { type: 'BrowserWebSocket', url });
		this._fileReader = new FileReader();
		this._queue = [];
		this._isReading = false;
		this._isClosed = false;

		this._fileReader.onload = (event) => {
			this._isReading = false;
			// eslint-disable-next-line local/code-no-any-casts
			const buff = <ArrayBuffer>(<any>event.target).result;

			this.traceSocketEvent(SocketDiagnosticsEventType.Read, buff);
			this._onData.fire(buff);

			if (this._queue.length > 0) {
				enqueue(this._queue.shift()!);
			}
		};

		const enqueue = (blob: Blob) => {
			if (this._isReading) {
				this._queue.push(blob);
				return;
			}
			this._isReading = true;
			this._fileReader.readAsArrayBuffer(blob);
		};

		this._socketMessageListener = (ev: MessageEvent) => {
			const blob = (<Blob>ev.data);
			this.traceSocketEvent(SocketDiagnosticsEventType.BrowserWebSocketBlobReceived, { type: blob.type, size: blob.size });
			enqueue(blob);
		};
		this._socket.addEventListener('message', this._socketMessageListener);

		this._register(dom.addDisposableListener(this._socket, 'open', (e) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Open);
			this._onOpen.fire();
		}));

		// WebSockets emit error events that do not contain any real information
		// Our only chance of getting to the root cause of an error is to
		// listen to the close event which gives out some real information:
		// - https://www.w3.org/TR/websockets/#closeevent
		// - https://tools.ietf.org/html/rfc6455#section-11.7
		//
		// But the error event is emitted before the close event, so we therefore
		// delay the error event processing in the hope of receiving a close event
		// with more information

		let pendingErrorEvent: unknown | null = null;

		const sendPendingErrorNow = () => {
			const err = pendingErrorEvent;
			pendingErrorEvent = null;
			this._onError.fire(err);
		};

		const errorRunner = this._register(new RunOnceScheduler(sendPendingErrorNow, 0));

		const sendErrorSoon = (err: unknown) => {
			errorRunner.cancel();
			pendingErrorEvent = err;
			errorRunner.schedule();
		};

		const sendErrorNow = (err: unknown) => {
			errorRunner.cancel();
			pendingErrorEvent = err;
			sendPendingErrorNow();
		};

		this._register(dom.addDisposableListener(this._socket, 'close', (e: CloseEvent) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Close, { code: e.code, reason: e.reason, wasClean: e.wasClean });

			this._isClosed = true;

			if (pendingErrorEvent) {
				if (!navigator.onLine) {
					// The browser is offline => this is a temporary error which might resolve itself
					sendErrorNow(new RemoteAuthorityResolverError('Browser is offline', RemoteAuthorityResolverErrorCode.TemporarilyNotAvailable, e));
				} else {
					// An error event is pending
					// The browser appears to be online...
					if (!e.wasClean) {
						// Let's be optimistic and hope that perhaps the server could not be reached or something
						sendErrorNow(new RemoteAuthorityResolverError(e.reason || `WebSocket close with status code ${e.code}`, RemoteAuthorityResolverErrorCode.TemporarilyNotAvailable, e));
					} else {
						// this was a clean close => send existing error
						errorRunner.cancel();
						sendPendingErrorNow();
					}
				}
			}

			this._onClose.fire({ code: e.code, reason: e.reason, wasClean: e.wasClean, event: e });
		}));

		this._register(dom.addDisposableListener(this._socket, 'error', (err) => {
			this.traceSocketEvent(SocketDiagnosticsEventType.Error, { message: err?.message });
			sendErrorSoon(err);
		}));
	}

	send(data: ArrayBuffer | ArrayBufferView): void {
		if (this._isClosed) {
			// Refuse to write data to closed WebSocket...
			return;
		}
		this.traceSocketEvent(SocketDiagnosticsEventType.Write, data);
		this._socket.send(data);
	}

	close(): void {
		this._isClosed = true;
		this.traceSocketEvent(SocketDiagnosticsEventType.Close);
		this._socket.close();
		this._socket.removeEventListener('message', this._socketMessageListener);
		this.dispose();
	}
}

const defaultWebSocketFactory = new class implements IWebSocketFactory {
	create(url: string, debugLabel: string): IWebSocket {
		return new BrowserWebSocket(url, debugLabel);
	}
};

class BrowserSocket implements ISocket {

	public readonly socket: IWebSocket;
	public readonly debugLabel: string;

	public traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | any): void {
		if (typeof this.socket.traceSocketEvent === 'function') {
			this.socket.traceSocketEvent(type, data);
		} else {
			SocketDiagnostics.traceSocketEvent(this.socket, this.debugLabel, type, data);
		}
	}

	constructor(socket: IWebSocket, debugLabel: string) {
		this.socket = socket;
		this.debugLabel = debugLabel;
	}

	public dispose(): void {
		this.socket.close();
	}

	public onData(listener: (e: VSBuffer) => void): IDisposable {
		return this.socket.onData((data) => listener(VSBuffer.wrap(new Uint8Array(data))));
	}

	public onClose(listener: (e: SocketCloseEvent) => void): IDisposable {
		const adapter = (e: IWebSocketCloseEvent | void) => {
			if (typeof e === 'undefined') {
				listener(e);
			} else {
				listener({
					type: SocketCloseEventType.WebSocketCloseEvent,
					code: e.code,
					reason: e.reason,
					wasClean: e.wasClean,
					event: e.event
				});
			}
		};
		return this.socket.onClose(adapter);
	}

	public onEnd(listener: () => void): IDisposable {
		return Disposable.None;
	}

	public write(buffer: VSBuffer): void {
		this.socket.send(buffer.buffer);
	}

	public end(): void {
		this.socket.close();
	}

	public drain(): Promise<void> {
		return Promise.resolve();
	}
}


export class BrowserSocketFactory implements ISocketFactory<RemoteConnectionType.WebSocket> {

	private readonly _webSocketFactory: IWebSocketFactory;

	constructor(webSocketFactory: IWebSocketFactory | null | undefined) {
		this._webSocketFactory = webSocketFactory || defaultWebSocketFactory;
	}

	supports(connectTo: WebSocketRemoteConnection): boolean {
		return true;
	}

	connect({ host, port }: WebSocketRemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket> {
		return new Promise<ISocket>((resolve, reject) => {
			const webSocketSchema = (/^https:/.test(mainWindow.location.href) ? 'wss' : 'ws');
			const socket = this._webSocketFactory.create(`${webSocketSchema}://${(/:/.test(host) && !/\[/.test(host)) ? `[${host}]` : host}:${port}${path}?${query}&skipWebSocketFrames=false`, debugLabel);
			const disposables = new DisposableStore();
			disposables.add(socket.onError(reject));
			disposables.add(socket.onOpen(() => {
				disposables.dispose();
				resolve(new BrowserSocket(socket, debugLabel));
			}));
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/browser/remoteAuthorityResolverService.ts]---
Location: vscode-main/src/vs/platform/remote/browser/remoteAuthorityResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../base/browser/window.js';
import { DeferredPromise } from '../../../base/common/async.js';
import * as errors from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { RemoteAuthorities } from '../../../base/common/network.js';
import * as performance from '../../../base/common/performance.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { URI } from '../../../base/common/uri.js';
import { ILogService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { IRemoteAuthorityResolverService, IRemoteConnectionData, RemoteConnectionType, ResolvedAuthority, ResolvedOptions, ResolverResult, WebSocketRemoteConnection, getRemoteAuthorityPrefix } from '../common/remoteAuthorityResolver.js';
import { parseAuthorityWithOptionalPort } from '../common/remoteHosts.js';

export class RemoteAuthorityResolverService extends Disposable implements IRemoteAuthorityResolverService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeConnectionData = this._register(new Emitter<void>());
	public readonly onDidChangeConnectionData = this._onDidChangeConnectionData.event;

	private readonly _resolveAuthorityRequests = new Map<string, DeferredPromise<ResolverResult>>();
	private readonly _cache = new Map<string, ResolverResult>();
	private readonly _connectionToken: Promise<string> | string | undefined;
	private readonly _connectionTokens: Map<string, string>;
	private readonly _isWorkbenchOptionsBasedResolution: boolean;

	constructor(
		isWorkbenchOptionsBasedResolution: boolean,
		connectionToken: Promise<string> | string | undefined,
		resourceUriProvider: ((uri: URI) => URI) | undefined,
		serverBasePath: string | undefined,
		@IProductService productService: IProductService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._connectionToken = connectionToken;
		this._connectionTokens = new Map<string, string>();
		this._isWorkbenchOptionsBasedResolution = isWorkbenchOptionsBasedResolution;
		if (resourceUriProvider) {
			RemoteAuthorities.setDelegate(resourceUriProvider);
		}
		RemoteAuthorities.setServerRootPath(productService, serverBasePath);
	}

	async resolveAuthority(authority: string): Promise<ResolverResult> {
		let result = this._resolveAuthorityRequests.get(authority);
		if (!result) {
			result = new DeferredPromise<ResolverResult>();
			this._resolveAuthorityRequests.set(authority, result);
			if (this._isWorkbenchOptionsBasedResolution) {
				this._doResolveAuthority(authority).then(v => result!.complete(v), (err) => result!.error(err));
			}
		}

		return result.p;
	}

	async getCanonicalURI(uri: URI): Promise<URI> {
		// todo@connor4312 make this work for web
		return uri;
	}

	getConnectionData(authority: string): IRemoteConnectionData | null {
		if (!this._cache.has(authority)) {
			return null;
		}
		const resolverResult = this._cache.get(authority)!;
		const connectionToken = this._connectionTokens.get(authority) || resolverResult.authority.connectionToken;
		return {
			connectTo: resolverResult.authority.connectTo,
			connectionToken: connectionToken
		};
	}

	private async _doResolveAuthority(authority: string): Promise<ResolverResult> {
		const authorityPrefix = getRemoteAuthorityPrefix(authority);
		const sw = StopWatch.create(false);
		this._logService.info(`Resolving connection token (${authorityPrefix})...`);
		performance.mark(`code/willResolveConnectionToken/${authorityPrefix}`);
		const connectionToken = await Promise.resolve(this._connectionTokens.get(authority) || this._connectionToken);
		performance.mark(`code/didResolveConnectionToken/${authorityPrefix}`);
		this._logService.info(`Resolved connection token (${authorityPrefix}) after ${sw.elapsed()} ms`);
		const defaultPort = (/^https:/.test(mainWindow.location.href) ? 443 : 80);
		const { host, port } = parseAuthorityWithOptionalPort(authority, defaultPort);
		const result: ResolverResult = { authority: { authority, connectTo: new WebSocketRemoteConnection(host, port), connectionToken } };
		RemoteAuthorities.set(authority, host, port);
		this._cache.set(authority, result);
		this._onDidChangeConnectionData.fire();
		return result;
	}


	_clearResolvedAuthority(authority: string): void {
		if (this._resolveAuthorityRequests.has(authority)) {
			this._resolveAuthorityRequests.get(authority)!.cancel();
			this._resolveAuthorityRequests.delete(authority);
		}
	}

	_setResolvedAuthority(resolvedAuthority: ResolvedAuthority, options?: ResolvedOptions): void {
		if (this._resolveAuthorityRequests.has(resolvedAuthority.authority)) {
			const request = this._resolveAuthorityRequests.get(resolvedAuthority.authority)!;
			// For non-websocket types, it's expected the embedder passes a `remoteResourceProvider`
			// which is wrapped to a `IResourceUriProvider` and is not handled here.
			if (resolvedAuthority.connectTo.type === RemoteConnectionType.WebSocket) {
				RemoteAuthorities.set(resolvedAuthority.authority, resolvedAuthority.connectTo.host, resolvedAuthority.connectTo.port);
			}
			if (resolvedAuthority.connectionToken) {
				RemoteAuthorities.setConnectionToken(resolvedAuthority.authority, resolvedAuthority.connectionToken);
			}
			request.complete({ authority: resolvedAuthority, options });
			this._onDidChangeConnectionData.fire();
		}
	}

	_setResolvedAuthorityError(authority: string, err: any): void {
		if (this._resolveAuthorityRequests.has(authority)) {
			const request = this._resolveAuthorityRequests.get(authority)!;
			// Avoid that this error makes it to telemetry
			request.error(errors.ErrorNoTelemetry.fromError(err));
		}
	}

	_setAuthorityConnectionToken(authority: string, connectionToken: string): void {
		this._connectionTokens.set(authority, connectionToken);
		RemoteAuthorities.setConnectionToken(authority, connectionToken);
		this._onDidChangeConnectionData.fire();
	}

	_setCanonicalURIProvider(provider: (uri: URI) => Promise<URI>): void {
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/electronRemoteResources.ts]---
Location: vscode-main/src/vs/platform/remote/common/electronRemoteResources.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UriComponents } from '../../../base/common/uri.js';
import { Client, IClientRouter, IConnectionHub } from '../../../base/parts/ipc/common/ipc.js';

export const NODE_REMOTE_RESOURCE_IPC_METHOD_NAME = 'request';

export const NODE_REMOTE_RESOURCE_CHANNEL_NAME = 'remoteResourceHandler';

export type NodeRemoteResourceResponse = { body: /* base64 */ string; mimeType?: string; statusCode: number };

export class NodeRemoteResourceRouter implements IClientRouter<string> {
	async routeCall(hub: IConnectionHub<string>, command: string, arg?: unknown): Promise<Client<string>> {
		if (command !== NODE_REMOTE_RESOURCE_IPC_METHOD_NAME) {
			throw new Error(`Call not found: ${command}`);
		}

		const uri = Array.isArray(arg) ? arg[0] as (UriComponents | undefined) : undefined;
		if (uri?.authority) {
			const connection = hub.connections.find(c => c.ctx === uri.authority);
			if (connection) {
				return connection;
			}
		}

		throw new Error(`Caller not found`);
	}

	routeEvent(_: IConnectionHub<string>, event: string): Promise<Client<string>> {
		throw new Error(`Event not found: ${event}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/managedSocket.ts]---
Location: vscode-main/src/vs/platform/remote/common/managedSocket.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer, encodeBase64 } from '../../../base/common/buffer.js';
import { Emitter, Event, PauseableEmitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { ISocket, SocketCloseEvent, SocketDiagnostics, SocketDiagnosticsEventType } from '../../../base/parts/ipc/common/ipc.net.js';

export const makeRawSocketHeaders = (path: string, query: string, deubgLabel: string) => {
	// https://tools.ietf.org/html/rfc6455#section-4
	const buffer = new Uint8Array(16);
	for (let i = 0; i < 16; i++) {
		buffer[i] = Math.round(Math.random() * 256);
	}
	const nonce = encodeBase64(VSBuffer.wrap(buffer));

	const headers = [
		`GET ws://localhost${path}?${query}&skipWebSocketFrames=true HTTP/1.1`,
		`Connection: Upgrade`,
		`Upgrade: websocket`,
		`Sec-WebSocket-Key: ${nonce}`
	];

	return headers.join('\r\n') + '\r\n\r\n';
};

export const socketRawEndHeaderSequence = VSBuffer.fromString('\r\n\r\n');

export interface RemoteSocketHalf {
	onData: Emitter<VSBuffer>;
	onClose: Emitter<SocketCloseEvent>;
	onEnd: Emitter<void>;
}

/** Should be called immediately after making a ManagedSocket to make it ready for data flow. */
export async function connectManagedSocket<T extends ManagedSocket>(
	socket: T,
	path: string, query: string, debugLabel: string,
	half: RemoteSocketHalf
): Promise<T> {
	socket.write(VSBuffer.fromString(makeRawSocketHeaders(path, query, debugLabel)));

	const d = new DisposableStore();
	try {
		return await new Promise<T>((resolve, reject) => {
			let dataSoFar: VSBuffer | undefined;
			d.add(socket.onData(d_1 => {
				if (!dataSoFar) {
					dataSoFar = d_1;
				} else {
					dataSoFar = VSBuffer.concat([dataSoFar, d_1], dataSoFar.byteLength + d_1.byteLength);
				}

				const index = dataSoFar.indexOf(socketRawEndHeaderSequence);
				if (index === -1) {
					return;
				}

				resolve(socket);
				// pause data events until the socket consumer is hooked up. We may
				// immediately emit remaining data, but if not there may still be
				// microtasks queued which would fire data into the abyss.
				socket.pauseData();

				const rest = dataSoFar.slice(index + socketRawEndHeaderSequence.byteLength);
				if (rest.byteLength) {
					half.onData.fire(rest);
				}
			}));

			d.add(socket.onClose(err => reject(err ?? new Error('socket closed'))));
			d.add(socket.onEnd(() => reject(new Error('socket ended'))));
		});
	} catch (e) {
		socket.dispose();
		throw e;
	} finally {
		d.dispose();
	}
}

export abstract class ManagedSocket extends Disposable implements ISocket {
	private readonly pausableDataEmitter = this._register(new PauseableEmitter<VSBuffer>());

	public onData: Event<VSBuffer> = (...args) => {
		if (this.pausableDataEmitter.isPaused) {
			queueMicrotask(() => this.pausableDataEmitter.resume());
		}
		return this.pausableDataEmitter.event(...args);
	};
	public onClose: Event<SocketCloseEvent>;
	public onEnd: Event<void>;

	private readonly didDisposeEmitter = this._register(new Emitter<void>());
	public onDidDispose = this.didDisposeEmitter.event;

	private ended = false;

	protected constructor(
		private readonly debugLabel: string,
		half: RemoteSocketHalf,
	) {
		super();

		this._register(half.onData);
		this._register(half.onData.event(data => this.pausableDataEmitter.fire(data)));

		this.onClose = this._register(half.onClose).event;
		this.onEnd = this._register(half.onEnd).event;
	}

	/** Pauses data events until a new listener comes in onData() */
	public pauseData() {
		this.pausableDataEmitter.pause();
	}

	/** Flushes data to the socket. */
	public drain(): Promise<void> {
		return Promise.resolve();
	}

	/** Ends the remote socket. */
	public end(): void {
		this.ended = true;
		this.closeRemote();
	}

	public abstract write(buffer: VSBuffer): void;
	protected abstract closeRemote(): void;

	traceSocketEvent(type: SocketDiagnosticsEventType, data?: VSBuffer | Uint8Array | ArrayBuffer | ArrayBufferView | unknown): void {
		SocketDiagnostics.traceSocketEvent(this, this.debugLabel, type, data);
	}

	override dispose(): void {
		if (!this.ended) {
			this.closeRemote();
		}

		this.didDisposeEmitter.fire();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remote.ts]---
Location: vscode-main/src/vs/platform/remote/common/remote.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const REMOTE_DEFAULT_IF_LOCAL_EXTENSIONS = 'remote.defaultExtensionsIfInstalledLocally';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remoteAgentConnection.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteAgentConnection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, promiseWithResolvers } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { isCancellationError, onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { RemoteAuthorities } from '../../../base/common/network.js';
import * as performance from '../../../base/common/performance.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IIPCLogger } from '../../../base/parts/ipc/common/ipc.js';
import { Client, ISocket, PersistentProtocol, ProtocolConstants, SocketCloseEventType } from '../../../base/parts/ipc/common/ipc.net.js';
import { ILogService } from '../../log/common/log.js';
import { RemoteAgentConnectionContext } from './remoteAgentEnvironment.js';
import { RemoteAuthorityResolverError, RemoteConnection } from './remoteAuthorityResolver.js';
import { IRemoteSocketFactoryService } from './remoteSocketFactoryService.js';
import { ISignService } from '../../sign/common/sign.js';

const RECONNECT_TIMEOUT = 30 * 1000 /* 30s */;

export const enum ConnectionType {
	Management = 1,
	ExtensionHost = 2,
	Tunnel = 3,
}

function connectionTypeToString(connectionType: ConnectionType): string {
	switch (connectionType) {
		case ConnectionType.Management:
			return 'Management';
		case ConnectionType.ExtensionHost:
			return 'ExtensionHost';
		case ConnectionType.Tunnel:
			return 'Tunnel';
	}
}

export interface AuthRequest {
	type: 'auth';
	auth: string;
	data: string;
}

export interface SignRequest {
	type: 'sign';
	data: string;
	signedData: string;
}

export interface ConnectionTypeRequest {
	type: 'connectionType';
	commit?: string;
	signedData: string;
	desiredConnectionType?: ConnectionType;
	args?: any;
}

export interface ErrorMessage {
	type: 'error';
	reason: string;
}

export interface OKMessage {
	type: 'ok';
}

export type HandshakeMessage = AuthRequest | SignRequest | ConnectionTypeRequest | ErrorMessage | OKMessage;


interface ISimpleConnectionOptions<T extends RemoteConnection = RemoteConnection> {
	commit: string | undefined;
	quality: string | undefined;
	connectTo: T;
	connectionToken: string | undefined;
	reconnectionToken: string;
	reconnectionProtocol: PersistentProtocol | null;
	remoteSocketFactoryService: IRemoteSocketFactoryService;
	signService: ISignService;
	logService: ILogService;
}

function createTimeoutCancellation(millis: number): CancellationToken {
	const source = new CancellationTokenSource();
	setTimeout(() => source.cancel(), millis);
	return source.token;
}

function combineTimeoutCancellation(a: CancellationToken, b: CancellationToken): CancellationToken {
	if (a.isCancellationRequested || b.isCancellationRequested) {
		return CancellationToken.Cancelled;
	}
	const source = new CancellationTokenSource();
	a.onCancellationRequested(() => source.cancel());
	b.onCancellationRequested(() => source.cancel());
	return source.token;
}

class PromiseWithTimeout<T> {

	private _state: 'pending' | 'resolved' | 'rejected' | 'timedout';
	private readonly _disposables: DisposableStore;
	public readonly promise: Promise<T>;
	private readonly _resolvePromise: (value: T) => void;
	private readonly _rejectPromise: (err: any) => void;

	public get didTimeout(): boolean {
		return (this._state === 'timedout');
	}

	constructor(timeoutCancellationToken: CancellationToken) {
		this._state = 'pending';
		this._disposables = new DisposableStore();

		({ promise: this.promise, resolve: this._resolvePromise, reject: this._rejectPromise } = promiseWithResolvers<T>());

		if (timeoutCancellationToken.isCancellationRequested) {
			this._timeout();
		} else {
			this._disposables.add(timeoutCancellationToken.onCancellationRequested(() => this._timeout()));
		}
	}

	public registerDisposable(disposable: IDisposable): void {
		if (this._state === 'pending') {
			this._disposables.add(disposable);
		} else {
			disposable.dispose();
		}
	}

	private _timeout(): void {
		if (this._state !== 'pending') {
			return;
		}
		this._disposables.dispose();
		this._state = 'timedout';
		this._rejectPromise(this._createTimeoutError());
	}

	private _createTimeoutError(): Error {
		const err: any = new Error('Time limit reached');
		err.code = 'ETIMEDOUT';
		err.syscall = 'connect';
		return err;
	}

	public resolve(value: T): void {
		if (this._state !== 'pending') {
			return;
		}
		this._disposables.dispose();
		this._state = 'resolved';
		this._resolvePromise(value);
	}

	public reject(err: any): void {
		if (this._state !== 'pending') {
			return;
		}
		this._disposables.dispose();
		this._state = 'rejected';
		this._rejectPromise(err);
	}
}

function readOneControlMessage<T>(protocol: PersistentProtocol, timeoutCancellationToken: CancellationToken): Promise<T> {
	const result = new PromiseWithTimeout<T>(timeoutCancellationToken);
	result.registerDisposable(protocol.onControlMessage(raw => {
		const msg: T = JSON.parse(raw.toString());
		const error = getErrorFromMessage(msg);
		if (error) {
			result.reject(error);
		} else {
			result.resolve(msg);
		}
	}));
	return result.promise;
}

function createSocket<T extends RemoteConnection>(logService: ILogService, remoteSocketFactoryService: IRemoteSocketFactoryService, connectTo: T, path: string, query: string, debugConnectionType: string, debugLabel: string, timeoutCancellationToken: CancellationToken): Promise<ISocket> {
	const result = new PromiseWithTimeout<ISocket>(timeoutCancellationToken);
	const sw = StopWatch.create(false);
	logService.info(`Creating a socket (${debugLabel})...`);
	performance.mark(`code/willCreateSocket/${debugConnectionType}`);

	remoteSocketFactoryService.connect(connectTo, path, query, debugLabel).then((socket) => {
		if (result.didTimeout) {
			performance.mark(`code/didCreateSocketError/${debugConnectionType}`);
			logService.info(`Creating a socket (${debugLabel}) finished after ${sw.elapsed()} ms, but this is too late and has timed out already.`);
			socket?.dispose();
		} else {
			performance.mark(`code/didCreateSocketOK/${debugConnectionType}`);
			logService.info(`Creating a socket (${debugLabel}) was successful after ${sw.elapsed()} ms.`);
			result.resolve(socket);
		}
	}, (err) => {
		performance.mark(`code/didCreateSocketError/${debugConnectionType}`);
		logService.info(`Creating a socket (${debugLabel}) returned an error after ${sw.elapsed()} ms.`);
		logService.error(err);
		result.reject(err);
	});

	return result.promise;
}

function raceWithTimeoutCancellation<T>(promise: Promise<T>, timeoutCancellationToken: CancellationToken): Promise<T> {
	const result = new PromiseWithTimeout<T>(timeoutCancellationToken);
	promise.then(
		(res) => {
			if (!result.didTimeout) {
				result.resolve(res);
			}
		},
		(err) => {
			if (!result.didTimeout) {
				result.reject(err);
			}
		}
	);
	return result.promise;
}

async function connectToRemoteExtensionHostAgent<T extends RemoteConnection>(options: ISimpleConnectionOptions<T>, connectionType: ConnectionType, args: any | undefined, timeoutCancellationToken: CancellationToken): Promise<{ protocol: PersistentProtocol; ownsProtocol: boolean }> {
	const logPrefix = connectLogPrefix(options, connectionType);

	options.logService.trace(`${logPrefix} 1/6. invoking socketFactory.connect().`);

	let socket: ISocket;
	try {
		socket = await createSocket(options.logService, options.remoteSocketFactoryService, options.connectTo, RemoteAuthorities.getServerRootPath(), `reconnectionToken=${options.reconnectionToken}&reconnection=${options.reconnectionProtocol ? 'true' : 'false'}`, connectionTypeToString(connectionType), `renderer-${connectionTypeToString(connectionType)}-${options.reconnectionToken}`, timeoutCancellationToken);
	} catch (error) {
		options.logService.error(`${logPrefix} socketFactory.connect() failed or timed out. Error:`);
		options.logService.error(error);
		throw error;
	}

	options.logService.trace(`${logPrefix} 2/6. socketFactory.connect() was successful.`);

	let protocol: PersistentProtocol;
	let ownsProtocol: boolean;
	if (options.reconnectionProtocol) {
		options.reconnectionProtocol.beginAcceptReconnection(socket, null);
		protocol = options.reconnectionProtocol;
		ownsProtocol = false;
	} else {
		protocol = new PersistentProtocol({ socket });
		ownsProtocol = true;
	}

	options.logService.trace(`${logPrefix} 3/6. sending AuthRequest control message.`);
	const message = await raceWithTimeoutCancellation(options.signService.createNewMessage(generateUuid()), timeoutCancellationToken);

	const authRequest: AuthRequest = {
		type: 'auth',
		auth: options.connectionToken || '00000000000000000000',
		data: message.data
	};
	protocol.sendControl(VSBuffer.fromString(JSON.stringify(authRequest)));

	try {
		const msg = await readOneControlMessage<HandshakeMessage>(protocol, combineTimeoutCancellation(timeoutCancellationToken, createTimeoutCancellation(10000)));

		if (msg.type !== 'sign' || typeof msg.data !== 'string') {
			const error: any = new Error('Unexpected handshake message');
			error.code = 'VSCODE_CONNECTION_ERROR';
			throw error;
		}

		options.logService.trace(`${logPrefix} 4/6. received SignRequest control message.`);

		const isValid = await raceWithTimeoutCancellation(options.signService.validate(message, msg.signedData), timeoutCancellationToken);
		if (!isValid) {
			const error: any = new Error('Refused to connect to unsupported server');
			error.code = 'VSCODE_CONNECTION_ERROR';
			throw error;
		}

		const signed = await raceWithTimeoutCancellation(options.signService.sign(msg.data), timeoutCancellationToken);
		const connTypeRequest: ConnectionTypeRequest = {
			type: 'connectionType',
			commit: options.commit,
			signedData: signed,
			desiredConnectionType: connectionType
		};
		if (args) {
			connTypeRequest.args = args;
		}

		options.logService.trace(`${logPrefix} 5/6. sending ConnectionTypeRequest control message.`);
		protocol.sendControl(VSBuffer.fromString(JSON.stringify(connTypeRequest)));

		return { protocol, ownsProtocol };

	} catch (error) {
		if (error && error.code === 'ETIMEDOUT') {
			options.logService.error(`${logPrefix} the handshake timed out. Error:`);
			options.logService.error(error);
		}
		if (error && error.code === 'VSCODE_CONNECTION_ERROR') {
			options.logService.error(`${logPrefix} received error control message when negotiating connection. Error:`);
			options.logService.error(error);
		}
		if (ownsProtocol) {
			safeDisposeProtocolAndSocket(protocol);
		}
		throw error;
	}
}

interface IManagementConnectionResult {
	protocol: PersistentProtocol;
}

async function connectToRemoteExtensionHostAgentAndReadOneMessage<T>(options: ISimpleConnectionOptions, connectionType: ConnectionType, args: any | undefined, timeoutCancellationToken: CancellationToken): Promise<{ protocol: PersistentProtocol; firstMessage: T }> {
	const startTime = Date.now();
	const logPrefix = connectLogPrefix(options, connectionType);
	const { protocol, ownsProtocol } = await connectToRemoteExtensionHostAgent(options, connectionType, args, timeoutCancellationToken);
	const result = new PromiseWithTimeout<{ protocol: PersistentProtocol; firstMessage: T }>(timeoutCancellationToken);
	result.registerDisposable(protocol.onControlMessage(raw => {
		const msg: T = JSON.parse(raw.toString());
		const error = getErrorFromMessage(msg);
		if (error) {
			options.logService.error(`${logPrefix} received error control message when negotiating connection. Error:`);
			options.logService.error(error);
			if (ownsProtocol) {
				safeDisposeProtocolAndSocket(protocol);
			}
			result.reject(error);
		} else {
			options.reconnectionProtocol?.endAcceptReconnection();
			options.logService.trace(`${logPrefix} 6/6. handshake finished, connection is up and running after ${logElapsed(startTime)}!`);
			result.resolve({ protocol, firstMessage: msg });
		}
	}));
	return result.promise;
}

async function doConnectRemoteAgentManagement(options: ISimpleConnectionOptions, timeoutCancellationToken: CancellationToken): Promise<IManagementConnectionResult> {
	const { protocol } = await connectToRemoteExtensionHostAgentAndReadOneMessage(options, ConnectionType.Management, undefined, timeoutCancellationToken);
	return { protocol };
}

export interface IRemoteExtensionHostStartParams {
	language: string;
	debugId?: string;
	break?: boolean;
	port?: number | null;
	env?: { [key: string]: string | null };
}

interface IExtensionHostConnectionResult {
	protocol: PersistentProtocol;
	debugPort?: number;
}

async function doConnectRemoteAgentExtensionHost(options: ISimpleConnectionOptions, startArguments: IRemoteExtensionHostStartParams, timeoutCancellationToken: CancellationToken): Promise<IExtensionHostConnectionResult> {
	const { protocol, firstMessage } = await connectToRemoteExtensionHostAgentAndReadOneMessage<{ debugPort?: number }>(options, ConnectionType.ExtensionHost, startArguments, timeoutCancellationToken);
	const debugPort = firstMessage && firstMessage.debugPort;
	return { protocol, debugPort };
}

export interface ITunnelConnectionStartParams {
	host: string;
	port: number;
}

async function doConnectRemoteAgentTunnel(options: ISimpleConnectionOptions, startParams: ITunnelConnectionStartParams, timeoutCancellationToken: CancellationToken): Promise<PersistentProtocol> {
	const startTime = Date.now();
	const logPrefix = connectLogPrefix(options, ConnectionType.Tunnel);
	const { protocol } = await connectToRemoteExtensionHostAgent(options, ConnectionType.Tunnel, startParams, timeoutCancellationToken);
	options.logService.trace(`${logPrefix} 6/6. handshake finished, connection is up and running after ${logElapsed(startTime)}!`);
	return protocol;
}

export interface IConnectionOptions<T extends RemoteConnection = RemoteConnection> {
	commit: string | undefined;
	quality: string | undefined;
	addressProvider: IAddressProvider<T>;
	remoteSocketFactoryService: IRemoteSocketFactoryService;
	signService: ISignService;
	logService: ILogService;
	ipcLogger: IIPCLogger | null;
}

async function resolveConnectionOptions<T extends RemoteConnection>(options: IConnectionOptions<T>, reconnectionToken: string, reconnectionProtocol: PersistentProtocol | null): Promise<ISimpleConnectionOptions<T>> {
	const { connectTo, connectionToken } = await options.addressProvider.getAddress();
	return {
		commit: options.commit,
		quality: options.quality,
		connectTo,
		connectionToken: connectionToken,
		reconnectionToken: reconnectionToken,
		reconnectionProtocol: reconnectionProtocol,
		remoteSocketFactoryService: options.remoteSocketFactoryService,
		signService: options.signService,
		logService: options.logService
	};
}

export interface IAddress<T extends RemoteConnection = RemoteConnection> {
	connectTo: T;
	connectionToken: string | undefined;
}

export interface IAddressProvider<T extends RemoteConnection = RemoteConnection> {
	getAddress(): Promise<IAddress<T>>;
}

export async function connectRemoteAgentManagement(options: IConnectionOptions, remoteAuthority: string, clientId: string): Promise<ManagementPersistentConnection> {
	return createInitialConnection(
		options,
		async (simpleOptions) => {
			const { protocol } = await doConnectRemoteAgentManagement(simpleOptions, CancellationToken.None);
			return new ManagementPersistentConnection(options, remoteAuthority, clientId, simpleOptions.reconnectionToken, protocol);
		}
	);
}

export async function connectRemoteAgentExtensionHost(options: IConnectionOptions, startArguments: IRemoteExtensionHostStartParams): Promise<ExtensionHostPersistentConnection> {
	return createInitialConnection(
		options,
		async (simpleOptions) => {
			const { protocol, debugPort } = await doConnectRemoteAgentExtensionHost(simpleOptions, startArguments, CancellationToken.None);
			return new ExtensionHostPersistentConnection(options, startArguments, simpleOptions.reconnectionToken, protocol, debugPort);
		}
	);
}

/**
 * Will attempt to connect 5 times. If it fails 5 consecutive times, it will give up.
 */
async function createInitialConnection<T extends PersistentConnection, O extends RemoteConnection>(options: IConnectionOptions<O>, connectionFactory: (simpleOptions: ISimpleConnectionOptions<O>) => Promise<T>): Promise<T> {
	const MAX_ATTEMPTS = 5;

	for (let attempt = 1; ; attempt++) {
		try {
			const reconnectionToken = generateUuid();
			const simpleOptions = await resolveConnectionOptions(options, reconnectionToken, null);
			const result = await connectionFactory(simpleOptions);
			return result;
		} catch (err) {
			if (attempt < MAX_ATTEMPTS) {
				options.logService.error(`[remote-connection][attempt ${attempt}] An error occurred in initial connection! Will retry... Error:`);
				options.logService.error(err);
			} else {
				options.logService.error(`[remote-connection][attempt ${attempt}]  An error occurred in initial connection! It will be treated as a permanent error. Error:`);
				options.logService.error(err);
				PersistentConnection.triggerPermanentFailure(0, 0, RemoteAuthorityResolverError.isHandled(err));
				throw err;
			}
		}
	}
}

export async function connectRemoteAgentTunnel(options: IConnectionOptions, tunnelRemoteHost: string, tunnelRemotePort: number): Promise<PersistentProtocol> {
	const simpleOptions = await resolveConnectionOptions(options, generateUuid(), null);
	const protocol = await doConnectRemoteAgentTunnel(simpleOptions, { host: tunnelRemoteHost, port: tunnelRemotePort }, CancellationToken.None);
	return protocol;
}

function sleep(seconds: number): CancelablePromise<void> {
	return createCancelablePromise(token => {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(resolve, seconds * 1000);
			token.onCancellationRequested(() => {
				clearTimeout(timeout);
				resolve();
			});
		});
	});
}

export const enum PersistentConnectionEventType {
	ConnectionLost,
	ReconnectionWait,
	ReconnectionRunning,
	ReconnectionPermanentFailure,
	ConnectionGain
}
export class ConnectionLostEvent {
	public readonly type = PersistentConnectionEventType.ConnectionLost;
	constructor(
		public readonly reconnectionToken: string,
		public readonly millisSinceLastIncomingData: number
	) { }
}
export class ReconnectionWaitEvent {
	public readonly type = PersistentConnectionEventType.ReconnectionWait;
	constructor(
		public readonly reconnectionToken: string,
		public readonly millisSinceLastIncomingData: number,
		public readonly durationSeconds: number,
		private readonly cancellableTimer: CancelablePromise<void>
	) { }

	public skipWait(): void {
		this.cancellableTimer.cancel();
	}
}
export class ReconnectionRunningEvent {
	public readonly type = PersistentConnectionEventType.ReconnectionRunning;
	constructor(
		public readonly reconnectionToken: string,
		public readonly millisSinceLastIncomingData: number,
		public readonly attempt: number
	) { }
}
export class ConnectionGainEvent {
	public readonly type = PersistentConnectionEventType.ConnectionGain;
	constructor(
		public readonly reconnectionToken: string,
		public readonly millisSinceLastIncomingData: number,
		public readonly attempt: number
	) { }
}
export class ReconnectionPermanentFailureEvent {
	public readonly type = PersistentConnectionEventType.ReconnectionPermanentFailure;
	constructor(
		public readonly reconnectionToken: string,
		public readonly millisSinceLastIncomingData: number,
		public readonly attempt: number,
		public readonly handled: boolean
	) { }
}
export type PersistentConnectionEvent = ConnectionGainEvent | ConnectionLostEvent | ReconnectionWaitEvent | ReconnectionRunningEvent | ReconnectionPermanentFailureEvent;

export abstract class PersistentConnection extends Disposable {

	public static triggerPermanentFailure(millisSinceLastIncomingData: number, attempt: number, handled: boolean): void {
		this._permanentFailure = true;
		this._permanentFailureMillisSinceLastIncomingData = millisSinceLastIncomingData;
		this._permanentFailureAttempt = attempt;
		this._permanentFailureHandled = handled;
		this._instances.forEach(instance => instance._gotoPermanentFailure(this._permanentFailureMillisSinceLastIncomingData, this._permanentFailureAttempt, this._permanentFailureHandled));
	}

	public static debugTriggerReconnection() {
		this._instances.forEach(instance => instance._beginReconnecting());
	}

	public static debugPauseSocketWriting() {
		this._instances.forEach(instance => instance._pauseSocketWriting());
	}

	private static _permanentFailure: boolean = false;
	private static _permanentFailureMillisSinceLastIncomingData: number = 0;
	private static _permanentFailureAttempt: number = 0;
	private static _permanentFailureHandled: boolean = false;
	private static _instances: PersistentConnection[] = [];

	private readonly _onDidStateChange = this._register(new Emitter<PersistentConnectionEvent>());
	public readonly onDidStateChange = this._onDidStateChange.event;

	private _permanentFailure: boolean = false;
	private get _isPermanentFailure(): boolean {
		return this._permanentFailure || PersistentConnection._permanentFailure;
	}

	private _isReconnecting: boolean = false;
	private _isDisposed: boolean = false;
	private _reconnectionGraceTime: number = ProtocolConstants.ReconnectionGraceTime;

	constructor(
		private readonly _connectionType: ConnectionType,
		protected readonly _options: IConnectionOptions,
		public readonly reconnectionToken: string,
		public readonly protocol: PersistentProtocol,
		private readonly _reconnectionFailureIsFatal: boolean
	) {
		super();


		this._onDidStateChange.fire(new ConnectionGainEvent(this.reconnectionToken, 0, 0));

		this._register(protocol.onSocketClose((e) => {
			const logPrefix = commonLogPrefix(this._connectionType, this.reconnectionToken, true);
			if (!e) {
				this._options.logService.info(`${logPrefix} received socket close event.`);
			} else if (e.type === SocketCloseEventType.NodeSocketCloseEvent) {
				this._options.logService.info(`${logPrefix} received socket close event (hadError: ${e.hadError}).`);
				if (e.error) {
					this._options.logService.error(e.error);
				}
			} else {
				this._options.logService.info(`${logPrefix} received socket close event (wasClean: ${e.wasClean}, code: ${e.code}, reason: ${e.reason}).`);
				if (e.event) {
					this._options.logService.error(e.event);
				}
			}
			this._beginReconnecting();
		}));
		this._register(protocol.onSocketTimeout((e) => {
			const logPrefix = commonLogPrefix(this._connectionType, this.reconnectionToken, true);
			this._options.logService.info(`${logPrefix} received socket timeout event (unacknowledgedMsgCount: ${e.unacknowledgedMsgCount}, timeSinceOldestUnacknowledgedMsg: ${e.timeSinceOldestUnacknowledgedMsg}, timeSinceLastReceivedSomeData: ${e.timeSinceLastReceivedSomeData}).`);
			this._beginReconnecting();
		}));

		PersistentConnection._instances.push(this);
		this._register(toDisposable(() => {
			const myIndex = PersistentConnection._instances.indexOf(this);
			if (myIndex >= 0) {
				PersistentConnection._instances.splice(myIndex, 1);
			}
		}));

		if (this._isPermanentFailure) {
			this._gotoPermanentFailure(PersistentConnection._permanentFailureMillisSinceLastIncomingData, PersistentConnection._permanentFailureAttempt, PersistentConnection._permanentFailureHandled);
		}
	}

	public updateGraceTime(graceTime: number): void {
		const sanitizedGrace = sanitizeGraceTime(graceTime, ProtocolConstants.ReconnectionGraceTime);
		const logPrefix = commonLogPrefix(this._connectionType, this.reconnectionToken, false);
		this._options.logService.trace(`${logPrefix} Applying reconnection grace time: ${sanitizedGrace}ms (${Math.floor(sanitizedGrace / 1000)}s)`);
		this._reconnectionGraceTime = sanitizedGrace;
	}

	public override dispose(): void {
		super.dispose();
		this._isDisposed = true;
	}

	private async _beginReconnecting(): Promise<void> {
		// Only have one reconnection loop active at a time.
		if (this._isReconnecting) {
			return;
		}
		try {
			this._isReconnecting = true;
			await this._runReconnectingLoop();
		} finally {
			this._isReconnecting = false;
		}
	}

	private async _runReconnectingLoop(): Promise<void> {
		if (this._isPermanentFailure || this._isDisposed) {
			// no more attempts!
			return;
		}
		const logPrefix = commonLogPrefix(this._connectionType, this.reconnectionToken, true);
		this._options.logService.info(`${logPrefix} starting reconnecting loop. You can get more information with the trace log level.`);
		this._onDidStateChange.fire(new ConnectionLostEvent(this.reconnectionToken, this.protocol.getMillisSinceLastIncomingData()));
		const TIMES = [0, 5, 5, 10, 10, 10, 10, 10, 30];
		const graceTime = this._reconnectionGraceTime;
		this._options.logService.info(`${logPrefix} starting reconnection with grace time: ${graceTime}ms (${Math.floor(graceTime / 1000)}s)`);
		if (graceTime <= 0) {
			this._options.logService.error(`${logPrefix} reconnection grace time is set to 0ms, will not attempt to reconnect.`);
			this._onReconnectionPermanentFailure(this.protocol.getMillisSinceLastIncomingData(), 0, false);
			return;
		}
		const loopStartTime = Date.now();
		let attempt = -1;
		do {
			attempt++;
			const waitTime = (attempt < TIMES.length ? TIMES[attempt] : TIMES[TIMES.length - 1]);
			try {
				if (waitTime > 0) {
					const sleepPromise = sleep(waitTime);
					this._onDidStateChange.fire(new ReconnectionWaitEvent(this.reconnectionToken, this.protocol.getMillisSinceLastIncomingData(), waitTime, sleepPromise));

					this._options.logService.info(`${logPrefix} waiting for ${waitTime} seconds before reconnecting...`);
					try {
						await sleepPromise;
					} catch { } // User canceled timer
				}

				if (this._isPermanentFailure) {
					this._options.logService.error(`${logPrefix} permanent failure occurred while running the reconnecting loop.`);
					break;
				}

				// connection was lost, let's try to re-establish it
				this._onDidStateChange.fire(new ReconnectionRunningEvent(this.reconnectionToken, this.protocol.getMillisSinceLastIncomingData(), attempt + 1));
				this._options.logService.info(`${logPrefix} resolving connection...`);
				const simpleOptions = await resolveConnectionOptions(this._options, this.reconnectionToken, this.protocol);
				this._options.logService.info(`${logPrefix} connecting to ${simpleOptions.connectTo}...`);
				await this._reconnect(simpleOptions, createTimeoutCancellation(RECONNECT_TIMEOUT));
				this._options.logService.info(`${logPrefix} reconnected!`);
				this._onDidStateChange.fire(new ConnectionGainEvent(this.reconnectionToken, this.protocol.getMillisSinceLastIncomingData(), attempt + 1));

				break;
			} catch (err) {
				if (err.code === 'VSCODE_CONNECTION_ERROR') {
					this._options.logService.error(`${logPrefix} A permanent error occurred in the reconnecting loop! Will give up now! Error:`);
					this._options.logService.error(err);
					this._onReconnectionPermanentFailure(this.protocol.getMillisSinceLastIncomingData(), attempt + 1, false);
					break;
				}
				if (Date.now() - loopStartTime >= graceTime) {
					const graceSeconds = Math.round(graceTime / 1000);
					this._options.logService.error(`${logPrefix} An error occurred while reconnecting, but it will be treated as a permanent error because the reconnection grace time (${graceSeconds}s) has expired! Will give up now! Error:`);
					this._options.logService.error(err);
					this._onReconnectionPermanentFailure(this.protocol.getMillisSinceLastIncomingData(), attempt + 1, false);
					break;
				}
				if (RemoteAuthorityResolverError.isTemporarilyNotAvailable(err)) {
					this._options.logService.info(`${logPrefix} A temporarily not available error occurred while trying to reconnect, will try again...`);
					this._options.logService.trace(err);
					// try again!
					continue;
				}
				if ((err.code === 'ETIMEDOUT' || err.code === 'ENETUNREACH' || err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') && err.syscall === 'connect') {
					this._options.logService.info(`${logPrefix} A network error occurred while trying to reconnect, will try again...`);
					this._options.logService.trace(err);
					// try again!
					continue;
				}
				if (isCancellationError(err)) {
					this._options.logService.info(`${logPrefix} A promise cancelation error occurred while trying to reconnect, will try again...`);
					this._options.logService.trace(err);
					// try again!
					continue;
				}
				if (err instanceof RemoteAuthorityResolverError) {
					this._options.logService.error(`${logPrefix} A RemoteAuthorityResolverError occurred while trying to reconnect. Will give up now! Error:`);
					this._options.logService.error(err);
					this._onReconnectionPermanentFailure(this.protocol.getMillisSinceLastIncomingData(), attempt + 1, RemoteAuthorityResolverError.isHandled(err));
					break;
				}
				this._options.logService.error(`${logPrefix} An unknown error occurred while trying to reconnect, since this is an unknown case, it will be treated as a permanent error! Will give up now! Error:`);
				this._options.logService.error(err);
				this._onReconnectionPermanentFailure(this.protocol.getMillisSinceLastIncomingData(), attempt + 1, false);
				break;
			}
		} while (!this._isPermanentFailure && !this._isDisposed);
	}

	private _onReconnectionPermanentFailure(millisSinceLastIncomingData: number, attempt: number, handled: boolean): void {
		if (this._reconnectionFailureIsFatal) {
			PersistentConnection.triggerPermanentFailure(millisSinceLastIncomingData, attempt, handled);
		} else {
			this._gotoPermanentFailure(millisSinceLastIncomingData, attempt, handled);
		}
	}

	private _gotoPermanentFailure(millisSinceLastIncomingData: number, attempt: number, handled: boolean): void {
		this._onDidStateChange.fire(new ReconnectionPermanentFailureEvent(this.reconnectionToken, millisSinceLastIncomingData, attempt, handled));
		safeDisposeProtocolAndSocket(this.protocol);
	}

	private _pauseSocketWriting(): void {
		this.protocol.pauseSocketWriting();
	}

	protected abstract _reconnect(options: ISimpleConnectionOptions, timeoutCancellationToken: CancellationToken): Promise<void>;
}

export class ManagementPersistentConnection extends PersistentConnection {

	public readonly client: Client<RemoteAgentConnectionContext>;

	constructor(options: IConnectionOptions, remoteAuthority: string, clientId: string, reconnectionToken: string, protocol: PersistentProtocol) {
		super(ConnectionType.Management, options, reconnectionToken, protocol, /*reconnectionFailureIsFatal*/true);
		this.client = this._register(new Client<RemoteAgentConnectionContext>(protocol, {
			remoteAuthority: remoteAuthority,
			clientId: clientId
		}, options.ipcLogger));
	}

	protected async _reconnect(options: ISimpleConnectionOptions, timeoutCancellationToken: CancellationToken): Promise<void> {
		await doConnectRemoteAgentManagement(options, timeoutCancellationToken);
	}
}

export class ExtensionHostPersistentConnection extends PersistentConnection {

	private readonly _startArguments: IRemoteExtensionHostStartParams;
	public readonly debugPort: number | undefined;

	constructor(options: IConnectionOptions, startArguments: IRemoteExtensionHostStartParams, reconnectionToken: string, protocol: PersistentProtocol, debugPort: number | undefined) {
		super(ConnectionType.ExtensionHost, options, reconnectionToken, protocol, /*reconnectionFailureIsFatal*/false);
		this._startArguments = startArguments;
		this.debugPort = debugPort;
	}

	protected async _reconnect(options: ISimpleConnectionOptions, timeoutCancellationToken: CancellationToken): Promise<void> {
		await doConnectRemoteAgentExtensionHost(options, this._startArguments, timeoutCancellationToken);
	}
}

function safeDisposeProtocolAndSocket(protocol: PersistentProtocol): void {
	try {
		protocol.acceptDisconnect();
		const socket = protocol.getSocket();
		protocol.dispose();
		socket.dispose();
	} catch (err) {
		onUnexpectedError(err);
	}
}

function getErrorFromMessage(msg: any): Error | null {
	if (msg && msg.type === 'error') {
		const error = new Error(`Connection error: ${msg.reason}`);
		// eslint-disable-next-line local/code-no-any-casts
		(<any>error).code = 'VSCODE_CONNECTION_ERROR';
		return error;
	}
	return null;
}

function sanitizeGraceTime(candidate: number, fallback: number): number {
	if (typeof candidate !== 'number' || !isFinite(candidate) || candidate < 0) {
		return fallback;
	}
	if (candidate > Number.MAX_SAFE_INTEGER) {
		return Number.MAX_SAFE_INTEGER;
	}
	return Math.floor(candidate);
}

function stringRightPad(str: string, len: number): string {
	while (str.length < len) {
		str += ' ';
	}
	return str;
}

function _commonLogPrefix(connectionType: ConnectionType, reconnectionToken: string): string {
	return `[remote-connection][${stringRightPad(connectionTypeToString(connectionType), 13)}][${reconnectionToken.substr(0, 5)}…]`;
}

function commonLogPrefix(connectionType: ConnectionType, reconnectionToken: string, isReconnect: boolean): string {
	return `${_commonLogPrefix(connectionType, reconnectionToken)}[${isReconnect ? 'reconnect' : 'initial'}]`;
}

function connectLogPrefix(options: ISimpleConnectionOptions, connectionType: ConnectionType): string {
	return `${commonLogPrefix(connectionType, options.reconnectionToken, !!options.reconnectionProtocol)}[${options.connectTo}]`;
}

function logElapsed(startTime: number): string {
	return `${Date.now() - startTime} ms`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/remote/common/remoteAgentEnvironment.ts]---
Location: vscode-main/src/vs/platform/remote/common/remoteAgentEnvironment.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as performance from '../../../base/common/performance.js';
import { OperatingSystem } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';

export interface IRemoteAgentEnvironment {
	pid: number;
	connectionToken: string;
	appRoot: URI;
	settingsPath: URI;
	mcpResource: URI;
	logsPath: URI;
	extensionHostLogsPath: URI;
	globalStorageHome: URI;
	workspaceStorageHome: URI;
	localHistoryHome: URI;
	userHome: URI;
	os: OperatingSystem;
	arch: string;
	marks: performance.PerformanceMark[];
	useHostProxy: boolean;
	profiles: {
		all: IUserDataProfile[];
		home: URI;
	};
	isUnsupportedGlibc: boolean;
	reconnectionGraceTime?: number;
}

export interface RemoteAgentConnectionContext {
	remoteAuthority: string;
	clientId: string;
}
```

--------------------------------------------------------------------------------

````

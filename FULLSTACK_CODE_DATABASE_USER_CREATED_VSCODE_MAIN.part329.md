---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 329
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 329 of 552)

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

---[FILE: src/vs/workbench/browser/parts/activitybar/activitybarPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/activitybar/activitybarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/activitybarpart.css';
import './media/activityaction.css';
import { localize, localize2 } from '../../../../nls.js';
import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Part } from '../../part.js';
import { ActivityBarPosition, IWorkbenchLayoutService, LayoutSettings, Parts, Position } from '../../../services/layout/browser/layoutService.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { ToggleSidebarPositionAction, ToggleSidebarVisibilityAction } from '../../actions/layoutActions.js';
import { IThemeService, IColorTheme, registerThemingParticipant } from '../../../../platform/theme/common/themeService.js';
import { ACTIVITY_BAR_BACKGROUND, ACTIVITY_BAR_BORDER, ACTIVITY_BAR_FOREGROUND, ACTIVITY_BAR_ACTIVE_BORDER, ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND, ACTIVITY_BAR_INACTIVE_FOREGROUND, ACTIVITY_BAR_ACTIVE_BACKGROUND, ACTIVITY_BAR_DRAG_AND_DROP_BORDER, ACTIVITY_BAR_ACTIVE_FOCUS_BORDER } from '../../../common/theme.js';
import { activeContrastBorder, contrastBorder, focusBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { addDisposableListener, append, EventType, isAncestor, $, clearNode } from '../../../../base/browser/dom.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { CustomMenubarControl } from '../titlebar/menubarControl.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { getMenuBarVisibility, MenuSettings } from '../../../../platform/window/common/window.js';
import { IAction, Separator, SubmenuAction, toAction } from '../../../../base/common/actions.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { GestureEvent } from '../../../../base/browser/touch.js';
import { IPaneCompositePart } from '../paneCompositePart.js';
import { IPaneCompositeBarOptions, PaneCompositeBar } from '../paneCompositeBar.js';
import { GlobalCompositeBar } from '../globalCompositeBar.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { Action2, IMenuService, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IViewDescriptorService, ViewContainerLocation, ViewContainerLocationToString } from '../../../common/views.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { SwitchCompositeViewAction } from '../compositeBarActions.js';

export class ActivitybarPart extends Part {

	static readonly ACTION_HEIGHT = 48;

	static readonly pinnedViewContainersKey = 'workbench.activity.pinnedViewlets2';
	static readonly placeholderViewContainersKey = 'workbench.activity.placeholderViewlets';
	static readonly viewContainersWorkspaceStateKey = 'workbench.activity.viewletsWorkspaceState';

	//#region IView

	readonly minimumWidth: number = 48;
	readonly maximumWidth: number = 48;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

	//#endregion

	private readonly compositeBar = this._register(new MutableDisposable<PaneCompositeBar>());
	private content: HTMLElement | undefined;

	constructor(
		private readonly paneCompositePart: IPaneCompositePart,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
	) {
		super(Parts.ACTIVITYBAR_PART, { hasTitle: false }, themeService, storageService, layoutService);
	}

	private createCompositeBar(): PaneCompositeBar {
		return this.instantiationService.createInstance(ActivityBarCompositeBar, {
			partContainerClass: 'activitybar',
			pinnedViewContainersKey: ActivitybarPart.pinnedViewContainersKey,
			placeholderViewContainersKey: ActivitybarPart.placeholderViewContainersKey,
			viewContainersWorkspaceStateKey: ActivitybarPart.viewContainersWorkspaceStateKey,
			orientation: ActionsOrientation.VERTICAL,
			icon: true,
			iconSize: 24,
			activityHoverOptions: {
				position: () => this.layoutService.getSideBarPosition() === Position.LEFT ? HoverPosition.RIGHT : HoverPosition.LEFT,
			},
			preventLoopNavigation: true,
			recomputeSizes: false,
			fillExtraContextMenuActions: (actions, e?: MouseEvent | GestureEvent) => { },
			compositeSize: 52,
			colors: (theme: IColorTheme) => ({
				activeForegroundColor: theme.getColor(ACTIVITY_BAR_FOREGROUND),
				inactiveForegroundColor: theme.getColor(ACTIVITY_BAR_INACTIVE_FOREGROUND),
				activeBorderColor: theme.getColor(ACTIVITY_BAR_ACTIVE_BORDER),
				activeBackground: theme.getColor(ACTIVITY_BAR_ACTIVE_BACKGROUND),
				badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
				badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
				dragAndDropBorder: theme.getColor(ACTIVITY_BAR_DRAG_AND_DROP_BORDER),
				activeBackgroundColor: undefined, inactiveBackgroundColor: undefined, activeBorderBottomColor: undefined,
			}),
			overflowActionSize: ActivitybarPart.ACTION_HEIGHT,
		}, Parts.ACTIVITYBAR_PART, this.paneCompositePart, true);
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		this.element = parent;
		this.content = append(this.element, $('.content'));

		if (this.layoutService.isVisible(Parts.ACTIVITYBAR_PART)) {
			this.show();
		}

		return this.content;
	}

	getPinnedPaneCompositeIds(): string[] {
		return this.compositeBar.value?.getPinnedPaneCompositeIds() ?? [];
	}

	getVisiblePaneCompositeIds(): string[] {
		return this.compositeBar.value?.getVisiblePaneCompositeIds() ?? [];
	}

	getPaneCompositeIds(): string[] {
		return this.compositeBar.value?.getPaneCompositeIds() ?? [];
	}

	focus(): void {
		this.compositeBar.value?.focus();
	}

	override updateStyles(): void {
		super.updateStyles();

		const container = assertReturnsDefined(this.getContainer());
		const background = this.getColor(ACTIVITY_BAR_BACKGROUND) || '';
		container.style.backgroundColor = background;

		const borderColor = this.getColor(ACTIVITY_BAR_BORDER) || this.getColor(contrastBorder) || '';
		container.classList.toggle('bordered', !!borderColor);
		container.style.borderColor = borderColor ? borderColor : '';
	}

	show(focus?: boolean): void {
		if (!this.content) {
			return;
		}

		if (!this.compositeBar.value) {
			this.compositeBar.value = this.createCompositeBar();
			this.compositeBar.value.create(this.content);

			if (this.dimension) {
				this.layout(this.dimension.width, this.dimension.height);
			}
		}

		if (focus) {
			this.focus();
		}
	}

	hide(): void {
		if (!this.compositeBar.value) {
			return;
		}

		this.compositeBar.clear();

		if (this.content) {
			clearNode(this.content);
		}
	}

	override layout(width: number, height: number): void {
		super.layout(width, height, 0, 0);

		if (!this.compositeBar.value) {
			return;
		}

		// Layout contents
		const contentAreaSize = super.layoutContents(width, height).contentSize;

		// Layout composite bar
		this.compositeBar.value.layout(width, contentAreaSize.height);
	}

	toJSON(): object {
		return {
			type: Parts.ACTIVITYBAR_PART
		};
	}
}

export class ActivityBarCompositeBar extends PaneCompositeBar {

	private element: HTMLElement | undefined;

	private readonly menuBar = this._register(new MutableDisposable<CustomMenubarControl>());
	private menuBarContainer: HTMLElement | undefined;
	private compositeBarContainer: HTMLElement | undefined;
	private readonly globalCompositeBar: GlobalCompositeBar | undefined;

	private readonly keyboardNavigationDisposables = this._register(new DisposableStore());

	constructor(
		options: IPaneCompositeBarOptions,
		part: Parts,
		paneCompositePart: IPaneCompositePart,
		showGlobalActivities: boolean,
		@IInstantiationService instantiationService: IInstantiationService,
		@IStorageService storageService: IStorageService,
		@IExtensionService extensionService: IExtensionService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IViewsService viewService: IViewsService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IMenuService private readonly menuService: IMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
	) {
		super({
			...options,
			fillExtraContextMenuActions: (actions, e) => {
				options.fillExtraContextMenuActions(actions, e);
				this.fillContextMenuActions(actions, e);
			}
		}, part, paneCompositePart, instantiationService, storageService, extensionService, viewDescriptorService, viewService, contextKeyService, environmentService, layoutService);

		if (showGlobalActivities) {
			this.globalCompositeBar = this._register(instantiationService.createInstance(GlobalCompositeBar, () => this.getContextMenuActions(), (theme: IColorTheme) => this.options.colors(theme), this.options.activityHoverOptions));
		}

		// Register for configuration changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(MenuSettings.MenuBarVisibility)) {
				if (getMenuBarVisibility(this.configurationService) === 'compact') {
					this.installMenubar();
				} else {
					this.uninstallMenubar();
				}
			}
		}));
	}

	private fillContextMenuActions(actions: IAction[], e?: MouseEvent | GestureEvent) {
		// Menu
		const menuBarVisibility = getMenuBarVisibility(this.configurationService);
		if (menuBarVisibility === 'compact' || menuBarVisibility === 'hidden' || menuBarVisibility === 'toggle') {
			actions.unshift(...[toAction({ id: 'toggleMenuVisibility', label: localize('menu', "Menu"), checked: menuBarVisibility === 'compact', run: () => this.configurationService.updateValue(MenuSettings.MenuBarVisibility, menuBarVisibility === 'compact' ? 'toggle' : 'compact') }), new Separator()]);
		}

		if (menuBarVisibility === 'compact' && this.menuBarContainer && e?.target) {
			if (isAncestor(e.target as Node, this.menuBarContainer)) {
				actions.unshift(...[toAction({ id: 'hideCompactMenu', label: localize('hideMenu', "Hide Menu"), run: () => this.configurationService.updateValue(MenuSettings.MenuBarVisibility, 'toggle') }), new Separator()]);
			}
		}

		// Global Composite Bar
		if (this.globalCompositeBar) {
			actions.push(new Separator());
			actions.push(...this.globalCompositeBar.getContextMenuActions());
		}
		actions.push(new Separator());
		actions.push(...this.getActivityBarContextMenuActions());
	}

	private uninstallMenubar() {
		if (this.menuBar.value) {
			this.menuBar.value = undefined;
		}

		if (this.menuBarContainer) {
			this.menuBarContainer.remove();
			this.menuBarContainer = undefined;
		}
	}

	private installMenubar() {
		if (this.menuBar.value) {
			return; // prevent menu bar from installing twice #110720
		}

		this.menuBarContainer = $('.menubar');

		const content = assertReturnsDefined(this.element);
		content.prepend(this.menuBarContainer);

		// Menubar: install a custom menu bar depending on configuration
		this.menuBar.value = this._register(this.instantiationService.createInstance(CustomMenubarControl));
		this.menuBar.value.create(this.menuBarContainer);

	}

	private registerKeyboardNavigationListeners(): void {
		this.keyboardNavigationDisposables.clear();

		// Up/Down or Left/Right arrow on compact menu
		if (this.menuBarContainer) {
			this.keyboardNavigationDisposables.add(addDisposableListener(this.menuBarContainer, EventType.KEY_DOWN, e => {
				const kbEvent = new StandardKeyboardEvent(e);
				if (kbEvent.equals(KeyCode.DownArrow) || kbEvent.equals(KeyCode.RightArrow)) {
					this.focus();
				}
			}));
		}

		// Up/Down on Activity Icons
		if (this.compositeBarContainer) {
			this.keyboardNavigationDisposables.add(addDisposableListener(this.compositeBarContainer, EventType.KEY_DOWN, e => {
				const kbEvent = new StandardKeyboardEvent(e);
				if (kbEvent.equals(KeyCode.DownArrow) || kbEvent.equals(KeyCode.RightArrow)) {
					this.globalCompositeBar?.focus();
				} else if (kbEvent.equals(KeyCode.UpArrow) || kbEvent.equals(KeyCode.LeftArrow)) {
					this.menuBar.value?.toggleFocus();
				}
			}));
		}

		// Up arrow on global icons
		if (this.globalCompositeBar) {
			this.keyboardNavigationDisposables.add(addDisposableListener(this.globalCompositeBar.element, EventType.KEY_DOWN, e => {
				const kbEvent = new StandardKeyboardEvent(e);
				if (kbEvent.equals(KeyCode.UpArrow) || kbEvent.equals(KeyCode.LeftArrow)) {
					this.focus(this.getVisiblePaneCompositeIds().length - 1);
				}
			}));
		}
	}

	override create(parent: HTMLElement): HTMLElement {
		this.element = parent;

		// Install menubar if compact
		if (getMenuBarVisibility(this.configurationService) === 'compact') {
			this.installMenubar();
		}

		// View Containers action bar
		this.compositeBarContainer = super.create(this.element);

		// Global action bar
		if (this.globalCompositeBar) {
			this.globalCompositeBar.create(this.element);
		}

		// Keyboard Navigation
		this.registerKeyboardNavigationListeners();

		return this.compositeBarContainer;
	}

	override layout(width: number, height: number): void {
		if (this.menuBarContainer) {
			if (this.options.orientation === ActionsOrientation.VERTICAL) {
				height -= this.menuBarContainer.clientHeight;
			} else {
				width -= this.menuBarContainer.clientWidth;
			}
		}
		if (this.globalCompositeBar) {
			if (this.options.orientation === ActionsOrientation.VERTICAL) {
				height -= (this.globalCompositeBar.size() * ActivitybarPart.ACTION_HEIGHT);
			} else {
				width -= this.globalCompositeBar.element.clientWidth;
			}
		}
		super.layout(width, height);
	}

	getActivityBarContextMenuActions(): IAction[] {
		const activityBarPositionMenu = this.menuService.getMenuActions(MenuId.ActivityBarPositionMenu, this.contextKeyService, { shouldForwardArgs: true, renderShortTitle: true });
		const positionActions = getContextMenuActions(activityBarPositionMenu).secondary;
		const actions = [
			new SubmenuAction('workbench.action.panel.position', localize('activity bar position', "Activity Bar Position"), positionActions),
			toAction({ id: ToggleSidebarPositionAction.ID, label: ToggleSidebarPositionAction.getLabel(this.layoutService), run: () => this.instantiationService.invokeFunction(accessor => new ToggleSidebarPositionAction().run(accessor)) }),
		];

		if (this.part === Parts.SIDEBAR_PART) {
			actions.push(toAction({ id: ToggleSidebarVisibilityAction.ID, label: ToggleSidebarVisibilityAction.LABEL, run: () => this.instantiationService.invokeFunction(accessor => new ToggleSidebarVisibilityAction().run(accessor)) }));
		}

		return actions;
	}

}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.activityBarLocation.default',
			title: {
				...localize2('positionActivityBarDefault', 'Move Activity Bar to Side'),
				mnemonicTitle: localize({ key: 'miDefaultActivityBar', comment: ['&& denotes a mnemonic'] }, "&&Default"),
			},
			shortTitle: localize('default', "Default"),
			category: Categories.View,
			toggled: ContextKeyExpr.equals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.DEFAULT),
			menu: [{
				id: MenuId.ActivityBarPositionMenu,
				order: 1
			}, {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.notEquals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.DEFAULT),
			}]
		});
	}
	run(accessor: ServicesAccessor): void {
		const configurationService = accessor.get(IConfigurationService);
		configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, ActivityBarPosition.DEFAULT);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.activityBarLocation.top',
			title: {
				...localize2('positionActivityBarTop', 'Move Activity Bar to Top'),
				mnemonicTitle: localize({ key: 'miTopActivityBar', comment: ['&& denotes a mnemonic'] }, "&&Top"),
			},
			shortTitle: localize('top', "Top"),
			category: Categories.View,
			toggled: ContextKeyExpr.equals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.TOP),
			menu: [{
				id: MenuId.ActivityBarPositionMenu,
				order: 2
			}, {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.notEquals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.TOP),
			}]
		});
	}
	run(accessor: ServicesAccessor): void {
		const configurationService = accessor.get(IConfigurationService);
		configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, ActivityBarPosition.TOP);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.activityBarLocation.bottom',
			title: {
				...localize2('positionActivityBarBottom', 'Move Activity Bar to Bottom'),
				mnemonicTitle: localize({ key: 'miBottomActivityBar', comment: ['&& denotes a mnemonic'] }, "&&Bottom"),
			},
			shortTitle: localize('bottom', "Bottom"),
			category: Categories.View,
			toggled: ContextKeyExpr.equals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.BOTTOM),
			menu: [{
				id: MenuId.ActivityBarPositionMenu,
				order: 3
			}, {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.notEquals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.BOTTOM),
			}]
		});
	}
	run(accessor: ServicesAccessor): void {
		const configurationService = accessor.get(IConfigurationService);
		configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, ActivityBarPosition.BOTTOM);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.activityBarLocation.hide',
			title: {
				...localize2('hideActivityBar', 'Hide Activity Bar'),
				mnemonicTitle: localize({ key: 'miHideActivityBar', comment: ['&& denotes a mnemonic'] }, "&&Hidden"),
			},
			shortTitle: localize('hide', "Hidden"),
			category: Categories.View,
			toggled: ContextKeyExpr.equals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.HIDDEN),
			menu: [{
				id: MenuId.ActivityBarPositionMenu,
				order: 4
			}, {
				id: MenuId.CommandPalette,
				when: ContextKeyExpr.notEquals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.HIDDEN),
			}]
		});
	}
	run(accessor: ServicesAccessor): void {
		const configurationService = accessor.get(IConfigurationService);
		configurationService.updateValue(LayoutSettings.ACTIVITY_BAR_LOCATION, ActivityBarPosition.HIDDEN);
	}
});

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.ActivityBarPositionMenu,
	title: localize('positionActivituBar', "Activity Bar Position"),
	group: '3_workbench_layout_move',
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.ViewContainerTitleContext, {
	submenu: MenuId.ActivityBarPositionMenu,
	title: localize('positionActivituBar', "Activity Bar Position"),
	when: ContextKeyExpr.or(
		ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.Sidebar)),
		ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar))
	),
	group: '3_workbench_layout_move',
	order: 1
});

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.previousSideBarView',
			title: localize2('previousSideBarView', 'Previous Primary Side Bar View'),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.Sidebar, -1);
	}
});

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.nextSideBarView',
			title: localize2('nextSideBarView', 'Next Primary Side Bar View'),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.Sidebar, 1);
	}
});

registerAction2(
	class FocusActivityBarAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.focusActivityBar',
				title: localize2('focusActivityBar', 'Focus Activity Bar'),
				category: Categories.View,
				f1: true
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			const layoutService = accessor.get(IWorkbenchLayoutService);
			layoutService.focusPart(Parts.ACTIVITYBAR_PART);
		}
	});

registerThemingParticipant((theme, collector) => {

	const activityBarActiveBorderColor = theme.getColor(ACTIVITY_BAR_ACTIVE_BORDER);
	if (activityBarActiveBorderColor) {
		collector.addRule(`
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .active-item-indicator:before {
				border-left-color: ${activityBarActiveBorderColor};
			}
		`);
	}

	const activityBarActiveFocusBorderColor = theme.getColor(ACTIVITY_BAR_ACTIVE_FOCUS_BORDER);
	if (activityBarActiveFocusBorderColor) {
		collector.addRule(`
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked:focus::before {
				visibility: hidden;
			}

			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked:focus .active-item-indicator:before {
				visibility: visible;
				border-left-color: ${activityBarActiveFocusBorderColor};
			}
		`);
	}

	const activityBarActiveBackgroundColor = theme.getColor(ACTIVITY_BAR_ACTIVE_BACKGROUND);
	if (activityBarActiveBackgroundColor) {
		collector.addRule(`
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .active-item-indicator {
				z-index: 0;
				background-color: ${activityBarActiveBackgroundColor};
			}
		`);
	}

	// Styling with Outline color (e.g. high contrast theme)
	const outline = theme.getColor(activeContrastBorder);
	if (outline) {
		collector.addRule(`
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item .action-label::before{
				padding: 6px;
			}

			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.active .action-label::before,
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.active:hover .action-label::before,
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .action-label::before,
			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked:hover .action-label::before {
				outline: 1px solid ${outline};
			}

			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:hover .action-label::before {
				outline: 1px dashed ${outline};
			}

			.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .active-item-indicator:before {
				border-left-color: ${outline};
			}
		`);
	}

	// Styling without outline color
	else {
		const focusBorderColor = theme.getColor(focusBorder);
		if (focusBorderColor) {
			collector.addRule(`
				.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .active-item-indicator::before {
						border-left-color: ${focusBorderColor};
					}
				`);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/activitybar/media/activityaction.css]---
Location: vscode-main/src/vs/workbench/browser/parts/activitybar/media/activityaction.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item {
	display: block;
	position: relative;
}

.monaco-workbench .activitybar > .content .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .activitybar > .content .composite-bar > .monaco-action-bar .action-item::after {
	position: absolute;
	content: '';
	width: 48px;
	height: 2px;
	display: none;
	background-color: transparent;
	transition-property: background-color;
	transition-duration: 0ms;
	transition-delay: 100ms;
}

.monaco-workbench .activitybar > .content.dragged-over .composite-bar > .monaco-action-bar .action-item::before,
.monaco-workbench .activitybar > .content.dragged-over .composite-bar > .monaco-action-bar .action-item::after {
	display: block;
}

.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.top::before,
.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.top::after,
.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.bottom::before,
.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.bottom::after {
	transition-delay: 0s;
}

.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.bottom + .action-item::before,
.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item.top::before,
.monaco-workbench .activitybar > .content > .composite-bar > .monaco-action-bar .action-item:last-of-type.bottom::after,
.monaco-workbench .activitybar > .content.dragged-over-head > .composite-bar > .monaco-action-bar .action-item:first-of-type::before,
.monaco-workbench .activitybar > .content.dragged-over-tail > .composite-bar > .monaco-action-bar .action-item:last-of-type::after {
	background-color: var(--insert-border-color);
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-label {
	position: relative;
	z-index: 1;
	display: flex;
	overflow: hidden;
	width: 48px;
	height: 48px;
	margin-right: 0;
	box-sizing: border-box;

}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-label:not(.codicon) {
	font-size: 15px;
	line-height: 40px;
	padding: 0 0 0 48px;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-label.codicon {
	font-size: 24px;
	align-items: center;
	justify-content: center;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.active .action-label.codicon,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .action-label.codicon,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:hover .action-label.codicon {
	color: var(--vscode-activityBar-foreground) !important;
}
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.active .action-label.uri-icon,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .action-label.uri-icon,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:hover .action-label.uri-icon {
	background-color: var(--vscode-activityBar-foreground) !important;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .active-item-indicator:before,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .active-item-indicator:before {
	content: "";
	position: absolute;
	z-index: 1;
	top: 0;
	height: 100%;
	width: 0;
	border-left: 2px solid;
}

.monaco-workbench.hc-black .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .active-item-indicator:before,
.monaco-workbench.hc-black .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .active-item-indicator:before {
	border-color: var(--vscode-activityBar-activeBorder);
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked .active-item-indicator:before {
	top: 0;
	height: 100%;
}


/* Hides active elements in high contrast mode */
.monaco-workbench.hc-black .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator.action-item,
.monaco-workbench.hc-light .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator {
	display: none;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.clicked:focus:before,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item.clicked:focus .active-item-indicator::before {
	border-left: none !important; /* no focus feedback when using mouse */
}

.monaco-workbench .activitybar.left > .content :not(.monaco-menu) > .monaco-action-bar .action-item .active-item-indicator:before{
	left: 0;
}

.monaco-workbench .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .action-item .active-item-indicator:before {
	right: 0;
}

/* Hides outline on HC as focus is handled by border */
.monaco-workbench.hc-black .activitybar.left > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus:before,
.monaco-workbench.hc-black .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus:before,
.monaco-workbench.hc-light .activitybar.left > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus:before,
.monaco-workbench.hc-light .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus:before {
	outline: none;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .profile-badge,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .active-item-indicator,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .badge {
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto;
	left: 0;
	overflow: hidden;
	width: 100%;
	height: 100%;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .active-item-indicator,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .badge {
	z-index: 2;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .profile-badge {
	z-index: 1;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .active-item-indicator {
	pointer-events: none;
}

.monaco-workbench.border .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .active-item-indicator {
	left: -2px;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .badge .badge-content {
	position: absolute;
	top: 24px;
	right: 8px;
	font-size: 9px;
	font-weight: 600;
	min-width: 8px;
	height: 16px;
	line-height: 16px;
	padding: 0 4px;
	border-radius: 20px;
	text-align: center;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .profile-badge .profile-text-overlay {
	position: absolute;
	font-weight: 600;
	font-size: 9px;
	line-height: 10px;
	top: 24px;
	right: 6px;
	padding: 2px 3px;
	border-radius: 7px;
	background-color: var(--vscode-profileBadge-background);
	color: var(--vscode-profileBadge-foreground);
	border: 2px solid var(--vscode-activityBar-background);
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:active .profile-text-overlay,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:focus .profile-text-overlay,
.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .action-item:hover .profile-text-overlay {
	color: var(--vscode-activityBar-foreground);
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .badge .codicon.badge-content {
	font-size: 13px;
	font-weight: unset;
	padding: 0;
	justify-content: center;
}

.monaco-workbench .activitybar > .content :not(.monaco-menu) > .monaco-action-bar .badge .codicon.badge-content::before {
	text-align: center;
	vertical-align: baseline;
}

/* Right aligned */

.monaco-workbench .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .profile-badge,
.monaco-workbench .activitybar.right > .content :not(.monaco-menu) > .monaco-action-bar .badge {
	left: auto;
	right: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/activitybar/media/activitybarpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/activitybar/media/activitybarpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.activitybar {
	width: 48px;
	height: 100%;
}

.monaco-workbench .activitybar.bordered::before {
	content: '';
	float: left;
	position: absolute;
	box-sizing: border-box;
	height: 100%;
	width: 0px;
	border-color: inherit;
}

.monaco-workbench .activitybar.left.bordered::before {
	right: 0;
	border-right-style: solid;
	border-right-width: 1px;
}

.monaco-workbench .activitybar.right.bordered::before {
	left: 0;
	border-left-style: solid;
	border-left-width: 1px;
}

.monaco-workbench .activitybar > .content {
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

/** Viewlet Switcher */

.monaco-workbench .activitybar > .content .monaco-action-bar {
	text-align: left;
	background-color: inherit;
}

.monaco-workbench .activitybar .action-item:focus {
	outline: 0 !important; /* activity bar indicates focus custom */
}

.monaco-workbench .activitybar > .content > .composite-bar {
	margin-bottom: auto;
}

/** Menu Bar */

.monaco-workbench .activitybar .menubar {
	width: 100%;
	height: 35px;
}

.monaco-workbench .activitybar .menubar.compact .toolbar-toggle-more {
	width: 100%;
	height: 35px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/auxiliarybar/auxiliaryBarActions.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/auxiliarybar/auxiliaryBarActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { AuxiliaryBarMaximizedContext, AuxiliaryBarVisibleContext, IsAuxiliaryWindowContext } from '../../../common/contextkeys.js';
import { ViewContainerLocation, ViewContainerLocationToString } from '../../../common/views.js';
import { ActivityBarPosition, IWorkbenchLayoutService, LayoutSettings, Parts } from '../../../services/layout/browser/layoutService.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { SwitchCompositeViewAction } from '../compositeBarActions.js';
import { closeIcon as panelCloseIcon } from '../panel/panelActions.js';

const maximizeIcon = registerIcon('auxiliarybar-maximize', Codicon.screenFull, localize('maximizeIcon', 'Icon to maximize the secondary side bar.'));
const closeIcon = registerIcon('auxiliarybar-close', panelCloseIcon, localize('closeIcon', 'Icon to close the secondary side bar.'));

const auxiliaryBarRightIcon = registerIcon('auxiliarybar-right-layout-icon', Codicon.layoutSidebarRight, localize('toggleAuxiliaryIconRight', 'Icon to toggle the secondary side bar off in its right position.'));
const auxiliaryBarRightOffIcon = registerIcon('auxiliarybar-right-off-layout-icon', Codicon.layoutSidebarRightOff, localize('toggleAuxiliaryIconRightOn', 'Icon to toggle the secondary side bar on in its right position.'));
const auxiliaryBarLeftIcon = registerIcon('auxiliarybar-left-layout-icon', Codicon.layoutSidebarLeft, localize('toggleAuxiliaryIconLeft', 'Icon to toggle the secondary side bar in its left position.'));
const auxiliaryBarLeftOffIcon = registerIcon('auxiliarybar-left-off-layout-icon', Codicon.layoutSidebarLeftOff, localize('toggleAuxiliaryIconLeftOn', 'Icon to toggle the secondary side bar on in its left position.'));

export class ToggleAuxiliaryBarAction extends Action2 {

	static readonly ID = 'workbench.action.toggleAuxiliaryBar';
	static readonly LABEL = localize2('toggleAuxiliaryBar', "Toggle Secondary Side Bar Visibility");

	constructor() {
		super({
			id: ToggleAuxiliaryBarAction.ID,
			title: ToggleAuxiliaryBarAction.LABEL,
			toggled: {
				condition: AuxiliaryBarVisibleContext,
				title: localize('closeSecondarySideBar', 'Hide Secondary Side Bar'),
				icon: closeIcon,
				mnemonicTitle: localize({ key: 'miCloseSecondarySideBar', comment: ['&& denotes a mnemonic'] }, "&&Secondary Side Bar"),
			},
			icon: closeIcon,
			category: Categories.View,
			metadata: {
				description: localize('openAndCloseAuxiliaryBar', 'Open/Show and Close/Hide Secondary Side Bar'),
			},
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyB
			},
			menu: [
				{
					id: MenuId.LayoutControlMenuSubmenu,
					group: '0_workbench_layout',
					order: 1
				},
				{
					id: MenuId.MenubarAppearanceMenu,
					group: '2_workbench_layout',
					order: 2
				}
			]
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const isCurrentlyVisible = layoutService.isVisible(Parts.AUXILIARYBAR_PART);

		layoutService.setPartHidden(isCurrentlyVisible, Parts.AUXILIARYBAR_PART);

		// Announce visibility change to screen readers
		const alertMessage = isCurrentlyVisible
			? localize('auxiliaryBarHidden', "Secondary Side Bar hidden")
			: localize('auxiliaryBarVisible', "Secondary Side Bar shown");
		alert(alertMessage);
	}
}

registerAction2(ToggleAuxiliaryBarAction);

MenuRegistry.appendMenuItem(MenuId.AuxiliaryBarTitle, {
	command: {
		id: ToggleAuxiliaryBarAction.ID,
		title: localize('closeSecondarySideBar', 'Hide Secondary Side Bar'),
		icon: closeIcon
	},
	group: 'navigation',
	order: 2,
	when: ContextKeyExpr.equals(`config.${LayoutSettings.ACTIVITY_BAR_LOCATION}`, ActivityBarPosition.DEFAULT)
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.closeAuxiliaryBar',
			title: localize2('closeSecondarySideBar', 'Hide Secondary Side Bar'),
			category: Categories.View,
			precondition: AuxiliaryBarVisibleContext,
			f1: true,
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IWorkbenchLayoutService).setPartHidden(true, Parts.AUXILIARYBAR_PART);
	}
});

registerAction2(class FocusAuxiliaryBarAction extends Action2 {

	static readonly ID = 'workbench.action.focusAuxiliaryBar';
	static readonly LABEL = localize2('focusAuxiliaryBar', "Focus into Secondary Side Bar");

	constructor() {
		super({
			id: FocusAuxiliaryBarAction.ID,
			title: FocusAuxiliaryBarAction.LABEL,
			category: Categories.View,
			f1: true,
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const layoutService = accessor.get(IWorkbenchLayoutService);

		// Show auxiliary bar
		if (!layoutService.isVisible(Parts.AUXILIARYBAR_PART)) {
			layoutService.setPartHidden(false, Parts.AUXILIARYBAR_PART);
		}

		// Focus into active composite
		const composite = paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar);
		composite?.focus();
	}
});

MenuRegistry.appendMenuItems([
	{
		id: MenuId.LayoutControlMenu,
		item: {
			group: '2_pane_toggles',
			command: {
				id: ToggleAuxiliaryBarAction.ID,
				title: localize('toggleSecondarySideBar', "Toggle Secondary Side Bar"),
				toggled: { condition: AuxiliaryBarVisibleContext, icon: auxiliaryBarLeftIcon },
				icon: auxiliaryBarLeftOffIcon,
			},
			when: ContextKeyExpr.and(
				IsAuxiliaryWindowContext.negate(),
				ContextKeyExpr.or(
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'toggles'),
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')),
				ContextKeyExpr.equals('config.workbench.sideBar.location', 'right')
			),
			order: 0
		}
	}, {
		id: MenuId.LayoutControlMenu,
		item: {
			group: '2_pane_toggles',
			command: {
				id: ToggleAuxiliaryBarAction.ID,
				title: localize('toggleSecondarySideBar', "Toggle Secondary Side Bar"),
				toggled: { condition: AuxiliaryBarVisibleContext, icon: auxiliaryBarRightIcon },
				icon: auxiliaryBarRightOffIcon,
			},
			when: ContextKeyExpr.and(
				IsAuxiliaryWindowContext.negate(),
				ContextKeyExpr.or(
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'toggles'),
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')),
				ContextKeyExpr.equals('config.workbench.sideBar.location', 'left')
			),
			order: 2
		}
	}, {
		id: MenuId.ViewContainerTitleContext,
		item: {
			group: '3_workbench_layout_move',
			command: {
				id: ToggleAuxiliaryBarAction.ID,
				title: localize2('hideAuxiliaryBar', 'Hide Secondary Side Bar'),
			},
			when: ContextKeyExpr.and(AuxiliaryBarVisibleContext, ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar))),
			order: 2
		}
	}
]);

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.previousAuxiliaryBarView',
			title: localize2('previousAuxiliaryBarView', 'Previous Secondary Side Bar View'),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.AuxiliaryBar, -1);
	}
});

registerAction2(class extends SwitchCompositeViewAction {
	constructor() {
		super({
			id: 'workbench.action.nextAuxiliaryBarView',
			title: localize2('nextAuxiliaryBarView', 'Next Secondary Side Bar View'),
			category: Categories.View,
			f1: true
		}, ViewContainerLocation.AuxiliaryBar, 1);
	}
});

// --- Maximized Mode

class MaximizeAuxiliaryBar extends Action2 {

	static readonly ID = 'workbench.action.maximizeAuxiliaryBar';

	constructor() {
		super({
			id: MaximizeAuxiliaryBar.ID,
			title: localize2('maximizeAuxiliaryBar', 'Maximize Secondary Side Bar'),
			tooltip: localize('maximizeAuxiliaryBarTooltip', "Maximize Secondary Side Bar Size"),
			category: Categories.View,
			f1: true,
			precondition: AuxiliaryBarMaximizedContext.negate(),
			icon: maximizeIcon,
			menu: {
				id: MenuId.AuxiliaryBarTitle,
				group: 'navigation',
				order: 1,
				when: AuxiliaryBarMaximizedContext.negate()
			}
		});
	}

	run(accessor: ServicesAccessor) {
		const layoutService = accessor.get(IWorkbenchLayoutService);

		layoutService.setAuxiliaryBarMaximized(true);
	}
}
registerAction2(MaximizeAuxiliaryBar);

class RestoreAuxiliaryBar extends Action2 {

	static readonly ID = 'workbench.action.restoreAuxiliaryBar';

	constructor() {
		super({
			id: RestoreAuxiliaryBar.ID,
			title: localize2('restoreAuxiliaryBar', 'Restore Secondary Side Bar'),
			tooltip: localize('restoreAuxiliaryBarTooltip', "Restore Secondary Side Bar Size"),
			category: Categories.View,
			f1: true,
			precondition: AuxiliaryBarMaximizedContext,
			toggled: AuxiliaryBarMaximizedContext,
			icon: maximizeIcon,
			menu: {
				id: MenuId.AuxiliaryBarTitle,
				group: 'navigation',
				order: 1,
				when: AuxiliaryBarMaximizedContext
			}
		});
	}

	run(accessor: ServicesAccessor) {
		const layoutService = accessor.get(IWorkbenchLayoutService);

		layoutService.setAuxiliaryBarMaximized(false);
	}
}
registerAction2(RestoreAuxiliaryBar);

class ToggleMaximizedAuxiliaryBar extends Action2 {

	static readonly ID = 'workbench.action.toggleMaximizedAuxiliaryBar';

	constructor() {
		super({
			id: ToggleMaximizedAuxiliaryBar.ID,
			title: localize2('toggleMaximizedAuxiliaryBar', 'Toggle Maximized Secondary Side Bar'),
			f1: true,
			category: Categories.View
		});
	}

	run(accessor: ServicesAccessor) {
		const layoutService = accessor.get(IWorkbenchLayoutService);

		layoutService.toggleMaximizedAuxiliaryBar();
	}
}
registerAction2(ToggleMaximizedAuxiliaryBar);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/auxiliarybar/auxiliaryBarPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/auxiliarybar/auxiliaryBarPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/auxiliaryBarPart.css';
import { localize } from '../../../../nls.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ActiveAuxiliaryContext, AuxiliaryBarFocusContext } from '../../../common/contextkeys.js';
import { ACTIVITY_BAR_BADGE_BACKGROUND, ACTIVITY_BAR_BADGE_FOREGROUND, ACTIVITY_BAR_TOP_ACTIVE_BORDER, ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER, ACTIVITY_BAR_TOP_FOREGROUND, ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND, PANEL_ACTIVE_TITLE_BORDER, PANEL_ACTIVE_TITLE_FOREGROUND, PANEL_DRAG_AND_DROP_BORDER, PANEL_INACTIVE_TITLE_FOREGROUND, SIDE_BAR_BACKGROUND, SIDE_BAR_BORDER, SIDE_BAR_TITLE_BORDER, SIDE_BAR_FOREGROUND } from '../../../common/theme.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ActivityBarPosition, IWorkbenchLayoutService, LayoutSettings, Parts, Position } from '../../../services/layout/browser/layoutService.js';
import { HoverPosition } from '../../../../base/browser/ui/hover/hoverWidget.js';
import { IAction, Separator, SubmenuAction, toAction } from '../../../../base/common/actions.js';
import { ToggleAuxiliaryBarAction } from './auxiliaryBarActions.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { LayoutPriority } from '../../../../base/browser/ui/splitview/splitview.js';
import { ToggleSidebarPositionAction } from '../../actions/layoutActions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { AbstractPaneCompositePart, CompositeBarPosition } from '../paneCompositePart.js';
import { ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IPaneCompositeBarOptions } from '../paneCompositeBar.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { getContextMenuActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

interface IAuxiliaryBarPartConfiguration {
	position: ActivityBarPosition;

	canShowLabels: boolean;
	showLabels: boolean;
}

export class AuxiliaryBarPart extends AbstractPaneCompositePart {

	static readonly activeViewSettingsKey = 'workbench.auxiliarybar.activepanelid';
	static readonly pinnedViewsKey = 'workbench.auxiliarybar.pinnedPanels';
	static readonly placeholdeViewContainersKey = 'workbench.auxiliarybar.placeholderPanels';
	static readonly viewContainersWorkspaceStateKey = 'workbench.auxiliarybar.viewContainersWorkspaceState';

	// Use the side bar dimensions
	override readonly minimumWidth: number = 170;
	override readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	override readonly minimumHeight: number = 0;
	override readonly maximumHeight: number = Number.POSITIVE_INFINITY;

	get preferredHeight(): number | undefined {
		// Don't worry about titlebar or statusbar visibility
		// The difference is minimal and keeps this function clean
		return this.layoutService.mainContainerDimension.height * 0.4;
	}

	get preferredWidth(): number | undefined {
		const activeComposite = this.getActivePaneComposite();

		if (!activeComposite) {
			return undefined;
		}

		const width = activeComposite.getOptimalWidth();
		if (typeof width !== 'number') {
			return undefined;
		}

		return Math.max(width, 300);
	}

	readonly priority = LayoutPriority.Low;

	private configuration: IAuxiliaryBarPartConfiguration;

	constructor(
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IHoverService hoverService: IHoverService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionService extensionService: IExtensionService,
		@ICommandService private commandService: ICommandService,
		@IMenuService menuService: IMenuService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super(
			Parts.AUXILIARYBAR_PART,
			{
				hasTitle: true,
				trailingSeparator: true,
				borderWidth: () => (this.getColor(SIDE_BAR_BORDER) || this.getColor(contrastBorder)) ? 1 : 0,
			},
			AuxiliaryBarPart.activeViewSettingsKey,
			ActiveAuxiliaryContext.bindTo(contextKeyService),
			AuxiliaryBarFocusContext.bindTo(contextKeyService),
			'auxiliarybar',
			'auxiliarybar',
			undefined,
			SIDE_BAR_TITLE_BORDER,
			notificationService,
			storageService,
			contextMenuService,
			layoutService,
			keybindingService,
			hoverService,
			instantiationService,
			themeService,
			viewDescriptorService,
			contextKeyService,
			extensionService,
			menuService,
		);

		this.configuration = this.resolveConfiguration();

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(LayoutSettings.ACTIVITY_BAR_LOCATION)) {
				this.configuration = this.resolveConfiguration();
				this.onDidChangeActivityBarLocation();
			} else if (e.affectsConfiguration('workbench.secondarySideBar.showLabels')) {
				this.configuration = this.resolveConfiguration();
				this.updateCompositeBar(true);
			}
		}));
	}

	private resolveConfiguration(): IAuxiliaryBarPartConfiguration {
		const position = this.configurationService.getValue<ActivityBarPosition>(LayoutSettings.ACTIVITY_BAR_LOCATION);

		const canShowLabels = position !== ActivityBarPosition.TOP && position !== ActivityBarPosition.BOTTOM; // use same style as activity bar in this case
		const showLabels = canShowLabels && this.configurationService.getValue('workbench.secondarySideBar.showLabels') !== false;

		return { position, canShowLabels, showLabels };
	}

	private onDidChangeActivityBarLocation(): void {
		this.updateCompositeBar();

		const id = this.getActiveComposite()?.getId();
		if (id) {
			this.onTitleAreaUpdate(id);
		}
	}

	override updateStyles(): void {
		super.updateStyles();

		const container = assertReturnsDefined(this.getContainer());
		container.style.backgroundColor = this.getColor(SIDE_BAR_BACKGROUND) || '';
		const borderColor = this.getColor(SIDE_BAR_BORDER) || this.getColor(contrastBorder);
		const isPositionLeft = this.layoutService.getSideBarPosition() === Position.RIGHT;

		container.style.color = this.getColor(SIDE_BAR_FOREGROUND) || '';

		container.style.borderLeftColor = borderColor ?? '';
		container.style.borderRightColor = borderColor ?? '';

		container.style.borderLeftStyle = borderColor && !isPositionLeft ? 'solid' : 'none';
		container.style.borderRightStyle = borderColor && isPositionLeft ? 'solid' : 'none';

		container.style.borderLeftWidth = borderColor && !isPositionLeft ? '1px' : '0px';
		container.style.borderRightWidth = borderColor && isPositionLeft ? '1px' : '0px';
	}

	protected getCompositeBarOptions(): IPaneCompositeBarOptions {
		const $this = this;
		return {
			partContainerClass: 'auxiliarybar',
			pinnedViewContainersKey: AuxiliaryBarPart.pinnedViewsKey,
			placeholderViewContainersKey: AuxiliaryBarPart.placeholdeViewContainersKey,
			viewContainersWorkspaceStateKey: AuxiliaryBarPart.viewContainersWorkspaceStateKey,
			icon: !this.configuration.showLabels,
			orientation: ActionsOrientation.HORIZONTAL,
			recomputeSizes: true,
			activityHoverOptions: {
				position: () => this.getCompositeBarPosition() === CompositeBarPosition.BOTTOM ? HoverPosition.ABOVE : HoverPosition.BELOW,
			},
			fillExtraContextMenuActions: actions => this.fillExtraContextMenuActions(actions),
			compositeSize: 0,
			iconSize: 16,
			// Add 10px spacing if the overflow action is visible to no confuse the user with ... between the toolbars
			get overflowActionSize() { return $this.getCompositeBarPosition() === CompositeBarPosition.TITLE ? 40 : 30; },
			colors: theme => ({
				activeBackgroundColor: theme.getColor(SIDE_BAR_BACKGROUND),
				inactiveBackgroundColor: theme.getColor(SIDE_BAR_BACKGROUND),
				get activeBorderBottomColor() { return $this.getCompositeBarPosition() === CompositeBarPosition.TITLE ? theme.getColor(PANEL_ACTIVE_TITLE_BORDER) : theme.getColor(ACTIVITY_BAR_TOP_ACTIVE_BORDER); },
				get activeForegroundColor() { return $this.getCompositeBarPosition() === CompositeBarPosition.TITLE ? theme.getColor(PANEL_ACTIVE_TITLE_FOREGROUND) : theme.getColor(ACTIVITY_BAR_TOP_FOREGROUND); },
				get inactiveForegroundColor() { return $this.getCompositeBarPosition() === CompositeBarPosition.TITLE ? theme.getColor(PANEL_INACTIVE_TITLE_FOREGROUND) : theme.getColor(ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND); },
				badgeBackground: theme.getColor(ACTIVITY_BAR_BADGE_BACKGROUND),
				badgeForeground: theme.getColor(ACTIVITY_BAR_BADGE_FOREGROUND),
				get dragAndDropBorder() { return $this.getCompositeBarPosition() === CompositeBarPosition.TITLE ? theme.getColor(PANEL_DRAG_AND_DROP_BORDER) : theme.getColor(ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER); }
			}),
			compact: true
		};
	}

	private fillExtraContextMenuActions(actions: IAction[]): void {
		const currentPositionRight = this.layoutService.getSideBarPosition() === Position.LEFT;

		if (this.getCompositeBarPosition() === CompositeBarPosition.TITLE) {
			const viewsSubmenuAction = this.getViewsSubmenuAction();
			if (viewsSubmenuAction) {
				actions.push(new Separator());
				actions.push(viewsSubmenuAction);
			}
		}

		const activityBarPositionMenu = this.menuService.getMenuActions(MenuId.ActivityBarPositionMenu, this.contextKeyService, { shouldForwardArgs: true, renderShortTitle: true });
		const positionActions = getContextMenuActions(activityBarPositionMenu).secondary;

		const toggleShowLabelsAction = toAction({
			id: 'workbench.action.auxiliarybar.toggleShowLabels',
			label: this.configuration.showLabels ? localize('showIcons', "Show Icons") : localize('showLabels', "Show Labels"),
			enabled: this.configuration.canShowLabels,
			run: () => this.configurationService.updateValue('workbench.secondarySideBar.showLabels', !this.configuration.showLabels)
		});

		actions.push(...[
			new Separator(),
			new SubmenuAction('workbench.action.panel.position', localize('activity bar position', "Activity Bar Position"), positionActions),
			toAction({ id: ToggleSidebarPositionAction.ID, label: currentPositionRight ? localize('move second side bar left', "Move Secondary Side Bar Left") : localize('move second side bar right', "Move Secondary Side Bar Right"), run: () => this.commandService.executeCommand(ToggleSidebarPositionAction.ID) }),
			toggleShowLabelsAction,
			toAction({ id: ToggleAuxiliaryBarAction.ID, label: localize('hide second side bar', "Hide Secondary Side Bar"), run: () => this.commandService.executeCommand(ToggleAuxiliaryBarAction.ID) })
		]);
	}

	protected shouldShowCompositeBar(): boolean {
		return this.configuration.position !== ActivityBarPosition.HIDDEN;
	}

	protected getCompositeBarPosition(): CompositeBarPosition {
		switch (this.configuration.position) {
			case ActivityBarPosition.TOP: return CompositeBarPosition.TOP;
			case ActivityBarPosition.BOTTOM: return CompositeBarPosition.BOTTOM;
			case ActivityBarPosition.HIDDEN: return CompositeBarPosition.TITLE;
			case ActivityBarPosition.DEFAULT: return CompositeBarPosition.TITLE;
			default: return CompositeBarPosition.TITLE;
		}
	}

	override toJSON(): object {
		return {
			type: Parts.AUXILIARYBAR_PART
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/auxiliarybar/media/auxiliaryBarPart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/auxiliarybar/media/auxiliaryBarPart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench.noauxiliarybar .part.auxiliarybar {
	display: none !important;
	visibility: hidden !important;
}

.monaco-workbench .part.auxiliarybar > .content .monaco-editor,
.monaco-workbench .part.auxiliarybar > .content .monaco-editor .margin,
.monaco-workbench .part.auxiliarybar > .content .monaco-editor .monaco-editor-background {
	background-color: var(--vscode-sideBar-background);
}

.monaco-workbench .part.auxiliarybar .title-actions .actions-container {
	justify-content: flex-end;
}

.monaco-workbench .part.auxiliarybar .title-actions .action-item {
	margin-right: 4px;
}

.monaco-workbench .part.auxiliarybar > .title {
	background-color: var(--vscode-sideBarTitle-background);
}

.monaco-workbench .part.auxiliarybar > .title > .title-label {
	flex: 1;
}

.monaco-workbench .part.auxiliarybar > .title > .title-label h2 {
	text-transform: uppercase;
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container {
	flex: 1;
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus {
	outline: 0 !important; /* activity bar indicates focus custom */
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label {
	outline-offset: 2px;
}

.hc-black .monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-black .monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-light .monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label,
.hc-light .monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label {
	border-radius: 0px;
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label::before,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item .action-label::before {
	position: absolute;
	left: 5px; /* place icon in center */
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator:before,
.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked.clicked:focus .active-item-indicator:before {
	border-top-color: var(--vscode-panelTitle-activeBorder) !important;
}

.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked:not(:focus) .active-item-indicator:before,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked.clicked:focus .active-item-indicator:before {
	border-top-color: var(--vscode-activityBarTop-activeBorder) !important;
}

.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label {
	color: var(--vscode-sideBarTitle-foreground) !important;
}

.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:focus .action-label {
	color: var(--vscode-activityBarTop-foreground) !important;
}

.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label,
.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label,
.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item.checked .action-label,
.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:hover .action-label {
	outline: var(--vscode-contrastActiveBorder, unset) solid 1px !important;
}

.monaco-workbench .part.auxiliarybar > .header-or-footer > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.checked):hover .action-label,
.monaco-workbench .part.auxiliarybar > .title > .composite-bar-container > .composite-bar > .monaco-action-bar .action-item:not(.checked):hover .action-label {
	outline: var(--vscode-contrastActiveBorder, unset) dashed 1px !important;
}

.monaco-workbench .auxiliarybar.part.pane-composite-part > .composite.title > .title-actions {
	flex: inherit;
}

.monaco-workbench .auxiliarybar.pane-composite-part > .title.has-composite-bar > .title-actions .monaco-action-bar .action-item {
	max-width: 150px;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/banner/bannerPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/banner/bannerPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/bannerpart.css';
import { localize, localize2 } from '../../../../nls.js';
import { $, addDisposableListener, append, clearNode, EventType, isHTMLElement } from '../../../../base/browser/dom.js';
import { asCSSUrl } from '../../../../base/browser/cssValue.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Part } from '../../part.js';
import { IWorkbenchLayoutService, Parts } from '../../../services/layout/browser/layoutService.js';
import { Action } from '../../../../base/common/actions.js';
import { Link } from '../../../../platform/opener/browser/link.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { Emitter } from '../../../../base/common/event.js';
import { IBannerItem, IBannerService } from '../../../services/banner/browser/bannerService.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { URI } from '../../../../base/common/uri.js';
import { widgetClose } from '../../../../platform/theme/common/iconRegistry.js';
import { BannerFocused } from '../../../common/contextkeys.js';

// Banner Part

export class BannerPart extends Part implements IBannerService {

	declare readonly _serviceBrand: undefined;

	// #region IView

	readonly height: number = 26;
	readonly minimumWidth: number = 0;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;

	get minimumHeight(): number {
		return this.visible ? this.height : 0;
	}

	get maximumHeight(): number {
		return this.visible ? this.height : 0;
	}

	private _onDidChangeSize = this._register(new Emitter<{ width: number; height: number } | undefined>());
	override get onDidChange() { return this._onDidChangeSize.event; }

	//#endregion

	private item: IBannerItem | undefined;
	private visible = false;

	private actionBar: ActionBar | undefined;
	private messageActionsContainer: HTMLElement | undefined;
	private focusedActionIndex: number = -1;

	constructor(
		@IThemeService themeService: IThemeService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IStorageService storageService: IStorageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super(Parts.BANNER_PART, { hasTitle: false }, themeService, storageService, layoutService);
	}

	protected override createContentArea(parent: HTMLElement): HTMLElement {
		this.element = parent;
		this.element.tabIndex = 0;

		// Restore focused action if needed
		this._register(addDisposableListener(this.element, EventType.FOCUS, () => {
			if (this.focusedActionIndex !== -1) {
				this.focusActionLink();
			}
		}));

		// Track focus
		const scopedContextKeyService = this._register(this.contextKeyService.createScoped(this.element));
		BannerFocused.bindTo(scopedContextKeyService).set(true);

		return this.element;
	}

	private close(item: IBannerItem): void {
		// Hide banner
		this.setVisibility(false);

		// Remove from document
		clearNode(this.element);

		// Remember choice
		if (typeof item.onClose === 'function') {
			item.onClose();
		}

		this.item = undefined;
	}

	private focusActionLink(): void {
		const length = this.item?.actions?.length ?? 0;

		if (this.focusedActionIndex < length) {
			const actionLink = this.messageActionsContainer?.children[this.focusedActionIndex];
			if (isHTMLElement(actionLink)) {
				this.actionBar?.setFocusable(false);
				actionLink.focus();
			}
		} else {
			this.actionBar?.focus(0);
		}
	}

	private getAriaLabel(item: IBannerItem): string | undefined {
		if (item.ariaLabel) {
			return item.ariaLabel;
		}
		if (typeof item.message === 'string') {
			return item.message;
		}

		return undefined;
	}

	private getBannerMessage(message: MarkdownString | string): HTMLElement {
		if (typeof message === 'string') {
			const element = $('span');
			element.textContent = message;
			return element;
		}

		return this.markdownRendererService.render(message).element;
	}

	private setVisibility(visible: boolean): void {
		if (visible !== this.visible) {
			this.visible = visible;
			this.focusedActionIndex = -1;

			this.layoutService.setPartHidden(!visible, Parts.BANNER_PART);
			this._onDidChangeSize.fire(undefined);
		}
	}

	focus(): void {
		this.focusedActionIndex = -1;
		this.element.focus();
	}

	focusNextAction(): void {
		const length = this.item?.actions?.length ?? 0;
		this.focusedActionIndex = this.focusedActionIndex < length ? this.focusedActionIndex + 1 : 0;

		this.focusActionLink();
	}

	focusPreviousAction(): void {
		const length = this.item?.actions?.length ?? 0;
		this.focusedActionIndex = this.focusedActionIndex > 0 ? this.focusedActionIndex - 1 : length;

		this.focusActionLink();
	}

	hide(id: string): void {
		if (this.item?.id !== id) {
			return;
		}

		this.setVisibility(false);
	}

	show(item: IBannerItem): void {
		if (item.id === this.item?.id) {
			this.setVisibility(true);
			return;
		}

		// Clear previous item
		clearNode(this.element);

		// Banner aria label
		const ariaLabel = this.getAriaLabel(item);
		if (ariaLabel) {
			this.element.setAttribute('aria-label', ariaLabel);
		}

		// Icon
		const iconContainer = append(this.element, $('div.icon-container'));
		iconContainer.setAttribute('aria-hidden', 'true');

		if (ThemeIcon.isThemeIcon(item.icon)) {
			iconContainer.appendChild($(`div${ThemeIcon.asCSSSelector(item.icon)}`));
		} else {
			iconContainer.classList.add('custom-icon');

			if (URI.isUri(item.icon)) {
				iconContainer.style.backgroundImage = asCSSUrl(item.icon);
			}
		}

		// Message
		const messageContainer = append(this.element, $('div.message-container'));
		messageContainer.setAttribute('aria-hidden', 'true');
		messageContainer.appendChild(this.getBannerMessage(item.message));

		// Message Actions
		this.messageActionsContainer = append(this.element, $('div.message-actions-container'));
		if (item.actions) {
			for (const action of item.actions) {
				this._register(this.instantiationService.createInstance(Link, this.messageActionsContainer, { ...action, tabIndex: -1 }, {}));
			}
		}

		// Action
		const actionBarContainer = append(this.element, $('div.action-container'));
		this.actionBar = this._register(new ActionBar(actionBarContainer));
		const label = item.closeLabel ?? localize('closeBanner', "Close Banner");
		const closeAction = this._register(new Action('banner.close', label, ThemeIcon.asClassName(widgetClose), true, () => this.close(item)));
		this.actionBar.push(closeAction, { icon: true, label: false });
		this.actionBar.setFocusable(false);

		this.setVisibility(true);
		this.item = item;
	}

	toJSON(): object {
		return {
			type: Parts.BANNER_PART
		};
	}
}

registerSingleton(IBannerService, BannerPart, InstantiationType.Eager);


// Keybindings

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.banner.focusBanner',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Escape,
	when: BannerFocused,
	handler: (accessor: ServicesAccessor) => {
		const bannerService = accessor.get(IBannerService);
		bannerService.focus();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.banner.focusNextAction',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.RightArrow,
	secondary: [KeyCode.DownArrow],
	when: BannerFocused,
	handler: (accessor: ServicesAccessor) => {
		const bannerService = accessor.get(IBannerService);
		bannerService.focusNextAction();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.banner.focusPreviousAction',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.LeftArrow,
	secondary: [KeyCode.UpArrow],
	when: BannerFocused,
	handler: (accessor: ServicesAccessor) => {
		const bannerService = accessor.get(IBannerService);
		bannerService.focusPreviousAction();
	}
});


// Actions

class FocusBannerAction extends Action2 {

	static readonly ID = 'workbench.action.focusBanner';
	static readonly LABEL = localize2('focusBanner', "Focus Banner");

	constructor() {
		super({
			id: FocusBannerAction.ID,
			title: FocusBannerAction.LABEL,
			category: Categories.View,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		layoutService.focusPart(Parts.BANNER_PART);
	}
}

registerAction2(FocusBannerAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/banner/media/bannerpart.css]---
Location: vscode-main/src/vs/workbench/browser/parts/banner/media/bannerpart.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part.banner {
	background-color: var(--vscode-banner-background);
	color: var(--vscode-banner-foreground);
	box-sizing: border-box;
	cursor: default;
	width: 100%;
	height: 100%;
	font-size: 12px;
	display: flex;
	overflow: visible;
}

.monaco-workbench .part.banner .icon-container {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	padding: 0 6px 0 10px;
}

.monaco-workbench .part.banner .icon-container .codicon {
	color: var(--vscode-banner-iconForeground);
}

.monaco-workbench .part.banner .icon-container.custom-icon {
	background-repeat: no-repeat;
	background-position: center center;
	background-size: 16px;
	background-image: url('../../../../browser/media/code-icon.svg');
	width: 16px;
	padding: 0;
	margin: 0 6px 0 10px;
}

.monaco-workbench .part.banner .message-container {
	line-height: 26px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}

.monaco-workbench .part.banner .message-container a {
	color: var(--vscode-banner-foreground);
}

.monaco-workbench .part.banner .message-container p {
	margin-block-start: 0;
	margin-block-end: 0;
}

.monaco-workbench .part.banner .message-actions-container {
	flex-grow: 1;
	flex-shrink: 0;
	line-height: 26px;
}

.monaco-workbench .part.banner .message-actions-container a {
	color: var(--vscode-banner-foreground);
	padding: 3px;
	margin-left: 12px;
	text-decoration: underline;
	cursor: pointer;
}

.monaco-workbench .part.banner .message-container a {
	text-decoration: underline;
	cursor: pointer;
}

.monaco-workbench .part.banner .action-container {
	padding: 0 10px 0 6px;
}

.monaco-workbench .part.banner .action-container .codicon {
	color: var(--vscode-banner-foreground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/dialogs/dialog.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/dialogs/dialog.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IDialogHandler, IDialogResult, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IDialogsModel, IDialogViewItem } from '../../../common/dialogs.js';
import { BrowserDialogHandler } from './dialogHandler.js';
import { DialogService } from '../../../services/dialogs/common/dialogService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { createBrowserAboutDialogDetails } from '../../../../platform/dialogs/browser/dialog.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';

export class DialogHandlerContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.dialogHandler';

	private readonly model: IDialogsModel;
	private readonly impl: Lazy<IDialogHandler>;

	private currentDialog: IDialogViewItem | undefined;

	constructor(
		@IDialogService private dialogService: IDialogService,
		@ILogService logService: ILogService,
		@ILayoutService layoutService: ILayoutService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IProductService private productService: IProductService,
		@IClipboardService clipboardService: IClipboardService,
		@IOpenerService openerService: IOpenerService,
		@IMarkdownRendererService markdownRendererService: IMarkdownRendererService,
	) {
		super();

		this.impl = new Lazy(() => new BrowserDialogHandler(logService, layoutService, keybindingService, instantiationService, clipboardService, openerService, markdownRendererService));
		this.model = (this.dialogService as DialogService).model;

		this._register(this.model.onWillShowDialog(() => {
			if (!this.currentDialog) {
				this.processDialogs();
			}
		}));

		this.processDialogs();
	}

	private async processDialogs(): Promise<void> {
		while (this.model.dialogs.length) {
			this.currentDialog = this.model.dialogs[0];

			let result: IDialogResult | Error | undefined = undefined;
			try {
				if (this.currentDialog.args.confirmArgs) {
					const args = this.currentDialog.args.confirmArgs;
					result = await this.impl.value.confirm(args.confirmation);
				} else if (this.currentDialog.args.inputArgs) {
					const args = this.currentDialog.args.inputArgs;
					result = await this.impl.value.input(args.input);
				} else if (this.currentDialog.args.promptArgs) {
					const args = this.currentDialog.args.promptArgs;
					result = await this.impl.value.prompt(args.prompt);
				} else {
					const aboutDialogDetails = createBrowserAboutDialogDetails(this.productService);
					await this.impl.value.about(aboutDialogDetails.title, aboutDialogDetails.details, aboutDialogDetails.detailsToCopy);
				}
			} catch (error) {
				result = error;
			}

			this.currentDialog.close(result);
			this.currentDialog = undefined;
		}
	}
}

registerWorkbenchContribution2(
	DialogHandlerContribution.ID,
	DialogHandlerContribution,
	WorkbenchPhase.BlockStartup // Block to allow for dialogs to show before restore finished
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/dialogs/dialogHandler.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/dialogs/dialogHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IConfirmation, IConfirmationResult, IInputResult, ICheckbox, IInputElement, ICustomDialogOptions, IInput, AbstractDialogHandler, DialogType, IPrompt, IAsyncPromptResult } from '../../../../platform/dialogs/common/dialogs.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import Severity from '../../../../base/common/severity.js';
import { Dialog, IDialogResult } from '../../../../base/browser/ui/dialog/dialog.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkdownRendererService, openLinkFromMarkdown } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { createWorkbenchDialogOptions } from '../../../../platform/dialogs/browser/dialog.js';

export class BrowserDialogHandler extends AbstractDialogHandler {

	private static readonly ALLOWABLE_COMMANDS = [
		'copy',
		'cut',
		'editor.action.selectAll',
		'editor.action.clipboardCopyAction',
		'editor.action.clipboardCutAction',
		'editor.action.clipboardPasteAction'
	];

	constructor(
		@ILogService private readonly logService: ILogService,
		@ILayoutService private readonly layoutService: ILayoutService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IClipboardService private readonly clipboardService: IClipboardService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		super();
	}

	async prompt<T>(prompt: IPrompt<T>): Promise<IAsyncPromptResult<T>> {
		this.logService.trace('DialogService#prompt', prompt.message);

		const buttons = this.getPromptButtons(prompt);

		const { button, checkboxChecked } = await this.doShow(prompt.type, prompt.message, buttons, prompt.detail, prompt.cancelButton ? buttons.length - 1 : -1 /* Disabled */, prompt.checkbox, undefined, typeof prompt?.custom === 'object' ? prompt.custom : undefined);

		return this.getPromptResult(prompt, button, checkboxChecked);
	}

	async confirm(confirmation: IConfirmation): Promise<IConfirmationResult> {
		this.logService.trace('DialogService#confirm', confirmation.message);

		const buttons = this.getConfirmationButtons(confirmation);

		const { button, checkboxChecked } = await this.doShow(confirmation.type ?? 'question', confirmation.message, buttons, confirmation.detail, buttons.length - 1, confirmation.checkbox, undefined, typeof confirmation?.custom === 'object' ? confirmation.custom : undefined);

		return { confirmed: button === 0, checkboxChecked };
	}

	async input(input: IInput): Promise<IInputResult> {
		this.logService.trace('DialogService#input', input.message);

		const buttons = this.getInputButtons(input);

		const { button, checkboxChecked, values } = await this.doShow(input.type ?? 'question', input.message, buttons, input.detail, buttons.length - 1, input?.checkbox, input.inputs, typeof input.custom === 'object' ? input.custom : undefined);

		return { confirmed: button === 0, checkboxChecked, values };
	}

	async about(title: string, details: string, detailsToCopy: string): Promise<void> {

		const { button } = await this.doShow(
			Severity.Info,
			title,
			[
				localize({ key: 'copy', comment: ['&& denotes a mnemonic'] }, "&&Copy"),
				localize('ok', "OK")
			],
			details,
			1
		);

		if (button === 0) {
			this.clipboardService.writeText(detailsToCopy);
		}
	}

	private async doShow(type: Severity | DialogType | undefined, message: string, buttons?: string[], detail?: string, cancelId?: number, checkbox?: ICheckbox, inputs?: IInputElement[], customOptions?: ICustomDialogOptions): Promise<IDialogResult> {
		const dialogDisposables = new DisposableStore();

		const renderBody = customOptions ? (parent: HTMLElement) => {
			parent.classList.add(...(customOptions.classes || []));
			customOptions.markdownDetails?.forEach(markdownDetail => {
				const result = dialogDisposables.add(this.markdownRendererService.render(markdownDetail.markdown, {
					actionHandler: markdownDetail.actionHandler || ((link, mdStr) => {
						return openLinkFromMarkdown(this.openerService, link, mdStr.isTrusted, true /* skip URL validation to prevent another dialog from showing which is unsupported */);
					}),
				}));
				parent.appendChild(result.element);
				result.element.classList.add(...(markdownDetail.classes || []));
			});
		} : undefined;

		const dialog = new Dialog(
			this.layoutService.activeContainer,
			message,
			buttons,
			createWorkbenchDialogOptions({
				detail,
				cancelId,
				type: this.getDialogType(type),
				renderBody,
				icon: customOptions?.icon,
				disableCloseAction: customOptions?.disableCloseAction,
				buttonOptions: customOptions?.buttonDetails?.map(detail => ({ sublabel: detail })),
				checkboxLabel: checkbox?.label,
				checkboxChecked: checkbox?.checked,
				inputs
			}, this.keybindingService, this.layoutService, BrowserDialogHandler.ALLOWABLE_COMMANDS)
		);

		dialogDisposables.add(dialog);

		const result = await dialog.show();
		dialogDisposables.dispose();

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/auxiliaryEditorPart.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/auxiliaryEditorPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onDidChangeFullscreen } from '../../../../base/browser/browser.js';
import { $, getActiveWindow, hide, show } from '../../../../base/browser/dom.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, markAsSingleton, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { isNative } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { hasCustomTitlebar } from '../../../../platform/window/common/window.js';
import { IEditorGroupView, IEditorPartsView } from './editor.js';
import { EditorPart, IEditorPartUIState } from './editorPart.js';
import { IAuxiliaryTitlebarPart } from '../titlebar/titlebarPart.js';
import { WindowTitle } from '../titlebar/windowTitle.js';
import { IAuxiliaryWindowOpenOptions, IAuxiliaryWindowService } from '../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { GroupDirection, GroupsOrder, IAuxiliaryEditorPart } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkbenchLayoutService, shouldShowCustomTitleBar } from '../../../services/layout/browser/layoutService.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';
import { IStatusbarService } from '../../../services/statusbar/browser/statusbar.js';
import { ITitleService } from '../../../services/title/browser/titleService.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { localize, localize2 } from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IsAuxiliaryWindowContext, IsAuxiliaryWindowFocusedContext, IsCompactTitleBarContext } from '../../../common/contextkeys.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { GroupIdentifier } from '../../../common/editor.js';

export interface IAuxiliaryEditorPartOpenOptions extends IAuxiliaryWindowOpenOptions {
	readonly state?: IEditorPartUIState;
}

export interface ICreateAuxiliaryEditorPartResult {
	readonly part: AuxiliaryEditorPartImpl;
	readonly instantiationService: IInstantiationService;
	readonly disposables: DisposableStore;
}

const compactWindowEmitter = markAsSingleton(new Emitter<{ windowId: number; compact: boolean | 'toggle' }>());

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleCompactAuxiliaryWindow',
			title: localize2('toggleCompactAuxiliaryWindow', "Toggle Window Compact Mode"),
			category: Categories.View,
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext
		});
	}

	override async run(): Promise<void> {
		compactWindowEmitter.fire({ windowId: getActiveWindow().vscodeWindowId, compact: 'toggle' });
	}
});

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.enableCompactAuxiliaryWindow',
			title: localize('enableCompactAuxiliaryWindow', "Turn On Compact Mode"),
			icon: Codicon.screenFull,
			menu: {
				id: MenuId.LayoutControlMenu,
				when: ContextKeyExpr.and(IsCompactTitleBarContext.toNegated(), IsAuxiliaryWindowContext),
				order: 0
			}
		});
	}

	override async run(): Promise<void> {
		compactWindowEmitter.fire({ windowId: getActiveWindow().vscodeWindowId, compact: true });
	}
});

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.disableCompactAuxiliaryWindow',
			title: localize('disableCompactAuxiliaryWindow', "Turn Off Compact Mode"),
			icon: Codicon.screenNormal,
			menu: {
				id: MenuId.LayoutControlMenu,
				when: ContextKeyExpr.and(IsCompactTitleBarContext, IsAuxiliaryWindowContext),
				order: 0
			}
		});
	}

	override async run(): Promise<void> {
		compactWindowEmitter.fire({ windowId: getActiveWindow().vscodeWindowId, compact: false });
	}
});

export class AuxiliaryEditorPart {

	private static STATUS_BAR_VISIBILITY = 'workbench.statusBar.visible';

	constructor(
		private readonly editorPartsView: IEditorPartsView,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IAuxiliaryWindowService private readonly auxiliaryWindowService: IAuxiliaryWindowService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@ITitleService private readonly titleService: ITitleService,
		@IEditorService private readonly editorService: IEditorService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService
	) {
	}

	async create(label: string, options?: IAuxiliaryEditorPartOpenOptions): Promise<ICreateAuxiliaryEditorPartResult> {
		const that = this;
		const disposables = new DisposableStore();

		let compact = Boolean(options?.compact);

		function computeEditorPartHeightOffset(): number {
			let editorPartHeightOffset = 0;

			if (statusbarVisible) {
				editorPartHeightOffset += statusbarPart.height;
			}

			if (titlebarPart && titlebarVisible) {
				editorPartHeightOffset += titlebarPart.height;
			}

			return editorPartHeightOffset;
		}

		function updateStatusbarVisibility(fromEvent: boolean): void {
			if (statusbarVisible) {
				show(statusbarPart.container);
			} else {
				hide(statusbarPart.container);
			}

			if (fromEvent) {
				auxiliaryWindow.layout();
			}
		}

		function updateTitlebarVisibility(fromEvent: boolean): void {
			if (!titlebarPart) {
				return;
			}

			if (titlebarVisible) {
				show(titlebarPart.container);
			} else {
				hide(titlebarPart.container);
			}

			if (fromEvent) {
				auxiliaryWindow.layout();
			}
		}

		function updateCompact(newCompact: boolean): void {
			if (newCompact === compact) {
				return;
			}

			compact = newCompact;
			auxiliaryWindow.updateOptions({ compact });
			titlebarPart?.updateOptions({ compact });
			editorPart.updateOptions({ compact });

			const oldStatusbarVisible = statusbarVisible;
			statusbarVisible = !compact && that.configurationService.getValue<boolean>(AuxiliaryEditorPart.STATUS_BAR_VISIBILITY) !== false;
			if (oldStatusbarVisible !== statusbarVisible) {
				updateStatusbarVisibility(true);
			}
		}

		// Auxiliary Window
		const auxiliaryWindow = disposables.add(await this.auxiliaryWindowService.open(options));

		// Editor Part
		const editorPartContainer = $('.part.editor', { role: 'main' });
		editorPartContainer.style.position = 'relative';
		auxiliaryWindow.container.appendChild(editorPartContainer);

		const editorPart = disposables.add(this.instantiationService.createInstance(AuxiliaryEditorPartImpl, auxiliaryWindow.window.vscodeWindowId, this.editorPartsView, options?.state, label));
		editorPart.updateOptions({ compact });
		disposables.add(this.editorPartsView.registerPart(editorPart));
		editorPart.create(editorPartContainer);

		const scopedEditorPartInstantiationService = disposables.add(editorPart.scopedInstantiationService.createChild(new ServiceCollection(
			[IEditorService, this.editorService.createScoped(editorPart, disposables)]
		)));

		// Titlebar
		let titlebarPart: IAuxiliaryTitlebarPart | undefined = undefined;
		let titlebarVisible = false;
		const useCustomTitle = isNative && hasCustomTitlebar(this.configurationService); // custom title in aux windows only enabled in native
		if (useCustomTitle) {
			titlebarPart = disposables.add(this.titleService.createAuxiliaryTitlebarPart(auxiliaryWindow.container, editorPart, scopedEditorPartInstantiationService));
			titlebarPart.updateOptions({ compact });
			titlebarVisible = shouldShowCustomTitleBar(this.configurationService, auxiliaryWindow.window, undefined);

			const handleTitleBarVisibilityEvent = () => {
				const oldTitlebarPartVisible = titlebarVisible;
				titlebarVisible = shouldShowCustomTitleBar(this.configurationService, auxiliaryWindow.window, undefined);
				if (oldTitlebarPartVisible !== titlebarVisible) {
					updateTitlebarVisibility(true);
				}
			};

			disposables.add(titlebarPart.onDidChange(() => auxiliaryWindow.layout()));
			disposables.add(this.layoutService.onDidChangePartVisibility(() => handleTitleBarVisibilityEvent()));
			disposables.add(onDidChangeFullscreen(windowId => {
				if (windowId !== auxiliaryWindow.window.vscodeWindowId) {
					return; // ignore all but our window
				}

				handleTitleBarVisibilityEvent();
			}));

			updateTitlebarVisibility(false);
		} else {
			disposables.add(scopedEditorPartInstantiationService.createInstance(WindowTitle, auxiliaryWindow.window));
		}

		// Statusbar
		const statusbarPart = disposables.add(this.statusbarService.createAuxiliaryStatusbarPart(auxiliaryWindow.container, scopedEditorPartInstantiationService));
		let statusbarVisible = !compact && this.configurationService.getValue<boolean>(AuxiliaryEditorPart.STATUS_BAR_VISIBILITY) !== false;
		disposables.add(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(AuxiliaryEditorPart.STATUS_BAR_VISIBILITY)) {
				statusbarVisible = !compact && this.configurationService.getValue<boolean>(AuxiliaryEditorPart.STATUS_BAR_VISIBILITY) !== false;

				updateStatusbarVisibility(true);
			}
		}));

		updateStatusbarVisibility(false);

		// Lifecycle
		const editorCloseListener = disposables.add(Event.once(editorPart.onWillClose)(() => auxiliaryWindow.window.close()));
		disposables.add(Event.once(auxiliaryWindow.onUnload)(() => {
			if (disposables.isDisposed) {
				return; // the close happened as part of an earlier dispose call
			}

			editorCloseListener.dispose();
			editorPart.close();
			disposables.dispose();
		}));
		disposables.add(Event.once(this.lifecycleService.onDidShutdown)(() => disposables.dispose()));
		disposables.add(auxiliaryWindow.onBeforeUnload(event => {
			for (const group of editorPart.groups) {
				for (const editor of group.editors) {
					// Closing an auxiliary window with opened editors
					// will move the editors to the main window. As such,
					// we need to validate that we can move and otherwise
					// prevent the window from closing.
					const canMoveVeto = editor.canMove(group.id, this.editorPartsView.mainPart.activeGroup.id);
					if (typeof canMoveVeto === 'string') {
						group.openEditor(editor);
						event.veto(canMoveVeto);
						return;
					}
				}
			}
		}));

		// Layout: specifically `onWillLayout` to have a chance
		// to build the aux editor part before other components
		// have a chance to react.
		disposables.add(auxiliaryWindow.onWillLayout(dimension => {
			const titlebarPartHeight = titlebarPart?.height ?? 0;
			titlebarPart?.layout(dimension.width, titlebarPartHeight, 0, 0);

			const editorPartHeight = dimension.height - computeEditorPartHeightOffset();
			editorPart.layout(dimension.width, editorPartHeight, titlebarPartHeight, 0);

			statusbarPart.layout(dimension.width, statusbarPart.height, dimension.height - statusbarPart.height, 0);
		}));
		auxiliaryWindow.layout();

		// Compact mode
		disposables.add(compactWindowEmitter.event(e => {
			if (e.windowId === auxiliaryWindow.window.vscodeWindowId) {
				let newCompact: boolean;
				if (typeof e.compact === 'boolean') {
					newCompact = e.compact;
				} else {
					newCompact = !compact;
				}
				updateCompact(newCompact);
			}
		}));

		disposables.add(editorPart.onDidAddGroup(group => {
			updateCompact(false); // leave compact mode when a group is added

			disposables.add(group.onDidActiveEditorChange(() => {
				if (group.count > 1) {
					updateCompact(false); // leave compact mode when more than 1 editor is active
				}
			}));
		}));

		disposables.add(editorPart.activeGroup.onDidActiveEditorChange(() => {
			if (editorPart.activeGroup.count > 1) {
				updateCompact(false); // leave compact mode when more than 1 editor is active
			}
		}));

		// Have a scoped instantiation service that is scoped to the auxiliary window
		const scopedInstantiationService = disposables.add(scopedEditorPartInstantiationService.createChild(new ServiceCollection(
			[IStatusbarService, this.statusbarService.createScoped(statusbarPart, disposables)]
		)));

		return {
			part: editorPart,
			instantiationService: scopedInstantiationService,
			disposables
		};
	}
}

class AuxiliaryEditorPartImpl extends EditorPart implements IAuxiliaryEditorPart {

	private static COUNTER = 1;

	private readonly _onWillClose = this._register(new Emitter<void>());
	readonly onWillClose = this._onWillClose.event;

	private readonly optionsDisposable = this._register(new MutableDisposable());

	private isCompact = false;

	constructor(
		windowId: number,
		editorPartsView: IEditorPartsView,
		private readonly state: IEditorPartUIState | undefined,
		groupsLabel: string,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IHostService hostService: IHostService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		const id = AuxiliaryEditorPartImpl.COUNTER++;
		super(editorPartsView, `workbench.parts.auxiliaryEditor.${id}`, groupsLabel, windowId, instantiationService, themeService, configurationService, storageService, layoutService, hostService, contextKeyService);
	}

	updateOptions(options: { compact: boolean }): void {
		this.isCompact = options.compact;

		if (options.compact) {
			if (!this.optionsDisposable.value) {
				this.optionsDisposable.value = this.enforcePartOptions({
					showTabs: 'none',
					closeEmptyGroups: true
				});
			}
		} else {
			this.optionsDisposable.clear();
		}
	}

	override addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection, groupToCopy?: IEditorGroupView): IEditorGroupView {
		if (this.isCompact) {
			// When in compact mode, we prefer to open groups in the main part
			// as compact mode is typically meant for showing just 1 editor.
			location = this.editorPartsView.mainPart.activeGroup;
		}

		return super.addGroup(location, direction, groupToCopy);
	}

	override removeGroup(group: number | IEditorGroupView, preserveFocus?: boolean): void {

		// Close aux window when last group removed
		const groupView = this.assertGroupView(group);
		if (this.count === 1 && this.activeGroup === groupView) {
			this.doRemoveLastGroup(preserveFocus);
		}

		// Otherwise delegate to parent implementation
		else {
			super.removeGroup(group, preserveFocus);
		}
	}

	private doRemoveLastGroup(preserveFocus?: boolean): void {
		const restoreFocus = !preserveFocus && this.shouldRestoreFocus(this.container);

		// Activate next group
		const mostRecentlyActiveGroups = this.editorPartsView.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		const nextActiveGroup = mostRecentlyActiveGroups[1]; // [0] will be the current group we are about to dispose
		if (nextActiveGroup) {
			nextActiveGroup.groupsView.activateGroup(nextActiveGroup);

			if (restoreFocus) {
				nextActiveGroup.focus();
			}
		}

		this.doClose(false /* do not merge any confirming editors to main part */);
	}

	protected override loadState(): IEditorPartUIState | undefined {
		return this.state;
	}

	protected override saveState(): void {
		return; // disabled, auxiliary editor part state is tracked outside
	}

	close(): boolean {
		return this.doClose(true /* merge all confirming editors to main part */);
	}

	private doClose(mergeConfirmingEditorsToMainPart: boolean): boolean {
		let result = true;
		if (mergeConfirmingEditorsToMainPart) {

			// First close all editors that are non-confirming
			for (const group of this.groups) {
				group.closeAllEditors({ excludeConfirming: true });
			}

			// Then merge remaining to main part
			result = this.mergeGroupsToMainPart();
		}

		this._onWillClose.fire();

		return result;
	}

	private mergeGroupsToMainPart(): boolean {
		if (!this.groups.some(group => group.count > 0)) {
			return true; // skip if we have no editors opened
		}

		// Find the most recent group that is not locked
		let targetGroup: IEditorGroupView | undefined = undefined;
		for (const group of this.editorPartsView.mainPart.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			if (!group.isLocked) {
				targetGroup = group;
				break;
			}
		}

		if (!targetGroup) {
			targetGroup = this.editorPartsView.mainPart.addGroup(this.editorPartsView.mainPart.activeGroup, this.partOptions.openSideBySideDirection === 'right' ? GroupDirection.RIGHT : GroupDirection.DOWN);
		}

		const result = this.mergeAllGroups(targetGroup, {
			// Try to reduce the impact of closing the auxiliary window
			// as much as possible by not changing existing editors
			// in the main window.
			preserveExistingIndex: true
		});
		targetGroup.focus();

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/binaryDiffEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/binaryDiffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { BINARY_DIFF_EDITOR_ID } from '../../../common/editor.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { SideBySideEditor } from './sideBySideEditor.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { BaseBinaryResourceEditor } from './binaryEditor.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

/**
 * An implementation of editor for diffing binary files like images or videos.
 */
export class BinaryResourceDiffEditor extends SideBySideEditor {

	static override readonly ID = BINARY_DIFF_EDITOR_ID;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService
	) {
		super(group, telemetryService, instantiationService, themeService, storageService, configurationService, textResourceConfigurationService, editorService, editorGroupService);
	}

	getMetadata(): string | undefined {
		const primary = this.getPrimaryEditorPane();
		const secondary = this.getSecondaryEditorPane();

		if (primary instanceof BaseBinaryResourceEditor && secondary instanceof BaseBinaryResourceEditor) {
			return localize('metadataDiff', "{0} ↔ {1}", secondary.getMetadata(), primary.getMetadata());
		}

		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/binaryEditor.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/binaryEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Emitter } from '../../../../base/common/event.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { BinaryEditorModel } from '../../../common/editor/binaryEditorModel.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ByteSize } from '../../../../platform/files/common/files.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { EditorPlaceholder, IEditorPlaceholderContents } from './editorPlaceholder.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';

export interface IOpenCallbacks {
	openInternal: (input: EditorInput, options: IEditorOptions | undefined) => Promise<void>;
}

/*
 * This class is only intended to be subclassed and not instantiated.
 */
export abstract class BaseBinaryResourceEditor extends EditorPlaceholder {

	private readonly _onDidChangeMetadata = this._register(new Emitter<void>());
	readonly onDidChangeMetadata = this._onDidChangeMetadata.event;

	private readonly _onDidOpenInPlace = this._register(new Emitter<void>());
	readonly onDidOpenInPlace = this._onDidOpenInPlace.event;

	private metadata: string | undefined;

	constructor(
		id: string,
		group: IEditorGroup,
		private readonly callbacks: IOpenCallbacks,
		telemetryService: ITelemetryService,
		themeService: IThemeService,
		@IStorageService storageService: IStorageService
	) {
		super(id, group, telemetryService, themeService, storageService);
	}

	override getTitle(): string {
		return this.input ? this.input.getName() : localize('binaryEditor', "Binary Viewer");
	}

	protected async getContents(input: EditorInput, options: IEditorOptions): Promise<IEditorPlaceholderContents> {
		const model = await input.resolve();

		// Assert Model instance
		if (!(model instanceof BinaryEditorModel)) {
			throw new Error('Unable to open file as binary');
		}

		// Update metadata
		const size = model.getSize();
		this.handleMetadataChanged(typeof size === 'number' ? ByteSize.formatSize(size) : '');

		return {
			icon: '$(warning)',
			label: localize('binaryError', "The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding."),
			actions: [
				{
					label: localize('openAnyway', "Open Anyway"),
					run: async () => {

						// Open in place
						await this.callbacks.openInternal(input, options);

						// Signal to listeners that the binary editor has been opened in-place
						this._onDidOpenInPlace.fire();
					}
				}
			]
		};
	}

	private handleMetadataChanged(meta: string | undefined): void {
		this.metadata = meta;

		this._onDidChangeMetadata.fire();
	}

	getMetadata(): string | undefined {
		return this.metadata;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/breadcrumbs.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/breadcrumbs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BreadcrumbsWidget } from '../../../../base/browser/ui/breadcrumbs/breadcrumbsWidget.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import * as glob from '../../../../base/common/glob.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IConfigurationOverrides, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions, IConfigurationRegistry, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { GroupIdentifier, IEditorPartOptions } from '../../../common/editor.js';

export const IBreadcrumbsService = createDecorator<IBreadcrumbsService>('IEditorBreadcrumbsService');

export interface IBreadcrumbsService {

	readonly _serviceBrand: undefined;

	register(group: GroupIdentifier, widget: BreadcrumbsWidget): IDisposable;

	getWidget(group: GroupIdentifier): BreadcrumbsWidget | undefined;
}


export class BreadcrumbsService implements IBreadcrumbsService {

	declare readonly _serviceBrand: undefined;

	private readonly _map = new Map<number, BreadcrumbsWidget>();

	register(group: number, widget: BreadcrumbsWidget): IDisposable {
		if (this._map.has(group)) {
			throw new Error(`group (${group}) has already a widget`);
		}
		this._map.set(group, widget);
		return {
			dispose: () => this._map.delete(group)
		};
	}

	getWidget(group: number): BreadcrumbsWidget | undefined {
		return this._map.get(group);
	}
}

registerSingleton(IBreadcrumbsService, BreadcrumbsService, InstantiationType.Delayed);


//#region config

export abstract class BreadcrumbsConfig<T> {

	abstract get name(): string;
	abstract get onDidChange(): Event<void>;

	abstract getValue(overrides?: IConfigurationOverrides): T;
	abstract updateValue(value: T, overrides?: IConfigurationOverrides): Promise<void>;
	abstract dispose(): void;

	private constructor() {
		// internal
	}

	static readonly IsEnabled = BreadcrumbsConfig._stub<boolean>('breadcrumbs.enabled');
	static readonly UseQuickPick = BreadcrumbsConfig._stub<boolean>('breadcrumbs.useQuickPick');
	static readonly FilePath = BreadcrumbsConfig._stub<'on' | 'off' | 'last'>('breadcrumbs.filePath');
	static readonly SymbolPath = BreadcrumbsConfig._stub<'on' | 'off' | 'last'>('breadcrumbs.symbolPath');
	static readonly SymbolSortOrder = BreadcrumbsConfig._stub<'position' | 'name' | 'type'>('breadcrumbs.symbolSortOrder');
	static readonly SymbolPathSeparator = BreadcrumbsConfig._stub<string>('breadcrumbs.symbolPathSeparator');
	static readonly Icons = BreadcrumbsConfig._stub<boolean>('breadcrumbs.icons');
	static readonly TitleScrollbarSizing = BreadcrumbsConfig._stub<IEditorPartOptions['titleScrollbarSizing']>('workbench.editor.titleScrollbarSizing');
	static readonly TitleScrollbarVisibility = BreadcrumbsConfig._stub<IEditorPartOptions['titleScrollbarVisibility']>('workbench.editor.titleScrollbarVisibility');

	static readonly FileExcludes = BreadcrumbsConfig._stub<glob.IExpression>('files.exclude');

	private static _stub<T>(name: string): { bindTo(service: IConfigurationService): BreadcrumbsConfig<T> } {
		return {
			bindTo(service) {
				const onDidChange = new Emitter<void>();

				const listener = service.onDidChangeConfiguration(e => {
					if (e.affectsConfiguration(name)) {
						onDidChange.fire(undefined);
					}
				});

				return new class implements BreadcrumbsConfig<T> {
					readonly name = name;
					readonly onDidChange = onDidChange.event;
					getValue(overrides?: IConfigurationOverrides): T {
						if (overrides) {
							return service.getValue(name, overrides);
						} else {
							return service.getValue(name);
						}
					}
					updateValue(newValue: T, overrides?: IConfigurationOverrides): Promise<void> {
						if (overrides) {
							return service.updateValue(name, newValue, overrides);
						} else {
							return service.updateValue(name, newValue);
						}
					}
					dispose(): void {
						listener.dispose();
						onDidChange.dispose();
					}
				};
			}
		};
	}
}

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	id: 'breadcrumbs',
	title: localize('title', "Breadcrumb Navigation"),
	order: 101,
	type: 'object',
	properties: {
		'breadcrumbs.enabled': {
			description: localize('enabled', "Enable/disable navigation breadcrumbs."),
			type: 'boolean',
			default: true
		},
		'breadcrumbs.filePath': {
			description: localize('filepath', "Controls whether and how file paths are shown in the breadcrumbs view."),
			type: 'string',
			default: 'on',
			enum: ['on', 'off', 'last'],
			enumDescriptions: [
				localize('filepath.on', "Show the file path in the breadcrumbs view."),
				localize('filepath.off', "Do not show the file path in the breadcrumbs view."),
				localize('filepath.last', "Only show the last element of the file path in the breadcrumbs view."),
			]
		},
		'breadcrumbs.symbolPath': {
			description: localize('symbolpath', "Controls whether and how symbols are shown in the breadcrumbs view."),
			type: 'string',
			default: 'on',
			enum: ['on', 'off', 'last'],
			enumDescriptions: [
				localize('symbolpath.on', "Show all symbols in the breadcrumbs view."),
				localize('symbolpath.off', "Do not show symbols in the breadcrumbs view."),
				localize('symbolpath.last', "Only show the current symbol in the breadcrumbs view."),
			]
		},
		'breadcrumbs.symbolSortOrder': {
			description: localize('symbolSortOrder', "Controls how symbols are sorted in the breadcrumbs outline view."),
			type: 'string',
			default: 'position',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			enum: ['position', 'name', 'type'],
			enumDescriptions: [
				localize('symbolSortOrder.position', "Show symbol outline in file position order."),
				localize('symbolSortOrder.name', "Show symbol outline in alphabetical order."),
				localize('symbolSortOrder.type', "Show symbol outline in symbol type order."),
			]
		},
		'breadcrumbs.icons': {
			description: localize('icons', "Render breadcrumb items with icons."),
			type: 'boolean',
			default: true
		},
		'breadcrumbs.symbolPathSeparator': {
			description: localize('symbolPathSeparator', "The separator used when copying the breadcrumb symbol path."),
			type: 'string',
			default: '.',
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
		},
		'breadcrumbs.showFiles': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.file', "When enabled breadcrumbs show `file`-symbols.")
		},
		'breadcrumbs.showModules': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.module', "When enabled breadcrumbs show `module`-symbols.")
		},
		'breadcrumbs.showNamespaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.namespace', "When enabled breadcrumbs show `namespace`-symbols.")
		},
		'breadcrumbs.showPackages': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.package', "When enabled breadcrumbs show `package`-symbols.")
		},
		'breadcrumbs.showClasses': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.class', "When enabled breadcrumbs show `class`-symbols.")
		},
		'breadcrumbs.showMethods': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.method', "When enabled breadcrumbs show `method`-symbols.")
		},
		'breadcrumbs.showProperties': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.property', "When enabled breadcrumbs show `property`-symbols.")
		},
		'breadcrumbs.showFields': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.field', "When enabled breadcrumbs show `field`-symbols.")
		},
		'breadcrumbs.showConstructors': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constructor', "When enabled breadcrumbs show `constructor`-symbols.")
		},
		'breadcrumbs.showEnums': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enum', "When enabled breadcrumbs show `enum`-symbols.")
		},
		'breadcrumbs.showInterfaces': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.interface', "When enabled breadcrumbs show `interface`-symbols.")
		},
		'breadcrumbs.showFunctions': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.function', "When enabled breadcrumbs show `function`-symbols.")
		},
		'breadcrumbs.showVariables': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.variable', "When enabled breadcrumbs show `variable`-symbols.")
		},
		'breadcrumbs.showConstants': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.constant', "When enabled breadcrumbs show `constant`-symbols.")
		},
		'breadcrumbs.showStrings': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.string', "When enabled breadcrumbs show `string`-symbols.")
		},
		'breadcrumbs.showNumbers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.number', "When enabled breadcrumbs show `number`-symbols.")
		},
		'breadcrumbs.showBooleans': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.boolean', "When enabled breadcrumbs show `boolean`-symbols.")
		},
		'breadcrumbs.showArrays': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.array', "When enabled breadcrumbs show `array`-symbols.")
		},
		'breadcrumbs.showObjects': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.object', "When enabled breadcrumbs show `object`-symbols.")
		},
		'breadcrumbs.showKeys': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.key', "When enabled breadcrumbs show `key`-symbols.")
		},
		'breadcrumbs.showNull': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.null', "When enabled breadcrumbs show `null`-symbols.")
		},
		'breadcrumbs.showEnumMembers': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.enumMember', "When enabled breadcrumbs show `enumMember`-symbols.")
		},
		'breadcrumbs.showStructs': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.struct', "When enabled breadcrumbs show `struct`-symbols.")
		},
		'breadcrumbs.showEvents': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.event', "When enabled breadcrumbs show `event`-symbols.")
		},
		'breadcrumbs.showOperators': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.operator', "When enabled breadcrumbs show `operator`-symbols.")
		},
		'breadcrumbs.showTypeParameters': {
			type: 'boolean',
			default: true,
			scope: ConfigurationScope.LANGUAGE_OVERRIDABLE,
			markdownDescription: localize('filteredTypes.typeParameter', "When enabled breadcrumbs show `typeParameter`-symbols.")
		}
	}
});

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/breadcrumbsControl.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/breadcrumbsControl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { StandardMouseEvent } from '../../../../base/browser/mouseEvent.js';
import { PixelRatio } from '../../../../base/browser/pixelRatio.js';
import { BreadcrumbsItem, BreadcrumbsWidget, IBreadcrumbsItemEvent, IBreadcrumbsWidgetStyles } from '../../../../base/browser/ui/breadcrumbs/breadcrumbsWidget.js';
import { applyDragImage } from '../../../../base/browser/ui/dnd/dnd.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { timeout } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter } from '../../../../base/common/event.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { combinedDisposable, DisposableStore, IDisposable, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { basename, extUri } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { DocumentSymbol } from '../../../../editor/common/languages.js';
import { OutlineElement } from '../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { localize, localize2 } from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { fillInSymbolsDragData, LocalSelectionTransfer } from '../../../../platform/dnd/browser/dnd.js';
import { FileKind, IFileService, IFileStat } from '../../../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../../../platform/instantiation/common/instantiationService.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IListService, WorkbenchAsyncDataTree, WorkbenchDataTree, WorkbenchListFocusContextKey } from '../../../../platform/list/browser/listService.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { defaultBreadcrumbsWidgetStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { EditorResourceAccessor, IEditorPartOptions, SideBySideEditor } from '../../../common/editor.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, ACTIVE_GROUP_TYPE, IEditorService, SIDE_GROUP, SIDE_GROUP_TYPE } from '../../../services/editor/common/editorService.js';
import { IOutline, IOutlineService, OutlineTarget } from '../../../services/outline/browser/outline.js';
import { DraggedEditorIdentifier, fillEditorsDragData } from '../../dnd.js';
import { DEFAULT_LABELS_CONTAINER, ResourceLabels } from '../../labels.js';
import { BreadcrumbsConfig, IBreadcrumbsService } from './breadcrumbs.js';
import { BreadcrumbsModel, FileElement, OutlineElement2 } from './breadcrumbsModel.js';
import { BreadcrumbsFilePicker, BreadcrumbsOutlinePicker } from './breadcrumbsPicker.js';
import { IEditorGroupView } from './editor.js';
import './media/breadcrumbscontrol.css';
import { ScrollbarVisibility } from '../../../../base/common/scrollable.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';

class OutlineItem extends BreadcrumbsItem {

	private readonly _disposables = new DisposableStore();

	constructor(
		readonly model: BreadcrumbsModel,
		readonly element: OutlineElement2,
		readonly options: IBreadcrumbsControlOptions,
		@IInstantiationService private readonly _instantiationService: InstantiationService,
	) {
		super();
	}



	dispose(): void {
		this._disposables.dispose();
	}

	equals(other: BreadcrumbsItem): boolean {
		if (!(other instanceof OutlineItem)) {
			return false;
		}
		return this.element.element === other.element.element &&
			this.options.showFileIcons === other.options.showFileIcons &&
			this.options.showSymbolIcons === other.options.showSymbolIcons;
	}

	render(container: HTMLElement): void {
		const { element, outline } = this.element;

		if (element === outline) {
			const element = dom.$('span', undefined, '…');
			container.appendChild(element);
			return;
		}

		const templateId = outline.config.delegate.getTemplateId(element);
		const renderer = outline.config.renderers.find(renderer => renderer.templateId === templateId);
		if (!renderer) {
			container.textContent = '<<NO RENDERER>>';
			return;
		}

		const template = renderer.renderTemplate(container);
		renderer.renderElement({
			element,
			children: [],
			depth: 0,
			visibleChildrenCount: 0,
			visibleChildIndex: 0,
			collapsible: false,
			collapsed: false,
			visible: true,
			filterData: undefined
		}, 0, template, undefined);

		if (!this.options.showSymbolIcons) {
			dom.hide(template.iconClass);
		}

		this._disposables.add(toDisposable(() => { renderer.disposeTemplate(template); }));

		if (element instanceof OutlineElement && outline.uri) {
			this._disposables.add(this._instantiationService.invokeFunction(accessor => createBreadcrumbDndObserver(accessor, container, element.symbol.name, { symbol: element.symbol, uri: outline.uri! }, this.model, this.options.dragEditor)));
		}
	}
}

class FileItem extends BreadcrumbsItem {

	private readonly _disposables = new DisposableStore();

	constructor(
		readonly model: BreadcrumbsModel,
		readonly element: FileElement,
		readonly options: IBreadcrumbsControlOptions,
		private readonly _labels: ResourceLabels,
		private readonly _hoverDelegate: IHoverDelegate,
		@IInstantiationService private readonly _instantiationService: InstantiationService,
	) {
		super();
	}

	dispose(): void {
		this._disposables.dispose();
	}

	equals(other: BreadcrumbsItem): boolean {
		if (!(other instanceof FileItem)) {
			return false;
		}
		return (extUri.isEqual(this.element.uri, other.element.uri) &&
			this.options.showFileIcons === other.options.showFileIcons &&
			this.options.showSymbolIcons === other.options.showSymbolIcons);

	}

	render(container: HTMLElement): void {
		// file/folder
		const label = this._labels.create(container, { hoverDelegate: this._hoverDelegate });
		label.setFile(this.element.uri, {
			hidePath: true,
			hideIcon: this.element.kind === FileKind.FOLDER || !this.options.showFileIcons,
			fileKind: this.element.kind,
			fileDecorations: { colors: this.options.showDecorationColors, badges: false },
		});
		container.classList.add(FileKind[this.element.kind].toLowerCase());
		this._disposables.add(label);

		this._disposables.add(this._instantiationService.invokeFunction(accessor => createBreadcrumbDndObserver(accessor, container, basename(this.element.uri), this.element.uri, this.model, this.options.dragEditor)));
	}
}


function createBreadcrumbDndObserver(accessor: ServicesAccessor, container: HTMLElement, label: string, item: URI | { symbol: DocumentSymbol; uri: URI }, model: BreadcrumbsModel, dragEditor: boolean): IDisposable {
	const instantiationService = accessor.get(IInstantiationService);

	container.draggable = true;

	return new dom.DragAndDropObserver(container, {
		onDragStart: event => {
			if (!event.dataTransfer) {
				return;
			}

			// Set data transfer
			event.dataTransfer.effectAllowed = 'copyMove';

			instantiationService.invokeFunction(accessor => {
				if (URI.isUri(item)) {
					fillEditorsDragData(accessor, [item], event);
				} else { // Symbol
					fillEditorsDragData(accessor, [{ resource: item.uri, selection: item.symbol.range }], event);

					fillInSymbolsDragData([{
						name: item.symbol.name,
						fsPath: item.uri.fsPath,
						range: item.symbol.range,
						kind: item.symbol.kind
					}], event);
				}

				if (dragEditor && model.editor?.input) {
					const editorTransfer = LocalSelectionTransfer.getInstance<DraggedEditorIdentifier>();
					editorTransfer.setData([new DraggedEditorIdentifier({ editor: model.editor.input, groupId: model.editor.group.id })], DraggedEditorIdentifier.prototype);
				}
			});

			applyDragImage(event, container, label);
		}
	});
}

export interface IBreadcrumbsControlOptions {
	readonly showFileIcons: boolean;
	readonly showSymbolIcons: boolean;
	readonly showDecorationColors: boolean;
	readonly showPlaceholder: boolean;
	readonly dragEditor: boolean;
	readonly widgetStyles?: IBreadcrumbsWidgetStyles;
}

const separatorIcon = registerIcon('breadcrumb-separator', Codicon.chevronRight, localize('separatorIcon', 'Icon for the separator in the breadcrumbs.'));

export class BreadcrumbsControl {

	static readonly HEIGHT = 22;

	private static readonly SCROLLBAR_SIZES = {
		default: 3,
		large: 8
	};

	private static readonly SCROLLBAR_VISIBILITY = {
		auto: ScrollbarVisibility.Auto,
		visible: ScrollbarVisibility.Visible,
		hidden: ScrollbarVisibility.Hidden
	};

	static readonly Payload_Reveal = {};
	static readonly Payload_RevealAside = {};
	static readonly Payload_Pick = {};

	static readonly CK_BreadcrumbsPossible = new RawContextKey('breadcrumbsPossible', false, localize('breadcrumbsPossible', "Whether the editor can show breadcrumbs"));
	static readonly CK_BreadcrumbsVisible = new RawContextKey('breadcrumbsVisible', false, localize('breadcrumbsVisible', "Whether breadcrumbs are currently visible"));
	static readonly CK_BreadcrumbsActive = new RawContextKey('breadcrumbsActive', false, localize('breadcrumbsActive', "Whether breadcrumbs have focus"));

	private readonly _ckBreadcrumbsPossible: IContextKey<boolean>;
	private readonly _ckBreadcrumbsVisible: IContextKey<boolean>;
	private readonly _ckBreadcrumbsActive: IContextKey<boolean>;

	private readonly _cfUseQuickPick: BreadcrumbsConfig<boolean>;
	private readonly _cfShowIcons: BreadcrumbsConfig<boolean>;
	private readonly _cfTitleScrollbarSizing: BreadcrumbsConfig<IEditorPartOptions['titleScrollbarSizing']>;
	private readonly _cfTitleScrollbarVisibility: BreadcrumbsConfig<IEditorPartOptions['titleScrollbarVisibility']>;

	readonly domNode: HTMLDivElement;
	private readonly _widget: BreadcrumbsWidget;

	private readonly _disposables = new DisposableStore();
	private readonly _breadcrumbsDisposables = new DisposableStore();
	private readonly _labels: ResourceLabels;
	private readonly _model = new MutableDisposable<BreadcrumbsModel>();
	private _breadcrumbsPickerShowing = false;
	private _breadcrumbsPickerIgnoreOnceItem: BreadcrumbsItem | undefined;

	private readonly _hoverDelegate: IHoverDelegate;

	private readonly _onDidVisibilityChange = this._disposables.add(new Emitter<void>());
	get onDidVisibilityChange() { return this._onDidVisibilityChange.event; }

	constructor(
		container: HTMLElement,
		private readonly _options: IBreadcrumbsControlOptions,
		private readonly _editorGroup: IEditorGroupView,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IContextViewService private readonly _contextViewService: IContextViewService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IFileService private readonly _fileService: IFileService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILabelService private readonly _labelService: ILabelService,
		@IConfigurationService configurationService: IConfigurationService,
		@IBreadcrumbsService breadcrumbsService: IBreadcrumbsService
	) {
		this.domNode = document.createElement('div');
		this.domNode.classList.add('breadcrumbs-control');
		dom.append(container, this.domNode);

		this._cfUseQuickPick = BreadcrumbsConfig.UseQuickPick.bindTo(configurationService);
		this._cfShowIcons = BreadcrumbsConfig.Icons.bindTo(configurationService);
		this._cfTitleScrollbarSizing = BreadcrumbsConfig.TitleScrollbarSizing.bindTo(configurationService);
		this._cfTitleScrollbarVisibility = BreadcrumbsConfig.TitleScrollbarVisibility.bindTo(configurationService);

		this._labels = this._instantiationService.createInstance(ResourceLabels, DEFAULT_LABELS_CONTAINER);

		const sizing = this._cfTitleScrollbarSizing.getValue() ?? 'default';
		const styles = _options.widgetStyles ?? defaultBreadcrumbsWidgetStyles;
		const visibility = this._cfTitleScrollbarVisibility?.getValue() ?? 'auto';

		this._widget = new BreadcrumbsWidget(
			this.domNode,
			BreadcrumbsControl.SCROLLBAR_SIZES[sizing],
			BreadcrumbsControl.SCROLLBAR_VISIBILITY[visibility],
			separatorIcon,
			styles
		);
		this._widget.onDidSelectItem(this._onSelectEvent, this, this._disposables);
		this._widget.onDidFocusItem(this._onFocusEvent, this, this._disposables);
		this._widget.onDidChangeFocus(this._updateCkBreadcrumbsActive, this, this._disposables);

		this._ckBreadcrumbsPossible = BreadcrumbsControl.CK_BreadcrumbsPossible.bindTo(this._contextKeyService);
		this._ckBreadcrumbsVisible = BreadcrumbsControl.CK_BreadcrumbsVisible.bindTo(this._contextKeyService);
		this._ckBreadcrumbsActive = BreadcrumbsControl.CK_BreadcrumbsActive.bindTo(this._contextKeyService);

		this._hoverDelegate = getDefaultHoverDelegate('mouse');

		this._disposables.add(breadcrumbsService.register(this._editorGroup.id, this._widget));
		this.hide();
	}

	dispose(): void {
		this._disposables.dispose();
		this._breadcrumbsDisposables.dispose();
		this._model.dispose();
		this._ckBreadcrumbsPossible.reset();
		this._ckBreadcrumbsVisible.reset();
		this._ckBreadcrumbsActive.reset();
		this._cfUseQuickPick.dispose();
		this._cfShowIcons.dispose();
		this._cfTitleScrollbarSizing.dispose();
		this._cfTitleScrollbarVisibility.dispose();
		this._widget.dispose();
		this._labels.dispose();
		this.domNode.remove();
	}

	get model(): BreadcrumbsModel | undefined {
		return this._model.value;
	}

	layout(dim: dom.Dimension | undefined): void {
		this._widget.layout(dim);
	}

	isHidden(): boolean {
		return this.domNode.classList.contains('hidden');
	}

	hide(): void {
		const wasHidden = this.isHidden();

		this._breadcrumbsDisposables.clear();
		this._ckBreadcrumbsVisible.set(false);
		this.domNode.classList.toggle('hidden', true);

		if (!wasHidden) {
			this._onDidVisibilityChange.fire();
		}
	}

	private show(): void {
		const wasHidden = this.isHidden();

		this._ckBreadcrumbsVisible.set(true);
		this.domNode.classList.toggle('hidden', false);

		if (wasHidden) {
			this._onDidVisibilityChange.fire();
		}
	}

	revealLast(): void {
		this._widget.revealLast();
	}

	update(): boolean {
		this._breadcrumbsDisposables.clear();

		// honor diff editors and such
		const uri = EditorResourceAccessor.getCanonicalUri(this._editorGroup.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		const wasHidden = this.isHidden();

		if (!uri || !this._fileService.hasProvider(uri)) {
			// cleanup and return when there is no input or when
			// we cannot handle this input
			this._ckBreadcrumbsPossible.set(false);
			if (!wasHidden) {
				this.hide();
				return true;
			} else {
				return false;
			}
		}

		// display uri which can be derived from certain inputs
		const fileInfoUri = EditorResourceAccessor.getOriginalUri(this._editorGroup.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });

		this.show();
		this._ckBreadcrumbsPossible.set(true);

		const model = this._instantiationService.createInstance(BreadcrumbsModel,
			fileInfoUri ?? uri,
			this._editorGroup.activeEditorPane
		);
		this._model.value = model;

		this.domNode.classList.toggle('backslash-path', this._labelService.getSeparator(uri.scheme, uri.authority) === '\\');

		const updateBreadcrumbs = () => {
			this.domNode.classList.toggle('relative-path', model.isRelative());
			const showIcons = this._cfShowIcons.getValue();
			const options: IBreadcrumbsControlOptions = {
				...this._options,
				showFileIcons: this._options.showFileIcons && showIcons,
				showSymbolIcons: this._options.showSymbolIcons && showIcons
			};
			const items = model.getElements().map(element => element instanceof FileElement
				? this._instantiationService.createInstance(FileItem, model, element, options, this._labels, this._hoverDelegate)
				: this._instantiationService.createInstance(OutlineItem, model, element, options));
			if (items.length === 0) {
				this._widget.setEnabled(false);
				this._widget.setItems([new class extends BreadcrumbsItem {
					render(container: HTMLElement): void {
						container.textContent = localize('empty', "no elements");
					}
					equals(other: BreadcrumbsItem): boolean {
						return other === this;
					}
					dispose(): void {

					}
				}]);
			} else {
				this._widget.setEnabled(true);
				this._widget.setItems(items);
				this._widget.reveal(items[items.length - 1]);
			}
		};
		const listener = model.onDidUpdate(updateBreadcrumbs);
		const configListener = this._cfShowIcons.onDidChange(updateBreadcrumbs);
		updateBreadcrumbs();
		this._breadcrumbsDisposables.clear();
		this._breadcrumbsDisposables.add(listener);
		this._breadcrumbsDisposables.add(toDisposable(() => this._model.clear()));
		this._breadcrumbsDisposables.add(configListener);
		this._breadcrumbsDisposables.add(toDisposable(() => this._widget.setItems([])));

		const updateScrollbarSizing = () => {
			const sizing = this._cfTitleScrollbarSizing.getValue() ?? 'default';
			const visibility = this._cfTitleScrollbarVisibility?.getValue() ?? 'auto';

			this._widget.setHorizontalScrollbarSize(BreadcrumbsControl.SCROLLBAR_SIZES[sizing]);
			this._widget.setHorizontalScrollbarVisibility(BreadcrumbsControl.SCROLLBAR_VISIBILITY[visibility]);
		};
		updateScrollbarSizing();
		const updateScrollbarSizeListener = this._cfTitleScrollbarSizing.onDidChange(updateScrollbarSizing);
		const updateScrollbarVisibilityListener = this._cfTitleScrollbarVisibility.onDidChange(updateScrollbarSizing);
		this._breadcrumbsDisposables.add(updateScrollbarSizeListener);
		this._breadcrumbsDisposables.add(updateScrollbarVisibilityListener);

		// close picker on hide/update
		this._breadcrumbsDisposables.add({
			dispose: () => {
				if (this._breadcrumbsPickerShowing) {
					this._contextViewService.hideContextView({ source: this });
				}
			}
		});

		return wasHidden !== this.isHidden();
	}

	private _onFocusEvent(event: IBreadcrumbsItemEvent): void {
		if (event.item && this._breadcrumbsPickerShowing) {
			this._breadcrumbsPickerIgnoreOnceItem = undefined;
			this._widget.setSelection(event.item);
		}
	}

	private _onSelectEvent(event: IBreadcrumbsItemEvent): void {
		if (!event.item) {
			return;
		}

		if (event.item === this._breadcrumbsPickerIgnoreOnceItem) {
			this._breadcrumbsPickerIgnoreOnceItem = undefined;
			this._widget.setFocused(undefined);
			this._widget.setSelection(undefined);
			return;
		}

		const { element } = event.item as FileItem | OutlineItem;
		this._editorGroup.focus();

		const group = this._getEditorGroup(event.payload);
		if (group !== undefined) {
			// reveal the item
			this._widget.setFocused(undefined);
			this._widget.setSelection(undefined);
			this._revealInEditor(event, element, group);
			return;
		}

		if (this._cfUseQuickPick.getValue()) {
			// using quick pick
			this._widget.setFocused(undefined);
			this._widget.setSelection(undefined);
			this._quickInputService.quickAccess.show(element instanceof OutlineElement2 ? '@' : '');
			return;
		}

		// show picker
		let picker: BreadcrumbsFilePicker | BreadcrumbsOutlinePicker;
		let pickerAnchor: { x: number; y: number };

		interface IHideData { didPick?: boolean; source?: BreadcrumbsControl }

		this._contextViewService.showContextView({
			render: (parent: HTMLElement) => {
				if (event.item instanceof FileItem) {
					picker = this._instantiationService.createInstance(BreadcrumbsFilePicker, parent, event.item.model.resource);
				} else if (event.item instanceof OutlineItem) {
					picker = this._instantiationService.createInstance(BreadcrumbsOutlinePicker, parent, event.item.model.resource);
				}

				const selectListener = picker.onWillPickElement(() => this._contextViewService.hideContextView({ source: this, didPick: true }));
				const zoomListener = PixelRatio.getInstance(dom.getWindow(this.domNode)).onDidChange(() => this._contextViewService.hideContextView({ source: this }));

				const focusTracker = dom.trackFocus(parent);
				const blurListener = focusTracker.onDidBlur(() => {
					this._breadcrumbsPickerIgnoreOnceItem = this._widget.isDOMFocused() ? event.item : undefined;
					this._contextViewService.hideContextView({ source: this });
				});

				this._breadcrumbsPickerShowing = true;
				this._updateCkBreadcrumbsActive();

				return combinedDisposable(
					picker,
					selectListener,
					zoomListener,
					focusTracker,
					blurListener
				);
			},
			getAnchor: () => {
				if (!pickerAnchor) {
					const window = dom.getWindow(this.domNode);
					const maxInnerWidth = window.innerWidth - 8 /*a little less the full widget*/;
					let maxHeight = Math.min(window.innerHeight * 0.7, 300);

					const pickerWidth = Math.min(maxInnerWidth, Math.max(240, maxInnerWidth / 4.17));
					const pickerArrowSize = 8;
					let pickerArrowOffset: number;

					const data = dom.getDomNodePagePosition(event.node.firstChild as HTMLElement);
					const y = data.top + data.height + pickerArrowSize;
					if (y + maxHeight >= window.innerHeight) {
						maxHeight = window.innerHeight - y - 30 /* room for shadow and status bar*/;
					}
					let x = data.left;
					if (x + pickerWidth >= maxInnerWidth) {
						x = maxInnerWidth - pickerWidth;
					}
					if (event.payload instanceof StandardMouseEvent) {
						const maxPickerArrowOffset = pickerWidth - 2 * pickerArrowSize;
						pickerArrowOffset = event.payload.posx - x;
						if (pickerArrowOffset > maxPickerArrowOffset) {
							x = Math.min(maxInnerWidth - pickerWidth, x + pickerArrowOffset - maxPickerArrowOffset);
							pickerArrowOffset = maxPickerArrowOffset;
						}
					} else {
						pickerArrowOffset = (data.left + (data.width * 0.3)) - x;
					}
					picker.show(element, maxHeight, pickerWidth, pickerArrowSize, Math.max(0, pickerArrowOffset));
					pickerAnchor = { x, y };
				}
				return pickerAnchor;
			},
			onHide: (data?: IHideData) => {
				if (!data?.didPick) {
					picker.restoreViewState();
				}
				this._breadcrumbsPickerShowing = false;
				this._updateCkBreadcrumbsActive();
				if (data?.source === this) {
					this._widget.setFocused(undefined);
					this._widget.setSelection(undefined);
				}
				picker.dispose();
			}
		});
	}

	private _updateCkBreadcrumbsActive(): void {
		const value = this._widget.isDOMFocused() || this._breadcrumbsPickerShowing;
		this._ckBreadcrumbsActive.set(value);
	}

	private async _revealInEditor(event: IBreadcrumbsItemEvent, element: FileElement | OutlineElement2, group: SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | undefined, pinned: boolean = false): Promise<void> {

		if (element instanceof FileElement) {
			if (element.kind === FileKind.FILE) {
				await this._editorService.openEditor({ resource: element.uri, options: { pinned } }, group);
			} else {
				// show next picker
				const items = this._widget.getItems();
				const idx = items.indexOf(event.item);
				this._widget.setFocused(items[idx + 1]);
				this._widget.setSelection(items[idx + 1], BreadcrumbsControl.Payload_Pick);
			}
		} else {
			element.outline.reveal(element, { pinned }, group === SIDE_GROUP, false);
		}
	}

	private _getEditorGroup(data: unknown): SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | undefined {
		if (data === BreadcrumbsControl.Payload_RevealAside) {
			return SIDE_GROUP;
		} else if (data === BreadcrumbsControl.Payload_Reveal) {
			return ACTIVE_GROUP;
		} else {
			return undefined;
		}
	}
}

export class BreadcrumbsControlFactory {

	private readonly _disposables = new DisposableStore();
	private readonly _controlDisposables = new DisposableStore();

	private _control: BreadcrumbsControl | undefined;
	get control() { return this._control; }

	private readonly _onDidEnablementChange = this._disposables.add(new Emitter<void>());
	get onDidEnablementChange() { return this._onDidEnablementChange.event; }

	private readonly _onDidVisibilityChange = this._disposables.add(new Emitter<void>());
	get onDidVisibilityChange() { return this._onDidVisibilityChange.event; }

	constructor(
		private readonly _container: HTMLElement,
		private readonly _editorGroup: IEditorGroupView,
		private readonly _options: IBreadcrumbsControlOptions,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IFileService fileService: IFileService
	) {
		const config = this._disposables.add(BreadcrumbsConfig.IsEnabled.bindTo(configurationService));
		this._disposables.add(config.onDidChange(() => {
			const value = config.getValue();
			if (!value && this._control) {
				this._controlDisposables.clear();
				this._control = undefined;
				this._onDidEnablementChange.fire();
			} else if (value && !this._control) {
				this._control = this.createControl();
				this._control.update();
				this._onDidEnablementChange.fire();
			}
		}));

		if (config.getValue()) {
			this._control = this.createControl();
		}

		this._disposables.add(fileService.onDidChangeFileSystemProviderRegistrations(e => {
			if (this._control?.model && this._control.model.resource.scheme !== e.scheme) {
				// ignore if the scheme of the breadcrumbs resource is not affected
				return;
			}
			if (this._control?.update()) {
				this._onDidEnablementChange.fire();
			}
		}));
	}

	private createControl(): BreadcrumbsControl {
		const control = this._controlDisposables.add(this._instantiationService.createInstance(BreadcrumbsControl, this._container, this._options, this._editorGroup));
		this._controlDisposables.add(control.onDidVisibilityChange(() => this._onDidVisibilityChange.fire()));

		return control;
	}

	dispose(): void {
		this._disposables.dispose();
		this._controlDisposables.dispose();
	}
}

//#region commands

// toggle command
registerAction2(class ToggleBreadcrumb extends Action2 {

	constructor() {
		super({
			id: 'breadcrumbs.toggle',
			title: localize2('cmd.toggle', "Toggle Breadcrumbs"),
			category: Categories.View,
			toggled: {
				condition: ContextKeyExpr.equals('config.breadcrumbs.enabled', true),
				title: localize('cmd.toggle2', "Toggle Breadcrumbs"),
				mnemonicTitle: localize({ key: 'miBreadcrumbs2', comment: ['&& denotes a mnemonic'] }, "&&Breadcrumbs")
			},
			menu: [
				{ id: MenuId.CommandPalette },
				{ id: MenuId.MenubarAppearanceMenu, group: '4_editor', order: 2 },
				{ id: MenuId.NotebookToolbar, group: 'notebookLayout', order: 2 },
				{ id: MenuId.StickyScrollContext },
				{ id: MenuId.NotebookStickyScrollContext, group: 'notebookView', order: 2 },
				{ id: MenuId.NotebookToolbarContext, group: 'notebookView', order: 2 }
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const config = accessor.get(IConfigurationService);
		const breadCrumbsConfig = BreadcrumbsConfig.IsEnabled.bindTo(config);
		const value = breadCrumbsConfig.getValue();
		breadCrumbsConfig.updateValue(!value);
		breadCrumbsConfig.dispose();
	}

});

// focus/focus-and-select
function focusAndSelectHandler(accessor: ServicesAccessor, select: boolean): void {
	// find widget and focus/select
	const groups = accessor.get(IEditorGroupsService);
	const breadcrumbs = accessor.get(IBreadcrumbsService);
	const widget = breadcrumbs.getWidget(groups.activeGroup.id);
	if (widget) {
		const item = widget.getItems().at(-1);
		widget.setFocused(item);
		if (select) {
			widget.setSelection(item, BreadcrumbsControl.Payload_Pick);
		}
	}
}
registerAction2(class FocusAndSelectBreadcrumbs extends Action2 {
	constructor() {
		super({
			id: 'breadcrumbs.focusAndSelect',
			title: localize2('cmd.focusAndSelect', "Focus and Select Breadcrumbs"),
			precondition: BreadcrumbsControl.CK_BreadcrumbsVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period,
				when: BreadcrumbsControl.CK_BreadcrumbsPossible,
			},
			f1: true
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		focusAndSelectHandler(accessor, true);
	}
});

registerAction2(class FocusBreadcrumbs extends Action2 {
	constructor() {
		super({
			id: 'breadcrumbs.focus',
			title: localize2('cmd.focus', "Focus Breadcrumbs"),
			precondition: BreadcrumbsControl.CK_BreadcrumbsVisible,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Semicolon,
				when: BreadcrumbsControl.CK_BreadcrumbsPossible,
			},
			f1: true
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]): void {
		focusAndSelectHandler(accessor, false);
	}
});

// this commands is only enabled when breadcrumbs are
// disabled which it then enables and focuses
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.toggleToOn',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period,
	when: ContextKeyExpr.not('config.breadcrumbs.enabled'),
	handler: async accessor => {
		const instant = accessor.get(IInstantiationService);
		const config = accessor.get(IConfigurationService);
		// check if enabled and iff not enable
		const isEnabled = BreadcrumbsConfig.IsEnabled.bindTo(config);
		if (!isEnabled.getValue()) {
			await isEnabled.updateValue(true);
			await timeout(50); // hacky - the widget might not be ready yet...
		}
		isEnabled.dispose();
		return instant.invokeFunction(focusAndSelectHandler, true);
	}
});

// navigation
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.focusNext',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.RightArrow,
	secondary: [KeyMod.CtrlCmd | KeyCode.RightArrow],
	mac: {
		primary: KeyCode.RightArrow,
		secondary: [KeyMod.Alt | KeyCode.RightArrow],
	},
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.focusNext();
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.focusPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.LeftArrow,
	secondary: [KeyMod.CtrlCmd | KeyCode.LeftArrow],
	mac: {
		primary: KeyCode.LeftArrow,
		secondary: [KeyMod.Alt | KeyCode.LeftArrow],
	},
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.focusPrev();
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.focusNextWithPicker',
	weight: KeybindingWeight.WorkbenchContrib + 1,
	primary: KeyMod.CtrlCmd | KeyCode.RightArrow,
	mac: {
		primary: KeyMod.Alt | KeyCode.RightArrow,
	},
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive, WorkbenchListFocusContextKey),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.focusNext();
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.focusPreviousWithPicker',
	weight: KeybindingWeight.WorkbenchContrib + 1,
	primary: KeyMod.CtrlCmd | KeyCode.LeftArrow,
	mac: {
		primary: KeyMod.Alt | KeyCode.LeftArrow,
	},
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive, WorkbenchListFocusContextKey),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.focusPrev();
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.selectFocused',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Enter,
	secondary: [KeyCode.DownArrow],
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.setSelection(widget.getFocused(), BreadcrumbsControl.Payload_Pick);
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.revealFocused',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyCode.Space,
	secondary: [KeyMod.CtrlCmd | KeyCode.Enter],
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.setSelection(widget.getFocused(), BreadcrumbsControl.Payload_Reveal);
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.selectEditor',
	weight: KeybindingWeight.WorkbenchContrib + 1,
	primary: KeyCode.Escape,
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive),
	handler(accessor) {
		const groups = accessor.get(IEditorGroupsService);
		const breadcrumbs = accessor.get(IBreadcrumbsService);
		const widget = breadcrumbs.getWidget(groups.activeGroup.id);
		if (!widget) {
			return;
		}
		widget.setFocused(undefined);
		widget.setSelection(undefined);
		groups.activeGroup.activeEditorPane?.focus();
	}
});
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'breadcrumbs.revealFocusedFromTreeAside',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	when: ContextKeyExpr.and(BreadcrumbsControl.CK_BreadcrumbsVisible, BreadcrumbsControl.CK_BreadcrumbsActive, WorkbenchListFocusContextKey),
	handler(accessor) {
		const editors = accessor.get(IEditorService);
		const lists = accessor.get(IListService);

		const tree = lists.lastFocusedList;
		if (!(tree instanceof WorkbenchDataTree) && !(tree instanceof WorkbenchAsyncDataTree)) {
			return;
		}

		const element = <IFileStat | unknown>tree.getFocus()[0];

		if (URI.isUri((<IFileStat>element)?.resource)) {
			// IFileStat: open file in editor
			return editors.openEditor({
				resource: (<IFileStat>element).resource,
				options: { pinned: true }
			}, SIDE_GROUP);
		}

		// IOutline: check if this the outline and iff so reveal element
		const input = tree.getInput();
		if (input && typeof (<IOutline<unknown>>input).outlineKind === 'string') {
			return (<IOutline<unknown>>input).reveal(element, {
				pinned: true,
				preserveFocus: false
			}, true, false);
		}
	}
});
//#endregion

registerAction2(class CopyBreadcrumbPath extends Action2 {
	constructor() {
		super({
			id: 'breadcrumbs.copyPath',
			title: localize2('cmd.copyPath', "Copy Breadcrumbs Path"),
			category: Categories.View,
			precondition: BreadcrumbsControl.CK_BreadcrumbsVisible,
			f1: true,
			menu: [{
				id: MenuId.EditorTitleContext,
				group: '1_cutcopypaste',
				order: 100,
				when: BreadcrumbsControl.CK_BreadcrumbsPossible
			}]
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const groups = accessor.get(IEditorGroupsService);
		const clipboardService = accessor.get(IClipboardService);
		const configurationService = accessor.get(IConfigurationService);
		const outlineService = accessor.get(IOutlineService);

		if (!groups.activeGroup.activeEditorPane) {
			return;
		}

		const outline = await outlineService.createOutline(groups.activeGroup.activeEditorPane, OutlineTarget.Breadcrumbs, CancellationToken.None);
		if (!outline) {
			return;
		}

		const elements = outline.config.breadcrumbsDataSource.getBreadcrumbElements();
		const labels = elements.map(item => item.label).filter(Boolean);

		outline.dispose();

		if (labels.length === 0) {
			return;
		}

		// Get separator with language override support
		const resource = groups.activeGroup.activeEditorPane.input.resource;
		const config = BreadcrumbsConfig.SymbolPathSeparator.bindTo(configurationService);
		const separator = config.getValue(resource && { resource }) ?? '.';
		config.dispose();

		const path = labels.join(separator);
		await clipboardService.writeText(path);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/breadcrumbsModel.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/breadcrumbsModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas, matchesSomeScheme } from '../../../../base/common/network.js';
import { dirname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileKind } from '../../../../platform/files/common/files.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { BreadcrumbsConfig } from './breadcrumbs.js';
import { IEditorPane } from '../../../common/editor.js';
import { IOutline, IOutlineService, OutlineTarget } from '../../../services/outline/browser/outline.js';

export class FileElement {
	constructor(
		readonly uri: URI,
		readonly kind: FileKind
	) { }
}

type FileInfo = { path: FileElement[]; folder?: IWorkspaceFolder };

export class OutlineElement2 {
	constructor(
		readonly element: IOutline<unknown> | unknown,
		readonly outline: IOutline<unknown>
	) { }
}

export class BreadcrumbsModel {

	private readonly _disposables = new DisposableStore();
	private _fileInfo: FileInfo;

	private readonly _cfgFilePath: BreadcrumbsConfig<'on' | 'off' | 'last'>;
	private readonly _cfgSymbolPath: BreadcrumbsConfig<'on' | 'off' | 'last'>;

	private readonly _currentOutline = new MutableDisposable<IOutline<unknown>>();
	private readonly _outlineDisposables = new DisposableStore();

	private readonly _onDidUpdate = new Emitter<this>();
	readonly onDidUpdate: Event<this> = this._onDidUpdate.event;

	constructor(
		readonly resource: URI,
		readonly editor: IEditorPane | undefined,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IOutlineService private readonly _outlineService: IOutlineService,
	) {
		this._cfgFilePath = BreadcrumbsConfig.FilePath.bindTo(configurationService);
		this._cfgSymbolPath = BreadcrumbsConfig.SymbolPath.bindTo(configurationService);

		this._disposables.add(this._cfgFilePath.onDidChange(_ => this._onDidUpdate.fire(this)));
		this._disposables.add(this._cfgSymbolPath.onDidChange(_ => this._onDidUpdate.fire(this)));
		this._workspaceService.onDidChangeWorkspaceFolders(this._onDidChangeWorkspaceFolders, this, this._disposables);
		this._fileInfo = this._initFilePathInfo(resource);

		if (editor) {
			this._bindToEditor(editor);
			this._disposables.add(_outlineService.onDidChange(() => this._bindToEditor(editor)));
			this._disposables.add(editor.onDidChangeControl(() => this._bindToEditor(editor)));
		}
		this._onDidUpdate.fire(this);
	}

	dispose(): void {
		this._disposables.dispose();
		this._cfgFilePath.dispose();
		this._cfgSymbolPath.dispose();
		this._currentOutline.dispose();
		this._outlineDisposables.dispose();
		this._onDidUpdate.dispose();
	}

	isRelative(): boolean {
		return Boolean(this._fileInfo.folder);
	}

	getElements(): ReadonlyArray<FileElement | OutlineElement2> {
		let result: (FileElement | OutlineElement2)[] = [];

		// file path elements
		if (this._cfgFilePath.getValue() === 'on') {
			result = result.concat(this._fileInfo.path);
		} else if (this._cfgFilePath.getValue() === 'last' && this._fileInfo.path.length > 0) {
			result = result.concat(this._fileInfo.path.slice(-1));
		}

		if (this._cfgSymbolPath.getValue() === 'off') {
			return result;
		}

		if (!this._currentOutline.value) {
			return result;
		}

		const breadcrumbsElements = this._currentOutline.value.config.breadcrumbsDataSource.getBreadcrumbElements();
		for (let i = this._cfgSymbolPath.getValue() === 'last' && breadcrumbsElements.length > 0 ? breadcrumbsElements.length - 1 : 0; i < breadcrumbsElements.length; i++) {
			result.push(new OutlineElement2(breadcrumbsElements[i].element, this._currentOutline.value));
		}

		if (breadcrumbsElements.length === 0 && !this._currentOutline.value.isEmpty) {
			result.push(new OutlineElement2(this._currentOutline.value, this._currentOutline.value));
		}

		return result;
	}

	private _initFilePathInfo(uri: URI): FileInfo {

		if (matchesSomeScheme(uri, Schemas.untitled, Schemas.data)) {
			return {
				folder: undefined,
				path: []
			};
		}

		const info: FileInfo = {
			folder: this._workspaceService.getWorkspaceFolder(uri) ?? undefined,
			path: []
		};

		let uriPrefix: URI | null = uri;
		while (uriPrefix && uriPrefix.path !== '/') {
			if (info.folder && isEqual(info.folder.uri, uriPrefix)) {
				break;
			}
			info.path.unshift(new FileElement(uriPrefix, info.path.length === 0 ? FileKind.FILE : FileKind.FOLDER));
			const prevPathLength = uriPrefix.path.length;
			uriPrefix = dirname(uriPrefix);
			if (uriPrefix.path.length === prevPathLength) {
				break;
			}
		}

		if (info.folder && this._workspaceService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			info.path.unshift(new FileElement(info.folder.uri, FileKind.ROOT_FOLDER));
		}
		return info;
	}

	private _onDidChangeWorkspaceFolders() {
		this._fileInfo = this._initFilePathInfo(this.resource);
		this._onDidUpdate.fire(this);
	}

	private _bindToEditor(editor: IEditorPane): void {
		const newCts = new CancellationTokenSource();
		this._currentOutline.clear();
		this._outlineDisposables.clear();
		this._outlineDisposables.add(toDisposable(() => newCts.dispose(true)));

		this._outlineService.createOutline(editor, OutlineTarget.Breadcrumbs, newCts.token).then(outline => {
			if (newCts.token.isCancellationRequested) {
				// cancelled: dispose new outline and reset
				outline?.dispose();
				outline = undefined;
			}
			this._currentOutline.value = outline;
			this._onDidUpdate.fire(this);
			if (outline) {
				this._outlineDisposables.add(outline.onDidChange(() => this._onDidUpdate.fire(this)));
			}

		}).catch(err => {
			this._onDidUpdate.fire(this);
			onUnexpectedError(err);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/parts/editor/breadcrumbsPicker.ts]---
Location: vscode-main/src/vs/workbench/browser/parts/editor/breadcrumbsPicker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareFileNames } from '../../../../base/common/comparers.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMatches, FuzzyScore } from '../../../../base/common/filters.js';
import * as glob from '../../../../base/common/glob.js';
import { IDisposable, DisposableStore, MutableDisposable, Disposable } from '../../../../base/common/lifecycle.js';
import { posix, relative } from '../../../../base/common/path.js';
import { basename, dirname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import './media/breadcrumbscontrol.css';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileKind, FileSystemProviderCapabilities, IFileService, IFileStat } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { WorkbenchDataTree, WorkbenchAsyncDataTree } from '../../../../platform/list/browser/listService.js';
import { breadcrumbsPickerBackground, widgetBorder, widgetShadow } from '../../../../platform/theme/common/colorRegistry.js';
import { isWorkspace, isWorkspaceFolder, IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../../platform/workspace/common/workspace.js';
import { ResourceLabels, IResourceLabel, DEFAULT_LABELS_CONTAINER } from '../../labels.js';
import { BreadcrumbsConfig } from './breadcrumbs.js';
import { OutlineElement2, FileElement } from './breadcrumbsModel.js';
import { IAsyncDataSource, ITreeRenderer, ITreeNode, ITreeFilter, TreeVisibility, ITreeSorter } from '../../../../base/browser/ui/tree/tree.js';
import { IIdentityProvider, IListVirtualDelegate, IKeyboardNavigationLabelProvider } from '../../../../base/browser/ui/list/list.js';
import { IFileIconTheme, IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { localize } from '../../../../nls.js';
import { IOutline, IOutlineComparator } from '../../../services/outline/browser/outline.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';

interface ILayoutInfo {
	maxHeight: number;
	width: number;
	arrowSize: number;
	arrowOffset: number;
	inputHeight: number;
}

type Tree<I, E> = WorkbenchDataTree<I, E, FuzzyScore> | WorkbenchAsyncDataTree<I, E, FuzzyScore>;

export interface SelectEvent {
	target: unknown;
	browserEvent: UIEvent;
}

export abstract class BreadcrumbsPicker<TInput, TElement> {

	protected readonly _disposables = new DisposableStore();
	protected readonly _domNode: HTMLDivElement;
	protected _arrow!: HTMLDivElement;
	protected _treeContainer!: HTMLDivElement;
	protected _tree!: Tree<TInput, TElement>;
	protected _fakeEvent = new UIEvent('fakeEvent');
	protected _layoutInfo!: ILayoutInfo;

	protected readonly _onWillPickElement = new Emitter<void>();
	readonly onWillPickElement: Event<void> = this._onWillPickElement.event;

	private readonly _previewDispoables = new MutableDisposable();

	constructor(
		parent: HTMLElement,
		protected resource: URI,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@IThemeService protected readonly _themeService: IThemeService,
		@IConfigurationService protected readonly _configurationService: IConfigurationService,
	) {
		this._domNode = document.createElement('div');
		this._domNode.className = 'monaco-breadcrumbs-picker show-file-icons';
		parent.appendChild(this._domNode);
	}

	dispose(): void {
		this._disposables.dispose();
		this._previewDispoables.dispose();
		this._onWillPickElement.dispose();
		this._domNode.remove();
		setTimeout(() => this._tree.dispose(), 0); // tree cannot be disposed while being opened...
	}

	async show(input: FileElement | OutlineElement2, maxHeight: number, width: number, arrowSize: number, arrowOffset: number): Promise<void> {

		const theme = this._themeService.getColorTheme();
		const color = theme.getColor(breadcrumbsPickerBackground);

		this._arrow = document.createElement('div');
		this._arrow.className = 'arrow';
		this._arrow.style.borderColor = `transparent transparent ${color ? color.toString() : ''}`;
		this._domNode.appendChild(this._arrow);

		this._treeContainer = document.createElement('div');
		this._treeContainer.style.background = color ? color.toString() : '';
		this._treeContainer.style.paddingTop = '2px';
		this._treeContainer.style.borderRadius = '3px';
		this._treeContainer.style.boxShadow = `0 0 8px 2px ${this._themeService.getColorTheme().getColor(widgetShadow)}`;
		this._treeContainer.style.border = `1px solid ${this._themeService.getColorTheme().getColor(widgetBorder)}`;
		this._domNode.appendChild(this._treeContainer);

		this._layoutInfo = { maxHeight, width, arrowSize, arrowOffset, inputHeight: 0 };
		this._tree = this._createTree(this._treeContainer, input);

		this._disposables.add(this._tree.onDidOpen(async e => {
			const { element, editorOptions, sideBySide } = e;
			const didReveal = await this._revealElement(element, { ...editorOptions, preserveFocus: false }, sideBySide);
			if (!didReveal) {
				return;
			}
		}));
		this._disposables.add(this._tree.onDidChangeFocus(e => {
			this._previewDispoables.value = this._previewElement(e.elements[0]);
		}));
		this._disposables.add(this._tree.onDidChangeContentHeight(() => {
			this._layout();
		}));

		this._domNode.focus();
		try {
			await this._setInput(input);
			this._layout();
		} catch (err) {
			onUnexpectedError(err);
		}
	}

	protected _layout(): void {

		const headerHeight = 2 * this._layoutInfo.arrowSize;
		const treeHeight = Math.min(this._layoutInfo.maxHeight - headerHeight, this._tree.contentHeight);
		const totalHeight = treeHeight + headerHeight;

		this._domNode.style.height = `${totalHeight}px`;
		this._domNode.style.width = `${this._layoutInfo.width}px`;
		this._arrow.style.top = `-${2 * this._layoutInfo.arrowSize}px`;
		this._arrow.style.borderWidth = `${this._layoutInfo.arrowSize}px`;
		this._arrow.style.marginLeft = `${this._layoutInfo.arrowOffset}px`;
		this._treeContainer.style.height = `${treeHeight}px`;
		this._treeContainer.style.width = `${this._layoutInfo.width}px`;
		this._tree.layout(treeHeight, this._layoutInfo.width);
	}

	restoreViewState(): void { }

	protected abstract _setInput(element: FileElement | OutlineElement2): Promise<void>;
	protected abstract _createTree(container: HTMLElement, input: unknown): Tree<TInput, TElement>;
	protected abstract _previewElement(element: unknown): IDisposable;
	protected abstract _revealElement(element: unknown, options: IEditorOptions, sideBySide: boolean): Promise<boolean>;

}

//#region - Files

class FileVirtualDelegate implements IListVirtualDelegate<IFileStat | IWorkspaceFolder> {
	getHeight(_element: IFileStat | IWorkspaceFolder) {
		return 22;
	}
	getTemplateId(_element: IFileStat | IWorkspaceFolder): string {
		return 'FileStat';
	}
}

class FileIdentityProvider implements IIdentityProvider<IWorkspace | IWorkspaceFolder | IFileStat | URI> {
	getId(element: IWorkspace | IWorkspaceFolder | IFileStat | URI): { toString(): string } {
		if (URI.isUri(element)) {
			return element.toString();
		} else if (isWorkspace(element)) {
			return element.id;
		} else if (isWorkspaceFolder(element)) {
			return element.uri.toString();
		} else {
			return element.resource.toString();
		}
	}
}


class FileDataSource implements IAsyncDataSource<IWorkspace | URI, IWorkspaceFolder | IFileStat> {

	constructor(
		@IFileService private readonly _fileService: IFileService,
	) { }

	hasChildren(element: IWorkspace | URI | IWorkspaceFolder | IFileStat): boolean {
		return URI.isUri(element)
			|| isWorkspace(element)
			|| isWorkspaceFolder(element)
			|| element.isDirectory;
	}

	async getChildren(element: IWorkspace | URI | IWorkspaceFolder | IFileStat): Promise<(IWorkspaceFolder | IFileStat)[]> {
		if (isWorkspace(element)) {
			return element.folders;
		}
		let uri: URI;
		if (isWorkspaceFolder(element)) {
			uri = element.uri;
		} else if (URI.isUri(element)) {
			uri = element;
		} else {
			uri = element.resource;
		}
		const stat = await this._fileService.resolve(uri);
		return stat.children ?? [];
	}
}

class FileRenderer implements ITreeRenderer<IFileStat | IWorkspaceFolder, FuzzyScore, IResourceLabel> {

	readonly templateId: string = 'FileStat';

	constructor(
		private readonly _labels: ResourceLabels,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) { }


	renderTemplate(container: HTMLElement): IResourceLabel {
		return this._labels.create(container, { supportHighlights: true });
	}

	renderElement(node: ITreeNode<IWorkspaceFolder | IFileStat, [number, number, number]>, index: number, templateData: IResourceLabel): void {
		const fileDecorations = this._configService.getValue<{ colors: boolean; badges: boolean }>('explorer.decorations');
		const { element } = node;
		let resource: URI;
		let fileKind: FileKind;
		if (isWorkspaceFolder(element)) {
			resource = element.uri;
			fileKind = FileKind.ROOT_FOLDER;
		} else {
			resource = element.resource;
			fileKind = element.isDirectory ? FileKind.FOLDER : FileKind.FILE;
		}
		templateData.setFile(resource, {
			fileKind,
			hidePath: true,
			fileDecorations: fileDecorations,
			matches: createMatches(node.filterData),
			extraClasses: ['picker-item']
		});
	}

	disposeTemplate(templateData: IResourceLabel): void {
		templateData.dispose();
	}
}

class FileNavigationLabelProvider implements IKeyboardNavigationLabelProvider<IWorkspaceFolder | IFileStat> {

	getKeyboardNavigationLabel(element: IWorkspaceFolder | IFileStat): { toString(): string } {
		return element.name;
	}
}

class FileAccessibilityProvider implements IListAccessibilityProvider<IWorkspaceFolder | IFileStat> {

	getWidgetAriaLabel(): string {
		return localize('breadcrumbs', "Breadcrumbs");
	}

	getAriaLabel(element: IWorkspaceFolder | IFileStat): string | null {
		return element.name;
	}
}

class FileFilter implements ITreeFilter<IWorkspaceFolder | IFileStat> {

	private readonly _cachedExpressions = new Map<string, glob.ParsedExpression>();
	private readonly _disposables = new DisposableStore();

	constructor(
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IConfigurationService configService: IConfigurationService,
		@IFileService fileService: IFileService,
	) {
		const config = BreadcrumbsConfig.FileExcludes.bindTo(configService);
		const update = () => {
			_workspaceService.getWorkspace().folders.forEach(folder => {
				const excludesConfig = config.getValue({ resource: folder.uri });
				if (!excludesConfig) {
					return;
				}
				// adjust patterns to be absolute in case they aren't
				// free floating (**/)
				const adjustedConfig: glob.IExpression = {};
				for (const pattern in excludesConfig) {
					if (typeof excludesConfig[pattern] !== 'boolean') {
						continue;
					}
					const patternAbs = pattern.indexOf('**/') !== 0
						? posix.join(folder.uri.path, pattern)
						: pattern;

					adjustedConfig[patternAbs] = excludesConfig[pattern];
				}
				const ignoreCase = !fileService.hasCapability(folder.uri, FileSystemProviderCapabilities.PathCaseSensitive);
				this._cachedExpressions.set(folder.uri.toString(), glob.parse(adjustedConfig, { ignoreCase }));
			});
		};
		update();
		this._disposables.add(config);
		this._disposables.add(config.onDidChange(update));
		this._disposables.add(_workspaceService.onDidChangeWorkspaceFolders(update));
	}

	dispose(): void {
		this._disposables.dispose();
	}

	filter(element: IWorkspaceFolder | IFileStat, _parentVisibility: TreeVisibility): boolean {
		if (isWorkspaceFolder(element)) {
			// not a file
			return true;
		}
		const folder = this._workspaceService.getWorkspaceFolder(element.resource);
		if (!folder || !this._cachedExpressions.has(folder.uri.toString())) {
			// no folder or no filer
			return true;
		}

		const expression = this._cachedExpressions.get(folder.uri.toString())!;
		return !expression(relative(folder.uri.path, element.resource.path), basename(element.resource));
	}
}


export class FileSorter implements ITreeSorter<IFileStat | IWorkspaceFolder> {
	compare(a: IFileStat | IWorkspaceFolder, b: IFileStat | IWorkspaceFolder): number {
		if (isWorkspaceFolder(a) && isWorkspaceFolder(b)) {
			return a.index - b.index;
		}
		if ((a as IFileStat).isDirectory === (b as IFileStat).isDirectory) {
			// same type -> compare on names
			return compareFileNames(a.name, b.name);
		} else if ((a as IFileStat).isDirectory) {
			return -1;
		} else {
			return 1;
		}
	}
}

export class BreadcrumbsFilePicker extends BreadcrumbsPicker<IWorkspace | URI, IWorkspaceFolder | IFileStat> {

	constructor(
		parent: HTMLElement,
		resource: URI,
		@IInstantiationService instantiationService: IInstantiationService,
		@IThemeService themeService: IThemeService,
		@IConfigurationService configService: IConfigurationService,
		@IWorkspaceContextService private readonly _workspaceService: IWorkspaceContextService,
		@IEditorService private readonly _editorService: IEditorService,
	) {
		super(parent, resource, instantiationService, themeService, configService);
	}

	protected _createTree(container: HTMLElement) {

		// tree icon theme specials
		this._treeContainer.classList.add('file-icon-themable-tree');
		this._treeContainer.classList.add('show-file-icons');
		const onFileIconThemeChange = (fileIconTheme: IFileIconTheme) => {
			this._treeContainer.classList.toggle('align-icons-and-twisties', fileIconTheme.hasFileIcons && !fileIconTheme.hasFolderIcons);
			this._treeContainer.classList.toggle('hide-arrows', fileIconTheme.hidesExplorerArrows === true);
		};
		this._disposables.add(this._themeService.onDidFileIconThemeChange(onFileIconThemeChange));
		onFileIconThemeChange(this._themeService.getFileIconTheme());

		const labels = this._instantiationService.createInstance(ResourceLabels, DEFAULT_LABELS_CONTAINER /* TODO@Jo visibility propagation */);
		this._disposables.add(labels);

		return this._instantiationService.createInstance(
			WorkbenchAsyncDataTree<IWorkspace | URI, IWorkspaceFolder | IFileStat, FuzzyScore>,
			'BreadcrumbsFilePicker',
			container,
			new FileVirtualDelegate(),
			[this._instantiationService.createInstance(FileRenderer, labels)],
			this._instantiationService.createInstance(FileDataSource),
			{
				multipleSelectionSupport: false,
				sorter: new FileSorter(),
				filter: this._instantiationService.createInstance(FileFilter),
				identityProvider: new FileIdentityProvider(),
				keyboardNavigationLabelProvider: new FileNavigationLabelProvider(),
				accessibilityProvider: this._instantiationService.createInstance(FileAccessibilityProvider),
				showNotFoundMessage: false,
				overrideStyles: {
					listBackground: breadcrumbsPickerBackground
				},
			});
	}

	protected async _setInput(element: FileElement | OutlineElement2): Promise<void> {
		const { uri, kind } = (element as FileElement);
		let input: IWorkspace | URI;
		if (kind === FileKind.ROOT_FOLDER) {
			input = this._workspaceService.getWorkspace();
		} else {
			input = dirname(uri);
		}

		const tree = this._tree as WorkbenchAsyncDataTree<IWorkspace | URI, IWorkspaceFolder | IFileStat, FuzzyScore>;
		await tree.setInput(input);
		let focusElement: IWorkspaceFolder | IFileStat | undefined;
		for (const { element } of tree.getNode().children) {
			if (isWorkspaceFolder(element) && isEqual(element.uri, uri)) {
				focusElement = element;
				break;
			} else if (isEqual((element as IFileStat).resource, uri)) {
				focusElement = element as IFileStat;
				break;
			}
		}
		if (focusElement) {
			tree.reveal(focusElement, 0.5);
			tree.setFocus([focusElement], this._fakeEvent);
		}
		tree.domFocus();
	}

	protected _previewElement(_element: unknown): IDisposable {
		return Disposable.None;
	}

	protected async _revealElement(element: IFileStat | IWorkspaceFolder, options: IEditorOptions, sideBySide: boolean): Promise<boolean> {
		if (!isWorkspaceFolder(element) && element.isFile) {
			this._onWillPickElement.fire();
			await this._editorService.openEditor({ resource: element.resource, options }, sideBySide ? SIDE_GROUP : undefined);
			return true;
		}
		return false;
	}
}
//#endregion

//#region - Outline

class OutlineTreeSorter<E> implements ITreeSorter<E> {

	private _order: 'name' | 'type' | 'position';

	constructor(
		private comparator: IOutlineComparator<E>,
		uri: URI | undefined,
		@ITextResourceConfigurationService configService: ITextResourceConfigurationService,
	) {
		this._order = configService.getValue(uri, 'breadcrumbs.symbolSortOrder');
	}

	compare(a: E, b: E): number {
		if (this._order === 'name') {
			return this.comparator.compareByName(a, b);
		} else if (this._order === 'type') {
			return this.comparator.compareByType(a, b);
		} else {
			return this.comparator.compareByPosition(a, b);
		}
	}
}

export class BreadcrumbsOutlinePicker extends BreadcrumbsPicker<IOutline<unknown>, unknown> {

	protected _createTree(container: HTMLElement, input: OutlineElement2) {

		const { config } = input.outline;

		return this._instantiationService.createInstance(
			WorkbenchDataTree<IOutline<unknown>, unknown, FuzzyScore>,
			'BreadcrumbsOutlinePicker',
			container,
			config.delegate,
			config.renderers,
			config.treeDataSource,
			{
				...config.options,
				sorter: this._instantiationService.createInstance(OutlineTreeSorter, config.comparator, undefined),
				collapseByDefault: true,
				expandOnlyOnTwistieClick: true,
				multipleSelectionSupport: false,
				showNotFoundMessage: false
			}
		);
	}

	protected _setInput(input: OutlineElement2): Promise<void> {

		const viewState = input.outline.captureViewState();
		this.restoreViewState = () => { viewState.dispose(); };

		const tree = this._tree as WorkbenchDataTree<IOutline<unknown>, unknown, FuzzyScore>;

		tree.setInput(input.outline);
		if (input.element !== input.outline) {
			tree.reveal(input.element, 0.5);
			tree.setFocus([input.element], this._fakeEvent);
		}
		tree.domFocus();

		return Promise.resolve();
	}

	protected _previewElement(element: unknown): IDisposable {
		const outline: IOutline<unknown> = this._tree.getInput()!;
		return outline.preview(element);
	}

	protected async _revealElement(element: unknown, options: IEditorOptions, sideBySide: boolean): Promise<boolean> {
		this._onWillPickElement.fire();
		const outline: IOutline<unknown> = this._tree.getInput()!;
		await outline.reveal(element, options, sideBySide, false);
		return true;
	}
}

//#endregion
```

--------------------------------------------------------------------------------

````

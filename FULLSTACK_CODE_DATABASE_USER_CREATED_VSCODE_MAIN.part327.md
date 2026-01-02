---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 327
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 327 of 552)

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

---[FILE: src/vs/workbench/browser/actions/layoutActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/layoutActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILocalizedString, localize, localize2 } from '../../../nls.js';
import { MenuId, MenuRegistry, registerAction2, Action2 } from '../../../platform/actions/common/actions.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { EditorActionsLocation, EditorTabsMode, IWorkbenchLayoutService, LayoutSettings, Parts, Position, ZenModeSettings, positionToString } from '../../services/layout/browser/layoutService.js';
import { ServicesAccessor, IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { KeyMod, KeyCode, KeyChord } from '../../../base/common/keyCodes.js';
import { isWindows, isLinux, isWeb, isMacintosh, isNative } from '../../../base/common/platform.js';
import { IsMacNativeContext } from '../../../platform/contextkey/common/contextkeys.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService, ViewContainerLocation, IViewDescriptor, ViewContainerLocationToString } from '../../common/views.js';
import { IViewsService } from '../../services/views/common/viewsService.js';
import { QuickPickItem, IQuickInputService, IQuickPickItem, IQuickPickSeparator, IQuickPick } from '../../../platform/quickinput/common/quickInput.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { ToggleAuxiliaryBarAction } from '../parts/auxiliarybar/auxiliaryBarActions.js';
import { TogglePanelAction } from '../parts/panel/panelActions.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { AuxiliaryBarVisibleContext, PanelAlignmentContext, PanelVisibleContext, SideBarVisibleContext, FocusedViewContext, InEditorZenModeContext, IsMainEditorCenteredLayoutContext, MainEditorAreaVisibleContext, IsMainWindowFullscreenContext, PanelPositionContext, IsAuxiliaryWindowFocusedContext, TitleBarStyleContext, IsAuxiliaryWindowContext } from '../../common/contextkeys.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { registerIcon } from '../../../platform/theme/common/iconRegistry.js';
import { ICommandActionTitle } from '../../../platform/action/common/action.js';
import { mainWindow } from '../../../base/browser/window.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { MenuSettings, TitlebarStyle } from '../../../platform/window/common/window.js';
import { IPreferencesService } from '../../services/preferences/common/preferences.js';
import { QuickInputAlignmentContextKey } from '../../../platform/quickinput/browser/quickInput.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';

// Register Icons
const menubarIcon = registerIcon('menuBar', Codicon.layoutMenubar, localize('menuBarIcon', "Represents the menu bar"));
const activityBarLeftIcon = registerIcon('activity-bar-left', Codicon.layoutActivitybarLeft, localize('activityBarLeft', "Represents the activity bar in the left position"));
const activityBarRightIcon = registerIcon('activity-bar-right', Codicon.layoutActivitybarRight, localize('activityBarRight', "Represents the activity bar in the right position"));
const panelLeftIcon = registerIcon('panel-left', Codicon.layoutSidebarLeft, localize('panelLeft', "Represents a side bar in the left position"));
const panelLeftOffIcon = registerIcon('panel-left-off', Codicon.layoutSidebarLeftOff, localize('panelLeftOff', "Represents a side bar in the left position toggled off"));
const panelRightIcon = registerIcon('panel-right', Codicon.layoutSidebarRight, localize('panelRight', "Represents side bar in the right position"));
const panelRightOffIcon = registerIcon('panel-right-off', Codicon.layoutSidebarRightOff, localize('panelRightOff', "Represents side bar in the right position toggled off"));
const panelIcon = registerIcon('panel-bottom', Codicon.layoutPanel, localize('panelBottom', "Represents the bottom panel"));
const statusBarIcon = registerIcon('statusBar', Codicon.layoutStatusbar, localize('statusBarIcon', "Represents the status bar"));

const panelAlignmentLeftIcon = registerIcon('panel-align-left', Codicon.layoutPanelLeft, localize('panelBottomLeft', "Represents the bottom panel alignment set to the left"));
const panelAlignmentRightIcon = registerIcon('panel-align-right', Codicon.layoutPanelRight, localize('panelBottomRight', "Represents the bottom panel alignment set to the right"));
const panelAlignmentCenterIcon = registerIcon('panel-align-center', Codicon.layoutPanelCenter, localize('panelBottomCenter', "Represents the bottom panel alignment set to the center"));
const panelAlignmentJustifyIcon = registerIcon('panel-align-justify', Codicon.layoutPanelJustify, localize('panelBottomJustify', "Represents the bottom panel alignment set to justified"));

const quickInputAlignmentTopIcon = registerIcon('quickInputAlignmentTop', Codicon.arrowUp, localize('quickInputAlignmentTop', "Represents quick input alignment set to the top"));
const quickInputAlignmentCenterIcon = registerIcon('quickInputAlignmentCenter', Codicon.circle, localize('quickInputAlignmentCenter', "Represents quick input alignment set to the center"));

const fullscreenIcon = registerIcon('fullscreen', Codicon.screenFull, localize('fullScreenIcon', "Represents full screen"));
const centerLayoutIcon = registerIcon('centerLayoutIcon', Codicon.layoutCentered, localize('centerLayoutIcon', "Represents centered layout mode"));
const zenModeIcon = registerIcon('zenMode', Codicon.target, localize('zenModeIcon', "Represents zen mode"));

export const ToggleActivityBarVisibilityActionId = 'workbench.action.toggleActivityBarVisibility';

// --- Toggle Centered Layout

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleCenteredLayout',
			title: {
				...localize2('toggleCenteredLayout', "Toggle Centered Layout"),
				mnemonicTitle: localize({ key: 'miToggleCenteredLayout', comment: ['&& denotes a mnemonic'] }, "&&Centered Layout"),
			},
			precondition: IsAuxiliaryWindowFocusedContext.toNegated(),
			category: Categories.View,
			f1: true,
			toggled: IsMainEditorCenteredLayoutContext,
			menu: [{
				id: MenuId.MenubarAppearanceMenu,
				group: '1_toggle_view',
				order: 3
			}]
		});
	}

	run(accessor: ServicesAccessor): void {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const editorGroupService = accessor.get(IEditorGroupsService);

		layoutService.centerMainEditorLayout(!layoutService.isMainEditorLayoutCentered());
		editorGroupService.activeGroup.focus();
	}
});

// --- Set Sidebar Position
const sidebarPositionConfigurationKey = 'workbench.sideBar.location';

class MoveSidebarPositionAction extends Action2 {
	constructor(id: string, title: ICommandActionTitle, private readonly position: Position) {
		super({
			id,
			title,
			f1: false
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const configurationService = accessor.get(IConfigurationService);

		const position = layoutService.getSideBarPosition();
		if (position !== this.position) {
			return configurationService.updateValue(sidebarPositionConfigurationKey, positionToString(this.position));
		}
	}
}

class MoveSidebarRightAction extends MoveSidebarPositionAction {
	static readonly ID = 'workbench.action.moveSideBarRight';

	constructor() {
		super(MoveSidebarRightAction.ID, localize2('moveSidebarRight', "Move Primary Side Bar Right"), Position.RIGHT);
	}
}

class MoveSidebarLeftAction extends MoveSidebarPositionAction {
	static readonly ID = 'workbench.action.moveSideBarLeft';

	constructor() {
		super(MoveSidebarLeftAction.ID, localize2('moveSidebarLeft', "Move Primary Side Bar Left"), Position.LEFT);
	}
}

registerAction2(MoveSidebarRightAction);
registerAction2(MoveSidebarLeftAction);

// --- Toggle Sidebar Position

export class ToggleSidebarPositionAction extends Action2 {

	static readonly ID = 'workbench.action.toggleSidebarPosition';
	static readonly LABEL = localize('toggleSidebarPosition', "Toggle Primary Side Bar Position");

	static getLabel(layoutService: IWorkbenchLayoutService): string {
		return layoutService.getSideBarPosition() === Position.LEFT ? localize('moveSidebarRight', "Move Primary Side Bar Right") : localize('moveSidebarLeft', "Move Primary Side Bar Left");
	}

	constructor() {
		super({
			id: ToggleSidebarPositionAction.ID,
			title: localize2('toggleSidebarPosition', "Toggle Primary Side Bar Position"),
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const configurationService = accessor.get(IConfigurationService);

		const position = layoutService.getSideBarPosition();
		const newPositionValue = (position === Position.LEFT) ? 'right' : 'left';

		return configurationService.updateValue(sidebarPositionConfigurationKey, newPositionValue);
	}
}

registerAction2(ToggleSidebarPositionAction);

const configureLayoutIcon = registerIcon('configure-layout-icon', Codicon.layout, localize('cofigureLayoutIcon', 'Icon represents workbench layout configuration.'));
MenuRegistry.appendMenuItem(MenuId.LayoutControlMenu, {
	submenu: MenuId.LayoutControlMenuSubmenu,
	title: localize('configureLayout', "Configure Layout"),
	icon: configureLayoutIcon,
	group: '1_workbench_layout',
	when: ContextKeyExpr.and(
		IsAuxiliaryWindowContext.negate(),
		ContextKeyExpr.equals('config.workbench.layoutControl.type', 'menu')
	)
});


MenuRegistry.appendMenuItems([{
	id: MenuId.ViewContainerTitleContext,
	item: {
		group: '3_workbench_layout_move',
		command: {
			id: ToggleSidebarPositionAction.ID,
			title: localize('move side bar right', "Move Primary Side Bar Right")
		},
		when: ContextKeyExpr.and(ContextKeyExpr.notEquals('config.workbench.sideBar.location', 'right'), ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.Sidebar))),
		order: 1
	}
}, {
	id: MenuId.ViewContainerTitleContext,
	item: {
		group: '3_workbench_layout_move',
		command: {
			id: ToggleSidebarPositionAction.ID,
			title: localize('move sidebar left', "Move Primary Side Bar Left")
		},
		when: ContextKeyExpr.and(ContextKeyExpr.equals('config.workbench.sideBar.location', 'right'), ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.Sidebar))),
		order: 1
	}
}, {
	id: MenuId.ViewContainerTitleContext,
	item: {
		group: '3_workbench_layout_move',
		command: {
			id: ToggleSidebarPositionAction.ID,
			title: localize('move second sidebar left', "Move Secondary Side Bar Left")
		},
		when: ContextKeyExpr.and(ContextKeyExpr.notEquals('config.workbench.sideBar.location', 'right'), ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar))),
		order: 1
	}
}, {
	id: MenuId.ViewContainerTitleContext,
	item: {
		group: '3_workbench_layout_move',
		command: {
			id: ToggleSidebarPositionAction.ID,
			title: localize('move second sidebar right', "Move Secondary Side Bar Right")
		},
		when: ContextKeyExpr.and(ContextKeyExpr.equals('config.workbench.sideBar.location', 'right'), ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.AuxiliaryBar))),
		order: 1
	}
}]);

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	group: '3_workbench_layout_move',
	command: {
		id: ToggleSidebarPositionAction.ID,
		title: localize({ key: 'miMoveSidebarRight', comment: ['&& denotes a mnemonic'] }, "&&Move Primary Side Bar Right")
	},
	when: ContextKeyExpr.notEquals('config.workbench.sideBar.location', 'right'),
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	group: '3_workbench_layout_move',
	command: {
		id: ToggleSidebarPositionAction.ID,
		title: localize({ key: 'miMoveSidebarLeft', comment: ['&& denotes a mnemonic'] }, "&&Move Primary Side Bar Left")
	},
	when: ContextKeyExpr.equals('config.workbench.sideBar.location', 'right'),
	order: 2
});

// --- Toggle Editor Visibility

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleEditorVisibility',
			title: {
				...localize2('toggleEditor', "Toggle Editor Area Visibility"),
				mnemonicTitle: localize({ key: 'miShowEditorArea', comment: ['&& denotes a mnemonic'] }, "Show &&Editor Area"),
			},
			category: Categories.View,
			f1: true,
			toggled: MainEditorAreaVisibleContext,
			// the workbench grid currently prevents us from supporting panel maximization with non-center panel alignment
			precondition: ContextKeyExpr.and(IsAuxiliaryWindowFocusedContext.toNegated(), ContextKeyExpr.or(PanelAlignmentContext.isEqualTo('center'), PanelPositionContext.notEqualsTo('bottom')))
		});
	}

	run(accessor: ServicesAccessor): void {
		accessor.get(IWorkbenchLayoutService).toggleMaximizedPanel();
	}
});

MenuRegistry.appendMenuItem(MenuId.MenubarViewMenu, {
	group: '2_appearance',
	title: localize({ key: 'miAppearance', comment: ['&& denotes a mnemonic'] }, "&&Appearance"),
	submenu: MenuId.MenubarAppearanceMenu,
	order: 1
});

// Toggle Sidebar Visibility

export class ToggleSidebarVisibilityAction extends Action2 {

	static readonly ID = 'workbench.action.toggleSidebarVisibility';
	static readonly LABEL = localize('compositePart.hideSideBarLabel', "Hide Primary Side Bar");

	constructor() {
		super({
			id: ToggleSidebarVisibilityAction.ID,
			title: localize2('toggleSidebar', 'Toggle Primary Side Bar Visibility'),
			toggled: {
				condition: SideBarVisibleContext,
				title: localize('primary sidebar', "Primary Side Bar"),
				mnemonicTitle: localize({ key: 'primary sidebar mnemonic', comment: ['&& denotes a mnemonic'] }, "&&Primary Side Bar"),
			},
			metadata: {
				description: localize('openAndCloseSidebar', 'Open/Show and Close/Hide Sidebar'),
			},
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyB
			},
			menu: [
				{
					id: MenuId.LayoutControlMenuSubmenu,
					group: '0_workbench_layout',
					order: 0
				},
				{
					id: MenuId.MenubarAppearanceMenu,
					group: '2_workbench_layout',
					order: 1
				}
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const isCurrentlyVisible = layoutService.isVisible(Parts.SIDEBAR_PART);

		layoutService.setPartHidden(isCurrentlyVisible, Parts.SIDEBAR_PART);

		// Announce visibility change to screen readers
		const alertMessage = isCurrentlyVisible
			? localize('sidebarHidden', "Primary Side Bar hidden")
			: localize('sidebarVisible', "Primary Side Bar shown");
		alert(alertMessage);
	}
}

registerAction2(ToggleSidebarVisibilityAction);

MenuRegistry.appendMenuItems([
	{
		id: MenuId.ViewContainerTitleContext,
		item: {
			group: '3_workbench_layout_move',
			command: {
				id: ToggleSidebarVisibilityAction.ID,
				title: localize('compositePart.hideSideBarLabel', "Hide Primary Side Bar"),
			},
			when: ContextKeyExpr.and(SideBarVisibleContext, ContextKeyExpr.equals('viewContainerLocation', ViewContainerLocationToString(ViewContainerLocation.Sidebar))),
			order: 2
		}
	}, {
		id: MenuId.LayoutControlMenu,
		item: {
			group: '2_pane_toggles',
			command: {
				id: ToggleSidebarVisibilityAction.ID,
				title: localize('toggleSideBar', "Toggle Primary Side Bar"),
				icon: panelLeftOffIcon,
				toggled: { condition: SideBarVisibleContext, icon: panelLeftIcon }
			},
			when: ContextKeyExpr.and(
				IsAuxiliaryWindowContext.negate(),
				ContextKeyExpr.or(
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'toggles'),
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')),
				ContextKeyExpr.equals('config.workbench.sideBar.location', 'left')
			),
			order: 0
		}
	}, {
		id: MenuId.LayoutControlMenu,
		item: {
			group: '2_pane_toggles',
			command: {
				id: ToggleSidebarVisibilityAction.ID,
				title: localize('toggleSideBar', "Toggle Primary Side Bar"),
				icon: panelRightOffIcon,
				toggled: { condition: SideBarVisibleContext, icon: panelRightIcon }
			},
			when: ContextKeyExpr.and(
				IsAuxiliaryWindowContext.negate(),
				ContextKeyExpr.or(
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'toggles'),
					ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')),
				ContextKeyExpr.equals('config.workbench.sideBar.location', 'right')
			),
			order: 2
		}
	}
]);

// --- Toggle Statusbar Visibility

export class ToggleStatusbarVisibilityAction extends Action2 {

	static readonly ID = 'workbench.action.toggleStatusbarVisibility';

	private static readonly statusbarVisibleKey = 'workbench.statusBar.visible';

	constructor() {
		super({
			id: ToggleStatusbarVisibilityAction.ID,
			title: {
				...localize2('toggleStatusbar', "Toggle Status Bar Visibility"),
				mnemonicTitle: localize({ key: 'miStatusbar', comment: ['&& denotes a mnemonic'] }, "S&&tatus Bar"),
			},
			category: Categories.View,
			f1: true,
			toggled: ContextKeyExpr.equals('config.workbench.statusBar.visible', true),
			menu: [{
				id: MenuId.MenubarAppearanceMenu,
				group: '2_workbench_layout',
				order: 3
			}]
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const configurationService = accessor.get(IConfigurationService);

		const visibility = layoutService.isVisible(Parts.STATUSBAR_PART, mainWindow);
		const newVisibilityValue = !visibility;

		return configurationService.updateValue(ToggleStatusbarVisibilityAction.statusbarVisibleKey, newVisibilityValue);
	}
}

registerAction2(ToggleStatusbarVisibilityAction);

// ------------------- Editor Tabs Layout --------------------------------

abstract class AbstractSetShowTabsAction extends Action2 {

	constructor(private readonly settingName: string, private readonly value: string, title: ICommandActionTitle, id: string, precondition: ContextKeyExpression, description: string | ILocalizedString | undefined) {
		super({
			id,
			title,
			category: Categories.View,
			precondition,
			metadata: description ? { description } : undefined,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		return configurationService.updateValue(this.settingName, this.value);
	}
}

// --- Hide Editor Tabs

export class HideEditorTabsAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.hideEditorTabs';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_TABS_MODE}`, EditorTabsMode.NONE).negate(), InEditorZenModeContext.negate())!;
		const title = localize2('hideEditorTabs', 'Hide Editor Tabs');
		super(LayoutSettings.EDITOR_TABS_MODE, EditorTabsMode.NONE, title, HideEditorTabsAction.ID, precondition, localize2('hideEditorTabsDescription', "Hide Tab Bar"));
	}
}

export class ZenHideEditorTabsAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.zenHideEditorTabs';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${ZenModeSettings.SHOW_TABS}`, EditorTabsMode.NONE).negate(), InEditorZenModeContext)!;
		const title = localize2('hideEditorTabsZenMode', 'Hide Editor Tabs in Zen Mode');
		super(ZenModeSettings.SHOW_TABS, EditorTabsMode.NONE, title, ZenHideEditorTabsAction.ID, precondition, localize2('hideEditorTabsZenModeDescription', "Hide Tab Bar in Zen Mode"));
	}
}

// --- Show Multiple Editor Tabs

export class ShowMultipleEditorTabsAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.showMultipleEditorTabs';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_TABS_MODE}`, EditorTabsMode.MULTIPLE).negate(), InEditorZenModeContext.negate())!;
		const title = localize2('showMultipleEditorTabs', 'Show Multiple Editor Tabs');

		super(LayoutSettings.EDITOR_TABS_MODE, EditorTabsMode.MULTIPLE, title, ShowMultipleEditorTabsAction.ID, precondition, localize2('showMultipleEditorTabsDescription', "Show Tab Bar with multiple tabs"));
	}
}

export class ZenShowMultipleEditorTabsAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.zenShowMultipleEditorTabs';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${ZenModeSettings.SHOW_TABS}`, EditorTabsMode.MULTIPLE).negate(), InEditorZenModeContext)!;
		const title = localize2('showMultipleEditorTabsZenMode', 'Show Multiple Editor Tabs in Zen Mode');

		super(ZenModeSettings.SHOW_TABS, EditorTabsMode.MULTIPLE, title, ZenShowMultipleEditorTabsAction.ID, precondition, localize2('showMultipleEditorTabsZenModeDescription', "Show Tab Bar in Zen Mode"));
	}
}

// --- Show Single Editor Tab

export class ShowSingleEditorTabAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.showEditorTab';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_TABS_MODE}`, EditorTabsMode.SINGLE).negate(), InEditorZenModeContext.negate())!;
		const title = localize2('showSingleEditorTab', 'Show Single Editor Tab');

		super(LayoutSettings.EDITOR_TABS_MODE, EditorTabsMode.SINGLE, title, ShowSingleEditorTabAction.ID, precondition, localize2('showSingleEditorTabDescription', "Show Tab Bar with one Tab"));
	}
}

export class ZenShowSingleEditorTabAction extends AbstractSetShowTabsAction {

	static readonly ID = 'workbench.action.zenShowEditorTab';

	constructor() {
		const precondition = ContextKeyExpr.and(ContextKeyExpr.equals(`config.${ZenModeSettings.SHOW_TABS}`, EditorTabsMode.SINGLE).negate(), InEditorZenModeContext)!;
		const title = localize2('showSingleEditorTabZenMode', 'Show Single Editor Tab in Zen Mode');

		super(ZenModeSettings.SHOW_TABS, EditorTabsMode.SINGLE, title, ZenShowSingleEditorTabAction.ID, precondition, localize2('showSingleEditorTabZenModeDescription', "Show Tab Bar in Zen Mode with one Tab"));
	}
}

registerAction2(HideEditorTabsAction);
registerAction2(ZenHideEditorTabsAction);
registerAction2(ShowMultipleEditorTabsAction);
registerAction2(ZenShowMultipleEditorTabsAction);
registerAction2(ShowSingleEditorTabAction);
registerAction2(ZenShowSingleEditorTabAction);

// --- Tab Bar Submenu in View Appearance Menu

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.EditorTabsBarShowTabsSubmenu,
	title: localize('tabBar', "Tab Bar"),
	group: '3_workbench_layout_move',
	order: 10,
	when: InEditorZenModeContext.negate()
});

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.EditorTabsBarShowTabsZenModeSubmenu,
	title: localize('tabBar', "Tab Bar"),
	group: '3_workbench_layout_move',
	order: 10,
	when: InEditorZenModeContext
});

// --- Show Editor Actions in Title Bar

export class EditorActionsTitleBarAction extends Action2 {

	static readonly ID = 'workbench.action.editorActionsTitleBar';

	constructor() {
		super({
			id: EditorActionsTitleBarAction.ID,
			title: localize2('moveEditorActionsToTitleBar', "Move Editor Actions to Title Bar"),
			category: Categories.View,
			precondition: ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_ACTIONS_LOCATION}`, EditorActionsLocation.TITLEBAR).negate(),
			metadata: { description: localize2('moveEditorActionsToTitleBarDescription', "Move Editor Actions from the tab bar to the title bar") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		return configurationService.updateValue(LayoutSettings.EDITOR_ACTIONS_LOCATION, EditorActionsLocation.TITLEBAR);
	}
}
registerAction2(EditorActionsTitleBarAction);

// --- Editor Actions Default Position

export class EditorActionsDefaultAction extends Action2 {

	static readonly ID = 'workbench.action.editorActionsDefault';

	constructor() {
		super({
			id: EditorActionsDefaultAction.ID,
			title: localize2('moveEditorActionsToTabBar', "Move Editor Actions to Tab Bar"),
			category: Categories.View,
			precondition: ContextKeyExpr.and(
				ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_ACTIONS_LOCATION}`, EditorActionsLocation.DEFAULT).negate(),
				ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_TABS_MODE}`, EditorTabsMode.NONE).negate(),
			),
			metadata: { description: localize2('moveEditorActionsToTabBarDescription', "Move Editor Actions from the title bar to the tab bar") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		return configurationService.updateValue(LayoutSettings.EDITOR_ACTIONS_LOCATION, EditorActionsLocation.DEFAULT);
	}
}
registerAction2(EditorActionsDefaultAction);

// --- Hide Editor Actions

export class HideEditorActionsAction extends Action2 {

	static readonly ID = 'workbench.action.hideEditorActions';

	constructor() {
		super({
			id: HideEditorActionsAction.ID,
			title: localize2('hideEditorActons', "Hide Editor Actions"),
			category: Categories.View,
			precondition: ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_ACTIONS_LOCATION}`, EditorActionsLocation.HIDDEN).negate(),
			metadata: { description: localize2('hideEditorActonsDescription', "Hide Editor Actions in the tab and title bar") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		return configurationService.updateValue(LayoutSettings.EDITOR_ACTIONS_LOCATION, EditorActionsLocation.HIDDEN);
	}
}
registerAction2(HideEditorActionsAction);

// --- Hide Editor Actions

export class ShowEditorActionsAction extends Action2 {

	static readonly ID = 'workbench.action.showEditorActions';

	constructor() {
		super({
			id: ShowEditorActionsAction.ID,
			title: localize2('showEditorActons', "Show Editor Actions"),
			category: Categories.View,
			precondition: ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_ACTIONS_LOCATION}`, EditorActionsLocation.HIDDEN),
			metadata: { description: localize2('showEditorActonsDescription', "Make Editor Actions visible.") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);
		return configurationService.updateValue(LayoutSettings.EDITOR_ACTIONS_LOCATION, EditorActionsLocation.DEFAULT);
	}
}
registerAction2(ShowEditorActionsAction);

// --- Editor Actions Position Submenu in View Appearance Menu

MenuRegistry.appendMenuItem(MenuId.MenubarAppearanceMenu, {
	submenu: MenuId.EditorActionsPositionSubmenu,
	title: localize('editorActionsPosition', "Editor Actions Position"),
	group: '3_workbench_layout_move',
	order: 11
});

// --- Configure Tabs Layout

export class ConfigureEditorTabsAction extends Action2 {

	static readonly ID = 'workbench.action.configureEditorTabs';

	constructor() {
		super({
			id: ConfigureEditorTabsAction.ID,
			title: localize2('configureTabs', "Configure Tabs"),
			category: Categories.View,
		});
	}

	run(accessor: ServicesAccessor) {
		const preferencesService = accessor.get(IPreferencesService);
		preferencesService.openSettings({ jsonEditor: false, query: 'workbench.editor tab' });
	}
}
registerAction2(ConfigureEditorTabsAction);

// --- Configure Editor

export class ConfigureEditorAction extends Action2 {

	static readonly ID = 'workbench.action.configureEditor';

	constructor() {
		super({
			id: ConfigureEditorAction.ID,
			title: localize2('configureEditors', "Configure Editors"),
			category: Categories.View,
		});
	}

	run(accessor: ServicesAccessor) {
		const preferencesService = accessor.get(IPreferencesService);
		preferencesService.openSettings({ jsonEditor: false, query: 'workbench.editor' });
	}
}
registerAction2(ConfigureEditorAction);

// --- Toggle Pinned Tabs On Separate Row

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleSeparatePinnedEditorTabs',
			title: localize2('toggleSeparatePinnedEditorTabs', "Separate Pinned Editor Tabs"),
			category: Categories.View,
			precondition: ContextKeyExpr.equals(`config.${LayoutSettings.EDITOR_TABS_MODE}`, EditorTabsMode.MULTIPLE),
			metadata: { description: localize2('toggleSeparatePinnedEditorTabsDescription', "Toggle whether pinned editor tabs are shown on a separate row above unpinned tabs.") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor): Promise<void> {
		const configurationService = accessor.get(IConfigurationService);

		const oldettingValue = configurationService.getValue<string>('workbench.editor.pinnedTabsOnSeparateRow');
		const newSettingValue = !oldettingValue;

		return configurationService.updateValue('workbench.editor.pinnedTabsOnSeparateRow', newSettingValue);
	}
});

// --- Toggle Zen Mode

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleZenMode',
			title: {
				...localize2('toggleZenMode', "Toggle Zen Mode"),
				mnemonicTitle: localize({ key: 'miToggleZenMode', comment: ['&& denotes a mnemonic'] }, "Zen Mode"),
			},
			precondition: IsAuxiliaryWindowFocusedContext.toNegated(),
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyZ)
			},
			toggled: InEditorZenModeContext,
			menu: [{
				id: MenuId.MenubarAppearanceMenu,
				group: '1_toggle_view',
				order: 2
			}]
		});
	}

	run(accessor: ServicesAccessor): void {
		return accessor.get(IWorkbenchLayoutService).toggleZenMode();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.exitZenMode',
	weight: KeybindingWeight.EditorContrib - 1000,
	handler(accessor: ServicesAccessor) {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const contextKeyService = accessor.get(IContextKeyService);
		if (InEditorZenModeContext.getValue(contextKeyService)) {
			layoutService.toggleZenMode();
		}
	},
	when: InEditorZenModeContext,
	primary: KeyChord(KeyCode.Escape, KeyCode.Escape)
});

// --- Toggle Menu Bar

if (isWindows || isLinux || isWeb) {
	registerAction2(class ToggleMenubarAction extends Action2 {

		constructor() {
			super({
				id: 'workbench.action.toggleMenuBar',
				title: {
					...localize2('toggleMenuBar', "Toggle Menu Bar"),
					mnemonicTitle: localize({ key: 'miMenuBar', comment: ['&& denotes a mnemonic'] }, "Menu &&Bar"),
				},
				category: Categories.View,
				f1: true,
				toggled: ContextKeyExpr.and(IsMacNativeContext.toNegated(), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'hidden'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'toggle'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'compact')),
				menu: [{
					id: MenuId.MenubarAppearanceMenu,
					group: '2_workbench_layout',
					order: 0
				}]
			});
		}

		run(accessor: ServicesAccessor): void {
			return accessor.get(IWorkbenchLayoutService).toggleMenuBar();
		}
	});

	// Add separately to title bar context menu so we can use a different title
	for (const menuId of [MenuId.TitleBarContext, MenuId.TitleBarTitleContext]) {
		MenuRegistry.appendMenuItem(menuId, {
			command: {
				id: 'workbench.action.toggleMenuBar',
				title: localize('miMenuBarNoMnemonic', "Menu Bar"),
				toggled: ContextKeyExpr.and(IsMacNativeContext.toNegated(), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'hidden'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'toggle'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'compact'))
			},
			when: ContextKeyExpr.and(IsAuxiliaryWindowFocusedContext.toNegated(), ContextKeyExpr.notEquals(TitleBarStyleContext.key, TitlebarStyle.NATIVE), IsMainWindowFullscreenContext.negate()),
			group: '2_config',
			order: 0
		});
	}
}

// --- Reset View Locations

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.resetViewLocations',
			title: localize2('resetViewLocations', "Reset View Locations"),
			category: Categories.View,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		return accessor.get(IViewDescriptorService).reset();
	}
});

// --- Move View

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.moveView',
			title: localize2('moveView', "Move View"),
			category: Categories.View,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const instantiationService = accessor.get(IInstantiationService);
		const quickInputService = accessor.get(IQuickInputService);
		const contextKeyService = accessor.get(IContextKeyService);
		const paneCompositePartService = accessor.get(IPaneCompositePartService);

		const focusedViewId = FocusedViewContext.getValue(contextKeyService);
		let viewId: string;

		if (focusedViewId && viewDescriptorService.getViewDescriptorById(focusedViewId)?.canMoveView) {
			viewId = focusedViewId;
		}

		try {
			viewId = await this.getView(quickInputService, viewDescriptorService, paneCompositePartService, viewId!);
			if (!viewId) {
				return;
			}

			const moveFocusedViewAction = new MoveFocusedViewAction();
			instantiationService.invokeFunction(accessor => moveFocusedViewAction.run(accessor, viewId));
		} catch { }
	}

	private getViewItems(viewDescriptorService: IViewDescriptorService, paneCompositePartService: IPaneCompositePartService): Array<QuickPickItem> {
		const results: Array<QuickPickItem> = [];

		const viewlets = paneCompositePartService.getVisiblePaneCompositeIds(ViewContainerLocation.Sidebar);
		viewlets.forEach(viewletId => {
			const container = viewDescriptorService.getViewContainerById(viewletId)!;
			const containerModel = viewDescriptorService.getViewContainerModel(container);

			let hasAddedView = false;
			containerModel.visibleViewDescriptors.forEach(viewDescriptor => {
				if (viewDescriptor.canMoveView) {
					if (!hasAddedView) {
						results.push({
							type: 'separator',
							label: localize('sidebarContainer', "Side Bar / {0}", containerModel.title)
						});
						hasAddedView = true;
					}

					results.push({
						id: viewDescriptor.id,
						label: viewDescriptor.name.value
					});
				}
			});
		});

		const panels = paneCompositePartService.getPinnedPaneCompositeIds(ViewContainerLocation.Panel);
		panels.forEach(panel => {
			const container = viewDescriptorService.getViewContainerById(panel)!;
			const containerModel = viewDescriptorService.getViewContainerModel(container);

			let hasAddedView = false;
			containerModel.visibleViewDescriptors.forEach(viewDescriptor => {
				if (viewDescriptor.canMoveView) {
					if (!hasAddedView) {
						results.push({
							type: 'separator',
							label: localize('panelContainer', "Panel / {0}", containerModel.title)
						});
						hasAddedView = true;
					}

					results.push({
						id: viewDescriptor.id,
						label: viewDescriptor.name.value
					});
				}
			});
		});


		const sidePanels = paneCompositePartService.getPinnedPaneCompositeIds(ViewContainerLocation.AuxiliaryBar);
		sidePanels.forEach(panel => {
			const container = viewDescriptorService.getViewContainerById(panel)!;
			const containerModel = viewDescriptorService.getViewContainerModel(container);

			let hasAddedView = false;
			containerModel.visibleViewDescriptors.forEach(viewDescriptor => {
				if (viewDescriptor.canMoveView) {
					if (!hasAddedView) {
						results.push({
							type: 'separator',
							label: localize('secondarySideBarContainer', "Secondary Side Bar / {0}", containerModel.title)
						});
						hasAddedView = true;
					}

					results.push({
						id: viewDescriptor.id,
						label: viewDescriptor.name.value
					});
				}
			});
		});

		return results;
	}

	private async getView(quickInputService: IQuickInputService, viewDescriptorService: IViewDescriptorService, paneCompositePartService: IPaneCompositePartService, viewId?: string): Promise<string> {
		const disposables = new DisposableStore();
		const quickPick = disposables.add(quickInputService.createQuickPick({ useSeparators: true }));
		quickPick.placeholder = localize('moveFocusedView.selectView', "Select a View to Move");
		quickPick.items = this.getViewItems(viewDescriptorService, paneCompositePartService);
		quickPick.selectedItems = quickPick.items.filter(item => (item as IQuickPickItem).id === viewId) as IQuickPickItem[];

		return new Promise((resolve, reject) => {
			disposables.add(quickPick.onDidAccept(() => {
				const viewId = quickPick.selectedItems[0];
				if (viewId.id) {
					resolve(viewId.id);
				} else {
					reject();
				}

				quickPick.hide();
			}));

			disposables.add(quickPick.onDidHide(() => {
				disposables.dispose();
				reject();
			}));

			quickPick.show();
		});
	}
});

// --- Move Focused View

class MoveFocusedViewAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.moveFocusedView',
			title: localize2('moveFocusedView', "Move Focused View"),
			category: Categories.View,
			precondition: FocusedViewContext.notEqualsTo(''),
			f1: true
		});
	}

	run(accessor: ServicesAccessor, viewId?: string): void {
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const viewsService = accessor.get(IViewsService);
		const quickInputService = accessor.get(IQuickInputService);
		const contextKeyService = accessor.get(IContextKeyService);
		const dialogService = accessor.get(IDialogService);
		const paneCompositePartService = accessor.get(IPaneCompositePartService);

		const focusedViewId = viewId || FocusedViewContext.getValue(contextKeyService);

		if (focusedViewId === undefined || focusedViewId.trim() === '') {
			dialogService.error(localize('moveFocusedView.error.noFocusedView', "There is no view currently focused."));
			return;
		}

		const viewDescriptor = viewDescriptorService.getViewDescriptorById(focusedViewId);
		if (!viewDescriptor?.canMoveView) {
			dialogService.error(localize('moveFocusedView.error.nonMovableView', "The currently focused view is not movable."));
			return;
		}

		const disposables = new DisposableStore();
		const quickPick = disposables.add(quickInputService.createQuickPick({ useSeparators: true }));
		quickPick.placeholder = localize('moveFocusedView.selectDestination', "Select a Destination for the View");
		quickPick.title = localize({ key: 'moveFocusedView.title', comment: ['{0} indicates the title of the view the user has selected to move.'] }, "View: Move {0}", viewDescriptor.name.value);

		const items: Array<IQuickPickItem | IQuickPickSeparator> = [];
		const currentContainer = viewDescriptorService.getViewContainerByViewId(focusedViewId)!;
		const currentLocation = viewDescriptorService.getViewLocationById(focusedViewId)!;
		const isViewSolo = viewDescriptorService.getViewContainerModel(currentContainer).allViewDescriptors.length === 1;

		if (!(isViewSolo && currentLocation === ViewContainerLocation.Panel)) {
			items.push({
				id: '_.panel.newcontainer',
				label: localize({ key: 'moveFocusedView.newContainerInPanel', comment: ['Creates a new top-level tab in the panel.'] }, "New Panel Entry"),
			});
		}

		if (!(isViewSolo && currentLocation === ViewContainerLocation.Sidebar)) {
			items.push({
				id: '_.sidebar.newcontainer',
				label: localize('moveFocusedView.newContainerInSidebar', "New Side Bar Entry")
			});
		}

		if (!(isViewSolo && currentLocation === ViewContainerLocation.AuxiliaryBar)) {
			items.push({
				id: '_.auxiliarybar.newcontainer',
				label: localize('moveFocusedView.newContainerInSidePanel', "New Secondary Side Bar Entry")
			});
		}

		items.push({
			type: 'separator',
			label: localize('sidebar', "Side Bar")
		});

		const pinnedViewlets = paneCompositePartService.getVisiblePaneCompositeIds(ViewContainerLocation.Sidebar);
		items.push(...pinnedViewlets
			.filter(viewletId => {
				if (viewletId === viewDescriptorService.getViewContainerByViewId(focusedViewId)!.id) {
					return false;
				}

				return !viewDescriptorService.getViewContainerById(viewletId)!.rejectAddedViews;
			})
			.map(viewletId => {
				return {
					id: viewletId,
					label: viewDescriptorService.getViewContainerModel(viewDescriptorService.getViewContainerById(viewletId)!).title
				};
			}));

		items.push({
			type: 'separator',
			label: localize('panel', "Panel")
		});

		const pinnedPanels = paneCompositePartService.getPinnedPaneCompositeIds(ViewContainerLocation.Panel);
		items.push(...pinnedPanels
			.filter(panel => {
				if (panel === viewDescriptorService.getViewContainerByViewId(focusedViewId)!.id) {
					return false;
				}

				return !viewDescriptorService.getViewContainerById(panel)!.rejectAddedViews;
			})
			.map(panel => {
				return {
					id: panel,
					label: viewDescriptorService.getViewContainerModel(viewDescriptorService.getViewContainerById(panel)!).title
				};
			}));

		items.push({
			type: 'separator',
			label: localize('secondarySideBar', "Secondary Side Bar")
		});

		const pinnedAuxPanels = paneCompositePartService.getPinnedPaneCompositeIds(ViewContainerLocation.AuxiliaryBar);
		items.push(...pinnedAuxPanels
			.filter(panel => {
				if (panel === viewDescriptorService.getViewContainerByViewId(focusedViewId)!.id) {
					return false;
				}

				return !viewDescriptorService.getViewContainerById(panel)!.rejectAddedViews;
			})
			.map(panel => {
				return {
					id: panel,
					label: viewDescriptorService.getViewContainerModel(viewDescriptorService.getViewContainerById(panel)!).title
				};
			}));

		quickPick.items = items;

		disposables.add(quickPick.onDidAccept(() => {
			const destination = quickPick.selectedItems[0];

			if (destination.id === '_.panel.newcontainer') {
				viewDescriptorService.moveViewToLocation(viewDescriptor, ViewContainerLocation.Panel, this.desc.id);
				viewsService.openView(focusedViewId, true);
			} else if (destination.id === '_.sidebar.newcontainer') {
				viewDescriptorService.moveViewToLocation(viewDescriptor, ViewContainerLocation.Sidebar, this.desc.id);
				viewsService.openView(focusedViewId, true);
			} else if (destination.id === '_.auxiliarybar.newcontainer') {
				viewDescriptorService.moveViewToLocation(viewDescriptor, ViewContainerLocation.AuxiliaryBar, this.desc.id);
				viewsService.openView(focusedViewId, true);
			} else if (destination.id) {
				viewDescriptorService.moveViewsToContainer([viewDescriptor], viewDescriptorService.getViewContainerById(destination.id)!, undefined, this.desc.id);
				viewsService.openView(focusedViewId, true);
			}

			quickPick.hide();
		}));

		disposables.add(quickPick.onDidHide(() => disposables.dispose()));

		quickPick.show();
	}
}

registerAction2(MoveFocusedViewAction);

// --- Reset Focused View Location

registerAction2(class extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.resetFocusedViewLocation',
			title: localize2('resetFocusedViewLocation', "Reset Focused View Location"),
			category: Categories.View,
			f1: true,
			precondition: FocusedViewContext.notEqualsTo('')
		});
	}

	run(accessor: ServicesAccessor): void {
		const viewDescriptorService = accessor.get(IViewDescriptorService);
		const contextKeyService = accessor.get(IContextKeyService);
		const dialogService = accessor.get(IDialogService);
		const viewsService = accessor.get(IViewsService);

		const focusedViewId = FocusedViewContext.getValue(contextKeyService);

		let viewDescriptor: IViewDescriptor | null = null;
		if (focusedViewId !== undefined && focusedViewId.trim() !== '') {
			viewDescriptor = viewDescriptorService.getViewDescriptorById(focusedViewId);
		}

		if (!viewDescriptor) {
			dialogService.error(localize('resetFocusedView.error.noFocusedView', "There is no view currently focused."));
			return;
		}

		const defaultContainer = viewDescriptorService.getDefaultContainerById(viewDescriptor.id);
		if (!defaultContainer || defaultContainer === viewDescriptorService.getViewContainerByViewId(viewDescriptor.id)) {
			return;
		}

		viewDescriptorService.moveViewsToContainer([viewDescriptor], defaultContainer, undefined, this.desc.id);
		viewsService.openView(viewDescriptor.id, true);
	}
});

// --- Resize View

abstract class BaseResizeViewAction extends Action2 {

	protected static readonly RESIZE_INCREMENT = 60; // This is a css pixel size

	protected resizePart(widthChange: number, heightChange: number, layoutService: IWorkbenchLayoutService, partToResize?: Parts): void {

		let part: Parts | undefined;
		if (partToResize === undefined) {
			const isEditorFocus = layoutService.hasFocus(Parts.EDITOR_PART);
			const isSidebarFocus = layoutService.hasFocus(Parts.SIDEBAR_PART);
			const isPanelFocus = layoutService.hasFocus(Parts.PANEL_PART);
			const isAuxiliaryBarFocus = layoutService.hasFocus(Parts.AUXILIARYBAR_PART);

			if (isSidebarFocus) {
				part = Parts.SIDEBAR_PART;
			} else if (isPanelFocus) {
				part = Parts.PANEL_PART;
			} else if (isEditorFocus) {
				part = Parts.EDITOR_PART;
			} else if (isAuxiliaryBarFocus) {
				part = Parts.AUXILIARYBAR_PART;
			}
		} else {
			part = partToResize;
		}

		if (part) {
			layoutService.resizePart(part, widthChange, heightChange);
		}
	}
}

class IncreaseViewSizeAction extends BaseResizeViewAction {

	constructor() {
		super({
			id: 'workbench.action.increaseViewSize',
			title: localize2('increaseViewSize', 'Increase Current View Size'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(BaseResizeViewAction.RESIZE_INCREMENT, BaseResizeViewAction.RESIZE_INCREMENT, accessor.get(IWorkbenchLayoutService));
	}
}

class IncreaseViewWidthAction extends BaseResizeViewAction {

	constructor() {
		super({
			id: 'workbench.action.increaseViewWidth',
			title: localize2('increaseEditorWidth', 'Increase Editor Width'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(BaseResizeViewAction.RESIZE_INCREMENT, 0, accessor.get(IWorkbenchLayoutService), Parts.EDITOR_PART);
	}
}

class IncreaseViewHeightAction extends BaseResizeViewAction {

	constructor() {
		super({
			id: 'workbench.action.increaseViewHeight',
			title: localize2('increaseEditorHeight', 'Increase Editor Height'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(0, BaseResizeViewAction.RESIZE_INCREMENT, accessor.get(IWorkbenchLayoutService), Parts.EDITOR_PART);
	}
}

class DecreaseViewSizeAction extends BaseResizeViewAction {

	constructor() {
		super({
			id: 'workbench.action.decreaseViewSize',
			title: localize2('decreaseViewSize', 'Decrease Current View Size'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(-BaseResizeViewAction.RESIZE_INCREMENT, -BaseResizeViewAction.RESIZE_INCREMENT, accessor.get(IWorkbenchLayoutService));
	}
}

class DecreaseViewWidthAction extends BaseResizeViewAction {
	constructor() {
		super({
			id: 'workbench.action.decreaseViewWidth',
			title: localize2('decreaseEditorWidth', 'Decrease Editor Width'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(-BaseResizeViewAction.RESIZE_INCREMENT, 0, accessor.get(IWorkbenchLayoutService), Parts.EDITOR_PART);
	}
}

class DecreaseViewHeightAction extends BaseResizeViewAction {

	constructor() {
		super({
			id: 'workbench.action.decreaseViewHeight',
			title: localize2('decreaseEditorHeight', 'Decrease Editor Height'),
			f1: true,
			precondition: IsAuxiliaryWindowFocusedContext.toNegated()
		});
	}

	run(accessor: ServicesAccessor): void {
		this.resizePart(0, -BaseResizeViewAction.RESIZE_INCREMENT, accessor.get(IWorkbenchLayoutService), Parts.EDITOR_PART);
	}
}

registerAction2(IncreaseViewSizeAction);
registerAction2(IncreaseViewWidthAction);
registerAction2(IncreaseViewHeightAction);

registerAction2(DecreaseViewSizeAction);
registerAction2(DecreaseViewWidthAction);
registerAction2(DecreaseViewHeightAction);

//#region Quick Input Alignment Actions

registerAction2(class AlignQuickInputTopAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.alignQuickInputTop',
			title: localize2('alignQuickInputTop', 'Align Quick Input Top'),
			f1: false
		});
	}

	run(accessor: ServicesAccessor): void {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.setAlignment('top');
	}
});

registerAction2(class AlignQuickInputCenterAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.alignQuickInputCenter',
			title: localize2('alignQuickInputCenter', 'Align Quick Input Center'),
			f1: false
		});
	}

	run(accessor: ServicesAccessor): void {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.setAlignment('center');
	}
});

//#endregion

type ContextualLayoutVisualIcon = { iconA: ThemeIcon; iconB: ThemeIcon; whenA: ContextKeyExpression };
type LayoutVisualIcon = ThemeIcon | ContextualLayoutVisualIcon;

function isContextualLayoutVisualIcon(icon: LayoutVisualIcon): icon is ContextualLayoutVisualIcon {
	return (icon as ContextualLayoutVisualIcon).iconA !== undefined;
}

interface CustomizeLayoutItem {
	id: string;
	active: ContextKeyExpression;
	label: string;
	activeIcon: ThemeIcon;
	visualIcon?: LayoutVisualIcon;
	activeAriaLabel: string;
	inactiveIcon?: ThemeIcon;
	inactiveAriaLabel?: string;
	useButtons: boolean;
}

const CreateToggleLayoutItem = (id: string, active: ContextKeyExpression, label: string, visualIcon?: LayoutVisualIcon): CustomizeLayoutItem => {
	return {
		id,
		active,
		label,
		visualIcon,
		activeIcon: Codicon.eye,
		inactiveIcon: Codicon.eyeClosed,
		activeAriaLabel: localize('selectToHide', "Select to Hide"),
		inactiveAriaLabel: localize('selectToShow', "Select to Show"),
		useButtons: true,
	};
};

const CreateOptionLayoutItem = (id: string, active: ContextKeyExpression, label: string, visualIcon?: LayoutVisualIcon): CustomizeLayoutItem => {
	return {
		id,
		active,
		label,
		visualIcon,
		activeIcon: Codicon.check,
		activeAriaLabel: localize('active', "Active"),
		useButtons: false
	};
};

const MenuBarToggledContext = ContextKeyExpr.and(IsMacNativeContext.toNegated(), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'hidden'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'toggle'), ContextKeyExpr.notEquals(`config.${MenuSettings.MenuBarVisibility}`, 'compact')) as ContextKeyExpression;
const ToggleVisibilityActions: CustomizeLayoutItem[] = [];
if (!isMacintosh || !isNative) {
	ToggleVisibilityActions.push(CreateToggleLayoutItem('workbench.action.toggleMenuBar', MenuBarToggledContext, localize('menuBar', "Menu Bar"), menubarIcon));
}

ToggleVisibilityActions.push(...[
	CreateToggleLayoutItem(ToggleActivityBarVisibilityActionId, ContextKeyExpr.notEquals('config.workbench.activityBar.location', 'hidden'), localize('activityBar', "Activity Bar"), { whenA: ContextKeyExpr.equals('config.workbench.sideBar.location', 'left'), iconA: activityBarLeftIcon, iconB: activityBarRightIcon }),
	CreateToggleLayoutItem(ToggleSidebarVisibilityAction.ID, SideBarVisibleContext, localize('sideBar', "Primary Side Bar"), { whenA: ContextKeyExpr.equals('config.workbench.sideBar.location', 'left'), iconA: panelLeftIcon, iconB: panelRightIcon }),
	CreateToggleLayoutItem(ToggleAuxiliaryBarAction.ID, AuxiliaryBarVisibleContext, localize('secondarySideBar', "Secondary Side Bar"), { whenA: ContextKeyExpr.equals('config.workbench.sideBar.location', 'left'), iconA: panelRightIcon, iconB: panelLeftIcon }),
	CreateToggleLayoutItem(TogglePanelAction.ID, PanelVisibleContext, localize('panel', "Panel"), panelIcon),
	CreateToggleLayoutItem(ToggleStatusbarVisibilityAction.ID, ContextKeyExpr.equals('config.workbench.statusBar.visible', true), localize('statusBar', "Status Bar"), statusBarIcon),
]);

const MoveSideBarActions: CustomizeLayoutItem[] = [
	CreateOptionLayoutItem(MoveSidebarLeftAction.ID, ContextKeyExpr.equals('config.workbench.sideBar.location', 'left'), localize('leftSideBar', "Left"), panelLeftIcon),
	CreateOptionLayoutItem(MoveSidebarRightAction.ID, ContextKeyExpr.equals('config.workbench.sideBar.location', 'right'), localize('rightSideBar', "Right"), panelRightIcon),
];

const AlignPanelActions: CustomizeLayoutItem[] = [
	CreateOptionLayoutItem('workbench.action.alignPanelLeft', PanelAlignmentContext.isEqualTo('left'), localize('leftPanel', "Left"), panelAlignmentLeftIcon),
	CreateOptionLayoutItem('workbench.action.alignPanelRight', PanelAlignmentContext.isEqualTo('right'), localize('rightPanel', "Right"), panelAlignmentRightIcon),
	CreateOptionLayoutItem('workbench.action.alignPanelCenter', PanelAlignmentContext.isEqualTo('center'), localize('centerPanel', "Center"), panelAlignmentCenterIcon),
	CreateOptionLayoutItem('workbench.action.alignPanelJustify', PanelAlignmentContext.isEqualTo('justify'), localize('justifyPanel', "Justify"), panelAlignmentJustifyIcon),
];

const QuickInputActions: CustomizeLayoutItem[] = [
	CreateOptionLayoutItem('workbench.action.alignQuickInputTop', QuickInputAlignmentContextKey.isEqualTo('top'), localize('top', "Top"), quickInputAlignmentTopIcon),
	CreateOptionLayoutItem('workbench.action.alignQuickInputCenter', QuickInputAlignmentContextKey.isEqualTo('center'), localize('center', "Center"), quickInputAlignmentCenterIcon),
];

const MiscLayoutOptions: CustomizeLayoutItem[] = [
	CreateOptionLayoutItem('workbench.action.toggleFullScreen', IsMainWindowFullscreenContext, localize('fullscreen', "Full Screen"), fullscreenIcon),
	CreateOptionLayoutItem('workbench.action.toggleZenMode', InEditorZenModeContext, localize('zenMode', "Zen Mode"), zenModeIcon),
	CreateOptionLayoutItem('workbench.action.toggleCenteredLayout', IsMainEditorCenteredLayoutContext, localize('centeredLayout', "Centered Layout"), centerLayoutIcon),
];

const LayoutContextKeySet = new Set<string>();
for (const { active } of [...ToggleVisibilityActions, ...MoveSideBarActions, ...AlignPanelActions, ...QuickInputActions, ...MiscLayoutOptions]) {
	for (const key of active.keys()) {
		LayoutContextKeySet.add(key);
	}
}

registerAction2(class CustomizeLayoutAction extends Action2 {

	private _currentQuickPick?: IQuickPick<IQuickPickItem, { useSeparators: true }>;

	constructor() {
		super({
			id: 'workbench.action.customizeLayout',
			title: localize2('customizeLayout', "Customize Layout..."),
			f1: true,
			icon: configureLayoutIcon,
			menu: [
				{
					id: MenuId.LayoutControlMenuSubmenu,
					group: 'z_end',
				},
				{
					id: MenuId.LayoutControlMenu,
					when: ContextKeyExpr.and(
						IsAuxiliaryWindowContext.toNegated(),
						ContextKeyExpr.equals('config.workbench.layoutControl.type', 'both')
					),
					group: '1_layout'
				}
			]
		});
	}

	getItems(contextKeyService: IContextKeyService, keybindingService: IKeybindingService): QuickPickItem[] {
		const toQuickPickItem = (item: CustomizeLayoutItem): IQuickPickItem => {
			const toggled = item.active.evaluate(contextKeyService.getContext(null));
			let label = item.useButtons ?
				item.label :
				item.label + (toggled && item.activeIcon ? ` $(${item.activeIcon.id})` : (!toggled && item.inactiveIcon ? ` $(${item.inactiveIcon.id})` : ''));
			const ariaLabel =
				item.label + (toggled && item.activeAriaLabel ? ` (${item.activeAriaLabel})` : (!toggled && item.inactiveAriaLabel ? ` (${item.inactiveAriaLabel})` : ''));

			if (item.visualIcon) {
				let icon = item.visualIcon;
				if (isContextualLayoutVisualIcon(icon)) {
					const useIconA = icon.whenA.evaluate(contextKeyService.getContext(null));
					icon = useIconA ? icon.iconA : icon.iconB;
				}

				label = `$(${icon.id}) ${label}`;
			}

			const icon = toggled ? item.activeIcon : item.inactiveIcon;

			return {
				type: 'item',
				id: item.id,
				label,
				ariaLabel,
				keybinding: keybindingService.lookupKeybinding(item.id, contextKeyService),
				buttons: !item.useButtons ? undefined : [
					{
						alwaysVisible: false,
						tooltip: ariaLabel,
						iconClass: icon ? ThemeIcon.asClassName(icon) : undefined
					}
				]
			};
		};
		return [
			{
				type: 'separator',
				label: localize('toggleVisibility', "Visibility")
			},
			...ToggleVisibilityActions.map(toQuickPickItem),
			{
				type: 'separator',
				label: localize('sideBarPosition', "Primary Side Bar Position")
			},
			...MoveSideBarActions.map(toQuickPickItem),
			{
				type: 'separator',
				label: localize('panelAlignment', "Panel Alignment")
			},
			...AlignPanelActions.map(toQuickPickItem),
			{
				type: 'separator',
				label: localize('quickOpen', "Quick Input Position")
			},
			...QuickInputActions.map(toQuickPickItem),
			{
				type: 'separator',
				label: localize('layoutModes', "Modes"),
			},
			...MiscLayoutOptions.map(toQuickPickItem),
		];
	}

	run(accessor: ServicesAccessor): void {
		if (this._currentQuickPick) {
			this._currentQuickPick.hide();
			return;
		}

		const configurationService = accessor.get(IConfigurationService);
		const contextKeyService = accessor.get(IContextKeyService);
		const commandService = accessor.get(ICommandService);
		const quickInputService = accessor.get(IQuickInputService);
		const keybindingService = accessor.get(IKeybindingService);

		const disposables = new DisposableStore();

		const quickPick = disposables.add(quickInputService.createQuickPick({ useSeparators: true }));

		this._currentQuickPick = quickPick;
		quickPick.items = this.getItems(contextKeyService, keybindingService);
		quickPick.ignoreFocusOut = true;
		quickPick.hideInput = true;
		quickPick.title = localize('customizeLayoutQuickPickTitle', "Customize Layout");

		const closeButton = {
			alwaysVisible: true,
			iconClass: ThemeIcon.asClassName(Codicon.close),
			tooltip: localize('close', "Close")
		};

		const resetButton = {
			alwaysVisible: true,
			iconClass: ThemeIcon.asClassName(Codicon.discard),
			tooltip: localize('restore defaults', "Restore Defaults")
		};

		quickPick.buttons = [
			resetButton,
			closeButton
		];

		let selectedItem: CustomizeLayoutItem | undefined = undefined;
		disposables.add(contextKeyService.onDidChangeContext(changeEvent => {
			if (changeEvent.affectsSome(LayoutContextKeySet)) {
				quickPick.items = this.getItems(contextKeyService, keybindingService);
				if (selectedItem) {
					quickPick.activeItems = quickPick.items.filter(item => (item as CustomizeLayoutItem).id === selectedItem?.id) as IQuickPickItem[];
				}

				setTimeout(() => quickInputService.focus(), 0);
			}
		}));

		disposables.add(quickPick.onDidAccept(event => {
			if (quickPick.selectedItems.length) {
				selectedItem = quickPick.selectedItems[0] as CustomizeLayoutItem;
				commandService.executeCommand(selectedItem.id);
			}
		}));

		disposables.add(quickPick.onDidTriggerItemButton(event => {
			if (event.item) {
				selectedItem = event.item as CustomizeLayoutItem;
				commandService.executeCommand(selectedItem.id);
			}
		}));

		disposables.add(quickPick.onDidTriggerButton((button) => {
			if (button === closeButton) {
				quickPick.hide();
			} else if (button === resetButton) {

				const resetSetting = (id: string) => {
					const config = configurationService.inspect(id);
					configurationService.updateValue(id, config.defaultValue);
				};

				// Reset all layout options
				resetSetting('workbench.activityBar.location');
				resetSetting('workbench.sideBar.location');
				resetSetting('workbench.statusBar.visible');
				resetSetting('workbench.panel.defaultLocation');

				if (!isMacintosh || !isNative) {
					resetSetting('window.menuBarVisibility');
				}

				commandService.executeCommand('workbench.action.alignPanelCenter');
				commandService.executeCommand('workbench.action.alignQuickInputTop');
			}
		}));

		disposables.add(quickPick.onDidHide(() => {
			quickPick.dispose();
		}));

		disposables.add(quickPick.onDispose(() => {
			this._currentQuickPick = undefined;
			disposables.dispose();
		}));

		quickPick.show();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/listCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/listCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyMod, KeyCode, KeyChord } from '../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { List } from '../../../base/browser/ui/list/listWidget.js';
import { WorkbenchListFocusContextKey, IListService, WorkbenchListSupportsMultiSelectContextKey, ListWidget, WorkbenchListHasSelectionOrFocus, getSelectionKeyboardEvent, WorkbenchListWidget, WorkbenchListSelectionNavigation, WorkbenchTreeElementCanCollapse, WorkbenchTreeElementHasParent, WorkbenchTreeElementHasChild, WorkbenchTreeElementCanExpand, RawWorkbenchListFocusContextKey, WorkbenchTreeFindOpen, WorkbenchListSupportsFind, WorkbenchListScrollAtBottomContextKey, WorkbenchListScrollAtTopContextKey, WorkbenchTreeStickyScrollFocused } from '../../../platform/list/browser/listService.js';
import { PagedList } from '../../../base/browser/ui/list/listPaging.js';
import { equals, range } from '../../../base/common/arrays.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { ObjectTree } from '../../../base/browser/ui/tree/objectTree.js';
import { AsyncDataTree } from '../../../base/browser/ui/tree/asyncDataTree.js';
import { DataTree } from '../../../base/browser/ui/tree/dataTree.js';
import { ITreeNode } from '../../../base/browser/ui/tree/tree.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { Table } from '../../../base/browser/ui/table/tableWidget.js';
import { AbstractTree, TreeFindMatchType, TreeFindMode } from '../../../base/browser/ui/tree/abstractTree.js';
import { isActiveElement } from '../../../base/browser/dom.js';
import { Action2, registerAction2 } from '../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { localize, localize2 } from '../../../nls.js';
import { IHoverService } from '../../../platform/hover/browser/hover.js';

function ensureDOMFocus(widget: ListWidget | undefined): void {
	// it can happen that one of the commands is executed while
	// DOM focus is within another focusable control within the
	// list/tree item. therefor we should ensure that the
	// list/tree has DOM focus again after the command ran.
	const element = widget?.getHTMLElement();
	if (element && !isActiveElement(element)) {
		widget?.domFocus();
	}
}

async function updateFocus(widget: WorkbenchListWidget, updateFocusFn: (widget: WorkbenchListWidget) => void | Promise<void>): Promise<void> {
	if (!WorkbenchListSelectionNavigation.getValue(widget.contextKeyService)) {
		return updateFocusFn(widget);
	}

	const focus = widget.getFocus();
	const selection = widget.getSelection();

	await updateFocusFn(widget);

	const newFocus = widget.getFocus();

	if (selection.length > 1 || !equals(focus, selection) || equals(focus, newFocus)) {
		return;
	}

	const fakeKeyboardEvent = new KeyboardEvent('keydown');
	widget.setSelection(newFocus, fakeKeyboardEvent);
}

async function navigate(widget: WorkbenchListWidget | undefined, updateFocusFn: (widget: WorkbenchListWidget) => void | Promise<void>): Promise<void> {
	if (!widget) {
		return;
	}

	await updateFocus(widget, updateFocusFn);

	const listFocus = widget.getFocus();

	if (listFocus.length) {
		widget.reveal(listFocus[0]);
	}

	widget.setAnchor(listFocus[0]);
	ensureDOMFocus(widget);
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.DownArrow,
	mac: {
		primary: KeyCode.DownArrow,
		secondary: [KeyMod.WinCtrl | KeyCode.KeyN]
	},
	handler: (accessor, arg2) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusNext(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.UpArrow,
	mac: {
		primary: KeyCode.UpArrow,
		secondary: [KeyMod.WinCtrl | KeyCode.KeyP]
	},
	handler: (accessor, arg2) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusPrevious(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusAnyDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.Alt | KeyCode.DownArrow,
	mac: {
		primary: KeyMod.Alt | KeyCode.DownArrow,
		secondary: [KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyN]
	},
	handler: (accessor, arg2) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown', { altKey: true });
			await widget.focusNext(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusAnyUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.Alt | KeyCode.UpArrow,
	mac: {
		primary: KeyMod.Alt | KeyCode.UpArrow,
		secondary: [KeyMod.WinCtrl | KeyMod.Alt | KeyCode.KeyP]
	},
	handler: (accessor, arg2) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown', { altKey: true });
			await widget.focusPrevious(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusPageDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.PageDown,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusNextPage(fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusPageUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.PageUp,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusPreviousPage(fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusFirst',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.Home,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusFirst(fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusLast',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.End,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			await widget.focusLast(fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusAnyFirst',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.Alt | KeyCode.Home,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown', { altKey: true });
			await widget.focusFirst(fakeKeyboardEvent);
		});
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusAnyLast',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.Alt | KeyCode.End,
	handler: (accessor) => {
		navigate(accessor.get(IListService).lastFocusedList, async widget => {
			const fakeKeyboardEvent = new KeyboardEvent('keydown', { altKey: true });
			await widget.focusLast(fakeKeyboardEvent);
		});
	}
});

function expandMultiSelection(focused: WorkbenchListWidget, previousFocus: unknown): void {

	// List
	if (focused instanceof List || focused instanceof PagedList || focused instanceof Table) {
		const list = focused;

		const focus = list.getFocus() ? list.getFocus()[0] : undefined;
		const selection = list.getSelection();
		if (selection && typeof focus === 'number' && selection.indexOf(focus) >= 0) {
			list.setSelection(selection.filter(s => s !== previousFocus));
		} else {
			if (typeof focus === 'number') {
				list.setSelection(selection.concat(focus));
			}
		}
	}

	// Tree
	else if (focused instanceof ObjectTree || focused instanceof DataTree || focused instanceof AsyncDataTree) {
		const list = focused;

		const focus = list.getFocus() ? list.getFocus()[0] : undefined;

		if (previousFocus === focus) {
			return;
		}

		const selection = list.getSelection();
		const fakeKeyboardEvent = new KeyboardEvent('keydown', { shiftKey: true });

		if (selection && selection.indexOf(focus) >= 0) {
			list.setSelection(selection.filter(s => s !== previousFocus), fakeKeyboardEvent);
		} else {
			list.setSelection(selection.concat(focus), fakeKeyboardEvent);
		}
	}
}

function revealFocusedStickyScroll(tree: ObjectTree<unknown, unknown> | DataTree<unknown, unknown> | AsyncDataTree<unknown, unknown>, postRevealAction?: (focus: unknown) => void): void {
	const focus = tree.getStickyScrollFocus();

	if (focus.length === 0) {
		throw new Error(`StickyScroll has no focus`);
	}
	if (focus.length > 1) {
		throw new Error(`StickyScroll can only have a single focused item`);
	}

	tree.reveal(focus[0]);
	tree.getHTMLElement().focus(); // domfocus() would focus stiky scroll dom and not the tree todo@benibenj
	tree.setFocus(focus);
	postRevealAction?.(focus[0]);
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.expandSelectionDown',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, WorkbenchListSupportsMultiSelectContextKey),
	primary: KeyMod.Shift | KeyCode.DownArrow,
	handler: (accessor, arg2) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget) {
			return;
		}

		// Focus down first
		const previousFocus = widget.getFocus() ? widget.getFocus()[0] : undefined;
		const fakeKeyboardEvent = new KeyboardEvent('keydown');
		widget.focusNext(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);

		// Then adjust selection
		expandMultiSelection(widget, previousFocus);

		const focus = widget.getFocus();

		if (focus.length) {
			widget.reveal(focus[0]);
		}

		ensureDOMFocus(widget);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.expandSelectionUp',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, WorkbenchListSupportsMultiSelectContextKey),
	primary: KeyMod.Shift | KeyCode.UpArrow,
	handler: (accessor, arg2) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget) {
			return;
		}

		// Focus up first
		const previousFocus = widget.getFocus() ? widget.getFocus()[0] : undefined;
		const fakeKeyboardEvent = new KeyboardEvent('keydown');
		widget.focusPrevious(typeof arg2 === 'number' ? arg2 : 1, false, fakeKeyboardEvent);

		// Then adjust selection
		expandMultiSelection(widget, previousFocus);

		const focus = widget.getFocus();

		if (focus.length) {
			widget.reveal(focus[0]);
		}

		ensureDOMFocus(widget);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.collapse',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, ContextKeyExpr.or(WorkbenchTreeElementCanCollapse, WorkbenchTreeElementHasParent)),
	primary: KeyCode.LeftArrow,
	mac: {
		primary: KeyCode.LeftArrow,
		secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow]
	},
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget || !(widget instanceof ObjectTree || widget instanceof DataTree || widget instanceof AsyncDataTree)) {
			return;
		}

		const tree = widget;
		const focusedElements = tree.getFocus();

		if (focusedElements.length === 0) {
			return;
		}

		const focus = focusedElements[0];

		if (!tree.collapse(focus)) {
			const parent = tree.getParentElement(focus);

			if (parent) {
				navigate(widget, widget => {
					const fakeKeyboardEvent = new KeyboardEvent('keydown');
					widget.setFocus([parent], fakeKeyboardEvent);
				});
			}
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.stickyScroll.collapse',
	weight: KeybindingWeight.WorkbenchContrib + 50,
	when: WorkbenchTreeStickyScrollFocused,
	primary: KeyCode.LeftArrow,
	mac: {
		primary: KeyCode.LeftArrow,
		secondary: [KeyMod.CtrlCmd | KeyCode.UpArrow]
	},
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget || !(widget instanceof ObjectTree || widget instanceof DataTree || widget instanceof AsyncDataTree)) {
			return;
		}

		revealFocusedStickyScroll(widget, focus => widget.collapse(focus));
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.collapseAll',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.CtrlCmd | KeyCode.LeftArrow,
	mac: {
		primary: KeyMod.CtrlCmd | KeyCode.LeftArrow,
		secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.UpArrow]
	},
	handler: (accessor) => {
		const focused = accessor.get(IListService).lastFocusedList;

		if (focused && !(focused instanceof List || focused instanceof PagedList || focused instanceof Table)) {
			focused.collapseAll();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.collapseAllToFocus',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	handler: accessor => {
		const focused = accessor.get(IListService).lastFocusedList;
		const fakeKeyboardEvent = getSelectionKeyboardEvent('keydown', true);
		// Trees
		if (focused instanceof ObjectTree || focused instanceof DataTree || focused instanceof AsyncDataTree) {
			const tree = focused;
			const focus = tree.getFocus();

			if (focus.length > 0) {
				tree.collapse(focus[0], true);
			}
			tree.setSelection(focus, fakeKeyboardEvent);
			tree.setAnchor(focus[0]);
		}
	}
});


KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.focusParent',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget || !(widget instanceof ObjectTree || widget instanceof DataTree || widget instanceof AsyncDataTree)) {
			return;
		}

		const tree = widget;
		const focusedElements = tree.getFocus();
		if (focusedElements.length === 0) {
			return;
		}
		const focus = focusedElements[0];
		const parent = tree.getParentElement(focus);
		if (parent) {
			navigate(widget, widget => {
				const fakeKeyboardEvent = new KeyboardEvent('keydown');
				widget.setFocus([parent], fakeKeyboardEvent);
			});
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.expand',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, ContextKeyExpr.or(WorkbenchTreeElementCanExpand, WorkbenchTreeElementHasChild)),
	primary: KeyCode.RightArrow,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget) {
			return;
		}

		if (widget instanceof ObjectTree || widget instanceof DataTree) {
			// TODO@Joao: instead of doing this here, just delegate to a tree method
			const focusedElements = widget.getFocus();

			if (focusedElements.length === 0) {
				return;
			}

			const focus = focusedElements[0];

			if (!widget.expand(focus)) {
				const child = widget.getFirstElementChild(focus);

				if (child) {
					const node = widget.getNode(child);

					if (node.visible) {
						navigate(widget, widget => {
							const fakeKeyboardEvent = new KeyboardEvent('keydown');
							widget.setFocus([child], fakeKeyboardEvent);
						});
					}
				}
			}
		} else if (widget instanceof AsyncDataTree) {
			// TODO@Joao: instead of doing this here, just delegate to a tree method
			const focusedElements = widget.getFocus();

			if (focusedElements.length === 0) {
				return;
			}

			const focus = focusedElements[0];
			widget.expand(focus).then(didExpand => {
				if (focus && !didExpand) {
					const child = widget.getFirstElementChild(focus);

					if (child) {
						const node = widget.getNode(child);

						if (node.visible) {
							navigate(widget, widget => {
								const fakeKeyboardEvent = new KeyboardEvent('keydown');
								widget.setFocus([child], fakeKeyboardEvent);
							});
						}
					}
				}
			});
		}
	}
});

function selectElement(accessor: ServicesAccessor, retainCurrentFocus: boolean): void {
	const focused = accessor.get(IListService).lastFocusedList;
	const fakeKeyboardEvent = getSelectionKeyboardEvent('keydown', retainCurrentFocus);
	// List
	if (focused instanceof List || focused instanceof PagedList || focused instanceof Table) {
		const list = focused;
		list.setAnchor(list.getFocus()[0]);
		list.setSelection(list.getFocus(), fakeKeyboardEvent);
	}

	// Trees
	else if (focused instanceof ObjectTree || focused instanceof DataTree || focused instanceof AsyncDataTree) {
		const tree = focused;
		const focus = tree.getFocus();

		if (focus.length > 0) {
			let toggleCollapsed = true;

			if (tree.expandOnlyOnTwistieClick === true) {
				toggleCollapsed = false;
			} else if (typeof tree.expandOnlyOnTwistieClick !== 'boolean' && tree.expandOnlyOnTwistieClick(focus[0])) {
				toggleCollapsed = false;
			}

			if (toggleCollapsed) {
				tree.toggleCollapsed(focus[0]);
			}
		}
		tree.setAnchor(focus[0]);
		tree.setSelection(focus, fakeKeyboardEvent);
	}
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.select',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.Enter,
	mac: {
		primary: KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow]
	},
	handler: (accessor) => {
		selectElement(accessor, false);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.stickyScrollselect',
	weight: KeybindingWeight.WorkbenchContrib + 50, // priorities over file explorer
	when: WorkbenchTreeStickyScrollFocused,
	primary: KeyCode.Enter,
	mac: {
		primary: KeyCode.Enter,
		secondary: [KeyMod.CtrlCmd | KeyCode.DownArrow]
	},
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget || !(widget instanceof ObjectTree || widget instanceof DataTree || widget instanceof AsyncDataTree)) {
			return;
		}

		revealFocusedStickyScroll(widget, focus => widget.setSelection([focus]));
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.selectAndPreserveFocus',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	handler: accessor => {
		selectElement(accessor, true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.selectAll',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, WorkbenchListSupportsMultiSelectContextKey),
	primary: KeyMod.CtrlCmd | KeyCode.KeyA,
	handler: (accessor) => {
		const focused = accessor.get(IListService).lastFocusedList;

		// List
		if (focused instanceof List || focused instanceof PagedList || focused instanceof Table) {
			const list = focused;
			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			list.setSelection(range(list.length), fakeKeyboardEvent);
		}

		// Trees
		else if (focused instanceof ObjectTree || focused instanceof DataTree || focused instanceof AsyncDataTree) {
			const tree = focused;
			const focus = tree.getFocus();
			const selection = tree.getSelection();

			// Which element should be considered to start selecting all?
			let start: unknown | undefined = undefined;

			if (focus.length > 0 && (selection.length === 0 || !selection.includes(focus[0]))) {
				start = focus[0];
			}

			if (!start && selection.length > 0) {
				start = selection[0];
			}

			// What is the scope of select all?
			let scope: unknown | undefined = undefined;

			if (!start) {
				scope = undefined;
			} else {
				scope = tree.getParentElement(start);
			}

			const newSelection: unknown[] = [];
			const visit = (node: ITreeNode<unknown, unknown>) => {
				for (const child of node.children) {
					if (child.visible) {
						newSelection.push(child.element);

						if (!child.collapsed) {
							visit(child);
						}
					}
				}
			};

			// Add the whole scope subtree to the new selection
			visit(tree.getNode(scope));

			// If the scope isn't the tree root, it should be part of the new selection
			if (scope && selection.length === newSelection.length) {
				newSelection.unshift(scope);
			}

			const fakeKeyboardEvent = new KeyboardEvent('keydown');
			tree.setSelection(newSelection, fakeKeyboardEvent);
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.toggleSelection',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget) {
			return;
		}

		const focus = widget.getFocus();

		if (focus.length === 0) {
			return;
		}

		const selection = widget.getSelection();
		const index = selection.indexOf(focus[0]);

		if (index > -1) {
			widget.setSelection([...selection.slice(0, index), ...selection.slice(index + 1)]);
		} else {
			widget.setSelection([...selection, focus[0]]);
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.showHover',
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyI),
	when: WorkbenchListFocusContextKey,
	handler: async (accessor: ServicesAccessor) => {
		const listService = accessor.get(IListService);
		const lastFocusedList = listService.lastFocusedList;
		if (!lastFocusedList) {
			return;
		}

		// Check if a tree element is focused
		const focus = lastFocusedList.getFocus();
		if (!focus || (focus.length === 0)) {
			return;
		}

		// As the tree does not know anything about the rendered DOM elements
		// we have to traverse the dom to find the HTMLElements
		const treeDOM = lastFocusedList.getHTMLElement();
		// eslint-disable-next-line no-restricted-syntax
		const scrollableElement = treeDOM.querySelector('.monaco-scrollable-element');
		// eslint-disable-next-line no-restricted-syntax
		const listRows = scrollableElement?.querySelector('.monaco-list-rows');
		// eslint-disable-next-line no-restricted-syntax
		const focusedElement = listRows?.querySelector('.focused');
		if (!focusedElement) {
			return;
		}

		const elementWithHover = getCustomHoverForElement(focusedElement as HTMLElement);
		if (elementWithHover) {
			accessor.get(IHoverService).showManagedHover(elementWithHover);
		}
	},
});

function getCustomHoverForElement(element: HTMLElement): HTMLElement | undefined {
	// Check if the element itself has a hover
	if (element.matches('[custom-hover="true"]')) {
		return element;
	}

	// Only consider children that are not action items or have a tabindex
	// as these element are focusable and the user is able to trigger them already
	// eslint-disable-next-line no-restricted-syntax
	const noneFocusableElementWithHover = element.querySelector('[custom-hover="true"]:not([tabindex]):not(.action-item)');
	if (noneFocusableElementWithHover) {
		return noneFocusableElementWithHover as HTMLElement;
	}

	return undefined;
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.toggleExpand',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	primary: KeyCode.Space,
	handler: (accessor) => {
		const focused = accessor.get(IListService).lastFocusedList;

		// Tree only
		if (focused instanceof ObjectTree || focused instanceof DataTree || focused instanceof AsyncDataTree) {
			const tree = focused;
			const focus = tree.getFocus();

			if (!tree.options.disableExpandOnSpacebar && focus.length > 0 && tree.isCollapsible(focus[0])) {
				tree.toggleCollapsed(focus[0]);
				return;
			}
		}

		selectElement(accessor, true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.stickyScrolltoggleExpand',
	weight: KeybindingWeight.WorkbenchContrib + 50, // priorities over file explorer
	when: WorkbenchTreeStickyScrollFocused,
	primary: KeyCode.Space,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget || !(widget instanceof ObjectTree || widget instanceof DataTree || widget instanceof AsyncDataTree)) {
			return;
		}

		revealFocusedStickyScroll(widget);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.clear',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(WorkbenchListFocusContextKey, WorkbenchListHasSelectionOrFocus),
	primary: KeyCode.Escape,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (!widget) {
			return;
		}

		const selection = widget.getSelection();
		const fakeKeyboardEvent = new KeyboardEvent('keydown');

		if (selection.length > 1) {
			const useSelectionNavigation = WorkbenchListSelectionNavigation.getValue(widget.contextKeyService);
			if (useSelectionNavigation) {
				const focus = widget.getFocus();
				widget.setSelection([focus[0]], fakeKeyboardEvent);
			} else {
				widget.setSelection([], fakeKeyboardEvent);
			}
		} else {
			widget.setSelection([], fakeKeyboardEvent);
			widget.setFocus([], fakeKeyboardEvent);
		}

		widget.setAnchor(undefined);
	}
});

CommandsRegistry.registerCommand({
	id: 'list.triggerTypeNavigation',
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;
		widget?.triggerTypeNavigation();
	}
});

CommandsRegistry.registerCommand({
	id: 'list.toggleFindMode',
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (widget instanceof AbstractTree || widget instanceof AsyncDataTree) {
			const tree = widget;
			tree.findMode = tree.findMode === TreeFindMode.Filter ? TreeFindMode.Highlight : TreeFindMode.Filter;
		}
	}
});

CommandsRegistry.registerCommand({
	id: 'list.toggleFindMatchType',
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (widget instanceof AbstractTree || widget instanceof AsyncDataTree) {
			const tree = widget;
			tree.findMatchType = tree.findMatchType === TreeFindMatchType.Contiguous ? TreeFindMatchType.Fuzzy : TreeFindMatchType.Contiguous;
		}
	}
});

// Deprecated commands
CommandsRegistry.registerCommandAlias('list.toggleKeyboardNavigation', 'list.triggerTypeNavigation');
CommandsRegistry.registerCommandAlias('list.toggleFilterOnType', 'list.toggleFindMode');

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.find',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(RawWorkbenchListFocusContextKey, WorkbenchListSupportsFind),
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyF,
	secondary: [KeyCode.F3],
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		// List
		if (widget instanceof List || widget instanceof PagedList || widget instanceof Table) {
			// TODO@joao
		}

		// Tree
		else if (widget instanceof AbstractTree || widget instanceof AsyncDataTree) {
			const tree = widget;
			tree.openFind();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.closeFind',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(RawWorkbenchListFocusContextKey, WorkbenchTreeFindOpen),
	primary: KeyCode.Escape,
	handler: (accessor) => {
		const widget = accessor.get(IListService).lastFocusedList;

		if (widget instanceof AbstractTree || widget instanceof AsyncDataTree) {
			const tree = widget;
			tree.closeFind();
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.scrollUp',
	weight: KeybindingWeight.WorkbenchContrib,
	// Since the default keybindings for list.scrollUp and widgetNavigation.focusPrevious
	// are both Ctrl+UpArrow, we disable this command when the scrollbar is at
	// top-most position. This will give chance for widgetNavigation.focusPrevious to execute
	when: ContextKeyExpr.and(
		WorkbenchListFocusContextKey,
		WorkbenchListScrollAtTopContextKey?.negate()),
	primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
	handler: accessor => {
		const focused = accessor.get(IListService).lastFocusedList;

		if (!focused) {
			return;
		}

		focused.scrollTop -= 10;
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.scrollDown',
	weight: KeybindingWeight.WorkbenchContrib,
	// same as above
	when: ContextKeyExpr.and(
		WorkbenchListFocusContextKey,
		WorkbenchListScrollAtBottomContextKey?.negate()),
	primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
	handler: accessor => {
		const focused = accessor.get(IListService).lastFocusedList;

		if (!focused) {
			return;
		}

		focused.scrollTop += 10;
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.scrollLeft',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	handler: accessor => {
		const focused = accessor.get(IListService).lastFocusedList;

		if (!focused) {
			return;
		}

		focused.scrollLeft -= 10;
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.scrollRight',
	weight: KeybindingWeight.WorkbenchContrib,
	when: WorkbenchListFocusContextKey,
	handler: accessor => {
		const focused = accessor.get(IListService).lastFocusedList;

		if (!focused) {
			return;
		}

		focused.scrollLeft += 10;
	}
});

registerAction2(class ToggleStickyScroll extends Action2 {
	constructor() {
		super({
			id: 'tree.toggleStickyScroll',
			title: {
				...localize2('toggleTreeStickyScroll', "Toggle Tree Sticky Scroll"),
				mnemonicTitle: localize({ key: 'mitoggleTreeStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Toggle Tree Sticky Scroll"),
			},
			category: 'View',
			metadata: { description: localize('toggleTreeStickyScrollDescription', "Toggles Sticky Scroll widget at the top of tree structures such as the File Explorer and Debug variables View.") },
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue<boolean>('workbench.tree.enableStickyScroll');
		configurationService.updateValue('workbench.tree.enableStickyScroll', newValue);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/navigationActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/navigationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../nls.js';
import { IEditorGroupsService, GroupDirection, GroupLocation, IFindGroupScope } from '../../services/editor/common/editorGroupsService.js';
import { IWorkbenchLayoutService, Parts } from '../../services/layout/browser/layoutService.js';
import { Action2, IAction2Options, registerAction2 } from '../../../platform/actions/common/actions.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { Direction } from '../../../base/browser/ui/grid/grid.js';
import { KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IPaneComposite } from '../../common/panecomposite.js';
import { IComposite } from '../../common/composite.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../common/views.js';
import { KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { getActiveWindow } from '../../../base/browser/dom.js';
import { isAuxiliaryWindow } from '../../../base/browser/window.js';

abstract class BaseNavigationAction extends Action2 {

	constructor(
		options: IAction2Options,
		protected direction: Direction
	) {
		super(options);
	}

	run(accessor: ServicesAccessor): void {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const editorGroupService = accessor.get(IEditorGroupsService);
		const paneCompositeService = accessor.get(IPaneCompositePartService);

		const isEditorFocus = layoutService.hasFocus(Parts.EDITOR_PART);
		const isPanelFocus = layoutService.hasFocus(Parts.PANEL_PART);
		const isSidebarFocus = layoutService.hasFocus(Parts.SIDEBAR_PART);
		const isAuxiliaryBarFocus = layoutService.hasFocus(Parts.AUXILIARYBAR_PART);

		let neighborPart: Parts | undefined;
		if (isEditorFocus) {
			const didNavigate = this.navigateAcrossEditorGroup(this.toGroupDirection(this.direction), editorGroupService);
			if (didNavigate) {
				return;
			}

			neighborPart = layoutService.getVisibleNeighborPart(Parts.EDITOR_PART, this.direction);
		}

		if (isPanelFocus) {
			neighborPart = layoutService.getVisibleNeighborPart(Parts.PANEL_PART, this.direction);
		}

		if (isSidebarFocus) {
			neighborPart = layoutService.getVisibleNeighborPart(Parts.SIDEBAR_PART, this.direction);
		}

		if (isAuxiliaryBarFocus) {
			neighborPart = neighborPart = layoutService.getVisibleNeighborPart(Parts.AUXILIARYBAR_PART, this.direction);
		}

		if (neighborPart === Parts.EDITOR_PART) {
			if (!this.navigateBackToEditorGroup(this.toGroupDirection(this.direction), editorGroupService)) {
				this.navigateToEditorGroup(this.direction === Direction.Right ? GroupLocation.FIRST : GroupLocation.LAST, editorGroupService);
			}
		} else if (neighborPart === Parts.SIDEBAR_PART) {
			this.navigateToSidebar(layoutService, paneCompositeService);
		} else if (neighborPart === Parts.PANEL_PART) {
			this.navigateToPanel(layoutService, paneCompositeService);
		} else if (neighborPart === Parts.AUXILIARYBAR_PART) {
			this.navigateToAuxiliaryBar(layoutService, paneCompositeService);
		}
	}

	private async navigateToPanel(layoutService: IWorkbenchLayoutService, paneCompositeService: IPaneCompositePartService): Promise<IComposite | boolean> {
		if (!layoutService.isVisible(Parts.PANEL_PART)) {
			return false;
		}

		const activePanel = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		if (!activePanel) {
			return false;
		}

		const activePanelId = activePanel.getId();

		const res = await paneCompositeService.openPaneComposite(activePanelId, ViewContainerLocation.Panel, true);
		if (!res) {
			return false;
		}

		return res;
	}

	private async navigateToSidebar(layoutService: IWorkbenchLayoutService, paneCompositeService: IPaneCompositePartService): Promise<IPaneComposite | boolean> {
		if (!layoutService.isVisible(Parts.SIDEBAR_PART)) {
			return false;
		}

		const activeViewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);
		if (!activeViewlet) {
			return false;
		}
		const activeViewletId = activeViewlet.getId();

		const viewlet = await paneCompositeService.openPaneComposite(activeViewletId, ViewContainerLocation.Sidebar, true);
		return !!viewlet;
	}

	private async navigateToAuxiliaryBar(layoutService: IWorkbenchLayoutService, paneCompositeService: IPaneCompositePartService): Promise<IComposite | boolean> {
		if (!layoutService.isVisible(Parts.AUXILIARYBAR_PART)) {
			return false;
		}

		const activePanel = paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar);
		if (!activePanel) {
			return false;
		}

		const activePanelId = activePanel.getId();

		const res = await paneCompositeService.openPaneComposite(activePanelId, ViewContainerLocation.AuxiliaryBar, true);
		if (!res) {
			return false;
		}

		return res;
	}

	private navigateAcrossEditorGroup(direction: GroupDirection, editorGroupService: IEditorGroupsService): boolean {
		return this.doNavigateToEditorGroup({ direction }, editorGroupService);
	}

	private navigateToEditorGroup(location: GroupLocation, editorGroupService: IEditorGroupsService): boolean {
		return this.doNavigateToEditorGroup({ location }, editorGroupService);
	}

	private navigateBackToEditorGroup(direction: GroupDirection, editorGroupService: IEditorGroupsService): boolean {
		if (!editorGroupService.activeGroup) {
			return false;
		}

		const oppositeDirection = this.toOppositeDirection(direction);

		// Check to see if there is a group in between the last
		// active group and the direction of movement

		const groupInBetween = editorGroupService.findGroup({ direction: oppositeDirection }, editorGroupService.activeGroup);
		if (!groupInBetween) {

			// No group in between means we can return
			// focus to the last active editor group

			editorGroupService.activeGroup.focus();
			return true;
		}

		return false;
	}

	private toGroupDirection(direction: Direction): GroupDirection {
		switch (direction) {
			case Direction.Down: return GroupDirection.DOWN;
			case Direction.Left: return GroupDirection.LEFT;
			case Direction.Right: return GroupDirection.RIGHT;
			case Direction.Up: return GroupDirection.UP;
		}
	}

	private toOppositeDirection(direction: GroupDirection): GroupDirection {
		switch (direction) {
			case GroupDirection.UP: return GroupDirection.DOWN;
			case GroupDirection.RIGHT: return GroupDirection.LEFT;
			case GroupDirection.LEFT: return GroupDirection.RIGHT;
			case GroupDirection.DOWN: return GroupDirection.UP;
		}
	}

	private doNavigateToEditorGroup(scope: IFindGroupScope, editorGroupService: IEditorGroupsService): boolean {
		const targetGroup = editorGroupService.findGroup(scope, editorGroupService.activeGroup);
		if (targetGroup) {
			targetGroup.focus();

			return true;
		}

		return false;
	}
}

registerAction2(class extends BaseNavigationAction {

	constructor() {
		super({
			id: 'workbench.action.navigateLeft',
			title: localize2('navigateLeft', 'Navigate to the View on the Left'),
			category: Categories.View,
			f1: true
		}, Direction.Left);
	}
});

registerAction2(class extends BaseNavigationAction {

	constructor() {
		super({
			id: 'workbench.action.navigateRight',
			title: localize2('navigateRight', 'Navigate to the View on the Right'),
			category: Categories.View,
			f1: true
		}, Direction.Right);
	}
});

registerAction2(class extends BaseNavigationAction {

	constructor() {
		super({
			id: 'workbench.action.navigateUp',
			title: localize2('navigateUp', 'Navigate to the View Above'),
			category: Categories.View,
			f1: true
		}, Direction.Up);
	}
});

registerAction2(class extends BaseNavigationAction {

	constructor() {
		super({
			id: 'workbench.action.navigateDown',
			title: localize2('navigateDown', 'Navigate to the View Below'),
			category: Categories.View,
			f1: true
		}, Direction.Down);
	}
});

abstract class BaseFocusAction extends Action2 {

	constructor(
		options: IAction2Options,
		private readonly focusNext: boolean
	) {
		super(options);
	}

	run(accessor: ServicesAccessor): void {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const editorService = accessor.get(IEditorService);

		this.focusNextOrPreviousPart(layoutService, editorService, this.focusNext);
	}

	private findVisibleNeighbour(layoutService: IWorkbenchLayoutService, part: Parts, next: boolean): Parts {
		const activeWindow = getActiveWindow();
		const windowIsAuxiliary = isAuxiliaryWindow(activeWindow);

		let neighbour: Parts;
		if (windowIsAuxiliary) {
			switch (part) {
				case Parts.EDITOR_PART:
					neighbour = Parts.STATUSBAR_PART;
					break;
				default:
					neighbour = Parts.EDITOR_PART;
			}
		} else {
			switch (part) {
				case Parts.EDITOR_PART:
					neighbour = next ? Parts.PANEL_PART : Parts.SIDEBAR_PART;
					break;
				case Parts.PANEL_PART:
					neighbour = next ? Parts.AUXILIARYBAR_PART : Parts.EDITOR_PART;
					break;
				case Parts.AUXILIARYBAR_PART:
					neighbour = next ? Parts.STATUSBAR_PART : Parts.PANEL_PART;
					break;
				case Parts.STATUSBAR_PART:
					neighbour = next ? Parts.ACTIVITYBAR_PART : Parts.AUXILIARYBAR_PART;
					break;
				case Parts.ACTIVITYBAR_PART:
					neighbour = next ? Parts.SIDEBAR_PART : Parts.STATUSBAR_PART;
					break;
				case Parts.SIDEBAR_PART:
					neighbour = next ? Parts.EDITOR_PART : Parts.ACTIVITYBAR_PART;
					break;
				default:
					neighbour = Parts.EDITOR_PART;
			}
		}

		if (layoutService.isVisible(neighbour, activeWindow) || neighbour === Parts.EDITOR_PART) {
			return neighbour;
		}

		return this.findVisibleNeighbour(layoutService, neighbour, next);
	}

	private focusNextOrPreviousPart(layoutService: IWorkbenchLayoutService, editorService: IEditorService, next: boolean): void {
		let currentlyFocusedPart: Parts | undefined;
		if (editorService.activeEditorPane?.hasFocus() || layoutService.hasFocus(Parts.EDITOR_PART)) {
			currentlyFocusedPart = Parts.EDITOR_PART;
		} else if (layoutService.hasFocus(Parts.ACTIVITYBAR_PART)) {
			currentlyFocusedPart = Parts.ACTIVITYBAR_PART;
		} else if (layoutService.hasFocus(Parts.STATUSBAR_PART)) {
			currentlyFocusedPart = Parts.STATUSBAR_PART;
		} else if (layoutService.hasFocus(Parts.SIDEBAR_PART)) {
			currentlyFocusedPart = Parts.SIDEBAR_PART;
		} else if (layoutService.hasFocus(Parts.AUXILIARYBAR_PART)) {
			currentlyFocusedPart = Parts.AUXILIARYBAR_PART;
		} else if (layoutService.hasFocus(Parts.PANEL_PART)) {
			currentlyFocusedPart = Parts.PANEL_PART;
		}

		layoutService.focusPart(currentlyFocusedPart ? this.findVisibleNeighbour(layoutService, currentlyFocusedPart, next) : Parts.EDITOR_PART, getActiveWindow());
	}
}

registerAction2(class extends BaseFocusAction {

	constructor() {
		super({
			id: 'workbench.action.focusNextPart',
			title: localize2('focusNextPart', 'Focus Next Part'),
			category: Categories.View,
			f1: true,
			keybinding: {
				primary: KeyCode.F6,
				weight: KeybindingWeight.WorkbenchContrib
			}
		}, true);
	}
});

registerAction2(class extends BaseFocusAction {

	constructor() {
		super({
			id: 'workbench.action.focusPreviousPart',
			title: localize2('focusPreviousPart', 'Focus Previous Part'),
			category: Categories.View,
			f1: true,
			keybinding: {
				primary: KeyMod.Shift | KeyCode.F6,
				weight: KeybindingWeight.WorkbenchContrib
			}
		}, false);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/quickAccessActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/quickAccessActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { MenuId, Action2, registerAction2 } from '../../../platform/actions/common/actions.js';
import { KeyMod, KeyCode } from '../../../base/common/keyCodes.js';
import { KeybindingsRegistry, KeybindingWeight, IKeybindingRule } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickInputService, ItemActivation, QuickInputHideReason } from '../../../platform/quickinput/common/quickInput.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { inQuickPickContext, defaultQuickAccessContext, getQuickNavigateHandler } from '../quickaccess.js';
import { ILocalizedString } from '../../../platform/action/common/action.js';
import { AnythingQuickAccessProviderRunOptions } from '../../../platform/quickinput/common/quickAccess.js';
import { Codicon } from '../../../base/common/codicons.js';

//#region Quick access management commands and keys

const globalQuickAccessKeybinding = {
	primary: KeyMod.CtrlCmd | KeyCode.KeyP,
	secondary: [KeyMod.CtrlCmd | KeyCode.KeyE],
	mac: { primary: KeyMod.CtrlCmd | KeyCode.KeyP, secondary: undefined }
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.closeQuickOpen',
	weight: KeybindingWeight.WorkbenchContrib,
	when: inQuickPickContext,
	primary: KeyCode.Escape, secondary: [KeyMod.Shift | KeyCode.Escape],
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		return quickInputService.cancel(QuickInputHideReason.Gesture);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.acceptSelectedQuickOpenItem',
	weight: KeybindingWeight.WorkbenchContrib,
	when: inQuickPickContext,
	primary: 0,
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		return quickInputService.accept();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.alternativeAcceptSelectedQuickOpenItem',
	weight: KeybindingWeight.WorkbenchContrib,
	when: inQuickPickContext,
	primary: 0,
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		return quickInputService.accept({ ctrlCmd: true, alt: false });
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.focusQuickOpen',
	weight: KeybindingWeight.WorkbenchContrib,
	when: inQuickPickContext,
	primary: 0,
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.focus();
	}
});

const quickAccessNavigateNextInFilePickerId = 'workbench.action.quickOpenNavigateNextInFilePicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigateNextInFilePickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigateNextInFilePickerId, true),
	when: defaultQuickAccessContext,
	primary: globalQuickAccessKeybinding.primary,
	secondary: globalQuickAccessKeybinding.secondary,
	mac: globalQuickAccessKeybinding.mac
});

const quickAccessNavigatePreviousInFilePickerId = 'workbench.action.quickOpenNavigatePreviousInFilePicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickAccessNavigatePreviousInFilePickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickAccessNavigatePreviousInFilePickerId, false),
	when: defaultQuickAccessContext,
	primary: globalQuickAccessKeybinding.primary | KeyMod.Shift,
	secondary: [globalQuickAccessKeybinding.secondary[0] | KeyMod.Shift],
	mac: {
		primary: globalQuickAccessKeybinding.mac.primary | KeyMod.Shift,
		secondary: undefined
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.quickPickManyToggle',
	weight: KeybindingWeight.WorkbenchContrib,
	when: inQuickPickContext,
	primary: 0,
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.toggle();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'workbench.action.quickInputBack',
	weight: KeybindingWeight.WorkbenchContrib + 50,
	when: inQuickPickContext,
	primary: 0,
	win: { primary: KeyMod.Alt | KeyCode.LeftArrow },
	mac: { primary: KeyMod.WinCtrl | KeyCode.Minus },
	linux: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Minus },
	handler: accessor => {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.back();
	}
});

registerAction2(class QuickAccessAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.quickOpen',
			title: localize2('quickOpen', "Go to File..."),
			metadata: {
				description: `Quick access`,
				args: [{
					name: 'prefix',
					schema: {
						'type': 'string'
					}
				}]
			},
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: globalQuickAccessKeybinding.primary,
				secondary: globalQuickAccessKeybinding.secondary,
				mac: globalQuickAccessKeybinding.mac
			},
			f1: true
		});
	}

	run(accessor: ServicesAccessor, prefix: undefined): void {
		const quickInputService = accessor.get(IQuickInputService);
		quickInputService.quickAccess.show(typeof prefix === 'string' ? prefix : undefined, { preserveValue: typeof prefix === 'string' /* preserve as is if provided */ });
	}
});

registerAction2(class QuickAccessAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.quickOpenWithModes',
			title: localize('quickOpenWithModes', "Quick Open"),
			icon: Codicon.search,
			menu: {
				id: MenuId.CommandCenterCenter,
				order: 100
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const quickInputService = accessor.get(IQuickInputService);
		const providerOptions: AnythingQuickAccessProviderRunOptions = {
			includeHelp: true,
			from: 'commandCenter',
		};
		quickInputService.quickAccess.show(undefined, {
			preserveValue: true,
			providerOptions
		});
	}
});

CommandsRegistry.registerCommand('workbench.action.quickOpenPreviousEditor', async accessor => {
	const quickInputService = accessor.get(IQuickInputService);

	quickInputService.quickAccess.show('', { itemActivation: ItemActivation.SECOND });
});

//#endregion

//#region Workbench actions

class BaseQuickAccessNavigateAction extends Action2 {

	constructor(
		private id: string,
		title: ILocalizedString,
		private next: boolean,
		private quickNavigate: boolean,
		keybinding?: Omit<IKeybindingRule, 'id'>
	) {
		super({ id, title, f1: true, keybinding });
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const keybindingService = accessor.get(IKeybindingService);
		const quickInputService = accessor.get(IQuickInputService);

		const keys = keybindingService.lookupKeybindings(this.id);
		const quickNavigate = this.quickNavigate ? { keybindings: keys } : undefined;

		quickInputService.navigate(this.next, quickNavigate);
	}
}

class QuickAccessNavigateNextAction extends BaseQuickAccessNavigateAction {

	constructor() {
		super('workbench.action.quickOpenNavigateNext', localize2('quickNavigateNext', 'Navigate Next in Quick Open'), true, true);
	}
}

class QuickAccessNavigatePreviousAction extends BaseQuickAccessNavigateAction {

	constructor() {
		super('workbench.action.quickOpenNavigatePrevious', localize2('quickNavigatePrevious', 'Navigate Previous in Quick Open'), false, true);
	}
}

class QuickAccessSelectNextAction extends BaseQuickAccessNavigateAction {

	constructor() {
		super(
			'workbench.action.quickOpenSelectNext',
			localize2('quickSelectNext', 'Select Next in Quick Open'),
			true,
			false,
			{
				weight: KeybindingWeight.WorkbenchContrib + 50,
				when: inQuickPickContext,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyN }
			}
		);
	}
}

class QuickAccessSelectPreviousAction extends BaseQuickAccessNavigateAction {

	constructor() {
		super(
			'workbench.action.quickOpenSelectPrevious',
			localize2('quickSelectPrevious', 'Select Previous in Quick Open'),
			false,
			false,
			{
				weight: KeybindingWeight.WorkbenchContrib + 50,
				when: inQuickPickContext,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyP }
			}
		);
	}
}

registerAction2(QuickAccessSelectNextAction);
registerAction2(QuickAccessSelectPreviousAction);
registerAction2(QuickAccessNavigateNextAction);
registerAction2(QuickAccessNavigatePreviousAction);

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/textInputActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/textInputActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, Separator, toAction } from '../../../base/common/actions.js';
import { localize } from '../../../nls.js';
import { IWorkbenchLayoutService } from '../../services/layout/browser/layoutService.js';
import { IContextMenuService } from '../../../platform/contextview/browser/contextView.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { EventHelper, addDisposableListener, getActiveDocument, getWindow, isHTMLInputElement, isHTMLTextAreaElement } from '../../../base/browser/dom.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../common/contributions.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { StandardMouseEvent } from '../../../base/browser/mouseEvent.js';
import { Event as BaseEvent } from '../../../base/common/event.js';
import { Lazy } from '../../../base/common/lazy.js';
import { ILogService } from '../../../platform/log/common/log.js';

export function createTextInputActions(clipboardService: IClipboardService, logService: ILogService): IAction[] {
	return [

		toAction({ id: 'undo', label: localize('undo', "Undo"), run: () => getActiveDocument().execCommand('undo') }),
		toAction({ id: 'redo', label: localize('redo', "Redo"), run: () => getActiveDocument().execCommand('redo') }),
		new Separator(),
		toAction({
			id: 'editor.action.clipboardCutAction', label: localize('cut', "Cut"), run: () => {
				logService.trace('TextInputActionsProvider#cut');
				getActiveDocument().execCommand('cut');
			}
		}),
		toAction({
			id: 'editor.action.clipboardCopyAction', label: localize('copy', "Copy"), run: () => {
				logService.trace('TextInputActionsProvider#copy');
				getActiveDocument().execCommand('copy');
			}
		}),
		toAction({
			id: 'editor.action.clipboardPasteAction',
			label: localize('paste', "Paste"),
			run: async (element: unknown) => {
				logService.trace('TextInputActionsProvider#paste');
				const clipboardText = await clipboardService.readText();
				if (isHTMLTextAreaElement(element) || isHTMLInputElement(element)) {
					const selectionStart = element.selectionStart || 0;
					const selectionEnd = element.selectionEnd || 0;

					element.value = `${element.value.substring(0, selectionStart)}${clipboardText}${element.value.substring(selectionEnd, element.value.length)}`;
					element.selectionStart = selectionStart + clipboardText.length;
					element.selectionEnd = element.selectionStart;
					element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
				}
			}
		}),
		new Separator(),
		toAction({ id: 'editor.action.selectAll', label: localize('selectAll', "Select All"), run: () => getActiveDocument().execCommand('selectAll') })
	];
}

export class TextInputActionsProvider extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.textInputActionsProvider';

	private readonly textInputActions = new Lazy<IAction[]>(() => createTextInputActions(this.clipboardService, this.logService));

	constructor(
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IClipboardService private readonly clipboardService: IClipboardService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Context menu support in input/textarea
		this._register(BaseEvent.runAndSubscribe(this.layoutService.onDidAddContainer, ({ container, disposables }) => {
			disposables.add(addDisposableListener(container, 'contextmenu', e => this.onContextMenu(getWindow(container), e)));
		}, { container: this.layoutService.mainContainer, disposables: this._store }));
	}

	private onContextMenu(targetWindow: Window, e: MouseEvent): void {
		if (e.defaultPrevented) {
			return; // make sure to not show these actions by accident if component indicated to prevent
		}

		const target = e.target;
		if (!isHTMLTextAreaElement(target) && !isHTMLInputElement(target)) {
			return; // only for inputs or textareas
		}

		EventHelper.stop(e, true);

		const event = new StandardMouseEvent(targetWindow, e);

		this.contextMenuService.showContextMenu({
			getAnchor: () => event,
			getActions: () => this.textInputActions.value,
			getActionsContext: () => target,
		});
	}
}

registerWorkbenchContribution2(
	TextInputActionsProvider.ID,
	TextInputActionsProvider,
	WorkbenchPhase.BlockRestore // Block to allow right-click into input fields before restore finished
);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/widgetNavigationCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/widgetNavigationCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyMod, KeyCode } from '../../../base/common/keyCodes.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { WorkbenchListFocusContextKey, WorkbenchListScrollAtBottomContextKey, WorkbenchListScrollAtTopContextKey } from '../../../platform/list/browser/listService.js';
import { Event } from '../../../base/common/event.js';
import { combinedDisposable, toDisposable, IDisposable, Disposable } from '../../../base/common/lifecycle.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../common/contributions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';

/** INavigableContainer represents a logical container composed of widgets that can
	be navigated back and forth with key shortcuts */
interface INavigableContainer {
	/**
	 * The container may coomposed of multiple parts that share no DOM ancestor
	 * (e.g., the main body and filter box of MarkersView may be separated).
	 * To track the focus of container we must pass in focus/blur events of all parts
	 * as `focusNotifiers`.
	 *
	 * Each element of `focusNotifiers` notifies the focus/blur event for a part of
	 * the container. The container is considered focused if at least one part being
	 * focused, and blurred if all parts being blurred.
	 */
	readonly focusNotifiers: readonly IFocusNotifier[];
	readonly name?: string; // for debugging
	focusPreviousWidget(): void;
	focusNextWidget(): void;
}

interface IFocusNotifier {
	readonly onDidFocus: Event<void>;
	readonly onDidBlur: Event<void>;
}

function handleFocusEventsGroup(group: readonly IFocusNotifier[], handler: (isFocus: boolean) => void, onPartFocusChange?: (index: number, state: string) => void): IDisposable {
	const focusedIndices = new Set<number>();
	return combinedDisposable(...group.map((events, index) => combinedDisposable(
		events.onDidFocus(() => {
			onPartFocusChange?.(index, 'focus');
			if (!focusedIndices.size) {
				handler(true);
			}
			focusedIndices.add(index);
		}),
		events.onDidBlur(() => {
			onPartFocusChange?.(index, 'blur');
			focusedIndices.delete(index);
			if (!focusedIndices.size) {
				handler(false);
			}
		}),
	)));
}

const NavigableContainerFocusedContextKey = new RawContextKey<boolean>('navigableContainerFocused', false);

class NavigableContainerManager implements IDisposable {

	static readonly ID = 'workbench.contrib.navigableContainerManager';

	private static INSTANCE: NavigableContainerManager | undefined;

	private readonly containers = new Set<INavigableContainer>();
	private lastContainer: INavigableContainer | undefined;
	private focused: IContextKey<boolean>;


	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ILogService private logService: ILogService,
		@IConfigurationService private configurationService: IConfigurationService) {
		this.focused = NavigableContainerFocusedContextKey.bindTo(contextKeyService);
		NavigableContainerManager.INSTANCE = this;
	}

	dispose(): void {
		this.containers.clear();
		this.focused.reset();
		NavigableContainerManager.INSTANCE = undefined;
	}

	private get debugEnabled(): boolean {
		return this.configurationService.getValue('workbench.navigibleContainer.enableDebug');
	}

	private log(msg: string, ...args: unknown[]): void {
		if (this.debugEnabled) {
			this.logService.debug(msg, ...args);
		}
	}

	static register(container: INavigableContainer): IDisposable {
		const instance = this.INSTANCE;
		if (!instance) {
			return Disposable.None;
		}
		instance.containers.add(container);
		instance.log('NavigableContainerManager.register', container.name);

		return combinedDisposable(
			handleFocusEventsGroup(container.focusNotifiers, (isFocus) => {
				if (isFocus) {
					instance.log('NavigableContainerManager.focus', container.name);
					instance.focused.set(true);
					instance.lastContainer = container;
				} else {
					instance.log('NavigableContainerManager.blur', container.name, instance.lastContainer?.name);
					if (instance.lastContainer === container) {
						instance.focused.set(false);
						instance.lastContainer = undefined;
					}
				}
			}, (index: number, event: string) => {
				instance.log('NavigableContainerManager.partFocusChange', container.name, index, event);
			}),
			toDisposable(() => {
				instance.containers.delete(container);
				instance.log('NavigableContainerManager.unregister', container.name, instance.lastContainer?.name);
				if (instance.lastContainer === container) {
					instance.focused.set(false);
					instance.lastContainer = undefined;
				}
			})
		);
	}

	static getActive(): INavigableContainer | undefined {
		return this.INSTANCE?.lastContainer;
	}
}

export function registerNavigableContainer(container: INavigableContainer): IDisposable {
	return NavigableContainerManager.register(container);
}

registerWorkbenchContribution2(NavigableContainerManager.ID, NavigableContainerManager, WorkbenchPhase.BlockStartup);

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'widgetNavigation.focusPrevious',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		NavigableContainerFocusedContextKey,
		ContextKeyExpr.or(
			WorkbenchListFocusContextKey?.negate(),
			WorkbenchListScrollAtTopContextKey,
		)
	),
	primary: KeyMod.CtrlCmd | KeyCode.UpArrow,
	handler: () => {
		const activeContainer = NavigableContainerManager.getActive();
		activeContainer?.focusPreviousWidget();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'widgetNavigation.focusNext',
	weight: KeybindingWeight.WorkbenchContrib,
	when: ContextKeyExpr.and(
		NavigableContainerFocusedContextKey,
		ContextKeyExpr.or(
			WorkbenchListFocusContextKey?.negate(),
			WorkbenchListScrollAtBottomContextKey,
		)
	),
	primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
	handler: () => {
		const activeContainer = NavigableContainerManager.getActive();
		activeContainer?.focusNextWidget();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/windowActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/windowActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { IWindowOpenable } from '../../../platform/window/common/window.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { MenuRegistry, MenuId, Action2, registerAction2 } from '../../../platform/actions/common/actions.js';
import { KeyChord, KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { IsMainWindowFullscreenContext } from '../../common/contextkeys.js';
import { IsMacNativeContext, IsDevelopmentContext, IsWebContext, IsIOSContext } from '../../../platform/contextkey/common/contextkeys.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { IQuickInputButton, IQuickInputService, IQuickPickSeparator, IKeyMods, IQuickPickItem } from '../../../platform/quickinput/common/quickInput.js';
import { IWorkspaceContextService, IWorkspaceIdentifier, isWorkspaceIdentifier, isSingleFolderWorkspaceIdentifier } from '../../../platform/workspace/common/workspace.js';
import { ILabelService, Verbosity } from '../../../platform/label/common/label.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IRecent, isRecentFolder, isRecentWorkspace, IWorkspacesService } from '../../../platform/workspaces/common/workspaces.js';
import { URI } from '../../../base/common/uri.js';
import { getIconClasses } from '../../../editor/common/services/getIconClasses.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { splitRecentLabel } from '../../../base/common/labels.js';
import { isMacintosh, isWeb, isWindows } from '../../../base/common/platform.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { inQuickPickContext, getQuickNavigateHandler } from '../quickaccess.js';
import { IHostService } from '../../services/host/browser/host.js';
import { ResourceMap } from '../../../base/common/map.js';
import { Codicon } from '../../../base/common/codicons.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { isFolderBackupInfo, isWorkspaceBackupInfo } from '../../../platform/backup/common/backup.js';
import { getActiveElement, getActiveWindow, isHTMLElement } from '../../../base/browser/dom.js';

export const inRecentFilesPickerContextKey = 'inRecentFilesPicker';

interface IRecentlyOpenedPick extends IQuickPickItem {
	resource: URI;
	openable: IWindowOpenable;
	remoteAuthority: string | undefined;
}

abstract class BaseOpenRecentAction extends Action2 {

	private readonly removeFromRecentlyOpened: IQuickInputButton = {
		iconClass: ThemeIcon.asClassName(Codicon.removeClose),
		tooltip: localize('remove', "Remove from Recently Opened")
	};

	private readonly dirtyRecentlyOpenedFolder: IQuickInputButton = {
		iconClass: 'dirty-workspace ' + ThemeIcon.asClassName(Codicon.closeDirty),
		tooltip: localize('dirtyRecentlyOpenedFolder', "Folder With Unsaved Files"),
		alwaysVisible: true
	};

	private readonly dirtyRecentlyOpenedWorkspace: IQuickInputButton = {
		...this.dirtyRecentlyOpenedFolder,
		tooltip: localize('dirtyRecentlyOpenedWorkspace', "Workspace With Unsaved Files"),
	};

	private readonly windowOpenedRecentlyOpenedFolder: IQuickInputButton = {
		iconClass: 'opened-workspace ' + ThemeIcon.asClassName(Codicon.window),
		tooltip: localize('openedRecentlyOpenedFolder', "Folder Opened in a Window"),
		alwaysVisible: true
	};

	private readonly windowOpenedRecentlyOpenedWorkspace: IQuickInputButton = {
		...this.windowOpenedRecentlyOpenedFolder,
		tooltip: localize('openedRecentlyOpenedWorkspace', "Workspace Opened in a Window"),
	};

	private readonly activeWindowOpenedRecentlyOpenedFolder: IQuickInputButton = {
		iconClass: 'opened-workspace ' + ThemeIcon.asClassName(Codicon.windowActive),
		tooltip: localize('activeOpenedRecentlyOpenedFolder', "Folder Opened in Active Window"),
		alwaysVisible: true
	};

	private readonly activeWindowOpenedRecentlyOpenedWorkspace: IQuickInputButton = {
		...this.activeWindowOpenedRecentlyOpenedFolder,
		tooltip: localize('activeOpenedRecentlyOpenedWorkspace', "Workspace Opened in Active Window"),
	};

	protected abstract isQuickNavigate(): boolean;

	override async run(accessor: ServicesAccessor): Promise<void> {
		const workspacesService = accessor.get(IWorkspacesService);
		const quickInputService = accessor.get(IQuickInputService);
		const contextService = accessor.get(IWorkspaceContextService);
		const labelService = accessor.get(ILabelService);
		const keybindingService = accessor.get(IKeybindingService);
		const modelService = accessor.get(IModelService);
		const languageService = accessor.get(ILanguageService);
		const hostService = accessor.get(IHostService);
		const dialogService = accessor.get(IDialogService);

		const [mainWindows, recentlyOpened, dirtyWorkspacesAndFolders] = await Promise.all([
			hostService.getWindows({ includeAuxiliaryWindows: false }),
			workspacesService.getRecentlyOpened(),
			workspacesService.getDirtyWorkspaces()
		]);

		let hasWorkspaces = false;

		// Identify all folders and workspaces with unsaved files
		const dirtyFolders = new ResourceMap<boolean>();
		const dirtyWorkspaces = new ResourceMap<IWorkspaceIdentifier>();
		for (const dirtyWorkspace of dirtyWorkspacesAndFolders) {
			if (isFolderBackupInfo(dirtyWorkspace)) {
				dirtyFolders.set(dirtyWorkspace.folderUri, true);
			} else {
				dirtyWorkspaces.set(dirtyWorkspace.workspace.configPath, dirtyWorkspace.workspace);
				hasWorkspaces = true;
			}
		}

		// Identify all folders and workspaces opened in main windows
		const activeWindowId = getActiveWindow().vscodeWindowId;
		const openedInWindows = new ResourceMap<{ isActive: boolean }>();
		for (const window of mainWindows) {
			const isActive = window.id === activeWindowId;
			if (isSingleFolderWorkspaceIdentifier(window.workspace)) {
				openedInWindows.set(window.workspace.uri, { isActive });
			} else if (isWorkspaceIdentifier(window.workspace)) {
				openedInWindows.set(window.workspace.configPath, { isActive });
			}
		}

		// Identify all recently opened folders and workspaces
		const recentFolders = new ResourceMap<boolean>();
		const recentWorkspaces = new ResourceMap<IWorkspaceIdentifier>();
		for (const recent of recentlyOpened.workspaces) {
			if (isRecentFolder(recent)) {
				recentFolders.set(recent.folderUri, true);
			} else {
				recentWorkspaces.set(recent.workspace.configPath, recent.workspace);
				hasWorkspaces = true;
			}
		}

		// Fill in all known recently opened workspaces
		const workspacePicks: IRecentlyOpenedPick[] = [];
		for (const recent of recentlyOpened.workspaces) {
			const isDirty = isRecentFolder(recent) ? dirtyFolders.has(recent.folderUri) : dirtyWorkspaces.has(recent.workspace.configPath);
			const windowState = isRecentFolder(recent) ? openedInWindows.get(recent.folderUri) : openedInWindows.get(recent.workspace.configPath);

			workspacePicks.push(this.toQuickPick(modelService, languageService, labelService, recent, { isDirty, windowState }));
		}

		// Fill any backup workspace that is not yet shown at the end
		for (const dirtyWorkspaceOrFolder of dirtyWorkspacesAndFolders) {
			if (isFolderBackupInfo(dirtyWorkspaceOrFolder) && !recentFolders.has(dirtyWorkspaceOrFolder.folderUri)) {
				workspacePicks.push(this.toQuickPick(modelService, languageService, labelService, dirtyWorkspaceOrFolder, { isDirty: true, windowState: undefined }));
			} else if (isWorkspaceBackupInfo(dirtyWorkspaceOrFolder) && !recentWorkspaces.has(dirtyWorkspaceOrFolder.workspace.configPath)) {
				workspacePicks.push(this.toQuickPick(modelService, languageService, labelService, dirtyWorkspaceOrFolder, { isDirty: true, windowState: undefined }));
			}
		}

		const filePicks = recentlyOpened.files.map(p => this.toQuickPick(modelService, languageService, labelService, p, { isDirty: false, windowState: undefined }));

		// focus second entry if the first recent workspace is the current workspace
		const firstEntry = recentlyOpened.workspaces[0];
		const autoFocusSecondEntry: boolean = firstEntry && contextService.isCurrentWorkspace(isRecentWorkspace(firstEntry) ? firstEntry.workspace : firstEntry.folderUri);

		let keyMods: IKeyMods | undefined;

		const workspaceSeparator: IQuickPickSeparator = { type: 'separator', label: hasWorkspaces ? localize('workspacesAndFolders', "folders & workspaces") : localize('folders', "folders") };
		const fileSeparator: IQuickPickSeparator = { type: 'separator', label: localize('files', "files") };
		const picks = [workspaceSeparator, ...workspacePicks, fileSeparator, ...filePicks];

		const pick = await quickInputService.pick(picks, {
			contextKey: inRecentFilesPickerContextKey,
			activeItem: [...workspacePicks, ...filePicks][autoFocusSecondEntry ? 1 : 0],
			placeHolder: isMacintosh ? localize('openRecentPlaceholderMac', "Select to open (hold Cmd-key to force new window or Option-key for same window)") : localize('openRecentPlaceholder', "Select to open (hold Ctrl-key to force new window or Alt-key for same window)"),
			matchOnDescription: true,
			sortByLabel: false,
			onKeyMods: mods => keyMods = mods,
			quickNavigate: this.isQuickNavigate() ? { keybindings: keybindingService.lookupKeybindings(this.desc.id) } : undefined,
			hideInput: this.isQuickNavigate(),
			onDidTriggerItemButton: async context => {

				// Remove
				if (context.button === this.removeFromRecentlyOpened || context.button === this.windowOpenedRecentlyOpenedFolder || context.button === this.windowOpenedRecentlyOpenedWorkspace) {
					await workspacesService.removeRecentlyOpened([context.item.resource]);
					context.removeItem();
				}

				// Dirty Folder/Workspace
				else if (context.button === this.dirtyRecentlyOpenedFolder || context.button === this.dirtyRecentlyOpenedWorkspace) {
					const isDirtyWorkspace = context.button === this.dirtyRecentlyOpenedWorkspace;
					const { confirmed } = await dialogService.confirm({
						title: isDirtyWorkspace ? localize('dirtyWorkspace', "Workspace with Unsaved Files") : localize('dirtyFolder', "Folder with Unsaved Files"),
						message: isDirtyWorkspace ? localize('dirtyWorkspaceConfirm', "Do you want to open the workspace to review the unsaved files?") : localize('dirtyFolderConfirm', "Do you want to open the folder to review the unsaved files?"),
						detail: isDirtyWorkspace ? localize('dirtyWorkspaceConfirmDetail', "Workspaces with unsaved files cannot be removed until all unsaved files have been saved or reverted.") : localize('dirtyFolderConfirmDetail', "Folders with unsaved files cannot be removed until all unsaved files have been saved or reverted.")
					});

					if (confirmed) {
						hostService.openWindow(
							[context.item.openable], {
							remoteAuthority: context.item.remoteAuthority || null // local window if remoteAuthority is not set or can not be deducted from the openable
						});
						quickInputService.cancel();
					}
				}
			}
		});

		if (pick) {
			return hostService.openWindow([pick.openable], {
				forceNewWindow: keyMods?.ctrlCmd,
				forceReuseWindow: keyMods?.alt,
				remoteAuthority: pick.remoteAuthority || null // local window if remoteAuthority is not set or can not be deducted from the openable
			});
		}
	}

	private toQuickPick(modelService: IModelService, languageService: ILanguageService, labelService: ILabelService, recent: IRecent, kind: { isDirty: boolean; windowState?: { isActive: boolean } }): IRecentlyOpenedPick {
		let openable: IWindowOpenable | undefined;
		let iconClasses: string[];
		let fullLabel: string | undefined;
		let resource: URI | undefined;
		let isWorkspace = false;

		// Folder
		if (isRecentFolder(recent)) {
			resource = recent.folderUri;
			iconClasses = getIconClasses(modelService, languageService, resource, FileKind.FOLDER);
			openable = { folderUri: resource };
			fullLabel = recent.label || labelService.getWorkspaceLabel(resource, { verbose: Verbosity.LONG });
		}

		// Workspace
		else if (isRecentWorkspace(recent)) {
			resource = recent.workspace.configPath;
			iconClasses = getIconClasses(modelService, languageService, resource, FileKind.ROOT_FOLDER);
			openable = { workspaceUri: resource };
			fullLabel = recent.label || labelService.getWorkspaceLabel(recent.workspace, { verbose: Verbosity.LONG });
			isWorkspace = true;
		}

		// File
		else {
			resource = recent.fileUri;
			iconClasses = getIconClasses(modelService, languageService, resource, FileKind.FILE);
			openable = { fileUri: resource };
			fullLabel = recent.label || labelService.getUriLabel(resource, { appendWorkspaceSuffix: true });
		}

		const { name, parentPath } = splitRecentLabel(fullLabel);

		const buttons: IQuickInputButton[] = [];
		if (kind.isDirty) {
			buttons.push(isWorkspace ? this.dirtyRecentlyOpenedWorkspace : this.dirtyRecentlyOpenedFolder);
		} else if (kind.windowState) {
			if (kind.windowState.isActive) {
				buttons.push(isWorkspace ? this.activeWindowOpenedRecentlyOpenedWorkspace : this.activeWindowOpenedRecentlyOpenedFolder);
			} else {
				buttons.push(isWorkspace ? this.windowOpenedRecentlyOpenedWorkspace : this.windowOpenedRecentlyOpenedFolder);
			}
		} else {
			buttons.push(this.removeFromRecentlyOpened);
		}

		return {
			iconClasses,
			label: name,
			ariaLabel: kind.isDirty ? isWorkspace ? localize('recentDirtyWorkspaceAriaLabel', "{0}, workspace with unsaved changes", name) : localize('recentDirtyFolderAriaLabel', "{0}, folder with unsaved changes", name) : name,
			description: parentPath,
			buttons,
			openable,
			resource,
			remoteAuthority: recent.remoteAuthority
		};
	}
}

export class OpenRecentAction extends BaseOpenRecentAction {

	static ID = 'workbench.action.openRecent';

	constructor() {
		super({
			id: OpenRecentAction.ID,
			title: {
				...localize2('openRecent', "Open Recent..."),
				mnemonicTitle: localize({ key: 'miMore', comment: ['&& denotes a mnemonic'] }, "&&More..."),
			},
			category: Categories.File,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyR,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyR }
			},
			menu: {
				id: MenuId.MenubarRecentMenu,
				group: 'y_more',
				order: 1
			}
		});
	}

	protected isQuickNavigate(): boolean {
		return false;
	}
}

class QuickPickRecentAction extends BaseOpenRecentAction {

	constructor() {
		super({
			id: 'workbench.action.quickOpenRecent',
			title: localize2('quickOpenRecent', 'Quick Open Recent...'),
			category: Categories.File,
			f1: false // hide quick pickers from command palette to not confuse with the other entry that shows a input field
		});
	}

	protected isQuickNavigate(): boolean {
		return true;
	}
}

class ToggleFullScreenAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.toggleFullScreen',
			title: {
				...localize2('toggleFullScreen', "Toggle Full Screen"),
				mnemonicTitle: localize({ key: 'miToggleFullScreen', comment: ['&& denotes a mnemonic'] }, "&&Full Screen"),
			},
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyCode.F11,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.WinCtrl | KeyCode.KeyF
				}
			},
			precondition: IsIOSContext.toNegated(),
			toggled: IsMainWindowFullscreenContext,
			menu: [{
				id: MenuId.MenubarAppearanceMenu,
				group: '1_toggle_view',
				order: 1
			}]
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const hostService = accessor.get(IHostService);

		return hostService.toggleFullScreen(getActiveWindow());
	}
}

export class ReloadWindowAction extends Action2 {

	static readonly ID = 'workbench.action.reloadWindow';

	constructor() {
		super({
			id: ReloadWindowAction.ID,
			title: localize2('reloadWindow', 'Reload Window'),
			category: Categories.Developer,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib + 50,
				when: IsDevelopmentContext,
				primary: KeyMod.CtrlCmd | KeyCode.KeyR
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const hostService = accessor.get(IHostService);

		return hostService.reload();
	}
}

class ShowAboutDialogAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.showAboutDialog',
			title: {
				...localize2('about', "About"),
				mnemonicTitle: localize({ key: 'miAbout', comment: ['&& denotes a mnemonic'] }, "&&About"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: 'z_about',
				order: 1,
				when: IsMacNativeContext.toNegated()
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const dialogService = accessor.get(IDialogService);

		return dialogService.about();
	}
}

class NewWindowAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.newWindow',
			title: {
				...localize2('newWindow', "New Window"),
				mnemonicTitle: localize({ key: 'miNewWindow', comment: ['&& denotes a mnemonic'] }, "New &&Window"),
			},
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: isWeb ? (isWindows ? KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.Shift | KeyCode.KeyN) : KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.Shift | KeyCode.KeyN) : KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyN,
				secondary: isWeb ? [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyN] : undefined
			},
			menu: {
				id: MenuId.MenubarFileMenu,
				group: '1_new',
				order: 3
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const hostService = accessor.get(IHostService);

		return hostService.openWindow({ remoteAuthority: null });
	}
}

class BlurAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.blur',
			title: localize2('blur', 'Remove keyboard focus from focused element')
		});
	}

	run(): void {
		const activeElement = getActiveElement();
		if (isHTMLElement(activeElement)) {
			activeElement.blur();
		}
	}
}

// --- Actions Registration

registerAction2(NewWindowAction);
registerAction2(ToggleFullScreenAction);
registerAction2(QuickPickRecentAction);
registerAction2(OpenRecentAction);
registerAction2(ReloadWindowAction);
registerAction2(ShowAboutDialogAction);
registerAction2(BlurAction);

// --- Commands/Keybindings Registration

const recentFilesPickerContext = ContextKeyExpr.and(inQuickPickContext, ContextKeyExpr.has(inRecentFilesPickerContextKey));

const quickPickNavigateNextInRecentFilesPickerId = 'workbench.action.quickOpenNavigateNextInRecentFilesPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickPickNavigateNextInRecentFilesPickerId,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickPickNavigateNextInRecentFilesPickerId, true),
	when: recentFilesPickerContext,
	primary: KeyMod.CtrlCmd | KeyCode.KeyR,
	mac: { primary: KeyMod.WinCtrl | KeyCode.KeyR }
});

const quickPickNavigatePreviousInRecentFilesPicker = 'workbench.action.quickOpenNavigatePreviousInRecentFilesPicker';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: quickPickNavigatePreviousInRecentFilesPicker,
	weight: KeybindingWeight.WorkbenchContrib + 50,
	handler: getQuickNavigateHandler(quickPickNavigatePreviousInRecentFilesPicker, false),
	when: recentFilesPickerContext,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyR,
	mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KeyR }
});

CommandsRegistry.registerCommand('workbench.action.toggleConfirmBeforeClose', accessor => {
	const configurationService = accessor.get(IConfigurationService);
	const setting = configurationService.inspect<'always' | 'keyboardOnly' | 'never'>('window.confirmBeforeClose').userValue;

	return configurationService.updateValue('window.confirmBeforeClose', setting === 'never' ? 'keyboardOnly' : 'never');
});

// --- Menu Registration

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: 'z_ConfirmClose',
	command: {
		id: 'workbench.action.toggleConfirmBeforeClose',
		title: localize('miConfirmClose', "Confirm Before Close"),
		toggled: ContextKeyExpr.notEquals('config.window.confirmBeforeClose', 'never')
	},
	order: 1,
	when: IsWebContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	title: localize({ key: 'miOpenRecent', comment: ['&& denotes a mnemonic'] }, "Open &&Recent"),
	submenu: MenuId.MenubarRecentMenu,
	group: '2_open',
	order: 4
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/workspaceActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/workspaceActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { ITelemetryData } from '../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService, WorkbenchState, IWorkspaceFolder, hasWorkspaceFileExtension } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceEditingService } from '../../services/workspaces/common/workspaceEditing.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ADD_ROOT_FOLDER_COMMAND_ID, ADD_ROOT_FOLDER_LABEL, PICK_WORKSPACE_FOLDER_COMMAND_ID, SET_ROOT_FOLDER_COMMAND_ID } from './workspaceCommands.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { MenuRegistry, MenuId, Action2, registerAction2 } from '../../../platform/actions/common/actions.js';
import { EmptyWorkspaceSupportContext, EnterMultiRootWorkspaceSupportContext, OpenFolderWorkspaceSupportContext, WorkbenchStateContext, WorkspaceFolderCountContext } from '../../common/contextkeys.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { IHostService } from '../../services/host/browser/host.js';
import { KeyChord, KeyCode, KeyMod } from '../../../base/common/keyCodes.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { IWorkspacesService } from '../../../platform/workspaces/common/workspaces.js';
import { KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { IsMacNativeContext } from '../../../platform/contextkey/common/contextkeys.js';
import { ILocalizedString } from '../../../platform/action/common/action.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';

const workspacesCategory: ILocalizedString = localize2('workspaces', 'Workspaces');

export class OpenFileAction extends Action2 {

	static readonly ID = 'workbench.action.files.openFile';

	constructor() {
		super({
			id: OpenFileAction.ID,
			title: localize2('openFile', 'Open File...'),
			category: Categories.File,
			f1: true,
			keybinding: {
				when: IsMacNativeContext.toNegated(),
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyO
			}
		});
	}

	override async run(accessor: ServicesAccessor, data?: ITelemetryData): Promise<void> {
		const fileDialogService = accessor.get(IFileDialogService);

		return fileDialogService.pickFileAndOpen({ forceNewWindow: false, telemetryExtraData: data });
	}
}

export class OpenFolderAction extends Action2 {

	static readonly ID = 'workbench.action.files.openFolder';

	constructor() {
		super({
			id: OpenFolderAction.ID,
			title: localize2('openFolder', 'Open Folder...'),
			category: Categories.File,
			f1: true,
			precondition: OpenFolderWorkspaceSupportContext,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: undefined,
				linux: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyO)
				},
				win: {
					primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyO)
				}
			}
		});
	}

	override async run(accessor: ServicesAccessor, data?: ITelemetryData): Promise<void> {
		const fileDialogService = accessor.get(IFileDialogService);

		return fileDialogService.pickFolderAndOpen({ forceNewWindow: false, telemetryExtraData: data });
	}
}

export class OpenFolderViaWorkspaceAction extends Action2 {

	// This action swaps the folders of a workspace with
	// the selected folder and is a workaround for providing
	// "Open Folder..." in environments that do not support
	// this without having a workspace open (e.g. web serverless)

	static readonly ID = 'workbench.action.files.openFolderViaWorkspace';

	constructor() {
		super({
			id: OpenFolderViaWorkspaceAction.ID,
			title: localize2('openFolder', 'Open Folder...'),
			category: Categories.File,
			f1: true,
			precondition: ContextKeyExpr.and(OpenFolderWorkspaceSupportContext.toNegated(), WorkbenchStateContext.isEqualTo('workspace')),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyO
			}
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);

		return commandService.executeCommand(SET_ROOT_FOLDER_COMMAND_ID);
	}
}

export class OpenFileFolderAction extends Action2 {

	static readonly ID = 'workbench.action.files.openFileFolder';
	static readonly LABEL: ILocalizedString = localize2('openFileFolder', 'Open...');

	constructor() {
		super({
			id: OpenFileFolderAction.ID,
			title: OpenFileFolderAction.LABEL,
			category: Categories.File,
			f1: true,
			precondition: ContextKeyExpr.and(IsMacNativeContext, OpenFolderWorkspaceSupportContext),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyCode.KeyO
			}
		});
	}

	override async run(accessor: ServicesAccessor, data?: ITelemetryData): Promise<void> {
		const fileDialogService = accessor.get(IFileDialogService);

		return fileDialogService.pickFileFolderAndOpen({ forceNewWindow: false, telemetryExtraData: data });
	}
}

class OpenWorkspaceAction extends Action2 {

	static readonly ID = 'workbench.action.openWorkspace';

	constructor() {
		super({
			id: OpenWorkspaceAction.ID,
			title: localize2('openWorkspaceAction', 'Open Workspace from File...'),
			category: Categories.File,
			f1: true,
			precondition: EnterMultiRootWorkspaceSupportContext
		});
	}

	override async run(accessor: ServicesAccessor, data?: ITelemetryData): Promise<void> {
		const fileDialogService = accessor.get(IFileDialogService);

		return fileDialogService.pickWorkspaceAndOpen({ telemetryExtraData: data });
	}
}

class CloseWorkspaceAction extends Action2 {

	static readonly ID = 'workbench.action.closeFolder';

	constructor() {
		super({
			id: CloseWorkspaceAction.ID,
			title: localize2('closeWorkspace', 'Close Workspace'),
			category: workspacesCategory,
			f1: true,
			precondition: ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('empty'), EmptyWorkspaceSupportContext),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyF)
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const hostService = accessor.get(IHostService);
		const environmentService = accessor.get(IWorkbenchEnvironmentService);

		return hostService.openWindow({ forceReuseWindow: true, remoteAuthority: environmentService.remoteAuthority });
	}
}

class OpenWorkspaceConfigFileAction extends Action2 {

	static readonly ID = 'workbench.action.openWorkspaceConfigFile';

	constructor() {
		super({
			id: OpenWorkspaceConfigFileAction.ID,
			title: localize2('openWorkspaceConfigFile', 'Open Workspace Configuration File'),
			category: workspacesCategory,
			f1: true,
			precondition: WorkbenchStateContext.isEqualTo('workspace')
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const contextService = accessor.get(IWorkspaceContextService);
		const editorService = accessor.get(IEditorService);

		const configuration = contextService.getWorkspace().configuration;
		if (configuration) {
			await editorService.openEditor({ resource: configuration, options: { pinned: true } });
		}
	}
}

export class AddRootFolderAction extends Action2 {

	static readonly ID = 'workbench.action.addRootFolder';

	constructor() {
		super({
			id: AddRootFolderAction.ID,
			title: ADD_ROOT_FOLDER_LABEL,
			category: workspacesCategory,
			f1: true,
			precondition: ContextKeyExpr.or(EnterMultiRootWorkspaceSupportContext, WorkbenchStateContext.isEqualTo('workspace'))
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);

		return commandService.executeCommand(ADD_ROOT_FOLDER_COMMAND_ID);
	}
}

export class RemoveRootFolderAction extends Action2 {

	static readonly ID = 'workbench.action.removeRootFolder';

	constructor() {
		super({
			id: RemoveRootFolderAction.ID,
			title: localize2('globalRemoveFolderFromWorkspace', 'Remove Folder from Workspace...'),
			category: workspacesCategory,
			f1: true,
			precondition: ContextKeyExpr.and(WorkspaceFolderCountContext.notEqualsTo('0'), ContextKeyExpr.or(EnterMultiRootWorkspaceSupportContext, WorkbenchStateContext.isEqualTo('workspace')))
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const workspaceEditingService = accessor.get(IWorkspaceEditingService);

		const folder = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID);
		if (folder) {
			await workspaceEditingService.removeFolders([folder.uri]);
		}
	}
}

class SaveWorkspaceAsAction extends Action2 {

	static readonly ID = 'workbench.action.saveWorkspaceAs';

	constructor() {
		super({
			id: SaveWorkspaceAsAction.ID,
			title: localize2('saveWorkspaceAsAction', 'Save Workspace As...'),
			category: workspacesCategory,
			f1: true,
			precondition: EnterMultiRootWorkspaceSupportContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const workspaceEditingService = accessor.get(IWorkspaceEditingService);
		const contextService = accessor.get(IWorkspaceContextService);

		const configPathUri = await workspaceEditingService.pickNewWorkspacePath();
		if (configPathUri && hasWorkspaceFileExtension(configPathUri)) {
			switch (contextService.getWorkbenchState()) {
				case WorkbenchState.EMPTY:
				case WorkbenchState.FOLDER: {
					const folders = contextService.getWorkspace().folders.map(folder => ({ uri: folder.uri }));
					return workspaceEditingService.createAndEnterWorkspace(folders, configPathUri);
				}
				case WorkbenchState.WORKSPACE:
					return workspaceEditingService.saveAndEnterWorkspace(configPathUri);
			}
		}
	}
}

class DuplicateWorkspaceInNewWindowAction extends Action2 {

	static readonly ID = 'workbench.action.duplicateWorkspaceInNewWindow';

	constructor() {
		super({
			id: DuplicateWorkspaceInNewWindowAction.ID,
			title: localize2('duplicateWorkspaceInNewWindow', 'Duplicate As Workspace in New Window'),
			category: workspacesCategory,
			f1: true,
			precondition: EnterMultiRootWorkspaceSupportContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const workspaceEditingService = accessor.get(IWorkspaceEditingService);
		const hostService = accessor.get(IHostService);
		const workspacesService = accessor.get(IWorkspacesService);
		const environmentService = accessor.get(IWorkbenchEnvironmentService);

		const folders = workspaceContextService.getWorkspace().folders;
		const remoteAuthority = environmentService.remoteAuthority;

		const newWorkspace = await workspacesService.createUntitledWorkspace(folders, remoteAuthority);
		await workspaceEditingService.copyWorkspaceSettings(newWorkspace);

		return hostService.openWindow([{ workspaceUri: newWorkspace.configPath }], { forceNewWindow: true, remoteAuthority });
	}
}

// --- Actions Registration

registerAction2(AddRootFolderAction);
registerAction2(RemoveRootFolderAction);
registerAction2(OpenFileAction);
registerAction2(OpenFolderAction);
registerAction2(OpenFolderViaWorkspaceAction);
registerAction2(OpenFileFolderAction);
registerAction2(OpenWorkspaceAction);
registerAction2(OpenWorkspaceConfigFileAction);
registerAction2(CloseWorkspaceAction);
registerAction2(SaveWorkspaceAsAction);
registerAction2(DuplicateWorkspaceInNewWindowAction);

// --- Menu Registration

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '2_open',
	command: {
		id: OpenFileAction.ID,
		title: localize({ key: 'miOpenFile', comment: ['&& denotes a mnemonic'] }, "&&Open File...")
	},
	order: 1,
	when: IsMacNativeContext.toNegated()
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '2_open',
	command: {
		id: OpenFolderAction.ID,
		title: localize({ key: 'miOpenFolder', comment: ['&& denotes a mnemonic'] }, "Open &&Folder...")
	},
	order: 2,
	when: OpenFolderWorkspaceSupportContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '2_open',
	command: {
		id: OpenFolderViaWorkspaceAction.ID,
		title: localize({ key: 'miOpenFolder', comment: ['&& denotes a mnemonic'] }, "Open &&Folder...")
	},
	order: 2,
	when: ContextKeyExpr.and(OpenFolderWorkspaceSupportContext.toNegated(), WorkbenchStateContext.isEqualTo('workspace'))
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '2_open',
	command: {
		id: OpenFileFolderAction.ID,
		title: localize({ key: 'miOpen', comment: ['&& denotes a mnemonic'] }, "&&Open...")
	},
	order: 1,
	when: ContextKeyExpr.and(IsMacNativeContext, OpenFolderWorkspaceSupportContext)
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '2_open',
	command: {
		id: OpenWorkspaceAction.ID,
		title: localize({ key: 'miOpenWorkspace', comment: ['&& denotes a mnemonic'] }, "Open Wor&&kspace from File...")
	},
	order: 3,
	when: EnterMultiRootWorkspaceSupportContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '3_workspace',
	command: {
		id: ADD_ROOT_FOLDER_COMMAND_ID,
		title: localize({ key: 'miAddFolderToWorkspace', comment: ['&& denotes a mnemonic'] }, "A&&dd Folder to Workspace...")
	},
	when: ContextKeyExpr.or(EnterMultiRootWorkspaceSupportContext, WorkbenchStateContext.isEqualTo('workspace')),
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '3_workspace',
	command: {
		id: SaveWorkspaceAsAction.ID,
		title: localize('miSaveWorkspaceAs', "Save Workspace As...")
	},
	order: 2,
	when: EnterMultiRootWorkspaceSupportContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '3_workspace',
	command: {
		id: DuplicateWorkspaceInNewWindowAction.ID,
		title: localize('duplicateWorkspace', "Duplicate Workspace")
	},
	order: 3,
	when: EnterMultiRootWorkspaceSupportContext
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '6_close',
	command: {
		id: CloseWorkspaceAction.ID,
		title: localize({ key: 'miCloseFolder', comment: ['&& denotes a mnemonic'] }, "Close &&Folder")
	},
	order: 3,
	when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('folder'), EmptyWorkspaceSupportContext)
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '6_close',
	command: {
		id: CloseWorkspaceAction.ID,
		title: localize({ key: 'miCloseWorkspace', comment: ['&& denotes a mnemonic'] }, "Close &&Workspace")
	},
	order: 3,
	when: ContextKeyExpr.and(WorkbenchStateContext.isEqualTo('workspace'), EmptyWorkspaceSupportContext)
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/workspaceCommands.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/workspaceCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import { hasWorkspaceFileExtension, IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceEditingService } from '../../services/workspaces/common/workspaceEditing.js';
import { dirname } from '../../../base/common/resources.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { mnemonicButtonLabel } from '../../../base/common/labels.js';
import { CommandsRegistry, ICommandService } from '../../../platform/commands/common/commands.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { IQuickInputService, IPickOptions, IQuickPickItem } from '../../../platform/quickinput/common/quickInput.js';
import { getIconClasses } from '../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IFileDialogService, IPickAndOpenOptions } from '../../../platform/dialogs/common/dialogs.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { Schemas } from '../../../base/common/network.js';
import { IFileToOpen, IFolderToOpen, IOpenEmptyWindowOptions, IOpenWindowOptions, IWorkspaceToOpen } from '../../../platform/window/common/window.js';
import { IRecent, IWorkspacesService } from '../../../platform/workspaces/common/workspaces.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { ILocalizedString } from '../../../platform/action/common/action.js';

export const ADD_ROOT_FOLDER_COMMAND_ID = 'addRootFolder';
export const ADD_ROOT_FOLDER_LABEL: ILocalizedString = localize2('addFolderToWorkspace', 'Add Folder to Workspace...');

export const SET_ROOT_FOLDER_COMMAND_ID = 'setRootFolder';

export const PICK_WORKSPACE_FOLDER_COMMAND_ID = '_workbench.pickWorkspaceFolder';

// Command registration

CommandsRegistry.registerCommand({
	id: 'workbench.action.files.openFileFolderInNewWindow',
	handler: (accessor: ServicesAccessor) => accessor.get(IFileDialogService).pickFileFolderAndOpen({ forceNewWindow: true })
});

CommandsRegistry.registerCommand({
	id: '_files.pickFolderAndOpen',
	handler: (accessor: ServicesAccessor, options: { forceNewWindow: boolean }) => accessor.get(IFileDialogService).pickFolderAndOpen(options)
});

CommandsRegistry.registerCommand({
	id: 'workbench.action.files.openFolderInNewWindow',
	handler: (accessor: ServicesAccessor) => accessor.get(IFileDialogService).pickFolderAndOpen({ forceNewWindow: true })
});

CommandsRegistry.registerCommand({
	id: 'workbench.action.files.openFileInNewWindow',
	handler: (accessor: ServicesAccessor) => accessor.get(IFileDialogService).pickFileAndOpen({ forceNewWindow: true })
});

CommandsRegistry.registerCommand({
	id: 'workbench.action.openWorkspaceInNewWindow',
	handler: (accessor: ServicesAccessor) => accessor.get(IFileDialogService).pickWorkspaceAndOpen({ forceNewWindow: true })
});

CommandsRegistry.registerCommand({
	id: ADD_ROOT_FOLDER_COMMAND_ID,
	handler: async (accessor) => {
		const workspaceEditingService = accessor.get(IWorkspaceEditingService);

		const folders = await selectWorkspaceFolders(accessor);
		if (!folders?.length) {
			return;
		}

		await workspaceEditingService.addFolders(folders.map(folder => ({ uri: folder })));
	}
});

CommandsRegistry.registerCommand({
	id: SET_ROOT_FOLDER_COMMAND_ID,
	handler: async (accessor) => {
		const workspaceEditingService = accessor.get(IWorkspaceEditingService);
		const contextService = accessor.get(IWorkspaceContextService);

		const folders = await selectWorkspaceFolders(accessor);
		if (!folders?.length) {
			return;
		}

		await workspaceEditingService.updateFolders(0, contextService.getWorkspace().folders.length, folders.map(folder => ({ uri: folder })));
	}
});

async function selectWorkspaceFolders(accessor: ServicesAccessor): Promise<URI[] | undefined> {
	const dialogsService = accessor.get(IFileDialogService);
	const pathService = accessor.get(IPathService);

	const folders = await dialogsService.showOpenDialog({
		openLabel: mnemonicButtonLabel(localize({ key: 'add', comment: ['&& denotes a mnemonic'] }, "&&Add")),
		title: localize('addFolderToWorkspaceTitle', "Add Folder to Workspace"),
		canSelectFolders: true,
		canSelectMany: true,
		defaultUri: await dialogsService.defaultFolderPath(),
		availableFileSystems: [pathService.defaultUriScheme]
	});

	return folders;
}

CommandsRegistry.registerCommand(PICK_WORKSPACE_FOLDER_COMMAND_ID, async function (accessor, args?: [IPickOptions<IQuickPickItem>, CancellationToken]) {
	const quickInputService = accessor.get(IQuickInputService);
	const labelService = accessor.get(ILabelService);
	const contextService = accessor.get(IWorkspaceContextService);
	const modelService = accessor.get(IModelService);
	const languageService = accessor.get(ILanguageService);

	const folders = contextService.getWorkspace().folders;
	if (!folders.length) {
		return;
	}

	const folderPicks: IQuickPickItem[] = folders.map(folder => {
		const label = folder.name;
		const description = labelService.getUriLabel(dirname(folder.uri), { relative: true });

		return {
			label,
			description: description !== label ? description : undefined, // https://github.com/microsoft/vscode/issues/183418
			folder,
			iconClasses: getIconClasses(modelService, languageService, folder.uri, FileKind.ROOT_FOLDER)
		};
	});

	const options: IPickOptions<IQuickPickItem> = (args ? args[0] : undefined) || Object.create(null);

	if (!options.activeItem) {
		options.activeItem = folderPicks[0];
	}

	if (!options.placeHolder) {
		options.placeHolder = localize('workspaceFolderPickerPlaceholder', "Select workspace folder");
	}

	if (typeof options.matchOnDescription !== 'boolean') {
		options.matchOnDescription = true;
	}

	const token: CancellationToken = (args ? args[1] : undefined) || CancellationToken.None;
	const pick = await quickInputService.pick(folderPicks, options, token);
	if (pick) {
		return folders[folderPicks.indexOf(pick)];
	}

	return;
});

// API Command registration

interface IOpenFolderAPICommandOptions {
	forceNewWindow?: boolean;
	forceReuseWindow?: boolean;
	noRecentEntry?: boolean;
	forceLocalWindow?: boolean;
	forceProfile?: string;
	forceTempProfile?: boolean;
	filesToOpen?: UriComponents[];
}

CommandsRegistry.registerCommand({
	id: 'vscode.openFolder',
	handler: (accessor: ServicesAccessor, uriComponents?: UriComponents, arg?: boolean | IOpenFolderAPICommandOptions) => {
		const commandService = accessor.get(ICommandService);

		// Be compatible to previous args by converting to options
		if (typeof arg === 'boolean') {
			arg = { forceNewWindow: arg };
		}

		// Without URI, ask to pick a folder or workspace to open
		if (!uriComponents) {
			const options: IPickAndOpenOptions = {
				forceNewWindow: arg?.forceNewWindow
			};

			if (arg?.forceLocalWindow) {
				options.remoteAuthority = null;
				options.availableFileSystems = ['file'];
			}

			return commandService.executeCommand('_files.pickFolderAndOpen', options);
		}

		const uri = URI.from(uriComponents, true);

		const options: IOpenWindowOptions = {
			forceNewWindow: arg?.forceNewWindow,
			forceReuseWindow: arg?.forceReuseWindow,
			noRecentEntry: arg?.noRecentEntry,
			remoteAuthority: arg?.forceLocalWindow ? null : undefined,
			forceProfile: arg?.forceProfile,
			forceTempProfile: arg?.forceTempProfile,
		};

		const workspaceToOpen: IWorkspaceToOpen | IFolderToOpen = (hasWorkspaceFileExtension(uri) || uri.scheme === Schemas.untitled) ? { workspaceUri: uri } : { folderUri: uri };
		const filesToOpen: IFileToOpen[] = arg?.filesToOpen?.map(file => ({ fileUri: URI.from(file, true) })) ?? [];
		return commandService.executeCommand('_files.windowOpen', [workspaceToOpen, ...filesToOpen], options);
	},
	metadata: {
		description: 'Open a folder or workspace in the current window or new window depending on the newWindow argument. Note that opening in the same window will shutdown the current extension host process and start a new one on the given folder/workspace unless the newWindow parameter is set to true.',
		args: [
			{
				name: 'uri', description: '(optional) Uri of the folder or workspace file to open. If not provided, a native dialog will ask the user for the folder',
				constraint: (value: unknown) => value === undefined || value === null || value instanceof URI
			},
			{
				name: 'options',
				description: '(optional) Options. Object with the following properties: ' +
					'`forceNewWindow`: Whether to open the folder/workspace in a new window or the same. Defaults to opening in the same window. ' +
					'`forceReuseWindow`: Whether to force opening the folder/workspace in the same window.  Defaults to false. ' +
					'`noRecentEntry`: Whether the opened URI will appear in the \'Open Recent\' list. Defaults to false. ' +
					'`forceLocalWindow`: Whether to force opening the folder/workspace in a local window. Defaults to false. ' +
					'`forceProfile`: The profile to use when opening the folder/workspace. Defaults to the current profile. ' +
					'`forceTempProfile`: Whether to use a temporary profile when opening the folder/workspace. Defaults to false. ' +
					'`filesToOpen`: An array of files to open in the new window. Defaults to an empty array. ' +
					'Note, for backward compatibility, options can also be of type boolean, representing the `forceNewWindow` setting.',
				constraint: (value: unknown) => value === undefined || typeof value === 'object' || typeof value === 'boolean'
			}
		]
	}
});

interface INewWindowAPICommandOptions {
	reuseWindow?: boolean;
	/**
	 * If set, defines the remoteAuthority of the new window. `null` will open a local window.
	 * If not set, defaults to remoteAuthority of the current window.
	 */
	remoteAuthority?: string | null;
}

CommandsRegistry.registerCommand({
	id: 'vscode.newWindow',
	handler: (accessor: ServicesAccessor, options?: INewWindowAPICommandOptions) => {
		const commandService = accessor.get(ICommandService);

		const commandOptions: IOpenEmptyWindowOptions = {
			forceReuseWindow: options?.reuseWindow,
			remoteAuthority: options?.remoteAuthority
		};

		return commandService.executeCommand('_files.newWindow', commandOptions);
	},
	metadata: {
		description: 'Opens an new window depending on the newWindow argument.',
		args: [
			{
				name: 'options',
				description: '(optional) Options. Object with the following properties: ' +
					'`reuseWindow`: Whether to open a new window or the same. Defaults to opening in a new window. ',
				constraint: (value: unknown) => value === undefined || typeof value === 'object'
			}
		]
	}
});

// recent history commands

CommandsRegistry.registerCommand('_workbench.removeFromRecentlyOpened', function (accessor: ServicesAccessor, uri: URI) {
	const workspacesService = accessor.get(IWorkspacesService);
	return workspacesService.removeRecentlyOpened([uri]);
});

CommandsRegistry.registerCommand({
	id: 'vscode.removeFromRecentlyOpened',
	handler: (accessor: ServicesAccessor, path: string | URI): Promise<void> => {
		const workspacesService = accessor.get(IWorkspacesService);

		if (typeof path === 'string') {
			path = path.match(/^[^:/?#]+:\/\//) ? URI.parse(path) : URI.file(path);
		} else {
			path = URI.revive(path); // called from extension host
		}

		return workspacesService.removeRecentlyOpened([path]);
	},
	metadata: {
		description: 'Removes an entry with the given path from the recently opened list.',
		args: [
			{ name: 'path', description: 'URI or URI string to remove from recently opened.', constraint: (value: unknown) => typeof value === 'string' || value instanceof URI }
		]
	}
});

interface RecentEntry {
	uri: URI;
	type: 'workspace' | 'folder' | 'file';
	label?: string;
	remoteAuthority?: string;
}

CommandsRegistry.registerCommand('_workbench.addToRecentlyOpened', async function (accessor: ServicesAccessor, recentEntry: RecentEntry) {
	const workspacesService = accessor.get(IWorkspacesService);
	const uri = recentEntry.uri;
	const label = recentEntry.label;
	const remoteAuthority = recentEntry.remoteAuthority;

	let recent: IRecent | undefined = undefined;
	if (recentEntry.type === 'workspace') {
		const workspace = await workspacesService.getWorkspaceIdentifier(uri);
		recent = { workspace, label, remoteAuthority };
	} else if (recentEntry.type === 'folder') {
		recent = { folderUri: uri, label, remoteAuthority };
	} else {
		recent = { fileUri: uri, label, remoteAuthority };
	}

	return workspacesService.addRecentlyOpened([recent]);
});

CommandsRegistry.registerCommand('_workbench.getRecentlyOpened', async function (accessor: ServicesAccessor) {
	const workspacesService = accessor.get(IWorkspacesService);

	return workspacesService.getRecentlyOpened();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/media/actions.css]---
Location: vscode-main/src/vs/workbench/browser/actions/media/actions.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.dirty-workspace::before,
.monaco-workbench .quick-input-list .quick-input-list-entry.has-actions:hover .quick-input-list-entry-action-bar .action-label.opened-workspace::before {
	/* Close icon flips between black dot and "X" some entries in the recently opened picker */
	content: var(--vscode-icon-x-content);
	font-family: var(--vscode-icon-x-font-family);
}

.monaco-workbench .screencast-mouse {
	position: absolute;
	border-width: 2px;
	border-style: solid;
	border-radius: 50%;
	z-index: 100000;
	content: ' ';
	pointer-events: none;
	display: none;
}

.monaco-workbench .screencast-keyboard {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.5);
	width: 100%;
	left: 0;
	z-index: 100000;
	pointer-events: none;
	color: #eee;
	line-height: 1.75em;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench.monaco-enable-motion .screencast-keyboard {
	transition: opacity 0.3s ease-out;
}

.monaco-workbench .screencast-keyboard:empty {
	opacity: 0;
}

.monaco-workbench .screencast-keyboard > .key {
	padding: 0 8px;
	box-shadow: inset 0 -3px 0 hsla(0, 0%, 73%, .4);
	margin-right: 6px;
	border: 1px solid hsla(0, 0%, 80%, .4);
	border-radius: 5px;
	background-color: rgba(255, 255, 255, 0.05);
}

.monaco-workbench .screencast-keyboard > .title {
	font-weight: 600;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/media/code-icon.svg]---
Location: vscode-main/src/vs/workbench/browser/media/code-icon.svg

```text
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>.st0{fill:#f6f6f6;fill-opacity:0}.st1{fill:#fff}.st2{fill:#167abf}</style><path class="st0" d="M1024 1024H0V0h1024v1024z"/><path class="st1" d="M1024 85.333v853.333H0V85.333h1024z"/><path class="st2" d="M0 85.333h298.667v853.333H0V85.333zm1024 0v853.333H384V85.333h640zm-554.667 160h341.333v-64H469.333v64zm341.334 533.334H469.333v64h341.333l.001-64zm128-149.334H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64z"/></svg>
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/media/part.css]---
Location: vscode-main/src/vs/workbench/browser/media/part.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .part {
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .part > .drop-block-overlay.visible {
	visibility: visible;
}

.monaco-workbench .part > .drop-block-overlay {
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	visibility: hidden;
	opacity: 0;
	z-index: 12;
}

.monaco-workbench .part > .title,
.monaco-workbench .part > .header-or-footer {
	display: none; /* Parts have to opt in to show area */
}

.monaco-workbench .part > .title,
.monaco-workbench .part > .header-or-footer {
	height: 35px;
	display: flex;
	box-sizing: border-box;
	overflow: hidden;
}

.monaco-workbench .part > .title {
	padding-left: 8px;
	padding-right: 8px;
}

.monaco-workbench .part > .title > .title-label {
	line-height: 35px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.monaco-workbench .part > .title > .title-label {
	padding-left: 12px;
}

.monaco-workbench .part > .title > .title-label h2 {
	font-size: 11px;
	cursor: default;
	font-weight: normal;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.monaco-workbench .part > .title > .title-label a {
	text-decoration: none;
	font-size: 13px;
	cursor: default;
}

.monaco-workbench .part > .title > .title-actions {
	height: 35px;
	flex: 1;
	padding-left: 5px;
}

.monaco-workbench .part > .title > .title-actions .action-label {
	display: block;
	background-size: 16px;
	background-position: center center;
	background-repeat: no-repeat;
}

.monaco-workbench .part > .title > .title-actions .action-label .label {
	display: none;
}

.monaco-workbench .part > .content {
	font-size: 13px;
}

.monaco-workbench .part > .content > .monaco-progress-container,
.monaco-workbench .part.editor > .content .editor-group-container > .monaco-progress-container {
	position: absolute;
	left: 0;
	top: 33px; /* at the bottom of the 35px height title container */
	z-index: 5; /* on top of things */
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/media/style.css]---
Location: vscode-main/src/vs/workbench/browser/media/style.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Animations */

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Font Families (with CJK support) */

.monaco-workbench.mac { font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
.monaco-workbench.mac:lang(zh-Hans) { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", sans-serif; }
.monaco-workbench.mac:lang(zh-Hant) { font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif; }
.monaco-workbench.mac:lang(ja) { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic Pro", sans-serif; }
.monaco-workbench.mac:lang(ko) { font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Nanum Gothic", "AppleGothic", sans-serif; }

.monaco-workbench.windows { font-family: "Segoe WPC", "Segoe UI", sans-serif; }
.monaco-workbench.windows:lang(zh-Hans) { font-family: "Segoe WPC", "Segoe UI", "Microsoft YaHei", sans-serif; }
.monaco-workbench.windows:lang(zh-Hant) { font-family: "Segoe WPC", "Segoe UI", "Microsoft Jhenghei", sans-serif; }
.monaco-workbench.windows:lang(ja) { font-family: "Segoe WPC", "Segoe UI", "Yu Gothic UI", "Meiryo UI", sans-serif; }
.monaco-workbench.windows:lang(ko) { font-family: "Segoe WPC", "Segoe UI", "Malgun Gothic", "Dotom", sans-serif; }

/* Linux: add `system-ui` as first font and not `Ubuntu` to allow other distribution pick their standard OS font */
.monaco-workbench.linux { font-family: system-ui, "Ubuntu", "Droid Sans", sans-serif; }
.monaco-workbench.linux:lang(zh-Hans) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans SC", "Source Han Sans CN", "Source Han Sans", sans-serif; }
.monaco-workbench.linux:lang(zh-Hant) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans TC", "Source Han Sans TW", "Source Han Sans", sans-serif; }
.monaco-workbench.linux:lang(ja) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans J", "Source Han Sans JP", "Source Han Sans", sans-serif; }
.monaco-workbench.linux:lang(ko) { font-family: system-ui, "Ubuntu", "Droid Sans", "Source Han Sans K", "Source Han Sans JR", "Source Han Sans", "UnDotum", "FBaekmuk Gulim", sans-serif; }

.monaco-workbench.mac { --monaco-monospace-font: "SF Mono", Monaco, Menlo, Courier, monospace; }
.monaco-workbench.windows { --monaco-monospace-font: Consolas, "Courier New", monospace; }
.monaco-workbench.linux { --monaco-monospace-font: "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace; }

/* Global Styles */

body {
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
	font-size: 11px;
	user-select: none;
	-webkit-user-select: none;
}

.monaco-workbench {
	font-size: 13px;
	line-height: 1.4em;
	position: relative;
	inset: 0;
	z-index: 1;
	overflow: hidden;
	color: var(--vscode-foreground);
}

.monaco-workbench.web {
	touch-action: none; /* Disable browser handling of all panning and zooming gestures. Removes 300ms touch delay. */
	overscroll-behavior: none; /* Prevent bounce effect */
}

.monaco-workbench.border:not(.fullscreen) {
	box-sizing: border-box;
	border: 1px solid var(--window-border-color);
}

.monaco-workbench.border.mac {
	border-radius: 10px;
}

.monaco-workbench.border.mac.macos-tahoe {
	border-radius: 16px; /* macOS Tahoe increased rounded corners size */
}

.monaco-workbench img {
	border: 0;
}

.monaco-workbench label {
	cursor: pointer;
}

.monaco-workbench a {
	text-decoration: none;
}


.monaco-workbench p > a {
	text-decoration: var(--text-link-decoration);
}

.monaco-workbench.underline-links {
	--text-link-decoration: underline;
}

.monaco-workbench.hc-black p > a,
.monaco-workbench.hc-light p > a {
	text-decoration: underline !important;
}

.monaco-workbench a:active {
	color: inherit;
	background-color: inherit;
}

.monaco-workbench a.plain {
	color: inherit;
	text-decoration: none;
}

.monaco-workbench a.plain:hover,
.monaco-workbench a.plain.hover {
	color: inherit;
	text-decoration: none;
}

.monaco-workbench input {
	color: inherit;
	font-family: inherit;
	font-size: 100%;
}

.monaco-workbench table {
	/*
	 * Somehow this is required when tables show in floating windows
	 * to override the user-agent style which sets a specific color
	 * and font-size
	 */
	color: inherit;
	font-size: inherit;
}

.monaco-workbench input::placeholder { color: var(--vscode-input-placeholderForeground); }
.monaco-workbench input::-webkit-input-placeholder  { color: var(--vscode-input-placeholderForeground); }
.monaco-workbench input::-moz-placeholder { color: var(--vscode-input-placeholderForeground); }

.monaco-workbench textarea::placeholder { color: var(--vscode-input-placeholderForeground); }
.monaco-workbench textarea::-webkit-input-placeholder { color: var(--vscode-input-placeholderForeground); }
.monaco-workbench textarea::-moz-placeholder { color: var(--vscode-input-placeholderForeground); }

.monaco-workbench .pointer {
	cursor: pointer;
}

.monaco-workbench.mac.monaco-font-aliasing-antialiased {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.monaco-workbench.mac.monaco-font-aliasing-none {
	-webkit-font-smoothing: none;
	-moz-osx-font-smoothing: unset;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
	.monaco-workbench.mac.monaco-font-aliasing-auto {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
}

.monaco-workbench .context-view {
	-webkit-app-region: no-drag;
}

.monaco-workbench .codicon {
	color: var(--vscode-icon-foreground);
}

.monaco-workbench .codicon[class*='codicon-'] {
	font-size: 16px; /* sets font-size for codicons in workbench (https://github.com/microsoft/vscode/issues/98495) */
}

.monaco-workbench .predefined-file-icon[class*='codicon-']::before {
	width: 16px;
	padding-left: 3px; /* width (16px) - font-size (13px) = padding-left (3px) */
	padding-right: 3px;
}

.predefined-file-icon::before { /* do add additional specificity to this selector, so it can be overridden by product themes */
	font-family: 'codicon';
}

.monaco-workbench:not(.file-icons-enabled) .predefined-file-icon[class*='codicon-']::before {
	content: unset !important;
}

.monaco-workbench.modal-dialog-visible .monaco-progress-container.infinite .progress-bit {
	display: none; /* stop progress animations when dialogs are visible (https://github.com/microsoft/vscode/issues/138396) */
}

/* Custom Dropdown (select) Arrows */

.monaco-workbench select {
	font-family: inherit;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	/* Hides inner border from FF */
	border: 1px solid;
}

.monaco-workbench .select-container {
	position: relative;
}

.monaco-workbench .select-container:after {
	content: var(--vscode-icon-chevron-down-content);
	font-family: var(--vscode-icon-chevron-down-font-family);
	font-size: 16px;
	width: 16px;
	height: 16px;
	line-height: 16px;
	position: absolute;
	top: 0;
	bottom: 0;
	right: 4px;
	margin: auto;
	pointer-events: none;
}

/* Keyboard Focus Indication Styles */

.monaco-workbench [tabindex="0"]:focus,
.monaco-workbench [tabindex="-1"]:focus,
.monaco-workbench .synthetic-focus,
.monaco-workbench select:focus,
.monaco-workbench input[type="button"]:focus,
.monaco-workbench input[type="text"]:focus,
.monaco-workbench button:focus,
.monaco-workbench textarea:focus,
.monaco-workbench input[type="search"]:focus,
.monaco-workbench input[type="checkbox"]:focus {
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
	opacity: 1;
}

.monaco-workbench.hc-black .synthetic-focus input,
.monaco-workbench.hc-light .synthetic-focus input {
	background: transparent; /* Search input focus fix when in high contrast */
}

.monaco-workbench input[type="checkbox"]:focus {
	outline-offset: 2px;
}

.monaco-workbench [tabindex="0"]:active,
.monaco-workbench [tabindex="-1"]:active,
.monaco-workbench select:active,
.monaco-workbench input[type="button"]:active,
.monaco-workbench input[type="checkbox"]:active {
	outline: 0 !important; /* fixes some flashing outlines from showing up when clicking */
}

.monaco-workbench.mac select:focus {
	border-color: transparent; /* outline is a square, but border has a radius, so we avoid this glitch when focused (https://github.com/microsoft/vscode/issues/26045) */
}

.monaco-workbench .monaco-list:not(.element-focused):not(:active):focus:before {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 15; /* make sure we are on top of the tree sticky scroll widget */
	content: "";
	pointer-events: none; /* enable click through */
	outline: 1px solid; /* we still need to handle the empty tree or no focus item case */
	outline-width: 1px;
	outline-style: solid;
	outline-offset: -1px;
	outline-color: var(--vscode-focusBorder);
}

.monaco-workbench .monaco-list:not(:focus) .monaco-list-row.focused .monaco-highlighted-label .highlight,
.monaco-workbench .monaco-list .monaco-list-row .monaco-highlighted-label .highlight {
	color: var(--vscode-list-highlightForeground);
}

.monaco-workbench .monaco-list .monaco-list-row.focused .monaco-highlighted-label .highlight {
	color: var(--vscode-list-focusHighlightForeground);
}

.monaco-workbench .synthetic-focus :focus {
	outline: 0 !important; /* elements within widgets that draw synthetic-focus should never show focus */
}

.monaco-workbench .monaco-inputbox.info.synthetic-focus,
.monaco-workbench .monaco-inputbox.warning.synthetic-focus,
.monaco-workbench .monaco-inputbox.error.synthetic-focus,
.monaco-workbench .monaco-inputbox.info input[type="text"]:focus,
.monaco-workbench .monaco-inputbox.warning input[type="text"]:focus,
.monaco-workbench .monaco-inputbox.error input[type="text"]:focus {
	outline: 0 !important; /* outline is not going well with decoration */
}

.monaco-workbench .monaco-list:focus {
	outline: 0 !important; /* tree indicates focus not via outline but through the focused item */
}

.monaco-workbench a.monaco-link:hover {
	text-decoration: underline; /* render underline on hover for accessibility requirements */
}

.monaco-workbench .monaco-action-bar:not(.vertical) .action-label:not(.disabled):hover,
.monaco-workbench .monaco-action-bar:not(.vertical) .monaco-dropdown-with-primary:not(.disabled):hover {
	background-color: var(--vscode-toolbar-hoverBackground);
}

.monaco-workbench .monaco-action-bar:not(.vertical) .action-item.active .action-label:not(.disabled),
.monaco-workbench .monaco-action-bar:not(.vertical) .monaco-dropdown.active .action-label:not(.disabled) {
	background-color: var(--vscode-toolbar-activeBackground);
}

.monaco-workbench .monaco-action-bar:not(.vertical) .action-item .action-label:hover:not(.disabled) {
	outline: 1px dashed var(--vscode-toolbar-hoverOutline);
	outline-offset: -1px;
}
```

--------------------------------------------------------------------------------

````

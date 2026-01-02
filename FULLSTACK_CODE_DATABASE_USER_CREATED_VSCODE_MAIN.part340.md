---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 340
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 340 of 552)

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

---[FILE: src/vs/workbench/common/theme.ts]---
Location: vscode-main/src/vs/workbench/common/theme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { registerColor, editorBackground, contrastBorder, transparent, editorWidgetBackground, textLinkForeground, lighten, darken, focusBorder, activeContrastBorder, editorWidgetForeground, editorErrorForeground, editorWarningForeground, editorInfoForeground, treeIndentGuidesStroke, errorForeground, listActiveSelectionBackground, listActiveSelectionForeground, editorForeground, toolbarHoverBackground, inputBorder, widgetBorder, scrollbarShadow } from '../../platform/theme/common/colorRegistry.js';
import { IColorTheme } from '../../platform/theme/common/themeService.js';
import { Color } from '../../base/common/color.js';
import { ColorScheme } from '../../platform/theme/common/theme.js';

// < --- Workbench (not customizable) --- >

export function WORKBENCH_BACKGROUND(theme: IColorTheme): Color {
	switch (theme.type) {
		case ColorScheme.LIGHT:
			return Color.fromHex('#F3F3F3');
		case ColorScheme.HIGH_CONTRAST_LIGHT:
			return Color.fromHex('#FFFFFF');
		case ColorScheme.HIGH_CONTRAST_DARK:
			return Color.fromHex('#000000');
		default:
			return Color.fromHex('#252526');
	}
}

// < --- Tabs --- >

//#region Tab Background

export const TAB_ACTIVE_BACKGROUND = registerColor('tab.activeBackground', editorBackground, localize('tabActiveBackground', "Active tab background color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_ACTIVE_BACKGROUND = registerColor('tab.unfocusedActiveBackground', TAB_ACTIVE_BACKGROUND, localize('tabUnfocusedActiveBackground', "Active tab background color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_INACTIVE_BACKGROUND = registerColor('tab.inactiveBackground', {
	dark: '#2D2D2D',
	light: '#ECECEC',
	hcDark: null,
	hcLight: null,
}, localize('tabInactiveBackground', "Inactive tab background color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_INACTIVE_BACKGROUND = registerColor('tab.unfocusedInactiveBackground', TAB_INACTIVE_BACKGROUND, localize('tabUnfocusedInactiveBackground', "Inactive tab background color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

//#region Tab Foreground

export const TAB_ACTIVE_FOREGROUND = registerColor('tab.activeForeground', {
	dark: Color.white,
	light: '#333333',
	hcDark: Color.white,
	hcLight: '#292929'
}, localize('tabActiveForeground', "Active tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_INACTIVE_FOREGROUND = registerColor('tab.inactiveForeground', {
	dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
	light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
	hcDark: Color.white,
	hcLight: '#292929'
}, localize('tabInactiveForeground', "Inactive tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_ACTIVE_FOREGROUND = registerColor('tab.unfocusedActiveForeground', {
	dark: transparent(TAB_ACTIVE_FOREGROUND, 0.5),
	light: transparent(TAB_ACTIVE_FOREGROUND, 0.7),
	hcDark: Color.white,
	hcLight: '#292929'
}, localize('tabUnfocusedActiveForeground', "Active tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_INACTIVE_FOREGROUND = registerColor('tab.unfocusedInactiveForeground', {
	dark: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
	light: transparent(TAB_INACTIVE_FOREGROUND, 0.5),
	hcDark: Color.white,
	hcLight: '#292929'
}, localize('tabUnfocusedInactiveForeground', "Inactive tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

//#region Tab Hover Foreground/Background

export const TAB_HOVER_BACKGROUND = registerColor('tab.hoverBackground', null, localize('tabHoverBackground', "Tab background color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_HOVER_BACKGROUND = registerColor('tab.unfocusedHoverBackground', {
	dark: transparent(TAB_HOVER_BACKGROUND, 0.5),
	light: transparent(TAB_HOVER_BACKGROUND, 0.7),
	hcDark: null,
	hcLight: null
}, localize('tabUnfocusedHoverBackground', "Tab background color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_HOVER_FOREGROUND = registerColor('tab.hoverForeground', null, localize('tabHoverForeground', "Tab foreground color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_HOVER_FOREGROUND = registerColor('tab.unfocusedHoverForeground', {
	dark: transparent(TAB_HOVER_FOREGROUND, 0.5),
	light: transparent(TAB_HOVER_FOREGROUND, 0.5),
	hcDark: null,
	hcLight: null
}, localize('tabUnfocusedHoverForeground', "Tab foreground color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

//#region Tab Borders

export const TAB_BORDER = registerColor('tab.border', {
	dark: '#252526',
	light: '#F3F3F3',
	hcDark: contrastBorder,
	hcLight: contrastBorder,
}, localize('tabBorder', "Border to separate tabs from each other. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_LAST_PINNED_BORDER = registerColor('tab.lastPinnedBorder', {
	dark: treeIndentGuidesStroke,
	light: treeIndentGuidesStroke,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('lastPinnedTabBorder', "Border to separate pinned tabs from other tabs. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_ACTIVE_BORDER = registerColor('tab.activeBorder', null, localize('tabActiveBorder', "Border on the bottom of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_ACTIVE_BORDER = registerColor('tab.unfocusedActiveBorder', {
	dark: transparent(TAB_ACTIVE_BORDER, 0.5),
	light: transparent(TAB_ACTIVE_BORDER, 0.7),
	hcDark: null,
	hcLight: null
}, localize('tabActiveUnfocusedBorder', "Border on the bottom of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_ACTIVE_BORDER_TOP = registerColor('tab.activeBorderTop', {
	dark: null,
	light: null,
	hcDark: null,
	hcLight: '#B5200D'
}, localize('tabActiveBorderTop', "Border to the top of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_ACTIVE_BORDER_TOP = registerColor('tab.unfocusedActiveBorderTop', {
	dark: transparent(TAB_ACTIVE_BORDER_TOP, 0.5),
	light: transparent(TAB_ACTIVE_BORDER_TOP, 0.7),
	hcDark: null,
	hcLight: '#B5200D'
}, localize('tabActiveUnfocusedBorderTop', "Border to the top of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_SELECTED_BORDER_TOP = registerColor('tab.selectedBorderTop', TAB_ACTIVE_BORDER_TOP, localize('tabSelectedBorderTop', "Border to the top of a selected tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_SELECTED_BACKGROUND = registerColor('tab.selectedBackground', TAB_ACTIVE_BACKGROUND, localize('tabSelectedBackground', "Background of a selected tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_SELECTED_FOREGROUND = registerColor('tab.selectedForeground', TAB_ACTIVE_FOREGROUND, localize('tabSelectedForeground', "Foreground of a selected tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));


export const TAB_HOVER_BORDER = registerColor('tab.hoverBorder', null, localize('tabHoverBorder', "Border to highlight tabs when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_HOVER_BORDER = registerColor('tab.unfocusedHoverBorder', {
	dark: transparent(TAB_HOVER_BORDER, 0.5),
	light: transparent(TAB_HOVER_BORDER, 0.7),
	hcDark: null,
	hcLight: contrastBorder
}, localize('tabUnfocusedHoverBorder', "Border to highlight tabs in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

//#region Tab Drag and Drop Border

export const TAB_DRAG_AND_DROP_BORDER = registerColor('tab.dragAndDropBorder', {
	dark: TAB_ACTIVE_FOREGROUND,
	light: TAB_ACTIVE_FOREGROUND,
	hcDark: activeContrastBorder,
	hcLight: activeContrastBorder
}, localize('tabDragAndDropBorder', "Border between tabs to indicate that a tab can be inserted between two tabs. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

//#region Tab Modified Border

export const TAB_ACTIVE_MODIFIED_BORDER = registerColor('tab.activeModifiedBorder', {
	dark: '#3399CC',
	light: '#33AAEE',
	hcDark: null,
	hcLight: contrastBorder
}, localize('tabActiveModifiedBorder', "Border on the top of modified active tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_INACTIVE_MODIFIED_BORDER = registerColor('tab.inactiveModifiedBorder', {
	dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
	light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
	hcDark: Color.white,
	hcLight: contrastBorder
}, localize('tabInactiveModifiedBorder', "Border on the top of modified inactive tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_ACTIVE_MODIFIED_BORDER = registerColor('tab.unfocusedActiveModifiedBorder', {
	dark: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.5),
	light: transparent(TAB_ACTIVE_MODIFIED_BORDER, 0.7),
	hcDark: Color.white,
	hcLight: contrastBorder
}, localize('unfocusedActiveModifiedBorder', "Border on the top of modified active tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

export const TAB_UNFOCUSED_INACTIVE_MODIFIED_BORDER = registerColor('tab.unfocusedInactiveModifiedBorder', {
	dark: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
	light: transparent(TAB_INACTIVE_MODIFIED_BORDER, 0.5),
	hcDark: Color.white,
	hcLight: contrastBorder
}, localize('unfocusedINactiveModifiedBorder', "Border on the top of modified inactive tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups."));

//#endregion

// < --- Editors --- >

export const EDITOR_PANE_BACKGROUND = registerColor('editorPane.background', editorBackground, localize('editorPaneBackground', "Background color of the editor pane visible on the left and right side of the centered editor layout."));

export const EDITOR_GROUP_EMPTY_BACKGROUND = registerColor('editorGroup.emptyBackground', null, localize('editorGroupEmptyBackground', "Background color of an empty editor group. Editor groups are the containers of editors."));

export const EDITOR_GROUP_FOCUSED_EMPTY_BORDER = registerColor('editorGroup.focusedEmptyBorder', {
	dark: null,
	light: null,
	hcDark: focusBorder,
	hcLight: focusBorder
}, localize('editorGroupFocusedEmptyBorder', "Border color of an empty editor group that is focused. Editor groups are the containers of editors."));

export const EDITOR_GROUP_HEADER_TABS_BACKGROUND = registerColor('editorGroupHeader.tabsBackground', {
	dark: '#252526',
	light: '#F3F3F3',
	hcDark: null,
	hcLight: null
}, localize('tabsContainerBackground', "Background color of the editor group title header when tabs are enabled. Editor groups are the containers of editors."));

export const EDITOR_GROUP_HEADER_TABS_BORDER = registerColor('editorGroupHeader.tabsBorder', null, localize('tabsContainerBorder', "Border color of the editor group title header when tabs are enabled. Editor groups are the containers of editors."));

export const EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND = registerColor('editorGroupHeader.noTabsBackground', editorBackground, localize('editorGroupHeaderBackground', "Background color of the editor group title header when (`\"workbench.editor.showTabs\": \"single\"`). Editor groups are the containers of editors."));

export const EDITOR_GROUP_HEADER_BORDER = registerColor('editorGroupHeader.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('editorTitleContainerBorder', "Border color of the editor group title header. Editor groups are the containers of editors."));

export const EDITOR_GROUP_BORDER = registerColor('editorGroup.border', {
	dark: '#444444',
	light: '#E7E7E7',
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('editorGroupBorder', "Color to separate multiple editor groups from each other. Editor groups are the containers of editors."));

export const EDITOR_DRAG_AND_DROP_BACKGROUND = registerColor('editorGroup.dropBackground', {
	dark: Color.fromHex('#53595D').transparent(0.5),
	light: Color.fromHex('#2677CB').transparent(0.18),
	hcDark: null,
	hcLight: Color.fromHex('#0F4A85').transparent(0.50)
}, localize('editorDragAndDropBackground', "Background color when dragging editors around. The color should have transparency so that the editor contents can still shine through."));

export const EDITOR_DROP_INTO_PROMPT_FOREGROUND = registerColor('editorGroup.dropIntoPromptForeground', editorWidgetForeground, localize('editorDropIntoPromptForeground', "Foreground color of text shown over editors when dragging files. This text informs the user that they can hold shift to drop into the editor."));

export const EDITOR_DROP_INTO_PROMPT_BACKGROUND = registerColor('editorGroup.dropIntoPromptBackground', editorWidgetBackground, localize('editorDropIntoPromptBackground', "Background color of text shown over editors when dragging files. This text informs the user that they can hold shift to drop into the editor."));

export const EDITOR_DROP_INTO_PROMPT_BORDER = registerColor('editorGroup.dropIntoPromptBorder', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('editorDropIntoPromptBorder', "Border color of text shown over editors when dragging files. This text informs the user that they can hold shift to drop into the editor."));

export const SIDE_BY_SIDE_EDITOR_HORIZONTAL_BORDER = registerColor('sideBySideEditor.horizontalBorder', EDITOR_GROUP_BORDER, localize('sideBySideEditor.horizontalBorder', "Color to separate two editors from each other when shown side by side in an editor group from top to bottom."));

export const SIDE_BY_SIDE_EDITOR_VERTICAL_BORDER = registerColor('sideBySideEditor.verticalBorder', EDITOR_GROUP_BORDER, localize('sideBySideEditor.verticalBorder', "Color to separate two editors from each other when shown side by side in an editor group from left to right."));


// < --- Output Editor -->

const OUTPUT_VIEW_BACKGROUND = registerColor('outputView.background', null, localize('outputViewBackground', "Output view background color."));


registerColor('outputViewStickyScroll.background', OUTPUT_VIEW_BACKGROUND, localize('outputViewStickyScrollBackground', "Output view sticky scroll background color."));


// < --- Banner --- >

export const BANNER_BACKGROUND = registerColor('banner.background', {
	dark: listActiveSelectionBackground,
	light: darken(listActiveSelectionBackground, 0.3),
	hcDark: listActiveSelectionBackground,
	hcLight: listActiveSelectionBackground
}, localize('banner.background', "Banner background color. The banner is shown under the title bar of the window."));

export const BANNER_FOREGROUND = registerColor('banner.foreground', listActiveSelectionForeground, localize('banner.foreground', "Banner foreground color. The banner is shown under the title bar of the window."));

export const BANNER_ICON_FOREGROUND = registerColor('banner.iconForeground', editorInfoForeground, localize('banner.iconForeground', "Banner icon color. The banner is shown under the title bar of the window."));

// < --- Status --- >

export const STATUS_BAR_FOREGROUND = registerColor('statusBar.foreground', {
	dark: '#FFFFFF',
	light: '#FFFFFF',
	hcDark: '#FFFFFF',
	hcLight: editorForeground
}, localize('statusBarForeground', "Status bar foreground color when a workspace or folder is opened. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_NO_FOLDER_FOREGROUND = registerColor('statusBar.noFolderForeground', STATUS_BAR_FOREGROUND, localize('statusBarNoFolderForeground', "Status bar foreground color when no folder is opened. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_BACKGROUND = registerColor('statusBar.background', {
	dark: '#007ACC',
	light: '#007ACC',
	hcDark: null,
	hcLight: null,
}, localize('statusBarBackground', "Status bar background color when a workspace or folder is opened. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_NO_FOLDER_BACKGROUND = registerColor('statusBar.noFolderBackground', {
	dark: '#68217A',
	light: '#68217A',
	hcDark: null,
	hcLight: null,
}, localize('statusBarNoFolderBackground', "Status bar background color when no folder is opened. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_BORDER = registerColor('statusBar.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('statusBarBorder', "Status bar border color separating to the sidebar and editor. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_FOCUS_BORDER = registerColor('statusBar.focusBorder', {
	dark: STATUS_BAR_FOREGROUND,
	light: STATUS_BAR_FOREGROUND,
	hcDark: null,
	hcLight: STATUS_BAR_FOREGROUND
}, localize('statusBarFocusBorder', "Status bar border color when focused on keyboard navigation. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_NO_FOLDER_BORDER = registerColor('statusBar.noFolderBorder', STATUS_BAR_BORDER, localize('statusBarNoFolderBorder', "Status bar border color separating to the sidebar and editor when no folder is opened. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ITEM_ACTIVE_BACKGROUND = registerColor('statusBarItem.activeBackground', {
	dark: Color.white.transparent(0.18),
	light: Color.white.transparent(0.18),
	hcDark: Color.white.transparent(0.18),
	hcLight: Color.black.transparent(0.18)
}, localize('statusBarItemActiveBackground', "Status bar item background color when clicking. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ITEM_FOCUS_BORDER = registerColor('statusBarItem.focusBorder', {
	dark: STATUS_BAR_FOREGROUND,
	light: STATUS_BAR_FOREGROUND,
	hcDark: null,
	hcLight: activeContrastBorder
}, localize('statusBarItemFocusBorder', "Status bar item border color when focused on keyboard navigation. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.hoverBackground', {
	dark: Color.white.transparent(0.12),
	light: Color.black.transparent(0.12),
	hcDark: Color.black,
	hcLight: Color.white
}, localize('statusBarItemHoverBackground', "Status bar item background color when hovering. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.hoverForeground', STATUS_BAR_FOREGROUND, localize('statusBarItemHoverForeground', "Status bar item foreground color when hovering. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ITEM_COMPACT_HOVER_BACKGROUND = registerColor('statusBarItem.compactHoverBackground', {
	dark: Color.white.transparent(0.12),
	light: Color.black.transparent(0.12),
	hcDark: Color.black,
	hcLight: Color.white
}, localize('statusBarItemCompactHoverBackground', "Status bar item background color when hovering an item that contains two hovers. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_PROMINENT_ITEM_FOREGROUND = registerColor('statusBarItem.prominentForeground', STATUS_BAR_FOREGROUND, localize('statusBarProminentItemForeground', "Status bar prominent items foreground color. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_PROMINENT_ITEM_BACKGROUND = registerColor('statusBarItem.prominentBackground', Color.black.transparent(0.5), localize('statusBarProminentItemBackground', "Status bar prominent items background color. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_PROMINENT_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.prominentHoverForeground', STATUS_BAR_ITEM_HOVER_FOREGROUND, localize('statusBarProminentItemHoverForeground', "Status bar prominent items foreground color when hovering. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_PROMINENT_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.prominentHoverBackground', STATUS_BAR_ITEM_HOVER_BACKGROUND, localize('statusBarProminentItemHoverBackground', "Status bar prominent items background color when hovering. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ERROR_ITEM_BACKGROUND = registerColor('statusBarItem.errorBackground', {
	dark: darken(errorForeground, .4),
	light: darken(errorForeground, .4),
	hcDark: null,
	hcLight: '#B5200D'
}, localize('statusBarErrorItemBackground', "Status bar error items background color. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ERROR_ITEM_FOREGROUND = registerColor('statusBarItem.errorForeground', Color.white, localize('statusBarErrorItemForeground', "Status bar error items foreground color. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ERROR_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.errorHoverForeground', STATUS_BAR_ITEM_HOVER_FOREGROUND, localize('statusBarErrorItemHoverForeground', "Status bar error items foreground color when hovering. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_ERROR_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.errorHoverBackground', STATUS_BAR_ITEM_HOVER_BACKGROUND, localize('statusBarErrorItemHoverBackground', "Status bar error items background color when hovering. Error items stand out from other status bar entries to indicate error conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_WARNING_ITEM_BACKGROUND = registerColor('statusBarItem.warningBackground', {
	dark: darken(editorWarningForeground, .4),
	light: darken(editorWarningForeground, .4),
	hcDark: null,
	hcLight: '#895503'
}, localize('statusBarWarningItemBackground', "Status bar warning items background color. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_WARNING_ITEM_FOREGROUND = registerColor('statusBarItem.warningForeground', Color.white, localize('statusBarWarningItemForeground', "Status bar warning items foreground color. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_WARNING_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.warningHoverForeground', STATUS_BAR_ITEM_HOVER_FOREGROUND, localize('statusBarWarningItemHoverForeground', "Status bar warning items foreground color when hovering. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window."));

export const STATUS_BAR_WARNING_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.warningHoverBackground', STATUS_BAR_ITEM_HOVER_BACKGROUND, localize('statusBarWarningItemHoverBackground', "Status bar warning items background color when hovering. Warning items stand out from other status bar entries to indicate warning conditions. The status bar is shown in the bottom of the window."));


// < --- Activity Bar --- >

export const ACTIVITY_BAR_BACKGROUND = registerColor('activityBar.background', {
	dark: '#333333',
	light: '#2C2C2C',
	hcDark: '#000000',
	hcLight: '#FFFFFF'
}, localize('activityBarBackground', "Activity bar background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_FOREGROUND = registerColor('activityBar.foreground', {
	dark: Color.white,
	light: Color.white,
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('activityBarForeground', "Activity bar item foreground color when it is active. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_INACTIVE_FOREGROUND = registerColor('activityBar.inactiveForeground', {
	dark: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
	light: transparent(ACTIVITY_BAR_FOREGROUND, 0.4),
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('activityBarInActiveForeground', "Activity bar item foreground color when it is inactive. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_BORDER = registerColor('activityBar.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('activityBarBorder', "Activity bar border color separating to the side bar. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_ACTIVE_BORDER = registerColor('activityBar.activeBorder', {
	dark: ACTIVITY_BAR_FOREGROUND,
	light: ACTIVITY_BAR_FOREGROUND,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('activityBarActiveBorder', "Activity bar border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_ACTIVE_FOCUS_BORDER = registerColor('activityBar.activeFocusBorder', {
	dark: null,
	light: null,
	hcDark: null,
	hcLight: '#B5200D'
}, localize('activityBarActiveFocusBorder', "Activity bar focus border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_ACTIVE_BACKGROUND = registerColor('activityBar.activeBackground', null, localize('activityBarActiveBackground', "Activity bar background color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_DRAG_AND_DROP_BORDER = registerColor('activityBar.dropBorder', {
	dark: ACTIVITY_BAR_FOREGROUND,
	light: ACTIVITY_BAR_FOREGROUND,
	hcDark: null,
	hcLight: null,
}, localize('activityBarDragAndDropBorder', "Drag and drop feedback color for the activity bar items. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_BADGE_BACKGROUND = registerColor('activityBarBadge.background', {
	dark: '#007ACC',
	light: '#007ACC',
	hcDark: '#000000',
	hcLight: '#0F4A85'
}, localize('activityBarBadgeBackground', "Activity notification badge background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_BADGE_FOREGROUND = registerColor('activityBarBadge.foreground', Color.white, localize('activityBarBadgeForeground', "Activity notification badge foreground color. The activity bar is showing on the far left or right and allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_FOREGROUND = registerColor('activityBarTop.foreground', {
	dark: '#E7E7E7',
	light: '#424242',
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('activityBarTop', "Active foreground color of the item in the Activity bar when it is on top / bottom. The activity allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_ACTIVE_BORDER = registerColor('activityBarTop.activeBorder', {
	dark: ACTIVITY_BAR_TOP_FOREGROUND,
	light: ACTIVITY_BAR_TOP_FOREGROUND,
	hcDark: contrastBorder,
	hcLight: '#B5200D'
}, localize('activityBarTopActiveFocusBorder', "Focus border color for the active item in the Activity bar when it is on top / bottom. The activity allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_ACTIVE_BACKGROUND = registerColor('activityBarTop.activeBackground', null, localize('activityBarTopActiveBackground', "Background color for the active item in the Activity bar when it is on top / bottom. The activity allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_INACTIVE_FOREGROUND = registerColor('activityBarTop.inactiveForeground', {
	dark: transparent(ACTIVITY_BAR_TOP_FOREGROUND, 0.6),
	light: transparent(ACTIVITY_BAR_TOP_FOREGROUND, 0.75),
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('activityBarTopInActiveForeground', "Inactive foreground color of the item in the Activity bar when it is on top / bottom. The activity allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_DRAG_AND_DROP_BORDER = registerColor('activityBarTop.dropBorder', ACTIVITY_BAR_TOP_FOREGROUND, localize('activityBarTopDragAndDropBorder', "Drag and drop feedback color for the items in the Activity bar when it is on top / bottom. The activity allows to switch between views of the side bar."));

export const ACTIVITY_BAR_TOP_BACKGROUND = registerColor('activityBarTop.background', null, localize('activityBarTopBackground', "Background color of the activity bar when set to top / bottom."));


// < --- Panels --- >

export const PANEL_BACKGROUND = registerColor('panel.background', editorBackground, localize('panelBackground', "Panel background color. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_BORDER = registerColor('panel.border', {
	dark: Color.fromHex('#808080').transparent(0.35),
	light: Color.fromHex('#808080').transparent(0.35),
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('panelBorder', "Panel border color to separate the panel from the editor. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_TITLE_BORDER = registerColor('panelTitle.border', {
	dark: null,
	light: null,
	hcDark: PANEL_BORDER,
	hcLight: PANEL_BORDER
}, localize('panelTitleBorder', "Panel title border color on the bottom, separating the title from the views. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_ACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.activeForeground', {
	dark: '#E7E7E7',
	light: '#424242',
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('panelActiveTitleForeground', "Title color for the active panel. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_INACTIVE_TITLE_FOREGROUND = registerColor('panelTitle.inactiveForeground', {
	dark: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.6),
	light: transparent(PANEL_ACTIVE_TITLE_FOREGROUND, 0.75),
	hcDark: Color.white,
	hcLight: editorForeground
}, localize('panelInactiveTitleForeground', "Title color for the inactive panel. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_ACTIVE_TITLE_BORDER = registerColor('panelTitle.activeBorder', {
	dark: PANEL_ACTIVE_TITLE_FOREGROUND,
	light: PANEL_ACTIVE_TITLE_FOREGROUND,
	hcDark: contrastBorder,
	hcLight: '#B5200D'
}, localize('panelActiveTitleBorder', "Border color for the active panel title. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_TITLE_BADGE_BACKGROUND = registerColor('panelTitleBadge.background', ACTIVITY_BAR_BADGE_BACKGROUND, localize('panelTitleBadgeBackground', "Panel title badge background color. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_TITLE_BADGE_FOREGROUND = registerColor('panelTitleBadge.foreground', ACTIVITY_BAR_BADGE_FOREGROUND, localize('panelTitleBadgeForeground', "Panel title badge foreground color. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_INPUT_BORDER = registerColor('panelInput.border', {
	dark: inputBorder,
	light: Color.fromHex('#ddd'),
	hcDark: inputBorder,
	hcLight: inputBorder
}, localize('panelInputBorder', "Input box border for inputs in the panel."));

export const PANEL_DRAG_AND_DROP_BORDER = registerColor('panel.dropBorder', PANEL_ACTIVE_TITLE_FOREGROUND, localize('panelDragAndDropBorder', "Drag and drop feedback color for the panel titles. Panels are shown below the editor area and contain views like output and integrated terminal."));

export const PANEL_SECTION_DRAG_AND_DROP_BACKGROUND = registerColor('panelSection.dropBackground', EDITOR_DRAG_AND_DROP_BACKGROUND, localize('panelSectionDragAndDropBackground', "Drag and drop feedback color for the panel sections. The color should have transparency so that the panel sections can still shine through. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels."));

export const PANEL_SECTION_HEADER_BACKGROUND = registerColor('panelSectionHeader.background', {
	dark: Color.fromHex('#808080').transparent(0.2),
	light: Color.fromHex('#808080').transparent(0.2),
	hcDark: null,
	hcLight: null,
}, localize('panelSectionHeaderBackground', "Panel section header background color. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels."));

export const PANEL_SECTION_HEADER_FOREGROUND = registerColor('panelSectionHeader.foreground', null, localize('panelSectionHeaderForeground', "Panel section header foreground color. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels."));

export const PANEL_SECTION_HEADER_BORDER = registerColor('panelSectionHeader.border', contrastBorder, localize('panelSectionHeaderBorder', "Panel section header border color used when multiple views are stacked vertically in the panel. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels."));

export const PANEL_SECTION_BORDER = registerColor('panelSection.border', PANEL_BORDER, localize('panelSectionBorder', "Panel section border color used when multiple views are stacked horizontally in the panel. Panels are shown below the editor area and contain views like output and integrated terminal. Panel sections are views nested within the panels."));

export const PANEL_STICKY_SCROLL_BACKGROUND = registerColor('panelStickyScroll.background', PANEL_BACKGROUND, localize('panelStickyScrollBackground', "Background color of sticky scroll in the panel."));

export const PANEL_STICKY_SCROLL_BORDER = registerColor('panelStickyScroll.border', null, localize('panelStickyScrollBorder', "Border color of sticky scroll in the panel."));

export const PANEL_STICKY_SCROLL_SHADOW = registerColor('panelStickyScroll.shadow', scrollbarShadow, localize('panelStickyScrollShadow', "Shadow color of sticky scroll in the panel."));


// < --- Profiles --- >

export const PROFILE_BADGE_BACKGROUND = registerColor('profileBadge.background', {
	dark: '#4D4D4D',
	light: '#C4C4C4',
	hcDark: Color.white,
	hcLight: Color.black
}, localize('profileBadgeBackground', "Profile badge background color. The profile badge shows on top of the settings gear icon in the activity bar."));

export const PROFILE_BADGE_FOREGROUND = registerColor('profileBadge.foreground', {
	dark: Color.white,
	light: '#333333',
	hcDark: Color.black,
	hcLight: Color.white
}, localize('profileBadgeForeground', "Profile badge foreground color. The profile badge shows on top of the settings gear icon in the activity bar."));


// < --- Remote --- >

export const STATUS_BAR_REMOTE_ITEM_BACKGROUND = registerColor('statusBarItem.remoteBackground', ACTIVITY_BAR_BADGE_BACKGROUND, localize('statusBarItemRemoteBackground', "Background color for the remote indicator on the status bar."));

export const STATUS_BAR_REMOTE_ITEM_FOREGROUND = registerColor('statusBarItem.remoteForeground', ACTIVITY_BAR_BADGE_FOREGROUND, localize('statusBarItemRemoteForeground', "Foreground color for the remote indicator on the status bar."));

export const STATUS_BAR_REMOTE_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.remoteHoverForeground', STATUS_BAR_ITEM_HOVER_FOREGROUND, localize('statusBarRemoteItemHoverForeground', "Foreground color for the remote indicator on the status bar when hovering."));

export const STATUS_BAR_REMOTE_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.remoteHoverBackground', {
	dark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	light: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	hcDark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	hcLight: null
}, localize('statusBarRemoteItemHoverBackground', "Background color for the remote indicator on the status bar when hovering."));

export const STATUS_BAR_OFFLINE_ITEM_BACKGROUND = registerColor('statusBarItem.offlineBackground', '#6c1717', localize('statusBarItemOfflineBackground', "Status bar item background color when the workbench is offline."));

export const STATUS_BAR_OFFLINE_ITEM_FOREGROUND = registerColor('statusBarItem.offlineForeground', STATUS_BAR_REMOTE_ITEM_FOREGROUND, localize('statusBarItemOfflineForeground', "Status bar item foreground color when the workbench is offline."));

export const STATUS_BAR_OFFLINE_ITEM_HOVER_FOREGROUND = registerColor('statusBarItem.offlineHoverForeground', STATUS_BAR_ITEM_HOVER_FOREGROUND, localize('statusBarOfflineItemHoverForeground', "Status bar item foreground hover color when the workbench is offline."));

export const STATUS_BAR_OFFLINE_ITEM_HOVER_BACKGROUND = registerColor('statusBarItem.offlineHoverBackground', {
	dark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	light: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	hcDark: STATUS_BAR_ITEM_HOVER_BACKGROUND,
	hcLight: null
}, localize('statusBarOfflineItemHoverBackground', "Status bar item background hover color when the workbench is offline."));

export const EXTENSION_BADGE_BACKGROUND = registerColor('extensionBadge.remoteBackground', ACTIVITY_BAR_BADGE_BACKGROUND, localize('extensionBadge.remoteBackground', "Background color for the remote badge in the extensions view."));
export const EXTENSION_BADGE_FOREGROUND = registerColor('extensionBadge.remoteForeground', ACTIVITY_BAR_BADGE_FOREGROUND, localize('extensionBadge.remoteForeground', "Foreground color for the remote badge in the extensions view."));


// < --- Side Bar --- >

export const SIDE_BAR_BACKGROUND = registerColor('sideBar.background', {
	dark: '#252526',
	light: '#F3F3F3',
	hcDark: '#000000',
	hcLight: '#FFFFFF'
}, localize('sideBarBackground', "Side bar background color. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_FOREGROUND = registerColor('sideBar.foreground', null, localize('sideBarForeground', "Side bar foreground color. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_BORDER = registerColor('sideBar.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('sideBarBorder', "Side bar border color on the side separating to the editor. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_TITLE_BACKGROUND = registerColor('sideBarTitle.background', SIDE_BAR_BACKGROUND, localize('sideBarTitleBackground', "Side bar title background color. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_TITLE_FOREGROUND = registerColor('sideBarTitle.foreground', SIDE_BAR_FOREGROUND, localize('sideBarTitleForeground', "Side bar title foreground color. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_TITLE_BORDER = registerColor('sideBarTitle.border', {
	dark: null,
	light: null,
	hcDark: SIDE_BAR_BORDER,
	hcLight: SIDE_BAR_BORDER
}, localize('sideBarTitleBorder', "Side bar title border color on the bottom, separating the title from the views. The side bar is the container for views like explorer and search."));

export const SIDE_BAR_DRAG_AND_DROP_BACKGROUND = registerColor('sideBar.dropBackground', EDITOR_DRAG_AND_DROP_BACKGROUND, localize('sideBarDragAndDropBackground', "Drag and drop feedback color for the side bar sections. The color should have transparency so that the side bar sections can still shine through. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar."));

export const SIDE_BAR_SECTION_HEADER_BACKGROUND = registerColor('sideBarSectionHeader.background', {
	dark: Color.fromHex('#808080').transparent(0.2),
	light: Color.fromHex('#808080').transparent(0.2),
	hcDark: null,
	hcLight: null
}, localize('sideBarSectionHeaderBackground', "Side bar section header background color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar."));

export const SIDE_BAR_SECTION_HEADER_FOREGROUND = registerColor('sideBarSectionHeader.foreground', SIDE_BAR_FOREGROUND, localize('sideBarSectionHeaderForeground', "Side bar section header foreground color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar."));

export const SIDE_BAR_SECTION_HEADER_BORDER = registerColor('sideBarSectionHeader.border', contrastBorder, localize('sideBarSectionHeaderBorder', "Side bar section header border color. The side bar is the container for views like explorer and search. Side bar sections are views nested within the side bar."));

export const ACTIVITY_BAR_TOP_BORDER = registerColor('sideBarActivityBarTop.border', SIDE_BAR_SECTION_HEADER_BORDER, localize('sideBarActivityBarTopBorder', "Border color between the activity bar at the top/bottom and the views."));

export const SIDE_BAR_STICKY_SCROLL_BACKGROUND = registerColor('sideBarStickyScroll.background', SIDE_BAR_BACKGROUND, localize('sideBarStickyScrollBackground', "Background color of sticky scroll in the side bar."));

export const SIDE_BAR_STICKY_SCROLL_BORDER = registerColor('sideBarStickyScroll.border', null, localize('sideBarStickyScrollBorder', "Border color of sticky scroll in the side bar."));

export const SIDE_BAR_STICKY_SCROLL_SHADOW = registerColor('sideBarStickyScroll.shadow', scrollbarShadow, localize('sideBarStickyScrollShadow', "Shadow color of sticky scroll in the side bar."));

// < --- Title Bar --- >

export const TITLE_BAR_ACTIVE_FOREGROUND = registerColor('titleBar.activeForeground', {
	dark: '#CCCCCC',
	light: '#333333',
	hcDark: '#FFFFFF',
	hcLight: '#292929'
}, localize('titleBarActiveForeground', "Title bar foreground when the window is active."));

export const TITLE_BAR_INACTIVE_FOREGROUND = registerColor('titleBar.inactiveForeground', {
	dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
	light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, 0.6),
	hcDark: null,
	hcLight: '#292929'
}, localize('titleBarInactiveForeground', "Title bar foreground when the window is inactive."));

export const TITLE_BAR_ACTIVE_BACKGROUND = registerColor('titleBar.activeBackground', {
	dark: '#3C3C3C',
	light: '#DDDDDD',
	hcDark: '#000000',
	hcLight: '#FFFFFF'
}, localize('titleBarActiveBackground', "Title bar background when the window is active."));

export const TITLE_BAR_INACTIVE_BACKGROUND = registerColor('titleBar.inactiveBackground', {
	dark: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
	light: transparent(TITLE_BAR_ACTIVE_BACKGROUND, 0.6),
	hcDark: null,
	hcLight: null,
}, localize('titleBarInactiveBackground', "Title bar background when the window is inactive."));

export const TITLE_BAR_BORDER = registerColor('titleBar.border', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('titleBarBorder', "Title bar border color."));

// < --- Menubar --- >

export const MENUBAR_SELECTION_FOREGROUND = registerColor('menubar.selectionForeground', TITLE_BAR_ACTIVE_FOREGROUND, localize('menubarSelectionForeground', "Foreground color of the selected menu item in the menubar."));

export const MENUBAR_SELECTION_BACKGROUND = registerColor('menubar.selectionBackground', {
	dark: toolbarHoverBackground,
	light: toolbarHoverBackground,
	hcDark: null,
	hcLight: null,
}, localize('menubarSelectionBackground', "Background color of the selected menu item in the menubar."));

export const MENUBAR_SELECTION_BORDER = registerColor('menubar.selectionBorder', {
	dark: null,
	light: null,
	hcDark: activeContrastBorder,
	hcLight: activeContrastBorder,
}, localize('menubarSelectionBorder', "Border color of the selected menu item in the menubar."));

// < --- Command Center --- >

// foreground (inactive and active)
export const COMMAND_CENTER_FOREGROUND = registerColor(
	'commandCenter.foreground',
	TITLE_BAR_ACTIVE_FOREGROUND,
	localize('commandCenter-foreground', "Foreground color of the command center"),
	false
);
export const COMMAND_CENTER_ACTIVEFOREGROUND = registerColor(
	'commandCenter.activeForeground',
	MENUBAR_SELECTION_FOREGROUND,
	localize('commandCenter-activeForeground', "Active foreground color of the command center"),
	false
);
export const COMMAND_CENTER_INACTIVEFOREGROUND = registerColor(
	'commandCenter.inactiveForeground',
	TITLE_BAR_INACTIVE_FOREGROUND,
	localize('commandCenter-inactiveForeground', "Foreground color of the command center when the window is inactive"),
	false
);
// background (inactive and active)
export const COMMAND_CENTER_BACKGROUND = registerColor(
	'commandCenter.background',
	{ dark: Color.white.transparent(0.05), hcDark: null, light: Color.black.transparent(0.05), hcLight: null },
	localize('commandCenter-background', "Background color of the command center"),
	false
);
export const COMMAND_CENTER_ACTIVEBACKGROUND = registerColor(
	'commandCenter.activeBackground',
	{ dark: Color.white.transparent(0.08), hcDark: MENUBAR_SELECTION_BACKGROUND, light: Color.black.transparent(0.08), hcLight: MENUBAR_SELECTION_BACKGROUND },
	localize('commandCenter-activeBackground', "Active background color of the command center"),
	false
);
// border: active and inactive. defaults to active background
export const COMMAND_CENTER_BORDER = registerColor(
	'commandCenter.border', { dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, .20), hcDark: contrastBorder, light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, .20), hcLight: contrastBorder },
	localize('commandCenter-border', "Border color of the command center"),
	false
);
export const COMMAND_CENTER_ACTIVEBORDER = registerColor(
	'commandCenter.activeBorder', { dark: transparent(TITLE_BAR_ACTIVE_FOREGROUND, .30), hcDark: TITLE_BAR_ACTIVE_FOREGROUND, light: transparent(TITLE_BAR_ACTIVE_FOREGROUND, .30), hcLight: TITLE_BAR_ACTIVE_FOREGROUND },
	localize('commandCenter-activeBorder', "Active border color of the command center"),
	false
);
// border: defaults to active background
export const COMMAND_CENTER_INACTIVEBORDER = registerColor(
	'commandCenter.inactiveBorder', transparent(TITLE_BAR_INACTIVE_FOREGROUND, .25),
	localize('commandCenter-inactiveBorder', "Border color of the command center when the window is inactive"),
	false
);


// < --- Notifications --- >

export const NOTIFICATIONS_CENTER_BORDER = registerColor('notificationCenter.border', {
	dark: widgetBorder,
	light: widgetBorder,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('notificationCenterBorder', "Notifications center border color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_TOAST_BORDER = registerColor('notificationToast.border', {
	dark: widgetBorder,
	light: widgetBorder,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('notificationToastBorder', "Notification toast border color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_FOREGROUND = registerColor('notifications.foreground', editorWidgetForeground, localize('notificationsForeground', "Notifications foreground color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_BACKGROUND = registerColor('notifications.background', editorWidgetBackground, localize('notificationsBackground', "Notifications background color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_LINKS = registerColor('notificationLink.foreground', textLinkForeground, localize('notificationsLink', "Notification links foreground color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_CENTER_HEADER_FOREGROUND = registerColor('notificationCenterHeader.foreground', null, localize('notificationCenterHeaderForeground', "Notifications center header foreground color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_CENTER_HEADER_BACKGROUND = registerColor('notificationCenterHeader.background', {
	dark: lighten(NOTIFICATIONS_BACKGROUND, 0.3),
	light: darken(NOTIFICATIONS_BACKGROUND, 0.05),
	hcDark: NOTIFICATIONS_BACKGROUND,
	hcLight: NOTIFICATIONS_BACKGROUND
}, localize('notificationCenterHeaderBackground', "Notifications center header background color. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_BORDER = registerColor('notifications.border', NOTIFICATIONS_CENTER_HEADER_BACKGROUND, localize('notificationsBorder', "Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_ERROR_ICON_FOREGROUND = registerColor('notificationsErrorIcon.foreground', editorErrorForeground, localize('notificationsErrorIconForeground', "The color used for the icon of error notifications. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_WARNING_ICON_FOREGROUND = registerColor('notificationsWarningIcon.foreground', editorWarningForeground, localize('notificationsWarningIconForeground', "The color used for the icon of warning notifications. Notifications slide in from the bottom right of the window."));

export const NOTIFICATIONS_INFO_ICON_FOREGROUND = registerColor('notificationsInfoIcon.foreground', editorInfoForeground, localize('notificationsInfoIconForeground', "The color used for the icon of info notifications. Notifications slide in from the bottom right of the window."));

export const WINDOW_ACTIVE_BORDER = registerColor('window.activeBorder', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('windowActiveBorder', "The color used for the border of the window when it is active on macOS or Linux. Requires custom title bar style and custom or hidden window controls on Linux."));

export const WINDOW_INACTIVE_BORDER = registerColor('window.inactiveBorder', {
	dark: null,
	light: null,
	hcDark: contrastBorder,
	hcLight: contrastBorder
}, localize('windowInactiveBorder', "The color used for the border of the window when it is inactive on macOS or Linux. Requires custom title bar style and custom or hidden window controls on Linux."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/views.ts]---
Location: vscode-main/src/vs/workbench/common/views.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../../editor/common/languages.js';
import { UriComponents, URI } from '../../base/common/uri.js';
import { Event, Emitter } from '../../base/common/event.js';
import { ContextKeyExpression } from '../../platform/contextkey/common/contextkey.js';
import { localize } from '../../nls.js';
import { createDecorator } from '../../platform/instantiation/common/instantiation.js';
import { IDisposable, Disposable, toDisposable } from '../../base/common/lifecycle.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { getOrSet, SetMap } from '../../base/common/map.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IKeybindings } from '../../platform/keybinding/common/keybindingsRegistry.js';
import { ExtensionIdentifier } from '../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { IProgressIndicator } from '../../platform/progress/common/progress.js';
import Severity from '../../base/common/severity.js';
import { IAccessibilityInformation } from '../../platform/accessibility/common/accessibility.js';
import { IMarkdownString, MarkdownString } from '../../base/common/htmlContent.js';
import { mixin } from '../../base/common/objects.js';
import { Codicon } from '../../base/common/codicons.js';
import { registerIcon } from '../../platform/theme/common/iconRegistry.js';
import { CancellationToken } from '../../base/common/cancellation.js';
import { VSDataTransfer } from '../../base/common/dataTransfer.js';
import { ILocalizedString } from '../../platform/action/common/action.js';

export const VIEWS_LOG_ID = 'views';
export const VIEWS_LOG_NAME = localize('views log', "Views");
export const defaultViewIcon = registerIcon('default-view-icon', Codicon.window, localize('defaultViewIcon', 'Default view icon.'));

export namespace Extensions {
	export const ViewContainersRegistry = 'workbench.registry.view.containers';
	export const ViewsRegistry = 'workbench.registry.view';
}

export const enum ViewContainerLocation {
	Sidebar,
	Panel,
	AuxiliaryBar
}

export const ViewContainerLocations = [ViewContainerLocation.Sidebar, ViewContainerLocation.Panel, ViewContainerLocation.AuxiliaryBar];

export function ViewContainerLocationToString(viewContainerLocation: ViewContainerLocation) {
	switch (viewContainerLocation) {
		case ViewContainerLocation.Sidebar: return 'sidebar';
		case ViewContainerLocation.Panel: return 'panel';
		case ViewContainerLocation.AuxiliaryBar: return 'auxiliarybar';
	}
}

type OpenCommandActionDescriptor = {
	readonly id: string;
	readonly title?: ILocalizedString | string;
	readonly mnemonicTitle?: string;
	readonly order?: number;
	readonly keybindings?: IKeybindings & { when?: ContextKeyExpression };
};

/**
 * View Container Contexts
 */

export interface IViewContainerDescriptor {

	/**
	 * The id of the view container
	 */
	readonly id: string;

	/**
	 * The title of the view container
	 */
	readonly title: ILocalizedString;

	/**
	 * Icon representation of the View container
	 */
	readonly icon?: ThemeIcon | URI;

	/**
	 * Order of the view container.
	 */
	readonly order?: number;

	/**
	 * IViewPaneContainer Ctor to instantiate
	 */
	readonly ctorDescriptor: SyncDescriptor<IViewPaneContainer>;

	/**
	 * Descriptor for open view container command
	 * If not provided, view container info (id, title) is used.
	 *
	 * Note: To prevent registering open command, use `doNotRegisterOpenCommand` flag while registering the view container
	 */
	readonly openCommandActionDescriptor?: OpenCommandActionDescriptor;

	/**
	 * Storage id to use to store the view container state.
	 * If not provided, it will be derived.
	 */
	readonly storageId?: string;

	/**
	 * If enabled, view container is not shown if it has no active views.
	 */
	readonly hideIfEmpty?: boolean;

	/**
	 * Id of the extension that contributed the view container
	 */
	readonly extensionId?: ExtensionIdentifier;

	readonly alwaysUseContainerInfo?: boolean;

	readonly viewOrderDelegate?: ViewOrderDelegate;

	readonly rejectAddedViews?: boolean;

	requestedIndex?: number;
}

export interface IViewContainersRegistry {
	/**
	 * An event that is triggered when a view container is registered.
	 */
	readonly onDidRegister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>;

	/**
	 * An event that is triggered when a view container is deregistered.
	 */
	readonly onDidDeregister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>;

	/**
	 * All registered view containers
	 */
	readonly all: ViewContainer[];

	/**
	 * Registers a view container to given location.
	 * No op if a view container is already registered.
	 *
	 * @param viewContainerDescriptor descriptor of view container
	 * @param location location of the view container
	 *
	 * @returns the registered ViewContainer.
	 */
	registerViewContainer(viewContainerDescriptor: IViewContainerDescriptor, location: ViewContainerLocation, options?: { isDefault?: boolean; doNotRegisterOpenCommand?: boolean }): ViewContainer;

	/**
	 * Deregisters the given view container
	 * No op if the view container is not registered
	 */
	deregisterViewContainer(viewContainer: ViewContainer): void;

	/**
	 * Returns the view container with given id.
	 *
	 * @returns the view container with given id.
	 */
	get(id: string): ViewContainer | undefined;

	/**
	 * Returns all view containers in the given location
	 */
	getViewContainers(location: ViewContainerLocation): ViewContainer[];

	/**
	 * Returns the view container location
	 */
	getViewContainerLocation(container: ViewContainer): ViewContainerLocation;

	/**
	 * Return the default view container from the given location
	 */
	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined;
}

interface ViewOrderDelegate {
	getOrder(group?: string): number | undefined;
}

export interface ViewContainer extends IViewContainerDescriptor { }

interface RelaxedViewContainer extends ViewContainer {

	openCommandActionDescriptor?: OpenCommandActionDescriptor;
}

class ViewContainersRegistryImpl extends Disposable implements IViewContainersRegistry {

	private readonly _onDidRegister = this._register(new Emitter<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>());
	readonly onDidRegister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }> = this._onDidRegister.event;

	private readonly _onDidDeregister = this._register(new Emitter<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }>());
	readonly onDidDeregister: Event<{ viewContainer: ViewContainer; viewContainerLocation: ViewContainerLocation }> = this._onDidDeregister.event;

	private readonly viewContainers: Map<ViewContainerLocation, ViewContainer[]> = new Map<ViewContainerLocation, ViewContainer[]>();
	private readonly defaultViewContainers: ViewContainer[] = [];

	get all(): ViewContainer[] {
		return [...this.viewContainers.values()].flat();
	}

	registerViewContainer(viewContainerDescriptor: IViewContainerDescriptor, viewContainerLocation: ViewContainerLocation, options?: { isDefault?: boolean; doNotRegisterOpenCommand?: boolean }): ViewContainer {
		const existing = this.get(viewContainerDescriptor.id);
		if (existing) {
			return existing;
		}

		const viewContainer: RelaxedViewContainer = viewContainerDescriptor;
		viewContainer.openCommandActionDescriptor = options?.doNotRegisterOpenCommand ? undefined : (viewContainer.openCommandActionDescriptor ?? { id: viewContainer.id });
		const viewContainers = getOrSet(this.viewContainers, viewContainerLocation, []);
		viewContainers.push(viewContainer);
		if (options?.isDefault) {
			this.defaultViewContainers.push(viewContainer);
		}
		this._onDidRegister.fire({ viewContainer, viewContainerLocation });
		return viewContainer;
	}

	deregisterViewContainer(viewContainer: ViewContainer): void {
		for (const viewContainerLocation of this.viewContainers.keys()) {
			const viewContainers = this.viewContainers.get(viewContainerLocation)!;
			const index = viewContainers?.indexOf(viewContainer);
			if (index !== -1) {
				viewContainers?.splice(index, 1);
				if (viewContainers.length === 0) {
					this.viewContainers.delete(viewContainerLocation);
				}
				this._onDidDeregister.fire({ viewContainer, viewContainerLocation });
				return;
			}
		}
	}

	get(id: string): ViewContainer | undefined {
		return this.all.filter(viewContainer => viewContainer.id === id)[0];
	}

	getViewContainers(location: ViewContainerLocation): ViewContainer[] {
		return [...(this.viewContainers.get(location) || [])];
	}

	getViewContainerLocation(container: ViewContainer): ViewContainerLocation {
		return [...this.viewContainers.keys()].filter(location => this.getViewContainers(location).filter(viewContainer => viewContainer?.id === container.id).length > 0)[0];
	}

	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined {
		return this.defaultViewContainers.find(viewContainer => this.getViewContainerLocation(viewContainer) === location);
	}
}

Registry.add(Extensions.ViewContainersRegistry, new ViewContainersRegistryImpl());

export interface IViewDescriptor {

	readonly type?: string;

	readonly id: string;

	readonly name: ILocalizedString;

	readonly ctorDescriptor: SyncDescriptor<IView>;

	readonly when?: ContextKeyExpression;

	readonly order?: number;

	readonly weight?: number;

	readonly collapsed?: boolean;

	readonly canToggleVisibility?: boolean;

	readonly canMoveView?: boolean;

	readonly containerIcon?: ThemeIcon | URI;

	readonly containerTitle?: string;

	readonly singleViewPaneContainerTitle?: string;

	// Applies only to newly created views
	readonly hideByDefault?: boolean;

	readonly workspace?: boolean;

	readonly focusCommand?: { id: string; keybindings?: IKeybindings };

	// For contributed remote explorer views
	readonly group?: string;

	readonly remoteAuthority?: string | string[];
	readonly virtualWorkspace?: string;

	readonly openCommandActionDescriptor?: OpenCommandActionDescriptor;

	readonly accessibilityHelpContent?: MarkdownString;
}

export interface ICustomViewDescriptor extends IViewDescriptor {
	readonly extensionId: ExtensionIdentifier;
	readonly originalContainerId: string;
	readonly treeView?: ITreeView;
}

export interface IViewDescriptorRef {
	viewDescriptor: IViewDescriptor;
	index: number;
}

export interface IAddedViewDescriptorRef extends IViewDescriptorRef {
	collapsed: boolean;
	size?: number;
}

export interface IAddedViewDescriptorState {
	viewDescriptor: IViewDescriptor;
	collapsed?: boolean;
	visible?: boolean;
}

export interface IViewContainerModel {

	readonly viewContainer: ViewContainer;

	readonly title: string;
	readonly icon: ThemeIcon | URI | undefined;
	readonly keybindingId: string | undefined;
	readonly onDidChangeContainerInfo: Event<{ title?: boolean; icon?: boolean; keybindingId?: boolean; badgeEnablement?: boolean }>;

	readonly allViewDescriptors: ReadonlyArray<IViewDescriptor>;
	readonly onDidChangeAllViewDescriptors: Event<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>;

	readonly activeViewDescriptors: ReadonlyArray<IViewDescriptor>;
	readonly onDidChangeActiveViewDescriptors: Event<{ added: ReadonlyArray<IViewDescriptor>; removed: ReadonlyArray<IViewDescriptor> }>;

	readonly visibleViewDescriptors: ReadonlyArray<IViewDescriptor>;
	readonly onDidAddVisibleViewDescriptors: Event<IAddedViewDescriptorRef[]>;
	readonly onDidRemoveVisibleViewDescriptors: Event<IViewDescriptorRef[]>;
	readonly onDidMoveVisibleViewDescriptors: Event<{ from: IViewDescriptorRef; to: IViewDescriptorRef }>;

	isVisible(id: string): boolean;
	setVisible(id: string, visible: boolean): void;

	isCollapsed(id: string): boolean;
	setCollapsed(id: string, collapsed: boolean): void;

	getSize(id: string): number | undefined;
	setSizes(newSizes: readonly { id: string; size: number }[]): void;

	move(from: string, to: string): void;
}

export enum ViewContentGroups {
	Open = '2_open',
	Debug = '4_debug',
	SCM = '5_scm',
	More = '9_more'
}

export interface IViewContentDescriptor {
	readonly content: string;
	/**
	 * Whether to render all but the first button as secondary
	 * if there are buttons in the `content` property.
	 */
	readonly renderSecondaryButtons?: boolean;
	readonly when?: ContextKeyExpression | 'default';
	readonly group?: string;
	readonly order?: number;
	readonly precondition?: ContextKeyExpression | undefined;
}

export interface IViewsRegistry {

	readonly onViewsRegistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }[]>;

	readonly onViewsDeregistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }>;

	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>;

	registerViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	registerViews2(views: { views: IViewDescriptor[]; viewContainer: ViewContainer }[]): void;

	deregisterViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	moveViews(views: IViewDescriptor[], viewContainer: ViewContainer): void;

	getViews(viewContainer: ViewContainer): IViewDescriptor[];

	getView(id: string): IViewDescriptor | null;

	getViewContainer(id: string): ViewContainer | null;

	readonly onDidChangeViewWelcomeContent: Event<string>;
	registerViewWelcomeContent(id: string, viewContent: IViewContentDescriptor): IDisposable;
	registerViewWelcomeContent2<TKey>(id: string, viewContentMap: Map<TKey, IViewContentDescriptor>): Map<TKey, IDisposable>;
	getViewWelcomeContent(id: string): IViewContentDescriptor[];
}

function compareViewContentDescriptors(a: IViewContentDescriptor, b: IViewContentDescriptor): number {
	const aGroup = a.group ?? ViewContentGroups.More;
	const bGroup = b.group ?? ViewContentGroups.More;
	if (aGroup !== bGroup) {
		return aGroup.localeCompare(bGroup);
	}
	return (a.order ?? 5) - (b.order ?? 5);
}

class ViewsRegistry extends Disposable implements IViewsRegistry {

	private readonly _onViewsRegistered = this._register(new Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }[]>());
	readonly onViewsRegistered = this._onViewsRegistered.event;

	private readonly _onViewsDeregistered: Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }> = this._register(new Emitter<{ views: IViewDescriptor[]; viewContainer: ViewContainer }>());
	readonly onViewsDeregistered: Event<{ views: IViewDescriptor[]; viewContainer: ViewContainer }> = this._onViewsDeregistered.event;

	private readonly _onDidChangeContainer: Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._register(new Emitter<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>());
	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }> = this._onDidChangeContainer.event;

	private readonly _onDidChangeViewWelcomeContent: Emitter<string> = this._register(new Emitter<string>());
	readonly onDidChangeViewWelcomeContent: Event<string> = this._onDidChangeViewWelcomeContent.event;

	private _viewContainers: ViewContainer[] = [];
	private _views: Map<ViewContainer, IViewDescriptor[]> = new Map<ViewContainer, IViewDescriptor[]>();
	private _viewWelcomeContents = new SetMap<string, IViewContentDescriptor>();

	registerViews(views: IViewDescriptor[], viewContainer: ViewContainer): void {
		this.registerViews2([{ views, viewContainer }]);
	}

	registerViews2(views: { views: IViewDescriptor[]; viewContainer: ViewContainer }[]): void {
		views.forEach(({ views, viewContainer }) => this.addViews(views, viewContainer));
		this._onViewsRegistered.fire(views);
	}

	deregisterViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): void {
		const views = this.removeViews(viewDescriptors, viewContainer);
		if (views.length) {
			this._onViewsDeregistered.fire({ views, viewContainer });
		}
	}

	moveViews(viewsToMove: IViewDescriptor[], viewContainer: ViewContainer): void {
		for (const container of this._views.keys()) {
			if (container !== viewContainer) {
				const views = this.removeViews(viewsToMove, container);
				if (views.length) {
					this.addViews(views, viewContainer);
					this._onDidChangeContainer.fire({ views, from: container, to: viewContainer });
				}
			}
		}
	}

	getViews(loc: ViewContainer): IViewDescriptor[] {
		return this._views.get(loc) || [];
	}

	getView(id: string): IViewDescriptor | null {
		for (const viewContainer of this._viewContainers) {
			const viewDescriptor = (this._views.get(viewContainer) || []).filter(v => v.id === id)[0];
			if (viewDescriptor) {
				return viewDescriptor;
			}
		}
		return null;
	}

	getViewContainer(viewId: string): ViewContainer | null {
		for (const viewContainer of this._viewContainers) {
			const viewDescriptor = (this._views.get(viewContainer) || []).filter(v => v.id === viewId)[0];
			if (viewDescriptor) {
				return viewContainer;
			}
		}
		return null;
	}

	registerViewWelcomeContent(id: string, viewContent: IViewContentDescriptor): IDisposable {
		this._viewWelcomeContents.add(id, viewContent);
		this._onDidChangeViewWelcomeContent.fire(id);

		return toDisposable(() => {
			this._viewWelcomeContents.delete(id, viewContent);
			this._onDidChangeViewWelcomeContent.fire(id);
		});
	}

	registerViewWelcomeContent2<TKey>(id: string, viewContentMap: Map<TKey, IViewContentDescriptor>): Map<TKey, IDisposable> {
		const disposables = new Map<TKey, IDisposable>();

		for (const [key, content] of viewContentMap) {
			this._viewWelcomeContents.add(id, content);

			disposables.set(key, toDisposable(() => {
				this._viewWelcomeContents.delete(id, content);
				this._onDidChangeViewWelcomeContent.fire(id);
			}));
		}
		this._onDidChangeViewWelcomeContent.fire(id);

		return disposables;
	}

	getViewWelcomeContent(id: string): IViewContentDescriptor[] {
		const result: IViewContentDescriptor[] = [];
		this._viewWelcomeContents.forEach(id, descriptor => result.push(descriptor));
		return result.sort(compareViewContentDescriptors);
	}

	private addViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): void {
		let views = this._views.get(viewContainer);
		if (!views) {
			views = [];
			this._views.set(viewContainer, views);
			this._viewContainers.push(viewContainer);
		}
		for (const viewDescriptor of viewDescriptors) {
			if (this.getView(viewDescriptor.id) !== null) {
				throw new Error(localize('duplicateId', "A view with id '{0}' is already registered", viewDescriptor.id));
			}
			views.push(viewDescriptor);
		}
	}

	private removeViews(viewDescriptors: IViewDescriptor[], viewContainer: ViewContainer): IViewDescriptor[] {
		const views = this._views.get(viewContainer);
		if (!views) {
			return [];
		}
		const viewsToDeregister: IViewDescriptor[] = [];
		const remaningViews: IViewDescriptor[] = [];
		for (const view of views) {
			if (!viewDescriptors.includes(view)) {
				remaningViews.push(view);
			} else {
				viewsToDeregister.push(view);
			}
		}
		if (viewsToDeregister.length) {
			if (remaningViews.length) {
				this._views.set(viewContainer, remaningViews);
			} else {
				this._views.delete(viewContainer);
				this._viewContainers.splice(this._viewContainers.indexOf(viewContainer), 1);
			}
		}
		return viewsToDeregister;
	}
}

Registry.add(Extensions.ViewsRegistry, new ViewsRegistry());

export interface IView {

	readonly id: string;

	focus(): void;

	isVisible(): boolean;

	isBodyVisible(): boolean;

	setExpanded(expanded: boolean): boolean;

	getProgressIndicator(): IProgressIndicator | undefined;
}

export const IViewDescriptorService = createDecorator<IViewDescriptorService>('viewDescriptorService');

export enum ViewVisibilityState {
	Default = 0,
	Expand = 1
}

export interface IViewDescriptorService {

	readonly _serviceBrand: undefined;

	// ViewContainers
	readonly viewContainers: ReadonlyArray<ViewContainer>;
	readonly onDidChangeViewContainers: Event<{ added: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }>; removed: ReadonlyArray<{ container: ViewContainer; location: ViewContainerLocation }> }>;

	getDefaultViewContainer(location: ViewContainerLocation): ViewContainer | undefined;
	getViewContainerById(id: string): ViewContainer | null;
	isViewContainerRemovedPermanently(id: string): boolean;
	getDefaultViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation | null;
	getViewContainerLocation(viewContainer: ViewContainer): ViewContainerLocation | null;
	getViewContainersByLocation(location: ViewContainerLocation): ViewContainer[];
	getViewContainerModel(viewContainer: ViewContainer): IViewContainerModel;

	readonly onDidChangeContainerLocation: Event<{ viewContainer: ViewContainer; from: ViewContainerLocation; to: ViewContainerLocation }>;
	moveViewContainerToLocation(viewContainer: ViewContainer, location: ViewContainerLocation, requestedIndex?: number, reason?: string): void;

	getViewContainerBadgeEnablementState(id: string): boolean;
	setViewContainerBadgeEnablementState(id: string, badgesEnabled: boolean): void;

	// Views
	getViewDescriptorById(id: string): IViewDescriptor | null;
	getViewContainerByViewId(id: string): ViewContainer | null;
	getDefaultContainerById(id: string): ViewContainer | null;
	getViewLocationById(id: string): ViewContainerLocation | null;

	readonly onDidChangeContainer: Event<{ views: IViewDescriptor[]; from: ViewContainer; to: ViewContainer }>;
	moveViewsToContainer(views: IViewDescriptor[], viewContainer: ViewContainer, visibilityState?: ViewVisibilityState, reason?: string): void;

	readonly onDidChangeLocation: Event<{ views: IViewDescriptor[]; from: ViewContainerLocation; to: ViewContainerLocation }>;
	moveViewToLocation(view: IViewDescriptor, location: ViewContainerLocation, reason?: string): void;

	reset(): void;
}

// Custom views

export interface ITreeView extends IDisposable {

	dataProvider: ITreeViewDataProvider | undefined;

	dragAndDropController?: ITreeViewDragAndDropController;

	showCollapseAllAction: boolean;

	canSelectMany: boolean;

	manuallyManageCheckboxes: boolean;

	message?: string | IMarkdownString;

	title: string;

	description: string | undefined;

	badge: IViewBadge | undefined;

	readonly visible: boolean;

	readonly onDidExpandItem: Event<ITreeItem>;

	readonly onDidCollapseItem: Event<ITreeItem>;

	readonly onDidChangeSelectionAndFocus: Event<{ selection: readonly ITreeItem[]; focus: ITreeItem }>;

	readonly onDidChangeVisibility: Event<boolean>;

	readonly onDidChangeActions: Event<void>;

	readonly onDidChangeTitle: Event<string>;

	readonly onDidChangeDescription: Event<string | undefined>;

	readonly onDidChangeWelcomeState: Event<void>;

	readonly onDidChangeCheckboxState: Event<readonly ITreeItem[]>;

	readonly container: unknown /* HTMLElement */ | undefined;

	// checkboxesChanged is a subset of treeItems
	refresh(treeItems?: readonly ITreeItem[], checkboxesChanged?: readonly ITreeItem[]): Promise<void>;

	setVisibility(visible: boolean): void;

	focus(): void;

	layout(height: number, width: number): void;

	getOptimalWidth(): number;

	reveal(item: ITreeItem): Promise<void>;

	expand(itemOrItems: ITreeItem | ITreeItem[]): Promise<void>;

	isCollapsed(item: ITreeItem): boolean;

	setSelection(items: ITreeItem[]): void;

	getSelection(): ITreeItem[];

	setFocus(item?: ITreeItem): void;

	show(container: unknown /* HTMLElement */): void;
}

export interface IRevealOptions {

	select?: boolean;

	focus?: boolean;

	expand?: boolean | number;

}

export interface ITreeViewDescriptor extends IViewDescriptor {
	treeView: ITreeView;
}

export type TreeViewPaneHandleArg = {
	$treeViewId: string;
	$selectedTreeItems?: boolean;
	$focusedTreeItem?: boolean;
};

export type TreeViewItemHandleArg = {
	$treeViewId: string;
	$treeItemHandle: string;
};

export enum TreeItemCollapsibleState {
	None = 0,
	Collapsed = 1,
	Expanded = 2
}

export interface ITreeItemLabel {

	label: string | IMarkdownString;

	highlights?: [number, number][];

}

export type TreeCommand = Command & { originalId?: string };

export interface ITreeItemCheckboxState {
	isChecked: boolean;
	tooltip?: string;
	accessibilityInformation?: IAccessibilityInformation;
}

export interface ITreeItem {

	handle: string;

	parentHandle?: string;

	collapsibleState: TreeItemCollapsibleState;

	label?: ITreeItemLabel;

	description?: string | boolean;

	icon?: UriComponents;

	iconDark?: UriComponents;

	themeIcon?: ThemeIcon;

	resourceUri?: UriComponents;

	tooltip?: string | IMarkdownString;

	contextValue?: string;

	command?: TreeCommand;

	children?: ITreeItem[];

	parent?: ITreeItem;

	accessibilityInformation?: IAccessibilityInformation;

	checkbox?: ITreeItemCheckboxState;
}

export class ResolvableTreeItem implements ITreeItem {
	handle!: string;
	parentHandle?: string;
	collapsibleState!: TreeItemCollapsibleState;
	label?: ITreeItemLabel;
	description?: string | boolean;
	icon?: UriComponents;
	iconDark?: UriComponents;
	themeIcon?: ThemeIcon;
	resourceUri?: UriComponents;
	tooltip?: string | IMarkdownString;
	contextValue?: string;
	command?: Command & { originalId?: string };
	children?: ITreeItem[];
	accessibilityInformation?: IAccessibilityInformation;
	resolve: (token: CancellationToken) => Promise<void>;
	private resolved: boolean = false;
	private _hasResolve: boolean = false;
	constructor(treeItem: ITreeItem, resolve?: ((token: CancellationToken) => Promise<ITreeItem | undefined>)) {
		mixin(this, treeItem);
		this._hasResolve = !!resolve;
		this.resolve = async (token: CancellationToken) => {
			if (resolve && !this.resolved) {
				const resolvedItem = await resolve(token);
				if (resolvedItem) {
					// Resolvable elements. Currently tooltip and command.
					this.tooltip = this.tooltip ?? resolvedItem.tooltip;
					this.command = this.command ?? resolvedItem.command;
				}
			}
			if (!token.isCancellationRequested) {
				this.resolved = true;
			}
		};
	}
	get hasResolve(): boolean {
		return this._hasResolve;
	}
	public resetResolve() {
		this.resolved = false;
	}
	public asTreeItem(): ITreeItem {
		return {
			handle: this.handle,
			parentHandle: this.parentHandle,
			collapsibleState: this.collapsibleState,
			label: this.label,
			description: this.description,
			icon: this.icon,
			iconDark: this.iconDark,
			themeIcon: this.themeIcon,
			resourceUri: this.resourceUri,
			tooltip: this.tooltip,
			contextValue: this.contextValue,
			command: this.command,
			children: this.children,
			accessibilityInformation: this.accessibilityInformation
		};
	}
}

export class NoTreeViewError extends Error {
	override readonly name = 'NoTreeViewError';
	constructor(treeViewId: string) {
		super(localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId));
	}
	static is(err: unknown): err is NoTreeViewError {
		return !!err && (err as Error).name === 'NoTreeViewError';
	}
}

export interface ITreeViewDataProvider {
	readonly isTreeEmpty?: boolean;
	readonly onDidChangeEmpty?: Event<void>;
	getChildren(element?: ITreeItem): Promise<ITreeItem[] | undefined>;
	getChildrenBatch?(element?: ITreeItem[]): Promise<ITreeItem[][] | undefined>;
}

export interface ITreeViewDragAndDropController {
	readonly dropMimeTypes: string[];
	readonly dragMimeTypes: string[];
	handleDrag(sourceTreeItemHandles: string[], operationUuid: string, token: CancellationToken): Promise<VSDataTransfer | undefined>;
	handleDrop(elements: VSDataTransfer, target: ITreeItem | undefined, token: CancellationToken, operationUuid?: string, sourceTreeId?: string, sourceTreeItemHandles?: string[]): Promise<void>;
}

export interface IEditableData {
	validationMessage: (value: string) => { content: string; severity: Severity } | null;
	placeholder?: string | null;
	startingValue?: string | null;
	onFinish: (value: string, success: boolean) => Promise<void>;
}

export interface IViewPaneContainer {
	readonly onDidAddViews: Event<IView[]>;
	readonly onDidRemoveViews: Event<IView[]>;
	readonly onDidChangeViewVisibility: Event<IView>;

	readonly views: IView[];

	setVisible(visible: boolean): void;
	isVisible(): boolean;
	focus(): void;
	getActionsContext(): unknown;
	getView(viewId: string): IView | undefined;
	toggleViewVisibility(viewId: string): void;
}

export interface IViewBadge {
	readonly tooltip: string;
	readonly value: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/binaryEditorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/binaryEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorModel } from './editorModel.js';
import { URI } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { Mimes } from '../../../base/common/mime.js';

/**
 * An editor model that just represents a resource that can be loaded.
 */
export class BinaryEditorModel extends EditorModel {

	private readonly mime = Mimes.binary;

	private size: number | undefined;
	private etag: string | undefined;

	constructor(
		readonly resource: URI,
		private readonly name: string,
		@IFileService private readonly fileService: IFileService
	) {
		super();
	}

	/**
	 * The name of the binary resource.
	 */
	getName(): string {
		return this.name;
	}

	/**
	 * The size of the binary resource if known.
	 */
	getSize(): number | undefined {
		return this.size;
	}

	/**
	 * The mime of the binary resource if known.
	 */
	getMime(): string {
		return this.mime;
	}

	/**
	 * The etag of the binary resource if known.
	 */
	getETag(): string | undefined {
		return this.etag;
	}

	override async resolve(): Promise<void> {

		// Make sure to resolve up to date stat for file resources
		if (this.fileService.hasProvider(this.resource)) {
			const stat = await this.fileService.stat(this.resource);
			this.etag = stat.etag;
			if (typeof stat.size === 'number') {
				this.size = stat.size;
			}
		}

		return super.resolve();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/diffEditorInput.ts]---
Location: vscode-main/src/vs/workbench/common/editor/diffEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls.js';
import { AbstractSideBySideEditorInputSerializer, SideBySideEditorInput } from './sideBySideEditorInput.js';
import { EditorInput, IUntypedEditorOptions } from './editorInput.js';
import { EditorModel } from './editorModel.js';
import { TEXT_DIFF_EDITOR_ID, BINARY_DIFF_EDITOR_ID, Verbosity, IEditorDescriptor, IEditorPane, IResourceDiffEditorInput, IUntypedEditorInput, isResourceDiffEditorInput, IDiffEditorInput, IResourceSideBySideEditorInput, EditorInputCapabilities } from '../editor.js';
import { BaseTextEditorModel } from './textEditorModel.js';
import { DiffEditorModel } from './diffEditorModel.js';
import { TextDiffEditorModel } from './textDiffEditorModel.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { shorten } from '../../../base/common/labels.js';
import { isResolvedEditorModel } from '../../../platform/editor/common/editor.js';

interface IDiffEditorInputLabels {
	readonly name: string;

	readonly shortDescription: string | undefined;
	readonly mediumDescription: string | undefined;
	readonly longDescription: string | undefined;

	readonly forceDescription: boolean;

	readonly shortTitle: string;
	readonly mediumTitle: string;
	readonly longTitle: string;
}

/**
 * The base editor input for the diff editor. It is made up of two editor inputs, the original version
 * and the modified version.
 */
export class DiffEditorInput extends SideBySideEditorInput implements IDiffEditorInput {

	static override readonly ID: string = 'workbench.editors.diffEditorInput';

	override get typeId(): string {
		return DiffEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return this.modified.editorId === this.original.editorId ? this.modified.editorId : undefined;
	}

	override get capabilities(): EditorInputCapabilities {
		let capabilities = super.capabilities;

		// Force description capability depends on labels
		if (this.labels.forceDescription) {
			capabilities |= EditorInputCapabilities.ForceDescription;
		}

		return capabilities;
	}

	private cachedModel: DiffEditorModel | undefined = undefined;

	private readonly labels: IDiffEditorInputLabels;

	constructor(
		preferredName: string | undefined,
		preferredDescription: string | undefined,
		readonly original: EditorInput,
		readonly modified: EditorInput,
		private readonly forceOpenAsBinary: boolean | undefined,
		@IEditorService editorService: IEditorService
	) {
		super(preferredName, preferredDescription, original, modified, editorService);

		this.labels = this.computeLabels();
	}

	private computeLabels(): IDiffEditorInputLabels {

		// Name
		let name: string;
		let forceDescription = false;
		if (this.preferredName) {
			name = this.preferredName;
		} else {
			const originalName = this.original.getName();
			const modifiedName = this.modified.getName();

			name = localize('sideBySideLabels', "{0} ↔ {1}", originalName, modifiedName);

			// Enforce description when the names are identical
			forceDescription = originalName === modifiedName;
		}

		// Description
		let shortDescription: string | undefined;
		let mediumDescription: string | undefined;
		let longDescription: string | undefined;
		if (this.preferredDescription) {
			shortDescription = this.preferredDescription;
			mediumDescription = this.preferredDescription;
			longDescription = this.preferredDescription;
		} else {
			shortDescription = this.computeLabel(this.original.getDescription(Verbosity.SHORT), this.modified.getDescription(Verbosity.SHORT));
			longDescription = this.computeLabel(this.original.getDescription(Verbosity.LONG), this.modified.getDescription(Verbosity.LONG));

			// Medium Description: try to be verbose by computing
			// a label that resembles the difference between the two
			const originalMediumDescription = this.original.getDescription(Verbosity.MEDIUM);
			const modifiedMediumDescription = this.modified.getDescription(Verbosity.MEDIUM);
			if (
				(typeof originalMediumDescription === 'string' && typeof modifiedMediumDescription === 'string') && // we can only `shorten` when both sides are strings...
				(originalMediumDescription || modifiedMediumDescription) 											// ...however never when both sides are empty strings
			) {
				const [shortenedOriginalMediumDescription, shortenedModifiedMediumDescription] = shorten([originalMediumDescription, modifiedMediumDescription]);
				mediumDescription = this.computeLabel(shortenedOriginalMediumDescription, shortenedModifiedMediumDescription);
			}
		}

		// Title
		let shortTitle = this.computeLabel(this.original.getTitle(Verbosity.SHORT) ?? this.original.getName(), this.modified.getTitle(Verbosity.SHORT) ?? this.modified.getName(), ' ↔ ');
		let mediumTitle = this.computeLabel(this.original.getTitle(Verbosity.MEDIUM) ?? this.original.getName(), this.modified.getTitle(Verbosity.MEDIUM) ?? this.modified.getName(), ' ↔ ');
		let longTitle = this.computeLabel(this.original.getTitle(Verbosity.LONG) ?? this.original.getName(), this.modified.getTitle(Verbosity.LONG) ?? this.modified.getName(), ' ↔ ');

		const preferredTitle = this.getPreferredTitle();
		if (preferredTitle) {
			shortTitle = `${preferredTitle} (${shortTitle})`;
			mediumTitle = `${preferredTitle} (${mediumTitle})`;
			longTitle = `${preferredTitle} (${longTitle})`;
		}

		return { name, shortDescription, mediumDescription, longDescription, forceDescription, shortTitle, mediumTitle, longTitle };
	}

	private computeLabel(originalLabel: string, modifiedLabel: string, separator?: string): string;
	private computeLabel(originalLabel: string | undefined, modifiedLabel: string | undefined, separator?: string): string | undefined;
	private computeLabel(originalLabel: string | undefined, modifiedLabel: string | undefined, separator = ' - '): string | undefined {
		if (!originalLabel || !modifiedLabel) {
			return undefined;
		}

		if (originalLabel === modifiedLabel) {
			return modifiedLabel;
		}

		return `${originalLabel}${separator}${modifiedLabel}`;
	}

	override getName(): string {
		return this.labels.name;
	}

	override getDescription(verbosity = Verbosity.MEDIUM): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.labels.shortDescription;
			case Verbosity.LONG:
				return this.labels.longDescription;
			case Verbosity.MEDIUM:
			default:
				return this.labels.mediumDescription;
		}
	}

	override getTitle(verbosity?: Verbosity): string {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.labels.shortTitle;
			case Verbosity.LONG:
				return this.labels.longTitle;
			default:
			case Verbosity.MEDIUM:
				return this.labels.mediumTitle;
		}
	}

	override async resolve(): Promise<EditorModel> {

		// Create Model - we never reuse our cached model if refresh is true because we cannot
		// decide for the inputs within if the cached model can be reused or not. There may be
		// inputs that need to be loaded again and thus we always recreate the model and dispose
		// the previous one - if any.
		const resolvedModel = await this.createModel();
		this.cachedModel?.dispose();

		this.cachedModel = resolvedModel;

		return this.cachedModel;
	}

	override prefersEditorPane<T extends IEditorDescriptor<IEditorPane>>(editorPanes: T[]): T | undefined {
		if (this.forceOpenAsBinary) {
			return editorPanes.find(editorPane => editorPane.typeId === BINARY_DIFF_EDITOR_ID);
		}

		return editorPanes.find(editorPane => editorPane.typeId === TEXT_DIFF_EDITOR_ID);
	}

	private async createModel(): Promise<DiffEditorModel> {

		// Join resolve call over two inputs and build diff editor model
		const [originalEditorModel, modifiedEditorModel] = await Promise.all([
			this.original.resolve(),
			this.modified.resolve()
		]);

		// If both are text models, return textdiffeditor model
		if (modifiedEditorModel instanceof BaseTextEditorModel && originalEditorModel instanceof BaseTextEditorModel) {
			return new TextDiffEditorModel(originalEditorModel, modifiedEditorModel);
		}

		// Otherwise return normal diff model
		return new DiffEditorModel(isResolvedEditorModel(originalEditorModel) ? originalEditorModel : undefined, isResolvedEditorModel(modifiedEditorModel) ? modifiedEditorModel : undefined);
	}

	override toUntyped(options?: IUntypedEditorOptions): (IResourceDiffEditorInput & IResourceSideBySideEditorInput) | undefined {
		const untyped = super.toUntyped(options);
		if (untyped) {
			return {
				...untyped,
				modified: untyped.primary,
				original: untyped.secondary
			};
		}

		return undefined;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof DiffEditorInput) {
			return this.modified.matches(otherInput.modified) && this.original.matches(otherInput.original) && otherInput.forceOpenAsBinary === this.forceOpenAsBinary;
		}

		if (isResourceDiffEditorInput(otherInput)) {
			return this.modified.matches(otherInput.modified) && this.original.matches(otherInput.original);
		}

		return false;
	}

	override dispose(): void {

		// Free the diff editor model but do not propagate the dispose() call to the two inputs
		// We never created the two inputs (original and modified) so we can not dispose
		// them without sideeffects.
		if (this.cachedModel) {
			this.cachedModel.dispose();
			this.cachedModel = undefined;
		}

		super.dispose();
	}
}

export class DiffEditorInputSerializer extends AbstractSideBySideEditorInputSerializer {

	protected createEditorInput(instantiationService: IInstantiationService, name: string | undefined, description: string | undefined, secondaryInput: EditorInput, primaryInput: EditorInput): EditorInput {
		return instantiationService.createInstance(DiffEditorInput, name, description, secondaryInput, primaryInput, undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/diffEditorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/diffEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorModel } from './editorModel.js';
import { IResolvableEditorModel } from '../../../platform/editor/common/editor.js';

/**
 * The base editor model for the diff editor. It is made up of two editor models, the original version
 * and the modified version.
 */
export class DiffEditorModel extends EditorModel {

	protected readonly _originalModel: IResolvableEditorModel | undefined;
	get originalModel(): IResolvableEditorModel | undefined { return this._originalModel; }

	protected readonly _modifiedModel: IResolvableEditorModel | undefined;
	get modifiedModel(): IResolvableEditorModel | undefined { return this._modifiedModel; }

	constructor(originalModel: IResolvableEditorModel | undefined, modifiedModel: IResolvableEditorModel | undefined) {
		super();

		this._originalModel = originalModel;
		this._modifiedModel = modifiedModel;
	}

	override async resolve(): Promise<void> {
		await Promise.all([
			this._originalModel?.resolve(),
			this._modifiedModel?.resolve()
		]);
	}

	override isResolved(): boolean {
		return !!(this._originalModel?.isResolved() && this._modifiedModel?.isResolved());
	}

	override dispose(): void {

		// Do not propagate the dispose() call to the two models inside. We never created the two models
		// (original and modified) so we can not dispose them without sideeffects. Rather rely on the
		// models getting disposed when their related inputs get disposed from the diffEditorInput.

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/editorGroupModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/editorGroupModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../base/common/event.js';
import { IEditorFactoryRegistry, GroupIdentifier, EditorsOrder, EditorExtensions, IUntypedEditorInput, SideBySideEditor, EditorCloseContext, IMatchEditorOptions, GroupModelChangeKind } from '../editor.js';
import { EditorInput } from './editorInput.js';
import { SideBySideEditorInput } from './sideBySideEditorInput.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { dispose, Disposable, DisposableStore } from '../../../base/common/lifecycle.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { coalesce } from '../../../base/common/arrays.js';

const EditorOpenPositioning = {
	LEFT: 'left',
	RIGHT: 'right',
	FIRST: 'first',
	LAST: 'last'
};

export interface IEditorOpenOptions {
	readonly pinned?: boolean;
	readonly sticky?: boolean;
	readonly transient?: boolean;
	active?: boolean;
	readonly inactiveSelection?: EditorInput[];
	readonly index?: number;
	readonly supportSideBySide?: SideBySideEditor.ANY | SideBySideEditor.BOTH;
}

export interface IEditorOpenResult {
	readonly editor: EditorInput;
	readonly isNew: boolean;
}

export interface ISerializedEditorInput {
	readonly id: string;
	readonly value: string;
}

export interface ISerializedEditorGroupModel {
	readonly id: number;
	readonly locked?: boolean;
	readonly editors: ISerializedEditorInput[];
	readonly mru: number[];
	readonly preview?: number;
	sticky?: number;
}

export function isSerializedEditorGroupModel(group?: unknown): group is ISerializedEditorGroupModel {
	const candidate = group as ISerializedEditorGroupModel | undefined;

	return !!(candidate && typeof candidate === 'object' && Array.isArray(candidate.editors) && Array.isArray(candidate.mru));
}

export interface IGroupModelChangeEvent {

	/**
	 * The kind of change that occurred in the group model.
	 */
	readonly kind: GroupModelChangeKind;

	/**
	 * Only applies when editors change providing
	 * access to the editor the event is about.
	 */
	readonly editor?: EditorInput;

	/**
	 * Only applies when editors change providing
	 * access to the index of the editor the event
	 * is about.
	 */
	readonly editorIndex?: number;
}

export interface IGroupEditorChangeEvent extends IGroupModelChangeEvent {
	readonly editor: EditorInput;
	readonly editorIndex: number;
}

export function isGroupEditorChangeEvent(e: IGroupModelChangeEvent): e is IGroupEditorChangeEvent {
	const candidate = e as IGroupEditorOpenEvent;

	return candidate.editor && candidate.editorIndex !== undefined;
}

export interface IGroupEditorOpenEvent extends IGroupEditorChangeEvent {

	readonly kind: GroupModelChangeKind.EDITOR_OPEN;
}

export function isGroupEditorOpenEvent(e: IGroupModelChangeEvent): e is IGroupEditorOpenEvent {
	const candidate = e as IGroupEditorOpenEvent;

	return candidate.kind === GroupModelChangeKind.EDITOR_OPEN && candidate.editorIndex !== undefined;
}

export interface IGroupEditorMoveEvent extends IGroupEditorChangeEvent {

	readonly kind: GroupModelChangeKind.EDITOR_MOVE;

	/**
	 * Signifies the index the editor is moving from.
	 * `editorIndex` will contain the index the editor
	 * is moving to.
	 */
	readonly oldEditorIndex: number;
}

export function isGroupEditorMoveEvent(e: IGroupModelChangeEvent): e is IGroupEditorMoveEvent {
	const candidate = e as IGroupEditorMoveEvent;

	return candidate.kind === GroupModelChangeKind.EDITOR_MOVE && candidate.editorIndex !== undefined && candidate.oldEditorIndex !== undefined;
}

export interface IGroupEditorCloseEvent extends IGroupEditorChangeEvent {

	readonly kind: GroupModelChangeKind.EDITOR_CLOSE;

	/**
	 * Signifies the context in which the editor
	 * is being closed. This allows for understanding
	 * if a replace or reopen is occurring
	 */
	readonly context: EditorCloseContext;

	/**
	 * Signifies whether or not the closed editor was
	 * sticky. This is necessary becasue state is lost
	 * after closing.
	 */
	readonly sticky: boolean;
}

export function isGroupEditorCloseEvent(e: IGroupModelChangeEvent): e is IGroupEditorCloseEvent {
	const candidate = e as IGroupEditorCloseEvent;

	return candidate.kind === GroupModelChangeKind.EDITOR_CLOSE && candidate.editorIndex !== undefined && candidate.context !== undefined && candidate.sticky !== undefined;
}

interface IEditorCloseResult {
	readonly editor: EditorInput;
	readonly context: EditorCloseContext;
	readonly editorIndex: number;
	readonly sticky: boolean;
}

export interface IReadonlyEditorGroupModel {

	readonly onDidModelChange: Event<IGroupModelChangeEvent>;

	readonly id: GroupIdentifier;
	readonly count: number;
	readonly stickyCount: number;
	readonly isLocked: boolean;
	readonly activeEditor: EditorInput | null;
	readonly previewEditor: EditorInput | null;
	readonly selectedEditors: EditorInput[];

	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[];
	getEditorByIndex(index: number): EditorInput | undefined;
	indexOf(editor: EditorInput | IUntypedEditorInput | null, editors?: EditorInput[], options?: IMatchEditorOptions): number;
	isActive(editor: EditorInput | IUntypedEditorInput): boolean;
	isPinned(editorOrIndex: EditorInput | number): boolean;
	isSticky(editorOrIndex: EditorInput | number): boolean;
	isSelected(editorOrIndex: EditorInput | number): boolean;
	isTransient(editorOrIndex: EditorInput | number): boolean;
	isFirst(editor: EditorInput, editors?: EditorInput[]): boolean;
	isLast(editor: EditorInput, editors?: EditorInput[]): boolean;
	findEditor(editor: EditorInput | null, options?: IMatchEditorOptions): [EditorInput, number /* index */] | undefined;
	contains(editor: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean;
}

interface IEditorGroupModel extends IReadonlyEditorGroupModel {
	openEditor(editor: EditorInput, options?: IEditorOpenOptions): IEditorOpenResult;
	closeEditor(editor: EditorInput, context?: EditorCloseContext, openNext?: boolean): IEditorCloseResult | undefined;
	moveEditor(editor: EditorInput, toIndex: number): EditorInput | undefined;
	setActive(editor: EditorInput | undefined): EditorInput | undefined;
	setSelection(activeSelectedEditor: EditorInput, inactiveSelectedEditors: EditorInput[]): void;
}

export class EditorGroupModel extends Disposable implements IEditorGroupModel {

	private static IDS = 0;

	//#region events

	private readonly _onDidModelChange = this._register(new Emitter<IGroupModelChangeEvent>({ leakWarningThreshold: 500 /* increased for users with hundreds of inputs opened */ }));
	readonly onDidModelChange = this._onDidModelChange.event;

	//#endregion

	private _id: GroupIdentifier;
	get id(): GroupIdentifier { return this._id; }

	private editors: EditorInput[] = [];
	private mru: EditorInput[] = [];

	private readonly editorListeners = new Set<DisposableStore>();

	private locked = false;

	private selection: EditorInput[] = [];					// editors in selected state, first one is active

	private get active(): EditorInput | null {
		return this.selection[0] ?? null;
	}

	private preview: EditorInput | null = null; 			// editor in preview state
	private sticky = -1;									// index of first editor in sticky state
	private readonly transient = new Set<EditorInput>(); 	// editors in transient state

	private editorOpenPositioning: ('left' | 'right' | 'first' | 'last') | undefined;
	private focusRecentEditorAfterClose: boolean | undefined;

	constructor(
		labelOrSerializedGroup: ISerializedEditorGroupModel | undefined,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		if (isSerializedEditorGroupModel(labelOrSerializedGroup)) {
			this._id = this.deserialize(labelOrSerializedGroup);
		} else {
			this._id = EditorGroupModel.IDS++;
		}

		this.onConfigurationUpdated();
		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.configurationService.onDidChangeConfiguration(e => this.onConfigurationUpdated(e)));
	}

	private onConfigurationUpdated(e?: IConfigurationChangeEvent): void {
		if (e && !e.affectsConfiguration('workbench.editor.openPositioning') && !e.affectsConfiguration('workbench.editor.focusRecentEditorAfterClose')) {
			return;
		}

		this.editorOpenPositioning = this.configurationService.getValue('workbench.editor.openPositioning');
		this.focusRecentEditorAfterClose = this.configurationService.getValue('workbench.editor.focusRecentEditorAfterClose');
	}

	get count(): number {
		return this.editors.length;
	}

	get stickyCount(): number {
		return this.sticky + 1;
	}

	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[] {
		const editors = order === EditorsOrder.MOST_RECENTLY_ACTIVE ? this.mru.slice(0) : this.editors.slice(0);

		if (options?.excludeSticky) {

			// MRU: need to check for index on each
			if (order === EditorsOrder.MOST_RECENTLY_ACTIVE) {
				return editors.filter(editor => !this.isSticky(editor));
			}

			// Sequential: simply start after sticky index
			return editors.slice(this.sticky + 1);
		}

		return editors;
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return this.editors[index];
	}

	get activeEditor(): EditorInput | null {
		return this.active;
	}

	isActive(candidate: EditorInput | IUntypedEditorInput): boolean {
		return this.matches(this.active, candidate);
	}

	get previewEditor(): EditorInput | null {
		return this.preview;
	}

	openEditor(candidate: EditorInput, options?: IEditorOpenOptions): IEditorOpenResult {
		const makeSticky = options?.sticky || (typeof options?.index === 'number' && this.isSticky(options.index));
		const makePinned = options?.pinned || options?.sticky;
		const makeTransient = !!options?.transient;
		const makeActive = options?.active || !this.activeEditor || (!makePinned && this.preview === this.activeEditor);

		const existingEditorAndIndex = this.findEditor(candidate, options);

		// New editor
		if (!existingEditorAndIndex) {
			const newEditor = candidate;
			const indexOfActive = this.indexOf(this.active);

			// Insert into specific position
			let targetIndex: number;
			if (options && typeof options.index === 'number') {
				targetIndex = options.index;
			}

			// Insert to the BEGINNING
			else if (this.editorOpenPositioning === EditorOpenPositioning.FIRST) {
				targetIndex = 0;

				// Always make sure targetIndex is after sticky editors
				// unless we are explicitly told to make the editor sticky
				if (!makeSticky && this.isSticky(targetIndex)) {
					targetIndex = this.sticky + 1;
				}
			}

			// Insert to the END
			else if (this.editorOpenPositioning === EditorOpenPositioning.LAST) {
				targetIndex = this.editors.length;
			}

			// Insert to LEFT or RIGHT of active editor
			else {

				// Insert to the LEFT of active editor
				if (this.editorOpenPositioning === EditorOpenPositioning.LEFT) {
					if (indexOfActive === 0 || !this.editors.length) {
						targetIndex = 0; // to the left becoming first editor in list
					} else {
						targetIndex = indexOfActive; // to the left of active editor
					}
				}

				// Insert to the RIGHT of active editor
				else {
					targetIndex = indexOfActive + 1;
				}

				// Always make sure targetIndex is after sticky editors
				// unless we are explicitly told to make the editor sticky
				if (!makeSticky && this.isSticky(targetIndex)) {
					targetIndex = this.sticky + 1;
				}
			}

			// If the editor becomes sticky, increment the sticky index and adjust
			// the targetIndex to be at the end of sticky editors unless already.
			if (makeSticky) {
				this.sticky++;

				if (!this.isSticky(targetIndex)) {
					targetIndex = this.sticky;
				}
			}

			// Insert into our list of editors if pinned or we have no preview editor
			if (makePinned || !this.preview) {
				this.splice(targetIndex, false, newEditor);
			}

			// Handle transient
			if (makeTransient) {
				this.doSetTransient(newEditor, targetIndex, true);
			}

			// Handle preview
			if (!makePinned) {

				// Replace existing preview with this editor if we have a preview
				if (this.preview) {
					const indexOfPreview = this.indexOf(this.preview);
					if (targetIndex > indexOfPreview) {
						targetIndex--; // accomodate for the fact that the preview editor closes
					}

					this.replaceEditor(this.preview, newEditor, targetIndex, !makeActive);
				}

				this.preview = newEditor;
			}

			// Listeners
			this.registerEditorListeners(newEditor);

			// Event
			const event: IGroupEditorOpenEvent = {
				kind: GroupModelChangeKind.EDITOR_OPEN,
				editor: newEditor,
				editorIndex: targetIndex
			};
			this._onDidModelChange.fire(event);

			// Handle active editor / selected editors
			this.setSelection(makeActive ? newEditor : this.activeEditor, options?.inactiveSelection ?? []);

			return {
				editor: newEditor,
				isNew: true
			};
		}

		// Existing editor
		else {
			const [existingEditor, existingEditorIndex] = existingEditorAndIndex;

			// Update transient (existing editors do not turn transient if they were not before)
			this.doSetTransient(existingEditor, existingEditorIndex, makeTransient === false ? false : this.isTransient(existingEditor));

			// Pin it
			if (makePinned) {
				this.doPin(existingEditor, existingEditorIndex);
			}

			// Handle active editor / selected editors
			this.setSelection(makeActive ? existingEditor : this.activeEditor, options?.inactiveSelection ?? []);

			// Respect index
			if (options && typeof options.index === 'number') {
				this.moveEditor(existingEditor, options.index);
			}

			// Stick it (intentionally after the moveEditor call in case
			// the editor was already moved into the sticky range)
			if (makeSticky) {
				this.doStick(existingEditor, this.indexOf(existingEditor));
			}

			return {
				editor: existingEditor,
				isNew: false
			};
		}
	}

	private registerEditorListeners(editor: EditorInput): void {
		const listeners = new DisposableStore();
		this.editorListeners.add(listeners);

		// Re-emit disposal of editor input as our own event
		listeners.add(Event.once(editor.onWillDispose)(() => {
			const editorIndex = this.editors.indexOf(editor);
			if (editorIndex >= 0) {
				const event: IGroupEditorChangeEvent = {
					kind: GroupModelChangeKind.EDITOR_WILL_DISPOSE,
					editor,
					editorIndex
				};
				this._onDidModelChange.fire(event);
			}
		}));

		// Re-Emit dirty state changes
		listeners.add(editor.onDidChangeDirty(() => {
			const event: IGroupEditorChangeEvent = {
				kind: GroupModelChangeKind.EDITOR_DIRTY,
				editor,
				editorIndex: this.editors.indexOf(editor)
			};
			this._onDidModelChange.fire(event);
		}));

		// Re-Emit label changes
		listeners.add(editor.onDidChangeLabel(() => {
			const event: IGroupEditorChangeEvent = {
				kind: GroupModelChangeKind.EDITOR_LABEL,
				editor,
				editorIndex: this.editors.indexOf(editor)
			};
			this._onDidModelChange.fire(event);
		}));

		// Re-Emit capability changes
		listeners.add(editor.onDidChangeCapabilities(() => {
			const event: IGroupEditorChangeEvent = {
				kind: GroupModelChangeKind.EDITOR_CAPABILITIES,
				editor,
				editorIndex: this.editors.indexOf(editor)
			};
			this._onDidModelChange.fire(event);
		}));

		// Clean up dispose listeners once the editor gets closed
		listeners.add(this.onDidModelChange(event => {
			if (event.kind === GroupModelChangeKind.EDITOR_CLOSE && event.editor?.matches(editor)) {
				dispose(listeners);
				this.editorListeners.delete(listeners);
			}
		}));
	}

	private replaceEditor(toReplace: EditorInput, replaceWith: EditorInput, replaceIndex: number, openNext = true): void {
		const closeResult = this.doCloseEditor(toReplace, EditorCloseContext.REPLACE, openNext); // optimization to prevent multiple setActive() in one call

		// We want to first add the new editor into our model before emitting the close event because
		// firing the close event can trigger a dispose on the same editor that is now being added.
		// This can lead into opening a disposed editor which is not what we want.
		this.splice(replaceIndex, false, replaceWith);

		if (closeResult) {
			const event: IGroupEditorCloseEvent = {
				kind: GroupModelChangeKind.EDITOR_CLOSE,
				...closeResult
			};
			this._onDidModelChange.fire(event);
		}
	}

	closeEditor(candidate: EditorInput, context = EditorCloseContext.UNKNOWN, openNext = true): IEditorCloseResult | undefined {
		const closeResult = this.doCloseEditor(candidate, context, openNext);

		if (closeResult) {
			const event: IGroupEditorCloseEvent = {
				kind: GroupModelChangeKind.EDITOR_CLOSE,
				...closeResult
			};
			this._onDidModelChange.fire(event);

			return closeResult;
		}

		return undefined;
	}

	private doCloseEditor(candidate: EditorInput, context: EditorCloseContext, openNext: boolean): IEditorCloseResult | undefined {
		const index = this.indexOf(candidate);
		if (index === -1) {
			return undefined; // not found
		}

		const editor = this.editors[index];
		const sticky = this.isSticky(index);

		// Active editor closed
		const isActiveEditor = this.active === editor;
		if (openNext && isActiveEditor) {

			// More than one editor
			if (this.mru.length > 1) {
				let newActive: EditorInput;
				if (this.focusRecentEditorAfterClose) {
					newActive = this.mru[1]; // active editor is always first in MRU, so pick second editor after as new active
				} else {
					if (index === this.editors.length - 1) {
						newActive = this.editors[index - 1]; // last editor is closed, pick previous as new active
					} else {
						newActive = this.editors[index + 1]; // pick next editor as new active
					}
				}

				// Select editor as active
				const newInactiveSelectedEditors = this.selection.filter(selected => selected !== editor && selected !== newActive);
				this.doSetSelection(newActive, this.editors.indexOf(newActive), newInactiveSelectedEditors);
			}

			// Last editor closed: clear selection
			else {
				this.doSetSelection(null, undefined, []);
			}
		}

		// Inactive editor closed
		else if (!isActiveEditor) {

			// Remove editor from inactive selection
			if (this.doIsSelected(editor)) {
				const newInactiveSelectedEditors = this.selection.filter(selected => selected !== editor && selected !== this.activeEditor);
				this.doSetSelection(this.activeEditor, this.indexOf(this.activeEditor), newInactiveSelectedEditors);
			}
		}

		// Preview Editor closed
		if (this.preview === editor) {
			this.preview = null;
		}

		// Remove from transient
		this.transient.delete(editor);

		// Remove from arrays
		this.splice(index, true);

		// Event
		return { editor, sticky, editorIndex: index, context };
	}

	moveEditor(candidate: EditorInput, toIndex: number): EditorInput | undefined {

		// Ensure toIndex is in bounds of our model
		if (toIndex >= this.editors.length) {
			toIndex = this.editors.length - 1;
		} else if (toIndex < 0) {
			toIndex = 0;
		}

		const index = this.indexOf(candidate);
		if (index < 0 || toIndex === index) {
			return;
		}

		const editor = this.editors[index];
		const sticky = this.sticky;

		// Adjust sticky index: editor moved out of sticky state into unsticky state
		if (this.isSticky(index) && toIndex > this.sticky) {
			this.sticky--;
		}

		// ...or editor moved into sticky state from unsticky state
		else if (!this.isSticky(index) && toIndex <= this.sticky) {
			this.sticky++;
		}

		// Move
		this.editors.splice(index, 1);
		this.editors.splice(toIndex, 0, editor);

		// Move Event
		const event: IGroupEditorMoveEvent = {
			kind: GroupModelChangeKind.EDITOR_MOVE,
			editor,
			oldEditorIndex: index,
			editorIndex: toIndex
		};
		this._onDidModelChange.fire(event);

		// Sticky Event (if sticky changed as part of the move)
		if (sticky !== this.sticky) {
			const event: IGroupEditorChangeEvent = {
				kind: GroupModelChangeKind.EDITOR_STICKY,
				editor,
				editorIndex: toIndex
			};
			this._onDidModelChange.fire(event);
		}

		return editor;
	}

	setActive(candidate: EditorInput | undefined): EditorInput | undefined {
		let result: EditorInput | undefined;

		if (!candidate) {
			this.setGroupActive();
		} else {
			result = this.setEditorActive(candidate);
		}

		return result;
	}

	private setGroupActive(): void {
		// We do not really keep the `active` state in our model because
		// it has no special meaning to us here. But for consistency
		// we emit a `onDidModelChange` event so that components can
		// react.
		this._onDidModelChange.fire({ kind: GroupModelChangeKind.GROUP_ACTIVE });
	}

	private setEditorActive(candidate: EditorInput): EditorInput | undefined {
		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doSetSelection(editor, editorIndex, []);

		return editor;
	}

	get selectedEditors(): EditorInput[] {
		return this.editors.filter(editor => this.doIsSelected(editor)); // return in sequential order
	}

	isSelected(editorCandidateOrIndex: EditorInput | number): boolean {
		let editor: EditorInput | undefined;
		if (typeof editorCandidateOrIndex === 'number') {
			editor = this.editors[editorCandidateOrIndex];
		} else {
			editor = this.findEditor(editorCandidateOrIndex)?.[0];
		}

		return !!editor && this.doIsSelected(editor);
	}

	private doIsSelected(editor: EditorInput): boolean {
		return this.selection.includes(editor);
	}

	setSelection(activeSelectedEditorCandidate: EditorInput, inactiveSelectedEditorCandidates: EditorInput[]): void {
		const res = this.findEditor(activeSelectedEditorCandidate);
		if (!res) {
			return; // not found
		}

		const [activeSelectedEditor, activeSelectedEditorIndex] = res;

		const inactiveSelectedEditors = new Set<EditorInput>();
		for (const inactiveSelectedEditorCandidate of inactiveSelectedEditorCandidates) {
			const res = this.findEditor(inactiveSelectedEditorCandidate);
			if (!res) {
				return; // not found
			}

			const [inactiveSelectedEditor] = res;
			if (inactiveSelectedEditor === activeSelectedEditor) {
				continue; // already selected
			}

			inactiveSelectedEditors.add(inactiveSelectedEditor);
		}

		this.doSetSelection(activeSelectedEditor, activeSelectedEditorIndex, Array.from(inactiveSelectedEditors));
	}

	private doSetSelection(activeSelectedEditor: EditorInput | null, activeSelectedEditorIndex: number | undefined, inactiveSelectedEditors: EditorInput[]): void {
		const previousActiveEditor = this.activeEditor;
		const previousSelection = this.selection;

		let newSelection: EditorInput[];
		if (activeSelectedEditor) {
			newSelection = [activeSelectedEditor, ...inactiveSelectedEditors];
		} else {
			newSelection = [];
		}

		// Update selection
		this.selection = newSelection;

		// Update active editor if it has changed
		const activeEditorChanged = activeSelectedEditor && typeof activeSelectedEditorIndex === 'number' && previousActiveEditor !== activeSelectedEditor;
		if (activeEditorChanged) {

			// Bring to front in MRU list
			const mruIndex = this.indexOf(activeSelectedEditor, this.mru);
			this.mru.splice(mruIndex, 1);
			this.mru.unshift(activeSelectedEditor);

			// Event
			const event: IGroupEditorChangeEvent = {
				kind: GroupModelChangeKind.EDITOR_ACTIVE,
				editor: activeSelectedEditor,
				editorIndex: activeSelectedEditorIndex
			};
			this._onDidModelChange.fire(event);
		}

		// Fire event if the selection has changed
		if (
			activeEditorChanged ||
			previousSelection.length !== newSelection.length ||
			previousSelection.some(editor => !newSelection.includes(editor))
		) {
			const event: IGroupModelChangeEvent = {
				kind: GroupModelChangeKind.EDITORS_SELECTION
			};
			this._onDidModelChange.fire(event);
		}
	}

	setIndex(index: number) {
		// We do not really keep the `index` in our model because
		// it has no special meaning to us here. But for consistency
		// we emit a `onDidModelChange` event so that components can
		// react.
		this._onDidModelChange.fire({ kind: GroupModelChangeKind.GROUP_INDEX });
	}

	setLabel(label: string) {
		// We do not really keep the `label` in our model because
		// it has no special meaning to us here. But for consistency
		// we emit a `onDidModelChange` event so that components can
		// react.
		this._onDidModelChange.fire({ kind: GroupModelChangeKind.GROUP_LABEL });
	}

	pin(candidate: EditorInput): EditorInput | undefined {
		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doPin(editor, editorIndex);

		return editor;
	}

	private doPin(editor: EditorInput, editorIndex: number): void {
		if (this.isPinned(editor)) {
			return; // can only pin a preview editor
		}

		// Clear Transient
		this.setTransient(editor, false);

		// Convert the preview editor to be a pinned editor
		this.preview = null;

		// Event
		const event: IGroupEditorChangeEvent = {
			kind: GroupModelChangeKind.EDITOR_PIN,
			editor,
			editorIndex
		};
		this._onDidModelChange.fire(event);
	}

	unpin(candidate: EditorInput): EditorInput | undefined {
		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doUnpin(editor, editorIndex);

		return editor;
	}

	private doUnpin(editor: EditorInput, editorIndex: number): void {
		if (!this.isPinned(editor)) {
			return; // can only unpin a pinned editor
		}

		// Set new
		const oldPreview = this.preview;
		this.preview = editor;

		// Event
		const event: IGroupEditorChangeEvent = {
			kind: GroupModelChangeKind.EDITOR_PIN,
			editor,
			editorIndex
		};
		this._onDidModelChange.fire(event);

		// Close old preview editor if any
		if (oldPreview) {
			this.closeEditor(oldPreview, EditorCloseContext.UNPIN);
		}
	}

	isPinned(editorCandidateOrIndex: EditorInput | number): boolean {
		let editor: EditorInput;
		if (typeof editorCandidateOrIndex === 'number') {
			editor = this.editors[editorCandidateOrIndex];
		} else {
			editor = editorCandidateOrIndex;
		}

		return !this.matches(this.preview, editor);
	}

	stick(candidate: EditorInput): EditorInput | undefined {
		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doStick(editor, editorIndex);

		return editor;
	}

	private doStick(editor: EditorInput, editorIndex: number): void {
		if (this.isSticky(editorIndex)) {
			return; // can only stick a non-sticky editor
		}

		// Pin editor
		this.pin(editor);

		// Move editor to be the last sticky editor
		const newEditorIndex = this.sticky + 1;
		this.moveEditor(editor, newEditorIndex);

		// Adjust sticky index
		this.sticky++;

		// Event
		const event: IGroupEditorChangeEvent = {
			kind: GroupModelChangeKind.EDITOR_STICKY,
			editor,
			editorIndex: newEditorIndex
		};
		this._onDidModelChange.fire(event);
	}

	unstick(candidate: EditorInput): EditorInput | undefined {
		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doUnstick(editor, editorIndex);

		return editor;
	}

	private doUnstick(editor: EditorInput, editorIndex: number): void {
		if (!this.isSticky(editorIndex)) {
			return; // can only unstick a sticky editor
		}

		// Move editor to be the first non-sticky editor
		const newEditorIndex = this.sticky;
		this.moveEditor(editor, newEditorIndex);

		// Adjust sticky index
		this.sticky--;

		// Event
		const event: IGroupEditorChangeEvent = {
			kind: GroupModelChangeKind.EDITOR_STICKY,
			editor,
			editorIndex: newEditorIndex
		};
		this._onDidModelChange.fire(event);
	}

	isSticky(candidateOrIndex: EditorInput | number): boolean {
		if (this.sticky < 0) {
			return false; // no sticky editor
		}

		let index: number;
		if (typeof candidateOrIndex === 'number') {
			index = candidateOrIndex;
		} else {
			index = this.indexOf(candidateOrIndex);
		}

		if (index < 0) {
			return false;
		}

		return index <= this.sticky;
	}

	setTransient(candidate: EditorInput, transient: boolean): EditorInput | undefined {
		if (!transient && this.transient.size === 0) {
			return; // no transient editor
		}

		const res = this.findEditor(candidate);
		if (!res) {
			return; // not found
		}

		const [editor, editorIndex] = res;

		this.doSetTransient(editor, editorIndex, transient);

		return editor;
	}

	private doSetTransient(editor: EditorInput, editorIndex: number, transient: boolean): void {
		if (transient) {
			if (this.transient.has(editor)) {
				return;
			}

			this.transient.add(editor);
		} else {
			if (!this.transient.has(editor)) {
				return;
			}

			this.transient.delete(editor);
		}

		// Event
		const event: IGroupEditorChangeEvent = {
			kind: GroupModelChangeKind.EDITOR_TRANSIENT,
			editor,
			editorIndex
		};
		this._onDidModelChange.fire(event);
	}

	isTransient(editorCandidateOrIndex: EditorInput | number): boolean {
		if (this.transient.size === 0) {
			return false; // no transient editor
		}

		let editor: EditorInput | undefined;
		if (typeof editorCandidateOrIndex === 'number') {
			editor = this.editors[editorCandidateOrIndex];
		} else {
			editor = this.findEditor(editorCandidateOrIndex)?.[0];
		}

		return !!editor && this.transient.has(editor);
	}

	private splice(index: number, del: boolean, editor?: EditorInput): void {
		const editorToDeleteOrReplace = this.editors[index];

		// Perform on sticky index
		if (del && this.isSticky(index)) {
			this.sticky--;
		}

		// Perform on editors array
		if (editor) {
			this.editors.splice(index, del ? 1 : 0, editor);
		} else {
			this.editors.splice(index, del ? 1 : 0);
		}

		// Perform on MRU
		{
			// Add
			if (!del && editor) {
				if (this.mru.length === 0) {
					// the list of most recent editors is empty
					// so this editor can only be the most recent
					this.mru.push(editor);
				} else {
					// we have most recent editors. as such we
					// put this newly opened editor right after
					// the current most recent one because it cannot
					// be the most recently active one unless
					// it becomes active. but it is still more
					// active then any other editor in the list.
					this.mru.splice(1, 0, editor);
				}
			}

			// Remove / Replace
			else {
				const indexInMRU = this.indexOf(editorToDeleteOrReplace, this.mru);

				// Remove
				if (del && !editor) {
					this.mru.splice(indexInMRU, 1); // remove from MRU
				}

				// Replace
				else if (del && editor) {
					this.mru.splice(indexInMRU, 1, editor); // replace MRU at location
				}
			}
		}
	}

	indexOf(candidate: EditorInput | IUntypedEditorInput | null, editors = this.editors, options?: IMatchEditorOptions): number {
		let index = -1;
		if (!candidate) {
			return index;
		}

		for (let i = 0; i < editors.length; i++) {
			const editor = editors[i];

			if (this.matches(editor, candidate, options)) {
				// If we are to support side by side matching, it is possible that
				// a better direct match is found later. As such, we continue finding
				// a matching editor and prefer that match over the side by side one.
				if (options?.supportSideBySide && editor instanceof SideBySideEditorInput && !(candidate instanceof SideBySideEditorInput)) {
					index = i;
				} else {
					index = i;
					break;
				}
			}
		}

		return index;
	}

	findEditor(candidate: EditorInput | null, options?: IMatchEditorOptions): [EditorInput, number /* index */] | undefined {
		const index = this.indexOf(candidate, this.editors, options);
		if (index === -1) {
			return undefined;
		}

		return [this.editors[index], index];
	}

	isFirst(candidate: EditorInput | null, editors = this.editors): boolean {
		return this.matches(editors[0], candidate);
	}

	isLast(candidate: EditorInput | null, editors = this.editors): boolean {
		return this.matches(editors[editors.length - 1], candidate);
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean {
		return this.indexOf(candidate, this.editors, options) !== -1;
	}

	private matches(editor: EditorInput | null | undefined, candidate: EditorInput | IUntypedEditorInput | null, options?: IMatchEditorOptions): boolean {
		if (!editor || !candidate) {
			return false;
		}

		if (options?.supportSideBySide && editor instanceof SideBySideEditorInput && !(candidate instanceof SideBySideEditorInput)) {
			switch (options.supportSideBySide) {
				case SideBySideEditor.ANY:
					if (this.matches(editor.primary, candidate, options) || this.matches(editor.secondary, candidate, options)) {
						return true;
					}
					break;
				case SideBySideEditor.BOTH:
					if (this.matches(editor.primary, candidate, options) && this.matches(editor.secondary, candidate, options)) {
						return true;
					}
					break;
			}
		}

		const strictEquals = editor === candidate;

		if (options?.strictEquals) {
			return strictEquals;
		}

		return strictEquals || editor.matches(candidate);
	}

	get isLocked(): boolean {
		return this.locked;
	}

	lock(locked: boolean): void {
		if (this.isLocked !== locked) {
			this.locked = locked;

			this._onDidModelChange.fire({ kind: GroupModelChangeKind.GROUP_LOCKED });
		}
	}

	clone(): EditorGroupModel {
		const clone = this.instantiationService.createInstance(EditorGroupModel, undefined);

		// Copy over group properties
		clone.editors = this.editors.slice(0);
		clone.mru = this.mru.slice(0);
		clone.preview = this.preview;
		clone.selection = this.selection.slice(0);
		clone.sticky = this.sticky;

		// Ensure to register listeners for each editor
		for (const editor of clone.editors) {
			clone.registerEditorListeners(editor);
		}

		return clone;
	}

	serialize(): ISerializedEditorGroupModel {
		const registry = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory);

		// Serialize all editor inputs so that we can store them.
		// Editors that cannot be serialized need to be ignored
		// from mru, active, preview and sticky if any.
		const serializableEditors: EditorInput[] = [];
		const serializedEditors: ISerializedEditorInput[] = [];
		let serializablePreviewIndex: number | undefined;
		let serializableSticky = this.sticky;

		for (let i = 0; i < this.editors.length; i++) {
			const editor = this.editors[i];
			let canSerializeEditor = false;

			const editorSerializer = registry.getEditorSerializer(editor);
			if (editorSerializer) {
				const value = editorSerializer.canSerialize(editor) ? editorSerializer.serialize(editor) : undefined;

				// Editor can be serialized
				if (typeof value === 'string') {
					canSerializeEditor = true;

					serializedEditors.push({ id: editor.typeId, value });
					serializableEditors.push(editor);

					if (this.preview === editor) {
						serializablePreviewIndex = serializableEditors.length - 1;
					}
				}

				// Editor cannot be serialized
				else {
					canSerializeEditor = false;
				}
			}

			// Adjust index of sticky editors if the editor cannot be serialized and is pinned
			if (!canSerializeEditor && this.isSticky(i)) {
				serializableSticky--;
			}
		}

		const serializableMru = this.mru.map(editor => this.indexOf(editor, serializableEditors)).filter(i => i >= 0);

		return {
			id: this.id,
			locked: this.locked ? true : undefined,
			editors: serializedEditors,
			mru: serializableMru,
			preview: serializablePreviewIndex,
			sticky: serializableSticky >= 0 ? serializableSticky : undefined
		};
	}

	private deserialize(data: ISerializedEditorGroupModel): number {
		const registry = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory);

		if (typeof data.id === 'number') {
			this._id = data.id;

			EditorGroupModel.IDS = Math.max(data.id + 1, EditorGroupModel.IDS); // make sure our ID generator is always larger
		} else {
			this._id = EditorGroupModel.IDS++; // backwards compatibility
		}

		if (data.locked) {
			this.locked = true;
		}

		this.editors = coalesce(data.editors.map((e, index) => {
			let editor: EditorInput | undefined;

			const editorSerializer = registry.getEditorSerializer(e.id);
			if (editorSerializer) {
				const deserializedEditor = editorSerializer.deserialize(this.instantiationService, e.value);
				if (deserializedEditor instanceof EditorInput) {
					editor = deserializedEditor;
					this.registerEditorListeners(editor);
				}
			}

			if (!editor && typeof data.sticky === 'number' && index <= data.sticky) {
				data.sticky--; // if editor cannot be deserialized but was sticky, we need to decrease sticky index
			}

			return editor;
		}));

		this.mru = coalesce(data.mru.map(i => this.editors[i]));

		this.selection = this.mru.length > 0 ? [this.mru[0]] : [];

		if (typeof data.preview === 'number') {
			this.preview = this.editors[data.preview];
		}

		if (typeof data.sticky === 'number') {
			this.sticky = data.sticky;
		}

		return this._id;
	}

	override dispose(): void {
		dispose(Array.from(this.editorListeners));
		this.editorListeners.clear();

		this.transient.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/editorInput.ts]---
Location: vscode-main/src/vs/workbench/common/editor/editorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { EditorInputCapabilities, Verbosity, GroupIdentifier, ISaveOptions, IRevertOptions, IMoveResult, IEditorDescriptor, IEditorPane, IUntypedEditorInput, EditorResourceAccessor, AbstractEditorInput, isEditorInput, IEditorIdentifier } from '../editor.js';
import { isEqual } from '../../../base/common/resources.js';
import { ConfirmResult } from '../../../platform/dialogs/common/dialogs.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../base/common/themables.js';

export interface IEditorCloseHandler {

	/**
	 * If `true`, will call into the `confirm` method to ask for confirmation
	 * before closing the editor.
	 */
	showConfirm(): boolean;

	/**
	 * Allows an editor to control what should happen when the editor
	 * (or a list of editor of the same kind) is being closed.
	 *
	 * By default a file specific dialog will open if the editor is
	 * dirty and not in the process of saving.
	 *
	 * If the editor is not dealing with files or another condition
	 * should be used besides dirty state, this method should be
	 * implemented to show a different dialog.
	 *
	 * @param editors All editors of the same kind that are being closed. Should be used
	 * to show a combined dialog.
	 */
	confirm(editors: ReadonlyArray<IEditorIdentifier>): Promise<ConfirmResult>;
}

export interface IUntypedEditorOptions {

	/**
	 * Implementations should try to preserve as much
	 * view state as possible from the typed input based
	 * on the group the editor is opened.
	 */
	readonly preserveViewState?: GroupIdentifier;

	/**
	 * Implementations should preserve the original
	 * resource of the typed input and not alter
	 * it.
	 */
	readonly preserveResource?: boolean;
}

/**
 * Editor inputs are lightweight objects that can be passed to the workbench API to open inside the editor part.
 * Each editor input is mapped to an editor that is capable of opening it through the Platform facade.
 */
export abstract class EditorInput extends AbstractEditorInput {

	protected readonly _onDidChangeDirty = this._register(new Emitter<void>());
	protected readonly _onDidChangeLabel = this._register(new Emitter<void>());
	protected readonly _onDidChangeCapabilities = this._register(new Emitter<void>());

	private readonly _onWillDispose = this._register(new Emitter<void>());

	/**
	 * Triggered when this input changes its dirty state.
	 */
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	/**
	 * Triggered when this input changes its label
	 */
	readonly onDidChangeLabel = this._onDidChangeLabel.event;

	/**
	 * Triggered when this input changes its capabilities.
	 */
	readonly onDidChangeCapabilities = this._onDidChangeCapabilities.event;

	/**
	 * Triggered when this input is about to be disposed.
	 */
	readonly onWillDispose = this._onWillDispose.event;

	/**
	 * Optional: subclasses can override to implement
	 * custom confirmation on close behavior.
	 */
	readonly closeHandler?: IEditorCloseHandler;

	/**
	 * Unique type identifier for this input. Every editor input of the
	 * same class should share the same type identifier. The type identifier
	 * is used for example for serialising/deserialising editor inputs
	 * via the serialisers of the `EditorInputFactoryRegistry`.
	 */
	abstract get typeId(): string;

	/**
	 * Returns the optional associated resource of this input.
	 *
	 * This resource should be unique for all editors of the same
	 * kind and input and is often used to identify the editor input among
	 * others.
	 *
	 * **Note:** DO NOT use this property for anything but identity
	 * checks. DO NOT use this property to present as label to the user.
	 * Please refer to `EditorResourceAccessor` documentation in that case.
	 */
	abstract get resource(): URI | undefined;

	/**
	 * Identifies the type of editor this input represents
	 * This ID is registered with the {@link EditorResolverService} to allow
	 * for resolving an untyped input to a typed one
	 */
	get editorId(): string | undefined {
		return undefined;
	}

	/**
	 * The capabilities of the input.
	 */
	get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly;
	}

	/**
	 * Figure out if the input has the provided capability.
	 */
	hasCapability(capability: EditorInputCapabilities): boolean {
		if (capability === EditorInputCapabilities.None) {
			return this.capabilities === EditorInputCapabilities.None;
		}

		return (this.capabilities & capability) !== 0;
	}

	isReadonly(): boolean | IMarkdownString {
		return this.hasCapability(EditorInputCapabilities.Readonly);
	}

	/**
	 * Returns the display name of this input.
	 */
	getName(): string {
		return `Editor ${this.typeId}`;
	}

	/**
	 * Returns the display description of this input.
	 */
	getDescription(verbosity?: Verbosity): string | undefined {
		return undefined;
	}

	/**
	 * Returns the display title of this input.
	 */
	getTitle(verbosity?: Verbosity): string {
		return this.getName();
	}

	/**
	 * Returns the extra classes to apply to the label of this input.
	 */
	getLabelExtraClasses(): string[] {
		return [];
	}

	/**
	 * Returns the aria label to be read out by a screen reader.
	 */
	getAriaLabel(): string {
		return this.getTitle(Verbosity.SHORT);
	}

	/**
	 * Returns the icon which represents this editor input.
	 * If undefined, the default icon will be used.
	 */
	getIcon(): ThemeIcon | URI | undefined {
		return undefined;
	}

	/**
	 * Returns a descriptor suitable for telemetry events.
	 *
	 * Subclasses should extend if they can contribute.
	 */
	getTelemetryDescriptor(): { [key: string]: unknown } {
		/* __GDPR__FRAGMENT__
			"EditorTelemetryDescriptor" : {
				"typeId" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
			}
		*/
		return { typeId: this.typeId };
	}

	/**
	 * Returns if this input is dirty or not.
	 */
	isDirty(): boolean {
		return false;
	}

	/**
	 * Returns if the input has unsaved changes.
	 */
	isModified(): boolean {
		return this.isDirty();
	}

	/**
	 * Returns if this input is currently being saved or soon to be
	 * saved. Based on this assumption the editor may for example
	 * decide to not signal the dirty state to the user assuming that
	 * the save is scheduled to happen anyway.
	 */
	isSaving(): boolean {
		return false;
	}

	/**
	 * Returns a type of `IDisposable` that represents the resolved input.
	 * Subclasses should override to provide a meaningful model or return
	 * `null` if the editor does not require a model.
	 *
	 * The `options` parameter are passed down from the editor when the
	 * input is resolved as part of it.
	 */
	async resolve(): Promise<IDisposable | null> {
		return null;
	}

	/**
	 * Saves the editor. The provided groupId helps implementors
	 * to e.g. preserve view state of the editor and re-open it
	 * in the correct group after saving.
	 *
	 * @returns the resulting editor input (typically the same) of
	 * this operation or `undefined` to indicate that the operation
	 * failed or was canceled.
	 */
	async save(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		return this;
	}

	/**
	 * Saves the editor to a different location. The provided `group`
	 * helps implementors to e.g. preserve view state of the editor
	 * and re-open it in the correct group after saving.
	 *
	 * @returns the resulting editor input (typically a different one)
	 * of this operation or `undefined` to indicate that the operation
	 * failed or was canceled.
	 */
	async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		return this;
	}

	/**
	 * Reverts this input from the provided group.
	 */
	async revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> { }

	/**
	 * Called to determine how to handle a resource that is renamed that matches
	 * the editors resource (or is a child of).
	 *
	 * Implementors are free to not implement this method to signal no intent
	 * to participate. If an editor is returned though, it will replace the
	 * current one with that editor and optional options.
	 */
	async rename(group: GroupIdentifier, target: URI): Promise<IMoveResult | undefined> {
		return undefined;
	}

	/**
	 * Returns a copy of the current editor input. Used when we can't just reuse the input
	 */
	copy(): EditorInput {
		return this;
	}

	/**
	 * Indicates if this editor can be moved to another group. By default
	 * editors can freely be moved around groups. If an editor cannot be
	 * moved, a message should be returned to show to the user.
	 *
	 * @returns `true` if the editor can be moved to the target group, or
	 * a string with a message to show to the user if the editor cannot be
	 * moved.
	 */
	canMove(sourceGroup: GroupIdentifier, targetGroup: GroupIdentifier): true | string {
		return true;
	}

	/**
	 * Indicates if this editor can be reopened after being closed. By default
	 * editors can be reopened. Subclasses can override to prevent this.
	 *
	 * @returns `true` if the editor can be reopened after being closed.
	 */
	canReopen(): boolean {
		return true;
	}

	/**
	 * Returns if the other object matches this input.
	 */
	matches(otherInput: EditorInput | IUntypedEditorInput): boolean {

		// Typed inputs: via  === check
		if (isEditorInput(otherInput)) {
			return this === otherInput;
		}

		// Untyped inputs: go into properties
		const otherInputEditorId = otherInput.options?.override;

		// If the overrides are both defined and don't match that means they're separate inputs
		if (this.editorId !== otherInputEditorId && otherInputEditorId !== undefined && this.editorId !== undefined) {
			return false;
		}

		return isEqual(this.resource, EditorResourceAccessor.getCanonicalUri(otherInput));
	}

	/**
	 * If a editor was registered onto multiple editor panes, this method
	 * will be asked to return the preferred one to use.
	 *
	 * @param editorPanes a list of editor pane descriptors that are candidates
	 * for the editor to open in.
	 */
	prefersEditorPane<T extends IEditorDescriptor<IEditorPane>>(editorPanes: T[]): T | undefined {
		return editorPanes.at(0);
	}

	/**
	 * Returns a representation of this typed editor input as untyped
	 * resource editor input that e.g. can be used to serialize the
	 * editor input into a form that it can be restored.
	 *
	 * May return `undefined` if an untyped representation is not supported.
	 */
	toUntyped(options?: IUntypedEditorOptions): IUntypedEditorInput | undefined {
		return undefined;
	}

	/**
	 * Returns if this editor is disposed.
	 */
	isDisposed(): boolean {
		return this._store.isDisposed;
	}

	override dispose(): void {
		if (!this.isDisposed()) {
			this._onWillDispose.fire();
		}

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/editorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/editorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';

/**
 * The editor model is the heavyweight counterpart of editor input. Depending on the editor input, it
 * resolves from a file system retrieve content and may allow for saving it back or reverting it.
 * Editor models are typically cached for some while because they are expensive to construct.
 */
export class EditorModel extends Disposable {

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	private resolved = false;

	/**
	 * Causes this model to resolve returning a promise when loading is completed.
	 */
	async resolve(): Promise<void> {
		this.resolved = true;
	}

	/**
	 * Returns whether this model was loaded or not.
	 */
	isResolved(): boolean {
		return this.resolved;
	}

	/**
	 * Find out if this model has been disposed.
	 */
	isDisposed(): boolean {
		return this._store.isDisposed;
	}

	/**
	 * Subclasses should implement to free resources that have been claimed through loading.
	 */
	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/editorOptions.ts]---
Location: vscode-main/src/vs/workbench/common/editor/editorOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange } from '../../../editor/common/core/range.js';
import { ICodeEditorViewState, IDiffEditorViewState, IEditor, ScrollType } from '../../../editor/common/editorCommon.js';
import { ITextEditorOptions, TextEditorSelectionRevealType, TextEditorSelectionSource } from '../../../platform/editor/common/editor.js';
import { isTextEditorViewState } from '../editor.js';

export function applyTextEditorOptions(options: ITextEditorOptions, editor: IEditor, scrollType: ScrollType): boolean {
	let applied = false;

	// Restore view state if any
	const viewState = massageEditorViewState(options);
	if (isTextEditorViewState(viewState)) {
		editor.restoreViewState(viewState);

		applied = true;
	}

	// Restore selection if any
	if (options.selection) {
		const range: IRange = {
			startLineNumber: options.selection.startLineNumber,
			startColumn: options.selection.startColumn,
			endLineNumber: options.selection.endLineNumber ?? options.selection.startLineNumber,
			endColumn: options.selection.endColumn ?? options.selection.startColumn
		};

		// Apply selection with a source so that listeners can
		// distinguish this selection change from others.
		// If no source is provided, set a default source to
		// signal this navigation.
		editor.setSelection(range, options.selectionSource ?? TextEditorSelectionSource.NAVIGATION);

		// Reveal selection
		if (options.selectionRevealType === TextEditorSelectionRevealType.NearTop) {
			editor.revealRangeNearTop(range, scrollType);
		} else if (options.selectionRevealType === TextEditorSelectionRevealType.NearTopIfOutsideViewport) {
			editor.revealRangeNearTopIfOutsideViewport(range, scrollType);
		} else if (options.selectionRevealType === TextEditorSelectionRevealType.CenterIfOutsideViewport) {
			editor.revealRangeInCenterIfOutsideViewport(range, scrollType);
		} else {
			editor.revealRangeInCenter(range, scrollType);
		}

		applied = true;
	}

	return applied;
}

function massageEditorViewState(options: ITextEditorOptions): object | undefined {

	// Without a selection or view state, just return immediately
	if (!options.selection || !options.viewState) {
		return options.viewState;
	}

	// Diff editor: since we have an explicit selection, clear the
	// cursor state from the modified side where the selection
	// applies. This avoids a redundant selection change event.
	const candidateDiffViewState = options.viewState as IDiffEditorViewState;
	if (candidateDiffViewState.modified) {
		candidateDiffViewState.modified.cursorState = [];

		return candidateDiffViewState;
	}

	// Code editor: since we have an explicit selection, clear the
	// cursor state. This avoids a redundant selection change event.
	const candidateEditorViewState = options.viewState as ICodeEditorViewState;
	if (candidateEditorViewState.cursorState) {
		candidateEditorViewState.cursorState = [];
	}

	return candidateEditorViewState;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/filteredEditorGroupModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/filteredEditorGroupModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUntypedEditorInput, IMatchEditorOptions, EditorsOrder, GroupIdentifier } from '../editor.js';
import { EditorInput } from './editorInput.js';
import { Emitter } from '../../../base/common/event.js';
import { IGroupModelChangeEvent, IReadonlyEditorGroupModel } from './editorGroupModel.js';
import { Disposable } from '../../../base/common/lifecycle.js';

abstract class FilteredEditorGroupModel extends Disposable implements IReadonlyEditorGroupModel {

	private readonly _onDidModelChange = this._register(new Emitter<IGroupModelChangeEvent>());
	readonly onDidModelChange = this._onDidModelChange.event;

	constructor(
		protected readonly model: IReadonlyEditorGroupModel
	) {
		super();

		this._register(this.model.onDidModelChange(e => {
			const candidateOrIndex = e.editorIndex ?? e.editor;
			if (candidateOrIndex !== undefined) {
				if (!this.filter(candidateOrIndex)) {
					return; // exclude events for excluded items
				}
			}
			this._onDidModelChange.fire(e);
		}));
	}

	get id(): GroupIdentifier { return this.model.id; }
	get isLocked(): boolean { return this.model.isLocked; }
	get stickyCount(): number { return this.model.stickyCount; }

	get activeEditor(): EditorInput | null { return this.model.activeEditor && this.filter(this.model.activeEditor) ? this.model.activeEditor : null; }
	get previewEditor(): EditorInput | null { return this.model.previewEditor && this.filter(this.model.previewEditor) ? this.model.previewEditor : null; }
	get selectedEditors(): EditorInput[] { return this.model.selectedEditors.filter(e => this.filter(e)); }

	isPinned(editorOrIndex: EditorInput | number): boolean { return this.model.isPinned(editorOrIndex); }
	isTransient(editorOrIndex: EditorInput | number): boolean { return this.model.isTransient(editorOrIndex); }
	isSticky(editorOrIndex: EditorInput | number): boolean { return this.model.isSticky(editorOrIndex); }
	isActive(editor: EditorInput | IUntypedEditorInput): boolean { return this.model.isActive(editor); }
	isSelected(editorOrIndex: EditorInput | number): boolean { return this.model.isSelected(editorOrIndex); }

	isFirst(editor: EditorInput): boolean {
		return this.model.isFirst(editor, this.getEditors(EditorsOrder.SEQUENTIAL));
	}

	isLast(editor: EditorInput): boolean {
		return this.model.isLast(editor, this.getEditors(EditorsOrder.SEQUENTIAL));
	}

	getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[] {
		const editors = this.model.getEditors(order, options);
		return editors.filter(e => this.filter(e));
	}

	findEditor(candidate: EditorInput | null, options?: IMatchEditorOptions): [EditorInput, number] | undefined {
		const result = this.model.findEditor(candidate, options);
		if (!result) {
			return undefined;
		}
		return this.filter(result[1]) ? result : undefined;
	}

	abstract get count(): number;

	abstract getEditorByIndex(index: number): EditorInput | undefined;
	abstract indexOf(editor: EditorInput | IUntypedEditorInput | null, editors?: EditorInput[], options?: IMatchEditorOptions): number;
	abstract contains(editor: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean;

	protected abstract filter(editorOrIndex: EditorInput | number): boolean;
}

export class StickyEditorGroupModel extends FilteredEditorGroupModel {
	get count(): number { return this.model.stickyCount; }

	override getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[] {
		if (options?.excludeSticky) {
			return [];
		}
		if (order === EditorsOrder.SEQUENTIAL) {
			return this.model.getEditors(EditorsOrder.SEQUENTIAL).slice(0, this.model.stickyCount);
		}
		return super.getEditors(order, options);
	}

	override isSticky(editorOrIndex: number | EditorInput): boolean {
		return true;
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return index < this.count ? this.model.getEditorByIndex(index) : undefined;
	}

	indexOf(editor: EditorInput | IUntypedEditorInput | null, editors?: EditorInput[], options?: IMatchEditorOptions): number {
		const editorIndex = this.model.indexOf(editor, editors, options);
		if (editorIndex < 0 || editorIndex >= this.model.stickyCount) {
			return -1;
		}
		return editorIndex;
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean {
		const editorIndex = this.model.indexOf(candidate, undefined, options);
		return editorIndex >= 0 && editorIndex < this.model.stickyCount;
	}

	protected filter(candidateOrIndex: EditorInput | number): boolean {
		return this.model.isSticky(candidateOrIndex);
	}
}

export class UnstickyEditorGroupModel extends FilteredEditorGroupModel {
	get count(): number { return this.model.count - this.model.stickyCount; }
	override get stickyCount(): number { return 0; }

	override isSticky(editorOrIndex: number | EditorInput): boolean {
		return false;
	}

	override getEditors(order: EditorsOrder, options?: { excludeSticky?: boolean }): EditorInput[] {
		if (order === EditorsOrder.SEQUENTIAL) {
			return this.model.getEditors(EditorsOrder.SEQUENTIAL).slice(this.model.stickyCount);
		}
		return super.getEditors(order, options);
	}

	getEditorByIndex(index: number): EditorInput | undefined {
		return index >= 0 ? this.model.getEditorByIndex(index + this.model.stickyCount) : undefined;
	}

	indexOf(editor: EditorInput | IUntypedEditorInput | null, editors?: EditorInput[], options?: IMatchEditorOptions): number {
		const editorIndex = this.model.indexOf(editor, editors, options);
		if (editorIndex < this.model.stickyCount || editorIndex >= this.model.count) {
			return -1;
		}
		return editorIndex - this.model.stickyCount;
	}

	contains(candidate: EditorInput | IUntypedEditorInput, options?: IMatchEditorOptions): boolean {
		const editorIndex = this.model.indexOf(candidate, undefined, options);
		return editorIndex >= this.model.stickyCount && editorIndex < this.model.count;
	}

	protected filter(candidateOrIndex: EditorInput | number): boolean {
		return !this.model.isSticky(candidateOrIndex);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/resourceEditorInput.ts]---
Location: vscode-main/src/vs/workbench/common/editor/resourceEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Verbosity, EditorInputWithPreferredResource, EditorInputCapabilities, IFileLimitedEditorInputOptions } from '../editor.js';
import { EditorInput } from './editorInput.js';
import { URI } from '../../../base/common/uri.js';
import { ByteSize, IFileReadLimits, IFileService, getLargeFileConfirmationLimit } from '../../../platform/files/common/files.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { dirname, isEqual } from '../../../base/common/resources.js';
import { IFilesConfigurationService } from '../../services/filesConfiguration/common/filesConfigurationService.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { isConfigured } from '../../../platform/configuration/common/configuration.js';
import { ITextResourceConfigurationService } from '../../../editor/common/services/textResourceConfiguration.js';
import { ICustomEditorLabelService } from '../../services/editor/common/customEditorLabelService.js';

/**
 * The base class for all editor inputs that open resources.
 */
export abstract class AbstractResourceEditorInput extends EditorInput implements EditorInputWithPreferredResource {

	override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.CanSplitInGroup;

		if (this.fileService.hasProvider(this.resource)) {
			if (this.filesConfigurationService.isReadonly(this.resource)) {
				capabilities |= EditorInputCapabilities.Readonly;
			}
		} else {
			capabilities |= EditorInputCapabilities.Untitled;
		}

		if (!(capabilities & EditorInputCapabilities.Readonly)) {
			capabilities |= EditorInputCapabilities.CanDropIntoEditor;
		}

		return capabilities;
	}

	private _preferredResource: URI;
	get preferredResource(): URI { return this._preferredResource; }

	constructor(
		readonly resource: URI,
		preferredResource: URI | undefined,
		@ILabelService protected readonly labelService: ILabelService,
		@IFileService protected readonly fileService: IFileService,
		@IFilesConfigurationService protected readonly filesConfigurationService: IFilesConfigurationService,
		@ITextResourceConfigurationService protected readonly textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService protected readonly customEditorLabelService: ICustomEditorLabelService
	) {
		super();

		this._preferredResource = preferredResource || resource;

		this.registerListeners();
	}

	private registerListeners(): void {

		// Clear our labels on certain label related events
		this._register(this.labelService.onDidChangeFormatters(e => this.onLabelEvent(e.scheme)));
		this._register(this.fileService.onDidChangeFileSystemProviderRegistrations(e => this.onLabelEvent(e.scheme)));
		this._register(this.fileService.onDidChangeFileSystemProviderCapabilities(e => this.onLabelEvent(e.scheme)));
		this._register(this.customEditorLabelService.onDidChange(() => this.updateLabel()));
		this._register(this.filesConfigurationService.onDidChangeReadonly(() => this._onDidChangeCapabilities.fire()));
	}

	private onLabelEvent(scheme: string): void {
		if (scheme === this._preferredResource.scheme) {
			this.updateLabel();
		}
	}

	private updateLabel(): void {

		// Clear any cached labels from before
		this._name = undefined;
		this._shortDescription = undefined;
		this._mediumDescription = undefined;
		this._longDescription = undefined;
		this._shortTitle = undefined;
		this._mediumTitle = undefined;
		this._longTitle = undefined;

		// Trigger recompute of label
		this._onDidChangeLabel.fire();
	}

	setPreferredResource(preferredResource: URI): void {
		if (!isEqual(preferredResource, this._preferredResource)) {
			this._preferredResource = preferredResource;

			this.updateLabel();
		}
	}

	private _name: string | undefined = undefined;
	override getName(): string {
		if (typeof this._name !== 'string') {
			this._name = this.customEditorLabelService.getName(this._preferredResource) ?? this.labelService.getUriBasenameLabel(this._preferredResource);
		}

		return this._name;
	}

	override getDescription(verbosity = Verbosity.MEDIUM): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.shortDescription;
			case Verbosity.LONG:
				return this.longDescription;
			case Verbosity.MEDIUM:
			default:
				return this.mediumDescription;
		}
	}

	private _shortDescription: string | undefined = undefined;
	private get shortDescription(): string {
		if (typeof this._shortDescription !== 'string') {
			this._shortDescription = this.labelService.getUriBasenameLabel(dirname(this._preferredResource));
		}

		return this._shortDescription;
	}

	private _mediumDescription: string | undefined = undefined;
	private get mediumDescription(): string {
		if (typeof this._mediumDescription !== 'string') {
			this._mediumDescription = this.labelService.getUriLabel(dirname(this._preferredResource), { relative: true });
		}

		return this._mediumDescription;
	}

	private _longDescription: string | undefined = undefined;
	private get longDescription(): string {
		if (typeof this._longDescription !== 'string') {
			this._longDescription = this.labelService.getUriLabel(dirname(this._preferredResource));
		}

		return this._longDescription;
	}

	private _shortTitle: string | undefined = undefined;
	private get shortTitle(): string {
		if (typeof this._shortTitle !== 'string') {
			this._shortTitle = this.getName();
		}

		return this._shortTitle;
	}

	private _mediumTitle: string | undefined = undefined;
	private get mediumTitle(): string {
		if (typeof this._mediumTitle !== 'string') {
			this._mediumTitle = this.labelService.getUriLabel(this._preferredResource, { relative: true });
		}

		return this._mediumTitle;
	}

	private _longTitle: string | undefined = undefined;
	private get longTitle(): string {
		if (typeof this._longTitle !== 'string') {
			this._longTitle = this.labelService.getUriLabel(this._preferredResource);
		}

		return this._longTitle;
	}

	override getTitle(verbosity?: Verbosity): string {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.shortTitle;
			case Verbosity.LONG:
				return this.longTitle;
			default:
			case Verbosity.MEDIUM:
				return this.mediumTitle;
		}
	}

	override isReadonly(): boolean | IMarkdownString {
		return this.filesConfigurationService.isReadonly(this.resource);
	}

	protected ensureLimits(options?: IFileLimitedEditorInputOptions): IFileReadLimits | undefined {
		if (options?.limits) {
			return options.limits; // respect passed in limits if any
		}

		// We want to determine the large file configuration based on the best defaults
		// for the resource but also respecting user settings. We only apply user settings
		// if explicitly configured by the user. Otherwise we pick the best limit for the
		// resource scheme.

		const defaultSizeLimit = getLargeFileConfirmationLimit(this.resource);
		let configuredSizeLimit: number | undefined;

		const configuredSizeLimitMb = this.textResourceConfigurationService.inspect<number>(this.resource, null, 'workbench.editorLargeFileConfirmation');
		if (isConfigured(configuredSizeLimitMb)) {
			configuredSizeLimit = configuredSizeLimitMb.value * ByteSize.MB; // normalize to MB
		}

		return {
			size: configuredSizeLimit ?? defaultSizeLimit
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/sideBySideEditorInput.ts]---
Location: vscode-main/src/vs/workbench/common/editor/sideBySideEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { EditorInputCapabilities, GroupIdentifier, ISaveOptions, IRevertOptions, EditorExtensions, IEditorFactoryRegistry, IEditorSerializer, ISideBySideEditorInput, IUntypedEditorInput, isResourceSideBySideEditorInput, isDiffEditorInput, isResourceDiffEditorInput, IResourceSideBySideEditorInput, findViewStateForEditor, IMoveResult, isEditorInput, isResourceEditorInput, Verbosity, isResourceMergeEditorInput, isResourceMultiDiffEditorInput } from '../editor.js';
import { EditorInput, IUntypedEditorOptions } from './editorInput.js';
import { IEditorService } from '../../services/editor/common/editorService.js';

/**
 * Side by side editor inputs that have a primary and secondary side.
 */
export class SideBySideEditorInput extends EditorInput implements ISideBySideEditorInput {

	static readonly ID: string = 'workbench.editorinputs.sidebysideEditorInput';

	override get typeId(): string {
		return SideBySideEditorInput.ID;
	}

	override get capabilities(): EditorInputCapabilities {

		// Use primary capabilities as main capabilities...
		let capabilities = this.primary.capabilities;

		// ...with the exception of `CanSplitInGroup` which
		// is only relevant to single editors.
		capabilities &= ~EditorInputCapabilities.CanSplitInGroup;

		// Trust: should be considered for both sides
		if (this.secondary.hasCapability(EditorInputCapabilities.RequiresTrust)) {
			capabilities |= EditorInputCapabilities.RequiresTrust;
		}

		// Singleton: should be considered for both sides
		if (this.secondary.hasCapability(EditorInputCapabilities.Singleton)) {
			capabilities |= EditorInputCapabilities.Singleton;
		}

		// Indicate we show more than one editor
		capabilities |= EditorInputCapabilities.MultipleEditors;

		return capabilities;
	}

	get resource(): URI | undefined {
		if (this.hasIdenticalSides) {
			// pretend to be just primary side when being asked for a resource
			// in case both sides are the same. this can help when components
			// want to identify this input among others (e.g. in history).
			return this.primary.resource;
		}

		return undefined;
	}

	private hasIdenticalSides: boolean;

	constructor(
		protected readonly preferredName: string | undefined,
		protected readonly preferredDescription: string | undefined,
		readonly secondary: EditorInput,
		readonly primary: EditorInput,
		@IEditorService private readonly editorService: IEditorService
	) {
		super();

		this.hasIdenticalSides = this.primary.matches(this.secondary);

		this.registerListeners();
	}

	private registerListeners(): void {

		// When the primary or secondary input gets disposed, dispose this diff editor input
		this._register(Event.once(Event.any(this.primary.onWillDispose, this.secondary.onWillDispose))(() => {
			if (!this.isDisposed()) {
				this.dispose();
			}
		}));

		// Re-emit some events from the primary side to the outside
		this._register(this.primary.onDidChangeDirty(() => this._onDidChangeDirty.fire()));

		// Re-emit some events from both sides to the outside
		this._register(this.primary.onDidChangeCapabilities(() => this._onDidChangeCapabilities.fire()));
		this._register(this.secondary.onDidChangeCapabilities(() => this._onDidChangeCapabilities.fire()));
		this._register(this.primary.onDidChangeLabel(() => this._onDidChangeLabel.fire()));
		this._register(this.secondary.onDidChangeLabel(() => this._onDidChangeLabel.fire()));
	}

	override getName(): string {
		const preferredName = this.getPreferredName();
		if (preferredName) {
			return preferredName;
		}

		if (this.hasIdenticalSides) {
			return this.primary.getName(); // keep name concise when same editor is opened side by side
		}

		return localize('sideBySideLabels', "{0} - {1}", this.secondary.getName(), this.primary.getName());
	}

	getPreferredName(): string | undefined {
		return this.preferredName;
	}

	override getDescription(verbosity?: Verbosity): string | undefined {
		const preferredDescription = this.getPreferredDescription();
		if (preferredDescription) {
			return preferredDescription;
		}

		if (this.hasIdenticalSides) {
			return this.primary.getDescription(verbosity);
		}

		return super.getDescription(verbosity);
	}

	getPreferredDescription(): string | undefined {
		return this.preferredDescription;
	}

	override getTitle(verbosity?: Verbosity): string {
		let title: string;
		if (this.hasIdenticalSides) {
			title = this.primary.getTitle(verbosity) ?? this.getName();
		} else {
			title = super.getTitle(verbosity);
		}

		const preferredTitle = this.getPreferredTitle();
		if (preferredTitle) {
			title = `${preferredTitle} (${title})`;
		}

		return title;
	}

	protected getPreferredTitle(): string | undefined {
		if (this.preferredName && this.preferredDescription) {
			return `${this.preferredName} ${this.preferredDescription}`;
		}

		if (this.preferredName || this.preferredDescription) {
			return this.preferredName ?? this.preferredDescription;
		}

		return undefined;
	}

	override getLabelExtraClasses(): string[] {
		if (this.hasIdenticalSides) {
			return this.primary.getLabelExtraClasses();
		}

		return super.getLabelExtraClasses();
	}

	override getAriaLabel(): string {
		if (this.hasIdenticalSides) {
			return this.primary.getAriaLabel();
		}

		return super.getAriaLabel();
	}

	override getTelemetryDescriptor(): { [key: string]: unknown } {
		const descriptor = this.primary.getTelemetryDescriptor();

		return { ...descriptor, ...super.getTelemetryDescriptor() };
	}

	override isDirty(): boolean {
		return this.primary.isDirty();
	}

	override isSaving(): boolean {
		return this.primary.isSaving();
	}

	override async save(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		const primarySaveResult = await this.primary.save(group, options);

		return this.saveResultToEditor(primarySaveResult);
	}

	override async saveAs(group: GroupIdentifier, options?: ISaveOptions): Promise<EditorInput | IUntypedEditorInput | undefined> {
		const primarySaveResult = await this.primary.saveAs(group, options);

		return this.saveResultToEditor(primarySaveResult);
	}

	private saveResultToEditor(primarySaveResult: EditorInput | IUntypedEditorInput | undefined): EditorInput | IUntypedEditorInput | undefined {
		if (!primarySaveResult || !this.hasIdenticalSides) {
			return primarySaveResult;
		}

		if (this.primary.matches(primarySaveResult)) {
			return this;
		}

		if (primarySaveResult instanceof EditorInput) {
			return new SideBySideEditorInput(this.preferredName, this.preferredDescription, primarySaveResult, primarySaveResult, this.editorService);
		}

		if (!isResourceDiffEditorInput(primarySaveResult) && !isResourceMultiDiffEditorInput(primarySaveResult) && !isResourceSideBySideEditorInput(primarySaveResult) && !isResourceMergeEditorInput(primarySaveResult)) {
			return {
				primary: primarySaveResult,
				secondary: primarySaveResult,
				label: this.preferredName,
				description: this.preferredDescription
			};
		}

		return undefined;
	}

	override revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		return this.primary.revert(group, options);
	}

	override async rename(group: GroupIdentifier, target: URI): Promise<IMoveResult | undefined> {
		if (!this.hasIdenticalSides) {
			return; // currently only enabled when both sides are identical
		}

		// Forward rename to primary side
		const renameResult = await this.primary.rename(group, target);
		if (!renameResult) {
			return undefined;
		}

		// Build a side-by-side result from the rename result

		if (isEditorInput(renameResult.editor)) {
			return {
				editor: new SideBySideEditorInput(this.preferredName, this.preferredDescription, renameResult.editor, renameResult.editor, this.editorService),
				options: {
					...renameResult.options,
					viewState: findViewStateForEditor(this, group, this.editorService)
				}
			};
		}

		if (isResourceEditorInput(renameResult.editor)) {
			return {
				editor: {
					label: this.preferredName,
					description: this.preferredDescription,
					primary: renameResult.editor,
					secondary: renameResult.editor,
					options: {
						...renameResult.options,
						viewState: findViewStateForEditor(this, group, this.editorService)
					}
				}
			};
		}

		return undefined;
	}

	override isReadonly(): boolean | IMarkdownString {
		return this.primary.isReadonly();
	}

	override toUntyped(options?: IUntypedEditorOptions): IResourceSideBySideEditorInput | undefined {
		const primaryResourceEditorInput = this.primary.toUntyped(options);
		const secondaryResourceEditorInput = this.secondary.toUntyped(options);

		// Prevent nested side by side editors which are unsupported
		if (
			primaryResourceEditorInput && secondaryResourceEditorInput &&
			!isResourceDiffEditorInput(primaryResourceEditorInput) && !isResourceDiffEditorInput(secondaryResourceEditorInput) &&
			!isResourceMultiDiffEditorInput(primaryResourceEditorInput) && !isResourceMultiDiffEditorInput(secondaryResourceEditorInput) &&
			!isResourceSideBySideEditorInput(primaryResourceEditorInput) && !isResourceSideBySideEditorInput(secondaryResourceEditorInput) &&
			!isResourceMergeEditorInput(primaryResourceEditorInput) && !isResourceMergeEditorInput(secondaryResourceEditorInput)
		) {
			const untypedInput: IResourceSideBySideEditorInput = {
				label: this.preferredName,
				description: this.preferredDescription,
				primary: primaryResourceEditorInput,
				secondary: secondaryResourceEditorInput
			};

			if (typeof options?.preserveViewState === 'number') {
				untypedInput.options = {
					viewState: findViewStateForEditor(this, options.preserveViewState, this.editorService)
				};
			}

			return untypedInput;
		}

		return undefined;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (isDiffEditorInput(otherInput) || isResourceDiffEditorInput(otherInput)) {
			return false; // prevent subclass from matching
		}

		if (otherInput instanceof SideBySideEditorInput) {
			return this.primary.matches(otherInput.primary) && this.secondary.matches(otherInput.secondary);
		}

		if (isResourceSideBySideEditorInput(otherInput)) {
			return this.primary.matches(otherInput.primary) && this.secondary.matches(otherInput.secondary);
		}

		return false;
	}
}

// Register SideBySide/DiffEditor Input Serializer
interface ISerializedSideBySideEditorInput {
	name: string | undefined;
	description: string | undefined;

	primarySerialized: string;
	secondarySerialized: string;

	primaryTypeId: string;
	secondaryTypeId: string;
}

export abstract class AbstractSideBySideEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		const input = editorInput as SideBySideEditorInput;

		if (input.primary && input.secondary) {
			const [secondaryInputSerializer, primaryInputSerializer] = this.getSerializers(input.secondary.typeId, input.primary.typeId);

			return !!(secondaryInputSerializer?.canSerialize(input.secondary) && primaryInputSerializer?.canSerialize(input.primary));
		}

		return false;
	}

	serialize(editorInput: EditorInput): string | undefined {
		const input = editorInput as SideBySideEditorInput;

		if (input.primary && input.secondary) {
			const [secondaryInputSerializer, primaryInputSerializer] = this.getSerializers(input.secondary.typeId, input.primary.typeId);
			if (primaryInputSerializer && secondaryInputSerializer) {
				const primarySerialized = primaryInputSerializer.serialize(input.primary);
				const secondarySerialized = secondaryInputSerializer.serialize(input.secondary);

				if (primarySerialized && secondarySerialized) {
					const serializedEditorInput: ISerializedSideBySideEditorInput = {
						name: input.getPreferredName(),
						description: input.getPreferredDescription(),
						primarySerialized,
						secondarySerialized,
						primaryTypeId: input.primary.typeId,
						secondaryTypeId: input.secondary.typeId
					};

					return JSON.stringify(serializedEditorInput);
				}
			}
		}

		return undefined;
	}

	deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): EditorInput | undefined {
		const deserialized: ISerializedSideBySideEditorInput = JSON.parse(serializedEditorInput);

		const [secondaryInputSerializer, primaryInputSerializer] = this.getSerializers(deserialized.secondaryTypeId, deserialized.primaryTypeId);
		if (primaryInputSerializer && secondaryInputSerializer) {
			const primaryInput = primaryInputSerializer.deserialize(instantiationService, deserialized.primarySerialized);
			const secondaryInput = secondaryInputSerializer.deserialize(instantiationService, deserialized.secondarySerialized);

			if (primaryInput instanceof EditorInput && secondaryInput instanceof EditorInput) {
				return this.createEditorInput(instantiationService, deserialized.name, deserialized.description, secondaryInput, primaryInput);
			}
		}

		return undefined;
	}

	private getSerializers(secondaryEditorInputTypeId: string, primaryEditorInputTypeId: string): [IEditorSerializer | undefined, IEditorSerializer | undefined] {
		const registry = Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory);

		return [registry.getEditorSerializer(secondaryEditorInputTypeId), registry.getEditorSerializer(primaryEditorInputTypeId)];
	}

	protected abstract createEditorInput(instantiationService: IInstantiationService, name: string | undefined, description: string | undefined, secondaryInput: EditorInput, primaryInput: EditorInput): EditorInput;
}

export class SideBySideEditorInputSerializer extends AbstractSideBySideEditorInputSerializer {

	protected createEditorInput(instantiationService: IInstantiationService, name: string | undefined, description: string | undefined, secondaryInput: EditorInput, primaryInput: EditorInput): EditorInput {
		return instantiationService.createInstance(SideBySideEditorInput, name, description, secondaryInput, primaryInput);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/common/editor/textDiffEditorModel.ts]---
Location: vscode-main/src/vs/workbench/common/editor/textDiffEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiffEditorModel } from '../../../editor/common/editorCommon.js';
import { BaseTextEditorModel } from './textEditorModel.js';
import { DiffEditorModel } from './diffEditorModel.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';

/**
 * The base text editor model for the diff editor. It is made up of two text editor models, the original version
 * and the modified version.
 */
export class TextDiffEditorModel extends DiffEditorModel {

	protected override readonly _originalModel: BaseTextEditorModel | undefined;
	override get originalModel(): BaseTextEditorModel | undefined { return this._originalModel; }

	protected override readonly _modifiedModel: BaseTextEditorModel | undefined;
	override get modifiedModel(): BaseTextEditorModel | undefined { return this._modifiedModel; }

	private _textDiffEditorModel: IDiffEditorModel | undefined = undefined;
	get textDiffEditorModel(): IDiffEditorModel | undefined { return this._textDiffEditorModel; }

	constructor(originalModel: BaseTextEditorModel, modifiedModel: BaseTextEditorModel) {
		super(originalModel, modifiedModel);

		this._originalModel = originalModel;
		this._modifiedModel = modifiedModel;

		this.updateTextDiffEditorModel();
	}

	override async resolve(): Promise<void> {
		await super.resolve();

		this.updateTextDiffEditorModel();
	}

	private updateTextDiffEditorModel(): void {
		if (this.originalModel?.isResolved() && this.modifiedModel?.isResolved()) {

			// Create new
			if (!this._textDiffEditorModel) {
				this._textDiffEditorModel = {
					original: this.originalModel.textEditorModel,
					modified: this.modifiedModel.textEditorModel
				};
			}

			// Update existing
			else {
				this._textDiffEditorModel.original = this.originalModel.textEditorModel;
				this._textDiffEditorModel.modified = this.modifiedModel.textEditorModel;
			}
		}
	}

	override isResolved(): boolean {
		return !!this._textDiffEditorModel;
	}

	isReadonly(): boolean | IMarkdownString {
		return !!this.modifiedModel && this.modifiedModel.isReadonly();
	}

	override dispose(): void {

		// Free the diff editor model but do not propagate the dispose() call to the two models
		// inside. We never created the two models (original and modified) so we can not dispose
		// them without sideeffects. Rather rely on the models getting disposed when their related
		// inputs get disposed from the diffEditorInput.
		this._textDiffEditorModel = undefined;

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

````

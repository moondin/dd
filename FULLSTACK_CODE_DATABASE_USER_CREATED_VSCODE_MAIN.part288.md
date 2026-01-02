---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 288
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 288 of 552)

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

---[FILE: src/vs/platform/theme/browser/defaultStyles.ts]---
Location: vscode-main/src/vs/platform/theme/browser/defaultStyles.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IButtonStyles } from '../../../base/browser/ui/button/button.js';
import { IKeybindingLabelStyles } from '../../../base/browser/ui/keybindingLabel/keybindingLabel.js';
import { ColorIdentifier, keybindingLabelBackground, keybindingLabelBorder, keybindingLabelBottomBorder, keybindingLabelForeground, asCssVariable, widgetShadow, buttonForeground, buttonSeparator, buttonBackground, buttonHoverBackground, buttonSecondaryForeground, buttonSecondaryBackground, buttonSecondaryHoverBackground, buttonBorder, progressBarBackground, inputActiveOptionBorder, inputActiveOptionForeground, inputActiveOptionBackground, editorWidgetBackground, editorWidgetForeground, contrastBorder, checkboxBorder, checkboxBackground, checkboxForeground, problemsErrorIconForeground, problemsWarningIconForeground, problemsInfoIconForeground, inputBackground, inputForeground, inputBorder, textLinkForeground, inputValidationInfoBorder, inputValidationInfoBackground, inputValidationInfoForeground, inputValidationWarningBorder, inputValidationWarningBackground, inputValidationWarningForeground, inputValidationErrorBorder, inputValidationErrorBackground, inputValidationErrorForeground, listFilterWidgetBackground, listFilterWidgetNoMatchesOutline, listFilterWidgetOutline, listFilterWidgetShadow, badgeBackground, badgeForeground, breadcrumbsBackground, breadcrumbsForeground, breadcrumbsFocusForeground, breadcrumbsActiveSelectionForeground, activeContrastBorder, listActiveSelectionBackground, listActiveSelectionForeground, listActiveSelectionIconForeground, listDropOverBackground, listFocusAndSelectionOutline, listFocusBackground, listFocusForeground, listFocusOutline, listHoverBackground, listHoverForeground, listInactiveFocusBackground, listInactiveFocusOutline, listInactiveSelectionBackground, listInactiveSelectionForeground, listInactiveSelectionIconForeground, tableColumnsBorder, tableOddRowsBackgroundColor, treeIndentGuidesStroke, asCssVariableWithDefault, editorWidgetBorder, focusBorder, pickerGroupForeground, quickInputListFocusBackground, quickInputListFocusForeground, quickInputListFocusIconForeground, selectBackground, selectBorder, selectForeground, selectListBackground, treeInactiveIndentGuidesStroke, menuBorder, menuForeground, menuBackground, menuSelectionForeground, menuSelectionBackground, menuSelectionBorder, menuSeparatorBackground, scrollbarShadow, scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground, listDropBetweenBackground, radioActiveBackground, radioActiveForeground, radioInactiveBackground, radioInactiveForeground, radioInactiveBorder, radioInactiveHoverBackground, radioActiveBorder, checkboxDisabledBackground, checkboxDisabledForeground, widgetBorder } from '../common/colorRegistry.js';
import { IProgressBarStyles } from '../../../base/browser/ui/progressbar/progressbar.js';
import { ICheckboxStyles, IToggleStyles } from '../../../base/browser/ui/toggle/toggle.js';
import { IDialogStyles } from '../../../base/browser/ui/dialog/dialog.js';
import { IInputBoxStyles } from '../../../base/browser/ui/inputbox/inputBox.js';
import { IFindWidgetStyles } from '../../../base/browser/ui/tree/abstractTree.js';
import { ICountBadgeStyles } from '../../../base/browser/ui/countBadge/countBadge.js';
import { IBreadcrumbsWidgetStyles } from '../../../base/browser/ui/breadcrumbs/breadcrumbsWidget.js';
import { IListStyles } from '../../../base/browser/ui/list/listWidget.js';
import { ISelectBoxStyles } from '../../../base/browser/ui/selectBox/selectBox.js';
import { Color } from '../../../base/common/color.js';
import { IMenuStyles } from '../../../base/browser/ui/menu/menu.js';
import { IRadioStyles } from '../../../base/browser/ui/radio/radio.js';

export type IStyleOverride<T> = {
	[P in keyof T]?: ColorIdentifier | undefined;
};

function overrideStyles<T extends { [P in keyof T]: string | undefined }>(override: IStyleOverride<T>, styles: T) {
	const result: { [P in keyof T]: string | undefined } = { ...styles };
	for (const key in override) {
		const val = override[key];
		result[key] = val !== undefined ? asCssVariable(val) : undefined;
	}
	return result;
}

export const defaultKeybindingLabelStyles: IKeybindingLabelStyles = {
	keybindingLabelBackground: asCssVariable(keybindingLabelBackground),
	keybindingLabelForeground: asCssVariable(keybindingLabelForeground),
	keybindingLabelBorder: asCssVariable(keybindingLabelBorder),
	keybindingLabelBottomBorder: asCssVariable(keybindingLabelBottomBorder),
	keybindingLabelShadow: asCssVariable(widgetShadow)
};

export function getKeybindingLabelStyles(override: IStyleOverride<IKeybindingLabelStyles>): IKeybindingLabelStyles {
	return overrideStyles(override, defaultKeybindingLabelStyles);
}

export const defaultButtonStyles: IButtonStyles = {
	buttonForeground: asCssVariable(buttonForeground),
	buttonSeparator: asCssVariable(buttonSeparator),
	buttonBackground: asCssVariable(buttonBackground),
	buttonHoverBackground: asCssVariable(buttonHoverBackground),
	buttonSecondaryForeground: asCssVariable(buttonSecondaryForeground),
	buttonSecondaryBackground: asCssVariable(buttonSecondaryBackground),
	buttonSecondaryHoverBackground: asCssVariable(buttonSecondaryHoverBackground),
	buttonBorder: asCssVariable(buttonBorder),
};

export function getButtonStyles(override: IStyleOverride<IButtonStyles>): IButtonStyles {
	return overrideStyles(override, defaultButtonStyles);
}

export const defaultProgressBarStyles: IProgressBarStyles = {
	progressBarBackground: asCssVariable(progressBarBackground)
};

export function getProgressBarStyles(override: IStyleOverride<IProgressBarStyles>): IProgressBarStyles {
	return overrideStyles(override, defaultProgressBarStyles);
}

export const defaultToggleStyles: IToggleStyles = {
	inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
	inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
	inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground)
};

export const defaultRadioStyles: IRadioStyles = {
	activeForeground: asCssVariable(radioActiveForeground),
	activeBackground: asCssVariable(radioActiveBackground),
	activeBorder: asCssVariable(radioActiveBorder),
	inactiveForeground: asCssVariable(radioInactiveForeground),
	inactiveBackground: asCssVariable(radioInactiveBackground),
	inactiveBorder: asCssVariable(radioInactiveBorder),
	inactiveHoverBackground: asCssVariable(radioInactiveHoverBackground),
};

export function getToggleStyles(override: IStyleOverride<IToggleStyles>): IToggleStyles {
	return overrideStyles(override, defaultToggleStyles);
}

export const defaultCheckboxStyles: ICheckboxStyles = {
	checkboxBackground: asCssVariable(checkboxBackground),
	checkboxBorder: asCssVariable(checkboxBorder),
	checkboxForeground: asCssVariable(checkboxForeground),
	checkboxDisabledBackground: asCssVariable(checkboxDisabledBackground),
	checkboxDisabledForeground: asCssVariable(checkboxDisabledForeground),
};

export const defaultDialogStyles: IDialogStyles = {
	dialogBackground: asCssVariable(editorWidgetBackground),
	dialogForeground: asCssVariable(editorWidgetForeground),
	dialogShadow: asCssVariable(widgetShadow),
	dialogBorder: asCssVariable(widgetBorder),
	errorIconForeground: asCssVariable(problemsErrorIconForeground),
	warningIconForeground: asCssVariable(problemsWarningIconForeground),
	infoIconForeground: asCssVariable(problemsInfoIconForeground),
	textLinkForeground: asCssVariable(textLinkForeground)
};

export function getDialogStyle(override: IStyleOverride<IDialogStyles>): IDialogStyles {
	return overrideStyles(override, defaultDialogStyles);
}

export const defaultInputBoxStyles: IInputBoxStyles = {
	inputBackground: asCssVariable(inputBackground),
	inputForeground: asCssVariable(inputForeground),
	inputBorder: asCssVariable(inputBorder),
	inputValidationInfoBorder: asCssVariable(inputValidationInfoBorder),
	inputValidationInfoBackground: asCssVariable(inputValidationInfoBackground),
	inputValidationInfoForeground: asCssVariable(inputValidationInfoForeground),
	inputValidationWarningBorder: asCssVariable(inputValidationWarningBorder),
	inputValidationWarningBackground: asCssVariable(inputValidationWarningBackground),
	inputValidationWarningForeground: asCssVariable(inputValidationWarningForeground),
	inputValidationErrorBorder: asCssVariable(inputValidationErrorBorder),
	inputValidationErrorBackground: asCssVariable(inputValidationErrorBackground),
	inputValidationErrorForeground: asCssVariable(inputValidationErrorForeground)
};

export function getInputBoxStyle(override: IStyleOverride<IInputBoxStyles>): IInputBoxStyles {
	return overrideStyles(override, defaultInputBoxStyles);
}

export const defaultFindWidgetStyles: IFindWidgetStyles = {
	listFilterWidgetBackground: asCssVariable(listFilterWidgetBackground),
	listFilterWidgetOutline: asCssVariable(listFilterWidgetOutline),
	listFilterWidgetNoMatchesOutline: asCssVariable(listFilterWidgetNoMatchesOutline),
	listFilterWidgetShadow: asCssVariable(listFilterWidgetShadow),
	inputBoxStyles: defaultInputBoxStyles,
	toggleStyles: defaultToggleStyles
};

export const defaultCountBadgeStyles: ICountBadgeStyles = {
	badgeBackground: asCssVariable(badgeBackground),
	badgeForeground: asCssVariable(badgeForeground),
	badgeBorder: asCssVariable(contrastBorder)
};

export function getCountBadgeStyle(override: IStyleOverride<ICountBadgeStyles>): ICountBadgeStyles {
	return overrideStyles(override, defaultCountBadgeStyles);
}

export const defaultBreadcrumbsWidgetStyles: IBreadcrumbsWidgetStyles = {
	breadcrumbsBackground: asCssVariable(breadcrumbsBackground),
	breadcrumbsForeground: asCssVariable(breadcrumbsForeground),
	breadcrumbsHoverForeground: asCssVariable(breadcrumbsFocusForeground),
	breadcrumbsFocusForeground: asCssVariable(breadcrumbsFocusForeground),
	breadcrumbsFocusAndSelectionForeground: asCssVariable(breadcrumbsActiveSelectionForeground)
};

export function getBreadcrumbsWidgetStyles(override: IStyleOverride<IBreadcrumbsWidgetStyles>): IBreadcrumbsWidgetStyles {
	return overrideStyles(override, defaultBreadcrumbsWidgetStyles);
}

export const defaultListStyles: IListStyles = {
	listBackground: undefined,
	listInactiveFocusForeground: undefined,
	listFocusBackground: asCssVariable(listFocusBackground),
	listFocusForeground: asCssVariable(listFocusForeground),
	listFocusOutline: asCssVariable(listFocusOutline),
	listActiveSelectionBackground: asCssVariable(listActiveSelectionBackground),
	listActiveSelectionForeground: asCssVariable(listActiveSelectionForeground),
	listActiveSelectionIconForeground: asCssVariable(listActiveSelectionIconForeground),
	listFocusAndSelectionOutline: asCssVariable(listFocusAndSelectionOutline),
	listFocusAndSelectionBackground: asCssVariable(listActiveSelectionBackground),
	listFocusAndSelectionForeground: asCssVariable(listActiveSelectionForeground),
	listInactiveSelectionBackground: asCssVariable(listInactiveSelectionBackground),
	listInactiveSelectionIconForeground: asCssVariable(listInactiveSelectionIconForeground),
	listInactiveSelectionForeground: asCssVariable(listInactiveSelectionForeground),
	listInactiveFocusBackground: asCssVariable(listInactiveFocusBackground),
	listInactiveFocusOutline: asCssVariable(listInactiveFocusOutline),
	listHoverBackground: asCssVariable(listHoverBackground),
	listHoverForeground: asCssVariable(listHoverForeground),
	listDropOverBackground: asCssVariable(listDropOverBackground),
	listDropBetweenBackground: asCssVariable(listDropBetweenBackground),
	listSelectionOutline: asCssVariable(activeContrastBorder),
	listHoverOutline: asCssVariable(activeContrastBorder),
	treeIndentGuidesStroke: asCssVariable(treeIndentGuidesStroke),
	treeInactiveIndentGuidesStroke: asCssVariable(treeInactiveIndentGuidesStroke),
	treeStickyScrollBackground: undefined,
	treeStickyScrollBorder: undefined,
	treeStickyScrollShadow: asCssVariable(scrollbarShadow),
	tableColumnsBorder: asCssVariable(tableColumnsBorder),
	tableOddRowsBackgroundColor: asCssVariable(tableOddRowsBackgroundColor),
};

export function getListStyles(override: IStyleOverride<IListStyles>): IListStyles {
	return overrideStyles(override, defaultListStyles);
}

export const defaultSelectBoxStyles: ISelectBoxStyles = {
	selectBackground: asCssVariable(selectBackground),
	selectListBackground: asCssVariable(selectListBackground),
	selectForeground: asCssVariable(selectForeground),
	decoratorRightForeground: asCssVariable(pickerGroupForeground),
	selectBorder: asCssVariable(selectBorder),
	focusBorder: asCssVariable(focusBorder),
	listFocusBackground: asCssVariable(quickInputListFocusBackground),
	listInactiveSelectionIconForeground: asCssVariable(quickInputListFocusIconForeground),
	listFocusForeground: asCssVariable(quickInputListFocusForeground),
	listFocusOutline: asCssVariableWithDefault(activeContrastBorder, Color.transparent.toString()),
	listHoverBackground: asCssVariable(listHoverBackground),
	listHoverForeground: asCssVariable(listHoverForeground),
	listHoverOutline: asCssVariable(activeContrastBorder),
	selectListBorder: asCssVariable(editorWidgetBorder),
	listBackground: undefined,
	listActiveSelectionBackground: undefined,
	listActiveSelectionForeground: undefined,
	listActiveSelectionIconForeground: undefined,
	listFocusAndSelectionBackground: undefined,
	listDropOverBackground: undefined,
	listDropBetweenBackground: undefined,
	listInactiveSelectionBackground: undefined,
	listInactiveSelectionForeground: undefined,
	listInactiveFocusBackground: undefined,
	listInactiveFocusOutline: undefined,
	listSelectionOutline: undefined,
	listFocusAndSelectionForeground: undefined,
	listFocusAndSelectionOutline: undefined,
	listInactiveFocusForeground: undefined,
	tableColumnsBorder: undefined,
	tableOddRowsBackgroundColor: undefined,
	treeIndentGuidesStroke: undefined,
	treeInactiveIndentGuidesStroke: undefined,
	treeStickyScrollBackground: undefined,
	treeStickyScrollBorder: undefined,
	treeStickyScrollShadow: undefined
};

export function getSelectBoxStyles(override: IStyleOverride<ISelectBoxStyles>): ISelectBoxStyles {
	return overrideStyles(override, defaultSelectBoxStyles);
}

export const defaultMenuStyles: IMenuStyles = {
	shadowColor: asCssVariable(widgetShadow),
	borderColor: asCssVariable(menuBorder),
	foregroundColor: asCssVariable(menuForeground),
	backgroundColor: asCssVariable(menuBackground),
	selectionForegroundColor: asCssVariable(menuSelectionForeground),
	selectionBackgroundColor: asCssVariable(menuSelectionBackground),
	selectionBorderColor: asCssVariable(menuSelectionBorder),
	separatorColor: asCssVariable(menuSeparatorBackground),
	scrollbarShadow: asCssVariable(scrollbarShadow),
	scrollbarSliderBackground: asCssVariable(scrollbarSliderBackground),
	scrollbarSliderHoverBackground: asCssVariable(scrollbarSliderHoverBackground),
	scrollbarSliderActiveBackground: asCssVariable(scrollbarSliderActiveBackground)
};

export function getMenuStyles(override: IStyleOverride<IMenuStyles>): IMenuStyles {
	return overrideStyles(override, defaultMenuStyles);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/browser/iconsStyleSheet.ts]---
Location: vscode-main/src/vs/platform/theme/browser/iconsStyleSheet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as css from '../../../base/browser/cssValue.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { getIconRegistry, IconContribution, IconFontDefinition } from '../common/iconRegistry.js';
import { IProductIconTheme, IThemeService } from '../common/themeService.js';

export interface IIconsStyleSheet extends IDisposable {
	getCSS(): css.CssFragment;
	readonly onDidChange: Event<void>;
}

export function getIconsStyleSheet(themeService: IThemeService | undefined): IIconsStyleSheet {
	const disposable = new DisposableStore();

	const onDidChangeEmmiter = disposable.add(new Emitter<void>());
	const iconRegistry = getIconRegistry();
	disposable.add(iconRegistry.onDidChange(() => onDidChangeEmmiter.fire()));
	if (themeService) {
		disposable.add(themeService.onDidProductIconThemeChange(() => onDidChangeEmmiter.fire()));
	}

	return {
		dispose: () => disposable.dispose(),
		onDidChange: onDidChangeEmmiter.event,
		getCSS(): css.CssFragment {
			const productIconTheme = themeService ? themeService.getProductIconTheme() : new UnthemedProductIconTheme();
			const usedFontIds: { [id: string]: IconFontDefinition } = {};

			const rules = new css.Builder();
			const rootAttribs = new css.Builder();
			for (const contribution of iconRegistry.getIcons()) {
				const definition = productIconTheme.getIcon(contribution);
				if (!definition) {
					continue;
				}

				const fontContribution = definition.font;
				const fontFamilyVar = css.inline`--vscode-icon-${css.className(contribution.id)}-font-family`;
				const contentVar = css.inline`--vscode-icon-${css.className(contribution.id)}-content`;
				if (fontContribution) {
					usedFontIds[fontContribution.id] = fontContribution.definition;
					rootAttribs.push(
						css.inline`${fontFamilyVar}: ${css.stringValue(fontContribution.id)};`,
						css.inline`${contentVar}: ${css.stringValue(definition.fontCharacter)};`,
					);
					rules.push(css.inline`.codicon-${css.className(contribution.id)}:before { content: ${css.stringValue(definition.fontCharacter)}; font-family: ${css.stringValue(fontContribution.id)}; }`);
				} else {
					rootAttribs.push(css.inline`${contentVar}: ${css.stringValue(definition.fontCharacter)}; ${fontFamilyVar}: 'codicon';`);
					rules.push(css.inline`.codicon-${css.className(contribution.id)}:before { content: ${css.stringValue(definition.fontCharacter)}; }`);
				}
			}

			for (const id in usedFontIds) {
				const definition = usedFontIds[id];
				const fontWeight = definition.weight ? css.inline`font-weight: ${css.identValue(definition.weight)};` : css.inline``;
				const fontStyle = definition.style ? css.inline`font-style: ${css.identValue(definition.style)};` : css.inline``;

				const src = new css.Builder();
				for (const l of definition.src) {
					src.push(css.inline`${css.asCSSUrl(l.location)} format(${css.stringValue(l.format)})`);
				}
				rules.push(css.inline`@font-face { src: ${src.join(', ')}; font-family: ${css.stringValue(id)};${fontWeight}${fontStyle} font-display: block; }`);
			}

			rules.push(css.inline`:root { ${rootAttribs.join(' ')} }`);

			return rules.join('\n');
		}
	};
}

export class UnthemedProductIconTheme implements IProductIconTheme {
	getIcon(contribution: IconContribution) {
		const iconRegistry = getIconRegistry();
		let definition = contribution.defaults;
		while (ThemeIcon.isThemeIcon(definition)) {
			const c = iconRegistry.getIcon(definition.id);
			if (!c) {
				return undefined;
			}
			definition = c.defaults;
		}
		return definition;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colorRegistry.ts]---
Location: vscode-main/src/vs/platform/theme/common/colorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export * from './colorUtils.js';

// Make sure all color files are exported
export * from './colors/baseColors.js';
export * from './colors/chartsColors.js';
export * from './colors/editorColors.js';
export * from './colors/inputColors.js';
export * from './colors/listColors.js';
export * from './colors/menuColors.js';
export * from './colors/minimapColors.js';
export * from './colors/miscColors.js';
export * from './colors/quickpickColors.js';
export * from './colors/searchColors.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colorUtils.ts]---
Location: vscode-main/src/vs/platform/theme/common/colorUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assertNever } from '../../../base/common/assert.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { Color } from '../../../base/common/color.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IJSONSchema, IJSONSchemaSnippet } from '../../../base/common/jsonSchema.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../jsonschemas/common/jsonContributionRegistry.js';
import * as platform from '../../registry/common/platform.js';
import { IColorTheme } from './themeService.js';
import * as nls from '../../../nls.js';
import { Disposable } from '../../../base/common/lifecycle.js';

//  ------ API types

export type ColorIdentifier = string;

export interface ColorContribution {
	readonly id: ColorIdentifier;
	readonly description: string;
	readonly defaults: ColorDefaults | ColorValue | null;
	readonly needsTransparency: boolean;
	readonly deprecationMessage: string | undefined;
}

/**
 * Returns the css variable name for the given color identifier. Dots (`.`) are replaced with hyphens (`-`) and
 * everything is prefixed with `--vscode-`.
 *
 * @sample `editorSuggestWidget.background` is `--vscode-editorSuggestWidget-background`.
 */
export function asCssVariableName(colorIdent: ColorIdentifier): string {
	return `--vscode-${colorIdent.replace(/\./g, '-')}`;
}

export function asCssVariable(color: ColorIdentifier): string {
	return `var(${asCssVariableName(color)})`;
}

export function asCssVariableWithDefault(color: ColorIdentifier, defaultCssValue: string): string {
	return `var(${asCssVariableName(color)}, ${defaultCssValue})`;
}

export const enum ColorTransformType {
	Darken,
	Lighten,
	Transparent,
	Opaque,
	OneOf,
	LessProminent,
	IfDefinedThenElse,
	Mix,
}

export type ColorTransform =
	| { op: ColorTransformType.Darken; value: ColorValue; factor: number }
	| { op: ColorTransformType.Lighten; value: ColorValue; factor: number }
	| { op: ColorTransformType.Transparent; value: ColorValue; factor: number }
	| { op: ColorTransformType.Opaque; value: ColorValue; background: ColorValue }
	| { op: ColorTransformType.OneOf; values: readonly ColorValue[] }
	| { op: ColorTransformType.LessProminent; value: ColorValue; background: ColorValue; factor: number; transparency: number }
	| { op: ColorTransformType.IfDefinedThenElse; if: ColorIdentifier; then: ColorValue; else: ColorValue }
	| { op: ColorTransformType.Mix; color: ColorValue; with: ColorValue; ratio?: number };

export interface ColorDefaults {
	light: ColorValue | null;
	dark: ColorValue | null;
	hcDark: ColorValue | null;
	hcLight: ColorValue | null;
}

export function isColorDefaults(value: unknown): value is ColorDefaults {
	return value !== null && typeof value === 'object' && 'light' in value && 'dark' in value;
}

/**
 * A Color Value is either a color literal, a reference to an other color or a derived color
 */
export type ColorValue = Color | string | ColorIdentifier | ColorTransform;

// color registry
export const Extensions = {
	ColorContribution: 'base.contributions.colors'
};

export const DEFAULT_COLOR_CONFIG_VALUE = 'default';

export interface IColorRegistry {

	readonly onDidChangeSchema: Event<void>;

	/**
	 * Register a color to the registry.
	 * @param id The color id as used in theme description files
	 * @param defaults The default values
	 * @param needsTransparency Whether the color requires transparency
	 * @description the description
	 */
	registerColor(id: string, defaults: ColorDefaults, description: string, needsTransparency?: boolean): ColorIdentifier;

	/**
	 * Register a color to the registry.
	 */
	deregisterColor(id: string): void;

	/**
	 * Get all color contributions
	 */
	getColors(): ColorContribution[];

	/**
	 * Gets the default color of the given id
	 */
	resolveDefaultColor(id: ColorIdentifier, theme: IColorTheme): Color | undefined;

	/**
	 * JSON schema for an object to assign color values to one of the color contributions.
	 */
	getColorSchema(): IJSONSchema;

	/**
	 * JSON schema to for a reference to a color contribution.
	 */
	getColorReferenceSchema(): IJSONSchema;

	/**
	 * Notify when the color theme or settings change.
	 */
	notifyThemeUpdate(theme: IColorTheme): void;

}

type IJSONSchemaForColors = IJSONSchema & { properties: { [name: string]: { oneOf: [IJSONSchemaWithSnippets, IJSONSchema] } } };
type IJSONSchemaWithSnippets = IJSONSchema & { defaultSnippets: IJSONSchemaSnippet[] };

class ColorRegistry extends Disposable implements IColorRegistry {

	private readonly _onDidChangeSchema = this._register(new Emitter<void>());
	readonly onDidChangeSchema: Event<void> = this._onDidChangeSchema.event;

	private colorsById: { [key: string]: ColorContribution };
	private colorSchema: IJSONSchemaForColors = { type: 'object', properties: {} };
	private colorReferenceSchema: IJSONSchema & { enum: string[]; enumDescriptions: string[] } = { type: 'string', enum: [], enumDescriptions: [] };

	constructor() {
		super();
		this.colorsById = {};
	}

	public notifyThemeUpdate(colorThemeData: IColorTheme) {
		for (const key of Object.keys(this.colorsById)) {
			const color = colorThemeData.getColor(key);
			if (color) {
				this.colorSchema.properties[key].oneOf[0].defaultSnippets[0].body = `\${1:${Color.Format.CSS.formatHexA(color, true)}}`;
			}
		}
		this._onDidChangeSchema.fire();
	}

	public registerColor(id: string, defaults: ColorDefaults | ColorValue | null, description: string, needsTransparency = false, deprecationMessage?: string): ColorIdentifier {
		const colorContribution: ColorContribution = { id, description, defaults, needsTransparency, deprecationMessage };
		this.colorsById[id] = colorContribution;
		const propertySchema: IJSONSchemaWithSnippets = { type: 'string', format: 'color-hex', defaultSnippets: [{ body: '${1:#ff0000}' }] };
		if (deprecationMessage) {
			propertySchema.deprecationMessage = deprecationMessage;
		}
		if (needsTransparency) {
			propertySchema.pattern = '^#(?:(?<rgba>[0-9a-fA-f]{3}[0-9a-eA-E])|(?:[0-9a-fA-F]{6}(?:(?![fF]{2})(?:[0-9a-fA-F]{2}))))?$';
			propertySchema.patternErrorMessage = nls.localize('transparecyRequired', 'This color must be transparent or it will obscure content');
		}
		this.colorSchema.properties[id] = {
			description,
			oneOf: [
				propertySchema,
				{ type: 'string', const: DEFAULT_COLOR_CONFIG_VALUE, description: nls.localize('useDefault', 'Use the default color.') }
			]
		};
		this.colorReferenceSchema.enum.push(id);
		this.colorReferenceSchema.enumDescriptions.push(description);

		this._onDidChangeSchema.fire();
		return id;
	}


	public deregisterColor(id: string): void {
		delete this.colorsById[id];
		delete this.colorSchema.properties[id];
		const index = this.colorReferenceSchema.enum.indexOf(id);
		if (index !== -1) {
			this.colorReferenceSchema.enum.splice(index, 1);
			this.colorReferenceSchema.enumDescriptions.splice(index, 1);
		}
		this._onDidChangeSchema.fire();
	}

	public getColors(): ColorContribution[] {
		return Object.keys(this.colorsById).map(id => this.colorsById[id]);
	}

	public resolveDefaultColor(id: ColorIdentifier, theme: IColorTheme): Color | undefined {
		const colorDesc = this.colorsById[id];
		if (colorDesc?.defaults) {
			const colorValue = isColorDefaults(colorDesc.defaults) ? colorDesc.defaults[theme.type] : colorDesc.defaults;
			return resolveColorValue(colorValue, theme);
		}
		return undefined;
	}

	public getColorSchema(): IJSONSchema {
		return this.colorSchema;
	}

	public getColorReferenceSchema(): IJSONSchema {
		return this.colorReferenceSchema;
	}

	public override toString() {
		const sorter = (a: string, b: string) => {
			const cat1 = a.indexOf('.') === -1 ? 0 : 1;
			const cat2 = b.indexOf('.') === -1 ? 0 : 1;
			if (cat1 !== cat2) {
				return cat1 - cat2;
			}
			return a.localeCompare(b);
		};

		return Object.keys(this.colorsById).sort(sorter).map(k => `- \`${k}\`: ${this.colorsById[k].description}`).join('\n');
	}

}

const colorRegistry = new ColorRegistry();
platform.Registry.add(Extensions.ColorContribution, colorRegistry);


export function registerColor(id: string, defaults: ColorDefaults | ColorValue | null, description: string, needsTransparency?: boolean, deprecationMessage?: string): ColorIdentifier {
	return colorRegistry.registerColor(id, defaults, description, needsTransparency, deprecationMessage);
}

export function getColorRegistry(): IColorRegistry {
	return colorRegistry;
}

// ----- color functions

export function executeTransform(transform: ColorTransform, theme: IColorTheme): Color | undefined {
	switch (transform.op) {
		case ColorTransformType.Darken:
			return resolveColorValue(transform.value, theme)?.darken(transform.factor);

		case ColorTransformType.Lighten:
			return resolveColorValue(transform.value, theme)?.lighten(transform.factor);

		case ColorTransformType.Transparent:
			return resolveColorValue(transform.value, theme)?.transparent(transform.factor);

		case ColorTransformType.Mix: {
			const primaryColor = resolveColorValue(transform.color, theme) || Color.transparent;
			const otherColor = resolveColorValue(transform.with, theme) || Color.transparent;
			return primaryColor.mix(otherColor, transform.ratio);
		}

		case ColorTransformType.Opaque: {
			const backgroundColor = resolveColorValue(transform.background, theme);
			if (!backgroundColor) {
				return resolveColorValue(transform.value, theme);
			}
			return resolveColorValue(transform.value, theme)?.makeOpaque(backgroundColor);
		}

		case ColorTransformType.OneOf:
			for (const candidate of transform.values) {
				const color = resolveColorValue(candidate, theme);
				if (color) {
					return color;
				}
			}
			return undefined;

		case ColorTransformType.IfDefinedThenElse:
			return resolveColorValue(theme.defines(transform.if) ? transform.then : transform.else, theme);

		case ColorTransformType.LessProminent: {
			const from = resolveColorValue(transform.value, theme);
			if (!from) {
				return undefined;
			}

			const backgroundColor = resolveColorValue(transform.background, theme);
			if (!backgroundColor) {
				return from.transparent(transform.factor * transform.transparency);
			}

			return from.isDarkerThan(backgroundColor)
				? Color.getLighterColor(from, backgroundColor, transform.factor).transparent(transform.transparency)
				: Color.getDarkerColor(from, backgroundColor, transform.factor).transparent(transform.transparency);
		}
		default:
			throw assertNever(transform);
	}
}

export function darken(colorValue: ColorValue, factor: number): ColorTransform {
	return { op: ColorTransformType.Darken, value: colorValue, factor };
}

export function lighten(colorValue: ColorValue, factor: number): ColorTransform {
	return { op: ColorTransformType.Lighten, value: colorValue, factor };
}

export function transparent(colorValue: ColorValue, factor: number): ColorTransform {
	return { op: ColorTransformType.Transparent, value: colorValue, factor };
}

export function opaque(colorValue: ColorValue, background: ColorValue): ColorTransform {
	return { op: ColorTransformType.Opaque, value: colorValue, background };
}

export function oneOf(...colorValues: ColorValue[]): ColorTransform {
	return { op: ColorTransformType.OneOf, values: colorValues };
}

export function ifDefinedThenElse(ifArg: ColorIdentifier, thenArg: ColorValue, elseArg: ColorValue): ColorTransform {
	return { op: ColorTransformType.IfDefinedThenElse, if: ifArg, then: thenArg, else: elseArg };
}

export function lessProminent(colorValue: ColorValue, backgroundColorValue: ColorValue, factor: number, transparency: number): ColorTransform {
	return { op: ColorTransformType.LessProminent, value: colorValue, background: backgroundColorValue, factor, transparency };
}

// ----- implementation

/**
 * @param colorValue Resolve a color value in the context of a theme
 */
export function resolveColorValue(colorValue: ColorValue | null, theme: IColorTheme): Color | undefined {
	if (colorValue === null) {
		return undefined;
	} else if (typeof colorValue === 'string') {
		if (colorValue[0] === '#') {
			return Color.fromHex(colorValue);
		}
		return theme.getColor(colorValue);
	} else if (colorValue instanceof Color) {
		return colorValue;
	} else if (typeof colorValue === 'object') {
		return executeTransform(colorValue, theme);
	}
	return undefined;
}

export const workbenchColorsSchemaId = 'vscode://schemas/workbench-colors';

const schemaRegistry = platform.Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
schemaRegistry.registerSchema(workbenchColorsSchemaId, colorRegistry.getColorSchema());

const delayer = new RunOnceScheduler(() => schemaRegistry.notifySchemaChanged(workbenchColorsSchemaId), 200);

colorRegistry.onDidChangeSchema(() => {
	if (!delayer.isScheduled()) {
		delayer.schedule();
	}
});

// setTimeout(_ => console.log(colorRegistry.toString()), 5000);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/iconRegistry.ts]---
Location: vscode-main/src/vs/platform/theme/common/iconRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../base/common/async.js';
import { Codicon } from '../../../base/common/codicons.js';
import { getCodiconFontCharacters } from '../../../base/common/codiconsUtil.js';
import { ThemeIcon, IconIdentifier } from '../../../base/common/themables.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../base/common/jsonSchema.js';
import { isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../jsonschemas/common/jsonContributionRegistry.js';
import * as platform from '../../registry/common/platform.js';
import { Disposable } from '../../../base/common/lifecycle.js';

//  ------ API types


// icon registry
export const Extensions = {
	IconContribution: 'base.contributions.icons'
};

export type IconDefaults = ThemeIcon | IconDefinition;

export interface IconDefinition {
	readonly font?: IconFontContribution; // undefined for the default font (codicon)
	readonly fontCharacter: string;
}


export interface IconContribution {
	readonly id: string;
	description: string | undefined;
	readonly deprecationMessage?: string;
	readonly defaults: IconDefaults;
}

export namespace IconContribution {
	export function getDefinition(contribution: IconContribution, registry: IIconRegistry): IconDefinition | undefined {
		let definition = contribution.defaults;
		while (ThemeIcon.isThemeIcon(definition)) {
			const c = iconRegistry.getIcon(definition.id);
			if (!c) {
				return undefined;
			}
			definition = c.defaults;
		}
		return definition;
	}
}

export interface IconFontContribution {
	readonly id: string;
	readonly definition: IconFontDefinition;
}

export interface IconFontDefinition {
	readonly weight?: string;
	readonly style?: string;
	readonly src: IconFontSource[];
}

export namespace IconFontDefinition {
	export function toJSONObject(iconFont: IconFontDefinition): any {
		return {
			weight: iconFont.weight,
			style: iconFont.style,
			src: iconFont.src.map(s => ({ format: s.format, location: s.location.toString() }))
		};
	}
	export function fromJSONObject(json: any): IconFontDefinition | undefined {
		const stringOrUndef = (s: any) => isString(s) ? s : undefined;
		if (json && Array.isArray(json.src) && json.src.every((s: any) => isString(s.format) && isString(s.location))) {
			return {
				weight: stringOrUndef(json.weight),
				style: stringOrUndef(json.style),
				src: json.src.map((s: any) => ({ format: s.format, location: URI.parse(s.location) }))
			};
		}
		return undefined;
	}
}


export interface IconFontSource {
	readonly location: URI;
	readonly format: string;
}

export interface IIconRegistry {

	readonly onDidChange: Event<void>;

	/**
	 * Register a icon to the registry.
	 * @param id The icon id
	 * @param defaults The default values
	 * @param description The description
	 */
	registerIcon(id: IconIdentifier, defaults: IconDefaults, description?: string): ThemeIcon;

	/**
	 * Deregister a icon from the registry.
	 */
	deregisterIcon(id: IconIdentifier): void;

	/**
	 * Get all icon contributions
	 */
	getIcons(): IconContribution[];

	/**
	 * Get the icon for the given id
	 */
	getIcon(id: IconIdentifier): IconContribution | undefined;

	/**
	 * JSON schema for an object to assign icon values to one of the icon contributions.
	 */
	getIconSchema(): IJSONSchema;

	/**
	 * JSON schema to for a reference to a icon contribution.
	 */
	getIconReferenceSchema(): IJSONSchema;

	/**
	 * Register a icon font to the registry.
	 * @param id The icon font id
	 * @param definition The icon font definition
	 */
	registerIconFont(id: string, definition: IconFontDefinition): IconFontDefinition;

	/**
	 * Deregister an icon font to the registry.
	 */
	deregisterIconFont(id: string): void;

	/**
	 * Get the icon font for the given id
	 */
	getIconFont(id: string): IconFontDefinition | undefined;
}

// regexes for validation of font properties

export const fontIdRegex = /^([\w_-]+)$/;
export const fontStyleRegex = /^(normal|italic|(oblique[ \w\s-]+))$/;
export const fontWeightRegex = /^(normal|bold|lighter|bolder|(\d{0-1000}))$/;
export const fontSizeRegex = /^([\w_.%+-]+)$/;
export const fontFormatRegex = /^woff|woff2|truetype|opentype|embedded-opentype|svg$/;
export const fontColorRegex = /^#[0-9a-fA-F]{0,6}$/;

export const fontIdErrorMessage = localize('schema.fontId.formatError', 'The font ID must only contain letters, numbers, underscores and dashes.');

class IconRegistry extends Disposable implements IIconRegistry {

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private iconsById: { [key: string]: IconContribution };
	private iconSchema: IJSONSchema & { properties: IJSONSchemaMap } = {
		definitions: {
			icons: {
				type: 'object',
				properties: {
					fontId: { type: 'string', description: localize('iconDefinition.fontId', 'The id of the font to use. If not set, the font that is defined first is used.'), pattern: fontIdRegex.source, patternErrorMessage: fontIdErrorMessage },
					fontCharacter: { type: 'string', description: localize('iconDefinition.fontCharacter', 'The font character associated with the icon definition.') }
				},
				additionalProperties: false,
				defaultSnippets: [{ body: { fontCharacter: '\\\\e030' } }]
			}
		},
		type: 'object',
		properties: {}
	};
	private iconReferenceSchema: IJSONSchema & { enum: string[]; enumDescriptions: string[] } = { type: 'string', pattern: `^${ThemeIcon.iconNameExpression}$`, enum: [], enumDescriptions: [] };

	private iconFontsById: { [key: string]: IconFontDefinition };

	constructor() {
		super();
		this.iconsById = {};
		this.iconFontsById = {};
	}

	public registerIcon(id: string, defaults: IconDefaults, description?: string, deprecationMessage?: string): ThemeIcon {
		const existing = this.iconsById[id];
		if (existing) {
			if (description && !existing.description) {
				existing.description = description;
				this.iconSchema.properties[id].markdownDescription = `${description} $(${id})`;
				const enumIndex = this.iconReferenceSchema.enum.indexOf(id);
				if (enumIndex !== -1) {
					this.iconReferenceSchema.enumDescriptions[enumIndex] = description;
				}
				this._onDidChange.fire();
			}
			return existing;
		}
		const iconContribution: IconContribution = { id, description, defaults, deprecationMessage };
		this.iconsById[id] = iconContribution;
		const propertySchema: IJSONSchema = { $ref: '#/definitions/icons' };
		if (deprecationMessage) {
			propertySchema.deprecationMessage = deprecationMessage;
		}
		if (description) {
			propertySchema.markdownDescription = `${description}: $(${id})`;
		}
		this.iconSchema.properties[id] = propertySchema;
		this.iconReferenceSchema.enum.push(id);
		this.iconReferenceSchema.enumDescriptions.push(description || '');

		this._onDidChange.fire();
		return { id };
	}


	public deregisterIcon(id: string): void {
		delete this.iconsById[id];
		delete this.iconSchema.properties[id];
		const index = this.iconReferenceSchema.enum.indexOf(id);
		if (index !== -1) {
			this.iconReferenceSchema.enum.splice(index, 1);
			this.iconReferenceSchema.enumDescriptions.splice(index, 1);
		}
		this._onDidChange.fire();
	}

	public getIcons(): IconContribution[] {
		return Object.keys(this.iconsById).map(id => this.iconsById[id]);
	}

	public getIcon(id: string): IconContribution | undefined {
		return this.iconsById[id];
	}

	public getIconSchema(): IJSONSchema {
		return this.iconSchema;
	}

	public getIconReferenceSchema(): IJSONSchema {
		return this.iconReferenceSchema;
	}

	public registerIconFont(id: string, definition: IconFontDefinition): IconFontDefinition {
		const existing = this.iconFontsById[id];
		if (existing) {
			return existing;
		}
		this.iconFontsById[id] = definition;
		this._onDidChange.fire();
		return definition;
	}

	public deregisterIconFont(id: string): void {
		delete this.iconFontsById[id];
	}

	public getIconFont(id: string): IconFontDefinition | undefined {
		return this.iconFontsById[id];
	}

	public override toString() {
		const sorter = (i1: IconContribution, i2: IconContribution) => {
			return i1.id.localeCompare(i2.id);
		};
		const classNames = (i: IconContribution) => {
			while (ThemeIcon.isThemeIcon(i.defaults)) {
				i = this.iconsById[i.defaults.id];
			}
			return `codicon codicon-${i ? i.id : ''}`;
		};

		const reference = [];

		reference.push(`| preview     | identifier                        | default codicon ID                | description`);
		reference.push(`| ----------- | --------------------------------- | --------------------------------- | --------------------------------- |`);
		const contributions = Object.keys(this.iconsById).map(key => this.iconsById[key]);

		for (const i of contributions.filter(i => !!i.description).sort(sorter)) {
			reference.push(`|<i class="${classNames(i)}"></i>|${i.id}|${ThemeIcon.isThemeIcon(i.defaults) ? i.defaults.id : i.id}|${i.description || ''}|`);
		}

		reference.push(`| preview     | identifier                        `);
		reference.push(`| ----------- | --------------------------------- |`);

		for (const i of contributions.filter(i => !ThemeIcon.isThemeIcon(i.defaults)).sort(sorter)) {
			reference.push(`|<i class="${classNames(i)}"></i>|${i.id}|`);

		}

		return reference.join('\n');
	}

}

const iconRegistry = new IconRegistry();
platform.Registry.add(Extensions.IconContribution, iconRegistry);

export function registerIcon(id: string, defaults: IconDefaults, description: string, deprecationMessage?: string): ThemeIcon {
	return iconRegistry.registerIcon(id, defaults, description, deprecationMessage);
}

export function getIconRegistry(): IIconRegistry {
	return iconRegistry;
}

function initialize() {
	const codiconFontCharacters = getCodiconFontCharacters();
	for (const icon in codiconFontCharacters) {
		const fontCharacter = '\\' + codiconFontCharacters[icon].toString(16);
		iconRegistry.registerIcon(icon, { fontCharacter });
	}
}
initialize();

export const iconsSchemaId = 'vscode://schemas/icons';

const schemaRegistry = platform.Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
schemaRegistry.registerSchema(iconsSchemaId, iconRegistry.getIconSchema());

const delayer = new RunOnceScheduler(() => schemaRegistry.notifySchemaChanged(iconsSchemaId), 200);
iconRegistry.onDidChange(() => {
	if (!delayer.isScheduled()) {
		delayer.schedule();
	}
});

//setTimeout(_ => console.log(iconRegistry.toString()), 5000);


// common icons

export const widgetClose = registerIcon('widget-close', Codicon.close, localize('widgetClose', 'Icon for the close action in widgets.'));

export const gotoPreviousLocation = registerIcon('goto-previous-location', Codicon.arrowUp, localize('previousChangeIcon', 'Icon for goto previous editor location.'));
export const gotoNextLocation = registerIcon('goto-next-location', Codicon.arrowDown, localize('nextChangeIcon', 'Icon for goto next editor location.'));

export const syncing = ThemeIcon.modify(Codicon.sync, 'spin');
export const spinningLoading = ThemeIcon.modify(Codicon.loading, 'spin');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/sizeRegistry.ts]---
Location: vscode-main/src/vs/platform/theme/common/sizeRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export * from './sizeUtils.js';

// Make sure all size files are exported
export * from './sizes/baseSizes.js';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/sizeUtils.ts]---
Location: vscode-main/src/vs/platform/theme/common/sizeUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../jsonschemas/common/jsonContributionRegistry.js';
import * as platform from '../../registry/common/platform.js';
import { IColorTheme } from './themeService.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { RunOnceScheduler } from '../../../base/common/async.js';

//  ------ API types

export type SizeIdentifier = string;

/**
 * Size value unit types supported by the registry
 */
export type SizeUnit = 'px' | 'rem' | 'em' | '%';

/**
 * A size value with a numeric amount and unit
 */
export interface SizeValue {
	readonly value: number;
	readonly unit: SizeUnit;
}

export interface SizeContribution {
	readonly id: SizeIdentifier;
	readonly description: string;
	readonly defaults: SizeDefaults | SizeValue | null;
	readonly deprecationMessage: string | undefined;
}

/**
 * Returns the css variable name for the given size identifier. Dots (`.`) are replaced with hyphens (`-`) and
 * everything is prefixed with `--vscode-`.
 *
 * @sample `editor.fontSize` is `--vscode-editor-fontSize`.
 */
export function asCssVariableName(sizeIdent: SizeIdentifier): string {
	return `--vscode-${sizeIdent.replace(/\./g, '-')}`;
}

export function asCssVariable(size: SizeIdentifier): string {
	return `var(${asCssVariableName(size)})`;
}

export function asCssVariableWithDefault(size: SizeIdentifier, defaultCssValue: string): string {
	return `var(${asCssVariableName(size)}, ${defaultCssValue})`;
}

export interface SizeDefaults {
	light: SizeValue | null;
	dark: SizeValue | null;
	hcDark: SizeValue | null;
	hcLight: SizeValue | null;
}

export function isSizeDefaults(value: unknown): value is SizeDefaults {
	return value !== null && typeof value === 'object' && 'light' in value && 'dark' in value;
}

/**
 * Helper function to create a size value
 */
export function size(value: number, unit: SizeUnit = 'px'): SizeValue {
	return { value, unit };
}

/**
 * Helper function to create size defaults that use the same value for all themes
 */
export function sizeForAllThemes(value: number, unit: SizeUnit = 'px'): SizeDefaults {
	const sizeValue = size(value, unit);
	return {
		light: sizeValue,
		dark: sizeValue,
		hcDark: sizeValue,
		hcLight: sizeValue
	};
}

/**
 * Convert a size value to a CSS string
 */
export function sizeValueToCss(sizeValue: SizeValue): string {
	return `${sizeValue.value}${sizeValue.unit}`;
}

// size registry
export const Extensions = {
	SizeContribution: 'base.contributions.sizes'
};

export const DEFAULT_SIZE_CONFIG_VALUE = 'default';

export interface ISizeRegistry {

	readonly onDidChangeSchema: Event<void>;

	/**
	 * Register a size to the registry.
	 * @param id The size id as used in theme description files
	 * @param defaults The default values
	 * @param description the description
	 */
	registerSize(id: string, defaults: SizeDefaults | SizeValue | null, description: string): SizeIdentifier;

	/**
	 * Deregister a size from the registry.
	 */
	deregisterSize(id: string): void;

	/**
	 * Get all size contributions
	 */
	getSizes(): SizeContribution[];

	/**
	 * Gets the default size of the given id
	 */
	resolveDefaultSize(id: SizeIdentifier, theme: IColorTheme): SizeValue | undefined;

	/**
	 * JSON schema for an object to assign size values to one of the size contributions.
	 */
	getSizeSchema(): IJSONSchema;

	/**
	 * JSON schema for a reference to a size contribution.
	 */
	getSizeReferenceSchema(): IJSONSchema;

	/**
	 * Notify when the color theme or settings change.
	 */
	notifyThemeUpdate(theme: IColorTheme): void;

}

type IJSONSchemaForSizes = IJSONSchema & { properties: { [name: string]: IJSONSchema } };

class SizeRegistry extends Disposable implements ISizeRegistry {

	private readonly _onDidChangeSchema = this._register(new Emitter<void>());
	readonly onDidChangeSchema: Event<void> = this._onDidChangeSchema.event;

	private sizesById: { [key: string]: SizeContribution };
	private sizeSchema: IJSONSchemaForSizes = { type: 'object', properties: {} };
	private sizeReferenceSchema: IJSONSchema & { enum: string[]; enumDescriptions: string[] } = { type: 'string', enum: [], enumDescriptions: [] };

	constructor() {
		super();
		this.sizesById = {};
	}

	public notifyThemeUpdate(theme: IColorTheme) {
		for (const key of Object.keys(this.sizesById)) {
			const sizeVal = this.resolveDefaultSize(key, theme);
			if (sizeVal) {
				this.sizeSchema.properties[key].default = sizeValueToCss(sizeVal);
			}
		}
		this._onDidChangeSchema.fire();
	}

	public registerSize(id: string, defaults: SizeDefaults | SizeValue | null, description: string, deprecationMessage?: string): SizeIdentifier {
		const sizeContribution: SizeContribution = { id, description, defaults, deprecationMessage };
		this.sizesById[id] = sizeContribution;

		const propertySchema: IJSONSchema = {
			type: 'string',
			pattern: '^(\\d+(\\.\\d+)?(px|rem|em|%))|default$',
			patternErrorMessage: 'Size must be a number followed by px, rem, em, or % (e.g., "12px", "1.5rem") or "default"'
		};

		if (deprecationMessage) {
			propertySchema.deprecationMessage = deprecationMessage;
		}

		this.sizeSchema.properties[id] = {
			description,
			...propertySchema
		};

		this.sizeReferenceSchema.enum.push(id);
		this.sizeReferenceSchema.enumDescriptions.push(description);

		this._onDidChangeSchema.fire();
		return id;
	}

	public deregisterSize(id: string): void {
		delete this.sizesById[id];
		delete this.sizeSchema.properties[id];
		const index = this.sizeReferenceSchema.enum.indexOf(id);
		if (index !== -1) {
			this.sizeReferenceSchema.enum.splice(index, 1);
			this.sizeReferenceSchema.enumDescriptions.splice(index, 1);
		}
		this._onDidChangeSchema.fire();
	}

	public getSizes(): SizeContribution[] {
		return Object.keys(this.sizesById).map(id => this.sizesById[id]);
	}

	public resolveDefaultSize(id: SizeIdentifier, theme: IColorTheme): SizeValue | undefined {
		const sizeDesc = this.sizesById[id];
		if (sizeDesc?.defaults) {
			const sizeValue = isSizeDefaults(sizeDesc.defaults) ? sizeDesc.defaults[theme.type] : sizeDesc.defaults;
			return sizeValue ?? undefined;
		}
		return undefined;
	}

	public getSizeSchema(): IJSONSchema {
		return this.sizeSchema;
	}

	public getSizeReferenceSchema(): IJSONSchema {
		return this.sizeReferenceSchema;
	}

	public override toString() {
		const sorter = (a: string, b: string) => {
			const cat1 = a.indexOf('.') === -1 ? 0 : 1;
			const cat2 = b.indexOf('.') === -1 ? 0 : 1;
			if (cat1 !== cat2) {
				return cat1 - cat2;
			}
			return a.localeCompare(b);
		};

		return Object.keys(this.sizesById).sort(sorter).map(k => `- \`${k}\`: ${this.sizesById[k].description}`).join('\n');
	}

}

const sizeRegistry = new SizeRegistry();
platform.Registry.add(Extensions.SizeContribution, sizeRegistry);

export function registerSize(id: string, defaults: SizeDefaults | SizeValue | null, description: string, deprecationMessage?: string): SizeIdentifier {
	return sizeRegistry.registerSize(id, defaults, description, deprecationMessage);
}

export function getSizeRegistry(): ISizeRegistry {
	return sizeRegistry;
}

export const workbenchSizesSchemaId = 'vscode://schemas/workbench-sizes';

const schemaRegistry = platform.Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
schemaRegistry.registerSchema(workbenchSizesSchemaId, sizeRegistry.getSizeSchema());

const delayer = new RunOnceScheduler(() => schemaRegistry.notifySchemaChanged(workbenchSizesSchemaId), 200);

sizeRegistry.onDidChangeSchema(() => {
	if (!delayer.isScheduled()) {
		delayer.schedule();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/theme.ts]---
Location: vscode-main/src/vs/platform/theme/common/theme.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Color scheme used by the OS and by color themes.
 */
export enum ColorScheme {
	DARK = 'dark',
	LIGHT = 'light',
	HIGH_CONTRAST_DARK = 'hcDark',
	HIGH_CONTRAST_LIGHT = 'hcLight'
}

export enum ThemeTypeSelector {
	VS = 'vs',
	VS_DARK = 'vs-dark',
	HC_BLACK = 'hc-black',
	HC_LIGHT = 'hc-light'
}


export function isHighContrast(scheme: ColorScheme): boolean {
	return scheme === ColorScheme.HIGH_CONTRAST_DARK || scheme === ColorScheme.HIGH_CONTRAST_LIGHT;
}

export function isDark(scheme: ColorScheme): boolean {
	return scheme === ColorScheme.DARK || scheme === ColorScheme.HIGH_CONTRAST_DARK;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/themeService.ts]---
Location: vscode-main/src/vs/platform/theme/common/themeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../base/common/codicons.js';
import { Color } from '../../../base/common/color.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import * as platform from '../../registry/common/platform.js';
import { ColorIdentifier } from './colorRegistry.js';
import { IconContribution, IconDefinition } from './iconRegistry.js';
import { ColorScheme, ThemeTypeSelector } from './theme.js';

export const IThemeService = createDecorator<IThemeService>('themeService');

export function themeColorFromId(id: ColorIdentifier) {
	return { id };
}

export const FileThemeIcon = Codicon.file;
export const FolderThemeIcon = Codicon.folder;

export function getThemeTypeSelector(type: ColorScheme): ThemeTypeSelector {
	switch (type) {
		case ColorScheme.DARK: return ThemeTypeSelector.VS_DARK;
		case ColorScheme.HIGH_CONTRAST_DARK: return ThemeTypeSelector.HC_BLACK;
		case ColorScheme.HIGH_CONTRAST_LIGHT: return ThemeTypeSelector.HC_LIGHT;
		default: return ThemeTypeSelector.VS;
	}
}

export interface ITokenStyle {
	readonly foreground: number | undefined;
	readonly bold: boolean | undefined;
	readonly underline: boolean | undefined;
	readonly strikethrough: boolean | undefined;
	readonly italic: boolean | undefined;
}

export interface IColorTheme {

	readonly type: ColorScheme;

	readonly label: string;

	/**
	 * Resolves the color of the given color identifier. If the theme does not
	 * specify the color, the default color is returned unless <code>useDefault</code> is set to false.
	 * @param color the id of the color
	 * @param useDefault specifies if the default color should be used. If not set, the default is used.
	 */
	getColor(color: ColorIdentifier, useDefault?: boolean): Color | undefined;

	/**
	 * Returns whether the theme defines a value for the color. If not, that means the
	 * default color will be used.
	 */
	defines(color: ColorIdentifier): boolean;

	/**
	 * Returns the token style for a given classification. The result uses the <code>MetadataConsts</code> format
	 */
	getTokenStyleMetadata(type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined;

	/**
	 * List of all colors used with tokens. <code>getTokenStyleMetadata</code> references the colors by index into this list.
	 */
	readonly tokenColorMap: string[];

	/**
	 * List of all the fonts used with tokens.
	 */
	readonly tokenFontMap: IFontTokenOptions[];

	/**
	 * Defines whether semantic highlighting should be enabled for the theme.
	 */
	readonly semanticHighlighting: boolean;
}

export class IFontTokenOptions {
	fontFamily?: string;
	fontSize?: string;
	lineHeight?: number;
}

export interface IFileIconTheme {
	readonly hasFileIcons: boolean;
	readonly hasFolderIcons: boolean;
	readonly hidesExplorerArrows: boolean;
}

export interface IProductIconTheme {
	/**
	 * Resolves the definition for the given icon as defined by the theme.
	 *
	 * @param iconContribution The icon
	 */
	getIcon(iconContribution: IconContribution): IconDefinition | undefined;
}


export interface ICssStyleCollector {
	addRule(rule: string): void;
}

export interface IThemingParticipant {
	(theme: IColorTheme, collector: ICssStyleCollector, environment: IEnvironmentService): void;
}

export interface IThemeService {
	readonly _serviceBrand: undefined;

	getColorTheme(): IColorTheme;

	readonly onDidColorThemeChange: Event<IColorTheme>;

	getFileIconTheme(): IFileIconTheme;

	readonly onDidFileIconThemeChange: Event<IFileIconTheme>;

	getProductIconTheme(): IProductIconTheme;

	readonly onDidProductIconThemeChange: Event<IProductIconTheme>;

}

// static theming participant
export const Extensions = {
	ThemingContribution: 'base.contributions.theming'
};

export interface IThemingRegistry {

	/**
	 * Register a theming participant that is invoked on every theme change.
	 */
	onColorThemeChange(participant: IThemingParticipant): IDisposable;

	getThemingParticipants(): IThemingParticipant[];

	readonly onThemingParticipantAdded: Event<IThemingParticipant>;
}

class ThemingRegistry extends Disposable implements IThemingRegistry {
	private themingParticipants: IThemingParticipant[] = [];
	private readonly onThemingParticipantAddedEmitter: Emitter<IThemingParticipant>;

	constructor() {
		super();
		this.themingParticipants = [];
		this.onThemingParticipantAddedEmitter = this._register(new Emitter<IThemingParticipant>());
	}

	public onColorThemeChange(participant: IThemingParticipant): IDisposable {
		this.themingParticipants.push(participant);
		this.onThemingParticipantAddedEmitter.fire(participant);
		return toDisposable(() => {
			const idx = this.themingParticipants.indexOf(participant);
			this.themingParticipants.splice(idx, 1);
		});
	}

	public get onThemingParticipantAdded(): Event<IThemingParticipant> {
		return this.onThemingParticipantAddedEmitter.event;
	}

	public getThemingParticipants(): IThemingParticipant[] {
		return this.themingParticipants;
	}
}

const themingRegistry = new ThemingRegistry();
platform.Registry.add(Extensions.ThemingContribution, themingRegistry);

export function registerThemingParticipant(participant: IThemingParticipant): IDisposable {
	return themingRegistry.onColorThemeChange(participant);
}

/**
 * Utility base class for all themable components.
 */
export class Themable extends Disposable {
	protected theme: IColorTheme;

	constructor(
		protected themeService: IThemeService
	) {
		super();

		this.theme = themeService.getColorTheme();

		// Hook up to theme changes
		this._register(this.themeService.onDidColorThemeChange(theme => this.onThemeChange(theme)));
	}

	protected onThemeChange(theme: IColorTheme): void {
		this.theme = theme;

		this.updateStyles();
	}

	updateStyles(): void {
		// Subclasses to override
	}

	protected getColor(id: string, modify?: (color: Color, theme: IColorTheme) => Color): string | null {
		let color = this.theme.getColor(id);

		if (color && modify) {
			color = modify(color, this.theme);
		}

		return color ? color.toString() : null;
	}
}

export interface IPartsSplash {
	zoomLevel: number | undefined;
	baseTheme: ThemeTypeSelector;
	colorInfo: {
		background: string;
		foreground: string | undefined;
		editorBackground: string | undefined;
		titleBarBackground: string | undefined;
		titleBarBorder: string | undefined;
		activityBarBackground: string | undefined;
		activityBarBorder: string | undefined;
		sideBarBackground: string | undefined;
		sideBarBorder: string | undefined;
		statusBarBackground: string | undefined;
		statusBarBorder: string | undefined;
		statusBarNoFolderBackground: string | undefined;
		windowBorder: string | undefined;
	};
	layoutInfo: {
		sideBarSide: string;
		editorPartMinWidth: number;
		titleBarHeight: number;
		activityBarWidth: number;
		sideBarWidth: number;
		auxiliaryBarWidth: number;
		statusBarHeight: number;
		windowBorder: boolean;
		windowBorderRadius: string | undefined;
	} | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/tokenClassificationRegistry.ts]---
Location: vscode-main/src/vs/platform/theme/common/tokenClassificationRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RunOnceScheduler } from '../../../base/common/async.js';
import { Color } from '../../../base/common/color.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../base/common/jsonSchema.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import * as nls from '../../../nls.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../jsonschemas/common/jsonContributionRegistry.js';
import * as platform from '../../registry/common/platform.js';
import { IColorTheme } from './themeService.js';

const TOKEN_TYPE_WILDCARD = '*';
const TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR = ':';
const CLASSIFIER_MODIFIER_SEPARATOR = '.';

// qualified string [type|*](.modifier)*(/language)!
type TokenClassificationString = string;

const idPattern = '\\w+[-_\\w+]*';
export const typeAndModifierIdPattern = `^${idPattern}$`;

const selectorPattern = `^(${idPattern}|\\*)(\\${CLASSIFIER_MODIFIER_SEPARATOR}${idPattern})*(${TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR}${idPattern})?$`;

const fontStylePattern = '^(\\s*(italic|bold|underline|strikethrough))*\\s*$';

export interface TokenSelector {
	match(type: string, modifiers: string[], language: string): number;
	readonly id: string;
}

export interface TokenTypeOrModifierContribution {
	readonly num: number;
	readonly id: string;
	readonly superType?: string;
	readonly description: string;
	readonly deprecationMessage?: string;
}


export interface TokenStyleData {
	foreground: Color | undefined;
	bold: boolean | undefined;
	underline: boolean | undefined;
	strikethrough: boolean | undefined;
	italic: boolean | undefined;
}

export class TokenStyle implements Readonly<TokenStyleData> {
	constructor(
		public readonly foreground: Color | undefined,
		public readonly bold: boolean | undefined,
		public readonly underline: boolean | undefined,
		public readonly strikethrough: boolean | undefined,
		public readonly italic: boolean | undefined,
	) {
	}
}

export namespace TokenStyle {
	export function toJSONObject(style: TokenStyle): any {
		return {
			_foreground: style.foreground === undefined ? null : Color.Format.CSS.formatHexA(style.foreground, true),
			_bold: style.bold === undefined ? null : style.bold,
			_underline: style.underline === undefined ? null : style.underline,
			_italic: style.italic === undefined ? null : style.italic,
			_strikethrough: style.strikethrough === undefined ? null : style.strikethrough,
		};
	}
	export function fromJSONObject(obj: any): TokenStyle | undefined {
		if (obj) {
			const boolOrUndef = (b: any) => (typeof b === 'boolean') ? b : undefined;
			const colorOrUndef = (s: any) => (typeof s === 'string') ? Color.fromHex(s) : undefined;
			return new TokenStyle(
				colorOrUndef(obj._foreground),
				boolOrUndef(obj._bold),
				boolOrUndef(obj._underline),
				boolOrUndef(obj._strikethrough),
				boolOrUndef(obj._italic)
			);
		}
		return undefined;
	}
	export function equals(s1: any, s2: any): boolean {
		if (s1 === s2) {
			return true;
		}
		return s1 !== undefined && s2 !== undefined
			&& (s1.foreground instanceof Color ? s1.foreground.equals(s2.foreground) : s2.foreground === undefined)
			&& s1.bold === s2.bold
			&& s1.underline === s2.underline
			&& s1.strikethrough === s2.strikethrough
			&& s1.italic === s2.italic;
	}
	export function is(s: any): s is TokenStyle {
		return s instanceof TokenStyle;
	}
	export function fromData(data: { foreground: Color | undefined; bold: boolean | undefined; underline: boolean | undefined; strikethrough: boolean | undefined; italic: boolean | undefined }): TokenStyle {
		return new TokenStyle(data.foreground, data.bold, data.underline, data.strikethrough, data.italic);
	}
	export function fromSettings(foreground: string | undefined, fontStyle: string | undefined): TokenStyle;
	export function fromSettings(foreground: string | undefined, fontStyle: string | undefined, bold: boolean | undefined, underline: boolean | undefined, strikethrough: boolean | undefined, italic: boolean | undefined): TokenStyle;
	export function fromSettings(foreground: string | undefined, fontStyle: string | undefined, bold?: boolean, underline?: boolean, strikethrough?: boolean, italic?: boolean): TokenStyle {
		let foregroundColor = undefined;
		if (foreground !== undefined) {
			foregroundColor = Color.fromHex(foreground);
		}
		if (fontStyle !== undefined) {
			bold = italic = underline = strikethrough = false;
			const expression = /italic|bold|underline|strikethrough/g;
			let match;
			while ((match = expression.exec(fontStyle))) {
				switch (match[0]) {
					case 'bold': bold = true; break;
					case 'italic': italic = true; break;
					case 'underline': underline = true; break;
					case 'strikethrough': strikethrough = true; break;
				}
			}
		}
		return new TokenStyle(foregroundColor, bold, underline, strikethrough, italic);
	}
}

export type ProbeScope = string[];

export interface TokenStyleFunction {
	(theme: IColorTheme): TokenStyle | undefined;
}

export interface TokenStyleDefaults {
	scopesToProbe?: ProbeScope[];
	light?: TokenStyleValue;
	dark?: TokenStyleValue;
	hcDark?: TokenStyleValue;
	hcLight?: TokenStyleValue;
}

export interface SemanticTokenDefaultRule {
	selector: TokenSelector;
	defaults: TokenStyleDefaults;
}

export interface SemanticTokenRule {
	style: TokenStyle;
	selector: TokenSelector;
}

export namespace SemanticTokenRule {
	export function fromJSONObject(registry: ITokenClassificationRegistry, o: any): SemanticTokenRule | undefined {
		if (o && typeof o._selector === 'string' && o._style) {
			const style = TokenStyle.fromJSONObject(o._style);
			if (style) {
				try {
					return { selector: registry.parseTokenSelector(o._selector), style };
				} catch (_ignore) {
				}
			}
		}
		return undefined;
	}
	export function toJSONObject(rule: SemanticTokenRule): any {
		return {
			_selector: rule.selector.id,
			_style: TokenStyle.toJSONObject(rule.style)
		};
	}
	export function equals(r1: SemanticTokenRule | undefined, r2: SemanticTokenRule | undefined) {
		if (r1 === r2) {
			return true;
		}
		return r1 !== undefined && r2 !== undefined
			&& r1.selector && r2.selector && r1.selector.id === r2.selector.id
			&& TokenStyle.equals(r1.style, r2.style);
	}
	export function is(r: any): r is SemanticTokenRule {
		return r && r.selector && typeof r.selector.id === 'string' && TokenStyle.is(r.style);
	}
}

/**
 * A TokenStyle Value is either a token style literal, or a TokenClassificationString
 */
export type TokenStyleValue = TokenStyle | TokenClassificationString;

// TokenStyle registry
const Extensions = {
	TokenClassificationContribution: 'base.contributions.tokenClassification'
};

export interface ITokenClassificationRegistry {

	readonly onDidChangeSchema: Event<void>;

	/**
	 * Register a token type to the registry.
	 * @param id The TokenType id as used in theme description files
	 * @param description the description
	 */
	registerTokenType(id: string, description: string, superType?: string, deprecationMessage?: string): void;

	/**
	 * Register a token modifier to the registry.
	 * @param id The TokenModifier id as used in theme description files
	 * @param description the description
	 */
	registerTokenModifier(id: string, description: string): void;

	/**
	 * Parses a token selector from a selector string.
	 * @param selectorString selector string in the form (*|type)(.modifier)*
	 * @param language language to which the selector applies or undefined if the selector is for all languafe
	 * @returns the parsesd selector
	 * @throws an error if the string is not a valid selector
	 */
	parseTokenSelector(selectorString: string, language?: string): TokenSelector;

	/**
	 * Register a TokenStyle default to the registry.
	 * @param selector The rule selector
	 * @param defaults The default values
	 */
	registerTokenStyleDefault(selector: TokenSelector, defaults: TokenStyleDefaults): void;

	/**
	 * Deregister a TokenStyle default to the registry.
	 * @param selector The rule selector
	 */
	deregisterTokenStyleDefault(selector: TokenSelector): void;

	/**
	 * Deregister a TokenType from the registry.
	 */
	deregisterTokenType(id: string): void;

	/**
	 * Deregister a TokenModifier from the registry.
	 */
	deregisterTokenModifier(id: string): void;

	/**
	 * Get all TokenType contributions
	 */
	getTokenTypes(): TokenTypeOrModifierContribution[];

	/**
	 * Get all TokenModifier contributions
	 */
	getTokenModifiers(): TokenTypeOrModifierContribution[];

	/**
	 * The styling rules to used when a schema does not define any styling rules.
	 */
	getTokenStylingDefaultRules(): SemanticTokenDefaultRule[];

	/**
	 * JSON schema for an object to assign styling to token classifications
	 */
	getTokenStylingSchema(): IJSONSchema;
}

class TokenClassificationRegistry extends Disposable implements ITokenClassificationRegistry {

	private readonly _onDidChangeSchema = this._register(new Emitter<void>());
	readonly onDidChangeSchema: Event<void> = this._onDidChangeSchema.event;

	private currentTypeNumber = 0;
	private currentModifierBit = 1;

	private tokenTypeById: { [key: string]: TokenTypeOrModifierContribution };
	private tokenModifierById: { [key: string]: TokenTypeOrModifierContribution };

	private tokenStylingDefaultRules: SemanticTokenDefaultRule[] = [];

	private typeHierarchy: { [id: string]: string[] };

	private tokenStylingSchema: IJSONSchema & { properties: IJSONSchemaMap; patternProperties: IJSONSchemaMap } = {
		type: 'object',
		properties: {},
		patternProperties: {
			[selectorPattern]: getStylingSchemeEntry()
		},
		//errorMessage: nls.localize('schema.token.errors', 'Valid token selectors have the form (*|tokenType)(.tokenModifier)*(:tokenLanguage)?.'),
		additionalProperties: false,
		definitions: {
			style: {
				type: 'object',
				description: nls.localize('schema.token.settings', 'Colors and styles for the token.'),
				properties: {
					foreground: {
						type: 'string',
						description: nls.localize('schema.token.foreground', 'Foreground color for the token.'),
						format: 'color-hex',
						default: '#ff0000'
					},
					background: {
						type: 'string',
						deprecationMessage: nls.localize('schema.token.background.warning', 'Token background colors are currently not supported.')
					},
					fontStyle: {
						type: 'string',
						description: nls.localize('schema.token.fontStyle', 'Sets the all font styles of the rule: \'italic\', \'bold\', \'underline\' or \'strikethrough\' or a combination. All styles that are not listed are unset. The empty string unsets all styles.'),
						pattern: fontStylePattern,
						patternErrorMessage: nls.localize('schema.fontStyle.error', 'Font style must be \'italic\', \'bold\', \'underline\' or \'strikethrough\' or a combination. The empty string unsets all styles.'),
						defaultSnippets: [
							{ label: nls.localize('schema.token.fontStyle.none', 'None (clear inherited style)'), bodyText: '""' },
							{ body: 'italic' },
							{ body: 'bold' },
							{ body: 'underline' },
							{ body: 'strikethrough' },
							{ body: 'italic bold' },
							{ body: 'italic underline' },
							{ body: 'italic strikethrough' },
							{ body: 'bold underline' },
							{ body: 'bold strikethrough' },
							{ body: 'underline strikethrough' },
							{ body: 'italic bold underline' },
							{ body: 'italic bold strikethrough' },
							{ body: 'italic underline strikethrough' },
							{ body: 'bold underline strikethrough' },
							{ body: 'italic bold underline strikethrough' }
						]
					},
					bold: {
						type: 'boolean',
						description: nls.localize('schema.token.bold', 'Sets or unsets the font style to bold. Note, the presence of \'fontStyle\' overrides this setting.'),
					},
					italic: {
						type: 'boolean',
						description: nls.localize('schema.token.italic', 'Sets or unsets the font style to italic. Note, the presence of \'fontStyle\' overrides this setting.'),
					},
					underline: {
						type: 'boolean',
						description: nls.localize('schema.token.underline', 'Sets or unsets the font style to underline. Note, the presence of \'fontStyle\' overrides this setting.'),
					},
					strikethrough: {
						type: 'boolean',
						description: nls.localize('schema.token.strikethrough', 'Sets or unsets the font style to strikethrough. Note, the presence of \'fontStyle\' overrides this setting.'),
					}

				},
				defaultSnippets: [{ body: { foreground: '${1:#FF0000}', fontStyle: '${2:bold}' } }]
			}
		}
	};

	constructor() {
		super();
		this.tokenTypeById = Object.create(null);
		this.tokenModifierById = Object.create(null);
		this.typeHierarchy = Object.create(null);
	}

	public registerTokenType(id: string, description: string, superType?: string, deprecationMessage?: string): void {
		if (!id.match(typeAndModifierIdPattern)) {
			throw new Error('Invalid token type id.');
		}
		if (superType && !superType.match(typeAndModifierIdPattern)) {
			throw new Error('Invalid token super type id.');
		}

		const num = this.currentTypeNumber++;
		const tokenStyleContribution: TokenTypeOrModifierContribution = { num, id, superType, description, deprecationMessage };
		this.tokenTypeById[id] = tokenStyleContribution;

		const stylingSchemeEntry = getStylingSchemeEntry(description, deprecationMessage);
		this.tokenStylingSchema.properties[id] = stylingSchemeEntry;
		this.typeHierarchy = Object.create(null);
	}

	public registerTokenModifier(id: string, description: string, deprecationMessage?: string): void {
		if (!id.match(typeAndModifierIdPattern)) {
			throw new Error('Invalid token modifier id.');
		}

		const num = this.currentModifierBit;
		this.currentModifierBit = this.currentModifierBit * 2;
		const tokenStyleContribution: TokenTypeOrModifierContribution = { num, id, description, deprecationMessage };
		this.tokenModifierById[id] = tokenStyleContribution;

		this.tokenStylingSchema.properties[`*.${id}`] = getStylingSchemeEntry(description, deprecationMessage);
	}

	public parseTokenSelector(selectorString: string, language?: string): TokenSelector {
		const selector = parseClassifierString(selectorString, language);

		if (!selector.type) {
			return {
				match: () => -1,
				id: '$invalid'
			};
		}

		return {
			match: (type: string, modifiers: string[], language: string) => {
				let score = 0;
				if (selector.language !== undefined) {
					if (selector.language !== language) {
						return -1;
					}
					score += 10;
				}
				if (selector.type !== TOKEN_TYPE_WILDCARD) {
					const hierarchy = this.getTypeHierarchy(type);
					const level = hierarchy.indexOf(selector.type);
					if (level === -1) {
						return -1;
					}
					score += (100 - level);
				}
				// all selector modifiers must be present
				for (const selectorModifier of selector.modifiers) {
					if (modifiers.indexOf(selectorModifier) === -1) {
						return -1;
					}
				}
				return score + selector.modifiers.length * 100;
			},
			id: `${[selector.type, ...selector.modifiers.sort()].join('.')}${selector.language !== undefined ? ':' + selector.language : ''}`
		};
	}

	public registerTokenStyleDefault(selector: TokenSelector, defaults: TokenStyleDefaults): void {
		this.tokenStylingDefaultRules.push({ selector, defaults });
	}

	public deregisterTokenStyleDefault(selector: TokenSelector): void {
		const selectorString = selector.id;
		this.tokenStylingDefaultRules = this.tokenStylingDefaultRules.filter(r => r.selector.id !== selectorString);
	}

	public deregisterTokenType(id: string): void {
		delete this.tokenTypeById[id];
		delete this.tokenStylingSchema.properties[id];
		this.typeHierarchy = Object.create(null);
	}

	public deregisterTokenModifier(id: string): void {
		delete this.tokenModifierById[id];
		delete this.tokenStylingSchema.properties[`*.${id}`];
	}

	public getTokenTypes(): TokenTypeOrModifierContribution[] {
		return Object.keys(this.tokenTypeById).map(id => this.tokenTypeById[id]);
	}

	public getTokenModifiers(): TokenTypeOrModifierContribution[] {
		return Object.keys(this.tokenModifierById).map(id => this.tokenModifierById[id]);
	}

	public getTokenStylingSchema(): IJSONSchema {
		return this.tokenStylingSchema;
	}

	public getTokenStylingDefaultRules(): SemanticTokenDefaultRule[] {
		return this.tokenStylingDefaultRules;
	}

	private getTypeHierarchy(typeId: string): string[] {
		let hierarchy = this.typeHierarchy[typeId];
		if (!hierarchy) {
			this.typeHierarchy[typeId] = hierarchy = [typeId];
			let type = this.tokenTypeById[typeId];
			while (type && type.superType) {
				hierarchy.push(type.superType);
				type = this.tokenTypeById[type.superType];
			}
		}
		return hierarchy;
	}


	public override toString() {
		const sorter = (a: string, b: string) => {
			const cat1 = a.indexOf('.') === -1 ? 0 : 1;
			const cat2 = b.indexOf('.') === -1 ? 0 : 1;
			if (cat1 !== cat2) {
				return cat1 - cat2;
			}
			return a.localeCompare(b);
		};

		return Object.keys(this.tokenTypeById).sort(sorter).map(k => `- \`${k}\`: ${this.tokenTypeById[k].description}`).join('\n');
	}

}

const CHAR_LANGUAGE = TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR.charCodeAt(0);
const CHAR_MODIFIER = CLASSIFIER_MODIFIER_SEPARATOR.charCodeAt(0);

export function parseClassifierString(s: string, defaultLanguage: string): { type: string; modifiers: string[]; language: string };
export function parseClassifierString(s: string, defaultLanguage?: string): { type: string; modifiers: string[]; language: string | undefined };
export function parseClassifierString(s: string, defaultLanguage: string | undefined): { type: string; modifiers: string[]; language: string | undefined } {
	let k = s.length;
	let language: string | undefined = defaultLanguage;
	const modifiers = [];

	for (let i = k - 1; i >= 0; i--) {
		const ch = s.charCodeAt(i);
		if (ch === CHAR_LANGUAGE || ch === CHAR_MODIFIER) {
			const segment = s.substring(i + 1, k);
			k = i;
			if (ch === CHAR_LANGUAGE) {
				language = segment;
			} else {
				modifiers.push(segment);
			}
		}
	}
	const type = s.substring(0, k);
	return { type, modifiers, language };
}


const tokenClassificationRegistry = createDefaultTokenClassificationRegistry();
platform.Registry.add(Extensions.TokenClassificationContribution, tokenClassificationRegistry);


function createDefaultTokenClassificationRegistry(): TokenClassificationRegistry {

	const registry = new TokenClassificationRegistry();

	function registerTokenType(id: string, description: string, scopesToProbe: ProbeScope[] = [], superType?: string, deprecationMessage?: string): string {
		registry.registerTokenType(id, description, superType, deprecationMessage);
		if (scopesToProbe) {
			registerTokenStyleDefault(id, scopesToProbe);
		}
		return id;
	}

	function registerTokenStyleDefault(selectorString: string, scopesToProbe: ProbeScope[]) {
		try {
			const selector = registry.parseTokenSelector(selectorString);
			registry.registerTokenStyleDefault(selector, { scopesToProbe });
		} catch (e) {
			console.log(e);
		}
	}

	// default token types

	registerTokenType('comment', nls.localize('comment', "Style for comments."), [['comment']]);
	registerTokenType('string', nls.localize('string', "Style for strings."), [['string']]);
	registerTokenType('keyword', nls.localize('keyword', "Style for keywords."), [['keyword.control']]);
	registerTokenType('number', nls.localize('number', "Style for numbers."), [['constant.numeric']]);
	registerTokenType('regexp', nls.localize('regexp', "Style for expressions."), [['constant.regexp']]);
	registerTokenType('operator', nls.localize('operator', "Style for operators."), [['keyword.operator']]);

	registerTokenType('namespace', nls.localize('namespace', "Style for namespaces."), [['entity.name.namespace']]);

	registerTokenType('type', nls.localize('type', "Style for types."), [['entity.name.type'], ['support.type']]);
	registerTokenType('struct', nls.localize('struct', "Style for structs."), [['entity.name.type.struct']]);
	registerTokenType('class', nls.localize('class', "Style for classes."), [['entity.name.type.class'], ['support.class']]);
	registerTokenType('interface', nls.localize('interface', "Style for interfaces."), [['entity.name.type.interface']]);
	registerTokenType('enum', nls.localize('enum', "Style for enums."), [['entity.name.type.enum']]);
	registerTokenType('typeParameter', nls.localize('typeParameter', "Style for type parameters."), [['entity.name.type.parameter']]);

	registerTokenType('function', nls.localize('function', "Style for functions"), [['entity.name.function'], ['support.function']]);
	registerTokenType('member', nls.localize('member', "Style for member functions"), [], 'method', 'Deprecated use `method` instead');
	registerTokenType('method', nls.localize('method', "Style for method (member functions)"), [['entity.name.function.member'], ['support.function']]);
	registerTokenType('macro', nls.localize('macro', "Style for macros."), [['entity.name.function.preprocessor']]);

	registerTokenType('variable', nls.localize('variable', "Style for variables."), [['variable.other.readwrite'], ['entity.name.variable']]);
	registerTokenType('parameter', nls.localize('parameter', "Style for parameters."), [['variable.parameter']]);
	registerTokenType('property', nls.localize('property', "Style for properties."), [['variable.other.property']]);
	registerTokenType('enumMember', nls.localize('enumMember', "Style for enum members."), [['variable.other.enummember']]);
	registerTokenType('event', nls.localize('event', "Style for events."), [['variable.other.event']]);
	registerTokenType('decorator', nls.localize('decorator', "Style for decorators & annotations."), [['entity.name.decorator'], ['entity.name.function']]);

	registerTokenType('label', nls.localize('labels', "Style for labels. "), undefined);

	// default token modifiers

	registry.registerTokenModifier('declaration', nls.localize('declaration', "Style for all symbol declarations."), undefined);
	registry.registerTokenModifier('documentation', nls.localize('documentation', "Style to use for references in documentation."), undefined);
	registry.registerTokenModifier('static', nls.localize('static', "Style to use for symbols that are static."), undefined);
	registry.registerTokenModifier('abstract', nls.localize('abstract', "Style to use for symbols that are abstract."), undefined);
	registry.registerTokenModifier('deprecated', nls.localize('deprecated', "Style to use for symbols that are deprecated."), undefined);
	registry.registerTokenModifier('modification', nls.localize('modification', "Style to use for write accesses."), undefined);
	registry.registerTokenModifier('async', nls.localize('async', "Style to use for symbols that are async."), undefined);
	registry.registerTokenModifier('readonly', nls.localize('readonly', "Style to use for symbols that are read-only."), undefined);


	registerTokenStyleDefault('variable.readonly', [['variable.other.constant']]);
	registerTokenStyleDefault('property.readonly', [['variable.other.constant.property']]);
	registerTokenStyleDefault('type.defaultLibrary', [['support.type']]);
	registerTokenStyleDefault('class.defaultLibrary', [['support.class']]);
	registerTokenStyleDefault('interface.defaultLibrary', [['support.class']]);
	registerTokenStyleDefault('variable.defaultLibrary', [['support.variable'], ['support.other.variable']]);
	registerTokenStyleDefault('variable.defaultLibrary.readonly', [['support.constant']]);
	registerTokenStyleDefault('property.defaultLibrary', [['support.variable.property']]);
	registerTokenStyleDefault('property.defaultLibrary.readonly', [['support.constant.property']]);
	registerTokenStyleDefault('function.defaultLibrary', [['support.function']]);
	registerTokenStyleDefault('member.defaultLibrary', [['support.function']]);
	return registry;
}

export function getTokenClassificationRegistry(): ITokenClassificationRegistry {
	return tokenClassificationRegistry;
}

function getStylingSchemeEntry(description?: string, deprecationMessage?: string): IJSONSchema {
	return {
		description,
		deprecationMessage,
		defaultSnippets: [{ body: '${1:#ff0000}' }],
		anyOf: [
			{
				type: 'string',
				format: 'color-hex'
			},
			{
				$ref: '#/definitions/style'
			}
		]
	};
}

export const tokenStylingSchemaId = 'vscode://schemas/token-styling';

const schemaRegistry = platform.Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
schemaRegistry.registerSchema(tokenStylingSchemaId, tokenClassificationRegistry.getTokenStylingSchema());

const delayer = new RunOnceScheduler(() => schemaRegistry.notifySchemaChanged(tokenStylingSchemaId), 200);
tokenClassificationRegistry.onDidChangeSchema(() => {
	if (!delayer.isScheduled()) {
		delayer.schedule();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/baseColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/baseColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color } from '../../../../base/common/color.js';
import { registerColor, transparent } from '../colorUtils.js';


export const foreground = registerColor('foreground',
	{ dark: '#CCCCCC', light: '#616161', hcDark: '#FFFFFF', hcLight: '#292929' },
	nls.localize('foreground', "Overall foreground color. This color is only used if not overridden by a component."));

export const disabledForeground = registerColor('disabledForeground',
	{ dark: '#CCCCCC80', light: '#61616180', hcDark: '#A5A5A5', hcLight: '#7F7F7F' },
	nls.localize('disabledForeground', "Overall foreground for disabled elements. This color is only used if not overridden by a component."));

export const errorForeground = registerColor('errorForeground',
	{ dark: '#F48771', light: '#A1260D', hcDark: '#F48771', hcLight: '#B5200D' },
	nls.localize('errorForeground', "Overall foreground color for error messages. This color is only used if not overridden by a component."));

export const descriptionForeground = registerColor('descriptionForeground',
	{ light: '#717171', dark: transparent(foreground, 0.7), hcDark: transparent(foreground, 0.7), hcLight: transparent(foreground, 0.7) },
	nls.localize('descriptionForeground', "Foreground color for description text providing additional information, for example for a label."));

export const iconForeground = registerColor('icon.foreground',
	{ dark: '#C5C5C5', light: '#424242', hcDark: '#FFFFFF', hcLight: '#292929' },
	nls.localize('iconForeground', "The default color for icons in the workbench."));

export const focusBorder = registerColor('focusBorder',
	{ dark: '#007FD4', light: '#0090F1', hcDark: '#F38518', hcLight: '#006BBD' },
	nls.localize('focusBorder', "Overall border color for focused elements. This color is only used if not overridden by a component."));

export const contrastBorder = registerColor('contrastBorder',
	{ light: null, dark: null, hcDark: '#6FC3DF', hcLight: '#0F4A85' },
	nls.localize('contrastBorder', "An extra border around elements to separate them from others for greater contrast."));

export const activeContrastBorder = registerColor('contrastActiveBorder',
	{ light: null, dark: null, hcDark: focusBorder, hcLight: focusBorder },
	nls.localize('activeContrastBorder', "An extra border around active elements to separate them from others for greater contrast."));

export const selectionBackground = registerColor('selection.background',
	null,
	nls.localize('selectionBackground', "The background color of text selections in the workbench (e.g. for input fields or text areas). Note that this does not apply to selections within the editor."));


// ------ text link

export const textLinkForeground = registerColor('textLink.foreground',
	{ light: '#006AB1', dark: '#3794FF', hcDark: '#21A6FF', hcLight: '#0F4A85' },
	nls.localize('textLinkForeground', "Foreground color for links in text."));

export const textLinkActiveForeground = registerColor('textLink.activeForeground',
	{ light: '#006AB1', dark: '#3794FF', hcDark: '#21A6FF', hcLight: '#0F4A85' },
	nls.localize('textLinkActiveForeground', "Foreground color for links in text when clicked on and on mouse hover."));

export const textSeparatorForeground = registerColor('textSeparator.foreground',
	{ light: '#0000002e', dark: '#ffffff2e', hcDark: Color.black, hcLight: '#292929' },
	nls.localize('textSeparatorForeground', "Color for text separators."));


// ------ text preformat

export const textPreformatForeground = registerColor('textPreformat.foreground',
	{ light: '#A31515', dark: '#D7BA7D', hcDark: '#FFFFFF', hcLight: '#FFFFFF' },
	nls.localize('textPreformatForeground', "Foreground color for preformatted text segments."));

export const textPreformatBackground = registerColor('textPreformat.background',
	{ light: '#0000001A', dark: '#FFFFFF1A', hcDark: null, hcLight: '#09345f' },
	nls.localize('textPreformatBackground', "Background color for preformatted text segments."));
export const textPreformatBorder = registerColor('textPreformat.border',
	{ light: null, dark: null, hcDark: contrastBorder, hcLight: null },
	nls.localize('textPreformatBorder', "Border color for preformatted text segments."));

// ------ text block quote

export const textBlockQuoteBackground = registerColor('textBlockQuote.background',
	{ light: '#f2f2f2', dark: '#222222', hcDark: null, hcLight: '#F2F2F2' },
	nls.localize('textBlockQuoteBackground', "Background color for block quotes in text."));

export const textBlockQuoteBorder = registerColor('textBlockQuote.border',
	{ light: '#007acc80', dark: '#007acc80', hcDark: Color.white, hcLight: '#292929' },
	nls.localize('textBlockQuoteBorder', "Border color for block quotes in text."));


// ------ text code block

export const textCodeBlockBackground = registerColor('textCodeBlock.background',
	{ light: '#dcdcdc66', dark: '#0a0a0a66', hcDark: Color.black, hcLight: '#F2F2F2' },
	nls.localize('textCodeBlockBackground', "Background color for code blocks in text."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/chartsColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/chartsColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { registerColor, transparent } from '../colorUtils.js';

import { foreground } from './baseColors.js';
import { editorErrorForeground, editorInfoForeground, editorWarningForeground } from './editorColors.js';
import { minimapFindMatch } from './minimapColors.js';


export const chartsForeground = registerColor('charts.foreground',
	foreground,
	nls.localize('chartsForeground', "The foreground color used in charts."));

export const chartsLines = registerColor('charts.lines',
	transparent(foreground, .5),
	nls.localize('chartsLines', "The color used for horizontal lines in charts."));

export const chartsRed = registerColor('charts.red',
	editorErrorForeground,
	nls.localize('chartsRed', "The red color used in chart visualizations."));

export const chartsBlue = registerColor('charts.blue',
	editorInfoForeground,
	nls.localize('chartsBlue', "The blue color used in chart visualizations."));

export const chartsYellow = registerColor('charts.yellow',
	editorWarningForeground,
	nls.localize('chartsYellow', "The yellow color used in chart visualizations."));

export const chartsOrange = registerColor('charts.orange',
	minimapFindMatch,
	nls.localize('chartsOrange', "The orange color used in chart visualizations."));

export const chartsGreen = registerColor('charts.green',
	{ dark: '#89D185', light: '#388A34', hcDark: '#89D185', hcLight: '#374e06' },
	nls.localize('chartsGreen', "The green color used in chart visualizations."));

export const chartsPurple = registerColor('charts.purple',
	{ dark: '#B180D7', light: '#652D90', hcDark: '#B180D7', hcLight: '#652D90' },
	nls.localize('chartsPurple', "The purple color used in chart visualizations."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/editorColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/editorColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color, RGBA } from '../../../../base/common/color.js';
import { registerColor, transparent, lessProminent, darken, lighten } from '../colorUtils.js';

// Import the colors we need
import { foreground, contrastBorder, activeContrastBorder } from './baseColors.js';
import { scrollbarShadow, badgeBackground } from './miscColors.js';


// ----- editor

export const editorBackground = registerColor('editor.background',
	{ light: '#ffffff', dark: '#1E1E1E', hcDark: Color.black, hcLight: Color.white },
	nls.localize('editorBackground', "Editor background color."));

export const editorForeground = registerColor('editor.foreground',
	{ light: '#333333', dark: '#BBBBBB', hcDark: Color.white, hcLight: foreground },
	nls.localize('editorForeground', "Editor default foreground color."));


export const editorStickyScrollBackground = registerColor('editorStickyScroll.background',
	editorBackground,
	nls.localize('editorStickyScrollBackground', "Background color of sticky scroll in the editor"));

export const editorStickyScrollGutterBackground = registerColor('editorStickyScrollGutter.background',
	editorBackground,
	nls.localize('editorStickyScrollGutterBackground', "Background color of the gutter part of sticky scroll in the editor"));

export const editorStickyScrollHoverBackground = registerColor('editorStickyScrollHover.background',
	{ dark: '#2A2D2E', light: '#F0F0F0', hcDark: null, hcLight: Color.fromHex('#0F4A85').transparent(0.1) },
	nls.localize('editorStickyScrollHoverBackground', "Background color of sticky scroll on hover in the editor"));

export const editorStickyScrollBorder = registerColor('editorStickyScroll.border',
	{ dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('editorStickyScrollBorder', "Border color of sticky scroll in the editor"));

export const editorStickyScrollShadow = registerColor('editorStickyScroll.shadow',
	scrollbarShadow,
	nls.localize('editorStickyScrollShadow', " Shadow color of sticky scroll in the editor"));


export const editorWidgetBackground = registerColor('editorWidget.background',
	{ dark: '#252526', light: '#F3F3F3', hcDark: '#0C141F', hcLight: Color.white },
	nls.localize('editorWidgetBackground', 'Background color of editor widgets, such as find/replace.'));

export const editorWidgetForeground = registerColor('editorWidget.foreground',
	foreground,
	nls.localize('editorWidgetForeground', 'Foreground color of editor widgets, such as find/replace.'));

export const editorWidgetBorder = registerColor('editorWidget.border',
	{ dark: '#454545', light: '#C8C8C8', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('editorWidgetBorder', 'Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.'));

export const editorWidgetResizeBorder = registerColor('editorWidget.resizeBorder',
	null,
	nls.localize('editorWidgetResizeBorder', "Border color of the resize bar of editor widgets. The color is only used if the widget chooses to have a resize border and if the color is not overridden by a widget."));


export const editorErrorBackground = registerColor('editorError.background',
	null,
	nls.localize('editorError.background', 'Background color of error text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);

export const editorErrorForeground = registerColor('editorError.foreground',
	{ dark: '#F14C4C', light: '#E51400', hcDark: '#F48771', hcLight: '#B5200D' },
	nls.localize('editorError.foreground', 'Foreground color of error squigglies in the editor.'));

export const editorErrorBorder = registerColor('editorError.border',
	{ dark: null, light: null, hcDark: Color.fromHex('#E47777').transparent(0.8), hcLight: '#B5200D' },
	nls.localize('errorBorder', 'If set, color of double underlines for errors in the editor.'));


export const editorWarningBackground = registerColor('editorWarning.background',
	null,
	nls.localize('editorWarning.background', 'Background color of warning text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);

export const editorWarningForeground = registerColor('editorWarning.foreground',
	{ dark: '#CCA700', light: '#BF8803', hcDark: '#FFD370', hcLight: '#895503' },
	nls.localize('editorWarning.foreground', 'Foreground color of warning squigglies in the editor.'));

export const editorWarningBorder = registerColor('editorWarning.border',
	{ dark: null, light: null, hcDark: Color.fromHex('#FFCC00').transparent(0.8), hcLight: Color.fromHex('#FFCC00').transparent(0.8) },
	nls.localize('warningBorder', 'If set, color of double underlines for warnings in the editor.'));


export const editorInfoBackground = registerColor('editorInfo.background',
	null,
	nls.localize('editorInfo.background', 'Background color of info text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);

export const editorInfoForeground = registerColor('editorInfo.foreground',
	{ dark: '#59a4f9', light: '#0063d3', hcDark: '#59a4f9', hcLight: '#0063d3' },
	nls.localize('editorInfo.foreground', 'Foreground color of info squigglies in the editor.'));

export const editorInfoBorder = registerColor('editorInfo.border',
	{ dark: null, light: null, hcDark: Color.fromHex('#59a4f9').transparent(0.8), hcLight: '#292929' },
	nls.localize('infoBorder', 'If set, color of double underlines for infos in the editor.'));


export const editorHintForeground = registerColor('editorHint.foreground',
	{ dark: Color.fromHex('#eeeeee').transparent(0.7), light: '#6c6c6c', hcDark: null, hcLight: null },
	nls.localize('editorHint.foreground', 'Foreground color of hint squigglies in the editor.'));

export const editorHintBorder = registerColor('editorHint.border',
	{ dark: null, light: null, hcDark: Color.fromHex('#eeeeee').transparent(0.8), hcLight: '#292929' },
	nls.localize('hintBorder', 'If set, color of double underlines for hints in the editor.'));


export const editorActiveLinkForeground = registerColor('editorLink.activeForeground',
	{ dark: '#4E94CE', light: Color.blue, hcDark: Color.cyan, hcLight: '#292929' },
	nls.localize('activeLinkForeground', 'Color of active links.'));


// ----- editor selection

export const editorSelectionBackground = registerColor('editor.selectionBackground',
	{ light: '#ADD6FF', dark: '#264F78', hcDark: '#f3f518', hcLight: '#0F4A85' },
	nls.localize('editorSelectionBackground', "Color of the editor selection."));

export const editorSelectionForeground = registerColor('editor.selectionForeground',
	{ light: null, dark: null, hcDark: '#000000', hcLight: Color.white },
	nls.localize('editorSelectionForeground', "Color of the selected text for high contrast."));

export const editorInactiveSelection = registerColor('editor.inactiveSelectionBackground',
	{ light: transparent(editorSelectionBackground, 0.5), dark: transparent(editorSelectionBackground, 0.5), hcDark: transparent(editorSelectionBackground, 0.7), hcLight: transparent(editorSelectionBackground, 0.5) },
	nls.localize('editorInactiveSelection', "Color of the selection in an inactive editor. The color must not be opaque so as not to hide underlying decorations."), true);

export const editorSelectionHighlight = registerColor('editor.selectionHighlightBackground',
	{ light: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6), dark: lessProminent(editorSelectionBackground, editorBackground, 0.3, 0.6), hcDark: null, hcLight: null },
	nls.localize('editorSelectionHighlight', 'Color for regions with the same content as the selection. The color must not be opaque so as not to hide underlying decorations.'), true);

export const editorSelectionHighlightBorder = registerColor('editor.selectionHighlightBorder',
	{ light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('editorSelectionHighlightBorder', "Border color for regions with the same content as the selection."));

export const editorCompositionBorder = registerColor('editor.compositionBorder',
	{ light: '#000000', dark: '#ffffff', hcLight: '#000000', hcDark: '#ffffff' },
	nls.localize('editorCompositionBorder', "The border color for an IME composition."));


// ----- editor find

export const editorFindMatch = registerColor('editor.findMatchBackground',
	{ light: '#A8AC94', dark: '#515C6A', hcDark: null, hcLight: null },
	nls.localize('editorFindMatch', "Color of the current search match."));

export const editorFindMatchForeground = registerColor('editor.findMatchForeground',
	null,
	nls.localize('editorFindMatchForeground', "Text color of the current search match."));

export const editorFindMatchHighlight = registerColor('editor.findMatchHighlightBackground',
	{ light: '#EA5C0055', dark: '#EA5C0055', hcDark: null, hcLight: null },
	nls.localize('findMatchHighlight', "Color of the other search matches. The color must not be opaque so as not to hide underlying decorations."), true);

export const editorFindMatchHighlightForeground = registerColor('editor.findMatchHighlightForeground',
	null,
	nls.localize('findMatchHighlightForeground', "Foreground color of the other search matches."), true);

export const editorFindRangeHighlight = registerColor('editor.findRangeHighlightBackground',
	{ dark: '#3a3d4166', light: '#b4b4b44d', hcDark: null, hcLight: null },
	nls.localize('findRangeHighlight', "Color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations."), true);

export const editorFindMatchBorder = registerColor('editor.findMatchBorder',
	{ light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('editorFindMatchBorder', "Border color of the current search match."));

export const editorFindMatchHighlightBorder = registerColor('editor.findMatchHighlightBorder',
	{ light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('findMatchHighlightBorder', "Border color of the other search matches."));

export const editorFindRangeHighlightBorder = registerColor('editor.findRangeHighlightBorder',
	{ dark: null, light: null, hcDark: transparent(activeContrastBorder, 0.4), hcLight: transparent(activeContrastBorder, 0.4) },
	nls.localize('findRangeHighlightBorder', "Border color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations."), true);


// ----- editor hover

export const editorHoverHighlight = registerColor('editor.hoverHighlightBackground',
	{ light: '#ADD6FF26', dark: '#264f7840', hcDark: '#ADD6FF26', hcLight: null },
	nls.localize('hoverHighlight', 'Highlight below the word for which a hover is shown. The color must not be opaque so as not to hide underlying decorations.'), true);

export const editorHoverBackground = registerColor('editorHoverWidget.background',
	editorWidgetBackground,
	nls.localize('hoverBackground', 'Background color of the editor hover.'));

export const editorHoverForeground = registerColor('editorHoverWidget.foreground',
	editorWidgetForeground,
	nls.localize('hoverForeground', 'Foreground color of the editor hover.'));

export const editorHoverBorder = registerColor('editorHoverWidget.border',
	editorWidgetBorder,
	nls.localize('hoverBorder', 'Border color of the editor hover.'));

export const editorHoverStatusBarBackground = registerColor('editorHoverWidget.statusBarBackground',
	{ dark: lighten(editorHoverBackground, 0.2), light: darken(editorHoverBackground, 0.05), hcDark: editorWidgetBackground, hcLight: editorWidgetBackground },
	nls.localize('statusBarBackground', "Background color of the editor hover status bar."));


// ----- editor inlay hint

export const editorInlayHintForeground = registerColor('editorInlayHint.foreground',
	{ dark: '#969696', light: '#969696', hcDark: Color.white, hcLight: Color.black },
	nls.localize('editorInlayHintForeground', 'Foreground color of inline hints'));

export const editorInlayHintBackground = registerColor('editorInlayHint.background',
	{ dark: transparent(badgeBackground, .10), light: transparent(badgeBackground, .10), hcDark: transparent(Color.white, .10), hcLight: transparent(badgeBackground, .10) },
	nls.localize('editorInlayHintBackground', 'Background color of inline hints'));

export const editorInlayHintTypeForeground = registerColor('editorInlayHint.typeForeground',
	editorInlayHintForeground,
	nls.localize('editorInlayHintForegroundTypes', 'Foreground color of inline hints for types'));

export const editorInlayHintTypeBackground = registerColor('editorInlayHint.typeBackground',
	editorInlayHintBackground,
	nls.localize('editorInlayHintBackgroundTypes', 'Background color of inline hints for types'));

export const editorInlayHintParameterForeground = registerColor('editorInlayHint.parameterForeground',
	editorInlayHintForeground,
	nls.localize('editorInlayHintForegroundParameter', 'Foreground color of inline hints for parameters'));

export const editorInlayHintParameterBackground = registerColor('editorInlayHint.parameterBackground',
	editorInlayHintBackground,
	nls.localize('editorInlayHintBackgroundParameter', 'Background color of inline hints for parameters'));


// ----- editor lightbulb

export const editorLightBulbForeground = registerColor('editorLightBulb.foreground',
	{ dark: '#FFCC00', light: '#DDB100', hcDark: '#FFCC00', hcLight: '#007ACC' },
	nls.localize('editorLightBulbForeground', "The color used for the lightbulb actions icon."));

export const editorLightBulbAutoFixForeground = registerColor('editorLightBulbAutoFix.foreground',
	{ dark: '#75BEFF', light: '#007ACC', hcDark: '#75BEFF', hcLight: '#007ACC' },
	nls.localize('editorLightBulbAutoFixForeground', "The color used for the lightbulb auto fix actions icon."));

export const editorLightBulbAiForeground = registerColor('editorLightBulbAi.foreground',
	editorLightBulbForeground,
	nls.localize('editorLightBulbAiForeground', "The color used for the lightbulb AI icon."));


// ----- editor snippet

export const snippetTabstopHighlightBackground = registerColor('editor.snippetTabstopHighlightBackground',
	{ dark: new Color(new RGBA(124, 124, 124, 0.3)), light: new Color(new RGBA(10, 50, 100, 0.2)), hcDark: new Color(new RGBA(124, 124, 124, 0.3)), hcLight: new Color(new RGBA(10, 50, 100, 0.2)) },
	nls.localize('snippetTabstopHighlightBackground', "Highlight background color of a snippet tabstop."));

export const snippetTabstopHighlightBorder = registerColor('editor.snippetTabstopHighlightBorder',
	null,
	nls.localize('snippetTabstopHighlightBorder', "Highlight border color of a snippet tabstop."));

export const snippetFinalTabstopHighlightBackground = registerColor('editor.snippetFinalTabstopHighlightBackground',
	null,
	nls.localize('snippetFinalTabstopHighlightBackground', "Highlight background color of the final tabstop of a snippet."));

export const snippetFinalTabstopHighlightBorder = registerColor('editor.snippetFinalTabstopHighlightBorder',
	{ dark: '#525252', light: new Color(new RGBA(10, 50, 100, 0.5)), hcDark: '#525252', hcLight: '#292929' },
	nls.localize('snippetFinalTabstopHighlightBorder', "Highlight border color of the final tabstop of a snippet."));


// ----- diff editor

export const defaultInsertColor = new Color(new RGBA(155, 185, 85, .2));
export const defaultRemoveColor = new Color(new RGBA(255, 0, 0, .2));

export const diffInserted = registerColor('diffEditor.insertedTextBackground',
	{ dark: '#9ccc2c33', light: '#9ccc2c40', hcDark: null, hcLight: null },
	nls.localize('diffEditorInserted', 'Background color for text that got inserted. The color must not be opaque so as not to hide underlying decorations.'), true);

export const diffRemoved = registerColor('diffEditor.removedTextBackground',
	{ dark: '#ff000033', light: '#ff000033', hcDark: null, hcLight: null },
	nls.localize('diffEditorRemoved', 'Background color for text that got removed. The color must not be opaque so as not to hide underlying decorations.'), true);


export const diffInsertedLine = registerColor('diffEditor.insertedLineBackground',
	{ dark: defaultInsertColor, light: defaultInsertColor, hcDark: null, hcLight: null },
	nls.localize('diffEditorInsertedLines', 'Background color for lines that got inserted. The color must not be opaque so as not to hide underlying decorations.'), true);

export const diffRemovedLine = registerColor('diffEditor.removedLineBackground',
	{ dark: defaultRemoveColor, light: defaultRemoveColor, hcDark: null, hcLight: null },
	nls.localize('diffEditorRemovedLines', 'Background color for lines that got removed. The color must not be opaque so as not to hide underlying decorations.'), true);


export const diffInsertedLineGutter = registerColor('diffEditorGutter.insertedLineBackground',
	null,
	nls.localize('diffEditorInsertedLineGutter', 'Background color for the margin where lines got inserted.'));

export const diffRemovedLineGutter = registerColor('diffEditorGutter.removedLineBackground',
	null,
	nls.localize('diffEditorRemovedLineGutter', 'Background color for the margin where lines got removed.'));


export const diffOverviewRulerInserted = registerColor('diffEditorOverview.insertedForeground',
	null,
	nls.localize('diffEditorOverviewInserted', 'Diff overview ruler foreground for inserted content.'));

export const diffOverviewRulerRemoved = registerColor('diffEditorOverview.removedForeground',
	null,
	nls.localize('diffEditorOverviewRemoved', 'Diff overview ruler foreground for removed content.'));


export const diffInsertedOutline = registerColor('diffEditor.insertedTextBorder',
	{ dark: null, light: null, hcDark: '#33ff2eff', hcLight: '#374E06' },
	nls.localize('diffEditorInsertedOutline', 'Outline color for the text that got inserted.'));

export const diffRemovedOutline = registerColor('diffEditor.removedTextBorder',
	{ dark: null, light: null, hcDark: '#FF008F', hcLight: '#AD0707' },
	nls.localize('diffEditorRemovedOutline', 'Outline color for text that got removed.'));


export const diffBorder = registerColor('diffEditor.border',
	{ dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('diffEditorBorder', 'Border color between the two text editors.'));

export const diffDiagonalFill = registerColor('diffEditor.diagonalFill',
	{ dark: '#cccccc33', light: '#22222233', hcDark: null, hcLight: null },
	nls.localize('diffDiagonalFill', "Color of the diff editor's diagonal fill. The diagonal fill is used in side-by-side diff views."));


export const diffUnchangedRegionBackground = registerColor('diffEditor.unchangedRegionBackground',
	'sideBar.background',
	nls.localize('diffEditor.unchangedRegionBackground', "The background color of unchanged blocks in the diff editor."));

export const diffUnchangedRegionForeground = registerColor('diffEditor.unchangedRegionForeground',
	'foreground',
	nls.localize('diffEditor.unchangedRegionForeground', "The foreground color of unchanged blocks in the diff editor."));

export const diffUnchangedTextBackground = registerColor('diffEditor.unchangedCodeBackground',
	{ dark: '#74747429', light: '#b8b8b829', hcDark: null, hcLight: null },
	nls.localize('diffEditor.unchangedCodeBackground', "The background color of unchanged code in the diff editor."));


// ----- widget

export const widgetShadow = registerColor('widget.shadow',
	{ dark: transparent(Color.black, .36), light: transparent(Color.black, .16), hcDark: null, hcLight: null },
	nls.localize('widgetShadow', 'Shadow color of widgets such as find/replace inside the editor.'));

export const widgetBorder = registerColor('widget.border',
	{ dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('widgetBorder', 'Border color of widgets such as find/replace inside the editor.'));


// ----- toolbar

export const toolbarHoverBackground = registerColor('toolbar.hoverBackground',
	{ dark: '#5a5d5e50', light: '#b8b8b850', hcDark: null, hcLight: null },
	nls.localize('toolbarHoverBackground', "Toolbar background when hovering over actions using the mouse"));

export const toolbarHoverOutline = registerColor('toolbar.hoverOutline',
	{ dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('toolbarHoverOutline', "Toolbar outline when hovering over actions using the mouse"));

export const toolbarActiveBackground = registerColor('toolbar.activeBackground',
	{ dark: lighten(toolbarHoverBackground, 0.1), light: darken(toolbarHoverBackground, 0.1), hcDark: null, hcLight: null },
	nls.localize('toolbarActiveBackground', "Toolbar background when holding the mouse over actions"));


// ----- breadcumbs

export const breadcrumbsForeground = registerColor('breadcrumb.foreground',
	transparent(foreground, 0.8),
	nls.localize('breadcrumbsFocusForeground', "Color of focused breadcrumb items."));

export const breadcrumbsBackground = registerColor('breadcrumb.background',
	editorBackground,
	nls.localize('breadcrumbsBackground', "Background color of breadcrumb items."));

export const breadcrumbsFocusForeground = registerColor('breadcrumb.focusForeground',
	{ light: darken(foreground, 0.2), dark: lighten(foreground, 0.1), hcDark: lighten(foreground, 0.1), hcLight: lighten(foreground, 0.1) },
	nls.localize('breadcrumbsFocusForeground', "Color of focused breadcrumb items."));

export const breadcrumbsActiveSelectionForeground = registerColor('breadcrumb.activeSelectionForeground',
	{ light: darken(foreground, 0.2), dark: lighten(foreground, 0.1), hcDark: lighten(foreground, 0.1), hcLight: lighten(foreground, 0.1) },
	nls.localize('breadcrumbsSelectedForeground', "Color of selected breadcrumb items."));

export const breadcrumbsPickerBackground = registerColor('breadcrumbPicker.background',
	editorWidgetBackground,
	nls.localize('breadcrumbsSelectedBackground', "Background color of breadcrumb item picker."));


// ----- merge

const headerTransparency = 0.5;
const currentBaseColor = Color.fromHex('#40C8AE').transparent(headerTransparency);
const incomingBaseColor = Color.fromHex('#40A6FF').transparent(headerTransparency);
const commonBaseColor = Color.fromHex('#606060').transparent(0.4);
const contentTransparency = 0.4;
const rulerTransparency = 1;

export const mergeCurrentHeaderBackground = registerColor('merge.currentHeaderBackground',
	{ dark: currentBaseColor, light: currentBaseColor, hcDark: null, hcLight: null },
	nls.localize('mergeCurrentHeaderBackground', 'Current header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeCurrentContentBackground = registerColor('merge.currentContentBackground',
	transparent(mergeCurrentHeaderBackground, contentTransparency),
	nls.localize('mergeCurrentContentBackground', 'Current content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeIncomingHeaderBackground = registerColor('merge.incomingHeaderBackground',
	{ dark: incomingBaseColor, light: incomingBaseColor, hcDark: null, hcLight: null },
	nls.localize('mergeIncomingHeaderBackground', 'Incoming header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeIncomingContentBackground = registerColor('merge.incomingContentBackground',
	transparent(mergeIncomingHeaderBackground, contentTransparency),
	nls.localize('mergeIncomingContentBackground', 'Incoming content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeCommonHeaderBackground = registerColor('merge.commonHeaderBackground',
	{ dark: commonBaseColor, light: commonBaseColor, hcDark: null, hcLight: null },
	nls.localize('mergeCommonHeaderBackground', 'Common ancestor header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeCommonContentBackground = registerColor('merge.commonContentBackground',
	transparent(mergeCommonHeaderBackground, contentTransparency),
	nls.localize('mergeCommonContentBackground', 'Common ancestor content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);

export const mergeBorder = registerColor('merge.border',
	{ dark: null, light: null, hcDark: '#C3DF6F', hcLight: '#007ACC' },
	nls.localize('mergeBorder', 'Border color on headers and the splitter in inline merge-conflicts.'));


export const overviewRulerCurrentContentForeground = registerColor('editorOverviewRuler.currentContentForeground',
	{ dark: transparent(mergeCurrentHeaderBackground, rulerTransparency), light: transparent(mergeCurrentHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder },
	nls.localize('overviewRulerCurrentContentForeground', 'Current overview ruler foreground for inline merge-conflicts.'));

export const overviewRulerIncomingContentForeground = registerColor('editorOverviewRuler.incomingContentForeground',
	{ dark: transparent(mergeIncomingHeaderBackground, rulerTransparency), light: transparent(mergeIncomingHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder },
	nls.localize('overviewRulerIncomingContentForeground', 'Incoming overview ruler foreground for inline merge-conflicts.'));

export const overviewRulerCommonContentForeground = registerColor('editorOverviewRuler.commonContentForeground',
	{ dark: transparent(mergeCommonHeaderBackground, rulerTransparency), light: transparent(mergeCommonHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder },
	nls.localize('overviewRulerCommonContentForeground', 'Common ancestor overview ruler foreground for inline merge-conflicts.'));

export const overviewRulerFindMatchForeground = registerColor('editorOverviewRuler.findMatchForeground',
	{ dark: '#d186167e', light: '#d186167e', hcDark: '#AB5A00', hcLight: '#AB5A00' },
	nls.localize('overviewRulerFindMatchForeground', 'Overview ruler marker color for find matches. The color must not be opaque so as not to hide underlying decorations.'), true);

export const overviewRulerSelectionHighlightForeground = registerColor('editorOverviewRuler.selectionHighlightForeground',
	'#A0A0A0CC',
	nls.localize('overviewRulerSelectionHighlightForeground', 'Overview ruler marker color for selection highlights. The color must not be opaque so as not to hide underlying decorations.'), true);


// ----- problems

export const problemsErrorIconForeground = registerColor('problemsErrorIcon.foreground',
	editorErrorForeground,
	nls.localize('problemsErrorIconForeground', "The color used for the problems error icon."));

export const problemsWarningIconForeground = registerColor('problemsWarningIcon.foreground',
	editorWarningForeground,
	nls.localize('problemsWarningIconForeground', "The color used for the problems warning icon."));

export const problemsInfoIconForeground = registerColor('problemsInfoIcon.foreground',
	editorInfoForeground,
	nls.localize('problemsInfoIconForeground', "The color used for the problems info icon."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/inputColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/inputColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color, RGBA } from '../../../../base/common/color.js';
import { registerColor, transparent, lighten, darken, ColorTransformType } from '../colorUtils.js';

// Import the colors we need
import { foreground, contrastBorder, focusBorder, iconForeground } from './baseColors.js';
import { editorWidgetBackground } from './editorColors.js';


// ----- input

export const inputBackground = registerColor('input.background',
	{ dark: '#3C3C3C', light: Color.white, hcDark: Color.black, hcLight: Color.white },
	nls.localize('inputBoxBackground', "Input box background."));

export const inputForeground = registerColor('input.foreground',
	foreground,
	nls.localize('inputBoxForeground', "Input box foreground."));

export const inputBorder = registerColor('input.border',
	{ dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('inputBoxBorder', "Input box border."));

export const inputActiveOptionBorder = registerColor('inputOption.activeBorder',
	{ dark: '#007ACC', light: '#007ACC', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('inputBoxActiveOptionBorder', "Border color of activated options in input fields."));

export const inputActiveOptionHoverBackground = registerColor('inputOption.hoverBackground',
	{ dark: '#5a5d5e80', light: '#b8b8b850', hcDark: null, hcLight: null },
	nls.localize('inputOption.hoverBackground', "Background color of activated options in input fields."));

export const inputActiveOptionBackground = registerColor('inputOption.activeBackground',
	{ dark: transparent(focusBorder, 0.4), light: transparent(focusBorder, 0.2), hcDark: Color.transparent, hcLight: Color.transparent },
	nls.localize('inputOption.activeBackground', "Background hover color of options in input fields."));

export const inputActiveOptionForeground = registerColor('inputOption.activeForeground',
	{ dark: Color.white, light: Color.black, hcDark: foreground, hcLight: foreground },
	nls.localize('inputOption.activeForeground', "Foreground color of activated options in input fields."));

export const inputPlaceholderForeground = registerColor('input.placeholderForeground',
	{ light: transparent(foreground, 0.5), dark: transparent(foreground, 0.5), hcDark: transparent(foreground, 0.7), hcLight: transparent(foreground, 0.7) },
	nls.localize('inputPlaceholderForeground', "Input box foreground color for placeholder text."));


// ----- input validation

export const inputValidationInfoBackground = registerColor('inputValidation.infoBackground',
	{ dark: '#063B49', light: '#D6ECF2', hcDark: Color.black, hcLight: Color.white },
	nls.localize('inputValidationInfoBackground', "Input validation background color for information severity."));

export const inputValidationInfoForeground = registerColor('inputValidation.infoForeground',
	{ dark: null, light: null, hcDark: null, hcLight: foreground },
	nls.localize('inputValidationInfoForeground', "Input validation foreground color for information severity."));

export const inputValidationInfoBorder = registerColor('inputValidation.infoBorder',
	{ dark: '#007acc', light: '#007acc', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('inputValidationInfoBorder', "Input validation border color for information severity."));

export const inputValidationWarningBackground = registerColor('inputValidation.warningBackground',
	{ dark: '#352A05', light: '#F6F5D2', hcDark: Color.black, hcLight: Color.white },
	nls.localize('inputValidationWarningBackground', "Input validation background color for warning severity."));

export const inputValidationWarningForeground = registerColor('inputValidation.warningForeground',
	{ dark: null, light: null, hcDark: null, hcLight: foreground },
	nls.localize('inputValidationWarningForeground', "Input validation foreground color for warning severity."));

export const inputValidationWarningBorder = registerColor('inputValidation.warningBorder',
	{ dark: '#B89500', light: '#B89500', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('inputValidationWarningBorder', "Input validation border color for warning severity."));

export const inputValidationErrorBackground = registerColor('inputValidation.errorBackground',
	{ dark: '#5A1D1D', light: '#F2DEDE', hcDark: Color.black, hcLight: Color.white },
	nls.localize('inputValidationErrorBackground', "Input validation background color for error severity."));

export const inputValidationErrorForeground = registerColor('inputValidation.errorForeground',
	{ dark: null, light: null, hcDark: null, hcLight: foreground },
	nls.localize('inputValidationErrorForeground', "Input validation foreground color for error severity."));

export const inputValidationErrorBorder = registerColor('inputValidation.errorBorder',
	{ dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('inputValidationErrorBorder', "Input validation border color for error severity."));


// ----- select

export const selectBackground = registerColor('dropdown.background',
	{ dark: '#3C3C3C', light: Color.white, hcDark: Color.black, hcLight: Color.white },
	nls.localize('dropdownBackground', "Dropdown background."));

export const selectListBackground = registerColor('dropdown.listBackground',
	{ dark: null, light: null, hcDark: Color.black, hcLight: Color.white },
	nls.localize('dropdownListBackground', "Dropdown list background."));

export const selectForeground = registerColor('dropdown.foreground',
	{ dark: '#F0F0F0', light: foreground, hcDark: Color.white, hcLight: foreground },
	nls.localize('dropdownForeground', "Dropdown foreground."));

export const selectBorder = registerColor('dropdown.border',
	{ dark: selectBackground, light: '#CECECE', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('dropdownBorder', "Dropdown border."));


// ------ button

export const buttonForeground = registerColor('button.foreground',
	Color.white,
	nls.localize('buttonForeground', "Button foreground color."));

export const buttonSeparator = registerColor('button.separator',
	transparent(buttonForeground, .4),
	nls.localize('buttonSeparator', "Button separator color."));

export const buttonBackground = registerColor('button.background',
	{ dark: '#0E639C', light: '#007ACC', hcDark: Color.black, hcLight: '#0F4A85' },
	nls.localize('buttonBackground', "Button background color."));

export const buttonHoverBackground = registerColor('button.hoverBackground',
	{ dark: lighten(buttonBackground, 0.2), light: darken(buttonBackground, 0.2), hcDark: buttonBackground, hcLight: buttonBackground },
	nls.localize('buttonHoverBackground', "Button background color when hovering."));

export const buttonBorder = registerColor('button.border',
	contrastBorder,
	nls.localize('buttonBorder', "Button border color."));

export const buttonSecondaryForeground = registerColor('button.secondaryForeground',
	{ dark: Color.white, light: Color.white, hcDark: Color.white, hcLight: foreground },
	nls.localize('buttonSecondaryForeground', "Secondary button foreground color."));

export const buttonSecondaryBackground = registerColor('button.secondaryBackground',
	{ dark: '#3A3D41', light: '#5F6A79', hcDark: null, hcLight: Color.white },
	nls.localize('buttonSecondaryBackground', "Secondary button background color."));

export const buttonSecondaryHoverBackground = registerColor('button.secondaryHoverBackground',
	{ dark: lighten(buttonSecondaryBackground, 0.2), light: darken(buttonSecondaryBackground, 0.2), hcDark: null, hcLight: null },
	nls.localize('buttonSecondaryHoverBackground', "Secondary button background color when hovering."));

// ------ radio

export const radioActiveForeground = registerColor('radio.activeForeground',
	inputActiveOptionForeground,
	nls.localize('radioActiveForeground', "Foreground color of active radio option."));

export const radioActiveBackground = registerColor('radio.activeBackground',
	inputActiveOptionBackground,
	nls.localize('radioBackground', "Background color of active radio option."));

export const radioActiveBorder = registerColor('radio.activeBorder',
	inputActiveOptionBorder,
	nls.localize('radioActiveBorder', "Border color of the active radio option."));

export const radioInactiveForeground = registerColor('radio.inactiveForeground',
	null,
	nls.localize('radioInactiveForeground', "Foreground color of inactive radio option."));

export const radioInactiveBackground = registerColor('radio.inactiveBackground',
	null,
	nls.localize('radioInactiveBackground', "Background color of inactive radio option."));

export const radioInactiveBorder = registerColor('radio.inactiveBorder',
	{ light: transparent(radioActiveForeground, .2), dark: transparent(radioActiveForeground, .2), hcDark: transparent(radioActiveForeground, .4), hcLight: transparent(radioActiveForeground, .2) },
	nls.localize('radioInactiveBorder', "Border color of the inactive radio option."));

export const radioInactiveHoverBackground = registerColor('radio.inactiveHoverBackground',
	inputActiveOptionHoverBackground,
	nls.localize('radioHoverBackground', "Background color of inactive active radio option when hovering."));

// ------ checkbox

export const checkboxBackground = registerColor('checkbox.background',
	selectBackground,
	nls.localize('checkbox.background', "Background color of checkbox widget."));

export const checkboxSelectBackground = registerColor('checkbox.selectBackground',
	editorWidgetBackground,
	nls.localize('checkbox.select.background', "Background color of checkbox widget when the element it's in is selected."));

export const checkboxForeground = registerColor('checkbox.foreground',
	selectForeground,
	nls.localize('checkbox.foreground', "Foreground color of checkbox widget."));

export const checkboxBorder = registerColor('checkbox.border',
	selectBorder,
	nls.localize('checkbox.border', "Border color of checkbox widget."));

export const checkboxSelectBorder = registerColor('checkbox.selectBorder',
	iconForeground,
	nls.localize('checkbox.select.border', "Border color of checkbox widget when the element it's in is selected."));

export const checkboxDisabledBackground = registerColor('checkbox.disabled.background',
	{ op: ColorTransformType.Mix, color: checkboxBackground, with: checkboxForeground, ratio: 0.33 },
	nls.localize('checkbox.disabled.background', "Background of a disabled checkbox."));

export const checkboxDisabledForeground = registerColor('checkbox.disabled.foreground',
	{ op: ColorTransformType.Mix, color: checkboxForeground, with: checkboxBackground, ratio: 0.33 },
	nls.localize('checkbox.disabled.foreground', "Foreground of a disabled checkbox."));


// ------ keybinding label

export const keybindingLabelBackground = registerColor('keybindingLabel.background',
	{ dark: new Color(new RGBA(128, 128, 128, 0.17)), light: new Color(new RGBA(221, 221, 221, 0.4)), hcDark: Color.transparent, hcLight: Color.transparent },
	nls.localize('keybindingLabelBackground', "Keybinding label background color. The keybinding label is used to represent a keyboard shortcut."));

export const keybindingLabelForeground = registerColor('keybindingLabel.foreground',
	{ dark: Color.fromHex('#CCCCCC'), light: Color.fromHex('#555555'), hcDark: Color.white, hcLight: foreground },
	nls.localize('keybindingLabelForeground', "Keybinding label foreground color. The keybinding label is used to represent a keyboard shortcut."));

export const keybindingLabelBorder = registerColor('keybindingLabel.border',
	{ dark: new Color(new RGBA(51, 51, 51, 0.6)), light: new Color(new RGBA(204, 204, 204, 0.4)), hcDark: new Color(new RGBA(111, 195, 223)), hcLight: contrastBorder },
	nls.localize('keybindingLabelBorder', "Keybinding label border color. The keybinding label is used to represent a keyboard shortcut."));

export const keybindingLabelBottomBorder = registerColor('keybindingLabel.bottomBorder',
	{ dark: new Color(new RGBA(68, 68, 68, 0.6)), light: new Color(new RGBA(187, 187, 187, 0.4)), hcDark: new Color(new RGBA(111, 195, 223)), hcLight: foreground },
	nls.localize('keybindingLabelBottomBorder', "Keybinding label border bottom color. The keybinding label is used to represent a keyboard shortcut."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/listColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/listColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color } from '../../../../base/common/color.js';
import { registerColor, darken, lighten, transparent, ifDefinedThenElse } from '../colorUtils.js';

// Import the colors we need
import { foreground, contrastBorder, activeContrastBorder, focusBorder, iconForeground } from './baseColors.js';
import { editorWidgetBackground, editorFindMatchHighlightBorder, editorFindMatchHighlight, widgetShadow, editorWidgetForeground } from './editorColors.js';


export const listFocusBackground = registerColor('list.focusBackground',
	null,
	nls.localize('listFocusBackground', "List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listFocusForeground = registerColor('list.focusForeground',
	null,
	nls.localize('listFocusForeground', "List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listFocusOutline = registerColor('list.focusOutline',
	{ dark: focusBorder, light: focusBorder, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('listFocusOutline', "List/Tree outline color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listFocusAndSelectionOutline = registerColor('list.focusAndSelectionOutline',
	null,
	nls.localize('listFocusAndSelectionOutline', "List/Tree outline color for the focused item when the list/tree is active and selected. An active list/tree has keyboard focus, an inactive does not."));

export const listActiveSelectionBackground = registerColor('list.activeSelectionBackground',
	{ dark: '#04395E', light: '#0060C0', hcDark: null, hcLight: Color.fromHex('#0F4A85').transparent(0.1) },
	nls.localize('listActiveSelectionBackground', "List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listActiveSelectionForeground = registerColor('list.activeSelectionForeground',
	{ dark: Color.white, light: Color.white, hcDark: null, hcLight: null },
	nls.localize('listActiveSelectionForeground', "List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listActiveSelectionIconForeground = registerColor('list.activeSelectionIconForeground',
	null,
	nls.localize('listActiveSelectionIconForeground', "List/Tree icon foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));

export const listInactiveSelectionBackground = registerColor('list.inactiveSelectionBackground',
	{ dark: '#37373D', light: '#E4E6F1', hcDark: null, hcLight: Color.fromHex('#0F4A85').transparent(0.1) },
	nls.localize('listInactiveSelectionBackground', "List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));

export const listInactiveSelectionForeground = registerColor('list.inactiveSelectionForeground',
	null,
	nls.localize('listInactiveSelectionForeground', "List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));

export const listInactiveSelectionIconForeground = registerColor('list.inactiveSelectionIconForeground',
	null,
	nls.localize('listInactiveSelectionIconForeground', "List/Tree icon foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));

export const listInactiveFocusBackground = registerColor('list.inactiveFocusBackground',
	null,
	nls.localize('listInactiveFocusBackground', "List/Tree background color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));

export const listInactiveFocusOutline = registerColor('list.inactiveFocusOutline',
	null,
	nls.localize('listInactiveFocusOutline', "List/Tree outline color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));

export const listHoverBackground = registerColor('list.hoverBackground',
	{ dark: '#2A2D2E', light: '#F0F0F0', hcDark: Color.white.transparent(0.1), hcLight: Color.fromHex('#0F4A85').transparent(0.1) },
	nls.localize('listHoverBackground', "List/Tree background when hovering over items using the mouse."));

export const listHoverForeground = registerColor('list.hoverForeground',
	null,
	nls.localize('listHoverForeground', "List/Tree foreground when hovering over items using the mouse."));

export const listDropOverBackground = registerColor('list.dropBackground',
	{ dark: '#062F4A', light: '#D6EBFF', hcDark: null, hcLight: null },
	nls.localize('listDropBackground', "List/Tree drag and drop background when moving items over other items when using the mouse."));

export const listDropBetweenBackground = registerColor('list.dropBetweenBackground',
	{ dark: iconForeground, light: iconForeground, hcDark: null, hcLight: null },
	nls.localize('listDropBetweenBackground', "List/Tree drag and drop border color when moving items between items when using the mouse."));

export const listHighlightForeground = registerColor('list.highlightForeground',
	{ dark: '#2AAAFF', light: '#0066BF', hcDark: focusBorder, hcLight: focusBorder },
	nls.localize('highlight', 'List/Tree foreground color of the match highlights when searching inside the list/tree.'));

export const listFocusHighlightForeground = registerColor('list.focusHighlightForeground',
	{ dark: listHighlightForeground, light: ifDefinedThenElse(listActiveSelectionBackground, listHighlightForeground, '#BBE7FF'), hcDark: listHighlightForeground, hcLight: listHighlightForeground },
	nls.localize('listFocusHighlightForeground', 'List/Tree foreground color of the match highlights on actively focused items when searching inside the list/tree.'));

export const listInvalidItemForeground = registerColor('list.invalidItemForeground',
	{ dark: '#B89500', light: '#B89500', hcDark: '#B89500', hcLight: '#B5200D' },
	nls.localize('invalidItemForeground', 'List/Tree foreground color for invalid items, for example an unresolved root in explorer.'));

export const listErrorForeground = registerColor('list.errorForeground',
	{ dark: '#F88070', light: '#B01011', hcDark: null, hcLight: null }, nls.localize('listErrorForeground', 'Foreground color of list items containing errors.'));

export const listWarningForeground = registerColor('list.warningForeground',
	{ dark: '#CCA700', light: '#855F00', hcDark: null, hcLight: null }, nls.localize('listWarningForeground', 'Foreground color of list items containing warnings.'));

export const listFilterWidgetBackground = registerColor('listFilterWidget.background',
	{ light: darken(editorWidgetBackground, 0), dark: lighten(editorWidgetBackground, 0), hcDark: editorWidgetBackground, hcLight: editorWidgetBackground },
	nls.localize('listFilterWidgetBackground', 'Background color of the type filter widget in lists and trees.'));

export const listFilterWidgetOutline = registerColor('listFilterWidget.outline',
	{ dark: Color.transparent, light: Color.transparent, hcDark: '#f38518', hcLight: '#007ACC' },
	nls.localize('listFilterWidgetOutline', 'Outline color of the type filter widget in lists and trees.'));

export const listFilterWidgetNoMatchesOutline = registerColor('listFilterWidget.noMatchesOutline',
	{ dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('listFilterWidgetNoMatchesOutline', 'Outline color of the type filter widget in lists and trees, when there are no matches.'));

export const listFilterWidgetShadow = registerColor('listFilterWidget.shadow',
	widgetShadow,
	nls.localize('listFilterWidgetShadow', 'Shadow color of the type filter widget in lists and trees.'));

export const listFilterMatchHighlight = registerColor('list.filterMatchBackground',
	{ dark: editorFindMatchHighlight, light: editorFindMatchHighlight, hcDark: null, hcLight: null },
	nls.localize('listFilterMatchHighlight', 'Background color of the filtered match.'));

export const listFilterMatchHighlightBorder = registerColor('list.filterMatchBorder',
	{ dark: editorFindMatchHighlightBorder, light: editorFindMatchHighlightBorder, hcDark: contrastBorder, hcLight: activeContrastBorder },
	nls.localize('listFilterMatchHighlightBorder', 'Border color of the filtered match.'));

export const listDeemphasizedForeground = registerColor('list.deemphasizedForeground',
	{ dark: '#8C8C8C', light: '#8E8E90', hcDark: '#A7A8A9', hcLight: '#666666' },
	nls.localize('listDeemphasizedForeground', "List/Tree foreground color for items that are deemphasized."));


// ------ tree

export const treeIndentGuidesStroke = registerColor('tree.indentGuidesStroke',
	{ dark: '#585858', light: '#a9a9a9', hcDark: '#a9a9a9', hcLight: '#a5a5a5' },
	nls.localize('treeIndentGuidesStroke', "Tree stroke color for the indentation guides."));

export const treeInactiveIndentGuidesStroke = registerColor('tree.inactiveIndentGuidesStroke',
	transparent(treeIndentGuidesStroke, 0.4),
	nls.localize('treeInactiveIndentGuidesStroke', "Tree stroke color for the indentation guides that are not active."));


// ------ table

export const tableColumnsBorder = registerColor('tree.tableColumnsBorder',
	{ dark: '#CCCCCC20', light: '#61616120', hcDark: null, hcLight: null },
	nls.localize('tableColumnsBorder', "Table border color between columns."));

export const tableOddRowsBackgroundColor = registerColor('tree.tableOddRowsBackground',
	{ dark: transparent(foreground, 0.04), light: transparent(foreground, 0.04), hcDark: null, hcLight: null },
	nls.localize('tableOddRowsBackgroundColor', "Background color for odd table rows."));

// ------ action list

export const editorActionListBackground = registerColor('editorActionList.background',
	editorWidgetBackground,
	nls.localize('editorActionListBackground', "Action List background color."));

export const editorActionListForeground = registerColor('editorActionList.foreground',
	editorWidgetForeground,
	nls.localize('editorActionListForeground', "Action List foreground color."));

export const editorActionListFocusForeground = registerColor('editorActionList.focusForeground',
	listActiveSelectionForeground,
	nls.localize('editorActionListFocusForeground', "Action List foreground color for the focused item."));

export const editorActionListFocusBackground = registerColor('editorActionList.focusBackground',
	listActiveSelectionBackground,
	nls.localize('editorActionListFocusBackground', "Action List background color for the focused item."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/menuColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/menuColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { registerColor } from '../colorUtils.js';

// Import the colors we need
import { contrastBorder, activeContrastBorder } from './baseColors.js';
import { selectForeground, selectBackground } from './inputColors.js';
import { listActiveSelectionBackground, listActiveSelectionForeground } from './listColors.js';


export const menuBorder = registerColor('menu.border',
	{ dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('menuBorder', "Border color of menus."));

export const menuForeground = registerColor('menu.foreground',
	selectForeground,
	nls.localize('menuForeground', "Foreground color of menu items."));

export const menuBackground = registerColor('menu.background',
	selectBackground,
	nls.localize('menuBackground', "Background color of menu items."));

export const menuSelectionForeground = registerColor('menu.selectionForeground',
	listActiveSelectionForeground,
	nls.localize('menuSelectionForeground', "Foreground color of the selected menu item in menus."));

export const menuSelectionBackground = registerColor('menu.selectionBackground',
	listActiveSelectionBackground,
	nls.localize('menuSelectionBackground', "Background color of the selected menu item in menus."));

export const menuSelectionBorder = registerColor('menu.selectionBorder',
	{ dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder },
	nls.localize('menuSelectionBorder', "Border color of the selected menu item in menus."));

export const menuSeparatorBackground = registerColor('menu.separatorBackground',
	{ dark: '#606060', light: '#D4D4D4', hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('menuSeparatorBackground', "Color of a separator menu item in menus."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/minimapColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/minimapColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color, RGBA } from '../../../../base/common/color.js';
import { registerColor, transparent } from '../colorUtils.js';

// Import the colors we need
import { editorFindMatchHighlight, editorInfoBorder, editorInfoForeground, editorSelectionBackground, editorSelectionHighlight, editorWarningBorder, editorWarningForeground } from './editorColors.js';
import { scrollbarSliderActiveBackground, scrollbarSliderBackground, scrollbarSliderHoverBackground } from './miscColors.js';


export const minimapFindMatch = registerColor('minimap.findMatchHighlight',
	editorFindMatchHighlight,
	nls.localize('minimapFindMatchHighlight', 'Minimap marker color for find matches.'), true);

export const minimapSelectionOccurrenceHighlight = registerColor('minimap.selectionOccurrenceHighlight',
	editorSelectionHighlight,
	nls.localize('minimapSelectionOccurrenceHighlight', 'Minimap marker color for repeating editor selections.'), true);

export const minimapSelection = registerColor('minimap.selectionHighlight',
	editorSelectionBackground,
	nls.localize('minimapSelectionHighlight', 'Minimap marker color for the editor selection.'), true);

export const minimapInfo = registerColor('minimap.infoHighlight',
	{ dark: editorInfoForeground, light: editorInfoForeground, hcDark: editorInfoBorder, hcLight: editorInfoBorder },
	nls.localize('minimapInfo', 'Minimap marker color for infos.'));

export const minimapWarning = registerColor('minimap.warningHighlight',
	{ dark: editorWarningForeground, light: editorWarningForeground, hcDark: editorWarningBorder, hcLight: editorWarningBorder },
	nls.localize('overviewRuleWarning', 'Minimap marker color for warnings.'));

export const minimapError = registerColor('minimap.errorHighlight',
	{ dark: new Color(new RGBA(255, 18, 18, 0.7)), light: new Color(new RGBA(255, 18, 18, 0.7)), hcDark: new Color(new RGBA(255, 50, 50, 1)), hcLight: '#B5200D' },
	nls.localize('minimapError', 'Minimap marker color for errors.'));

export const minimapBackground = registerColor('minimap.background',
	null,
	nls.localize('minimapBackground', "Minimap background color."));

export const minimapForegroundOpacity = registerColor('minimap.foregroundOpacity',
	Color.fromHex('#000f'),
	nls.localize('minimapForegroundOpacity', 'Opacity of foreground elements rendered in the minimap. For example, "#000000c0" will render the elements with 75% opacity.'));

export const minimapSliderBackground = registerColor('minimapSlider.background',
	transparent(scrollbarSliderBackground, 0.5),
	nls.localize('minimapSliderBackground', "Minimap slider background color."));

export const minimapSliderHoverBackground = registerColor('minimapSlider.hoverBackground',
	transparent(scrollbarSliderHoverBackground, 0.5),
	nls.localize('minimapSliderHoverBackground', "Minimap slider background color when hovering."));

export const minimapSliderActiveBackground = registerColor('minimapSlider.activeBackground',
	transparent(scrollbarSliderActiveBackground, 0.5),
	nls.localize('minimapSliderActiveBackground', "Minimap slider background color when clicked on."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/miscColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/miscColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color } from '../../../../base/common/color.js';
import { registerColor, transparent } from '../colorUtils.js';

// Import the colors we need
import { contrastBorder, focusBorder } from './baseColors.js';


// ----- sash

export const sashHoverBorder = registerColor('sash.hoverBorder',
	focusBorder,
	nls.localize('sashActiveBorder', "Border color of active sashes."));


// ----- badge

export const badgeBackground = registerColor('badge.background',
	{ dark: '#4D4D4D', light: '#C4C4C4', hcDark: Color.black, hcLight: '#0F4A85' },
	nls.localize('badgeBackground', "Badge background color. Badges are small information labels, e.g. for search results count."));

export const badgeForeground = registerColor('badge.foreground',
	{ dark: Color.white, light: '#333', hcDark: Color.white, hcLight: Color.white },
	nls.localize('badgeForeground', "Badge foreground color. Badges are small information labels, e.g. for search results count."));

export const activityWarningBadgeForeground = registerColor('activityWarningBadge.foreground',
	{ dark: Color.white, light: Color.white, hcDark: Color.white, hcLight: Color.white },
	nls.localize('activityWarningBadge.foreground', 'Foreground color of the warning activity badge'));

export const activityWarningBadgeBackground = registerColor('activityWarningBadge.background',
	{ dark: '#B27C00', light: '#B27C00', hcDark: null, hcLight: '#B27C00' },
	nls.localize('activityWarningBadge.background', 'Background color of the warning activity badge'));

export const activityErrorBadgeForeground = registerColor('activityErrorBadge.foreground',
	{ dark: Color.black.lighten(0.2), light: Color.white, hcDark: null, hcLight: Color.black.lighten(0.2) },
	nls.localize('activityErrorBadge.foreground', 'Foreground color of the error activity badge'));

export const activityErrorBadgeBackground = registerColor('activityErrorBadge.background',
	{ dark: '#F14C4C', light: '#E51400', hcDark: null, hcLight: '#F14C4C' },
	nls.localize('activityErrorBadge.background', 'Background color of the error activity badge'));


// ----- scrollbar

export const scrollbarShadow = registerColor('scrollbar.shadow',
	{ dark: '#000000', light: '#DDDDDD', hcDark: null, hcLight: null },
	nls.localize('scrollbarShadow', "Scrollbar shadow to indicate that the view is scrolled."));

export const scrollbarSliderBackground = registerColor('scrollbarSlider.background',
	{ dark: Color.fromHex('#797979').transparent(0.4), light: Color.fromHex('#646464').transparent(0.4), hcDark: transparent(contrastBorder, 0.6), hcLight: transparent(contrastBorder, 0.4) },
	nls.localize('scrollbarSliderBackground', "Scrollbar slider background color."));

export const scrollbarSliderHoverBackground = registerColor('scrollbarSlider.hoverBackground',
	{ dark: Color.fromHex('#646464').transparent(0.7), light: Color.fromHex('#646464').transparent(0.7), hcDark: transparent(contrastBorder, 0.8), hcLight: transparent(contrastBorder, 0.8) },
	nls.localize('scrollbarSliderHoverBackground', "Scrollbar slider background color when hovering."));

export const scrollbarSliderActiveBackground = registerColor('scrollbarSlider.activeBackground',
	{ dark: Color.fromHex('#BFBFBF').transparent(0.4), light: Color.fromHex('#000000').transparent(0.6), hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('scrollbarSliderActiveBackground', "Scrollbar slider background color when clicked on."));

export const scrollbarBackground = registerColor('scrollbar.background',
	null,
	nls.localize('scrollbarBackground', "Scrollbar track background color."));


// ----- progress bar

export const progressBarBackground = registerColor('progressBar.background',
	{ dark: Color.fromHex('#0E70C0'), light: Color.fromHex('#0E70C0'), hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('progressBarBackground', "Background color of the progress bar that can show for long running operations."));

// ----- chart

export const chartLine = registerColor('chart.line',
	{ dark: '#236B8E', light: '#236B8E', hcDark: '#236B8E', hcLight: '#236B8E' },
	nls.localize('chartLine', "Line color for the chart."));

export const chartAxis = registerColor('chart.axis',
	{ dark: Color.fromHex('#BFBFBF').transparent(0.4), light: Color.fromHex('#000000').transparent(0.6), hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('chartAxis', "Axis color for the chart."));

export const chartGuide = registerColor('chart.guide',
	{ dark: Color.fromHex('#BFBFBF').transparent(0.2), light: Color.fromHex('#000000').transparent(0.2), hcDark: contrastBorder, hcLight: contrastBorder },
	nls.localize('chartGuide', "Guide line for the chart."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/quickpickColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/quickpickColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { Color, RGBA } from '../../../../base/common/color.js';
import { registerColor, oneOf } from '../colorUtils.js';

// Import the colors we need
import { editorWidgetBackground, editorWidgetForeground } from './editorColors.js';
import { listActiveSelectionBackground, listActiveSelectionForeground, listActiveSelectionIconForeground } from './listColors.js';


export const quickInputBackground = registerColor('quickInput.background',
	editorWidgetBackground,
	nls.localize('pickerBackground', "Quick picker background color. The quick picker widget is the container for pickers like the command palette."));

export const quickInputForeground = registerColor('quickInput.foreground',
	editorWidgetForeground,
	nls.localize('pickerForeground', "Quick picker foreground color. The quick picker widget is the container for pickers like the command palette."));

export const quickInputTitleBackground = registerColor('quickInputTitle.background',
	{ dark: new Color(new RGBA(255, 255, 255, 0.105)), light: new Color(new RGBA(0, 0, 0, 0.06)), hcDark: '#000000', hcLight: Color.white },
	nls.localize('pickerTitleBackground', "Quick picker title background color. The quick picker widget is the container for pickers like the command palette."));

export const pickerGroupForeground = registerColor('pickerGroup.foreground',
	{ dark: '#3794FF', light: '#0066BF', hcDark: Color.white, hcLight: '#0F4A85' },
	nls.localize('pickerGroupForeground', "Quick picker color for grouping labels."));

export const pickerGroupBorder = registerColor('pickerGroup.border',
	{ dark: '#3F3F46', light: '#CCCEDB', hcDark: Color.white, hcLight: '#0F4A85' },
	nls.localize('pickerGroupBorder', "Quick picker color for grouping borders."));

export const _deprecatedQuickInputListFocusBackground = registerColor('quickInput.list.focusBackground',
	null, '', undefined,
	nls.localize('quickInput.list.focusBackground deprecation', "Please use quickInputList.focusBackground instead"));

export const quickInputListFocusForeground = registerColor('quickInputList.focusForeground',
	listActiveSelectionForeground,
	nls.localize('quickInput.listFocusForeground', "Quick picker foreground color for the focused item."));

export const quickInputListFocusIconForeground = registerColor('quickInputList.focusIconForeground',
	listActiveSelectionIconForeground,
	nls.localize('quickInput.listFocusIconForeground', "Quick picker icon foreground color for the focused item."));

export const quickInputListFocusBackground = registerColor('quickInputList.focusBackground',
	{ dark: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), light: oneOf(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), hcDark: null, hcLight: null },
	nls.localize('quickInput.listFocusBackground', "Quick picker background color for the focused item."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/colors/searchColors.ts]---
Location: vscode-main/src/vs/platform/theme/common/colors/searchColors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// Import the effects we need
import { registerColor, transparent } from '../colorUtils.js';

// Import the colors we need
import { foreground } from './baseColors.js';
import { editorFindMatchHighlight, editorFindMatchHighlightBorder } from './editorColors.js';


export const searchResultsInfoForeground = registerColor('search.resultsInfoForeground',
	{ light: foreground, dark: transparent(foreground, 0.65), hcDark: foreground, hcLight: foreground },
	nls.localize('search.resultsInfoForeground', "Color of the text in the search viewlet's completion message."));


// ----- search editor (Distinct from normal editor find match to allow for better differentiation)

export const searchEditorFindMatch = registerColor('searchEditor.findMatchBackground',
	{ light: transparent(editorFindMatchHighlight, 0.66), dark: transparent(editorFindMatchHighlight, 0.66), hcDark: editorFindMatchHighlight, hcLight: editorFindMatchHighlight },
	nls.localize('searchEditor.queryMatch', "Color of the Search Editor query matches."));

export const searchEditorFindMatchBorder = registerColor('searchEditor.findMatchBorder',
	{ light: transparent(editorFindMatchHighlightBorder, 0.66), dark: transparent(editorFindMatchHighlightBorder, 0.66), hcDark: editorFindMatchHighlightBorder, hcLight: editorFindMatchHighlightBorder },
	nls.localize('searchEditor.editorFindMatchBorder', "Border color of the Search Editor query matches."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/common/sizes/baseSizes.ts]---
Location: vscode-main/src/vs/platform/theme/common/sizes/baseSizes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { registerSize, sizeForAllThemes } from '../sizeUtils.js';

// ------ Font Sizes

export const bodyFontSize = registerSize('bodyFontSize',
	sizeForAllThemes(13, 'px'),
	nls.localize('bodyFontSize', "Base font size. This size is used if not overridden by a component."));

export const bodyFontSizeSmall = registerSize('bodyFontSize.small',
	sizeForAllThemes(12, 'px'),
	nls.localize('bodyFontSizeSmall', "Small font size for secondary content."));

export const bodyFontSizeXSmall = registerSize('bodyFontSize.xSmall',
	sizeForAllThemes(11, 'px'),
	nls.localize('bodyFontSizeXSmall', "Extra small font size for less prominent content."));

export const codiconFontSize = registerSize('codiconFontSize',
	sizeForAllThemes(16, 'px'),
	nls.localize('codiconFontSize', "Base font size for codicons."));

// ------ Corner Radii

export const cornerRadiusMedium = registerSize('cornerRadius.medium',
	sizeForAllThemes(6, 'px'),
	nls.localize('cornerRadiusMedium', "Base corner radius for UI elements."));

export const cornerRadiusXSmall = registerSize('cornerRadius.xSmall',
	sizeForAllThemes(2, 'px'),
	nls.localize('cornerRadiusXSmall', "Extra small corner radius for very compact UI elements."));

export const cornerRadiusSmall = registerSize('cornerRadius.small',
	sizeForAllThemes(4, 'px'),
	nls.localize('cornerRadiusSmall', "Small corner radius for compact UI elements."));

export const cornerRadiusLarge = registerSize('cornerRadius.large',
	sizeForAllThemes(8, 'px'),
	nls.localize('cornerRadiusLarge', "Large corner radius for prominent UI elements."));

export const cornerRadiusXLarge = registerSize('cornerRadius.xLarge',
	sizeForAllThemes(12, 'px'),
	nls.localize('cornerRadiusXLarge', "Extra large corner radius for very prominent UI elements."));

export const cornerRadiusCircle = registerSize('cornerRadius.circle',
	sizeForAllThemes(9999, 'px'),
	nls.localize('cornerRadiusCircle', "Circular corner radius for fully rounded UI elements."));

// ------ Stroke Thickness

export const strokeThickness = registerSize('strokeThickness',
	sizeForAllThemes(1, 'px'),
	nls.localize('strokeThickness', "Base stroke thickness for borders and outlines."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/electron-main/themeMainService.ts]---
Location: vscode-main/src/vs/platform/theme/electron-main/themeMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IPartsSplash } from '../common/themeService.js';
import { IColorScheme } from '../../window/common/window.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export const IThemeMainService = createDecorator<IThemeMainService>('themeMainService');

export interface IThemeMainService {

	readonly _serviceBrand: undefined;

	readonly onDidChangeColorScheme: Event<IColorScheme>;

	getBackgroundColor(): string;

	saveWindowSplash(windowId: number | undefined, workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined, splash: IPartsSplash): void;
	getWindowSplash(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined): IPartsSplash | undefined;

	getColorScheme(): IColorScheme;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/electron-main/themeMainServiceImpl.ts]---
Location: vscode-main/src/vs/platform/theme/electron-main/themeMainServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import electron from 'electron';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isLinux, isMacintosh, isWindows } from '../../../base/common/platform.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IStateService } from '../../state/node/state.js';
import { IPartsSplash } from '../common/themeService.js';
import { IColorScheme } from '../../window/common/window.js';
import { ThemeTypeSelector } from '../common/theme.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { coalesce } from '../../../base/common/arrays.js';
import { getAllWindowsExcludingOffscreen } from '../../windows/electron-main/windows.js';
import { ILogService } from '../../log/common/log.js';
import { IThemeMainService } from './themeMainService.js';

// These default colors match our default themes
// editor background color ("Dark Modern", etc...)
const DEFAULT_BG_LIGHT = '#FFFFFF';
const DEFAULT_BG_DARK = '#1F1F1F';
const DEFAULT_BG_HC_BLACK = '#000000';
const DEFAULT_BG_HC_LIGHT = '#FFFFFF';

const THEME_STORAGE_KEY = 'theme';
const THEME_BG_STORAGE_KEY = 'themeBackground';

const THEME_WINDOW_SPLASH_KEY = 'windowSplash';
const THEME_WINDOW_SPLASH_OVERRIDE_KEY = 'windowSplashWorkspaceOverride';

const AUXILIARYBAR_DEFAULT_VISIBILITY = 'workbench.secondarySideBar.defaultVisibility';

namespace ThemeSettings {
	export const DETECT_COLOR_SCHEME = 'window.autoDetectColorScheme';
	export const DETECT_HC = 'window.autoDetectHighContrast';
	export const SYSTEM_COLOR_THEME = 'window.systemColorTheme';
}

interface IPartSplashOverrideWorkspaces {
	[workspaceId: string]: {
		sideBarVisible: boolean;
		auxiliaryBarVisible: boolean;
	};
}

interface IPartsSplashOverride {
	layoutInfo: {
		sideBarWidth: number;
		auxiliaryBarWidth: number;

		workspaces: IPartSplashOverrideWorkspaces;
	};
}

export class ThemeMainService extends Disposable implements IThemeMainService {

	declare readonly _serviceBrand: undefined;

	private static readonly DEFAULT_BAR_WIDTH = 300;

	private static readonly WORKSPACE_OVERRIDE_LIMIT = 50;

	private readonly _onDidChangeColorScheme = this._register(new Emitter<IColorScheme>());
	readonly onDidChangeColorScheme = this._onDidChangeColorScheme.event;

	constructor(
		@IStateService private stateService: IStateService,
		@IConfigurationService private configurationService: IConfigurationService,
		@ILogService private logService: ILogService
	) {
		super();

		// System Theme
		if (!isLinux) {
			this._register(this.configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(ThemeSettings.SYSTEM_COLOR_THEME) || e.affectsConfiguration(ThemeSettings.DETECT_COLOR_SCHEME)) {
					this.updateSystemColorTheme();
				}
			}));
		}
		this.updateSystemColorTheme();

		// Color Scheme changes
		this._register(Event.fromNodeEventEmitter(electron.nativeTheme, 'updated')(() => this._onDidChangeColorScheme.fire(this.getColorScheme())));
	}

	private updateSystemColorTheme(): void {
		if (isLinux || this.configurationService.getValue(ThemeSettings.DETECT_COLOR_SCHEME)) {
			electron.nativeTheme.themeSource = 'system'; // only with `system` we can detect the system color scheme
		} else {
			switch (this.configurationService.getValue<'default' | 'auto' | 'light' | 'dark'>(ThemeSettings.SYSTEM_COLOR_THEME)) {
				case 'dark':
					electron.nativeTheme.themeSource = 'dark';
					break;
				case 'light':
					electron.nativeTheme.themeSource = 'light';
					break;
				case 'auto':
					switch (this.getPreferredBaseTheme() ?? this.getStoredBaseTheme()) {
						case ThemeTypeSelector.VS: electron.nativeTheme.themeSource = 'light'; break;
						case ThemeTypeSelector.VS_DARK: electron.nativeTheme.themeSource = 'dark'; break;
						default: electron.nativeTheme.themeSource = 'system';
					}
					break;
				default:
					electron.nativeTheme.themeSource = 'system';
					break;
			}
		}
	}

	getColorScheme(): IColorScheme {

		// high contrast is reflected by the shouldUseInvertedColorScheme property
		if (isWindows) {
			if (electron.nativeTheme.shouldUseHighContrastColors) {
				// shouldUseInvertedColorScheme is dark, !shouldUseInvertedColorScheme is light
				return { dark: electron.nativeTheme.shouldUseInvertedColorScheme, highContrast: true };
			}
		}

		// high contrast is set if one of shouldUseInvertedColorScheme or shouldUseHighContrastColors is set,
		// reflecting the 'Invert colours' and `Increase contrast` settings in MacOS
		else if (isMacintosh) {
			if (electron.nativeTheme.shouldUseInvertedColorScheme || electron.nativeTheme.shouldUseHighContrastColors) {
				return { dark: electron.nativeTheme.shouldUseDarkColors, highContrast: true };
			}
		}

		// ubuntu gnome seems to have 3 states, light dark and high contrast
		else if (isLinux) {
			if (electron.nativeTheme.shouldUseHighContrastColors) {
				return { dark: true, highContrast: true };
			}
		}

		return {
			dark: electron.nativeTheme.shouldUseDarkColors,
			highContrast: false
		};
	}

	getPreferredBaseTheme(): ThemeTypeSelector | undefined {
		const colorScheme = this.getColorScheme();
		if (this.configurationService.getValue(ThemeSettings.DETECT_HC) && colorScheme.highContrast) {
			return colorScheme.dark ? ThemeTypeSelector.HC_BLACK : ThemeTypeSelector.HC_LIGHT;
		}

		if (this.configurationService.getValue(ThemeSettings.DETECT_COLOR_SCHEME)) {
			return colorScheme.dark ? ThemeTypeSelector.VS_DARK : ThemeTypeSelector.VS;
		}

		return undefined;
	}

	getBackgroundColor(): string {
		const preferred = this.getPreferredBaseTheme();
		const stored = this.getStoredBaseTheme();

		// If the stored theme has the same base as the preferred, we can return the stored background
		if (preferred === undefined || preferred === stored) {
			const storedBackground = this.stateService.getItem<string | null>(THEME_BG_STORAGE_KEY, null);
			if (storedBackground) {
				return storedBackground;
			}
		}

		// Otherwise we return the default background for the preferred base theme. If there's no preferred, use the stored one.
		switch (preferred ?? stored) {
			case ThemeTypeSelector.VS: return DEFAULT_BG_LIGHT;
			case ThemeTypeSelector.HC_BLACK: return DEFAULT_BG_HC_BLACK;
			case ThemeTypeSelector.HC_LIGHT: return DEFAULT_BG_HC_LIGHT;
			default: return DEFAULT_BG_DARK;
		}
	}

	private getStoredBaseTheme(): ThemeTypeSelector {
		const baseTheme = this.stateService.getItem<ThemeTypeSelector>(THEME_STORAGE_KEY, ThemeTypeSelector.VS_DARK).split(' ')[0];
		switch (baseTheme) {
			case ThemeTypeSelector.VS: return ThemeTypeSelector.VS;
			case ThemeTypeSelector.HC_BLACK: return ThemeTypeSelector.HC_BLACK;
			case ThemeTypeSelector.HC_LIGHT: return ThemeTypeSelector.HC_LIGHT;
			default: return ThemeTypeSelector.VS_DARK;
		}
	}

	saveWindowSplash(windowId: number | undefined, workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined, splash: IPartsSplash): void {

		// Update override as needed
		const splashOverride = this.updateWindowSplashOverride(workspace, splash);

		// Update in storage
		this.stateService.setItems(coalesce([
			{ key: THEME_STORAGE_KEY, data: splash.baseTheme },
			{ key: THEME_BG_STORAGE_KEY, data: splash.colorInfo.background },
			{ key: THEME_WINDOW_SPLASH_KEY, data: splash },
			splashOverride ? { key: THEME_WINDOW_SPLASH_OVERRIDE_KEY, data: splashOverride } : undefined
		]));

		// Update in opened windows
		if (typeof windowId === 'number') {
			this.updateBackgroundColor(windowId, splash);
		}

		// Update system theme
		this.updateSystemColorTheme();
	}

	private updateWindowSplashOverride(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined, splash: IPartsSplash): IPartsSplashOverride | undefined {
		let splashOverride: IPartsSplashOverride | undefined = undefined;
		let changed = false;
		if (workspace) {
			splashOverride = { ...this.getWindowSplashOverride() }; // make a copy for modifications

			changed = this.doUpdateWindowSplashOverride(workspace, splash, splashOverride, 'sideBar');
			changed = this.doUpdateWindowSplashOverride(workspace, splash, splashOverride, 'auxiliaryBar') || changed;
		}

		return changed ? splashOverride : undefined;
	}

	private doUpdateWindowSplashOverride(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier, splash: IPartsSplash, splashOverride: IPartsSplashOverride, part: 'sideBar' | 'auxiliaryBar'): boolean {
		const currentWidth = part === 'sideBar' ? splash.layoutInfo?.sideBarWidth : splash.layoutInfo?.auxiliaryBarWidth;
		const overrideWidth = part === 'sideBar' ? splashOverride.layoutInfo.sideBarWidth : splashOverride.layoutInfo.auxiliaryBarWidth;

		// No layout info: remove override
		let changed = false;
		if (typeof currentWidth !== 'number') {
			if (splashOverride.layoutInfo.workspaces[workspace.id]) {
				delete splashOverride.layoutInfo.workspaces[workspace.id];
				changed = true;
			}

			return changed;
		}

		let workspaceOverride = splashOverride.layoutInfo.workspaces[workspace.id];
		if (!workspaceOverride) {
			const workspaceEntries = Object.keys(splashOverride.layoutInfo.workspaces);
			if (workspaceEntries.length >= ThemeMainService.WORKSPACE_OVERRIDE_LIMIT) {
				delete splashOverride.layoutInfo.workspaces[workspaceEntries[0]];
				changed = true;
			}

			workspaceOverride = { sideBarVisible: false, auxiliaryBarVisible: false };
			splashOverride.layoutInfo.workspaces[workspace.id] = workspaceOverride;
			changed = true;
		}

		// Part has width: update width & visibility override
		if (currentWidth > 0) {
			if (overrideWidth !== currentWidth) {
				splashOverride.layoutInfo[part === 'sideBar' ? 'sideBarWidth' : 'auxiliaryBarWidth'] = currentWidth;
				changed = true;
			}

			switch (part) {
				case 'sideBar':
					if (!workspaceOverride.sideBarVisible) {
						workspaceOverride.sideBarVisible = true;
						changed = true;
					}
					break;
				case 'auxiliaryBar':
					if (!workspaceOverride.auxiliaryBarVisible) {
						workspaceOverride.auxiliaryBarVisible = true;
						changed = true;
					}
					break;
			}
		}

		// Part is hidden: update visibility override
		else {
			switch (part) {
				case 'sideBar':
					if (workspaceOverride.sideBarVisible) {
						workspaceOverride.sideBarVisible = false;
						changed = true;
					}
					break;
				case 'auxiliaryBar':
					if (workspaceOverride.auxiliaryBarVisible) {
						workspaceOverride.auxiliaryBarVisible = false;
						changed = true;
					}
					break;
			}
		}

		return changed;
	}

	private updateBackgroundColor(windowId: number, splash: IPartsSplash): void {
		for (const window of getAllWindowsExcludingOffscreen()) {
			if (window.id === windowId) {
				window.setBackgroundColor(splash.colorInfo.background);
				break;
			}
		}
	}

	getWindowSplash(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined): IPartsSplash | undefined {
		try {
			return this.doGetWindowSplash(workspace);
		} catch (error) {
			this.logService.error('[theme main service] Failed to get window splash', error);

			return undefined;
		}
	}

	private doGetWindowSplash(workspace: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | undefined): IPartsSplash | undefined {
		const partSplash = this.stateService.getItem<IPartsSplash>(THEME_WINDOW_SPLASH_KEY);
		if (!partSplash?.layoutInfo) {
			return partSplash; // return early: overrides currently only apply to layout info
		}

		const override = this.getWindowSplashOverride();

		// Figure out side bar width based on workspace and overrides
		let sideBarWidth: number;
		if (workspace) {
			if (override.layoutInfo.workspaces[workspace.id]?.sideBarVisible === false) {
				sideBarWidth = 0;
			} else {
				sideBarWidth = override.layoutInfo.sideBarWidth || partSplash.layoutInfo.sideBarWidth || ThemeMainService.DEFAULT_BAR_WIDTH;
			}
		} else {
			sideBarWidth = 0;
		}

		// Figure out auxiliary bar width based on workspace, configuration and overrides
		const auxiliaryBarDefaultVisibility = this.configurationService.getValue(AUXILIARYBAR_DEFAULT_VISIBILITY) ?? 'visibleInWorkspace';
		let auxiliaryBarWidth: number;
		if (workspace) {
			const auxiliaryBarVisible = override.layoutInfo.workspaces[workspace.id]?.auxiliaryBarVisible;
			if (auxiliaryBarVisible === true) {
				auxiliaryBarWidth = override.layoutInfo.auxiliaryBarWidth || partSplash.layoutInfo.auxiliaryBarWidth || ThemeMainService.DEFAULT_BAR_WIDTH;
			} else if (auxiliaryBarVisible === false) {
				auxiliaryBarWidth = 0;
			} else {
				if (auxiliaryBarDefaultVisibility === 'visible' || auxiliaryBarDefaultVisibility === 'visibleInWorkspace') {
					auxiliaryBarWidth = override.layoutInfo.auxiliaryBarWidth || partSplash.layoutInfo.auxiliaryBarWidth || ThemeMainService.DEFAULT_BAR_WIDTH;
				} else if (auxiliaryBarDefaultVisibility === 'maximized' || auxiliaryBarDefaultVisibility === 'maximizedInWorkspace') {
					auxiliaryBarWidth = Number.MAX_SAFE_INTEGER; // marker for a maximised auxiliary bar
				} else {
					auxiliaryBarWidth = 0;
				}
			}
		} else {
			auxiliaryBarWidth = 0; // technically not true if configured 'visible', but we never store splash per empty window, so we decide on a default here
		}

		return {
			...partSplash,
			layoutInfo: {
				...partSplash.layoutInfo,
				sideBarWidth,
				auxiliaryBarWidth
			}
		};
	}

	private getWindowSplashOverride(): IPartsSplashOverride {
		let override = this.stateService.getItem<IPartsSplashOverride>(THEME_WINDOW_SPLASH_OVERRIDE_KEY);

		if (!override?.layoutInfo) {
			override = {
				layoutInfo: {
					sideBarWidth: ThemeMainService.DEFAULT_BAR_WIDTH,
					auxiliaryBarWidth: ThemeMainService.DEFAULT_BAR_WIDTH,
					workspaces: {}
				}
			};
		}

		if (!override.layoutInfo.sideBarWidth) {
			override.layoutInfo.sideBarWidth = ThemeMainService.DEFAULT_BAR_WIDTH;
		}

		if (!override.layoutInfo.auxiliaryBarWidth) {
			override.layoutInfo.auxiliaryBarWidth = ThemeMainService.DEFAULT_BAR_WIDTH;
		}

		if (!override.layoutInfo.workspaces) {
			override.layoutInfo.workspaces = {};
		}

		return override;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/test/common/sizeRegistry.test.ts]---
Location: vscode-main/src/vs/platform/theme/test/common/sizeRegistry.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { getSizeRegistry, registerSize, size, sizeForAllThemes, sizeValueToCss, asCssVariableName, asCssVariable } from '../../common/sizeRegistry.js';
// Import baseSizes to ensure base size tokens are registered
import { bodyFontSize, bodyFontSizeSmall, codiconFontSize, cornerRadiusMedium, cornerRadiusSmall, cornerRadiusLarge, strokeThickness } from '../../common/sizes/baseSizes.js';

suite('Size Registry', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('registerSize should register a size token', () => {
		const id = registerSize('test.size', { dark: size(10, 'px'), light: size(10, 'px'), hcDark: size(10, 'px'), hcLight: size(10, 'px') }, 'Test size');
		assert.strictEqual(id, 'test.size');

		const sizes = getSizeRegistry().getSizes();
		const testSize = sizes.find(s => s.id === 'test.size');
		assert.ok(testSize);
		assert.strictEqual(testSize.description, 'Test size');

		getSizeRegistry().deregisterSize('test.size');
	});

	test('sizeValueToCss should convert size value to CSS string', () => {
		assert.strictEqual(sizeValueToCss(size(10, 'px')), '10px');
		assert.strictEqual(sizeValueToCss(size(1.5, 'rem')), '1.5rem');
		assert.strictEqual(sizeValueToCss(size(100, '%')), '100%');
		assert.strictEqual(sizeValueToCss(size(1.2, 'em')), '1.2em');
	});

	test('asCssVariableName should convert identifier to CSS variable name', () => {
		assert.strictEqual(asCssVariableName('fontSize'), '--vscode-fontSize');
		assert.strictEqual(asCssVariableName('corner.radius'), '--vscode-corner-radius');
		assert.strictEqual(asCssVariableName('font.size.large'), '--vscode-font-size-large');
	});

	test('asCssVariable should create CSS variable reference', () => {
		assert.strictEqual(asCssVariable('fontSize'), 'var(--vscode-fontSize)');
		assert.strictEqual(asCssVariable('cornerRadius'), 'var(--vscode-cornerRadius)');
	});

	test('deregisterSize should remove a size token', () => {
		registerSize('test.remove', { dark: size(5, 'px'), light: size(5, 'px'), hcDark: size(5, 'px'), hcLight: size(5, 'px') }, 'Test remove');

		let sizes = getSizeRegistry().getSizes();
		assert.ok(sizes.find(s => s.id === 'test.remove'));

		getSizeRegistry().deregisterSize('test.remove');

		sizes = getSizeRegistry().getSizes();
		assert.ok(!sizes.find(s => s.id === 'test.remove'));
	});

	test('size tokens should be available', () => {
		const sizes = getSizeRegistry().getSizes();

		// Check that base sizes are registered
		assert.ok(sizes.find(s => s.id === bodyFontSize), 'bodyFontSize should be registered');
		assert.ok(sizes.find(s => s.id === bodyFontSizeSmall), 'bodyFontSizeSmall should be registered');
		assert.ok(sizes.find(s => s.id === codiconFontSize), 'codiconFontSize should be registered');
		assert.ok(sizes.find(s => s.id === cornerRadiusMedium), 'cornerRadius.medium should be registered');
		assert.ok(sizes.find(s => s.id === cornerRadiusSmall), 'cornerRadius.small should be registered');
		assert.ok(sizes.find(s => s.id === cornerRadiusLarge), 'cornerRadius.large should be registered');
		assert.ok(sizes.find(s => s.id === strokeThickness), 'strokeThickness should be registered');
	});

	test('sizeForAllThemes should create same value for all themes', () => {
		const sizeDefaults = sizeForAllThemes(10, 'px');
		assert.deepStrictEqual(sizeDefaults.light, { value: 10, unit: 'px' });
		assert.deepStrictEqual(sizeDefaults.dark, { value: 10, unit: 'px' });
		assert.deepStrictEqual(sizeDefaults.hcDark, { value: 10, unit: 'px' });
		assert.deepStrictEqual(sizeDefaults.hcLight, { value: 10, unit: 'px' });
	});

	test('registerSize should work with sizeForAllThemes', () => {
		const id = registerSize('test.allThemes', sizeForAllThemes(5, 'rem'), 'Test all themes');
		assert.strictEqual(id, 'test.allThemes');

		const sizes = getSizeRegistry().getSizes();
		const testSize = sizes.find(s => s.id === 'test.allThemes');
		assert.ok(testSize);

		getSizeRegistry().deregisterSize('test.allThemes');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/theme/test/common/testThemeService.ts]---
Location: vscode-main/src/vs/platform/theme/test/common/testThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Color } from '../../../../base/common/color.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IconContribution } from '../../common/iconRegistry.js';
import { ColorScheme } from '../../common/theme.js';
import { IColorTheme, IFileIconTheme, IProductIconTheme, IThemeService, IFontTokenOptions, ITokenStyle } from '../../common/themeService.js';

export class TestColorTheme implements IColorTheme {

	public readonly label = 'test';

	constructor(
		private colors: { [id: string]: string | undefined } = {},
		public type = ColorScheme.DARK,
		public readonly semanticHighlighting = false
	) { }

	getColor(color: string, useDefault?: boolean): Color | undefined {
		const value = this.colors[color];
		if (value) {
			return Color.fromHex(value);
		}
		return undefined;
	}

	defines(color: string): boolean {
		throw new Error('Method not implemented.');
	}

	getTokenStyleMetadata(type: string, modifiers: string[], modelLanguage: string): ITokenStyle | undefined {
		return undefined;
	}

	get tokenColorMap(): string[] {
		return [];
	}

	get tokenFontMap(): IFontTokenOptions[] {
		return [];
	}
}

class TestFileIconTheme implements IFileIconTheme {
	hasFileIcons = false;
	hasFolderIcons = false;
	hidesExplorerArrows = false;
}

class UnthemedProductIconTheme implements IProductIconTheme {
	getIcon(contribution: IconContribution) {
		return undefined;
	}
}

export class TestThemeService implements IThemeService {

	declare readonly _serviceBrand: undefined;
	_colorTheme: IColorTheme;
	_fileIconTheme: IFileIconTheme;
	_productIconTheme: IProductIconTheme;
	_onThemeChange = new Emitter<IColorTheme>();
	_onFileIconThemeChange = new Emitter<IFileIconTheme>();
	_onProductIconThemeChange = new Emitter<IProductIconTheme>();

	constructor(theme = new TestColorTheme(), fileIconTheme = new TestFileIconTheme(), productIconTheme = new UnthemedProductIconTheme()) {
		this._colorTheme = theme;
		this._fileIconTheme = fileIconTheme;
		this._productIconTheme = productIconTheme;
	}

	getColorTheme(): IColorTheme {
		return this._colorTheme;
	}

	setTheme(theme: IColorTheme) {
		this._colorTheme = theme;
		this.fireThemeChange();
	}

	fireThemeChange() {
		this._onThemeChange.fire(this._colorTheme);
	}

	public get onDidColorThemeChange(): Event<IColorTheme> {
		return this._onThemeChange.event;
	}

	getFileIconTheme(): IFileIconTheme {
		return this._fileIconTheme;
	}

	public get onDidFileIconThemeChange(): Event<IFileIconTheme> {
		return this._onFileIconThemeChange.event;
	}

	getProductIconTheme(): IProductIconTheme {
		return this._productIconTheme;
	}

	public get onDidProductIconThemeChange(): Event<IProductIconTheme> {
		return this._onProductIconThemeChange.event;
	}
}
```

--------------------------------------------------------------------------------

````

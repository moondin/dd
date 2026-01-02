---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 209
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 209 of 552)

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

---[FILE: src/vs/editor/common/config/editorZoom.ts]---
Location: vscode-main/src/vs/editor/common/config/editorZoom.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';

export interface IEditorZoom {
	readonly onDidChangeZoomLevel: Event<number>;
	getZoomLevel(): number;
	setZoomLevel(zoomLevel: number): void;
}

export const EditorZoom: IEditorZoom = new class implements IEditorZoom {

	private _zoomLevel: number = 0;

	private readonly _onDidChangeZoomLevel = new Emitter<number>();
	public readonly onDidChangeZoomLevel: Event<number> = this._onDidChangeZoomLevel.event;

	public getZoomLevel(): number {
		return this._zoomLevel;
	}

	public setZoomLevel(zoomLevel: number): void {
		zoomLevel = Math.min(Math.max(-5, zoomLevel), 20);
		if (this._zoomLevel === zoomLevel) {
			return;
		}

		this._zoomLevel = zoomLevel;
		this._onDidChangeZoomLevel.fire(this._zoomLevel);
	}
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/config/fontInfo.ts]---
Location: vscode-main/src/vs/editor/common/config/fontInfo.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as platform from '../../../base/common/platform.js';
import { EditorOption, FindComputedEditorOptionValueById } from './editorOptions.js';
import { EditorZoom } from './editorZoom.js';

/**
 * Determined from empirical observations.
 * @internal
 */
export const GOLDEN_LINE_HEIGHT_RATIO = platform.isMacintosh ? 1.5 : 1.35;

/**
 * @internal
 */
export const MINIMUM_LINE_HEIGHT = 8;

/**
 * @internal
 */
export interface IValidatedEditorOptions {
	get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T>;
}

export class BareFontInfo {
	readonly _bareFontInfoBrand: void = undefined;

	/**
	 * @internal
	 */
	public static _create(fontFamily: string, fontWeight: string, fontSize: number, fontFeatureSettings: string, fontVariationSettings: string, lineHeight: number, letterSpacing: number, pixelRatio: number, ignoreEditorZoom: boolean): BareFontInfo {
		if (lineHeight === 0) {
			lineHeight = GOLDEN_LINE_HEIGHT_RATIO * fontSize;
		} else if (lineHeight < MINIMUM_LINE_HEIGHT) {
			// Values too small to be line heights in pixels are in ems.
			lineHeight = lineHeight * fontSize;
		}

		// Enforce integer, minimum constraints
		lineHeight = Math.round(lineHeight);
		if (lineHeight < MINIMUM_LINE_HEIGHT) {
			lineHeight = MINIMUM_LINE_HEIGHT;
		}

		const editorZoomLevelMultiplier = 1 + (ignoreEditorZoom ? 0 : EditorZoom.getZoomLevel() * 0.1);
		fontSize *= editorZoomLevelMultiplier;
		lineHeight *= editorZoomLevelMultiplier;

		if (fontVariationSettings === FONT_VARIATION_TRANSLATE) {
			if (fontWeight === 'normal' || fontWeight === 'bold') {
				fontVariationSettings = FONT_VARIATION_OFF;
			} else {
				const fontWeightAsNumber = parseInt(fontWeight, 10);
				fontVariationSettings = `'wght' ${fontWeightAsNumber}`;
				fontWeight = 'normal';
			}
		}

		return new BareFontInfo({
			pixelRatio: pixelRatio,
			fontFamily: fontFamily,
			fontWeight: fontWeight,
			fontSize: fontSize,
			fontFeatureSettings: fontFeatureSettings,
			fontVariationSettings,
			lineHeight: lineHeight,
			letterSpacing: letterSpacing
		});
	}

	readonly pixelRatio: number;
	readonly fontFamily: string;
	readonly fontWeight: string;
	readonly fontSize: number;
	readonly fontFeatureSettings: string;
	readonly fontVariationSettings: string;
	readonly lineHeight: number;
	readonly letterSpacing: number;

	/**
	 * @internal
	 */
	protected constructor(opts: {
		pixelRatio: number;
		fontFamily: string;
		fontWeight: string;
		fontSize: number;
		fontFeatureSettings: string;
		fontVariationSettings: string;
		lineHeight: number;
		letterSpacing: number;
	}) {
		this.pixelRatio = opts.pixelRatio;
		this.fontFamily = String(opts.fontFamily);
		this.fontWeight = String(opts.fontWeight);
		this.fontSize = opts.fontSize;
		this.fontFeatureSettings = opts.fontFeatureSettings;
		this.fontVariationSettings = opts.fontVariationSettings;
		this.lineHeight = opts.lineHeight | 0;
		this.letterSpacing = opts.letterSpacing;
	}

	/**
	 * @internal
	 */
	public getId(): string {
		return `${this.pixelRatio}-${this.fontFamily}-${this.fontWeight}-${this.fontSize}-${this.fontFeatureSettings}-${this.fontVariationSettings}-${this.lineHeight}-${this.letterSpacing}`;
	}

	/**
	 * @internal
	 */
	public getMassagedFontFamily(): string {
		const fallbackFontFamily = EDITOR_FONT_DEFAULTS.fontFamily;
		const fontFamily = BareFontInfo._wrapInQuotes(this.fontFamily);
		if (fallbackFontFamily && this.fontFamily !== fallbackFontFamily) {
			return `${fontFamily}, ${fallbackFontFamily}`;
		}
		return fontFamily;
	}

	private static _wrapInQuotes(fontFamily: string): string {
		if (/[,"']/.test(fontFamily)) {
			// Looks like the font family might be already escaped
			return fontFamily;
		}
		if (/[+ ]/.test(fontFamily)) {
			// Wrap a font family using + or <space> with quotes
			return `"${fontFamily}"`;
		}
		return fontFamily;
	}
}

// change this whenever `FontInfo` members are changed
export const SERIALIZED_FONT_INFO_VERSION = 2;

export class FontInfo extends BareFontInfo {
	readonly _editorStylingBrand: void = undefined;

	readonly version: number = SERIALIZED_FONT_INFO_VERSION;
	readonly isTrusted: boolean;
	readonly isMonospace: boolean;
	readonly typicalHalfwidthCharacterWidth: number;
	readonly typicalFullwidthCharacterWidth: number;
	readonly canUseHalfwidthRightwardsArrow: boolean;
	readonly spaceWidth: number;
	readonly middotWidth: number;
	readonly wsmiddotWidth: number;
	readonly maxDigitWidth: number;

	/**
	 * @internal
	 */
	constructor(opts: {
		pixelRatio: number;
		fontFamily: string;
		fontWeight: string;
		fontSize: number;
		fontFeatureSettings: string;
		fontVariationSettings: string;
		lineHeight: number;
		letterSpacing: number;
		isMonospace: boolean;
		typicalHalfwidthCharacterWidth: number;
		typicalFullwidthCharacterWidth: number;
		canUseHalfwidthRightwardsArrow: boolean;
		spaceWidth: number;
		middotWidth: number;
		wsmiddotWidth: number;
		maxDigitWidth: number;
	}, isTrusted: boolean) {
		super(opts);
		this.isTrusted = isTrusted;
		this.isMonospace = opts.isMonospace;
		this.typicalHalfwidthCharacterWidth = opts.typicalHalfwidthCharacterWidth;
		this.typicalFullwidthCharacterWidth = opts.typicalFullwidthCharacterWidth;
		this.canUseHalfwidthRightwardsArrow = opts.canUseHalfwidthRightwardsArrow;
		this.spaceWidth = opts.spaceWidth;
		this.middotWidth = opts.middotWidth;
		this.wsmiddotWidth = opts.wsmiddotWidth;
		this.maxDigitWidth = opts.maxDigitWidth;
	}

	/**
	 * @internal
	 */
	public equals(other: FontInfo): boolean {
		return (
			this.fontFamily === other.fontFamily
			&& this.fontWeight === other.fontWeight
			&& this.fontSize === other.fontSize
			&& this.fontFeatureSettings === other.fontFeatureSettings
			&& this.fontVariationSettings === other.fontVariationSettings
			&& this.lineHeight === other.lineHeight
			&& this.letterSpacing === other.letterSpacing
			&& this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
			&& this.typicalFullwidthCharacterWidth === other.typicalFullwidthCharacterWidth
			&& this.canUseHalfwidthRightwardsArrow === other.canUseHalfwidthRightwardsArrow
			&& this.spaceWidth === other.spaceWidth
			&& this.middotWidth === other.middotWidth
			&& this.wsmiddotWidth === other.wsmiddotWidth
			&& this.maxDigitWidth === other.maxDigitWidth
		);
	}
}
/**
 * @internal
 */
export const FONT_VARIATION_OFF = 'normal';
/**
 * @internal
 */
export const FONT_VARIATION_TRANSLATE = 'translate';

/**
 * @internal
 */
export const DEFAULT_WINDOWS_FONT_FAMILY = 'Consolas, \'Courier New\', monospace';
/**
 * @internal
 */
export const DEFAULT_MAC_FONT_FAMILY = 'Menlo, Monaco, \'Courier New\', monospace';
/**
 * @internal
 */
export const DEFAULT_LINUX_FONT_FAMILY = '\'Droid Sans Mono\', monospace';
/**
 * @internal
 */
export const EDITOR_FONT_DEFAULTS = {
	fontFamily: (
		platform.isMacintosh ? DEFAULT_MAC_FONT_FAMILY : (platform.isWindows ? DEFAULT_WINDOWS_FONT_FAMILY : DEFAULT_LINUX_FONT_FAMILY)
	),
	fontWeight: 'normal',
	fontSize: (
		platform.isMacintosh ? 12 : 14
	),
	lineHeight: 0,
	letterSpacing: 0,
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/config/fontInfoFromSettings.ts]---
Location: vscode-main/src/vs/editor/common/config/fontInfoFromSettings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorOption, EditorOptions } from './editorOptions.js';
import { IValidatedEditorOptions, BareFontInfo } from './fontInfo.js';

export function createBareFontInfoFromValidatedSettings(options: IValidatedEditorOptions, pixelRatio: number, ignoreEditorZoom: boolean): BareFontInfo {
	const fontFamily = options.get(EditorOption.fontFamily);
	const fontWeight = options.get(EditorOption.fontWeight);
	const fontSize = options.get(EditorOption.fontSize);
	const fontFeatureSettings = options.get(EditorOption.fontLigatures);
	const fontVariationSettings = options.get(EditorOption.fontVariations);
	const lineHeight = options.get(EditorOption.lineHeight);
	const letterSpacing = options.get(EditorOption.letterSpacing);
	return BareFontInfo._create(fontFamily, fontWeight, fontSize, fontFeatureSettings, fontVariationSettings, lineHeight, letterSpacing, pixelRatio, ignoreEditorZoom);
}

export function createBareFontInfoFromRawSettings(opts: {
	fontFamily?: unknown;
	fontWeight?: unknown;
	fontSize?: unknown;
	fontLigatures?: unknown;
	fontVariations?: unknown;
	lineHeight?: unknown;
	letterSpacing?: unknown;
}, pixelRatio: number, ignoreEditorZoom: boolean = false): BareFontInfo {
	const fontFamily = EditorOptions.fontFamily.validate(opts.fontFamily);
	const fontWeight = EditorOptions.fontWeight.validate(opts.fontWeight);
	const fontSize = EditorOptions.fontSize.validate(opts.fontSize);
	const fontFeatureSettings = EditorOptions.fontLigatures2.validate(opts.fontLigatures);
	const fontVariationSettings = EditorOptions.fontVariations.validate(opts.fontVariations);
	const lineHeight = EditorOptions.lineHeight.validate(opts.lineHeight);
	const letterSpacing = EditorOptions.letterSpacing.validate(opts.letterSpacing);
	return BareFontInfo._create(fontFamily, fontWeight, fontSize, fontFeatureSettings, fontVariationSettings, lineHeight, letterSpacing, pixelRatio, ignoreEditorZoom);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/characterClassifier.ts]---
Location: vscode-main/src/vs/editor/common/core/characterClassifier.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toUint8 } from '../../../base/common/uint.js';

/**
 * A fast character classifier that uses a compact array for ASCII values.
 */
export class CharacterClassifier<T extends number> {
	/**
	 * Maintain a compact (fully initialized ASCII map for quickly classifying ASCII characters - used more often in code).
	 */
	protected readonly _asciiMap: Uint8Array;

	/**
	 * The entire map (sparse array).
	 */
	protected readonly _map: Map<number, number>;

	protected readonly _defaultValue: number;

	constructor(_defaultValue: T) {
		const defaultValue = toUint8(_defaultValue);

		this._defaultValue = defaultValue;
		this._asciiMap = CharacterClassifier._createAsciiMap(defaultValue);
		this._map = new Map<number, number>();
	}

	private static _createAsciiMap(defaultValue: number): Uint8Array {
		const asciiMap = new Uint8Array(256);
		asciiMap.fill(defaultValue);
		return asciiMap;
	}

	public set(charCode: number, _value: T): void {
		const value = toUint8(_value);

		if (charCode >= 0 && charCode < 256) {
			this._asciiMap[charCode] = value;
		} else {
			this._map.set(charCode, value);
		}
	}

	public get(charCode: number): T {
		if (charCode >= 0 && charCode < 256) {
			return <T>this._asciiMap[charCode];
		} else {
			return <T>(this._map.get(charCode) || this._defaultValue);
		}
	}

	public clear() {
		this._asciiMap.fill(this._defaultValue);
		this._map.clear();
	}
}

const enum Boolean {
	False = 0,
	True = 1
}

export class CharacterSet {

	private readonly _actual: CharacterClassifier<Boolean>;

	constructor() {
		this._actual = new CharacterClassifier<Boolean>(Boolean.False);
	}

	public add(charCode: number): void {
		this._actual.set(charCode, Boolean.True);
	}

	public has(charCode: number): boolean {
		return (this._actual.get(charCode) === Boolean.True);
	}

	public clear(): void {
		return this._actual.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/cursorColumns.ts]---
Location: vscode-main/src/vs/editor/common/core/cursorColumns.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import * as strings from '../../../base/common/strings.js';

/**
 * A column in a position is the gap between two adjacent characters. The methods here
 * work with a concept called "visible column". A visible column is a very rough approximation
 * of the horizontal screen position of a column. For example, using a tab size of 4:
 * ```txt
 * |<TAB>|<TAB>|T|ext
 * |     |     | \---- column = 4, visible column = 9
 * |     |     \------ column = 3, visible column = 8
 * |     \------------ column = 2, visible column = 4
 * \------------------ column = 1, visible column = 0
 * ```
 *
 * **NOTE**: Visual columns do not work well for RTL text or variable-width fonts or characters.
 *
 * **NOTE**: These methods work and make sense both on the model and on the view model.
 */
export class CursorColumns {

	private static _nextVisibleColumn(codePoint: number, visibleColumn: number, tabSize: number): number {
		if (codePoint === CharCode.Tab) {
			return CursorColumns.nextRenderTabStop(visibleColumn, tabSize);
		}
		if (strings.isFullWidthCharacter(codePoint) || strings.isEmojiImprecise(codePoint)) {
			return visibleColumn + 2;
		}
		return visibleColumn + 1;
	}

	/**
	 * Returns a visible column from a column.
	 * @see {@link CursorColumns}
	 */
	public static visibleColumnFromColumn(lineContent: string, column: number, tabSize: number): number {
		const textLen = Math.min(column - 1, lineContent.length);
		const text = lineContent.substring(0, textLen);
		const iterator = new strings.GraphemeIterator(text);

		let result = 0;
		while (!iterator.eol()) {
			const codePoint = strings.getNextCodePoint(text, textLen, iterator.offset);
			iterator.nextGraphemeLength();

			result = this._nextVisibleColumn(codePoint, result, tabSize);
		}

		return result;
	}

	/**
	 * Returns the value to display as "Col" in the status bar.
	 * @see {@link CursorColumns}
	 */
	public static toStatusbarColumn(lineContent: string, column: number, tabSize: number): number {
		const text = lineContent.substring(0, Math.min(column - 1, lineContent.length));
		const iterator = new strings.CodePointIterator(text);

		let result = 0;
		while (!iterator.eol()) {
			const codePoint = iterator.nextCodePoint();

			if (codePoint === CharCode.Tab) {
				result = CursorColumns.nextRenderTabStop(result, tabSize);
			} else {
				result = result + 1;
			}
		}

		return result + 1;
	}

	/**
	 * Returns a column from a visible column.
	 * @see {@link CursorColumns}
	 */
	public static columnFromVisibleColumn(lineContent: string, visibleColumn: number, tabSize: number): number {
		if (visibleColumn <= 0) {
			return 1;
		}

		const lineContentLength = lineContent.length;
		const iterator = new strings.GraphemeIterator(lineContent);

		let beforeVisibleColumn = 0;
		let beforeColumn = 1;
		while (!iterator.eol()) {
			const codePoint = strings.getNextCodePoint(lineContent, lineContentLength, iterator.offset);
			iterator.nextGraphemeLength();

			const afterVisibleColumn = this._nextVisibleColumn(codePoint, beforeVisibleColumn, tabSize);
			const afterColumn = iterator.offset + 1;

			if (afterVisibleColumn >= visibleColumn) {
				const beforeDelta = visibleColumn - beforeVisibleColumn;
				const afterDelta = afterVisibleColumn - visibleColumn;
				if (afterDelta < beforeDelta) {
					return afterColumn;
				} else {
					return beforeColumn;
				}
			}

			beforeVisibleColumn = afterVisibleColumn;
			beforeColumn = afterColumn;
		}

		// walked the entire string
		return lineContentLength + 1;
	}

	/**
	 * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
	 * @see {@link CursorColumns}
	 */
	public static nextRenderTabStop(visibleColumn: number, tabSize: number): number {
		return visibleColumn + tabSize - visibleColumn % tabSize;
	}

	/**
	 * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
	 * @see {@link CursorColumns}
	 */
	public static nextIndentTabStop(visibleColumn: number, indentSize: number): number {
		return CursorColumns.nextRenderTabStop(visibleColumn, indentSize);
	}

	/**
	 * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
	 * @see {@link CursorColumns}
	 */
	public static prevRenderTabStop(column: number, tabSize: number): number {
		return Math.max(0, column - 1 - (column - 1) % tabSize);
	}

	/**
	 * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
	 * @see {@link CursorColumns}
	 */
	public static prevIndentTabStop(column: number, indentSize: number): number {
		return CursorColumns.prevRenderTabStop(column, indentSize);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/editOperation.ts]---
Location: vscode-main/src/vs/editor/common/core/editOperation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position } from './position.js';
import { IRange, Range } from './range.js';

/**
 * A single edit operation, that acts as a simple replace.
 * i.e. Replace text at `range` with `text` in model.
 */
export interface ISingleEditOperation {
	/**
	 * The range to replace. This can be empty to emulate a simple insert.
	 */
	range: IRange;
	/**
	 * The text to replace with. This can be null to emulate a simple delete.
	 */
	text: string | null;
	/**
	 * This indicates that this operation has "insert" semantics.
	 * i.e. forceMoveMarkers = true => if `range` is collapsed, all markers at the position will be moved.
	 */
	forceMoveMarkers?: boolean;
}

export class EditOperation {

	public static insert(position: Position, text: string): ISingleEditOperation {
		return {
			range: new Range(position.lineNumber, position.column, position.lineNumber, position.column),
			text: text,
			forceMoveMarkers: true
		};
	}

	public static delete(range: Range): ISingleEditOperation {
		return {
			range: range,
			text: null
		};
	}

	public static replace(range: Range, text: string | null): ISingleEditOperation {
		return {
			range: range,
			text: text
		};
	}

	public static replaceMove(range: Range, text: string | null): ISingleEditOperation {
		return {
			range: range,
			text: text,
			forceMoveMarkers: true
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/editorColorRegistry.ts]---
Location: vscode-main/src/vs/editor/common/core/editorColorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import { Color, RGBA } from '../../../base/common/color.js';
import { activeContrastBorder, editorBackground, registerColor, editorWarningForeground, editorInfoForeground, editorWarningBorder, editorInfoBorder, contrastBorder, editorFindMatchHighlight, editorWarningBackground } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';

/**
 * Definition of the editor colors
 */
export const editorLineHighlight = registerColor('editor.lineHighlightBackground', null, nls.localize('lineHighlight', 'Background color for the highlight of line at the cursor position.'));
export const editorInactiveLineHighlight = registerColor('editor.inactiveLineHighlightBackground', editorLineHighlight, nls.localize('inactiveLineHighlight', 'Background color for the highlight of line at the cursor position when the editor is not focused.'));
export const editorLineHighlightBorder = registerColor('editor.lineHighlightBorder', { dark: '#282828', light: '#eeeeee', hcDark: '#f38518', hcLight: contrastBorder }, nls.localize('lineHighlightBorderBox', 'Background color for the border around the line at the cursor position.'));
export const editorRangeHighlight = registerColor('editor.rangeHighlightBackground', { dark: '#ffffff0b', light: '#fdff0033', hcDark: null, hcLight: null }, nls.localize('rangeHighlight', 'Background color of highlighted ranges, like by quick open and find features. The color must not be opaque so as not to hide underlying decorations.'), true);
export const editorRangeHighlightBorder = registerColor('editor.rangeHighlightBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('rangeHighlightBorder', 'Background color of the border around highlighted ranges.'));
export const editorSymbolHighlight = registerColor('editor.symbolHighlightBackground', { dark: editorFindMatchHighlight, light: editorFindMatchHighlight, hcDark: null, hcLight: null }, nls.localize('symbolHighlight', 'Background color of highlighted symbol, like for go to definition or go next/previous symbol. The color must not be opaque so as not to hide underlying decorations.'), true);
export const editorSymbolHighlightBorder = registerColor('editor.symbolHighlightBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('symbolHighlightBorder', 'Background color of the border around highlighted symbols.'));

export const editorCursorForeground = registerColor('editorCursor.foreground', { dark: '#AEAFAD', light: Color.black, hcDark: Color.white, hcLight: '#0F4A85' }, nls.localize('caret', 'Color of the editor cursor.'));
export const editorCursorBackground = registerColor('editorCursor.background', null, nls.localize('editorCursorBackground', 'The background color of the editor cursor. Allows customizing the color of a character overlapped by a block cursor.'));
export const editorMultiCursorPrimaryForeground = registerColor('editorMultiCursor.primary.foreground', editorCursorForeground, nls.localize('editorMultiCursorPrimaryForeground', 'Color of the primary editor cursor when multiple cursors are present.'));
export const editorMultiCursorPrimaryBackground = registerColor('editorMultiCursor.primary.background', editorCursorBackground, nls.localize('editorMultiCursorPrimaryBackground', 'The background color of the primary editor cursor when multiple cursors are present. Allows customizing the color of a character overlapped by a block cursor.'));
export const editorMultiCursorSecondaryForeground = registerColor('editorMultiCursor.secondary.foreground', editorCursorForeground, nls.localize('editorMultiCursorSecondaryForeground', 'Color of secondary editor cursors when multiple cursors are present.'));
export const editorMultiCursorSecondaryBackground = registerColor('editorMultiCursor.secondary.background', editorCursorBackground, nls.localize('editorMultiCursorSecondaryBackground', 'The background color of secondary editor cursors when multiple cursors are present. Allows customizing the color of a character overlapped by a block cursor.'));
export const editorWhitespaces = registerColor('editorWhitespace.foreground', { dark: '#e3e4e229', light: '#33333333', hcDark: '#e3e4e229', hcLight: '#CCCCCC' }, nls.localize('editorWhitespaces', 'Color of whitespace characters in the editor.'));
export const editorLineNumbers = registerColor('editorLineNumber.foreground', { dark: '#858585', light: '#237893', hcDark: Color.white, hcLight: '#292929' }, nls.localize('editorLineNumbers', 'Color of editor line numbers.'));

export const deprecatedEditorIndentGuides = registerColor('editorIndentGuide.background', editorWhitespaces, nls.localize('editorIndentGuides', 'Color of the editor indentation guides.'), false, nls.localize('deprecatedEditorIndentGuides', '\'editorIndentGuide.background\' is deprecated. Use \'editorIndentGuide.background1\' instead.'));
export const deprecatedEditorActiveIndentGuides = registerColor('editorIndentGuide.activeBackground', editorWhitespaces, nls.localize('editorActiveIndentGuide', 'Color of the active editor indentation guides.'), false, nls.localize('deprecatedEditorActiveIndentGuide', '\'editorIndentGuide.activeBackground\' is deprecated. Use \'editorIndentGuide.activeBackground1\' instead.'));

export const editorIndentGuide1 = registerColor('editorIndentGuide.background1', deprecatedEditorIndentGuides, nls.localize('editorIndentGuides1', 'Color of the editor indentation guides (1).'));
export const editorIndentGuide2 = registerColor('editorIndentGuide.background2', '#00000000', nls.localize('editorIndentGuides2', 'Color of the editor indentation guides (2).'));
export const editorIndentGuide3 = registerColor('editorIndentGuide.background3', '#00000000', nls.localize('editorIndentGuides3', 'Color of the editor indentation guides (3).'));
export const editorIndentGuide4 = registerColor('editorIndentGuide.background4', '#00000000', nls.localize('editorIndentGuides4', 'Color of the editor indentation guides (4).'));
export const editorIndentGuide5 = registerColor('editorIndentGuide.background5', '#00000000', nls.localize('editorIndentGuides5', 'Color of the editor indentation guides (5).'));
export const editorIndentGuide6 = registerColor('editorIndentGuide.background6', '#00000000', nls.localize('editorIndentGuides6', 'Color of the editor indentation guides (6).'));

export const editorActiveIndentGuide1 = registerColor('editorIndentGuide.activeBackground1', deprecatedEditorActiveIndentGuides, nls.localize('editorActiveIndentGuide1', 'Color of the active editor indentation guides (1).'));
export const editorActiveIndentGuide2 = registerColor('editorIndentGuide.activeBackground2', '#00000000', nls.localize('editorActiveIndentGuide2', 'Color of the active editor indentation guides (2).'));
export const editorActiveIndentGuide3 = registerColor('editorIndentGuide.activeBackground3', '#00000000', nls.localize('editorActiveIndentGuide3', 'Color of the active editor indentation guides (3).'));
export const editorActiveIndentGuide4 = registerColor('editorIndentGuide.activeBackground4', '#00000000', nls.localize('editorActiveIndentGuide4', 'Color of the active editor indentation guides (4).'));
export const editorActiveIndentGuide5 = registerColor('editorIndentGuide.activeBackground5', '#00000000', nls.localize('editorActiveIndentGuide5', 'Color of the active editor indentation guides (5).'));
export const editorActiveIndentGuide6 = registerColor('editorIndentGuide.activeBackground6', '#00000000', nls.localize('editorActiveIndentGuide6', 'Color of the active editor indentation guides (6).'));

const deprecatedEditorActiveLineNumber = registerColor('editorActiveLineNumber.foreground', { dark: '#c6c6c6', light: '#0B216F', hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls.localize('editorActiveLineNumber', 'Color of editor active line number'), false, nls.localize('deprecatedEditorActiveLineNumber', 'Id is deprecated. Use \'editorLineNumber.activeForeground\' instead.'));
export const editorActiveLineNumber = registerColor('editorLineNumber.activeForeground', deprecatedEditorActiveLineNumber, nls.localize('editorActiveLineNumber', 'Color of editor active line number'));
export const editorDimmedLineNumber = registerColor('editorLineNumber.dimmedForeground', null, nls.localize('editorDimmedLineNumber', 'Color of the final editor line when editor.renderFinalNewline is set to dimmed.'));

export const editorRuler = registerColor('editorRuler.foreground', { dark: '#5A5A5A', light: Color.lightgrey, hcDark: Color.white, hcLight: '#292929' }, nls.localize('editorRuler', 'Color of the editor rulers.'));

export const editorCodeLensForeground = registerColor('editorCodeLens.foreground', { dark: '#999999', light: '#919191', hcDark: '#999999', hcLight: '#292929' }, nls.localize('editorCodeLensForeground', 'Foreground color of editor CodeLens'));

export const editorBracketMatchBackground = registerColor('editorBracketMatch.background', { dark: '#0064001a', light: '#0064001a', hcDark: '#0064001a', hcLight: '#0000' }, nls.localize('editorBracketMatchBackground', 'Background color behind matching brackets'));
export const editorBracketMatchBorder = registerColor('editorBracketMatch.border', { dark: '#888', light: '#B9B9B9', hcDark: contrastBorder, hcLight: contrastBorder }, nls.localize('editorBracketMatchBorder', 'Color for matching brackets boxes'));
export const editorBracketMatchForeground = registerColor('editorBracketMatch.foreground', null, nls.localize('editorBracketMatchForeground', 'Foreground color for matching brackets'));

export const editorOverviewRulerBorder = registerColor('editorOverviewRuler.border', { dark: '#7f7f7f4d', light: '#7f7f7f4d', hcDark: '#7f7f7f4d', hcLight: '#666666' }, nls.localize('editorOverviewRulerBorder', 'Color of the overview ruler border.'));
export const editorOverviewRulerBackground = registerColor('editorOverviewRuler.background', null, nls.localize('editorOverviewRulerBackground', 'Background color of the editor overview ruler.'));

export const editorGutter = registerColor('editorGutter.background', editorBackground, nls.localize('editorGutter', 'Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.'));

export const editorUnnecessaryCodeBorder = registerColor('editorUnnecessaryCode.border', { dark: null, light: null, hcDark: Color.fromHex('#fff').transparent(0.8), hcLight: contrastBorder }, nls.localize('unnecessaryCodeBorder', 'Border color of unnecessary (unused) source code in the editor.'));
export const editorUnnecessaryCodeOpacity = registerColor('editorUnnecessaryCode.opacity', { dark: Color.fromHex('#000a'), light: Color.fromHex('#0007'), hcDark: null, hcLight: null }, nls.localize('unnecessaryCodeOpacity', 'Opacity of unnecessary (unused) source code in the editor. For example, "#000000c0" will render the code with 75% opacity. For high contrast themes, use the  \'editorUnnecessaryCode.border\' theme color to underline unnecessary code instead of fading it out.'));

export const ghostTextBorder = registerColor('editorGhostText.border', { dark: null, light: null, hcDark: Color.fromHex('#fff').transparent(0.8), hcLight: Color.fromHex('#292929').transparent(0.8) }, nls.localize('editorGhostTextBorder', 'Border color of ghost text in the editor.'));
export const ghostTextForeground = registerColor('editorGhostText.foreground', { dark: Color.fromHex('#ffffff56'), light: Color.fromHex('#0007'), hcDark: null, hcLight: null }, nls.localize('editorGhostTextForeground', 'Foreground color of the ghost text in the editor.'));
export const ghostTextBackground = registerColor('editorGhostText.background', null, nls.localize('editorGhostTextBackground', 'Background color of the ghost text in the editor.'));

const rulerRangeDefault = new Color(new RGBA(0, 122, 204, 0.6));
export const overviewRulerRangeHighlight = registerColor('editorOverviewRuler.rangeHighlightForeground', rulerRangeDefault, nls.localize('overviewRulerRangeHighlight', 'Overview ruler marker color for range highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
export const overviewRulerError = registerColor('editorOverviewRuler.errorForeground', { dark: new Color(new RGBA(255, 18, 18, 0.7)), light: new Color(new RGBA(255, 18, 18, 0.7)), hcDark: new Color(new RGBA(255, 50, 50, 1)), hcLight: '#B5200D' }, nls.localize('overviewRuleError', 'Overview ruler marker color for errors.'));
export const overviewRulerWarning = registerColor('editorOverviewRuler.warningForeground', { dark: editorWarningForeground, light: editorWarningForeground, hcDark: editorWarningBorder, hcLight: editorWarningBorder }, nls.localize('overviewRuleWarning', 'Overview ruler marker color for warnings.'));
export const overviewRulerInfo = registerColor('editorOverviewRuler.infoForeground', { dark: editorInfoForeground, light: editorInfoForeground, hcDark: editorInfoBorder, hcLight: editorInfoBorder }, nls.localize('overviewRuleInfo', 'Overview ruler marker color for infos.'));

export const editorBracketHighlightingForeground1 = registerColor('editorBracketHighlight.foreground1', { dark: '#FFD700', light: '#0431FAFF', hcDark: '#FFD700', hcLight: '#0431FAFF' }, nls.localize('editorBracketHighlightForeground1', 'Foreground color of brackets (1). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground2 = registerColor('editorBracketHighlight.foreground2', { dark: '#DA70D6', light: '#319331FF', hcDark: '#DA70D6', hcLight: '#319331FF' }, nls.localize('editorBracketHighlightForeground2', 'Foreground color of brackets (2). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground3 = registerColor('editorBracketHighlight.foreground3', { dark: '#179FFF', light: '#7B3814FF', hcDark: '#87CEFA', hcLight: '#7B3814FF' }, nls.localize('editorBracketHighlightForeground3', 'Foreground color of brackets (3). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground4 = registerColor('editorBracketHighlight.foreground4', '#00000000', nls.localize('editorBracketHighlightForeground4', 'Foreground color of brackets (4). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground5 = registerColor('editorBracketHighlight.foreground5', '#00000000', nls.localize('editorBracketHighlightForeground5', 'Foreground color of brackets (5). Requires enabling bracket pair colorization.'));
export const editorBracketHighlightingForeground6 = registerColor('editorBracketHighlight.foreground6', '#00000000', nls.localize('editorBracketHighlightForeground6', 'Foreground color of brackets (6). Requires enabling bracket pair colorization.'));

export const editorBracketHighlightingUnexpectedBracketForeground = registerColor('editorBracketHighlight.unexpectedBracket.foreground', { dark: new Color(new RGBA(255, 18, 18, 0.8)), light: new Color(new RGBA(255, 18, 18, 0.8)), hcDark: new Color(new RGBA(255, 50, 50, 1)), hcLight: '#B5200D' }, nls.localize('editorBracketHighlightUnexpectedBracketForeground', 'Foreground color of unexpected brackets.'));

export const editorBracketPairGuideBackground1 = registerColor('editorBracketPairGuide.background1', '#00000000', nls.localize('editorBracketPairGuide.background1', 'Background color of inactive bracket pair guides (1). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground2 = registerColor('editorBracketPairGuide.background2', '#00000000', nls.localize('editorBracketPairGuide.background2', 'Background color of inactive bracket pair guides (2). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground3 = registerColor('editorBracketPairGuide.background3', '#00000000', nls.localize('editorBracketPairGuide.background3', 'Background color of inactive bracket pair guides (3). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground4 = registerColor('editorBracketPairGuide.background4', '#00000000', nls.localize('editorBracketPairGuide.background4', 'Background color of inactive bracket pair guides (4). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground5 = registerColor('editorBracketPairGuide.background5', '#00000000', nls.localize('editorBracketPairGuide.background5', 'Background color of inactive bracket pair guides (5). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideBackground6 = registerColor('editorBracketPairGuide.background6', '#00000000', nls.localize('editorBracketPairGuide.background6', 'Background color of inactive bracket pair guides (6). Requires enabling bracket pair guides.'));

export const editorBracketPairGuideActiveBackground1 = registerColor('editorBracketPairGuide.activeBackground1', '#00000000', nls.localize('editorBracketPairGuide.activeBackground1', 'Background color of active bracket pair guides (1). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground2 = registerColor('editorBracketPairGuide.activeBackground2', '#00000000', nls.localize('editorBracketPairGuide.activeBackground2', 'Background color of active bracket pair guides (2). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground3 = registerColor('editorBracketPairGuide.activeBackground3', '#00000000', nls.localize('editorBracketPairGuide.activeBackground3', 'Background color of active bracket pair guides (3). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground4 = registerColor('editorBracketPairGuide.activeBackground4', '#00000000', nls.localize('editorBracketPairGuide.activeBackground4', 'Background color of active bracket pair guides (4). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground5 = registerColor('editorBracketPairGuide.activeBackground5', '#00000000', nls.localize('editorBracketPairGuide.activeBackground5', 'Background color of active bracket pair guides (5). Requires enabling bracket pair guides.'));
export const editorBracketPairGuideActiveBackground6 = registerColor('editorBracketPairGuide.activeBackground6', '#00000000', nls.localize('editorBracketPairGuide.activeBackground6', 'Background color of active bracket pair guides (6). Requires enabling bracket pair guides.'));

export const editorUnicodeHighlightBorder = registerColor('editorUnicodeHighlight.border', editorWarningForeground, nls.localize('editorUnicodeHighlight.border', 'Border color used to highlight unicode characters.'));
export const editorUnicodeHighlightBackground = registerColor('editorUnicodeHighlight.background', editorWarningBackground, nls.localize('editorUnicodeHighlight.background', 'Background color used to highlight unicode characters.'));


// contains all color rules that used to defined in editor/browser/widget/editor.css
registerThemingParticipant((theme, collector) => {
	const background = theme.getColor(editorBackground);
	const lineHighlight = theme.getColor(editorLineHighlight);
	const imeBackground = (lineHighlight && !lineHighlight.isTransparent() ? lineHighlight : background);
	if (imeBackground) {
		collector.addRule(`.monaco-editor .inputarea.ime-input { background-color: ${imeBackground}; }`);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/position.ts]---
Location: vscode-main/src/vs/editor/common/core/position.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A position in the editor. This interface is suitable for serialization.
 */
export interface IPosition {
	/**
	 * line number (starts at 1)
	 */
	readonly lineNumber: number;
	/**
	 * column (the first character in a line is between column 1 and column 2)
	 */
	readonly column: number;
}

/**
 * A position in the editor.
 */
export class Position {
	/**
	 * line number (starts at 1)
	 */
	public readonly lineNumber: number;
	/**
	 * column (the first character in a line is between column 1 and column 2)
	 */
	public readonly column: number;

	constructor(lineNumber: number, column: number) {
		this.lineNumber = lineNumber;
		this.column = column;
	}

	/**
	 * Create a new position from this position.
	 *
	 * @param newLineNumber new line number
	 * @param newColumn new column
	 */
	with(newLineNumber: number = this.lineNumber, newColumn: number = this.column): Position {
		if (newLineNumber === this.lineNumber && newColumn === this.column) {
			return this;
		} else {
			return new Position(newLineNumber, newColumn);
		}
	}

	/**
	 * Derive a new position from this position.
	 *
	 * @param deltaLineNumber line number delta
	 * @param deltaColumn column delta
	 */
	delta(deltaLineNumber: number = 0, deltaColumn: number = 0): Position {
		return this.with(Math.max(1, this.lineNumber + deltaLineNumber), Math.max(1, this.column + deltaColumn));
	}

	/**
	 * Test if this position equals other position
	 */
	public equals(other: IPosition): boolean {
		return Position.equals(this, other);
	}

	/**
	 * Test if position `a` equals position `b`
	 */
	public static equals(a: IPosition | null, b: IPosition | null): boolean {
		if (!a && !b) {
			return true;
		}
		return (
			!!a &&
			!!b &&
			a.lineNumber === b.lineNumber &&
			a.column === b.column
		);
	}

	/**
	 * Test if this position is before other position.
	 * If the two positions are equal, the result will be false.
	 */
	public isBefore(other: IPosition): boolean {
		return Position.isBefore(this, other);
	}

	/**
	 * Test if position `a` is before position `b`.
	 * If the two positions are equal, the result will be false.
	 */
	public static isBefore(a: IPosition, b: IPosition): boolean {
		if (a.lineNumber < b.lineNumber) {
			return true;
		}
		if (b.lineNumber < a.lineNumber) {
			return false;
		}
		return a.column < b.column;
	}

	/**
	 * Test if this position is before other position.
	 * If the two positions are equal, the result will be true.
	 */
	public isBeforeOrEqual(other: IPosition): boolean {
		return Position.isBeforeOrEqual(this, other);
	}

	/**
	 * Test if position `a` is before position `b`.
	 * If the two positions are equal, the result will be true.
	 */
	public static isBeforeOrEqual(a: IPosition, b: IPosition): boolean {
		if (a.lineNumber < b.lineNumber) {
			return true;
		}
		if (b.lineNumber < a.lineNumber) {
			return false;
		}
		return a.column <= b.column;
	}

	/**
	 * A function that compares positions, useful for sorting
	 */
	public static compare(a: IPosition, b: IPosition): number {
		const aLineNumber = a.lineNumber | 0;
		const bLineNumber = b.lineNumber | 0;

		if (aLineNumber === bLineNumber) {
			const aColumn = a.column | 0;
			const bColumn = b.column | 0;
			return aColumn - bColumn;
		}

		return aLineNumber - bLineNumber;
	}

	/**
	 * Clone this position.
	 */
	public clone(): Position {
		return new Position(this.lineNumber, this.column);
	}

	/**
	 * Convert to a human-readable representation.
	 */
	public toString(): string {
		return '(' + this.lineNumber + ',' + this.column + ')';
	}

	// ---

	/**
	 * Create a `Position` from an `IPosition`.
	 */
	public static lift(pos: IPosition): Position {
		return new Position(pos.lineNumber, pos.column);
	}

	/**
	 * Test if `obj` is an `IPosition`.
	 */
	public static isIPosition(obj: unknown): obj is IPosition {
		return (
			!!obj
			&& (typeof (obj as IPosition).lineNumber === 'number')
			&& (typeof (obj as IPosition).column === 'number')
		);
	}

	public toJSON(): IPosition {
		return {
			lineNumber: this.lineNumber,
			column: this.column
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/range.ts]---
Location: vscode-main/src/vs/editor/common/core/range.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPosition, Position } from './position.js';

/**
 * A range in the editor. This interface is suitable for serialization.
 */
export interface IRange {
	/**
	 * Line number on which the range starts (starts at 1).
	 */
	readonly startLineNumber: number;
	/**
	 * Column on which the range starts in line `startLineNumber` (starts at 1).
	 */
	readonly startColumn: number;
	/**
	 * Line number on which the range ends.
	 */
	readonly endLineNumber: number;
	/**
	 * Column on which the range ends in line `endLineNumber`.
	 */
	readonly endColumn: number;
}

/**
 * A range in the editor. (startLineNumber,startColumn) is <= (endLineNumber,endColumn)
 */
export class Range {

	/**
	 * Line number on which the range starts (starts at 1).
	 */
	public readonly startLineNumber: number;
	/**
	 * Column on which the range starts in line `startLineNumber` (starts at 1).
	 */
	public readonly startColumn: number;
	/**
	 * Line number on which the range ends.
	 */
	public readonly endLineNumber: number;
	/**
	 * Column on which the range ends in line `endLineNumber`.
	 */
	public readonly endColumn: number;

	constructor(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number) {
		if ((startLineNumber > endLineNumber) || (startLineNumber === endLineNumber && startColumn > endColumn)) {
			this.startLineNumber = endLineNumber;
			this.startColumn = endColumn;
			this.endLineNumber = startLineNumber;
			this.endColumn = startColumn;
		} else {
			this.startLineNumber = startLineNumber;
			this.startColumn = startColumn;
			this.endLineNumber = endLineNumber;
			this.endColumn = endColumn;
		}
	}

	/**
	 * Test if this range is empty.
	 */
	public isEmpty(): boolean {
		return Range.isEmpty(this);
	}

	/**
	 * Test if `range` is empty.
	 */
	public static isEmpty(range: IRange): boolean {
		return (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn);
	}

	/**
	 * Test if position is in this range. If the position is at the edges, will return true.
	 */
	public containsPosition(position: IPosition): boolean {
		return Range.containsPosition(this, position);
	}

	/**
	 * Test if `position` is in `range`. If the position is at the edges, will return true.
	 */
	public static containsPosition(range: IRange, position: IPosition): boolean {
		if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
			return false;
		}
		if (position.lineNumber === range.startLineNumber && position.column < range.startColumn) {
			return false;
		}
		if (position.lineNumber === range.endLineNumber && position.column > range.endColumn) {
			return false;
		}
		return true;
	}

	/**
	 * Test if `position` is in `range`. If the position is at the edges, will return false.
	 * @internal
	 */
	public static strictContainsPosition(range: IRange, position: IPosition): boolean {
		if (position.lineNumber < range.startLineNumber || position.lineNumber > range.endLineNumber) {
			return false;
		}
		if (position.lineNumber === range.startLineNumber && position.column <= range.startColumn) {
			return false;
		}
		if (position.lineNumber === range.endLineNumber && position.column >= range.endColumn) {
			return false;
		}
		return true;
	}

	/**
	 * Test if range is in this range. If the range is equal to this range, will return true.
	 */
	public containsRange(range: IRange): boolean {
		return Range.containsRange(this, range);
	}

	/**
	 * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
	 */
	public static containsRange(range: IRange, otherRange: IRange): boolean {
		if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
			return false;
		}
		if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
			return false;
		}
		if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn < range.startColumn) {
			return false;
		}
		if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn > range.endColumn) {
			return false;
		}
		return true;
	}

	/**
	 * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
	 */
	public strictContainsRange(range: IRange): boolean {
		return Range.strictContainsRange(this, range);
	}

	/**
	 * Test if `otherRange` is strictly in `range` (must start after, and end before). If the ranges are equal, will return false.
	 */
	public static strictContainsRange(range: IRange, otherRange: IRange): boolean {
		if (otherRange.startLineNumber < range.startLineNumber || otherRange.endLineNumber < range.startLineNumber) {
			return false;
		}
		if (otherRange.startLineNumber > range.endLineNumber || otherRange.endLineNumber > range.endLineNumber) {
			return false;
		}
		if (otherRange.startLineNumber === range.startLineNumber && otherRange.startColumn <= range.startColumn) {
			return false;
		}
		if (otherRange.endLineNumber === range.endLineNumber && otherRange.endColumn >= range.endColumn) {
			return false;
		}
		return true;
	}

	/**
	 * A reunion of the two ranges.
	 * The smallest position will be used as the start point, and the largest one as the end point.
	 */
	public plusRange(range: IRange): Range {
		return Range.plusRange(this, range);
	}

	/**
	 * A reunion of the two ranges.
	 * The smallest position will be used as the start point, and the largest one as the end point.
	 */
	public static plusRange(a: IRange, b: IRange): Range {
		let startLineNumber: number;
		let startColumn: number;
		let endLineNumber: number;
		let endColumn: number;

		if (b.startLineNumber < a.startLineNumber) {
			startLineNumber = b.startLineNumber;
			startColumn = b.startColumn;
		} else if (b.startLineNumber === a.startLineNumber) {
			startLineNumber = b.startLineNumber;
			startColumn = Math.min(b.startColumn, a.startColumn);
		} else {
			startLineNumber = a.startLineNumber;
			startColumn = a.startColumn;
		}

		if (b.endLineNumber > a.endLineNumber) {
			endLineNumber = b.endLineNumber;
			endColumn = b.endColumn;
		} else if (b.endLineNumber === a.endLineNumber) {
			endLineNumber = b.endLineNumber;
			endColumn = Math.max(b.endColumn, a.endColumn);
		} else {
			endLineNumber = a.endLineNumber;
			endColumn = a.endColumn;
		}

		return new Range(startLineNumber, startColumn, endLineNumber, endColumn);
	}

	/**
	 * A intersection of the two ranges.
	 */
	public intersectRanges(range: IRange): Range | null {
		return Range.intersectRanges(this, range);
	}

	/**
	 * A intersection of the two ranges.
	 */
	public static intersectRanges(a: IRange, b: IRange): Range | null {
		let resultStartLineNumber = a.startLineNumber;
		let resultStartColumn = a.startColumn;
		let resultEndLineNumber = a.endLineNumber;
		let resultEndColumn = a.endColumn;
		const otherStartLineNumber = b.startLineNumber;
		const otherStartColumn = b.startColumn;
		const otherEndLineNumber = b.endLineNumber;
		const otherEndColumn = b.endColumn;

		if (resultStartLineNumber < otherStartLineNumber) {
			resultStartLineNumber = otherStartLineNumber;
			resultStartColumn = otherStartColumn;
		} else if (resultStartLineNumber === otherStartLineNumber) {
			resultStartColumn = Math.max(resultStartColumn, otherStartColumn);
		}

		if (resultEndLineNumber > otherEndLineNumber) {
			resultEndLineNumber = otherEndLineNumber;
			resultEndColumn = otherEndColumn;
		} else if (resultEndLineNumber === otherEndLineNumber) {
			resultEndColumn = Math.min(resultEndColumn, otherEndColumn);
		}

		// Check if selection is now empty
		if (resultStartLineNumber > resultEndLineNumber) {
			return null;
		}
		if (resultStartLineNumber === resultEndLineNumber && resultStartColumn > resultEndColumn) {
			return null;
		}
		return new Range(resultStartLineNumber, resultStartColumn, resultEndLineNumber, resultEndColumn);
	}

	/**
	 * Test if this range equals other.
	 */
	public equalsRange(other: IRange | null | undefined): boolean {
		return Range.equalsRange(this, other);
	}

	/**
	 * Test if range `a` equals `b`.
	 */
	public static equalsRange(a: IRange | null | undefined, b: IRange | null | undefined): boolean {
		if (!a && !b) {
			return true;
		}
		return (
			!!a &&
			!!b &&
			a.startLineNumber === b.startLineNumber &&
			a.startColumn === b.startColumn &&
			a.endLineNumber === b.endLineNumber &&
			a.endColumn === b.endColumn
		);
	}

	/**
	 * Return the end position (which will be after or equal to the start position)
	 */
	public getEndPosition(): Position {
		return Range.getEndPosition(this);
	}

	/**
	 * Return the end position (which will be after or equal to the start position)
	 */
	public static getEndPosition(range: IRange): Position {
		return new Position(range.endLineNumber, range.endColumn);
	}

	/**
	 * Return the start position (which will be before or equal to the end position)
	 */
	public getStartPosition(): Position {
		return Range.getStartPosition(this);
	}

	/**
	 * Return the start position (which will be before or equal to the end position)
	 */
	public static getStartPosition(range: IRange): Position {
		return new Position(range.startLineNumber, range.startColumn);
	}

	/**
	 * Transform to a user presentable string representation.
	 */
	public toString(): string {
		return '[' + this.startLineNumber + ',' + this.startColumn + ' -> ' + this.endLineNumber + ',' + this.endColumn + ']';
	}

	/**
	 * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
	 */
	public setEndPosition(endLineNumber: number, endColumn: number): Range {
		return new Range(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
	}

	/**
	 * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
	 */
	public setStartPosition(startLineNumber: number, startColumn: number): Range {
		return new Range(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
	}

	/**
	 * Create a new empty range using this range's start position.
	 */
	public collapseToStart(): Range {
		return Range.collapseToStart(this);
	}

	/**
	 * Create a new empty range using this range's start position.
	 */
	public static collapseToStart(range: IRange): Range {
		return new Range(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn);
	}

	/**
	 * Create a new empty range using this range's end position.
	 */
	public collapseToEnd(): Range {
		return Range.collapseToEnd(this);
	}

	/**
	 * Create a new empty range using this range's end position.
	 */
	public static collapseToEnd(range: IRange): Range {
		return new Range(range.endLineNumber, range.endColumn, range.endLineNumber, range.endColumn);
	}

	/**
	 * Moves the range by the given amount of lines.
	 */
	public delta(lineCount: number): Range {
		return new Range(this.startLineNumber + lineCount, this.startColumn, this.endLineNumber + lineCount, this.endColumn);
	}

	public isSingleLine(): boolean {
		return this.startLineNumber === this.endLineNumber;
	}

	// ---

	public static fromPositions(start: IPosition, end: IPosition = start): Range {
		return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
	}

	/**
	 * Create a `Range` from an `IRange`.
	 */
	public static lift(range: undefined | null): null;
	public static lift(range: IRange): Range;
	public static lift(range: IRange | undefined | null): Range | null;
	public static lift(range: IRange | undefined | null): Range | null {
		if (!range) {
			return null;
		}
		return new Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
	}

	/**
	 * Test if `obj` is an `IRange`.
	 */
	public static isIRange(obj: unknown): obj is IRange {
		return (
			!!obj
			&& (typeof (obj as IRange).startLineNumber === 'number')
			&& (typeof (obj as IRange).startColumn === 'number')
			&& (typeof (obj as IRange).endLineNumber === 'number')
			&& (typeof (obj as IRange).endColumn === 'number')
		);
	}

	/**
	 * Test if the two ranges are touching in any way.
	 */
	public static areIntersectingOrTouching(a: IRange, b: IRange): boolean {
		// Check if `a` is before `b`
		if (a.endLineNumber < b.startLineNumber || (a.endLineNumber === b.startLineNumber && a.endColumn < b.startColumn)) {
			return false;
		}

		// Check if `b` is before `a`
		if (b.endLineNumber < a.startLineNumber || (b.endLineNumber === a.startLineNumber && b.endColumn < a.startColumn)) {
			return false;
		}

		// These ranges must intersect
		return true;
	}

	/**
	 * Test if the two ranges are intersecting. If the ranges are touching it returns true.
	 */
	public static areIntersecting(a: IRange, b: IRange): boolean {
		// Check if `a` is before `b`
		if (a.endLineNumber < b.startLineNumber || (a.endLineNumber === b.startLineNumber && a.endColumn <= b.startColumn)) {
			return false;
		}

		// Check if `b` is before `a`
		if (b.endLineNumber < a.startLineNumber || (b.endLineNumber === a.startLineNumber && b.endColumn <= a.startColumn)) {
			return false;
		}

		// These ranges must intersect
		return true;
	}

	/**
	 * Test if the two ranges are intersecting, but not touching at all.
	 */
	public static areOnlyIntersecting(a: IRange, b: IRange): boolean {
		// Check if `a` is before `b`
		if (a.endLineNumber < (b.startLineNumber - 1) || (a.endLineNumber === b.startLineNumber && a.endColumn < (b.startColumn - 1))) {
			return false;
		}

		// Check if `b` is before `a`
		if (b.endLineNumber < (a.startLineNumber - 1) || (b.endLineNumber === a.startLineNumber && b.endColumn < (a.startColumn - 1))) {
			return false;
		}

		// These ranges must intersect
		return true;
	}

	/**
	 * A function that compares ranges, useful for sorting ranges
	 * It will first compare ranges on the startPosition and then on the endPosition
	 */
	public static compareRangesUsingStarts(a: IRange | null | undefined, b: IRange | null | undefined): number {
		if (a && b) {
			const aStartLineNumber = a.startLineNumber | 0;
			const bStartLineNumber = b.startLineNumber | 0;

			if (aStartLineNumber === bStartLineNumber) {
				const aStartColumn = a.startColumn | 0;
				const bStartColumn = b.startColumn | 0;

				if (aStartColumn === bStartColumn) {
					const aEndLineNumber = a.endLineNumber | 0;
					const bEndLineNumber = b.endLineNumber | 0;

					if (aEndLineNumber === bEndLineNumber) {
						const aEndColumn = a.endColumn | 0;
						const bEndColumn = b.endColumn | 0;
						return aEndColumn - bEndColumn;
					}
					return aEndLineNumber - bEndLineNumber;
				}
				return aStartColumn - bStartColumn;
			}
			return aStartLineNumber - bStartLineNumber;
		}
		const aExists = (a ? 1 : 0);
		const bExists = (b ? 1 : 0);
		return aExists - bExists;
	}

	/**
	 * A function that compares ranges, useful for sorting ranges
	 * It will first compare ranges on the endPosition and then on the startPosition
	 */
	public static compareRangesUsingEnds(a: IRange, b: IRange): number {
		if (a.endLineNumber === b.endLineNumber) {
			if (a.endColumn === b.endColumn) {
				if (a.startLineNumber === b.startLineNumber) {
					return a.startColumn - b.startColumn;
				}
				return a.startLineNumber - b.startLineNumber;
			}
			return a.endColumn - b.endColumn;
		}
		return a.endLineNumber - b.endLineNumber;
	}

	/**
	 * Test if the range spans multiple lines.
	 */
	public static spansMultipleLines(range: IRange): boolean {
		return range.endLineNumber > range.startLineNumber;
	}

	public toJSON(): IRange {
		return this;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/selection.ts]---
Location: vscode-main/src/vs/editor/common/core/selection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPosition, Position } from './position.js';
import { Range } from './range.js';

/**
 * A selection in the editor.
 * The selection is a range that has an orientation.
 */
export interface ISelection {
	/**
	 * The line number on which the selection has started.
	 */
	readonly selectionStartLineNumber: number;
	/**
	 * The column on `selectionStartLineNumber` where the selection has started.
	 */
	readonly selectionStartColumn: number;
	/**
	 * The line number on which the selection has ended.
	 */
	readonly positionLineNumber: number;
	/**
	 * The column on `positionLineNumber` where the selection has ended.
	 */
	readonly positionColumn: number;
}

/**
 * The direction of a selection.
 */
export const enum SelectionDirection {
	/**
	 * The selection starts above where it ends.
	 */
	LTR,
	/**
	 * The selection starts below where it ends.
	 */
	RTL
}

/**
 * A selection in the editor.
 * The selection is a range that has an orientation.
 */
export class Selection extends Range {
	/**
	 * The line number on which the selection has started.
	 */
	public readonly selectionStartLineNumber: number;
	/**
	 * The column on `selectionStartLineNumber` where the selection has started.
	 */
	public readonly selectionStartColumn: number;
	/**
	 * The line number on which the selection has ended.
	 */
	public readonly positionLineNumber: number;
	/**
	 * The column on `positionLineNumber` where the selection has ended.
	 */
	public readonly positionColumn: number;

	constructor(selectionStartLineNumber: number, selectionStartColumn: number, positionLineNumber: number, positionColumn: number) {
		super(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn);
		this.selectionStartLineNumber = selectionStartLineNumber;
		this.selectionStartColumn = selectionStartColumn;
		this.positionLineNumber = positionLineNumber;
		this.positionColumn = positionColumn;
	}

	/**
	 * Transform to a human-readable representation.
	 */
	public override toString(): string {
		return '[' + this.selectionStartLineNumber + ',' + this.selectionStartColumn + ' -> ' + this.positionLineNumber + ',' + this.positionColumn + ']';
	}

	/**
	 * Test if equals other selection.
	 */
	public equalsSelection(other: ISelection): boolean {
		return (
			Selection.selectionsEqual(this, other)
		);
	}

	/**
	 * Test if the two selections are equal.
	 */
	public static selectionsEqual(a: ISelection, b: ISelection): boolean {
		return (
			a.selectionStartLineNumber === b.selectionStartLineNumber &&
			a.selectionStartColumn === b.selectionStartColumn &&
			a.positionLineNumber === b.positionLineNumber &&
			a.positionColumn === b.positionColumn
		);
	}

	/**
	 * Get directions (LTR or RTL).
	 */
	public getDirection(): SelectionDirection {
		if (this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn) {
			return SelectionDirection.LTR;
		}
		return SelectionDirection.RTL;
	}

	/**
	 * Create a new selection with a different `positionLineNumber` and `positionColumn`.
	 */
	public override setEndPosition(endLineNumber: number, endColumn: number): Selection {
		if (this.getDirection() === SelectionDirection.LTR) {
			return new Selection(this.startLineNumber, this.startColumn, endLineNumber, endColumn);
		}
		return new Selection(endLineNumber, endColumn, this.startLineNumber, this.startColumn);
	}

	/**
	 * Get the position at `positionLineNumber` and `positionColumn`.
	 */
	public getPosition(): Position {
		return new Position(this.positionLineNumber, this.positionColumn);
	}

	/**
	 * Get the position at the start of the selection.
	*/
	public getSelectionStart(): Position {
		return new Position(this.selectionStartLineNumber, this.selectionStartColumn);
	}

	/**
	 * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
	 */
	public override setStartPosition(startLineNumber: number, startColumn: number): Selection {
		if (this.getDirection() === SelectionDirection.LTR) {
			return new Selection(startLineNumber, startColumn, this.endLineNumber, this.endColumn);
		}
		return new Selection(this.endLineNumber, this.endColumn, startLineNumber, startColumn);
	}

	// ----

	/**
	 * Create a `Selection` from one or two positions
	 */
	public static override fromPositions(start: IPosition, end: IPosition = start): Selection {
		return new Selection(start.lineNumber, start.column, end.lineNumber, end.column);
	}

	/**
	 * Creates a `Selection` from a range, given a direction.
	 */
	public static fromRange(range: Range, direction: SelectionDirection): Selection {
		if (direction === SelectionDirection.LTR) {
			return new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
		} else {
			return new Selection(range.endLineNumber, range.endColumn, range.startLineNumber, range.startColumn);
		}
	}

	/**
	 * Create a `Selection` from an `ISelection`.
	 */
	public static liftSelection(sel: ISelection): Selection {
		return new Selection(sel.selectionStartLineNumber, sel.selectionStartColumn, sel.positionLineNumber, sel.positionColumn);
	}

	/**
	 * `a` equals `b`.
	 */
	public static selectionsArrEqual(a: ISelection[], b: ISelection[]): boolean {
		if (a && !b || !a && b) {
			return false;
		}
		if (!a && !b) {
			return true;
		}
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0, len = a.length; i < len; i++) {
			if (!this.selectionsEqual(a[i], b[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Test if `obj` is an `ISelection`.
	 */
	public static isISelection(obj: unknown): obj is ISelection {
		return (
			!!obj
			&& (typeof (obj as ISelection).selectionStartLineNumber === 'number')
			&& (typeof (obj as ISelection).selectionStartColumn === 'number')
			&& (typeof (obj as ISelection).positionLineNumber === 'number')
			&& (typeof (obj as ISelection).positionColumn === 'number')
		);
	}

	/**
	 * Create with a direction.
	 */
	public static createWithDirection(startLineNumber: number, startColumn: number, endLineNumber: number, endColumn: number, direction: SelectionDirection): Selection {

		if (direction === SelectionDirection.LTR) {
			return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
		}

		return new Selection(endLineNumber, endColumn, startLineNumber, startColumn);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/stringBuilder.ts]---
Location: vscode-main/src/vs/editor/common/core/stringBuilder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../base/common/strings.js';
import * as platform from '../../../base/common/platform.js';
import * as buffer from '../../../base/common/buffer.js';

let _utf16LE_TextDecoder: TextDecoder | null;
function getUTF16LE_TextDecoder(): TextDecoder {
	if (!_utf16LE_TextDecoder) {
		_utf16LE_TextDecoder = new TextDecoder('UTF-16LE');
	}
	return _utf16LE_TextDecoder;
}

let _utf16BE_TextDecoder: TextDecoder | null;
function getUTF16BE_TextDecoder(): TextDecoder {
	if (!_utf16BE_TextDecoder) {
		_utf16BE_TextDecoder = new TextDecoder('UTF-16BE');
	}
	return _utf16BE_TextDecoder;
}

let _platformTextDecoder: TextDecoder | null;
export function getPlatformTextDecoder(): TextDecoder {
	if (!_platformTextDecoder) {
		_platformTextDecoder = platform.isLittleEndian() ? getUTF16LE_TextDecoder() : getUTF16BE_TextDecoder();
	}
	return _platformTextDecoder;
}

export function decodeUTF16LE(source: Uint8Array, offset: number, len: number): string {
	const view = new Uint16Array(source.buffer, offset, len);
	if (len > 0 && (view[0] === 0xFEFF || view[0] === 0xFFFE)) {
		// UTF16 sometimes starts with a BOM https://de.wikipedia.org/wiki/Byte_Order_Mark
		// It looks like TextDecoder.decode will eat up a leading BOM (0xFEFF or 0xFFFE)
		// We don't want that behavior because we know the string is UTF16LE and the BOM should be maintained
		// So we use the manual decoder
		return compatDecodeUTF16LE(source, offset, len);
	}
	return getUTF16LE_TextDecoder().decode(view);
}

function compatDecodeUTF16LE(source: Uint8Array, offset: number, len: number): string {
	const result: string[] = [];
	let resultLen = 0;
	for (let i = 0; i < len; i++) {
		const charCode = buffer.readUInt16LE(source, offset); offset += 2;
		result[resultLen++] = String.fromCharCode(charCode);
	}
	return result.join('');
}

export class StringBuilder {

	private readonly _capacity: number;
	private readonly _buffer: Uint16Array;

	private _completedStrings: string[] | null;
	private _bufferLength: number;

	constructor(capacity: number) {
		this._capacity = capacity | 0;
		this._buffer = new Uint16Array(this._capacity);

		this._completedStrings = null;
		this._bufferLength = 0;
	}

	public reset(): void {
		this._completedStrings = null;
		this._bufferLength = 0;
	}

	public build(): string {
		if (this._completedStrings !== null) {
			this._flushBuffer();
			return this._completedStrings.join('');
		}
		return this._buildBuffer();
	}

	private _buildBuffer(): string {
		if (this._bufferLength === 0) {
			return '';
		}

		const view = new Uint16Array(this._buffer.buffer, 0, this._bufferLength);
		return getPlatformTextDecoder().decode(view);
	}

	private _flushBuffer(): void {
		const bufferString = this._buildBuffer();
		this._bufferLength = 0;

		if (this._completedStrings === null) {
			this._completedStrings = [bufferString];
		} else {
			this._completedStrings[this._completedStrings.length] = bufferString;
		}
	}

	/**
	 * Append a char code (<2^16)
	 */
	public appendCharCode(charCode: number): void {
		const remainingSpace = this._capacity - this._bufferLength;

		if (remainingSpace <= 1) {
			if (remainingSpace === 0 || strings.isHighSurrogate(charCode)) {
				this._flushBuffer();
			}
		}

		this._buffer[this._bufferLength++] = charCode;
	}

	/**
	 * Append an ASCII char code (<2^8)
	 */
	public appendASCIICharCode(charCode: number): void {
		if (this._bufferLength === this._capacity) {
			// buffer is full
			this._flushBuffer();
		}
		this._buffer[this._bufferLength++] = charCode;
	}

	public appendString(str: string): void {
		const strLen = str.length;

		if (this._bufferLength + strLen >= this._capacity) {
			// This string does not fit in the remaining buffer space

			this._flushBuffer();
			this._completedStrings![this._completedStrings!.length] = str;
			return;
		}

		for (let i = 0; i < strLen; i++) {
			this._buffer[this._bufferLength++] = str.charCodeAt(i);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/textChange.ts]---
Location: vscode-main/src/vs/editor/common/core/textChange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as buffer from '../../../base/common/buffer.js';
import { decodeUTF16LE } from './stringBuilder.js';

function escapeNewLine(str: string): string {
	return (
		str
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
	);
}

export class TextChange {

	public get oldLength(): number {
		return this.oldText.length;
	}

	public get oldEnd(): number {
		return this.oldPosition + this.oldText.length;
	}

	public get newLength(): number {
		return this.newText.length;
	}

	public get newEnd(): number {
		return this.newPosition + this.newText.length;
	}

	constructor(
		public readonly oldPosition: number,
		public readonly oldText: string,
		public readonly newPosition: number,
		public readonly newText: string
	) { }

	public toString(): string {
		if (this.oldText.length === 0) {
			return `(insert@${this.oldPosition} "${escapeNewLine(this.newText)}")`;
		}
		if (this.newText.length === 0) {
			return `(delete@${this.oldPosition} "${escapeNewLine(this.oldText)}")`;
		}
		return `(replace@${this.oldPosition} "${escapeNewLine(this.oldText)}" with "${escapeNewLine(this.newText)}")`;
	}

	private static _writeStringSize(str: string): number {
		return (
			4 + 2 * str.length
		);
	}

	private static _writeString(b: Uint8Array, str: string, offset: number): number {
		const len = str.length;
		buffer.writeUInt32BE(b, len, offset); offset += 4;
		for (let i = 0; i < len; i++) {
			buffer.writeUInt16LE(b, str.charCodeAt(i), offset); offset += 2;
		}
		return offset;
	}

	private static _readString(b: Uint8Array, offset: number): string {
		const len = buffer.readUInt32BE(b, offset); offset += 4;
		return decodeUTF16LE(b, offset, len);
	}

	public writeSize(): number {
		return (
			+ 4 // oldPosition
			+ 4 // newPosition
			+ TextChange._writeStringSize(this.oldText)
			+ TextChange._writeStringSize(this.newText)
		);
	}

	public write(b: Uint8Array, offset: number): number {
		buffer.writeUInt32BE(b, this.oldPosition, offset); offset += 4;
		buffer.writeUInt32BE(b, this.newPosition, offset); offset += 4;
		offset = TextChange._writeString(b, this.oldText, offset);
		offset = TextChange._writeString(b, this.newText, offset);
		return offset;
	}

	public static read(b: Uint8Array, offset: number, dest: TextChange[]): number {
		const oldPosition = buffer.readUInt32BE(b, offset); offset += 4;
		const newPosition = buffer.readUInt32BE(b, offset); offset += 4;
		const oldText = TextChange._readString(b, offset); offset += TextChange._writeStringSize(oldText);
		const newText = TextChange._readString(b, offset); offset += TextChange._writeStringSize(newText);
		dest.push(new TextChange(oldPosition, oldText, newPosition, newText));
		return offset;
	}
}

export function compressConsecutiveTextChanges(prevEdits: TextChange[] | null, currEdits: TextChange[]): TextChange[] {
	if (prevEdits === null || prevEdits.length === 0) {
		return currEdits;
	}
	const compressor = new TextChangeCompressor(prevEdits, currEdits);
	return compressor.compress();
}

class TextChangeCompressor {

	private _prevEdits: TextChange[];
	private _currEdits: TextChange[];

	private _result: TextChange[];
	private _resultLen: number;

	private _prevLen: number;
	private _prevDeltaOffset: number;

	private _currLen: number;
	private _currDeltaOffset: number;

	constructor(prevEdits: TextChange[], currEdits: TextChange[]) {
		this._prevEdits = prevEdits;
		this._currEdits = currEdits;

		this._result = [];
		this._resultLen = 0;

		this._prevLen = this._prevEdits.length;
		this._prevDeltaOffset = 0;

		this._currLen = this._currEdits.length;
		this._currDeltaOffset = 0;
	}

	public compress(): TextChange[] {
		let prevIndex = 0;
		let currIndex = 0;

		let prevEdit = this._getPrev(prevIndex);
		let currEdit = this._getCurr(currIndex);

		while (prevIndex < this._prevLen || currIndex < this._currLen) {

			if (prevEdit === null) {
				this._acceptCurr(currEdit!);
				currEdit = this._getCurr(++currIndex);
				continue;
			}

			if (currEdit === null) {
				this._acceptPrev(prevEdit);
				prevEdit = this._getPrev(++prevIndex);
				continue;
			}

			if (currEdit.oldEnd <= prevEdit.newPosition) {
				this._acceptCurr(currEdit);
				currEdit = this._getCurr(++currIndex);
				continue;
			}

			if (prevEdit.newEnd <= currEdit.oldPosition) {
				this._acceptPrev(prevEdit);
				prevEdit = this._getPrev(++prevIndex);
				continue;
			}

			if (currEdit.oldPosition < prevEdit.newPosition) {
				const [e1, e2] = TextChangeCompressor._splitCurr(currEdit, prevEdit.newPosition - currEdit.oldPosition);
				this._acceptCurr(e1);
				currEdit = e2;
				continue;
			}

			if (prevEdit.newPosition < currEdit.oldPosition) {
				const [e1, e2] = TextChangeCompressor._splitPrev(prevEdit, currEdit.oldPosition - prevEdit.newPosition);
				this._acceptPrev(e1);
				prevEdit = e2;
				continue;
			}

			// At this point, currEdit.oldPosition === prevEdit.newPosition

			let mergePrev: TextChange;
			let mergeCurr: TextChange;

			if (currEdit.oldEnd === prevEdit.newEnd) {
				mergePrev = prevEdit;
				mergeCurr = currEdit;
				prevEdit = this._getPrev(++prevIndex);
				currEdit = this._getCurr(++currIndex);
			} else if (currEdit.oldEnd < prevEdit.newEnd) {
				const [e1, e2] = TextChangeCompressor._splitPrev(prevEdit, currEdit.oldLength);
				mergePrev = e1;
				mergeCurr = currEdit;
				prevEdit = e2;
				currEdit = this._getCurr(++currIndex);
			} else {
				const [e1, e2] = TextChangeCompressor._splitCurr(currEdit, prevEdit.newLength);
				mergePrev = prevEdit;
				mergeCurr = e1;
				prevEdit = this._getPrev(++prevIndex);
				currEdit = e2;
			}

			this._result[this._resultLen++] = new TextChange(
				mergePrev.oldPosition,
				mergePrev.oldText,
				mergeCurr.newPosition,
				mergeCurr.newText
			);
			this._prevDeltaOffset += mergePrev.newLength - mergePrev.oldLength;
			this._currDeltaOffset += mergeCurr.newLength - mergeCurr.oldLength;
		}

		const merged = TextChangeCompressor._merge(this._result);
		const cleaned = TextChangeCompressor._removeNoOps(merged);
		return cleaned;
	}

	private _acceptCurr(currEdit: TextChange): void {
		this._result[this._resultLen++] = TextChangeCompressor._rebaseCurr(this._prevDeltaOffset, currEdit);
		this._currDeltaOffset += currEdit.newLength - currEdit.oldLength;
	}

	private _getCurr(currIndex: number): TextChange | null {
		return (currIndex < this._currLen ? this._currEdits[currIndex] : null);
	}

	private _acceptPrev(prevEdit: TextChange): void {
		this._result[this._resultLen++] = TextChangeCompressor._rebasePrev(this._currDeltaOffset, prevEdit);
		this._prevDeltaOffset += prevEdit.newLength - prevEdit.oldLength;
	}

	private _getPrev(prevIndex: number): TextChange | null {
		return (prevIndex < this._prevLen ? this._prevEdits[prevIndex] : null);
	}

	private static _rebaseCurr(prevDeltaOffset: number, currEdit: TextChange): TextChange {
		return new TextChange(
			currEdit.oldPosition - prevDeltaOffset,
			currEdit.oldText,
			currEdit.newPosition,
			currEdit.newText
		);
	}

	private static _rebasePrev(currDeltaOffset: number, prevEdit: TextChange): TextChange {
		return new TextChange(
			prevEdit.oldPosition,
			prevEdit.oldText,
			prevEdit.newPosition + currDeltaOffset,
			prevEdit.newText
		);
	}

	private static _splitPrev(edit: TextChange, offset: number): [TextChange, TextChange] {
		const preText = edit.newText.substr(0, offset);
		const postText = edit.newText.substr(offset);

		return [
			new TextChange(
				edit.oldPosition,
				edit.oldText,
				edit.newPosition,
				preText
			),
			new TextChange(
				edit.oldEnd,
				'',
				edit.newPosition + offset,
				postText
			)
		];
	}

	private static _splitCurr(edit: TextChange, offset: number): [TextChange, TextChange] {
		const preText = edit.oldText.substr(0, offset);
		const postText = edit.oldText.substr(offset);

		return [
			new TextChange(
				edit.oldPosition,
				preText,
				edit.newPosition,
				edit.newText
			),
			new TextChange(
				edit.oldPosition + offset,
				postText,
				edit.newEnd,
				''
			)
		];
	}

	private static _merge(edits: TextChange[]): TextChange[] {
		if (edits.length === 0) {
			return edits;
		}

		const result: TextChange[] = [];
		let resultLen = 0;

		let prev = edits[0];
		for (let i = 1; i < edits.length; i++) {
			const curr = edits[i];

			if (prev.oldEnd === curr.oldPosition) {
				// Merge into `prev`
				prev = new TextChange(
					prev.oldPosition,
					prev.oldText + curr.oldText,
					prev.newPosition,
					prev.newText + curr.newText
				);
			} else {
				result[resultLen++] = prev;
				prev = curr;
			}
		}
		result[resultLen++] = prev;

		return result;
	}

	private static _removeNoOps(edits: TextChange[]): TextChange[] {
		if (edits.length === 0) {
			return edits;
		}

		const result: TextChange[] = [];
		let resultLen = 0;

		for (let i = 0; i < edits.length; i++) {
			const edit = edits[i];

			if (edit.oldText === edit.newText) {
				continue;
			}
			result[resultLen++] = edit;
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/wordCharacterClassifier.ts]---
Location: vscode-main/src/vs/editor/common/core/wordCharacterClassifier.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode.js';
import { safeIntl } from '../../../base/common/date.js';
import { Lazy } from '../../../base/common/lazy.js';
import { LRUCache } from '../../../base/common/map.js';
import { CharacterClassifier } from './characterClassifier.js';

export const enum WordCharacterClass {
	Regular = 0,
	Whitespace = 1,
	WordSeparator = 2
}

export class WordCharacterClassifier extends CharacterClassifier<WordCharacterClass> {

	public readonly intlSegmenterLocales: Intl.UnicodeBCP47LocaleIdentifier[];
	private readonly _segmenter: Lazy<Intl.Segmenter> | null = null;
	private _cachedLine: string | null = null;
	private _cachedSegments: IntlWordSegmentData[] = [];

	constructor(wordSeparators: string, intlSegmenterLocales: Intl.UnicodeBCP47LocaleIdentifier[]) {
		super(WordCharacterClass.Regular);
		this.intlSegmenterLocales = intlSegmenterLocales;
		if (this.intlSegmenterLocales.length > 0) {
			this._segmenter = safeIntl.Segmenter(this.intlSegmenterLocales, { granularity: 'word' });
		} else {
			this._segmenter = null;
		}

		for (let i = 0, len = wordSeparators.length; i < len; i++) {
			this.set(wordSeparators.charCodeAt(i), WordCharacterClass.WordSeparator);
		}

		this.set(CharCode.Space, WordCharacterClass.Whitespace);
		this.set(CharCode.Tab, WordCharacterClass.Whitespace);
	}

	public findPrevIntlWordBeforeOrAtOffset(line: string, offset: number): IntlWordSegmentData | null {
		let candidate: IntlWordSegmentData | null = null;
		for (const segment of this._getIntlSegmenterWordsOnLine(line)) {
			if (segment.index > offset) {
				break;
			}
			candidate = segment;
		}
		return candidate;
	}

	public findNextIntlWordAtOrAfterOffset(lineContent: string, offset: number): IntlWordSegmentData | null {
		for (const segment of this._getIntlSegmenterWordsOnLine(lineContent)) {
			if (segment.index < offset) {
				continue;
			}
			return segment;
		}
		return null;
	}

	private _getIntlSegmenterWordsOnLine(line: string): IntlWordSegmentData[] {
		if (!this._segmenter) {
			return [];
		}

		// Check if the line has changed from the previous call
		if (this._cachedLine === line) {
			return this._cachedSegments;
		}

		// Update the cache with the new line
		this._cachedLine = line;
		this._cachedSegments = this._filterWordSegments(this._segmenter.value.segment(line));

		return this._cachedSegments;
	}

	private _filterWordSegments(segments: Intl.Segments): IntlWordSegmentData[] {
		const result: IntlWordSegmentData[] = [];
		for (const segment of segments) {
			if (this._isWordLike(segment)) {
				result.push(segment);
			}
		}
		return result;
	}

	private _isWordLike(segment: Intl.SegmentData): segment is IntlWordSegmentData {
		if (segment.isWordLike) {
			return true;
		}
		return false;
	}
}

export interface IntlWordSegmentData extends Intl.SegmentData {
	isWordLike: true;
}

const wordClassifierCache = new LRUCache<string, WordCharacterClassifier>(10);

export function getMapForWordSeparators(wordSeparators: string, intlSegmenterLocales: Intl.UnicodeBCP47LocaleIdentifier[]): WordCharacterClassifier {
	const key = `${wordSeparators}/${intlSegmenterLocales.join(',')}`;
	let result = wordClassifierCache.get(key)!;
	if (!result) {
		result = new WordCharacterClassifier(wordSeparators, intlSegmenterLocales);
		wordClassifierCache.set(key, result);
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/wordHelper.ts]---
Location: vscode-main/src/vs/editor/common/core/wordHelper.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Iterable } from '../../../base/common/iterator.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import { LinkedList } from '../../../base/common/linkedList.js';

export const USUAL_WORD_SEPARATORS = '`~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?';

/**
 * Word inside a model.
 */
export interface IWordAtPosition {
	/**
	 * The word.
	 */
	readonly word: string;
	/**
	 * The column where the word starts.
	 */
	readonly startColumn: number;
	/**
	 * The column where the word ends.
	 */
	readonly endColumn: number;
}

/**
 * Create a word definition regular expression based on default word separators.
 * Optionally provide allowed separators that should be included in words.
 *
 * The default would look like this:
 * /(-?\d*\.\d\w*)|([^\`\~\!\@\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
 */
function createWordRegExp(allowInWords: string = ''): RegExp {
	let source = '(-?\\d*\\.\\d\\w*)|([^';
	for (const sep of USUAL_WORD_SEPARATORS) {
		if (allowInWords.indexOf(sep) >= 0) {
			continue;
		}
		source += '\\' + sep;
	}
	source += '\\s]+)';
	return new RegExp(source, 'g');
}

// catches numbers (including floating numbers) in the first group, and alphanum in the second
export const DEFAULT_WORD_REGEXP = createWordRegExp();

export function ensureValidWordDefinition(wordDefinition?: RegExp | null): RegExp {
	let result: RegExp = DEFAULT_WORD_REGEXP;

	if (wordDefinition && (wordDefinition instanceof RegExp)) {
		if (!wordDefinition.global) {
			let flags = 'g';
			if (wordDefinition.ignoreCase) {
				flags += 'i';
			}
			if (wordDefinition.multiline) {
				flags += 'm';
			}
			if (wordDefinition.unicode) {
				flags += 'u';
			}
			result = new RegExp(wordDefinition.source, flags);
		} else {
			result = wordDefinition;
		}
	}

	result.lastIndex = 0;

	return result;
}


export interface IGetWordAtTextConfig {
	maxLen: number;
	windowSize: number;
	timeBudget: number;
}


const _defaultConfig = new LinkedList<IGetWordAtTextConfig>();
_defaultConfig.unshift({
	maxLen: 1000,
	windowSize: 15,
	timeBudget: 150
});

export function setDefaultGetWordAtTextConfig(value: IGetWordAtTextConfig) {
	const rm = _defaultConfig.unshift(value);
	return toDisposable(rm);
}

export function getWordAtText(column: number, wordDefinition: RegExp, text: string, textOffset: number, config?: IGetWordAtTextConfig): IWordAtPosition | null {
	// Ensure the regex has the 'g' flag, otherwise this will loop forever
	wordDefinition = ensureValidWordDefinition(wordDefinition);

	if (!config) {
		config = Iterable.first(_defaultConfig)!;
	}

	if (text.length > config.maxLen) {
		// don't throw strings that long at the regexp
		// but use a sub-string in which a word must occur
		let start = column - config.maxLen / 2;
		if (start < 0) {
			start = 0;
		} else {
			textOffset += start;
		}
		text = text.substring(start, column + config.maxLen / 2);
		return getWordAtText(column, wordDefinition, text, textOffset, config);
	}

	const t1 = Date.now();
	const pos = column - 1 - textOffset;

	let prevRegexIndex = -1;
	let match: RegExpExecArray | null = null;

	for (let i = 1; ; i++) {
		// check time budget
		if (Date.now() - t1 >= config.timeBudget) {
			break;
		}

		// reset the index at which the regexp should start matching, also know where it
		// should stop so that subsequent search don't repeat previous searches
		const regexIndex = pos - config.windowSize * i;
		wordDefinition.lastIndex = Math.max(0, regexIndex);
		const thisMatch = _findRegexMatchEnclosingPosition(wordDefinition, text, pos, prevRegexIndex);

		if (!thisMatch && match) {
			// stop: we have something
			break;
		}

		match = thisMatch;

		// stop: searched at start
		if (regexIndex <= 0) {
			break;
		}
		prevRegexIndex = regexIndex;
	}

	if (match) {
		const result = {
			word: match[0],
			startColumn: textOffset + 1 + match.index,
			endColumn: textOffset + 1 + match.index + match[0].length
		};
		wordDefinition.lastIndex = 0;
		return result;
	}

	return null;
}

function _findRegexMatchEnclosingPosition(wordDefinition: RegExp, text: string, pos: number, stopPos: number): RegExpExecArray | null {
	let match: RegExpExecArray | null;
	while (match = wordDefinition.exec(text)) {
		const matchIndex = match.index || 0;
		if (matchIndex <= pos && wordDefinition.lastIndex >= pos) {
			return match;
		} else if (stopPos > 0 && matchIndex > stopPos) {
			return null;
		}
	}
	return null;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/2d/dimension.ts]---
Location: vscode-main/src/vs/editor/common/core/2d/dimension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IDimension {
	width: number;
	height: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/2d/point.ts]---
Location: vscode-main/src/vs/editor/common/core/2d/point.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Point {
	static equals(a: Point, b: Point): boolean {
		return a.x === b.x && a.y === b.y;
	}

	constructor(
		public readonly x: number,
		public readonly y: number,
	) { }

	public add(other: Point): Point {
		return new Point(this.x + other.x, this.y + other.y);
	}

	public deltaX(delta: number): Point {
		return new Point(this.x + delta, this.y);
	}

	public deltaY(delta: number): Point {
		return new Point(this.x, this.y + delta);
	}

	public toString() {
		return `(${this.x},${this.y})`;
	}

	public subtract(other: Point): Point {
		return new Point(this.x - other.x, this.y - other.y);
	}

	public scale(factor: number): Point {
		return new Point(this.x * factor, this.y * factor);
	}

	public mapComponents(map: (value: number) => number): Point {
		return new Point(map(this.x), map(this.y));
	}

	public isZero(): boolean {
		return this.x === 0 && this.y === 0;
	}

	public withThreshold(threshold: number): Point {
		return this.mapComponents(axisVal => {
			if (axisVal > threshold) {
				return axisVal - threshold;
			} else if (axisVal < -threshold) {
				return axisVal + threshold;
			}
			return 0;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/2d/rect.ts]---
Location: vscode-main/src/vs/editor/common/core/2d/rect.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { OffsetRange } from '../ranges/offsetRange.js';
import { Point } from './point.js';
import { Size2D } from './size.js';

export class Rect {
	public static fromPoint(point: Point): Rect {
		return new Rect(point.x, point.y, point.x, point.y);
	}

	public static fromPoints(topLeft: Point, bottomRight: Point): Rect {
		return new Rect(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
	}

	public static fromPointSize(point: Point, size: Point): Rect {
		return new Rect(point.x, point.y, point.x + size.x, point.y + size.y);
	}

	public static fromLeftTopRightBottom(left: number, top: number, right: number, bottom: number): Rect {
		return new Rect(left, top, right, bottom);
	}

	public static fromLeftTopWidthHeight(left: number, top: number, width: number, height: number): Rect {
		return new Rect(left, top, left + width, top + height);
	}

	public static fromRanges(leftRight: OffsetRange, topBottom: OffsetRange): Rect {
		return new Rect(leftRight.start, topBottom.start, leftRight.endExclusive, topBottom.endExclusive);
	}

	public static hull(rects: Rect[]): Rect {
		let left = Number.MAX_SAFE_INTEGER;
		let top = Number.MAX_SAFE_INTEGER;
		let right = Number.MIN_SAFE_INTEGER;
		let bottom = Number.MIN_SAFE_INTEGER;

		for (const rect of rects) {
			left = Math.min(left, rect.left);
			top = Math.min(top, rect.top);
			right = Math.max(right, rect.right);
			bottom = Math.max(bottom, rect.bottom);
		}

		return new Rect(left, top, right, bottom);
	}

	public get width() { return this.right - this.left; }
	public get height() { return this.bottom - this.top; }

	constructor(
		public readonly left: number,
		public readonly top: number,
		public readonly right: number,
		public readonly bottom: number,
	) {
		if (left > right) {
			throw new BugIndicatingError('Invalid arguments: Horizontally offset by ' + (left - right));
		}
		if (top > bottom) {
			throw new BugIndicatingError('Invalid arguments: Vertically offset by ' + (top - bottom));
		}
	}

	withMargin(margin: number): Rect;
	withMargin(marginVertical: number, marginHorizontal: number): Rect;
	withMargin(marginTop: number, marginRight: number, marginBottom: number, marginLeft: number): Rect;
	withMargin(marginOrVerticalOrTop: number, rightOrHorizontal?: number, bottom?: number, left?: number): Rect {
		let marginLeft, marginRight, marginTop, marginBottom;

		// Single margin value
		if (rightOrHorizontal === undefined && bottom === undefined && left === undefined) {
			marginLeft = marginRight = marginTop = marginBottom = marginOrVerticalOrTop;
		}
		// Vertical and horizontal margins
		else if (bottom === undefined && left === undefined) {
			marginLeft = marginRight = rightOrHorizontal!;
			marginTop = marginBottom = marginOrVerticalOrTop;
		}
		// Individual margins for all sides
		else {
			marginLeft = left!;
			marginRight = rightOrHorizontal!;
			marginTop = marginOrVerticalOrTop;
			marginBottom = bottom!;
		}

		return new Rect(
			this.left - marginLeft,
			this.top - marginTop,
			this.right + marginRight,
			this.bottom + marginBottom,
		);
	}

	intersectVertical(range: OffsetRange): Rect {
		const newTop = Math.max(this.top, range.start);
		const newBottom = Math.min(this.bottom, range.endExclusive);
		return new Rect(
			this.left,
			newTop,
			this.right,
			Math.max(newTop, newBottom),
		);
	}

	intersectHorizontal(range: OffsetRange): Rect {
		const newLeft = Math.max(this.left, range.start);
		const newRight = Math.min(this.right, range.endExclusive);
		return new Rect(
			newLeft,
			this.top,
			Math.max(newLeft, newRight),
			this.bottom,
		);
	}

	toString(): string {
		return `Rect{(${this.left},${this.top}), (${this.right},${this.bottom})}`;
	}

	intersect(parent: Rect): Rect | undefined {
		const left = Math.max(this.left, parent.left);
		const right = Math.min(this.right, parent.right);
		const top = Math.max(this.top, parent.top);
		const bottom = Math.min(this.bottom, parent.bottom);

		if (left > right || top > bottom) {
			return undefined;
		}

		return new Rect(left, top, right, bottom);
	}

	union(other: Rect): Rect {
		return new Rect(
			Math.min(this.left, other.left),
			Math.min(this.top, other.top),
			Math.max(this.right, other.right),
			Math.max(this.bottom, other.bottom),
		);
	}

	containsRect(other: Rect): boolean {
		return this.left <= other.left
			&& this.top <= other.top
			&& this.right >= other.right
			&& this.bottom >= other.bottom;
	}

	containsPoint(point: Point): boolean {
		return this.left <= point.x
			&& this.top <= point.y
			&& this.right >= point.x
			&& this.bottom >= point.y;
	}

	moveToBeContainedIn(parent: Rect): Rect {
		const width = this.width;
		const height = this.height;

		let left = this.left;
		let top = this.top;

		if (left < parent.left) {
			left = parent.left;
		} else if (left + width > parent.right) {
			left = parent.right - width;
		}

		if (top < parent.top) {
			top = parent.top;
		} else if (top + height > parent.bottom) {
			top = parent.bottom - height;
		}

		return new Rect(left, top, left + width, top + height);
	}

	withWidth(width: number): Rect {
		return new Rect(this.left, this.top, this.left + width, this.bottom);
	}

	withHeight(height: number): Rect {
		return new Rect(this.left, this.top, this.right, this.top + height);
	}

	withTop(top: number): Rect {
		return new Rect(this.left, top, this.right, this.bottom);
	}

	withLeft(left: number): Rect {
		return new Rect(left, this.top, this.right, this.bottom);
	}

	translateX(delta: number): Rect {
		return new Rect(this.left + delta, this.top, this.right + delta, this.bottom);
	}

	translateY(delta: number): Rect {
		return new Rect(this.left, this.top + delta, this.right, this.bottom + delta);
	}

	translate(point: Point): Rect {
		return new Rect(this.left + point.x, this.top + point.y, this.right + point.x, this.bottom + point.y);
	}

	deltaRight(delta: number): Rect {
		return new Rect(this.left, this.top, this.right + delta, this.bottom);
	}

	deltaTop(delta: number): Rect {
		return new Rect(this.left, this.top + delta, this.right, this.bottom);
	}

	deltaLeft(delta: number): Rect {
		return new Rect(this.left + delta, this.top, this.right, this.bottom);
	}

	deltaBottom(delta: number): Rect {
		return new Rect(this.left, this.top, this.right, this.bottom + delta);
	}

	getLeftBottom(): Point {
		return new Point(this.left, this.bottom);
	}

	getRightBottom(): Point {
		return new Point(this.right, this.bottom);
	}

	getLeftTop(): Point {
		return new Point(this.left, this.top);
	}

	getRightTop(): Point {
		return new Point(this.right, this.top);
	}

	toStyles() {
		return {
			position: 'absolute',
			left: `${this.left}px`,
			top: `${this.top}px`,
			width: `${this.width}px`,
			height: `${this.height}px`,
		};
	}

	getHorizontalRange(): OffsetRange {
		return new OffsetRange(this.left, this.right);
	}

	getVerticalRange(): OffsetRange {
		return new OffsetRange(this.top, this.bottom);
	}

	withHorizontalRange(range: OffsetRange): Rect {
		return new Rect(range.start, this.top, range.endExclusive, this.bottom);
	}

	withVerticalRange(range: OffsetRange): Rect {
		return new Rect(this.left, range.start, this.right, range.endExclusive);
	}

	getSize(): Size2D {
		return new Size2D(this.width, this.height);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/2d/size.ts]---
Location: vscode-main/src/vs/editor/common/core/2d/size.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDimension } from './dimension.js';

export class Size2D {
	static equals(a: Size2D, b: Size2D): boolean {
		return a.width === b.width && a.height === b.height;
	}

	constructor(
		public readonly width: number,
		public readonly height: number,
	) { }

	public add(other: Size2D): Size2D {
		return new Size2D(this.width + other.width, this.height + other.height);
	}

	public deltaX(delta: number): Size2D {
		return new Size2D(this.width + delta, this.height);
	}

	public deltaY(delta: number): Size2D {
		return new Size2D(this.width, this.height + delta);
	}

	public toString() {
		return `(${this.width},${this.height})`;
	}

	public subtract(other: Size2D): Size2D {
		return new Size2D(this.width - other.width, this.height - other.height);
	}

	public scale(factor: number): Size2D {
		return new Size2D(this.width * factor, this.height * factor);
	}

	public scaleWidth(factor: number): Size2D {
		return new Size2D(this.width * factor, this.height);
	}

	public mapComponents(map: (value: number) => number): Size2D {
		return new Size2D(map(this.width), map(this.height));
	}

	public isZero(): boolean {
		return this.width === 0 && this.height === 0;
	}

	public transpose(): Size2D {
		return new Size2D(this.height, this.width);
	}

	public toDimension(): IDimension {
		return { width: this.width, height: this.height };
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/arrayEdit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/arrayEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OffsetRange } from '../ranges/offsetRange.js';
import { BaseEdit, BaseReplacement } from './edit.js';

/**
 * Represents a set of replacements to an array.
 * All these replacements are applied at once.
*/
export class ArrayEdit<T> extends BaseEdit<ArrayReplacement<T>, ArrayEdit<T>> {
	public static readonly empty = new ArrayEdit<never>([]);

	public static create<T>(replacements: readonly ArrayReplacement<T>[]): ArrayEdit<T> {
		return new ArrayEdit(replacements);
	}

	public static single<T>(replacement: ArrayReplacement<T>): ArrayEdit<T> {
		return new ArrayEdit([replacement]);
	}

	public static replace<T>(range: OffsetRange, replacement: readonly T[]): ArrayEdit<T> {
		return new ArrayEdit([new ArrayReplacement(range, replacement)]);
	}

	public static insert<T>(offset: number, replacement: readonly T[]): ArrayEdit<T> {
		return new ArrayEdit([new ArrayReplacement(OffsetRange.emptyAt(offset), replacement)]);
	}

	public static delete<T>(range: OffsetRange): ArrayEdit<T> {
		return new ArrayEdit([new ArrayReplacement(range, [])]);
	}

	protected override _createNew(replacements: readonly ArrayReplacement<T>[]): ArrayEdit<T> {
		return new ArrayEdit(replacements);
	}

	public apply(data: readonly T[]): readonly T[] {
		const resultData: T[] = [];
		let pos = 0;
		for (const edit of this.replacements) {
			resultData.push(...data.slice(pos, edit.replaceRange.start));
			resultData.push(...edit.newValue);
			pos = edit.replaceRange.endExclusive;
		}
		resultData.push(...data.slice(pos));
		return resultData;
	}

	/**
	 * Creates an edit that reverts this edit.
	 */
	public inverse(baseVal: readonly T[]): ArrayEdit<T> {
		const edits: ArrayReplacement<T>[] = [];
		let offset = 0;
		for (const e of this.replacements) {
			edits.push(new ArrayReplacement(
				OffsetRange.ofStartAndLength(e.replaceRange.start + offset, e.newValue.length),
				baseVal.slice(e.replaceRange.start, e.replaceRange.endExclusive),
			));
			offset += e.newValue.length - e.replaceRange.length;
		}
		return new ArrayEdit(edits);
	}
}

export class ArrayReplacement<T> extends BaseReplacement<ArrayReplacement<T>> {
	constructor(
		range: OffsetRange,
		public readonly newValue: readonly T[]
	) {
		super(range);
	}

	override equals(other: ArrayReplacement<T>): boolean {
		return this.replaceRange.equals(other.replaceRange) && this.newValue.length === other.newValue.length && this.newValue.every((v, i) => v === other.newValue[i]);
	}

	getNewLength(): number { return this.newValue.length; }

	tryJoinTouching(other: ArrayReplacement<T>): ArrayReplacement<T> | undefined {
		return new ArrayReplacement(this.replaceRange.joinRightTouching(other.replaceRange), this.newValue.concat(other.newValue));
	}

	slice(range: OffsetRange, rangeInReplacement: OffsetRange): ArrayReplacement<T> {
		return new ArrayReplacement(range, rangeInReplacement.slice(this.newValue));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/edit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/edit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sumBy } from '../../../../base/common/arrays.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { OffsetRange } from '../ranges/offsetRange.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseEdit<T extends BaseReplacement<T> = BaseReplacement<any>, TEdit extends BaseEdit<T, TEdit> = BaseEdit<T, any>> {
	constructor(
		public readonly replacements: readonly T[],
	) {
		let lastEndEx = -1;
		for (const replacement of replacements) {
			if (!(replacement.replaceRange.start >= lastEndEx)) {
				throw new BugIndicatingError(`Edits must be disjoint and sorted. Found ${replacement} after ${lastEndEx}`);
			}
			lastEndEx = replacement.replaceRange.endExclusive;
		}
	}

	protected abstract _createNew(replacements: readonly T[]): TEdit;

	/**
	 * Returns true if and only if this edit and the given edit are structurally equal.
	 * Note that this does not mean that the edits have the same effect on a given input!
	 * See `.normalize()` or `.normalizeOnBase(base)` for that.
	*/
	public equals(other: TEdit): boolean {
		if (this.replacements.length !== other.replacements.length) {
			return false;
		}
		for (let i = 0; i < this.replacements.length; i++) {
			if (!this.replacements[i].equals(other.replacements[i])) {
				return false;
			}
		}
		return true;
	}

	public toString() {
		const edits = this.replacements.map(e => e.toString()).join(', ');
		return `[${edits}]`;
	}

	/**
	 * Normalizes the edit by removing empty replacements and joining touching replacements (if the replacements allow joining).
	 * Two edits have an equal normalized edit if and only if they have the same effect on any input.
	 *
	 * ![](https://raw.githubusercontent.com/microsoft/vscode/refs/heads/main/src/vs/editor/common/core/edits/docs/BaseEdit_normalize.drawio.png)
	 *
	 * Invariant:
	 * ```
	 * (forall base: TEdit.apply(base).equals(other.apply(base))) <-> this.normalize().equals(other.normalize())
	 * ```
	 * and
	 * ```
	 * forall base: TEdit.apply(base).equals(this.normalize().apply(base))
	 * ```
	 *
	 */
	public normalize(): TEdit {
		const newReplacements: T[] = [];
		let lastReplacement: T | undefined;
		for (const r of this.replacements) {
			if (r.getNewLength() === 0 && r.replaceRange.length === 0) {
				continue;
			}
			if (lastReplacement && lastReplacement.replaceRange.endExclusive === r.replaceRange.start) {
				const joined = lastReplacement.tryJoinTouching(r);
				if (joined) {
					lastReplacement = joined;
					continue;
				}
			}

			if (lastReplacement) {
				newReplacements.push(lastReplacement);
			}
			lastReplacement = r;
		}

		if (lastReplacement) {
			newReplacements.push(lastReplacement);
		}
		return this._createNew(newReplacements);
	}

	/**
	 * Combines two edits into one with the same effect.
	 *
	 * ![](https://raw.githubusercontent.com/microsoft/vscode/refs/heads/main/src/vs/editor/common/core/edits/docs/BaseEdit_compose.drawio.png)
	 *
	 * Invariant:
	 * ```
	 * other.apply(this.apply(s0)) = this.compose(other).apply(s0)
	 * ```
	 */
	public compose(other: TEdit): TEdit {
		const edits1 = this.normalize();
		const edits2 = other.normalize();

		if (edits1.isEmpty()) { return edits2; }
		if (edits2.isEmpty()) { return edits1; }

		const edit1Queue = [...edits1.replacements];
		const result: T[] = [];

		let edit1ToEdit2 = 0;

		for (const r2 of edits2.replacements) {
			// Copy over edit1 unmodified until it touches edit2.
			while (true) {
				const r1 = edit1Queue[0];
				if (!r1 || r1.replaceRange.start + edit1ToEdit2 + r1.getNewLength() >= r2.replaceRange.start) {
					break;
				}
				edit1Queue.shift();

				result.push(r1);
				edit1ToEdit2 += r1.getNewLength() - r1.replaceRange.length;
			}

			const firstEdit1ToEdit2 = edit1ToEdit2;
			let firstIntersecting: T | undefined; // or touching
			let lastIntersecting: T | undefined; // or touching

			while (true) {
				const r1 = edit1Queue[0];
				if (!r1 || r1.replaceRange.start + edit1ToEdit2 > r2.replaceRange.endExclusive) {
					break;
				}
				// else we intersect, because the new end of edit1 is after or equal to our start

				if (!firstIntersecting) {
					firstIntersecting = r1;
				}
				lastIntersecting = r1;
				edit1Queue.shift();

				edit1ToEdit2 += r1.getNewLength() - r1.replaceRange.length;
			}

			if (!firstIntersecting) {
				result.push(r2.delta(-edit1ToEdit2));
			} else {
				const newReplaceRangeStart = Math.min(firstIntersecting.replaceRange.start, r2.replaceRange.start - firstEdit1ToEdit2);

				const prefixLength = r2.replaceRange.start - (firstIntersecting.replaceRange.start + firstEdit1ToEdit2);
				if (prefixLength > 0) {
					const prefix = firstIntersecting.slice(OffsetRange.emptyAt(newReplaceRangeStart), new OffsetRange(0, prefixLength));
					result.push(prefix);
				}
				if (!lastIntersecting) {
					throw new BugIndicatingError(`Invariant violation: lastIntersecting is undefined`);
				}
				const suffixLength = (lastIntersecting.replaceRange.endExclusive + edit1ToEdit2) - r2.replaceRange.endExclusive;
				if (suffixLength > 0) {
					const e = lastIntersecting.slice(
						OffsetRange.ofStartAndLength(lastIntersecting.replaceRange.endExclusive, 0),
						new OffsetRange(lastIntersecting.getNewLength() - suffixLength, lastIntersecting.getNewLength())
					);
					edit1Queue.unshift(e);
					edit1ToEdit2 -= e.getNewLength() - e.replaceRange.length;
				}

				const newReplaceRange = new OffsetRange(
					newReplaceRangeStart,
					r2.replaceRange.endExclusive - edit1ToEdit2
				);
				const middle = r2.slice(newReplaceRange, new OffsetRange(0, r2.getNewLength()));
				result.push(middle);
			}
		}

		while (true) {
			const item = edit1Queue.shift();
			if (!item) { break; }
			result.push(item);
		}

		return this._createNew(result).normalize();
	}

	public decomposeSplit(shouldBeInE1: (repl: T) => boolean): { e1: TEdit; e2: TEdit } {
		const e1: T[] = [];
		const e2: T[] = [];

		let e2delta = 0;
		for (const edit of this.replacements) {
			if (shouldBeInE1(edit)) {
				e1.push(edit);
				e2delta += edit.getNewLength() - edit.replaceRange.length;
			} else {
				e2.push(edit.slice(edit.replaceRange.delta(e2delta), new OffsetRange(0, edit.getNewLength())));
			}
		}
		return { e1: this._createNew(e1), e2: this._createNew(e2) };
	}

	/**
	 * Returns the range of each replacement in the applied value.
	*/
	public getNewRanges(): OffsetRange[] {
		const ranges: OffsetRange[] = [];
		let offset = 0;
		for (const e of this.replacements) {
			ranges.push(OffsetRange.ofStartAndLength(e.replaceRange.start + offset, e.getNewLength()));
			offset += e.getLengthDelta();
		}
		return ranges;
	}

	public getJoinedReplaceRange(): OffsetRange | undefined {
		if (this.replacements.length === 0) {
			return undefined;
		}
		return this.replacements[0].replaceRange.join(this.replacements.at(-1)!.replaceRange);
	}

	public isEmpty(): boolean {
		return this.replacements.length === 0;
	}

	public getLengthDelta(): number {
		return sumBy(this.replacements, (replacement) => replacement.getLengthDelta());
	}

	public getNewDataLength(dataLength: number): number {
		return dataLength + this.getLengthDelta();
	}

	public applyToOffset(originalOffset: number): number {
		let accumulatedDelta = 0;
		for (const r of this.replacements) {
			if (r.replaceRange.start <= originalOffset) {
				if (originalOffset < r.replaceRange.endExclusive) {
					// the offset is in the replaced range
					return r.replaceRange.start + accumulatedDelta;
				}
				accumulatedDelta += r.getNewLength() - r.replaceRange.length;
			} else {
				break;
			}
		}
		return originalOffset + accumulatedDelta;
	}

	public applyToOffsetRange(originalRange: OffsetRange): OffsetRange {
		return new OffsetRange(
			this.applyToOffset(originalRange.start),
			this.applyToOffset(originalRange.endExclusive)
		);
	}

	public applyInverseToOffset(postEditsOffset: number): number {
		let accumulatedDelta = 0;
		for (const edit of this.replacements) {
			const editLength = edit.getNewLength();
			if (edit.replaceRange.start <= postEditsOffset - accumulatedDelta) {
				if (postEditsOffset - accumulatedDelta < edit.replaceRange.start + editLength) {
					// the offset is in the replaced range
					return edit.replaceRange.start;
				}
				accumulatedDelta += editLength - edit.replaceRange.length;
			} else {
				break;
			}
		}
		return postEditsOffset - accumulatedDelta;
	}

	/**
	 * Return undefined if the originalOffset is within an edit
	 */
	public applyToOffsetOrUndefined(originalOffset: number): number | undefined {
		let accumulatedDelta = 0;
		for (const edit of this.replacements) {
			if (edit.replaceRange.start <= originalOffset) {
				if (originalOffset < edit.replaceRange.endExclusive) {
					// the offset is in the replaced range
					return undefined;
				}
				accumulatedDelta += edit.getNewLength() - edit.replaceRange.length;
			} else {
				break;
			}
		}
		return originalOffset + accumulatedDelta;
	}

	/**
	 * Return undefined if the originalRange is within an edit
	 */
	public applyToOffsetRangeOrUndefined(originalRange: OffsetRange): OffsetRange | undefined {
		const start = this.applyToOffsetOrUndefined(originalRange.start);
		if (start === undefined) {
			return undefined;
		}
		const end = this.applyToOffsetOrUndefined(originalRange.endExclusive);
		if (end === undefined) {
			return undefined;
		}
		return new OffsetRange(start, end);
	}
}

export abstract class BaseReplacement<TSelf extends BaseReplacement<TSelf>> {
	constructor(
		/**
		 * The range to be replaced.
		*/
		public readonly replaceRange: OffsetRange,
	) { }

	public abstract getNewLength(): number;

	/**
	 * Precondition: TEdit.range.endExclusive === other.range.start
	*/
	public abstract tryJoinTouching(other: TSelf): TSelf | undefined;

	public abstract slice(newReplaceRange: OffsetRange, rangeInReplacement?: OffsetRange): TSelf;

	public delta(offset: number): TSelf {
		return this.slice(this.replaceRange.delta(offset), new OffsetRange(0, this.getNewLength()));
	}

	public getLengthDelta(): number {
		return this.getNewLength() - this.replaceRange.length;
	}

	abstract equals(other: TSelf): boolean;

	toString(): string {
		return `{ ${this.replaceRange.toString()} -> ${this.getNewLength()} }`;
	}

	get isEmpty() {
		return this.getNewLength() === 0 && this.replaceRange.length === 0;
	}

	getRangeAfterReplace(): OffsetRange {
		return new OffsetRange(this.replaceRange.start, this.replaceRange.start + this.getNewLength());
	}
}

export type AnyEdit = BaseEdit<AnyReplacement, AnyEdit>;
export type AnyReplacement = BaseReplacement<AnyReplacement>;

export class Edit<T extends BaseReplacement<T>> extends BaseEdit<T, Edit<T>> {
	/**
	 * Represents a set of edits to a string.
	 * All these edits are applied at once.
	*/
	public static readonly empty = new Edit<never>([]);

	public static create<T extends BaseReplacement<T>>(replacements: readonly T[]): Edit<T> {
		return new Edit(replacements);
	}

	public static single<T extends BaseReplacement<T>>(replacement: T): Edit<T> {
		return new Edit([replacement]);
	}

	protected override _createNew(replacements: readonly T[]): Edit<T> {
		return new Edit(replacements);
	}
}

export class AnnotationReplacement<TAnnotation> extends BaseReplacement<AnnotationReplacement<TAnnotation>> {
	constructor(
		range: OffsetRange,
		public readonly newLength: number,
		public readonly annotation: TAnnotation,
	) {
		super(range);
	}

	override equals(other: AnnotationReplacement<TAnnotation>): boolean {
		return this.replaceRange.equals(other.replaceRange) && this.newLength === other.newLength && this.annotation === other.annotation;
	}

	getNewLength(): number { return this.newLength; }

	tryJoinTouching(other: AnnotationReplacement<TAnnotation>): AnnotationReplacement<TAnnotation> | undefined {
		if (this.annotation !== other.annotation) {
			return undefined;
		}
		return new AnnotationReplacement<TAnnotation>(this.replaceRange.joinRightTouching(other.replaceRange), this.newLength + other.newLength, this.annotation);
	}

	slice(range: OffsetRange, rangeInReplacement?: OffsetRange): AnnotationReplacement<TAnnotation> {
		return new AnnotationReplacement<TAnnotation>(range, rangeInReplacement ? rangeInReplacement.length : this.newLength, this.annotation);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/lengthEdit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/lengthEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { OffsetRange } from '../ranges/offsetRange.js';
import { AnyEdit, BaseEdit, BaseReplacement } from './edit.js';

/**
 * Like a normal edit, but only captures the length information.
*/
export class LengthEdit extends BaseEdit<LengthReplacement, LengthEdit> {
	public static readonly empty = new LengthEdit([]);

	public static fromEdit(edit: AnyEdit): LengthEdit {
		return new LengthEdit(edit.replacements.map(r => new LengthReplacement(r.replaceRange, r.getNewLength())));
	}

	public static create(replacements: readonly LengthReplacement[]): LengthEdit {
		return new LengthEdit(replacements);
	}

	public static single(replacement: LengthReplacement): LengthEdit {
		return new LengthEdit([replacement]);
	}

	public static replace(range: OffsetRange, newLength: number): LengthEdit {
		return new LengthEdit([new LengthReplacement(range, newLength)]);
	}

	public static insert(offset: number, newLength: number): LengthEdit {
		return new LengthEdit([new LengthReplacement(OffsetRange.emptyAt(offset), newLength)]);
	}

	public static delete(range: OffsetRange): LengthEdit {
		return new LengthEdit([new LengthReplacement(range, 0)]);
	}

	public static compose(edits: readonly LengthEdit[]): LengthEdit {
		let e = LengthEdit.empty;
		for (const edit of edits) {
			e = e.compose(edit);
		}
		return e;
	}

	/**
	 * Creates an edit that reverts this edit.
	 */
	public inverse(): LengthEdit {
		const edits: LengthReplacement[] = [];
		let offset = 0;
		for (const e of this.replacements) {
			edits.push(new LengthReplacement(
				OffsetRange.ofStartAndLength(e.replaceRange.start + offset, e.newLength),
				e.replaceRange.length,
			));
			offset += e.newLength - e.replaceRange.length;
		}
		return new LengthEdit(edits);
	}

	protected override _createNew(replacements: readonly LengthReplacement[]): LengthEdit {
		return new LengthEdit(replacements);
	}

	public applyArray<T>(arr: readonly T[], fillItem: T): T[] {
		const newArr = new Array(this.getNewDataLength(arr.length));

		let srcPos = 0;
		let dstPos = 0;

		for (const replacement of this.replacements) {
			// Copy items before the current replacement
			for (let i = srcPos; i < replacement.replaceRange.start; i++) {
				newArr[dstPos++] = arr[i];
			}

			// Skip the replaced items in the source array
			srcPos = replacement.replaceRange.endExclusive;

			// Fill with the provided fillItem for insertions
			for (let i = 0; i < replacement.newLength; i++) {
				newArr[dstPos++] = fillItem;
			}
		}

		// Copy any remaining items from the original array
		while (srcPos < arr.length) {
			newArr[dstPos++] = arr[srcPos++];
		}

		return newArr;
	}
}

export class LengthReplacement extends BaseReplacement<LengthReplacement> {
	public static create(
		startOffset: number,
		endOffsetExclusive: number,
		newLength: number,
	): LengthReplacement {
		return new LengthReplacement(new OffsetRange(startOffset, endOffsetExclusive), newLength);
	}

	constructor(
		range: OffsetRange,
		public readonly newLength: number,
	) {
		super(range);
	}

	override equals(other: LengthReplacement): boolean {
		return this.replaceRange.equals(other.replaceRange) && this.newLength === other.newLength;
	}

	getNewLength(): number { return this.newLength; }

	tryJoinTouching(other: LengthReplacement): LengthReplacement | undefined {
		return new LengthReplacement(this.replaceRange.joinRightTouching(other.replaceRange), this.newLength + other.newLength);
	}

	slice(range: OffsetRange, rangeInReplacement: OffsetRange): LengthReplacement {
		return new LengthReplacement(range, rangeInReplacement.length);
	}

	override toString() {
		return `[${this.replaceRange.start}, +${this.replaceRange.length}) -> +${this.newLength}}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/lineEdit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/lineEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, groupAdjacentBy, numberComparator } from '../../../../base/common/arrays.js';
import { assert, checkAdjacentItems } from '../../../../base/common/assert.js';
import { splitLines } from '../../../../base/common/strings.js';
import { LineRange } from '../ranges/lineRange.js';
import { BaseStringEdit, StringEdit, StringReplacement } from './stringEdit.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import { TextReplacement, TextEdit } from './textEdit.js';
import { AbstractText } from '../text/abstractText.js';

export class LineEdit {
	public static readonly empty = new LineEdit([]);

	public static deserialize(data: SerializedLineEdit): LineEdit {
		return new LineEdit(data.map(e => LineReplacement.deserialize(e)));
	}

	public static fromStringEdit(edit: BaseStringEdit, initialValue: AbstractText): LineEdit {
		const textEdit = TextEdit.fromStringEdit(edit, initialValue);
		return LineEdit.fromTextEdit(textEdit, initialValue);
	}

	public static fromTextEdit(edit: TextEdit, initialValue: AbstractText): LineEdit {
		const edits = edit.replacements;

		const result: LineReplacement[] = [];

		const currentEdits: TextReplacement[] = [];
		for (let i = 0; i < edits.length; i++) {
			const edit = edits[i];
			const nextEditRange = i + 1 < edits.length ? edits[i + 1] : undefined;
			currentEdits.push(edit);
			if (nextEditRange && nextEditRange.range.startLineNumber === edit.range.endLineNumber) {
				continue;
			}

			const singleEdit = TextReplacement.joinReplacements(currentEdits, initialValue);
			currentEdits.length = 0;

			const singleLineEdit = LineReplacement.fromSingleTextEdit(singleEdit, initialValue);
			result.push(singleLineEdit);
		}

		return new LineEdit(result);
	}

	public static createFromUnsorted(edits: readonly LineReplacement[]): LineEdit {
		const result = edits.slice();
		result.sort(compareBy(i => i.lineRange.startLineNumber, numberComparator));
		return new LineEdit(result);
	}

	constructor(
		/**
		 * Have to be sorted by start line number and non-intersecting.
		*/
		public readonly replacements: readonly LineReplacement[]
	) {
		assert(checkAdjacentItems(replacements, (i1, i2) => i1.lineRange.endLineNumberExclusive <= i2.lineRange.startLineNumber));
	}

	public isEmpty(): boolean {
		return this.replacements.length === 0;
	}

	public toEdit(initialValue: AbstractText): StringEdit {
		const edits: StringReplacement[] = [];
		for (const edit of this.replacements) {
			const singleEdit = edit.toSingleEdit(initialValue);
			edits.push(singleEdit);
		}
		return new StringEdit(edits);
	}

	public toString(): string {
		return this.replacements.map(e => e.toString()).join(',');
	}

	public serialize(): SerializedLineEdit {
		return this.replacements.map(e => e.serialize());
	}

	public getNewLineRanges(): LineRange[] {
		const ranges: LineRange[] = [];
		let offset = 0;
		for (const e of this.replacements) {
			ranges.push(LineRange.ofLength(e.lineRange.startLineNumber + offset, e.newLines.length),);
			offset += e.newLines.length - e.lineRange.length;
		}
		return ranges;
	}

	public mapLineNumber(lineNumber: number): number {
		let lineDelta = 0;
		for (const e of this.replacements) {
			if (e.lineRange.endLineNumberExclusive > lineNumber) {
				break;
			}

			lineDelta += e.newLines.length - e.lineRange.length;
		}
		return lineNumber + lineDelta;
	}

	public mapLineRange(lineRange: LineRange): LineRange {
		return new LineRange(
			this.mapLineNumber(lineRange.startLineNumber),
			this.mapLineNumber(lineRange.endLineNumberExclusive),
		);
	}


	/** TODO improve, dont require originalLines */
	public mapBackLineRange(lineRange: LineRange, originalLines: string[]): LineRange {
		const i = this.inverse(originalLines);
		return i.mapLineRange(lineRange);
	}

	public touches(other: LineEdit): boolean {
		return this.replacements.some(e1 => other.replacements.some(e2 => e1.lineRange.intersect(e2.lineRange)));
	}

	public rebase(base: LineEdit): LineEdit {
		return new LineEdit(
			this.replacements.map(e => new LineReplacement(base.mapLineRange(e.lineRange), e.newLines)),
		);
	}

	public humanReadablePatch(originalLines: string[]): string {
		const result: string[] = [];

		function pushLine(originalLineNumber: number, modifiedLineNumber: number, kind: 'unmodified' | 'deleted' | 'added', content: string | undefined) {
			const specialChar = (kind === 'unmodified' ? ' ' : (kind === 'deleted' ? '-' : '+'));

			if (content === undefined) {
				content = '[[[[[ WARNING: LINE DOES NOT EXIST ]]]]]';
			}

			const origLn = originalLineNumber === -1 ? '   ' : originalLineNumber.toString().padStart(3, ' ');
			const modLn = modifiedLineNumber === -1 ? '   ' : modifiedLineNumber.toString().padStart(3, ' ');

			result.push(`${specialChar} ${origLn} ${modLn} ${content}`);
		}

		function pushSeperator() {
			result.push('---');
		}

		let lineDelta = 0;
		let first = true;

		for (const edits of groupAdjacentBy(this.replacements, (e1, e2) => e1.lineRange.distanceToRange(e2.lineRange) <= 5)) {
			if (!first) {
				pushSeperator();
			} else {
				first = false;
			}

			let lastLineNumber = edits[0].lineRange.startLineNumber - 2;

			for (const edit of edits) {
				for (let i = Math.max(1, lastLineNumber); i < edit.lineRange.startLineNumber; i++) {
					pushLine(i, i + lineDelta, 'unmodified', originalLines[i - 1]);
				}

				const range = edit.lineRange;
				const newLines = edit.newLines;
				for (const replaceLineNumber of range.mapToLineArray(n => n)) {
					const line = originalLines[replaceLineNumber - 1];
					pushLine(replaceLineNumber, -1, 'deleted', line);
				}
				for (let i = 0; i < newLines.length; i++) {
					const line = newLines[i];
					pushLine(-1, range.startLineNumber + lineDelta + i, 'added', line);
				}

				lastLineNumber = range.endLineNumberExclusive;

				lineDelta += edit.newLines.length - edit.lineRange.length;
			}

			for (let i = lastLineNumber; i <= Math.min(lastLineNumber + 2, originalLines.length); i++) {
				pushLine(i, i + lineDelta, 'unmodified', originalLines[i - 1]);
			}
		}

		return result.join('\n');
	}

	public apply(lines: string[]): string[] {
		const result: string[] = [];

		let currentLineIndex = 0;

		for (const edit of this.replacements) {
			while (currentLineIndex < edit.lineRange.startLineNumber - 1) {
				result.push(lines[currentLineIndex]);
				currentLineIndex++;
			}

			for (const newLine of edit.newLines) {
				result.push(newLine);
			}

			currentLineIndex = edit.lineRange.endLineNumberExclusive - 1;
		}

		while (currentLineIndex < lines.length) {
			result.push(lines[currentLineIndex]);
			currentLineIndex++;
		}

		return result;
	}

	public inverse(originalLines: string[]): LineEdit {
		const newRanges = this.getNewLineRanges();
		return new LineEdit(this.replacements.map((e, idx) => new LineReplacement(
			newRanges[idx],
			originalLines.slice(e.lineRange.startLineNumber - 1, e.lineRange.endLineNumberExclusive - 1),
		)));
	}
}

export class LineReplacement {
	public static deserialize(e: SerializedLineReplacement): LineReplacement {
		return new LineReplacement(
			LineRange.ofLength(e[0], e[1] - e[0]),
			e[2],
		);
	}

	public static fromSingleTextEdit(edit: TextReplacement, initialValue: AbstractText): LineReplacement {
		// 1: ab[cde
		// 2: fghijk
		// 3: lmn]opq

		// replaced with

		// 1n: 123
		// 2n: 456
		// 3n: 789

		// simple solution: replace [1..4) with [1n..4n)

		const newLines = splitLines(edit.text);
		let startLineNumber = edit.range.startLineNumber;
		const survivingFirstLineText = initialValue.getValueOfRange(Range.fromPositions(
			new Position(edit.range.startLineNumber, 1),
			edit.range.getStartPosition()
		));
		newLines[0] = survivingFirstLineText + newLines[0];

		let endLineNumberEx = edit.range.endLineNumber + 1;
		const editEndLineNumberMaxColumn = initialValue.getTransformer().getLineLength(edit.range.endLineNumber) + 1;
		const survivingEndLineText = initialValue.getValueOfRange(Range.fromPositions(
			edit.range.getEndPosition(),
			new Position(edit.range.endLineNumber, editEndLineNumberMaxColumn)
		));
		newLines[newLines.length - 1] = newLines[newLines.length - 1] + survivingEndLineText;

		// Replacing [startLineNumber, endLineNumberEx) with newLines would be correct, however it might not be minimal.

		const startBeforeNewLine = edit.range.startColumn === initialValue.getTransformer().getLineLength(edit.range.startLineNumber) + 1;
		const endAfterNewLine = edit.range.endColumn === 1;

		if (startBeforeNewLine && newLines[0].length === survivingFirstLineText.length) {
			// the replacement would not delete any text on the first line
			startLineNumber++;
			newLines.shift();
		}

		if (newLines.length > 0 && startLineNumber < endLineNumberEx && endAfterNewLine && newLines[newLines.length - 1].length === survivingEndLineText.length) {
			// the replacement would not delete any text on the last line
			endLineNumberEx--;
			newLines.pop();
		}

		return new LineReplacement(new LineRange(startLineNumber, endLineNumberEx), newLines);
	}

	constructor(
		public readonly lineRange: LineRange,
		public readonly newLines: readonly string[],
	) { }

	public toSingleTextEdit(initialValue: AbstractText): TextReplacement {
		if (this.newLines.length === 0) {
			// Deletion
			const textLen = initialValue.getTransformer().textLength;
			if (this.lineRange.endLineNumberExclusive === textLen.lineCount + 2) {
				let startPos: Position;
				if (this.lineRange.startLineNumber > 1) {
					const startLineNumber = this.lineRange.startLineNumber - 1;
					const startColumn = initialValue.getTransformer().getLineLength(startLineNumber) + 1;
					startPos = new Position(startLineNumber, startColumn);
				} else {
					// Delete everything.
					// In terms of lines, this would end up with 0 lines.
					// However, a string has always 1 line (which can be empty).
					startPos = new Position(1, 1);
				}

				const lastPosition = textLen.addToPosition(new Position(1, 1));
				return new TextReplacement(Range.fromPositions(startPos, lastPosition), '');
			} else {
				return new TextReplacement(new Range(this.lineRange.startLineNumber, 1, this.lineRange.endLineNumberExclusive, 1), '');
			}

		} else if (this.lineRange.isEmpty) {
			// Insertion

			let endLineNumber: number;
			let column: number;
			let text: string;
			const insertionLine = this.lineRange.startLineNumber;
			if (insertionLine === initialValue.getTransformer().textLength.lineCount + 2) {
				endLineNumber = insertionLine - 1;
				column = initialValue.getTransformer().getLineLength(endLineNumber) + 1;
				text = this.newLines.map(l => '\n' + l).join('');
			} else {
				endLineNumber = insertionLine;
				column = 1;
				text = this.newLines.map(l => l + '\n').join('');
			}
			return new TextReplacement(Range.fromPositions(new Position(endLineNumber, column)), text);
		} else {
			const endLineNumber = this.lineRange.endLineNumberExclusive - 1;
			const endLineNumberMaxColumn = initialValue.getTransformer().getLineLength(endLineNumber) + 1;
			const range = new Range(
				this.lineRange.startLineNumber,
				1,
				endLineNumber,
				endLineNumberMaxColumn
			);
			// Don't add \n to the last line. This is because we subtract one from lineRange.endLineNumberExclusive for endLineNumber.
			const text = this.newLines.join('\n');
			return new TextReplacement(range, text);
		}
	}

	public toSingleEdit(initialValue: AbstractText): StringReplacement {
		const textEdit = this.toSingleTextEdit(initialValue);
		const range = initialValue.getTransformer().getOffsetRange(textEdit.range);
		return new StringReplacement(range, textEdit.text);
	}

	public toString(): string {
		return `${this.lineRange}->${JSON.stringify(this.newLines)}`;
	}

	public serialize(): SerializedLineReplacement {
		return [
			this.lineRange.startLineNumber,
			this.lineRange.endLineNumberExclusive,
			this.newLines,
		];
	}

	public removeCommonSuffixPrefixLines(initialValue: AbstractText): LineReplacement {
		let startLineNumber = this.lineRange.startLineNumber;
		let endLineNumberEx = this.lineRange.endLineNumberExclusive;

		let trimStartCount = 0;
		while (
			startLineNumber < endLineNumberEx && trimStartCount < this.newLines.length
			&& this.newLines[trimStartCount] === initialValue.getLineAt(startLineNumber)
		) {
			startLineNumber++;
			trimStartCount++;
		}

		let trimEndCount = 0;
		while (
			startLineNumber < endLineNumberEx && trimEndCount + trimStartCount < this.newLines.length
			&& this.newLines[this.newLines.length - 1 - trimEndCount] === initialValue.getLineAt(endLineNumberEx - 1)
		) {
			endLineNumberEx--;
			trimEndCount++;
		}

		if (trimStartCount === 0 && trimEndCount === 0) {
			return this;
		}
		return new LineReplacement(new LineRange(startLineNumber, endLineNumberEx), this.newLines.slice(trimStartCount, this.newLines.length - trimEndCount));
	}

	public toLineEdit(): LineEdit {
		return new LineEdit([this]);
	}
}

export type SerializedLineEdit = SerializedLineReplacement[];
export type SerializedLineReplacement = [startLineNumber: number, endLineNumber: number, newLines: readonly string[]];

export namespace SerializedLineReplacement {
	export function is(thing: unknown): thing is SerializedLineReplacement {
		return (
			Array.isArray(thing)
			&& thing.length === 3
			&& typeof thing[0] === 'number'
			&& typeof thing[1] === 'number'
			&& Array.isArray(thing[2])
			&& thing[2].every((e: unknown) => typeof e === 'string')
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/stringEdit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/stringEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commonPrefixLength, commonSuffixLength } from '../../../../base/common/strings.js';
import { OffsetRange } from '../ranges/offsetRange.js';
import { StringText } from '../text/abstractText.js';
import { BaseEdit, BaseReplacement } from './edit.js';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseStringEdit<T extends BaseStringReplacement<T> = BaseStringReplacement<any>, TEdit extends BaseStringEdit<T, TEdit> = BaseStringEdit<any, any>> extends BaseEdit<T, TEdit> {
	get TReplacement(): T {
		throw new Error('TReplacement is not defined for BaseStringEdit');
	}

	public static composeOrUndefined<T extends BaseStringEdit>(edits: readonly T[]): T | undefined {
		if (edits.length === 0) {
			return undefined;
		}
		let result = edits[0];
		for (let i = 1; i < edits.length; i++) {
			// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
			result = result.compose(edits[i]) as any;
		}
		return result;
	}

	/**
	 * r := trySwap(e1, e2);
	 * e1.compose(e2) === r.e1.compose(r.e2)
	*/
	public static trySwap(e1: BaseStringEdit, e2: BaseStringEdit): { e1: StringEdit; e2: StringEdit } | undefined {
		// TODO make this more efficient
		const e1Inv = e1.inverseOnSlice((start, endEx) => ' '.repeat(endEx - start));

		const e1_ = e2.tryRebase(e1Inv);
		if (!e1_) {
			return undefined;
		}
		const e2_ = e1.tryRebase(e1_);
		if (!e2_) {
			return undefined;
		}

		return { e1: e1_, e2: e2_ };
	}

	public apply(base: string): string {
		const resultText: string[] = [];
		let pos = 0;
		for (const edit of this.replacements) {
			resultText.push(base.substring(pos, edit.replaceRange.start));
			resultText.push(edit.newText);
			pos = edit.replaceRange.endExclusive;
		}
		resultText.push(base.substring(pos));
		return resultText.join('');
	}


	/**
	 * Creates an edit that reverts this edit.
	 */
	public inverseOnSlice(getOriginalSlice: (start: number, endEx: number) => string): StringEdit {
		const edits: StringReplacement[] = [];
		let offset = 0;
		for (const e of this.replacements) {
			edits.push(StringReplacement.replace(
				OffsetRange.ofStartAndLength(e.replaceRange.start + offset, e.newText.length),
				getOriginalSlice(e.replaceRange.start, e.replaceRange.endExclusive)
			));
			offset += e.newText.length - e.replaceRange.length;
		}
		return new StringEdit(edits);
	}

	/**
	 * Creates an edit that reverts this edit.
	 */
	public inverse(original: string): StringEdit {
		return this.inverseOnSlice((start, endEx) => original.substring(start, endEx));
	}

	public rebaseSkipConflicting(base: StringEdit): StringEdit {
		return this._tryRebase(base, false)!;
	}

	public tryRebase(base: StringEdit): StringEdit | undefined {
		return this._tryRebase(base, true);
	}

	private _tryRebase(base: StringEdit, noOverlap: boolean): StringEdit | undefined {
		const newEdits: StringReplacement[] = [];

		let baseIdx = 0;
		let ourIdx = 0;
		let offset = 0;

		while (ourIdx < this.replacements.length || baseIdx < base.replacements.length) {
			// take the edit that starts first
			const baseEdit = base.replacements[baseIdx];
			const ourEdit = this.replacements[ourIdx];

			if (!ourEdit) {
				// We processed all our edits
				break;
			} else if (!baseEdit) {
				// no more edits from base
				newEdits.push(new StringReplacement(
					ourEdit.replaceRange.delta(offset),
					ourEdit.newText
				));
				ourIdx++;
			} else if (ourEdit.replaceRange.intersectsOrTouches(baseEdit.replaceRange)) {
				ourIdx++; // Don't take our edit, as it is conflicting -> skip
				if (noOverlap) {
					return undefined;
				}
			} else if (ourEdit.replaceRange.start < baseEdit.replaceRange.start) {
				// Our edit starts first
				newEdits.push(new StringReplacement(
					ourEdit.replaceRange.delta(offset),
					ourEdit.newText
				));
				ourIdx++;
			} else {
				baseIdx++;
				offset += baseEdit.newText.length - baseEdit.replaceRange.length;
			}
		}

		return new StringEdit(newEdits);
	}

	public toJson(): ISerializedStringEdit {
		return this.replacements.map(e => e.toJson());
	}

	public isNeutralOn(text: string): boolean {
		return this.replacements.every(e => e.isNeutralOn(text));
	}

	public removeCommonSuffixPrefix(originalText: string): StringEdit {
		const edits: StringReplacement[] = [];
		for (const e of this.replacements) {
			const edit = e.removeCommonSuffixPrefix(originalText);
			if (!edit.isEmpty) {
				edits.push(edit);
			}
		}
		return new StringEdit(edits);
	}

	public normalizeEOL(eol: '\r\n' | '\n'): StringEdit {
		return new StringEdit(this.replacements.map(edit => edit.normalizeEOL(eol)));
	}

	/**
	 * If `e1.apply(source) === e2.apply(source)`, then `e1.normalizeOnSource(source).equals(e2.normalizeOnSource(source))`.
	*/
	public normalizeOnSource(source: string): StringEdit {
		const result = this.apply(source);

		const edit = StringReplacement.replace(OffsetRange.ofLength(source.length), result);
		const e = edit.removeCommonSuffixAndPrefix(source);
		if (e.isEmpty) {
			return StringEdit.empty;
		}
		return e.toEdit();
	}

	public removeCommonSuffixAndPrefix(source: string): TEdit {
		return this._createNew(this.replacements.map(e => e.removeCommonSuffixAndPrefix(source))).normalize();
	}

	public applyOnText(docContents: StringText): StringText {
		return new StringText(this.apply(docContents.value));
	}

	public mapData<TData extends IEditData<TData>>(f: (replacement: T) => TData): AnnotatedStringEdit<TData> {
		return new AnnotatedStringEdit(
			this.replacements.map(e => new AnnotatedStringReplacement(
				e.replaceRange,
				e.newText,
				f(e)
			))
		);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseStringReplacement<T extends BaseStringReplacement<T> = BaseStringReplacement<any>> extends BaseReplacement<T> {
	constructor(
		range: OffsetRange,
		public readonly newText: string
	) {
		super(range);
	}

	getNewLength(): number { return this.newText.length; }

	override toString(): string {
		return `${this.replaceRange} -> ${JSON.stringify(this.newText)}`;
	}

	replace(str: string): string {
		return str.substring(0, this.replaceRange.start) + this.newText + str.substring(this.replaceRange.endExclusive);
	}

	/**
	 * Checks if the edit would produce no changes when applied to the given text.
	 */
	isNeutralOn(text: string): boolean {
		return this.newText === text.substring(this.replaceRange.start, this.replaceRange.endExclusive);
	}

	removeCommonSuffixPrefix(originalText: string): StringReplacement {
		const oldText = originalText.substring(this.replaceRange.start, this.replaceRange.endExclusive);

		const prefixLen = commonPrefixLength(oldText, this.newText);
		const suffixLen = Math.min(
			oldText.length - prefixLen,
			this.newText.length - prefixLen,
			commonSuffixLength(oldText, this.newText)
		);

		const replaceRange = new OffsetRange(
			this.replaceRange.start + prefixLen,
			this.replaceRange.endExclusive - suffixLen,
		);
		const newText = this.newText.substring(prefixLen, this.newText.length - suffixLen);

		return new StringReplacement(replaceRange, newText);
	}

	normalizeEOL(eol: '\r\n' | '\n'): StringReplacement {
		const newText = this.newText.replace(/\r\n|\n/g, eol);
		return new StringReplacement(this.replaceRange, newText);
	}

	public removeCommonSuffixAndPrefix(source: string): T {
		return this.removeCommonSuffix(source).removeCommonPrefix(source);
	}

	public removeCommonPrefix(source: string): T {
		const oldText = this.replaceRange.substring(source);

		const prefixLen = commonPrefixLength(oldText, this.newText);
		if (prefixLen === 0) {
			return this as unknown as T;
		}

		return this.slice(this.replaceRange.deltaStart(prefixLen), new OffsetRange(prefixLen, this.newText.length));
	}

	public removeCommonSuffix(source: string): T {
		const oldText = this.replaceRange.substring(source);

		const suffixLen = commonSuffixLength(oldText, this.newText);
		if (suffixLen === 0) {
			return this as unknown as T;
		}
		return this.slice(this.replaceRange.deltaEnd(-suffixLen), new OffsetRange(0, this.newText.length - suffixLen));
	}

	public toEdit(): StringEdit {
		return new StringEdit([this]);
	}

	public toJson(): ISerializedStringReplacement {
		return ({
			txt: this.newText,
			pos: this.replaceRange.start,
			len: this.replaceRange.length,
		});
	}
}


/**
 * Represents a set of replacements to a string.
 * All these replacements are applied at once.
*/
export class StringEdit extends BaseStringEdit<StringReplacement, StringEdit> {
	public static readonly empty = new StringEdit([]);

	public static create(replacements: readonly StringReplacement[]): StringEdit {
		return new StringEdit(replacements);
	}

	public static single(replacement: StringReplacement): StringEdit {
		return new StringEdit([replacement]);
	}

	public static replace(range: OffsetRange, replacement: string): StringEdit {
		return new StringEdit([new StringReplacement(range, replacement)]);
	}

	public static insert(offset: number, replacement: string): StringEdit {
		return new StringEdit([new StringReplacement(OffsetRange.emptyAt(offset), replacement)]);
	}

	public static delete(range: OffsetRange): StringEdit {
		return new StringEdit([new StringReplacement(range, '')]);
	}

	public static fromJson(data: ISerializedStringEdit): StringEdit {
		return new StringEdit(data.map(StringReplacement.fromJson));
	}

	public static compose(edits: readonly StringEdit[]): StringEdit {
		if (edits.length === 0) {
			return StringEdit.empty;
		}
		let result = edits[0];
		for (let i = 1; i < edits.length; i++) {
			result = result.compose(edits[i]);
		}
		return result;
	}

	/**
	 * The replacements are applied in order!
	 * Equals `StringEdit.compose(replacements.map(r => r.toEdit()))`, but is much more performant.
	*/
	public static composeSequentialReplacements(replacements: readonly StringReplacement[]): StringEdit {
		let edit = StringEdit.empty;
		let curEditReplacements: StringReplacement[] = []; // These are reverse sorted

		for (const r of replacements) {
			const last = curEditReplacements.at(-1);
			if (!last || r.replaceRange.isBefore(last.replaceRange)) {
				// Detect subsequences of reverse sorted replacements
				curEditReplacements.push(r);
			} else {
				// Once the subsequence is broken, compose the current replacements and look for a new subsequence.
				edit = edit.compose(StringEdit.create(curEditReplacements.reverse()));
				curEditReplacements = [r];
			}
		}

		edit = edit.compose(StringEdit.create(curEditReplacements.reverse()));
		return edit;
	}

	constructor(replacements: readonly StringReplacement[]) {
		super(replacements);
	}

	protected override _createNew(replacements: readonly StringReplacement[]): StringEdit {
		return new StringEdit(replacements);
	}
}

/**
 * Warning: Be careful when changing this type, as it is used for serialization!
*/
export type ISerializedStringEdit = ISerializedStringReplacement[];

/**
 * Warning: Be careful when changing this type, as it is used for serialization!
*/
export interface ISerializedStringReplacement {
	txt: string;
	pos: number;
	len: number;
}

export class StringReplacement extends BaseStringReplacement<StringReplacement> {
	public static insert(offset: number, text: string): StringReplacement {
		return new StringReplacement(OffsetRange.emptyAt(offset), text);
	}

	public static replace(range: OffsetRange, text: string): StringReplacement {
		return new StringReplacement(range, text);
	}

	public static delete(range: OffsetRange): StringReplacement {
		return new StringReplacement(range, '');
	}

	public static fromJson(data: ISerializedStringReplacement): StringReplacement {
		return new StringReplacement(OffsetRange.ofStartAndLength(data.pos, data.len), data.txt);
	}

	override equals(other: StringReplacement): boolean {
		return this.replaceRange.equals(other.replaceRange) && this.newText === other.newText;
	}

	override tryJoinTouching(other: StringReplacement): StringReplacement | undefined {
		return new StringReplacement(this.replaceRange.joinRightTouching(other.replaceRange), this.newText + other.newText);
	}

	override slice(range: OffsetRange, rangeInReplacement?: OffsetRange): StringReplacement {
		return new StringReplacement(range, rangeInReplacement ? rangeInReplacement.substring(this.newText) : this.newText);
	}
}

export function applyEditsToRanges(sortedRanges: OffsetRange[], edit: StringEdit): OffsetRange[] {
	sortedRanges = sortedRanges.slice();

	// treat edits as deletion of the replace range and then as insertion that extends the first range
	const result: OffsetRange[] = [];

	let offset = 0;

	for (const e of edit.replacements) {
		while (true) {
			// ranges before the current edit
			const r = sortedRanges[0];
			if (!r || r.endExclusive >= e.replaceRange.start) {
				break;
			}
			sortedRanges.shift();
			result.push(r.delta(offset));
		}

		const intersecting: OffsetRange[] = [];
		while (true) {
			const r = sortedRanges[0];
			if (!r || !r.intersectsOrTouches(e.replaceRange)) {
				break;
			}
			sortedRanges.shift();
			intersecting.push(r);
		}

		for (let i = intersecting.length - 1; i >= 0; i--) {
			let r = intersecting[i];

			const overlap = r.intersect(e.replaceRange)!.length;
			r = r.deltaEnd(-overlap + (i === 0 ? e.newText.length : 0));

			const rangeAheadOfReplaceRange = r.start - e.replaceRange.start;
			if (rangeAheadOfReplaceRange > 0) {
				r = r.delta(-rangeAheadOfReplaceRange);
			}

			if (i !== 0) {
				r = r.delta(e.newText.length);
			}

			// We already took our offset into account.
			// Because we add r back to the queue (which then adds offset again),
			// we have to remove it here.
			r = r.delta(-(e.newText.length - e.replaceRange.length));

			sortedRanges.unshift(r);
		}

		offset += e.newText.length - e.replaceRange.length;
	}

	while (true) {
		const r = sortedRanges[0];
		if (!r) {
			break;
		}
		sortedRanges.shift();
		result.push(r.delta(offset));
	}

	return result;
}

/**
 * Represents data associated to a single edit, which survives certain edit operations.
*/
export interface IEditData<T> {
	join(other: T): T | undefined;
}

export class VoidEditData implements IEditData<VoidEditData> {
	join(other: VoidEditData): VoidEditData | undefined {
		return this;
	}
}

/**
 * Represents a set of replacements to a string.
 * All these replacements are applied at once.
*/
export class AnnotatedStringEdit<T extends IEditData<T>> extends BaseStringEdit<AnnotatedStringReplacement<T>, AnnotatedStringEdit<T>> {
	public static readonly empty = new AnnotatedStringEdit<never>([]);

	public static create<T extends IEditData<T>>(replacements: readonly AnnotatedStringReplacement<T>[]): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit(replacements);
	}

	public static single<T extends IEditData<T>>(replacement: AnnotatedStringReplacement<T>): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit([replacement]);
	}

	public static replace<T extends IEditData<T>>(range: OffsetRange, replacement: string, data: T): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit([new AnnotatedStringReplacement(range, replacement, data)]);
	}

	public static insert<T extends IEditData<T>>(offset: number, replacement: string, data: T): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit([new AnnotatedStringReplacement(OffsetRange.emptyAt(offset), replacement, data)]);
	}

	public static delete<T extends IEditData<T>>(range: OffsetRange, data: T): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit([new AnnotatedStringReplacement(range, '', data)]);
	}

	public static compose<T extends IEditData<T>>(edits: readonly AnnotatedStringEdit<T>[]): AnnotatedStringEdit<T> {
		if (edits.length === 0) {
			return AnnotatedStringEdit.empty;
		}
		let result = edits[0];
		for (let i = 1; i < edits.length; i++) {
			result = result.compose(edits[i]);
		}
		return result;
	}

	constructor(replacements: readonly AnnotatedStringReplacement<T>[]) {
		super(replacements);
	}

	protected override _createNew(replacements: readonly AnnotatedStringReplacement<T>[]): AnnotatedStringEdit<T> {
		return new AnnotatedStringEdit<T>(replacements);
	}

	public toStringEdit(filter?: (replacement: AnnotatedStringReplacement<T>) => boolean): StringEdit {
		const newReplacements: StringReplacement[] = [];
		for (const r of this.replacements) {
			if (!filter || filter(r)) {
				newReplacements.push(new StringReplacement(r.replaceRange, r.newText));
			}
		}
		return new StringEdit(newReplacements);
	}
}

export class AnnotatedStringReplacement<T extends IEditData<T>> extends BaseStringReplacement<AnnotatedStringReplacement<T>> {
	public static insert<T extends IEditData<T>>(offset: number, text: string, data: T): AnnotatedStringReplacement<T> {
		return new AnnotatedStringReplacement<T>(OffsetRange.emptyAt(offset), text, data);
	}

	public static replace<T extends IEditData<T>>(range: OffsetRange, text: string, data: T): AnnotatedStringReplacement<T> {
		return new AnnotatedStringReplacement<T>(range, text, data);
	}

	public static delete<T extends IEditData<T>>(range: OffsetRange, data: T): AnnotatedStringReplacement<T> {
		return new AnnotatedStringReplacement<T>(range, '', data);
	}

	constructor(
		range: OffsetRange,
		newText: string,
		public readonly data: T
	) {
		super(range, newText);
	}

	override equals(other: AnnotatedStringReplacement<T>): boolean {
		return this.replaceRange.equals(other.replaceRange) && this.newText === other.newText && this.data === other.data;
	}

	tryJoinTouching(other: AnnotatedStringReplacement<T>): AnnotatedStringReplacement<T> | undefined {
		const joined = this.data.join(other.data);
		if (joined === undefined) {
			return undefined;
		}
		return new AnnotatedStringReplacement(this.replaceRange.joinRightTouching(other.replaceRange), this.newText + other.newText, joined);
	}

	slice(range: OffsetRange, rangeInReplacement?: OffsetRange): AnnotatedStringReplacement<T> {
		return new AnnotatedStringReplacement(range, rangeInReplacement ? rangeInReplacement.substring(this.newText) : this.newText, this.data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/edits/textEdit.ts]---
Location: vscode-main/src/vs/editor/common/core/edits/textEdit.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { compareBy, equals } from '../../../../base/common/arrays.js';
import { assertFn, checkAdjacentItems } from '../../../../base/common/assert.js';
import { BugIndicatingError } from '../../../../base/common/errors.js';
import { commonPrefixLength, commonSuffixLength } from '../../../../base/common/strings.js';
import { ISingleEditOperation } from '../editOperation.js';
import { BaseStringEdit, StringReplacement } from './stringEdit.js';
import { Position } from '../position.js';
import { Range } from '../range.js';
import { TextLength } from '../text/textLength.js';
import { AbstractText, StringText } from '../text/abstractText.js';
import { IEquatable } from '../../../../base/common/equals.js';

export class TextEdit {
	public static fromStringEdit(edit: BaseStringEdit, initialState: AbstractText): TextEdit {
		const edits = edit.replacements.map(e => TextReplacement.fromStringReplacement(e, initialState));
		return new TextEdit(edits);
	}

	public static replace(originalRange: Range, newText: string): TextEdit {
		return new TextEdit([new TextReplacement(originalRange, newText)]);
	}

	public static delete(range: Range): TextEdit {
		return new TextEdit([new TextReplacement(range, '')]);
	}

	public static insert(position: Position, newText: string): TextEdit {
		return new TextEdit([new TextReplacement(Range.fromPositions(position, position), newText)]);
	}

	public static fromParallelReplacementsUnsorted(replacements: readonly TextReplacement[]): TextEdit {
		const r = replacements.slice().sort(compareBy(i => i.range, Range.compareRangesUsingStarts));
		return new TextEdit(r);
	}

	constructor(
		public readonly replacements: readonly TextReplacement[]
	) {
		assertFn(() => checkAdjacentItems(replacements, (a, b) => a.range.getEndPosition().isBeforeOrEqual(b.range.getStartPosition())));
	}

	/**
	 * Joins touching edits and removes empty edits.
	 */
	normalize(): TextEdit {
		const replacements: TextReplacement[] = [];
		for (const r of this.replacements) {
			if (replacements.length > 0 && replacements[replacements.length - 1].range.getEndPosition().equals(r.range.getStartPosition())) {
				const last = replacements[replacements.length - 1];
				replacements[replacements.length - 1] = new TextReplacement(last.range.plusRange(r.range), last.text + r.text);
			} else if (!r.isEmpty) {
				replacements.push(r);
			}
		}
		return new TextEdit(replacements);
	}

	mapPosition(position: Position): Position | Range {
		let lineDelta = 0;
		let curLine = 0;
		let columnDeltaInCurLine = 0;

		for (const replacement of this.replacements) {
			const start = replacement.range.getStartPosition();

			if (position.isBeforeOrEqual(start)) {
				break;
			}

			const end = replacement.range.getEndPosition();
			const len = TextLength.ofText(replacement.text);
			if (position.isBefore(end)) {
				const startPos = new Position(start.lineNumber + lineDelta, start.column + (start.lineNumber + lineDelta === curLine ? columnDeltaInCurLine : 0));
				const endPos = len.addToPosition(startPos);
				return rangeFromPositions(startPos, endPos);
			}

			if (start.lineNumber + lineDelta !== curLine) {
				columnDeltaInCurLine = 0;
			}

			lineDelta += len.lineCount - (replacement.range.endLineNumber - replacement.range.startLineNumber);

			if (len.lineCount === 0) {
				if (end.lineNumber !== start.lineNumber) {
					columnDeltaInCurLine += len.columnCount - (end.column - 1);
				} else {
					columnDeltaInCurLine += len.columnCount - (end.column - start.column);
				}
			} else {
				columnDeltaInCurLine = len.columnCount;
			}
			curLine = end.lineNumber + lineDelta;
		}

		return new Position(position.lineNumber + lineDelta, position.column + (position.lineNumber + lineDelta === curLine ? columnDeltaInCurLine : 0));
	}

	mapRange(range: Range): Range {
		function getStart(p: Position | Range) {
			return p instanceof Position ? p : p.getStartPosition();
		}

		function getEnd(p: Position | Range) {
			return p instanceof Position ? p : p.getEndPosition();
		}

		const start = getStart(this.mapPosition(range.getStartPosition()));
		const end = getEnd(this.mapPosition(range.getEndPosition()));

		return rangeFromPositions(start, end);
	}

	// TODO: `doc` is not needed for this!
	inverseMapPosition(positionAfterEdit: Position, doc: AbstractText): Position | Range {
		const reversed = this.inverse(doc);
		return reversed.mapPosition(positionAfterEdit);
	}

	inverseMapRange(range: Range, doc: AbstractText): Range {
		const reversed = this.inverse(doc);
		return reversed.mapRange(range);
	}

	apply(text: AbstractText): string {
		let result = '';
		let lastEditEnd = new Position(1, 1);
		for (const replacement of this.replacements) {
			const editRange = replacement.range;
			const editStart = editRange.getStartPosition();
			const editEnd = editRange.getEndPosition();

			const r = rangeFromPositions(lastEditEnd, editStart);
			if (!r.isEmpty()) {
				result += text.getValueOfRange(r);
			}
			result += replacement.text;
			lastEditEnd = editEnd;
		}
		const r = rangeFromPositions(lastEditEnd, text.endPositionExclusive);
		if (!r.isEmpty()) {
			result += text.getValueOfRange(r);
		}
		return result;
	}

	applyToString(str: string): string {
		const strText = new StringText(str);
		return this.apply(strText);
	}

	inverse(doc: AbstractText): TextEdit {
		const ranges = this.getNewRanges();
		return new TextEdit(this.replacements.map((e, idx) => new TextReplacement(ranges[idx], doc.getValueOfRange(e.range))));
	}

	getNewRanges(): Range[] {
		const newRanges: Range[] = [];
		let previousEditEndLineNumber = 0;
		let lineOffset = 0;
		let columnOffset = 0;
		for (const replacement of this.replacements) {
			const textLength = TextLength.ofText(replacement.text);
			const newRangeStart = Position.lift({
				lineNumber: replacement.range.startLineNumber + lineOffset,
				column: replacement.range.startColumn + (replacement.range.startLineNumber === previousEditEndLineNumber ? columnOffset : 0)
			});
			const newRange = textLength.createRange(newRangeStart);
			newRanges.push(newRange);
			lineOffset = newRange.endLineNumber - replacement.range.endLineNumber;
			columnOffset = newRange.endColumn - replacement.range.endColumn;
			previousEditEndLineNumber = replacement.range.endLineNumber;
		}
		return newRanges;
	}

	toReplacement(text: AbstractText): TextReplacement {
		if (this.replacements.length === 0) { throw new BugIndicatingError(); }
		if (this.replacements.length === 1) { return this.replacements[0]; }

		const startPos = this.replacements[0].range.getStartPosition();
		const endPos = this.replacements[this.replacements.length - 1].range.getEndPosition();

		let newText = '';

		for (let i = 0; i < this.replacements.length; i++) {
			const curEdit = this.replacements[i];
			newText += curEdit.text;
			if (i < this.replacements.length - 1) {
				const nextEdit = this.replacements[i + 1];
				const gapRange = Range.fromPositions(curEdit.range.getEndPosition(), nextEdit.range.getStartPosition());
				const gapText = text.getValueOfRange(gapRange);
				newText += gapText;
			}
		}
		return new TextReplacement(Range.fromPositions(startPos, endPos), newText);
	}

	equals(other: TextEdit): boolean {
		return equals(this.replacements, other.replacements, (a, b) => a.equals(b));
	}

	/**
	 * Combines two edits into one with the same effect.
	 * WARNING: This is written by AI, but well tested. I do not understand the implementation myself.
	 *
	 * Invariant:
	 * ```
	 * other.applyToString(this.applyToString(s0)) = this.compose(other).applyToString(s0)
	 * ```
	 */
	compose(other: TextEdit): TextEdit {
		const edits1 = this.normalize();
		const edits2 = other.normalize();

		if (edits1.replacements.length === 0) { return edits2; }
		if (edits2.replacements.length === 0) { return edits1; }

		const resultReplacements: TextReplacement[] = [];

		let edit1Idx = 0;
		let lastEdit1EndS0Line = 1;
		let lastEdit1EndS0Col = 1;

		let headSrcRangeStartLine = 0;
		let headSrcRangeStartCol = 0;
		let headSrcRangeEndLine = 0;
		let headSrcRangeEndCol = 0;
		let headText: string | null = null;
		let headLengthLine = 0;
		let headLengthCol = 0;

		let headHasValue = false;
		let headIsInfinite = false;

		let currentPosInS1Line = 1;
		let currentPosInS1Col = 1;

		function ensureHead() {
			if (headHasValue) { return; }

			if (edit1Idx < edits1.replacements.length) {
				const nextEdit = edits1.replacements[edit1Idx];
				const nextEditStart = nextEdit.range.getStartPosition();

				const gapIsEmpty = (lastEdit1EndS0Line === nextEditStart.lineNumber) && (lastEdit1EndS0Col === nextEditStart.column);

				if (!gapIsEmpty) {
					headSrcRangeStartLine = lastEdit1EndS0Line;
					headSrcRangeStartCol = lastEdit1EndS0Col;
					headSrcRangeEndLine = nextEditStart.lineNumber;
					headSrcRangeEndCol = nextEditStart.column;

					headText = null;

					if (lastEdit1EndS0Line === nextEditStart.lineNumber) {
						headLengthLine = 0;
						headLengthCol = nextEditStart.column - lastEdit1EndS0Col;
					} else {
						headLengthLine = nextEditStart.lineNumber - lastEdit1EndS0Line;
						headLengthCol = nextEditStart.column - 1;
					}

					headHasValue = true;
					lastEdit1EndS0Line = nextEditStart.lineNumber;
					lastEdit1EndS0Col = nextEditStart.column;
				} else {
					const nextEditEnd = nextEdit.range.getEndPosition();
					headSrcRangeStartLine = nextEditStart.lineNumber;
					headSrcRangeStartCol = nextEditStart.column;
					headSrcRangeEndLine = nextEditEnd.lineNumber;
					headSrcRangeEndCol = nextEditEnd.column;

					headText = nextEdit.text;

					let line = 0;
					let column = 0;
					const text = nextEdit.text;
					for (let i = 0; i < text.length; i++) {
						if (text.charCodeAt(i) === 10) {
							line++;
							column = 0;
						} else {
							column++;
						}
					}
					headLengthLine = line;
					headLengthCol = column;

					headHasValue = true;
					lastEdit1EndS0Line = nextEditEnd.lineNumber;
					lastEdit1EndS0Col = nextEditEnd.column;
					edit1Idx++;
				}
			} else {
				headIsInfinite = true;
				headSrcRangeStartLine = lastEdit1EndS0Line;
				headSrcRangeStartCol = lastEdit1EndS0Col;
				headHasValue = true;
			}
		}

		function splitText(text: string, lenLine: number, lenCol: number): [string, string] {
			if (lenLine === 0 && lenCol === 0) { return ['', text]; }
			let line = 0;
			let offset = 0;
			while (line < lenLine) {
				const idx = text.indexOf('\n', offset);
				if (idx === -1) { throw new BugIndicatingError('Text length mismatch'); }
				offset = idx + 1;
				line++;
			}
			offset += lenCol;
			return [text.substring(0, offset), text.substring(offset)];
		}

		for (const r2 of edits2.replacements) {
			const r2Start = r2.range.getStartPosition();
			const r2End = r2.range.getEndPosition();

			while (true) {
				if (currentPosInS1Line === r2Start.lineNumber && currentPosInS1Col === r2Start.column) { break; }
				ensureHead();

				if (headIsInfinite) {
					let distLine: number, distCol: number;
					if (currentPosInS1Line === r2Start.lineNumber) {
						distLine = 0;
						distCol = r2Start.column - currentPosInS1Col;
					} else {
						distLine = r2Start.lineNumber - currentPosInS1Line;
						distCol = r2Start.column - 1;
					}

					currentPosInS1Line = r2Start.lineNumber;
					currentPosInS1Col = r2Start.column;

					if (distLine === 0) {
						headSrcRangeStartCol += distCol;
					} else {
						headSrcRangeStartLine += distLine;
						headSrcRangeStartCol = distCol + 1;
					}
					break;
				}

				let headEndInS1Line: number, headEndInS1Col: number;
				if (headLengthLine === 0) {
					headEndInS1Line = currentPosInS1Line;
					headEndInS1Col = currentPosInS1Col + headLengthCol;
				} else {
					headEndInS1Line = currentPosInS1Line + headLengthLine;
					headEndInS1Col = headLengthCol + 1;
				}

				let r2StartIsBeforeHeadEnd = false;
				if (r2Start.lineNumber < headEndInS1Line) {
					r2StartIsBeforeHeadEnd = true;
				} else if (r2Start.lineNumber === headEndInS1Line) {
					r2StartIsBeforeHeadEnd = r2Start.column < headEndInS1Col;
				}

				if (r2StartIsBeforeHeadEnd) {
					let splitLenLine: number, splitLenCol: number;
					if (currentPosInS1Line === r2Start.lineNumber) {
						splitLenLine = 0;
						splitLenCol = r2Start.column - currentPosInS1Col;
					} else {
						splitLenLine = r2Start.lineNumber - currentPosInS1Line;
						splitLenCol = r2Start.column - 1;
					}

					let remainingLenLine: number, remainingLenCol: number;
					if (splitLenLine === headLengthLine) {
						remainingLenLine = 0;
						remainingLenCol = headLengthCol - splitLenCol;
					} else {
						remainingLenLine = headLengthLine - splitLenLine;
						remainingLenCol = headLengthCol;
					}

					if (headText !== null) {
						const [t1, t2] = splitText(headText, splitLenLine, splitLenCol);
						resultReplacements.push(new TextReplacement(new Range(headSrcRangeStartLine, headSrcRangeStartCol, headSrcRangeEndLine, headSrcRangeEndCol), t1));

						headText = t2;
						headLengthLine = remainingLenLine;
						headLengthCol = remainingLenCol;

						headSrcRangeStartLine = headSrcRangeEndLine;
						headSrcRangeStartCol = headSrcRangeEndCol;
					} else {
						let splitPosLine: number, splitPosCol: number;
						if (splitLenLine === 0) {
							splitPosLine = headSrcRangeStartLine;
							splitPosCol = headSrcRangeStartCol + splitLenCol;
						} else {
							splitPosLine = headSrcRangeStartLine + splitLenLine;
							splitPosCol = splitLenCol + 1;
						}

						headSrcRangeStartLine = splitPosLine;
						headSrcRangeStartCol = splitPosCol;

						headLengthLine = remainingLenLine;
						headLengthCol = remainingLenCol;
					}
					currentPosInS1Line = r2Start.lineNumber;
					currentPosInS1Col = r2Start.column;
					break;
				}

				if (headText !== null) {
					resultReplacements.push(new TextReplacement(new Range(headSrcRangeStartLine, headSrcRangeStartCol, headSrcRangeEndLine, headSrcRangeEndCol), headText));
				}

				currentPosInS1Line = headEndInS1Line;
				currentPosInS1Col = headEndInS1Col;
				headHasValue = false;
			}

			let consumedStartS0Line: number | null = null;
			let consumedStartS0Col: number | null = null;
			let consumedEndS0Line: number | null = null;
			let consumedEndS0Col: number | null = null;

			while (true) {
				if (currentPosInS1Line === r2End.lineNumber && currentPosInS1Col === r2End.column) { break; }
				ensureHead();

				if (headIsInfinite) {
					let distLine: number, distCol: number;
					if (currentPosInS1Line === r2End.lineNumber) {
						distLine = 0;
						distCol = r2End.column - currentPosInS1Col;
					} else {
						distLine = r2End.lineNumber - currentPosInS1Line;
						distCol = r2End.column - 1;
					}

					let rangeInS0EndLine: number, rangeInS0EndCol: number;
					if (distLine === 0) {
						rangeInS0EndLine = headSrcRangeStartLine;
						rangeInS0EndCol = headSrcRangeStartCol + distCol;
					} else {
						rangeInS0EndLine = headSrcRangeStartLine + distLine;
						rangeInS0EndCol = distCol + 1;
					}

					if (consumedStartS0Line === null) {
						consumedStartS0Line = headSrcRangeStartLine;
						consumedStartS0Col = headSrcRangeStartCol;
					}
					consumedEndS0Line = rangeInS0EndLine;
					consumedEndS0Col = rangeInS0EndCol;

					currentPosInS1Line = r2End.lineNumber;
					currentPosInS1Col = r2End.column;

					headSrcRangeStartLine = rangeInS0EndLine;
					headSrcRangeStartCol = rangeInS0EndCol;
					break;
				}

				let headEndInS1Line: number, headEndInS1Col: number;
				if (headLengthLine === 0) {
					headEndInS1Line = currentPosInS1Line;
					headEndInS1Col = currentPosInS1Col + headLengthCol;
				} else {
					headEndInS1Line = currentPosInS1Line + headLengthLine;
					headEndInS1Col = headLengthCol + 1;
				}

				let r2EndIsBeforeHeadEnd = false;
				if (r2End.lineNumber < headEndInS1Line) {
					r2EndIsBeforeHeadEnd = true;
				} else if (r2End.lineNumber === headEndInS1Line) {
					r2EndIsBeforeHeadEnd = r2End.column < headEndInS1Col;
				}

				if (r2EndIsBeforeHeadEnd) {
					let splitLenLine: number, splitLenCol: number;
					if (currentPosInS1Line === r2End.lineNumber) {
						splitLenLine = 0;
						splitLenCol = r2End.column - currentPosInS1Col;
					} else {
						splitLenLine = r2End.lineNumber - currentPosInS1Line;
						splitLenCol = r2End.column - 1;
					}

					let remainingLenLine: number, remainingLenCol: number;
					if (splitLenLine === headLengthLine) {
						remainingLenLine = 0;
						remainingLenCol = headLengthCol - splitLenCol;
					} else {
						remainingLenLine = headLengthLine - splitLenLine;
						remainingLenCol = headLengthCol;
					}

					if (headText !== null) {
						if (consumedStartS0Line === null) {
							consumedStartS0Line = headSrcRangeStartLine;
							consumedStartS0Col = headSrcRangeStartCol;
						}
						consumedEndS0Line = headSrcRangeEndLine;
						consumedEndS0Col = headSrcRangeEndCol;

						const [, t2] = splitText(headText, splitLenLine, splitLenCol);
						headText = t2;
						headLengthLine = remainingLenLine;
						headLengthCol = remainingLenCol;

						headSrcRangeStartLine = headSrcRangeEndLine;
						headSrcRangeStartCol = headSrcRangeEndCol;
					} else {
						let splitPosLine: number, splitPosCol: number;
						if (splitLenLine === 0) {
							splitPosLine = headSrcRangeStartLine;
							splitPosCol = headSrcRangeStartCol + splitLenCol;
						} else {
							splitPosLine = headSrcRangeStartLine + splitLenLine;
							splitPosCol = splitLenCol + 1;
						}

						if (consumedStartS0Line === null) {
							consumedStartS0Line = headSrcRangeStartLine;
							consumedStartS0Col = headSrcRangeStartCol;
						}
						consumedEndS0Line = splitPosLine;
						consumedEndS0Col = splitPosCol;

						headSrcRangeStartLine = splitPosLine;
						headSrcRangeStartCol = splitPosCol;

						headLengthLine = remainingLenLine;
						headLengthCol = remainingLenCol;
					}
					currentPosInS1Line = r2End.lineNumber;
					currentPosInS1Col = r2End.column;
					break;
				}

				if (consumedStartS0Line === null) {
					consumedStartS0Line = headSrcRangeStartLine;
					consumedStartS0Col = headSrcRangeStartCol;
				}
				consumedEndS0Line = headSrcRangeEndLine;
				consumedEndS0Col = headSrcRangeEndCol;

				currentPosInS1Line = headEndInS1Line;
				currentPosInS1Col = headEndInS1Col;
				headHasValue = false;
			}

			if (consumedStartS0Line !== null) {
				resultReplacements.push(new TextReplacement(new Range(consumedStartS0Line, consumedStartS0Col!, consumedEndS0Line!, consumedEndS0Col!), r2.text));
			} else {
				ensureHead();
				const insertPosS0Line = headSrcRangeStartLine;
				const insertPosS0Col = headSrcRangeStartCol;
				resultReplacements.push(new TextReplacement(new Range(insertPosS0Line, insertPosS0Col, insertPosS0Line, insertPosS0Col), r2.text));
			}
		}

		while (true) {
			ensureHead();
			if (headIsInfinite) { break; }
			if (headText !== null) {
				resultReplacements.push(new TextReplacement(new Range(headSrcRangeStartLine, headSrcRangeStartCol, headSrcRangeEndLine, headSrcRangeEndCol), headText));
			}
			headHasValue = false;
		}

		return new TextEdit(resultReplacements).normalize();
	}

	toString(text: AbstractText | string | undefined): string {
		if (text === undefined) {
			return this.replacements.map(edit => edit.toString()).join('\n');
		}

		if (typeof text === 'string') {
			return this.toString(new StringText(text));
		}

		if (this.replacements.length === 0) {
			return '';
		}

		return this.replacements.map(r => {
			const maxLength = 10;
			const originalText = text.getValueOfRange(r.range);

			// Get text before the edit
			const beforeRange = Range.fromPositions(
				new Position(Math.max(1, r.range.startLineNumber - 1), 1),
				r.range.getStartPosition()
			);
			let beforeText = text.getValueOfRange(beforeRange);
			if (beforeText.length > maxLength) {
				beforeText = '...' + beforeText.substring(beforeText.length - maxLength);
			}

			// Get text after the edit
			const afterRange = Range.fromPositions(
				r.range.getEndPosition(),
				new Position(r.range.endLineNumber + 1, 1)
			);
			let afterText = text.getValueOfRange(afterRange);
			if (afterText.length > maxLength) {
				afterText = afterText.substring(0, maxLength) + '...';
			}

			// Format the replaced text
			let replacedText = originalText;
			if (replacedText.length > maxLength) {
				const halfMax = Math.floor(maxLength / 2);
				replacedText = replacedText.substring(0, halfMax) + '...' +
					replacedText.substring(replacedText.length - halfMax);
			}

			// Format the new text
			let newText = r.text;
			if (newText.length > maxLength) {
				const halfMax = Math.floor(maxLength / 2);
				newText = newText.substring(0, halfMax) + '...' +
					newText.substring(newText.length - halfMax);
			}

			if (replacedText.length === 0) {
				// allow-any-unicode-next-line
				return `${beforeText}❰${newText}❱${afterText}`;
			}
			// allow-any-unicode-next-line
			return `${beforeText}❰${replacedText}↦${newText}❱${afterText}`;
		}).join('\n');
	}
}

export class TextReplacement implements IEquatable<TextReplacement> {
	public static joinReplacements(replacements: TextReplacement[], initialValue: AbstractText): TextReplacement {
		if (replacements.length === 0) { throw new BugIndicatingError(); }
		if (replacements.length === 1) { return replacements[0]; }

		const startPos = replacements[0].range.getStartPosition();
		const endPos = replacements[replacements.length - 1].range.getEndPosition();

		let newText = '';

		for (let i = 0; i < replacements.length; i++) {
			const curEdit = replacements[i];
			newText += curEdit.text;
			if (i < replacements.length - 1) {
				const nextEdit = replacements[i + 1];
				const gapRange = Range.fromPositions(curEdit.range.getEndPosition(), nextEdit.range.getStartPosition());
				const gapText = initialValue.getValueOfRange(gapRange);
				newText += gapText;
			}
		}
		return new TextReplacement(Range.fromPositions(startPos, endPos), newText);
	}

	public static fromStringReplacement(replacement: StringReplacement, initialState: AbstractText): TextReplacement {
		return new TextReplacement(initialState.getTransformer().getRange(replacement.replaceRange), replacement.newText);
	}

	public static delete(range: Range): TextReplacement {
		return new TextReplacement(range, '');
	}

	constructor(
		public readonly range: Range,
		public readonly text: string,
	) {
	}

	get isEmpty(): boolean {
		return this.range.isEmpty() && this.text.length === 0;
	}

	static equals(first: TextReplacement, second: TextReplacement) {
		return first.range.equalsRange(second.range) && first.text === second.text;
	}

	public toSingleEditOperation(): ISingleEditOperation {
		return {
			range: this.range,
			text: this.text,
		};
	}

	public toEdit(): TextEdit {
		return new TextEdit([this]);
	}

	public equals(other: TextReplacement): boolean {
		return TextReplacement.equals(this, other);
	}

	public extendToCoverRange(range: Range, initialValue: AbstractText): TextReplacement {
		if (this.range.containsRange(range)) { return this; }

		const newRange = this.range.plusRange(range);
		const textBefore = initialValue.getValueOfRange(Range.fromPositions(newRange.getStartPosition(), this.range.getStartPosition()));
		const textAfter = initialValue.getValueOfRange(Range.fromPositions(this.range.getEndPosition(), newRange.getEndPosition()));
		const newText = textBefore + this.text + textAfter;
		return new TextReplacement(newRange, newText);
	}

	public extendToFullLine(initialValue: AbstractText): TextReplacement {
		const newRange = new Range(
			this.range.startLineNumber,
			1,
			this.range.endLineNumber,
			initialValue.getTransformer().getLineLength(this.range.endLineNumber) + 1
		);
		return this.extendToCoverRange(newRange, initialValue);
	}

	public removeCommonPrefixAndSuffix(text: AbstractText): TextReplacement {
		const prefix = this.removeCommonPrefix(text);
		const suffix = prefix.removeCommonSuffix(text);
		return suffix;
	}

	public removeCommonPrefix(text: AbstractText): TextReplacement {
		const normalizedOriginalText = text.getValueOfRange(this.range).replaceAll('\r\n', '\n');
		const normalizedModifiedText = this.text.replaceAll('\r\n', '\n');

		const commonPrefixLen = commonPrefixLength(normalizedOriginalText, normalizedModifiedText);
		const start = TextLength.ofText(normalizedOriginalText.substring(0, commonPrefixLen))
			.addToPosition(this.range.getStartPosition());

		const newText = normalizedModifiedText.substring(commonPrefixLen);
		const range = Range.fromPositions(start, this.range.getEndPosition());
		return new TextReplacement(range, newText);
	}

	public removeCommonSuffix(text: AbstractText): TextReplacement {
		const normalizedOriginalText = text.getValueOfRange(this.range).replaceAll('\r\n', '\n');
		const normalizedModifiedText = this.text.replaceAll('\r\n', '\n');

		const commonSuffixLen = commonSuffixLength(normalizedOriginalText, normalizedModifiedText);
		const end = TextLength.ofText(normalizedOriginalText.substring(0, normalizedOriginalText.length - commonSuffixLen))
			.addToPosition(this.range.getStartPosition());

		const newText = normalizedModifiedText.substring(0, normalizedModifiedText.length - commonSuffixLen);
		const range = Range.fromPositions(this.range.getStartPosition(), end);
		return new TextReplacement(range, newText);
	}

	public isEffectiveDeletion(text: AbstractText): boolean {
		let newText = this.text.replaceAll('\r\n', '\n');
		let existingText = text.getValueOfRange(this.range).replaceAll('\r\n', '\n');
		const l = commonPrefixLength(newText, existingText);
		newText = newText.substring(l);
		existingText = existingText.substring(l);
		const r = commonSuffixLength(newText, existingText);
		newText = newText.substring(0, newText.length - r);
		existingText = existingText.substring(0, existingText.length - r);

		return newText === '';
	}

	public toString(): string {
		const start = this.range.getStartPosition();
		const end = this.range.getEndPosition();
		return `(${start.lineNumber},${start.column} -> ${end.lineNumber},${end.column}): "${this.text}"`;
	}
}

function rangeFromPositions(start: Position, end: Position): Range {
	if (start.lineNumber === end.lineNumber && start.column === Number.MAX_SAFE_INTEGER) {
		return Range.fromPositions(end, end);
	} else if (!start.isBeforeOrEqual(end)) {
		throw new BugIndicatingError('start must be before end');
	}
	return new Range(start.lineNumber, start.column, end.lineNumber, end.column);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/misc/eolCounter.ts]---
Location: vscode-main/src/vs/editor/common/core/misc/eolCounter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../../base/common/charCode.js';

export const enum StringEOL {
	Unknown = 0,
	Invalid = 3,
	LF = 1,
	CRLF = 2
}

export function countEOL(text: string): [number, number, number, StringEOL] {
	let eolCount = 0;
	let firstLineLength = 0;
	let lastLineStart = 0;
	let eol: StringEOL = StringEOL.Unknown;
	for (let i = 0, len = text.length; i < len; i++) {
		const chr = text.charCodeAt(i);

		if (chr === CharCode.CarriageReturn) {
			if (eolCount === 0) {
				firstLineLength = i;
			}
			eolCount++;
			if (i + 1 < len && text.charCodeAt(i + 1) === CharCode.LineFeed) {
				// \r\n... case
				eol |= StringEOL.CRLF;
				i++; // skip \n
			} else {
				// \r... case
				eol |= StringEOL.Invalid;
			}
			lastLineStart = i + 1;
		} else if (chr === CharCode.LineFeed) {
			// \n... case
			eol |= StringEOL.LF;
			if (eolCount === 0) {
				firstLineLength = i;
			}
			eolCount++;
			lastLineStart = i + 1;
		}
	}
	if (eolCount === 0) {
		firstLineLength = text.length;
	}
	return [eolCount, firstLineLength, text.length - lastLineStart, eol];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/misc/indentation.ts]---
Location: vscode-main/src/vs/editor/common/core/misc/indentation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { CursorColumns } from '../cursorColumns.js';

function _normalizeIndentationFromWhitespace(str: string, indentSize: number, insertSpaces: boolean): string {
	let spacesCnt = 0;
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) === '\t') {
			spacesCnt = CursorColumns.nextIndentTabStop(spacesCnt, indentSize);
		} else {
			spacesCnt++;
		}
	}

	let result = '';
	if (!insertSpaces) {
		const tabsCnt = Math.floor(spacesCnt / indentSize);
		spacesCnt = spacesCnt % indentSize;
		for (let i = 0; i < tabsCnt; i++) {
			result += '\t';
		}
	}

	for (let i = 0; i < spacesCnt; i++) {
		result += ' ';
	}

	return result;
}

export function normalizeIndentation(str: string, indentSize: number, insertSpaces: boolean): string {
	let firstNonWhitespaceIndex = strings.firstNonWhitespaceIndex(str);
	if (firstNonWhitespaceIndex === -1) {
		firstNonWhitespaceIndex = str.length;
	}
	return _normalizeIndentationFromWhitespace(str.substring(0, firstNonWhitespaceIndex), indentSize, insertSpaces) + str.substring(firstNonWhitespaceIndex);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/misc/rgba.ts]---
Location: vscode-main/src/vs/editor/common/core/misc/rgba.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A very VM friendly rgba datastructure.
 * Please don't touch unless you take a look at the IR.
 */
export class RGBA8 {
	_rgba8Brand: void = undefined;

	static readonly Empty = new RGBA8(0, 0, 0, 0);

	/**
	 * Red: integer in [0-255]
	 */
	public readonly r: number;
	/**
	 * Green: integer in [0-255]
	 */
	public readonly g: number;
	/**
	 * Blue: integer in [0-255]
	 */
	public readonly b: number;
	/**
	 * Alpha: integer in [0-255]
	 */
	public readonly a: number;

	constructor(r: number, g: number, b: number, a: number) {
		this.r = RGBA8._clamp(r);
		this.g = RGBA8._clamp(g);
		this.b = RGBA8._clamp(b);
		this.a = RGBA8._clamp(a);
	}

	public equals(other: RGBA8): boolean {
		return (
			this.r === other.r
			&& this.g === other.g
			&& this.b === other.b
			&& this.a === other.a
		);
	}

	public static _clamp(c: number): number {
		if (c < 0) {
			return 0;
		}
		if (c > 255) {
			return 255;
		}
		return c | 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/misc/textModelDefaults.ts]---
Location: vscode-main/src/vs/editor/common/core/misc/textModelDefaults.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const EDITOR_MODEL_DEFAULTS = {
	tabSize: 4,
	indentSize: 4,
	insertSpaces: true,
	detectIndentation: true,
	trimAutoWhitespace: true,
	largeFileOptimizations: true,
	bracketPairColorizationOptions: {
		enabled: true,
		independentColorPoolPerBracketType: false,
	},
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/common/core/ranges/columnRange.ts]---
Location: vscode-main/src/vs/editor/common/core/ranges/columnRange.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { OffsetRange } from './offsetRange.js';
import { Range } from '../range.js';

/**
 * Represents a 1-based range of columns.
 * Use {@lik OffsetRange} to represent a 0-based range.
*/
export class ColumnRange {
	public static fromOffsetRange(offsetRange: OffsetRange): ColumnRange {
		return new ColumnRange(offsetRange.start + 1, offsetRange.endExclusive + 1);
	}

	constructor(
		/** 1-based */
		public readonly startColumn: number,
		public readonly endColumnExclusive: number
	) {
		if (startColumn > endColumnExclusive) {
			throw new BugIndicatingError(`startColumn ${startColumn} cannot be after endColumnExclusive ${endColumnExclusive}`);
		}
	}

	toRange(lineNumber: number): Range {
		return new Range(lineNumber, this.startColumn, lineNumber, this.endColumnExclusive);
	}

	equals(other: ColumnRange): boolean {
		return this.startColumn === other.startColumn
			&& this.endColumnExclusive === other.endColumnExclusive;
	}

	toZeroBasedOffsetRange(): OffsetRange {
		return new OffsetRange(this.startColumn - 1, this.endColumnExclusive - 1);
	}
}
```

--------------------------------------------------------------------------------

````

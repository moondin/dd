---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 535
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 535 of 552)

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

---[FILE: src/vs/workbench/services/themes/common/plistParser.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/plistParser.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const enum ChCode {
	BOM = 65279,

	SPACE = 32,
	TAB = 9,
	CARRIAGE_RETURN = 13,
	LINE_FEED = 10,

	SLASH = 47,

	LESS_THAN = 60,
	QUESTION_MARK = 63,
	EXCLAMATION_MARK = 33,
}

const enum State {
	ROOT_STATE = 0,
	DICT_STATE = 1,
	ARR_STATE = 2
}
/**
 * A very fast plist parser
 */
export function parse(content: string): any {
	return _parse(content, null, null);
}

function _parse(content: string, filename: string | null, locationKeyName: string | null): any {
	const len = content.length;

	let pos = 0;
	let line = 1;
	let char = 0;

	// Skip UTF8 BOM
	if (len > 0 && content.charCodeAt(0) === ChCode.BOM) {
		pos = 1;
	}

	function advancePosBy(by: number): void {
		if (locationKeyName === null) {
			pos = pos + by;
		} else {
			while (by > 0) {
				const chCode = content.charCodeAt(pos);
				if (chCode === ChCode.LINE_FEED) {
					pos++; line++; char = 0;
				} else {
					pos++; char++;
				}
				by--;
			}
		}
	}
	function advancePosTo(to: number): void {
		if (locationKeyName === null) {
			pos = to;
		} else {
			advancePosBy(to - pos);
		}
	}

	function skipWhitespace(): void {
		while (pos < len) {
			const chCode = content.charCodeAt(pos);
			if (chCode !== ChCode.SPACE && chCode !== ChCode.TAB && chCode !== ChCode.CARRIAGE_RETURN && chCode !== ChCode.LINE_FEED) {
				break;
			}
			advancePosBy(1);
		}
	}

	function advanceIfStartsWith(str: string): boolean {
		if (content.substr(pos, str.length) === str) {
			advancePosBy(str.length);
			return true;
		}
		return false;
	}

	function advanceUntil(str: string): void {
		const nextOccurence = content.indexOf(str, pos);
		if (nextOccurence !== -1) {
			advancePosTo(nextOccurence + str.length);
		} else {
			// EOF
			advancePosTo(len);
		}
	}

	function captureUntil(str: string): string {
		const nextOccurence = content.indexOf(str, pos);
		if (nextOccurence !== -1) {
			const r = content.substring(pos, nextOccurence);
			advancePosTo(nextOccurence + str.length);
			return r;
		} else {
			// EOF
			const r = content.substr(pos);
			advancePosTo(len);
			return r;
		}
	}

	let state = State.ROOT_STATE;

	let cur: any = null;
	const stateStack: State[] = [];
	const objStack: any[] = [];
	let curKey: string | null = null;

	function pushState(newState: State, newCur: any): void {
		stateStack.push(state);
		objStack.push(cur);
		state = newState;
		cur = newCur;
	}

	function popState(): void {
		if (stateStack.length === 0) {
			return fail('illegal state stack');
		}
		state = stateStack.pop()!;
		cur = objStack.pop();
	}

	function fail(msg: string): void {
		throw new Error('Near offset ' + pos + ': ' + msg + ' ~~~' + content.substr(pos, 50) + '~~~');
	}

	const dictState = {
		enterDict: function () {
			if (curKey === null) {
				return fail('missing <key>');
			}
			const newDict: { [key: string]: any } = {};
			if (locationKeyName !== null) {
				newDict[locationKeyName] = {
					filename: filename,
					line: line,
					char: char
				};
			}
			cur[curKey] = newDict;
			curKey = null;
			pushState(State.DICT_STATE, newDict);
		},
		enterArray: function () {
			if (curKey === null) {
				return fail('missing <key>');
			}
			const newArr: any[] = [];
			cur[curKey] = newArr;
			curKey = null;
			pushState(State.ARR_STATE, newArr);
		}
	};

	const arrState = {
		enterDict: function () {
			const newDict: { [key: string]: any } = {};
			if (locationKeyName !== null) {
				newDict[locationKeyName] = {
					filename: filename,
					line: line,
					char: char
				};
			}
			cur.push(newDict);
			pushState(State.DICT_STATE, newDict);
		},
		enterArray: function () {
			const newArr: any[] = [];
			cur.push(newArr);
			pushState(State.ARR_STATE, newArr);
		}
	};


	function enterDict() {
		if (state === State.DICT_STATE) {
			dictState.enterDict();
		} else if (state === State.ARR_STATE) {
			arrState.enterDict();
		} else { // ROOT_STATE
			cur = {};
			if (locationKeyName !== null) {
				cur[locationKeyName] = {
					filename: filename,
					line: line,
					char: char
				};
			}
			pushState(State.DICT_STATE, cur);
		}
	}
	function leaveDict() {
		if (state === State.DICT_STATE) {
			popState();
		} else if (state === State.ARR_STATE) {
			return fail('unexpected </dict>');
		} else { // ROOT_STATE
			return fail('unexpected </dict>');
		}
	}
	function enterArray() {
		if (state === State.DICT_STATE) {
			dictState.enterArray();
		} else if (state === State.ARR_STATE) {
			arrState.enterArray();
		} else { // ROOT_STATE
			cur = [];
			pushState(State.ARR_STATE, cur);
		}
	}
	function leaveArray() {
		if (state === State.DICT_STATE) {
			return fail('unexpected </array>');
		} else if (state === State.ARR_STATE) {
			popState();
		} else { // ROOT_STATE
			return fail('unexpected </array>');
		}
	}
	function acceptKey(val: string) {
		if (state === State.DICT_STATE) {
			if (curKey !== null) {
				return fail('too many <key>');
			}
			curKey = val;
		} else if (state === State.ARR_STATE) {
			return fail('unexpected <key>');
		} else { // ROOT_STATE
			return fail('unexpected <key>');
		}
	}
	function acceptString(val: string) {
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}
	function acceptReal(val: number) {
		if (isNaN(val)) {
			return fail('cannot parse float');
		}
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}
	function acceptInteger(val: number) {
		if (isNaN(val)) {
			return fail('cannot parse integer');
		}
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}
	function acceptDate(val: Date) {
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}
	function acceptData(val: string) {
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}
	function acceptBool(val: boolean) {
		if (state === State.DICT_STATE) {
			if (curKey === null) {
				return fail('missing <key>');
			}
			cur[curKey] = val;
			curKey = null;
		} else if (state === State.ARR_STATE) {
			cur.push(val);
		} else { // ROOT_STATE
			cur = val;
		}
	}

	function escapeVal(str: string): string {
		return str.replace(/&#([0-9]+);/g, function (_: string, m0: string) {
			return String.fromCodePoint(parseInt(m0, 10));
		}).replace(/&#x([0-9a-f]+);/g, function (_: string, m0: string) {
			return String.fromCodePoint(parseInt(m0, 16));
		}).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function (_: string) {
			switch (_) {
				case '&amp;': return '&';
				case '&lt;': return '<';
				case '&gt;': return '>';
				case '&quot;': return '"';
				case '&apos;': return '\'';
			}
			return _;
		});
	}

	interface IParsedTag {
		name: string;
		isClosed: boolean;
	}

	function parseOpenTag(): IParsedTag {
		let r = captureUntil('>');
		let isClosed = false;
		if (r.charCodeAt(r.length - 1) === ChCode.SLASH) {
			isClosed = true;
			r = r.substring(0, r.length - 1);
		}

		return {
			name: r.trim(),
			isClosed: isClosed
		};
	}

	function parseTagValue(tag: IParsedTag): string {
		if (tag.isClosed) {
			return '';
		}
		const val = captureUntil('</');
		advanceUntil('>');
		return escapeVal(val);
	}

	while (pos < len) {
		skipWhitespace();
		if (pos >= len) {
			break;
		}

		const chCode = content.charCodeAt(pos);
		advancePosBy(1);
		if (chCode !== ChCode.LESS_THAN) {
			return fail('expected <');
		}

		if (pos >= len) {
			return fail('unexpected end of input');
		}

		const peekChCode = content.charCodeAt(pos);

		if (peekChCode === ChCode.QUESTION_MARK) {
			advancePosBy(1);
			advanceUntil('?>');
			continue;
		}

		if (peekChCode === ChCode.EXCLAMATION_MARK) {
			advancePosBy(1);

			if (advanceIfStartsWith('--')) {
				advanceUntil('-->');
				continue;
			}

			advanceUntil('>');
			continue;
		}

		if (peekChCode === ChCode.SLASH) {
			advancePosBy(1);
			skipWhitespace();

			if (advanceIfStartsWith('plist')) {
				advanceUntil('>');
				continue;
			}

			if (advanceIfStartsWith('dict')) {
				advanceUntil('>');
				leaveDict();
				continue;
			}

			if (advanceIfStartsWith('array')) {
				advanceUntil('>');
				leaveArray();
				continue;
			}

			return fail('unexpected closed tag');
		}

		const tag = parseOpenTag();

		switch (tag.name) {
			case 'dict':
				enterDict();
				if (tag.isClosed) {
					leaveDict();
				}
				continue;

			case 'array':
				enterArray();
				if (tag.isClosed) {
					leaveArray();
				}
				continue;

			case 'key':
				acceptKey(parseTagValue(tag));
				continue;

			case 'string':
				acceptString(parseTagValue(tag));
				continue;

			case 'real':
				acceptReal(parseFloat(parseTagValue(tag)));
				continue;

			case 'integer':
				acceptInteger(parseInt(parseTagValue(tag), 10));
				continue;

			case 'date':
				acceptDate(new Date(parseTagValue(tag)));
				continue;

			case 'data':
				acceptData(parseTagValue(tag));
				continue;

			case 'true':
				parseTagValue(tag);
				acceptBool(true);
				continue;

			case 'false':
				parseTagValue(tag);
				acceptBool(false);
				continue;
		}

		if (/^plist/.test(tag.name)) {
			continue;
		}

		return fail('unexpected opened tag ' + tag.name);
	}

	return cur;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/productIconThemeSchema.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/productIconThemeSchema.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { fontIdErrorMessage, fontIdRegex, fontStyleRegex, fontWeightRegex, iconsSchemaId } from '../../../../platform/theme/common/iconRegistry.js';

const schemaId = 'vscode://schemas/product-icon-theme';
const schema: IJSONSchema = {
	type: 'object',
	allowComments: true,
	allowTrailingCommas: true,
	properties: {
		fonts: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: nls.localize('schema.id', 'The ID of the font.'),
						pattern: fontIdRegex.source,
						patternErrorMessage: fontIdErrorMessage
					},
					src: {
						type: 'array',
						description: nls.localize('schema.src', 'The location of the font.'),
						items: {
							type: 'object',
							properties: {
								path: {
									type: 'string',
									description: nls.localize('schema.font-path', 'The font path, relative to the current product icon theme file.'),
								},
								format: {
									type: 'string',
									description: nls.localize('schema.font-format', 'The format of the font.'),
									enum: ['woff', 'woff2', 'truetype', 'opentype', 'embedded-opentype', 'svg']
								}
							},
							required: [
								'path',
								'format'
							]
						}
					},
					weight: {
						type: 'string',
						description: nls.localize('schema.font-weight', 'The weight of the font. See https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight for valid values.'),
						anyOf: [
							{ enum: ['normal', 'bold', 'lighter', 'bolder'] },
							{ type: 'string', pattern: fontWeightRegex.source }
						]
					},
					style: {
						type: 'string',
						description: nls.localize('schema.font-style', 'The style of the font. See https://developer.mozilla.org/en-US/docs/Web/CSS/font-style for valid values.'),
						anyOf: [
							{ enum: ['normal', 'italic', 'oblique'] },
							{ type: 'string', pattern: fontStyleRegex.source }
						]
					}
				},
				required: [
					'id',
					'src'
				]
			}
		},
		iconDefinitions: {
			description: nls.localize('schema.iconDefinitions', 'Association of icon name to a font character.'),
			$ref: iconsSchemaId
		}
	}
};

export function registerProductIconThemeSchemas() {
	const schemaRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	schemaRegistry.registerSchema(schemaId, schema);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/textMateScopeMatcher.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/textMateScopeMatcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

export interface MatcherWithPriority<T> {
	matcher: Matcher<T>;
	priority: -1 | 0 | 1;
}

export interface Matcher<T> {
	(matcherInput: T): number;
}

export function createMatchers<T>(selector: string, matchesName: (names: string[], matcherInput: T) => number, results: MatcherWithPriority<T>[]): void {
	const tokenizer = newTokenizer(selector);
	let token = tokenizer.next();
	while (token !== null) {
		let priority: -1 | 0 | 1 = 0;
		if (token.length === 2 && token.charAt(1) === ':') {
			switch (token.charAt(0)) {
				case 'R': priority = 1; break;
				case 'L': priority = -1; break;
				default:
					console.log(`Unknown priority ${token} in scope selector`);
			}
			token = tokenizer.next();
		}
		const matcher = parseConjunction();
		if (matcher) {
			results.push({ matcher, priority });
		}
		if (token !== ',') {
			break;
		}
		token = tokenizer.next();
	}

	function parseOperand(): Matcher<T> | null {
		if (token === '-') {
			token = tokenizer.next();
			const expressionToNegate = parseOperand();
			if (!expressionToNegate) {
				return null;
			}
			return matcherInput => {
				const score = expressionToNegate(matcherInput);
				return score < 0 ? 0 : -1;
			};
		}
		if (token === '(') {
			token = tokenizer.next();
			const expressionInParents = parseInnerExpression();
			if (token === ')') {
				token = tokenizer.next();
			}
			return expressionInParents;
		}
		if (isIdentifier(token)) {
			const identifiers: string[] = [];
			do {
				identifiers.push(token);
				token = tokenizer.next();
			} while (isIdentifier(token));
			return matcherInput => matchesName(identifiers, matcherInput);
		}
		return null;
	}
	function parseConjunction(): Matcher<T> | null {
		let matcher = parseOperand();
		if (!matcher) {
			return null;
		}

		const matchers: Matcher<T>[] = [];
		while (matcher) {
			matchers.push(matcher);
			matcher = parseOperand();
		}
		return matcherInput => {  // and
			let min = matchers[0](matcherInput);
			for (let i = 1; min >= 0 && i < matchers.length; i++) {
				min = Math.min(min, matchers[i](matcherInput));
			}
			return min;
		};
	}
	function parseInnerExpression(): Matcher<T> | null {
		let matcher = parseConjunction();
		if (!matcher) {
			return null;
		}
		const matchers: Matcher<T>[] = [];
		while (matcher) {
			matchers.push(matcher);
			if (token === '|' || token === ',') {
				do {
					token = tokenizer.next();
				} while (token === '|' || token === ','); // ignore subsequent commas
			} else {
				break;
			}
			matcher = parseConjunction();
		}
		return matcherInput => {  // or
			let max = matchers[0](matcherInput);
			for (let i = 1; i < matchers.length; i++) {
				max = Math.max(max, matchers[i](matcherInput));
			}
			return max;
		};
	}
}

function isIdentifier(token: string | null): token is string {
	return !!token && !!token.match(/[\w\.:]+/);
}

function newTokenizer(input: string): { next: () => string | null } {
	const regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
	let match = regex.exec(input);
	return {
		next: () => {
			if (!match) {
				return null;
			}
			const res = match[0];
			match = regex.exec(input);
			return res;
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/themeCompatibility.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/themeCompatibility.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextMateThemingRule, IColorMap } from './workbenchThemeService.js';
import { Color } from '../../../../base/common/color.js';
import * as colorRegistry from '../../../../platform/theme/common/colorRegistry.js';

import * as editorColorRegistry from '../../../../editor/common/core/editorColorRegistry.js';

const settingToColorIdMapping: { [settingId: string]: string[] } = {};
function addSettingMapping(settingId: string, colorId: string) {
	let colorIds = settingToColorIdMapping[settingId];
	if (!colorIds) {
		settingToColorIdMapping[settingId] = colorIds = [];
	}
	colorIds.push(colorId);
}

export function convertSettings(oldSettings: ITextMateThemingRule[], result: { textMateRules: ITextMateThemingRule[]; colors: IColorMap }): void {
	for (const rule of oldSettings) {
		result.textMateRules.push(rule);
		if (!rule.scope) {
			const settings = rule.settings;
			if (!settings) {
				rule.settings = {};
			} else {
				for (const settingKey in settings) {
					const key = <keyof typeof settings>settingKey;
					const mappings = settingToColorIdMapping[key];
					if (mappings) {
						const colorHex = settings[key];
						if (typeof colorHex === 'string') {
							const color = Color.fromHex(colorHex);
							for (const colorId of mappings) {
								result.colors[colorId] = color;
							}
						}
					}
					if (key !== 'foreground' && key !== 'background' && key !== 'fontStyle') {
						delete settings[key];
					}
				}
			}
		}
	}
}

addSettingMapping('background', colorRegistry.editorBackground);
addSettingMapping('foreground', colorRegistry.editorForeground);
addSettingMapping('selection', colorRegistry.editorSelectionBackground);
addSettingMapping('inactiveSelection', colorRegistry.editorInactiveSelection);
addSettingMapping('selectionHighlightColor', colorRegistry.editorSelectionHighlight);
addSettingMapping('findMatchHighlight', colorRegistry.editorFindMatchHighlight);
addSettingMapping('currentFindMatchHighlight', colorRegistry.editorFindMatch);
addSettingMapping('hoverHighlight', colorRegistry.editorHoverHighlight);
addSettingMapping('wordHighlight', 'editor.wordHighlightBackground'); // inlined to avoid editor/contrib dependenies
addSettingMapping('wordHighlightStrong', 'editor.wordHighlightStrongBackground');
addSettingMapping('findRangeHighlight', colorRegistry.editorFindRangeHighlight);
addSettingMapping('findMatchHighlight', 'peekViewResult.matchHighlightBackground');
addSettingMapping('referenceHighlight', 'peekViewEditor.matchHighlightBackground');
addSettingMapping('lineHighlight', editorColorRegistry.editorLineHighlight);
addSettingMapping('rangeHighlight', editorColorRegistry.editorRangeHighlight);
addSettingMapping('caret', editorColorRegistry.editorCursorForeground);
addSettingMapping('invisibles', editorColorRegistry.editorWhitespaces);
addSettingMapping('guide', editorColorRegistry.editorIndentGuide1);
addSettingMapping('activeGuide', editorColorRegistry.editorActiveIndentGuide1);

const ansiColorMap = ['ansiBlack', 'ansiRed', 'ansiGreen', 'ansiYellow', 'ansiBlue', 'ansiMagenta', 'ansiCyan', 'ansiWhite',
	'ansiBrightBlack', 'ansiBrightRed', 'ansiBrightGreen', 'ansiBrightYellow', 'ansiBrightBlue', 'ansiBrightMagenta', 'ansiBrightCyan', 'ansiBrightWhite'
];

for (const color of ansiColorMap) {
	addSettingMapping(color, 'terminal.' + color);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/themeConfiguration.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/themeConfiguration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import * as types from '../../../../base/common/types.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, IConfigurationPropertySchema, IConfigurationNode, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';

import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { textmateColorsSchemaId, textmateColorGroupSchemaId } from './colorThemeSchema.js';
import { workbenchColorsSchemaId } from '../../../../platform/theme/common/colorRegistry.js';
import { tokenStylingSchemaId } from '../../../../platform/theme/common/tokenClassificationRegistry.js';
import { ThemeSettings, IWorkbenchColorTheme, IWorkbenchFileIconTheme, IColorCustomizations, ITokenColorCustomizations, IWorkbenchProductIconTheme, ISemanticTokenColorCustomizations, ThemeSettingTarget, ThemeSettingDefaults } from './workbenchThemeService.js';
import { IConfigurationService, ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { isWeb } from '../../../../base/common/platform.js';
import { ColorScheme } from '../../../../platform/theme/common/theme.js';
import { IHostColorSchemeService } from './hostColorSchemeService.js';

// Configuration: Themes
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

const colorThemeSettingEnum: string[] = [];
const colorThemeSettingEnumItemLabels: string[] = [];
const colorThemeSettingEnumDescriptions: string[] = [];

export function formatSettingAsLink(str: string) {
	return `\`#${str}#\``;
}

export const COLOR_THEME_CONFIGURATION_SETTINGS_TAG = 'colorThemeConfiguration';

const colorThemeSettingSchema: IConfigurationPropertySchema = {
	type: 'string',
	markdownDescription: nls.localize({ key: 'colorTheme', comment: ['{0} will become a link to another setting.'] }, "Specifies the color theme used in the workbench when {0} is not enabled.", formatSettingAsLink(ThemeSettings.DETECT_COLOR_SCHEME)),
	default: isWeb ? ThemeSettingDefaults.COLOR_THEME_LIGHT : ThemeSettingDefaults.COLOR_THEME_DARK,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
	enum: colorThemeSettingEnum,
	enumDescriptions: colorThemeSettingEnumDescriptions,
	enumItemLabels: colorThemeSettingEnumItemLabels,
	errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
const preferredDarkThemeSettingSchema: IConfigurationPropertySchema = {
	type: 'string', //
	markdownDescription: nls.localize({ key: 'preferredDarkColorTheme', comment: ['{0} will become a link to another setting.'] }, 'Specifies the color theme when system color mode is dark and {0} is enabled.', formatSettingAsLink(ThemeSettings.DETECT_COLOR_SCHEME)),
	default: ThemeSettingDefaults.COLOR_THEME_DARK,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
	enum: colorThemeSettingEnum,
	enumDescriptions: colorThemeSettingEnumDescriptions,
	enumItemLabels: colorThemeSettingEnumItemLabels,
	errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
const preferredLightThemeSettingSchema: IConfigurationPropertySchema = {
	type: 'string',
	markdownDescription: nls.localize({ key: 'preferredLightColorTheme', comment: ['{0} will become a link to another setting.'] }, 'Specifies the color theme when system color mode is light and {0} is enabled.', formatSettingAsLink(ThemeSettings.DETECT_COLOR_SCHEME)),
	default: ThemeSettingDefaults.COLOR_THEME_LIGHT,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
	enum: colorThemeSettingEnum,
	enumDescriptions: colorThemeSettingEnumDescriptions,
	enumItemLabels: colorThemeSettingEnumItemLabels,
	errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
const preferredHCDarkThemeSettingSchema: IConfigurationPropertySchema = {
	type: 'string',
	markdownDescription: nls.localize({ key: 'preferredHCDarkColorTheme', comment: ['{0} will become a link to another setting.'] }, 'Specifies the color theme when in high contrast dark mode and {0} is enabled.', formatSettingAsLink(ThemeSettings.DETECT_HC)),
	default: ThemeSettingDefaults.COLOR_THEME_HC_DARK,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
	enum: colorThemeSettingEnum,
	enumDescriptions: colorThemeSettingEnumDescriptions,
	enumItemLabels: colorThemeSettingEnumItemLabels,
	errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
const preferredHCLightThemeSettingSchema: IConfigurationPropertySchema = {
	type: 'string',
	markdownDescription: nls.localize({ key: 'preferredHCLightColorTheme', comment: ['{0} will become a link to another setting.'] }, 'Specifies the color theme when in high contrast light mode and {0} is enabled.', formatSettingAsLink(ThemeSettings.DETECT_HC)),
	default: ThemeSettingDefaults.COLOR_THEME_HC_LIGHT,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
	enum: colorThemeSettingEnum,
	enumDescriptions: colorThemeSettingEnumDescriptions,
	enumItemLabels: colorThemeSettingEnumItemLabels,
	errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
};
const detectColorSchemeSettingSchema: IConfigurationPropertySchema = {
	type: 'boolean',
	markdownDescription: nls.localize({ key: 'detectColorScheme', comment: ['{0} and {1} will become links to other settings.'] }, 'If enabled, will automatically select a color theme based on the system color mode. If the system color mode is dark, {0} is used, else {1}.', formatSettingAsLink(ThemeSettings.PREFERRED_DARK_THEME), formatSettingAsLink(ThemeSettings.PREFERRED_LIGHT_THEME)),
	default: false,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
};

const colorCustomizationsSchema: IConfigurationPropertySchema = {
	type: 'object',
	description: nls.localize('workbenchColors', "Overrides colors from the currently selected color theme."),
	allOf: [{ $ref: workbenchColorsSchemaId }],
	default: {},
	defaultSnippets: [{
		body: {
		}
	}]
};
const fileIconThemeSettingSchema: IConfigurationPropertySchema = {
	type: ['string', 'null'],
	default: ThemeSettingDefaults.FILE_ICON_THEME,
	description: nls.localize('iconTheme', "Specifies the file icon theme used in the workbench or 'null' to not show any file icons."),
	enum: [null],
	enumItemLabels: [nls.localize('noIconThemeLabel', 'None')],
	enumDescriptions: [nls.localize('noIconThemeDesc', 'No file icons')],
	errorMessage: nls.localize('iconThemeError', "File icon theme is unknown or not installed.")
};
const productIconThemeSettingSchema: IConfigurationPropertySchema = {
	type: ['string', 'null'],
	default: ThemeSettingDefaults.PRODUCT_ICON_THEME,
	description: nls.localize('productIconTheme', "Specifies the product icon theme used."),
	enum: [ThemeSettingDefaults.PRODUCT_ICON_THEME],
	enumItemLabels: [nls.localize('defaultProductIconThemeLabel', 'Default')],
	enumDescriptions: [nls.localize('defaultProductIconThemeDesc', 'Default')],
	errorMessage: nls.localize('productIconThemeError', "Product icon theme is unknown or not installed.")
};

const detectHCSchemeSettingSchema: IConfigurationPropertySchema = {
	type: 'boolean',
	default: true,
	markdownDescription: nls.localize({ key: 'autoDetectHighContrast', comment: ['{0} and {1} will become links to other settings.'] }, "If enabled, will automatically change to high contrast theme if the OS is using a high contrast theme. The high contrast theme to use is specified by {0} and {1}.", formatSettingAsLink(ThemeSettings.PREFERRED_HC_DARK_THEME), formatSettingAsLink(ThemeSettings.PREFERRED_HC_LIGHT_THEME)),
	scope: ConfigurationScope.APPLICATION,
	tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
};

const themeSettingsConfiguration: IConfigurationNode = {
	id: 'workbench',
	order: 7.1,
	type: 'object',
	properties: {
		[ThemeSettings.COLOR_THEME]: colorThemeSettingSchema,
		[ThemeSettings.PREFERRED_DARK_THEME]: preferredDarkThemeSettingSchema,
		[ThemeSettings.PREFERRED_LIGHT_THEME]: preferredLightThemeSettingSchema,
		[ThemeSettings.PREFERRED_HC_DARK_THEME]: preferredHCDarkThemeSettingSchema,
		[ThemeSettings.PREFERRED_HC_LIGHT_THEME]: preferredHCLightThemeSettingSchema,
		[ThemeSettings.FILE_ICON_THEME]: fileIconThemeSettingSchema,
		[ThemeSettings.COLOR_CUSTOMIZATIONS]: colorCustomizationsSchema,
		[ThemeSettings.PRODUCT_ICON_THEME]: productIconThemeSettingSchema
	}
};
configurationRegistry.registerConfiguration(themeSettingsConfiguration);

const themeSettingsWindowConfiguration: IConfigurationNode = {
	id: 'window',
	order: 8.1,
	type: 'object',
	properties: {
		[ThemeSettings.DETECT_HC]: detectHCSchemeSettingSchema,
		[ThemeSettings.DETECT_COLOR_SCHEME]: detectColorSchemeSettingSchema,
	}
};
configurationRegistry.registerConfiguration(themeSettingsWindowConfiguration);

function tokenGroupSettings(description: string): IJSONSchema {
	return {
		description,
		$ref: textmateColorGroupSchemaId
	};
}

const themeSpecificSettingKey = '^\\[[^\\]]*(\\]\\s*\\[[^\\]]*)*\\]$';

const tokenColorSchema: IJSONSchema = {
	type: 'object',
	properties: {
		comments: tokenGroupSettings(nls.localize('editorColors.comments', "Sets the colors and styles for comments")),
		strings: tokenGroupSettings(nls.localize('editorColors.strings', "Sets the colors and styles for strings literals.")),
		keywords: tokenGroupSettings(nls.localize('editorColors.keywords', "Sets the colors and styles for keywords.")),
		numbers: tokenGroupSettings(nls.localize('editorColors.numbers', "Sets the colors and styles for number literals.")),
		types: tokenGroupSettings(nls.localize('editorColors.types', "Sets the colors and styles for type declarations and references.")),
		functions: tokenGroupSettings(nls.localize('editorColors.functions', "Sets the colors and styles for functions declarations and references.")),
		variables: tokenGroupSettings(nls.localize('editorColors.variables', "Sets the colors and styles for variables declarations and references.")),
		textMateRules: {
			description: nls.localize('editorColors.textMateRules', 'Sets colors and styles using textmate theming rules (advanced).'),
			$ref: textmateColorsSchemaId
		},
		semanticHighlighting: {
			description: nls.localize('editorColors.semanticHighlighting', 'Whether semantic highlighting should be enabled for this theme.'),
			deprecationMessage: nls.localize('editorColors.semanticHighlighting.deprecationMessage', 'Use `enabled` in `editor.semanticTokenColorCustomizations` setting instead.'),
			markdownDeprecationMessage: nls.localize({ key: 'editorColors.semanticHighlighting.deprecationMessageMarkdown', comment: ['{0} will become a link to another setting.'] }, 'Use `enabled` in {0} setting instead.', formatSettingAsLink('editor.semanticTokenColorCustomizations')),
			type: 'boolean'
		}
	},
	additionalProperties: false
};

const tokenColorCustomizationSchema: IConfigurationPropertySchema = {
	description: nls.localize('editorColors', "Overrides editor syntax colors and font style from the currently selected color theme."),
	default: {},
	allOf: [{ ...tokenColorSchema, patternProperties: { '^\\[': {} } }]
};

const semanticTokenColorSchema: IJSONSchema = {
	type: 'object',
	properties: {
		enabled: {
			type: 'boolean',
			description: nls.localize('editorColors.semanticHighlighting.enabled', 'Whether semantic highlighting is enabled or disabled for this theme'),
			suggestSortText: '0_enabled'
		},
		rules: {
			$ref: tokenStylingSchemaId,
			description: nls.localize('editorColors.semanticHighlighting.rules', 'Semantic token styling rules for this theme.'),
			suggestSortText: '0_rules'
		}
	},
	additionalProperties: false
};

const semanticTokenColorCustomizationSchema: IConfigurationPropertySchema = {
	description: nls.localize('semanticTokenColors', "Overrides editor semantic token color and styles from the currently selected color theme."),
	default: {},
	allOf: [{ ...semanticTokenColorSchema, patternProperties: { '^\\[': {} } }]
};

const tokenColorCustomizationConfiguration: IConfigurationNode = {
	id: 'editor',
	order: 7.2,
	type: 'object',
	properties: {
		[ThemeSettings.TOKEN_COLOR_CUSTOMIZATIONS]: tokenColorCustomizationSchema,
		[ThemeSettings.SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS]: semanticTokenColorCustomizationSchema
	}
};

configurationRegistry.registerConfiguration(tokenColorCustomizationConfiguration);

export function updateColorThemeConfigurationSchemas(themes: IWorkbenchColorTheme[]) {
	// updates enum for the 'workbench.colorTheme` setting
	themes.sort((a, b) => a.label.localeCompare(b.label));
	colorThemeSettingEnum.splice(0, colorThemeSettingEnum.length, ...themes.map(t => t.settingsId));
	colorThemeSettingEnumDescriptions.splice(0, colorThemeSettingEnumDescriptions.length, ...themes.map(t => t.description || ''));
	colorThemeSettingEnumItemLabels.splice(0, colorThemeSettingEnumItemLabels.length, ...themes.map(t => t.label || ''));

	const themeSpecificWorkbenchColors: IJSONSchema = { properties: {} };
	const themeSpecificTokenColors: IJSONSchema = { properties: {} };
	const themeSpecificSemanticTokenColors: IJSONSchema = { properties: {} };

	const workbenchColors = { $ref: workbenchColorsSchemaId, additionalProperties: false };
	const tokenColors = { properties: tokenColorSchema.properties, additionalProperties: false };
	for (const t of themes) {
		// add theme specific color customization ("[Abyss]":{ ... })
		const themeId = `[${t.settingsId}]`;
		themeSpecificWorkbenchColors.properties![themeId] = workbenchColors;
		themeSpecificTokenColors.properties![themeId] = tokenColors;
		themeSpecificSemanticTokenColors.properties![themeId] = semanticTokenColorSchema;
	}
	themeSpecificWorkbenchColors.patternProperties = { [themeSpecificSettingKey]: workbenchColors };
	themeSpecificTokenColors.patternProperties = { [themeSpecificSettingKey]: tokenColors };
	themeSpecificSemanticTokenColors.patternProperties = { [themeSpecificSettingKey]: semanticTokenColorSchema };

	colorCustomizationsSchema.allOf![1] = themeSpecificWorkbenchColors;
	tokenColorCustomizationSchema.allOf![1] = themeSpecificTokenColors;
	semanticTokenColorCustomizationSchema.allOf![1] = themeSpecificSemanticTokenColors;

	configurationRegistry.notifyConfigurationSchemaUpdated(themeSettingsConfiguration, tokenColorCustomizationConfiguration);
}

export function updateFileIconThemeConfigurationSchemas(themes: IWorkbenchFileIconTheme[]) {
	fileIconThemeSettingSchema.enum!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.settingsId));
	fileIconThemeSettingSchema.enumItemLabels!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.label));
	fileIconThemeSettingSchema.enumDescriptions!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.description || ''));

	configurationRegistry.notifyConfigurationSchemaUpdated(themeSettingsConfiguration);
}

export function updateProductIconThemeConfigurationSchemas(themes: IWorkbenchProductIconTheme[]) {
	productIconThemeSettingSchema.enum!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.settingsId));
	productIconThemeSettingSchema.enumItemLabels!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.label));
	productIconThemeSettingSchema.enumDescriptions!.splice(1, Number.MAX_VALUE, ...themes.map(t => t.description || ''));

	configurationRegistry.notifyConfigurationSchemaUpdated(themeSettingsConfiguration);
}

const colorSchemeToPreferred = {
	[ColorScheme.DARK]: ThemeSettings.PREFERRED_DARK_THEME,
	[ColorScheme.LIGHT]: ThemeSettings.PREFERRED_LIGHT_THEME,
	[ColorScheme.HIGH_CONTRAST_DARK]: ThemeSettings.PREFERRED_HC_DARK_THEME,
	[ColorScheme.HIGH_CONTRAST_LIGHT]: ThemeSettings.PREFERRED_HC_LIGHT_THEME
};

export class ThemeConfiguration {
	constructor(private configurationService: IConfigurationService, private hostColorService: IHostColorSchemeService) {
	}

	public get colorTheme(): string {
		return this.configurationService.getValue<string>(this.getColorThemeSettingId());
	}

	public get fileIconTheme(): string | null {
		return this.configurationService.getValue<string | null>(ThemeSettings.FILE_ICON_THEME);
	}

	public get productIconTheme(): string {
		return this.configurationService.getValue<string>(ThemeSettings.PRODUCT_ICON_THEME);
	}

	public get colorCustomizations(): IColorCustomizations {
		return this.configurationService.getValue<IColorCustomizations>(ThemeSettings.COLOR_CUSTOMIZATIONS) || {};
	}

	public get tokenColorCustomizations(): ITokenColorCustomizations {
		return this.configurationService.getValue<ITokenColorCustomizations>(ThemeSettings.TOKEN_COLOR_CUSTOMIZATIONS) || {};
	}

	public get semanticTokenColorCustomizations(): ISemanticTokenColorCustomizations | undefined {
		return this.configurationService.getValue<ISemanticTokenColorCustomizations>(ThemeSettings.SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS);
	}

	public getPreferredColorScheme(): ColorScheme | undefined {
		if (this.configurationService.getValue(ThemeSettings.DETECT_HC) && this.hostColorService.highContrast) {
			return this.hostColorService.dark ? ColorScheme.HIGH_CONTRAST_DARK : ColorScheme.HIGH_CONTRAST_LIGHT;
		}
		if (this.configurationService.getValue(ThemeSettings.DETECT_COLOR_SCHEME)) {
			return this.hostColorService.dark ? ColorScheme.DARK : ColorScheme.LIGHT;
		}
		return undefined;
	}

	public isDetectingColorScheme(): boolean {
		return this.configurationService.getValue(ThemeSettings.DETECT_COLOR_SCHEME);
	}

	public getColorThemeSettingId(): ThemeSettings {
		const preferredScheme = this.getPreferredColorScheme();
		return preferredScheme ? colorSchemeToPreferred[preferredScheme] : ThemeSettings.COLOR_THEME;
	}

	public async setColorTheme(theme: IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme> {
		await this.writeConfiguration(this.getColorThemeSettingId(), theme.settingsId, settingsTarget);
		return theme;
	}

	public async setFileIconTheme(theme: IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme> {
		await this.writeConfiguration(ThemeSettings.FILE_ICON_THEME, theme.settingsId, settingsTarget);
		return theme;
	}

	public async setProductIconTheme(theme: IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme> {
		await this.writeConfiguration(ThemeSettings.PRODUCT_ICON_THEME, theme.settingsId, settingsTarget);
		return theme;
	}

	public isDefaultColorTheme(): boolean {
		const settings = this.configurationService.inspect(this.getColorThemeSettingId());
		return settings && settings.default?.value === settings.value;
	}

	public findAutoConfigurationTarget(key: string) {
		const settings = this.configurationService.inspect(key);
		if (!types.isUndefined(settings.workspaceFolderValue)) {
			return ConfigurationTarget.WORKSPACE_FOLDER;
		} else if (!types.isUndefined(settings.workspaceValue)) {
			return ConfigurationTarget.WORKSPACE;
		} else if (!types.isUndefined(settings.userRemote)) {
			return ConfigurationTarget.USER_REMOTE;
		}
		return ConfigurationTarget.USER;
	}

	private async writeConfiguration(key: string, value: unknown, settingsTarget: ThemeSettingTarget): Promise<void> {
		if (settingsTarget === undefined || settingsTarget === 'preview') {
			return;
		}

		const settings = this.configurationService.inspect(key);
		if (settingsTarget === 'auto') {
			return this.configurationService.updateValue(key, value);
		}

		if (settingsTarget === ConfigurationTarget.USER) {
			if (value === settings.userValue) {
				return Promise.resolve(undefined); // nothing to do
			} else if (value === settings.defaultValue) {
				if (types.isUndefined(settings.userValue)) {
					return Promise.resolve(undefined); // nothing to do
				}
				value = undefined; // remove configuration from user settings
			}
		} else if (settingsTarget === ConfigurationTarget.WORKSPACE || settingsTarget === ConfigurationTarget.WORKSPACE_FOLDER || settingsTarget === ConfigurationTarget.USER_REMOTE) {
			if (value === settings.value) {
				return Promise.resolve(undefined); // nothing to do
			}
		}
		return this.configurationService.updateValue(key, value, settingsTarget);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/themeExtensionPoints.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/themeExtensionPoints.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import * as types from '../../../../base/common/types.js';
import * as resources from '../../../../base/common/resources.js';
import { ExtensionMessageCollector, IExtensionPoint, ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { ExtensionData, IThemeExtensionPoint } from './workbenchThemeService.js';

import { Event, Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { Extensions, IExtensionFeatureMarkdownRenderer, IExtensionFeaturesRegistry, IRenderedData } from '../../extensionManagement/common/extensionFeatures.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';

export function registerColorThemeExtensionPoint() {
	return ExtensionsRegistry.registerExtensionPoint<IThemeExtensionPoint[]>({
		extensionPoint: 'themes',
		jsonSchema: {
			description: nls.localize('vscode.extension.contributes.themes', 'Contributes textmate color themes.'),
			type: 'array',
			items: {
				type: 'object',
				defaultSnippets: [{ body: { label: '${1:label}', id: '${2:id}', uiTheme: ThemeTypeSelector.VS_DARK, path: './themes/${3:id}.tmTheme.' } }],
				properties: {
					id: {
						description: nls.localize('vscode.extension.contributes.themes.id', 'Id of the color theme as used in the user settings.'),
						type: 'string'
					},
					label: {
						description: nls.localize('vscode.extension.contributes.themes.label', 'Label of the color theme as shown in the UI.'),
						type: 'string'
					},
					uiTheme: {
						description: nls.localize('vscode.extension.contributes.themes.uiTheme', 'Base theme defining the colors around the editor: \'vs\' is the light color theme, \'vs-dark\' is the dark color theme. \'hc-black\' is the dark high contrast theme, \'hc-light\' is the light high contrast theme.'),
						enum: [ThemeTypeSelector.VS, ThemeTypeSelector.VS_DARK, ThemeTypeSelector.HC_BLACK, ThemeTypeSelector.HC_LIGHT]
					},
					path: {
						description: nls.localize('vscode.extension.contributes.themes.path', 'Path of the tmTheme file. The path is relative to the extension folder and is typically \'./colorthemes/awesome-color-theme.json\'.'),
						type: 'string'
					}
				},
				required: ['path', 'uiTheme']
			}
		}
	});
}
export function registerFileIconThemeExtensionPoint() {
	return ExtensionsRegistry.registerExtensionPoint<IThemeExtensionPoint[]>({
		extensionPoint: 'iconThemes',
		jsonSchema: {
			description: nls.localize('vscode.extension.contributes.iconThemes', 'Contributes file icon themes.'),
			type: 'array',
			items: {
				type: 'object',
				defaultSnippets: [{ body: { id: '${1:id}', label: '${2:label}', path: './fileicons/${3:id}-icon-theme.json' } }],
				properties: {
					id: {
						description: nls.localize('vscode.extension.contributes.iconThemes.id', 'Id of the file icon theme as used in the user settings.'),
						type: 'string'
					},
					label: {
						description: nls.localize('vscode.extension.contributes.iconThemes.label', 'Label of the file icon theme as shown in the UI.'),
						type: 'string'
					},
					path: {
						description: nls.localize('vscode.extension.contributes.iconThemes.path', 'Path of the file icon theme definition file. The path is relative to the extension folder and is typically \'./fileicons/awesome-icon-theme.json\'.'),
						type: 'string'
					}
				},
				required: ['path', 'id']
			}
		}
	});
}

export function registerProductIconThemeExtensionPoint() {
	return ExtensionsRegistry.registerExtensionPoint<IThemeExtensionPoint[]>({
		extensionPoint: 'productIconThemes',
		jsonSchema: {
			description: nls.localize('vscode.extension.contributes.productIconThemes', 'Contributes product icon themes.'),
			type: 'array',
			items: {
				type: 'object',
				defaultSnippets: [{ body: { id: '${1:id}', label: '${2:label}', path: './producticons/${3:id}-product-icon-theme.json' } }],
				properties: {
					id: {
						description: nls.localize('vscode.extension.contributes.productIconThemes.id', 'Id of the product icon theme as used in the user settings.'),
						type: 'string'
					},
					label: {
						description: nls.localize('vscode.extension.contributes.productIconThemes.label', 'Label of the product icon theme as shown in the UI.'),
						type: 'string'
					},
					path: {
						description: nls.localize('vscode.extension.contributes.productIconThemes.path', 'Path of the product icon theme definition file. The path is relative to the extension folder and is typically \'./producticons/awesome-product-icon-theme.json\'.'),
						type: 'string'
					}
				},
				required: ['path', 'id']
			}
		}
	});
}

class ThemeDataRenderer extends Disposable implements IExtensionFeatureMarkdownRenderer {

	readonly type = 'markdown';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.themes || !!manifest.contributes?.iconThemes || !!manifest.contributes?.productIconThemes;
	}

	render(manifest: IExtensionManifest): IRenderedData<IMarkdownString> {
		const markdown = new MarkdownString();
		if (manifest.contributes?.themes) {
			markdown.appendMarkdown(`### ${nls.localize('color themes', "Color Themes")}\n\n`);
			for (const theme of manifest.contributes.themes) {
				markdown.appendMarkdown(`- ${theme.label}\n`);
			}
		}
		if (manifest.contributes?.iconThemes) {
			markdown.appendMarkdown(`### ${nls.localize('file icon themes', "File Icon Themes")}\n\n`);
			for (const theme of manifest.contributes.iconThemes) {
				markdown.appendMarkdown(`- ${theme.label}\n`);
			}
		}
		if (manifest.contributes?.productIconThemes) {
			markdown.appendMarkdown(`### ${nls.localize('product icon themes', "Product Icon Themes")}\n\n`);
			for (const theme of manifest.contributes.productIconThemes) {
				markdown.appendMarkdown(`- ${theme.label}\n`);
			}
		}
		return {
			data: markdown,
			dispose: () => { /* noop */ }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'themes',
	label: nls.localize('themes', "Themes"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ThemeDataRenderer),
});

export interface ThemeChangeEvent<T> {
	themes: T[];
	added: T[];
	removed: T[];
}

export interface IThemeData {
	id: string;
	settingsId: string | null;
	location?: URI;
}

export class ThemeRegistry<T extends IThemeData> implements IDisposable {

	private extensionThemes: T[];

	private readonly onDidChangeEmitter = new Emitter<ThemeChangeEvent<T>>();
	public readonly onDidChange: Event<ThemeChangeEvent<T>> = this.onDidChangeEmitter.event;

	constructor(
		private readonly themesExtPoint: IExtensionPoint<IThemeExtensionPoint[]>,
		private create: (theme: IThemeExtensionPoint, themeLocation: URI, extensionData: ExtensionData) => T,
		private idRequired = false,
		private builtInTheme: T | undefined = undefined
	) {
		this.extensionThemes = [];
		this.initialize();
	}

	dispose() {
		this.themesExtPoint.setHandler(() => { });
	}

	private initialize() {
		this.themesExtPoint.setHandler((extensions, delta) => {
			const previousIds: { [key: string]: T } = {};

			const added: T[] = [];
			for (const theme of this.extensionThemes) {
				previousIds[theme.id] = theme;
			}
			this.extensionThemes.length = 0;
			for (const ext of extensions) {
				const extensionData = ExtensionData.fromName(ext.description.publisher, ext.description.name, ext.description.isBuiltin);
				this.onThemes(extensionData, ext.description.extensionLocation, ext.value, this.extensionThemes, ext.collector);
			}
			for (const theme of this.extensionThemes) {
				if (!previousIds[theme.id]) {
					added.push(theme);
				} else {
					delete previousIds[theme.id];
				}
			}
			const removed = Object.values(previousIds);
			this.onDidChangeEmitter.fire({ themes: this.extensionThemes, added, removed });
		});
	}

	private onThemes(extensionData: ExtensionData, extensionLocation: URI, themeContributions: IThemeExtensionPoint[], resultingThemes: T[] = [], log?: ExtensionMessageCollector): T[] {
		if (!Array.isArray(themeContributions)) {
			log?.error(nls.localize(
				'reqarray',
				"Extension point `{0}` must be an array.",
				this.themesExtPoint.name
			));
			return resultingThemes;
		}
		themeContributions.forEach(theme => {
			if (!theme.path || !types.isString(theme.path)) {
				log?.error(nls.localize(
					'reqpath',
					"Expected string in `contributes.{0}.path`. Provided value: {1}",
					this.themesExtPoint.name,
					String(theme.path)
				));
				return;
			}
			if (this.idRequired && (!theme.id || !types.isString(theme.id))) {
				log?.error(nls.localize(
					'reqid',
					"Expected string in `contributes.{0}.id`. Provided value: {1}",
					this.themesExtPoint.name,
					String(theme.id)
				));
				return;
			}

			const themeLocation = resources.joinPath(extensionLocation, theme.path);
			if (!resources.isEqualOrParent(themeLocation, extensionLocation)) {
				log?.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", this.themesExtPoint.name, themeLocation.path, extensionLocation.path));
			}

			const themeData = this.create(theme, themeLocation, extensionData);
			resultingThemes.push(themeData);
		});
		return resultingThemes;
	}

	public findThemeById(themeId: string): T | undefined {
		if (this.builtInTheme && this.builtInTheme.id === themeId) {
			return this.builtInTheme;
		}
		const allThemes = this.getThemes();
		for (const t of allThemes) {
			if (t.id === themeId) {
				return t;
			}
		}
		return undefined;
	}

	public findThemeBySettingsId(settingsId: string | null, defaultSettingsId?: string): T | undefined {
		if (this.builtInTheme && this.builtInTheme.settingsId === settingsId) {
			return this.builtInTheme;
		}
		const allThemes = this.getThemes();
		let defaultTheme: T | undefined = undefined;
		for (const t of allThemes) {
			if (t.settingsId === settingsId) {
				return t;
			}
			if (t.settingsId === defaultSettingsId) {
				defaultTheme = t;
			}
		}
		return defaultTheme;
	}

	public findThemeByExtensionLocation(extLocation: URI | undefined): T[] {
		if (extLocation) {
			return this.getThemes().filter(t => t.location && resources.isEqualOrParent(t.location, extLocation));
		}
		return [];
	}

	public getThemes(): T[] {
		return this.extensionThemes;
	}

	public getMarketplaceThemes(manifest: any, extensionLocation: URI, extensionData: ExtensionData): T[] {
		const themes = manifest?.contributes?.[this.themesExtPoint.name];
		if (Array.isArray(themes)) {
			return this.onThemes(extensionData, extensionLocation, themes);
		}
		return [];
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/tokenClassificationExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/tokenClassificationExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ExtensionsRegistry, ExtensionMessageCollector } from '../../extensions/common/extensionsRegistry.js';
import { getTokenClassificationRegistry, ITokenClassificationRegistry, typeAndModifierIdPattern } from '../../../../platform/theme/common/tokenClassificationRegistry.js';

interface ITokenTypeExtensionPoint {
	id: string;
	description: string;
	superType?: string;
}

interface ITokenModifierExtensionPoint {
	id: string;
	description: string;
}

interface ITokenStyleDefaultExtensionPoint {
	language?: string;
	scopes: { [selector: string]: string[] };
}

const tokenClassificationRegistry: ITokenClassificationRegistry = getTokenClassificationRegistry();

const tokenTypeExtPoint = ExtensionsRegistry.registerExtensionPoint<ITokenTypeExtensionPoint[]>({
	extensionPoint: 'semanticTokenTypes',
	jsonSchema: {
		description: nls.localize('contributes.semanticTokenTypes', 'Contributes semantic token types.'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: nls.localize('contributes.semanticTokenTypes.id', 'The identifier of the semantic token type'),
					pattern: typeAndModifierIdPattern,
					patternErrorMessage: nls.localize('contributes.semanticTokenTypes.id.format', 'Identifiers should be in the form letterOrDigit[_-letterOrDigit]*'),
				},
				superType: {
					type: 'string',
					description: nls.localize('contributes.semanticTokenTypes.superType', 'The super type of the semantic token type'),
					pattern: typeAndModifierIdPattern,
					patternErrorMessage: nls.localize('contributes.semanticTokenTypes.superType.format', 'Super types should be in the form letterOrDigit[_-letterOrDigit]*'),
				},
				description: {
					type: 'string',
					description: nls.localize('contributes.color.description', 'The description of the semantic token type'),
				}
			}
		}
	}
});

const tokenModifierExtPoint = ExtensionsRegistry.registerExtensionPoint<ITokenModifierExtensionPoint[]>({
	extensionPoint: 'semanticTokenModifiers',
	jsonSchema: {
		description: nls.localize('contributes.semanticTokenModifiers', 'Contributes semantic token modifiers.'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: nls.localize('contributes.semanticTokenModifiers.id', 'The identifier of the semantic token modifier'),
					pattern: typeAndModifierIdPattern,
					patternErrorMessage: nls.localize('contributes.semanticTokenModifiers.id.format', 'Identifiers should be in the form letterOrDigit[_-letterOrDigit]*')
				},
				description: {
					description: nls.localize('contributes.semanticTokenModifiers.description', 'The description of the semantic token modifier')
				}
			}
		}
	}
});

const tokenStyleDefaultsExtPoint = ExtensionsRegistry.registerExtensionPoint<ITokenStyleDefaultExtensionPoint[]>({
	extensionPoint: 'semanticTokenScopes',
	jsonSchema: {
		description: nls.localize('contributes.semanticTokenScopes', 'Contributes semantic token scope maps.'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				language: {
					description: nls.localize('contributes.semanticTokenScopes.languages', 'Lists the languge for which the defaults are.'),
					type: 'string'
				},
				scopes: {
					description: nls.localize('contributes.semanticTokenScopes.scopes', 'Maps a semantic token (described by semantic token selector) to one or more textMate scopes used to represent that token.'),
					type: 'object',
					additionalProperties: {
						type: 'array',
						items: {
							type: 'string'
						}
					}
				}
			}
		}
	}
});


export class TokenClassificationExtensionPoints {

	constructor() {
		function validateTypeOrModifier(contribution: ITokenTypeExtensionPoint | ITokenModifierExtensionPoint, extensionPoint: string, collector: ExtensionMessageCollector): boolean {
			if (typeof contribution.id !== 'string' || contribution.id.length === 0) {
				collector.error(nls.localize('invalid.id', "'configuration.{0}.id' must be defined and can not be empty", extensionPoint));
				return false;
			}
			if (!contribution.id.match(typeAndModifierIdPattern)) {
				collector.error(nls.localize('invalid.id.format', "'configuration.{0}.id' must follow the pattern letterOrDigit[-_letterOrDigit]*", extensionPoint));
				return false;
			}
			const superType = (contribution as ITokenTypeExtensionPoint).superType;
			if (superType && !superType.match(typeAndModifierIdPattern)) {
				collector.error(nls.localize('invalid.superType.format', "'configuration.{0}.superType' must follow the pattern letterOrDigit[-_letterOrDigit]*", extensionPoint));
				return false;
			}
			if (typeof contribution.description !== 'string' || contribution.id.length === 0) {
				collector.error(nls.localize('invalid.description', "'configuration.{0}.description' must be defined and can not be empty", extensionPoint));
				return false;
			}
			return true;
		}

		tokenTypeExtPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				const extensionValue = <ITokenTypeExtensionPoint[]>extension.value;
				const collector = extension.collector;

				if (!extensionValue || !Array.isArray(extensionValue)) {
					collector.error(nls.localize('invalid.semanticTokenTypeConfiguration', "'configuration.semanticTokenType' must be an array"));
					return;
				}
				for (const contribution of extensionValue) {
					if (validateTypeOrModifier(contribution, 'semanticTokenType', collector)) {
						tokenClassificationRegistry.registerTokenType(contribution.id, contribution.description, contribution.superType);
					}
				}
			}
			for (const extension of delta.removed) {
				const extensionValue = <ITokenTypeExtensionPoint[]>extension.value;
				for (const contribution of extensionValue) {
					tokenClassificationRegistry.deregisterTokenType(contribution.id);
				}
			}
		});
		tokenModifierExtPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				const extensionValue = <ITokenModifierExtensionPoint[]>extension.value;
				const collector = extension.collector;

				if (!extensionValue || !Array.isArray(extensionValue)) {
					collector.error(nls.localize('invalid.semanticTokenModifierConfiguration', "'configuration.semanticTokenModifier' must be an array"));
					return;
				}
				for (const contribution of extensionValue) {
					if (validateTypeOrModifier(contribution, 'semanticTokenModifier', collector)) {
						tokenClassificationRegistry.registerTokenModifier(contribution.id, contribution.description);
					}
				}
			}
			for (const extension of delta.removed) {
				const extensionValue = <ITokenModifierExtensionPoint[]>extension.value;
				for (const contribution of extensionValue) {
					tokenClassificationRegistry.deregisterTokenModifier(contribution.id);
				}
			}
		});
		tokenStyleDefaultsExtPoint.setHandler((extensions, delta) => {
			for (const extension of delta.added) {
				const extensionValue = <ITokenStyleDefaultExtensionPoint[]>extension.value;
				const collector = extension.collector;

				if (!extensionValue || !Array.isArray(extensionValue)) {
					collector.error(nls.localize('invalid.semanticTokenScopes.configuration', "'configuration.semanticTokenScopes' must be an array"));
					return;
				}
				for (const contribution of extensionValue) {
					if (contribution.language && typeof contribution.language !== 'string') {
						collector.error(nls.localize('invalid.semanticTokenScopes.language', "'configuration.semanticTokenScopes.language' must be a string"));
						continue;
					}
					if (!contribution.scopes || typeof contribution.scopes !== 'object') {
						collector.error(nls.localize('invalid.semanticTokenScopes.scopes', "'configuration.semanticTokenScopes.scopes' must be defined as an object"));
						continue;
					}
					for (const selectorString in contribution.scopes) {
						const tmScopes = contribution.scopes[selectorString];
						if (!Array.isArray(tmScopes) || tmScopes.some(l => typeof l !== 'string')) {
							collector.error(nls.localize('invalid.semanticTokenScopes.scopes.value', "'configuration.semanticTokenScopes.scopes' values must be an array of strings"));
							continue;
						}
						try {
							const selector = tokenClassificationRegistry.parseTokenSelector(selectorString, contribution.language);
							tokenClassificationRegistry.registerTokenStyleDefault(selector, { scopesToProbe: tmScopes.map(s => s.split(' ')) });
						} catch (e) {
							collector.error(nls.localize('invalid.semanticTokenScopes.scopes.selector', "configuration.semanticTokenScopes.scopes': Problems parsing selector {0}.", selectorString));
							// invalid selector, ignore
						}
					}
				}
			}
			for (const extension of delta.removed) {
				const extensionValue = <ITokenStyleDefaultExtensionPoint[]>extension.value;
				for (const contribution of extensionValue) {
					for (const selectorString in contribution.scopes) {
						const tmScopes = contribution.scopes[selectorString];
						try {
							const selector = tokenClassificationRegistry.parseTokenSelector(selectorString, contribution.language);
							tokenClassificationRegistry.registerTokenStyleDefault(selector, { scopesToProbe: tmScopes.map(s => s.split(' ')) });
						} catch (e) {
							// invalid selector, ignore
						}
					}
				}
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/common/workbenchThemeService.ts]---
Location: vscode-main/src/vs/workbench/services/themes/common/workbenchThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { Color } from '../../../../base/common/color.js';
import { IColorTheme, IThemeService, IFileIconTheme, IProductIconTheme } from '../../../../platform/theme/common/themeService.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { isBoolean, isString } from '../../../../base/common/types.js';
import { IconContribution, IconDefinition } from '../../../../platform/theme/common/iconRegistry.js';
import { ColorScheme, ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';

export const IWorkbenchThemeService = refineServiceDecorator<IThemeService, IWorkbenchThemeService>(IThemeService);

export const THEME_SCOPE_OPEN_PAREN = '[';
export const THEME_SCOPE_CLOSE_PAREN = ']';
export const THEME_SCOPE_WILDCARD = '*';

export const themeScopeRegex = /\[(.+?)\]/g;

export enum ThemeSettings {
	COLOR_THEME = 'workbench.colorTheme',
	FILE_ICON_THEME = 'workbench.iconTheme',
	PRODUCT_ICON_THEME = 'workbench.productIconTheme',
	COLOR_CUSTOMIZATIONS = 'workbench.colorCustomizations',
	TOKEN_COLOR_CUSTOMIZATIONS = 'editor.tokenColorCustomizations',
	SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS = 'editor.semanticTokenColorCustomizations',

	PREFERRED_DARK_THEME = 'workbench.preferredDarkColorTheme',
	PREFERRED_LIGHT_THEME = 'workbench.preferredLightColorTheme',
	PREFERRED_HC_DARK_THEME = 'workbench.preferredHighContrastColorTheme', /* id kept for compatibility reasons */
	PREFERRED_HC_LIGHT_THEME = 'workbench.preferredHighContrastLightColorTheme',
	DETECT_COLOR_SCHEME = 'window.autoDetectColorScheme',
	DETECT_HC = 'window.autoDetectHighContrast',

	SYSTEM_COLOR_THEME = 'window.systemColorTheme'
}

export enum ThemeSettingDefaults {
	COLOR_THEME_DARK = 'Default Dark Modern',
	COLOR_THEME_LIGHT = 'Default Light Modern',
	COLOR_THEME_HC_DARK = 'Default High Contrast',
	COLOR_THEME_HC_LIGHT = 'Default High Contrast Light',

	COLOR_THEME_DARK_OLD = 'Default Dark+',
	COLOR_THEME_LIGHT_OLD = 'Default Light+',

	FILE_ICON_THEME = 'vs-seti',
	PRODUCT_ICON_THEME = 'Default',
}

export const COLOR_THEME_DARK_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#383a49',
	'activityBar.activeBorder': '#0078D4',
	'activityBar.background': '#181818',
	'activityBar.border': '#2B2B2B',
	'activityBar.foreground': '#D7D7D7',
	'activityBar.inactiveForeground': '#868686',
	'activityBarBadge.background': '#0078D4',
	'activityBarBadge.foreground': '#FFFFFF',
	'badge.background': '#616161',
	'badge.foreground': '#F8F8F8',
	'button.background': '#0078D4',
	'button.border': '#FFFFFF12',
	'button.foreground': '#FFFFFF',
	'button.hoverBackground': '#026EC1',
	'button.secondaryBackground': '#313131',
	'button.secondaryForeground': '#CCCCCC',
	'button.secondaryHoverBackground': '#3C3C3C',
	'chat.slashCommandBackground': '#26477866',
	'chat.slashCommandForeground': '#85B6FF',
	'chat.editedFileForeground': '#E2C08D',
	'checkbox.background': '#313131',
	'checkbox.border': '#3C3C3C',
	'debugToolBar.background': '#181818',
	'descriptionForeground': '#9D9D9D',
	'dropdown.background': '#313131',
	'dropdown.border': '#3C3C3C',
	'dropdown.foreground': '#CCCCCC',
	'dropdown.listBackground': '#1F1F1F',
	'editor.background': '#1F1F1F',
	'editor.findMatchBackground': '#9E6A03',
	'editor.foreground': '#CCCCCC',
	'editor.inactiveSelectionBackground': '#3A3D41',
	'editor.selectionHighlightBackground': '#ADD6FF26',
	'editorGroup.border': '#FFFFFF17',
	'editorGroupHeader.tabsBackground': '#181818',
	'editorGroupHeader.tabsBorder': '#2B2B2B',
	'editorGutter.addedBackground': '#2EA043',
	'editorGutter.deletedBackground': '#F85149',
	'editorGutter.modifiedBackground': '#0078D4',
	'editorIndentGuide.activeBackground1': '#707070',
	'editorIndentGuide.background1': '#404040',
	'editorLineNumber.activeForeground': '#CCCCCC',
	'editorLineNumber.foreground': '#6E7681',
	'editorOverviewRuler.border': '#010409',
	'editorWidget.background': '#202020',
	'errorForeground': '#F85149',
	'focusBorder': '#0078D4',
	'foreground': '#CCCCCC',
	'icon.foreground': '#CCCCCC',
	'input.background': '#313131',
	'input.border': '#3C3C3C',
	'input.foreground': '#CCCCCC',
	'input.placeholderForeground': '#989898',
	'inputOption.activeBackground': '#2489DB82',
	'inputOption.activeBorder': '#2488DB',
	'keybindingLabel.foreground': '#CCCCCC',
	'list.activeSelectionIconForeground': '#FFF',
	'list.dropBackground': '#383B3D',
	'menu.background': '#1F1F1F',
	'menu.border': '#454545',
	'menu.foreground': '#CCCCCC',
	'menu.selectionBackground': '#0078d4',
	'menu.separatorBackground': '#454545',
	'notificationCenterHeader.background': '#1F1F1F',
	'notificationCenterHeader.foreground': '#CCCCCC',
	'notifications.background': '#1F1F1F',
	'notifications.border': '#2B2B2B',
	'notifications.foreground': '#CCCCCC',
	'panel.background': '#181818',
	'panel.border': '#2B2B2B',
	'panelInput.border': '#2B2B2B',
	'panelTitle.activeBorder': '#0078D4',
	'panelTitle.activeForeground': '#CCCCCC',
	'panelTitle.inactiveForeground': '#9D9D9D',
	'peekViewEditor.background': '#1F1F1F',
	'peekViewEditor.matchHighlightBackground': '#BB800966',
	'peekViewResult.background': '#1F1F1F',
	'peekViewResult.matchHighlightBackground': '#BB800966',
	'pickerGroup.border': '#3C3C3C',
	'ports.iconRunningProcessForeground': '#369432',
	'progressBar.background': '#0078D4',
	'quickInput.background': '#222222',
	'quickInput.foreground': '#CCCCCC',
	'settings.dropdownBackground': '#313131',
	'settings.dropdownBorder': '#3C3C3C',
	'settings.headerForeground': '#FFFFFF',
	'settings.modifiedItemIndicator': '#BB800966',
	'sideBar.background': '#181818',
	'sideBar.border': '#2B2B2B',
	'sideBar.foreground': '#CCCCCC',
	'sideBarSectionHeader.background': '#181818',
	'sideBarSectionHeader.border': '#2B2B2B',
	'sideBarSectionHeader.foreground': '#CCCCCC',
	'sideBarTitle.foreground': '#CCCCCC',
	'statusBar.background': '#181818',
	'statusBar.border': '#2B2B2B',
	'statusBar.debuggingBackground': '#0078D4',
	'statusBar.debuggingForeground': '#FFFFFF',
	'statusBar.focusBorder': '#0078D4',
	'statusBar.foreground': '#CCCCCC',
	'statusBar.noFolderBackground': '#1F1F1F',
	'statusBarItem.focusBorder': '#0078D4',
	'statusBarItem.prominentBackground': '#6E768166',
	'statusBarItem.remoteBackground': '#0078D4',
	'statusBarItem.remoteForeground': '#FFFFFF',
	'tab.activeBackground': '#1F1F1F',
	'tab.activeBorder': '#1F1F1F',
	'tab.activeBorderTop': '#0078D4',
	'tab.activeForeground': '#FFFFFF',
	'tab.border': '#2B2B2B',
	'tab.hoverBackground': '#1F1F1F',
	'tab.inactiveBackground': '#181818',
	'tab.inactiveForeground': '#9D9D9D',
	'tab.lastPinnedBorder': '#ccc3',
	'tab.selectedBackground': '#222222',
	'tab.selectedBorderTop': '#6caddf',
	'tab.selectedForeground': '#ffffffa0',
	'tab.unfocusedActiveBorder': '#1F1F1F',
	'tab.unfocusedActiveBorderTop': '#2B2B2B',
	'tab.unfocusedHoverBackground': '#1F1F1F',
	'terminal.foreground': '#CCCCCC',
	'terminal.inactiveSelectionBackground': '#3A3D41',
	'terminal.tab.activeBorder': '#0078D4',
	'textBlockQuote.background': '#2B2B2B',
	'textBlockQuote.border': '#616161',
	'textCodeBlock.background': '#2B2B2B',
	'textLink.activeForeground': '#4daafc',
	'textLink.foreground': '#4daafc',
	'textPreformat.background': '#3C3C3C',
	'textPreformat.foreground': '#D0D0D0',
	'textSeparator.foreground': '#21262D',
	'titleBar.activeBackground': '#181818',
	'titleBar.activeForeground': '#CCCCCC',
	'titleBar.border': '#2B2B2B',
	'titleBar.inactiveBackground': '#1F1F1F',
	'titleBar.inactiveForeground': '#9D9D9D',
	'welcomePage.progress.foreground': '#0078D4',
	'welcomePage.tileBackground': '#2B2B2B',
	'widget.border': '#313131'
};

export const COLOR_THEME_LIGHT_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#dddddd',
	'activityBar.activeBorder': '#005FB8',
	'activityBar.background': '#F8F8F8',
	'activityBar.border': '#E5E5E5',
	'activityBar.foreground': '#1F1F1F',
	'activityBar.inactiveForeground': '#616161',
	'activityBarBadge.background': '#005FB8',
	'activityBarBadge.foreground': '#FFFFFF',
	'badge.background': '#CCCCCC',
	'badge.foreground': '#3B3B3B',
	'button.background': '#005FB8',
	'button.border': '#0000001a',
	'button.foreground': '#FFFFFF',
	'button.hoverBackground': '#0258A8',
	'button.secondaryBackground': '#E5E5E5',
	'button.secondaryForeground': '#3B3B3B',
	'button.secondaryHoverBackground': '#CCCCCC',
	'chat.slashCommandBackground': '#ADCEFF7A',
	'chat.slashCommandForeground': '#26569E',
	'chat.editedFileForeground': '#895503',
	'checkbox.background': '#F8F8F8',
	'checkbox.border': '#CECECE',
	'descriptionForeground': '#3B3B3B',
	'diffEditor.unchangedRegionBackground': '#f8f8f8',
	'dropdown.background': '#FFFFFF',
	'dropdown.border': '#CECECE',
	'dropdown.foreground': '#3B3B3B',
	'dropdown.listBackground': '#FFFFFF',
	'editor.background': '#FFFFFF',
	'editor.foreground': '#3B3B3B',
	'editor.inactiveSelectionBackground': '#E5EBF1',
	'editor.selectionHighlightBackground': '#ADD6FF80',
	'editorGroup.border': '#E5E5E5',
	'editorGroupHeader.tabsBackground': '#F8F8F8',
	'editorGroupHeader.tabsBorder': '#E5E5E5',
	'editorGutter.addedBackground': '#2EA043',
	'editorGutter.deletedBackground': '#F85149',
	'editorGutter.modifiedBackground': '#005FB8',
	'editorIndentGuide.activeBackground1': '#939393',
	'editorIndentGuide.background1': '#D3D3D3',
	'editorLineNumber.activeForeground': '#171184',
	'editorLineNumber.foreground': '#6E7681',
	'editorOverviewRuler.border': '#E5E5E5',
	'editorSuggestWidget.background': '#F8F8F8',
	'editorWidget.background': '#F8F8F8',
	'errorForeground': '#F85149',
	'focusBorder': '#005FB8',
	'foreground': '#3B3B3B',
	'icon.foreground': '#3B3B3B',
	'input.background': '#FFFFFF',
	'input.border': '#CECECE',
	'input.foreground': '#3B3B3B',
	'input.placeholderForeground': '#767676',
	'inputOption.activeBackground': '#BED6ED',
	'inputOption.activeBorder': '#005FB8',
	'inputOption.activeForeground': '#000000',
	'keybindingLabel.foreground': '#3B3B3B',
	'list.activeSelectionBackground': '#E8E8E8',
	'list.activeSelectionForeground': '#000000',
	'list.activeSelectionIconForeground': '#000000',
	'list.focusAndSelectionOutline': '#005FB8',
	'list.hoverBackground': '#F2F2F2',
	'menu.border': '#CECECE',
	'menu.selectionBackground': '#005FB8',
	'menu.selectionForeground': '#ffffff',
	'notebook.cellBorderColor': '#E5E5E5',
	'notebook.selectedCellBackground': '#C8DDF150',
	'notificationCenterHeader.background': '#FFFFFF',
	'notificationCenterHeader.foreground': '#3B3B3B',
	'notifications.background': '#FFFFFF',
	'notifications.border': '#E5E5E5',
	'notifications.foreground': '#3B3B3B',
	'panel.background': '#F8F8F8',
	'panel.border': '#E5E5E5',
	'panelInput.border': '#E5E5E5',
	'panelTitle.activeBorder': '#005FB8',
	'panelTitle.activeForeground': '#3B3B3B',
	'panelTitle.inactiveForeground': '#3B3B3B',
	'peekViewEditor.matchHighlightBackground': '#BB800966',
	'peekViewResult.background': '#FFFFFF',
	'peekViewResult.matchHighlightBackground': '#BB800966',
	'pickerGroup.border': '#E5E5E5',
	'pickerGroup.foreground': '#8B949E',
	'ports.iconRunningProcessForeground': '#369432',
	'progressBar.background': '#005FB8',
	'quickInput.background': '#F8F8F8',
	'quickInput.foreground': '#3B3B3B',
	'searchEditor.textInputBorder': '#CECECE',
	'settings.dropdownBackground': '#FFFFFF',
	'settings.dropdownBorder': '#CECECE',
	'settings.headerForeground': '#1F1F1F',
	'settings.modifiedItemIndicator': '#BB800966',
	'settings.numberInputBorder': '#CECECE',
	'settings.textInputBorder': '#CECECE',
	'sideBar.background': '#F8F8F8',
	'sideBar.border': '#E5E5E5',
	'sideBar.foreground': '#3B3B3B',
	'sideBarSectionHeader.background': '#F8F8F8',
	'sideBarSectionHeader.border': '#E5E5E5',
	'sideBarSectionHeader.foreground': '#3B3B3B',
	'sideBarTitle.foreground': '#3B3B3B',
	'statusBar.background': '#F8F8F8',
	'statusBar.border': '#E5E5E5',
	'statusBar.debuggingBackground': '#FD716C',
	'statusBar.debuggingForeground': '#000000',
	'statusBar.focusBorder': '#005FB8',
	'statusBar.foreground': '#3B3B3B',
	'statusBar.noFolderBackground': '#F8F8F8',
	'statusBarItem.compactHoverBackground': '#CCCCCC',
	'statusBarItem.errorBackground': '#C72E0F',
	'statusBarItem.focusBorder': '#005FB8',
	'statusBarItem.hoverBackground': '#B8B8B850',
	'statusBarItem.prominentBackground': '#6E768166',
	'statusBarItem.remoteBackground': '#005FB8',
	'statusBarItem.remoteForeground': '#FFFFFF',
	'tab.activeBackground': '#FFFFFF',
	'tab.activeBorder': '#F8F8F8',
	'tab.activeBorderTop': '#005FB8',
	'tab.activeForeground': '#3B3B3B',
	'tab.border': '#E5E5E5',
	'tab.hoverBackground': '#FFFFFF',
	'tab.inactiveBackground': '#F8F8F8',
	'tab.inactiveForeground': '#868686',
	'tab.lastPinnedBorder': '#D4D4D4',
	'tab.selectedBackground': '#ffffffa5',
	'tab.selectedBorderTop': '#68a3da',
	'tab.selectedForeground': '#333333b3',
	'tab.unfocusedActiveBorder': '#F8F8F8',
	'tab.unfocusedActiveBorderTop': '#E5E5E5',
	'tab.unfocusedHoverBackground': '#F8F8F8',
	'terminal.foreground': '#3B3B3B',
	'terminal.inactiveSelectionBackground': '#E5EBF1',
	'terminal.tab.activeBorder': '#005FB8',
	'terminalCursor.foreground': '#005FB8',
	'textBlockQuote.background': '#F8F8F8',
	'textBlockQuote.border': '#E5E5E5',
	'textCodeBlock.background': '#F8F8F8',
	'textLink.activeForeground': '#005FB8',
	'textLink.foreground': '#005FB8',
	'textPreformat.background': '#0000001F',
	'textPreformat.foreground': '#3B3B3B',
	'textSeparator.foreground': '#21262D',
	'titleBar.activeBackground': '#F8F8F8',
	'titleBar.activeForeground': '#1E1E1E',
	'titleBar.border': '#E5E5E5',
	'titleBar.inactiveBackground': '#F8F8F8',
	'titleBar.inactiveForeground': '#8B949E',
	'welcomePage.tileBackground': '#F3F3F3',
	'widget.border': '#E5E5E5'
};

export interface IWorkbenchTheme {
	readonly id: string;
	readonly label: string;
	readonly extensionData?: ExtensionData;
	readonly description?: string;
	readonly settingsId: string | null;
}

export interface IWorkbenchColorTheme extends IWorkbenchTheme, IColorTheme {
	readonly settingsId: string;
	readonly tokenColors: ITextMateThemingRule[];
}

export interface IColorMap {
	[id: string]: Color;
}

export interface IWorkbenchFileIconTheme extends IWorkbenchTheme, IFileIconTheme {
}

export interface IWorkbenchProductIconTheme extends IWorkbenchTheme, IProductIconTheme {
	readonly settingsId: string;

	getIcon(icon: IconContribution): IconDefinition | undefined;
}

export type ThemeSettingTarget = ConfigurationTarget | undefined | 'auto' | 'preview';


export interface IWorkbenchThemeService extends IThemeService {
	readonly _serviceBrand: undefined;
	setColorTheme(themeId: string | undefined | IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme | null>;
	getColorTheme(): IWorkbenchColorTheme;
	getColorThemes(): Promise<IWorkbenchColorTheme[]>;
	getMarketplaceColorThemes(publisher: string, name: string, version: string): Promise<IWorkbenchColorTheme[]>;
	readonly onDidColorThemeChange: Event<IWorkbenchColorTheme>;

	getPreferredColorScheme(): ColorScheme | undefined;

	setFileIconTheme(iconThemeId: string | undefined | IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme>;
	getFileIconTheme(): IWorkbenchFileIconTheme;
	getFileIconThemes(): Promise<IWorkbenchFileIconTheme[]>;
	getMarketplaceFileIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchFileIconTheme[]>;
	readonly onDidFileIconThemeChange: Event<IWorkbenchFileIconTheme>;

	setProductIconTheme(iconThemeId: string | undefined | IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme>;
	getProductIconTheme(): IWorkbenchProductIconTheme;
	getProductIconThemes(): Promise<IWorkbenchProductIconTheme[]>;
	getMarketplaceProductIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchProductIconTheme[]>;
	readonly onDidProductIconThemeChange: Event<IWorkbenchProductIconTheme>;
}

export interface IThemeScopedColorCustomizations {
	[colorId: string]: string;
}

export interface IColorCustomizations {
	[colorIdOrThemeScope: string]: IThemeScopedColorCustomizations | string;
}

export interface IThemeScopedTokenColorCustomizations {
	[groupId: string]: ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface ITokenColorCustomizations {
	[groupIdOrThemeScope: string]: IThemeScopedTokenColorCustomizations | ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface IThemeScopedSemanticTokenColorCustomizations {
	[styleRule: string]: ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface ISemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedSemanticTokenColorCustomizations | ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface IThemeScopedExperimentalSemanticTokenColorCustomizations {
	[themeScope: string]: ISemanticTokenRules | undefined;
}

export interface IExperimentalSemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedExperimentalSemanticTokenColorCustomizations | ISemanticTokenRules | undefined;
}

export type IThemeScopedCustomizations =
	IThemeScopedColorCustomizations
	| IThemeScopedTokenColorCustomizations
	| IThemeScopedExperimentalSemanticTokenColorCustomizations
	| IThemeScopedSemanticTokenColorCustomizations;

export type IThemeScopableCustomizations =
	IColorCustomizations
	| ITokenColorCustomizations
	| IExperimentalSemanticTokenColorCustomizations
	| ISemanticTokenColorCustomizations;

export interface ISemanticTokenRules {
	[selector: string]: string | ISemanticTokenColorizationSetting | undefined;
}

export interface ITextMateThemingRule {
	name?: string;
	scope?: string | string[];
	settings: ITokenColorizationSetting;
}

export interface ITokenColorizationSetting {
	foreground?: string;
	background?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
	fontFamily?: string;
	fontSize?: string;
	lineHeight?: number;
}

export interface ISemanticTokenColorizationSetting {
	foreground?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
	bold?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	italic?: boolean;
}

export interface ExtensionData {
	extensionId: string;
	extensionPublisher: string;
	extensionName: string;
	extensionIsBuiltin: boolean;
}

export namespace ExtensionData {
	export function toJSONObject(d: ExtensionData | undefined): any {
		return d && { _extensionId: d.extensionId, _extensionIsBuiltin: d.extensionIsBuiltin, _extensionName: d.extensionName, _extensionPublisher: d.extensionPublisher };
	}
	export function fromJSONObject(o: any): ExtensionData | undefined {
		if (o && isString(o._extensionId) && isBoolean(o._extensionIsBuiltin) && isString(o._extensionName) && isString(o._extensionPublisher)) {
			return { extensionId: o._extensionId, extensionIsBuiltin: o._extensionIsBuiltin, extensionName: o._extensionName, extensionPublisher: o._extensionPublisher };
		}
		return undefined;
	}
	export function fromName(publisher: string, name: string, isBuiltin = false): ExtensionData {
		return { extensionPublisher: publisher, extensionId: `${publisher}.${name}`, extensionName: name, extensionIsBuiltin: isBuiltin };
	}
}

export interface IThemeExtensionPoint {
	id: string;
	label?: string;
	description?: string;
	path: string;
	uiTheme?: ThemeTypeSelector;
	_watch: boolean; // unsupported options to watch location
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/electron-browser/nativeHostColorSchemeService.ts]---
Location: vscode-main/src/vs/workbench/services/themes/electron-browser/nativeHostColorSchemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IHostColorSchemeService } from '../common/hostColorSchemeService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isBoolean, isObject } from '../../../../base/common/types.js';
import { IColorScheme } from '../../../../platform/window/common/window.js';
import { ILifecycleService, StartupKind } from '../../lifecycle/common/lifecycle.js';

export class NativeHostColorSchemeService extends Disposable implements IHostColorSchemeService {

	// we remember the last color scheme value to restore for reloaded window
	static readonly STORAGE_KEY = 'HostColorSchemeData';

	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeColorScheme = this._register(new Emitter<void>());
	readonly onDidChangeColorScheme = this._onDidChangeColorScheme.event;

	public dark: boolean;
	public highContrast: boolean;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IStorageService private storageService: IStorageService,
		@ILifecycleService lifecycleService: ILifecycleService
	) {
		super();

		// register listener with the OS
		this._register(this.nativeHostService.onDidChangeColorScheme(scheme => this.update(scheme)));

		let initial = environmentService.window.colorScheme;
		if (lifecycleService.startupKind === StartupKind.ReloadedWindow) {
			initial = this.getStoredValue(initial);
		}
		this.dark = initial.dark;
		this.highContrast = initial.highContrast;

		// fetch the actual value from the OS
		this.nativeHostService.getOSColorScheme().then(scheme => this.update(scheme));
	}

	private getStoredValue(dftl: IColorScheme): IColorScheme {
		const stored = this.storageService.get(NativeHostColorSchemeService.STORAGE_KEY, StorageScope.APPLICATION);
		if (stored) {
			try {
				const scheme = JSON.parse(stored);
				if (isObject(scheme) && isBoolean(scheme.highContrast) && isBoolean(scheme.dark)) {
					return scheme as IColorScheme;
				}
			} catch (e) {
				// ignore
			}
		}
		return dftl;
	}

	private update({ highContrast, dark }: IColorScheme) {
		if (dark !== this.dark || highContrast !== this.highContrast) {

			this.dark = dark;
			this.highContrast = highContrast;
			this.storageService.store(NativeHostColorSchemeService.STORAGE_KEY, JSON.stringify({ highContrast, dark }), StorageScope.APPLICATION, StorageTarget.MACHINE);
			this._onDidChangeColorScheme.fire();
		}
	}

}

registerSingleton(IHostColorSchemeService, NativeHostColorSchemeService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/electron-browser/themes.contribution.ts]---
Location: vscode-main/src/vs/workbench/services/themes/electron-browser/themes.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ThemeSettings } from '../common/workbenchThemeService.js';
import { COLOR_THEME_CONFIGURATION_SETTINGS_TAG, formatSettingAsLink } from '../common/themeConfiguration.js';
import { isLinux } from '../../../../base/common/platform.js';

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	properties: {
		[ThemeSettings.SYSTEM_COLOR_THEME]: {
			type: 'string',
			enum: ['default', 'auto', 'light', 'dark'],
			enumDescriptions: [
				localize('window.systemColorTheme.default', "Native widget colors match the system colors."),
				localize('window.systemColorTheme.auto', "Use light native widget colors for light color themes and dark for dark color themes."),
				localize('window.systemColorTheme.light', "Use light native widget colors."),
				localize('window.systemColorTheme.dark', "Use dark native widget colors."),
			],
			markdownDescription: localize({ key: 'window.systemColorTheme', comment: ['{0} and {1} will become links to other settings.'] }, "Set the color mode for native UI elements such as native dialogs, menus and title bar. Even if your OS is configured in light color mode, you can select a dark system color theme for the window. You can also configure to automatically adjust based on the {0} setting.\n\nNote: This setting is ignored when {1} is enabled.", formatSettingAsLink(ThemeSettings.COLOR_THEME), formatSettingAsLink(ThemeSettings.DETECT_COLOR_SCHEME)),
			default: 'default',
			included: !isLinux,
			scope: ConfigurationScope.APPLICATION,
			tags: [COLOR_THEME_CONFIGURATION_SETTINGS_TAG],
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/test/node/color-theme.json]---
Location: vscode-main/src/vs/workbench/services/themes/test/node/color-theme.json

```json
{
	"type": "dark",
	"tokenColors": [
		{
			"scope": "comment",
			"settings": {
				"foreground": "#000000"
			}
		},
		{
			"scope": "string",
			"settings": {
				"foreground": "#444444"
			}
		},
		{
			"scope": "constant.numeric",
			"settings": {
				"foreground": "#555555"
			}
		},
		{
			"scope": "variable",
			"settings": {
				"fontStyle": "",
				"foreground": "#111111"
			}
		},
		{
			"scope": "keyword",
			"settings": {
				"foreground": "#666666"
			}
		},
		{
			"scope": "entity.name.type, entity.name.class, entity.name.namespace, entity.name.scope-resolution",
			"settings": {
				"fontStyle": "underline",
				"foreground": "#333333"
			}
		},
		{
			"scope": "entity.name.function",
			"settings": {
				"fontStyle": "",
				"foreground": "#333333"
			}
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/themes/test/node/tokenStyleResolving.test.ts]---
Location: vscode-main/src/vs/workbench/services/themes/test/node/tokenStyleResolving.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ColorThemeData } from '../../common/colorThemeData.js';
import assert from 'assert';
import { ITokenColorCustomizations } from '../../common/workbenchThemeService.js';
import { TokenStyle, getTokenClassificationRegistry } from '../../../../../platform/theme/common/tokenClassificationRegistry.js';
import { Color } from '../../../../../base/common/color.js';
import { isString } from '../../../../../base/common/types.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { DiskFileSystemProvider } from '../../../../../platform/files/node/diskFileSystemProvider.js';
import { FileAccess, Schemas } from '../../../../../base/common/network.js';
import { ExtensionResourceLoaderService } from '../../../../../platform/extensionResourceLoader/common/extensionResourceLoaderService.js';
import { ITokenStyle } from '../../../../../platform/theme/common/themeService.js';
import { mock, TestProductService } from '../../../../test/common/workbenchTestServices.js';
import { IRequestService } from '../../../../../platform/request/common/request.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ExtensionGalleryManifestService } from '../../../../../platform/extensionManagement/common/extensionGalleryManifestService.js';

const undefinedStyle = { bold: undefined, underline: undefined, italic: undefined };
const unsetStyle = { bold: false, underline: false, italic: false };

function ts(foreground: string | undefined, styleFlags: { bold?: boolean; underline?: boolean; strikethrough?: boolean; italic?: boolean } | undefined): TokenStyle {
	const foregroundColor = isString(foreground) ? Color.fromHex(foreground) : undefined;
	return new TokenStyle(foregroundColor, styleFlags?.bold, styleFlags?.underline, styleFlags?.strikethrough, styleFlags?.italic);
}

function tokenStyleAsString(ts: TokenStyle | undefined | null) {
	if (!ts) {
		return 'tokenstyle-undefined';
	}
	let str = ts.foreground ? ts.foreground.toString() : 'no-foreground';
	if (ts.bold !== undefined) {
		str += ts.bold ? '+B' : '-B';
	}
	if (ts.underline !== undefined) {
		str += ts.underline ? '+U' : '-U';
	}
	if (ts.italic !== undefined) {
		str += ts.italic ? '+I' : '-I';
	}
	return str;
}

function assertTokenStyle(actual: TokenStyle | undefined | null, expected: TokenStyle | undefined | null, message?: string) {
	assert.strictEqual(tokenStyleAsString(actual), tokenStyleAsString(expected), message);
}

function assertTokenStyleMetaData(colorIndex: string[], actual: ITokenStyle | undefined, expected: TokenStyle | undefined | null, message = '') {
	if (expected === undefined || expected === null || actual === undefined) {
		assert.strictEqual(actual, expected, message);
		return;
	}
	assert.strictEqual(actual.bold, expected.bold, 'bold ' + message);
	assert.strictEqual(actual.italic, expected.italic, 'italic ' + message);
	assert.strictEqual(actual.underline, expected.underline, 'underline ' + message);

	const actualForegroundIndex = actual.foreground;
	if (actualForegroundIndex && expected.foreground) {
		assert.strictEqual(colorIndex[actualForegroundIndex], Color.Format.CSS.formatHexA(expected.foreground, true).toUpperCase(), 'foreground ' + message);
	} else {
		assert.strictEqual(actualForegroundIndex, expected.foreground || 0, 'foreground ' + message);
	}
}


function assertTokenStyles(themeData: ColorThemeData, expected: { [qualifiedClassifier: string]: TokenStyle }, language = 'typescript') {
	const colorIndex = themeData.tokenColorMap;

	for (const qualifiedClassifier in expected) {
		const [type, ...modifiers] = qualifiedClassifier.split('.');

		const expectedTokenStyle = expected[qualifiedClassifier];

		const tokenStyleMetaData = themeData.getTokenStyleMetadata(type, modifiers, language);
		assertTokenStyleMetaData(colorIndex, tokenStyleMetaData, expectedTokenStyle, qualifiedClassifier);
	}
}

suite('Themes - TokenStyleResolving', () => {
	const fileService = new FileService(new NullLogService());
	const requestService = new (mock<IRequestService>())();
	const storageService = new (mock<IStorageService>())();
	const environmentService = new (mock<IEnvironmentService>())();
	const configurationService = new (mock<IConfigurationService>())();

	const extensionResourceLoaderService = new ExtensionResourceLoaderService(fileService, storageService, TestProductService, environmentService, configurationService, new ExtensionGalleryManifestService(TestProductService), requestService, new NullLogService());

	const diskFileSystemProvider = new DiskFileSystemProvider(new NullLogService());
	fileService.registerProvider(Schemas.file, diskFileSystemProvider);

	teardown(() => {
		diskFileSystemProvider.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('color defaults', async () => {
		const themeData = ColorThemeData.createUnloadedTheme('foo');
		themeData.location = FileAccess.asFileUri('vs/workbench/services/themes/test/node/color-theme.json');
		await themeData.ensureLoaded(extensionResourceLoaderService);

		assert.strictEqual(themeData.isLoaded, true);

		assertTokenStyles(themeData, {
			'comment': ts('#000000', undefinedStyle),
			'variable': ts('#111111', unsetStyle),
			'type': ts('#333333', { bold: false, underline: true, italic: false }),
			'function': ts('#333333', unsetStyle),
			'string': ts('#444444', undefinedStyle),
			'number': ts('#555555', undefinedStyle),
			'keyword': ts('#666666', undefinedStyle)
		});
	});

	test('resolveScopes', async () => {
		const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');

		const customTokenColors: ITokenColorCustomizations = {
			textMateRules: [
				{
					scope: 'variable',
					settings: {
						fontStyle: '',
						foreground: '#F8F8F2'
					}
				},
				{
					scope: 'keyword.operator',
					settings: {
						fontStyle: 'italic bold underline',
						foreground: '#F92672'
					}
				},
				{
					scope: 'storage',
					settings: {
						fontStyle: 'italic',
						foreground: '#F92672'
					}
				},
				{
					scope: ['storage.type', 'meta.structure.dictionary.json string.quoted.double.json'],
					settings: {
						foreground: '#66D9EF'
					}
				},
				{
					scope: 'entity.name.type, entity.name.class, entity.name.namespace, entity.name.scope-resolution',
					settings: {
						fontStyle: 'underline',
						foreground: '#A6E22E'
					}
				},
			]
		};

		themeData.setCustomTokenColors(customTokenColors);

		let tokenStyle;
		const defaultTokenStyle = undefined;

		tokenStyle = themeData.resolveScopes([['variable']]);
		assertTokenStyle(tokenStyle, ts('#F8F8F2', unsetStyle), 'variable');

		tokenStyle = themeData.resolveScopes([['keyword.operator']]);
		assertTokenStyle(tokenStyle, ts('#F92672', { italic: true, bold: true, underline: true }), 'keyword');

		tokenStyle = themeData.resolveScopes([['keyword']]);
		assertTokenStyle(tokenStyle, defaultTokenStyle, 'keyword');

		tokenStyle = themeData.resolveScopes([['keyword.operator']]);
		assertTokenStyle(tokenStyle, ts('#F92672', { italic: true, bold: true, underline: true }), 'keyword.operator');

		tokenStyle = themeData.resolveScopes([['keyword.operators']]);
		assertTokenStyle(tokenStyle, defaultTokenStyle, 'keyword.operators');

		tokenStyle = themeData.resolveScopes([['storage']]);
		assertTokenStyle(tokenStyle, ts('#F92672', { italic: true, bold: false, underline: false }), 'storage');

		tokenStyle = themeData.resolveScopes([['storage.type']]);
		assertTokenStyle(tokenStyle, ts('#66D9EF', { italic: true, bold: false, underline: false }), 'storage.type');

		tokenStyle = themeData.resolveScopes([['entity.name.class']]);
		assertTokenStyle(tokenStyle, ts('#A6E22E', { italic: false, bold: false, underline: true }), 'entity.name.class');

		tokenStyle = themeData.resolveScopes([['meta.structure.dictionary.json', 'string.quoted.double.json']]);
		assertTokenStyle(tokenStyle, ts('#66D9EF', undefined), 'json property');

		tokenStyle = themeData.resolveScopes([['source.json', 'meta.structure.dictionary.json', 'string.quoted.double.json']]);
		assertTokenStyle(tokenStyle, ts('#66D9EF', undefined), 'json property');

		tokenStyle = themeData.resolveScopes([['keyword'], ['storage.type'], ['entity.name.class']]);
		assertTokenStyle(tokenStyle, ts('#66D9EF', { italic: true, bold: false, underline: false }), 'storage.type');

	});


	test('resolveScopes - match most specific', async () => {
		const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');

		const customTokenColors: ITokenColorCustomizations = {
			textMateRules: [
				{
					scope: 'entity.name.type',
					settings: {
						fontStyle: 'underline',
						foreground: '#A6E22E'
					}
				},
				{
					scope: 'entity.name.type.class',
					settings: {
						foreground: '#FF00FF'
					}
				},
				{
					scope: 'entity.name',
					settings: {
						foreground: '#FFFFFF'
					}
				},
			]
		};

		themeData.setCustomTokenColors(customTokenColors);

		const tokenStyle = themeData.resolveScopes([['entity.name.type.class']]);
		assertTokenStyle(tokenStyle, ts('#FF00FF', { italic: false, bold: false, underline: true }), 'entity.name.type.class');

	});


	test('rule matching', async () => {
		const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');
		themeData.setCustomColors({ 'editor.foreground': '#000000' });
		themeData.setCustomSemanticTokenColors({
			enabled: true,
			rules: {
				'type': '#ff0000',
				'class': { foreground: '#0000ff', italic: true },
				'*.static': { bold: true },
				'*.declaration': { italic: true },
				'*.async.static': { italic: true, underline: true },
				'*.async': { foreground: '#000fff', underline: true }
			}
		});

		assertTokenStyles(themeData, {
			'type': ts('#ff0000', undefinedStyle),
			'type.static': ts('#ff0000', { bold: true }),
			'type.static.declaration': ts('#ff0000', { bold: true, italic: true }),
			'class': ts('#0000ff', { italic: true }),
			'class.static.declaration': ts('#0000ff', { bold: true, italic: true, }),
			'class.declaration': ts('#0000ff', { italic: true }),
			'class.declaration.async': ts('#000fff', { underline: true, italic: true }),
			'class.declaration.async.static': ts('#000fff', { italic: true, underline: true, bold: true }),
		});

	});

	test('super type', async () => {
		const registry = getTokenClassificationRegistry();

		registry.registerTokenType('myTestInterface', 'A type just for testing', 'interface');
		registry.registerTokenType('myTestSubInterface', 'A type just for testing', 'myTestInterface');

		try {
			const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');
			themeData.setCustomColors({ 'editor.foreground': '#000000' });
			themeData.setCustomSemanticTokenColors({
				enabled: true,
				rules: {
					'interface': '#ff0000',
					'myTestInterface': { italic: true },
					'interface.static': { bold: true }
				}
			});

			assertTokenStyles(themeData, { 'myTestSubInterface': ts('#ff0000', { italic: true }) });
			assertTokenStyles(themeData, { 'myTestSubInterface.static': ts('#ff0000', { italic: true, bold: true }) });

			themeData.setCustomSemanticTokenColors({
				enabled: true,
				rules: {
					'interface': '#ff0000',
					'myTestInterface': { foreground: '#ff00ff', italic: true }
				}
			});
			assertTokenStyles(themeData, { 'myTestSubInterface': ts('#ff00ff', { italic: true }) });
		} finally {
			registry.deregisterTokenType('myTestInterface');
			registry.deregisterTokenType('myTestSubInterface');
		}
	});

	test('language', async () => {
		try {
			const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');
			themeData.setCustomColors({ 'editor.foreground': '#000000' });
			themeData.setCustomSemanticTokenColors({
				enabled: true,
				rules: {
					'interface': '#fff000',
					'interface:java': '#ff0000',
					'interface.static': { bold: true },
					'interface.static:typescript': { italic: true }
				}
			});

			assertTokenStyles(themeData, { 'interface': ts('#ff0000', undefined) }, 'java');
			assertTokenStyles(themeData, { 'interface': ts('#fff000', undefined) }, 'typescript');
			assertTokenStyles(themeData, { 'interface.static': ts('#ff0000', { bold: true }) }, 'java');
			assertTokenStyles(themeData, { 'interface.static': ts('#fff000', { bold: true, italic: true }) }, 'typescript');
		} finally {
		}
	});

	test('language - scope resolving', async () => {
		const registry = getTokenClassificationRegistry();

		const numberOfDefaultRules = registry.getTokenStylingDefaultRules().length;

		registry.registerTokenStyleDefault(registry.parseTokenSelector('type', 'typescript1'), { scopesToProbe: [['entity.name.type.ts1']] });
		registry.registerTokenStyleDefault(registry.parseTokenSelector('type:javascript1'), { scopesToProbe: [['entity.name.type.js1']] });

		try {
			const themeData = ColorThemeData.createLoadedEmptyTheme('test', 'test');
			themeData.setCustomColors({ 'editor.foreground': '#000000' });
			themeData.setCustomTokenColors({
				textMateRules: [
					{
						scope: 'entity.name.type',
						settings: { foreground: '#aa0000' }
					},
					{
						scope: 'entity.name.type.ts1',
						settings: { foreground: '#bb0000' }
					}
				]
			});

			assertTokenStyles(themeData, { 'type': ts('#aa0000', undefined) }, 'javascript1');
			assertTokenStyles(themeData, { 'type': ts('#bb0000', undefined) }, 'typescript1');

		} finally {
			registry.deregisterTokenStyleDefault(registry.parseTokenSelector('type', 'typescript1'));
			registry.deregisterTokenStyleDefault(registry.parseTokenSelector('type:javascript1'));

			assert.strictEqual(registry.getTokenStylingDefaultRules().length, numberOfDefaultRules);
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/timer/browser/timerService.ts]---
Location: vscode-main/src/vs/workbench/services/timer/browser/timerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as perf from '../../../../base/common/performance.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { ITelemetryData, ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Barrier, timeout } from '../../../../base/common/async.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';
import { IPaneCompositePartService } from '../../panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { TelemetryTrustedValue } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { isWeb } from '../../../../base/common/platform.js';
import { createBlobWorker } from '../../../../platform/webWorker/browser/webWorkerServiceImpl.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITerminalBackendRegistry, TerminalExtensions } from '../../../../platform/terminal/common/terminal.js';

/* __GDPR__FRAGMENT__
	"IMemoryInfo" : {
		"workingSetSize" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"privateBytes": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"sharedBytes": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
	}
*/
export interface IMemoryInfo {
	readonly workingSetSize: number;
	readonly privateBytes: number;
	readonly sharedBytes: number;
}

/* __GDPR__FRAGMENT__
	"IStartupMetrics" : {
		"ellapsed" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"isLatestVersion": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"didUseCachedData": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"windowKind": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"windowCount": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"viewletId": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"panelId": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"editorIds": { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"timers.ellapsedAppReady" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedNlsGeneration" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedLoadMainBundle" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedRunMainBundle" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedCrashReporter" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedMainServer" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWindowCreate" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWindowLoad" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWindowLoadToRequire" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWaitForWindowConfig" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedStorageInit" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWorkspaceServiceInit" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedSharedProcesConnected" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedRequiredUserDataInit" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedOtherUserDataInit" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedRequire" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedExtensions" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedExtensionsReady" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedViewletRestore" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedAuxiliaryViewletRestore" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedPanelRestore" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedEditorRestore" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWorkbenchContributions" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"timers.ellapsedWorkbench" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"platform" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"release" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"arch" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"totalmem" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"freemem" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"meminfo" : { "${inline}": [ "${IMemoryInfo}" ] },
		"cpus.count" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"cpus.speed" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"cpus.model" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"initialStartup" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"hasAccessibilitySupport" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"isVMLikelyhood" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"emptyWorkbench" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true },
		"loadavg" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" },
		"isARM64Emulated" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth", "isMeasurement": true }
	}
*/
export interface IStartupMetrics {

	/**
	 * If this started the main process and renderer or just a renderer (new or reloaded).
	 */
	readonly initialStartup: boolean;

	/**
	 * No folder, no file, no workspace has been opened
	 */
	readonly emptyWorkbench: boolean;

	/**
	 * This is the latest (stable/insider) version. Iff not we should ignore this
	 * measurement.
	 */
	readonly isLatestVersion: boolean;

	/**
	 * Whether we asked for and V8 accepted cached data.
	 */
	readonly didUseCachedData: boolean;

	/**
	 * How/why the window was created. See https://github.com/microsoft/vscode/blob/d1f57d871722f4d6ba63e4ef6f06287121ceb045/src/vs/platform/lifecycle/common/lifecycle.ts#L50
	 */
	readonly windowKind: number;

	/**
	 * The total number of windows that have been restored/created
	 */
	readonly windowCount: number;

	/**
	 * The active viewlet id or `undedined`
	 */
	readonly viewletId?: string;

	/**
	 * The active auxiliary viewlet id or `undedined`
	 */
	readonly auxiliaryViewletId?: string;

	/**
	 * The active panel id or `undefined`
	 */
	readonly panelId?: string;

	/**
	 * The editor input types or `[]`
	 */
	readonly editorIds: string[];

	/**
	 * The time it took to create the workbench.
	 *
	 * * Happens in the main-process *and* the renderer-process
	 * * Measured with the *start* and `didStartWorkbench`-performance mark. The *start* is either the start of the
	 * main process or the start of the renderer.
	 * * This should be looked at carefully because times vary depending on
	 *  * This being the first window, the only window, or a reloaded window
	 *  * Cached data being present and used or not
	 *  * The numbers and types of editors being restored
	 *  * The numbers of windows being restored (when starting 'fresh')
	 *  * The viewlet being restored (esp. when it's a contributed viewlet)
	 */
	readonly ellapsed: number;

	/**
	 * Individual timers...
	 */
	readonly timers: {
		/**
		 * The time it took to receieve the [`ready`](https://electronjs.org/docs/api/app#event-ready)-event. Measured from the first line
		 * of JavaScript code till receiving that event.
		 *
		 * * Happens in the main-process
		 * * Measured with the `main:started` and `main:appReady` performance marks.
		 * * This can be compared between insider and stable builds.
		 * * This should be looked at per OS version and per electron version.
		 * * This is often affected by AV software (and can change with AV software updates outside of our release-cycle).
		 * * It is not our code running here and we can only observe what's happening.
		 */
		readonly ellapsedAppReady?: number;

		/**
		 * The time it took to generate NLS data.
		 *
		 * * Happens in the main-process
		 * * Measured with the `nlsGeneration:start` and `nlsGeneration:end` performance marks.
		 * * This only happens when a non-english locale is being used.
		 * * It is our code running here and we should monitor this carefully for regressions.
		 */
		readonly ellapsedNlsGeneration?: number;

		/**
		 * The time it took to load the main bundle.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willLoadMainBundle` and `didLoadMainBundle` performance marks.
		 */
		readonly ellapsedLoadMainBundle?: number;

		/**
		 * The time it took to run the main bundle.
		 *
		 * * Happens in the main-process
		 * * Measured with the `didStartMain` and `didRunMainBundle` performance marks.
		 */
		readonly ellapsedRunMainBundle?: number;

		/**
		 * The time it took to start the crash reporter.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willStartCrashReporter` and `didStartCrashReporter` performance marks.
		 */
		readonly ellapsedCrashReporter?: number;

		/**
		 * The time it took to create the main instance server.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willStartMainServer` and `didStartMainServer` performance marks.
		 */
		readonly ellapsedMainServer?: number;

		/**
		 * The time it took to create the window.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willCreateCodeWindow` and `didCreateCodeWindow` performance marks.
		 */
		readonly ellapsedWindowCreate?: number;

		/**
		 * The time it took to create the electron browser window.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willCreateCodeBrowserWindow` and `didCreateCodeBrowserWindow` performance marks.
		 */
		readonly ellapsedBrowserWindowCreate?: number;

		/**
		 * The time it took to restore and validate window state.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willRestoreCodeWindowState` and `didRestoreCodeWindowState` performance marks.
		 */
		readonly ellapsedWindowRestoreState?: number;

		/**
		 * The time it took to maximize/show the window.
		 *
		 * * Happens in the main-process
		 * * Measured with the `willMaximizeCodeWindow` and `didMaximizeCodeWindow` performance marks.
		 */
		readonly ellapsedWindowMaximize?: number;

		/**
		 * The time it took to tell electron to open/restore a renderer (browser window).
		 *
		 * * Happens in the main-process
		 * * Measured with the `main:appReady` and `code/willOpenNewWindow` performance marks.
		 * * This can be compared between insider and stable builds.
		 * * It is our code running here and we should monitor this carefully for regressions.
		 */
		readonly ellapsedWindowLoad?: number;

		/**
		 * The time it took to create a new renderer (browser window) and to initialize that to the point
		 * of load the main-bundle (`workbench.desktop.main.js`).
		 *
		 * * Happens in the main-process *and* the renderer-process
		 * * Measured with the `code/willOpenNewWindow` and `willLoadWorkbenchMain` performance marks.
		 * * This can be compared between insider and stable builds.
		 * * It is mostly not our code running here and we can only observe what's happening.
		 *
		 */
		readonly ellapsedWindowLoadToRequire: number;

		/**
		 * The time it took to wait for resolving the window configuration. This time the workbench
		 * will not continue to load and be blocked entirely.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willWaitForWindowConfig` and `didWaitForWindowConfig` performance marks.
		 */
		readonly ellapsedWaitForWindowConfig: number;

		/**
		 * The time it took to init the storage database connection from the workbench.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `code/willInitStorage` and `code/didInitStorage` performance marks.
		 */
		readonly ellapsedStorageInit: number;

		/**
		 * The time it took to initialize the workspace and configuration service.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willInitWorkspaceService` and `didInitWorkspaceService` performance marks.
		 */
		readonly ellapsedWorkspaceServiceInit: number;

		/**
		 * The time it took to connect to the shared process.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willConnectSharedProcess` and `didConnectSharedProcess` performance marks.
		 */
		readonly ellapsedSharedProcesConnected: number;

		/**
		 * The time it took to initialize required user data (settings & global state) using settings sync service.
		 *
		 * * Happens in the renderer-process (only in Web)
		 * * Measured with the `willInitRequiredUserData` and `didInitRequiredUserData` performance marks.
		 */
		readonly ellapsedRequiredUserDataInit: number;

		/**
		 * The time it took to initialize other user data (keybindings, snippets & extensions) using settings sync service.
		 *
		 * * Happens in the renderer-process (only in Web)
		 * * Measured with the `willInitOtherUserData` and `didInitOtherUserData` performance marks.
		 */
		readonly ellapsedOtherUserDataInit: number;

		/**
		 * The time it took to load the main-bundle of the workbench, e.g. `workbench.desktop.main.js`.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willLoadWorkbenchMain` and `didLoadWorkbenchMain` performance marks.
		 * * This varies *a lot* when V8 cached data could be used or not
		 * * This should be looked at with and without V8 cached data usage and per electron/v8 version
		 * * This is affected by the size of our code bundle (which  grows about 3-5% per release)
		 */
		readonly ellapsedRequire: number;

		/**
		 * The time it took to read extensions' package.json-files *and* interpret them (invoking
		 * the contribution points).
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willLoadExtensions` and `didLoadExtensions` performance marks.
		 * * Reading of package.json-files is avoided by caching them all in a single file (after the read,
		 * until another extension is installed)
		 * * Happens in parallel to other things, depends on async timing
		 */
		readonly ellapsedExtensions: number;

		// the time from start till `didLoadExtensions`
		// remove?
		readonly ellapsedExtensionsReady: number;

		/**
		 * The time it took to restore the primary sidebar viewlet.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willRestoreViewlet` and `didRestoreViewlet` performance marks.
		 * * This should be looked at per viewlet-type/id.
		 * * Happens in parallel to other things, depends on async timing
		 */
		readonly ellapsedViewletRestore: number;

		/**
		 * The time it took to restore the auxiliary bar viewlet.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willRestoreAuxiliaryBar` and `didRestoreAuxiliaryBar` performance marks.
		 * * This should be looked at per viewlet-type/id.
		 * * Happens in parallel to other things, depends on async timing
		 */
		readonly ellapsedAuxiliaryViewletRestore: number;

		/**
		 * The time it took to restore the panel.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willRestorePanel` and `didRestorePanel` performance marks.
		 * * This should be looked at per panel-type/id.
		 * * Happens in parallel to other things, depends on async timing
		 */
		readonly ellapsedPanelRestore: number;

		/**
		 * The time it took to restore and fully resolve visible editors - that is text editor
		 * and complex editor likes the settings UI or webviews (markdown preview).
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willRestoreEditors` and `didRestoreEditors` performance marks.
		 * * This should be looked at per editor and per editor type.
		 * * Happens in parallel to other things, depends on async timing
		 */
		readonly ellapsedEditorRestore: number;

		/**
		 * The time it took to create all workbench contributions on the starting and ready
		 * lifecycle phase, thus blocking `ellapsedWorkbench`.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willCreateWorkbenchContributions/1` and `didCreateWorkbenchContributions/2` performance marks.
		 *
		 */
		readonly ellapsedWorkbenchContributions: number;

		/**
		 * The time it took to create the workbench.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `willStartWorkbench` and `didStartWorkbench` performance marks.
		 */
		readonly ellapsedWorkbench: number;

		/**
		 * This time it took inside the renderer to start the workbench.
		 *
		 * * Happens in the renderer-process
		 * * Measured with the `renderer/started` and `didStartWorkbench` performance marks
		 */
		readonly ellapsedRenderer: number;
	};

	readonly hasAccessibilitySupport: boolean;
	readonly isVMLikelyhood?: number;
	readonly platform?: string;
	readonly release?: string;
	readonly arch?: string;
	readonly totalmem?: number;
	readonly freemem?: number;
	readonly meminfo?: IMemoryInfo;
	readonly cpus?: { count: number; speed: number; model: string };
	readonly loadavg?: number[];
	readonly isARM64Emulated?: boolean;
}

export interface ITimerService {
	readonly _serviceBrand: undefined;

	/**
	 * A promise that resolved when startup timings and perf marks
	 * are available. This depends on lifecycle phases and extension
	 * hosts being started.
	 */
	whenReady(): Promise<boolean>;

	/**
	 * A baseline performance indicator for this machine. The value will only available
	 * late after startup because computing it takes away CPU resources
	 *
	 * NOTE that this returns -1 if the machine is hopelessly slow...
	 */
	perfBaseline: Promise<number>;

	/**
	 * Startup metrics. Can ONLY be accessed after `whenReady` has resolved.
	 */
	readonly startupMetrics: IStartupMetrics;

	/**
	 * Deliver performance marks from a source, like the main process or extension hosts.
	 * The source argument acts as an identifier and therefore it must be unique.
	 */
	setPerformanceMarks(source: string, marks: perf.PerformanceMark[]): void;

	/**
	 * Get all currently known performance marks by source. There is no sorting of the
	 * returned tuples but the marks of a tuple are guaranteed to be sorted by start times.
	 */
	getPerformanceMarks(): [source: string, marks: readonly perf.PerformanceMark[]][];

	/**
	 * Return the duration between two marks.
	 * @param from from mark name
	 * @param to to mark name
	 */
	getDuration(from: string, to: string): number;

	/**
	 * Return the timestamp of a mark.
	 * @param mark mark name
	 */
	getStartTime(mark: string): number;
}

export const ITimerService = createDecorator<ITimerService>('timerService');


class PerfMarks {

	private readonly _entries: [string, perf.PerformanceMark[]][] = [];

	setMarks(source: string, entries: perf.PerformanceMark[]): void {
		this._entries.push([source, entries]);
	}

	getDuration(from: string, to: string): number {
		const fromEntry = this._findEntry(from);
		if (!fromEntry) {
			return 0;
		}
		const toEntry = this._findEntry(to);
		if (!toEntry) {
			return 0;
		}
		return toEntry.startTime - fromEntry.startTime;
	}

	getStartTime(mark: string): number {
		const entry = this._findEntry(mark);
		return entry ? entry.startTime : -1;
	}

	private _findEntry(name: string): perf.PerformanceMark | void {
		for (const [, marks] of this._entries) {
			for (let i = marks.length - 1; i >= 0; i--) {
				if (marks[i].name === name) {
					return marks[i];
				}
			}
		}
	}

	getEntries() {
		return this._entries.slice(0);
	}
}

export type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

export abstract class AbstractTimerService implements ITimerService {

	declare readonly _serviceBrand: undefined;

	private readonly _barrier = new Barrier();
	private readonly _marks = new PerfMarks();
	private readonly _rndValueShouldSendTelemetry = Math.random() < .03; // 3% of users

	private _startupMetrics?: IStartupMetrics;

	readonly perfBaseline: Promise<number>;

	constructor(
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IUpdateService private readonly _updateService: IUpdateService,
		@IPaneCompositePartService private readonly _paneCompositeService: IPaneCompositePartService,
		@IEditorService private readonly _editorService: IEditorService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService
	) {
		Promise.all([
			this._extensionService.whenInstalledExtensionsRegistered(), // extensions registered
			_lifecycleService.when(LifecyclePhase.Restored),			// workbench created and parts restored
			layoutService.whenRestored,									// layout restored (including visible editors resolved)
			Promise.all(Array.from(Registry.as<ITerminalBackendRegistry>(TerminalExtensions.Backend).backends.values()).map(e => e.whenReady))
		]).then(() => {
			// set perf mark from renderer
			this.setPerformanceMarks('renderer', perf.getMarks());
			return this._computeStartupMetrics();
		}).then(metrics => {
			this._startupMetrics = metrics;
			this._reportStartupTimes(metrics);
			this._barrier.open();
		});


		this.perfBaseline = this._barrier.wait()
			.then(() => this._lifecycleService.when(LifecyclePhase.Eventually))
			.then(() => timeout(this._startupMetrics!.timers.ellapsedRequire))
			.then(() => {

				// we use fibonacci numbers to have a performance baseline that indicates
				// how slow/fast THIS machine actually is.

				const jsSrc = (function (this: WindowOrWorkerGlobalScope) {
					// the following operation took ~16ms (one frame at 64FPS) to complete on my machine. We derive performance observations
					// from that. We also bail if that took too long (>1s)
					let tooSlow = false;
					function fib(n: number): number {
						if (tooSlow) {
							return 0;
						}
						if (performance.now() - t1 >= 1000) {
							tooSlow = true;
						}
						if (n <= 2) {
							return n;
						}
						return fib(n - 1) + fib(n - 2);
					}

					const t1 = performance.now();
					fib(24);
					const value = Math.round(performance.now() - t1);
					self.postMessage({ value: tooSlow ? -1 : value });

				}).toString();

				const blob = new Blob([`(${jsSrc})();`], { type: 'application/javascript' });
				const blobUrl = URL.createObjectURL(blob);

				const worker = createBlobWorker(blobUrl, { name: 'perfBaseline' });
				return new Promise<number>(resolve => {
					worker.onmessage = e => resolve(e.data.value);

				}).finally(() => {
					worker.terminate();
					URL.revokeObjectURL(blobUrl);
				});
			});
	}

	whenReady(): Promise<boolean> {
		return this._barrier.wait();
	}

	get startupMetrics(): IStartupMetrics {
		if (!this._startupMetrics) {
			throw new Error('illegal state, MUST NOT access startupMetrics before whenReady has resolved');
		}
		return this._startupMetrics;
	}

	setPerformanceMarks(source: string, marks: perf.PerformanceMark[]): void {
		// Perf marks are a shared resource because anyone can generate them
		// and because of that we only accept marks that start with 'code/'
		const codeMarks = marks.filter(mark => mark.name.startsWith('code/'));
		this._marks.setMarks(source, codeMarks);
		this._reportPerformanceMarks(source, codeMarks);
	}

	getPerformanceMarks(): [source: string, marks: readonly perf.PerformanceMark[]][] {
		return this._marks.getEntries();
	}

	getDuration(from: string, to: string): number {
		return this._marks.getDuration(from, to);
	}

	getStartTime(mark: string): number {
		return this._marks.getStartTime(mark);
	}

	private _reportStartupTimes(metrics: IStartupMetrics): void {
		// report IStartupMetrics as telemetry
		/* __GDPR__
			"startupTimeVaried" : {
				"owner": "jrieken",
				"${include}": [
					"${IStartupMetrics}"
				]
			}
		*/
		this._telemetryService.publicLog('startupTimeVaried', metrics as unknown as ITelemetryData);
	}

	protected _shouldReportPerfMarks(): boolean {
		return this._rndValueShouldSendTelemetry;
	}

	private _reportPerformanceMarks(source: string, marks: perf.PerformanceMark[]) {

		if (!this._shouldReportPerfMarks()) {
			// the `startup.timer.mark` event is send very often. In order to save resources
			// we let some of our instances/sessions send this event
			return;
		}

		// report raw timers as telemetry. each mark is send a separate telemetry
		// event and it is "normalized" to a relative timestamp where the first mark
		// defines the start

		type Mark = { source: string; name: TelemetryTrustedValue<string>; startTime: number };
		type MarkClassification = {
			owner: 'jrieken';
			comment: 'Information about a performance marker';
			source: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Where this marker was generated, e.g main, renderer, extension host' };
			name: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of this marker (as defined in source code)' };
			startTime: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The absolute timestamp (unix time)' };
		};

		for (const mark of marks) {
			this._telemetryService.publicLog2<Mark, MarkClassification>('startup.timer.mark', {
				source,
				name: new TelemetryTrustedValue(mark.name),
				startTime: mark.startTime
			});
		}

	}

	private async _computeStartupMetrics(): Promise<IStartupMetrics> {
		const initialStartup = this._isInitialStartup();
		let startMark: string;
		if (isWeb) {
			startMark = 'code/timeOrigin';
		} else {
			startMark = initialStartup ? 'code/didStartMain' : 'code/willOpenNewWindow';
		}

		const activeViewlet = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);
		const activeAuxiliaryViewlet = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.AuxiliaryBar);
		const activePanel = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		const info: Writeable<IStartupMetrics> = {

			ellapsed: this._marks.getDuration(startMark, 'code/didStartWorkbench'),

			// reflections
			isLatestVersion: Boolean(await this._updateService.isLatestVersion()),
			didUseCachedData: this._didUseCachedData(),
			windowKind: this._lifecycleService.startupKind,
			windowCount: await this._getWindowCount(),
			viewletId: activeViewlet?.getId(),
			auxiliaryViewletId: activeAuxiliaryViewlet?.getId(),
			editorIds: this._editorService.visibleEditors.map(input => input.typeId),
			panelId: activePanel ? activePanel.getId() : undefined,

			// timers
			timers: {
				ellapsedAppReady: initialStartup ? this._marks.getDuration('code/didStartMain', 'code/mainAppReady') : undefined,
				ellapsedNlsGeneration: initialStartup ? this._marks.getDuration('code/willGenerateNls', 'code/didGenerateNls') : undefined,
				ellapsedLoadMainBundle: initialStartup ? this._marks.getDuration('code/willLoadMainBundle', 'code/didLoadMainBundle') : undefined,
				ellapsedRunMainBundle: initialStartup ? this._marks.getDuration('code/didStartMain', 'code/didRunMainBundle') : undefined,
				ellapsedCrashReporter: initialStartup ? this._marks.getDuration('code/willStartCrashReporter', 'code/didStartCrashReporter') : undefined,
				ellapsedMainServer: initialStartup ? this._marks.getDuration('code/willStartMainServer', 'code/didStartMainServer') : undefined,
				ellapsedWindowCreate: initialStartup ? this._marks.getDuration('code/willCreateCodeWindow', 'code/didCreateCodeWindow') : undefined,
				ellapsedWindowRestoreState: initialStartup ? this._marks.getDuration('code/willRestoreCodeWindowState', 'code/didRestoreCodeWindowState') : undefined,
				ellapsedBrowserWindowCreate: initialStartup ? this._marks.getDuration('code/willCreateCodeBrowserWindow', 'code/didCreateCodeBrowserWindow') : undefined,
				ellapsedWindowMaximize: initialStartup ? this._marks.getDuration('code/willMaximizeCodeWindow', 'code/didMaximizeCodeWindow') : undefined,
				ellapsedWindowLoad: initialStartup ? this._marks.getDuration('code/mainAppReady', 'code/willOpenNewWindow') : undefined,
				ellapsedWindowLoadToRequire: this._marks.getDuration('code/willOpenNewWindow', 'code/willLoadWorkbenchMain'),
				ellapsedRequire: this._marks.getDuration('code/willLoadWorkbenchMain', 'code/didLoadWorkbenchMain'),
				ellapsedWaitForWindowConfig: this._marks.getDuration('code/willWaitForWindowConfig', 'code/didWaitForWindowConfig'),
				ellapsedStorageInit: this._marks.getDuration('code/willInitStorage', 'code/didInitStorage'),
				ellapsedSharedProcesConnected: this._marks.getDuration('code/willConnectSharedProcess', 'code/didConnectSharedProcess'),
				ellapsedWorkspaceServiceInit: this._marks.getDuration('code/willInitWorkspaceService', 'code/didInitWorkspaceService'),
				ellapsedRequiredUserDataInit: this._marks.getDuration('code/willInitRequiredUserData', 'code/didInitRequiredUserData'),
				ellapsedOtherUserDataInit: this._marks.getDuration('code/willInitOtherUserData', 'code/didInitOtherUserData'),
				ellapsedExtensions: this._marks.getDuration('code/willLoadExtensions', 'code/didLoadExtensions'),
				ellapsedEditorRestore: this._marks.getDuration('code/willRestoreEditors', 'code/didRestoreEditors'),
				ellapsedViewletRestore: this._marks.getDuration('code/willRestoreViewlet', 'code/didRestoreViewlet'),
				ellapsedAuxiliaryViewletRestore: this._marks.getDuration('code/willRestoreAuxiliaryBar', 'code/didRestoreAuxiliaryBar'),
				ellapsedPanelRestore: this._marks.getDuration('code/willRestorePanel', 'code/didRestorePanel'),
				ellapsedWorkbenchContributions: this._marks.getDuration('code/willCreateWorkbenchContributions/1', 'code/didCreateWorkbenchContributions/2'),
				ellapsedWorkbench: this._marks.getDuration('code/willStartWorkbench', 'code/didStartWorkbench'),
				ellapsedExtensionsReady: this._marks.getDuration(startMark, 'code/didLoadExtensions'),
				ellapsedRenderer: this._marks.getDuration('code/didStartRenderer', 'code/didStartWorkbench')
			},

			// system info
			platform: undefined,
			release: undefined,
			arch: undefined,
			totalmem: undefined,
			freemem: undefined,
			meminfo: undefined,
			cpus: undefined,
			loadavg: undefined,
			isVMLikelyhood: undefined,
			initialStartup,
			hasAccessibilitySupport: this._accessibilityService.isScreenReaderOptimized(),
			emptyWorkbench: this._contextService.getWorkbenchState() === WorkbenchState.EMPTY
		};

		await this._extendStartupInfo(info);
		return info;
	}

	protected abstract _isInitialStartup(): boolean;

	protected abstract _didUseCachedData(): boolean;

	protected abstract _getWindowCount(): Promise<number>;

	protected abstract _extendStartupInfo(info: Writeable<IStartupMetrics>): Promise<void>;
}


export class TimerService extends AbstractTimerService {

	protected _isInitialStartup(): boolean {
		return false;
	}
	protected _didUseCachedData(): boolean {
		return false;
	}
	protected async _getWindowCount(): Promise<number> {
		return 1;
	}
	protected async _extendStartupInfo(info: Writeable<IStartupMetrics>): Promise<void> {
		info.isVMLikelyhood = 0;
		info.isARM64Emulated = false;
		info.platform = navigator.userAgent;
		info.release = navigator.appVersion;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/timer/electron-browser/timerService.ts]---
Location: vscode-main/src/vs/workbench/services/timer/electron-browser/timerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IUpdateService } from '../../../../platform/update/common/update.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { IStartupMetrics, AbstractTimerService, Writeable, ITimerService } from '../browser/timerService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { process } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchLayoutService } from '../../layout/browser/layoutService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IPaneCompositePartService } from '../../panecomposite/browser/panecomposite.js';

export class TimerService extends AbstractTimerService {

	constructor(
		@INativeHostService private readonly _nativeHostService: INativeHostService,
		@INativeWorkbenchEnvironmentService private readonly _environmentService: INativeWorkbenchEnvironmentService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IExtensionService extensionService: IExtensionService,
		@IUpdateService updateService: IUpdateService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@IEditorService editorService: IEditorService,
		@IAccessibilityService accessibilityService: IAccessibilityService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IProductService private readonly _productService: IProductService,
		@IStorageService private readonly _storageService: IStorageService
	) {
		super(lifecycleService, contextService, extensionService, updateService, paneCompositeService, editorService, accessibilityService, telemetryService, layoutService);
		this.setPerformanceMarks('main', _environmentService.window.perfMarks);
	}

	protected _isInitialStartup(): boolean {
		return Boolean(this._environmentService.window.isInitialStartup);
	}
	protected _didUseCachedData(): boolean {
		return didUseCachedData(this._productService, this._storageService, this._environmentService);
	}
	protected _getWindowCount(): Promise<number> {
		return this._nativeHostService.getWindowCount();
	}

	protected async _extendStartupInfo(info: Writeable<IStartupMetrics>): Promise<void> {
		try {
			const [osProperties, osStatistics, virtualMachineHint, isARM64Emulated] = await Promise.all([
				this._nativeHostService.getOSProperties(),
				this._nativeHostService.getOSStatistics(),
				this._nativeHostService.getOSVirtualMachineHint(),
				this._nativeHostService.isRunningUnderARM64Translation()
			]);

			info.totalmem = osStatistics.totalmem;
			info.freemem = osStatistics.freemem;
			info.platform = osProperties.platform;
			info.release = osProperties.release;
			info.arch = osProperties.arch;
			info.loadavg = osStatistics.loadavg;
			info.isARM64Emulated = isARM64Emulated;

			const processMemoryInfo = await process.getProcessMemoryInfo();
			info.meminfo = {
				workingSetSize: processMemoryInfo.residentSet,
				privateBytes: processMemoryInfo.private,
				sharedBytes: processMemoryInfo.shared
			};

			info.isVMLikelyhood = Math.round((virtualMachineHint * 100));

			const rawCpus = osProperties.cpus;
			if (rawCpus && rawCpus.length > 0) {
				info.cpus = { count: rawCpus.length, speed: rawCpus[0].speed, model: rawCpus[0].model };
			}
		} catch (error) {
			// ignore, be on the safe side with these hardware method calls
		}
	}

	protected override _shouldReportPerfMarks(): boolean {
		// always send when running with the prof-append-timers flag
		return super._shouldReportPerfMarks() || Boolean(this._environmentService.args['prof-append-timers']);
	}
}

registerSingleton(ITimerService, TimerService, InstantiationType.Delayed);

//#region cached data logic

const lastRunningCommitStorageKey = 'perf/lastRunningCommit';
let _didUseCachedData: boolean | undefined = undefined;

export function didUseCachedData(productService: IProductService, storageService: IStorageService, environmentService: INativeWorkbenchEnvironmentService): boolean {
	// browser code loading: only a guess based on
	// this being the first start with the commit
	// or subsequent
	if (typeof _didUseCachedData !== 'boolean') {
		if (!environmentService.window.isCodeCaching || !productService.commit) {
			_didUseCachedData = false; // we only produce cached data whith commit and code cache path
		} else if (storageService.get(lastRunningCommitStorageKey, StorageScope.APPLICATION) === productService.commit) {
			_didUseCachedData = true; // subsequent start on same commit, assume cached data is there
		} else {
			storageService.store(lastRunningCommitStorageKey, productService.commit, StorageScope.APPLICATION, StorageTarget.MACHINE);
			_didUseCachedData = false; // first time start on commit, assume cached data is not yet there
		}
	}
	return _didUseCachedData;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/title/browser/titleService.ts]---
Location: vscode-main/src/vs/workbench/services/title/browser/titleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IAuxiliaryTitlebarPart, ITitlebarPart } from '../../../browser/parts/titlebar/titlebarPart.js';
import { IEditorGroupsContainer } from '../../editor/common/editorGroupsService.js';

export const ITitleService = createDecorator<ITitleService>('titleService');

export interface ITitleService extends ITitlebarPart {

	readonly _serviceBrand: undefined;

	/**
	 * Get the status bar part that is rooted in the provided container.
	 */
	getPart(container: HTMLElement): ITitlebarPart;

	/**
	 * Creates a new auxililary title bar part in the provided container.
	 */
	createAuxiliaryTitlebarPart(container: HTMLElement, editorGroupsContainer: IEditorGroupsContainer, instantiationService: IInstantiationService): IAuxiliaryTitlebarPart;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/title/electron-browser/titleService.ts]---
Location: vscode-main/src/vs/workbench/services/title/electron-browser/titleService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { NativeTitleService } from '../../../electron-browser/parts/titlebar/titlebarPart.js';
import { ITitleService } from '../browser/titleService.js';

registerSingleton(ITitleService, NativeTitleService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/treeSitter/browser/treeSitter.contribution.ts]---
Location: vscode-main/src/vs/workbench/services/treeSitter/browser/treeSitter.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { ITreeSitterThemeService } from '../../../../editor/common/services/treeSitter/treeSitterThemeService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { TreeSitterLibraryService } from './treeSitterLibraryService.js';
import { TreeSitterThemeService } from './treeSitterThemeService.js';

registerSingleton(ITreeSitterLibraryService, TreeSitterLibraryService, InstantiationType.Eager);
registerSingleton(ITreeSitterThemeService, TreeSitterThemeService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/treeSitter/browser/treeSitterLibraryService.ts]---
Location: vscode-main/src/vs/workbench/services/treeSitter/browser/treeSitterLibraryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import type { Parser, Language, Query } from '@vscode/tree-sitter-wasm';
import { IReader, ObservablePromise } from '../../../../base/common/observable.js';
import { ITreeSitterLibraryService } from '../../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { canASAR, importAMDNodeModule } from '../../../../amdX.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { FileOperationResult, IFileContent, IFileService, toFileOperationResult } from '../../../../platform/files/common/files.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { CachedFunction } from '../../../../base/common/cache.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { AppResourcePath, FileAccess, nodeModulesAsarUnpackedPath, nodeModulesPath } from '../../../../base/common/network.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';

export const EDITOR_EXPERIMENTAL_PREFER_TREESITTER = 'editor.experimental.preferTreeSitter';
export const TREESITTER_ALLOWED_SUPPORT = ['css', 'typescript', 'ini', 'regex'];

const MODULE_LOCATION_SUBPATH = `@vscode/tree-sitter-wasm/wasm`;
const FILENAME_TREESITTER_WASM = `tree-sitter.wasm`;

export function getModuleLocation(environmentService: IEnvironmentService): AppResourcePath {
	return `${(canASAR && environmentService.isBuilt) ? nodeModulesAsarUnpackedPath : nodeModulesPath}/${MODULE_LOCATION_SUBPATH}`;
}

export class TreeSitterLibraryService extends Disposable implements ITreeSitterLibraryService {
	_serviceBrand: undefined;
	isTest: boolean = false;

	private readonly _treeSitterImport = new Lazy(async () => {
		const TreeSitter = await importAMDNodeModule<typeof import('@vscode/tree-sitter-wasm')>('@vscode/tree-sitter-wasm', 'wasm/tree-sitter.js');
		const environmentService = this._environmentService;
		const isTest = this.isTest;
		await TreeSitter.Parser.init({
			locateFile(_file: string, _folder: string) {
				const location: AppResourcePath = `${getModuleLocation(environmentService)}/${FILENAME_TREESITTER_WASM}`;
				if (isTest) {
					return FileAccess.asFileUri(location).toString(true);
				} else {
					return FileAccess.asBrowserUri(location).toString(true);
				}
			}
		});
		return TreeSitter;
	});

	private readonly _supportsLanguage = new CachedFunction((languageId: string) => {
		return observableConfigValue(`${EDITOR_EXPERIMENTAL_PREFER_TREESITTER}.${languageId}`, false, this._configurationService);
	});

	private readonly _languagesCache = new CachedFunction((languageId: string) => {
		return ObservablePromise.fromFn(async () => {
			const languageLocation = getModuleLocation(this._environmentService);
			const grammarName = `tree-sitter-${languageId}`;

			const wasmPath: AppResourcePath = `${languageLocation}/${grammarName}.wasm`;
			const [treeSitter, languageFile] = await Promise.all([
				this._treeSitterImport.value,
				this._fileService.readFile(FileAccess.asFileUri(wasmPath))
			]);

			const Language = treeSitter.Language;
			const language = await Language.load(languageFile.value.buffer);
			return language;
		});
	});

	private readonly _injectionQueries = new CachedFunction({ getCacheKey: JSON.stringify }, (arg: { languageId: string; kind: 'injections' | 'highlights' }) => {
		const loadQuerySource = async () => {
			const injectionsQueriesLocation: AppResourcePath = `vs/editor/common/languages/${arg.kind}/${arg.languageId}.scm`;
			const uri = FileAccess.asFileUri(injectionsQueriesLocation);
			if (!this._fileService.hasProvider(uri)) {
				return undefined;
			}
			const query = await tryReadFile(this._fileService, uri);
			if (query === undefined) {
				return undefined;
			}
			return query.value.toString();
		};

		return ObservablePromise.fromFn(async () => {
			const [
				querySource,
				language,
				treeSitter
			] = await Promise.all([
				loadQuerySource(),
				this._languagesCache.get(arg.languageId).promise,
				this._treeSitterImport.value,
			]);

			if (querySource === undefined) {
				return null;
			}

			const Query = treeSitter.Query;
			return new Query(language, querySource);
		}).resolvedValue;
	});

	constructor(
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IFileService private readonly _fileService: IFileService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
	) {
		super();
	}

	supportsLanguage(languageId: string, reader: IReader | undefined): boolean {
		return this._supportsLanguage.get(languageId).read(reader);
	}

	async getParserClass(): Promise<typeof Parser> {
		const treeSitter = await this._treeSitterImport.value;
		return treeSitter.Parser;
	}

	getLanguage(languageId: string, ignoreSupportsCheck: boolean, reader: IReader | undefined): Language | undefined {
		if (!ignoreSupportsCheck && !this.supportsLanguage(languageId, reader)) {
			return undefined;
		}
		const lang = this._languagesCache.get(languageId).resolvedValue.read(reader);
		return lang;
	}

	async getLanguagePromise(languageId: string): Promise<Language | undefined> {
		return this._languagesCache.get(languageId).promise;
	}

	getInjectionQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		if (!this.supportsLanguage(languageId, reader)) {
			return undefined;
		}
		const query = this._injectionQueries.get({ languageId, kind: 'injections' }).read(reader);
		return query;
	}

	getHighlightingQueries(languageId: string, reader: IReader | undefined): Query | null | undefined {
		if (!this.supportsLanguage(languageId, reader)) {
			return undefined;
		}
		const query = this._injectionQueries.get({ languageId, kind: 'highlights' }).read(reader);
		return query;
	}

	async createQuery(language: Language, querySource: string): Promise<Query> {
		const treeSitter = await this._treeSitterImport.value;
		return new treeSitter.Query(language, querySource);
	}
}

async function tryReadFile(fileService: IFileService, uri: URI): Promise<IFileContent | undefined> {
	try {
		const result = await fileService.readFile(uri);
		return result;
	} catch (e) {
		if (toFileOperationResult(e) === FileOperationResult.FILE_NOT_FOUND) {
			return undefined;
		}
		throw e;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/treeSitter/browser/treeSitterThemeService.ts]---
Location: vscode-main/src/vs/workbench/services/treeSitter/browser/treeSitterThemeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { derived, IObservable, IReader, observableFromEvent } from '../../../../base/common/observable.js';
import { ITreeSitterThemeService } from '../../../../editor/common/services/treeSitter/treeSitterThemeService.js';
import { ColorThemeData, findMetadata } from '../../themes/common/colorThemeData.js';
import { IWorkbenchThemeService } from '../../themes/common/workbenchThemeService.js';

export class TreeSitterThemeService implements ITreeSitterThemeService {
	_serviceBrand: undefined;
	public readonly onChange: IObservable<void>;
	private readonly _colorTheme: IObservable<ColorThemeData>;

	constructor(
		@IWorkbenchThemeService private readonly _themeService: IWorkbenchThemeService,
	) {
		this._colorTheme = observableFromEvent(this._themeService.onDidColorThemeChange, () => this._themeService.getColorTheme() as ColorThemeData);
		this.onChange = derived(this, (reader) => {
			this._colorTheme.read(reader);
			reader.reportChange(void 0);
		});
	}

	findMetadata(captureNames: string[], languageId: number, bracket: boolean, reader: IReader | undefined): number {
		return findMetadata(this._colorTheme.read(reader), captureNames, languageId, bracket);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/tunnel/browser/tunnelService.ts]---
Location: vscode-main/src/vs/workbench/services/tunnel/browser/tunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IAddressProvider } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { AbstractTunnelService, ITunnelProvider, ITunnelService, RemoteTunnel, isTunnelProvider } from '../../../../platform/tunnel/common/tunnel.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';

export class TunnelService extends AbstractTunnelService {
	constructor(
		@ILogService logService: ILogService,
		@IWorkbenchEnvironmentService private environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(logService, configurationService);
	}

	public isPortPrivileged(_port: number): boolean {
		return false;
	}

	protected retainOrCreateTunnel(tunnelProvider: IAddressProvider | ITunnelProvider, remoteHost: string, remotePort: number, _localHost: string, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		const existing = this.getTunnelFromMap(remoteHost, remotePort);
		if (existing) {
			++existing.refcount;
			return existing.value;
		}

		if (isTunnelProvider(tunnelProvider)) {
			return this.createWithProvider(tunnelProvider, remoteHost, remotePort, localPort, elevateIfNeeded, privacy, protocol);
		}
		return undefined;
	}

	override canTunnel(uri: URI): boolean {
		return super.canTunnel(uri) && !!this.environmentService.remoteAuthority;
	}
}

registerSingleton(ITunnelService, TunnelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/tunnel/electron-browser/tunnelService.ts]---
Location: vscode-main/src/vs/workbench/services/tunnel/electron-browser/tunnelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ITunnelService, AbstractTunnelService, RemoteTunnel, TunnelPrivacyId, isPortPrivileged, ITunnelProvider, isTunnelProvider } from '../../../../platform/tunnel/common/tunnel.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IAddressProvider } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { ISharedProcessTunnelService } from '../../../../platform/remote/common/sharedProcessTunnelService.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { OS } from '../../../../base/common/platform.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

class SharedProcessTunnel extends Disposable implements RemoteTunnel {

	public readonly privacy = TunnelPrivacyId.Private;
	public readonly protocol: string | undefined = undefined;

	constructor(
		private readonly _id: string,
		private readonly _addressProvider: IAddressProvider,
		public readonly tunnelRemoteHost: string,
		public readonly tunnelRemotePort: number,
		public readonly tunnelLocalPort: number | undefined,
		public readonly localAddress: string,
		private readonly _onBeforeDispose: () => void,
		@ISharedProcessTunnelService private readonly _sharedProcessTunnelService: ISharedProcessTunnelService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
	) {
		super();
		this._updateAddress();
		this._register(this._remoteAuthorityResolverService.onDidChangeConnectionData(() => this._updateAddress()));
	}

	private _updateAddress(): void {
		this._addressProvider.getAddress().then((address) => {
			this._sharedProcessTunnelService.setAddress(this._id, address);
		});
	}

	public override async dispose(): Promise<void> {
		this._onBeforeDispose();
		super.dispose();
		await this._sharedProcessTunnelService.destroyTunnel(this._id);
	}
}

export class TunnelService extends AbstractTunnelService {

	private readonly _activeSharedProcessTunnels = new Set<string>();

	public constructor(
		@ILogService logService: ILogService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ISharedProcessTunnelService private readonly _sharedProcessTunnelService: ISharedProcessTunnelService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@INativeWorkbenchEnvironmentService private readonly _nativeWorkbenchEnvironmentService: INativeWorkbenchEnvironmentService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(logService, configurationService);

		// Destroy any shared process tunnels that might still be active
		this._register(lifecycleService.onDidShutdown(() => {
			this._activeSharedProcessTunnels.forEach((id) => {
				this._sharedProcessTunnelService.destroyTunnel(id);
			});
		}));
	}

	public isPortPrivileged(port: number): boolean {
		return isPortPrivileged(port, this.defaultTunnelHost, OS, this._nativeWorkbenchEnvironmentService.os.release);
	}

	protected retainOrCreateTunnel(addressOrTunnelProvider: IAddressProvider | ITunnelProvider, remoteHost: string, remotePort: number, localHost: string, localPort: number | undefined, elevateIfNeeded: boolean, privacy?: string, protocol?: string): Promise<RemoteTunnel | string | undefined> | undefined {
		const existing = this.getTunnelFromMap(remoteHost, remotePort);
		if (existing) {
			++existing.refcount;
			return existing.value;
		}

		if (isTunnelProvider(addressOrTunnelProvider)) {
			return this.createWithProvider(addressOrTunnelProvider, remoteHost, remotePort, localPort, elevateIfNeeded, privacy, protocol);
		} else {
			this.logService.trace(`ForwardedPorts: (TunnelService) Creating tunnel without provider ${remoteHost}:${remotePort} on local port ${localPort}.`);

			const tunnel = this._createSharedProcessTunnel(addressOrTunnelProvider, remoteHost, remotePort, localHost, localPort, elevateIfNeeded);
			this.logService.trace('ForwardedPorts: (TunnelService) Tunnel created without provider.');
			this.addTunnelToMap(remoteHost, remotePort, tunnel);
			return tunnel;
		}
	}

	private async _createSharedProcessTunnel(addressProvider: IAddressProvider, tunnelRemoteHost: string, tunnelRemotePort: number, tunnelLocalHost: string, tunnelLocalPort: number | undefined, elevateIfNeeded: boolean | undefined): Promise<RemoteTunnel> {
		const { id } = await this._sharedProcessTunnelService.createTunnel();
		this._activeSharedProcessTunnels.add(id);
		const authority = this._environmentService.remoteAuthority!;
		const result = await this._sharedProcessTunnelService.startTunnel(authority, id, tunnelRemoteHost, tunnelRemotePort, tunnelLocalHost, tunnelLocalPort, elevateIfNeeded);
		const tunnel = this._instantiationService.createInstance(SharedProcessTunnel, id, addressProvider, tunnelRemoteHost, tunnelRemotePort, result.tunnelLocalPort, result.localAddress, () => {
			this._activeSharedProcessTunnels.delete(id);
		});
		return tunnel;
	}

	override canTunnel(uri: URI): boolean {
		return super.canTunnel(uri) && !!this._environmentService.remoteAuthority;
	}
}

registerSingleton(ITunnelService, TunnelService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/untitled/common/untitledTextEditorHandler.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/common/untitledTextEditorHandler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IEditorSerializer } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ITextEditorService } from '../../textfile/common/textEditorService.js';
import { isEqual, toLocalResource } from '../../../../base/common/resources.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IPathService } from '../../path/common/pathService.js';
import { UntitledTextEditorInput } from './untitledTextEditorInput.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IWorkingCopyIdentifier, NO_TYPE_ID } from '../../workingCopy/common/workingCopy.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../workingCopy/common/workingCopyEditorService.js';
import { IUntitledTextEditorService } from './untitledTextEditorService.js';

interface ISerializedUntitledTextEditorInput {
	readonly resourceJSON: UriComponents;
	readonly modeId: string | undefined; // should be `languageId` but is kept for backwards compatibility
	readonly encoding: string | undefined;
}

export class UntitledTextEditorInputSerializer implements IEditorSerializer {

	constructor(
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IPathService private readonly pathService: IPathService
	) { }

	canSerialize(editorInput: EditorInput): boolean {
		return this.filesConfigurationService.isHotExitEnabled && !editorInput.isDisposed();
	}

	serialize(editorInput: EditorInput): string | undefined {
		if (!this.canSerialize(editorInput)) {
			return undefined;
		}

		const untitledTextEditorInput = editorInput as UntitledTextEditorInput;

		let resource = untitledTextEditorInput.resource;
		if (untitledTextEditorInput.hasAssociatedFilePath) {
			resource = toLocalResource(resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme); // untitled with associated file path use the local schema
		}

		// Language: only remember language if it is either specific (not text)
		// or if the language was explicitly set by the user. We want to preserve
		// this information across restarts and not set the language unless
		// this is the case.
		let languageId: string | undefined;
		const languageIdCandidate = untitledTextEditorInput.getLanguageId();
		if (languageIdCandidate !== PLAINTEXT_LANGUAGE_ID) {
			languageId = languageIdCandidate;
		} else if (untitledTextEditorInput.hasLanguageSetExplicitly) {
			languageId = languageIdCandidate;
		}

		const serialized: ISerializedUntitledTextEditorInput = {
			resourceJSON: resource.toJSON(),
			modeId: languageId,
			encoding: untitledTextEditorInput.getEncoding()
		};

		return JSON.stringify(serialized);
	}

	deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): UntitledTextEditorInput {
		return instantiationService.invokeFunction(accessor => {
			const deserialized: ISerializedUntitledTextEditorInput = JSON.parse(serializedEditorInput);
			const resource = URI.revive(deserialized.resourceJSON);
			const languageId = deserialized.modeId;
			const encoding = deserialized.encoding;

			return accessor.get(ITextEditorService).createTextEditor({ resource, languageId, encoding, forceUntitled: true }) as UntitledTextEditorInput;
		});
	}
}

export class UntitledTextEditorWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.untitledTextEditorWorkingCopyEditorHandler';

	constructor(
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IPathService private readonly pathService: IPathService,
		@ITextEditorService private readonly textEditorService: ITextEditorService,
		@IUntitledTextEditorService private readonly untitledTextEditorService: IUntitledTextEditorService
	) {
		super();

		this._register(workingCopyEditorService.registerHandler(this));
	}

	handles(workingCopy: IWorkingCopyIdentifier): boolean {
		return workingCopy.resource.scheme === Schemas.untitled && workingCopy.typeId === NO_TYPE_ID;
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handles(workingCopy)) {
			return false;
		}

		return editor instanceof UntitledTextEditorInput && isEqual(workingCopy.resource, editor.resource);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		let editorInputResource: URI;

		// If the untitled has an associated resource,
		// ensure to restore the local resource it had
		if (this.untitledTextEditorService.isUntitledWithAssociatedResource(workingCopy.resource)) {
			editorInputResource = toLocalResource(workingCopy.resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme);
		} else {
			editorInputResource = workingCopy.resource;
		}

		return this.textEditorService.createTextEditor({ resource: editorInputResource, forceUntitled: true });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/untitled/common/untitledTextEditorInput.ts]---
Location: vscode-main/src/vs/workbench/services/untitled/common/untitledTextEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { DEFAULT_EDITOR_ASSOCIATION, findViewStateForEditor, isUntitledResourceEditorInput, IUntitledTextResourceEditorInput, IUntypedEditorInput, Verbosity } from '../../../common/editor.js';
import { EditorInput, IUntypedEditorOptions } from '../../../common/editor/editorInput.js';
import { AbstractTextResourceEditorInput } from '../../../common/editor/textResourceEditorInput.js';
import { IUntitledTextEditorModel } from './untitledTextEditorModel.js';
import { EncodingMode, IEncodingSupport, ILanguageSupport, ITextFileService } from '../../textfile/common/textfiles.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { isEqual, toLocalResource } from '../../../../base/common/resources.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IPathService } from '../../path/common/pathService.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { DisposableStore, dispose, IReference } from '../../../../base/common/lifecycle.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ICustomEditorLabelService } from '../../editor/common/customEditorLabelService.js';

/**
 * An editor input to be used for untitled text buffers.
 */
export class UntitledTextEditorInput extends AbstractTextResourceEditorInput implements IEncodingSupport, ILanguageSupport {

	static readonly ID: string = 'workbench.editors.untitledEditorInput';

	override get typeId(): string {
		return UntitledTextEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return DEFAULT_EDITOR_ASSOCIATION.id;
	}

	private modelResolve: Promise<void> | undefined = undefined;
	private readonly modelDisposables = this._register(new DisposableStore());
	private cachedUntitledTextEditorModelReference: IReference<IUntitledTextEditorModel> | undefined = undefined;

	constructor(
		protected model: IUntitledTextEditorModel,
		@ITextFileService textFileService: ITextFileService,
		@ILabelService labelService: ILabelService,
		@IEditorService editorService: IEditorService,
		@IFileService fileService: IFileService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IPathService private readonly pathService: IPathService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
	) {
		super(model.resource, undefined, editorService, textFileService, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);

		this.registerModelListeners(model);

		this._register(this.textFileService.untitled.onDidCreate(model => this.onDidCreateUntitledModel(model)));
	}

	private registerModelListeners(model: IUntitledTextEditorModel): void {
		this.modelDisposables.clear();

		// re-emit some events from the model
		this.modelDisposables.add(model.onDidChangeDirty(() => this._onDidChangeDirty.fire()));
		this.modelDisposables.add(model.onDidChangeName(() => this._onDidChangeLabel.fire()));

		// a reverted untitled text editor model renders this input disposed
		this.modelDisposables.add(model.onDidRevert(() => this.dispose()));
	}

	private onDidCreateUntitledModel(model: IUntitledTextEditorModel): void {
		if (isEqual(model.resource, this.model.resource) && model !== this.model) {

			// Ensure that we keep our model up to date with
			// the actual model from the service so that we
			// never get out of sync with the truth.

			this.model = model;
			this.registerModelListeners(model);
		}
	}

	override getName(): string {
		return this.model.name;
	}

	override getDescription(verbosity = Verbosity.MEDIUM): string | undefined {

		// Without associated path: only use if name and description differ
		if (!this.model.hasAssociatedFilePath) {
			const descriptionCandidate = this.resource.path;
			if (descriptionCandidate !== this.getName()) {
				return descriptionCandidate;
			}

			return undefined;
		}

		// With associated path: delegate to parent
		return super.getDescription(verbosity);
	}

	override getTitle(verbosity: Verbosity): string {

		// Without associated path: check if name and description differ to decide
		// if description should appear besides the name to distinguish better
		if (!this.model.hasAssociatedFilePath) {
			const name = this.getName();
			const description = this.getDescription();
			if (description && description !== name) {
				return `${name} • ${description}`;
			}

			return name;
		}

		// With associated path: delegate to parent
		return super.getTitle(verbosity);
	}

	override isDirty(): boolean {
		return this.model.isDirty();
	}

	getEncoding(): string | undefined {
		return this.model.getEncoding();
	}

	setEncoding(encoding: string, mode: EncodingMode /* ignored, we only have Encode */): Promise<void> {
		return this.model.setEncoding(encoding);
	}

	get hasLanguageSetExplicitly() { return this.model.hasLanguageSetExplicitly; }

	get hasAssociatedFilePath() { return this.model.hasAssociatedFilePath; }

	setLanguageId(languageId: string, source?: string): void {
		this.model.setLanguageId(languageId, source);
	}

	getLanguageId(): string | undefined {
		return this.model.getLanguageId();
	}

	override async resolve(): Promise<IUntitledTextEditorModel> {
		if (!this.modelResolve) {
			this.modelResolve = (async () => {

				// Acquire a model reference
				this.cachedUntitledTextEditorModelReference = await this.textModelService.createModelReference(this.resource) as IReference<IUntitledTextEditorModel>;
			})();
		}

		await this.modelResolve;

		// It is possible that this input was disposed before the model
		// finished resolving. As such, we need to make sure to dispose
		// the model reference to not leak it.
		if (this.isDisposed()) {
			this.disposeModelReference();
		}

		return this.model;
	}

	override toUntyped(options?: IUntypedEditorOptions): IUntitledTextResourceEditorInput {
		const untypedInput: IUntitledTextResourceEditorInput & { resource: URI | undefined; options: ITextEditorOptions } = {
			resource: this.model.hasAssociatedFilePath ? toLocalResource(this.model.resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme) : this.resource,
			forceUntitled: true,
			options: {
				override: this.editorId
			}
		};

		if (typeof options?.preserveViewState === 'number') {
			untypedInput.encoding = this.getEncoding();
			untypedInput.languageId = this.getLanguageId();
			untypedInput.contents = this.model.isModified() ? this.model.textEditorModel?.getValue() : undefined;
			untypedInput.options.viewState = findViewStateForEditor(this, options.preserveViewState, this.editorService);

			if (typeof untypedInput.contents === 'string' && !this.model.hasAssociatedFilePath && !options.preserveResource) {
				// Given how generic untitled resources in the system are, we
				// need to be careful not to set our resource into the untyped
				// editor if we want to transport contents too, because of
				// issue https://github.com/microsoft/vscode/issues/140898
				// The workaround is to simply remove the resource association
				// if we have contents and no associated resource.
				// In that case we can ensure that a new untitled resource is
				// being created and the contents can be restored properly.
				untypedInput.resource = undefined;
			}
		}

		return untypedInput;
	}

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (this === otherInput) {
			return true;
		}

		if (otherInput instanceof UntitledTextEditorInput) {
			return isEqual(otherInput.resource, this.resource);
		}

		if (isUntitledResourceEditorInput(otherInput)) {
			return super.matches(otherInput);
		}

		return false;
	}

	override dispose(): void {

		// Model
		this.modelResolve = undefined;

		// Model reference
		this.disposeModelReference();

		super.dispose();
	}

	private disposeModelReference(): void {
		dispose(this.cachedUntitledTextEditorModelReference);
		this.cachedUntitledTextEditorModelReference = undefined;
	}
}
```

--------------------------------------------------------------------------------

````

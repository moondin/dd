---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 47
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 47 of 552)

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

---[FILE: extensions/html-language-features/server/src/modes/embeddedSupport.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/embeddedSupport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument, Position, LanguageService, TokenType, Range } from './languageModes';

export interface LanguageRange extends Range {
	languageId: string | undefined;
	attributeValue?: boolean;
}

export interface HTMLDocumentRegions {
	getEmbeddedDocument(languageId: string, ignoreAttributeValues?: boolean): TextDocument;
	getLanguageRanges(range: Range): LanguageRange[];
	getLanguageAtPosition(position: Position): string | undefined;
	getLanguagesInDocument(): string[];
	getImportedScripts(): string[];
}

export const CSS_STYLE_RULE = '__';

interface EmbeddedRegion { languageId: string | undefined; start: number; end: number; attributeValue?: boolean }


export function getDocumentRegions(languageService: LanguageService, document: TextDocument): HTMLDocumentRegions {
	const regions: EmbeddedRegion[] = [];
	const scanner = languageService.createScanner(document.getText());
	let lastTagName: string = '';
	let lastAttributeName: string | null = null;
	let languageIdFromType: string | undefined = undefined;
	const importedScripts: string[] = [];

	let token = scanner.scan();
	while (token !== TokenType.EOS) {
		switch (token) {
			case TokenType.StartTag:
				lastTagName = scanner.getTokenText();
				lastAttributeName = null;
				languageIdFromType = 'javascript';
				break;
			case TokenType.Styles:
				regions.push({ languageId: 'css', start: scanner.getTokenOffset(), end: scanner.getTokenEnd() });
				break;
			case TokenType.Script:
				regions.push({ languageId: languageIdFromType, start: scanner.getTokenOffset(), end: scanner.getTokenEnd() });
				break;
			case TokenType.AttributeName:
				lastAttributeName = scanner.getTokenText();
				break;
			case TokenType.AttributeValue:
				if (lastAttributeName === 'src' && lastTagName.toLowerCase() === 'script') {
					let value = scanner.getTokenText();
					if (value[0] === '\'' || value[0] === '"') {
						value = value.substr(1, value.length - 1);
					}
					importedScripts.push(value);
				} else if (lastAttributeName === 'type' && lastTagName.toLowerCase() === 'script') {
					const token = scanner.getTokenText();
					if (/["'](module|(text|application)\/(java|ecma)script|text\/babel)["']/.test(token) || token === 'module') {
						languageIdFromType = 'javascript';
					} else if (/["']text\/typescript["']/.test(token)) {
						languageIdFromType = 'typescript';
					} else {
						languageIdFromType = undefined;
					}
				} else {
					const attributeLanguageId = getAttributeLanguage(lastAttributeName!);
					if (attributeLanguageId) {
						let start = scanner.getTokenOffset();
						let end = scanner.getTokenEnd();
						const firstChar = document.getText()[start];
						if (firstChar === '\'' || firstChar === '"') {
							start++;
							end--;
						}
						regions.push({ languageId: attributeLanguageId, start, end, attributeValue: true });
					}
				}
				lastAttributeName = null;
				break;
		}
		token = scanner.scan();
	}
	return {
		getLanguageRanges: (range: Range) => getLanguageRanges(document, regions, range),
		getEmbeddedDocument: (languageId: string, ignoreAttributeValues: boolean) => getEmbeddedDocument(document, regions, languageId, ignoreAttributeValues),
		getLanguageAtPosition: (position: Position) => getLanguageAtPosition(document, regions, position),
		getLanguagesInDocument: () => getLanguagesInDocument(document, regions),
		getImportedScripts: () => importedScripts
	};
}


function getLanguageRanges(document: TextDocument, regions: EmbeddedRegion[], range: Range): LanguageRange[] {
	const result: LanguageRange[] = [];
	let currentPos = range ? range.start : Position.create(0, 0);
	let currentOffset = range ? document.offsetAt(range.start) : 0;
	const endOffset = range ? document.offsetAt(range.end) : document.getText().length;
	for (const region of regions) {
		if (region.end > currentOffset && region.start < endOffset) {
			const start = Math.max(region.start, currentOffset);
			const startPos = document.positionAt(start);
			if (currentOffset < region.start) {
				result.push({
					start: currentPos,
					end: startPos,
					languageId: 'html'
				});
			}
			const end = Math.min(region.end, endOffset);
			const endPos = document.positionAt(end);
			if (end > region.start) {
				result.push({
					start: startPos,
					end: endPos,
					languageId: region.languageId,
					attributeValue: region.attributeValue
				});
			}
			currentOffset = end;
			currentPos = endPos;
		}
	}
	if (currentOffset < endOffset) {
		const endPos = range ? range.end : document.positionAt(endOffset);
		result.push({
			start: currentPos,
			end: endPos,
			languageId: 'html'
		});
	}
	return result;
}

function getLanguagesInDocument(_document: TextDocument, regions: EmbeddedRegion[]): string[] {
	const result = [];
	for (const region of regions) {
		if (region.languageId && result.indexOf(region.languageId) === -1) {
			result.push(region.languageId);
			if (result.length === 3) {
				return result;
			}
		}
	}
	result.push('html');
	return result;
}

function getLanguageAtPosition(document: TextDocument, regions: EmbeddedRegion[], position: Position): string | undefined {
	const offset = document.offsetAt(position);
	for (const region of regions) {
		if (region.start <= offset) {
			if (offset <= region.end) {
				return region.languageId;
			}
		} else {
			break;
		}
	}
	return 'html';
}

function getEmbeddedDocument(document: TextDocument, contents: EmbeddedRegion[], languageId: string, ignoreAttributeValues: boolean): TextDocument {
	let currentPos = 0;
	const oldContent = document.getText();
	let result = '';
	let lastSuffix = '';
	for (const c of contents) {
		if (c.languageId === languageId && (!ignoreAttributeValues || !c.attributeValue)) {
			result = substituteWithWhitespace(result, currentPos, c.start, oldContent, lastSuffix, getPrefix(c));
			result += updateContent(c, oldContent.substring(c.start, c.end));
			currentPos = c.end;
			lastSuffix = getSuffix(c);
		}
	}
	result = substituteWithWhitespace(result, currentPos, oldContent.length, oldContent, lastSuffix, '');
	return TextDocument.create(document.uri, languageId, document.version, result);
}

function getPrefix(c: EmbeddedRegion) {
	if (c.attributeValue) {
		switch (c.languageId) {
			case 'css': return CSS_STYLE_RULE + '{';
		}
	}
	return '';
}
function getSuffix(c: EmbeddedRegion) {
	if (c.attributeValue) {
		switch (c.languageId) {
			case 'css': return '}';
			case 'javascript': return ';';
		}
	}
	return '';
}
function updateContent(c: EmbeddedRegion, content: string): string {
	if (!c.attributeValue && c.languageId === 'javascript') {
		return content.replace(`<!--`, `/* `).replace(`-->`, ` */`);
	}
	if (c.languageId === 'css') {
		const quoteEscape = /(&quot;|&#34;)/g;
		return content.replace(quoteEscape, (match, _, offset) => {
			const spaces = ' '.repeat(match.length - 1);
			const afterChar = content[offset + match.length];
			if (!afterChar || afterChar.includes(' ')) {
				return `${spaces}"`;
			}
			return `"${spaces}`;
		});
	}
	return content;
}

function substituteWithWhitespace(result: string, start: number, end: number, oldContent: string, before: string, after: string) {
	result += before;
	let accumulatedWS = -before.length; // start with a negative value to account for the before string
	for (let i = start; i < end; i++) {
		const ch = oldContent[i];
		if (ch === '\n' || ch === '\r') {
			// only write new lines, skip the whitespace
			accumulatedWS = 0;
			result += ch;
		} else {
			accumulatedWS++;
		}
	}
	result = append(result, ' ', accumulatedWS - after.length);
	result += after;
	return result;
}

function append(result: string, str: string, n: number): string {
	while (n > 0) {
		if (n & 1) {
			result += str;
		}
		n >>= 1;
		str += str;
	}
	return result;
}

function getAttributeLanguage(attributeName: string): string | null {
	const match = attributeName.match(/^(style)$|^(on\w+)$/i);
	if (!match) {
		return null;
	}
	return match[1] ? 'css' : 'javascript';
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/formatting.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/formatting.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageModes, Settings, LanguageModeRange, TextDocument, Range, TextEdit, FormattingOptions, Position } from './languageModes';
import { pushAll } from '../utils/arrays';
import { isEOL } from '../utils/strings';

export async function format(languageModes: LanguageModes, document: TextDocument, formatRange: Range, formattingOptions: FormattingOptions, settings: Settings | undefined, enabledModes: { [mode: string]: boolean }) {
	const result: TextEdit[] = [];

	const endPos = formatRange.end;
	let endOffset = document.offsetAt(endPos);
	const content = document.getText();
	if (endPos.character === 0 && endPos.line > 0 && endOffset !== content.length) {
		// if selection ends after a new line, exclude that new line
		const prevLineStart = document.offsetAt(Position.create(endPos.line - 1, 0));
		while (isEOL(content, endOffset - 1) && endOffset > prevLineStart) {
			endOffset--;
		}
		formatRange = Range.create(formatRange.start, document.positionAt(endOffset));
	}


	// run the html formatter on the full range and pass the result content to the embedded formatters.
	// from the final content create a single edit
	// advantages of this approach are
	//  - correct indents in the html document
	//  - correct initial indent for embedded formatters
	//  - no worrying of overlapping edits

	// make sure we start in html
	const allRanges = languageModes.getModesInRange(document, formatRange);
	let i = 0;
	let startPos = formatRange.start;
	const isHTML = (range: LanguageModeRange) => range.mode && range.mode.getId() === 'html';

	while (i < allRanges.length && !isHTML(allRanges[i])) {
		const range = allRanges[i];
		if (!range.attributeValue && range.mode && range.mode.format) {
			const edits = await range.mode.format(document, Range.create(startPos, range.end), formattingOptions, settings);
			pushAll(result, edits);
		}
		startPos = range.end;
		i++;
	}
	if (i === allRanges.length) {
		return result;
	}
	// modify the range
	formatRange = Range.create(startPos, formatRange.end);

	// perform a html format and apply changes to a new document
	const htmlMode = languageModes.getMode('html')!;
	const htmlEdits = await htmlMode.format!(document, formatRange, formattingOptions, settings);
	let htmlFormattedContent = TextDocument.applyEdits(document, htmlEdits);
	if (formattingOptions.insertFinalNewline && endOffset === content.length && !htmlFormattedContent.endsWith('\n')) {
		htmlFormattedContent = htmlFormattedContent + '\n';
		htmlEdits.push(TextEdit.insert(endPos, '\n'));
	}
	const newDocument = TextDocument.create(document.uri + '.tmp', document.languageId, document.version, htmlFormattedContent);
	try {
		// run embedded formatters on html formatted content: - formatters see correct initial indent
		const afterFormatRangeLength = document.getText().length - document.offsetAt(formatRange.end); // length of unchanged content after replace range
		const newFormatRange = Range.create(formatRange.start, newDocument.positionAt(htmlFormattedContent.length - afterFormatRangeLength));
		const embeddedRanges = languageModes.getModesInRange(newDocument, newFormatRange);

		const embeddedEdits: TextEdit[] = [];

		for (const r of embeddedRanges) {
			const mode = r.mode;
			if (mode && mode.format && enabledModes[mode.getId()] && !r.attributeValue) {
				const edits = await mode.format(newDocument, r, formattingOptions, settings);
				for (const edit of edits) {
					embeddedEdits.push(edit);
				}
			}
		}

		if (embeddedEdits.length === 0) {
			pushAll(result, htmlEdits);
			return result;
		}

		// apply all embedded format edits and create a single edit for all changes
		const resultContent = TextDocument.applyEdits(newDocument, embeddedEdits);
		const resultReplaceText = resultContent.substring(document.offsetAt(formatRange.start), resultContent.length - afterFormatRangeLength);

		result.push(TextEdit.replace(formatRange, resultReplaceText));
		return result;
	} finally {
		languageModes.onDocumentRemoved(newDocument);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/htmlFolding.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/htmlFolding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument, FoldingRange, Position, Range, LanguageModes, LanguageMode } from './languageModes';
import { CancellationToken } from 'vscode-languageserver';

export async function getFoldingRanges(languageModes: LanguageModes, document: TextDocument, maxRanges: number | undefined, _cancellationToken: CancellationToken | null): Promise<FoldingRange[]> {
	const htmlMode = languageModes.getMode('html');
	const range = Range.create(Position.create(0, 0), Position.create(document.lineCount, 0));
	let result: FoldingRange[] = [];
	if (htmlMode && htmlMode.getFoldingRanges) {
		result.push(... await htmlMode.getFoldingRanges(document));
	}

	// cache folding ranges per mode
	const rangesPerMode: { [mode: string]: FoldingRange[] } = Object.create(null);
	const getRangesForMode = async (mode: LanguageMode) => {
		if (mode.getFoldingRanges) {
			let ranges = rangesPerMode[mode.getId()];
			if (!Array.isArray(ranges)) {
				ranges = await mode.getFoldingRanges(document) || [];
				rangesPerMode[mode.getId()] = ranges;
			}
			return ranges;
		}
		return [];
	};

	const modeRanges = languageModes.getModesInRange(document, range);
	for (const modeRange of modeRanges) {
		const mode = modeRange.mode;
		if (mode && mode !== htmlMode && !modeRange.attributeValue) {
			const ranges = await getRangesForMode(mode);
			result.push(...ranges.filter(r => r.startLine >= modeRange.start.line && r.endLine < modeRange.end.line));
		}
	}
	if (maxRanges && result.length > maxRanges) {
		result = limitRanges(result, maxRanges);
	}
	return result;
}

function limitRanges(ranges: FoldingRange[], maxRanges: number) {
	ranges = ranges.sort((r1, r2) => {
		let diff = r1.startLine - r2.startLine;
		if (diff === 0) {
			diff = r1.endLine - r2.endLine;
		}
		return diff;
	});

	// compute each range's nesting level in 'nestingLevels'.
	// count the number of ranges for each level in 'nestingLevelCounts'
	let top: FoldingRange | undefined = undefined;
	const previous: FoldingRange[] = [];
	const nestingLevels: number[] = [];
	const nestingLevelCounts: number[] = [];

	const setNestingLevel = (index: number, level: number) => {
		nestingLevels[index] = level;
		if (level < 30) {
			nestingLevelCounts[level] = (nestingLevelCounts[level] || 0) + 1;
		}
	};

	// compute nesting levels and sanitize
	for (let i = 0; i < ranges.length; i++) {
		const entry = ranges[i];
		if (!top) {
			top = entry;
			setNestingLevel(i, 0);
		} else {
			if (entry.startLine > top.startLine) {
				if (entry.endLine <= top.endLine) {
					previous.push(top);
					top = entry;
					setNestingLevel(i, previous.length);
				} else if (entry.startLine > top.endLine) {
					do {
						top = previous.pop();
					} while (top && entry.startLine > top.endLine);
					if (top) {
						previous.push(top);
					}
					top = entry;
					setNestingLevel(i, previous.length);
				}
			}
		}
	}
	let entries = 0;
	let maxLevel = 0;
	for (let i = 0; i < nestingLevelCounts.length; i++) {
		const n = nestingLevelCounts[i];
		if (n) {
			if (n + entries > maxRanges) {
				maxLevel = i;
				break;
			}
			entries += n;
		}
	}
	const result = [];
	for (let i = 0; i < ranges.length; i++) {
		const level = nestingLevels[i];
		if (typeof level === 'number') {
			if (level < maxLevel || (level === maxLevel && entries++ < maxRanges)) {
				result.push(ranges[i]);
			}
		}
	}
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/htmlMode.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/htmlMode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getLanguageModelCache } from '../languageModelCache';
import {
	LanguageService as HTMLLanguageService, HTMLDocument, DocumentContext, FormattingOptions,
	HTMLFormatConfiguration, SelectionRange,
	TextDocument, Position, Range, FoldingRange,
	LanguageMode, Workspace, Settings
} from './languageModes';

export function getHTMLMode(htmlLanguageService: HTMLLanguageService, workspace: Workspace): LanguageMode {
	const htmlDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => htmlLanguageService.parseHTMLDocument(document));
	return {
		getId() {
			return 'html';
		},
		async getSelectionRange(document: TextDocument, position: Position): Promise<SelectionRange> {
			return htmlLanguageService.getSelectionRanges(document, [position])[0];
		},
		doComplete(document: TextDocument, position: Position, documentContext: DocumentContext, settings = workspace.settings) {
			const htmlSettings = settings?.html;
			const options = merge(htmlSettings?.suggest, {});
			options.hideAutoCompleteProposals = htmlSettings?.autoClosingTags === true;
			options.attributeDefaultValue = htmlSettings?.completion?.attributeDefaultValue ?? 'doublequotes';

			const htmlDocument = htmlDocuments.get(document);
			const completionList = htmlLanguageService.doComplete2(document, position, htmlDocument, documentContext, options);
			return completionList;
		},
		async doHover(document: TextDocument, position: Position, settings?: Settings) {
			return htmlLanguageService.doHover(document, position, htmlDocuments.get(document), settings?.html?.hover);
		},
		async findDocumentHighlight(document: TextDocument, position: Position) {
			return htmlLanguageService.findDocumentHighlights(document, position, htmlDocuments.get(document));
		},
		async findDocumentLinks(document: TextDocument, documentContext: DocumentContext) {
			return htmlLanguageService.findDocumentLinks(document, documentContext);
		},
		async findDocumentSymbols(document: TextDocument) {
			return htmlLanguageService.findDocumentSymbols(document, htmlDocuments.get(document));
		},
		async format(document: TextDocument, range: Range, formatParams: FormattingOptions, settings = workspace.settings) {
			const formatSettings: HTMLFormatConfiguration = merge(settings?.html?.format, {});
			if (formatSettings.contentUnformatted) {
				formatSettings.contentUnformatted = formatSettings.contentUnformatted + ',script';
			} else {
				formatSettings.contentUnformatted = 'script';
			}
			merge(formatParams, formatSettings);
			return htmlLanguageService.format(document, range, formatSettings);
		},
		async getFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
			return htmlLanguageService.getFoldingRanges(document);
		},
		async doAutoInsert(document: TextDocument, position: Position, kind: 'autoQuote' | 'autoClose', settings = workspace.settings) {
			const offset = document.offsetAt(position);
			const text = document.getText();
			if (kind === 'autoQuote') {
				if (offset > 0 && text.charAt(offset - 1) === '=') {
					const htmlSettings = settings?.html;
					const options = merge(htmlSettings?.suggest, {});
					options.attributeDefaultValue = htmlSettings?.completion?.attributeDefaultValue ?? 'doublequotes';

					return htmlLanguageService.doQuoteComplete(document, position, htmlDocuments.get(document), options);
				}
			} else if (kind === 'autoClose') {
				if (offset > 0 && text.charAt(offset - 1).match(/[>\/]/g)) {
					return htmlLanguageService.doTagComplete(document, position, htmlDocuments.get(document));
				}
			}
			return null;
		},
		async doRename(document: TextDocument, position: Position, newName: string) {
			const htmlDocument = htmlDocuments.get(document);
			return htmlLanguageService.doRename(document, position, newName, htmlDocument);
		},
		async onDocumentRemoved(document: TextDocument) {
			htmlDocuments.onDocumentRemoved(document);
		},
		async findMatchingTagPosition(document: TextDocument, position: Position) {
			const htmlDocument = htmlDocuments.get(document);
			return htmlLanguageService.findMatchingTagPosition(document, position, htmlDocument);
		},
		async doLinkedEditing(document: TextDocument, position: Position) {
			const htmlDocument = htmlDocuments.get(document);
			return htmlLanguageService.findLinkedEditingRanges(document, position, htmlDocument);
		},
		dispose() {
			htmlDocuments.dispose();
		}
	};
}

function merge(src: any, dst: any): any {
	if (src) {
		for (const key in src) {
			if (src.hasOwnProperty(key)) {
				dst[key] = src[key];
			}
		}
	}
	return dst;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/javascriptLibs.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/javascriptLibs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { join, basename, dirname } from 'path';
import { readFileSync } from 'fs';

const contents: { [name: string]: string } = {};

const serverFolder = basename(__dirname) === 'dist' ? dirname(__dirname) : dirname(dirname(__dirname));
const TYPESCRIPT_LIB_SOURCE = join(serverFolder, '../../node_modules/typescript/lib');
const JQUERY_PATH = join(serverFolder, 'lib/jquery.d.ts');

export function loadLibrary(name: string) {
	let content = contents[name];
	if (typeof content !== 'string') {
		let libPath;
		if (name === 'jquery') {
			libPath = JQUERY_PATH;
		} else {
			libPath = join(TYPESCRIPT_LIB_SOURCE, name); // from source
		}
		try {
			content = readFileSync(libPath).toString();
		} catch (e) {
			console.log(`Unable to load library ${name} at ${libPath}`);
			content = '';
		}
		contents[name] = content;
	}
	return content;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/javascriptMode.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/javascriptMode.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageModelCache, getLanguageModelCache } from '../languageModelCache';
import {
	SymbolInformation, SymbolKind, CompletionItem, Location, SignatureHelp, SignatureInformation, ParameterInformation,
	Definition, TextEdit, TextDocument, Diagnostic, DiagnosticSeverity, Range, CompletionItemKind, Hover,
	DocumentHighlight, DocumentHighlightKind, CompletionList, Position, FormattingOptions, FoldingRange, FoldingRangeKind, SelectionRange,
	LanguageMode, Settings, SemanticTokenData, Workspace, DocumentContext, CompletionItemData, isCompletionItemData, FILE_PROTOCOL, DocumentUri
} from './languageModes';
import { getWordAtText, isWhitespaceOnly, repeat } from '../utils/strings';
import { HTMLDocumentRegions } from './embeddedSupport';

import * as ts from 'typescript';
import { getSemanticTokens, getSemanticTokenLegend } from './javascriptSemanticTokens';

const JS_WORD_REGEX = /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;

function getLanguageServiceHost(scriptKind: ts.ScriptKind) {
	const compilerOptions: ts.CompilerOptions = { allowNonTsExtensions: true, allowJs: true, lib: ['lib.es2020.full.d.ts'], target: ts.ScriptTarget.Latest, moduleResolution: ts.ModuleResolutionKind.Classic, experimentalDecorators: false };

	let currentTextDocument = TextDocument.create('init', 'javascript', 1, '');
	const jsLanguageService = import(/* webpackChunkName: "javascriptLibs" */ './javascriptLibs.js').then(libs => {
		const host: ts.LanguageServiceHost = {
			getCompilationSettings: () => compilerOptions,
			getScriptFileNames: () => [currentTextDocument.uri, 'jquery'],
			getScriptKind: (fileName) => {
				if (fileName === currentTextDocument.uri) {
					return scriptKind;
				}
				return fileName.substr(fileName.length - 2) === 'ts' ? ts.ScriptKind.TS : ts.ScriptKind.JS;
			},
			getScriptVersion: (fileName: string) => {
				if (fileName === currentTextDocument.uri) {
					return String(currentTextDocument.version);
				}
				return '1'; // default lib an jquery.d.ts are static
			},
			getScriptSnapshot: (fileName: string) => {
				let text = '';
				if (fileName === currentTextDocument.uri) {
					text = currentTextDocument.getText();
				} else {
					text = libs.loadLibrary(fileName);
				}
				return {
					getText: (start, end) => text.substring(start, end),
					getLength: () => text.length,
					getChangeRange: () => undefined
				};
			},
			getCurrentDirectory: () => '',
			getDefaultLibFileName: (_options: ts.CompilerOptions) => 'es2020.full',
			readFile: (path: string, _encoding?: string | undefined): string | undefined => {
				if (path === currentTextDocument.uri) {
					return currentTextDocument.getText();
				} else {
					return libs.loadLibrary(path);
				}
			},
			fileExists: (path: string): boolean => {
				if (path === currentTextDocument.uri) {
					return true;
				} else {
					return !!libs.loadLibrary(path);
				}
			},
			directoryExists: (path: string): boolean => {
				// typescript tries to first find libraries in node_modules/@types and node_modules/@typescript
				// there's no node_modules in our setup
				if (path.startsWith('node_modules')) {
					return false;
				}
				return true;

			}
		};
		return {
			service: ts.createLanguageService(host),
			loadLibrary: libs.loadLibrary,
		};
	});
	return {
		async getLanguageService(jsDocument: TextDocument): Promise<ts.LanguageService> {
			currentTextDocument = jsDocument;
			return (await jsLanguageService).service;
		},
		getCompilationSettings() {
			return compilerOptions;
		},
		async loadLibrary(fileName: string) {
			return (await jsLanguageService).loadLibrary(fileName);
		},
		dispose() {
			jsLanguageService.then(s => s.service.dispose());
		}
	};
}

const ignoredErrors = [
	1108,  /* A_return_statement_can_only_be_used_within_a_function_body_1108 */
	2792, /* Cannot_find_module_0_Did_you_mean_to_set_the_moduleResolution_option_to_node_or_to_add_aliases_to_the_paths_option */
];

export function getJavaScriptMode(documentRegions: LanguageModelCache<HTMLDocumentRegions>, languageId: 'javascript' | 'typescript', workspace: Workspace): LanguageMode {
	const jsDocuments = getLanguageModelCache<TextDocument>(10, 60, document => documentRegions.get(document).getEmbeddedDocument(languageId));

	const host = getLanguageServiceHost(languageId === 'javascript' ? ts.ScriptKind.JS : ts.ScriptKind.TS);
	const globalSettings: Settings = {};

	const libParentUri = `${FILE_PROTOCOL}://${languageId}/libs/`;

	function updateHostSettings(settings: Settings) {
		const hostSettings = host.getCompilationSettings();
		hostSettings.experimentalDecorators = settings?.['js/ts']?.implicitProjectConfig?.experimentalDecorators;
		hostSettings.strictNullChecks = settings?.['js/ts']?.implicitProjectConfig.strictNullChecks;
	}

	return {
		getId() {
			return languageId;
		},
		async doValidation(document: TextDocument, settings = workspace.settings): Promise<Diagnostic[]> {
			updateHostSettings(settings);

			const jsDocument = jsDocuments.get(document);
			const languageService = await host.getLanguageService(jsDocument);
			const syntaxDiagnostics: ts.Diagnostic[] = languageService.getSyntacticDiagnostics(jsDocument.uri);
			const semanticDiagnostics = languageService.getSemanticDiagnostics(jsDocument.uri);
			return syntaxDiagnostics.concat(semanticDiagnostics).filter(d => !ignoredErrors.includes(d.code)).map((diag: ts.Diagnostic): Diagnostic => {
				return {
					range: convertRange(jsDocument, diag),
					severity: DiagnosticSeverity.Error,
					source: languageId,
					message: ts.flattenDiagnosticMessageText(diag.messageText, '\n')
				};
			});
		},
		async doComplete(document: TextDocument, position: Position, _documentContext: DocumentContext): Promise<CompletionList> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const offset = jsDocument.offsetAt(position);
			const completions = jsLanguageService.getCompletionsAtPosition(jsDocument.uri, offset, { includeExternalModuleExports: false, includeInsertTextCompletions: false });
			if (!completions) {
				return { isIncomplete: false, items: [] };
			}
			const replaceRange = convertRange(jsDocument, getWordAtText(jsDocument.getText(), offset, JS_WORD_REGEX));
			return {
				isIncomplete: false,
				items: completions.entries.map(entry => {
					const data: CompletionItemData = { // data used for resolving item details (see 'doResolve')
						languageId,
						uri: document.uri,
						offset: offset
					};
					return {
						uri: document.uri,
						position: position,
						label: entry.name,
						sortText: entry.sortText,
						kind: convertKind(entry.kind),
						textEdit: TextEdit.replace(replaceRange, entry.name),
						data
					};
				})
			};
		},
		async doResolve(document: TextDocument, item: CompletionItem): Promise<CompletionItem> {
			if (isCompletionItemData(item.data)) {
				const jsDocument = jsDocuments.get(document);
				const jsLanguageService = await host.getLanguageService(jsDocument);
				const details = jsLanguageService.getCompletionEntryDetails(jsDocument.uri, item.data.offset, item.label, undefined, undefined, undefined, undefined);
				if (details) {
					item.detail = ts.displayPartsToString(details.displayParts);
					item.documentation = ts.displayPartsToString(details.documentation);
					delete item.data;
				}
			}
			return item;
		},
		async doHover(document: TextDocument, position: Position): Promise<Hover | null> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const info = jsLanguageService.getQuickInfoAtPosition(jsDocument.uri, jsDocument.offsetAt(position));
			if (info) {
				const contents = ts.displayPartsToString(info.displayParts);
				return {
					range: convertRange(jsDocument, info.textSpan),
					contents: ['```typescript', contents, '```'].join('\n')
				};
			}
			return null;
		},
		async doSignatureHelp(document: TextDocument, position: Position): Promise<SignatureHelp | null> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const signHelp = jsLanguageService.getSignatureHelpItems(jsDocument.uri, jsDocument.offsetAt(position), undefined);
			if (signHelp) {
				const ret: SignatureHelp = {
					activeSignature: signHelp.selectedItemIndex,
					activeParameter: signHelp.argumentIndex,
					signatures: []
				};
				signHelp.items.forEach(item => {

					const signature: SignatureInformation = {
						label: '',
						documentation: undefined,
						parameters: []
					};

					signature.label += ts.displayPartsToString(item.prefixDisplayParts);
					item.parameters.forEach((p, i, a) => {
						const label = ts.displayPartsToString(p.displayParts);
						const parameter: ParameterInformation = {
							label: label,
							documentation: ts.displayPartsToString(p.documentation)
						};
						signature.label += label;
						signature.parameters!.push(parameter);
						if (i < a.length - 1) {
							signature.label += ts.displayPartsToString(item.separatorDisplayParts);
						}
					});
					signature.label += ts.displayPartsToString(item.suffixDisplayParts);
					ret.signatures.push(signature);
				});
				return ret;
			}
			return null;
		},
		async doRename(document: TextDocument, position: Position, newName: string) {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const jsDocumentPosition = jsDocument.offsetAt(position);
			const { canRename } = jsLanguageService.getRenameInfo(jsDocument.uri, jsDocumentPosition);
			if (!canRename) {
				return null;
			}
			const renameInfos = jsLanguageService.findRenameLocations(jsDocument.uri, jsDocumentPosition, false, false);

			const edits: TextEdit[] = [];
			renameInfos?.map(renameInfo => {
				edits.push({
					range: convertRange(jsDocument, renameInfo.textSpan),
					newText: newName,
				});
			});

			return {
				changes: { [document.uri]: edits },
			};
		},
		async findDocumentHighlight(document: TextDocument, position: Position): Promise<DocumentHighlight[]> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const highlights = jsLanguageService.getDocumentHighlights(jsDocument.uri, jsDocument.offsetAt(position), [jsDocument.uri]);
			const out: DocumentHighlight[] = [];
			for (const entry of highlights || []) {
				for (const highlight of entry.highlightSpans) {
					out.push({
						range: convertRange(jsDocument, highlight.textSpan),
						kind: highlight.kind === 'writtenReference' ? DocumentHighlightKind.Write : DocumentHighlightKind.Text
					});
				}
			}
			return out;
		},
		async findDocumentSymbols(document: TextDocument): Promise<SymbolInformation[]> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const items = jsLanguageService.getNavigationBarItems(jsDocument.uri);
			if (items) {
				const result: SymbolInformation[] = [];
				const existing = Object.create(null);
				const collectSymbols = (item: ts.NavigationBarItem, containerLabel?: string) => {
					const sig = item.text + item.kind + item.spans[0].start;
					if (item.kind !== 'script' && !existing[sig]) {
						const symbol: SymbolInformation = {
							name: item.text,
							kind: convertSymbolKind(item.kind),
							location: {
								uri: document.uri,
								range: convertRange(jsDocument, item.spans[0])
							},
							containerName: containerLabel
						};
						existing[sig] = true;
						result.push(symbol);
						containerLabel = item.text;
					}

					if (item.childItems && item.childItems.length > 0) {
						for (const child of item.childItems) {
							collectSymbols(child, containerLabel);
						}
					}

				};

				items.forEach(item => collectSymbols(item));
				return result;
			}
			return [];
		},
		async findDefinition(document: TextDocument, position: Position): Promise<Definition | null> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const definition = jsLanguageService.getDefinitionAtPosition(jsDocument.uri, jsDocument.offsetAt(position));
			if (definition) {
				return (await Promise.all(definition.map(async d => {
					if (d.fileName === jsDocument.uri) {
						return {
							uri: document.uri,
							range: convertRange(jsDocument, d.textSpan)
						};
					} else {
						const libUri = libParentUri + d.fileName;
						const content = await host.loadLibrary(d.fileName);
						if (!content) {
							return undefined;
						}
						const libDocument = TextDocument.create(libUri, languageId, 1, content);
						return {
							uri: libUri,
							range: convertRange(libDocument, d.textSpan)
						};
					}
				}))).filter(d => !!d);
			}
			return null;
		},
		async findReferences(document: TextDocument, position: Position): Promise<Location[]> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const references = jsLanguageService.getReferencesAtPosition(jsDocument.uri, jsDocument.offsetAt(position));
			if (references) {
				return references.filter(d => d.fileName === jsDocument.uri).map(d => {
					return {
						uri: document.uri,
						range: convertRange(jsDocument, d.textSpan)
					};
				});
			}
			return [];
		},
		async getSelectionRange(document: TextDocument, position: Position): Promise<SelectionRange> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			function convertSelectionRange(selectionRange: ts.SelectionRange): SelectionRange {
				const parent = selectionRange.parent ? convertSelectionRange(selectionRange.parent) : undefined;
				return SelectionRange.create(convertRange(jsDocument, selectionRange.textSpan), parent);
			}
			const range = jsLanguageService.getSmartSelectionRange(jsDocument.uri, jsDocument.offsetAt(position));
			return convertSelectionRange(range);
		},
		async format(document: TextDocument, range: Range, formatParams: FormattingOptions, settings: Settings = globalSettings): Promise<TextEdit[]> {
			const jsDocument = documentRegions.get(document).getEmbeddedDocument('javascript', true);
			const jsLanguageService = await host.getLanguageService(jsDocument);

			const formatterSettings = settings && settings.javascript && settings.javascript.format;

			const initialIndentLevel = computeInitialIndent(document, range, formatParams);
			const formatSettings = convertOptions(formatParams, formatterSettings, initialIndentLevel + 1);
			const start = jsDocument.offsetAt(range.start);
			let end = jsDocument.offsetAt(range.end);
			let lastLineRange = null;
			if (range.end.line > range.start.line && (range.end.character === 0 || isWhitespaceOnly(jsDocument.getText().substr(end - range.end.character, range.end.character)))) {
				end -= range.end.character;
				lastLineRange = Range.create(Position.create(range.end.line, 0), range.end);
			}
			const edits = jsLanguageService.getFormattingEditsForRange(jsDocument.uri, start, end, formatSettings);
			if (edits) {
				const result = [];
				for (const edit of edits) {
					if (edit.span.start >= start && edit.span.start + edit.span.length <= end) {
						result.push({
							range: convertRange(jsDocument, edit.span),
							newText: edit.newText
						});
					}
				}
				if (lastLineRange) {
					result.push({
						range: lastLineRange,
						newText: generateIndent(initialIndentLevel, formatParams)
					});
				}
				return result;
			}
			return [];
		},
		async getFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			const spans = jsLanguageService.getOutliningSpans(jsDocument.uri);
			const ranges: FoldingRange[] = [];
			for (const span of spans) {
				const curr = convertRange(jsDocument, span.textSpan);
				const startLine = curr.start.line;
				const endLine = curr.end.line;
				if (startLine < endLine) {
					const foldingRange: FoldingRange = { startLine, endLine };
					const match = document.getText(curr).match(/^\s*\/(?:(\/\s*#(?:end)?region\b)|(\*|\/))/);
					if (match) {
						foldingRange.kind = match[1] ? FoldingRangeKind.Region : FoldingRangeKind.Comment;
					}
					ranges.push(foldingRange);
				}
			}
			return ranges;
		},
		onDocumentRemoved(document: TextDocument) {
			jsDocuments.onDocumentRemoved(document);
		},
		async getSemanticTokens(document: TextDocument): Promise<SemanticTokenData[]> {
			const jsDocument = jsDocuments.get(document);
			const jsLanguageService = await host.getLanguageService(jsDocument);
			return [...getSemanticTokens(jsLanguageService, jsDocument, jsDocument.uri)];
		},
		getSemanticTokenLegend(): { types: string[]; modifiers: string[] } {
			return getSemanticTokenLegend();
		},
		async getTextDocumentContent(documentUri: DocumentUri): Promise<string | undefined> {
			if (documentUri.startsWith(libParentUri)) {
				return host.loadLibrary(documentUri.substring(libParentUri.length));
			}
			return undefined;
		},
		dispose() {
			host.dispose();
			jsDocuments.dispose();
		}
	};
}




function convertRange(document: TextDocument, span: { start: number | undefined; length: number | undefined }): Range {
	if (typeof span.start === 'undefined') {
		const pos = document.positionAt(0);
		return Range.create(pos, pos);
	}
	const startPosition = document.positionAt(span.start);
	const endPosition = document.positionAt(span.start + (span.length || 0));
	return Range.create(startPosition, endPosition);
}

function convertKind(kind: string): CompletionItemKind {
	switch (kind) {
		case Kind.primitiveType:
		case Kind.keyword:
			return CompletionItemKind.Keyword;

		case Kind.const:
		case Kind.let:
		case Kind.variable:
		case Kind.localVariable:
		case Kind.alias:
		case Kind.parameter:
			return CompletionItemKind.Variable;

		case Kind.memberVariable:
		case Kind.memberGetAccessor:
		case Kind.memberSetAccessor:
			return CompletionItemKind.Field;

		case Kind.function:
		case Kind.localFunction:
			return CompletionItemKind.Function;

		case Kind.method:
		case Kind.constructSignature:
		case Kind.callSignature:
		case Kind.indexSignature:
			return CompletionItemKind.Method;

		case Kind.enum:
			return CompletionItemKind.Enum;

		case Kind.enumMember:
			return CompletionItemKind.EnumMember;

		case Kind.module:
		case Kind.externalModuleName:
			return CompletionItemKind.Module;

		case Kind.class:
		case Kind.type:
			return CompletionItemKind.Class;

		case Kind.interface:
			return CompletionItemKind.Interface;

		case Kind.warning:
			return CompletionItemKind.Text;

		case Kind.script:
			return CompletionItemKind.File;

		case Kind.directory:
			return CompletionItemKind.Folder;

		case Kind.string:
			return CompletionItemKind.Constant;

		default:
			return CompletionItemKind.Property;
	}
}
const enum Kind {
	alias = 'alias',
	callSignature = 'call',
	class = 'class',
	const = 'const',
	constructorImplementation = 'constructor',
	constructSignature = 'construct',
	directory = 'directory',
	enum = 'enum',
	enumMember = 'enum member',
	externalModuleName = 'external module name',
	function = 'function',
	indexSignature = 'index',
	interface = 'interface',
	keyword = 'keyword',
	let = 'let',
	localFunction = 'local function',
	localVariable = 'local var',
	method = 'method',
	memberGetAccessor = 'getter',
	memberSetAccessor = 'setter',
	memberVariable = 'property',
	module = 'module',
	primitiveType = 'primitive type',
	script = 'script',
	type = 'type',
	variable = 'var',
	warning = 'warning',
	string = 'string',
	parameter = 'parameter',
	typeParameter = 'type parameter'
}

function convertSymbolKind(kind: string): SymbolKind {
	switch (kind) {
		case Kind.module: return SymbolKind.Module;
		case Kind.class: return SymbolKind.Class;
		case Kind.enum: return SymbolKind.Enum;
		case Kind.enumMember: return SymbolKind.EnumMember;
		case Kind.interface: return SymbolKind.Interface;
		case Kind.indexSignature: return SymbolKind.Method;
		case Kind.callSignature: return SymbolKind.Method;
		case Kind.method: return SymbolKind.Method;
		case Kind.memberVariable: return SymbolKind.Property;
		case Kind.memberGetAccessor: return SymbolKind.Property;
		case Kind.memberSetAccessor: return SymbolKind.Property;
		case Kind.variable: return SymbolKind.Variable;
		case Kind.let: return SymbolKind.Variable;
		case Kind.const: return SymbolKind.Variable;
		case Kind.localVariable: return SymbolKind.Variable;
		case Kind.alias: return SymbolKind.Variable;
		case Kind.function: return SymbolKind.Function;
		case Kind.localFunction: return SymbolKind.Function;
		case Kind.constructSignature: return SymbolKind.Constructor;
		case Kind.constructorImplementation: return SymbolKind.Constructor;
		case Kind.typeParameter: return SymbolKind.TypeParameter;
		case Kind.string: return SymbolKind.String;
		default: return SymbolKind.Variable;
	}
}

function convertOptions(options: FormattingOptions, formatSettings: any, initialIndentLevel: number): ts.FormatCodeSettings {
	return {
		convertTabsToSpaces: options.insertSpaces,
		tabSize: options.tabSize,
		indentSize: options.tabSize,
		indentStyle: ts.IndentStyle.Smart,
		newLineCharacter: '\n',
		baseIndentSize: options.tabSize * initialIndentLevel,
		insertSpaceAfterCommaDelimiter: Boolean(!formatSettings || formatSettings.insertSpaceAfterCommaDelimiter),
		insertSpaceAfterConstructor: Boolean(formatSettings && formatSettings.insertSpaceAfterConstructor),
		insertSpaceAfterSemicolonInForStatements: Boolean(!formatSettings || formatSettings.insertSpaceAfterSemicolonInForStatements),
		insertSpaceBeforeAndAfterBinaryOperators: Boolean(!formatSettings || formatSettings.insertSpaceBeforeAndAfterBinaryOperators),
		insertSpaceAfterKeywordsInControlFlowStatements: Boolean(!formatSettings || formatSettings.insertSpaceAfterKeywordsInControlFlowStatements),
		insertSpaceAfterFunctionKeywordForAnonymousFunctions: Boolean(!formatSettings || formatSettings.insertSpaceAfterFunctionKeywordForAnonymousFunctions),
		insertSpaceBeforeFunctionParenthesis: Boolean(formatSettings && formatSettings.insertSpaceBeforeFunctionParenthesis),
		insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: Boolean(formatSettings && formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis),
		insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: Boolean(formatSettings && formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets),
		insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: Boolean(formatSettings && formatSettings.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces),
		insertSpaceAfterOpeningAndBeforeClosingEmptyBraces: Boolean(!formatSettings || formatSettings.insertSpaceAfterOpeningAndBeforeClosingEmptyBraces),
		insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: Boolean(formatSettings && formatSettings.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces),
		insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces: Boolean(formatSettings && formatSettings.insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces),
		insertSpaceAfterTypeAssertion: Boolean(formatSettings && formatSettings.insertSpaceAfterTypeAssertion),
		placeOpenBraceOnNewLineForControlBlocks: Boolean(formatSettings && formatSettings.placeOpenBraceOnNewLineForFunctions),
		placeOpenBraceOnNewLineForFunctions: Boolean(formatSettings && formatSettings.placeOpenBraceOnNewLineForControlBlocks),
		semicolons: formatSettings?.semicolons
	};
}

function computeInitialIndent(document: TextDocument, range: Range, options: FormattingOptions) {
	const lineStart = document.offsetAt(Position.create(range.start.line, 0));
	const content = document.getText();

	let i = lineStart;
	let nChars = 0;
	const tabSize = options.tabSize || 4;
	while (i < content.length) {
		const ch = content.charAt(i);
		if (ch === ' ') {
			nChars++;
		} else if (ch === '\t') {
			nChars += tabSize;
		} else {
			break;
		}
		i++;
	}
	return Math.floor(nChars / tabSize);
}

function generateIndent(level: number, options: FormattingOptions) {
	if (options.insertSpaces) {
		return repeat(' ', level * options.tabSize);
	} else {
		return repeat('\t', level);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/javascriptSemanticTokens.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/javascriptSemanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TextDocument, SemanticTokenData } from './languageModes';
import * as ts from 'typescript';

export function getSemanticTokenLegend() {
	if (tokenTypes.length !== TokenType._) {
		console.warn('TokenType has added new entries.');
	}
	if (tokenModifiers.length !== TokenModifier._) {
		console.warn('TokenModifier has added new entries.');
	}
	return { types: tokenTypes, modifiers: tokenModifiers };
}

export function* getSemanticTokens(jsLanguageService: ts.LanguageService, document: TextDocument, fileName: string): Iterable<SemanticTokenData> {
	const { spans } = jsLanguageService.getEncodedSemanticClassifications(fileName, { start: 0, length: document.getText().length }, '2020' as ts.SemanticClassificationFormat);

	for (let i = 0; i < spans.length;) {
		const offset = spans[i++];
		const length = spans[i++];
		const tsClassification = spans[i++];

		const tokenType = getTokenTypeFromClassification(tsClassification);
		if (tokenType === undefined) {
			continue;
		}

		const tokenModifiers = getTokenModifierFromClassification(tsClassification);
		const startPos = document.positionAt(offset);
		yield {
			start: startPos,
			length: length,
			typeIdx: tokenType,
			modifierSet: tokenModifiers
		};
	}
}


// typescript encodes type and modifiers in the classification:
// TSClassification = (TokenType + 1) << 8 + TokenModifier

const enum TokenType {
	class = 0,
	enum = 1,
	interface = 2,
	namespace = 3,
	typeParameter = 4,
	type = 5,
	parameter = 6,
	variable = 7,
	enumMember = 8,
	property = 9,
	function = 10,
	method = 11,
	_ = 12
}

const enum TokenModifier {
	declaration = 0,
	static = 1,
	async = 2,
	readonly = 3,
	defaultLibrary = 4,
	local = 5,
	_ = 6
}

const enum TokenEncodingConsts {
	typeOffset = 8,
	modifierMask = 255
}

function getTokenTypeFromClassification(tsClassification: number): number | undefined {
	if (tsClassification > TokenEncodingConsts.modifierMask) {
		return (tsClassification >> TokenEncodingConsts.typeOffset) - 1;
	}
	return undefined;
}

function getTokenModifierFromClassification(tsClassification: number) {
	return tsClassification & TokenEncodingConsts.modifierMask;
}

const tokenTypes: string[] = [];
tokenTypes[TokenType.class] = 'class';
tokenTypes[TokenType.enum] = 'enum';
tokenTypes[TokenType.interface] = 'interface';
tokenTypes[TokenType.namespace] = 'namespace';
tokenTypes[TokenType.typeParameter] = 'typeParameter';
tokenTypes[TokenType.type] = 'type';
tokenTypes[TokenType.parameter] = 'parameter';
tokenTypes[TokenType.variable] = 'variable';
tokenTypes[TokenType.enumMember] = 'enumMember';
tokenTypes[TokenType.property] = 'property';
tokenTypes[TokenType.function] = 'function';
tokenTypes[TokenType.method] = 'method';

const tokenModifiers: string[] = [];
tokenModifiers[TokenModifier.async] = 'async';
tokenModifiers[TokenModifier.declaration] = 'declaration';
tokenModifiers[TokenModifier.readonly] = 'readonly';
tokenModifiers[TokenModifier.static] = 'static';
tokenModifiers[TokenModifier.local] = 'local';
tokenModifiers[TokenModifier.defaultLibrary] = 'defaultLibrary';
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/languageModes.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/languageModes.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getCSSLanguageService } from 'vscode-css-languageservice';
import {
	DocumentContext, getLanguageService as getHTMLLanguageService, IHTMLDataProvider, ClientCapabilities
} from 'vscode-html-languageservice';
import {
	SelectionRange,
	CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, FoldingRange, FormattingOptions,
	Hover, Location, Position, Range, SignatureHelp, SymbolInformation, TextEdit,
	Color, ColorInformation, ColorPresentation, WorkspaceEdit,
	WorkspaceFolder
} from 'vscode-languageserver';
import { DocumentUri, TextDocument } from 'vscode-languageserver-textdocument';

import { getLanguageModelCache, LanguageModelCache } from '../languageModelCache';
import { getCSSMode } from './cssMode';
import { getDocumentRegions, HTMLDocumentRegions } from './embeddedSupport';
import { getHTMLMode } from './htmlMode';
import { getJavaScriptMode } from './javascriptMode';
import { FileSystemProvider } from '../requests';

export {
	WorkspaceFolder, CompletionItem, CompletionList, CompletionItemKind, Definition, Diagnostic, DocumentHighlight, DocumentHighlightKind,
	DocumentLink, FoldingRange, FoldingRangeKind, FormattingOptions,
	Hover, Location, Position, Range, SignatureHelp, SymbolInformation, SymbolKind, TextEdit,
	Color, ColorInformation, ColorPresentation, WorkspaceEdit,
	SignatureInformation, ParameterInformation, DiagnosticSeverity,
	SelectionRange, TextDocumentIdentifier
} from 'vscode-languageserver';

export { ClientCapabilities, DocumentContext, LanguageService, HTMLDocument, HTMLFormatConfiguration, TokenType } from 'vscode-html-languageservice';

export { TextDocument, DocumentUri } from 'vscode-languageserver-textdocument';

export interface Settings {
	readonly css?: any;
	readonly html?: any;
	readonly javascript?: any;
	readonly 'js/ts'?: any;
}

export interface Workspace {
	readonly settings: Settings;
	readonly folders: WorkspaceFolder[];
}

export interface SemanticTokenData {
	start: Position;
	length: number;
	typeIdx: number;
	modifierSet: number;
}

export type CompletionItemData = {
	languageId: string;
	uri: string;
	offset: number;
};

export function isCompletionItemData(value: any): value is CompletionItemData {
	return value && typeof value.languageId === 'string' && typeof value.uri === 'string' && typeof value.offset === 'number';
}

export interface LanguageMode {
	getId(): string;
	getSelectionRange?: (document: TextDocument, position: Position) => Promise<SelectionRange>;
	doValidation?: (document: TextDocument, settings?: Settings) => Promise<Diagnostic[]>;
	doComplete?: (document: TextDocument, position: Position, documentContext: DocumentContext, settings?: Settings) => Promise<CompletionList>;
	doResolve?: (document: TextDocument, item: CompletionItem) => Promise<CompletionItem>;
	doHover?: (document: TextDocument, position: Position, settings?: Settings) => Promise<Hover | null>;
	doSignatureHelp?: (document: TextDocument, position: Position) => Promise<SignatureHelp | null>;
	doRename?: (document: TextDocument, position: Position, newName: string) => Promise<WorkspaceEdit | null>;
	doLinkedEditing?: (document: TextDocument, position: Position) => Promise<Range[] | null>;
	findDocumentHighlight?: (document: TextDocument, position: Position) => Promise<DocumentHighlight[]>;
	findDocumentSymbols?: (document: TextDocument) => Promise<SymbolInformation[]>;
	findDocumentLinks?: (document: TextDocument, documentContext: DocumentContext) => Promise<DocumentLink[]>;
	findDefinition?: (document: TextDocument, position: Position) => Promise<Definition | null>;
	findReferences?: (document: TextDocument, position: Position) => Promise<Location[]>;
	format?: (document: TextDocument, range: Range, options: FormattingOptions, settings?: Settings) => Promise<TextEdit[]>;
	findDocumentColors?: (document: TextDocument) => Promise<ColorInformation[]>;
	getColorPresentations?: (document: TextDocument, color: Color, range: Range) => Promise<ColorPresentation[]>;
	doAutoInsert?: (document: TextDocument, position: Position, kind: 'autoClose' | 'autoQuote') => Promise<string | null>;
	findMatchingTagPosition?: (document: TextDocument, position: Position) => Promise<Position | null>;
	getFoldingRanges?: (document: TextDocument) => Promise<FoldingRange[]>;
	onDocumentRemoved(document: TextDocument): void;
	getSemanticTokens?(document: TextDocument): Promise<SemanticTokenData[]>;
	getSemanticTokenLegend?(): { types: string[]; modifiers: string[] };
	getTextDocumentContent?(uri: DocumentUri): Promise<string | undefined>;
	dispose(): void;
}

export interface LanguageModes {
	updateDataProviders(dataProviders: IHTMLDataProvider[]): void;
	getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined;
	getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
	getAllModes(): LanguageMode[];
	getAllModesInDocument(document: TextDocument): LanguageMode[];
	getMode(languageId: string): LanguageMode | undefined;
	onDocumentRemoved(document: TextDocument): void;
	dispose(): void;
}

export interface LanguageModeRange extends Range {
	mode: LanguageMode | undefined;
	attributeValue?: boolean;
}

export const FILE_PROTOCOL = 'html-server';

export function getLanguageModes(supportedLanguages: { [languageId: string]: boolean }, workspace: Workspace, clientCapabilities: ClientCapabilities, requestService: FileSystemProvider): LanguageModes {
	const htmlLanguageService = getHTMLLanguageService({ clientCapabilities, fileSystemProvider: requestService });
	const cssLanguageService = getCSSLanguageService({ clientCapabilities, fileSystemProvider: requestService });

	const documentRegions = getLanguageModelCache<HTMLDocumentRegions>(10, 60, document => getDocumentRegions(htmlLanguageService, document));

	let modelCaches: LanguageModelCache<any>[] = [];
	modelCaches.push(documentRegions);

	let modes = Object.create(null);
	modes['html'] = getHTMLMode(htmlLanguageService, workspace);
	if (supportedLanguages['css']) {
		modes['css'] = getCSSMode(cssLanguageService, documentRegions, workspace);
	}
	if (supportedLanguages['javascript']) {
		modes['javascript'] = getJavaScriptMode(documentRegions, 'javascript', workspace);
		modes['typescript'] = getJavaScriptMode(documentRegions, 'typescript', workspace);
	}
	return {
		async updateDataProviders(dataProviders: IHTMLDataProvider[]): Promise<void> {
			htmlLanguageService.setDataProviders(true, dataProviders);
		},
		getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined {
			const languageId = documentRegions.get(document).getLanguageAtPosition(position);
			if (languageId) {
				return modes[languageId];
			}
			return undefined;
		},
		getModesInRange(document: TextDocument, range: Range): LanguageModeRange[] {
			return documentRegions.get(document).getLanguageRanges(range).map((r): LanguageModeRange => {
				return {
					start: r.start,
					end: r.end,
					mode: r.languageId && modes[r.languageId],
					attributeValue: r.attributeValue
				};
			});
		},
		getAllModesInDocument(document: TextDocument): LanguageMode[] {
			const result = [];
			for (const languageId of documentRegions.get(document).getLanguagesInDocument()) {
				const mode = modes[languageId];
				if (mode) {
					result.push(mode);
				}
			}
			return result;
		},
		getAllModes(): LanguageMode[] {
			const result = [];
			for (const languageId in modes) {
				const mode = modes[languageId];
				if (mode) {
					result.push(mode);
				}
			}
			return result;
		},
		getMode(languageId: string): LanguageMode {
			return modes[languageId];
		},
		onDocumentRemoved(document: TextDocument) {
			modelCaches.forEach(mc => mc.onDocumentRemoved(document));
			for (const mode in modes) {
				modes[mode].onDocumentRemoved(document);
			}
		},
		dispose(): void {
			modelCaches.forEach(mc => mc.dispose());
			modelCaches = [];
			for (const mode in modes) {
				modes[mode].dispose();
			}
			modes = {};
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/selectionRanges.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/selectionRanges.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageModes, TextDocument, Position, Range, SelectionRange } from './languageModes';
import { insideRangeButNotSame } from '../utils/positions';

export async function getSelectionRanges(languageModes: LanguageModes, document: TextDocument, positions: Position[]) {
	const htmlMode = languageModes.getMode('html');
	return Promise.all(positions.map(async position => {
		const htmlRange = await htmlMode!.getSelectionRange!(document, position);
		const mode = languageModes.getModeAtPosition(document, position);
		if (mode && mode.getSelectionRange) {
			const range = await mode.getSelectionRange(document, position);
			let top = range;
			while (top.parent && insideRangeButNotSame(htmlRange.range, top.parent.range)) {
				top = top.parent;
			}
			top.parent = htmlRange;
			return range;
		}
		return htmlRange || SelectionRange.create(Range.create(position, position));
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/modes/semanticTokens.ts]---
Location: vscode-main/extensions/html-language-features/server/src/modes/semanticTokens.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SemanticTokenData, Range, TextDocument, LanguageModes, Position } from './languageModes';
import { beforeOrSame } from '../utils/positions';

interface LegendMapping {
	types: number[] | undefined;
	modifiers: number[] | undefined;
}

export interface SemanticTokenProvider {
	readonly legend: { types: string[]; modifiers: string[] };
	getSemanticTokens(document: TextDocument, ranges?: Range[]): Promise<number[]>;
}


export function newSemanticTokenProvider(languageModes: LanguageModes): SemanticTokenProvider {

	// combined legend across modes
	const legend: { types: string[]; modifiers: string[] } = { types: [], modifiers: [] };
	const legendMappings: { [modeId: string]: LegendMapping } = {};

	for (const mode of languageModes.getAllModes()) {
		if (mode.getSemanticTokenLegend && mode.getSemanticTokens) {
			const modeLegend = mode.getSemanticTokenLegend();
			legendMappings[mode.getId()] = { types: createMapping(modeLegend.types, legend.types), modifiers: createMapping(modeLegend.modifiers, legend.modifiers) };
		}
	}

	return {
		legend,
		async getSemanticTokens(document: TextDocument, ranges?: Range[]): Promise<number[]> {
			const allTokens: SemanticTokenData[] = [];
			for (const mode of languageModes.getAllModesInDocument(document)) {
				if (mode.getSemanticTokens) {
					const mapping = legendMappings[mode.getId()];
					const tokens = await mode.getSemanticTokens(document);
					applyTypesMapping(tokens, mapping.types);
					applyModifiersMapping(tokens, mapping.modifiers);
					for (const token of tokens) {
						allTokens.push(token);
					}
				}
			}
			return encodeTokens(allTokens, ranges, document);
		}
	};
}

function createMapping(origLegend: string[], newLegend: string[]): number[] | undefined {
	const mapping: number[] = [];
	let needsMapping = false;
	for (let origIndex = 0; origIndex < origLegend.length; origIndex++) {
		const entry = origLegend[origIndex];
		let newIndex = newLegend.indexOf(entry);
		if (newIndex === -1) {
			newIndex = newLegend.length;
			newLegend.push(entry);
		}
		mapping.push(newIndex);
		needsMapping = needsMapping || (newIndex !== origIndex);
	}
	return needsMapping ? mapping : undefined;
}

function applyTypesMapping(tokens: SemanticTokenData[], typesMapping: number[] | undefined): void {
	if (typesMapping) {
		for (const token of tokens) {
			token.typeIdx = typesMapping[token.typeIdx];
		}
	}
}

function applyModifiersMapping(tokens: SemanticTokenData[], modifiersMapping: number[] | undefined): void {
	if (modifiersMapping) {
		for (const token of tokens) {
			let modifierSet = token.modifierSet;
			if (modifierSet) {
				let index = 0;
				let result = 0;
				while (modifierSet > 0) {
					if ((modifierSet & 1) !== 0) {
						result = result + (1 << modifiersMapping[index]);
					}
					index++;
					modifierSet = modifierSet >> 1;
				}
				token.modifierSet = result;
			}
		}
	}
}

function encodeTokens(tokens: SemanticTokenData[], ranges: Range[] | undefined, document: TextDocument): number[] {

	const resultTokens = tokens.sort((d1, d2) => d1.start.line - d2.start.line || d1.start.character - d2.start.character);
	if (ranges) {
		ranges = ranges.sort((d1, d2) => d1.start.line - d2.start.line || d1.start.character - d2.start.character);
	} else {
		ranges = [Range.create(Position.create(0, 0), Position.create(document.lineCount, 0))];
	}

	let rangeIndex = 0;
	let currRange = ranges[rangeIndex++];

	let prefLine = 0;
	let prevChar = 0;

	const encodedResult: number[] = [];

	for (let k = 0; k < resultTokens.length && currRange; k++) {
		const curr = resultTokens[k];
		const start = curr.start;
		while (currRange && beforeOrSame(currRange.end, start)) {
			currRange = ranges[rangeIndex++];
		}
		if (currRange && beforeOrSame(currRange.start, start) && beforeOrSame({ line: start.line, character: start.character + curr.length }, currRange.end)) {
			// token inside a range

			if (prefLine !== start.line) {
				prevChar = 0;
			}
			encodedResult.push(start.line - prefLine); // line delta
			encodedResult.push(start.character - prevChar); // line delta
			encodedResult.push(curr.length); // length
			encodedResult.push(curr.typeIdx); // tokenType
			encodedResult.push(curr.modifierSet); // tokenModifier

			prefLine = start.line;
			prevChar = start.character;
		}
	}
	return encodedResult;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/node/htmlServerMain.ts]---
Location: vscode-main/extensions/html-language-features/server/src/node/htmlServerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, Connection, Disposable } from 'vscode-languageserver/node';
import { formatError } from '../utils/runner';
import { RuntimeEnvironment, startServer } from '../htmlServer';
import { getNodeFileFS } from './nodeFs';


// Create a connection for the server.
const connection: Connection = createConnection();

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

process.on('unhandledRejection', (e: any) => {
	connection.console.error(formatError(`Unhandled exception`, e));
});

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setImmediate(callback, ...args);
			return { dispose: () => clearImmediate(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	},
	fileFs: getNodeFileFS()
};

startServer(connection, runtime);
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/node/htmlServerNodeMain.ts]---
Location: vscode-main/extensions/html-language-features/server/src/node/htmlServerNodeMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as l10n from '@vscode/l10n';

async function setupMain() {
	const l10nLog: string[] = [];

	const i10lLocation = process.env['VSCODE_L10N_BUNDLE_LOCATION'];
	if (i10lLocation) {
		try {
			await l10n.config({ uri: i10lLocation });
			l10nLog.push(`l10n: Configured to ${i10lLocation.toString()}`);
		} catch (e) {
			l10nLog.push(`l10n: Problems loading ${i10lLocation.toString()} : ${e}`);
		}
	}
	await import('./htmlServerMain.js');
	l10nLog.forEach(console.log);
}
setupMain();
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/node/nodeFs.ts]---
Location: vscode-main/extensions/html-language-features/server/src/node/nodeFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FileSystemProvider } from '../requests';
import { URI as Uri } from 'vscode-uri';

import * as fs from 'fs';
import { FileType } from 'vscode-css-languageservice';

export function getNodeFileFS(): FileSystemProvider {
	function ensureFileUri(location: string) {
		if (!location.startsWith('file:')) {
			throw new Error('fileSystemProvider can only handle file URLs');
		}
	}
	return {
		stat(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.stat(uri.fsPath, (err, stats) => {
					if (err) {
						if (err.code === 'ENOENT') {
							return c({ type: FileType.Unknown, ctime: -1, mtime: -1, size: -1 });
						} else {
							return e(err);
						}
					}

					let type = FileType.Unknown;
					if (stats.isFile()) {
						type = FileType.File;
					} else if (stats.isDirectory()) {
						type = FileType.Directory;
					} else if (stats.isSymbolicLink()) {
						type = FileType.SymbolicLink;
					}

					c({
						type,
						ctime: stats.ctime.getTime(),
						mtime: stats.mtime.getTime(),
						size: stats.size
					});
				});
			});
		},
		readDirectory(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const path = Uri.parse(location).fsPath;

				fs.readdir(path, { withFileTypes: true }, (err, children) => {
					if (err) {
						return e(err);
					}
					c(children.map(stat => {
						if (stat.isSymbolicLink()) {
							return [stat.name, FileType.SymbolicLink];
						} else if (stat.isDirectory()) {
							return [stat.name, FileType.Directory];
						} else if (stat.isFile()) {
							return [stat.name, FileType.File];
						} else {
							return [stat.name, FileType.Unknown];
						}
					}));
				});
			});
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/completions.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/completions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import { URI } from 'vscode-uri';
import { getLanguageModes, WorkspaceFolder, TextDocument, CompletionList, CompletionItemKind, ClientCapabilities, TextEdit } from '../modes/languageModes';
import { getNodeFileFS } from '../node/nodeFs';
import { getDocumentContext } from '../utils/documentContext';
export interface ItemDescription {
	label: string;
	documentation?: string;
	kind?: CompletionItemKind;
	resultText?: string;
	command?: { title: string; command: string };
	notAvailable?: boolean;
}

export function assertCompletion(completions: CompletionList, expected: ItemDescription, document: TextDocument) {
	const matches = completions.items.filter(completion => {
		return completion.label === expected.label;
	});
	if (expected.notAvailable) {
		assert.strictEqual(matches.length, 0, `${expected.label} should not existing is results`);
		return;
	}

	assert.strictEqual(matches.length, 1, `${expected.label} should only existing once: Actual: ${completions.items.map(c => c.label).join(', ')}`);
	const match = matches[0];
	if (expected.documentation) {
		assert.strictEqual(match.documentation, expected.documentation);
	}
	if (expected.kind) {
		assert.strictEqual(match.kind, expected.kind);
	}
	if (expected.resultText && match.textEdit) {
		const edit = TextEdit.is(match.textEdit) ? match.textEdit : TextEdit.replace(match.textEdit.replace, match.textEdit.newText);
		assert.strictEqual(TextDocument.applyEdits(document, [edit]), expected.resultText);
	}
	if (expected.command) {
		assert.deepStrictEqual(match.command, expected.command);
	}
}

const testUri = 'test://test/test.html';

export async function testCompletionFor(value: string, expected: { count?: number; items?: ItemDescription[] }, uri = testUri, workspaceFolders?: WorkspaceFolder[]): Promise<void> {
	const offset = value.indexOf('|');
	value = value.substr(0, offset) + value.substr(offset + 1);

	const workspace = {
		settings: {},
		folders: workspaceFolders || [{ name: 'x', uri: uri.substr(0, uri.lastIndexOf('/')) }]
	};

	const document = TextDocument.create(uri, 'html', 0, value);
	const position = document.positionAt(offset);
	const context = getDocumentContext(uri, workspace.folders);

	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());
	const mode = languageModes.getModeAtPosition(document, position)!;

	const list = await mode.doComplete!(document, position, context);

	if (expected.count) {
		assert.strictEqual(list.items.length, expected.count);
	}
	if (expected.items) {
		for (const item of expected.items) {
			assertCompletion(list, item, document);
		}
	}
}

suite('HTML Completion', () => {
	test('HTML JavaScript Completions', async () => {
		await testCompletionFor('<html><script>window.|</script></html>', {
			items: [
				{ label: 'location', resultText: '<html><script>window.location</script></html>' },
			]
		});
		await testCompletionFor('<html><script>$.|</script></html>', {
			items: [
				{ label: 'getJSON', resultText: '<html><script>$.getJSON</script></html>' },
			]
		});
		await testCompletionFor('<html><script>const x = { a: 1 };</script><script>x.|</script></html>', {
			items: [
				{ label: 'a', resultText: '<html><script>const x = { a: 1 };</script><script>x.a</script></html>' },
			]
		}, 'test://test/test2.html');
	});
});

suite('HTML Path Completion', () => {
	const triggerSuggestCommand = {
		title: 'Suggest',
		command: 'editor.action.triggerSuggest'
	};

	const fixtureRoot = path.resolve(__dirname, '../../src/test/pathCompletionFixtures');
	const fixtureWorkspace = { name: 'fixture', uri: URI.file(fixtureRoot).toString() };
	const indexHtmlUri = URI.file(path.resolve(fixtureRoot, 'index.html')).toString();
	const aboutHtmlUri = URI.file(path.resolve(fixtureRoot, 'about/about.html')).toString();

	test('Basics - Correct label/kind/result/command', async () => {
		await testCompletionFor('<script src="./|">', {
			items: [
				{ label: 'about/', kind: CompletionItemKind.Folder, resultText: '<script src="./about/">', command: triggerSuggestCommand },
				{ label: 'index.html', kind: CompletionItemKind.File, resultText: '<script src="./index.html">' },
				{ label: 'src/', kind: CompletionItemKind.Folder, resultText: '<script src="./src/">', command: triggerSuggestCommand }
			]
		}, indexHtmlUri);
	});

	test('Basics - Single Quote', async () => {
		await testCompletionFor(`<script src='./|'>`, {
			items: [
				{ label: 'about/', kind: CompletionItemKind.Folder, resultText: `<script src='./about/'>`, command: triggerSuggestCommand },
				{ label: 'index.html', kind: CompletionItemKind.File, resultText: `<script src='./index.html'>` },
				{ label: 'src/', kind: CompletionItemKind.Folder, resultText: `<script src='./src/'>`, command: triggerSuggestCommand }
			]
		}, indexHtmlUri);
	});

	test('No completion for remote paths', async () => {
		await testCompletionFor('<script src="http:">', { items: [] });
		await testCompletionFor('<script src="http:/|">', { items: [] });
		await testCompletionFor('<script src="http://|">', { items: [] });
		await testCompletionFor('<script src="https:|">', { items: [] });
		await testCompletionFor('<script src="https:/|">', { items: [] });
		await testCompletionFor('<script src="https://|">', { items: [] });
		await testCompletionFor('<script src="//|">', { items: [] });
	});

	test('Relative Path', async () => {
		await testCompletionFor('<script src="../|">', {
			items: [
				{ label: 'about/', resultText: '<script src="../about/">' },
				{ label: 'index.html', resultText: '<script src="../index.html">' },
				{ label: 'src/', resultText: '<script src="../src/">' }
			]
		}, aboutHtmlUri);

		await testCompletionFor('<script src="../src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="../src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="../src/test.js">' },
			]
		}, aboutHtmlUri);
	});

	test('Absolute Path', async () => {
		await testCompletionFor('<script src="/|">', {
			items: [
				{ label: 'about/', resultText: '<script src="/about/">' },
				{ label: 'index.html', resultText: '<script src="/index.html">' },
				{ label: 'src/', resultText: '<script src="/src/">' },
			]
		}, indexHtmlUri);

		await testCompletionFor('<script src="/src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="/src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="/src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});

	test('Empty Path Value', async () => {
		// document: index.html
		await testCompletionFor('<script src="|">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri);
		// document: about.html
		await testCompletionFor('<script src="|">', {
			items: [
				{ label: 'about.css', resultText: '<script src="about.css">' },
				{ label: 'about.html', resultText: '<script src="about.html">' },
				{ label: 'media/', resultText: '<script src="media/">' },
			]
		}, aboutHtmlUri);
	});
	test('Incomplete Path', async () => {
		await testCompletionFor('<script src="/src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="/src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="/src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="../src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="../src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="../src/test.js">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});

	test('No leading dot or slash', async () => {
		// document: index.html
		await testCompletionFor('<script src="s|">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="src/|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="src/f|">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		// document: about.html
		await testCompletionFor('<script src="s|">', {
			items: [
				{ label: 'about.css', resultText: '<script src="about.css">' },
				{ label: 'about.html', resultText: '<script src="about.html">' },
				{ label: 'media/', resultText: '<script src="media/">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="media/|">', {
			items: [
				{ label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
			]
		}, aboutHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="media/f|">', {
			items: [
				{ label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});

	test('Trigger completion in middle of path', async () => {
		// document: index.html
		await testCompletionFor('<script src="src/f|eature.js">', {
			items: [
				{ label: 'feature.js', resultText: '<script src="src/feature.js">' },
				{ label: 'test.js', resultText: '<script src="src/test.js">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="s|rc/feature.js">', {
			items: [
				{ label: 'about/', resultText: '<script src="about/">' },
				{ label: 'index.html', resultText: '<script src="index.html">' },
				{ label: 'src/', resultText: '<script src="src/">' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		// document: about.html
		await testCompletionFor('<script src="media/f|eature.js">', {
			items: [
				{ label: 'icon.pic', resultText: '<script src="media/icon.pic">' }
			]
		}, aboutHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="m|edia/feature.js">', {
			items: [
				{ label: 'about.css', resultText: '<script src="about.css">' },
				{ label: 'about.html', resultText: '<script src="about.html">' },
				{ label: 'media/', resultText: '<script src="media/">' },
			]
		}, aboutHtmlUri, [fixtureWorkspace]);
	});


	test('Trigger completion in middle of path and with whitespaces', async () => {
		await testCompletionFor('<script src="./| about/about.html>', {
			items: [
				{ label: 'about/', resultText: '<script src="./about/ about/about.html>' },
				{ label: 'index.html', resultText: '<script src="./index.html about/about.html>' },
				{ label: 'src/', resultText: '<script src="./src/ about/about.html>' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);

		await testCompletionFor('<script src="./a|bout /about.html>', {
			items: [
				{ label: 'about/', resultText: '<script src="./about/ /about.html>' },
				{ label: 'index.html', resultText: '<script src="./index.html /about.html>' },
				{ label: 'src/', resultText: '<script src="./src/ /about.html>' },
			]
		}, indexHtmlUri, [fixtureWorkspace]);
	});

	test('Completion should ignore files/folders starting with dot', async () => {
		await testCompletionFor('<script src="./|"', {
			count: 3
		}, indexHtmlUri, [fixtureWorkspace]);
	});

	test('Unquoted Path', async () => {
		/* Unquoted value is not supported in html language service yet
		testCompletionFor(`<div><a href=about/|>`, {
			items: [
				{ label: 'about.html', resultText: `<div><a href=about/about.html>` }
			]
		}, testUri);
		*/
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/documentContext.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/documentContext.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { getDocumentContext } from '../utils/documentContext';

suite('HTML Document Context', () => {

	test('Context', function (): any {
		const docURI = 'file:///users/test/folder/test.html';
		const rootFolders = [{ name: '', uri: 'file:///users/test/' }];

		const context = getDocumentContext(docURI, rootFolders);
		assert.strictEqual(context.resolveReference('/', docURI), 'file:///users/test/');
		assert.strictEqual(context.resolveReference('/message.html', docURI), 'file:///users/test/message.html');
		assert.strictEqual(context.resolveReference('message.html', docURI), 'file:///users/test/folder/message.html');
		assert.strictEqual(context.resolveReference('message.html', 'file:///users/test/'), 'file:///users/test/message.html');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/embedded.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/embedded.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as assert from 'assert';
import * as embeddedSupport from '../modes/embeddedSupport';
import { getLanguageService } from 'vscode-html-languageservice';
import { TextDocument } from '../modes/languageModes';

suite('HTML Embedded Support', () => {

	const htmlLanguageService = getLanguageService();

	function assertLanguageId(value: string, expectedLanguageId: string | undefined): void {
		const offset = value.indexOf('|');
		value = value.substr(0, offset) + value.substr(offset + 1);

		const document = TextDocument.create('test://test/test.html', 'html', 0, value);

		const position = document.positionAt(offset);

		const docRegions = embeddedSupport.getDocumentRegions(htmlLanguageService, document);
		const languageId = docRegions.getLanguageAtPosition(position);

		assert.strictEqual(languageId, expectedLanguageId);
	}

	function assertEmbeddedLanguageContent(value: string, languageId: string, expectedContent: string): void {
		const document = TextDocument.create('test://test/test.html', 'html', 0, value);

		const docRegions = embeddedSupport.getDocumentRegions(htmlLanguageService, document);
		const content = docRegions.getEmbeddedDocument(languageId);
		assert.strictEqual(content.getText(), expectedContent);
	}

	test('Styles', function (): any {
		assertLanguageId('|<html><style>foo { }</style></html>', 'html');
		assertLanguageId('<html|><style>foo { }</style></html>', 'html');
		assertLanguageId('<html><st|yle>foo { }</style></html>', 'html');
		assertLanguageId('<html><style>|foo { }</style></html>', 'css');
		assertLanguageId('<html><style>foo| { }</style></html>', 'css');
		assertLanguageId('<html><style>foo { }|</style></html>', 'css');
		assertLanguageId('<html><style>foo { }</sty|le></html>', 'html');
	});

	test('Styles - Incomplete HTML', function (): any {
		assertLanguageId('|<html><style>foo { }', 'html');
		assertLanguageId('<html><style>fo|o { }', 'css');
		assertLanguageId('<html><style>foo { }|', 'css');
	});

	test('Style in attribute', function (): any {
		assertLanguageId('<div id="xy" |style="color: red"/>', 'html');
		assertLanguageId('<div id="xy" styl|e="color: red"/>', 'html');
		assertLanguageId('<div id="xy" style=|"color: red"/>', 'html');
		assertLanguageId('<div id="xy" style="|color: red"/>', 'css');
		assertLanguageId('<div id="xy" style="color|: red"/>', 'css');
		assertLanguageId('<div id="xy" style="color: red|"/>', 'css');
		assertLanguageId('<div id="xy" style="color: red"|/>', 'html');
		assertLanguageId('<div id="xy" style=\'color: r|ed\'/>', 'css');
		assertLanguageId('<div id="xy" style|=color:red/>', 'html');
		assertLanguageId('<div id="xy" style=|color:red/>', 'css');
		assertLanguageId('<div id="xy" style=color:r|ed/>', 'css');
		assertLanguageId('<div id="xy" style=color:red|/>', 'css');
		assertLanguageId('<div id="xy" style=color:red/|>', 'html');
	});

	test('Style content', function (): any {
		assertEmbeddedLanguageContent('<html><style>foo { }</style></html>', 'css', '             foo { }               ');
		assertEmbeddedLanguageContent('<html><script>var i = 0;</script></html>', 'css', '                                        ');
		assertEmbeddedLanguageContent('<html><style>foo { }</style>Hello<style>foo { }</style></html>', 'css', '             foo { }                    foo { }               ');
		assertEmbeddedLanguageContent('<html>\n  <style>\n    foo { }  \n  </style>\n</html>\n', 'css', '\n         \n    foo { }  \n  \n\n');

		assertEmbeddedLanguageContent('<div style="color: red"></div>', 'css', '         __{color: red}       ');
		assertEmbeddedLanguageContent('<div style=color:red></div>', 'css', '        __{color:red}      ');
	});

	test('Scripts', function (): any {
		assertLanguageId('|<html><script>var i = 0;</script></html>', 'html');
		assertLanguageId('<html|><script>var i = 0;</script></html>', 'html');
		assertLanguageId('<html><scr|ipt>var i = 0;</script></html>', 'html');
		assertLanguageId('<html><script>|var i = 0;</script></html>', 'javascript');
		assertLanguageId('<html><script>var| i = 0;</script></html>', 'javascript');
		assertLanguageId('<html><script>var i = 0;|</script></html>', 'javascript');
		assertLanguageId('<html><script>var i = 0;</scr|ipt></html>', 'html');

		assertLanguageId('<script type="text/javascript">var| i = 0;</script>', 'javascript');
		assertLanguageId('<script type="text/ecmascript">var| i = 0;</script>', 'javascript');
		assertLanguageId('<script type="application/javascript">var| i = 0;</script>', 'javascript');
		assertLanguageId('<script type="application/ecmascript">var| i = 0;</script>', 'javascript');
		assertLanguageId('<script type="application/typescript">var| i = 0;</script>', undefined);
		assertLanguageId('<script type=\'text/javascript\'>var| i = 0;</script>', 'javascript');
	});

	test('Scripts in attribute', function (): any {
		assertLanguageId('<div |onKeyUp="foo()" onkeydown=\'bar()\'/>', 'html');
		assertLanguageId('<div onKeyUp=|"foo()" onkeydown=\'bar()\'/>', 'html');
		assertLanguageId('<div onKeyUp="|foo()" onkeydown=\'bar()\'/>', 'javascript');
		assertLanguageId('<div onKeyUp="foo(|)" onkeydown=\'bar()\'/>', 'javascript');
		assertLanguageId('<div onKeyUp="foo()|" onkeydown=\'bar()\'/>', 'javascript');
		assertLanguageId('<div onKeyUp="foo()"| onkeydown=\'bar()\'/>', 'html');
		assertLanguageId('<div onKeyUp="foo()" onkeydown=|\'bar()\'/>', 'html');
		assertLanguageId('<div onKeyUp="foo()" onkeydown=\'|bar()\'/>', 'javascript');
		assertLanguageId('<div onKeyUp="foo()" onkeydown=\'bar()|\'/>', 'javascript');
		assertLanguageId('<div onKeyUp="foo()" onkeydown=\'bar()\'|/>', 'html');

		assertLanguageId('<DIV ONKEYUP|=foo()</DIV>', 'html');
		assertLanguageId('<DIV ONKEYUP=|foo()</DIV>', 'javascript');
		assertLanguageId('<DIV ONKEYUP=f|oo()</DIV>', 'javascript');
		assertLanguageId('<DIV ONKEYUP=foo(|)</DIV>', 'javascript');
		assertLanguageId('<DIV ONKEYUP=foo()|</DIV>', 'javascript');
		assertLanguageId('<DIV ONKEYUP=foo()<|/DIV>', 'html');

		assertLanguageId('<label data-content="|Checkbox"/>', 'html');
		assertLanguageId('<label on="|Checkbox"/>', 'html');
	});

	test('Script content', function (): any {
		assertEmbeddedLanguageContent('<html><script>var i = 0;</script></html>', 'javascript', '              var i = 0;                ');
		assertEmbeddedLanguageContent('<script type="text/javascript">var i = 0;</script>', 'javascript', '                               var i = 0;         ');
		assertEmbeddedLanguageContent('<script><!--this comment should not give error--></script>', 'javascript', '        /* this comment should not give error */         ');
		assertEmbeddedLanguageContent('<script><!--this comment should not give error--> console.log("logging");</script>', 'javascript', '        /* this comment should not give error */ console.log("logging");         ');

		assertEmbeddedLanguageContent('<script>var data=100; <!--this comment should not give error--> </script>', 'javascript', '        var data=100; /* this comment should not give error */          ');
		assertEmbeddedLanguageContent('<div onKeyUp="foo()" onkeydown="bar()"/>', 'javascript', '              foo();            bar();  ');
		assertEmbeddedLanguageContent('<div onKeyUp="return"/>', 'javascript', '              return;  ');
		assertEmbeddedLanguageContent('<div onKeyUp=return\n/><script>foo();</script>', 'javascript', '             return;\n          foo();         ');
	});

	test('Script content - HTML escape characters', function (): any {
		assertEmbeddedLanguageContent('<div style="font-family: &quot;Arial&quot;"></div>', 'css', '         __{font-family: "     Arial     "}       ');
		assertEmbeddedLanguageContent('<div style="font-family: &#34;Arial&#34;"></div>', 'css', '         __{font-family: "    Arial    "}       ');
		assertEmbeddedLanguageContent('<div style="font-family: &quot;Arial&#34;"></div>', 'css', '         __{font-family: "     Arial    "}       ');
		assertEmbeddedLanguageContent('<div style="font-family:&quot; Arial &quot; "></div>', 'css', '         __{font-family:     " Arial      " }       ');
		assertEmbeddedLanguageContent('<div style="font-family: Arial"></div>', 'css', '         __{font-family: Arial}       ');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/folding.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/folding.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { getFoldingRanges } from '../modes/htmlFolding';
import { TextDocument, getLanguageModes } from '../modes/languageModes';
import { ClientCapabilities } from 'vscode-css-languageservice';
import { getNodeFileFS } from '../node/nodeFs';

interface ExpectedIndentRange {
	startLine: number;
	endLine: number;
	kind?: string;
}

async function assertRanges(lines: string[], expected: ExpectedIndentRange[], message?: string, nRanges?: number): Promise<void> {
	const document = TextDocument.create('test://foo/bar.html', 'html', 1, lines.join('\n'));
	const workspace = {
		settings: {},
		folders: [{ name: 'foo', uri: 'test://foo' }]
	};
	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());
	const actual = await getFoldingRanges(languageModes, document, nRanges, null);

	let actualRanges = [];
	for (let i = 0; i < actual.length; i++) {
		actualRanges[i] = r(actual[i].startLine, actual[i].endLine, actual[i].kind);
	}
	actualRanges = actualRanges.sort((r1, r2) => r1.startLine - r2.startLine);
	assert.deepStrictEqual(actualRanges, expected, message);
}

function r(startLine: number, endLine: number, kind?: string): ExpectedIndentRange {
	return { startLine, endLine, kind };
}

suite('HTML Folding', () => {

	test('Embedded JavaScript', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script>',
			/*3*/'function f() {',
			/*4*/'}',
			/*5*/'</script>',
			/*6*/'</head>',
			/*7*/'</html>',
		];
		await await assertRanges(input, [r(0, 6), r(1, 5), r(2, 4), r(3, 4)]);
	});

	test('Embedded JavaScript - multiple areas', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head>',
			/* 2*/'<script>',
			/* 3*/'  var x = {',
			/* 4*/'    foo: true,',
			/* 5*/'    bar: {}',
			/* 6*/'  };',
			/* 7*/'</script>',
			/* 8*/'<script>',
			/* 9*/'  test(() => { // hello',
			/*10*/'    f();',
			/*11*/'  });',
			/*12*/'</script>',
			/*13*/'</head>',
			/*14*/'</html>',
		];
		await assertRanges(input, [r(0, 13), r(1, 12), r(2, 6), r(3, 6), r(8, 11), r(9, 11), r(9, 11)]);
	});

	test('Embedded JavaScript - incomplete', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head>',
			/* 2*/'<script>',
			/* 3*/'  var x = {',
			/* 4*/'</script>',
			/* 5*/'<script>',
			/* 6*/'  });',
			/* 7*/'</script>',
			/* 8*/'</head>',
			/* 9*/'</html>',
		];
		await assertRanges(input, [r(0, 8), r(1, 7), r(2, 3), r(5, 6)]);
	});

	test('Embedded JavaScript - regions', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head>',
			/* 2*/'<script>',
			/* 3*/'  // #region Lalala',
			/* 4*/'   //  #region',
			/* 5*/'   x = 9;',
			/* 6*/'  //  #endregion',
			/* 7*/'  // #endregion Lalala',
			/* 8*/'</script>',
			/* 9*/'</head>',
			/*10*/'</html>',
		];
		await assertRanges(input, [r(0, 9), r(1, 8), r(2, 7), r(3, 7, 'region'), r(4, 6, 'region')]);
	});

	test('Embedded CSS', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head>',
			/* 2*/'<style>',
			/* 3*/'  foo {',
			/* 4*/'   display: block;',
			/* 5*/'   color: black;',
			/* 6*/'  }',
			/* 7*/'</style>',
			/* 8*/'</head>',
			/* 9*/'</html>',
		];
		await assertRanges(input, [r(0, 8), r(1, 7), r(2, 6), r(3, 5)]);
	});

	test('Embedded CSS - multiple areas', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head style="color:red">',
			/* 2*/'<style>',
			/* 3*/'  /*',
			/* 4*/'    foo: true,',
			/* 5*/'    bar: {}',
			/* 6*/'  */',
			/* 7*/'</style>',
			/* 8*/'<style>',
			/* 9*/'  @keyframes mymove {',
			/*10*/'    from {top: 0px;}',
			/*11*/'  }',
			/*12*/'</style>',
			/*13*/'</head>',
			/*14*/'</html>',
		];
		await assertRanges(input, [r(0, 13), r(1, 12), r(2, 6), r(3, 6, 'comment'), r(8, 11), r(9, 10)]);
	});

	test('Embedded CSS - regions', async () => {
		const input = [
			/* 0*/'<html>',
			/* 1*/'<head>',
			/* 2*/'<style>',
			/* 3*/'  /* #region Lalala */',
			/* 4*/'   /*  #region*/',
			/* 5*/'   x = 9;',
			/* 6*/'  /*  #endregion*/',
			/* 7*/'  /* #endregion Lalala*/',
			/* 8*/'</style>',
			/* 9*/'</head>',
			/*10*/'</html>',
		];
		await assertRanges(input, [r(0, 9), r(1, 8), r(2, 7), r(3, 7, 'region'), r(4, 6, 'region')]);
	});


	// test('Embedded JavaScript - multi line comment', async () => {
	// 	const input = [
	// 		/* 0*/'<html>',
	// 		/* 1*/'<head>',
	// 		/* 2*/'<script>',
	// 		/* 3*/'  /*',
	// 		/* 4*/'   * Hello',
	// 		/* 5*/'   */',
	// 		/* 6*/'</script>',
	// 		/* 7*/'</head>',
	// 		/* 8*/'</html>',
	// 	];
	// 	await assertRanges(input, [r(0, 7), r(1, 6), r(2, 5), r(3, 5, 'comment')]);
	// });

	test('Test limit', async () => {
		const input = [
			/* 0*/'<div>',
			/* 1*/' <span>',
			/* 2*/'  <b>',
			/* 3*/'  ',
			/* 4*/'  </b>,',
			/* 5*/'  <b>',
			/* 6*/'   <pre>',
			/* 7*/'  ',
			/* 8*/'   </pre>,',
			/* 9*/'   <pre>',
			/*10*/'  ',
			/*11*/'   </pre>,',
			/*12*/'  </b>,',
			/*13*/'  <b>',
			/*14*/'  ',
			/*15*/'  </b>,',
			/*16*/'  <b>',
			/*17*/'  ',
			/*18*/'  </b>',
			/*19*/' </span>',
			/*20*/'</div>',
		];
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(9, 10), r(13, 14), r(16, 17)], 'no limit', undefined);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(9, 10), r(13, 14), r(16, 17)], 'limit 8', 8);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(6, 7), r(13, 14), r(16, 17)], 'limit 7', 7);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(13, 14), r(16, 17)], 'limit 6', 6);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11), r(13, 14)], 'limit 5', 5);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3), r(5, 11)], 'limit 4', 4);
		await assertRanges(input, [r(0, 19), r(1, 18), r(2, 3)], 'limit 3', 3);
		await assertRanges(input, [r(0, 19), r(1, 18)], 'limit 2', 2);
		await assertRanges(input, [r(0, 19)], 'limit 1', 1);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/formatting.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/formatting.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as path from 'path';
import * as fs from 'fs';

import * as assert from 'assert';
import { getLanguageModes, TextDocument, Range, FormattingOptions, ClientCapabilities } from '../modes/languageModes';

import { format } from '../modes/formatting';
import { getNodeFileFS } from '../node/nodeFs';

suite('HTML Embedded Formatting', () => {

	async function assertFormat(value: string, expected: string, options?: any, formatOptions?: FormattingOptions, message?: string): Promise<void> {
		const workspace = {
			settings: options,
			folders: [{ name: 'foo', uri: 'test://foo' }]
		};
		const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());

		let rangeStartOffset = value.indexOf('|');
		let rangeEndOffset;
		if (rangeStartOffset !== -1) {
			value = value.substr(0, rangeStartOffset) + value.substr(rangeStartOffset + 1);

			rangeEndOffset = value.indexOf('|');
			value = value.substr(0, rangeEndOffset) + value.substr(rangeEndOffset + 1);
		} else {
			rangeStartOffset = 0;
			rangeEndOffset = value.length;
		}
		const document = TextDocument.create('test://test/test.html', 'html', 0, value);
		const range = Range.create(document.positionAt(rangeStartOffset), document.positionAt(rangeEndOffset));
		if (!formatOptions) {
			formatOptions = FormattingOptions.create(2, true);
		}

		const result = await format(languageModes, document, range, formatOptions, undefined, { css: true, javascript: true });

		const actual = TextDocument.applyEdits(document, result);
		assert.strictEqual(actual, expected, message);
	}

	async function assertFormatWithFixture(fixtureName: string, expectedPath: string, options?: any, formatOptions?: FormattingOptions): Promise<void> {
		const input = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'inputs', fixtureName)).toString().replace(/\r\n/mg, '\n');
		const expected = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'test', 'fixtures', 'expected', expectedPath)).toString().replace(/\r\n/mg, '\n');
		await assertFormat(input, expected, options, formatOptions, expectedPath);
	}

	test('HTML only', async () => {
		await assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');
		await assertFormat('|<html><body><p>Hello</p></body></html>|', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>');
		await assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>');
	});

	test('HTML & Scripts', async () => {
		await assertFormat('<html><head><script></script></head></html>', '<html>\n\n<head>\n  <script></script>\n</head>\n\n</html>');
		await assertFormat('<html><head><script>var x=1;</script></head></html>', '<html>\n\n<head>\n  <script>var x = 1;</script>\n</head>\n\n</html>');
		await assertFormat('<html><head><script>\nvar x=2;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 2;\n  </script>\n</head>\n\n</html>');
		await assertFormat('<html><head>\n  <script>\nvar x=3;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 3;\n  </script>\n</head>\n\n</html>');
		await assertFormat('<html><head>\n  <script>\nvar x=4;\nconsole.log("Hi");\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 4;\n    console.log("Hi");\n  </script>\n</head>\n\n</html>');
		await assertFormat('<html><head>\n  |<script>\nvar x=5;\n</script>|</head></html>', '<html><head>\n  <script>\n    var x = 5;\n  </script></head></html>');
	});

	test('HTLM & Scripts - Fixtures', async () => {
		assertFormatWithFixture('19813.html', '19813.html');
		assertFormatWithFixture('19813.html', '19813-4spaces.html', undefined, FormattingOptions.create(4, true));
		assertFormatWithFixture('19813.html', '19813-tab.html', undefined, FormattingOptions.create(1, false));
		assertFormatWithFixture('21634.html', '21634.html');
	});

	test('Script end tag', async () => {
		await assertFormat('<html>\n<head>\n  <script>\nvar x  =  0;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 0;\n  </script>\n</head>\n\n</html>');
	});

	test('HTML & Multiple Scripts', async () => {
		await assertFormat('<html><head>\n<script>\nif(x){\nbar(); }\n</script><script>\nfunction(x){    }\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    if (x) {\n      bar();\n    }\n  </script>\n  <script>\n    function(x) { }\n  </script>\n</head>\n\n</html>');
	});

	test('HTML & Styles', async () => {
		await assertFormat('<html><head>\n<style>\n.foo{display:none;}\n</style></head></html>', '<html>\n\n<head>\n  <style>\n    .foo {\n      display: none;\n    }\n  </style>\n</head>\n\n</html>');
	});

	test('EndWithNewline', async () => {
		const options: FormattingOptions = FormattingOptions.create(2, true);
		options.insertFinalNewline = true;

		await assertFormat('<html><body><p>Hello</p></body></html>', '<html>\n\n<body>\n  <p>Hello</p>\n</body>\n\n</html>\n', {}, options);
		await assertFormat('<html>|<body><p>Hello</p></body>|</html>', '<html><body>\n  <p>Hello</p>\n</body></html>', {}, options);
		await assertFormat('<html>|<body><p>Hello</p></body></html>|', '<html><body>\n  <p>Hello</p>\n</body>\n\n</html>\n', {}, options);
		await assertFormat('<html><head><script>\nvar x=1;\n</script></head></html>', '<html>\n\n<head>\n  <script>\n    var x = 1;\n  </script>\n</head>\n\n</html>\n', {}, options);
	});

	test('Inside script', async () => {
		await assertFormat('<html><head>\n  <script>\n|var x=6;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n</script></head></html>');
		await assertFormat('<html><head>\n  <script>\n|var x=6;\nvar y=  9;|\n</script></head></html>', '<html><head>\n  <script>\n  var x = 6;\n  var y = 9;\n</script></head></html>');
	});

	test('Range after new line', async () => {
		await assertFormat('<html><head>\n  |<script>\nvar x=6;\n</script>\n|</head></html>', '<html><head>\n  <script>\n    var x = 6;\n  </script>\n</head></html>');
	});

	test('bug 36574', async () => {
		await assertFormat('<script src="/js/main.js"> </script>', '<script src="/js/main.js"> </script>');
	});

	test('bug 48049', async () => {
		await assertFormat(
			[
				'<html>',
				'<head>',
				'</head>',
				'',
				'<body>',
				'',
				'    <script>',
				'        function f(x) { }',
				'        f(function () {',
				'        // ',
				'',
				'        console.log(" vsc crashes on formatting")',
				'        });',
				'    </script>',
				'',
				'',
				'',
				'        </body>',
				'',
				'</html>'
			].join('\n'),
			[
				'<html>',
				'',
				'<head>',
				'</head>',
				'',
				'<body>',
				'',
				'  <script>',
				'    function f(x) { }',
				'    f(function () {',
				'      // ',
				'',
				'      console.log(" vsc crashes on formatting")',
				'    });',
				'  </script>',
				'',
				'',
				'',
				'</body>',
				'',
				'</html>'
			].join('\n')
		);
	});
	test('#58435', async () => {
		const options = {
			html: {
				format: {
					contentUnformatted: 'textarea'
				}
			}
		};

		const content = [
			'<html>',
			'',
			'<body>',
			'  <textarea name= "" id ="" cols="30" rows="10">',
			'  </textarea>',
			'</body>',
			'',
			'</html>',
		].join('\n');

		const expected = [
			'<html>',
			'',
			'<body>',
			'  <textarea name="" id="" cols="30" rows="10">',
			'  </textarea>',
			'</body>',
			'',
			'</html>',
		].join('\n');

		await assertFormat(content, expected, options);
	});

}); /*
content_unformatted: Array(4)["pre", "code", "textarea", …]
end_with_newline: false
eol: "\n"
extra_liners: Array(3)["head", "body", "/html"]
indent_char: "\t"
indent_handlebars: false
indent_inner_html: false
indent_size: 1
max_preserve_newlines: 32786
preserve_newlines: true
unformatted: Array(1)["wbr"]
wrap_attributes: "auto"
wrap_attributes_indent_size: undefined
wrap_line_length: 120*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/rename.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/rename.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { WorkspaceEdit, TextDocument, getLanguageModes, ClientCapabilities } from '../modes/languageModes';
import { getNodeFileFS } from '../node/nodeFs';


async function testRename(value: string, newName: string, expectedDocContent: string): Promise<void> {
	const offset = value.indexOf('|');
	value = value.substr(0, offset) + value.substr(offset + 1);

	const document = TextDocument.create('test://test/test.html', 'html', 0, value);
	const workspace = {
		settings: {},
		folders: [{ name: 'foo', uri: 'test://foo' }]
	};
	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());
	const javascriptMode = languageModes.getMode('javascript');
	const position = document.positionAt(offset);

	if (javascriptMode) {
		const workspaceEdit: WorkspaceEdit | null = await javascriptMode.doRename!(document, position, newName);

		if (!workspaceEdit || !workspaceEdit.changes) {
			assert.fail('No workspace edits');
		}

		const edits = workspaceEdit.changes[document.uri.toString()];
		if (!edits) {
			assert.fail(`No edits for file at ${document.uri.toString()}`);
		}

		const newDocContent = TextDocument.applyEdits(document, edits);
		assert.strictEqual(newDocContent, expectedDocContent, `Expected: ${expectedDocContent}\nActual: ${newDocContent}`);
	} else {
		assert.fail('should have javascriptMode but no');
	}
}

async function testNoRename(value: string, newName: string): Promise<void> {
	const offset = value.indexOf('|');
	value = value.substr(0, offset) + value.substr(offset + 1);

	const document = TextDocument.create('test://test/test.html', 'html', 0, value);
	const workspace = {
		settings: {},
		folders: [{ name: 'foo', uri: 'test://foo' }]
	};
	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());
	const javascriptMode = languageModes.getMode('javascript');
	const position = document.positionAt(offset);

	if (javascriptMode) {
		const workspaceEdit: WorkspaceEdit | null = await javascriptMode.doRename!(document, position, newName);

		assert.ok(workspaceEdit?.changes === undefined, 'Should not rename but rename happened');
	} else {
		assert.fail('should have javascriptMode but no');
	}
}

suite('HTML Javascript Rename', () => {
	test('Rename Variable', async () => {
		const input = [
			'<html>',
			'<head>',
			'<script>',
			'const |a = 2;',
			'const b = a + 2',
			'</script>',
			'</head>',
			'</html>'
		];

		const output = [
			'<html>',
			'<head>',
			'<script>',
			'const h = 2;',
			'const b = h + 2',
			'</script>',
			'</head>',
			'</html>'
		];

		await testRename(input.join('\n'), 'h', output.join('\n'));
	});

	test('Rename Function', async () => {
		const input = [
			'<html>',
			'<head>',
			'<script>',
			`const name = 'cjg';`,
			'function |sayHello(name) {',
			`console.log('hello', name)`,
			'}',
			'sayHello(name)',
			'</script>',
			'</head>',
			'</html>'
		];

		const output = [
			'<html>',
			'<head>',
			'<script>',
			`const name = 'cjg';`,
			'function sayName(name) {',
			`console.log('hello', name)`,
			'}',
			'sayName(name)',
			'</script>',
			'</head>',
			'</html>'
		];

		await testRename(input.join('\n'), 'sayName', output.join('\n'));
	});

	test('Rename Function Params', async () => {
		const input = [
			'<html>',
			'<head>',
			'<script>',
			`const name = 'cjg';`,
			'function sayHello(|name) {',
			`console.log('hello', name)`,
			'}',
			'sayHello(name)',
			'</script>',
			'</head>',
			'</html>'
		];

		const output = [
			'<html>',
			'<head>',
			'<script>',
			`const name = 'cjg';`,
			'function sayHello(newName) {',
			`console.log('hello', newName)`,
			'}',
			'sayHello(name)',
			'</script>',
			'</head>',
			'</html>'
		];

		await testRename(input.join('\n'), 'newName', output.join('\n'));
	});

	test('Rename Class', async () => {
		const input = [
			'<html>',
			'<head>',
			'<script>',
			`class |Foo {}`,
			`const foo = new Foo()`,
			'</script>',
			'</head>',
			'</html>'
		];

		const output = [
			'<html>',
			'<head>',
			'<script>',
			`class Bar {}`,
			`const foo = new Bar()`,
			'</script>',
			'</head>',
			'</html>'
		];

		await testRename(input.join('\n'), 'Bar', output.join('\n'));
	});

	test('Cannot Rename literal', async () => {
		const stringLiteralInput = [
			'<html>',
			'<head>',
			'<script>',
			`const name = |'cjg';`,
			'</script>',
			'</head>',
			'</html>'
		];
		const numberLiteralInput = [
			'<html>',
			'<head>',
			'<script>',
			`const num = |2;`,
			'</script>',
			'</head>',
			'</html>'
		];

		await testNoRename(stringLiteralInput.join('\n'), 'something');
		await testNoRename(numberLiteralInput.join('\n'), 'hhhh');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/selectionRanges.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/selectionRanges.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { getLanguageModes, ClientCapabilities, TextDocument, SelectionRange } from '../modes/languageModes';
import { getSelectionRanges } from '../modes/selectionRanges';
import { getNodeFileFS } from '../node/nodeFs';

async function assertRanges(content: string, expected: (number | string)[][]): Promise<void> {
	let message = `${content} gives selection range:\n`;

	const offset = content.indexOf('|');
	content = content.substr(0, offset) + content.substr(offset + 1);

	const workspace = {
		settings: {},
		folders: [{ name: 'foo', uri: 'test://foo' }]
	};
	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());

	const document = TextDocument.create('test://foo.html', 'html', 1, content);
	const actualRanges = await getSelectionRanges(languageModes, document, [document.positionAt(offset)]);
	assert.strictEqual(actualRanges.length, 1);
	const offsetPairs: [number, string][] = [];
	let curr: SelectionRange | undefined = actualRanges[0];
	while (curr) {
		offsetPairs.push([document.offsetAt(curr.range.start), document.getText(curr.range)]);
		curr = curr.parent;
	}

	message += `${JSON.stringify(offsetPairs)}\n but should give:\n${JSON.stringify(expected)}\n`;
	assert.deepStrictEqual(offsetPairs, expected, message);
}

suite('HTML SelectionRange', () => {
	test('Embedded JavaScript', async () => {
		await assertRanges('<html><head><script>  function foo() { return ((1|+2)*6) }</script></head></html>', [
			[48, '1'],
			[48, '1+2'],
			[47, '(1+2)'],
			[47, '(1+2)*6'],
			[46, '((1+2)*6)'],
			[39, 'return ((1+2)*6)'],
			[22, 'function foo() { return ((1+2)*6) }'],
			[20, '  function foo() { return ((1+2)*6) }'],
			[12, '<script>  function foo() { return ((1+2)*6) }</script>'],
			[6, '<head><script>  function foo() { return ((1+2)*6) }</script></head>'],
			[0, '<html><head><script>  function foo() { return ((1+2)*6) }</script></head></html>'],
		]);
	});

	test('Embedded CSS', async () => {
		await assertRanges('<html><head><style>foo { display: |none; } </style></head></html>', [
			[34, 'none'],
			[25, 'display: none'],
			[24, ' display: none; '],
			[23, '{ display: none; }'],
			[19, 'foo { display: none; }'],
			[19, 'foo { display: none; } '],
			[12, '<style>foo { display: none; } </style>'],
			[6, '<head><style>foo { display: none; } </style></head>'],
			[0, '<html><head><style>foo { display: none; } </style></head></html>'],
		]);
	});

	test('Embedded style', async () => {
		await assertRanges('<div style="color: |red"></div>', [
			[19, 'red'],
			[12, 'color: red'],
			[11, '"color: red"'],
			[5, 'style="color: red"'],
			[1, 'div style="color: red"'],
			[0, '<div style="color: red"></div>']
		]);
	});


});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/semanticTokens.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/semanticTokens.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as assert from 'assert';
import { TextDocument, getLanguageModes, ClientCapabilities, Range, Position } from '../modes/languageModes';
import { newSemanticTokenProvider } from '../modes/semanticTokens';
import { getNodeFileFS } from '../node/nodeFs';

interface ExpectedToken {
	startLine: number;
	character: number;
	length: number;
	tokenClassifiction: string;
}

async function assertTokens(lines: string[], expected: ExpectedToken[], ranges?: Range[], message?: string): Promise<void> {
	const document = TextDocument.create('test://foo/bar.html', 'html', 1, lines.join('\n'));
	const workspace = {
		settings: {},
		folders: [{ name: 'foo', uri: 'test://foo' }]
	};
	const languageModes = getLanguageModes({ css: true, javascript: true }, workspace, ClientCapabilities.LATEST, getNodeFileFS());
	const semanticTokensProvider = newSemanticTokenProvider(languageModes);

	const legend = semanticTokensProvider.legend;
	const actual = await semanticTokensProvider.getSemanticTokens(document, ranges);

	const actualRanges = [];
	let lastLine = 0;
	let lastCharacter = 0;
	for (let i = 0; i < actual.length; i += 5) {
		const lineDelta = actual[i], charDelta = actual[i + 1], len = actual[i + 2], typeIdx = actual[i + 3], modSet = actual[i + 4];
		const line = lastLine + lineDelta;
		const character = lineDelta === 0 ? lastCharacter + charDelta : charDelta;
		const tokenClassifiction = [legend.types[typeIdx], ...legend.modifiers.filter((_, i) => modSet & 1 << i)].join('.');
		actualRanges.push(t(line, character, len, tokenClassifiction));
		lastLine = line;
		lastCharacter = character;
	}
	assert.deepStrictEqual(actualRanges, expected, message);
}

function t(startLine: number, character: number, length: number, tokenClassifiction: string): ExpectedToken {
	return { startLine, character, length, tokenClassifiction };
}

suite('HTML Semantic Tokens', () => {

	test('Variables', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script>',
			/*3*/'  var x = 9, y1 = [x];',
			/*4*/'  try {',
			/*5*/'    for (const s of y1) { x = s }',
			/*6*/'  } catch (e) {',
			/*7*/'    throw y1;',
			/*8*/'  }',
			/*9*/'</script>',
			/*10*/'</head>',
			/*11*/'</html>',
		];
		await assertTokens(input, [
			t(3, 6, 1, 'variable.declaration'), t(3, 13, 2, 'variable.declaration'), t(3, 19, 1, 'variable'),
			t(5, 15, 1, 'variable.declaration.readonly.local'), t(5, 20, 2, 'variable'), t(5, 26, 1, 'variable'), t(5, 30, 1, 'variable.readonly.local'),
			t(6, 11, 1, 'variable.declaration.local'),
			t(7, 10, 2, 'variable')
		]);
	});

	test('Functions', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script>',
			/*3*/'  function foo(p1) {',
			/*4*/'    return foo(Math.abs(p1))',
			/*5*/'  }',
			/*6*/'  `/${window.location}`.split("/").forEach(s => foo(s));',
			/*7*/'</script>',
			/*8*/'</head>',
			/*9*/'</html>',
		];
		await assertTokens(input, [
			t(3, 11, 3, 'function.declaration'), t(3, 15, 2, 'parameter.declaration'),
			t(4, 11, 3, 'function'), t(4, 15, 4, 'variable.defaultLibrary'), t(4, 20, 3, 'method.defaultLibrary'), t(4, 24, 2, 'parameter'),
			t(6, 6, 6, 'variable.defaultLibrary'), t(6, 13, 8, 'property.defaultLibrary'), t(6, 24, 5, 'method.defaultLibrary'), t(6, 35, 7, 'method.defaultLibrary'), t(6, 43, 1, 'parameter.declaration'), t(6, 48, 3, 'function'), t(6, 52, 1, 'parameter')
		]);
	});

	test('Members', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script>',
			/*3*/'  class A {',
			/*4*/'    static x = 9;',
			/*5*/'    f = 9;',
			/*6*/'    async m() { return A.x + await this.m(); };',
			/*7*/'    get s() { return this.f; ',
			/*8*/'    static t() { return new A().f; };',
			/*9*/'    constructor() {}',
			/*10*/'  }',
			/*11*/'</script>',
			/*12*/'</head>',
			/*13*/'</html>',
		];


		await assertTokens(input, [
			t(3, 8, 1, 'class.declaration'),
			t(4, 11, 1, 'property.declaration.static'),
			t(5, 4, 1, 'property.declaration'),
			t(6, 10, 1, 'method.declaration.async'), t(6, 23, 1, 'class'), t(6, 25, 1, 'property.static'), t(6, 40, 1, 'method.async'),
			t(7, 8, 1, 'property.declaration'), t(7, 26, 1, 'property'),
			t(8, 11, 1, 'method.declaration.static'), t(8, 28, 1, 'class'), t(8, 32, 1, 'property'),
		]);
	});

	test('Interfaces', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script type="text/typescript">',
			/*3*/'  interface Position { x: number, y: number };',
			/*4*/'  const p = { x: 1, y: 2 } as Position;',
			/*5*/'  const foo = (o: Position) => o.x + o.y;',
			/*6*/'</script>',
			/*7*/'</head>',
			/*8*/'</html>',
		];
		await assertTokens(input, [
			t(3, 12, 8, 'interface.declaration'), t(3, 23, 1, 'property.declaration'), t(3, 34, 1, 'property.declaration'),
			t(4, 8, 1, 'variable.declaration.readonly'), t(4, 14, 1, 'property.declaration'), t(4, 20, 1, 'property.declaration'), t(4, 30, 8, 'interface'),
			t(5, 8, 3, 'function.declaration.readonly'), t(5, 15, 1, 'parameter.declaration'), t(5, 18, 8, 'interface'), t(5, 31, 1, 'parameter'), t(5, 33, 1, 'property'), t(5, 37, 1, 'parameter'), t(5, 39, 1, 'property')
		]);
	});

	test('Readonly', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script type="text/typescript">',
			/*3*/'  const f = 9;',
			/*4*/'  class A { static readonly t = 9; static url: URL; }',
			/*5*/'  const enum E { A = 9, B = A + 1 }',
			/*6*/'  console.log(f + A.t + A.url.origin);',
			/*7*/'</script>',
			/*8*/'</head>',
			/*9*/'</html>',
		];
		await assertTokens(input, [
			t(3, 8, 1, 'variable.declaration.readonly'),
			t(4, 8, 1, 'class.declaration'), t(4, 28, 1, 'property.declaration.static.readonly'), t(4, 42, 3, 'property.declaration.static'), t(4, 47, 3, 'interface.defaultLibrary'),
			t(5, 13, 1, 'enum.declaration'), t(5, 17, 1, 'enumMember.declaration.readonly'), t(5, 24, 1, 'enumMember.declaration.readonly'), t(5, 28, 1, 'enumMember.readonly'),
			t(6, 2, 7, 'variable.defaultLibrary'), t(6, 10, 3, 'method.defaultLibrary'), t(6, 14, 1, 'variable.readonly'), t(6, 18, 1, 'class'), t(6, 20, 1, 'property.static.readonly'), t(6, 24, 1, 'class'), t(6, 26, 3, 'property.static'), t(6, 30, 6, 'property.readonly.defaultLibrary'),
		]);
	});


	test('Type aliases and type parameters', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script type="text/typescript">',
			/*3*/'  type MyMap = Map<string, number>;',
			/*4*/'  function f<T extends MyMap>(t: T | number) : T { ',
			/*5*/'    return <T> <unknown> new Map<string, MyMap>();',
			/*6*/'  }',
			/*7*/'</script>',
			/*8*/'</head>',
			/*9*/'</html>',
		];
		await assertTokens(input, [
			t(3, 7, 5, 'type.declaration'), t(3, 15, 3, 'interface.defaultLibrary') /* to investiagte */,
			t(4, 11, 1, 'function.declaration'), t(4, 13, 1, 'typeParameter.declaration'), t(4, 23, 5, 'type'), t(4, 30, 1, 'parameter.declaration'), t(4, 33, 1, 'typeParameter'), t(4, 47, 1, 'typeParameter'),
			t(5, 12, 1, 'typeParameter'), t(5, 29, 3, 'class.defaultLibrary'), t(5, 41, 5, 'type'),
		]);
	});

	test('TS and JS', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script type="text/typescript">',
			/*3*/'  function f<T>(p1: T): T[] { return [ p1 ]; }',
			/*4*/'</script>',
			/*5*/'<script>',
			/*6*/'  window.alert("Hello");',
			/*7*/'</script>',
			/*8*/'</head>',
			/*9*/'</html>',
		];
		await assertTokens(input, [
			t(3, 11, 1, 'function.declaration'), t(3, 13, 1, 'typeParameter.declaration'), t(3, 16, 2, 'parameter.declaration'), t(3, 20, 1, 'typeParameter'), t(3, 24, 1, 'typeParameter'), t(3, 39, 2, 'parameter'),
			t(6, 2, 6, 'variable.defaultLibrary'), t(6, 9, 5, 'method.defaultLibrary')
		]);
	});

	test('Ranges', async () => {
		const input = [
			/*0*/'<html>',
			/*1*/'<head>',
			/*2*/'<script>',
			/*3*/'  window.alert("Hello");',
			/*4*/'</script>',
			/*5*/'<script>',
			/*6*/'  window.alert("World");',
			/*7*/'</script>',
			/*8*/'</head>',
			/*9*/'</html>',
		];
		await assertTokens(input, [
			t(3, 2, 6, 'variable.defaultLibrary'), t(3, 9, 5, 'method.defaultLibrary')
		], [Range.create(Position.create(2, 0), Position.create(4, 0))]);

		await assertTokens(input, [
			t(6, 2, 6, 'variable.defaultLibrary'),
		], [Range.create(Position.create(6, 2), Position.create(6, 8))]);
	});


});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/words.test.ts]---
Location: vscode-main/extensions/html-language-features/server/src/test/words.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as words from '../utils/strings';
import * as fs from 'fs';
import * as path from 'path';

suite('HTML Language Configuration', () => {
	const config = JSON.parse((fs.readFileSync(path.join(__dirname, '../../../../html/language-configuration.json')).toString()));

	function createRegex(str: string | { pattern: string; flags: string }): RegExp {
		if (typeof str === 'string') {
			return new RegExp(str, 'g');
		}
		return new RegExp(str.pattern, str.flags);
	}

	const wordRegex = createRegex(config.wordPattern);

	function assertWord(value: string, expected: string): void {
		const offset = value.indexOf('|');
		value = value.substr(0, offset) + value.substring(offset + 1);

		const actualRange = words.getWordAtText(value, offset, wordRegex);
		assert.ok(actualRange.start <= offset);
		assert.ok(actualRange.start + actualRange.length >= offset);
		assert.strictEqual(value.substr(actualRange.start, actualRange.length), expected);
	}

	test('Words Basic', function (): any {
		assertWord('|var x1 = new F<A>(a, b);', 'var');
		assertWord('v|ar x1 = new F<A>(a, b);', 'var');
		assertWord('var| x1 = new F<A>(a, b);', 'var');
		assertWord('var |x1 = new F<A>(a, b);', 'x1');
		assertWord('var x1| = new F<A>(a, b);', 'x1');
		assertWord('var x1 = new |F<A>(a, b);', 'F');
		assertWord('var x1 = new F<|A>(a, b);', 'A');
		assertWord('var x1 = new F<A>(|a, b);', 'a');
		assertWord('var x1 = new F<A>(a, b|);', 'b');
		assertWord('var x1 = new F<A>(a, b)|;', '');
		assertWord('var x1 = new F<A>(a, b)|;|', '');
		assertWord('var x1 = |  new F<A>(a, b)|;|', '');
	});

	test('Words Multiline', function (): any {
		assertWord('console.log("hello");\n|var x1 = new F<A>(a, b);', 'var');
		assertWord('console.log("hello");\n|\nvar x1 = new F<A>(a, b);', '');
		assertWord('console.log("hello");\n\r |var x1 = new F<A>(a, b);', 'var');
	});

	const onEnterBeforeRules: RegExp[] = config.onEnterRules.map((r: any) => createRegex(r.beforeText));

	function assertBeforeRule(text: string, expectedMatch: boolean): void {
		for (const reg of onEnterBeforeRules) {
			const start = new Date().getTime();
			assert.strictEqual(reg.test(text), expectedMatch);
			const totalTime = new Date().getTime() - start;
			assert.ok(totalTime < 200, `Evaluation of ${reg.source} on ${text} took ${totalTime}ms]`);
		}
	}

	test('OnEnter Before', function (): any {
		assertBeforeRule('<button attr1=val1 attr2=val2', false);
		assertBeforeRule('<button attr1=val1 attr2=val2>', true);
		assertBeforeRule('<button attr1=\'val1\' attr2="val2">', true);
		assertBeforeRule('<button attr1=val1 attr2=val2></button>', false);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/expected/19813-4spaces.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/expected/19813-4spaces.html

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <script>
        Polymer({
            is: "chat-messages",
            properties: {
                user: {},
                friend: {
                    observer: "_friendChanged"
                }
            },
        });
    </script>
</head>

<body>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/expected/19813-tab.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/expected/19813-tab.html

```html
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<script>
		Polymer({
			is: "chat-messages",
			properties: {
				user: {},
				friend: {
					observer: "_friendChanged"
				}
			},
		});
	</script>
</head>

<body>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/expected/19813.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/expected/19813.html

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <script>
    Polymer({
      is: "chat-messages",
      properties: {
        user: {},
        friend: {
          observer: "_friendChanged"
        }
      },
    });
  </script>
</head>

<body>
</body>

</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/expected/21634.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/expected/21634.html

```html
<app-route path="/module" element="page-module" bindRouter onUrlChange="updateModel"></app-route>

<script>
  Polymer({
  });
</script>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/inputs/19813.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/inputs/19813.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
<script>
    Polymer({
        is: "chat-messages",
        properties: {
             user: {},
            friend: {
                observer: "_friendChanged"
            }
        },
    });
</script>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/fixtures/inputs/21634.html]---
Location: vscode-main/extensions/html-language-features/server/src/test/fixtures/inputs/21634.html

```html
<app-route path="/module" element="page-module" bindRouter onUrlChange="updateModel"></app-route>

<script>
Polymer({
});
</script>
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/pathCompletionFixtures/.foo.js]---
Location: vscode-main/extensions/html-language-features/server/src/test/pathCompletionFixtures/.foo.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/pathCompletionFixtures/about/about.css]---
Location: vscode-main/extensions/html-language-features/server/src/test/pathCompletionFixtures/about/about.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/pathCompletionFixtures/about/media/icon.pic]---
Location: vscode-main/extensions/html-language-features/server/src/test/pathCompletionFixtures/about/media/icon.pic

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/pathCompletionFixtures/src/feature.js]---
Location: vscode-main/extensions/html-language-features/server/src/test/pathCompletionFixtures/src/feature.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/test/pathCompletionFixtures/src/test.js]---
Location: vscode-main/extensions/html-language-features/server/src/test/pathCompletionFixtures/src/test.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/arrays.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/arrays.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function pushAll<T>(to: T[], from: T[]) {
	if (from) {
		for (const e of from) {
			to.push(e);
		}
	}
}

export function contains<T>(arr: T[], val: T) {
	return arr.indexOf(val) !== -1;
}

/**
 * Like `Array#sort` but always stable. Usually runs a little slower `than Array#sort`
 * so only use this when actually needing stable sort.
 */
export function mergeSort<T>(data: T[], compare: (a: T, b: T) => number): T[] {
	_divideAndMerge(data, compare);
	return data;
}

function _divideAndMerge<T>(data: T[], compare: (a: T, b: T) => number): void {
	if (data.length <= 1) {
		// sorted
		return;
	}
	const p = (data.length / 2) | 0;
	const left = data.slice(0, p);
	const right = data.slice(p);

	_divideAndMerge(left, compare);
	_divideAndMerge(right, compare);

	let leftIdx = 0;
	let rightIdx = 0;
	let i = 0;
	while (leftIdx < left.length && rightIdx < right.length) {
		const ret = compare(left[leftIdx], right[rightIdx]);
		if (ret <= 0) {
			// smaller_equal -> take left to preserve order
			data[i++] = left[leftIdx++];
		} else {
			// greater -> take right
			data[i++] = right[rightIdx++];
		}
	}
	while (leftIdx < left.length) {
		data[i++] = left[leftIdx++];
	}
	while (rightIdx < right.length) {
		data[i++] = right[rightIdx++];
	}
}

export function binarySearch<T>(array: T[], key: T, comparator: (op1: T, op2: T) => number): number {
	let low = 0,
		high = array.length - 1;

	while (low <= high) {
		const mid = ((low + high) / 2) | 0;
		const comp = comparator(array[mid], key);
		if (comp < 0) {
			low = mid + 1;
		} else if (comp > 0) {
			high = mid - 1;
		} else {
			return mid;
		}
	}
	return -(low + 1);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/documentContext.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/documentContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DocumentContext } from 'vscode-css-languageservice';
import { endsWith, startsWith } from '../utils/strings';
import { WorkspaceFolder } from 'vscode-languageserver';
import { URI, Utils } from 'vscode-uri';

export function getDocumentContext(documentUri: string, workspaceFolders: WorkspaceFolder[]): DocumentContext {
	function getRootFolder(): string | undefined {
		for (const folder of workspaceFolders) {
			let folderURI = folder.uri;
			if (!endsWith(folderURI, '/')) {
				folderURI = folderURI + '/';
			}
			if (startsWith(documentUri, folderURI)) {
				return folderURI;
			}
		}
		return undefined;
	}

	return {
		resolveReference: (ref: string, base = documentUri) => {
			if (ref.match(/^\w[\w\d+.-]*:/)) {
				// starts with a schema
				return ref;
			}
			if (ref[0] === '/') { // resolve absolute path against the current workspace folder
				const folderUri = getRootFolder();
				if (folderUri) {
					return folderUri + ref.substr(1);
				}
			}
			const baseUri = URI.parse(base);
			const baseUriDir = baseUri.path.endsWith('/') ? baseUri : Utils.dirname(baseUri);
			return Utils.resolvePath(baseUriDir, ref).toString(true);
		},
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/positions.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/positions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Position, Range } from '../modes/languageModes';

export function beforeOrSame(p1: Position, p2: Position) {
	return p1.line < p2.line || p1.line === p2.line && p1.character <= p2.character;
}
export function insideRangeButNotSame(r1: Range, r2: Range) {
	return beforeOrSame(r1.start, r2.start) && beforeOrSame(r2.end, r1.end) && !equalRange(r1, r2);
}
export function equalRange(r1: Range, r2: Range) {
	return r1.start.line === r2.start.line && r1.start.character === r2.start.character && r1.end.line === r2.end.line && r1.end.character === r2.end.character;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/runner.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/runner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResponseError, CancellationToken, LSPErrorCodes } from 'vscode-languageserver';
import { RuntimeEnvironment } from '../htmlServer';

export function formatError(message: string, err: any): string {
	if (err instanceof Error) {
		const error = <Error>err;
		return `${message}: ${error.message}\n${error.stack}`;
	} else if (typeof err === 'string') {
		return `${message}: ${err}`;
	} else if (err) {
		return `${message}: ${err.toString()}`;
	}
	return message;
}

export function runSafe<T>(runtime: RuntimeEnvironment, func: () => Thenable<T>, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<any>> {
	return new Promise<T | ResponseError<any>>((resolve) => {
		runtime.timer.setImmediate(() => {
			if (token.isCancellationRequested) {
				resolve(cancelValue());
				return;
			}
			return func().then(result => {
				if (token.isCancellationRequested) {
					resolve(cancelValue());
					return;
				} else {
					resolve(result);
				}
			}, e => {
				console.error(formatError(errorMessage, e));
				resolve(errorVal);
			});
		});
	});
}



function cancelValue<E>() {
	return new ResponseError<E>(LSPErrorCodes.RequestCancelled, 'Request cancelled');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/strings.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/strings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getWordAtText(text: string, offset: number, wordDefinition: RegExp): { start: number; length: number } {
	let lineStart = offset;
	while (lineStart > 0 && !isNewlineCharacter(text.charCodeAt(lineStart - 1))) {
		lineStart--;
	}
	const offsetInLine = offset - lineStart;
	const lineText = text.substr(lineStart);

	// make a copy of the regex as to not keep the state
	const flags = wordDefinition.ignoreCase ? 'gi' : 'g';
	wordDefinition = new RegExp(wordDefinition.source, flags);

	let match = wordDefinition.exec(lineText);
	while (match && match.index + match[0].length < offsetInLine) {
		match = wordDefinition.exec(lineText);
	}
	if (match && match.index <= offsetInLine) {
		return { start: match.index + lineStart, length: match[0].length };
	}

	return { start: offset, length: 0 };
}

export function startsWith(haystack: string, needle: string): boolean {
	if (haystack.length < needle.length) {
		return false;
	}

	for (let i = 0; i < needle.length; i++) {
		if (haystack[i] !== needle[i]) {
			return false;
		}
	}

	return true;
}

export function endsWith(haystack: string, needle: string): boolean {
	const diff = haystack.length - needle.length;
	if (diff > 0) {
		return haystack.indexOf(needle, diff) === diff;
	} else if (diff === 0) {
		return haystack === needle;
	} else {
		return false;
	}
}

export function repeat(value: string, count: number) {
	let s = '';
	while (count > 0) {
		if ((count & 1) === 1) {
			s += value;
		}
		value += value;
		count = count >>> 1;
	}
	return s;
}

export function isWhitespaceOnly(str: string) {
	return /^\s*$/.test(str);
}

export function isEOL(content: string, offset: number) {
	return isNewlineCharacter(content.charCodeAt(offset));
}

const CR = '\r'.charCodeAt(0);
const NL = '\n'.charCodeAt(0);
export function isNewlineCharacter(charCode: number) {
	return charCode === CR || charCode === NL;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/src/utils/validation.ts]---
Location: vscode-main/extensions/html-language-features/server/src/utils/validation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, Connection, Diagnostic, Disposable, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportKind, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-html-languageservice';
import { formatError, runSafe } from './runner';
import { RuntimeEnvironment } from '../htmlServer';

export type Validator = (textDocument: TextDocument) => Promise<Diagnostic[]>;
export type DiagnosticsSupport = {
	dispose(): void;
	requestRefresh(): void;
};

export function registerDiagnosticsPushSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	const pendingValidationRequests: { [uri: string]: Disposable } = {};
	const validationDelayMs = 500;

	const disposables: Disposable[] = [];

	// The content of a text document has changed. This event is emitted
	// when the text document first opened or when its content has changed.
	documents.onDidChangeContent(change => {
		triggerValidation(change.document);
	}, undefined, disposables);

	// a document has closed: clear all diagnostics
	documents.onDidClose(event => {
		cleanPendingValidation(event.document);
		connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
	}, undefined, disposables);

	function cleanPendingValidation(textDocument: TextDocument): void {
		const request = pendingValidationRequests[textDocument.uri];
		if (request) {
			request.dispose();
			delete pendingValidationRequests[textDocument.uri];
		}
	}

	function triggerValidation(textDocument: TextDocument): void {
		cleanPendingValidation(textDocument);
		const request = pendingValidationRequests[textDocument.uri] = runtime.timer.setTimeout(async () => {
			if (request === pendingValidationRequests[textDocument.uri]) {
				try {
					const diagnostics = await validate(textDocument);
					if (request === pendingValidationRequests[textDocument.uri]) {
						connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
					}
					delete pendingValidationRequests[textDocument.uri];
				} catch (e) {
					connection.console.error(formatError(`Error while validating ${textDocument.uri}`, e));
				}
			}
		}, validationDelayMs);
	}

	return {
		requestRefresh: () => {
			documents.all().forEach(triggerValidation);
		},
		dispose: () => {
			disposables.forEach(d => d.dispose());
			disposables.length = 0;
			const keys = Object.keys(pendingValidationRequests);
			for (const key of keys) {
				pendingValidationRequests[key].dispose();
				delete pendingValidationRequests[key];
			}
		}
	};
}

export function registerDiagnosticsPullSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	function newDocumentDiagnosticReport(diagnostics: Diagnostic[]): DocumentDiagnosticReport {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: diagnostics
		};
	}

	const registration = connection.languages.diagnostics.on(async (params: DocumentDiagnosticParams, token: CancellationToken) => {
		return runSafe(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				return newDocumentDiagnosticReport(await validate(document));
			}
			return newDocumentDiagnosticReport([]);

		}, newDocumentDiagnosticReport([]), `Error while computing diagnostics for ${params.textDocument.uri}`, token);
	});

	function requestRefresh(): void {
		connection.languages.diagnostics.refresh();
	}

	return {
		requestRefresh,
		dispose: () => {
			registration.dispose();
		}
	};

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/html-language-features/server/test/index.js]---
Location: vscode-main/extensions/html-language-features/server/test/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const Mocha = require('mocha');
const glob = require('glob');

const suite = 'Integration HTML Extension Tests';

const options = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

const mocha = new Mocha(options);

glob.sync(__dirname + '/../out/test/**/*.test.js')
	.forEach(file => mocha.addFile(file));

mocha.run(failures => process.exit(failures ? -1 : 0));
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/.vscodeignore]---
Location: vscode-main/extensions/ini/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/cgmanifest.json]---
Location: vscode-main/extensions/ini/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/ini.tmbundle",
					"repositoryUrl": "https://github.com/textmate/ini.tmbundle",
					"commitHash": "2af0cbb0704940f967152616f2f1ff0aae6287a6"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-ini.tmbundle project authors",
				"",
				"If not otherwise specified (see below), files in this folder fall under the following license: ",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information, ",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added ",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example ",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/ini.language-configuration.json]---
Location: vscode-main/extensions/ini/ini.language-configuration.json

```json
{
	"comments": {
		"lineComment": ";",
		"blockComment": [ ";", " " ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "'", "close": "'", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/package.json]---
Location: vscode-main/extensions/ini/package.json

```json
{
  "name": "ini",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "private": true,
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin textmate/ini.tmbundle Syntaxes/Ini.plist ./syntaxes/ini.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "ini",
        "extensions": [
          ".ini"
        ],
        "aliases": [
          "Ini",
          "ini"
        ],
        "configuration": "./ini.language-configuration.json"
      },
      {
        "id": "properties",
        "extensions": [
          ".conf",
          ".properties",
          ".cfg",
          ".directory",
          ".gitattributes",
          ".gitconfig",
          ".gitmodules",
          ".editorconfig",
          ".repo"
        ],
        "filenames": [
          "gitconfig"
        ],
        "filenamePatterns": [
          "**/.config/git/config",
          "**/.git/config"
        ],
        "aliases": [
          "Properties",
          "properties"
        ],
        "configuration": "./properties.language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "ini",
        "scopeName": "source.ini",
        "path": "./syntaxes/ini.tmLanguage.json"
      },
      {
        "language": "properties",
        "scopeName": "source.ini",
        "path": "./syntaxes/ini.tmLanguage.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/package.nls.json]---
Location: vscode-main/extensions/ini/package.nls.json

```json
{
	"displayName": "Ini Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Ini files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/properties.language-configuration.json]---
Location: vscode-main/extensions/ini/properties.language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "#", " " ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		{ "open": "\"", "close": "\"", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ini/syntaxes/ini.tmLanguage.json]---
Location: vscode-main/extensions/ini/syntaxes/ini.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/ini.tmbundle/blob/master/Syntaxes/Ini.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/ini.tmbundle/commit/2af0cbb0704940f967152616f2f1ff0aae6287a6",
	"name": "Ini",
	"scopeName": "source.ini",
	"patterns": [
		{
			"begin": "(^[ \\t]+)?(?=#)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.ini"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": "#",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.ini"
						}
					},
					"end": "\\n",
					"name": "comment.line.number-sign.ini"
				}
			]
		},
		{
			"begin": "(^[ \\t]+)?(?=;)",
			"beginCaptures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.ini"
				}
			},
			"end": "(?!\\G)",
			"patterns": [
				{
					"begin": ";",
					"beginCaptures": {
						"0": {
							"name": "punctuation.definition.comment.ini"
						}
					},
					"end": "\\n",
					"name": "comment.line.semicolon.ini"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "keyword.other.definition.ini"
				},
				"2": {
					"name": "punctuation.separator.key-value.ini"
				}
			},
			"match": "\\b([a-zA-Z0-9_.-]+)\\b\\s*(=)"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.entity.ini"
				},
				"3": {
					"name": "punctuation.definition.entity.ini"
				}
			},
			"match": "^(\\[)(.*?)(\\])",
			"name": "entity.name.section.group-title.ini"
		},
		{
			"begin": "'",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ini"
				}
			},
			"end": "'",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ini"
				}
			},
			"name": "string.quoted.single.ini",
			"patterns": [
				{
					"match": "\\\\.",
					"name": "constant.character.escape.ini"
				}
			]
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"0": {
					"name": "punctuation.definition.string.begin.ini"
				}
			},
			"end": "\"",
			"endCaptures": {
				"0": {
					"name": "punctuation.definition.string.end.ini"
				}
			},
			"name": "string.quoted.double.ini"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/.gitignore]---
Location: vscode-main/extensions/ipynb/.gitignore

```text
out
dist
node_modules
*.vsix
notebook-out
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/.npmrc]---
Location: vscode-main/extensions/ipynb/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/.vscodeignore]---
Location: vscode-main/extensions/ipynb/.vscodeignore

```text
.vscode/**
src/**
notebook-src/**
out/**
tsconfig.json
extension.webpack.config.js
extension-browser.webpack.config.js
package-lock.json
.gitignore
esbuild.*
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/esbuild.mjs]---
Location: vscode-main/extensions/ipynb/esbuild.mjs

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'node:path';
import { run } from '../esbuild-webview-common.mjs';

const srcDir = path.join(import.meta.dirname, 'notebook-src');
const outDir = path.join(import.meta.dirname, 'notebook-out');

run({
	entryPoints: [
		path.join(srcDir, 'cellAttachmentRenderer.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/ipynb/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';
import path from 'path';

const mainConfig = withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/ipynbMain.browser.ts'
	},
	output: {
		filename: 'ipynbMain.browser.js',
		path: path.join(import.meta.dirname, 'dist', 'browser')
	}
});


const workerConfig = withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		notebookSerializerWorker: './src/notebookSerializerWorker.web.ts',
	},
	output: {
		filename: 'notebookSerializerWorker.js',
		path: path.join(import.meta.dirname, 'dist', 'browser'),
		libraryTarget: 'var',
		library: 'serverExportVar'
	},
});

export default [mainConfig, workerConfig];
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/extension.webpack.config.js]---
Location: vscode-main/extensions/ipynb/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults, { nodePlugins } from '../shared.webpack.config.mjs';
import path from 'path';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		['ipynbMain.node']: './src/ipynbMain.node.ts',
		notebookSerializerWorker: './src/notebookSerializerWorker.ts',
	},
	output: {
		path: path.resolve(import.meta.dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		...nodePlugins(import.meta.dirname), // add plugins, don't replace inherited
	]
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/package-lock.json]---
Location: vscode-main/extensions/ipynb/package-lock.json

```json
{
  "name": "ipynb",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "ipynb",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@enonic/fnv-plus": "^1.3.0",
        "detect-indent": "^6.0.0"
      },
      "devDependencies": {
        "@jupyterlab/nbformat": "^3.2.9",
        "@types/markdown-it": "12.2.3",
        "@types/node": "^22.18.10"
      },
      "engines": {
        "vscode": "^1.57.0"
      }
    },
    "node_modules/@enonic/fnv-plus": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/@enonic/fnv-plus/-/fnv-plus-1.3.0.tgz",
      "integrity": "sha512-BCN9uNWH8AmiP7BXBJqEinUY9KXalmRzo+L0cB/mQsmFfzODxwQrbvxCHXUNH2iP+qKkWYtB4vyy8N62PViMFw=="
    },
    "node_modules/@jupyterlab/nbformat": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/@jupyterlab/nbformat/-/nbformat-3.4.3.tgz",
      "integrity": "sha512-i/yADrwhhAJJCUOTa+fEBMyJO7fvX9Y73I0B7V6dQhGcrmrEKLC3wk4yOo63+jRntd5+dupbiOtz3w1ncIXwIA==",
      "dev": true,
      "dependencies": {
        "@lumino/coreutils": "^1.11.0"
      }
    },
    "node_modules/@lumino/coreutils": {
      "version": "1.12.0",
      "resolved": "https://registry.npmjs.org/@lumino/coreutils/-/coreutils-1.12.0.tgz",
      "integrity": "sha512-DSglh4ylmLi820CNx9soJmDJCpUgymckdWeGWuN0Ash5g60oQvrQDfosVxEhzmNvtvXv45WZEqSBzDP6E5SEmQ==",
      "dev": true,
      "peerDependencies": {
        "crypto": "1.0.1"
      }
    },
    "node_modules/@types/linkify-it": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/linkify-it/-/linkify-it-3.0.2.tgz",
      "integrity": "sha512-HZQYqbiFVWufzCwexrvh694SOim8z2d+xJl5UNamcvQFejLY/2YUtzXHYi3cHdI7PMlS8ejH2slRAOJQ32aNbA==",
      "dev": true
    },
    "node_modules/@types/markdown-it": {
      "version": "12.2.3",
      "resolved": "https://registry.npmjs.org/@types/markdown-it/-/markdown-it-12.2.3.tgz",
      "integrity": "sha512-GKMHFfv3458yYy+v/N8gjufHO6MSZKCOXpZc5GXIWWy8uldwfmPn98vp81gZ5f9SVw8YYBctgfJ22a2d7AOMeQ==",
      "dev": true,
      "dependencies": {
        "@types/linkify-it": "*",
        "@types/mdurl": "*"
      }
    },
    "node_modules/@types/mdurl": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/@types/mdurl/-/mdurl-1.0.2.tgz",
      "integrity": "sha512-eC4U9MlIcu2q0KQmXszyn5Akca/0jrQmwDRgpAMJai7qBWq4amIQhZyNau4VYGtCeALvW1/NtjzJJ567aZxfKA==",
      "dev": true
    },
    "node_modules/@types/node": {
      "version": "22.18.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.18.10.tgz",
      "integrity": "sha512-anNG/V/Efn/YZY4pRzbACnKxNKoBng2VTFydVu8RRs5hQjikP8CQfaeAV59VFSCzKNp90mXiVXW2QzV56rwMrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/detect-indent": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/detect-indent/-/detect-indent-6.1.0.tgz",
      "integrity": "sha512-reYkTUJAZb9gUuZ2RvVCNhVHdg62RHnJ7WJl8ftMi4diZ6NWlciOzQN88pUhSELEwflJht4oQDv0F0BMlwaYtA==",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/package.json]---
Location: vscode-main/extensions/ipynb/package.json

```json
{
  "name": "ipynb",
  "displayName": "%displayName%",
  "description": "%description%",
  "publisher": "vscode",
  "version": "1.0.0",
  "license": "MIT",
  "icon": "media/icon.png",
  "engines": {
    "vscode": "^1.57.0"
  },
  "enabledApiProposals": [
    "diffContentOptions"
  ],
  "activationEvents": [
    "onNotebook:jupyter-notebook",
    "onNotebookSerializer:interactive",
    "onNotebookSerializer:repl"
  ],
  "extensionKind": [
    "workspace",
    "ui"
  ],
  "main": "./out/ipynbMain.node.js",
  "browser": "./dist/browser/ipynbMain.browser.js",
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "contributes": {
    "configuration": [
      {
        "properties": {
          "ipynb.pasteImagesAsAttachments.enabled": {
            "type": "boolean",
            "scope": "resource",
            "markdownDescription": "%ipynb.pasteImagesAsAttachments.enabled%",
            "default": true
          },
          "ipynb.experimental.serialization": {
            "type": "boolean",
            "scope": "resource",
            "markdownDescription": "%ipynb.experimental.serialization%",
            "default": true,
            "tags": [
              "experimental"
            ]
          }
        }
      }
    ],
    "commands": [
      {
        "command": "ipynb.newUntitledIpynb",
        "title": "%newUntitledIpynb.title%",
        "shortTitle": "%newUntitledIpynb.shortTitle%",
        "category": "Create"
      },
      {
        "command": "ipynb.openIpynbInNotebookEditor",
        "title": "%openIpynbInNotebookEditor.title%"
      },
      {
        "command": "ipynb.cleanInvalidImageAttachment",
        "title": "%cleanInvalidImageAttachment.title%"
      },
      {
        "command": "notebook.cellOutput.copy",
        "title": "%copyCellOutput.title%",
        "category": "Notebook"
      },
      {
        "command": "notebook.cellOutput.addToChat",
        "title": "%addCellOutputToChat.title%",
        "category": "Notebook",
        "enablement": "chatIsEnabled"
      },
      {
        "command": "notebook.cellOutput.openInTextEditor",
        "title": "%openCellOutput.title%",
        "category": "Notebook"
      }
    ],
    "notebooks": [
      {
        "type": "jupyter-notebook",
        "displayName": "Jupyter Notebook",
        "selector": [
          {
            "filenamePattern": "*.ipynb"
          }
        ],
        "priority": "default"
      }
    ],
    "notebookRenderer": [
      {
        "id": "vscode.markdown-it-cell-attachment-renderer",
        "displayName": "%markdownAttachmentRenderer.displayName%",
        "entrypoint": {
          "extends": "vscode.markdown-it-renderer",
          "path": "./notebook-out/cellAttachmentRenderer.js"
        }
      }
    ],
    "menus": {
      "file/newFile": [
        {
          "command": "ipynb.newUntitledIpynb",
          "group": "notebook"
        }
      ],
      "commandPalette": [
        {
          "command": "ipynb.newUntitledIpynb"
        },
        {
          "command": "ipynb.openIpynbInNotebookEditor",
          "when": "false"
        },
        {
          "command": "ipynb.cleanInvalidImageAttachment",
          "when": "false"
        },
        {
          "command": "notebook.cellOutput.copy",
          "when": "notebookCellHasOutputs"
        },
        {
          "command": "notebook.cellOutput.openInTextEditor",
          "when": "false"
        }
      ],
      "webview/context": [
        {
          "command": "notebook.cellOutput.copy",
          "when": "webviewId == 'notebook.output' && webviewSection == 'image'",
          "group": "context@1"
        },
        {
          "command": "notebook.cellOutput.copy",
          "when": "webviewId == 'notebook.output' && webviewSection == 'text'"
        },
        {
          "command": "notebook.cellOutput.addToChat",
          "when": "webviewId == 'notebook.output' && (webviewSection == 'text' || webviewSection == 'image')",
          "group": "context@2"
        },
        {
          "command": "notebook.cellOutput.openInTextEditor",
          "when": "webviewId == 'notebook.output' && webviewSection == 'text'"
        }
      ]
    }
  },
  "scripts": {
    "compile": "npx gulp compile-extension:ipynb && npm run build-notebook",
    "watch": "npx gulp watch-extension:ipynb",
    "build-notebook": "node ./esbuild.mjs"
  },
  "dependencies": {
    "@enonic/fnv-plus": "^1.3.0",
    "detect-indent": "^6.0.0"
  },
  "devDependencies": {
    "@jupyterlab/nbformat": "^3.2.9",
    "@types/markdown-it": "12.2.3",
    "@types/node": "^22.18.10"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/package.nls.json]---
Location: vscode-main/extensions/ipynb/package.nls.json

```json
{
	"displayName": ".ipynb Support",
	"description": "Provides basic support for opening and reading Jupyter's .ipynb notebook files",
	"ipynb.pasteImagesAsAttachments.enabled": "Enable/disable pasting of images into Markdown cells in ipynb notebook files. Pasted images are inserted as attachments to the cell.",
	"ipynb.experimental.serialization": "Experimental feature to serialize the Jupyter notebook in a worker thread.",
	"newUntitledIpynb.title": "New Jupyter Notebook",
	"newUntitledIpynb.shortTitle": "Jupyter Notebook",
	"openIpynbInNotebookEditor.title": "Open IPYNB File In Notebook Editor",
	"cleanInvalidImageAttachment.title": "Clean Invalid Image Attachment Reference",
	"copyCellOutput.title": "Copy Cell Output",
	"addCellOutputToChat.title": "Add Cell Output to Chat",
	"openCellOutput.title": "Open Cell Output in Text Editor",
	"markdownAttachmentRenderer.displayName": {
		"message": "Markdown-It ipynb Cell Attachment renderer",
		"comment": [
			"Markdown-It is a product name and should not be translated"
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/README.md]---
Location: vscode-main/extensions/ipynb/README.md

```markdown
# Jupyter for Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

This extension provides the following Jupyter-related features for VS Code:

- Open, edit and save .ipynb files
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/tsconfig.json]---
Location: vscode-main/extensions/ipynb/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"lib": [
			"ES2024",
			"DOM"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/.vscode/launch.json]---
Location: vscode-main/extensions/ipynb/.vscode/launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}"
            ],
            "name": "Launch Extension",
            "outFiles": [
                "${workspaceFolder}/out/**/*.js"
            ],
            "request": "launch",
            "type": "extensionHost"
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/notebook-src/cellAttachmentRenderer.ts]---
Location: vscode-main/extensions/ipynb/notebook-src/cellAttachmentRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as MarkdownIt from 'markdown-it';
import type * as MarkdownItToken from 'markdown-it/lib/token';
import type { RendererContext } from 'vscode-notebook-renderer';

interface MarkdownItRenderer {
	extendMarkdownIt(fn: (md: MarkdownIt) => void): void;
}

export async function activate(ctx: RendererContext<void>) {
	const markdownItRenderer = (await ctx.getRenderer('vscode.markdown-it-renderer')) as MarkdownItRenderer | any;
	if (!markdownItRenderer) {
		throw new Error(`Could not load 'vscode.markdown-it-renderer'`);
	}

	markdownItRenderer.extendMarkdownIt((md: MarkdownIt) => {
		const original = md.renderer.rules.image;
		md.renderer.rules.image = (tokens: MarkdownItToken[], idx: number, options, env, self) => {
			const token = tokens[idx];
			const src = token.attrGet('src');
			const attachments: Record<string, Record<string, string>> | undefined = env.outputItem.metadata?.attachments;
			if (attachments && src && src.startsWith('attachment:')) {
				const imageAttachment = attachments[tryDecodeURIComponent(src.replace('attachment:', ''))];
				if (imageAttachment) {
					// objEntries will always be length 1, with objEntries[0] holding [0]=mime,[1]=b64
					// if length = 0, something is wrong with the attachment, mime/b64 weren't copied over
					const objEntries = Object.entries(imageAttachment);
					if (objEntries.length) {
						const [attachmentKey, attachmentVal] = objEntries[0];
						const b64Markdown = 'data:' + attachmentKey + ';base64,' + attachmentVal;
						token.attrSet('src', b64Markdown);
					}
				}
			}

			if (original) {
				return original(tokens, idx, options, env, self);
			} else {
				return self.renderToken(tokens, idx, options);
			}
		};
	});
}

function tryDecodeURIComponent(uri: string) {
	try {
		return decodeURIComponent(uri);
	} catch {
		return uri;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/common.ts]---
Location: vscode-main/extensions/ipynb/src/common.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as nbformat from '@jupyterlab/nbformat';

/**
 * Metadata we store in VS Code cell output items.
 * This contains the original metadata from the Jupyter outputs.
 */
export interface CellOutputMetadata {
	/**
	 * Cell output metadata.
	 */
	metadata?: any;

	/**
	 * Transient data from Jupyter.
	 */
	transient?: {
		/**
		 * This is used for updating the output in other cells.
		 * We don't know of other properties, but this is definitely used.
		 */
		display_id?: string;
	} & any;

	/**
	 * Original cell output type
	 */
	outputType: nbformat.OutputType | string;

	executionCount?: nbformat.IExecuteResult['ExecutionCount'];

	/**
	 * Whether the original Mime data is JSON or not.
	 * This properly only exists in metadata for NotebookCellOutputItems
	 * (this is something we have added)
	 */
	__isJson?: boolean;
}


/**
 * Metadata we store in VS Code cells.
 * This contains the original metadata from the Jupyter cells.
 */
export interface CellMetadata {
	/**
	 * Cell id for notebooks created with the new 4.5 version of nbformat.
	*/
	id?: string;
	/**
	 * Stores attachments for cells.
	 */
	attachments?: nbformat.IAttachments;
	/**
	 * Stores cell metadata.
	 */
	metadata?: Partial<nbformat.ICellMetadata> & { vscode?: { languageId?: string } };
	/**
	 * The code cell's prompt number. Will be null if the cell has not been run.
	 */
	execution_count?: number | null;
}



type KeysOfUnionType<T> = T extends T ? keyof T : never;
type FilterType<T, TTest> = T extends TTest ? T : never;
type MakeOptionalAndBool<T extends object> = { [K in keyof T]?: boolean };

/**
 * Type guard that checks if an object has specific keys and narrows the type accordingly.
 *
 * @param x - The object to check
 * @param key - An object with boolean values indicating which keys to check for
 * @returns true if all specified keys exist in the object, false otherwise
 *
 * @example
 * ```typescript
 * type A = { a: string };
 * type B = { b: number };
 * const obj: A | B = getObject();
 *
 * if (hasKey(obj, { a: true })) {
 *   // obj is now narrowed to type A
 *   console.log(obj.a);
 * }
 * ```
 */
export function hasKey<T extends object, TKeys>(x: T, key: TKeys & MakeOptionalAndBool<T>): x is FilterType<T, { [K in KeysOfUnionType<T> & keyof TKeys]: unknown }> {
	for (const k in key) {
		if (!(k in x)) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/ipynb/src/constants.ts]---
Location: vscode-main/extensions/ipynb/src/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { DocumentSelector } from 'vscode';

export const defaultNotebookFormat = { major: 4, minor: 5 };
export const ATTACHMENT_CLEANUP_COMMANDID = 'ipynb.cleanInvalidImageAttachment';

export const JUPYTER_NOTEBOOK_MARKDOWN_SELECTOR: DocumentSelector = { notebookType: 'jupyter-notebook', language: 'markdown' };

// Copied from NotebookCellKind.Markup as we cannot import it from vscode directly in worker threads.
export const NotebookCellKindMarkup = 1;
// Copied from NotebookCellKind.Code as we cannot import it from vscode directly in worker threads.
export const NotebookCellKindCode = 2;

export enum CellOutputMimeTypes {
	error = 'application/vnd.code.notebook.error',
	stderr = 'application/vnd.code.notebook.stderr',
	stdout = 'application/vnd.code.notebook.stdout'
}

export const textMimeTypes = ['text/plain', 'text/markdown', 'text/latex', CellOutputMimeTypes.stderr, CellOutputMimeTypes.stdout];
```

--------------------------------------------------------------------------------

````
